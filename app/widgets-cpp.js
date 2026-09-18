// Interactive C++ widgets: build pipeline, type sizes, initialization/narrowing,
// expression evaluation stepper, integer division, cin state machine,
// iostream manipulator playground, bitwise operators.
import { el, esc, slider, btnRow } from "./dom.js";

// ---------- compile-pipeline ----------
function compilePipeline(box, cfg) {
  box.append(el("h4", null, cfg.title || "From source files to a program: click each stage"));
  const stages = [
    { id: "src", title: "Source files", body: `<b>main.cpp</b>, <b>calculator.cpp</b> (source) and <b>calculator.hpp</b> (header).<br/>Headers <em>declare</em> (<code>int add(int, int);</code>). Source files <em>define</em> (the body). <code>main.cpp</code> is the only .cpp without its own header.` },
    { id: "pre", title: "1. Preprocessor", body: `Handles lines starting with <code>#</code> — <b>no semicolon</b>, ends at newline. <code>#include "calculator.hpp"</code> literally <b>pastes</b> the header text into the file. <code>#define PI 3.14</code> does textual replacement. <code>#pragma once</code> makes a header paste only once per translation unit. <code>#ifdef / #ifndef / #if / #endif</code> = conditional compilation.<br/>Output: one <em>translation unit</em> per .cpp file. Never <code>#include</code> a .cpp — you would paste the definitions twice → linker error.` },
    { id: "cc", title: "2. Compiler (g++)", body: `Compiles each translation unit separately into an object file (<code>main.o</code>, <code>calculator.o</code>). It only needs the <em>declaration</em> from the header to compile a call to <code>add(10,5)</code>; it trusts that a definition exists somewhere. Type errors, missing semicolons, narrowing in <code>{}</code>, and undeclared names are caught here.` },
    { id: "ld", title: "3. Linker", body: `Joins all object files (and the C++ standard library) into one executable. If <code>add</code> was declared but never defined in any .cpp, you get an <b>undefined reference</b> error here — not from the compiler. If it was defined twice (e.g. you included a .cpp) you get a <b>multiple definition</b> error.` },
    { id: "exe", title: "4. Executable", body: `Runs starting at <code>int main()</code>. <code>return 0;</code> tells the OS "no errors" (any other value = error code). Omitting <code>return</code> in <code>main</code> is allowed — it implicitly returns 0 — but best practice is to write it.<br/>CLion drives all of this with <b>CMake</b> (<code>CMakeLists.txt</code>, like Java's ant <code>build.xml</code>). <code>-Wall -Wextra -pedantic</code> turn on helpful warnings.` },
  ];
  const flow = el("div", "pipeline");
  const detail = el("div", "pipeline-detail");
  flow.innerHTML = `
    <div class="pl-col">
      <div class="pl-file hpp" data-stage="src">calculator.hpp<span>int add(int,int);</span></div>
      <div class="pl-file cpp" data-stage="src">main.cpp<span>#include "calculator.hpp"</span></div>
      <div class="pl-file cpp" data-stage="src">calculator.cpp<span>#include "calculator.hpp"</span></div>
    </div>
    <div class="pl-arrow">→</div>
    <div class="pl-col"><div class="pl-stage" data-stage="pre">Preprocessor<span>#include pasted<br/>#define replaced</span></div></div>
    <div class="pl-arrow">→</div>
    <div class="pl-col"><div class="pl-stage" data-stage="cc">Compiler<span>main.o<br/>calculator.o</span></div></div>
    <div class="pl-arrow">→</div>
    <div class="pl-col"><div class="pl-stage" data-stage="ld">Linker<span>+ std library</span></div></div>
    <div class="pl-arrow">→</div>
    <div class="pl-col"><div class="pl-stage exe" data-stage="exe">program.exe<span>starts at main()</span></div></div>`;
  box.append(flow, detail);
  function show(id) {
    const s = stages.find((x) => x.id === id);
    detail.innerHTML = `<div class="pl-title">${s.title}</div><div>${s.body}</div>`;
    flow.querySelectorAll("[data-stage]").forEach((n) => n.classList.toggle("active", n.dataset.stage === id));
  }
  flow.querySelectorAll("[data-stage]").forEach((n) => n.addEventListener("click", () => show(n.dataset.stage)));
  show("src");
}

// ---------- type-sizes ----------
function typeSizes(box, cfg) {
  box.append(el("h4", null, cfg.title || "Fundamental types: size and range (MinGW g++ on Windows x64)"));
  const types = [
    ["bool", 1, "true / false (prints as 1 / 0)", "integer-ish"],
    ["char", 1, "−128 … 127 (one character, e.g. 'A' = 65)", "integer"],
    ["short", 2, "−32,768 … 32,767", "integer"],
    ["int", 4, "−2,147,483,648 … 2,147,483,647", "integer"],
    ["long", 4, "same as int on Windows (8 bytes on Linux/mac!)", "integer"],
    ["long long", 8, "≈ ±9.2 × 10^18", "integer"],
    ["float", 4, "≈ ±3.4 × 10^38, ~7 significant digits", "floating"],
    ["double", 8, "≈ ±1.8 × 10^308, ~15–16 significant digits", "floating"],
    ["long double", 16, "extended precision (x86: 80-bit padded to 16)", "floating"],
    ["void", 0, "no type — 'nothing' (return type only)", "special"],
  ];
  const grid = el("div", "grid-cells");
  const note = el("div", "stat-steps");
  for (const [name, size, rng, kind] of types) {
    const c = el("div", `mem-cell kind-${kind.split("-")[0]}`);
    c.innerHTML = `<div class="t">${name}</div><div class="s">${size ? size + " byte" + (size > 1 ? "s" : "") : "—"}</div><div class="bar" style="width:${Math.max(6, size * 6)}px"></div>`;
    c.addEventListener("click", () => {
      grid.querySelectorAll(".mem-cell").forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      note.innerHTML = `<div class="stat-label">${name} · ${kind}</div><div class="math-line"><code>sizeof(${name})</code> = ${size || "n/a"} &nbsp; range: ${rng}</div>`;
    });
    grid.append(c);
  }
  box.append(el("p", "widget-note", "Sizes are implementation-defined; C++ only guarantees 1 = sizeof(char) ≤ sizeof(short) ≤ sizeof(int) ≤ sizeof(long) ≤ sizeof(long long). Use sizeof(...) to check on your machine; <climits>/<limits> give exact ranges."), grid, note);
  grid.querySelector(".mem-cell:nth-child(4)").click();
}

// ---------- init-forms (narrowing) ----------
function initForms(box, cfg) {
  box.append(el("h4", null, cfg.title || "Three ways to initialize, and which one refuses to lose data"));
  const state = { from: "double", to: "int", value: 2.75 };
  const ctl = el("div", "viz-inline");
  const fromSel = sel(["int", "double", "float", "char", "long long"], state.from, (v) => { state.from = v; render(); });
  const val = document.createElement("input"); val.className = "q-input small"; val.value = "2.75";
  val.addEventListener("input", () => { state.value = parseFloat(val.value); render(); });
  const toSel = sel(["int", "double", "float", "char", "short", "bool", "long long"], state.to, (v) => { state.to = v; render(); });
  ctl.append(el("span", null, "from "), fromSel, el("span", null, " value "), val, el("span", null, " → "), toSel);
  const out = el("div", "init-table");
  box.append(ctl, out);
  function sel(opts, cur, on) {
    const s = document.createElement("select"); s.className = "q-input small";
    for (const o of opts) { const op = document.createElement("option"); op.value = o; op.textContent = o; if (o === cur) op.selected = true; s.append(op); }
    s.addEventListener("change", () => on(s.value));
    return s;
  }
  const rank = { bool: 0, char: 1, short: 2, int: 3, "long long": 4, float: 5, double: 6 };
  const isInt = (t) => rank[t] <= 4;
  function narrowing(from, to, v) {
    if (from === to) return false;
    if (!isInt(from) && isInt(to)) return true;               // floating → integer
    if (from === "double" && to === "float") return true;      // double → float
    if (isInt(from) && !isInt(to)) return false;                // int → double is fine (for literals in range)
    if (isInt(from) && isInt(to)) {
      // integer → narrower integer: narrowing unless constant fits (compilers accept constant expressions that fit)
      const limits = { bool: [0, 1], char: [-128, 127], short: [-32768, 32767], int: [-2147483648, 2147483647], "long long": [-9.2e18, 9.2e18] };
      const [lo, hi] = limits[to];
      return rank[to] < rank[from] && !(Number.isInteger(v) && v >= lo && v <= hi);
    }
    return false;
  }
  function convert(to, v) {
    if (!Number.isFinite(v)) return "?";
    if (to === "bool") return v !== 0 ? "true (1)" : "false (0)";
    if (isInt(to)) {
      let t = Math.trunc(v);
      const wrap = { char: 8, short: 16, int: 32 }[to];
      if (wrap) { const m = 2 ** wrap; t = ((t % m) + m) % m; if (t >= m / 2) t -= m; }
      return String(t) + (to === "char" && t >= 32 && t < 127 ? ` ('${String.fromCharCode(t)}')` : "");
    }
    if (to === "float") return String(Math.fround(v));
    return String(v);
  }
  function render() {
    const v = state.value;
    const nar = narrowing(state.from, state.to, v);
    const conv = convert(state.to, v);
    const lit = state.from === "char" ? `'${String.fromCharCode(v)}'` : String(v);
    const rows = [
      [`${state.to} x = src;`, "C-style (copy) initialization", `compiles → x = ${conv}`, nar ? "silently converts (truncates / wraps)" : "fine", false],
      [`${state.to} x(src);`, "Constructor initialization", `compiles → x = ${conv}`, nar ? "silently converts (truncates / wraps)" : "fine", false],
      [`${state.to} x{src};`, "Uniform / brace initialization (C++11)", nar ? "ERROR: narrowing conversion" : `compiles → x = ${conv}`, nar ? "compiler refuses to lose information — this is why we prefer {}" : "no narrowing, so it's allowed", nar],
    ];
    out.innerHTML = `<div class="stat-note"><code>${state.from} src = ${lit};</code></div>` + rows.map(([code, name, res, note, err]) => `<div class="init-row ${err ? "err" : "ok"}"><code>${esc(code)}</code><div><div class="init-name">${name}</div><div class="init-res">${res}</div><div class="stat-note">${note}</div></div></div>`).join("");
  }
  render();
}

// ---------- expression stepper ----------
// Tokenizer + Pratt parser for a C++ expression subset, with step recording.
function tokenize(src) {
  const re = /\s*(?:(\d+\.\d+|\d+)|([A-Za-z_]\w*)|(\+\+|--|<<=|>>=|<<|>>|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|\/=|%=|[-+*\/%<>=!?:(),&|^~]))/y;
  const toks = [];
  let i = 0;
  while (i < src.length) {
    re.lastIndex = i;
    const m = re.exec(src);
    if (!m || m.index !== i) { if (/\s/.test(src[i])) { i++; continue; } throw new Error(`unexpected '${src[i]}'`); }
    i = re.lastIndex;
    if (m[1] != null) toks.push({ t: "num", v: m[1].includes(".") ? parseFloat(m[1]) : parseInt(m[1], 10), isFloat: m[1].includes(".") });
    else if (m[2] != null) toks.push({ t: "id", v: m[2] });
    else toks.push({ t: "op", v: m[3] });
  }
  return toks;
}
const BIN_PREC = { "*": 5, "/": 5, "%": 5, "+": 6, "-": 6, "<<": 7, ">>": 7, "<": 9, ">": 9, "<=": 9, ">=": 9, "==": 10, "!=": 10, "&": 11, "^": 12, "|": 13, "&&": 14, "||": 15 };
const ASSIGN = new Set(["=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>="]);
function parseExpr(toks) {
  let p = 0;
  const peek = () => toks[p];
  const next = () => toks[p++];
  function primary() {
    const t = next();
    if (!t) throw new Error("unexpected end");
    if (t.t === "num") return { k: "lit", v: t.v, isFloat: t.isFloat };
    if (t.t === "id") {
      if (t.v === "true") return { k: "lit", v: 1, isBool: true };
      if (t.v === "false") return { k: "lit", v: 0, isBool: true };
      return { k: "var", name: t.v };
    }
    if (t.v === "(") {
      const e = comma();
      if (!peek() || peek().v !== ")") throw new Error("expected )");
      next();
      return { k: "paren", e };
    }
    if (t.v === "-" || t.v === "!" || t.v === "+" || t.v === "~") return { k: "un", op: t.v, e: unary() };
    if (t.v === "++" || t.v === "--") { const e = unary(); return { k: "preinc", op: t.v, e }; }
    throw new Error(`unexpected '${t.v}'`);
  }
  function unary() {
    let e = primary();
    while (peek() && (peek().v === "++" || peek().v === "--")) e = { k: "postinc", op: next().v, e };
    return e;
  }
  function binary(minPrec) {
    let left = unary();
    for (;;) {
      const t = peek();
      if (!t || t.t !== "op" || BIN_PREC[t.v] == null || BIN_PREC[t.v] > minPrec) break;
      next();
      const right = binary(BIN_PREC[t.v] - 1);
      left = { k: "bin", op: t.v, l: left, r: right };
    }
    return left;
  }
  function ternary() {
    const c = binary(15);
    if (peek() && peek().v === "?") {
      next();
      const a = assignment();
      if (!peek() || peek().v !== ":") throw new Error("expected :");
      next();
      const b = ternary();
      return { k: "tern", c, a, b };
    }
    return c;
  }
  function assignment() {
    const left = ternary();
    if (peek() && ASSIGN.has(peek().v)) {
      const op = next().v;
      const right = assignment();
      return { k: "assign", op, l: left, r: right };
    }
    return left;
  }
  function comma() {
    let e = assignment();
    while (peek() && peek().v === ",") { next(); e = { k: "comma", l: e, r: assignment() }; }
    return e;
  }
  const e = comma();
  if (p < toks.length) throw new Error(`unexpected '${toks[p].v}'`);
  return e;
}
function render(n) {
  switch (n.k) {
    case "lit": return n.isBool ? (n.v ? "true" : "false") : String(n.v);
    case "var": return n.name;
    case "paren": return `(${render(n.e)})`;
    case "un": return `${n.op}${render(n.e)}`;
    case "preinc": return `${n.op}${render(n.e)}`;
    case "postinc": return `${render(n.e)}${n.op}`;
    case "bin": return `${render(n.l)} ${n.op} ${render(n.r)}`;
    case "tern": return `${render(n.c)} ? ${render(n.a)} : ${render(n.b)}`;
    case "assign": return `${render(n.l)} ${n.op} ${render(n.r)}`;
    case "comma": return `${render(n.l)}, ${render(n.r)}`;
  }
}
function evaluateWithSteps(src, env) {
  const root = parseExpr(tokenize(src));
  const steps = [];
  const vars = { ...env };
  const lit = (v, isFloat = false, isBool = false) => ({ k: "lit", v, isFloat, isBool });
  const replace = (node, val) => { Object.keys(node).forEach((k) => delete node[k]); Object.assign(node, val); };
  function note(text) { steps.push({ expr: render(root), note: text, vars: { ...vars } }); }
  function ev(n) {
    switch (n.k) {
      case "lit": return n;
      case "var": {
        if (!(n.name in vars)) throw new Error(`unknown variable '${n.name}'`);
        const v = vars[n.name];
        replace(n, lit(v, !Number.isInteger(v)));
        note(`read variable → ${v}`);
        return n;
      }
      case "paren": { const r = ev(n.e); replace(n, r); note("parentheses removed"); return n; }
      case "un": {
        const r = ev(n.e);
        const v = n.op === "-" ? -r.v : n.op === "!" ? (r.v ? 0 : 1) : n.op === "~" ? ~r.v : r.v;
        replace(n, lit(v, r.isFloat && n.op !== "!", n.op === "!"));
        note(`unary ${n.op}`);
        return n;
      }
      case "preinc": {
        if (n.e.k !== "var") throw new Error("++/-- needs a variable");
        const name = n.e.name;
        vars[name] += n.op === "++" ? 1 : -1;
        replace(n, lit(vars[name]));
        note(`pre-${n.op === "++" ? "increment" : "decrement"}: ${name} becomes ${vars[name]} FIRST, then that new value is used`);
        return n;
      }
      case "postinc": {
        if (n.e.k !== "var") throw new Error("++/-- needs a variable");
        const name = n.e.name;
        const old = vars[name];
        vars[name] += n.op === "++" ? 1 : -1;
        replace(n, lit(old));
        note(`post-${n.op === "++" ? "increment" : "decrement"}: OLD value ${old} is used in the expression; ${name} becomes ${vars[name]} as a side effect`);
        return n;
      }
      case "bin": {
        const L = ev(n.l);
        if (n.op === "&&" && !L.v) { replace(n, lit(0, false, true)); note("&& short-circuit: left is false, right side NOT evaluated"); return n; }
        if (n.op === "||" && L.v) { replace(n, lit(1, false, true)); note("|| short-circuit: left is true, right side NOT evaluated"); return n; }
        const R = ev(n.r);
        const isF = L.isFloat || R.isFloat;
        let v, why = "";
        const op = n.op;
        switch (op) {
          case "+": v = L.v + R.v; break;
          case "-": v = L.v - R.v; break;
          case "*": v = L.v * R.v; break;
          case "/": if (R.v === 0 && !isF) throw new Error("integer division by zero → undefined behaviour / crash"); v = isF ? L.v / R.v : Math.trunc(L.v / R.v); why = isF ? "" : " (integer division: fraction discarded)"; break;
          case "%": if (isF) throw new Error("% needs integer operands"); if (R.v === 0) throw new Error("modulo by zero"); v = L.v % R.v; why = " (remainder; sign follows the left operand)"; break;
          case "<<": v = L.v << R.v; why = ` (shift left = × ${2 ** R.v})`; break;
          case ">>": v = L.v >> R.v; why = ` (shift right = ÷ ${2 ** R.v}, floor)`; break;
          case "<": v = +(L.v < R.v); break;
          case ">": v = +(L.v > R.v); break;
          case "<=": v = +(L.v <= R.v); break;
          case ">=": v = +(L.v >= R.v); break;
          case "==": v = +(L.v === R.v); break;
          case "!=": v = +(L.v !== R.v); break;
          case "&": v = L.v & R.v; break;
          case "|": v = L.v | R.v; break;
          case "^": v = L.v ^ R.v; break;
          case "&&": v = +(L.v && R.v); break;
          case "||": v = +(L.v || R.v); break;
        }
        const isBool = ["<", ">", "<=", ">=", "==", "!=", "&&", "||"].includes(op);
        if (isF && !isBool) v = Number(v.toFixed(10));
        replace(n, lit(v, isF && !isBool, isBool));
        note(`${L.isBool ? (L.v ? "true" : "false") : L.v} ${op} ${R.isBool ? (R.v ? "true" : "false") : R.v} = ${isBool ? (v ? "true" : "false") : v}${why}`);
        return n;
      }
      case "tern": {
        const C = ev(n.c);
        const chosen = C.v ? n.a : n.b;
        const skipped = C.v ? n.b : n.a;
        const skippedText = render(skipped);
        const R = ev(chosen);
        replace(n, R);
        note(`ternary: condition is ${C.v ? "true → picks the value before ':'" : "false → picks the value after ':'"} (skipped: ${skippedText})`);
        return n;
      }
      case "assign": {
        if (n.l.k !== "var") throw new Error("left of assignment must be a variable");
        const name = n.l.name;
        const R = ev(n.r);
        let v = R.v;
        if (n.op !== "=") {
          const cur = vars[name];
          const opc = n.op.slice(0, -1);
          const tmp = evaluateWithSteps(`${cur} ${opc} ${v}`, {});
          v = tmp.value;
        }
        vars[name] = v;
        replace(n, lit(v, R.isFloat));
        note(`${name} ${n.op} ${R.v} → ${name} is now ${v}; the assignment expression itself has value ${v}`);
        return n;
      }
      case "comma": {
        ev(n.l);
        const R = ev(n.r);
        replace(n, R);
        note("comma operator: left evaluated (for side effects) and discarded, right is the result");
        return n;
      }
    }
  }
  const start = render(root);
  const res = ev(root);
  return { start, steps, value: res.v, isBool: res.isBool, vars };
}

function exprStepper(box, cfg) {
  box.append(el("h4", null, cfg.title || "Expression stepper: precedence, pre/post ++, short-circuit, ternary, comma"));
  const presets = cfg.presets || [
    "1 + 2 * 3 - 8 / 3 % 2",
    "x++ + ++x",
    "(a = 5) * 2 + a",
    "7 / 2 * 2.0",
    "x < 5 ? 100 : 200",
    "x != 0 && 10 / x > 1",
    "(++n, 2 * n)",
    "17 % 5 - -17 % 5",
    "1 << 3 | 2",
    "5 > 3 == true",
  ];
  const input = document.createElement("input");
  input.className = "q-input wide"; input.value = cfg.expr || presets[0];
  const envRow = el("div", "viz-inline");
  const env = { ...(cfg.env || { x: 3, a: 1, n: 1 }) };
  const envInputs = {};
  for (const k of Object.keys(env)) {
    const i = document.createElement("input"); i.type = "number"; i.value = env[k]; i.className = "q-input small";
    i.addEventListener("input", run);
    envInputs[k] = i;
    envRow.append(el("span", null, `int ${k} = `), i, el("span", null, "; "));
  }
  const out = el("div", "steps");
  box.append(btnRow(presets, (i, l) => { input.value = l; run(); }, -1), envRow, input, out);
  input.addEventListener("input", run);
  function run() {
    const e = {};
    for (const k in envInputs) e[k] = parseFloat(envInputs[k].value) || 0;
    out.innerHTML = "";
    try {
      const r = evaluateWithSteps(input.value, e);
      out.append(el("div", "step start", r.start));
      for (const s of r.steps) {
        const d = el("div", "step");
        d.innerHTML = `<div class="step-expr">${esc(s.expr)}</div><div class="step-note">${esc(s.note)}</div>`;
        out.append(d);
      }
      const fin = el("div", "step final");
      fin.innerHTML = `<b>value = ${r.isBool ? (r.value ? "true" : "false") : r.value}</b> &nbsp; variables after: ${Object.entries(r.vars).map(([k, v]) => `${k}=${v}`).join(", ")}`;
      out.append(fin);
    } catch (err) {
      out.append(el("div", "step error", "⚠ " + err.message));
    }
  }
  run();
}

// ---------- int-division ----------
function intDivision(box, cfg) {
  box.append(el("h4", null, cfg.title || "Integer division and modulo"));
  const st = { a: 17, b: 5 };
  const out = el("div", "stat-grid");
  const viz = el("div", "div-viz");
  const sa = slider("a", -30, 30, 1, st.a, (v) => { st.a = v; draw(); });
  const sb = slider("b", -10, 10, 1, st.b, (v) => { st.b = v; draw(); });
  box.append(sa.row, sb.row, viz, out);
  function cell(l, v, n) { const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", v)); if (n) c.append(el("div", "stat-note", n)); return c; }
  function draw() {
    const { a, b } = st;
    out.innerHTML = ""; viz.innerHTML = "";
    if (b === 0) { out.append(cell("a / b", "undefined behaviour", "integer division by zero crashes the program")); return; }
    const q = Math.trunc(a / b), r = a % b;
    out.append(
      cell("a / b (int / int)", String(q), "truncates toward zero — NOT rounding, NOT floor"),
      cell("a % b", String(r), "remainder: a == (a/b)*b + a%b; sign follows a"),
      cell("(double)a / b", (a / b).toFixed(4), "cast ONE operand first → real division"),
      cell("(double)(a / b)", q.toFixed(4), "cast AFTER integer division → too late"),
      cell("a / 2.0", (a / 2).toFixed(4), "a floating literal also promotes"),
      cell("check", `${q} × ${b} + ${r} = ${q * b + r}`, "always reconstructs a"),
    );
    if (b > 0 && a >= 0) {
      for (let i = 0; i < q; i++) viz.append(el("span", "chunk", String(b)));
      if (r) viz.append(el("span", "chunk rem", `rem ${r}`));
    }
  }
  draw();
}

// ---------- cin state machine ----------
function cinSim(box, cfg) {
  box.append(el("h4", null, cfg.title || "What does cin >> actually do? Type input and step"));
  const reads = cfg.reads || ["int n", "int m", "string word", "double d"];
  const readInput = document.createElement("input"); readInput.className = "q-input wide"; readInput.value = reads.join(", ");
  const bufInput = document.createElement("input"); bufInput.className = "q-input wide"; bufInput.value = cfg.input ?? "123 456 hello 2.5";
  const presets = cfg.presets || { "123 456": "123 456", "12abc": "12abc", "hello": "hello", "3.7 → int": "3.7", "(EOF only)": "", "-42\\n7": "-42\\n7" };
  const out = el("div", "cin-steps");
  box.append(el("p", "widget-note", "Each `>>` first skips whitespace, then reads the longest run of characters that fits the type. If zero characters fit → failbit is set, the variable is left unchanged, and the bad characters STAY in the buffer (every later read fails too until cin.clear() + cin.ignore(...))."),
    el("div", "viz-inline", "reads: "), readInput, el("div", "viz-inline", "typed input (use \\n for Enter, * = EOF): "), btnRow(Object.keys(presets), (i, l) => { bufInput.value = presets[l]; run(); }, -1), bufInput, out);
  readInput.addEventListener("input", run); bufInput.addEventListener("input", run);
  function run() {
    out.innerHTML = "";
    let buf = bufInput.value.replace(/\\n/g, "\n");
    const specs = readInput.value.split(",").map((s) => s.trim()).filter(Boolean).map((s) => { const [type, name] = s.split(/\s+/); return { type, name }; });
    const vars = {};
    let fail = false, eof = false;
    const show = (title, note) => {
      const d = el("div", "cin-step");
      d.innerHTML = `<div class="cin-title">${esc(title)}</div><div class="cin-buf">buffer: <code>${esc(buf.replace(/\n/g, "⏎")) || "(empty)"}</code>${eof ? " <span class='flag'>EOF</span>" : ""}</div><div class="cin-note">${note}</div><div class="cin-flags">failbit: <b class="${fail ? "on" : ""}">${fail ? "SET" : "clear"}</b> · eofbit: <b class="${eof ? "on" : ""}">${eof ? "SET" : "clear"}</b> · cin is ${fail ? "<b class='on'>false</b>" : "<b>true</b>"}${Object.keys(vars).length ? " · vars: " + Object.entries(vars).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(", ") : ""}</div>`;
      out.append(d);
    };
    show("start", "");
    for (const { type, name } of specs) {
      if (fail) { show(`cin >> ${name}`, "stream is in fail state → does NOTHING. Need <code>cin.clear()</code> then <code>cin.ignore(numeric_limits&lt;streamsize&gt;::max(), '\\n')</code> to throw the bad line away."); continue; }
      const ws = buf.match(/^\s*/)[0];
      buf = buf.slice(ws.length);
      let m;
      if (type === "int" || type === "long") m = buf.match(/^[+-]?\d+/);
      else if (type === "double" || type === "float") m = buf.match(/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/);
      else if (type === "char") m = buf.match(/^[^\s]/);
      else m = buf.match(/^[^\s]+/); // string
      if (buf.length === 0) { fail = true; eof = true; show(`cin >> ${name}`, `${ws ? "skipped whitespace, then " : ""}hit end of input before reading anything → <b>failbit AND eofbit</b> set, ${name} unchanged`); continue; }
      if (!m) { fail = true; show(`cin >> ${name}`, `${ws ? "skipped whitespace; " : ""}next char '<code>${esc(buf[0])}</code>' cannot start a ${type} → <b>failbit set</b>, ${name} unchanged, nothing consumed`); continue; }
      const tok = m[0];
      buf = buf.slice(tok.length);
      vars[name] = type === "int" || type === "long" ? parseInt(tok, 10) : type === "double" || type === "float" ? parseFloat(tok) : tok;
      if (buf.length === 0) eof = true;
      show(`cin >> ${name}`, `${ws ? "skipped whitespace, " : ""}read '<code>${esc(tok)}</code>' as ${type} → ${name} = ${JSON.stringify(vars[name])}${buf.length && /^[^\s]/.test(buf) ? ` — stopped at '<code>${esc(buf[0])}</code>' which stays in the buffer` : ""}${eof && !fail ? " (reached end → eofbit set, but read SUCCEEDED)" : ""}`);
    }
  }
  run();
}

// ---------- manipulator playground ----------
function fmtG(x, prec, showpoint, upper) {
  if (prec === 0) prec = 1;
  if (x === 0) return showpoint ? "0." + "0".repeat(prec - 1) : "0";
  const exp = Math.floor(Math.log10(Math.abs(x)));
  let s;
  if (exp < -4 || exp >= prec) {
    s = x.toExponential(prec - 1);
    let [mant, e] = s.split("e");
    if (!showpoint && mant.includes(".")) mant = mant.replace(/\.?0+$/, "");
    const en = parseInt(e, 10);
    s = mant + (upper ? "E" : "e") + (en < 0 ? "-" : "+") + String(Math.abs(en)).padStart(2, "0");
  } else {
    s = x.toFixed(Math.max(0, prec - 1 - exp));
    if (!showpoint && s.includes(".")) s = s.replace(/\.?0+$/, "");
  }
  return s;
}
export function formatStream(value, kind, f) {
  // f: {base, showbase, uppercase, showpos, width, fill, adjust, floatfield, precision, showpoint, boolalpha}
  let body, sign = "", prefix = "";
  if (kind === "bool") {
    body = f.boolalpha ? (value ? "true" : "false") : (value ? "1" : "0");
  } else if (kind === "int") {
    const v = Math.trunc(value);
    if (f.base === 10) {
      body = String(Math.abs(v));
      if (v < 0) sign = "-"; else if (f.showpos) sign = "+";
    } else {
      const u = v < 0 ? v >>> 0 : v; // negative ints print as unsigned bit pattern
      body = u.toString(f.base);
      if (f.uppercase) body = body.toUpperCase();
      if (f.showbase && v !== 0) prefix = f.base === 16 ? (f.uppercase ? "0X" : "0x") : "0";
    }
  } else {
    const p = f.precision;
    const a = Math.abs(value);
    if (f.floatfield === "fixed") body = a.toFixed(p);
    else if (f.floatfield === "scientific") {
      let s = a.toExponential(p);
      let [mant, e] = s.split("e");
      const en = parseInt(e, 10);
      body = mant + (f.uppercase ? "E" : "e") + (en < 0 ? "-" : "+") + String(Math.abs(en)).padStart(2, "0");
    } else body = fmtG(a, p, f.showpoint, f.uppercase);
    if (value < 0 || Object.is(value, -0)) sign = "-"; else if (f.showpos) sign = "+";
  }
  let s = sign + prefix + body;
  const w = f.width || 0;
  if (s.length < w) {
    const pad = f.fill.repeat(w - s.length);
    if (f.adjust === "left") s = s + pad;
    else if (f.adjust === "internal") s = sign + prefix + pad + body;
    else s = pad + s;
  }
  return s;
}
function manipulators(box, cfg) {
  box.append(el("h4", null, cfg.title || "Output manipulator playground: see exactly what cout prints"));
  const f = { base: 10, showbase: false, uppercase: false, showpos: false, width: 0, fill: " ", adjust: "right", floatfield: "default", precision: 6, showpoint: false, boolalpha: false };
  const vals = { int: 123, double: 123.456789, bool: true };
  const ctl = el("div", "manip-grid");
  const code = el("pre", "manip-code");
  const out = el("div", "manip-out");
  function toggle(label, key, group) {
    const b = el("button", "viz-btn", label);
    b.addEventListener("click", () => {
      if (group) { f[key] = group[label]; } else f[key] = !f[key];
      render();
    });
    b.dataset.key = key; b.dataset.label = label;
    return b;
  }
  const groups = [
    ["values", null, null],
    ["base", "base", { dec: 10, hex: 16, oct: 8 }],
    ["int flags", null, ["showbase", "uppercase", "showpos"]],
    ["float field", "floatfield", { "(default)": "default", fixed: "fixed", scientific: "scientific" }],
    ["float flags", null, ["showpoint"]],
    ["bool", null, ["boolalpha"]],
    ["adjust (needs setw)", "adjust", { left: "left", right: "right", internal: "internal" }],
  ];
  const buttons = [];
  for (const [title, key, opts] of groups) {
    const row = el("div", "manip-row");
    row.append(el("span", "stat-label", title));
    if (title === "values") {
      for (const k of ["int", "double", "bool"]) {
        const i = document.createElement("input"); i.className = "q-input small"; i.value = String(vals[k]);
        i.addEventListener("input", () => { vals[k] = k === "bool" ? (i.value === "true" || i.value === "1") : Number(i.value); render(); });
        row.append(el("span", null, ` ${k} n = `), i);
      }
    } else if (Array.isArray(opts)) {
      for (const k of opts) { const b = toggle(k, k); buttons.push(b); row.append(b); }
    } else {
      for (const l of Object.keys(opts)) { const b = toggle(l, key, opts); buttons.push(b); row.append(b); }
    }
    ctl.append(row);
  }
  const numRow = el("div", "manip-row");
  numRow.append(el("span", "stat-label", "iomanip"));
  const wI = document.createElement("input"); wI.type = "number"; wI.value = 0; wI.className = "q-input small"; wI.min = 0;
  const fillI = document.createElement("input"); fillI.value = " "; fillI.className = "q-input small"; fillI.maxLength = 1;
  const precI = document.createElement("input"); precI.type = "number"; precI.value = 6; precI.className = "q-input small"; precI.min = 0;
  wI.addEventListener("input", () => { f.width = parseInt(wI.value, 10) || 0; render(); });
  fillI.addEventListener("input", () => { f.fill = fillI.value || " "; render(); });
  precI.addEventListener("input", () => { f.precision = Math.max(0, parseInt(precI.value, 10) || 0); render(); });
  numRow.append(el("span", null, " setw("), wI, el("span", null, ")  setfill('"), fillI, el("span", null, "')  setprecision("), precI, el("span", null, ")"));
  ctl.append(numRow);
  box.append(ctl, code, out);
  function render() {
    for (const b of buttons) {
      const k = b.dataset.key, l = b.dataset.label;
      const g = groups.find((x) => x[1] === k);
      const active = g && !Array.isArray(g[2]) ? f[k] === g[2][l] : !!f[k];
      b.classList.toggle("active", active);
    }
    const manips = [];
    if (f.base !== 10) manips.push(f.base === 16 ? "hex" : "oct");
    if (f.showbase) manips.push("showbase");
    if (f.uppercase) manips.push("uppercase");
    if (f.showpos) manips.push("showpos");
    if (f.floatfield !== "default") manips.push(f.floatfield);
    if (f.showpoint) manips.push("showpoint");
    if (f.boolalpha) manips.push("boolalpha");
    if (f.precision !== 6) manips.push(`setprecision(${f.precision})`);
    if (f.fill !== " ") manips.push(`setfill('${f.fill}')`);
    if (f.adjust !== "right") manips.push(f.adjust);
    const w = f.width ? `setw(${f.width}) << ` : "";
    const chain = manips.length ? manips.join(" << ") + " << " : "";
    code.textContent = `cout << ${chain}${w}n;   // int n = ${vals.int}\ncout << ${chain}${w}d;   // double d = ${vals.double}\ncout << ${chain}${w}b;   // bool b = ${vals.bool}`;
    const lines = [["int", formatStream(vals.int, "int", f)], ["double", formatStream(vals.double, "double", f)], ["bool", formatStream(vals.bool, "bool", f)]];
    out.innerHTML = lines.map(([k, s]) => `<div class="manip-line"><span class="stat-label">${k}</span><code>|${esc(s)}|</code></div>`).join("") +
      `<div class="stat-note">| marks show padding. Remember: <b>setw applies to the NEXT item only</b>; every other manipulator is sticky until changed. Default precision is 6 <em>significant digits</em>; with <code>fixed</code>/<code>scientific</code> it means digits <em>after the decimal point</em>.</div>`;
  }
  render();
}

// ---------- bitwise ----------
function bitwise(box, cfg) {
  box.append(el("h4", null, cfg.title || "Bitwise & shift operators on 8-bit values (click bits)"));
  const st = { a: 2, b: 1 };
  const grid = el("div", "bit-grid");
  const out = el("div", "stat-grid");
  box.append(grid, out);
  function bits(v) { return [...Array(8)].map((_, i) => (v >> (7 - i)) & 1); }
  function row(label, v, editable, key) {
    const r = el("div", "bit-row");
    r.append(el("span", "bit-label", label));
    bits(v & 255).forEach((b, i) => {
      const c = el("span", "bit" + (b ? " on" : ""), String(b));
      if (editable) c.addEventListener("click", () => { st[key] ^= 1 << (7 - i); draw(); });
      r.append(c);
    });
    r.append(el("span", "bit-val", `= ${v & 255}`));
    return r;
  }
  function draw() {
    grid.innerHTML = ""; out.innerHTML = "";
    const { a, b } = st;
    grid.append(row("a", a, true, "a"), row("b", b, true, "b"), row("a & b", a & b), row("a | b", a | b), row("a ^ b", a ^ b), row("~a", ~a & 255), row("a << 1", (a << 1) & 255), row("a >> 1", a >> 1));
    for (const [l, v, n] of [["a &= b", a & b, "same as a = a & b"], ["a |= b", a | b, "a = a | b"], ["a ^= b", a ^ b, "a = a ^ b"], ["a <<= 1", (a << 1) & 255, "a = a << 1 (× 2)"], ["a >>= 1", a >> 1, "a = a >> 1 (÷ 2)"], ["a && b (logical!)", a && b ? "true" : "false", "any non-zero is true"]]) {
      const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l), el("div", "stat-value", String(v)), el("div", "stat-note", n)); out.append(c);
    }
  }
  draw();
}

// ---------- namespace / scope ----------
function namespaceViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "Where is 'cout' visible? Pick a using-style"));
  const opts = [
    { label: "std::cout everywhere", code: `#include <iostream>\n\nint main() {\n    std::cout << "Hi" << std::endl;\n    return 0;\n}`, note: "No using at all. Always works, most explicit. `::` = scope resolution operator: 'the cout that lives inside namespace std'." },
    { label: "using namespace std;", code: `#include <iostream>\nusing namespace std;   // ALL std names visible below\n\nint main() {\n    cout << "Hi" << endl;\n    return 0;\n}`, note: "Option 1: every name in std is visible from this line to the end of the file. Convenient (the course sample code does this) but risks name collisions in big projects — never put it in a header." },
    { label: "using std::cout;", code: `#include <iostream>\nusing std::cout;   // ONLY cout\nusing std::endl;   // ONLY endl\n\nint main() {\n    cout << "Hi" << endl;\n    return 0;\n}`, note: "Option 2: a using-declaration brings in one name each. Everything else still needs std::." },
    { label: "using inside main()", code: `#include <iostream>\n\nint main() {\n    using std::cout;   // visible only in THIS function\n    using std::endl;\n    cout << "Hi" << endl;\n    return 0;\n}`, note: "Option 3: scoped to the function block. Outside main(), cout is not visible without std::." },
  ];
  const pre = el("pre", "manip-code");
  const note = el("div", "stat-note");
  box.append(btnRow(opts.map((o) => o.label), (i) => show(i), 1), pre, note);
  function show(i) { pre.textContent = opts[i].code; note.innerHTML = opts[i].note.replace(/`([^`]+)`/g, "<code>$1</code>"); }
  show(1);
}

export const WIDGETS = {
  "compile-pipeline": compilePipeline,
  "type-sizes": typeSizes,
  "init-forms": initForms,
  "expr-stepper": exprStepper,
  "int-division": intDivision,
  "cin-sim": cinSim,
  "manipulators": manipulators,
  "bitwise": bitwise,
  "namespaces": namespaceViz,
};
