// Interactive data-communications widgets for COMP 3721 Week 6 (Lectures 06a and 06b): one link shared
// as n channels (FDM plans with guard bands, synchronous TDM frames and their rates, data-rate management
// by multilevel multiplexing, multiple-slot allocation and pulse stuffing), link-layer addresses that
// change at every hop, and ARP's broadcast request and unicast reply.
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
const FREQ_UNITS = [["Hz", 1], ["kHz", 1e3], ["MHz", 1e6], ["GHz", 1e9]];
const RATE_UNITS = [["bps", 1], ["kbps", 1e3], ["Mbps", 1e6], ["Gbps", 1e9]];
const TIME_UNITS = [["ns", 1e-9], ["μs", 1e-6], ["ms", 1e-3], ["s", 1]];
function bestUnit(value, units) {
  const v = Math.abs(value);
  if (!(v > 0) || !Number.isFinite(v)) return units[0];
  let best = units[0];
  for (const u of units) if (v / u[1] >= 1 - 1e-9) best = u;
  return best;
}
/** Display form of a number: up to d decimals, thin-space digit groups from 10 000 up, a real minus sign. */
function num(v, d = 4) {
  if (!Number.isFinite(v)) return "—";
  const r = Number(v.toFixed(d));
  const [int, frac] = String(Number(Math.abs(r).toFixed(d))).split(".");
  const grouped = int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : int;
  return (r < 0 ? "−" : "") + grouped + (frac ? "." + frac : "");
}
function withUnit(value, units, d = 4) {
  if (!Number.isFinite(value)) return num(value);
  const u = bestUnit(value, units);
  return `${num(value / u[1], d)} ${u[0]}`;
}
/** A labelled number with a unit selector. get() is in base units (NaN when empty); unit() is [name, factor]. */
function unitField(label, units, value, unit) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = "any"; input.value = value ?? "";
  input.setAttribute("aria-label", label);
  const sel = document.createElement("select");
  sel.setAttribute("aria-label", `${label} unit`);
  for (const [u] of units) { const o = document.createElement("option"); o.value = u; o.textContent = u; if (u === unit) o.selected = true; sel.append(o); }
  row.append(el("label", null, label), input, sel);
  const unitOf = () => units.find(([u]) => u === sel.value) || units[0];
  return {
    row, input,
    get: () => parseFloat(input.value) * unitOf()[1],
    unit: unitOf,
    setRaw: (v, u) => { input.value = v ?? ""; if (u && units.some(([x]) => x === u)) sel.value = u; },
    on: (fn) => { input.addEventListener("input", fn); sel.addEventListener("change", fn); },
  };
}
/** A labelled text box; get() is the trimmed text. */
function textField(label, value, suffix, width = 220) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "text"; input.spellcheck = false; input.value = value ?? "";
  input.setAttribute("aria-label", label);
  input.style.width = `${width}px`; input.style.maxWidth = "100%";
  row.append(el("label", null, label), input);
  if (suffix) row.append(el("span", "stat-label", suffix));
  return { row, input, get: () => input.value.trim(), set: (v) => { input.value = v ?? ""; }, on: (fn) => input.addEventListener("input", fn) };
}
function checkbox(label, checked, onChange) {
  const lab = el("label", "net5-check");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, document.createTextNode(label));
  return { row: lab, input };
}
let uid = 0;
/** Arrow-head marker for one SVG; returns the url() reference. */
function arrowMarker(svg, color) {
  const id = `net5-arrow-${++uid}`;
  let defs = svg.querySelector("defs");
  if (!defs) { defs = svgEl("defs"); svg.prepend(defs); }
  const m = svgEl("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  m.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: color }));
  defs.append(m);
  return `url(#${id})`;
}
// Address labels: N₁, L_A. `sub` is the subscript as written on the slides.
const addr = (base, sub) => ({ base, sub, key: base + sub });
const SUB_DIGITS = "₀₁₂₃₄₅₆₇₈₉";
const subText = (s) => String(s).replace(/\d/g, (d) => SUB_DIGITS[+d]);
const addrText = (a) => a.base + (/^\d+$/.test(a.sub) ? subText(a.sub) : "_" + a.sub);
const addrHtml = (a) => `${a.base}<sub>${a.sub}</sub>`;
/** One SVG text made of strings and addresses (subscripts as tspans). `hot` is a set of address keys to highlight. */
function svgLabel(x, y, parts, attrs = {}, hot) {
  const t = svgEl("text", { x, y, "font-size": 12, fill: "var(--ink)", ...attrs });
  let shifted = false;
  for (const p of parts) {
    if (typeof p === "string") { t.append(svgEl("tspan", { dy: shifted ? -3 : 0 }, p)); shifted = false; continue; }
    const isHot = hot && hot.has(p.key);
    const base = svgEl("tspan", { dy: shifted ? -3 : 0, fill: isHot ? "var(--hl)" : attrs.fill || "var(--ink)", "font-weight": isHot ? "700" : "400" }, p.base);
    const sub = svgEl("tspan", { dy: 3, "font-size": 9, fill: isHot ? "var(--hl)" : attrs.fill || "var(--ink)", "font-weight": isHot ? "700" : "400" }, p.sub);
    t.append(base, sub); shifted = true;
  }
  return t;
}
/** The student's answer for an address, normalised: "L₂", "L_2", "l2" all become "L2". */
const normAddr = (s) => String(s ?? "").replace(/[₀-₉]/g, (c) => String(SUB_DIGITS.indexOf(c))).toUpperCase().replace(/[^A-Z0-9]/g, "");
const LINE_FILL = ["var(--blue)", "var(--hl)", "var(--purple)", "var(--ink-dim)", "var(--ink-2)", "var(--rule-strong)"];
const presetsOf = (cfg, fallback) => (cfg.presets && typeof cfg.presets === "object" && Object.keys(cfg.presets).length ? cfg.presets : fallback);

// ---------- widget: fdm-plan ----------
const FDM_PRESETS = {
  "Three voice channels (slide 17)": { n: 3, bandwidth: 4, unit: "kHz", guard: 0, start: 20 },
  "Example 1 (five 100 kHz channels, 10 kHz guard)": { n: 5, bandwidth: 100, unit: "kHz", guard: 10, start: 0 },
};
function fdmPlan(box, cfg) {
  const presets = presetsOf(cfg, FDM_PRESETS), names = Object.keys(presets);
  let n = clamp(Math.round(+cfg.n || 3), 2, 8);
  const u0 = FREQ_UNITS.some(([u]) => u === cfg.unit) ? cfg.unit : "kHz";
  box.append(el("h4", null, cfg.title || "FDM: n channels, guard bands and the link bandwidth"));
  box.append(btnRow(names, (i) => apply(presets[names[i]]), -1));
  const sN = slider("Channels n", 2, 8, 1, n, (v) => { n = v; draw(); }, (v) => String(v));
  const Bf = unitField("channel bandwidth B", FREQ_UNITS, cfg.bandwidth ?? 4, u0);
  const Gf = unitField("guard band G", FREQ_UNITS, cfg.guard ?? 0, u0);
  const Sf = unitField("link starts at", FREQ_UNITS, cfg.start ?? 20, u0);
  const svg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sN.row, Bf.row, Gf.row, Sf.row, svg, steps, out, note);
  function apply(p) {
    p = p || {};
    n = clamp(Math.round(+p.n || 3), 2, 8); sN.set(n);
    const u = FREQ_UNITS.some(([x]) => x === p.unit) ? p.unit : "kHz";
    Bf.setRaw(p.bandwidth ?? 4, u); Gf.setRaw(p.guard ?? 0, u); Sf.setRaw(p.start ?? 0, u);
    draw();
  }
  function draw() {
    svg.innerHTML = "";
    const B = Bf.get(), g = Gf.get(), s = Sf.get();
    const G = Number.isFinite(g) ? Math.max(0, g) : 0, S = Number.isFinite(s) ? Math.max(0, s) : 0;
    if (!(B > 0)) { steps.textContent = "Enter a channel bandwidth greater than 0."; out.innerHTML = ""; note.textContent = ""; return; }
    const [uName, uF] = Bf.unit();
    const f = (v) => num(v / uF, 3);
    const total = n * B + (n - 1) * G;
    const bands = Array.from({ length: n }, (_, k) => { const lo = S + k * (B + G); return [lo, lo + B]; });
    const X0 = 30, X1 = 600, BASE = 96, TOP = 46, sx = (v) => X0 + ((v - S) / total) * (X1 - X0);
    svg.append(svgEl("line", { x1: X0 - 12, y1: BASE, x2: X1 + 16, y2: BASE, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("polygon", { points: `${X1 + 16},${BASE - 4} ${X1 + 24},${BASE} ${X1 + 16},${BASE + 4}`, fill: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: X0 - 12, y: BASE + 17, "font-size": 10.5, fill: "var(--ink-dim)" }, "f"));
    bands.forEach(([lo, hi], k) => {
      const xa = sx(lo), xb = sx(hi), w = xb - xa;
      svg.append(svgEl("polygon", { points: `${xa.toFixed(1)},${BASE} ${(xa + w * 0.22).toFixed(1)},${TOP} ${(xb - w * 0.22).toFixed(1)},${TOP} ${xb.toFixed(1)},${BASE}`, fill: "var(--blue)", opacity: 0.55, stroke: "var(--blue)" }));
      if (w > 26) svg.append(svgEl("text", { x: (xa + xb) / 2, y: TOP - 8, "text-anchor": "middle", "font-size": 11, fill: "var(--ink)" }, w > 70 ? `channel ${k + 1}` : String(k + 1)));
      if (G > 0 && k < n - 1) {
        const ga = xb, gb = sx(hi + G);
        svg.append(svgEl("rect", { x: ga, y: TOP + 12, width: gb - ga, height: BASE - TOP - 12, fill: "var(--hl)", opacity: 0.3 }));
        if (gb - ga > 36) svg.append(svgEl("text", { x: (ga + gb) / 2, y: BASE - 8, "text-anchor": "middle", "font-size": 10, fill: "var(--hl)" }, "guard"));
      }
    });
    const marks = new Map();
    for (const [lo, hi] of bands) { marks.set(lo, f(lo)); marks.set(hi, f(hi)); }
    let last = -1e9;
    for (const [v, label] of [...marks.entries()].sort((a, b) => a[0] - b[0])) {
      const x = sx(v);
      svg.append(svgEl("line", { x1: x, y1: BASE - 4, x2: x, y2: BASE + 4, stroke: "var(--ink-dim)" }));
      if (x - last >= 28) { svg.append(svgEl("text", { x, y: BASE + 17, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, label)); last = x; }
    }
    svg.append(svgEl("text", { x: (X0 + X1) / 2, y: 140, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-dim)" }, `link from ${f(S)} to ${f(S + total)} ${uName}: bandwidth ${withUnit(total, FREQ_UNITS)}`));
    steps.innerHTML = `B<sub>link</sub> = n × B + (n − 1) × G = ${n} × ${f(B)} ${uName} + ${n - 1} × ${f(G)} ${uName} = <b>${withUnit(total, FREQ_UNITS)}</b>`;
    const rows = [
      ["Link bandwidth", withUnit(total, FREQ_UNITS), `from ${f(S)} to ${f(S + total)} ${uName}`],
      ["Guard bands", String(n - 1), G > 0 ? `n − 1 of them, each ${f(G)} ${uName}` : "n − 1 of them, each 0 wide: the channels touch"],
    ];
    bands.forEach(([lo, hi], k) => rows.push([`Channel ${k + 1}`, `${f(lo)}–${f(hi)} ${uName}`, `0–${f(B)} ${uName} shifted up by ${f(lo)} ${uName}`]));
    grid(out, rows);
    note.textContent = "Each source modulates its own carrier, so its 0 to B band is shifted onto its channel; the receiver's bandpass filter picks that band out and shifts it back. Guard bands are strips of unused bandwidth that separate the channels, to prevent overlapping and interference: n channels need n − 1 of them.";
  }
  Bf.on(draw); Gf.on(draw); Sf.on(draw);
  draw();
}

// ---------- widget: tdm-frames ----------
const SLOT_SIZES = [1, 2, 4, 8];
const TDM_PRESETS = {
  "Slide figure (lines A, B, C)": { n: 3, rate: 0, unit: "kbps", slot: 1, streams: ["A1 A2 A3", "B1 B2 B3", "C1 C2 C3"], framing: false },
  "1 Mbps × 4 (slide 35)": { n: 4, rate: 1, unit: "Mbps", slot: 1, streams: ["11111", "00000", "10101", "00100"], framing: false },
  "Example 2 (four 100 kbps channels, 2-bit slots)": { n: 4, rate: 100, unit: "kbps", slot: 2, streams: ["10110100", "01011001", "11100011", "00101110"], framing: false },
};
function genStream(k, bits) { let x = 7 + 13 * k, s = ""; for (let i = 0; i < bits; i++) { x = (x * 31 + 11) % 97; s += x % 2; } return s; }
const isBits = (s) => /^[01\s]+$/.test(s) && /[01]/.test(s);
/** The units of one input line: bits grouped by the unit size, or whitespace-separated labels such as A1 A2 A3. */
function unitsOf(stream, slot) {
  const s = String(stream ?? "").trim();
  if (!s) return [];
  if (isBits(s)) { const b = s.replace(/\s/g, ""), u = []; for (let i = 0; i + slot <= b.length; i += slot) u.push(b.slice(i, i + slot)); return u; }
  return s.split(/\s+/);
}
function tdmFrames(box, cfg) {
  const presets = presetsOf(cfg, TDM_PRESETS), names = Object.keys(presets);
  let n = 4, slot = 1, streams = [], silent = [], framing = false, step = 0;
  box.append(el("h4", null, cfg.title || "Synchronous TDM: units, slots and frames"));
  box.append(btnRow(names, (i) => apply(presets[names[i]]), -1));
  const sN = slider("Input lines n", 2, 6, 1, n, (v) => setN(v), (v) => String(v));
  const Rf = unitField("input rate", RATE_UNITS, 1, "Mbps");
  const slotRow = el("div", "unit-row");
  const slotBtns = btnRow(SLOT_SIZES.map((s) => `${s} bit${s > 1 ? "s" : ""}`), (i) => { slot = SLOT_SIZES[i]; step = 0; draw(); }, 0);
  slotBtns.style.marginBottom = "0";
  slotRow.append(el("label", null, "unit size"), slotBtns);
  const fr = checkbox("framing bits (pattern 1 0 1 …)", false, (v) => { framing = v; draw(); });
  const lines = el("div", "net5-lines");
  const ctl = el("div", "viz-btn-row");
  const prev = el("button", "viz-btn", "◀ prev"), next = el("button", "viz-btn", "next ▶"), reset = el("button", "viz-btn", "reset");
  const counter = el("span", "encap-pduname");
  ctl.append(prev, next, reset, counter);
  const svg = svgEl("svg", { viewBox: "0 0 720 200", class: "curve-svg net-svg" });
  const caption = el("div", "encap-caption");
  const list = el("div", "sorted-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sN.row, Rf.row, slotRow, fr.row, lines, svg, ctl, caption, list, out, note);

  function buildLines() {
    lines.innerHTML = "";
    streams.forEach((s, k) => {
      const row = el("div", "unit-row");
      const input = document.createElement("input");
      input.type = "text"; input.value = s; input.spellcheck = false; input.style.width = "150px";
      input.setAttribute("aria-label", `line ${k + 1} units`);
      input.addEventListener("input", () => { streams[k] = input.value; step = 0; draw(); });
      const sw = checkbox("silent", silent[k], (v) => { silent[k] = v; draw(); });
      row.append(el("label", null, `line ${k + 1}`), input, sw.row);
      lines.append(row);
    });
  }
  function setN(v) {
    n = clamp(Math.round(v), 2, 6);
    while (streams.length < n) { streams.push(genStream(streams.length, 8)); silent.push(false); }
    streams.length = n; silent.length = n;
    step = 0; buildLines(); draw();
  }
  function apply(p) {
    p = p || {};
    const given = Array.isArray(p.streams) ? p.streams.map(String) : [];
    n = clamp(Math.round(+p.n || given.length || 4), 2, 6);
    slot = SLOT_SIZES.includes(+p.slot) ? +p.slot : 1;
    streams = given.slice(0, n);
    silent = (Array.isArray(p.silent) ? p.silent : []).slice(0, n).map(Boolean);
    while (silent.length < streams.length) silent.push(false);
    framing = !!p.framing;
    sN.set(n); Rf.setRaw(p.rate ?? 1, p.unit || "Mbps"); fr.input.checked = framing;
    slotBtns.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", SLOT_SIZES[i] === slot));
    setN(n);
  }
  function draw() {
    svg.innerHTML = "";
    const rate = Rf.get();
    const units = streams.map((s) => unitsOf(s, slot));
    const bits = streams.every((s) => isBits(String(s)));
    const chars = Math.max(1, ...units.flat().map((u) => u.length));
    const slots = n + (framing ? 1 : 0);
    let K = Math.min(5, ...units.map((u) => u.length));
    if (!(K > 0)) {
      caption.textContent = "Give every line at least one unit: 0s and 1s (grouped by the unit size) or labels such as A1 A2 A3.";
      list.innerHTML = ""; out.innerHTML = ""; counter.textContent = ""; return;
    }
    K = Math.max(1, Math.min(K, Math.floor(332 / (slots * chars * 7 + 12))));
    step = clamp(step, 0, K - 1);
    const H = Math.max(176, 60 + n * 34 + 30);
    svg.setAttribute("viewBox", `0 0 720 ${H}`);
    const yOf = (k) => 44 + k * 34;
    const uw = Math.min(40, Math.max(18, 220 / K));
    units.forEach((u, k) => {
      const y = yOf(k);
      svg.append(svgEl("text", { x: 62, y: y + 4, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, rate > 0 ? withUnit(rate, RATE_UNITS, 3) : `line ${k + 1}`));
      svg.append(svgEl("line", { x1: 68, y1: y + 13, x2: 306, y2: y + 13, stroke: "var(--rule-strong)" }));
      svg.append(svgEl("text", { x: 300 - K * uw - 14, y: y + 4, "font-size": 11, fill: "var(--ink-dim)" }, "…"));
      for (let j = 0; j < K; j++) {
        const x = 300 - (j + 1) * uw, cur = j === step, done = j < step;
        svg.append(svgEl("rect", { x: x + 1, y: y - 10, width: uw - 2, height: 22, rx: 3, fill: silent[k] ? "none" : LINE_FILL[k % LINE_FILL.length], opacity: silent[k] ? 1 : cur ? 0.65 : done ? 0.18 : 0.4, stroke: cur ? "var(--hl)" : silent[k] ? "var(--rule-strong)" : "none", "stroke-dasharray": silent[k] ? "3 3" : "none", "stroke-width": cur ? 2 : 1 }));
        if (!silent[k]) svg.append(svgEl("text", { x: x + uw / 2, y: y + 5, "text-anchor": "middle", "font-size": chars > 2 ? 9 : 11, fill: "var(--ink)", opacity: done ? 0.55 : 1 }, u[j]));
      }
    });
    svg.append(svgEl("text", { x: 70, y: H - 8, "font-size": 10.5, fill: "var(--ink-dim)" }, "one unit from each line every T s; the first unit is nearest the MUX"));
    const mid = (yOf(0) + yOf(n - 1)) / 2 + 2;
    svg.append(svgEl("polygon", { points: `310,${yOf(0) - 20} 310,${yOf(n - 1) + 26} 374,${mid}`, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: 328, y: mid + 4, "font-size": 11, fill: "var(--ink)", "font-weight": "600" }, "MUX"));
    const yo = mid, gap = 6, fw = (332 - (K - 1) * gap) / K, sw = fw / slots;
    const frames = [];
    for (let j = 0; j < K; j++) {
      const x = 712 - (j + 1) * fw - j * gap, built = j <= step, cur = j === step;
      const g = svgEl("g", { opacity: built ? 1 : 0.3 });
      const parts = [];
      let sx = x;
      if (framing) {
        const b = j % 2 === 0 ? "1" : "0";
        g.append(svgEl("rect", { x: sx, y: yo - 14, width: sw, height: 24, fill: "var(--hl)", opacity: 0.75 }));
        g.append(svgEl("text", { x: sx + sw / 2, y: yo + 4, "text-anchor": "middle", "font-size": sw > 14 ? 11 : 9, fill: "#101418", "font-weight": "700" }, b));
        parts.push(b); sx += sw;
      }
      for (let k = n - 1; k >= 0; k--) {
        const empty = silent[k];
        g.append(svgEl("rect", { x: sx, y: yo - 14, width: sw, height: 24, fill: empty ? "none" : LINE_FILL[k % LINE_FILL.length], opacity: empty ? 1 : 0.45, stroke: "var(--rule-strong)", "stroke-width": 0.6 }));
        if (!empty) g.append(svgEl("text", { x: sx + sw / 2, y: yo + 4, "text-anchor": "middle", "font-size": sw >= 22 ? 11 : sw >= 14 ? 9.5 : 8, fill: "var(--ink)" }, units[k][j]));
        parts.push(empty ? "–" : units[k][j]); sx += sw;
      }
      g.append(svgEl("rect", { x, y: yo - 14, width: fw, height: 24, fill: "none", stroke: cur ? "var(--hl)" : "var(--ink-dim)", "stroke-width": cur ? 2 : 1 }));
      g.append(svgEl("text", { x: x + fw / 2, y: yo + 24, "text-anchor": "middle", "font-size": 10.5, fill: cur ? "var(--hl)" : "var(--ink-dim)" }, `Frame ${j + 1}`));
      svg.append(g);
      frames.push(parts.join(bits && chars === 1 ? "" : " "));
    }
    const arrow = arrowMarker(svg, "var(--ink-dim)");
    svg.append(svgEl("line", { x1: 376, y1: yo + 36, x2: 714, y2: yo + 36, stroke: "var(--ink-dim)", "marker-end": arrow }));
    svg.append(svgEl("text", { x: 380, y: yo - 22, "font-size": 10.5, fill: "var(--ink-dim)" }, "…"));
    svg.append(svgEl("text", { x: 400, y: yo - 22, "font-size": 10.5, fill: "var(--ink-dim)" }, `${slots} slots per frame: ${framing ? "framing bit, " : ""}line ${n} … line 1`));
    counter.textContent = `frame ${step + 1} of ${K} shown`;
    prev.disabled = step === 0; next.disabled = step === K - 1;
    caption.innerHTML = `Frame ${step + 1} = [${frames[step]}]: unit ${step + 1} of every line${framing ? `, after the framing bit ${step % 2 === 0 ? 1 : 0}` : ""}, written line ${n} to line 1 from left to right as on the slide. The frame lasts T, ${framing ? `and with the framing bit each slot is a little shorter than T/${n}` : `each slot T/${n}`}.`;
    list.innerHTML = "";
    list.append(el("span", "stat-label", "frames"));
    frames.forEach((f, j) => { const s = el("span", "sorted-val" + (j === step ? " mid" : ""), f); if (j > step) s.style.opacity = "0.5"; list.append(s); });
    list.append(el("span", "stat-label", "…"));
    const unitWord = bits ? `${slot} bit${slot > 1 ? "s" : ""}` : "1 unit";
    if (rate > 0) {
      // The framing bit is part of the frame: the link carries frame rate × bits per frame (E06 exercise 2).
      const T = slot / rate, frameRate = rate / slot, perFrame = n * slot + (framing ? 1 : 0), linkRate = frameRate * perFrame, bitDur = 1 / linkRate;
      const tu = bestUnit(T, TIME_UNITS), dur = (v) => `${num(v / tu[1], 4)} ${tu[0]}`; // every duration in T's unit, as on the slides (0.25 μs, not 250 ns)
      grid(out, [
        ["Input unit duration T", dur(T), `${unitWord} ÷ ${withUnit(rate, RATE_UNITS, 3)}`],
        framing
          ? ["Slot duration", dur(slot * bitDur), `${slot} × bit duration on the link, a little shorter than T/${n} = ${dur(T / n)}`]
          : ["Slot duration T/n", dur(T / n), `T ÷ ${n}`],
        ...(framing ? [["Framing-bit duration", dur(bitDur), "1 bit on the link, at the beginning of each frame"]] : []),
        ["Frame rate", `${num(frameRate, 0)} frames/s`, slot === 1 ? "= input unit rate = the input bit rate" : `= input unit rate = ${withUnit(rate, RATE_UNITS, 3)} ÷ ${slot}`],
        ["Frame duration", dur(T), "= T, the input unit duration (1 ÷ frame rate)"],
        framing
          ? ["Link bit rate", withUnit(linkRate, RATE_UNITS, 3), `frame rate × bits per frame = ${num(frameRate, 0)} × ${perFrame} = ${num(linkRate, 0)} bps`]
          : ["Link bit rate", withUnit(linkRate, RATE_UNITS, 3), `n × input rate = ${n} × ${withUnit(rate, RATE_UNITS, 3)}`],
        ["Bit duration on the link", dur(bitDur), "1 ÷ link bit rate"],
        ["Bits per frame", String(perFrame), framing ? `${n} × ${slot} + 1 framing bit` : `n × unit size = ${n} × ${slot}`],
      ]);
    } else {
      grid(out, [
        ["Input unit duration", "T", "data are taken from each line every T s"],
        ["Slot duration", `T/${n}`, `n times shorter than the input unit, n = ${n}`],
        ["Frame duration", "T", "the same as the duration of an input unit"],
        ["Frame rate", "= any input rate", "one frame for every input unit"],
        ["Link data rate", `${n} × input rate`, "n times faster, to guarantee the flow of data"],
        ["Slots per frame", String(slots), framing ? `${n} data slots + 1 framing bit` : "one for each input line"],
      ]);
    }
    note.textContent = (framing
      ? "Framing bits: one synchronization bit at the beginning of each frame, following the pattern 1 0 1 … frame to frame, so the demultiplexer can separate the time slots. The framing bit is part of the frame, so the link carries frame rate × bits per frame (E06 exercise 2: 250 × 33 = 8250 bps). "
      : "") + (silent.some(Boolean)
      ? "A silent line leaves its slot empty in every frame: synchronous TDM is not efficient, which statistical TDM fixes by removing the empty slots. "
      : "") + "Each input unit becomes one output slot; the duration of an output slot is n times shorter than the input unit, and the frame rate is always the same as any input rate.";
  }
  prev.addEventListener("click", () => { step = Math.max(0, step - 1); draw(); });
  next.addEventListener("click", () => { step += 1; draw(); });
  reset.addEventListener("click", () => { step = 0; draw(); });
  Rf.on(draw);
  // A cfg that sets a unit size but no streams gets generated streams long enough for that unit
  // (the default preset's 5-bit streams hold no 8-bit unit).
  const base = { ...TDM_PRESETS["1 Mbps × 4 (slide 35)"] };
  if (!Array.isArray(cfg.streams) && SLOT_SIZES.includes(+cfg.slot) && +cfg.slot > 1) {
    base.streams = Array.from({ length: clamp(Math.round(+cfg.n || 4), 2, 6) }, (_, k) => genStream(k, 4 * cfg.slot));
  }
  apply({ ...base, ...cfg });
}

// ---------- widget: tdm-play ----------
// The multiplexer building each frame. One playback step = one frame: a round of units is taken from the
// lines in turn, the frame travels down the link, and the demultiplexer hands each slot back to its line.
const TDM_PLAY_PRESETS = {
  "Slide figure (lines A, B, C)": TDM_PRESETS["Slide figure (lines A, B, C)"],
  "1 Mbps × 4 (slide 35)": TDM_PRESETS["1 Mbps × 4 (slide 35)"],
  "Empty slots and framing bits (slide 45)": { n: 3, rate: 0, unit: "kbps", slot: 1, streams: ["A1 A2 A3", "_ B2 B3", "C1 _ C3"], framing: true },
};
// The three data-rate fixes of slides 40-44 as frame sequences. Units are labels; the rates are per slot.
const TDM_RATE_PRESETS = {
  "Multilevel multiplexing (slide 40)": { n: 4, rate: 40, unit: "kbps", slot: 1, streams: ["A1 B1 A2 B2", "C1 C2 C3 C4", "D1 D2 D3 D4", "E1 E2 E3 E4"], framing: false,
    note: "Multilevel multiplexing: lines A and B (20 kbps each) first go through a small MUX, so line 1 is their 40 kbps output, A1 B1 A2 B2. The main MUX then sees four 40 kbps lines: 4 × 40 = 160 kbps." },
  "Multiple-slot allocation (slide 42)": { n: 5, rate: 25, unit: "kbps", slot: 1, streams: ["A1 A3 A5", "A2 A4 A6", "B1 B2 B3", "C1 C2 C3", "D1 D2 D3"], framing: false,
    note: "Multiple-slot allocation: the 50 kbps line A goes through a DEMUX into two 25 kbps lines (lines 1 and 2), so line A has two slots in each frame: 5 slots × 25 kbps = 125 kbps." },
  "Pulse stuffing (slide 44)": { n: 3, rate: 50, unit: "kbps", slot: 1, streams: ["A1 A2 A3", "B1 B2 B3", "C1 dummy C2"], framing: false,
    note: "Pulse stuffing: line 3 carries 46 kbps of data, padded with dummy bits up to the dominant rate of 50 kbps; the dummy unit fills its slot like data. 3 × 50 = 150 kbps." },
};
const isGap = (u) => /^[-_–—]+$/.test(u);
const lerp = (a, b, t) => a + (b - a) * t;
const easeIO = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
function tdmPlay(box, cfg) {
  // `presets` may be an object of presets, or a list of built-in names (the three above plus the rate fixes).
  const known = { ...TDM_PLAY_PRESETS, ...TDM_RATE_PRESETS };
  const picked = Array.isArray(cfg.presets) ? Object.fromEntries(cfg.presets.filter((k) => known[k]).map((k) => [k, known[k]])) : null;
  const presets = picked && Object.keys(picked).length ? picked : { ...presetsOf(cfg, TDM_PLAY_PRESETS) };
  if (typeof cfg.preset === "string" && !presets[cfg.preset] && known[cfg.preset] && !Array.isArray(cfg.streams)) presets[cfg.preset] = known[cfg.preset];
  const names = Object.keys(presets);
  const QL = 24, QR = 160, X0 = 222, X1 = 418, OL = 480, PA = 0.5, PB = 0.72; // a step: mux round to PA, travel to PB, demux to 1
  let n = 3, slot = 1, rate = 0, units = [], silent = [], framing = false, bits = false, chars = 1, K = 1, uw = 26, pnote = "";
  // Predict mode: `answered` frames may be played; the next one waits for the student's answer.
  let predict = !!cfg.predict, answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false, pb = null;

  box.append(el("h4", null, cfg.title || "The multiplexer building each frame"));
  const fromCfg = Array.isArray(cfg.streams);
  const startName = !fromCfg && names.includes(cfg.preset) ? cfg.preset : names[0];
  if (names.length > 1) box.append(btnRow(names, (i) => { load(presets[names[i]]); restart(); }, fromCfg ? -1 : names.indexOf(startName)));
  const fr = checkbox("framing bits (pattern 1 0 1 …)", false, (v) => { framing = v; restart(); });
  const predictLabel = el("label", "playback-check");
  const predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = predict;
  predictLabel.append(predictBox, " Predict each frame before it is built");
  const svg = svgEl("svg", { viewBox: "0 0 640 150", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  // The framing-bit toggle is offered only where framing is part of the lesson: a preset or the cfg uses it.
  if (cfg.framing != null || names.some((k) => presets[k] && presets[k].framing)) box.append(fr.row);
  box.append(predictLabel, svg, caption, ask);

  function load(p) {
    p = p || {};
    const given = Array.isArray(p.streams) ? p.streams.map(String) : [];
    n = clamp(Math.round(+p.n || given.length || 3), 2, 6);
    slot = SLOT_SIZES.includes(+p.slot) ? +p.slot : 1;
    const streams = given.slice(0, n);
    while (streams.length < n) streams.push(genStream(streams.length, 8));
    const u = RATE_UNITS.find(([name]) => name === p.unit) || RATE_UNITS[2];
    rate = +p.rate > 0 ? +p.rate * u[1] : 0;
    silent = streams.map((_, k) => !!(Array.isArray(p.silent) && p.silent[k]));
    framing = !!p.framing; fr.input.checked = framing;
    pnote = typeof p.note === "string" ? p.note : "";
    bits = streams.every(isBits);
    units = streams.map((s) => unitsOf(s, slot));
    chars = Math.max(1, ...units.flat().map((x) => x.length));
    uw = Math.max(24, Math.round(chars * 6.4 + 8));
    K = Math.max(1, Math.min(5, Math.floor((QR - QL) / uw), ...units.map((x) => x.length)));
  }
  const unitOf = (k, j) => (silent[k] || units[k][j] == null || isGap(units[k][j]) ? null : units[k][j]); // null: nothing to send
  const anyEmpty = () => units.some((_, k) => { for (let j = 0; j < K; j++) if (unitOf(k, j) == null) return true; return false; });
  const fbit = (j) => (j % 2 === 0 ? "1" : "0");
  /** A frame as text, line n … line 1 from left to right as on the slide. `pick(k)` overrides the slot of line k. */
  function frameText(j, pick, order) {
    let parts = [];
    for (let k = n - 1; k >= 0; k--) parts.push(pick ? pick(k) : unitOf(k, j));
    if (order === "reverse") parts.reverse();
    if (order === "squeeze") parts = parts.filter((x) => x != null);
    return (framing ? `${fbit(j)} | ` : "") + parts.map((x) => (x == null ? "_" : x)).join(bits && chars === 1 ? "" : " ");
  }
  function times() {
    const T = rate > 0 ? (bits ? slot : 1) / rate : 0, tu = bestUnit(T, TIME_UNITS), dur = (v) => `${num(v / tu[1], 4)} ${tu[0]}`;
    // With a framing bit the frame still lasts T but holds n × unit + 1 bits, so each slot is a little shorter than T/n.
    const perFrame = n * (bits ? slot : 1) + 1, slotT = framing && T ? (T * (bits ? slot : 1)) / perFrame : T / n;
    const slotStr = !T ? `T/${n}` : framing ? `${dur(slotT)}, a little shorter than T/${n}` : `T/${n} = ${dur(T / n)}`;
    return { T, dur, Tstr: T ? `T = ${dur(T)}` : "T", slotStr, word: bits ? (slot === 1 ? "bit" : `${slot}-bit unit`) : "unit" };
  }
  /** The link bit rate: n × input rate, or frame rate × bits per frame once the framing bit is counted. */
  function linkStr(rateStr) {
    if (!framing) return `${n} × ${rateStr} = ${withUnit(n * rate, RATE_UNITS, 3)}`;
    const fr = rate / (bits ? slot : 1), per = n * (bits ? slot : 1) + 1;
    return `${num(fr, 0)} frames/s × ${per} bits = ${withUnit(fr * per, RATE_UNITS, 3)}`;
  }
  /** The question asked before frame j: its contents, or (frames 2 and 4) the slot or frame duration. */
  function question(j) {
    const tm = times();
    let kind = framing ? "contents" : j % 4 === 1 ? "slot" : j % 4 === 3 ? "frame" : "contents";
    let opts = [], text = "";
    if (kind === "contents") {
      const right = frameText(j), seen = new Set([right]);
      opts.push({ label: right, ok: true });
      const add = (label, why) => { if (!seen.has(label) && opts.length < 4) { seen.add(label); opts.push({ label, why }); } };
      add(frameText(j, null, "reverse"), `Line 1's unit is sent first, so it is drawn at the right end: the frame reads line ${n} … line 1 from left to right.`);
      const gaps = []; for (let k = 0; k < n; k++) if (unitOf(k, j) == null) gaps.push(k);
      if (gaps.length) {
        add(frameText(j, null, "squeeze"), "If a source does not have data to send, the corresponding slot in the output frame is empty. The slot is still there.");
        add(frameText(j, (k) => { for (let d = 0; d < K; d++) for (const i of [j + d, j - d]) if (i >= 0 && i < K && unitOf(k, i) != null) return unitOf(k, i); return null; }),
          "If a source does not have data to send, the corresponding slot in the output frame is empty. Its other units wait for their own frames.");
      } else if (anyEmpty()) {
        const g = units.findIndex((_, k) => { for (let i = 0; i < K; i++) if (unitOf(k, i) == null) return true; return false; });
        add(frameText(j, (k) => (k === g ? null : unitOf(k, j))), `A slot is empty only when its source has no data to send. Line ${g + 1} has a unit for this frame.`);
      }
      for (const d of [1, -1, 2, -2]) if (j + d >= 0 && j + d < K) add(frameText(j, (k) => unitOf(k, j + d)), `Frame ${j + 1} carries unit ${j + 1} of every line: a round of data units from each input connection is collected into a frame.`);
      if (opts.length < 2) { kind = "slot"; opts = []; }
      else text = `Frame ${j + 1} is next. What will it contain, read left to right as it is drawn on the link?`;
    }
    if (kind !== "contents") {
      const rule = "If the duration of the input unit is T, the duration of each slot is T/n and the duration of each frame is T.";
      const lab = tm.T ? [tm.dur(tm.T / n), tm.dur(tm.T), tm.dur(tm.T * n)] : [`T/${n}`, "T", `${n}T`];
      const right = kind === "slot" ? 0 : 1;
      opts = lab.map((label, i) => ({ label, ok: i === right, why: rule }));
      text = `Each of the ${n} lines sends one ${tm.word} every ${tm.Tstr}. How long does ${kind === "slot" ? "one slot" : `frame ${j + 1}`} last on the link?`;
    }
    const r = (j * 3 + 2) % opts.length;
    return { text, opts: opts.slice(r).concat(opts.slice(0, r)) };
  }
  const asking = (pos) => predict && answered < K && Math.abs(pos - answered) < 1e-6;
  function answer(o, e) {
    asked += wrong == null && !missed ? 1 : 0;
    if (!o.ok) { missed = true; wrong = o; refocus = e.detail === 0; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; refocus = e.detail === 0; answered++;
    pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${answered}|${wrong ? wrong.label : ""}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!key) return;
    const btns = question(answered).opts.map((o) => {
      const bad = wrong && o.label === wrong.label;
      const b = el("button", "viz-btn" + (bad ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => answer(o, e));
      ask.append(b);
      return b;
    });
    if (wrong) ask.append(el("span", "playback-feedback", `Not ${wrong.label}. ${wrong.why}`));
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function unitBox(x, y, w, k, label, o = {}) {
    const empty = label == null;
    svg.append(svgEl("rect", { x: x + 1, y: y - 11, width: Math.max(2, w - 2), height: 22, rx: 3, fill: empty ? "none" : LINE_FILL[k % LINE_FILL.length], "fill-opacity": 0.45,
      stroke: o.hot ? "var(--hl)" : empty ? "var(--rule-strong)" : "none", "stroke-width": o.hot ? 2 : 1, "stroke-dasharray": empty ? "3 3" : "none" }));
    if (!empty) svg.append(svgEl("text", { x: x + w / 2, y: y + 4, "text-anchor": "middle", "font-size": o.fs || (chars > 2 ? 9.5 : 11), fill: "var(--ink)" }, label));
  }
  function frame(pos) {
    const tm = times(), q = asking(pos), started = pos > 1e-9;
    const j = clamp(Math.ceil(pos - 1e-9) - 1, 0, K - 1), f = started ? clamp(pos - j, 0, 1) : 0; // the frame in progress, and how far
    const off = framing ? 1 : 0, slots = n + off;
    const sw = Math.min(uw, Math.floor(150 / slots)), fw = sw * slots, fs = clamp(sw / (chars * 0.62), 6, 11);
    const yOf = (k) => 56 + k * 30, mid = (yOf(0) + yOf(n - 1)) / 2, H = Math.max(yOf(n - 1) + 28, mid + 50);
    const a = (f / PA) * slots, c = ((f - PB) / (1 - PB)) * n; // turns taken by the multiplexer and by the demultiplexer
    const fx = lerp(X0, X1 - fw, easeIO((f - PA) / (PB - PA))), shift = easeIO((f - PA) / (1 - PA));
    const slotX = (k) => fx + (off + n - 1 - k) * sw;
    const moving = [];
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${H}`);
    const dim = { "font-size": 10.5, fill: "var(--ink-dim)" };
    const rateStr = rate > 0 ? withUnit(rate, RATE_UNITS, 3) : "";
    svg.append(svgEl("text", { x: 8, y: 14, ...dim }, `${n} input lines${rateStr ? `, ${rateStr} each` : ""}`));
    svg.append(svgEl("text", { x: 8, y: 28, ...dim }, `one ${tm.word} every ${tm.Tstr}`));
    svg.append(svgEl("text", { x: 320, y: 14, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", "font-weight": "600" }, rateStr ? `link: ${linkStr(rateStr)}` : `link: ${n} times the data rate of one line`));
    svg.append(svgEl("text", { x: 632, y: 14, "text-anchor": "end", ...dim }, `${n} output lines`));
    svg.append(svgEl("text", { x: 632, y: 28, "text-anchor": "end", ...dim }, `one ${tm.word} every ${tm.Tstr}`));
    svg.append(svgEl("line", { x1: 214, y1: mid, x2: 426, y2: mid, stroke: "var(--rule-strong)", "stroke-width": 2 }));
    svg.append(svgEl("polygon", { points: `166,${yOf(0) - 18} 166,${yOf(n - 1) + 18} 214,${mid + 13} 214,${mid - 13}`, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("polygon", { points: `426,${mid - 13} 426,${mid + 13} 474,${yOf(n - 1) + 18} 474,${yOf(0) - 18}`, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: 188, y: mid + 4, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", "font-weight": "600" }, "MUX"));
    svg.append(svgEl("text", { x: 453, y: mid + 4, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink)", "font-weight": "600" }, "DEMUX"));
    svg.append(svgEl("text", { x: 320, y: mid - 25, "text-anchor": "middle", ...dim }, `a slot lasts ${tm.slotStr}`));
    svg.append(svgEl("text", { x: 320, y: mid + 43, "text-anchor": "middle", ...dim }, `a frame lasts ${tm.Tstr}`));
    for (let k = 0; k < n; k++) {
      const y = yOf(k), ox = OL + (K - 1 - j) * uw;
      svg.append(svgEl("text", { x: 12, y: y + 4, "text-anchor": "middle", ...dim }, String(k + 1)));
      svg.append(svgEl("text", { x: 628, y: y + 4, "text-anchor": "middle", ...dim }, String(k + 1)));
      svg.append(svgEl("line", { x1: QL - 4, y1: y + 14, x2: 166, y2: y + 14, stroke: "var(--rule-strong)" }));
      svg.append(svgEl("line", { x1: 474, y1: y + 14, x2: OL + K * uw + 4, y2: y + 14, stroke: "var(--rule-strong)" }));
      // Input queue: the unit nearest the MUX leaves first; the rest move up one place while the frame is on the link.
      for (let i = j; i < K; i++) {
        const lab = unitOf(k, i);
        if (i === j && started) {
          const t = a - (off + k);
          if (t >= 1) continue;
          if (t > 0 && lab != null) {
            const e = easeIO(t), p = e < 0.5 ? e * 2 : e * 2 - 1;
            moving.push(e < 0.5 ? [lerp(QR - uw, 198, p), lerp(y, mid, p), lerp(uw, sw, p), k, lab] : [lerp(198, slotX(k), p), mid, sw, k, lab]);
          } else unitBox(QR - uw, y, uw, k, lab, { hot: t > 0 });
          continue;
        }
        unitBox(QR - (i - j - (started ? shift : 0) + 1) * uw, y, uw, k, lab, { hot: q && i === answered });
      }
      // Output line: units already delivered, first one furthest right.
      for (let i = 0; i < j; i++) unitBox(OL + (K - 1 - i) * uw, y, uw, k, unitOf(k, i));
      const lab = unitOf(k, j), t = c - k;
      if (started && t >= 1) unitBox(ox, y, uw, k, lab);
      else if (started && t > 0 && lab != null) {
        const e = easeIO(t), p = e < 0.5 ? e * 2 : e * 2 - 1;
        moving.push(e < 0.5 ? [lerp(slotX(k), 432, p), mid, sw, k, lab] : [lerp(432, ox, p), lerp(mid, y, p), lerp(sw, uw, p), k, lab]);
      } else if (started && t > 0.5) unitBox(ox, y, uw, k, null, { hot: true });
    }
    // The frame on the link: slots fill during the multiplexer's round and empty during the demultiplexer's.
    if (started && f < 1 - 1e-9) {
      if (off) {
        const g = svgEl("g", { opacity: clamp(a * 2, 0, 1) });
        g.append(svgEl("rect", { x: fx, y: mid - 12, width: sw, height: 24, fill: "var(--hl)", opacity: 0.75 }));
        g.append(svgEl("text", { x: fx + sw / 2, y: mid + 4, "text-anchor": "middle", "font-size": 11, fill: "#101418", "font-weight": "700" }, fbit(j)));
        svg.append(g);
      }
      for (let k = 0; k < n; k++) {
        const lab = unitOf(k, j), tA = a - (off + k), tC = c - k, turn = (tA > 0 && tA < 1) || (tC > 0 && tC < 1);
        svg.append(svgEl("rect", { x: slotX(k), y: mid - 12, width: sw, height: 24, fill: "none", stroke: "var(--rule-strong)", "stroke-width": 0.6 }));
        if (lab == null) { if (turn || (tA >= 1 && tC <= 0)) unitBox(slotX(k), mid, sw, k, null, { hot: turn }); }
        else if (tA >= 1 && tC <= 0) unitBox(slotX(k), mid, sw, k, lab, { fs });
      }
      svg.append(svgEl("rect", { x: fx, y: mid - 13, width: fw, height: 26, fill: "none", stroke: "var(--hl)", "stroke-width": 2 }));
      svg.append(svgEl("path", { d: `M${fx + fw - sw + 1},${mid - 16} v-4 h${sw - 2} v4`, fill: "none", stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: fx + fw / 2, y: mid + 27, "text-anchor": "middle", "font-size": 10.5, fill: "var(--hl)", "font-weight": "600" }, `Frame ${j + 1}`));
    }
    for (const [x, y, w, k, lab] of moving) unitBox(x, y, w, k, lab, { hot: true, fs: Math.min(11, clamp(w / (chars * 0.62), 6, 11)) });

    let text;
    if (q) text = question(answered).text;
    else if (!started) text = `Press Play: each step builds one frame, sends it and delivers it. Data are taken from each line every ${tm.Tstr}.`;
    else {
      const gaps = []; for (let k = 0; k < n; k++) if (unitOf(k, j) == null) gaps.push(k + 1);
      const gapText = gaps.length ? ` Line ${gaps.join(" and line ")} has no data to send, so the corresponding slot in the frame is empty.` : "";
      if (f < PA) {
        const got = []; for (let k = 0; k < n; k++) if (unitOf(k, j) != null) got.push(unitOf(k, j));
        text = `Frame ${j + 1}: a round of data units, one from each line in turn (${got.join(", ")}), is collected into a frame of ${n} time slots. Each slot lasts ${tm.slotStr}.${gapText}`
          + (framing ? ` The framing bit ${fbit(j)} is added at the beginning of the frame.` : "");
      } else if (f < PB) {
        text = `Frame ${j + 1} = [${frameText(j)}] moves down the link. The frame lasts ${tm.Tstr}, the same as one input unit, so the data rate of the link must be n = ${n} times the data rate of a connection`
          + (framing ? `, plus the framing bit${rateStr ? `: ${linkStr(rateStr)}.` : "."}` : rateStr ? `: ${linkStr(rateStr)}.` : ".");
      } else {
        text = `The demultiplexer hands each slot of frame ${j + 1} = [${frameText(j)}] back to its line, line 1 first.${gapText}`
          + (framing ? " The framing bits follow the pattern 1 0 1 … frame to frame, so the demultiplexer can separate the time slots accurately." : "");
        if (pos >= K && asked > 0) text += ` All ${K} frames are delivered: ${firstTry} of ${asked} right on the first try.`;
      }
    }
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(pos);
  }
  function restart() {
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    note.textContent = "If the duration of the input unit is T, the duration of each slot is T/n and the duration of each frame is T. The data rate of the output link must be n times the data rate of a connection to guarantee the flow of data."
      + (anyEmpty() ? " If a source does not have data to send, the corresponding slot in the output frame is empty (dashed box)." : "")
      + (framing ? " Framing bits are added to the beginning of each frame and follow the pattern 1 0 1 … frame to frame. The framing bit is part of the frame, so the link carries frame rate × bits per frame (E06 exercise 2: 250 × 33 = 8250 bps)." : "");
    if (pnote) note.textContent = pnote + " " + note.textContent;
    pb.reset(K);
  }
  load(fromCfg ? { ...cfg } : { ...presets[startName], ...cfg });
  pb = createPlayback({
    count: K, unit: "frame", onFrame: frame,
    stepMs: () => cfg.stepMs || 2600 + 500 * n,
    limit: () => (predict ? answered : K),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, note);
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    // Frames already delivered count as answered; the questions start at the next one.
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  restart();
}

// ---------- widget: rate-manager ----------
const RM_PRESETS = {
  "Multilevel multiplexing (slide 40)": "20 20 40 40 40",
  "Multiple-slot allocation (slide 42)": "50 25 25 25",
  "Pulse stuffing (slide 44)": "50 50 46",
};
const RM_NAMES = { plain: "Synchronous TDM", multilevel: "Multilevel multiplexing", multislot: "Multiple-slot allocation", pulse: "Pulse stuffing" };
function parseRates(s) { return (Array.isArray(s) ? s : String(s ?? "").split(/[\s,;]+/)).map(Number).filter((v) => v > 0 && Number.isFinite(v)).slice(0, 8); }
const isMult = (a, b) => Math.abs(a / b - Math.round(a / b)) < 1e-9;
function rmAnalyse(rates) {
  const hi = Math.max(...rates), lo = Math.min(...rates);
  const equal = rates.every((r) => r === hi);
  const counts = new Map();
  rates.forEach((r) => counts.set(r, (counts.get(r) || 0) + 1));
  const ml = !equal && rates.every((r) => isMult(hi, r)) && [...counts].every(([r, c]) => r === hi || c % Math.round(hi / r) === 0);
  const ms = !equal && rates.every((r) => isMult(r, lo));
  return { hi, lo, equal, ml, ms };
}
function rateManager(box, cfg) {
  const presets = presetsOf(cfg, RM_PRESETS), names = Object.keys(presets);
  const unit = RATE_UNITS.some(([u]) => u === cfg.unit) ? cfg.unit : "kbps";
  const initName = names.includes(cfg.preset) ? cfg.preset : null;
  let strategy = null, framing = false;
  box.append(el("h4", null, cfg.title || "Data-rate management: multilevel multiplexing, multiple-slot allocation, pulse stuffing"));
  const Rf = textField("input rates", "", unit, 200);
  box.append(btnRow(names, (i) => { Rf.set(ratesText(presets[names[i]])); strategy = null; draw(); }, initName ? names.indexOf(initName) : -1));
  const stratRow = el("div");
  const fr = checkbox("framing bit at the beginning of the frame", false, (v) => { framing = v; draw(); });
  const svg = svgEl("svg", { viewBox: "0 0 640 240", class: "curve-svg net-svg" });
  const steps = el("div", "stat-steps math-line");
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(Rf.row, stratRow, fr.row, svg, steps, out, note);
  const ratesText = (v) => (Array.isArray(v) ? v.join(" ") : String(v ?? ""));
  const R = (v) => `${num(v, 3)} ${unit}`;

  function draw() {
    svg.innerHTML = "";
    const rates = parseRates(Rf.get());
    if (rates.length < 2) { steps.textContent = "Enter at least two input rates, for example 20 20 40 40 40."; out.innerHTML = ""; stratRow.innerHTML = ""; note.textContent = ""; return; }
    const a = rmAnalyse(rates);
    const avail = a.equal ? ["plain"] : [a.ml && "multilevel", a.ms && "multislot", "pulse"].filter(Boolean);
    if (!avail.includes(strategy)) strategy = avail[0];
    stratRow.innerHTML = "";
    if (avail.length > 1) stratRow.append(btnRow(avail.map((s) => RM_NAMES[s]), (i) => { strategy = avail[i]; draw(); }, avail.indexOf(strategy)));
    // rows: the lines as drawn, top to bottom
    const order = strategy === "multilevel" ? [...rates].sort((x, y) => x - y) : strategy === "plain" ? rates : [...rates].sort((x, y) => y - x);
    const rows = [];           // { y, rate, into: rate feeding the main MUX, kind }
    const mainInputs = [];     // { y, rate, label }
    const slotsOut = [];       // frame slots { label, hot }
    const work = [];           // math lines
    let y = 34;
    const Y = () => { const v = y; y += 30; return v; };
    const line = (x1, x2, yy) => svg.append(svgEl("line", { x1, y1: yy, x2, y2: yy, stroke: "var(--ink-2)", "stroke-width": 1.6 }));
    const text = (x, yy, s, attrs = {}) => svg.append(svgEl("text", { x, y: yy, "font-size": 11.5, fill: "var(--ink)", ...attrs }, s));
    const mux = (x, yTop, yBot, w, label) => { svg.append(svgEl("polygon", { points: `${x},${yTop} ${x},${yBot} ${x + w},${(yTop + yBot) / 2}`, fill: "var(--paper-3)", stroke: "var(--rule-strong)" })); if (label) text(x + 8, (yTop + yBot) / 2 + 4, label, { "font-size": 10.5, "font-weight": "600" }); };
    let outRate = 0;
    if (strategy === "multilevel") {
      const used = new Set();
      order.forEach((r, i) => {
        if (used.has(i)) return;
        const yy = Y();
        text(62, yy + 4, R(r), { "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" });
        if (r === a.hi) { line(68, 330, yy); mainInputs.push({ y: yy, rate: r, label: R(r) }); slotsOut.push({ label: num(r, 3), hot: false }); return; }
        const g = Math.round(a.hi / r), members = [i];
        for (let j = i + 1; j < order.length && members.length < g; j++) if (!used.has(j) && order[j] === r) members.push(j);
        members.forEach((m) => used.add(m));
        line(68, 200, yy);
        const ys = [yy];
        for (let m = 1; m < g; m++) { const y2 = Y(); ys.push(y2); text(62, y2 + 4, R(r), { "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }); line(68, 200, y2); }
        const yTop = ys[0] - 10, yBot = ys[ys.length - 1] + 10, ym = (yTop + yBot) / 2;
        mux(200, yTop, yBot, 36);
        line(236, 330, ym);
        text(250, ym - 5, R(a.hi), { "font-size": 10.5, fill: "var(--hl)" });
        mainInputs.push({ y: ym, rate: a.hi });
        slotsOut.push({ label: `${ys.map(() => num(r, 3)).join("+")}`, hot: true });
        work.push(`${ys.map(() => num(r, 3)).join(" + ")} → ${R(a.hi)}`);
      });
      outRate = mainInputs.length * a.hi;
      work.push(`${mainInputs.length} × ${R(a.hi)} = <b>${R(outRate)}</b>`);
    } else if (strategy === "multislot") {
      order.forEach((r) => {
        const k = Math.round(r / a.lo);
        if (k === 1) { const yy = Y(); text(62, yy + 4, R(r), { "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }); line(68, 330, yy); mainInputs.push({ y: yy, rate: r }); slotsOut.push({ label: num(r, 3), hot: false }); return; }
        const ys = Array.from({ length: k }, () => Y());
        const yTop = ys[0] - 10, yBot = ys[k - 1] + 10, ym = (yTop + yBot) / 2;
        text(62, ym + 4, R(r), { "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" });
        line(68, 130, ym);
        svg.append(svgEl("polygon", { points: `130,${ym} 170,${yTop} 170,${yBot}`, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
        text(150, yTop - 6, "DEMUX", { "font-size": 10, "text-anchor": "middle", fill: "var(--ink-dim)" });
        ys.forEach((yy) => { line(170, 330, yy); text(184, yy - 5, R(a.lo), { "font-size": 10.5, fill: "var(--hl)" }); mainInputs.push({ y: yy, rate: a.lo }); slotsOut.push({ label: num(a.lo, 3), hot: true }); });
        work.push(`${R(r)} → ${k} × ${R(a.lo)}`);
      });
      outRate = mainInputs.length * a.lo;
      work.push(`${mainInputs.length} slots × ${R(a.lo)} = <b>${R(outRate)}</b>`);
    } else {
      order.forEach((r) => {
        const yy = Y();
        text(62, yy + 4, R(r), { "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" });
        if (strategy === "pulse" && r < a.hi) {
          line(68, 160, yy);
          svg.append(svgEl("rect", { x: 160, y: yy - 12, width: 96, height: 24, rx: 4, fill: "var(--paper-3)", stroke: "var(--blue)" }));
          text(208, yy + 4, "Pulse stuffing", { "text-anchor": "middle", "font-size": 10.5, fill: "var(--blue)" });
          line(256, 330, yy);
          text(268, yy - 5, R(a.hi), { "font-size": 10.5, fill: "var(--hl)" });
          work.push(`${R(r)} → ${R(a.hi)} (dummy bits: ${R(a.hi - r)})`);
          slotsOut.push({ label: num(a.hi, 3), hot: true });
        } else { line(68, 330, yy); slotsOut.push({ label: num(r, 3), hot: false }); }
        mainInputs.push({ y: yy, rate: a.hi });
      });
      outRate = mainInputs.length * a.hi;
      work.push(`${mainInputs.length} × ${R(a.hi)} = <b>${R(outRate)}</b>`);
    }
    const yTop = mainInputs[0].y - 16, yBot = mainInputs[mainInputs.length - 1].y + 16, ym = (yTop + yBot) / 2;
    mux(330, yTop, yBot, 70, "MUX");
    line(400, 540, ym);
    text(548, ym + 4, R(outRate), { "font-size": 12.5, "font-weight": "700", fill: "var(--hl)" });
    // one frame
    const fy = y + 14, slots = slotsOut.length + (framing ? 1 : 0), sw = Math.min(64, 500 / slots), fx = 320 - (slots * sw) / 2;
    let sx = fx;
    if (framing) { svg.append(svgEl("rect", { x: sx, y: fy, width: sw, height: 26, fill: "var(--hl)", opacity: 0.75 })); text(sx + sw / 2, fy + 17, "1", { "text-anchor": "middle", "font-size": 11, fill: "#101418", "font-weight": "700" }); sx += sw; }
    slotsOut.forEach((s) => {
      svg.append(svgEl("rect", { x: sx, y: fy, width: sw, height: 26, fill: s.hot ? "var(--blue)" : "var(--ink-dim)", opacity: s.hot ? 0.55 : 0.3, stroke: "var(--rule-strong)", "stroke-width": 0.6 }));
      text(sx + sw / 2, fy + 17, s.label, { "text-anchor": "middle", "font-size": sw > 40 ? 10.5 : 9 });
      sx += sw;
    });
    svg.append(svgEl("rect", { x: fx, y: fy, width: slots * sw, height: 26, fill: "none", stroke: "var(--ink-dim)" }));
    text(320, fy + 40, `one frame on the link: ${slots} slot${slots > 1 ? "s" : ""}${framing ? " (first the framing bit)" : ""}, ${R(outRate)}`, { "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" });
    svg.setAttribute("viewBox", `0 0 640 ${fy + 50}`);
    steps.innerHTML = work.join("<br>");
    const classify = a.equal ? ["all equal", "one slot per line, no management needed"]
      : (a.ml || a.ms) ? ["multiples", "the data rate of an input line is a multiple of the others"]
      : ["not integer multiples", "the bit rates are not integer multiples of each other"];
    const when = { plain: "the input lines all have the same rate", multilevel: "the data rate of an input line is a multiple of others: the smaller lines are multiplexed first", multislot: "an input line has multiple rates of the others: it is demultiplexed and gets more than one slot in a frame", pulse: "the rates are not integer multiples: the highest input rate becomes the dominant rate and dummy bits pad the slower lines" }[strategy];
    grid(out, [
      ["Input rates", classify[0], classify[1]],
      ["Strategy", RM_NAMES[strategy], when],
      ["Output rate", R(outRate), strategy === "multislot" ? `${slotsOut.length} slots × ${R(a.lo)}` : `${mainInputs.length} × ${R(mainInputs[0].rate)}`],
      ["Slots per frame", String(slots), strategy === "multislot" ? `the ${R(a.hi)} input has ${Math.round(a.hi / a.lo)} slots in each frame` : framing ? `${slotsOut.length} data slots + 1 framing bit` : "one slot for each MUX input"],
    ]);
    note.textContent = {
      plain: "Every line sends one unit per frame, so the output link runs n times faster than one input.",
      multilevel: "Multilevel multiplexing: the two 20 kbps lines of the slide are multiplexed into one 40 kbps line first, which then takes one slot of the main frame like the other 40 kbps lines. Lines are drawn slowest first.",
      multislot: "Multiple-slot allocation: a demultiplexer splits the faster line into lines at the base rate, so it gets more than one slot in each frame (the slide: the input with a 50 kbps data rate has two slots in each frame). Lines are drawn fastest first.",
      pulse: "Pulse stuffing, also called bit padding or bit stuffing: the highest input rate is the dominant rate and the slower lines are padded with dummy bits up to it, so every slot carries the same rate. Lines are drawn fastest first.",
    }[strategy] + (framing ? " The framing bit (pattern 1 0 1 …) lets the demultiplexer separate the slots." : "");
  }
  Rf.on(() => { strategy = null; draw(); });
  Rf.set(cfg.rates != null ? ratesText(cfg.rates) : ratesText(presets[initName || names[0]]));
  draw();
}

// ---------- widget: hop-walk ----------
const N = (s) => addr("N", s), L = (s) => addr("L", s);
const HOP_PRESETS = {
  "small internet (slides 18-21)": {
    nodes: [{ name: "Alice", kind: "host" }, { name: "R1", kind: "router" }, { name: "R2", kind: "router" }, { name: "Bob", kind: "host" }],
    nsrc: N("1"), ndst: N("8"),
    ifaces: [
      { right: [N("1"), L("1")] },
      { left: [N("2"), L("2")], right: [N("4"), L("4")], extra: { up: true, label: [N("3"), L("3")], text: "to another link" } },
      { left: [N("5"), L("5")], right: [N("7"), L("7")], extra: { up: false, label: [N("6"), L("6")], text: "to another network" } },
      { left: [N("8"), L("8")] },
    ],
    links: [
      { name: "Link 1", kind: "lan", ldst: L("2"), lsrc: L("1"), text: "On Link 1 Alice's data-link layer writes R1's address on this LAN first, L₂, then its own, L₁. The IP pair N₁ → N₈ names the two ends of the journey and is the same on every link." },
      { name: "Link 2", kind: "lan", ldst: L("5"), lsrc: L("4"), text: "R1 sends on Link 2 from its interface on that LAN, L₄, to R2's interface on it, L₅. L₂ and L₃ belong to other links and do not appear in this frame." },
      { name: "Link 3", kind: "lan", ldst: L("8"), lsrc: L("7"), text: "R2 sends to Bob: destination L₈, source L₇. Three links, three frames, three different link-layer pairs; N₁ and N₈ never changed." },
    ],
  },
  "Alice to Bob (slides 30-33)": {
    nodes: [{ name: "Alice", kind: "host" }, { name: "R1", kind: "router" }, { name: "R2", kind: "router" }, { name: "Bob", kind: "host" }],
    nsrc: N("A"), ndst: N("B"),
    ifaces: [
      { right: [N("A"), L("A")] },
      { left: [N("1"), L("1")], right: [L("2")], extra: { up: true, text: "to another link" } },
      { left: [N("3"), L("3")], right: [N("4"), L("4")], extra: { up: true, text: "to another link" } },
      { left: [N("B"), L("B")] },
    ],
    links: [
      { name: "Alice's site", kind: "lan", ldst: L("1"), lsrc: L("A"), sender: "Alice", next: "R1", hop: N("1"), hopNote: "R1's interface on Alice's LAN" },
      { name: "R1 to R2", kind: "p2p", ldst: L("3"), lsrc: L("2"), sender: "R1", next: "R2", hop: N("3"), hopNote: "R2's interface on the link to R1" },
      { name: "Bob's site", kind: "lan", ldst: L("B"), lsrc: L("4"), sender: "R2", next: "Bob", hop: N("B"), hopNote: "Bob himself: directly connected, so the next hop is the destination" },
    ],
    final: "Bob's data-link layer accepts the frame addressed to L_B, removes the header and passes the datagram [N_A | N_B | Data] up to the network layer. The source and destination network-layer addresses, N_A and N_B, have not been changed during the whole journey.",
  },
};
function hopWalk(box, cfg) {
  const names = Object.keys(HOP_PRESETS);
  const presetName = names.includes(cfg.preset) ? cfg.preset : names[0];
  const P = HOP_PRESETS[presetName];
  const drawMode = !!cfg.draw;
  const h = (a) => addrHtml(a);
  // steps
  const steps = [];
  P.links.forEach((lk, i) => {
    if (drawMode) { steps.push({ link: i, phase: "draw", text: `Fill the two link-layer addresses of the frame on ${lk.name}: destination first, then source. The IP addresses are already in place.` }); return; }
    if (lk.sender) {
      steps.push({ link: i, phase: "table", text: `${lk.sender}'s network layer has the datagram [${h(P.nsrc)} | ${h(P.ndst)} | Data]${i > 0 ? ", decapsulated from the frame that just arrived" : ""}. It consults its forwarding table: ${h(P.ndst)} → next hop ${h(lk.hop)} (${lk.hopNote}).` });
      steps.push({ link: i, phase: "arp", text: `ARP (${lk.sender}) asks for the link-layer address of ${h(lk.hop)}; ARP (${lk.next}) replies: ${h(lk.ldst)}.` });
      steps.push({ link: i, phase: "frame", text: `${lk.sender}'s data-link layer builds the frame [${h(lk.ldst)} | ${h(lk.lsrc)} | ${h(P.nsrc)} | ${h(P.ndst)} | Data]: destination ${h(lk.ldst)}, then its own address on this link, ${h(lk.lsrc)}. The physical layer sends the signal to ${lk.next}.` });
    } else steps.push({ link: i, phase: "frame", text: lk.text });
  });
  if (!drawMode && P.final) steps.push({ link: P.links.length - 1, phase: "final", text: P.final });
  // Playback: step i is on screen while pos is in (i, i + 1]; the fraction moves the frame along its link.
  let step = 0, shown = -1, pb = null;
  const guess = P.links.map(() => ({ d: "", s: "" })), checked = P.links.map(() => false);
  const solvedLink = (k) => checked[k] && normAddr(guess[k].d) === normAddr(P.links[k].ldst.key) && normAddr(guess[k].s) === normAddr(P.links[k].lsrc.key);

  box.append(el("h4", null, cfg.title || (drawMode ? "Write the link-layer addresses of each frame" : "The frame on every link: link-layer addresses change, IP addresses do not")));
  const svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" });
  const gStatic = svgEl("g"), gMove = svgEl("g", { "pointer-events": "none" }), gHit = svgEl("g");
  svg.append(gStatic, gMove, gHit);
  const detail = el("div", "net5-box");
  const frameRow = el("div", "net5-frame");
  const quizCtl = el("div", "viz-btn-row");
  const check = el("button", "viz-btn", "Check"), reveal = el("button", "viz-btn", "Reveal"), clear = el("button", "viz-btn", "Clear");
  const verdict = el("span", "encap-pduname");
  quizCtl.append(check, reveal, clear, verdict);
  const caption = el("div", "encap-caption");
  const note = el("p", "widget-note", "Order of addresses: IP addresses source–destination, link-layer addresses destination–source. The two link-layer addresses are changed every time the frame moves from one link to another; the IP pair is not.");
  box.append(svg, detail, frameRow);
  if (drawMode) box.append(quizCtl);
  box.append(caption, note);

  const NX = [66, 230, 410, 574], NY = 100;
  P.links.forEach((lk, i) => {
    const xa = NX[i] + 24, xb = NX[i + 1] - 24;
    const hit = svgEl("rect", { x: xa, y: NY - 30, width: xb - xa, height: 70, fill: "transparent", role: "button", tabindex: 0, style: "cursor:pointer", "aria-label": `show the frame on ${lk.name}` });
    // Half-way through that link's frame step: the frame is drawn in the middle of the link.
    const go = () => pb.set(steps.findIndex((s) => s.link === i && (s.phase === "frame" || s.phase === "draw")) + 0.5);
    hit.addEventListener("click", go);
    hit.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    gHit.append(hit);
  });
  function drawTopology() {
    const svg = gStatic;
    svg.innerHTML = "";
    const cur = steps[step], hot = drawMode ? null : new Set([P.links[cur.link].ldst.key, P.links[cur.link].lsrc.key]);
    P.links.forEach((lk, i) => {
      const xa = NX[i] + 24, xb = NX[i + 1] - 24, active = i === cur.link;
      if (lk.kind === "lan") {
        svg.append(svgEl("rect", { x: xa, y: NY - 13, width: xb - xa, height: 26, rx: 4, fill: "var(--paper-3)", stroke: active ? "var(--hl)" : "var(--rule)", "stroke-width": active ? 2 : 1 }));
        const mx = (xa + xb) / 2;
        svg.append(svgEl("rect", { x: mx - 13, y: NY - 7, width: 26, height: 14, rx: 2, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
        svg.append(svgEl("text", { x: mx, y: NY + 3.5, "text-anchor": "middle", "font-size": 8, fill: "var(--ink-dim)" }, "switch"));
      } else {
        svg.append(svgEl("line", { x1: xa, y1: NY, x2: xb, y2: NY, stroke: active ? "var(--hl)" : "var(--ink-2)", "stroke-width": active ? 3 : 2, "stroke-dasharray": "6 4" }));
      }
      svg.append(svgEl("text", { x: (xa + xb) / 2, y: NY + 32, "text-anchor": "middle", "font-size": 11, fill: active ? "var(--hl)" : "var(--ink-dim)", "font-weight": active ? "700" : "400" }, lk.name));
    });
    P.nodes.forEach((nd, i) => {
      const x = NX[i], f = P.ifaces[i];
      if (nd.kind === "host") {
        svg.append(svgEl("rect", { x: x - 22, y: NY - 15, width: 44, height: 30, rx: 4, fill: "var(--paper)", stroke: "var(--blue)", "stroke-width": 1.5 }));
      } else {
        svg.append(svgEl("ellipse", { cx: x, cy: NY, rx: 24, ry: 13, fill: "var(--paper)", stroke: "var(--blue)", "stroke-width": 1.5 }));
      }
      svg.append(svgEl("text", { x, y: NY + 4, "text-anchor": "middle", "font-size": 11.5, fill: "var(--ink)", "font-weight": "600" }, nd.name));
      if (f.right) svg.append(svgLabel(x + 26, NY - 20, f.right.flatMap((a, k) => (k ? [" ", a] : [a])), { "font-size": 12 }, hot));
      if (f.left) svg.append(svgLabel(x - 26, NY - 20, f.left.flatMap((a, k) => (k ? [" ", a] : [a])), { "font-size": 12, "text-anchor": "end" }, hot));
      if (f.extra) {
        const ey = f.extra.up ? NY - 58 : NY + 58;
        svg.append(svgEl("line", { x1: x, y1: f.extra.up ? NY - 13 : NY + 13, x2: x, y2: ey, stroke: "var(--ink-dim)", "stroke-dasharray": "3 3" }));
        if (f.extra.label) svg.append(svgLabel(x + 6, f.extra.up ? ey + 14 : ey - 8, f.extra.label.flatMap((a, k) => (k ? [" ", a] : [a])), { "font-size": 11, fill: "var(--ink-dim)" }, hot));
        svg.append(svgEl("text", { x, y: f.extra.up ? ey - 4 : ey + 12, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, f.extra.text));
      }
    });
    svg.append(svgEl("text", { x: 8, y: 192, "font-size": 10.5, fill: "var(--ink-dim)" }, "N: IP address   L: link-layer address   (click a link to see its frame)"));
  }
  /** What moves in the step on screen: the frame along its link, the ARP question out and the answer back. */
  function drawMove(frac) {
    gMove.innerHTML = "";
    const cur = steps[step], lk = P.links[cur.link], xa = NX[cur.link] + 24, xb = NX[cur.link + 1] - 24;
    const ease = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
    if (cur.phase === "table") {
      const x = NX[cur.link];
      gMove.append(P.nodes[cur.link].kind === "host"
        ? svgEl("rect", { x: x - 25, y: NY - 18, width: 50, height: 36, rx: 6, fill: "none", stroke: "var(--hl)", "stroke-width": 2 })
        : svgEl("ellipse", { cx: x, cy: NY, rx: 27, ry: 16, fill: "none", stroke: "var(--hl)", "stroke-width": 2 }));
      return;
    }
    if (cur.phase === "arp") {
      const out = frac < 0.5, t = ease(out ? frac * 2 : frac * 2 - 1), w = 40, color = out ? "var(--hl)" : "var(--blue)";
      const x = out ? xa + (xb - w - xa) * t : xb - w - (xb - w - xa) * t;
      gMove.append(svgEl("rect", { x, y: NY - 11, width: w, height: 22, rx: 11, fill: "var(--paper)", stroke: color, "stroke-width": 1.5 }));
      gMove.append(svgLabel(x + w / 2, NY + 3, out ? [lk.hop, " ?"] : [lk.ldst], { "font-size": 10.5, "text-anchor": "middle", fill: color }));
      return;
    }
    const w = 50, arrived = cur.phase === "final", x = arrived ? xb - w : xa + (xb - w - xa) * ease(frac);
    const known = !drawMode || solvedLink(cur.link);
    gMove.append(svgEl("rect", { x, y: NY - 15, width: w, height: 30, rx: 3, fill: "var(--paper)", stroke: arrived ? "var(--blue)" : "var(--hl)", "stroke-width": 1.5 }));
    const top = svgLabel(x + w / 2, NY - 3, known ? [lk.ldst, " ", lk.lsrc] : ["L? L?"], { "font-size": 10.5, "text-anchor": "middle", fill: "var(--hl)" });
    if (arrived) top.setAttribute("opacity", String(1 - ease(frac))); // the header is removed at Bob
    gMove.append(top, svgLabel(x + w / 2, NY + 10, [P.nsrc, " ", P.ndst], { "font-size": 10.5, "text-anchor": "middle", fill: "var(--blue)" }));
  }
  function cellOf(content, cls, small) {
    const c = el("div", `c ${cls}`);
    if (typeof content === "string") c.innerHTML = content; else c.append(content);
    if (small) c.append(el("small", null, small));
    return c;
  }
  function render() {
    const cur = steps[step], lk = P.links[cur.link];
    drawTopology();
    caption.innerHTML = cur.text;
    frameRow.innerHTML = "";
    detail.innerHTML = "";
    detail.style.display = drawMode ? "none" : "";
    if (cur.phase === "table" || cur.phase === "arp") {
      detail.innerHTML = `<b>Forwarding table</b> at ${lk.sender}: ${h(P.ndst)} → ${h(lk.hop)}` + (cur.phase === "arp" ? `<br><b>ARP</b> (${lk.sender}) → ${h(lk.hop)} ?   <b>ARP</b> (${lk.next}) → ${h(lk.ldst)}` : "");
      frameRow.append(cellOf(h(P.nsrc), "n", "IP source"), cellOf(h(P.ndst), "n", "IP destination"), cellOf("Data", "d"));
      frameRow.append(el("span", "encap-pduname", "datagram, waiting for the link-layer address"));
      return;
    }
    detail.style.display = !drawMode && (cur.phase === "final" || lk.sender) ? "" : "none";
    if (cur.phase === "final") detail.innerHTML = `<b>At Bob</b>: frame [${h(lk.ldst)} | ${h(lk.lsrc)} | ${h(P.nsrc)} | ${h(P.ndst)} | Data] → datagram [${h(P.nsrc)} | ${h(P.ndst)} | Data]`;
    else if (lk.sender) detail.innerHTML = `<b>Forwarding table</b>: ${h(P.ndst)} → ${h(lk.hop)} · <b>ARP</b> (${lk.next}) answered ${h(lk.ldst)} · ${lk.sender}'s own address on this link: ${h(lk.lsrc)}`;
    if (!drawMode) {
      frameRow.append(cellOf(h(lk.ldst), "l hot", "link-layer destination"), cellOf(h(lk.lsrc), "l hot", "link-layer source"), cellOf(h(P.nsrc), "n", "IP source"), cellOf(h(P.ndst), "n", "IP destination"), cellOf("Data", "d"));
      return;
    }
    const g = guess[cur.link], was = checked[cur.link];
    const mk = (key, label, answer) => {
      const input = document.createElement("input");
      input.type = "text"; input.className = "q-input"; input.value = g[key]; input.spellcheck = false;
      input.setAttribute("aria-label", `${label} on ${lk.name}`);
      input.placeholder = "L?";
      const ok = normAddr(g[key]) === normAddr(answer.key);
      if (was) input.classList.add(ok ? "correct" : "incorrect");
      input.addEventListener("input", () => { g[key] = input.value; checked[cur.link] = false; input.classList.remove("correct", "incorrect"); verdict.textContent = ""; drawMove(fracOf(pb.pos())); });
      return cellOf(input, "l" + (was ? (ok ? " hot" : " bad") : ""), label);
    };
    frameRow.append(mk("d", "link-layer destination", lk.ldst), mk("s", "link-layer source", lk.lsrc), cellOf(h(P.nsrc), "n", "IP source"), cellOf(h(P.ndst), "n", "IP destination"), cellOf("Data", "d"));
  }
  const stepOf = (pos) => clamp(Math.ceil(pos - 1e-9) - 1, 0, steps.length - 1);
  const fracOf = (pos) => (pos <= 0 ? 0 : clamp(pos - stepOf(pos), 0, 1));
  /** One playback frame: the step's text and fields are rebuilt only when the step changes, the moving part every time. */
  function frame(pos) {
    const i = stepOf(pos);
    if (i !== shown) { step = shown = i; verdict.textContent = ""; render(); }
    drawMove(fracOf(pos));
  }
  const redraw = () => { render(); drawMove(fracOf(pb.pos())); };
  check.addEventListener("click", () => {
    const i = steps[step].link, lk = P.links[i], g = guess[i];
    checked[i] = true;
    const okD = normAddr(g.d) === normAddr(lk.ldst.key), okS = normAddr(g.s) === normAddr(lk.lsrc.key);
    const solved = P.links.filter((l, k) => solvedLink(k)).length;
    redraw();
    verdict.textContent = okD && okS ? `Correct: [${addrText(lk.ldst)} | ${addrText(lk.lsrc)} | ${addrText(P.nsrc)} | ${addrText(P.ndst)} | Data]. ${solved} of ${P.links.length} frames right.`
      : !okD && !okS ? "Both link-layer addresses are wrong (red): destination first, then the sender's own address on this link."
      : !okD ? "The destination is wrong (red): the next node's address on this link." : "The source is wrong (red): the sender's own interface on this link.";
  });
  reveal.addEventListener("click", () => {
    const i = steps[step].link, lk = P.links[i];
    guess[i] = { d: addrText(lk.ldst), s: addrText(lk.lsrc) }; checked[i] = true;
    redraw();
    verdict.textContent = `[${addrText(lk.ldst)} | ${addrText(lk.lsrc)} | ${addrText(P.nsrc)} | ${addrText(P.ndst)} | Data]`;
  });
  clear.addEventListener("click", () => { const i = steps[step].link; guess[i] = { d: "", s: "" }; checked[i] = false; verdict.textContent = ""; redraw(); });
  const MS = { table: 1300, arp: 2200, frame: 1700, draw: 1700, final: 1300 };
  pb = createPlayback({
    count: steps.length, unit: "step", onFrame: frame,
    stepMs: () => cfg.stepMs || MS[steps[clamp(Math.floor((pb ? pb.pos() : 0) + 1e-9), 0, steps.length - 1)].phase],
  });
  svg.after(pb.el);
}

// ---------- widget: arp-exchange ----------
const ARP_SYSTEMS = [
  { letter: "A", n: "1", l: "1", x: 75, y: 76, labelSide: 1 },
  { letter: "B", n: "2", l: "2", x: 565, y: 76, labelSide: -1 },
  { letter: "C", n: "3", l: "3", x: 415, y: 158, labelSide: 1 },
  { letter: "D", n: "4", l: "4", x: 225, y: 158, labelSide: -1 },
];
const ARP_ANSWERS = {
  op1: (s) => /^(1|0x0*1|0*1|request)$/i.test(s.trim()),
  op2: (s) => /^(2|0x0*2|0*2|reply)$/i.test(s.trim()),
  zeros: (s) => /^(all\s*0s?|all\s*zeros?|0+|zeros?|empty|(00[:-]){5}00|0x0+)$/i.test(s.trim()),
  bcast: (s) => /^(ba|broadcast|broadcast\s*address|(ff[:-]){5}ff|all\s*1s?|all\s*ones)$/i.test(s.trim()),
};
function arpExchange(box, cfg) {
  const t = clamp(Math.round(+cfg.target || 2), 2, 4);
  const quiz = !!cfg.quiz;
  const A = ARP_SYSTEMS[0], B = ARP_SYSTEMS[t - 1];
  const Nn = (s) => `N<sub>${s}</sub>`, Ln = (s) => `L<sub>${s}</sub>`;
  // Playback: step 1 is the broadcast request, step 2 the unicast reply; `frac` is how far the message has travelled.
  let phase = 0, frac = 0, shown = -1;
  box.append(el("h4", null, cfg.title || `ARP: ${A.letter} needs the link-layer address of ${addrText(N(B.n))}`));
  const svg = svgEl("svg", { viewBox: "0 0 640 210", class: "curve-svg net-svg" });
  const caption = el("div", "encap-caption");
  const packets = el("div", "net5-packets");
  const quizCtl = el("div", "viz-btn-row");
  const check = el("button", "viz-btn", "Check"), reveal = el("button", "viz-btn", "Reveal"), clear = el("button", "viz-btn", "Clear");
  const verdict = el("span", "encap-pduname");
  quizCtl.append(check, reveal, clear, verdict);
  const note = el("p", "widget-note", "ARP is one of the auxiliary protocols defined in the network layer; it maps an IP address to a link-layer address. The request is broadcast (every system on the LAN receives it, only the owner of the IP address answers); the reply is unicast to the requester. Hosts and routers run ARP all the time in the background because they do not know when a request will come.");
  box.append(svg, caption, packets);
  if (quiz) box.append(quizCtl);
  box.append(note);

  const inputs = {};
  function field(label, value, w, small, key, answer) {
    const f = el("div", `f ${w}`);
    f.append(el("small", null, label));
    if (quiz && key) {
      const input = document.createElement("input");
      input.type = "text"; input.className = "q-input"; input.spellcheck = false;
      input.setAttribute("aria-label", `${label}, ${key.startsWith("req") ? "ARP request" : "ARP reply"}`);
      input.addEventListener("input", () => { input.classList.remove("correct", "incorrect"); verdict.textContent = ""; });
      inputs[key] = { input, answer, value, small };
      f.append(input);
      const hint = el("small", null, "?");
      f.append(hint);
      inputs[key].hint = hint;
      f.classList.add("key");
    } else {
      const b = el("b"); b.innerHTML = value; f.append(b);
      if (small) f.append(el("small", null, small));
      if (key) f.classList.add("key");
    }
    return f;
  }
  function packet(kind) {
    const req = kind === "request", pre = req ? "req" : "rep";
    const wrap = el("div", "net5-pkt-wrap");
    wrap.append(el("div", "stat-label", req ? `ARP request, ${A.letter} to all` : `ARP reply, ${B.letter} to ${A.letter}`));
    const p = el("div", "net5-pkt");
    p.append(
      field("Hardware type", "0x0001", "w2", "Ethernet"),
      field("Protocol type", "0x0800", "w2", "IPv4"),
      field("Hardware length", "0x06", "w1", "6 bytes"),
      field("Protocol length", "0x04", "w1", "4 bytes"),
      field("Operation", req ? "0x0001" : "0x0002", "w2", req ? "1 = request" : "2 = reply", `${pre}Op`, req ? ARP_ANSWERS.op1 : ARP_ANSWERS.op2),
      field("Source hardware address", req ? Ln(A.l) : Ln(B.l), "w4"),
      field("Source protocol address", req ? Nn(A.n) : Nn(B.n), "w4"),
      field("Destination hardware address", req ? "All 0s" : Ln(A.l), "w4", req ? "empty in a request: the address being asked for" : "", `${pre}Dha`, req ? ARP_ANSWERS.zeros : (s) => normAddr(s) === `L${A.l}`),
      field("Destination protocol address", req ? Nn(B.n) : Nn(A.n), "w4"),
    );
    wrap.append(p);
    const fr = el("div", "net5-frame");
    const dst = el("div", "c l" + (quiz ? "" : " hot"));
    if (quiz) {
      const input = document.createElement("input");
      input.type = "text"; input.className = "q-input"; input.spellcheck = false;
      input.setAttribute("aria-label", `frame destination, ${req ? "ARP request" : "ARP reply"}`);
      input.addEventListener("input", () => { input.classList.remove("correct", "incorrect"); verdict.textContent = ""; });
      inputs[`${pre}Fdst`] = { input, answer: req ? ARP_ANSWERS.bcast : (s) => ["A", `L${A.l}`].includes(normAddr(s)), value: req ? "BA" : A.letter };
      dst.append(input);
    } else dst.textContent = req ? "BA" : A.letter;
    dst.append(el("small", null, req ? "destination (BA: broadcast address)" : "destination"));
    const src = el("div", "c l", req ? A.letter : B.letter); src.append(el("small", null, "source"));
    const data = el("div", "c d", "ARP packet"); data.append(el("small", null, "data"));
    fr.append(dst, src, data);
    wrap.append(el("div", "stat-label", req ? "carried in a broadcast frame (the slide's label: multicast frame)" : "carried in a unicast frame"), fr);
    return wrap;
  }
  const pReq = packet("request"), pRep = packet("reply");
  packets.append(pReq, pRep);

  function drawLan() {
    svg.innerHTML = "";
    svg.append(svgEl("rect", { x: 10, y: 8, width: 620, height: 196, rx: 6, fill: "var(--hl-soft)", stroke: "var(--rule)" }));
    svg.append(svgEl("text", { x: 20, y: 24, "font-size": 11, fill: "var(--ink-dim)" }, "LAN"));
    svg.append(svgEl("line", { x1: 320, y1: 8, x2: 320, y2: 22, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("rect", { x: 296, y: 22, width: 48, height: 18, rx: 3, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: 320, y: 34, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink)" }, "switch"));
    const hub = [320, 40];
    for (const s of ARP_SYSTEMS) svg.append(svgEl("line", { x1: hub[0], y1: hub[1], x2: s.x, y2: s.y - 15, stroke: "var(--ink-dim)" }));
    const hl = arrowMarker(svg, "var(--hl)"), bl = arrowMarker(svg, "var(--blue)");
    // A message grows from its sender to the switch (first half of the step), then on to its receivers.
    const t1 = easeIO(frac * 2), t2 = easeIO(frac * 2 - 1);
    const leg = (from, to, t, color, marker) => {
      if (t <= 0) return;
      const x2 = lerp(from[0], to[0], t), y2 = lerp(from[1], to[1], t);
      const attrs = { x1: from[0], y1: from[1], x2, y2, stroke: color, "stroke-width": 3 };
      if (marker) attrs["marker-end"] = marker;
      svg.append(svgEl("line", attrs));
      if (frac < 1) svg.append(svgEl("circle", { cx: x2, cy: y2, r: 4.5, fill: color }));
    };
    if (phase === 1) {
      leg([A.x, A.y - 15], hub, t1, "var(--hl)", null);
      for (const s of ARP_SYSTEMS) if (s !== A) leg(hub, [s.x, s.y - 15], t2, "var(--hl)", hl);
      svg.append(svgEl("rect", { x: 150, y: 44, width: 60, height: 18, rx: 3, fill: "var(--paper)", stroke: "var(--hl)" }));
      svg.append(svgEl("text", { x: 180, y: 57, "text-anchor": "middle", "font-size": 10.5, fill: "var(--hl)" }, "Request"));
    } else if (phase === 2) {
      leg([B.x, B.y - 15], hub, t1, "var(--blue)", null);
      leg(hub, [A.x, A.y - 15], t2, "var(--blue)", bl);
      svg.append(svgEl("rect", { x: 430, y: 44, width: 50, height: 18, rx: 3, fill: "var(--paper)", stroke: "var(--blue)" }));
      svg.append(svgEl("text", { x: 455, y: 57, "text-anchor": "middle", "font-size": 10.5, fill: "var(--blue)" }, "Reply"));
    }
    for (const s of ARP_SYSTEMS) {
      const isA = s === A, isB = s === B;
      svg.append(svgEl("rect", { x: s.x - 34, y: s.y - 15, width: 68, height: 30, rx: 4, fill: "var(--paper)", stroke: isA && phase === 1 ? "var(--hl)" : isB && phase === 2 ? "var(--blue)" : "var(--rule-strong)", "stroke-width": (isA && phase === 1) || (isB && phase === 2) ? 2 : 1 }));
      svg.append(svgEl("text", { x: s.x, y: s.y + 4, "text-anchor": "middle", "font-size": 11, fill: "var(--ink)", "font-weight": isA || isB ? "600" : "400" }, `System ${s.letter}`));
      const lx = s.x + s.labelSide * 40;
      svg.append(svgLabel(lx, s.y + 4, [N(s.n), " ", L(s.l)], { "font-size": 12, "text-anchor": s.labelSide > 0 ? "start" : "end", fill: isB ? "var(--blue)" : "var(--ink)" }));
    }
    svg.append(svgEl("text", { x: 20, y: 196, "font-size": 10.5, fill: "var(--ink-dim)" }, phase === 1
      ? `Request: looking for link-layer address of a node with IP address ${addrText(N(B.n))}`
      : phase === 2 ? `Reply: I am the node and my link-layer address is ${addrText(L(B.l))}` : `${A.letter} knows ${addrText(N(B.n))} but not ${addrText(L(B.l))}`));
  }
  function render() {
    drawLan();
    if (phase === shown) return;
    shown = phase;
    pReq.classList.toggle("cur", phase === 1); pReq.classList.toggle("dim", phase === 2);
    pRep.classList.toggle("cur", phase === 2); pRep.classList.toggle("dim", phase === 1);
    caption.innerHTML = phase === 0
      ? `System ${A.letter} (${Nn(A.n)}, ${Ln(A.l)}) has a datagram for ${Nn(B.n)} and needs ${Ln(B.l)} for the frame. It broadcasts an ARP request.`
      : phase === 1 ? `<b>ARP request is broadcast</b>: every system on the LAN receives the frame (destination BA, the broadcast address); only the one whose IP address is ${Nn(B.n)} answers. The destination hardware address field is all 0s because that is what is being asked.`
      : `<b>ARP reply is unicast</b>: System ${B.letter} answers ${A.letter} only, in a frame addressed to ${A.letter}. The reply's operation field is 2 and it carries ${Ln(B.l)} as the source hardware address.`;
  }
  const pb = createPlayback({
    count: 2, unit: "message", stepMs: cfg.stepMs || 2000,
    onFrame: (pos) => { phase = pos <= 0 ? 0 : Math.min(2, Math.ceil(pos - 1e-9)); frac = phase ? clamp(pos - (phase - 1), 0, 1) : 0; render(); },
  });
  svg.after(pb.el);
  check.addEventListener("click", () => {
    let bad = 0, total = 0;
    for (const f of Object.values(inputs)) { total++; const ok = f.answer(f.input.value); f.input.classList.toggle("correct", ok); f.input.classList.toggle("incorrect", !ok); if (!ok) bad++; }
    verdict.textContent = bad === 0 ? "All fields correct." : `${bad} of ${total} fields wrong or empty (red).`;
  });
  reveal.addEventListener("click", () => {
    for (const f of Object.values(inputs)) { f.input.value = f.value.replace(/<[^>]+>/g, ""); f.input.classList.remove("incorrect"); f.input.classList.add("correct"); if (f.hint) f.hint.textContent = f.small || ""; }
    verdict.textContent = "Request: operation 1, destination hardware address all 0s, frame to BA. Reply: operation 2, destination hardware address L" + subText(A.l) + ", frame to A.";
  });
  clear.addEventListener("click", () => { for (const f of Object.values(inputs)) { f.input.value = ""; f.input.classList.remove("correct", "incorrect"); if (f.hint) f.hint.textContent = "?"; } verdict.textContent = ""; });
  render();
}

// ---------- widget: mux-link ----------
const MUX_MODES = ["fdm", "tdm", "wdm"];
const WDM_HUES = [30, 55, 170, 210, 275, 320];
function muxLink(box, cfg) {
  let n = clamp(Math.round(+cfg.n || 4), 2, 6);
  let mode = MUX_MODES.includes(cfg.mode) ? cfg.mode : "fdm";
  let pb = null;
  const clipId = `net5-mux-clip-${++uid}`;
  box.append(el("h4", null, cfg.title || "One link, n channels: FDM, TDM and WDM"));
  box.append(btnRow(["FDM", "TDM", "WDM"], (i) => { mode = MUX_MODES[i]; pb.reset(2 * n); }, MUX_MODES.indexOf(mode)));
  const sN = slider("Input lines n", 2, 6, 1, n, (v) => { n = v; pb.reset(2 * n); }, (v) => String(v));
  const svg = svgEl("svg", { viewBox: "0 0 640 190", class: "curve-svg net-svg" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const defs = el("div", "net5-box");
  defs.innerHTML = "<b>Link</b> refers to the physical path. <b>Channel</b> refers to the portion of a link.";
  const out = el("div", "stat-grid");
  const note = el("p", "widget-note");
  box.append(sN.row, svg, caption);
  // TDM mode: one playback step = one slot entering the link; two frames per pass.
  function draw(pos) {
    svg.innerHTML = "";
    const tdm = mode === "tdm";
    if (pb) pb.el.style.display = tdm ? "" : "none";
    caption.style.display = tdm ? "" : "none";
    const yIn = (k) => 40 + (k * 110) / (n - 1);
    const step = Math.min(2 * n, Math.floor(pos + 1e-9)), frac = tdm ? clamp(pos - step, 0, 1) : 0;
    const turn = tdm && pos > 1e-9 ? (Math.ceil(pos - 1e-9) - 1) % n : -1; // the line whose slot is entering
    for (let k = 0; k < n; k++) {
      const y = yIn(k), hot = k === turn;
      const color = mode === "wdm" ? `hsl(${WDM_HUES[k]} 80% 60%)` : LINE_FILL[k];
      svg.append(svgEl("line", { x1: 30, y1: y, x2: 120, y2: y, stroke: hot ? "var(--hl)" : color, "stroke-width": hot ? 3.5 : 2 }));
      svg.append(svgEl("line", { x1: 520, y1: y, x2: 610, y2: y, stroke: color, "stroke-width": 2 }));
      svg.append(svgEl("text", { x: 26, y: y + 4, "text-anchor": "end", "font-size": 10.5, fill: hot ? "var(--hl)" : "var(--ink-dim)", "font-weight": hot ? "700" : "400" }, mode === "wdm" ? `λ${subText(String(k + 1))}` : String(k + 1)));
      svg.append(svgEl("text", { x: 614, y: y + 4, "font-size": 10.5, fill: "var(--ink-dim)" }, mode === "wdm" ? `λ${subText(String(k + 1))}` : String(k + 1)));
    }
    svg.append(svgEl("text", { x: 60, y: 184, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `n = ${n} input lines`));
    svg.append(svgEl("text", { x: 580, y: 184, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `n = ${n} output lines`));
    svg.append(svgEl("polygon", { points: "120,22 170,50 170,140 120,168", fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("polygon", { points: "520,22 470,50 470,140 520,168", fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("text", { x: 145, y: 99, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", "font-weight": "600" }, mode === "wdm" ? "prism" : "MUX"));
    svg.append(svgEl("text", { x: 495, y: 99, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", "font-weight": "600" }, mode === "wdm" ? "prism" : "DEMUX"));
    const LX0 = 170, LX1 = 470, LY0 = 50, LY1 = 140;
    svg.append(svgEl("rect", { x: LX0, y: LY0, width: LX1 - LX0, height: LY1 - LY0, fill: "var(--paper)", stroke: "var(--rule-strong)" }));
    if (mode === "fdm") {
      const bh = (LY1 - LY0) / n;
      for (let k = 0; k < n; k++) {
        const y = LY1 - (k + 1) * bh;
        svg.append(svgEl("rect", { x: LX0 + 1, y: y + 1, width: LX1 - LX0 - 2, height: bh - 2, fill: LINE_FILL[k], opacity: 0.5 }));
        svg.append(svgEl("text", { x: 320, y: y + bh / 2 + 4, "text-anchor": "middle", "font-size": bh > 18 ? 11 : 9, fill: "var(--ink)" }, `channel ${k + 1}: a band of frequencies for line ${k + 1}`));
      }
      svg.append(svgEl("text", { x: LX0 - 4, y: LY0 - 4, "text-anchor": "end", "font-size": 9.5, fill: "var(--ink-dim)" }, "frequency ↑"));
    } else if (tdm) {
      // The slot train moves toward the DEMUX: the rightmost slot was sent first. Slot j (0-based, in sending
      // order) belongs to line j mod n. After `pos` steps, slot j sits (pos − 1 − j) slot widths from the MUX.
      const sw = (LX1 - LX0) / (2 * n), defsEl = svgEl("defs"), clip = svgEl("clipPath", { id: clipId });
      clip.append(svgEl("rect", { x: LX0, y: LY0, width: LX1 - LX0, height: LY1 - LY0 }));
      defsEl.append(clip); svg.append(defsEl);
      const g = svgEl("g", { "clip-path": `url(#${clipId})` });
      const sentSlots = Math.ceil(pos - 1e-9), head = pos; // slots that have entered; how far the newest has come in
      for (let j = 0; j < sentSlots; j++) {
        const k = j % n, x = LX0 + (head - 1 - j) * sw, hot = j === sentSlots - 1 && frac > 0;
        g.append(svgEl("rect", { x: x + 1, y: LY0 + 18, width: sw - 2, height: 54, fill: LINE_FILL[k], opacity: hot ? 0.85 : 0.5, stroke: hot ? "var(--hl)" : "none", "stroke-width": 2 }));
        g.append(svgEl("text", { x: x + sw / 2, y: LY0 + 49, "text-anchor": "middle", "font-size": 11, fill: "var(--ink)" }, String(k + 1)));
      }
      // bracket the newest complete frame: slots f·n … f·n + n − 1
      const full = Math.floor((step) / n);
      if (full > 0) {
        const j0 = (full - 1) * n, xa = LX0 + (head - 1 - (j0 + n - 1)) * sw, xb = LX0 + (head - j0) * sw;
        g.append(svgEl("line", { x1: xa, y1: LY1 - 10, x2: xb, y2: LY1 - 10, stroke: "var(--hl)", "stroke-width": 2 }));
        g.append(svgEl("text", { x: (xa + xb) / 2, y: LY1 - 1, "text-anchor": "middle", "font-size": 9.5, fill: "var(--hl)" }, `frame ${full}: ${n} time slots`));
      }
      svg.append(g);
      svg.append(svgEl("text", { x: LX0 + 4, y: LY0 + 12, "font-size": 9.5, fill: "var(--ink-dim)" }, "time →  each channel is a time slot that comes round every frame"));
      let text;
      if (pos <= 1e-9) text = `${n} lines share the link in time: each step sends one slot, and ${n} slots make a frame.`;
      else {
        const j = Math.ceil(pos - 1e-9) - 1, k = j % n, fr = Math.floor(j / n) + 1;
        text = `Slot ${j + 1}: line ${k + 1}'s turn, slot ${k + 1} of frame ${fr}.` + (k === n - 1 && pos >= j + 1 - 1e-9 ? ` Frame ${fr} is complete: one slot for each of the ${n} lines, then line 1 again.` : "");
      }
      if (caption.textContent !== text) caption.textContent = text;
    } else {
      svg.append(svgEl("rect", { x: LX0, y: LY0, width: LX1 - LX0, height: LY1 - LY0, fill: "var(--paper-3)" }));
      const gap = (LY1 - LY0 - 20) / (n - 1);
      for (let k = 0; k < n; k++) {
        const y = LY0 + 10 + k * gap;
        svg.append(svgEl("line", { x1: LX0, y1: y, x2: LX1, y2: y, stroke: `hsl(${WDM_HUES[k]} 80% 60%)`, "stroke-width": 3 }));
      }
      svg.append(svgEl("text", { x: 320, y: LY1 + 14, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-dim)" }, `one fibre: λ${subText("1")} + … + λ${subText(String(n))}, a colour of light per line`));
    }
    svg.append(svgEl("text", { x: 320, y: LY0 - 8, "text-anchor": "middle", "font-size": 11, fill: "var(--ink)" }, `1 link, ${n} channels`));
    grid(out, [
      ["Links", "1", "the physical path"],
      ["Channels", String(n), "portions of the link, one for each input line"],
      ["Technique", { fdm: "FDM: frequency", tdm: "TDM: time", wdm: "WDM: wavelength" }[mode], { fdm: "analog signals share the bandwidth", tdm: "digital signals share the time", wdm: "analog optical signals share the fibre" }[mode]],
    ]);
    note.textContent = {
      fdm: "Frequency-division multiplexing: an analog technique; each sending signal modulates a different carrier frequency, and the modulated signals are combined into one composite signal. A channel is a band of the link's frequencies.",
      tdm: "Time-division multiplexing: a digital technique; the link's time is divided into slots and each input line gets one slot in every frame, so the link runs n times faster than one line. Only TDM is digital.",
      wdm: "Wavelength-division multiplexing: FDM for light. Analog optical signals of different wavelengths (colours) share one fibre; a prism combines them at the sender and splits them at the receiver.",
    }[mode];
  }
  pb = createPlayback({ count: 2 * n, unit: "slot", onFrame: draw, stepMs: () => cfg.stepMs || 900 });
  box.append(pb.el, defs, out, note);
  pb.set(0);
}

// ---------- widget: fdm-play ----------
// The slide-18 process played channel by channel: "Shift and combine" (each 0-B baseband hump is shifted up by its
// carrier and stacked into the composite), then "Filter and shift" (a bandpass filter picks each band out and it is
// shifted back to 0-B). Steps 1 … n are the sending side, n + 1 … 2n the receiving side.
function fdmPlay(box, cfg) {
  const presets = presetsOf(cfg, FDM_PRESETS), names = Object.keys(presets);
  let n = 3, B = 4, G = 0, S0 = 20, uName = "kHz", pb = null;
  let predict = !!cfg.predict, answered = 0, asked = 0, firstTry = 0, missed = false, wrong = null, askKey = null, refocus = false;
  box.append(el("h4", null, cfg.title || "FDM: shift and combine, then filter and shift"));
  const given = ["n", "bandwidth", "guard", "start"].some((k) => cfg[k] != null);
  const startName = names.find((k) => { const p = presets[k]; return given && +p.n === +cfg.n && +p.bandwidth === +cfg.bandwidth && +(p.guard ?? 0) === +(cfg.guard ?? 0) && +(p.start ?? 0) === +(cfg.start ?? 0); });
  if (names.length > 1) box.append(btnRow(names, (i) => { load(presets[names[i]]); restart(); }, given ? names.indexOf(startName) : 0));
  const predictLabel = el("label", "playback-check");
  const predictBox = document.createElement("input");
  predictBox.type = "checkbox"; predictBox.checked = predict;
  predictLabel.append(predictBox, " Predict each channel's band before it moves");
  const svg = svgEl("svg", { viewBox: "0 0 640 220", class: "curve-svg net-svg", role: "img", "aria-label": "baseband channels shifted up onto the link and filtered back down" });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  const note = el("p", "widget-note");
  box.append(predictLabel, svg, caption, ask);

  function load(p) {
    p = p || {};
    n = clamp(Math.round(+p.n || 3), 2, 8);
    B = +p.bandwidth > 0 ? +p.bandwidth : 4;
    G = +p.guard > 0 ? +p.guard : 0;
    S0 = +p.start > 0 ? +p.start : 0;
    uName = FREQ_UNITS.some(([u]) => u === p.unit) ? p.unit : "kHz";
  }
  const steps = () => 2 * n;
  const band = (k) => { const lo = S0 + k * (B + G); return [lo, lo + B]; };
  const total = () => n * B + (n - 1) * G;
  const f3 = (v) => num(v, 3);
  const bandText = ([lo, hi]) => `${f3(lo)}–${f3(hi)} ${uName}`;
  /** Choices for "which band does channel k use": the right one and the usual slips. */
  function choices(k) {
    const right = bandText(band(k)), seen = new Set([right]), out = [{ label: right, ok: true }];
    const why = `Channel k starts at ${f3(S0)} + (k − 1)(B + G) = ${f3(S0)} + ${k} × ${f3(B + G)} ${uName}: the channels before it and the guard bands between them.`;
    const add = (lo) => { const t = bandText([lo, lo + B]); if (lo >= 0 && !seen.has(t) && out.length < 4) { seen.add(t); out.push({ label: t, why }); } };
    if (G > 0) add(S0 + k * B);
    add(band(k)[0] + B + G);
    if (k > 0) add(band(k)[0] - B - G);
    add(0);
    add(band(k)[0] + G);
    const r = (k * 3 + 1) % out.length;
    return out.slice(r).concat(out.slice(0, r));
  }
  const asking = (pos) => predict && answered < steps() && Math.abs(pos - answered) < 1e-6;
  function answer(o, e) {
    asked += wrong == null && !missed ? 1 : 0;
    refocus = e.detail === 0;
    if (!o.ok) { missed = true; wrong = o; frame(pb.pos()); return; }
    if (!missed) firstTry++;
    missed = false; wrong = null; answered++;
    pb.next();
  }
  function renderAsk(pos) {
    const key = asking(pos) ? `${n}|${B}|${G}|${S0}|${answered}|${wrong ? wrong.label : ""}` : "";
    if (key === askKey) return;
    askKey = key; ask.innerHTML = ""; ask.hidden = !predict;
    if (!key) return;
    const btns = choices(answered % n).map((o) => {
      const b = el("button", "viz-btn" + (wrong && o.label === wrong.label ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => answer(o, e));
      ask.append(b);
      return b;
    });
    if (wrong) ask.append(el("span", "playback-feedback", `Not ${wrong.label}. ${wrong.why}`));
    if (refocus) { refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  }
  function frame(pos) {
    const q = asking(pos), K = steps(), cur = q ? answered : Math.min(K - 1, Math.floor(pos - 1e-9));
    const f = q ? 0 : cur < 0 ? 0 : pos - cur, e = easeIO(f);
    const rowH = Math.min(30, Math.max(19, Math.floor(150 / n))), top = 40, H = top + n * rowH + 44;
    const LX0 = 34, LX1 = 128, CX0 = 178, CX1 = 462, RX0 = 512, RX1 = 606, BASE = top + (n * rowH) / 2 + 26, HH = Math.min(46, rowH * 1.6);
    const rowY = (k) => top + k * rowH + rowH - 3;
    const bx = (x0, x1, v) => x0 + ((x1 - x0) * v) / B;            // a baseband box: 0 … B
    const cx = (v) => CX0 + ((CX1 - CX0) * (v - S0)) / total();     // the link: S0 … S0 + total
    const hh = rowH - 7;
    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 640 ${H}`);
    const dim = { "font-size": 10.5, fill: "var(--ink-dim)" };
    svg.append(svgEl("text", { x: (LX0 + LX1) / 2, y: 16, "text-anchor": "middle", ...dim }, `${n} inputs, 0–${f3(B)} ${uName} each`));
    svg.append(svgEl("text", { x: (CX0 + CX1) / 2, y: 16, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink)", "font-weight": "600" }, `higher-bandwidth link: ${bandText([S0, S0 + total()])}`));
    svg.append(svgEl("text", { x: (RX0 + RX1) / 2, y: 16, "text-anchor": "middle", ...dim }, "outputs, back to baseband"));
    svg.append(svgEl("text", { x: (CX0 + CX1) / 2, y: 30, "text-anchor": "middle", "font-size": 10, fill: cur >= 0 && cur < n ? "var(--hl)" : "var(--ink-dim)" }, cur >= n ? "Filter and shift" : "Shift and combine"));
    // trapezoid hump between frequencies a and b, baseline y, height h
    const humpAt = (xa, xb, yb, h, k, o = {}) => {
      const w = xb - xa;
      svg.append(svgEl("polygon", { points: `${xa.toFixed(1)},${yb} ${(xa + w * 0.22).toFixed(1)},${yb - h} ${(xb - w * 0.22).toFixed(1)},${yb - h} ${xb.toFixed(1)},${yb}`, fill: LINE_FILL[k % LINE_FILL.length], opacity: o.faint ? 0.25 : 0.6, stroke: o.hot ? "var(--hl)" : LINE_FILL[k % LINE_FILL.length], "stroke-width": o.hot ? 2 : 1 }));
    };
    // link axis and guard bands
    svg.append(svgEl("line", { x1: CX0 - 6, y1: BASE, x2: CX1 + 8, y2: BASE, stroke: "var(--rule-strong)" }));
    const sent = cur < 0 ? 0 : cur < n ? cur + (f >= 0.999 ? 1 : 0) : n; // channels already on the link
    for (let k = 0; k < n; k++) {
      const y = rowY(k);
      svg.append(svgEl("text", { x: LX0 - 8, y: y - 2, "text-anchor": "end", ...dim }, String(k + 1)));
      svg.append(svgEl("text", { x: RX1 + 8, y: y - 2, ...dim }, String(k + 1)));
      for (const [x0, x1] of [[LX0, LX1], [RX0, RX1]]) svg.append(svgEl("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: "var(--rule-strong)" }));
    }
    svg.append(svgEl("text", { x: LX0, y: rowY(n - 1) + 12, ...dim }, "0"));
    svg.append(svgEl("text", { x: LX1, y: rowY(n - 1) + 12, "text-anchor": "end", ...dim }, f3(B)));
    svg.append(svgEl("text", { x: RX0, y: rowY(n - 1) + 12, ...dim }, "0"));
    svg.append(svgEl("text", { x: RX1, y: rowY(n - 1) + 12, "text-anchor": "end", ...dim }, f3(B)));
    // boundary labels on the link, for the channels placed so far
    const marks = new Set();
    for (let k = 0; k < Math.max(sent, cur >= 0 && cur < n ? cur + 1 : 0); k++) { const [lo, hi] = band(k); marks.add(lo); marks.add(hi); }
    let last = -1e9;
    for (const v of [...marks].sort((a, b) => a - b)) {
      const x = cx(v);
      svg.append(svgEl("line", { x1: x, y1: BASE - 3, x2: x, y2: BASE + 3, stroke: "var(--ink-dim)" }));
      if (x - last >= 26) { svg.append(svgEl("text", { x, y: BASE + 15, "text-anchor": "middle", ...dim }, f3(v))); last = x; }
    }
    for (let k = 0; k < n - 1 && G > 0; k++) if (k + 1 < sent || (k + 1 === cur && cur < n && f > 0.6)) {
      const ga = cx(band(k)[1]), gb = cx(band(k + 1)[0]);
      svg.append(svgEl("rect", { x: ga, y: BASE - HH * 0.6, width: gb - ga, height: HH * 0.6, fill: "var(--hl)", opacity: 0.3 }));
    }
    for (let k = 0; k < n; k++) {
      const y = rowY(k), [lo, hi] = band(k);
      // left: baseband input until it leaves
      if (cur < 0 || k > cur || (k === cur && q)) humpAt(bx(LX0, LX1, 0), bx(LX0, LX1, B), y, hh, k, { hot: k === cur && q });
      else humpAt(bx(LX0, LX1, 0), bx(LX0, LX1, B), y, hh, k, { faint: true });
      // the link: a channel is on it from its send step on
      const onLink = k < sent;
      const filtering = cur >= n && cur - n === k && !q;
      const delivered = cur >= n && (k < cur - n || (k === cur - n && f >= 0.999));
      if (onLink) humpAt(cx(lo), cx(hi), BASE, HH, k, { hot: filtering || (cur === k && f >= 0.999) });
      if (filtering && f < 0.999) {
        // the bandpass filter window, then the band sliding back to baseband
        svg.append(svgEl("rect", { x: cx(lo) - 2, y: BASE - HH - 8, width: cx(hi) - cx(lo) + 4, height: HH + 12, fill: "none", stroke: "var(--hl)", "stroke-width": 2, "stroke-dasharray": "5 3", opacity: clamp(f * 4, 0, 1) }));
        if (f > 0.35) {
          const t = easeIO((f - 0.35) / 0.65);
          humpAt(lerp(cx(lo), bx(RX0, RX1, 0), t), lerp(cx(hi), bx(RX0, RX1, B), t), lerp(BASE, y, t), lerp(HH, hh, t), k, { hot: true });
        }
      }
      if (delivered) humpAt(bx(RX0, RX1, 0), bx(RX0, RX1, B), y, hh, k, {});
      // the send step: the hump travels from its input row to its band on the link
      if (cur === k && cur < n && !q && f < 0.999) {
        humpAt(lerp(bx(LX0, LX1, 0), cx(lo), e), lerp(bx(LX0, LX1, B), cx(hi), e), lerp(y, BASE, e), lerp(hh, HH, e), k, { hot: true });
      }
    }
    let text;
    const tel = (k) => `Telephone ${k + 1}`;
    if (q) {
      const k = answered % n;
      text = answered < n ? `${tel(k)} is next: its modulator shifts 0–${f3(B)} ${uName} up onto the link. Which band does it land in?` : `Receiving side: which band does the bandpass filter for ${tel(k).toLowerCase()} pass?`;
    } else if (cur < 0) text = `${n} channels of ${f3(B)} ${uName}${G > 0 ? ` with ${f3(G)} ${uName} guard bands` : ", no guard bands"}, on a link from ${f3(S0)} ${uName}. Steps 1 to ${n} shift and combine; steps ${n + 1} to ${2 * n} filter and shift.`;
    else if (cur < n) {
      const k = cur, [lo, hi] = band(k);
      text = `${tel(k)}: the modulator shifts 0–${f3(B)} ${uName} up by ${f3(lo)} ${uName} to ${f3(lo)}–${f3(hi)} ${uName}`
        + (k === 0 ? "." : G > 0 ? `; a ${f3(G)} ${uName} guard band separates it from channel ${k}.` : `; no guard band, so it touches channel ${k}.`);
      if (k === n - 1 && f >= 0.999) text += ` Combined: B_link = ${n} × ${f3(B)} + ${n - 1} × ${f3(G)} = ${f3(total())} ${uName}, from ${f3(S0)} to ${f3(S0 + total())} ${uName}.`;
    } else {
      const k = cur - n, [lo, hi] = band(k);
      text = `Filter and shift: the bandpass filter for ${f3(lo)}–${f3(hi)} ${uName} keeps only channel ${k + 1}, and it is shifted back down by ${f3(lo)} ${uName} to 0–${f3(B)} ${uName} for ${tel(k).toLowerCase()}.`;
      if (pos >= K && asked > 0) text += ` ${firstTry} of ${asked} right on the first try.`;
    }
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(pos);
  }
  function restart() {
    answered = 0; asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    note.textContent = `Each source modulates its own carrier, so its 0–${f3(B)} ${uName} band is shifted onto its channel; the receiver's bandpass filter picks that band out and shifts it back. n channels need n − 1 guard bands: B_link = n × B + (n − 1) × G.`;
    pb.reset(steps());
  }
  load(given ? { ...cfg } : presets[names[0]]);
  pb = createPlayback({
    count: steps(), unit: "step", onFrame: frame,
    stepMs: () => cfg.stepMs || 1800,
    limit: () => (predict ? answered : steps()),
    onBlocked: () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); },
  });
  box.append(pb.el, note);
  predictBox.addEventListener("change", () => {
    predict = predictBox.checked; pb.pause();
    answered = Math.ceil(pb.pos() - 1e-9); asked = 0; firstTry = 0; missed = false; wrong = null; askKey = null;
    pb.set(pb.pos());
  });
  restart();
}

export const WIDGETS = {
  "fdm-plan": fdmPlan,
  "tdm-frames": tdmFrames,
  "tdm-play": tdmPlay,
  "rate-manager": rateManager,
  "hop-walk": hopWalk,
  "arp-exchange": arpExchange,
  "mux-link": muxLink,
  "fdm-play": fdmPlay,
};
