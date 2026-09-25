// Interactive widgets for MATH 3042 Unit 2 (visualizing data) and Lab 2 (grouped statistics):
// frequency table → pie/bar, stem-and-leaf, histogram class builder, ogive reader, grouped favstats.
// Pure drawing + arithmetic; datasets come from ./data-stats.js.
import { el, btnRow, fmtNum, slider } from "./dom.js";
import { sum, mean, median, sampleSd, quantileR } from "./widgets-stats.js";
import { DATASETS, OGIVE_NL } from "./data-stats.js";

const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
function parseNums(text) {
  return String(text).split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean).map(Number).filter((v) => Number.isFinite(v));
}
function decimals(v) {
  const s = String(v);
  if (/e/i.test(s)) return 0;
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
}
const precisionOf = (data) => Math.max(0, ...data.map(decimals));
function cell(label, value, note) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label), el("div", "stat-value", String(value)));
  if (note) c.append(el("div", "stat-note", note));
  return c;
}
const fix = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : "—");
/** R's seq(from, to, by): from + i*by in IEEE doubles (what hist(breaks=seq(...)) really uses). */
function rSeq(from, by, count) {
  const out = [];
  for (let i = 0; i <= count; i++) out.push(from + i * by);
  return out;
}

// ---------- datasets in the shapes the widgets need ----------
const bcit = () => DATASETS.bcit();
const heights302 = () => bcit().map((r) => r[3]);
const ages302 = () => bcit().map((r) => r[1]);
const HEIGHTS20 = [163, 187, 169, 168, 170, 154, 167, 175, 153, 170, 159, 187, 163, 178, 158, 170, 169, 183, 170, 146];
const quineDays = () => DATASETS.quine().map((r) => r[4]);

// =====================================================================
// widget: cat-charts — frequency table, pie chart, bar chart (R's defaults)
// =====================================================================
const R_PIE = ["white", "lightblue", "mistyrose", "lightcyan", "lavender", "cornsilk", "#d9d9d9", "#f4c7a1"];
function catCharts(box, cfg) {
  box.append(el("h4", null, cfg.title || "Frequency table → pie chart and bar chart"));
  const cats = cfg.categories || { Black: 95, Brown: 130, Blue: 52, Green: 10, Other: 15 };
  const names = Object.keys(cats).sort(); // R's table() lists the levels alphabetically
  box.append(el("p", "widget-note", "Edit a frequency and watch both charts and the R output update. Categories are listed the way R's table() lists them: alphabetically. Hover a row to find its slice and its bar."));

  const tbl = el("table", "group-table");
  tbl.innerHTML = "<thead><tr><th>category</th><th>frequency</th><th>p̂ = x/n</th><th>%</th></tr></thead><tbody></tbody>";
  const tb = tbl.querySelector("tbody");
  const rows = names.map((k) => {
    const tr = el("tr");
    const inp = document.createElement("input"); inp.type = "number"; inp.min = 0; inp.value = cats[k]; inp.className = "q-input small";
    const tdIn = el("td"); tdIn.append(inp);
    const tdP = el("td"), tdPct = el("td");
    tr.append(el("td", null, k), tdIn, tdP, tdPct);
    tb.append(tr);
    inp.addEventListener("input", update);
    tr.addEventListener("mouseenter", () => setHot(k));
    tr.addEventListener("mouseleave", () => setHot(null));
    return { k, inp, tdP, tdPct, tr };
  });

  const charts = el("div", "viz-two");
  const pie = svgEl("svg", { viewBox: "0 0 300 280", class: "viz-svg" });
  const bar = svgEl("svg", { viewBox: "0 0 380 280", class: "viz-svg" });
  charts.append(pie, bar);
  const verdict = el("div", "stat-steps");
  const code = el("pre", "manip-code");
  const idx = el("div", "stat-steps");
  box.append(tbl, charts, verdict, code, idx);

  let hot = null;
  function setHot(k) { hot = k; draw(); }
  function freqs() { return rows.map((r) => Math.max(0, parseFloat(r.inp.value) || 0)); }

  function draw() {
    const f = freqs();
    const n = sum(f);
    // ----- pie: R draws counter-clockwise from 3 o'clock -----
    pie.innerHTML = "";
    const cx = 130, cy = 140, R = 100;
    let a0 = 0;
    pie.append(svgEl("text", { x: cx, y: 18, "text-anchor": "middle", fill: "var(--ink)", "font-size": 12, "font-weight": 700 }, `pie(freq.tab)  n = ${n}`));
    f.forEach((v, i) => {
      if (!n || !v) return;
      const a1 = a0 + (2 * Math.PI * v) / n;
      const p0 = [cx + R * Math.cos(a0), cy - R * Math.sin(a0)];
      const p1 = [cx + R * Math.cos(a1), cy - R * Math.sin(a1)];
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const d = v === n ? `M${cx - R},${cy}A${R},${R} 0 1 1 ${cx + R},${cy}A${R},${R} 0 1 1 ${cx - R},${cy}` : `M${cx},${cy}L${p0[0]},${p0[1]}A${R},${R} 0 ${large} 0 ${p1[0]},${p1[1]}Z`;
      const isHot = hot === names[i];
      pie.append(svgEl("path", { d, fill: R_PIE[i % R_PIE.length], stroke: isHot ? "var(--hl)" : "#555", "stroke-width": isHot ? 3 : 1 }));
      const am = (a0 + a1) / 2;
      const lx = cx + (R + 16) * Math.cos(am), ly = cy - (R + 16) * Math.sin(am);
      pie.append(svgEl("text", { x: lx, y: ly + 4, "text-anchor": Math.cos(am) < -0.2 ? "end" : Math.cos(am) > 0.2 ? "start" : "middle", fill: isHot ? "var(--hl)" : "var(--ink-2)", "font-size": 11 }, `${names[i]} ${n ? ((100 * v) / n).toFixed(1) : 0}%`));
      a0 = a1;
    });
    // ----- bar: R's barplot, lightgreen, absolute frequency -----
    bar.innerHTML = "";
    const W = 380, H = 280, padL = 44, padB = 40, padT = 30;
    const maxF = Math.max(1, ...f);
    const step = niceStep(maxF);
    const yMax = Math.ceil(maxF / step) * step;
    const Y = (v) => H - padB - ((v / yMax) * (H - padB - padT));
    bar.append(svgEl("text", { x: W / 2, y: 18, "text-anchor": "middle", fill: "var(--ink)", "font-size": 12, "font-weight": 700 }, `barplot(freq.tab, col="lightgreen")`));
    for (let v = 0; v <= yMax + 1e-9; v += step) {
      bar.append(svgEl("line", { x1: padL - 4, x2: padL, y1: Y(v), y2: Y(v), stroke: "var(--ink-dim)" }));
      bar.append(svgEl("text", { x: padL - 7, y: Y(v) + 4, "text-anchor": "end", fill: "var(--ink-dim)", "font-size": 10 }, String(v)));
    }
    bar.append(svgEl("line", { x1: padL, x2: padL, y1: padT, y2: H - padB, stroke: "var(--ink-dim)" }));
    bar.append(svgEl("text", { x: 12, y: H / 2, transform: `rotate(-90 12 ${H / 2})`, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, "Frequency"));
    const gap = 10, bw = (W - padL - 20 - gap * (f.length + 1)) / Math.max(1, f.length);
    f.forEach((v, i) => {
      const x = padL + gap + i * (bw + gap);
      const isHot = hot === names[i];
      bar.append(svgEl("rect", { x, y: Y(v), width: bw, height: Math.max(0, H - padB - Y(v)), fill: "lightgreen", stroke: isHot ? "var(--hl)" : "#222", "stroke-width": isHot ? 3 : 1 }));
      bar.append(svgEl("text", { x: x + bw / 2, y: H - padB + 14, "text-anchor": "middle", fill: isHot ? "var(--hl)" : "var(--ink-2)", "font-size": 11 }, names[i]));
      bar.append(svgEl("text", { x: x + bw / 2, y: Y(v) - 4, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 10 }, String(v)));
    });
    bar.append(svgEl("text", { x: padL + (W - padL) / 2, y: H - 6, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, "Eye Colour"));
  }
  function niceStep(maxV) {
    const raw = maxV / 5;
    const p = 10 ** Math.floor(Math.log10(raw || 1));
    for (const m of [1, 2, 5, 10]) if (m * p >= raw) return m * p;
    return 10 * p;
  }
  function update() {
    const f = freqs();
    const n = sum(f);
    let best = -1;
    rows.forEach((r, i) => {
      r.tdP.textContent = n ? `${f[i]}/${n} = ${fmtNum(f[i] / n, 4)}` : "";
      r.tdPct.textContent = n ? `${((100 * f[i]) / n).toFixed(2)}%` : "";
      r.tr.classList.remove("mode-row");
      if (best < 0 || f[i] > f[best]) best = i;
    });
    if (best >= 0) rows[best].tr.classList.add("mode-row");
    draw();
    const modeName = best >= 0 ? names[best] : "—";
    verdict.innerHTML = `<div class="math-line">n = Σ frequencies = <b>${n}</b> · mode (the "modal" category) = <b>${modeName}</b> · p̂(${modeName}) = ${best >= 0 && n ? fmtNum(f[best] / n, 4) : "—"}</div>
      <div class="stat-note">Pie: each slice's <b>area</b> is the category's fraction of the whole (relative frequency). Bar: each bar's <b>height</b> is the absolute frequency, so two categories are easy to compare against the same axis.</div>`;
    code.textContent = `> freq.tab <- table( BCIT.students$Eye.Colour )\n> freq.tab\n\n${names.map((k) => k.padStart(6)).join(" ")}\n${f.map((v) => String(v).padStart(6)).join(" ")}\n\n> pie(freq.tab, radius=1.0, main="Eye Colour in BCIT Students (n = ${n})")\n> barplot(freq.tab, col="lightgreen", xlab="Eye Colour", ylab="Frequency",\n          main="Eye Colour in BCIT Students (n = ${n})")`;
    idx.innerHTML = `<div class="stat-label">Indexing the named vector (R lists levels alphabetically, so position 3 is ${names[2] || "?"})</div>
      <div class="math-line">freq.tab[3] → <b>${names[2] || "?"}</b> then <b>${f[2] ?? "?"}</b> (name kept) &nbsp;·&nbsp; freq.tab["${names[2] || "?"}"] → same &nbsp;·&nbsp; freq.tab[[3]] → <b>[1] ${f[2] ?? "?"}</b> (double brackets drop the name)</div>`;
  }
  update();
}

// =====================================================================
// widget: stem-leaf
// =====================================================================
function stemLeaf(box, cfg) {
  box.append(el("h4", null, cfg.title || "Stem-and-leaf plot: cut each value into stem | leaf"));
  const presets = {
    "20 heights (lecture)": { data: HEIGHTS20.join(" "), unit: 1, width: 1 },
    "All 302 heights (what R prints)": { data: heights302().join(" "), unit: 1, width: 0.5 },
    "Old Faithful eruptions (rounded to 2 dp)": { data: DATASETS.faithful().join(" "), unit: 0.01, width: 2 },
    "BCIT Age (n = 302)": { data: ages302().join(" "), unit: 1, width: 1 },
  };
  const first = cfg.preset && presets[cfg.preset] ? cfg.preset : Object.keys(presets)[0];
  const ta = document.createElement("textarea"); ta.className = "data-input"; ta.rows = 2; ta.value = cfg.data || presets[first].data;
  const st = { unit: cfg.unit ?? presets[first].unit, width: cfg.width ?? presets[first].width };
  const unitRow = el("div", "viz-inline");
  const unitSel = document.createElement("select"); unitSel.className = "q-input small";
  for (const [v, l] of [[10, "tens (leaf = tens digit)"], [1, "ones (leaf = last digit)"], [0.1, "tenths"], [0.01, "hundredths (round to 2 dp first)"], [0.001, "thousandths"]]) {
    const o = document.createElement("option"); o.value = v; o.textContent = l; if (Number(v) === st.unit) o.selected = true; unitSel.append(o);
  }
  unitSel.addEventListener("change", () => { st.unit = Number(unitSel.value); render(); });
  unitRow.append(el("span", "stat-label", "leaf unit: "), unitSel);
  const widthRow = btnRow(["split stems (0–4 | 5–9)", "one line per stem", "double stems (R's scale for Old Faithful)"], (i) => { st.width = [0.5, 1, 2][i]; render(); }, [0.5, 1, 2].indexOf(st.width));
  const pre = el("pre", "manip-code stem-pre");
  const key = el("div", "stat-steps");
  const grid = el("div", "stat-grid");
  box.append(el("p", "widget-note", "Type or paste values. The leaf is the last digit you keep; everything in front of it is the stem. Leaves are sorted on each line. Change the leaf unit when the data has too many digits (Old Faithful: 2.283 → 2.28 → stem 22, leaf 8)."),
    btnRow(Object.keys(presets), (i, l) => { ta.value = presets[l].data; st.unit = presets[l].unit; st.width = presets[l].width; unitSel.value = st.unit; [...widthRow.children].forEach((b, j) => b.classList.toggle("active", [0.5, 1, 2][j] === st.width)); render(); }, Object.keys(presets).indexOf(first)),
    ta, unitRow, widthRow, pre, key, grid);
  ta.addEventListener("input", render);

  function render() {
    const d = parseNums(ta.value);
    grid.innerHTML = ""; key.innerHTML = "";
    if (!d.length) { pre.textContent = "(no data)"; return; }
    const u = st.unit;
    const ks = d.map((x) => Math.round(x / u)); // integer "leaf units"
    if (ks.some((k) => k < 0)) { pre.textContent = "This plot handles non-negative values only."; return; }
    // group by stem line: width 1 → floor(k/10); width 2 → floor(k/20)*2; width 0.5 → floor(k/10) with halves
    const groups = new Map();
    const lineKey = (k) => st.width === 2 ? Math.floor(k / 20) * 2 : st.width === 0.5 ? Math.floor(k / 10) + (k % 10 >= 5 ? 0.5 : 0) : Math.floor(k / 10);
    for (const k of ks) { const g = lineKey(k); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(k); }
    const keys = [...groups.keys()].sort((a, b) => a - b);
    // fill empty stems between min and max so gaps are visible
    const step = st.width === 2 ? 2 : st.width === 0.5 ? 0.5 : 1;
    const all = [];
    for (let g = keys[0]; g <= keys[keys.length - 1] + 1e-9; g += step) all.push(Number(g.toFixed(1)));
    const e = Math.round(Math.log10(u)) + 1;
    const header = e > 0 ? `The decimal point is ${e} digit(s) to the right of the |` : e < 0 ? `The decimal point is ${-e} digit(s) to the left of the |` : "The decimal point is at the |";
    const stemW = Math.max(...all.map((g) => String(Math.floor(g)).length));
    const lines = all.map((g) => {
      const leaves = (groups.get(g) || []).sort((a, b) => a - b).map((k) => String(k % 10)).join("");
      return `${String(Math.floor(g)).padStart(stemW)} | ${leaves}`;
    });
    pre.textContent = `${header}\n\n${lines.join("\n")}`;
    // key: first non-empty line's first leaf
    const g0 = keys[0]; const k0 = Math.min(...groups.get(g0));
    const shown = (k0 * u);
    const digits = Math.max(0, -Math.round(Math.log10(u)));
    key.innerHTML = `<div class="math-line">Key: <b>${Math.floor(g0)} | ${k0 % 10}</b> represents <b>${shown.toFixed(digits)}</b> &nbsp;(stem × 10 + leaf, in units of ${u})</div>
      <div class="stat-note">${st.width === 0.5 ? "Split stems: R splits each stem into two lines (leaves 0–4, then 5–9) when one line per stem would be too crowded." : st.width === 2 ? "Double stems: each line holds two consecutive stems (R does this when there would be too many lines), so leaves on one line run through two tens." : "One line per stem."} A stem-and-leaf plot is a frequency distribution that still shows every data value.</div>`;
    const srt = [...d].sort((a, b) => a - b);
    const counts = new Map(); for (const x of d) counts.set(x, (counts.get(x) || 0) + 1);
    const best = Math.max(...counts.values());
    const modeVals = [...counts.entries()].filter(([, c]) => c === best).map(([v]) => v);
    grid.append(cell("n", d.length), cell("min / max", `${srt[0]} / ${srt[srt.length - 1]}`), cell("median", fmtNum(median(d), 3)), cell("mode", best > 1 ? modeVals.join(", ") + ` (×${best})` : "none"), cell("longest line (stem)", longest(groups, all), "where the data piles up"));
  }
  function longest(groups, all) {
    let bg = null, bl = -1;
    for (const g of all) { const L = (groups.get(g) || []).length; if (L > bl) { bl = L; bg = g; } }
    return bg == null ? "—" : `${Math.floor(bg)} (${bl} leaves)`;
  }
  render();
}

// =====================================================================
// widget: hist-builder — the 7-step recipe, class table, histogram
// =====================================================================
function classTable(data, start, w) {
  const prec = Math.max(precisionOf(data), decimals(w), decimals(start));
  const u = 10 ** -prec;
  const mx = Math.max(...data);
  let count = Math.max(1, Math.ceil((mx - start) / w + 1e-9));
  let breaks = rSeq(start, w, count);
  while (breaks[breaks.length - 1] <= mx) { count++; breaks = rSeq(start, w, count); }
  const rows = [];
  let cum = 0;
  for (let i = 0; i < count; i++) {
    const lo = breaks[i], hi = breaks[i + 1];
    const f = data.filter((x) => x >= lo && x < hi).length;
    cum += f;
    rows.push({ lo: Number(lo.toFixed(prec)), hi: Number((hi - u).toFixed(prec)), loRaw: lo, hiRaw: hi, f, rel: f / data.length, cum, cumRel: cum / data.length });
  }
  return { rows, prec, u, breaks };
}
function histBuilder(box, cfg) {
  box.append(el("h4", null, cfg.title || "Build a histogram: from raw data to classes to rectangles"));
  const presets = {
    "BCIT Age (n = 302)": { data: ages302(), width: 2, start: 18, label: "Age", precisionNote: "ages are whole years" },
    "Old Faithful eruptions (n = 272)": { data: DATASETS.faithful(), width: 0.2, start: 1.6, label: "Eruptions (min)" },
    "Plywood thickness (n = 18, pencil problem)": { data: DATASETS.plywood(), width: 0.005, start: 0.73, label: "thickness (in)" },
    "quine Days absent (n = 146, Lab 2)": { data: quineDays(), width: 5, start: 0, label: "Days" },
    "Gold price (n = 10)": { data: DATASETS.gold(), width: 100, start: 6000, label: "CA$/oz" },
  };
  const first = cfg.preset && presets[cfg.preset] ? cfg.preset : Object.keys(presets)[0];
  const st = { data: cfg.data ? parseNums(cfg.data) : presets[first].data.slice(), width: cfg.width ?? presets[first].width, start: cfg.start ?? presets[first].start, label: cfg.label || presets[first].label };
  const ta = document.createElement("textarea"); ta.className = "data-input"; ta.rows = 2; ta.value = st.data.join(" ");
  const ctl = el("div", "viz-inline");
  const wIn = document.createElement("input"); wIn.className = "q-input small"; wIn.value = st.width;
  const sIn = document.createElement("input"); sIn.className = "q-input small"; sIn.value = st.start;
  ctl.append(el("span", "stat-label", "class width"), wIn, el("span", "stat-label", "first lower limit"), sIn);
  const quick = btnRow(["√n rule (suggest)", "too many classes (width ÷ 10)", "too few classes (width × 10)"], (i) => {
    if (i === 0) { const s = suggest(st.data); st.width = s.width; st.start = s.start; }
    else if (i === 1) st.width = Number((st.width / 10).toPrecision(6));
    else st.width = Number((st.width * 10).toPrecision(6));
    wIn.value = st.width; sIn.value = st.start; render();
  }, -1);
  const recipe = el("div", "stat-steps");
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg" });
  const tblWrap = el("div", "hist-table-wrap");
  const code = el("pre", "manip-code");
  box.append(el("p", "widget-note", "Every number in the recipe recomputes as you type. Hover a bar or a table row to see which values it counts. Classes are [lower, upper) exactly like R's hist(..., right = FALSE): the lower limit is included, the next lower limit is not."),
    btnRow(Object.keys(presets), (i, l) => { const p = presets[l]; st.data = p.data.slice(); st.width = p.width; st.start = p.start; st.label = p.label; ta.value = st.data.join(" "); wIn.value = st.width; sIn.value = st.start; render(); }, Object.keys(presets).indexOf(first)),
    ta, ctl, quick, recipe, svg, tblWrap, code);
  ta.addEventListener("input", () => { st.data = parseNums(ta.value); render(); });
  wIn.addEventListener("input", () => { const v = parseFloat(wIn.value); if (v > 0) { st.width = v; render(); } });
  sIn.addEventListener("input", () => { const v = parseFloat(sIn.value); if (Number.isFinite(v)) { st.start = v; render(); } });

  function suggest(data) {
    const n = data.length, prec = precisionOf(data), u = 10 ** -prec;
    const R = Math.max(...data) - Math.min(...data);
    const ideal = R / Math.sqrt(n);
    let width = Math.round(ideal / u) * u;
    if (width <= 0) width = u;
    width = Number(width.toFixed(prec));
    const start = Number((Math.floor(Math.min(...data) / u) * u).toFixed(prec));
    return { width, start };
  }
  let hotRow = -1;
  function render() {
    const d = st.data;
    if (d.length < 2 || !(st.width > 0)) { recipe.textContent = "Enter at least two numbers and a positive width."; return; }
    const n = d.length, mn = Math.min(...d), mx = Math.max(...d), R = mx - mn, prec = precisionOf(d);
    const sq = Math.sqrt(n), ideal = R / sq;
    const t = classTable(d, st.start, st.width);
    recipe.innerHTML = `<div class="stat-label">The recipe from the lecture notes</div>
      <div class="math-line">1. initial number of classes = √n = √${n} = <b>${fix(sq, 1)}</b></div>
      <div class="math-line">2. ideal class width = R / √n = (${mx} − ${mn}) / ${fix(sq, 1)} = ${fix(R, prec)} / ${fix(sq, 1)} = <b>${fix(ideal, Math.max(2, prec + 2))}</b></div>
      <div class="math-line">3. round to the precision of X (${prec} decimal${prec === 1 ? "" : "s"}) and to a "nice" number → actual class width = <b>${st.width}</b> ${Math.abs(st.width - ideal) / ideal > 0.6 ? '<span class="flag">(far from the ideal: expect a jagged or a blocky picture)</span>' : ""}<br/><span class="stat-note">ideal rounded to the data's precision is ${fix(Math.round(ideal / t.u) * t.u, prec)}; any nearby nice number works (the notes pick 2 for Age, 0.200 for Old Faithful, 0.005 for plywood). Up or down: wider means fewer classes.</span></div>
      <div class="math-line">4. first lower class limit = minimum X (rounded down) = <b>${st.start}</b> &nbsp;(min = ${mn})</div>
      <div class="math-line">5. lower limits go up by ${st.width}; each upper limit = next lower limit − ${t.u.toFixed(prec)} (one unit of precision) → <b>${t.rows.length} classes</b></div>
      <div class="math-line">6. count the X values in each class → the <b>frequency distribution</b> (Σf = ${n})</div>
      <div class="math-line">7. draw one rectangle per class, height = frequency, no gaps</div>`;
    // ----- table -----
    const tbl = el("table", "group-table hist-table");
    tbl.innerHTML = `<thead><tr><th>lower limit</th><th>upper limit</th><th>frequency</th><th>rel. freq</th><th>cumul. freq</th><th>cumul. rel. freq</th></tr></thead><tbody></tbody>`;
    const tb = tbl.querySelector("tbody");
    t.rows.forEach((r, i) => {
      const tr = el("tr");
      tr.innerHTML = `<td>${r.lo.toFixed(prec)}</td><td>${r.hi.toFixed(prec)}</td><td>${r.f}</td><td>${r.rel.toFixed(3)}</td><td>${r.cum}</td><td>${r.cumRel.toFixed(3)}</td>`;
      if (i === hotRow) tr.classList.add("mode-row");
      tr.addEventListener("mouseenter", () => { hotRow = i; paint(); });
      tr.addEventListener("mouseleave", () => { hotRow = -1; paint(); });
      tb.append(tr);
    });
    tblWrap.innerHTML = ""; tblWrap.append(tbl);
    // ----- histogram -----
    const W = 640, H = 300, padL = 50, padB = 46, padT = 24;
    const maxF = Math.max(1, ...t.rows.map((r) => r.f));
    const x0 = t.breaks[0], x1 = t.breaks[t.breaks.length - 1];
    const X = (v) => padL + ((v - x0) / (x1 - x0)) * (W - padL - 16);
    const Y = (f) => H - padB - (f / maxF) * (H - padB - padT);
    svg.innerHTML = "";
    svg.append(svgEl("line", { x1: padL, x2: W - 16, y1: H - padB, y2: H - padB, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: padL, x2: padL, y1: padT, y2: H - padB, stroke: "var(--ink-dim)" }));
    const yStep = maxF <= 10 ? 1 : maxF <= 50 ? 5 : maxF <= 120 ? 20 : 50;
    for (let f = 0; f <= maxF; f += yStep) {
      svg.append(svgEl("line", { x1: padL - 4, x2: padL, y1: Y(f), y2: Y(f), stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: padL - 7, y: Y(f) + 4, "text-anchor": "end", fill: "var(--ink-dim)", "font-size": 10 }, String(f)));
    }
    svg.append(svgEl("text", { x: 14, y: H / 2, transform: `rotate(-90 14 ${H / 2})`, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, "Frequency"));
    svg.append(svgEl("text", { x: padL + (W - padL) / 2, y: H - 6, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, st.label));
    const labelEvery = Math.max(1, Math.ceil(t.breaks.length / 14));
    t.breaks.forEach((b, i) => {
      if (i % labelEvery) return;
      svg.append(svgEl("line", { x1: X(b), x2: X(b), y1: H - padB, y2: H - padB + 4, stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: X(b), y: H - padB + 16, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 10 }, Number(b.toFixed(prec + 1)).toString()));
    });
    const bars = t.rows.map((r, i) => {
      const g = svgEl("g", { class: "hist-bar" });
      const rect = svgEl("rect", { x: X(r.loRaw), y: Y(r.f), width: Math.max(1, X(r.hiRaw) - X(r.loRaw)), height: Math.max(0, H - padB - Y(r.f)), fill: "pink", stroke: "#333", "stroke-width": 1 });
      g.append(rect);
      g.addEventListener("mouseenter", () => { hotRow = i; paint(); });
      g.addEventListener("mouseleave", () => { hotRow = -1; paint(); });
      svg.append(g);
      return rect;
    });
    const tip = svgEl("text", { x: W / 2, y: 14, "text-anchor": "middle", fill: "var(--hl)", "font-size": 12 }, "");
    svg.append(tip);
    function paint() {
      bars.forEach((rect, i) => { rect.setAttribute("stroke", i === hotRow ? "var(--hl)" : "#333"); rect.setAttribute("stroke-width", i === hotRow ? 3 : 1); });
      [...tb.children].forEach((tr, i) => tr.classList.toggle("mode-row", i === hotRow));
      const r = t.rows[hotRow];
      tip.textContent = r ? `${r.lo.toFixed(prec)} ≤ X < ${(r.hiRaw).toFixed(prec)}  (i.e. ${r.lo.toFixed(prec)}–${r.hi.toFixed(prec)}): ${r.f} value${r.f === 1 ? "" : "s"}, ${(100 * r.rel).toFixed(1)}%` : "";
    }
    paint();
    const end = t.breaks[t.breaks.length - 1];
    code.textContent = `> hist(x, breaks=seq(${st.start}, ${Number(end.toFixed(prec + 2))}, by=${st.width}), right=FALSE,\n       xlab="${st.label}", ylab="Frequency", main="... (n = ${n})")\n\n# right=FALSE: each class is [lower, upper) — the lower limit is in, the next lower limit is out.`;
  }
  render();
}

// =====================================================================
// widget: ogive — cumulative relative frequency vs upper class limits
// =====================================================================
function ogivePoints(data, start, w) {
  const t = classTable(data, start, w);
  const pts = [[Number((t.breaks[0] - t.u).toFixed(t.prec)), 0]];
  for (const r of t.rows) pts.push([r.hi, r.cumRel]);
  return { pts, table: t };
}
function ogive(box, cfg) {
  box.append(el("h4", null, cfg.title || "Ogive: read percentiles off the cumulative curve"));
  const presets = {
    "Old Faithful eruptions": () => ogivePoints(DATASETS.faithful(), 1.6, 0.2),
    "Test scores, 2287 students (Lab 2 pencil #4)": () => ({ pts: OGIVE_NL.map(([x, p]) => [x, p / 100]), table: null }),
    "BCIT Age": () => ogivePoints(ages302(), 18, 2),
    "quine Days absent": () => ogivePoints(quineDays(), 0, 5),
  };
  const first = cfg.preset && presets[cfg.preset] ? cfg.preset : Object.keys(presets)[0];
  let cur = presets[first]();
  const svg = svgEl("svg", { viewBox: "0 0 640 330", class: "curve-svg ogive-svg" });
  const readout = el("div", "stat-grid");
  const xS = slider("X (read % below it)", 0, 1, 0.01, 0, (v) => { st.x = v; draw(); }, (v) => fmtNum(v, 3));
  const pS = slider("percentile p (read the X at it)", 0, 100, 0.5, 30, (v) => { st.p = v; draw(); }, (v) => `${v}%`);
  const st = { x: null, p: 30 };
  const tblWrap = el("div", "hist-table-wrap");
  box.append(el("p", "widget-note", "Each dot is (upper class limit, cumulative relative frequency), plus one extra dot at 0 before the first class. Drag the yellow guides (or use the sliders): the vertical one answers \"what fraction is below X?\", the horizontal one answers \"which X has p% below it?\" (that X is the p-th percentile)."),
    btnRow(Object.keys(presets), (i, l) => { cur = presets[l](); st.x = null; setup(); draw(); }, Object.keys(presets).indexOf(first)), svg, xS.row, pS.row, readout, tblWrap);

  const W = 640, H = 330, padL = 56, padR = 20, padT = 20, padB = 50;
  let xmin, xmax;
  const X = (v) => padL + ((v - xmin) / (xmax - xmin)) * (W - padL - padR);
  const Y = (p) => H - padB - p * (H - padB - padT);
  const invX = (px) => xmin + ((px - padL) / (W - padL - padR)) * (xmax - xmin);
  const invY = (py) => (H - padB - py) / (H - padB - padT);
  function setup() {
    const xs = cur.pts.map((p) => p[0]);
    xmin = Math.min(...xs); xmax = Math.max(...xs);
    const span = xmax - xmin;
    xS.input.min = xmin; xS.input.max = xmax; xS.input.step = span / 400;
    if (st.x == null) { st.x = Number((xmin + span * 0.4).toPrecision(3)); }
    xS.set(st.x);
    tblWrap.innerHTML = "";
    if (cur.table) {
      const tbl = el("table", "group-table hist-table");
      tbl.innerHTML = `<thead><tr><th>lower limit</th><th>upper limit</th><th>frequency</th><th>cumul. freq</th><th>cumul. rel. freq</th></tr></thead><tbody><tr><td></td><td>${cur.pts[0][0]}</td><td></td><td>0</td><td>0.000</td></tr>${cur.table.rows.map((r) => `<tr><td>${r.lo.toFixed(cur.table.prec)}</td><td>${r.hi.toFixed(cur.table.prec)}</td><td>${r.f}</td><td>${r.cum}</td><td>${r.cumRel.toFixed(3)}</td></tr>`).join("")}</tbody></table>`;
      tblWrap.append(tbl);
    } else {
      tblWrap.innerHTML = `<div class="stat-note">Points read from the lab's figure: ${cur.pts.map(([x, p]) => `(${x}, ${Math.round(p * 100)}%)`).join(", ")}.</div>`;
    }
  }
  function cumAt(x) {
    const p = cur.pts;
    if (x <= p[0][0]) return 0;
    if (x >= p[p.length - 1][0]) return 1;
    for (let i = 0; i < p.length - 1; i++) {
      const [x0, y0] = p[i], [x1, y1] = p[i + 1];
      if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return 1;
  }
  function xAt(frac) {
    const p = cur.pts;
    if (frac <= 0) return p[0][0];
    if (frac >= 1) return p[p.length - 1][0];
    for (let i = 0; i < p.length - 1; i++) {
      const [x0, y0] = p[i], [x1, y1] = p[i + 1];
      if (frac >= y0 && frac <= y1 && y1 > y0) return x0 + ((frac - y0) / (y1 - y0)) * (x1 - x0);
    }
    return p[p.length - 1][0];
  }
  function draw() {
    svg.innerHTML = "";
    // grid
    for (let p = 0; p <= 1.0001; p += 0.1) {
      svg.append(svgEl("line", { x1: padL, x2: W - padR, y1: Y(p), y2: Y(p), stroke: "var(--rule)", "stroke-dasharray": "2 3" }));
      svg.append(svgEl("text", { x: padL - 6, y: Y(p) + 4, "text-anchor": "end", fill: "var(--ink-dim)", "font-size": 10 }, p.toFixed(1)));
    }
    const ticks = 10;
    for (let i = 0; i <= ticks; i++) {
      const v = xmin + ((xmax - xmin) * i) / ticks;
      svg.append(svgEl("line", { x1: X(v), x2: X(v), y1: padT, y2: H - padB, stroke: "var(--rule)", "stroke-dasharray": "2 3" }));
      svg.append(svgEl("text", { x: X(v), y: H - padB + 16, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 10 }, Number(v.toPrecision(4)).toString()));
    }
    svg.append(svgEl("line", { x1: padL, x2: W - padR, y1: H - padB, y2: H - padB, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: padL, x2: padL, y1: padT, y2: H - padB, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("text", { x: 14, y: H / 2, transform: `rotate(-90 14 ${H / 2})`, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, "Cumulative relative frequency"));
    svg.append(svgEl("text", { x: padL + (W - padL) / 2, y: H - 6, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 11 }, "upper class limits"));
    // curve
    const d = cur.pts.map(([x, p], i) => (i ? "L" : "M") + X(x).toFixed(1) + "," + Y(p).toFixed(1)).join("");
    svg.append(svgEl("path", { d, fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    for (const [x, p] of cur.pts) svg.append(svgEl("circle", { cx: X(x), cy: Y(p), r: 3.5, fill: "var(--paper)", stroke: "var(--blue)", "stroke-width": 1.5 }));
    // guides
    const yv = cumAt(st.x);
    svg.append(svgEl("line", { x1: X(st.x), x2: X(st.x), y1: padT, y2: H - padB, stroke: "var(--hl)", "stroke-width": 2 }));
    svg.append(svgEl("line", { x1: padL, x2: X(st.x), y1: Y(yv), y2: Y(yv), stroke: "var(--hl)", "stroke-dasharray": "5 4" }));
    svg.append(svgEl("circle", { cx: X(st.x), cy: Y(yv), r: 5, fill: "var(--hl)" }));
    const xp = xAt(st.p / 100);
    svg.append(svgEl("line", { x1: padL, x2: W - padR, y1: Y(st.p / 100), y2: Y(st.p / 100), stroke: "var(--green)", "stroke-width": 2 }));
    svg.append(svgEl("line", { x1: X(xp), x2: X(xp), y1: Y(st.p / 100), y2: H - padB, stroke: "var(--green)", "stroke-dasharray": "5 4" }));
    svg.append(svgEl("circle", { cx: X(xp), cy: Y(st.p / 100), r: 5, fill: "var(--green)" }));
    // drag handles (whole-svg pointer handling: nearest guide)
    readout.innerHTML = "";
    readout.append(
      cell(`% below X = ${fmtNum(st.x, 3)}`, `${(100 * yv).toFixed(1)}%`, "read up from X to the curve, then across"),
      cell(`% at or above ${fmtNum(st.x, 3)}`, `${(100 * (1 - yv)).toFixed(1)}%`, "100% minus the value above"),
      cell(`P${st.p} (${st.p}% below)`, fmtNum(xp, 3), "read across from p to the curve, then down"),
    );
  }
  let dragging = null;
  svg.addEventListener("pointerdown", (e) => {
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
    const dx = Math.abs(px - X(st.x)), dy = Math.abs(py - Y(st.p / 100));
    dragging = dx <= dy ? "x" : "p";
    svg.setPointerCapture(e.pointerId);
    move(e);
  });
  function move(e) {
    if (!dragging) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
    if (dragging === "x") { st.x = Math.min(xmax, Math.max(xmin, invX(px))); xS.set(Number(st.x.toPrecision(4))); }
    else { st.p = Math.min(100, Math.max(0, Math.round(invY(py) * 200) / 2)); pS.set(st.p); }
    draw();
  }
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", () => { dragging = null; });
  setup(); draw();
}

// =====================================================================
// widget: group-stats — favstats by group, side-by-side boxplots, grouped percentiles, Z check
// =====================================================================
function favstats(a) {
  const s = [...a].sort((x, y) => x - y);
  const m = mean(a), sd = a.length > 1 ? sampleSd(a) : NaN, q2 = quantileR(s, 0.5);
  return { min: s[0], q1: quantileR(s, 0.25), median: q2, q3: quantileR(s, 0.75), max: s[s.length - 1], mean: m, sd, n: a.length, cv: sd / m, sk: (3 * (m - q2)) / sd };
}
function groupStats(box, cfg) {
  box.append(el("h4", null, cfg.title || "quine: Days absent, grouped (favstats, bwplot, quantile, Z-scores)"));
  const rows = DATASETS.quine(); // [Eth, Sex, Age, Lrn, Days]
  const COL = { Eth: 0, Sex: 1, Age: 2, Lrn: 3 };
  const groupings = { "all (~Days)": [], "by Sex": ["Sex"], "by Eth": ["Eth"], "by Lrn": ["Lrn"], "by Age": ["Age"], "by Eth + Sex": ["Eth", "Sex"] };
  let by = cfg.by ? (Array.isArray(cfg.by) ? cfg.by : [cfg.by]) : ["Sex"];
  const activeIdx = Object.values(groupings).findIndex((g) => g.join("+") === by.join("+"));
  const tblWrap = el("div", "hist-table-wrap");
  const svg = svgEl("svg", { class: "boxplot-svg" });
  const code = el("pre", "manip-code");
  const probsIn = document.createElement("input"); probsIn.className = "q-input wide"; probsIn.value = cfg.probs || "0.2 0.4 0.6 0.8";
  const pctWrap = el("div", "hist-table-wrap");
  const zWrap = el("div", "stat-steps");
  box.append(el("p", "widget-note", "The Lab 2 data: 146 school children in Walgett, NSW; Days = days absent. Pick a grouping to see what favstats(Days ~ group, data = quine) and bwplot(Days ~ group, data = quine) show, then read the percentiles and the Z-score check underneath."),
    btnRow(Object.keys(groupings), (i, l) => { by = groupings[l]; render(); }, activeIdx < 0 ? 1 : activeIdx), tblWrap, svg, code,
    el("div", "stat-label", "Percentiles by group: quantile(Days ~ group, data = quine, prob = c(...)) — edit the probabilities:"), probsIn, pctWrap, zWrap);
  probsIn.addEventListener("input", render);

  function groups() {
    if (!by.length) return [["all", rows.map((r) => r[4])]];
    const m = new Map();
    for (const r of rows) {
      const k = by.map((b) => r[COL[b]]).join(".");
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(r[4]);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }
  function render() {
    const gs = groups();
    const stats = gs.map(([k, a]) => [k, favstats(a)]);
    const tbl = el("table", "group-table hist-table");
    tbl.innerHTML = `<thead><tr><th>group</th><th>min</th><th>Q1</th><th>median</th><th>Q3</th><th>max</th><th>mean</th><th>sd</th><th>n</th><th>CV</th><th>Sk</th></tr></thead><tbody>${stats.map(([k, s]) => `<tr><td>${k}</td><td>${s.min}</td><td>${fmtNum(s.q1, 2)}</td><td>${fmtNum(s.median, 2)}</td><td>${fmtNum(s.q3, 2)}</td><td>${s.max}</td><td>${fmtNum(s.mean, 5)}</td><td>${fmtNum(s.sd, 5)}</td><td>${s.n}</td><td>${fmtNum(100 * s.cv, 1)}%</td><td>${fmtNum(s.sk, 3)}</td></tr>`).join("")}</tbody>`;
    tblWrap.innerHTML = ""; tblWrap.append(tbl);
    // side-by-side horizontal boxplots on one axis
    const W = 640, rowH = 44, pad = 40, H = rowH * gs.length + 40;
    svg.innerHTML = ""; svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const lo = 0, hi = Math.max(...rows.map((r) => r[4]));
    const X = (v) => pad + ((v - lo) / (hi - lo)) * (W - 2 * pad);
    svg.append(svgEl("line", { x1: pad, x2: W - pad, y1: H - 24, y2: H - 24, stroke: "var(--ink-dim)" }));
    for (let v = 0; v <= hi; v += 20) {
      svg.append(svgEl("line", { x1: X(v), x2: X(v), y1: H - 24, y2: H - 19, stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: X(v), y: H - 8, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 10 }, String(v)));
    }
    stats.forEach(([k, s], i) => {
      const cy = 22 + i * rowH, a = gs[i][1];
      const iqr = s.q3 - s.q1, lf = s.q1 - 1.5 * iqr, uf = s.q3 + 1.5 * iqr;
      const inside = a.filter((v) => v >= lf && v <= uf);
      const wmin = Math.min(...inside), wmax = Math.max(...inside);
      svg.append(svgEl("text", { x: pad - 6, y: cy + 4, "text-anchor": "end", fill: "var(--ink-2)", "font-size": 11 }, k));
      svg.append(svgEl("line", { x1: X(wmin), x2: X(s.q1), y1: cy, y2: cy, stroke: "var(--ink-2)", "stroke-dasharray": "4 3" }));
      svg.append(svgEl("line", { x1: X(s.q3), x2: X(wmax), y1: cy, y2: cy, stroke: "var(--ink-2)", "stroke-dasharray": "4 3" }));
      svg.append(svgEl("line", { x1: X(wmin), x2: X(wmin), y1: cy - 9, y2: cy + 9, stroke: "var(--ink-2)" }));
      svg.append(svgEl("line", { x1: X(wmax), x2: X(wmax), y1: cy - 9, y2: cy + 9, stroke: "var(--ink-2)" }));
      svg.append(svgEl("rect", { x: X(s.q1), y: cy - 13, width: Math.max(1, X(s.q3) - X(s.q1)), height: 26, fill: "var(--blue-soft)", stroke: "var(--blue)", "stroke-width": 1.5 }));
      svg.append(svgEl("line", { x1: X(s.median), x2: X(s.median), y1: cy - 13, y2: cy + 13, stroke: "var(--blue)", "stroke-width": 3 }));
      svg.append(svgEl("circle", { cx: X(s.mean), cy, r: 3, fill: "var(--ink)" }));
      for (const o of a.filter((v) => v < lf || v > uf)) svg.append(svgEl("circle", { cx: X(o), cy, r: 3.5, fill: "none", stroke: "var(--red)", "stroke-width": 1.5 }));
    });
    const f = by.length ? `Days~${by.join("+")}` : "~Days";
    code.textContent = `> favstats(${f}, data=quine)\n> bwplot(${f}, data=quine${by.length ? "" : ", horizontal=TRUE"})${by.length ? `\n> mean(${f}, data=quine)   # one mean per group` : ""}\n\n# ${by.length ? "the model formula Days~" + by.join("+") + " means: Days, grouped by " + by.join(" and ") : "~Days means: just the Days variable"}. In bwplot the box's dot is the median; here the black dot marks the mean and red rings mark outliers past the 1.5·IQR fences.`;
    // percentiles
    const probs = parseNums(probsIn.value).filter((p) => p >= 0 && p <= 1);
    const ptbl = el("table", "group-table hist-table");
    ptbl.innerHTML = `<thead><tr><th>group</th>${probs.map((p) => `<th>${Math.round(p * 100)}%</th>`).join("")}</tr></thead><tbody>${gs.map(([k, a]) => `<tr><td>${k}</td>${probs.map((p) => `<td>${fmtNum(quantileR(a, p), 2)}</td>`).join("")}</tr>`).join("")}</tbody>`;
    pctWrap.innerHTML = `<div class="stat-note">quantile(${f}, data=quine, prob=c(${probs.join(", ")}))</div>`; pctWrap.append(ptbl);
    // Z check on the whole variable
    const all = rows.map((r) => r[4]);
    const m = mean(all), sd = sampleSd(all);
    const Z = all.map((v) => (v - m) / sd);
    const within = (k) => Z.filter((z) => Math.abs(z) <= k).length / Z.length;
    const beyond = (k) => Z.filter((z) => Math.abs(z) > k).length;
    zWrap.innerHTML = `<div class="stat-label">Z-scores of every Days value: scale(quine$Days), with mean ${fmtNum(m, 4)} and sd ${fmtNum(sd, 5)}</div>
      <table class="group-table hist-table"><thead><tr><th>k</th><th>count with |Z| &gt; k</th><th>fraction within ±k sd</th><th>Chebyshev guarantees ≥</th><th>empirical rule predicts</th><th>verdict</th></tr></thead><tbody>
      ${[1, 2, 3].map((k) => { const p = within(k), ch = k === 1 ? 0 : 1 - 1 / (k * k), em = [0.68, 0.95, 0.997][k - 1]; return `<tr><td>${k}</td><td>${beyond(k)}</td><td>${p.toFixed(4)}</td><td>${ch.toFixed(3)}</td><td>${em}</td><td>${p >= ch ? "Chebyshev ✓" : "Chebyshev ✗"} · ${Math.abs(p - em) < 0.02 ? "≈ empirical" : p > em ? "above empirical" : "below empirical"}</td></tr>`; }).join("")}
      </tbody></table>
      <div class="stat-note">Chebyshev holds for any data. The empirical rule does not fit here because Days is strongly skewed right (Sk = ${fmtNum(favstats(all).sk, 2)}), so the distribution is not bell-shaped: too many values sit within 1 sd, and the long right tail puts values beyond 3 sd.</div>`;
  }
  render();
}

export { classTable, ogivePoints };

export const WIDGETS = {
  "cat-charts": catCharts,
  "stem-leaf": stemLeaf,
  "hist-builder": histBuilder,
  "ogive": ogive,
  "group-stats": groupStats,
};
