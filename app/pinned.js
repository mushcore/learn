// Pinned examples + reference linking.
//
// A `cpp run pin <title>` block is the ONE copy of the program: runnable, editable, and docked
// beside the prose that follows (until the next heading of the same or higher level). A
// `cpp pin` block does the same with a read-only listing. Every inline `code` span in that prose
// whose text occurs in the program lights up the matching line(s) on hover, and vice versa.
// Matching respects identifier boundaries, so `ostream` does not match `iostream`.
import { highlight } from "./highlight.js";

const WIDE = window.matchMedia("(min-width: 1100px)");
const norm = (s) => s.replace(/\s+/g, " ").trim();
const IDENT = /[A-Za-z0-9_]/;

/** True when `needle` occurs in `hay` and is not glued to identifier chars on either side. */
function boundedIncludes(hay, needle) {
  let from = 0;
  while (true) {
    const i = hay.indexOf(needle, from);
    if (i < 0) return false;
    const before = i > 0 ? hay[i - 1] : "";
    const after = hay[i + needle.length] || "";
    const leftOk = !(IDENT.test(before) && IDENT.test(needle[0]));
    const rightOk = !(IDENT.test(after) && IDENT.test(needle[needle.length - 1]));
    if (leftOk && rightOk) return true;
    from = i + 1;
  }
}

/** Read-only listing with one row per line. Returns a source: { el, lines(), onChange(fn) }. */
export function buildStaticPinned(lang, code, title) {
  const wrap = document.createElement("div");
  wrap.className = "pinned";
  const head = document.createElement("div");
  head.className = "pinned-head";
  head.textContent = title || "Example";
  const pre = document.createElement("pre");
  pre.className = "pinned-pre";
  code.replace(/\s+$/, "").split("\n").forEach((text, i) => {
    const row = document.createElement("div");
    row.className = "pl";
    row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight(lang, text) || " "}</span>`;
    pre.append(row);
  });
  wrap.append(head, pre);
  return { el: wrap, lines: () => [...pre.querySelectorAll(".pl")], onChange: () => {} };
}

/**
 * Links `code` spans inside `scope` to lines of `source` (static listing or live runner).
 * Re-links whenever the source reports a change, so edits in a pinned runner keep working.
 */
export function linkReferences(scope, source) {
  const spans = [...scope.querySelectorAll("code")].filter((c) => !c.closest("pre, .pinned, .runner, .q-code, .codeblock"));
  let rows = [];
  let map = new Map(); // span -> [rowIndex]
  const clearHot = () => { rows.forEach((r) => r.classList.remove("hot")); spans.forEach((s) => s.classList.remove("hot")); };

  function relink() {
    rows = source.lines();
    const texts = rows.map((r) => norm(r.textContent));
    map = new Map();
    for (const span of spans) {
      const parts = span.textContent.split("\n").map(norm).filter(Boolean);
      const text = norm(span.textContent);
      if (text.length < 2) { span.classList.remove("ref"); continue; }
      let hits = [];
      if (parts.length > 1) {
        for (let i = 0; i + parts.length <= texts.length; i++) if (parts.every((p, k) => boundedIncludes(texts[i + k], p))) hits.push(...parts.map((_, k) => i + k));
      } else texts.forEach((t, i) => { if (boundedIncludes(t, text)) hits.push(i); });
      hits = [...new Set(hits)];
      if (!hits.length || hits.length > Math.max(3, texts.length / 2)) { span.classList.remove("ref"); delete span.dataset.lines; continue; }
      span.classList.add("ref");
      span.dataset.lines = hits.join(",");
      map.set(span, hits);
    }
    rows.forEach((row, i) => {
      row.onmouseenter = () => { const refs = [...map].filter(([, h]) => h.includes(i)).map(([s]) => s); if (!refs.length) return; row.classList.add("hot"); refs.forEach((s) => s.classList.add("hot")); };
      row.onmouseleave = clearHot;
    });
  }
  for (const span of spans) {
    span.tabIndex = 0;
    const on = () => { const hits = map.get(span); if (!hits) return; hits.forEach((i) => rows[i]?.classList.add("hot")); span.classList.add("hot"); rows[hits[0]]?.scrollIntoView({ block: "nearest" }); };
    span.addEventListener("mouseenter", on);
    span.addEventListener("focus", on);
    span.addEventListener("mouseleave", clearHot);
    span.addEventListener("blur", clearHot);
  }
  relink();
  source.onChange(relink);
  return map.size;
}

/** Wraps `nodes` so the pinned source sits beside them on wide screens. */
export function wrapSection(nodes, sourceEl) {
  const wrap = document.createElement("div");
  wrap.className = "pin-section";
  const prose = document.createElement("div");
  prose.className = "pin-prose";
  const aside = document.createElement("div");
  aside.className = "pin-aside";
  aside.append(sourceEl);
  nodes.forEach((n) => prose.append(n));
  wrap.append(prose, aside);
  const apply = () => wrap.classList.toggle("stacked", !WIDE.matches);
  WIDE.addEventListener("change", apply);
  apply();
  // The aside is sticky so the code stays beside the prose that explains it, but a sticky box
  // taller than the viewport would never show its bottom lines. Code is shown at full height, so
  // when the box outgrows the window it is released to scroll with the page instead.
  const tall = () => aside.classList.toggle("tall", aside.offsetHeight > window.innerHeight - 24);
  if (window.ResizeObserver) new ResizeObserver(tall).observe(aside);
  window.addEventListener("resize", tall);
  requestAnimationFrame(tall);
  return wrap;
}
