// Interactive C++ widgets for COMP 3522 Week 2: pointer/reference memory stepper, file cursor
// (tellg/seekp), open-mode explorer, rand() range calculator, getline simulator, vector visualizer,
// and the playback animations seek-play, vector-grow-play and sequence-play (UML, Week 3).
import { el, esc, slider, btnRow } from "./dom.js";
import { highlight } from "./highlight.js";
import { createPlayback } from "./playback.js";

// =====================================================================
// pointer-viz: a tiny C++ interpreter for the pointer/reference slide programs.
// Runs the whole program up front into snapshots (state after each statement),
// then Prev/Next just index into them. Draws stack frames, heap cells and arrows.
// =====================================================================
const STACK_BASE = 0xffffcc10;
const HEAP_BASE = 0xffff000a;
const hex = (n) => "0x" + n.toString(16);

function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, ""); }

function splitStatements(text) {
  const out = []; let depth = 0, cur = "", q = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { cur += c; if (c === "\\") { cur += text[++i] ?? ""; } else if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if ("([{".includes(c)) depth++;
    if (")]}".includes(c)) depth--;
    if (c === ";" && depth === 0) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out;
}

function parseParams(s) {
  return s.split(",").map((p) => p.trim()).filter(Boolean).map((p) => {
    const m = /^(const\s+)?(int|long|double|char|bool|float)\s*(\*|&)?\s*(\w+)$/.exec(p.replace(/\s+/g, " "));
    if (!m) throw new Error(`cannot read parameter '${p}'`);
    return { const: !!m[1], type: m[2], ptr: m[3] === "*", ref: m[3] === "&", name: m[4] };
  });
}

/** Parses functions {name: {params, body:[{line,text}]}} out of the program text. */
function parseProgram(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const funcs = {};
  let cur = null, depth = 0;
  for (let i = 0; i < lines.length; i++) {
    let text = stripComments(lines[i]).trim();
    if (!text || text.startsWith("#") || /^using\s/.test(text)) continue;
    if (!cur) {
      const fh = /^(void|int|double|long|bool)\s+(\w+)\s*\(([^)]*)\)\s*(\{)?\s*$/.exec(text);
      if (!fh) throw new Error(`line ${i + 1}: expected a function header, found '${text}'`);
      cur = { name: fh[2], ret: fh[1], params: parseParams(fh[3]), body: [], line: i + 1 };
      funcs[fh[2]] = cur;
      depth = fh[4] ? 1 : 0;
      continue;
    }
    if (depth === 0) { if (text === "{") { depth = 1; continue; } throw new Error(`line ${i + 1}: expected '{'`); }
    // handle a line that is just "}" or ends with "}" closing the function
    let body = text;
    if (body === "}") { depth--; if (depth === 0) cur = null; continue; }
    if (body.endsWith("}")) { body = body.slice(0, -1); depth--; }
    if (body.startsWith("{")) { body = body.slice(1); depth++; }
    for (const st of splitStatements(body)) if (st.trim()) cur.body.push({ line: i + 1, text: st.trim() });
    if (depth === 0) cur = null;
  }
  if (!funcs.main) throw new Error("no int main() found");
  return funcs;
}

// ---------- expressions ----------
function tokenize(s) {
  const re = /\s*(?:(\d+\.\d+|\d+)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|(\+\+|--|\+=|-=|<<|==|!=|[-+*\/&(),{}=\[\]!<>])|([A-Za-z_]\w*))/y;
  const toks = []; let i = 0;
  while (i < s.length) {
    re.lastIndex = i;
    const m = re.exec(s);
    if (!m || m.index !== i) { if (/\s/.test(s[i])) { i++; continue; } throw new Error(`unexpected '${s[i]}'`); }
    i = re.lastIndex;
    if (m[1] != null) toks.push({ t: "num", v: Number(m[1]) });
    else if (m[2] != null) toks.push({ t: "str", v: JSON.parse(m[2].replace(/\\'/g, "'")) });
    else if (m[3] != null) toks.push({ t: "chr", v: m[3] === "'\\n'" ? "\n" : m[3].slice(1, -1) });
    else if (m[4] != null) toks.push({ t: "op", v: m[4] });
    else toks.push({ t: "id", v: m[5] });
  }
  return toks;
}

class Machine {
  constructor(funcs) {
    this.funcs = funcs;
    this.cells = []; // {id, addr, type, ptr, value, kind:'stack'|'heap'|'temp', names:[{name, frame}], frame, freed, init}
    this.frames = []; // {id, name, vars: {name: cellId}, body, pc, callLine}
    this.out = "";
    this.nextStack = STACK_BASE; this.nextHeap = HEAP_BASE; this.frameSeq = 0;
    this.snaps = [];
    this.steps = 0;
  }
  snapshot(line, msg, kind = "step") {
    this.snaps.push({ line, msg, kind, cells: structuredClone(this.cells), frames: this.frames.map((f) => ({ id: f.id, name: f.name, vars: { ...f.vars } })), out: this.out, leaks: this.leaks() });
  }
  leaks() {
    const pointed = new Set();
    for (const c of this.cells) if (c.ptr && c.value && c.value.ptr != null && !c.freed) pointed.add(c.value.ptr);
    return this.cells.filter((c) => c.kind === "heap" && !c.freed && !pointed.has(c.id)).map((c) => c.id);
  }
  top() { return this.frames[this.frames.length - 1]; }
  cellById(id) { return this.cells.find((c) => c.id === id); }
  newCell(type, ptr, kind, frame, value, init = true) {
    const addr = kind === "heap" ? this.nextHeap++ : this.nextStack;
    if (kind !== "heap") this.nextStack += 4;
    const c = { id: this.cells.length + 1, addr, type, ptr, value, kind, names: [], frame, freed: false, init };
    this.cells.push(c);
    return c;
  }
  lookup(name, frame = this.top()) {
    if (name in frame.vars) return this.cellById(frame.vars[name]);
    throw new Error(`'${name}' was not declared in this scope (${frame.name})`);
  }
  nameOf(cell) {
    const live = cell.names.filter((n) => this.frames.some((f) => f.id === n.frame));
    return live.length ? live.map((n) => n.name).join("/") : null;
  }
  fmtValue(c) {
    if (!c.init) return "?";
    if (c.ptr) {
      const v = c.value;
      if (!v || v.ptr == null) return "nullptr";
      const t = this.cellById(v.ptr);
      if (!t) return hex(v.addr);
      if (t.freed) return `${hex(t.addr)} (dangling)`;
      const nm = this.nameOf(t);
      return "→ " + (nm ? nm : hex(t.addr));
    }
    if (c.type === "char") return JSON.stringify(String(c.value));
    return String(c.value);
  }
  // ---- expression evaluation: returns {lv: cell} for lvalues or {rv: value}; value is number | {ptr: id|null, addr}
  parseExpr(toks) {
    let p = 0;
    const peek = () => toks[p], next = () => toks[p++];
    const M = this;
    function primary() {
      const t = next();
      if (!t) throw new Error("unexpected end of expression");
      if (t.t === "num") return { rv: t.v };
      if (t.t === "chr") return { rv: t.v, chr: true };
      if (t.t === "str") return { rv: t.v, str: true };
      if (t.t === "op" && t.v === "(") { const e = expr(); const c = next(); if (!c || c.v !== ")") throw new Error("expected ')'"); return e; }
      if (t.t === "id") {
        if (t.v === "nullptr" || t.v === "NULL") return { rv: { ptr: null } };
        if (t.v === "true") return { rv: 1 }; if (t.v === "false") return { rv: 0 };
        if (t.v === "new") return newExpr();
        if (peek() && peek().t === "op" && peek().v === "(") throw new Error(`function calls inside expressions are not supported here ('${t.v}(…)'): call it as its own statement`);
        return { lv: M.lookup(t.v) };
      }
      throw new Error(`unexpected '${t.v}'`);
    }
    function newExpr() {
      const ty = next();
      if (!ty || ty.t !== "id") throw new Error("new needs a type");
      let init = null, arr = false;
      if (peek() && peek().t === "op" && (peek().v === "{" || peek().v === "(")) {
        const open = next().v, close = open === "{" ? "}" : ")";
        if (peek() && peek().t === "op" && peek().v === close) { next(); init = 0; }
        else { init = M.read(expr()); const c = next(); if (!c || c.v !== close) throw new Error(`expected '${close}'`); }
      } else if (peek() && peek().t === "op" && peek().v === "[") {
        next(); const n = M.read(expr()); const c = next(); if (!c || c.v !== "]") throw new Error("expected ']'"); arr = n;
      }
      if (arr !== false) {
        const first = M.newCell(ty.v, false, "heap", null, 0, false);
        first.array = arr; first.elems = [];
        for (let i = 1; i < arr; i++) { const e = M.newCell(ty.v, false, "heap", null, 0, false); e.hidden = true; first.elems.push(e.id); }
        return { rv: { ptr: first.id, addr: first.addr }, fresh: first };
      }
      const c = M.newCell(ty.v, false, "heap", null, init == null ? 0 : init, init != null);
      return { rv: { ptr: c.id, addr: c.addr }, fresh: c };
    }
    function unary() {
      const t = peek();
      if (t && t.t === "op") {
        if (t.v === "&") { next(); const e = unary(); if (!e.lv) throw new Error("& (address-of) needs a variable, not a value"); return { rv: { ptr: e.lv.id, addr: e.lv.addr }, addrOf: e.lv }; }
        if (t.v === "*") {
          next(); const e = unary(); const v = M.read(e);
          if (typeof v !== "object") throw new Error(`* (dereference) needs a pointer; '${render(e)}' is a plain ${e.lv ? e.lv.type : "value"}`);
          if (v.ptr == null) throw new Error("dereferencing nullptr: the program crashes here (segmentation fault)");
          const tgt = M.cellById(v.ptr);
          if (!tgt) throw new Error("dereferencing an invalid address");
          if (tgt.freed) throw new Error(`*${render(e)} reads memory that was already deleted (${hex(tgt.addr)}): undefined behaviour`);
          return { lv: tgt, via: e.lv };
        }
        if (t.v === "-") { next(); return { rv: -M.read(unary()) }; }
        if (t.v === "!") { next(); return { rv: M.read(unary()) ? 0 : 1 }; }
        if (t.v === "++" || t.v === "--") { next(); const e = unary(); if (!e.lv) throw new Error("++ needs a variable"); M.assign(e.lv, M.read(e) + (t.v === "++" ? 1 : -1)); return { rv: M.read(e) }; }
      }
      let e = primary();
      // array subscript p[i]
      while (peek() && peek().t === "op" && peek().v === "[") {
        next(); const idx = M.read(expr()); const c = next(); if (!c || c.v !== "]") throw new Error("expected ']'");
        const v = M.read(e); if (typeof v !== "object" || v.ptr == null) throw new Error("[] needs a pointer to an array");
        const first = M.cellById(v.ptr);
        const target = idx === 0 ? first : M.cellById((first.elems || [])[idx - 1]);
        if (!target) throw new Error(`index ${idx} is outside the array (undefined behaviour)`);
        e = { lv: target };
      }
      while (peek() && peek().t === "op" && (peek().v === "++" || peek().v === "--")) {
        const op = next().v; if (!e.lv) throw new Error("++ needs a variable");
        const old = M.read(e); M.assign(e.lv, old + (op === "++" ? 1 : -1)); e = { rv: old, post: true };
      }
      return e;
    }
    function render(e) { return e.lv ? (M.nameOf(e.lv) || hex(e.lv.addr)) : String(M.read(e)); }
    function term() { let l = unary(); while (peek() && peek().t === "op" && (peek().v === "*" || peek().v === "/")) { const op = next().v; const r = unary(); const a = M.read(l), b = M.read(r); if (typeof a === "object" || typeof b === "object") throw new Error("arithmetic on a pointer is not supported here"); l = { rv: op === "*" ? a * b : Math.trunc(a / b) }; } return l; }
    function sumE() { let l = term(); while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) { const op = next().v; const r = term(); const a = M.read(l), b = M.read(r); if (typeof a === "object" || typeof b === "object") throw new Error("pointer arithmetic is not supported here"); l = { rv: op === "+" ? a + b : a - b }; } return l; }
    function cmp() { let l = sumE(); while (peek() && peek().t === "op" && ["==", "!=", "<", ">"].includes(peek().v)) { const op = next().v; const r = sumE(); const a = M.read(l), b = M.read(r); const av = typeof a === "object" ? a.ptr : a, bv = typeof b === "object" ? b.ptr : b; l = { rv: op === "==" ? +(av === bv) : op === "!=" ? +(av !== bv) : op === "<" ? +(av < bv) : +(av > bv) }; } return l; }
    function expr() { return cmp(); }
    const e = expr();
    if (p < toks.length) throw new Error(`unexpected '${toks[p].v}'`);
    return e;
  }
  read(e) {
    if (e.lv) {
      if (e.lv.freed) throw new Error(`reading deleted memory at ${hex(e.lv.addr)}: undefined behaviour`);
      if (!e.lv.init) throw new Error(`'${this.nameOf(e.lv) || hex(e.lv.addr)}' is used before it was given a value (garbage / undefined behaviour)`);
      return e.lv.ptr ? (e.lv.value || { ptr: null }) : e.lv.value;
    }
    return e.rv;
  }
  assign(cell, v) {
    if (cell.freed) throw new Error(`writing to deleted memory at ${hex(cell.addr)}: undefined behaviour`);
    if (cell.ptr) {
      if (typeof v !== "object") throw new Error(`cannot store the number ${v} in a pointer: a pointer holds only an address (use &x, another pointer, new, or nullptr)`);
      cell.value = { ptr: v.ptr, addr: v.addr }; cell.init = true; return;
    }
    if (typeof v === "object") throw new Error(`cannot store an address in '${this.nameOf(cell)}' (type ${cell.type}); did you mean *ptr?`);
    if (cell.const) throw new Error(`'${this.nameOf(cell)}' is const: it cannot be assigned`);
    cell.value = v; cell.init = true;
  }
  eval(text) { return this.parseExpr(tokenize(text)); }

  // ---- statements ----
  run(limit = 300) {
    this.call("main", [], null);
    this.snapshot(this.funcs.main.line, "Program starts: main() is called and gets a stack frame for its local variables.", "start");
    try {
      while (this.frames.length && this.steps < limit) {
        const f = this.top();
        if (f.pc >= f.body.length) { this.ret(f, null, f.body.length ? f.body[f.body.length - 1].line : this.funcs[f.name].line); continue; }
        const st = f.body[f.pc++];
        this.steps++;
        this.exec(st, f);
      }
      if (this.steps >= limit) this.snapshot(null, "Stopped after too many steps.", "error");
    } catch (e) {
      this.snapshot(this.curLine, `Error: ${e.message}`, "error");
    }
    return this.snaps;
  }
  call(name, argTexts, callLine) {
    const fn = this.funcs[name];
    if (!fn) throw new Error(`no function named '${name}'`);
    if (argTexts.length !== fn.params.length) throw new Error(`${name} expects ${fn.params.length} argument(s), got ${argTexts.length}`);
    const caller = this.top();
    const frame = { id: ++this.frameSeq, name, vars: {}, body: fn.body, pc: 0, callLine };
    const notes = [];
    fn.params.forEach((p, i) => {
      const e = this.eval(argTexts[i]);
      if (p.ref) {
        if (!e.lv) throw new Error(`parameter '${p.name}' is a reference (int&): the argument must be a variable, not a value like '${argTexts[i]}'`);
        if (e.lv.ptr !== p.ptr) throw new Error(`cannot bind '${p.name}' (${p.type}${p.ptr ? "*" : ""}&) to '${argTexts[i]}'`);
        frame.vars[p.name] = e.lv.id;
        e.lv.names.push({ name: p.name, frame: frame.id });
        notes.push(`${p.name} is a reference: it becomes another name for ${this.nameOf(e.lv) || hex(e.lv.addr)} (no copy is made)`);
      } else {
        const v = this.read(e);
        if (p.ptr && typeof v !== "object") throw new Error(`parameter '${p.name}' is a pointer (${p.type}*): pass an address such as &x, not the value ${v}`);
        if (!p.ptr && typeof v === "object") throw new Error(`parameter '${p.name}' is a plain ${p.type}: you passed an address; pass the value instead (or make the parameter ${p.type}* / ${p.type}&)`);
        const c = this.newCell(p.type, p.ptr, "stack", frame.id, p.ptr ? { ptr: v.ptr, addr: v.addr } : v, true);
        c.names.push({ name: p.name, frame: frame.id });
        frame.vars[p.name] = c.id;
        notes.push(p.ptr ? `${p.name} is a pointer parameter: it gets a COPY of the address (${v.ptr != null ? "→ " + (this.nameOf(this.cellById(v.ptr)) || hex(v.addr)) : "nullptr"})` : `${p.name} is passed by value: a brand-new box holding a COPY of ${v}`);
      }
    });
    this.frames.push(frame);
    if (caller) this.snapshot(callLine, `Call ${name}(${argTexts.join(", ")}): a new stack frame is pushed. ${notes.join(". ")}.`, "call");
  }
  ret(frame, value, line) {
    this.frames.pop();
    // destroy locals and alias names
    for (const c of this.cells) c.names = c.names.filter((n) => n.frame !== frame.id);
    const destroyed = this.cells.filter((c) => c.frame === frame.id && c.kind === "stack");
    for (const c of destroyed) c.freed = true;
    if (frame.name === "main") {
      const leaks = this.leaks();
      this.snapshot(line, `main returns; the program ends.${leaks.length ? ` ${leaks.length} heap block${leaks.length > 1 ? "s were" : " was"} never deleted and nothing points at ${leaks.length > 1 ? "them" : "it"} any more: MEMORY LEAK (C++ has no garbage collector).` : " Every heap block was deleted: no leaks."}`, "end");
    } else {
      this.snapshot(line, `${frame.name} returns: its frame is popped and its local boxes (${destroyed.map((c) => c.names.length ? c.names[0].name : hex(c.addr)).join(", ") || "none"}) are destroyed. Anything it changed through a pointer or a reference stays changed.`, "return");
    }
  }
  exec(st, frame) {
    const text = st.text; this.curLine = st.line;
    let m;
    // return
    if ((m = /^return\b\s*(.*)$/.exec(text))) { this.ret(frame, m[1] ? this.read(this.eval(m[1])) : null, st.line); return; }
    // delete
    if ((m = /^delete\s*(\[\s*\])?\s*(.+)$/.exec(text))) {
      const e = this.eval(m[2]); const v = this.read(e);
      if (typeof v !== "object") throw new Error("delete needs a pointer");
      if (v.ptr == null) { this.snapshot(st.line, `delete on nullptr does nothing (that is allowed).`); return; }
      const c = this.cellById(v.ptr);
      if (c.kind !== "heap") throw new Error(`delete on ${this.nameOf(c) || hex(c.addr)}: that box was not allocated with new (it lives on the stack) → undefined behaviour / crash`);
      if (c.freed) throw new Error(`double delete of ${hex(c.addr)}: that block was already freed → undefined behaviour / crash`);
      if (c.array && !m[1]) throw new Error("this block came from new[]; free it with delete[] (plain delete is undefined behaviour)");
      c.freed = true; for (const id of c.elems || []) this.cellById(id).freed = true;
      const holders = this.cells.filter((x) => x.ptr && x.value && x.value.ptr === c.id && !x.freed).map((x) => this.nameOf(x)).filter(Boolean);
      this.snapshot(st.line, `${text}: the heap block at ${hex(c.addr)} (value ${c.value}) is given back to the system. ${holders.length ? holders.join(", ") + " still hold" + (holders.length > 1 ? "" : "s") + " that address (a dangling pointer): do not dereference it again." : ""}`);
      return;
    }
    // cout
    if ((m = /^(std::)?cout\s*<<\s*(.*)$/.exec(text))) {
      const parts = splitOn(m[2], "<<");
      let s = "";
      for (const part of parts) {
        const p = part.trim();
        if (p === "endl" || p === "std::endl" || p === "'\\n'") { s += "\n"; continue; }
        const e = this.eval(p);
        if (e.str) { s += e.rv; continue; }
        const v = this.read(e);
        s += typeof v === "object" ? (v.ptr == null ? "0" : hex(this.cellById(v.ptr).addr)) : (e.lv && e.lv.type === "char" ? String(v) : String(v));
      }
      this.out += s;
      this.snapshot(st.line, `Prints: ${JSON.stringify(s)}`);
      return;
    }
    // declaration
    if ((m = /^(const\s+)?(int|long|double|char|bool|float)\s*(\*|&)?\s*(\w+)\s*(?:(=)\s*(.+)|\{(.*)\}|\((.*)\))?$/.exec(text))) {
      const isConst = !!m[1], type = m[2], ptr = m[3] === "*", ref = m[3] === "&", name = m[4];
      const initText = m[6] ?? m[7] ?? m[8];
      const hasInit = m[5] != null || m[7] != null || m[8] != null;
      if (name in frame.vars) throw new Error(`'${name}' is already declared in ${frame.name}`);
      if (ref) {
        if (!hasInit || !initText.trim()) throw new Error(`a reference must be initialized when it is created: 'int& ${name};' does not compile`);
        const e = this.eval(initText);
        if (!e.lv) {
          if (!isConst) throw new Error(`cannot bind a non-const reference to a temporary value: 'int& ${name} = ${initText.trim()}' does not compile. A const reference (const int& ${name}) may bind to a temporary.`);
          const v = this.read(e);
          const c = this.newCell(type, false, "temp", frame.id, v, true); c.const = true; c.names.push({ name: `${name} (temporary)`, frame: frame.id });
          frame.vars[name] = c.id;
          this.snapshot(st.line, `${text}: a const reference may bind to a temporary. The compiler materializes a hidden temporary ${type} holding ${v} and ${name} refers to it.`);
          return;
        }
        if (e.lv.type !== type || e.lv.ptr !== ptr) {
          if (!isConst) throw new Error(`cannot bind '${type}& ${name}' to '${initText.trim()}' of type ${e.lv.type}: converting would create a temporary, and a non-const reference cannot refer to a temporary. (const ${type}& ${name} = … would compile, but it refers to a copy.)`);
          const v = this.read(e);
          const c = this.newCell(type, false, "temp", frame.id, v, true); c.const = true; c.names.push({ name: `${name} (temporary copy)`, frame: frame.id });
          frame.vars[name] = c.id;
          this.snapshot(st.line, `${text}: the types differ (${e.lv.type} → ${type}), so the compiler makes a temporary ${type} copy of ${this.nameOf(e.lv)} (${v}) and the const reference binds to THAT. Changing ${this.nameOf(e.lv)} later will not change ${name}.`);
          return;
        }
        frame.vars[name] = e.lv.id;
        e.lv.names.push({ name, frame: frame.id });
        this.snapshot(st.line, `${text}: no new box is created. ${name} is an alias, a second name for ${this.nameOf(e.lv).split("/")[0]}'s box at ${hex(e.lv.addr)}. It can never be re-seated to a different variable.`);
        return;
      }
      const c = this.newCell(type, ptr, "stack", frame.id, ptr ? { ptr: null } : 0, false);
      c.const = isConst;
      c.names.push({ name, frame: frame.id });
      frame.vars[name] = c.id;
      if (hasInit && initText.trim() !== "") {
        const e = this.eval(initText);
        const v = this.read(e);
        c.init = false; this.assign(c, v);
        if (ptr) {
          const tgt = v.ptr != null ? this.cellById(v.ptr) : null;
          this.snapshot(st.line, `${text}: ${name} is a pointer box at ${hex(c.addr)} that can hold only an address. ${tgt ? (e.fresh ? `new ${type} allocated a nameless box on the heap at ${hex(tgt.addr)} holding ${tgt.value}; ${name} stores that address.` : `It stores ${hex(tgt.addr)}, the address of ${this.nameOf(tgt) || "the heap box"}: ${name} points to ${this.nameOf(tgt) || hex(tgt.addr)}.`) : `It holds nullptr: it points at nothing (safe to test, unsafe to dereference).`}`);
        } else {
          this.snapshot(st.line, `${text}: reserves a ${type} box on the stack at ${hex(c.addr)}, named ${name}, and stores ${this.fmtValue(c)}${e.lv && e.lv !== c ? ` (a copy of ${this.nameOf(e.lv) || "the value"})` : ""}.`);
        }
      } else if (hasInit) {
        c.init = true; c.value = ptr ? { ptr: null } : 0;
        this.snapshot(st.line, `${text}: value-initialized to ${ptr ? "nullptr" : "0"}.`);
      } else {
        this.snapshot(st.line, `${text}: reserves ${ptr ? "a pointer" : "a " + type} box at ${hex(c.addr)} named ${name} but gives it NO value: it holds garbage until you assign to it${ptr ? " (assign nullptr if you have nothing to point at yet)" : ""}.`);
      }
      return;
    }
    // function call statement
    if ((m = /^(\w+)\s*\((.*)\)$/.exec(text)) && this.funcs[m[1]]) {
      this.call(m[1], splitArgs(m[2]), st.line);
      return;
    }
    // compound / plain assignment
    if ((m = /^(.+?)\s*(\+=|-=|=)\s*(.+)$/.exec(text)) && !/[=!<>]=$/.test(m[1])) {
      const lhs = this.eval(m[1]);
      if (!lhs.lv) throw new Error(`left side of '=' must be a variable or *pointer`);
      const rhs = this.eval(m[3]);
      let v = this.read(rhs);
      if (m[2] !== "=") { const cur = this.read(lhs); v = m[2] === "+=" ? cur + v : cur - v; }
      const before = this.fmtValue(lhs.lv);
      this.assign(lhs.lv, v);
      const target = this.nameOf(lhs.lv) || hex(lhs.lv.addr);
      if (lhs.lv.ptr) {
        const tgt = v.ptr != null ? this.cellById(v.ptr) : null;
        const lost = this.leaks();
        this.snapshot(st.line, `${text}: ${target} now holds ${tgt ? hex(tgt.addr) + " and points to " + (this.nameOf(tgt) || "the heap box at " + hex(tgt.addr)) : "nullptr"}. Assigning to a POINTER changes where it points; the boxes it pointed at before are untouched.${lost.length ? ` The heap box at ${hex(this.cellById(lost[0]).addr)} now has nothing pointing at it: no way to delete it → MEMORY LEAK.` : ""}`);
      } else if (lhs.via) {
        this.snapshot(st.line, `${text}: *${this.nameOf(lhs.via)} follows the arrow to ${target} and writes ${this.fmtValue(lhs.lv)} there (it was ${before}). The pointer itself did not change.`);
      } else if (lhs.lv.names.length > 1 && lhs.lv.names.some((n) => n.name === m[1].trim())) {
        this.snapshot(st.line, `${text}: assigning through the reference changes the one shared box: ${target} = ${this.fmtValue(lhs.lv)} (was ${before}). The reference still refers to the same variable.`);
      } else {
        this.snapshot(st.line, `${text}: ${target} = ${this.fmtValue(lhs.lv)} (was ${before}).`);
      }
      return;
    }
    // ++ / -- statements and bare expressions
    const e = this.eval(text);
    if (e.post != null || /\+\+|--/.test(text)) {
      const tgt = /\*\s*\(?\s*(\w+)/.exec(text) && text.includes("*") ? "the box the pointer points at" : null;
      const nm = (() => { const id = /(\w+)/.exec(text.replace(/\+\+|--|[()*]/g, " ").trim()); return id ? id[1] : "?"; })();
      const c = frame.vars[nm] != null ? this.cellById(frame.vars[nm]) : null;
      const shown = c ? (c.ptr ? this.fmtValue(this.cellById(c.value.ptr)) : this.fmtValue(c)) : "";
      this.snapshot(st.line, `${text}: ${tgt ? `dereference first, then increment: ${nm} points at a box, and that box becomes ${shown}` : `${nm} becomes ${shown}`}.`);
      return;
    }
    this.snapshot(st.line, `${text}: evaluated (no effect).`);
  }
}
function splitOn(s, sep) {
  const out = []; let depth = 0, cur = "", q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === "\\") cur += s[++i] ?? ""; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if ("([{".includes(c)) depth++; if (")]}".includes(c)) depth--;
    if (depth === 0 && s.startsWith(sep, i)) { out.push(cur); cur = ""; i += sep.length - 1; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}
function splitArgs(s) { return s.trim() ? splitOn(s, ",").map((x) => x.trim()) : []; }

const PV_PRESETS = {
  "Practice activity (fill in x and y)": { watch: ["x", "y"], code: `#include <iostream>
using namespace std;

int main()
{
    int x = 5;
    int y = 15;
    int * p1;
    int * p2;
    p1 = &x;        // x = ____; y = ____
    p2 = &y;        // x = ____; y = ____
    *p1 = 5;        // x = ____; y = ____
    *p1 = *p2;      // x = ____; y = ____
    p2 = p1;        // x = ____; y = ____
    *p1 = *p2 + 10; // x = ____; y = ____
    return 0;
}` },
  "swap by value (does it work?)": { watch: ["first", "second"], code: `void swap(int arg1, int arg2)
{
    int temp{arg1};
    arg1 = arg2;
    arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};
    swap(first, second);
    // does first = 2526 and second = 3522?
    return 0;
}` },
  "swap with pointers": { watch: ["first", "second"], code: `void swap(int* arg1, int* arg2)
{
    int temp{*arg1};
    *arg1 = *arg2;
    *arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};
    swap(&first, &second);
    return 0;
}` },
  "swap with references": { watch: ["first", "second"], code: `void swap(int& arg1, int& arg2)
{
    int temp{arg1};
    arg1 = arg2;
    arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};
    swap(first, second);
    return 0;
}` },
  "reference = alias": { watch: ["n", "m", "ref"], code: `#include <iostream>
using namespace std;

int main()
{
    int n{123};
    int& ref = n;
    int m{345};
    ref = m;       // same as n = m
    cout << n << endl;   // 345
    cout << ref << endl; // 345
    m = 999;
    cout << ref << endl; // still 345: ref was never re-seated to m
    return 0;
}` },
  "numRef = num2": { watch: ["num", "num2"], code: `int main()
{
    int num = 100;
    int num2 = 200;
    int& numRef = num;  // numRef refers to num
    numRef = num2;      // still refers to num, but num's value is now 200
    num2 = 300;         // numRef does not follow num2
    return 0;
}` },
  "test(int& x, int y, int* z)": { watch: ["a", "b"], code: `#include <iostream>
using namespace std;

void test( int& x, int y, int* z )
{
    x++;
    y++;
    (*z)++;
}

int main()
{
    int a = 7;
    int b = 6;
    int* c = &b;
    test(a, b, c);
    cout << a << " " << b << " " << *c << endl;
    return 0;
}` },
  "memory leak": { watch: [], code: `int main()
{
    int *i = new int{11};
    int *a = new int{99};
    i = a;      // creates a memory leak
    delete i;   // frees the 99 block; the 11 block is lost forever
    return 0;
}` },
  "leak fixed": { watch: [], code: `int main()
{
    int *i = new int{11};
    int *a = new int{99};
    delete i;   // free the 11 block FIRST
    i = a;      // now i can safely point somewhere else
    delete i;   // frees the 99 block (a is now dangling)
    return 0;
}` },
  "new / delete / new[]": { watch: [], code: `int main()
{
    int * my_pointer = nullptr;
    my_pointer = new int { 3522 };
    int * other = new int;
    *other = 42;
    int * arr = new int[3];
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    delete my_pointer;
    delete other;
    delete[] arr;
    return 0;
}` },
  "references to constants": { watch: [], code: `int main()
{
    const int& r{1};      // OK: const reference to a temporary
    int n{12};
    const long& ref = n;  // OK, but binds to a temporary long COPY of n
    n = 20;               // ref still 12
    int& bad{1};          // will not compile
    return 0;
}` },
};

function pointerViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "Pointers and references in memory: step through the program"));
  const presetNames = Object.keys(PV_PRESETS);
  let presetName = cfg.preset && PV_PRESETS[cfg.preset] ? cfg.preset : presetNames[0];
  let code = cfg.program || PV_PRESETS[presetName].code;
  let watch = cfg.watch || PV_PRESETS[presetName].watch || [];
  const showPresets = cfg.presets !== false;

  const ctl = el("div", "pv-ctl");
  const resetB = el("button", "reset-btn", "⟲ Reset"), prevB = el("button", "reset-btn", "← Prev"), nextB = el("button", "run-btn", "Next →"), endB = el("button", "reset-btn", "Run to end");
  const pos = el("span", "scrub-pos");
  ctl.append(resetB, prevB, nextB, endB, pos);
  const main = el("div", "pv-main");
  const codeEl = el("div", "pv-code");
  const mem = el("div", "pv-mem");
  const stackEl = el("div", "pv-stack"), heapEl = el("div", "pv-heap");
  const arrows = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrows.setAttribute("class", "pv-arrows");
  mem.append(stackEl, heapEl, arrows);
  main.append(codeEl, mem);
  const msg = el("div", "pv-msg");
  const out = el("div", "pv-out");
  const watchEl = el("div", "pv-watch");
  const editWrap = el("details", "pv-edit");
  const sum = el("summary", null, "Edit the program (declarations, =, *, &, new/delete, cout, and simple function calls are supported)");
  const ta = document.createElement("textarea"); ta.className = "data-input"; ta.rows = 12;
  const applyB = el("button", "reset-btn", "Run edited program");
  editWrap.append(sum, ta, applyB);
  if (showPresets) box.append(btnRow(presetNames, (i, l) => { presetName = l; code = PV_PRESETS[l].code; watch = PV_PRESETS[l].watch || []; ta.value = code; build(); }, presetNames.indexOf(presetName)));
  box.append(ctl, main, msg, watchEl, out, editWrap);
  ta.value = code;
  applyB.addEventListener("click", () => { code = ta.value; build(); });

  let snaps = [], k = 0, parseError = null;
  function build() {
    parseError = null;
    try { const funcs = parseProgram(code); snaps = new Machine(funcs).run(); }
    catch (e) { parseError = e.message; snaps = []; }
    k = 0;
    renderCode();
    show();
  }
  function renderCode() {
    codeEl.innerHTML = "";
    code.replace(/\s+$/, "").split("\n").forEach((line, i) => {
      const row = el("div", "pl");
      row.dataset.line = String(i + 1);
      row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", line) || " "}</span>`;
      codeEl.append(row);
    });
  }
  function show() {
    prevB.disabled = k === 0; nextB.disabled = k >= snaps.length - 1; endB.disabled = nextB.disabled;
    if (parseError) { msg.textContent = "Could not read the program: " + parseError; msg.className = "pv-msg error"; stackEl.innerHTML = ""; heapEl.innerHTML = ""; arrows.innerHTML = ""; out.textContent = ""; watchEl.innerHTML = ""; pos.textContent = ""; return; }
    const s = snaps[k];
    if (!s) return;
    pos.textContent = `step ${k} / ${snaps.length - 1}`;
    codeEl.querySelectorAll(".pl").forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === s.line));
    const cur = codeEl.querySelector(".pl.cur"); if (cur) cur.scrollIntoView({ block: "nearest" });
    msg.textContent = s.msg; msg.className = "pv-msg " + s.kind;
    out.textContent = s.out ? "output:\n" + s.out : "";
    out.style.display = s.out ? "" : "none";
    // stack frames
    stackEl.innerHTML = "<div class='pv-title'>Stack (automatic: created and destroyed for you)</div>";
    const liveFrames = new Set(s.frames.map((f) => f.id));
    for (const f of s.frames) {
      const fr = el("div", "pv-frame");
      fr.append(el("div", "pv-frame-title", f.name + "()"));
      const cells = s.cells.filter((c) => (c.kind === "stack" || c.kind === "temp") && !c.freed && (c.frame === f.id || Object.values(f.vars).includes(c.id)) && c.frame === f.id);
      for (const c of cells) fr.append(cellEl(c, s, liveFrames));
      stackEl.append(fr);
    }
    heapEl.innerHTML = "<div class='pv-title'>Heap (new / delete: your responsibility)</div>";
    const heap = s.cells.filter((c) => c.kind === "heap" && !c.hidden);
    if (!heap.length) heapEl.append(el("div", "pv-empty", "nothing allocated"));
    for (const c of heap) heapEl.append(cellEl(c, s, liveFrames));
    // watch table
    watchEl.innerHTML = "";
    if (watch.length) {
      const t = el("table", "group-table pv-watch-table");
      t.innerHTML = `<thead><tr><th>after step</th>${watch.map((w) => `<th>${esc(w)}</th>`).join("")}</tr></thead><tbody></tbody>`;
      const tb = t.querySelector("tbody");
      for (let j = 1; j <= k; j++) {
        const sj = snaps[j]; if (!sj || sj.kind === "call" || sj.kind === "return") continue;
        const tr = el("tr");
        tr.innerHTML = `<td>${sj.line != null ? "line " + sj.line : ""}</td>` + watch.map((w) => { const v = watchValue(sj, w); return `<td>${esc(v)}</td>`; }).join("");
        tb.append(tr);
      }
      watchEl.append(t);
    }
    requestAnimationFrame(drawArrows);
  }
  function watchValue(s, name) {
    // value of variable `name` in the outermost frame that has it (main first)
    for (const f of s.frames) if (name in f.vars) { const c = s.cells.find((x) => x.id === f.vars[name]); return c ? fmtCell(c, s, new Set(s.frames.map((x) => x.id))) : "?"; }
    return "—";
  }
  function fmtCell(c, s, live) {
    if (!c.init) return "?";
    if (c.ptr) {
      const v = c.value; if (!v || v.ptr == null) return "nullptr";
      const t = s.cells.find((x) => x.id === v.ptr); if (!t) return hex(v.addr);
      if (t.freed) return hex(t.addr) + " (dangling)";
      const names = t.names.filter((n) => live.has(n.frame)).map((n) => n.name);
      return "→ " + (names.length ? names.join("/") : hex(t.addr));
    }
    return String(c.value);
  }
  function cellEl(c, s, live) {
    const d = el("div", "pv-cell" + (c.ptr ? " ptr" : "") + (c.freed ? " freed" : "") + (s.leaks.includes(c.id) ? " leaked" : "") + (c.kind === "temp" ? " temp" : ""));
    d.dataset.cell = String(c.id);
    const names = c.names.filter((n) => live.has(n.frame)).map((n) => n.name);
    d.append(el("div", "pv-names", names.length ? names.join("  /  ") : (c.kind === "heap" ? "(no name: reach it through a pointer)" : "")));
    d.append(el("div", "pv-type", `${c.const ? "const " : ""}${c.type}${c.ptr ? "*" : ""}${c.array ? `[${c.array}]` : ""}`));
    const val = el("div", "pv-val", c.array ? "[" + [c.id, ...(c.elems || [])].map((id) => { const e = s.cells.find((x) => x.id === id); return e && e.init ? e.value : "?"; }).join(", ") + "]" : fmtCell(c, s, live));
    d.append(val);
    d.append(el("div", "pv-addr", hex(c.addr) + (c.freed ? "  deleted" : s.leaks.includes(c.id) ? "  LEAKED" : "")));
    return d;
  }
  function drawArrows() {
    arrows.innerHTML = "";
    const r0 = mem.getBoundingClientRect();
    // Sized by CSS (inset: 0) so it always matches the memory box; the viewBox maps 1:1 to it.
    arrows.setAttribute("viewBox", `0 0 ${r0.width} ${r0.height}`);
    arrows.setAttribute("preserveAspectRatio", "none");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `<marker id="pv-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--hl)"/></marker>`;
    arrows.append(defs);
    const s = snaps[k]; if (!s) return;
    for (const c of s.cells) {
      if (!c.ptr || !c.init || !c.value || c.value.ptr == null || c.freed) continue;
      const from = mem.querySelector(`.pv-cell[data-cell="${c.id}"] .pv-val`);
      const to = mem.querySelector(`.pv-cell[data-cell="${c.value.ptr}"]`);
      if (!from || !to) continue;
      const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const x1 = a.right - r0.left - 6, y1 = a.top + a.height / 2 - r0.top;
      const sameCol = Math.abs(a.left - b.left) < 40;
      const x2 = sameCol ? b.right - r0.left : b.left - r0.left, y2 = b.top + b.height / 2 - r0.top;
      const dx = Math.max(30, Math.abs(x2 - x1) / 2);
      const d = sameCol ? `M${x1},${y1} C${x1 + 50},${y1} ${x2 + 50},${y2} ${x2},${y2}` : `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d); path.setAttribute("fill", "none"); path.setAttribute("stroke", "var(--hl)"); path.setAttribute("stroke-width", "2"); path.setAttribute("marker-end", "url(#pv-arrow)");
      arrows.append(path);
    }
  }
  resetB.addEventListener("click", () => { k = 0; show(); });
  prevB.addEventListener("click", () => { if (k > 0) { k--; show(); } });
  nextB.addEventListener("click", () => { if (k < snaps.length - 1) { k++; show(); } });
  endB.addEventListener("click", () => { k = snaps.length - 1; show(); });
  box.tabIndex = 0;
  box.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { nextB.click(); e.preventDefault(); } if (e.key === "ArrowLeft") { prevB.click(); e.preventDefault(); } });
  window.addEventListener("resize", () => requestAnimationFrame(drawArrows));
  build();
}

// =====================================================================
// file-seek: a file with a cursor; tellg/tellp, seekg/seekp with beg/cur/end, get/put
// =====================================================================
function fileSeek(box, cfg) {
  box.append(el("h4", null, cfg.title || "helloWorld.txt: where is the cursor? (tellg / tellp / seekg / seekp)"));
  const st = { content: cfg.content || "Hello World", kind: null, pos: 0, log: [], eof: false };
  const original = st.content;
  const fileEl = el("div", "fs-file");
  const status = el("div", "stat-grid");
  const log = el("pre", "manip-code fs-log");
  const openRow = btnRow([`ifstream myFile("helloWorld.txt")`, `ofstream myFile("helloWorld.txt")`, `ofstream myFile("helloWorld.txt", ios::app)`, `fstream myFile("helloWorld.txt")`], (i) => open(["ifstream", "ofstream", "ofstream-app", "fstream"][i]), -1);
  const tellRow = el("div", "viz-btn-row");
  const tellG = el("button", "viz-btn", "myFile.tellg()"), tellP = el("button", "viz-btn", "myFile.tellp()");
  tellRow.append(tellG, tellP);
  const seekRow = el("div", "viz-inline");
  const offIn = document.createElement("input"); offIn.className = "q-input small"; offIn.value = "6";
  const dirSel = document.createElement("select"); dirSel.className = "q-input small";
  for (const d of ["(absolute)", "ios::beg", "ios::cur", "ios::end"]) { const o = document.createElement("option"); o.value = d; o.textContent = d; dirSel.append(o); }
  const seekG = el("button", "viz-btn", "seekg"), seekP = el("button", "viz-btn", "seekp");
  seekRow.append(el("span", "stat-label", "offset"), offIn, dirSel, seekG, seekP);
  const examples = btnRow(["seekp(6)", "seekp(4, ios::beg)", "seekp(-4, ios::end)", "seekp(-4, ios::end) then seekp(-6, ios::cur)", "file size: seekg(0, ios::end); tellg()"], (i) => {
    if (i === 0) seek("p", 6, null);
    if (i === 1) seek("p", 4, "ios::beg");
    if (i === 2) seek("p", -4, "ios::end");
    if (i === 3) { seek("p", -4, "ios::end"); seek("p", -6, "ios::cur"); }
    if (i === 4) { seek("g", 0, "ios::end"); tell("g"); }
  }, -1);
  const ioRow = el("div", "viz-inline");
  const getB = el("button", "viz-btn", "char c = myFile.get()"), putIn = document.createElement("input"); putIn.className = "q-input small"; putIn.value = "X"; putIn.maxLength = 1;
  const putB = el("button", "viz-btn", "myFile.put(c)"), resetB = el("button", "reset-btn", "restore file");
  ioRow.append(getB, el("span", "stat-label", " put char:"), putIn, putB, resetB);
  box.append(el("p", "widget-note", "Open the file with one of the four stream types, then read or move the cursor. Positions count characters from 0; the position after the last character equals the file size. The buttons build the exact C++ and show what each call returns."),
    openRow, fileEl, status, tellRow, seekRow, examples, ioRow, log);

  function say(codeLine, result) { st.log.push(result != null ? `${codeLine.padEnd(44)} // ${result}` : codeLine); render(); }
  function open(kind) {
    st.kind = kind; st.eof = false;
    if (kind === "ofstream") { st.content = ""; st.pos = 0; say(`ofstream myFile("helloWorld.txt");`, "opened for writing: existing contents DISCARDED (truncated), cursor at 0"); }
    else if (kind === "ofstream-app") { st.pos = st.content.length; say(`ofstream myFile("helloWorld.txt", ios::app);`, `append mode: contents kept, cursor at the end (${st.pos}) as on the slide; MinGW's tellp() reports 0 until the first write, but writes still go to the end`); }
    else if (kind === "ifstream") { st.pos = 0; say(`ifstream myFile("helloWorld.txt");`, "opened for reading, cursor at 0"); }
    else { st.pos = 0; say(`fstream myFile("helloWorld.txt");`, "opened for reading AND writing (in | out), contents kept, cursor at 0"); }
  }
  function need() { if (!st.kind) { say("// open the file first", null); return false; } return true; }
  function canG() { return st.kind === "ifstream" || st.kind === "fstream"; }
  function canP() { return st.kind !== "ifstream"; }
  function tell(which) {
    if (!need()) return;
    if (which === "g" && !canG()) return say(`myFile.tellg();`, `COMPILE ERROR: an ofstream has no tellg — use tellp for output streams`);
    if (which === "p" && !canP()) return say(`myFile.tellp();`, `COMPILE ERROR: an ifstream has no tellp — use tellg for input streams`);
    say(`cout << myFile.tell${which}() << endl;`, `prints ${st.eof ? -1 : st.pos}${st.eof ? " (after hitting EOF, tellg returns -1 until you clear())" : ""}`);
  }
  function seek(which, off, dir) {
    if (!need()) return;
    if (which === "g" && !canG()) return say(`myFile.seekg(${off}${dir ? ", " + dir : ""});`, "COMPILE ERROR: ofstream has no seekg — use seekp");
    if (which === "p" && !canP()) return say(`myFile.seekp(${off}${dir ? ", " + dir : ""});`, "COMPILE ERROR: ifstream has no seekp — use seekg");
    const n = st.content.length;
    const base = dir === "ios::cur" ? st.pos : dir === "ios::end" ? n : 0;
    const target = base + off;
    if (target < 0 || (target > n && dir !== null)) return say(`myFile.seek${which}(${off}${dir ? ", " + dir : ""});`, `FAILS: position ${target} is outside the file (0…${n}); failbit set, cursor stays at ${st.pos}`);
    st.pos = target; st.eof = false;
    say(`myFile.seek${which}(${off}${dir ? ", " + dir : ""});`, dir === null ? `absolute position ${target}` : dir === "ios::beg" ? `${off} from the beginning (0) → ${target}` : dir === "ios::end" ? `end is ${n}; ${n} ${off < 0 ? "−" : "+"} ${Math.abs(off)} → ${target}` : `current was ${base}; ${base} ${off < 0 ? "−" : "+"} ${Math.abs(off)} → ${target}`);
  }
  getB.addEventListener("click", () => {
    if (!need()) return;
    if (!canG()) return say("char c = myFile.get();", "COMPILE ERROR: get() reads; an ofstream cannot read");
    if (st.pos >= st.content.length) { st.eof = true; return say("char c = myFile.get();", "returns EOF (-1): nothing left to read; eofbit (and failbit) set"); }
    const c = st.content[st.pos]; st.pos++;
    say("char c = myFile.get();", `c = '${c === " " ? " " : c}' (the character at position ${st.pos - 1}); cursor moves to ${st.pos}`);
  });
  putB.addEventListener("click", () => {
    if (!need()) return;
    if (!canP()) return say(`myFile.put('${putIn.value || "X"}');`, "COMPILE ERROR: put() writes; an ifstream cannot write");
    const ch = (putIn.value || "X")[0];
    if (st.kind === "ofstream-app") { st.pos = st.content.length; st.content += ch; st.pos = st.content.length; return say(`myFile.put('${ch}');`, `ios::app: EVERY write first jumps to the end, so '${ch}' is appended at ${st.pos - 1}; cursor now ${st.pos}`); }
    if (st.pos >= st.content.length) st.content += ch; else st.content = st.content.slice(0, st.pos) + ch + st.content.slice(st.pos + 1);
    st.pos++;
    say(`myFile.put('${ch}');`, `wrote '${ch}' at position ${st.pos - 1} (overwriting what was there); cursor now ${st.pos}`);
  });
  resetB.addEventListener("click", () => { st.content = original; st.kind = null; st.pos = 0; st.log = []; st.eof = false; render(); });
  tellG.addEventListener("click", () => tell("g")); tellP.addEventListener("click", () => tell("p"));
  seekG.addEventListener("click", () => seek("g", parseInt(offIn.value, 10) || 0, dirSel.value === "(absolute)" ? null : dirSel.value));
  seekP.addEventListener("click", () => seek("p", parseInt(offIn.value, 10) || 0, dirSel.value === "(absolute)" ? null : dirSel.value));
  function render() {
    fileEl.innerHTML = "";
    const chars = st.content.split("");
    for (let i = 0; i <= chars.length; i++) {
      if (i === st.pos) fileEl.append(el("span", "fs-cursor", ""));
      if (i < chars.length) { const c = el("span", "fs-char", chars[i] === " " ? "␣" : chars[i]); c.append(el("span", "fs-idx", String(i))); fileEl.append(c); }
      else { const e = el("span", "fs-char end", "EOF"); e.append(el("span", "fs-idx", String(i))); fileEl.append(e); }
    }
    status.innerHTML = "";
    for (const [l, v, n] of [["stream", st.kind ? (st.kind === "ofstream-app" ? "ofstream (ios::app)" : st.kind) : "not open", st.kind === "ifstream" ? "has tellg/seekg only" : st.kind === "fstream" ? "has both g and p" : st.kind ? "has tellp/seekp only" : ""], ["cursor position", String(st.pos), `${st.pos === st.content.length ? "at the end" : `before '${st.content[st.pos] === " " ? "space" : st.content[st.pos]}'`}`], ["file size", `${st.content.length} bytes`, "end − beg"]]) status.append(cellOf(l, v, n));
    log.textContent = st.log.length ? st.log.join("\n") : "// click a button above";
  }
  function cellOf(l, v, n) { const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", v)); if (n) c.append(el("div", "stat-note", n)); return c; }
  render();
}

// =====================================================================
// open-modes: which flags do what
// =====================================================================
function openModes(box, cfg) {
  box.append(el("h4", null, cfg.title || "Open modes: what happens to the file?"));
  const st = { cls: "ofstream", flags: new Set(), exists: true };
  const clsRow = btnRow(["ifstream", "ofstream", "fstream"], (i, l) => { st.cls = l; render(); }, 1);
  const flagRow = el("div", "viz-btn-row");
  const FLAGS = ["in", "out", "app", "trunc", "ate", "binary"];
  const flagBtns = FLAGS.map((f) => { const b = el("button", "viz-btn", "ios_base::" + f); b.addEventListener("click", () => { if (st.flags.has(f)) st.flags.delete(f); else st.flags.add(f); render(); }); flagRow.append(b); return b; });
  const existRow = btnRow(["file exists (contents: Hello World)", "file does not exist"], (i) => { st.exists = i === 0; render(); }, 0);
  const code = el("pre", "manip-code");
  const outcome = el("div", "stat-grid");
  const table = el("div", "stat-steps");
  box.append(el("p", "widget-note", "Pick the stream class, toggle mode flags (they combine with bitwise OR), and see the exact constructor call and its effect: does the open succeed, are old contents kept, where does the cursor start."), clsRow, flagRow, existRow, code, outcome, table);
  function render() {
    flagBtns.forEach((b, i) => b.classList.toggle("active", st.flags.has(FLAGS[i])));
    const f = new Set(st.flags);
    // implied flags
    if (st.cls === "ifstream") f.add("in");
    if (st.cls === "ofstream") f.add("out");
    if (st.cls === "fstream" && !st.flags.size) { f.add("in"); f.add("out"); }
    const explicit = [...st.flags].map((x) => "ios_base::" + x).join(" | ");
    code.textContent = `${st.cls} f{"data.txt"${explicit ? ", " + explicit : ""}};\nif (!f.is_open()) { cerr << "Unable to open file" << endl; exit(1); }`;
    const has = (x) => f.has(x);
    const key = ["in", "out", "app", "trunc"].filter(has).join("|");
    // C++ table of valid combinations (binary/ate are modifiers)
    const TABLE = {
      "in": ["r", "read only; must already exist", false, "0"],
      "out": ["w", "write; create or TRUNCATE (empty it)", true, "0"],
      "out|trunc": ["w", "write; create or truncate", true, "0"],
      "app": ["a", "append; create if missing; every write goes to the end", false, "end"],
      "out|app": ["a", "append; create if missing; every write goes to the end", false, "end"],
      "in|out": ["r+", "read and write; must already exist; contents kept", false, "0"],
      "in|out|trunc": ["w+", "read and write; create or truncate", true, "0"],
      "in|app": ["a+", "read and append; create if missing", false, "end for writes"],
      "in|out|app": ["a+", "read and append; create if missing", false, "end for writes"],
    };
    const row = TABLE[key];
    outcome.innerHTML = "";
    if (!row) { outcome.append(cellOf("result", "INVALID combination", `${key || "(none)"} is not an allowed openmode: the open fails (is_open() is false)`)); return; }
    const [cmode, meaning, truncates, cursor] = row;
    const mustExist = !truncates && !has("app");
    const fails = mustExist && !st.exists;
    outcome.append(
      cellOf("effective mode", key.split("|").map((x) => "ios_base::" + x).join(" | "), `like C's fopen "${cmode}${has("binary") ? "b" : ""}"`),
      cellOf("open succeeds?", fails ? "NO" : "yes", fails ? "the file must already exist for this mode" : st.exists ? "existing file opened" : "a new empty file is created"),
      cellOf("old contents", fails ? "—" : truncates && st.exists ? "DISCARDED (truncated)" : st.exists ? "kept" : "(new file)", meaning),
      cellOf("cursor starts at", fails ? "—" : has("ate") ? "end (ate = at end, once)" : cursor, has("app") ? "app: the position is moved to the end before EACH write" : has("ate") ? "ate: seek to the end on open, but later seeks work normally" : "position 0"),
      cellOf("binary?", has("binary") ? "yes" : "no", has("binary") ? "no newline translation; use for non-text data" : "text mode (Windows turns \\n into \\r\\n on write)"),
    );
    table.innerHTML = `<div class="stat-note">Rules of thumb from the slides: <code>ios_base::in</code> = allow input, <code>out</code> = allow output, <code>app</code> = position at end before each output, <code>binary</code> = binary data, <code>trunc</code> = discard contents on open, <code>ate</code> = position at end on open. <code>ofstream</code> alone is <code>out</code>, which truncates; <code>ifstream</code> alone is <code>in</code>; <code>fstream</code> alone is <code>in | out</code>.</div>`;
  }
  function cellOf(l, v, n) { const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", v)); if (n) c.append(el("div", "stat-note", n)); return c; }
  render();
}

// =====================================================================
// rand-range: rand() % m + offset, and the <random> equivalents
// =====================================================================
function randRange(box, cfg) {
  box.append(el("h4", null, cfg.title || "rand() % m + offset: which range do you get?"));
  const st = { m: Number.isInteger(cfg.m) ? cfg.m : 100, off: Number.isInteger(cfg.offset) ? cfg.offset : 1, seed: 1 };
  const grid = el("div", "stat-grid");
  const code = el("pre", "manip-code");
  const rolls = el("div", "sorted-line");
  const mS = slider("modulus m  (rand() % m)", 1, 200, 1, st.m, (v) => { st.m = v; render(); });
  const oS = slider("offset (added after %)", -50, 3000, 1, st.off, (v) => { st.off = v; render(); });
  const rrPresets = cfg.presets || { "rand() % 100": [100, 0], "rand() % 100 + 1": [100, 1], "rand() % 25 + 2000": [25, 2000] };
  const presetRow = btnRow(Object.keys(rrPresets), (i, l) => { [st.m, st.off] = rrPresets[l]; mS.set(st.m); oS.set(st.off); render(); }, -1);
  const seedRow = btnRow(["srand(1) (the default if you never seed)", "srand(1) again", "srand(time(NULL)) (different each run)"], (i) => { st.seed = i === 2 ? Date.now() % 100000 : 1; roll(); }, 0);
  const rollB = el("button", "reset-btn", "rand() ×12");
  box.append(el("p", "widget-note", "rand() returns a pseudo-random int from 0 to RAND_MAX (32767 on MinGW). Taking % m folds that into 0 … m−1, and adding an offset shifts the whole range. The same seed always replays the same sequence: that is what \"pseudo\" means, and why you seed ONCE with the current time."),
    presetRow, mS.row, oS.row, grid, code, seedRow, rollB, rolls);
  let lcg = 1;
  function seedTo(s) { lcg = s >>> 0 || 1; }
  function next() { lcg = (Math.imul(lcg, 1103515245) + 12345) >>> 0; return (lcg >>> 16) & 0x7fff; } // classic rand()
  function roll() {
    seedTo(st.seed);
    rolls.innerHTML = ""; rolls.append(el("span", "stat-label", `srand(${st.seed === 1 ? "1" : "time(NULL)=" + st.seed}); then rand() % ${st.m} + ${st.off}: `));
    for (let i = 0; i < 12; i++) rolls.append(el("span", "sorted-val", String((next() % st.m) + st.off)));
  }
  rollB.addEventListener("click", roll);
  function render() {
    grid.innerHTML = "";
    const lo = st.off, hi = st.off + st.m - 1;
    for (const [l, v, n] of [["rand() % " + st.m, `0 … ${st.m - 1}`, `${st.m} possible values`], [`rand() % ${st.m} + ${st.off}`, `${lo} … ${hi}`, "shift by the offset"], ["number of values", String(st.m), "always m, whatever the offset"], ["rand() / (double) RAND_MAX", "0.0 … 1.0", "cast ONE operand to get real division"]]) {
      const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", v), el("div", "stat-note", n)); grid.append(c);
    }
    code.textContent = `#include <cstdlib>\n#include <ctime>\nsrand(time(NULL));                     // seed ONCE, with the clock\nint r = rand() % ${st.m} + ${st.off};        // ${lo} … ${hi}\n\n#include <random>                      // the modern way, same range\nrandom_device rd;\nmt19937 generator(rd());\nuniform_int_distribution<> distribution(${lo}, ${hi});\nint my_int = distribution(generator);\n\n// slide examples:  rand() % 100 → 0..99   rand() % 100 + 1 → 1..100   rand() % 25 + 2000 → 2000..2024`;
    roll();
  }
  render();
}

// =====================================================================
// getline-sim: what getline(cin, s) (or cin >> s) leaves in s, one call per playback step.
// Real libstdc++ behaviour: getline's sentry succeeds unless a bit is already set; it then
// erases the string before reading, so a call that meets EOF at once leaves s EMPTY with
// eofbit and failbit set (the slide's table says "no change"). A call made after eofbit was
// already set fails in the sentry and does leave s unchanged. cin >> s at EOF never erases.
// =====================================================================
const GL_OUTCOMES = {
  line: "reads a line, no bits set",
  lineEof: "reads the characters, then hits EOF: eofbit only",
  empty: "s becomes empty, no bits set",
  emptyFail: "s becomes empty, eofbit and failbit set",
  keep: "s keeps its value, failbit set",
  dead: "does nothing: the stream has already failed",
};
function glTrace(raw, calls, delim, mode) {
  let text = raw.replace(/\\n/g, "\n");
  const star = text.indexOf("*");
  if (star >= 0) text = text.slice(0, star);
  const steps = [];
  let p = 0, s = "", fail = false, eof = false;
  for (let i = 0; i < calls; i++) {
    const st = { from: p, to: p, wsEnd: p, before: { fail, eof, s } };
    if (fail) st.kind = "dead";
    else if (mode === 0) {
      if (eof) { fail = true; st.kind = "keep"; }
      else {
        const j = text.indexOf(delim, p);
        if (p >= text.length) { s = ""; fail = eof = true; st.kind = "emptyFail"; }
        else if (j < 0) { s = text.slice(p); p = st.to = text.length; eof = true; st.kind = "lineEof"; }
        else { s = text.slice(p, j); p = st.to = j + 1; st.kind = s === "" ? "empty" : "line"; st.delimAt = j; }
      }
    } else {
      let q = p;
      while (q < text.length && /\s/.test(text[q])) q++;
      st.wsEnd = q;
      if (eof || q >= text.length) { fail = eof = true; p = st.to = q; st.kind = "keep"; }
      else {
        let r = q;
        while (r < text.length && !/\s/.test(text[r])) r++;
        s = text.slice(q, r); p = st.to = r;
        if (r >= text.length) eof = true;
        st.kind = eof ? "lineEof" : "line";
      }
    }
    st.after = { fail, eof, s };
    steps.push(st);
  }
  return { text, steps };
}
function glNote(st, text, mode, delim) {
  const call = mode === 0 ? "getline" : "cin >> input";
  const dn = delim === "\n" ? "newline" : `'${delim}'`;
  const v = JSON.stringify(st.after.s);
  switch (st.kind) {
    case "dead": return `${call} does nothing: failbit is still set from an earlier call, so input keeps ${JSON.stringify(st.before.s)}.`;
    case "keep": return mode === 0
      ? `${call} finds eofbit already set: the call fails before touching the string, so input keeps ${v} and failbit is set.`
      : `${call} skips whitespace and finds the end of the input: failbit and eofbit are set and input keeps ${v}.`;
    case "emptyFail": return `${call} erases input, then meets EOF before a single character: input is empty, eofbit and failbit are set (the slide's table says "no change"; g++ empties the string).`;
    case "lineEof": return mode === 0
      ? `${call} reads ${v} and hits EOF before any ${dn}: the read succeeds and only eofbit is set.`
      : `${call} reads the word ${v} and reaches the end: eofbit is set, the read succeeded.`;
    case "empty": return `${call} meets the ${dn} at once: input is "" (an empty line is a successful read) and the ${dn} is extracted and tossed.`;
    default: return mode === 0
      ? `${call} reads ${v} up to the ${dn}, which is extracted and tossed, not stored.`
      : `${call} ${st.wsEnd > st.from ? "skips the whitespace, " : ""}reads one word, ${v}; the ${text[st.to] === "\n" ? "newline" : "whitespace"} after it stays in the buffer.`;
  }
}
function getlineSim(box, cfg) {
  box.append(el("h4", null, cfg.title || "getline versus cin >>: one call per step"));
  const presets = cfg.presets || { "Hello World": "Hello World", "Hello\\nworld\\n": "Hello\\nworld\\n", "\\nWorld\\n": "\\nWorld\\n", "Hello*": "Hello*", "Hello\\n*": "Hello\\n*", "* (EOF only)": "*", "3 lines of numbers": "12 7\\nabc\\n5\\n" };
  const input = document.createElement("input"); input.className = "q-input wide"; input.value = cfg.input ?? "Hello\\nworld\\n";
  const callsIn = document.createElement("input"); callsIn.type = "number"; callsIn.className = "q-input small"; callsIn.value = cfg.calls ?? 2; callsIn.min = 1; callsIn.max = 6;
  const delimIn = document.createElement("input"); delimIn.className = "q-input small"; delimIn.value = cfg.delim ?? ""; delimIn.maxLength = 1; delimIn.placeholder = "\\n";
  let mode = 0;
  const modeRow = btnRow(["getline(cin, input)", "cin >> input"], (i) => { mode = i; restart(); }, 0);
  const ctl = el("div", "viz-inline");
  ctl.append(el("span", "stat-label", "calls:"), callsIn, el("span", "stat-label", " delimiter (blank = newline):"), delimIn);
  const predictLabel = el("label", "playback-check"), predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = !!cfg.predict;
  predictLabel.append(predictBox, " Predict each call before it runs");
  const svg = svgEl("svg", { viewBox: "0 0 640 128", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption"); caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const loopNote = el("p", "widget-note");
  box.append(el("p", "widget-note", "Write \\n for Enter and * for end-of-file. getline takes everything up to the delimiter (newline by default), stores it, and throws the delimiter away; reaching EOF after some characters sets eofbit only. A call that meets EOF at once empties the string and sets eofbit and failbit (the slide says \"no change\"); a call made after eofbit is already set fails and leaves the string alone."),
    btnRow(Object.keys(presets), (i, l) => { input.value = presets[l]; restart(); }, -1), input, modeRow, ctl, predictLabel, svg, caption, ask);
  let delim = "\n", trace = glTrace(input.value, 2, delim, 0), predict = predictBox.checked, answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null;
  const asking = (pos) => predict && answered < trace.steps.length && Math.abs(pos - answered) < 1e-6;
  function answer(k) {
    if (wrong == null && !missed) asked++;
    if (k !== trace.steps[answered].kind) { missed = true; wrong = k; askKey = null; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; askKey = null; answered++; pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${answered}|${wrong}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !key;
    if (!key) return;
    const keys = mode === 0 ? ["line", "lineEof", "empty", "emptyFail", "keep", "dead"] : ["line", "lineEof", "keep", "dead"];
    for (const k of keys) {
      const b = el("button", "viz-btn" + (k === wrong ? " playback-wrong" : ""), GL_OUTCOMES[k].replace("s keeps", "input keeps").replace("s becomes", "input becomes")); b.type = "button";
      b.addEventListener("click", () => answer(k));
      ask.append(b);
    }
    if (wrong != null) ask.append(el("span", "playback-feedback", "getline stops at the delimiter (tossed) or at EOF (eofbit); reading nothing at all is a failure; a stream with a bit already set does nothing."));
  }
  function frame(pos) {
    pos = Math.max(0, pos); // the first rAF tick can land a hair before 0
    const { text, steps } = trace;
    const done = Math.min(steps.length, Math.floor(pos + 1e-9)), f = pos - done, cur = steps[done];
    let cursor = done > 0 ? steps[done - 1].to : 0;
    if (cur && f > 0) cursor = cur.from + (cur.to - cur.from) * Math.min(1, f * 1.25);
    const shown = cur && f > 0.8 ? cur.after : done > 0 ? steps[done - 1].after : { fail: false, eof: false, s: "" };
    svg.innerHTML = "";
    const N = text.length, cw = Math.min(30, 560 / Math.max(1, N + 1)), x0 = 58;
    svg.append(svgEl("text", { x: 2, y: 25, "font-size": 10.5, fill: "var(--ink-dim)" }, "buffer"));
    const src = cur && f > 0 ? cur : steps[done - 1];
    const hot = src ? [mode === 0 ? src.from : src.wsEnd, src.delimAt != null ? src.delimAt : src.to] : [-1, -1];
    for (let i = 0; i <= N; i++) {
      const x = x0 + i * cw, used = i < Math.floor(cursor + 1e-9), inTok = i >= hot[0] && i < hot[1], tossed = src && i === src.delimAt;
      svg.append(svgEl("rect", { x, y: 8, width: cw - 2, height: 26, rx: 3, fill: inTok ? "var(--hl-soft)" : tossed ? "rgba(255,107,107,0.12)" : used ? "var(--paper)" : "var(--paper-2)", stroke: inTok ? "var(--hl)" : tossed ? "var(--red)" : "var(--rule-strong)" }));
      const ch = i < N ? (text[i] === "\n" ? "⏎" : text[i] === " " ? "␣" : text[i]) : "EOF";
      svg.append(svgEl("text", { x: x + (cw - 2) / 2, y: 26, "text-anchor": "middle", "font-size": i < N ? 13 : 8.5, "font-family": "var(--mono)", fill: used && !inTok ? "var(--ink-dim)" : "var(--ink)" }, ch));
    }
    const cx = x0 + cursor * cw - 1;
    svg.append(svgEl("line", { x1: cx, y1: 4, x2: cx, y2: 40, stroke: "var(--hl)", "stroke-width": 2.5 }));
    [["eofbit", shown.eof], ["failbit", shown.fail]].forEach(([l, on], i) => {
      svg.append(svgEl("circle", { cx: 62 + i * 180, cy: 70, r: 8, fill: on ? "var(--red)" : "var(--paper-2)", stroke: on ? "var(--red)" : "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: 76 + i * 180, y: 74, "font-size": 12, fill: on ? "var(--red)" : "var(--ink-dim)" }, `${l} ${on ? "set" : "clear"}`));
    });
    svg.append(svgEl("text", { x: 430, y: 74, "font-size": 12, fill: shown.fail ? "var(--red)" : "var(--green)" }, `cin is ${shown.fail ? "false" : "true"}`));
    svg.append(svgEl("rect", { x: 40, y: 92, width: 420, height: 28, rx: 4, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    const sv = done === 0 && !(cur && f > 0.8) ? "(starts empty)" : shown.s === "" ? "EMPTY" : JSON.stringify(shown.s);
    svg.append(svgEl("text", { x: 50, y: 110, "font-size": 12.5, "font-family": "var(--mono)", fill: "var(--ink)" }, `string input = ${sv}`));
    let t;
    if (asking(pos)) t = `Call ${answered + 1}: ${mode === 0 ? `getline(cin, input${delim === "\n" ? "" : `, '${delim}'`})` : "cin >> input"}. What happens?`;
    else if (done === 0 && f === 0) t = `${steps.length} call${steps.length > 1 ? "s" : ""} on this input; the cursor is before the first character.`;
    else {
      t = `Call ${(cur && f > 0 ? done : done - 1) + 1}: ${glNote(src, text, mode, delim)}`;
      if (done >= steps.length && asked > 0) t += ` ${firstTry} of ${asked} right on the first try.`;
    }
    if (caption.textContent !== t) caption.textContent = t;
    renderAsk(pos);
  }
  const pb = createPlayback({
    count: 2, unit: "call", onFrame: (p) => frame(p), stepMs: () => cfg.stepMs || 1600,
    limit: () => (predict ? answered : trace.steps.length),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, loopNote);
  function restart() {
    delim = delimIn.value ? delimIn.value[0] : "\n";
    const calls = Math.max(1, Math.min(6, parseInt(callsIn.value, 10) || 1));
    trace = glTrace(input.value, calls, delim, mode);
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    let loops = 0;
    for (const st of glTrace(input.value, 50, delim, 0).steps) { if (st.after.fail) break; loops++; }
    loopNote.textContent = `while (getline(cin, line)) { /* process */ } would run its body ${loops} time${loops === 1 ? "" : "s"} on this input, then the failed call ends the loop.`;
    pb.reset(trace.steps.length);
  }
  input.addEventListener("input", restart); callsIn.addEventListener("input", restart); delimIn.addEventListener("input", restart);
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  restart();
}

// =====================================================================
// vector-viz: push_back, [], at, erase, clear, size, capacity growth
// =====================================================================
function vectorViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "std::vector<int>: watch size, capacity and the elements"));
  const st = { v: (cfg.values || []).slice(), cap: 0, log: [] };
  st.cap = st.v.length ? 1 << Math.ceil(Math.log2(st.v.length)) : 0;
  const cells = el("div", "vec-cells");
  const grid = el("div", "stat-grid");
  const ctl = el("div", "viz-inline");
  const valIn = document.createElement("input"); valIn.className = "q-input small"; valIn.value = "5"; valIn.type = "number";
  const idxIn = document.createElement("input"); idxIn.className = "q-input small"; idxIn.value = "1"; idxIn.type = "number"; idxIn.min = 0;
  const pushB = el("button", "viz-btn", "push_back(value)"), atB = el("button", "viz-btn", "at(i)"), brB = el("button", "viz-btn", "[i]"), eraseB = el("button", "viz-btn", "erase(begin()+i)"), clearB = el("button", "viz-btn", "clear()"), popB = el("button", "viz-btn", "pop_back()"), forB = el("button", "viz-btn", "for (int value : intVector)");
  ctl.append(el("span", "stat-label", "value"), valIn, pushB, el("span", "stat-label", " i"), idxIn, atB, brB, eraseB, popB, clearB, forB);
  const log = el("pre", "manip-code fs-log");
  const resetB = el("button", "reset-btn", "vector<int> intVector;  (start over)");
  box.append(el("p", "widget-note", "A vector is a sequence container that grows as you push_back (think Java's ArrayList). size() is how many elements you have; capacity is how many fit before it must reallocate (g++ doubles it). at(i) checks the bounds and throws out_of_range; [i] does not check, so a bad index is undefined behaviour."), ctl, cells, grid, log, resetB);
  function say(s) { st.log.push(s); if (st.log.length > 14) st.log.shift(); render(); }
  pushB.addEventListener("click", () => { const v = parseInt(valIn.value, 10) || 0; let note = ""; if (st.v.length === st.cap) { st.cap = st.cap ? st.cap * 2 : 1; note = `  // full: reallocates, capacity → ${st.cap}, old elements copied over`; } st.v.push(v); say(`intVector.push_back(${v});${note}`); });
  atB.addEventListener("click", () => { const i = parseInt(idxIn.value, 10); if (i < 0 || i >= st.v.length) say(`intVector.at(${i});   // THROWS std::out_of_range (size is ${st.v.length}): program terminates unless caught`); else say(`intVector.at(${i});   // returns a reference to element ${i} → ${st.v[i]}`); });
  brB.addEventListener("click", () => { const i = parseInt(idxIn.value, 10); if (i < 0 || i >= st.v.length) say(`intVector[${i}];      // NO bounds check: index ${i} of ${st.v.length} is UNDEFINED BEHAVIOUR (garbage or crash)`); else say(`intVector[${i}];      // returns a reference to element ${i} → ${st.v[i]}`); });
  eraseB.addEventListener("click", () => { const i = parseInt(idxIn.value, 10); if (i < 0 || i >= st.v.length) return say(`intVector.erase(intVector.begin()+${i});  // iterator past the end: undefined behaviour`); const [gone] = st.v.splice(i, 1); say(`intVector.erase(intVector.begin()+${i});  // erases ${gone} at index ${i}; later elements shift left; size → ${st.v.length}`); });
  popB.addEventListener("click", () => { if (!st.v.length) return say(`intVector.pop_back();   // on an empty vector: undefined behaviour`); const g = st.v.pop(); say(`intVector.pop_back();   // removes the last element (${g}); size → ${st.v.length}`); });
  clearB.addEventListener("click", () => { st.v = []; say(`intVector.clear();      // removes all elements: size 0, capacity stays ${st.cap}`); });
  forB.addEventListener("click", () => say(`for (int value : intVector) cout << value << " ";   // prints: ${st.v.join(" ") || "(nothing)"}`));
  resetB.addEventListener("click", () => { st.v = []; st.cap = 0; st.log = []; render(); });
  function render() {
    cells.innerHTML = "";
    for (let i = 0; i < st.cap; i++) {
      const c = el("div", "vec-cell" + (i < st.v.length ? "" : " spare"));
      c.append(el("div", "vec-idx", String(i)), el("div", "vec-val", i < st.v.length ? String(st.v[i]) : "·"));
      cells.append(c);
    }
    if (!st.cap) cells.append(el("div", "pv-empty", "empty vector, no storage yet"));
    grid.innerHTML = "";
    for (const [l, v, n] of [["size()", String(st.v.length), "number of elements"], ["capacity()", String(st.cap), "slots allocated before the next reallocation"], ["classic loop", `for (int i = 0; i < intVector.size(); i++)`, "index from 0 to size()−1"], ["ranged-for", `for (int value : intVector)`, "the for-each loop, C++ style"]]) {
      const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", v), el("div", "stat-note", n)); grid.append(c);
    }
    log.textContent = st.log.length ? st.log.join("\n") : "vector<int> intVector;   // click the buttons";
  }
  render();
}

// =====================================================================
// Shared helpers for the Week 2-3 playback widgets.
// =====================================================================
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const seg = (f, a, b) => ease((f - a) / (b - a));
// Predict-mode bookkeeping shared by the -play widgets below: `answered` steps may play; the next
// waits for a pick from `options(i)`; `correct(i)` is the right key; a wrong pick shows `rule`.
function predictKit(box, label, checked, rule, options, correct, onRefresh) {
  const st = { on: !!checked, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: null, key: null, pb: null };
  const lab = el("label", "playback-check"), cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = st.on; lab.append(cb, " " + label);
  const ask = el("div", "viz-btn-row playback-ask");
  st.label = lab; st.ask = ask;
  st.asking = (pos, n) => st.on && st.answered < n && Math.abs(pos - st.answered) < 1e-6;
  st.reset = () => { st.answered = 0; st.asked = 0; st.firstTry = 0; st.missed = false; st.wrong = null; st.key = null; };
  st.tally = () => (st.asked > 0 ? ` ${st.firstTry} of ${st.asked} right on the first try.` : "");
  st.render = (pos, n) => {
    const k = st.asking(pos, n) ? `${st.answered}|${st.wrong}` : "";
    if (k === st.key) return;
    st.key = k; ask.innerHTML = ""; ask.hidden = !k;
    if (!k) return;
    for (const [v, text] of options(st.answered)) {
      const b = el("button", "viz-btn" + (v === st.wrong ? " playback-wrong" : ""), text); b.type = "button";
      b.addEventListener("click", () => {
        if (st.wrong == null && !st.missed) st.asked++;
        if (v !== correct(st.answered)) { st.missed = true; st.wrong = v; st.key = null; onRefresh(); return; }
        if (!st.missed) st.firstTry++;
        st.missed = false; st.wrong = null; st.key = null; st.answered++; st.pb.next();
      });
      ask.append(b);
    }
    if (st.wrong != null) ask.append(el("span", "playback-feedback", typeof rule === "function" ? rule(st.answered) : rule));
  };
  st.blocked = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  cb.addEventListener("change", () => {
    st.on = cb.checked; st.pb.pause();
    const a = Math.ceil(st.pb.pos() - 1e-9); st.reset(); st.answered = a;
    st.pb.set(st.pb.pos());
  });
  return st;
}

// =====================================================================
// seek-play: seekDemo.cpp on helloWorld.txt, one seek / tell / write per step
// =====================================================================
const SEEK_DEFAULT = [
  { code: `ofstream myFile("helloWorld.txt", ios::app);`, op: "open-app" },
  { code: "myFile.seekp(6);", op: "seek", off: 6, dir: null },
  { code: "myFile.seekp(4, ios::beg);", op: "seek", off: 4, dir: "beg" },
  { code: "myFile.seekp(-4, ios::end);", op: "seek", off: -4, dir: "end" },
  { code: "myFile.seekp(-6, ios::cur);", op: "seek", off: -6, dir: "cur" },
  { code: `myFile << "!";`, op: "write", text: "!" },
];
function seekTrace(content, ops) {
  let text = content, pos = 0, app = false;
  return ops.map((o) => {
    const before = { text, pos };
    let note;
    if (o.op === "open-app") { app = true; pos = text.length; note = `Append mode keeps the ${text.length} characters and puts the cursor at the end, position ${pos}, as the slide says (MinGW's tellp() reports 0 until the first write; writes still go to the end).`; }
    else if (o.op === "open") { app = false; pos = 0; note = `An fstream keeps the contents and starts the cursor at 0.`; }
    else if (o.op === "seek") {
      const base = o.dir === "cur" ? pos : o.dir === "end" ? text.length : 0;
      const target = base + o.off;
      if (target < 0 || target > text.length) note = `Position ${target} is outside the file (0 to ${text.length}): the seek fails, failbit is set and the cursor stays at ${pos}.`;
      else {
        note = o.dir == null ? `The one-argument form is absolute: position ${target}, before '${text[target] ?? "end"}'.`
          : o.dir === "beg" ? `${o.off} from the beginning (0): 0 + ${o.off} = ${target}, before '${text[target] ?? "end"}'.`
          : o.dir === "end" ? `${o.off} from the end (${text.length}): ${text.length} − ${-o.off} = ${target}, before '${text[target] ?? "end"}'.`
          : `${o.off} from the current position, which the previous line left at ${pos}: ${pos} ${o.off < 0 ? "−" : "+"} ${Math.abs(o.off)} = ${target}, before '${text[target] ?? "end"}'.`;
        pos = target;
      }
    } else if (o.op === "write") {
      const at = app ? text.length : pos;
      text = text.slice(0, at) + o.text + text.slice(at + o.text.length);
      note = app ? `ios::app moves the cursor to the end before every write: the cursor said ${pos}, but "${o.text}" lands at position ${at}. The file is now ${text}.` : `"${o.text}" overwrites position ${at}.`;
      pos = at + o.text.length;
      return { o, before, after: { text, pos }, note, landed: at };
    }
    return { o, before, after: { text, pos }, note };
  });
}
function seekPlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "seekDemo.cpp: the cursor in helloWorld.txt, one call per step"));
  const content = typeof cfg.content === "string" ? cfg.content : "Hello World";
  const ops = Array.isArray(cfg.ops) && cfg.ops.length ? cfg.ops : SEEK_DEFAULT;
  const steps = seekTrace(content, ops);
  const answerOf = (i) => (steps[i].landed != null ? steps[i].landed : steps[i].after.pos);
  const opts = (i) => {
    const s = steps[i], right = answerOf(i), n = s.before.text.length, off = s.o.off || 0, p = s.before.pos;
    // Distractors: the same offset measured from the other two directions, the old position, off by one.
    const others = [...new Set([off, n + off, p + off, p, n, right + 1, right - 1])].filter((v) => v !== right && v >= 0 && v <= n + 1);
    return [right, ...others.slice(0, 3)].sort((a, b) => a - b).map((v) => [v, s.o.op === "write" ? `lands at ${v}` : `cursor at ${v}`]);
  };
  const kit = predictKit(box, "Predict the cursor position after each call", cfg.predict, "ios::beg counts from 0, ios::end from the file size, ios::cur from wherever the last call left the cursor; in ios::app mode every write goes to the end.", opts, answerOf, () => frame(pb.pos()));
  const svg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg" });
  const code = el("pre", "manip-code");
  const caption = el("p", "playback-caption"); caption.setAttribute("aria-live", "polite");
  box.append(kit.label, code, svg, caption, kit.ask);
  function frame(pos) {
    pos = Math.max(0, pos); // the first rAF tick can land a hair before 0
    const done = Math.min(steps.length, Math.floor(pos + 1e-9)), f = pos - done, cur = steps[done];
    const prev = done > 0 ? steps[done - 1].after : { text: content, pos: 0 };
    const live = cur && f > 0;
    const text = live && f > 0.6 ? cur.after.text : prev.text;
    let cpos = prev.pos;
    if (live) {
      const to = cur.landed != null ? cur.landed : cur.after.pos;
      cpos = prev.pos + (to - prev.pos) * seg(f, 0, 0.6);
      if (cur.landed != null && f > 0.6) cpos = cur.landed + (cur.after.pos - cur.landed) * seg(f, 0.6, 1);
    }
    const opened = done > 0 || live;
    svg.innerHTML = "";
    const N = Math.max(text.length, content.length + 1), cw = Math.min(40, 580 / (N + 1)), x0 = 30;
    for (let i = 0; i <= text.length; i++) {
      const x = x0 + i * cw, fresh = i < text.length && i >= content.length;
      svg.append(svgEl("rect", { x, y: 30, width: cw - 3, height: 34, rx: 4, fill: i === text.length ? "var(--paper)" : fresh ? "var(--green-soft)" : "var(--paper-2)", stroke: "var(--rule-strong)", "stroke-dasharray": i === text.length ? "3 3" : "" }));
      svg.append(svgEl("text", { x: x + (cw - 3) / 2, y: 53, "text-anchor": "middle", "font-size": i < text.length ? 15 : 9, "font-family": "var(--mono)", fill: "var(--ink)" }, i < text.length ? (text[i] === " " ? "␣" : text[i]) : "end"));
      svg.append(svgEl("text", { x: x + (cw - 3) / 2, y: 80, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, String(i)));
    }
    if (opened) {
      const cx = x0 + cpos * cw - 1.5;
      svg.append(svgEl("line", { x1: cx, y1: 22, x2: cx, y2: 70, stroke: "var(--hl)", "stroke-width": 3 }));
      svg.append(svgEl("polygon", { points: `${cx - 6},14 ${cx + 6},14 ${cx},22`, fill: "var(--hl)" }));
      svg.append(svgEl("text", { x: cx, y: 100, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)" }, `tellp() = ${Math.round(cpos)}`));
    }
    svg.append(svgEl("text", { x: 30, y: 136, "font-size": 11.5, fill: "var(--ink-dim)" }, `file size ${text.length} · ios::beg = 0 · ios::end = ${text.length}`));
    code.textContent = steps.map((s, i) => `${i < done || (live && i === done) ? (i === done && live ? "▶ " : "  ") : "  "}${s.o.code}${i < done ? `   // ${s.landed != null ? `written at ${s.landed}` : `cursor ${s.after.pos}`}` : ""}`).join("\n");
    let t;
    if (kit.asking(pos, steps.length)) t = `Next: ${steps[kit.answered].o.code} ${steps[kit.answered].o.op === "write" ? "Where does the character land?" : "Where is the cursor afterwards?"}`;
    else if (!opened) t = `helloWorld.txt holds ${content} (${content.length} characters, positions 0 to ${content.length - 1}); position ${content.length} is the end.`;
    else {
      const s = live ? cur : steps[done - 1];
      t = `${s.o.code} ${s.note}`;
      if (done >= steps.length) t += kit.tally();
    }
    if (caption.textContent !== t) caption.textContent = t;
    kit.render(pos, steps.length);
  }
  const pb = createPlayback({ count: steps.length, unit: "call", onFrame: frame, stepMs: () => cfg.stepMs || 1700, limit: () => (kit.on ? kit.answered : steps.length), onBlocked: kit.blocked });
  kit.pb = pb;
  box.append(pb.el);
}

// =====================================================================
// vector-grow-play: push_back one value per step; a full vector reallocates (capacity doubles),
// copies every element across and frees the old block. Ends with clear() by default.
// =====================================================================
function vectorGrowPlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "push_back on a full vector: allocate double, copy, free"));
  const values = Array.isArray(cfg.values) && cfg.values.length ? cfg.values.slice(0, 9) : [5, 10, 15, 20, 25];
  const withClear = cfg.clear !== false;
  const steps = [];
  let size = 0, cap = 0;
  for (const v of values) {
    const grow = size === cap, newCap = grow ? (cap ? cap * 2 : 1) : cap;
    steps.push({ op: "push", v, sizeBefore: size, capBefore: cap, grow, size: size + 1, cap: newCap });
    size++; cap = newCap;
  }
  if (withClear) steps.push({ op: "clear", sizeBefore: size, capBefore: cap, grow: false, size: 0, cap });
  const opts = (i) => {
    const s = steps[i], c = new Set([s.capBefore, s.capBefore + 1, s.capBefore ? s.capBefore * 2 : 1, s.op === "clear" ? 0 : s.size]);
    return [...c].sort((a, b) => a - b).map((v) => [v, `capacity ${v}`]);
  };
  const kit = predictKit(box, "Predict the capacity after each call", cfg.predict, "A push that finds size equal to capacity allocates a block twice as big (1 for an empty vector); otherwise capacity stays. clear() removes the elements and keeps the storage.", opts, (i) => steps[i].cap, () => frame(pb.pos()));
  const svg = svgEl("svg", { viewBox: "0 0 640 190", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption"); caption.setAttribute("aria-live", "polite");
  box.append(kit.label, svg, caption, kit.ask);
  const W = 44;
  function block(x, y, cap, vals, opts = {}) {
    for (let i = 0; i < cap; i++) {
      const has = i < vals.length && vals[i] != null;
      svg.append(svgEl("rect", { x: x + i * W, y, width: W - 4, height: 34, rx: 4, fill: opts.fade ? "rgba(255,107,107,0.10)" : has ? "var(--paper-2)" : "var(--paper)", stroke: opts.fade ? "var(--red)" : "var(--rule-strong)", "stroke-dasharray": has ? "" : "3 3", opacity: opts.opacity ?? 1 }));
      if (has) svg.append(svgEl("text", { x: x + i * W + (W - 4) / 2, y: y + 22, "text-anchor": "middle", "font-size": 13, "font-family": "var(--mono)", fill: i === opts.hot ? "var(--hl)" : "var(--ink)", opacity: opts.opacity ?? 1 }, String(vals[i])));
      svg.append(svgEl("text", { x: x + i * W + (W - 4) / 2, y: y + 46, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-dim)", opacity: opts.opacity ?? 1 }, String(i)));
    }
  }
  function frame(pos) {
    pos = Math.max(0, pos); // the first rAF tick can land a hair before 0
    const done = Math.min(steps.length, Math.floor(pos + 1e-9)), f = pos - done, cur = steps[done], live = cur && f > 0;
    const before = done > 0 ? steps[done - 1] : { size: 0, cap: 0 };
    const elems = values.slice(0, before.size);
    if (done > 0 && steps[done - 1].op === "clear") elems.length = 0;
    svg.innerHTML = "";
    svg.append(svgEl("text", { x: 10, y: 18, "font-size": 11, fill: "var(--ink-dim)" }, "heap"));
    let size = before.size, cap = before.cap, phase = "";
    if (!live) block(20, 30, cap, elems);
    else if (cur.op === "clear") {
      block(20, 30, cap, f > 0.5 ? [] : elems, { opacity: 1 });
      size = f > 0.5 ? 0 : size; phase = "clear";
    } else if (!cur.grow) {
      const vals = elems.slice(); if (f > 0.5) vals.push(cur.v);
      block(20, 30, cap, vals, { hot: f > 0.5 ? cur.size - 1 : -1 });
      if (f <= 0.5) svg.append(svgEl("text", { x: 20 + cur.sizeBefore * W + (W - 4) / 2, y: 30 + 22 - 20 * (1 - f * 2), "text-anchor": "middle", "font-size": 13, "font-family": "var(--mono)", fill: "var(--hl)", opacity: f * 2 }, String(cur.v)));
      if (f > 0.5) size = cur.size;
      phase = "fit";
    } else {
      // 0-0.3 allocate the new block, 0.3-0.7 copy element by element, 0.7-0.85 free the old block, 0.85-1 write the new value.
      const copied = f < 0.3 ? 0 : Math.min(cur.sizeBefore, Math.floor(((f - 0.3) / 0.4) * cur.sizeBefore + 1e-9) + (f >= 0.7 ? 0 : 0));
      const oldAlive = f < 0.85;
      if (oldAlive && cur.capBefore > 0) block(20, 30, cur.capBefore, elems, { fade: f >= 0.7, opacity: f >= 0.7 ? 1 - seg(f, 0.7, 0.85) * 0.8 : 1 });
      const nv = values.slice(0, f >= 0.7 ? cur.sizeBefore : copied);
      if (f >= 0.85) nv.push(cur.v);
      svg.append(svgEl("g", { opacity: seg(f, 0, 0.15) }));
      block(20, 110, cur.cap, nv, { opacity: Math.max(0.2, seg(f, 0, 0.15)), hot: f >= 0.85 ? cur.sizeBefore : copied - 1 });
      svg.append(svgEl("text", { x: 10, y: 104, "font-size": 11, fill: "var(--hl)", opacity: seg(f, 0, 0.15) }, `new block, capacity ${cur.cap}`));
      if (f >= 0.85) { size = cur.size; cap = cur.cap; }
      phase = f < 0.3 ? "allocate" : f < 0.7 ? "copy" : f < 0.85 ? "free" : "write";
      if (f < 0.85) cap = cur.capBefore;
      if (f >= 0.7) cap = cur.cap;
    }
    if (done > 0 && !live) { size = steps[done - 1].size; cap = steps[done - 1].cap; }
    svg.append(svgEl("text", { x: 420, y: 178, "font-size": 13, fill: "var(--ink)" }, `size() ${size}   capacity() ${cap}`));
    let t;
    if (kit.asking(pos, steps.length)) {
      const s = steps[kit.answered];
      t = s.op === "clear" ? `Next: v.clear() on size ${s.sizeBefore}, capacity ${s.capBefore}. Capacity afterwards?` : `Next: push_back(${s.v}) with size ${s.sizeBefore} and capacity ${s.capBefore}. Capacity afterwards?`;
    } else if (done === 0 && !live) t = `vector<int> v; starts empty: size 0, capacity 0, no storage yet.`;
    else {
      const s = live ? cur : steps[done - 1], k = (live ? done : done - 1) + 1;
      if (s.op === "clear") t = `clear(): size ${s.sizeBefore} → 0, capacity stays ${s.cap}. The elements are gone, the storage is kept.`;
      else if (s.grow && s.capBefore === 0) t = `push ${k}: size 0 = capacity 0, allocate 1, write ${s.v}. Now size 1, capacity 1.`;
      else if (s.grow) t = `push ${k}: size ${s.sizeBefore} = capacity ${s.capBefore}, allocate ${s.cap}, copy ${s.sizeBefore}, free ${s.capBefore}, write ${s.v}. Now size ${s.size}, capacity ${s.cap}.`;
      else t = `push ${k}: size ${s.sizeBefore} < capacity ${s.capBefore}, so ${s.v} goes into the spare slot ${s.sizeBefore}. Now size ${s.size}, capacity ${s.cap}.`;
      if (live && phase && s.grow && s.capBefore > 0) t = `${t} (${phase})`;
      if (done >= steps.length) t += kit.tally();
    }
    if (caption.textContent !== t) caption.textContent = t;
    kit.render(pos, steps.length);
  }
  const pb = createPlayback({ count: steps.length, unit: "call", onFrame: frame, stepMs: () => cfg.stepMs || 2200, limit: () => (kit.on ? kit.answered : steps.length), onBlocked: kit.blocked });
  kit.pb = pb;
  box.append(pb.el);
}

// =====================================================================
// sequence-play: a UML sequence diagram drawn one message at a time (call, return, self,
// create), activations opening and closing; a toggle redraws the same messages as a
// collaboration diagram numbered 1, 1.1, 1.2 ...
// =====================================================================
const SEQ_DEFAULT = {
  participants: [
    { id: "c", name: "Customer", actor: true },
    { id: "o", name: ":Order" },
    { id: "i", name: ":OrderItem" },
    { id: "p", name: ":Payment", created: true },
  ],
  messages: [
    { from: "c", to: "o", kind: "call", label: "checkout()" },
    { from: "o", to: "i", kind: "call", label: "getTotal()" },
    { from: "i", to: "o", kind: "return", label: "total" },
    { from: "o", to: "o", kind: "self", label: "applyDiscount()" },
    { from: "o", to: "p", kind: "create", label: "Payment(total)" },
    { from: "o", to: "p", kind: "call", label: "charge()" },
    { from: "p", to: "o", kind: "return", label: "true" },
    { from: "o", to: "c", kind: "return", label: "receipt" },
  ],
};
// Collaboration numbering: a call, self or create sent while the sender is busy with message n
// gets n.1, n.2, ...; returns are not numbered.
function seqNumber(msgs) {
  const stack = [], counters = [0], nums = [];
  for (const m of msgs) {
    if (m.kind === "return") { nums.push(null); stack.pop(); counters.pop(); continue; }
    counters[counters.length - 1]++;
    const n = counters.join(".");
    nums.push(n);
    if (m.kind === "call") { stack.push(m); counters.push(0); }
  }
  return nums;
}
function sequencePlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "A sequence diagram, one message at a time"));
  const parts = Array.isArray(cfg.participants) && cfg.participants.length ? cfg.participants : SEQ_DEFAULT.participants;
  const msgs = Array.isArray(cfg.messages) && cfg.messages.length ? cfg.messages : SEQ_DEFAULT.messages;
  const nums = seqNumber(msgs);
  const idx = Object.fromEntries(parts.map((p, i) => [p.id, i]));
  const nameOf = (id) => parts[idx[id]].name;
  let view = cfg.view === "collaboration" ? 1 : 0;
  const views = btnRow(["sequence diagram (time)", "collaboration diagram (structure)"], (i) => { view = i; frame(pb.pos()); }, view);
  const optKey = (m) => `${m.kind}|${m.to}`;
  const opts = (i) => {
    const m = msgs[i], set = new Map();
    const add = (kind, to) => { const k = `${kind}|${to}`; if (!set.has(k)) set.set(k, kind === "self" ? `self message on ${nameOf(to)}` : `${kind} → ${nameOf(to)}`); };
    add(m.kind, m.to);
    if (m.kind === "return") add("call", m.to); else add("return", m.from === m.to ? parts[(idx[m.from] + parts.length - 1) % parts.length].id : m.to);
    const other = parts.find((p) => p.id !== m.to && p.id !== m.from);
    if (other) add(m.kind === "self" ? "call" : m.kind, other.id);
    add("self", m.from);
    return [...set.entries()].slice(0, 4).sort((a, b) => a[1].localeCompare(b[1]));
  };
  const kit = predictKit(box, "Predict each message before it is drawn", cfg.predict, (i) => `Read the code being modelled: a method that calls another object sends a call; its return statement sends a return back to the caller; calling its own method is a self message; constructing an object is a create message.`, opts, (i) => optKey(msgs[i]), () => frame(pb.pos()));
  const svg = svgEl("svg", { viewBox: "0 0 640 330", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption"); caption.setAttribute("aria-live", "polite");
  box.append(views, kit.label, svg, caption, kit.ask);
  const colX = (i) => 70 + i * (500 / Math.max(1, parts.length - 1));
  const TOP = 56, ROW = 30;
  // Activation intervals per participant, in message rows; computed once.
  const acts = [];
  {
    const open = [];
    msgs.forEach((m, r) => {
      if (m.kind === "call") { open.push({ p: m.to, start: r }); }
      else if (m.kind === "return") { const a = open.pop(); if (a) acts.push({ ...a, end: r }); }
      else if (m.kind === "self") acts.push({ p: m.to, start: r, end: r + 0.7, self: true });
    });
    // The first sender (the actor) is busy for the whole interaction; unclosed calls run to the end.
    open.forEach((a) => acts.push({ ...a, end: msgs.length }));
  }
  const yOf = (r) => TOP + 34 + r * ROW;
  function head(x, y, p, alpha) {
    if (p.actor) {
      svg.append(svgEl("circle", { cx: x, cy: y - 26, r: 7, fill: "none", stroke: "var(--ink)", opacity: alpha }));
      svg.append(svgEl("path", { d: `M${x},${y - 19} v14 M${x - 9},${y - 13} h18 M${x},${y - 5} l-7,10 M${x},${y - 5} l7,10`, stroke: "var(--ink)", fill: "none", opacity: alpha }));
      svg.append(svgEl("text", { x, y: y + 18, "text-anchor": "middle", "font-size": 11.5, fill: "var(--ink)", opacity: alpha }, p.name));
      return;
    }
    svg.append(svgEl("rect", { x: x - 52, y: y - 16, width: 104, height: 28, rx: 3, fill: "var(--paper-2)", stroke: "var(--rule-strong)", opacity: alpha }));
    svg.append(svgEl("text", { x, y: y + 3, "text-anchor": "middle", "font-size": 12, "text-decoration": "underline", fill: "var(--ink)", opacity: alpha }, p.name));
  }
  function arrowHead(x, y, dir, filled, color) {
    const d = dir > 0 ? -1 : 1;
    if (filled) svg.append(svgEl("polygon", { points: `${x},${y} ${x + d * 9},${y - 4.5} ${x + d * 9},${y + 4.5}`, fill: color }));
    else svg.append(svgEl("path", { d: `M${x + d * 9},${y - 4.5} L${x},${y} L${x + d * 9},${y + 4.5}`, stroke: color, fill: "none", "stroke-width": 1.4 }));
  }
  function drawSequence(done, f) {
    const shown = done + (f > 0 ? f : 0);
    // Lifelines and heads. A created participant's head appears at its create message.
    parts.forEach((p, i) => {
      const x = colX(i), cr = msgs.findIndex((m) => m.kind === "create" && m.to === p.id);
      const created = cr >= 0;
      const y = created ? yOf(cr) : TOP;
      const alpha = !created ? 1 : shown >= cr + 0.6 ? 1 : shown > cr ? (shown - cr) / 0.6 : 0.15;
      head(x, y, p, alpha);
      svg.append(svgEl("line", { x1: x, y1: y + (p.actor ? 24 : 12), x2: x, y2: yOf(msgs.length) + 6, stroke: "var(--rule-strong)", "stroke-dasharray": "4 4", opacity: created && shown <= cr ? 0.25 : 1 }));
    });
    // Activations up to the current time.
    for (const a of acts) {
      if (a.start >= shown) continue;
      const end = Math.min(a.end, shown), x = colX(idx[a.p]) + (a.self ? 6 : 0);
      svg.append(svgEl("rect", { x: x - 5, y: yOf(a.start), width: 10, height: Math.max(4, (end - a.start) * ROW), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    }
    msgs.forEach((m, r) => {
      if (r > done || (r === done && f <= 0)) return;
      const prog = r < done ? 1 : ease(f), y = yOf(r), x1 = colX(idx[m.from]) + (m.kind === "return" ? -5 : 5) * (idx[m.to] > idx[m.from] ? -1 : 1) * -1, hot = r === done || (r === done - 1 && f <= 0);
      const color = hot ? "var(--hl)" : "var(--ink-dim)";
      if (m.kind === "self") {
        const x = colX(idx[m.from]) + 5, w = 34 * prog;
        svg.append(svgEl("path", { d: `M${x},${y} h${w} v${prog > 0.5 ? 14 : 0} h${prog > 0.5 ? -w + 6 : 0}`, stroke: color, fill: "none", "stroke-width": 1.6 }));
        if (prog >= 1) arrowHead(x + 6, y + 14, -1, true, color);
        svg.append(svgEl("text", { x: x + 40, y: y + 4, "font-size": 11, fill: color }, m.label));
        return;
      }
      const xa = colX(idx[m.from]), xb = colX(idx[m.to]), dir = xb > xa ? 1 : -1;
      const sx = xa + dir * 5, ex = xb - dir * (m.kind === "create" ? 52 : 5), cx = sx + (ex - sx) * prog;
      svg.append(svgEl("line", { x1: sx, y1: y, x2: cx, y2: y, stroke: color, "stroke-width": 1.6, "stroke-dasharray": m.kind === "return" || m.kind === "create" ? "5 4" : "" }));
      if (prog >= 1) arrowHead(ex, y, dir, m.kind === "call", color);
      svg.append(svgEl("text", { x: (sx + ex) / 2, y: y - 5, "text-anchor": "middle", "font-size": 11, fill: color, opacity: prog }, m.kind === "create" ? `«create» ${m.label}` : m.label));
      void x1;
    });
  }
  function drawCollaboration(done, f) {
    // Layout: the first participant on the left, the second in the middle, the rest down the right.
    const rest = Math.max(1, parts.length - 2);
    const cxs = parts.map((p, i) => (i === 0 ? [80, 170] : i === 1 ? [300, 170] : [540, rest === 1 ? 170 : 70 + ((i - 2) * 200) / (rest - 1)]));
    const links = new Map();
    msgs.forEach((m, r) => { if (m.from !== m.to) { const k = [m.from, m.to].sort().join("-"); if (!links.has(k)) links.set(k, []); links.get(k).push(r); } });
    for (const [k] of links) {
      const [a, b] = k.split("-"), [x1, y1] = cxs[idx[a]], [x2, y2] = cxs[idx[b]];
      svg.append(svgEl("line", { x1, y1, x2, y2, stroke: "var(--rule-strong)", "stroke-width": 1.4 }));
    }
    parts.forEach((p, i) => head(cxs[i][0], cxs[i][1] + (p.actor ? 10 : 0), p, 1));
    // Numbered message labels beside each link, in order; returns are not numbered and not drawn.
    const perLink = new Map();
    msgs.forEach((m, r) => {
      if (m.kind === "return" || r > done || (r === done && f <= 0)) return;
      const hot = r === done || (r === done - 1 && f <= 0), color = hot ? "var(--hl)" : "var(--ink-2)";
      if (m.from === m.to) {
        const [x, y] = cxs[idx[m.from]];
        svg.append(svgEl("path", { d: `M${x - 20},${y - 16} q20,-26 40,0`, stroke: color, fill: "none", "stroke-width": 1.4 }));
        svg.append(svgEl("text", { x, y: y - 34, "text-anchor": "middle", "font-size": 11, fill: color }, `${nums[r]}: ${m.label}`));
        return;
      }
      const k = [m.from, m.to].sort().join("-"), j = perLink.get(k) || 0; perLink.set(k, j + 1);
      const [x1, y1] = cxs[idx[m.from]], [x2, y2] = cxs[idx[m.to]], mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy, ny = ux;
      // A short arrow beside the link's midpoint, then the label; later messages on the same link stack downward.
      const side = ny < 0 ? -1 : 1, ox = mx + nx * 12 * side, oy = my + ny * 12 * side + j * 16;
      svg.append(svgEl("line", { x1: ox - ux * 12, y1: oy - uy * 12, x2: ox + ux * 12, y2: oy + uy * 12, stroke: color, "stroke-width": 1.6 }));
      svg.append(svgEl("polygon", { points: `${ox + ux * 12},${oy + uy * 12} ${ox + ux * 4 - nx * 4},${oy + uy * 4 - ny * 4} ${ox + ux * 4 + nx * 4},${oy + uy * 4 + ny * 4}`, fill: color }));
      svg.append(svgEl("text", { x: ox + 18, y: oy + 4, "font-size": 11, fill: color }, `${nums[r]}: ${m.kind === "create" ? "«create» " : ""}${m.label}`));
    });
  }
  function describe(r) {
    const m = msgs[r], n = r + 1, from = nameOf(m.from), to = nameOf(m.to);
    if (m.kind === "call") return `${n}: ${from} calls ${m.label} on ${to}, activation opens on ${to}.`;
    if (m.kind === "return") return `${n}: ${from} returns ${m.label} to ${to}, ${from}'s activation ends.`;
    if (m.kind === "self") return `${n}: ${from} calls its own ${m.label}, a self message: a nested activation on the same lifeline.`;
    return `${n}: ${from} creates ${to} with ${m.label}, a create message: ${to}'s lifeline starts here, lower than the others.`;
  }
  function frame(pos) {
    pos = Math.max(0, pos); // the first rAF tick can land a hair before 0
    const done = Math.min(msgs.length, Math.floor(pos + 1e-9)), f = pos - done;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", view === 0 ? `0 0 640 ${yOf(msgs.length) + 16}` : "0 0 640 320");
    if (view === 0) drawSequence(done, f); else drawCollaboration(done, f);
    let t;
    if (kit.asking(pos, msgs.length)) t = `Message ${kit.answered + 1} comes from ${nameOf(msgs[kit.answered].from)}. Is it a call, a return, a self or a create message, and to which lifeline?`;
    else if (done === 0 && f <= 0) t = view === 0 ? `Time runs downward. ${parts.length} lifelines; ${msgs.length} messages to draw.` : `The same objects as a graph of links; messages will be numbered 1, 1.1, 1.2 in call order.`;
    else {
      const r = f > 0 && done < msgs.length ? done : done - 1;
      t = describe(r);
      if (view === 1) t += nums[r] ? ` In the collaboration diagram it is message ${nums[r]}.` : " Collaboration diagrams do not number returns.";
      if (done >= msgs.length) t += kit.tally();
    }
    if (caption.textContent !== t) caption.textContent = t;
    kit.render(pos, msgs.length);
  }
  const pb = createPlayback({ count: msgs.length, unit: "message", onFrame: frame, stepMs: () => cfg.stepMs || 1500, limit: () => (kit.on ? kit.answered : msgs.length), onBlocked: kit.blocked });
  kit.pb = pb;
  box.append(pb.el);
}

export { parseProgram, Machine, PV_PRESETS };

export const WIDGETS = {
  "pointer-viz": pointerViz,
  "file-seek": fileSeek,
  "open-modes": openModes,
  "rand-range": randRange,
  "getline-sim": getlineSim,
  "vector-viz": vectorViz,
  "seek-play": seekPlay,
  "vector-grow-play": vectorGrowPlay,
  "sequence-play": sequencePlay,
};
