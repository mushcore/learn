// Widgets for MATH 3042 (midterm module): a histogram drawn from class limits and frequencies.
//
// freq-hist — the exam's histogram picture when only the bar heights are known.
// cfg (every key optional; `{}` draws the practice paper's Q1 petal lengths):
//   "start": 2.5            first lower class limit
//   "width": 0.5            class width (classes are [lower, lower + width))
//   "freq": [37, 13, …]     one frequency per class, left to right
//   "label": "Petal length (cm)"   x-axis label
//   "unit": "petals"        what one count is, used in the hover line
//   "mean": 5.2 | "midpoint"   draw a dashed mean marker at that value; "midpoint" uses Σ(midpoint × f) / n
//   "median": true          shade the class that holds the middle position(s) n/2 and n/2 + 1 (or (n + 1)/2)
//   "toggles": true         show checkboxes so the student can switch the mean marker and median shading on
//                           (they start off, so the picture can be read before the answer is shown)
//   "title": "…", "note": "…"
// Pure drawing; no data files.
import { el } from "./dom.js";

const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
function decimals(v) {
  const s = String(v);
  if (/e/i.test(s)) return 0;
  const i = s.indexOf(".");
  return i < 0 ? 0 : s.length - i - 1;
}

const PETALS = [37, 13, 0, 1, 4, 11, 21, 21, 17, 16, 5, 4];

function freqHist(box, cfg) {
  const freq = Array.isArray(cfg.freq) && cfg.freq.length ? cfg.freq.map(Number) : PETALS;
  const start = Number.isFinite(cfg.start) ? cfg.start : 2.5;
  const width = cfg.width > 0 ? cfg.width : 0.5;
  const label = cfg.label || (cfg.freq ? "X" : "Petal length (cm)");
  const unit = cfg.unit || (cfg.freq ? "values" : "petals");
  const prec = Math.max(decimals(start), decimals(width));
  const fmt = (v) => v.toFixed(prec);
  const k = freq.length;
  const lo = (i) => Number((start + i * width).toFixed(prec + 6));
  const n = freq.reduce((a, b) => a + b, 0);
  const cum = [];
  freq.reduce((a, f, i) => (cum[i] = a + f), 0);

  // mean: a given number, or the class-midpoint estimate
  let meanVal = null;
  if (cfg.mean === "midpoint") meanVal = freq.reduce((a, f, i) => a + f * (lo(i) + width / 2), 0) / n;
  else if (Number.isFinite(cfg.mean)) meanVal = cfg.mean;

  // median class: the class holding the middle position(s)
  let medIdx = -1, medPos = "";
  if (cfg.median && n > 0) {
    const a = n % 2 === 0 ? n / 2 : (n + 1) / 2;
    const b = n % 2 === 0 ? n / 2 + 1 : a;
    medIdx = cum.findIndex((c) => c >= a);
    const medIdxB = cum.findIndex((c) => c >= b);
    medPos = a === b ? `position ${a}` : `positions ${a} and ${b}`;
    if (medIdxB !== medIdx) medPos += " (they straddle two classes)";
  }

  box.append(el("h4", null, cfg.title || "Histogram from the frequency table"));
  if (cfg.note) box.append(el("p", "widget-note", cfg.note));

  const show = { mean: meanVal != null && !cfg.toggles, median: medIdx >= 0 && !cfg.toggles };
  if (cfg.toggles && (meanVal != null || medIdx >= 0)) {
    const row = el("div", "viz-inline");
    const mk = (key, text) => {
      const lab = el("label", "stat-label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.addEventListener("change", () => { show[key] = cb.checked; draw(); });
      lab.append(cb, document.createTextNode(" " + text));
      row.append(lab);
    };
    if (meanVal != null) mk("mean", "show the mean");
    if (medIdx >= 0) mk("median", "shade the median class");
    box.append(row);
  }

  const W = 560, H = 300, padL = 50, padR = 16, padB = 46, padT = 30;
  const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg", role: "img" });
  const info = el("p", "widget-note");
  const stats = el("div", "stat-steps");
  box.append(svg, info, stats);

  const maxF = Math.max(1, ...freq);
  const xMin = start, xMax = lo(k);
  const X = (v) => padL + ((v - xMin) / (xMax - xMin)) * (W - padL - padR);
  const Y = (f) => H - padB - (f / maxF) * (H - padB - padT);
  let hot = -1;

  function hoverText(i) {
    if (i < 0) return "Hover or tap a bar to read its class, frequency and the positions it fills.";
    const first = i === 0 ? 1 : cum[i - 1] + 1;
    const pos = freq[i] === 0 ? "no positions" : freq[i] === 1 ? `position ${first}` : `positions ${first} to ${cum[i]}`;
    return `${fmt(lo(i))}–${fmt(lo(i + 1))}: ${freq[i]} ${unit}, ${(100 * freq[i] / n).toFixed(1)} %, ${pos} (cumulative ${cum[i]} of ${n}).`;
  }

  function draw() {
    svg.innerHTML = "";
    svg.setAttribute("aria-label", `Histogram of ${label}: ${freq.join(", ")}`);
    // axes
    svg.append(svgEl("line", { x1: padL, x2: W - padR, y1: H - padB, y2: H - padB, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: padL, x2: padL, y1: padT - 6, y2: H - padB, stroke: "var(--ink-dim)" }));
    const yStep = maxF <= 10 ? 1 : maxF <= 25 ? 5 : maxF <= 60 ? 10 : maxF <= 150 ? 25 : 50;
    for (let f = 0; f <= maxF; f += yStep) {
      svg.append(svgEl("line", { x1: padL - 4, x2: padL, y1: Y(f), y2: Y(f), stroke: "var(--ink-dim)" }));
      svg.append(svgEl("line", { x1: padL, x2: W - padR, y1: Y(f), y2: Y(f), stroke: "var(--rule)", "stroke-dasharray": "2 4" }));
      svg.append(svgEl("text", { x: padL - 7, y: Y(f) + 4, "text-anchor": "end", fill: "var(--ink-dim)", "font-size": 13 }, String(f)));
    }
    svg.append(svgEl("text", { x: 14, y: (H - padB + padT) / 2, transform: `rotate(-90 14 ${(H - padB + padT) / 2})`, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 13 }, "Frequency"));
    svg.append(svgEl("text", { x: padL + (W - padL - padR) / 2, y: H - 6, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 13 }, label));
    const every = Math.max(1, Math.ceil((k + 1) / 13));
    for (let i = 0; i <= k; i++) {
      if (i % every) continue;
      svg.append(svgEl("line", { x1: X(lo(i)), x2: X(lo(i)), y1: H - padB, y2: H - padB + 4, stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: X(lo(i)), y: H - padB + 17, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 13 }, fmt(lo(i))));
    }
    // bars
    const rects = freq.map((f, i) => {
      const isMed = show.median && i === medIdx;
      const g = svgEl("g", { class: "hist-bar", tabindex: 0 });
      const x = X(lo(i)), w = X(lo(i + 1)) - x;
      const base = isMed ? "var(--hl)" : "var(--blue)";
      const rect = svgEl("rect", {
        x, y: Y(f), width: Math.max(1, w), height: Math.max(0, H - padB - Y(f)),
        fill: isMed ? "var(--hl-soft)" : "var(--blue-soft)", stroke: base, "stroke-width": 1.2,
      });
      rect.dataset.base = base;
      g.append(rect);
      // a hit area covering the full column, so an empty or short class can be hovered
      g.append(svgEl("rect", { x, y: padT, width: Math.max(1, w), height: H - padB - padT, fill: "transparent" }));
      g.append(svgEl("text", { x: x + w / 2, y: Y(f) - 5, "text-anchor": "middle", fill: isMed ? "var(--hl)" : "var(--ink-2)", "font-size": 13 }, String(f)));
      const on = () => { hot = i; paint(); };
      const off = () => { if (hot === i) { hot = -1; paint(); } };
      g.addEventListener("mouseenter", on);
      g.addEventListener("mouseleave", off);
      g.addEventListener("focus", on);
      g.addEventListener("blur", off);
      g.addEventListener("click", on);
      svg.append(g);
      return rect;
    });
    function paint() {
      rects.forEach((r, i) => {
        r.setAttribute("stroke", i === hot ? "var(--ink)" : r.dataset.base);
        r.setAttribute("stroke-width", i === hot ? 2.5 : 1.2);
      });
      info.textContent = hoverText(hot);
    }
    if (show.median && medIdx >= 0) {
      const x = X(lo(medIdx)) + (X(lo(medIdx + 1)) - X(lo(medIdx))) / 2;
      svg.append(svgEl("text", { x, y: padT - 12, "text-anchor": "middle", fill: "var(--hl)", "font-size": 13 }, "median class"));
    }
    if (show.mean && meanVal != null) {
      const x = X(meanVal);
      svg.append(svgEl("line", { x1: x, x2: x, y1: padT - 4, y2: H - padB, stroke: "var(--red)", "stroke-width": 2, "stroke-dasharray": "6 4" }));
      const right = x > W - 110;
      svg.append(svgEl("text", { x: right ? x - 6 : x + 6, y: padT + 8, "text-anchor": right ? "end" : "start", fill: "var(--red)", "font-size": 13 }, `mean ${meanVal.toFixed(2)}`));
    }
    paint();
    const lines = [`<div class="math-line">n = Σf = ${freq.join(" + ")} = <b>${n}</b></div>`];
    if (show.median && medIdx >= 0) {
      const before = medIdx === 0 ? 0 : cum[medIdx - 1];
      lines.push(`<div class="math-line">Median: the middle ${medPos}. The running total is ${before} before ${fmt(lo(medIdx))}–${fmt(lo(medIdx + 1))} and ${cum[medIdx]} after it, so the median class is <b>${fmt(lo(medIdx))}–${fmt(lo(medIdx + 1))}</b>.</div>`);
    }
    if (show.mean && meanVal != null) {
      const how = cfg.mean === "midpoint" ? "Σ(midpoint × f) / n" : "the marker";
      lines.push(`<div class="math-line">Mean (${how}) = <b>${meanVal.toFixed(2)}</b>${medIdx >= 0 && show.median ? (meanVal < lo(medIdx) ? ": left of the median class, so a tail or cluster on the left pulls it down" : meanVal >= lo(medIdx + 1) ? ": right of the median class, so a tail on the right pulls it up" : ": inside the median class") : ""}.</div>`);
    }
    stats.innerHTML = lines.join("");
  }
  draw();
}

export const WIDGETS = {
  "freq-hist": freqHist,
};
