// COMP 4736 (Operating Systems) widgets for Part 1 (computer hardware review) and Part 2 (OS structures
// and clocks): the pipeline, the direct-mapped cache, the programmable clock, the alarm list, the ALU,
// starting an I/O device and getting an interrupt, and the rwx bits.
// Facts and wording: spec/comp4736/p1/_SOURCE-NOTES.md, p2/_SOURCE-NOTES.md, midterm/_SOURCE-NOTES.md.
import { el, btnRow } from "./dom.js";
import { createPlayback } from "./playback.js";

// ---------- shared helpers ----------
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const SP = " "; // narrow no-break space between digit groups
/** Display form of a number: up to d decimals, digit groups from 10 000 up, a real minus sign. */
function num(v, d = 4) {
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  let str = Math.abs(r).toFixed(d);
  if (str.includes(".")) str = str.replace(/0+$/, "").replace(/\.$/, "");
  const [int, frac] = str.split(".");
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, SP) : int;
  return (r < 0 ? "−" : "") + grouped + (frac ? "." + frac : "");
}
const intStr = (v) => num(Math.round(v), 0);
function cell(label, value, note) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label), el("div", "stat-value", value));
  if (note) { const n = el("div", "stat-note"); n.innerHTML = note; c.append(n); }
  return c;
}
/** Re-renders a stat grid only when its content changes (frames run every animation frame). */
function statGrid() {
  const out = el("div", "stat-grid");
  let last = "";
  return {
    el: out,
    set(rows) {
      const key = JSON.stringify(rows);
      if (key === last) return;
      last = key; out.innerHTML = "";
      for (const [l, v, n] of rows) out.append(cell(l, v, n));
    },
  };
}
function inputRow(label, input, after) {
  const row = el("div", "unit-row");
  row.append(el("label", null, label), input);
  if (after) row.append(after);
  return row;
}
function textInput(value, label, width) {
  const i = document.createElement("input");
  i.type = "text"; i.spellcheck = false; i.value = value; i.setAttribute("aria-label", label);
  if (width) i.style.width = width;
  return i;
}
function numberInput(value, label, opts = {}) {
  const i = document.createElement("input");
  i.type = "number"; i.step = opts.step || "any"; i.value = value; i.setAttribute("aria-label", label);
  if (opts.min != null) i.min = opts.min;
  if (opts.max != null) i.max = opts.max;
  if (opts.cls) i.className = opts.cls;
  return i;
}
function button(label, onClick, cls = "viz-btn") {
  const b = el("button", cls, label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
function setActive(row, i) { [...row.children].forEach((b, j) => b.classList.toggle("active", j === i)); }
const smooth01 = (u) => { const c = clamp(u, 0, 1); return c * c * (3 - 2 * c); };
const lerp = (a, b, t) => a + (b - a) * t;
const andJoin = (a) => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
const orJoin = (a) => (a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " or " + a[a.length - 1]);
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Predict mode for a playback. A question is asked at rest position k (before step k + 1) for every k with
 * isQ(k); the playback cannot pass an unanswered question. `redraw` repaints the current frame.
 */
function predictKit(ask, label, getPb, redraw, isQ = () => true) {
  const s = { on: false, done: new Set(), asked: 0, firstTry: 0, missed: false, wrong: null, wrongs: new Set(), key: null, refocus: false, isQ };
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  row.append(cb, " " + label);
  s.row = row;
  s.set = (v) => { s.on = !!v; cb.checked = s.on; };
  s.reset = () => { s.done = new Set(); s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.wrongs = new Set(); s.key = null; };
  s.next = (n) => { for (let k = 0; k < n; k++) if (s.isQ(k) && !s.done.has(k)) return k; return n; };
  s.limit = (n) => (s.on ? s.next(n) : n);
  /** The rest position whose question is on screen, or −1. */
  s.asking = (pos, n) => { if (!s.on) return -1; const k = s.next(n); return k < n && Math.abs(pos - k) < 1e-6 ? k : -1; };
  s.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  s.tally = () => (s.asked > 0 ? ` ${s.firstTry} of ${s.asked} right on the first try.` : "");
  function pick(k, o, e) {
    s.asked += s.wrong == null && !s.missed ? 1 : 0;
    s.refocus = e.detail === 0;
    if (!o.ok) { s.missed = true; s.wrong = o.label; s.wrongs.add(o.label); redraw(); return; }
    if (!s.missed) s.firstTry++;
    s.missed = false; s.wrong = null; s.wrongs = new Set(); s.done.add(k);
    getPb().next();
  }
  /** Shows the answer buttons for question k (k < 0 hides them). opts: [{ label, ok, why }]; `why` is quoted after a wrong pick. */
  s.render = (k, keyBase, opts) => {
    const key = k >= 0 ? `${keyBase}|${k}|${s.wrong}` : "";
    if (key === s.key) return;
    s.key = key; ask.innerHTML = ""; ask.hidden = !s.on;
    if (!key) return;
    const btns = opts.map((o) => {
      const b = el("button", "viz-btn" + (s.wrongs.has(o.label) ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => pick(k, o, e));
      ask.append(b);
      return b;
    });
    const w = opts.find((o) => o.label === s.wrong);
    if (w) ask.append(el("span", "playback-feedback", `Not ${w.label}. ${w.why}`));
    if (s.refocus) { s.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  };
  cb.addEventListener("change", () => {
    const pb = getPb();
    s.on = cb.checked; pb.pause(); s.reset();
    // Steps already on screen count as answered; the questions start at the next one.
    const p = Math.ceil(pb.pos() - 1e-9);
    for (let k = 0; k < p; k++) s.done.add(k);
    pb.set(pb.pos());
  });
  return s;
}
/** Caption paragraph and the answer row every playback widget uses. */
function captionParts() {
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = true;
  return { caption, ask, say: (t) => { if (caption.textContent !== t) caption.textContent = t; } };
}
/** Unique option list with the right answer kept; numbers are sorted. */
function options(right, others, why, fmt = String) {
  const vals = [right, ...others].filter((v, i, a) => v != null && a.findIndex((w) => fmt(w) === fmt(v)) === i);
  if (vals.every((v) => typeof v === "number")) vals.sort((a, b) => a - b);
  return vals.map((v) => ({ label: fmt(v), ok: fmt(v) === fmt(right), why }));
}

// ---------- widget: pipeline-play ----------
// The slide's car-factory pipeline (slides 35-40) and the practice paper's Q1. One step = one cycle time.
const PIPE_PRESETS = [
  ["slide: car factory", { stages: [1, 1, 2], unit: "h", items: 4 }],
  ["practice Q1", { stages: [3, 3, 5], unit: "ns", items: 4, names: ["Fetch", "Decode", "Execute"] }],
  ["no pipeline: one 4 h stage", { stages: [4], unit: "h", items: 4 }],
];
function pipelinePlay(box, cfg) {
  const okStages = (a) => Array.isArray(a) && a.length >= 1 && a.length <= 6 && a.every((v) => Number.isFinite(v) && v > 0 && v <= 1000);
  let stages = okStages(cfg.stages) ? cfg.stages.map(Number) : [1, 1, 2];
  let unit = cfg.unit === "ns" ? "ns" : "h";
  let items = clamp(Math.round(cfg.items) || 4, 1, 8);
  let names = Array.isArray(cfg.names) && cfg.names.length === stages.length ? cfg.names.map(String) : null;
  let pb = null;

  box.append(el("h4", null, cfg.title || "The pipeline, one cycle time per step"));
  const presetRow = el("div", "viz-btn-row");
  if (cfg.presets !== false) {
    PIPE_PRESETS.forEach(([label, p], i) => presetRow.append(button(label, () => {
      stages = p.stages.slice(); unit = p.unit; items = p.items; names = p.names ? p.names.slice() : null;
      stagesIn.value = stages.join(" "); unitSel.value = unit; itemsIn.value = items;
      setActive(presetRow, i); restart();
    })));
    const match = PIPE_PRESETS.findIndex(([, p]) => p.stages.join(" ") === stages.join(" ") && p.unit === unit);
    setActive(presetRow, match);
    box.append(presetRow);
  }
  const stagesIn = textInput(stages.join(" "), "stage delays", "130px");
  const unitSel = document.createElement("select");
  unitSel.setAttribute("aria-label", "time unit");
  for (const u of ["h", "ns"]) { const o = document.createElement("option"); o.value = u; o.textContent = u; unitSel.append(o); }
  unitSel.value = unit;
  const itemsIn = numberInput(items, "items", { min: 1, max: 8, step: 1 });
  itemsIn.style.width = "70px";
  box.append(inputRow("stage delays", stagesIn, unitSel), inputRow(unit === "h" ? "cars" : "items", itemsIn));
  const itemsLabel = itemsIn.parentElement.querySelector("label");
  const { caption, ask, say } = captionParts();
  const P = predictKit(ask, "Predict each cycle before it runs", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 400 200", class: "curve-svg net-svg os-svg", role: "img", "aria-label": "pipeline stages and the timeline of which item each stage holds" });
  const stats = statGrid();
  const note = el("p", "widget-note");
  box.append(P.row, svg, caption, ask);

  const n = () => stages.length;
  const CT = () => Math.max(...stages);
  const count = () => items + n() - 1;
  const word = (k = 1) => (unit === "h" ? (k === 1 ? "car" : "cars") : (k === 1 ? "instruction" : "instructions"));
  const tm = (v) => `${num(v, 3)} ${unit}`;
  const label = (s) => (names ? names[s] : `S${s + 1}`);
  /** Item (1-based) held by stage s (0-based) during cycle c, or 0. */
  const holder = (s, c) => { const i = c - s; return i >= 1 && i <= items ? i : 0; };
  const doneAfter = (c) => clamp(c - n() + 1, 0, items);
  function capFor(c) {
    const ct = CT(), N = count();
    const maxText = n() > 1 ? `max{${stages.map((v) => num(v, 3)).join(", ")}} = ` : "";
    if (c <= 0) {
      return n() > 1
        ? `Cycle time = the slowest stage = ${maxText}${tm(ct)}: every ${tm(ct)} one ${word()}. Press Play to send ${items} ${word(items)} through the ${n()} stages, one cycle per step.`
        : `With one stage the cycle time is the whole job: ${tm(ct)}, every ${tm(ct)} one ${word()}. Press Play to send ${items} ${word(items)} through.`;
    }
    const held = [];
    for (let s = 0; s < n(); s++) { const i = holder(s, c); if (i) held.push(held.length ? `${label(s)} ${word()} ${i}` : `${label(s)} holds ${word()} ${i}`); }
    let t = `Cycle ${c} (${num((c - 1) * ct, 3)}–${tm(c * ct)}): ${held.join(", ")}.`;
    if (c === 1 && n() > 1 && stages[0] < ct) t += ` ${label(0)} needs only ${tm(stages[0])} but holds ${word()} 1 for the whole ${tm(ct)} cycle: every stage moves on the same clock.`;
    const d = c - n() + 1;
    if (d >= 1 && d <= items) {
      t += d === 1
        ? ` ${cap1(word())} 1 leaves after ${n()} × ${tm(ct)} = ${tm(n() * ct)} (latency = stages × cycle time).`
        : ` ${cap1(word())} ${d} leaves at ${tm(c * ct)}, ${tm(ct)} after ${word()} ${d - 1}: every ${tm(ct)} one ${word()}.`;
    }
    if (c >= N) t += ` All ${items} ${word(items)} are done after ${N} cycles × ${tm(ct)} = ${tm(N * ct)}.` + P.tally();
    return t;
  }
  function question(k) {
    const c = k + 1, ct = CT(), lo = Math.max(1, c - n() + 1), hi = Math.min(items, c);
    if (n() > 1 && (c % 2 === 1 || c < n()) && lo <= hi) {
      const car = lo <= 3 && 3 <= hi ? 3 : hi;
      const s = c - car;
      return {
        text: `Before cycle ${c} (${num((c - 1) * ct, 3)}–${tm(c * ct)}): which stage holds ${word()} ${car}?`,
        opts: stages.map((_, j) => ({ label: label(j), ok: j === s, why: `${cap1(word())} ${car} enters ${label(0)} in cycle ${car} and moves one stage per cycle, so in cycle ${c} it is in ${label(s)}.` })),
      };
    }
    const ans = doneAfter(c);
    const why = ans === 0
      ? `A ${word()} is finished only when it leaves the last stage, and ${word()} 1 needs ${n()} cycles for that.`
      : `A ${word()} is finished when it leaves the last stage: ${word()} 1 after ${n()} cycles, then one more every cycle, so after cycle ${c}: ${c} − ${n()} + 1 = ${ans}.`;
    return {
      text: `How many ${word(2)} are finished after cycle ${c} (at ${tm(c * ct)})?`,
      opts: options(ans, [ans - 1, ans + 1, ans + 2].filter((v) => v >= 0 && v <= items), why),
    };
  }
  function frame(pos) {
    const N = count(), ct = CT(), q = P.asking(pos, N);
    const c = Math.ceil(pos - 1e-9), f = c === 0 ? 1 : pos - (c - 1), mv = smooth01(f / 0.35);
    const W = 400, gap = 12, bw = Math.min(76, (W - 20 - (n() - 1) * gap) / n()), x0 = (W - (n() * bw + (n() - 1) * gap)) / 2;
    const bx = (s) => x0 + s * (bw + gap);
    const TL = 112, rowH = 20, colX = 52, cw = (W - colX - 4) / N;
    const H = TL + 16 + n() * rowH + 18;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";
    // Stage boxes, each with its work bar: the stage's own delay against the cycle time.
    for (let s = 0; s < n(); s++) {
      const x = bx(s), busy = c > 0 && holder(s, c);
      svg.append(svgEl("text", { x: x + bw / 2, y: 13, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, label(s)));
      svg.append(svgEl("rect", { x, y: 20, width: bw, height: 50, rx: 6, fill: busy ? "var(--hl-soft)" : "var(--paper)", stroke: busy ? "var(--hl)" : "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: x + bw / 2, y: 66, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, tm(stages[s])));
      const share = stages[s] / ct, work = c === 0 ? 0 : busy ? clamp((f * ct) / stages[s], 0, 1) : 0;
      svg.append(svgEl("rect", { x, y: 75, width: bw, height: 5, rx: 2, fill: "var(--paper-3)" }));
      svg.append(svgEl("rect", { x, y: 75, width: bw * share, height: 5, rx: 2, fill: "none", stroke: "var(--ink-dim)", "stroke-width": 0.8 }));
      if (work > 0) svg.append(svgEl("rect", { x, y: 75, width: bw * share * work, height: 5, rx: 2, fill: "var(--blue)" }));
      if (s < n() - 1) svg.append(svgEl("path", { d: `M${x + bw + 2} 45 l${gap - 5} 0 m-4 -4 l4 4 l-4 4`, stroke: "var(--ink-dim)", fill: "none" }));
    }
    // Tokens: during the first third of a step each item slides one stage on; the last one leaves.
    const token = (cx, i, op) => {
      const g = svgEl("g", { opacity: op });
      g.append(svgEl("rect", { x: cx - 17, y: 32, width: 34, height: 22, rx: 6, fill: "var(--blue-soft)", stroke: "var(--blue)" }));
      g.append(svgEl("text", { x: cx, y: 47, "text-anchor": "middle", "font-size": 12, fill: "var(--ink)", "font-weight": 700 }, String(i)));
      svg.append(g);
    };
    if (c > 0) {
      for (let s = 0; s < n(); s++) {
        const i = holder(s, c);
        if (!i) continue;
        const to = bx(s) + bw / 2, from = s === 0 ? to - 22 : bx(s - 1) + bw / 2;
        token(lerp(from, to, mv), i, s === 0 ? mv : 1);
      }
      const leaving = holder(n() - 1, c - 1);
      if (leaving && mv < 1) { const from = bx(n() - 1) + bw / 2; token(lerp(from, from + 26, mv), leaving, 1 - mv); }
    }
    const done = c === 0 ? 0 : doneAfter(c - (f < 1 - 1e-9 ? 1 : 0));
    const inPipe = c === 0 ? 0 : stages.filter((_, s) => holder(s, c)).length;
    const waiting = items - inPipe - (c === 0 ? 0 : doneAfter(c - 1));
    const lastDone = c > 0 && f >= 1 - 1e-9 && holder(n() - 1, c) ? 1 : 0;
    svg.append(svgEl("text", { x: W / 2, y: 98, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, `waiting: ${Math.max(0, waiting)} · in the pipeline: ${inPipe - lastDone} · done: ${done}`));
    // Timeline: stage × cycle, item numbers in the cells (slide 34's figure).
    const hotCol = q >= 0 ? q + 1 : c;
    if (hotCol >= 1 && hotCol <= N) svg.append(svgEl("rect", { x: colX + (hotCol - 1) * cw, y: TL, width: cw, height: 16 + n() * rowH, fill: "var(--hl-soft)" }));
    for (let col = 1; col <= N; col++) svg.append(svgEl("text", { x: colX + (col - 0.5) * cw, y: TL + 11, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-dim)" }, String(col)));
    svg.append(svgEl("text", { x: 4, y: TL + 11, "font-size": 9.5, fill: "var(--ink-dim)" }, "cycle"));
    for (let s = 0; s < n(); s++) {
      const y = TL + 16 + s * rowH;
      svg.append(svgEl("text", { x: 4, y: y + 13, "font-size": 10, fill: "var(--ink-2)" }, label(s).slice(0, 7)));
      for (let col = 1; col <= N; col++) {
        svg.append(svgEl("rect", { x: colX + (col - 1) * cw + 1, y: y + 1, width: cw - 2, height: rowH - 3, rx: 3, fill: "none", stroke: "var(--rule)" }));
        const i = holder(s, col);
        if (!i || col > c) continue;
        const op = col < c ? 1 : mv;
        svg.append(svgEl("rect", { x: colX + (col - 1) * cw + 1, y: y + 1, width: cw - 2, height: rowH - 3, rx: 3, fill: "var(--blue-soft)", opacity: op }));
        svg.append(svgEl("text", { x: colX + (col - 0.5) * cw, y: y + 13, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", opacity: op }, String(i)));
      }
    }
    const yT = TL + 16 + n() * rowH + 12;
    svg.append(svgEl("text", { x: 4, y: yT, "font-size": 9.5, fill: "var(--ink-dim)" }, `ends ${unit}`));
    const every = cw < 22 ? 2 : 1;
    for (let col = 1; col <= N; col++) if (col % every === 0 || col === N) svg.append(svgEl("text", { x: colX + col * cw, y: yT, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, num(col * ct, 2)));

    const ques = q >= 0 ? question(q) : null;
    say(ques ? ques.text : capFor(c));
    P.render(q, `${stages.join(",")}|${unit}|${items}`, ques ? ques.opts : []);
    const rate = unit === "ns" ? 1e9 / ct : 1 / ct;
    const thr = unit === "ns"
      ? [`${num(rate / 1e6, 3)} million/s`, `1 / ${tm(ct)} = ${num(rate / 1e6, 3)} million instructions per second`]
      : [`${num(rate, 4)} car/h`, `1 / ${tm(ct)}: one car every ${tm(ct)}`];
    stats.set([
      ["Cycle time Tₚ", tm(ct), n() > 1 ? `max{${stages.map((v) => num(v, 3)).join(", ")}}, the slowest stage` : "one stage: the whole job"],
      ["Throughput", thr[0], thr[1]],
      ["Latency per " + word(), tm(n() * ct), `${n()} × ${tm(ct)}${n() > 1 ? `; no pipelining: ${stages.map((v) => num(v, 3)).join(" + ")} = ${tm(stages.reduce((a, b) => a + b, 0))}` : ""}`],
      [`${cap1(word(2))} done`, `${done} of ${items}`, `at ${tm((c === 0 ? 0 : c - (f < 1 - 1e-9 ? 1 : 0)) * ct)}`],
    ]);
  }
  function restart() {
    P.reset();
    itemsLabel.textContent = unit === "h" ? "cars" : "instructions";
    note.textContent = "Clock period Tₚ = max{t₁, …, tₙ}, throughput = 1/Tₚ, delay for each instruction = nTₚ (slide 39). Without pipelining Tₚ = t₁ + … + tₙ and the delay is Tₚ (slide 40).";
    pb.reset(count());
  }
  pb = createPlayback({ count: count(), unit: "cycle", onFrame: frame, stepMs: () => cfg.stepMs || 1400, limit: () => P.limit(count()), onBlocked: P.nudge });
  box.append(pb.el, stats.el, note);
  stagesIn.addEventListener("input", () => {
    const v = stagesIn.value.trim().split(/[\s,]+/).map(Number);
    if (!okStages(v)) { note.textContent = "Type 1 to 6 stage delays, positive numbers separated by spaces."; return; }
    if (v.length !== stages.length) names = null;
    stages = v; setActive(presetRow, -1); restart();
  });
  unitSel.addEventListener("change", () => { unit = unitSel.value; setActive(presetRow, -1); restart(); });
  itemsIn.addEventListener("input", () => {
    const v = Math.round(Number(itemsIn.value));
    if (!(v >= 1 && v <= 8)) { note.textContent = "Between 1 and 8 items."; return; }
    items = v; restart();
  });
  restart();
}

// ---------- widget: cache-map-play ----------
// Direct mapping (slides 53-55) and the practice paper's Q5: one memory request per step, CI = MI % lines.
const CACHE_PRESETS = [
  ["slide example", "9 2 3 0 12 12 7 0 6 4 6 1 7 2 14", 4],
  ["practice Q5", "10 22 11 25 19 11 24 6 15 19 10 0 0 6 29 11 26 12 10 12", 4],
];
function cacheMapPlay(box, cfg) {
  const parse = (s) => String(s).trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const okReq = (a) => a.length >= 1 && a.length <= 40 && a.every((v) => Number.isInteger(v) && v >= 0 && v <= 9999);
  let reqs = okReq(parse(cfg.requests || "")) ? parse(cfg.requests) : parse(CACHE_PRESETS[0][1]);
  let L = clamp(Math.round(cfg.lines) || 4, 2, 16);
  let steps = [], after = [], pb = null;

  box.append(el("h4", null, cfg.title || "Direct mapping, one memory request per step"));
  // Static panel: which line an address falls in, and the L1D lines and sets (slides 51-52).
  const panel = el("div", "os-panel");
  const addrIn = numberInput(Number.isFinite(cfg.address) ? cfg.address : 260, "address", { min: 0, step: 1, cls: "os-num" });
  const sizeIn = numberInput(Number.isFinite(cfg.lineSize) ? cfg.lineSize : 64, "line size in bytes", { min: 1, step: 1, cls: "os-num" });
  const kbIn = numberInput(Number.isFinite(cfg.cacheKB) ? cfg.cacheKB : 32, "L1D size in KB", { min: 1, step: 1, cls: "os-num" });
  const copiesIn = numberInput(Number.isFinite(cfg.copies) ? cfg.copies : 2, "number of L1D caches", { min: 1, step: 1, cls: "os-num" });
  const waysIn = numberInput(Number.isFinite(cfg.ways) ? cfg.ways : 8, "ways", { min: 1, step: 1, cls: "os-num" });
  const p1 = el("p", "os-sentence"), p1out = el("span"), p2 = el("p", "os-sentence"), p2out = el("span");
  p1.append("Address ", addrIn, " with a ", sizeIn, "-byte line: ", p1out);
  p2.append("L1D ", kbIn, " KB × ", copiesIn, " ", p2out, " ", waysIn, " ways ", el("span"));
  panel.append(el("div", "stat-label", "line = address ÷ line size (slides 51-52)"), p1, p2);
  function drawPanel() {
    const a = Math.floor(Number(addrIn.value)), ls = Math.floor(Number(sizeIn.value));
    const kb = Number(kbIn.value), cp = Math.floor(Number(copiesIn.value)), w = Math.floor(Number(waysIn.value));
    if (a >= 0 && ls >= 1) {
      const line = Math.floor(a / ls), off = a % ls;
      p1out.textContent = `${intStr(a)} ÷ ${intStr(ls)} = ${intStr(line)} remainder ${intStr(off)} → line ${intStr(line)} (bytes ${intStr(line * ls)}–${intStr(line * ls + ls - 1)}), offset ${intStr(off)}.`;
    } else p1out.textContent = "type a whole address and a line size of at least 1.";
    const tail = p2.lastChild;
    if (kb > 0 && cp >= 1 && ls >= 1 && w >= 1) {
      const total = kb * cp, lines = (total * 1024) / ls, sets = lines / w;
      p2out.textContent = `= ${num(total, 2)} KB ÷ ${intStr(ls)} B = ${num(total, 2)} × 1024 / ${intStr(ls)} = ${num(lines, 2)} lines; ÷`;
      tail.textContent = `= ${num(sets, 2)} sets.`;
    } else { p2out.textContent = "÷"; tail.textContent = "(type positive values)."; }
  }
  for (const i of [addrIn, sizeIn, kbIn, copiesIn, waysIn]) i.addEventListener("input", drawPanel);
  drawPanel();
  box.append(panel);

  const presetRow = el("div", "viz-btn-row");
  if (cfg.presets !== false) {
    CACHE_PRESETS.forEach(([label, s, l], i) => presetRow.append(button(label, () => {
      reqs = parse(s); L = l; reqIn.value = s; linesIn.value = l; setActive(presetRow, i); restart();
    })));
    setActive(presetRow, CACHE_PRESETS.findIndex(([, s, l]) => s === reqs.join(" ") && l === L));
    box.append(presetRow);
  }
  const reqIn = textInput(reqs.join(" "), "memory block requests");
  reqIn.className = "os-wide";
  const linesIn = numberInput(L, "cache lines", { min: 2, max: 16, step: 1 });
  linesIn.style.width = "70px";
  box.append(inputRow("requests (MI)", reqIn), inputRow("cache lines", linesIn));
  const { caption, ask, say } = captionParts();
  const P = predictKit(ask, "Predict hit or miss before each request", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  const chips = el("div", "os-chips");
  const calc = el("div", "os-calc");
  const linesBox = el("div", "os-lines");
  const stats = statGrid();
  const note = el("p", "widget-note");
  box.append(P.row, chips, calc, linesBox, caption, ask);

  function sim() {
    const cur = new Array(L).fill(null);
    steps = []; after = [cur.slice()];
    reqs.forEach((mi) => {
      const ci = mi % L, prev = cur[ci], hit = prev === mi;
      steps.push({ mi, ci, prev, hit });
      cur[ci] = mi; after.push(cur.slice());
    });
  }
  const result = (k) => {
    const s = steps[k];
    return s.hit ? `Line ${s.ci} already holds ${s.mi}: HIT.`
      : s.prev == null ? `Line ${s.ci} is empty: MISS, block ${s.mi} is loaded.`
      : `Line ${s.ci} holds ${s.prev}: MISS, ${s.prev} is evicted and ${s.mi} is loaded.`;
  };
  let lastKey = "";
  function frame(pos) {
    const N = steps.length, q = P.asking(pos, N);
    const k = Math.ceil(pos - 1e-9), f = k === 0 ? 1 : pos - (k - 1);
    const resolved = q >= 0 ? q : k === 0 ? 0 : f >= 0.5 - 1e-9 ? k : k - 1;
    const cur = q >= 0 ? q : k - 1;
    const key = `${resolved}|${cur}|${q}`;
    if (key !== lastKey) {
      lastKey = key;
      chips.innerHTML = "";
      steps.forEach((s, i) => {
        const c = el("span", "os-chip" + (i < resolved ? (s.hit ? " hit" : " miss") : "") + (i === cur ? " cur" : ""));
        c.innerHTML = `${s.mi}<sub>${i + 1}</sub>`;
        c.title = `request ${i + 1}: block ${s.mi}` + (i < resolved ? (s.hit ? ", hit" : ", miss") : "");
        chips.append(c);
      });
      calc.innerHTML = "";
      if (cur >= 0) {
        const s = steps[cur];
        calc.append(el("span", null, `CI = MI % ${L} = ${s.mi} % ${L} = ${s.ci}`));
        if (cur < resolved) calc.append(el("span", "os-tag " + (s.hit ? "hit" : "miss"), s.hit ? "HIT" : s.prev == null ? "MISS" : `MISS, evicts ${s.prev}`));
      } else calc.append(el("span", null, `CI = MI % (# of cache lines) = MI % ${L}`));
      linesBox.innerHTML = "";
      for (let j = 0; j < L; j++) {
        const row = el("div", "os-line" + (cur >= 0 && steps[cur].ci === j ? " lit" : ""));
        const v = after[resolved][j];
        row.append(el("span", "os-line-idx", `[${j}]`), el("span", "os-line-cur", v == null ? "—" : String(v)));
        const hist = el("span", "os-line-hist");
        steps.forEach((s, i) => {
          if (i >= resolved || s.ci !== j) return;
          const h = el("span", s.hit ? "hit" : "miss");
          h.innerHTML = `${s.mi}<sub>${i + 1}</sub>`;
          hist.append(h, " ");
        });
        row.append(hist);
        linesBox.append(row);
      }
    }
    let hits = 0;
    for (let i = 0; i < resolved; i++) hits += steps[i].hit ? 1 : 0;
    const miss = resolved - hits, pct = (v) => (resolved ? num((100 * v) / resolved, 3) : "0");
    let text;
    if (q >= 0) text = `Request ${q + 1}: block ${steps[q].mi} goes to line ${steps[q].mi} % ${L} = ${steps[q].ci}. Hit or miss?`;
    else if (k === 0) text = `Each memory block can go to one line only: CI = MI % (# of cache lines). All ${L} lines start empty. Press Play to send the ${N} requests.`;
    else {
      text = `Request ${k}: block ${steps[k - 1].mi}, CI = ${steps[k - 1].mi} % ${L} = ${steps[k - 1].ci}. ${result(k - 1)}`;
      if (pos >= N - 1e-9) {
        const fin = after[N].map((v, j) => `[${j}] ${v == null ? "empty" : v}`).join(" ");
        text += ` Miss : ${miss}, Hit : ${hits}; miss rate ${miss}/${N} = ${pct(miss)}%. Final contents ${fin}.` + P.tally();
      }
    }
    say(text);
    if (q >= 0) {
      const s = steps[q];
      const why = s.prev == null ? `Line ${s.ci} is empty, so block ${s.mi} is a miss.` : s.hit ? `Line ${s.ci} holds ${s.prev}, the same block: a hit.` : `Line ${s.ci} holds ${s.prev}, not ${s.mi}: in direct mapping ${s.mi} can only be in line ${s.ci}, so it is a miss.`;
      P.render(q, `${reqs.join(",")}|${L}`, [{ label: "HIT", ok: s.hit, why }, { label: "MISS", ok: !s.hit, why }]);
    } else P.render(-1, "", []);
    stats.set([
      ["Miss", String(miss), `miss rate ${pct(miss)}%`],
      ["Hit", String(hits), `hit rate ${pct(hits)}%`],
      ["Requests", `${resolved} of ${N}`, `${L} lines, CI = MI % ${L}`],
      ["Final contents", resolved === N ? after[N].map((v, j) => `[${j}] ${v == null ? "—" : v}`).join(" ") : "…", "after the last request"],
    ]);
  }
  function restart() {
    sim(); P.reset(); lastKey = "";
    note.textContent = "Subscript = the request's position in the sequence; purple = hit, blue = miss (the slide prints hits in red).";
    pb.reset(reqs.length);
  }
  sim();
  pb = createPlayback({ count: reqs.length, unit: "request", onFrame: frame, stepMs: () => cfg.stepMs || 900, limit: () => P.limit(steps.length), onBlocked: P.nudge });
  box.append(pb.el, stats.el, note);
  reqIn.addEventListener("input", () => {
    const v = parse(reqIn.value);
    if (!okReq(v)) { note.textContent = "Type 1 to 40 block numbers (0–9999) separated by spaces."; return; }
    reqs = v; setActive(presetRow, -1); restart();
  });
  linesIn.addEventListener("input", () => {
    const v = Math.round(Number(linesIn.value));
    if (!(v >= 2 && v <= 16)) { note.textContent = "Between 2 and 16 cache lines."; return; }
    L = v; setActive(presetRow, -1); restart();
  });
  restart();
}

// ---------- widget: clock-play ----------
// The programmable clock (slides 29-32): crystal → counter → interrupt, holding register beside.
function fmtTime(sec) {
  const a = Math.abs(sec);
  if (!Number.isFinite(sec)) return "—";
  if (a === 0) return "0 sec";
  if (a < 1e-6) return `${num(sec * 1e9, 3)} nsec`;
  if (a < 1e-3) return `${num(sec * 1e6, 3)} µsec`;
  if (a < 1) return `${num(sec * 1e3, 3)} msec`;
  if (a < 1e5) return `${num(sec, 3)} sec`;
  return `${num(sec, 0)} sec ≈ ${num(sec / 31557600, 0)} years`;
}
function fmtFreq(hz) {
  if (hz >= 1e9) return `${num(hz / 1e9, 3)} GHz`;
  if (hz >= 1e6) return `${num(hz / 1e6, 3)} MHz`;
  if (hz >= 1e3) return `${num(hz / 1e3, 3)} kHz`;
  return `${num(hz, 3)} Hz`;
}
/** 2^bits − 1 written out exactly, with digit groups. */
const bigMax = (bits) => (2n ** BigInt(bits) - 1n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, SP);
function clockPlay(box, cfg) {
  let f = Number.isFinite(cfg.f) && cfg.f > 0 ? cfg.f : 5e8;
  let bits = cfg.bits === 64 ? 64 : 32;
  const maxH = () => Math.min(2 ** bits - 1, Number.MAX_SAFE_INTEGER);
  let H = clamp(Math.round(cfg.holding) || 5, 1, maxH());
  let mode = cfg.mode === "oneshot" || cfg.mode === "one-shot" ? "oneshot" : "square";
  let quantum = Number.isFinite(cfg.quantumMs) && cfg.quantumMs > 0 ? cfg.quantumMs : 40;
  let pb = null;
  const CYCLES = 3, MAXS = 12;

  box.append(el("h4", null, cfg.title || "A programmable clock, one crystal pulse per step"));
  const modes = ["oneshot", "square"];
  const modeRow = btnRow(["one-shot mode", "square-wave mode"], (i) => { mode = modes[i]; restart(); }, modes.indexOf(mode));
  const fIn = numberInput(f / 1e6, "crystal frequency in MHz", { min: 0.000001 });
  fIn.style.width = "100px";
  const hIn = numberInput(H, "holding register", { min: 1, step: 1 });
  const bitsSel = document.createElement("select");
  bitsSel.setAttribute("aria-label", "register width");
  for (const b of [32, 64]) { const o = document.createElement("option"); o.value = b; o.textContent = `${b}-bit`; bitsSel.append(o); }
  bitsSel.value = bits;
  box.append(modeRow, inputRow("crystal (MHz)", fIn), inputRow("holding register", hIn, bitsSel));
  const { caption, ask, say } = captionParts();
  const P = predictKit(ask, "Predict each pulse before it arrives", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 400 214", class: "curve-svg net-svg os-svg", role: "img", "aria-label": "crystal oscillator, counter, holding register and CPU interrupt" });
  const stats = statGrid();
  const quantumIn = numberInput(quantum, "quantum in milliseconds", { min: 0, cls: "os-num" });
  const qOut = el("span");
  const useQ = button("load it into the holding register", () => {
    const v = Math.round(quantum / 1e3 * f);
    if (v >= 1 && v <= maxH()) { H = v; hIn.value = v; restart(); }
  });
  const qLine = el("p", "os-sentence");
  qLine.append("Quantum ", quantumIn, " msec: ", qOut, " ", useQ);
  const note = el("p", "widget-note");
  box.append(P.row, svg, caption, ask);

  const T = () => 1 / f;
  const S = () => Math.min(H, MAXS);
  const pAt = (j) => Math.round((j * H) / S());
  const count = () => (mode === "square" ? CYCLES * S() : S() + 2);
  /** The state after step g: counter, pulses so far, interrupts so far, and what step g did. */
  function st(g) {
    const s = S();
    if (g <= 0) return { counter: H, pulses: 0, irqs: 0, before: H, after: H, dp: 0 };
    if (mode === "oneshot" && g > s) {
      const dp = pAt(1);
      return { counter: 0, before: 0, after: 0, pulses: H + (g - s) * dp, irqs: 1, stopped: true, dp };
    }
    const c = Math.floor((g - 1) / s), j = ((g - 1) % s) + 1, zero = j === s;
    const before = H - pAt(j - 1), after = H - pAt(j);
    return { counter: zero && mode === "square" ? H : after, before, after, pulses: c * H + pAt(j), irqs: c + (zero ? 1 : 0), zero, cycle: c, dp: pAt(j) - pAt(j - 1) };
  }
  const pulseText = (g) => {
    const a = st(g - 1).pulses + 1, b = st(g).pulses;
    return a === b ? `Pulse ${intStr(b)}` : `Pulses ${intStr(a)}–${intStr(b)}, ${intStr(b - a + 1)} in this step`;
  };
  function capFor(g) {
    const s0 = st(g), t = fmtTime(s0.pulses * T());
    if (g <= 0) return `When the clock is started, it copies the value of the holding register (${intStr(H)}) into the counter. A ${fmtFreq(f)} crystal pulses the counter every ${fmtTime(T())}.` + (H > MAXS ? ` ${intStr(H)} pulses are too many to show one by one, so each step is about ${intStr(H / S())} pulses.` : "");
    if (s0.stopped) return `${pulseText(g)} (t = ${t}): the crystal keeps pulsing, but the counter has stopped at 0. One-shot mode: no further interrupt until it is explicitly started again by the software.` + (g >= count() ? P.tally() : "");
    if (!s0.zero) return `${pulseText(g)} (t = ${t}): the counter is decremented at each pulse, ${intStr(s0.before)} → ${intStr(s0.after)}.`;
    const base = `${pulseText(g)} (t = ${t}): the counter gets to zero and causes a CPU interrupt`;
    if (mode === "oneshot") return `${base} and stops until it is explicitly started again by the software (one-shot mode).`;
    return `${base}; the value of the holding register (${intStr(H)}) is copied into the counter and the whole process is repeated. These periodic interrupts are called clock ticks: one every ${intStr(H)} × ${fmtTime(T())} = ${fmtTime(H * T())}.` + (g >= count() ? P.tally() : "");
  }
  function question(k) {
    const g = k + 1, s1 = st(g), s0 = st(k);
    if (mode === "square" && s1.zero && s1.cycle >= 1) {
      const why = `In square-wave mode, after getting to zero the value of the holding register (${intStr(H)}) is copied into the counter.`;
      return {
        text: `The counter is at ${intStr(s0.counter)} and this step brings it to 0. In square-wave mode, what does the counter reload to?`,
        opts: [H, 0, H - 1, "nothing: it stops"].filter((v, i, a) => a.indexOf(v) === i && (typeof v !== "number" || v >= 0)).map((v) => ({ label: typeof v === "number" ? intStr(v) : v, ok: v === H, why })),
      };
    }
    const yes = !!s1.zero;
    const why = s1.stopped ? "In one-shot mode the counter stops at zero after its interrupt; nothing happens until the software starts it again."
      : yes ? `The counter is at ${intStr(s0.counter)}; this step takes it to zero, and when the counter gets to zero it causes a CPU interrupt.`
      : `The counter goes ${intStr(s0.counter)} → ${intStr(s1.after)}: an interrupt comes only when it gets to zero.`;
    return {
      text: `${s1.stopped ? "The counter is stopped at 0" : `The counter is at ${intStr(s0.counter)}`}. ${g === 1 || st(g).dp === 1 ? "Interrupt on this pulse?" : `Interrupt during these ${intStr(s1.dp)} pulses?`}`,
      opts: [{ label: "interrupt", ok: yes, why }, { label: "no interrupt", ok: !yes, why }],
    };
  }
  function frame(pos) {
    const N = count(), q = P.asking(pos, N);
    const g = Math.ceil(pos - 1e-9), fr = g === 0 ? 1 : pos - (g - 1);
    const prev = st(g - 1), cur = st(g);
    // Within a step: the pulse travels (first 30 %), the counter changes, then (square-wave, at zero) the reload.
    const pulse = g > 0 && fr < 0.3 + 1e-9 && q < 0, changed = g === 0 || fr >= 0.3 - 1e-9 || q >= 0;
    const irqLit = g > 0 && cur.zero && changed;
    const reloaded = cur.zero && mode === "square" && (fr >= 0.7 - 1e-9 || q >= 0);
    const counter = g === 0 ? H : !changed ? prev.counter : cur.zero ? (reloaded ? H : 0) : cur.counter;
    const pulses = g === 0 ? 0 : changed ? cur.pulses : prev.pulses;
    svg.innerHTML = "";
    const txt = (x, y, s, a = {}) => svg.append(svgEl("text", { x, y, "font-size": 10.5, fill: "var(--ink-2)", ...a }, s));
    // Crystal oscillator.
    txt(8, 14, "Crystal oscillator", { "font-size": 10 });
    svg.append(svgEl("rect", { x: 8, y: 20, width: 84, height: 46, rx: 6, fill: pulse ? "var(--hl-soft)" : "var(--paper)", stroke: pulse ? "var(--hl)" : "var(--rule-strong)" }));
    svg.append(svgEl("path", { d: "M18 50 h8 v-12 h8 v12 h8 v-12 h8 v12 h8 v-12 h8 v12 h6", fill: "none", stroke: "var(--blue)", "stroke-width": 1.5 }));
    txt(50, 62, fmtFreq(f), { "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-dim)" });
    svg.append(svgEl("line", { x1: 92, y1: 43, x2: 116, y2: 43, stroke: "var(--ink-dim)" }));
    if (pulse) svg.append(svgEl("circle", { cx: lerp(94, 116, fr / 0.3), cy: 43, r: 4, fill: "var(--hl)" }));
    // Counter.
    txt(120, 14, `Counter (${bits}-bit): decremented at each pulse`, { "font-size": 10 });
    svg.append(svgEl("rect", { x: 120, y: 20, width: 172, height: 46, rx: 6, fill: "var(--paper)", stroke: irqLit ? "var(--hl)" : "var(--rule-strong)" }));
    txt(206, 51, intStr(counter), { "text-anchor": "middle", "font-size": 20, fill: "var(--hl)", "font-weight": 700 });
    // CPU interrupt.
    svg.append(svgEl("line", { x1: 292, y1: 43, x2: 306, y2: 43, stroke: irqLit ? "var(--hl)" : "var(--ink-dim)", "stroke-width": irqLit ? 2.5 : 1 }));
    svg.append(svgEl("rect", { x: 306, y: 20, width: 86, height: 46, rx: 6, fill: irqLit ? "var(--hl)" : "var(--paper)", stroke: irqLit ? "var(--hl)" : "var(--rule-strong)" }));
    txt(349, 39, "CPU interrupt", { "text-anchor": "middle", "font-size": 10, fill: irqLit ? "var(--hl-ink)" : "var(--ink-2)" });
    txt(349, 56, `${changed ? cur.irqs : prev.irqs} so far`, { "text-anchor": "middle", "font-size": 10, fill: irqLit ? "var(--hl-ink)" : "var(--ink-dim)" });
    txt(349, 80, `t = ${fmtTime(pulses * T())}`, { "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-dim)" });
    // Holding register, with the load arrow lit at the start and at each square-wave reload.
    const loadLit = g === 0 || (cur.zero && mode === "square" && reloaded);
    svg.append(svgEl("path", { d: "M206 94 V70 m-5 6 l5 -6 l5 6", fill: "none", stroke: loadLit ? "var(--hl)" : "var(--ink-dim)", "stroke-width": loadLit ? 2.5 : 1.2 }));
    svg.append(svgEl("rect", { x: 120, y: 94, width: 172, height: 34, rx: 6, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    txt(206, 116, intStr(H), { "text-anchor": "middle", "font-size": 15, fill: "var(--ink)", "font-weight": 700 });
    txt(120, 142, "Holding register: used to load the counter", { "font-size": 10 });
    txt(8, 110, mode === "square" ? "square-wave:" : "one-shot:", { "font-size": 10, fill: "var(--ink-dim)" });
    txt(8, 123, mode === "square" ? "reload at 0" : "load once", { "font-size": 10, fill: "var(--ink-dim)" });
    // Pulse timeline: one slot per step; the interrupts stand tall.
    const X0 = 8, X1 = 392, sw = (X1 - X0) / N, yB = 196;
    svg.append(svgEl("line", { x1: X0, y1: yB, x2: X1, y2: yB, stroke: "var(--rule-strong)" }));
    for (let i = 1; i <= N; i++) {
      const si = st(i), x = X0 + (i - 0.5) * sw, shown = i < g || (i === g && changed);
      const hot = i === (q >= 0 ? q + 1 : g);
      if (hot) svg.append(svgEl("rect", { x: X0 + (i - 1) * sw, y: 154, width: sw, height: 46, fill: "var(--hl-soft)" }));
      if (!shown) { svg.append(svgEl("line", { x1: x, y1: yB, x2: x, y2: yB - 6, stroke: "var(--rule)" })); continue; }
      if (si.zero) {
        svg.append(svgEl("line", { x1: x, y1: yB, x2: x, y2: 164, stroke: "var(--hl)", "stroke-width": 2.5 }));
        if (sw >= 10 || i % 2 === 0) txt(x, 161, mode === "square" ? `tick ${si.irqs}` : "IRQ", { "text-anchor": "middle", "font-size": 8.5, fill: "var(--hl)" });
      } else svg.append(svgEl("line", { x1: x, y1: yB, x2: x, y2: yB - 12, stroke: si.stopped ? "var(--ink-dim)" : "var(--blue)", "stroke-width": 1.5, "stroke-dasharray": si.stopped ? "2 2" : "none" }));
    }
    txt(X0, 210, H > MAXS ? `one slot = about ${intStr(H / S())} pulses` : "one slot = one pulse", { "font-size": 9, fill: "var(--ink-dim)" });

    const ques = q >= 0 ? question(q) : null;
    say(ques ? ques.text : capFor(g));
    P.render(q, `${f}|${H}|${mode}|${bits}`, ques ? ques.opts : []);
    const big = 2 ** bits - 1, tMax = big * T();
    const tMaxNs = bits === 32 ? `${intStr(big * 2)}` : "";
    const qLoad = (quantum / 1e3) * f;
    stats.set([
      ["Pulse period T", fmtTime(T()), `T = 1/f = 1/${fmtFreq(f)}`],
      ["This interval", fmtTime(H * T()), `${intStr(H)} × ${fmtTime(T())}: interrupts at ${fmtFreq(f / H)}`],
      [`Range (${bits}-bit)`, `${fmtTime(T())} to ${fmtTime(tMax)}`, `(2<sup>${bits}</sup> − 1) × ${fmtTime(T())}` + (bits === 32 && Math.abs(T() - 2e-9) < 1e-15 ? ` = ${tMaxNs} nsec ≈ ${num(tMax, 1)} sec` : ` ≈ ${fmtTime(tMax)}`)],
      ["Quantum load", intStr(qLoad), `${num(quantum, 3)} msec / ${fmtTime(T())}` + (qLoad > big ? ` does not fit in ${bits} bits` : ` fits in ${bits} bits (max ${bigMax(bits)})`)],
    ]);
    qOut.textContent = `${num(quantum, 3)} msec / ${fmtTime(T())} = ${num(quantum, 3)} × 10⁻³ × ${fmtFreq(f)} = ${intStr(qLoad)} pulses to load.`;
  }
  function restart() {
    P.reset();
    note.textContent = mode === "square"
      ? "Square-wave mode: after getting to zero it causes an interrupt, the holding register is copied into the counter, and the process repeats indefinitely (slide 31). Three rounds are shown."
      : "One-shot mode: the clock copies the holding register into the counter once, decrements it at each pulse, interrupts at zero and stops until it is explicitly started again by the software (slide 31).";
    pb.reset(count());
  }
  pb = createPlayback({ count: count(), unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 900, limit: () => P.limit(count()), onBlocked: P.nudge });
  box.append(pb.el, stats.el, qLine, note);
  fIn.addEventListener("input", () => {
    const v = Number(fIn.value) * 1e6;
    if (!(v > 0 && v <= 1e11)) { note.textContent = "Type a crystal frequency in MHz above 0."; return; }
    f = v; restart();
  });
  hIn.addEventListener("input", () => {
    const v = Math.round(Number(hIn.value));
    if (!(v >= 1 && v <= maxH())) { note.textContent = `The holding register holds 1 to ${intStr(maxH())}.`; return; }
    H = v; restart();
  });
  bitsSel.addEventListener("change", () => { bits = Number(bitsSel.value); if (H > maxH()) { H = maxH(); hIn.value = H; } restart(); });
  quantumIn.addEventListener("input", () => { const v = Number(quantumIn.value); if (v > 0) { quantum = v; frame(pb.pos()); } });
  restart();
}

// ---------- widget: alarm-list-play ----------
// Simulating multiple timers with a single clock (slides 38-39): one clock tick per step.
function alarmListPlay(box, cfg) {
  const parse = (s) => String(s).trim().split(/[\s,]+/).filter(Boolean).map(Number).sort((a, b) => a - b);
  const ok = (now, a) => Number.isInteger(now) && a.length >= 1 && a.length <= 12 && a.every((v) => Number.isInteger(v) && v > now) && a[a.length - 1] - now <= 60;
  let now = Number.isInteger(cfg.now) ? cfg.now : 4200;
  let sig = parse(cfg.signals || "4203 4207 4213 4215 4216");
  if (!ok(now, sig)) { now = 4200; sig = [4203, 4207, 4213, 4215, 4216]; }
  let pb = null;

  box.append(el("h4", null, cfg.title || "Simulating multiple timers with a single clock"));
  const nowIn = numberInput(now, "current time", { step: 1 });
  nowIn.style.width = "100px";
  const sigIn = textInput(sig.join(" "), "pending signal times");
  sigIn.className = "os-wide";
  box.append(inputRow("current time", nowIn), inputRow("signals pending", sigIn));
  const diffs = el("p", "os-sentence");
  const { caption, ask, say } = captionParts();
  const fires = (g) => sig.some((t) => t === now + g); // tick g (1-based) fires at least one signal
  const P = predictKit(ask, "Predict Next signal after each signal fires", () => pb, () => frame(pb.pos()), (k) => fires(k + 1));
  P.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 400 150", class: "curve-svg net-svg os-svg", role: "img", "aria-label": "current time, next signal and the linked list of pending clock requests" });
  const note = el("p", "widget-note");
  box.append(diffs, P.row, svg, caption, ask);

  const entry = (i) => sig[i] - (i ? sig[i - 1] : now);
  const count = () => sig[sig.length - 1] - now;
  /** State at tick g: the time, the pending indices, Next signal (null when the list is empty). */
  function state(g) {
    const time = now + g, rest = sig.map((t, i) => i).filter((i) => sig[i] > time);
    return { time, rest, next: rest.length ? sig[rest[0]] - time : null, fired: sig.map((t, i) => i).filter((i) => sig[i] <= time) };
  }
  function drawDiffs(firedSet) {
    diffs.innerHTML = "";
    diffs.append(el("span", "stat-label", "Each entry = ticks after the previous one: "));
    sig.forEach((t, i) => {
      const s = el("span", "os-diff" + (firedSet.has(i) ? " gone" : ""), `${t} − ${i ? sig[i - 1] : now} = ${entry(i)}`);
      diffs.append(s, i < sig.length - 1 ? " · " : "");
    });
  }
  let diffKey = "";
  function frame(pos) {
    const N = count(), q = P.asking(pos, N);
    const g = Math.ceil(pos - 1e-9), fr = g === 0 ? 1 : pos - (g - 1);
    const before = state(g - 1), after = state(g), fireNow = g > 0 && fires(g);
    // Phases within a tick: the clock ticks (to 25 %), on a firing tick Next signal sits at 0 and the head flashes (to 70 %), then it is removed.
    const phase = g === 0 || q >= 0 ? "rest" : fr < 0.25 ? "tick" : fireNow && fr < 0.7 ? "fire" : "rest";
    const show = phase === "tick" ? before : phase === "fire" ? { ...before, time: after.time, next: 0 } : after;
    const firing = phase === "fire" ? before.rest.filter((i) => sig[i] === after.time) : [];
    const key = show.fired.join(",");
    if (key !== diffKey) { diffKey = key; drawDiffs(new Set(show.fired)); }
    svg.innerHTML = "";
    const box2 = (x, y, w, h, label, value, lit) => {
      svg.append(svgEl("rect", { x, y, width: w, height: h, rx: 6, fill: lit ? "var(--hl-soft)" : "var(--paper)", stroke: lit ? "var(--hl)" : "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: x + 8, y: y + 14, "font-size": 10, fill: "var(--ink-dim)" }, label));
      svg.append(svgEl("text", { x: x + w / 2, y: y + h - 9, "text-anchor": "middle", "font-size": 17, "font-weight": 700, fill: "var(--hl)" }, value));
    };
    const ticking = phase === "tick" || (g > 0 && fr < 0.25 + 1e-9 && q < 0);
    box2(8, 8, 120, 46, "Current time", String(phase === "tick" ? lerp(before.time, after.time, 1) : show.time), ticking);
    box2(140, 8, 120, 46, "Next signal", show.next == null ? "—" : String(show.next), phase === "fire" || ticking);
    svg.append(svgEl("text", { x: 272, y: 26, "font-size": 10, fill: "var(--ink-dim)" }, `fired: ${show.fired.length ? show.fired.map((i) => sig[i]).join(", ") : "none yet"}`));
    if (firing.length) svg.append(svgEl("text", { x: 272, y: 44, "font-size": 11, "font-weight": 700, fill: "var(--hl)" }, `signal ${sig[firing[0]]}!`));
    // Clock header → linked list, five nodes per row.
    const list = show.rest, Y0 = 72, NH = 26, perRow = 5, nodeW = 50, step = 64, HX = 8, HW = 58;
    const rows = Math.max(1, Math.ceil(list.length / perRow));
    const H = Y0 + rows * 40 + 6;
    svg.setAttribute("viewBox", `0 0 400 ${H}`);
    svg.append(svgEl("rect", { x: HX, y: Y0, width: HW, height: NH, rx: 5, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: HX + HW / 2, y: Y0 + 11, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-2)" }, "Clock"));
    svg.append(svgEl("text", { x: HX + HW / 2, y: Y0 + 21, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-2)" }, "header"));
    if (!list.length) {
      svg.append(svgEl("text", { x: HX + HW + 14, y: Y0 + 17, "font-size": 11, fill: "var(--ink-dim)" }, "X  (the list is empty)"));
    }
    let px = HX + HW, py = Y0 + NH / 2;
    list.forEach((i, j) => {
      const r = Math.floor(j / perRow), c = j % perRow;
      const x = HX + HW + 14 + c * step, y = Y0 + r * 40;
      const arrowFromX = c === 0 && r > 0 ? null : px;
      if (arrowFromX != null) svg.append(svgEl("path", { d: `M${arrowFromX} ${py} H${x - 2} m-4 -4 l4 4 l-4 4`, fill: "none", stroke: "var(--ink-dim)" }));
      else svg.append(svgEl("path", { d: `M${px - 8} ${py} v12 H${x - 8} V${y + NH / 2} h6 m-4 -4 l4 4 l-4 4`, fill: "none", stroke: "var(--ink-dim)" }));
      const lit = firing.includes(i) || (j === 0 && phase !== "fire" && g > 0 && q < 0);
      svg.append(svgEl("rect", { x, y, width: nodeW, height: NH, rx: 4, fill: firing.includes(i) ? "var(--hl)" : "var(--paper)", stroke: lit ? "var(--hl)" : "var(--rule-strong)" }));
      svg.append(svgEl("line", { x1: x + nodeW - 16, y1: y, x2: x + nodeW - 16, y2: y + NH, stroke: "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: x + (nodeW - 16) / 2, y: y + 17, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: firing.includes(i) ? "var(--hl-ink)" : "var(--ink)" }, String(entry(i))));
      const last = j === list.length - 1;
      svg.append(last ? svgEl("text", { x: x + nodeW - 8, y: y + 17, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, "X")
        : svgEl("circle", { cx: x + nodeW - 8, cy: y + NH / 2, r: 2.5, fill: "var(--ink-dim)" }));
      px = x + nodeW - 8; py = y + NH / 2;
    });
    // Caption.
    let text;
    if (q >= 0) {
      const t = now + q + 1;
      text = `Tick to ${t}: Next signal reaches 0 and the ${t} signal fires. What is Next signal after this signal fires?`;
    } else if (g === 0) {
      text = `Signals are pending for ${andJoin(sig.map(String))}; the current time is ${now}. Each entry on the list tells how many clock ticks following the previous one to wait: ${sig.map((_, i) => entry(i)).join(", ")}. The next interrupt occurs in ${entry(0)} ticks.`;
    } else if (!fireNow) {
      text = `Tick: Current time ${after.time}. On each tick, Next signal is decremented: ${before.next} → ${after.next}.`;
    } else {
      const fired = sig.filter((t) => t === after.time);
      text = `Current time ${after.time}: Next signal = 0, so the signal for ${after.time} (the first item on the list) is caused and that item is removed from the list.`;
      if (fired.length > 1) text += ` The next ${fired.length - 1 === 1 ? "item waits" : "items wait"} 0 ticks, so ${fired.length - 1 === 1 ? "it fires" : "they fire"} on the same tick.`;
      text += after.next == null ? " The list is empty: no signal is pending." : ` Then Next signal = ${after.next}.`;
      if (g >= N) text += P.tally();
    }
    say(text);
    if (q >= 0) {
      const t = now + q + 1, s = state(q + 1);
      if (s.next == null) {
        const why = "That was the last item: removing it leaves the list empty.";
        P.render(q, `${now}|${sig.join(",")}`, [{ label: "the list is empty", ok: true, why }, { label: "0", ok: false, why }, { label: "1", ok: false, why }]);
      } else {
        const nt = sig[s.rest[0]], d = s.next;
        const why = `Each entry tells how many ticks after the previous one to wait: the next item is ${nt} − ${t} = ${d}, so Next signal = ${d}.`;
        P.render(q, `${now}|${sig.join(",")}`, options(d, [nt, nt - now, d - 1 > 0 ? d - 1 : d + 1, 0], why));
      }
    } else P.render(-1, "", []);
  }
  function restart() {
    P.reset(); diffKey = "";
    note.textContent = "Only one hardware clock: the list is sorted on time and each node stores the gap to the previous signal, so each tick touches only Next signal (slide 38).";
    pb.reset(count());
  }
  pb = createPlayback({ count: count(), unit: "tick", onFrame: frame, stepMs: () => cfg.stepMs || 800, limit: () => P.limit(count()), onBlocked: P.nudge });
  box.append(pb.el, note);
  const edit = () => {
    const n = Math.round(Number(nowIn.value)), a = parse(sigIn.value);
    if (!ok(n, a)) { note.textContent = "Type 1 to 12 signal times after the current time, the last at most 60 ticks away."; return; }
    now = n; sig = a; restart();
  };
  nowIn.addEventListener("input", edit);
  sigIn.addEventListener("input", edit);
  restart();
}

// ---------- widget: alu-calc ----------
// The slide-28 ALU operation table on two 8-bit operands; the slide 29-30 example is B − A with A = 3, B = 4.
const ALU_OPS = [
  // key, function, [F0, F1, ENA, ENB, INVA, INC]
  ["A", "A", [0, 1, 1, 0, 0, 0]],
  ["B", "B", [0, 1, 0, 1, 0, 0]],
  ["notA", "Ā", [0, 1, 1, 0, 1, 0]],
  ["notB", "B̄", [1, 0, 1, 1, 0, 0]],
  ["add", "A + B", [1, 1, 1, 1, 0, 0]],
  ["add1", "A + B + 1", [1, 1, 1, 1, 0, 1]],
  ["incA", "A + 1", [1, 1, 1, 0, 0, 1]],
  ["incB", "B + 1", [1, 1, 0, 1, 0, 1]],
  ["sub", "B − A", [1, 1, 1, 1, 1, 1]],
  ["decB", "B − 1", [1, 1, 0, 1, 1, 0]],
  ["negA", "−A", [1, 1, 1, 0, 1, 1]],
  ["and", "A AND B", [0, 0, 1, 1, 0, 0]],
  ["or", "A OR B", [0, 1, 1, 1, 0, 0]],
  ["zero", "0", [0, 1, 0, 0, 0, 0]],
  ["one", "1", [1, 1, 0, 0, 0, 1]],
  ["minus1", "−1", [1, 1, 0, 0, 1, 0]],
];
const ALU_ALIAS = { not: "notA", subtract: "sub", "b-a": "sub", "b − a": "sub", plus: "add", "a+b": "add", "-a": "negA", "-1": "minus1" };
const CTRL = ["F0", "F1", "ENA", "ENB", "INVA", "INC"];
const bin8 = (v) => (v & 255).toString(2).padStart(8, "0");
const signed8 = (v) => ((v & 255) >= 128 ? (v & 255) - 256 : v & 255);
function aluCalc(box, cfg) {
  const byte = (v, d) => (Number.isInteger(v) ? v & 255 : d);
  const st = { a: byte(cfg.a, 3), b: byte(cfg.b, 4) };
  const opKey = ALU_ALIAS[String(cfg.op || "").toLowerCase()] || cfg.op;
  let ctrl = (ALU_OPS.find((o) => o[0] === opKey || o[1] === cfg.op) || ALU_OPS[8])[2].slice();

  box.append(el("h4", null, cfg.title || "The ALU operation table on 8-bit operands (click bits)"));
  const sel = document.createElement("select");
  sel.className = "algo-select";
  sel.setAttribute("aria-label", "ALU function");
  ALU_OPS.forEach(([k, label]) => { const o = document.createElement("option"); o.value = k; o.textContent = label; sel.append(o); });
  const other = document.createElement("option"); other.value = ""; other.textContent = "(not in the table)"; sel.append(other);
  const gridEl = el("div", "bit-grid os-click");
  const ctrlRow = el("div", "bit-row os-ctrl");
  const work = el("p", "os-calc");
  const stats = statGrid();
  box.append(inputRow("function", sel), ctrlRow, gridEl, work, stats.el,
    el("p", "widget-note", "F₀F₁ picks the unit: 00 AND, 01 OR, 10 NOT B, 11 the full adder. ENA and ENB enable A and B, INVA inverts A, INC is the carry into the adder (the simulator's Cin). Click a control bit to explore rows the table does not list."));

  const bitSpan = (b, onClick, label) => {
    const c = el("span", "bit" + (b ? " on" : ""), String(b));
    if (onClick) {
      c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-label", label);
      c.addEventListener("click", onClick);
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } });
    }
    return c;
  };
  function bitRow(label, v, key, extra) {
    const r = el("div", "bit-row");
    r.append(el("span", "bit-label", label));
    for (let i = 0; i < 8; i++) {
      const b = (v >> (7 - i)) & 1;
      r.append(bitSpan(b, key ? () => { st[key] ^= 1 << (7 - i); draw(); } : null, `${label} bit ${7 - i}`));
    }
    r.append(el("span", "bit-val", extra != null ? extra : `= ${v & 255}`));
    return r;
  }
  function draw() {
    const [F0, F1, ENA, ENB, INVA, INC] = ctrl;
    const row = ALU_OPS.find((o) => o[2].join("") === ctrl.join(""));
    sel.value = row ? row[0] : "";
    ctrlRow.innerHTML = "";
    ctrlRow.append(el("span", "bit-label", "control"));
    CTRL.forEach((name, i) => {
      const w = el("span", "os-ctrl-bit");
      w.append(el("span", "os-ctrl-name", name), bitSpan(ctrl[i], () => { ctrl[i] ^= 1; draw(); }, `${name} control bit`));
      ctrlRow.append(w);
    });
    const A = st.a, B = st.b;
    const aE = ENA ? A : 0, aX = INVA ? ~aE & 255 : aE, bE = ENB ? B : 0;
    const unit = F0 * 2 + F1;
    let res, cout = 0;
    if (unit === 0) res = aX & bE;
    else if (unit === 1) res = aX | bE;
    else if (unit === 2) res = ~bE & 255;
    else { const s = aX + bE + INC; res = s & 255; cout = s >> 8; }
    gridEl.innerHTML = "";
    gridEl.append(bitRow("A", A, "a"), bitRow("B", B, "b"),
      bitRow("A in", aX, null, `${ENA ? "A" : "0"}${INVA ? ", inverted" : ""}`),
      bitRow("B in", bE, null, ENB ? "B" : "0"),
      bitRow("Res", res, null, `= ${res}${unit === 3 ? `, Cout ${cout}` : ""}`));
    const name = row ? row[1] : "not in the table";
    let w;
    if (unit === 3) {
      w = `${bin8(bE)} + ${bin8(aX)} + ${INC} = ${cout ? "1 " : ""}${bin8(res)}`;
      if (row && row[0] === "sub") w = `B − A = B + NOT(A) + 1 = ${bin8(B)} + NOT(${bin8(A)}) + 1 = ${bin8(B)} + ${bin8(~A)} + 1 = ${cout ? "1 " : ""}${bin8(res)}`;
      else if (row && row[0] === "negA") w = `−A = NOT(A) + 1 = ${bin8(~A)} + 1 = ${cout ? "1 " : ""}${bin8(res)}`;
    } else if (unit === 0) w = `${bin8(aX)} AND ${bin8(bE)} = ${bin8(res)}`;
    else if (unit === 1) w = `${bin8(aX)} OR ${bin8(bE)} = ${bin8(res)}`;
    else w = `NOT ${bin8(bE)} = ${bin8(res)}`;
    work.textContent = w;
    stats.set([
      ["Function", name, `F₀ ${F0} F₁ ${F1} ENA ${ENA} ENB ${ENB} INVA ${INVA} INC ${INC}`],
      ["Res (Out)", bin8(res), unit === 3 ? `Cout = ${cout}${cout ? " (the carry out, discarded in 8 bits)" : ""}` : "no carry: logic unit"],
      ["Decimal", String(res), `as a signed 8-bit number: ${num(signed8(res), 0)}`],
      ["Check", row && row[0] === "sub" ? `${B} − ${A} = ${B - A}` : `A = ${A}, B = ${B}`, row && row[0] === "sub" ? `two's complement: ${num(signed8(B - A), 0)} = ${bin8(B - A)}` : "operands as unsigned 8-bit"],
    ]);
  }
  sel.addEventListener("change", () => { const r = ALU_OPS.find((o) => o[0] === sel.value); if (r) { ctrl = r[2].slice(); draw(); } });
  draw();
}

// ---------- widget: interrupt-io-play ----------
// Starting an I/O device and getting an interrupt (slides 64-68), with busy waiting and DMA (slides 65-66) to compare.
const CPU_DOING = {
  user: "running the user program",
  driver: "running the driver (kernel)",
  poll: "polling the busy bit",
  other: "running another process",
  intr: "taking the interrupt / handler",
};
const IO_STEPS = {
  interrupt: [
    { dev: "The program asks to read from the disk: the system call is issued.", cpu: "user", lit: ["cpu"], cap: "The user program issues a system call to read from the disk; the kernel translates it into a procedure call to the appropriate driver." },
    { dev: "The controller's registers are written: disk address, memory address, sector count, direction.", cpu: "driver", lit: ["cpu", "disk"], arrows: [1], regs: 1, cap: "1: To activate the controller, the driver translates the command into the appropriate values to write into the device registers: disk address, memory address, sector count, direction (read)." },
    { dev: "The device has been started and told to interrupt when it is finished; the driver has returned and the caller is blocked.", cpu: "other", lit: ["disk"], regs: 1, busy: 1, cap: "The driver starts the device and asks it to give an interrupt when it is finished. At that point the driver returns; the operating system blocks the caller and looks for other work to do." },
    { dev: "The controller transfers the sector from the disk drive.", cpu: "other", lit: ["disk", "drive"], regs: 1, busy: 1, xfer: 1, cap: "The controller transfers the sector from the disk drive while the CPU runs another process." },
    { dev: "The controller finishes the transfer and signals the interrupt controller.", cpu: "other", lit: ["disk", "pic"], arrows: [2], regs: 1, xfer: 2, cap: "2: When the controller detects the end of the transfer, it generates an interrupt: it signals the interrupt controller." },
    { dev: "The interrupt controller asserts a pin on the CPU and puts the device number on the bus.", cpu: "other", lit: ["pic", "cpu"], arrows: [3, 4], regs: 1, xfer: 2, cap: "3: The interrupt controller asserts a pin on the CPU; 4: it puts the device's number on the bus so the CPU can tell which device finished." },
    { dev: "The PC and PSW are saved and the CPU switches to kernel mode.", cpu: "intr", lit: ["cpu"], regs: 1, xfer: 2, cap: "Interrupt: the CPU stops after the current instruction, saves the PC and PSW, and switches to kernel mode." },
    { dev: "The device number indexes the interrupt vector.", cpu: "intr", lit: ["cpu", "mem"], regs: 1, xfer: 2, cap: "Dispatch to handler: the device number indexes the interrupt vector, which holds the address of the interrupt handler." },
    { dev: "The data are put where they are needed; the caller becomes ready.", cpu: "intr", lit: ["cpu", "mem", "disk"], regs: 1, xfer: 3, cap: "The interrupt handler runs: the data are put where they are needed in memory and the blocked caller becomes ready again." },
    { dev: "The saved PC and PSW are restored.", cpu: "user", lit: ["cpu"], regs: 0, xfer: 3, cap: "Return: the saved PC and PSW are restored and the interrupted user program continues at its next instruction." },
  ],
  busy: [
    { dev: "The program asks to read from the disk: the system call is issued.", cpu: "user", lit: ["cpu"], cap: "The user program issues a system call to read from the disk; the kernel translates it into a procedure call to the appropriate driver." },
    { dev: "The controller's registers are written and the I/O is started.", cpu: "driver", lit: ["cpu", "disk"], arrows: [1], regs: 1, cap: "1: The driver writes the device registers: disk address, memory address, sector count, direction (read), and starts the I/O." },
    { dev: "The controller is reading the sector; busy bit = 1.", cpu: "poll", lit: ["cpu", "disk"], arrows: [1], regs: 1, busy: 1, xfer: 1, cap: "Busy waiting: the driver sits in a tight loop continuously polling the device to see if it is done: busy bit = 1." },
    { dev: "The controller is still reading; busy bit = 1.", cpu: "poll", lit: ["cpu", "disk", "drive"], arrows: [1], regs: 1, busy: 1, xfer: 2, cap: "Still busy. The CPU does no useful work: busy waiting has the disadvantage of tying up the CPU polling the device until it is finished." },
    { dev: "The transfer ends and the busy bit becomes 0.", cpu: "poll", lit: ["cpu", "disk"], arrows: [1], regs: 1, busy: 0, xfer: 3, cap: "The poll reads busy bit = 0: the I/O has completed." },
    { dev: "The data are put where they are needed.", cpu: "driver", lit: ["cpu", "mem"], regs: 1, xfer: 3, cap: "When the I/O has completed, the driver puts the data (if any) where they are needed and returns." },
    { dev: "Control goes back to the caller.", cpu: "user", lit: ["cpu"], xfer: 3, cap: "The operating system then returns control to the caller. No interrupt was used: the CPU waited the whole time." },
  ],
  dma: [
    { dev: "The program asks to read from the disk: the system call is issued.", cpu: "user", lit: ["cpu"], cap: "The user program issues a system call to read from the disk; the kernel translates it into a procedure call to the appropriate driver." },
    { dev: "The DMA chip is given the byte count, the device and memory addresses, and the direction.", cpu: "driver", lit: ["cpu", "dma"], arrows: [1], regs: 1, cap: "The CPU sets up the DMA chip, telling it how many bytes to transfer, the device and memory addresses involved, and the direction, and lets it go." },
    { dev: "The DMA chip asks the disk controller for the data; the caller is blocked.", cpu: "other", lit: ["dma", "disk"], regs: 1, busy: 1, cap: "The operating system blocks the caller and runs another process; the DMA chip asks the disk controller for the data." },
    { dev: "The bytes move from the controller into memory.", cpu: "other", lit: ["dma", "disk", "drive", "mem"], regs: 1, busy: 1, xfer: 2, cap: "The DMA chip moves the bytes from the controller straight into memory, with no help from the CPU." },
    { dev: "The DMA chip finishes and signals the interrupt controller.", cpu: "other", lit: ["dma", "pic"], arrows: [2], regs: 1, xfer: 3, cap: "When the DMA chip is done, it causes an interrupt: it signals the interrupt controller." },
    { dev: "The interrupt controller signals the CPU; the PC and PSW are saved and the vector is indexed.", cpu: "intr", lit: ["pic", "cpu"], arrows: [3, 4], regs: 1, xfer: 3, cap: "The interrupt controller signals the CPU; the CPU saves the PC and PSW and dispatches through the interrupt vector to the handler." },
    { dev: "The caller is made ready again.", cpu: "intr", lit: ["cpu"], regs: 1, xfer: 3, cap: "The handler runs: the data are already in memory, so it only makes the caller ready again. One interrupt for the whole transfer." },
    { dev: "The interrupted program resumes.", cpu: "user", lit: ["cpu"], xfer: 3, cap: "Return: the interrupted user program continues at its next instruction." },
  ],
};
function interruptIoPlay(box, cfg) {
  const modes = ["busy", "interrupt", "dma"];
  let mode = modes.includes(cfg.mode) ? cfg.mode : "interrupt";
  let pb = null;
  box.append(el("h4", null, cfg.title || "Starting an I/O device and getting an interrupt"));
  box.append(btnRow(["busy waiting", "interrupt", "DMA"], (i) => { mode = modes[i]; restart(); }, modes.indexOf(mode)));
  const { caption, ask, say } = captionParts();
  const P = predictKit(ask, "Predict what the CPU is doing in each step", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 400 196", class: "curve-svg net-svg os-svg", role: "img", "aria-label": "CPU, interrupt controller, disk controller, memory and the bus" });
  const stats = statGrid();
  const note = el("p", "widget-note");
  box.append(P.row, svg, caption, ask);
  const steps = () => IO_STEPS[mode];

  function frame(pos) {
    const S = steps(), N = S.length, q = P.asking(pos, N);
    const g = Math.ceil(pos - 1e-9), fr = g === 0 ? 1 : pos - (g - 1);
    const s = g > 0 && q < 0 ? S[g - 1] : null, glow = s ? smooth01(fr / 0.3) : 0;
    const lit = new Set(s ? s.lit : []), arrows = new Set(s ? s.arrows || [] : []);
    const shownStep = q >= 0 ? (q > 0 ? S[q - 1] : null) : s;
    svg.innerHTML = "";
    const BUS = 112;
    svg.append(svgEl("line", { x1: 8, y1: BUS, x2: 392, y2: BUS, stroke: "var(--rule-strong)", "stroke-width": 4 }));
    svg.append(svgEl("text", { x: 392, y: BUS + 14, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, "bus"));
    const comp = (id, x, y, w, h, lines, sub, ghost) => {
      const on = lit.has(id);
      svg.append(svgEl("line", { x1: x + w / 2, y1: y < BUS ? y + h : y, x2: x + w / 2, y2: BUS, stroke: "var(--rule-strong)", "stroke-width": 2, opacity: ghost ? 0.3 : 1 }));
      svg.append(svgEl("rect", { x, y, width: w, height: h, rx: 6, fill: on ? "var(--hl-soft)" : "var(--paper)", stroke: on ? "var(--hl)" : "var(--rule-strong)", "stroke-width": on ? 1 + glow : 1, opacity: ghost ? 0.3 : 1 }));
      lines.forEach((t, i) => svg.append(svgEl("text", { x: x + w / 2, y: y + 15 + i * 12, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", opacity: ghost ? 0.4 : 1 }, t)));
      if (sub) svg.append(svgEl("text", { x: x + w / 2, y: y + h - 7, "text-anchor": "middle", "font-size": 9, fill: "var(--hl)" }, sub));
    };
    const doing = shownStep ? shownStep.cpu : "user";
    const short = { user: "user program", driver: "driver", poll: "polling", other: "other process", intr: "interrupt" }[doing];
    comp("cpu", 8, 40, 92, 52, ["CPU"], q >= 0 ? "?" : short);
    comp("pic", 112, 40, 92, 52, ["Interrupt", "controller"]);
    comp("disk", 298, 46, 94, 46, ["Disk", "controller"], shownStep && shownStep.regs ? `busy = ${shownStep.busy ? 1 : 0}` : "");
    comp("drive", 298, 4, 94, 30, ["Disk drive"]);
    svg.append(svgEl("line", { x1: 345, y1: 34, x2: 345, y2: 46, stroke: "var(--rule-strong)", "stroke-width": 2 }));
    comp("mem", 8, 134, 120, 40, ["Memory"], shownStep && shownStep.xfer >= 3 ? "data in place" : shownStep && shownStep.xfer === 2 && mode === "dma" ? "filling…" : "");
    comp("dma", 160, 134, 110, 40, ["DMA chip"], "", mode !== "dma");
    // Numbered arrows (slide 67): 1 CPU → controller on the bus, 2 controller → interrupt controller, 3 interrupt controller → CPU (direct), 4 on the bus.
    const arrow = (k, d, lx, ly) => {
      const on = arrows.has(k);
      svg.append(svgEl("path", { d, fill: "none", stroke: on ? "var(--hl)" : "var(--ink-dim)", "stroke-width": on ? 2.5 : 1, opacity: on ? 1 : 0.45, "stroke-dasharray": on ? "none" : "3 3" }));
      svg.append(svgEl("circle", { cx: lx, cy: ly, r: 7, fill: on ? "var(--hl)" : "var(--paper-3)" }));
      svg.append(svgEl("text", { x: lx, y: ly + 3.5, "text-anchor": "middle", "font-size": 9.5, "font-weight": 700, fill: on ? "var(--hl-ink)" : "var(--ink-2)" }, String(k)));
    };
    arrow(1, `M54 ${BUS - 8} H338 m-5 -5 l5 5 l-5 5`, 230, BUS - 8);
    arrow(2, `M298 60 H210 m5 -5 l-5 5 l5 5`, 254, 60);
    arrow(3, `M112 56 H104 m5 -5 l-5 5 l5 5`, 108, 44);
    arrow(4, `M158 ${BUS + 8} H56 v-12 m-5 5 l5 -5 l5 5`, 90, BUS + 8);
    // Activity lane: what the CPU did in each step so far.
    const LY = 184, lw = (392 - 140) / N;
    svg.append(svgEl("text", { x: 138, y: LY + 8, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, "CPU:"));
    const LETTER = { user: "U", driver: "D", poll: "P", other: "O", intr: "I" };
    S.forEach((st, i) => {
      const x = 142 + i * lw, done = i < (q >= 0 ? q : g);
      svg.append(svgEl("rect", { x: x + 1, y: LY - 4, width: lw - 2, height: 14, rx: 3, fill: done ? (st.cpu === "poll" ? "var(--hl-soft)" : st.cpu === "other" ? "var(--blue-soft)" : "var(--paper-3)") : "none", stroke: i === (q >= 0 ? q : g - 1) ? "var(--hl)" : "var(--rule)" }));
      if (done) svg.append(svgEl("text", { x: x + lw / 2, y: LY + 6, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-2)" }, LETTER[st.cpu]));
    });
    let text;
    if (q >= 0) text = `Step ${q + 1}: ${S[q].dev} What is the CPU doing during this step?`;
    else if (g === 0) text = { busy: "Busy waiting: the driver starts the I/O and polls the device until it is done.", interrupt: "Using interrupt: the driver starts the device and asks it to give an interrupt when it is finished.", dma: "Use of special hardware: the CPU sets up the DMA chip and lets it go; when the DMA chip is done, it causes an interrupt." }[mode] + " Press Play to step through it.";
    else {
      text = `Step ${g}: ${S[g - 1].cap}`;
      if (g >= N) {
        const c = {}; S.forEach((x) => (c[x.cpu] = (c[x.cpu] || 0) + 1));
        text += mode === "busy" ? ` The CPU spent ${c.poll} of ${N} steps polling.` : ` The CPU ran another process for ${c.other} of ${N} steps instead of waiting.`;
        text += P.tally();
      }
    }
    say(text);
    if (q >= 0) {
      const right = S[q].cpu, why = `In this step: ${S[q].cap}`;
      P.render(q, mode, Object.entries(CPU_DOING).map(([k, label]) => ({ label, ok: k === right, why })));
    } else P.render(-1, "", []);
    const upto = q >= 0 ? q : g, cnt = {};
    S.slice(0, upto).forEach((x) => (cnt[x.cpu] = (cnt[x.cpu] || 0) + 1));
    const regsOn = shownStep && shownStep.regs;
    stats.set([
      ["CPU now", q >= 0 ? "?" : CPU_DOING[doing], `U user · D driver · P polling · O other process · I interrupt`],
      ["CPU so far", `${cnt.poll || 0} polling, ${cnt.other || 0} other`, `of ${upto} step${upto === 1 ? "" : "s"}`],
      [mode === "dma" ? "DMA chip registers" : "Controller registers", regsOn ? "disk address 7, memory address 0x1000" : "—", regsOn ? (mode === "dma" ? "byte count 512, direction read" : "sector count 1, direction read") : "written by the driver in step 2"],
    ]);
  }
  function restart() {
    P.reset();
    note.textContent = "Slide 67 numbers the arrows 1-4 but gives no text for them; the step wording for arrows 1-4 and the PC/PSW save follows Tanenbaum (not on the slides). Register values are illustrative.";
    pb.reset(steps().length);
  }
  pb = createPlayback({ count: steps().length, unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 1500, limit: () => P.limit(steps().length), onBlocked: P.nudge });
  box.append(pb.el, stats.el, note);
  restart();
}

// ---------- widget: rwx-bits ----------
// The 9-bit protection code (slide 87) and the Linux file types (slide 88).
const FILE_TYPES = [["-", "regular file"], ["d", "directory"], ["c", "character device file"], ["b", "block device file"], ["s", "local socket file"], ["p", "named pipe"], ["l", "symbolic link"]];
const RWX_PRESETS = [
  ["res.txt", "-rw-r--r--"], ["run.txt", "-rwxr-xr-x"], ["mod_example.c", "-rwxrwx---"], ["libs", "drwxrwxr-x"],
  ["l_thread", "lrwxrwxrwx"], ["my_block_dev", "brw-r--r--"], ["my_char_dev", "crw-r--r--"], ["my_npipe_dev", "prw-r--r--"],
];
function rwxBits(box, cfg) {
  const fromStr = (s) => {
    s = String(s || "").trim();
    if (/^[0-7]{3}$/.test(s)) return [...s].flatMap((d) => [4, 2, 1].map((m) => (Number(d) & m ? 1 : 0)));
    if (/^[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(s)) return [...s].map((c) => (c === "-" ? 0 : 1));
    return null;
  };
  let type = FILE_TYPES.some(([t]) => t === cfg.type) ? cfg.type : "-";
  let mode = String(cfg.mode || "");
  if (/^[-dcbspl][r-][w-][x-][r-][w-][x-][r-][w-][x-]$/.test(mode) && !cfg.type) { type = mode[0]; mode = mode.slice(1); }
  let bits = fromStr(mode) || fromStr("rwxr-x---");

  box.append(el("h4", null, cfg.title || "The rwx bits (click a bit)"));
  const typeRow = el("div", "viz-btn-row");
  FILE_TYPES.forEach(([t, name]) => {
    const b = button(t === "-" ? "– regular" : `${t} ${name.split(" ")[0]}`, () => { type = t; draw(); });
    b.title = name; b.dataset.t = t;
    typeRow.append(b);
  });
  const presetRow = el("div", "viz-btn-row");
  if (cfg.presets !== false) {
    RWX_PRESETS.forEach(([name, s]) => presetRow.append(button(name, () => { type = s[0]; bits = fromStr(s.slice(1)); draw(); })));
  }
  const gridEl = el("div", "bit-grid os-click");
  const lsLine = el("p", "os-calc");
  const stats = statGrid();
  const sentence = el("p", "playback-caption");
  sentence.setAttribute("aria-live", "polite");
  box.append(el("div", "stat-label", "file type (slide 88)"), typeRow, gridEl, lsLine, sentence, stats.el);
  if (cfg.presets !== false) box.append(el("div", "stat-label", "the slides' ls -l lines"), presetRow);
  box.append(el("p", "widget-note", "Three 3-bit fields: one for the owner, one for other members of the owner's group, and one for everyone else. Each digit of the octal code is r = 4 + w = 2 + x = 1 for one field."));

  const WHO = ["owner", "group", "others"], WHAT = ["read", "write", "execute"], LET = "rwx";
  function say(i) {
    const f = bits.slice(3 * i, 3 * i + 3), may = WHAT.filter((_, j) => f[j]), not = WHAT.filter((_, j) => !f[j]);
    if (!not.length) return `${WHO[i]} may ${andJoin(may)}`;
    if (!may.length) return `${WHO[i]} may not ${orJoin(not)}`;
    return `${WHO[i]} may ${andJoin(may)}, not ${orJoin(not)}`;
  }
  function draw() {
    [...typeRow.children].forEach((b) => b.classList.toggle("active", b.dataset.t === type));
    gridEl.innerHTML = "";
    const head = el("div", "bit-row");
    head.append(el("span", "bit-label", ""));
    for (let i = 0; i < 9; i++) { head.append(el("span", "bit os-bit-head", LET[i % 3])); if (i % 3 === 2 && i < 8) head.append(el("span", "os-bitgap")); }
    const row = el("div", "bit-row");
    row.append(el("span", "bit-label", "bits"));
    bits.forEach((b, i) => {
      const c = el("span", "bit" + (b ? " on" : ""), b ? LET[i % 3] : "-");
      c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-pressed", b ? "true" : "false");
      c.setAttribute("aria-label", `${WHO[Math.floor(i / 3)]} ${WHAT[i % 3]}`);
      const flip = () => { bits[i] ^= 1; draw(); const again = gridEl.querySelectorAll("[role=button]")[i]; if (again) again.focus(); };
      c.addEventListener("click", flip);
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
      row.append(c);
      if (i % 3 === 2 && i < 8) row.append(el("span", "os-bitgap"));
    });
    const who = el("div", "bit-row");
    who.append(el("span", "bit-label", ""));
    WHO.forEach((w, i) => { const s = el("span", "os-who", w); who.append(s); if (i < 2) who.append(el("span", "os-bitgap")); });
    gridEl.append(head, row, who);
    const str = type + bits.map((b, i) => (b ? LET[i % 3] : "-")).join("");
    const oct = [0, 1, 2].map((i) => bits[3 * i] * 4 + bits[3 * i + 1] * 2 + bits[3 * i + 2]).join("");
    lsLine.textContent = `ls -l: ${str}   chmod ${oct} file`;
    const typeName = FILE_TYPES.find(([t]) => t === type)[1];
    sentence.textContent = `A ${typeName}: ${say(0)}; ${say(1)}; ${say(2)}.`;
    stats.set([
      ["ls -l string", str, `type letter ${type === "-" ? "–" : type} = ${typeName}`],
      ["Octal", oct, [0, 1, 2].map((i) => `${bits[3 * i] * 4}+${bits[3 * i + 1] * 2}+${bits[3 * i + 2]}`).join(" · ")],
      ["Binary", [0, 1, 2].map((i) => bits.slice(3 * i, 3 * i + 3).join("")).join(" "), "9-bit protection code"],
    ]);
  }
  draw();
}

export const WIDGETS = {
  "pipeline-play": pipelinePlay,
  "cache-map-play": cacheMapPlay,
  "clock-play": clockPlay,
  "alarm-list-play": alarmListPlay,
  "alu-calc": aluCalc,
  "interrupt-io-play": interruptIoPlay,
  "rwx-bits": rwxBits,
};
