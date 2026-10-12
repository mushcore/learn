// Interactive widgets for MATH 3042 Unit 4 (discrete probability distributions): an editable
// probability table with its mean and standard deviation, the binomial, hypergeometric, geometric
// and Poisson calculators with every lecture example as a preset, and a which-distribution picker.
import { el, btnRow, fmtNum } from "./dom.js";

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
  const l = el("div", "stat-label"); l.innerHTML = label; c.append(l);
  const v = el("div", "stat-value"); v.innerHTML = value; c.append(v);
  if (extra) { const n = el("div", "stat-note"); n.innerHTML = extra; c.append(n); }
  return c;
}
function grid(out, rows) { out.innerHTML = ""; for (const r of rows) out.append(cell(...r)); }
function rcode(html = "") { const p = el("pre", "manip-code"); p.innerHTML = html; return p; }
function mathLine(html = "") { const d = el("div", "math-line"); d.innerHTML = html; return d; }
function toggle(label, checked, onChange) {
  const lab = el("label", "oop-toggle");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, el("span", null, label));
  return { row: lab, input };
}
function numField(label, value, onChange, step = 1) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = step; input.value = value; input.setAttribute("aria-label", label);
  input.addEventListener("input", () => onChange(parseFloat(input.value)));
  row.append(el("label", null, label), input);
  return { row, input, get: () => parseFloat(input.value), set: (v) => { input.value = v; } };
}
/** a/b or a decimal; parts() gives [a, b] when the text is a fraction. */
function fracParts(s) { const m = String(s).trim().match(/^(\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/); return m ? [parseFloat(m[1]), parseFloat(m[2])] : null; }
function fracVal(s) {
  const t = String(s).trim(), m = fracParts(t);
  if (m) return m[1] ? m[0] / m[1] : NaN;
  return /^-?\d*\.?\d+(e-?\d+)?$/i.test(t) ? parseFloat(t) : NaN;
}
function fracField(label, value, onChange) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "text"; input.spellcheck = false; input.value = value ?? ""; input.setAttribute("aria-label", label);
  input.addEventListener("input", () => onChange());
  row.append(el("label", null, label), input);
  return { row, input, raw: () => input.value.trim(), parts: () => fracParts(input.value), get: () => fracVal(input.value), set: (v) => { input.value = v ?? ""; } };
}

// ---------- numbers ----------
const clampInt = (v, lo, hi, d) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.round(v))) : d);
/** Display form: up to d decimals, thin-space digit groups from 10 000 up, a real minus sign. */
function num(v, d = 4) {
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  const [int, frac] = String(Number(Math.abs(r).toFixed(d))).split(".");
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : int;
  return (r < 0 ? "−" : "") + grouped + (frac ? "." + frac : "");
}
/** A probability as the notes box it: four decimals, trailing zeros kept (0.0460). */
const p4 = (v) => (Number.isFinite(v) ? (v < 0 ? "−" : "") + Math.abs(v).toFixed(4) : "—");
/** R's default print: seven significant digits. */
const rfmt = (v) => (Number.isFinite(v) ? String(Number(v.toPrecision(7))).replace("-", "−").replace("e−", "e-") : "NaN");
function big(n) { const s = n.toString(); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s; }
/** Mantissa × 10^k for very small or very large values, plain decimals otherwise. */
function sci(v, sig = 4) {
  if (!Number.isFinite(v)) return "—";
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e-3 && a < 1e5) return num(v, a >= 100 ? 1 : 4);
  const e = Math.floor(Math.log10(a)), m = v / 10 ** e;
  return `${num(m, sig - 1)} × 10<sup>${e < 0 ? "−" : ""}${Math.abs(e)}</sup>`;
}
const pStr = (raw, v) => { const f = fracParts(raw); return f ? `${f[0]}/${f[1]}` : fmtNum(v, 4); };
const qStr = (raw, v) => { const f = fracParts(raw); return f && Number.isInteger(f[0]) && Number.isInteger(f[1]) ? `${f[1] - f[0]}/${f[1]}` : fmtNum(1 - v, 4); };
const paren = (s) => (s.includes("/") ? `(${s})` : s);

const LNF = [0];
function lnfact(n) { while (LNF.length <= n) LNF.push(LNF[LNF.length - 1] + Math.log(LNF.length)); return LNF[n]; }
function dbinom(x, n, p) {
  if (x < 0 || x > n || !Number.isInteger(x)) return 0;
  if (p <= 0) return x === 0 ? 1 : 0;
  if (p >= 1) return x === n ? 1 : 0;
  return Math.exp(lnfact(n) - lnfact(x) - lnfact(n - x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
}
function dpois(x, l) { if (x < 0) return 0; if (l <= 0) return x === 0 ? 1 : 0; return Math.exp(x * Math.log(l) - l - lnfact(x)); }
/** C(n, r) exactly (BigInt); each step is C(n − r + i, i) so the division is exact. */
function combB(n, r) {
  if (r < 0 || r > n) return 0n;
  r = Math.min(r, n - r);
  let p = 1n;
  for (let i = 1; i <= r; i++) p = (p * BigInt(n - r + i)) / BigInt(i);
  return p;
}
const ratioB = (a, b) => (b === 0n ? NaN : Number((a * 10n ** 30n) / b) / 1e30);
const dhyper = (x, K, N, n) => (x < 0 || x > n ? 0 : ratioB(combB(K, x) * combB(N - K, n - x), combB(N, n)));
const sumTo = (pmf, lo, hi) => { let s = 0; for (let k = Math.max(0, lo); k <= Math.min(hi, pmf.length - 1); k++) s += pmf[k]; return s; };
const zVerdict = (z) => (!Number.isFinite(z) ? "—" : Math.abs(z) > 2 ? "<b>unusual</b>: beyond ±2" : "not unusual: within ±2");
/** The Z cell and the tail cell for a value x of a distribution with pmf over 0..n. */
function zRows(x, mu, sig, pmf, xName = "x") {
  const z = (x - mu) / sig;
  const below = x <= mu;
  const tail = below ? sumTo(pmf, 0, x) : sumTo(pmf, x, pmf.length - 1);
  return [
    [`Z = (${xName} − μ)/σ`, `(${num(x, 2)} − ${num(mu, 2)})/${num(sig, 2)} = <b>${num(z, 2)}</b>`, zVerdict(z)],
    [`tail: P(X ${below ? "≤" : "≥"} ${num(x, 0)})`, p4(tail), tail < 0.025 ? "<b>below 0.025</b>: unusual by the tail rule too" : "not below 0.025: the tail rule agrees"],
  ];
}
/** Sum written out: P(lo) + … + P(hi) with the values, shortened when long. */
function sumTerms(pmf, lo, hi, maxTerms = 6) {
  const ks = []; for (let k = lo; k <= hi; k++) ks.push(k);
  const names = (arr) => arr.map((k) => `P(${k})`), vals = (arr) => arr.map((k) => p4(pmf[k]));
  if (ks.length <= maxTerms) return { names: names(ks).join(" + "), vals: vals(ks).join(" + ") };
  const head = ks.slice(0, 2), tail = ks.slice(-1);
  return { names: `${names(head).join(" + ")} + … + ${names(tail)}`, vals: `${vals(head).join(" + ")} + … + ${vals(tail)}` };
}

// ---------- bar chart (R's barplot(space=0) look) ----------
function niceCeil(v) {
  const e = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * e >= v) return m * e;
  return 10 * e;
}
/** series: [{ v: number[], fill, outline: bool, stroke }]; hit: Set of indexes highlighted on series 0. */
function barChart(svg, labels, series, hit, opts = {}) {
  svg.innerHTML = "";
  svg.setAttribute("viewBox", "0 0 640 216");
  const X0 = 48, X1 = 630, Y0 = 180, Y1 = 18, n = labels.length, bw = (X1 - X0) / Math.max(1, n);
  let ymax = 0;
  for (const s of series) for (const v of s.v) if (Number.isFinite(v)) ymax = Math.max(ymax, v);
  ymax = ymax > 0 ? niceCeil(ymax) : 1;
  const yOf = (v) => Y0 - ((Y0 - Y1) * v) / ymax;
  for (const t of [0.25, 0.5, 0.75, 1]) {
    svg.append(svgEl("line", { x1: X0, y1: yOf(t * ymax), x2: X1, y2: yOf(t * ymax), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
    svg.append(svgEl("text", { x: X0 - 6, y: yOf(t * ymax) + 4, "text-anchor": "end", "font-size": 10.5, fill: "var(--ink-dim)" }, fmtNum(t * ymax, 3)));
  }
  series.forEach((s, si) => {
    s.v.forEach((v, i) => {
      if (!Number.isFinite(v) || v <= 0) return;
      const x = X0 + i * bw, h = Y0 - yOf(v);
      if (s.outline) svg.append(svgEl("rect", { x: x + 1, y: yOf(v), width: Math.max(1, bw - 2), height: h, fill: "none", stroke: s.stroke || "var(--green)", "stroke-width": 1.8 }));
      else svg.append(svgEl("rect", { x, y: yOf(v), width: bw, height: h, fill: hit && hit.has(i) ? "var(--hl)" : s.fill || "var(--blue)", stroke: "var(--paper-2)", "stroke-width": n > 80 ? 0.4 : 1 }));
      if (si === 0 && n <= 12 && opts.values !== false) svg.append(svgEl("text", { x: x + bw / 2, y: yOf(v) - 4, "text-anchor": "middle", "font-size": 10, fill: hit && hit.has(i) ? "var(--hl)" : "var(--ink-dim)" }, fmtNum(v, 4)));
    });
  });
  svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
  svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
  const step = Math.ceil(n / 26);
  labels.forEach((l, i) => {
    if (i % step) return;
    svg.append(svgEl("text", { x: X0 + (i + 0.5) * bw, y: Y0 + 14, "text-anchor": "middle", "font-size": 10.5, fill: hit && hit.has(i) ? "var(--hl)" : "var(--ink-dim)" }, String(l)));
  });
  if (hit && hit.size) {
    const idx = [...hit].filter((i) => i >= 0 && i < n).sort((a, b) => a - b);
    if (idx.length <= 2) for (const i of idx) svg.append(svgEl("path", { d: `M${X0 + (i + 0.5) * bw - 4},${Y0 + 24} l8,0 l-4,-6 z`, fill: "var(--hl)" }));
    else if (idx.length) svg.append(svgEl("line", { x1: X0 + idx[0] * bw + 1, y1: Y0 + 21, x2: X0 + (idx[idx.length - 1] + 1) * bw - 1, y2: Y0 + 21, stroke: "var(--hl)", "stroke-width": 3, "stroke-linecap": "round" }));
  }
  if (opts.xlab) svg.append(svgEl("text", { x: X1, y: Y0 + 34, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, opts.xlab));
  svg.append(svgEl("text", { x: X0 - 40, y: Y1 - 6, "font-size": 11, fill: "var(--ink-dim)" }, "P(x)"));
  (opts.legend || []).forEach(([text, color, outline], i) => {
    const x = 300 + i * 160;
    if (outline) svg.append(svgEl("rect", { x, y: Y1 - 14, width: 14, height: 10, fill: "none", stroke: color, "stroke-width": 1.8 }));
    else svg.append(svgEl("rect", { x, y: Y1 - 14, width: 14, height: 10, fill: color }));
    svg.append(svgEl("text", { x: x + 19, y: Y1 - 5, "font-size": 11, fill: "var(--ink-dim)" }, text));
  });
}

// ---------- widget: pmf-table ----------
const PMF_PRESETS = {
  "Canadian family size": { rows: [[0, "0.4499"], [1, "0.2504"], [2, "0.2048"], [3, "0.0949"]], xlab: "X = number of children",
    about: "The 2023 StatCan table from p. 55 (the 3 bar is really 3 or more). The notes get μ = 0.94 and σ = 1.02.",
    r: (m) => `X.vals <- c(0, 1, 2, 3)\np.vals <- c(0.4499, 0.2504, 0.2048, 0.0949)\nX.sim <- sample(X.vals, ${m}, replace=TRUE, prob=p.vals)\nc(mean(X.sim), sd(X.sim))` },
  "fair die": { rows: [[1, "1/6"], [2, "1/6"], [3, "1/6"], [4, "1/6"], [5, "1/6"], [6, "1/6"]], xlab: "X = number rolled",
    about: "p. 56: 100 simulated rolls averaged 3.38; over all possible rolls μ = 21/6 = 3.5.",
    trial: () => 1 + Math.floor(Math.random() * 6), r: (m) => `X.vals <- sample(1:6, ${m}, replace=TRUE)\nsum(X.vals) / ${m}` },
  "minimum of two dice": { rows: [[1, "11/36"], [2, "9/36"], [3, "7/36"], [4, "5/36"], [5, "3/36"], [6, "1/36"]], xlab: "X = minimum of the two dice",
    about: "p. 57: the 36-cell grid has 11 cells with minimum 1, 9 with minimum 2, …, 1 with minimum 6: P(x) = (13 − 2x)/36. The notes get μ = 2.53, σ = 1.40.",
    trial: () => Math.min(1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)), r: (m) => `X.vals <- replicate(${m}, min(sample(1:6, 2, replace=TRUE)))\nc(mean(X.vals), sd(X.vals))` },
  "minimum of three dice": { rows: [[1, "91/216"], [2, "61/216"], [3, "37/216"], [4, "19/216"], [5, "7/216"], [6, "1/216"]], xlab: "X = minimum of the three dice",
    about: "p. 57 answers this by simulation (μ = 2.04, σ = 1.15). The exact table counts the 216 equally likely triples: P(x) = ((7 − x)³ − (6 − x)³)/216.",
    trial: () => Math.min(1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)),
    r: (m) => `m.trials <- ${m}\nX.vals <- integer(m.trials)\nfor (i.trial in 1:m.trials){\n  X.vals[i.trial] <- min( sample(1:6, 3, replace=TRUE) )\n}\nmu <- mean(X.vals)\nsig <- sd(X.vals)` },
};
function pmfTable(box, cfg) {
  box.append(el("h4", null, cfg.title || "A probability table: is it a distribution, and what are μ and σ?"));
  const names = Object.keys(PMF_PRESETS);
  let presetName = PMF_PRESETS[cfg.preset] ? cfg.preset : null;
  const cfgRows = Array.isArray(cfg.rows) && cfg.rows.length ? cfg.rows : null;
  if (!presetName && !cfgRows) presetName = names[0];
  let rows = (presetName ? PMF_PRESETS[presetName].rows : cfgRows).map(([x, p]) => ({ x: String(x), p: String(p) }));
  let xlab = cfg.xlab || (presetName ? PMF_PRESETS[presetName].xlab : "x");
  let m = 0, sum = 0, sumsq = 0, counts = [];
  box.append(note("Edit x and P(x) (fractions like 11/36 are fine), add or remove rows. The table is a distribution only if every P(x) is between 0 and 1 and they add to 1. μ = Σ x P(x) is the expected value E[X]; σ² = Σ (x − μ)² P(x)."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { presetName = names[i]; rows = PMF_PRESETS[presetName].rows.map(([x, p]) => ({ x: String(x), p: String(p) })); xlab = PMF_PRESETS[presetName].xlab; build(); }, names.indexOf(presetName)));
  const about = el("p", "widget-note"), wrap = el("div", "table-wrap"), ctl = el("div", "viz-btn-row"), valid = el("div", "math-line");
  const svg = svgEl("svg", { viewBox: "0 0 640 216", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid"), steps = el("div", "stat-steps");
  const addBtn = el("button", "viz-btn", "add a row"), simTitle = el("div", "stat-label");
  addBtn.addEventListener("click", () => { const last = rows[rows.length - 1]; rows.push({ x: String((parseFloat(last?.x) || 0) + 1), p: "0" }); presetName = null; build(); });
  ctl.append(addBtn);
  box.append(about, wrap, ctl, valid, svg, out, steps);
  const simRow = btnRow(["+100", "+1 000", "+10 000", "reset"], (i) => { if (i === 3) return resetSim(); simulate([100, 1000, 10000][i]); }, -1);
  const simOut = el("div", "stat-grid"), code = rcode("");
  if (cfg.simulate !== false) { simTitle.textContent = "Simulate: draw values of X and watch the sample mean settle on μ"; box.append(simTitle, simRow, simOut, code); }

  const parsed = () => rows.map((r) => ({ x: parseFloat(r.x), p: fracVal(r.p), xs: r.x, ps: fracParts(r.p) ? r.p.replace(/\s+/g, "") : fmtNum(fracVal(r.p), 4) }));
  function stats() {
    const d = parsed();
    const ok = d.every((r) => Number.isFinite(r.x) && Number.isFinite(r.p) && r.p >= 0 && r.p <= 1);
    const total = d.reduce((a, r) => a + (r.p || 0), 0);
    const mu = d.reduce((a, r) => a + r.x * r.p, 0), v = d.reduce((a, r) => a + (r.x - mu) ** 2 * r.p, 0);
    return { d, ok, total, isDist: ok && Math.abs(total - 1) < 5e-4, mu, v, sig: Math.sqrt(v) };
  }
  function build() {
    resetSim(false);
    wrap.innerHTML = "";
    about.innerHTML = presetName ? PMF_PRESETS[presetName].about : "";
    const t = el("table", "group-table prob2-table");
    t.innerHTML = `<thead><tr><th>x</th><th>P(x)</th><th>x · P(x)</th><th>(x − μ)² · P(x)</th><th></th></tr></thead>`;
    const tb = el("tbody");
    rows.forEach((r, i) => {
      const tr = el("tr");
      const tx = el("td"), tp = el("td"), txp = el("td"), tv = el("td"), trm = el("td");
      const ix = document.createElement("input"); ix.type = "number"; ix.step = "any"; ix.value = r.x; ix.className = "q-input small"; ix.setAttribute("aria-label", `x for row ${i + 1}`);
      const ip = document.createElement("input"); ip.type = "text"; ip.spellcheck = false; ip.value = r.p; ip.className = "q-input small"; ip.setAttribute("aria-label", `P(x) for row ${i + 1}`);
      ix.addEventListener("input", () => { r.x = ix.value; presetName = null; about.innerHTML = ""; update(); });
      ip.addEventListener("input", () => { r.p = ip.value; presetName = null; about.innerHTML = ""; update(); });
      const rm = el("button", "viz-btn", "×"); rm.setAttribute("aria-label", `remove row ${i + 1}`); rm.title = "remove this row";
      rm.addEventListener("click", () => { rows.splice(i, 1); presetName = null; build(); });
      tx.append(ix); tp.append(ip); trm.append(rm);
      tr.append(tx, tp, txp, tv, trm); tb.append(tr);
      r.cells = [txp, tv];
    });
    const foot = el("tr", "prob2-foot"); foot.innerHTML = `<th>Σ</th><td class="prob2-sum"></td><td class="prob2-mu"></td><td class="prob2-var"></td><td></td>`;
    tb.append(foot); t.append(tb); wrap.append(t);
    update();
  }
  function update() {
    const s = stats();
    const d = s.d;
    d.forEach((r, i) => { rows[i].cells[0].textContent = Number.isFinite(r.x * r.p) ? fmtNum(r.x * r.p, 4) : "—"; rows[i].cells[1].textContent = Number.isFinite(r.p) ? fmtNum((r.x - s.mu) ** 2 * r.p, 4) : "—"; });
    const sumCell = wrap.querySelector(".prob2-sum"); sumCell.textContent = fmtNum(s.total, 4); sumCell.classList.toggle("bad", !s.isDist);
    wrap.querySelector(".prob2-mu").textContent = s.isDist ? `μ = ${fmtNum(s.mu, 4)}` : "—";
    wrap.querySelector(".prob2-var").textContent = s.isDist ? `σ² = ${fmtNum(s.v, 4)}` : "—";
    const badP = d.some((r) => !Number.isFinite(r.p) || r.p < 0 || r.p > 1);
    valid.innerHTML = badP ? `<span class="prob2-bad">Not a distribution: every P(x) must be a number between 0 and 1.</span>`
      : !s.isDist ? `<span class="prob2-bad">Σ P(x) = ${fmtNum(s.total, 4)} ≠ 1: not a probability distribution.</span>`
        : `Σ P(x) = ${fmtNum(s.total, 4)} and every P(x) is in [0, 1]: a valid probability distribution.`;
    // histogram, sorted by x
    const order = d.map((r, i) => i).filter((i) => Number.isFinite(d[i].x)).sort((a, b) => d[a].x - d[b].x);
    const labels = order.map((i) => fmtNum(d[i].x, 3)), vals = order.map((i) => (Number.isFinite(d[i].p) ? Math.max(0, d[i].p) : 0));
    const series = [{ v: vals }];
    if (m > 0) series.push({ v: order.map((i) => counts[i] / m), outline: true, stroke: "var(--hl)" });
    barChart(svg, labels, series, null, { xlab, legend: m > 0 ? [["P(x) from the table", "var(--blue)"], [`simulated, m = ${big(m)}`, "var(--hl)", true]] : [] });
    if (!s.isDist) { out.innerHTML = ""; steps.innerHTML = ""; return; }
    grid(out, [["μ = Σ x P(x) = E[X]", fmtNum(s.mu, 2), `exactly ${fmtNum(s.mu, 4)}`], ["σ² = Σ (x − μ)² P(x)", fmtNum(s.v, 2), `exactly ${fmtNum(s.v, 4)}`], ["σ = √σ²", fmtNum(s.sig, 2), `exactly ${fmtNum(s.sig, 4)}`]]);
    const terms = (f) => { const all = order.map((i) => f(d[i])); return all.length <= 8 ? all.join(" + ") : `${all.slice(0, 3).join(" + ")} + … + ${all[all.length - 1]}`; };
    const muS = fmtNum(s.mu, 2);
    steps.innerHTML = "";
    steps.append(mathLine(`μ = ${terms((r) => `${fmtNum(r.x, 3)}(${r.ps})`)} = <b>${muS}</b>`));
    steps.append(mathLine(`σ² = ${terms((r) => `(${fmtNum(r.x, 3)} − ${muS})²(${r.ps})`)} = <b>${fmtNum(s.v, 2)}</b>`));
    steps.append(mathLine(`σ = √${fmtNum(s.v, 2)} = <b>${fmtNum(s.sig, 2)}</b>`));
  }
  function trialFn() {
    const pre = presetName && PMF_PRESETS[presetName].trial;
    const d = parsed();
    if (pre) { const byX = new Map(d.map((r, i) => [r.x, i])); return () => byX.get(pre()) ?? 0; }
    const cum = []; let c = 0; for (const r of d) { c += r.p; cum.push(c); }
    return () => { const u = Math.random() * c; for (let i = 0; i < cum.length; i++) if (u < cum[i]) return i; return cum.length - 1; };
  }
  function simulate(k) {
    const s = stats();
    if (!s.isDist) { simOut.innerHTML = ""; simOut.append(cell("simulation", "—", "fix the table first: the probabilities must add to 1")); return; }
    if (counts.length !== rows.length) counts = rows.map(() => 0);
    const t = trialFn();
    for (let i = 0; i < k; i++) { const idx = t(); const x = s.d[idx].x; counts[idx]++; m++; sum += x; sumsq += x * x; }
    const mean = sum / m, sd = m > 1 ? Math.sqrt((sumsq - m * mean * mean) / (m - 1)) : NaN;
    grid(simOut, [["trials m", big(m)], ["sample mean x̄", fmtNum(mean, 4), `μ = ${fmtNum(s.mu, 4)}; difference ${fmtNum(Math.abs(mean - s.mu), 4)}`], ["sample sd s", fmtNum(sd, 4), `σ = ${fmtNum(s.sig, 4)}`]]);
    const r = presetName && PMF_PRESETS[presetName].r;
    code.hidden = false;
    code.textContent = (r ? r(m) : `X.vals <- c(${s.d.map((q) => fmtNum(q.x, 3)).join(", ")})\np.vals <- c(${s.d.map((q) => q.ps).join(", ")})\nX.sim <- sample(X.vals, ${m}, replace=TRUE, prob=p.vals)\nc(mean(X.sim), sd(X.sim))`) + `\n# this run: ${fmtNum(mean, 4)} ${fmtNum(sd, 4)}`;
    update();
  }
  function resetSim(redraw = true) { m = 0; sum = 0; sumsq = 0; counts = []; simOut.innerHTML = ""; code.textContent = ""; code.hidden = true; if (redraw) update(); }
  build();
}

// ---------- widget: binomial-calc ----------
const BIN_PRESETS = {
  "online shoppers": { n: 50, p: "0.25", x: 6, op: "eq", xlab: "X = # sales",
    story: ["Fixed n: 50 visitors during the hour", "Success/Failure: each visitor completes a sale or does not", "Equal p: every visitor has p = 0.25", "Independence: one visitor's sale does not affect another's"] },
  "number of 3s in 5 rolls": { n: 5, p: "1/6", x: 2, op: "eq", xlab: "X = number of 3s",
    story: ["Fixed n: 5 rolls", "Success/Failure: each roll is a 3 or not", "Equal p: p = 1/6 on every roll", "Independence: rolls do not affect each other"] },
  "2 jacks in 5 (with replacement)": { n: 5, p: "4/52", x: 2, op: "eq", xlab: "X = number of jacks",
    story: ["Fixed n: 5 cards", "Success/Failure: jack or not", "Equal p: the card goes back, so p = 4/52 on every draw", "Independence: with replacement each draw is a fresh deck"] },
  "laser printers": { n: 200, p: "0.10", x: 14, op: "le", xlab: "X = printers needing repair",
    story: ["Fixed n: 200 modified printers", "Success/Failure: needs repair in the first year or not", "Equal p: p = 0.10 for each printer if the modifications did nothing", "Independence: one printer's failure does not affect another's"] },
  "Alice wins 13 games (Quiz 4)": { n: 13, p: "0.6", x: 7, op: "ge", xlab: "X = games Alice wins",
    story: ["Fixed n: 13 games", "Success/Failure: Alice wins or loses each game", "Equal p: P(Alice wins) = 0.6 every game", "Independence: games do not affect each other"] },
};
const OPS = ["eq", "le", "ge", "between"];
const OP_LABELS = ["P(X = x)", "P(X ≤ x)", "P(X ≥ x)", "P(x ≤ X ≤ x₂)"];
function binomialCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Binomial probabilities: P(x) = C(n, x) p^x q^(n − x)"));
  const names = Object.keys(BIN_PRESETS);
  let presetName = BIN_PRESETS[cfg.preset] ? cfg.preset : null;
  const base = presetName ? BIN_PRESETS[presetName] : {};
  let n = cfg.n ?? base.n ?? 50, p = String(cfg.p ?? base.p ?? "0.25"), x = cfg.x ?? base.x ?? 6, x2 = cfg.x2 ?? base.x2 ?? Math.min(n, x + 4);
  let op = OPS.includes(cfg.op) ? cfg.op : base.op || "eq";
  let xlab = base.xlab || "x";
  box.append(note("n trials, each a success with probability p (a fraction like 1/6 is fine), X = the number of successes. Pick what to compute; the formula is substituted below the bars. Z = (x − μ)/σ beyond ±2 is unusual."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { presetName = names[i]; const b = BIN_PRESETS[presetName]; n = b.n; p = b.p; x = b.x; op = b.op; x2 = Math.min(n, x + 4); xlab = b.xlab; fn.set(n); fp.set(p); fx.set(x); fx2.set(x2); opRow.querySelectorAll("button")[OPS.indexOf(op)].click(); buildChecklist(); }, names.indexOf(presetName)));
  const fn = numField("n (trials)", n, (v) => { n = v; draw(); }), fp = fracField("p (success)", p, () => { p = fp.raw(); draw(); });
  const fx = numField("x", x, (v) => { x = v; draw(); }), fx2 = numField("x₂ (upper)", x2, (v) => { x2 = v; draw(); });
  const opRow = btnRow(OP_LABELS, (i) => { op = OPS[i]; draw(); }, OPS.indexOf(op));
  const inputs = el("div", "unit-row"); inputs.append(fn.row, fp.row, fx.row, fx2.row);
  const formula = el("div", "prob-formula"), svg = svgEl("svg", { viewBox: "0 0 640 216", class: "curve-svg net-svg" });
  const tableWrap = el("div", "table-wrap"), out = el("div", "stat-grid"), code = rcode(""), checks = el("div");
  box.append(inputs, opRow, formula, svg, tableWrap, out, code, checks);
  function buildChecklist() {
    checks.innerHTML = "";
    if (!cfg.conditions) return;
    const story = presetName ? BIN_PRESETS[presetName].story : ["Fixed n: the number of trials is set in advance", "Success/Failure: each trial has exactly two outcomes", "Equal p: the same probability of success on every trial", "Independence: no trial affects another"];
    const title = el("div", "stat-label", "The four binomial conditions for this story: tick each one you can justify"), list = el("div", "oop-controls"), verdict = el("div", "math-line");
    const flags = [false, false, false, false];
    const paint = () => { const k = flags.filter(Boolean).length; verdict.innerHTML = k === 4 ? "<b>All four hold: X is binomial.</b>" : `${k} of 4 ticked: the binomial formula needs all four.`; };
    story.forEach((s, i) => list.append(toggle(s, false, (v) => { flags[i] = v; paint(); }).row));
    paint();
    checks.append(title, list, verdict);
  }
  function draw() {
    n = clampInt(n, 1, 1000, 50); fn.set(n);
    const pv = fracVal(p);
    fx2.row.style.display = op === "between" ? "" : "none";
    if (!(pv >= 0 && pv <= 1)) { formula.innerHTML = `<span class="prob2-bad">p must be between 0 and 1 (a decimal or a fraction like 1/6).</span>`; out.innerHTML = ""; code.textContent = ""; return; }
    x = clampInt(x, 0, n, 0); fx.set(x);
    x2 = clampInt(x2, x, n, n); fx2.set(x2);
    const pmf = Array.from({ length: n + 1 }, (_, k) => dbinom(k, n, pv));
    const q = 1 - pv, ps = paren(pStr(p, pv)), qs = paren(qStr(p, pv));
    const mu = n * pv, sig = Math.sqrt(n * pv * q);
    let hit, head, work, value;
    if (op === "eq") {
      hit = new Set([x]); value = pmf[x];
      head = `P(X = ${x}) = C(${n}, ${x}) · ${ps}<sup>${x}</sup> · ${qs}<sup>${n - x}</sup>`;
      work = `= ${big(combB(n, x))} × ${sci(pv ** x)} × ${sci(q ** (n - x))}`;
    } else if (op === "le") {
      hit = new Set(Array.from({ length: x + 1 }, (_, k) => k)); value = sumTo(pmf, 0, x);
      const t = sumTerms(pmf, 0, x); head = `P(X ≤ ${x}) = ${t.names}`; work = `= ${t.vals}`;
    } else if (op === "ge") {
      hit = new Set(Array.from({ length: n - x + 1 }, (_, k) => x + k)); value = sumTo(pmf, x, n);
      if (x === 0) { head = `P(X ≥ 0) = 1`; work = "= every outcome"; }
      else if (x <= 4) { const t = sumTerms(pmf, 0, x - 1); head = `P(X ≥ ${x}) = 1 − ${t.names.replace(/ \+ /g, " − ")}`; work = `= 1 − ${t.vals.replace(/ \+ /g, " − ")}`; }
      else { head = `P(X ≥ ${x}) = 1 − P(X ≤ ${x - 1})`; work = `= 1 − ${p4(sumTo(pmf, 0, x - 1))}`; }
    } else {
      hit = new Set(Array.from({ length: x2 - x + 1 }, (_, k) => x + k)); value = sumTo(pmf, x, x2);
      const t = sumTerms(pmf, x, x2); head = `P(${x} ≤ X ≤ ${x2}) = ${t.names}`; work = `= ${t.vals}`;
    }
    formula.innerHTML = `${head} ${work} = <b>${p4(value)}</b>`;
    barChart(svg, pmf.map((_, k) => k), [{ v: pmf }], hit, { xlab: `${xlab}, n = ${n}, p = ${pStr(p, pv)}` });
    tableWrap.innerHTML = "";
    if (n <= 12) tableWrap.innerHTML = `<table class="group-table"><tbody><tr><th>x</th>${pmf.map((_, k) => `<td${hit.has(k) ? ' class="prob2-hit"' : ""}>${k}</td>`).join("")}</tr><tr><th>P(x)</th>${pmf.map((v, k) => `<td${hit.has(k) ? ' class="prob2-hit"' : ""}>${p4(v)}</td>`).join("")}</tr></tbody></table>`;
    grid(out, [
      [`P(X = ${x})`, p4(pmf[x]), rfmt(pmf[x])], [`P(X ≤ ${x})`, p4(sumTo(pmf, 0, x)), "cumulative"], [`P(X ≥ ${x})`, p4(sumTo(pmf, x, n)), x > 0 ? `1 − P(X ≤ ${x - 1})` : "everything"],
      ["μ = np", `${n}(${pStr(p, pv)}) = <b>${num(mu, 2)}</b>`], ["σ = √(npq)", `√(${n}(${pStr(p, pv)})(${qStr(p, pv)})) = √${num(n * pv * q, 4)} = <b>${num(sig, 2)}</b>`, `σ² = npq = ${num(n * pv * q, 2)}`],
      ...(sig > 0 ? zRows(x, mu, sig, pmf) : []),
    ]);
    const pr = fracParts(p) ? p.replace(/\s+/g, "") : fmtNum(pv, 4);
    const lines = [
      [`dbinom(${x}, ${n}, ${pr})`, `P(X = ${x}) = ${rfmt(pmf[x])}`, op === "eq"],
      [`pbinom(${x}, ${n}, ${pr})`, `P(X <= ${x}) = ${rfmt(sumTo(pmf, 0, x))}`, op === "le"],
      [`1 - pbinom(${x - 1}, ${n}, ${pr})`, `P(X >= ${x}) = ${rfmt(sumTo(pmf, x, n))}`, op === "ge"],
    ];
    if (op === "between") lines.push([`pbinom(${x2}, ${n}, ${pr}) - pbinom(${x - 1}, ${n}, ${pr})`, `P(${x} <= X <= ${x2}) = ${rfmt(value)}`, true]);
    if (op === "eq") lines.unshift([`choose(${n}, ${x}) * ${pr.includes("/") ? `(${pr})` : pr}^${x} * ${qs.includes("/") ? qs : fmtNum(q, 4)}^${n - x}`, `by hand: ${rfmt(pmf[x])}`, false]);
    code.innerHTML = lines.map(([c, cm, sel]) => `${sel ? "<b>" : ""}${c.padEnd(44)}# ${cm}${sel ? "</b>" : ""}`).join("\n") + `\nmu <- ${n} * ${pr}; sig <- sqrt(${n} * ${pr} * (1 - ${pr}))   # ${rfmt(mu)} ${rfmt(sig)}\nZ <- (${x} - mu) / sig                 # ${rfmt((x - mu) / sig)}`;
  }
  buildChecklist();
  draw();
}

// ---------- widget: hyper-vs-binom ----------
const HYP_PRESETS = {
  "jacks in 5 cards": { N: 52, K: 4, n: 5, x: 2, xlab: "X = number of jacks in 5 cards", about: "p. 65: 5 cards from one deck, 4 jacks. Slide the decks to 10 for the superdeck (N = 520, K = 40): n/N drops from 9.6 % to 0.96 % and the two answers close up." },
  "Mac users (N = 90)": { N: 90, K: 40, n: 10, x: 4, zx: 8, xlab: "X = Mac users in a sample of 10", about: "pp. 66–67: a class of 90 with 40 Mac users, a sample of 10. n/N = 11 % fails the 5 % rule, so the binomial is not a good stand-in. Is X = 8 unusual?" },
  "castings (N = 200, K = 5)": { N: 200, K: 5, n: 3, x: 1, xlab: "X = defective castings among 3", about: "Practice Problem 12: 200 castings with 5 defective, three chosen without replacement. n/N = 1.5 % passes the 5 % rule, so the binomial with p = 5/200 is close." },
};
function hyperVsBinom(box, cfg) {
  box.append(el("h4", null, cfg.title || "Hypergeometric (without replacement) against binomial (with replacement)"));
  const names = Object.keys(HYP_PRESETS);
  let presetName = HYP_PRESETS[cfg.preset] ? cfg.preset : null;
  const base = presetName ? HYP_PRESETS[presetName] : {};
  let N0 = cfg.N ?? base.N ?? 52, K0 = cfg.K ?? base.K ?? 4, n = cfg.n ?? base.n ?? 5, x = cfg.x ?? base.x ?? 2, zx = cfg.zx ?? base.zx ?? x, decks = cfg.decks ?? 1;
  let xlab = base.xlab || "x";
  box.append(note("N objects, K of them successes, a sample of n without replacement, X = successes in the sample. The binomial pretends each draw is replaced (p = K/N). When n is at most 5 % of N the two agree closely."));
  const about = el("p", "widget-note");
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { presetName = names[i]; const b = HYP_PRESETS[presetName]; N0 = b.N; K0 = b.K; n = b.n; x = b.x; zx = b.zx ?? b.x; decks = 1; xlab = b.xlab; sync(); draw(); }, names.indexOf(presetName)));
  const fN = numField("N (population)", N0, (v) => { N0 = v; decks = 1; sl.set(1); draw(); }), fK = numField("K (successes in N)", K0, (v) => { K0 = v; decks = 1; sl.set(1); draw(); });
  const fn = numField("n (sample)", n, (v) => { n = v; draw(); }), fx = numField("x", x, (v) => { x = v; draw(); }), fz = numField("unusual? X =", zx, (v) => { zx = v; draw(); });
  const sl = sliderRow("decks (× N and K)", 1, 10, 1, decks, (v) => { decks = v; draw(); }, (v) => `× ${v}`);
  const inputs = el("div", "unit-row"); inputs.append(fN.row, fK.row, fn.row, fx.row, fz.row);
  const formula = el("div"), svg = svgEl("svg", { viewBox: "0 0 640 216", class: "curve-svg net-svg" });
  const tableWrap = el("div", "table-wrap"), out = el("div", "stat-grid"), code = rcode("");
  box.append(about, inputs, sl.row, formula, svg, tableWrap, out, code);
  function sync() { fN.set(N0); fK.set(K0); fn.set(n); fx.set(x); fz.set(zx); sl.set(decks); }
  function draw() {
    about.textContent = presetName ? HYP_PRESETS[presetName].about : "";
    N0 = clampInt(N0, 1, 100000, 52); K0 = clampInt(K0, 0, N0, Math.min(4, N0));
    const N = N0 * decks, K = K0 * decks;
    n = clampInt(n, 1, Math.min(N, 500), Math.min(5, N)); x = clampInt(x, 0, n, 0); zx = clampInt(zx, 0, n, x);
    fN.set(N0); fK.set(K0); fn.set(n); fx.set(x); fz.set(zx);
    const p = K / N, q = 1 - p;
    const hyper = Array.from({ length: n + 1 }, (_, k) => dhyper(k, K, N, n)), binom = Array.from({ length: n + 1 }, (_, k) => dbinom(k, n, p));
    const ratio = n / N, ok5 = ratio <= 0.05;
    const mu = n * p, corr = Math.sqrt((N - n) / (N - 1)), sigB = Math.sqrt(n * p * q), sigH = sigB * corr;
    const Nlab = decks > 1 ? `${N0} × ${decks} = ${N}` : String(N), Klab = decks > 1 ? `${K0} × ${decks} = ${K}` : String(K);
    formula.innerHTML = "";
    const f1 = el("div", "prob-formula"); f1.innerHTML = `Hypergeometric: P(X = ${x}) = C(${K}, ${x}) · C(${N - K}, ${n - x}) / C(${N}, ${n}) = ${big(combB(K, x))} × ${big(combB(N - K, n - x))} / ${big(combB(N, n))} = <b>${p4(hyper[x])}</b>`;
    const f2 = el("div", "prob-formula"); f2.innerHTML = `Binomial with p = K/N = ${K}/${N} = ${fmtNum(p, 4)}: P(X = ${x}) = C(${n}, ${x}) · ${fmtNum(p, 4)}<sup>${x}</sup> · ${fmtNum(q, 4)}<sup>${n - x}</sup> = <b>${p4(binom[x])}</b>`;
    const t = sumTerms(hyper, 0, x);
    const f3 = mathLine(`P(X ≤ ${x}) = ${t.names} = ${t.vals} = <b>${p4(sumTo(hyper, 0, x))}</b> (hypergeometric; binomial ${p4(sumTo(binom, 0, x))})`);
    formula.append(f1, f2, f3);
    barChart(svg, hyper.map((_, k) => k), [{ v: hyper }, { v: binom, outline: true, stroke: "var(--green)" }], new Set([x]), { xlab: `${xlab}: N = ${N}, K = ${K}, n = ${n}`, legend: [["hypergeometric", "var(--blue)"], ["binomial, p = K/N", "var(--green)", true]] });
    tableWrap.innerHTML = n <= 12 ? `<table class="group-table"><tbody><tr><th>x</th>${hyper.map((_, k) => `<td${k === x ? ' class="prob2-hit"' : ""}>${k}</td>`).join("")}</tr><tr><th>hypergeometric</th>${hyper.map((v, k) => `<td${k === x ? ' class="prob2-hit"' : ""}>${p4(v)}</td>`).join("")}</tr><tr><th>binomial</th>${binom.map((v) => `<td>${p4(v)}</td>`).join("")}</tr></tbody></table>` : "";
    grid(out, [
      ["n / N (the 5 % rule)", `${n}/${N} = <b>${fmtNum(100 * ratio, 2)} %</b>`, ok5 ? "5 % or less: the binomial is practically the same" : "more than 5 %: use the hypergeometric; the binomial is not a good stand-in"],
      ["N, K", `N = ${Nlab}; K = ${Klab}`, `failures N − K = ${N - K}`],
      ["μ = n · K/N", `${n} × ${K}/${N} = <b>${num(mu, 2)}</b>`, "the same for both models"],
      ["σ hypergeometric", `√(${n} · ${fmtNum(p, 4)} · ${fmtNum(q, 4)} · ${N - n}/${N - 1}) = <b>${num(sigH, 2)}</b>`, `σ² = ${num(sigH * sigH, 4)}`],
      ["σ binomial = √(npq)", `<b>${num(sigB, 2)}</b>`, `correction factor √((N − n)/(N − 1)) = ${fmtNum(corr, 3)}: without replacement spreads less`],
      ...(sigH > 0 ? zRows(zx, mu, sigH, hyper, "X") : []),
    ]);
    code.innerHTML = [
      `<b>dhyper(${x}, ${K}, ${N - K}, ${n})`.padEnd(47) + `# successes, failures, draws: ${rfmt(hyper[x])}</b>`,
      `phyper(${x}, ${K}, ${N - K}, ${n})`.padEnd(44) + `# P(X <= ${x}) = ${rfmt(sumTo(hyper, 0, x))}`,
      `dbinom(${x}, ${n}, ${K}/${N})`.padEnd(44) + `# with replacement: ${rfmt(binom[x])}`,
      `choose(${K}, ${x}) * choose(${N - K}, ${n - x}) / choose(${N}, ${n})`.padEnd(44) + `# by hand: ${rfmt(hyper[x])}`,
      `mu <- ${n} * ${K}/${N}; sig <- sqrt(${n} * p * (1 - p) * (${N} - ${n})/(${N} - 1))   # ${rfmt(mu)} ${rfmt(sigH)}`,
      `Z <- (${zx} - mu) / sig`.padEnd(44) + `# ${rfmt((zx - mu) / sigH)}`,
    ].join("\n");
  }
  draw();
}
/** slider() from dom.js with a set() that also updates the label. */
function sliderRow(label, min, max, step, value, onChange, fmt) {
  const row = el("div", "slider-row");
  const input = document.createElement("input");
  input.type = "range"; input.min = min; input.max = max; input.step = step; input.value = value; input.setAttribute("aria-label", label);
  const val = el("span", "val", fmt(value));
  input.addEventListener("input", () => { val.textContent = fmt(parseFloat(input.value)); onChange(parseFloat(input.value)); });
  row.append(el("label", null, label), input, val);
  return { row, input, set: (v) => { input.value = v; val.textContent = fmt(v); } };
}

// ---------- widget: geometric-calc ----------
const GEO_PRESETS = {
  "help line (p = 0.25)": { p: "0.25", x: 3, xlab: "X = calls until you get through", about: "p. 68: the line is busy 75 % of the time, so each call succeeds with p = 0.25. Third call is the first success: failure, failure, success." },
  "roll a 6": { p: "1/6", x: 3, xlab: "X = rolls until the first 6", about: "Each roll succeeds with p = 1/6. The first 6 on the third roll means two non-6s then a 6." },
  "expert shot misses (p = 0.05)": { p: "0.05", x: 15, xlab: "X = shot of the first miss", about: "Practice Problem 23: the expert hits 95 % of shots, so a miss is the 'success' with p = 0.05. First miss on the 15th shot: 0.95¹⁴ × 0.05." },
};
function geometricCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Geometric: trials until the first success, P(X = x) = q^(x − 1) p"));
  const names = Object.keys(GEO_PRESETS);
  let presetName = GEO_PRESETS[cfg.preset] ? cfg.preset : null;
  const base = presetName ? GEO_PRESETS[presetName] : {};
  let p = String(cfg.p ?? base.p ?? "0.25"), x = cfg.x ?? base.x ?? 3, xlab = base.xlab || "x";
  box.append(note("Every trial succeeds with probability p; X = the number of the trial on which the first success arrives (1, 2, 3, …). x − 1 failures then one success. R counts the failures, so its argument is x − 1."));
  const about = el("p", "widget-note");
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { presetName = names[i]; const b = GEO_PRESETS[presetName]; p = b.p; x = b.x; xlab = b.xlab; fp.set(p); fx.set(x); draw(); }, names.indexOf(presetName)));
  const fp = fracField("p (success)", p, () => { p = fp.raw(); draw(); }), fx = numField("x (trial of the first success)", x, (v) => { x = v; draw(); });
  const inputs = el("div", "unit-row"); inputs.append(fp.row, fx.row);
  const chain = svgEl("svg", { viewBox: "0 0 640 78", class: "curve-svg net-svg" }), formula = el("div", "prob-formula");
  const svg = svgEl("svg", { viewBox: "0 0 640 216", class: "curve-svg net-svg" }), out = el("div", "stat-grid"), code = rcode("");
  box.append(about, inputs, chain, formula, svg, out, code);
  function draw() {
    about.textContent = presetName ? GEO_PRESETS[presetName].about : "";
    const pv = fracVal(p);
    if (!(pv > 0 && pv <= 1)) { formula.innerHTML = `<span class="prob2-bad">p must be between 0 and 1 (exclusive of 0).</span>`; chain.innerHTML = ""; out.innerHTML = ""; code.textContent = ""; return; }
    x = clampInt(x, 1, 200, 3); fx.set(x);
    const q = 1 - pv, ps = paren(pStr(p, pv)), qs = paren(qStr(p, pv));
    const px = q ** (x - 1) * pv, mu = 1 / pv, v = q / (pv * pv), sig = Math.sqrt(v);
    // the failure … success chain
    chain.innerHTML = "";
    const ell = x > 10, shown = ell ? 9 : x;
    const bw = 54, gap = 6, total = shown * (bw + gap) + (ell ? 30 : 0), x0 = Math.max(10, (640 - total) / 2);
    let cx = x0;
    for (let i = 1; i <= shown; i++) {
      const last = i === shown, isS = last;
      if (ell && i === shown - 1) { chain.append(svgEl("text", { x: cx + 12, y: 40, "font-size": 14, fill: "var(--ink-dim)" }, "…")); cx += 30; }
      chain.append(svgEl("rect", { x: cx, y: 14, width: bw, height: 40, rx: 6, fill: isS ? "var(--green-soft)" : "var(--red-soft)", stroke: isS ? "var(--green)" : "var(--red)", "stroke-width": 1.6 }));
      chain.append(svgEl("text", { x: cx + bw / 2, y: 32, "text-anchor": "middle", "font-size": 12, "font-weight": "600", fill: isS ? "var(--green)" : "var(--red)" }, isS ? "S: p" : "F: q"));
      chain.append(svgEl("text", { x: cx + bw / 2, y: 48, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, isS ? fmtNum(pv, 4) : fmtNum(q, 4)));
      chain.append(svgEl("text", { x: cx + bw / 2, y: 70, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `trial ${ell && last ? x : ell && i === shown - 1 ? x - 1 : i}`));
      cx += bw + gap;
    }
    const prod = x - 1 <= 4 ? Array(x - 1).fill(qs).concat(ps).join(" · ") : `${qs}<sup>${x - 1}</sup> · ${ps}`;
    formula.innerHTML = `P(X = ${x}) = ${prod}${x - 1 >= 2 && x - 1 <= 4 ? ` = ${qs}<sup>${x - 1}</sup> · ${ps}` : ""} = ${sci(q ** (x - 1))} × ${fmtNum(pv, 4)} = <b>${p4(px)}</b>`;
    const top = Math.min(60, Math.max(15, x + 2));
    const pmf = Array.from({ length: top + 1 }, (_, k) => (k === 0 ? 0 : q ** (k - 1) * pv));
    barChart(svg, pmf.slice(1).map((_, k) => k + 1), [{ v: pmf.slice(1) }], new Set([x - 1]), { xlab: `${xlab}, p = ${pStr(p, pv)}` });
    const geTerms = x <= 4 ? `1 − ${Array.from({ length: x }, (_, k) => `P(${k + 1})`).join(" − ")} = 1 − ${Array.from({ length: x }, (_, k) => p4(pmf[k + 1])).join(" − ")} = ` : "";
    grid(out, [
      [`P(X = ${x}) = q<sup>x − 1</sup> p`, p4(px), rfmt(px)],
      [`P(X ≤ ${x}) = 1 − q<sup>x</sup>`, p4(1 - q ** x), `1 − ${fmtNum(q, 4)}<sup>${x}</sup>: the first success came by trial ${x}`],
      [`P(X ≥ ${x}) = q<sup>x − 1</sup>`, p4(q ** (x - 1)), `the first ${x - 1} trial${x - 1 === 1 ? "" : "s"} all fail`],
      [`P(X > ${x}) = P(X ≥ ${x + 1}) = q<sup>x</sup>`, p4(q ** x), `${geTerms}${fmtNum(q, 4)}<sup>${x}</sup>`],
      ["μ = 1/p", `1/${pStr(p, pv)} = <b>${num(mu, 2)}</b>`, "trials expected until the first success"],
      ["σ = √((1 − p)/p²)", `√(${qStr(p, pv)}/${pStr(p, pv)}²) = √${num(v, 2)} = <b>${num(sig, 2)}</b>`, "the mode is always 1 even though the mean is 1/p"],
    ]);
    const pr = fracParts(p) ? p.replace(/\s+/g, "") : fmtNum(pv, 4);
    code.innerHTML = [
      `<b>dgeom(${x - 1}, ${pr})</b>`.padEnd(45) + `# P(X = ${x}): R wants the failures before the success, x − 1 = <b>${x - 1}</b>: ${rfmt(px)}`,
      `<b>pgeom(${x - 1}, ${pr})</b>`.padEnd(45) + `# P(X <= ${x}) = ${rfmt(1 - q ** x)}`,
      `1 - pgeom(${x - 1}, ${pr})`.padEnd(38) + `# P(X > ${x}) = P(X >= ${x + 1}) = ${rfmt(q ** x)}`,
      `${qs.includes("/") ? `(${qStr(p, pv)})` : fmtNum(q, 4)}^${x - 1} * ${pr}`.padEnd(38) + `# by hand: ${rfmt(px)}`,
      `mu <- 1/${pr}; sig <- sqrt((1 - ${pr})/${pr}^2)`.padEnd(38) + `# ${rfmt(mu)} ${rfmt(sig)}`,
    ].join("\n");
  }
  draw();
}

// ---------- widget: poisson-calc ----------
const POI_PRESETS = {
  "web server": { rate: 1, per: 2, unit: "s", interval: 60, x: 20, op: "eq", xlab: "X = requests in one minute", about: "p. 72: one request every 2 s on average. Over a one-minute interval λ = 60/2 = 30. Is 20 requests in a minute unusual?" },
  "CPU jobs (4 per second)": { rate: 4, per: 1, unit: "s", interval: 1, x: 8, op: "ge", xlab: "X = jobs arriving in one second", about: "p. 71: jobs arriving for service at a CPU, 4 per second on average. P(8 or more in a second)?" },
  "bit errors (3 per minute)": { rate: 3, per: 1, unit: "min", interval: 1, x: 0, op: "eq", xlab: "X = bit errors in one minute", about: "p. 71: bits arriving in error at a network node, 3 per minute on average. P(an error-free minute) = e^(−3)." },
};
const POI_UNITS = ["s", "min", "h", "day", "page", "km"];
const POI_OPS = ["eq", "le", "ge"];
function poissonCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Poisson: counts in an interval, P(x) = λ^x e^(−λ) / x!"));
  const names = Object.keys(POI_PRESETS);
  let presetName = POI_PRESETS[cfg.preset] ? cfg.preset : null;
  const base = presetName ? POI_PRESETS[presetName] : {};
  let rate = cfg.rate ?? base.rate ?? 1, per = cfg.per ?? base.per ?? 2, unit = POI_UNITS.includes(cfg.unit) ? cfg.unit : base.unit || "s", interval = cfg.interval ?? base.interval ?? 60;
  let x = cfg.x ?? base.x ?? 20, op = POI_OPS.includes(cfg.op) ? cfg.op : base.op || "eq", xlab = base.xlab || "x";
  box.append(note("Events happen randomly and independently at a known average rate. First rescale that rate to the interval in the question: λ = mean count in the interval. Then μ = λ and σ = √λ."));
  const about = el("p", "widget-note");
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { presetName = names[i]; const b = POI_PRESETS[presetName]; ({ rate, per, unit, interval, x, op, xlab } = b); fRate.set(rate); fPer.set(per); sel.value = unit; fInt.set(interval); fx.set(x); opRow.querySelectorAll("button")[POI_OPS.indexOf(op)].click(); }, names.indexOf(presetName)));
  const fRate = numField("events", rate, (v) => { rate = v; draw(); }, "any"), fPer = numField("per", per, (v) => { per = v; draw(); }, "any");
  const sel = document.createElement("select"); sel.setAttribute("aria-label", "time unit");
  for (const u of POI_UNITS) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === unit) o.selected = true; sel.append(o); }
  sel.addEventListener("change", () => { unit = sel.value; draw(); });
  fPer.row.append(sel);
  const fInt = numField("interval length", interval, (v) => { interval = v; draw(); }, "any"), fx = numField("x", x, (v) => { x = v; draw(); });
  const unitLab = el("span", "stat-label", unit); fInt.row.append(unitLab);
  const composer = el("div", "unit-row"); composer.append(fRate.row, fPer.row, fInt.row, fx.row);
  const opRow = btnRow(["P(X = x)", "P(X ≤ x)", "P(X ≥ x)"], (i) => { op = POI_OPS[i]; draw(); }, POI_OPS.indexOf(op));
  const lam = el("div", "prob-formula"), formula = el("div", "prob-formula"), svg = svgEl("svg", { viewBox: "0 0 640 216", class: "curve-svg net-svg" }), out = el("div", "stat-grid"), code = rcode("");
  box.append(about, composer, opRow, lam, formula, svg, out, code);
  function draw() {
    about.textContent = presetName ? POI_PRESETS[presetName].about : "";
    unitLab.textContent = unit;
    if (!(rate >= 0) || !(per > 0) || !(interval >= 0)) { lam.innerHTML = `<span class="prob2-bad">The rate needs events ≥ 0, per > 0 and an interval ≥ 0.</span>`; formula.innerHTML = ""; out.innerHTML = ""; code.textContent = ""; return; }
    const L = (rate / per) * interval;
    if (L > 2000) { lam.innerHTML = `<span class="prob2-bad">λ = ${num(L, 2)} is too large to chart; shorten the interval.</span>`; return; }
    lam.innerHTML = `λ = ${num(rate, 4)} per ${per === 1 ? "" : `${num(per, 4)} `}${unit} × ${num(interval, 4)} ${unit} = ${rate === 1 && per !== 1 ? `${num(interval, 4)}/${num(per, 4)} = ` : ""}<b>${num(L, 4)}</b> expected in the interval`;
    const top = Math.max(10, Math.ceil(L + 4 * Math.sqrt(L)));
    x = clampInt(x, 0, Math.max(top, 2000), 0); fx.set(x);
    const pmf = Array.from({ length: Math.max(top, x) + 1 }, (_, k) => dpois(k, L));
    const sig = Math.sqrt(L);
    let hit, head, value;
    if (op === "eq") { hit = new Set([x]); value = pmf[x]; head = `P(X = ${x}) = ${num(L, 4)}<sup>${x}</sup> / ${x}! × e<sup>−${num(L, 4)}</sup> = ${sci(L ** x)} / ${sci(Math.exp(lnfact(x)))} × ${sci(Math.exp(-L))}`; }
    else if (op === "le") { hit = new Set(Array.from({ length: x + 1 }, (_, k) => k)); value = sumTo(pmf, 0, x); const t = sumTerms(pmf, 0, x); head = `P(X ≤ ${x}) = ${t.names} = ${t.vals}`; }
    else { hit = new Set(Array.from({ length: pmf.length - x }, (_, k) => x + k)); value = 1 - sumTo(pmf, 0, x - 1); head = x === 0 ? "P(X ≥ 0) = 1" : x <= 4 ? `P(X ≥ ${x}) = 1 − ${sumTerms(pmf, 0, x - 1).names.replace(/ \+ /g, " − ")} = 1 − ${sumTerms(pmf, 0, x - 1).vals.replace(/ \+ /g, " − ")}` : `P(X ≥ ${x}) = 1 − P(X ≤ ${x - 1}) = 1 − ${p4(sumTo(pmf, 0, x - 1))}`; }
    formula.innerHTML = `${head} = <b>${p4(value)}</b>`;
    barChart(svg, pmf.slice(0, top + 1).map((_, k) => k), [{ v: pmf.slice(0, top + 1) }], hit, { xlab: `${xlab}, λ = ${num(L, 4)}` });
    const tailRows = sig > 0 ? zRows(x, L, sig, pmf) : [];
    grid(out, [
      [`P(X = ${x})`, p4(pmf[x]), rfmt(pmf[x])], [`P(X ≤ ${x})`, p4(sumTo(pmf, 0, x)), "cumulative"], [`P(X ≥ ${x})`, p4(1 - sumTo(pmf, 0, x - 1)), x > 0 ? `1 − P(X ≤ ${x - 1})` : "everything"],
      ["μ = λ", `<b>${num(L, 2)}</b>`], ["σ = √λ", `√${num(L, 4)} = <b>${num(sig, 2)}</b>`, `σ² = λ = ${num(L, 2)}`],
      ...tailRows,
    ]);
    const lamR = `lambda <- ${num(rate, 4).replace(" ", "")}/${num(per, 4)} * ${num(interval, 4).replace(" ", "")}`;
    code.innerHTML = [
      `${lamR}`.padEnd(40) + `# ${rfmt(L)} per interval`,
      `${op === "eq" ? "<b>" : ""}dpois(${x}, lambda)`.padEnd(40 + (op === "eq" ? 3 : 0)) + `# P(X = ${x}) = ${rfmt(pmf[x])}${op === "eq" ? "</b>" : ""}`,
      `${op === "le" ? "<b>" : ""}ppois(${x}, lambda)`.padEnd(40 + (op === "le" ? 3 : 0)) + `# P(X <= ${x}) = ${rfmt(sumTo(pmf, 0, x))}${op === "le" ? "</b>" : ""}`,
      `${op === "ge" ? "<b>" : ""}1 - ppois(${x - 1}, lambda)`.padEnd(40 + (op === "ge" ? 3 : 0)) + `# P(X >= ${x}) = ${rfmt(1 - sumTo(pmf, 0, x - 1))}${op === "ge" ? "</b>" : ""}`,
      `lambda^${x} / factorial(${x}) * exp(-lambda)`.padEnd(40) + `# by hand: ${rfmt(pmf[x])}`,
      `mu <- lambda; sig <- sqrt(lambda)`.padEnd(40) + `# ${rfmt(L)} ${rfmt(sig)}`,
      `Z <- (${x} - mu) / sig`.padEnd(40) + `# ${rfmt((x - L) / sig)}`,
    ].join("\n");
  }
  draw();
}

// ---------- widget: dist-picker ----------
const DIST = {
  binomial: { name: "Binomial", X: "X = number of successes in n independent trials, each with the same p", formula: "P(x) = C(n, x) p^x q^(n − x)", mu: "μ = np", sigma: "σ = √(npq)", r: "dbinom(x, n, p)   pbinom(x, n, p)" },
  hypergeometric: { name: "Hypergeometric", X: "X = number of successes in a sample of n drawn without replacement from N with K successes", formula: "P(x) = C(K, x) C(N − K, n − x) / C(N, n)", mu: "μ = nK/N", sigma: "σ = √(n (K/N)((N − K)/N)((N − n)/(N − 1)))", r: "dhyper(x, K, N-K, n)   phyper(x, K, N-K, n)" },
  geometric: { name: "Geometric", X: "X = the trial on which the first success occurs", formula: "P(X = x) = q^(x − 1) p", mu: "μ = 1/p", sigma: "σ = √((1 − p)/p²)", r: "dgeom(x-1, p)   pgeom(x-1, p)" },
  poisson: { name: "Poisson", X: "X = number of events in an interval with mean λ", formula: "P(x) = λ^x e^(−λ) / x!", mu: "μ = λ", sigma: "σ = √λ", r: "dpois(x, lambda)   ppois(x, lambda)" },
  table: { name: "No named distribution: build the table", X: "X from a table, a histogram or the sample space", formula: "P(x) counted or given for each x", mu: "μ = Σ x P(x)", sigma: "σ = √(Σ (x − μ)² P(x))", r: "mu <- sum(x * p); sig <- sqrt(sum((x - mu)^2 * p))" },
};
const DIST_ORDER = ["binomial", "hypergeometric", "geometric", "poisson", "table"];
const PICK_Q = [
  { q: "Is X the number of successes in a fixed number n of trials?", yes: 1, no: 2 },
  { q: "Is each trial's p the same: sampling with replacement, an infinite population, or n at most 5 % of N?", yes: "binomial", no: "hypergeometric" },
  { q: "Is X the number of trials up to and including the first success?", yes: "geometric", no: 3 },
  { q: "Is X a count of events in a time or space interval with a known mean rate λ?", yes: "poisson", no: "table" },
];
const SCENARIOS = {
  lecture: [
    { text: "50 online shoppers visit in an hour; each completes a sale with probability 0.25. X = number of sales.", ans: "binomial", why: "fixed n = 50, two outcomes, the same p, independent visitors" },
    { text: "A fair die is rolled 5 times. X = the number of 3s.", ans: "binomial", why: "n = 5 rolls, p = 1/6 each time" },
    { text: "Five cards are drawn with replacement. X = the number of jacks.", ans: "binomial", why: "replacement keeps p = 4/52 on every draw" },
    { text: "Five cards are drawn from one deck without replacement. X = the number of jacks.", ans: "hypergeometric", why: "without replacement and n/N = 5/52 = 9.6 % > 5 %" },
    { text: "A class of 90 has 40 Mac users; 10 students are sampled. X = Mac users in the sample.", ans: "hypergeometric", why: "without replacement, n/N = 11 %" },
    { text: "A help line is busy 75 % of the time. X = the number of calls until you get through.", ans: "geometric", why: "trials until the first success, p = 0.25" },
    { text: "A web server gets one request every 2 s on average. X = requests in one minute.", ans: "poisson", why: "events in an interval, λ = 30 per minute" },
    { text: "X = the number of children of a randomly chosen Canadian (the 2023 StatCan table).", ans: "table", why: "no trials, no rate: μ and σ come from Σ x P(x)" },
  ],
  practice: [
    { text: "An expert marksman hits 95 % of shots. X = the shot on which the first miss occurs (Practice Problem 23).", ans: "geometric", why: "trials until the first 'success' (a miss), p = 0.05: P(15) = 0.95¹⁴ × 0.05" },
    { text: "Ten 4-choice questions are answered by guessing. X = the number right (Practice Problem 25).", ans: "binomial", why: "n = 10, p = 0.25, independent guesses: P(0) = 0.75¹⁰" },
    { text: "200 castings include 5 defective ones; three are chosen without replacement. X = defective castings chosen.", ans: "hypergeometric", why: "without replacement from a finite lot (though n/N = 1.5 % would also allow the binomial)" },
    { text: "200 modified printers; each needs repair in its first year with probability 0.10. X = printers needing repair.", ans: "binomial", why: "n = 200, p = 0.10, printers independent" },
    { text: "Bits arrive in error at a network node at 3 per minute on average. X = errors in a given minute.", ans: "poisson", why: "a count per interval with λ = 3" },
    { text: "Jobs arrive at a CPU at 4 per second on average. X = jobs arriving in one second.", ans: "poisson", why: "a count per interval with λ = 4" },
    { text: "Two dice are rolled. X = the smaller of the two values.", ans: "table", why: "count the 36 cells: P(x) = (13 − 2x)/36" },
    { text: "24 batteries, 6 defective; three are sampled without replacement. X = defective batteries in the sample.", ans: "hypergeometric", why: "without replacement, n/N = 12.5 %" },
  ],
};
function distPicker(box, cfg) {
  box.append(el("h4", null, cfg.title || "Which distribution? Four questions, then eight scenarios"));
  box.append(note("Answer the questions in order; the distribution with its formula, μ, σ and R call appears when the answers decide it. Then classify each scenario and press Check."));
  const qBox = el("div"), result = el("div", "stat-grid"), resultNote = el("div", "stat-steps");
  box.append(qBox, result, resultNote);
  const answers = [null, null, null, null];
  function drawQ() {
    qBox.innerHTML = "";
    let i = 0, verdict = null;
    while (typeof i === "number") {
      const Q = PICK_Q[i], idx = i;
      const row = el("div", "unit-row");
      const lab = el("span", "stat-label", `${idx + 1}. ${Q.q}`); lab.style.flex = "1 1 320px";
      const yes = el("button", "viz-btn" + (answers[idx] === true ? " active" : ""), "yes"), no = el("button", "viz-btn" + (answers[idx] === false ? " active" : ""), "no");
      yes.addEventListener("click", () => { answers[idx] = true; for (let k = idx + 1; k < 4; k++) answers[k] = null; drawQ(); });
      no.addEventListener("click", () => { answers[idx] = false; for (let k = idx + 1; k < 4; k++) answers[k] = null; drawQ(); });
      row.append(lab, yes, no); qBox.append(row);
      if (answers[idx] == null) { i = null; break; }
      const next = answers[idx] ? Q.yes : Q.no;
      if (typeof next === "string") { verdict = next; i = null; } else i = next;
    }
    const reset = el("button", "viz-btn", "start over"); reset.addEventListener("click", () => { answers.fill(null); drawQ(); });
    qBox.append(reset);
    if (!verdict) { result.innerHTML = ""; resultNote.innerHTML = ""; return; }
    const d = DIST[verdict];
    grid(result, [["distribution", `<b>${d.name}</b>`, d.X], ["P(x)", d.formula], ["μ", d.mu], ["σ", d.sigma], ["R", `<code>${d.r}</code>`]]);
    resultNote.innerHTML = verdict === "hypergeometric" ? `<div class="step final">Trials are dependent because each draw changes the mix left behind; if n were 5 % or less of N the binomial would be close enough.</div>`
      : verdict === "geometric" ? `<div class="step final">Possible values 1, 2, 3, …: x − 1 failures then the success. R's <code>dgeom</code> counts only the failures, so pass x − 1.</div>`
        : verdict === "poisson" ? `<div class="step final">Rescale the rate to the interval in the question first: λ must be the mean count for that interval.</div>`
          : verdict === "binomial" ? `<div class="step final">Check the four conditions: fixed n, success/failure, equal p, independence.</div>`
            : `<div class="step final">Without a named model, μ = Σ x P(x) and σ² = Σ (x − μ)² P(x) from the table (or simulate).</div>`;
  }
  drawQ();
  // scenarios
  const setName = SCENARIOS[cfg.scenarios] ? cfg.scenarios : "lecture";
  const list = SCENARIOS[setName];
  box.append(el("div", "stat-label", setName === "lecture" ? "Scenarios from the lecture examples" : "Scenarios from the practice problems and the Unit 4 stories"));
  const cards = el("div", "prob2-cards"), ctl = el("div", "viz-btn-row"), score = el("span", "encap-pduname");
  const check = el("button", "viz-btn", "Check"), reveal = el("button", "viz-btn", "Reveal"), clear = el("button", "viz-btn", "Clear");
  ctl.append(check, reveal, clear, score);
  box.append(cards, ctl);
  const items = list.map((s, i) => {
    const card = el("div", "prob2-card");
    card.append(el("div", null, s.text));
    const sel = document.createElement("select"); sel.className = "q-input"; sel.setAttribute("aria-label", `distribution for scenario ${i + 1}`);
    const o0 = document.createElement("option"); o0.value = ""; o0.textContent = "choose a distribution"; sel.append(o0);
    for (const k of DIST_ORDER) { const o = document.createElement("option"); o.value = k; o.textContent = k === "table" ? "none: table / Σ x P(x)" : DIST[k].name; sel.append(o); }
    const why = el("div", "why");
    sel.addEventListener("change", () => { card.classList.remove("ok", "bad"); why.textContent = ""; });
    card.append(sel, why); cards.append(card);
    return { s, card, sel, why };
  });
  check.addEventListener("click", () => {
    let good = 0, answered = 0;
    for (const it of items) {
      it.card.classList.remove("ok", "bad"); it.why.textContent = "";
      if (!it.sel.value) continue;
      answered++;
      const ok = it.sel.value === it.s.ans;
      it.card.classList.add(ok ? "ok" : "bad");
      if (ok) { good++; it.why.textContent = it.s.why; }
    }
    score.textContent = `${good} of ${items.length} correct (${answered} answered)`;
  });
  reveal.addEventListener("click", () => { for (const it of items) { it.sel.value = it.s.ans; it.card.classList.remove("bad"); it.card.classList.add("ok"); it.why.textContent = it.s.why; } score.textContent = "answers shown"; });
  clear.addEventListener("click", () => { for (const it of items) { it.sel.value = ""; it.card.classList.remove("ok", "bad"); it.why.textContent = ""; } score.textContent = ""; });
}

export const WIDGETS = {
  "pmf-table": pmfTable,
  "binomial-calc": binomialCalc,
  "hyper-vs-binom": hyperVsBinom,
  "geometric-calc": geometricCalc,
  "poisson-calc": poissonCalc,
  "dist-picker": distPicker,
};
