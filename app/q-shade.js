// Question type `shade`: paint a region under a normal curve; graded on the shaded percentage.
import { registerQuestionType } from "./quiz.js";
import { normCdf } from "./widgets-stats.js";
import { el } from "./dom.js";

const NS = "http://www.w3.org/2000/svg";
const S = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const [k, v] of Object.entries(a)) e.setAttribute(k, v); return e; };
const pdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

registerQuestionType("shade", (qEl, spec) => {
  const mu = Number(spec.mu), sigma = Number(spec.sigma);
  const W = 640, H = 200, pad = 30, base = 160, range = 4;
  const X = (z) => pad + ((z + range) / (2 * range)) * (W - 2 * pad);
  const Z = (x) => ((x - pad) / (W - 2 * pad)) * 2 * range - range;
  const Y = (z) => base - pdf(z) * 320;
  const st = { lo: -1, hi: 1, loInf: spec.region === "below", hiInf: spec.region === "above" };
  if (spec.region === "below") { st.lo = -range; st.hi = 1; }
  if (spec.region === "above") { st.lo = 1; st.hi = range; }

  const wrap = el("div", "shade-q");
  const svg = S("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg shade-svg" });
  const region = S("path", { fill: "var(--hl-soft)", stroke: "none" });
  const curve = S("path", { fill: "none", stroke: "var(--blue)", "stroke-width": 2 });
  let d = ""; for (let i = 0; i <= 200; i++) { const z = -range + (2 * range * i) / 200; d += (i ? "L" : "M") + X(z).toFixed(1) + "," + Y(z).toFixed(1); }
  curve.setAttribute("d", d);
  svg.append(region, curve, S("line", { x1: pad, x2: W - pad, y1: base, y2: base, stroke: "var(--rule-strong)" }));
  for (let k = -3; k <= 3; k++) {
    svg.append(S("line", { x1: X(k), x2: X(k), y1: base, y2: base + 5, stroke: "var(--ink-dim)" }));
    const t = S("text", { x: X(k), y: base + 18, "text-anchor": "middle", fill: "var(--ink-2)", "font-size": 11 }); t.textContent = String(+(mu + k * sigma).toFixed(2)); svg.append(t);
    const t2 = S("text", { x: X(k), y: base + 31, "text-anchor": "middle", fill: "var(--ink-dim)", "font-size": 10 }); t2.textContent = k === 0 ? "μ" : `${k > 0 ? "+" : ""}${k}σ`; svg.append(t2);
  }
  const correctOutline = S("path", { fill: "none", stroke: "var(--green)", "stroke-width": 2, "stroke-dasharray": "5 4", display: "none" });
  svg.append(correctOutline);
  const handles = {};
  for (const side of ["lo", "hi"]) {
    const g = S("g", { class: "shade-handle", tabindex: 0, role: "slider", "aria-label": side === "lo" ? "lower bound" : "upper bound" });
    g.append(S("line", { y1: 20, y2: base, stroke: "var(--hl)", "stroke-width": 2 }), S("circle", { cy: base, r: 8, fill: "var(--hl)" }));
    svg.append(g); handles[side] = g;
    let drag = false;
    g.addEventListener("pointerdown", (e) => { drag = true; g.setPointerCapture(e.pointerId); });
    g.addEventListener("pointermove", (e) => { if (!drag) return; const r = svg.getBoundingClientRect(); const z = Z(((e.clientX - r.left) / r.width) * W); set(side, Math.round(z * 2) / 2); });
    g.addEventListener("pointerup", () => { drag = false; });
    g.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { set(side, st[side] - 0.5); e.preventDefault(); } if (e.key === "ArrowRight") { set(side, st[side] + 0.5); e.preventDefault(); } });
  }
  const controls = el("div", "shade-controls");
  const loInf = el("button", "viz-btn", "lower: to −∞"), hiInf = el("button", "viz-btn", "upper: to +∞");
  const readout = el("span", "shade-readout");
  if (!spec.region) controls.append(loInf, hiInf);
  controls.append(readout);
  loInf.addEventListener("click", () => { st.loInf = !st.loInf; paint(); });
  hiInf.addEventListener("click", () => { st.hiInf = !st.hiInf; paint(); });

  function set(side, z) {
    if (spec.region === "below" && side === "lo") return; if (spec.region === "above" && side === "hi") return;
    st[side] = Math.max(-range, Math.min(range, z));
    if (st.lo > st.hi) [st.lo, st.hi] = [st.hi, st.lo];
    paint();
  }
  function pct() { const a = st.loInf ? -Infinity : st.lo, b = st.hiInf ? Infinity : st.hi; return (normCdf(b === Infinity ? 10 : b) - normCdf(a === -Infinity ? -10 : a)) * 100; }
  function regionPath(a, b) { a = Math.max(-range, a); b = Math.min(range, b); let p = `M${X(a)},${base}`; for (let i = 0; i <= 100; i++) { const z = a + ((b - a) * i) / 100; p += `L${X(z).toFixed(1)},${Y(z).toFixed(1)}`; } return p + `L${X(b)},${base}Z`; }
  function paint() {
    const a = st.loInf ? -range : st.lo, b = st.hiInf ? range : st.hi;
    region.setAttribute("d", regionPath(a, b));
    handles.lo.setAttribute("transform", `translate(${X(st.lo)},0)`); handles.lo.style.opacity = st.loInf ? 0.35 : 1;
    handles.hi.setAttribute("transform", `translate(${X(st.hi)},0)`); handles.hi.style.opacity = st.hiInf ? 0.35 : 1;
    loInf.classList.toggle("active", st.loInf); hiInf.classList.toggle("active", st.hiInf);
    const lo = st.loInf ? "−∞" : `${+(mu + st.lo * sigma).toFixed(2)}`, hi = st.hiInf ? "+∞" : `${+(mu + st.hi * sigma).toFixed(2)}`;
    readout.textContent = `shaded: ${lo} to ${hi} = ${pct().toFixed(2)}%`;
    handles.lo.setAttribute("aria-valuenow", st.lo); handles.hi.setAttribute("aria-valuenow", st.hi);
  }
  wrap.append(svg, controls);
  qEl.append(wrap);
  paint();

  return () => {
    const tol = spec.tolerance ?? 1;
    const ok = Math.abs(pct() - Number(spec.answer)) <= tol;
    wrap.classList.add(ok ? "correct" : "incorrect");
    readout.textContent += ok ? " — correct" : ` — expected ${spec.answer}%`;
    // draw the intended region if the author gave bounds
    if (spec.lo != null || spec.hi != null) { correctOutline.setAttribute("d", regionPath(spec.lo ?? -range, spec.hi ?? range)); correctOutline.style.display = ""; }
    Object.values(handles).forEach((h) => { h.style.pointerEvents = "none"; });
    return ok;
  };
});
