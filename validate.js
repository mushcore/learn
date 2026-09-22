// Validates lesson markdown files: fence syntax, JSON blocks, widget names,
// quiz schema, and (optionally) compiles every ```cpp run / challenge through the server.
// Usage: bun validate.js [--no-compile] <file.md | dir> ...
const fs = require("node:fs");
const path = require("node:path");

const WIDGETS = new Set([
  "compile-pipeline", "type-sizes", "init-forms", "expr-stepper", "int-division", "cin-sim", "manipulators", "bitwise", "namespaces",
  "stat-calc", "stat-bars", "normal-curve", "chebyshev", "boxplot", "scatter-corr", "grouped-mean", "skewness", "proportion", "drag-data",
  "topology", "sine-wave", "freq-period", "composite", "encapsulation", "signal-levels",
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
    if (i >= lines.length) out.push({ info: m[1], rest: m[2], line: start, body: body.join("\n"), unterminated: true });
    else out.push({ info: m[1], rest: m[2], line: start, body: body.join("\n") });
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
    } else errors.push(`${where} unknown type ${type}`);
  });
}

(async () => {
  const files = targets.flatMap(collect);
  let errors = [];
  let compiled = 0, blocks = 0;
  for (const file of files) {
    const md = fs.readFileSync(file, "utf8");
    if (!/^---\ntitle:/.test(md)) errors.push(`${file}: missing front matter (--- title: ... ---)`);
    for (const f of fences(md)) {
      blocks++;
      if (f.unterminated) { errors.push(`${file}:${f.line} unterminated fence`); continue; }
      try {
        if (f.info === "quiz") checkQuiz(JSON.parse(f.body), file, f.line, errors);
        else if (f.info === "cpp" && /^(run\s+)?pin\b/.test(f.rest.trim())) {
          // A pin is only useful if the prose that follows (to the next ## heading) quotes lines from it.
          const norm = (s) => s.replace(/\s+/g, " ").trim();
          const pinLines = f.body.replace(/^\/\/\s*(stdin|predict):.*\n?/gm, "").split("\n").map(norm).filter(Boolean);
          const all = md.replace(/\r\n/g, "\n").split("\n");
          const before = all.slice(0, f.line - 1);
          const openLevel = [...before].reverse().map((l) => /^(#{2,4})\s/.exec(l)).find(Boolean)?.[1].length || 2;
          const after = all.slice(f.line + f.body.split("\n").length + 1);
          const end = after.findIndex((l) => { const m = /^(#{2,4})\s/.exec(l); return m && m[1].length <= openLevel; });
          const prose = (end < 0 ? after : after.slice(0, end)).join("\n").replace(/```[\s\S]*?```/g, "");
          const spans = [...prose.matchAll(/`([^`\n]+)`/g)].map((m) => norm(m[1])).filter((s) => s.length >= 2);
          const linked = spans.filter((s) => { const hits = pinLines.filter((l) => l.includes(s)).length; return hits > 0 && hits <= Math.max(3, pinLines.length / 2); });
          if (linked.length < 2) errors.push(`${file}:${f.line} cpp pin block has ${linked.length} linkable reference(s) in the section that follows; quote the lines you explain in backticks, verbatim`);
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
          if (!noCompile && c.solution) {
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
  console.log(`${files.length} files, ${blocks} fenced blocks, ${compiled} compiled`);
  if (errors.length) { console.log(errors.join("\n\n")); process.exit(1); }
  console.log("OK");
})();
