// Film-style playback animations for MATH 3042 Quiz 9 (sampling distributions), built on app/playback.js.
// sample-pile-play builds "the pile" from nothing in 8 scenes: the population and its hidden truth, one
// sample, boiled down to one number, dropped on a line, more samples, 1000 samples piling into a bell, the
// centre (pink, the truth) and the width (green, the standard error) with the bell check. Defaults reproduce
// the notes: iPhone users p = 0.572, n = 200, first sample X = 117 so p-hat = 0.585, sigma of p-hat = 0.0350,
// np = 114.4, nq = 85.6; IQ mu = 100, sigma = 15, n = 25, standard error 3.
// xbar-n-play shows one step per sample size: the population on top, 20 000 simulated sample means below on
// the same axis, the normal curve with sd sigma/sqrt(n), and the verdict (Lab 9: 15, 10.61, 4.74, 2.12, 1.5;
// exponential 0.25, 0.1768, 0.0791, 0.0354, 0.025; dice 1.71, 1.21 at n = 2, 0.242 at n = 50).
// Every frame is a pure function of the playback position; all randomness is seeded (mulberry32).
import { el, esc } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const C = {
  cream: "#fdf8ee", ink: "#2b2b33", pink: "#e64980", blue: "#3b5bdb", green: "#2b9e5f", orange: "#f08c00",
  grey: "#868e96", light: "#e9ecef", dark: "#495057", red: "#e03131",
};
const PH = "p̂", XB = "x̄", MINUS = "−";

function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (f) => f * f * (3 - 2 * f);
const npdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

/** Up to d decimals, trailing zeros dropped, a real minus sign. */
function num(v, d = 4) {
  let s = (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);
  if (s.includes(".")) s = s.replace(/0+$/, "").replace(/\.$/, "");
  if (s === "-0") s = "0";
  return s.replace("-", MINUS);
}
/** Exactly d decimals (0.0350). */
const fix = (v, d) => v.toFixed(d).replace("-", MINUS);

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(rng) {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}
function gammaDraw(k, rng) {
  if (k < 1) { let u = rng(); if (u === 0) u = 1e-12; return gammaDraw(k + 1, rng) * Math.pow(u, 1 / k); }
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = gauss(rng); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
function lgamma(x) {
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

// ---------- populations ----------
const POPS = ["normal", "dice", "exp", "skew", "bimodal"];
function makePop(kind, mu, sigma) {
  let p;
  if (kind === "dice") p = { kind, mu: 3.5, sigma: Math.sqrt(35 / 12), lo: 0.5, hi: 6.5, draw: (r) => 1 + Math.floor(r() * 6) };
  else if (kind === "exp") p = { kind, mu, sigma: mu, lo: 0, hi: 5 * mu, draw: (r) => -mu * Math.log(1 - r()), density: (x) => (x < 0 ? 0 : Math.exp(-x / mu) / mu) };
  else if (kind === "skew") {
    const k = (mu / sigma) ** 2, th = (sigma * sigma) / mu, lg = lgamma(k);
    p = { kind, mu, sigma, k, lo: 0, hi: mu + 4 * sigma, draw: (r) => gammaDraw(k, r) * th, density: (x) => (x <= 0 ? 0 : Math.exp((k - 1) * Math.log(x) - x / th - lg - k * Math.log(th))) };
  } else if (kind === "bimodal") {
    const a = 0.45, m1 = 125, s1 = 10.8, m2 = 170.4, s2 = 9.3;
    const m = a * m1 + (1 - a) * m2, v = a * (s1 * s1 + m1 * m1) + (1 - a) * (s2 * s2 + m2 * m2) - m * m;
    p = { kind, mu: m, sigma: Math.sqrt(v), lo: 80, hi: 210, draw: (r) => (r() < a ? m1 + s1 * gauss(r) : m2 + s2 * gauss(r)), density: (x) => (a * npdf((x - m1) / s1)) / s1 + ((1 - a) * npdf((x - m2) / s2)) / s2 };
  } else p = { kind: "normal", mu, sigma, lo: mu - 4 * sigma, hi: mu + 4 * sigma, draw: (r) => mu + sigma * gauss(r), density: (x) => npdf((x - mu) / sigma) / sigma };
  p.normal = p.kind === "normal";
  return p;
}
/** mu and sigma as the notes print them (dice 1.71, bimodal to one decimal). */
const muStr = (pop) => (pop.kind === "bimodal" ? num(pop.mu, 1) : num(pop.mu, 4));
const sigStr = (pop) => (pop.kind === "dice" ? "1.71" : pop.kind === "bimodal" ? num(pop.sigma, 1) : num(pop.sigma, 4));
/** sigma/sqrt(n): 4 decimals when sigma < 1 (0.1768), else at least 2 decimals and 3 significant figures (10.61, 0.242, 3). */
function seStr(pop, n) {
  const se = pop.sigma / Math.sqrt(n);
  return pop.sigma < 1 ? num(se, 4) : num(se, Math.max(2, 2 - Math.floor(Math.log10(se))));
}
function readPop(cfg) {
  const kind = POPS.includes(cfg.pop) ? cfg.pop : "normal";
  let mu = cfg.mu, sigma = cfg.sigma;
  if (kind === "normal") { mu = Number.isFinite(mu) ? mu : 100; sigma = sigma > 0 ? sigma : 15; }
  else if (kind === "exp") { mu = mu > 0 ? mu : 0.25; sigma = mu; }
  else if (kind === "skew") { mu = mu > 0 ? mu : 1.5; sigma = sigma > 0 ? sigma : 1.9; }
  return makePop(kind, mu, sigma);
}

function niceTicks(lo, hi, target = 6) {
  const raw = (hi - lo) / target, p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
  const step = (m < 1.5 ? 1 : m < 2.25 ? 2 : m < 3.5 ? 2.5 : m < 7.5 ? 5 : 10) * p;
  let d = 0;
  while (d < 8 && Math.abs(Math.round(step * 10 ** d) - step * 10 ** d) > 1e-6) d++;
  const out = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return { ticks: out, d };
}

// ---------- drawing helpers (fixed colours only: the stage is cream in every theme) ----------
/** Text with optional coloured / subscript runs: parts = "str" or [ "str" | {t, fill, sub, weight} ]. */
function txt(parent, x, y, parts, o = {}) {
  const size = o.size || 22;
  const t = svgEl("text", { x: x.toFixed(1), y: y.toFixed(1), "font-size": size, fill: o.fill || C.ink, "text-anchor": o.anchor || "start", "font-weight": o.weight || 400 });
  if (o.opacity != null) t.setAttribute("opacity", o.opacity.toFixed(3));
  if (o.halo) { t.setAttribute("stroke", C.cream); t.setAttribute("stroke-width", 6); t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke-linejoin", "round"); }
  if (typeof parts === "string") t.textContent = parts;
  else {
    let shift = 0;
    for (const part of parts) {
      const s = typeof part === "string" ? { t: part } : part;
      const ts = svgEl("tspan", {}, s.t);
      if (s.fill) ts.setAttribute("fill", s.fill);
      if (s.weight) ts.setAttribute("font-weight", s.weight);
      const want = s.sub ? Math.round(size * 0.3) : 0;
      if (want !== shift) { ts.setAttribute("dy", want - shift); shift = want; }
      if (s.sub) ts.setAttribute("font-size", Math.round(size * 0.68));
      t.append(ts);
    }
  }
  parent.append(t);
  return t;
}
const line = (g, x1, y1, x2, y2, stroke, w = 3, extra = {}) => g.append(svgEl("line", { x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1), stroke, "stroke-width": w, "stroke-linecap": "round", ...extra }));
const dot = (g, x, y, r, fill, extra = {}) => { if (r > 0.05) g.append(svgEl("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: r.toFixed(2), fill, ...extra })); };
function arrow(g, x1, y, x2, color, w = 4) {
  if (Math.abs(x2 - x1) < 2) return;
  const dir = Math.sign(x2 - x1), head = Math.min(14, Math.abs(x2 - x1) * 0.6);
  line(g, x1, y, x2 - dir * head * 0.6, y, color, w);
  g.append(svgEl("path", { d: `M${x2},${y}L${x2 - dir * head},${y - head * 0.55}L${x2 - dir * head},${y + head * 0.55}Z`, fill: color, stroke: color, "stroke-width": 1.5, "stroke-linejoin": "round" }));
}
const group = (parent, opacity = 1) => { const g = svgEl("g"); if (opacity < 1) g.setAttribute("opacity", Math.max(0, opacity).toFixed(3)); parent.append(g); return g; };

/** Density points of a population, with the k < 1 gamma spike capped so the rest of the shape stays visible. */
function popShape(pop) {
  if (pop._shape) return pop._shape;
  const N = 480, pts = [];
  for (let i = 0; i <= N; i++) { const x = pop.lo + ((pop.hi - pop.lo) * i) / N; pts.push([x, pop.density(x)]); }
  // a gamma with k < 1 shoots up at 0: scale to the height at 3% of the range and let the spike rise
  // a third above that before it is cut, so it reads as "very tall" without flattening the shape
  const spike = pop.kind === "skew" && pop.k < 1;
  const cap = spike ? pop.density(pop.lo + 0.03 * (pop.hi - pop.lo)) : Math.max(...pts.map((p) => p[1]));
  return (pop._shape = { pts: pts.map(([x, f]) => [x, Math.min(f, cap * (spike ? 1.35 : 1))]), cap });
}
/** The population: six equal bars for a die, else the density curve filled light grey. prog builds it left to right. */
function drawPop(g, pop, X, base, hgt, prog = 1, barFrac = 0.8) {
  if (pop.kind === "dice") {
    for (let f = 1; f <= 6; f++) {
      const b = ease(clamp(prog * 6 - (f - 1), 0, 1)), h = hgt * barFrac * b;
      if (h > 0.5) g.append(svgEl("rect", { x: X(f - 0.34).toFixed(1), y: (base - h).toFixed(1), width: (X(f + 0.34) - X(f - 0.34)).toFixed(1), height: h.toFixed(1), fill: C.light, stroke: C.grey, "stroke-width": 3, "stroke-linejoin": "round" }));
    }
  } else {
    const { pts, cap } = popShape(pop), xf = lerp(pop.lo, pop.hi, prog), Y = (f) => base - (f / cap) * hgt;
    const vis = pts.filter((p) => p[0] <= xf + 1e-12);
    if (vis.length > 1) {
      const d = vis.map((p, i) => `${i ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
      g.append(svgEl("path", { d: `M${X(vis[0][0]).toFixed(1)},${base}` + d.replace(/^M/, "L") + `L${X(vis[vis.length - 1][0]).toFixed(1)},${base}Z`, fill: C.light, stroke: "none" }));
      g.append(svgEl("path", { d, fill: "none", stroke: C.grey, "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    }
  }
  if (prog > 0) line(g, X(pop.lo), base, X(lerp(pop.lo, pop.hi, prog)), base, C.grey, 2.5);
}
function popTicks(g, pop, X, y, opacity = 1) {
  const tk = pop.kind === "dice" ? { ticks: [1, 2, 3, 4, 5, 6], d: 0 } : niceTicks(pop.lo, pop.hi, 5);
  const gg = group(g, opacity);
  for (const v of tk.ticks) txt(gg, X(v), y, fix(v, tk.d), { size: 18, fill: C.grey, anchor: "middle" });
}
/** The film shell: optional title, scene line, the 960 x 540 stage, the caption. */
function filmShell(box, cfg) {
  if (typeof cfg.title === "string" && cfg.title.trim()) box.append(el("h4", null, cfg.title));
  const film = el("div", "film");
  const scene = el("p", "film-scene");
  const svg = svgEl("svg", { viewBox: "0 0 960 540", class: "film-stage", role: "img", "aria-label": "" });
  const caption = el("p", "film-caption");
  caption.setAttribute("aria-live", "polite");
  film.append(scene, svg, caption);
  box.append(film);
  let lastCap = null;
  return {
    film, svg,
    paint(sceneText, capHtml) {
      if (scene.textContent !== sceneText) scene.textContent = sceneText;
      if (capHtml !== lastCap) { lastCap = capHtml; caption.innerHTML = capHtml; svg.setAttribute("aria-label", caption.textContent); }
    },
  };
}
const span = (cls, s) => `<span class="${cls}">${esc(s)}</span>`;

// ======================================================================================================
// sample-pile-play
// ======================================================================================================
const PILE_SCENES = ["the population and its hidden truth", "one sample", "boil it down to one number", "drop it on the line",
  "another sample, another number", "a thousand samples: the pile", "the centre is the truth", "the width is the standard error"];
const LX0 = 60, LX1 = 900, LINE_Y = 462, PILE_TOP = 234, PILE_N = 1000;

function readPileCfg(cfg) {
  const stat = cfg.stat === "xbar" ? "xbar" : "phat";
  const str = (v, max) => (typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null);
  const st = { stat, unit: str(cfg.unit, 12) || "" };
  if (stat === "phat") {
    st.p = cfg.p > 0 && cfg.p < 1 ? cfg.p : 0.572;
    st.n = Number.isInteger(cfg.n) && cfg.n >= 10 && cfg.n <= 5000 ? cfg.n : 200;
    st.what = str(cfg.what, 28) || "iPhone users";
  } else {
    st.pop = readPop(cfg);
    st.n = Number.isInteger(cfg.n) && cfg.n >= 2 && cfg.n <= 400 ? cfg.n : 25;
    const k = st.pop.kind, iq = k === "normal" && st.pop.mu === 100 && st.pop.sigma === 15;
    st.what = str(cfg.what, 28) || (iq ? "IQ score" : k === "dice" ? "roll" : "value");
  }
  return st;
}

function buildPile(st) {
  const isP = st.stat === "phat", pop = st.pop, n = st.n;
  const c = isP ? st.p : pop.mu, w = isP ? Math.sqrt((st.p * (1 - st.p)) / n) : pop.sigma / Math.sqrt(n);
  // one sample: a count of yes (phat) or a mean (xbar); keep = the first sample's raw values
  const draw = (rng, keep) => {
    if (isP) { let x = 0; for (let i = 0; i < n; i++) if (rng() < st.p) x++; return x; }
    let s = 0;
    for (let i = 0; i < n; i++) { const v = pop.draw(rng); s += v; if (keep) keep.push(v); }
    return s / n;
  };
  const val = (r) => (isP ? r / n : r);
  // the notes' sample: X = 117 of 200 for the default; otherwise a first dot a little off the centre, and
  // two more that land clearly elsewhere, so the three labels never collide
  const target = isP && st.p === 0.572 && n === 200 ? 117 : null;
  // columns: about 45, aligned on the possible values when they are discrete (k/n)
  const lo = c - 4.2 * w, hi = c + 4.2 * w, grid = isP || pop.kind === "dice" ? 1 / n : 0;
  let colW, base;
  if (grid) { let k = Math.max(1, Math.round((8.4 * w) / 45 / grid)); if (k % 2 === 0) k += 1; colW = k * grid; base = Math.round(c / grid) * grid; }
  else { colW = (8.4 * w) / 45; base = c; }
  // Of the first few seeds that meet the conditions, keep the pile whose columns sit closest to their
  // expected heights: every pile is a real simulation, this one just reads most clearly on screen.
  let pick = null;
  for (let seed = 1, found = 0; seed <= 4000 && found < 8; seed++) {
    const r = mulberry32(seed * 7919 + n * 31 + (isP ? 1 : POPS.indexOf(pop.kind) + 2));
    const keep = [], a = draw(r, keep), b = draw(r), d = draw(r);
    const z = [a, b, d].map((x) => (val(x) - c) / w);
    const ok1 = target != null ? a === target : Math.abs(z[0]) >= 0.3 && Math.abs(z[0]) <= 1.5;
    const ok = ok1 && Math.abs(z[1]) <= 2.3 && Math.abs(z[2]) <= 2.3 && Math.abs(z[1] - z[0]) >= 1.15 && Math.abs(z[2] - z[0]) >= 1.15 && Math.abs(z[2] - z[1]) >= 0.9;
    if (!ok && !(seed === 4000 && !pick)) continue;
    found++;
    const raw = [a, b, d];
    for (let i = 3; i < PILE_N; i++) raw.push(draw(r));
    const cnt = new Map();
    for (const x of raw) { const j = Math.round((val(x) - base) / colW); cnt.set(j, (cnt.get(j) || 0) + 1); }
    let rough = 0;
    for (const [j, o] of cnt) {
      // against the normal curve when it is the right model, else against the two neighbouring columns
      const ref = isP || pop.normal ? (PILE_N * colW * npdf((base + j * colW - c) / w)) / w : ((cnt.get(j - 1) || 0) + (cnt.get(j + 1) || 0)) / 2;
      rough += ((o - ref) ** 2) / Math.max(1, ref);
    }
    if (!pick || rough < pick.rough) pick = { rough, raw, first: keep };
  }
  const { raw, first } = pick;
  const vals = raw.map(val);
  const X = (v) => LX0 + ((v - lo) / (hi - lo)) * (LX1 - LX0);
  const counts = new Map(), col = [], stack = [];
  let maxCount = 1;
  for (const v of vals) {
    const j = Math.round((v - base) / colW), cx = base + j * colW;
    if (cx < lo || cx > hi) { col.push(null); stack.push(-1); continue; }
    const h = counts.get(j) || 0;
    counts.set(j, h + 1); col.push(cx); stack.push(h);
    maxCount = Math.max(maxCount, h + 1);
  }
  const colPx = (colW / (hi - lo)) * (LX1 - LX0), avail = LINE_Y - 3 - PILE_TOP;
  let best = { s: 1, pitch: 0 };
  for (let s = 1; s <= 5; s++) { const pitch = Math.min(colPx / s, avail / Math.ceil(maxCount / s)); if (pitch > best.pitch) best = { s, pitch }; }
  const { s: sub, pitch } = best, r = Math.min(pitch * 0.44, 8);
  const slot = vals.map((v, i) => (col[i] == null ? null : [X(col[i]) + ((stack[i] % sub) - (sub - 1) / 2) * (colPx / sub), LINE_Y - 3 - (Math.floor(stack[i] / sub) + 0.5) * pitch]));
  const expected = (x) => (PILE_N * colW * npdf((x - c) / w)) / w; // dots per column under the normal curve
  const curveY = (x) => LINE_Y - 3 - (expected(x) / sub) * pitch;
  const mean = vals.reduce((a, b) => a + b, 0) / PILE_N;
  const within = vals.filter((v) => Math.abs(v - c) <= w + 1e-12).length;
  const bell = isP ? n * st.p >= 5 && n * (1 - st.p) >= 5 : pop.normal || n >= 30;
  const dX = clamp(Math.ceil(-Math.log10(w / 10)), 0, 4);
  return { isP, pop, n, c, w, lo, hi, X, raw, vals, first, slot, r, curveY, mean, within, bell, dX, ticks: niceTicks(lo, hi, 7) };
}

function samplePilePlay(box, cfg) {
  cfg = cfg && typeof cfg === "object" ? cfg : {};
  const st = readPileCfg(cfg);
  let M = buildPile(st);
  const shell = filmShell(box, cfg), svg = shell.svg;
  const S = (k) => `Scene ${k} of 8 · ${PILE_SCENES[k - 1]}`;

  // the phat population: 400 dots, a share p of them dark ("yes"), in a seeded order
  const GX0 = 46, GY0 = 46, GP = 13, GC = 40, GR = 10;
  let yesCell = null, yesList = [], noList = [];
  if (M.isP) {
    const idx = [...Array(GC * GR).keys()], r = mulberry32(99);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const nYes = Math.round(GC * GR * st.p);
    yesCell = new Array(GC * GR).fill(false);
    idx.slice(0, nYes).forEach((i) => (yesCell[i] = true));
    yesList = idx.slice(0, nYes); noList = idx.slice(nYes);
  }
  const cellXY = (i) => [GX0 + (i % GC) * GP, GY0 + Math.floor(i / GC) * GP];
  // the xbar population sits top left, the tray axis in the middle
  const PX0 = 50, PX1 = 550, POP_BASE = 180, POP_H = 128, TX0 = 330, TX1 = 630, TY = 322;

  function frame(pos) {
    pos = clamp(pos, 0, 8);
    const sc = pos <= 0 ? 0 : Math.ceil(pos - 1e-9);
    const P = (k, a = 0, b = 1) => ease(clamp((pos - (k - 1) - a) / (b - a), 0, 1));
    const { isP, pop, n, c, w, X, raw, vals } = M;
    const PX = isP ? null : (v) => PX0 + ((v - pop.lo) / (pop.hi - pop.lo)) * (PX1 - PX0);
    const TX = isP ? null : (v) => TX0 + ((v - pop.lo) / (pop.hi - pop.lo)) * (TX1 - TX0);
    const X1 = raw[0], v1 = vals[0];
    const pS = num(st.p ?? 0, 4), qS = num(1 - (st.p ?? 0), 4);
    const vStr = (i) => (isP ? num(vals[i], 4) : fix(vals[i], M.dX));
    const u = st.unit ? " " + st.unit : "";
    const sym = isP ? PH : XB;
    svg.textContent = "";
    const root = group(svg);

    // opening: the one question, fading as the population is built
    const q0 = 1 - P(1, 0, 0.25);
    if (q0 > 0) {
      const g = group(root, q0);
      txt(g, 480, 250, "If I took another sample,", { size: 34, anchor: "middle" });
      txt(g, 480, 298, "how far could my number move?", { size: 34, anchor: "middle" });
    }

    // scene 1: the population and its hidden truth (gone once the pile starts)
    const popOp = 1 - P(6, 0, 0.25);
    if (pos > 0 && popOp > 0) {
      const g = group(root, popOp);
      if (isP) {
        const q = clamp(pos / 0.6, 0, 1) * (GC * GR + 40);
        for (let i = 0; i < GC * GR; i++) {
          const s = clamp((q - i) / 40, 0, 1);
          if (s <= 0) break;
          const [x, y] = cellXY(i);
          dot(g, x, y, 4.6 * s, yesCell[i] ? C.dark : C.light, yesCell[i] ? {} : { stroke: C.grey, "stroke-width": 1.2 });
        }
        const lg = group(g, P(1, 0.6, 0.95));
        txt(lg, 590, 92, `p = ${pS}`, { size: 36, fill: C.pink, weight: 700 });
        txt(lg, 590, 128, `share that are ${st.what}`, { size: 22 });
        txt(lg, 590, 158, "the truth: you never see it", { size: 20, fill: C.pink });
      } else {
        drawPop(g, pop, PX, POP_BASE, POP_H, P(1, 0, 0.55));
        popTicks(g, pop, PX, POP_BASE + 24, P(1, 0.3, 0.6));
        const pl = P(1, 0.5, 0.75);
        if (pl > 0) line(g, PX(pop.mu), POP_BASE, PX(pop.mu), POP_BASE - (POP_H + 8) * pl, C.pink, 3.5);
        const lg = group(g, P(1, 0.65, 1));
        txt(lg, 590, 86, `μ = ${muStr(pop)}${u}`, { size: 36, fill: C.pink, weight: 700 });
        txt(lg, 590, 124, `σ = ${sigStr(pop)}${u}`, { size: 26, fill: C.pink });
        txt(lg, 590, 158, pop.kind === "dice" ? "one fair die: 1 to 6" : `every ${st.what} in the population`, { size: 20 });
      }
    }

    // scenes 2 and 3: one sample gathers in the tray, then collapses to one blue dot
    const P3 = isP ? [480, 300] : [TX(v1), TY];
    if (pos > 1 && pos < 4) {
      const fly = clamp(pos - 1, 0, 1), col = P(3, 0, 0.5), fade = 1 - P(3, 0.3, 0.55);
      if (fade > 0) {
        const g = group(root, fade);
        if (isP) {
          const MK = n <= 60 ? n : 50, yesM = Math.round((MK * X1) / n), rows = Math.ceil(MK / 10);
          for (let m = 0; m < MK; m++) {
            const yes = m < yesM, cell = yes ? yesList[(m * 7) % yesList.length] : noList[((m - yesM) * 7) % noList.length];
            const [sx, sy] = cellXY(cell);
            const tx = 480 + ((m % 10) - 4.5) * 18, ty = 300 + (Math.floor(m / 10) - (rows - 1) / 2) * 18;
            const t0 = (0.6 * m) / MK, f = ease(clamp((fly - t0) / 0.35, 0, 1));
            if (f <= 0) continue;
            const x = lerp(lerp(sx, tx, f), P3[0], col), y = lerp(lerp(sy, ty, f), P3[1], col);
            dot(g, x, y, 6, yes ? C.dark : C.light, yes ? {} : { stroke: C.grey, "stroke-width": 1.5 });
          }
          const lg = group(g, P(2, 0, 0.3) * (1 - P(3, 0, 0.3)));
          txt(lg, 362, 309, `n = ${n}`, { size: 28, anchor: "end", weight: 700 });
          if (n > 60) txt(lg, 480, 300 + rows * 9 + 30, `each mark stands for ${Number.isInteger(n / MK) ? "" : "about "}${num(n / MK, 0)}`, { size: 18, fill: C.grey, anchor: "middle" });
          const cg = group(g, P(2, 0.8, 1) * (1 - P(3, 0, 0.3)));
          txt(cg, 590, 309, [{ t: String(X1), weight: 700 }, ` of ${n} are ${st.what}`], { size: 22 });
        } else {
          const shown = M.first.slice(0, 60), K = shown.length;
          const ag = group(g, P(2, 0, 0.3));
          line(ag, TX0, TY + 16, TX1, TY + 16, C.grey, 2.5);
          for (let m = 0; m < K; m++) {
            const v = shown[m], t0 = (0.6 * m) / K, f = ease(clamp((fly - t0) / 0.35, 0, 1));
            if (f <= 0) continue;
            const x = lerp(lerp(PX(v), TX(v), f), P3[0], col), y = lerp(lerp(POP_BASE - 12, TY, f), TY, col);
            line(g, x, y - 13, x, y + 13, C.grey, 2.5, { opacity: 0.85 });
          }
          const lg = group(g, P(2, 0, 0.3) * (1 - P(3, 0, 0.3)));
          txt(lg, TX0 - 22, TY + 9, `n = ${n}`, { size: 28, anchor: "end", weight: 700 });
          if (n > 60) txt(lg, (TX0 + TX1) / 2, TY + 48, `60 of the ${n} values shown`, { size: 18, fill: C.grey, anchor: "middle" });
        }
      }
    }

    // the number line (scene 4 on), with the truth as a thin pink tick
    const lineP = P(4, 0, 0.35);
    if (lineP > 0) {
      const mid = (LX0 + LX1) / 2, half = ((LX1 - LX0) / 2) * lineP;
      line(root, mid - half, LINE_Y, mid + half, LINE_Y, C.ink, 3);
      const tg = group(root, P(4, 0.25, 0.45));
      for (const v of M.ticks.ticks) { line(tg, X(v), LINE_Y, X(v), LINE_Y + 9, C.ink, 2.5); txt(tg, X(v), LINE_Y + 32, fix(v, M.ticks.d), { size: 18, anchor: "middle" }); }
      txt(tg, LX1 + 18, LINE_Y + 9, sym, { size: 28, fill: C.blue, weight: 700 });
      const pk = P(4, 0.35, 0.5);
      if (pk > 0) line(root, X(c), LINE_Y - 15 * pk, X(c), LINE_Y + 15 * pk, C.pink, 2.5);
    }

    // the pile: 1000 dots rain in during scene 6
    const f6 = clamp(pos - 5, 0, 1);
    let landed = 0;
    if (pos > 5) {
      const g = group(root);
      for (let i = 3; i < PILE_N; i++) {
        const sl = M.slot[i];
        const s0 = 0.08 + 0.72 * Math.sqrt((i - 3) / (PILE_N - 4)), gq = clamp((f6 - s0) / 0.14, 0, 1);
        if (gq <= 0) break;
        if (gq >= 1) landed++;
        if (!sl) continue;
        dot(g, sl[0], lerp(20, sl[1], gq * gq), M.r, C.blue);
      }
    }
    landed += 3;

    // the first three dots: born in scene 3 (dot 1) and scene 5 (dots 2 and 3), then join the pile
    const shrink = P(6, 0, 0.2);
    const onLine = (i) => [clamp(X(vals[i]), LX0, LX1), LINE_Y - 11];
    const bigDot = (i, x, y, rr) => {
      const sl = M.slot[i];
      if (shrink > 0 && sl) { x = lerp(x, sl[0], shrink); y = lerp(y, sl[1], shrink); rr = lerp(rr, M.r, shrink); }
      else if (shrink > 0 && !sl) rr *= 1 - shrink;
      dot(root, x, y, rr, C.blue);
    };
    const labOp = 1 - P(6, 0, 0.15);
    if (pos > 2) {
      const grow = P(3, 0.4, 0.65), mv = P(4, 0.45, 0.9), [lx, ly] = onLine(0);
      const x = lerp(P3[0], lx, mv), y = lerp(P3[1], ly, mv);
      bigDot(0, x, y, 11 * grow);
      const longOp = P(3, 0.55, 0.85) * (1 - P(4, 0.4, 0.55));
      if (longOp > 0) {
        const lg = group(root, longOp);
        if (isP) txt(lg, P3[0] + 24, P3[1] + 11, `${PH} = ${X1}/${n} = ${num(v1, 4)}`, { size: 30, fill: C.blue, weight: 700 });
        else {
          txt(lg, P3[0] + 24, P3[1] + 11, `${XB} = ${fix(v1, M.dX)}${u}`, { size: 30, fill: C.blue, weight: 700 });
          txt(lg, P3[0] + 24, P3[1] + 42, `the average of the ${n} values`, { size: 20 });
        }
      }
      const shortOp = P(4, 0.8, 1) * labOp;
      if (shortOp > 0) txt(root, clamp(lx, 110, 850), LINE_Y - 30, `${sym} = ${vStr(0)}`, { size: 24, fill: C.blue, anchor: "middle", weight: 700, opacity: shortOp, halo: true });
    }
    if (pos > 4) {
      for (const [i, a, b] of [[1, 0, 0.45], [2, 0.45, 0.9]]) {
        const f = P(5, a, b);
        if (f <= 0) continue;
        const [lx, ly] = onLine(i);
        bigDot(i, lerp(480, lx, f), lerp(205, ly, f * f), 11 * clamp(f * 4, 0, 1));
        const op = P(5, b - 0.1, b + 0.05) * labOp;
        if (op > 0) txt(root, clamp(lx, 60, 900), LINE_Y - 30, vStr(i), { size: 22, fill: C.blue, anchor: "middle", weight: 700, opacity: op, halo: true });
      }
    }
    if (pos > 5) txt(root, 40, 52, `${Math.min(PILE_N, landed)} samples`, { size: 24, fill: C.blue, weight: 700 });

    // scene 7: the centre is the truth
    const p7 = P(7, 0, 0.55);
    if (p7 > 0) {
      const top = 212;
      line(root, X(c), LINE_Y, X(c), lerp(LINE_Y, top, p7), C.pink, 3.5);
      const lo7 = P(7, 0.45, 0.85);
      if (lo7 > 0) {
        const g = group(root, lo7), dy = 10 * (1 - lo7);
        const cx = clamp(X(c), 170, 790);
        if (isP) txt(g, cx, 198 + dy, `centre = p = ${pS}`, { size: 26, fill: C.pink, anchor: "middle", weight: 700, halo: true });
        else {
          txt(g, cx, 168 + dy, `centre = μ = ${muStr(pop)}${u}`, { size: 26, fill: C.pink, anchor: "middle", weight: 700, halo: true });
          txt(g, cx, 198 + dy, "the average of the averages", { size: 20, fill: C.pink, anchor: "middle", halo: true });
        }
      }
    }

    // scene 8: the width is the standard error, the curve and the bell check
    if (pos > 7) {
      const ya = lerp(LINE_Y - 3, M.curveY(c), 1 - Math.exp(-0.5));
      const pa = P(8, 0, 0.35);
      const seTxt = isP ? fix(w, 4) : seStr(pop, n);
      // the normal curve settles over the pile (dashed when the pile does not follow it)
      const pc = P(8, 0.6, 0.85);
      if (pc > 0) {
        let d = "";
        for (let i = 0; i <= 200; i++) { const x = lerp(c - 3.7 * w, c + 3.7 * w, i / 200); d += `${i ? "L" : "M"}${X(x).toFixed(1)},${(M.curveY(x) - 24 * (1 - pc)).toFixed(1)}`; }
        root.append(svgEl("path", { d, fill: "none", stroke: C.ink, "stroke-width": 2.5, "stroke-linecap": "round", opacity: pc.toFixed(3), ...(M.bell ? {} : { "stroke-dasharray": "9 8" }) }));
      }
      arrow(root, X(c), ya, X(c + w * pa), C.green, 4);
      arrow(root, X(c), ya, X(c - w * pa), C.green, 4);
      const al = P(8, 0.25, 0.4);
      if (al > 0) for (const sgn of [-1, 1]) txt(root, X(c + sgn * w) + sgn * 8, ya + 7, seTxt, { size: 20, fill: C.green, anchor: sgn < 0 ? "end" : "start", weight: 700, opacity: al, halo: true });
      const f1 = P(8, 0.25, 0.5), f2 = P(8, 0.45, 0.7);
      const sub = [{ t: "σ" }, { t: sym, sub: true }];
      if (f1 > 0) txt(root, 935 - 12 * (1 - f1), 48, isP ? [...sub, " = √(pq/n)"] : [...sub, " = σ/√n"], { size: 26, fill: C.green, anchor: "end", weight: 700, opacity: f1 });
      if (f2 > 0) txt(root, 935 - 12 * (1 - f2), 86, isP ? `= √(${pS} × ${qS} / ${n}) = ${seTxt}` : `= ${sigStr(pop)}/√${n} = ${seTxt}`, { size: 26, fill: C.green, anchor: "end", weight: 700, opacity: f2 });
      const fc = P(8, 0.8, 1);
      if (fc > 0) {
        const ok = { t: " ✓", fill: C.green, weight: 700 }, bad = { t: " ✗", fill: C.red, weight: 700 };
        let parts;
        if (isP) {
          const np = n * st.p, nq = n * (1 - st.p);
          const chk = (lab, v) => (v >= 5 ? [`${lab} = ${num(v, 2)} ≥ 5`, ok] : [{ t: `${lab} = ${num(v, 2)} < 5`, fill: C.red }, bad]);
          parts = [...chk("np", np), " ", ...chk("nq", nq), M.bell ? " → bell" : { t: " → not a bell yet", fill: C.red }];
        } else if (pop.normal) parts = ["X is normal → bell for any n", ok];
        else if (n >= 30) parts = [`n = ${n} ≥ 30 → bell`, ok];
        else parts = [{ t: `X is not normal and n = ${n} < 30 → not a bell yet`, fill: C.red }];
        txt(root, 935, 124, parts, { size: 22, anchor: "end", opacity: fc });
      }
    }

    shell.paint(sc === 0 ? "Opening · the one question" : S(sc), caption(sc));
  }

  function caption(sc) {
    const { isP, pop, n, c, w, raw, vals } = M;
    const u = st.unit ? " " + st.unit : "", what = esc(st.what);
    const pS = num(st.p ?? 0, 4), truth = isP ? span("pink", `p = ${pS}`) : span("pink", `μ = ${muStr(pop)}${u}`);
    const vS = (i) => (isP ? num(vals[i], 4) : fix(vals[i], M.dX));
    const word = isP ? PH : XB;
    switch (sc) {
      case 0: return "One question runs through this film: if you took another sample, how far could your number move? Build the answer from nothing.";
      case 1: return isP
        ? `This is the whole population. The dark dots are the ${what}: a share ${truth} of everyone. That is the population's one true number, and in real life you never see it.`
        : `This is the whole population: ${pop.kind === "dice" ? "every roll of a fair die" : `every ${what}`}. Its centre ${truth} and spread ${span("pink", `σ = ${sigStr(pop)}${u}`)} are its true numbers, and in real life you never see them.`;
      case 2: {
        if (isP) {
          const per = n > 60 ? ` (each mark stands for ${Number.isInteger(n / 50) ? "" : "about "}${num(n / 50, 0)})` : "";
          return `Take one random sample of n = ${n}${per}. Count the ${what} in it: ${raw[0]} of ${n}.`;
        }
        const shown = n > 60 ? ` The first 60 of them are drawn.` : "";
        return pop.kind === "dice" ? `Roll the die n = ${n} times. Each grey tick is one roll.${shown}` : `Take one random sample of n = ${n} and write down each one's ${what}${u ? ` (${esc(st.unit)})` : ""}: one grey tick per value.${shown}`;
      }
      case 3: return isP
        ? `Boil the sample down to one number, its share: ${span("blue", `${PH} = ${raw[0]}/${n} = ${num(vals[0], 4)}`)}. One sample gives one blue dot.`
        : `Boil the sample down to one number, its average: ${span("blue", `${XB} = ${vS(0)}${u}`)}. One sample gives one blue dot.`;
      case 4: {
        const d = vals[0] - c, side = d >= 0 ? "right" : "left", dd = isP ? num(Math.abs(d), 4) : num(Math.abs(d), M.dX);
        return `Drop that number on a line. The thin pink tick is the truth ${truth}; your ${span("blue", `${word} = ${vS(0)}`)} landed ${dd} to its ${side}. You only ever see the blue dot.`;
      }
      case 5: return `Another sample gives another number: ${span("blue", vS(1))}, then ${span("blue", vS(2))}. If you took another sample, how far could your number move?`;
      case 6: return `Now take ${PILE_N} samples of ${n}, one blue dot each. The dots pile up: this pile is the sampling distribution of ${word}.`;
      case 7: return isP
        ? `The pile is centred on the truth: the ${PILE_N} values of ${PH} average ${num(M.mean, 4)}, and the centre is ${truth}.`
        : `The pile is centred on the truth: the ${PILE_N} values of ${XB} average ${num(M.mean, M.dX + 1)}, and the centre is ${truth}, the average of the averages.`;
      default: {
        const se = isP ? `σ of ${PH} = √(pq/n) = ${fix(w, 4)}` : `σ of ${XB} = σ/√n = ${sigStr(pop)}/√${n} = ${seStr(pop, n)}`;
        let s = `The width of the pile is the standard error, ${span("green", se)}: ${M.within} of the ${PILE_N} dots land within one green arrow of the centre.`;
        if (isP) {
          const np = num(n * st.p, 2), nq = num(n * (1 - st.p), 2);
          s += M.bell ? ` np = ${np} and nq = ${nq} are both at least 5, so the pile is a bell and the normal curve fits it.` : ` np = ${np} and nq = ${nq}: one is under 5, so the pile is not a bell yet and does not follow the dashed curve.`;
        } else if (pop.normal) s += " X is normal, so the pile is a bell for any n.";
        else if (n >= 30) s += ` n = ${n} ≥ 30, so the pile is a bell even though X is not normal.`;
        else s += ` X is not normal and n = ${n} < 30, so the pile does not follow the dashed normal curve yet${pop.kind === "exp" || pop.kind === "skew" ? ": it still leans to the right" : ""}.`;
        return s;
      }
    }
  }

  const pb = createPlayback({ count: 8, unit: "scene", stepMs: () => (Math.ceil(pb.pos() - 1e-9) === 6 ? 4200 : 2600), onFrame: frame });
  shell.film.append(pb.el);
  if (st.stat === "xbar") {
    const row = el("div", "film-controls");
    row.append(el("span", null, "Sample size:"));
    const opts = [...new Set([2, 5, 25, 50, 100, st.n])].sort((a, b) => a - b);
    const btns = opts.map((v) => {
      const b = el("button", "viz-btn" + (v === st.n ? " active" : ""), `n = ${v}`);
      b.type = "button";
      b.addEventListener("click", () => {
        st.n = v; M = buildPile(st);
        btns.forEach((x) => x.classList.toggle("active", x === b));
        pb.reset(8);
      });
      row.append(b);
      return b;
    });
    shell.film.append(row);
  }
  return pb;
}

// ======================================================================================================
// xbar-n-play
// ======================================================================================================
const NX0 = 70, NX1 = 890, N_POP_BASE = 150, N_POP_TOP = 46, N_PILE_BASE = 480, N_PILE_TOP = 274, N_MEANS = 20000;

function xbarNPlay(box, cfg) {
  cfg = cfg && typeof cfg === "object" ? cfg : {};
  const pop = readPop(cfg);
  let ns = Array.isArray(cfg.ns) ? cfg.ns.filter((v, i, a) => Number.isInteger(v) && v >= 1 && v <= 400 && a.indexOf(v) === i).slice(0, 8) : [];
  if (!ns.length) ns = [1, 2, 10, 50, 100];
  const count = ns.length;
  const shell = filmShell(box, cfg), svg = shell.svg;
  let zoom = false;

  // 20 000 seeded sample means per n, made the first time that n is drawn
  const meansCache = new Map(), histCache = new Map();
  function means(n) {
    if (meansCache.has(n)) return meansCache.get(n);
    const rng = mulberry32(1000 + POPS.indexOf(pop.kind) * 7777 + n * 131);
    const arr = new Float64Array(N_MEANS);
    for (let i = 0; i < N_MEANS; i++) { let s = 0; for (let j = 0; j < n; j++) s += pop.draw(rng); arr[i] = s / n; }
    let m = 0; for (const v of arr) m += v; m /= N_MEANS;
    let m2 = 0, m3 = 0; for (const v of arr) { const d = v - m; m2 += d * d; m3 += d * d * d; }
    m2 /= N_MEANS; m3 /= N_MEANS;
    const out = { arr, mean: m, sd: Math.sqrt(m2), skew: m3 / Math.pow(m2, 1.5) };
    meansCache.set(n, out);
    return out;
  }
  const seOf = (n) => pop.sigma / Math.sqrt(n);
  const rangeFor = (se) => (zoom ? [pop.mu - 4.5 * se, pop.mu + 4.5 * se] : [pop.lo, pop.hi]);
  /** Density histogram of the means for n over the panel range (bins on the k/n grid for a die). */
  function hist(n) {
    const key = n + (zoom ? "z" : "");
    if (histCache.has(key)) return histCache.get(key);
    const [lo, hi] = rangeFor(seOf(n));
    let start, bw, nb;
    if (pop.kind === "dice") {
      const grid = 1 / n;
      let k = Math.max(1, Math.round((hi - lo) / 70 / grid));
      if (k % 2 === 0) k += 1;
      bw = k * grid;
      const base = Math.round(pop.mu / grid) * grid;
      start = base - bw / 2 - bw * Math.ceil((base - bw / 2 - lo) / bw);
      nb = Math.ceil((hi - start) / bw);
    } else { start = lo; nb = zoom ? 70 : 100; bw = (hi - lo) / nb; }
    const h = new Float64Array(nb), { arr } = means(n);
    for (const v of arr) { const j = Math.floor((v - start) / bw); if (j >= 0 && j < nb) h[j]++; }
    for (let j = 0; j < nb; j++) h[j] /= N_MEANS * bw;
    const out = { start, bw, nb, h };
    histCache.set(key, out);
    return out;
  }
  const densAt = (H, x) => { const j = Math.floor((x - H.start) / H.bw); return j >= 0 && j < H.nb ? H.h[j] : 0; };
  const fits = (n) => pop.normal || n >= 30;
  const AXp = (v) => NX0 + ((v - pop.lo) / (pop.hi - pop.lo)) * (NX1 - NX0);

  function verdict(n) {
    if (pop.normal) return { t: n === 1 ? "bell: X is normal (n = 1: the pile IS the population)" : "bell: X is normal", ok: true };
    if (n === 1) return { t: "n = 1: the pile IS the population, not a bell", ok: false };
    if (n >= 30) return { t: "bell: n ≥ 30", ok: true };
    if (pop.kind === "dice" && n === 2) return { t: "not exactly normal: a triangle (X is not normal and n = 2 < 30)", ok: false };
    return { t: "not a good fit yet: X is not normal and n < 30", ok: false };
  }
  function rows(g, n, op) {
    if (op <= 0) return;
    const gg = group(g, op);
    const sub = [{ t: "μ" }, { t: XB, sub: true }];
    txt(gg, 40, 216, `n = ${n}`, { size: 30, weight: 700 });
    txt(gg, 196, 216, [...sub, ` = μ = ${muStr(pop)}`], { size: 24, fill: C.pink, weight: 700 });
    txt(gg, 930, 216, [{ t: "σ" }, { t: XB, sub: true }, ` = σ/√n = ${sigStr(pop)}/√${n} = ${seStr(pop, n)}`], { size: 24, fill: C.green, weight: 700, anchor: "end" });
    const v = verdict(n);
    txt(gg, 40, 252, v.ok ? [v.t, { t: " ✓", fill: C.green, weight: 700 }] : v.t, { size: 22, fill: v.ok ? C.ink : C.red });
  }

  function frame(pos) {
    pos = clamp(pos, 0, count);
    const k = pos <= 0 ? 0 : Math.ceil(pos - 1e-9);
    const t = k === 0 ? 1 : ease(clamp(pos - (k - 1), 0, 1));
    svg.textContent = "";
    const root = group(svg);
    // the population on top
    drawPop(root, pop, AXp, N_POP_BASE, N_POP_BASE - N_POP_TOP, 1, pop.kind === "dice" ? 0.45 : 1);
    line(root, AXp(pop.mu), N_POP_BASE, AXp(pop.mu), N_POP_TOP - 4, C.pink, 3.5);
    txt(root, AXp(pop.mu), N_POP_TOP - 14, `μ = ${muStr(pop)}`, { size: 22, fill: C.pink, anchor: "middle", weight: 700, halo: true });
    txt(root, 930, 56, "population X", { size: 20, fill: C.grey, anchor: "end" });
    txt(root, 930, 84, `σ = ${sigStr(pop)}`, { size: 22, fill: C.pink, anchor: "end", weight: 700 });
    if (zoom) popTicks(root, pop, AXp, N_POP_BASE + 22);

    // the pile panel
    let lo = pop.lo, hi = pop.hi, seI = seOf(ns[0]);
    if (k >= 1) {
      const nC = ns[k - 1], nP = k >= 2 ? ns[k - 2] : null;
      const seC = seOf(nC), seP = nP ? seOf(nP) : seC;
      seI = Math.exp(lerp(Math.log(seP), Math.log(seC), t));
      [lo, hi] = rangeFor(seI);
      const PX = (v) => NX0 + ((v - lo) / (hi - lo)) * (NX1 - NX0);
      const hC = hist(nC), hP = nP ? hist(nP) : null;
      const bars = [];
      for (let j = 0; j < hC.nb; j++) { const x = hC.start + (j + 0.5) * hC.bw; bars.push([x, hC.bw, lerp(hP ? densAt(hP, x) : 0, hC.h[j], t)]); }
      if (hP && t < 1) {
        const a = hC.start, b = hC.start + hC.nb * hC.bw;
        for (let j = 0; j < hP.nb; j++) { const x = hP.start + (j + 0.5) * hP.bw; if (x < a || x > b) bars.push([x, hP.bw, (1 - t) * hP.h[j]]); }
      }
      const peak = 1 / (seI * Math.sqrt(2 * Math.PI));
      const yMax = Math.max(peak, ...bars.map((b) => b[2])) * 1.04;
      const Y = (d) => N_PILE_BASE - (d / yMax) * (N_PILE_BASE - N_PILE_TOP);
      const clipId = `xnp-clip-${uid}`;
      const defs = svgEl("defs"), cp = svgEl("clipPath", { id: clipId });
      cp.append(svgEl("rect", { x: NX0 - 2, y: N_PILE_TOP - 10, width: NX1 - NX0 + 4, height: N_PILE_BASE - N_PILE_TOP + 12 }));
      defs.append(cp); root.append(defs);
      const pg = svgEl("g", { "clip-path": `url(#${clipId})` });
      root.append(pg);
      for (const [x, bw, d] of bars) {
        const x0 = PX(x - bw / 2), x1 = PX(x + bw / 2), y = Y(d);
        if (N_PILE_BASE - y < 0.3) continue;
        pg.append(svgEl("rect", { x: (x0 + 0.5).toFixed(1), y: y.toFixed(1), width: Math.max(1, x1 - x0 - 1).toFixed(1), height: (N_PILE_BASE - y).toFixed(1), fill: C.blue, opacity: 0.78 }));
      }
      line(pg, PX(pop.mu), N_PILE_BASE, PX(pop.mu), N_PILE_TOP - 2, C.pink, 2.5, { opacity: 0.9 });
      const fitNow = (t < 0.5 && nP ? fits(nP) : fits(nC));
      let d = "";
      for (let i = 0; i <= 240; i++) { const x = lerp(lo, hi, i / 240); d += `${i ? "L" : "M"}${PX(x).toFixed(1)},${Y(npdf((x - pop.mu) / seI) / seI).toFixed(1)}`; }
      pg.append(svgEl("path", { d, fill: "none", stroke: C.ink, "stroke-width": 2.5, "stroke-linejoin": "round", opacity: (nP ? 1 : t).toFixed(3), ...(fitNow ? {} : { "stroke-dasharray": "9 8" }) }));
      txt(root, 930, 304, `20 000 sample means ${XB}`, { size: 20, fill: C.blue, anchor: "end", weight: 700, halo: true });
      // the rows of numbers, cross-fading between steps
      // the numbers switch halfway through the morph (the first step fades them in)
      if (nP && t < 0.5) rows(root, nP, 1);
      else rows(root, nC, nP ? 1 : t);
    }
    // the shared (or zoomed) axis
    const PX = (v) => NX0 + ((v - lo) / (hi - lo)) * (NX1 - NX0);
    line(root, NX0, N_PILE_BASE, NX1, N_PILE_BASE, C.ink, 3);
    const tk = pop.kind === "dice" && !zoom ? { ticks: [1, 2, 3, 4, 5, 6], d: 0 } : niceTicks(lo, hi, 7);
    for (const v of tk.ticks) { line(root, PX(v), N_PILE_BASE, PX(v), N_PILE_BASE + 8, C.ink, 2.5); txt(root, PX(v), N_PILE_BASE + 30, fix(v, tk.d), { size: 18, anchor: "middle" }); }
    txt(root, NX1 + 16, N_PILE_BASE + 8, XB, { size: 26, fill: C.blue, weight: 700 });
    if (zoom && k >= 1) txt(root, 930, 330, "zoomed in: μ ± 4.5 σ/√n", { size: 18, fill: C.grey, anchor: "end", halo: true });
    if (k === 0) txt(root, 480, 390, "the pile of sample means builds here", { size: 22, fill: C.grey, anchor: "middle" });

    shell.paint(k === 0 ? "Opening · the population" : `Step ${k} of ${count} · n = ${ns[k - 1]}`, caption(k));
  }

  function caption(k) {
    const sS = sigStr(pop), mu = span("pink", `μ = ${muStr(pop)}`);
    if (k === 0) return `The population on top: centre ${mu}, spread σ = ${sS}. Each step below piles up ${N_MEANS.toLocaleString("en-US").replace(",", " ")} sample means ${XB}, one for each simulated sample of size n.`;
    const n = ns[k - 1], se = seStr(pop, n), green = span("green", `${se} = ${sS}/√${n}`);
    if (n === 1) return `With n = 1 each sample mean is just one value, so the pile is the population itself: centre ${mu}, width ${span("green", `σ = ${sS}`)}.${pop.normal ? " It is a bell because X is normal." : " It is not a bell, because X is not."}`;
    let s = `n = ${n}: the centre stays at ${mu} and the width shrinks from ${sS} to ${green}.`;
    const m = means(n);
    if (pop.normal) s += " Still a bell, because X is normal: just narrower and taller.";
    else if (pop.kind === "dice" && n === 2) s += " Two rolls average into a triangle: not exactly normal.";
    else if (n >= 30) s += (pop.kind === "exp" || pop.kind === "skew") && m.skew > 0.3 ? " Close to a bell now, with only a slight lean to the right: n ≥ 30." : " Close to a bell now: n ≥ 30.";
    else if ((pop.kind === "exp" || pop.kind === "skew") && m.skew > 0.5) s += " Still leaning to the right, like the population: not a good fit yet.";
    else s += " It looks closer to a bell, but X is not normal and n < 30, so the rule does not promise a bell yet.";
    return s;
  }

  const uid = ++xnpSeq;
  const pb = createPlayback({ count, unit: "step", stepMs: 2600, onFrame: frame });
  shell.film.append(pb.el);
  const row = el("div", "film-controls");
  const zb = el("button", "viz-btn", "zoom on the pile");
  zb.type = "button";
  zb.setAttribute("aria-pressed", "false");
  zb.addEventListener("click", () => {
    zoom = !zoom;
    zb.classList.toggle("active", zoom);
    zb.setAttribute("aria-pressed", String(zoom));
    pb.set(pb.pos());
  });
  row.append(zb);
  shell.film.append(row);
  return pb;
}
let xnpSeq = 0;

export const WIDGETS = {
  "sample-pile-play": samplePilePlay,
  "xbar-n-play": xbarNPlay,
};
