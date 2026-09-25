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
let hideTimer = 0;
const cancelHide = () => { clearTimeout(hideTimer); hideTimer = 0; };
// Leaving the term or the card closes the card after a short grace period, long enough to move the
// pointer into the card and click a link in it; entering either one cancels the close.
function scheduleHide() { cancelHide(); hideTimer = setTimeout(hideCard, 260); }
function showCard(anchor, term, def) {
  cancelHide();
  if (card && card._anchor === anchor) return;
  hideCard();
  card = el("div", "gloss-card");
  card._anchor = anchor;
  card.innerHTML = `<div class="gloss-term">${term.replace(/</g, "&lt;")}</div><div class="gloss-def">${inline(def)}</div>`;
  card.addEventListener("mouseenter", cancelHide);
  card.addEventListener("mouseleave", scheduleHide);
  card.addEventListener("pointerdown", cancelHide);
  card.addEventListener("focusin", cancelHide);
  card.addEventListener("focusout", scheduleHide);
  document.body.append(card);
  const r = anchor.getBoundingClientRect();
  const w = card.offsetWidth;
  let left = r.left + window.scrollX; if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
  card.style.left = left + "px";
  card.style.top = r.bottom + window.scrollY + 6 + "px";
}
function hideCard() { cancelHide(); if (card) { card.remove(); card = null; } }
document.addEventListener("scroll", hideCard, true);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideCard(); });
// A tap or click anywhere else closes it (touch has no hover to leave).
document.addEventListener("pointerdown", (e) => { if (card && !card.contains(e.target) && !card._anchor.contains(e.target)) hideCard(); });

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
    c.addEventListener("mouseleave", scheduleHide); c.addEventListener("blur", scheduleHide);
    n++;
  }
  return n;
}
