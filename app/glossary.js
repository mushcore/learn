// Glossary popovers: any inline `code` span or math symbol whose text matches a glossary term gets a
// dotted underline and a definition card on hover/focus. Terms come from courses/<id>/glossary.json:
//   { "term": "definition (markdown inline)", "alias|term": "..." }
import { el } from "./dom.js";
import { inline } from "./markdown.js";

const cache = new Map();
async function load(course) {
  if (!cache.has(course)) cache.set(course, fetch(`/courses/${course}/glossary.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({})));
  return cache.get(course);
}
function index(gloss) {
  const m = new Map();
  for (const [k, v] of Object.entries(gloss)) for (const t of k.split("|")) m.set(t.trim(), v);
  return m;
}

let card = null;
function showCard(anchor, term, def) {
  hideCard();
  card = el("div", "gloss-card");
  card.innerHTML = `<div class="gloss-term">${term.replace(/</g, "&lt;")}</div><div class="gloss-def">${inline(def)}</div>`;
  document.body.append(card);
  const r = anchor.getBoundingClientRect();
  const w = card.offsetWidth;
  let left = r.left + window.scrollX; if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
  card.style.left = left + "px";
  card.style.top = r.bottom + window.scrollY + 6 + "px";
}
function hideCard() { if (card) { card.remove(); card = null; } }
document.addEventListener("scroll", hideCard, true);

/** Decorates glossary terms inside `scope`. Skips spans already used as pin references (they have their own affordance). */
export async function attachGlossary(scope, course) {
  const g = index(await load(course));
  if (!g.size) return 0;
  let n = 0;
  const cands = [...scope.querySelectorAll("code, .math")].filter((c) => !c.closest("pre, .runner, .pinned, .q-code, .codeblock, .gloss-card"));
  for (const c of cands) {
    const t = c.textContent.trim();
    const key = g.has(t) ? t : [...g.keys()].find((k) => k === t.replace(/[();]+$/, ""));
    if (!key || c.classList.contains("ref")) continue;
    c.classList.add("gloss");
    c.tabIndex = c.tabIndex >= 0 ? c.tabIndex : 0;
    const on = () => showCard(c, key, g.get(key));
    c.addEventListener("mouseenter", on); c.addEventListener("focus", on);
    c.addEventListener("mouseleave", hideCard); c.addEventListener("blur", hideCard);
    n++;
  }
  return n;
}
