// Interactive C++ widgets for COMP 3522 Week 5: which catch clause runs (first match, child before
// parent, by reference versus by value, the ellipsis), stack unwinding frame by frame, the
// std::exception family tree, the coupling/cohesion picture you can rearrange, a SOLID violation
// spotter and a Law of Demeter train-wreck checker.
import { el, esc, btnRow } from "./dom.js";
import { highlight } from "./highlight.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
/** A dark code box, one row per line; `rowClass(i)` may add classes (cur, cpp3-dead). */
function codeBox(lines, cls = "oop-code", rowClass = null) {
  const box = el("div", cls);
  lines.forEach((text, i) => {
    const row = el("div", "pl" + (rowClass ? " " + (rowClass(i) || "") : ""));
    row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", text) || " "}</span>`;
    box.append(row);
  });
  return box;
}
function verdict(ok, html) { const d = el("div", "oop-verdict " + (ok ? "ok" : "bad")); d.innerHTML = html; return d; }
function note(html) { const p = el("p", "widget-note"); p.innerHTML = html; return p; }
function select(label, options, value, onChange) {
  const row = el("div", "unit-row");
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", label);
  for (const [v, text] of options) { const o = document.createElement("option"); o.value = v; o.textContent = text; if (v === value) o.selected = true; sel.append(o); }
  sel.addEventListener("change", () => onChange(sel.value));
  if (label) row.append(el("label", null, label));
  row.append(sel);
  return { row, sel };
}
function button(label, cls, onClick, ariaLabel) {
  const b = el("button", cls, label);
  if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
  b.addEventListener("click", onClick);
  return b;
}
function statCell(label, value, noteText) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label));
  c.append(el("div", "stat-value", value));
  if (noteText) c.append(el("div", "stat-note", noteText));
  return c;
}

// ---------- small UML drawing kit (shared by solid-spotter and demeter-chain) ----------
/** Class box with a title compartment and member lines. Returns its geometry. */
function umlBox(svg, x, y, w, title, members = [], opts = {}) {
  const stereo = opts.stereo ? 13 : 0;
  const h = 24 + stereo + (members.length ? 6 + members.length * 14 : 0);
  const stroke = opts.stroke || "var(--ink)";
  svg.append(svgEl("rect", { x, y, width: w, height: h, fill: "var(--paper)", stroke, "stroke-width": opts.bold ? 2 : 1 }));
  if (opts.stereo) svg.append(svgEl("text", { x: x + w / 2, y: y + 11, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, `«${opts.stereo}»`));
  svg.append(svgEl("text", { x: x + w / 2, y: y + 16 + stereo, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "var(--ink)" }, title));
  if (members.length) {
    svg.append(svgEl("line", { x1: x, y1: y + 24 + stereo, x2: x + w, y2: y + 24 + stereo, stroke }));
    members.forEach((m, i) => {
      const t = typeof m === "string" ? { text: m } : m;
      svg.append(svgEl("text", { x: x + 7, y: y + 24 + stereo + 16 + i * 14, "font-size": 11, fill: t.strike ? "var(--ink-dim)" : t.hl ? "var(--hl)" : "var(--ink-2)", "text-decoration": t.strike ? "line-through" : "none" }, t.text));
    });
  }
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
}
/** Arrow between two points. kind: assoc (solid, open head) | dep (dashed, open) | gen (solid, hollow triangle) | real (dashed, hollow triangle). */
function umlArrow(svg, x1, y1, x2, y2, kind = "assoc", label) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const tri = kind === "gen" || kind === "real", dashed = kind === "dep" || kind === "real";
  const headLen = tri ? 14 : 0;
  const ex = x2 - ux * headLen, ey = y2 - uy * headLen;
  svg.append(svgEl("line", { x1, y1, x2: ex, y2: ey, stroke: "var(--hl)", "stroke-width": 1.6, "stroke-dasharray": dashed ? "6 4" : "" }));
  const px = -uy, py = ux;
  if (tri) svg.append(svgEl("polygon", { points: `${x2},${y2} ${ex + px * 8},${ey + py * 8} ${ex - px * 8},${ey - py * 8}`, fill: "var(--paper)", stroke: "var(--hl)", "stroke-width": 1.6 }));
  else svg.append(svgEl("polyline", { points: `${x2 - ux * 11 + px * 7},${y2 - uy * 11 + py * 7} ${x2},${y2} ${x2 - ux * 11 - px * 7},${y2 - uy * 11 - py * 7}`, fill: "none", stroke: "var(--hl)", "stroke-width": 1.6 }));
  if (label) svg.append(svgEl("text", { x: (x1 + x2) / 2 + px * 10, y: (y1 + y2) / 2 + py * 10, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, label));
}

// =====================================================================================
// widget: catch-matcher
// =====================================================================================
// Every type the student can throw or catch. `bases` lists the accessible base classes, nearest
// first. `what` is what() of an object of exactly this type; `keepsMessage` marks the standard
// bases that store the message themselves (slicing to them keeps the text, verified).
const CM_TYPES = {
  "int": { bases: [], throwExpr: "throw 42;", printed: "42", body: "cout << e;", desc: "a fundamental type" },
  "const char*": { bases: [], throwExpr: 'throw "message error";', printed: "message error", body: "cout << e;", desc: "a string literal is a const char*, not a std::string" },
  "std::string": { bases: [], throwExpr: 'throw std::string("message error");', printed: "message error", body: "cout << e;", desc: "a class with no base" },
  "A": { bases: [], throwExpr: "throw A{};", printed: "random class error", body: "cout << e.message();", desc: "a user class unrelated to std::exception" },
  "myexception": { bases: ["std::exception"], what: "C++ Exception", throwExpr: "throw myexception();", desc: "derives from std::exception (exception2.cpp)" },
  "parent_type": { bases: ["std::exception"], what: "parent", throwExpr: "throw parent_type();", desc: "derives from std::exception" },
  "child_type": { bases: ["parent_type", "std::exception"], what: "child", throwExpr: "throw child_type();", desc: "derives from parent_type" },
  "std::length_error": { bases: ["std::logic_error", "std::exception"], what: "too long", throwExpr: 'throw std::length_error("too long");', desc: "a logic_error from <stdexcept>" },
  "std::runtime_error": { bases: ["std::exception"], what: "boom", throwExpr: 'throw std::runtime_error("boom");', desc: "from <stdexcept>" },
  "std::logic_error": { bases: ["std::exception"], what: "logic", keepsMessage: true, throwExpr: 'throw std::logic_error("logic");', desc: "from <stdexcept>" },
  "std::exception": { bases: [], what: "std::exception", throwExpr: "throw std::exception();", desc: "the base of every standard exception" },
};
const CM_THROWN = ["int", "const char*", "std::string", "A", "myexception", "child_type", "std::length_error", "std::runtime_error"];
const CM_CATCH = ["int", "const char*", "std::string", "A", "myexception", "parent_type", "child_type", "std::length_error", "std::logic_error", "std::runtime_error", "std::exception", "..."];
const CM_PRESETS = [
  { name: "exception2: throw myexception()", throw: "myexception", handlers: ["myexception&", "std::exception&", "A&", "const char*"] },
  { name: "exception2: throw A{}", throw: "A", handlers: ["myexception&", "std::exception&", "A&", "const char*"] },
  { name: 'exception2: throw "message error"', throw: "const char*", handlers: ["myexception&", "std::exception&", "A&", "const char*"] },
  { name: "slide 19: child before parent", throw: "child_type", handlers: ["child_type&", "parent_type&"] },
  { name: "slide 18: parent first, child ignored", throw: "child_type", handlers: ["parent_type&", "child_type&"] },
  { name: "by value: sliced", throw: "child_type", handlers: ["parent_type"] },
  { name: "slide 20: catch (...) last", throw: "int", handlers: ["std::exception&", "..."] },
  { name: "no handler: terminate", throw: "int", handlers: ["std::exception&"] },
  { name: "literal vs std::string", throw: "const char*", handlers: ["std::string&"] },
];
function cmParseHandler(s) {
  const t = String(s).trim();
  if (t === "...") return { type: "...", mode: "all" };
  const ref = /&$/.test(t);
  let type = t.replace(/&$/, "").trim();
  if (!CM_TYPES[type] && CM_TYPES[type.replace(/^const\s+/, "")]) type = type.replace(/^const\s+/, "");
  if (!CM_TYPES[type]) type = CM_CATCH.includes("std::" + type) ? "std::" + type : "std::exception";
  return { type, mode: ref ? "ref" : "val" };
}
function cmHandlerText(h) { return h.mode === "all" ? "..." : h.mode === "ref" ? `${h.type}& e` : `${h.type} e`; }
function cmBody(type) { return type === "..." ? 'cout << "catch-all";' : CM_TYPES[type].body || "cout << e.what();"; }
/** what() seen through a handler of type `caught` for an object of type `thrown` (by value = sliced). */
function cmWhatSeen(thrown, caught, byValue) {
  const T = CM_TYPES[thrown];
  if (!byValue || caught === thrown) return T.what;
  const C = CM_TYPES[caught];
  return C.keepsMessage ? T.what : C.what;
}
function catchMatcher(box, cfg) {
  box.append(el("h4", null, cfg.title || "Which catch clause runs?"));
  box.append(note("Choose what is thrown and arrange the catch clauses. C++ takes the <b>first</b> clause whose type is the thrown type, an accessible base of it, or <code>...</code>; later clauses for the same or a derived type are unreachable."));
  let thrown = CM_THROWN.includes(cfg.throw) ? cfg.throw : null;
  let handlers = Array.isArray(cfg.handlers) && cfg.handlers.length ? cfg.handlers.map(cmParseHandler) : null;
  const custom = !!(thrown || handlers);
  if (!thrown) thrown = custom ? "child_type" : CM_PRESETS[0].throw;
  if (!handlers) handlers = (custom ? ["parent_type&", "child_type&", "..."] : CM_PRESETS[0].handlers).map(cmParseHandler);
  if (cfg.presets !== false) box.append(btnRow(CM_PRESETS.map((p) => p.name), (i) => { thrown = CM_PRESETS[i].throw; handlers = CM_PRESETS[i].handlers.map(cmParseHandler); thrSel.sel.value = thrown; draw(); }, custom ? -1 : 0));
  const thrSel = select("thrown", CM_THROWN.map((t) => [t, `${CM_TYPES[t].throwExpr}   (${CM_TYPES[t].desc})`]), thrown, (v) => { thrown = v; draw(); });
  box.append(thrSel.row);
  const list = el("div"), codeWrap = el("div"), out = el("div"), table = el("div", "table-wrap");
  const addBtn = button("Add a catch clause", "reset-btn", () => { handlers.push({ type: "...", mode: "all" }); draw(); });
  const types = el("details", "pv-edit");
  types.append(el("summary", null, "The user-defined types"));
  types.append(codeBox(["class A { public: string message() { return \"random class error\"; } };   // NOT a std::exception", "struct myexception : public std::exception { const char* what() const noexcept override { return \"C++ Exception\"; } };", "struct parent_type : public std::exception { const char* what() const noexcept override { return \"parent\"; } };", "struct child_type : public parent_type { const char* what() const noexcept override { return \"child\"; } };"]));
  box.append(list, addBtn, codeWrap, out, table, types);
  function matches(h) { return h.mode === "all" || h.type === thrown || CM_TYPES[thrown].bases.includes(h.type); }
  function draw() {
    // handler editor
    list.innerHTML = "";
    handlers.forEach((h, i) => {
      const row = el("div", "unit-row cpp3-handler");
      row.append(el("span", "idx", `catch ${i + 1}`));
      const ts = select("", CM_CATCH.map((t) => [t, t]), h.type, (v) => { h.type = v; if (v === "...") h.mode = "all"; else if (h.mode === "all") h.mode = "ref"; draw(); });
      ts.sel.setAttribute("aria-label", `type of catch clause ${i + 1}`);
      row.append(ts.sel);
      if (h.type !== "...") {
        const ms = select("", [["ref", "by reference (T& e)"], ["val", "by value (T e)"]], h.mode, (v) => { h.mode = v; draw(); });
        ms.sel.setAttribute("aria-label", `how catch clause ${i + 1} takes the exception`);
        row.append(ms.sel);
      }
      row.append(button("↑", "reset-btn", () => { if (i > 0) { [handlers[i - 1], handlers[i]] = [handlers[i], handlers[i - 1]]; draw(); } }, `move catch clause ${i + 1} up`));
      row.append(button("↓", "reset-btn", () => { if (i < handlers.length - 1) { [handlers[i + 1], handlers[i]] = [handlers[i], handlers[i + 1]]; draw(); } }, `move catch clause ${i + 1} down`));
      row.append(button("✕", "reset-btn", () => { handlers.splice(i, 1); draw(); }, `remove catch clause ${i + 1}`));
      list.append(row);
    });
    // analysis
    const T = CM_TYPES[thrown];
    const ellipsisAt = handlers.findIndex((h) => h.mode === "all");
    const ellipsisBad = ellipsisAt >= 0 && ellipsisAt < handlers.length - 1;
    const status = handlers.map(() => ({ dead: false, why: "" }));
    handlers.forEach((h, j) => {
      for (let i = 0; i < j; i++) {
        const p = handlers[i];
        if (p.mode === "all") { status[j] = { dead: true, why: `after catch (...): error: '...' handler must be the last handler for its try block [-fpermissive]` }; break; }
        if (h.mode !== "all" && (p.type === h.type || (CM_TYPES[h.type] && CM_TYPES[h.type].bases.includes(p.type)))) { status[j] = { dead: true, why: `warning: exception of type '${h.type}' will be caught by earlier handler [-Wexceptions]` + (p.type !== h.type ? ` (note: for type '${p.type}')` : "") }; break; }
      }
    });
    const hit = handlers.findIndex((h) => matches(h));
    const lines = ["try {", `    ${T.throwExpr}`, "}", ...handlers.map((h) => `catch (${cmHandlerText(h)}) { ${cmBody(h.type)} }`)];
    codeWrap.innerHTML = "";
    codeWrap.append(codeBox(lines, "oop-code", (i) => (i === hit + 3 && !ellipsisBad ? "cur" : i >= 3 && status[i - 3].dead ? "cpp3-dead" : "")));
    out.innerHTML = "";
    if (ellipsisBad) {
      out.append(verdict(false, `<b>Does not compile.</b> g++: <code>error: '...' handler must be the last handler for its try block</code>. A clause after <code>catch (...)</code> could never run, so the language forbids it (guideline 4: the ellipsis is last).`));
    } else if (hit < 0) {
      const why = thrown === "const char*" && handlers.some((h) => h.type === "std::string") ? " A string literal is a <code>const char*</code>; <code>catch (std::string&)</code> does not match it, and no conversion is tried."
        : thrown === "A" ? " <code>A</code> does not derive from <code>std::exception</code>, so only <code>catch (A&)</code> or <code>catch (...)</code> can take it."
        : thrown === "int" ? " No conversion is applied when matching: an <code>int</code> matches only <code>catch (int)</code> or <code>catch (...)</code>." : "";
      out.append(verdict(false, `<b>No handler matches: <code>std::terminate</code> is called</b> (slide 29: terminate, then the termination handler calls <code>abort</code>). Nothing after the try block runs.${why}<br>stderr: <code>terminate called after throwing an instance of '${esc(thrown === "const char*" ? "char const*" : thrown)}'</code>${T.what ? `<br>&nbsp;&nbsp;<code>what():  ${esc(T.what)}</code>` : ""}`));
    } else {
      const h = handlers[hit];
      const sameType = h.type === thrown, byValue = h.mode === "val", poly = h.type !== "..." && !!CM_TYPES[h.type].what;
      let printed, extra = "";
      if (h.mode === "all") { printed = "catch-all"; extra = `<code>catch (...)</code> takes anything, including a thrown <code>${esc(thrown)}</code>; it cannot name the object, so there is no <code>e</code> to inspect.`; }
      else if (T.what) {
        const seen = cmWhatSeen(thrown, h.type, byValue);
        printed = seen;
        if (sameType) extra = byValue ? `Caught by value: a <b>copy</b> of the ${esc(thrown)} (no slicing because the types are equal), but g++ still warns <code>catching polymorphic type '${esc(h.type)}' by value [-Wcatch-value=]</code>. Guideline 1: catch by reference.` : `An exact match, caught by reference: <code>e</code> is the thrown object itself.`;
        else if (byValue) extra = seen === T.what ? `Caught <b>by value</b> as a <code>${esc(h.type)}</code>: the object is <b>sliced</b> to its base part. The message survives here only because <code>${esc(h.type)}</code> stores it itself; <code>what()</code> is no longer the override. g++: <code>catching polymorphic type '${esc(h.type)}' by value [-Wcatch-value=]</code>.` : `Caught <b>by value</b> as a <code>${esc(h.type)}</code>: the object is <b>sliced</b> down to its base part, and <code>what()</code> changes from <code>${esc(T.what)}</code> to <code>${esc(seen)}</code>. g++: <code>catching polymorphic type '${esc(h.type)}' by value [-Wcatch-value=]</code>. Guideline 1 exists for this reason.`;
        else extra = `Caught through a <b>base-class reference</b> (<code>${esc(h.type)}</code> is a base of <code>${esc(thrown)}</code>): no slicing, and the virtual <code>what()</code> still runs the override, so it prints <code>${esc(seen)}</code>.`;
      } else { printed = T.printed; extra = sameType ? `An exact type match. ${thrown === "const char*" ? "The literal is a <code>const char*</code>; a <code>catch (std::string&)</code> would not have matched it." : ""}` : ""; }
      const skipped = handlers.slice(0, hit).length;
      out.append(verdict(true, `<b>Clause ${hit + 1} runs: <code>catch (${esc(cmHandlerText(h))})</code></b>, printing <code>${esc(printed)}</code>.${skipped ? ` The ${skipped === 1 ? "clause" : skipped + " clauses"} above it did not match and ${skipped === 1 ? "was" : "were"} skipped (guideline 2: first matching type).` : ""} ${extra}`));
    }
    let html = `<table class="group-table"><thead><tr><th>clause</th><th>matches ${esc(thrown)}?</th><th>status</th><th>compiler</th></tr></thead><tbody>`;
    handlers.forEach((h, i) => {
      const m = matches(h), run = i === hit && !ellipsisBad;
      html += `<tr${status[i].dead ? ' style="opacity:.55"' : ""}><td><code>catch (${esc(cmHandlerText(h))})</code></td><td>${m ? '<span class="oop-yes">yes</span>' : '<span class="oop-no">no</span>'}${m && !run && i > hit && hit >= 0 ? " (too late)" : ""}</td><td>${run ? "<b>runs</b>" : status[i].dead ? "unreachable" : m ? "skipped: an earlier clause ran" : "skipped"}</td><td>${status[i].dead ? `<code>${esc(status[i].why)}</code>` : h.mode === "val" && CM_TYPES[h.type].what ? `<code>warning: catching polymorphic type '${esc(h.type)}' by value [-Wcatch-value=]</code>` : ""}</td></tr>`;
    });
    table.innerHTML = html + "</tbody></table>";
  }
  draw();
}

// =====================================================================================
// widget: unwind-stepper
// =====================================================================================
const UW_PRESETS = {
  "caught in main (rethrow in level2)": { level2: "rethrow", level1: "pass", main: "catch" },
  "no handler anywhere": { level2: "pass", level1: "pass", main: "none" },
  "caught in level2": { level2: "catch", level1: "pass", main: "catch" },
  "noexcept frame": { level2: "pass", level1: "noexcept", main: "catch" },
};
function uwProgram(p) {
  const L = {};
  const lines = [];
  const add = (t, key) => { lines.push(t); if (key) L[key] = lines.length; };
  add("struct Guard {   // prints \"<name> constructed\" and \"<name> destroyed\"");
  add("    const char* name;");
  add("    Guard(const char* n) : name(n) { cout << \"  \" << name << \" constructed\" << endl; }");
  add("    ~Guard() { cout << \"  \" << name << \" destroyed\" << endl; }");
  add("};");
  add("int level3() {");
  add("    Guard g(\"g3\");", "ctor3");
  add("    cout << \"level3 throws\" << endl;");
  add("    throw runtime_error(\"boom\");", "throw");
  add("    return 3;   // never reached", "ret3");
  add("}");
  add("int level2() {");
  add("    Guard g(\"g2\");", "ctor2");
  if (p.level2 === "pass") { add("    return level3();   // no handler here", "call2"); }
  else {
    add("    try {");
    add("        return level3();", "call2");
    add("    } catch (runtime_error& e) {", "catch2");
    if (p.level2 === "rethrow") { add("        cout << \"level2 caught: \" << e.what() << \", rethrowing\" << endl;"); add("        throw;   // rethrow the same object", "rethrow2"); }
    else { add("        cout << \"level2 caught: \" << e.what() << endl;"); add("        return -1;   // handled: level2 returns normally", "ret2"); }
    add("    }");
  }
  add("}");
  add(p.level1 === "noexcept" ? "int level1() noexcept {   // promises not to let an exception out" : "int level1() {");
  add("    Guard g(\"g1\");", "ctor1");
  add("    return level2();   // no handler here", "call1");
  add("}");
  add("int main() {");
  if (p.main === "catch") {
    add("    try {");
    add("        level1();", "callMain");
    add("    } catch (exception& e) {", "catchMain");
    add("        cout << \"main caught: \" << e.what() << endl;");
    add("    }");
  } else add("    level1();   // no try block at all", "callMain");
  add("    cout << \"main continues\" << endl;", "cont");
  add("    return 0;", "ret0");
  add("}");
  return { lines, L };
}
/** Simulates the preset; returns steps { line, out:[{t, err}], frames:[{name, local, status}], exc, msg, kind }. */
function uwRun(p, L) {
  const steps = [], out = [];
  let frames = [{ name: "main", local: null, status: "" }];
  let exc = null;
  const snap = (line, msg, kind = "") => steps.push({ line, msg, kind, exc, out: out.slice(), frames: frames.map((f) => ({ ...f })) });
  const push = (name, local, line) => { frames = frames.map((f) => ({ ...f, status: "" })); frames.push({ name, local, status: "" }); out.push({ t: `  ${local} constructed` }); snap(line, `<code>main</code> → … → <code>${name}()</code>: its local <code>Guard ${local}</code> is constructed. Each frame owns one object that prints when it dies.`, "call"); };
  const catcher = (f) => (f.name === "level2" && (p.level2 === "rethrow" || p.level2 === "catch")) || (f.name === "main" && p.main === "catch");
  const terminate = (line, why) => {
    frames = frames.map((f) => ({ ...f, status: "terminate" }));
    out.push({ t: "terminate called after throwing an instance of 'std::runtime_error'", err: true }, { t: "  what():  boom", err: true });
    exc = null;
    snap(line, `${why} <code>std::terminate()</code> runs, which calls <code>abort</code>: <b>no destructor runs</b> (${frames.filter((f) => f.local).map((f) => f.local).join(", ")} are never destroyed), <code>main continues</code> never prints, exit code 3.`, "error");
  };
  snap(L.callMain, "main() calls level1(). Three frames will be pushed, each with a Guard; then level3 throws.", "start");
  push("level1", "g1", L.ctor1);
  push("level2", "g2", L.ctor2);
  push("level3", "g3", L.ctor3);
  out.push({ t: "level3 throws" });
  exc = 'runtime_error("boom")';
  frames[frames.length - 1].status = "throwing";
  snap(L.throw, "<code>throw</code> creates the exception object and starts the <b>search</b> for a handler, from the innermost frame outward. <code>return 3</code> is never reached.", "error");
  // search + unwind, repeated after a rethrow
  let from = frames.length - 1;
  for (;;) {
    let k = -1, boundary = -1;
    for (let i = from; i >= 0; i--) {
      if (frames[i].name === "level1" && p.level1 === "noexcept") { boundary = i; break; }
      if (catcher(frames[i])) { k = i; break; }
    }
    if (boundary >= 0) { terminate(L.ctor1, "The search reaches <code>level1</code>, which is <code>noexcept</code>: the promise is broken, so the search stops there and"); return steps; }
    if (k < 0) { terminate(L.callMain, "No frame has a matching catch anywhere up the stack."); return steps; }
    const kf = frames[k];
    frames = frames.map((f, i) => ({ ...f, status: i === k ? "handler" : i > k ? "unwinding" : "" }));
    snap(kf.name === "main" ? L.catchMain : L.catch2, `<code>${kf.name}</code> has <code>catch (${kf.name === "main" ? "exception&" : "runtime_error&"})</code>, which matches a thrown <code>runtime_error</code>${kf.name === "main" ? " through its base class, by reference" : ""}. Now the stack <b>unwinds</b>: every frame between the throw and this handler is left and its locals are destroyed, innermost first.`);
    while (frames.length - 1 > k) {
      const f = frames.pop();
      out.push({ t: `  ${f.local} destroyed` });
      snap(f.name === "level3" ? L.ctor3 : f.name === "level2" ? L.ctor2 : L.ctor1, `<code>${f.name}</code> is left without returning: its local <code>${f.local}</code> is destroyed. Destructors run during unwinding, which is why RAII cleans up even on the error path.`, "end");
    }
    out.push({ t: `${kf.name} caught: boom${kf.name === "level2" && p.level2 === "rethrow" ? ", rethrowing" : ""}` });
    exc = null;
    snap(kf.name === "main" ? L.catchMain : L.catch2, `The handler in <code>${kf.name}</code> runs with <code>e</code> bound to the exception object; <code>e.what()</code> is <code>boom</code>.`, "end");
    if (kf.name === "level2" && p.level2 === "rethrow") {
      exc = 'runtime_error("boom")  (rethrown)';
      frames[k].status = "throwing";
      snap(L.rethrow2, "A bare <code>throw;</code> <b>rethrows the same object</b> (guideline 6); the search continues from the frames that enclose this handler. <code>throw e;</code> would copy it instead and could slice.", "error");
      from = k - 1;
      continue;
    }
    // handled: return normally through the remaining frames
    if (kf.name === "level2") {
      frames = frames.map((f) => ({ ...f, status: "" }));
      snap(L.ret2, "Handled. <code>level2</code> returns normally with -1; nothing above it ever learns that an exception happened.", "return");
      while (frames.length > 1) {
        const f = frames.pop();
        out.push({ t: `  ${f.local} destroyed` });
        snap(f.name === "level2" ? L.ret2 : L.call1, `<code>${f.name}</code> returns normally; <code>${f.local}</code> is destroyed at the closing brace, as always.`, "return");
      }
    }
    out.push({ t: "main continues" });
    frames = [{ name: "main", local: null, status: "" }];
    snap(L.cont, kf.name === "main" ? "After the handler, execution continues <b>after the try/catch</b>, not back where the throw happened." : "main's try block completed normally: its catch is never entered.", "end");
    snap(L.ret0, "Program ends with exit code 0.", "end");
    return steps;
  }
}
function unwindStepper(box, cfg) {
  box.append(el("h4", null, cfg.title || "Stack unwinding: who is destroyed, where the exception is caught"));
  const names = Object.keys(UW_PRESETS);
  let preset = UW_PRESETS[cfg.preset] ? cfg.preset : names[0];
  box.append(note("level3 throws a <code>runtime_error</code>. Step through the search for a handler and the unwinding that follows; the output pane is the program's real output."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { preset = names[i]; rebuild(); }, names.indexOf(preset)));
  const bar = el("div", "pv-ctl");
  const resetB = button("Reset", "reset-btn", () => go(0)), stepB = button("Step", "reset-btn", () => go(k + 1)), runB = button("Run", "reset-btn", () => go(steps.length - 1));
  const range = document.createElement("input"); range.type = "range"; range.min = 0; range.value = 0; range.className = "scrub-slider"; range.setAttribute("aria-label", "step");
  range.addEventListener("input", () => go(Number(range.value)));
  const pos = el("span", "scrub-pos", "");
  bar.append(resetB, stepB, runB, range, pos);
  const main = el("div", "pv-main"), codeWrap = el("div"), side = el("div");
  const stack = el("div", "lt-mem"), excBox = el("div", "pv-msg"), outBox = el("div", "pv-out cpp3-out"), msg = el("div", "pv-msg");
  side.append(el("div", "pv-title", "call stack (top of stack first)"), stack, el("div", "pv-title", "output so far"), outBox);
  main.append(codeWrap, side);
  box.append(bar, main, msg);
  let steps = [], rows = [], k = 0;
  function rebuild() {
    const p = UW_PRESETS[preset];
    const { lines, L } = uwProgram(p);
    codeWrap.innerHTML = "";
    const cb = codeBox(lines, "pv-code");
    codeWrap.append(cb);
    rows = [...cb.querySelectorAll(".pl")];
    steps = uwRun(p, L);
    range.max = steps.length - 1;
    go(0);
  }
  function go(v) {
    k = Math.max(0, Math.min(steps.length - 1, v));
    range.value = k; stepB.disabled = k === steps.length - 1; resetB.disabled = k === 0; runB.disabled = k === steps.length - 1;
    pos.textContent = `step ${k + 1} / ${steps.length}`;
    const s = steps[k];
    rows.forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === s.line));
    stack.innerHTML = "";
    [...s.frames].reverse().forEach((f) => {
      const fr = el("div", "pv-frame cpp3-frame " + f.status);
      fr.append(el("div", "pv-frame-title", `${f.name}()${f.status === "throwing" ? "   throwing" : f.status === "handler" ? "   handler found here" : f.status === "unwinding" ? "   being unwound" : f.status === "terminate" ? "   never unwound" : ""}`));
      if (f.local) { const c = el("div", "pv-cell"); c.innerHTML = `<div class="pv-names">Guard ${f.local}</div><div class="pv-type">local object: destroyed when the frame is left</div>`; fr.append(c); }
      else fr.append(el("div", "pv-empty", "(no locals)"));
      stack.append(fr);
    });
    if (s.exc) { const c = el("div", "pv-cell ptr"); c.innerHTML = `<div class="pv-names">exception in flight</div><div class="pv-type">${esc(s.exc)}</div>`; stack.prepend(c); }
    outBox.innerHTML = s.out.length ? s.out.map((o) => `<div class="${o.err ? "err" : ""}">${esc(o.t)}</div>`).join("") : "(nothing printed yet)";
    msg.className = "pv-msg " + (s.kind || "");
    msg.innerHTML = s.msg;
  }
  rebuild();
}

// =====================================================================================
// widget: exception-tree
// =====================================================================================
const ET_NODES = [
  { id: "exception", header: "<exception>", who: "the base class designed to be derived from; every exception thrown by the standard library derives from it. Its virtual what() returns a const char* (here \"std::exception\")." },
  { id: "bad_alloc", parent: "exception", header: "<new>", who: "thrown by new on allocation failure (slide 26). new never returns nullptr for a failed allocation; it throws." },
  { id: "bad_cast", parent: "exception", header: "<typeinfo>", who: "thrown by dynamic_cast when it fails in a dynamic cast (slide 26): a reference cast to the wrong derived type." },
  { id: "bad_typeid", parent: "exception", header: "<typeinfo>", who: "thrown by typeid (slide 26) when applied to a dereferenced null pointer to a polymorphic type." },
  { id: "bad_function_call", parent: "exception", header: "<functional>", who: "thrown on a bad call (slide 26): calling an empty std::function." },
  { id: "bad_weak_ptr", parent: "exception", header: "<memory>", who: "thrown by shared_ptr when passed a bad weak_ptr (slide 26): the object it watched is already gone." },
  { id: "logic_error", parent: "exception", header: "<stdexcept>", who: "thrown when a logic error occurs (slide 26): a bug the program could have detected before running, such as a violated precondition. Base of the four below; stores the message you pass to it." },
  { id: "invalid_argument", parent: "logic_error", header: "<stdexcept>", who: "an argument is rejected. Slide 28's Name constructor throws it for an empty first name (exception4.cpp); the practice-midterm Fraction throws it for a zero denominator." },
  { id: "length_error", parent: "logic_error", header: "<stdexcept>", who: "an attempt to exceed a maximum size (slide 27 cites exception3.cpp's substr; libstdc++ in fact throws out_of_range there, a sibling under logic_error)." },
  { id: "out_of_range", parent: "logic_error", header: "<stdexcept>", who: "an argument outside the valid range: vector::at, string::at, string::substr with pos > size." },
  { id: "domain_error", parent: "logic_error", header: "<stdexcept>", who: "a mathematical domain error (in the standard, not on the slide)." },
  { id: "runtime_error", parent: "exception", header: "<stdexcept>", who: "errors that can only be detected while the program runs (slide 27). Base of the three below; stores the message you pass to it." },
  { id: "range_error", parent: "runtime_error", header: "<stdexcept>", who: "a result cannot be represented in the destination type (slide 27)." },
  { id: "overflow_error", parent: "runtime_error", header: "<stdexcept>", who: "arithmetic overflow, for example bitset::to_ulong (slide 27)." },
  { id: "underflow_error", parent: "runtime_error", header: "<stdexcept>", who: "arithmetic underflow (in the standard, not on the slide)." },
];
function exceptionTree(box, cfg) {
  box.append(el("h4", null, cfg.title || "The std::exception family: who throws what, and which catch takes it"));
  const byId = Object.fromEntries(ET_NODES.map((n) => [n.id, n]));
  let sel = String(cfg.select || "length_error").replace(/^std::/, "");
  if (!byId[sel]) sel = "length_error";
  box.append(note("Click a class. Its ancestors light up: a <code>catch (T&)</code> for any of them takes this exception, which is why <code>catch (std::exception&)</code> is the usual last resort before <code>catch (...)</code>."));
  const svg = svgEl("svg", { viewBox: "0 0 640 332", class: "curve-svg net-svg", role: "group", "aria-label": "std::exception class tree" });
  const info = el("div", "stat-grid"), text = el("div", "stat-steps"), codeWrap = el("div");
  box.append(svg, info, text, codeWrap);
  // layout: three columns, leaves get rows top to bottom
  const leaves = ET_NODES.filter((n) => !ET_NODES.some((m) => m.parent === n.id));
  const row = {}; leaves.forEach((n, i) => { row[n.id] = i; });
  const kidsOf = (id) => ET_NODES.filter((n) => n.parent === id);
  const rowOf = (id) => (row[id] != null ? row[id] : kidsOf(id).map((c) => rowOf(c.id)).reduce((a, b) => a + b, 0) / kidsOf(id).length);
  const depth = (id) => (byId[id].parent ? 1 + depth(byId[id].parent) : 0);
  const COL = [{ x: 8, w: 118 }, { x: 212, w: 150 }, { x: 440, w: 150 }], RH = 26, H = 20;
  const geo = {}; ET_NODES.forEach((n) => { const c = COL[depth(n.id)]; geo[n.id] = { x: c.x, y: 8 + rowOf(n.id) * RH, w: c.w }; });
  const ancestors = (id) => { const a = []; let p = byId[id].parent; while (p) { a.push(p); p = byId[p].parent; } return a; };
  function draw() {
    svg.innerHTML = "";
    const anc = ancestors(sel);
    for (const n of ET_NODES) {
      if (!n.parent) continue;
      const g = geo[n.id], pg = geo[n.parent];
      const on = anc.includes(n.parent) && (n.id === sel || anc.includes(n.id));
      svg.append(svgEl("polyline", { points: `${pg.x + pg.w},${pg.y + H / 2} ${g.x - 14},${pg.y + H / 2} ${g.x - 14},${g.y + H / 2} ${g.x},${g.y + H / 2}`, fill: "none", stroke: on ? "var(--hl)" : "var(--rule-strong)", "stroke-width": on ? 2 : 1 }));
    }
    for (const n of ET_NODES) {
      const g = geo[n.id], isSel = n.id === sel, isAnc = anc.includes(n.id);
      const node = svgEl("g", { class: "cpp3-node", role: "button", tabindex: 0, "aria-label": `std::${n.id}`, "aria-pressed": isSel ? "true" : "false" });
      node.append(svgEl("rect", { x: g.x, y: g.y, width: g.w, height: H, rx: 5, fill: isSel ? "var(--hl-soft)" : "var(--paper)", stroke: isSel || isAnc ? "var(--hl)" : "var(--rule-strong)", "stroke-width": isSel ? 2 : 1 }));
      node.append(svgEl("text", { x: g.x + g.w / 2, y: g.y + 14, "text-anchor": "middle", "font-size": 11, fill: isSel ? "var(--hl)" : isAnc ? "var(--ink)" : "var(--ink-2)" }, n.id === "exception" ? "std::exception" : n.id));
      node.addEventListener("click", () => { sel = n.id; draw(); });
      node.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sel = n.id; draw(); } });
      svg.append(node);
    }
    const n = byId[sel];
    const chain = [sel, ...anc].map((id) => `std::${id}`);
    info.innerHTML = "";
    info.append(statCell("class", sel, "in namespace std"), statCell("header", n.header), statCell("derives from", anc.length ? anc[0] : "nothing: the root"), statCell("caught by", `${chain.length + 1} clauses`, chain.map((c) => `catch (${c}&)`).join(", ") + ", catch (...)"));
    const sib = ET_NODES.filter((m) => m.parent === n.parent && m.id !== sel && n.parent);
    text.innerHTML = `<div class="step final"><b>std::${sel}</b>: ${esc(n.who)}</div>` +
      (anc.length ? `<div class="step">Catch it by reference as itself or as any highlighted ancestor; the most specific clause must come first (guideline 3). ${sib.length ? `A <code>catch (std::${sib[0].id}&)</code> would <b>not</b> take it: siblings share a base but not each other.` : ""}</div>` : `<div class="step">Catching <code>std::exception&</code> takes every class in this tree, and the virtual <code>what()</code> still reports the derived message (exception.cpp).</div>`) +
      (n.parent === "logic_error" || n.parent === "runtime_error" || sel === "logic_error" || sel === "runtime_error" ? `<div class="step">Constructed with a message: <code>throw std::${sel}("...")</code>; <code>what()</code> returns that text. Define your own by deriving: <code>struct my_error : std::${sel} { using std::${sel}::${sel}; };</code></div>` : "");
    const ctor = sel === "exception" || sel.startsWith("bad_") ? `std::${sel}()` : `std::${sel}("message")`;
    codeWrap.innerHTML = "";
    codeWrap.append(codeBox([`#include ${n.header}`, "try {", `    throw ${ctor};`, "}", ...chain.map((c, i) => `catch (${c}& e) { cout << e.what(); }${i === 0 ? "   // exact type" : i === chain.length - 1 ? "   // the root: last resort before catch (...)" : "   // a base: also matches"}`)], "oop-code", (i) => (i === 4 ? "cur" : i > 4 ? "cpp3-dead" : "")));
  }
  draw();
}

// =====================================================================================
// widget: coupling-graph
// =====================================================================================
const CG_FEATURES = [
  { id: "save", name: "Save/load", shape: "circle", color: "var(--blue)" },
  { id: "char", name: "Character creation", shape: "triangle", color: "var(--hl)" },
  { id: "screen", name: "Screens", shape: "rect", color: "var(--green)" },
  { id: "state", name: "Game state", shape: "square", color: "var(--purple)" },
];
// The slide's left picture, extended to four chips per feature.
const CG_SCATTERED = [["save", "char", "screen", "save"], ["state", "screen", "state", "char"], ["save", "state", "char", "screen"], ["save", "char", "screen", "state"]];
const CG_ORGANISED = [["save", "save", "save", "save"], ["state", "state", "state", "state"], ["screen", "screen", "screen", "screen"], ["char", "char", "char", "char"]];
function couplingGraph(box, cfg) {
  box.append(el("h4", null, cfg.title || "Coupling and cohesion: the same sixteen features in four modules"));
  const MODS = [{ x: 40, y: 28 }, { x: 360, y: 28 }, { x: 40, y: 188 }, { x: 360, y: 188 }], MW = 240, MH = 120;
  let chips = [];
  const load = (layout) => { chips = []; layout.forEach((list, m) => list.forEach((f) => chips.push({ f, m }))); };
  load(cfg.mode === "organised" || cfg.mode === "organized" ? CG_ORGANISED : CG_SCATTERED);
  box.append(note("A line joins two modules whenever the same feature lives in both (they must call each other to finish the job). Drag a chip to another module, or click a chip and then a module. Scatter and Organise redraw slide 40's two pictures."));
  box.append(btnRow(["Scatter", "Organise"], (i) => { load(i ? CG_ORGANISED : CG_SCATTERED); selected = null; draw(); }, cfg.mode === "organised" || cfg.mode === "organized" ? 1 : 0));
  const svg = svgEl("svg", { viewBox: "0 0 640 350", class: "curve-svg net-svg", role: "group", "aria-label": "four modules holding feature chips" });
  const grid = el("div", "stat-grid"), caption = el("div", "stat-steps");
  box.append(svg, grid, caption);
  let selected = null, drag = null;
  const pt = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const moduleAt = (x, y) => MODS.findIndex((m) => x >= m.x && x <= m.x + MW && y >= m.y && y <= m.y + MH);
  function shape(f, cx, cy, extra = {}) {
    const F = CG_FEATURES.find((q) => q.id === f), s = 10, a = { fill: "var(--paper-3)", stroke: F.color, "stroke-width": 2, ...extra };
    if (F.shape === "circle") return svgEl("circle", { cx, cy, r: s, ...a });
    if (F.shape === "square") return svgEl("rect", { x: cx - s, y: cy - s, width: 2 * s, height: 2 * s, ...a });
    if (F.shape === "rect") return svgEl("rect", { x: cx - 14, y: cy - 7, width: 28, height: 14, ...a });
    return svgEl("polygon", { points: `${cx},${cy - s} ${cx + s + 1},${cy + s - 1} ${cx - s - 1},${cy + s - 1}`, ...a });
  }
  function draw() {
    svg.innerHTML = "";
    const inMod = MODS.map((_, m) => chips.filter((c) => c.m === m));
    const feats = inMod.map((list) => [...new Set(list.map((c) => c.f))]);
    // links
    let links = 0;
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
      const shared = feats[a].filter((f) => feats[b].includes(f));
      shared.forEach((f, i) => {
        const F = CG_FEATURES.find((q) => q.id === f), off = (i - (shared.length - 1) / 2) * 7;
        const A = MODS[a], B = MODS[b];
        const horiz = A.y === B.y, vert = A.x === B.x;
        let x1, y1, x2, y2;
        if (horiz) { x1 = A.x + MW; y1 = A.y + MH / 2 + off; x2 = B.x; y2 = y1; }
        else if (vert) { x1 = A.x + MW / 2 + off; y1 = A.y + MH; x2 = x1; y2 = B.y; }
        else { x1 = A.x + MW / 2 + off; y1 = A.y + (A.y < B.y ? MH : 0); x2 = B.x + MW / 2 + off; y2 = B.y + (A.y < B.y ? 0 : MH); }
        svg.append(svgEl("line", { x1, y1, x2, y2, stroke: F.color, "stroke-width": 1.5, opacity: 0.8 }));
        links++;
      });
    }
    // modules
    MODS.forEach((m, i) => {
      const g = svgEl("g", { role: "button", tabindex: 0, "aria-label": `module ${i + 1}, ${feats[i].length} feature${feats[i].length === 1 ? "" : "s"}` });
      g.append(svgEl("rect", { x: m.x, y: m.y, width: MW, height: MH, rx: 6, fill: "var(--paper)", stroke: selected != null ? "var(--hl)" : feats[i].length === 1 ? "var(--green)" : feats[i].length >= 3 ? "var(--red)" : "var(--rule-strong)", "stroke-dasharray": selected != null ? "6 4" : "" }));
      g.append(svgEl("text", { x: m.x + 8, y: m.y + 15, "font-size": 11.5, fill: "var(--ink)" }, `Module ${i + 1}`));
      g.append(svgEl("text", { x: m.x + MW - 8, y: m.y + 15, "text-anchor": "end", "font-size": 11, fill: feats[i].length === 1 ? "var(--green)" : feats[i].length >= 3 ? "var(--red)" : "var(--ink-dim)" }, feats[i].length === 0 ? "empty" : `${feats[i].length} feature${feats[i].length === 1 ? "" : "s"}: ${feats[i].length === 1 ? "high cohesion" : feats[i].length >= 3 ? "low cohesion" : "mixed"}`));
      const drop = () => { if (selected != null) { chips[selected].m = i; selected = null; draw(); } };
      g.addEventListener("click", drop);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); drop(); } });
      svg.append(g);
    });
    // chips
    chips.forEach((c, idx) => {
      const m = MODS[c.m], k = inMod[c.m].indexOf(c), col = k % 6, rowI = Math.floor(k / 6);
      c.cx = m.x + 26 + col * 38; c.cy = m.y + 42 + rowI * 32;
      const F = CG_FEATURES.find((q) => q.id === c.f);
      const g = svgEl("g", { class: "cpp3-chip" + (selected === idx ? " sel" : ""), role: "button", tabindex: 0, "aria-label": `${F.name} chip in module ${c.m + 1}`, "aria-pressed": selected === idx ? "true" : "false" });
      g.append(shape(c.f, c.cx, c.cy, selected === idx ? { fill: F.color } : {}));
      g.append(svgEl("title", {}, F.name));
      g.addEventListener("pointerdown", (e) => { e.preventDefault(); const p = pt(e); drag = { idx, x0: p.x, y0: p.y, moved: false, g }; g.setPointerCapture(e.pointerId); });
      g.addEventListener("pointermove", (e) => { if (!drag || drag.idx !== idx) return; const p = pt(e); if (Math.hypot(p.x - drag.x0, p.y - drag.y0) > 4) drag.moved = true; if (drag.moved) g.setAttribute("transform", `translate(${p.x - drag.x0},${p.y - drag.y0})`); });
      const finish = (e) => { if (!drag || drag.idx !== idx) return; const p = pt(e); const d = drag; drag = null; if (d.moved) { const t = moduleAt(p.x, p.y); if (t >= 0) c.m = t; selected = null; } else selected = selected === idx ? null : idx; draw(); };
      g.addEventListener("pointerup", finish);
      g.addEventListener("pointercancel", () => { drag = null; draw(); });
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selected = selected === idx ? null : idx; draw(); } });
      svg.append(g);
    });
    // legend
    CG_FEATURES.forEach((F, i) => { const x = [30, 150, 380, 500][i]; svg.append(shape(F.id, x, 334)); svg.append(svgEl("text", { x: x + 20, y: 338, "font-size": 11, fill: "var(--ink-2)" }, F.name)); });
    // stats
    const perMod = feats.map((f) => f.length);
    const allOne = perMod.every((n) => n === 1), low = perMod.filter((n) => n >= 2).length;
    grid.innerHTML = "";
    grid.append(statCell("cross-module links", String(links), links === 0 ? "no feature is split across modules: low coupling" : `${links === 1 ? "one feature is" : "features are"} split across modules: ${links >= 6 ? "high" : "some"} coupling`),
      statCell("features per module", perMod.join(" · "), allOne ? "each module does one thing: high cohesion" : `${low} module${low === 1 ? "" : "s"} mix${low === 1 ? "es" : ""} several jobs: low cohesion`),
      statCell("verdict", allOne && links === 0 ? "High cohesion and low coupling" : low >= 3 && links >= 6 ? "Low cohesion and high coupling" : "in between"));
    caption.innerHTML = allOne && links === 0
      ? `<div class="step final"><b>High cohesion and low coupling</b> (slide 40, right). Each module can be understood, named, tested and reused on its own; changing how saving works touches one module.</div>`
      : `<div class="step error"><b>${low >= 3 && links >= 6 ? "Low cohesion and high coupling" : "Still some coupling"}</b> (slide 40, left). A change to saving ripples through ${feats.filter((f) => f.includes("save")).length} module${feats.filter((f) => f.includes("save")).length === 1 ? "" : "s"}; no module has a name that says what it does. Move each shape into a module of its own kind.</div>`;
  }
  draw();
}

// =====================================================================================
// widget: solid-spotter
// =====================================================================================
const SP_PRINCIPLES = [["S", "Single Responsibility"], ["O", "Open/Closed"], ["L", "Liskov Substitution"], ["I", "Interface Segregation"], ["D", "Dependency Inversion"], ["Demeter", "Law of Demeter"]];
const SP_CASES = {
  srp: {
    title: "User does everything", answer: "S",
    code: ["class User {", "    User(string username, string password, string name, string email) {", "        this->username = username;  this->password = password;", "        this->name = name;          this->email = email;", "        this->database = MyDatabase();", "    }", "    void post_to_forum(string message, string subject) {", "        Post post = Post(subject, message, username);", "        database.add_simple_post(post);", "    }", "};"],
    hint: "Count the reasons this class would have to change.",
    fix: "User keeps only the four fields; a new PostWriter(MyDatabase*) owns postToForum(User&, message, subject). Each class now has one reason to change.",
    uml(svg) {
      const u = umlBox(svg, 30, 20, 170, "User", ["username, password", "name, email"]);
      const p = umlBox(svg, 30, 130, 170, "Post", ["subject, message, user"]);
      const w = umlBox(svg, 330, 20, 250, "PostWriter", ["database : MyDatabase*", "postToForum(User&, message, subject)"]);
      const d = umlBox(svg, 330, 130, 250, "MyDatabase", ["addSimplePost(Post)"]);
      umlArrow(svg, w.x, w.y + 20, u.r, u.y + 20, "dep");
      umlArrow(svg, w.x, w.b - 10, p.r, p.y + 14, "dep");
      umlArrow(svg, w.cx, w.b, d.cx, d.y, "assoc");
      umlArrow(svg, d.x, d.cy, p.r, p.cy, "dep");
      return 200;
    },
  },
  ocp: {
    title: "UIWidget with a type string and an if-chain", answer: "O",
    code: ["class UIWidget {", "    string type;", "    void draw() {", '        if (type == "Button")        // complicated button draw logic', '        else if (type == "Text Box")   // ...', '        else if (type == "ScrollBar")  // ...', '        else if (type == "Label")      // ...', "        else                           // generic panel", "    }", "};"],
    hint: "What happens to this function every time a new widget kind is invented?",
    fix: "UIWidget declares virtual void draw() = 0; UIButton, UITextBox and UIScrollBar each override draw(). A new widget is a new class, not a new else-if: closed for modification, open for extension (and each class now follows SRP too).",
    uml(svg) {
      const b = umlBox(svg, 230, 10, 180, "UIWidget", ["+ draw() = 0"], { stereo: "interface" });
      const kids = ["UIButton", "UITextBox", "UIScrollBar"].map((n, i) => umlBox(svg, 40 + i * 200, 120, 160, n, ["+ draw() override"]));
      kids.forEach((k) => umlArrow(svg, k.cx, k.y, b.cx + (k.cx - b.cx) * 0.3, b.b, "real"));
      return 190;
    },
  },
  lsp: {
    title: "Canvas keeps a pointer to every subtype", answer: "L",
    code: ["class Canvas {", "    UIPanel* panel;", "    UIScrollbar* scrollbar;", "    UIButton* button;", "    Canvas(UIPanel* panel, UIScrollbar* scrollbar, UIButton* button) { ... }", "    void draw_screen() {", "        panel->draw();", "        scrollbar->draw();", "        button->draw();", "    }", "};"],
    hint: "Why inherit if you have to keep an explicit reference to each subtype?",
    fix: "Canvas holds vector<UIWidget*> and writes for (UIWidget* w : ui_widgets) w->draw(); every derived widget is substitutable for its base and polymorphism picks the derived draw() at run time.",
    uml(svg) {
      const c = umlBox(svg, 20, 30, 230, "Canvas", ["ui_widgets : vector<UIWidget*>", "+ draw_screen()"]);
      const b = umlBox(svg, 340, 20, 170, "UIWidget", ["+ draw() = 0"], { stereo: "interface" });
      umlArrow(svg, c.r, c.y + 30, b.x, b.y + 30, "assoc", "1..*");
      const kids = ["UIPanel", "UIScrollbar", "UIButton"].map((n, i) => umlBox(svg, 280 + i * 120, 130, 110, n, ["+ draw()"]));
      kids.forEach((k) => umlArrow(svg, k.cx, k.y, b.cx + (k.cx - b.cx) * 0.3, b.b, "real"));
      return 195;
    },
  },
  isp: {
    title: "Animal makes every animal fly", answer: "I",
    code: ["class Animal {", "    virtual void breathe() { /* common */ }", "    virtual void eat()     { /* common */ }", "    virtual void walk() = 0;", "    virtual void swim() = 0;", "    virtual void fly()  = 0;", "};", "class Human : public Animal { /* must override fly() */ };", "class Fish  : public Animal { /* can walk? */ };"],
    hint: "Which pure virtual functions is Human forced to implement although it never uses them?",
    fix: "Animal keeps breathe() and eat(); Walkable, Swimmable and Flyable become separate interfaces, and class Human : public Animal, public Walkable, public Swimmable inherits only what it needs (SRP for interfaces).",
    uml(svg) {
      const a = umlBox(svg, 20, 10, 140, "Animal", ["+ breathe()", "+ eat()"]);
      const w = umlBox(svg, 190, 10, 130, "Walkable", ["+ walk() = 0"], { stereo: "interface" });
      const s = umlBox(svg, 340, 10, 130, "Swimmable", ["+ swim() = 0"], { stereo: "interface" });
      umlBox(svg, 490, 10, 130, "Flyable", ["+ fly() = 0"], { stereo: "interface" });
      const h = umlBox(svg, 200, 130, 200, "Human", ["+ walk() override", "+ swim() override"]);
      umlArrow(svg, h.x + 20, h.y, a.cx, a.b, "gen");
      umlArrow(svg, h.cx - 20, h.y, w.cx, w.b, "real");
      umlArrow(svg, h.cx + 40, h.y, s.cx, s.b, "real");
      return 200;
    },
  },
  dip: {
    title: "UI reads straight from a TextFile", answer: "D",
    code: ["class UI {", "    TextFile textFile;          // a concrete low-level module", "    void refresh() {", "        auto rows = textFile.read();", "        ...", "    }", "};", "// years later: \"switch to an encrypted JSON file or a SQLite database\"", "// → every UI class that touches TextFile must be edited"],
    hint: "A high-level module names a low-level detail. What should both depend on instead?",
    fix: "UI depends on the DataSource interface (retrieve, update, search, delete) and TextFile, SQLiteDB and JSONFile implement it: both the high-level and the low-level module depend on the abstraction, and either side can be swapped.",
    uml(svg) {
      const u = umlBox(svg, 10, 40, 200, "UI", ["dataSource : DataSource&"]);
      const d = umlBox(svg, 250, 10, 190, "DataSource", ["+ retrieve()  + update()", "+ search()    + delete()"], { stereo: "interface" });
      umlArrow(svg, u.r, u.cy, d.x, d.cy, "assoc");
      const kids = ["TextFile", "SQLiteDB", "JSONFile"].map((n, i) => umlBox(svg, 200 + i * 150, 130, 130, n, ["+ retrieve() ..."]));
      kids.forEach((k) => umlArrow(svg, k.cx, k.y, d.cx + (k.cx - d.cx) * 0.3, d.b, "real"));
      return 195;
    },
  },
  demeter: {
    title: "Cashier reaches into the Customer's Wallet", answer: "Demeter",
    code: ["class Cashier {", "    Customer customer;", "    void takeMoney(int amount) {", "        money = customer.getWallet().getMoney(amount);   // #BAD", "    }", "};"],
    hint: "Count the classes Cashier must know about to write that one line.",
    fix: "Cashier asks its neighbour: money = customer.getMoney(amount); Customer forwards to its own wallet: return wallet.getMoney(amount). getWallet() disappears; Cashier no longer knows Wallet exists.",
    uml(svg) {
      const c = umlBox(svg, 10, 20, 190, "Cashier", ["- customer : Customer", { text: "+ requestMoney(amount)", hl: true }], { stroke: "var(--green)" });
      const u = umlBox(svg, 230, 20, 200, "Customer", ["- wallet : Wallet", { text: "+ getWallet() : Wallet", strike: true }, { text: "+ getMoney(amount) : int", hl: true }], { stroke: "var(--red)" });
      const w = umlBox(svg, 460, 20, 170, "Wallet", ["- money : int", "+ getMoney(amount) : int"], { stroke: "var(--blue)" });
      umlArrow(svg, c.r, c.y + 30, u.x, u.y + 30, "assoc");
      umlArrow(svg, u.r, u.y + 30, w.x, w.y + 30, "assoc");
      return 110;
    },
  },
};
function solidSpotter(box, cfg) {
  box.append(el("h4", null, cfg.title || "Spot the violated principle"));
  let keys = (Array.isArray(cfg.cases) ? cfg.cases : Object.keys(SP_CASES)).map((k) => String(k).toLowerCase()).filter((k) => SP_CASES[k]);
  if (!keys.length) keys = Object.keys(SP_CASES);
  if (cfg.shuffle) for (let i = keys.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [keys[i], keys[j]] = [keys[j], keys[i]]; }
  box.append(note("Each case is one of the deck's own examples. Pick the principle it breaks; Reveal shows the slide's fix as a class diagram."));
  const head = el("div", "pv-title"), codeWrap = el("div"), hint = el("p", "widget-note");
  const choices = el("div", "cpp3-choices"), fb = el("div"), nav = el("div", "pv-ctl"), reveal = el("div"), score = el("span", "scrub-pos");
  const prevB = button("← previous", "reset-btn", () => show(k - 1)), nextB = button("next case →", "reset-btn", () => show(k + 1)), revealB = button("Reveal", "reset-btn", () => { state[k].revealed = true; paint(); });
  nav.append(prevB, revealB, nextB, score);
  box.append(head, codeWrap, hint, choices, fb, nav, reveal);
  const state = keys.map(() => ({ picks: [], revealed: false }));
  let k = 0;
  function show(i) { k = Math.max(0, Math.min(keys.length - 1, i)); paint(); }
  function paint() {
    const c = SP_CASES[keys[k]], st = state[k];
    head.textContent = `Case ${k + 1} of ${keys.length}: ${c.title}`;
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(c.code));
    hint.textContent = c.hint;
    choices.innerHTML = "";
    const solved = st.picks.includes(c.answer);
    for (const [key, name] of SP_PRINCIPLES) {
      const b = el("button", "viz-btn" + (st.picks.includes(key) ? (key === c.answer ? " right" : " wrong") : ""), `${key}${key === "Demeter" ? "" : " · " + name}`);
      b.setAttribute("aria-label", name);
      b.disabled = solved || st.revealed;
      b.addEventListener("click", () => { if (!st.picks.includes(key)) st.picks.push(key); paint(); });
      choices.append(b);
    }
    fb.innerHTML = "";
    const last = st.picks[st.picks.length - 1];
    if (solved) fb.append(verdict(true, `<b>${SP_PRINCIPLES.find((p) => p[0] === c.answer)[1]}.</b>${st.picks.length === 1 ? " First try." : ` Found after ${st.picks.length} picks.`} Reveal shows the slide's fix.`));
    else if (last) fb.append(verdict(false, `Not ${SP_PRINCIPLES.find((p) => p[0] === last)[1]}. Look again at the hint, or Reveal.`));
    reveal.innerHTML = "";
    if (st.revealed) {
      reveal.append(verdict(true, `<b>${SP_PRINCIPLES.find((p) => p[0] === c.answer)[1]}${c.answer === "Demeter" ? "" : " (" + c.answer + ")"}.</b> ${esc(c.fix)}`));
      const svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg", role: "img", "aria-label": "the slide's fix as a class diagram" });
      const h = c.uml(svg);
      svg.setAttribute("viewBox", `0 0 640 ${h}`);
      reveal.append(svg);
    }
    prevB.disabled = k === 0; nextB.disabled = k === keys.length - 1; revealB.disabled = st.revealed;
    const first = state.filter((s, i) => s.picks[0] === SP_CASES[keys[i]].answer).length, tried = state.filter((s) => s.picks.length).length;
    score.textContent = tried ? `first try: ${first} of ${tried}` : "";
  }
  paint();
}

// =====================================================================================
// widget: demeter-chain
// =====================================================================================
const DC_PRESETS = ["customer.getWallet().getMoney(amount)", "customer.getMoney(amount)", "obj.getX().getY().getZ().doSomething()", "MyCharacterUI.GetCharacterData().CreateCharacter().Save()", "characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter())"];
/** Parses `recv.m1(args).m2(args)…`; args that are themselves chains are parsed recursively. */
function dcParse(src) {
  let s = String(src).trim().replace(/;$/, "").replace(/^[\w:<>]+\s+\w+\s*=\s*/, "").replace(/^\w+\s*=\s*/, "");
  let i = 0;
  const ident = () => { const m = /^[A-Za-z_]\w*/.exec(s.slice(i)); if (!m) return null; i += m[0].length; return m[0]; };
  const receiver = ident();
  if (!receiver) return null;
  const hops = [];
  while (i < s.length) {
    if (s[i] === "-" && s[i + 1] === ">") i += 2; else if (s[i] === ".") i += 1; else return null;
    const name = ident();
    if (!name) return null;
    let args = null;
    if (s[i] === "(") {
      let depth = 0, j = i;
      for (; j < s.length; j++) { if (s[j] === "(") depth++; else if (s[j] === ")") { depth--; if (depth === 0) break; } }
      if (depth !== 0) return null;
      args = s.slice(i + 1, j); i = j + 1;
    }
    const argList = args == null || !args.trim() ? [] : splitTop(args);
    hops.push({ name, args: args == null ? null : args.trim(), argChains: argList.map((a) => (/^[A-Za-z_]\w*\s*(\.|->)/.test(a) ? dcParse(a) : null)).filter(Boolean) });
  }
  return { receiver, hops };
  function splitTop(t) { const parts = []; let d = 0, cur = ""; for (const ch of t) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && d === 0) { parts.push(cur.trim()); cur = ""; } else cur += ch; } if (cur.trim()) parts.push(cur.trim()); return parts; }
}
const dcUpper = (w) => w.charAt(0).toUpperCase() + w.slice(1);
const dcLower = (w) => w.charAt(0).toLowerCase() + w.slice(1);
/** The class a getter-like call returns, guessed from its name; null when the name says nothing. */
function dcClassOf(name) { const m = /^(?:get|Get|create|Create|fetch|find|make)([A-Z]\w*)$/.exec(name); return m ? m[1] : null; }
function dcMemberOf(name) { const c = dcClassOf(name); return c ? dcLower(c) : name; }
function demeterChain(box, cfg) {
  box.append(el("h4", null, cfg.title || "Law of Demeter: count the hops in a call chain"));
  box.append(note("A unit should only talk to its friends: the first object it calls is a neighbour, anything reached through a return value is a stranger. Type a chain or pick one of the slide's."));
  let chain = cfg.chain || DC_PRESETS[0];
  if (cfg.presets !== false) box.append(btnRow(DC_PRESETS, (i) => { chain = DC_PRESETS[i]; input.value = chain; draw(); }, DC_PRESETS.indexOf(chain)));
  const input = document.createElement("input");
  input.className = "comp-input"; input.spellcheck = false; input.value = chain; input.setAttribute("aria-label", "call chain");
  input.addEventListener("input", () => { chain = input.value; draw(); });
  const svg = svgEl("svg", { viewBox: "0 0 640 110", class: "curve-svg net-svg", role: "img", "aria-label": "the classes reached by the chain" });
  const grid = el("div", "stat-grid"), out = el("div"), codeWrap = el("div");
  box.append(input, svg, grid, out, codeWrap);
  function draw() {
    const p = dcParse(chain);
    svg.innerHTML = ""; grid.innerHTML = ""; out.innerHTML = ""; codeWrap.innerHTML = "";
    if (!p || !p.hops.length) { out.append(verdict(false, "Write a call chain such as <code>customer.getWallet().getMoney(amount)</code>: an object, then one or more <code>.call()</code>s.")); return; }
    const C0 = dcUpper(p.receiver);
    // classes along the chain: C0 is the friend; the result of each hop but the last is a stranger
    const classes = [{ name: C0, role: "friend", via: p.receiver }];
    p.hops.forEach((h, i) => { if (i < p.hops.length - 1) classes.push({ name: dcClassOf(h.name) || `(what ${h.name}() returns)`, role: "stranger", via: h.name + "()" }); });
    const nested = p.hops.flatMap((h) => h.argChains).filter((c) => c.hops.length >= 2);
    const hops = p.hops.length, strangers = classes.filter((c) => c.role === "stranger");
    // picture
    const n = classes.length + 1, w = Math.min(130, (640 - 20) / n - 20), step = (640 - 20) / n;
    const boxes = [{ name: "caller", role: "caller" }, ...classes].map((c, i) => umlBox(svg, 10 + i * step + (step - w) / 2, 28, w, c.name.length > 16 ? c.name.slice(0, 15) + "…" : c.name, [], { stroke: c.role === "friend" ? "var(--green)" : c.role === "stranger" ? "var(--red)" : "var(--rule-strong)", bold: c.role === "stranger" }));
    boxes.forEach((b, i) => {
      if (i === 0) { svg.append(svgEl("text", { x: b.cx, y: 18, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, p.receiver === "customer" ? "Cashier" : p.receiver === "characterUI" ? "Game" : "the caller")); return; }
      const c = classes[i - 1];
      umlArrow(svg, boxes[i - 1].r, boxes[i - 1].cy, b.x, b.cy, "assoc");
      svg.append(svgEl("text", { x: b.cx, y: 18, "text-anchor": "middle", "font-size": 10.5, fill: c.role === "friend" ? "var(--green)" : "var(--red)" }, c.role === "friend" ? "friend (hop 1)" : `stranger (hop ${i})`));
      svg.append(svgEl("text", { x: b.cx, y: 72, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, c.via.length > 20 ? c.via.slice(0, 19) + "…" : c.via));
    });
    svg.append(svgEl("text", { x: 320, y: 98, "text-anchor": "middle", "font-size": 11, fill: hops >= 2 ? "var(--red)" : "var(--green)" }, hops >= 2 ? `${hops} hops: the caller reaches ${strangers.length} stranger${strangers.length === 1 ? "" : "s"}` : "1 hop: talks to a neighbour only"));
    grid.append(statCell("hops", String(hops), p.hops.map((h) => h.name + "()").join(" → ")), statCell("classes the caller must know", String(classes.length + nested.reduce((a, c) => a + c.hops.length - 1, 0)), classes.map((c) => c.name).join(", ")), statCell("strangers", String(strangers.length + nested.reduce((a, c) => a + c.hops.length - 1, 0)), strangers.length ? strangers.map((s) => s.name).join(", ") : "none"));
    const last = p.hops[p.hops.length - 1];
    const slide97 = p.receiver === "characterUI" && p.hops[0].name === "getCharacterCreator";
    if (hops === 1 && !nested.length) {
      out.append(verdict(true, `<b>Fine by Demeter.</b> <code>${esc(p.receiver)}</code> is a neighbour (a member or parameter), and the caller only uses <code>${esc(C0)}</code>'s own public members. Several calls on the same neighbour are still one hop each.`));
      codeWrap.append(codeBox([`// in the caller`, `${chain.trim().replace(/;$/, "")};   // #OK: one hop`]));
      return;
    }
    out.append(verdict(false, `<b>Train wreck: ${hops} hops${nested.length ? ` (plus a ${nested[0].hops.length}-hop chain inside the argument)` : ""}.</b> To write this line the caller must know ${classes.map((c) => `<code>${esc(c.name)}</code>`).join(", ")}${nested.length ? " and more inside the argument" : ""}; only <code>${esc(C0)}</code> is a friend. Any change to <code>${esc(last.name)}()</code>${strangers.length ? `, which lives all the way in <code>${esc(strangers[strangers.length - 1].name)}</code>,` : ""} ripples back to the caller (slide 94: classes should not have knowledge of public members several classes away).`));
    if (slide97) {
      codeWrap.append(codeBox(["// slide 98: no getter fixes this one; restructure so Game owns the CharacterCreator itself", "class Game {", "    void createCharacter() {", "        data = characterUI.getData();                        // one hop", "        characterCreator.initiateCharacterCreation(data);   // one hop", "    }", "};", "class CharacterCreationUI { Data getData() { return characterData; } };", "class CharacterCreator {", "    void initiateCharacterCreation(Data data) {", "        my_char = createCharacter(data);", "        saveWriter.save(my_char);                            // its own neighbour", "    }", "};"]));
      return;
    }
    // generic delegating rewrite: the caller asks its neighbour; each class forwards one hop to its own member
    const args = last.args == null ? "" : last.args;
    const wallet = p.receiver === "customer" && last.name === "getMoney";
    const retT = wallet ? "int " : "auto ", argDecl = wallet ? "int amount" : args ? args.split(",").map((a) => "auto " + a.trim()).join(", ") : "";
    const lines = ["// in the caller", `${p.receiver === "customer" ? "money = " : ""}${p.receiver}.${last.name}(${args});   // #OK: one hop`];
    for (let i = 0; i < p.hops.length - 1; i++) {
      const cls = classes[i].name, member = dcMemberOf(p.hops[i].name);
      lines.push(`// in ${cls}: forward to its own ${member}`, `${retT}${last.name}(${argDecl}) { return ${member}.${last.name}(${args}); }`);
    }
    codeWrap.append(codeBox(lines));
    out.append(note(wallet ? "Slide 95: <code>getWallet()</code> is removed from Customer; Cashier calls <code>customer.getMoney(amount)</code> and Customer answers from its own wallet. Classes should have knowledge of public members of <b>neighbouring</b> classes only." : "Each forwarding method is one hop into the class's own member, so no class reaches past its neighbour. The slides call this a suggestion as much as a law: it is hard to keep everywhere."));
  }
  draw();
}

export const WIDGETS = {
  "catch-matcher": catchMatcher,
  "unwind-stepper": unwindStepper,
  "exception-tree": exceptionTree,
  "coupling-graph": couplingGraph,
  "solid-spotter": solidSpotter,
  "demeter-chain": demeterChain,
};
