// ```diagram block: a JSON figure rendered as inline SVG with the app's CSS variables.
// Spec: { type: "flow" | "layers" | "tree" | "grid" | "sequence", dir?: "lr" | "tb", title?,
//         nodes: [{ id, label, sub?, kind?: "box" | "pill" | "cylinder" | "note" | "lane",
//                   parent? (layers, tree), row?/col? (grid) }],
//         edges: [{ from, to, label?, dashed?, both? }], hi?: [ids], caption? }
// layout(spec) is pure (tested in Bun); mountDiagram(container, spec) draws it.

export const DIAGRAM_TYPES = ["flow", "layers", "tree", "grid", "sequence"];

const CHAR_W = 7.3;      // average glyph width at 13 px
const SUB_CHAR_W = 6.4;  // at 11.5 px
const LINE_H = 16;
const SUB_LINE_H = 14;
const PAD_X = 12;
const PAD_Y = 9;
const MARGIN = 20;
const MAX_ROW = 820;     // content width before a flow wraps
const GAP = 36;

/** Greedy word wrap at `n` characters; words longer than `n` are split. */
export function wrap(text, n) {
  const out = [];
  for (const para of String(text ?? "").split("\n")) {
    let line = "";
    for (let word of para.split(/\s+/).filter(Boolean)) {
      while (word.length > n) {
        if (line) { out.push(line); line = ""; }
        out.push(word.slice(0, n));
        word = word.slice(n);
      }
      if (!line) line = word;
      else if (line.length + 1 + word.length <= n) line += " " + word;
      else { out.push(line); line = word; }
    }
    out.push(line);
  }
  while (out.length > 1 && out[out.length - 1] === "") out.pop();
  return out;
}

function measure(node, chars = 18, minW = 96, maxW = 220) {
  const lines = wrap(node.label ?? node.id, chars);
  const subLines = node.sub ? wrap(node.sub, Math.round(chars * 1.2)) : [];
  const longest = Math.max(...lines.map((l) => l.length * CHAR_W), ...subLines.map((l) => l.length * SUB_CHAR_W), 0);
  const w = Math.min(maxW, Math.max(minW, Math.ceil(longest + 2 * PAD_X)));
  let h = 2 * PAD_Y + lines.length * LINE_H + subLines.length * SUB_LINE_H;
  if (node.kind === "cylinder") h += 14;
  return { lines, subLines, w, h };
}

function baseNode(n, hi) {
  return { id: n.id, label: n.label ?? n.id, sub: n.sub || "", kind: n.kind || "box", hi: hi.has(n.id), x: 0, y: 0, w: 0, h: 0, lines: [], subLines: [] };
}

/** Point where the segment from the centre of `n` towards (tx, ty) leaves n's rectangle. */
function clip(n, tx, ty) {
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  const dx = tx - cx, dy = ty - cy;
  if (!dx && !dy) return [cx, cy];
  const s = Math.min(dx ? (n.w / 2) / Math.abs(dx) : Infinity, dy ? (n.h / 2) / Math.abs(dy) : Infinity);
  return [cx + dx * s, cy + dy * s];
}

function straightEdges(spec, byId, hi) {
  return (spec.edges || []).filter((e) => byId.has(e.from) && byId.has(e.to)).map((e) => {
    const a = byId.get(e.from), b = byId.get(e.to);
    const p1 = clip(a, b.x + b.w / 2, b.y + b.h / 2);
    const p2 = clip(b, a.x + a.w / 2, a.y + a.h / 2);
    return { from: e.from, to: e.to, label: e.label || "", dashed: !!e.dashed, both: !!e.both, points: [p1, p2], hi: hi.has(e.from + ">" + e.to) || (hi.has(e.from) && hi.has(e.to)) };
  });
}

function layoutFlow(spec, hi) {
  const tb = spec.dir === "tb";
  const nodes = spec.nodes.map((n) => Object.assign(baseNode(n, hi), measure(n)));
  // Widen the gap between consecutive nodes joined by a labelled edge so the label fits.
  const gapAfter = nodes.map((n, i) => {
    const next = nodes[i + 1];
    if (!next) return GAP;
    const labels = (spec.edges || []).filter((e) => (e.from === n.id && e.to === next.id) || (e.to === n.id && e.from === next.id)).map((e) => e.label || "");
    const longest = Math.max(0, ...labels.map((l) => l.length));
    return tb ? (longest ? 40 : GAP) : Math.min(170, Math.max(GAP, Math.ceil(longest * 6.8 + 22)));
  });
  if (!tb) {
    let x = 0, row = [], rows = [];
    nodes.forEach((n, i) => {
      if (row.length && x + n.w > MAX_ROW) { rows.push(row); row = []; x = 0; }
      n.x = x; row.push(n);
      x += n.w + gapAfter[i];
    });
    if (row.length) rows.push(row);
    let y = 0;
    for (const r of rows) {
      const rh = Math.max(...r.map((n) => n.h));
      r.forEach((n) => { n.y = y + (rh - n.h) / 2; });
      y += rh + 56;
    }
  } else {
    const maxH = 520;
    let y = 0, x = 0, col = [], cols = [];
    nodes.forEach((n, i) => {
      if (col.length && y + n.h > maxH) { cols.push(col); col = []; y = 0; }
      n.y = y; col.push(n);
      y += n.h + gapAfter[i];
    });
    if (col.length) cols.push(col);
    for (const c of cols) {
      const cw = Math.max(...c.map((n) => n.w));
      c.forEach((n) => { n.x = x + (cw - n.w) / 2; });
      x += cw + 90;
    }
  }
  return finish(spec, nodes, hi);
}

function layoutLayers(spec, hi) {
  const BAND_W = 700, INSET = 18, HEAD_GAP = 6, STACK_GAP = 10;
  const nodes = spec.nodes.map((n) => Object.assign(baseNode(n, hi), { parent: n.parent || null }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const kids = new Map(nodes.map((n) => [n.id, []]));
  const roots = [];
  for (const n of nodes) (n.parent && byId.has(n.parent) ? kids.get(n.parent) : roots).push(n);
  // Band width: the widest label (one line, up to 60 chars) plus the insets of its depth,
  // between 360 and BAND_W, so short labels give a figure that stays legible on a phone.
  const depthOf = (n) => { let d = 0; for (let p = n; p.parent && byId.has(p.parent) && d < 40; p = byId.get(p.parent)) d++; return d; };
  const need = Math.max(0, ...nodes.map((n) => Math.min(60, Math.max(String(n.label).length, n.sub.length * 0.88)) * CHAR_W + 2 * PAD_X + 2 * INSET * depthOf(n)));
  const bandW = Math.round(Math.max(360, Math.min(BAND_W, need + 24)));
  function place(n, x, y, w, depth) {
    const chars = Math.max(18, Math.floor((w - 2 * PAD_X) / CHAR_W));
    n.lines = wrap(n.label, chars);
    n.subLines = n.sub ? wrap(n.sub, Math.floor((w - 2 * PAD_X) / SUB_CHAR_W)) : [];
    n.x = x; n.y = y; n.w = w; n.depth = depth;
    const headH = PAD_Y + n.lines.length * LINE_H + n.subLines.length * SUB_LINE_H + PAD_Y;
    let cy = y + headH + HEAD_GAP;
    const children = kids.get(n.id);
    children.forEach((c, i) => {
      cy = place(c, x + INSET, cy, w - 2 * INSET, depth + 1) + (i < children.length - 1 ? STACK_GAP : 0);
    });
    n.h = (children.length ? cy + INSET : y + headH) - y;
    n.headH = headH;
    return y + n.h;
  }
  let y = 0;
  roots.forEach((r) => { y = place(r, 0, y, bandW, 0) + STACK_GAP; });
  return finish(spec, nodes, hi);
}

function layoutTree(spec, hi) {
  const SIB_GAP = 22, LEVEL_GAP = 46;
  const nodes = spec.nodes.map((n) => Object.assign(baseNode(n, hi), measure(n), { parent: n.parent || null }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const kids = new Map(nodes.map((n) => [n.id, []]));
  const roots = [];
  for (const n of nodes) (n.parent && byId.has(n.parent) ? kids.get(n.parent) : roots).push(n);
  const span = new Map();
  const width = (n) => {
    const cs = kids.get(n.id);
    const s = cs.length ? Math.max(n.w, cs.reduce((a, c) => a + width(c), 0) + SIB_GAP * (cs.length - 1)) : n.w;
    span.set(n.id, s);
    return s;
  };
  const levelH = [];
  const depthOf = (n, d) => { n.depth = d; levelH[d] = Math.max(levelH[d] || 0, n.h); kids.get(n.id).forEach((c) => depthOf(c, d + 1)); };
  roots.forEach((r) => { width(r); depthOf(r, 0); });
  const levelY = [];
  levelH.forEach((h, d) => { levelY[d] = d ? levelY[d - 1] + levelH[d - 1] + LEVEL_GAP : 0; });
  const place = (n, left) => {
    const s = span.get(n.id);
    n.x = left + (s - n.w) / 2;
    n.y = levelY[n.depth] + (levelH[n.depth] - n.h) / 2;
    const cs = kids.get(n.id);
    const total = cs.reduce((a, c) => a + span.get(c.id), 0) + SIB_GAP * Math.max(0, cs.length - 1);
    let x = left + (s - total) / 2;
    cs.forEach((c) => { place(c, x); x += span.get(c.id) + SIB_GAP; });
  };
  let x = 0;
  roots.forEach((r) => { place(r, x); x += span.get(r.id) + SIB_GAP * 2; });
  const treeEdges = nodes.filter((n) => n.parent && byId.has(n.parent)).map((n) => {
    const p = byId.get(n.parent);
    return { from: p.id, to: n.id, label: "", dashed: false, both: false, tree: true, points: [[p.x + p.w / 2, p.y + p.h], [n.x + n.w / 2, n.y]], hi: p.hi && n.hi };
  });
  return finish(spec, nodes, hi, treeEdges);
}

function layoutGrid(spec, hi) {
  const cells = spec.nodes.map((n) => Object.assign(baseNode(n, hi), { row: n.row | 0, col: n.col | 0 }));
  const nCols = Math.max(1, ...cells.map((c) => c.col + 1));
  const nRows = Math.max(1, ...cells.map((c) => c.row + 1));
  const colMax = Math.min(240, Math.floor((MAX_ROW + 20) / nCols));
  const chars = Math.max(8, Math.floor((colMax - 2 * PAD_X) / CHAR_W));
  const colW = Array(nCols).fill(60), rowH = Array(nRows).fill(0);
  for (const c of cells) {
    Object.assign(c, measure(c, chars, 60, colMax));
    c.head = c.row === 0 || c.col === 0;
    colW[c.col] = Math.max(colW[c.col], c.w);
    rowH[c.row] = Math.max(rowH[c.row], c.h);
  }
  const colX = colW.map((_, i) => colW.slice(0, i).reduce((a, b) => a + b, 0));
  const rowY = rowH.map((_, i) => rowH.slice(0, i).reduce((a, b) => a + b, 0));
  for (const c of cells) { c.x = colX[c.col]; c.y = rowY[c.row]; c.w = colW[c.col]; c.h = rowH[c.row]; c.kind = "cell"; }
  return finish(spec, cells, hi);
}

function layoutSequence(spec, hi) {
  const lanesIn = spec.nodes.some((n) => n.kind === "lane") ? spec.nodes.filter((n) => n.kind === "lane") : spec.nodes;
  const n = lanesIn.length;
  // Lane spacing fits the longest message label ("N. label") and lane title, capped so it fits 820.
  const longestMsg = Math.max(0, ...(spec.edges || []).map((e, i) => `${i + 1}. ${e.label || ""}`.length));
  const longestLane = Math.max(0, ...lanesIn.map((l) => String(l.label ?? l.id).length));
  const want = Math.max(130, longestMsg * 6.8 + 28, Math.min(18, longestLane) * CHAR_W + 2 * PAD_X + 16);
  const pitch = Math.round(Math.min(want, 240, Math.max(130, Math.floor(MAX_ROW / Math.max(1, n)))));
  const nodes = lanesIn.map((ln, i) => {
    const node = Object.assign(baseNode(ln, hi), measure(ln, 18, 96, pitch - 16));
    node.kind = "lane";
    node.x = i * pitch + (pitch - node.w) / 2;
    node.y = 0;
    return node;
  });
  const headH = Math.max(0, ...nodes.map((x) => x.h));
  nodes.forEach((x) => { x.h = headH; });
  const byId = new Map(nodes.map((x) => [x.id, x]));
  const STEP = 46;
  const edges = (spec.edges || []).filter((e) => byId.has(e.from) && byId.has(e.to)).map((e, i) => {
    const a = byId.get(e.from), b = byId.get(e.to);
    const y = headH + 38 + i * STEP;
    const ax = a.x + a.w / 2, bx = b.x + b.w / 2;
    const pts = e.from === e.to ? [[ax, y], [ax + 40, y], [ax + 40, y + 18], [ax, y + 18]] : [[ax, y], [bx, y]];
    return { from: e.from, to: e.to, label: `${i + 1}. ${e.label || ""}`.trim(), dashed: !!e.dashed, both: !!e.both, points: pts, hi: hi.has(String(i + 1)) || hi.has(e.from + ">" + e.to) };
  });
  const bottom = headH + 38 + Math.max(0, edges.length) * STEP;
  const lifelines = nodes.map((x) => ({ x: x.x + x.w / 2, y1: headH, y2: bottom }));
  return finish(spec, nodes, hi, edges, { lifelines, noStraight: true });
}

function finish(spec, nodes, hi, extraEdges = [], extra = {}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edges = extra.noStraight ? extraEdges : [...extraEdges, ...straightEdges(spec, byId, hi)];
  // Place edge labels, then measure the extent of nodes, edges and labels on both sides and
  // shift everything so the leftmost thing sits at the margin (a centred label wider than the
  // layout would otherwise start at a negative x and be clipped).
  for (const e of edges) if (e.label) e.labelAt = labelPlace(e);
  const lifelines = (extra.lifelines || []).map((l) => ({ ...l }));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const see = (x0, x1, y0, y1) => { minX = Math.min(minX, x0); maxX = Math.max(maxX, x1); minY = Math.min(minY, y0); maxY = Math.max(maxY, y1); };
  for (const n of nodes) see(n.x, n.x + n.w, n.y, n.y + n.h);
  for (const e of edges) {
    for (const [x, y] of e.points) see(x, x, y, y);
    if (e.labelAt) see(e.labelAt.x0, e.labelAt.x1, e.labelAt.y - 12, e.labelAt.y + 4);
  }
  for (const l of lifelines) see(l.x, l.x, l.y1, l.y2);
  if (minX === Infinity) minX = maxX = minY = maxY = 0;
  const dx = MARGIN - minX, dy = MARGIN - Math.min(minY, 0);
  for (const n of nodes) { n.x += dx; n.y += dy; }
  for (const e of edges) {
    e.points = e.points.map(([x, y]) => [x + dx, y + dy]);
    if (e.labelAt) Object.assign(e.labelAt, { x: e.labelAt.x + dx, x0: e.labelAt.x0 + dx, x1: e.labelAt.x1 + dx, y: e.labelAt.y + dy });
  }
  for (const l of lifelines) { l.x += dx; l.y1 += dy; l.y2 += dy; }
  return { type: spec.type, width: Math.ceil(maxX + dx + MARGIN), height: Math.ceil(maxY + dy + MARGIN), nodes, edges, lifelines };
}

const LABEL_CHAR_W = 6.8; // average glyph width of the 12 px edge label

/** Where an edge's label goes: above a horizontal edge, right of a vertical or looped one. */
function labelPlace(e) {
  const a = e.points[0], b = e.points[e.points.length - 1];
  const w = e.label.length * LABEL_CHAR_W;
  if (e.points.length > 2) {
    const x = Math.max(...e.points.map((p) => p[0])) + 6;
    return { x, y: (a[1] + b[1]) / 2 + 4, anchor: "start", x0: x, x1: x + w };
  }
  const steep = Math.abs(b[1] - a[1]) > Math.abs(b[0] - a[0]);
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  if (steep) return { x: mx + 8, y: my + 4, anchor: "start", x0: mx + 8, x1: mx + 8 + w };
  return { x: mx, y: my - 7, anchor: "middle", x0: mx - w / 2, x1: mx + w / 2 };
}

/** Pure layout: positions and sizes for every node and edge (SVG user units). */
export function layout(spec) {
  const hi = new Set(spec.hi || []);
  const s = { ...spec, nodes: spec.nodes || [], edges: spec.edges || [] };
  switch (spec.type) {
    case "layers": return layoutLayers(s, hi);
    case "tree": return layoutTree(s, hi);
    case "grid": return layoutGrid(s, hi);
    case "sequence": return layoutSequence(s, hi);
    default: return layoutFlow(s, hi);
  }
}

// ---- rendering -------------------------------------------------------------------------
let mountCount = 0;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function nodeShape(n) {
  const hi = n.hi ? " dg-hi" : "";
  const { x, y, w, h } = n;
  if (n.kind === "pill") return `<rect class="dg-pill${hi}" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>`;
  if (n.kind === "note") {
    const f = 10;
    return `<path class="dg-note${hi}" d="M${x} ${y}H${x + w - f}L${x + w} ${y + f}V${y + h}H${x}Z"/>`;
  }
  if (n.kind === "cylinder") {
    const ry = 7;
    return `<path class="dg-cyl${hi}" d="M${x} ${y + ry}A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry}Z"/>` +
      `<path class="dg-cyl${hi}" d="M${x} ${y + ry}A${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry}" fill="none"/>`;
  }
  if (n.kind === "cell") return `<rect class="dg-cell${n.head ? " dg-head" : ""}${hi}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  if (n.kind === "lane") return `<rect class="dg-lane-head${hi}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
  if (n.depth != null && n.headH != null) return `<rect class="dg-band depth-${Math.min(3, n.depth)}${hi}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
  return `<rect class="dg-box${hi}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
}

function nodeText(n) {
  const band = n.headH != null;
  const cx = band ? n.x + PAD_X : n.x + n.w / 2;
  const anchor = band ? "start" : "middle";
  const total = n.lines.length * LINE_H + n.subLines.length * SUB_LINE_H;
  let y = band ? n.y + PAD_Y + 12 : n.y + (n.h - total) / 2 + 12 + (n.kind === "cylinder" ? 5 : 0);
  const cls = n.kind === "cell" && n.head ? ' class="dg-head-text"' : "";
  let out = "";
  for (const l of n.lines) { out += `<text${cls} x="${cx}" y="${y}" text-anchor="${anchor}">${esc(l)}</text>`; y += LINE_H; }
  for (const l of n.subLines) { out += `<text class="dg-sub" x="${cx}" y="${y - 1}" text-anchor="${anchor}">${esc(l)}</text>`; y += SUB_LINE_H; }
  return out;
}

function edgeSvg(e, mid) {
  const hi = e.hi ? " dg-hi" : "";
  const d = "M" + e.points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
  const marker = e.tree ? "" : ` marker-end="url(#${mid}${e.hi ? "-hi" : ""})"` + (e.both ? ` marker-start="url(#${mid}${e.hi ? "-hi" : ""}-s)"` : "");
  let out = `<path class="dg-edge${e.dashed ? " dashed" : ""}${hi}" d="${d}"${marker}/>`;
  if (e.labelAt) {
    const { x, y, anchor } = e.labelAt;
    out += `<text class="dg-edge-label${hi}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}">${esc(e.label)}</text>`;
  }
  return out;
}

/** Render a diagram spec into `container` as responsive inline SVG with an optional caption. */
export function mountDiagram(container, spec) {
  const L = layout(spec);
  const mid = `dg-arrow-${++mountCount}`;
  const arrow = (id, cls, start) => `<marker id="${id}" viewBox="0 0 10 10" refX="${start ? 1 : 9}" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="${cls}" d="M0 0L10 5L0 10Z"/></marker>`;
  const defs = `<defs>${arrow(mid, "dg-arrow")}${arrow(mid + "-hi", "dg-arrow dg-hi")}${arrow(mid + "-s", "dg-arrow", true)}${arrow(mid + "-hi-s", "dg-arrow dg-hi", true)}</defs>`;
  const lifelines = L.lifelines.map((l) => `<line class="dg-lifeline" x1="${l.x}" y1="${l.y1}" x2="${l.x}" y2="${l.y2}"/>`).join("");
  // Bands draw outermost first so nested bands sit on top.
  const order = [...L.nodes].sort((a, b) => (a.depth || 0) - (b.depth || 0));
  const shapes = order.map((n) => nodeShape(n) + nodeText(n)).join("");
  const edges = L.edges.map((e) => edgeSvg(e, mid)).join("");
  const label = spec.title || spec.caption || "diagram";
  const wrapEl = document.createElement("figure");
  wrapEl.className = `diagram diagram-${L.type}`;
  wrapEl.innerHTML =
    (spec.title ? `<div class="diagram-title">${esc(spec.title)}</div>` : "") +
    `<svg viewBox="0 0 ${L.width} ${L.height}" style="max-width:${L.width}px" role="img" aria-label="${esc(label)}">${defs}${lifelines}${shapes}${edges}</svg>` +
    (spec.caption ? `<figcaption class="diagram-caption">${esc(spec.caption)}</figcaption>` : "");
  container.appendChild(wrapEl);
  return wrapEl;
}

/** Problems with a diagram spec, as strings (used by validate.js). */
export function diagramProblems(spec) {
  const out = [];
  if (!spec || typeof spec !== "object") return ["diagram JSON is not an object"];
  if (!DIAGRAM_TYPES.includes(spec.type)) out.push(`unknown diagram type "${spec.type}" (use ${DIAGRAM_TYPES.join(", ")})`);
  if (!Array.isArray(spec.nodes) || !spec.nodes.length) { out.push("diagram needs a non-empty nodes array"); return out; }
  if (spec.nodes.length > 40) out.push(`diagram has ${spec.nodes.length} nodes (max 40)`);
  const ids = new Set();
  for (const n of spec.nodes) {
    if (!n || n.id == null || n.id === "") { out.push("diagram node without an id"); continue; }
    if (ids.has(n.id)) out.push(`duplicate node id "${n.id}"`);
    ids.add(n.id);
  }
  for (const n of spec.nodes) if (n && n.parent != null && !ids.has(n.parent)) out.push(`unknown parent "${n.parent}" on node "${n.id}"`);
  if (spec.edges != null && !Array.isArray(spec.edges)) out.push("diagram edges must be an array");
  for (const e of spec.edges || []) {
    if (!ids.has(e.from)) out.push(`unknown node "${e.from}" in edge`);
    if (!ids.has(e.to)) out.push(`unknown node "${e.to}" in edge`);
  }
  if (spec.type === "grid") for (const n of spec.nodes) if (!Number.isInteger(n.row) || !Number.isInteger(n.col)) out.push(`grid node "${n.id}" needs integer row and col`);
  if (out.length) return out;
  // Layout checks: a figure over 880 units shrinks below legibility on a phone, and an edge
  // label that runs into a box hides both.
  const L = layout(spec);
  if (L.width > 880) out.push(`diagram is ${L.width} units wide (max 880): fewer nodes per row, shorter labels, or dir "tb"`);
  for (const e of L.edges) {
    if (!e.labelAt) continue;
    const top = e.labelAt.y - 12, bottom = e.labelAt.y + 3;
    const hit = L.nodes.find((n) => n.kind !== "lane" && e.labelAt.x0 < n.x + n.w - 1 && e.labelAt.x1 > n.x + 1 && top < n.y + n.h && bottom > n.y);
    if (hit) out.push(`edge label "${e.label}" overlaps node "${hit.id}"; shorten it`);
  }
  return out;
}
