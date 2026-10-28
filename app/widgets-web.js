// COMP 4537 web widgets, part 1: event-loop-play, promise-chain-play, xhr-play, cors-play,
// node-server-play and scope-hoist. Programs, slide wording and error text come from
// spec/comp4537/l1/_SOURCE-NOTES-B.md, l4/_SOURCE-NOTES.md, l5/_SOURCE-NOTES.md and l6/_SOURCE-NOTES.md;
// quiz-shaped presets use new values. Every -play widget draws one frame per onFrame(pos) on the
// shared playback bar (app/playback.js) and never runs a timer of its own.
//
// event-loop-play and promise-chain-play do not eval anything: they parse a small JavaScript subset
// (declarations, functions and arrows, if/else, try/catch, return, throw, calls, + - * / and
// comparisons, template strings) and interpret it with a simulated call stack, microtask queue and
// timer queue, recording one snapshot per event. A program outside the subset is rejected with a
// one-line message.
import { el } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const sty = (e, css) => { e.style.cssText = css; return e; };
const setText = (node, t) => { if (node.textContent !== t) node.textContent = t; };
let uid = 0;

// ---------- shared: one stylesheet for the module ----------
const CSS = `
.wweb-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin: 6px 0; }
.wweb-row label { font-size: 13px; color: var(--ink-dim); }
.wweb-row select, .wweb-row input[type=text] { background: var(--paper); color: var(--ink); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 5px 8px; font-family: var(--mono); font-size: 12.5px; max-width: 100%; min-width: 0; }
.wweb-row select { max-width: 100%; }
.wweb-row input[type=text] { flex: 1 1 180px; }
.wweb-code { width: 100%; box-sizing: border-box; min-height: 160px; background: var(--paper); color: var(--ink); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 8px; font-family: var(--mono); font-size: 12.5px; }
.wweb-err { color: var(--red); font-size: 13px; margin: 6px 0; font-family: var(--mono); overflow-wrap: anywhere; }
.wweb-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 10px; margin: 8px 0; }
@media (max-width: 720px) { .wweb-grid { grid-template-columns: minmax(0, 1fr); } }
.wweb-listing { background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px 0; font-family: var(--mono); font-size: 12px; line-height: 1.5; margin: 0; overflow: hidden; }
.wweb-line { display: flex; gap: 8px; padding: 0 8px; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--ink-2); border-left: 3px solid transparent; }
.wweb-line .ln { color: var(--ink-dim); min-width: 1.6em; text-align: right; flex: none; user-select: none; }
.wweb-line .tx { flex: 1; min-width: 0; }
.wweb-line.on { background: var(--hl-soft); border-left-color: var(--hl); color: var(--ink); }
.wweb-line.pick { cursor: pointer; border-left-color: var(--rule-strong); }
.wweb-line.pick:hover, .wweb-line.pick:focus { background: var(--paper-3); outline: none; border-left-color: var(--hl); }
.wweb-line.wrong { background: var(--red-soft); border-left-color: var(--red); }
.wweb-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; align-content: start; }
.wweb-col { background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px; min-height: 64px; min-width: 0; }
.wweb-col h5 { margin: 0 0 4px; font-size: 11.5px; font-weight: 600; color: var(--ink-dim); text-transform: uppercase; letter-spacing: .03em; font-family: var(--body); }
.wweb-item { font-family: var(--mono); font-size: 11.5px; padding: 2px 5px; margin: 2px 0; border: 1px solid var(--rule-strong); border-radius: 4px; color: var(--ink); background: var(--paper-2); overflow-wrap: anywhere; }
.wweb-item.top { border-color: var(--hl); background: var(--hl-soft); }
.wweb-item.dim { color: var(--ink-dim); border-style: dashed; }
.wweb-item.err { color: var(--red); border-color: var(--red); background: var(--red-soft); }
.wweb-item.new { border-color: var(--hl); }
.wweb-item .at { color: var(--ink-dim); }
.wweb-time { font-family: var(--mono); font-size: 12px; color: var(--ink-2); margin: 4px 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.wweb-time .bar { flex: 1 1 120px; height: 6px; background: var(--paper-3); border-radius: 3px; position: relative; min-width: 80px; }
.wweb-time .bar i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--hl); border-radius: 3px; }
.wweb-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 6px; margin: 8px 0; }
.wweb-stats .stat-cell { padding: 5px 8px; }
.wweb-stats .stat-value { font-size: 13.5px; }
.wweb-pbox { background: var(--paper); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 6px 8px; margin: 4px 0; font-family: var(--mono); font-size: 12px; color: var(--ink-2); overflow-wrap: anywhere; }
.wweb-pbox.hot { border-color: var(--hl); background: var(--hl-soft); }
.wweb-pbox b { color: var(--ink); font-weight: 600; }
.wweb-pill { display: inline-block; padding: 0 6px; border-radius: 9px; font-size: 11px; border: 1px solid var(--rule-strong); margin-left: 4px; }
.wweb-pill.pending { color: var(--ink-dim); }
.wweb-pill.fulfilled { color: var(--green); border-color: var(--green); background: var(--green-soft); }
.wweb-pill.rejected { color: var(--red); border-color: var(--red); background: var(--red-soft); }
.wweb-link { font-family: var(--mono); font-size: 11.5px; color: var(--ink-dim); padding: 1px 0 1px 14px; overflow-wrap: anywhere; }
.wweb-link.hot { color: var(--hl); font-weight: 600; }
.wweb-flash { color: var(--red); font-family: var(--mono); font-size: 12px; margin: 2px 0; }
.wweb-big { font-size: 13px; line-height: 1.7; }
.wweb-svg { width: 100%; height: auto; display: block; max-width: 640px; margin: 4px auto; }
.wweb-wire { background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px 8px; font-family: var(--mono); font-size: 11.5px; white-space: pre-wrap; overflow-wrap: anywhere; color: var(--ink-2); margin: 4px 0; min-height: 2.4em; }
.wweb-wire .hl { color: var(--hl); }
.wweb-wire .bad { color: var(--red); }
.wweb-wire .ok { color: var(--green); }
.wweb-fields { display: grid; grid-template-columns: auto repeat(3, minmax(0, 1fr)); gap: 3px 6px; font-family: var(--mono); font-size: 11.5px; margin: 6px 0; align-items: center; }
.wweb-fields span { padding: 2px 4px; border-radius: 4px; overflow-wrap: anywhere; }
.wweb-fields .hd { color: var(--ink-dim); font-family: var(--body); }
.wweb-fields .diff { background: var(--red-soft); color: var(--red); }
.wweb-fields .same { background: var(--green-soft); color: var(--green); }
.wweb-scope { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; }
@media (max-width: 640px) { .wweb-scope { grid-template-columns: minmax(0, 1fr); } }
.wweb-mem { display: flex; flex-direction: column; gap: 6px; }
.wweb-frame { border: 1px solid var(--rule-strong); border-radius: 6px; padding: 5px 8px; background: var(--paper); font-family: var(--mono); font-size: 12px; }
.wweb-frame h5 { margin: 0 0 3px; font-family: var(--body); font-size: 11.5px; color: var(--ink-dim); font-weight: 600; }
.wweb-frame .v { color: var(--ink); }
.wweb-frame .tdz { color: var(--red); }
.wweb-frame .undef { color: var(--hl); }
.wweb-frame.inner { margin-left: 12px; }
.wweb-out { font-family: var(--mono); font-size: 12.5px; padding: 6px 8px; border-radius: 6px; background: var(--paper); border: 1px solid var(--rule); margin: 4px 0; overflow-wrap: anywhere; }
.wweb-out .e { color: var(--red); }
.wweb-tri { width: 100%; border-collapse: collapse; font-size: 12px; margin: 6px 0; }
.wweb-tri th, .wweb-tri td { border: 1px solid var(--rule); padding: 3px 5px; text-align: left; font-family: var(--mono); overflow-wrap: anywhere; color: var(--ink-2); }
.wweb-tri th { color: var(--ink-dim); font-family: var(--body); font-weight: 600; }
.wweb-tri td.cur { background: var(--hl-soft); color: var(--ink); }
`;
function injectCss() {
  if (typeof document === "undefined" || document.getElementById("widgets-web-css")) return;
  const s = document.createElement("style");
  s.id = "widgets-web-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ---------- shared: playback parts and a sparse predict mode ----------
function playParts() {
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = true;
  return { caption, ask };
}
/**
 * Predict mode where only some steps carry a question. setSteps([i, …]) lists the steps whose
 * outcome is asked before they are drawn; the playback cannot pass the next unanswered one.
 */
function predictKit(ask, label, getPb, redraw) {
  const s = { on: false, qs: [], done: new Set(), counted: new Set(), asked: 0, firstTry: 0, missed: false, wrong: null, key: null, refocus: false };
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  row.append(cb, " " + label);
  s.row = row;
  s.set = (v) => { s.on = !!v; cb.checked = s.on; };
  s.setSteps = (arr) => { s.qs = arr.slice().sort((a, b) => a - b); };
  s.reset = () => { s.done.clear(); s.counted.clear(); s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.key = null; };
  s.nextQ = () => s.qs.find((q) => !s.done.has(q));
  s.limit = (n) => { if (!s.on) return n; const q = s.nextQ(); return q == null ? n : q; };
  s.asking = (pos) => { if (!s.on) return false; const q = s.nextQ(); return q != null && Math.abs(pos - q) < 1e-6; };
  s.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  s.tally = () => (s.asked > 0 ? ` ${s.firstTry} of ${s.asked} right on the first try.` : "");
  s.pick = (ok, lab, e) => {
    const q = s.nextQ();
    if (q == null) return;
    if (!s.counted.has(q)) { s.counted.add(q); s.asked++; }
    s.refocus = !!e && e.detail === 0;
    if (!ok) { s.missed = true; s.wrong = lab; s.key = null; redraw(); return; }
    if (!s.missed) s.firstTry++;
    s.missed = false; s.wrong = null; s.done.add(q); s.key = null;
    getPb().next();
  };
  /** opts: [{ label, ok, why }] drawn as buttons; with opts null only the feedback line is drawn. */
  s.render = (show, keyBase, opts, whyWrong) => {
    const key = show ? `${keyBase}|${s.nextQ()}|${s.wrong}` : "";
    if (key === s.key) return;
    s.key = key; ask.innerHTML = ""; ask.hidden = !s.on || !show;
    if (!key) return;
    const btns = (opts || []).map((o) => {
      const b = el("button", "viz-btn" + (o.label === s.wrong ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => s.pick(o.ok, o.label, e));
      ask.append(b);
      return b;
    });
    if (s.wrong != null) {
      const w = (opts || []).find((o) => o.label === s.wrong);
      const why = w ? w.why : whyWrong ? whyWrong(s.wrong) : "";
      ask.append(el("span", "playback-feedback", `Not ${s.wrong}. ${why}`));
    }
    if (s.refocus && btns.length) { s.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  };
  cb.addEventListener("change", () => {
    const pb = getPb();
    s.on = cb.checked; pb.pause(); s.reset();
    // Steps already on screen count as answered; questions start at the next one.
    const p = Math.ceil(pb.pos() - 1e-9);
    for (const q of s.qs) if (q < p) s.done.add(q);
    pb.set(pb.pos());
  });
  return s;
}
function statGrid(box) {
  const g = el("div", "wweb-stats");
  box.append(g);
  const upd = (rows) => {
    const key = JSON.stringify(rows);
    if (g.dataset.k === key) return;
    g.dataset.k = key; g.innerHTML = "";
    for (const [l, v] of rows) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", String(v)));
      g.append(c);
    }
  };
  upd.host = box;
  return upd;
}
function selectRow(label, options, value, onChange) {
  const row = el("div", "wweb-row");
  const lab = el("label", null, label);
  const sel = document.createElement("select");
  for (const o of options) {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    const op = document.createElement("option");
    op.value = v; op.textContent = t;
    sel.append(op);
  }
  sel.value = value;
  sel.addEventListener("change", () => onChange(sel.value));
  row.append(lab, sel);
  return { row, sel };
}

// =====================================================================================
// A small JavaScript subset: tokenizer, parser, interpreter with a simulated event loop
// =====================================================================================
class ParseErr extends Error {}
class Unsupported extends Error {}
class Halt extends Error {}
class Throw { constructor(v) { this.v = v; } }
class Ret { constructor(v) { this.v = v; } }

const PUNCT = ["===", "!==", "=>", "==", "!=", "<=", ">=", "&&", "||", "??", "++", "--", "+=", "-=", "*=", "/=", "(", ")", "{", "}", "[", "]", ";", ",", ".", "?", ":", "+", "-", "*", "/", "%", "<", ">", "!", "="];
const BLOCKED = new Set(["for", "while", "do", "switch", "class", "import", "export", "break", "continue", "yield", "with", "delete", "in", "instanceof", "of", "this", "super", "debugger", "case", "default", "extends", "static", "get", "set"]);
const RESERVED = new Set(["let", "const", "var", "function", "if", "else", "return", "throw", "try", "catch", "finally", "new", "typeof", "true", "false", "null", "undefined", "await", ...BLOCKED]);

function tokenize(src, lineBase = 1) {
  const toks = [];
  let i = 0, line = lineBase;
  const fail = (m) => { throw new ParseErr(`Line ${line}: ${m}`); };
  while (i < src.length) {
    const c = src[i];
    if (c === "\n") { line++; i++; continue; }
    if (c === " " || c === "\t" || c === "\r" || c === " ") { i++; continue; }
    if (src.startsWith("//", i)) { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (src.startsWith("/*", i)) {
      const j = src.indexOf("*/", i + 2);
      if (j < 0) fail("a /* comment is never closed");
      for (let k = i; k < j; k++) if (src[k] === "\n") line++;
      i = j + 2; continue;
    }
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
      const m = /^(?:\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+)/.exec(src.slice(i));
      toks.push({ t: "num", v: Number(m[0]), line, s: i, e: i + m[0].length });
      i += m[0].length; continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
      toks.push({ t: "id", v: m[0], line, s: i, e: i + m[0].length });
      i += m[0].length; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1, v = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\n") fail("a string runs past the end of the line");
        if (src[j] === "\\") { const n = src[j + 1]; v += n === "n" ? "\n" : n === "t" ? "\t" : n; j += 2; continue; }
        v += src[j++];
      }
      if (j >= src.length) fail("a string is never closed");
      toks.push({ t: "str", v, line, s: i, e: j + 1 });
      i = j + 1; continue;
    }
    if (c === "`") {
      const quasis = [], exprs = [];
      let j = i + 1, cur = "";
      const l0 = line;
      while (j < src.length && src[j] !== "`") {
        if (src[j] === "\\") { const n = src[j + 1]; cur += n === "n" ? "\n" : n; j += 2; continue; }
        if (src[j] === "$" && src[j + 1] === "{") {
          let depth = 1, k = j + 2;
          while (k < src.length && depth) { if (src[k] === "{") depth++; else if (src[k] === "}") depth--; if (depth) k++; }
          if (depth) fail("a ${ in a template string is never closed");
          quasis.push(cur); cur = "";
          exprs.push({ src: src.slice(j + 2, k), line });
          for (let q = j; q < k; q++) if (src[q] === "\n") line++;
          j = k + 1; continue;
        }
        if (src[j] === "\n") line++;
        cur += src[j++];
      }
      if (j >= src.length) fail("a template string is never closed");
      quasis.push(cur);
      toks.push({ t: "tpl", quasis, exprs, line: l0, s: i, e: j + 1 });
      i = j + 1; continue;
    }
    const p = PUNCT.find((x) => src.startsWith(x, i));
    if (!p) fail(`the character ${JSON.stringify(c)} is not part of the JavaScript this widget reads${c === "“" || c === "”" || c === "‘" || c === "’" ? " (a curly quote: use straight quotes)" : ""}`);
    toks.push({ t: "p", v: p, line, s: i, e: i + p.length });
    i += p.length;
  }
  toks.push({ t: "eof", v: "", line, s: src.length, e: src.length });
  return toks;
}

class Parser {
  constructor(src, lineBase = 1) { this.src = src; this.toks = tokenize(src, lineBase); this.i = 0; this.asyncs = [false]; }
  get tok() { return this.toks[this.i]; }
  peek(n = 1) { return this.toks[Math.min(this.i + n, this.toks.length - 1)]; }
  isP(v, t = this.tok) { return t.t === "p" && t.v === v; }
  isId(v, t = this.tok) { return t.t === "id" && t.v === v; }
  last() { return this.toks[this.i - 1] || this.toks[0]; }
  fail(msg, t = this.tok) {
    const near = t.t === "eof" ? " at the end of the program" : ` near "${this.src.slice(t.s, t.e)}"`;
    throw new ParseErr(`Line ${t.line}: ${msg}${near}.`);
  }
  expectP(v) { if (!this.isP(v)) this.fail(`expected "${v}"`); return this.toks[this.i++]; }
  ident() {
    const t = this.tok;
    if (t.t !== "id") this.fail("expected a name");
    if (BLOCKED.has(t.v)) this.fail(`"${t.v}" is outside the statements this widget animates`);
    if (RESERVED.has(t.v)) this.fail(`"${t.v}" cannot be used as a name`);
    this.i++;
    return t.v;
  }
  semi() {
    if (this.isP(";")) { this.i++; return; }
    const t = this.tok;
    if (t.t === "eof" || this.isP("}") || t.line > this.last().line) return;
    this.fail("unexpected text after a complete statement");
  }
  mark(node, t0) { node.line = t0.line; node.s = t0.s; node.e = this.last().e; node.endLine = this.last().line; return node; }
  program() {
    const body = [];
    while (this.tok.t !== "eof") body.push(this.stmt());
    return { type: "Program", body, line: 1 };
  }
  block() {
    const t0 = this.tok;
    this.expectP("{");
    const body = [];
    while (!this.isP("}")) { if (this.tok.t === "eof") this.fail("a { is never closed"); body.push(this.stmt()); }
    this.expectP("}");
    return this.mark({ type: "Block", body }, t0);
  }
  params() {
    this.expectP("(");
    const ps = [];
    while (!this.isP(")")) {
      ps.push(this.ident());
      if (this.isP("=")) this.fail("default parameters are outside what this widget reads");
      if (!this.isP(")")) this.expectP(",");
    }
    this.expectP(")");
    return ps;
  }
  fnBody(isAsync) { this.asyncs.push(isAsync); const b = this.block(); this.asyncs.pop(); return b; }
  stmt() {
    const t0 = this.tok;
    if (this.isP(";")) { this.i++; return this.mark({ type: "Empty" }, t0); }
    if (this.isP("{")) return this.block();
    if (t0.t === "id") {
      const v = t0.v;
      if (v === "let" || v === "const" || v === "var") {
        this.i++;
        const decls = [];
        for (;;) {
          const name = this.ident();
          let init = null;
          if (this.isP("=")) { this.i++; init = this.assign(); if (init.type === "Func" && !init.name) init.inferred = name; }
          decls.push({ name, init });
          if (!this.isP(",")) break;
          this.i++;
        }
        this.semi();
        return this.mark({ type: "Var", kind: v, decls }, t0);
      }
      if (v === "function" || (v === "async" && this.isId("function", this.peek()) && this.peek().line === t0.line)) {
        const isAsync = v === "async";
        if (isAsync) this.i++;
        this.i++;
        const name = this.ident();
        const params = this.params();
        const body = this.fnBody(isAsync);
        return this.mark({ type: "FuncDecl", name, fn: this.mark({ type: "Func", name, params, body, isAsync, isArrow: false }, t0) }, t0);
      }
      if (v === "if") {
        this.i++; this.expectP("(");
        const test = this.expr();
        this.expectP(")");
        const cons = this.stmt();
        let alt = null;
        if (this.isId("else")) { this.i++; alt = this.stmt(); }
        return this.mark({ type: "If", test, cons, alt }, t0);
      }
      if (v === "return") {
        this.i++;
        let arg = null;
        if (!this.isP(";") && !this.isP("}") && this.tok.t !== "eof" && this.tok.line === t0.line) arg = this.expr();
        this.semi();
        return this.mark({ type: "Return", arg }, t0);
      }
      if (v === "throw") {
        this.i++;
        const arg = this.expr();
        this.semi();
        return this.mark({ type: "Throw", arg }, t0);
      }
      if (v === "try") {
        this.i++;
        const block = this.block();
        let param = null, handler = null, finalizer = null;
        if (this.isId("catch")) {
          this.i++;
          if (this.isP("(")) { this.i++; param = this.ident(); this.expectP(")"); }
          handler = this.block();
        }
        if (this.isId("finally")) { this.i++; finalizer = this.block(); }
        if (!handler && !finalizer) this.fail("try needs catch or finally");
        return this.mark({ type: "Try", block, param, handler, finalizer }, t0);
      }
      if (BLOCKED.has(v)) this.fail(`"${v}" is outside the statements this widget animates`);
    }
    const expr = this.expr();
    this.semi();
    return this.mark({ type: "Expr", expr }, t0);
  }
  expr() { return this.assign(); }
  arrowParenAt(i) {
    if (!this.isP("(", this.toks[i])) return false;
    let d = 0;
    for (let j = i; j < this.toks.length; j++) {
      const t = this.toks[j];
      if (t.t === "p" && (t.v === "(" || t.v === "[" || t.v === "{")) d++;
      else if (t.t === "p" && (t.v === ")" || t.v === "]" || t.v === "}")) { d--; if (d === 0) return this.isP("=>", this.toks[j + 1]); }
      else if (t.t === "eof") return false;
    }
    return false;
  }
  arrow(isAsync, t0) {
    let params;
    if (this.tok.t === "id") params = [this.ident()];
    else params = this.params();
    this.expectP("=>");
    this.asyncs.push(isAsync);
    let body, exprBody = false;
    if (this.isP("{")) body = this.block();
    else { body = this.assign(); exprBody = true; }
    this.asyncs.pop();
    return this.mark({ type: "Func", name: null, params, body, exprBody, isAsync, isArrow: true }, t0);
  }
  assign() {
    const t0 = this.tok;
    if (this.isId("async") && this.peek().line === t0.line) {
      const n = this.peek();
      if (n.t === "id" && !RESERVED.has(n.v) && n.v !== "function" && this.isP("=>", this.peek(2))) { this.i++; return this.arrow(true, t0); }
      if (this.isP("(", n) && this.arrowParenAt(this.i + 1)) { this.i++; return this.arrow(true, t0); }
      if (this.isId("function", n)) {
        this.i += 2;
        const name = this.tok.t === "id" ? this.ident() : null;
        const params = this.params();
        return this.mark({ type: "Func", name, params, body: this.fnBody(true), isAsync: true, isArrow: false }, t0);
      }
    }
    if (t0.t === "id" && !RESERVED.has(t0.v) && this.isP("=>", this.peek())) return this.arrow(false, t0);
    if (this.isP("(") && this.arrowParenAt(this.i)) return this.arrow(false, t0);
    const left = this.cond();
    const t = this.tok;
    if (t.t === "p" && ["=", "+=", "-=", "*=", "/="].includes(t.v)) {
      if (left.type !== "Ident" && left.type !== "Member") this.fail("the left side of = must be a name or a property");
      this.i++;
      const value = this.assign();
      if (value.type === "Func" && !value.name && left.type === "Ident") value.inferred = left.name;
      return this.mark({ type: "Assign", op: t.v, target: left, value }, t0);
    }
    return left;
  }
  cond() {
    const t0 = this.tok;
    const test = this.bin(0);
    if (!this.isP("?")) return test;
    this.i++;
    const cons = this.assign();
    this.expectP(":");
    const alt = this.assign();
    return this.mark({ type: "Cond", test, cons, alt }, t0);
  }
  bin(level) {
    const LEVELS = [["||", "??"], ["&&"], ["===", "!==", "==", "!="], ["<", ">", "<=", ">="], ["+", "-"], ["*", "/", "%"]];
    if (level >= LEVELS.length) return this.unary();
    const t0 = this.tok;
    let left = this.bin(level + 1);
    while (this.tok.t === "p" && LEVELS[level].includes(this.tok.v)) {
      const op = this.tok.v;
      this.i++;
      const right = this.bin(level + 1);
      left = this.mark({ type: level < 2 ? "Logical" : "Binary", op, left, right }, t0);
    }
    return left;
  }
  unary() {
    const t0 = this.tok;
    if (t0.t === "p" && ["!", "-", "+"].includes(t0.v)) { this.i++; return this.mark({ type: "Unary", op: t0.v, arg: this.unary() }, t0); }
    if (t0.t === "p" && (t0.v === "++" || t0.v === "--")) { this.i++; const arg = this.unary(); return this.mark({ type: "Update", op: t0.v, prefix: true, arg }, t0); }
    if (this.isId("typeof")) { this.i++; return this.mark({ type: "Unary", op: "typeof", arg: this.unary() }, t0); }
    if (this.isId("await")) {
      if (!this.asyncs[this.asyncs.length - 1]) this.fail("await is only valid inside an async function");
      this.i++;
      return this.mark({ type: "Await", arg: this.unary() }, t0);
    }
    const e = this.call();
    if ((this.isP("++") || this.isP("--")) && this.tok.line === this.last().line) {
      const op = this.tok.v; this.i++;
      return this.mark({ type: "Update", op, prefix: false, arg: e }, t0);
    }
    return e;
  }
  args() {
    this.expectP("(");
    const a = [];
    while (!this.isP(")")) { a.push(this.assign()); if (!this.isP(")")) this.expectP(","); }
    this.expectP(")");
    return a;
  }
  call() {
    const t0 = this.tok;
    let e;
    if (this.isId("new")) {
      this.i++;
      let callee = this.primary();
      while (this.isP(".")) { this.i++; const pt = this.tok; if (pt.t !== "id") this.fail("expected a property name"); this.i++; callee = this.mark({ type: "Member", obj: callee, prop: pt.v }, t0); }
      const args = this.isP("(") ? this.args() : [];
      e = this.mark({ type: "New", callee, args }, t0);
    } else e = this.primary();
    for (;;) {
      if (this.isP(".")) {
        this.i++;
        const pt = this.tok;
        if (pt.t !== "id") this.fail("expected a property name");
        this.i++;
        e = this.mark({ type: "Member", obj: e, prop: pt.v, pline: pt.line }, t0);
      } else if (this.isP("[")) {
        this.i++;
        const prop = this.expr();
        this.expectP("]");
        e = this.mark({ type: "Member", obj: e, computed: prop }, t0);
      } else if (this.isP("(")) {
        const cl = this.tok.line;
        const args = this.args();
        e = this.mark({ type: "Call", callee: e, args, cline: e.type === "Member" && e.pline ? e.pline : cl }, t0);
      } else break;
    }
    return e;
  }
  primary() {
    const t = this.tok;
    if (t.t === "num" || t.t === "str") { this.i++; return this.mark({ type: "Lit", value: t.v }, t); }
    if (t.t === "tpl") {
      this.i++;
      const exprs = t.exprs.map((x) => { const p = new Parser(x.src, x.line); p.asyncs = this.asyncs.slice(); const e = p.expr(); if (p.tok.t !== "eof") p.fail("unexpected text in ${ }"); return e; });
      return this.mark({ type: "Tpl", quasis: t.quasis, exprs }, t);
    }
    if (t.t === "p" && t.v === "(") { this.i++; const e = this.expr(); this.expectP(")"); return e; }
    if (t.t === "p" && t.v === "[") {
      this.i++;
      const elems = [];
      while (!this.isP("]")) { elems.push(this.assign()); if (!this.isP("]")) this.expectP(","); }
      this.expectP("]");
      return this.mark({ type: "Arr", elems }, t);
    }
    if (t.t === "p" && t.v === "{") {
      this.i++;
      const props = [];
      while (!this.isP("}")) {
        const kt = this.tok;
        if (kt.t !== "id" && kt.t !== "str" && kt.t !== "num") this.fail("expected a property name");
        this.i++;
        let value;
        if (this.isP(":")) { this.i++; value = this.assign(); } else if (kt.t === "id") value = this.mark({ type: "Ident", name: kt.v }, kt);
        else this.fail("expected :");
        props.push({ key: String(kt.v), value });
        if (!this.isP("}")) this.expectP(",");
      }
      this.expectP("}");
      return this.mark({ type: "Obj", props }, t);
    }
    if (t.t === "id") {
      if (t.v === "true" || t.v === "false") { this.i++; return this.mark({ type: "Lit", value: t.v === "true" }, t); }
      if (t.v === "null") { this.i++; return this.mark({ type: "Lit", value: null }, t); }
      if (t.v === "undefined") { this.i++; return this.mark({ type: "Ident", name: "undefined" }, t); }
      if (t.v === "function") {
        this.i++;
        const name = this.tok.t === "id" ? this.ident() : null;
        const params = this.params();
        return this.mark({ type: "Func", name, params, body: this.fnBody(false), isAsync: false, isArrow: false }, t);
      }
      if (BLOCKED.has(t.v)) this.fail(`"${t.v}" is outside what this widget animates`);
      if (RESERVED.has(t.v) && t.v !== "async") this.fail(`unexpected "${t.v}"`);
      this.i++;
      return this.mark({ type: "Ident", name: t.v }, t);
    }
    this.fail("unexpected token");
  }
}
export function parseProgram(src) { return new Parser(src).program(); }

// ---------- values ----------
class JObj { constructor(props = {}) { this.props = Object.assign(Object.create(null), props); } }
const isErr = (v) => v instanceof JObj && v.isError;
const isFn = (v) => v != null && typeof v === "object" && (v.isClosure || v.isNative);
const isProm = (v) => v != null && typeof v === "object" && v.isPromise;
function mkErr(name, message) { const o = new JObj({ name, message }); o.isError = true; return o; }
function inspect(v, depth = 0) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "string") return `'${v}'`;
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "boolean") return String(v);
  if (isProm(v)) return `Promise {<${v.state}>${v.state === "pending" ? "" : ": " + inspect(v.value, depth + 1)}}`;
  if (isFn(v)) return `ƒ ${v.name || "anonymous"}()`;
  if (isErr(v)) return `${v.props.name}: ${v.props.message}`;
  if (Array.isArray(v)) return depth > 2 ? "[…]" : `[${v.map((x) => inspect(x, depth + 1)).join(", ")}]`;
  if (v instanceof JObj) return depth > 2 ? "{…}" : `{${Object.keys(v.props).map((k) => `${k}: ${inspect(v.props[k], depth + 1)}`).join(", ")}}`;
  return String(v);
}
const fmtTop = (v) => (typeof v === "string" ? v : inspect(v));
function toStr(v) {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (isProm(v)) return "[object Promise]";
  if (isErr(v)) return `${v.props.name}: ${v.props.message}`;
  if (Array.isArray(v)) return v.map((x) => (x == null ? "" : toStr(x))).join(",");
  if (isFn(v)) return v.src || `function ${v.name || ""}() { [native code] }`;
  return "[object Object]";
}
const truthy = (v) => !(v === false || v === 0 || v === "" || v === null || v === undefined || Number.isNaN(v));
const toNum = (v) => (typeof v === "number" ? v : v === null ? 0 : v === undefined ? NaN : typeof v === "boolean" ? +v : typeof v === "string" ? (v.trim() === "" ? 0 : Number(v)) : NaN);
function looseEq(a, b) {
  if (a === b) return true;
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  const prim = (x) => typeof x !== "object";
  if (prim(a) && prim(b)) return toNum(a) === toNum(b);
  return false;
}
function snippet(node, src, max = 34) {
  const t = src.slice(node.s, node.e).replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

class Env {
  constructor(parent, isFn) { this.parent = parent; this.isFn = !!isFn; this.vars = new Map(); }
  fnScope() { let e = this; while (!e.isFn && e.parent) e = e.parent; return e; }
  find(name) { let e = this; while (e) { if (e.vars.has(name)) return e.vars.get(name); e = e.parent; } return null; }
}
const UNSUPPORTED_GLOBALS = new Set(["fetch", "XMLHttpRequest", "require", "process", "module", "exports", "window", "globalThis", "localStorage", "sessionStorage", "setImmediate", "Symbol", "Date", "JSON", "Object", "Reflect", "Proxy", "Map", "Set", "WeakMap", "navigator", "location", "prompt", "confirm", "structuredClone", "Atomics", "MessageChannel", "requestAnimationFrame"]);
const MAX_STEPS = 320;
const RANDOMS = [0.62, 0.15, 0.48, 0.91, 0.33, 0.77];

/** Runs a program and returns { steps, console, error, halted, notes }. steps[i] is a snapshot after event i. */
export class Interp {
  constructor(src) {
    this.src = src; this.steps = []; this.micro = []; this.timers = []; this.cons = []; this.now = 0;
    this.seq = 0; this.timerId = 0; this.stack = []; this.notes = []; this.promises = []; this.pcount = 0;
    this.unhandled = []; this.ri = 0; this.flash = null; this.hot = null; this.calls = 0; this.usedRandom = false;
    this.afterScript = false; this.callLine = 1; this.cleared = new Set(); this.intervalStop = false;
    this.global = new Env(null, true);
    this.setup();
  }
  // ----- snapshots -----
  snap(kind, line, extra = {}) {
    if (this.steps.length >= MAX_STEPS) throw new Halt(`stopped after ${MAX_STEPS} steps`);
    const caption = (extra.caption != null ? extra.caption + (this.notes.length ? " " : "") : "") + this.notes.join(" ");
    const top = [...this.stack].reverse().find((f) => f.role);
    this.steps.push({
      kind, line, caption, job: extra.job || null,
      stack: this.stack.map((f) => f.label),
      micro: this.micro.map((j) => ({ label: j.label, internal: !!j.internal })),
      timers: this.timers.slice().sort((a, b) => a.at - b.at || a.seq - b.seq).map((t) => ({ label: t.label, at: t.at, report: !!t.report })),
      cons: this.cons.length, now: this.now,
      promises: this.promises.filter((p) => !p.internal).map((p) => ({ id: p.id, name: p.name, state: p.state, value: p.state === "pending" ? "" : inspect(p.value), parent: p.parent ? p.parent.id : null, via: p.via, line: p.line, label: p.label })),
      flash: this.flash, hot: this.hot, role: top ? top.role : "script",
    });
    this.notes = []; this.flash = null; this.hot = null;
  }
  note(t) { if (t) this.notes.push(t); }
  print(text, kind = "log", line = this.callLine) { this.cons.push({ text, kind, line, step: this.steps.length }); }
  // ----- globals -----
  native(name, fn, props) { return { isNative: true, name, fn, props: props || {} }; }
  setup() {
    const g = this.global, I = this;
    const def = (n, v) => g.vars.set(n, { v, kind: "var", init: true });
    const logger = (kind) => this.native(kind === "log" ? "console.log" : `console.${kind}`, function* (args) {
      const text = args.map(fmtTop).join(" ");
      I.print(text, kind === "error" || kind === "warn" ? "error" : "log");
      I.note(`console.${kind} prints ${text === "" ? "an empty line" : text}.`);
    });
    def("console", new JObj({ log: logger("log"), info: logger("info"), error: logger("error"), warn: logger("warn") }));
    def("alert", this.native("alert", function* (args) { const t = args.length ? toStr(args[0]) : ""; I.print(`[alert] ${t}`, "alert"); I.note(`alert shows "${t}".`); }));
    def("document", new JObj({ write: this.native("document.write", function* (args) { const t = args.map(toStr).join(""); I.print(`[page] ${t}`, "page"); I.note(`document.write puts "${t}" on the page.`); }) }));
    const timer = (interval) => this.native(interval ? "setInterval" : "setTimeout", function* (args) {
      const [fn, ms0, ...rest] = args;
      if (!isFn(fn)) throw new Unsupported(`${interval ? "setInterval" : "setTimeout"} with a string instead of a function is outside what this widget animates`);
      const ms = Math.max(0, Math.floor(toNum(ms0)) || 0);
      if (!fn.role && fn.isClosure) fn.role = interval ? "interval callback" : "timer callback";
      const id = ++I.timerId;
      const line = fn.isClosure ? fn.node.line : I.callLine;
      const label = `${fn.isClosure ? (fn.name || fn.role) : fn.name} (line ${line})`;
      I.timers.push({ id, fn, at: I.now + ms, ms, seq: ++I.seq, args: rest, interval, fires: 0, label, line });
      I.note(interval
        ? `setInterval registers the callback to run every ${ms} ms; the first run is ready at ${I.now + ms} ms.`
        : `setTimeout registers the callback; it is ready at ${I.now} + ${ms} = ${I.now + ms} ms.${ms === 0 ? " The callback waits in the queue until the call stack is empty, even with 0 ms." : ""}`);
      return id;
    });
    def("setTimeout", timer(false));
    def("setInterval", timer(true));
    const clear = (n) => this.native(n, function* (args) {
      const id = args[0];
      const before = I.timers.length;
      I.timers = I.timers.filter((t) => t.id !== id);
      I.cleared.add(id);
      I.note(before !== I.timers.length || I.cleared.has(id) ? `${n}(${inspect(id)}) cancels that timer.` : "");
    });
    def("clearTimeout", clear("clearTimeout"));
    def("clearInterval", clear("clearInterval"));
    def("queueMicrotask", this.native("queueMicrotask", function* (args) {
      const fn = args[0];
      if (fn.isClosure && !fn.role) fn.role = "microtask";
      I.micro.push({ type: "call", fn, label: `${fn.name || fn.role || "callback"} (line ${fn.isClosure ? fn.node.line : I.callLine})` });
      I.note("queueMicrotask puts the callback in the microtask queue.");
    }));
    const errCtor = (name) => {
      const f = this.native(name, function* (args) { return mkErr(name, args.length ? toStr(args[0]) : ""); });
      f.construct = function* (args) { return mkErr(name, args.length ? toStr(args[0]) : ""); };
      return f;
    };
    def("Error", errCtor("Error"));
    def("TypeError", errCtor("TypeError"));
    def("RangeError", errCtor("RangeError"));
    def("Math", new JObj({
      floor: this.native("Math.floor", function* (a) { return Math.floor(toNum(a[0])); }),
      round: this.native("Math.round", function* (a) { return Math.round(toNum(a[0])); }),
      ceil: this.native("Math.ceil", function* (a) { return Math.ceil(toNum(a[0])); }),
      abs: this.native("Math.abs", function* (a) { return Math.abs(toNum(a[0])); }),
      min: this.native("Math.min", function* (a) { return Math.min(...a.map(toNum)); }),
      max: this.native("Math.max", function* (a) { return Math.max(...a.map(toNum)); }),
      random: this.native("Math.random", function* () { I.usedRandom = true; return RANDOMS[I.ri++ % RANDOMS.length]; }),
    }));
    def("String", this.native("String", function* (a) { return toStr(a[0]); }));
    def("Number", this.native("Number", function* (a) { return toNum(a[0]); }));
    def("parseInt", this.native("parseInt", function* (a) { return parseInt(toStr(a[0]), a[1] === undefined ? 10 : toNum(a[1])); }));
    def("undefined", undefined);
    def("NaN", NaN);
    // Promise
    const P = this.native("Promise", function* () { throw new Throw(mkErr("TypeError", "Promise constructor cannot be invoked without 'new'")); });
    P.construct = function* (args, node) { return yield* I.promiseCtor(args, node); };
    P.props.resolve = this.native("Promise.resolve", function* (args) {
      const v = args[0];
      if (isProm(v)) { I.note(`Promise.resolve(${v.name}) returns ${v.name} itself.`); return v; }
      const p = I.newPromise({ label: `Promise.resolve (line ${I.callLine})`, line: I.callLine });
      I.settle(p, "fulfilled", v, true);
      I.note(`Promise.resolve(${args.length ? inspect(v) : ""}) creates ${p.name}, already fulfilled${args.length ? ` with ${inspect(v)}` : ""}.`);
      return p;
    });
    P.props.reject = this.native("Promise.reject", function* (args) {
      const p = I.newPromise({ label: `Promise.reject (line ${I.callLine})`, line: I.callLine });
      I.settle(p, "rejected", args[0], true);
      I.note(`Promise.reject(${inspect(args[0])}) creates ${p.name}, already rejected.`);
      return p;
    });
    def("Promise", P);
    this.protoThen = this.native("then", function* (args, self) { return I.thenImpl(self, args[0], args[1], "then", I.callLine); });
    this.protoCatch = this.native("catch", function* (args, self) { return I.thenImpl(self, undefined, args[0], "catch", I.callLine); });
    this.protoFinally = this.native("finally", function* (args, self) { return I.finallyImpl(self, args[0], I.callLine); });
  }
  // ----- promises (ECMAScript semantics: reaction jobs, resolve-thenable jobs, rejection tracking) -----
  newPromise(o) {
    const p = { isPromise: true, state: "pending", value: undefined, fr: [], rr: [], handled: false, internal: !!o.internal, parent: o.parent || null, via: o.via || null, line: o.line, label: o.label || "" };
    p.id = this.promises.length;
    p.name = p.internal ? "(internal)" : `p${++this.pcount}`;
    this.promises.push(p);
    return p;
  }
  settle(p, state, value, quiet) {
    p.state = state; p.value = value;
    const rs = state === "fulfilled" ? p.fr : p.rr;
    p.fr = []; p.rr = [];
    for (const r of rs) this.enqueueReaction(r, value, p);
    if (state === "rejected" && !p.handled) this.unhandled.push(p);
    if (!quiet && !p.internal) {
      this.note(`${p.name} is now ${state} with ${inspect(value)}.`);
      if (rs.length) this.note(rs.length === 1 ? `The handler waiting on ${p.name} moves to the microtask queue.` : `The ${rs.length} handlers waiting on ${p.name} move to the microtask queue.`);
    }
  }
  resolvingFns(p) {
    const I = this;
    const st = { done: false };
    const resolve = this.native("resolve", function* (args) {
      const v = args[0];
      if (st.done) {
        if (!p.internal) { I.note(`resolve(${inspect(v)}) is ignored: ${p.name} is already settled.`); I.flash = { id: p.id, text: `resolve(${inspect(v)}) ignored: already settled` }; }
        return;
      }
      st.done = true;
      if (v === p) { I.settle(p, "rejected", mkErr("TypeError", "Chaining cycle detected for promise #<Promise>")); return; }
      if (isProm(v)) {
        I.micro.push({ type: "thenable", p, t: v, internal: true, label: `${p.name} adopts the state of ${v.name}` });
        if (!p.internal) I.note(`resolve got a promise (${v.name}), so ${p.name} stays pending and adopts its state one microtask later.`);
        return;
      }
      if (!p.internal) I.note(`resolve(${inspect(v)}) changes ${p.name} to fulfilled synchronously.`);
      I.settle(p, "fulfilled", v, true);
      if (!p.internal && p.fr.length === 0) { /* reactions already moved in settle */ }
      I.noteMoved(p, "fulfilled");
    });
    const reject = this.native("reject", function* (args) {
      const v = args[0];
      if (st.done) {
        if (!p.internal) { I.note(`reject(${inspect(v)}) is ignored: ${p.name} is already settled.`); I.flash = { id: p.id, text: `reject(${inspect(v)}) ignored: already settled` }; }
        return;
      }
      st.done = true;
      if (!p.internal) I.note(`reject(${inspect(v)}) changes ${p.name} to rejected synchronously.`);
      I.settle(p, "rejected", v, true);
      I.noteMoved(p, "rejected");
    });
    return { resolve, reject };
  }
  noteMoved(p, state) {
    if (p.internal) return;
    const n = this.micro.filter((j) => j.type === "reaction" && j.src === p).length;
    if (n) this.note(n === 1 ? `The handler waiting on ${p.name} moves to the microtask queue.` : `The ${n} handlers waiting on ${p.name} move to the microtask queue.`);
  }
  *promiseCtor(args, node) {
    const ex = args[0];
    if (!isFn(ex)) throw new Throw(mkErr("TypeError", `Promise resolver ${inspect(ex)} is not a function`));
    const p = this.newPromise({ label: `new Promise (line ${node.line})`, line: node.line });
    const { resolve, reject } = this.resolvingFns(p);
    if (ex.isClosure && !ex.role) ex.role = "executor";
    this.note(`new Promise creates ${p.name} (pending) and calls the executor at once: the executor runs synchronously.`);
    try { yield* this.call(ex, undefined, [resolve, reject]); }
    catch (e) {
      if (!(e instanceof Throw)) throw e;
      this.note(`The executor threw ${inspect(e.v)}.`);
      yield* this.call(reject, undefined, [e.v]);
    }
    this.callLine = node.line;
    this.note(`The executor has finished; new Promise returns ${p.name} (${p.state}${p.state === "pending" ? "" : `: ${inspect(p.value)}`}).`);
    return p;
  }
  roleOf(fn, role) { if (fn && fn.isClosure && !fn.role) fn.role = role; }
  thenImpl(src, onF, onR, kind, line, internal) {
    if (!isProm(src)) throw new Throw(mkErr("TypeError", `.${kind} called on something that is not a promise`));
    const f = isFn(onF) ? onF : undefined, r = isFn(onR) ? onR : undefined;
    this.roleOf(f, kind === "finally" ? ".finally handler" : ".then handler");
    this.roleOf(r, kind === "catch" ? ".catch handler" : ".then rejection handler");
    const desc = (fn, raw) => (fn ? (fn.isClosure ? snippet(fn.node, this.src, 26) : fn.name) : raw === undefined || raw === null ? "" : `${inspect(raw)} (not a function)`);
    const via = { kind, f: kind === "catch" ? "" : desc(f, onF), r: desc(r, onR) };
    const c = this.newPromise({ label: `.${kind} (line ${line})`, parent: src, via, line, internal: internal || src.internal });
    const cap = { p: c, fns: this.resolvingFns(c) };
    this.performThen(src, f, r, cap, kind, line);
    if (!c.internal && !src.internal) {
      if (kind !== "catch" && onF !== undefined && onF !== null && !f) this.note(`.then(${inspect(onF)}): ${inspect(onF)} is not a function, so it is ignored and the value passes through.`);
      this.note(src.state === "pending"
        ? `.${kind} on ${src.name}, which is still pending: the handler waits on it. .${kind} returns a new promise, ${c.name}.`
        : `.${kind} on ${src.name}, which is already ${src.state}: ${(src.state === "fulfilled" ? f : r) ? "the handler goes straight to the microtask queue" : `there is no ${src.state === "fulfilled" ? "success" : "rejection"} handler here, so a pass-on step is queued`}. .${kind} returns a new promise, ${c.name}.`);
    }
    return c;
  }
  performThen(src, f, r, cap, kind, line, labels) {
    const rf = { type: "fulfill", handler: f, cap, kind, line, labels };
    const rr = { type: "reject", handler: r, cap, kind, line, labels };
    if (src.state === "pending") { src.fr.push(rf); src.rr.push(rr); }
    else if (src.state === "fulfilled") this.enqueueReaction(rf, src.value, src);
    else {
      if (!src.handled) this.unhandled = this.unhandled.filter((x) => x !== src);
      this.enqueueReaction(rr, src.value, src);
    }
    src.handled = true;
  }
  enqueueReaction(r, arg, src) {
    let label;
    if (r.labels) label = r.labels[r.type];
    else if (r.handler) label = `${r.handler.isClosure ? (r.handler.name || r.handler.role) : r.handler.name} (line ${r.handler.isClosure ? r.handler.node.line : r.line}) ← ${inspect(arg)}`;
    else label = `.${r.kind} (line ${r.line}) has no ${r.type === "fulfill" ? "success" : "rejection"} handler: pass ${inspect(arg)} on`;
    this.micro.push({ type: "reaction", r, arg, src, label, internal: !!(r.cap && r.cap.p.internal && !r.labels) });
  }
  finallyImpl(src, onFin, line) {
    if (!isFn(onFin)) return this.thenImpl(src, onFin, onFin, "finally", line);
    this.roleOf(onFin, ".finally handler");
    const I = this;
    const c = this.newPromise({ label: `.finally (line ${line})`, parent: src, via: { kind: "finally", f: onFin.isClosure ? snippet(onFin.node, this.src, 26) : onFin.name, r: "" }, line, internal: src.internal });
    const cap = { p: c, fns: this.resolvingFns(c) };
    const wrap = (isReject) => this.native(".finally handler", function* (args) {
      const v = args[0];
      I.note(`.finally calls its handler with no argument, whether ${src.name} was fulfilled or rejected.`);
      const res = yield* I.callUser(onFin, []);
      const pr = isProm(res) ? res : (() => { const q = I.newPromise({ internal: true }); I.settle(q, "fulfilled", res, true); return q; })();
      const pass = I.native(isReject ? "rethrow" : "pass value", function* () { if (isReject) throw new Throw(v); return v; });
      const q = I.thenImpl(pr, pass, undefined, "then", line, true);
      I.note(isReject ? `.finally passes the rejection ${inspect(v)} on to ${c.name} (after two internal microtasks).` : `.finally passes the value ${inspect(v)} on to ${c.name} (after two internal microtasks), not the handler's return value.`);
      return q;
    });
    const labels = { fulfill: `.finally handler (line ${onFin.isClosure ? onFin.node.line : line})`, reject: `.finally handler (line ${onFin.isClosure ? onFin.node.line : line})` };
    this.performThen(src, wrap(false), wrap(true), cap, "finally", line, labels);
    if (!src.internal) this.note(src.state === "pending" ? `.finally on ${src.name}, still pending: the handler waits. .finally returns a new promise, ${c.name}.` : `.finally on ${src.name}, already ${src.state}: the handler goes to the microtask queue. .finally returns ${c.name}.`);
    return c;
  }
  // ----- async functions -----
  startAsync(fn, args) {
    const I = this;
    const P = this.newPromise({ label: `${fn.name || "async function"}() (line ${fn.node.line})`, line: fn.node.line });
    const fns = this.resolvingFns(P);
    const gen = this.invoke(fn, args, true);
    const frame = { label: fn.name || "async function", role: fn.name || "async function", fn };
    const step = (input) => {
      this.stack.push(frame);
      let r;
      try { r = gen.next(input); }
      catch (e) {
        this.stack.pop();
        if (!(e instanceof Throw)) throw e;
        this.note(`${frame.label} threw ${inspect(e.v)}, so its promise ${P.name} is rejected.`);
        this.drive(this.call(fns.reject, undefined, [e.v]));
        return;
      }
      this.stack.pop();
      if (r.done) {
        this.note(`${frame.label} returns ${inspect(r.value)}, which resolves its promise ${P.name}.`);
        this.drive(this.call(fns.resolve, undefined, [r.value]));
        return;
      }
      const v = r.value.await;
      let pr = v;
      if (!isProm(v)) { pr = this.newPromise({ internal: true }); this.settle(pr, "fulfilled", v, true); }
      this.note(`await ${inspect(v)}: ${frame.label} pauses here and returns to its caller; the rest of the function waits as a microtask${isProm(v) && v.state === "pending" ? ` until ${v.name} settles` : ""}.`);
      const cont = (ok) => this.native(`resume ${frame.label}`, function* (a) { step({ ok, value: a[0] }); });
      const lab = `resume ${frame.label} after await (line ${this.awaitLine})`;
      this.performThen(pr, cont(true), cont(false), null, "await", this.awaitLine, { fulfill: lab, reject: lab });
    };
    step(undefined);
    return P;
  }
  drive(gen) { const r = gen.next(); if (!r.done) throw new Error("internal: await outside an async function"); return r.value; }
  // ----- calls -----
  *call(fn, thisV, args) {
    if (++this.calls > 4000) throw new Halt("stopped: too many calls (endless recursion?)");
    if (fn.isNative) return yield* fn.fn(args, thisV);
    if (fn.isAsync) return this.startAsync(fn, args);
    return yield* this.invoke(fn, args, false);
  }
  /** Calls a user function from native code (a job or a native), outside any async body. */
  *callUser(fn, args) { return yield* this.call(fn, undefined, args); }
  *invoke(fn, args, managed) {
    const env = new Env(fn.env, true);
    fn.node.params.forEach((p, i) => env.vars.set(p, { v: args[i], kind: "let", init: true }));
    const frame = { label: fn.name || fn.role || "anonymous function", role: fn.role || fn.name || "function", fn };
    if (!managed) this.stack.push(frame);
    try {
      if (fn.node.exprBody) {
        const v = yield* this.ev(fn.node.body, env);
        this.snap("stmt", fn.node.body.line, { caption: this.notes.length ? null : `${fn.name || fn.role || "The arrow function"} returns ${inspect(v)}.` });
        return v;
      }
      yield* this.execList(fn.node.body.body, env, env);
      return undefined;
    } catch (e) {
      if (e instanceof Ret) return e.v;
      throw e;
    } finally {
      if (!managed) this.stack.pop();
    }
  }
  // ----- statements -----
  hoist(stmts, env, fnEnv) {
    const vars = [];
    const scan = (list) => {
      for (const s of list) {
        if (!s) continue;
        if (s.type === "Var" && s.kind === "var") vars.push(...s.decls.map((d) => d.name));
        else if (s.type === "Block") scan(s.body);
        else if (s.type === "If") scan([s.cons, s.alt]);
        else if (s.type === "Try") scan([s.block, s.handler, s.finalizer]);
      }
    };
    if (fnEnv === env) { scan(stmts); for (const n of vars) if (!fnEnv.vars.has(n)) fnEnv.vars.set(n, { v: undefined, kind: "var", init: true }); }
    for (const s of stmts) {
      if (s.type === "Var" && s.kind !== "var") for (const d of s.decls) {
        if (env.vars.has(d.name)) throw new Throw(mkErr("SyntaxError", `Identifier '${d.name}' has already been declared`));
        env.vars.set(d.name, { v: undefined, kind: s.kind, init: false });
      }
      if (s.type === "FuncDecl") env.vars.set(s.name, { v: this.closure(s.fn, env), kind: "var", init: true });
    }
  }
  *execList(stmts, env, fnEnv) {
    this.hoist(stmts, env, fnEnv);
    for (const s of stmts) yield* this.exec(s, env);
  }
  *exec(s, env) {
    switch (s.type) {
      case "Empty": case "FuncDecl": return;
      case "Block": { const inner = new Env(env, false); yield* this.execList(s.body, inner, null); return; }
      case "Var": {
        const parts = [];
        for (const d of s.decls) {
          const v = d.init ? yield* this.ev(d.init, env) : undefined;
          if (s.kind === "var") { if (d.init) env.find(d.name).v = v; }
          else { const b = env.vars.get(d.name); b.v = v; b.init = true; }
          parts.push(`${d.name} = ${inspect(v)}`);
        }
        this.callLine = s.line;
        this.snap("stmt", s.line, { caption: this.notes.length ? null : `Line ${s.line} runs synchronously: ${s.kind} ${parts.join(", ")}.` });
        return;
      }
      case "Expr": {
        this.callLine = s.line;
        const v = yield* this.ev(s.expr, env);
        this.snap("stmt", s.line, { caption: this.notes.length ? null : `Line ${s.line} runs synchronously${s.expr.type === "Assign" ? `: ${s.expr.target.name || "the property"} = ${inspect(v)}` : ""}.` });
        return;
      }
      case "If": {
        const t = yield* this.ev(s.test, env);
        this.snap("stmt", s.line, { caption: `if (${snippet(s.test, this.src, 30)}) is ${truthy(t)}.` });
        if (truthy(t)) yield* this.exec(s.cons, env);
        else if (s.alt) yield* this.exec(s.alt, env);
        return;
      }
      case "Return": {
        const v = s.arg ? yield* this.ev(s.arg, env) : undefined;
        throw new Ret(v);
      }
      case "Throw": {
        const v = yield* this.ev(s.arg, env);
        this.snap("stmt", s.line, { caption: `throw ${inspect(v)}: the function stops here and the error travels to its caller.` });
        throw new Throw(v);
      }
      case "Try": {
        try { yield* this.exec(s.block, env); }
        catch (e) {
          if (!(e instanceof Throw) || !s.handler) throw e;
          const inner = new Env(env, false);
          if (s.param) inner.vars.set(s.param, { v: e.v, kind: "let", init: true });
          this.note(`catch receives ${inspect(e.v)}.`);
          yield* this.execList(s.handler.body, inner, null);
        } finally {
          if (s.finalizer) yield* this.exec(s.finalizer, env);
        }
        return;
      }
      default: throw new Unsupported(`Line ${s.line}: this statement is outside what this widget animates`);
    }
  }
  closure(node, env) { return { isClosure: true, node, env, name: node.name || node.inferred || null, isAsync: node.isAsync, role: null, src: this.src.slice(node.s, node.e) }; }
  // ----- expressions -----
  lookup(name, line) {
    const b = this.global && this.envFind(name);
    if (b) return b;
    if (UNSUPPORTED_GLOBALS.has(name)) throw new Unsupported(`Line ${line}: "${name}" is outside what this widget animates`);
    throw new Throw(mkErr("ReferenceError", `${name} is not defined`));
  }
  getProp(obj, prop, line) {
    if (obj === undefined || obj === null) throw new Throw(mkErr("TypeError", `Cannot read properties of ${obj} (reading '${prop}')`));
    if (isProm(obj)) {
      if (prop === "then") return this.protoThen;
      if (prop === "catch") return this.protoCatch;
      if (prop === "finally") return this.protoFinally;
      return undefined;
    }
    if (typeof obj === "string") {
      if (prop === "length") return obj.length;
      const I = this;
      const m = { toUpperCase: () => obj.toUpperCase(), toLowerCase: () => obj.toLowerCase(), trim: () => obj.trim() }[prop];
      if (m) return this.native(prop, function* () { return m(); });
      if (/^\d+$/.test(prop)) return obj[+prop];
      throw new Unsupported(`Line ${line}: the string method "${prop}" is outside what this widget animates`);
    }
    if (Array.isArray(obj)) {
      if (prop === "length") return obj.length;
      if (/^\d+$/.test(prop)) return obj[+prop];
      if (prop === "push") return this.native("push", function* (a) { obj.push(...a); return obj.length; });
      throw new Unsupported(`Line ${line}: the array method "${prop}" is outside what this widget animates`);
    }
    if (obj instanceof JObj) {
      if (prop in obj.props) return obj.props[prop];
      if (obj === this.global.vars.get("document")?.v || obj === this.global.vars.get("console")?.v || obj === this.global.vars.get("Math")?.v)
        throw new Unsupported(`Line ${line}: "${prop}" is outside what this widget animates`);
      return undefined;
    }
    if (isFn(obj)) {
      if (prop in (obj.props || {})) return obj.props[prop];
      if (prop === "name") return obj.name || "";
      if (obj.isNative && obj.name === "Promise") throw new Unsupported(`Line ${line}: Promise.${prop} is outside what this widget animates`);
      return undefined;
    }
    return undefined;
  }
  envFind(name) { return this.curEnv ? this.curEnv.find(name) : this.global.find(name); }
  *ev(n, env) {
    switch (n.type) {
      case "Lit": return n.value;
      case "Tpl": {
        let out = n.quasis[0];
        for (let i = 0; i < n.exprs.length; i++) out += toStr(yield* this.ev(n.exprs[i], env)) + n.quasis[i + 1];
        return out;
      }
      case "Ident": {
        const b = env.find(n.name);
        if (!b) {
          if (UNSUPPORTED_GLOBALS.has(n.name)) throw new Unsupported(`Line ${n.line}: "${n.name}" is outside what this widget animates`);
          throw new Throw(mkErr("ReferenceError", `${n.name} is not defined`));
        }
        if (!b.init) throw new Throw(mkErr("ReferenceError", `Cannot access '${n.name}' before initialization`));
        return b.v;
      }
      case "Member": {
        const o = yield* this.ev(n.obj, env);
        const prop = n.computed ? toStr(yield* this.ev(n.computed, env)) : n.prop;
        return this.getProp(o, prop, n.line);
      }
      case "Call": {
        let fn, self;
        if (n.callee.type === "Member") {
          self = yield* this.ev(n.callee.obj, env);
          const prop = n.callee.computed ? toStr(yield* this.ev(n.callee.computed, env)) : n.callee.prop;
          fn = this.getProp(self, prop, n.line);
        } else fn = yield* this.ev(n.callee, env);
        const args = [];
        for (const a of n.args) args.push(yield* this.ev(a, env));
        if (!isFn(fn)) throw new Throw(mkErr("TypeError", `${snippet(n.callee, this.src, 30)} is not a function`));
        this.callLine = n.cline || n.line;
        const v = yield* this.call(fn, self, args);
        this.callLine = n.cline || n.line;
        return v;
      }
      case "New": {
        const ctor = yield* this.ev(n.callee, env);
        const args = [];
        for (const a of n.args) args.push(yield* this.ev(a, env));
        if (!ctor || !ctor.construct) {
          if (ctor && ctor.isClosure) throw new Unsupported(`Line ${n.line}: new on your own function is outside what this widget animates`);
          throw new Throw(mkErr("TypeError", `${snippet(n.callee, this.src, 30)} is not a constructor`));
        }
        this.callLine = n.line;
        return yield* ctor.construct(args, n);
      }
      case "Func": return this.closure(n, env);
      case "Unary": {
        if (n.op === "typeof") {
          if (n.arg.type === "Ident" && !env.find(n.arg.name)) return "undefined";
          const v = yield* this.ev(n.arg, env);
          return v === null ? "object" : isFn(v) ? "function" : typeof v === "object" ? "object" : typeof v;
        }
        const v = yield* this.ev(n.arg, env);
        return n.op === "!" ? !truthy(v) : n.op === "-" ? -toNum(v) : toNum(v);
      }
      case "Update": {
        const old = toNum(yield* this.ev(n.arg, env));
        const nv = n.op === "++" ? old + 1 : old - 1;
        yield* this.assignTo(n.arg, nv, env);
        return n.prefix ? nv : old;
      }
      case "Binary": {
        const a = yield* this.ev(n.left, env), b = yield* this.ev(n.right, env);
        switch (n.op) {
          case "+": return typeof a === "string" || typeof b === "string" || (typeof a === "object" && a !== null) || (typeof b === "object" && b !== null) ? toStr(a) + toStr(b) : toNum(a) + toNum(b);
          case "-": return toNum(a) - toNum(b);
          case "*": return toNum(a) * toNum(b);
          case "/": return toNum(a) / toNum(b);
          case "%": return toNum(a) % toNum(b);
          case "===": return a === b || (Number.isNaN(a) && false);
          case "!==": return a !== b;
          case "==": return looseEq(a, b);
          case "!=": return !looseEq(a, b);
          case "<": return typeof a === "string" && typeof b === "string" ? a < b : toNum(a) < toNum(b);
          case ">": return typeof a === "string" && typeof b === "string" ? a > b : toNum(a) > toNum(b);
          case "<=": return typeof a === "string" && typeof b === "string" ? a <= b : toNum(a) <= toNum(b);
          case ">=": return typeof a === "string" && typeof b === "string" ? a >= b : toNum(a) >= toNum(b);
        }
        break;
      }
      case "Logical": {
        const a = yield* this.ev(n.left, env);
        if (n.op === "&&") return truthy(a) ? yield* this.ev(n.right, env) : a;
        if (n.op === "||") return truthy(a) ? a : yield* this.ev(n.right, env);
        return a ?? (yield* this.ev(n.right, env));
      }
      case "Cond": return truthy(yield* this.ev(n.test, env)) ? yield* this.ev(n.cons, env) : yield* this.ev(n.alt, env);
      case "Assign": {
        let v = yield* this.ev(n.value, env);
        if (n.op !== "=") {
          const old = yield* this.ev(n.target, env);
          v = n.op === "+=" ? (typeof old === "string" || typeof v === "string" ? toStr(old) + toStr(v) : toNum(old) + toNum(v)) : n.op === "-=" ? toNum(old) - toNum(v) : n.op === "*=" ? toNum(old) * toNum(v) : toNum(old) / toNum(v);
        }
        yield* this.assignTo(n.target, v, env);
        return v;
      }
      case "Await": {
        const v = yield* this.ev(n.arg, env);
        this.awaitLine = n.line;
        const r = yield { await: v };
        if (!r.ok) throw new Throw(r.value);
        this.note(`The await on line ${n.line} hands back ${inspect(r.value)}.`);
        return r.value;
      }
      case "Arr": { const out = []; for (const e of n.elems) out.push(yield* this.ev(e, env)); return out; }
      case "Obj": { const o = new JObj(); for (const p of n.props) o.props[p.key] = yield* this.ev(p.value, env); return o; }
    }
    throw new Unsupported(`Line ${n.line}: this expression is outside what this widget animates`);
  }
  *assignTo(t, v, env) {
    if (t.type === "Ident") {
      const b = env.find(t.name);
      if (!b) { this.global.vars.set(t.name, { v, kind: "var", init: true }); return; }
      if (!b.init) throw new Throw(mkErr("ReferenceError", `Cannot access '${t.name}' before initialization`));
      if (b.kind === "const") throw new Throw(mkErr("TypeError", "Assignment to constant variable."));
      b.v = v;
      return;
    }
    const o = yield* this.ev(t.obj, env);
    const prop = t.computed ? toStr(yield* this.ev(t.computed, env)) : t.prop;
    if (o instanceof JObj) { o.props[prop] = v; return; }
    if (Array.isArray(o) && /^\d+$/.test(prop)) { o[+prop] = v; return; }
    if (o == null) throw new Throw(mkErr("TypeError", `Cannot set properties of ${o} (setting '${prop}')`));
  }
  // ----- the event loop -----
  uncaught(e) {
    const v = e.v;
    this.print(`Uncaught ${isErr(v) ? `${v.props.name}: ${v.props.message}` : fmtTop(v)}`, "error");
  }
  /** Runs a callback as the start of a task or a microtask: one step shows it taken from its queue. */
  runCallback(fn, args, frameLabel, caption, line, job) {
    const frame = { label: frameLabel, role: fn.isClosure ? (fn.role || fn.name || "function") : null };
    if (fn.isNative) {
      this.stack.push(frame);
      let out, err = null;
      try { out = this.drive(this.call(fn, undefined, args)); }
      catch (e) { if (!(e instanceof Throw)) { this.stack.pop(); throw e; } err = e; }
      if (err) { out = undefined; this.notes.push("__THROW__"); this.lastErr = err; }
      this.notes = this.notes.filter((x) => x !== "__THROW__");
      this.snap("job", line, { caption, job });
      this.stack.pop();
      if (err) throw err;
      return out;
    }
    this.stack.push(frame);
    this.snap("job", line, { caption, job });
    this.stack.pop();
    return this.drive(this.call(fn, undefined, args));
  }
  runJob(j, first) {
    const pre = first && this.afterScript ? "The script's last line has run and the call stack is empty, so the microtask queue drains before any timer. " : "";
    if (j.type === "thenable") {
      const { resolve, reject } = this.resolvingFns(j.p);
      this.thenImpl(j.t, resolve, reject, "then", j.t.line, true);
      this.snap("job", j.t.line, { caption: `${pre}Promise internals (one microtask): ${j.p.name} takes on the state of ${j.t.name}, the promise the handler returned. Returning a promise costs extra microtasks.` });
      return;
    }
    if (j.type === "call") {
      try { this.runCallback(j.fn, [], j.label, `${pre}The call stack is empty, so the next microtask runs: ${j.label}.`, j.fn.isClosure ? j.fn.node.line : 1); }
      catch (e) { if (!(e instanceof Throw)) throw e; this.uncaught(e); this.snap("job", j.fn.node ? j.fn.node.line : 1, { caption: "The error is not caught; this callback stops here." }); }
      return;
    }
    const { r, arg, src } = j;
    const c = r.cap ? r.cap.p : null;
    const job = { cap: c ? c.id : null, src: src.id, type: r.type, hasHandler: !!r.handler, kind: r.kind };
    this.hot = { from: src.id, to: c ? c.id : null };
    if (!r.handler) {
      this.drive(this.call(r.type === "fulfill" ? r.cap.fns.resolve : r.cap.fns.reject, undefined, [arg]));
      this.notes = [];
      const internal = c.internal;
      this.snap("job", r.line, {
        caption: internal
          ? `${pre}Promise internals (one microtask): the value moves along.`
          : `${pre}Microtask: .${r.kind} on line ${r.line} has no ${r.type === "fulfill" ? "success" : "rejection"} handler, so the ${r.type === "fulfill" ? "value" : "reason"} ${inspect(arg)} passes on and ${c.name} is ${c.state}${c.state === "pending" ? "" : ` with ${inspect(c.value)}`}.`,
        job,
      });
      return;
    }
    const h = r.handler;
    const hl = h.isClosure ? h.node.line : r.line;
    const isAwait = r.kind === "await";
    const what = isAwait
      ? `${pre}${r.type === "fulfill" ? "The awaited promise is fulfilled" : "The awaited promise is rejected"}, so the async function resumes after the await on line ${r.line}.`
      : r.labels ? `${pre}The call stack is empty, so the next microtask runs: the .finally handler.`
      : `${pre}The call stack is empty, so the next microtask runs: ${h.isClosure ? `the ${h.role}${h.name ? ` ${h.name}` : ""} on line ${hl}` : `${h.name}`} with ${inspect(arg)}.`;
    let out;
    try {
      out = this.runCallback(h, [arg], h.isClosure ? (h.name || h.role) : h.name, what, hl, job);
    } catch (e) {
      if (!(e instanceof Throw)) throw e;
      if (c) {
        this.drive(this.call(r.cap.fns.reject, undefined, [e.v]));
        this.notes = [];
        if (!c.internal) { this.note(`The handler threw ${inspect(e.v)}, so ${c.name} (the promise .${r.kind} returned) is rejected; the reason skips forward to the next rejection handler.`); this.noteMoved(c); }
        this.hot = { from: src.id, to: c.id };
        this.snap("settle", hl, { job: { ...job, after: true } });
      } else { this.uncaught(e); this.snap("job", hl, { caption: "The error is not caught." }); }
      return;
    }
    if (c) {
      const before = this.notes.length;
      this.drive(this.call(r.cap.fns.resolve, undefined, [out]));
      const extra = this.notes.slice(before);
      this.notes = this.notes.slice(0, before);
      if (!c.internal) {
        if (r.labels) this.note(extra.length ? "" : "");
        else if (isProm(out)) this.note(`The handler returned a promise (${out.name}), so ${c.name} waits to adopt its state.`);
        else this.note(`The handler returned ${inspect(out)}, so ${c.name} (the promise .${r.kind} returned) is fulfilled with ${inspect(out)}.`);
        this.noteMoved(c);
      }
      if (this.notes.length && !c.internal) { this.hot = { from: src.id, to: c.id }; this.snap("settle", hl, { job: { ...job, after: true } }); }
      else this.notes = [];
    } else if (this.notes.length) this.snap("settle", hl);
  }
  drain() {
    let first = true;
    while (this.micro.length) {
      const j = this.micro.shift();
      this.runJob(j, first);
      first = false;
      this.afterScript = false;
    }
    // Rejections nobody handled during this task are reported by a task queued behind the ready timers.
    for (const p of this.unhandled) this.timers.push({ report: true, promise: p, at: this.now, seq: ++this.seq, label: `report the unhandled rejection of ${p.name}` });
    this.unhandled = [];
  }
  run() {
    let ast;
    try { ast = parseProgram(this.src); }
    catch (e) { if (e instanceof ParseErr) return { error: e.message }; throw e; }
    try {
      this.stack = [{ label: "script", role: "script" }];
      try { this.drive(this.execList(ast.body, this.global, this.global)); }
      catch (e) {
        if (!(e instanceof Throw)) throw e;
        this.uncaught(e);
        this.snap("stmt", this.callLine, { caption: `Nothing catches the error, so the rest of the script does not run. Timers and handlers already queued still run.` });
      }
      this.stack = [];
      this.afterScript = true;
      this.drain();
      let guard = 0;
      while (this.timers.length && guard++ < 400) {
        this.timers.sort((a, b) => a.at - b.at || a.seq - b.seq);
        const onlyIntervals = this.timers.every((t) => t.interval) && this.timers.every((t) => t.fires >= 3);
        if (onlyIntervals) { this.intervalStop = true; break; }
        const t = this.timers.shift();
        if (t.at > 120000) { this.timers.unshift(t); this.halted = "stopped: the next timer is more than 2 minutes away"; break; }
        const waited = t.at > this.now;
        this.now = Math.max(this.now, t.at);
        if (t.report) {
          if (t.promise.handled) continue;
          const v = t.promise.value;
          this.print(`Uncaught (in promise) ${isErr(v) ? `${v.props.name}: ${v.props.message}` : fmtTop(v)}`, "error", null);
          this.snap("report", t.promise.line, { caption: `No handler took the rejection of ${t.promise.name}, so the browser reports it in the console: Uncaught (in promise) ${fmtTop(isErr(v) ? toStr(v) : v)}. Other code keeps running.` });
          continue;
        }
        const pre = this.afterScript ? "The script's last line has run, the call stack is empty and no microtask is waiting, so" : "The call stack is empty and no microtask is waiting, so";
        const zero = t.ms === 0 ? " Even with 0 ms it had to wait for the empty stack." : "";
        this.afterScript = false;
        t.fires++;
        try {
          this.runCallback(t.fn, t.args, t.fn.isClosure ? (t.fn.name || t.fn.role) : t.fn.name, `${pre} one timer callback runs: ${t.label}, ready at ${t.at} ms${waited ? ` (the clock moves on to ${this.now} ms)` : ""}.${zero}`, t.line, { timer: true });
        } catch (e) {
          if (!(e instanceof Throw)) throw e;
          this.uncaught(e);
          this.snap("stmt", this.callLine, { caption: "Nothing catches the error, so this callback stops here; the event loop carries on." });
        }
        if (this.notes.length) this.snap("settle", t.line);
        if (t.interval && !this.cleared.has(t.id)) { t.at += t.ms || 1; t.seq = ++this.seq; this.timers.push(t); }
        this.drain();
      }
    } catch (e) {
      if (e instanceof Halt) this.halted = e.message;
      else if (e instanceof Unsupported) return { error: e.message };
      else throw e;
    }
    let tail;
    if (this.halted) tail = `The widget ${this.halted}.`;
    else if (this.intervalStop) tail = `setInterval keeps firing every ${this.timers[0].ms} ms forever because it is never cleared; nothing new happens, so the widget stops after ${this.timers[0].fires} runs.`;
    else tail = "Both queues are empty and the call stack is empty: the program is done.";
    if (this.usedRandom) tail += ` Math.random() is fixed to ${RANDOMS.slice(0, Math.min(this.ri, RANDOMS.length)).join(", ")} here so the run repeats; a real run varies.`;
    this.stack = [];
    this.notes = [];
    try { this.snap("end", null, { caption: tail }); } catch (e) { /* step cap reached: keep the last step */ }
    return { steps: this.steps, cons: this.cons, halted: this.halted };
  }
}
export function runProgram(src) { return new Interp(src).run(); }

// ---------- preset programs (slide programs verbatim; quiz shapes rewritten with new values) ----------
const P = (src) => src.replace(/^\n/, "").replace(/\s+$/, "") + "\n";
const PROGRAMS = {
  "1-3-2": { title: "lecture 1, slide 162: 1 3 2 (1000 ms)", src: P(`
console.log(1);
setTimeout(function () {
    console.log(2);
}, 1000);
console.log(3);
`) },
  "1-3-2-zero": { title: "lecture 1, slide 162: 1000 replaced with 0", src: P(`
console.log(1);
setTimeout(function () {
    console.log(2);
}, 0);
console.log(3);
`) },
  "l6-s17": { title: "lecture 6, slide 17: the gray slide (reject, then resolve)", src: P(`
let promise = new Promise(
    (resolve, reject)=> {
      // some condition to decide outcome of promise (reject or resolve)
      reject("Rejected!");
      resolve("Resolved!");
    }
);
promise.then(
    (resolveMes)=> {
      console.log(resolveMes);
    }
    ,
    (rejectMes)=> {
      console.log(rejectMes)
    }
);
`) },
  "l6-ex1": { title: "lecture 6, slide 21: Example 1", src: P(`
let promise = new Promise(
    function (resolve, reject) {
        // do some stuff
        console.log("2 called immediately ");
        resolve("4 Resolved!");// called asynchronously & mutually exclusive
        reject("3 Rejected!");// called asynchronously & mutually exclusive
        console.log("5 called immediately ");//pending ..
    }
);
console.log("1 Main execution stack");
promise.then(
    function (resMessage) {
        console.log(resMessage);
    },
    function (rejMessage) {
        console.log(rejMessage)
    }
);
`) },
  "l6-ex2": { title: "lecture 6, slide 22: Example 2", src: P(`
console.log("7");
let promise = new Promise(
    function (resolve, reject) {
        resolve("4");
        console.log("2");
        reject("3");
        console.log("5");
    }
);
console.log("1");
promise.then(
    function (resMessage) {
        console.log(resMessage);
    },
    function (rejMessage) {
        console.log(rejMessage)
    }
);
console.log("8");
`) },
  "l6-ex3": { title: "lecture 6, slide 23: Example 3", src: P(`
let promise = new Promise(
    function (resolve, reject) {
        console.log(" 2 ");
        reject(" 3 ");
        resolve(" 4 ");
        console.log(" 5 ");
    }
);
promise.then(
    function (st) {
        console.log(st);
    },
    function (st) {
        console.log(st)
    }
);
console.log(" 1 ");
`) },
  "l6-ex4": { title: "lecture 6, slide 24: Example 4 (setInterval)", src: P(`
// How many times "Hi" will be logged?
let promise = new Promise((res) => {
    setInterval(() => {
        res("Hi");
    }, 100);
});
promise.then((mes)=>{console.log(mes)});
`) },
  "l6-ex5": { title: "lecture 6, slide 25: Example 5 (Promise.resolve)", src: P(`
Promise.resolve().then(() => console.log(1));
console.log(2);
`) },
  "l6-ex6": { title: "lecture 6, slide 27: Example 6 (chain)", src: P(`
new Promise(resolve => {
  resolve(1);
})
  .then(a => {
    console.log("First:", a);
    return a * 2;
  })
  .then(b => {
    console.log("Second:", b);
    return b * 3;
  })
  .then(c => {
    console.log("Final:", c);
  });
`) },
  "l6-ex7": { title: "lecture 6, slide 28: Example 7 (wait(0) vs microtasks)", src: P(`
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(0).then(() => console.log(2));
Promise.resolve().then(() => console.log(3)).then(() => console.log(1));
console.log(4);
`) },
  "l6-ex8": { title: "lecture 6, slide 29: Example 8 (catch)", src: P(`
const p = new Promise((resolve, reject) => {
  const success = false;
  if (success) {
    resolve("Everything worked!");
  } else {
    reject("Something went wrong");
  }
});

p.then(result => {
  console.log("SUCCESS:", result);
})
  .catch(error => {
    console.log("ERROR:", error);
  });
`) },
  "l6-ex8-nocatch": { title: "lecture 6, slide 29, Q2: Example 8 with catch() removed", src: P(`
const p = new Promise((resolve, reject) => {
  const success = false;
  if (success) {
    resolve("Everything worked!");
  } else {
    reject("Something went wrong");
  }
});

p.then(result => {
  console.log("SUCCESS:", result);
});
`) },
  "l6-ex9-s30": { title: "lecture 6, slide 30: Example 9 (chain)", src: P(`
new Promise(resolve => {
  resolve(1);
})
  .then(num => {
    console.log("First:", num);
    return num * 2;
  })
  .then(num => {
    console.log("Second:", num);
    return num * 3;
  })
  .then(finalValue => {
    console.log("Final:", finalValue);
  });
`) },
  "l6-ex10-s32": { title: "lecture 6, slide 32: Example 10 (timer, then chain)", src: P(`
new Promise(resolve => {
  setTimeout(() => resolve(2), 500);
})
  .then(num => {
    console.log("First:", num);
    return num * 3;
  })
  .then(num => {
    console.log("Second:", num);
    return num + 1;
  })
  .then(finalValue => {
    console.log("Final:", finalValue);
  });
`) },
  "l6-ex11": { title: "lecture 6, slide 34: Example 11 (random delays)", src: P(`
f1 = () =>{console.log(1)};
f2 = () =>{console.log(2)};
f3 = () =>{console.log(3)};

// async() does things asynchronously for us
function async(callMeBack) {
    setTimeout(() => {
        callMeBack();
    }, Math.floor(Math.random() * 1000)
    );
}
//we want f1,f2 and f3 execute in f1,f2, f3
// asynchronously How can we guarantee ?
// would below work? if not what to do?
async(f1);
async(f2);
async(f3);
`) },
  "l6-ex12": { title: "lecture 6, slides 36–37: Example 12 (status after 5 s)", src: P(`
let promise = new Promise(function (resolve, reject) {
    setTimeout(() => resolve("status changed now!"), 5000);
});
promise.then(alert);
`) },
  "l6-ex9-s38": { title: "lecture 6, slide 38: default resolve", src: P(`
let promise = new Promise(function(resolve, reject) {
  resolve ("nicely done!");
});
`) },
  "l6-ex10-s39": { title: "lecture 6, slide 39: default reject (no handler)", src: P(`
let promise = new Promise(function(resolve, reject) {
  console.log("Doing something before rejection");
  reject ("Whoops!");
});
`) },
  "l6-s44": { title: "lecture 6, slide 44: one function passed to .then", src: P(`
function foo(st) {
    document.write(st)
}
let promise = new Promise(function (resolveFunc, rejectFunc) {
    resolveFunc("<h1>H</h1>ello ");
})
promise.then(foo);
`) },
  "l6-s45": { title: "lecture 6, slide 45: resolve(1) now, resolve(2) after 1 s", src: P(`
let promise = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
    resolve(1);
});
promise.then(alert);
`) },
  "l6-s47-catch": { title: "lecture 6, slide 47: .catch(alert) after 5 s", src: P(`
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 5000);
});

// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // shows "Error: Whoops!" after 5 second
`) },
  "l6-s49-finally": { title: "lecture 6, slide 49: .then then .finally", src: P(`
let pr = new Promise((resolve, reject) => {
    setTimeout(() => resolve("result of resolve "), 5000)
})

    .then(result => alert(result))// <-- .then handles the result
    .finally(() => alert("Promise ready"));
`) },
  "l6-s50-finally": { title: "lecture 6, slides 50–51: reject, .finally, no handler", src: P(`
let pr = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(" Error!..")), 5000)
}).finally(() => document.write("Promise setteled"));
`) },
  "l6-async-await": { title: "lecture 6, slide 52 (the lesson's own example): async / await", src: P(`
async function loadPage() {
  console.log("before await");
  const data = await Promise.resolve("page data");
  console.log("after await:", data);
  return data;
}
console.log("request");
loadPage();
console.log("page keeps going");
`) },
  "sync-executor-timer": { title: "quiz shape: executor, .then and a timer", src: P(`
console.log("kettle on");
let tea = new Promise(function (resolve) {
  console.log("water heating");
  resolve();
  console.log("cups out");
}).then(function () {
  console.log("tea ready");
});
setTimeout(function () {
  console.log("biscuits");
});
console.log("sit down");
`) },
  "nested-microtasks": { title: "quiz shape: microtasks queued by microtasks", src: P(`
setTimeout(() => console.log(10));

new Promise((resolve) => {
  resolve();
  console.log(11);
}).then(() => {
  console.log(12);
  Promise.resolve()
    .then(() => {
      console.log(13);
    })
    .then(() => {
      Promise.resolve().then(() => {
        console.log(14);
      });
    });
});

console.log(15);
`) },
  "timer-in-then": { title: "quiz shape: a timer set inside a .then", src: P(`
console.log("open form");
Promise.resolve().then(() => {
  console.log("note saved");
  setTimeout(() => console.log("autosave timer"), 0);
});
setTimeout(() => console.log("first timer"), 0);
console.log("sync done");
`) },
  "then-in-timer": { title: "quiz shape: a .then inside a timer", src: P(`
setTimeout(() => {
  console.log("timer A");
  Promise.resolve().then(() => console.log("badge updated"));
}, 0);
setTimeout(() => console.log("timer B"), 0);
console.log("sync done");
`) },
  "then-timer-mix": { title: "quiz shape: timer in a .then and .then in a timer", src: P(`
Promise.resolve().then(() => {
  console.log("note saved");
  setTimeout(() => {
    console.log("autosave timer");
  }, 0);
});

setTimeout(() => {
  console.log("badge timer");
  Promise.resolve().then(() => {
    console.log("badge updated");
  });
}, 0);
`) },
  "nested-promise": { title: "quiz shape: a promise inside an executor, logged in a timer", src: P(`
const order = () =>
  new Promise((resolve) => {
    console.log("A");
    let inner = new Promise((resolve) => {
      console.log("B");
      setTimeout(() => {
        console.log("C");
        resolve("late");
        console.log(inner);
      }, 0);
      resolve("early");
    });
    resolve("outer");
    inner.then((v) => console.log(v));
  });
order().then((v) => console.log(v));
console.log("D");
`) },
  "error-then-timers": { title: "quiz shape: an uncaught error, then the timers", src: P(`
setTimeout(function () {
  let note = "B";
  console.log("timer");
  setTimeout(function () {
    console.log("inner timer");
  }, 300);
  console.log("after inner");
}, 700);

if (note === "B") {
  console.log("sync");
}
`) },
  "timer-in-timer": { title: "quiz shape: a 0 ms timer set inside a timer", src: P(`
setTimeout(function () {
  console.log("A");
  setTimeout(function () {
    console.log("C");
  }, 0);
  console.log("B");
}, 300);
console.log("D");
`) },
  "return-error": { title: "quiz shape: return new Error(...) fulfils", src: P(`
Promise.resolve()
  .then(() => {
    return new Error("bad postcode");
  })
  .then(
    (res) => console.log("saved:", res),
    (err) => console.log("rejected handler:", err)
  )
  .catch((err) => console.log("catch:", err));
`) },
  "throw-skips-own-handler": { title: "quiz shape: a throw skips its own .then's error handler", src: P(`
Promise.resolve("address saved")
  .then(
    (msg) => {
      throw new Error("bad postcode");
    },
    (err) => console.log("own handler:", err)
  )
  .catch((err) => console.log("catch:", err.message));
`) },
  "catch-recovers": { title: "quiz shape: .catch recovers the chain", src: P(`
new Promise((resolve) => {
  console.log("hold placed");
  resolve("book 7");
})
  .then((book) => {
    console.log("ready:", book);
    throw new Error("card expired");
  })
  .then(() => console.log("checked out"))
  .catch((err) => {
    console.log("caught:", err.message);
    return "fallback: email sent";
  })
  .then((msg) => console.log(msg))
  .then(null, () => console.log("never runs"));
`) },
  "non-function-passthrough": { title: "quiz shape: .then(7) passes the value through", src: P(`
Promise.resolve(3)
  .then((n) => n * 4)
  .then(7)
  .then((n) => n - 2)
  .then((n) => console.log(n));
`) },
  "finally-passthrough": { title: "quiz shape: .finally gets no argument and passes the value on", src: P(`
new Promise((resolve) => {
  resolve("table for 2");
  resolve("table for 4");
})
  .then((res) => {
    console.log(res);
    return "seated";
  })
  .finally((arg) => console.log("finally gets", arg))
  .then((v) => console.log("after finally:", v));
`) },
  "reject-then-handler": { title: "quiz shape: a rejection meets .then(f, g)", src: P(`
Promise.reject("out of stock")
  .then(
    (res) => console.log("success", res),
    (err) => console.log("error", err)
  )
  .catch((err) => console.log("catch", err));
`) },
};
const PRESET_ALIASES = { "1 3 2": "1-3-2", "132": "1-3-2", "l1-s162": "1-3-2", "1 3 2 (0 ms)": "1-3-2-zero", "1-3-2-0": "1-3-2-zero", "l6-ex9": "l6-ex9-s30", "l6-ex10": "l6-ex10-s32", "l6-s49": "l6-s49-finally", "l6-s50": "l6-s50-finally", "l6-s47": "l6-s47-catch", "async-await": "l6-async-await" };
const normPreset = (p) => { const k = String(p || "").trim(); return PROGRAMS[k] ? k : PRESET_ALIASES[k] || PRESET_ALIASES[k.toLowerCase()] || null; };
const EL_PRESETS = ["1-3-2", "1-3-2-zero", "l6-s17", "l6-ex1", "l6-ex2", "l6-ex3", "l6-ex4", "l6-ex5", "l6-ex6", "l6-ex7", "l6-ex8", "l6-ex8-nocatch", "l6-ex9-s30", "l6-ex10-s32", "l6-ex11", "l6-ex12", "l6-s45", "l6-s47-catch", "l6-s49-finally", "l6-s50-finally", "l6-async-await", "sync-executor-timer", "nested-microtasks", "timer-in-then", "then-in-timer", "then-timer-mix", "nested-promise", "error-then-timers", "timer-in-timer"];
const PC_STATE = ["l6-s17", "l6-ex1", "l6-ex2", "l6-ex3", "l6-ex4", "l6-ex5", "l6-ex12", "l6-ex9-s38", "l6-ex10-s39", "l6-s44", "l6-s45"];
const PC_CHAIN = ["l6-ex6", "l6-ex8", "l6-ex8-nocatch", "l6-ex9-s30", "l6-ex10-s32", "l6-s47-catch", "l6-s49-finally", "l6-s50-finally", "return-error", "throw-skips-own-handler", "catch-recovers", "non-function-passthrough", "finally-passthrough", "reject-then-handler"];
export const __test = { PROGRAMS, runProgram, EL_PRESETS, PC_STATE, PC_CHAIN };

// ---------- shared UI for event-loop-play and promise-chain-play ----------
const PRINT_RE = /console\.(log|info|error|warn)\s*\(|alert\s*\(|document\.write\s*\(/;
const ROLE_RULE = (role) => {
  const r = String(role || "");
  if (/timer|interval/.test(r)) return "it is inside a timer callback, and a timer callback runs only when the call stack is empty and every microtask has drained";
  if (/handler|resume|microtask|then|catch|finally/.test(r)) return "it is inside a promise handler, which waits in the microtask queue until the current call stack is empty";
  return "the synchronous code runs top to bottom first, executor included";
};
function programPlayer(box, cfg, widget) {
  injectCss();
  const isPC = widget === "promise-chain-play";
  let mode = isPC ? (cfg.mode === "chain" ? "chain" : cfg.mode === "state" ? "state" : null) : null;
  const custom = typeof cfg.code === "string" && cfg.code.trim() ? cfg.code : null;
  let preset = normPreset(cfg.preset);
  if (isPC && !mode) mode = preset && PC_CHAIN.includes(preset) ? "chain" : "state";
  const list = () => (isPC ? (mode === "chain" ? PC_CHAIN : PC_STATE) : EL_PRESETS);
  if (!custom && (!preset || (isPC && !PC_CHAIN.includes(preset) && !PC_STATE.includes(preset)))) preset = isPC ? (mode === "chain" ? "l6-ex9-s30" : "l6-ex1") : "1-3-2";
  let src = custom || PROGRAMS[preset].src;
  let res = null, pb = null, qs = new Map(), listingKey = "", lineEls = [], mainId = null;
  const badPreset = cfg.preset && !normPreset(cfg.preset) && !custom ? `Unknown preset "${cfg.preset}"; showing ${preset}.` : "";

  box.append(el("h4", null, cfg.title || (isPC ? (mode === "chain" ? "A promise chain, one microtask at a time" : "One promise's state, step by step") : "The event loop: call stack, microtasks, timers")));
  const top = el("div");
  box.append(top);
  let modeRow = null;
  if (isPC) {
    modeRow = selectRow("mode", [["state", "state: one promise"], ["chain", "chain: .then → .then → …"]], mode, (v) => { mode = v; preset = mode === "chain" ? "l6-ex9-s30" : "l6-ex1"; fillPresets(); presetSel.sel.value = preset; src = PROGRAMS[preset].src; ta.value = src; restart(); });
    top.append(modeRow.row);
  }
  const presetSel = selectRow("program", [], "", (v) => {
    if (v === "__custom") src = custom; else { preset = v; src = PROGRAMS[v].src; }
    ta.value = src; restart();
  });
  function fillPresets() {
    presetSel.sel.innerHTML = "";
    const opts = (custom ? [["__custom", "the lesson's program"]] : []).concat(list().map((k) => [k, `${k}: ${PROGRAMS[k].title}`]));
    for (const [v, t] of opts) { const o = document.createElement("option"); o.value = v; o.textContent = t; presetSel.sel.append(o); }
    presetSel.sel.value = custom && src === custom ? "__custom" : preset;
  }
  fillPresets();
  presetSel.sel.style.cssText = "flex:1 1 200px;min-width:0;width:100%";
  top.append(presetSel.row);
  const det = el("details");
  det.append(el("summary", "widget-note", "Edit the program"));
  const ta = document.createElement("textarea");
  ta.className = "wweb-code"; ta.value = src; ta.spellcheck = false;
  ta.setAttribute("aria-label", "Program source");
  const runB = el("button", "viz-btn", "Run this program");
  runB.type = "button";
  det.append(ta, sty(el("div", "wweb-row"), ""), runB);
  top.append(det);
  const { caption, ask } = playParts();
  const pk = predictKit(ask, isPC ? "Predict: fulfilled or rejected, and which handler runs next" : "Predict: which line prints next? (click it in the program)", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const err = el("div", "wweb-err");
  const grid = el("div", "wweb-grid");
  const listing = el("pre", "wweb-listing");
  const right = el("div");
  grid.append(listing, right);
  const cols = el("div", "wweb-cols");
  const mk = (title) => { const c = el("div", "wweb-col"); c.append(el("h5", null, title)); const body = el("div"); c.append(body); cols.append(c); return body; };
  let pPanel = null;
  if (isPC) { pPanel = el("div"); right.append(pPanel); }
  const colStack = isPC ? null : mk("call stack");
  const colMicro = mk("microtask queue");
  const colTimers = mk(isPC ? "timers" : "timer (macrotask) queue");
  const colCons = mk("console");
  right.append(cols);
  const time = el("div", "wweb-time");
  const statsHost = el("div");
  const stats = statGrid(statsHost);
  box.append(pk.row, err, grid, time, caption, ask);
  const note = el("p", "widget-note");

  function buildListing() {
    const lines = src.replace(/\s+$/, "").split("\n");
    const key = lines.join("\n");
    if (key === listingKey) return;
    listingKey = key; listing.innerHTML = ""; lineEls = [];
    lines.forEach((t, i) => {
      const row = el("div", "wweb-line");
      row.append(el("span", "ln", String(i + 1)), el("span", "tx", t || " "));
      row.dataset.n = i + 1;
      row.addEventListener("click", (e) => clickLine(i + 1, e));
      row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clickLine(i + 1, e); } });
      listing.append(row);
      lineEls.push(row);
    });
  }
  function clickLine(n, e) {
    const q = pk.nextQ();
    if (!pk.asking(pb.pos()) || !qs.has(q) || qs.get(q).type !== "line" || !PRINT_RE.test(lineEls[n - 1].textContent)) return;
    pk.pick(n === qs.get(q).answer, `line ${n}`, e);
  }
  function whyLine(lab) {
    const n = parseInt(String(lab).replace(/\D+/g, ""), 10);
    const q = pk.nextQ();
    const later = res.cons.find((c) => c.line === n && c.step >= q && c.kind !== "error");
    if (later) return `Line ${n} prints later: ${ROLE_RULE(res.steps[later.step] && res.steps[later.step].role)}.`;
    if (res.cons.some((c) => c.line === n && c.step < q)) return `Line ${n} has already printed.`;
    return `Line ${n} does not print in this run (its function never runs, or a settled promise ignores the call).`;
  }
  function buildQuestions() {
    qs = new Map();
    const steps = res.steps;
    const vis = (st, id) => st.promises.find((p) => p.id === id);
    mainId = null;
    if (isPC) { const last = steps[steps.length - 1]; if (last && last.promises.length) mainId = last.promises[0].id; }
    for (let i = 0; i < steps.length; i++) {
      const st = steps[i], prev = steps[i - 1];
      if (!isPC) {
        const prevC = prev ? prev.cons : 0;
        if (st.cons > prevC) {
          const c = res.cons[prevC];
          if (c && c.line && c.kind !== "error") qs.set(i, { type: "line", answer: c.line });
        }
        continue;
      }
      // promise-chain-play: settle questions first, then "which handler runs next?"
      let settle = null;
      if (prev) for (const p of st.promises) {
        if (mode === "state" && p.id !== mainId) continue;
        const o = vis(prev, p.id);
        if (o && o.state === "pending" && p.state !== "pending") { settle = { p, ans: p.state }; break; }
      }
      if (!settle && st.flash && (mode === "chain" || st.flash.id === mainId) && prev && vis(prev, st.flash.id)) settle = { p: vis(st, st.flash.id), ans: "ignored: already settled" };
      if (settle) { qs.set(i, { type: "settle", name: settle.p.name, answer: settle.ans }); continue; }
      const j = st.job;
      if (st.kind === "job" && j && !j.after && j.src != null && j.kind !== "await") {
        if (mode === "state") {
          if (j.src === mainId && j.hasHandler) qs.set(i, { type: "handler2", answer: j.type === "fulfill" ? "success handler (1st argument)" : "rejection handler (2nd argument / .catch)" });
        } else if (j.cap != null && vis(st, j.cap)) qs.set(i, { type: "handler", answer: j.cap });
      }
    }
    pk.setSteps([...qs.keys()]);
  }
  function itemList(body, items, cls) {
    const key = JSON.stringify(items);
    if (body.dataset.k === key) return;
    body.dataset.k = key; body.innerHTML = "";
    if (!items.length) { body.append(sty(el("div", "widget-note", "(empty)"), "margin:0;font-size:12px")); return; }
    for (const it of items) {
      const d = el("div", "wweb-item" + (it.cls ? " " + it.cls : ""));
      d.append(it.text);
      if (it.at) d.append(el("span", "at", " " + it.at));
      body.append(d);
    }
  }
  function promisePanel(st, s) {
    const ps = st ? st.promises : [];
    const parts = [];
    if (mode === "state") {
      const m = ps.find((p) => p.id === mainId) || ps[0];
      const b = el("div", "wweb-pbox wweb-big" + (st && st.hot && (st.hot.from === (m && m.id)) ? " hot" : ""));
      if (!m) b.append("No promise yet: the program creates it when it runs.");
      else {
        const result = m.state === "pending" ? "undefined" : m.value;
        b.append(el("b", null, `${m.name} · ${m.label}`), el("br"),
          `[[PromiseState]]: "${m.state}"`, el("span", `wweb-pill ${m.state}`, m.state), el("br"),
          `[[PromiseResult]]: ${result}`, el("br"),
          sty(el("span", null, `DevTools: Promise {<${m.state}>${m.state === "pending" ? "" : ": " + m.value}}`), "color:var(--ink-dim)"));
      }
      parts.push(b);
      if (st && st.flash && m && st.flash.id === m.id) parts.push(el("div", "wweb-flash", "⚡ " + st.flash.text));
      const others = ps.filter((p) => !m || p.id !== m.id);
      for (const p of others) {
        const d = el("div", "wweb-pbox");
        d.append(`${p.name} · ${p.label} `, el("span", `wweb-pill ${p.state}`, p.state), p.state === "pending" ? "" : ` ${p.value}`);
        parts.push(d);
      }
      parts.push(sty(el("div", "widget-note", "The slide's older Chrome labels these [[PromiseStatus]] and [[PromiseValue]] and shows \"resolved\" where current Chrome shows \"fulfilled\"."), "margin:4px 0;font-size:12px"));
    } else {
      if (!ps.length) parts.push(el("div", "wweb-pbox", "No promise yet: the program creates them as it runs."));
      for (const p of ps) {
        if (p.parent != null) {
          const v = p.via || {};
          const hot = st && st.hot && st.hot.to === p.id;
          const txt = v.kind === "catch" ? `↓ .catch(${v.r})` : v.kind === "finally" ? `↓ .finally(${v.f})` : `↓ .then(${v.f || "—"}${v.r ? `, ${v.r}` : ""})`;
          const par = ps.find((x) => x.id === p.parent);
          parts.push(el("div", "wweb-link" + (hot ? " hot" : ""), `${txt}${par ? `  from ${par.name}` : ""}`));
        }
        const hot = st && st.hot && (st.hot.to === p.id);
        const d = el("div", "wweb-pbox" + (hot ? " hot" : ""));
        d.append(el("b", null, p.name), ` · ${p.label} `, el("span", `wweb-pill ${p.state}`, p.state), p.state === "pending" ? "" : ` ${p.value}`);
        parts.push(d);
        if (st && st.flash && st.flash.id === p.id) parts.push(el("div", "wweb-flash", "⚡ " + st.flash.text));
      }
    }
    pPanel.innerHTML = "";
    pPanel.append(...parts);
  }
  function frame(pos) {
    if (!res || res.error) return;
    const steps = res.steps, N = steps.length;
    const asking = pk.asking(pos);
    const s = Math.ceil(pos - 1e-9) - 1;
    const u = s >= 0 ? clamp(pos - s, 0, 1) : 1;
    const st = s >= 0 ? steps[Math.min(s, N - 1)] : null;
    const q = asking ? qs.get(pk.nextQ()) : null;
    lineEls.forEach((row, i) => {
      const n = i + 1;
      row.classList.toggle("on", !!(st && st.line === n && !asking));
      const pick = !!(q && q.type === "line" && PRINT_RE.test(row.textContent));
      row.classList.toggle("pick", pick);
      row.classList.toggle("wrong", !!(pick && pk.wrong === `line ${n}`));
      if (pick) { row.tabIndex = 0; row.setAttribute("role", "button"); } else { row.removeAttribute("tabindex"); row.removeAttribute("role"); }
    });
    if (colStack) itemList(colStack, st ? st.stack.slice().reverse().map((l, i) => ({ text: l, cls: i === 0 ? "top" : "" })) : [], "");
    itemList(colMicro, st ? st.micro.map((m, i) => ({ text: m.label, cls: (i === 0 ? "top" : "") + (m.internal ? " dim" : "") })) : []);
    itemList(colTimers, st ? st.timers.map((t) => ({ text: t.report ? t.label : t.label, at: t.report ? "(task)" : `ready at ${t.at} ms`, cls: t.report ? "err" : "" })) : []);
    const nCons = st ? st.cons : 0;
    const prevCons = s > 0 ? steps[s - 1].cons : 0;
    itemList(colCons, res.cons.slice(0, nCons).map((c, i) => ({ text: c.text, cls: (c.kind === "error" ? "err" : "") + (i >= prevCons && u < 1 ? " new" : "") })));
    const maxT = Math.max(1, ...steps.map((x) => x.now));
    const now = st ? st.now : 0;
    const tk = `${now}|${maxT}`;
    if (time.dataset.k !== tk) {
      time.dataset.k = tk; time.innerHTML = "";
      const bar = el("span", "bar"), fill = el("i");
      fill.style.width = `${(100 * now) / maxT}%`;
      bar.append(fill);
      time.append(el("span", null, `elapsed ${now} ms`), bar, el("span", null, `${maxT} ms`));
    }
    if (isPC) promisePanel(st, s);
    stats([["console lines", nCons], ["microtasks pending", st ? st.micro.length : 0], ["timers pending", st ? st.timers.filter((t) => !t.report).length : 0]]);
    let text;
    if (asking && q) {
      if (q.type === "line") text = "Which line prints next? Click it in the program.";
      else if (q.type === "settle") text = `What happens to ${q.name} in the next step?`;
      else text = "Which handler runs next?";
    } else if (!st) text = isPC ? "Press Play. The executor runs synchronously; the .then handlers run after the current script finishes." : "Press Play. The script runs top to bottom first; a callback waits in its queue until the call stack is empty.";
    else {
      text = st.caption || "";
      if (s >= N - 1) text += pk.tally();
    }
    setText(caption, text);
    if (asking && q) {
      if (q.type === "line") pk.render(true, src, null, whyLine);
      else if (q.type === "settle") pk.render(true, src, ["fulfilled", "rejected", "ignored: already settled"].map((L) => ({ label: L, ok: L === q.answer, why: "A promise settles once: resolve() fulfils it, reject() or a throw in the executor rejects it, and any later resolve or reject call is ignored." })));
      else if (q.type === "handler2") pk.render(true, src, ["success handler (1st argument)", "rejection handler (2nd argument / .catch)"].map((L) => ({ label: L, ok: L === q.answer, why: "resolve and reject invoke handlers mutually exclusive: a fulfilled promise runs the first .then argument, a rejected one the second (or .catch)." })));
      else {
        const ps = res.steps[res.steps.length - 1].promises.filter((p) => p.parent != null);
        pk.render(true, src, ps.map((p) => ({ label: `.${p.via.kind} → ${p.name} (line ${p.line})`, ok: p.id === q.answer, why: "Handlers run in the order they reached the microtask queue, and a handler is queued only when its own promise settles. A missing handler for this outcome passes the value or reason on; a throw skips forward to the next rejection handler." })));
      }
    } else pk.render(false);
  }
  function restart() {
    res = runProgram(src);
    buildListing();
    if (res.error) {
      err.textContent = `This program is outside what the widget animates: ${res.error}`;
      grid.hidden = true; time.hidden = true;
      setText(caption, "");
      pk.setSteps([]); pk.reset();
      pb.reset(1);
      return;
    }
    err.textContent = badPreset;
    grid.hidden = false; time.hidden = false;
    buildQuestions();
    pk.reset();
    pb.reset(res.steps.length);
  }
  pb = createPlayback({ count: 1, unit: "event", onFrame: frame, stepMs: () => cfg.stepMs || 1200, limit: () => pk.limit(res && res.steps ? res.steps.length : 1), onBlocked: () => pk.nudge() });
  box.append(pb.el, statsHost);
  note.textContent = isPC
    ? "Interpreted, not run: the widget follows the ECMAScript promise rules (one microtask per handler, extra microtasks when a handler returns a promise or uses .finally). The lesson's runnable copy shows the real output."
    : "Interpreted, not run: one step is one event. Every microtask drains before one timer callback runs. The lesson's runnable copy shows the real output.";
  box.append(note);
  runB.addEventListener("click", () => { src = ta.value; presetSel.sel.value = custom && src === custom ? "__custom" : presetSel.sel.value; restart(); });
  ta.addEventListener("change", () => { src = ta.value; restart(); });
  restart();
}
function eventLoopPlay(box, cfg) { programPlayer(box, cfg || {}, "event-loop-play"); }
function promiseChainPlay(box, cfg) { programPlayer(box, cfg || {}, "promise-chain-play"); }

// ---------- shared: lifelines with numbered messages ----------
/** Draws lanes and the messages of steps 0..s; msg = { from, to, label, cls } (from === to draws a note box on that lane). */
function drawLanes(svg, lanes, msgs, s, u, idBase) {
  const W = 360, top = 30, rowH = 26, n = lanes.length;
  const xs = lanes.map((_, i) => 40 + (i * (W - 80)) / Math.max(1, n - 1));
  const shown = msgs.map((m, i) => ({ m, i })).filter((x) => x.m && x.i <= s);
  const H = top + Math.max(3, msgs.filter(Boolean).length) * rowH + 12;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.innerHTML = "";
  const defs = svgEl("defs");
  for (const [k, col] of [["d", "var(--ink-dim)"], ["h", "var(--hl)"], ["r", "var(--red)"], ["g", "var(--green)"]]) {
    const mk = svgEl("marker", { id: `${idBase}-${k}`, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
    mk.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: col }));
    defs.append(mk);
  }
  svg.append(defs);
  lanes.forEach((l, i) => {
    svg.append(svgEl("text", { x: xs[i], y: 14, "text-anchor": "middle", "font-size": 11.5, "font-weight": 600, fill: "var(--ink)" }, l.name));
    if (l.sub) svg.append(svgEl("text", { x: xs[i], y: 25, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }, l.sub));
    svg.append(svgEl("line", { x1: xs[i], y1: top, x2: xs[i], y2: H - 4, stroke: l.blocked ? "var(--red)" : "var(--rule-strong)", "stroke-width": l.blocked ? 3 : 1.2, "stroke-dasharray": l.blocked ? "" : "3 3" }));
  });
  let row = 0;
  for (const { m, i } of shown) {
    const y = top + 14 + row * rowH;
    row++;
    const cur = i === s;
    const col = m.cls === "bad" ? "var(--red)" : m.cls === "ok" ? "var(--green)" : cur ? "var(--hl)" : "var(--ink-dim)";
    const mkid = m.cls === "bad" ? "r" : m.cls === "ok" ? "g" : cur ? "h" : "d";
    const a = xs[m.from], b = xs[m.to];
    if (m.from === m.to) {
      const w = Math.min(150, 14 + m.label.length * 5.4);
      const x = clamp(a - w / 2, 2, W - w - 2);
      svg.append(svgEl("rect", { x, y: y - 10, width: w, height: 16, rx: 4, fill: cur ? "var(--hl-soft)" : "var(--paper)", stroke: col, "stroke-width": cur ? 1.5 : 1 }));
      svg.append(svgEl("text", { x: x + w / 2, y: y + 2, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink)" }, m.label));
    } else {
      const frac = cur ? clamp(u, 0, 1) : 1;
      const end = a + (b - a) * frac;
      svg.append(svgEl("line", { x1: a, y1: y, x2: end, y2: y, stroke: col, "stroke-width": cur ? 2 : 1.3, "marker-end": frac > 0.15 ? `url(#${idBase}-${mkid})` : "" }));
      const tx = (a + b) / 2;
      svg.append(svgEl("text", { x: tx, y: y - 4, "text-anchor": "middle", "font-size": 9.5, fill: cur ? "var(--ink)" : "var(--ink-2)" }, m.label));
    }
  }
}
/** A scripted stepper: steps = [{ caption, q?: { prompt, opts:[{label, ok, why}] } }]; draw(st, s, u, asking). */
function scripted(box, cfg, opts) {
  const { caption, ask } = playParts();
  let steps = [], pb = null;
  const pk = predictKit(ask, opts.predictLabel, () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  let ready = false;
  function frame(pos) {
    if (!ready) return;
    const asking = pk.asking(pos);
    const s = Math.ceil(pos - 1e-9) - 1;
    const u = s >= 0 ? clamp(pos - s, 0, 1) : 1;
    const st = s >= 0 ? steps[Math.min(s, steps.length - 1)] : null;
    opts.draw(st, s, u, asking);
    const q = asking ? steps[pk.nextQ()].q : null;
    let text = q ? q.prompt : st ? st.caption : opts.intro();
    if (st && s >= steps.length - 1 && !asking) text += pk.tally();
    setText(caption, text);
    if (q) pk.render(true, opts.key(), q.opts); else pk.render(false);
  }
  function restart() {
    steps = opts.build();
    ready = true;
    pk.setSteps(steps.map((x, i) => (x.q ? i : -1)).filter((i) => i >= 0));
    pk.reset();
    pb.reset(steps.length);
  }
  pb = createPlayback({ count: 1, unit: opts.unit || "step", onFrame: frame, stepMs: () => cfg.stepMs || opts.stepMs, limit: () => pk.limit(steps.length), onBlocked: () => pk.nudge() });
  return { pk, caption, ask, pbEl: () => pb.el, restart, steps: () => steps };
}
function checkRow(label, value, onChange) {
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = !!value;
  cb.addEventListener("change", () => onChange(cb.checked));
  row.append(cb, " " + label);
  return { row, cb };
}
function textRow(label, value, onChange, width) {
  const row = el("div", "wweb-row");
  const input = document.createElement("input");
  input.type = "text"; input.value = value; input.spellcheck = false;
  input.setAttribute("aria-label", label);
  if (width) input.style.flex = width;
  input.addEventListener("change", () => onChange(input.value.trim()));
  row.append(el("label", null, label), input);
  return { row, input };
}

// ---------- widget: xhr-play ----------
const RS_NAME = ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"];
const RS_SLIDE = [
  "0 (UNSENT): The XHR object has been created, but open() has not been called yet.",
  "1 (OPENED): open() has been called.",
  "2 (HEADERS_RECEIVED): send() has been called, and the headers of the response are available.",
  "3 (LOADING): The response is being received. As data comes in, the responseText property is updated.",
  "4 (DONE): The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred.",
];
const STATUS_TEXT = { 200: "OK", 404: "Not Found", 500: "Internal Server Error" };
function xhrPlay(box, cfg) {
  injectCss();
  cfg = cfg || {};
  let method = String(cfg.method || "GET").toUpperCase() === "POST" ? "POST" : "GET";
  let url = typeof cfg.url === "string" && cfg.url.trim() ? cfg.url.trim() : "http://localhost:8000/?name=John";
  let isAsync = cfg.async !== false;
  let status = [200, 404, 500].includes(Number(cfg.status)) ? Number(cfg.status) : 200;
  const id = `wx${++uid}`;
  box.append(el("h4", null, cfg.title || "XMLHttpRequest: readyState 0 to 4"));
  const ctl = el("div");
  const mRow = selectRow("method", ["GET", "POST"], method, (v) => { method = v; S.restart(); });
  const sRow = selectRow("server returns", [["200", "200 OK"], ["404", "404 Not Found"], ["500", "500 Internal Server Error"]], String(status), (v) => { status = Number(v); S.restart(); });
  const aRow = checkRow("async (third argument of open)", isAsync, (v) => { isAsync = v; S.restart(); });
  const uRow = textRow("url", url, (v) => { url = v || url; S.restart(); }, "1 1 200px");
  ctl.append(mRow.row, sRow.row, uRow.row, aRow.row);
  box.append(ctl);
  const svg = svgEl("svg", { class: "wweb-svg", role: "img", "aria-label": "Script, XMLHttpRequest and server lifelines" });
  const handler = el("div", "wweb-wire");
  const page = el("div", "wweb-wire");
  const stats = statGrid(el("div"));
  function parts() {
    let host = "localhost:8000", path = "/", search = "";
    try { const u = new URL(url, "http://localhost:8000"); host = u.host; path = u.pathname; search = u.search; } catch (e) { /* keep defaults */ }
    const q = new URLSearchParams(search);
    const name = q.get("name") || q.get("city") || null;
    return { host, path, search, name };
  }
  function build() {
    const p = parts();
    const body = status === 200 ? (p.name ? `Hello ${p.name}` : "Hello") : status === 404 ? "Not Found" : "Internal Server Error";
    const reqLine = method === "GET" ? `GET ${p.path}${p.search} HTTP/1.1` : `POST ${p.path} HTTP/1.1`;
    const sendCall = method === "GET" ? "send()" : `send("${p.search.replace(/^\?/, "") || "name=John"}")`;
    const steps = [];
    const H = (rs, st, extra) => `if (this.readyState == 4 && this.status == 200)  →  ${rs} == 4 && ${st} == 200  →  ${rs === 4 && st === 200}${extra || ""}`;
    const rsQ = (rs, why) => ({ prompt: "What is readyState after this step?", opts: [0, 1, 2, 3, 4].map((n) => ({ label: String(n), ok: n === rs, why: `${why} The slide's list: 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING, 4 DONE.` })) });
    const add = (o) => steps.push(o);
    add({ rs: 0, st: 0, msg: { from: 0, to: 1, label: "new XMLHttpRequest()" }, code: "let xhttp = new XMLHttpRequest();", h: "(no handler yet)", script: "running", caption: `1- Create an XMLHttpRequest Object (just like the way we created Date object). readyState is ${RS_SLIDE[0]}`, q: rsQ(0, "Creating the object does not open anything yet.") });
    add({ rs: 0, st: 0, msg: { from: 0, to: 1, label: "onreadystatechange = function…" }, code: "xhttp.onreadystatechange = function () { … };", h: "handler attached; it runs on every readyState change", script: "running", caption: "2- specify the function that handles response: the handler is attached to the object. Nothing changes state, so readyState stays 0 and the handler does not run.", q: rsQ(0, "Attaching a handler is not a state change.") });
    add({ rs: 1, st: 0, msg: { from: 0, to: 1, label: `open("${method}", url, ${isAsync})` }, code: `xhttp.open("${method}", "${url}", ${isAsync});`, h: H(1, 0, ": the handler ran, nothing happens"), hRuns: 1, script: "running", caption: `3- Open AJAX request: ${RS_SLIDE[1]} The change fires onreadystatechange; the if is false.`, q: rsQ(1, "open() moves the object to OPENED.") });
    if (isAsync) {
      add({ rs: 1, st: 0, msg: { from: 1, to: 2, label: `${reqLine}` }, code: `xhttp.${sendCall};`, h: H(1, 0), hRuns: 1, script: "carries on", wire: `${reqLine}\nHost: ${p.host}${method === "POST" ? `\nContent-Type: text/plain;charset=UTF-8\n\n${p.search.replace(/^\?/, "") || "name=John"}` : ""}`, caption: "4- xhttp.send(): Everything is in place! We just send it and carry on (we don't wait if we sent it asynchronously). readyState is still 1 until the response headers arrive.", q: rsQ(1, "send() does not change readyState; it stays 1 until the headers arrive.") });
      add({ rs: 1, st: 0, msg: { from: 2, to: 2, label: `server answers ${status} ${STATUS_TEXT[status]}` }, h: H(1, 0), hRuns: 1, script: "carries on", caption: `The server receives the request and its script decides the status: ${status} ${STATUS_TEXT[status]}. The browser's script is busy with other work meanwhile.`, q: rsQ(1, "Nothing has reached the browser yet.") });
      add({ rs: 2, st: status, msg: { from: 2, to: 1, label: `HTTP/1.1 ${status} ${STATUS_TEXT[status]} + headers` }, h: H(2, status, ": false"), hRuns: 2, script: "carries on", wire: `HTTP/1.1 ${status} ${STATUS_TEXT[status]}\nContent-Type: text/html`, caption: `${RS_SLIDE[2]} status is now ${status}. The handler runs again; the if is false because readyState is 2.`, q: rsQ(2, "The status line and headers have arrived.") });
      add({ rs: 3, st: status, msg: { from: 2, to: 1, label: "body bytes…" }, h: H(3, status, ": false"), hRuns: 3, script: "carries on", resp: body.slice(0, Math.ceil(body.length / 2)), caption: `${RS_SLIDE[3]} 3 (LOADING) can be reached several times when a large response comes in multiple chunks. The if is still false.`, q: rsQ(3, "The body is arriving.") });
      const okIf = status === 200;
      add({ rs: 4, st: status, msg: { from: 2, to: 1, label: "end of body", cls: okIf ? "ok" : "bad" }, h: H(4, status, okIf ? ": true → innerHTML = this.responseText" : ": false, so nothing is shown"), hRuns: 4, script: "carries on", resp: body, page: okIf ? body : "", caption: `${RS_SLIDE[4]} ${okIf ? "Both checks pass, so the handler puts responseText on the page." : `DONE is reached for any completed response (lecture 6: the w3schools table is inaccurate), so readyState is 4 but status is ${status} and the if fails.`}`, q: rsQ(4, "The whole response has arrived: DONE, whatever the status.") });
    } else {
      add({ rs: 1, st: 0, msg: { from: 1, to: 2, label: `${reqLine}` }, code: `xhttp.${sendCall};`, h: H(1, 0), hRuns: 1, script: "blocked", wire: `${reqLine}\nHost: ${p.host}`, caption: "4- xhttp.send() with async false: the script stops on this line and waits until the whole response is back. Chrome warns that synchronous XMLHttpRequest on the main thread is deprecated.", q: rsQ(1, "send() does not change readyState.") });
      add({ rs: 1, st: 0, msg: { from: 2, to: 2, label: `server answers ${status} ${STATUS_TEXT[status]}` }, h: H(1, 0), hRuns: 1, script: "blocked", caption: `The server decides the status: ${status} ${STATUS_TEXT[status]}. The page cannot run any other code meanwhile: the script lifeline is blocked.`, q: rsQ(1, "Nothing has reached the browser yet.") });
      add({ rs: 1, st: 0, msg: { from: 2, to: 1, label: "status line, headers, body" }, h: H(1, 0), hRuns: 1, script: "blocked", wire: `HTTP/1.1 ${status} ${STATUS_TEXT[status]}\nContent-Type: text/html\n\n${body}`, caption: "The response arrives in one go for a synchronous request: no readystatechange events fire for 2 or 3 while the script is blocked, so the handler sees no change yet.", q: rsQ(1, "A synchronous request fires no events for 2 and 3; the script sees the jump to 4 at the end.") });
      const okIf = status === 200;
      add({ rs: 4, st: status, msg: { from: 1, to: 0, label: "send() returns", cls: okIf ? "ok" : "bad" }, h: H(4, status, okIf ? ": true → innerHTML = this.responseText" : ": false"), hRuns: 2, script: "running again", resp: body, page: okIf ? body : "", caption: `${RS_SLIDE[4]} The handler runs once now, at the end (it also ran at open). ${okIf ? "The if passes." : `DONE is reached for any completed response, so with ${status} the if fails.`} Only then does send() return and the script continue.`, q: rsQ(4, "The request is complete.") });
    }
    return steps;
  }
  const S = scripted(box, cfg, {
    predictLabel: "Predict: what is readyState after each step?",
    stepMs: 1100,
    unit: "step",
    key: () => `${method}|${url}|${isAsync}|${status}`,
    intro: () => "Press Play: the four statements run in the slide's order, then the response comes back.",
    draw(st, s, u) {
      const steps = S.steps();
      drawLanes(svg, [{ name: "script", sub: "your code", blocked: st && st.script === "blocked" }, { name: "XMLHttpRequest", sub: "the xhttp object" }, { name: "server", sub: parts().host }], steps.map((x) => x.msg), s, u, id);
      const code = st && st.code ? st.code : steps.slice(0, s + 1).reverse().find((x) => x.code)?.code;
      setText(handler, "");
      handler.append(el("span", "hl", `readyState ${st ? st.rs : "—"}${st ? ` (${RS_NAME[st.rs]})` : ""}   status ${st ? st.st : 0}`), "\n", `last statement: ${code || "—"}`, "\n", `handler: ${st ? st.h : "(no object yet)"}`);
      const wire = st ? steps.slice(0, s + 1).reverse().find((x) => x.wire)?.wire : "";
      setText(page, "");
      page.append(el("span", null, wire ? `on the wire:\n${wire}` : "on the wire: (nothing yet)"), "\n", el("span", st && st.page ? "ok" : "", `page (#demo): ${st && st.page ? st.page : "(unchanged)"}`), st && st.resp ? `\nresponseText: "${st.resp}"` : "");
      stats([["readyState", st ? `${st.rs} ${RS_NAME[st.rs]}` : "—"], ["status", st ? st.st : 0], ["handler runs", st ? st.hRuns || 0 : 0], ["script", st ? st.script : "not started"]]);
    },
    build,
  });
  box.append(S.pk.row, svg, handler, page, S.caption, S.ask, S.pbEl(), stats.host);
  box.append(sty(el("p", "widget-note", "Status codes from slide 8: 200 \"OK\"; 3xx redirection; 4xx client error (403 \"Forbidden\", 404 \"Not Found\"); 5xx server error. The response text is illustrative."), ""));
  S.restart();
}

// ---------- widget: cors-play ----------
const SAFE_CT = ["text/plain", "application/x-www-form-urlencoded", "multipart/form-data"];
function originParts(o) {
  try { const u = new URL(o); const port = u.port || (u.protocol === "https:" ? "443" : "80"); return { protocol: u.protocol.replace(":", ""), host: u.hostname, port, explicit: !!u.port, origin: u.origin }; }
  catch (e) { return { protocol: "?", host: String(o), port: "?", explicit: false, origin: String(o) }; }
}
function corsPlay(box, cfg) {
  injectCss();
  cfg = cfg || {};
  const absent = (v) => v === null || v === undefined && false || v === "" || v === "none" || v === "absent" || v === false;
  let pageOrigin = cfg.pageOrigin || "http://localhost:3000";
  let apiOrigin = cfg.apiOrigin || "http://localhost:8000";
  let allow = "allowOrigin" in cfg ? (absent(cfg.allowOrigin) ? null : String(cfg.allowOrigin)) : "*";
  let method = ["GET", "POST", "PUT", "DELETE"].includes(String(cfg.method || "").toUpperCase()) ? String(cfg.method).toUpperCase() : "GET";
  let ctype = SAFE_CT.concat(["application/json"]).includes(cfg.contentType) ? cfg.contentType : "text/plain";
  let custom = !!cfg.customHeader;
  let allowMethods = typeof cfg.allowMethods === "string" ? cfg.allowMethods : "GET, POST, OPTIONS";
  let allowHeaders = typeof cfg.allowHeaders === "string" ? cfg.allowHeaders : "Content-Type";
  let client = cfg.client === "postman" ? "postman" : "browser";
  const id = `wc${++uid}`;
  box.append(el("h4", null, cfg.title || "CORS: the browser compares origins and reads one header"));
  const presets = el("div", "viz-btn-row");
  const P = (label, fn) => { const b = el("button", "viz-btn", label); b.type = "button"; b.addEventListener("click", () => { fn(); syncCtl(); S.restart(); }); presets.append(b); };
  P("allowed (*)", () => { client = "browser"; apiOrigin = apiOrigin === pageOrigin ? "http://localhost:8000" : apiOrigin; allow = "*"; method = "GET"; custom = false; });
  P("header absent", () => { client = "browser"; if (apiOrigin === pageOrigin) apiOrigin = "http://localhost:8000"; allow = null; method = "GET"; custom = false; });
  P("JSON POST (preflight)", () => { client = "browser"; if (apiOrigin === pageOrigin) apiOrigin = "http://localhost:8000"; method = "POST"; ctype = "application/json"; allow = "*"; custom = false; });
  P("form POST (no preflight)", () => { client = "browser"; if (apiOrigin === pageOrigin) apiOrigin = "http://localhost:8000"; method = "POST"; ctype = "application/x-www-form-urlencoded"; custom = false; });
  P("PUT, not in Allow-Methods", () => { client = "browser"; if (apiOrigin === pageOrigin) apiOrigin = "http://localhost:8000"; method = "PUT"; ctype = "text/plain"; allow = "*"; allowMethods = "GET, POST, OPTIONS"; custom = false; });
  P("Postman", () => { client = "postman"; });
  P("same origin", () => { client = "browser"; apiOrigin = pageOrigin; });
  box.append(presets);
  const ctl = el("details");
  ctl.append(el("summary", "widget-note", "Change the request and the server's headers"));
  const allowOpts = () => [["*", "*"], [pageOrigin, `${pageOrigin} (the page's origin)`], ["http://example.com", "http://example.com (another origin)"], ["__absent", "(absent: no header)"]];
  const r1 = textRow("page origin A", pageOrigin, (v) => { pageOrigin = v || pageOrigin; refillAllow(); S.restart(); });
  const r2 = textRow("API origin B", apiOrigin, (v) => { apiOrigin = v || apiOrigin; S.restart(); });
  const rC = selectRow("client", [["browser", "browser"], ["postman", "Postman"]], client, (v) => { client = v; S.restart(); });
  const rM = selectRow("method", ["GET", "POST", "PUT", "DELETE"], method, (v) => { method = v; S.restart(); });
  const rT = selectRow("Content-Type", SAFE_CT.slice(0, 2).concat(["application/json"]), ctype, (v) => { ctype = v; S.restart(); });
  const rH = checkRow("add a custom header X-Api-Key", custom, (v) => { custom = v; S.restart(); });
  const rA = selectRow("Access-Control-Allow-Origin", allowOpts(), allow === null ? "__absent" : allow, (v) => { allow = v === "__absent" ? null : v; S.restart(); });
  const rAM = textRow("Allow-Methods", allowMethods, (v) => { allowMethods = v; S.restart(); });
  const rAH = textRow("Allow-Headers", allowHeaders, (v) => { allowHeaders = v; S.restart(); });
  function refillAllow() {
    rA.sel.innerHTML = "";
    const opts = allowOpts();
    if (allow !== null && !opts.some(([v]) => v === allow)) opts.splice(3, 0, [allow, allow]);
    for (const [v, t] of opts) { const o = document.createElement("option"); o.value = v; o.textContent = t; rA.sel.append(o); }
    rA.sel.value = allow === null ? "__absent" : allow;
  }
  refillAllow();
  function syncCtl() { r1.input.value = pageOrigin; r2.input.value = apiOrigin; rC.sel.value = client; rM.sel.value = method; rT.sel.value = ctype; rH.cb.checked = custom; refillAllow(); rAM.input.value = allowMethods; rAH.input.value = allowHeaders; }
  ctl.append(r1.row, r2.row, rC.row, rM.row, rT.row, rH.row, rA.row, rAM.row, rAH.row);
  box.append(ctl);
  const fields = el("div", "wweb-fields");
  const svg = svgEl("svg", { class: "wweb-svg", role: "img", "aria-label": "Page, browser and API server" });
  const wire = el("div", "wweb-wire");
  const cons = el("div", "wweb-wire");
  const statsUpd = statGrid(el("div"));
  function analyse() {
    const A = originParts(pageOrigin), B = originParts(apiOrigin);
    const same = A.origin === B.origin;
    const hasBody = method === "POST" || method === "PUT";
    const reqHeaders = [];
    if (hasBody && !SAFE_CT.includes(ctype)) reqHeaders.push("content-type");
    if (custom) reqHeaders.push("x-api-key");
    const why = [];
    if (!["GET", "HEAD", "POST"].includes(method)) why.push(`the method ${method} is not GET, HEAD or POST`);
    if (hasBody && !SAFE_CT.includes(ctype)) why.push(`Content-Type ${ctype} is not one of text/plain, application/x-www-form-urlencoded, multipart/form-data`);
    if (custom) why.push("it sets a custom header (X-Api-Key)");
    const preflight = client === "browser" && !same && why.length > 0;
    const originOk = allow === "*" || allow === A.origin;
    const list = (s) => s.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    const am = list(allowMethods), ah = list(allowHeaders);
    const methodOk = ["GET", "HEAD", "POST"].includes(method) || am.includes("*") || am.includes(method.toLowerCase());
    const badHeader = reqHeaders.find((h) => !(ah.includes("*") || ah.includes(h)));
    return { A, B, same, hasBody, reqHeaders, why, preflight, originOk, methodOk, badHeader };
  }
  function build() {
    const a = analyse(), steps = [];
    const url = `${apiOrigin.replace(/\/$/, "")}/?name=John`;
    const pre = `Access to XMLHttpRequest at '${url}' from origin '${a.A.origin}' has been blocked by CORS policy: `;
    const originMsg = allow === null ? "No 'Access-Control-Allow-Origin' header is present on the requested resource." : `The 'Access-Control-Allow-Origin' header has a value '${allow}' that is not equal to the supplied origin.`;
    const hdrAllow = allow === null ? "(no Access-Control-Allow-Origin header)" : `Access-Control-Allow-Origin: ${allow}`;
    const sendLine = a.hasBody ? `xhttp.send(body)  (Content-Type: ${ctype})` : "xhttp.send()";
    const reqText = (withOrigin) => `${method} /?name=John HTTP/1.1\nHost: ${a.B.host}:${a.B.port}${withOrigin ? `\nOrigin: ${a.A.origin}` : ""}${a.hasBody ? `\nContent-Type: ${ctype}` : ""}${custom ? "\nX-Api-Key: 12345" : ""}`;
    const qAllowed = (ok, why) => ({ prompt: "Allowed or blocked?", opts: ["allowed", "blocked"].map((L) => ({ label: L, ok: (L === "allowed") === ok, why })) });
    const qPre = (yes) => ({ prompt: "Preflight or not?", opts: ["OPTIONS preflight first", "no preflight: the real request goes"].map((L, i) => ({ label: L, ok: (i === 0) === yes, why: yes ? `A preflight is needed because ${a.why.join(" and ")}.` : a.same ? "Same origin: CORS does not apply at all." : "GET, HEAD and POST with text/plain, application/x-www-form-urlencoded or multipart/form-data and no custom header skip the preflight." })) });
    if (client === "postman") {
      steps.push({ msg: { from: 0, to: 1, label: `${method} ${url}` }, wire: reqText(false), caption: "Postman sends the request itself. It is not a browser and runs no page script, so there is no page origin and no Same-Origin Policy." });
      steps.push({ msg: { from: 1, to: 1, label: "server runs, answers" }, caption: `The server receives the request and answers 200 with ${hdrAllow}.`, wire: `HTTP/1.1 200 OK\nContent-Type: text/html\n${hdrAllow}\n\nHello John`, q: qAllowed(true, "CORS is a security feature implemented in web browsers; Postman never checks the header.") });
      steps.push({ msg: { from: 1, to: 0, label: "200 OK, shown in full", cls: "ok" }, caption: "Postman shows the response whatever Access-Control-Allow-Origin says: CORS is enforced by browsers, not by the server, so it does not control which clients have access." });
      return steps;
    }
    steps.push({ msg: { from: 0, to: 1, label: `open("${method}", …), send()` }, code: sendLine, caption: `The page at ${a.A.origin} runs xhttp.open("${method}", "${url}") and ${sendLine}. The browser, not the script, decides what may go out and what the script may read.` });
    steps.push({ msg: { from: 1, to: 1, label: a.same ? "same origin" : "cross-origin" }, compare: true, caption: a.same ? `Same origin: protocol, domain and port all match (${a.A.origin}). The Same-Origin Policy allows this, so no CORS check happens at all.` : `An origin is the combination of protocol, domain and port. ${["protocol", "host", "port"].filter((k) => a.A[k] !== a.B[k]).map((k) => (k === "host" ? "domain" : k)).join(" and ")} differ, so this is a cross-origin request: the browser will block it unless the server explicitly allows it.` });
    if (a.same) {
      steps.push({ msg: { from: 1, to: 2, label: `${method} /?name=John` }, wire: reqText(false), caption: "The request goes out without any CORS headers.", q: qPre(false) });
      steps.push({ msg: { from: 2, to: 1, label: "200 OK" }, wire: "HTTP/1.1 200 OK\nContent-Type: text/html\n\nHello John", caption: "The server answers. No Access-Control-Allow-Origin header is needed for the page's own origin.", q: qAllowed(true, "Same origin: the browser delivers it without looking for CORS headers.") });
      steps.push({ msg: { from: 1, to: 0, label: "readyState 4, status 200", cls: "ok" }, page: "Hello John", caption: "The script reads the response: readyState 4, status 200, responseText \"Hello John\"." });
      return steps;
    }
    if (a.preflight) {
      steps.push({ msg: { from: 1, to: 2, label: "OPTIONS /?name=John (preflight)" }, wire: `OPTIONS /?name=John HTTP/1.1\nHost: ${a.B.host}:${a.B.port}\nOrigin: ${a.A.origin}\nAccess-Control-Request-Method: ${method}${a.reqHeaders.length ? `\nAccess-Control-Request-Headers: ${a.reqHeaders.join(", ")}` : ""}`, caption: `Preflight request: because ${a.why.join(" and ")}, the browser first asks the server with the HTTP method OPTIONS whether the real request is allowed. The script's request waits.`, q: qPre(true) });
      steps.push({ msg: { from: 2, to: 1, label: "204 No Content + Allow-* headers" }, wire: `HTTP/1.1 204 No Content\n${hdrAllow}\nAccess-Control-Allow-Methods: ${allowMethods || "(absent)"}\nAccess-Control-Allow-Headers: ${allowHeaders || "(absent)"}`, caption: "The server answers the OPTIONS request with its CORS headers and no body. Access-Control-Allow-Methods and Access-Control-Allow-Headers matter only in this answer." });
      const ok = a.originOk && a.methodOk && !a.badHeader;
      const fail = !a.originOk ? `Response to preflight request doesn't pass access control check: ${originMsg}` : !a.methodOk ? `Method ${method} is not allowed by Access-Control-Allow-Methods in preflight response.` : a.badHeader ? `Request header field ${a.badHeader} is not allowed by Access-Control-Allow-Headers in preflight response.` : "";
      const why = !a.originOk ? `The preflight answer does not allow origin ${a.A.origin}.` : !a.methodOk ? `${method} is not in Access-Control-Allow-Methods (${allowMethods}).` : a.badHeader ? `${a.badHeader} is not in Access-Control-Allow-Headers (${allowHeaders}).` : "Origin, method and headers are all allowed by the preflight answer.";
      steps.push({ msg: { from: 1, to: 1, label: ok ? "preflight passes" : "preflight fails", cls: ok ? "ok" : "bad" }, caption: ok ? `The browser checks the preflight answer: ${why} The real request may go.` : `The browser checks the preflight answer: ${why} The real request is never sent; the server never sees it.`, err: ok ? "" : pre + fail, q: qAllowed(ok, why) });
      if (!ok) {
        steps.push({ msg: { from: 1, to: 0, label: "onerror, status 0", cls: "bad" }, err: pre + fail, caption: "The script gets no response: xhttp.status is 0 and onerror fires. The console shows Chrome's CORS message." });
        return steps;
      }
    }
    steps.push({ msg: { from: 1, to: 2, label: `${method} /?name=John + Origin` }, wire: reqText(true), caption: `The real request goes out with the header Origin: ${a.A.origin}.${a.preflight ? "" : " No preflight: a GET, HEAD or POST with a safelisted Content-Type and no custom header is sent straight away."}`, q: a.preflight ? null : qPre(false) });
    steps.push({ msg: { from: 2, to: 1, label: `200 OK, ${allow === null ? "no Allow-Origin" : `Allow-Origin: ${allow}`}` }, wire: `HTTP/1.1 200 OK\nContent-Type: text/html\n${hdrAllow}\n\nHello John`, caption: `The request reaches the server: it runs and answers 200 with ${hdrAllow}. CORS is configured by the contacted server in the response's header.` });
    const ok = a.originOk;
    const why = ok ? (allow === "*" ? "\"*\" means everyone: all origins may read the response." : `The header names exactly ${a.A.origin}.`) : allow === null ? "The response has no Access-Control-Allow-Origin header." : `The header allows ${allow}, not ${a.A.origin}.`;
    steps.push({ msg: { from: 1, to: 1, label: ok ? "header allows A" : "header does not allow A", cls: ok ? "ok" : "bad" }, caption: `The browser reads Access-Control-Allow-Origin: ${why}`, err: ok ? "" : pre + originMsg, q: qAllowed(ok, why) });
    steps.push(ok
      ? { msg: { from: 1, to: 0, label: "readyState 4, status 200", cls: "ok" }, page: "Hello John", caption: "The browser delivers the response: readyState 4, status 200, responseText \"Hello John\"." }
      : { msg: { from: 1, to: 0, label: "blocked: onerror, status 0", cls: "bad" }, err: pre + originMsg, caption: "Blocked: the server did answer, but the browser hides the response from the script. xhttp.status is 0, onerror fires, and the console shows the CORS message (slide 16 shows the start of this text)." });
    return steps;
  }
  const S = scripted(box, cfg, {
    predictLabel: "Predict: preflight or not, allowed or blocked?",
    stepMs: 1200,
    key: () => JSON.stringify([pageOrigin, apiOrigin, allow, method, ctype, custom, allowMethods, allowHeaders, client]),
    intro: () => (client === "postman" ? "Press Play: Postman sends the request directly." : "Press Play: the page asks the browser to send a request to the API server."),
    build,
    draw(st, s, u) {
      const a = analyse(), steps = S.steps();
      drawLanes(svg, client === "postman"
        ? [{ name: "Postman", sub: "not a browser" }, { name: "API server", sub: a.B.origin }]
        : [{ name: "page (script)", sub: a.A.origin }, { name: "browser", sub: "enforces CORS" }, { name: "API server", sub: a.B.origin }], steps.map((x) => x.msg), s, u, id);
      fields.innerHTML = "";
      if (client === "postman") fields.hidden = true;
      else {
        fields.hidden = false;
        const shown = steps.slice(0, s + 1).some((x) => x.compare);
        fields.append(el("span", "hd", ""), el("span", "hd", "protocol"), el("span", "hd", "domain"), el("span", "hd", "port"));
        for (const [lab, o] of [["A page", a.A], ["B API", a.B]]) {
          fields.append(el("span", "hd", lab));
          for (const k of ["protocol", "host", "port"]) fields.append(el("span", shown ? (a.A[k] === a.B[k] ? "same" : "diff") : "", k === "port" && !o.explicit ? `${o.port} (default)` : o[k]));
        }
      }
      const w = st ? steps.slice(0, s + 1).reverse().find((x) => x.wire)?.wire : "";
      setText(wire, w ? `on the wire:\n${w}` : "on the wire: (nothing yet)");
      cons.innerHTML = "";
      const err = st ? steps.slice(0, s + 1).reverse().find((x) => x.err)?.err : "";
      const pg = st && st.page;
      cons.append(el("span", null, "console: "), err ? el("span", "bad", err) : "(empty)", "\n", el("span", pg ? "ok" : "", `script reads: ${pg ? `"${pg}"` : "(nothing yet)"}`));
      statsUpd([["origins", client === "postman" ? "n/a" : a.same ? "same" : "different"], ["preflight", client === "postman" || a.same ? "no" : a.preflight ? "yes (OPTIONS)" : "no"], ["result", st && s >= steps.length - 1 ? (err ? "blocked" : "delivered") : "…"]]);
    },
  });
  box.append(S.pk.row, fields, svg, wire, cons, S.caption, S.ask, S.pbEl(), statsUpd.host);
  box.append(el("p", "widget-note", "CORS is a security feature implemented in web browsers and configured by the contacted server in the response's header. Error lines are Chrome's wording; slide 16 shows the start of one, cut off."));
  S.restart();
}

// ---------- widget: node-server-play ----------
const REST = {
  1: { title: "Example 1: single threaded non-blocking (asynchronous)", waiters: 1, steps: [
    { t: [0, 1], w: ["t1"], tables: ["ordering", "waiting"], kitchen: [], cap: "Same waiter can serve multiple tables: the waiter takes the order at table 1.", go: "Table 1" },
    { t: [1, 1], w: ["kitchen"], tables: ["ordered", "waiting"], kitchen: ["meal 1 (ready at 4)"], cap: "The waiter hands order 1 to the kitchen and does not wait for it." },
    { t: [1, 2], w: ["t2"], tables: ["ordered", "ordering"], kitchen: ["meal 1 (ready at 4)"], cap: "While meal 1 cooks, the same waiter takes the order at table 2 (does not get blocked by one table).", go: "Table 2" },
    { t: [2, 2], w: ["kitchen"], tables: ["ordered", "ordered"], kitchen: ["meal 1 (ready at 4)", "meal 2 (ready at 5)"], cap: "Order 2 goes to the kitchen too. Both meals cook at once." },
    { t: [2, 4], w: ["free"], idle: [2], tables: ["ordered", "ordered"], kitchen: ["meal 1 (ready at 4)", "meal 2 (ready at 5)"], cap: "Nothing to do until the kitchen rings: the waiter is free for any table that calls (in Node, the event loop waits for the next event)." },
    { t: [4, 5], w: ["t1"], tables: ["served", "ordered"], kitchen: ["meal 2 (ready at 5)"], served: 1, cap: "The kitchen rings: meal 1 is ready, so the waiter serves table 1.", go: "Table 1" },
    { t: [5, 6], w: ["t2"], tables: ["served", "served"], kitchen: [], served: 2, cap: "Meal 2 is ready: the waiter serves table 2. Both tables are served at time 6 by one waiter: JavaScript (Node.js) is single threaded, asynchronous (non blocking), just like this restaurant.", go: "Table 2" },
  ] },
  2: { title: "Example 2: single threaded blocking (synchronous)", waiters: 1, steps: [
    { t: [0, 1], w: ["t1"], tables: ["ordering", "waiting"], kitchen: [], cap: "The waiter takes the order at table 1.", go: "Table 1" },
    { t: [1, 4], w: ["kitchen"], idle: [3], tables: ["ordered", "waiting"], kitchen: ["meal 1 (ready at 4)"], cap: "Every time the waiter waits for the chef to prepare the meal, then (and only then) takes another order. Waiting for table 1 meal: is not doing anything else but waiting! Table 2 is ignored." },
    { t: [4, 5], w: ["t1"], tables: ["served", "waiting"], kitchen: [], served: 1, cap: "Meal 1 is ready; the waiter serves table 1.", go: "Table 1" },
    { t: [5, 6], w: ["t2"], tables: ["served", "ordering"], kitchen: [], served: 1, cap: "Only now does the waiter take the order at table 2.", go: "Table 2" },
    { t: [6, 9], w: ["kitchen"], idle: [3], tables: ["served", "ordered"], kitchen: ["meal 2 (ready at 9)"], served: 1, cap: "Waiting at the kitchen again, doing nothing else." },
    { t: [9, 10], w: ["t2"], tables: ["served", "served"], kitchen: [], served: 2, cap: "Table 2 is served at time 10, and the waiter stood idle for 6 of those units. What's the problem here? We are not utilizing our resources (the waiter) efficiently.", go: "Table 2" },
  ] },
  3: { title: "Example 3: multi-threaded", waiters: 2, steps: [
    { t: [0, 1], w: ["t1", "t2"], tables: ["ordering", "ordering"], kitchen: [], cap: "Multiple waiters, each dedicated to a single table only: waiter 1 takes order 1 while waiter 2 takes order 2.", go: "both tables" },
    { t: [1, 4], w: ["kitchen", "kitchen"], idle: [3, 3], tables: ["ordered", "ordered"], kitchen: ["meal 1 (ready at 4)", "meal 2 (ready at 4)"], cap: "Each waiter waits at the kitchen for its own table's meal (each is blocking)." },
    { t: [4, 5], w: ["t1", "t2"], tables: ["served", "served"], kitchen: [], served: 2, cap: "Both tables are served at time 5, but it took two waiters (threads), each idle for 3 units. Imagine 100 concurrent requests for a synchronous system: then the system has to create 100 threads! (100 waiters!!)", go: "both tables" },
  ] },
};
const REQ = {
  hello: { title: "Example 4: a simple http server (slide 36)", path: "/", code: [
    "const http = require('http');",
    "",
    "http.createServer(function (req, res) {",
    "  console.log(\"Hi\");",
    "  res.writeHead(200, {'Content-Type': 'text/html'});",
    "  res.end('Hello <b>World!</b>');",
    "}).listen(8888);",
    "",
    "console.log('Server is running and listening ...');",
  ] },
  date: { title: "Example 4: current date from a module (slide 35, module fixed)", path: "/", code: [
    "let http = require('http');",
    "let dt = require('./myModule');",
    "",
    "http.createServer(function (req, res) {",
    "  res.writeHead(200, {'Content-Type': 'text/html'});",
    "  res.write(\"Now: \" + dt.myDateTime());",
    "  res.end();",
    "}).listen(8888);",
  ] },
  query: { title: "Example 5: http server with parameters (slide 39)", path: "/?name=John", code: [
    "let http = require('http');",
    "let url = require('url');",
    "http.createServer(function (req, res) {",
    "  let q = url.parse(req.url, true);",
    "  console.log(q.query); //returns the object form of '?name=John'",
    "  res.writeHead(200, {\"Content-Type\": \"text/html\"});",
    "  res.end('Hello '+q.query[\"name\"]);",
    "}).listen(8888);",
  ] },
  file: { title: "Example 6: a file server (slide 42)", path: "/file.txt", code: [
    "const http = require('http');",
    "const url = require('url');",
    "const fs = require('fs');",
    "http.createServer(function (req, res) {",
    "    const q = url.parse(req.url, true);",
    "    const filename = \".\" + q.pathname;",
    "    fs.readFile(filename, function (err, data) {",
    "        if (err) {",
    "            res.writeHead(404, { 'Content-Type': 'text/html' });",
    "            return res.end(q.pathname + \" 404 Not Found!\");",
    "        }",
    "        res.writeHead(200, { 'Content-Type': 'text/html' });",
    "        res.write(data);",
    "        return res.end();",
    "    });",
    "}).listen(8888);",
  ] },
};
function nodeServerPlay(box, cfg) {
  injectCss();
  cfg = cfg || {};
  let mode = cfg.mode === "request" ? "request" : cfg.mode === "restaurant" ? "restaurant" : cfg.preset ? "request" : "restaurant";
  let example = [1, 2, 3].includes(Number(cfg.example)) ? Number(cfg.example) : 1;
  let preset = REQ[cfg.preset] ? cfg.preset : "hello";
  let path = typeof cfg.path === "string" && cfg.path ? cfg.path : REQ[preset].path;
  let exists = cfg.fileExists !== false;
  const id = `wn${++uid}`;
  box.append(el("h4", null, cfg.title || "Node.js: one waiter, many tables"));
  const mRow = selectRow("mode", [["restaurant", "restaurant analogy (slides 15–23)"], ["request", "a request to http.createServer"]], mode, (v) => { mode = v; layout(); S.restart(); });
  const eRow = selectRow("example", [["1", "Example 1: one non-blocking waiter"], ["2", "Example 2: one blocking waiter"], ["3", "Example 3: many waiters"]], String(example), (v) => { example = Number(v); S.restart(); });
  const pRow = selectRow("program", Object.entries(REQ).map(([k, v]) => [k, `${k}: ${v.title}`]), preset, (v) => { preset = v; path = REQ[v].path; pathRow.input.value = path; layout(); S.restart(); });
  pRow.sel.style.cssText = "flex:1 1 200px;min-width:0;width:100%";
  const pathRow = textRow("browser asks for", path, (v) => { path = v.startsWith("/") ? v : "/" + v; S.restart(); });
  const exRow = checkRow("the file exists on the server", exists, (v) => { exists = v; S.restart(); });
  box.append(mRow.row, eRow.row, pRow.row, pathRow.row, exRow.row);
  const svg = svgEl("svg", { class: "wweb-svg", role: "img", "aria-label": "Restaurant: waiter, kitchen and tables" });
  const listing = el("pre", "wweb-listing");
  const panel = el("div", "wweb-wire");
  const term = el("div", "wweb-wire");
  const upd = statGrid(el("div"));
  function layout() {
    const r = mode === "restaurant";
    eRow.row.hidden = !r; pRow.row.hidden = r; pathRow.row.hidden = r || preset === "hello" || preset === "date"; exRow.row.hidden = r || preset !== "file";
    svg.style.display = r ? "" : "none"; listing.hidden = r; panel.hidden = r; term.hidden = r;
  }
  const POS = { t1: [70, 150], t2: [200, 150], kitchen: [300, 40], free: [140, 80] };
  function restSteps() {
    const E = REST[example];
    let idle = 0;
    return E.steps.map((x, i) => {
      idle += (x.idle || []).reduce((a, b) => a + b, 0);
      const prevW = i ? E.steps[i - 1].w : E.steps[0].w.map(() => "free");
      const q = x.go ? { prompt: "Which table does the waiter go to next?", opts: (E.waiters > 1 ? ["Table 1", "Table 2", "both tables"] : ["Table 1", "Table 2"]).map((L) => ({ label: L, ok: L === x.go, why: example === 1 ? "The non-blocking waiter never waits at the kitchen: it takes the next order while a meal cooks and serves a table when its meal is ready." : example === 2 ? "The blocking waiter finishes one table (order, wait, serve) before taking another order." : "Each waiter is dedicated to its own table." })) } : null;
      return { ...x, prevW, idleTotal: idle, caption: `Time ${x.t[0]}${x.t[1] !== x.t[0] ? `–${x.t[1]}` : ""}: ${x.cap}`, q };
    });
  }
  function reqSteps() {
    const R = REQ[preset], steps = [];
    const leave = ["nothing leaves yet", "status line, headers and body bytes leave", "the response is finished and leaves"];
    const qLeave = (k, why) => ({ prompt: "What goes to the client at this step?", opts: leave.map((L, i) => ({ label: L, ok: i === k, why })) });
    let host = "localhost:8888", pathname = path, search = "", query = {};
    try { const u = new URL(path, "http://localhost:8888"); pathname = u.pathname; search = u.search; for (const [k, v] of u.searchParams) query[k] = v; } catch (e) { /* keep */ }
    const qs = Object.entries(query).map(([k, v]) => `${k}: '${v}'`).join(", ");
    const add = (o) => steps.push(o);
    const reqLine = `GET ${path} HTTP/1.1\nHost: ${host}`;
    if (preset === "hello") {
      add({ lines: [1], caption: "require('http') loads the built-in http module.", term: [] });
      add({ lines: [3, 7], caption: "http.createServer(callback).listen(8888): the server registers the callback and waits on port 8888. The callback does not run yet: it runs once per request.", term: [] });
      add({ lines: [9], caption: "The script's last line runs; the server keeps waiting for requests.", term: ["Server is running and listening ..."] });
      add({ lines: [], arrow: "→ request", wire: reqLine, caption: "The browser at http://localhost:8888/ sends GET /. The event loop calls the callback with req and res.", term: ["Server is running and listening ..."] });
      add({ lines: [4], caption: "console.log(\"Hi\") prints in the server's terminal, not in the browser.", term: ["Server is running and listening ...", "Hi"], q: qLeave(0, "console.log writes to the server's terminal; the response is not touched.") });
      add({ lines: [5], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: "" }, caption: "res.writeHead(200, {'Content-Type': 'text/html'}) sets the status line and the header. Node holds them until the first body bytes are written.", term: ["Server is running and listening ...", "Hi"], q: qLeave(0, "writeHead only stores the status and headers; they go out with the first write or end.") });
      add({ lines: [6], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: "Hello <b>World!</b>" }, sent: true, browser: "Hello **World!**", caption: "res.end('Hello <b>World!</b>') adds the body and finishes the response; it leaves for the browser, which renders Hello World! with World! in bold because the type is text/html.", term: ["Server is running and listening ...", "Hi"], q: qLeave(2, "end() writes the last body bytes and finishes the response.") });
      return steps;
    }
    if (preset === "date") {
      const now = "Tue Oct 27 2026 10:15:00 GMT-0700 (Pacific Daylight Time)";
      add({ lines: [1, 2], caption: "require('http') loads a built-in module; require('./myModule') loads your own file (with exports.myDateTime = function () { return Date(); }; the slide's module exports area by mistake).", term: [] });
      add({ lines: [4, 8], caption: "createServer registers the callback; listen(8888) waits for requests.", term: [] });
      add({ lines: [], arrow: "→ request", wire: reqLine, caption: "The browser sends GET /; the callback runs.", term: [] });
      add({ lines: [5], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: "" }, caption: "res.writeHead sets the status line and header (held until the body starts).", term: [], q: qLeave(0, "writeHead only stores the status and headers.") });
      add({ lines: [6], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html", "Transfer-Encoding: chunked"], body: `Now: ${now}` }, caption: "res.write(\"Now: \" + dt.myDateTime()) sends the headers and the first body bytes (the date shown is an example).", term: [], q: qLeave(1, "write() sends the held headers plus this chunk of the body.") });
      add({ lines: [7], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html", "Transfer-Encoding: chunked"], body: `Now: ${now}` }, sent: true, browser: `Now: ${now}`, caption: "res.end() finishes the response; the browser shows the text.", term: [], q: qLeave(2, "end() finishes the response.") });
      return steps;
    }
    if (preset === "query") {
      add({ lines: [1, 2], caption: "require loads the built-in http and url modules.", term: [] });
      add({ lines: [3, 8], caption: "createServer registers the callback; listen(8888) waits for requests.", term: [] });
      add({ lines: [], arrow: "→ request", wire: reqLine, caption: `The browser's address bar sends GET ${path}. req.url is "${path}" (path and query only, no host).`, term: [] });
      add({ lines: [4], url: { host: "null", pathname: `'${pathname}'`, search: search ? `'${search}'` : "null", query: `{ ${qs} }` }, caption: `url.parse(req.url, true) splits it: pathname '${pathname}', search ${search ? `'${search}'` : "null"}, and with true the query becomes an object { ${qs} }. host is null here because req.url has no host; slide 38 parses the full address and gets 'localhost:8888'.`, term: [], q: qLeave(0, "Parsing the URL happens on the server only.") });
      add({ lines: [5], caption: "console.log(q.query) prints the object in the server's terminal.", term: [`{${qs}}`], q: qLeave(0, "console.log writes to the server's terminal.") });
      add({ lines: [6], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: "" }, caption: "res.writeHead sets the status line and header (held until the body).", term: [`{${qs}}`], q: qLeave(0, "writeHead only stores the status and headers.") });
      add({ lines: [7], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: `Hello ${query.name ?? "undefined"}` }, sent: true, browser: `Hello ${query.name ?? "undefined"}`, caption: `res.end('Hello '+q.query["name"]) finishes the response: "Hello ${query.name ?? "undefined"}". No Access-Control-Allow-Origin is needed: the address bar is a navigation, not an AJAX call from another origin.`, term: [`{${qs}}`], q: qLeave(2, "end() writes the body and finishes the response.") });
      return steps;
    }
    // file
    const filename = "." + pathname;
    add({ lines: [1, 2, 3], caption: "require loads http, url and fs, the file system built-in module.", term: [], kitchen: "" });
    add({ lines: [4, 16], caption: "createServer registers the callback; listen(8888) waits for requests.", term: [], kitchen: "" });
    add({ lines: [], arrow: "→ request", wire: reqLine, caption: `The browser sends GET ${path}; the callback runs.`, term: [], kitchen: "" });
    add({ lines: [5, 6], url: { pathname: `'${pathname}'` }, caption: `url.parse gives pathname '${pathname}', so filename is "${filename}".`, term: [], kitchen: "", q: qLeave(0, "Working out the filename happens on the server only.") });
    add({ lines: [7], caption: `fs.readFile("${filename}", callback) hands the read to the disk (the kitchen) and returns at once. The callback has not run; the server is free for other requests meanwhile, like the waiter taking the next order.`, term: [], kitchen: `reading ${filename}…`, q: qLeave(0, "readFile only starts the read; nothing is written to the response.") });
    if (!exists) {
      add({ lines: [8], caption: `Later the disk reports back: the file does not exist, so the callback runs with err set. if (err) is true.`, term: [], kitchen: "done: error (ENOENT)", q: qLeave(0, "Checking err changes nothing on the wire.") });
      add({ lines: [9], resp: { status: "HTTP/1.1 404 Not Found", headers: ["Content-Type: text/html"], body: "" }, caption: "res.writeHead(404, …): 4xx are status codes meaning client error; 404 means not found.", term: [], kitchen: "done: error (ENOENT)", q: qLeave(0, "writeHead only stores the status and headers.") });
      add({ lines: [10], resp: { status: "HTTP/1.1 404 Not Found", headers: ["Content-Type: text/html"], body: `${pathname} 404 Not Found!` }, sent: true, browser: `${pathname} 404 Not Found!`, caption: `return res.end(q.pathname + " 404 Not Found!") finishes the response: "${pathname} 404 Not Found!". The return stops the callback there.`, term: [], kitchen: "done: error (ENOENT)", q: qLeave(2, "end() writes the body and finishes the response.") });
      return steps;
    }
    const data = "Hello from file.txt";
    add({ lines: [8], caption: `Later the disk reports back with the contents, so the callback runs with err null and data "${data}" (example contents). if (err) is false.`, term: [], kitchen: "done: data ready", q: qLeave(0, "Checking err changes nothing on the wire.") });
    add({ lines: [12], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html"], body: "" }, caption: "res.writeHead(200, …) sets the status line and header (held until the body).", term: [], kitchen: "done: data ready", q: qLeave(0, "writeHead only stores the status and headers.") });
    add({ lines: [13], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html", "Transfer-Encoding: chunked"], body: data }, caption: "res.write(data) sends the headers and the file's bytes.", term: [], kitchen: "done: data ready", q: qLeave(1, "write() sends the held headers plus the data.") });
    add({ lines: [14], resp: { status: "HTTP/1.1 200 OK", headers: ["Content-Type: text/html", "Transfer-Encoding: chunked"], body: data }, sent: true, browser: data, caption: "return res.end() finishes the response; the browser shows the file's text.", term: [], kitchen: "done: data ready", q: qLeave(2, "end() finishes the response.") });
    return steps;
  }
  function drawRest(st, s, u) {
    const E = REST[example];
    svg.setAttribute("viewBox", "0 0 360 190");
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 250, y: 12, width: 100, height: 56, rx: 8, fill: "var(--green-soft)", stroke: "var(--green)" }));
    svg.append(svgEl("text", { x: 300, y: 28, "text-anchor": "middle", "font-size": 12, "font-weight": 600, fill: "var(--ink)" }, "Kitchen (I/O)"));
    (st ? st.kitchen : []).forEach((k, i) => svg.append(svgEl("text", { x: 300, y: 44 + i * 12, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-2)" }, k)));
    const tstate = st ? st.tables : ["waiting", "waiting"];
    [["t1", "Table 1"], ["t2", "Table 2"]].forEach(([k, lab], i) => {
      const [x, y] = POS[k];
      const served = tstate[i] === "served";
      svg.append(svgEl("circle", { cx: x, cy: y + 12, r: 22, fill: served ? "var(--green-soft)" : "var(--blue-soft)", stroke: served ? "var(--green)" : "var(--blue)" }));
      svg.append(svgEl("text", { x, y: y + 10, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)" }, lab));
      svg.append(svgEl("text", { x, y: y + 22, "text-anchor": "middle", "font-size": 8.5, fill: "var(--ink-dim)" }, tstate[i]));
    });
    const ws = st ? st.w : E.steps[0].w.map(() => "free");
    const prev = st ? st.prevW : ws;
    const e = u < 1 ? u * u * (3 - 2 * u) : 1;
    ws.forEach((w, i) => {
      const a = POS[prev[i]] || POS.free, b = POS[w] || POS.free;
      const off = ws.length > 1 && w === "kitchen" ? (i ? 14 : -14) : 0;
      const x = a[0] + (b[0] + off - a[0]) * e - (w.startsWith("t") ? 0 : 0), y = a[1] + (b[1] - a[1]) * e + (w.startsWith("t") ? -26 : 34);
      const busyWait = st && st.idle && w === "kitchen";
      svg.append(svgEl("ellipse", { cx: x, cy: y, rx: 30, ry: 11, fill: busyWait ? "var(--red-soft)" : "var(--paper-3)", stroke: busyWait ? "var(--red)" : "var(--hl)" }));
      svg.append(svgEl("text", { x, y: y + 3.5, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink)" }, ws.length > 1 ? `Waiter ${i + 1}` : "Waiter"));
    });
    if (st && st.w[0] === "free") svg.append(svgEl("text", { x: POS.free[0], y: POS.free[1] + 56, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }, "free: waiting for the next event"));
    upd([["time", st ? st.t[1] : 0], ["tables served", st ? st.served || 0 : 0], ["waiter idle time", st ? st.idleTotal : 0], ["waiters (threads)", E.waiters]]);
  }
  function drawReq(st, s) {
    const R = REQ[preset];
    if (listing.dataset.k !== preset) {
      listing.dataset.k = preset; listing.innerHTML = "";
      R.code.forEach((t, i) => { const row = el("div", "wweb-line"); row.append(el("span", "ln", String(i + 1)), el("span", "tx", t || " ")); listing.append(row); });
    }
    const lit = st ? st.lines : [];
    [...listing.children].forEach((row, i) => {
      const n = i + 1;
      const on = lit.length === 2 && preset !== "file" && lit[1] > lit[0] + 1 ? n === lit[0] || n === lit[1] : lit.includes(n) || (lit.length === 2 && n >= lit[0] && n <= lit[1] && lit[1] - lit[0] < 3);
      row.classList.toggle("on", on);
    });
    const steps = S.steps();
    const resp = st ? steps.slice(0, s + 1).reverse().find((x) => x.resp)?.resp : null;
    const url = st ? steps.slice(0, s + 1).reverse().find((x) => x.url)?.url : null;
    const wire = st ? steps.slice(0, s + 1).reverse().find((x) => x.wire)?.wire : "";
    panel.innerHTML = "";
    panel.append(el("span", null, wire ? `browser → server:\n${wire}` : "browser → server: (no request yet)"), "\n");
    if (url) panel.append(el("span", "hl", `url.parse: ${Object.entries(url).map(([k, v]) => `${k} ${v}`).join(" · ")}`), "\n");
    if (st && st.kitchen) panel.append(el("span", "hl", `disk (the kitchen): ${st.kitchen}`), "\n");
    panel.append(el("span", null, "response being built:"), "\n");
    if (resp) panel.append(el("span", st.sent ? "ok" : "", `${resp.status}\n${resp.headers.join("\n")}\n\n${resp.body}`));
    else panel.append("(nothing yet)");
    if (st && st.sent) panel.append("\n", el("span", "ok", `→ sent. The browser shows: ${st.browser}`));
    const t = st ? st.term : [];
    setText(term, `server terminal:\n${t.length ? t.join("\n") : "(empty)"}`);
    upd([["request", wire ? "received" : "none yet"], ["response", st && st.sent ? "sent" : resp ? "being built" : "not started"]]);
  }
  const S = scripted(box, cfg, {
    predictLabel: "Predict: which table next, or what goes to the client",
    stepMs: 1200,
    key: () => `${mode}|${example}|${preset}|${path}|${exists}`,
    intro: () => (mode === "restaurant" ? `${REST[example].title}. Press Play: time moves one action per step.` : `${REQ[preset].title}. Press Play: node server.js starts the server.`),
    build: () => (mode === "restaurant" ? restSteps() : reqSteps()),
    draw: (st, s, u) => (mode === "restaurant" ? drawRest(st, s, u) : drawReq(st, s, u)),
  });
  box.append(S.pk.row, svg, listing, panel, term, S.caption, S.ask, S.pbEl(), upd.host);
  box.append(el("p", "widget-note", "Example 1: single threaded non-blocking (asynchronous). Example 2: single threaded blocking (synchronous). Example 3: multi-threaded. Times are in made-up units; each meal takes 3."));
  layout();
  S.restart();
}

// ---------- widget: scope-hoist ----------
const SH_PRESETS = {
  "three-columns": { label: "slide 117: { … } then console.log(a)", wrap: "block", pos: "outside", form: "plain", name: "a", val: 10 },
  hoisting: { label: "slide 132: console.log before the declaration", wrap: "none", pos: "before", form: "split", name: null, val: 140 },
  "use-before": { label: "console.log(price) above price = 7", wrap: "none", pos: "before", form: "plain", name: "price", val: 7 },
  block: { label: "an if block: total = 40; total++", wrap: "if", pos: "outside", form: "incr", name: "total", val: 40 },
  window: { label: "slide 133: window.a", wrap: "none", pos: "after", form: "plain", name: "a", val: 10, win: true },
  strict: { label: "slide 133: re-declaring in strict mode", wrap: "none", pos: "after", form: "redeclare", name: "me", val: "'bar'", strict: true },
};
function shName(p, kind) { return p.name || (kind === "var" ? "myVar" : kind === "let" ? "myLet" : "myConst"); }
function shProgram(st) {
  const p = SH_PRESETS[st.preset], k = st.kind, n = shName(p, k);
  const L = [];
  if (st.strict) L.push("'use strict';");
  const ind = st.wrap === "none" ? "" : "  ";
  const decl = p.form === "split" ? [`${k} ${n};`, `${n} = ${p.val};`] : p.form === "incr" ? [`${k} ${n} = ${p.val};`, `${n}++;`] : p.form === "redeclare" ? [`${k} ${n} = 'foo';`, `${k} ${n} = 'bar';`] : [`${k} ${n} = ${p.val};`];
  const log = `console.log(${p.win ? `window.${n}` : n});`;
  const open = { none: null, block: "{", if: "if (5 > 2) {", function: "function demo() {" }[st.wrap];
  if (open) L.push(open);
  if (st.pos === "before") L.push(ind + log);
  decl.forEach((d) => L.push(ind + d));
  if (st.pos === "after" || (st.pos === "outside" && st.wrap === "none")) L.push(ind + log);
  if (open) L.push("}");
  if (st.wrap === "function") L.push("demo();");
  if (st.pos === "outside" && st.wrap !== "none") L.push(log);
  return { lines: L, name: n, log };
}
/** The rules, per kind: what the console.log prints or which error stops the script, and where the binding lives. */
function shEval(st) {
  const p = SH_PRESETS[st.preset], k = st.kind, n = shName(p, k);
  const lexical = k !== "var";
  const pos = st.pos === "outside" && st.wrap === "none" ? "after" : st.pos;
  const home = !lexical ? (st.wrap === "function" ? "function" : "global") : st.wrap === "none" ? "script" : st.wrap === "function" ? "function" : "block";
  const finalVal = p.form === "incr" ? p.val + 1 : p.form === "redeclare" ? "bar" : p.val;
  const R = { home, name: n };
  if (k === "const" && p.form === "split") return { ...R, early: true, out: "Uncaught SyntaxError: Missing initializer in const declaration", err: true, state: "none", why: "A const must get its value on the same line it is declared; nothing in the script runs." };
  if (lexical && p.form === "redeclare") return { ...R, early: true, out: `Uncaught SyntaxError: Identifier '${n}' has already been declared`, err: true, state: "none", why: `let does not allow re-declaration of variables in strict mode. [note] The real message names ${n}, and it is a SyntaxError without strict mode too. Nothing in the script runs.` };
  if (k === "const" && p.form === "incr" && pos !== "before") return { ...R, out: "Uncaught TypeError: Assignment to constant variable.", err: true, state: "value", val: p.val, why: `${n}++ tries to change a const: Uncaught TypeError: Assignment to constant variable. The script stops before the console.log.` };
  if (pos === "before") {
    if (p.win) {
      const onWin = !lexical && home === "global";
      return { ...R, out: "undefined", state: lexical ? "tdz" : "undef", why: onWin ? `var ${n} is hoisted and attached to window, so window.${n} exists but is still undefined.` : `window.${n} is just a missing property: reading it gives undefined, no error.` };
    }
    if (!lexical) return { ...R, out: "undefined", state: "undef", why: `JS engine moves declarations using var to top. Will not issue error, even though ${n} was declared next line: it will simply print undefined.` };
    return { ...R, out: `Uncaught ReferenceError: Cannot access '${n}' before initialization`, err: true, state: "tdz", why: `Will issue error and terminate execution. JS engine will NOT hoist variables declared by "${k}". [note] It is hoisted, but sits in the temporal dead zone until its line runs, hence "Cannot access … before initialization".` };
  }
  if (pos === "after") {
    if (p.win) {
      const onWin = !lexical && home === "global";
      return { ...R, out: onWin ? String(finalVal) : "undefined", state: "value", val: finalVal, why: onWin ? `var attaches global variables to global window: window.${n} is ${finalVal}.` : lexical ? `${k} does not add property to global window: window.${n} is undefined (the slide says it "will not print 10"; it prints undefined).` : `${n} is declared inside a function, so it is not global and not on window.` };
    }
    return { ...R, out: String(finalVal), state: "value", val: finalVal, why: p.form === "redeclare" ? "Re-declaration with var is ok: me is replaced." : `The console.log runs after the declaration, in the same scope, so it sees ${finalVal}.` };
  }
  // outside the block or function
  if (p.win) {
    const onWin = !lexical && home === "global";
    return { ...R, out: onWin ? String(finalVal) : "undefined", state: "gone", val: finalVal, why: onWin ? `var ignores the block and attaches ${n} to window.` : `window.${n} does not exist, so it reads undefined.` };
  }
  if (home === "global") return { ...R, out: String(finalVal), state: "value", val: finalVal, why: `var declares a function-scoped variable: a block does not contain it, so ${n} is visible after the }.` };
  return { ...R, out: `Uncaught ReferenceError: ${n} is not defined`, err: true, state: "gone", val: finalVal, why: home === "function" ? `${n} lives in demo()'s scope; it is accessible only within the function it was declared.` : `${k} declares a block-scoped variable: it is accessible only within the block it was declared (a block means lines of codes within {}).` };
}
function scopeHoist(box, cfg) {
  injectCss();
  cfg = cfg || {};
  const st = { preset: SH_PRESETS[cfg.preset] ? cfg.preset : "three-columns", kind: ["var", "let", "const"].includes(cfg.kind) ? cfg.kind : "var" };
  const load = () => { const p = SH_PRESETS[st.preset]; st.wrap = p.wrap; st.pos = p.pos; st.strict = !!p.strict; };
  load();
  if (["none", "block", "function"].includes(cfg.wrap)) st.wrap = cfg.wrap;
  if (["before", "after", "outside"].includes(cfg.pos)) st.pos = cfg.pos;
  if (typeof cfg.strict === "boolean") st.strict = cfg.strict;
  box.append(el("h4", null, cfg.title || "var, let, const: scope and hoisting"));
  const ps = selectRow("program", Object.entries(SH_PRESETS).map(([k, v]) => [k, `${k}: ${v.label}`]), st.preset, (v) => { st.preset = v; load(); draw(); });
  ps.sel.style.cssText = "flex:1 1 200px;min-width:0;width:100%";
  const mkRow = (label, items, key) => {
    const row = el("div", "wweb-row");
    row.append(el("label", null, label));
    const btns = items.map(([v, t]) => { const b = el("button", "viz-btn", t); b.type = "button"; b.dataset.v = v; b.addEventListener("click", () => { st[key] = v; draw(); }); row.append(b); return b; });
    return { row, sync: () => btns.forEach((b) => b.classList.toggle("active", b.dataset.v === st[key])), btns };
  };
  const kRow = mkRow("declare with", [["var", "var"], ["let", "let"], ["const", "const"]], "kind");
  const wRow = mkRow("wrap in", [["none", "nothing"], ["block", "a block { }"], ["function", "a function"]], "wrap");
  const pRow = mkRow("console.log", [["before", "before the declaration"], ["after", "after it"], ["outside", "after the } "]], "pos");
  const sRow = checkRow("'use strict'", st.strict, (v) => { st.strict = v; draw(); });
  box.append(ps.row, kRow.row, wRow.row, pRow.row, sRow.row);
  const grid = el("div", "wweb-scope");
  const listing = el("pre", "wweb-listing");
  const right = el("div");
  grid.append(listing, right);
  const out = el("div", "wweb-out");
  const mem = el("div", "wweb-mem");
  const tri = el("table", "wweb-tri");
  const cap = el("p", "playback-caption");
  right.append(sty(el("div", "widget-note", "console"), "margin:0"), out, sty(el("div", "widget-note", "memory when the console.log runs (or the error stops the script)"), "margin:6px 0 0"), mem);
  box.append(grid, tri, cap);
  function frameBox(title, rows, cls) {
    const f = el("div", "wweb-frame" + (cls ? " " + cls : ""));
    f.append(el("h5", null, title));
    if (!rows.length) f.append(sty(el("div", null, "(nothing declared here)"), "color:var(--ink-dim)"));
    for (const [t, c] of rows) f.append(el("div", c, t));
    return f;
  }
  function draw() {
    if (st.preset === "block" && st.wrap === "block") st.wrap = "if";
    const pre = SH_PRESETS[st.preset];
    kRow.sync(); pRow.sync(); sRow.cb.checked = st.strict;
    wRow.btns.forEach((b) => { b.classList.toggle("active", b.dataset.v === st.wrap || (b.dataset.v === "block" && st.wrap === "if")); });
    pRow.btns[2].disabled = st.wrap === "none";
    if (st.wrap === "none" && st.pos === "outside") st.pos = "after";
    pRow.sync();
    const prog = shProgram(st), r = shEval(st);
    listing.innerHTML = "";
    prog.lines.forEach((t, i) => { const row = el("div", "wweb-line" + (t.trim() === prog.log ? " on" : "")); row.append(el("span", "ln", String(i + 1)), el("span", "tx", t)); listing.append(row); });
    out.innerHTML = "";
    out.append(el("span", r.err ? "e" : "", r.out));
    mem.innerHTML = "";
    const n = r.name;
    const stateTxt = r.early ? ["(the script never ran)", ""] : r.state === "tdz" ? [`${n}: in TDZ, ReferenceError on access`, "tdz"] : r.state === "undef" ? [`${n}: undefined (hoisted)`, "undef"] : [`${n}: ${r.val}`, "v"];
    const globalRows = [], scriptRows = [], fnRows = [], blockRows = [];
    const target = { global: globalRows, script: scriptRows, function: fnRows, block: blockRows }[r.home];
    if (r.home === "global") target.push([`window.${n}: ${r.early ? "—" : r.state === "undef" ? "undefined" : r.val}`, r.state === "undef" ? "undef" : "v"]);
    else target.push(stateTxt);
    const ended = st.pos === "outside";
    mem.append(frameBox("global object (window)", globalRows.length ? globalRows : [[`no ${n} property: window.${n} is undefined`, ""]]));
    mem.append(frameBox("script scope (top-level let / const, not on window)", scriptRows));
    if (st.wrap === "function") mem.append(frameBox(`function scope: demo()${ended ? " (finished: gone)" : ""}`, fnRows.concat(st.wrap === "function" && r.home === "block" ? [] : []), "inner"));
    if (st.wrap === "block" || st.wrap === "if") mem.append(frameBox(`block scope { }${ended ? " (ended: gone)" : ""}`, blockRows, "inner"));
    tri.innerHTML = "";
    const hr = el("tr"); hr.append(el("th", null, "")); ["var", "let", "const"].forEach((k) => hr.append(el("th", null, k)));
    const r1 = el("tr"); r1.append(el("th", null, "prints"));
    ["var", "let", "const"].forEach((k) => { const x = shEval({ ...st, kind: k }); const td = el("td", k === st.kind ? "cur" : "", x.out); r1.append(td); });
    const r2 = el("tr"); r2.append(el("th", null, "scope"));
    ["var", "let", "const"].forEach((k) => r2.append(el("td", k === st.kind ? "cur" : "", k === "var" ? "Function scoped" : "Block Scoped")));
    tri.append(hr, r1, r2);
    setText(cap, r.why + (st.strict && pre.form !== "redeclare" ? " 'use strict' changes nothing for this program." : ""));
  }
  box.append(el("p", "widget-note", "var: declares a function-scoped variable. let: declares a block-scoped variable. const: declares a block-scoped const (slide 115)."));
  draw();
}

export const WIDGETS = {
  "event-loop-play": eventLoopPlay,
  "promise-chain-play": promiseChainPlay,
  "xhr-play": xhrPlay,
  "cors-play": corsPlay,
  "node-server-play": nodeServerPlay,
  "scope-hoist": scopeHoist,
};
