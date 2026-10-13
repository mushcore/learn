// Interactive data-communications widgets (COMP 3721): topologies and link counts, sine-wave
// parameters, frequency/period conversion, composite signals and bandwidth, encapsulation through
// a switch and a router, digital signal levels.
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
/** Picks the SI prefix that keeps the mantissa in [1, 1000). units: [[label, factor], ...] sorted ascending. */
function bestUnit(value, units) {
  if (!(value > 0)) return units.find((u) => u[1] === 1) || units[0];
  let best = units[0];
  for (const u of units) if (value / u[1] >= 1) best = u;
  return best;
}
const TIME_UNITS = [["ps", 1e-12], ["ns", 1e-9], ["μs", 1e-6], ["ms", 1e-3], ["s", 1]];
const FREQ_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9], ["THz", 1e12]];
function fmtWith(value, units) {
  const u = bestUnit(value, units);
  return `${fmtNum(value / u[1], 4)} ${u[0]}`;
}
function fmtHz(f) { return fmtWith(f, FREQ_UNITS); }
function fmtSec(t) { return fmtWith(t, TIME_UNITS); }

// ---------- widget: topology ----------
const TOPO = {
  mesh: {
    def: "Every device has a dedicated point-to-point link to every other device.",
    links: (n) => n * (n - 1) / 2,
    formula: (n) => `C(n, 2) = n(n − 1) / 2 = ${n} × ${n - 1} / 2`,
  },
  star: {
    def: "Each device has a dedicated point-to-point link only to a central controller, usually called a hub.",
    links: (n) => n,
    formula: (n) => `one link per device = n = ${n}`,
  },
  bus: {
    def: "Multipoint: one long cable as a backbone; drop lines and taps connect the devices to it.",
    links: (n) => n + 1,
    formula: (n) => `1 backbone + n drop lines = 1 + ${n}`,
  },
  ring: {
    def: "Each device has a dedicated point-to-point connection with only the two devices on either side of it (a repeater per device).",
    links: (n) => n,
    formula: (n) => `one link between each neighbouring pair = n = ${n}`,
  },
};
function topology(box, cfg) {
  const types = Object.keys(TOPO);
  let type = types.includes(cfg.type) ? cfg.type : "mesh";
  let n = clamp(Math.round(cfg.n ?? 6), 2, 12);
  box.append(el("h4", null, cfg.title || "Physical topologies and how many links they need"));
  const btns = btnRow(["Mesh", "Star", "Bus", "Ring"], (i) => { type = types[i]; draw(); }, types.indexOf(type));
  const s = slider("n devices", 2, 12, 1, n, (v) => { n = v; draw(); }, (v) => String(v));
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(btns, s.row, svg, out, note);

  function node(x, y, label) {
    const g = svgEl("g");
    g.append(svgEl("circle", { cx: x, cy: y, r: 15, fill: "var(--paper)", stroke: "var(--blue)", "stroke-width": 2 }));
    g.append(svgEl("text", { x, y: y + 4, "text-anchor": "middle", "font-size": 12, fill: "var(--ink)" }, label));
    return g;
  }
  const line = (x1, y1, x2, y2, color = "var(--hl)", w = 1.5) => svgEl("line", { x1, y1, x2, y2, stroke: color, "stroke-width": w, "stroke-linecap": "round" });

  function draw() {
    svg.innerHTML = "";
    const pts = [];
    const cx = 320, cy = 150, R = 115;
    if (type === "bus") {
      const x0 = 60, x1 = 580, yb = 200;
      for (let i = 0; i < n; i++) pts.push([x0 + 30 + (x1 - x0 - 60) * (n === 1 ? 0.5 : i / (n - 1)), 90]);
      svg.append(line(x0, yb, x1, yb, "var(--hl)", 4));
      svg.append(svgEl("text", { x: x1, y: yb + 22, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, "backbone (1 cable)"));
      pts.forEach(([x, y], i) => {
        svg.append(line(x, y + 15, x, yb, "var(--blue)", 1.5));
        svg.append(svgEl("circle", { cx: x, cy: yb, r: 4, fill: "var(--hl)" }));
        svg.append(node(x, y, String(i + 1)));
      });
      svg.append(svgEl("text", { x: pts[0][0], y: 160, "font-size": 11, fill: "var(--ink-dim)" }, "drop line"));
      svg.append(svgEl("text", { x: pts[0][0] + 8, y: yb - 8, "font-size": 11, fill: "var(--ink-dim)" }, "tap"));
    } else {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
      }
      if (type === "mesh") for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) svg.append(line(pts[i][0], pts[i][1], pts[j][0], pts[j][1]));
      if (type === "ring") for (let i = 0; i < n; i++) { const j = (i + 1) % n; svg.append(line(pts[i][0], pts[i][1], pts[j][0], pts[j][1], "var(--hl)", 2.5)); }
      if (type === "star") {
        for (const [x, y] of pts) svg.append(line(cx, cy, x, y));
        svg.append(svgEl("rect", { x: cx - 26, y: cy - 14, width: 52, height: 28, rx: 5, fill: "var(--paper-3)", stroke: "var(--hl)", "stroke-width": 2 }));
        svg.append(svgEl("text", { x: cx, y: cy + 4, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)" }, "Hub"));
      }
      pts.forEach(([x, y], i) => svg.append(node(x, y, String(i + 1))));
    }
    const t = TOPO[type];
    grid(out, [
      ["Topology", type[0].toUpperCase() + type.slice(1), t.def],
      ["Devices n", String(n), type === "star" ? "plus the hub, which is not counted as a device" : ""],
      ["Cable links", String(t.links(n)), t.formula(n)],
    ]);
    note.textContent = type === "mesh"
      ? "Try n = 12: 66 links (E01 exercise 1). Every extra device adds n − 1 new cables, which is why mesh wiring 'can be greater than the available space'."
      : type === "star"
        ? "Every frame goes through the hub: one link per device, but the whole topology depends on that single point."
        : type === "bus"
          ? "One shared backbone (multipoint), n drop lines and n taps. There is a limit on the number of taps and on the distance between them."
          : "Traffic is unidirectional around the ring; a break anywhere can disable the whole network.";
  }
  draw();
}

// ---------- shared plotting ----------
function axes(svg, { x0, x1, y0, y1, xTicks, yLabel, xLabel }) {
  svg.append(svgEl("line", { x1: x0, y1: (y0 + y1) / 2, x2: x1, y2: (y0 + y1) / 2, stroke: "var(--rule-strong)", "stroke-width": 1 }));
  svg.append(svgEl("line", { x1: x0, y1: y0, x2: x0, y2: y1, stroke: "var(--rule-strong)", "stroke-width": 1 }));
  for (const [x, label] of xTicks) {
    svg.append(svgEl("line", { x1: x, y1: y0, x2: x, y2: y1, stroke: "var(--rule)", "stroke-width": 1, "stroke-dasharray": "3 4" }));
    svg.append(svgEl("text", { x, y: y1 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, label));
  }
  if (yLabel) svg.append(svgEl("text", { x: x0 - 6, y: y0 + 10, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, yLabel));
  if (xLabel) svg.append(svgEl("text", { x: x1, y: y1 + 28, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, xLabel));
}
function polyline(points, color, width = 2, opacity = 1) {
  return svgEl("polyline", { points: points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "), fill: "none", stroke: color, "stroke-width": width, opacity, "stroke-linejoin": "round" });
}
function spike(svg, x, yBase, h, color, label) {
  svg.append(svgEl("line", { x1: x, y1: yBase, x2: x, y2: yBase - h, stroke: color, "stroke-width": 4, "stroke-linecap": "round" }));
  if (label) svg.append(svgEl("text", { x, y: yBase - h - 6, "text-anchor": "middle", "font-size": 10, fill: color }, label));
}

// ---------- widget: sine-wave ----------
function sineWave(box, cfg) {
  let A = clamp(cfg.A ?? 1, 0.5, 5), f = clamp(cfg.f ?? 2, 0.5, 10), ph = clamp(cfg.phase ?? 0, -180, 180);
  box.append(el("h4", null, cfg.title || "Sine wave: s(t) = A sin(2πft + φ)"));
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : null;
  if (presets) {
    const labels = Object.keys(presets);
    box.append(btnRow(labels, (i) => { const [a, fq, p] = presets[labels[i]]; A = clamp(a, 0.5, 5); f = clamp(fq, 0.5, 10); ph = clamp(p ?? 0, -180, 180); sA.set(A); sF.set(f); sP.set(ph); draw(); }, -1));
  }
  const sA = slider("Peak amplitude A (V)", 0.5, 5, 0.1, A, (v) => { A = v; draw(); }, (v) => fmtNum(v, 1) + " V");
  const sF = slider("Frequency f (Hz)", 0.5, 10, 0.1, f, (v) => { f = v; draw(); }, (v) => fmtNum(v, 1) + " Hz");
  const sP = slider("Phase φ (degrees)", -180, 180, 5, ph, (v) => { ph = v; draw(); }, (v) => fmtNum(v, 0) + "°");
  const tSvg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const fSvg = svgEl("svg", { viewBox: "0 0 640 110", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sA.row, sF.row, sP.row, tSvg, fSvg, out, note);

  function draw() {
    const X0 = 50, X1 = 610, Y0 = 20, Y1 = 200, YM = (Y0 + Y1) / 2, SCALE = 85 / 5;
    tSvg.innerHTML = "";
    const xTicks = [];
    for (let t = 0; t <= 1.0001; t += 0.1) xTicks.push([X0 + (X1 - X0) * t, `${t.toFixed(1)} s`]);
    axes(tSvg, { x0: X0, x1: X1, y0: Y0, y1: Y1, xTicks, yLabel: "V", xLabel: "time" });
    const phr = (ph * Math.PI) / 180;
    const pts = [];
    for (let i = 0; i <= 500; i++) { const t = i / 500; pts.push([X0 + (X1 - X0) * t, YM - A * SCALE * Math.sin(2 * Math.PI * f * t + phr)]); }
    tSvg.append(polyline(pts, "var(--blue)", 2.2));
    // peak amplitude guide
    tSvg.append(svgEl("line", { x1: X0, y1: YM - A * SCALE, x2: X1, y2: YM - A * SCALE, stroke: "var(--hl)", "stroke-dasharray": "4 4", opacity: 0.7 }));
    tSvg.append(svgEl("text", { x: X1, y: YM - A * SCALE - 4, "text-anchor": "end", "font-size": 10, fill: "var(--hl)" }, `A = ${fmtNum(A, 1)} V`));
    // one period marker starting at the first upward zero crossing after t = 0
    const T = 1 / f;
    const shift = -phr / (2 * Math.PI * f); // where the "unshifted" cycle starts
    let t0 = shift % T; if (t0 < 0) t0 += T;
    if (t0 + T <= 1) {
      const xa = X0 + (X1 - X0) * t0, xb = X0 + (X1 - X0) * (t0 + T);
      tSvg.append(svgEl("line", { x1: xa, y1: Y1 - 6, x2: xb, y2: Y1 - 6, stroke: "var(--green)", "stroke-width": 2 }));
      tSvg.append(svgEl("line", { x1: xa, y1: Y1 - 12, x2: xa, y2: Y1, stroke: "var(--green)", "stroke-width": 2 }));
      tSvg.append(svgEl("line", { x1: xb, y1: Y1 - 12, x2: xb, y2: Y1, stroke: "var(--green)", "stroke-width": 2 }));
      tSvg.append(svgEl("text", { x: (xa + xb) / 2, y: Y1 - 12, "text-anchor": "middle", "font-size": 10, fill: "var(--green)" }, `T = ${fmtNum(T, 3)} s`));
    }
    if (ph !== 0) {
      const xs = X0 + (X1 - X0) * Math.min(Math.abs(shift), 1);
      tSvg.append(svgEl("line", { x1: X0, y1: Y0 + 8, x2: xs, y2: Y0 + 8, stroke: "var(--red)", "stroke-width": 2 }));
      tSvg.append(svgEl("text", { x: xs + 4, y: Y0 + 12, "font-size": 10, fill: "var(--red)" }, `${ph > 0 ? "left" : "right"} shift φ/ω = ${fmtNum(Math.abs(shift), 3)} s`));
    }
    // frequency domain
    fSvg.innerHTML = "";
    const FX0 = 50, FX1 = 610, FY = 80, FMAX = 10;
    fSvg.append(svgEl("line", { x1: FX0, y1: FY, x2: FX1, y2: FY, stroke: "var(--rule-strong)" }));
    fSvg.append(svgEl("line", { x1: FX0, y1: 10, x2: FX0, y2: FY, stroke: "var(--rule-strong)" }));
    for (let h = 0; h <= FMAX; h += 1) { const x = FX0 + (FX1 - FX0) * (h / FMAX); fSvg.append(svgEl("text", { x, y: FY + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, `${h}`)); }
    fSvg.append(svgEl("text", { x: FX1, y: FY + 28, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "frequency (Hz)"));
    fSvg.append(svgEl("text", { x: FX0 - 6, y: 18, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "A"));
    spike(fSvg, FX0 + (FX1 - FX0) * (f / FMAX), FY, (A / 5) * 60, "var(--blue)", `${fmtNum(A, 1)} V at ${fmtNum(f, 1)} Hz`);
    const w = 2 * Math.PI * f;
    grid(out, [
      ["Period T = 1/f", `${fmtNum(T, 4)} s`, `= ${fmtSec(T)}`],
      ["ω = 2πf", `${fmtNum(w, 3)} rad/s`, `2π × ${fmtNum(f, 1)}`],
      ["Phase φ", `${fmtNum(ph, 0)}° = ${fmtNum(phr, 3)} rad`, `${fmtNum(ph, 0)} × 2π/360; ${fmtNum(ph / 360, 3)} of a cycle`],
      ["Equation", `s(t) = ${fmtNum(A, 1)} sin(2π·${fmtNum(f, 1)}·t ${ph >= 0 ? "+" : "−"} ${fmtNum(Math.abs(phr), 3)})`, `= ${fmtNum(A, 1)} sin(${fmtNum(w, 2)} t ${ph >= 0 ? "+" : "−"} ${fmtNum(Math.abs(ph), 0)}°)`],
    ]);
    note.textContent = "One sine wave in the time domain is one spike in the frequency domain. A positive φ (A sin(ωt + φ)) moves the wave left by φ/ω; a negative φ moves it right. The frequency-domain plot does not show φ at all.";
  }
  draw();
}

// ---------- widget: freq-period ----------
function freqPeriod(box, cfg) {
  box.append(el("h4", null, cfg.title || "Frequency and period are one characteristic described in two ways"));
  const mk = (label, units, value, unitLabel) => {
    const row = el("div", "unit-row");
    const lab = el("label", null, label);
    const input = document.createElement("input"); input.type = "number"; input.step = "any"; input.value = value;
    const sel = document.createElement("select");
    for (const [u] of units) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === unitLabel) o.selected = true; sel.append(o); }
    row.append(lab, input, sel);
    return { row, input, sel, units };
  };
  const startF = cfg.f != null || cfg.T == null;
  const F = mk("frequency f", FREQ_UNITS, startF ? cfg.f ?? 60 : 0, startF ? (cfg.unit || "Hz") : "Hz");
  const P = mk("period T", TIME_UNITS, startF ? 0 : cfg.T, startF ? "s" : (cfg.unit || "s"));
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note", "Type on either side; the other side updates. T = 1/f and f = 1/T. Units: ms = 10⁻³ s, μs = 10⁻⁶ s, ns = 10⁻⁹ s; kHz = 10³ Hz, MHz = 10⁶ Hz, GHz = 10⁹ Hz.");
  box.append(F.row, P.row, steps, note);
  const factor = (o) => o.units.find(([u]) => u === o.sel.value)[1];
  function fromF() {
    const f = parseFloat(F.input.value) * factor(F);
    if (!(f > 0)) { steps.textContent = "Enter a frequency greater than 0."; return; }
    const T = 1 / f;
    const u = bestUnit(T, TIME_UNITS);
    P.sel.value = u[0]; P.input.value = fmtNum(T / u[1], 4);
    steps.innerHTML = `T = 1/f = 1/(${F.input.value} ${F.sel.value}) = 1/(${fmtNum(f, 6)} Hz) = <b>${fmtNum(T, 8)} s</b> = <b>${fmtNum(T / u[1], 4)} ${u[0]}</b>`;
  }
  function fromT() {
    const T = parseFloat(P.input.value) * factor(P);
    if (!(T > 0)) { steps.textContent = "Enter a period greater than 0."; return; }
    const f = 1 / T;
    const u = bestUnit(f, FREQ_UNITS);
    F.sel.value = u[0]; F.input.value = fmtNum(f / u[1], 4);
    steps.innerHTML = `f = 1/T = 1/(${P.input.value} ${P.sel.value}) = 1/(${T.toExponential(3)} s) = <b>${fmtNum(f, 4)} Hz</b> = <b>${fmtNum(f / u[1], 4)} ${u[0]}</b>`;
  }
  F.input.addEventListener("input", fromF); F.sel.addEventListener("change", fromF);
  P.input.addEventListener("input", fromT); P.sel.addEventListener("change", fromT);
  if (startF) fromF(); else fromT();
}

// ---------- widget: composite ----------
function parseComponents(text) {
  return String(text).split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean).map((t) => {
    const [f, a] = t.split(":").map(Number);
    return { f, a: a == null || !Number.isFinite(a) ? 1 : a };
  }).filter((c) => Number.isFinite(c.f) && c.f > 0 && c.a > 0).sort((p, q) => p.f - q.f);
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** Discrete spikes mean a periodic composite; say which fundamental they are harmonics of. */
function harmonicNote(comps, fLow) {
  if (comps.length < 2) return "one simple sine wave: one spike";
  if (comps.every((c) => Math.abs(c.f / fLow - Math.round(c.f / fLow)) < 1e-9)) return "integer multiples of the lowest: harmonics of a periodic signal";
  if (comps.every((c) => Number.isInteger(c.f))) {
    const g = comps.map((c) => c.f).reduce(gcd);
    return g > 1 ? `all multiples of ${fmtHz(g)}: harmonics of a ${fmtHz(g)} fundamental whose own amplitude is zero` : "discrete spikes, so still a periodic composite";
  }
  return "discrete spikes, so still a periodic composite";
}
function composite(box, cfg) {
  box.append(el("h4", null, cfg.title || "Composite signal: add sine waves, read the bandwidth"));
  const input = document.createElement("input");
  input.className = "comp-input"; input.spellcheck = false; input.value = cfg.components || "1:1 3:0.33 9:0.11";
  input.setAttribute("aria-label", "components as freq:amp pairs");
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : { "f only": "1:1", "f + 3f + 9f (slide)": "1:1 3:0.33 9:0.11", "E02 exercise 3": "100 400 500 750 900" };
  const labels = Object.keys(presets);
  const tSvg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const fSvg = svgEl("svg", { viewBox: "0 0 640 130", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note", "Components are frequency (Hz) or frequency:amplitude pairs separated by spaces, e.g. 1:1 3:0.33 9:0.11. Each spike is one simple sine wave; the bold curve is their sum.");
  box.append(btnRow(labels, (i) => { input.value = presets[labels[i]]; draw(); }, -1), input, tSvg, fSvg, out, note);
  input.addEventListener("input", draw);
  const COLORS = ["var(--blue)", "var(--green)", "var(--purple)", "var(--red)", "var(--hl)", "#f5a3ff", "#6be3ff", "#ffb36b"];

  function draw() {
    const comps = parseComponents(input.value);
    tSvg.innerHTML = ""; fSvg.innerHTML = "";
    if (!comps.length) { grid(out, [["Components", "none", "type at least one frequency"]]); return; }
    const fLow = comps[0].f, fHigh = comps[comps.length - 1].f;
    const window = 2 / fLow; // two periods of the lowest frequency
    const X0 = 50, X1 = 610, Y0 = 15, Y1 = 195, YM = (Y0 + Y1) / 2;
    const xTicks = [];
    for (let k = 0; k <= 4; k++) xTicks.push([X0 + (X1 - X0) * (k / 4), fmtSec(window * k / 4)]);
    axes(tSvg, { x0: X0, x1: X1, y0: Y0, y1: Y1, xTicks, xLabel: "time" });
    const N = 600;
    const sum = new Array(N + 1).fill(0);
    const each = comps.map(() => []);
    let peak = 0;
    for (let i = 0; i <= N; i++) {
      const t = window * i / N;
      comps.forEach((c, k) => { const v = c.a * Math.sin(2 * Math.PI * c.f * t); each[k].push(v); sum[i] += v; });
      peak = Math.max(peak, Math.abs(sum[i]));
    }
    const S = 85 / (peak || 1);
    comps.forEach((c, k) => tSvg.append(polyline(each[k].map((v, i) => [X0 + (X1 - X0) * i / N, YM - v * S]), COLORS[k % COLORS.length], 1, 0.55)));
    tSvg.append(polyline(sum.map((v, i) => [X0 + (X1 - X0) * i / N, YM - v * S]), "var(--ink)", 2.4));
    // frequency domain
    const FX0 = 50, FX1 = 610, FY = 95, FMAX = fHigh * 1.15;
    fSvg.append(svgEl("line", { x1: FX0, y1: FY, x2: FX1, y2: FY, stroke: "var(--rule-strong)" }));
    fSvg.append(svgEl("line", { x1: FX0, y1: 10, x2: FX0, y2: FY, stroke: "var(--rule-strong)" }));
    fSvg.append(svgEl("text", { x: FX1, y: FY + 28, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "frequency"));
    fSvg.append(svgEl("text", { x: FX0 - 6, y: 18, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "A"));
    const aMax = Math.max(...comps.map((c) => c.a));
    comps.forEach((c, k) => {
      const x = FX0 + (FX1 - FX0) * (c.f / FMAX);
      spike(fSvg, x, FY, (c.a / aMax) * 70, COLORS[k % COLORS.length], `${fmtHz(c.f)}`);
      fSvg.append(svgEl("text", { x, y: FY + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, `${fmtNum(c.a, 2)}`));
    });
    // bandwidth bracket
    const xa = FX0 + (FX1 - FX0) * (fLow / FMAX), xb = FX0 + (FX1 - FX0) * (fHigh / FMAX);
    if (comps.length > 1) {
      fSvg.append(svgEl("line", { x1: xa, y1: FY + 24, x2: xb, y2: FY + 24, stroke: "var(--hl)", "stroke-width": 2 }));
      fSvg.append(svgEl("text", { x: (xa + xb) / 2, y: FY + 36, "text-anchor": "middle", "font-size": 10, fill: "var(--hl)" }, `B = ${fmtHz(fHigh - fLow)}`));
    }
    const B = fHigh - fLow;
    grid(out, [
      ["Lowest frequency", fmtHz(fLow), ""],
      ["Highest frequency", fmtHz(fHigh), ""],
      ["Bandwidth B = f_high − f_low", fmtHz(B), comps.length === 1 ? "a single sine wave has zero bandwidth" : `${fmtHz(fHigh)} − ${fmtHz(fLow)}`],
      ["Middle frequency", fmtHz((fHigh + fLow) / 2), "(f_high + f_low) / 2, the E02 trick"],
      ["Components", String(comps.length), harmonicNote(comps, fLow)],
    ]);
  }
  draw();
}

// ---------- widget: encapsulation ----------
const DEVICES = [
  { name: "Source A", layers: ["Application", "Transport", "Network", "Link", "Physical"] },
  { name: "Switch", layers: ["Link", "Physical"] },
  { name: "Router", layers: ["Network", "Link", "Physical"] },
  { name: "Destination B", layers: ["Application", "Transport", "Network", "Link", "Physical"] },
];
const PART = { HL: ["hl", "H_L"], HL2: ["hl", "H_L'"], HN: ["hn", "H_N"], HT: ["ht", "H_T"], M: ["m", "M"], BITS: ["bits", "0101101101001…"] };
const STEPS = [
  [0, "Application", ["M"], "message", "The application on A produces the message M (for example an HTTP request). Application-layer address: a name such as a URL."],
  [0, "Transport", ["HT", "M"], "segment / user datagram", "Transport adds its header H_T: the port numbers that identify the sending and receiving processes. TCP makes a segment, UDP a user datagram."],
  [0, "Network", ["HN", "HT", "M"], "datagram / packet", "Network adds H_N with the source and destination IP (logical) addresses: A and B. This header travels unchanged all the way to B."],
  [0, "Link", ["HL", "HN", "HT", "M"], "frame", "Data link adds H_L with the link-layer (MAC) addresses for THIS link only: source A, destination the router's interface. Now it is a frame."],
  [0, "Physical", ["BITS"], "bits", "The physical layer turns the frame's bits into signals on link 1. Layers below application, transport and network deal with a single link at a time."],
  [1, "Physical", ["BITS"], "bits", "The switch receives the signal on one port and regenerates it (a physical-layer job)."],
  [1, "Link", ["HL", "HN", "HT", "M"], "frame", "The switch reads the destination MAC in H_L and chooses the outgoing port (filtering). It never opens H_N: a switch has no network layer. The frame is forwarded unchanged."],
  [1, "Physical", ["BITS"], "bits", "Bits go out on the port that leads toward the router, still on link 1."],
  [2, "Physical", ["BITS"], "bits", "The router's interface regenerates the signal."],
  [2, "Link", ["HL", "HN", "HT", "M"], "frame", "The router accepts the frame only because the destination MAC in H_L is its own interface (router difference 2). Then it strips H_L: the frame becomes a datagram again."],
  [2, "Network", ["HN", "HT", "M"], "datagram", "The router reads the destination IP in H_N and looks up which link to use next (routing). H_N is not changed."],
  [2, "Link", ["HL2", "HN", "HT", "M"], "frame (new H_L')", "New link, new header: H_L' now has source MAC = the router's outgoing interface and destination MAC = B. The router changes both link-layer addresses (router difference 3)."],
  [2, "Physical", ["BITS"], "bits", "The new frame is sent as signals on link 2."],
  [3, "Physical", ["BITS"], "bits", "B's NIC receives the signal and recovers the bits. The NIC implements the physical and data-link layers."],
  [3, "Link", ["HL2", "HN", "HT", "M"], "frame", "B's data link checks that the destination MAC in H_L' is its own, then removes H_L'. Decapsulation has started."],
  [3, "Network", ["HN", "HT", "M"], "datagram", "B's network layer checks that the destination IP in H_N is its own, then removes H_N."],
  [3, "Transport", ["HT", "M"], "segment", "Transport reads the destination port in H_T to find the right process, then removes H_T."],
  [3, "Application", ["M"], "message", "The application receives M, identical to what A sent. Encapsulation on the way down at A, decapsulation on the way up at B; the switch touched only H_L, the router replaced H_L and read H_N."],
];
// Predict mode: what each step does to the PDU (null = a physical-layer step, played through).
const ENC_DO = ["adds H_T", "adds H_N", "adds H_L", "reads H_L, forwards the frame unchanged", "strips H_L", "reads H_N, leaves it unchanged", "writes a new H_L'", "removes H_L'", "removes H_N", "removes H_T"];
const ENC_ACT = [null, 0, 1, 2, null, null, 3, null, null, 4, 5, 6, null, null, 7, 8, 9, null];
const ENC_RULE = (i) => (i <= 3 ? "Going down at the source, each layer adds its own header in front of what it receives."
  : i <= 7 ? "A switch has no network layer: it checks the MAC addresses in H_L and forwards the frame unchanged."
    : i === 9 ? "The router accepts a frame only when the destination MAC is its own interface, then strips H_L to get the datagram back."
      : i === 10 ? "The router reads the destination IP in H_N to choose the next link; H_N travels unchanged all the way to B."
        : i === 11 ? "New link, new header: the router changes both link-layer addresses when it forwards the packet."
          : "Going up at the destination, each layer checks and removes the header its peer added at the source.");
function encapsulation(box, cfg) {
  box.append(el("h4", null, cfg.title || "Encapsulation and decapsulation through a switch and a router"));
  const P = createPredict({
    on: cfg.predict, label: "Predict what each layer does to the PDU", count: () => STEPS.length, redraw: () => frame(pb.pos()),
    question: (k) => {
      const a = ENC_ACT[k];
      if (a == null) return null;
      // the right action and three others, kept in the list's order
      const pick = [a, (a + 3) % ENC_DO.length, (a + 5) % ENC_DO.length, (a + 8) % ENC_DO.length].sort((x, y) => x - y);
      return { text: `${DEVICES[STEPS[k][0]].name}, ${STEPS[k][1]} layer: what does this layer do to the PDU?`, choices: pick.map((i) => [ENC_DO[i], i]), right: a, why: () => ENC_RULE(k) };
    },
  });
  box.append(P.check);
  const devs = el("div", "encap-devices");
  devs.style.position = "relative";
  const layerEls = DEVICES.map((d) => {
    const dv = el("div", "encap-device");
    dv.append(el("div", "name", d.name));
    const rows = d.layers.map((l) => { const r = el("div", "encap-layer", l); dv.append(r); return r; });
    devs.append(dv);
    return rows;
  });
  // The PDU's position: a dot that travels from the layer of the previous step to the layer of this one.
  const token = el("span");
  token.setAttribute("aria-hidden", "true");
  token.style.cssText = "position:absolute;width:11px;height:11px;border-radius:50%;background:var(--hl);box-shadow:0 0 0 3px var(--hl-soft);pointer-events:none;transform:translate(-50%,-50%);";
  devs.append(token);
  const pduRow = el("div", "encap-pdu");
  const caption = el("div", "encap-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(devs, pduRow, caption);
  const INTRO = "One step is one layer: the message M goes down the layers at Source A, through the switch and the router, and up the layers at Destination B.";
  const rowOf = ([dev, layer]) => layerEls[dev][DEVICES[dev].layers.indexOf(layer)];
  const spot = (st) => { const r = rowOf(st); return [r.offsetLeft + r.offsetWidth - 13, r.offsetTop + r.offsetHeight / 2]; };
  let pduKey = -1, fresh = [], pb = null;
  // pos k (a whole number) shows step k of STEPS; between k − 1 and k the PDU is on its way there.
  function frame(pos) {
    const q = P.asking(pos), next = q ? STEPS[Math.round(pos)] : null;
    const k = Math.ceil(pos - 1e-9), cur = k > 0 ? STEPS[k - 1] : null, before = k > 1 ? STEPS[k - 2] : null;
    const frac = k > 0 ? pos - (k - 1) : 0, ease = frac * frac * (3 - 2 * frac);
    const lit = next || cur; // while a question waits, the layer it asks about is lit
    layerEls.forEach((rows, di) => rows.forEach((r) => {
      r.classList.toggle("active", !!lit && di === lit[0] && r.textContent === lit[1]);
      r.classList.toggle("dim", !!lit && di !== lit[0]);
    }));
    if (pduKey !== k) {
      pduKey = k; pduRow.innerHTML = ""; fresh = [];
      if (cur) {
        const [dev, layer, parts, pduName] = cur;
        for (const p of parts) {
          const [cls, label] = PART[p];
          const part = el("span", "encap-part " + cls, label);
          if (!before || !before[2].includes(p)) fresh.push(part);
          pduRow.append(part);
        }
        pduRow.append(el("span", "encap-pduname", `PDU: ${pduName} · ${DEVICES[dev].name}, ${layer} layer`));
      }
    }
    // A header that this step adds (or the bits / frame it turns the PDU into) fades in as the step is drawn.
    for (const part of fresh) part.style.opacity = String(0.2 + 0.8 * ease);
    if (cur) {
      const [bx, by] = spot(cur), [ax, ay] = before ? spot(before) : [bx, by];
      token.style.left = `${ax + (bx - ax) * ease}px`;
      token.style.top = `${ay + (by - ay) * ease}px`;
      token.style.opacity = before ? "1" : String(ease);
    } else token.style.opacity = "0";
    let text = q ? P.question().text : cur ? cur[4] : INTRO;
    if (!q && pos >= STEPS.length) text += P.tally();
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos);
  }
  box.append(P.ask);
  pb = playbackWith(P, { count: STEPS.length, unit: "step", stepMs: () => cfg.stepMs || 2400, onFrame: frame });
  box.append(pb.el, el("p", "widget-note", "H_T = transport header (ports), H_N = network header (IP addresses), H_L = link header (MAC addresses). Compare with the lecture's Source, Switch, Router, Destination example."));
  // The dot is placed from the layer boxes' measured positions, so redraw it when the layout changes.
  if (typeof ResizeObserver === "function") new ResizeObserver(() => frame(pb.pos())).observe(devs);
  else frame(pb.pos());
}

// ---------- widget: wave-travel ----------
const SUP_DIGITS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const sup = (n) => (n < 0 ? "⁻" : "") + String(Math.abs(n)).split("").map((d) => SUP_DIGITS[d]).join("");
const pow10 = (v) => Math.floor(Math.log10(v) + 1e-9);
/** 3e8 → "3 × 10⁸". Pass e to keep one exponent across a row of values. */
function sci(v, e = pow10(v)) { return `${fmtNum(v / 10 ** e, 3)} × 10${sup(e)}`; }
const WT_F_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9], ["× 10¹⁴ Hz", 1e14]];
const WT_PRESETS = {
  "Red light (slide)": [4e14, 3e8],
  "1 GHz, vacuum": [1e9, 3e8],
  "1 GHz, cable": [1e9, 2e8],
  "100 MHz": [1e8, 3e8],
  "2.4 GHz Wi-Fi": [2.4e9, 3e8],
};
function waveTravel(box, cfg) {
  const okF = (v) => Number.isFinite(v) && v > 0 && v <= 1e18, okC = (v) => Number.isFinite(v) && v > 0 && v <= 3e8 * (1 + 1e-9);
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : WT_PRESETS;
  const labels = Object.keys(presets);
  const periods = clamp(Math.round(cfg.periods ?? 4), 2, 8);
  let f = okF(cfg.f) ? cfg.f : 4e14, c = okC(cfg.speed) ? cfg.speed : 3e8;
  let span = 0, count = periods;
  // Predict mode: `answered` periods may be played; the next one waits for the student's distance.
  let predict = !!cfg.predict, answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false, gridKey = null;
  let pb = null;

  box.append(el("h4", null, cfg.title || "One period in time is one wavelength in distance"));
  const presetRow = el("div", "viz-btn-row");
  const presetBtns = labels.map((l) => {
    const b = el("button", "viz-btn", l);
    b.type = "button";
    b.addEventListener("click", () => { const [pf, pc] = presets[l]; if (okF(pf) && okC(pc)) { f = pf; c = pc; fill(); restart(); } });
    presetRow.append(b);
    return b;
  });
  const fRow = el("div", "unit-row"), cRow = el("div", "unit-row");
  const fIn = document.createElement("input"); fIn.type = "number"; fIn.step = "any"; fIn.min = "0";
  const fSel = document.createElement("select");
  for (const [u] of WT_F_UNITS) { const o = document.createElement("option"); o.value = u; o.textContent = u; fSel.append(o); }
  fSel.style.fontFamily = "var(--body)";
  fIn.setAttribute("aria-label", "frequency"); fSel.setAttribute("aria-label", "frequency unit");
  fRow.append(el("label", null, "frequency f"), fIn, fSel);
  const cIn = document.createElement("input"); cIn.type = "number"; cIn.step = "any"; cIn.min = "0"; cIn.max = "3";
  cIn.setAttribute("aria-label", "propagation speed, in units of 10 to the 8 metres per second");
  cRow.append(el("label", null, "propagation speed c"), cIn, el("span", null, "× 10⁸ m/s"));
  for (const [label, v] of [["vacuum: 3", 3e8], ["cable: 2", 2e8]]) {
    const b = el("button", "viz-btn", label);
    b.type = "button";
    b.addEventListener("click", () => { c = v; fill(); restart(); });
    cRow.append(b);
  }
  const predictLabel = el("label", "playback-check");
  const predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = predict;
  predictLabel.append(predictBox, " Predict each period before it is shown");
  const svg = svgEl("svg", { viewBox: "0 0 640 210", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  const NOTE = "Frequency is set by the sender and is independent of the medium. Wavelength relies on both: change the propagation speed or the frequency and one cycle covers a different distance. The distance axis keeps its scale while 2 to 10 wavelengths fit on it.";
  box.append(presetRow, fRow, cRow, predictLabel, svg, caption, ask);

  function fill() {
    const u = f >= 1e12 ? WT_F_UNITS[4] : bestUnit(f, WT_F_UNITS.slice(0, 4));
    fSel.value = u[0]; fIn.value = fmtNum(f / u[1], 6); cIn.value = fmtNum(c / 1e8, 6);
  }
  const fmtF = (v) => (v >= 1e12 ? `${sci(v)} Hz` : fmtHz(v));
  const fmtC = () => `${sci(c, 8)} m/s`;
  // Times and distances keep the unit (or the power of ten) of T and λ, so a row of them compares at a glance.
  function fmtT(t, digits = 2) {
    const T = 1 / f;
    if (!(t > 0)) return "0";
    if (T >= 1e-12) { const u = bestUnit(T, TIME_UNITS); return `${fmtNum(t / u[1], digits)} ${u[0]}`; }
    const e = pow10(T);
    return `${fmtNum(t / 10 ** e, digits)} × 10${sup(e)} s`;
  }
  function fmtD(d, digits = 4) {
    const lam = c / f;
    if (!(d > 0)) return "0";
    const [u, k] = lam < 1e-4 ? ["μm", 1e-6] : lam < 1e-2 ? ["mm", 1e-3] : lam < 1e3 ? ["m", 1] : ["km", 1e3];
    return `${fmtNum(d / k, digits)} ${u}`;
  }
  const asking = (pos) => predict && answered < count && Math.abs(pos - answered) < 1e-6;
  /** Multiples of λ offered before period k; k itself is the right one. */
  function choices(k) {
    const cand = [k, k - 1, k + 1, k / 2, 2 * k, 10 * k], picked = [];
    for (const m of cand) if (m > 0 && !picked.includes(m) && picked.length < 4) picked.push(m);
    return picked.sort((p, q) => p - q);
  }
  function answer(m, e) {
    asked += wrong == null && !missed ? 1 : 0;
    if (m !== answered + 1) { missed = true; wrong = m; refocus = e.detail === 0; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; refocus = e.detail === 0; answered++;
    pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${f}|${c}|${answered}|${wrong}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!key) return;
    const lam = c / f, k = answered + 1;
    const btns = choices(k).map((m) => {
      const b = el("button", "viz-btn" + (m === wrong ? " playback-wrong" : ""), fmtD(m * lam));
      b.type = "button";
      b.addEventListener("click", (e) => answer(m, e));
      ask.append(b);
      return b;
    });
    if (wrong != null) {
      ask.append(el("span", "playback-feedback", k === 1
        ? `Not ${fmtD(wrong * lam)}. Wavelength is the distance a simple signal can travel in one period: λ = c / f = c × T, with c = ${fmtC()} and f = ${fmtF(f)}.`
        : `Not ${fmtD(wrong * lam)}. The signal travels one wavelength in each period, so after ${k} periods the front is ${k} wavelengths from the sender.`));
    }
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function frame(pos) {
    const lam = c / f, T = 1 / f, X0 = 66, X1 = 622, YC = 76, AMP = 34, YD = 154, YT = 186;
    const x = (d) => X0 + (d / span) * (X1 - X0);
    const q = asking(pos), k = Math.ceil(pos - 1e-9), done = Math.floor(pos + 1e-9), front = pos * lam;
    const known = !predict || answered >= 1, hot = q ? answered + 1 : k;
    const txt = (xx, yy, s, fill = "var(--ink-dim)", anchor = "middle", size = 10.5) => svg.append(svgEl("text", { x: xx, y: yy, "text-anchor": anchor, "font-size": size, fill, style: "font-family: var(--body)" }, s));
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: X0, y: YC - AMP - 8, width: X1 - X0, height: 2 * AMP + 16, fill: "var(--paper-2)", stroke: "var(--rule-strong)", "stroke-width": 1 }));
    if (hot >= 1) svg.append(svgEl("rect", { x: x((hot - 1) * lam), y: YC - AMP - 8, width: Math.min(x(hot * lam), X1) - x((hot - 1) * lam), height: 2 * AMP + 16, fill: "var(--hl-soft)" }));
    txt(X0, 13, `sender: f = ${fmtF(f)}`, "var(--ink-dim)", "start");
    txt(X1, 13, `transmission medium: c = ${fmtC()}`, "var(--ink-dim)", "end");
    svg.append(svgEl("line", { x1: X0, y1: YC, x2: X1, y2: YC, stroke: "var(--rule-strong)" }));
    if (pos > 0) {
      const pts = [], n = Math.max(2, Math.ceil(pos * 48));
      for (let i = 0; i <= n; i++) { const d = (front * i) / n; pts.push([x(d), YC - AMP * Math.sin(2 * Math.PI * (pos - d / lam))]); }
      svg.append(polyline(pts, "var(--blue)", 2.4));
    }
    // Each finished cycle is one wavelength long; the bracket marks the newest one.
    if (done >= 1 && known) {
      const xa = x((done - 1) * lam), xb = x(done * lam), yb = 128;
      svg.append(svgEl("line", { x1: xa, y1: yb, x2: xb, y2: yb, stroke: "var(--green)", "stroke-width": 2 }));
      for (const xx of [xa, xb]) svg.append(svgEl("line", { x1: xx, y1: yb - 5, x2: xx, y2: yb + 5, stroke: "var(--green)", "stroke-width": 2 }));
      txt((xa + xb) / 2, yb + 13, `λ = ${fmtD(lam)}`, "var(--green)");
    }
    // Distance and time axes share the x scale: one tick is one wavelength above and one period below.
    const ticks = Math.floor(span / lam + 1e-6), every = ticks > 6 ? 2 : 1;
    for (const [yy, title, color, value, shown] of [[YD, "distance", "var(--blue)", (i) => fmtD(i * lam), predict ? answered : ticks], [YT, "time", "var(--hl)", (i) => fmtT(i * T), ticks]]) {
      txt(X0 - 8, yy + 4, title, "var(--ink-dim)", "end");
      svg.append(svgEl("line", { x1: X0, y1: yy, x2: X1, y2: yy, stroke: "var(--rule-strong)" }));
      if (pos > 0) svg.append(svgEl("line", { x1: X0, y1: yy, x2: x(front), y2: yy, stroke: color, "stroke-width": 4, "stroke-linecap": "round" }));
      for (let i = 0; i <= ticks; i++) {
        const xx = x(i * lam);
        svg.append(svgEl("line", { x1: xx, y1: yy - 4, x2: xx, y2: yy + 4, stroke: "var(--ink-dim)" }));
        if (i <= shown && i % every === 0) txt(xx, yy + 16, value(i), i <= done ? "var(--ink)" : "var(--ink-dim)", xx > X1 - 34 ? "end" : "middle", 10);
      }
    }
    svg.append(svgEl("circle", { cx: X0, cy: YC - AMP * Math.sin(2 * Math.PI * pos), r: 4, fill: "var(--blue)", stroke: "var(--paper-2)", "stroke-width": 1.5 }));
    if (pos > 0) {
      const xf = x(front);
      svg.append(svgEl("line", { x1: xf, y1: YC - AMP - 8, x2: xf, y2: YT, stroke: "var(--hl)", "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
      svg.append(svgEl("circle", { cx: xf, cy: YC, r: 5, fill: "var(--hl)" }));
      txt(clamp(xf, X0 + 60, X1 - 60), 29, `front: ${fmtD(front, 2)} after ${fmtT(pos * T, 2)}`, "var(--hl)");
    }
    let text;
    if (q) {
      text = answered === 0
        ? `The sender's frequency is ${fmtF(f)} and the propagation speed of the medium is ${fmtC()}. How far will the front of the signal travel in the first period?`
        : `After ${answered} period${answered === 1 ? "" : "s"} the front is ${fmtD(answered * lam)} from the sender. Where will it be after period ${answered + 1}?`;
    } else if (k < 1) text = `Press Play. The sender completes one cycle every period, T = 1/f = ${fmtT(T)}. Watch how far the front of the signal travels in that time.`;
    else {
      text = `Period ${k}: in one period, T = ${fmtT(T)}, the signal travels c × T = ${fmtC()} × ${fmtT(T)} = ${fmtD(lam)}, which is one wavelength. After ${k} period${k === 1 ? "" : "s"}: elapsed time ${fmtT(k * T)}, distance ${fmtD(k * lam)}.`;
      if (pos >= count && asked > 0) text += ` All ${count} periods are shown: ${firstTry} of ${asked} right on the first try.`;
    }
    if (caption.textContent !== text) caption.textContent = text;
    const key = `${f}|${c}|${known}|${done}`;
    if (key !== gridKey) {
      gridKey = key;
      grid(out, [
        ["Period T = 1/f", fmtT(T), `1 / ${fmtF(f)}`],
        ["Wavelength λ = c / f", known ? fmtD(lam) : "?", known ? `${fmtC()} / ${fmtF(f)} = c × T` : "predict it first"],
        [`Front after ${done} period${done === 1 ? "" : "s"}`, fmtD(done * lam), `${done} × λ, at time ${done} × T = ${fmtT(done * T)}`],
      ]);
    }
    renderAsk(pos);
  }
  function restart() {
    const lam = c / f, fits = span / lam;
    if (!(fits >= 2 - 1e-6 && fits <= 10 + 1e-6)) span = periods * lam;
    count = clamp(Math.floor(span / lam + 1e-6), 1, 10);
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null; gridKey = null;
    presetBtns.forEach((b, i) => { const [pf, pc] = presets[labels[i]]; b.classList.toggle("active", Math.abs(pf / f - 1) < 1e-9 && Math.abs(pc / c - 1) < 1e-9); });
    note.textContent = NOTE;
    pb.reset(count);
  }
  span = periods * (c / f);
  pb = createPlayback({
    count, unit: "period", onFrame: frame,
    stepMs: () => cfg.stepMs || 1800,
    limit: () => (predict ? answered : count),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, out, note);
  function typed() {
    const nf = parseFloat(fIn.value) * WT_F_UNITS.find(([u]) => u === fSel.value)[1], nc = parseFloat(cIn.value) * 1e8;
    if (!okF(nf)) { note.textContent = "Type a frequency greater than 0."; return; }
    if (!okC(nc)) { note.textContent = "Type a propagation speed above 0 and no more than 3 (× 10⁸ m/s, the speed in a vacuum)."; return; }
    f = nf; c = nc; restart();
  }
  fIn.addEventListener("input", typed); fSel.addEventListener("change", typed); cIn.addEventListener("input", typed);
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    // Periods already on screen count as answered; the questions start at the next one.
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null; gridKey = null;
    pb.set(pb.pos());
  });
  fill();
  restart();
}

// ---------- widget: signal-levels ----------
const SLIDE_SEQ = { 2: [1, 0, 1, 1, 0, 0, 0, 1], 4: [3, 2, 1, 1, 0, 0, 0, 2] };
function signalLevels(box, cfg) {
  let L = clamp(Math.round(cfg.levels ?? 4), 2, 16);
  box.append(el("h4", null, cfg.title || "Digital signal levels: how many bits per signal element?"));
  const s = slider("L levels", 2, 16, 1, L, (v) => { L = v; draw(); }, (v) => String(v));
  const svg = svgEl("svg", { viewBox: "0 0 640 260", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(s.row, svg, out, note);
  function seq(L) {
    if (SLIDE_SEQ[L]) return SLIDE_SEQ[L];
    const a = []; let x = 7; for (let i = 0; i < 8; i++) { x = (x * 31 + 11) % 97; a.push(x % L); } return a;
  }
  function draw() {
    svg.innerHTML = "";
    const bits = Math.ceil(Math.log2(L)), raw = Math.log2(L);
    const X0 = 70, X1 = 610, Y0 = 40, Y1 = 220, ELEMS = 8;
    const yOf = (lvl) => Y1 - (Y1 - Y0) * (L === 1 ? 0 : lvl / (L - 1));
    for (let l = 0; l < L; l++) {
      svg.append(svgEl("line", { x1: X0, y1: yOf(l), x2: X1, y2: yOf(l), stroke: "var(--rule)", "stroke-dasharray": "3 4" }));
      if (L <= 8 || l === 0 || l === L - 1 || l % 4 === 3) svg.append(svgEl("text", { x: X0 - 6, y: yOf(l) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, `Level ${l + 1}`));
    }
    const vals = seq(L);
    const w = (X1 - X0) / ELEMS;
    const pts = [];
    vals.forEach((v, i) => {
      const xa = X0 + w * i, xb = xa + w;
      pts.push([xa, yOf(v)], [xb, yOf(v)]);
      svg.append(svgEl("line", { x1: xa, y1: Y0 - 20, x2: xa, y2: Y1 + 8, stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      svg.append(svgEl("text", { x: (xa + xb) / 2, y: Y0 - 8, "text-anchor": "middle", "font-size": 12, fill: "var(--hl)", "font-weight": "600" }, v.toString(2).padStart(bits, "0")));
    });
    svg.append(polyline(pts, "var(--blue)", 2.5));
    svg.append(svgEl("line", { x1: X0, y1: Y1 + 24, x2: X1, y2: Y1 + 24, stroke: "var(--green)", "stroke-width": 1.5 }));
    svg.append(svgEl("text", { x: (X0 + X1) / 2, y: Y1 + 38, "text-anchor": "middle", "font-size": 11, fill: "var(--green)" }, `${ELEMS} signal elements in 1 s → ${ELEMS} × ${bits} = ${ELEMS * bits} bits sent in 1 s → bit rate ${ELEMS * bits} bps`));
    const unused = 2 ** bits - L;
    grid(out, [
      ["log₂ L", fmtNum(raw, 4), Number.isInteger(raw) ? "a whole number: every bit pattern is used" : "not a whole number, so round UP"],
      ["Bits per element ⌈log₂ L⌉", String(bits), `2^${bits} = ${2 ** bits} patterns available for ${L} levels`],
      ["Unused bit patterns", String(unused), unused ? "the slide calls a non-power-of-2 level count 'not realistic'" : "none: L is a power of 2"],
      ["Bit rate at 8 elements/s", `${ELEMS * bits} bps`, "same element rate, more levels → more bits per second"],
    ]);
    note.textContent = L === 2 ? "The slide's two-level signal: 1 0 1 1 0 0 0 1, 8 bits in 1 s, bit rate 8 bps." : L === 4 ? "The slide's four-level signal: 11 10 01 01 00 00 00 10, 16 bits in 1 s, bit rate 16 bps. Same 8 elements, twice the bits." : L === 11 ? "The slide's example: log₂ 11 = 3.46 bits is not realistic; use 4 bits (a whole number, usually a power of 2)." : "Drag to 2, 4 and 11 to reproduce the three cases from the lecture.";
  }
  draw();
}

// ---------- shared: predict mode for the -play widgets ----------
/**
 * Before step k + 1 (k counts from 0) the playback bar waits until the student picks the right choice.
 * question(k) returns null for a step with nothing to ask, or
 * { text, choices: [[label, value], ...], right: value, why: (wrongValue) => "the rule" }.
 * Returns { check, ask, on, asking(pos), limit(), render(pos, salt), reset(), tally(), blocked(), bind(pb) }.
 */
export function createPredict({ on, label, count, question, redraw }) {
  const s = { on: !!on, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: null, key: null, refocus: false, pb: null };
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = !s.on;
  const check = el("label", "playback-check");
  const box = document.createElement("input");
  box.type = "checkbox"; box.checked = s.on;
  check.append(box, " " + label);
  // Steps with nothing to ask play straight through.
  const skip = () => { const n = count(); while (s.on && s.answered < n && !question(s.answered)) s.answered++; };
  function pick(v, e, Q) {
    s.asked += s.wrong == null && !s.missed ? 1 : 0;
    if (v !== Q.right) { s.missed = true; s.wrong = v; s.refocus = e.detail === 0; redraw(); return; }
    if (!s.missed) s.firstTry++;
    s.missed = false; s.wrong = null; s.refocus = e.detail === 0; s.answered++;
    // play on to the next question (steps with nothing to ask play straight through)
    skip(); s.pb.play();
  }
  const api = {
    check, ask,
    get on() { return s.on; },
    bind(pb) { s.pb = pb; },
    limit() { skip(); return s.on ? s.answered : count(); },
    asking(pos) { skip(); return s.on && s.answered < count() && Math.abs(pos - s.answered) < 1e-6; },
    question: () => question(s.answered),
    reset() { s.answered = 0; s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.key = null; },
    tally() { return s.asked > 0 ? ` ${s.firstTry} of ${s.asked} right on the first try.` : ""; },
    blocked() { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
    render(pos, salt = "") {
      const key = api.asking(pos) ? `${salt}|${s.answered}|${s.wrong}` : "";
      if (key === s.key) return;
      s.key = key; ask.innerHTML = ""; ask.hidden = !s.on;
      if (!key) return;
      const Q = question(s.answered);
      const btns = Q.choices.map(([text, v]) => {
        const b = el("button", "viz-btn" + (v === s.wrong ? " playback-wrong" : ""), text);
        b.type = "button";
        b.addEventListener("click", (e) => pick(v, e, Q));
        ask.append(b);
        return b;
      });
      if (s.wrong != null) {
        const w = Q.choices.find((c) => c[1] === s.wrong);
        ask.append(el("span", "playback-feedback", `Not ${w ? w[0] : s.wrong}. ${Q.why(s.wrong)}`));
      }
      if (s.refocus) { s.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
    },
  };
  box.addEventListener("change", () => {
    s.on = box.checked; s.pb.pause();
    // Steps already on screen count as answered; the questions start at the next one.
    s.answered = Math.ceil(s.pb.pos() - 1e-9); s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.key = null;
    s.pb.set(s.pb.pos());
  });
  return api;
}
/** The playback bar wired to a predictor: one call per widget. */
function playbackWith(P, opts) {
  const pb = createPlayback({ ...opts, limit: () => P.limit(), onBlocked: () => P.blocked() });
  P.bind(pb);
  return pb;
}
const smooth = (f) => f * f * (3 - 2 * f);
function svgText(svg, x, y, s, { fill = "var(--ink-dim)", anchor = "middle", size = 10.5, weight } = {}) {
  const attrs = { x, y, "text-anchor": anchor, "font-size": size, fill, style: "font-family: var(--body)" };
  if (weight) attrs["font-weight"] = weight;
  svg.append(svgEl("text", attrs, s));
}

// ---------- widget: duplex-play ----------
// The slide's three data-flow pictures side by side, one time slot per step.
function duplexPlay(box, cfg) {
  const slots = clamp(Math.round(cfg.slots ?? 4), 2, 8);
  const half = (t) => (t % 2 === 1 ? "A" : "B"), other = (s) => (s === "A" ? "B" : "A");
  let pb = null;
  box.append(el("h4", null, cfg.title || "Simplex, half-duplex and full-duplex, one time slot at a time"));
  const CHOICES = [["A only", "A"], ["B only", "B"], ["A and B together", "AB"]];
  const P = createPredict({
    on: cfg.predict, label: "Predict who sends before each time slot", count: () => slots, redraw: () => frame(pb.pos()),
    question: (k) => {
      const t = k + 1;
      if (t === 1) return { text: "Time 1. Who sends on the full-duplex link?", choices: CHOICES, right: "AB", why: () => "Full-duplex is two-directional communication, simultaneously: the data flows both ways all the time." };
      return {
        text: `Time ${t}. Who may send on the half-duplex link?`, choices: CHOICES, right: half(t),
        why: () => `Half-duplex is two-directional communication, one at a time: ${half(t - 1)} sent at time ${t - 1}, so now the direction reverses.`,
      };
    },
  });
  const svg = svgEl("svg", { viewBox: "0 0 640 318", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(P.check, svg, caption, P.ask);
  const ROWS = [
    { name: "Simplex", sub: "unidirectional", left: "Mainframe", right: "Monitor", y: 62 },
    { name: "Half-duplex", sub: "two-directional, one at a time", left: "A", right: "B", y: 152 },
    { name: "Full-duplex", sub: "two-directional, simultaneously", left: "A", right: "B", y: 242 },
  ];
  const LX0 = 196, LX1 = 444, FW = 46;
  function station(x, y, label, sending, listening) {
    svg.append(svgEl("rect", { x, y: y - 20, width: 92, height: 40, rx: 5, fill: "var(--paper-3)", stroke: sending ? "var(--hl)" : "var(--rule-strong)", "stroke-width": sending ? 2.2 : 1.2, opacity: listening ? 0.75 : 1 }));
    svgText(svg, x + 46, y + 4, label, { fill: sending ? "var(--hl)" : "var(--ink-2)", size: 12, weight: sending ? "700" : null });
  }
  // A frame on its way: an arrow-shaped block, `dir` 1 = left to right.
  function frameBlock(f, y, h, dir) {
    const x = dir > 0 ? LX0 + (LX1 - LX0 - FW) * smooth(f) : LX1 - FW - (LX1 - LX0 - FW) * smooth(f);
    const tip = dir > 0 ? x + FW : x, back = dir > 0 ? x : x + FW, notch = dir > 0 ? tip - 8 : tip + 8;
    svg.append(svgEl("polygon", { points: `${back},${y - h / 2} ${notch},${y - h / 2} ${tip},${y} ${notch},${y + h / 2} ${back},${y + h / 2}`, fill: "var(--blue)", opacity: 0.9 }));
  }
  function frame(pos) {
    const q = P.asking(pos), t = Math.ceil(pos - 1e-9), f = t > 0 ? pos - (t - 1) : 0;
    const shown = q ? 0 : t; // while a question waits, the next slot is not drawn yet
    svg.innerHTML = "";
    ROWS.forEach((r, i) => {
      const y = r.y;
      svgText(svg, 10, y - 30, r.name, { anchor: "start", fill: "var(--ink)", size: 12.5, weight: "600" });
      svgText(svg, 10 + r.name.length * 7.6 + 8, y - 30, r.sub, { anchor: "start", size: 11 });
      const sender = !shown ? "" : i === 0 ? "A" : i === 1 ? half(shown) : "AB";
      station(100, y, r.left, sender.includes("A"), shown && !sender.includes("A"));
      station(448, y, r.right, sender.includes("B"), shown && !sender.includes("B"));
      svg.append(svgEl("rect", { x: LX0, y: y - 11, width: LX1 - LX0, height: 22, fill: "var(--paper-2)", stroke: "var(--rule-strong)", "stroke-width": 1 }));
      if (i === 2) svg.append(svgEl("line", { x1: LX0, y1: y, x2: LX1, y2: y, stroke: "var(--rule-strong)", "stroke-dasharray": "4 3" }));
      if (!shown) return;
      if (i === 0) frameBlock(f, y, 16, 1);
      else if (i === 1) frameBlock(f, y, 16, half(shown) === "A" ? 1 : -1);
      else { frameBlock(f, y - 5.5, 7, 1); frameBlock(f, y + 5.5, 7, -1); }
      const dirText = i === 0 ? "direction of data" : i === 1 ? `direction of data at time ${shown}` : "direction of data all the time";
      svgText(svg, (LX0 + LX1) / 2, y + 26, dirText, { size: 10 });
    });
    // Time slots along the bottom; the slot being drawn is highlighted.
    const SX = 196, SW = (LX1 - LX0) / slots;
    for (let s = 1; s <= slots; s++) {
      const hot = s === (q ? t + 1 : t);
      svg.append(svgEl("rect", { x: SX + (s - 1) * SW + 2, y: 290, width: SW - 4, height: 20, rx: 3, fill: hot ? "var(--hl-soft)" : "var(--paper-2)", stroke: hot ? "var(--hl)" : "var(--rule)" }));
      svgText(svg, SX + (s - 0.5) * SW, 304, `time ${s}`, { fill: hot ? "var(--hl)" : "var(--ink-dim)", size: 10 });
    }
    svgText(svg, SX - 8, 304, "slot", { anchor: "end", size: 10 });
    let text;
    if (q) text = P.question().text;
    else if (t <= 0) text = "One step is one time slot. Simplex sends one way only; half-duplex sends both ways, one at a time; full-duplex sends both ways at once.";
    else {
      const s = half(t);
      text = `Time ${t}: half-duplex, ${t > 1 ? `${s} now sends` : `${s} sends`}; ${other(s)} may only listen. Simplex still sends mainframe to monitor only, and full-duplex sends both ways at once, so the two directions share the capacity of the link.`;
      if (pos >= slots) text += P.tally();
    }
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos);
  }
  pb = playbackWith(P, { count: slots, unit: "time slot", stepMs: () => cfg.stepMs || 1500, onFrame: frame });
  box.append(pb.el, el("p", "widget-note", "Full-duplex is drawn as one link split into two lanes: either two physically separate paths, or the link's capacity divided between the two directions. Shared, not doubled."));
}

// ---------- widget: forward-play ----------
// A frame from A to D through a hub, a switch or a router: one hop per step.
const FWD = {
  hub: { name: "Hub", out: [2, 3, 4], layer: "physical layer only" },
  switch: { name: "Switch", out: [4], layer: "physical + data link" },
  router: { name: "Router", out: [4], layer: "physical + data link + network" },
};
function forwardPlay(box, cfg) {
  const kinds = Object.keys(FWD);
  let kind = FWD[cfg.device] ? cfg.device : "hub", pb = null;
  box.append(el("h4", null, cfg.title || "Where a frame from A to D goes: hub, switch, router"));
  const PORT_CHOICES = [["port 4 only", "4"], ["ports 2, 3 and 4", "234"], ["all four ports, 1 to 4", "1234"]];
  const ADDR_CHOICES = [["source A, destination D", "AD"], ["source R4, destination D", "R4D"], ["source A, destination R1", "AR1"]];
  const P = createPredict({
    on: cfg.predict, label: "Predict where the frame goes before each hop", count: () => 3, redraw: () => frame(pb.pos()),
    question: (k) => {
      if (k === 1) return {
        text: `The frame is at port 1 of the ${kind}. Which ports does it send the frame out of?`, choices: PORT_CHOICES, right: kind === "hub" ? "234" : "4",
        why: () => kind === "hub" ? "A hub reads nothing: it forwards the signal to all outgoing ports except the one from which the signal was received."
          : kind === "switch" ? "A switch has filtering capability: it checks the destination MAC address and decides from which outgoing port the frame should be sent."
            : "The router reads the destination IP address in H_N and sends the packet toward D's network only.",
      };
      if (k === 2) return {
        text: "Which link-layer addresses does the frame that reaches D carry?", choices: ADDR_CHOICES, right: kind === "router" ? "R4D" : "AD",
        why: () => kind === "router" ? "A router changes the link-layer address of the packet (both source and destination) when it forwards it: the source is now its own outgoing interface."
          : `A ${kind} does not rewrite the frame: H_L still holds the addresses A put there.`,
      };
      return null;
    },
  });
  box.append(btnRow(kinds.map((k) => FWD[k].name), (i) => { kind = kinds[i]; P.reset(); pb.reset(3); }, kinds.indexOf(kind)), P.check);
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(svg, caption, P.ask);
  const HOSTS = { A: [70, 52, 1], B: [70, 192, 2], C: [570, 52, 3], D: [570, 192, 4] };
  const PORTS = { 1: [262, 100], 2: [262, 144], 3: [378, 100], 4: [378, 144] };
  const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  /** Along A → port → (through the device) → port → host; f in [0, 1]. */
  const along = (pts, f) => {
    const seg = pts.length - 1, u = Math.min(seg - 1e-9, f * seg), i = Math.floor(u);
    return lerp(pts[i], pts[i + 1], u - i);
  };
  function header(y, hl, hn, fresh) {
    let x = 140;
    const part = (label, w, fill) => {
      svg.append(svgEl("rect", { x, y, width: w, height: 24, rx: 3, fill, opacity: 0.9 }));
      svgText(svg, x + w / 2, y + 16, label, { fill: "#101418", size: 11.5 });
      x += w + 4;
    };
    if (hl) part(`H_L${fresh ? "'" : ""}: src ${hl[0]}, dst ${hl[1]}`, 170, "var(--blue)");
    part("H_N: src A, dst D", 130, "var(--hl)");
    part("data", 60, "var(--green)");
  }
  function frame(pos) {
    const q = P.asking(pos), t = Math.ceil(pos - 1e-9), f = t > 0 ? pos - (t - 1) : 0, e = smooth(f);
    const shown = q ? Math.floor(pos + 1e-9) : t, router = kind === "router", out = FWD[kind].out;
    svg.innerHTML = "";
    // the device and its four ports
    svg.append(svgEl("rect", { x: 262, y: 84, width: 116, height: 76, rx: 6, fill: "var(--paper-3)", stroke: "var(--hl)", "stroke-width": 2 }));
    svgText(svg, 320, 118, FWD[kind].name, { fill: "var(--hl)", size: 13, weight: "600" });
    svgText(svg, 320, 134, FWD[kind].layer, { size: 9.5 });
    for (const [name, [hx, hy, p]] of Object.entries(HOSTS)) {
      const [px, py] = PORTS[p], lit = shown >= 2 && out.includes(p) || p === 1 && shown >= 1;
      svg.append(svgEl("line", { x1: hx + (hx < 320 ? 22 : -22), y1: hy, x2: px, y2: py, stroke: lit ? "var(--blue)" : "var(--rule-strong)", "stroke-width": lit ? 2.2 : 1.4 }));
      svg.append(svgEl("circle", { cx: px, cy: py, r: 5, fill: lit ? "var(--blue)" : "var(--paper-2)", stroke: "var(--ink-dim)" }));
      svgText(svg, px + (px < 320 ? 11 : -11), py + 4, router ? `R${p}` : String(p), { size: 10, fill: "var(--ink-2)" });
      svg.append(svgEl("circle", { cx: hx, cy: hy, r: 22, fill: "var(--paper)", stroke: name === "A" || name === "D" ? "var(--blue)" : "var(--rule-strong)", "stroke-width": 2 }));
      svgText(svg, hx, hy + 5, name, { fill: "var(--ink)", size: 14 });
      if (router) svgText(svg, hx, hy + 38, `network ${p}`, { size: 9.5 });
      // step 3: who keeps the frame and who drops it
      if (shown >= 3 && name !== "A" && (out.includes(p))) {
        const keep = name === "D";
        svgText(svg, hx + (hx < 320 ? -30 : 30), hy - 26, keep ? "✓ keeps" : "✗ drops", { fill: keep ? "var(--green)" : "var(--red)", size: 11, weight: "600" });
      }
    }
    svgText(svg, 320, 70, router ? "each port is a different network" : "one LAN: A, B, C and D share it", { size: 10 });
    // the frame in motion
    const dot = ([x, y], hot = true) => svg.append(svgEl("circle", { cx: x, cy: y, r: 6.5, fill: hot ? "var(--hl)" : "var(--blue)", stroke: "var(--paper)", "stroke-width": 1.5 }));
    const A = [HOSTS.A[0] + 22, HOSTS.A[1]];
    if (!q && t === 1) dot(lerp(A, PORTS[1], e));
    if (!q && t === 2) for (const p of out) { const h = Object.values(HOSTS).find((v) => v[2] === p); dot(along([PORTS[1], PORTS[p], [h[0] + (h[0] < 320 ? 22 : -22), h[1]]], e)); }
    if (shown === 1 && (q || t === 1 && f >= 1)) dot(PORTS[1], false);
    // the frame's headers as they are now
    const hl = router ? (shown >= 2 ? (q && shown === 2 ? ["?", "?"] : ["R4", "D"]) : ["A", "R1"]) : ["A", "D"];
    const midRouter = router && !q && t === 2 && f < 0.5;
    svgText(svg, 132, 262, shown >= 2 && !midRouter ? "frame on the outgoing link:" : "frame from A:", { anchor: "end", size: 10.5 });
    header(246, midRouter ? null : router && shown >= 2 && !midRouter ? hl : router ? ["A", "R1"] : hl, null, router && shown >= 2 && !midRouter && !(q && shown === 2));
    if (midRouter) svgText(svg, 470, 262, "H_L stripped inside the router", { size: 10.5, fill: "var(--red)", anchor: "start" });

    let text;
    if (q) text = P.question().text;
    else if (t <= 0) text = router ? "A sends a packet to D, which is on another network. One step is one hop." : `A sends a frame to D. A, B, C and D are on one LAN joined by a ${kind}. One step is one hop.`;
    else if (t === 1) text = router
      ? "Step 1: D is on another network, so A addresses the frame to the router: H_L has source MAC A and destination MAC R1 (the router's port-1 interface); H_N has source IP A and destination IP D."
      : `Step 1: A sends the frame. H_L carries source MAC A and destination MAC D; it reaches the ${kind} on port 1.`;
    else if (t === 2) text = kind === "hub"
      ? "Step 2: a hub works in the physical layer and reads nothing. It repeats the signal out of all outgoing ports except the one from which it was received: ports 2, 3 and 4."
      : kind === "switch"
        ? "Step 2: the switch regenerates the signal and checks the destination MAC, D. Filtering: it sends the frame out of port 4 only, the port that leads to D."
        : "Step 2: the router acts on the frame only because its destination MAC is R1, the interface it arrived on. It strips H_L, reads the destination IP D in H_N, writes a new H_L' (source R4, destination D) and sends it out of port 4.";
    else {
      text = kind === "hub"
        ? "Step 3: B and C see destination MAC D, not their own, and drop the frame; D keeps it. The hub did not change the frame: source A, destination D."
        : kind === "switch"
          ? "Step 3: only D receives the frame, with H_L unchanged (source A, destination D). B and C never see it."
          : "Step 3: D keeps the frame. Both link-layer addresses changed (A → R4, R1 → D); the IP addresses in H_N (A to D) did not.";
      if (pos >= 3) text += P.tally();
    }
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos, kind);
  }
  pb = playbackWith(P, { count: 3, unit: "hop", stepMs: () => cfg.stepMs || 1600, onFrame: frame });
  box.append(pb.el, el("p", "widget-note", "Hub: repeats to every other port. Switch: filtering, one outgoing port chosen from the destination MAC. Router: acts only on frames addressed to its interface, then replaces both link-layer addresses."));
}

// ---------- widget: bit-stream-play ----------
// Bits leaving a sender one bit duration at a time; each one occupies one bit length of the medium.
const RATE_UNITS = [["bps", 1], ["kbps", 1e3], ["Mbps", 1e6], ["Gbps", 1e9]];
const BS_PRESETS = {
  "Slide: 1 Mbps at 2 × 10⁸ m/s": [1e6, 2e8],
  "1000 bps (E02 exercise 5)": [1000, 2e8],
  "1 Gbps": [1e9, 2e8],
};
function bitStreamPlay(box, cfg) {
  const okR = (v) => Number.isFinite(v) && v >= 1 && v <= 1e12, okC = (v) => Number.isFinite(v) && v > 0 && v <= 3e8 * (1 + 1e-9);
  const valid = (s) => /^[01]{2,16}$/.test(s);
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : BS_PRESETS;
  const labels = Object.keys(presets);
  let bits = valid(cfg.bits || "") ? cfg.bits : "10110001";
  let rate = okR(cfg.rate) ? cfg.rate : 1e6, c = okC(cfg.speed) ? cfg.speed : 2e8, pb = null;
  const N = () => bits.length, L = () => c / rate, Tb = () => 1 / rate;
  const fmtD = (d) => (d >= 1000 ? `${fmtNum(d / 1000, 3)} km` : d >= 1 ? `${fmtNum(d, 3)} m` : `${fmtNum(d * 100, 3)} cm`);
  const fmtR = (r) => fmtWith(r, RATE_UNITS);
  const fmtC = () => `${fmtNum(c / 1e8, 3)} × 10⁸ m/s`;
  box.append(el("h4", null, cfg.title || "Bits leaving the sender: bit duration in time, bit length on the cable"));
  const presetRow = el("div", "viz-btn-row");
  const presetBtns = labels.map((l) => {
    const b = el("button", "viz-btn", l);
    b.type = "button";
    b.addEventListener("click", () => { const [r, s] = presets[l]; if (okR(r) && okC(s)) { rate = r; c = s; fill(); restart(); } });
    presetRow.append(b);
    return b;
  });
  const bRow = el("div", "unit-row"), rRow = el("div", "unit-row"), cRow = el("div", "unit-row");
  const bIn = document.createElement("input"); bIn.value = bits; bIn.maxLength = 16; bIn.spellcheck = false; bIn.setAttribute("aria-label", "bits");
  bRow.append(el("label", null, "bits"), bIn);
  const rIn = document.createElement("input"); rIn.type = "number"; rIn.step = "any"; rIn.min = "0"; rIn.setAttribute("aria-label", "bit rate");
  const rSel = document.createElement("select"); rSel.setAttribute("aria-label", "bit rate unit"); rSel.style.fontFamily = "var(--body)";
  for (const [u] of RATE_UNITS) { const o = document.createElement("option"); o.value = u; o.textContent = u; rSel.append(o); }
  rRow.append(el("label", null, "bit rate"), rIn, rSel);
  const cIn = document.createElement("input"); cIn.type = "number"; cIn.step = "any"; cIn.min = "0"; cIn.max = "3";
  cIn.setAttribute("aria-label", "propagation speed, in units of 10 to the 8 metres per second");
  cRow.append(el("label", null, "propagation speed"), cIn, el("span", null, "× 10⁸ m/s"));
  const P = createPredict({
    on: cfg.predict, label: "Predict where bit 1 is before each bit is sent", count: N, redraw: () => frame(pb.pos()),
    question: (k) => {
      const ms = k === 0 ? [1, 0.5, 2, 10] : [k, k + 1, k + 2, 2 * (k + 1)];
      return {
        text: k === 0 ? `The bit rate is ${fmtR(rate)} and the propagation speed is ${fmtC()}. How far does bit 1 travel while it is being sent (one bit duration)?`
          : `Bit ${k} is out and bit 1 is ${fmtD(k * L())} down the cable. How far is bit 1 after the next bit?`,
        choices: [...new Set(ms)].sort((a, b) => a - b).map((m) => [fmtD(m * L()), m]), right: k + 1,
        why: () => k === 0 ? `Bit length = propagation speed × bit duration, and bit duration = 1 / bit rate = ${fmtSec(Tb())}.`
          : `Each bit duration moves every bit on the cable one more bit length (${fmtD(L())}), so after ${k + 1} bits, bit 1 is ${k + 1} bit lengths away.`,
      };
    },
  });
  const svg = svgEl("svg", { viewBox: "0 0 640 214", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(presetRow, bRow, rRow, cRow, P.check, svg, caption, P.ask);
  function fill() {
    const u = bestUnit(rate, RATE_UNITS);
    rSel.value = u[0]; rIn.value = fmtNum(rate / u[1], 6); cIn.value = fmtNum(c / 1e8, 6);
    presetBtns.forEach((b, i) => { const [r, s] = presets[labels[i]]; b.classList.toggle("active", Math.abs(r / rate - 1) < 1e-9 && Math.abs(s / c - 1) < 1e-9); });
  }
  function frame(pos) {
    const n = N(), lam = L(), X0 = 92, X1 = 622, YH = 52, YL = 100, YD = 150, YT = 186;
    const x = (d) => X0 + (d / (n * lam)) * (X1 - X0);
    const q = P.asking(pos), k = Math.ceil(pos - 1e-9), hot = q ? Math.round(pos) + 1 : k;
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 14, y: 40, width: 64, height: 72, rx: 5, fill: "var(--paper-3)", stroke: "var(--hl)", "stroke-width": 1.6 }));
    svgText(svg, 46, 80, "sender", { fill: "var(--ink-2)", size: 11 });
    svg.append(svgEl("rect", { x: X0, y: YH - 10, width: X1 - X0, height: YL - YH + 20, fill: "var(--paper-2)", stroke: "var(--rule-strong)" }));
    svgText(svg, X1, 20, `transmission medium, ${fmtC()}`, { anchor: "end" });
    // Bit i + 1 has its front (pos − i) bit lengths from the sender: bit 1 is always the farthest.
    const pts = [];
    for (let i = 0; i < n; i++) {
      const front = (pos - i) * lam;
      if (front <= 1e-9) break;
      const back = Math.max(0, front - lam), y = bits[i] === "1" ? YH : YL;
      if (i + 1 === hot) svg.append(svgEl("rect", { x: x(back), y: YH - 10, width: x(front) - x(back), height: YL - YH + 20, fill: "var(--hl-soft)" }));
      pts.push([x(front), y], [x(back), y]);
      if (x(front) - x(back) > 26) svgText(svg, (x(front) + x(back)) / 2, (YH + YL) / 2 + 4, `bit ${i + 1}: ${bits[i]}`, { fill: i + 1 === hot ? "var(--hl)" : "var(--ink-2)", size: 10 });
    }
    if (pts.length) svg.append(polyline(pts, "var(--blue)", 2.6));
    // distance and time share the x scale: one tick is one bit length above, one bit duration below
    const every = n > 10 ? 2 : 1, done = Math.floor(pos + 1e-9);
    for (const [yy, title, value, color] of [[YD, "distance", (i) => fmtD(i * lam), "var(--blue)"], [YT, "time", (i) => fmtSec(i * Tb()), "var(--hl)"]]) {
      svgText(svg, X0 - 8, yy + 4, title, { anchor: "end" });
      svg.append(svgEl("line", { x1: X0, y1: yy, x2: X1, y2: yy, stroke: "var(--rule-strong)" }));
      if (pos > 0) svg.append(svgEl("line", { x1: X0, y1: yy, x2: x(pos * lam), y2: yy, stroke: color, "stroke-width": 4, "stroke-linecap": "round" }));
      for (let i = 0; i <= n; i++) {
        svg.append(svgEl("line", { x1: x(i * lam), y1: yy - 4, x2: x(i * lam), y2: yy + 4, stroke: "var(--ink-dim)" }));
        const hide = q && yy === YD && i > done; // the distance answer stays hidden until it is picked
        if (i % every === 0 && !hide) svgText(svg, x(i * lam), yy + 17, i === 0 ? "0" : value(i), { fill: i <= done ? "var(--ink)" : "var(--ink-dim)", size: 9.5, anchor: i === n ? "end" : "middle" });
      }
    }
    if (pos > 0) svg.append(svgEl("line", { x1: x(pos * lam), y1: YH - 10, x2: x(pos * lam), y2: YT, stroke: "var(--hl)", "stroke-dasharray": "3 3" }));
    let text;
    if (q) text = P.question().text;
    else if (k <= 0) text = `The sender puts one bit on the cable every bit duration, 1 / ${fmtR(rate)} = ${fmtSec(Tb())}.`;
    else if (k === 1) text = `Bit 1 leaves after ${fmtSec(Tb())}, one bit duration. In that time its front travels ${fmtC()} × ${fmtSec(Tb())} = ${fmtD(lam)}: the bit length.`;
    else text = `Bit ${k} leaves after ${fmtSec(k * Tb())}; bit 1 is now ${fmtD(k * lam)} down the cable (${fmtD(lam)} per bit).`;
    if (!q && pos >= n) text += ` All ${n} bits are sent: time = bits / bit rate = ${n} / ${fmtR(rate)} = ${fmtSec(n * Tb())}.${P.tally()}`;
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos, `${bits}|${rate}|${c}`);
  }
  function restart() {
    P.reset();
    fill();
    grid(out, [
      ["Bit duration = 1 / bit rate", fmtSec(Tb()), `1 / ${fmtR(rate)}`],
      ["Bit length = speed × duration", P.on ? "?" : fmtD(L()), P.on ? "predict it first" : `${fmtC()} × ${fmtSec(Tb())}`],
      [`Time to send ${N()} bits`, fmtSec(N() * Tb()), `${N()} bits / ${fmtR(rate)}`],
    ]);
    note.textContent = "Bit length is a similar concept to wavelength: the distance one bit occupies on the transmission medium. The level is high for 1 and low for 0; bit 1 left first, so it is the one farthest down the cable.";
    pb.reset(N());
  }
  pb = playbackWith(P, { count: N(), unit: "bit", stepMs: () => cfg.stepMs || 1300, onFrame: frame });
  box.append(pb.el, out, note);
  bIn.addEventListener("input", () => { const v = bIn.value.replace(/[^01]/g, ""); if (valid(v)) { bits = v; restart(); } else note.textContent = "Type 2 to 16 bits, 0s and 1s only."; });
  function typed() {
    const nr = parseFloat(rIn.value) * RATE_UNITS.find(([u]) => u === rSel.value)[1], nc = parseFloat(cIn.value) * 1e8;
    if (!okR(nr)) { note.textContent = "Type a bit rate of at least 1 bps."; return; }
    if (!okC(nc)) { note.textContent = "Type a propagation speed above 0 and no more than 3 (× 10⁸ m/s)."; return; }
    rate = nr; c = nc; restart();
  }
  rIn.addEventListener("input", typed); rSel.addEventListener("change", typed); cIn.addEventListener("input", typed);
  restart();
}

// ---------- widget: harmonic-build-play ----------
// A composite built one component at a time: the sum changes shape and the bandwidth grows.
const HB_PRESETS = {
  "f + 3f + 9f (slide figure)": "1:1 3:0.33 9:0.11",
  "square wave: odd harmonics": "1:1 3:0.333 5:0.2 7:0.143 9:0.111 11:0.0909 13:0.0769 15:0.0667",
};
function harmonicBuildPlay(box, cfg) {
  const presets = cfg.presets && Object.keys(cfg.presets).length ? cfg.presets : HB_PRESETS;
  const labels = Object.keys(presets);
  let comps = parseComponents(cfg.components || "1:1 3:0.33 9:0.11"), pb = null;
  if (!comps.length) comps = parseComponents("1:1 3:0.33 9:0.11");
  const symbolic = () => Math.abs(comps[0].f - 1) < 1e-12; // frequencies written as multiples of f
  const lab = (v) => (symbolic() ? (v === 0 ? "0" : Math.abs(v - 1) < 1e-9 ? "f" : `${fmtNum(v, 3)}f`) : fmtHz(v));
  const key9 = (v) => Number(v.toFixed(9));
  box.append(el("h4", null, cfg.title || "Building a composite signal one component at a time"));
  const input = document.createElement("input");
  input.className = "comp-input"; input.spellcheck = false; input.value = comps.map((c) => `${c.f}:${c.a}`).join(" ");
  input.setAttribute("aria-label", "components as freq:amp pairs");
  const P = createPredict({
    on: cfg.predict, label: "Predict the bandwidth before each component is added", count: () => comps.length, redraw: () => frame(pb.pos()),
    question: (k) => {
      const f0 = comps[0].f, fk = comps[k].f;
      const vals = k === 0 ? [0, f0, 2 * f0] : [fk - f0, comps[k - 1].f - f0, fk, fk + f0];
      return {
        text: k === 0 ? `Start with ${lab(f0)} alone, one simple sine wave. What is its bandwidth?` : `Next: add ${lab(fk)}. What will the bandwidth be?`,
        choices: [...new Set(vals.map(key9))].sort((a, b) => a - b).map((v) => [`B = ${lab(v)}`, v]), right: key9(fk - f0),
        why: () => k === 0 ? "Bandwidth is the highest frequency minus the lowest; with one frequency they are the same."
          : `Bandwidth is the range of frequencies: highest minus lowest. The lowest stays ${lab(f0)}; the highest becomes ${lab(fk)}.`,
      };
    },
  });
  box.append(btnRow(labels, (i) => { input.value = presets[labels[i]]; typed(); }, -1), input, P.check);
  const tSvg = svgEl("svg", { viewBox: "0 0 640 232", class: "curve-svg net-svg" });
  const fSvg = svgEl("svg", { viewBox: "0 0 640 128", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const note = el("p", "widget-note", "The dashed curve is the sum of every component in the list, the shape being built. Each spike in the frequency domain is one simple sine wave.");
  box.append(tSvg, fSvg, caption, P.ask);
  const COLORS = ["var(--blue)", "var(--green)", "var(--purple)", "var(--red)", "var(--hl)", "#f5a3ff", "#6be3ff", "#ffb36b"];
  // odd harmonics f, 3f, 5f, … in order, each with amplitude 1/n: the square-wave series
  const isSquare = () => comps.length > 2 && comps.every((c, j) => { const m = c.f / comps[0].f; return Math.abs(m - (2 * j + 1)) < 1e-9 && Math.abs(c.a - comps[0].a / m) < 0.01 * comps[0].a; });
  function frame(pos) {
    const q = P.asking(pos), k = Math.ceil(pos - 1e-9), fr = k > 0 ? pos - (k - 1) : 0, e = smooth(fr);
    const n = q ? Math.round(pos) : k; // components on screen; the newest grows in as its step is drawn
    const scale = (i) => (i === n - 1 && !q ? e : 1);
    const f0 = comps[0].f, window = 2 / f0, X0 = 50, X1 = 610, YM = 105, S = 300;
    tSvg.innerHTML = ""; fSvg.innerHTML = "";
    const xTicks = [];
    for (let j = 0; j <= 4; j++) xTicks.push([X0 + (X1 - X0) * (j / 4), fmtSec(window * j / 4)]);
    axes(tSvg, { x0: X0, x1: X1, y0: 15, y1: 195, xTicks, xLabel: "time" });
    const full = [], sum = [], each = comps.map(() => []);
    let peak = 0;
    for (let i = 0; i <= S; i++) {
      const t = window * i / S;
      let a = 0, b = 0;
      comps.forEach((c, j) => { const v = c.a * Math.sin(2 * Math.PI * c.f * t); a += v; if (j < n) { each[j].push(v * scale(j)); b += v * scale(j); } });
      full.push(a); sum.push(b); peak = Math.max(peak, Math.abs(a));
    }
    const A = 80 / (peak || 1), px = (i) => X0 + (X1 - X0) * i / S;
    tSvg.append(svgEl("polyline", { points: full.map((v, i) => `${px(i).toFixed(1)},${(YM - v * A).toFixed(1)}`).join(" "), fill: "none", stroke: "var(--ink-dim)", "stroke-width": 1.2, "stroke-dasharray": "4 4" }));
    for (let j = 0; j < n; j++) tSvg.append(polyline(each[j].map((v, i) => [px(i), YM - v * A]), COLORS[j % COLORS.length], j === n - 1 ? 1.8 : 1, j === n - 1 ? 0.9 : 0.45));
    if (n > 0) tSvg.append(polyline(sum.map((v, i) => [px(i), YM - v * A]), "var(--ink)", 2.4));
    // frequency domain: the spikes so far and their bandwidth bracket
    const FX0 = 50, FX1 = 610, FY = 92, FMAX = comps[comps.length - 1].f * 1.12, fx = (v) => FX0 + (FX1 - FX0) * (v / FMAX);
    fSvg.append(svgEl("line", { x1: FX0, y1: FY, x2: FX1, y2: FY, stroke: "var(--rule-strong)" }));
    fSvg.append(svgEl("line", { x1: FX0, y1: 10, x2: FX0, y2: FY, stroke: "var(--rule-strong)" }));
    svgText(fSvg, FX1, FY + 30, "frequency", { anchor: "end", size: 10 });
    const aMax = Math.max(...comps.map((c) => c.a));
    comps.forEach((c, j) => {
      const on = j < n;
      if (on) spike(fSvg, fx(c.f), FY, (c.a / aMax) * 62 * scale(j), COLORS[j % COLORS.length], lab(c.f));
      else svgText(fSvg, fx(c.f), FY - 4, "·", { size: 14 });
    });
    if (n > 1) {
      const top = comps[n - 1].f, xa = fx(f0), xb = fx(q ? top : comps[n - 2].f + (top - comps[n - 2].f) * e);
      fSvg.append(svgEl("line", { x1: xa, y1: FY + 14, x2: xb, y2: FY + 14, stroke: "var(--hl)", "stroke-width": 2 }));
      svgText(fSvg, (xa + xb) / 2, FY + 27, P.on && q ? "B = ?" : `B = ${lab(top - f0)}`, { fill: "var(--hl)", size: 10 });
    }
    let text;
    if (q) text = P.question().text;
    else if (k <= 0) text = `One step adds the next component, starting from ${lab(f0)} alone.`;
    else if (k === 1) text = `${lab(f0)} alone at amplitude ${fmtNum(comps[0].a, 3)}: one simple sine wave, one spike, bandwidth 0.`;
    else {
      const c = comps[k - 1];
      text = `Adding ${lab(c.f)} at ${fmtNum(c.a, 3)}: the highest frequency is now ${lab(c.f)}, so the bandwidth grows to ${lab(c.f)} − ${lab(f0)} = ${lab(c.f - f0)}.`;
      if (k === comps.length && isSquare()) text += " Each odd harmonic makes the sum squarer; exact vertical edges would need infinitely many, so a digital signal has infinite bandwidth.";
    }
    if (!q && pos >= comps.length) text += P.tally();
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos, input.value);
  }
  function typed() {
    const nc = parseComponents(input.value);
    if (!nc.length) { note.textContent = "Type at least one frequency, e.g. 1:1 3:0.33 9:0.11."; return; }
    comps = nc.slice(0, 12); P.reset(); pb.reset(comps.length);
  }
  pb = playbackWith(P, { count: comps.length, unit: "component", stepMs: () => cfg.stepMs || 1600, onFrame: frame });
  box.append(pb.el, note);
  input.addEventListener("input", typed);
}

// ---------- widget: phase-circle-play ----------
// A point turning around a circle traces the sine wave: one trip around is one cycle.
function phaseCirclePlay(box, cfg) {
  let phase = clamp(Math.round((cfg.phase ?? 0) / 45) * 45, -180, 360), pb = null;
  const A = clamp(cfg.A ?? 1, 0.1, 10);
  const gcdI = (a, b) => (b ? gcdI(b, a % b) : Math.abs(a));
  const rad = (deg) => { const n = Math.round(deg / 45); if (n === 0) return "0"; const g = gcdI(n, 4), p = n / g, q = 4 / g; return `${p === 1 ? "" : p === -1 ? "−" : String(p).replace("-", "−")}π${q === 1 ? "" : "/" + q}`; };
  const frac = (k) => { if (k === 8) return "one full cycle"; const g = gcdI(k, 8); return `${k / g}/${8 / g} of a cycle`; };
  const sinD = (d) => { const v = Math.sin((d * Math.PI) / 180); return Math.abs(v) < 1e-9 ? 0 : v; };
  const show = (v) => (Math.abs(v) < 1e-9 ? "0" : fmtNum(v, 3).replace("-", "−"));
  const VALS = [-1, -0.707, 0, 0.707, 1];
  const nearest = (v) => VALS.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b));
  box.append(el("h4", null, cfg.title || "One trip around the circle is one cycle of the wave"));
  const P = createPredict({
    on: cfg.predict, label: "Predict the value of sin at each mark", count: () => 8, redraw: () => frame(pb.pos()),
    question: (k) => {
      const th = phase + 45 * (k + 1);
      return {
        text: `Next mark: the angle will be ${th}°. What is sin ${th}°?`, choices: VALS.map((v) => [show(v), v]), right: nearest(sinD(th)),
        why: () => "The value of the wave is the height of the point on the circle: 90° is the top (1), 0° and 180° are level with the centre (0), 270° is the bottom (−1), and the 45° marks between are at ±0.707.",
      };
    },
  });
  const phases = [0, 90, 180, -90];
  box.append(btnRow(phases.map((p) => `φ = ${p}°`.replace("-", "−")), (i) => { phase = phases[i]; P.reset(); pb.reset(8); }, phases.indexOf(phase)), P.check);
  const svg = svgEl("svg", { viewBox: "0 0 640 236", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(svg, caption, P.ask);
  const CX = 112, CY = 108, R = 80, PX0 = 236, PX1 = 616;
  const px = (turned) => PX0 + (PX1 - PX0) * (turned / 360);
  function frame(pos) {
    const q = P.asking(pos), k = Math.ceil(pos - 1e-9), turned = 45 * pos, th = phase + turned;
    svg.innerHTML = "";
    // circle with a mark every 45°
    svg.append(svgEl("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: "var(--rule-strong)", "stroke-width": 1.4 }));
    svg.append(svgEl("line", { x1: CX - R - 8, y1: CY, x2: PX1, y2: CY, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("line", { x1: CX, y1: CY - R - 8, x2: CX, y2: CY + R + 8, stroke: "var(--rule)" }));
    for (let m = 0; m < 8; m++) {
      const a = ((phase + 45 * m) * Math.PI) / 180;
      svg.append(svgEl("circle", { cx: CX + R * Math.cos(a), cy: CY - R * Math.sin(a), r: 2.6, fill: m <= Math.floor(pos + 1e-9) ? "var(--hl)" : "var(--ink-dim)" }));
    }
    for (const [d, dx, dy, anchor] of [[0, R + 10, 4, "start"], [90, 0, -R - 12, "middle"], [180, -R - 10, 4, "end"], [270, 0, R + 20, "middle"]]) svgText(svg, CX + dx, CY + dy, `${d}°`, { anchor, size: 9.5 });
    // plot: one cycle of the sine from the starting phase, with the step being drawn highlighted
    const hot = q ? Math.round(pos) + 1 : k;
    if (hot >= 1 && hot <= 8) svg.append(svgEl("rect", { x: px(45 * (hot - 1)), y: CY - R - 6, width: px(45) - PX0, height: 2 * R + 12, fill: "var(--hl-soft)" }));
    for (let m = 0; m <= 8; m++) {
      const xx = px(45 * m);
      svg.append(svgEl("line", { x1: xx, y1: CY - R, x2: xx, y2: CY + R, stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      svgText(svg, xx, CY + R + 20, `${phase + 45 * m}°`.replace("-", "−"), { size: 9.5 });
      svgText(svg, xx, CY + R + 33, rad(phase + 45 * m), { size: 9.5 });
    }
    svgText(svg, PX0 - 6, CY - R + 4, String(fmtNum(A, 2)), { anchor: "end", size: 9.5 });
    svgText(svg, PX0 - 6, CY + R + 4, `−${fmtNum(A, 2)}`, { anchor: "end", size: 9.5 });
    if (pos > 0) {
      const pts = [], S = Math.max(2, Math.ceil(pos * 24));
      for (let i = 0; i <= S; i++) { const u = (turned * i) / S; pts.push([px(u), CY - R * sinD(phase + u)]); }
      svg.append(polyline(pts, "var(--blue)", 2.4));
    }
    const a = (th * Math.PI) / 180, pX = CX + R * Math.cos(a), pY = CY - R * Math.sin(a);
    // the angle turned so far, as an arc from the starting phase
    if (turned > 0) {
      const a0 = (phase * Math.PI) / 180, r2 = 26, steps = Math.ceil(turned / 6), arc = [];
      for (let i = 0; i <= steps; i++) { const u = a0 + ((a - a0) * i) / steps; arc.push([CX + r2 * Math.cos(u), CY - r2 * Math.sin(u)]); }
      svg.append(polyline(arc, "var(--hl)", 1.6));
    }
    svg.append(svgEl("line", { x1: CX, y1: CY, x2: pX, y2: pY, stroke: "var(--hl)", "stroke-width": 1.8 }));
    svg.append(svgEl("line", { x1: pX, y1: pY, x2: px(turned), y2: pY, stroke: "var(--hl)", "stroke-dasharray": "3 3", opacity: 0.8 }));
    svg.append(svgEl("circle", { cx: pX, cy: pY, r: 5.5, fill: "var(--hl)" }));
    svg.append(svgEl("circle", { cx: px(turned), cy: pY, r: 4.5, fill: "var(--blue)" }));
    let text;
    if (q) text = P.question().text;
    else if (k <= 0) text = phase === 0 ? "The point starts at 0° on the right of the circle: sin 0° = 0. One step turns it 45°, 1/8 of a cycle." : `The wave starts at phase φ = ${phase}°: sin ${phase}° = ${show(A * sinD(phase))}, so the point starts there, not at 0°. One step turns it 45°.`;
    else {
      const d = phase + 45 * k, v = sinD(d);
      text = `Mark ${k}: the point has turned ${45 * k}° = ${rad(45 * k)} rad, ${frac(k)}${phase ? `, so the angle is φ + ${45 * k}° = ${d}°` : ""}. Its height is sin ${d}° = ${show(v)}, so the wave is at ${A === 1 ? show(v) : `${fmtNum(A, 2)} × ${show(v)} = ${show(A * v)}`}.`;
      if (k === 8) text += " One trip around the circle is one cycle of the wave: 360° = 2π rad." + P.tally();
    }
    if (caption.textContent !== text) caption.textContent = text;
    P.render(pos, phase);
  }
  pb = playbackWith(P, { count: 8, unit: "mark", stepMs: () => cfg.stepMs || 1000, onFrame: frame });
  box.append(pb.el, el("p", "widget-note", "Phase is an angle: where on the circle the wave starts at time 0. A phase of 90° starts the wave at its peak, 180° at zero going down."));
}

export const WIDGETS = {
  "topology": topology,
  "sine-wave": sineWave,
  "freq-period": freqPeriod,
  "composite": composite,
  "encapsulation": encapsulation,
  "signal-levels": signalLevels,
  "wave-travel": waveTravel,
  "duplex-play": duplexPlay,
  "forward-play": forwardPlay,
  "bit-stream-play": bitStreamPlay,
  "harmonic-build-play": harmonicBuildPlay,
  "phase-circle-play": phaseCirclePlay,
};
