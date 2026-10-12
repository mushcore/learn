// Interactive STL widgets for COMP 3522 Week 6: a container picker (slide 18 categories, slide 25
// adaptors), the begin/end walk (slides 58-63), the iterator-kind operation tables (slides 64-77),
// a strict-weak-ordering checker (slides 32-36), a map/multimap insert visualizer (map.cpp,
// multimap.cpp) and a stepper through the slide-89 partition implementation (slides 86-101).
import { el, esc, btnRow } from "./dom.js";
import { highlight } from "./highlight.js";

// ---------- shared helpers ----------
function note(text) { const p = el("p", "widget-note"); p.innerHTML = text; return p; }
function verdict(ok, text) { const d = el("div", "oop-verdict " + (ok ? "ok" : "bad")); d.innerHTML = text; return d; }
function toggle(label, checked, onChange) {
  const lab = el("label", "oop-toggle");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked; input.setAttribute("aria-label", label);
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, el("span", null, label));
  return { row: lab, input };
}
function select(label, options, value, onChange) {
  const row = el("div", "unit-row");
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", label);
  for (const [v, text] of options) { const o = document.createElement("option"); o.value = v; o.textContent = text; if (v === value) o.selected = true; sel.append(o); }
  sel.addEventListener("change", () => onChange(sel.value));
  row.append(el("label", null, label), sel);
  return { row, sel };
}
function textField(label, value, onChange, cls = "comp-input") {
  const input = document.createElement("input");
  input.type = "text"; input.className = cls; input.spellcheck = false; input.value = value; input.setAttribute("aria-label", label);
  input.addEventListener("input", () => onChange(input.value));
  return input;
}
function button(label, onClick, cls = "viz-btn") { const b = el("button", cls, label); b.addEventListener("click", onClick); return b; }
function codeBox(lines) {
  const box = el("div", "oop-code");
  lines.forEach((text, i) => {
    const row = el("div", "pl"); row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", text) || " "}</span>`;
    box.append(row);
  });
  return box;
}
function markLine(box, n) { box.querySelectorAll(".pl").forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === n)); }
function statCell(label, value, extra) {
  const c = el("div", "stat-cell"); c.append(el("div", "stat-label", label), el("div", "stat-value", value));
  if (extra) c.append(el("div", "stat-note", extra));
  return c;
}
/** Boxes in a row with named pointers drawn above them; `end` adds the dashed one-past cell. */
function cellRow(items, pointers, withEnd) {
  const row = el("div", "stl-cells");
  const all = items.map((it, i) => ({ ...it, i }));
  if (withEnd) all.push({ text: "one past", cls: "end", idx: "end()", i: items.length });
  for (const it of all) {
    const c = el("div", "stl-cell");
    const ptrs = el("div", "stl-ptrs");
    for (const p of pointers) if (p.idx === it.i) ptrs.append(el("span", "stl-ptr " + (p.cls || ""), p.name));
    c.append(ptrs, el("div", "stl-box " + (it.cls || ""), it.text), el("div", "stl-idx", it.idx != null ? it.idx : String(it.i)));
    row.append(c);
  }
  if (!all.length) row.append(el("div", "pv-empty", "empty"));
  return row;
}
const ORD = (n) => n + (n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th");
const parseInts = (s) => String(s).split(/[\s,;{}]+/).map((x) => x.trim()).filter((x) => /^-?\d+$/.test(x)).map(Number);

// =====================================================================
// container-picker: requirements -> the standard containers that satisfy them (slides 18, 25)
// =====================================================================
const REQS = [["order", "keeps insertion order"], ["sorted", "sorted automatically"], ["unique", "unique keys"], ["kv", "key → value"], ["dups", "duplicates allowed"], ["bothEnds", "fast push at both ends"], ["index", "random access by index"], ["lifo", "LIFO"], ["fifo", "FIFO"], ["maxFirst", "largest first"], ["hash", "hashed lookup"]];
const SEQ_SEARCH = "O(n) scan (slide 18 gives none: you specify the order)";
const ASSOC_SEARCH = "O(log n)";
const HASH_SEARCH = "O(1), O(n) worst case";
const CONTAINERS = [
  { name: "array", hdr: "<array>", cat: "sequence", has: ["order", "index", "dups"], search: SEQ_SEARCH, decl: "array<int, 5> a;", note: "fixed size" },
  { name: "vector", hdr: "<vector>", cat: "sequence", has: ["order", "index", "dups"], search: SEQ_SEARCH, decl: "vector<int> v;", note: "dynamic array, push_back at the end" },
  { name: "deque", hdr: "<deque>", cat: "sequence", has: ["order", "index", "dups", "bothEnds"], search: SEQ_SEARCH, decl: "deque<int> d;", note: "push_front and push_back" },
  { name: "list", hdr: "<list>", cat: "sequence", has: ["order", "dups", "bothEnds"], search: SEQ_SEARCH, decl: "list<int> l;", note: "doubly linked, no [i]" },
  { name: "forward_list", hdr: "<forward_list>", cat: "sequence", has: ["order", "dups"], search: SEQ_SEARCH, decl: "forward_list<int> f;", note: "singly linked, push_front only" },
  { name: "set", hdr: "<set>", cat: "associative", has: ["sorted", "unique"], search: ASSOC_SEARCH, decl: "set<int> s;", note: "elements const once inserted" },
  { name: "multiset", hdr: "<set>", cat: "associative", has: ["sorted", "dups"], search: ASSOC_SEARCH, decl: "multiset<int> ms;", note: "count(x) for duplicates" },
  { name: "map", hdr: "<map>", cat: "associative", has: ["sorted", "unique", "kv"], search: ASSOC_SEARCH, decl: "map<string, string> phonebook;", note: "value_type is pair<const Key, T>" },
  { name: "multimap", hdr: "<map>", cat: "associative", has: ["sorted", "dups", "kv"], search: ASSOC_SEARCH, decl: "multimap<string, string> phonebook;", note: "no operator[]; equal_range" },
  { name: "unordered_set", hdr: "<unordered_set>", cat: "unordered", has: ["unique", "hash"], search: HASH_SEARCH, decl: "unordered_set<int> us;", note: "needs std::hash<Key>" },
  { name: "unordered_multiset", hdr: "<unordered_set>", cat: "unordered", has: ["dups", "hash"], search: HASH_SEARCH, decl: "unordered_multiset<int> ums;" },
  { name: "unordered_map", hdr: "<unordered_map>", cat: "unordered", has: ["unique", "kv", "hash"], search: HASH_SEARCH, decl: "unordered_map<string, string> um;" },
  { name: "unordered_multimap", hdr: "<unordered_map>", cat: "unordered", has: ["dups", "kv", "hash"], search: HASH_SEARCH, decl: "unordered_multimap<string, string> umm;" },
  { name: "stack", hdr: "<stack>", cat: "adaptor", under: "deque", has: ["lifo", "dups"], search: "no search: push, pop, top only", decl: "stack<int> undo;", note: "default implementation is the deque" },
  { name: "queue", hdr: "<queue>", cat: "adaptor", under: "deque", has: ["fifo", "dups"], search: "no search: push, pop, front, back", decl: "queue<int> jobs;", note: "default implementation is also the deque" },
  { name: "priority_queue", hdr: "<queue>", cat: "adaptor", under: "vector", has: ["maxFirst", "dups"], search: "no search: top() is the largest", decl: "priority_queue<int> pq;", note: "default implementation is the vector" },
];
const CP_PRESETS = { "phonebook": ["kv", "unique", "sorted"], "sorted unique": ["sorted", "unique"], "undo stack": ["lifo"], "print queue": ["fifo"] };
function containerPicker(box, cfg) {
  box.append(el("h4", null, cfg.title || "Which container? Tick the requirements"));
  box.append(note("Slide 18: <b>sequence</b> containers keep the order you specify; <b>associative</b> containers sort automatically and search in O(log n); <b>unordered associative</b> containers hash and search in O(1), O(n) worst case. Slide 25: <b>adaptors</b> restrict a first-class container: stack and queue default to deque, priority_queue to vector."));
  const on = new Set(CP_PRESETS[cfg.preset] || []);
  const presetNames = Object.keys(CP_PRESETS);
  const reqRow = el("div", "stl-reqs");
  const checks = {};
  for (const [id, label] of REQS) { const t = toggle(label, on.has(id), (v) => { if (v) on.add(id); else on.delete(id); draw(); }); checks[id] = t.input; reqRow.append(t.row); }
  const presets = btnRow([...presetNames, "clear"], (i, l) => { on.clear(); for (const r of CP_PRESETS[l] || []) on.add(r); for (const id in checks) checks[id].checked = on.has(id); draw(); }, presetNames.indexOf(cfg.preset));
  const out = el("div", "table-wrap"), summary = el("div", "stat-steps");
  box.append(presets, reqRow, summary, out);
  function draw() {
    const want = [...on];
    const hits = CONTAINERS.filter((c) => want.every((r) => c.has.includes(r)));
    const wantText = want.length ? want.map((r) => `<b>${REQS.find((q) => q[0] === r)[1]}</b>`).join(" + ") : "nothing ticked: the whole catalogue";
    summary.innerHTML = `<div class="step ${hits.length ? "final" : "error"}">${wantText} → ${hits.length ? `${hits.length} container${hits.length === 1 ? "" : "s"}: ${hits.map((c) => `<code>${c.name}</code>`).join(", ")}` : "no standard container satisfies all of these at once (for example nothing is both sorted automatically and in insertion order); drop one requirement or combine two containers"}</div>`;
    let html = `<table class="stl-table"><thead><tr><th>container</th><th>category</th><th>search</th><th>declaration</th></tr></thead><tbody>`;
    for (const c of hits) {
      html += `<tr><td><code>${c.name}</code></td><td>${c.cat}${c.under ? ` on <code>${c.under}</code>` : ""}${c.note ? `<div class="stat-note">${c.note}</div>` : ""}</td><td>${c.search}</td><td><code>#include ${esc(c.hdr)}</code><br><code>${esc(c.decl)}</code></td></tr>`;
    }
    html += "</tbody></table>";
    out.innerHTML = hits.length ? html : "";
  }
  draw();
}

// =====================================================================
// iter-walk: the begin()/end() walk of slides 58-63, one loop pass per Step
// =====================================================================
function iterWalk(box, cfg) {
  box.append(el("h4", null, cfg.title || "begin() and end(): walk the loop one pass at a time"));
  const start = Array.isArray(cfg.values) ? cfg.values.map(Number).filter(Number.isFinite) : [9, 10, 11];
  const st = { v: start.slice(), pos: 0, pass: 0, done: false, out: [], log: [] };
  const code = codeBox([]);
  const ctl = el("div", "stl-inline");
  const field = textField("elements of intVec", st.v.join(", "), (s) => { st.v = parseInts(s); reset(); });
  const presets = btnRow(["{9}", "{9, 10, 11}", "{}"], (i) => { st.v = [[9], [9, 10, 11], []][i]; field.value = st.v.join(", "); reset(); }, [[9], [9, 10, 11], []].findIndex((p) => p.join() === st.v.join()));
  const stepB = button("Step (one pass)", step), runB = button("Run to the end", () => { while (!st.done) step(); }), resetB = button("Reset: itBegin = intVec.begin()", reset), derefB = button("Dereference end()", deref);
  ctl.append(el("span", "stat-label", "intVec ="), field, stepB, runB, resetB, derefB);
  const cells = el("div"), grid = el("div", "stat-grid"), msg = el("div", "pv-msg"), log = el("pre", "manip-code stl-log");
  box.append(note("Slide 60: <code>end()</code> returns an iterator pointing to a theoretical <b>one element past the last element</b>; it does not point to an element, so never dereference it. Each pass compares <code>itBegin != itEnd</code>, runs the loop body, then <code>itBegin++</code>."), presets, ctl, code, cells, grid, msg, log);
  function lines() {
    return [`vector<int> intVec = {${st.v.join(", ")}};`, "vector<int>::iterator itBegin = intVec.begin();", "vector<int>::iterator itEnd = intVec.end();", "", "for (itBegin; itBegin != itEnd; itBegin++)", "{", "    cout << *itBegin << endl;", "}"];
  }
  function rebuildCode() { code.innerHTML = ""; lines().forEach((t, i) => { const r = el("div", "pl"); r.dataset.line = String(i + 1); r.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", t) || " "}</span>`; code.append(r); }); }
  function say(s) { st.log.push(s); }
  function reset() { st.pos = 0; st.pass = 0; st.done = false; st.out = []; st.log = []; rebuildCode(); render(5, "itBegin = intVec.begin(), itEnd = intVec.end()" + (st.v.length ? `: itEnd is one past ${st.v[st.v.length - 1]}.` : ": the vector is empty, so begin() == end() already."), ""); }
  function step() {
    if (st.done) return;
    const n = st.v.length;
    st.pass++;
    if (st.pos < n) {
      const val = st.v[st.pos];
      say(`${ORD(st.pass)} pass: itBegin != itEnd, do loop code, output ${val}`);
      st.out.push(val); st.pos++;
      render(7, `${ORD(st.pass)} pass: itBegin != itEnd, so the loop body runs: cout << *itBegin prints ${val}; then itBegin++${st.pos === n ? " moves itBegin onto end()" : ""}.`, "");
    } else {
      say(`${ORD(st.pass)} pass: itBegin == itEnd, leave loop${n === 0 ? " (zero iterations)" : ""}`);
      st.done = true;
      render(5, `${ORD(st.pass)} pass: itBegin == itEnd, leave the loop. ${n === 0 ? "An empty vector: begin() == end() immediately, no iterations." : `Output: ${st.out.join(" ")}`}`, "end");
    }
  }
  function deref() {
    say("*itEnd   // UNDEFINED BEHAVIOUR");
    render(null, "<b>*itEnd is undefined behaviour.</b> end() is one past the last element and does not point to an element. No exception is thrown and nothing checks the bound: you read garbage, or the program crashes, or it seems to work until it does not.", "error");
  }
  function render(line, text, cls) {
    markLine(code, line);
    const n = st.v.length;
    cells.innerHTML = "";
    cells.append(cellRow(st.v.map((x, i) => ({ text: String(x), cls: i < st.pos ? "f" : "" })), [{ name: "itBegin", idx: st.pos, cls: "green" }, { name: "itEnd", idx: n, cls: "red" }], true));
    grid.innerHTML = "";
    grid.append(statCell("*itBegin", st.pos < n ? String(st.v[st.pos]) : "no element", st.pos < n ? `position ${st.pos}` : "itBegin == end(): do not dereference"), statCell("itEnd", "one past " + (n ? st.v[n - 1] : "nothing"), `position ${n} of ${n}`), statCell("passes", String(st.pass), st.done ? "loop left" : "itBegin != itEnd next"), statCell("output", st.out.length ? st.out.join(" ") : "(nothing yet)", `${st.out.length} line${st.out.length === 1 ? "" : "s"}`));
    msg.className = "pv-msg" + (cls ? " " + cls : ""); msg.innerHTML = text;
    log.textContent = st.log.length ? st.log.join("\n") : "Step runs one pass of the for loop.";
    stepB.disabled = st.done; runB.disabled = st.done;
  }
  reset();
}

// =====================================================================
// iterator-ops: five iterator kinds x operations (slides 67-77), per-container verdicts
// =====================================================================
const KINDS = [["input", "Input", "single pass, read"], ["output", "Output", "single pass, write"], ["forward", "Forward", "multi-pass, read and write"], ["bidirectional", "Bidirectional", "multi-pass, ++ and --"], ["random", "Random access", "multi-pass, + n, [n], <"]];
const ALL = KINDS.map((k) => k[0]);
const RW = ["input", "forward", "bidirectional", "random"], WR = ["output", "forward", "bidirectional", "random"], MP = ["forward", "bidirectional", "random"], BI = ["bidirectional", "random"], RA = ["random"];
const IT_OPS = [
  { id: "eq", label: "i == j, i != j", kinds: RW, eq: "i != j is !(i == j)", err: "==" },
  { id: "read", label: "*i (read)", kinds: RW, eq: "value_type", err: "*" },
  { id: "write", label: "*i = v (write)", kinds: WR, eq: "*i++ = v is *i = v; ++i;", err: "=" },
  { id: "arrow", label: "i->m", kinds: RW, eq: "(*i).m", err: "->" },
  { id: "inc", label: "++i, i++", kinds: ALL, eq: "i++ is It temp = i; ++i; return temp;", err: "++" },
  { id: "copy", label: "multi-pass copy (saved = i)", kinds: MP, eq: "iterSaved = iter; iter++; *iterSaved still valid", err: "copy" },
  { id: "dec", label: "--i, i--", kinds: BI, eq: "i-- is It temp = i; --i; return temp;", err: "--" },
  { id: "plusn", label: "i + n, i - n", kinds: RA, eq: "It temp = i; return temp += n;", err: "+" },
  { id: "pluseq", label: "i += n, i -= n", kinds: RA, eq: "It&", err: "+=" },
  { id: "diff", label: "i - j", kinds: RA, eq: "difference_type", err: "-" },
  { id: "index", label: "i[n]", kinds: RA, eq: "*(i + n)", err: "[]" },
  { id: "less", label: "i < j, <=, >, >=", kinds: RA, eq: "bool", err: "<" },
];
const IT_CONTAINERS = {
  vector: { kind: "random", decl: "vector<int>::iterator it = v.begin();", type: "__gnu_cxx::__normal_iterator<int*, std::vector<int>>", menu: "typedef RandomAccessIterator iterator;   // Vector's menu" },
  deque: { kind: "random", decl: "deque<int>::iterator it = d.begin();", type: "std::_Deque_iterator<int, int&, int*>", menu: "typedef RandomAccessIterator iterator;" },
  array: { kind: "random", decl: "array<int, 5>::iterator it = a.begin();", type: "int*", menu: "typedef RandomAccessIterator iterator;   // a plain pointer" },
  list: { kind: "bidirectional", decl: "list<int>::iterator it = l.begin();", type: "std::_List_iterator<int>", menu: "typedef BiDirectionalIterator iterator;" },
  set: { kind: "bidirectional", decl: "set<int>::iterator it = s.begin();", type: "std::_Rb_tree_const_iterator<int>", menu: "typedef BiDirectionalIterator iterator;   // Set's menu", constElems: "set elements are const after insertion (slide 31): <b>error: assignment of read-only location '*it'</b>. Erase and re-insert instead." },
  map: { kind: "bidirectional", decl: "map<string, int>::iterator it = m.begin();", type: "std::_Rb_tree_iterator<std::pair<const std::string, int>>", menu: "typedef BiDirectionalIterator iterator;   // Map's menu", constElems: "the key of a map pair is const, so the whole pair cannot be assigned: <b>error: use of deleted function 'pair<const string, int>::operator='</b>. Write <code>it->second = v</code> instead." },
  forward_list: { kind: "forward", decl: "forward_list<int>::iterator fi = f.begin();", type: "std::_Fwd_list_iterator<int>", menu: "typedef ForwardIterator iterator;" },
  istream_iterator: { kind: "input", decl: "istream_iterator<int> it(cin);", type: "std::istream_iterator<int>", menu: "an input iterator: reads one value per ++, single pass", constElems: "<b>error: assignment of read-only location '*it'</b>: an input iterator only reads." },
  ostream_iterator: { kind: "output", decl: "ostream_iterator<int> out(cout, \" \");", type: "std::ostream_iterator<int>", menu: "an output iterator: *out = v prints v, single pass" },
};
function parseIterExpr(src) {
  const s = src.trim().replace(/;$/, "").replace(/\s+/g, " ");
  let m;
  if ((m = /^\*\s*(\w+)\s*=\s*(.+)$/.exec(s))) return { op: "write", it: m[1], text: s };
  if ((m = /^\*\s*(\w+)\s*(\+\+|--)?$/.exec(s))) return { op: "read", it: m[1], also: m[2] === "++" ? "inc" : m[2] === "--" ? "dec" : null, text: s };
  if ((m = /^(\+\+|--)\s*(\w+)$/.exec(s))) return { op: m[1] === "++" ? "inc" : "dec", it: m[2], text: s };
  if ((m = /^(\w+)\s*(\+\+|--)$/.exec(s))) return { op: m[2] === "++" ? "inc" : "dec", it: m[1], text: s };
  if ((m = /^(\w+)\s*(\+=|-=)\s*(\d+)$/.exec(s))) return { op: "pluseq", it: m[1], sym: m[2], text: s };
  if ((m = /^(\w+)\s*([+-])\s*(\d+)$/.exec(s))) return { op: "plusn", it: m[1], sym: m[2], text: s };
  if ((m = /^(\w+)\s*-\s*(\w+)$/.exec(s))) return { op: "diff", it: m[1], text: s };
  if ((m = /^(\w+)\s*\[\s*(\d+)\s*\]$/.exec(s))) return { op: "index", it: m[1], text: s };
  if ((m = /^(\w+)\s*(<=|>=|<|>)\s*(\w+)$/.exec(s))) return { op: "less", it: m[1], sym: m[2], text: s };
  if ((m = /^(\w+)\s*(==|!=)\s*(\w+)$/.exec(s))) return { op: "eq", it: m[1], sym: m[2], text: s };
  if ((m = /^(\w+)\s*->\s*\w+/.exec(s))) return { op: "arrow", it: m[1], text: s };
  if ((m = /^(\w+)\s*=\s*(\w+)$/.exec(s))) return { op: "copy", it: m[2], text: s };
  return null;
}
function iteratorOps(box, cfg) {
  box.append(el("h4", null, cfg.title || "Iterator kinds: which operations compile?"));
  let cont = IT_CONTAINERS[cfg.container] ? cfg.container : "list";
  const sel = select("container", Object.keys(IT_CONTAINERS).map((k) => [k, k]), cont, (v) => { cont = v; draw(); });
  const exprIn = textField("expression", cfg.expr || "it + 3", draw);
  const exprRow = el("div", "stl-inline");
  exprRow.append(el("span", "stat-label", "expression"), exprIn);
  const presets = btnRow(["it + 3", "--it", "it[2]", "it1 - it2", "*it = 5", "it->first", "it < it2", "it++", "it2 = it"], (i, l) => { exprIn.value = l; draw(); }, -1);
  const menuLine = el("div", "step start"), out = el("div"), tableWrap = el("div", "table-wrap");
  box.append(note("Slides 67-77: each kind is defined by the operations it supports. Only <b>random access</b> iterators permit <code>it + n</code>, <code>it - n</code>, <code>it1 - it2</code>, <code>it[n]</code> and <code>&lt;</code>. Slide 46: every container typedefs its own iterator type as <code>iterator</code>, the way every restaurant calls its own thing a menu."), sel.row, menuLine, exprRow, presets, out, tableWrap);
  function draw() {
    const c = IT_CONTAINERS[cont];
    const kindName = KINDS.find((k) => k[0] === c.kind)[1];
    menuLine.innerHTML = `<code>${esc(c.decl)}</code> → a <b>${kindName}</b> iterator (<code>${esc(c.menu)}</code>)`;
    let html = `<table class="stl-table"><thead><tr><th>operation</th>${KINDS.map((k) => `<th class="c${k[0] === c.kind ? " sel" : ""}">${k[1]}<div class="stat-note">${k[2]}</div></th>`).join("")}<th>equivalent (slide tables)</th></tr></thead><tbody>`;
    for (const op of IT_OPS) html += `<tr><td><code>${esc(op.label)}</code></td>${KINDS.map((k) => `<td class="c${k[0] === c.kind ? " sel" : ""}">${op.kinds.includes(k[0]) ? '<span class="stl-yes">yes</span>' : '<span class="stl-no">—</span>'}</td>`).join("")}<td class="stat-note">${esc(op.eq)}</td></tr>`;
    html += "</tbody></table>";
    tableWrap.innerHTML = html;
    out.innerHTML = "";
    const e = parseIterExpr(exprIn.value);
    if (!e) { out.append(verdict(false, "Write an expression on the iterator such as <code>it + 3</code>, <code>--it</code>, <code>it[2]</code>, <code>it1 - it2</code>, <code>*it = 5</code> or <code>it2 = it</code>.")); return; }
    const ops = [IT_OPS.find((o) => o.id === e.op)]; if (e.also) ops.push(IT_OPS.find((o) => o.id === e.also));
    const bad = ops.find((o) => !o.kinds.includes(c.kind));
    const T = esc(c.type);
    if (!bad) {
      if (e.op === "write" && c.constElems) { out.append(verdict(false, `<b>Does not compile on ${cont}.</b> ${c.constElems}`)); return; }
      out.append(verdict(true, `<b>Compiles.</b> <code>${esc(e.text)}</code> needs ${ops.map((o) => `<code>${esc(o.label)}</code>`).join(" and ")}, which ${ops.length > 1 ? "are" : "is"} supported by a ${kindName} iterator${ops.length === 1 && ops[0].eq ? ` (${esc(ops[0].eq)})` : ""}.`));
      return;
    }
    let gist;
    switch (bad.id) {
      case "plusn": gist = `no match for 'operator${e.sym || "+"}' (operand types are '${T}' and 'int')`; break;
      case "pluseq": gist = `no match for 'operator${e.sym || "+="}' (operand types are '${T}' and 'int')`; break;
      case "diff": gist = `no match for 'operator-' (operand types are '${T}' and '${T}')`; break;
      case "index": gist = `no match for 'operator[]' (operand types are '${T}' and 'int')`; break;
      case "less": gist = `no match for 'operator${e.sym || "<"}' (operand types are '${T}' and '${T}')`; break;
      case "dec": gist = `no match for 'operator--' (operand type is '${T}')`; break;
      case "eq": gist = `no match for 'operator${e.sym || "=="}' (operand types are '${T}' and '${T}')`; break;
      case "arrow": gist = `base operand of '->' is not a pointer, and '${T}' has no operator->`; break;
      case "read": gist = c.kind === "output" ? `an output iterator only writes: *out yields the iterator itself, there is no value to read (slide 69: only writing, incrementing)` : `no match for 'operator*'`; break;
      case "write": gist = c.constElems ? c.constElems.replace(/<[^>]+>/g, "") : `assignment of read-only location '*it'`; break;
      case "copy": gist = `single pass: a copy of an input or output iterator cannot be used to revisit the same element (slide 72 needs a forward iterator for iterSaved)`; break;
      default: gist = "not supported";
    }
    out.append(verdict(false, `<b>Does not compile on ${cont}.</b> <code>${esc(e.text)}</code> needs <code>${esc(bad.label)}</code>, which a ${kindName} iterator does not have.<br>g++: <b>error: ${gist}</b>`));
  }
  draw();
}

// =====================================================================
// swo-checker: irreflexivity, antisymmetry, transitivity on a sample; what a set keeps
// =====================================================================
const SWO = {
  sum: { label: "x + y (sum of components)", dom: "pair", code: "return lhs.x + lhs.y < rhs.x + rhs.y;   // slide 32", lt: (a, b) => a.x + a.y < b.x + b.y },
  x: { label: "x only", dom: "pair", code: "return lhs.x < rhs.x;", lt: (a, b) => a.x < b.x },
  le: { label: "<= (less or equal)", dom: "int", code: "return lhs <= rhs;", lt: (a, b) => a <= b },
  ne: { label: "!= (not equal)", dom: "int", code: "return lhs != rhs;", lt: (a, b) => a !== b },
  date: { label: "year, month, day (lexicographic)", dom: "date", code: "if (lhs.year != rhs.year) return lhs.year < rhs.year;\nif (lhs.month != rhs.month) return lhs.month < rhs.month;\nreturn lhs.day < rhs.day;", lt: (a, b) => a.y !== b.y ? a.y < b.y : a.m !== b.m ? a.m < b.m : a.d < b.d },
  false: { label: "always false (the Date.cpp stub)", dom: "date", code: "return false;   // INSERT YOUR CODE HERE", lt: () => false },
  true: { label: "always true", dom: "int", code: "return true;", lt: () => true },
  custom: { label: "a.x < b.x || a.y < b.y", dom: "pair", code: "return lhs.x < rhs.x || lhs.y < rhs.y;", lt: (a, b) => a.x < b.x || a.y < b.y },
};
const SWO_ALIAS = { "<=": "le", "!=": "ne", "always false": "false", "always true": "true", "x only": "x", "ymd": "date", "year/month/day": "date", "lexicographic": "date", "a.x < b.x || a.y < b.y": "custom", "or": "custom" };
const SWO_SAMPLE = { pair: "(5,5) (1,2) (4,0) (2,1)", int: "1 2 2 3", date: "2018/01/01 2017/01/01 2016/06/30 2017/01/01" };
const SWO_PARSE = {
  pair: (s) => [...s.matchAll(/\(?\s*(-?\d+)\s*,\s*(-?\d+)\s*\)?/g)].map((m) => ({ x: Number(m[1]), y: Number(m[2]) })),
  int: (s) => parseInts(s),
  date: (s) => [...s.matchAll(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g)].map((m) => ({ y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) })),
};
const SWO_FMT = { pair: (p) => `(${p.x},${p.y})`, int: (n) => String(n), date: (d) => `${d.y}/${String(d.m).padStart(2, "0")}/${String(d.d).padStart(2, "0")}` };
function swoChecker(box, cfg) {
  box.append(el("h4", null, cfg.title || "Strict weak ordering: does this comparator qualify?"));
  let which = SWO[cfg.comparator] ? cfg.comparator : SWO[SWO_ALIAS[cfg.comparator]] ? SWO_ALIAS[cfg.comparator] : "sum";
  const samples = { ...SWO_SAMPLE };
  const sel = select("comparator", Object.entries(SWO).map(([k, c]) => [k, c.label]), which, (v) => { which = v; field.value = samples[SWO[which].dom]; draw(); });
  const field = textField("sample elements in insertion order", samples[SWO[which].dom], (s) => { samples[SWO[which].dom] = s; draw(); });
  const row = el("div", "stl-inline"); row.append(el("span", "stat-label", "insert in this order"), field);
  const codeWrap = el("div"), rules = el("div", "stat-steps"), setOut = el("div");
  box.append(note("Slides 34-35: lessThan is a strict weak ordering iff <b>irreflexivity</b> lessThan(x, x) == false, <b>antisymmetry</b> if lessThan(x, y) then !lessThan(y, x), and <b>transitivity</b> if lessThan(x, y) and lessThan(y, z) then lessThan(x, z). Two elements are <b>equivalent</b> when neither is less than the other, and a set keeps only one of them."), sel.row, codeWrap, row, rules, setOut);
  function draw() {
    const c = SWO[which], dom = c.dom, fmt = SWO_FMT[dom], lt = c.lt;
    const sig = dom === "pair" ? "bool operator<(const myPair& lhs, const myPair& rhs) {" : dom === "date" ? "bool operator<(const Date& lhs, const Date& rhs) {" : "bool lessThan(int lhs, int rhs) {";
    codeWrap.innerHTML = ""; codeWrap.append(codeBox([sig, ...c.code.split("\n").map((l) => "    " + l), "}"]));
    const xs = SWO_PARSE[dom](field.value);
    const fails = [];
    let irr = null, anti = null, trans = null;
    for (const x of xs) if (lt(x, x)) { irr = x; break; }
    outer: for (const x of xs) for (const y of xs) if (lt(x, y) && lt(y, x)) { anti = [x, y]; break outer; }
    outer2: for (const x of xs) for (const y of xs) for (const z of xs) if (lt(x, y) && lt(y, z) && !lt(x, z)) { trans = [x, y, z]; break outer2; }
    const line = (ok, name, text) => `<div class="step ${ok ? "final" : "error"}"><b>${name}</b>: ${text}</div>`;
    rules.innerHTML = line(!irr, "1. IRREFLEXIVITY", irr ? `fails: lessThan(${fmt(irr)}, ${fmt(irr)}) == true, but x can not be less than itself` : "holds on this sample: lessThan(x, x) == false for every x")
      + line(!anti, "2. ANTISYMMETRY", anti ? `fails: lessThan(${fmt(anti[0])}, ${fmt(anti[1])}) and lessThan(${fmt(anti[1])}, ${fmt(anti[0])}) are both true` : "holds on this sample: whenever lessThan(x, y), !lessThan(y, x)")
      + line(!trans, "3. TRANSITIVITY", trans ? `fails: lessThan(${fmt(trans[0])}, ${fmt(trans[1])}) and lessThan(${fmt(trans[1])}, ${fmt(trans[2])}) but not lessThan(${fmt(trans[0])}, ${fmt(trans[2])})` : "holds on this sample: lessThan(x, y) and lessThan(y, z) give lessThan(x, z)");
    if (irr) fails.push("irreflexivity"); if (anti) fails.push("antisymmetry"); if (trans) fails.push("transitivity");
    // naive insert into a sorted sequence, refusing equivalents
    const kept = []; const story = [];
    for (const x of xs) {
      const twin = kept.find((k) => !lt(k, x) && !lt(x, k));
      if (twin) { story.push(`<tr><td><code>s.insert(${esc(fmt(x))})</code></td><td class="oop-no">refused</td><td>equivalent to ${esc(fmt(twin))}: neither is less than the other${dom === "pair" && which === "sum" ? ` (both sum to ${x.x + x.y})` : ""}</td></tr>`); continue; }
      let pos = 0; while (pos < kept.length && lt(kept[pos], x)) pos++;
      kept.splice(pos, 0, x);
      story.push(`<tr><td><code>s.insert(${esc(fmt(x))})</code></td><td class="oop-yes">inserted</td><td>set is now ${kept.map(fmt).map(esc).join(" ")}</td></tr>`);
    }
    const listing = kept.map((k) => esc(fmt(k)) + (which === "sum" ? ` sum ${k.x + k.y}` : "")).join(" / ");
    setOut.innerHTML = "";
    const typeName = dom === "pair" ? "set<myPair>" : dom === "date" ? "set<Date>" : "set<int, lessThan>";
    if (fails.length) setOut.append(verdict(false, `<b>Not a strict weak ordering</b> (fails ${fails.join(", ")}). A <code>${typeName}</code> built with it is <b>undefined behaviour</b>: the tree invariants break, so lookups miss, duplicates slip in or loops never end. A naive insert on this sample would keep: ${listing || "(nothing)"}${which === "le" ? " (the duplicate 2 is kept twice, because 2 <= 2 says they are not equivalent)" : ""}.`));
    else setOut.append(verdict(true, `<b>Strict weak ordering</b> on this sample. <code>${typeName} s;</code> keeps ${kept.length} of ${xs.length}: ${listing || "(nothing)"}${which === "false" ? " (every element is equivalent to every other, so only the first inserted survives)" : ""}.`));
    const t = el("div", "table-wrap"); t.innerHTML = `<table class="stl-table"><thead><tr><th>statement</th><th>result</th><th>why</th></tr></thead><tbody>${story.join("")}</tbody></table>`;
    setOut.append(t);
    if (!fails.length && kept.length) setOut.append(note(`Iterating the set prints ${kept.map(fmt).join(", ")}; size ${kept.length}.`));
  }
  draw();
}

// =====================================================================
// map-insert: map<string,string> phonebook, the three insert spellings, [] and multimap
// =====================================================================
const MI_PRESETS = {
  "map.cpp": { multi: false, ops: [["pair", "Tom", "604-123-4567"], ["make_pair", "Harry", "604-999-9999"], ["make_pair", "Tom", "604-888-8888"], ["make_pair", "Tom", "604-888-8228"], ["make_pair", "Tom", "604-8888"], ["make_pair", "Tom", "604-818888"]], tail: "map" },
  "multimap.cpp": { multi: true, ops: [["make_pair", "Tom", "604-123-4567"], ["make_pair", "Harry", "604-999-9999"], ["make_pair", "Tom", "604-888-8883"], ["make_pair", "Tom", "604-888-8882"], ["make_pair", "Chris", "***-*******"], ["make_pair", "Tom", "604-887-8881"]], tail: "multimap" },
  "empty": { multi: null, ops: [] },
};
const MI_SPELL = {
  value_type: (k, v) => `insert(map<string, string>::value_type("${k}", "${v}"))`,
  make_pair: (k, v) => `insert(make_pair("${k}", "${v}"))`,
  pair: (k, v) => `insert(pair<string, string>("${k}", "${v}"))`,
  bracket: (k, v) => `["${k}"] = "${v}"`,
};
function mapInsert(box, cfg) {
  box.append(el("h4", null, cfg.title || "map and multimap: insert, [], find, count, equal_range"));
  const st = { multi: !!cfg.multi, rows: [], log: [], out: [] };
  const name = () => "nameAndNumbers";
  const typeName = () => (st.multi ? "multimap<string, string>" : "map<string, string>");
  const q = (s) => `"${s}"`;
  const pairText = (r) => `(${q(r.k)}, ${q(r.v)})`;
  const multiT = toggle("Multimap (duplicate keys allowed)", st.multi, (v) => { st.multi = v; if (!v) { const seen = new Set(); st.rows = st.rows.filter((r) => !seen.has(r.k) && seen.add(r.k)); } st.log.push(`${typeName()} ${name()};   // switched container type${v ? "" : ", duplicate keys dropped (first kept)"}`); render(); });
  const keyIn = textField("key", "Sam", () => {}), valIn = textField("value", "6045551212", () => {});
  const ins = el("div", "stl-inline");
  const methodBtns = {};
  for (const [id, label] of [["value_type", "insert(value_type)"], ["make_pair", "insert(make_pair)"], ["pair", "insert(pair)"], ["bracket", "[key] = value"]]) { methodBtns[id] = button(label, () => doInsert(id, keyIn.value.trim(), valIn.value.trim())); }
  ins.append(el("span", "stat-label", "key"), keyIn, el("span", "stat-label", "value"), valIn, ...Object.values(methodBtns));
  const qry = el("div", "stl-inline");
  const qIn = textField("key to look up", "Tom", () => {});
  qry.append(el("span", "stat-label", "look up"), qIn, button("find(key)", () => doFind(qIn.value.trim())), button("count(key)", () => doCount(qIn.value.trim())), button("equal_range(key)", () => doRange(qIn.value.trim())), button("print all", doPrint), button("clear", () => { st.rows = []; st.log = []; st.out = []; st.log.push(`${typeName()} ${name()};`); render(); }));
  const presetNames = Object.keys(MI_PRESETS);
  const presets = btnRow(presetNames, (i, l) => loadPreset(l), presetNames.indexOf(cfg.preset));
  const ret = el("div", "pv-msg"), tableWrap = el("div", "table-wrap"), log = el("pre", "manip-code stl-log"), outPre = el("pre", "pv-out");
  box.append(note("Slide 28: a map is a sorted associative container of 1-to-1 key/value pairs; <code>value_type</code> is a pair; keys must be unique; logarithmic search, insert and remove. <code>insert</code> returns <code>pair&lt;iterator, bool&gt;</code> and refuses a key that is already there; <code>[]</code> overwrites (and creates a default value for a missing key). A multimap keeps duplicates in insertion order and has no <code>[]</code>."), presets, multiT.row, ins, qry, ret, tableWrap, log, outPre);
  function lower(k) { let i = 0; while (i < st.rows.length && st.rows[i].k < k) i++; return i; }
  function upper(k) { let i = 0; while (i < st.rows.length && st.rows[i].k <= k) i++; return i; }
  function doInsert(method, k, v) {
    if (!k) { show("A key is needed.", "error"); return; }
    const call = `${name()}${method === "bracket" ? "" : "."}${MI_SPELL[method](k, v)};`;
    if (method === "bracket") {
      if (st.multi) { st.log.push(`${call}   // error: no match for operator[] (multimap)`); show(`<b>error: no match for 'operator[]'</b>: a multimap has no <code>[]</code>, because one key may map to many values. Use <code>insert</code>.`, "error"); return; }
      const i = lower(k);
      if (i < st.rows.length && st.rows[i].k === k) { const old = st.rows[i].v; st.rows[i].v = v; st.log.push(`${call}   // key exists: operator[] returns a reference, value OVERWRITTEN (was "${old}")`); show(`<code>[]</code> returned a reference to the existing mapped value, so <b>${esc(q(old))} was overwritten</b> with ${esc(q(v))}. No pair&lt;iterator, bool&gt; here: <code>[]</code> returns <code>string&amp;</code>.`, "return"); }
      else { st.rows.splice(i, 0, { k, v }); st.log.push(`${call}   // key missing: creates ("${k}", "") then assigns "${v}"`); show(`<code>[]</code> found no ${esc(q(k))}, so it <b>created</b> the pair with a default-constructed value ("") and returned a reference to it; the assignment then stored ${esc(q(v))}.`, "return"); }
      render(); return;
    }
    if (st.multi) { const i = upper(k); st.rows.splice(i, 0, { k, v }); st.log.push(`${call}   // → iterator → ${pairText({ k, v })} (multimap: always inserted, after existing "${k}")`); show(`Returned an <code>iterator</code> to the new element ${esc(pairText({ k, v }))}. A multimap keeps every duplicate, placed after the existing ${esc(q(k))} entries (insertion order).`, "return"); render(); return; }
    const i = lower(k);
    if (i < st.rows.length && st.rows[i].k === k) { st.log.push(`${call}   // → { it → ${pairText(st.rows[i])}, false }: key exists, NOT inserted`); show(`Returned <code>pair&lt;iterator, bool&gt;</code> = { it → ${esc(pairText(st.rows[i]))}, <b>false</b> }: the key is already in the map, so the insert <b>fails</b> and the old value stays.`, "error"); }
    else { st.rows.splice(i, 0, { k, v }); st.log.push(`${call}   // → { it → ${pairText({ k, v })}, true }`); show(`Returned <code>pair&lt;iterator, bool&gt;</code> = { it → ${esc(pairText({ k, v }))}, <b>true</b> }: inserted at its sorted position ${i}.`, "return"); }
    render();
  }
  function doFind(k) {
    const i = lower(k);
    if (i < st.rows.length && st.rows[i].k === k) { st.log.push(`${name()}.find("${k}")   // → iterator → ${pairText(st.rows[i])}${st.multi ? " (the first one)" : ""}`); st.out.push(`${st.rows[i].k} - ${st.rows[i].v}`); show(`<code>find</code> returned an iterator to ${esc(pairText(st.rows[i]))}${st.multi ? ", the first element with that key" : ""}; <code>it-&gt;first - it-&gt;second</code> prints <code>${esc(st.rows[i].k)} - ${esc(st.rows[i].v)}</code>.`, "return"); }
    else { st.log.push(`${name()}.find("${k}")   // → end(): not found`); show(`<code>find</code> returned <code>end()</code>: no ${esc(q(k))}. Dereferencing it would be undefined behaviour, so compare with <code>end()</code> first.`, "error"); }
    render();
  }
  function doCount(k) { const n = upper(k) - lower(k); st.log.push(`${name()}.count("${k}")   // → ${n}`); show(`<code>count</code> returned <b>${n}</b>${st.multi ? "" : " (a map's count is always 0 or 1)"}.`, "return"); render(); }
  function doRange(k) {
    const a = lower(k), b = upper(k);
    const lines = st.rows.slice(a, b).map((r) => `${r.k} ${r.v}`);
    st.log.push(`${name()}.equal_range("${k}")   // → { first → ${a < st.rows.length ? pairText(st.rows[a]) : "end()"}, second → ${b < st.rows.length ? pairText(st.rows[b]) : "end()"} }: ${b - a} element${b - a === 1 ? "" : "s"}`);
    st.out.push(...lines);
    show(`<code>equal_range</code> returned a <code>pair&lt;iterator, iterator&gt;</code>: <code>.first</code> → ${a < st.rows.length ? esc(pairText(st.rows[a])) : "end()"} (first ${esc(q(k))}), <code>.second</code> → ${b < st.rows.length ? esc(pairText(st.rows[b])) : "end()"} (one past the last). Looping from first to second prints ${lines.length ? `<code>${lines.map(esc).join("</code>, <code>")}</code>` : "nothing"}.`, b > a ? "return" : "error");
    render();
  }
  function doPrint() { st.log.push(`for (auto it = ${name()}.begin(); it != ${name()}.end(); ++it) cout << it->first << " - " << it->second << endl;`); st.out.push(...st.rows.map((r) => `${r.k} - ${r.v}`)); show(`Iterating visits the pairs in <b>key order</b>${st.multi ? ", equal keys in insertion order" : ""}.`, "return"); render(); }
  function loadPreset(nm) {
    const p = MI_PRESETS[nm]; st.rows = []; st.log = []; st.out = [];
    if (p.multi != null) { st.multi = p.multi; multiT.input.checked = p.multi; }
    st.log.push(`${typeName()} ${name()};   // ${nm}`);
    for (const [m, k, v] of p.ops) doInsert(m, k, v);
    if (p.tail === "map") { st.out.push("", "Phone numbers of people Named Tom"); doFind("Tom"); }
    if (p.tail === "multimap") { st.log.push(`for (auto pairs = ${name()}.begin(); pairs != ${name()}.end(); ++pairs) cout << pairs->first << " phone number is " << pairs->second << endl;`); st.out.push(...st.rows.map((r) => `${r.k} phone number is ${r.v}`)); doCount("Tom"); doRange("Tom"); show(`multimap.cpp: the loop prints keys sorted (Chris, Harry, Tom) with equal keys in insertion order; <code>find("Tom")</code> + <code>count("Tom")</code> = 4 and <code>equal_range("Tom")</code> both list the four Toms.`, "return"); }
    qIn.value = "Tom";
    render();
  }
  function show(html, cls) { ret.className = "pv-msg" + (cls ? " " + cls : ""); ret.innerHTML = html; }
  function render() {
    methodBtns.bracket.classList.toggle("stl-off", st.multi);
    let html = `<table class="stl-table"><thead><tr><th>#</th><th>key (sorted)</th><th>value</th></tr></thead><tbody>`;
    st.rows.forEach((r, i) => { html += `<tr><td class="c">${i}</td><td><code>${esc(r.k)}</code></td><td><code>${esc(r.v)}</code></td></tr>`; });
    html += `</tbody></table>`;
    tableWrap.innerHTML = st.rows.length ? html : `<div class="pv-empty">${esc(typeName())} ${name()}; is empty</div>`;
    log.textContent = st.log.length ? st.log.join("\n") : `${typeName()} ${name()};`;
    outPre.textContent = st.out.length ? st.out.join("\n") : "(program output appears here)";
  }
  if (MI_PRESETS[cfg.preset]) loadPreset(cfg.preset); else { st.log.push(`${typeName()} ${name()};`); show("Type a key and a value, then pick a spelling of insert.", ""); render(); }
}

// =====================================================================
// partition-stepper: the slide-89 implementation stepped on an editable vector
// =====================================================================
const PART_CODE = ["template<class ForwardIt, class UnaryPredicate>", "ForwardIt partition(ForwardIt first, ForwardIt last, UnaryPredicate p)", "{", "    first = std::find_if_not(first, last, p); //find first false", "    if (first == last) return first;", "    for (ForwardIt i = std::next(first); i != last; ++i)", "    {", "        if (p(*i)) {", "            std::iter_swap(i, first);", "            ++first;", "        }", "    }", "    return first;", "}"];
const PRED_NAMES = { odd: "IsOdd", even: "IsEven", gt: "GreaterThan", lt: "LessThan", close: "close_to_origin" };
const CITIES = [[12.5, 2.7], [60.1, 80.2], [34.1, 6.3], [90, 10], [20, 20]];
function partitionStepper(box, cfg) {
  box.append(el("h4", null, cfg.title || "std::partition, one line at a time"));
  const st = { pred: PRED_NAMES[cfg.pred] ? cfg.pred : "odd", k: Number.isFinite(Number(cfg.k)) ? Number(cfg.k) : 5, items: [], steps: [], at: 0 };
  const isPairs = () => st.pred === "close";
  const dist = (p) => Math.sqrt(p.x * p.x + p.y * p.y);
  const fmt = (it) => (it.n != null ? `${it.n}` : String(it.v));
  const long = (it) => (it.n != null ? `${it.n} (${it.x}, ${it.y})` : String(it.v));
  const PREDS = { odd: (x) => x % 2 === 1, even: (x) => x % 2 === 0, gt: (x) => x > st.k, lt: (x) => x < st.k };
  const pred = (it) => (isPairs() ? 50 > dist(it) : PREDS[st.pred](it.v));
  const predText = () => ({ odd: "IsOdd(i): (i % 2) == 1", even: "IsEven(i): (i % 2) == 0", gt: `GreaterThan(i): i > ${st.k}`, lt: `LessThan(i): i < ${st.k}`, close: "close_to_origin(c): DISTANCE 50 > distance(c)" })[st.pred];
  function setItems(src) {
    if (isPairs()) st.items = src.map((p, i) => ({ n: i + 1, x: Array.isArray(p) ? p[0] : p.x, y: Array.isArray(p) ? p[1] : p.y }));
    else st.items = src.map((v) => ({ v: Number(v) })).filter((it) => Number.isFinite(it.v));
  }
  const seed = Array.isArray(cfg.values) && cfg.values.length ? cfg.values : isPairs() ? CITIES : [1, 2, 3, 4, 5];
  if (isPairs() && !Array.isArray(seed[0])) setItems(CITIES); else if (!isPairs() && Array.isArray(seed[0])) setItems([1, 2, 3, 4, 5]); else setItems(seed);
  const itemsText = () => (isPairs() ? st.items.map((p) => `(${p.x}, ${p.y})`).join(" ") : st.items.map((it) => it.v).join(", "));
  const field = textField("vector elements", itemsText(), (s) => { if (isPairs()) setItems([...s.matchAll(/\(?\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)?/g)].map((m) => [Number(m[1]), Number(m[2])])); else setItems(parseInts(s)); build(); });
  const kIn = textField("k", String(st.k), (s) => { const v = Number(s); if (Number.isFinite(v)) { st.k = v; build(); } });
  const predSel = select("predicate", [["odd", "odd: (i % 2) == 1"], ["even", "even: (i % 2) == 0"], ["gt", "greater than k"], ["lt", "less than k"], ["close", "close to origin (pairs, distance < 50)"]], st.pred, (v) => { const was = isPairs(); st.pred = v; if (isPairs() !== was) { setItems(isPairs() ? CITIES : [1, 2, 3, 4, 5]); field.value = itemsText(); } build(); });
  const presetList = [["{1,2,3,4,5}", [1, 2, 3, 4, 5]], ["1..10", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]], ["{2,4,6} none odd", [2, 4, 6]], ["{1,3,5} all odd", [1, 3, 5]], ["{2,1,4,3}", [2, 1, 4, 3]], ["cities", CITIES]];
  const presets = btnRow(presetList.map((p) => p[0]), (i) => { const pairs = i === presetList.length - 1; if (pairs !== isPairs()) { st.pred = pairs ? "close" : "odd"; predSel.sel.value = st.pred; } setItems(presetList[i][1]); field.value = itemsText(); build(); }, -1);
  const row = el("div", "stl-inline"); row.append(el("span", "stat-label", "vector"), field, el("span", "stat-label", "k"), kIn);
  const code = codeBox(PART_CODE);
  const bar = el("div", "pv-ctl");
  const prevB = el("button", "reset-btn scrub-step", "←"), nextB = el("button", "reset-btn scrub-step", "→");
  const range = document.createElement("input"); range.type = "range"; range.min = 0; range.max = 0; range.value = 0; range.className = "scrub-slider"; range.setAttribute("aria-label", "step");
  const pos = el("span", "scrub-pos", ""), endB = button("Run to the end", () => go(st.steps.length - 1), "reset-btn scrub-step");
  bar.append(prevB, range, nextB, pos, endB);
  prevB.addEventListener("click", () => go(st.at - 1)); nextB.addEventListener("click", () => go(st.at + 1)); range.addEventListener("input", () => go(Number(range.value)));
  const cells = el("div"), msg = el("div", "pv-msg"), grid = el("div", "stat-grid"), compare = el("div", "stat-steps");
  box.append(note("Slide 86: the predicate decides, all <b>true</b> elements come before all <b>false</b> elements, relative order is <b>not</b> maintained, and the return value is an iterator to the <b>first element of the false group</b> (or <code>end()</code> if there is none). Slide 89 is a possible implementation; step through it."), predSel.row, presets, row, code, bar, cells, msg, grid, compare);
  function buildSteps() {
    const a = st.items.slice(), n = a.length, steps = [];
    const push = (line, text, first, i, extra = {}) => steps.push({ line, text, a: a.slice(), first, i, ...extra });
    const list = () => `{${a.map(fmt).join(",")}}`;
    push(2, `partition(begin, end, ${PRED_NAMES[st.pred]}) on ${list()}: first = begin, last = end, p is ${predText()}.`, 0, null);
    let first = 0; const scan = [];
    while (first < n && pred(a[first])) { scan.push(`p(${fmt(a[first])}) true`); first++; }
    if (first < n) scan.push(`p(${fmt(a[first])}) false`);
    push(4, `find_if_not scans for the first false: ${scan.join(", ") || "empty range"}. first → ${first < n ? `${long(a[first])} (position ${first})` : "end()"}.`, first, null);
    if (first === n) { push(5, n ? "first == last: every element is true, there is no false group. return first, which is end()." : "first == last: the range is empty. return first (end()).", first, null, { done: true, bound: first }); return steps; }
    push(5, `first != last, so there is at least one false element (${long(a[first])}); carry on.`, first, null);
    let i = first + 1;
    push(6, i < n ? `i = std::next(first) → ${long(a[i])} (position ${i}); i != last.` : "i = std::next(first) == last: nothing after first to scan.", first, i);
    while (i < n) {
      const t = pred(a[i]);
      push(8, `p(*i) = p(${long(a[i])}) is ${t ? "TRUE: it belongs in the true group, swap it with the element first points at" : "FALSE: it already belongs in the false group, leave it"}.`, first, i, { test: t });
      if (t) {
        const oldI = a[i], oldF = a[first];
        [a[i], a[first]] = [a[first], a[i]];
        push(9, `iter_swap(i, first): ${fmt(oldI)} ↔ ${fmt(oldF)} → ${list()}.`, first, i, { swapped: [first, i] });
        first++;
        push(10, `++first → ${first < n ? `${long(a[first])} (position ${first})` : "end()"}: the true group grew by one.`, first, i);
      }
      i++;
      push(6, i < n ? `++i → ${long(a[i])} (position ${i}); i != last.` : "++i: i == last, leave the loop.", first, i);
    }
    push(13, `return first → ${first < n ? `${long(a[first])} (position ${first})` : "end()"}: ${first === 0 ? "bound == begin(): nothing was true, the whole range is the false group" : first < n ? "the first element of the false group" : "end(): there is no false group"}. Result ${list()}.`, first, null, { done: true, bound: first });
    return steps;
  }
  /** libstdc++'s std::partition for bidirectional and random-access iterators (vector, deque, list). */
  function stdPartition(src) {
    const a = src.slice(); let first = 0, last = a.length;
    for (;;) {
      for (;;) { if (first === last) return { a, bound: first }; if (pred(a[first])) first++; else break; }
      --last;
      for (;;) { if (first === last) return { a, bound: first }; if (!pred(a[last])) --last; else break; }
      [a[first], a[last]] = [a[last], a[first]]; first++;
    }
  }
  function build() { st.steps = buildSteps(); range.max = st.steps.length - 1; go(0); drawCompare(); }
  function go(k) {
    st.at = Math.max(0, Math.min(st.steps.length - 1, k)); range.value = st.at;
    prevB.disabled = st.at === 0; nextB.disabled = st.at === st.steps.length - 1; pos.textContent = `step ${st.at + 1} / ${st.steps.length}`;
    const s = st.steps[st.at];
    markLine(code, s.line);
    const n = s.a.length;
    const ptrs = [{ name: "first", idx: s.first, cls: "green" }];
    if (s.i != null) ptrs.push({ name: "i", idx: s.i, cls: "red" });
    cells.innerHTML = "";
    cells.append(cellRow(s.a.map((it, idx) => ({ text: fmt(it), cls: s.done ? (idx < s.bound ? "t" : "f") : s.swapped && s.swapped.includes(idx) ? "t" : "" })), ptrs, true));
    msg.className = "pv-msg" + (s.done ? " end" : s.line === 9 ? " call" : ""); msg.innerHTML = esc(s.text);
    grid.innerHTML = "";
    grid.append(statCell("first", s.first < n ? long(s.a[s.first]) : "end()", `position ${s.first}`), statCell("i", s.i == null ? "—" : s.i < n ? long(s.a[s.i]) : "last", s.i == null ? "not yet declared" : `position ${s.i}`), statCell("p(*i)", s.test == null ? "—" : s.test ? "true" : "false", predText()), statCell("vector", `{${s.a.map(fmt).join(",")}}`, s.done ? `true group [0, ${s.bound}), false group [${s.bound}, ${n})` : "so far"));
  }
  function drawCompare() {
    const last = st.steps[st.steps.length - 1];
    const stdR = stdPartition(st.items);
    const trues = st.items.filter(pred), falses = st.items.filter((it) => !pred(it));
    const stable = { a: trues.concat(falses), bound: trues.length };
    const line = (label, r, extra) => { const d = el("div", "sorted-line"); d.append(el("span", "stat-label", label)); r.a.forEach((it, idx) => d.append(el("span", "sorted-val" + (idx === r.bound ? " mid" : ""), fmt(it)))); d.append(el("span", "stat-note", `bound → ${r.bound < r.a.length ? fmt(r.a[r.bound]) : "end()"}${extra ? "; " + extra : ""}`)); return d; };
    compare.innerHTML = "";
    compare.append(line("slide-89 implementation", { a: last.a, bound: last.bound }, "what g++ runs for a forward_list"), line("std::partition (g++)", stdR, "vector, deque and list: libstdc++ swaps from both ends, same groups, different order"), line("std::stable_partition", stable, "keeps relative order"));
    compare.append(note(`${PRED_NAMES[st.pred]} is true for ${trues.length} of ${st.items.length} element${st.items.length === 1 ? "" : "s"}; every version puts the same ${trues.length} first and returns an iterator to position ${trues.length}.`));
  }
  build();
}

export const WIDGETS = {
  "container-picker": containerPicker,
  "iter-walk": iterWalk,
  "iterator-ops": iteratorOps,
  "swo-checker": swoChecker,
  "map-insert": mapInsert,
  "partition-stepper": partitionStepper,
};
