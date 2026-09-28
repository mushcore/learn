// Interactive data-communications widgets for COMP 3721 Week 3 (Lecture 03): a digital signal
// through a low-pass or bandpass channel, decibels, signal-to-noise ratio, the Nyquist and Shannon
// data rate limits, the bandwidth-delay product, parallel and serial transmission.
import { el, slider, btnRow, fmtNum } from "./dom.js";

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

const POWER_UNITS = [["pW", 1e-12], ["nW", 1e-9], ["μW", 1e-6], ["mW", 1e-3], ["W", 1], ["kW", 1e3]];
const FREQ_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9]];
const RATE_UNITS = [["bps", 1], ["kbps", 1e3], ["Mbps", 1e6], ["Gbps", 1e9]];
/** Picks the prefix that keeps the mantissa in [1, 1000). units: [[label, factor], ...] sorted ascending. */
function bestUnit(value, units) {
  const v = Math.abs(value);
  if (!(v > 0) || !Number.isFinite(v)) return units.find((u) => u[1] === 1) || units[0];
  let best = units[0];
  for (const u of units) if (v / u[1] >= 1) best = u;
  return best;
}
/** Display form of a number: up to d decimals, thin-space digit groups from 10 000 up, a real minus sign. */
function num(v, d = 4) {
  if (v === Infinity) return "∞";
  if (v === -Infinity) return "−∞";
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  const [int, frac] = String(Number(Math.abs(r).toFixed(d))).split(".");
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : int;
  return (r < 0 ? "−" : "") + grouped + (frac ? "." + frac : "");
}
function withUnit(value, units, d = 4) {
  if (!Number.isFinite(value)) return num(value);
  const u = bestUnit(value, units);
  return `${num(value / u[1], d)} ${u[0]}`;
}
function numberInput(label, value) {
  const input = document.createElement("input");
  input.type = "number"; input.step = "any"; input.value = value ?? "";
  input.setAttribute("aria-label", label);
  return input;
}
/** A labelled number with a unit selector. get() is in base units (NaN when empty). */
function unitField(label, units, value, unit) {
  const row = el("div", "unit-row");
  const input = numberInput(label, value);
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", `${label} unit`);
  for (const [u] of units) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === unit) o.selected = true; sel.append(o); }
  row.append(el("label", null, label), input, sel);
  const factor = () => units.find(([u]) => u === sel.value)[1];
  return {
    row, input, sel,
    get: () => parseFloat(input.value) * factor(),
    set: (base) => { const u = bestUnit(base, units); sel.value = u[0]; input.value = fmtNum(base / u[1], 4); },
    setRaw: (v, u) => { input.value = v ?? ""; if (u) sel.value = u; },
    text: () => `${num(parseFloat(input.value), 6)} ${sel.value}`,
    on: (fn) => { input.addEventListener("input", fn); sel.addEventListener("change", fn); },
  };
}
function numField(label, value, suffix) {
  const row = el("div", "unit-row");
  const input = numberInput(label, value);
  row.append(el("label", null, label), input);
  if (suffix) row.append(el("span", "stat-label", suffix));
  return { row, input, get: () => parseFloat(input.value), set: (v) => { input.value = v; }, on: (fn) => input.addEventListener("input", fn) };
}
const sup = (s) => `<sup>${s}</sup>`;
const sub = (s) => `<sub>${s}</sub>`;

// ---------- widget: channel-filter ----------
// One period of an 8-bit pattern is analysed into harmonics; the channel keeps the harmonics inside
// its passband and the received signal is rebuilt from those alone.
const CF_N = 2048, CF_BITS = 8, CF_F1 = 10, CF_FMAX = 30;
const CF_COS = new Float64Array(CF_N), CF_SIN = new Float64Array(CF_N);
for (let i = 0; i < CF_N; i++) { CF_COS[i] = Math.cos((2 * Math.PI * i) / CF_N); CF_SIN[i] = Math.sin((2 * Math.PI * i) / CF_N); }
/** Harmonics 0..kHi of one period x: x(i) = a[0] + Σ a[k] cos(2πki/N) + b[k] sin(2πki/N). */
function harmonics(x, kHi) {
  const a = new Float64Array(kHi + 1), b = new Float64Array(kHi + 1);
  for (let k = 0; k <= kHi; k++) {
    let sa = 0, sb = 0;
    for (let i = 0; i < CF_N; i++) { const j = (k * i) % CF_N; sa += x[i] * CF_COS[j]; sb += x[i] * CF_SIN[j]; }
    a[k] = ((k === 0 ? 1 : 2) * sa) / CF_N;
    b[k] = k === 0 ? 0 : (2 * sb) / CF_N;
  }
  return { a, b };
}
function rebuild(h, kLo, kHi) {
  const y = new Float64Array(CF_N);
  for (let k = kLo; k <= kHi; k++) {
    const ak = h.a[k], bk = h.b[k];
    for (let i = 0; i < CF_N; i++) { const j = (k * i) % CF_N; y[i] += ak * CF_COS[j] + bk * CF_SIN[j]; }
  }
  return y;
}
const CF_MODES = {
  lowpass: "Baseband, low-pass channel",
  bandpass: "Baseband, bandpass channel",
  modulated: "Broadband (modulation), bandpass channel",
};
const CF_PATTERNS = ["01100010", "01010101", "00010000"];
const CF_NOTES = {
  lowpass: "Baseband: the digital signal goes onto the channel unchanged. A wider channel passes more of its frequencies, so the received shape is closer to the one sent. Double the bit rate and the same shape needs double the bandwidth.",
  bandpass: "The bandwidth of this channel does not start from zero, so the low frequencies that carry most of a digital signal never arrive. The digital signal cannot be sent directly to a bandpass channel.",
  modulated: "Broadband: a converter changes the digital signal to an analog signal inside the band the channel passes, and a second converter changes it back at the receiving end. The converter is a modem (modulator/demodulator).",
};
function channelFilter(box, cfg) {
  const modes = (Array.isArray(cfg.modes) ? cfg.modes : Object.keys(CF_MODES)).filter((m) => CF_MODES[m]);
  if (!modes.length) modes.push("lowpass");
  let mode = modes.includes(cfg.mode) ? cfg.mode : modes[0];
  let R = clamp(Math.round(cfg.rate ?? 2), 1, 8);
  let B = clamp(cfg.bandwidth ?? 4, 0.5, 16);
  let bits = /^[01]{8}$/.test(cfg.bits || "") ? cfg.bits : CF_PATTERNS[0];
  box.append(el("h4", null, cfg.title || "A digital signal through a channel of limited bandwidth"));
  if (modes.length > 1) box.append(btnRow(modes.map((m) => CF_MODES[m]), (i) => { mode = modes[i]; draw(); }, modes.indexOf(mode)));
  const patterns = CF_PATTERNS.includes(bits) ? CF_PATTERNS : [bits, ...CF_PATTERNS];
  box.append(btnRow(patterns.map((p) => p.split("").join(" ")), (i) => { bits = patterns[i]; draw(); }, patterns.indexOf(bits)));
  const sR = slider("Bit rate", 1, 8, 1, R, (v) => { R = v; draw(); }, (v) => `${v} bps`);
  const sB = slider("Channel bandwidth", 0.5, 16, 0.5, B, (v) => { B = v; draw(); }, (v) => `${fmtNum(v, 1)} Hz`);
  const tSvg = svgEl("svg", { viewBox: "0 0 640 236", class: "curve-svg net-svg" });
  const cSvg = svgEl("svg", { viewBox: "0 0 640 120", class: "curve-svg net-svg" });
  const fSvg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg" });
  const sentRow = el("div", "sorted-line"), readRow = el("div", "sorted-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sR.row, sB.row, tSvg, cSvg, fSvg, sentRow, readRow, out, note);

  function bitRow(row, label, values, ref) {
    row.innerHTML = "";
    row.append(el("span", "stat-label", label));
    values.forEach((b, i) => row.append(el("span", "sorted-val" + (ref && ref[i] !== b ? " out" : ""), String(b))));
  }
  function draw() {
    const f0 = R / CF_BITS; // the 8-bit pattern repeats, so its harmonics are multiples of R/8
    const per = CF_N / CF_BITS;
    const x = new Float64Array(CF_N);
    for (let i = 0; i < CF_N; i++) x[i] = bits[Math.floor(i / per)] === "1" ? 1 : 0;
    const f1 = mode === "lowpass" ? 0 : CF_F1, f2 = f1 + B;
    const kLo = Math.ceil(f1 / f0 - 1e-9), kHi = Math.floor(f2 / f0 + 1e-9), kPlot = Math.floor(CF_FMAX / f0 + 1e-9);
    let carrierK = 0, onLine = x;
    if (mode === "modulated") {
      carrierK = Math.round((f1 + B / 2) / f0);
      onLine = new Float64Array(CF_N);
      for (let i = 0; i < CF_N; i++) onLine[i] = x[i] * CF_SIN[(carrierK * i) % CF_N];
    }
    const spec = harmonics(onLine, kPlot);
    const passed = rebuild(spec, kLo, kHi);
    let received = passed;
    if (mode === "modulated") {
      const z = new Float64Array(CF_N);
      for (let i = 0; i < CF_N; i++) z[i] = 2 * passed[i] * CF_SIN[(carrierK * i) % CF_N];
      const kBase = Math.floor(B / 2 / f0 + 1e-9);
      received = rebuild(harmonics(z, kBase), 0, kBase);
    }
    const sent = bits.split("").map(Number);
    // The receiver samples the middle of each bit; a value sitting on the 0 | 1 line cannot be read.
    const got = sent.map((_, j) => { const v = received[Math.floor((j + 0.5) * per)]; return Math.abs(v - 0.5) < 0.02 ? "?" : v > 0.5 ? 1 : 0; });
    const ok = got.filter((b, j) => b === sent[j]).length;

    // time domain: what was sent and what arrives
    const X0 = 50, X1 = 610, YB = 176, YT = 76;
    const xOf = (i) => X0 + ((X1 - X0) * i) / CF_N;
    const yOf = (v) => clamp(YB - v * (YB - YT), 22, 214);
    tSvg.innerHTML = "";
    for (let j = 0; j <= CF_BITS; j++) {
      const xx = X0 + ((X1 - X0) * j) / CF_BITS;
      tSvg.append(svgEl("line", { x1: xx, y1: 22, x2: xx, y2: 214, stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      tSvg.append(svgEl("text", { x: xx, y: 228, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, `${fmtNum(j / R, 3)} s`));
      if (j < CF_BITS) tSvg.append(svgEl("text", { x: xx + (X1 - X0) / CF_BITS / 2, y: 16, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)", "font-weight": "600" }, bits[j]));
    }
    tSvg.append(svgEl("line", { x1: X0, y1: yOf(0.5), x2: X1, y2: yOf(0.5), stroke: "var(--ink-dim)", "stroke-dasharray": "6 5", opacity: 0.6 }));
    tSvg.append(svgEl("text", { x: X0 - 6, y: yOf(0.5) + 3, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, "0 | 1"));
    tSvg.append(svgEl("text", { x: X0 - 6, y: yOf(1) + 3, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "1 V"));
    tSvg.append(svgEl("text", { x: X0 - 6, y: yOf(0) + 3, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "0 V"));
    const step = [];
    for (let j = 0; j < CF_BITS; j++) step.push([xOf(j * per), yOf(sent[j])], [xOf((j + 1) * per), yOf(sent[j])]);
    tSvg.append(polyline(step, "var(--ink-dim)", 1.5, 0.8));
    const curve = [];
    for (let i = 0; i < CF_N; i += 2) curve.push([xOf(i), yOf(received[i])]);
    curve.push([xOf(CF_N), yOf(received[0])]);
    tSvg.append(polyline(curve, "var(--blue)", 2.4));
    tSvg.append(svgEl("text", { x: X1, y: 36, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "grey: sent · blue: received"));

    // the analog signal on the channel (modulation only)
    cSvg.style.display = mode === "modulated" ? "" : "none";
    cSvg.innerHTML = "";
    if (mode === "modulated") {
      const mid = 62, s = 40;
      cSvg.append(svgEl("line", { x1: X0, y1: mid, x2: X1, y2: mid, stroke: "var(--rule-strong)" }));
      const pts = [];
      for (let i = 0; i < CF_N; i++) pts.push([xOf(i), clamp(mid - passed[i] * s, 4, 116)]);
      cSvg.append(polyline(pts, "var(--purple)", 1.3));
      cSvg.append(svgEl("text", { x: X1, y: 114, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "analog signal on the bandpass channel"));
    }

    // frequency domain: what is sent against what the channel passes
    fSvg.innerHTML = "";
    const FY = 112, FH = 84;
    const fx = (f) => X0 + ((X1 - X0) * f) / CF_FMAX;
    fSvg.append(svgEl("rect", { x: fx(f1), y: FY - FH - 6, width: fx(f2) - fx(f1), height: FH + 6, fill: "var(--green-soft)", stroke: "var(--green)", "stroke-width": 1 }));
    fSvg.append(svgEl("text", { x: clamp((fx(f1) + fx(f2)) / 2, X0 + 70, X1 - 70), y: 14, "text-anchor": "middle", "font-size": 10, fill: "var(--green)" }, `channel passes ${num(f1, 1)} to ${num(f2, 1)} Hz`));
    fSvg.append(svgEl("line", { x1: X0, y1: FY, x2: X1, y2: FY, stroke: "var(--rule-strong)" }));
    fSvg.append(svgEl("line", { x1: X0, y1: 20, x2: X0, y2: FY, stroke: "var(--rule-strong)" }));
    for (let f = 0; f <= CF_FMAX; f += 5) fSvg.append(svgEl("text", { x: fx(f), y: FY + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, String(f)));
    fSvg.append(svgEl("text", { x: X1, y: FY + 30, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "frequency (Hz) of the signal put on the channel"));
    const mags = [];
    for (let k = 0; k <= kPlot; k++) mags.push(k === 0 ? Math.abs(spec.a[0]) : Math.hypot(spec.a[k], spec.b[k]));
    const top = Math.max(...mags) || 1;
    mags.forEach((m, k) => {
      if (m / top < 0.01) return;
      const inside = k >= kLo && k <= kHi;
      fSvg.append(svgEl("line", { x1: fx(k * f0), y1: FY, x2: fx(k * f0), y2: FY - (m / top) * FH, stroke: inside ? "var(--blue)" : "var(--ink-dim)", "stroke-width": 1.6, opacity: inside ? 1 : 0.45 }));
    });

    bitRow(sentRow, "sent", sent);
    bitRow(readRow, "read", got, sent);
    grid(out, [
      ["Bit rate", `${R} bps`, `one bit lasts ${num(1 / R, 3)} s`],
      ["Channel", `${num(f1, 1)} to ${num(f2, 1)} Hz`, mode === "lowpass" ? "low-pass: the lowest frequency is zero" : "bandpass: the bandwidth does not start from zero"],
      ["Channel bandwidth", `${num(B, 1)} Hz`, `${num(B / R, 2)} Hz for each bit per second`],
      ["Bits read correctly", `${ok} of ${CF_BITS}`, ok === CF_BITS ? "every bit is on the right side of the 0 | 1 line" : got.includes("?") ? "? marks a bit whose received signal sits on the 0 | 1 line at its middle" : "a bit is misread when the received signal is on the wrong side of the 0 | 1 line at its middle"],
    ]);
    note.textContent = CF_NOTES[mode];
  }
  draw();
}

// ---------- widget: decibel ----------
const chirp = (u) => Math.sin(2 * Math.PI * (1.6 * u + 1.9 * u * u));
function decibel(box, cfg) {
  box.append(el("h4", null, cfg.title || "Decibels: one signal measured at two points"));
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : {
    "Power halved (slide)": { p1: 10, p1Unit: "mW", p2: 5, p2Unit: "mW" },
    "Amplified 10 times": { p1: 1, p1Unit: "mW", p2: 10, p2Unit: "mW" },
    "Cable: −0.5 dB/km for 4 km": { p1: 4, p1Unit: "mW", perKm: -0.5, km: 4 },
  };
  const labels = Object.keys(presets);
  const P1 = unitField("power at point 1", POWER_UNITS, 10, "mW");
  const P2 = unitField("power at point 2", POWER_UNITS, 5, "mW");
  const DB = numField("decibels", "", "dB");
  const cable = el("div", "unit-row");
  const perKm = numberInput("cable loss in dB per km", ""), km = numberInput("cable length in km", "");
  cable.append(el("label", null, "cable"), perKm, el("span", "stat-label", "dB/km  ×"), km, el("span", "stat-label", "km"));
  const svg = svgEl("svg", { viewBox: "0 0 640 210", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "Type a power at point 2 to get the decibels, or type the decibels (or a cable loss per km and a length) to get the power at point 2. Decibels are negative when the signal is attenuated and positive when it is amplified.");
  box.append(btnRow(labels, (i) => apply(presets[labels[i]]), -1), P1.row, P2.row, DB.row, cable, svg, steps, out, note);

  let last = "p2"; // which of P2 / dB the user set; the other one is computed
  function apply(p) {
    P1.setRaw(p.p1 ?? 10, p.p1Unit || "mW");
    perKm.value = p.perKm ?? ""; km.value = p.km ?? "";
    if (p.perKm != null && p.km != null) { DB.set(fmtNum(p.perKm * p.km, 4)); last = "db"; }
    else if (p.db != null) { DB.set(p.db); last = "db"; }
    else { P2.setRaw(p.p2 ?? 5, p.p2Unit || p.p1Unit || "mW"); last = "p2"; }
    draw();
  }
  function wave(cx, amp, color) {
    const pts = [];
    for (let i = 0; i <= 120; i++) pts.push([cx - 60 + i, 88 - amp * chirp(i / 120)]);
    svg.append(svgEl("line", { x1: cx - 66, y1: 88, x2: cx + 66, y2: 88, stroke: "var(--rule-strong)" }));
    svg.append(polyline(pts, color, 2.2));
  }
  const stop = (msg) => { svg.style.display = "none"; steps.textContent = msg; };
  function draw() {
    svg.innerHTML = ""; out.innerHTML = "";
    const p1 = P1.get();
    if (!(p1 > 0)) return stop("Enter a power greater than 0 at point 1.");
    let p2, db;
    if (last === "db") {
      db = DB.get();
      if (!Number.isFinite(db)) return stop("Enter a decibel value, or a power at point 2.");
      p2 = p1 * 10 ** (db / 10);
      P2.set(p2);
    } else {
      p2 = P2.get();
      if (!(p2 > 0)) return stop("Enter a power greater than 0 at point 2.");
      db = 10 * Math.log10(p2 / p1);
      DB.set(fmtNum(db, 4));
    }
    svg.style.display = "";
    const ratio = p2 / p1, vr = Math.sqrt(ratio);
    const gain = db > 1e-9, loss = db < -1e-9;
    // Wave heights follow the voltage ratio; the larger one is drawn at 58 px.
    const a1 = vr > 1 ? 58 / vr : 58, a2 = vr > 1 ? 58 : 58 * vr;
    wave(110, Math.max(a1, 1.5), "var(--blue)");
    wave(530, Math.max(a2, 1.5), gain ? "var(--green)" : loss ? "var(--red)" : "var(--blue)");
    svg.append(svgEl("line", { x1: 110, y1: 176, x2: 530, y2: 176, stroke: "var(--ink-2)", "stroke-width": 3 }));
    for (const [x, name, p] of [[110, "Point 1", p1], [530, "Point 2", p2]]) {
      svg.append(svgEl("line", { x1: x, y1: 152, x2: x, y2: 170, stroke: "var(--ink-dim)", "stroke-dasharray": "3 3" }));
      svg.append(svgEl("rect", { x: x - 5, y: 171, width: 10, height: 10, fill: "var(--ink-2)" }));
      svg.append(svgEl("text", { x, y: 198, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, `${name}: ${withUnit(p, POWER_UNITS)}`));
    }
    if (gain) {
      svg.append(svgEl("polygon", { points: "290,150 290,202 350,176", fill: "var(--hl)", stroke: "var(--hl-ink)" }));
      svg.append(svgEl("text", { x: 320, y: 142, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, "amplifier"));
    } else svg.append(svgEl("text", { x: 320, y: 168, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, "transmission medium"));
    svg.append(svgEl("text", { x: 320, y: 60, "text-anchor": "middle", "font-size": 18, fill: gain ? "var(--green)" : loss ? "var(--red)" : "var(--ink)", "font-weight": "600" }, `${gain ? "+" : ""}${num(db, 2)} dB`));
    svg.append(svgEl("text", { x: 320, y: 80, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, gain ? "amplified" : loss ? "attenuated" : "unchanged"));

    const lines = [];
    const lk = parseFloat(perKm.value), d = parseFloat(km.value);
    if (last === "db") {
      if (Number.isFinite(lk) && Number.isFinite(d)) lines.push(`cable: ${num(d)} km × (${num(lk)} dB/km) = <b>${num(db)} dB</b>`);
      lines.push(`P${sub(2)} = P${sub(1)} × 10${sup("dB/10")} = ${P1.text()} × 10${sup(num(db / 10))} = ${P1.text()} × ${num(ratio)} = <b>${withUnit(p2, POWER_UNITS)}</b>`);
    } else {
      lines.push(`dB = 10 log${sub(10)}(P${sub(2)} / P${sub(1)}) = 10 log${sub(10)}(${withUnit(p2, POWER_UNITS)} / ${withUnit(p1, POWER_UNITS)}) = 10 log${sub(10)} ${num(ratio)} = 10 × (${num(Math.log10(ratio))}) = <b>${num(db, 2)} dB</b>`);
    }
    steps.innerHTML = lines.join("<br>");
    grid(out, [
      ["P₂ / P₁", num(ratio), ratio > 1 ? `${num(ratio, 2)} times the power at point 1` : `${num(ratio * 100, 2)}% of the power at point 1`],
      ["Decibels", `${gain ? "+" : ""}${num(db, 2)} dB`, gain ? "positive: the signal is amplified" : loss ? "negative: the signal is attenuated" : "0 dB: the same power at both points"],
      ["V₂ / V₁", num(vr), `20 log₁₀ ${num(vr)} = ${num(20 * Math.log10(vr), 2)} dB, the same value`],
    ]);
  }
  const typed = (which) => () => { last = which; perKm.value = ""; km.value = ""; draw(); };
  P1.on(draw);
  P2.on(typed("p2"));
  DB.on(typed("db"));
  const fromCable = () => {
    const lk = parseFloat(perKm.value), d = parseFloat(km.value);
    if (!Number.isFinite(lk) || !Number.isFinite(d)) return;
    DB.set(fmtNum(lk * d, 4)); last = "db"; draw();
  };
  perKm.addEventListener("input", fromCable); km.addEventListener("input", fromCable);
  apply(cfg.p1 != null || cfg.db != null || cfg.perKm != null ? cfg : presets[labels[0]]);
}

// ---------- widget: snr-noise ----------
const SNR_PTS = 240;
function unitRms(values) {
  const rms = Math.sqrt(values.reduce((s, v) => s + v * v, 0) / values.length) || 1;
  return values.map((v) => v / rms);
}
const SNR_SIGNAL = unitRms(Array.from({ length: SNR_PTS + 1 }, (_, i) => { const u = i / SNR_PTS; return Math.sin(2 * Math.PI * 2 * u) + 0.5 * Math.sin(2 * Math.PI * 5 * u + 0.8); }));
const SNR_NOISE = (() => {
  // Fixed seed: the same noise shape on every draw, so only its size changes with the SNR.
  let s = 3721;
  const rnd = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const comps = Array.from({ length: 28 }, () => ({ f: 8 + 52 * rnd(), p: 2 * Math.PI * rnd(), a: 0.4 + rnd() }));
  return unitRms(Array.from({ length: SNR_PTS + 1 }, (_, i) => comps.reduce((v, c) => v + c.a * Math.sin(2 * Math.PI * c.f * (i / SNR_PTS) + c.p), 0)));
})();
function snrNoise(box, cfg) {
  box.append(el("h4", null, cfg.title || "Signal-to-noise ratio: one signal under more or less noise"));
  const multi = cfg.sources != null;
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : {
    "Slide example: 10 mW and 1 μW": { signal: 10, signalUnit: "mW", noise: 1, noiseUnit: "μW" },
    "Noise a tenth of the signal": { signal: 10, signalUnit: "mW", noise: 1, noiseUnit: "mW" },
    "Noise equal to the signal": { signal: 10, signalUnit: "mW", noise: 10, noiseUnit: "mW" },
    "Noiseless channel": { signal: 10, signalUnit: "mW", noise: 0, noiseUnit: "μW" },
  };
  const labels = Object.keys(presets);
  const S = unitField("signal power", POWER_UNITS, 10, "mW");
  const N = unitField(multi ? "noise per device" : "noise power", POWER_UNITS, 1, "μW");
  const K = multi ? numField("devices", cfg.sources) : null;
  const sl = slider("SNR in decibels", -10, 60, 1, 40, (v) => {
    const ps = S.get();
    if (!(ps > 0)) return;
    N.set(ps / 10 ** (v / 10) / count());
    draw(false);
  }, (v) => `${v} dB`);
  const svg = svgEl("svg", { viewBox: "0 0 640 220", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "The noise keeps its shape and only changes size. Its height on the plot is the signal's height divided by √SNR, because power goes with the square of the voltage.");
  box.append(btnRow(labels, (i) => apply(presets[labels[i]]), -1), S.row, N.row);
  if (K) box.append(K.row);
  box.append(sl.row, svg, steps, out, note);

  function count() { const k = K ? Math.round(K.get()) : 1; return k >= 1 ? k : 1; }
  function apply(p) {
    S.setRaw(p.signal ?? 10, p.signalUnit || "mW");
    N.setRaw(p.noise ?? 1, p.noiseUnit || "μW");
    if (K && p.sources != null) K.set(p.sources);
    draw(true);
  }
  const stop = (msg) => { svg.style.display = "none"; steps.textContent = msg; };
  function draw(moveSlider) {
    svg.innerHTML = ""; out.innerHTML = "";
    const ps = S.get(), each = N.get(), k = count();
    if (!(ps > 0)) return stop("Enter an average signal power greater than 0.");
    if (!(each >= 0)) return stop("Enter an average noise power (0 for a noiseless channel).");
    svg.style.display = "";
    const pn = each * k;
    const snr = pn === 0 ? Infinity : ps / pn;
    const db = 10 * Math.log10(snr);
    if (moveSlider) {
      // The slider stops at its ends; its label still shows the real value.
      sl.set(clamp(Math.round(db), -10, 60));
      sl.row.querySelector(".val").textContent = Number.isFinite(db) ? `${num(db, 1)} dB` : num(db);
    }
    const SIG = 28, MID = 124;
    const noiseAmp = snr === Infinity ? 0 : 1 / Math.sqrt(snr);
    const panels = [
      ["Transmitted", SNR_SIGNAL, "var(--blue)"],
      ["Noise", SNR_NOISE.map((v) => v * noiseAmp), "var(--green)"],
      ["Received", SNR_SIGNAL.map((v, i) => v + SNR_NOISE[i] * noiseAmp), "var(--blue)"],
    ];
    panels.forEach(([title, values, color], i) => {
      const x0 = 14 + i * 214, w = 184;
      svg.append(svgEl("text", { x: x0 + w / 2, y: 16, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-2)" }, title));
      svg.append(svgEl("line", { x1: x0, y1: MID, x2: x0 + w, y2: MID, stroke: "var(--rule-strong)" }));
      svg.append(polyline(values.map((v, j) => [x0 + (w * j) / SNR_PTS, clamp(MID - v * SIG, 26, 216)]), color, 1.8));
      if (i < 2) svg.append(svgEl("text", { x: x0 + w + 15, y: MID + 6, "text-anchor": "middle", "font-size": 18, fill: "var(--ink-dim)" }, i === 0 ? "+" : "="));
    });
    const unit = bestUnit(pn || ps, POWER_UNITS);
    const inUnit = (p) => `${num(p / unit[1], 6)} ${unit[0]}`;
    const lines = [];
    if (k > 1) lines.push(`total noise = ${k} devices × ${withUnit(each, POWER_UNITS)} = <b>${withUnit(pn, POWER_UNITS)}</b>`);
    lines.push(`SNR = average signal power / average noise power = ${inUnit(ps)} / ${inUnit(pn)} = <b>${num(snr, snr < 10 ? 4 : 2)}</b>`);
    lines.push(`SNR${sub("dB")} = 10 log${sub(10)} SNR = 10 log${sub(10)} ${num(snr, snr < 10 ? 4 : 2)} = <b>${num(db, 2)}${Number.isFinite(db) ? " dB" : ""}</b>`);
    steps.innerHTML = lines.join("<br>");
    grid(out, [
      ["SNR", num(snr, snr < 10 ? 4 : 2), "a ratio of two powers: no unit"],
      ["SNR in decibels", `${num(db, 2)}${Number.isFinite(db) ? " dB" : ""}`, "10 log₁₀ SNR"],
      ["Reading", snr === Infinity ? "noiseless" : snr > 1 ? "signal above noise" : snr === 1 ? "equal powers" : "noise above signal", snr === Infinity ? "no noise power: SNR and SNR in dB are both ∞" : `noise height is ${num(noiseAmp * 100, 1)}% of the signal's; a higher SNR means a less corrupted signal`],
    ]);
  }
  S.on(() => draw(true));
  N.on(() => draw(true));
  if (K) K.on(() => draw(true));
  apply(cfg.signal != null ? cfg : presets[labels[0]]);
}

// ---------- widget: data-rate ----------
const isPow2 = (v) => Math.abs(Math.log2(v) - Math.round(Math.log2(v))) < 1e-9;
function dataRate(box, cfg) {
  const both = cfg.show !== "nyquist";
  box.append(el("h4", null, cfg.title || (both ? "Data rate limits: Shannon capacity and Nyquist bit rate of one channel" : "Nyquist bit rate: bandwidth and signal levels")));
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : null;
  const Bf = unitField("bandwidth", FREQ_UNITS, 3000, "Hz");
  const Lf = numField("signal levels L", 2);
  const Sf = numField("SNR", 63);
  const Sd = numField("SNR in decibels", "", "dB");
  const Tf = unitField("bit rate wanted", RATE_UNITS, "", "kbps");
  const svg = svgEl("svg", { viewBox: "0 0 640 120", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", both
    ? "Shannon gives the upper limit of the channel from its bandwidth and SNR; no number of levels gets past it. Nyquist then gives the number of signal levels for a chosen bit rate. Leave the wanted bit rate empty to compare the levels you typed against the capacity."
    : "A noiseless channel: the bit rate is 2 × bandwidth × log₂ L. Type a wanted bit rate to solve the formula for L instead.");
  if (presets) { const labels = Object.keys(presets); box.append(btnRow(labels, (i) => apply(presets[labels[i]]), -1)); }
  box.append(Bf.row);
  if (both) box.append(Sf.row, Sd.row);
  box.append(Lf.row, Tf.row, svg, steps, out, note);

  function apply(p) {
    Bf.setRaw(p.bandwidth ?? 3000, p.unit || "Hz");
    Lf.set(p.levels ?? 2);
    Sf.set(p.snr ?? 63);
    Tf.setRaw(p.target ?? "", p.targetUnit || "kbps");
    snrToDb();
    draw();
  }
  function snrToDb() { const s = Sf.get(); Sd.set(s > 0 ? fmtNum(10 * Math.log10(s), 2) : ""); }
  function bars(rows) {
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${rows.length * 34 + 10}`);
    const top = Math.max(...rows.map((r) => r[1]), 1e-12);
    rows.forEach(([label, value, color], i) => {
      const y = 8 + i * 34;
      svg.append(svgEl("text", { x: 196, y: y + 15, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, label));
      svg.append(svgEl("rect", { x: 204, y, width: Math.max(2, (300 * value) / top), height: 20, rx: 3, fill: color, opacity: 0.85 }));
      svg.append(svgEl("text", { x: 210 + Math.max(2, (300 * value) / top), y: y + 15, "font-size": 11, fill: "var(--ink)" }, withUnit(value, RATE_UNITS, 3)));
    });
  }
  const stop = (msg) => { svg.style.display = "none"; steps.textContent = msg; };
  function draw() {
    out.innerHTML = ""; svg.innerHTML = "";
    const B = Bf.get(), L = Lf.get(), snr = Sf.get(), want = Tf.get();
    if (!(B > 0)) return stop("Enter a bandwidth greater than 0.");
    svg.style.display = "";
    const rows = [], lines = [], chart = [];
    const bTxt = num(B);
    let C = NaN;
    if (both) {
      if (!(snr >= 0)) return stop("Enter an SNR of 0 or more (the ratio, not the decibel value).");
      C = B * Math.log2(1 + snr);
      lines.push(`Shannon: C = B × log${sub(2)}(1 + SNR) = ${bTxt} × log${sub(2)}(1 + ${num(snr)}) = ${bTxt} × ${num(Math.log2(1 + snr))} = <b>${num(C, 0)} bps</b>`);
      rows.push(["Shannon capacity", withUnit(C, RATE_UNITS, 3), "the upper limit of this noisy channel"]);
      chart.push(["Shannon capacity", C, "var(--hl)"]);
    }
    const target = want > 0 ? want : both ? C : NaN;
    if (L >= 2) {
      const ny = 2 * B * Math.log2(L);
      lines.push(`Nyquist: BitRate = 2 × B × log${sub(2)} L = 2 × ${bTxt} × log${sub(2)} ${num(L)} = 2 × ${bTxt} × ${num(Math.log2(L))} = <b>${num(ny, 0)} bps</b>`);
      rows.push([`Nyquist bit rate, L = ${num(L)}`, withUnit(ny, RATE_UNITS, 3), both ? (ny > C * (1 + 1e-9) ? "above the capacity: no number of levels achieves this on the noisy channel" : "within the capacity") : "theoretical maximum for a noiseless channel"]);
      chart.push([`Nyquist, L = ${num(L)}`, ny, ny > C * (1 + 1e-9) ? "var(--red)" : "var(--blue)"]);
    } else if (!(want > 0) && !both) return stop("Enter at least 2 signal levels, or a bit rate wanted.");
    if (target > 0) {
      const bitsPer = target / (2 * B), need = 2 ** bitsPer;
      const what = want > 0 ? "the wanted bit rate" : "the capacity";
      const over = both && want > C * (1 + 1e-9);
      const up = Math.ceil(bitsPer - 1e-9), down = Math.floor(bitsPer + 1e-9);
      // On a noisy channel the next power of 2 is only a choice while its bit rate stays within the capacity.
      const upOver = both && 2 * B * up > C * (1 + 1e-9);
      lines.push(`Levels for ${what}: log${sub(2)} L = ${num(target, 0)} / (2 × ${bTxt}) = ${num(bitsPer, 3)}, so L = 2${sup(num(bitsPer, 3))} = <b>${num(need, 2)}</b>`);
      rows.push([`Levels for ${what}`, num(need, 2), over ? "the wanted bit rate is above the capacity: not achievable on this channel"
        : isPow2(need) ? "a power of 2: usable as it is"
          : upOver ? "not a power of 2: reduce the bit rate, because more levels would pass the capacity"
            : "not a power of 2: increase the number of levels or reduce the bit rate"]);
      if (want > 0) chart.push(["bit rate wanted", want, over ? "var(--red)" : "var(--green)"]);
      if (!over && !isPow2(need) && need > 1) {
        if (!upOver) rows.push([`Increase to ${num(2 ** up)} levels`, withUnit(2 * B * up, RATE_UNITS, 3), `2 × ${bTxt} × ${up}`]);
        if (down >= 1) rows.push([`Reduce to ${num(2 ** down)} levels`, withUnit(2 * B * down, RATE_UNITS, 3), `2 × ${bTxt} × ${down}`]);
      }
    }
    steps.innerHTML = lines.join("<br>");
    grid(out, rows);
    if (chart.length) bars(chart);
    else svg.style.display = "none";
  }
  Bf.on(draw); Lf.on(draw); Tf.on(draw);
  Sf.on(() => { snrToDb(); draw(); });
  Sd.on(() => { const d = Sd.get(); if (Number.isFinite(d)) { Sf.set(fmtNum(10 ** (d / 10), 4)); draw(); } });
  apply(cfg.bandwidth != null ? cfg : presets ? Object.values(presets)[0] : {});
}

// ---------- widget: bandwidth-delay ----------
function bandwidthDelay(box, cfg) {
  let bw = clamp(Math.round(cfg.bandwidth ?? 5), 1, 8), delay = clamp(Math.round(cfg.delay ?? 5), 1, 8);
  box.append(el("h4", null, cfg.title || "Bandwidth-delay product: the bits that fill the link"));
  const sB = slider("Bandwidth", 1, 8, 1, bw, (v) => { bw = v; draw(); }, (v) => `${v} bps`);
  const sD = slider("Delay", 1, 8, 1, delay, (v) => { delay = v; draw(); }, (v) => `${v} s`);
  const svg = svgEl("svg", { viewBox: "0 0 640 260", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sB.row, sD.row, svg, out, note);
  function draw() {
    svg.innerHTML = "";
    const X0 = 96, X1 = 610, TOP = 44, ROW = 36, H = 20;
    svg.setAttribute("viewBox", `0 0 640 ${TOP + delay * ROW + 34}`);
    const segW = (X1 - X0) / delay, bitW = segW / bw;
    svg.append(svgEl("text", { x: X0, y: 14, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, "Sender"));
    svg.append(svgEl("text", { x: X1, y: 14, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, "Receiver"));
    svg.append(svgEl("line", { x1: X0, y1: 20, x2: X0, y2: TOP + delay * ROW, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("line", { x1: X1, y1: 20, x2: X1, y2: TOP + delay * ROW, stroke: "var(--rule-strong)" }));
    for (let t = 1; t <= delay; t++) {
      const y = TOP + (t - 1) * ROW;
      svg.append(svgEl("text", { x: X0 - 10, y: y + 14, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, `After ${t} s`));
      for (let s = 1; s <= t; s++) {
        const front = s === t; // the first bits sent are always at the head of the line
        for (let b = 0; b < bw; b++) {
          svg.append(svgEl("rect", { x: X0 + (s - 1) * segW + b * bitW, y, width: bitW, height: H, fill: front ? "var(--blue)" : (t - s) % 2 ? "var(--rule-strong)" : "var(--ink-dim)", stroke: "var(--paper)", "stroke-width": 1, opacity: front ? 0.9 : 0.75 }));
        }
      }
      svg.append(svgEl("text", { x: X0 + (t - 0.5) * segW, y: y - 4, "text-anchor": "middle", "font-size": 9, fill: "var(--blue)" }, `first ${bw} bit${bw === 1 ? "" : "s"}`));
    }
    const yb = TOP + delay * ROW + 6;
    for (let s = 0; s <= delay; s++) svg.append(svgEl("line", { x1: X0 + s * segW, y1: yb - 4, x2: X0 + s * segW, y2: yb + 6, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: yb + 1, x2: X1, y2: yb + 1, stroke: "var(--ink-dim)" }));
    for (let s = 0; s < delay; s++) svg.append(svgEl("text", { x: X0 + (s + 0.5) * segW, y: yb + 20, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, "1 s"));
    const nBits = (n) => `${n} bit${n === 1 ? "" : "s"}`;
    grid(out, [
      ["Bandwidth", `${bw} bps`, "bits per second, the second meaning of bandwidth"],
      ["Delay", `${delay} s`, "time for a bit to cross the link"],
      ["Bandwidth × delay", nBits(bw * delay), `${bw} × ${delay}: the number of bits that can fill the link`],
      ["2 × bandwidth × delay", nBits(2 * bw * delay), "burst size that fills the full-duplex channel, both directions"],
    ]);
    note.textContent = bw === 5 && delay === 5
      ? "The slide figure: bandwidth 5 bps, delay 5 s, bandwidth × delay = 25 bits. Each second 5 more bits enter the link; after 5 s the first 5 bits reach the receiver and the link is full."
      : `Each second ${bw === 1 ? "1 more bit enters" : `${bw} more bits enter`} the link and every bit already on it moves one second closer to the receiver. After ${delay} s the first bits arrive and the link holds ${nBits(bw * delay)}.`;
  }
  draw();
}

// ---------- widget: tx-modes ----------
function txModes(box, cfg) {
  let bits = /^[01]{2,8}$/.test(cfg.bits || "") ? cfg.bits : "01100010";
  let tick = 0;
  const FULL = bits;
  box.append(el("h4", null, cfg.title || "Parallel and serial transmission of the same bits"));
  const sN = slider("Bits in the group, n", 2, FULL.length, 1, bits.length, (v) => { bits = FULL.slice(0, v); tick = 0; draw(); }, (v) => String(v));
  const ctl = el("div", "viz-btn-row");
  const prev = el("button", "viz-btn", "◀ tick"), next = el("button", "viz-btn", "tick ▶"), reset = el("button", "viz-btn", "reset");
  const counter = el("span", "encap-pduname");
  ctl.append(prev, next, reset, counter);
  const svg = svgEl("svg", { viewBox: "0 0 640 400", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "One clock tick moves one bit along one line. Parallel uses n lines to move n bits on each tick; serial has one line, so the group is converted to a stream at the sender and back to a group at the receiver.");
  box.append(sN.row, ctl, svg, out, note);
  const box3 = (x, y, w, h, label, stroke = "var(--blue)") => {
    svg.append(svgEl("rect", { x, y, width: w, height: h, rx: 4, fill: "var(--paper-3)", stroke, "stroke-width": 1.5 }));
    const words = label.split("\n");
    words.forEach((wd, i) => svg.append(svgEl("text", { x: x + w / 2, y: y + h / 2 + 4 + (i - (words.length - 1) / 2) * 12, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-2)" }, wd)));
  };
  const bit = (x, y, b, on) => svg.append(svgEl("text", { x, y, "text-anchor": "middle", "font-size": 13, fill: on ? "var(--hl)" : "var(--ink-2)", "font-weight": on ? "700" : "400" }, b));
  const arrow = (x1, y, x2) => {
    svg.append(svgEl("line", { x1, y1: y, x2: x2 - 6, y2: y, stroke: "var(--blue)", "stroke-width": 1.5 }));
    svg.append(svgEl("polygon", { points: `${x2},${y} ${x2 - 8},${y - 4} ${x2 - 8},${y + 4}`, fill: "var(--blue)" }));
  };
  function draw() {
    const n = bits.length;
    svg.innerHTML = "";
    const P0 = 34, GAP = 22, pH = n * GAP + 8;
    const S0 = P0 + pH + 58;
    svg.setAttribute("viewBox", `0 0 640 ${S0 + 92}`);
    // parallel: n lines, the whole group crosses on the first tick
    svg.append(svgEl("text", { x: 20, y: 18, "font-size": 12, fill: "var(--ink)" }, `Parallel: the ${n} bits are sent together on ${n} lines`));
    box3(20, P0, 70, pH, "Sender");
    box3(550, P0, 70, pH, "Receiver");
    const pDone = tick >= 1;
    for (let i = 0; i < n; i++) {
      const y = P0 + 15 + i * GAP;
      arrow(90, y, 550);
      bit(pDone ? 528 : 112, y - 4, bits[i], pDone);
    }
    // serial: one line, one bit per tick, a converter at each end
    svg.append(svgEl("text", { x: 20, y: S0 - 16, "font-size": 12, fill: "var(--ink)" }, `Serial: the ${n} bits are sent one after another on one line`));
    box3(20, S0, 62, 60, "Sender");
    box3(86, S0, 104, 60, "parallel/serial\nconverter", "var(--red)");
    box3(450, S0, 104, 60, "serial/parallel\nconverter", "var(--red)");
    box3(558, S0, 62, 60, "Receiver");
    arrow(190, S0 + 36, 450);
    const sent = Math.min(tick, n);
    // The bit nearest the receiver leaves first, so the group arrives in its original order.
    for (let i = 0; i < n; i++) {
      const delivered = i >= n - sent;
      bit(delivered ? 436 - (n - 1 - i) * 15 : 204 + i * 15, S0 + 26, bits[i], delivered);
    }
    svg.append(svgEl("text", { x: 320, y: S0 + 80, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, "bits on the left are still to be sent; highlighted bits have arrived"));
    counter.textContent = `after ${tick} of ${n} clock ticks`;
    prev.disabled = tick === 0; next.disabled = tick >= n;
    grid(out, [
      ["Parallel", `${n} lines, 1 tick`, `can increase the transfer speed by a factor of n = ${n} over serial`],
      ["Serial", `1 line, ${n} ticks`, `reduces the cost of transmission over parallel by roughly a factor of n = ${n}`],
      ["Parallel has delivered", `${pDone ? n : 0} of ${n} bits`, pDone ? "the whole group crossed on the first tick" : "nothing sent yet"],
      ["Serial has delivered", `${sent} of ${n} bits`, sent === 0 ? "nothing sent yet" : sent < n ? "one bit per tick, still sending" : "the whole group has arrived"],
    ]);
  }
  prev.addEventListener("click", () => { tick = Math.max(0, tick - 1); draw(); });
  next.addEventListener("click", () => { tick = Math.min(bits.length, tick + 1); draw(); });
  reset.addEventListener("click", () => { tick = 0; draw(); });
  draw();
}

export const WIDGETS = {
  "channel-filter": channelFilter,
  "decibel": decibel,
  "snr-noise": snrNoise,
  "data-rate": dataRate,
  "bandwidth-delay": bandwidthDelay,
  "tx-modes": txModes,
};
