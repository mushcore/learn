// Interactive data-communications widgets for COMP 3721 Week 4 (Lecture 04): data and signal
// elements, signal rate and bandwidth, baseline wandering and DC components, clock drift, and the
// line coding schemes (unipolar NRZ, polar NRZ-L and NRZ-I, Manchester, differential Manchester, AMI).
import { el, slider, btnRow, fmtNum } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function cell(label, value, note) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label), el("div", "stat-value", value));
  if (note) c.append(el("div", "stat-note", note));
  return c;
}
function grid(out, rows) {
  out.innerHTML = "";
  for (const [l, v, n] of rows) out.append(cell(l, v, n));
}
function polyline(points, color, width = 2, opacity = 1) {
  return svgEl("polyline", { points: points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "), fill: "none", stroke: color, "stroke-width": width, opacity, "stroke-linejoin": "round" });
}
const FREQ_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9]];
const RATE_UNITS = [["bps", 1], ["kbps", 1e3], ["Mbps", 1e6], ["Gbps", 1e9]];
const BAUD_UNITS = [["baud", 1], ["kbaud", 1e3], ["Mbaud", 1e6], ["Gbaud", 1e9]];
function bestUnit(value, units) {
  const v = Math.abs(value);
  if (!(v > 0) || !Number.isFinite(v)) return units[0];
  let best = units[0];
  for (const u of units) if (v / u[1] >= 1) best = u;
  return best;
}
/** Display form of a number: up to d decimals, thin-space digit groups from 10 000 up, a real minus sign. */
function num(v, d = 4) {
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  const [int, frac] = String(Number(Math.abs(r).toFixed(d))).split(".");
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : int;
  return (r < 0 ? "−" : "") + grouped + (frac ? "." + frac : "");
}
function withUnit(value, units, d = 4) {
  if (!Number.isFinite(value)) return num(value);
  const u = bestUnit(value, units);
  return `${num(value / u[1], d)} ${u[0]}`;
}
/** A labelled number with a unit selector. get() is in base units (NaN when empty). */
function unitField(label, units, value, unit) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = "any"; input.value = value ?? "";
  input.setAttribute("aria-label", label);
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", `${label} unit`);
  for (const [u] of units) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === unit) o.selected = true; sel.append(o); }
  row.append(el("label", null, label), input, sel);
  const factor = () => units.find(([u]) => u === sel.value)[1];
  return {
    row,
    get: () => parseFloat(input.value) * factor(),
    setRaw: (v, u) => { input.value = v ?? ""; if (u) sel.value = u; },
    on: (fn) => { input.addEventListener("input", fn); sel.addEventListener("change", fn); },
  };
}
/** A labelled text box. kind "frac" reads 2, 0.5, 1/2 or 4/3; kind "number" is a plain number. */
function valueField(label, value, kind = "number", suffix) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  if (kind === "number") { input.type = "number"; input.step = "any"; } else { input.type = "text"; input.spellcheck = false; }
  input.value = value ?? "";
  input.setAttribute("aria-label", label);
  row.append(el("label", null, label), input);
  if (suffix) row.append(el("span", "stat-label", suffix));
  const frac = (s) => {
    const m = String(s).trim().match(/^(\d*\.?\d+)\s*(?:\/\s*(\d*\.?\d+))?$/);
    return !m ? NaN : m[2] ? parseFloat(m[1]) / parseFloat(m[2]) : parseFloat(m[1]);
  };
  return {
    row, input,
    get: () => (kind === "frac" ? frac(input.value) : parseFloat(input.value)),
    raw: () => input.value.trim(),
    set: (v) => { input.value = v ?? ""; },
    on: (fn) => input.addEventListener("input", fn),
  };
}
const sub = (s) => `<sub>${s}</sub>`;
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// ---------- line coding core ----------
// Conventions are the Lecture 04 slides' (54, 55, 57, 61). `slide` is the bit pattern of the slide figure.
const LC = {
  "unipolar": { name: "Unipolar NRZ", levels: [1, 0], per: 1, slide: "10110",
    rule: "Positive voltage defines bit 1 and the zero voltage defines bit 0." },
  "nrz-l": { name: "Polar NRZ-L", levels: [1, -1], per: 1, slide: "01001110",
    rule: "Positive voltage level for 0 and negative voltage level for 1." },
  "nrz-i": { name: "Polar NRZ-I", levels: [1, -1], per: 1, slide: "01001110", invertOn: "1", start: "The level before the first bit is positive.",
    rule: "No change for 0 and change for 1." },
  "manchester": { name: "Manchester", levels: [1, -1], per: 2, slide: "010011",
    rule: "0 is high-to-low and 1 is low-to-high: the transition is at the middle of the bit." },
  "diff-manchester": { name: "Differential Manchester", levels: [1, -1], per: 2, slide: "010011", invertOn: "0", start: "The level before the first bit is positive.",
    rule: "Always a transition at the middle of the bit. At the start of the bit: inversion if the bit is 0, no inversion if the bit is 1." },
  "ami": { name: "Bipolar AMI", levels: [1, 0, -1], per: 1, slide: "010010", start: "The first 1 is positive.",
    rule: "0 is a neutral zero voltage; 1 alternates between positive and negative voltages." },
};
/** Levels (+1, 0, −1) of the signal, two entries per bit (first half, second half). */
function lcEncode(scheme, bits) {
  const out = [];
  let level = 1, mark = -1;
  for (const ch of bits) {
    const one = ch === "1";
    if (scheme === "unipolar") out.push(one ? 1 : 0, one ? 1 : 0);
    else if (scheme === "nrz-l") out.push(one ? -1 : 1, one ? -1 : 1);
    else if (scheme === "nrz-i") { if (one) level = -level; out.push(level, level); }
    else if (scheme === "manchester") out.push(one ? -1 : 1, one ? 1 : -1);
    else if (scheme === "diff-manchester") { const first = one ? level : -level; out.push(first, -first); level = -first; }
    else { if (one) mark = -mark; out.push(one ? mark : 0, one ? mark : 0); }
  }
  return out;
}
function lcStats(scheme, bits) {
  const half = lcEncode(scheme, bits);
  let transitions = 0, last = 0, longest = 0;
  for (let i = 1; i < half.length; i++) if (half[i] !== half[i - 1]) { transitions++; longest = Math.max(longest, i - last); last = i; }
  longest = Math.max(longest, half.length - last);
  return { half, elements: bits.length * LC[scheme].per, transitions, longest: longest / 2, mean: half.reduce((s, v) => s + v, 0) / half.length };
}
const levelName = (v) => (v > 0 ? "+V" : v < 0 ? "−V" : "0");
/** Bit labels and dashed bit boundaries over the rows between yTop and yBottom. */
function lcFrame(svg, bits, x0, x1, yTop, yBottom) {
  const bw = (x1 - x0) / bits.length;
  for (let i = 0; i <= bits.length; i++) {
    svg.append(svgEl("line", { x1: x0 + i * bw, y1: yTop, x2: x0 + i * bw, y2: yBottom, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
    if (i < bits.length) svg.append(svgEl("text", { x: x0 + (i + 0.5) * bw, y: yTop - 5, "text-anchor": "middle", "font-size": 13, fill: "var(--hl)", "font-weight": "600" }, bits[i]));
  }
}
/** One waveform row. The dots are the slide's inversion markers for the differential schemes. */
function lcRow(svg, scheme, bits, half, x0, x1, yc, amp, color = "var(--blue)") {
  const bw = (x1 - x0) / bits.length, y = (v) => yc - v * amp;
  svg.append(svgEl("line", { x1: x0, y1: yc, x2: x1, y2: yc, stroke: "var(--rule-strong)" }));
  const pts = [];
  half.forEach((v, i) => pts.push([x0 + (i * bw) / 2, y(v)], [x0 + ((i + 1) * bw) / 2, y(v)]));
  svg.append(polyline(pts, color, 2.6));
  const inv = LC[scheme].invertOn;
  if (inv) for (let i = 1; i < bits.length; i++) {
    svg.append(svgEl("circle", { cx: x0 + i * bw, cy: y(half[2 * i - 1]), r: 3.6, fill: bits[i] === inv ? "var(--ink)" : "var(--paper-2)", stroke: "var(--ink)", "stroke-width": 1.4 }));
  }
}
function lcLevelLabels(svg, scheme, x, yc, amp) {
  for (const v of LC[scheme].levels) svg.append(svgEl("text", { x, y: yc - v * amp + 4, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, levelName(v)));
}
function bitsInput(value, max) {
  const input = document.createElement("input");
  input.type = "text"; input.value = value; input.maxLength = max; input.inputMode = "numeric"; input.spellcheck = false;
  input.setAttribute("aria-label", "bits to encode");
  input.style.width = `${Math.max(130, max * 9 + 24)}px`;
  input.style.maxWidth = "100%";
  return input;
}

// ---------- widget: line-code ----------
function lineCode(box, cfg) {
  const all = Object.keys(LC);
  const schemes = (Array.isArray(cfg.schemes) ? cfg.schemes : all).filter((s) => LC[s]);
  if (!schemes.length) schemes.push(...all);
  const drawMode = !!cfg.draw, compare = !!cfg.compare && !drawMode;
  let scheme = schemes.includes(cfg.scheme) ? cfg.scheme : schemes[0];
  const valid = (s) => /^[01]{2,16}$/.test(s);
  let bits = valid(cfg.bits || "") ? cfg.bits : LC[scheme].slide;
  let guess = [], checked = false, revealed = false;

  box.append(el("h4", null, cfg.title || (compare ? "The same bits in each line coding scheme" : drawMode ? "Draw the signal for these bits" : "Bits to a digital signal")));
  if (!compare && schemes.length > 1) box.append(btnRow(schemes.map((s) => LC[s].name), (i) => { scheme = schemes[i]; restart(); }, schemes.indexOf(scheme)));
  const row = el("div", "unit-row");
  const input = bitsInput(bits, 16);
  row.append(el("label", null, "bits"), input);
  const patterns = [["alternating", () => "01010101"], ["long run of 0s", () => "10000001"], ["long run of 1s", () => "01111110"]];
  if (!compare) patterns.unshift(["slide figure", () => LC[scheme].slide]);
  for (const [label, get] of patterns) {
    const b = el("button", "viz-btn", label);
    b.addEventListener("click", () => { bits = get(); input.value = bits; restart(); });
    row.append(b);
  }
  const svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" });
  const ctl = el("div", "viz-btn-row");
  const check = el("button", "viz-btn", "Check"), reveal = el("button", "viz-btn", "Reveal"), clear = el("button", "viz-btn", "Clear");
  const verdict = el("span", "encap-pduname");
  ctl.append(check, reveal, clear, verdict);
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(row, svg);
  if (drawMode) box.append(ctl);
  box.append(out, note);

  const cellsOf = () => bits.length * LC[scheme].per;
  const answerOf = (half, k) => half[(k * 2) / LC[scheme].per];
  function restart() { guess = new Array(cellsOf()).fill(null); checked = false; revealed = false; verdict.textContent = ""; draw(); }
  function statRows(s) {
    const st = lcStats(s, bits), per = LC[s].per;
    return [
      ["Signal elements", String(st.elements), `${per} for each data element: r = ${per === 1 ? "1" : "1/2"}`],
      ["Transitions", String(st.transitions), `longest stretch without one: ${plural(st.longest, "bit")}`],
      ["Mean amplitude", `${num(st.mean, 3)} V`, Math.abs(st.mean) < 1e-9 ? "zero: no DC component" : "not zero: a DC component"],
    ];
  }
  function draw(focusCell) {
    svg.innerHTML = "";
    if (compare) {
      // Scheme names sit above their rows so the waveforms keep the full width on a phone.
      const X0 = 14, X1 = 626, ROW = 82, TOP = 30;
      svg.setAttribute("viewBox", `0 0 640 ${TOP + schemes.length * ROW + 4}`);
      lcFrame(svg, bits, X0, X1, TOP - 6, TOP + schemes.length * ROW - 6);
      schemes.forEach((s, i) => {
        const yc = TOP + i * ROW + 48;
        lcRow(svg, s, bits, lcEncode(s, bits), X0, X1, yc, 20);
        svg.append(svgEl("text", { x: X0 + 5, y: yc - 30, "font-size": 12.5, fill: "var(--ink)", stroke: "var(--paper-2)", "stroke-width": 5, "paint-order": "stroke" }, LC[s].name));
      });
      grid(out, schemes.map((s) => { const st = lcStats(s, bits); return [LC[s].name, `${st.elements} elements`, `${plural(st.transitions, "transition")}, mean ${num(st.mean, 2)} V`]; }));
      note.textContent = "Dots mark the differential schemes' decision at the start of a bit: filled for an inversion, open for no inversion. NRZ-I, differential Manchester and AMI start as the slide figures do: previous level positive, first 1 positive.";
      return;
    }
    const X0 = 46, X1 = 626, YC = 104, AMP = 54;
    svg.setAttribute("viewBox", `0 0 640 ${LC[scheme].invertOn && !drawMode ? 206 : 184}`);
    lcFrame(svg, bits, X0, X1, 26, YC + AMP + 16);
    lcLevelLabels(svg, scheme, X0 - 6, YC, AMP);
    const half = lcEncode(scheme, bits);
    if (!drawMode) {
      lcRow(svg, scheme, bits, half, X0, X1, YC, AMP);
      const inv = LC[scheme].invertOn;
      if (inv) svg.append(svgEl("text", { x: 336, y: 200, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `● inversion: next bit is ${inv}  ·  ○ no inversion: next bit is ${inv === "1" ? "0" : "1"}`));
      grid(out, statRows(scheme));
      note.textContent = [LC[scheme].rule, LC[scheme].start, LC[scheme].start ? "The slide figure starts the same way." : ""].filter(Boolean).join(" ");
      return;
    }
    // draw mode: the student sets the level of each signal element
    const cells = cellsOf(), cw = (X1 - X0) / cells, y = (v) => YC - v * AMP, levels = LC[scheme].levels;
    svg.append(svgEl("line", { x1: X0, y1: YC, x2: X1, y2: YC, stroke: "var(--rule-strong)" }));
    let bad = 0;
    for (let k = 0; k < cells; k++) {
      const v = guess[k], x = X0 + k * cw, wrong = checked && v !== answerOf(half, k);
      if (wrong) bad++;
      if (v == null) {
        svg.append(svgEl("line", { x1: x + 4, y1: YC, x2: x + cw - 4, y2: YC, stroke: wrong ? "var(--red)" : "var(--ink-dim)", "stroke-width": 2, "stroke-dasharray": "2 5" }));
        svg.append(svgEl("text", { x: x + cw / 2, y: YC - 8, "text-anchor": "middle", "font-size": 12, fill: wrong ? "var(--red)" : "var(--ink-dim)" }, "?"));
      } else {
        svg.append(svgEl("line", { x1: x, y1: y(v), x2: x + cw, y2: y(v), stroke: wrong ? "var(--red)" : "var(--blue)", "stroke-width": 3, "stroke-linecap": "round" }));
        const prev = k > 0 ? guess[k - 1] : null;
        if (prev != null && prev !== v) svg.append(svgEl("line", { x1: x, y1: y(prev), x2: x, y2: y(v), stroke: "var(--blue)", "stroke-width": 2.6 }));
      }
      const hit = svgEl("rect", { x, y: YC - AMP - 12, width: cw, height: 2 * AMP + 24, fill: "transparent", tabindex: 0, role: "button", style: "cursor:pointer", "aria-label": `signal element ${k + 1}: ${v == null ? "not set" : levelName(v)}` });
      const cycle = () => { guess[k] = levels[(levels.indexOf(v) + 1) % levels.length]; checked = false; revealed = false; verdict.textContent = ""; draw(k); };
      hit.addEventListener("click", cycle);
      hit.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycle(); } });
      svg.append(hit);
      if (k === focusCell) queueMicrotask(() => hit.focus());
    }
    const solved = checked && bad === 0;
    if (checked) verdict.textContent = solved ? (revealed ? "The signal for these bits." : "Correct: every signal element matches.") : `${bad} of ${cells} signal elements are wrong or not set (red).`;
    grid(out, solved ? statRows(scheme) : [
      ["Scheme", LC[scheme].name, `levels: ${levels.map(levelName).join(", ")}`],
      ["Signal elements to set", String(cells), `${LC[scheme].per} for each bit`],
    ]);
    note.textContent = [solved ? LC[scheme].rule : "Click a signal element to step it through the scheme's levels.", LC[scheme].start].filter(Boolean).join(" ");
  }
  input.addEventListener("input", () => {
    const v = input.value.replace(/[^01]/g, "");
    if (valid(v)) { bits = v; restart(); } else note.textContent = "Type 2 to 16 bits, 0s and 1s only.";
  });
  check.addEventListener("click", () => { checked = true; draw(); });
  reveal.addEventListener("click", () => { const half = lcEncode(scheme, bits); guess = guess.map((_, k) => answerOf(half, k)); checked = true; revealed = true; draw(); });
  clear.addEventListener("click", restart);
  restart();
}

// ---------- widget: line-code-play ----------
// The line-code waveform drawn one bit at a time, each bit captioned with the rule that set it.
/** Why bit i has the levels it has, in the slide's words. `half` is lcEncode's output. */
function lcReason(scheme, bits, half, i) {
  const one = bits[i] === "1", a = half[2 * i], b = half[2 * i + 1], before = i > 0 ? half[2 * i - 1] : 1;
  if (scheme === "unipolar") return one ? "positive voltage defines bit 1" : "the zero voltage defines bit 0";
  if (scheme === "nrz-l") return one ? "negative voltage level for 1" : "positive voltage level for 0";
  if (scheme === "nrz-i") return one ? `change for 1, so the level inverts from ${levelName(before)} to ${levelName(a)}` : `no change for 0, so the level stays at ${levelName(a)}`;
  if (scheme === "manchester") return `${one ? "low-to-high" : "high-to-low"}, with the transition at the middle of the bit`;
  if (scheme === "diff-manchester") {
    const start = one ? `no inversion at the start of a 1, so the bit starts at ${levelName(a)}, where the signal already was` : `inversion at the start of a 0, so the signal goes from ${levelName(before)} to ${levelName(a)}`;
    return `${start}; the transition at the middle then takes it to ${levelName(b)}`;
  }
  if (!one) return "a neutral zero voltage";
  const prior = bits.slice(0, i).lastIndexOf("1");
  return prior < 0 ? "the first 1 is positive" : `the 1s alternate: the 1 before it (bit ${prior + 1}) was ${a > 0 ? "negative" : "positive"}, so this one is ${a > 0 ? "positive" : "negative"}`;
}
function lineCodePlay(box, cfg) {
  const all = Object.keys(LC);
  const schemes = (Array.isArray(cfg.schemes) ? cfg.schemes : all).filter((s) => LC[s]);
  if (!schemes.length) schemes.push(...all);
  let scheme = schemes.includes(cfg.scheme) ? cfg.scheme : schemes[0];
  const valid = (s) => /^[01]{2,16}$/.test(s);
  let bits = valid(cfg.bits || "") ? cfg.bits : LC[scheme].slide;
  // Predict mode: `answered` bits may be drawn; the next one waits for the student's level.
  let predict = !!cfg.predict, half = [], answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false;
  let pb = null;

  box.append(el("h4", null, cfg.title || "Watch the signal being drawn, one bit at a time"));
  if (schemes.length > 1) box.append(btnRow(schemes.map((s) => LC[s].name), (i) => { scheme = schemes[i]; restart(); }, schemes.indexOf(scheme)));
  const row = el("div", "unit-row");
  const input = bitsInput(bits, 16);
  row.append(el("label", null, "bits"), input);
  for (const [label, get] of [["slide figure", () => LC[scheme].slide], ["alternating", () => "01010101"], ["long run of 0s", () => "10000001"], ["long run of 1s", () => "01111110"]]) {
    const b = el("button", "viz-btn", label);
    b.addEventListener("click", () => { bits = get(); input.value = bits; restart(); });
    row.append(b);
  }
  const predictLabel = el("label", "playback-check");
  const predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = predict;
  predictLabel.append(predictBox, " Predict each bit before it is drawn");
  const svg = svgEl("svg", { viewBox: "0 0 640 180", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  box.append(row, predictLabel, svg, caption, ask);

  const n = () => bits.length;
  const asking = (pos) => predict && answered < n() && Math.abs(pos - answered) < 1e-6;
  function answer(v, e) {
    asked += wrong == null && !missed ? 1 : 0;
    if (v !== half[2 * answered]) { missed = true; wrong = v; refocus = e.detail === 0; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; refocus = e.detail === 0; answered++;
    pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${scheme}|${answered}|${wrong}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!key) return;
    const btns = LC[scheme].levels.map((v) => {
      const b = el("button", "viz-btn" + (v === wrong ? " playback-wrong" : ""), levelName(v));
      b.type = "button";
      b.addEventListener("click", (e) => answer(v, e));
      ask.append(b);
      return b;
    });
    if (wrong != null) ask.append(el("span", "playback-feedback", `Not ${levelName(wrong)}. ${LC[scheme].rule}`));
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function frame(pos) {
    const N = n(), inv = LC[scheme].invertOn, X0 = 64, X1 = 626, YC = 100, AMP = 50;
    const bw = (X1 - X0) / N, x = (p) => X0 + p * bw, y = (v) => YC - v * AMP;
    const q = asking(pos), drawn = Math.ceil(pos - 1e-9) - 1, hot = q ? answered : drawn;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${inv ? 202 : 180}`);
    if (hot >= 0 && hot < N) svg.append(svgEl("rect", { x: x(hot), y: 10, width: bw, height: YC + AMP + 6, fill: "var(--hl-soft)" }));
    lcFrame(svg, bits, X0, X1, 26, YC + AMP + 16);
    lcLevelLabels(svg, scheme, X0 - 24, YC, AMP);
    svg.append(svgEl("line", { x1: X0, y1: YC, x2: X1, y2: YC, stroke: "var(--rule-strong)" }));
    // The level before the first bit, for the schemes whose first bit depends on it.
    if (inv) svg.append(svgEl("line", { x1: X0 - 18, y1: y(1), x2: X0, y2: y(1), stroke: "var(--ink-dim)", "stroke-width": 2.2, "stroke-dasharray": "3 3" }));
    if (pos > 0) {
      const pts = inv ? [[X0, y(1)]] : [];
      for (let h = 0; h < 2 * N && pos > h / 2; h++) pts.push([x(h / 2), y(half[h])], [x(Math.min((h + 1) / 2, pos)), y(half[h])]);
      svg.append(polyline(pts, "var(--blue)", 2.6));
    }
    if (inv) {
      for (let i = 0; i < N && pos > i; i++) {
        svg.append(svgEl("circle", { cx: x(i), cy: y(i > 0 ? half[2 * i - 1] : 1), r: 3.6, fill: bits[i] === inv ? "var(--ink)" : "var(--paper-2)", stroke: "var(--ink)", "stroke-width": 1.4 }));
      }
      svg.append(svgEl("text", { x: 345, y: 196, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `● inversion: next bit is ${inv}  ·  ○ no inversion: next bit is ${inv === "1" ? "0" : "1"}`));
    }
    if (pos > 0 && pos < N) svg.append(svgEl("circle", { cx: x(pos), cy: y(half[Math.ceil(pos * 2 - 1e-9) - 1]), r: 5, fill: "var(--hl)" }));
    let text;
    if (q) text = `Bit ${answered + 1} is ${bits[answered]}. Which level does the signal take ${LC[scheme].per === 2 ? "in the first half of this bit" : "for this bit"}?`;
    else if (drawn < 0) text = ["Press Play to draw the signal one bit at a time.", LC[scheme].start].filter(Boolean).join(" ");
    else {
      text = `Bit ${drawn + 1} is ${bits[drawn]}: ${lcReason(scheme, bits, half, drawn)}.`;
      if (pos >= N && asked > 0) text += ` All ${N} bits are drawn: ${firstTry} of ${asked} right on the first try.`;
    }
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(pos);
  }
  function restart() {
    half = lcEncode(scheme, bits);
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    note.textContent = [LC[scheme].rule, LC[scheme].start].filter(Boolean).join(" ");
    pb.reset(n());
  }
  half = lcEncode(scheme, bits);
  pb = createPlayback({
    count: n(), unit: "bit", onFrame: frame,
    stepMs: () => cfg.stepMs || (LC[scheme].per === 2 ? 1500 : 1100),
    limit: () => (predict ? answered : n()),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, note);
  input.addEventListener("input", () => {
    const v = input.value.replace(/[^01]/g, "");
    if (valid(v)) { bits = v; restart(); } else note.textContent = "Type 2 to 16 bits, 0s and 1s only.";
  });
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    // Bits already on screen count as answered; the questions start at the next one.
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  restart();
}

// ---------- widget: signal-elements ----------
// The four slide figures (12 to 19). Each group is one block of data elements and its signal elements.
const SE_CASES = {
  a: { caption: "One data element per one signal element", data: 1, signal: 1, r: "1", groups: [["1", [-1]], ["0", [1]], ["1", [-1]]],
    car: "Each person is driving a vehicle." },
  b: { caption: "One data element per two signal elements", data: 1, signal: 2, r: "1/2", groups: [["1", [-1, 1]], ["0", [-1, 1]], ["1", [-1, 1]]],
    car: "One person is driving a car and a trailer." },
  c: { caption: "Two data elements per one signal element", data: 2, signal: 1, r: "2", groups: [["11", [1]], ["01", [-1]], ["11", [1]]],
    car: "More than one person is travelling in a vehicle (a carpool, for example)." },
  d: { caption: "Four data elements per three signal elements", data: 4, signal: 3, r: "4/3", groups: [["1101", [1, -0.8, 0.14]]],
    car: "r > 1, so again more than one person is travelling in a vehicle." },
};
function signalElements(box, cfg) {
  const keys = Object.keys(SE_CASES);
  let key = SE_CASES[cfg.case] ? cfg.case : "a";
  let N = 12;
  box.append(el("h4", null, cfg.title || "Data elements carried by each signal element"));
  box.append(btnRow(keys.map((k) => `${k}. r = ${SE_CASES[k].r}`), (i) => { key = keys[i]; draw(); }, keys.indexOf(key)));
  const sN = slider("Data rate N", 1, 48, 1, N, (v) => { N = v; draw(); }, (v) => `${v} kbps`);
  const svg = svgEl("svg", { viewBox: "0 0 640 190", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(svg, sN.row, out, note);
  function draw() {
    const c = SE_CASES[key];
    svg.innerHTML = "";
    const total = c.groups.reduce((s, g) => s + g[1].length, 0);
    const span = Math.min(520, total * 90), X0 = 320 - span / 2, w = span / total, YC = 112, AMP = 46;
    svg.append(svgEl("line", { x1: X0 - 30, y1: YC, x2: X0 + span + 30, y2: YC, stroke: "var(--rule-strong)" }));
    const mid = Math.floor(c.groups.length / 2);
    let k = 0, prevY = null;
    c.groups.forEach(([label, elems], gi) => {
      const gx = X0 + k * w, gw = elems.length * w, hot = gi === mid;
      svg.append(svgEl("line", { x1: gx, y1: 34, x2: gx, y2: 172, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
      svg.append(svgEl("text", { x: gx + gw / 2, y: 50, "text-anchor": "middle", "font-size": 15, fill: hot ? "var(--hl)" : "var(--ink-2)", "font-weight": hot ? "700" : "400" }, label));
      elems.forEach((v) => {
        const x = X0 + k * w, yy = YC - v * AMP;
        if (prevY != null && prevY !== yy) svg.append(svgEl("line", { x1: x, y1: prevY, x2: x, y2: yy, stroke: "var(--blue)", "stroke-width": 2.4 }));
        svg.append(svgEl("line", { x1: x, y1: yy, x2: x + w, y2: yy, stroke: hot ? "var(--hl)" : "var(--blue)", "stroke-width": hot ? 5 : 2.6 }));
        prevY = yy; k++;
      });
      if (hot) {
        svg.append(svgEl("text", { x: gx + gw / 2, y: 22, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, plural(c.data, "data element")));
        svg.append(svgEl("text", { x: gx + gw / 2, y: 186, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, plural(c.signal, "signal element")));
      }
    });
    svg.append(svgEl("line", { x1: X0 + span, y1: 34, x2: X0 + span, y2: 172, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
    const r = c.data / c.signal;
    grid(out, [
      ["Data elements", String(c.data), "bits in the highlighted block"],
      ["Signal elements", String(c.signal), "carrying that block"],
      ["Ratio r", c.r, `${c.data} / ${c.signal}: data elements carried by each signal element`],
      ["Signal rate S = N / r", `${num((N / r), 2)} kbaud`, `${N} kbps / ${c.r}`],
    ]);
    note.textContent = `Slide figure ${key}: ${c.caption.toLowerCase()} (r = ${c.r}). In the transportation analogy: ${c.car}`;
  }
  draw();
}

// ---------- widget: signal-rate ----------
const SR_DEFAULTS = {
  signal: {
    "Slide example: 100 kbps, r = 1": { N: 100, unit: "kbps", r: "1", c: "1/2" },
    "Two signal elements per bit, r = 1/2": { N: 100, unit: "kbps", r: "1/2", c: "1/2" },
    "Two bits per signal element, r = 2": { N: 100, unit: "kbps", r: "2", c: "1/2" },
    "r = 4/3": { N: 100, unit: "kbps", r: "4/3", c: "1/2" },
  },
  bandwidth: {
    "1 Mbps, r = 1": { N: 1, unit: "Mbps", r: "1", c: "1/2" },
    "1 Mbps, r = 1/2": { N: 1, unit: "Mbps", r: "1/2", c: "1/2" },
    "1 Mbps, r = 2": { N: 1, unit: "Mbps", r: "2", c: "1/2" },
  },
  nyquist: {
    "3 kHz, 2 levels": { B: 3, bUnit: "kHz", levels: 2, c: "1/2" },
    "3 kHz, 4 levels": { B: 3, bUnit: "kHz", levels: 4, c: "1/2" },
    "3 kHz, 8 levels": { B: 3, bUnit: "kHz", levels: 8, c: "1/2" },
  },
};
function signalRate(box, cfg) {
  const show = SR_DEFAULTS[cfg.show] ? cfg.show : "signal";
  box.append(el("h4", null, cfg.title || { signal: "Signal rate from the data rate, r and the case factor", bandwidth: "Bandwidth of a digital signal from its data rate", nyquist: "The data rate of a channel against the Nyquist formula" }[show]));
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : SR_DEFAULTS[show];
  const labels = Object.keys(presets);
  const Nf = unitField("data rate N", RATE_UNITS, 100, "kbps");
  const Rf = valueField("ratio r", "1", "frac", "data elements per signal element");
  const Cf = valueField("case factor c", "1/2", "frac", "1/2 is the average case of the slides");
  const Bf = unitField("bandwidth B", FREQ_UNITS, 3, "kHz");
  const Lf = valueField("signal levels L", 4, "number", "each level is one signal element");
  const svg = svgEl("svg", { viewBox: "0 0 640 80", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", {
    signal: "The data rate counts bits per second; the signal rate counts signal elements per second, in baud. A larger r carries more bits on each signal element, so the same data rate needs a lower signal rate.",
    bandwidth: "The baud rate, not the bit rate, determines the required bandwidth, so the slide replaces S with B in the same formula.",
    nyquist: "With L levels each signal element carries log₂ L bits, so r = log₂ L. In the average case, c = 1/2, the data rate of the channel is the Nyquist bit rate.",
  }[show]);
  box.append(btnRow(labels, (i) => apply(presets[labels[i]]), -1));
  if (show === "nyquist") box.append(Bf.row, Lf.row, Cf.row);
  else box.append(Nf.row, Rf.row, Cf.row);
  box.append(svg, steps, out, note);

  function apply(p) {
    Nf.setRaw(p.N ?? 100, p.unit || "kbps");
    Rf.set(p.r ?? "1"); Cf.set(p.c ?? "1/2");
    Bf.setRaw(p.B ?? 3, p.bUnit || "kHz");
    Lf.set(p.levels ?? 4);
    draw();
  }
  function bars(rows) {
    svg.innerHTML = "";
    svg.style.display = "";
    svg.setAttribute("viewBox", `0 0 640 ${rows.length * 34 + 10}`);
    const top = Math.max(...rows.map((r) => r[1]), 1e-12);
    rows.forEach(([label, value, text, color], i) => {
      const y = 8 + i * 34, w = Math.max(2, (300 * value) / top);
      svg.append(svgEl("text", { x: 196, y: y + 15, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, label));
      svg.append(svgEl("rect", { x: 204, y, width: w, height: 20, rx: 3, fill: color, opacity: 0.85 }));
      svg.append(svgEl("text", { x: 210 + w, y: y + 15, "font-size": 11, fill: "var(--ink)" }, text));
    });
  }
  const stop = (msg) => { svg.style.display = "none"; out.innerHTML = ""; steps.textContent = msg; };
  function draw() {
    const c = Cf.get();
    if (!(c > 0)) return stop("Enter a case factor greater than 0, for example 1/2.");
    if (show === "nyquist") {
      const B = Bf.get(), L = Lf.get();
      if (!(B > 0)) return stop("Enter a bandwidth greater than 0.");
      if (!(L >= 2)) return stop("Enter at least 2 signal levels.");
      const r = Math.log2(L), nmax = (1 / c) * B * r, ny = 2 * B * r, same = Math.abs(c - 0.5) < 1e-9;
      steps.innerHTML = [
        `r = log${sub(2)} L = log${sub(2)} ${num(L)} = ${num(r)}`,
        `N${sub("max")} = 1/c × B × r = 1/(${Cf.raw()}) × ${num(B)} × ${num(r)} = <b>${num(nmax, 0)} bps</b>`,
        `Nyquist: 2 × B × log${sub(2)} L = 2 × ${num(B)} × ${num(r)} = <b>${num(ny, 0)} bps</b>`,
      ].join("<br>");
      bars([["N max = 1/c × B × r", nmax, withUnit(nmax, RATE_UNITS, 3), "var(--blue)"], ["Nyquist bit rate", ny, withUnit(ny, RATE_UNITS, 3), "var(--hl)"]]);
      grid(out, [
        ["Ratio r", num(r), "bits carried by each signal element: log₂ L"],
        ["Maximum data rate", withUnit(nmax, RATE_UNITS, 3), "1/c × B × r"],
        ["Nyquist bit rate", withUnit(ny, RATE_UNITS, 3), "2 × B × log₂ L"],
        ["The two formulas", same ? "agree" : "differ", same ? "1/c = 2 in the average case" : "they agree only when c = 1/2"],
      ]);
      return;
    }
    const N = Nf.get(), r = Rf.get();
    if (!(N > 0)) return stop("Enter a data rate greater than 0.");
    if (!(r > 0)) return stop("Enter a ratio r greater than 0, for example 1, 1/2, 2 or 4/3.");
    const S = (c * N) / r;
    const work = `c × N × 1/r = ${Cf.raw()} × ${num(N)} × 1/(${Rf.raw()})`;
    const sUnit = bestUnit(S, BAUD_UNITS), bUnit = bestUnit(S, FREQ_UNITS);
    steps.innerHTML = show === "signal"
      ? `S = ${work} = ${num(S, 2)} baud${sUnit[1] > 1 ? ` = <b>${withUnit(S, BAUD_UNITS)}</b>` : ""}`
      : `B = ${work} = ${num(S, 2)} Hz${bUnit[1] > 1 ? ` = <b>${withUnit(S, FREQ_UNITS)}</b>` : ""}`;
    bars([["data rate N", N, withUnit(N, RATE_UNITS, 3), "var(--blue)"], show === "signal" ? ["signal rate S", S, withUnit(S, BAUD_UNITS, 3), "var(--hl)"] : ["bandwidth B", S, withUnit(S, FREQ_UNITS, 3), "var(--hl)"]]);
    const rows = [
      ["Data rate N", withUnit(N, RATE_UNITS), "data elements (bits) sent in 1 second"],
      ["Signal rate S", withUnit(S, BAUD_UNITS), "signal elements sent in 1 second"],
    ];
    if (show === "bandwidth") rows.push(["Bandwidth B", withUnit(S, FREQ_UNITS), "proportional to the signal rate"]);
    rows.push(["Signal elements per bit", num(1 / r, 3), "1 / r"]);
    grid(out, rows);
  }
  Nf.on(draw); Rf.on(draw); Cf.on(draw); Bf.on(draw); Lf.on(draw);
  apply(cfg.N != null || cfg.B != null || cfg.r != null || cfg.levels != null ? cfg : presets[labels[0]]);
}

// ---------- widget: baseline-dc ----------
const BD_PATTERNS = {
  "mixed": "010011010110010110100110",
  "long run of 0s": "010100000000000000000110",
  "long run of 1s": "101011111111111111111001",
  "alternating": "010101010101010101010101",
};
const BD_NOTES = {
  "unipolar": "All the signal levels are on one side of the time axis, so the mean amplitude is above zero for any data that contains a 1.",
  "nrz-l": "A long string of 0s or 1s holds one level: the running average drifts toward it and the mean amplitude moves away from zero.",
  "nrz-i": "A long string of 0s holds one level, so the running average drifts. A long string of 1s inverts the level at every bit, so it holds.",
  "manchester": "Each bit has a positive and a negative voltage contribution, so the running average stays on the axis for any data.",
  "diff-manchester": "Each bit has a positive and a negative voltage contribution, so the running average stays on the axis for any data.",
  "ami": "The 0s sit on the axis and the 1s alternate between positive and negative, so the running average stays near zero.",
};
function baselineDc(box, cfg) {
  const all = Object.keys(LC);
  const schemes = (Array.isArray(cfg.schemes) ? cfg.schemes : all).filter((s) => LC[s]);
  if (!schemes.length) schemes.push(...all);
  let scheme = schemes.includes(cfg.scheme) ? cfg.scheme : schemes[0];
  const valid = (s) => /^[01]{4,32}$/.test(s);
  let bits = valid(cfg.bits || "") ? cfg.bits : BD_PATTERNS["long run of 0s"];
  box.append(el("h4", null, cfg.title || "The receiver's running average under a long run of one bit"));
  if (schemes.length > 1) box.append(btnRow(schemes.map((s) => LC[s].name), (i) => { scheme = schemes[i]; draw(); }, schemes.indexOf(scheme)));
  const names = Object.keys(BD_PATTERNS);
  const input = bitsInput(bits, 32);
  box.append(btnRow(names, (i) => { bits = BD_PATTERNS[names[i]]; input.value = bits; draw(); }, names.findIndex((n) => BD_PATTERNS[n] === bits)));
  const row = el("div", "unit-row");
  row.append(el("label", null, "bits"), input);
  const svg = svgEl("svg", { viewBox: "0 0 640 226", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(row, svg, out, note);
  function draw() {
    svg.innerHTML = "";
    const X0 = 46, X1 = 626, YC = 108, AMP = 60, PER = 16, TAU = 6;
    const st = lcStats(scheme, bits), half = st.half, n = bits.length, bw = (X1 - X0) / n;
    const y = (v) => YC - v * AMP;
    for (let i = 0; i <= n; i++) svg.append(svgEl("line", { x1: X0 + i * bw, y1: 30, x2: X0 + i * bw, y2: YC + AMP + 14, stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
    for (let i = 0; i < n; i++) svg.append(svgEl("text", { x: X0 + (i + 0.5) * bw, y: 24, "text-anchor": "middle", "font-size": n > 24 ? 9 : 11, fill: "var(--hl)" }, bits[i]));
    svg.append(svgEl("line", { x1: X0, y1: YC, x2: X1, y2: YC, stroke: "var(--rule-strong)" }));
    lcLevelLabels(svg, scheme, X0 - 6, YC, AMP);
    const wave = [];
    half.forEach((v, i) => wave.push([X0 + (i * bw) / 2, y(v)], [X0 + ((i + 1) * bw) / 2, y(v)]));
    svg.append(polyline(wave, "var(--ink-dim)", 1.6, 0.9));
    // Running average with a time constant of TAU bit durations, starting midway between the scheme's levels.
    const levels = LC[scheme].levels, alpha = 1 - Math.exp(-1 / (TAU * PER));
    let avg = (Math.max(...levels) + Math.min(...levels)) / 2, lo = avg, hi = avg;
    const base = [[X0, y(avg)]];
    for (let i = 0; i < n * PER; i++) {
      avg += (half[Math.floor((i * 2) / PER)] - avg) * alpha;
      lo = Math.min(lo, avg); hi = Math.max(hi, avg);
      base.push([X0 + ((i + 1) * bw) / PER, y(avg)]);
    }
    svg.append(svgEl("line", { x1: X0, y1: y(st.mean), x2: X1, y2: y(st.mean), stroke: "var(--green)", "stroke-width": 1.4, "stroke-dasharray": "7 5" }));
    svg.append(polyline(base, "var(--hl)", 2.4));
    svg.append(svgEl("text", { x: 336, y: 218, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, "grey: signal · yellow: running average (baseline) · green dashed: mean amplitude"));
    const wanders = hi - lo > 0.5, dc = Math.abs(st.mean) >= 0.005;
    grid(out, [
      ["Running average", `${num(lo, 2)} to ${num(hi, 2)} V`, wanders ? "the baseline wanders" : "the baseline holds"],
      ["Mean amplitude", `${num(st.mean, 3)} V`, dc ? "not zero: a DC component (bias)" : "zero: DC balanced, no DC component"],
      ["Longest stretch without a transition", plural(st.longest, "bit"), "no transition, no timing information"],
    ]);
    note.textContent = BD_NOTES[scheme];
  }
  input.addEventListener("input", () => {
    const v = input.value.replace(/[^01]/g, "");
    if (valid(v)) { bits = v; draw(); } else note.textContent = "Type 4 to 32 bits, 0s and 1s only.";
  });
  draw();
}

// ---------- widget: dc-offset ----------
// The slide-52 picture: a composite analog signal between −1 and 1, then the same signal with a DC component added.
const DC_A1 = 1.0607, DC_A3 = DC_A1 / 3; // sin x + sin(3x)/3 scaled so the peaks are at ±1
function dcOffset(box, cfg) {
  let dc = clamp(cfg.dc ?? 1, -1, 2);
  box.append(el("h4", null, cfg.title || "A composite analog signal with an added DC component"));
  const sD = slider("Added DC component", -1, 2, 0.1, dc, (v) => { dc = v; draw(); }, (v) => `${fmtNum(v, 1)} V`);
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "The slide's example: without the DC component the signal runs between −1.0 and 1.0; with 1.0 added it runs between 0.0 and 2.0 and the frequency-domain plot gains a component at frequency 0.");
  box.append(sD.row, svg, out, note);
  function draw() {
    svg.innerHTML = "";
    // time domain, two periods
    const X0 = 40, X1 = 330, Y0 = 136, S = 30; // y = Y0 − v·S, v from −2 to 3
    const y = (v) => Y0 - v * S;
    for (let v = -2; v <= 3; v++) {
      svg.append(svgEl("line", { x1: X0, y1: y(v), x2: X1, y2: y(v), stroke: v === 0 ? "var(--rule-strong)" : "var(--rule)" }));
      svg.append(svgEl("text", { x: X0 - 5, y: y(v) + 3, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, String(v)));
    }
    const pts = [];
    for (let i = 0; i <= 240; i++) { const x = (4 * Math.PI * i) / 240; pts.push([X0 + ((X1 - X0) * i) / 240, y(dc + DC_A1 * Math.sin(x) + DC_A3 * Math.sin(3 * x))]); }
    svg.append(svgEl("line", { x1: X0, y1: y(dc), x2: X1, y2: y(dc), stroke: "var(--green)", "stroke-width": 1.4, "stroke-dasharray": "7 5" }));
    svg.append(polyline(pts, "var(--blue)", 2.2));
    svg.append(svgEl("text", { x: (X0 + X1) / 2, y: 222, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, "time-domain plot (green dashed: mean amplitude)"));
    // frequency domain
    const F0 = 400, F1 = 620, FY = 196, FS = 86;
    svg.append(svgEl("line", { x1: F0, y1: FY, x2: F1, y2: FY, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("line", { x1: F0, y1: 20, x2: F0, y2: FY, stroke: "var(--rule-strong)" }));
    for (let f = 0; f <= 4; f++) svg.append(svgEl("text", { x: F0 + ((F1 - F0) * f) / 4, y: FY + 12, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }, String(f)));
    for (const [f, a, color] of [[0, Math.abs(dc), "var(--red)"], [1, DC_A1, "var(--blue)"], [3, DC_A3, "var(--blue)"]]) {
      if (a < 1e-9) continue;
      const x = F0 + ((F1 - F0) * f) / 4 + (f === 0 ? 2 : 0);
      svg.append(svgEl("line", { x1: x, y1: FY, x2: x, y2: FY - a * FS, stroke: color, "stroke-width": f === 0 ? 3 : 2 }));
      if (f === 0) svg.append(svgEl("text", { x: F0 - 6, y: FY - a * FS + 4, "text-anchor": "end", "font-size": 10, fill: "var(--red)" }, `${num(Math.abs(dc), 1)} at f = 0`));
    }
    svg.append(svgEl("text", { x: (F0 + F1) / 2, y: 222, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, "frequency-domain plot"));
    const zero = Math.abs(dc) < 1e-9;
    grid(out, [
      ["Signal range", `${num(dc - 1, 1)} to ${num(dc + 1, 1)} V`, "the same shape, shifted"],
      ["Mean amplitude", `${num(dc, 1)} V`, zero ? "zero: DC balanced (DC free)" : "the DC component (bias)"],
      ["Component at frequency 0", zero ? "none" : `${num(Math.abs(dc), 1)} V`, zero ? "nothing for a low-frequency cut to remove" : "lost on a line that cannot pass low frequencies"],
    ]);
  }
  draw();
}

// ---------- widget: clock-drift ----------
function clockDrift(box, cfg) {
  const bits = /^[01]{2,12}$/.test(cfg.bits || "") ? cfg.bits : "10110001";
  let speed = clamp(cfg.speed ?? 1.5, 0.5, 2);
  box.append(el("h4", null, cfg.title || "A receiver clock that is faster or slower than the sender's"));
  const sS = slider("Receiver clock speed", 0.5, 2, 0.05, speed, (v) => { speed = v; draw(); }, (v) => `${fmtNum(v, 2)}×`);
  const svg = svgEl("svg", { viewBox: "0 0 640 250", class: "curve-svg net-svg" });
  const sentRow = el("div", "sorted-line"), readRow = el("div", "sorted-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  const Rf = unitField("data rate", RATE_UNITS, cfg.rate ?? 1, cfg.rateUnit || "kbps");
  const Pf = valueField("receiver clock faster by", cfg.percent ?? 0.1, "number", "percent (negative: slower)");
  const steps = el("div", "stat-steps math-line");
  const out2 = el("div", "stat-grid");
  box.append(sS.row, svg, sentRow, readRow, out, note, el("h4", null, "Extra bits per second from a small clock difference"), Rf.row, Pf.row, steps, out2);

  function bitRow(row, label, values) {
    row.innerHTML = "";
    row.append(el("span", "stat-label", label));
    values.forEach((b) => row.append(el("span", "sorted-val", String(b))));
  }
  function draw() {
    svg.innerHTML = "";
    const n = bits.length, X0 = 40, X1 = 620, bw = (X1 - X0) / n, AMP = 24;
    const level = (t) => {
      // A sample that lands exactly on an edge is read as the higher of the two levels.
      const k = Math.round(t);
      if (Math.abs(t - k) < 1e-9 && k > 0 && k < n) return Math.max(+bits[k - 1], +bits[k]);
      return +bits[clamp(Math.floor(t), 0, n - 1)];
    };
    const count = Math.floor(n * speed + 1e-9), read = [];
    for (let k = 0; k < count; k++) read.push(level((k + 0.5) / speed));
    const rowAt = (yc, title) => {
      const y = (b) => yc - (b ? AMP : -AMP);
      svg.append(svgEl("line", { x1: X0, y1: yc, x2: X1, y2: yc, stroke: "var(--rule-strong)" }));
      const pts = [];
      for (let i = 0; i < n; i++) pts.push([X0 + i * bw, y(+bits[i])], [X0 + (i + 1) * bw, y(+bits[i])]);
      svg.append(polyline(pts, "var(--blue)", 2.6));
      svg.append(svgEl("text", { x: (X0 + X1) / 2, y: yc + AMP + 26, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, title));
      return y;
    };
    rowAt(66, "a. Sent");
    for (let i = 0; i <= n; i++) {
      svg.append(svgEl("line", { x1: X0 + i * bw, y1: 24, x2: X0 + i * bw, y2: 96, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
      if (i < n) svg.append(svgEl("text", { x: X0 + (i + 0.5) * bw, y: 18, "text-anchor": "middle", "font-size": 13, fill: "var(--hl)", "font-weight": "600" }, bits[i]));
    }
    const y2 = rowAt(186, "b. Received");
    const rw = bw / speed;
    for (let k = 0; k <= count; k++) svg.append(svgEl("line", { x1: X0 + k * rw, y1: 144, x2: X0 + k * rw, y2: 216, stroke: "var(--red)", "stroke-dasharray": "3 4", opacity: 0.8 }));
    read.forEach((b, k) => {
      const x = X0 + (k + 0.5) * rw;
      svg.append(svgEl("text", { x, y: 138, "text-anchor": "middle", "font-size": 13, fill: "var(--red)", "font-weight": "600" }, String(b)));
      svg.append(svgEl("circle", { cx: x, cy: y2(b), r: 2.6, fill: "var(--red)" }));
    });
    bitRow(sentRow, "sent", bits.split(""));
    bitRow(readRow, "read", read);
    const diff = count - n;
    grid(out, [
      ["Bits sent", String(n), "one for each sender bit interval"],
      ["Bits read", String(count), diff === 0 ? "the same number" : diff > 0 ? `${diff} extra` : `${-diff} missing`],
      ["Receiver bit duration", `${num(1 / speed, 2)} of the sender's`, speed > 1 ? "shorter" : speed < 1 ? "longer" : "equal"],
    ]);
    note.textContent = (Math.abs(speed - 1) < 1e-9
      ? "The clocks match: the receiver's bit intervals correspond exactly to the sender's, and it reads the bits that were sent."
      : speed > 1
        ? "The receiver's clock is faster, so its bit duration is shorter and it reads more bits than were sent. At 1.5× this is the slide figure: 10110001 is read as 110111000011."
        : "The receiver's clock is slower, so its bit duration is longer and it reads fewer bits than were sent.")
      + " Red dots are where the receiver samples, at the middle of its own bit intervals; a sample on an edge is read as the higher level.";
  }
  function drawRate() {
    const N = Rf.get(), p = Pf.get();
    if (!(N > 0) || !Number.isFinite(p)) { steps.textContent = "Enter a data rate and a percentage."; out2.innerHTML = ""; return; }
    const got = N * (1 + p / 100), extra = got - N;
    steps.innerHTML = `${num(N, 0)} bits sent in 1 s<br>${num(N, 0)} × (1 ${p < 0 ? "−" : "+"} ${num(Math.abs(p))}%) = <b>${num(got, 2)}</b> bits received in 1 s<br><b>${num(Math.abs(extra), 2)} ${extra < 0 ? "fewer" : "extra"} bps</b>`;
    grid(out2, [
      ["Bits sent in 1 s", num(N, 0), withUnit(N, RATE_UNITS)],
      ["Bits received in 1 s", num(got, 2), `${num(N, 0)} × ${num(1 + p / 100, 6)}`],
      [extra < 0 ? "Fewer bits per second" : "Extra bits per second", num(Math.abs(extra), 2), "the same percentage costs more bits at a higher data rate"],
    ]);
  }
  Rf.on(drawRate); Pf.on(drawRate);
  draw(); drawRate();
}

// ---------- shared: predict mode for the playback widgets below ----------
/** Predict-mode state for a playback: the next step waits until its right answer is picked. `redraw` repaints the frame. */
function predictKit(ask, label, getPb, redraw) {
  const s = { on: false, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: null, key: null, refocus: false };
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  row.append(cb, " " + label);
  s.row = row;
  s.set = (v) => { s.on = !!v; cb.checked = s.on; };
  s.reset = () => { s.answered = 0; s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.key = null; };
  s.asking = (pos, n) => s.on && s.answered < n && Math.abs(pos - s.answered) < 1e-6;
  s.limit = (n) => (s.on ? s.answered : n);
  s.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  s.tally = () => (s.asked > 0 ? ` ${s.firstTry} of ${s.asked} right on the first try.` : "");
  function pick(o, e) {
    s.asked += s.wrong == null && !s.missed ? 1 : 0;
    s.refocus = e.detail === 0;
    if (!o.ok) { s.missed = true; s.wrong = o.label; redraw(); return; }
    if (!s.missed) s.firstTry++;
    s.missed = false; s.wrong = null; s.answered++;
    getPb().next();
  }
  /** Shows the answer buttons while `show` is true. opts: [{ label, ok, why }]; `why` is quoted after a wrong pick. */
  s.render = (show, keyBase, opts) => {
    const key = show ? `${keyBase}|${s.answered}|${s.wrong}` : "";
    if (key === s.key) return;
    s.key = key; ask.innerHTML = ""; ask.hidden = !s.on;
    if (!key) return;
    const btns = opts.map((o) => {
      const b = el("button", "viz-btn" + (o.label === s.wrong ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => pick(o, e));
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
    s.answered = Math.ceil(pb.pos() - 1e-9);
    pb.set(pb.pos());
  });
  return s;
}
const smooth01 = (u) => { const c = clamp(u, 0, 1); return c * c * (3 - 2 * c); };
const lerpN = (a, b, t) => a + (b - a) * t;

// ---------- widget: baseline-play ----------
// The baseline-dc trace drawn one bit at a time: the bit's level, then the receiver's running average across it.
function baselinePlay(box, cfg) {
  const schemes = (Array.isArray(cfg.schemes) ? cfg.schemes : ["nrz-l", "manchester"]).filter((s) => LC[s]);
  if (!schemes.length) schemes.push("nrz-l", "manchester");
  let scheme = schemes.includes(cfg.scheme) ? cfg.scheme : schemes[0];
  const valid = (s) => /^[01]{4,24}$/.test(s);
  let bits = valid(cfg.bits || "") ? cfg.bits : "0100000000001011";
  let half = [], avgAt = [], pb = null;
  const PER = 16, TAU = 6;

  box.append(el("h4", null, cfg.title || "The running average, bit by bit"));
  if (schemes.length > 1) box.append(btnRow(schemes.map((s) => LC[s].name), (i) => { scheme = schemes[i]; restart(); }, schemes.indexOf(scheme)));
  const row = el("div", "unit-row");
  const input = bitsInput(bits, 24);
  row.append(el("label", null, "bits"), input);
  for (const [label, b] of [["long run of 0s", "0100000000001011"], ["long run of 1s", "0111111111110100"], ["alternating", "0101010101010101"]]) {
    const btn = el("button", "viz-btn", label);
    btn.type = "button";
    btn.addEventListener("click", () => { bits = b; input.value = bits; restart(); });
    row.append(btn);
  }
  const svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg", role: "img", "aria-label": "signal and the receiver's running average, drawn one bit at a time" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  const P = predictKit(ask, "Predict the baseline's move before each bit", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  box.append(row, P.row, svg, caption, ask);

  const n = () => bits.length;
  /** The running average at each of PER sub-steps per bit, with a time constant of TAU bit durations (as in baseline-dc). */
  function compute() {
    half = lcEncode(scheme, bits);
    const levels = LC[scheme].levels, alpha = 1 - Math.exp(-1 / (TAU * PER));
    let avg = (Math.max(...levels) + Math.min(...levels)) / 2;
    avgAt = [avg];
    for (let i = 0; i < n() * PER; i++) { avg += (half[Math.floor((i * 2) / PER)] - avg) * alpha; avgAt.push(avg); }
  }
  const moveOf = (i) => { const d = avgAt[(i + 1) * PER] - avgAt[i * PER]; return d > 0.02 ? "up" : d < -0.02 ? "down" : "hold"; };
  const RULE = "The running average moves toward the level the signal holds during the bit. A bit with a positive and a negative half leaves it where it was, and so does a level the average has already drifted to.";
  function levelsText(i) {
    const a = half[2 * i], b = half[2 * i + 1];
    return a === b ? `${LC[scheme].name} holds ${levelName(a)} for the whole bit` : `${LC[scheme].name} sends ${levelName(a)} then ${levelName(b)}, a positive and a negative half`;
  }
  function frame(pos) {
    const N = n(), X0 = 46, X1 = 626, YC = 100, AMP = 58, bw = (X1 - X0) / N, y = (v) => YC - v * AMP;
    const q = P.asking(pos, N), cur = q ? P.answered : Math.min(N - 1, Math.floor(pos - 1e-9));
    const f = q ? 0 : cur < 0 ? 0 : pos - cur;
    svg.innerHTML = "";
    if (cur >= 0) svg.append(svgEl("rect", { x: X0 + cur * bw, y: 30, width: bw, height: 2 * AMP + 10, fill: "var(--hl-soft)" }));
    for (let i = 0; i <= N; i++) svg.append(svgEl("line", { x1: X0 + i * bw, y1: 30, x2: X0 + i * bw, y2: YC + AMP + 12, stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
    for (let i = 0; i < N; i++) svg.append(svgEl("text", { x: X0 + (i + 0.5) * bw, y: 24, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)", "font-weight": i === cur ? "700" : "400" }, bits[i]));
    svg.append(svgEl("line", { x1: X0, y1: YC, x2: X1, y2: YC, stroke: "var(--rule-strong)" }));
    lcLevelLabels(svg, scheme, X0 - 6, YC, AMP);
    // The signal: whole bits so far, the current one drawn during the first 40 % of the step.
    const sigTo = cur < 0 ? 0 : q ? P.answered : cur + Math.min(1, f / 0.4);
    if (sigTo > 0) {
      const pts = [];
      for (let h = 0; h < 2 * N && sigTo > h / 2; h++) pts.push([X0 + (h / 2) * bw, y(half[h])], [X0 + Math.min((h + 1) / 2, sigTo) * bw, y(half[h])]);
      svg.append(polyline(pts, "var(--ink-dim)", 1.8, 0.9));
    }
    // The running average follows over the rest of the step.
    const avgTo = cur < 0 ? 0 : q ? P.answered : cur + smooth01((f - 0.3) / 0.7);
    const kMax = Math.round(avgTo * PER), base = [];
    for (let k = 0; k <= kMax; k++) base.push([X0 + (k / PER) * bw, y(avgAt[k])]);
    if (base.length > 1) svg.append(polyline(base, "var(--hl)", 2.6));
    svg.append(svgEl("circle", { cx: base[base.length - 1][0], cy: base[base.length - 1][1], r: 4.5, fill: "var(--hl)" }));
    svg.append(svgEl("text", { x: 336, y: 194, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, "grey: signal · yellow: the receiver's running average (the baseline)"));
    let text;
    if (q) text = `Bit ${P.answered + 1} is ${bits[P.answered]}: ${levelsText(P.answered)}. Does the baseline move up, move down or hold?`;
    else if (cur < 0) text = `The receiver's running average starts at ${num(avgAt[0], 2)} V, midway between the levels. Each step adds one bit.`;
    else {
      const a0 = avgAt[cur * PER], a1 = avgAt[(cur + 1) * PER], m = moveOf(cur);
      text = `Bit ${cur + 1} is ${bits[cur]}: ${levelsText(cur)}, so the running average ${m === "hold" ? "holds" : `moves ${m}`} (${num(a0, 2)} to ${num(a1, 2)} V).`;
      if (pos >= N) {
        let lo = Infinity, hi = -Infinity;
        for (const v of avgAt) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        text += hi - lo > 0.5 ? ` Over the ${N} bits the baseline wandered from ${num(lo, 2)} to ${num(hi, 2)} V.` : ` Over the ${N} bits the baseline stayed between ${num(lo, 2)} and ${num(hi, 2)} V.`;
        text += P.tally();
      }
    }
    if (caption.textContent !== text) caption.textContent = text;
    P.render(q, `${scheme}|${bits}`, ["up", "down", "hold"].map((m) => ({ label: m === "hold" ? "holds" : `moves ${m}`, ok: m === moveOf(P.answered), why: RULE })));
  }
  function restart() {
    compute(); P.reset();
    note.textContent = BD_NOTES[scheme] + " The running average has a time constant of 6 bit durations.";
    pb.reset(n());
  }
  compute();
  pb = createPlayback({ count: n(), unit: "bit", onFrame: frame, stepMs: () => cfg.stepMs || 900, limit: () => P.limit(n()), onBlocked: P.nudge });
  box.append(pb.el, note);
  input.addEventListener("input", () => {
    const v = input.value.replace(/[^01]/g, "");
    if (valid(v)) { bits = v; restart(); } else note.textContent = "Type 4 to 24 bits, 0s and 1s only.";
  });
  restart();
}

// ---------- widget: clock-drift-play ----------
// The receiver's clock ticking along the sent signal: one tick per step, the sample point sweeps to the middle of
// the receiver's next bit interval and the bit it reads is appended.
function clockDriftPlay(box, cfg) {
  const bits = /^[01]{2,12}$/.test(cfg.bits || "") ? cfg.bits : "10110001";
  const SPEEDS = [[1.5, "1.5× (slide figure)"], [1, "1× (matched)"], [0.75, "0.75× (slower)"]];
  let speed = clamp(+cfg.speed || 1.5, 0.5, 2), pb = null;
  box.append(el("h4", null, cfg.title || "The receiver's clock ticking along the sent signal"));
  box.append(btnRow(SPEEDS.map((s) => s[1]), (i) => { speed = SPEEDS[i][0]; restart(); }, SPEEDS.findIndex((s) => Math.abs(s[0] - speed) < 1e-9)));
  const svg = svgEl("svg", { viewBox: "0 0 640 236", class: "curve-svg net-svg", role: "img", "aria-label": "sent signal and the receiver's sample points, one clock tick at a time" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  const P = predictKit(ask, "Predict each bit the receiver reads", () => pb, () => frame(pb.pos()));
  P.set(cfg.predict);
  box.append(P.row, svg, caption, ask);

  const n = bits.length;
  const count = () => Math.floor(n * speed + 1e-9);
  const tAt = (k) => (k + 0.5) / speed; // sample time of tick k, in sender bit durations
  const level = (t) => {
    // A sample that lands exactly on an edge is read as the higher of the two levels, as in clock-drift.
    const k = Math.round(t);
    if (Math.abs(t - k) < 1e-9 && k > 0 && k < n) return Math.max(+bits[k - 1], +bits[k]);
    return +bits[clamp(Math.floor(t), 0, n - 1)];
  };
  const read = () => Array.from({ length: count() }, (_, k) => level(tAt(k)));
  const rule = () => `The receiver reads the sent signal at the middle of its own bit interval, and its bit lasts ${num(1 / speed, 2)} of the sender's.`;
  function frame(pos) {
    const C = count(), R = read(), X0 = 40, X1 = 620, bw = (X1 - X0) / n, rw = bw / speed, AMP = 22;
    const q = P.asking(pos, C), cur = q ? P.answered : Math.min(C - 1, Math.floor(pos - 1e-9));
    const f = q ? 0 : cur < 0 ? 0 : pos - cur, done = q ? P.answered : cur + (f >= 0.6 ? 1 : 0); // ticks whose bit is read
    svg.innerHTML = "";
    const rowAt = (yc, title) => {
      const y = (b) => yc - (b ? AMP : -AMP), pts = [];
      svg.append(svgEl("line", { x1: X0, y1: yc, x2: X1, y2: yc, stroke: "var(--rule-strong)" }));
      for (let i = 0; i < n; i++) pts.push([X0 + i * bw, y(+bits[i])], [X0 + (i + 1) * bw, y(+bits[i])]);
      svg.append(polyline(pts, "var(--blue)", 2.6));
      svg.append(svgEl("text", { x: (X0 + X1) / 2, y: yc + AMP + 22, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, title));
      return y;
    };
    rowAt(62, "a. Sent");
    for (let i = 0; i <= n; i++) {
      svg.append(svgEl("line", { x1: X0 + i * bw, y1: 24, x2: X0 + i * bw, y2: 90, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
      if (i < n) svg.append(svgEl("text", { x: X0 + (i + 0.5) * bw, y: 18, "text-anchor": "middle", "font-size": 13, fill: "var(--hl)", "font-weight": "600" }, bits[i]));
    }
    const y2 = rowAt(176, "b. Received");
    // Receiver intervals that have started, and the reads so far.
    const started = q ? P.answered + 1 : cur + 1;
    for (let k = 0; k <= Math.min(started, C); k++) svg.append(svgEl("line", { x1: X0 + k * rw, y1: 138, x2: X0 + k * rw, y2: 204, stroke: "var(--red)", "stroke-dasharray": "3 4", opacity: 0.8 }));
    if (q) svg.append(svgEl("rect", { x: X0 + P.answered * rw, y: 138, width: rw, height: 66, fill: "var(--hl-soft)" }));
    for (let k = 0; k < done; k++) {
      const x = X0 + (k + 0.5) * rw;
      svg.append(svgEl("text", { x, y: 132, "text-anchor": "middle", "font-size": 13, fill: "var(--red)", "font-weight": "600" }, String(R[k])));
      svg.append(svgEl("circle", { cx: x, cy: y2(R[k]), r: 3, fill: "var(--red)" }));
    }
    // The sample point sweeping from the last sample to this tick's.
    if (cur >= 0 && !q) {
      const t = lerpN(cur > 0 ? tAt(cur - 1) : 0, tAt(cur), smooth01(f / 0.6)), x = X0 + t * bw;
      svg.append(svgEl("line", { x1: x, y1: 26, x2: x, y2: 204, stroke: "var(--hl)", "stroke-width": 1.6 }));
      svg.append(svgEl("circle", { cx: x, cy: 62 - (level(t) ? AMP : -AMP), r: 5, fill: "var(--hl)" }));
    }
    svg.append(svgEl("text", { x: 632, y: 132, "text-anchor": "end", "font-size": 10.5, fill: "var(--ink-dim)" }, `read ${done} of ${C}`));
    let text;
    if (q) text = `Tick ${P.answered + 1}: the receiver samples at the middle of its interval ${P.answered + 1}, ${num(tAt(P.answered), 2)} sender bit durations from the start. Which bit does it read?`;
    else if (cur < 0) text = `The sender sends ${bits}. The receiver's clock is ${num(speed, 2)}× the sender's, so its bit duration is ${num(1 / speed, 2)} of the sender's and it ticks ${C} times while ${n} bits arrive.`;
    else {
      const t = tAt(cur), j = clamp(Math.floor(t), 0, n - 1);
      text = `Tick ${cur + 1}: the sample at ${num(t, 2)} sender bit durations falls in sent bit ${j + 1}, a ${bits[j]}, so the receiver reads ${R[cur]}.`;
      if (pos >= C) text += ` ${n} bits sent, ${C} read: ${R.join("")}.${P.tally()}`;
    }
    if (caption.textContent !== text) caption.textContent = text;
    P.render(q, String(speed), ["0", "1"].map((b) => ({ label: b, ok: +b === R[P.answered], why: rule() })));
  }
  function restart() {
    P.reset();
    note.textContent = Math.abs(speed - 1) < 1e-9 ? "The clocks match: one read per sent bit, and the receiver reads exactly what was sent."
      : speed > 1 ? "A faster receiver clock has a shorter bit duration, so it reads more bits than were sent. At 1.5× this is the slide figure: 10110001 is read as 110111000011."
        : "A slower receiver clock has a longer bit duration, so it reads fewer bits than were sent.";
    pb.reset(count());
  }
  pb = createPlayback({ count: count(), unit: "tick", onFrame: frame, stepMs: () => cfg.stepMs || 900, limit: () => P.limit(count()), onBlocked: P.nudge });
  box.append(pb.el, note);
  restart();
}

export const WIDGETS = {
  "line-code": lineCode,
  "line-code-play": lineCodePlay,
  "signal-elements": signalElements,
  "signal-rate": signalRate,
  "baseline-dc": baselineDc,
  "dc-offset": dcOffset,
  "clock-drift": clockDrift,
  "baseline-play": baselinePlay,
  "clock-drift-play": clockDriftPlay,
};
