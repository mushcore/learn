// Interactive probability widgets for MATH 3042 Unit 3 (probability and counting) and Lab 4
// (simulations): sample spaces you can click, the law of large numbers, a counting calculator,
// the complement / addition rules on a Venn diagram, the birthday problem, a two-way table for
// conditional probability and independence, a Bayes tree, and the Lab 4 simulation experiments.
import { el, esc, btnRow, slider, fmtNum } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
function note(text) { const p = el("p", "widget-note"); p.innerHTML = text; return p; }
function cell(label, value, extra) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label));
  const v = el("div", "stat-value"); v.innerHTML = value; c.append(v);
  if (extra) { const n = el("div", "stat-note"); n.innerHTML = extra; c.append(n); }
  return c;
}
function grid(out, rows) { out.innerHTML = ""; for (const r of rows) out.append(cell(...r)); }
function rcode(text) { const p = el("pre", "manip-code"); p.textContent = text; return p; }
function toggle(label, checked, onChange) {
  const lab = el("label", "oop-toggle");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, el("span", null, label));
  return { row: lab, input };
}
function numField(label, value, onChange, step = "any") {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = step; input.value = value; input.setAttribute("aria-label", label);
  input.addEventListener("input", () => onChange(parseFloat(input.value)));
  row.append(el("label", null, label), input);
  return { row, input };
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** k/n as a reduced fraction plus a decimal. */
function frac(k, n, d = 4) {
  if (!n) return "—";
  const g = gcd(k, n) || 1;
  const red = g > 1 && n / g !== n ? ` = ${k / g}/${n / g}` : "";
  return `${k}/${n}${red} = ${fmtNum(k / n, d)}`;
}
const pct = (p, d = 2) => `${fmtNum(100 * p, d)}%`;
function big(n) {
  const s = n.toString();
  return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
}
function sci(n) {
  const s = n.toString();
  if (s.length <= 15) return big(n);
  return `${s[0]}.${s.slice(1, 4)} × 10^${s.length - 1}`;
}
function bars(container, counts, labels, hitSet, total) {
  container.innerHTML = "";
  const row = el("div", "prob-bars"), axis = el("div", "prob-axis");
  const max = Math.max(1, ...counts);
  counts.forEach((c, i) => {
    const b = el("div", "prob-bar" + (hitSet && hitSet.has(i) ? " hit" : ""));
    b.style.height = `${(100 * c) / max}%`;
    if (counts.length <= 24) b.append(el("span", null, total ? fmtNum(c / total, 3) : String(c)));
    b.title = `${labels[i]}: ${c}${total ? ` (${fmtNum(c / total, 4)})` : ""}`;
    row.append(b);
    axis.append(el("span", null, counts.length <= 30 || i % Math.ceil(counts.length / 30) === 0 ? String(labels[i]) : ""));
  });
  container.append(row, axis);
}

// ---------- widget: sample-space ----------
function sampleSpace(box, cfg) {
  let mode = cfg.mode === "dice" ? "dice" : "coins";
  let n = Math.min(5, Math.max(1, Math.round(cfg.n ?? 3)));
  let k = cfg.k ?? 1;
  let outcomes = [], selected = new Set();
  box.append(el("h4", null, cfg.title || "Sample spaces you can count"));
  box.append(note("Click outcomes to put them in the event A, or use a preset. P(A) = |A| / |S| because every outcome is equally likely."));
  if (!cfg.mode) box.append(btnRow(["Flip n coins", "Roll two dice"], (i) => { mode = i ? "dice" : "coins"; rebuild(); }, mode === "dice" ? 1 : 0));
  const ctl = el("div"), presetRow = el("div"), gridEl = el("div", "prob-grid"), out = el("div", "stat-grid"), dist = el("div"), formula = el("div", "prob-formula");
  box.append(ctl, presetRow, gridEl, formula, out, dist);
  const sumOf = (o) => o[0] + o[1];
  const heads = (o) => o.split("").filter((c) => c === "H").length;
  function rebuild() {
    ctl.innerHTML = ""; presetRow.innerHTML = "";
    if (mode === "coins") {
      const s = slider("Number of coins n", 1, 5, 1, n, (v) => { n = v; rebuild(); }, (v) => `${v} coin${v > 1 ? "s" : ""}`);
      const sk = slider("k for the presets", 0, 5, 1, Math.min(k, n), (v) => { k = v; }, (v) => `k = ${v}`);
      ctl.append(s.row, sk.row);
      outcomes = [];
      for (let i = 0; i < 2 ** n; i++) outcomes.push(i.toString(2).padStart(n, "0").replace(/0/g, "H").replace(/1/g, "T"));
      presetRow.append(btnRow(["exactly k heads", "at least k heads", "at most k heads", "all the same", "first coin is H", "clear"], (i) => {
        if (mode !== "coins") return;
        selected = new Set();
        outcomes.forEach((o, idx) => {
          const h = heads(o);
          if ((i === 0 && h === k) || (i === 1 && h >= k) || (i === 2 && h <= k) || (i === 3 && (h === 0 || h === n)) || (i === 4 && o[0] === "H")) selected.add(idx);
        });
        draw();
      }, -1));
      if (cfg.event) { const ev = { exactly: 0, atleast: 1, atmost: 2, same: 3, first: 4 }[cfg.event]; if (ev != null) presetRow.querySelectorAll("button")[ev].click(); }
    } else {
      outcomes = [];
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) outcomes.push([a, b]);
      const sk = slider("s for the presets", 2, 12, 1, Math.min(12, Math.max(2, k)), (v) => { k = v; }, (v) => `sum = ${v}`);
      ctl.append(sk.row);
      presetRow.append(btnRow(["boxcars (6, 6)", "sum = s", "sum < 12", "doubles", "at least one 6", "sum is 7 or 11", "clear"], (i) => {
        if (mode !== "dice") return;
        selected = new Set();
        outcomes.forEach((o, idx) => {
          const s = sumOf(o);
          if ((i === 0 && o[0] === 6 && o[1] === 6) || (i === 1 && s === k) || (i === 2 && s < 12) || (i === 3 && o[0] === o[1]) || (i === 4 && (o[0] === 6 || o[1] === 6)) || (i === 5 && (s === 7 || s === 11))) selected.add(idx);
        });
        draw();
      }, -1));
      if (cfg.event) { const ev = { boxcars: 0, sum: 1, under12: 2, doubles: 3, six: 4, natural: 5 }[cfg.event]; if (ev != null) presetRow.querySelectorAll("button")[ev].click(); }
    }
    if (!cfg.event) selected = new Set();
    draw();
  }
  function draw() {
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = mode === "dice" ? "repeat(6, 1fr)" : `repeat(${Math.min(8, outcomes.length)}, 1fr)`;
    outcomes.forEach((o, idx) => {
      const c = el("div", "prob-cell" + (selected.has(idx) ? " in" : ""), mode === "dice" ? `${o[0]},${o[1]}` : o);
      c.title = mode === "dice" ? `sum ${sumOf(o)}` : `${heads(o)} head${heads(o) === 1 ? "" : "s"}`;
      c.addEventListener("click", () => { if (selected.has(idx)) selected.delete(idx); else selected.add(idx); draw(); });
      gridEl.append(c);
    });
    const S = outcomes.length, A = selected.size;
    formula.innerHTML = `P(A) = <b>|A|</b> / <b>|S|</b> = <b>${A}</b> / <b>${S}</b> = <b>${fmtNum(A / S, 4)}</b>${S && A ? ` (${frac(A, S).split(" = ").slice(1).join(" = ")})` : ""}`;
    const rows = [["|S| = size of the sample space", mode === "dice" ? "6 × 6 = 36" : `2<sup>${n}</sup> = ${S}`], ["|A| = outcomes in the event", String(A)], ["P(Ā) = 1 − P(A)", fmtNum(1 - A / S, 4)]];
    if (mode === "dice" && A) rows.push(["sums in A", [...new Set([...selected].map((i) => sumOf(outcomes[i])))].sort((a, b) => a - b).join(", ")]);
    grid(out, rows);
    // distribution of X
    const counts = mode === "dice" ? Array.from({ length: 11 }, (_, i) => outcomes.filter((o) => sumOf(o) === i + 2).length) : Array.from({ length: n + 1 }, (_, i) => outcomes.filter((o) => heads(o) === i).length);
    const labels = mode === "dice" ? Array.from({ length: 11 }, (_, i) => i + 2) : Array.from({ length: n + 1 }, (_, i) => i);
    const hit = new Set();
    counts.forEach((_, i) => { const xs = mode === "dice" ? outcomes.map((o, idx) => [sumOf(o), idx]) : outcomes.map((o, idx) => [heads(o), idx]); if (xs.some(([x, idx]) => x === labels[i] && selected.has(idx))) hit.add(i); });
    dist.innerHTML = `<div class="pv-title">distribution of X = ${mode === "dice" ? "sum of the two dice" : "number of heads"} (label = P(X = x))</div>`;
    const b = el("div"); bars(b, counts, labels, hit, S); dist.append(b);
  }
  rebuild();
}

// ---------- shared playback rig (caption, predict checkbox, answer row) ----------
// Every -play widget in this file and in widgets-viz.js is built on it. o: { count, unit, stepMs,
// predict, label, ask(k) → null | { q, options, answer, rule } for the step from rest k to k + 1,
// draw(pos, askingK) → caption text }. The widget appends rig.check, its picture, rig.caption,
// rig.ask and rig.bar in that order; rig.restart(count) after edited inputs.
export function playRig(o) {
  let count = Math.max(1, o.count | 0), predict = !!o.predict;
  let answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false;
  const check = el("label", "playback-check"), cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = predict;
  check.append(cb, ` ${o.label || "Predict each step before it plays"}`);
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = !predict;
  let pb = null;
  const gate = () => { if (!predict) return count; let k = answered; while (k < count && !o.ask(k)) k++; return k; };
  const askingAt = (pos) => { if (!predict) return -1; const k = gate(); return k < count && Math.abs(pos - k) < 1e-6 ? k : -1; };
  function answer(i, q, e) {
    if (wrong == null && !missed) asked++;
    if (i !== q.answer) { missed = true; wrong = i; refocus = e.detail === 0; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    answered = gate() + 1; missed = false; wrong = null; refocus = e.detail === 0;
    pb.next();
  }
  function renderAsk(k) {
    const q = k >= 0 ? o.ask(k) : null;
    const key = q ? `${k}|${wrong}|${q.q}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!q) return;
    // Rotate the display order by step so the right answer does not sit in one place every time.
    const L = q.options.length, rot = q.keepOrder ? 0 : (k * 3 + 1) % L;
    const btns = q.options.map((_, j) => (j + rot) % L).map((i) => {
      const b = el("button", "viz-btn" + (i === wrong ? " playback-wrong" : ""), String(q.options[i]));
      b.type = "button";
      b.addEventListener("click", (e) => answer(i, q, e));
      ask.append(b);
      return b;
    });
    if (wrong != null) ask.append(el("span", "playback-feedback", `Not ${q.options[wrong]}. ${q.rule}`));
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function frame(pos) {
    // The bar's first tick can land a hair below 0 (rAF time precedes performance.now()); clamp it.
    pos = Math.max(0, Math.min(count, pos));
    const k = askingAt(pos);
    let text = o.draw(pos, k);
    if (k >= 0) text = o.ask(k).q;
    if (pos >= count - 1e-9 && asked > 0) text += ` ${firstTry} of ${asked} right on the first try.`;
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(k);
  }
  pb = createPlayback({
    count, unit: o.unit || "step", stepMs: o.stepMs || 1000, onFrame: frame, limit: gate,
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  cb.addEventListener("change", () => {
    predict = cb.checked; pb.pause();
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  return {
    check, caption, ask, bar: pb.el, pb,
    count: () => count,
    restart(n) { if (n) count = Math.max(1, n | 0); answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null; pb.reset(count); },
    redraw() { askKey = null; pb.set(pb.pos()); },
  };
}
/** Distinct options sorted ascending (numbers) with the index of the correct one. */
export function numOptions(correct, distractors, fmt = String) {
  const vals = [correct, ...distractors].filter((v) => Number.isFinite(v) && v >= 0);
  const uniq = [...new Set(vals.map((v) => fmt(v)))];
  const pairs = uniq.map((s) => [s, vals.find((v) => fmt(v) === s)]).sort((a, b) => a[1] - b[1]);
  return { options: pairs.map((p) => p[0]), answer: pairs.findIndex((p) => p[0] === fmt(correct)) };
}
/** Seeded generator so a run is a fixed sequence and every frame is a pure function of pos. */
export function seeded(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- widget: lln-sim (on the playback bar) ----------
const LLN_EXPERIMENTS = [
  { name: "Boxcars (two sixes)", noun: "boxcars", p: 1 / 36, exact: "1/36 = 0.0278", trial: (u) => Math.floor(u() * 6) === 5 && Math.floor(u() * 6) === 5, r: "dice <- sample(c(1,2,3,4,5,6), 2, replace=TRUE)\nsuccess <- (dice[1] == 6) & (dice[2] == 6)" },
  { name: "Sum of two dice is 7", noun: "sums of 7", p: 6 / 36, exact: "6/36 = 0.1667", trial: (u) => Math.floor(u() * 6) + Math.floor(u() * 6) + 2 === 7, r: "X <- sum(sample.int(6, 2, replace=TRUE))\nsuccess <- (X == 7)" },
  { name: "Heads on a fair coin", noun: "heads", p: 0.5, exact: "1/2 = 0.5", trial: (u) => u() < 0.5, r: 'success <- (sample(c("H","T"), 1) == "H")' },
  { name: "At least two heads in five coins", noun: "successes", p: 26 / 32, exact: "26/32 = 0.8125", trial: (u) => { let h = 0; for (let i = 0; i < 5; i++) if (u() < 0.5) h++; return h >= 2; }, r: 'coins <- sample(c("H","T"), 5, replace=TRUE)\nsuccess <- (sum(coins == "H") >= 2)' },
  { name: "Birthday match among 23 people", noun: "rooms with a match", p: 0.5073, exact: "0.5073", trial: (u) => { const seen = new Set(); for (let i = 0; i < 23; i++) { const d = Math.floor(u() * 365); if (seen.has(d)) return true; seen.add(d); } return false; }, r: "sample.bdays <- sample(1:365, 23, replace=TRUE)\nsuccess <- (length(unique(sample.bdays)) < 23)" },
];
const LLN_SCHEDULE = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
function llnSim(box, cfg) {
  box.append(el("h4", null, cfg.title || "Relative frequency versus the classical probability"));
  let ex = LLN_EXPERIMENTS[Math.max(0, LLN_EXPERIMENTS.findIndex((e) => e.name === cfg.experiment))];
  let seed = cfg.seed ?? 3, cum = null;
  const N = LLN_SCHEDULE[LLN_SCHEDULE.length - 1];
  function simulate() {
    const u = seeded(seed); cum = new Int32Array(N + 1);
    for (let i = 1; i <= N; i++) cum[i] = cum[i - 1] + (ex.trial(u) ? 1 : 0);
  }
  simulate();
  box.append(btnRow(LLN_EXPERIMENTS.map((e) => e.name), (i) => { ex = LLN_EXPERIMENTS[i]; simulate(); rig.restart(); }, LLN_EXPERIMENTS.indexOf(ex)));
  box.append(note("Each step runs a batch of trials and adds them to the tally: n = 1, 2, 5, 10, 20, 50 … 100 000 on a log scale. x/n wanders at first and settles on P(A) as n grows: the law of large numbers. A new run uses fresh random trials."));
  const again = el("button", "viz-btn", "new run (fresh trials)");
  again.type = "button";
  again.addEventListener("click", () => { seed++; simulate(); rig.restart(); });
  const out = el("div", "stat-grid"), svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" }), code = rcode("");
  const X0 = 50, X1 = 620, Y0 = 170, Y1 = 20;
  const xOf = (v) => X0 + ((X1 - X0) * Math.log10(Math.max(1, v))) / Math.log10(N);
  const yOf = (p) => Y0 - (Y0 - Y1) * p;
  const ratio = (k) => cum[k] / k;
  const exactNum = () => ex.exact.split("= ").pop();
  /** Trials run at position pos: the schedule's rest points, log-interpolated inside a step. */
  function nAt(pos) {
    if (pos <= 0) return 0;
    const k = Math.floor(pos + 1e-9), f = pos - k;
    if (k >= LLN_SCHEDULE.length) return N;
    if (k === 0) return f > 0.5 ? 1 : 0;
    const a = LLN_SCHEDULE[k - 1], b = LLN_SCHEDULE[k];
    return Math.round(Math.exp(Math.log(a) + f * (Math.log(b) - Math.log(a))));
  }
  function draw(pos) {
    const n = nAt(pos), x = n ? cum[n] : 0;
    grid(out, [["trials n", big(n)], ["successes x", big(x)], ["relative frequency x/n", n ? fmtNum(x / n, 4) : "—"], ["classical P(A)", ex.exact], ["difference", n ? fmtNum(Math.abs(x / n - ex.p), 4) : "—"]]);
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
    for (const p of [0, 0.25, 0.5, 0.75, 1]) { svg.append(svgEl("text", { x: X0 - 6, y: yOf(p) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, String(p))); svg.append(svgEl("line", { x1: X0, y1: yOf(p), x2: X1, y2: yOf(p), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); }
    for (let e = 0; 10 ** e <= N; e++) svg.append(svgEl("text", { x: xOf(10 ** e), y: Y0 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, big(10 ** e)));
    svg.append(svgEl("text", { x: X1, y: Y0 + 28, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "n (log scale)"));
    svg.append(svgEl("line", { x1: X0, y1: yOf(ex.p), x2: X1, y2: yOf(ex.p), stroke: "var(--green)", "stroke-width": 1.5 }));
    svg.append(svgEl("text", { x: X1, y: yOf(ex.p) - 4, "text-anchor": "end", "font-size": 10, fill: "var(--green)" }, `P(A) = ${fmtNum(ex.p, 4)}`));
    if (n) {
      const pts = [];
      for (let k = 1; k <= n; k = k < 100 ? k + 1 : Math.ceil(k * 1.02)) pts.push([k, ratio(k)]);
      pts.push([n, ratio(n)]);
      svg.append(svgEl("polyline", { points: pts.map(([k, p]) => `${xOf(k).toFixed(1)},${yOf(p).toFixed(1)}`).join(" "), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
      for (const s of LLN_SCHEDULE) if (s <= n) svg.append(svgEl("circle", { cx: xOf(s), cy: yOf(ratio(s)), r: 2.6, fill: "var(--blue)" }));
      svg.append(svgEl("circle", { cx: xOf(n), cy: yOf(ratio(n)), r: 5, fill: "var(--hl)" }));
    }
    code.textContent = `n.trials <- ${Math.max(n, 1)}\nX.success <- 0\nfor (i.trial in 1:n.trials){\n    ${ex.r.replace(/\n/g, "\n    ")}\n    X.success <- X.success + success\n}\nprob.A <- X.success / n.trials   # ${n ? fmtNum(x / n, 4) : "…"}`;
    const k = Math.floor(pos + 1e-9);
    if (n === 0) return `No trials yet: x/n has no value until n ≥ 1. The green line is the classical P(A) = ${ex.exact}.`;
    if (pos > k + 1e-9 && k < LLN_SCHEDULE.length) { const a = (LLN_SCHEDULE[k - 1] || 0) + 1, b = LLN_SCHEDULE[k]; return `Running ${a === b ? `trial ${big(b)}` : `trials ${big(a)} to ${big(b)}`}: n = ${big(n)}, x/n = ${fmtNum(x / n, 4)}.`; }
    let text = `n = ${big(n)}: ${big(x)} ${ex.noun}, x/n = ${fmtNum(x / n, 4)}, exact ${ex.exact}.`;
    if (n === N) text += ` After 100 000 trials x/n is ${fmtNum(Math.abs(x / n - ex.p), 4)} from P(A): the relative frequency has settled on the classical probability.`;
    return text;
  }
  function ask(k) {
    if (k < 1 || k >= LLN_SCHEDULE.length) return null;
    const a = LLN_SCHEDULE[k - 1], b = LLN_SCHEDULE[k];
    const dNow = Math.abs(ratio(a) - ex.p), dNext = Math.abs(ratio(b) - ex.p);
    return {
      q: `n = ${big(a)}: x/n = ${fmtNum(ratio(a), 4)}, ${fmtNum(dNow, 4)} from P(A). After ${big(b - a)} more trial${b - a === 1 ? "" : "s"} (n = ${big(b)}), will x/n be closer to ${exactNum()} or farther from it?`,
      options: ["closer", "farther"], answer: dNext <= dNow ? 0 : 1, keepOrder: true,
      rule: `At n = ${big(b)} x/n = ${fmtNum(ratio(b), 4)}. The law of large numbers is a long-run claim: x/n settles on P(A) as n grows, but any one batch can still push it away, most of all while n is small.`,
    };
  }
  const rig = playRig({ count: LLN_SCHEDULE.length, unit: "batch", stepMs: () => cfg.stepMs || 1100, predict: cfg.predict, label: "Predict whether each batch moves x/n closer to P(A)", ask, draw });
  box.append(again, rig.check, out, svg, rig.caption, rig.ask, rig.bar, code);
}

// ---------- widget: counting-calc ----------
const CC_PRESETS = {
  "arrange the 4 Aces (4!)": { n: 4, r: 4, kind: "perm" },
  "4 cards in sequence P(52,4)": { n: 52, r: 4, kind: "perm" },
  "a hand of 4 cards C(52,4)": { n: 52, r: 4, kind: "comb" },
  "front row P(90,9)": { n: 90, r: 9, kind: "perm" },
  "3 diamonds in sequence P(13,3)": { n: 13, r: 3, kind: "perm" },
  "committee C(20,5)": { n: 20, r: 5, kind: "comb" },
  "spade flush C(13,5) / C(52,5)": { n: 13, r: 5, kind: "comb", over: [52, 5] },
  "five die rolls 6^5": { n: 6, r: 5, kind: "pow" },
};
const factB = (n) => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
const permB = (n, r) => { let p = 1n; for (let i = 0; i < r; i++) p *= BigInt(n - i); return p; };
const combB = (n, r) => (r < 0 || r > n ? 0n : permB(n, r) / factB(r));
function countingCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Factorials, permutations and combinations"));
  const names = Object.keys(CC_PRESETS);
  let n = cfg.n ?? 52, r = cfg.r ?? 4, kind = cfg.kind || "perm", over = cfg.over || null;
  if (cfg.preset && CC_PRESETS[cfg.preset]) ({ n, r, kind, over = null } = CC_PRESETS[cfg.preset]);
  box.append(note("Two questions decide the formula. Does the order of the chosen items matter? May an item be chosen more than once? Enter n and r, or pick one of the lecture's examples."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { ({ n, r, kind, over = null } = CC_PRESETS[names[i]]); fn.input.value = n; fr.input.value = r; draw(); }, names.indexOf(cfg.preset)));
  const fn = numField("n (items to choose from)", n, (v) => { n = v; over = null; draw(); }, 1), fr = numField("r (items chosen)", r, (v) => { r = v; over = null; draw(); }, 1);
  const kinds = btnRow(["order matters, no repeats: P(n, r)", "order does not matter: C(n, r)", "order matters, repeats allowed: n^r"], (i) => { kind = ["perm", "comb", "pow"][i]; draw(); }, ["perm", "comb", "pow"].indexOf(kind));
  const out = el("div", "stat-grid"), work = el("div", "stat-steps"), code = rcode("");
  box.append(fn.row, fr.row, kinds, out, work, code);
  function draw() {
    n = Math.max(0, Math.min(170, Math.round(n || 0))); r = Math.max(0, Math.min(170, Math.round(r || 0)));
    if (r > n && kind !== "pow") { out.innerHTML = ""; work.innerHTML = `<div class="step error">r cannot exceed n when items are not repeated: there are only ${n} to choose from.</div>`; code.textContent = ""; return; }
    const nf = factB(n), rf = factB(r), P = permB(n, r), C = combB(n, r), pow = BigInt(n) ** BigInt(r);
    const chain = (m) => Array.from({ length: Math.min(r, 6) }, (_, i) => n - i).join(" × ") + (r > 6 ? " × … × " + (n - r + 1) : "");
    const rows = [[`n! = ${n}!`, sci(nf)], [`P(${n}, ${r}) = n! / (n − r)!`, sci(P), r ? `= ${chain()}` : "= 1 (nothing chosen)"], [`C(${n}, ${r}) = n! / (r! (n − r)!)`, sci(C), `= P(${n}, ${r}) / ${r}! = ${sci(P)} / ${sci(rf)}`], [`n^r = ${n}^${r}`, sci(pow)]];
    grid(out, rows);
    const chosen = kind === "perm" ? P : kind === "comb" ? C : pow;
    let html = kind === "perm"
      ? `<div class="step final">Order matters and nothing repeats: a <b>permutation</b>. Fill the ${r} positions in turn: ${chain()} = <b>${sci(P)}</b> sequences. Calculator: <code>${n} 2ndF nPr ${r}</code>.</div>`
      : kind === "comb"
        ? `<div class="step final">Order does not matter: a <b>combination</b> (a hand, a committee). Every group of ${r} was counted ${r}! = ${sci(rf)} times among the permutations, so divide: ${sci(P)} / ${sci(rf)} = <b>${sci(C)}</b>. Calculator: <code>${n} 2ndF nCr ${r}</code>.</div>`
        : `<div class="step final">Order matters and repeats are allowed (dice, cards drawn <b>with</b> replacement): the fundamental counting rule, ${n} choices at each of ${r} steps: ${Array(Math.min(r, 6)).fill(n).join(" × ")}${r > 6 ? " × …" : ""} = <b>${sci(pow)}</b>.</div>`;
    if (over) { const tot = combB(over[0], over[1]); html += `<div class="step">Probability: C(${n}, ${r}) / C(${over[0]}, ${over[1]}) = ${sci(chosen)} / ${sci(tot)} = <b>${fmtNum(Number(chosen) / Number(tot), 6)}</b> (about 1 in ${big(Math.round(Number(tot) / Number(chosen)))}).</div>`; }
    work.innerHTML = html;
    code.textContent = `factorial(${n})            # ${sci(nf)}\nchoose(${n}, ${r}) * factorial(${r})   # P(${n}, ${r}) = ${sci(P)}\nchoose(${n}, ${r})                # C(${n}, ${r}) = ${sci(C)}\n${n}^${r}                     # ${sci(pow)}`;
  }
  draw();
}

// ---------- widget: prob-rules ----------
const PR_PRESETS = {
  "7 or Ace (top card)": { a: [4, 52], b: [4, 52], ab: [0, 52], la: "7", lb: "Ace" },
  "red card or Ace": { a: [26, 52], b: [4, 52], ab: [2, 52], la: "red", lb: "Ace" },
  "heart or Ace": { a: [13, 52], b: [4, 52], ab: [1, 52], la: "heart", lb: "Ace" },
  "black card or heart": { a: [26, 52], b: [13, 52], ab: [0, 52], la: "black", lb: "heart" },
  "right-handed or iPhone (71 students)": { a: [61, 71], b: [58, 71], ab: [52, 71], la: "Right", lb: "iPhone" },
  "two dice: doubles or sum 7": { a: [6, 36], b: [6, 36], ab: [0, 36], la: "doubles", lb: "sum 7" },
  "two dice: a six or sum ≥ 10": { a: [11, 36], b: [6, 36], ab: [5, 36], la: "a six", lb: "sum ≥ 10" },
};
function probRules(box, cfg) {
  box.append(el("h4", null, cfg.title || "Complement and addition rules on a Venn diagram"));
  const names = Object.keys(PR_PRESETS);
  let st = { ...PR_PRESETS[cfg.preset || names[0]] };
  box.append(note("Counts out of |S|. Click a region of the diagram to read its probability. The addition rule subtracts the overlap so it is not counted twice; when the overlap is empty the events are mutually exclusive."));
  box.append(btnRow(names, (i) => { st = { ...PR_PRESETS[names[i]] }; sync(); draw(); }, names.indexOf(cfg.preset || names[0])));
  const fS = numField("|S| (outcomes)", st.a[1], (v) => { st.a[1] = st.b[1] = st.ab[1] = v; draw(); }, 1);
  const fA = numField("|A|", st.a[0], (v) => { st.a[0] = v; draw(); }, 1), fB = numField("|B|", st.b[0], (v) => { st.b[0] = v; draw(); }, 1), fAB = numField("|A ∩ B|", st.ab[0], (v) => { st.ab[0] = v; draw(); }, 1);
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid"), work = el("div", "stat-steps");
  box.append(fS.row, fA.row, fB.row, fAB.row, svg, out, work);
  let region = "union";
  function sync() { fS.input.value = st.a[1]; fA.input.value = st.a[0]; fB.input.value = st.b[0]; fAB.input.value = st.ab[0]; }
  function draw() {
    const S = st.a[1], A = st.a[0], B = st.b[0], AB = st.ab[0];
    const bad = AB > Math.min(A, B) || A > S || B > S || A + B - AB > S;
    svg.innerHTML = "";
    const rA = 70 + 40 * Math.sqrt(A / S), rB = 70 + 40 * Math.sqrt(B / S);
    const ov = AB > 0 ? 0.35 + 0.6 * (AB / Math.min(A, B)) : 0;
    const cxA = 230, cxB = AB > 0 ? cxA + rA + rB - ov * 2 * Math.min(rA, rB) : cxA + rA + rB + 24, cy = 115;
    svg.append(svgEl("rect", { x: 10, y: 10, width: 620, height: 210, rx: 8, fill: "var(--paper)", stroke: "var(--rule)" }));
    const regions = [["neither", "var(--paper-3)"], ["A", "var(--blue-soft)"], ["B", "var(--green-soft)"]];
    for (const [name, fill] of regions) {
      const shape = name === "neither" ? svgEl("rect", { x: 10, y: 10, width: 620, height: 210, rx: 8, fill: "transparent" }) : svgEl("circle", { cx: name === "A" ? cxA : cxB, cy, r: name === "A" ? rA : rB, fill, stroke: name === "A" ? "var(--blue)" : "var(--green)", "stroke-width": 2, opacity: 0.9 });
      shape.style.cursor = "pointer";
      shape.addEventListener("click", (e) => { e.stopPropagation(); region = name === "neither" ? "neither" : region === name ? "union" : name; paint(); });
      svg.append(shape);
    }
    if (AB > 0) { const lens = svgEl("circle", { cx: (cxA + cxB) / 2, cy, r: 6, fill: "var(--hl)" }); lens.style.cursor = "pointer"; lens.addEventListener("click", (e) => { e.stopPropagation(); region = "both"; paint(); }); svg.append(lens); svg.append(svgEl("text", { x: (cxA + cxB) / 2, y: cy - 12, "text-anchor": "middle", "font-size": 11, fill: "var(--hl)" }, `A∩B: ${AB}`)); }
    svg.append(svgEl("text", { x: cxA - rA / 2, y: cy + 4, "text-anchor": "middle", "font-size": 13, fill: "var(--blue)" }, `A = ${st.la}: ${A}`));
    svg.append(svgEl("text", { x: cxB + rB / 2, y: cy + 4, "text-anchor": "middle", "font-size": 13, fill: "var(--green)" }, `B = ${st.lb}: ${B}`));
    svg.append(svgEl("text", { x: 20, y: 210, "font-size": 11, fill: "var(--ink-dim)" }, `S: ${S} outcomes · neither: ${S - (A + B - AB)}`));
    if (AB === 0) svg.append(svgEl("text", { x: 620, y: 30, "text-anchor": "end", "font-size": 11, fill: "var(--hl)" }, "mutually exclusive"));
    function paint() {
      const val = { union: [A + B - AB, "P(A ∪ B)"], A: [A, "P(A)"], B: [B, "P(B)"], both: [AB, "P(A ∩ B)"], neither: [S - (A + B - AB), "P(neither) = 1 − P(A ∪ B)"] }[region];
      grid(out, [["P(A)", frac(A, S)], ["P(B)", frac(B, S)], ["P(A ∩ B)", frac(AB, S)], ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", frac(A + B - AB, S), `${A}/${S} + ${B}/${S} − ${AB}/${S}`], ["P(Ā) = 1 − P(A)", frac(S - A, S)], [`selected region: ${val[1]}`, frac(val[0], S)]]);
      const indep = Math.abs(AB / S - (A / S) * (B / S)) < 1e-9;
      work.innerHTML = bad ? `<div class="step error">These counts are impossible: |A ∩ B| cannot exceed |A| or |B|, and |A ∪ B| cannot exceed |S|.</div>` : (AB === 0
        ? `<div class="step final"><b>Mutually exclusive</b>: A and B cannot both happen in one trial, so P(A ∩ B) = 0 and the addition rule collapses to P(A ∪ B) = P(A) + P(B) = ${frac(A + B, S)}.</div>`
        : `<div class="step">Not mutually exclusive: ${AB} outcome${AB > 1 ? "s are" : " is"} in both, so adding P(A) and P(B) would count ${AB > 1 ? "them" : "it"} twice. Subtract the overlap once.</div>`)
        + `<div class="step ${indep ? "final" : ""}">Independence check: P(A)·P(B) = ${fmtNum((A / S) * (B / S), 4)} versus P(A ∩ B) = ${fmtNum(AB / S, 4)} → ${indep ? "<b>independent</b>" : "<b>dependent</b>"} (mutually exclusive events with positive probabilities are always dependent: knowing A happened tells you B did not).</div>`;
    }
    paint();
  }
  draw();
}

// ---------- widget: birthday ----------
function birthday(box, cfg) {
  box.append(el("h4", null, cfg.title || "The birthday problem: P(at least two share a birthday)"));
  let n = cfg.n ?? 23;
  box.append(note("Work through the complement: the probability that all n birthdays are different is a product of shrinking fractions. One minus that is the probability of a match."));
  const s = slider("People in the room n", 1, 70, 1, n, (v) => { n = v; draw(); }, (v) => `n = ${v}`);
  const out = el("div", "stat-grid"), svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" }), work = el("div", "stat-steps"), simRow = el("div", "unit-row"), code = rcode("");
  const simBtn = el("button", "reset-btn", "Simulate 10 000 rooms"), simOut = el("span", "stat-note", "");
  simRow.append(simBtn, simOut);
  box.append(s.row, out, svg, work, simRow, code);
  const pNoMatch = (k) => { let p = 1; for (let i = 0; i < k; i++) p *= (365 - i) / 365; return p; };
  simBtn.addEventListener("click", () => { let hits = 0; for (let t = 0; t < 10000; t++) { const seen = new Set(); for (let i = 0; i < n; i++) { const d = Math.floor(Math.random() * 365); if (seen.has(d)) { hits++; break; } seen.add(d); } } simOut.textContent = `simulated: ${hits}/10000 = ${fmtNum(hits / 10000, 4)} (exact ${fmtNum(1 - pNoMatch(n), 4)})`; });
  function draw() {
    const q = pNoMatch(n), p = 1 - q;
    grid(out, [["P(all different)", fmtNum(q, 4), `= P(365, ${n}) / 365^${n}`], ["P(at least one match) = 1 − P(all different)", fmtNum(p, 4)], ["first shared birthday more likely than not", "n = 23 (0.5073)"]]);
    const terms = Array.from({ length: Math.min(n, 5) }, (_, i) => `${365 - i}/365`);
    work.innerHTML = `<div class="step">P(all different) = ${terms.join(" · ")}${n > 5 ? ` · … · ${365 - n + 1}/365` : ""} = ${fmtNum(q, 4)}. Person 1 can have any birthday; person 2 must avoid one date, person 3 two dates, and so on.</div><div class="step final">P(match) = 1 − ${fmtNum(q, 4)} = <b>${fmtNum(p, 4)}</b> for n = ${n}.</div>`;
    svg.innerHTML = "";
    const X0 = 40, X1 = 620, Y0 = 170, Y1 = 20;
    const xOf = (k) => X0 + ((X1 - X0) * k) / 70, yOf = (v) => Y0 - (Y0 - Y1) * v;
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
    for (const v of [0, 0.5, 1]) { svg.append(svgEl("line", { x1: X0, y1: yOf(v), x2: X1, y2: yOf(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); svg.append(svgEl("text", { x: X0 - 6, y: yOf(v) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, String(v))); }
    for (const k of [10, 23, 30, 50, 70]) svg.append(svgEl("text", { x: xOf(k), y: Y0 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, String(k)));
    svg.append(svgEl("polyline", { points: Array.from({ length: 71 }, (_, k) => `${xOf(k).toFixed(1)},${yOf(1 - pNoMatch(k)).toFixed(1)}`).join(" "), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    svg.append(svgEl("circle", { cx: xOf(n), cy: yOf(p), r: 5, fill: "var(--hl)" }));
    svg.append(svgEl("text", { x: xOf(n) + 8, y: yOf(p) - 6, "font-size": 11, fill: "var(--hl)" }, `n = ${n}: ${fmtNum(p, 3)}`));
    code.textContent = `n.people <- ${n}\nprob.no.match <- prod((365 - 0:(n.people-1)) / 365)   # ${fmtNum(q, 4)}\n1 - prob.no.match                                    # ${fmtNum(p, 4)}`;
  }
  draw();
}

// ---------- widget: two-way ----------
function twoWay(box, cfg) {
  box.append(el("h4", null, cfg.title || "A two-way table: conditional probability and independence"));
  const rows = cfg.rows || ["Left", "Right", "Ambidextrous"], cols = cfg.cols || ["iPhone", "Android", "Other"];
  const data = (cfg.data || [[5, 2, 1], [52, 5, 4], [1, 0, 1]]).map((r) => r.slice());
  box.append(note("Click a row name to restrict the sample space to that row, a column name for that column, or a cell for its joint probability. Every conditional probability is a count divided by a row or column total."));
  const wrap = el("div", "table-wrap"), out = el("div", "stat-grid"), work = el("div", "stat-steps");
  box.append(wrap, out, work);
  let sel = { kind: cfg.select || "cell", r: cfg.r ?? 1, c: cfg.c ?? 0 };
  function draw() {
    const rowT = data.map((r) => r.reduce((a, b) => a + b, 0)), colT = cols.map((_, j) => data.reduce((a, r) => a + r[j], 0)), N = rowT.reduce((a, b) => a + b, 0);
    const t = el("table", "group-table tw-table");
    const head = el("tr"); head.append(el("th", null, ""));
    cols.forEach((c, j) => { const th = el("th", sel.kind === "col" && sel.c === j ? "sel" : "", c); th.addEventListener("click", () => { sel = { kind: "col", c: j, r: sel.r }; draw(); }); head.append(th); });
    head.append(el("th", null, "row total"));
    const thead = el("thead"); thead.append(head); t.append(thead);
    const tb = el("tbody");
    rows.forEach((rn, i) => {
      const tr = el("tr");
      const th = el("th", sel.kind === "row" && sel.r === i ? "sel" : "", rn); th.addEventListener("click", () => { sel = { kind: "row", r: i, c: sel.c }; draw(); }); tr.append(th);
      cols.forEach((_, j) => {
        const td = el("td", (sel.kind === "row" && sel.r === i) || (sel.kind === "col" && sel.c === j) ? "sel" : sel.kind === "cell" && sel.r === i && sel.c === j ? "hit" : "");
        const inp = document.createElement("input"); inp.type = "number"; inp.min = 0; inp.value = data[i][j]; inp.className = "q-input small"; inp.setAttribute("aria-label", `${rn} ${cols[j]}`);
        inp.addEventListener("input", () => { data[i][j] = Math.max(0, Math.round(Number(inp.value) || 0)); draw(); });
        inp.addEventListener("focus", () => { sel = { kind: "cell", r: i, c: j }; paint(); });
        td.append(inp); tr.append(td);
      });
      tr.append(el("td", null, String(rowT[i])));
      tb.append(tr);
    });
    const tot = el("tr"); tot.append(el("th", null, "column total")); colT.forEach((c) => tot.append(el("td", null, String(c)))); tot.append(el("td", null, `n = ${N}`)); tb.append(tot);
    t.append(tb);
    wrap.innerHTML = ""; wrap.append(t);
    paint();
    function paint() {
      const i = sel.r, j = sel.c, R = rows[i], C = cols[j], cellV = data[i][j];
      const pR = rowT[i] / N, pC = colT[j] / N, pRC = cellV / N;
      const indep = Math.abs(pRC - pR * pC) < 1e-9;
      if (sel.kind === "row") {
        grid(out, [[`P(${R}) = row total / n`, frac(rowT[i], N)], ...cols.map((c, jj) => [`P(${c} | ${R}) = ${data[i][jj]} / ${rowT[i]}`, frac(data[i][jj], rowT[i])])]);
        work.innerHTML = `<div class="step final">Given <b>${R}</b>, the sample space shrinks to that row (${rowT[i]} students). Each conditional probability is the cell count over the <b>row</b> total, and the row's conditionals add to 1.</div>`;
      } else if (sel.kind === "col") {
        grid(out, [[`P(${C}) = column total / n`, frac(colT[j], N)], ...rows.map((r, ii) => [`P(${r} | ${C}) = ${data[ii][j]} / ${colT[j]}`, frac(data[ii][j], colT[j])])]);
        work.innerHTML = `<div class="step final">Given <b>${C}</b>, only that column counts (${colT[j]} students): cell over the <b>column</b> total.</div>`;
      } else {
        grid(out, [[`P(${R} ∩ ${C}) = cell / n`, frac(cellV, N)], [`P(${R})`, frac(rowT[i], N)], [`P(${C})`, frac(colT[j], N)], [`P(${C} | ${R}) = cell / row total`, frac(cellV, rowT[i])], [`P(${R} | ${C}) = cell / column total`, frac(cellV, colT[j])], [`P(${R}) · P(${C})`, fmtNum(pR * pC, 4)]]);
        work.innerHTML = `<div class="step">Two different conditionals from one cell: P(${C} | ${R}) restricts to the row, P(${R} | ${C}) restricts to the column. Also P(${R} ∩ ${C}) = P(${R}) · P(${C} | ${R}) = ${fmtNum(pR, 4)} × ${fmtNum(cellV / rowT[i], 4)} = ${fmtNum(pRC, 4)} (multiplication rule).</div><div class="step ${indep ? "final" : "error"}">Independence test: P(${R} ∩ ${C}) = ${fmtNum(pRC, 4)} versus P(${R}) · P(${C}) = ${fmtNum(pR * pC, 4)} → <b>${indep ? "independent" : "dependent"}</b>${indep ? "" : `; equivalently P(${C} | ${R}) = ${fmtNum(cellV / rowT[i], 4)} ≠ P(${C}) = ${fmtNum(pC, 4)}`}.</div>`;
      }
    }
  }
  draw();
}

// ---------- widget: bayes-tree ----------
const BAYES_PRESETS = {
  "sex and handedness": { branches: [["Female", 0.6], ["Male", 0.4]], B: "Left-handed", notB: "Right-handed", cond: [0.05, 0.15] },
  "defective CPUs": { branches: [["Intel", 0.85], ["AMD", 0.10], ["Other", 0.05]], B: "Defective", notB: "Non-defective", cond: [0.01, 0.03, 0.02] },
  "COVID serology": { branches: [["Sick", 0.05], ["Not sick", 0.95]], B: "Tests positive", notB: "Tests negative", cond: [0.90, 0.08] },
  "temperature segments (Lab 5)": { branches: [["Cold", 0.34387], ["Mid", 0.33876], ["Warm", 0.31737]], B: "Precip > 0", notB: "Precip = 0", cond: [0.57145, 0.48791, 0.39713] },
};
function bayesTree(box, cfg) {
  box.append(el("h4", null, cfg.title || "Bayes' rule on a tree diagram"));
  const names = Object.keys(BAYES_PRESETS);
  let st = JSON.parse(JSON.stringify(BAYES_PRESETS[cfg.preset || names[0]]));
  box.append(note("Priors on the first branches, conditional probabilities on the second. Multiply along a path for a joint probability; add the paths that end in B for P(B); divide a path by P(B) to reverse the condition."));
  box.append(btnRow(names, (i) => { st = JSON.parse(JSON.stringify(BAYES_PRESETS[names[i]])); rebuild(); }, names.indexOf(cfg.preset || names[0])));
  const inputs = el("div", "oop-controls"), svg = svgEl("svg", { viewBox: "0 0 640 260", class: "curve-svg net-svg bayes-svg" }), out = el("div", "table-wrap"), work = el("div", "stat-steps");
  box.append(inputs, svg, out, work);
  function rebuild() {
    inputs.innerHTML = "";
    st.branches.forEach(([name, p], i) => {
      const f1 = numField(`P(${name})`, p, (v) => { st.branches[i][1] = v; draw(); }, 0.01);
      const f2 = numField(`P(${st.B} | ${name})`, st.cond[i], (v) => { st.cond[i] = v; draw(); }, 0.01);
      const row = el("div", "unit-row"); row.append(f1.row, f2.row); inputs.append(row);
    });
    draw();
  }
  function draw() {
    const k = st.branches.length, priors = st.branches.map((b) => b[1]), sumP = priors.reduce((a, b) => a + b, 0);
    const joint = priors.map((p, i) => p * st.cond[i]), PB = joint.reduce((a, b) => a + b, 0);
    svg.innerHTML = "";
    const rowH = 260 / k;
    st.branches.forEach(([name], i) => {
      const y = rowH * (i + 0.5);
      svg.append(svgEl("line", { x1: 30, y1: 130, x2: 200, y2: y, stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: 100, y: (130 + y) / 2 - 6, "font-size": 11, fill: "var(--hl)" }, fmtNum(priors[i], 3)));
      svg.append(svgEl("text", { x: 205, y: y + 4, "font-size": 12, fill: "var(--ink)" }, name));
      for (const [j, lab, p] of [[0, st.B, st.cond[i]], [1, st.notB, 1 - st.cond[i]]]) {
        const y2 = y + (j ? 16 : -16);
        svg.append(svgEl("line", { x1: 290, y1: y, x2: 400, y2: y2, stroke: j ? "var(--rule-strong)" : "var(--green)" }));
        svg.append(svgEl("text", { x: 345, y: (y + y2) / 2 + (j ? 12 : -4), "font-size": 11, fill: j ? "var(--ink-dim)" : "var(--green)" }, fmtNum(p, 3)));
        svg.append(svgEl("text", { x: 405, y: y2 + 4, "font-size": 11, fill: j ? "var(--ink-dim)" : "var(--ink)" }, `${lab}: ${fmtNum(priors[i] * p, 4)}`));
      }
    });
    svg.append(svgEl("text", { x: 30, y: 122, "font-size": 11, fill: "var(--ink-dim)" }, "start"));
    let html = `<table class="group-table"><thead><tr><th>A<sub>i</sub></th><th>P(A<sub>i</sub>)</th><th>P(B | A<sub>i</sub>)</th><th>P(A<sub>i</sub> ∩ B) = product</th><th>P(A<sub>i</sub> | B) = joint / P(B)</th><th>per 10 000</th></tr></thead><tbody>`;
    st.branches.forEach(([name], i) => { html += `<tr><td>${esc(name)}</td><td>${fmtNum(priors[i], 3)}</td><td>${fmtNum(st.cond[i], 3)}</td><td>${fmtNum(priors[i], 3)} × ${fmtNum(st.cond[i], 3)} = ${fmtNum(joint[i], 4)}</td><td>${fmtNum(joint[i], 4)} / ${fmtNum(PB, 4)} = <b>${fmtNum(joint[i] / PB, 4)}</b></td><td>${Math.round(10000 * priors[i])} ${esc(name)}, ${Math.round(10000 * joint[i])} with ${esc(st.B)}</td></tr>`; });
    html += `<tr><td><b>total</b></td><td>${fmtNum(sumP, 3)}</td><td></td><td><b>P(B) = ${fmtNum(PB, 4)}</b></td><td>${fmtNum(joint.reduce((a, j) => a + j / PB, 0), 3)}</td><td>${Math.round(10000 * PB)} with ${esc(st.B)} in all</td></tr></tbody></table>`;
    out.innerHTML = html;
    work.innerHTML = (Math.abs(sumP - 1) > 1e-6 ? `<div class="step error">The priors add to ${fmtNum(sumP, 3)}, not 1: the A<sub>i</sub> must be exhaustive and mutually exclusive.</div>` : "")
      + `<div class="step">P(${esc(st.B)}) = ${st.branches.map(([n], i) => `${fmtNum(priors[i], 3)}(${fmtNum(st.cond[i], 3)})`).join(" + ")} = ${joint.map((j) => fmtNum(j, 4)).join(" + ")} = <b>${fmtNum(PB, 4)}</b>: the law of total probability (add every path that ends in ${esc(st.B)}).</div>`
      + `<div class="step final">Bayes: P(${esc(st.branches[0][0])} | ${esc(st.B)}) = P(${esc(st.branches[0][0])} ∩ ${esc(st.B)}) / P(${esc(st.B)}) = ${fmtNum(joint[0], 4)} / ${fmtNum(PB, 4)} = <b>${fmtNum(joint[0] / PB, 4)}</b>. The condition is reversed: we started from P(${esc(st.B)} | ${esc(st.branches[0][0])}) = ${fmtNum(st.cond[0], 3)}.</div>`;
  }
  rebuild();
}

// ---------- widget: sim-lab ----------
// The Lab 4 experiments: distribution of X from m simulated trials, the estimated P(E), and the R.
const SIM = {
  coins: { name: "n coins: X = number of heads", n: [1, 100, 10], hasP: true, hasReplace: false, event: (n) => Math.round(n / 2), r: (m, n, p, rep) => `Flip.Once <- function(){ return( sample(c("H","T"), 1${p !== 0.5 ? `, prob=c(${p}, ${fmtNum(1 - p, 3)})` : ""}) ) }\nX.vals <- replicate(${m}, sum(replicate(${n}, Flip.Once()) == "H"))\nbarplot(prop.table(table(X.vals)), xlab="X = # heads", ylab="rel. freq.")` },
  dice2: { name: "two dice: X = the sum", n: null, hasP: false, hasReplace: false, event: () => 7, r: (m) => `Prob.E <- function(m){\n  X.vals <- replicate(m, sum( sample.int(6, 2, replace=TRUE) ))\n  k <- sum(X.vals == 7)\n  return(k/m)\n}\nProb.E(${m})` },
  dice3: { name: "n dice: X = number of 3s", n: [1, 100, 5], hasP: false, hasReplace: false, event: (n) => Math.round(n / 6), r: (m, n) => `Roll.Some.Dice <- function(m, n){\n  X.vals <- replicate(m, sum(sample.int(6, n, replace=TRUE)==3))\n  X.tab <- table(X.vals)\n  barplot(X.tab, col="pink", xlab="X = # 3s", ylab="Frequency",\n          main=paste0("Number of 3s Out of ", n, " Dice (Based on ", m, " Trials)"))\n}\nRoll.Some.Dice(${m}, ${n})` },
  cards: { name: "n cards: X = number of red cards", n: [1, 50, 5], hasP: false, hasReplace: true, event: (n) => Math.round(n / 2), r: (m, n, p, rep) => `Draw.Cards <- function(m, n, replace){\n  deck <- c(rep("R", 26), rep("B", 26))\n  X.vals <- replicate(m, sum(sample(deck, n, replace) == "R"))\n  histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1),\n            xlab="X = # red cards", ylab="Prob. Density",\n            main=paste0("Number of Red Cards Out of ", n, " Cards (", m, " Trials)"))\n}\nDraw.Cards(${m}, ${n}, ${rep ? "TRUE" : "FALSE"})` },
};
function simLab(box, cfg) {
  box.append(el("h4", null, cfg.title || "Lab 4 simulations: the distribution of X from m trials"));
  const keys = Object.keys(SIM);
  let key = SIM[cfg.experiment] ? cfg.experiment : "dice3";
  let m = [100, 1000, 10000].includes(cfg.m) ? cfg.m : 1000, n = cfg.n ?? SIM[key].n?.[2] ?? 2, p = cfg.p ?? 0.5, replace = cfg.replace ?? false, target = cfg.target ?? null, seed = cfg.seed ?? 4;
  box.append(note("Choose an experiment, the number of trials m and the number of items n. The playback runs the trials in batches (m = 10, 20, 50 … up to the chosen m): the bars are the relative frequencies of each value of X, and the highlighted bar is the event E being estimated."));
  if (!cfg.experiment) box.append(btnRow(keys.map((k) => SIM[k].name), (i) => { key = keys[i]; n = SIM[key].n?.[2] ?? n; target = null; rebuild(); }, keys.indexOf(key)));
  const ctl = el("div"), runRow = btnRow(["m = 100", "m = 1 000", "m = 10 000", "new trials"], (i) => { if (i < 3) m = [100, 1000, 10000][i]; else seed++; run(true); }, [100, 1000, 10000].indexOf(m));
  const chart = el("div"), out = el("div", "stat-grid"), code = rcode(""), evRow = el("div");
  let xs = [], lo = 0, hi = 0, sched = [];
  const schedule = (M) => [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000].filter((v) => v <= M);
  /** Trials run at position pos (rest points are the schedule; a step adds its batch in proportion). */
  function mAt(pos) {
    if (pos <= 0) return 0;
    const k = Math.floor(pos + 1e-9), f = pos - k;
    if (k >= sched.length) return sched[sched.length - 1];
    const a = k ? sched[k - 1] : 0;
    return Math.round(a + f * (sched[k] - a));
  }
  function draw(pos) {
    const S = SIM[key], mm = mAt(pos);
    const counts = Array.from({ length: hi - lo + 1 }, () => 0), labels = counts.map((_, i) => lo + i);
    let s1 = 0, s2 = 0;
    for (let i = 0; i < mm; i++) { counts[xs[i] - lo]++; s1 += xs[i]; }
    const mean = mm ? s1 / mm : NaN;
    for (let i = 0; i < mm; i++) s2 += (xs[i] - mean) ** 2;
    bars(chart, counts, labels, new Set([target - lo]), Math.max(1, mm));
    const k = counts[target - lo] || 0;
    const exact = key === "dice2" ? `${6 - Math.abs(7 - target)}/36 = ${fmtNum((6 - Math.abs(7 - target)) / 36, 4)}` : key === "coins" && n === 1 ? (target === 1 ? fmtNum(p, 4) : fmtNum(1 - p, 4)) : "(later: binomial / hypergeometric)";
    const center = key === "coins" ? `n·p = ${fmtNum(n * p, 2)}` : key === "dice2" ? "7" : key === "dice3" ? `n/6 = ${fmtNum(n / 6, 2)}` : `n/2 = ${fmtNum(n / 2, 2)}`;
    grid(out, [["trials m", big(mm)], [`successes k (X = ${target})`, big(k)], ["P(E) ≈ k/m", mm ? fmtNum(k / mm, 4) : "—", `exact: ${exact}`], ["mean of X over the trials", mm ? fmtNum(mean, 3) : "—", `theory: ${center}`], ["standard deviation of X", mm > 1 ? fmtNum(Math.sqrt(s2 / (mm - 1)), 3) : "—"]]);
    code.textContent = S.r(m, n, p, replace) + `\n# estimate: P(X = ${target}) ≈ ${k}/${mm} = ${mm ? fmtNum(k / mm, 4) : "…"}`;
    if (!mm) return `No trials yet. Each step adds a batch of trials until m = ${big(m)}.`;
    const kk = Math.floor(pos + 1e-9);
    if (pos > kk + 1e-9) return `Running trials up to m = ${big(sched[kk])}: k/m = ${k}/${mm} = ${fmtNum(k / mm, 4)} so far.`;
    return `m = ${big(mm)} trials: X = ${target} came up ${big(k)} times, k/m = ${fmtNum(k / mm, 4)}${mm === m ? `; exact ${exact.startsWith("(") ? "value comes later in the course" : exact}. The bars settle into the shape of the distribution as m grows.` : "."}`;
  }
  const rig = playRig({ count: schedule(m).length, unit: "batch", stepMs: () => cfg.stepMs || 900, predict: false, ask: () => null, draw });
  rig.check.hidden = true;
  box.append(ctl, runRow, evRow, chart, rig.caption, rig.bar, out, code);
  function rebuild() {
    ctl.innerHTML = "";
    const S = SIM[key];
    if (S.n) ctl.append(slider("n (items per trial)", S.n[0], S.n[1], 1, Math.min(S.n[1], Math.max(S.n[0], n)), (v) => { n = v; target = null; run(false); }, (v) => `n = ${v}`).row);
    if (S.hasP) ctl.append(slider("P(H) for one coin", 0.05, 0.95, 0.05, p, (v) => { p = v; run(false); }, (v) => `p = ${fmtNum(v, 2)}`).row);
    if (S.hasReplace) ctl.append(toggle("replace = TRUE (put each card back before the next draw)", replace, (v) => { replace = v; run(false); }).row);
    run(true);
  }
  function trial(u) {
    if (key === "coins") { let h = 0; for (let i = 0; i < n; i++) if (u() < p) h++; return h; }
    if (key === "dice2") return Math.floor(u() * 6) + Math.floor(u() * 6) + 2;
    if (key === "dice3") { let c = 0; for (let i = 0; i < n; i++) if (Math.floor(u() * 6) === 2) c++; return c; }
    let red = 26, tot = 52, c = 0;
    for (let i = 0; i < n; i++) { const isRed = u() < red / tot; if (isRed) c++; if (!replace) { tot--; if (isRed) red--; } }
    return c;
  }
  // fresh: back to the full run (the finished picture); otherwise keep the playback position.
  function run(fresh) {
    const S = SIM[key], u = seeded(seed);
    sched = schedule(m);
    xs = new Array(m);
    for (let i = 0; i < m; i++) xs[i] = trial(u);
    lo = key === "dice2" ? 2 : 0; hi = key === "dice2" ? 12 : n;
    if (target == null || target < lo || target > hi) target = S.event(n);
    evRow.innerHTML = "";
    evRow.append(slider("Event E: X =", lo, hi, 1, target, (v) => { target = v; rig.redraw(); }, (v) => `X = ${v}`).row);
    const keep = Math.min(rig.pb.pos(), sched.length);
    if (sched.length !== rig.count()) rig.restart(sched.length);
    rig.pb.set(fresh ? sched.length : keep);
  }
  rebuild();
}

// ---------- widget: birthday-play ----------
// Person k enters the room and P(all different) is multiplied by (365 − k + 1)/365.
function birthdayPlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "The birthday product, one person at a time"));
  const N = Math.max(2, Math.min(70, Math.round(cfg.n ?? 30)));
  const pNo = (k) => { let q = 1; for (let i = 0; i < k; i++) q *= (365 - i) / 365; return q; };
  let cross = 1; while (cross < 366 && 1 - pNo(cross) <= 0.5) cross++;
  const svg = svgEl("svg", { viewBox: "0 0 640 220", class: "curve-svg net-svg" }), work = el("div", "stat-steps");
  const X0 = 46, X1 = 620, Y0 = 170, Y1 = 22;
  const xOf = (k) => X0 + ((X1 - X0) * k) / N, yOf = (v) => Y0 - (Y0 - Y1) * v;
  function draw(pos, asking) {
    const k = Math.min(N, Math.floor(pos + 1e-9)), f = pos - k;
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
    for (const v of [0, 0.5, 1]) { svg.append(svgEl("line", { x1: X0, y1: yOf(v), x2: X1, y2: yOf(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); svg.append(svgEl("text", { x: X0 - 6, y: yOf(v) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, String(v))); }
    for (let t = 5; t <= N; t += 5) svg.append(svgEl("text", { x: xOf(t), y: Y0 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, String(t)));
    svg.append(svgEl("text", { x: X1, y: Y0 + 30, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "people in the room"));
    svg.append(svgEl("text", { x: X0 + 6, y: Y1 - 8, "font-size": 10.5, fill: "var(--blue)" }, "P(all different)"));
    svg.append(svgEl("text", { x: X0 + 110, y: Y1 - 8, "font-size": 10.5, fill: "var(--hl)" }, "P(at least one match)"));
    if (cross <= N) svg.append(svgEl("line", { x1: xOf(cross), y1: Y0, x2: xOf(cross), y2: Y1, stroke: "var(--rule-strong)", "stroke-dasharray": "3 3", opacity: k >= cross ? 1 : 0 }));
    // Bars: one per person in the room; the arriving person's bar shrinks from the old value.
    const w = Math.max(2, ((X1 - X0) / N) * 0.6);
    const shown = Math.min(N, k + (f > 0 ? 1 : 0));
    for (let i = 1; i <= shown; i++) {
      const q = i <= k ? pNo(i) : pNo(i - 1) + f * (pNo(i) - pNo(i - 1));
      const hot = i === (f > 0 ? k + 1 : k) || i === asking + 1;
      svg.append(svgEl("rect", { x: xOf(i) - w / 2, y: yOf(q), width: w, height: Y0 - yOf(q), fill: hot ? "var(--hl-soft)" : "var(--blue-soft)", stroke: "var(--blue)", "stroke-width": hot ? 1.8 : 0.8 }));
      svg.append(svgEl("circle", { cx: xOf(i), cy: yOf(1 - q), r: hot ? 4.5 : 2.6, fill: "var(--hl)" }));
    }
    if (k >= 1) svg.append(svgEl("text", { x: Math.min(X1 - 60, xOf(k) + 8), y: yOf(1 - pNo(k)) - 8, "font-size": 11, fill: "var(--hl)" }, `${fmtNum(1 - pNo(k), 4)}`));
    const terms = Array.from({ length: k }, (_, i) => `${365 - i}/365`);
    const chain = k <= 4 ? terms.join(" × ") : `${terms.slice(0, 2).join(" × ")} × … × ${terms.slice(-2).join(" × ")}`;
    work.innerHTML = k ? `<div class="step">P(all different) = ${chain} = <b>${fmtNum(pNo(k), 4)}</b></div><div class="step final">P(at least one match) = 1 − ${fmtNum(pNo(k), 4)} = <b>${fmtNum(1 - pNo(k), 4)}</b></div>` : "";
    if (k === 0 && f === 0) return "The room is empty. P(all different) starts at 1: nobody can share a birthday yet.";
    if (f > 0) return `Person ${k + 1} walks in and must avoid the ${k} birthday${k === 1 ? "" : "s"} already taken: × ${365 - k}/365.`;
    let text = `Person ${k}: × ${366 - k}/365, P(all different) = ${fmtNum(pNo(k), 4)}, P(match) = ${fmtNum(1 - pNo(k), 4)}.`;
    if (k === 1) text = "Person 1 can have any birthday: × 365/365, P(all different) = 1.";
    if (k === cross) text += ` P(match) passes 0.5 here, at ${cross} people, far fewer than half of 365.`;
    return text;
  }
  function ask(k) {
    if (k === 0) return { q: "Before anyone enters: at which person does P(at least one match) first pass 0.5?", ...numOptions(cross, [12, 50, 183]), rule: `The product of shrinking fractions falls below 0.5 at person ${cross}: P(all different) = ${fmtNum(pNo(cross), 4)}, so P(match) = ${fmtNum(1 - pNo(cross), 4)}.` };
    if (k >= N) return null;
    const opts = [366 - k, 365 - k, 364 - k, 1].map((v) => `${v}/365`);
    return { q: `Person ${k + 1} enters. P(all different) is multiplied by which fraction?`, options: opts, answer: 1, rule: `Person ${k + 1} must avoid the ${k} birthday${k === 1 ? "" : "s"} already in the room: (365 − ${k})/365 = ${365 - k}/365.` };
  }
  const rig = playRig({ count: N, unit: "person", stepMs: () => cfg.stepMs || 900, predict: cfg.predict, label: "Predict each factor before the person enters", ask, draw });
  box.append(rig.check, svg, rig.caption, rig.ask, rig.bar, work);
}

// ---------- widget: bayes-flow-play ----------
// Natural frequencies: 10 000 split by the Aᵢ, then by B, then the sample space restricted to B.
const BAYES_POP = { "sex and handedness": "students", "defective CPUs": "CPUs", "COVID serology": "people", "temperature segments (Lab 5)": "days" };
function bayesFlowPlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "Bayes with counts: split, split again, restrict to B"));
  const names = Object.keys(BAYES_PRESETS), POP = 10000;
  let name = BAYES_PRESETS[cfg.preset] ? cfg.preset : "defective CPUs";
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { name = names[i]; rig.restart(); }, names.indexOf(name)));
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg net-svg" });
  const st = () => BAYES_PRESETS[name];
  const counts = () => {
    const s = st(), nA = s.branches.map(([, p]) => Math.round(POP * p)), nAB = s.branches.map(([, p], i) => Math.round(POP * p * s.cond[i]));
    return { s, nA, nAB, nB: nAB.reduce((a, b) => a + b, 0) };
  };
  const COLORS = ["var(--blue)", "var(--green)", "var(--hl)", "var(--red)"];
  function draw(pos, asking) {
    const { s, nA, nAB, nB } = counts(), pop = BAYES_POP[name] || "outcomes";
    const L = 20, R = 620, W = R - L, rows = [24, 92, 160, 236], h = 34;
    const grow = (lvl) => Math.max(0, Math.min(1, pos - (lvl - 1)));
    svg.innerHTML = "";
    const label = (x, y, t, fill = "var(--ink)", anchor = "middle", size = 11) => svg.append(svgEl("text", { x, y, "text-anchor": anchor, "font-size": size, fill }, t));
    svg.append(svgEl("rect", { x: L, y: rows[0], width: W, height: h, fill: "var(--paper-3)", stroke: "var(--rule-strong)", rx: 3 }));
    label(L + W / 2, rows[0] + 22, `${big(POP)} ${pop}`, "var(--ink)", "middle", 13);
    // Level 1: split by Aᵢ (widths ∝ prior, at least 40 px so every label fits).
    const raw = nA.map((c) => Math.max(40, (W * c) / POP)), sc = W / raw.reduce((a, b) => a + b, 0);
    const ws = raw.map((v) => v * sc), xs = ws.map((_, i) => L + ws.slice(0, i).reduce((a, b) => a + b, 0));
    const g1 = grow(1), g2 = grow(2), g3 = grow(3);
    if (g1 > 0) s.branches.forEach(([an], i) => {
      svg.append(svgEl("rect", { x: xs[i], y: rows[1], width: ws[i] * g1, height: h, fill: "var(--paper-2)", stroke: COLORS[i % 4], "stroke-width": asking === 0 && i === 0 ? 3 : 1.4, rx: 3 }));
      if (g1 >= 1) label(xs[i] + ws[i] / 2, rows[1] + 21, `${big(nA[i])} ${an}`);
    });
    if (g2 > 0) s.branches.forEach((_, i) => {
      const bw = Math.max(10, (ws[i] * nAB[i]) / nA[i]);
      svg.append(svgEl("rect", { x: xs[i], y: rows[2], width: ws[i] * g2, height: h, fill: "var(--paper-2)", stroke: "var(--rule-strong)", rx: 3 }));
      svg.append(svgEl("rect", { x: xs[i], y: rows[2], width: bw * g2, height: h, fill: COLORS[i % 4], opacity: 0.75, rx: 3, "stroke-width": asking === 1 && i === 0 ? 3 : 0, stroke: "var(--ink)" }));
      if (g2 >= 1) { label(xs[i] + bw + 4, rows[2] + 14, `${big(nAB[i])} ${s.B}`, "var(--ink)", "start", 10.5); label(xs[i] + bw + 4, rows[2] + 28, `${big(nA[i] - nAB[i])} ${s.notB}`, "var(--ink-dim)", "start", 10); }
    });
    label(L, rows[1] - 6, `split by ${s.branches.map((b) => b[0]).join(" / ")}: P(Aᵢ) × ${big(POP)}`, "var(--ink-dim)", "start", 10);
    if (g2 > 0) label(L, rows[2] - 6, `then by ${s.B}: × P(${s.B} | Aᵢ)`, "var(--ink-dim)", "start", 10);
    if (g3 > 0) {
      // Restrict: only the B pieces survive, stretched to the full width.
      label(L, rows[3] - 8, `restrict the sample space to the ${big(nB)} ${s.B}`, "var(--hl)", "start", 10.5);
      let x = L;
      s.branches.forEach(([an], i) => {
        const bw = Math.max(10, (ws[i] * nAB[i]) / nA[i]), tw = (W * nAB[i]) / nB;
        const fromX = xs[i] + (1 - g3) * 0, w = bw + g3 * (tw - bw), xx = xs[i] + g3 * (x - xs[i]);
        svg.append(svgEl("path", { d: `M${fromX},${rows[2] + h} L${fromX + bw},${rows[2] + h} L${xx + w},${rows[3]} L${xx},${rows[3]} Z`, fill: COLORS[i % 4], opacity: 0.15 }));
        svg.append(svgEl("rect", { x: xx, y: rows[3], width: w, height: h, fill: COLORS[i % 4], opacity: 0.8, rx: 3, stroke: "var(--ink)", "stroke-width": asking === 2 && i === 0 ? 3 : 0 }));
        if (g3 >= 1 && tw > 50) label(xx + w / 2, rows[3] + 21, `${big(nAB[i])} ${an} (${fmtNum(nAB[i] / nB, 4)})`, "var(--paper)", "middle", 11);
        x += tw;
      });
    }
    const A1 = s.branches[0][0], k = Math.floor(pos + 1e-9);
    if (pos < 1e-9) return `Start with ${big(POP)} ${pop}: probabilities become whole-number counts.`;
    if (k === 0 || (k === 1 && pos > 1)) return k === 0 ? `Split the ${big(POP)} by the priors…` : `Split each group by ${s.B}…`;
    if (k === 1) return `Split by the priors: ${s.branches.map(([an, p], i) => `${big(nA[i])} ${an} (${fmtNum(p, 3)} × ${big(POP)})`).join(", ")}.`;
    if (k === 2 && pos > 2) return `Keep only the ${s.B} pieces…`;
    if (k === 2) return `Split each group by P(${s.B} | Aᵢ): ${s.branches.map(([an], i) => `${big(nAB[i])} of the ${big(nA[i])} ${an}`).join(", ")} are ${s.B}; ${big(nB)} in all, so P(${s.B}) = ${big(nB)}/${big(POP)} = ${fmtNum(nB / POP, 4)}.`;
    return `Restrict the sample space to the ${big(nB)} ${s.B}: ${big(nAB[0])} of them are ${A1}, so P(${A1} | ${s.B}) = ${big(nAB[0])}/${big(nB)} = ${fmtNum(nAB[0] / nB, 4)}.`;
  }
  function ask(k) {
    const { s, nA, nAB, nB } = counts(), A1 = s.branches[0][0], pop = BAYES_POP[name] || "outcomes";
    if (k === 0) return { q: `How many of the ${big(POP)} ${pop} are ${A1}?`, ...numOptions(nA[0], [Math.round(nA[0] / 10), POP - nA[0], nAB[0]], big), rule: `Multiply the prior by the population: P(${A1}) × ${big(POP)} = ${fmtNum(s.branches[0][1], 3)} × ${big(POP)} = ${big(nA[0])}.` };
    if (k === 1) return { q: `How many of the ${big(nA[0])} ${A1} are ${s.B}?`, ...numOptions(nAB[0], [Math.round(POP * s.cond[0]), nA[0] - nAB[0], nAB[0] * 10], big), rule: `Multiply along the path: ${big(nA[0])} × P(${s.B} | ${A1}) = ${big(nA[0])} × ${fmtNum(s.cond[0], 3)} = ${big(nAB[0])}.` };
    if (k === 2) return { q: `Restrict to the ${big(nB)} ${s.B}. How many of them are ${A1}?`, ...numOptions(nAB[0], [nB - nAB[0], nA[0], Math.round(nB * s.branches[0][1])], big), rule: `Restricting to ${s.B} keeps only the ${s.B} pieces; the ${A1} piece is still ${big(nAB[0])}, so P(${A1} | ${s.B}) = ${big(nAB[0])}/${big(nB)}.` };
    return null;
  }
  const rig = playRig({ count: 3, unit: "level", stepMs: () => cfg.stepMs || 1800, predict: cfg.predict, label: "Predict each count before the tree splits", ask, draw });
  box.append(rig.check, svg, rig.caption, rig.ask, rig.bar);
}

// ---------- widget: perm-fill-play ----------
// Fill r positions from a shrinking set, then collapse the r! orderings of one hand.
const PF_CARDS = ["A♠", "7♥", "K♦", "2♣", "9♠", "Q♥", "5♦", "J♣"];
function permutations(a) { if (a.length <= 1) return [a]; const out = []; a.forEach((x, i) => { for (const p of permutations([...a.slice(0, i), ...a.slice(i + 1)])) out.push([x, ...p]); }); return out; }
function permFillPlay(box, cfg) {
  box.append(el("h4", null, cfg.title || "Fill the positions, then forget the order"));
  let n = Math.max(1, Math.min(100, Math.round(cfg.n ?? 52))), r = Math.max(1, Math.min(8, Math.round(cfg.r ?? 4)));
  const fn = numField("n (items)", n, (v) => { if (v >= 1 && v <= 100) { n = Math.round(v); if (r > n) r = n; rig.restart(r + 1); } }, 1);
  const fr = numField("r (positions, at most 8)", r, (v) => { if (v >= 1 && v <= 8 && v <= n) { r = Math.round(v); rig.restart(r + 1); } }, 1);
  const svg = svgEl("svg", { viewBox: "0 0 640 210", class: "curve-svg net-svg" }), work = el("div", "stat-steps");
  const item = (i) => (n === 52 ? PF_CARDS[i] : `item ${i + 1}`), noun = () => (n === 52 ? "cards" : "items");
  function draw(pos, asking) {
    const k = Math.min(r + 1, Math.floor(pos + 1e-9)), f = pos - k, filled = Math.min(r, k);
    svg.innerHTML = "";
    const bw = Math.min(110, 560 / r), gap = 10, x0 = 320 - (r * bw + (r - 1) * gap) / 2;
    const text = (x, y, t, size, fill = "var(--ink)", weight = "400") => svg.append(svgEl("text", { x, y, "text-anchor": "middle", "font-size": size, fill, "font-weight": weight }, t));
    text(320, 20, `${n - filled} ${noun()} left in the pool`, 12, "var(--ink-dim)");
    const collapse = k > r ? 1 : k === r && f > 0 ? f : 0;
    for (let i = 0; i < r; i++) {
      const x = x0 + i * (bw + gap), on = i < filled || (i === filled && f > 0 && k < r), hot = i === (f > 0 ? k : k - 1) || i === asking;
      svg.append(svgEl("rect", { x, y: 40, width: bw, height: 86, rx: 6, fill: on ? "var(--paper-2)" : "var(--paper)", stroke: hot && k <= r ? "var(--hl)" : "var(--rule-strong)", "stroke-width": hot && k <= r ? 2.4 : 1.2, "stroke-dasharray": on ? "" : "4 4", opacity: 1 - 0.5 * collapse }));
      text(x + bw / 2, 58, `position ${i + 1}`, 10, "var(--ink-dim)");
      if (on) { text(x + bw / 2, 92, String(n - i), 26, "var(--blue)", "700"); text(x + bw / 2, 114, `choices · ${item(i)}`, 10.5, "var(--ink-2)"); }
      if (i < r - 1) text(x + bw + gap / 2, 92, "×", 16, "var(--ink-dim)");
    }
    const P = permB(n, filled), chain = Array.from({ length: filled }, (_, i) => n - i).join(" × ");
    if (filled) text(320, 152, `${chain} = ${big(P)} ${filled === r ? `= P(${n}, ${r})` : "so far"}`, 14, "var(--ink)", "600");
    if (collapse > 0) {
      const all = permutations(Array.from({ length: Math.min(r, 4) }, (_, i) => item(i))), rf = factB(r), C = combB(n, r);
      const shown = all.slice(0, 4).map((p) => p.join(" ")).join("   ·   ") + (r > 1 ? "   · …" : "");
      svg.append(svgEl("text", { x: 320, y: 176, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)", opacity: collapse }, `${shown} (${big(rf)} orderings, one hand)`));
      svg.append(svgEl("text", { x: 320, y: 200, "text-anchor": "middle", "font-size": 14, fill: "var(--hl)", "font-weight": "700", opacity: collapse }, `÷ ${r}! = ${big(permB(n, r))} / ${big(rf)} = ${big(C)} = C(${n}, ${r})`));
    }
    work.innerHTML = `<div class="step">P(${n}, ${r}) = ${n}! / (${n} − ${r})! counts sequences; C(${n}, ${r}) = P(${n}, ${r}) / ${r}! counts hands.</div>`;
    if (k === 0 && f === 0) return `${r} empty positions and ${n} ${noun()}. Order matters while the positions are being filled.`;
    if (f > 0 && k < r) return `Position ${k + 1}: one of the ${n - k} ${noun()} still in the pool…`;
    if (f > 0) return `The same ${r} ${noun()} in a different order is the same hand…`;
    if (k <= r) return `Position ${k}: ${n - k + 1} ${noun()} left to choose from, ${chain} = ${big(P)} sequence${P === 1n ? "" : "s"} so far.`;
    return `Each hand of ${r} was counted ${r}! = ${big(factB(r))} times, once per ordering, so divide: ${big(permB(n, r))} / ${big(factB(r))} = ${big(combB(n, r))} hands. That ÷ ${r}! is the step from P(${n}, ${r}) to C(${n}, ${r}).`;
  }
  function ask(k) {
    if (k < r) return { q: `How many choices are there for position ${k + 1}?`, ...numOptions(n - k, [n - k - 1, n - k + 1, n].filter((v) => v >= 1)), rule: `Each filled position uses up one ${n === 52 ? "card" : "item"}: position ${k + 1} has ${n} − ${k} = ${n - k} choices.` };
    if (k === r) return { q: `How many orderings does one hand of ${r} ${noun()} have?`, ...numOptions(Number(factB(r)), [r, r ** r, r * (r - 1)].filter((v) => v >= 1), (v) => big(BigInt(v))), rule: `${r} items can be arranged in ${r}! = ${Array.from({ length: r }, (_, i) => r - i).join(" × ")} = ${big(factB(r))} ways.` };
    return null;
  }
  const rig = playRig({ count: r + 1, unit: "position", stepMs: () => cfg.stepMs || 1300, predict: cfg.predict, label: "Predict each count before it is filled in", ask, draw });
  box.append(fn.row, fr.row, rig.check, svg, rig.caption, rig.ask, rig.bar, work);
}

export const WIDGETS = {
  "sample-space": sampleSpace,
  "lln-sim": llnSim,
  "counting-calc": countingCalc,
  "prob-rules": probRules,
  "birthday": birthday,
  "two-way": twoWay,
  "bayes-tree": bayesTree,
  "sim-lab": simLab,
  "birthday-play": birthdayPlay,
  "bayes-flow-play": bayesFlowPlay,
  "perm-fill-play": permFillPlay,
};
