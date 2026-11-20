// Film-style playback animations for MATH 3042 Quiz 9 (confidence intervals for p, QQ plots), built on
// app/playback.js. Each frame is a pure function of the playback position, drawn on a cream 960 × 540 stage
// with one colour per quantity: pink the truth (p), blue one sample's result (p-hat, the QQ points), green
// the standard error, orange the margin of error and the interval arm, grey raw data, red a miss.
//   ci-flip-play  : margin of error to confidence interval (p 0.572, n 200: sigma 0.0350, E 0.0686, reach
//                   0.503 to 0.641; the sample 117/200 = 0.585 has E 0.0683 and arm 0.517 to 0.653;
//                   95 of 100 seeded arms cover p).
//   qq-build-play : a QQ plot built point by point as R draws it (qnorm(ppoints(n)) across, sorted data up,
//                   qqline through the type-7 quartiles).
import { el } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}
const C = { cream: "#fdf8ee", ink: "#2b2b33", pink: "#e64980", blue: "#3b5bdb", green: "#2b9e5f", orange: "#f08c00", grey: "#868e96", light: "#e9ecef", yellow: "#ffe066", red: "#e03131" };
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (f) => f * f * (3 - 2 * f);
const stepProg = (pos, i) => ease(clamp(pos - i, 0, 1));
/** Progress of a sub-phase [a, b] inside a step's progress t, eased. */
const sub = (t, a, b) => ease(clamp((t - a) / (b - a), 0, 1));
/** A cream outline behind a label that sits over a curve, so the curve never cuts through the letters. */
const HALO = { stroke: "#fdf8ee", "stroke-width": 6, "stroke-linejoin": "round", "paint-order": "stroke" };
const PH = "p̂";
const QH = "q̂";
const MINUS = "−";
/** Fixed decimals with a real minus sign. */
const fix = (v, d) => (v < 0 && Math.abs(v) >= 0.5 * 10 ** -d ? MINUS : "") + Math.abs(v).toFixed(d);
/** Up to d decimals, trailing zeros dropped, real minus sign. */
const trim = (v, d = 4) => { const r = Number(v.toFixed(d)); return (r < 0 ? MINUS : "") + String(Math.abs(r)); };
const SUBDIG = "₀₁₂₃₄₅₆₇₈₉";
const subNum = (k) => String(k).split("").map((c) => SUBDIG[+c]).join("");
let uid = 0;

/** Small seeded generator: the same frames on every visit. */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rng) { const u = 1 - rng(), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// ---------- the normal distribution (copied from widgets-cont.js) ----------
function phi(z) {
  const xa = Math.abs(z);
  let c;
  if (xa > 37) c = 0;
  else {
    const e = Math.exp(-xa * xa / 2);
    if (xa < 7.07106781186547) {
      let b = 3.52624965998911e-2 * xa + 0.700383064443688;
      b = b * xa + 6.37396220353165; b = b * xa + 33.912866078383; b = b * xa + 112.079291497871;
      b = b * xa + 221.213596169931; b = b * xa + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * xa + 1.75566716318264;
      b = b * xa + 16.064177579207; b = b * xa + 86.7807322029461; b = b * xa + 296.564248779674;
      b = b * xa + 637.333633378831; b = b * xa + 793.826512519948; b = b * xa + 440.413735824752;
      c = c / b;
    } else {
      let b = xa + 0.65;
      b = xa + 4 / b; b = xa + 3 / b; b = xa + 2 / b; b = xa + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return z > 0 ? 1 - c : c;
}
const normPdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
function phiInv(p) {
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
function niceStep(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const e = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 5, 10]) if (m * e >= v - 1e-12) return m * e;
  return 10 * e;
}
function ticksFor(x0, x1, step) {
  const out = [];
  for (let t = Math.ceil(x0 / step - 1e-9) * step; t <= x1 + 1e-9; t += step) out.push(Number(t.toFixed(10)));
  return out;
}
const decimalsOf = (step) => Math.max(0, -Math.floor(Math.log10(step) + 1e-9));

// ---------- drawing helpers (fixed stage colours, never CSS variables) ----------
function txt(g, x, y, s, a = {}) {
  const t = svgEl("text", { x, y, fill: C.ink, "font-size": 22, "text-anchor": "middle", ...a });
  t.textContent = s;
  g.append(t);
  return t;
}
/** One text line built from parts: a string, or { t, fill, sub, weight }; sub drops to a subscript. */
function rich(g, x, y, parts, a = {}) {
  const t = svgEl("text", { x, y, fill: C.ink, "font-size": 22, "text-anchor": "middle", ...a });
  let down = 0;
  for (const p of parts) {
    const q = typeof p === "string" ? { t: p } : p;
    const ts = svgEl("tspan", {});
    ts.textContent = q.t;
    if (q.fill) ts.setAttribute("fill", q.fill);
    if (q.weight) ts.setAttribute("font-weight", q.weight);
    if (q.sub) { ts.setAttribute("font-size", "70%"); ts.setAttribute("dy", 7); down = 7; }
    else if (down) { ts.setAttribute("dy", -down); down = 0; }
    t.append(ts);
  }
  g.append(t);
  return t;
}
function line(g, x1, y1, x2, y2, stroke, w = 3, a = {}) {
  const l = svgEl("line", { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), stroke, "stroke-width": w, "stroke-linecap": "round", ...a });
  g.append(l);
  return l;
}
function dot(g, x, y, r, fill, a = {}) {
  const c = svgEl("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: Math.max(0, r).toFixed(2), fill, ...a });
  g.append(c);
  return c;
}
/** An arrowhead at (x, y) pointing in direction dir (+1 right, −1 left). */
function head(g, x, y, dir, stroke, w = 3.5, a = {}) {
  g.append(svgEl("path", { d: `M${(x - dir * 12).toFixed(1)},${y - 8}L${x.toFixed(1)},${y}L${(x - dir * 12).toFixed(1)},${y + 8}`, fill: "none", stroke, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", ...a }));
}
function group(parent, opacity = 1, a = {}) {
  const g = svgEl("g", a);
  if (opacity < 1) g.setAttribute("opacity", Math.max(0, opacity).toFixed(3));
  parent.append(g);
  return g;
}
function bellPath(X, base, h, zr, closed) {
  let d = "";
  for (let i = 0; i <= 160; i++) {
    const z = -zr + (2 * zr * i) / 160;
    d += (i ? "L" : "M") + X(z).toFixed(1) + "," + (base - h * Math.exp(-z * z / 2)).toFixed(1);
  }
  return closed ? `M${X(-zr).toFixed(1)},${base}` + d.replace(/^M/, "L") + `L${X(zr).toFixed(1)},${base}Z` : d;
}
function bandPath(X, base, h, z0, z1) {
  let d = `M${X(z0).toFixed(1)},${base}`;
  for (let i = 0; i <= 100; i++) { const z = z0 + ((z1 - z0) * i) / 100; d += `L${X(z).toFixed(1)},${(base - h * Math.exp(-z * z / 2)).toFixed(1)}`; }
  return d + `L${X(z1).toFixed(1)},${base}Z`;
}

/** The film scaffold: optional title, scene line, stage, caption; the bar and controls are appended later. */
function filmShell(box, cfg) {
  if (typeof cfg.title === "string" && cfg.title.trim()) box.append(el("h4", null, cfg.title));
  const root = el("div", "film");
  const scene = el("p", "film-scene");
  const svg = svgEl("svg", { viewBox: "0 0 960 540", class: "film-stage", role: "img", "aria-label": "" });
  const caption = el("p", "film-caption");
  root.append(scene, svg, caption);
  box.append(root);
  function paint(sceneText, captionHtml) {
    if (scene.textContent !== sceneText) scene.textContent = sceneText;
    if (caption.innerHTML !== captionHtml) {
      caption.innerHTML = captionHtml; // built only from this file's strings and computed numbers
      svg.setAttribute("aria-label", caption.textContent);
    }
  }
  function clear() {
    svg.textContent = "";
    svg.append(svgEl("rect", { x: 0, y: 0, width: 960, height: 540, fill: C.cream }));
  }
  return { root, svg, paint, clear };
}
const span = (cls, s) => `<span class="${cls}">${s}</span>`;
function buttonRow(labels, onPick) {
  const row = el("div", "film-controls");
  const btns = labels.map((l, i) => {
    const b = el("button", "viz-btn", l);
    b.type = "button";
    b.addEventListener("click", () => onPick(i));
    row.append(b);
    return b;
  });
  return { row, btns, active(i) { btns.forEach((b, k) => { b.classList.toggle("active", k === i); b.setAttribute("aria-pressed", String(k === i)); }); } };
}

// =====================================================================================================
// ci-flip-play: from the margin of error (reach of the pile around p) to the confidence interval (the
// same reach measured from your one dot).
// =====================================================================================================
const CI_DEF = { p: 0.572, n: 200, level: 0.95, count: 100 };
const CI_SEED = 122; // with the defaults: 95 of 100 arms cover p (90 at 90%, 99 at 99%), 19 of the first 20
const Z_TABLE = [[0.9, 1.645], [0.95, 1.96], [0.99, 2.576]];
function zFor(level) {
  for (const [l, z] of Z_TABLE) if (Math.abs(level - l) < 1e-9) return z;
  return Math.round(phiInv((1 + level) / 2) * 1000) / 1000;
}
const pct = (v) => trim(v * 100, 2) + "%";

function ciFlipPlay(box, cfg) {
  const okNum = (v, lo, hi) => typeof v === "number" && Number.isFinite(v) && v >= lo && v <= hi;
  let p = okNum(cfg.p, 0.05, 0.95) ? cfg.p : CI_DEF.p;
  let n = okNum(cfg.n, 20, 2000) && Number.isInteger(cfg.n) ? cfg.n : CI_DEF.n;
  if (n * p < 5 || n * (1 - p) < 5) { p = CI_DEF.p; n = CI_DEF.n; }
  let level = okNum(cfg.level, 0.5, 0.999) ? cfg.level : CI_DEF.level;
  const count = okNum(cfg.count, 20, 400) && Number.isInteger(cfg.count) ? cfg.count : CI_DEF.count;
  const N5 = Math.min(20, count);
  const q = 1 - p, sig = Math.sqrt((p * q) / n), sdX = Math.sqrt(n * p * q);
  // the samples: the first is the notes' sample (117 of 200 for the defaults), the rest are seeded draws
  const rng = mulberry32(CI_SEED);
  const X = [clamp(Math.round(n * p + 0.4 * sdX), 1, n - 1)];
  for (let i = 1; i < count; i++) { let x = 0; for (let k = 0; k < n; k++) if (rng() < p) x++; X.push(x); }
  const SPAN = 5.6 * sig, XA = 40, XB = 920;
  const Xp = (v) => XA + ((v - (p - SPAN)) / (2 * SPAN)) * (XB - XA);
  const Xz = (z) => Xp(p + z * sig);
  const fp = trim(p, 4);
  const step = niceStep(sig * 1.2), tdec = decimalsOf(step), ticks = ticksFor(p - 5.2 * sig, p + 5.2 * sig, step);

  let M = null;
  function model() {
    const z = zFor(level), E = z * sig;
    const arms = X.map((x) => { const ph = x / n, e = z * Math.sqrt((ph * (1 - ph)) / n); return { x, ph, e, lo: ph - e, hi: ph + e, cover: ph - e <= p && p <= ph + e }; });
    let miss = null;
    const mk = (x) => { const ph = x / n, e = z * Math.sqrt((ph * (1 - ph)) / n); return { x, ph, e, lo: ph - e, hi: ph + e }; };
    for (let x = Math.ceil(n * (p + E)); x < n && !miss; x++) { const m = mk(x); if (m.lo > p + 0.35 * sig) miss = m; }
    for (let x = Math.floor(n * (p - E)); x > 0 && !miss; x--) { const m = mk(x); if (m.hi < p - 0.35 * sig) miss = m; }
    const cover = (k) => arms.slice(0, k).filter((a) => a.cover).length;
    return { z, zs: String(z), E, arms, miss, cover, tail: (1 - level) / 2 };
  }

  const shell = filmShell(box, cfg);
  const clipId = `q9b-ci-${++uid}`;
  const NAMES = ["the pile around the truth", "the reach", "your dot", "a dot that misses", "twenty samples", count === 100 ? "a hundred samples" : `${count} samples`, "what you really get"];

  function captionFor(k) {
    const { z, zs, E, arms, miss } = M, a = arms[0], L = pct(level), T = pct(M.tail);
    const sE = `${zs} × ${fix(sig, 4)} = ${fix(E, 4)}`;
    switch (k) {
      case 0: return `Every random sample of ${n} gives one share, ${span("blue", PH)}. Drop each share on a number line and watch where they land.`;
      case 1: return `The shares from all possible samples pile up in a bell centred on the true share, ${span("pink", `p = ${fp}`)}. One width of the pile is ${span("green", `σ<sub>${PH}</sub> = √(pq/n) = ${fix(sig, 4)}`)}.`;
      case 2: return `${L} of all samples land within ${span("orange", `E = ${sE}`)} of the truth: between ${fix(p - E, 3)} and ${fix(p + E, 3)}. The other ${pct(1 - level)} fall in the two tails, ${T} each.`;
      case 3: return `Your sample: ${a.x} of ${n}, so ${span("blue", `${PH} = ${a.x}/${n} = ${trim(a.ph, 4)}`)}, inside the band. Its ${span("orange", "arm")} reaches E = ${fix(a.e, 4)} each way, from ${fix(a.lo, 3)} to ${fix(a.hi, 3)}, and crosses the ${span("pink", "pink line")}. The dot is within E of the truth, so the truth is within E of the dot: the same distance, measured from the other end.`;
      case 4: return miss
        ? `This sample got ${span("blue", `${PH} = ${trim(miss.ph, 4)}`)}, out in a tail. Its arm, in red, stops short of the ${span("pink", "pink line")}: this interval misses p. That happens for the ${pct(1 - level)} of samples in the tails.`
        : `A sample in a tail has an arm that stops short of the pink line. That happens for the ${pct(1 - level)} of samples in the tails.`;
      case 5: {
        const c = M.cover(N5), m = N5 - c;
        return `${N5} samples, ${N5} arms. Each arm is its own ${span("blue", PH)} ± ${span("orange", `${zs}√(${PH}${QH}/n)`)}, so each has its own length. ${c} of ${N5} cross the ${span("pink", "pink line")}${m === 0 ? "." : m === 1 ? "; the red one misses." : `; the ${m} red ones miss.`}`;
      }
      case 6: {
        const c = M.cover(count);
        return `${count} samples: ${span("orange", `${c} of ${count} arms cover p`)}. About ${L} of arms catch the truth, because about ${L} of dots land within E of it.`;
      }
      default: return `In real life you get one arm and you never see the pink line: ${fix(a.lo, 3)} &lt; ${span("pink", "p")} &lt; ${fix(a.hi, 3)}. "${L} confident" means the method that made this arm catches the truth in ${L} of samples.`;
    }
  }

  function frame(pos) {
    pos = clamp(pos, 0, 7);
    const [s1, s2, s3, s4, s5, s6, s7] = [0, 1, 2, 3, 4, 5, 6].map((i) => stepProg(pos, i));
    const { z, E, arms, miss } = M;
    const mB = sub(s5, 0, 0.35); // the bell moves up for the stacked arms
    const AY = lerp(380, 160, mB);
    const grow1 = sub(s1, 0, 0.55);
    const BH = lerp(250, 95, mB) * grow1;
    const fade7 = 1 - sub(s7, 0, 0.4);
    const out5 = 1 - sub(s5, 0, 0.25);
    shell.clear();
    const svg = shell.svg;
    const defs = svgEl("defs");
    const cp = svgEl("clipPath", { id: clipId });
    cp.append(svgEl("rect", { x: XA - 6, y: 0, width: XB - XA + 12, height: 540 }));
    defs.append(cp);
    svg.append(defs);

    // the number line
    const gAx = group(svg, fade7);
    line(gAx, XA, AY, XB, AY, C.grey, 2.5);
    txt(gAx, XB + 14, AY + 8, PH, { fill: C.grey, "font-size": 26, "text-anchor": "start" });
    const tickO = 1 - sub(s2, 0, 0.3);
    if (tickO > 0) {
      const gt = group(gAx, tickO);
      for (const t of ticks) { line(gt, Xp(t), AY, Xp(t), AY + 9, C.grey, 2); txt(gt, Xp(t), AY + 34, t.toFixed(tdec), { fill: C.grey, "font-size": 19 }); }
    }

    // the pile: a smooth blue-tinted bell
    if (BH > 0.5) {
      group(svg, fade7).append(svgEl("path", { d: bellPath(Xz, AY, BH, 4.4, true), fill: C.blue, "fill-opacity": lerp(0.13, 0.05, mB).toFixed(3) }));
    }
    // the middle share, shaded yellow
    const yO = sub(s2, 0, 0.4) * (1 - mB);
    if (yO > 0) group(svg, yO).append(svgEl("path", { d: bandPath(Xz, AY, BH, -z, z), fill: C.yellow, "fill-opacity": 0.6 }));
    if (BH > 0.5) group(svg, fade7 * lerp(1, 0.4, mB)).append(svgEl("path", { d: bellPath(Xz, AY, BH, 4.4, false), fill: "none", stroke: C.blue, "stroke-width": 3.5, "stroke-linecap": "round" }));

    // green: one width each side
    const gO = sub(s1, 0.55, 1) * (1 - sub(s3, 0, 0.25));
    if (gO > 0) {
      const g = group(svg, gO), y = AY - BH * Math.exp(-0.5), w = sub(s1, 0.55, 0.9);
      for (const d of [-1, 1]) { line(g, Xz(0), y, Xz(d * w), y, C.green, 4); if (w > 0.3) head(g, Xz(d * w), y, d, C.green); }
      rich(g, Xz(1) + 16, y + 8, ["σ", { t: PH, sub: true }, ` = ${fix(sig, 4)}`], { fill: C.green, "font-size": 24, "text-anchor": "start" });
    }

    // scene 2: the reach E each side of the truth
    const r2 = (1 - sub(s3, 0, 0.25));
    if (s2 > 0 && r2 > 0) {
      const g = group(svg, r2), w = sub(s2, 0.3, 0.75), ya = AY - 24;
      if (w > 0) for (const d of [-1, 1]) { line(g, Xz(0), ya, Xz(d * z * w), ya, C.orange, 4); if (w > 0.2) head(g, Xz(d * z * w), ya, d, C.orange); }
      const lab = sub(s2, 0.7, 1);
      if (lab > 0) {
        const gl = group(g, lab);
        for (const d of [-1, 1]) {
          line(gl, Xz(d * z), AY - 6, Xz(d * z), AY + 10, C.orange, 3);
          txt(gl, Xz(d * z), AY + 34, fix(p + d * E, 3), { fill: C.orange, "font-size": 22, "font-weight": 600 });
          txt(gl, Xz(d * (z + 1.05)), AY - 12, pct(M.tail), { ...HALO, fill: C.ink, "font-size": 20 });
        }
        txt(gl, Xz(-Math.min(0.8, z / 2)), AY - 66, pct(level), { fill: C.ink, "font-size": 26, "font-weight": 600 });
        txt(gl, Xz(0), AY + 78, `E = ${M.zs} × ${fix(sig, 4)} = ${fix(E, 4)}`, { fill: C.orange, "font-size": 24, "font-weight": 600 });
      }
    }
    // the truth's value under the line (scenes 2 to 4)
    const pvO = sub(s2, 0.3, 0.6) * out5;
    // (it steps left of the pink line in scene 4, when the line runs down through this row)
    if (pvO > 0) txt(group(svg, pvO), Xz(0) - 40 * sub(s4, 0, 0.3), AY + 34, fp, { fill: C.pink, "font-size": 22, "font-weight": 600 });

    // the pink line, the truth
    if (grow1 > 0) {
      const g = group(svg, fade7 * (1 - sub(s7, 0.2, 0.6)));
      const top = AY - BH - 22 * grow1, bottom = lerp(lerp(380, 500, sub(s4, 0, 0.3)), 512, mB);
      line(g, Xz(0), bottom, Xz(0), top, C.pink, 4);
      txt(g, Xz(0), top - 12, `p = ${fp}`, { fill: C.pink, "font-size": 26, "font-weight": 600 });
    }

    // the arms (clipped to the line's range)
    const gArms = group(svg, 1, { "clip-path": `url(#${clipId})` });
    const spacing = (i, N) => 200 + i * (305 / Math.max(1, N - 1));
    const wEnd = clamp((305 / Math.max(1, count - 1)) * 0.6, 1.6, 4), rEnd = clamp((305 / Math.max(1, count - 1)) * 0.75, 2.2, 5);
    const c6 = sub(s6, 0, 0.25);
    function arm(g, a, y, grow, w, r, color, dotO = 1) {
      if (grow > 0) {
        const x0 = Xp(a.ph - a.e * grow), x1 = Xp(a.ph + a.e * grow);
        line(g, x0, y, x1, y, color, w);
        if (w >= 3) { line(g, x0, y - w * 2, x0, y + w * 2, color, w * 0.7); line(g, x1, y - w * 2, x1, y + w * 2, color, w * 0.7); }
      }
      if (dotO > 0) dot(g, Xp(a.ph), y, r, C.blue, dotO < 1 ? { opacity: dotO.toFixed(3) } : {});
    }
    // rows 1.. (scenes 5 and 6), fading in scene 7
    if (s5 > 0.35 && fade7 > 0) {
      const g = group(gArms, fade7);
      for (let i = 1; i < count; i++) {
        let a, y;
        if (i < N5) { a = clamp(((s5 - 0.35) / 0.6) * (N5 - 1) - (i - 1), 0, 1); y = lerp(spacing(i, N5), spacing(i, count), c6); }
        else { a = clamp(((s6 - 0.25) / 0.75) * (count - N5) - (i - N5), 0, 1); y = spacing(i, count); }
        if (a <= 0) continue;
        arm(g, arms[i], y, a, lerp(4, wEnd, c6), lerp(5, rEnd, c6), arms[i].cover ? C.orange : C.red, Math.min(1, a * 3));
      }
    }
    // row 0: your sample, from scene 3 to the end
    const a0 = arms[0];
    const fall = sub(s3, 0.1, 0.45);
    if (fall > 0) {
      const mv4 = sub(s4, 0, 0.3), m7 = sub(s7, 0.3, 0.7);
      let y = 380; y = lerp(y, 470, mv4); y = lerp(y, spacing(0, N5), mB); y = lerp(y, spacing(0, count), c6); y = lerp(y, 330, m7);
      let w = 5; w = lerp(w, 4, mB); w = lerp(w, wEnd, c6); w = lerp(w, 6, m7);
      let r = 7; r = lerp(r, 5, mB); r = lerp(r, rEnd, c6); r = lerp(r, 9, m7);
      const g = group(gArms);
      arm(g, a0, y, sub(s3, 0.45, 0.8), w, r, C.orange, 0);
      dot(g, Xp(a0.ph), lerp(30, y, fall), r, C.blue);
      // its labels in scenes 3 and 4
      const l3 = sub(s3, 0.8, 1) * out5;
      if (l3 > 0) {
        const gl = group(svg, l3);
        txt(gl, Xp(a0.ph) + 12, y - 22, `${PH} = ${trim(a0.ph, 4)}`, { ...HALO, fill: C.blue, "font-size": 24, "font-weight": 600, "text-anchor": "start" });
        txt(gl, Xp(a0.lo), y + 34, fix(a0.lo, 3), { fill: C.orange, "font-size": 22, "font-weight": 600 });
        txt(gl, Xp(a0.hi), y + 34, fix(a0.hi, 3), { fill: C.orange, "font-size": 22, "font-weight": 600 });
        const eO = 1 - sub(s4, 0, 0.3);
        if (eO > 0) {
          const s = `E = ${M.zs} × √(${trim(a0.ph, 4)} × ${trim(1 - a0.ph, 4)} / ${n}) = ${fix(a0.e, 4)}`;
          txt(group(gl, eO), clamp(Xp(a0.ph), 300, 660), 380 + 78, s, { fill: C.orange, "font-size": 22, "font-weight": 600 });
        }
      }
      // its labels in scene 7
      const l7 = sub(s7, 0.7, 1);
      if (l7 > 0) {
        const gl = group(svg, l7);
        txt(gl, Xp(a0.ph), y - 26, `${PH} = ${trim(a0.ph, 4)}`, { fill: C.blue, "font-size": 26, "font-weight": 600 });
        txt(gl, Xp(a0.lo), y + 46, fix(a0.lo, 3), { fill: C.orange, "font-size": 28, "font-weight": 600 });
        txt(gl, Xp(a0.hi), y + 46, fix(a0.hi, 3), { fill: C.orange, "font-size": 28, "font-weight": 600 });
        rich(gl, 480, 110, [`${pct(level)} confidence interval for `, { t: "p", fill: C.pink }], { "font-size": 24 });
        rich(gl, 480, 172, [`${fix(a0.lo, 3)} < `, { t: "p", fill: C.pink }, ` < ${fix(a0.hi, 3)}`], { "font-size": 36, "font-weight": 600 });
        txt(gl, 480, 450, `E = ${M.zs} × √(${trim(a0.ph, 4)} × ${trim(1 - a0.ph, 4)} / ${n}) = ${fix(a0.e, 4)}`, { fill: C.orange, "font-size": 22, "font-weight": 600 });
      }
    }
    // scene 4: a dot in a tail, its arm in red
    if (miss && s4 > 0.3 && out5 > 0) {
      const g = group(gArms, out5), f = sub(s4, 0.3, 0.6);
      arm(g, miss, 380, sub(s4, 0.6, 0.85), 5, 7, C.red, 0);
      dot(g, Xp(miss.ph), lerp(30, 380, f), 7, C.blue);
      const l = sub(s4, 0.85, 1);
      if (l > 0) {
        const gl = group(svg, l * out5);
        const side = miss.ph > p ? 1 : -1;
        txt(gl, Xp(miss.ph) + side * 12, 380 - 30, `${PH} = ${trim(miss.ph, 4)}`, { ...HALO, fill: C.blue, "font-size": 24, "font-weight": 600, "text-anchor": side > 0 ? "start" : "end" });
        txt(gl, Xp(miss.ph), 380 + 34, "misses p", { fill: C.red, "font-size": 22, "font-weight": 600 });
      }
    }
    // the counter (scenes 5 and 6)
    const cO = sub(s5, 0.35, 0.5) * fade7;
    if (cO > 0) {
      let drawn = 1, cov = arms[0].cover ? 1 : 0;
      for (let i = 1; i < count; i++) {
        const a = i < N5 ? clamp(((s5 - 0.35) / 0.6) * (N5 - 1) - (i - 1), 0, 1) : clamp(((s6 - 0.25) / 0.75) * (count - N5) - (i - N5), 0, 1);
        if (a >= 1) { drawn++; if (arms[i].cover) cov++; }
      }
      const g = group(svg, cO);
      txt(g, 930, 70, `${cov} of ${drawn}`, { fill: C.orange, "font-size": 36, "font-weight": 600, "text-anchor": "end" });
      rich(g, 930, 102, ["arms cover ", { t: "p", fill: C.pink }], { fill: C.orange, "font-size": 22, "font-weight": 600, "text-anchor": "end" });
    }

    const k = pos < 1e-9 ? 0 : clamp(Math.ceil(pos - 1e-9), 1, 7);
    shell.paint(`Scene ${Math.max(1, k)} of 7 · ${NAMES[Math.max(1, k) - 1]}`, captionFor(k));
  }

  M = model();
  const pb = createPlayback({ count: 7, unit: "scene", stepMs: () => cfg.stepMs || 2600, onFrame: frame });
  const LEVELS = [0.9, 0.95, 0.99];
  const ctl = buttonRow(["90%", "95%", "99%"], (i) => { level = LEVELS[i]; ctl.active(i); M = model(); pb.reset(); });
  ctl.active(LEVELS.findIndex((l) => Math.abs(l - level) < 1e-9));
  shell.root.append(pb.el, ctl.row);
  return pb;
}

// =====================================================================================================
// qq-build-play: a QQ plot built point by point, as qqnorm and qqline draw it.
// =====================================================================================================
const QQ_SHAPES = ["normal", "right", "left", "heavy", "flat", "bimodal"];
const QQ_LABELS = ["normal", "right skew", "left skew", "heavy tails", "flat", "bimodal"];
// Seeds checked at n = 30 and n = 100 (scratch seeds.mjs): each shows its textbook pattern.
const QQ_SEEDS = {
  normal: [468, 1397, 1800, 1803, 2489, 2729, 2962, 3189],
  right: [1, 4, 5, 7, 8, 10, 12, 14],
  left: [1, 4, 5, 7, 8, 10, 12, 14],
  heavy: [2, 15, 28, 31, 46, 48, 51, 52],
  flat: [2, 5, 6, 9, 13, 17, 18, 20],
  bimodal: [6, 7, 13, 16, 21, 29, 40, 53],
};
function qqDraw(shape, rng) {
  switch (shape) {
    case "right": return 1 + -2 * Math.log(1 - rng());
    case "left": return 9 - -2 * Math.log(1 - rng());
    case "heavy": { const z = gauss(rng); let c = 0; for (let k = 0; k < 3; k++) { const g = gauss(rng); c += g * g; } return 4 + 1.5 * z / Math.sqrt(c / 3); }
    case "flat": return rng();
    case "bimodal": return rng() < 0.45 ? 125 + 10.8 * gauss(rng) : 170.4 + 9.3 * gauss(rng);
    default: return 4 + 2 * gauss(rng);
  }
}
/** R's quantile(x, prob) with the default type 7, on sorted s. */
function quantile7(s, prob) {
  const h = (s.length - 1) * prob, lo = Math.floor(h);
  return lo + 1 < s.length ? s[lo] + (h - lo) * (s[lo + 1] - s[lo]) : s[lo];
}
/** R's ppoints(n): (i − a)/(n + 1 − 2a), a = 3/8 when n ≤ 10, else 1/2. */
const ppoints = (n) => { const a = n <= 10 ? 3 / 8 : 0.5; return Array.from({ length: n }, (_, i) => (i + 1 - a) / (n + 1 - 2 * a)); };
const QQ_VERDICT = {
  normal: ["Follows the line", "consistent with a normal population", "The points follow the line: the sample is consistent with a normal population. A wobble at the two ends is typical."],
  right: ["Right skewed", "climbs above the line at the right", "Flat at the left, climbing above the line at the right: the large values are much larger than a bell allows. Right skewed, not normal."],
  left: ["Left skewed", "drops below the line at the left", "Flat at the right, dropping below the line at the left: the small values are much smaller than a bell allows. Left skewed, not normal."],
  heavy: ["Heavy tails", "low at the left end, high at the right", "Below the line at the left end and above it at the right end: both tails reach too far. Not normal."],
  flat: ["No tails", "an S, flat at both ends", "An S that flattens at both ends: no tails at all. Not normal."],
  bimodal: ["Two clusters", "two flat runs and a jump", "Two flat runs with a jump between them: two clusters. Not normal."],
};

function qqBuildPlay(box, cfg) {
  const userData = Array.isArray(cfg.data) && cfg.data.length >= 5 && cfg.data.length <= 400 && cfg.data.every((v) => typeof v === "number" && Number.isFinite(v)) && Math.max(...cfg.data) > Math.min(...cfg.data) ? cfg.data.slice() : null;
  const st = {
    shape: QQ_SHAPES.includes(cfg.shape) ? cfg.shape : "normal",
    n: Number.isInteger(cfg.n) ? clamp(cfg.n, 8, 120) : 30,
    data: userData,
    seedIdx: 0,
  };
  const LX = 74, SX0 = 104, SX1 = 340, PX0 = 486, PX1 = 930, PY0 = 40, PY1 = 420;
  let M = null;
  function model() {
    let vals;
    if (st.data) vals = st.data;
    else {
      const list = QQ_SEEDS[st.shape], k = st.seedIdx;
      const seed = list[k % list.length] + 10007 * Math.floor(k / list.length);
      const rng = mulberry32(seed);
      vals = Array.from({ length: st.n }, () => qqDraw(st.shape, rng));
    }
    const n = vals.length;
    const order = vals.map((v, j) => j).sort((a, b) => vals[a] - vals[b] || a - b);
    const rank = new Array(n);
    order.forEach((j, r) => { rank[j] = r; });
    const s = order.map((j) => vals[j]);
    const z = ppoints(n).map(phiInv);
    const z1 = phiInv(0.25), z3 = phiInv(0.75), Q1 = quantile7(s, 0.25), Q3 = quantile7(s, 0.75);
    const slope = (Q3 - Q1) / (z3 - z1), at = (zz) => Q1 + slope * (zz - z1);
    const res = s.map((v, i) => (slope > 0 ? (v - at(z[i])) / slope : 0));
    const mz = z.reduce((a, b) => a + b, 0) / n, ms = s.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (z[i] - mz) * (s[i] - ms); sxx += (z[i] - mz) ** 2; syy += (s[i] - ms) ** 2; }
    const r = sxy / Math.sqrt(sxx * syy);
    const lo = s[0], hi = s[n - 1], pad = (hi - lo) * 0.07;
    const y0 = lo - pad, y1 = hi + pad;
    const vstep = niceStep((y1 - y0) / 5), vticks = ticksFor(y0, y1, vstep), vdec = decimalsOf(vstep);
    const allInt = vals.every((v) => Number.isInteger(v));
    const span = hi - lo, dec = allInt ? 0 : span >= 200 ? 0 : span >= 20 ? 1 : 2;
    const zr = Math.max(2.2, Math.abs(z[0]) + 0.3);
    const ring = res.map((v) => Math.abs(v) > 0.45);
    return { vals, n, order, rank, s, z, z1, z3, Q1, Q3, slope, at, res, r, y0, y1, vticks, vdec, dec, zr, ring };
  }
  const shell = filmShell(box, cfg);
  const clipId = `q9b-qq-${++uid}`;
  const NAMES = ["the sample", "sort them", "where a perfect normal sample would sit", "pair them up", "the reference line", "the verdict"];
  const fv = (v) => fix(v, M.dec);
  const fz = (v) => fix(v, 2);
  const fq = (v) => trim(v, Math.max(2, M.dec));

  function verdict() {
    if (!st.data) return QQ_VERDICT[st.shape];
    const rs = M.r.toFixed(3);
    return M.r < 0.975
      ? ["Bends away from the line", `r = ${rs}, below 0.975`, `The points bend away from the line (the correlation of the QQ points is ${rs}, below 0.975): the sample may not come from a normal population.`]
      : ["Close to the line", `r = ${rs}`, `The points stay close to the line (the correlation of the QQ points is ${rs}): the sample is consistent with a normal population. A wobble at the two ends is typical.`];
  }
  function pairCaption(i) {
    return `Pair them up: the ${ord(i + 1)} smallest value, ${fv(M.s[i])}, goes up; the ${ord(i + 1)} ideal Z, ${span("pink", fz(M.z[i]))}, goes across. A ${span("blue", "blue point")} lands where they cross.`;
  }
  function captionFor(k, pos) {
    const { n, s, z, Q1, Q3 } = M;
    const formula = n <= 10 ? "(i − 3/8)/(n + 1/4)" : "(i − 0.5)/n";
    switch (k) {
      case 0: return `${st.data ? `Your ${n} numbers are` : `A sample of ${n} numbers is`} about to arrive. The question for the whole film: could they come from a bell-shaped (normal) population?`;
      case 1: return `${n} numbers, in the order they were drawn, from ${fv(Math.min(...M.vals))} to ${fv(Math.max(...M.vals))}. Do they come from a bell-shaped population? With only ${n} values the histogram is too lumpy to tell.`;
      case 2: return `Sort them, smallest to largest: ${fv(s[0])} first, ${fv(s[n - 1])} last. Each value keeps its height.`;
      case 3: return `In a normal sample most values sit near the middle and a few far out. The ${span("pink", "pink ticks")} are the Z-scores the 1st, 2nd, ..., ${ord(n)} smallest value should have: ${span("pink", `qnorm(${formula})`)}, from ${span("pink", fz(z[0]))} to ${span("pink", fz(z[n - 1]))}.`;
      case 4: {
        const u = stepProg(pos, 3) * n;
        if (pos < 4 - 1e-9 && u > 0) return pairCaption(Math.min(n - 1, Math.floor(u)));
        return `All ${n} pairs are placed: value up, ideal Z across. If the sample came from a normal population, these ${span("blue", "blue points")} would lie close to a straight line.`;
      }
      case 5: return `qqline draws the red dashed reference line through the first and third quartiles: (${fix(M.z1, 3)}, Q1 = ${fq(Q1)}) and (${fix(M.z3, 3)}, Q3 = ${fq(Q3)}), with R's default quantile rule.`;
      default: return verdict()[2];
    }
  }
  const ord = (k) => { const t = k % 100; return k + (t >= 11 && t <= 13 ? "th" : ["th", "st", "nd", "rd"][k % 10] || "th"); };

  function frame(pos) {
    pos = clamp(pos, 0, 6);
    const [s1, s2, s3, s4, s5, s6] = [0, 1, 2, 3, 4, 5].map((i) => stepProg(pos, i));
    const { n, vals, rank, s, z, zr, y0, y1 } = M;
    const Y = (v) => PY1 - ((v - y0) / (y1 - y0)) * (PY1 - PY0);
    const Xq = (zz) => PX0 + ((zz + zr) / (2 * zr)) * (PX1 - PX0);
    const sx = (j) => SX0 + (n > 1 ? (j * (SX1 - SX0)) / (n - 1) : 0);
    const rD = clamp(((SX1 - SX0) / Math.max(1, n - 1)) * 0.6, 2.6, 6);
    shell.clear();
    const svg = shell.svg;
    const defs = svgEl("defs"), cp = svgEl("clipPath", { id: clipId });
    cp.append(svgEl("rect", { x: PX0, y: PY0 - 10, width: PX1 - PX0, height: PY1 - PY0 + 10 }));
    defs.append(cp);
    svg.append(defs);

    // left: the value axis
    const gL = group(svg);
    line(gL, LX, PY0, LX, PY1, C.grey, 2.5);
    for (const t of M.vticks) { line(gL, LX - 8, Y(t), LX, Y(t), C.grey, 2); txt(gL, LX - 13, Y(t) + 6, fix(t, M.vdec), { fill: C.grey, "font-size": 19, "text-anchor": "end" }); }
    txt(gL, LX, PY0 - 14, "value", { fill: C.grey, "font-size": 19 });
    // rug: the sorted values on the axis
    const rugO = sub(s2, 0.5, 1);
    if (rugO > 0) { const g = group(gL, rugO); for (const v of s) line(g, LX, Y(v), LX + 12, Y(v), C.grey, 2); }
    // strip labels
    const l1 = sub(s1, 0, 0.2) * (1 - sub(s2, 0, 0.4)), l2 = sub(s2, 0.5, 1) * (1 - sub(s4, 0, 0.3));
    if (l1 > 0) txt(group(gL, l1), (SX0 + SX1) / 2, PY1 + 34, "in the order drawn →", { fill: C.grey, "font-size": 19 });
    if (l2 > 0) txt(group(gL, l2), (SX0 + SX1) / 2, PY1 + 34, "smallest to largest →", { fill: C.grey, "font-size": 19 });

    // the sample dots: fall in draw order (scene 1), slide into sorted order (scene 2)
    const sortT = s2;
    const u4 = s4 * n, cur = s4 > 0 && s4 < 1 ? Math.min(n - 1, Math.floor(u4)) : -1;
    const landed = new Array(n);
    const gD = group(svg);
    for (let j = 0; j < n; j++) {
      const t0 = 0.05 + (0.75 * j) / n, f = sub(s1, t0, t0 + 0.2);
      landed[j] = sub(s1, t0 + 0.16, t0 + 0.2);
      if (f <= 0) continue;
      const x = lerp(sx(j), sx(rank[j]), sortT), y = lerp(12, Y(vals[j]), f);
      const isCur = rank[j] === cur;
      dot(gD, x, y, isCur ? rD + 2 : rD, isCur ? C.blue : C.grey, f < 1 ? { opacity: Math.min(1, f * 4).toFixed(3) } : {});
    }

    // right, scene 1: a small dot histogram of the values (fades as the plot frame arrives)
    const hO = 1 - sub(s2, 0, 0.4);
    if (s1 > 0 && hO > 0) {
      const g = group(svg, hO);
      const bins = Math.max(5, Math.ceil(Math.log2(n) + 1)), lo = s[0], hi = s[n - 1], bw = (hi - lo) / bins;
      const HX0 = PX0 + 10, HX1 = PX1 - 10, base = 330, colW = (HX1 - HX0) / bins;
      const counts = new Array(bins).fill(0);
      for (const v of vals) counts[Math.min(bins - 1, Math.floor((v - lo) / bw))]++;
      const maxC = Math.max(...counts), rH = Math.min(colW * 0.36, 230 / (maxC * 2.1), 9);
      const filled = new Array(bins).fill(0);
      for (let j = 0; j < n; j++) {
        if (landed[j] <= 0) continue;
        const b = Math.min(bins - 1, Math.floor((vals[j] - lo) / bw)), h = filled[b]++;
        dot(g, HX0 + (b + 0.5) * colW, base - rH - h * rH * 2.1, rH, C.grey, { opacity: landed[j].toFixed(3) });
      }
      line(g, HX0, base + 4, HX1, base + 4, C.grey, 2.5);
      for (const v of [lo, hi]) txt(g, HX0 + ((v - lo) / (hi - lo)) * (HX1 - HX0), base + 30, fv(v), { fill: C.grey, "font-size": 19 });
      txt(g, (HX0 + HX1) / 2, base + 62, "histogram of the same values", { fill: C.grey, "font-size": 19 });
    }

    // right: the QQ plot frame (from scene 2)
    const fO = sub(s2, 0.4, 1);
    if (fO > 0) {
      const g = group(svg, fO);
      line(g, PX0, PY0, PX0, PY1, C.ink, 2.5);
      line(g, PX0, PY1, PX1, PY1, C.ink, 2.5);
      for (const t of M.vticks) { line(g, PX0 - 8, Y(t), PX0, Y(t), C.ink, 2); txt(g, PX0 - 13, Y(t) + 6, fix(t, M.vdec), { fill: C.grey, "font-size": 19, "text-anchor": "end" }); }
      for (let t = -Math.floor(zr); t <= Math.floor(zr); t++) { line(g, Xq(t), PY1, Xq(t), PY1 + 8, C.ink, 2); txt(g, Xq(t), PY1 + 32, t < 0 ? MINUS + -t : String(t), { fill: C.grey, "font-size": 19 }); }
      txt(g, (PX0 + PX1) / 2, PY1 + 66, "Theoretical Quantiles", { fill: C.ink, "font-size": 21 });
      const yt = (PY0 + PY1) / 2;
      txt(g, PX0 - 74, yt, "Sample Quantiles", { fill: C.ink, "font-size": 21, transform: `rotate(-90 ${PX0 - 74} ${yt})` });
    }

    // scene 3: the ideal Z positions under a faint standard bell
    const bO = sub(s3, 0, 0.35) * (1 - sub(s4, 0, 0.3));
    if (bO > 0) {
      const g = group(svg, bO);
      g.append(svgEl("path", { d: bellPath(Xq, PY1, 120, zr, true), fill: C.pink, "fill-opacity": 0.08 }));
      g.append(svgEl("path", { d: bellPath(Xq, PY1, 120, zr, false), fill: "none", stroke: C.pink, "stroke-opacity": 0.55, "stroke-width": 2.5 }));
    }
    const tk = sub(s3, 0.3, 0.8);
    if (tk > 0) {
      const g = group(svg);
      for (let i = 0; i < n; i++) line(g, Xq(z[i]), PY1, Xq(z[i]), PY1 - 18 * tk, C.pink, n > 60 ? 2 : 2.5);
    }
    const fmO = sub(s3, 0.6, 1) * (1 - sub(s4, 0, 0.25));
    if (fmO > 0) {
      const g = group(svg, fmO), a = n <= 10 ? "(i − 3/8)/(n + 1/4)" : `(i − 0.5)/${n}`;
      txt(g, PX0 + 18, PY0 + 26, `ideal Z = qnorm(${a})`, { ...HALO, fill: C.pink, "font-size": 22, "font-weight": 600, "text-anchor": "start" });
      txt(g, PX0 + 18, PY0 + 56, `Z${subNum(1)} = ${fz(z[0])}  …  Z${subNum(n)} = ${fz(z[n - 1])}`, { ...HALO, fill: C.pink, "font-size": 20, "text-anchor": "start" });
    }

    // scene 4: pair them up
    if (s4 > 0) {
      const g = group(svg), rP = n > 60 ? 4 : 5.5;
      if (cur >= 0) {
        const yv = Y(s[cur]), xz = Xq(z[cur]);
        // across from the sorted dot to the point, with a gap behind the plot's value labels and title
        line(g, sx(cur) + rD + 4, yv, PX0 - 100, yv, C.blue, 1.6, { "stroke-dasharray": "5 6", opacity: 0.8 });
        line(g, PX0, yv, xz, yv, C.blue, 1.6, { "stroke-dasharray": "5 6", opacity: 0.8 });
        line(g, xz, PY1, xz, yv, C.pink, 1.6, { "stroke-dasharray": "5 6", opacity: 0.9 });
      }
      for (let i = 0; i < n; i++) {
        const a = clamp(u4 - i, 0, 1);
        if (a <= 0) break;
        dot(g, Xq(z[i]), Y(s[i]), rP * (0.4 + 0.6 * a), C.blue, a < 1 ? { opacity: a.toFixed(3) } : {});
      }
    }

    // scene 5: the reference line through the quartile points
    // labels go top-left, except a left-skewed sample fills that corner: use the empty bottom-right
    const lowR = st.shape === "left" && !st.data, LBX = lowR ? PX1 - 12 : PX0 + 18, LBY = lowR ? PY1 - 110 : PY0, LBA = lowR ? "end" : "start";
    if (s5 > 0) {
      const g = group(svg, 1, { "clip-path": `url(#${clipId})` }), w = sub(s5, 0, 0.8);
      const za = -zr * w, zb = zr * w;
      line(g, Xq(za), Y(M.at(za)), Xq(zb), Y(M.at(zb)), C.red, 3, { "stroke-dasharray": "12 9" });
      const q = sub(s5, 0.6, 1);
      if (q > 0) {
        const gq = group(svg, q);
        for (const [zz, v] of [[M.z1, M.Q1], [M.z3, M.Q3]]) {
          const x = Xq(zz), y = Y(v);
          line(gq, x - 8, y - 8, x + 8, y + 8, C.red, 3); line(gq, x - 8, y + 8, x + 8, y - 8, C.red, 3);
        }
        // the label sits top-left (always empty for rising points) and gives way to the verdict
        const gt = group(gq, 1 - sub(s6, 0, 0.35));
        txt(gt, LBX, LBY + 26, "qqline: through the quartiles", { ...HALO, fill: C.red, "font-size": 22, "font-weight": 600, "text-anchor": LBA });
        txt(gt, LBX, LBY + 56, `Q1 = ${fq(M.Q1)} and Q3 = ${fq(M.Q3)}`, { ...HALO, fill: C.red, "font-size": 20, "text-anchor": LBA });
      }
    }

    // scene 6: the verdict
    if (s6 > 0) {
      const g = group(svg, sub(s6, 0, 0.5));
      for (let i = 0; i < n; i++) if (M.ring[i]) g.append(svgEl("circle", { cx: Xq(z[i]).toFixed(1), cy: Y(s[i]).toFixed(1), r: n > 60 ? 9 : 11, fill: "none", stroke: C.red, "stroke-width": 2.5 }));
      const [v1, v2] = verdict(), normal = st.data ? M.r >= 0.975 : st.shape === "normal";
      const gv = group(svg, sub(s6, 0.4, 1));
      txt(gv, LBX, LBY + 30, v1, { ...HALO, fill: normal ? C.ink : C.red, "font-size": 30, "font-weight": 600, "text-anchor": LBA });
      txt(gv, LBX, LBY + 62, v2, { ...HALO, fill: normal ? C.ink : C.red, "font-size": 20, "text-anchor": LBA });
    }

    const k = pos < 1e-9 ? 0 : clamp(Math.ceil(pos - 1e-9), 1, 6);
    shell.paint(`Scene ${Math.max(1, k)} of 6 · ${NAMES[Math.max(1, k) - 1]}`, captionFor(k, pos));
  }

  M = model();
  const pb = createPlayback({ count: 6, unit: "scene", stepMs: () => cfg.stepMs || 2600, onFrame: frame });
  const labels = [...QQ_LABELS, ...(userData ? ["your data"] : []), "new sample"];
  const ctl = buttonRow(labels, (i) => {
    if (i < QQ_SHAPES.length) { st.shape = QQ_SHAPES[i]; st.data = null; st.seedIdx = 0; }
    else if (userData && i === QQ_SHAPES.length) { st.data = userData; }
    else { if (st.data) return; st.seedIdx++; }
    sync();
    M = model();
    pb.reset();
  });
  function sync() {
    ctl.active(st.data ? QQ_SHAPES.length : QQ_SHAPES.indexOf(st.shape));
    const nb = ctl.btns[ctl.btns.length - 1];
    nb.classList.remove("active");
    nb.removeAttribute("aria-pressed");
    nb.disabled = !!st.data;
  }
  sync();
  shell.root.append(pb.el, ctl.row);
  return pb;
}

export const WIDGETS = {
  "ci-flip-play": ciFlipPlay,
  "qq-build-play": qqBuildPlay,
};
