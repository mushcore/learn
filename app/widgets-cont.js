// Interactive widgets for MATH 3042 Unit 5 (continuous probability distributions): a density with
// draggable bounds (uniform, exponential, normal), the standard normal left-tail table, normal
// probabilities with the standardizing step, the exponential waiting time with its memoryless
// property, and the Gaussian-noise bit-error example. Every number reproduces the Unit 5 notes
// (bus 0.15 / 0.40, Z 0.0250 / 0.0099 / 0.1555, IQ 0.9082 vs 0.9088, radiation 0.4032 / 0.0968 /
// 5.17, noise 0.0116, web server 0.7981 / 7.49, teller 0.1859 / 0.1859 / 2.77). Two playback widgets
// (app/playback.js) animate the standardizing steps and the memoryless property (teller 0.6065 /
// 0.2231 / 0.3679). A third (cdf-sweep-play) draws F(x) as the area accumulated so far (bus F(11) = 0.55).
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
function lines(out, arr) {
  out.innerHTML = "";
  for (const t of arr) if (t) out.append(el("div", "math-line", t));
}
function setActive(row, i) {
  [...row.children].forEach((b, k) => b.classList.toggle("active", k === i));
}
/** Number for display: up to d decimals, trailing zeros dropped, a real minus sign, ∞ for infinities. */
function num(v, d = 4) {
  if (v === Infinity) return "∞";
  if (v === -Infinity) return "−∞";
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  return (r < 0 ? "−" : "") + String(Math.abs(r));
}
/** Fixed decimals with a real minus sign (f4 is the 4-decimal table form, f2 the 2-decimal Z form). */
const fix = (v, d) => (!Number.isFinite(v) ? num(v) : (v < 0 && Math.abs(v) >= 0.5 * 10 ** -d ? "−" : "") + Math.abs(v).toFixed(d));
const f4 = (v) => fix(v, 4);
const f2 = (v) => fix(v, 2);
/** What R prints: 7 significant digits. */
const rnum = (v) => (Number.isFinite(v) ? String(Number(v.toPrecision(7))) : "NaN");
/** Smallest "nice" step (1, 2, 5 × 10^k) at least v. */
function niceStep(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const e = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 5, 10]) if (m * e >= v - 1e-12) return m * e;
  return 10 * e;
}
const snap = (v, step) => Number((Math.round(v / step) * step).toFixed(10));
/** A labelled number input (class unit-row, aria-labelled). */
function numField(label, value, onChange, opts = {}) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = opts.step || "any"; input.value = value ?? "";
  if (opts.min != null) input.min = opts.min;
  if (opts.max != null) input.max = opts.max;
  input.setAttribute("aria-label", label);
  input.addEventListener("input", () => { const v = parseFloat(input.value); if (Number.isFinite(v)) onChange(v); });
  row.append(el("label", null, label), input);
  if (opts.suffix) row.append(el("span", "stat-label", opts.suffix));
  return { row, input, set: (v) => { input.value = v ?? ""; } };
}
/** A number input with an "∞" toggle: get() is the value or ±Infinity. */
function boundField(label, value, sign, onChange) {
  const inf = value == null || !Number.isFinite(value);
  const f = numField(label, inf ? "" : value, (v) => { st.v = v; onChange(); });
  const st = { v: inf ? (sign < 0 ? 0 : 1) : value, inf };
  const btn = el("button", "viz-btn" + (inf ? " active" : ""), sign < 0 ? "−∞" : "+∞");
  btn.type = "button";
  btn.setAttribute("aria-pressed", String(inf));
  btn.addEventListener("click", () => { st.inf = !st.inf; sync(); onChange(); });
  f.row.append(btn);
  function sync() { f.input.disabled = st.inf; btn.classList.toggle("active", st.inf); btn.setAttribute("aria-pressed", String(st.inf)); if (!st.inf) f.input.value = st.v; }
  sync();
  return {
    row: f.row,
    get: () => (st.inf ? (sign < 0 ? -Infinity : Infinity) : st.v),
    set: (v) => { st.inf = v == null || !Number.isFinite(v); if (!st.inf) st.v = v; sync(); },
    setFinite: (v) => { st.inf = false; st.v = v; sync(); },
    isInf: () => st.inf,
  };
}

// ---------- the normal distribution, double precision ----------
/** Φ(z) = P(Z ≤ z). Hart (1968) rational approximation as given by West (2005); error below 1e-14. */
export function phi(z) {
  const xa = Math.abs(z);
  let c;
  if (xa > 37) c = 0;
  else {
    const e = Math.exp(-xa * xa / 2);
    if (xa < 7.07106781186547) {
      let b = 3.52624965998911e-2 * xa + 0.700383064443688;
      b = b * xa + 6.37396220353165;
      b = b * xa + 33.912866078383;
      b = b * xa + 112.079291497871;
      b = b * xa + 221.213596169931;
      b = b * xa + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * xa + 1.75566716318264;
      b = b * xa + 16.064177579207;
      b = b * xa + 86.7807322029461;
      b = b * xa + 296.564248779674;
      b = b * xa + 637.333633378831;
      b = b * xa + 793.826512519948;
      b = b * xa + 440.413735824752;
      c = c / b;
    } else {
      let b = xa + 0.65;
      b = xa + 4 / b;
      b = xa + 3 / b;
      b = xa + 2 / b;
      b = xa + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return z > 0 ? 1 - c : c;
}
const normPdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
/** Φ⁻¹(p): Acklam's rational approximation refined by one Newton step on phi(). */
export function phiInv(p) {
  if (!(p > 0 && p < 1)) return p <= 0 ? -Infinity : p >= 1 ? Infinity : NaN;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425, ph = 1 - pl;
  let x;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  else if (p <= ph) { const q = p - 0.5, r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
  else { const q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const e = phi(x) - p;
  return x - e / normPdf(x);
}
/** z rounded to the table's 2 decimals. */
const z2 = (z) => Math.round(z * 100) / 100;
/** The printed table value at a 2-decimal z (4 decimals). */
const tableAt = (z) => Math.round(phi(z) * 1e4) / 1e4;
const Z_MAX = 349;
/** Read the left-tail table backwards for p: the exact cell, or the two bracketing cells and the interpolated z. */
function tableInverse(p) {
  if (!(p > 0 && p < 1)) return null;
  let k = clamp(Math.floor(phiInv(p) * 100), -Z_MAX, Z_MAX - 1);
  const T = (i) => tableAt(i / 100);
  while (k > -Z_MAX && T(k) > p + 1e-9) k--;
  while (k < Z_MAX - 1 && T(k + 1) <= p + 1e-9) k++;
  const Tk = T(k), Tk1 = T(k + 1);
  if (Math.abs(Tk - p) < 1e-9) return { z: k / 100, exact: true, cells: [k / 100], lo: [k / 100, Tk], hi: [k / 100, Tk] };
  if (p < Tk) return { z: k / 100, exact: false, beyond: true, cells: [k / 100], lo: [k / 100, Tk], hi: [k / 100, Tk] };
  const z = Math.round((k / 100 + 0.01 * (p - Tk) / (Tk1 - Tk)) * 1000) / 1000;
  return { z, exact: false, cells: [k / 100, (k + 1) / 100], lo: [k / 100, Tk], hi: [(k + 1) / 100, Tk1] };
}
/** Steps of "Z = (x − μ)/σ = 1.33" and the table read, for one bound. */
function zStep(x, mu, sigma) {
  const z = (x - mu) / sigma, zr = z2(z), t = tableAt(zr);
  const exact = Math.abs(z - zr) < 5e-7;
  return { z, zr, t, line: `Z = (${num(x)} − ${num(mu)})/${num(sigma)} = ${exact ? f2(zr) : num(z, 4) + " → " + f2(zr)}`, read: `table: P(Z ≤ ${f2(zr)}) = ${f4(t)}` };
}
function rCall(f, args, lo, hi) {
  const A = args ? ", " + args : "";
  const L = Number.isFinite(lo), H = Number.isFinite(hi);
  if (!L && !H) return "1";
  if (!L) return `${f}(${num(hi)}${A})`;
  if (!H) return `1 - ${f}(${num(lo)}${A})`;
  return `${f}(${num(hi)}${A}) - ${f}(${num(lo)}${A})`;
}
const eventLabel = (lo, hi, v = "X") => {
  const L = Number.isFinite(lo), H = Number.isFinite(hi);
  if (L && H) return lo === hi ? `P(${v} = ${num(lo)})` : `P(${num(lo)} ≤ ${v} ≤ ${num(hi)})`;
  if (L) return `P(${v} > ${num(lo)})`;
  if (H) return `P(${v} ≤ ${num(hi)})`;
  return `P(−∞ < ${v} < ∞)`;
};

// ---------- SVG helpers ----------
function curvePath(fn, x0, x1, X, Y, n = 200) {
  let d = "";
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n; d += (i ? "L" : "M") + X(x).toFixed(1) + "," + Y(fn(x)).toFixed(1); }
  return d;
}
function areaPath(fn, a, b, X, Y, base, n = 120) {
  if (!(b > a)) return "";
  let d = `M${X(a).toFixed(1)},${base}`;
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; d += `L${X(x).toFixed(1)},${Y(fn(x)).toFixed(1)}`; }
  return d + `L${X(b).toFixed(1)},${base}Z`;
}
function axis(layer, X, base, x0, x1, ticks, fmt, label) {
  layer.append(svgEl("line", { x1: X(x0), x2: X(x1), y1: base, y2: base, stroke: "var(--rule-strong)" }));
  for (const t of ticks) {
    layer.append(svgEl("line", { x1: X(t), x2: X(t), y1: base, y2: base + 4, stroke: "var(--ink-dim)" }));
    layer.append(svgEl("text", { x: X(t), y: base + 16, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, fmt(t)));
  }
  if (label) layer.append(svgEl("text", { x: X(x1), y: base + 30, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, label));
}
function niceTicks(x0, x1, n = 8) {
  const step = niceStep((x1 - x0) / n);
  const out = [];
  for (let t = Math.ceil(x0 / step) * step; t <= x1 + 1e-9; t += step) out.push(Number(t.toFixed(10)));
  return out;
}
function text(layer, x, y, s, attrs = {}) {
  layer.append(svgEl("text", { x, y, "font-size": 11, fill: "var(--ink-2)", "text-anchor": "middle", ...attrs }, s));
}
/** A draggable, keyboard-operable bound marker; the caller positions it with place(px). */
function makeHandle(svg, W, base, label, onDragPx, onKey) {
  const g = svgEl("g", { class: "cont-handle", tabindex: 0, role: "slider", "aria-label": label });
  g.append(svgEl("line", { y1: 12, y2: base, stroke: "var(--hl)", "stroke-width": 2 }), svgEl("circle", { cy: base, r: 8, fill: "var(--hl)" }));
  svg.append(g);
  let drag = false;
  g.addEventListener("pointerdown", (e) => { drag = true; g.setPointerCapture(e.pointerId); e.preventDefault(); });
  g.addEventListener("pointermove", (e) => { if (!drag) return; const r = svg.getBoundingClientRect(); if (r.width) onDragPx(((e.clientX - r.left) / r.width) * W); });
  g.addEventListener("pointerup", () => { drag = false; });
  g.addEventListener("pointercancel", () => { drag = false; });
  g.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { onKey(-1); e.preventDefault(); } else if (e.key === "ArrowRight") { onKey(1); e.preventDefault(); } });
  return { g, place: (px, dim) => { g.setAttribute("transform", `translate(${px.toFixed(1)},0)`); g.style.opacity = dim ? 0.35 : 1; } };
}

// =====================================================================
// widget: pdf-area — a density with two draggable bounds and the area between them
// =====================================================================
const DISTS = ["uniform", "exponential", "normal"];
function pdfArea(box, cfg) {
  box.append(el("h4", null, cfg.title || "Area under a density: P(lo ≤ X ≤ hi) = F(hi) − F(lo)"));
  const st = {
    dist: DISTS.includes(cfg.dist) ? cfg.dist : "uniform",
    a: Number.isFinite(cfg.a) ? cfg.a : 0, b: Number.isFinite(cfg.b) ? cfg.b : 20,
    beta: cfg.beta > 0 ? cfg.beta : 2.5,
    mu: Number.isFinite(cfg.mu) ? cfg.mu : 100, sigma: cfg.sigma > 0 ? cfg.sigma : 15,
    showCdf: cfg.showCdf !== false,
  };
  if (st.a >= st.b) { st.a = 0; st.b = 20; }
  const lo0 = cfg.lo === undefined ? 8 : cfg.lo, hi0 = cfg.hi === undefined ? 11 : cfg.hi;
  const W = 640, H = 210, pad = 40, base = 160, top = 26;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg net-svg", role: "img", "aria-label": "probability density with two bounds" });
  const layer = svgEl("g");
  svg.append(layer);
  const svgC = svgEl("svg", { viewBox: `0 0 ${W} 190`, class: "curve-svg net-svg", role: "img", "aria-label": "cumulative probability function" });
  const distRow = btnRow(["uniform on [a, b]", "exponential (β)", "normal (μ, σ)"], (i) => { st.dist = DISTS[i]; syncParams(); fitBounds(); draw(); }, DISTS.indexOf(st.dist));
  const params = el("div");
  const aF = numField("a", st.a, (v) => { st.a = v; if (st.b <= st.a) { st.b = st.a + 1; bF.set(st.b); } draw(); });
  const bF = numField("b", st.b, (v) => { st.b = v; if (st.b <= st.a) { st.a = st.b - 1; aF.set(st.a); } draw(); });
  const betaF = numField("β (mean wait)", st.beta, (v) => { if (v > 0) { st.beta = v; draw(); } });
  const muF = numField("μ", st.mu, (v) => { st.mu = v; draw(); });
  const sigF = numField("σ", st.sigma, (v) => { if (v > 0) { st.sigma = v; draw(); } });
  const loF = boundField("lower bound", lo0, -1, () => { order("lo"); draw(); });
  const hiF = boundField("upper bound", hi0, 1, () => { order("hi"); draw(); });
  const together = el("button", "viz-btn", "bring the bounds together");
  together.type = "button";
  together.addEventListener("click", () => bringTogether());
  const cdfToggle = el("button", "viz-btn" + (st.showCdf ? " active" : ""), "show F(x)");
  cdfToggle.type = "button"; cdfToggle.setAttribute("aria-pressed", String(st.showCdf));
  cdfToggle.addEventListener("click", () => { st.showCdf = !st.showCdf; cdfToggle.classList.toggle("active", st.showCdf); cdfToggle.setAttribute("aria-pressed", String(st.showCdf)); draw(); });
  const tools = el("div", "viz-btn-row");
  tools.append(together, cdfToggle);
  const out = el("div", "stat-grid");
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note");
  box.append(distRow, params, loF.row, hiF.row, tools, svg, svgC, out, steps, note);
  // handles (persist across redraws)
  const hLo = makeHandle(svg, W, base, "lower bound", (px) => dragTo("lo", px), (dir) => nudge("lo", dir));
  const hHi = makeHandle(svg, W, base, "upper bound", (px) => dragTo("hi", px), (dir) => nudge("hi", dir));

  function syncParams() {
    params.innerHTML = "";
    if (st.dist === "uniform") params.append(aF.row, bF.row);
    else if (st.dist === "exponential") params.append(betaF.row);
    else params.append(muF.row, sigF.row);
  }
  function domain() {
    if (st.dist === "uniform") { const r = st.b - st.a; return [st.a - 0.15 * r, st.b + 0.15 * r]; }
    if (st.dist === "exponential") return [-0.3 * st.beta, 6 * st.beta];
    return [st.mu - 4 * st.sigma, st.mu + 4 * st.sigma];
  }
  function fitBounds() {
    // keep finite bounds inside the new domain
    const [x0, x1] = domain();
    for (const f of [loF, hiF]) if (!f.isInf()) { const v = f.get(); if (v < x0 || v > x1) f.setFinite(snap(clamp(v, x0, x1), step())); }
    order("hi");
  }
  function step() { const [x0, x1] = domain(); return niceStep((x1 - x0) / 100); }
  function order(moved) {
    const lo = loF.get(), hi = hiF.get();
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo > hi) { if (moved === "lo") hiF.setFinite(lo); else loF.setFinite(hi); }
  }
  function dragTo(side, px) {
    const [x0, x1] = domain();
    const x = x0 + ((px - pad) / (W - 2 * pad)) * (x1 - x0);
    const v = snap(clamp(x, x0, x1), step());
    (side === "lo" ? loF : hiF).setFinite(v);
    order(side); draw();
  }
  function nudge(side, dir) {
    const f = side === "lo" ? loF : hiF;
    const [x0, x1] = domain();
    const v = f.isInf() ? (side === "lo" ? x0 : x1) : f.get();
    f.setFinite(snap(clamp(v + dir * step(), x0, x1), step()));
    order(side); draw();
  }
  function bringTogether() {
    const [x0, x1] = domain();
    const lo = loF.isInf() ? x0 + 0.25 * (x1 - x0) : loF.get();
    const hi = hiF.isInf() ? x1 - 0.25 * (x1 - x0) : hiF.get();
    const target = snap((lo + hi) / 2, step());
    const t0 = performance.now(), dur = 700;
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - (1 - k) ** 2;
      loF.setFinite(k === 1 ? target : lo + (target - lo) * e);
      hiF.setFinite(k === 1 ? target : hi + (target - hi) * e);
      draw();
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  function model() {
    const d = st.dist;
    if (d === "uniform") {
      const { a, b } = st;
      return { f: (x) => (x >= a && x <= b ? 1 / (b - a) : 0), F: (x) => clamp((x - a) / (b - a), 0, 1), peak: 1 / (b - a), mu: (a + b) / 2, sd: (b - a) / Math.sqrt(12) };
    }
    if (d === "exponential") {
      const { beta } = st;
      return { f: (x) => (x >= 0 ? Math.exp(-x / beta) / beta : 0), F: (x) => (x > 0 ? 1 - Math.exp(-x / beta) : 0), peak: 1 / beta, mu: beta, sd: beta };
    }
    const { mu, sigma } = st;
    return { f: (x) => normPdf((x - mu) / sigma) / sigma, F: (x) => phi((x - mu) / sigma), peak: normPdf(0) / sigma, mu, sd: sigma };
  }
  function draw() {
    const m = model();
    const [x0, x1] = domain();
    const X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
    const Y = (v) => base - (v / m.peak) * (base - top);
    const lo = loF.get(), hi = hiF.get();
    const A = Number.isFinite(lo) ? lo : x0, B = Number.isFinite(hi) ? hi : x1;
    layer.innerHTML = "";
    // shaded area
    if (B > A) {
      if (st.dist === "uniform") {
        const c = clamp(A, st.a, st.b), d = clamp(B, st.a, st.b);
        if (d > c) layer.append(svgEl("rect", { x: X(c), y: Y(m.peak), width: X(d) - X(c), height: base - Y(m.peak), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
      } else {
        const c = st.dist === "exponential" ? Math.max(A, 0) : A;
        if (B > c) layer.append(svgEl("path", { d: areaPath(m.f, c, B, X, Y, base), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
      }
    }
    // the density
    if (st.dist === "uniform") {
      const { a, b } = st;
      layer.append(svgEl("path", { d: `M${X(x0)},${base}L${X(a)},${base}L${X(a)},${Y(m.peak)}L${X(b)},${Y(m.peak)}L${X(b)},${base}L${X(x1)},${base}`, fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
      text(layer, X(x1), Y(m.peak) - 6, `f(x) = 1/(b − a) = ${num(m.peak, 4)}`, { fill: "var(--blue)", "text-anchor": "end" });
    } else if (st.dist === "exponential") {
      layer.append(svgEl("line", { x1: X(0), x2: X(0), y1: base, y2: Y(m.peak), stroke: "var(--blue)", "stroke-width": 2 }));
      layer.append(svgEl("path", { d: curvePath(m.f, 0, x1, X, Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
      layer.append(svgEl("line", { x1: X(x0), x2: X(0), y1: base, y2: base, stroke: "var(--blue)", "stroke-width": 2 }));
      text(layer, X(0) + 4, Y(m.peak) - 6, `f(0) = 1/β = ${num(m.peak, 4)}`, { fill: "var(--blue)", "text-anchor": "start" });
    } else {
      layer.append(svgEl("path", { d: curvePath(m.f, x0, x1, X, Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    }
    const ticks = st.dist === "normal" ? [-3, -2, -1, 0, 1, 2, 3].map((k) => st.mu + k * st.sigma) : niceTicks(Math.max(x0, st.dist === "exponential" ? 0 : x0), x1, 8);
    axis(layer, X, base, x0, x1, ticks, (t) => num(t, 2), "x");
    if (st.dist === "normal") text(layer, X(st.mu), base + 30, "μ", { fill: "var(--ink-dim)" });
    // bound labels
    const loLabel = Number.isFinite(lo) ? `lo = ${num(lo, 4)}` : "lo = −∞", hiLabel = Number.isFinite(hi) ? `hi = ${num(hi, 4)}` : "hi = +∞";
    const cx = (v) => clamp(v, 70, W - 70);
    if (Math.abs(X(B) - X(A)) < 70) text(layer, cx((X(A) + X(B)) / 2), 10, A === B ? `lo = hi = ${num(A, 4)}` : `${loLabel}, ${hiLabel}`, { fill: "var(--hl)" });
    else { text(layer, cx(X(A)), 10, loLabel, { fill: "var(--hl)" }); text(layer, cx(X(B)), 10, hiLabel, { fill: "var(--hl)" }); }
    hLo.place(X(A), !Number.isFinite(lo)); hHi.place(X(B), !Number.isFinite(hi));
    hLo.g.setAttribute("aria-valuenow", num(A)); hHi.g.setAttribute("aria-valuenow", num(B));
    // probabilities
    const Flo = Number.isFinite(lo) ? m.F(lo) : 0, Fhi = Number.isFinite(hi) ? m.F(hi) : 1;
    const p = Math.max(0, Fhi - Flo);
    const ev = eventLabel(lo, hi);
    const out1 = [];
    if (st.dist === "uniform") {
      const { a, b } = st, c = clamp(A, a, b), d = clamp(B, a, b);
      out1.push(`f(x) = 1/(b − a) = 1/${num(b - a)} = ${num(m.peak, 4)} on [${num(a)}, ${num(b)}] (a height, not a probability); F(x) = (x − a)/(b − a)`);
      out1.push(`${ev} = (${num(d)} − ${num(c)})/(${num(b)} − ${num(a)}) = ${num(d - c)}/${num(b - a)} = ${f4(p)}`);
      if (Number.isFinite(lo) && Number.isFinite(hi) && lo === hi) out1.push(`the width is 0, so the area is 0: P(X = ${num(lo)}) = 0`);
      out1.push(`R: ${rCall("punif", `${num(a)}, ${num(b)}`, lo, hi)} → ${rnum(p)}`);
      grid(out, [[ev, f4(p), "area of the shaded rectangle"], ["F(hi)", f4(Fhi), Number.isFinite(hi) ? `(${num(d)} − ${num(a)})/${num(b - a)}` : "hi = +∞"], ["F(lo)", f4(Flo), Number.isFinite(lo) ? `(${num(c)} − ${num(a)})/${num(b - a)}` : "lo = −∞"], ["μ = (a + b)/2", num(m.mu, 4), ""], ["σ = (b − a)/√12", num(m.sd, 4), ""]]);
    } else if (st.dist === "exponential") {
      const { beta } = st, c = Math.max(A, 0);
      const eLo = Math.exp(-c / beta), eHi = Number.isFinite(hi) ? Math.exp(-B / beta) : 0;
      const loTerm = c === 0 ? "e⁰ = 1" : `e^(−${num(c)}/${num(beta)}) = e^(−${num(c / beta, 4)}) = ${f4(eLo)}`;
      const hiTerm = Number.isFinite(hi) ? `e^(−${num(B)}/${num(beta)}) = e^(−${num(B / beta, 4)}) = ${f4(eHi)}` : "e^(−∞) = 0";
      out1.push(`f(x) = (1/β) e^(−x/β) = ${num(1 / beta, 4)} e^(−${num(1 / beta, 4)}x) for x ≥ 0; F(x) = 1 − e^(−x/β)`);
      out1.push(`${ev} = e^(−lo/β) − e^(−hi/β): ${loTerm}; ${hiTerm}`);
      out1.push(`= ${c === 0 ? "1" : f4(eLo)} − ${f4(eHi)} = ${f4(p)}`);
      if (Number.isFinite(lo) && Number.isFinite(hi) && lo === hi) out1.push(`the two terms are equal, so the area is 0: P(X = ${num(lo)}) = 0`);
      out1.push(`R: ${rCall("pexp", `rate = 1/${num(beta)}`, lo, hi)} → ${rnum(p)} (R's rate is 1/β)`);
      grid(out, [[ev, f4(p), "shaded area"], ["F(hi) = 1 − e^(−hi/β)", f4(Fhi), ""], ["F(lo)", f4(Flo), ""], ["μ = β", num(beta, 4), ""], ["σ = β", num(beta, 4), "mean and sd are equal"]]);
    } else {
      const { mu, sigma } = st;
      const sLo = Number.isFinite(lo) ? zStep(lo, mu, sigma) : null, sHi = Number.isFinite(hi) ? zStep(hi, mu, sigma) : null;
      const tLo = sLo ? sLo.t : 0, tHi = sHi ? sHi.t : 1, pt = Math.max(0, tHi - tLo);
      out1.push(`X ~ N(${num(mu)}, ${num(sigma)}²): standardize each bound with Z = (x − μ)/σ, then read the left-tail table`);
      if (sLo) out1.push(`${sLo.line}; ${sLo.read}`);
      if (sHi) out1.push(`${sHi.line}; ${sHi.read}`);
      out1.push(`${ev} = ${sHi ? `P(Z ≤ ${f2(sHi.zr)})` : "1"} − ${sLo ? `P(Z ≤ ${f2(sLo.zr)})` : "0"} = ${f4(tHi)} − ${f4(tLo)} = ${f4(pt)}`);
      if (Number.isFinite(lo) && Number.isFinite(hi) && lo === hi) out1.push(`the two table values are equal, so the area is 0: P(X = ${num(lo)}) = 0`);
      out1.push(`R: ${rCall("pnorm", `${num(mu)}, ${num(sigma)}`, lo, hi)} → ${rnum(p)}${Math.abs(p - pt) >= 5e-5 ? " (unrounded Z; the table's 2-decimal Z gives " + f4(pt) + ")" : ""}`);
      grid(out, [[ev + " (table)", f4(pt), "from the 2-decimal Z values"], [ev + " (R)", f4(p), "unrounded Z"], ["F(hi) = P(Z ≤ z_hi)", f4(tHi), sHi ? `z = ${f2(sHi.zr)}` : "hi = +∞"], ["F(lo) = P(Z ≤ z_lo)", f4(tLo), sLo ? `z = ${f2(sLo.zr)}` : "lo = −∞"], ["μ", num(mu, 4), ""], ["σ", num(sigma, 4), ""]]);
    }
    lines(steps, out1);
    note.textContent = Number.isFinite(lo) && Number.isFinite(hi) && lo === hi
      ? "With the bounds together the shaded region is a line, and a line has no area: for a continuous variable P(X = x) = 0, so P(X ≤ b) and P(X < b) are the same."
      : "Drag the handles (or type the bounds, or send one to ±∞): the probability is the shaded area, F(hi) − F(lo). Bring the bounds together to see the area of a single value shrink to 0.";
    drawCdf(m, x0, x1, lo, hi, Flo, Fhi);
  }
  function drawCdf(m, x0, x1, lo, hi, Flo, Fhi) {
    svgC.style.display = st.showCdf ? "" : "none";
    if (!st.showCdf) return;
    svgC.innerHTML = "";
    const baseC = 150, topC = 20;
    const X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
    const Y = (v) => baseC - v * (baseC - topC);
    const g = svgEl("g"); svgC.append(g);
    for (const v of [0, 0.5, 1]) {
      g.append(svgEl("line", { x1: pad, x2: W - pad, y1: Y(v), y2: Y(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      text(g, pad - 6, Y(v) + 4, String(v), { "text-anchor": "end", fill: "var(--ink-dim)" });
    }
    g.append(svgEl("path", { d: curvePath(m.F, x0, x1, X, Y, 300), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    axis(g, X, baseC, x0, x1, st.dist === "normal" ? [-3, -2, -1, 0, 1, 2, 3].map((k) => st.mu + k * st.sigma) : niceTicks(Math.max(x0, st.dist === "exponential" ? 0 : x0), x1, 8), (t) => num(t, 2), "x");
    text(g, pad, 12, "F(x) = P(X ≤ x)", { "text-anchor": "start", fill: "var(--blue)" });
    const mark = (x, Fx, label, color, dy) => {
      if (!Number.isFinite(x)) return;
      g.append(svgEl("line", { x1: X(x), x2: X(x), y1: baseC, y2: Y(Fx), stroke: color, "stroke-dasharray": "3 3" }));
      g.append(svgEl("line", { x1: pad, x2: X(x), y1: Y(Fx), y2: Y(Fx), stroke: color, "stroke-dasharray": "3 3" }));
      g.append(svgEl("circle", { cx: X(x), cy: Y(Fx), r: 4, fill: color }));
      const right = X(x) > W - 170;
      text(g, X(x) + (right ? -6 : 6), Y(Fx) + dy, `${label} = ${f4(Fx)}`, { "text-anchor": right ? "end" : "start", fill: color });
    };
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo === hi) mark(lo, Flo, "F(lo) = F(hi)", "var(--hl)", -6);
    else { mark(lo, Flo, "F(lo)", "var(--hl)", 14); mark(hi, Fhi, "F(hi)", "var(--hl)", -6); }
    // the difference bracket on the left
    const yA = Y(Flo), yB = Y(Fhi);
    if (Math.abs(yA - yB) > 1) {
      g.append(svgEl("line", { x1: pad + 8, x2: pad + 8, y1: yA, y2: yB, stroke: "var(--green)", "stroke-width": 3 }));
      text(g, pad + 14, (yA + yB) / 2 + 4, `F(hi) − F(lo) = ${f4(Math.max(0, Fhi - Flo))}`, { "text-anchor": "start", fill: "var(--green)" });
    }
  }
  syncParams();
  fitBounds();
  draw();
}

// =====================================================================
// widget: z-table — the standard normal left-tail table read in all four directions
// =====================================================================
const ZMODES = ["left", "right", "between", "inverse"];
function zTable(box, cfg) {
  box.append(el("h4", null, cfg.title || "The standard normal table: P(Z ≤ z)"));
  const st = { mode: ZMODES.includes(cfg.mode) ? cfg.mode : "left", z: Number.isFinite(cfg.z) ? cfg.z : 1.33, z2: Number.isFinite(cfg.z2) ? cfg.z2 : 1.10, p: cfg.p > 0 && cfg.p < 1 ? cfg.p : 0.95 };
  const presets = {
    "P(Z ≤ −1.96)": { mode: "left", z: -1.96 },
    "P(Z > 2.33)": { mode: "right", z: 2.33 },
    "P(0.55 ≤ Z ≤ 1.10)": { mode: "between", z: 0.55, z2: 1.10 },
    "z for 0.95": { mode: "inverse", p: 0.95 },
    "z for 0.975": { mode: "inverse", p: 0.975 },
  };
  const modeRow = btnRow(["left tail P(Z ≤ z)", "right tail P(Z > z)", "between", "backwards: z for p"], (i) => { st.mode = ZMODES[i]; syncInputs(); draw(); }, ZMODES.indexOf(st.mode));
  const zF = numField("z", st.z, (v) => { st.z = v; draw(); }, { step: 0.01 });
  const z2F = numField("second z", st.z2, (v) => { st.z2 = v; draw(); }, { step: 0.01 });
  const pF = numField("p = P(Z ≤ z)", st.p, (v) => { if (v > 0 && v < 1) { st.p = v; draw(); } }, { step: 0.001, min: 0.0002, max: 0.9998 });
  const svg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg", role: "img", "aria-label": "standard normal curve with the shaded region" });
  const out = el("div", "stat-grid");
  const steps = el("div", "stat-steps");
  const wrap = el("div", "cont-ztable-wrap");
  const table = el("table", "cont-ztable");
  wrap.append(table);
  const note = el("p", "widget-note", "Row = z to one decimal, column = the second decimal; the cell is the area to the left of z. A right tail is 1 − the cell; an area between two values is the difference of two cells; reading backwards, find the area in the body and take its z.");
  if (cfg.presets !== false) box.append(btnRow(Object.keys(presets), (i, l) => { Object.assign(st, { z: 1.33, z2: 1.10, p: 0.95 }, presets[l]); setActive(modeRow, ZMODES.indexOf(st.mode)); zF.set(st.z); z2F.set(st.z2); pF.set(st.p); syncInputs(); draw(); }, -1));
  box.append(modeRow, zF.row, z2F.row, pF.row, svg, out, steps, wrap, note);
  // build the table once: rows −3.4 … −0.0 then 0.0 … 3.4
  const cells = new Map(); // "n|p" + hundredths → td
  const rows = new Map(); // row key → tr
  const colHeads = [];
  const thead = el("thead"), tbody = el("tbody");
  const hr = el("tr"); hr.append(el("th", null, "z"));
  for (let c = 0; c < 10; c++) { const th = el("th", null, "." + String(c).padStart(2, "0")); colHeads.push(th); hr.append(th); }
  thead.append(hr);
  const rowKeys = [];
  for (let r = 34; r >= 0; r--) rowKeys.push(["n", r]);
  for (let r = 0; r <= 34; r++) rowKeys.push(["p", r]);
  for (const [sgn, r] of rowKeys) {
    const tr = el("tr");
    tr.append(el("th", null, (sgn === "n" ? "−" : "") + (r / 10).toFixed(1)));
    for (let c = 0; c < 10; c++) {
      const k = r * 10 + c, z = (sgn === "n" ? -1 : 1) * k / 100;
      const td = el("td", null, tableAt(z).toFixed(4));
      cells.set(sgn + k, td);
      tr.append(td);
    }
    rows.set(sgn + r, tr);
    tbody.append(tr);
  }
  table.append(thead, tbody);
  const keyOf = (z) => (z < 0 || Object.is(z, -0) ? "n" : "p") + Math.abs(Math.round(z * 100));

  function syncInputs() {
    zF.row.style.display = st.mode === "inverse" ? "none" : "";
    z2F.row.style.display = st.mode === "between" ? "" : "none";
    pF.row.style.display = st.mode === "inverse" ? "" : "none";
  }
  function highlight(zs, interp) {
    for (const td of cells.values()) td.className = "";
    for (const tr of rows.values()) tr.className = "";
    for (const th of colHeads) th.className = "";
    let first = null;
    for (const z of zs) {
      if (Math.abs(z) > 3.49) continue;
      const k = Math.abs(Math.round(z * 100)), sgn = keyOf(z)[0];
      const td = cells.get(sgn + k);
      if (!td) continue;
      td.classList.add(interp ? "cont-z-near" : "cont-z-hit");
      rows.get(sgn + Math.floor(k / 10)).classList.add("cont-z-row");
      colHeads[k % 10].classList.add("cont-z-col");
      first = first || td;
    }
    if (first) {
      const tr = first.parentElement;
      const top = tr.getBoundingClientRect().top - wrap.getBoundingClientRect().top + wrap.scrollTop;
      wrap.scrollTop = Math.max(0, top - wrap.clientHeight / 2 + 12);
    }
  }
  function cellRef(z) { const k = Math.abs(Math.round(z * 100)); return `row ${(z < 0 ? "−" : "") + (Math.floor(k / 10) / 10).toFixed(1)}, column .${String(k % 10).padStart(2, "0")}`; }
  function draw() {
    const W = 640, base = 120, pad = 30, range = 4;
    const X = (z) => pad + ((z + range) / (2 * range)) * (W - 2 * pad);
    const Y = (z) => base - normPdf(z) * 230;
    svg.innerHTML = "";
    let a, b, rowsOut, linesOut, zs = [], interp = false, areaVal;
    if (st.mode === "left") {
      const z = z2(st.z), t = tableAt(z);
      a = -range; b = z; zs = [z]; areaVal = t;
      rowsOut = [[`P(Z ≤ ${f2(z)})`, f4(t), cellRef(z)], ["R", rnum(phi(st.z)), `pnorm(${num(st.z)})`]];
      linesOut = [`P(Z ≤ ${f2(z)}) = ${f4(t)} (read directly: ${cellRef(z)})`, `R: pnorm(${num(st.z)}) → ${rnum(phi(st.z))}`];
    } else if (st.mode === "right") {
      const z = z2(st.z), t = tableAt(z), p = Math.round((1 - t) * 1e4) / 1e4;
      a = z; b = range; zs = [z]; areaVal = p;
      rowsOut = [[`P(Z > ${f2(z)})`, f4(p), `1 − ${f4(t)}`], [`table cell P(Z ≤ ${f2(z)})`, f4(t), cellRef(z)], ["R", rnum(1 - phi(st.z)), `1 - pnorm(${num(st.z)})`]];
      linesOut = [`P(Z > ${f2(z)}) = 1 − P(Z ≤ ${f2(z)}) = 1 − ${f4(t)} = ${f4(p)}`, `by symmetry this also equals P(Z ≤ ${f2(-z)}) = ${f4(tableAt(-z))}`, `R: 1 - pnorm(${num(st.z)}) → ${rnum(1 - phi(st.z))}`];
    } else if (st.mode === "between") {
      let lo = z2(Math.min(st.z, st.z2)), hi = z2(Math.max(st.z, st.z2));
      const tl = tableAt(lo), th = tableAt(hi), p = Math.round((th - tl) * 1e4) / 1e4;
      a = lo; b = hi; zs = [lo, hi]; areaVal = p;
      rowsOut = [[`P(${f2(lo)} ≤ Z ≤ ${f2(hi)})`, f4(p), `${f4(th)} − ${f4(tl)}`], [`P(Z ≤ ${f2(hi)})`, f4(th), cellRef(hi)], [`P(Z ≤ ${f2(lo)})`, f4(tl), cellRef(lo)], ["R", rnum(phi(hi) - phi(lo)), `pnorm(${num(hi)}) - pnorm(${num(lo)})`]];
      linesOut = [`P(${f2(lo)} ≤ Z ≤ ${f2(hi)}) = P(Z ≤ ${f2(hi)}) − P(Z ≤ ${f2(lo)}) = ${f4(th)} − ${f4(tl)} = ${f4(p)}`, `R: pnorm(${num(hi)}) - pnorm(${num(lo)}) → ${rnum(phi(hi) - phi(lo))}`];
    } else {
      const inv = tableInverse(st.p);
      a = -range; b = inv.z; zs = inv.cells; interp = !inv.exact; areaVal = st.p;
      const exactR = phiInv(st.p);
      rowsOut = [[`z with P(Z ≤ z) = ${num(st.p)}`, num(inv.z, 3), inv.exact ? `exactly ${f4(inv.lo[1])} at ${f2(inv.z)}` : `between ${f2(inv.lo[0])} and ${f2(inv.hi[0])}`], ["R", rnum(exactR), `qnorm(${num(st.p)})`]];
      linesOut = inv.exact
        ? [`look for ${f4(st.p)} in the body of the table: it sits at ${cellRef(inv.z)} → z = ${f2(inv.z)}`, `R: qnorm(${num(st.p)}) → ${rnum(exactR)}`]
        : inv.beyond
          ? [`${num(st.p)} is beyond the table's range; the nearest cell is ${f4(inv.lo[1])} at z = ${f2(inv.z)}`, `R: qnorm(${num(st.p)}) → ${rnum(exactR)}`]
          : [`look for ${num(st.p)} in the body of the table: ${f4(inv.lo[1])} at ${f2(inv.lo[0])}, ${f4(inv.hi[1])} at ${f2(inv.hi[0])}`,
            `${num(st.p)} is ${Math.abs((st.p - inv.lo[1]) / (inv.hi[1] - inv.lo[1]) - 0.5) < 1e-9 ? "exactly halfway" : num(100 * (st.p - inv.lo[1]) / (inv.hi[1] - inv.lo[1]), 0) + " % of the way"} from ${f2(inv.lo[0])} to ${f2(inv.hi[0])} → z = ${num(inv.z, 3)} (interpolated)`,
            `R: qnorm(${num(st.p)}) → ${rnum(exactR)}`];
    }
    // curve
    const g = svgEl("g"); svg.append(g);
    const A = clamp(a, -range, range), B = clamp(b, -range, range);
    if (B > A) g.append(svgEl("path", { d: areaPath(normPdf, A, B, X, Y, base), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    g.append(svgEl("path", { d: curvePath(normPdf, -range, range, X, Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    axis(g, X, base, -range, range, [-3, -2, -1, 0, 1, 2, 3], (t) => String(t), "z");
    const close = zs.length > 1 && Math.abs(X(zs[1]) - X(zs[0])) < 100;
    zs.forEach((z, i) => {
      if (Math.abs(z) > range) return;
      g.append(svgEl("line", { x1: X(z), x2: X(z), y1: 14, y2: base, stroke: "var(--hl)", "stroke-width": 1.5, "stroke-dasharray": interp ? "3 3" : "none" }));
      if (!interp) text(g, X(z) + (close ? (i ? 4 : -4) : 0), 11, `z = ${f2(z)}`, { fill: "var(--hl)", "text-anchor": close ? (i ? "start" : "end") : "middle" });
    });
    if (st.mode === "inverse" && interp && Math.abs(b) <= range) { g.append(svgEl("line", { x1: X(b), x2: X(b), y1: 14, y2: base, stroke: "var(--green)", "stroke-width": 2 })); text(g, X(b), 11, `z = ${num(b, 3)}`, { fill: "var(--green)" }); }
    text(g, X((A + B) / 2), base - 8, `area = ${f4(areaVal)}`, { fill: "var(--ink)" });
    grid(out, rowsOut);
    lines(steps, linesOut);
    highlight(zs, interp);
  }
  syncInputs();
  draw();
}

// =====================================================================
// widget: normal-prob — standardize, read the table, un-standardize
// =====================================================================
const NP_PRESETS = {
  "IQ below 120": { mu: 100, sigma: 15, lo: null, hi: 120, p: null, unit: "", note: "X ~ N(100, 15²): the notes' pnorm(120, 100, 15) = 0.9087888 uses the unrounded Z = 1.3333; the table's Z = 1.33 gives 0.9082." },
  "radiation 4.35–5.00": { mu: 4.35, sigma: 0.5, lo: 4.35, hi: 5, p: null, unit: "mrem", note: "Cosmic radiation on a trans-Canada flight, μ = 4.35 mrem, σ = 0.500 mrem: the lower bound is μ itself, so its table value is 0.5000." },
  "radiation above 5.00": { mu: 4.35, sigma: 0.5, lo: 5, hi: null, p: null, unit: "mrem", note: "A right tail: 1 − the table value." },
  "radiation 95th percentile": { mu: 4.35, sigma: 0.5, lo: null, hi: null, p: 0.95, unit: "mrem", note: "Read the table backwards for 0.95 (halfway between 0.9495 at 1.64 and 0.9505 at 1.65, so z = 1.645), then un-standardize: x = μ + zσ." },
  "bit error": { mu: 0, sigma: 0.22, lo: 0.5, hi: null, p: null, unit: "V", note: "Gaussian noise N with μ = 0 V, σ = 0.22 V added to a sent 0 (2 V). The receiver reads 1 when the voltage is nearer 3 V than 2 V, i.e. above the 2.5 V threshold: the noise must exceed 2.5 − 2 = 0.5 V. By symmetry a sent 1 is misread with the same probability." },
};
function normalProb(box, cfg) {
  box.append(el("h4", null, cfg.title || "Normal probabilities: standardize, then read the table"));
  const pre = NP_PRESETS[cfg.preset] ? NP_PRESETS[cfg.preset] : null;
  const src = pre || cfg;
  const st = {
    mu: Number.isFinite(src.mu) ? src.mu : 100, sigma: src.sigma > 0 ? src.sigma : 15,
    lo: Number.isFinite(src.lo) ? src.lo : null, hi: Number.isFinite(src.hi) ? src.hi : null,
    p: src.p > 0 && src.p < 1 ? src.p : null, unit: src.unit || "", note: pre ? pre.note : "",
  };
  if (!pre && cfg.lo === undefined && cfg.hi === undefined && cfg.p === undefined) st.hi = 120;
  st.mode = st.p != null ? "percentile" : "interval";
  if (st.p == null) st.p = 0.95;
  const modeRow = btnRow(["probability of an interval", "percentile"], (i) => { st.mode = i ? "percentile" : "interval"; syncInputs(); draw(); }, st.mode === "percentile" ? 1 : 0);
  const muF = numField("μ", st.mu, (v) => { st.mu = v; draw(); });
  const sigF = numField("σ", st.sigma, (v) => { if (v > 0) { st.sigma = v; draw(); } });
  const loF = boundField("lower bound", st.lo, -1, draw);
  const hiF = boundField("upper bound", st.hi, 1, draw);
  const pF = numField("p = P(X ≤ x)", st.p, (v) => { if (v > 0 && v < 1) { st.p = v; draw(); } }, { step: 0.01, min: 0.0002, max: 0.9998 });
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg", role: "img", "aria-label": "normal curve in X units with the Z axis underneath" });
  const out = el("div", "stat-grid");
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note");
  if (cfg.presets !== false) box.append(btnRow(Object.keys(NP_PRESETS), (i, l) => {
    const q = NP_PRESETS[l];
    Object.assign(st, { mu: q.mu, sigma: q.sigma, unit: q.unit, note: q.note, mode: q.p != null ? "percentile" : "interval" });
    if (q.p != null) st.p = q.p;
    muF.set(st.mu); sigF.set(st.sigma); loF.set(q.lo); hiF.set(q.hi); pF.set(st.p);
    setActive(modeRow, st.mode === "percentile" ? 1 : 0); syncInputs(); draw();
  }, pre ? Object.keys(NP_PRESETS).indexOf(cfg.preset) : -1));
  box.append(modeRow, muF.row, sigF.row, loF.row, hiF.row, pF.row, svg, out, steps, note);
  function syncInputs() {
    const pc = st.mode === "percentile";
    loF.row.style.display = pc ? "none" : ""; hiF.row.style.display = pc ? "none" : ""; pF.row.style.display = pc ? "" : "none";
  }
  function draw() {
    const { mu, sigma } = st, u = st.unit ? " " + st.unit : "";
    const W = 640, pad = 40, base = 170, top = 30;
    const x0 = mu - 4 * sigma, x1 = mu + 4 * sigma;
    const X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
    const f = (x) => normPdf((x - mu) / sigma);
    const Y = (v) => base - (v / normPdf(0)) * (base - top);
    svg.innerHTML = "";
    const g = svgEl("g"); svg.append(g);
    let a, b, marks = [], rowsOut, linesOut, areaLabel;
    if (st.mode === "interval") {
      const lo = loF.get(), hi = hiF.get();
      a = Number.isFinite(lo) ? lo : x0; b = Number.isFinite(hi) ? hi : x1;
      const sLo = Number.isFinite(lo) ? zStep(lo, mu, sigma) : null, sHi = Number.isFinite(hi) ? zStep(hi, mu, sigma) : null;
      const tLo = sLo ? sLo.t : 0, tHi = sHi ? sHi.t : 1, pt = Math.round(Math.max(0, tHi - tLo) * 1e4) / 1e4;
      const exact = (Number.isFinite(hi) ? phi((hi - mu) / sigma) : 1) - (Number.isFinite(lo) ? phi((lo - mu) / sigma) : 0);
      const ev = eventLabel(lo, hi), evZ = sLo && sHi ? `P(${f2(sLo.zr)} ≤ Z ≤ ${f2(sHi.zr)})` : "";
      if (sLo) marks.push([lo, sLo.zr]);
      if (sHi) marks.push([hi, sHi.zr]);
      linesOut = [`X ~ N(${num(mu)}, ${num(sigma)}²), so Z = (X − μ)/σ is standard normal`];
      if (sLo) linesOut.push(`${sLo.line}; ${sLo.read}`);
      if (sHi) linesOut.push(`${sHi.line}; ${sHi.read}`);
      let answer;
      if (sLo && sHi) answer = `${ev} = ${evZ} = ${f4(tHi)} − ${f4(tLo)} = ${f4(pt)}`;
      else if (sHi) answer = `${ev} = P(Z ≤ ${f2(sHi.zr)}) = ${f4(pt)}`;
      else if (sLo) answer = `${ev} = P(Z > ${f2(sLo.zr)}) = 1 − ${f4(tLo)} = ${f4(pt)}`;
      else answer = `${ev} = 1`;
      linesOut.push(answer);
      const rc = rCall("pnorm", `${num(mu)}, ${num(sigma)}`, lo, hi);
      const differs = Math.abs(exact - pt) >= 5e-5;
      linesOut.push(`R: ${rc} → ${rnum(exact)}${differs ? ` (R uses the unrounded Z; the table's 2-decimal Z gives ${f4(pt)})` : " (agrees with the table to 4 decimals)"}`);
      rowsOut = [];
      if (sHi) rowsOut.push(["Z for the upper bound", f2(sHi.zr), `(${num(hi)} − ${num(mu)})/${num(sigma)}`]);
      if (sLo) rowsOut.push(["Z for the lower bound", f2(sLo.zr), `(${num(lo)} − ${num(mu)})/${num(sigma)}`]);
      if (sHi) rowsOut.push([`table P(Z ≤ ${f2(sHi.zr)})`, f4(tHi), ""]);
      if (sLo) rowsOut.push([`table P(Z ≤ ${f2(sLo.zr)})`, f4(tLo), ""]);
      rowsOut.push([ev + " (table)", f4(pt), "answer to 4 decimals"], ["R (unrounded Z)", f4(exact), rc]);
      areaLabel = `${ev} = ${f4(pt)}`;
    } else {
      const inv = tableInverse(st.p) || { z: 0, exact: true, lo: [0, 0.5], hi: [0, 0.5] };
      const z = inv.z, x = mu + z * sigma, xR = mu + phiInv(st.p) * sigma;
      a = x0; b = x; marks.push([x, z]);
      linesOut = [
        `P(X ≤ x) = ${num(st.p)}: find z with P(Z ≤ z) = ${num(st.p)} in the body of the table`,
        inv.exact ? `table: ${f4(inv.lo[1])} at z = ${f2(z)}` : inv.beyond ? `beyond the table; nearest cell ${f4(inv.lo[1])} at z = ${f2(z)}` : `table: ${f4(inv.lo[1])} at ${f2(inv.lo[0])}, ${f4(inv.hi[1])} at ${f2(inv.hi[0])} → z = ${num(z, 3)}`,
        `x = μ + zσ = ${num(mu)} + ${num(z, 3)} × ${num(sigma)} = ${num(x, 4)}${Math.abs(x - Number(x.toFixed(2))) > 1e-9 ? " ≈ " + num(x, 2) : ""}${u}`,
        `R: qnorm(${num(st.p)}, ${num(mu)}, ${num(sigma)}) → ${rnum(xR)} (qnorm(${num(st.p)}) = ${rnum(phiInv(st.p))})`,
      ];
      rowsOut = [["z from the table", num(z, 3), inv.exact ? "exact cell" : "interpolated between two cells"], [`x = μ + zσ (the ${num(100 * st.p)}th percentile)`, num(x, 4) + u, `≈ ${num(x, 2)}${u}`], ["R", num(xR, 4) + u, `qnorm(${num(st.p)}, ${num(mu)}, ${num(sigma)})`]];
      areaLabel = `area = ${num(st.p)}`;
    }
    // curve
    const A = clamp(a, x0, x1), B = clamp(b, x0, x1);
    if (B > A) g.append(svgEl("path", { d: areaPath(f, A, B, X, Y, base), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    g.append(svgEl("path", { d: curvePath(f, x0, x1, X, Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    g.append(svgEl("line", { x1: pad, x2: W - pad, y1: base, y2: base, stroke: "var(--rule-strong)" }));
    for (let k = -3; k <= 3; k++) {
      const x = mu + k * sigma;
      g.append(svgEl("line", { x1: X(x), x2: X(x), y1: base, y2: base + 4, stroke: "var(--ink-dim)" }));
      text(g, X(x), base + 16, num(x, 2), { fill: "var(--ink-2)" });
      text(g, X(x), base + 36, String(k), { fill: "var(--ink-dim)" });
    }
    text(g, W - 4, base + 16, "x" + (st.unit ? ` (${st.unit})` : ""), { "text-anchor": "end", fill: "var(--ink-dim)" });
    text(g, W - 4, base + 36, "z", { "text-anchor": "end", fill: "var(--ink-dim)" });
    g.append(svgEl("line", { x1: pad, x2: W - pad, y1: base + 24, y2: base + 24, stroke: "var(--rule)" }));
    const two = marks.length > 1;
    marks.forEach(([x, z], i) => {
      if (x < x0 || x > x1) return;
      const yTop = two ? 30 : 16;
      g.append(svgEl("line", { x1: X(x), x2: X(x), y1: yTop, y2: base, stroke: "var(--hl)", "stroke-width": 1.5 }));
      text(g, clamp(X(x), 120, W - 120), two ? 12 + 14 * i : 12, `x = ${num(x, 4)}${u}, z = ${st.mode === "percentile" ? num(z, 3) : f2(z)}`, { fill: "var(--hl)" });
    });
    text(g, X((A + B) / 2), base - 10, areaLabel, { fill: "var(--ink)" });
    grid(out, rowsOut);
    lines(steps, linesOut);
    note.textContent = st.note || "Standardize each bound with Z = (x − μ)/σ rounded to 2 decimals, read P(Z ≤ z) from the table, and combine: a left tail directly, a right tail as 1 − the cell, an interval as the difference. A percentile goes the other way: find the area in the table, take its z, then x = μ + zσ.";
  }
  syncInputs();
  draw();
}

// =====================================================================
// widget: exp-wait — the exponential waiting time
// =====================================================================
const TU = { s: 1, min: 60, h: 3600 };
const EW_MODES = ["single", "interval", "percentile", "memoryless"];
const EW_PRESETS = {
  "web server (β = 2.5 s)": { beta: 2.5, unit: "s", rateUnit: "s", x: 4, lo: 1, hi: 3, p: 0.95, elapsed: 1 },
  "bank teller (30 per hour)": { rate: 30, rateUnit: "h", unit: "min", x: 2, lo: 1.5, hi: 2.5, p: 0.75, elapsed: 1 },
};
function expWait(box, cfg) {
  box.append(el("h4", null, cfg.title || "The exponential waiting time: F(x) = 1 − e^(−x/β)"));
  const pre = EW_PRESETS[cfg.preset] || null;
  const src = pre || cfg;
  const st = { unit: TU[src.unit] ? src.unit : "s", rateUnit: TU[src.rateUnit] ? src.rateUnit : "s", mode: EW_MODES.includes(cfg.mode) ? cfg.mode : "single" };
  st.beta = src.beta > 0 ? src.beta : src.rate > 0 ? TU[st.rateUnit] / (src.rate * TU[st.unit]) : 2.5;
  st.x = Number.isFinite(src.x) ? src.x : 4;
  st.lo = Number.isFinite(src.lo) ? src.lo : 1.5; st.hi = Number.isFinite(src.hi) ? src.hi : 2.5;
  st.p = src.p > 0 && src.p < 1 ? src.p : 0.95;
  st.t = Number.isFinite(src.elapsed) ? src.elapsed : 1;
  const rateOf = () => TU[st.rateUnit] / (st.beta * TU[st.unit]);
  const unitSel = (label, value, onChange) => {
    const sel = document.createElement("select"); sel.setAttribute("aria-label", label);
    for (const u of Object.keys(TU)) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === value) o.selected = true; sel.append(o); }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  };
  const betaF = numField("β (mean wait)", st.beta, (v) => { if (v > 0) { st.beta = v; rateF.set(num(rateOf(), 6)); rescale(); draw(); } });
  const betaU = unitSel("unit of β", st.unit, (u) => { st.unit = u; rateF.set(num(rateOf(), 6)); draw(); });
  betaF.row.append(betaU);
  const rateF = numField("rate (events per unit)", num(rateOf(), 6), (v) => { if (v > 0) { st.beta = TU[st.rateUnit] / (v * TU[st.unit]); betaF.set(num(st.beta, 6)); rescale(); draw(); } });
  const rateU = unitSel("unit of the rate", st.rateUnit, (u) => { st.rateUnit = u; st.beta = TU[st.rateUnit] / (parseFloat(rateF.input.value) * TU[st.unit]); betaF.set(num(st.beta, 6)); rescale(); draw(); });
  rateF.row.append(el("span", "stat-label", "per"), rateU);
  const modeRow = btnRow(["P(X ≤ x)", "interval lo–hi", "percentile x_p", "memoryless: elapsed t"], (i) => { st.mode = EW_MODES[i]; syncInputs(); draw(); }, EW_MODES.indexOf(st.mode));
  const fmtT = (v) => `${num(v, 3)} ${st.unit}`;
  const xS = slider("x", 0, 6 * st.beta, niceStep(6 * st.beta / 150), st.x, (v) => { st.x = v; draw(); }, fmtT);
  const loS = slider("lo", 0, 6 * st.beta, niceStep(6 * st.beta / 150), st.lo, (v) => { st.lo = v; if (st.hi < v) { st.hi = v; hiS.set(v); } draw(); }, fmtT);
  const hiS = slider("hi", 0, 6 * st.beta, niceStep(6 * st.beta / 150), st.hi, (v) => { st.hi = v; if (st.lo > v) { st.lo = v; loS.set(v); } draw(); }, fmtT);
  const pS = slider("p", 0.01, 0.99, 0.01, st.p, (v) => { st.p = v; draw(); }, (v) => num(v, 2));
  const tS = slider("elapsed t", 0, 3 * st.beta, niceStep(6 * st.beta / 150), st.t, (v) => { st.t = v; draw(); }, fmtT);
  for (const s of [xS, loS, hiS, pS, tS]) s.input.setAttribute("aria-label", s.row.firstChild.textContent);
  const panels = el("div", "cont-panels");
  const svgP = svgEl("svg", { viewBox: "0 0 320 190", class: "curve-svg net-svg", role: "img", "aria-label": "exponential density" });
  const svgC = svgEl("svg", { viewBox: "0 0 320 190", class: "curve-svg net-svg", role: "img", "aria-label": "exponential cumulative function" });
  panels.append(svgP, svgC);
  const out = el("div", "stat-grid");
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note");
  if (cfg.presets !== false) box.append(btnRow(Object.keys(EW_PRESETS), (i, l) => {
    const q = EW_PRESETS[l];
    st.unit = q.unit; st.rateUnit = q.rateUnit;
    st.beta = q.beta > 0 ? q.beta : TU[q.rateUnit] / (q.rate * TU[q.unit]);
    Object.assign(st, { x: q.x, lo: q.lo, hi: q.hi, p: q.p, t: q.elapsed });
    betaF.set(num(st.beta, 6)); betaU.value = st.unit; rateF.set(num(rateOf(), 6)); rateU.value = st.rateUnit;
    rescale(); xS.set(st.x); loS.set(st.lo); hiS.set(st.hi); pS.set(st.p); tS.set(st.t); draw();
  }, pre ? Object.keys(EW_PRESETS).indexOf(cfg.preset) : -1));
  box.append(betaF.row, rateF.row, modeRow, xS.row, loS.row, hiS.row, pS.row, tS.row, panels, out, steps, note);
  function rescale() {
    const max = 6 * st.beta, step = niceStep(max / 150);
    for (const s of [xS, loS, hiS]) { s.input.max = max; s.input.step = step; }
    tS.input.max = 3 * st.beta; tS.input.step = step;
    st.x = clamp(st.x, 0, max); st.lo = clamp(st.lo, 0, max); st.hi = clamp(st.hi, st.lo, max); st.t = clamp(st.t, 0, 3 * st.beta);
    xS.set(st.x); loS.set(st.lo); hiS.set(st.hi); tS.set(st.t);
  }
  function syncInputs() {
    const m = st.mode;
    xS.row.style.display = m === "single" ? "" : "none";
    loS.row.style.display = m === "interval" || m === "memoryless" ? "" : "none";
    hiS.row.style.display = m === "interval" || m === "memoryless" ? "" : "none";
    loS.row.firstChild.textContent = m === "memoryless" ? "lo (more time, after t)" : "lo";
    hiS.row.firstChild.textContent = m === "memoryless" ? "hi (more time, after t)" : "hi";
    pS.row.style.display = m === "percentile" ? "" : "none";
    tS.row.style.display = m === "memoryless" ? "" : "none";
  }
  function draw() {
    const { beta, unit: u } = st, rate = rateOf();
    const f = (x) => (x >= 0 ? Math.exp(-x / beta) / beta : 0), F = (x) => (x > 0 ? 1 - Math.exp(-x / beta) : 0), S = (x) => Math.exp(-Math.max(0, x) / beta);
    const W = 320, pad = 34, base = 150, top = 22, x1 = 6 * beta;
    const X = (x) => pad + (x / x1) * (W - 2 * pad);
    const Yp = (v) => base - (v / (1 / beta)) * (base - top);
    const Yc = (v) => base - v * (base - top);
    svgP.innerHTML = ""; svgC.innerHTML = "";
    const gp = svgEl("g"), gc = svgEl("g"); svgP.append(gp); svgC.append(gc);
    const ticks = niceTicks(0, x1, 6);
    let rowsOut, linesOut, shade = [], cmarks = [];
    const ratePart = `rate = 1/${num(beta)}`;
    if (st.mode === "single") {
      const x = st.x, p = F(x);
      shade.push([0, x, "var(--hl-soft)", "var(--hl)"]);
      cmarks.push([x, p, `F(${num(x)}) = ${f4(p)}`]);
      linesOut = [
        `f(x) = (1/β) e^(−x/β) = ${num(1 / beta, 4)} e^(−${num(1 / beta, 4)}x) for x ≥ 0`,
        `P(X ≤ ${num(x)}) = F(${num(x)}) = 1 − e^(−${num(x)}/${num(beta)}) = 1 − e^(−${num(x / beta, 4)}) = 1 − ${f4(S(x))} = ${f4(p)}`,
        `P(X > ${num(x)}) = e^(−${num(x / beta, 4)}) = ${f4(S(x))}`,
        `R: pexp(${num(x)}, ${ratePart}) → ${rnum(p)}; 1 - pexp(${num(x)}, ${ratePart}) → ${rnum(S(x))}`,
      ];
      rowsOut = [[`P(X ≤ ${num(x)})`, f4(p), "shaded area, F(x)"], [`P(X > ${num(x)})`, f4(S(x)), "e^(−x/β)"], ["μ = β", `${num(beta, 4)} ${u}`, `rate 1/β = ${num(rate, 4)} per ${st.rateUnit}`], ["σ = β", `${num(beta, 4)} ${u}`, "σ² = β²"]];
    } else if (st.mode === "interval") {
      const { lo, hi } = st, eLo = S(lo), eHi = S(hi), p = eLo - eHi;
      shade.push([lo, hi, "var(--hl-soft)", "var(--hl)"]);
      cmarks.push([lo, F(lo), `F(${num(lo)}) = ${f4(F(lo))}`], [hi, F(hi), `F(${num(hi)}) = ${f4(F(hi))}`]);
      linesOut = [
        `P(${num(lo)} ≤ X ≤ ${num(hi)}) = F(${num(hi)}) − F(${num(lo)}) = (1 − e^(−${num(hi / beta, 4)})) − (1 − e^(−${num(lo / beta, 4)}))`,
        `= e^(−${num(lo)}/${num(beta)}) − e^(−${num(hi)}/${num(beta)}) = e^(−${num(lo / beta, 4)}) − e^(−${num(hi / beta, 4)}) = ${f4(eLo)} − ${f4(eHi)} = ${f4(p)}`,
        `R: pexp(${num(hi)}, ${ratePart}) - pexp(${num(lo)}, ${ratePart}) → ${rnum(p)}`,
      ];
      rowsOut = [[`P(${num(lo)} ≤ X ≤ ${num(hi)})`, f4(p), "e^(−lo/β) − e^(−hi/β)"], [`e^(−lo/β)`, f4(eLo), `P(X > ${num(lo)})`], [`e^(−hi/β)`, f4(eHi), `P(X > ${num(hi)})`], ["μ = σ = β", `${num(beta, 4)} ${u}`, ""]];
    } else if (st.mode === "percentile") {
      const p = st.p, xp = -beta * Math.log(1 - p);
      shade.push([0, xp, "var(--hl-soft)", "var(--hl)"]);
      cmarks.push([xp, p, `F(x_p) = ${num(p)}`]);
      linesOut = [
        `F(x_p) = ${num(p)}: 1 − e^(−x_p/β) = ${num(p)} ⇒ e^(−x_p/β) = ${num(1 - p, 4)} ⇒ x_p = −β ln(1 − p)`,
        `x_p = −${num(beta)} ln(${num(1 - p, 4)}) = ${num(beta)} × ${num(-Math.log(1 - p), 4)} = ${num(xp, 4)} ${u}${Math.abs(xp - Number(xp.toFixed(2))) > 1e-9 ? ` ≈ ${num(xp, 2)} ${u}` : ""}`,
        `R: qexp(${num(p)}, ${ratePart}) → ${rnum(xp)}`,
      ];
      rowsOut = [[`${num(100 * p)}th percentile x_p`, `${num(xp, 4)} ${u}`, `≈ ${num(xp, 2)} ${u}: P(X ≤ x_p) = ${num(p)}`], ["−β ln(1 − p)", `−${num(beta)} × ${num(Math.log(1 - p), 4)}`, ""], ["μ = σ = β", `${num(beta, 4)} ${u}`, ""]];
    } else {
      const { t, lo, hi } = st, Lo = lo + t, Hi = hi + t;
      const numer = S(Lo) - S(Hi), den = S(t), cond = numer / den, plain = S(lo) - S(hi);
      shade.push([t, x1, "var(--blue-soft)", "var(--blue)"], [Lo, Hi, "var(--hl-soft)", "var(--hl)"]);
      cmarks.push([t, F(t), `F(${num(t)}) = ${f4(F(t))}`], [Lo, F(Lo), `F(${num(Lo)}) = ${f4(F(Lo))}`], [Hi, F(Hi), `F(${num(Hi)}) = ${f4(F(Hi))}`]);
      linesOut = [
        `given ${num(t)} ${u} already elapsed (X > ${num(t)}), the chance the total wait lands in [${num(Lo)}, ${num(Hi)}] is a conditional probability, a ratio of two areas:`,
        `P(${num(Lo)} ≤ X ≤ ${num(Hi)} | X > ${num(t)}) = P(${num(Lo)} ≤ X ≤ ${num(Hi)}) / P(X > ${num(t)}) = (e^(−${num(Lo / beta, 4)}) − e^(−${num(Hi / beta, 4)})) / e^(−${num(t / beta, 4)})`,
        `= (${f4(S(Lo))} − ${f4(S(Hi))}) / ${f4(den)} = ${f4(numer)} / ${f4(den)} = ${f4(cond)}`,
        `with no time elapsed: P(${num(lo)} ≤ X ≤ ${num(hi)}) = e^(−${num(lo / beta, 4)}) − e^(−${num(hi / beta, 4)}) = ${f4(S(lo))} − ${f4(S(hi))} = ${f4(plain)} — the same: the ${num(t)} ${u} already waited are forgotten`,
        `R: (pexp(${num(Hi)}, ${ratePart}) - pexp(${num(Lo)}, ${ratePart})) / (1 - pexp(${num(t)}, ${ratePart})) → ${rnum(cond)}`,
      ];
      rowsOut = [[`P(${num(Lo)} ≤ X ≤ ${num(Hi)} | X > ${num(t)})`, f4(cond), "ratio of the yellow area to the blue area"], [`P(${num(lo)} ≤ X ≤ ${num(hi)})`, f4(plain), "no time elapsed: equal (memoryless)"], ["numerator", f4(numer), `P(${num(Lo)} ≤ X ≤ ${num(Hi)})`], ["denominator", f4(den), `P(X > ${num(t)}) = e^(−t/β)`]];
    }
    // pdf panel
    for (const [a, b, fill, stroke] of shade) if (b > a) gp.append(svgEl("path", { d: areaPath(f, Math.max(0, a), Math.min(b, x1), X, Yp, base), fill, stroke, "stroke-width": 1 }));
    gp.append(svgEl("line", { x1: X(0), x2: X(0), y1: base, y2: Yp(1 / beta), stroke: "var(--blue)", "stroke-width": 2 }));
    gp.append(svgEl("path", { d: curvePath(f, 0, x1, X, Yp), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    if (st.mode === "memoryless") {
      const { t } = st;
      // conditional density of X given X > t: the original shifted right by t (dashed red)
      const fc = (x) => (x >= t ? Math.exp(-(x - t) / beta) / beta : 0);
      gp.append(svgEl("line", { x1: X(t), x2: X(t), y1: base, y2: Yp(1 / beta), stroke: "var(--red)", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
      gp.append(svgEl("path", { d: curvePath(fc, t, x1, X, Yp), fill: "none", stroke: "var(--red)", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
      // the remaining time X − t: the conditional density shifted back, drawn over the original (dashed green, coincides)
      gp.append(svgEl("path", { d: curvePath(f, 0, x1, X, Yp), fill: "none", stroke: "var(--green)", "stroke-width": 3, "stroke-dasharray": "4 8" }));
      text(gp, X(x1), 12, `X − t: same density as X`, { "text-anchor": "end", fill: "var(--green)" });
      text(gp, X(x1), base - 30, `f(x | X > ${num(t)}): f shifted by t`, { "text-anchor": "end", fill: "var(--red)" });
    } else {
      text(gp, X(0) + 4, 12, `f(x): f(0) = 1/β = ${num(1 / beta, 4)}`, { "text-anchor": "start", fill: "var(--blue)" });
    }
    gp.append(svgEl("line", { x1: X(beta), x2: X(beta), y1: Yp(f(beta)), y2: base, stroke: "var(--ink-dim)", "stroke-dasharray": "2 3" }));
    text(gp, X(beta), base + 28, `μ = σ = β = ${num(beta)} ${u}`, { fill: "var(--ink-dim)" });
    axis(gp, X, base, 0, x1, ticks, (v) => num(v, 2), "");
    // cdf panel
    for (const v of [0, 0.5, 1]) { gc.append(svgEl("line", { x1: pad, x2: W - pad, y1: Yc(v), y2: Yc(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); text(gc, pad - 4, Yc(v) + 4, String(v), { "text-anchor": "end", fill: "var(--ink-dim)" }); }
    gc.append(svgEl("path", { d: curvePath(F, 0, x1, X, Yc, 200), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    for (const [x, Fx, label] of cmarks) if (x <= x1) {
      gc.append(svgEl("line", { x1: X(x), x2: X(x), y1: base, y2: Yc(Fx), stroke: "var(--hl)", "stroke-dasharray": "3 3" }));
      gc.append(svgEl("line", { x1: pad, x2: X(x), y1: Yc(Fx), y2: Yc(Fx), stroke: "var(--hl)", "stroke-dasharray": "3 3" }));
      gc.append(svgEl("circle", { cx: X(x), cy: Yc(Fx), r: 3.5, fill: "var(--hl)" }));
      text(gc, X(x) + 4, Yc(Fx) - 5, label, { "text-anchor": "start", fill: "var(--hl)" });
    }
    axis(gc, X, base, 0, x1, ticks, (v) => num(v, 2), "");
    text(gc, X(x1), base - 8, "F(x) = 1 − e^(−x/β)", { "text-anchor": "end", fill: "var(--blue)" });
    text(gc, X(x1), base + 28, `x (${u})`, { "text-anchor": "end", fill: "var(--ink-dim)" });
    grid(out, rowsOut);
    lines(steps, linesOut);
    note.textContent = st.mode === "memoryless"
      ? "Memoryless: the density of the remaining wait given that t has passed (green, dashed) lies exactly on the original density, so the conditional answer equals the unconditional one with the elapsed time subtracted."
      : `β is the mean wait, and R's rate is 1/β = ${num(rate, 4)} per ${st.rateUnit}: pexp(x, rate = 1/β). The density starts at its highest point 1/β at x = 0 and the mean equals the standard deviation.`;
  }
  rescale(); syncInputs(); draw();
}

// =====================================================================
// widget: bit-error — Gaussian noise on two voltage levels
// =====================================================================
function bitError(box, cfg) {
  box.append(el("h4", null, cfg.title || "Gaussian noise and the bit-error probability"));
  const st = { v0: Number.isFinite(cfg.v0) ? cfg.v0 : 2, v1: Number.isFinite(cfg.v1) ? cfg.v1 : 3, sigma: cfg.sigma > 0 ? cfg.sigma : 0.22, sim: null };
  if (st.v1 <= st.v0) { st.v0 = 2; st.v1 = 3; }
  const v0F = numField("level for bit 0 (V)", st.v0, (v) => { if (v < st.v1) { st.v0 = v; st.sim = null; draw(); } });
  const v1F = numField("level for bit 1 (V)", st.v1, (v) => { if (v > st.v0) { st.v1 = v; st.sim = null; draw(); } });
  const sS = slider("noise σ", 0.05, 0.6, 0.01, clamp(st.sigma, 0.05, 0.6), (v) => { st.sigma = v; st.sim = null; draw(); }, (v) => `${num(v, 2)} V`);
  sS.input.setAttribute("aria-label", "noise standard deviation");
  const simBtn = el("button", "viz-btn", "send 1000 bits");
  simBtn.type = "button";
  simBtn.addEventListener("click", () => { simulate(); draw(); });
  const tools = el("div", "viz-btn-row"); tools.append(simBtn);
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg", role: "img", "aria-label": "two noise bells centred on the voltage levels with the threshold" });
  const out = el("div", "stat-grid");
  const steps = el("div", "stat-steps");
  const simOut = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(v0F.row, v1F.row, sS.row, tools, svg, out, steps, simOut, note);
  function gauss() { const u = 1 - Math.random(), v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function simulate() {
    const thr = (st.v0 + st.v1) / 2, pts = [];
    let n0 = 0, n1 = 0, f0 = 0, f1 = 0;
    for (let i = 0; i < 1000; i++) {
      const bit = Math.random() < 0.5 ? 0 : 1, v = (bit ? st.v1 : st.v0) + st.sigma * gauss(), read = v > thr ? 1 : 0;
      if (bit) { n1++; if (read !== bit) f1++; } else { n0++; if (read !== bit) f0++; }
      pts.push([v, bit, read !== bit]);
    }
    st.sim = { n0, n1, f0, f1, pts };
  }
  function draw() {
    const { v0, v1, sigma } = st, thr = (v0 + v1) / 2, d = (v1 - v0) / 2;
    const z = d / sigma, zr = z2(z), t = tableAt(zr), pTable = Math.round((1 - t) * 1e4) / 1e4, pExact = 1 - phi(z);
    const W = 640, pad = 40, base = 160, top = 46;
    const span = Math.max(3.5 * sigma, 0.6), x0 = v0 - span, x1 = v1 + span;
    const X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad);
    const peak = normPdf(0) / sigma;
    const Y = (v) => base - (v / peak) * (base - top);
    const b0 = (x) => normPdf((x - v0) / sigma) / sigma, b1 = (x) => normPdf((x - v1) / sigma) / sigma;
    svg.innerHTML = "";
    const g = svgEl("g"); svg.append(g);
    g.append(svgEl("path", { d: areaPath(b0, thr, x1, X, Y, base), fill: "var(--red-soft)", stroke: "var(--red)", "stroke-width": 1 }));
    g.append(svgEl("path", { d: areaPath(b1, x0, thr, X, Y, base), fill: "var(--red-soft)", stroke: "var(--red)", "stroke-width": 1 }));
    g.append(svgEl("path", { d: curvePath(b0, x0, x1, X, Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    g.append(svgEl("path", { d: curvePath(b1, x0, x1, X, Y), fill: "none", stroke: "var(--green)", "stroke-width": 2 }));
    g.append(svgEl("line", { x1: X(thr), x2: X(thr), y1: 14, y2: base, stroke: "var(--hl)", "stroke-width": 2, "stroke-dasharray": "6 4" }));
    text(g, X(thr), 11, `threshold ${num(thr)} V: read 0 below, 1 above`, { fill: "var(--hl)" });
    text(g, pad, 11, "received voltage (V)", { "text-anchor": "start", fill: "var(--ink-dim)" });
    const ticks = niceTicks(x0, x1, 8);
    axis(g, X, base, x0, x1, ticks, (v) => num(v, 2), "");
    g.append(svgEl("line", { x1: X(v0), x2: X(v0), y1: base, y2: base + 8, stroke: "var(--blue)", "stroke-width": 2 }));
    g.append(svgEl("line", { x1: X(v1), x2: X(v1), y1: base, y2: base + 8, stroke: "var(--green)", "stroke-width": 2 }));
    text(g, X(v0), base + 32, `sent 0: ${num(v0)} V + noise`, { fill: "var(--blue)" });
    text(g, X(v1), base + 32, `sent 1: ${num(v1)} V + noise`, { fill: "var(--green)" });
    text(g, X(thr), 30, `misread tails: P(0 read as 1) = P(1 read as 0) = ${f4(pTable)}`, { fill: "var(--red)" });
    if (st.sim) {
      const yS = base + 50;
      const ok = st.sim.pts.filter((p) => !p[2]).map(([v]) => `M${X(clamp(v, x0, x1)).toFixed(1)},${yS - 4}v8`).join("");
      const bad = st.sim.pts.filter((p) => p[2]).map(([v]) => `M${X(clamp(v, x0, x1)).toFixed(1)},${yS - 7}v14`).join("");
      g.append(svgEl("path", { d: ok, stroke: "var(--ink-dim)", "stroke-width": 1, opacity: 0.6 }));
      g.append(svgEl("path", { d: bad, stroke: "var(--red)", "stroke-width": 2 }));
      text(g, W - pad, yS + 20, `1000 received voltages; red = misread (${st.sim.f0 + st.sim.f1})`, { "text-anchor": "end", fill: "var(--red)" });
    }
    grid(out, [
      ["threshold (midpoint)", `${num(thr)} V`, `(${num(v0)} + ${num(v1)})/2`],
      ["noise needed to flip a 0", `${num(d)} V`, `${num(thr)} − ${num(v0)}`],
      ["Z = d/σ", f2(zr), `${num(d)}/${num(sigma)} = ${num(z, 4)}`],
      ["P(0 read as 1) = P(Z > " + f2(zr) + ")", f4(pTable), `1 − ${f4(t)} (table)`],
      ["R: 1 - pnorm(" + num(d) + ", 0, " + num(sigma) + ")", rnum(pExact), "unrounded Z"],
      ["P(1 read as 0)", f4(pTable), "same by symmetry"],
    ]);
    lines(steps, [
      `noise N ~ N(0, ${num(sigma)}²); a sent 0 arrives as ${num(v0)} + N and is read as 1 when ${num(v0)} + N > ${num(thr)}, i.e. N > ${num(d)}`,
      `Z = (${num(d)} − 0)/${num(sigma)} = ${num(z, 4)} → ${f2(zr)}; table: P(Z ≤ ${f2(zr)}) = ${f4(t)}`,
      `P(N > ${num(d)}) = P(Z > ${f2(zr)}) = 1 − ${f4(t)} = ${f4(pTable)} (about ${num(100 * pTable, 2)} % of the 0 bits flip)`,
      `R: 1 - pnorm(${num(d)}, 0, ${num(sigma)}) → ${rnum(pExact)}`,
    ]);
    if (st.sim) {
      const { n0, n1, f0, f1 } = st.sim;
      grid(simOut, [
        ["0 bits sent", String(n0), `expected flips ≈ ${n0} × ${f4(pExact)} = ${num(n0 * pExact, 1)}`],
        ["0 bits read as 1", String(f0), `observed rate ${f4(f0 / n0)}`],
        ["1 bits sent", String(n1), `expected flips ≈ ${num(n1 * pExact, 1)}`],
        ["1 bits read as 0", String(f1), `observed rate ${f4(f1 / n1)}`],
        ["bit error rate", f4((f0 + f1) / 1000), `${f0 + f1} of 1000`],
      ]);
    } else simOut.innerHTML = "";
    note.textContent = "The receiver picks whichever level is closer, so the decision threshold is the midpoint; the misread probability is the tail of the noise bell beyond half the level gap. Smaller noise σ (or levels further apart) shrinks the tails; the 1000-bit simulation draws Gaussian noise and counts how many bits land on the wrong side.";
  }
  draw();
}

// =====================================================================
// playback widgets (app/playback.js): every frame is a pure function of the playback position
// =====================================================================
const ease = (f) => f * f * (3 - 2 * f);
/** Eased progress, 0 to 1, of playback step i + 1 at position pos. */
const stepProg = (pos, i) => ease(clamp(pos - i, 0, 1));
const setText = (node, s) => { if (node.textContent !== s) node.textContent = s; };
const paren = (v) => (v < 0 ? `(${num(v)})` : num(v));
/** Row and column of a 2-decimal z in the printed left-tail table. */
function zCell(z) {
  const k = Math.abs(Math.round(z * 100));
  if (k > Z_MAX) return "beyond the last row of the printed table";
  return `row ${(z < 0 ? "−" : "") + (Math.floor(k / 10) / 10).toFixed(1)}, column .${String(k % 10).padStart(2, "0")}`;
}
/**
 * Predict mode for a playback widget. questions() returns [{ at, options: [{ label, ok, why }] }] in
 * playback order: the animation is held at position `at` until the option with ok is picked.
 */
export function predictGates(ask, count, questions, getPb) {
  const g = { on: false, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: -1, key: null, refocus: false };
  const cur = () => (g.on ? questions()[g.answered] || null : null);
  g.limit = () => { const q = cur(); return q ? q.at : count; };
  g.asking = (pos) => { const q = cur(); return q && Math.abs(pos - q.at) < 1e-6 ? q : null; };
  /** Steps already on screen at pos count as answered. */
  g.restart = (pos = 0) => {
    g.answered = g.on ? questions().filter((q) => q.at < pos - 1e-9).length : 0;
    g.asked = 0; g.firstTry = 0; g.missed = false; g.wrong = -1; g.key = null;
  };
  g.tally = () => (g.asked > 0 ? ` ${g.firstTry} of ${g.asked} right on the first try.` : "");
  g.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  g.render = (pos) => {
    const q = g.asking(pos);
    const key = q ? `${g.answered}|${g.wrong}|${q.options.map((o) => o.label).join("|")}` : "";
    if (key === g.key) return;
    g.key = key; ask.innerHTML = ""; ask.hidden = !g.on;
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
        getPb().play(); // on to the next question, or to the end
      });
      ask.append(b);
      return b;
    });
    if (g.wrong >= 0) ask.append(el("span", "playback-feedback", `Not ${q.options[g.wrong].label}. ${q.options[g.wrong].why}`));
    if (g.refocus) { g.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  };
  return g;
}
export function predictCheck(text, on) {
  const label = el("label", "playback-check");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = on;
  label.append(input, " " + text);
  return { label, input };
}

// =====================================================================
// widget: standardize-play — X to Z as four played steps: the question, subtract μ, divide by σ, the table
// =====================================================================
const SP_PRESETS = {
  "IQ below 120": { mu: 100, sigma: 15, lo: null, hi: 120, unit: "", v: "X" },
  "radiation 4.35 to 5.00": { mu: 4.35, sigma: 0.5, lo: 4.35, hi: 5, unit: "mrem", v: "X" },
  "radiation above 5.00": { mu: 4.35, sigma: 0.5, lo: 5, hi: null, unit: "mrem", v: "X" },
  "noise above 0.5 V": { mu: 0, sigma: 0.22, lo: 0.5, hi: null, unit: "V", v: "N" },
};
let spSeq = 0;
function standardizePlay(box, cfg) {
  const names = Object.keys(SP_PRESETS);
  const pre = SP_PRESETS[cfg.preset] || null, src = pre || cfg;
  const st = { mu: Number.isFinite(src.mu) ? src.mu : 100, sigma: src.sigma > 0 ? src.sigma : 15, unit: typeof src.unit === "string" ? src.unit : "", v: (pre ? pre.v : typeof cfg.var === "string" && cfg.var) || "X" };
  let lo0 = Number.isFinite(src.lo) ? src.lo : null, hi0 = Number.isFinite(src.hi) ? src.hi : null;
  if (lo0 == null && hi0 == null) hi0 = src.mu === undefined && src.sigma === undefined ? 120 : st.mu + st.sigma;
  if (lo0 != null && hi0 != null && lo0 > hi0) [lo0, hi0] = [hi0, lo0];
  const uid = ++spSeq;
  // cfg.table false stops after the divide-by-σ step: three steps, no Z-table read.
  const TABLE = cfg.table !== false, COUNT = TABLE ? 4 : 3;
  let m = null, pb = null, recKey = null;

  box.append(el("h4", null, cfg.title || (TABLE ? "Standardizing, played step by step: subtract μ, divide by σ, read the table" : "Standardizing, played step by step: subtract μ, divide by σ")));
  const samePreset = () => names.findIndex((n) => {
    const q = SP_PRESETS[n], lo = loF.get(), hi = hiF.get();
    return q.mu === st.mu && q.sigma === st.sigma && (q.lo == null ? !Number.isFinite(lo) : q.lo === lo) && (q.hi == null ? !Number.isFinite(hi) : q.hi === hi);
  });
  const presetRow = cfg.presets !== false ? btnRow(names, (i, l) => {
    const q = SP_PRESETS[l];
    Object.assign(st, { mu: q.mu, sigma: q.sigma, unit: q.unit, v: q.v });
    muF.set(st.mu); sigF.set(st.sigma); loF.set(q.lo); hiF.set(q.hi);
    restart(false);
  }, -1) : null;
  const custom = () => { st.unit = ""; st.v = "X"; };
  const muF = numField("μ", st.mu, (v) => { st.mu = v; custom(); restart(true); });
  const sigF = numField("σ", st.sigma, (v) => { if (v > 0) { st.sigma = v; custom(); restart(true); } });
  const loF = boundField("lower bound", lo0, -1, () => changed("lo"));
  const hiF = boundField("upper bound", hi0, 1, () => changed("hi"));
  function changed(moved) {
    const other = moved === "lo" ? hiF : loF;
    if (loF.isInf() && hiF.isInf()) other.setFinite(moved === "lo" ? st.mu + st.sigma : st.mu - st.sigma);
    const lo = loF.get(), hi = hiF.get();
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo > hi) other.setFinite(moved === "lo" ? lo : hi);
    custom(); restart(true);
  }
  const pc = predictCheck(TABLE ? "Predict each Z value and table operation before it is shown" : "Predict each Z value before it is shown", !!cfg.predict);
  const W = 640, H = 234, base = 176, CX = 320, P1 = 48, H1 = 100, R = 3.6;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg net-svg", role: "img", "aria-label": "a normal curve being standardized into the standard normal curve" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note", "Z = (X − μ)/σ: subtracting μ moves the centre to 0 and dividing by σ makes the spread 1; neither changes the shaded area." + (TABLE ? " The table gives the area to the left of z; a right tail is 1 − the cell and an area between two values is the difference of two cells." : ""));
  if (presetRow) box.append(presetRow);
  box.append(muF.row, sigF.row, loF.row, hiF.row, pc.label, svg, caption, ask);

  const evt = (lo, hi, v, fmt = num) => (lo != null && hi != null ? `P(${fmt(lo)} ≤ ${v} ≤ ${fmt(hi)})` : hi != null ? `P(${v} ≤ ${fmt(hi)})` : `P(${v} > ${fmt(lo)})`);
  function model() {
    const { mu, sigma, v } = st;
    const L = !loF.isInf(), Hh = !hiF.isInf(), lo = L ? loF.get() : null, hi = Hh ? hiF.get() : null;
    const sLo = L ? zStep(lo, mu, sigma) : null, sHi = Hh ? zStep(hi, mu, sigma) : null;
    const tLo = sLo ? sLo.t : 0, tHi = sHi ? sHi.t : 1;
    const kind = L && Hh ? "between" : Hh ? "left" : "right";
    const pt = Math.round(Math.max(0, tHi - tLo) * 1e4) / 1e4;
    const exact = (Hh ? phi((hi - mu) / sigma) : 1) - (L ? phi((lo - mu) / sigma) : 0);
    const vS = `${v} − ${paren(mu)}`;
    const want = evt(lo, hi, v), wantS = evt(L ? lo - mu : null, Hh ? hi - mu : null, vS), wantZ = evt(sLo && sLo.zr, sHi && sHi.zr, "Z", f2);
    const answer = kind === "between" ? `${want} = ${wantZ} = ${f4(tHi)} − ${f4(tLo)} = ${f4(pt)}` : kind === "left" ? `${want} = ${wantZ} = ${f4(pt)}` : `${want} = ${wantZ} = 1 − ${f4(tLo)} = ${f4(pt)}`;
    const bounds = [L && [lo, sLo], Hh && [hi, sHi]].filter(Boolean);
    return { lo, hi, sLo, sHi, tLo, tHi, kind, pt, exact, vS, want, wantS, wantZ, answer, bounds };
  }
  function questions() {
    const { mu, sigma } = st;
    const [x, s] = m.bounds[m.bounds.length - 1], right = f2(s.zr);
    const cands = [
      [(mu - x) / sigma, "That is (μ − x)/σ. The subtraction is x − μ, so the sign is backwards."],
      [x / sigma, "That is x/σ. Subtract μ first, then divide by σ."],
      [x - mu, "That is x − μ, the step already done. It still has to be divided by σ."],
      [(x - mu) / (sigma * sigma), "That divides by the variance σ². Divide by the standard deviation σ."],
      [(x - sigma) / mu, "That swaps μ and σ. Z = (x − μ)/σ."],
      [s.zr + 1, "Z = (x − μ)/σ."], [s.zr - 1, "Z = (x − μ)/σ."], [s.zr + 2, "Z = (x − μ)/σ."],
    ];
    const opts = [{ label: right, ok: true, val: s.zr }];
    for (const [val, why] of cands) {
      if (opts.length >= 4) break;
      if (!Number.isFinite(val) || opts.some((o) => o.label === f2(val))) continue;
      opts.push({ label: f2(val), ok: false, why, val });
    }
    opts.sort((a, b) => a.val - b.val);
    const rule = "The table gives the area to the left of z. A right tail is 1 − the cell; an area between two values is the difference of two cells.";
    const ops = [["the table value", "left"], ["1 − the table value", "right"], ["the difference of two table values", "between"]];
    const qs = [{ at: 2, options: opts }];
    if (TABLE) qs.push({ at: 3, options: ops.map(([label, k]) => ({ label, ok: k === m.kind, why: rule })) });
    return qs;
  }
  const gate = predictGates(ask, COUNT, questions, () => pb);

  function frame(pos) {
    const { mu, sigma, v } = st, u = st.unit;
    const p1 = stepProg(pos, 0), p2 = stepProg(pos, 1), p3 = stepProg(pos, 2), q4 = clamp(pos - 3, 0, 1);
    const D = mu === 0 ? 0 : Math.sign(mu) * 120;
    const P3 = sigma > 1 ? 37 : sigma < 1 ? 62 : P1;
    const geom = (b, c) => { const cx = CX + D * (1 - b), psd = P1 * (P3 / P1) ** c, h = (H1 * P1) / psd; return { X: (z) => cx + z * psd, Y: (w) => base - h * w }; };
    const bell = (z) => Math.exp(-z * z / 2);
    const G = geom(p2, p3);
    const q = gate.asking(pos), step = pos <= 0 ? 0 : Math.ceil(pos - 1e-9), moving = Math.abs(pos - Math.round(pos)) > 1e-9;
    svg.innerHTML = "";
    const defs = svgEl("defs"), g = svgEl("g");
    svg.append(defs, g);
    for (const [name, angle] of [["blue", 45], ["red", -45]]) {
      const p = svgEl("pattern", { id: `sp${uid}-${name}`, width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: `rotate(${angle})` });
      p.append(svgEl("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: `var(--${name})`, "stroke-width": 1.6 }));
      defs.append(p);
    }
    g.append(svgEl("line", { x1: 20, x2: W - 20, y1: base, y2: base, stroke: "var(--rule-strong)" }));
    // where the curve was before the step in progress
    if (moving && (step === 2 || step === 3)) {
      const G0 = step === 2 ? geom(0, 0) : geom(1, 0);
      g.append(svgEl("path", { d: curvePath(bell, -R, R, G0.X, G0.Y), fill: "none", stroke: "var(--ink-dim)", "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: (0.8 * (1 - (step === 2 ? p2 : p3))).toFixed(2) }));
    }
    // the wanted area: the same share of the curve at every step
    const zl = m.sLo ? clamp(m.sLo.z, -R, R) : -R, zh = m.sHi ? clamp(m.sHi.z, -R, R) : R;
    const zb = zl + (zh - zl) * p1;
    if (zb > zl) g.append(svgEl("path", { d: areaPath(bell, zl, zb, G.X, G.Y, base), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    // the table's left tails, hatched
    const tails = m.kind === "between" ? [[zh, "blue", 0, 0.5], [zl, "red", 0.5, 1]] : [[m.kind === "left" ? zh : zl, "blue", 0, 1]];
    if (pos > 3) for (const [z, name, f0, f1] of tails) {
      const e = ease(clamp((q4 - f0) / (f1 - f0), 0, 1));
      if (e > 0 && z > -R) g.append(svgEl("path", { d: areaPath(bell, -R, -R + (z + R) * e, G.X, G.Y, base), fill: `url(#sp${uid}-${name})`, stroke: `var(--${name})`, "stroke-width": 1 }));
    }
    g.append(svgEl("path", { d: curvePath(bell, -R, R, G.X, G.Y), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    // the axis rides with the curve and relabels: (μ + kσ), then minus μ, then divided by σ
    for (let k = -3; k <= 3; k++) {
      const val = (mu * (1 - p2) + k * sigma) / sigma ** p3, a = Math.abs(val);
      g.append(svgEl("line", { x1: G.X(k), x2: G.X(k), y1: base, y2: base + 4, stroke: "var(--ink-dim)" }));
      text(g, G.X(k), base + 16, num(val, moving ? (a >= 100 ? 0 : a >= 10 ? 1 : 2) : 2), k === 0 && step >= 2 ? { fill: "var(--ink)", "font-weight": 600 } : {});
    }
    // the bounds
    const two = m.bounds.length > 1;
    if (p1 > 0) m.bounds.forEach(([x, s], i) => {
      const px = G.X(clamp(s.z, -R, R));
      const label = pos > 3 ? `z = ${f2(s.zr)}` : pos > 2 ? s.line : pos > 1 ? `${num(x)} − ${paren(mu)} = ${num(x - mu)}` : `${v.toLowerCase()} = ${num(x)}${u ? " " + u : ""}`;
      const half = label.length * 3.4 + 4;
      g.append(svgEl("line", { x1: px, x2: px, y1: 32, y2: base, stroke: "var(--hl)", "stroke-width": 1.5, opacity: p1.toFixed(2) }));
      text(g, clamp(px, half, W - half), two && i === 0 ? 12 : 26, label, { fill: "var(--hl)", opacity: p1.toFixed(2), "font-weight": step === 2 || step === 3 ? 600 : 400 });
    });
    // two lines under the axis: the variable, and the shaded area in that variable
    let l1 = "", l2 = "";
    if (pos <= 1) { l1 = `${v} ~ N(${num(mu)}, ${num(sigma)}²)${u ? ", in " + u : ""}`; l2 = pos > 0 ? `shaded area = ${m.want}` : ""; }
    else if (pos <= 2) { l1 = `${m.vS} ~ N(0, ${num(sigma)}²)`; l2 = `shaded area = ${m.want} = ${m.wantS}`; }
    else if (pos <= 3) { l1 = `Z = (${v} − ${paren(mu)})/${num(sigma)} is standard normal: μ = 0, σ = 1`; l2 = `shaded area = ${m.want} = ${m.wantZ}`; }
    else l2 = m.answer;
    if (pos > 3) {
      const t = svgEl("text", { x: CX, y: base + 36, "font-size": 11, "text-anchor": "middle", fill: "var(--ink-2)" }, "table: ");
      const reads = m.kind === "between" ? [[m.sHi, "blue", 0], [m.sLo, "red", 0.5]] : [[m.kind === "left" ? m.sHi : m.sLo, "blue", 0]];
      reads.forEach(([s, name, from], i) => { if (q4 > from || pos >= 4) t.append(svgEl("tspan", { fill: `var(--${name})`, "font-weight": 600 }, `${i ? "   " : ""}▨ P(Z ≤ ${f2(s.zr)}) = ${f4(s.t)}`)); });
      g.append(t);
    } else text(g, CX, base + 36, l1);
    if (l2) text(g, CX, base + 52, l2, pos > 3 ? { fill: "var(--ink)", "font-weight": 600, "font-size": 12 } : { fill: "var(--hl)" });

    // caption
    const bList = (fn) => m.bounds.map(fn).join(" and ");
    let cap;
    if (q && q.at === 2) {
      const [x] = m.bounds[m.bounds.length - 1];
      cap = `The curve is centred at 0 and σ = ${num(sigma)}. Dividing by σ turns ${num(x - mu)} into which Z (2 decimals)?`;
    } else if (q) cap = `The table gives P(Z ≤ z), the area to the left of z. Which operation on the table gives the shaded area ${m.wantZ}?`;
    else if (step === 0) cap = TABLE ? `Press Play. The Z table covers one curve, with μ = 0 and σ = 1. Here μ = ${num(mu)} and σ = ${num(sigma)}, so the question has to be converted first.` : `The standard normal curve has μ = 0 and σ = 1. Here μ = ${num(mu)} and σ = ${num(sigma)}: subtracting μ and dividing by σ turns this curve into that one.`;
    else if (step === 1) cap = `The question is an area under the N(${num(mu)}, ${num(sigma)}²) curve: ${m.want}, the area ${m.kind === "between" ? `between ${num(m.lo)} and ${num(m.hi)}` : m.kind === "left" ? `to the left of ${num(m.hi)}` : `to the right of ${num(m.lo)}`}.`;
    else if (step === 2) cap = mu === 0
      ? `Subtract μ = 0: the curve is already centred at 0, so nothing moves and ${bList(([x]) => `${num(x)} stays ${num(x)}`)}. The shaded area is unchanged.`
      : `Subtract μ = ${num(mu)} from every value: the curve slides until its centre is at 0, and ${bList(([x]) => `${num(x)} becomes ${num(x)} − ${paren(mu)} = ${num(x - mu)}`)}. Sliding does not change the shape, so the shaded area is unchanged.`;
    else if (step === 3) {
      const each = bList(([x, s]) => { const exact = Math.abs(s.z - s.zr) < 5e-7; return `${num(x - mu)} becomes ${num(x - mu)}/${num(sigma)} = ${exact ? f2(s.zr) : `${num(s.z, 4)}, rounded to ${f2(s.zr)} for the table`}`; });
      cap = sigma === 1
        ? `Divide by σ = 1: the curve is already the standard normal, and ${each}. The shaded area is unchanged.`
        : `Divide every value by σ = ${num(sigma)}: the curve ${sigma > 1 ? "squeezes" : "stretches"} into the standard normal, and ${each}. The area to the left of x under the X curve equals the area to the left of z under the Z curve.`;
      if (!TABLE && pos >= 3) cap += ` So ${m.want} = ${m.wantZ}.${gate.tally()}`;
    } else {
      const rd = (s) => `P(Z ≤ ${f2(s.zr)}) = ${f4(s.t)} (${zCell(s.zr)})`;
      cap = m.kind === "left" ? `Read the table: ${rd(m.sHi)}. The table gives the area to the left of z, which is the area wanted: ${m.want} = ${f4(m.pt)}.`
        : m.kind === "right" ? `Read the table: ${rd(m.sLo)}, the area to the left. The area wanted is the right tail, 1 − the cell: ${m.want} = 1 − ${f4(m.tLo)} = ${f4(m.pt)}.`
          : `Read the table twice: ${rd(m.sHi)} and ${rd(m.sLo)}. An area between two values is the difference of two cells: ${f4(m.tHi)} − ${f4(m.tLo)} = ${f4(m.pt)}.`;
      if (pos >= 4) cap += gate.tally();
    }
    setText(caption, cap);
    // the written record of the steps drawn so far
    if (recKey !== step) {
      recKey = step;
      const rec = [];
      if (step >= 1) rec.push(`${v} ~ N(${num(mu)}, ${num(sigma)}²); wanted: ${m.want}`);
      if (step >= 2) rec.push(`subtract μ: ${m.bounds.map(([x]) => `${num(x)} − ${paren(mu)} = ${num(x - mu)}`).join("; ")}`);
      if (step >= 3) rec.push(`divide by σ: ${m.bounds.map(([, s]) => s.line).join("; ")}`);
      if (step >= 3 && !TABLE) rec.push(`${m.want} = ${m.wantZ}`);
      if (step >= 4) {
        const differs = Math.abs(m.exact - m.pt) >= 5e-5;
        rec.push(m.bounds.map(([, s]) => s.read).reverse().join("; "), m.answer,
          `R: ${rCall("pnorm", `${num(mu)}, ${num(sigma)}`, m.lo ?? -Infinity, m.hi ?? Infinity)} → ${rnum(m.exact)}${differs ? ` (R uses the unrounded Z; the table's 2-decimal Z gives ${f4(m.pt)})` : " (agrees with the table to 4 decimals)"}`);
      }
      lines(steps, rec);
    }
    gate.render(pos);
  }
  function restart(fromField) {
    m = model(); recKey = null;
    if (presetRow) setActive(presetRow, samePreset());
    gate.restart(0);
    pb.reset(COUNT);
  }
  m = model();
  pb = createPlayback({ count: COUNT, unit: "step", stepMs: () => cfg.stepMs || 2200, onFrame: frame, limit: () => gate.limit(), onBlocked: () => gate.nudge() });
  box.append(pb.el, steps, note);
  gate.on = pc.input.checked;
  pc.input.addEventListener("change", () => { gate.on = pc.input.checked; pb.pause(); gate.restart(pb.pos()); pb.set(pb.pos()); });
  restart(false);
}

// =====================================================================
// widget: memoryless-play — why P(X > s + t | X > s) = P(X > t): cut the tail at s, rescale it, slide it back
// =====================================================================
function memorylessPlay(box, cfg) {
  const DEF = { beta: 2, s: 1, t: 2 };
  const st = { beta: cfg.beta > 0 ? cfg.beta : DEF.beta, s: cfg.s > 0 ? cfg.s : DEF.s, t: cfg.t > 0 ? cfg.t : DEF.t, unit: typeof cfg.unit === "string" ? cfg.unit : "min" };
  let pb = null, recKey = null;
  box.append(el("h4", null, cfg.title || "Memoryless, played step by step: cut the tail at s, rescale it, slide it back"));
  const fit = () => { st.s = Math.min(st.s, 2.5 * st.beta); st.t = Math.min(st.t, 4 * st.beta); };
  const sync = () => { betaF.set(num(st.beta, 6)); sF.set(num(st.s, 6)); tF.set(num(st.t, 6)); };
  const betaF = numField("β (mean time)", st.beta, (v) => { if (v > 0) { st.beta = v; restart(); } }, { suffix: st.unit });
  const sF = numField("s (time already spent)", st.s, (v) => { if (v > 0) { st.s = v; restart(); } }, { suffix: st.unit });
  const tF = numField("t (more time)", st.t, (v) => { if (v > 0) { st.t = v; restart(); } }, { suffix: st.unit });
  for (const f of [betaF, sF, tF]) { f.input.min = 0; f.input.addEventListener("change", sync); }
  const tools = el("div", "viz-btn-row");
  const teller = el("button", "viz-btn", "bank teller: β = 2, s = 1, t = 2");
  teller.type = "button";
  teller.addEventListener("click", () => { Object.assign(st, DEF); sync(); restart(); });
  tools.append(teller);
  const pc = predictCheck("Predict the conditional probability before the tail is cut", !!cfg.predict);
  const W = 640, H = 212, pad = 40, base = 170, top = 26;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg net-svg", role: "img", "aria-label": "exponential density with the tail beyond s cut, rescaled and slid back" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const steps = el("div", "stat-steps");
  const note = el("p", "widget-note");
  box.append(tools, betaF.row, sF.row, tF.row, pc.label, svg, caption, ask);

  const S = (x) => Math.exp(-x / st.beta);
  const expo = (x) => `e^(−${num(x)}/${num(st.beta)}) = e^(−${num(x / st.beta, 4)}) = ${f4(S(x))}`;
  function questions() {
    const { s, t } = st, n = s + t;
    const frac = `${f4(S(n))}/${f4(S(s))}`;
    const opts = [
      { x: n, label: `P(X > ${num(n)}) = ${f4(S(n))}`, ok: false, why: `That is the darker area as a share of the whole area 1. Given X > ${num(s)}, only the tail beyond ${num(s)} is possible, so divide by its area: ${frac}.` },
      { x: t, label: `P(X > ${num(t)}) = ${f4(S(t))}`, ok: true },
    ];
    if (s !== t) opts.push({ x: s, label: `P(X > ${num(s)}) = ${f4(S(s))}`, ok: false, why: `That is the condition itself, the whole shaded tail. The question is what share of that tail lies beyond ${num(n)}: ${frac}.` });
    opts.sort((a, b) => a.x - b.x);
    return [{ at: 2, options: opts }];
  }
  const gate = predictGates(ask, 4, questions, () => pb);

  function frame(pos) {
    const { beta, s, t } = st, u = st.unit, n = s + t;
    const p1 = stepProg(pos, 0), p2 = stepProg(pos, 1), p3 = stepProg(pos, 2), p4 = stepProg(pos, 3);
    const step = pos <= 0 ? 0 : Math.ceil(pos - 1e-9), q = gate.asking(pos);
    const x1 = Math.max(6 * beta, n + 2 * beta);
    const f = (x) => Math.exp(-x / beta) / beta;
    const X = (x) => pad + (x / x1) * (W - 2 * pad);
    const Y = (v) => base - v * beta * (base - top);
    // the tail beyond s, scaled by a (1 → 1/P(X > s)) and slid left by c (0 → s)
    const a = 1 + (1 / S(s) - 1) * p3, c = s * p4, xEnd = x1 + c;
    const pts = (A, B, k = 90) => { let d = ""; for (let i = 0; i <= k; i++) { const x = A + ((B - A) * i) / k; d += `L${X(x - c).toFixed(1)},${Y(a * f(x)).toFixed(1)}`; } return d; };
    const area = (A, B) => `M${X(A - c).toFixed(1)},${base}${pts(A, B)}L${X(B - c).toFixed(1)},${base}Z`;
    svg.innerHTML = "";
    const g = svgEl("g"); svg.append(g);
    const lightB = s + (xEnd - s) * p1, darkB = n + (xEnd - n) * p2;
    if (lightB > s) g.append(svgEl("path", { d: area(s, lightB), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    if (darkB > n) g.append(svgEl("path", { d: area(n, darkB), fill: "var(--hl)", "fill-opacity": 0.6 }));
    const whole = `M${X(0).toFixed(1)},${base}L${X(0).toFixed(1)},${Y(1 / beta).toFixed(1)}` + curvePath(f, 0, x1, X, Y).replace(/^M/, "L");
    if (p3 < 1) g.append(svgEl("path", { d: whole, fill: "none", stroke: "var(--blue)", "stroke-width": 2, opacity: (1 - p3).toFixed(2) }));
    if (pos > 2) {
      g.append(svgEl("path", { d: `M${X(s - c).toFixed(1)},${base}${pts(s, xEnd, 160)}`, fill: "none", stroke: "var(--blue)", "stroke-width": 2.4 }));
      // the original density, kept as a dashed outline for the rescaled tail to land on
      g.append(svgEl("path", { d: whole, fill: "none", stroke: "var(--ink)", "stroke-width": 1.2, "stroke-dasharray": "5 4", opacity: p3.toFixed(2) }));
    }
    text(g, X(0) + 6, 16, `f(0) = 1/β = ${num(1 / beta, 4)}`, { "text-anchor": "start", fill: "var(--blue)" });
    axis(g, X, base, 0, x1, niceTicks(0, x1, 8), (v) => num(v, 2), "");
    text(g, W - 6, base + 34, pos > 3 ? `x − s, the time still to come${u ? ` (${u})` : ""}` : `x${u ? ` (${u})` : ""}`, { "text-anchor": "end", fill: "var(--ink-dim)" });
    // the marks at s and s + t ride with the tail
    const close = X(n) - X(s) < 78;
    const marks = [
      [s, p1 * (1 - p4), `s = ${num(s)}`, close ? "end" : "middle", close ? 8 : 0],
      [n, p2, pos >= 4 ? `t = ${num(t)}` : pos > 3 ? "(s + t) − s" : `s + t = ${num(n)}`, close ? "start" : "middle", close ? -8 : 0],
    ];
    for (const [x, op, label, anchor, dx] of marks) {
      if (op <= 0) continue;
      g.append(svgEl("line", { x1: X(x - c), x2: X(x - c), y1: top - 6, y2: base + 22, stroke: "var(--hl)", "stroke-width": 1.4, "stroke-dasharray": "4 3", opacity: op.toFixed(2) }));
      text(g, X(x - c) + dx, base + 34, label, { fill: "var(--hl)", "text-anchor": anchor, opacity: op.toFixed(2), "font-weight": 600 });
    }
    // the numbers, one line per step
    const ratio = f4(S(n) / S(s));
    const rows = [
      ["light", `P(X > ${num(s)}) = ${expo(s)}`],
      ["dark", `P(X > ${num(n)}) = ${expo(n)}`],
      ["dark", `P(X > ${num(n)} | X > ${num(s)}) = ${f4(S(n))}/${f4(S(s))} = ${ratio}`],
      ["dark", `P(X > ${num(t)}) = ${expo(t)}`],
    ];
    rows.forEach(([sw, s1], i) => {
      if (!(pos > i)) return;
      const y = 18 + 17 * i, hot = step === i + 1;
      g.append(svgEl("rect", { x: 286, y: y - 9, width: 10, height: 10, fill: sw === "light" ? "var(--hl-soft)" : "var(--hl)", "fill-opacity": sw === "light" ? 1 : 0.6, stroke: "var(--hl)", "stroke-width": 1 }));
      text(g, 302, y, s1, { "text-anchor": "start", fill: hot ? "var(--ink)" : "var(--ink-2)", "font-weight": hot ? 600 : 400 });
    });
    // caption
    const U = u ? " " + u : "";
    let cap;
    if (q) cap = `Time already spent: s = ${num(s)}${U}, so X > ${num(s)} is known. What will P(X > ${num(n)} | X > ${num(s)}) equal?`;
    else if (step === 0) cap = `Press Play. The time X is exponential with β = ${num(beta)}${U}. Having waited s = ${num(s)}${U} already, what is the chance of waiting at least t = ${num(t)}${U} more, more than ${num(n)}${U} in total?`;
    else if (step === 1) cap = `The condition X > ${num(s)} is the tail beyond s = ${num(s)}: P(X > ${num(s)}) = e^(−s/β) = ${expo(s)}.`;
    else if (step === 2) cap = `More than s + t = ${num(n)}${U} in total is the darker part of that tail: P(X > ${num(n)}) = e^(−(s+t)/β) = ${expo(n)}.`;
    else if (step === 3) cap = `Condition on X > ${num(s)}: cut the curve at ${num(s)} and divide the tail that is left by its area ${f4(S(s))}, so its area is 1. The darker area becomes ${f4(S(n))}/${f4(S(s))} = ${ratio}.`;
    else {
      cap = `Slide the rescaled tail left by s = ${num(s)} to measure the time still to come: it lands exactly on the original density, so the darker area is P(X > ${num(t)}) = e^(−t/β) = ${expo(t)}. The elapsed ${num(s)}${U} cancels.`;
      if (pos >= 4) cap += gate.tally();
    }
    setText(caption, cap);
    if (recKey !== step) {
      recKey = step;
      const rec = [];
      if (step >= 1) rec.push(`P(X > s) = e^(−s/β) = ${expo(s)}`);
      if (step >= 2) rec.push(`P(X > s + t) = e^(−(s+t)/β) = ${expo(n)}`);
      if (step >= 3) rec.push(`P(X > s + t | X > s) = P(X > s + t)/P(X > s) = ${f4(S(n))}/${f4(S(s))} = ${ratio}`);
      if (step >= 4) rec.push(`P(X > t) = e^(−t/β) = ${expo(t)}: the same, the elapsed s has cancelled`);
      lines(steps, rec);
    }
    gate.render(pos);
  }
  function restart() {
    fit(); recKey = null;
    note.textContent = `Memoryless: P(X > s + t | X > s) = e^(−(s+t)/β)/e^(−s/β) = e^(−t/β) = P(X > t). Having waited s already, the chance of waiting at least t more is the chance a fresh wait exceeds t.${st.s >= 2.5 * st.beta || st.t >= 4 * st.beta ? " (s is kept to at most 2.5β and t to at most 4β so the tail stays visible.)" : ""}`;
    gate.restart(0);
    pb.reset(4);
  }
  fit();
  pb = createPlayback({ count: 4, unit: "step", stepMs: () => cfg.stepMs || 2200, onFrame: frame, limit: () => gate.limit(), onBlocked: () => gate.nudge() });
  box.append(pb.el, steps, note);
  gate.on = pc.input.checked;
  pc.input.addEventListener("change", () => { gate.on = pc.input.checked; pb.pause(); gate.restart(pb.pos()); pb.set(pb.pos()); });
  restart();
}

// =====================================================================
// widget: cdf-sweep-play — F(x) as the area accumulated so far: the bound moves right one step at a time
// =====================================================================
const CS_PRESETS = {
  "bus wait: uniform on [0, 20]": { dist: "uniform", a: 0, b: 20, step: 1, unit: "min", v: "T", ask: [3, 10, 15] },
  "web server: exponential, β = 2.5 s": { dist: "exponential", beta: 2.5, step: 1, max: 15, unit: "s", v: "X", ask: [1, 3, 7] },
};
function cdfSweepPlay(box, cfg) {
  const names = Object.keys(CS_PRESETS);
  const st = {};
  function load(src, over = {}) {
    const dist = over.dist === "exponential" || over.dist === "uniform" ? over.dist : src.dist;
    const base = dist === src.dist ? src : CS_PRESETS[names[dist === "exponential" ? 1 : 0]];
    const custom = ["a", "b", "beta", "step", "max"].some((k) => Number.isFinite(over[k]));
    Object.assign(st, {
      dist,
      a: Number.isFinite(over.a) ? over.a : base.a ?? 0,
      b: Number.isFinite(over.b) ? over.b : base.b ?? 20,
      beta: over.beta > 0 ? over.beta : base.beta ?? 2.5,
      step: over.step > 0 ? over.step : base.step ?? 1,
      max: over.max > 0 ? over.max : base.max ?? null,
      unit: typeof over.unit === "string" ? over.unit : base.unit ?? "",
      v: typeof over.var === "string" ? over.var : base.v ?? "X",
      ask: custom ? null : base.ask,
    });
    if (st.dist === "uniform" && !(st.b > st.a)) st.b = st.a + 20;
  }
  load(CS_PRESETS[cfg.preset] || CS_PRESETS[names[0]], CS_PRESETS[cfg.preset] ? {} : cfg);
  let pb = null, M = null;
  box.append(el("h4", null, cfg.title || "F(x) is the area so far: the bound moves right and F is drawn point by point"));
  const presetRow = cfg.presets !== false ? btnRow(names, (i) => { load(CS_PRESETS[names[i]]); restart(); }, names.findIndex((n) => CS_PRESETS[n] === CS_PRESETS[cfg.preset]) >= 0 ? names.indexOf(cfg.preset) : -1) : null;
  const pc = predictCheck("Predict F at the next stop before the bound moves", !!cfg.predict);
  const W = 640, H = 240, base = 190, top = 46, LX0 = 34, LX1 = 304, RX0 = 360, RX1 = 620;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg net-svg", role: "img", "aria-label": "a density with the area left of a moving bound shaded, beside its cumulative curve F(x) being drawn" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  if (presetRow) box.append(presetRow);
  box.append(pc.label, svg, caption, ask);

  function model() {
    const U = st.dist === "uniform";
    const x0 = U ? st.a : 0, x1 = U ? st.b : st.max || 6 * st.beta;
    const count = Math.max(2, Math.min(60, Math.round((x1 - x0) / st.step)));
    const step = (x1 - x0) / count;
    const f = U ? (x) => (x >= st.a && x <= st.b ? 1 / (st.b - st.a) : 0) : (x) => (x < 0 ? 0 : Math.exp(-x / st.beta) / st.beta);
    const F = U ? (x) => clamp((x - st.a) / (st.b - st.a), 0, 1) : (x) => (x <= 0 ? 0 : 1 - Math.exp(-x / st.beta));
    const pad = U ? 0.1 * (st.b - st.a) : 0;
    const d0 = x0 - pad, d1 = x1 + pad;
    const fmax = U ? 1 / (st.b - st.a) : 1 / st.beta;
    const ask = (st.ask || [Math.round(count * 0.15), Math.round(count * 0.5), Math.round(count * 0.75)]).filter((k, i, a) => k >= 0 && k < count && a.indexOf(k) === i);
    return { U, x0, x1, count, step, f, F, d0, d1, fmax, ask };
  }
  const xAt = (k) => M.x0 + k * M.step;
  const xs = (x) => num(x, 4);
  /** F(x) in the notes' form: (x − a)/(b − a) for the uniform, 1 − e^(−x/β) for the exponential. */
  function Fline(x) {
    if (M.U) return `(${xs(x)} − ${xs(st.a)})/(${xs(st.b)} − ${xs(st.a)}) = ${xs(x - st.a)}/${xs(st.b - st.a)} = ${f4(M.F(x))}`;
    return `1 − e^(−${xs(x)}/${xs(st.beta)}) = ${f4(M.F(x))}`;
  }
  function questions() {
    return M.ask.map((k) => {
      const xn = xAt(k + 1), xc = xAt(k);
      const cands = [
        { val: M.F(xn), ok: true },
        { val: M.f(xn), why: `That is the height f(${xs(xn)}), not the area to the left of ${xs(xn)}.` },
        { val: M.F(xc), why: `That is F(${xs(xc)}), the area so far. Moving the bound to ${xs(xn)} adds the strip between them.` },
        { val: 1 - M.F(xn), why: `That is the area to the right of ${xs(xn)}, 1 − F(${xs(xn)}).` },
      ];
      const opts = [];
      for (const c of cands) if (!opts.some((o) => o.label === f4(c.val))) opts.push({ label: f4(c.val), ok: !!c.ok, why: c.why, val: c.val });
      opts.sort((p, q) => p.val - q.val);
      return { at: k, options: opts };
    });
  }
  const gate = predictGates(ask, 60, questions, () => pb);

  function frame(pos) {
    pos = Math.max(0, pos); // a rAF timestamp older than the play press can step pos just below 0
    const { U, d0, d1, f, F, fmax, count } = M, u = st.unit ? " " + st.unit : "";
    const xc = M.x0 + clamp(pos, 0, count) * M.step, k = Math.floor(pos + 1e-9), q = gate.asking(pos);
    const XL = (x) => LX0 + ((x - d0) / (d1 - d0)) * (LX1 - LX0), XR = (x) => RX0 + ((x - d0) / (d1 - d0)) * (RX1 - RX0);
    const YL = (v) => base - (v / (fmax * 1.25)) * (base - top), YR = (v) => base - v * (base - top);
    svg.innerHTML = "";
    const g = svgEl("g"); svg.append(g);
    // left: the density, the area to the left of the bound shaded
    const leftEnd = U ? st.a : 0;
    if (xc > leftEnd) g.append(svgEl("path", { d: areaPath(f, leftEnd, xc, XL, YL, base, U ? 2 : 120), fill: "var(--hl-soft)", stroke: "var(--hl)", "stroke-width": 1 }));
    const dens = U
      ? `M${XL(d0).toFixed(1)},${base}L${XL(st.a).toFixed(1)},${base}L${XL(st.a).toFixed(1)},${YL(fmax).toFixed(1)}L${XL(st.b).toFixed(1)},${YL(fmax).toFixed(1)}L${XL(st.b).toFixed(1)},${base}L${XL(d1).toFixed(1)},${base}`
      : `M${XL(0).toFixed(1)},${base}L${XL(0).toFixed(1)},${YL(fmax).toFixed(1)}` + curvePath(f, 0, d1, XL, YL).replace(/^M/, "L");
    g.append(svgEl("path", { d: dens, fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    const ticks = niceTicks(d0, d1, 6);
    axis(g, XL, base, d0, d1, ticks, (v) => num(v, 2), "");
    axis(g, XR, base, d0, d1, ticks, (v) => num(v, 2), "");
    text(g, LX0, 14, `f(${st.v.toLowerCase()}) = ${U ? `1/${xs(st.b - st.a)} = ${num(fmax, 4)}` : `(1/${xs(st.beta)})e^(−${st.v.toLowerCase()}/${xs(st.beta)})`}`, { "text-anchor": "start", fill: "var(--blue)" });
    text(g, LX1, base + 32, `${st.v.toLowerCase()}${u ? ` (${st.unit})` : ""}`, { "text-anchor": "end", fill: "var(--ink-dim)" });
    // the moving bound
    g.append(svgEl("line", { x1: XL(xc), x2: XL(xc), y1: top - 6, y2: base, stroke: "var(--hl)", "stroke-width": 1.6 }));
    text(g, clamp(XL(xc), LX0 + 30, LX1 - 30), top - 10, `x = ${num(xc, 2)}`, { fill: "var(--hl)", "font-weight": 600 });
    // right: F(x), drawn only as far as the bound has gone
    g.append(svgEl("line", { x1: RX0, x2: RX0, y1: top, y2: base, stroke: "var(--rule-strong)" }));
    for (const v of [0.25, 0.5, 0.75, 1]) {
      g.append(svgEl("line", { x1: RX0, x2: RX1, y1: YR(v), y2: YR(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      text(g, RX0 - 4, YR(v) + 4, String(v), { "text-anchor": "end", fill: "var(--ink-dim)", "font-size": 10 });
    }
    text(g, RX0 + 4, 14, "F(x) = P(X ≤ x), the area so far", { "text-anchor": "start", fill: "var(--ink-2)" });
    g.append(svgEl("path", { d: curvePath(F, d0, xc, XR, YR, 160), fill: "none", stroke: "var(--hl)", "stroke-width": 2.2 }));
    for (let i = 0; i <= Math.min(k, count); i++) g.append(svgEl("circle", { cx: XR(xAt(i)), cy: YR(F(xAt(i))), r: i === k ? 4 : 2.6, fill: i === k ? "var(--hl)" : "var(--ink-2)" }));
    const Fc = F(xc);
    text(g, clamp(XR(xc) + 6, RX0 + 40, RX1 - 70), clamp(YR(Fc) - 8, top + 4, base - 6), `F(${num(xc, 2)}) = ${f4(Fc)}`, { "text-anchor": "start", fill: "var(--hl)", "font-weight": 600 });
    // caption
    const x = xAt(Math.min(k, count));
    let cap;
    if (q) cap = `The bound is at x = ${xs(x)} and F(${xs(x)}) = ${f4(F(x))}. What is F(${xs(xAt(q.at + 1))}) at the next stop?`;
    else if (pos <= 0) cap = `F(x) is the area under f to the left of x. At x = ${xs(M.x0)} no area has accumulated yet: F(${xs(M.x0)}) = 0.`;
    else if (pos < count) {
      const xd = xAt(k);
      cap = `x = ${xs(xd)}: the area so far is ${U ? `${xs(xd - st.a)}/${xs(st.b - st.a)}` : `1 − e^(−${xs(xd)}/${xs(st.beta)})`} = ${f4(F(xd))}, so F(${xs(xd)}) = ${f4(F(xd))}.`;
      if (!U && k > 0) cap += ` The last ${xs(M.step)}${u} added ${f4(F(xd) - F(xd - M.step))}.`;
    } else {
      cap = U
        ? `x = ${xs(st.b)}: the whole rectangle is to the left, so F(${xs(st.b)}) = 1. The density is flat, so every ${xs(M.step)}${u} added the same ${num(M.step / (st.b - st.a), 4)}: F is a straight line from ${xs(st.a)} to ${xs(st.b)}.`
        : `x = ${xs(M.x1)}: F(${xs(M.x1)}) = ${f4(F(M.x1))}, close to 1. F rose fast where the density is tall, ${f4(F(M.step))} in the first ${xs(M.step)}${u}, and flattens where it thins out: the last ${xs(M.step)}${u} added ${f4(F(M.x1) - F(M.x1 - M.step))}.`;
      cap += gate.tally();
    }
    setText(caption, cap);
    gate.render(pos);
  }
  function restart() {
    M = model();
    note.textContent = M.U
      ? `Uniform on [${xs(st.a)}, ${xs(st.b)}]: F(x) = (x − a)/(b − a) for a ≤ x ≤ b, 0 below a and 1 above b; in R, punif(x, ${xs(st.a)}, ${xs(st.b)}). An interval is a difference of two F values: P(c ≤ X ≤ d) = F(d) − F(c).`
      : `Exponential with β = ${xs(st.beta)}: F(x) = 1 − e^(−x/β) for x ≥ 0; in R, pexp(x, rate = 1/${xs(st.beta)}). An interval is a difference of two F values: P(c ≤ X ≤ d) = F(d) − F(c).`;
    if (presetRow) setActive(presetRow, names.findIndex((n) => { const p = CS_PRESETS[n]; return p.dist === st.dist && (p.dist === "uniform" ? p.a === st.a && p.b === st.b : p.beta === st.beta); }));
    gate.restart(0);
    pb.reset(M.count);
  }
  M = model();
  pb = createPlayback({ count: M.count, unit: "stop", stepMs: () => cfg.stepMs || 900, onFrame: frame, limit: () => gate.limit(), onBlocked: () => gate.nudge() });
  box.append(pb.el, note);
  gate.on = pc.input.checked;
  pc.input.addEventListener("change", () => { gate.on = pc.input.checked; pb.pause(); gate.restart(pb.pos()); pb.set(pb.pos()); });
  restart();
}

export const WIDGETS = {
  "pdf-area": pdfArea,
  "z-table": zTable,
  "normal-prob": normalProb,
  "exp-wait": expWait,
  "bit-error": bitError,
  "standardize-play": standardizePlay,
  "memoryless-play": memorylessPlay,
  "cdf-sweep-play": cdfSweepPlay,
};
