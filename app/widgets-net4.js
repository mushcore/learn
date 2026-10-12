// Interactive data-communications widgets for COMP 3721 Week 5 (Lectures 05a and 05b): sampling and the
// Nyquist rate, quantization (the slide's nine-sample table), the PCM calculator, ASK / FSK / PSK / 8-QAM,
// constellation diagrams, and AM / FM / PM with their bandwidth boxes.
import { el, slider, btnRow } from "./dom.js";
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
function text(svg, x, y, s, attrs = {}) {
  svg.append(svgEl("text", { x, y, "font-size": 11, fill: "var(--ink-dim)", "text-anchor": "middle", ...attrs }, s));
}
const FREQ_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9]];
const RATE_UNITS = [["bps", 1], ["kbps", 1e3], ["Mbps", 1e6], ["Gbps", 1e9]];
const SAMPLE_UNITS = [["samples/s", 1], ["k samples/s", 1e3], ["M samples/s", 1e6], ["G samples/s", 1e9]];
const TIME_UNITS = [["s", 1], ["ms", 1e-3], ["μs", 1e-6], ["ns", 1e-9], ["ps", 1e-12]];
function bestUnit(value, units) {
  const v = Math.abs(value);
  if (!(v > 0) || !Number.isFinite(v)) return units[0];
  let best = units[0];
  for (const u of units) if (v / u[1] >= 1 - 1e-9) best = u;
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
function fmtTime(sec, d = 4) {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  let u = TIME_UNITS[TIME_UNITS.length - 1];
  for (const t of TIME_UNITS) if (sec / t[1] >= 1 - 1e-9) { u = t; break; }
  return `${num(sec / u[1], d)} ${u[0]}`;
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
    row, input,
    get: () => parseFloat(input.value) * factor(),
    unit: () => sel.value,
    factor,
    setRaw: (v, u) => { input.value = v ?? ""; if (u && units.some(([x]) => x === u)) sel.value = u; },
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
const log2int = (L) => { const e = Math.log2(L); return Math.abs(e - Math.round(e)) < 1e-9 ? Math.round(e) : e; };
/** Sets the active button of a btnRow by index (−1 clears). */
function setActive(row, i) { [...row.children].forEach((b, k) => b.classList.toggle("active", k === i)); }
/** A Check / Reveal / Clear control row with a verdict span. */
function checkRow(onCheck, onReveal, onClear) {
  const ctl = el("div", "viz-btn-row");
  const check = el("button", "viz-btn", "Check"), reveal = el("button", "viz-btn", "Reveal"), clear = el("button", "viz-btn", "Clear");
  const verdict = el("span", "encap-pduname");
  verdict.setAttribute("aria-live", "polite");
  check.addEventListener("click", onCheck); reveal.addEventListener("click", onReveal); clear.addEventListener("click", onClear);
  ctl.append(check, reveal, clear, verdict);
  return { ctl, verdict };
}
function arrowAxis(svg, x0, y0, x1, y1, color = "var(--rule-strong)") {
  svg.append(svgEl("line", { x1: x0, y1: y0, x2: x1, y2: y1, stroke: color, "stroke-width": 1.2 }));
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const tip = `${x1},${y1} ${x1 - 8 * ux + 3.5 * uy},${y1 - 8 * uy - 3.5 * ux} ${x1 - 8 * ux - 3.5 * uy},${y1 - 8 * uy + 3.5 * ux}`;
  svg.append(svgEl("polygon", { points: tip, fill: color }));
}
/** The slide's rounded spectrum hump centred on cx. */
function hump(svg, cx, base, width, height, fill = "var(--hl-soft)", stroke = "var(--hl)") {
  const l = cx - width / 2, r = cx + width / 2, k = Math.min(14, width / 4);
  svg.append(svgEl("path", { d: `M ${l} ${base} L ${l} ${base - height + k} Q ${l} ${base - height} ${l + k} ${base - height} L ${r - k} ${base - height} Q ${r} ${base - height} ${r} ${base - height + k} L ${r} ${base} Z`, fill, stroke, "stroke-width": 1.4 }));
}
function bracket(svg, x0, x1, y, label, color = "var(--ink)") {
  svg.append(svgEl("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: color, "stroke-width": 1 }));
  for (const x of [x0, x1]) svg.append(svgEl("line", { x1: x, y1: y - 4, x2: x, y2: y + 4, stroke: color, "stroke-width": 1 }));
  text(svg, (x0 + x1) / 2, y - 5, label, { fill: color, "font-size": 11.5 });
}

// ---------- widget: sampler ----------
const SAMPLE_METHODS = {
  ideal: { name: "Ideal sampling", note: "Ideal sampling: stems at the signal's height every T_s. The slide: cannot be easily implemented (the literature calls it impulse sampling)." },
  natural: { name: "Natural sampling", note: "Natural sampling: narrow pulses whose tops follow the analog signal during the pulse. The slide: uses a high-speed switch, a circuit that can rapidly connect and disconnect a signal path." },
  flat: { name: "Flat-top sampling", note: "Flat-top sampling (sample-and-hold): rectangular pulses held at the sampled value. The slide: uses a circuit; the most commonly used method." },
};
const SAMPLE_PRESETS = [["a. Nyquist rate: f_s = 2f", 2], ["b. Oversampling: f_s = 4f", 4], ["c. Undersampling: f_s = f", 1]];
function sampler(box, cfg) {
  const unit = FREQ_UNITS.find(([u]) => u === cfg.unit) || FREQ_UNITS[0];
  const f = cfg.f > 0 ? +cfg.f : 1;
  const keys = Object.keys(SAMPLE_METHODS);
  const methods = (Array.isArray(cfg.methods) ? cfg.methods : keys).filter((m) => SAMPLE_METHODS[m]);
  if (!methods.length) methods.push(...keys);
  let method = methods.includes(cfg.method) ? cfg.method : methods[0];
  let ratio = clamp(Math.round(((cfg.fs > 0 ? cfg.fs / f : 2)) * 10) / 10, 0.5, 8);

  box.append(el("h4", null, cfg.title || "Sampling an analog signal: the sampling rate against the Nyquist rate"));
  const presetRow = btnRow(SAMPLE_PRESETS.map((p) => p[0]), (i) => { ratio = SAMPLE_PRESETS[i][1]; sFs.set(ratio); draw(); }, SAMPLE_PRESETS.findIndex((p) => p[1] === ratio));
  const methodRow = methods.length > 1 ? btnRow(methods.map((m) => SAMPLE_METHODS[m].name), (i) => { method = methods[i]; draw(); }, methods.indexOf(method)) : null;
  const sFs = slider("Sampling rate f_s", 0.5, 8, 0.1, ratio, (v) => { ratio = v; draw(); }, (v) => `${num(v, 1)} f`);
  const svg = svgEl("svg", { viewBox: "0 0 640 240", class: "curve-svg net-svg", role: "img", "aria-label": "analog signal with its samples, and the samples joined by dashed lines" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(presetRow);
  if (methodRow) box.append(methodRow);
  box.append(sFs.row, svg, out, note);

  function draw() {
    svg.innerHTML = "";
    setActive(presetRow, SAMPLE_PRESETS.findIndex((p) => Math.abs(p[1] - ratio) < 1e-9));
    const fs = ratio * f;
    const CY = 104, AMP = 56, L0 = 26, L1 = 304, R0 = 346, R1 = 624, CYC = 3;
    const xl = (t) => L0 + ((L1 - L0) * t) / CYC, xr = (t) => R0 + ((R1 - R0) * t) / CYC, y = (v) => CY - v * AMP;
    const sig = (t) => Math.sin(2 * Math.PI * t);
    for (const [x0, x1] of [[L0, L1], [R0, R1]]) {
      arrowAxis(svg, x0 - 6, CY, x1 + 12, CY);
      arrowAxis(svg, x0, CY + AMP + 12, x0, CY - AMP - 18);
    }
    text(svg, L1 + 12, CY + 24, "Time", { "text-anchor": "end" });
    text(svg, R1 + 12, CY + 24, "Time", { "text-anchor": "end" });
    text(svg, L0 + 4, CY - AMP - 8, "Amplitude", { "text-anchor": "start" });
    const curve = [];
    for (let i = 0; i <= 240; i++) { const t = (CYC * i) / 240; curve.push([xl(t), y(sig(t))]); }
    const dashedCurve = polyline(curve, "var(--ink-2)", 1.7);
    dashedCurve.setAttribute("stroke-dasharray", "6 4");
    svg.append(dashedCurve);
    const samples = [];
    for (let t = 0.25; t <= CYC + 1e-9; t += 1 / ratio) samples.push([t, sig(t)]);
    const w = Math.min(0.32 / ratio, 0.22);
    for (const [t, v] of samples) {
      if (method === "ideal") {
        svg.append(svgEl("line", { x1: xl(t), y1: CY, x2: xl(t), y2: y(v), stroke: "var(--blue)", "stroke-width": 2.2 }));
        svg.append(svgEl("circle", { cx: xl(t), cy: y(v), r: 4.2, fill: "var(--blue)" }));
      } else if (method === "natural") {
        const t1 = Math.min(t + w, CYC);
        let d = `M ${xl(t).toFixed(1)} ${CY}`;
        for (let i = 0; i <= 8; i++) { const tt = t + ((t1 - t) * i) / 8; d += ` L ${xl(tt).toFixed(1)} ${y(sig(tt)).toFixed(1)}`; }
        d += ` L ${xl(t1).toFixed(1)} ${CY} Z`;
        svg.append(svgEl("path", { d, fill: "var(--blue-soft)", stroke: "var(--blue)", "stroke-width": 1.8 }));
      } else {
        const t1 = Math.min(t + w, CYC), top = Math.min(CY, y(v)), h = Math.abs(y(v) - CY);
        svg.append(svgEl("rect", { x: xl(t), y: top, width: Math.max(1.5, xl(t1) - xl(t)), height: h, fill: "var(--blue-soft)", stroke: "var(--blue)", "stroke-width": 1.8 }));
      }
    }
    if (samples.length > 1) {
      const a = xl(samples[0][0]), b = xl(samples[1][0]), ty = CY + AMP + 8;
      svg.append(svgEl("line", { x1: a, y1: ty, x2: b, y2: ty, stroke: "var(--hl)", "stroke-width": 1.2 }));
      for (const x of [a, b]) svg.append(svgEl("line", { x1: x, y1: ty - 4, x2: x, y2: ty + 4, stroke: "var(--hl)", "stroke-width": 1.2 }));
      text(svg, (a + b) / 2, ty + 12, "T_s", { fill: "var(--hl)" });
    }
    const rec = samples.map(([t, v]) => [xr(t), y(v)]);
    const dashed = polyline(rec, "var(--blue)", 2);
    dashed.setAttribute("stroke-dasharray", "6 5");
    svg.append(dashed);
    for (const [x, yy] of rec) svg.append(svgEl("circle", { cx: x, cy: yy, r: 4, fill: "var(--ink)" }));
    text(svg, (L0 + L1) / 2, 198, "analog signal (dashed) and its samples");
    text(svg, (R0 + R1) / 2, 198, "the samples joined: what the receiver rebuilds");
    const under = ratio < 2 - 1e-9, nyq = Math.abs(ratio - 2) < 1e-9;
    const verdict = under ? ["Undersampling (f_s < 2f)", "a signal that does not look like the original one", "var(--red)"]
      : nyq ? ["Nyquist rate sampling (f_s = 2f)", "a good approximation of the original sine wave", "var(--green)"]
        : ["Oversampling (f_s > 2f)", "same approximation but redundant and unnecessary", "var(--hl)"];
    svg.append(svgEl("rect", { x: 10, y: 208, width: 620, height: 26, rx: 5, fill: "var(--paper)", stroke: verdict[2], "stroke-width": 1.4 }));
    text(svg, 320, 225, `${verdict[0]}: ${verdict[1]}`, { fill: verdict[2], "font-size": 12, "font-weight": "600" });
    const fsHz = fs * unit[1];
    grid(out, [
      ["Signal frequency f", `${num(f)} ${unit[0]}`, "the highest frequency in this signal: f_max = f"],
      ["Sampling rate f_s", `${num(fs)} ${unit[0]}`, `${num(ratio, 1)} f, in samples/s`],
      ["Sampling interval T_s = 1/f_s", fmtTime(1 / fsHz), `${num(1 / ratio, 3)} of the signal's period`],
      ["Nyquist rate f_N = 2 f_max", `${num(2 * f)} ${unit[0]}`, `Nyquist interval 1/f_N = ${fmtTime(1 / (2 * f * unit[1]))}`],
      ["Samples per cycle", num(ratio, 1), under ? "fewer than 2" : nyq ? "exactly 2" : "more than 2"],
    ]);
    note.textContent = `${SAMPLE_METHODS[method].note} Samples start at the first peak, as in the slide figure. With exactly f_s = f every sample lands on the same point of each cycle, so the dots join into a flat line; the slide's figure c spaces its three samples a little wider (a peak, a zero crossing, a trough), which the slider reproduces at 0.8 f.`;
  }
  draw();
}

// ---------- widget: quantizer ----------
const SLIDE_SAMPLES = "-6.1 7.5 16.2 19.7 11.0 -5.5 -11.3 -9.4 -6.0";
const fix2 = (v) => (v < -0.005 ? "−" : "") + Math.abs(v).toFixed(2);
const signed2 = (v) => (Math.abs(v) < 0.005 ? "0" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2));
/** Actual amplitudes keep one decimal as on the slide (11.0, −6.0), two when needed. */
const fmtA = (v) => (Math.abs(v * 10 - Math.round(v * 10)) < 1e-6 ? (v < 0 ? "−" : "") + Math.abs(v).toFixed(1) : num(v, 2));
const dLabel = (v) => (Math.abs(v) < 1e-9 ? "0" : Math.abs(v - 1) < 1e-9 ? "D" : Math.abs(v + 1) < 1e-9 ? "−D" : `${num(v, 2)}D`);
function quantize(samples, vmin, vmax, L) {
  const delta = (vmax - vmin) / L, nb = Math.ceil(log2int(L) - 1e-9);
  const rows = samples.map((a) => {
    const pam = a / delta;
    const zone = clamp(Math.floor((a - vmin) / delta + 1e-9), 0, L - 1);
    const q = vmin / delta + zone + 0.5;
    return { a, pam, zone, q, err: q - pam, code: zone, word: zone.toString(2).padStart(nb, "0") };
  });
  return { delta, nb, rows, nmin: vmin / delta, nmax: vmax / delta };
}
function quantizer(box, cfg) {
  const drawMode = !!cfg.draw;
  box.append(el("h4", null, cfg.title || (drawMode ? "Quantize these samples: read each zone's code" : "Quantization: zones, midpoints, codes and error")));
  const Vmin = valueField("V_min", cfg.vmin ?? -20, "number", "V"), Vmax = valueField("V_max", cfg.vmax ?? 20, "number", "V");
  const Lf = valueField("levels L", cfg.levels ?? 8, "number", "zones, 2 to 16");
  const sampRow = el("div", "unit-row");
  const sampIn = document.createElement("input");
  sampIn.type = "text"; sampIn.className = "data-input"; sampIn.spellcheck = false;
  sampIn.value = typeof cfg.samples === "string" && cfg.samples.trim() ? cfg.samples : Array.isArray(cfg.samples) && cfg.samples.length ? cfg.samples.join(" ") : SLIDE_SAMPLES;
  sampIn.setAttribute("aria-label", "sample amplitudes in volts, separated by spaces");
  sampIn.style.flex = "1"; sampIn.style.minWidth = "200px";
  const slideBtn = el("button", "viz-btn", "slide samples");
  slideBtn.addEventListener("click", () => { sampIn.value = SLIDE_SAMPLES; Vmin.set(-20); Vmax.set(20); Lf.set(8); restart(); });
  sampRow.append(el("label", null, "samples (V)"), sampIn, slideBtn);
  const svg = svgEl("svg", { viewBox: "0 0 640 280", class: "curve-svg net-svg", role: "img", "aria-label": "quantization zones with the samples as stems" });
  const wrap = el("div", "net4-wrap"), quizWrap = el("div", "net4-wrap");
  const { ctl, verdict } = checkRow(() => { checked = true; render(); }, () => { revealed = true; checked = true; render(); }, restart);
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(Vmin.row, Vmax.row, Lf.row, sampRow, svg);
  if (drawMode) box.append(quizWrap, ctl);
  box.append(wrap, out, note);

  let guesses = [], checked = false, revealed = false;
  const parse = () => sampIn.value.split(/[\s,;]+/).map(parseFloat).filter(Number.isFinite).slice(0, 16);
  function restart() { guesses = []; checked = false; revealed = false; verdict.textContent = ""; render(); }
  function table(Q, cols) {
    const t = el("table", "group-table net4-table");
    const rowsSpec = [
      ["Actual amplitude (V)", (r) => fmtA(r.a)],
      ["Normalized PAM value", (r) => fix2(r.pam)],
      ["Zone", (r) => String(r.zone)],
      ["Normalized quantized value", (r) => fix2(r.q)],
      ["Normalized error", (r) => signed2(r.err)],
      ["Quantization code", (r) => String(r.code)],
      ["Encoded word", (r) => r.word],
    ];
    for (const [label, fn] of rowsSpec) {
      const tr = el("tr", label === "Encoded word" ? "word" : null);
      tr.append(el("th", null, label));
      for (const r of Q.rows) tr.append(el("td", null, fn(r)));
      t.append(tr);
    }
    return t;
  }
  function render() {
    svg.innerHTML = ""; wrap.innerHTML = ""; quizWrap.innerHTML = ""; out.innerHTML = "";
    const vmin = Vmin.get(), vmax = Vmax.get(), L = Math.round(Lf.get()), samples = parse();
    if (!(vmax > vmin)) { note.textContent = "V_max must be greater than V_min."; return; }
    if (!(L >= 2 && L <= 64)) { note.textContent = "Enter a number of levels L between 2 and 64."; return; }
    if (!samples.length) { note.textContent = "Enter at least one sample amplitude."; return; }
    const Q = quantize(samples, vmin, vmax, L);
    const PT = 26, PH = clamp(L * 25, 160, 400), PX0 = 104, PX1 = 622, n = Q.rows.length;
    svg.setAttribute("viewBox", `0 0 640 ${PT + PH + 44}`);
    const y = (v) => PT + PH - ((v - Q.nmin) / (Q.nmax - Q.nmin)) * PH;
    const xs = Q.rows.map((_, i) => PX0 + 26 + (i * (PX1 - PX0 - 52)) / Math.max(1, n - 1));
    text(svg, 16, 16, "code", { "font-size": 10.5 });
    text(svg, 96, 16, "normalized", { "text-anchor": "end", "font-size": 10.5 });
    for (let k = 0; k < L; k++) {
      const top = y(Q.nmin + k + 1), bottom = y(Q.nmin + k);
      svg.append(svgEl("rect", { x: PX0, y: top, width: PX1 - PX0, height: bottom - top, fill: k % 2 ? "var(--blue-soft)" : "var(--hl-soft)" }));
      text(svg, 16, (top + bottom) / 2 + 4, String(k), { fill: "var(--hl)", "font-size": L > 12 ? 10 : 12, "font-weight": "600" });
      svg.append(svgEl("line", { x1: 6, y1: bottom + 1, x2: 26, y2: bottom + 1, stroke: "var(--rule-strong)" }));
    }
    for (let j = 0; j <= L; j++) if (L <= 16 || j % 2 === 0) text(svg, 96, y(Q.nmin + j) + 4, dLabel(Q.nmin + j), { "text-anchor": "end", "font-size": L > 12 ? 9.5 : 11 });
    const baseV = clamp(0, Q.nmin, Q.nmax), yb = y(baseV);
    svg.append(svgEl("line", { x1: PX0 - 2, y1: yb, x2: PX1 + 10, y2: yb, stroke: "var(--ink)", "stroke-width": 1.4 }));
    text(svg, PX1 + 14, yb - 5, "Time", { "text-anchor": "end" });
    Q.rows.forEach((r, i) => {
      const x = xs[i], py = y(r.pam);
      const wrong = drawMode && checked && !revealed && guesses[i] !== r.code;
      const color = wrong ? "var(--red)" : "var(--blue)";
      svg.append(svgEl("line", { x1: x, y1: yb, x2: x, y2: py, stroke: color, "stroke-width": 2.2 }));
      svg.append(svgEl("circle", { cx: x, cy: py, r: 4.5, fill: color }));
      const last = i === n - 1 && n > 1;
      text(svg, x + (last ? -7 : 7), py + (r.pam >= baseV ? -4 : 12), fmtA(r.a), { "text-anchor": last ? "end" : "start", fill: "var(--ink)", "font-size": 11 });
      if (!drawMode) text(svg, x, PT + PH + 16, fix2(r.pam), { fill: "var(--ink-2)", "font-size": 10.5 });
      if (!drawMode) text(svg, x, PT + PH + 32, `code ${r.code}`, { fill: "var(--hl)", "font-size": 10.5 });
    });
    if (drawMode) text(svg, (PX0 + PX1) / 2, PT + PH + 22, "read each sample's zone and type its code below", { "font-size": 11 });
    if (drawMode) {
      const t = el("table", "group-table net4-table");
      const tr1 = el("tr"), tr2 = el("tr");
      tr1.append(el("th", null, "Actual amplitude (V)")); tr2.append(el("th", null, "Quantization code"));
      let bad = 0;
      Q.rows.forEach((r, i) => {
        tr1.append(el("td", null, fmtA(r.a)));
        const td = el("td");
        const inp = document.createElement("input");
        inp.type = "number"; inp.min = 0; inp.max = L - 1; inp.step = 1; inp.className = "q-input";
        inp.setAttribute("aria-label", `quantization code for sample ${i + 1}, ${num(r.a, 2)} V`);
        if (revealed) guesses[i] = r.code;
        if (guesses[i] != null) inp.value = guesses[i];
        if (checked) { const ok = guesses[i] === r.code; inp.classList.add(ok ? "correct" : "incorrect"); if (!ok) bad++; }
        inp.addEventListener("input", () => { const v = parseInt(inp.value, 10); guesses[i] = Number.isFinite(v) ? v : null; if (checked && !revealed) { checked = false; verdict.textContent = ""; render(); } });
        td.append(inp); tr2.append(td);
      });
      t.append(tr1, tr2); quizWrap.append(t);
      if (checked) verdict.textContent = revealed ? "The slide's codes, with the full table below." : bad === 0 ? "Correct: every code matches the slide's zone." : `${bad} of ${n} codes are wrong or empty (red).`;
      if (revealed || (checked && bad === 0)) wrap.append(table(Q));
    } else wrap.append(table(Q));
    const maxErr = Math.max(...Q.rows.map((r) => Math.abs(r.err)));
    grid(out, [
      ["Δ = (V_max − V_min)/L", `${num(Q.delta)} V`, `(${num(vmax)} − (${num(vmin)}))/${L}`],
      ["Levels L, bits per sample n_b", `L = ${L}, n_b = ${Q.nb}`, Number.isInteger(log2int(L)) ? `log₂ ${L} = ${Q.nb}; codes 0 … ${L - 1}` : `log₂ ${L} = ${num(log2int(L), 2)}, rounded up; codes 0 … ${L - 1}`],
      ["Error bound", `±Δ/2 = ±${num(Q.delta / 2)} V`, "normalized: between −0.5 and +0.5"],
      ["Largest |error| here", num(maxErr, 2), `${num(maxErr * Q.delta, 2)} V, within the bound`],
    ]);
    note.textContent = "Normalized PAM value = actual amplitude / Δ. The zone is the band the value falls in (codes 0 to L − 1 from the bottom); the normalized quantized value is the zone's midpoint; the normalized error is quantized − PAM. A value exactly on a boundary, like 1.50, goes to the upper zone, as on the slide (zone 5, error 0).";
  }
  for (const f of [Vmin, Vmax, Lf]) f.on(restart);
  sampIn.addEventListener("input", restart);
  restart();
}

// ---------- widget: pcm-calc ----------
const PCM_PRESETS = {
  "E05 1 voice": { fmax: 4, unit: "kHz", bits: 8, c: "1/2", r: "1" },
  "E05 2": { fmax: 300, unit: "MHz", levels: 64, c: "1/2", r: "1" },
  "audio CD": { fmax: 22.05, unit: "kHz", bits: 16, c: "1/2", r: "1" },
};
function pcmCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "PCM calculator: sampling rate, bits per sample, bit rate and bandwidth"));
  const presets = cfg.presets && typeof cfg.presets === "object" && Object.keys(cfg.presets).length ? cfg.presets : PCM_PRESETS;
  const labels = Object.keys(presets);
  const Ff = unitField("f_max (low-pass: = B analog)", FREQ_UNITS, 4, "kHz");
  const Lf = valueField("levels L", 256, "number", "quantization levels");
  const Nf = valueField("bits per sample n_b", 8, "number", "n_b = log₂ L");
  const Cf = valueField("case factor c", "1/2", "frac", "1/2 is the average case");
  const Rf = valueField("ratio r", "1", "frac", "1 for NRZ or bipolar line coding");
  const svg = svgEl("svg", { viewBox: "0 0 640 80", class: "curve-svg net-svg", role: "img", "aria-label": "analog bandwidth against the minimum digital bandwidth" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "Nyquist: sample at least 2 × f_max. For a low-pass signal the bandwidth is the highest frequency, so B analog = f_max. The digital signal's minimum bandwidth is n_b times the analog bandwidth (with c = 1/2 and r = 1): the price we pay for digitization.");
  const presetRow = btnRow(labels, (i) => apply(presets[labels[i]]), -1);
  box.append(presetRow, Ff.row, Lf.row, Nf.row, Cf.row, Rf.row, svg, steps, out, note);

  function apply(p) {
    Ff.setRaw(p.fmax ?? 4, p.unit || "kHz");
    if (p.bits != null) { Nf.set(p.bits); Lf.set(2 ** p.bits); } else { Lf.set(p.levels ?? 256); Nf.set(num(Math.ceil(log2int(p.levels ?? 256) - 1e-9))); }
    Cf.set(p.c ?? "1/2"); Rf.set(p.r ?? "1");
    draw();
  }
  function bars(rows) {
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${rows.length * 34 + 10}`);
    const top = Math.max(...rows.map((r) => r[1]), 1e-12);
    rows.forEach(([label, value, t, color], i) => {
      const y = 8 + i * 34, w = Math.max(2, (230 * value) / top);
      text(svg, 196, y + 15, label, { "text-anchor": "end" });
      svg.append(svgEl("rect", { x: 204, y, width: w, height: 20, rx: 3, fill: color, opacity: 0.85 }));
      text(svg, 210 + w, y + 15, t, { "text-anchor": "start", fill: "var(--ink)" });
    });
  }
  const stop = (msg) => { svg.innerHTML = ""; out.innerHTML = ""; steps.textContent = msg; };
  function draw() {
    const fmax = Ff.get(), L = Lf.get(), nbIn = Nf.get(), c = Cf.get(), r = Rf.get();
    if (!(fmax > 0)) return stop("Enter f_max greater than 0.");
    if (!(nbIn > 0) || !(L >= 2)) return stop("Enter at least 2 levels (1 bit per sample).");
    if (!(c > 0) || !(r > 0)) return stop("Enter c and r greater than 0, for example 1/2 and 1.");
    const exact = log2int(L), nb = Math.ceil(exact - 1e-9), rounded = !Number.isInteger(exact);
    const fN = 2 * fmax, interval = 1 / fN, bitRate = fN * nb, Bmin = (c * nb * 2 * fmax) / r, snr = 6.02 * nb + 1.76;
    const u = Ff.unit(), fac = Ff.factor(), fShow = num(fmax / fac), avg = Math.abs(c - 0.5) < 1e-9 && Math.abs(r - 1) < 1e-9;
    const samples = (v) => (v < 1e6 ? `${num(v, 0)} samples/s` : withUnit(v, SAMPLE_UNITS, 3));
    steps.innerHTML = [
      `f${sub("s")} = 2 × f${sub("max")} = 2 × ${num(fmax, 0)} = <b>${num(fN, 0)} samples/s</b>${fN >= 1e6 ? ` = ${withUnit(fN, SAMPLE_UNITS, 3)}` : ""}`,
      `Nyquist interval = 1/f${sub("s")} = 1/${num(fN, 0)} = <b>${fmtTime(interval)}</b>`,
      `n${sub("b")} = log${sub(2)} L = log${sub(2)} ${num(L)} = ${rounded ? `${num(exact, 2)} → <b>${nb} bits</b> (rounded up to whole bits)` : `<b>${nb} bits per sample</b>`}`,
      `Bit rate = f${sub("s")} × n${sub("b")} = ${num(fN, 0)} × ${nb} = <b>${num(bitRate, 0)} bps</b>${bitRate >= 1e3 ? ` = ${withUnit(bitRate, RATE_UNITS, 4)}` : ""}`,
      `B${sub("min")} = c × n${sub("b")} × 2 × B${sub("analog")} × 1/r = ${Cf.raw()} × ${nb} × 2 × ${num(fmax, 0)} × 1/(${Rf.raw()}) = <b>${num(Bmin, 0)} Hz</b>${Bmin >= 1e3 ? ` = ${withUnit(Bmin, FREQ_UNITS, 4)}` : ""}`,
      avg ? `with c = 1/2 and r = 1: B${sub("min")} = n${sub("b")} × B${sub("analog")} = ${nb} × ${fShow} ${u} = <b>${num(Bmin / fac)} ${u}</b>` : `in the average case (c = 1/2, r = 1) this would collapse to n${sub("b")} × B${sub("analog")} = ${num(nb * fmax / fac)} ${u}`,
      `SNR${sub("dB")} = 6.02 n${sub("b")} + 1.76 = 6.02 × ${nb} + 1.76 = <b>${num(snr, 2)} dB</b>`,
    ].join("<br>");
    bars([["B analog = f max", fmax, withUnit(fmax, FREQ_UNITS, 4), "var(--blue)"], ["B min of the digital signal", Bmin, `${withUnit(Bmin, FREQ_UNITS, 4)}, ${num(Bmin / fmax, 2)} × greater`, "var(--hl)"]]);
    grid(out, [
      ["Sampling rate f_s = 2 f_max", samples(fN), fN >= 1e6 ? `${num(fN, 0)} samples/s` : "the Nyquist rate"],
      ["Nyquist interval 1/f_s", fmtTime(interval), "time between samples"],
      ["Bits per sample n_b", `${nb} bits`, `log₂ ${num(L)}${rounded ? ", rounded up" : ""}`],
      ["Bit rate f_s × n_b", withUnit(bitRate, RATE_UNITS, 4), `${num(bitRate, 0)} bps`],
      ["Minimum bandwidth B_min", withUnit(Bmin, FREQ_UNITS, 4), avg ? `n_b × B analog = ${nb} × ${fShow} ${u}` : `c × n_b × 2 × B analog × 1/r`],
      ["SNR_dB = 6.02 n_b + 1.76", `${num(snr, 2)} dB`, "quantization noise only; each extra bit adds about 6 dB"],
    ]);
  }
  Lf.on(() => { const L = Lf.get(); if (L >= 2) Nf.set(num(Math.ceil(log2int(L) - 1e-9))); draw(); });
  Nf.on(() => { const nb = Nf.get(); if (nb >= 1) Lf.set(num(2 ** Math.round(nb), 0).replace(/\s/g, "")); draw(); });
  Ff.on(draw); Cf.on(draw); Rf.on(draw);
  const own = cfg.fmax != null || cfg.levels != null || cfg.bits != null;
  apply(own ? { fmax: cfg.fmax ?? 4, unit: cfg.unit, levels: cfg.levels, bits: cfg.bits, c: cfg.c, r: cfg.r } : { ...presets[labels[0]], c: cfg.c ?? presets[labels[0]].c, r: cfg.r ?? presets[labels[0]].r });
  if (!own) setActive(presetRow, 0);
}

// ---------- widget: pcm-play ----------
// The whole PCM encoder as one pass: each sample is read off the curve, snapped to its zone's midpoint and
// encoded into the bitstream. Uses quantize() above, so every number is the quantizer widget's number.
const paren = (s) => (s.startsWith("−") ? `(${s})` : s);
const smooth = (u) => { const c = clamp(u, 0, 1); return c * c * (3 - 2 * c); };
/** A smooth curve through equally spaced values (uniform Catmull-Rom), as a function of the sample index. */
function curveThrough(vals) {
  const P = (k) => vals[clamp(k, 0, vals.length - 1)];
  return (t) => {
    const k = Math.floor(t), u = t - k, p0 = P(k - 1), p1 = P(k), p2 = P(k + 1), p3 = P(k + 2);
    return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
  };
}
/** Where a sample's normalized value sits: "in" its zone, on the "edge" between two zones, or "out" of range. */
function pcmPlace(Q, r) {
  const rel = r.pam - Q.nmin, j = Math.round(rel);
  if (rel < -1e-9 || rel > Q.nmax - Q.nmin + 1e-9) return "out";
  return Math.abs(rel - j) < 1e-9 && j > 0 && j < Q.nmax - Q.nmin - 1e-9 ? "edge" : "in";
}
/** The four (or fewer) codes offered for sample i: consecutive, containing the right one, not always in the same place. */
function pcmChoices(zone, L, i) {
  const m = Math.min(4, L), lo = clamp(zone - ((i * 2 + 1) % m), 0, L - m);
  return Array.from({ length: m }, (_, k) => lo + k);
}
function pcmPlay(box, cfg) {
  const okRange = Number.isFinite(+cfg.vmin) && Number.isFinite(+cfg.vmax) && +cfg.vmax > +cfg.vmin;
  const vmin = okRange ? +cfg.vmin : -20, vmax = okRange ? +cfg.vmax : 20;
  const raw = typeof cfg.samples === "string" ? cfg.samples : Array.isArray(cfg.samples) ? cfg.samples.join(" ") : "";
  let samples = raw.split(/[\s,;]+/).map(parseFloat).filter(Number.isFinite).slice(0, 12);
  if (!samples.length) samples = SLIDE_SAMPLES.split(" ").map(parseFloat);
  const askWord = cfg.ask === "word", what = askWord ? "encoded word" : "quantization code";
  const L0 = Number.isFinite(+cfg.levels) ? clamp(Math.round(+cfg.levels), 2, 16) : 8;
  let L = L0, Q = quantize(samples, vmin, vmax, L);
  // Predict mode: `answered` samples may be played; the next one waits for the student's code.
  let predict = !!cfg.predict, answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false;
  let pb = null;

  box.append(el("h4", null, cfg.title || "The PCM encoder in one pass: sample, quantize, encode"));
  const Lf = valueField("levels L", L, "number", "zones, 2 to 16");
  const slideBtn = el("button", "viz-btn", `slide example: L = ${L0}`);
  slideBtn.type = "button";
  slideBtn.addEventListener("click", () => { Lf.set(L0); setL(); });
  Lf.row.append(slideBtn);
  const predictLabel = el("label", "playback-check");
  const predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = predict;
  predictLabel.append(predictBox, ` Predict each sample's ${what} before it is shown`);
  const svg = svgEl("svg", { viewBox: "0 0 640 280", class: "curve-svg net-svg", role: "img", "aria-label": "analog signal over the quantization zones, with each sample quantized and its code word added to the bitstream" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  box.append(Lf.row, predictLabel, svg, caption, ask);

  const n = () => Q.rows.length;
  const label = (code) => (askWord ? code.toString(2).padStart(Q.nb, "0") : String(code));
  const volts = (v) => `${num(v * Q.delta, 2)} V`;
  const division = (r) => `${fmtA(r.a)}/${num(Q.delta)} = ${fix2(r.pam)}`;
  const asking = (pos) => predict && answered < n() && Math.abs(pos - answered) < 1e-6;
  /** The rule quoted after a wrong pick: where the picked zone is, and which side of it the sample lies. */
  function whyNot(r, w) {
    const lo = Q.nmin + w, hi = lo + 1;
    const side = Math.abs(r.pam - hi) < 1e-9 ? "is exactly on its top edge, and a value on a boundary line is put in the upper zone"
      : r.pam > hi ? "is above it" : "is below it";
    return `Not ${label(w)}. ${askWord ? `${label(w)} is code ${w}, the zone` : `Code ${w} is the zone`} from ${dLabel(lo)} to ${dLabel(hi)} (${volts(lo)} to ${volts(hi)}), and ${division(r)} ${side}. The code is the number of the zone the normalized value falls in, counted from 0 at the bottom${askWord ? `, written in ${Q.nb} bits` : ""}.`;
  }
  function answer(v, e) {
    asked += wrong == null && !missed ? 1 : 0;
    if (v !== Q.rows[answered].code) { missed = true; wrong = v; refocus = e.detail === 0; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; refocus = e.detail === 0; answered++;
    pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${L}|${answered}|${wrong}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!key) return;
    const r = Q.rows[answered];
    const btns = pcmChoices(r.code, L, answered).map((v) => {
      const b = el("button", "viz-btn" + (v === wrong ? " playback-wrong" : ""), label(v));
      b.type = "button";
      b.setAttribute("aria-label", `${what} ${label(v)}`);
      b.addEventListener("click", (e) => answer(v, e));
      ask.append(b);
      return b;
    });
    if (wrong != null) ask.append(el("span", "playback-feedback", whyNot(r, wrong)));
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function zoneText(r) {
    const place = pcmPlace(Q, r), lo = Q.nmin + r.zone;
    if (place === "edge") return `is exactly on the line between zones ${r.zone - 1} and ${r.zone}; a value on a boundary line is put in the upper zone, so it belongs to zone ${r.zone}`;
    if (place === "out") return `is outside the range ${dLabel(Q.nmin)} to ${dLabel(Q.nmax)}, so it takes the nearest zone, zone ${r.zone}`;
    return `lies between ${dLabel(lo)} and ${dLabel(lo + 1)}, so it belongs to zone ${r.zone}`;
  }
  function frame(pos) {
    const N = n(), PT = 24, PH = clamp(L * 28, 200, 320), PX0 = 104, PX1 = 622, R1 = PT + PH + 19, R2 = R1 + 17, R3 = R2 + 19;
    const span = Q.nmax - Q.nmin, y = (v) => PT + PH - ((clamp(v, Q.nmin, Q.nmax) - Q.nmin) / span) * PH;
    // room is kept on the right of the last sample for its value and error labels
    const dx = (PX1 - PX0 - 108) / Math.max(1, N - 1), x = (t) => PX0 + 26 + t * dx;
    const q = asking(pos), cur = q ? answered : Math.min(N - 1, Math.floor(pos - 1e-9));
    // f is how far the current sample has gone through the encoder; a pending question holds it at "sampled".
    const f = q ? 0.38 : cur < 0 ? 0 : pos - cur;
    const halo = { stroke: "var(--paper-2)", "stroke-width": 4, "paint-order": "stroke" };
    const mono = { "font-family": "ui-monospace, Consolas, monospace" };
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${R3 + 10}`);
    text(svg, 16, 14, "code", { "font-size": 10.5 });
    text(svg, 96, 14, "normalized", { "text-anchor": "end", "font-size": 10.5 });
    const hot = cur >= 0 && f > 0.4 ? Q.rows[cur].zone : -1;
    for (let k = 0; k < L; k++) {
      const top = y(Q.nmin + k + 1), bottom = y(Q.nmin + k);
      svg.append(svgEl("rect", { x: PX0, y: top, width: PX1 - PX0, height: bottom - top, fill: k % 2 ? "var(--blue-soft)" : "var(--hl-soft)" }));
      if (k === hot) svg.append(svgEl("rect", { x: 4, y: top + 1, width: 24, height: bottom - top - 2, rx: 3, fill: "var(--hl)" }));
      text(svg, 16, (top + bottom) / 2 + 4, String(k), { fill: k === hot ? "var(--paper)" : "var(--hl)", "font-size": L > 12 ? 10 : 12, "font-weight": "600" });
      svg.append(svgEl("line", { x1: 6, y1: bottom + 1, x2: 26, y2: bottom + 1, stroke: "var(--rule-strong)" }));
    }
    for (let j = 0; j <= L; j++) text(svg, 96, y(Q.nmin + j) + 4, dLabel(Q.nmin + j), { "text-anchor": "end", "font-size": L > 12 ? 9.5 : 11 });
    const baseV = clamp(0, Q.nmin, Q.nmax), yb = y(baseV);
    for (let i = 0; i < N; i++) svg.append(svgEl("line", { x1: x(i), y1: PT, x2: x(i), y2: PT + PH, stroke: "var(--rule-strong)", "stroke-dasharray": "2 5", opacity: 0.8 }));
    if (hot >= 0) {
      const top = y(Q.nmin + hot + 1), bottom = y(Q.nmin + hot), ym = (top + bottom) / 2;
      svg.append(svgEl("rect", { x: PX0 + 1, y: top + 1, width: PX1 - PX0 - 2, height: bottom - top - 2, fill: "none", stroke: "var(--hl)", "stroke-width": 2 }));
      svg.append(svgEl("line", { x1: PX0, y1: ym, x2: PX1, y2: ym, stroke: "var(--hl)", "stroke-width": 1.4, "stroke-dasharray": "6 4" }));
      // the zone's midpoint, named in the gutter between the two boundary labels
      text(svg, 96, ym + 3.5, fix2(Q.rows[cur].q), { "text-anchor": "end", fill: "var(--hl)", "font-size": L > 12 ? 8.5 : 10, "font-weight": "700" });
    }
    svg.append(svgEl("line", { x1: PX0 - 2, y1: yb, x2: PX1 + 10, y2: yb, stroke: "var(--ink)", "stroke-width": 1.4 }));
    text(svg, PX1 + 14, yb - 5, "Time", { "text-anchor": "end" });
    const sig = curveThrough(Q.rows.map((r) => clamp(r.pam, Q.nmin, Q.nmax)));
    const t0 = -26 / dx, t1 = N - 1 + 82 / dx, pts = [];
    for (let k = 0; k <= 260; k++) { const t = t0 + ((t1 - t0) * k) / 260; pts.push([x(t), y(sig(t))]); }
    svg.append(polyline(pts, "var(--ink-2)", 1.7));
    for (const [yy, s] of [[R1, "sample (V)"], [R2, "code"], [R3, "bitstream"]]) text(svg, 96, yy, s, { "text-anchor": "end", "font-size": 10.5 });
    svg.append(svgEl("rect", { x: PX0, y: R3 - 13, width: PX1 - PX0, height: 18, rx: 3, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    const wordAttrs = { fill: "var(--ink)", "font-size": Q.nb > 3 ? 11 : 12.5, "font-weight": "600", ...mono };
    const gap = (i, yTo, color = "var(--red)") => {
      const r = Q.rows[i], py = y(r.pam);
      if (Math.abs(py - yTo) > 0.6) svg.append(svgEl("line", { x1: x(i), y1: py, x2: x(i), y2: yTo, stroke: color, "stroke-width": 2.4 }));
      svg.append(svgEl("circle", { cx: x(i), cy: py, r: 3, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.3 }));
    };
    // Samples already through the encoder: a stem to the quantized value, the actual value as a ring, the error as the red gap.
    for (let i = 0; i < Math.min(cur, N); i++) {
      const r = Q.rows[i], qy = y(r.q);
      svg.append(svgEl("line", { x1: x(i), y1: yb, x2: x(i), y2: qy, stroke: "var(--blue)", "stroke-width": 2.2 }));
      gap(i, qy);
      svg.append(svgEl("circle", { cx: x(i), cy: qy, r: 4.5, fill: "var(--blue)" }));
      text(svg, x(i), R1, fmtA(r.a), { fill: "var(--ink-2)", "font-size": 10.5 });
      text(svg, x(i), R2, String(r.code), { fill: "var(--hl)", "font-size": 11.5, "font-weight": "600" });
      text(svg, x(i), R3, r.word, wordAttrs);
    }
    if (cur >= 0 && cur < N) {
      const r = Q.rows[cur], cx = x(cur), py = y(r.pam), qy = y(r.q);
      const side = { "text-anchor": "start", "font-size": 11.5, "font-weight": "600", ...halo }, lx = cx + 9;
      if (f < 0.2) {
        // (a) the signal runs on to the sampling instant
        const t = cur - (cur === 0 ? -t0 : 1) * (1 - smooth(f / 0.2));
        svg.append(svgEl("circle", { cx: x(t), cy: y(sig(t)), r: 5, fill: "var(--hl)" }));
      } else {
        const s = smooth((f - 0.2) / 0.16), m = smooth((f - 0.44) / 0.2), dotY = py + (qy - py) * m;
        svg.append(svgEl("line", { x1: cx, y1: PT, x2: cx, y2: PT + PH, stroke: "var(--hl)", "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
        svg.append(svgEl("line", { x1: cx, y1: yb, x2: cx, y2: m > 0 ? dotY : yb + (py - yb) * s, stroke: "var(--blue)", "stroke-width": 2.6 }));
        if (m > 0) gap(cur, dotY);
        svg.append(svgEl("circle", { cx, cy: dotY, r: 5.2, fill: m > 0 ? "var(--blue)" : "var(--hl)" }));
        if (m < 1) text(svg, lx, py + (r.pam >= baseV ? -7 : 15), `${fmtA(r.a)} V`, { fill: "var(--ink)", ...side });
        else text(svg, lx, (py + qy) / 2 + 4, `error ${signed2(r.err)}`, { fill: "var(--red)", ...side });
        text(svg, cx, R1, fmtA(r.a), { fill: "var(--ink)", "font-size": 10.5, "font-weight": "600" });
        if (f >= 0.7) {
          // (c) the code is emitted and its word drops into the bitstream
          const c = smooth((f - 0.74) / 0.2);
          text(svg, cx, R2, String(r.code), { fill: "var(--hl)", "font-size": 11.5, "font-weight": "600" });
          if (c < 1) svg.append(svgEl("rect", { x: cx - 19, y: qy + (R3 - qy) * c - 13, width: 38, height: 18, rx: 3, fill: "var(--hl)" }));
          text(svg, cx, qy + (R3 - qy) * c, r.word, { ...wordAttrs, fill: c < 1 ? "var(--paper)" : "var(--hl)" });
        }
      }
    }
    let msg;
    if (q) {
      const r = Q.rows[answered];
      msg = `Sample ${answered + 1} is ${fmtA(r.a)} V, and ${division(r)}. Which ${what} does it get?`;
    } else if (cur < 0) {
      msg = `Press Play to send the ${N} samples through the PCM encoder one at a time: sampling, quantizing, encoding. Here L = ${L} zones, each of height Δ = ${num(Q.delta)} V.`;
    } else {
      const r = Q.rows[cur], k = cur + 1;
      if (f < 0.4) msg = `Sample ${k}, sampling: at the sampling instant the signal is ${fmtA(r.a)} V. Normalized PAM value = ${division(r)}.`;
      else if (f < 0.7) msg = `Sample ${k}, quantizing: ${fix2(r.pam)} ${zoneText(r)}. It is approximated by the midpoint of the zone, ${fix2(r.q)}. Normalized error = ${fix2(r.q)} − ${paren(fix2(r.pam))} = ${signed2(r.err)}.`;
      else msg = `Sample ${k}, encoding: actual value ${fmtA(r.a)} V, zone ${r.zone}, quantized value ${fix2(r.q)} (${volts(r.q)}), error ${signed2(r.err)}. Quantization code ${r.code} is the ${Q.nb}-bit encoded word ${r.word}.`;
      if (pos >= N) {
        msg += ` All ${N} samples are encoded: the bitstream is ${Q.rows.map((s) => s.word).join(" ")}, ${N} × ${Q.nb} = ${N * Q.nb} bits at n_b = ${Q.nb} bit${Q.nb === 1 ? "" : "s"} per sample.`;
        if (asked > 0) msg += ` ${firstTry} of ${asked} right on the first try.`;
      }
    }
    if (caption.textContent !== msg) caption.textContent = msg;
    renderAsk(pos);
  }
  function restart() {
    Q = quantize(samples, vmin, vmax, L);
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    const e = log2int(L);
    note.textContent = `Δ = (V_max − V_min)/L = (${num(vmax)} − ${paren(num(vmin))})/${L} = ${num(Q.delta)} V. n_b = log₂ ${L} = ${Number.isInteger(e) ? Q.nb : `${num(e, 2)}, rounded up to ${Q.nb}`} bit${Q.nb === 1 ? "" : "s"} per sample, codes 0 to ${L - 1} from the bottom zone up. The ring is the actual sample, the dot its quantized value, and the red gap the error (quantized − PAM), never more than half a zone.`;
    pb.reset(n());
  }
  function setL() {
    const v = Lf.get();
    if (!(Number.isInteger(v) && v >= 2 && v <= 16)) { pb.pause(); note.textContent = "Enter a whole number of levels L from 2 to 16."; return; }
    L = v; restart();
  }
  pb = createPlayback({
    count: n(), unit: "sample", onFrame: frame,
    stepMs: () => cfg.stepMs || 3200,
    limit: () => (predict ? answered : n()),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, note);
  Lf.on(setL);
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    // Samples already on screen count as answered; the questions start at the next one.
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  restart();
}

// ---------- widget: shift-keying ----------
const SK = {
  ask: { name: "ASK", r: 1, slide: "10110", digital: "unipolar", box: ["r = 1", "S = N", "B = (1 + d)S"], humps: 1, varies: "amplitude", constant: "frequency and phase", hw: "a multiplier fed by an oscillator at f_c",
    note: "Binary ASK (OOK): the peak amplitude is 0 for one level and the carrier's peak amplitude for the other. Modulation produces a nonperiodic composite signal whose bandwidth is proportional to the signal rate." },
  fsk: { name: "FSK", r: 1, slide: "10110", digital: "unipolar", box: ["r = 1", "S = N", "B = (1 + d)S + 2Δf"], humps: 2, varies: "frequency", constant: "peak amplitude and phase", hw: "a voltage-controlled oscillator (VCO)",
    note: "Binary FSK: two carrier frequencies, f₁ for a 0 and f₂ for a 1. Each is Δf from the midpoint between the two bands, so the two frequencies are 2Δf apart and the bandwidth is larger than ASK's by 2Δf." },
  psk: { name: "PSK", r: 1, slide: "10110", digital: "polar", box: ["r = 1", "S = N", "B = (1 + d)S"], humps: 1, varies: "phase", constant: "peak amplitude and frequency", hw: "a multiplier fed by an oscillator at f_c, with a polar NRZ input",
    note: "Binary PSK: phases 0° and 180° (the slide draws the 1 bits as the carrier and the 0 bits inverted). Same bandwidth as BASK, less than BFSK. More common than ASK or FSK because noise can change the amplitude easier than it can change the phase." },
  qam: { name: "8-QAM", r: 3, slide: "101100001000010011110111", digital: "symbols", box: ["r = 3", "S = N/3", "B = (1 + d)S"], humps: 1, varies: "amplitude and phase", constant: "frequency", hw: "two carriers, in-phase and quadrature, 90° apart",
    note: "8-QAM combines ASK and PSK: 3 bits per signal element, so 24 bits take 8 baud, as in the slide's waveform. Here the last bit picks the amplitude (1 V or 3 V) and the first two pick one of four phases. Same minimum bandwidth as ASK and PSK." },
};
function shiftKeying(box, cfg) {
  const all = Object.keys(SK);
  const schemes = (Array.isArray(cfg.schemes) ? cfg.schemes : ["ask", "fsk", "psk"]).filter((s) => SK[s]);
  if (!schemes.length) schemes.push("ask", "fsk", "psk");
  let scheme = schemes.includes(cfg.scheme) ? cfg.scheme : schemes[0];
  const valid = (s, sc) => (sc === "qam" ? /^[01]{3,24}$/.test(s) && s.length % 3 === 0 : /^[01]{2,10}$/.test(s));
  let bits = valid(cfg.bits || "", scheme) ? cfg.bits : SK[scheme].slide;
  let cycles = clamp(Math.round(cfg.cycles ?? 3), 1, 8);

  box.append(el("h4", null, cfg.title || "Shift keying: a carrier changed by the digital data"));
  if (schemes.length > 1) box.append(btnRow(schemes.map((s) => SK[s].name), (i) => { scheme = schemes[i]; if (!valid(bits, scheme)) { bits = SK[scheme].slide; input.value = bits; } draw(); }, schemes.indexOf(scheme)));
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "text"; input.value = bits; input.maxLength = 24; input.inputMode = "numeric"; input.spellcheck = false;
  input.setAttribute("aria-label", "bits to modulate");
  input.style.width = "240px"; input.style.maxWidth = "100%";
  const slideBtn = el("button", "viz-btn", "slide figure");
  slideBtn.addEventListener("click", () => { bits = SK[scheme].slide; input.value = bits; draw(); });
  row.append(el("label", null, "bits"), input, slideBtn);
  const sC = slider("Carrier cycles per element", 1, 8, 1, cycles, (v) => { cycles = v; draw(); }, (v) => `${v}`);
  const svg = svgEl("svg", { viewBox: "0 0 640 262", class: "curve-svg net-svg", role: "img", "aria-label": "digital signal, carrier and modulated signal" });
  const spec = svgEl("svg", { viewBox: "0 0 640 168", class: "curve-svg net-svg", role: "img", "aria-label": "bandwidth box and spectrum sketch" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(row, sC.row, svg, spec, out, note);

  function draw() {
    svg.innerHTML = ""; spec.innerHTML = "";
    const S = SK[scheme], per = S.r, nE = bits.length / per;
    const X0 = 40, X1 = 626, bw = (X1 - X0) / nE;
    const rows = [["Digital signal", 46, 16], ["Carrier signal", 122, 26], ["Modulated signal", 212, 36]];
    for (let i = 0; i <= nE; i++) svg.append(svgEl("line", { x1: X0 + i * bw, y1: 14, x2: X0 + i * bw, y2: 254, stroke: "var(--rule-strong)", "stroke-dasharray": "3 4" }));
    for (let i = 0; i < nE; i++) text(svg, X0 + (i + 0.5) * bw, 11, bits.slice(i * per, (i + 1) * per), { fill: "var(--hl)", "font-size": 13, "font-weight": "600" });
    for (const [label, yc, amp] of rows) {
      arrowAxis(svg, X0 - 8, yc, X1 + 12, yc);
      svg.append(svgEl("text", { x: X0 + 4, y: yc - amp - 3, "font-size": 11.5, fill: "var(--ink)", stroke: "var(--paper-2)", "stroke-width": 4, "paint-order": "stroke" }, label));
    }
    // digital signal
    const [, dy, da] = rows[0];
    const dpts = [];
    for (let i = 0; i < nE; i++) {
      const sym = bits.slice(i * per, (i + 1) * per);
      const lvl = S.digital === "polar" ? (sym === "1" ? 1 : -1) : S.digital === "symbols" ? (parseInt(sym, 2) / 7) * 2 - 1 : sym === "1" ? 1 : 0;
      dpts.push([X0 + i * bw, dy - lvl * da], [X0 + (i + 1) * bw, dy - lvl * da]);
    }
    svg.append(polyline(dpts, "var(--ink-2)", 2.2));
    if (S.digital === "polar") { text(svg, X0 - 10, dy - da + 4, "+V", { "text-anchor": "end" }); text(svg, X0 - 10, dy + da + 4, "−V", { "text-anchor": "end" }); }
    else if (S.digital === "unipolar") { text(svg, X0 - 10, dy - da + 4, "1", { "text-anchor": "end" }); text(svg, X0 - 10, dy + 4, "0", { "text-anchor": "end" }); }
    else text(svg, X0 - 10, dy + 4, "0…7", { "text-anchor": "end", "font-size": 9.5 });
    // carrier
    const [, cy, ca] = rows[1];
    const cpts = [];
    const STEPS = Math.max(600, nE * cycles * 40);
    for (let k = 0; k <= STEPS; k++) { const t = (nE * k) / STEPS; cpts.push([X0 + t * bw, cy - ca * Math.sin(2 * Math.PI * cycles * t)]); }
    svg.append(polyline(cpts, "var(--ink-2)", 1.6));
    text(svg, X1 + 6, cy - ca - 4, "f_c", { "text-anchor": "end" });
    // modulated
    const [, my, ma] = rows[2];
    for (let i = 0; i < nE; i++) {
      const sym = bits.slice(i * per, (i + 1) * per), one = sym === "1";
      const pts = [], n = Math.max(80, cycles * 50);
      for (let k = 0; k <= n; k++) {
        const t = i + k / n, ph = 2 * Math.PI * cycles * t;
        let v;
        if (scheme === "ask") v = one ? Math.sin(ph) : 0;
        else if (scheme === "fsk") v = Math.sin(2 * Math.PI * (one ? 2 * cycles : cycles) * t);
        else if (scheme === "psk") v = one ? Math.sin(ph) : -Math.sin(ph);
        else { const amp = sym[2] === "1" ? 1 : 1 / 3, phase = Math.PI / 4 + (Math.PI / 2) * parseInt(sym.slice(0, 2), 2); v = amp * Math.sin(ph + phase); }
        pts.push([X0 + t * bw, my - ma * v]);
      }
      svg.append(polyline(pts, scheme === "psk" && !one ? "var(--ink-dim)" : "var(--blue)", 2.2));
    }
    if (scheme === "fsk") { text(svg, X0 - 10, my - 10, "f₂: 1", { "text-anchor": "end", "font-size": 10 }); text(svg, X0 - 10, my + 14, "f₁: 0", { "text-anchor": "end", "font-size": 10 }); }
    text(svg, (X0 + X1) / 2, 260, `${nE} signal element${nE === 1 ? "" : "s"} in 1 s · bit rate ${bits.length} bps · baud rate ${nE} baud`, { "font-size": 11 });
    // bandwidth box
    spec.append(svgEl("rect", { x: 0.5, y: 0.5, width: 639, height: 167, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    spec.append(svgEl("rect", { x: 0.5, y: 0.5, width: 639, height: 32, fill: "var(--hl-soft)", stroke: "var(--hl)" }));
    S.box.forEach((s, i) => text(spec, [90, 250, 470][i], 21, s, { fill: "var(--ink)", "font-size": 13, "font-weight": "600" }));
    const base = 120;
    arrowAxis(spec, 60, base, 610, base);
    arrowAxis(spec, 60, base, 60, 42);
    text(spec, 60, base + 13, "0", {}); text(spec, 50, base + 4, "0", { "text-anchor": "end" });
    if (S.humps === 1) {
      hump(spec, 335, base, 200, 50);
      bracket(spec, 235, 435, 54, "Bandwidth B");
      spec.append(svgEl("line", { x1: 335, y1: base - 4, x2: 335, y2: base + 4, stroke: "var(--ink)" }));
      text(spec, 335, base + 15, "f_c", { fill: "var(--ink)" });
      text(spec, 540, base - 6, "carrier frequency", { "font-size": 10 });
    } else {
      hump(spec, 230, base, 130, 42); hump(spec, 440, base, 130, 42);
      bracket(spec, 165, 295, 68, "S(1 + d)"); bracket(spec, 375, 505, 68, "S(1 + d)");
      bracket(spec, 165, 505, 50, "B = S(1 + d) + 2Δf");
      for (const [x, l] of [[230, "f₁"], [440, "f₂"]]) { spec.append(svgEl("line", { x1: x, y1: base - 4, x2: x, y2: base + 4, stroke: "var(--ink)" })); text(spec, x, base + 14, l, { fill: "var(--ink)" }); }
      spec.append(svgEl("line", { x1: 230, y1: base + 26, x2: 440, y2: base + 26, stroke: "var(--ink-dim)" }));
      for (const x of [230, 440]) spec.append(svgEl("line", { x1: x, y1: base + 22, x2: x, y2: base + 30, stroke: "var(--ink-dim)" }));
      text(spec, 335, base + 40, "2Δf: each frequency is Δf from the midpoint", { fill: "var(--ink)", "font-size": 11 });
    }
    grid(out, [
      ["Bit rate N", `${bits.length} bps`, "these bits sent in 1 s"],
      ["Bits per signal element r", String(per), per === 1 ? "one bit per element" : `log₂ 8 = 3 for 8-QAM`],
      ["Baud rate S = N/r", `${num(nE)} baud`, `${nE} signal element${nE === 1 ? "" : "s"}`],
      ["Minimum bandwidth", S.box[2], "d is a factor between 0 and 1; the slide leaves it undefined"],
      ["Varies", S.varies, `constant: ${S.constant}`],
      ["Implementation", S.hw, ""],
    ]);
    note.textContent = S.note;
  }
  input.addEventListener("input", () => {
    const v = input.value.replace(/[^01]/g, "");
    if (valid(v, scheme)) { bits = v; draw(); } else note.textContent = scheme === "qam" ? "Type 3 to 24 bits, a multiple of 3, 0s and 1s only." : "Type 2 to 10 bits, 0s and 1s only.";
  });
  draw();
}

// ---------- widget: constellation ----------
const D = Math.SQRT1_2;
const CONST_PRESETS = {
  "OOK": { title: "Example 1: binary ASK (OOK)", prompt: "binary ASK (OOK): 0 at the origin, 1 on the I axis at the carrier's peak amplitude", pts: [[0, 0, "0"], [1, 0, "1"]],
    note: "Binary ASK uses only an in-phase carrier, so both points are on the I (X) axis. Binary 0 has an amplitude of 0 V, at the origin; binary 1 has an amplitude more than zero." },
  "ASK 1 V and 3 V": { title: "Example 2: binary ASK with 1 V and 3 V", prompt: "binary ASK with peak amplitudes 1 V and 3 V", pts: [[1, 0, "1 V"], [3, 0, "3 V"]],
    note: "Two amplitudes, both at phase 0°: the points sit on the positive I axis at 1 V and 3 V from the origin." },
  "BPSK": { title: "Example 3: BPSK", prompt: "BPSK with 1 V elements at 0° and 180°", pts: [[-1, 0, "0"], [1, 0, "1"]],
    note: "BPSK also uses only an in-phase carrier: two elements of amplitude 1 V, one in phase (1, at 0°) and one 180° out of phase (0, on the negative I axis)." },
  "BPSK 2 V": { title: "Example 4: BPSK with 2 V", prompt: "BPSK with a peak amplitude of 2 V", pts: [[-2, 0, "2 V"], [2, 0, "2 V"]],
    note: "Both points are 2 V from the origin: +2 V at phase 0° and −2 V at phase 180°." },
  "8-QAM 1 V and 3 V": { title: "Example 5: 8-QAM with 1 V and 3 V on four phases", prompt: "8-QAM with two peak amplitudes, 1 V and 3 V, and four phases", snap: "polar",
    pts: [[D, D, "1 V"], [-D, D, "1 V"], [-D, -D, "1 V"], [D, -D, "1 V"], [3 * D, 3 * D, "3 V"], [-3 * D, 3 * D, "3 V"], [-3 * D, -3 * D, "3 V"], [3 * D, -3 * D, "3 V"]],
    note: "Eight points on the four diagonals (45°, 135°, 225°, 315°): an inner one at 1 V and an outer one at 3 V on each. 8 points carry log₂ 8 = 3 bits per signal element. In draw mode the grid snaps to 1 V of amplitude and 45° of phase for this preset." },
  "4-QAM a": { title: "Slide 36 a: 4-QAM", prompt: "the 4-QAM of slide 36 a: a square with one corner at the origin (each carrier 0 or 2 V)", pts: [[0, 0], [2, 0], [0, 2], [2, 2]],
    note: "Unipolar on both carriers: each of I and Q is 0 or 2 V, so one point is at the origin and the square sits in the first quadrant." },
  "4-QAM b": { title: "Slide 36 b: 4-QAM", prompt: "the 4-QAM of slide 36 b: a square centred on the origin, one point per quadrant (±2 V, ±2 V)", pts: [[2, 2], [-2, 2], [-2, -2], [2, -2]],
    note: "Polar on both carriers: one point in each quadrant, all with the same amplitude and four different phases." },
  "4-QAM c": { title: "Slide 36 c: 4-QAM", prompt: "the 4-QAM of slide 36 c: a small square entirely inside the first quadrant (I = 2 or 3 V, Q = 1 or 2 V)", pts: [[2, 1], [3, 1], [2, 2], [3, 2]],
    note: "All four points in the first quadrant, away from the axes: two amplitudes of I and two of Q, every point with a different amplitude and phase." },
  "16-QAM": { title: "Example 6: 16-QAM", prompt: "16-QAM: four I values and four Q values (±A, ±3A) with the slide's 4-bit labels", unit: "A",
    pts: [[-3, 3, "0010"], [-1, 3, "0011"], [1, 3, "0001"], [3, 3, "0000"], [-3, 1, "0110"], [-1, 1, "0111"], [1, 1, "0101"], [3, 1, "0100"], [-3, -1, "1110"], [-1, -1, "1111"], [1, -1, "1101"], [3, -1, "1100"], [-3, -3, "1010"], [-1, -3, "1011"], [1, -3, "1001"], [3, -3, "1000"]],
    note: "The distance A from the point to the origin is the amplitude after modulation and the angle φ is the phase. 16 points carry log₂ 16 = 4 bits per signal element." },
};
function constellation(box, cfg) {
  const names = Object.keys(CONST_PRESETS);
  const shown = (Array.isArray(cfg.presets) ? cfg.presets : names).filter((n) => CONST_PRESETS[n]);
  if (!shown.length) shown.push(...names);
  const drawMode = !!cfg.draw && !cfg.solve;
  const solve = cfg.solve && typeof cfg.solve === "object" ? cfg.solve : null;
  let name = CONST_PRESETS[cfg.preset] ? cfg.preset : shown.includes("8-QAM 1 V and 3 V") && cfg.preset == null && !drawMode ? "8-QAM 1 V and 3 V" : shown[0];
  let placed = [], selected = -1, checked = false, revealed = false;

  box.append(el("h4", null, cfg.title || (solve ? "A constellation point from its amplitude and I component (E05 4)" : drawMode ? "Draw the constellation diagram" : "Constellation diagrams: amplitude is the length, phase is the angle")));
  const presetRow = solve ? null : btnRow(shown.map((n) => (drawMode ? `Draw: ${n}` : n)), (i) => { name = shown[i]; restart(); }, shown.indexOf(name));
  const svg = svgEl("svg", { viewBox: "0 0 640 360", class: "curve-svg net-svg", role: "img", "aria-label": "constellation diagram with I and Q axes" });
  const hi = svgEl("g");
  const { ctl, verdict } = checkRow(() => { checked = true; render(); }, () => { revealed = true; checked = true; placed = CONST_PRESETS[name].pts.map((p) => [p[0], p[1]]); render(); }, restart);
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  if (presetRow) box.append(presetRow);
  box.append(svg);
  if (drawMode) box.append(ctl);
  box.append(steps, out, note);

  const amp = (x, y) => Math.hypot(x, y);
  const phase = (x, y) => { if (amp(x, y) < 1e-9) return 0; let d = (Math.atan2(y, x) * 180) / Math.PI; if (d < 0) d += 360; return d; };
  const unitOf = () => (solve ? "V" : CONST_PRESETS[name].unit || "V");
  const fmtV = (v) => (unitOf() === "A" ? `${num(v, 2)}A` : `${num(v, 2)} V`);
  let geo = null;
  function restart() { placed = []; selected = -1; checked = false; revealed = false; verdict.textContent = ""; render(); }
  function scene(pts, R) {
    svg.innerHTML = "";
    const CX = 320, CY = 180, s = 150 / R;
    geo = { CX, CY, s, R };
    const X = (i) => CX + i * s, Y = (q) => CY - q * s;
    for (let v = -Math.floor(R); v <= Math.floor(R); v++) {
      if (v === 0) continue;
      svg.append(svgEl("line", { x1: X(v), y1: Y(-R), x2: X(v), y2: Y(R), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      svg.append(svgEl("line", { x1: X(-R), y1: Y(v), x2: X(R), y2: Y(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
    }
    arrowAxis(svg, X(-R) - 6, CY, X(R) + 10, CY, "var(--ink-2)");
    arrowAxis(svg, CX, Y(-R) + 6, CX, Y(R) - 10, "var(--ink-2)");
    text(svg, X(R) + 16, CY + 4, "I (in-phase carrier)", { "text-anchor": "start", fill: "var(--ink)" });
    text(svg, CX + 8, Y(R) - 2, "Q (quadrature carrier)", { "text-anchor": "start", fill: "var(--ink)" });
    const unit = unitOf();
    for (let v = -Math.floor(R); v <= Math.floor(R); v++) {
      if (v === 0 || (unit === "A" && v % 2 === 0)) continue;
      const lab = unit === "A" ? (v === 1 ? "A" : v === -1 ? "−A" : `${num(v)}A`) : num(v);
      svg.append(svgEl("line", { x1: X(v), y1: CY - 3, x2: X(v), y2: CY + 3, stroke: "var(--ink-2)" }));
      svg.append(svgEl("line", { x1: CX - 3, y1: Y(v), x2: CX + 3, y2: Y(v), stroke: "var(--ink-2)" }));
      text(svg, X(v), CY + 14, lab, { "font-size": 10 });
      text(svg, CX - 6, Y(v) + 3.5, lab, { "font-size": 10, "text-anchor": "end" });
    }
    svg.append(hi);
    return { X, Y };
  }
  function highlight(i, q, label, colorLine = "var(--hl)") {
    hi.innerHTML = "";
    if (!geo) return;
    const { CX, CY, s } = geo, x = CX + i * s, y = CY - q * s;
    if (amp(i, q) > 1e-9) {
      hi.append(svgEl("line", { x1: CX, y1: CY, x2: x, y2: y, stroke: colorLine, "stroke-width": 1.6, "stroke-dasharray": "5 4" }));
      hi.append(svgEl("line", { x1: x, y1: CY, x2: x, y2: y, stroke: "var(--ink-dim)", "stroke-width": 1, "stroke-dasharray": "2 3" }));
      hi.append(svgEl("line", { x1: CX, y1: y, x2: x, y2: y, stroke: "var(--ink-dim)", "stroke-width": 1, "stroke-dasharray": "2 3" }));
      const ph = phase(i, q), r = Math.min(26, amp(i, q) * s * 0.6), a1 = (-ph * Math.PI) / 180;
      const ex = CX + r * Math.cos(a1), ey = CY + r * Math.sin(a1);
      hi.append(svgEl("path", { d: `M ${CX + r} ${CY} A ${r} ${r} 0 ${ph > 180 ? 1 : 0} 0 ${ex} ${ey}`, fill: "none", stroke: colorLine, "stroke-width": 1.4 }));
      const mid = (-ph / 2 * Math.PI) / 180;
      hi.append(svgEl("text", { x: CX + (r + 12) * Math.cos(mid), y: CY + (r + 12) * Math.sin(mid) + 4, "font-size": 11, fill: colorLine, "text-anchor": "middle" }, "φ"));
    }
    hi.append(svgEl("circle", { cx: x, cy: y, r: 9, fill: "none", stroke: colorLine, "stroke-width": 2 }));
    if (label) hi.append(svgEl("text", { x: x + 12, y: y - 10, "font-size": 11.5, fill: colorLine, "text-anchor": "start", "font-weight": "600" }, label));
  }
  function inspector(i, q, bitsLabel, n) {
    const rows = [["Points n", String(n), `log₂ ${n} = ${num(Math.log2(n), 2)} bits per signal element`]];
    if (i == null) rows.push(["Selected point", "none", "hover or click a point"]);
    else {
      rows.push(["Selected point", `I = ${fmtV(i)}, Q = ${fmtV(q)}`, bitsLabel ? `label: ${bitsLabel}` : "no label on the slide"]);
      rows.push(["Amplitude √(I² + Q²)", fmtV(amp(i, q)), `√(${num(i * i, 2)} + ${num(q * q, 2)})`]);
      rows.push(["Phase atan2(Q, I)", `${num(phase(i, q), 2)}°`, "measured counterclockwise from the I axis"]);
    }
    grid(out, rows);
  }
  function pointNode(X, Y, x, y, color, onSelect, label) {
    const c = svgEl("circle", { cx: X(x), cy: Y(y), r: 6.5, fill: color, stroke: "var(--paper)", "stroke-width": 1.5, tabindex: 0, role: "button", style: "cursor:pointer", "aria-label": label });
    c.addEventListener("pointerenter", onSelect); c.addEventListener("focus", onSelect);
    c.addEventListener("click", (e) => { e.stopPropagation(); onSelect(e, true); });
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(e, true); } });
    return c;
  }
  function render() {
    hi.innerHTML = ""; steps.innerHTML = "";
    if (solve) {
      const A = +solve.amplitude, I = +solve.i, n = +solve.points || 16;
      if (!(A > 0) || !(Math.abs(I) <= A)) { note.textContent = "The amplitude must be positive and at least the I component."; out.innerHTML = ""; return; }
      const q = Math.sqrt(A * A - I * I), R = Math.ceil(A) + 1;
      const { X, Y } = scene([], R);
      svg.append(svgEl("line", { x1: X(0), y1: Y(0), x2: X(I), y2: Y(q), stroke: "var(--hl)", "stroke-width": 2.2 }));
      svg.append(svgEl("line", { x1: X(0), y1: Y(0) + 0.5, x2: X(I), y2: Y(0) + 0.5, stroke: "var(--blue)", "stroke-width": 3 }));
      svg.append(svgEl("line", { x1: X(I), y1: Y(0), x2: X(I), y2: Y(q), stroke: "var(--green)", "stroke-width": 3 }));
      svg.append(svgEl("path", { d: `M ${X(I) - 10} ${Y(0)} L ${X(I) - 10} ${Y(0) - 10} L ${X(I)} ${Y(0) - 10}`, fill: "none", stroke: "var(--ink-dim)" }));
      svg.append(svgEl("circle", { cx: X(I), cy: Y(q), r: 6.5, fill: "var(--hl)" }));
      text(svg, (X(0) + X(I)) / 2, Y(0) + 26, `I = ${num(I)} V`, { fill: "var(--blue)", "font-size": 12, "font-weight": "600" });
      text(svg, X(I) + 10, (Y(0) + Y(q)) / 2 + 4, `Q = ${num(q)} V`, { fill: "var(--green)", "font-size": 12, "font-weight": "600", "text-anchor": "start" });
      text(svg, (X(0) + X(I)) / 2 - 16, (Y(0) + Y(q)) / 2 - 8, `amplitude ${num(A)} V`, { fill: "var(--hl)", "font-size": 12, "font-weight": "600", "text-anchor": "end" });
      const ph = phase(I, q), r = 28;
      svg.append(svgEl("path", { d: `M ${X(0) + r} ${Y(0)} A ${r} ${r} 0 0 0 ${X(0) + r * Math.cos((ph * Math.PI) / 180)} ${Y(0) - r * Math.sin((ph * Math.PI) / 180)}`, fill: "none", stroke: "var(--ink-2)" }));
      text(svg, X(0) + 40, Y(0) - 10, "φ", { fill: "var(--ink-2)" });
      steps.innerHTML = [
        `Number of bits per point = log${sub(2)} ${n} = <b>${num(Math.log2(n), 2)}</b>`,
        `amplitude² = I² + Q² (the length of the point's line is the hypotenuse)`,
        `${num(A)}² = ${num(I)}² + Q² → Q² = ${num(A * A)} − ${num(I * I)} = ${num(A * A - I * I)}`,
        `Q = √${num(A * A - I * I)} = <b>${num(q)} V</b>`,
      ].join("<br>");
      grid(out, [
        ["Points n", String(n), `log₂ ${n} = ${num(Math.log2(n), 2)} bits per signal element`],
        ["Amplitude", `${num(A)} V`, "the distance from the origin"],
        ["In-phase component I", `${num(I)} V`, "the X coordinate"],
        ["Quadrature component Q", `${num(q)} V`, `√(${num(A)}² − ${num(I)}²)`],
        ["Phase", `${num(ph, 2)}°`, `atan2(${num(q)}, ${num(I)})`],
      ]);
      note.textContent = "E05 4: the amplitude of a constellation point is the length of the line from the origin, so Pythagoras links it to the amplitudes of the in-phase and quadrature carriers.";
      return;
    }
    const P = CONST_PRESETS[name], pts = P.pts, n = pts.length;
    const R = Math.max(2, Math.ceil(Math.max(...pts.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1])))) + 1), ...(drawMode ? placed.map((p) => Math.ceil(Math.max(Math.abs(p[0]), Math.abs(p[1])) + 1)) : []));
    const { X, Y } = scene(pts, R);
    const sel = (x, y, label) => { highlight(x, y); inspector(x, y, label, drawMode ? Math.max(placed.length, 1) : n); };
    if (!drawMode) {
      pts.forEach((p, k) => {
        svg.append(pointNode(X, Y, p[0], p[1], "var(--blue)", () => { selected = k; sel(p[0], p[1], p[2]); }, `point ${k + 1}: I ${fmtV(p[0])}, Q ${fmtV(p[1])}${p[2] ? `, ${p[2]}` : ""}`));
        if (p[2]) svg.append(svgEl("text", { x: X(p[0]) + (p[0] < 0 ? -10 : 10), y: Y(p[1]) + (p[1] < 0 ? 18 : -10), "font-size": 11.5, fill: "var(--ink)", "text-anchor": p[0] < 0 ? "end" : "start" }, p[2]));
      });
      svg.append(hi);
      text(svg, 320, 352, P.title, { fill: "var(--ink)", "font-size": 12 });
      if (selected >= 0 && selected < n) sel(pts[selected][0], pts[selected][1], pts[selected][2]); else inspector(null, null, null, n);
      note.textContent = `${P.note} Each dot is one signal element type; its length from the origin is the amplitude and its angle is the phase.`;
      return;
    }
    // draw mode
    const match = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.05;
    let wrong = 0;
    placed.forEach((p, k) => {
      const ok = pts.some((e) => match(e, p));
      if (checked && !ok) wrong++;
      const color = checked ? (ok ? "var(--green)" : "var(--red)") : "var(--blue)";
      svg.append(pointNode(X, Y, p[0], p[1], color, (e, sticky) => { if (sticky) { placed.splice(k, 1); checked = false; verdict.textContent = ""; render(); } else sel(p[0], p[1], null); }, `placed point ${k + 1}: I ${fmtV(p[0])}, Q ${fmtV(p[1])}; activate to remove`));
    });
    if (revealed) pts.forEach((p) => { if (p[2]) svg.append(svgEl("text", { x: X(p[0]) + (p[0] < 0 ? -10 : 10), y: Y(p[1]) + (p[1] < 0 ? 18 : -10), "font-size": 11.5, fill: "var(--ink)", "text-anchor": p[0] < 0 ? "end" : "start" }, p[2])); });
    svg.append(hi);
    const missing = pts.filter((e) => !placed.some((p) => match(e, p))).length;
    text(svg, 320, 352, `Draw: ${P.prompt}`, { fill: "var(--ink)", "font-size": 12 });
    if (checked) verdict.textContent = revealed ? "The slide's diagram." : wrong === 0 && missing === 0 ? `Correct: all ${n} points match the slide.` : `${wrong} misplaced (red), ${missing} missing of ${n}.`;
    inspector(null, null, null, Math.max(placed.length, 1));
    grid(out, [
      ["Points placed", String(placed.length), placed.length ? `log₂ ${placed.length} = ${num(Math.log2(placed.length), 2)} bits per element` : "click the grid to place a point; click a point to remove it"],
      ["Snap", P.snap === "polar" ? "1 V amplitude, 45° phase" : "1 V grid", "the slide's points lie on this grid"],
    ]);
    note.textContent = `Place the points for ${P.prompt}. Check marks misplaced points red; nothing is revealed until Reveal.`;
  }
  svg.addEventListener("click", (e) => {
    if (!drawMode || !geo || revealed) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM(); if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    let i = (p.x - geo.CX) / geo.s, q = (geo.CY - p.y) / geo.s;
    if (Math.abs(i) > geo.R + 0.3 || Math.abs(q) > geo.R + 0.3) return;
    if (CONST_PRESETS[name].snap === "polar") {
      const a = Math.max(1, Math.round(amp(i, q))), ph = (Math.round(phase(i, q) / 45) * 45 * Math.PI) / 180;
      i = a * Math.cos(ph); q = a * Math.sin(ph);
    } else { i = Math.round(i); q = Math.round(q); }
    if (placed.length >= 64) return;
    if (!placed.some((e) => Math.hypot(e[0] - i, e[1] - q) < 0.05)) { placed.push([i, q]); checked = false; verdict.textContent = ""; render(); }
  });
  svg.addEventListener("pointerleave", () => { if (!drawMode && selected < 0) { hi.innerHTML = ""; } });
  restart();
}

// ---------- widget: analog-mod ----------
const AMOD = {
  am: { name: "AM", formula: "B_AM = 2B", varies: "amplitude", constant: "frequency and phase", note: "AM: the carrier's amplitude varies with the changing amplitudes of the modulating signal (the dashed envelope); its frequency and phase remain the same. The bandwidth of the modulated signal is twice the bandwidth of the modulating signal, centred on the carrier frequency." },
  fm: { name: "FM", formula: "B_FM = 2(1 + β)B", varies: "frequency", constant: "peak amplitude and phase", note: "FM: the carrier's frequency follows the changing voltage level (amplitude) of the modulating signal: denser where the modulating signal is high, sparser where it is low. Peak amplitude and phase remain constant." },
  pm: { name: "PM", formula: "no formula on the slide", varies: "phase", constant: "peak amplitude and frequency", note: "PM: the carrier's phase follows the changing voltage level (amplitude) of the modulating signal; compare with the unmodulated carrier drawn faintly behind it. Peak amplitude and frequency remain fixed. The slide gives no bandwidth formula for PM." },
};
const AMOD_PRESETS = {
  "AM radio": { mode: "am", B: 5, unit: "kHz", guard: 0 },
  "FM radio": { mode: "fm", B: 15, unit: "kHz", beta: 4, guard: 50 },
};
function analogMod(box, cfg) {
  const modes = Object.keys(AMOD);
  let mode = AMOD[cfg.mode] ? cfg.mode : "am";
  let a = 0.8, fm = 2, fc = 20, beta = clamp(+cfg.beta >= 0 ? +cfg.beta : 4, 0, 10);
  box.append(el("h4", null, cfg.title || "Analog-to-analog modulation: AM, FM and PM"));
  const presetRow = btnRow(Object.keys(AMOD_PRESETS), (i) => apply(AMOD_PRESETS[Object.keys(AMOD_PRESETS)[i]]), -1);
  const modeRow = btnRow(modes.map((m) => AMOD[m].name), (i) => { mode = modes[i]; setActive(presetRow, -1); draw(); }, modes.indexOf(mode));
  const sA = slider("Modulating amplitude", 0.2, 1, 0.1, a, (v) => { a = v; draw(); }, (v) => num(v, 1));
  const sM = slider("Modulating cycles shown", 1, 4, 0.5, fm, (v) => { fm = v; draw(); }, (v) => num(v, 1));
  const sC = slider("Carrier cycles shown", 8, 40, 1, fc, (v) => { fc = v; draw(); }, (v) => String(v));
  const sB = slider("Modulation index β (FM)", 0, 10, 0.5, beta, (v) => { beta = v; setActive(presetRow, -1); draw(); }, (v) => num(v, 1));
  const Bf = unitField("modulating bandwidth B", FREQ_UNITS, cfg.B ?? 5, FREQ_UNITS.some(([u]) => u === cfg.unit) ? cfg.unit : "kHz");
  const Gf = valueField("guard band", cfg.guard ?? 0, "number", "in the unit of B; FM radio adds 50 kHz");
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg net-svg", role: "img", "aria-label": "modulating signal, carrier and modulated signal" });
  const spec = svgEl("svg", { viewBox: "0 0 640 130", class: "curve-svg net-svg", role: "img", "aria-label": "bandwidth box" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(presetRow, modeRow, sA.row, sM.row, sC.row, svg, Bf.row, sB.row, Gf.row, spec, steps, out, note);

  function apply(p) {
    mode = p.mode; setActive(modeRow, modes.indexOf(mode));
    Bf.setRaw(p.B, p.unit); Gf.set(p.guard ?? 0);
    if (p.beta != null) { beta = p.beta; sB.set(beta); }
    draw();
  }
  function draw() {
    svg.innerHTML = ""; spec.innerHTML = "";
    const X0 = 36, X1 = 626, N = 1200;
    const rows = [["Modulating signal", 44, 26], ["Carrier frequency", 124, 26], [`${AMOD[mode].name} signal (modulated)`, 230, 52]];
    for (const [label, yc, amp] of rows) {
      arrowAxis(svg, X0 - 6, yc, X1 + 10, yc);
      svg.append(svgEl("text", { x: X0 + 2, y: yc - amp - 4, "font-size": 11.5, fill: "var(--ink)" }, label));
      text(svg, X1 + 12, yc + amp + 12, "Time", { "text-anchor": "end" });
    }
    const m = (t) => a * Math.sin(2 * Math.PI * fm * t);
    const carrier = (t) => Math.sin(2 * Math.PI * fc * t);
    const x = (t) => X0 + t * (X1 - X0);
    const mp = [], cp = [], sp = [], e1 = [], e2 = [], gp = [];
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      mp.push([x(t), rows[0][1] - rows[0][2] * m(t)]);
      cp.push([x(t), rows[1][1] - rows[1][2] * carrier(t)]);
      let s;
      if (mode === "am") { const env = (1 + m(t)) / (1 + a); s = env * carrier(t); e1.push([x(t), rows[2][1] - rows[2][2] * env]); e2.push([x(t), rows[2][1] + rows[2][2] * env]); }
      else if (mode === "fm") { const dev = 0.5 * fc; s = Math.sin(2 * Math.PI * fc * t - ((dev * a) / fm) * Math.cos(2 * Math.PI * fm * t) + (dev * a) / fm); }
      else s = Math.sin(2 * Math.PI * fc * t + Math.PI * m(t));
      sp.push([x(t), rows[2][1] - rows[2][2] * s]);
      gp.push([x(t), rows[2][1] - rows[2][2] * carrier(t)]);
    }
    svg.append(polyline(mp, "var(--ink-2)", 2));
    svg.append(polyline(cp, "var(--ink-2)", 1.5));
    if (mode !== "am") svg.append(polyline(gp, "var(--ink-dim)", 1, 0.35));
    if (mode === "am") for (const e of [e1, e2]) { const d = polyline(e, "var(--ink-dim)", 1.3); d.setAttribute("stroke-dasharray", "5 4"); svg.append(d); }
    svg.append(polyline(sp, "var(--blue)", 1.8));
    if (mode === "fm") {
      const tHi = 0.25 / fm, tLo = 0.75 / fm;
      text(svg, x(tHi), rows[2][1] + rows[2][2] + 14, "higher frequency", { fill: "var(--blue)" });
      text(svg, x(tLo), rows[2][1] + rows[2][2] + 14, "lower frequency", { fill: "var(--blue)" });
    } else if (mode === "pm") text(svg, (X0 + X1) / 2, rows[2][1] + rows[2][2] + 14, "faint: the unmodulated carrier, for the phase shift", {});
    else text(svg, (X0 + X1) / 2, rows[2][1] + rows[2][2] + 14, "dashed: the envelope follows the modulating signal", {});
    // bandwidth box
    const B = Bf.get(), u = Bf.unit(), fac = Bf.factor(), guard = Number.isFinite(Gf.get()) ? Gf.get() * fac : 0;
    sB.row.style.display = mode === "fm" ? "" : "none";
    Gf.row.style.display = mode === "fm" ? "" : "none";
    spec.append(svgEl("rect", { x: 0.5, y: 0.5, width: 639, height: 129, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    spec.append(svgEl("rect", { x: 0.5, y: 0.5, width: 639, height: 30, fill: "var(--hl-soft)", stroke: "var(--hl)" }));
    const base = 112;
    if (!(B > 0)) { steps.textContent = "Enter a modulating bandwidth B greater than 0."; out.innerHTML = ""; return; }
    const Bshow = `${num(B / fac)} ${u}`;
    let Bmod = NaN, formula = AMOD[mode].formula;
    if (mode === "am") {
      Bmod = 2 * B;
      text(spec, 320, 20, `B_AM = 2B = 2 × ${Bshow} = ${num(Bmod / fac)} ${u}`, { fill: "var(--ink)", "font-size": 13, "font-weight": "600" });
      arrowAxis(spec, 60, base, 610, base); arrowAxis(spec, 60, base, 60, 40);
      hump(spec, 335, base, 220, 50); bracket(spec, 225, 445, 50, "B_AM = 2B");
      text(spec, 335, base + 14, "f_c", { fill: "var(--ink)" }); text(spec, 60, base + 14, "0", {});
      steps.innerHTML = `B${sub("AM")} = 2B = 2 × ${Bshow} = <b>${num(Bmod / fac)} ${u}</b>`;
    } else if (mode === "fm") {
      Bmod = 2 * (1 + beta) * B;
      text(spec, 320, 20, `B_FM = 2(1 + β)B = 2 × (1 + ${num(beta, 1)}) × ${Bshow} = ${num(Bmod / fac)} ${u}`, { fill: "var(--ink)", "font-size": 13, "font-weight": "600" });
      arrowAxis(spec, 60, base, 610, base); arrowAxis(spec, 60, base, 60, 40);
      const w = clamp(90 + 22 * beta, 90, 340);
      hump(spec, 335, base, w, 50); bracket(spec, 335 - w / 2, 335 + w / 2, 50, "B_FM = 2(1 + β)B");
      text(spec, 335, base + 14, "f_c", { fill: "var(--ink)" }); text(spec, 60, base + 14, "0", {});
      steps.innerHTML = `B${sub("FM")} = 2(1 + β)B = 2 × (1 + ${num(beta, 1)}) × ${Bshow} = <b>${num(Bmod / fac)} ${u}</b>` + (guard > 0 ? `<br>+ guard band ${num(guard / fac)} ${u} = <b>${num((Bmod + guard) / fac)} ${u}</b> per station` : "");
    } else {
      text(spec, 320, 20, "PM: no bandwidth formula on the slide", { fill: "var(--ink)", "font-size": 13, "font-weight": "600" });
      text(spec, 320, 76, "The slide states only what varies (phase) and what is fixed (peak amplitude and frequency).", { "font-size": 11.5 });
      steps.textContent = "The slide gives no bandwidth formula for PM.";
    }
    const total = Bmod + (mode === "fm" ? guard : 0);
    const rows2 = [
      ["Modulating bandwidth B", Bshow, mode === "am" ? "speech and music: usually 5 kHz" : mode === "fm" ? "stereo audio: almost 15 kHz" : "the analog signal's bandwidth"],
      ["Modulated bandwidth", Number.isFinite(Bmod) ? `${num(Bmod / fac)} ${u}` : "—", formula],
    ];
    if (mode === "fm") rows2.push(["Per station with guard band", `${num(total / fac)} ${u}`, guard > 0 ? `${num(Bmod / fac)} + ${num(guard / fac)} ${u}; stations at least this far apart` : "no guard band added"]);
    if (mode === "am") rows2.push(["Carrier spacing", `at least ${num(Bmod / fac)} ${u}`, "to avoid interference between stations"]);
    rows2.push(["Varies", AMOD[mode].varies, `constant: ${AMOD[mode].constant}`]);
    grid(out, rows2);
    note.textContent = AMOD[mode].note + (mode === "am" && Math.abs(B - 5e3) < 1 ? " The FCC allows 10 kHz for each AM station; carriers must be separated by at least 10 kHz." : mode === "fm" && Math.abs(B - 15e3) < 1 && Math.abs(beta - 4) < 1e-9 ? " The FCC allows 200 kHz for each FM station: β = 4 with an extra 50 kHz guard band; stations must be separated by at least 200 kHz." : "");
  }
  Bf.on(() => { setActive(presetRow, -1); draw(); }); Gf.on(draw);
  const preset = Object.entries(AMOD_PRESETS).find(([, p]) => p.mode === mode && cfg.B == null);
  if (preset && !cfg.beta && !cfg.guard) { apply(preset[1]); setActive(presetRow, Object.keys(AMOD_PRESETS).indexOf(preset[0])); }
  else draw();
}

export const WIDGETS = {
  "sampler": sampler,
  "quantizer": quantizer,
  "pcm-calc": pcmCalc,
  "pcm-play": pcmPlay,
  "shift-keying": shiftKeying,
  "constellation": constellation,
  "analog-mod": analogMod,
};
