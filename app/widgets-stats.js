// Interactive statistics widgets (Descriptive stats, normal curve, Chebyshev,
// quartiles/boxplot/outliers, correlation, grouped mean, skewness).
import { el, html, esc, slider, btnRow, fmtNum } from "./dom.js";

// ---------- pure stats helpers (exported for reuse/tests) ----------
export const sum = (a) => a.reduce((s, v) => s + v, 0);
export const mean = (a) => sum(a) / a.length;
export function median(a) {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  if (!n) return NaN;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
export function modes(a) {
  const counts = new Map();
  for (const v of a) counts.set(v, (counts.get(v) || 0) + 1);
  let best = 0;
  for (const c of counts.values()) best = Math.max(best, c);
  if (best === 1) return { values: [], count: 1 };
  return { values: [...counts.entries()].filter(([, c]) => c === best).map(([v]) => v).sort((x, y) => x - y), count: best };
}
export const range = (a) => Math.max(...a) - Math.min(...a);
export function sampleSd(a) {
  const m = mean(a);
  return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / (a.length - 1));
}
export function popSd(a) {
  const m = mean(a);
  return Math.sqrt(sum(a.map((v) => (v - m) ** 2)) / a.length);
}
/** R's default quantile (type 7). p in [0,1]. */
export function quantileR(a, p) {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  const h = (n - 1) * p;
  const lo = Math.floor(h);
  const hi = Math.min(lo + 1, n - 1);
  return s[lo] + (h - lo) * (s[hi] - s[lo]);
}
/** Hand method used in lecture: Q1/Q3 = medians of lower/upper halves (median excluded when n odd). */
export function quartilesHand(a) {
  const s = [...a].sort((x, y) => x - y);
  const n = s.length;
  const half = Math.floor(n / 2);
  const lower = s.slice(0, half);
  const upper = s.slice(n % 2 ? half + 1 : half);
  return { q1: median(lower), q2: median(s), q3: median(upper) };
}
export function pearsonR(xs, ys) {
  const n = xs.length;
  const sx = sum(xs), sy = sum(ys);
  const sxy = sum(xs.map((x, i) => x * ys[i]));
  const sxx = sum(xs.map((x) => x * x)), syy = sum(ys.map((y) => y * y));
  return (n * sxy - sx * sy) / (Math.sqrt(n * sxx - sx * sx) * Math.sqrt(n * syy - sy * sy));
}
// standard normal CDF (Abramowitz-Stegun 7.1.26 via erf)
export function normCdf(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 + y / 2 : 0.5 - y / 2;
}
const normPdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

function parseNums(text) {
  return text.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean).map(Number).filter((v) => Number.isFinite(v));
}

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}

// ---------- boxplot drawing ----------
function drawBoxplot(svg, data, { width = 640, height = 120, showFences = true } = {}) {
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const s = [...data].sort((a, b) => a - b);
  const q1 = quantileR(s, 0.25), q2 = quantileR(s, 0.5), q3 = quantileR(s, 0.75);
  const iqr = q3 - q1;
  const lf = q1 - 1.5 * iqr, uf = q3 + 1.5 * iqr;
  const inside = s.filter((v) => v >= lf && v <= uf);
  const outliers = s.filter((v) => v < lf || v > uf);
  const wmin = inside.length ? inside[0] : s[0];
  const wmax = inside.length ? inside[inside.length - 1] : s[s.length - 1];
  const lo = Math.min(s[0], showFences ? lf : s[0]);
  const hi = Math.max(s[s.length - 1], showFences ? uf : s[s.length - 1]);
  const pad = 40;
  const span = hi - lo || 1;
  const x = (v) => pad + ((v - lo) / span) * (width - 2 * pad);
  const cy = 50, bh = 36;
  const g = svgEl("g");
  // axis
  g.append(svgEl("line", { x1: pad, x2: width - pad, y1: 100, y2: 100, stroke: "#3a4a5a" }));
  const ticks = 6;
  for (let i = 0; i <= ticks; i++) {
    const v = lo + (span * i) / ticks;
    g.append(svgEl("line", { x1: x(v), x2: x(v), y1: 100, y2: 105, stroke: "#3a4a5a" }));
    g.append(svgEl("text", { x: x(v), y: 116, "text-anchor": "middle", fill: "#8a9bab", "font-size": 10 }, fmtNum(v, 2)));
  }
  // fences
  if (showFences) {
    for (const [v, label] of [[lf, "lower fence"], [uf, "upper fence"]]) {
      g.append(svgEl("line", { x1: x(v), x2: x(v), y1: 18, y2: 95, stroke: "#ff6b6b", "stroke-dasharray": "4 3" }));
      g.append(svgEl("text", { x: x(v), y: 12, "text-anchor": "middle", fill: "#ff6b6b", "font-size": 10 }, label));
    }
  }
  // whiskers
  g.append(svgEl("line", { x1: x(wmin), x2: x(q1), y1: cy, y2: cy, stroke: "#d8e2ec", "stroke-width": 1.5 }));
  g.append(svgEl("line", { x1: x(q3), x2: x(wmax), y1: cy, y2: cy, stroke: "#d8e2ec", "stroke-width": 1.5 }));
  g.append(svgEl("line", { x1: x(wmin), x2: x(wmin), y1: cy - 10, y2: cy + 10, stroke: "#d8e2ec", "stroke-width": 1.5 }));
  g.append(svgEl("line", { x1: x(wmax), x2: x(wmax), y1: cy - 10, y2: cy + 10, stroke: "#d8e2ec", "stroke-width": 1.5 }));
  // box
  g.append(svgEl("rect", { x: x(q1), y: cy - bh / 2, width: Math.max(1, x(q3) - x(q1)), height: bh, fill: "#1f7a4d55", stroke: "#3ee08a", "stroke-width": 1.5 }));
  g.append(svgEl("line", { x1: x(q2), x2: x(q2), y1: cy - bh / 2, y2: cy + bh / 2, stroke: "#3ee08a", "stroke-width": 3 }));
  for (const [v, label] of [[wmin, "min"], [q1, "Q1"], [q2, "Q2"], [q3, "Q3"], [wmax, "max"]]) {
    g.append(svgEl("text", { x: x(v), y: cy + bh / 2 + 14, "text-anchor": "middle", fill: "#3ee08a", "font-size": 10 }, label));
  }
  for (const o of outliers) {
    g.append(svgEl("circle", { cx: x(o), cy, r: 4, fill: "none", stroke: "#ff6b6b", "stroke-width": 1.5 }));
  }
  svg.append(g);
  return { q1, q2, q3, iqr, lf, uf, outliers, wmin, wmax };
}

// ---------- widget: stat-calc ----------
function statCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Descriptive statistics calculator"));
  const intro = el("p", "widget-note", "Paste any data set (spaces or commas). Everything below recomputes live — use it to check pencil-problem answers.");
  const ta = document.createElement("textarea");
  ta.className = "data-input";
  ta.rows = 2;
  ta.value = cfg.data || "22 19 20 22 35 19 21 23";
  const presets = cfg.presets || {
    "Ages (n=8)": "22 19 20 22 35 19 21 23",
    "s example": "5.0 4.5 6.0 7.0 5.2",
    "Plywood (n=18)": "0.754 0.735 0.754 0.748 0.740 0.752 0.747 0.740 0.751 0.741 0.740 0.742 0.748 0.732 0.750 0.747 0.750 0.752",
    "Gold price": "6195.20 6377.58 6374.78 6448.51 6439.12 6343.34 6231.64 6244.87 6023.88 6127.91",
    "Site B (outlier)": "1.02 3.56 3.5 3.45 4.5 13.6 4.5 2.3 3.5 2.6 3.31 3.1",
  };
  const presetRow = btnRow(Object.keys(presets), (i, l) => { ta.value = presets[l]; update(); }, -1);
  const grid = el("div", "stat-grid");
  const sorted = el("div", "sorted-line");
  const svg = svgEl("svg", { class: "boxplot-svg" });
  const steps = el("div", "stat-steps");
  box.append(intro, presetRow, ta, sorted, grid, svg, steps);

  function cell(label, value, note) {
    const c = el("div", "stat-cell");
    c.append(el("div", "stat-label", label), el("div", "stat-value", value));
    if (note) c.append(el("div", "stat-note", note));
    return c;
  }

  function update() {
    const d = parseNums(ta.value);
    grid.innerHTML = ""; steps.innerHTML = ""; sorted.innerHTML = "";
    if (d.length < 2) { grid.append(el("div", "stat-note", "Enter at least 2 numbers.")); svg.innerHTML = ""; return; }
    const n = d.length, m = mean(d), md = median(d), mo = modes(d), r = range(d), s = sampleSd(d), sig = popSd(d);
    const hand = quartilesHand(d);
    const q1 = quantileR(d, 0.25), q3 = quantileR(d, 0.75);
    const iqr = q3 - q1;
    const sk = 3 * (m - md) / s;
    const cv = (s / m) * 100;
    const srt = [...d].sort((a, b) => a - b);
    // sorted line with median highlighted
    sorted.append(el("span", "stat-label", "sorted: "));
    srt.forEach((v, i) => {
      const isMid = n % 2 ? i === (n - 1) / 2 : (i === n / 2 - 1 || i === n / 2);
      sorted.append(el("span", "sorted-val" + (isMid ? " mid" : ""), String(v)));
    });
    grid.append(
      cell("n", n),
      cell("mean x̄", fmtNum(m), `Σx = ${fmtNum(sum(d))}`),
      cell("median Q2", fmtNum(md), n % 2 ? `middle (${(n + 1) / 2}th) value` : `avg of ${n / 2}th & ${n / 2 + 1}th`),
      cell("mode", mo.values.length ? mo.values.join(", ") : "none", mo.values.length ? `appears ${mo.count}×` : "all values unique"),
      cell("range R", fmtNum(r), `${Math.max(...d)} − ${Math.min(...d)}`),
      cell("sample sd s", fmtNum(s), "divide by n − 1"),
      cell("pop. sd σ", fmtNum(sig), "divide by N"),
      cell("CV", fmtNum(cv, 2) + " %", "s / x̄ × 100%"),
      cell("Q1 (R)", fmtNum(q1), `hand method: ${fmtNum(hand.q1)}`),
      cell("Q3 (R)", fmtNum(q3), `hand method: ${fmtNum(hand.q3)}`),
      cell("IQR", fmtNum(iqr), "Q3 − Q1"),
      cell("fences", `${fmtNum(q1 - 1.5 * iqr)} / ${fmtNum(q3 + 1.5 * iqr)}`, "Q1 − 1.5·IQR, Q3 + 1.5·IQR"),
      cell("Pearson Sk", fmtNum(sk, 3), sk > 1 ? "highly skewed right" : sk < -1 ? "highly skewed left" : sk > 0 ? "skewed right (mean > median)" : sk < 0 ? "skewed left (mean < median)" : "symmetric"),
      cell("x̄ ± 2s", `${fmtNum(m - 2 * s)} to ${fmtNum(m + 2 * s)}`, "usual range (if normal)"),
    );
    const info = drawBoxplot(svg, d);
    // worked steps for s
    const devs = d.map((v) => `(${v} − ${fmtNum(m, 3)})²`).slice(0, 6).join(" + ") + (d.length > 6 ? " + …" : "");
    steps.innerHTML = `<div class="stat-label">Worked: sample standard deviation</div>
      <div class="math-line">s = √[ Σ(x − x̄)² / (n − 1) ] = √[ (${devs}) / ${n - 1} ] = √[ ${fmtNum(sum(d.map((v) => (v - m) ** 2)), 4)} / ${n - 1} ] = <b>${fmtNum(s)}</b></div>
      <div class="stat-note">Outliers (beyond fences): ${info.outliers.length ? info.outliers.join(", ") : "none"}</div>`;
  }
  ta.addEventListener("input", update);
  update();
}

// ---------- widget: normal-curve ----------
function normalCurve(box, cfg) {
  box.append(el("h4", null, cfg.title || "Normal curve, Z-scores and the empirical rule"));
  const state = { mu: cfg.mu ?? 100, sigma: cfg.sigma ?? 15, x: cfg.x ?? 130 };
  const presets = cfg.presets || {
    "IQ (μ=100, σ=15)": [100, 15, 130],
    "Women height (164.7, 7.1)": [164.7, 7.1, 175],
    "Men height (178.4, 7.6)": [178.4, 7.6, 203],
    "Body temp (98.2, 0.62)": [98.2, 0.62, 101],
    "Moisture (18, 0.5)": [18, 0.5, 19],
  };
  const svg = svgEl("svg", { class: "curve-svg", viewBox: "0 0 640 220" });
  const readout = el("div", "stat-grid");
  const ctl = el("div");
  const muIn = numRow("μ", state.mu, (v) => { state.mu = v; xS.input.min = v - 4 * state.sigma; xS.input.max = v + 4 * state.sigma; draw(); });
  const sigIn = numRow("σ", state.sigma, (v) => { state.sigma = v; xS.input.min = state.mu - 4 * v; xS.input.max = state.mu + 4 * v; xS.input.step = v / 20; draw(); });
  const xS = slider("X", state.mu - 4 * state.sigma, state.mu + 4 * state.sigma, state.sigma / 20, state.x, (v) => { state.x = v; draw(); }, (v) => fmtNum(v, 2));
  const modeRow = btnRow(["Shade below X", "Shade ±1σ", "Shade ±2σ", "Shade ±3σ"], (i) => { state.mode = i; draw(); }, 0);
  state.mode = 0;
  ctl.append(btnRow(Object.keys(presets), (i, l) => {
    const [mu, sg, x] = presets[l];
    state.mu = mu; state.sigma = sg; state.x = x;
    muIn.input.value = mu; sigIn.input.value = sg;
    xS.input.min = mu - 4 * sg; xS.input.max = mu + 4 * sg; xS.input.step = sg / 20; xS.set(x);
    draw();
  }, -1), muIn.row, sigIn.row, xS.row, modeRow);
  box.append(ctl, svg, readout);

  function numRow(label, v, on) {
    const row = el("div", "slider-row");
    const input = document.createElement("input");
    input.type = "number"; input.value = v; input.step = "any"; input.className = "q-input small";
    input.addEventListener("input", () => { const n = parseFloat(input.value); if (Number.isFinite(n) && n !== 0) on(n); });
    row.append(el("label", null, label), input);
    return { row, input };
  }

  function draw() {
    const { mu, sigma, x } = state;
    svg.innerHTML = "";
    const W = 640, H = 220, pad = 30, base = 180;
    const lo = mu - 4 * sigma, hi = mu + 4 * sigma;
    const X = (v) => pad + ((v - lo) / (hi - lo)) * (W - 2 * pad);
    const Y = (z) => base - normPdf(z) * 340;
    let path = "";
    for (let i = 0; i <= 200; i++) {
      const v = lo + ((hi - lo) * i) / 200;
      path += (i ? "L" : "M") + X(v).toFixed(1) + "," + Y((v - mu) / sigma).toFixed(1);
    }
    // shaded region
    let a, b;
    if (state.mode === 0) { a = lo; b = x; } else { a = mu - state.mode * sigma; b = mu + state.mode * sigma; }
    let sp = `M${X(a)},${base}`;
    for (let i = 0; i <= 100; i++) {
      const v = a + ((b - a) * i) / 100;
      sp += `L${X(v).toFixed(1)},${Y((v - mu) / sigma).toFixed(1)}`;
    }
    sp += `L${X(b)},${base}Z`;
    svg.append(svgEl("path", { d: sp, fill: "#3ee08a33" }));
    svg.append(svgEl("path", { d: path, fill: "none", stroke: "#58b4ff", "stroke-width": 2 }));
    svg.append(svgEl("line", { x1: pad, x2: W - pad, y1: base, y2: base, stroke: "#3a4a5a" }));
    for (let k = -3; k <= 3; k++) {
      const v = mu + k * sigma;
      svg.append(svgEl("line", { x1: X(v), x2: X(v), y1: base, y2: base + 5, stroke: "#8a9bab" }));
      svg.append(svgEl("text", { x: X(v), y: base + 17, "text-anchor": "middle", fill: "#d8e2ec", "font-size": 11 }, fmtNum(v, 2)));
      svg.append(svgEl("text", { x: X(v), y: base + 30, "text-anchor": "middle", fill: "#8a9bab", "font-size": 10 }, k === 0 ? "μ" : `${k > 0 ? "+" : ""}${k}σ`));
      if (k !== 0) svg.append(svgEl("line", { x1: X(v), x2: X(v), y1: Y(k), y2: base, stroke: "#3a4a5a", "stroke-dasharray": "2 3" }));
    }
    // X marker
    const z = (x - mu) / sigma;
    svg.append(svgEl("line", { x1: X(x), x2: X(x), y1: 20, y2: base, stroke: "#ffd166", "stroke-width": 2 }));
    svg.append(svgEl("text", { x: X(x), y: 14, "text-anchor": "middle", fill: "#ffd166", "font-size": 11 }, `X = ${fmtNum(x, 2)}  →  Z = ${fmtNum(z, 2)}`));
    // band labels
    const bands = [[1, "68%"], [2, "95%"], [3, "99.7%"]];
    bands.forEach(([k, label], i) => {
      const y = 40 + i * 14;
      svg.append(svgEl("line", { x1: X(mu - k * sigma), x2: X(mu + k * sigma), y1: y, y2: y, stroke: "#8a9bab", "stroke-width": 1 }));
      svg.append(svgEl("text", { x: X(mu), y: y - 3, "text-anchor": "middle", fill: "#8a9bab", "font-size": 10 }, label));
    });
    readout.innerHTML = "";
    const below = normCdf(z);
    const unusual = Math.abs(z) > 2;
    const cells = [
      ["Z-score", fmtNum(z, 3), `(X − μ)/σ = (${fmtNum(x, 2)} − ${mu})/${sigma}`],
      ["% below X (exact)", fmtNum(below * 100, 2) + " %", "table / pnorm"],
      ["% above X", fmtNum((1 - below) * 100, 2) + " %", ""],
      ["Empirical-rule estimate", empiricalEstimate(z), "using 68-95-99.7 only"],
      ["Unusual?", unusual ? "YES (|Z| > 2)" : "no (|Z| ≤ 2)", `usual range: ${fmtNum(mu - 2 * sigma, 2)} to ${fmtNum(mu + 2 * sigma, 2)}`],
      ["X from Z", `X = μ + Z·σ`, `${mu} + (${fmtNum(z, 2)})(${sigma}) = ${fmtNum(x, 2)}`],
    ];
    for (const [l, v, n] of cells) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", v));
      if (n) c.append(el("div", "stat-note", n));
      readout.append(c);
    }
  }
  function empiricalEstimate(z) {
    const table = { "-3": 0.15, "-2": 2.5, "-1": 16, "0": 50, "1": 84, "2": 97.5, "3": 99.85 };
    const k = Math.round(z);
    if (Math.abs(z - k) < 0.05 && table[String(k)] != null) return `${table[String(k)]}% below`;
    return "Z not a whole number of σ → use exact";
  }
  draw();
}

// ---------- widget: chebyshev ----------
function chebyshev(box, cfg) {
  box.append(el("h4", null, cfg.title || "Chebyshev versus the empirical rule"));
  const out = el("div", "stat-grid");
  const bar = svgEl("svg", { viewBox: "0 0 640 70", class: "curve-svg" });
  const s = slider("k (number of σ from mean)", 1, 4, 0.1, 2, draw, (v) => fmtNum(v, 1));
  box.append(el("p", "widget-note", "Chebyshev: for ANY distribution, at least 1 − 1/k² of values lie within k standard deviations of the mean. The empirical rule needs a normal (bell-shaped) distribution but gives a stronger, exact-ish answer."), s.row, bar, out);
  function draw(k) {
    const cheb = k <= 1 ? 0 : 1 - 1 / (k * k);
    const emp = 2 * normCdf(k) - 1;
    out.innerHTML = "";
    for (const [l, v, n] of [
      ["Chebyshev (any shape)", `≥ ${fmtNum(cheb * 100, 2)} %`, `1 − 1/${fmtNum(k, 1)}² = 1 − ${fmtNum(1 / (k * k), 4)}`],
      ["Normal (empirical/exact)", `${fmtNum(emp * 100, 2)} %`, k === 1 ? "≈ 68%" : k === 2 ? "≈ 95%" : k === 3 ? "≈ 99.7%" : ""],
      ["Outside ±kσ (normal)", `${fmtNum((1 - emp) * 100, 2)} %`, `each tail ${fmtNum((1 - emp) * 50, 2)} %`],
    ]) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", v), el("div", "stat-note", n));
      out.append(c);
    }
    bar.innerHTML = "";
    const W = 580;
    bar.append(svgEl("rect", { x: 30, y: 10, width: W, height: 18, fill: "#1c2733" }));
    bar.append(svgEl("rect", { x: 30, y: 10, width: W * cheb, height: 18, fill: "#ffd166" }));
    bar.append(svgEl("text", { x: 30, y: 44, fill: "#ffd166", "font-size": 11 }, `Chebyshev ≥ ${fmtNum(cheb * 100, 1)}%`));
    bar.append(svgEl("rect", { x: 30, y: 48, width: W, height: 18, fill: "#1c2733" }));
    bar.append(svgEl("rect", { x: 30, y: 48, width: W * emp, height: 18, fill: "#3ee08a" }));
    bar.append(svgEl("text", { x: 30 + W * emp + 6, y: 61, fill: "#3ee08a", "font-size": 11 }, `normal ${fmtNum(emp * 100, 1)}%`));
  }
  draw(2);
}

// ---------- widget: boxplot ----------
function boxplotWidget(box, cfg) {
  box.append(el("h4", null, cfg.title || "Quartiles, IQR, fences and outliers"));
  const ta = document.createElement("textarea");
  ta.className = "data-input"; ta.rows = 2;
  ta.value = cfg.data || "1.02 3.56 3.5 3.45 4.5 13.6 4.5 2.3 3.5 2.6 3.31 3.1";
  const svg = svgEl("svg", { class: "boxplot-svg" });
  const out = el("div", "stat-grid");
  const sortedLine = el("div", "sorted-line");
  box.append(el("p", "widget-note", cfg.note || "Sort → split into halves → Q1 and Q3 are the medians of the halves. Fences are 1.5·IQR beyond the box; anything past a fence is an outlier (drawn as a circle) and the whisker stops at the last non-outlier."), ta, sortedLine, svg, out);
  function update() {
    const d = parseNums(ta.value);
    if (d.length < 4) return;
    const info = drawBoxplot(svg, d);
    const hand = quartilesHand(d);
    const srt = [...d].sort((a, b) => a - b);
    sortedLine.innerHTML = "";
    sortedLine.append(el("span", "stat-label", "sorted: "));
    srt.forEach((v) => sortedLine.append(el("span", "sorted-val" + (v < info.lf || v > info.uf ? " out" : ""), String(v))));
    out.innerHTML = "";
    for (const [l, v, n] of [
      ["Q1", fmtNum(info.q1), `hand: ${fmtNum(hand.q1)}`],
      ["Q2 (median)", fmtNum(info.q2), ""],
      ["Q3", fmtNum(info.q3), `hand: ${fmtNum(hand.q3)}`],
      ["IQR", fmtNum(info.iqr), "Q3 − Q1"],
      ["Lower fence", fmtNum(info.lf), `Q1 − 1.5 × ${fmtNum(info.iqr)}`],
      ["Upper fence", fmtNum(info.uf), `Q3 + 1.5 × ${fmtNum(info.iqr)}`],
      ["Outliers", info.outliers.length ? info.outliers.join(", ") : "none", ""],
      ["Five-number summary", `${srt[0]}, ${fmtNum(info.q1)}, ${fmtNum(info.q2)}, ${fmtNum(info.q3)}, ${srt[srt.length - 1]}`, "min, Q1, Q2, Q3, max"],
    ]) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", v));
      if (n) c.append(el("div", "stat-note", n));
      out.append(c);
    }
  }
  ta.addEventListener("input", update);
  update();
}

// ---------- widget: scatter-corr ----------
function scatterCorr(box, cfg) {
  box.append(el("h4", null, cfg.title || "Linear correlation r: drag the points"));
  const presets = {
    "Circuit (lecture)": { x: [43, 29, 44, 33, 33, 47, 34, 31, 48, 34, 46, 37], y: [32, 20, 45, 35, 22, 46, 28, 26, 37, 33, 47, 30] },
    "Perfect +1": { x: [1, 2, 3, 4, 5, 6, 7, 8], y: [2, 4, 6, 8, 10, 12, 14, 16] },
    "Perfect −1": { x: [1, 2, 3, 4, 5, 6, 7, 8], y: [16, 14, 12, 10, 8, 6, 4, 2] },
    "No linear (r≈0)": { x: [1, 2, 3, 4, 5, 6, 7, 8, 9], y: [5, 1, 8, 2, 7, 3, 9, 1, 6] },
    "Curved (r≈0 but related!)": { x: [-4, -3, -2, -1, 0, 1, 2, 3, 4], y: [16, 9, 4, 1, 0, 1, 4, 9, 16] },
  };
  let pts = presets["Circuit (lecture)"].x.map((x, i) => ({ x, y: presets["Circuit (lecture)"].y[i] }));
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg" });
  const out = el("div", "stat-grid");
  const table = el("div", "stat-steps");
  box.append(btnRow(Object.keys(presets), (i, l) => { pts = presets[l].x.map((x, j) => ({ x, y: presets[l].y[j] })); draw(); }, 0), svg, out, table);
  const W = 640, H = 300, pad = 40;
  let bounds;
  function computeBounds() {
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
    const mx = (xmax - xmin) * 0.2 || 1, my = (ymax - ymin) * 0.2 || 1;
    bounds = { xmin: xmin - mx, xmax: xmax + mx, ymin: ymin - my, ymax: ymax + my };
  }
  const X = (v) => pad + ((v - bounds.xmin) / (bounds.xmax - bounds.xmin)) * (W - 2 * pad);
  const Y = (v) => H - pad - ((v - bounds.ymin) / (bounds.ymax - bounds.ymin)) * (H - 2 * pad);
  const invX = (px) => bounds.xmin + ((px - pad) / (W - 2 * pad)) * (bounds.xmax - bounds.xmin);
  const invY = (py) => bounds.ymin + ((H - pad - py) / (H - 2 * pad)) * (bounds.ymax - bounds.ymin);
  function draw(keepBounds = false) {
    if (!keepBounds) computeBounds();
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: pad, x2: W - pad, y1: H - pad, y2: H - pad, stroke: "#3a4a5a" }));
    svg.append(svgEl("line", { x1: pad, x2: pad, y1: pad, y2: H - pad, stroke: "#3a4a5a" }));
    svg.append(svgEl("text", { x: W / 2, y: H - 8, fill: "#8a9bab", "font-size": 11, "text-anchor": "middle" }, "X"));
    svg.append(svgEl("text", { x: 12, y: H / 2, fill: "#8a9bab", "font-size": 11, "text-anchor": "middle" }, "Y"));
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    const r = pearsonR(xs, ys);
    // least squares line for visual guidance
    const mx = mean(xs), my = mean(ys);
    const slope = sum(xs.map((x, i) => (x - mx) * (ys[i] - my))) / sum(xs.map((x) => (x - mx) ** 2));
    if (Number.isFinite(slope)) {
      const y1 = my + slope * (bounds.xmin - mx), y2 = my + slope * (bounds.xmax - mx);
      svg.append(svgEl("line", { x1: X(bounds.xmin), y1: Y(y1), x2: X(bounds.xmax), y2: Y(y2), stroke: "#ffd16688", "stroke-dasharray": "5 4" }));
    }
    pts.forEach((p, i) => {
      const c = svgEl("circle", { cx: X(p.x), cy: Y(p.y), r: 7, fill: "#58b4ff", stroke: "#0d1117", "stroke-width": 1.5, style: "cursor:grab" });
      c.addEventListener("pointerdown", (e) => {
        c.setPointerCapture(e.pointerId);
        const move = (ev) => {
          const rect = svg.getBoundingClientRect();
          const px = ((ev.clientX - rect.left) / rect.width) * W;
          const py = ((ev.clientY - rect.top) / rect.height) * H;
          p.x = Math.round(invX(px) * 10) / 10; p.y = Math.round(invY(py) * 10) / 10;
          draw(true);
        };
        const up = () => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); };
        c.addEventListener("pointermove", move);
        c.addEventListener("pointerup", up);
      });
      svg.append(c);
    });
    out.innerHTML = "";
    const n = xs.length, sx = sum(xs), sy = sum(ys), sxy = sum(xs.map((x, i) => x * ys[i])), sxx = sum(xs.map((x) => x * x)), syy = sum(ys.map((y) => y * y));
    const desc = r > 0.99 ? "perfect positive" : r > 0.7 ? "strong positive" : r > 0.3 ? "moderate positive" : r > -0.3 ? "no linear correlation" : r > -0.7 ? "moderate negative" : r > -0.99 ? "strong negative" : "perfect negative";
    for (const [l, v, nn] of [["r", fmtNum(r, 4), desc], ["n", n, ""], ["Σx, Σy", `${fmtNum(sx, 2)}, ${fmtNum(sy, 2)}`, ""], ["Σxy", fmtNum(sxy, 2), ""], ["Σx², Σy²", `${fmtNum(sxx, 2)}, ${fmtNum(syy, 2)}`, ""]]) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", String(v)));
      if (nn) c.append(el("div", "stat-note", nn));
      out.append(c);
    }
    table.innerHTML = `<div class="stat-label">Formula</div><div class="math-line">r = [n·Σxy − Σx·Σy] / [ √(n·Σx² − (Σx)²) · √(n·Σy² − (Σy)²) ] = [${n}·${fmtNum(sxy, 2)} − ${fmtNum(sx, 2)}·${fmtNum(sy, 2)}] / [ √(${n}·${fmtNum(sxx, 2)} − ${fmtNum(sx, 2)}²) · √(${n}·${fmtNum(syy, 2)} − ${fmtNum(sy, 2)}²) ] = <b>${fmtNum(r, 4)}</b></div>`;
  }
  draw();
}

// ---------- widget: grouped-mean ----------
function groupedMean(box, cfg) {
  box.append(el("h4", null, cfg.title || "Mean & sd of grouped data (class marks × frequencies)"));
  const rows = cfg.rows || [[1.75, 51], [2.25, 41], [2.75, 5], [3.25, 7], [3.75, 30], [4.25, 73], [4.75, 61], [5.25, 4]];
  const tbl = el("table", "group-table");
  tbl.innerHTML = `<thead><tr><th>class mark X<sub>i</sub></th><th>frequency f<sub>i</sub></th><th>f<sub>i</sub>·X<sub>i</sub></th><th>f<sub>i</sub>·(X<sub>i</sub> − x̄)²</th></tr></thead><tbody></tbody><tfoot></tfoot>`;
  const tbody = tbl.querySelector("tbody"), tfoot = tbl.querySelector("tfoot");
  const inputs = [];
  for (const [x, f] of rows) {
    const tr = el("tr");
    const xi = document.createElement("input"); xi.type = "number"; xi.value = x; xi.step = "any"; xi.className = "q-input small";
    const fi = document.createElement("input"); fi.type = "number"; fi.value = f; fi.className = "q-input small";
    const fx = el("td"), fd = el("td");
    const td1 = el("td"), td2 = el("td");
    td1.append(xi); td2.append(fi);
    tr.append(td1, td2, fx, fd);
    tbody.append(tr);
    inputs.push({ xi, fi, fx, fd });
    xi.addEventListener("input", update); fi.addEventListener("input", update);
  }
  const out = el("div", "stat-steps");
  box.append(el("p", "widget-note", "x̄ = Σ(fᵢXᵢ) / Σfᵢ.  Grouped sd: s = √[ Σ fᵢ(Xᵢ − x̄)² / (Σfᵢ − 1) ]. Edit any cell."), tbl, out);
  function update() {
    const data = inputs.map((r) => [parseFloat(r.xi.value), parseFloat(r.fi.value)]).filter(([x, f]) => Number.isFinite(x) && Number.isFinite(f));
    const N = sum(data.map(([, f]) => f));
    const sfx = sum(data.map(([x, f]) => f * x));
    const m = sfx / N;
    const sdev = sum(data.map(([x, f]) => f * (x - m) ** 2));
    inputs.forEach((r, i) => {
      const d = data[i];
      r.fx.textContent = d ? fmtNum(d[0] * d[1], 3) : "";
      r.fd.textContent = d ? fmtNum(d[1] * (d[0] - m) ** 2, 4) : "";
    });
    tfoot.innerHTML = `<tr><th>Σ</th><th>${N}</th><th>${fmtNum(sfx, 3)}</th><th>${fmtNum(sdev, 4)}</th></tr>`;
    out.innerHTML = `<div class="math-line">x̄ = ${fmtNum(sfx, 3)} / ${N} = <b>${fmtNum(m, 4)}</b></div><div class="math-line">s = √( ${fmtNum(sdev, 4)} / ${N - 1} ) = <b>${fmtNum(Math.sqrt(sdev / (N - 1)), 5)}</b></div>`;
  }
  update();
}

// ---------- widget: skewness ----------
function skewness(box, cfg) {
  box.append(el("h4", null, cfg.title || "Skewness: where do mean and median go?"));
  const svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg" });
  const out = el("div", "stat-grid");
  const s = slider("skew", -1, 1, 0.05, 0.6, draw, (v) => fmtNum(v, 2));
  box.append(el("p", "widget-note", "A long tail pulls the mean toward it; the median barely moves. Right tail → mean > median → Sk > 0."), s.row, svg, out);
  function draw(a) {
    // generate a skewed sample via log-normal-ish transform
    const N = 4000;
    const vals = [];
    let seed = 42;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    for (let i = 0; i < N; i++) {
      const u = rnd(), v = rnd();
      const z = Math.sqrt(-2 * Math.log(u + 1e-12)) * Math.cos(2 * Math.PI * v);
      const x = a === 0 ? z : (Math.exp(a * z) - 1) / a;
      vals.push(x);
    }
    const m = mean(vals), md = median(vals), sd = sampleSd(vals);
    const sk = 3 * (m - md) / sd;
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const bins = 40, counts = new Array(bins).fill(0);
    for (const v of vals) counts[Math.min(bins - 1, Math.floor(((v - lo) / (hi - lo)) * bins))]++;
    const maxC = Math.max(...counts);
    svg.innerHTML = "";
    const W = 640, H = 200, pad = 30;
    const X = (v) => pad + ((v - lo) / (hi - lo)) * (W - 2 * pad);
    counts.forEach((c, i) => {
      const x0 = pad + (i / bins) * (W - 2 * pad), w = (W - 2 * pad) / bins;
      svg.append(svgEl("rect", { x: x0, y: 160 - (c / maxC) * 130, width: w - 1, height: (c / maxC) * 130, fill: "#58b4ff55", stroke: "#58b4ff" }));
    });
    for (const [v, label, col] of [[m, "mean", "#ffd166"], [md, "median", "#3ee08a"]]) {
      svg.append(svgEl("line", { x1: X(v), x2: X(v), y1: 20, y2: 165, stroke: col, "stroke-width": 2 }));
      svg.append(svgEl("text", { x: X(v), y: label === "mean" ? 14 : 180, "text-anchor": "middle", fill: col, "font-size": 11 }, `${label} ${fmtNum(v, 2)}`));
    }
    out.innerHTML = "";
    for (const [l, v, n] of [["Pearson Sk = 3(x̄ − Q2)/s", fmtNum(sk, 3), sk > 1 ? "highly skewed right" : sk < -1 ? "highly skewed left" : sk > 0.05 ? "skewed right" : sk < -0.05 ? "skewed left" : "≈ symmetric"], ["mean − median", fmtNum(m - md, 3), m > md ? "mean pulled right" : m < md ? "mean pulled left" : "equal"]]) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", v), el("div", "stat-note", n));
      out.append(c);
    }
  }
  draw(0.6);
}

// ---------- widget: proportion ----------
function proportion(box, cfg) {
  box.append(el("h4", null, cfg.title || "Categorical data: proportion & mode"));
  const cats = cfg.categories || { Black: 95, Brown: 130, Blue: 52, Green: 10, Other: 15 };
  const tbl = el("table", "group-table");
  tbl.innerHTML = "<thead><tr><th>category</th><th>frequency</th><th>proportion p̂ = x/n</th><th></th></tr></thead><tbody></tbody>";
  const tb = tbl.querySelector("tbody");
  const rows = Object.entries(cats).map(([k, v]) => {
    const tr = el("tr");
    const inp = document.createElement("input"); inp.type = "number"; inp.value = v; inp.className = "q-input small";
    const tdIn = el("td"); tdIn.append(inp);
    const tdP = el("td"), tdBar = el("td");
    tr.append(el("td", null, k), tdIn, tdP, tdBar);
    tb.append(tr);
    inp.addEventListener("input", update);
    return { k, inp, tdP, tdBar, tr };
  });
  const out = el("div", "stat-steps");
  box.append(tbl, out);
  function update() {
    const n = sum(rows.map((r) => parseFloat(r.inp.value) || 0));
    let best = null;
    for (const r of rows) {
      const x = parseFloat(r.inp.value) || 0;
      r.tdP.textContent = n ? `${x}/${n} = ${fmtNum(x / n, 4)} (${fmtNum((100 * x) / n, 2)}%)` : "";
      r.tdBar.innerHTML = `<div class="hbar" style="width:${n ? (100 * x) / n : 0}%"></div>`;
      r.tr.classList.remove("mode-row");
      if (!best || x > best.x) best = { x, r };
    }
    if (best) best.r.tr.classList.add("mode-row");
    out.innerHTML = `<div class="math-line">n = Σ frequencies = <b>${n}</b> &nbsp;·&nbsp; mode (most frequent category) = <b>${best ? best.r.k : "—"}</b></div>`;
  }
  update();
}

// ---------- widget: drag-data ----------
// Tiny safe boolean expression evaluator for claim.when strings: numbers, a
// whitelisted set of stat identifiers, comparisons (> < >= <= == !=) and
// boolean combinators (&& ||), with parentheses. No arbitrary code execution.
const CLAIM_IDS = new Set(["mean", "median", "s", "sd", "iqr", "min", "max", "n", "range", "sk", "uf", "lf"]);

function tokenizeClaim(expr) {
  const tokens = [];
  const s = String(expr);
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "(" || c === ")") { tokens.push({ t: c }); i++; continue; }
    if (s.startsWith("&&", i)) { tokens.push({ t: "&&" }); i += 2; continue; }
    if (s.startsWith("||", i)) { tokens.push({ t: "||" }); i += 2; continue; }
    if (s.startsWith(">=", i)) { tokens.push({ t: ">=" }); i += 2; continue; }
    if (s.startsWith("<=", i)) { tokens.push({ t: "<=" }); i += 2; continue; }
    if (s.startsWith("==", i)) { tokens.push({ t: "==" }); i += 2; continue; }
    if (s.startsWith("!=", i)) { tokens.push({ t: "!=" }); i += 2; continue; }
    if (c === ">" || c === "<") { tokens.push({ t: c }); i++; continue; }
    if (/[0-9]/.test(c) || (c === "-" && /[0-9]/.test(s[i + 1] || ""))) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      tokens.push({ t: "num", v: parseFloat(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[a-zA-Z0-9_]/.test(s[j])) j++;
      tokens.push({ t: "id", v: s.slice(i, j) });
      i = j;
      continue;
    }
    throw new Error(`unexpected character '${c}' in claim expression`);
  }
  return tokens;
}

/** Evaluate a claim.when expression against a stats context. Whitelisted identifiers only. */
export function evalClaim(expr, ctx) {
  const tokens = tokenizeClaim(expr);
  let i = 0;
  const peek = () => tokens[i];
  const next = () => tokens[i++];
  function parseAtom() {
    const t = next();
    if (!t) throw new Error("unexpected end of expression");
    if (t.t === "(") {
      const v = parseOr();
      const close = next();
      if (!close || close.t !== ")") throw new Error("expected ')'");
      return v;
    }
    if (t.t === "num") return t.v;
    if (t.t === "id") {
      if (!CLAIM_IDS.has(t.v)) throw new Error(`unknown identifier '${t.v}'`);
      if (!(t.v in ctx)) throw new Error(`identifier '${t.v}' not provided`);
      return ctx[t.v];
    }
    throw new Error(`unexpected token '${t.t}'`);
  }
  function parseCmp() {
    const a = parseAtom();
    const op = peek();
    if (op && [">", "<", ">=", "<=", "==", "!="].includes(op.t)) {
      next();
      const b = parseAtom();
      switch (op.t) {
        case ">": return a > b;
        case "<": return a < b;
        case ">=": return a >= b;
        case "<=": return a <= b;
        case "==": return a === b;
        case "!=": return a !== b;
      }
    }
    return a;
  }
  function parseAnd() {
    let v = parseCmp();
    while (peek() && peek().t === "&&") { next(); v = parseCmp() && v; }
    return v;
  }
  function parseOr() {
    let v = parseAnd();
    while (peek() && peek().t === "||") { next(); v = parseAnd() || v; }
    return v;
  }
  const result = parseOr();
  if (i !== tokens.length) throw new Error("unexpected trailing tokens");
  return !!result;
}

function dragDataStats(data) {
  const s = [...data].sort((a, b) => a - b);
  const m = mean(data);
  const md = median(data);
  const sd = data.length > 1 ? sampleSd(data) : 0;
  const q1 = quantileR(s, 0.25), q3 = quantileR(s, 0.75);
  const iqr = q3 - q1;
  const lf = q1 - 1.5 * iqr, uf = q3 + 1.5 * iqr;
  const sk = sd ? (3 * (m - md)) / sd : 0;
  const mn = s[0], mx = s[s.length - 1];
  return { mean: m, median: md, s: sd, sd, iqr, min: mn, max: mx, n: data.length, range: mx - mn, sk, uf, lf };
}

function dragData(box, cfg) {
  box.append(el("h4", null, cfg.title || "Drag the data, watch the stat"));
  const claims = Array.isArray(cfg.claims) ? cfg.claims : [];
  let data = parseNums(cfg.data || "");
  if (data.length < 2) data = [2, 4, 4, 4, 5, 5, 7, 9];
  box.append(el("p", "widget-note", "Drag a point to change its value (snaps to 0.1, or use the arrow keys on a focused point). Click or press Enter on the × above a point to remove it."));
  const dotSvg = svgEl("svg", { class: "dotplot-svg" });
  const addBtn = el("button", "viz-btn dd-add", "+ add point");
  const controlRow = el("div", "dd-controls");
  controlRow.append(addBtn);
  const statOut = el("div", "stat-grid");
  const boxSvg = svgEl("svg", { class: "boxplot-svg" });
  const claimsOut = el("div", "dd-claims");
  box.append(dotSvg, controlRow, statOut, boxSvg, claimsOut);

  const W = 640, H = 90, pad = 30, cy = 46;
  let bounds;
  function computeBounds() {
    const mn = Math.min(...data), mx = Math.max(...data);
    const span = mx - mn || 2;
    const m = span * 0.25;
    bounds = { lo: mn - m, hi: mx + m };
  }
  const X = (v) => pad + ((v - bounds.lo) / (bounds.hi - bounds.lo)) * (W - 2 * pad);
  const invX = (px) => bounds.lo + ((px - pad) / (W - 2 * pad)) * (bounds.hi - bounds.lo);

  function render(keepBounds = false) {
    if (!keepBounds) computeBounds();
    const st = dragDataStats(data);
    dotSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    dotSvg.innerHTML = "";
    dotSvg.append(svgEl("line", { x1: pad, x2: W - pad, y1: cy, y2: cy, stroke: "#3a4a5a" }));
    const ticks = 6;
    for (let i = 0; i <= ticks; i++) {
      const v = bounds.lo + ((bounds.hi - bounds.lo) * i) / ticks;
      dotSvg.append(svgEl("line", { x1: X(v), x2: X(v), y1: cy, y2: cy + 5, stroke: "#3a4a5a" }));
      dotSvg.append(svgEl("text", { x: X(v), y: cy + 18, "text-anchor": "middle", fill: "#8a9bab", "font-size": 10 }, fmtNum(v, 2)));
    }
    for (const [v, label, col] of [[st.mean, "x\u0304", "#ffd166"], [st.median, "Q2", "#3ee08a"]]) {
      dotSvg.append(svgEl("line", { x1: X(v), x2: X(v), y1: 8, y2: cy - 6, stroke: col, "stroke-width": 2, "stroke-dasharray": "3 2" }));
      dotSvg.append(svgEl("text", { x: X(v), y: 8, "text-anchor": "middle", fill: col, "font-size": 10 }, label));
    }
    data.forEach((v, i) => {
      const cx = X(v);
      const removable = data.length > 2;
      const dot = svgEl("circle", { cx, cy, r: 7, fill: "#58b4ff", stroke: "#0d1117", "stroke-width": 1.5, class: "dd-dot", tabindex: "0" });
      dot.addEventListener("pointerdown", (e) => {
        dot.setPointerCapture(e.pointerId);
        const move = (ev) => {
          const rect = dotSvg.getBoundingClientRect();
          const px = ((ev.clientX - rect.left) / rect.width) * W;
          data[i] = Math.round(invX(px) * 10) / 10;
          render(true);
        };
        const up = () => { dot.removeEventListener("pointermove", move); dot.removeEventListener("pointerup", up); };
        dot.addEventListener("pointermove", move);
        dot.addEventListener("pointerup", up);
      });
      dot.addEventListener("keydown", (e) => {
        const step = e.shiftKey ? 1 : 0.1;
        if (e.key === "ArrowLeft") { data[i] = Math.round((data[i] - step) * 10) / 10; render(); e.preventDefault(); }
        else if (e.key === "ArrowRight") { data[i] = Math.round((data[i] + step) * 10) / 10; render(); e.preventDefault(); }
        else if ((e.key === "Delete" || e.key === "Backspace") && removable) { data.splice(i, 1); render(); e.preventDefault(); }
      });
      const rm = svgEl("g", { class: "dd-remove" + (removable ? "" : " disabled"), tabindex: removable ? "0" : "-1" });
      rm.append(svgEl("circle", { cx, cy: cy - 18, r: 6, fill: "#1b2230", stroke: "#ff6b6b" }));
      rm.append(svgEl("text", { x: cx, y: cy - 14, "text-anchor": "middle", fill: "#ff6b6b", "font-size": 9 }, "\u00d7"));
      if (removable) {
        rm.addEventListener("click", () => { data.splice(i, 1); render(); });
        rm.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { data.splice(i, 1); render(); e.preventDefault(); } });
      }
      dotSvg.append(dot, rm);
    });

    statOut.innerHTML = "";
    for (const [l, v] of [["Mean", fmtNum(st.mean)], ["Median", fmtNum(st.median)], ["s", fmtNum(st.s)], ["IQR", fmtNum(st.iqr)]]) {
      const c = el("div", "stat-cell");
      c.append(el("div", "stat-label", l), el("div", "stat-value", v));
      statOut.append(c);
    }
    drawBoxplot(boxSvg, data);

    claimsOut.innerHTML = "";
    for (const claim of claims) {
      let truth = false;
      try { truth = evalClaim(claim.when, st); } catch (err) { console.warn(`drag-data claim "${claim.when}": ${err.message}`); }
      claimsOut.append(el("div", "dd-claim" + (truth ? " true" : " false"), claim.text));
    }
  }

  addBtn.addEventListener("click", () => {
    const st = dragDataStats(data);
    data.push(Math.round(st.mean * 10) / 10);
    render();
  });

  render();
}

// ---------- widget: stat-bars ----------
// Bars of (x - x̄)² per data point, each carrying `data-tag="<tag>-<i>"` so `app/mathlink.js`
// can light one bar from a worked-example reference, or every bar from the bare `<tag>` on the
// formula's sum-of-squares term.
function statBars(box, cfg) {
  const data = parseNums(cfg.data || "");
  const tag = cfg.tag || "dev";
  box.append(el("h4", null, cfg.title || "Squared deviations from the mean"));
  const m = mean(data);
  const devs = data.map((x) => (x - m) ** 2);
  const maxDev = Math.max(...devs, 1e-9);
  const width = 640, height = 210, pad = 30, baseline = height - 40, top = 22;
  const n = data.length || 1;
  const gap = 16;
  const bw = Math.max(18, (width - 2 * pad - gap * (n - 1)) / n);
  const scale = (baseline - top) / maxDev;
  const svg = svgEl("svg", { class: "stat-bars-svg", viewBox: `0 0 ${Math.max(width, 2 * pad + n * (bw + gap))} ${height}` });
  data.forEach((x, i) => {
    const d = devs[i];
    const bh = Math.max(2, d * scale);
    const bx = pad + i * (bw + gap);
    const by = baseline - bh;
    const g = svgEl("g", { class: "stat-bar", "data-tag": `${tag}-${i}`, tabindex: "0" });
    g.append(svgEl("rect", { x: bx, y: by, width: bw, height: bh, rx: 3 }));
    g.append(svgEl("text", { x: bx + bw / 2, y: baseline + 16, "text-anchor": "middle" }, `x=${fmtNum(x, 3)}`));
    g.append(svgEl("text", { x: bx + bw / 2, y: by - 6, "text-anchor": "middle" }, fmtNum(d, 4)));
    svg.append(g);
  });
  svg.append(svgEl("line", { x1: pad, x2: pad + n * (bw + gap) - gap, y1: baseline, y2: baseline, class: "stat-bars-axis" }));
  box.append(svg, el("p", "widget-note", `Bar height = (x − x̄)² with x̄ = ${fmtNum(m, 4)}. Hover a formula part or a bar to see the connection.`));
}

export const WIDGETS = {
  "stat-calc": statCalc,
  "normal-curve": normalCurve,
  "chebyshev": chebyshev,
  "boxplot": boxplotWidget,
  "scatter-corr": scatterCorr,
  "grouped-mean": groupedMean,
  "skewness": skewness,
  "proportion": proportion,
  "drag-data": dragData,
  "stat-bars": statBars,
};
