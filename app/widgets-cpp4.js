// Interactive C++ widgets for COMP 3522 Week 7: rl-rule-step (the right-left rule of slides 24-42 as a
// stepper over the declaration's tokens) and elision-trace (the Number / MyClass examples of slides
// 13-21 and 95: which objects exist as the code is written, and which a C++17 compiler elides).
// Both run on the shared playback bar (app/playback.js), hand-advanced.
import { el, btnRow } from "./dom.js";
import { highlight } from "./highlight.js";
import { createPlayback } from "./playback.js";

// ---------- predict mode for the playback widgets (copied from app/widgets-stl.js) ----------
/**
 * questions(): [{ at, text, options: [{ label, ok, why }] }], `at` = the rest position the question holds.
 * The bar cannot pass `at` until the right option is picked; a wrong pick turns red and quotes the
 * rule; tally() gives the first-try score for the last caption. Moving back re-opens the questions.
 */
function predictGates(ask, questions, getPb) {
  const g = { on: false, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: -1, key: null, refocus: false };
  const cur = () => (g.on ? questions()[g.answered] || null : null);
  g.limit = () => { const q = cur(); return q ? q.at : Infinity; };
  g.asking = (pos) => { const q = cur(); return q && Math.abs(pos - q.at) < 1e-6 ? q : null; };
  g.restart = (pos = 0) => {
    g.answered = g.on ? questions().filter((q) => q.at < pos - 1e-9).length : 0;
    g.asked = 0; g.firstTry = 0; g.missed = false; g.wrong = -1; g.key = null;
  };
  g.tally = () => (g.asked > 0 ? ` ${g.firstTry} of ${g.asked} right on the first try.` : "");
  g.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  g.render = (pos) => {
    const q = g.asking(pos);
    const key = q ? `${g.answered}|${g.wrong}|${q.text}|${q.options.map((o) => o.label).join("|")}` : "";
    if (key === g.key) return;
    g.key = key; ask.innerHTML = ""; ask.hidden = !g.on || !q;
    if (!q) return;
    const btns = q.options.map((o, i) => {
      const b = el("button", "viz-btn" + (i === g.wrong ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => {
        if (!g.missed) g.asked++;
        g.refocus = e.detail === 0;
        if (!o.ok) { g.missed = true; g.wrong = i; getPb().set(getPb().pos()); return; }
        if (!g.missed) g.firstTry++;
        g.missed = false; g.wrong = -1; g.answered++;
        getPb().next();
      });
      ask.append(b);
      return b;
    });
    if (g.wrong >= 0) ask.append(el("span", "playback-feedback", `Not that. ${q.options[g.wrong].why}`));
    if (g.refocus) { g.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  };
  return g;
}
/** A predict checkbox, an ask row and a playback bar wired together. opts: checkText, predict, count(), unit, stepMs, questions(), onFrame(pos, playing, gate). */
function playbackWithPredict(opts) {
  const label = el("label", "playback-check");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!opts.predict;
  label.append(input, " " + opts.checkText);
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = true;
  let pb = null, lastPos = 0;
  const gate = predictGates(ask, opts.questions, () => pb);
  gate.on = input.checked;
  const onFrame = (pos, playing) => {
    // Moving back (restart, back, scrub) re-opens the questions at or after the new position.
    if (gate.on && !playing && pos < lastPos - 1e-9) { const qs = opts.questions(); while (gate.answered > 0 && qs[gate.answered - 1].at >= pos - 1e-9) gate.answered--; gate.missed = false; gate.wrong = -1; }
    lastPos = pos;
    opts.onFrame(pos, playing, gate); gate.render(pos);
  };
  pb = createPlayback({ count: opts.count(), unit: opts.unit, stepMs: opts.stepMs, onFrame, limit: () => gate.limit(), onBlocked: () => gate.nudge() });
  input.addEventListener("change", () => { gate.on = input.checked; pb.pause(); gate.restart(pb.pos()); gate.key = null; pb.set(pb.pos()); });
  return { pb, gate, check: label, ask, reset() { gate.restart(0); lastPos = 0; pb.reset(opts.count()); } };
}

// ---------- shared helpers ----------
function note(text) { const p = el("p", "widget-note"); p.innerHTML = text; return p; }
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function codeBox(lines) {
  const box = el("div", "oop-code");
  lines.forEach((text, i) => {
    const row = el("div", "pl"); row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", text) || " "}</span>`;
    box.append(row);
  });
  return box;
}
function markLines(box, lines) { box.querySelectorAll(".pl").forEach((r) => r.classList.toggle("cur", lines.includes(Number(r.dataset.line)))); }
/** Put the right option among wrong ones at a position that varies with k, so it is not always first. */
function placeOptions(right, wrongs, k) {
  const opts = wrongs.slice(0, 2);
  opts.splice(k % (opts.length + 1), 0, right);
  return opts;
}

// =====================================================================
// rl-rule-step: the right-left rule (slides 27-34), one token (or token group) per step
// =====================================================================
const RL_DEFAULT = "int (**var[])();";
const RL_PRESETS = [
  "int (&ref) [100] = a;", // slide 25
  "int (**var[])();", // slides 27-32
  "int * (* (*fp1) (int) ) [10];", // slide 33
  "int *( *( *arr[5])())();", // slide 34
  "int ***ppp;", "int (**ppa)[];", "int (**ppf)();", "int *(*pap)[];", "int (*paa)[][];", "int (*paf)[]();", // slide 35
];
// The slides' own phrases for their declarations (slides 31, 33, 34 and the keyed options of 36-41), one entry
// per step after the name; { n: 2, p } reads two generic steps at once (slide 36 and 39 say "int pointer").
const RL_SLIDE_PHRASES = {
  "int(&ref)[100]=a;": ["a reference to", "an array of 100", "ints"],
  "int(**var[])();": ["an array of", "pointers to", "pointers to", "a function that returns", "int"],
  "int*(*(*fp1)(int))[10];": ["a pointer", "to a function that takes an int parameter", "and returns a pointer", "to an array of 10", "pointers to", "ints"],
  "int*(*(*arr[5])())();": ["an array of 5", "pointers", "to functions", "that return pointers", "to functions", "that return pointers", "to ints"],
  "int***ppp;": ["a pointer to", "a pointer to", { n: 2, p: "an int pointer" }],
  "int(**ppa)[];": ["a pointer to", "a pointer to", "an array of", "ints"],
  "int(**ppf)();": ["a pointer to", "a pointer to", "a function returning", "an int"],
  "int*(*pap)[];": ["a pointer to", "an array of", { n: 2, p: "int pointers" }],
  "int(*paa)[][];": ["a pointer to", "an array of", "arrays of", "ints"],
  "int(*paf)[]();": ["a pointer to", "an array of", "functions returning", "an int"],
};
const CV = new Set(["const", "volatile"]);
// Words a base type of more than one word may be made of (a one-word base can be any class name).
const TYPE_WORDS = new Set(["const", "volatile", "unsigned", "signed", "short", "long", "int", "char", "double", "float", "bool", "void", "wchar_t", "char8_t", "char16_t", "char32_t", "static", "extern", "constexpr", "inline", "mutable", "thread_local"]);

/** Tokens of one declaration, or { error } when it cannot be tokenized. */
function rlTokenize(src) {
  const s = String(src == null ? "" : src), toks = [];
  let i = 0, opSeen = false, lead = 0, leading = true;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < s.length && /[\w:]/.test(s[j])) j++;
      toks.push({ t: "id", text: s.slice(i, j) }); if (leading) lead++; i = j; continue;
    }
    leading = false;
    if (c === "&" && s[i + 1] === "&") { toks.push({ t: "&&", text: "&&" }); opSeen = true; i += 2; continue; }
    if (c === "*" || c === "&") { toks.push({ t: c, text: c }); opSeen = true; i++; continue; }
    if (c === ",") return { error: "more than one declaration: the rule reads one name at a time" };
    if (c === "[") {
      const j = s.indexOf("]", i); if (j < 0) return { error: "an unclosed [" };
      const inner = s.slice(i + 1, j).trim(); if (/[[\]();]/.test(inner)) return { error: "brackets inside [ ]" };
      toks.push({ t: "[]", text: `[${inner}]`, size: inner }); i = j + 1; continue;
    }
    if (c === "(") {
      const prev = toks[toks.length - 1];
      const params = prev && (prev.t === ")" || prev.t === "[]" || prev.t === "()" || (prev.t === "id" && !CV.has(prev.text) && (opSeen || lead >= 2)));
      if (params) {
        let depth = 0, j = i;
        for (; j < s.length; j++) { if (s[j] === "(") depth++; else if (s[j] === ")" && --depth === 0) break; }
        if (j >= s.length) return { error: "unbalanced parentheses" };
        const inner = s.slice(i + 1, j).replace(/\s+/g, " ").trim();
        toks.push({ t: "()", text: `(${inner})`, params: inner }); i = j + 1; continue;
      }
      toks.push({ t: "(", text: "(" }); opSeen = true; i++; continue;
    }
    if (c === ")") { toks.push({ t: ")", text: ")" }); i++; continue; }
    if (c === "=") {
      const j = s.indexOf(";", i), end = j < 0 ? s.length : j;
      const init = s.slice(i + 1, end).trim(); if (!init) return { error: "an empty initializer" };
      // A comma at depth 0 starts a second declarator; one inside ( ), { }, [ ] or template < > does not.
      // A < straight after a name (pair<int, int>) opens template arguments; a spaced a < b is less-than.
      let d = 0, angle = 0;
      for (let k = 0; k < init.length; k++) {
        const ch = init[k];
        if ("({[".includes(ch)) d++; else if (")}]".includes(ch)) d--;
        else if (ch === "<" && /\w/.test(init[k - 1] || "")) angle++; else if (ch === ">" && angle > 0) angle--;
        else if (ch === "," && d === 0 && angle === 0) return { error: "more than one declaration: the rule reads one name at a time" };
      }
      toks.push({ t: "=", text: `= ${init}` }); i = end; continue;
    }
    if (c === ";") { toks.push({ t: ";", text: ";" }); if (s.slice(i + 1).trim()) return { error: "more than one declaration" }; break; }
    return { error: `the character ${c}` };
  }
  return { toks };
}

/**
 * What a ( ... ) straight after the name is: "init" (direct-initialization, such as Number n(5)),
 * "func" (a parameter list) or "vexing" (could be either; C++ reads a function: the most vexing parse).
 */
function parenKind(inner) {
  const t = inner.trim();
  if (!t) return "vexing";
  if (t === "void") return "func";
  const args = []; let d = 0, cur = "";
  for (const ch of t) { if ("({[<".includes(ch)) d++; else if (")}]>".includes(ch)) d--; if (ch === "," && d === 0) { args.push(cur.trim()); cur = ""; } else cur += ch; }
  args.push(cur.trim());
  let vexing = false, func = false;
  for (const a of args) {
    const first = (a.match(/^[A-Za-z_][\w:]*/) || [""])[0];
    if (/^[-+]?[\d.]|^['"{]|^(true|false|nullptr)\b/.test(a)) return "init";
    if (TYPE_WORDS.has(first) && !["static", "extern", "constexpr", "inline", "mutable", "thread_local"].includes(first)) { func = true; continue; }
    if (/^[A-Za-z_][\w:]*(?![\w:])(\s*<[^>]*>)?\s*([*&]|[A-Za-z_])/.test(a)) { func = true; continue; }
    if (/^[A-Za-z_][\w:]*\s*\(\s*(\*?\s*[A-Za-z_][\w:]*)?\s*\)$/.test(a)) { vexing = true; continue; }
    return "init";
  }
  return func ? "func" : vexing ? "vexing" : "init";
}

/** Generic phrase for one step, with the plural state the reading has reached. */
function rlPhrase(step, toks, plural, prevKind) {
  const tk = toks[step.toks[step.toks.length - 1]];
  switch (step.kind) {
    case "[]": return tk.size ? (plural ? `arrays of ${tk.size}` : `an array of ${tk.size}`) : (plural ? "arrays of" : "an array of");
    case "()": {
      const p = tk.params && tk.params !== "void" ? tk.params : "";
      if (!p) return plural ? "functions that return" : "a function that returns";
      return plural ? `functions that take (${p}) and return` : `a function that takes (${p}) and returns`;
    }
    case "*": { const cv = step.cv ? step.cv + " " : ""; return plural ? `${cv}pointers to` : `a ${cv}pointer to`; }
    case "&": return plural ? "references to" : "a reference to";
    case "&&": return plural ? "rvalue references to" : "an rvalue reference to";
    case "base": {
      const b = step.base;
      if (plural) return b.replace(/(\w+)$/, "$1s");
      if (prevKind === "()" || b === "void") return b;
      return (/^[aeiou]/i.test(b) ? "an " : "a ") + b;
    }
    default: return "";
  }
}

/**
 * Reads a declaration with the slide's five steps. Returns { error } or
 * { toks, name, base, steps: [{ toks: [i], kind, dir, pass, phrase, caption }], sentence, notes: [html] }.
 */
export function rlRead(decl) {
  const tz = rlTokenize(decl);
  if (tz.error) return { error: tz.error };
  const toks = tz.toks, n = toks.length;
  if (!n) return { error: "it is empty" };
  let depth = 0;
  for (const t of toks) { if (t.t === "(") depth++; else if (t.t === ")" && --depth < 0) return { error: "unbalanced parentheses" }; }
  if (depth) return { error: "unbalanced parentheses" };
  let run = 0; while (run < n && toks[run].t === "id") run++;
  if (!run) return { error: "no type word at the start" };
  let b, ni;
  const after = toks[run];
  if (after && (after.t === "*" || after.t === "&" || after.t === "&&" || after.t === "(")) {
    b = run; ni = -1;
    for (let i = run; i < n; i++) if (toks[i].t === "id" && !CV.has(toks[i].text)) { ni = i; break; }
    if (ni < 0) return { error: "no variable name" };
  } else { b = run - 1; ni = run - 1; }
  if (b < 1) return { error: "no type word before the name" };
  if (CV.has(toks[ni].text)) return { error: "no variable name" };
  if (b > 1 && toks.slice(0, b).some((t) => !TYPE_WORDS.has(t.text))) return { error: "two names in a row before the declarator" };
  if (toks.slice(0, b).every((t) => CV.has(t.text))) return { error: `no base type: ${toks[0].text} needs a type such as int` };
  const name = toks[ni].text, baseWords = toks.slice(0, b).map((t) => t.text);
  // cv-qualifiers first, as people say it: int const x and const int x both read "a const int".
  const base = [...baseWords.filter((w) => CV.has(w)), ...baseWords.filter((w) => !CV.has(w))].join(" ");
  let paren = null;
  if (toks[ni + 1] && toks[ni + 1].t === "()") {
    const kind = parenKind(toks[ni + 1].params);
    if (kind === "init") { toks[ni + 1] = { t: "init", text: toks[ni + 1].text }; paren = "init"; } else paren = kind;
  }
  const steps = [{ toks: [ni], kind: "name", dir: null, pass: 0 }];
  let L = ni - 1, R = ni + 1, pass = 0, guard = 0;
  for (;;) {
    if (++guard > 100) return { error: "it does not end" };
    let rightCount = 0;
    while (R < n && (toks[R].t === "[]" || toks[R].t === "()")) { steps.push({ toks: [R], kind: toks[R].t, dir: "right", pass }); R++; rightCount++; }
    const rStop = R < n ? toks[R] : null;
    let first = true;
    while (L >= b && (toks[L].t === "*" || toks[L].t === "&" || toks[L].t === "&&" || (toks[L].t === "id" && CV.has(toks[L].text)))) {
      if (toks[L].t === "id") {
        if (!(L - 1 >= b && toks[L - 1].t === "*")) return { error: `${toks[L].text} where a * should be` };
        steps.push({ toks: [L - 1, L], kind: "*", cv: toks[L].text, dir: "left", pass, after: first ? { rightCount, rStop } : null }); L -= 2;
      } else { steps.push({ toks: [L], kind: toks[L].t, dir: "left", pass, after: first ? { rightCount, rStop } : null }); L--; }
      first = false;
    }
    if (L >= b && toks[L].t === "(") {
      if (!rStop || rStop.t !== ")") return { error: "parentheses that do not pair up around the name" };
      L--; R++; pass++; continue;
    }
    if (L >= b) return { error: `found ${toks[L].t === "id" ? `the name ${toks[L].text}` : `"${toks[L].text}"`} where the rule expects a *, a & or an opening parenthesis` };
    if (rStop && rStop.t === ")") return { error: "unbalanced parentheses" };
    const idx = []; for (let i = 0; i < b; i++) idx.push(i);
    steps.push({ toks: idx, kind: "base", base, dir: "left", pass, after: first ? { rightCount, rStop } : null });
    break;
  }
  // Only an initializer and a semicolon may follow.
  let k = R; if (k < n && (toks[k].t === "=" || toks[k].t === "init")) k++; if (k < n && toks[k].t === ";") k++;
  if (k < n) return { error: `${toks[k].text} after the declaration` };
  const init = toks.some((t) => t.t === "=" || t.t === "init");

  // Generic phrases, then the slide's own wording for its declarations.
  let plural = false, prev = "name";
  for (const s of steps) {
    if (s.kind === "name") { s.phrase = `${name} is`; continue; }
    s.plural = plural; s.phrase = rlPhrase(s, toks, plural, prev);
    if (s.kind === "[]") plural = true; else if (s.kind === "()") plural = false;
    prev = s.kind;
  }
  const generic = steps.map((s) => s.phrase);
  const key = String(decl).replace(/\s+/g, "");
  const slide = RL_SLIDE_PHRASES[key];
  let out = steps;
  if (slide) {
    const merged = [steps[0]]; let gi = 1, ok = true;
    for (const e of slide) {
      const cnt = typeof e === "string" ? 1 : e.n, p = typeof e === "string" ? e : e.p;
      const grp = steps.slice(gi, gi + cnt); if (grp.length < cnt) { ok = false; break; }
      merged.push({ ...grp[0], toks: grp.flatMap((g) => g.toks), kinds: grp.map((g) => g.kind), phrase: p, merged: cnt > 1 });
      gi += cnt;
    }
    if (ok && gi === steps.length) out = merged;
  }
  // Captions in the slide's words.
  const tokText = (s) => s.toks.map((i) => toks[i].text).join(" ");
  const seen = new Set();
  for (const s of out) {
    if (s.kind === "name") { s.caption = `Start from the variable name (${name}): "${name} is ..."`; continue; }
    const what = s.merged ? `the last ${toks[s.toks[0]].text} and the type word ${base} together (the slide reads them as one: "${s.phrase}")` : s.kind === "base" ? `the type word ${base}: "${s.phrase}"` : `${tokText(s)}: "${s.phrase}"`;
    const passKey = `${s.dir}|${s.pass}`, isFirst = !seen.has(passKey); seen.add(passKey);
    let rule;
    if (!isFirst) rule = s.kind === "base" ? "Continue left, find" : `Still going ${s.dir}, find`;
    else if (s.dir === "right") rule = s.pass === 0 ? "Keep going right. Read what we see until we see right parentheses ). Find" : "Exit parentheses and go right. Read what we see until right parentheses or semicolon. Find";
    else {
      const stop = s.after && s.after.rStop ? (s.after.rStop.t === ";" ? "the semicolon" : s.after.rStop.t === "=" || s.after.rStop.t === "init" ? `the initializer ${s.after.rStop.text}` : ")") : "the end";
      const nothing = s.after && s.after.rightCount === 0 ? `Nothing to the right but ${stop}, so go left. ` : "";
      rule = s.pass === 0 ? (nothing ? `${nothing}Read what we see until we see left parentheses (. Find` : `Then go left of ${name}. Read what we see until we see left parentheses (. Find`) : `${nothing}Go left of where we exited the parentheses. Read what we see until left parentheses or finish. Find`;
    }
    s.caption = `${rule} ${what}.`;
  }
  const sentence = out.map((s) => s.phrase).join(" ");
  // Notes: what does not compile (server errors in courses/comp3522-w7/_SOURCE-NOTES.md).
  const notes = [], ks = steps.filter((s) => s.kind !== "name").map((s) => ({ kind: s.kind, tk: toks[s.toks[0]] }));
  for (let i = 0; i + 1 < ks.length; i++) {
    const a = ks[i].kind, c = ks[i + 1];
    if (a === "[]" && c.kind === "()") notes.push(`This one does not compile: C++ has no arrays of functions (g++: <code>declaration of '${escHtml(name)}' as array of functions</code>). The rule still reads it.`);
    else if (a === "[]" && c.kind === "[]" && !c.tk.size) notes.push(`This one does not compile: only the first bound of an array may be left out, because the element type must be complete (g++: <code>declaration of '${escHtml(name)}' as multidimensional array must have bounds for all dimensions except the first</code>). The rule still reads it.`);
    else if (a === "[]" && (c.kind === "&" || c.kind === "&&")) notes.push("This one does not compile: C++ has no arrays of references. The rule still reads it.");
    else if (a === "()" && c.kind === "()") notes.push("This one does not compile: a function cannot return a function (return a pointer to one instead). The rule still reads it.");
    else if (a === "()" && c.kind === "[]") notes.push("This one does not compile: a function cannot return an array (return a pointer to one instead). The rule still reads it.");
    else if ((a === "*" || a === "&" || a === "&&") && (c.kind === "&" || c.kind === "&&")) notes.push("This one does not compile: there are no pointers or references to references. The rule still reads it.");
  }
  if (ks.length && ks[0].kind === "[]" && !ks[0].tk.size && !init) notes.push(`As a standalone definition, <code>${escHtml(name)}[]</code> needs a bound or an initializer (g++: <code>storage size of '${escHtml(name)}' isn't known</code>); with a bound such as <code>[3]</code>, or as <code>extern</code>, it compiles. The reading is the same.`);
  if (paren === "init") notes.push(`Initialized with <code>${escHtml(toks[ni + 1].text)}</code>: the parentheses after the name hold a value, so this is direct-initialization of an object, not a function.`);
  if (paren === "vexing") {
    // Empty parentheses after a name are an ordinary function declaration (slide 42's func_returning_ptr_to_int());
    // the note is for Number n(); and Number n(Number(x)); where an object was probably meant.
    const plainName = ni === b, inner = toks[ni + 1].params.trim(), objectFix = plainName ? ` For an object, use braces: <code>${escHtml(base)} ${escHtml(name)}{${escHtml(inner)}};</code>${inner ? "" : ` or no parentheses: <code>${escHtml(base)} ${escHtml(name)};</code>`}.` : "";
    if (inner) notes.push(`C++ reads this as a function declaration: when <code>${escHtml(toks[ni + 1].text)}</code> could be a parameter list, it is one (the most vexing parse).${objectFix}`);
    else if (plainName) notes.push(`Empty parentheses after the name declare a function, not an object built by its default constructor (the most vexing parse).${objectFix}`);
  }
  if (paren === "func") {
    // (x * y) or (x & y) is a parameter list only if x names a type; for a variable x it is an expression.
    const amb = toks[ni + 1].params.split(",").map((a) => a.trim().match(/^([A-Za-z_][\w:]*)\s*(\*|&&?)\s*[A-Za-z_]\w*$/)).find((m) => m && !TYPE_WORDS.has(m[1]) && m[1] !== base && !m[1].startsWith("std::"));
    if (amb) notes.push(`Read as a parameter list, because <code>${escHtml(amb[1])}</code> is taken to name a type: then <code>${escHtml(amb[0])}</code> declares a parameter. If <code>${escHtml(amb[1])}</code> is a variable, it is an expression instead, and ${escHtml(name)} is ${/^[aeiou]/i.test(base) ? "an" : "a"} ${escHtml(base)} initialized with it.`);
  }
  if (ks.length && (ks[0].kind === "&" || ks[0].kind === "&&") && !init) notes.push("A reference must be initialized, so as a definition this needs <code>= something</code>. The reading is the same.");
  return { toks, name, base, steps: out, generic, sentence, notes, slideWording: out !== steps };
}

function rlRuleStep(box, cfg) {
  box.append(el("h4", null, cfg.title || "The right-left rule, one step at a time"));
  const presets = Array.isArray(cfg.presets) && cfg.presets.length ? cfg.presets.map(String) : RL_PRESETS;
  const st = { decl: typeof cfg.decl === "string" ? cfg.decl : RL_DEFAULT, r: null, qs: [] };
  const presetRow = btnRow(presets, (i) => { st.decl = presets[i]; field.value = st.decl; build(); }, presets.indexOf(st.decl));
  const field = document.createElement("input");
  field.type = "text"; field.className = "comp-input"; field.spellcheck = false; field.value = st.decl; field.setAttribute("aria-label", "declaration");
  field.addEventListener("change", () => { st.decl = field.value; presetRow.querySelectorAll(".viz-btn").forEach((b, i) => b.classList.toggle("active", presets[i] === st.decl)); build(); });
  const bad = el("div"), cells = el("div", "stl-cells"), sentence = el("p", "playback-caption"), caption = el("p", "playback-caption"), notes = el("div");
  caption.setAttribute("aria-live", "polite");
  sentence.style.fontFamily = "var(--mono)";

  const KIND_WORD = { "*": "pointer to", "&": "reference to", "[]": "array of", "()": "function returning" };
  function buildQuestions(r) {
    const qs = [];
    if (!r || r.error) return qs;
    r.steps.forEach((s, k) => {
      if (k === 0) return;
      const tokText = s.toks.map((i) => r.toks[i].text).join(" ");
      const kind = s.kinds ? s.kinds[0] : s.kind;
      // Wrong options: what the same position would read as if the token were another kind.
      const fake = (kd) => {
        const plural = !!s.plural;
        return { "*": plural ? "pointers to" : "a pointer to", "[]": plural ? "arrays of" : "an array of", "()": plural ? "functions returning" : "a function returning", "&": plural ? "references to" : "a reference to" }[kd];
      };
      const order = kind === "base" || s.merged ? ["()", "[]", "*"] : ["*", "[]", "()", "&"].filter((x) => x !== kind);
      const wrongs = [];
      for (const kd of order) {
        let w = fake(kd);
        if (kind === "base" || s.merged) w = `${fake(kd)} ${r.base}`;
        if (w && w !== s.phrase && !wrongs.includes(w)) wrongs.push(w);
      }
      const why = `Reading ${tokText}: going left, * is "pointer to" and & is "reference to"; going right, [ ] is "array of" and ( ) is "function returning"; the type words at the far left are what it all ends in.`;
      qs.push({ at: k - 1, text: `Next the rule reads ${tokText}. What does it add to "${r.steps.slice(0, k).map((x) => x.phrase).join(" ")} ..."?`, options: placeOptions({ label: s.phrase, ok: true, why }, wrongs.map((w) => ({ label: w, ok: false, why })), k) });
    });
    return qs;
  }

  function frame(pos, playing, gate) {
    const r = st.r;
    cells.innerHTML = ""; sentence.innerHTML = "";
    if (!r || r.error) { const t = "Nothing to step through: type a declaration such as int (**var[])();"; if (caption.textContent !== t) caption.textContent = t; return; }
    const k = Math.max(0, Math.min(r.steps.length - 1, Math.ceil(pos - 1e-9)));
    const done = new Set(), cur = new Set(r.steps[k].toks);
    for (let i = 0; i < k; i++) r.steps[i].toks.forEach((t) => done.add(t));
    r.toks.forEach((t, i) => {
      const c = el("div", "stl-cell"), bx = el("div", "stl-box" + (cur.has(i) ? "" : done.has(i) ? " t" : " f"), t.text);
      bx.style.minWidth = "0";
      if (!cur.has(i) && !done.has(i)) bx.style.opacity = "0.6";
      if (cur.has(i)) { bx.style.background = "var(--hl-soft)"; bx.style.fontWeight = "600"; }
      c.append(bx); cells.append(c);
    });
    const last = k === r.steps.length - 1;
    sentence.innerHTML = r.steps.slice(0, k + 1).map((s, i) => (i === k ? `<b>${escHtml(s.phrase)}</b>` : escHtml(s.phrase))).join(" ") + (last ? "" : " ...");
    const q = gate.asking(pos);
    const text = q ? q.text : r.steps[k].caption + (last ? ` Done: "${r.sentence}".${gate.tally()}` : "");
    if (caption.textContent !== text) caption.textContent = text;
    notes.hidden = !last;
  }
  const play = playbackWithPredict({ checkText: "Predict each phrase before the rule reads it", predict: cfg.predict, count: () => (st.r && !st.r.error ? st.r.steps.length - 1 : 1), unit: "step", stepMs: () => cfg.stepMs || 3000, questions: () => st.qs, onFrame: frame });
  box.append(note("Slides 27 to 31: start from the variable name; keep going right until a right parenthesis <code>)</code>; then go left until a left parenthesis <code>(</code>; exit the parentheses and go right until <code>)</code> or the semicolon; go left of where you exited until <code>(</code> or the finish; repeat as needed. Going right, <code>[ ]</code> reads \"array of\" and <code>( )</code> \"function returning\"; going left, <code>*</code> reads \"pointer to\" and <code>&amp;</code> \"reference to\"."), presetRow, field, bad, play.check, cells, sentence, caption, play.ask, play.pb.el, notes);
  function build() {
    let r;
    try { r = rlRead(st.decl); } catch (e) { r = { error: "it could not be read" }; }
    st.r = r; st.qs = buildQuestions(r);
    bad.innerHTML = ""; notes.innerHTML = "";
    if (r.error) bad.append(note(`Not a declaration the rule can read (${escHtml(r.error)}).`));
    else r.notes.forEach((t) => notes.append(note(t)));
    play.reset();
  }
  build();
}

// =====================================================================
// elision-trace: constructor calls as written on the slide versus what a C++17 compiler (g++) does
// =====================================================================
const NUMBER_CLASS = ["class Number {", "private:", "    int num;", "public:", "    Number(int n) : num (n) {}", "    Number(const Number &n2) {num = n2.num;}", "};", ""];
/**
 * Each object frame: { line(s), who: [slide, compiler], ctor, elided, text: [slide, compiler] }. elided is a boolean
 * (struck out in compiler mode only) or [slide, compiler] when the slide itself counts no copy for that object.
 * Frame 0 is the starting statement and the last frame the count. Compiler counts match the server's
 * output for slide13-rvo.cpp, slide16-nrvo.cpp, slide17-temp.cpp and slide95-param.cpp (courses/comp3522-w7/_SOURCE-NOTES.md).
 */
const ELISION_CASES = {
  rvo: {
    label: "RVO: return Number(num);", type: "Number", slides: "slides 13 to 15",
    code: [...NUMBER_CLASS, "Number createNumber(int num)", "{", "    return Number(num);", "}", "", "Number n = createNumber(5);"],
    start: { lines: [14], text: "Number n = createNumber(5); calls createNumber(5). Slide 14: how many objects of type Number are created?" },
    frames: [
      { lines: [11], who: ["temporary Number(num)", "n (Number(num))"], ctor: "1-param constructor", elided: false, text: ["return Number(num); runs the 1-param constructor: a temporary Number inside createNumber.", "return Number(num); is a prvalue of type Number that initializes n, so the 1-param constructor builds it directly in the memory space of n (slide 15). Since C++17 this is guaranteed elision from a prvalue."] },
      { lines: [11], who: ["return value", "return value"], ctor: "copy constructor", elided: true, text: ["Returning by value copies the temporary into a temporary object that holds the function's return value (slide 23): copy constructor.", "No temporary holds the return value: the object is already n. Guaranteed elision from a prvalue, not an optimization a compiler may skip."] },
      { lines: [14], who: ["n", "n"], ctor: "copy constructor", elided: true, text: ["n is initialized from the returned temporary: copy constructor again.", "n is the object the 1-param constructor already built, so no copy runs: guaranteed elision from a prvalue."] },
    ],
    end: ["As written on the slide: 3 Number objects (the temporary, the return value, n): one 1-param constructor and two copies.", "C++17 compiler: 1 Number object, built by the 1-param constructor straight into n. The server prints only 1-param constructor."],
    counts: [3, 1],
  },
  nrvo: {
    label: "NRVO: return tempN;", type: "Number", slides: "slide 16",
    code: [...NUMBER_CLASS, "Number createNumber(int num)", "{", "    Number tempN(num);", "    return tempN;", "}", "", "Number n = createNumber(5);"],
    start: { lines: [15], text: "Number n = createNumber(5); calls createNumber(5), which now names its object before returning it." },
    frames: [
      { lines: [11], who: ["tempN", "n (tempN)"], ctor: "1-param constructor", elided: false, text: ["Number tempN(num); runs the 1-param constructor: a named local inside createNumber.", "Number tempN(num); runs the 1-param constructor. With NRVO, g++ builds tempN directly in the memory space of n, even though the returned object is named (slide 16)."] },
      { lines: [12], who: ["return value", "return value"], ctor: "copy constructor", elided: true, text: ["return tempN; copies the local into a temporary object that holds the return value: copy constructor.", "return tempN; copies nothing: NRVO. It is optional (slide 16: no guarantee that all compilers use it), and GCC does it. A compiler that skips it copies tempN here once."] },
      { lines: [15], who: ["n", "n"], ctor: "copy constructor", elided: true, text: ["n is initialized from the returned temporary: copy constructor again.", "The call createNumber(5) is a prvalue initializing n, so no copy into n: guaranteed elision."] },
    ],
    end: ["As written on the slide: 3 Number objects (tempN, the return value, n): one 1-param constructor and two copies.", "C++17 compiler (g++, which does NRVO): 1 Number object, tempN built straight into n. The server prints only 1-param constructor. Without NRVO it would be 2."],
    counts: [3, 1],
  },
  temp: {
    label: "Temporary: Number n (Number(2));", type: "Number", slides: "slides 17 to 20",
    code: [...NUMBER_CLASS, "Number n (Number(2));"],
    start: { lines: [9], text: "Number n (Number(2)); Slide 17: which constructor is called after the Number(2) object is created?" },
    frames: [
      { lines: [9], who: ["temporary Number(2)", "n (Number(2))"], ctor: "1-param constructor", elided: false, text: ["Number(2) runs the 1-param constructor: a temporary Number.", "Number(2) is a prvalue of type Number initializing n, so the 1-param constructor builds n itself. Since C++17 this is guaranteed elision from a prvalue."] },
      { lines: [9], who: ["n", "n"], ctor: "copy constructor", elided: true, text: ["Based on the code (slide 18), n is built from the temporary: copy constructor.", "With copy elision (slides 19 and 20) the compiler avoids the call to the copy constructor and directly calls the 1-param constructor."] },
    ],
    end: ["As written on the slide (slide 18, based on code): 2 Number objects (the temporary and n): the 1-param constructor, then the copy constructor.", "C++17 compiler: 1 Number object; nothing runs after Number(2). The server prints only 1-param constructor."],
    counts: [2, 1],
  },
  param: {
    label: "Parameter: return mcCopy;", type: "MyClass", slides: "slide 95",
    code: ["class MyClass {", "public:", "    MyClass() {}", "    MyClass(const MyClass &other) {}", "};", "", "MyClass myFunction(MyClass mcCopy)", "{", "    //local mcCopy is a copy of the mc that was passed in", "    return mcCopy; //return value is also copied", "}", "", "MyClass mc;", "MyClass mc2 = myFunction(mc);"],
    start: { lines: [13, 14], text: "MyClass mc; then MyClass mc2 = myFunction(mc); (slide 95), where myFunction takes its MyClass by value and returns that parameter." },
    frames: [
      { lines: [13], who: ["mc", "mc"], ctor: "default constructor", elided: false, text: ["MyClass mc; runs the default constructor.", "MyClass mc; runs the default constructor."] },
      { lines: [7, 14], who: ["mcCopy", "mcCopy"], ctor: "copy constructor", elided: false, text: ["Passing mc by value builds the parameter mcCopy: copy constructor.", "Passing mc by value builds the parameter mcCopy: copy constructor. Nothing elides this: mc is an lvalue the caller keeps."] },
      { lines: [10], who: ["return value", "mc2 (return value)"], ctor: "copy constructor", elided: false, text: ["return mcCopy; copies the parameter into the object that holds the return value: copy constructor (slide 95: return value is also copied).", "return mcCopy; copies the parameter into mc2's memory: copy constructor (MyClass has no move constructor, so the copy is used). A parameter is never elided: NRVO applies only to a function's own locals."] },
      { lines: [14], who: ["mc2 (from the return value)", "mc2"], ctor: "copy constructor", elided: [true, true], text: ["mc2 is initialized from the return value, and slide 95 names no copy for it: the return value is mc2, so no copy constructor runs here.", "myFunction(mc) is a prvalue initializing mc2, so mc2 is the object the return statement built: guaranteed elision, no further copy."] },
    ],
    end: ["As written on the slide: 3 MyClass objects (mc, mcCopy, the return value that initializes mc2): one default constructor and two copies, the parameter copy and the return-value copy.", "C++17 compiler: 3 MyClass objects (mc, mcCopy, mc2): one default constructor and two copies. The server's Number version prints 1-param constructor, copy constructor, copy constructor."],
    counts: [3, 3],
  },
};

/** The frames for one case and mode ("slide" | "compiler"): [{ lines, boxes: [{ who, ctor, elided, cur }], text, count }]. */
export function elisionFrames(caseName, mode) {
  const c = ELISION_CASES[caseName] || ELISION_CASES.rvo, m = mode === "compiler" ? 1 : 0;
  const out = [{ lines: c.start.lines, boxes: [], text: c.start.text, count: 0 }];
  const boxes = [];
  c.frames.forEach((f) => {
    const elided = Array.isArray(f.elided) ? f.elided[m] : m === 1 && f.elided;
    boxes.forEach((b) => (b.cur = false));
    boxes.push({ who: f.who[m], ctor: f.ctor, elided, cur: true });
    out.push({ lines: f.lines, boxes: boxes.map((b) => ({ ...b })), text: f.text[m], count: boxes.filter((b) => !b.elided).length });
  });
  boxes.forEach((b) => (b.cur = false));
  const count = boxes.filter((b) => !b.elided).length;
  out.push({ lines: [], boxes: boxes.map((b) => ({ ...b })), text: c.end[m], count, done: true });
  return out;
}

function elisionTrace(box, cfg) {
  const st = { name: ELISION_CASES[cfg.case] ? cfg.case : "rvo", mode: cfg.mode === "compiler" ? "compiler" : "slide", frames: [], qs: [] };
  const names = Object.keys(ELISION_CASES);
  box.append(el("h4", null, cfg.title || "Copy elision: which objects really get made"));
  const caseRow = btnRow(names.map((k) => ELISION_CASES[k].label), (i) => { st.name = names[i]; build(true); }, names.indexOf(st.name));
  const modeRow = btnRow(["as written on the slide", "C++17 compiler"], (i) => { st.mode = i ? "compiler" : "slide"; build(false); }, st.mode === "compiler" ? 1 : 0);
  const codeWrap = el("div"), cells = el("div", "stl-cells"), caption = el("p", "playback-caption"), grid = el("div", "stat-grid");
  caption.setAttribute("aria-live", "polite");
  let code = null;
  st.frames = elisionFrames(st.name, st.mode);

  function buildQuestions() {
    const c = ELISION_CASES[st.name], fr = st.frames, qs = [];
    const NONE = "nothing: the copy is elided", firstCtor = c.frames[0].ctor;
    const ctorOpts = [...new Set([firstCtor, "copy constructor"])];
    for (let k = 1; k < fr.length - 1; k++) {
      const b = fr[k].boxes[fr[k].boxes.length - 1], right = b.elided ? NONE : b.ctor;
      const all = [...ctorOpts, NONE].filter((x, i, a) => a.indexOf(x) === i);
      const why = st.mode === "compiler" ? "Since C++17 a prvalue of the same type initializes the object directly (guaranteed elision); NRVO of a named local is optional and g++ does it; a parameter is never elided." : st.name === "param" ? "Slide 95 counts two copies: the by-value parameter mcCopy and the return value (return value is also copied); mc2 is initialized from that return value with no further copy." : "As written, every by-value copy runs: a by-value parameter, the temporary that holds a return value, and initializing a variable from a temporary each call the copy constructor.";
      const src = c.frames[k - 1], ln = src.lines[src.lines.length - 1], who = src.who[st.mode === "compiler" ? 1 : 0];
      qs.push({ at: k - 1, text: `Line ${ln}: ${c.code[ln - 1].replace(/\s*\/\/.*$/, "").trim()} Which constructor runs for ${/^(temporary|return)/.test(who) ? "the " : ""}${who}?`, options: placeOptions({ label: right, ok: true, why }, all.filter((x) => x !== right).map((x) => ({ label: x, ok: false, why })), k) });
    }
    const n = fr[fr.length - 1].count, cand = [...new Set([n - 1, n, n + 1, n + 2].filter((x) => x >= 1))].filter((x) => x !== n).slice(0, 2);
    const why = `Count the boxes that are not struck out: ${c.end[st.mode === "compiler" ? 1 : 0]}`;
    qs.push({ at: fr.length - 2, text: `How many ${c.type} objects are created ${st.mode === "compiler" ? "by a C++17 compiler (g++)" : "as written on the slide"}?`, options: placeOptions({ label: String(n), ok: true, why }, cand.map((x) => ({ label: String(x), ok: false, why })), n) });
    return qs;
  }
  function frame(pos, playing, gate) {
    const fr = st.frames, k = Math.max(0, Math.min(fr.length - 1, Math.ceil(pos - 1e-9))), f = fr[k];
    if (code) markLines(code, f.lines);
    cells.innerHTML = "";
    if (!f.boxes.length) cells.append(el("div", "pv-empty", "no objects yet"));
    f.boxes.forEach((b) => {
      const c = el("div", "stl-cell");
      c.append(el("div", "stl-ptrs", b.who));
      const bx = el("div", "stl-box" + (b.elided ? " f stl-off" : b.cur ? "" : " t"), b.elided ? `${b.ctor}: elided` : b.ctor);
      if (b.cur && !b.elided) bx.style.background = "var(--hl-soft)";
      c.append(bx); cells.append(c);
    });
    grid.innerHTML = "";
    const asking = !!gate.asking(pos);
    const stat = (label, value, extra) => { const c = el("div", "stat-cell"); c.append(el("div", "stat-label", label), el("div", "stat-value", value)); if (extra) c.append(el("div", "stat-note", extra)); return c; };
    grid.append(stat(`${ELISION_CASES[st.name].type} objects`, asking ? "?" : String(f.count), asking ? "answer first" : f.done ? "in total" : "so far"), stat("mode", st.mode === "compiler" ? "C++17 compiler" : "as written", st.mode === "compiler" ? "g++ -std=c++20, as the server runs it" : "the slide's count"));
    const q = gate.asking(pos);
    const text = q ? q.text : f.text + (f.done ? gate.tally() : "");
    if (caption.textContent !== text) caption.textContent = text;
  }
  const play = playbackWithPredict({ checkText: "Predict each constructor call before it runs", predict: cfg.predict, count: () => st.frames.length - 1, unit: "step", stepMs: () => cfg.stepMs || 3000, questions: () => st.qs, onFrame: frame });
  box.append(note("Slide 12: copy elision avoids unnecessary copying of objects; RVO is the part of it for objects returned from a function. Since C++17, initializing an object from a prvalue of the same type is <b>guaranteed</b> to elide the copy; NRVO (returning a named local) is still optional, and g++ does it; returning a <b>parameter</b> is never elided."), caseRow, modeRow, codeWrap, play.check, cells, caption, play.ask, play.pb.el, grid);
  function build(newCase) {
    st.frames = elisionFrames(st.name, st.mode); st.qs = buildQuestions();
    if (newCase || !code) { codeWrap.innerHTML = ""; code = codeBox(ELISION_CASES[st.name].code); codeWrap.append(code); play.reset(); return; }
    // Same case, other mode: keep the position, re-open the questions from here.
    const p = play.pb.pos(); play.gate.restart(p); play.gate.key = null; play.pb.set(p);
  }
  build(true);
}

export const WIDGETS = {
  "rl-rule-step": rlRuleStep,
  "elision-trace": elisionTrace,
};
