// Static file server + C++ runner. Works under `bun server.js` or `node server.js`.
// POST /api/run {code, stdin} -> {compiler, compile:{ok, stderr}, run:{stdout, stderr, code, timedOut}}
// Uses a local g++/clang++ if one can be found, otherwise proxies to wandbox.org.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { execFileSync, execFile } = require("node:child_process");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4321);
const RUN_TIMEOUT_MS = 5000;
const MAX_OUTPUT = 64 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

// ---------- compiler discovery ----------
const CANDIDATE_PATHS = [
  process.env.LEARN_CXX,
  "C:/Program Files/JetBrains/CLion 2025.2.1/bin/mingw/bin/g++.exe",
  "C:/msys64/mingw64/bin/g++.exe",
  "C:/msys64/ucrt64/bin/g++.exe",
  "C:/mingw64/bin/g++.exe",
  "C:/Program Files/LLVM/bin/clang++.exe",
  "/usr/bin/g++",
  "/usr/local/bin/g++",
  "/opt/homebrew/bin/g++-15",
  "/opt/homebrew/bin/g++-14",
].filter(Boolean);

function globCLion() {
  // CLion bundles MinGW under "CLion <version>/bin/mingw/bin".
  const roots = ["C:/Program Files/JetBrains", path.join(os.homedir(), "AppData/Local/Programs")];
  const out = [];
  for (const root of roots) {
    let entries = [];
    try { entries = fs.readdirSync(root); } catch { continue; }
    for (const e of entries) {
      if (!/^CLion/i.test(e)) continue;
      const p = path.join(root, e, "bin/mingw/bin/g++.exe");
      if (fs.existsSync(p)) out.push(p);
    }
  }
  return out.sort().reverse();
}

function onPath(name) {
  try {
    const cmd = process.platform === "win32" ? "where" : "which";
    const res = execFileSync(cmd, [name], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const first = res.split(/\r?\n/).find(Boolean);
    return first && fs.existsSync(first) ? first : null;
  } catch { return null; }
}

let COMPILER; // undefined = not probed yet, null = none
function findCompiler() {
  if (COMPILER !== undefined) return COMPILER;
  COMPILER = onPath("g++") || onPath("clang++") || null;
  if (!COMPILER) {
    for (const p of [...CANDIDATE_PATHS, ...globCLion()]) {
      if (fs.existsSync(p)) { COMPILER = p; break; }
    }
  }
  console.log(COMPILER ? `compiler: ${COMPILER}` : "compiler: none found, using wandbox.org fallback");
  return COMPILER;
}

// ---------- run helpers ----------
function exec(file, args, opts) {
  return new Promise((resolve) => {
    const child = execFile(file, args, { ...opts, encoding: "utf8", maxBuffer: MAX_OUTPUT * 4 }, (err, stdout, stderr) => {
      resolve({
        code: err ? (typeof err.code === "number" ? err.code : (err.killed ? null : 1)) : 0,
        signal: err ? err.signal : null,
        killed: !!(err && err.killed),
        stdout: (stdout || "").slice(0, MAX_OUTPUT),
        stderr: (stderr || "").slice(0, MAX_OUTPUT),
      });
    });
    if (opts && opts.input != null) {
      child.stdin.on("error", () => {});
      child.stdin.end(opts.input);
    }
  });
}

async function runLocal(compiler, code, stdin) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "learn-cpp-"));
  const src = path.join(dir, "main.cpp");
  const exe = path.join(dir, process.platform === "win32" ? "main.exe" : "main");
  fs.writeFileSync(src, code);
  // MinGW: cc1plus.exe and the produced executables need the compiler's bin dir on PATH
  // (DLLs like libgcc/libstdc++/libgmp). Without it cc1plus exits silently with code 53.
  const env = { ...process.env, PATH: `${path.dirname(compiler)}${path.delimiter}${process.env.PATH || ""}` };
  try {
    const compile = await exec(compiler, ["-std=c++20", "-Wall", "-Wextra", "-pedantic", "-O0", "main.cpp", "-o", exe], { cwd: dir, timeout: 30000, env });
    if (compile.code !== 0) {
      return { compiler: path.basename(compiler), compile: { ok: false, stderr: cleanPaths(compile.stderr, src) || `compiler exited with code ${compile.code} and no output` }, run: null };
    }
    const run = await exec(exe, [], { cwd: dir, timeout: RUN_TIMEOUT_MS, input: stdin || "", env });
    run.stdout = run.stdout.replace(/\r\n/g, "\n");
    run.stderr = run.stderr.replace(/\r\n/g, "\n");
    return {
      compiler: path.basename(compiler),
      compile: { ok: true, stderr: cleanPaths(compile.stderr, src) },
      run: { stdout: run.stdout, stderr: run.stderr, code: run.code, timedOut: run.killed },
    };
  } finally {
    fs.rm(dir, { recursive: true, force: true }, () => {});
  }
}

function cleanPaths(text, src) {
  return text.split(src).join("main.cpp");
}

async function runWandbox(code, stdin) {
  const res = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ compiler: "gcc-head", code, stdin: stdin || "", options: "warning,c++2a", "compiler-option-raw": "-Wall\n-Wextra\n-pedantic" }),
  });
  if (!res.ok) throw new Error(`wandbox HTTP ${res.status}`);
  const j = await res.json();
  const compileErr = j.compiler_error || "";
  const ok = !compileErr.includes("error:");
  return {
    compiler: "wandbox gcc-head",
    compile: { ok, stderr: compileErr },
    run: ok ? { stdout: j.program_output || "", stderr: j.program_error || "", code: Number(j.status ?? 0), timedOut: !!j.signal } : null,
  };
}

// ---------- unique visitor counter ----------
// The durable count lives at hits.sh, a free hit counter keyed by a URL-like name: fetching the
// badge SVG counts one hit and reports the total, while /api/urns/<key> reads the total without
// counting. The browser registers once per device (an id kept in localStorage), and the server
// fetches the badge once per new id, so hits == unique visitors. data/visitors.json mirrors the
// number and the ids seen, so the badge keeps working when hits.sh is unreachable (and locally).
const VISITOR_KEY = process.env.VISITOR_KEY || "github.com/mushcore/learn/unique-visitors";
const DATA_DIR = path.join(ROOT, "data");
const VISITOR_FILE = path.join(DATA_DIR, "visitors.json");
let visitorCache = null; // { count, at }

function readLocalVisitors() {
  try { return JSON.parse(fs.readFileSync(VISITOR_FILE, "utf8")); } catch { return { count: 0, ids: [] }; }
}
function writeLocalVisitors(obj) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(VISITOR_FILE, JSON.stringify(obj)); } catch {}
}
async function remoteVisitorTotal() {
  const r = await fetch(`https://hits.sh/api/urns/${VISITOR_KEY}`, { signal: AbortSignal.timeout(6000) });
  if (r.status === 404) return 0; // key not created yet: nobody has been counted
  if (!r.ok) throw new Error(`hits.sh ${r.status}`);
  return Number((await r.json()).total) || 0;
}
async function remoteVisitorHit() {
  const r = await fetch(`https://hits.sh/${VISITOR_KEY}.svg?view=total`, { signal: AbortSignal.timeout(6000) });
  if (!r.ok) throw new Error(`hits.sh ${r.status}`);
  const m = /hits: (\d+)/.exec(await r.text());
  if (!m) throw new Error("hits.sh: no count in the badge");
  return Number(m[1]);
}
async function visitorCount() {
  if (visitorCache && Date.now() - visitorCache.at < 60_000) return visitorCache.count;
  const local = readLocalVisitors();
  try {
    const count = Math.max(await remoteVisitorTotal(), local.count || 0);
    visitorCache = { count, at: Date.now() };
    if (count !== local.count) writeLocalVisitors({ ...local, count });
    return count;
  } catch {
    return local.count || 0;
  }
}
async function registerVisitor(id) {
  const local = readLocalVisitors();
  const ids = new Set(local.ids || []);
  if (id && ids.has(id)) return visitorCount(); // this device was already counted by this server
  if (id) { ids.add(id); while (ids.size > 5000) ids.delete(ids.values().next().value); }
  let count;
  try { count = await remoteVisitorHit(); } catch { count = (local.count || 0) + 1; }
  count = Math.max(count, (local.count || 0) + 1);
  writeLocalVisitors({ count, ids: [...ids] });
  visitorCache = { count, at: Date.now() };
  return count;
}

// ---------- http ----------
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res, status, obj) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/health") {
    return json(res, 200, { compiler: findCompiler() || "wandbox"});
  }
  if (url.pathname === "/api/visitors") {
    try {
      if (req.method === "POST") {
        let body = {};
        try { body = JSON.parse(await readBody(req)); } catch {}
        const id = typeof body.id === "string" ? body.id.slice(0, 64) : "";
        return json(res, 200, { count: await registerVisitor(id) });
      }
      return json(res, 200, { count: await visitorCount() });
    } catch (e) {
      return json(res, 500, { error: String(e && e.message || e) });
    }
  }
  if (url.pathname === "/api/run" && req.method === "POST") {
    let body;
    try { body = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: "bad json" }); }
    if (typeof body.code !== "string") return json(res, 400, { error: "code required" });
    try {
      const compiler = findCompiler();
      const result = compiler ? await runLocal(compiler, body.code, body.stdin) : await runWandbox(body.code, body.stdin);
      return json(res, 200, result);
    } catch (e) {
      return json(res, 500, { error: String(e && e.message || e) });
    }
  }
  // static
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/index.html";
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("not found");
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  findCompiler();
  console.log(`learn: http://localhost:${PORT}`);
});
