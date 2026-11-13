// "curve" diagrams: a static, labelled sketch of one or more probability curves with shaded
// areas, the kind an instructor draws beside a worked answer. Used through ```diagram blocks
// with "type": "curve" (see AUTHORING.md). Pure string building, so validate.js can lay a
// figure out in Bun without a DOM.
//
// Spec: { type: "curve", title?, caption?, cols?, panels: [panel] }   (or one panel's fields
//         at the top level). A panel:
//   { title?, x: [min, max], y?: [min, max], height?, xlabel?, ylabel?,
//     curves: [{ dist: "normal" (mu, sigma) | "exp" (beta) | "uniform" (a, b) |
//                      "mix" (parts: [[weight, mu, sigma], …]) | "bars" (start, values, hi?) |
//                      "steps" (start, values, noise?, cells?),
//                tone?, dashed?, label?, labelAt?: [x, yFrac] }],
//     shade:  [{ from?, to?, curve?, tone?, label?, labelAt?: [x, yFrac] }],
//     ticks:  [number | { x, label }],   yticks: [{ y, label }],
//     lines:  [{ x, curve?, full?, solid?, tone?, label? }],
//     points: [{ x, curve?, tone?, open?, label?, side?: "left" | "right" }],
//     spans:  [{ from, to, y: yFrac, label?, tone? }],          (a horizontal ↔)
//     heights:[{ x, of?, curve?, label?, side?, tone? }],       (a vertical ↕ from the axis to the curve)
//     notes:  [{ text: string | [lines], at: [x, yFrac], to?: [x, yFrac], anchor?, tone? }] }
// yFrac is a fraction of the plot height: 0 is the axis, 1 the top. Tones: ink, dim, hl, blue,
// green, red, purple.

export const CURVE_TONES = ["ink", "dim", "hl", "blue", "green", "red", "purple"];
const DISTS = ["normal", "exp", "uniform", "mix", "bars", "steps"];
const CYCLE = ["ink", "blue", "green", "purple", "red"];
const CH = 6.7;          // average glyph width at 12 px
const GAP = 16;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f1 = (n) => n.toFixed(1);
const tone = (t, d) => (CURVE_TONES.includes(t) ? t : d);
const textW = (s) => String(s).length * CH;

function npdf(x, mu, sigma) {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/** The height of a curve at x. */
export function curveAt(c, x) {
  switch (c.dist) {
    case "normal": return npdf(x, c.mu, c.sigma);
    case "exp": return x < 0 ? 0 : Math.exp(-x / c.beta) / c.beta;
    case "uniform": return x >= c.a && x <= c.b ? 1 / (c.b - c.a) : 0;
    case "mix": {
      const total = c.parts.reduce((s, p) => s + p[0], 0);
      return c.parts.reduce((s, p) => s + (p[0] / total) * npdf(x, p[1], p[2]), 0);
    }
    case "bars": { const v = c.values[Math.round(x) - (c.start || 0)]; return v == null ? 0 : v; }
    case "steps": {
      const i = Math.floor(x - (c.start || 0));
      const v = c.values[Math.min(c.values.length - 1, Math.max(0, i))];
      return v == null ? 0 : v;
    }
    default: return 0;
  }
}

/** Where a shaded region may start and stop on this curve (its support, cut to the panel). */
function support(c, x0, x1) {
  if (c.dist === "uniform") return [Math.max(x0, c.a), Math.min(x1, c.b)];
  if (c.dist === "exp") return [Math.max(x0, 0), x1];
  return [x0, x1];
}

function panelsOf(spec) {
  if (Array.isArray(spec.panels)) return spec.panels;
  const { type, title, caption, cols, panels, ...rest } = spec;
  return [rest];
}

function yRange(p) {
  if (Array.isArray(p.y)) return p.y;
  const [x0, x1] = p.x;
  let top = 0;
  for (const c of p.curves || []) {
    if (c.dist === "bars" || c.dist === "steps") { top = Math.max(top, ...c.values); continue; }
    for (let i = 0; i <= 240; i++) top = Math.max(top, curveAt(c, x0 + ((x1 - x0) * i) / 240));
  }
  return [0, (top || 1) * 1.14];
}

// Deterministic "noise" so a figure looks the same on every render.
function wobble(i) {
  const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

function drawPanel(p, ox, oy, W, mid) {
  const [x0, x1] = p.x;
  const [y0, y1] = yRange(p);
  const curves = p.curves || [];
  const hasY = !!p.ylabel || (p.yticks || []).length > 0;
  const L = (p.yticks || []).length ? 46 : 26, R = 30;
  const T = (p.title ? 22 : 0) + (p.ylabel ? 20 : 8) + 22;
  const ph = p.height || 160;
  const pw = W - L - R;
  const axisY = oy + T + ph;
  const X = (x) => ox + L + ((x - x0) / (x1 - x0)) * pw;
  const Y = (y) => axisY - ((y - y0) / (y1 - y0)) * ph;
  const YF = (f) => axisY - f * ph;
  const cv = (i) => curves[Math.min(curves.length - 1, Math.max(0, i || 0))] || { dist: "none" };
  const cTone = (c, i) => tone(c.tone, CYCLE[i % CYCLE.length]);
  let under = "", over = "", text = "";
  const label = (s, x, y, anchor = "middle", t = "ink", cls = "") => {
    const lines = Array.isArray(s) ? s : [s];
    lines.forEach((ln, k) => { text += `<text class="cv-text x-${t}${cls}" x="${f1(x)}" y="${f1(y + k * 14)}" text-anchor="${anchor}">${esc(ln)}</text>`; });
  };

  // ---- shaded areas (under everything else)
  for (const s of p.shade || []) {
    const c = cv(s.curve);
    const [lo, hi] = support(c, x0, x1);
    const a = Math.max(lo, s.from == null ? lo : s.from), b = Math.min(hi, s.to == null ? hi : s.to);
    if (!(b > a)) continue;
    const t = tone(s.tone, "hl");
    let d = `M${f1(X(a))} ${f1(axisY)}`;
    const n = 64;
    for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; d += `L${f1(X(x))} ${f1(Y(curveAt(c, x)))}`; }
    d += `L${f1(X(b))} ${f1(axisY)}Z`;
    under += `<path class="cv-shade f-${t}" d="${d}"/>`;
    if (s.label != null) {
      const m = (a + b) / 2, tw = textW(s.label) + 8;
      const hAt = (x) => (x < x0 || x > x1 ? 0 : axisY - Y(curveAt(c, x)));
      const inv = (px) => x0 + ((px - ox - L) / pw) * (x1 - x0);
      const leaderTo = `x2="${f1(X(m))}" y2="${f1(axisY - Math.max(3, hAt(m) * 0.4))}"`;
      // Room under the curve for a label centred at pixel cx, staying inside the shaded part.
      const room = (cx) => { let h = Infinity; for (let k = 0; k <= 8; k++) { const x = inv(cx - tw / 2 + (tw * k) / 8); h = Math.min(h, x < a || x > b ? 0 : hAt(x)); } return h; };
      let bestX = X(m), best = room(X(m));
      const span = X(b) - X(a) - tw;
      for (let k = 0; span > 0 && k <= 24; k++) { const cx = X(a) + tw / 2 + (span * k) / 24, h = room(cx); if (h > best + 0.5) { best = h; bestX = cx; } }
      if (s.labelAt) {
        const lx = X(s.labelAt[0]), ly = YF(s.labelAt[1]);
        label(s.label, lx, ly, "middle", t, " cv-strong");
        over += `<line class="cv-leader s-${t}" x1="${f1(lx)}" y1="${f1(ly + 5)}" ${leaderTo}/>`;
      } else if (best >= 30) {
        label(s.label, bestX, axisY - Math.max(12, best * 0.42) + 4, "middle", t, " cv-strong");
      } else {
        // Too small to hold its label: put it just above the curve, leaning away from the bulk.
        const atRight = b >= hi - 1e-9 && a > lo, atLeft = a <= lo + 1e-9 && b < hi;
        const lx = atRight ? X(a) + 6 : atLeft ? X(b) - 6 : X(m);
        const left = atRight ? lx : atLeft ? lx - tw : lx - tw / 2;
        let top = 0;
        for (let k = 0; k <= 8; k++) top = Math.max(top, hAt(inv(left + (tw * k) / 8)));
        const ly = Math.max(oy + T - 8, axisY - top - 12);
        label(s.label, lx, ly, atRight ? "start" : atLeft ? "end" : "middle", t, " cv-strong");
        over += `<line class="cv-leader s-${t}" x1="${f1(left + tw / 2)}" y1="${f1(ly + 5)}" ${leaderTo}/>`;
      }
    }
  }

  // ---- axes
  const axisEnd = ox + L + pw + 14;
  under += `<line class="cv-axis" x1="${f1(ox + L - 6)}" y1="${f1(axisY)}" x2="${f1(axisEnd)}" y2="${f1(axisY)}" marker-end="url(#${mid})"/>`;
  if (hasY) {
    const yx = x0 <= 0 && x1 >= 0 ? X(0) : ox + L;
    under += `<line class="cv-axis" x1="${f1(yx)}" y1="${f1(axisY)}" x2="${f1(yx)}" y2="${f1(oy + T - 14)}" marker-end="url(#${mid})"/>`;
    if (p.ylabel) label(p.ylabel, yx - 4, oy + T - 22, yx - ox < 60 ? "start" : "middle", "dim");
    for (const t of p.yticks || []) {
      under += `<line class="cv-tick" x1="${f1(yx - 4)}" y1="${f1(Y(t.y))}" x2="${f1(yx + 4)}" y2="${f1(Y(t.y))}"/>`;
      label(t.label == null ? t.y : t.label, yx - 8, Y(t.y) + 4, "end", "dim");
    }
  }

  // ---- curves
  curves.forEach((c, i) => {
    const t = cTone(c, i), dash = c.dashed ? " dashed" : "";
    if (c.dist === "bars") {
      const start = c.start || 0, hi = new Set(c.hi || []);
      c.values.forEach((v, k) => {
        const x = start + k, w = X(x + 0.45) - X(x - 0.45);
        under += `<rect class="cv-bar${hi.has(x) ? " f-hl" : ""}" x="${f1(X(x - 0.45))}" y="${f1(Y(v))}" width="${f1(w)}" height="${f1(axisY - Y(v))}"/>`;
      });
      return;
    }
    if (c.dist === "steps") {
      const start = c.start || 0;
      let d = "";
      c.values.forEach((v, k) => { d += `${k ? "L" : "M"}${f1(X(start + k))} ${f1(Y(v))}L${f1(X(start + k + 1))} ${f1(Y(v))}`; });
      over += `<path class="cv-curve s-${t}${dash}" d="${d}"/>`;
      if (c.noise) {
        let nd = "";
        const per = 9;
        c.values.forEach((v, k) => {
          for (let j = 0; j < per; j++) {
            const x = start + k + (j + 0.5) / per;
            nd += `${nd ? "L" : "M"}${f1(X(x))} ${f1(Y(v + wobble(k * per + j) * c.noise))}`;
          }
        });
        over += `<path class="cv-curve cv-thin s-${tone(c.noiseTone, "green")}" d="${nd}"/>`;
      }
      (c.cells || []).forEach((s, k) => label(s, X(start + k + 0.5), axisY - 6, "middle", "dim"));
      return;
    }
    if (c.dist === "uniform") {
      const h = Y(1 / (c.b - c.a)), xa = X(c.a), xb = X(c.b);
      if (c.a > x0) over += `<line class="cv-curve s-${t}" x1="${f1(X(x0))}" y1="${f1(axisY)}" x2="${f1(xa)}" y2="${f1(axisY)}"/>`;
      if (c.b < x1) over += `<line class="cv-curve s-${t}" x1="${f1(xb)}" y1="${f1(axisY)}" x2="${f1(X(x1))}" y2="${f1(axisY)}"/>`;
      over += `<line class="cv-drop s-${t}" x1="${f1(xa)}" y1="${f1(axisY)}" x2="${f1(xa)}" y2="${f1(h)}"/><line class="cv-drop s-${t}" x1="${f1(xb)}" y1="${f1(axisY)}" x2="${f1(xb)}" y2="${f1(h)}"/>`;
      over += `<line class="cv-curve s-${t}${dash}" x1="${f1(xa)}" y1="${f1(h)}" x2="${f1(xb)}" y2="${f1(h)}"/>`;
      over += `<circle class="cv-dot f-${t}" cx="${f1(xa)}" cy="${f1(h)}" r="3.6"/><circle class="cv-dot f-${t}" cx="${f1(xb)}" cy="${f1(h)}" r="3.6"/>`;
      if (c.label) label(c.label, (xa + xb) / 2, h - 9, "middle", t);
      return;
    }
    const [lo] = support(c, x0, x1);
    let d = "", peakX = lo, peak = -1;
    const n = 160;
    for (let k = 0; k <= n; k++) {
      const x = lo + ((x1 - lo) * k) / n, y = curveAt(c, x);
      if (y > peak) { peak = y; peakX = x; }
      d += `${k ? "L" : "M"}${f1(X(x))} ${f1(Y(y))}`;
    }
    over += `<path class="cv-curve s-${t}${dash}" d="${d}"/>`;
    if (c.dist === "exp") {
      if (x0 < 0) over += `<line class="cv-curve s-${t}" x1="${f1(X(x0))}" y1="${f1(axisY)}" x2="${f1(X(0))}" y2="${f1(axisY)}"/>`;
      over += `<circle class="cv-dot f-${t}" cx="${f1(X(0))}" cy="${f1(Y(1 / c.beta))}" r="3.6"/>`;
    }
    if (c.label) {
      if (c.labelAt) label(c.label, X(c.labelAt[0]), YF(c.labelAt[1]), "middle", t);
      else label(c.label, X(peakX) + (c.dist === "exp" ? 10 : 0), Y(peak) - 9, c.dist === "exp" ? "start" : "middle", t);
    }
  });

  // ---- vertical lines, points, arrows
  for (const l of p.lines || []) {
    const t = tone(l.tone, "dim");
    const top = l.full ? oy + T - 4 : Y(curveAt(cv(l.curve), l.x));
    over += `<line class="cv-line s-${t}${l.solid ? "" : " dashed"}" x1="${f1(X(l.x))}" y1="${f1(axisY)}" x2="${f1(X(l.x))}" y2="${f1(top)}"/>`;
    if (l.label != null) {
      if (l.side === "right" || l.side === "left") label(l.label, X(l.x) + (l.side === "left" ? -7 : 7), top - 4, l.side === "left" ? "end" : "start", t);
      else label(l.label, X(l.x), top - 7, "middle", t);
    }
  }
  for (const pt of p.points || []) {
    const t = tone(pt.tone, "hl"), px = X(pt.x), py = Y(curveAt(cv(pt.curve), pt.x));
    over += `<circle class="cv-dot ${pt.open ? "cv-open s-" + t : "f-" + t}" cx="${f1(px)}" cy="${f1(py)}" r="4"/>`;
    if (pt.label != null) label(pt.label, px + (pt.side === "left" ? -9 : 9), py - 5, pt.side === "left" ? "end" : "start", t);
  }
  for (const s of p.spans || []) {
    const t = tone(s.tone, "blue"), y = YF(s.y);
    over += `<line class="cv-arrowline s-${t}" x1="${f1(X(s.from) + 2)}" y1="${f1(y)}" x2="${f1(X(s.to) - 2)}" y2="${f1(y)}" marker-start="url(#${mid}-${t}-s)" marker-end="url(#${mid}-${t})"/>`;
    if (s.label != null) label(s.label, (X(s.from) + X(s.to)) / 2, y - 7, "middle", t);
  }
  for (const h of p.heights || []) {
    const t = tone(h.tone, "blue"), px = X(h.x), top = Y(curveAt(cv(h.curve), h.of == null ? h.x : h.of));
    over += `<line class="cv-arrowline s-${t}" x1="${f1(px)}" y1="${f1(axisY - 2)}" x2="${f1(px)}" y2="${f1(top + 2)}" marker-start="url(#${mid}-${t}-s)" marker-end="url(#${mid}-${t})"/>`;
    if (h.label != null) label(h.label, px + (h.side === "left" ? -8 : 8), (axisY + top) / 2 + 4, h.side === "left" ? "end" : "start", t);
  }
  for (const nt of p.notes || []) {
    const t = tone(nt.tone, "ink"), lines = Array.isArray(nt.text) ? nt.text : [nt.text];
    const nx = X(nt.at[0]), ny = YF(nt.at[1]), anchor = nt.anchor || "middle";
    label(lines, nx, ny, anchor, t);
    if (nt.to) {
      const tx = X(nt.to[0]), ty = YF(nt.to[1]);
      const w = Math.max(...lines.map(textW));
      const left = anchor === "start" ? nx : anchor === "end" ? nx - w : nx - w / 2;
      const below = ty > ny + (lines.length - 1) * 14;
      // Leave from the edge of the text that faces the target.
      const sx = tx < left - 4 ? left - 5 : tx > left + w + 4 ? left + w + 5 : Math.min(left + w, Math.max(left, tx));
      const sy = tx < left - 4 || tx > left + w + 4 ? ny - 4 + (lines.length - 1) * 7 : below ? ny + (lines.length - 1) * 14 + 5 : ny - 13;
      over += `<line class="cv-arrowline s-${t}" x1="${f1(sx)}" y1="${f1(sy)}" x2="${f1(tx)}" y2="${f1(ty)}" marker-end="url(#${mid}-${t})"/>`;
    }
  }

  // ---- ticks along the x axis; a label that would run into its neighbour drops a row
  let lastEnd = [-Infinity, -Infinity], rows = 1;
  const ticks = [...(p.ticks || [])].map((t) => (typeof t === "object" ? t : { x: t, label: String(t).replace("-", "−") })).sort((a, b) => a.x - b.x);
  for (const t of ticks) {
    const px = X(t.x), w = textW(t.label);
    under += `<line class="cv-tick" x1="${f1(px)}" y1="${f1(axisY - 4)}" x2="${f1(px)}" y2="${f1(axisY + 5)}"/>`;
    let row = 0;
    if (px - w / 2 < lastEnd[0] + 5) { row = 1; rows = 2; }
    label(t.label, px, axisY + 19 + row * 15, "middle", tone(t.tone, "ink"));
    lastEnd[row] = px + w / 2;
  }
  let bottom = axisY + 10 + (ticks.length ? rows * 15 : 0);
  if (p.xlabel) { label(p.xlabel, ox + L + pw / 2, bottom + 16, "middle", "dim"); bottom += 18; }
  if (p.title) text += `<text class="cv-title" x="${f1(ox + L + pw / 2)}" y="${f1(oy + 15)}" text-anchor="middle">${esc(p.title)}</text>`;
  return { svg: under + over + text, height: bottom + 8 - oy };
}

function grid(spec) {
  const n = panelsOf(spec).length;
  const cols = Math.max(1, Math.min(spec.cols || (n <= 3 ? n : 2), 3, n));
  return { cols, W: cols === 1 ? Math.min(spec.width || 600, 880) : cols === 2 ? 424 : 280 };
}

/** Each panel drawn on its own: [{ width, height, body }]. The page lays them out in a row
 *  that wraps, so a three-panel figure stacks on a phone instead of shrinking. */
export function layoutCurvePanels(spec, mid = "cv") {
  const { W } = grid(spec);
  return panelsOf(spec).map((p) => { const r = drawPanel(p, 0, 0, W, mid); return { width: W, height: Math.ceil(r.height), body: r.svg }; });
}

/** Pure layout of the whole figure: { width, height } in SVG user units, at full width. */
export function layoutCurve(spec, mid = "cv") {
  const { cols, W } = grid(spec);
  const ps = layoutCurvePanels(spec, mid);
  let height = 0;
  for (let i = 0; i < ps.length; i += cols) height += Math.max(...ps.slice(i, i + cols).map((q) => q.height)) + (i ? 6 : 0);
  return { type: "curve", width: cols * W + (cols - 1) * GAP, height, cols, panels: ps };
}

/** The <defs> a curve figure needs: one arrowhead per tone, at both ends. */
export function curveDefs(mid) {
  const m = (id, cls, start) => `<marker id="${id}" viewBox="0 0 10 10" refX="${start ? 1 : 9}" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="${cls}" d="M0 0L10 5L0 10Z"/></marker>`;
  let out = m(mid, "cv-head f-dim");
  for (const t of CURVE_TONES) out += m(`${mid}-${t}`, `cv-head f-${t}`) + m(`${mid}-${t}-s`, `cv-head f-${t}`, true);
  return `<defs>${out}</defs>`;
}

const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const isPair = (v) => Array.isArray(v) && v.length === 2 && v.every(isNum);

/** Problems with a curve spec, as strings (used by validate.js through diagramProblems). */
export function curveProblems(spec) {
  const out = [];
  const panels = panelsOf(spec);
  if (!panels.length) return ["curve diagram needs at least one panel"];
  if (panels.length > 6) out.push(`curve diagram has ${panels.length} panels (max 6)`);
  panels.forEach((p, i) => {
    const at = `panel ${i + 1}`;
    if (!p || typeof p !== "object") { out.push(`${at} is not an object`); return; }
    if (!isPair(p.x) || !(p.x[1] > p.x[0])) { out.push(`${at} needs "x": [min, max] with max above min`); return; }
    if (p.y != null && (!isPair(p.y) || !(p.y[1] > p.y[0]))) out.push(`${at} "y" must be [min, max]`);
    if (!Array.isArray(p.curves) || !p.curves.length) { out.push(`${at} needs a non-empty curves array`); return; }
    p.curves.forEach((c, k) => {
      const cat = `${at} curve ${k + 1}`;
      if (!c || !DISTS.includes(c.dist)) { out.push(`${cat}: unknown dist "${c && c.dist}" (use ${DISTS.join(", ")})`); return; }
      if (c.dist === "normal" && !(isNum(c.mu) && isNum(c.sigma) && c.sigma > 0)) out.push(`${cat}: normal needs mu and a positive sigma`);
      if (c.dist === "exp" && !(isNum(c.beta) && c.beta > 0)) out.push(`${cat}: exp needs a positive beta`);
      if (c.dist === "uniform" && !(isNum(c.a) && isNum(c.b) && c.b > c.a)) out.push(`${cat}: uniform needs a below b`);
      if (c.dist === "mix" && !(Array.isArray(c.parts) && c.parts.length && c.parts.every((q) => Array.isArray(q) && q.length === 3 && q.every(isNum) && q[2] > 0))) out.push(`${cat}: mix needs parts [[weight, mu, sigma], …]`);
      if ((c.dist === "bars" || c.dist === "steps") && !(Array.isArray(c.values) && c.values.length && c.values.every(isNum))) out.push(`${cat}: ${c.dist} needs a values array of numbers`);
      if (c.tone != null && !CURVE_TONES.includes(c.tone)) out.push(`${cat}: unknown tone "${c.tone}"`);
      if (c.labelAt != null && !isPair(c.labelAt)) out.push(`${cat}: labelAt must be [x, yFrac]`);
    });
    const nCurves = p.curves.length;
    const curveIdx = (o, what) => { if (o.curve != null && !(Number.isInteger(o.curve) && o.curve >= 0 && o.curve < nCurves)) out.push(`${at} ${what}: curve ${o.curve} does not exist`); };
    const toneOk = (o, what) => { if (o.tone != null && !CURVE_TONES.includes(o.tone)) out.push(`${at} ${what}: unknown tone "${o.tone}"`); };
    for (const key of ["shade", "ticks", "yticks", "lines", "points", "spans", "heights", "notes"]) if (p[key] != null && !Array.isArray(p[key])) out.push(`${at} "${key}" must be an array`);
    for (const s of Array.isArray(p.shade) ? p.shade : []) {
      curveIdx(s, "shade"); toneOk(s, "shade");
      if ((s.from != null && !isNum(s.from)) || (s.to != null && !isNum(s.to))) out.push(`${at} shade: from and to must be numbers`);
      else if (s.from != null && s.to != null && !(s.to > s.from)) out.push(`${at} shade: to must be above from`);
      if (s.labelAt != null && !isPair(s.labelAt)) out.push(`${at} shade: labelAt must be [x, yFrac]`);
    }
    for (const t of Array.isArray(p.ticks) ? p.ticks : []) if (!isNum(t) && !(t && isNum(t.x) && t.label != null)) out.push(`${at} tick must be a number or { x, label }`);
    for (const t of Array.isArray(p.yticks) ? p.yticks : []) if (!(t && isNum(t.y))) out.push(`${at} ytick needs a numeric y`);
    for (const l of Array.isArray(p.lines) ? p.lines : []) { curveIdx(l, "line"); toneOk(l, "line"); if (!isNum(l.x)) out.push(`${at} line needs a numeric x`); }
    for (const q of Array.isArray(p.points) ? p.points : []) { curveIdx(q, "point"); toneOk(q, "point"); if (!isNum(q.x)) out.push(`${at} point needs a numeric x`); }
    for (const s of Array.isArray(p.spans) ? p.spans : []) { toneOk(s, "span"); if (!(isNum(s.from) && isNum(s.to) && isNum(s.y))) out.push(`${at} span needs numeric from, to and y`); }
    for (const h of Array.isArray(p.heights) ? p.heights : []) { curveIdx(h, "height"); toneOk(h, "height"); if (!isNum(h.x)) out.push(`${at} height needs a numeric x`); }
    for (const nt of Array.isArray(p.notes) ? p.notes : []) {
      toneOk(nt, "note");
      if (nt.text == null || !isPair(nt.at)) out.push(`${at} note needs text and "at": [x, yFrac]`);
      if (nt.to != null && !isPair(nt.to)) out.push(`${at} note: "to" must be [x, yFrac]`);
    }
  });
  if (out.length) return out;
  const L = layoutCurve(spec);
  if (L.width > 880) out.push(`curve diagram is ${L.width} units wide (max 880)`);
  return out;
}
