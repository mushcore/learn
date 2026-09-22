// Interactive data-communications widgets (COMP 3721): topologies and link counts, sine-wave
// parameters, frequency/period conversion, composite signals and bandwidth, encapsulation through
// a switch and a router, digital signal levels.
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
function encapsulation(box, cfg) {
  box.append(el("h4", null, cfg.title || "Encapsulation and decapsulation through a switch and a router"));
  const devs = el("div", "encap-devices");
  const layerEls = DEVICES.map((d) => {
    const dv = el("div", "encap-device");
    dv.append(el("div", "name", d.name));
    const rows = d.layers.map((l) => { const r = el("div", "encap-layer", l); dv.append(r); return r; });
    devs.append(dv);
    return rows;
  });
  const pduRow = el("div", "encap-pdu");
  const caption = el("div", "encap-caption");
  const ctl = el("div", "viz-btn-row");
  const prev = el("button", "viz-btn", "◀ prev"), next = el("button", "viz-btn", "next ▶"), reset = el("button", "viz-btn", "reset");
  const counter = el("span", "encap-pduname");
  ctl.append(prev, next, reset, counter);
  box.append(devs, pduRow, caption, ctl, el("p", "widget-note", "H_T = transport header (ports), H_N = network header (IP addresses), H_L = link header (MAC addresses). Compare with the lecture's Source, Switch, Router, Destination example."));
  let step = 0;
  function render() {
    const [dev, layer, parts, pduName, text] = STEPS[step];
    layerEls.forEach((rows, di) => rows.forEach((r) => {
      r.classList.toggle("active", di === dev && r.textContent === layer);
      r.classList.toggle("dim", di !== dev);
    }));
    pduRow.innerHTML = "";
    for (const p of parts) { const [cls, label] = PART[p]; pduRow.append(el("span", "encap-part " + cls, label)); }
    pduRow.append(el("span", "encap-pduname", `PDU: ${pduName}`));
    caption.textContent = text;
    counter.textContent = `step ${step + 1} of ${STEPS.length} · ${DEVICES[dev].name}, ${layer} layer`;
    prev.disabled = step === 0; next.disabled = step === STEPS.length - 1;
  }
  prev.addEventListener("click", () => { step = Math.max(0, step - 1); render(); });
  next.addEventListener("click", () => { step = Math.min(STEPS.length - 1, step + 1); render(); });
  reset.addEventListener("click", () => { step = 0; render(); });
  render();
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

export const WIDGETS = {
  "topology": topology,
  "sine-wave": sineWave,
  "freq-period": freqPeriod,
  "composite": composite,
  "encapsulation": encapsulation,
  "signal-levels": signalLevels,
};
