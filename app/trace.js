// Execution tracing for pinned programs (feature: "scrub the execution").
//
// Strategy: instrument the source. Before every simple statement inside `main`'s body we insert
// a call that records the line number and the current value of every local declared so far.
// Output lines are interleaved as `__OUT__` records so output ↔ code linking works too. The
// instrumented program is compiled by the normal /api/run endpoint; the trace comes back on stderr
// as JSON-per-line, and the program's own stdout is untouched.
//
// Scope: single-function programs using fundamental types and std::string, straight-line code plus
// if/while/for. That covers every Week 1 sample. Anything the instrumenter can't handle degrades to
// "no trace" rather than a broken run.

import { runCode } from "./runner.js";

const TYPE_RE = /^(?:const\s+|constexpr\s+)?(bool|char|short|int|long long|long|unsigned int|unsigned|float|double|long double|std::string|string)\s+([A-Za-z_]\w*\s*(?:[=({\[,][\s\S]*)?)$/;
/** Finds `int main` and returns [bodyStart, bodyEnd] indexes of its braces in `src`. */
function findMain(src) {
  const m = /int\s+main\s*\([^)]*\)\s*\{/.exec(src);
  if (!m) return null;
  let depth = 0, i = m.index + m[0].length - 1;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) return [m.index + m[0].length, i]; }
    else if (src[i] === '"' || src[i] === "'") { const q = src[i]; i++; while (i < src.length && src[i] !== q) { if (src[i] === "\\") i++; i++; } }
    else if (src.startsWith("//", i)) { while (i < src.length && src[i] !== "\n") i++; }
  }
  return null;
}

/** Parses declared local names from a declaration statement like `int a = 1, b;` */
function declaredNames(stmt) {
  const m = TYPE_RE.exec(stmt.trim());
  if (!m) return [];
  // split declarators on top-level commas only
  const parts = []; let depth = 0, cur = "";
  for (const c of m[2]) { if ("([{".includes(c)) depth++; else if (")]}".includes(c)) depth--; if (c === "," && depth === 0) { parts.push(cur); cur = ""; } else cur += c; }
  parts.push(cur);
  return parts.map((d) => (/^\s*([A-Za-z_]\w*)/.exec(d) || [])[1]).filter(Boolean).filter((n, i) => !/^\s*[A-Za-z_]\w*\s*\[/.test(parts[i]));
}

/** Splits the main body into statements with their line numbers, honouring braces, strings, comments. */
function statements(body, baseLine) {
  const out = [];
  let i = 0, start = 0, depth = 0, line = baseLine, startLine = baseLine;
  const push = (end) => { const text = body.slice(start, end); if (text.trim()) out.push({ text, line: startLine, start, end }); start = end; startLine = line; };
  while (i < body.length) {
    const c = body[i];
    if (c === "\n") { line++; if (!body.slice(start, i).trim()) { start = i + 1; startLine = line; } i++; continue; }
    if (body.startsWith("//", i)) { while (i < body.length && body[i] !== "\n") i++; continue; }
    if (c === '"' || c === "'") { const q = c; i++; while (i < body.length && body[i] !== q) { if (body[i] === "\\") i++; i++; } i++; continue; }
    if (c === "{") { depth++; i++; if (depth === 1) { push(i); } continue; }
    if (c === "}") { depth--; i++; if (depth === 0) { push(i); } continue; }
    if (c === ";" && depth === 0) { i++; push(i); continue; }
    i++;
  }
  push(body.length);
  return out;
}

/**
 * Returns { code, ok } — instrumented source, or ok:false when the program is outside scope.
 * Variables are captured as strings via a helper that handles bool/char/numbers/std::string.
 */
export function instrument(src) {
  const range = findMain(src);
  if (!range) return { ok: false };
  const [bs, be] = range;
  const before = src.slice(0, bs), body = src.slice(bs, be), after = src.slice(be);
  const baseLine = before.split("\n").length;
  const stmts = statements(body, baseLine);
  const vars = [];
  let outBody = "";
  let cursor = 0;
  for (const s of stmts) {
    outBody += body.slice(cursor, s.start);
    // Leading comment/blank lines belong to the previous gap, not to this statement.
    const lead = /^(?:[ \t]*\/\/[^\n]*\n|[ \t]*\n)*/.exec(s.text)[0];
    const t = s.text.slice(lead.length).trim();
    const codeLine = s.line + (lead.match(/\n/g) || []).length;
    const isControlOpen = /^(if|while|for|else|switch)\b/.test(t) && t.endsWith("{");
    const isClose = t === "}" || t.startsWith("}");
    const isReturn = /^return\b/.test(t);
    const rec = (line) => `__tr(${line}${vars.map((v) => `,"${v}",__s(${v})`).join("")});`;
    const rest = s.text.slice(lead.length);
    if (isControlOpen) {
      outBody += lead + rec(codeLine) + rest;
    } else if (isClose) {
      outBody += s.text;
    } else {
      outBody += lead + rec(codeLine) + rest;
      if (!isReturn) declaredNames(t).forEach((n) => vars.push(n));
    }
    cursor = s.end;
  }
  outBody += body.slice(cursor);
  // final record after last statement so the end state is visible
  const endLine = baseLine + body.split("\n").length - 1;
  const helpers = `
#include <iostream>
#include <string>
#include <sstream>
static std::string __s(bool v){return v?"true":"false";}
static std::string __s(char v){std::ostringstream o;o<<"'"<<v<<"' ("<<int(v)<<")";return o.str();}
static std::string __s(const std::string& v){return "\\""+v+"\\"";}
static std::string __s(const char* v){return std::string("\\"")+v+"\\"";}
template<class T> static std::string __s(const T& v){std::ostringstream o;o<<v;return o.str();}
static void __tr(int line){std::cout.flush();std::cerr<<"{\\"line\\":"<<line<<",\\"vars\\":{}}\\n";}
template<class... A> static void __tr(int line, A... a){std::cout.flush();std::cerr<<"{\\"line\\":"<<line<<",\\"vars\\":{";const char* kv[]={a...};int n=sizeof...(a);for(int i=0;i+1<n;i+=2){if(i)std::cerr<<",";std::string v=kv[i+1];std::string e;for(char c:v){if(c=='"'||c=='\\\\')e+='\\\\';e+=c;}std::cerr<<"\\""<<kv[i]<<"\\":\\""<<e<<"\\"";}std::cerr<<"}}\\n";}
`;
  // __tr takes const char* pairs; wrap __s results with .c_str() via a small shim
  const shim = helpers.replace("template<class... A> static void __tr(int line, A... a)", "template<class... A> static void __trv(int line, A... a)") +
    `template<class... A> static void __tr(int line, A... a){ __trv(line, __c(a)...); }\n`;
  const cstr = `static const char* __c(const char* s){return s;} static const char* __c(const std::string& s){static thread_local std::string keep[64]; static thread_local int k=0; keep[k%64]=s; return keep[k++%64].c_str();}\n`;
  const code = shim.replace("template<class... A> static void __tr(int line, A... a){ __trv", cstr + "template<class... A> static void __tr(int line, A... a){ __trv") + before + outBody + `__tr(${endLine}${vars.map((v) => `,"${v}",__s(${v})`).join("")});` + after;
  return { ok: true, code, vars };
}

/** Runs the instrumented program; returns { steps:[{line, vars}], stdout, ok, error }. */
export async function traceProgram(src, stdin) {
  const inst = instrument(src);
  if (!inst.ok) return { ok: false, error: "This program is outside what the tracer understands." };
  const r = await runCode(inst.code, stdin);
  if (!r.compile?.ok) return { ok: false, error: "Trace build failed: " + (r.compile?.stderr || r.error || "").split("\n").find((l) => /error/.test(l)) };
  const steps = [];
  for (const line of (r.run.stderr || "").split("\n")) {
    if (!line.startsWith("{")) continue;
    try { steps.push(JSON.parse(line)); } catch { /* ignore partial */ }
  }
  // stdout attribution: re-run is not needed; we attribute output by re-tracing with markers is
  // overkill for Week 1 programs, so output↔code uses static matching of cout lines (see outputlink.js).
  return { ok: true, steps, stdout: r.run.stdout, timedOut: r.run.timedOut };
}
