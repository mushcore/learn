// Validates lesson markdown files: fence syntax, JSON blocks, widget names, quiz schema,
// diagram specs, pin references, and (unless --no-compile) compiles every ```cpp run /
// challenge through the server and runs every DOM-free ```js run block under Bun
// (tools/js-harness.js), comparing it with the ```output block that follows.
// Usage: bun validate.js [--no-compile] <file.md | dir> ...
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const { parseDirectives, outputsMatch, normalizeOutput } = require("./app/jsformat.js");
const { diagramProblems } = require("./app/diagram.js");

const WIDGETS = new Set([
  "compile-pipeline", "type-sizes", "init-forms", "expr-stepper", "int-division", "cin-sim", "manipulators", "bitwise", "namespaces",
  "stat-calc", "stat-bars", "normal-curve", "chebyshev", "boxplot", "scatter-corr", "grouped-mean", "skewness", "proportion", "drag-data",
  "topology", "sine-wave", "freq-period", "composite", "encapsulation", "signal-levels",
  "cat-charts", "stem-leaf", "hist-builder", "ogive", "group-stats", "freq-hist",
  "pointer-viz", "file-seek", "open-modes", "rand-range", "getline-sim", "vector-viz",
  "op-counter", "loop-grid", "growth-plot", "big-o-check", "fib-race",
  "channel-filter", "decibel", "snr-noise", "data-rate", "bandwidth-delay", "tx-modes",
  "access-matrix", "ctor-picker", "lifetime-trace", "copy-viz", "dispatch-viz", "partitions", "abstract-check", "diamond-viz", "friend-check", "op-dispatch", "copy-swap", "uml-relations",
  "sample-space", "lln-sim", "counting-calc", "prob-rules", "birthday", "two-way", "bayes-tree", "sim-lab",
  "line-code", "line-code-play", "signal-elements", "signal-rate", "baseline-dc", "dc-offset", "clock-drift",
  "sampler", "quantizer", "pcm-calc", "shift-keying", "constellation", "analog-mod",
  "fdm-plan", "tdm-frames", "rate-manager", "hop-walk", "arp-exchange", "mux-link",
  "pmf-table", "binomial-calc", "hyper-vs-binom", "geometric-calc", "poisson-calc", "dist-picker",
  "pdf-area", "z-table", "normal-prob", "exp-wait", "bit-error",
  "catch-matcher", "unwind-stepper", "exception-tree", "coupling-graph", "solid-spotter", "demeter-chain",
  "wave-travel", "pcm-play", "tdm-play", "fib-tree-play", "find-play", "standardize-play", "memoryless-play",
  "container-picker", "iter-walk", "iterator-ops", "swo-checker", "map-insert", "partition-stepper",
  // 2026-10-12 review build: playback animations and movers
  "duplex-play", "bit-stream-play", "forward-play", "harmonic-build-play", "phase-circle-play", "distortion-play",
  "clock-drift-play", "baseline-play", "shift-keying-play", "sampling-play", "fdm-play",
  "sequence-play", "build-play", "vector-grow-play", "seek-play",
  "stem-leaf-play", "ogive-play", "hist-tally-play", "birthday-play", "bayes-flow-play", "perm-fill-play",
  "arrivals-play", "deal-play", "cdf-sweep-play",
  "insertion-play", "pairs-play", "halving-play",
  // COMP 4736 operating systems (widgets-os*.js)
  "pipeline-play", "alu-calc", "cache-map-play", "interrupt-io-play", "rwx-bits", "clock-play", "alarm-list-play",
  "process-states-play", "context-switch-play", "cpu-util", "multiprog-play", "fork-play",
  "thread-models", "syscall-steps-play", "file-links",
  "codeword-lab", "crc-calc", "crc-play", "checksum-calc", "stuffing", "stuff-play", "stop-wait-play", "fsm-explorer", "fec-lab", "interleave-play", "noise-burst", // COMP 3721 Week 7
  "rl-rule-step", "elision-trace", // COMP 3522 Week 7
  // COMP 4537 web development (widgets-web*.js)
  "event-loop-play", "promise-chain-play", "xhr-play", "cors-play", "node-server-play", "scope-hoist", "http-anatomy",
  "storage-sim", "dom-build-play", "db-relate", "css-box", "arch-compare", "sql-order", "specificity-calc",
]);
const SERVER = process.env.LEARN_URL || "http://localhost:4321";
const args = process.argv.slice(2);
const noCompile = args.includes("--no-compile");
const targets = args.filter((a) => !a.startsWith("--"));

function collect(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) return fs.readdirSync(p).flatMap((f) => collect(path.join(p, f)));
  // Skip notes/reference markdown that is not a lesson (leading _ or UPPERCASE name).
  const base = path.basename(p);
  if (!p.endsWith(".md") || base.startsWith("_") || /^[A-Z-]+\.md$/.test(base)) return [];
  return [p];
}

function fences(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^```(\S*)\s*(.*)$/);
    if (!m) continue;
    const start = i + 1;
    const body = [];
    i++;
    while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
    // line: 1-based line of the opening fence; end: 1-based line of the closing fence.
    if (i >= lines.length) out.push({ info: m[1], rest: m[2], line: start, end: i, body: body.join("\n"), unterminated: true });
    else out.push({ info: m[1], rest: m[2], line: start, end: i + 1, body: body.join("\n") });
  }
  return out;
}

async function compile(code, stdin) {
  const r = await fetch(`${SERVER}/api/run`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, stdin: stdin || "" }) });
  return r.json();
}

function checkQuiz(qs, file, line, errors) {
  if (!Array.isArray(qs) || !qs.length) return errors.push(`${file}:${line} quiz must be a non-empty array`);
  qs.forEach((q, i) => {
    const where = `${file}:${line} quiz q${i + 1}`;
    if (!q.q) errors.push(`${where} missing q`);
    if (!q.explain) errors.push(`${where} missing explain`);
    const type = q.type || (Array.isArray(q.answer) ? "multi" : "mcq");
    if (type === "mcq" || type === "multi") {
      if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${where} needs options[]`);
      const idx = Array.isArray(q.answer) ? q.answer : [q.answer];
      for (const a of idx) if (!Number.isInteger(a) || a < 0 || a >= (q.options || []).length) errors.push(`${where} answer index ${a} out of range`);
    } else if (type === "tf") {
      if (typeof q.answer !== "boolean") errors.push(`${where} tf answer must be boolean`);
    } else if (type === "numeric") {
      if (typeof q.answer !== "number") errors.push(`${where} numeric answer must be a number`);
    } else if (type === "text") {
      if (typeof q.answer !== "string" && !Array.isArray(q.answer)) errors.push(`${where} text answer must be string or array`);
    } else if (["fill", "reorder", "spotbug", "match", "shade", "trace"].includes(type)) {
      // interactive plugin types; validated by their own authors' scripts, minimal shape check here
      if (type === "fill" && (!q.code || !q.answer)) errors.push(`${where} fill needs code and answer`);
      if (type === "reorder" && !Array.isArray(q.lines)) errors.push(`${where} reorder needs lines[]`);
      if (type === "spotbug" && (!q.code || q.answer == null)) errors.push(`${where} spotbug needs code and answer (line number)`);
      if (type === "match" && (!Array.isArray(q.pairs) || q.pairs.length < 2)) errors.push(`${where} match needs pairs[]`);
      if (type === "shade" && (q.mu == null || q.sigma == null || q.answer == null)) errors.push(`${where} shade needs mu, sigma, answer`);
      if (type === "trace" && (!q.code || !Array.isArray(q.steps))) errors.push(`${where} trace needs code and steps[]`);
    } else if (type === "free") {
      if (!q.model) errors.push(`${where} free missing model`);
      if (!Array.isArray(q.points) || !q.points.length) errors.push(`${where} free missing points (non-empty array)`);
      if (q.rows != null && !(Number.isInteger(q.rows) && q.rows >= 2 && q.rows <= 12)) errors.push(`${where} free rows must be an integer 2-12`);
    } else errors.push(`${where} unknown type ${type}`);
  });
}

function checkDiagram(spec, file, line, errors) {
  for (const p of diagramProblems(spec)) errors.push(`${file}:${line} diagram: ${p}`);
}

// A js block that touches the page or the network only runs in the browser sandbox.
// Strings and comments are blanked first, so console.log("open a window") still runs.
const DOM_NAMES = /\b(document|window|self|location|navigator|alert|prompt|XMLHttpRequest|fetch|localStorage|sessionStorage|SERVER|addEventListener)\b/;
const stripStringsAndComments = (code) =>
  code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\$]|\\[\s\S]|\$(?!\{))*`/g, '""');
const DOM_BOUND = { test: (code) => DOM_NAMES.test(stripStringsAndComments(code)) };
const JS_TIMEOUT_MS = 6000;

/** Syntax-check a classic script; returns the error message or null. */
function jsSyntaxError(code) {
  try { new Function(code); return null; } catch (e) { return e instanceof SyntaxError ? e.message : null; }
}

/** Run DOM-free code under tools/js-harness.js. Returns { stdout, uncaught: [lines], timedOut }. */
function runJs(code) {
  const tmp = path.join(os.tmpdir(), `learn-js-${process.pid}-${Math.random().toString(36).slice(2)}.js`);
  fs.writeFileSync(tmp, code);
  try {
    const r = spawnSync("bun", ["run", path.join(__dirname, "tools/js-harness.js"), tmp], { timeout: JS_TIMEOUT_MS, encoding: "utf8" });
    const uncaught = (r.stderr || "").split("\n").filter((l) => l.startsWith("UNCAUGHT ")).map((l) => l.slice(9));
    const other = (r.stderr || "").split("\n").find((l) => l.trim() && !l.startsWith("UNCAUGHT "));
    return { stdout: r.stdout || "", uncaught, timedOut: r.status === null, crash: r.status ? other || `exit ${r.status}` : null };
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

/** The ```output fence right after fence `idx` (only blank lines between), or null. */
function outputAfter(all, list, idx) {
  const f = list[idx], next = list[idx + 1];
  if (!next || next.info !== "output") return null;
  const gap = all.slice(f.end, next.line - 1);
  return gap.every((l) => !l.trim()) ? next : null;
}

/** A pin is only useful if the prose that follows (to the next heading of its level) quotes lines from it. */
function pinReferences(f, md, codeLines) {
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const pinLines = codeLines.split("\n").map(norm).filter(Boolean);
  const all = md.replace(/\r\n/g, "\n").split("\n");
  const before = all.slice(0, f.line - 1);
  const openLevel = [...before].reverse().map((l) => /^(#{2,4})\s/.exec(l)).find(Boolean)?.[1].length || 2;
  const after = all.slice(f.end);
  const end = after.findIndex((l) => { const m = /^(#{2,4})\s/.exec(l); return m && m[1].length <= openLevel; });
  const prose = (end < 0 ? after : after.slice(0, end)).join("\n").replace(/```[\s\S]*?```/g, "");
  const spans = [...prose.matchAll(/`([^`\n]+)`/g)].map((m) => norm(m[1])).filter((s) => s.length >= 2);
  return spans.filter((s) => { const hits = pinLines.filter((l) => l.includes(s)).length; return hits > 0 && hits <= Math.max(3, pinLines.length / 2); }).length;
}

/** Checks for one js/html fence; pushes errors. */
function checkJsBlock(f, list, idx, md, file, errors, ran = { n: 0 }) {
  const where = `${file}:${f.line}`;
  const rest = f.rest.trim();
  const isPin = /^(run\s+)?pin\b/.test(rest);
  const isRun = /^run\b/.test(rest);
  const { code, skip } = parseDirectives(f.body);
  if (isPin) {
    const n = pinReferences(f, md, code);
    if (n < 2) errors.push(`${where} ${f.info} pin block has ${n} linkable reference(s) in the section that follows; quote the lines you explain in backticks, verbatim`);
  }
  if (f.info === "html") {
    const opens = (code.match(/<script\b/gi) || []).length, closes = (code.match(/<\/script>/gi) || []).length;
    if (opens !== closes) errors.push(`${where} html block has ${opens} <script> and ${closes} </script>`);
    return;
  }
  if (!isRun) return;
  const syntax = jsSyntaxError(code);
  if (syntax) return errors.push(`${where} js run block has a syntax error: ${syntax}`);
  if (skip || DOM_BOUND.test(code)) return;
  const out = outputAfter(md.replace(/\r\n/g, "\n").split("\n"), list, idx);
  if (!out && noCompile) return errors.push(`${where} DOM-free js run block needs an \`\`\`output block right after it`);
  if (noCompile) return;
  const r = runJs(code);
  ran.n++;
  if (r.timedOut) return errors.push(`${where} js run block timed out after 6 s (a block meant to run on gets a // validator: skip line)`);
  if (r.crash) return errors.push(`${where} js run block crashed the harness: ${r.crash}`);
  if (!out) {
    if (r.uncaught.length) return errors.push(`${where} js run block threw: ${r.uncaught[0]}`);
    return errors.push(`${where} DOM-free js run block needs an \`\`\`output block right after it; it printed:\n${r.stdout}`);
  }
  if (!outputsMatch(r.stdout, out.body)) {
    errors.push(`${where} js run output != output block\n--- got:\n${normalizeOutput(r.stdout)}\n--- output block:\n${normalizeOutput(out.body)}`);
  }
}

async function main() {
  const files = targets.flatMap(collect);
  let errors = [];
  let compiled = 0, blocks = 0;
  for (const file of files) {
    const md = fs.readFileSync(file, "utf8");
    if (!/^---\ntitle:/.test(md)) errors.push(`${file}: missing front matter (--- title: ... ---)${/\r\n/.test(md) ? "; the file has CRLF line endings, save it with LF" : ""}`);
    const list = fences(md);
    for (const [idx, f] of list.entries()) {
      blocks++;
      if (f.unterminated) { errors.push(`${file}:${f.line} unterminated fence`); continue; }
      try {
        if (f.info === "quiz") checkQuiz(JSON.parse(f.body), file, f.line, errors);
        else if (f.info === "diagram") checkDiagram(JSON.parse(f.body), file, f.line, errors);
        else if (f.info === "js" || f.info === "html") {
          const ran = { n: 0 };
          checkJsBlock(f, list, idx, md, file, errors, ran);
          compiled += ran.n;
        } else if (f.info === "cpp" && /^(run\s+)?pin\b/.test(f.rest.trim())) {
          const n = pinReferences(f, md, f.body.replace(/^\/\/\s*(stdin|predict):.*\n?/gm, ""));
          if (n < 2) errors.push(`${file}:${f.line} cpp pin block has ${n} linkable reference(s) in the section that follows; quote the lines you explain in backticks, verbatim`);
          if (/^run\s/.test(f.rest.trim()) && !noCompile) {
            let code = f.body, stdin = "";
            const m = code.match(/^\/\/\s*stdin:\s*(.*)$/m);
            if (m) { stdin = m[1].replace(/\\n/g, "\n"); }
            code = code.replace(/^\/\/\s*(stdin|predict):.*\n?/gm, "");
            const r = await compile(code, stdin);
            compiled++;
            if (!r.compile?.ok) errors.push(`${file}:${f.line} cpp run pin block does not compile:\n${(r.compile?.stderr || r.error || "").slice(0, 400)}`);
            else if (r.run.timedOut) errors.push(`${file}:${f.line} cpp run pin block timed out (add a // stdin: line)`);
          }
        } else if (f.info === "challenge") {
          const c = JSON.parse(f.body);
          for (const k of ["prompt", "starter", "expected"]) if (c[k] == null) errors.push(`${file}:${f.line} challenge missing ${k}`);
          if (c.lang === "js") {
            const sol = c.solution ? parseDirectives(c.solution).code : "";
            const syntax = sol && jsSyntaxError(sol);
            if (syntax) errors.push(`${file}:${f.line} js challenge solution has a syntax error: ${syntax}`);
            else if (sol && !noCompile && !DOM_BOUND.test(sol)) {
              const r = runJs(sol);
              compiled++;
              if (r.timedOut) errors.push(`${file}:${f.line} js challenge solution timed out after 6 s`);
              else if (r.uncaught.length) errors.push(`${file}:${f.line} js challenge solution threw: ${r.uncaught[0]}`);
              else if (normalizeOutput(r.stdout) !== normalizeOutput(c.expected)) errors.push(`${file}:${f.line} challenge solution output != expected\n--- got:\n${r.stdout}\n--- expected:\n${c.expected}`);
            }
          } else if (!noCompile && c.solution) {
            const r = await compile(c.solution, c.stdin);
            compiled++;
            if (!r.compile?.ok) errors.push(`${file}:${f.line} challenge solution does not compile:\n${(r.compile?.stderr || r.error || "").slice(0, 400)}`);
            else {
              const norm = (s) => String(s).trim().split("\n").map((l) => l.trimEnd()).join("\n");
              if (norm(r.run.stdout) !== norm(c.expected)) errors.push(`${file}:${f.line} challenge solution output != expected\n--- got:\n${r.run.stdout}\n--- expected:\n${c.expected}`);
            }
          }
        } else if (f.info === "widget") {
          const [name, ...rest] = f.body.split("\n");
          if (!WIDGETS.has(name.trim())) errors.push(`${file}:${f.line} unknown widget '${name.trim()}'`);
          const cfg = rest.join("\n").trim();
          if (cfg) JSON.parse(cfg);
        } else if (f.info === "cpp" && f.rest.trim() === "run" && !noCompile) {
          let code = f.body, stdin = "";
          const m = code.match(/^\/\/\s*stdin:\s*(.*)$/m);
          if (m) { stdin = m[1].replace(/\\n/g, "\n"); }
          code = code.replace(/^\/\/\s*(stdin|predict):.*\n?/gm, "");
          const r = await compile(code, stdin);
          compiled++;
          if (!r.compile?.ok) errors.push(`${file}:${f.line} cpp run block does not compile:\n${(r.compile?.stderr || r.error || "").slice(0, 400)}`);
          else if (r.run.timedOut) errors.push(`${file}:${f.line} cpp run block timed out (waiting on cin? add a // stdin: line)`);
        }
      } catch (e) {
        errors.push(`${file}:${f.line} ${f.info} block: ${e.message}`);
      }
    }
  }
  console.log(`${files.length} files, ${blocks} fenced blocks, ${compiled} compiled or run`);
  if (errors.length) { console.log(errors.join("\n\n")); process.exit(1); }
  console.log("OK");
}

module.exports = { checkQuiz, checkDiagram, fences, WIDGETS };
if (require.main === module) main();
