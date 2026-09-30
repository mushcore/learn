// Interactive OOP widgets for COMP 3522 Weeks 3 and 4: access and inheritance visibility, which
// constructor a declaration calls, object lifetime (construction and destruction order), shallow vs
// deep copy, virtual dispatch and slicing, equivalence partitions, abstract classes, the diamond and
// virtual base classes, friendship, operator-overload dispatch, and the copy-and-swap assignment.
import { el, esc, btnRow, slider } from "./dom.js";
import { highlight } from "./highlight.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
/** A dark code box with one row per line (rows get `.cur` when stepped). */
function codeBox(lines, cls = "oop-code") {
  const box = el("div", cls);
  lines.forEach((text, i) => {
    const row = el("div", "pl");
    row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", text) || " "}</span>`;
    box.append(row);
  });
  return box;
}
function verdict(ok, text) {
  const d = el("div", "oop-verdict " + (ok ? "ok" : "bad"));
  d.innerHTML = text;
  return d;
}
function note(text) { const p = el("p", "widget-note"); p.innerHTML = text; return p; }
function toggle(label, checked, onChange) {
  const lab = el("label", "oop-toggle");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
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
function stepper(onStep) {
  const bar = el("div", "pv-ctl");
  const prev = el("button", "reset-btn scrub-step", "←"), next = el("button", "reset-btn scrub-step", "→");
  const range = document.createElement("input"); range.type = "range"; range.min = 0; range.max = 0; range.value = 0; range.className = "scrub-slider";
  const pos = el("span", "scrub-pos", "");
  bar.append(prev, range, next, pos);
  let k = 0, n = 1;
  const go = (v) => { k = Math.max(0, Math.min(n - 1, v)); range.value = k; prev.disabled = k === 0; next.disabled = k === n - 1; pos.textContent = `step ${k + 1} / ${n}`; onStep(k); };
  prev.addEventListener("click", () => go(k - 1));
  next.addEventListener("click", () => go(k + 1));
  range.addEventListener("input", () => go(Number(range.value)));
  return { bar, reset: (count) => { n = Math.max(1, count); range.max = n - 1; go(0); }, go };
}

// ---------- widget: access-matrix ----------
// The slide's access table and the Spy hierarchy: pick the kind of inheritance, see what each
// member becomes in the derived class and who can call it.
const LEVELS = ["public", "protected", "private"];
const SPY_MEMBERS = [["publicPrint()", "public"], ["protectedPrint()", "protected"], ["privatePrint()", "private"]];
/** Access a base member has inside a class derived with `kind` (null = not accessible at all). */
function inherited(level, kind) {
  if (level === "private") return null;
  return LEVELS[Math.max(LEVELS.indexOf(level), LEVELS.indexOf(kind))];
}
function accessMatrix(box, cfg) {
  box.append(el("h4", null, cfg.title || "What a derived class can see: public, protected and private inheritance"));
  let kind = LEVELS.includes(cfg.kind) ? cfg.kind : "public";
  box.append(note("Spy declares one member at each access level. Choose how a class derives from Spy, then read what each member becomes in the derived class and who can call it. The second hop derives publicly from the first."));
  box.append(btnRow(LEVELS.map((k) => `class Derived : ${k} Spy`), (i) => { kind = LEVELS[i]; draw(); }, LEVELS.indexOf(kind)));
  const code = el("div"), table = el("div", "table-wrap"), msg = el("div", "stat-steps");
  box.append(code, table, msg);
  function yn(v) { return v ? `<span class="oop-yes">yes</span>` : `<span class="oop-no">no</span>`; }
  function draw() {
    const name = kind[0].toUpperCase() + kind.slice(1) + "Spy";
    const lines = [`class Spy {`, `public:    void publicPrint();`, `protected: void protectedPrint();`, `private:   void privatePrint();`, `};`, ``, `class ${name} : ${kind} Spy {`, `public:`, `    void print() {`];
    for (const [m, lvl] of SPY_MEMBERS) {
      const inD = inherited(lvl, kind);
      lines.push(inD ? `        ${m};   // ${inD === lvl ? "still " + inD : "changed to " + inD}` : `        // ${m};  error: private in Spy`);
    }
    lines.push(`    }`, `};`, ``, `class Grandchild : public ${name} { /* second hop */ };`);
    code.innerHTML = ""; code.append(codeBox(lines));
    let html = `<table class="group-table"><thead><tr><th>member of Spy</th><th>declared in Spy</th><th>becomes in ${name}</th><th>${name} member functions</th><th>Grandchild member functions</th><th>outside (main)</th></tr></thead><tbody>`;
    for (const [m, lvl] of SPY_MEMBERS) {
      const inD = inherited(lvl, kind);
      const inG = inD ? inherited(inD, "public") : null;
      html += `<tr><td><code>${m}</code></td><td>${lvl}</td><td>${inD ? inD : "<span class='oop-no'>not accessible</span>"}</td><td>${yn(!!inD)}</td><td>${yn(!!inG)}</td><td>${yn(inD === "public")}</td></tr>`;
    }
    html += `</tbody></table>`;
    table.innerHTML = html;
    const why = {
      public: "Public inheritance keeps every accessible member at its own level: public stays public, protected stays protected. This is the only kind that models \"is a\", and the only one where <code>Spy* p = &derived;</code> works from outside.",
      protected: "Protected inheritance caps everything at protected: the public member is now protected, so <code>PublicSpy</code>-style calls from main are gone, but further derived classes can still call it.",
      private: "Private inheritance caps everything at private: both inherited members are callable only inside this class. A grandchild inherits nothing usable, which is the slide's <code>PrivateSpy2</code>. Writing <code>class X : Spy</code> with no keyword is private inheritance by default (a <code>struct</code> would default to public).",
    };
    msg.innerHTML = `<p>${why[kind]}</p><p>The private member is never accessible from a derived class, whatever the inheritance kind: private means the class itself only. The rule of thumb: the inherited level is the <b>more restrictive</b> of the member's own level and the inheritance kind.</p>`;
  }
  draw();
}

// ---------- widget: ctor-picker ----------
// Type a declaration (or pick one) and see which constructor it calls, or why it does not compile.
const CTOR_CLASSES = {
  circle: { name: "Circle", ctors: [{ sig: "Circle()", min: 0, max: 0, body: "Circle::Circle() { radius = 10; }" }, { sig: "Circle(int r)", min: 1, max: 1, body: "Circle::Circle(int r) : radius(r) { }" }], copy: "Circle(const Circle&)" },
  circleNoDefault: { name: "Circle", ctors: [{ sig: "Circle(int r)", min: 1, max: 1, body: "Circle::Circle(int r) : radius(r) { }" }], copy: "Circle(const Circle&)" },
  complex: { name: "Complex", ctors: [{ sig: "Complex(double r = 0, double i = 0)", min: 0, max: 2, body: "Complex(double r = 0, double i = 0) : r(r), i(i) { }" }], copy: "Complex(const Complex&)" },
};
const CTOR_PRESETS = ["Circle c;", "Circle c();", "Circle c{};", "Circle c(2);", "Circle c{2};", "Circle c = 2;", "Circle c(2, 3);", "Circle d(c);", "Circle d = c;", "d = c;", "Complex z;", "Complex z(5);", "Complex z(5, 6);", "Complex z{5, 6, 7};"];
function ctorPicker(box, cfg) {
  box.append(el("h4", null, cfg.title || "Which constructor runs?"));
  let which = cfg.class && CTOR_CLASSES[cfg.class] ? cfg.class : "circle";
  const sel = select("The class", [["circle", "Circle with Circle() and Circle(int)"], ["circleNoDefault", "Circle with only Circle(int)"], ["complex", "Complex(double r = 0, double i = 0)"]], which, (v) => { which = v; draw(); });
  box.append(sel.row);
  const decl = el("div", "oop-decl");
  box.append(btnRow(CTOR_PRESETS, (i) => { input.value = CTOR_PRESETS[i]; draw(); }, CTOR_PRESETS.indexOf(cfg.decl || "Circle c;")));
  const input = document.createElement("input");
  input.className = "comp-input"; input.spellcheck = false; input.value = cfg.decl || "Circle c;"; input.setAttribute("aria-label", "declaration");
  input.addEventListener("input", draw);
  decl.append(input);
  const out = el("div"), classBox = el("div");
  box.append(decl, out, classBox);
  function draw() {
    const cls = CTOR_CLASSES[which];
    const lines = [`class ${cls.name} {`, `    double ${which === "complex" ? "r, i" : "radius"};`, `public:`];
    for (const c of cls.ctors) lines.push(`    ${c.sig};`);
    lines.push(`    // ${cls.copy} is generated by the compiler`, `};`);
    classBox.innerHTML = ""; classBox.append(codeBox(lines));
    const s = input.value.trim().replace(/;$/, "");
    out.innerHTML = "";
    const m = /^(\w+)\s+(\w+)\s*(?:(\(|\{)(.*)(\)|\})|=\s*(.+))?$/.exec(s);
    const assign = /^(\w+)\s*=\s*(\w+)$/.exec(s);
    if (assign) {
      out.append(verdict(true, `<b>Not a constructor at all.</b> <code>${esc(s)};</code> assigns to an object that already exists, so it calls the <b>copy assignment operator</b> <code>${cls.name}::operator=</code>. A constructor runs only when an object is being created. The slide: <code>anotherCopyC = c; //NO COPY CONSTRUCTOR CALL! Calls assignment operator</code>.`));
      return;
    }
    if (!m) { out.append(verdict(false, "Write a declaration such as <code>Circle c(2);</code>, <code>Circle c{};</code> or <code>Circle d = c;</code>.")); return; }
    const [, type, name, open, inner, , eqRhs] = m;
    if (type !== cls.name) { out.append(verdict(false, `The class chosen above is <code>${cls.name}</code>, but this declares a <code>${esc(type)}</code>. Pick the matching class or change the declaration.`)); return; }
    const args = open ? inner.split(",").map((a) => a.trim()).filter(Boolean) : eqRhs != null ? [eqRhs.trim()] : [];
    const isCopy = args.length === 1 && /^[A-Za-z_]\w*$/.test(args[0]) && !/^\d/.test(args[0]) && args[0] !== name;
    if (open === "(" && args.length === 0) {
      out.append(verdict(false, `<b>Most vexing parse.</b> <code>${cls.name} ${esc(name)}();</code> declares a <b>function</b> named <code>${esc(name)}</code> that takes no arguments and returns a <code>${cls.name}</code>. No object is created and no constructor runs; the first use of <code>${esc(name)}</code> as an object is a compile error. Write <code>${cls.name} ${esc(name)};</code> or <code>${cls.name} ${esc(name)}{};</code> instead.`));
      return;
    }
    if (isCopy) {
      const how = eqRhs != null ? "copy-initialization (<code>=</code> in a declaration)" : "direct-initialization";
      out.append(verdict(true, `<b>Copy constructor.</b> Creating <code>${esc(name)}</code> from an existing <code>${cls.name}</code> calls <code>${cls.copy}</code>, whether written as ${how}. The compiler-generated version copies every member in declaration order (a shallow copy).`));
      return;
    }
    if (eqRhs != null && args.length === 1) {
      const ctor = cls.ctors.find((c) => 1 >= c.min && 1 <= c.max);
      if (ctor) { out.append(verdict(true, `<b>Converting constructor.</b> <code>${cls.name} ${esc(name)} = ${esc(args[0])};</code> is copy-initialization from a value of another type; the compiler uses the one-argument constructor <code>${ctor.sig}</code> to convert it. Since C++17 no extra copy is made.`)); return; }
    }
    const ctor = cls.ctors.find((c) => args.length >= c.min && args.length <= c.max);
    if (!ctor) {
      if (args.length === 0) out.append(verdict(false, `<b>error: no matching function for call to '${cls.name}::${cls.name}()'.</b> The class declares a constructor, so the compiler no longer generates the default one, and <code>${cls.name} ${esc(name)};</code> needs a default constructor. Fix: overload with <code>${cls.name}();</code>, or give every parameter a default value.`));
      else out.append(verdict(false, `<b>error: no matching constructor</b> for ${args.length} argument${args.length === 1 ? "" : "s"}. The candidates are ${cls.ctors.map((c) => `<code>${c.sig}</code>`).join(" and ")}.`));
      return;
    }
    const filled = ctor.max > ctor.min ? ` (${args.length} given, the rest use their default values: ${ctor.sig.replace(/^\w+\(|\)$/g, "")})` : "";
    const braces = open === "{" ? " Braces (list-initialization) also refuse narrowing conversions and can never be read as a function prototype." : "";
    out.append(verdict(true, `<b>Calls <code>${ctor.sig}</code></b>${filled}.${braces}<br><code>${esc(ctor.body)}</code>`));
  }
  draw();
}

// ---------- widget: lifetime-trace ----------
// A tiny model of C++ object lifetime: classes with bases and members, main with blocks, copies,
// by-value / by-reference calls, new / delete. Every step records the objects alive and the output.
const LT_PRESETS = {
  "Block scope": `class A { };
class B { };
class C { };

int main() {
    A a;
    {
        B b;
    }
    C c;
    return 0;
}`,
  "Base before derived (whichconstructor.cpp)": `class Base { };
class Derived_One : Base { };
class Derived_Two : Base(...) { };

int main() {
    Derived_One first_child(0);
    Derived_Two second_child(0);
    return 0;
}`,
  "Members before the body (Complex)": `class A { };
class B { };
class Complex { A a; B b; };

int main() {
    Complex c(5, 0);
    return 0;
}`,
  "Pass by value vs by reference": `class Big { };
void byValue(Big x) { }
void byRef(Big& x) { }

int main() {
    Big b;
    byValue(b);
    byRef(b);
    return 0;
}`,
  "Copy, assign, new and delete": `class W { };

int main() {
    W w1;
    W w2 = w1;
    w2 = w1;
    W* p = new W;
    delete p;
    return 0;
}`,
  "Derived with a member": `class Engine { };
class Vehicle { };
class Car : Vehicle { Engine engine; };

int main() {
    Car car;
    return 0;
}`,
};
function ltParse(src) {
  const classes = {}, funcs = {};
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  let mainStart = -1;
  lines.forEach((raw, i) => {
    const t = raw.replace(/\/\/.*$/, "").trim();
    let m;
    if ((m = /^class\s+(\w+)\s*(?::\s*([^{]+))?\{([^}]*)\}\s*;?$/.exec(t))) {
      const bases = (m[2] || "").split(",").map((b) => b.trim()).filter(Boolean).map((b) => { const bm = /^(?:public\s+|protected\s+|private\s+)?(\w+)\s*(\(\.\.\.\))?$/.exec(b); if (!bm) throw new Error(`line ${i + 1}: cannot read base '${b}'`); return { name: bm[1], forward: !!bm[2] }; });
      const members = m[3].split(";").map((s) => s.trim()).filter(Boolean).map((s) => { const mm = /^(\w+)\s+(\w+)$/.exec(s); if (!mm) throw new Error(`line ${i + 1}: cannot read member '${s}'`); return { type: mm[1], name: mm[2] }; });
      classes[m[1]] = { name: m[1], bases, members, line: i + 1 };
    } else if ((m = /^void\s+(\w+)\s*\(\s*(\w+)\s*(&)?\s*(\w+)\s*\)\s*\{\s*\}$/.exec(t))) {
      funcs[m[1]] = { name: m[1], type: m[2], byRef: !!m[3], param: m[4], line: i + 1 };
    } else if (/^int\s+main\s*\(/.test(t)) mainStart = i;
  });
  if (mainStart < 0) throw new Error("no int main() found");
  const body = [];
  for (let i = mainStart + 1; i < lines.length; i++) {
    const t = lines[i].replace(/\/\/.*$/, "").trim();
    if (!t) continue;
    if (t === "}") { body.push({ line: i + 1, kind: "close" }); continue; }
    if (t === "{") { body.push({ line: i + 1, kind: "open" }); continue; }
    let m;
    if ((m = /^(\w+)\s*\*\s*(\w+)\s*=\s*new\s+(\w+)\s*(?:\((.*)\)|\{(.*)\})?;$/.exec(t))) body.push({ line: i + 1, kind: "new", type: m[1], name: m[2], args: (m[4] ?? m[5] ?? "").trim() });
    else if ((m = /^delete\s+(\w+);$/.exec(t))) body.push({ line: i + 1, kind: "delete", name: m[1] });
    else if ((m = /^return\b.*;$/.exec(t))) body.push({ line: i + 1, kind: "return" });
    else if ((m = /^(\w+)\s+(\w+)\s*(?:\((.*)\)|\{(.*)\}|=\s*(.+))?;$/.exec(t)) && classes[m[1]]) body.push({ line: i + 1, kind: "decl", type: m[1], name: m[2], args: (m[3] ?? m[4] ?? m[5] ?? "").trim() });
    else if ((m = /^(\w+)\s*=\s*(\w+);$/.exec(t))) body.push({ line: i + 1, kind: "assign", to: m[1], from: m[2] });
    else if ((m = /^(\w+)\s*\(\s*(\w+)\s*\);$/.exec(t)) && funcs[m[1]]) body.push({ line: i + 1, kind: "call", fn: m[1], arg: m[2] });
    else throw new Error(`line ${i + 1}: cannot read '${t}'`);
  }
  return { classes, funcs, body, mainLine: mainStart + 1 };
}
function ltRun(prog) {
  const { classes, funcs, body } = prog;
  const steps = [];
  const out = [];
  let scopes = [{ name: "main", objs: [] }];
  const heap = [];
  let seq = 0;
  const snap = (line, msg, kind = "step") => steps.push({ line, msg, kind, out: out.slice(), scopes: scopes.map((s) => ({ name: s.name, objs: s.objs.map((o) => ({ ...o })) })), heap: heap.map((o) => ({ ...o })) });
  const need = (type, line) => { if (!classes[type]) throw new Error(`line ${line}: unknown class '${type}'`); return classes[type]; };
  // Construct `type` (with `args` text) and record output lines; returns nothing. mode: "ctor" | "copy".
  function construct(type, args, mode, line, depth = 0) {
    const cls = need(type, line);
    for (const b of cls.bases) { construct(b.name, mode === "copy" ? "" : b.forward ? args : "", mode, line, depth + 1); }
    for (const mem of cls.members) construct(mem.type, "", mode, line, depth + 1);
    out.push(mode === "copy" ? `${type}(const ${type}&)` : `${type}(${args})`);
  }
  function destroy(type, line) {
    const cls = need(type, line);
    out.push(`~${type}()`);
    for (const mem of [...cls.members].reverse()) destroy(mem.type, line);
    for (const b of [...cls.bases].reverse()) destroy(b.name, line);
  }
  const find = (name) => { for (let i = scopes.length - 1; i >= 0; i--) { const o = scopes[i].objs.find((x) => x.name === name); if (o) return o; } return null; };
  const popScope = (line, why) => {
    const s = scopes[scopes.length - 1];
    const dying = s.objs.filter((o) => !o.ptr);
    for (const o of [...dying].reverse()) destroy(o.type, line);
    scopes = scopes.slice(0, -1);
    snap(line, dying.length ? `${why}: the ${dying.length === 1 ? "object" : "objects"} declared in it ${dying.length === 1 ? "is" : "are"} destroyed in <b>reverse</b> order of construction (${dying.map((o) => o.name).reverse().join(", ")}).` : `${why}: nothing to destroy.`, "end");
  };
  snap(prog.mainLine, "main() starts. Objects are constructed in the order the statements run and destroyed in reverse when their scope ends.", "start");
  try {
    for (const st of body) {
      if (st.kind === "open") { scopes.push({ name: `block ${++seq}`, objs: [] }); snap(st.line, "A new block opens: a nested scope. Objects declared inside it live only until the matching <code>}</code>.", "call"); }
      else if (st.kind === "close") popScope(st.line, "The block ends");
      else if (st.kind === "decl") {
        const src = st.args && /^[A-Za-z_]\w*$/.test(st.args) ? find(st.args) : null;
        const cls = classes[st.type];
        if (src) {
          if (src.type !== st.type) throw new Error(`line ${st.line}: '${st.args}' is a ${src.type}, not a ${st.type}`);
          construct(st.type, "", "copy", st.line);
          scopes[scopes.length - 1].objs.push({ name: st.name, type: st.type });
          snap(st.line, `<code>${st.type} ${st.name}</code> is created <b>from an existing ${st.type}</b>, so the <b>copy constructor</b> runs (bases and members are copy-constructed first, in declaration order).`);
        } else {
          construct(st.type, st.args, "ctor", st.line);
          scopes[scopes.length - 1].objs.push({ name: st.name, type: st.type });
          const parts = [];
          if (cls.bases.length) parts.push(`the base ${cls.bases.map((b) => `<code>${b.name}</code>${b.forward ? " (with the arguments forwarded in the initializer list)" : " (default constructor: nothing was passed in the initializer list)"}`).join(", ")}`);
          if (cls.members.length) parts.push(`the member${cls.members.length > 1 ? "s" : ""} ${cls.members.map((m) => `<code>${m.type} ${m.name}</code>`).join(", ")} in declaration order`);
          snap(st.line, `<code>${st.type} ${st.name}${st.args ? "(" + st.args + ")" : ""}</code>: ${parts.length ? parts.join(", then ") + ", and only then the body of " : ""}<code>${st.type}(${st.args})</code> runs.`);
        }
      } else if (st.kind === "assign") {
        const to = find(st.to), from = find(st.from);
        if (!to || !from) throw new Error(`line ${st.line}: unknown object`);
        out.push(`${to.type}::operator=`);
        snap(st.line, `<code>${st.to} = ${st.from}</code>: both objects already exist, so <b>no constructor runs</b>; the copy assignment operator replaces ${st.to}'s state.`);
      } else if (st.kind === "call") {
        const fn = funcs[st.fn], arg = find(st.arg);
        if (!arg) throw new Error(`line ${st.line}: unknown object '${st.arg}'`);
        if (fn.byRef) {
          scopes.push({ name: `${fn.name}()`, objs: [{ name: `${fn.param} (alias of ${arg.name})`, type: arg.type, ref: true }] });
          snap(st.line, `<code>${fn.name}(${st.arg})</code> takes a <b>reference</b>: <code>${fn.param}</code> is another name for <code>${arg.name}</code>. No copy, no constructor, no destructor.`, "call");
          scopes = scopes.slice(0, -1);
          snap(st.line, `${fn.name}() returns. Nothing is destroyed because nothing was created.`, "return");
        } else {
          construct(arg.type, "", "copy", st.line);
          scopes.push({ name: `${fn.name}()`, objs: [{ name: fn.param, type: arg.type }] });
          snap(st.line, `<code>${fn.name}(${st.arg})</code> passes <b>by value</b>: the parameter <code>${fn.param}</code> is a brand-new ${arg.type} built by the <b>copy constructor</b>.`, "call");
          popScope(st.line, `${fn.name}() returns`);
        }
      } else if (st.kind === "new") {
        construct(st.type, st.args, "ctor", st.line);
        const id = ++seq;
        heap.push({ id, type: st.type, owner: st.name });
        scopes[scopes.length - 1].objs.push({ name: st.name, type: st.type + "*", ptr: id });
        snap(st.line, `<code>new ${st.type}</code> constructs an object on the <b>heap</b>; only the pointer <code>${st.name}</code> lives in this scope. The object outlives every scope until <code>delete</code>.`);
      } else if (st.kind === "delete") {
        const p = find(st.name);
        if (!p || !p.ptr) throw new Error(`line ${st.line}: '${st.name}' is not a pointer`);
        const h = heap.find((o) => o.id === p.ptr);
        if (!h) throw new Error(`line ${st.line}: '${st.name}' was already deleted: double free (undefined behaviour)`);
        destroy(h.type, st.line);
        heap.splice(heap.indexOf(h), 1);
        p.dangling = true;
        snap(st.line, `<code>delete ${st.name}</code> runs the destructor of the heap object and frees it. The pointer itself still exists (now dangling).`, "end");
      } else if (st.kind === "return") {
        snap(st.line, "<code>return</code> reaches the end of main: every object still alive in main is about to be destroyed.");
      }
    }
    while (scopes.length) popScope(body.length ? body[body.length - 1].line : prog.mainLine, scopes.length === 1 ? "main() ends" : "The scope ends");
    if (heap.length) { out.push(`// LEAK: ${heap.map((h) => h.type).join(", ")} never deleted`); snap(body[body.length - 1].line, `The program ended with ${heap.length} heap object${heap.length > 1 ? "s" : ""} never deleted: <b>a memory leak</b>, and its destructor never ran.`, "error"); }
  } catch (e) {
    snap(null, `Error: ${e.message}`, "error");
  }
  return steps;
}
function lifetimeTrace(box, cfg) {
  box.append(el("h4", null, cfg.title || "Object lifetime: who is constructed when, who is destroyed when"));
  const names = Object.keys(LT_PRESETS);
  let src = cfg.program || LT_PRESETS[cfg.preset] || LT_PRESETS[names[0]];
  box.append(note("Every class prints its constructor and destructor. Step through main and watch the order: bases, then members, then the body; destruction in reverse. Edit the program below to try your own."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { src = LT_PRESETS[names[i]]; ta.value = src; rebuild(); }, Math.max(0, names.indexOf(cfg.preset))));
  const main = el("div", "pv-main");
  const codeWrap = el("div"), side = el("div");
  const mem = el("div", "lt-mem"), outBox = el("div", "pv-out"), msg = el("div", "pv-msg");
  side.append(el("div", "pv-title", "alive objects"), mem, el("div", "pv-title", "output so far"), outBox);
  main.append(codeWrap, side);
  const st = stepper(paint);
  const edit = el("details", "pv-edit");
  const ta = document.createElement("textarea"); ta.rows = 12; ta.className = "comp-input"; ta.value = src; ta.spellcheck = false;
  const apply = el("button", "reset-btn", "Run this program");
  apply.addEventListener("click", () => { src = ta.value; rebuild(); });
  edit.append(el("summary", null, "Edit the program (classes: `class X : Base(...) { Member m; };`, functions: `void f(X x)` or `void f(X& x)`)"), ta, apply);
  box.append(st.bar, main, msg, edit);
  let steps = [], rows = [];
  function rebuild() {
    codeWrap.innerHTML = "";
    const cb = codeBox(src.split("\n"), "pv-code");
    codeWrap.append(cb);
    rows = [...cb.querySelectorAll(".pl")];
    try { steps = ltRun(ltParse(src)); } catch (e) { steps = [{ line: null, msg: `Error: ${e.message}`, kind: "error", out: [], scopes: [], heap: [] }]; }
    st.reset(steps.length);
  }
  function paint(k) {
    const s = steps[k];
    rows.forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === s.line));
    if (s.line) rows[s.line - 1]?.scrollIntoView({ block: "nearest" });
    mem.innerHTML = "";
    for (const sc of s.scopes) {
      const f = el("div", "pv-frame");
      f.append(el("div", "pv-frame-title", sc.name));
      if (!sc.objs.length) f.append(el("div", "pv-empty", "(no objects yet)"));
      for (const o of sc.objs) { const c = el("div", "pv-cell" + (o.ptr ? " ptr" : "") + (o.ref ? " temp" : "")); c.innerHTML = `<div class="pv-names">${esc(o.name)}</div><div class="pv-type">${esc(o.type)}${o.dangling ? " (dangling)" : ""}</div>`; f.append(c); }
      mem.append(f);
    }
    if (s.heap.length) {
      const f = el("div", "pv-frame");
      f.append(el("div", "pv-frame-title", "heap"));
      for (const h of s.heap) { const c = el("div", "pv-cell"); c.innerHTML = `<div class="pv-names">${esc(h.type)} object</div><div class="pv-type">reached through ${esc(h.owner)}</div>`; f.append(c); }
      mem.append(f);
    }
    outBox.textContent = s.out.length ? s.out.join("\n") : "(nothing printed yet)";
    msg.className = "pv-msg " + (s.kind || "");
    msg.innerHTML = s.msg;
  }
  rebuild();
}

// ---------- widget: copy-viz ----------
// MyVector with a pointer member: the compiler's shallow copy versus a deep copy constructor.
function copyViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "Shallow copy versus deep copy of MyVector"));
  let deep = !!cfg.deep;
  box.append(btnRow(["Compiler-generated copy constructor (shallow)", "Our copy constructor (deep)"], (i) => { deep = i === 1; build(); }, deep ? 1 : 0));
  const svg = svgEl("svg", { viewBox: "0 0 640 210", class: "curve-svg net-svg" });
  const codeWrap = el("div"), msg = el("div", "pv-msg");
  const st = stepper(paint);
  box.append(codeWrap, st.bar, svg, msg);
  const VALUES = [3, 6, 7];
  let steps = [];
  function build() {
    const code = deep
      ? ["class MyVector {", "    unsigned size;", "    double *data;", "public:", "    MyVector(const MyVector& v)", "        : size(v.size), data(new double[size])", "    {", "        for (unsigned i = 0; i < size; ++i)", "            data[i] = v.data[i];", "    }", "    ~MyVector() { delete[] data; }", "};", "", "MyVector v;            // size 3, data -> {3, 6, 7}", "MyVector vCopy = v;    // copy constructor", "vCopy.data[0] = 99;", "// end of scope: ~vCopy, then ~v"]
      : ["class MyVector {", "    unsigned size;", "    double *data;", "public:", "    // no copy constructor written:", "    // the compiler copies size and data member by member", "    ~MyVector() { delete[] data; }", "};", "", "MyVector v;            // size 3, data -> {3, 6, 7}", "MyVector vCopy = v;    // compiler-generated copy", "vCopy.data[0] = 99;", "// end of scope: ~vCopy, then ~v"];
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(code, "pv-code"));
    const L = deep ? { v: 14, copy: 15, write: 16, end: 17 } : { v: 10, copy: 11, write: 12, end: 13 };
    steps = [
      { line: L.v, v: { vals: VALUES.slice() }, copy: null, msg: "<code>v</code> owns one array on the heap: <code>size</code> is 3 and <code>data</code> holds the array's address." },
      deep
        ? { line: L.copy, v: { vals: VALUES.slice() }, copy: { vals: VALUES.slice(), own: true }, msg: "The deep copy constructor allocates a <b>new</b> array with <code>new double[size]</code> and copies the three values into it. Two objects, two arrays." }
        : { line: L.copy, v: { vals: VALUES.slice() }, copy: { vals: null, own: false }, msg: "The compiler-generated copy constructor copies <code>size</code> (3) and copies the <b>pointer</b>: both <code>data</code> members hold the same address. Two objects, <b>one</b> array. That is a shallow copy." },
      deep
        ? { line: L.write, v: { vals: VALUES.slice() }, copy: { vals: [99, 6, 7], own: true }, msg: "Writing through <code>vCopy.data</code> changes only vCopy's array. <code>v</code> still reads 3, 6, 7." }
        : { line: L.write, v: { vals: [99, 6, 7] }, copy: { vals: null, own: false }, msg: "Writing through <code>vCopy.data</code> changes the shared array, so <code>v.data[0]</code> is now 99 too. One object silently edits the other." },
      deep
        ? { line: L.end, v: { vals: VALUES.slice() }, copy: { vals: [99, 6, 7], own: true, dead: true }, msg: "<code>~vCopy()</code> deletes vCopy's array; then <code>~v()</code> deletes v's array. Each array is freed exactly once.", kind: "end" }
        : { line: L.end, v: { vals: [99, 6, 7], freed: true }, copy: { vals: null, own: false, dead: true }, msg: "<code>~vCopy()</code> deletes the shared array. Then <code>~v()</code> runs <code>delete[] data</code> on the <b>same address</b>: a double free, undefined behaviour (usually a crash). And if only one destructor ran, the other object would be reading freed memory. This is why a class that owns a pointer needs its own copy constructor.", kind: "error" },
    ];
    st.reset(steps.length);
  }
  function drawObj(x, y, name, size, dead) {
    svg.append(svgEl("rect", { x, y, width: 130, height: 76, rx: 8, fill: "var(--paper)", stroke: dead ? "var(--red)" : "var(--rule-strong)", "stroke-dasharray": dead ? "5 4" : "" }));
    svg.append(svgEl("text", { x: x + 65, y: y + 18, "text-anchor": "middle", "font-size": 13, fill: "var(--ink)", "font-weight": 700 }, `MyVector ${name}`));
    svg.append(svgEl("text", { x: x + 12, y: y + 42, "font-size": 12, fill: "var(--ink-2)" }, `size = ${size}`));
    svg.append(svgEl("text", { x: x + 12, y: y + 64, "font-size": 12, fill: "var(--hl)" }, `*data`));
    return [x + 60, y + 60];
  }
  function drawArr(x, y, vals, freed) {
    vals.forEach((v, i) => {
      svg.append(svgEl("rect", { x: x + i * 44, y, width: 40, height: 36, fill: freed ? "var(--red-soft)" : "var(--paper-3)", stroke: freed ? "var(--red)" : "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: x + i * 44 + 20, y: y + 23, "text-anchor": "middle", "font-size": 14, fill: freed ? "var(--red)" : "var(--ink)" }, freed ? "?" : String(v)));
    });
    svg.append(svgEl("text", { x, y: y + 52, "font-size": 11, fill: "var(--ink-dim)" }, freed ? "heap array (freed)" : "heap array"));
  }
  function arrow(x1, y1, x2, y2, color) {
    svg.append(svgEl("line", { x1, y1, x2, y2, stroke: color, "stroke-width": 2, "marker-end": "url(#oop-arrow)" }));
  }
  function paint(k) {
    const s = steps[k];
    svg.innerHTML = "";
    const defs = svgEl("defs"); const mk = svgEl("marker", { id: "oop-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" }); mk.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: "var(--hl)" })); defs.append(mk); svg.append(defs);
    const [vx, vy] = drawObj(20, 30, "v", 3, false);
    drawArr(360, 20, s.v.vals, !!s.v.freed);
    arrow(vx, vy, 360, 40, "var(--hl)");
    if (s.copy) {
      const [cx, cy] = drawObj(20, 120, "vCopy", 3, !!s.copy.dead);
      if (s.copy.own) { drawArr(360, 130, s.copy.vals, !!s.copy.dead); arrow(cx, cy, 360, 150, "var(--hl)"); }
      else arrow(cx, cy, 360, 50, "var(--red)");
    }
    codeWrap.querySelectorAll(".pl").forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === s.line));
    msg.className = "pv-msg " + (s.kind || "");
    msg.innerHTML = s.msg;
  }
  build();
}

// ---------- widget: dispatch-viz ----------
// virtual or not, Base& / Base* / Base copy, holding a Base or a Derived: which print() runs.
function dispatchViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "Which print() runs? Static type, dynamic type, virtual"));
  let isVirtual = cfg.virtual !== false, handle = cfg.handle || "ref", obj = cfg.object || "derived", qualified = false;
  const controls = el("div", "oop-controls");
  const t1 = toggle("print() is declared virtual in Base", isVirtual, (v) => { isVirtual = v; draw(); });
  controls.append(t1.row);
  const s1 = select("The handle", [["ref", "Base& h = ...   (reference)"], ["ptr", "Base* h = &...  (pointer)"], ["val", "Base h = ...    (a Base object, copy)"]], handle, (v) => { handle = v; draw(); });
  const s2 = select("The object", [["base", "Base b"], ["derived", "Derived d"]], obj, (v) => { obj = v; draw(); });
  const t2 = toggle("Qualified call: h.Base::print()", qualified, (v) => { qualified = v; draw(); });
  controls.append(s1.row, s2.row, t2.row);
  const codeWrap = el("div"), svg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg" }), out = el("div");
  box.append(controls, codeWrap, svg, out);
  function draw() {
    const objName = obj === "base" ? "b" : "d";
    const declH = handle === "ref" ? `Base& h = ${objName};` : handle === "ptr" ? `Base* h = &${objName};` : `Base h = ${objName};`;
    const call = qualified ? (handle === "ptr" ? "h->Base::print();" : "h.Base::print();") : (handle === "ptr" ? "h->print();" : "h.print();");
    const lines = ["class Base {", "public:", `    ${isVirtual ? "virtual " : ""}void print() { cout << "base\\n"; }`, "};", "class Derived : public Base {", "public:", `    void print()${isVirtual ? " override" : ""} { cout << "derived\\n"; }`, "};", "", "Base b;", "Derived d;", declH, call];
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(lines));
    // what runs
    let result, why;
    const sliced = handle === "val" && obj === "derived";
    if (qualified) { result = "base"; why = "A <b>qualified name</b> <code>Base::print</code> turns dynamic binding off: the call names one specific function, the base version, whatever the object is. This is how an override calls the original."; }
    else if (handle === "val") { result = "base"; why = sliced ? "<code>Base h = d;</code> <b>copies the Base part</b> of d into a brand-new Base object; the Derived part is sliced off. <code>h</code> is a Base, so it prints base, virtual or not. Polymorphism only works through pointers and references." : "<code>h</code> is a Base object holding a copy of b. Nothing polymorphic is happening; base prints."; }
    else if (!isVirtual) { result = "base"; why = `Without <code>virtual</code>, the call is bound at <b>compile time</b> to the <b>static type</b> of the handle, <code>Base</code>. The object behind it ${obj === "derived" ? "is a Derived, but the compiler never looks" : "is a Base anyway"}. Non-virtual members of the derived class cannot be reached through a base handle.`; }
    else { result = obj === "derived" ? "derived" : "base"; why = obj === "derived" ? "<code>print</code> is virtual, so the call is resolved at <b>run time</b> from the <b>dynamic type</b> of the object the handle refers to: a Derived. Dynamic binding (late binding, polymorphic dispatch) picks the override." : "<code>print</code> is virtual, but the object really is a Base, so the base version is the right one. Dynamic binding always asks the object."; }
    out.innerHTML = "";
    out.append(verdict(true, `Prints <b><code>${result}</code></b>. ${why}`));
    // picture: handle box -> object box
    svg.innerHTML = "";
    const hx = 40, ox = 380;
    svg.append(svgEl("rect", { x: hx, y: 30, width: 200, height: 80, rx: 8, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: hx + 100, y: 55, "text-anchor": "middle", "font-size": 13, fill: "var(--ink)", "font-weight": 700 }, handle === "val" ? "Base h (object)" : handle === "ref" ? "Base& h" : "Base* h"));
    svg.append(svgEl("text", { x: hx + 100, y: 78, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-dim)" }, `static type: Base`));
    svg.append(svgEl("text", { x: hx + 100, y: 98, "text-anchor": "middle", "font-size": 12, fill: handle === "val" ? "var(--red)" : "var(--green)" }, handle === "val" ? (sliced ? "holds a sliced copy: only the Base part" : "holds its own copy of b") : "refers to the object on the right"));
    const dyn = obj === "derived" ? "Derived" : "Base";
    svg.append(svgEl("rect", { x: ox, y: 20, width: 220, height: 100, rx: 8, fill: "var(--paper)", stroke: obj === "derived" ? "var(--blue)" : "var(--rule-strong)", opacity: handle === "val" ? 0.45 : 1 }));
    svg.append(svgEl("text", { x: ox + 110, y: 45, "text-anchor": "middle", "font-size": 13, fill: "var(--ink)", "font-weight": 700 }, `${dyn} ${objName}`));
    svg.append(svgEl("rect", { x: ox + 20, y: 58, width: 180, height: 22, rx: 4, fill: "var(--paper-3)", stroke: "var(--rule)" }));
    svg.append(svgEl("text", { x: ox + 110, y: 73, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, "Base part: Base::print"));
    if (obj === "derived") { svg.append(svgEl("rect", { x: ox + 20, y: 86, width: 180, height: 22, rx: 4, fill: "var(--blue-soft)", stroke: "var(--blue)" })); svg.append(svgEl("text", { x: ox + 110, y: 101, "text-anchor": "middle", "font-size": 11, fill: "var(--blue)" }, "Derived part: Derived::print")); }
    if (handle !== "val") svg.append(svgEl("line", { x1: hx + 200, y1: 70, x2: ox, y2: 70, stroke: "var(--hl)", "stroke-width": 2, "stroke-dasharray": handle === "ptr" ? "" : "6 4" }));
    svg.append(svgEl("text", { x: 320, y: 138, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)" }, `${call.replace(/;$/, "")}  →  ${result}`));
  }
  draw();
}

// ---------- widget: partitions ----------
// Pick test values for "a function that processes numbers between 100 and 999" and see which
// equivalence partitions and boundaries the tests cover.
function partitions(box, cfg) {
  const lo = cfg.lo ?? 100, hi = cfg.hi ?? 999, min = cfg.min ?? 0, max = cfg.max ?? 1500;
  box.append(el("h4", null, cfg.title || `Equivalence partitions for a function that accepts ${lo} to ${hi}`));
  box.append(note("Click the number line (or type a value) to add a test. A good set covers every partition once, hits both boundaries, and steps just outside each one. The slide's answer uses five tests."));
  const svg = svgEl("svg", { viewBox: "0 0 640 110", class: "curve-svg net-svg ogive-svg" });
  const row = el("div", "unit-row");
  const inp = document.createElement("input"); inp.type = "number"; inp.setAttribute("aria-label", "test value");
  const add = el("button", "reset-btn", "Add test"), clear = el("button", "reset-btn", "Clear");
  row.append(el("label", null, "test value"), inp, add, clear);
  const list = el("div", "sorted-line"), report = el("div", "stat-steps");
  box.append(svg, row, list, report);
  const tests = new Set((cfg.tests || []).map(Number));
  const X0 = 40, X1 = 600, xOf = (v) => X0 + ((X1 - X0) * (v - min)) / (max - min), vOf = (x) => Math.round(min + ((x - X0) / (X1 - X0)) * (max - min));
  const part = (v) => (v < lo ? "below" : v > hi ? "above" : "inside");
  function draw() {
    svg.innerHTML = "";
    const bands = [[min, lo - 1, "below " + lo, "var(--red-soft)"], [lo, hi, `${lo} to ${hi}`, "var(--green-soft)"], [hi + 1, max, "above " + hi, "var(--red-soft)"]];
    for (const [a, b, label, fill] of bands) {
      svg.append(svgEl("rect", { x: xOf(a), y: 30, width: Math.max(1, xOf(b + 1) - xOf(a)), height: 30, fill }));
      svg.append(svgEl("text", { x: (xOf(a) + xOf(b + 1)) / 2, y: 22, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, label));
    }
    svg.append(svgEl("line", { x1: X0, y1: 60, x2: X1, y2: 60, stroke: "var(--ink-dim)" }));
    for (const v of [min, lo, hi, max]) { svg.append(svgEl("line", { x1: xOf(v), y1: 56, x2: xOf(v), y2: 66, stroke: "var(--ink-dim)" })); svg.append(svgEl("text", { x: xOf(v), y: 80, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, String(v))); }
    for (const v of tests) { svg.append(svgEl("circle", { cx: xOf(v), cy: 45, r: 6, fill: part(v) === "inside" ? "var(--green)" : "var(--red)", stroke: "var(--paper)" })); svg.append(svgEl("text", { x: xOf(v), y: 100, "text-anchor": "middle", "font-size": 11, fill: "var(--hl)" }, String(v))); }
    list.innerHTML = "";
    list.append(el("span", "stat-label", "tests:"));
    [...tests].sort((a, b) => a - b).forEach((v) => { const s = el("span", "sorted-val", String(v)); s.title = "click to remove"; s.style.cursor = "pointer"; s.addEventListener("click", () => { tests.delete(v); draw(); }); list.append(s); });
    const have = (f) => [...tests].some(f);
    const checks = [
      ["partition: below " + lo, have((v) => v < lo)],
      [`partition: ${lo} to ${hi}`, have((v) => v >= lo && v <= hi)],
      ["partition: above " + hi, have((v) => v > hi)],
      [`boundary ${lo} (first valid value)`, tests.has(lo)],
      [`boundary ${hi} (last valid value)`, tests.has(hi)],
      [`just outside: ${lo - 1} or ${hi + 1}`, tests.has(lo - 1) || tests.has(hi + 1)],
      ["a typical value well inside", have((v) => v > lo + 10 && v < hi - 10)],
      ["a value far outside (\"waaay off\")", have((v) => v < lo - 10 || v > hi + 10)],
    ];
    const done = checks.filter((c) => c[1]).length;
    report.innerHTML = checks.map(([l, ok]) => `<div class="step ${ok ? "final" : ""}">${ok ? "✓" : "○"} ${l}</div>`).join("") + `<p class="widget-note">${done} of ${checks.length} covered with ${tests.size} test${tests.size === 1 ? "" : "s"}. ${done === checks.length ? "Every partition and boundary is exercised; more tests of the same partition add no coverage." : "Each test should exercise one and only one partition; boundaries and just-outside values find off-by-one bugs."}</p>`;
  }
  svg.addEventListener("click", (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); const v = vOf(p.x); if (v >= min && v <= max) { tests.add(v); draw(); } });
  add.addEventListener("click", () => { const v = Number(inp.value); if (Number.isFinite(v)) { tests.add(v); inp.value = ""; draw(); } });
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") add.click(); });
  clear.addEventListener("click", () => { tests.clear(); draw(); });
  draw();
}

// ---------- widget: abstract-check ----------
// Toggle pure / virtual / override on two functions across a three-class chain; see which classes
// are abstract and which declarations compile.
function abstractCheck(box, cfg) {
  box.append(el("h4", null, cfg.title || "Is the class abstract? Which lines compile?"));
  box.append(note("A class is abstract when it has, or inherits without overriding, at least one pure virtual function. Change the declarations and read the verdicts."));
  const state = { f: cfg.f || "pure", g: cfg.g || "virtual", bf: cfg.bf !== false, bg: !!cfg.bg, cf: !!cfg.cf, cg: !!cfg.cg };
  const controls = el("div", "oop-controls");
  const sf = select("A::f()", [["pure", "virtual void f() = 0;   (pure virtual)"], ["virtual", "virtual void f() { }   (virtual with a body)"], ["plain", "void f() { }   (not virtual)"]], state.f, (v) => { state.f = v; draw(); });
  const sg = select("A::g()", [["pure", "virtual void g() = 0;   (pure virtual)"], ["virtual", "virtual void g() { }   (virtual with a body)"], ["plain", "void g() { }   (not virtual)"]], state.g, (v) => { state.g = v; draw(); });
  controls.append(sf.row, sg.row);
  const tbf = toggle("B overrides f()", state.bf, (v) => { state.bf = v; draw(); }), tbg = toggle("B overrides g()", state.bg, (v) => { state.bg = v; draw(); });
  const tcf = toggle("C overrides f()", state.cf, (v) => { state.cf = v; draw(); }), tcg = toggle("C overrides g()", state.cg, (v) => { state.cg = v; draw(); });
  controls.append(tbf.row, tbg.row, tcf.row, tcg.row);
  const codeWrap = el("div"), out = el("div", "table-wrap"), summary = el("div", "stat-steps");
  box.append(controls, codeWrap, summary, out);
  function draw() {
    const decl = (n, k) => (k === "pure" ? `    virtual void ${n}() = 0;` : k === "virtual" ? `    virtual void ${n}() { }` : `    void ${n}() { }`);
    const ov = (n, on) => (on ? `    void ${n}() override { }` : null);
    const lines = ["class A {", "public:", decl("f", state.f), decl("g", state.g), "};", "class B : public A {", "public:", ov("f", state.bf), ov("g", state.bg), "};", "class C : public B {", "public:", ov("f", state.cf), ov("g", state.cg), "};"].filter((l) => l != null);
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(lines));
    // override of a non-virtual function with `override` is an error
    const badOverride = [];
    if (state.f === "plain" && (state.bf || state.cf)) badOverride.push("f");
    if (state.g === "plain" && (state.bg || state.cg)) badOverride.push("g");
    const pureA = ["f", "g"].filter((n) => state[n] === "pure");
    const pureB = pureA.filter((n) => !state["b" + n]);
    const pureC = pureB.filter((n) => !state["c" + n]);
    const abs = { A: pureA, B: pureB, C: pureC };
    const rows = [["A a;", "A"], ["B b;", "B"], ["C c;", "C"], ["A* p = new C;", null], ["A& r = c;", null], ["A f();", "A"], ["void h(A a);", "A"], ["A& k(A& a);", null]];
    let html = `<table class="group-table"><thead><tr><th>statement</th><th>compiles?</th><th>why</th></tr></thead><tbody>`;
    for (const [code, needs] of rows) {
      let ok, why;
      if (badOverride.length) { ok = false; why = `<code>override</code> on <code>${badOverride[0]}()</code> names a function that is not virtual in A: <b>error: '${badOverride[0]}' marked 'override', but does not override</b>.`; }
      else if (needs && abs[needs].length) { ok = false; why = `<code>${needs}</code> is abstract (pure virtual ${abs[needs].map((n) => `<code>${n}()</code>`).join(", ")} not overridden): it cannot be instantiated, returned by value, or taken by value.`; }
      else if (!needs) { ok = true; why = "Pointers and references to an abstract class are always allowed; that is how polymorphism is used."; }
      else { ok = true; why = `<code>${needs}</code> is concrete: every pure virtual function has been overridden somewhere above it.`; }
      html += `<tr><td><code>${esc(code)}</code></td><td>${ok ? '<span class="oop-yes">yes</span>' : '<span class="oop-no">no</span>'}</td><td>${why}</td></tr>`;
    }
    html += "</tbody></table>";
    out.innerHTML = html;
    summary.innerHTML = ["A", "B", "C"].map((c) => `<div class="step ${abs[c].length ? "error" : "final"}"><b>${c}</b> is ${abs[c].length ? `<b>abstract</b> (pure virtual: ${abs[c].join(", ")})` : "<b>concrete</b>"}${c === "A" && !pureA.length ? " (no pure virtual function at all)" : ""}</div>`).join("") + (badOverride.length ? `<div class="step error">A function marked <code>override</code> must override a <b>virtual</b> function of a base class.</div>` : "");
  }
  draw();
}

// ---------- widget: diamond-viz ----------
// person / student / mathematician / math_student with `virtual` toggles and the initializer list
// choice, showing the subobject layout, the constructor sequence, ambiguity and destruction order.
function diamondViz(box, cfg) {
  box.append(el("h4", null, cfg.title || "The diamond: how many grandparents, which constructor runs"));
  const state = { vs: cfg.virtualStudent ?? false, vm: cfg.virtualMath ?? false, init: cfg.init || "middle" };
  const controls = el("div", "oop-controls");
  const t1 = toggle("class student : virtual public person", state.vs, (v) => { state.vs = v; draw(); });
  const t2 = toggle("class mathematician : virtual public person", state.vm, (v) => { state.vm = v; draw(); });
  const s1 = select("math_student's initializer list", [["middle", ": student(name, passed), mathematician(name, proved)"], ["most", ": person(name), student(passed), mathematician(proved)"]], state.init, (v) => { state.init = v; draw(); });
  controls.append(t1.row, t2.row, s1.row);
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const codeWrap = el("div"), outBox = el("div", "pv-out"), msg = el("div", "stat-steps");
  box.append(controls, svg, codeWrap, el("div", "pv-title", "output of math_student bob(\"Robert Robson\", \"Algebra\", \"Fermat's Last Theorem\"); bob.all_info();"), outBox, msg);
  function draw() {
    const both = state.vs && state.vm, one = !both && (state.vs || state.vm);
    const lines = [
      "class person { string name; public:", "    person() { cout << \"person default constructor\\n\"; }", "    person(const string& n) : name(n) { cout << \"person 1-param constructor\\n\"; } };",
      `class student : ${state.vs ? "virtual " : ""}public person { string passed; public:`,
      "    student(const string& name, const string& passed)", "      : person(name), passed(passed) { cout << \"student constructor\\n\"; }",
      state.init === "most" ? "    student(const string& passed) : passed(passed) { cout << \"student 1-param constructor\\n\"; } };" : "};",
      `class mathematician : ${state.vm ? "virtual " : ""}public person { string proved; public:`,
      "    mathematician(const string& name, const string& proved)", "      : person(name), proved(proved) { cout << \"mathematician constructor\\n\"; }",
      state.init === "most" ? "    mathematician(const string& proved) : proved(proved) { cout << \"mathematician 1-param constructor\\n\"; } };" : "};",
      "class math_student : public student, public mathematician { public:",
      "    math_student(const string& name, const string& passed, const string& proved)",
      state.init === "most" ? "      : person(name), student(passed), mathematician(proved) { }" : "      : student(name, passed), mathematician(name, proved) { }",
      "};",
    ];
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(lines));
    // picture
    svg.innerHTML = "";
    const boxAt = (x, y, label, w = 130, color = "var(--rule-strong)") => { svg.append(svgEl("rect", { x, y, width: w, height: 34, rx: 6, fill: "var(--paper)", stroke: color })); svg.append(svgEl("text", { x: x + w / 2, y: y + 22, "text-anchor": "middle", "font-size": 12, fill: "var(--ink)" }, label)); };
    const line = (x1, y1, x2, y2, dashed) => svg.append(svgEl("line", { x1, y1, x2, y2, stroke: dashed ? "var(--hl)" : "var(--ink-dim)", "stroke-width": 1.5, "stroke-dasharray": dashed ? "5 4" : "" }));
    if (both) { boxAt(255, 10, "person (one, shared)", 130, "var(--green)"); line(320, 44, 200, 80, true); line(320, 44, 440, 80, true); }
    else if (one) { boxAt(120, 10, state.vs ? "person (virtual base)" : "person", 150, state.vs ? "var(--green)" : "var(--red)"); boxAt(370, 10, state.vm ? "person (virtual base)" : "person", 150, state.vm ? "var(--green)" : "var(--red)"); line(195, 44, 200, 80, state.vs); line(445, 44, 440, 80, state.vm); }
    else { boxAt(120, 10, "person #1", 130, "var(--red)"); boxAt(390, 10, "person #2", 130, "var(--red)"); line(185, 44, 200, 80, false); line(455, 44, 440, 80, false); }
    boxAt(135, 80, "student"); boxAt(375, 80, "mathematician");
    line(200, 114, 320, 150, false); line(440, 114, 320, 150, false);
    boxAt(255, 150, "math_student");
    svg.append(svgEl("text", { x: 320, y: 215, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-dim)" }, both ? "one person subobject inside bob" : one ? "still two person subobjects: only one side is virtual" : "two person subobjects inside bob (two grandparents)"));
    // output
    const out = [];
    const personCtor = (named) => (named ? "person 1-param constructor" : "person default constructor");
    let nameVal;
    if (!both) {
      // no shared base: each middle class constructs its own person as its initializer says
      if (state.init === "middle") { out.push(personCtor(true), "student constructor", personCtor(true), "mathematician constructor"); nameVal = "Robert Robson"; }
      else { out.push(personCtor(false), "student 1-param constructor", personCtor(false), "mathematician 1-param constructor"); nameVal = ""; }
    } else {
      // shared virtual base: the most derived class constructs person; middle-class person(...) calls are ignored
      if (state.init === "most") { out.push(personCtor(true), "student 1-param constructor", "mathematician 1-param constructor"); nameVal = "Robert Robson"; }
      else { out.push(personCtor(false), "student constructor", "mathematician constructor"); nameVal = ""; }
    }
    const nameShow = nameVal || "";
    out.push(`[student name=${nameShow}]`, "    I passed the following grades: Algebra", `[person name=${nameShow}]`, "    I proved: Fermat's Last Theorem");
    outBox.textContent = out.join("\n");
    const notes = [];
    if (!both) notes.push(`<div class="step error">Without <code>virtual</code> on <b>both</b> sides, bob contains <b>two</b> person subobjects, so two person constructors run and <code>bob.person::all_info()</code> or <code>bob.get_name()</code> is <b>ambiguous</b> (which grandparent?).</div>`);
    else notes.push(`<div class="step final">With <code>virtual</code> on both sides there is <b>one</b> shared person, constructed <b>first</b> and <b>only once</b>, and <code>person::all_info()</code> is unambiguous.</div>`);
    if (both && state.init === "middle") notes.push(`<div class="step error">The <code>person(name)</code> calls written in student and mathematician are <b>ignored</b> when they are constructed as part of a more derived class. Nobody named the person, so the compiler inserted <code>person()</code>: the name is lost (<code>name=</code> is empty). This is oop_multi2.cpp.</div>`);
    if (both && state.init === "most") notes.push(`<div class="step final">The <b>most derived class</b> constructs the virtual base: <code>: person(name), student(passed), mathematician(proved)</code>. The 1-param student and mathematician constructors do not touch person. This is oop_multi3.cpp.</div>`);
    if (!both && state.init === "most") notes.push(`<div class="step error">With no virtual base, <code>person(name)</code> in math_student's list is an error: person is not a direct base. The output shown assumes the compiler accepted only the 1-param middle constructors, which default-construct their own person.</div>`);
    notes.push(`<div class="step">Construction order: virtual bases first, then direct bases left to right (student, mathematician), then members, then the body. Destruction is the exact reverse (diamond.cpp: A B C D allocated, D C B A deallocated).</div>`);
    msg.innerHTML = notes.join("");
  }
  draw();
}

// ---------- widget: friend-check ----------
function friendCheck(box, cfg) {
  box.append(el("h4", null, cfg.title || "Friendship: who may read a private pin"));
  const state = { bossSpy: cfg.bossSpy !== false, spyMinion: !!cfg.spyMinion, spyBoss: !!cfg.spyBoss, section: cfg.section || "private" };
  const controls = el("div", "oop-controls");
  controls.append(toggle("Boss declares: friend class Spy;", state.bossSpy, (v) => { state.bossSpy = v; draw(); }).row);
  controls.append(toggle("Spy declares: friend class Boss;", state.spyBoss, (v) => { state.spyBoss = v; draw(); }).row);
  controls.append(toggle("Spy declares: friend class Minion;", state.spyMinion, (v) => { state.spyMinion = v; draw(); }).row);
  controls.append(select("Boss writes its friend line in the", [["private", "private section"], ["public", "public section"]], state.section, (v) => { state.section = v; draw(); }).row);
  const codeWrap = el("div"), out = el("div", "table-wrap");
  box.append(controls, codeWrap, out);
  function draw() {
    const lines = ["class Spy; // forward declaration", "class Boss {", `${state.section}:`, state.bossSpy ? "    friend class Spy;" : "    // (no friend declaration)", "    int pin;", "public:", "    Boss(int p) : pin(p) {}", "    void print(Spy* s);", "};", "class Spy {", state.spyBoss ? "    friend class Boss;" : "    // (no friend Boss)", state.spyMinion ? "    friend class Minion;" : "    // (no friend Minion)", "    int pin;", "public:", "    Spy(int p) : pin(p) {}", "    void print(Boss* b) { cout << b->pin; }", "};", "class Minion { public: void print(Boss* b) { cout << b->pin; } };", "class DoubleAgent : public Spy { public: void peek(Boss* b) { cout << b->pin; } };"];
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(lines));
    const rows = [
      ["Spy::print reads b->pin", state.bossSpy, state.bossSpy ? "Boss named Spy a friend, so Spy's member functions may read Boss's private members." : "Spy is not Boss's friend: <b>'int Boss::pin' is private within this context</b>."],
      ["Boss::print reads s->pin", state.spyBoss, state.spyBoss ? "Spy named Boss a friend." : "Friendship is not mutual: Boss granting access to Spy says nothing about Spy's pin. This is the shipped FriendClass.cpp, which does not compile until Spy adds <code>friend class Boss;</code>."],
      ["Minion::print reads b->pin", false, `Minion is Spy's friend${state.spyMinion ? "" : " only if declared, and even then"}: friendship is <b>not transitive</b>. Boss friend Spy and Spy friend Minion do not make Boss friend Minion.`],
      ["DoubleAgent::peek reads b->pin", false, "DoubleAgent derives from Spy, but friendship is <b>not inherited</b>: Boss befriended Spy, not Spy's derived classes."],
      ["main reads boss.pin", false, "pin is private; main is neither a member nor a friend."],
      ["the friend line sits in Boss's " + state.section + " section", true, "Access specifiers have <b>no effect</b> on a friend declaration; it may appear in the private, protected or public section."],
    ];
    out.innerHTML = `<table class="group-table"><thead><tr><th>access</th><th>compiles?</th><th>why</th></tr></thead><tbody>` + rows.map(([a, ok, why]) => `<tr><td><code>${esc(a)}</code></td><td>${ok ? '<span class="oop-yes">yes</span>' : '<span class="oop-no">no</span>'}</td><td>${why}</td></tr>`).join("") + "</tbody></table>";
  }
  draw();
}

// ---------- widget: op-dispatch ----------
// An expression on user-defined operands → the function call it really is, member or non-member,
// the canonical signature, and what it is defined in terms of.
const OPS = {
  "a + b": { fn: "operator+(a, b)", where: "friendly non-member", sig: "friend Fraction operator+(Fraction lhs, const Fraction& rhs)", ret: "a new value (returns a copy; lhs is taken by copy)", body: "lhs += rhs;\nreturn lhs;", why: "Binary, treats both operands equally and changes neither, so it is a non-member; defined in terms of +=." },
  "a += b": { fn: "a.operator+=(b)", where: "member of the left operand's type", sig: "Fraction& operator+=(const Fraction& rhs)", ret: "*this by reference (the modified left operand)", body: "// actual addition of rhs to *this\nreturn *this;", why: "Modifies the left-hand object, so it belongs to that object: a member. This is where the real work lives." },
  "a - b": { fn: "operator-(a, b)", where: "friendly non-member", sig: "friend Fraction operator-(Fraction lhs, const Fraction& rhs)", ret: "a new value (copy)", body: "lhs -= rhs;\nreturn lhs;", why: "Same shape as +: if you overload -, overload -= and define - in terms of it." },
  "a++": { fn: "a.operator++(0)", where: "member", sig: "Counter operator++(int)   // the dummy int marks POSTFIX", ret: "a copy of the ORIGINAL value (by value)", body: "Counter tmp(*this); // copy original value\noperator++();       // internal increment\nreturn tmp;         // return the non-incremented original", why: "Postfix is defined in terms of prefix and performs an extra copy, so it is slightly slower: prefer ++i in loops." },
  "++a": { fn: "a.operator++()", where: "member", sig: "Counter& operator++()   // no parameter: PREFIX", ret: "*this by reference", body: "// do actual increment\nreturn *this;", why: "Unary operators are members. If you overload one increment form, overload the other too." },
  "a < b": { fn: "operator<(a, b)", where: "friendly non-member", sig: "friend bool operator<(const X& lhs, const X& rhs)", ret: "bool", body: "/* do actual comparison */", why: "Symmetric comparison of two objects: non-member. The standard library's algorithms and containers expect operator< to exist." },
  "a == b": { fn: "operator==(a, b)", where: "friendly non-member", sig: "friend bool operator==(const X& lhs, const X& rhs)", ret: "bool", body: "/* do actual comparison */", why: "One of the two comparisons you actually write (== and <); the other four are one-liners built on them." },
  "a != b": { fn: "operator!=(a, b)", where: "friendly non-member", sig: "friend bool operator!=(const X& lhs, const X& rhs)", ret: "bool", body: "return !operator==(lhs, rhs);   // or !(lhs == rhs)", why: "Not equal is the negation of equal." },
  "a > b": { fn: "operator>(a, b)", where: "friendly non-member", sig: "friend bool operator>(const X& lhs, const X& rhs)", ret: "bool", body: "return operator<(rhs, lhs);   // or rhs < lhs", why: "Greater than is less than with the operands swapped." },
  "a <= b": { fn: "operator<=(a, b)", where: "friendly non-member", sig: "friend bool operator<=(const X& lhs, const X& rhs)", ret: "bool", body: "return !operator>(lhs, rhs);   // or !(lhs > rhs)", why: "lhs is less than or equal to rhs means lhs is not greater than rhs." },
  "a >= b": { fn: "operator>=(a, b)", where: "friendly non-member", sig: "friend bool operator>=(const X& lhs, const X& rhs)", ret: "bool", body: "return !operator<(lhs, rhs);   // or !(lhs < rhs)", why: "lhs is greater than or equal to rhs means lhs is not less than rhs." },
  "cout << a": { fn: "operator<<(cout, a)", where: "friendly non-member", sig: "friend std::ostream& operator<<(std::ostream& os, const T& obj)", ret: "os by reference, so the calls chain: cout << a << b", body: "os << obj.myString;   // write obj to stream\nreturn os;", why: "The left operand is a std::ostream, whose class we cannot edit, so it cannot be a member of the left operand: it must be a non-member, and a friend if it reads private data." },
  "cin >> a": { fn: "operator>>(cin, a)", where: "friendly non-member", sig: "friend std::istream& operator>>(std::istream& is, T& obj)", ret: "is by reference", body: "is >> obj.myVar;   // read obj from stream\nreturn is;", why: "Same reason as <<: the left operand is a stream. obj is a non-const reference because it is being filled in." },
  "a = b": { fn: "a.operator=(b)", where: "member", sig: "MyClass& MyClass::operator=(MyClass rhs)   // rhs BY VALUE", ret: "*this by reference", body: "mySwap(*this, rhs);\nreturn *this;", why: "Assignment modifies the left object, so it is a member; the copy-and-swap form takes rhs by value so the copy constructor does the copying." },
  "a + 5": { fn: "operator+(a, Fraction(5))", where: "friendly non-member", sig: "friend Fraction operator+(Fraction lhs, const Fraction& rhs)", ret: "a new value", body: "lhs += rhs;\nreturn lhs;", why: "5 is converted to a Fraction through the one-argument constructor, then the same non-member runs." },
  "5 + a": { fn: "operator+(Fraction(5), a)", where: "friendly non-member (a member could not do this)", sig: "friend Fraction operator+(Fraction lhs, const Fraction& rhs)", ret: "a new value", body: "lhs += rhs;\nreturn lhs;", why: "With a non-member, the LEFT operand can be converted too. A member operator+ would need 5 to be the object, and int has no members: the slide's 'flexibility for non-class types (int + MyClass)'." },
};
function opDispatch(box, cfg) {
  box.append(el("h4", null, cfg.title || "What an operator expression really calls"));
  const keys = Object.keys(OPS);
  let cur = OPS[cfg.expr] ? cfg.expr : "a + b";
  box.append(note("Pick an expression. Every operator is a function with a special name; the widget rewrites the expression as that call and shows the canonical form from the slides."));
  box.append(btnRow(keys, (i) => { cur = keys[i]; draw(); }, keys.indexOf(cur)));
  const out = el("div", "stat-grid"), codeWrap = el("div"), why = el("div", "stat-steps");
  box.append(out, codeWrap, why);
  function cell(l, v) { const c = el("div", "stat-cell"); c.append(el("div", "stat-label", l)); const val = el("div", "stat-value"); val.textContent = v; c.append(val); return c; }
  function draw() {
    const o = OPS[cur];
    out.innerHTML = "";
    out.append(cell("expression", cur), cell("is the call", o.fn), cell("implemented as", o.where), cell("returns", o.ret));
    codeWrap.innerHTML = "";
    codeWrap.append(codeBox([o.sig, "{", ...o.body.split("\n").map((l) => "    " + l), "}"]));
    why.innerHTML = `<div class="step final">${o.why}</div>`;
  }
  draw();
}

// ---------- widget: copy-swap ----------
// B = A with the copy-and-swap assignment operator, step by step; or with the compiler's default.
function copySwap(box, cfg) {
  box.append(el("h4", null, cfg.title || "B = A: the copy-and-swap assignment, step by step"));
  let mode = cfg.mode === "default" ? "default" : "swap";
  box.append(btnRow(["Copy-and-swap operator=", "Compiler-generated operator= (member-wise copy)"], (i) => { mode = i ? "default" : "swap"; build(); }, mode === "swap" ? 0 : 1));
  const codeWrap = el("div"), svg = svgEl("svg", { viewBox: "0 0 640 250", class: "curve-svg net-svg" }), msg = el("div", "pv-msg");
  const st = stepper(paint);
  box.append(codeWrap, st.bar, svg, msg);
  let steps = [];
  const A = [1, 2, 3], B = [7, 8];
  function build() {
    const code = mode === "swap"
      ? ["class Example {", "    size_t list_size;", "    int* my_list;", "public:", "    Example(const Example& other);   // deep copy", "    ~Example() { delete[] my_list; }", "    void mySwap(Example& first, Example& second) {", "        using std::swap;", "        swap(first.list_size, second.list_size);", "        swap(first.my_list, second.my_list);", "    }", "    Example& operator=(Example other) {   // BY VALUE", "        mySwap(*this, other);", "        return *this;", "    }", "};", "Example A(3), B(2);", "B = A;"]
      : ["class Example {", "    size_t list_size;", "    int* my_list;", "public:", "    ~Example() { delete[] my_list; }", "    // no operator= written: the compiler copies", "    // list_size and my_list member by member", "};", "Example A(3), B(2);", "B = A;", "// end of scope: ~B, then ~A"];
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(code, "pv-code"));
    steps = mode === "swap"
      ? [
        { line: 18, A: { arr: "A" }, B: { arr: "B" }, other: null, msg: "Before the assignment: A owns {1, 2, 3}, B owns {7, 8}. Two objects, two heap arrays." },
        { line: 12, A: { arr: "A" }, B: { arr: "B" }, other: { arr: "A2" }, msg: "<code>operator=(Example other)</code> takes its parameter <b>by value</b>, so the <b>copy constructor</b> builds <code>other</code>: a deep copy of A with its own array {1, 2, 3}." },
        { line: 13, A: { arr: "A" }, B: { arr: "A2" }, other: { arr: "B" }, msg: "<code>mySwap(*this, other)</code> exchanges the sizes and the <b>pointers</b> (no element is copied). B now owns the fresh copy of A's data; <code>other</code> holds B's old array." },
        { line: 14, A: { arr: "A" }, B: { arr: "A2" }, other: { arr: "B" }, msg: "<code>return *this;</code> hands back B by reference, so <code>C = B = A</code> would chain." },
        { line: 14, A: { arr: "A" }, B: { arr: "A2" }, other: { arr: "B", dead: true }, msg: "Leaving the function destroys <code>other</code>: its destructor runs <code>delete[]</code> on B's <b>old</b> array. The old data is freed exactly once, by the temporary. Copy constructor + destructor + swap did all the work with no duplicated code.", kind: "end" },
      ]
      : [
        { line: 10, A: { arr: "A" }, B: { arr: "B" }, other: null, msg: "Before the assignment: A owns {1, 2, 3}, B owns {7, 8}." },
        { line: 10, A: { arr: "A" }, B: { arr: "A", shared: true }, other: null, leaked: "B", msg: "The compiler's operator= copies <code>list_size</code> and copies the <b>pointer</b>. B's old array {7, 8} now has no pointer to it: <b>leaked</b>. Both objects point at the same array." },
        { line: 11, A: { arr: "A", freed: true }, B: { arr: "A", shared: true, dead: true }, other: null, leaked: "B", msg: "At the end of the scope <code>~B()</code> frees the shared array, then <code>~A()</code> frees it <b>again</b>: double free, undefined behaviour. A class that owns a pointer needs its own operator= (and copy constructor and destructor).", kind: "error" },
      ];
    st.reset(steps.length);
  }
  const ARR = { A: A, A2: A, B: B };
  function paint(k) {
    const s = steps[k];
    svg.innerHTML = "";
    const objs = [["A", s.A, 20, 20], ["B", s.B, 20, 160]];
    if (s.other) objs.push(["other (temporary)", s.other, 20, 90]);
    const arrPos = { A: 360, A2: 360, B: 360 };
    const ys = { A: 20, B: 160, A2: 90 };
    const drawn = new Set();
    for (const [name, o, x, y] of objs) {
      svg.append(svgEl("rect", { x, y, width: 170, height: 56, rx: 8, fill: "var(--paper)", stroke: o.dead ? "var(--red)" : "var(--rule-strong)", "stroke-dasharray": o.dead ? "5 4" : "" }));
      svg.append(svgEl("text", { x: x + 10, y: y + 20, "font-size": 13, fill: "var(--ink)", "font-weight": 700 }, name));
      const arr = ARR[o.arr];
      svg.append(svgEl("text", { x: x + 10, y: y + 42, "font-size": 12, fill: "var(--ink-2)" }, `list_size = ${arr.length}   my_list →`));
      const ay = ys[o.arr];
      if (!drawn.has(o.arr)) {
        drawn.add(o.arr);
        arr.forEach((v, i) => { svg.append(svgEl("rect", { x: arrPos[o.arr] + i * 44, y: ay + 10, width: 40, height: 34, fill: o.freed || (s.leaked === o.arr) ? "var(--red-soft)" : "var(--paper-3)", stroke: o.freed ? "var(--red)" : "var(--rule-strong)" })); svg.append(svgEl("text", { x: arrPos[o.arr] + i * 44 + 20, y: ay + 32, "text-anchor": "middle", "font-size": 14, fill: o.freed ? "var(--red)" : "var(--ink)" }, o.freed ? "?" : String(v))); });
      }
      svg.append(svgEl("line", { x1: x + 170, y1: y + 28, x2: arrPos[o.arr] - 4, y2: ay + 27, stroke: o.shared ? "var(--red)" : "var(--hl)", "stroke-width": 2 }));
    }
    if (s.leaked) { B.forEach((v, i) => { svg.append(svgEl("rect", { x: 360 + i * 44, y: 170, width: 40, height: 34, fill: "var(--red-soft)", stroke: "var(--red)", "stroke-dasharray": "4 3" })); svg.append(svgEl("text", { x: 380 + i * 44, y: 192, "text-anchor": "middle", "font-size": 14, fill: "var(--red)" }, String(v))); }); svg.append(svgEl("text", { x: 360, y: 222, "font-size": 11, fill: "var(--red)" }, "B's old array: nothing points here (leak)")); }
    codeWrap.querySelectorAll(".pl").forEach((r) => r.classList.toggle("cur", Number(r.dataset.line) === s.line));
    msg.className = "pv-msg " + (s.kind || "");
    msg.innerHTML = s.msg;
  }
  build();
}

// ---------- widget: uml-relations ----------
// Pick a class-diagram relationship: the arrow as UML draws it, the meaning, the C++ it maps to.
const UML = {
  "Association": { arrow: "line", head: "open", dash: false, meaning: "A reference-based relationship: A contains member variables of type B (or pointers to B). \"A knows about B.\"", code: "class Professor {\n    std::vector<Student*> listOfStudents;   // A has B members\n};", ex: "Professor — Student" },
  "Generalization (inheritance)": { arrow: "line", head: "triangle", dash: false, meaning: "A is a specialized form of B: a subclass. Every A is a B.", code: "class Student : public Person { };   // A is a B", ex: "Student ▷ Person" },
  "Realization (implementation)": { arrow: "line", head: "triangle", dash: true, meaning: "A implements the behaviours that interface B specifies: same hollow triangle, dashed line.", code: "class Animal { public: virtual void eat() = 0; virtual ~Animal() {} };\nclass Dog : public Animal { public: void eat() override { } };", ex: "Dog ⊳ Animal (interface)" },
  "Dependency": { arrow: "line", head: "open", dash: true, meaning: "A communicates with B without containing an instance: a method of A uses B as a parameter or local variable.", code: "class Car {\npublic:\n    void fit(Wheel& w);     // uses a Wheel, does not own one\n};", ex: "Car ‑‑> Wheel" },
  "Composition": { arrow: "line", head: "diamondFilled", dash: false, meaning: "A is made up of B objects and the parts cannot exist without the whole: destroy the order and its order_items go with it. Filled diamond on the whole.", code: "class Order {\n    std::vector<OrderItem> items;   // owned by value: dies with the Order\n};", ex: "Order ◆— OrderItem   0..1 to 1..*" },
  "Aggregation": { arrow: "line", head: "diamondHollow", dash: false, meaning: "A references B objects that live on if A is destroyed: the pond is drained, the ducks fly off. Hollow diamond on the whole.", code: "class Pond {\n    std::vector<Duck*> ducks;   // pointers: the ducks outlive the pond\n};", ex: "Pond ◇— Duck   0..1 to 0..*" },
};
function umlRelations(box, cfg) {
  box.append(el("h4", null, cfg.title || "Class-diagram relationships and the C++ they stand for"));
  const names = Object.keys(UML);
  let cur = UML[cfg.relation] ? cfg.relation : names[0];
  box.append(btnRow(names, (i) => { cur = names[i]; draw(); }, names.indexOf(cur)));
  const svg = svgEl("svg", { viewBox: "0 0 640 120", class: "curve-svg net-svg" }), text = el("div", "stat-steps"), codeWrap = el("div");
  box.append(svg, text, codeWrap);
  function draw() {
    const r = UML[cur];
    svg.innerHTML = "";
    const boxAt = (x, label) => { svg.append(svgEl("rect", { x, y: 30, width: 150, height: 60, fill: "var(--paper)", stroke: "var(--ink)" })); svg.append(svgEl("line", { x1: x, y1: 52, x2: x + 150, y2: 52, stroke: "var(--ink)" })); svg.append(svgEl("text", { x: x + 75, y: 46, "text-anchor": "middle", "font-size": 13, fill: "var(--ink)", "font-weight": 700 }, label)); svg.append(svgEl("text", { x: x + 8, y: 74, "font-size": 10, fill: "var(--ink-dim)" }, label === "A" ? "+ attributes" : "+ operations")); };
    boxAt(60, "A"); boxAt(430, "B");
    const y = 60, x1 = 210, x2 = 430;
    const hx = r.head === "diamondFilled" || r.head === "diamondHollow" ? x1 : x2;
    const lineFrom = r.head.startsWith("diamond") ? x1 + 24 : x1, lineTo = r.head.startsWith("diamond") ? x2 : x2 - (r.head === "triangle" ? 18 : 0);
    svg.append(svgEl("line", { x1: lineFrom, y1: y, x2: lineTo, y2: y, stroke: "var(--hl)", "stroke-width": 2, "stroke-dasharray": r.dash ? "8 6" : "" }));
    if (r.head === "triangle") svg.append(svgEl("polygon", { points: `${x2},${y} ${x2 - 18},${y - 10} ${x2 - 18},${y + 10}`, fill: "var(--paper)", stroke: "var(--hl)", "stroke-width": 2 }));
    if (r.head === "open") svg.append(svgEl("polyline", { points: `${x2 - 14},${y - 9} ${x2},${y} ${x2 - 14},${y + 9}`, fill: "none", stroke: "var(--hl)", "stroke-width": 2 }));
    if (r.head.startsWith("diamond")) svg.append(svgEl("polygon", { points: `${hx},${y} ${hx + 12},${y - 8} ${hx + 24},${y} ${hx + 12},${y + 8}`, fill: r.head === "diamondFilled" ? "var(--hl)" : "var(--paper)", stroke: "var(--hl)", "stroke-width": 2 }));
    svg.append(svgEl("text", { x: 320, y: 108, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, r.ex));
    text.innerHTML = `<div class="step final"><b>${cur}.</b> ${r.meaning}</div>`;
    codeWrap.innerHTML = ""; codeWrap.append(codeBox(r.code.split("\n")));
  }
  draw();
}

export const WIDGETS = {
  "access-matrix": accessMatrix,
  "ctor-picker": ctorPicker,
  "lifetime-trace": lifetimeTrace,
  "copy-viz": copyViz,
  "dispatch-viz": dispatchViz,
  "partitions": partitions,
  "abstract-check": abstractCheck,
  "diamond-viz": diamondViz,
  "friend-check": friendCheck,
  "op-dispatch": opDispatch,
  "copy-swap": copySwap,
  "uml-relations": umlRelations,
};
