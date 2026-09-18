// Token cards: click a token inside a live, editable pinned program to see its story — what it
// does, why it's written that way — and, where useful, a "try that swap" button that edits the
// program in place, re-highlights it, and runs it so the student sees the real consequence
// (a different output, or a real compiler error) instead of reading about it.
//
// Wired from a `tokens` fence right after a `cpp run pin` block (see app/markdown.js), which
// stores the parsed spec array on the pin and passes it to attachScrubber -> attachTokenCards.
import { el } from "./dom.js";
import { inline } from "./markdown.js";

const LIVE = new Set(); // closeCard callbacks of mounted instances
document.addEventListener("keydown", (e) => { if (e.key === "Escape") LIVE.forEach((f) => f()); });
document.addEventListener("scroll", () => LIVE.forEach((f) => f()), true);

const IDENT = /[A-Za-z0-9_]/;

/** All identifier-boundary-respecting occurrences of `needle` in `hay`: [{ start, end }, …]. */
function boundedIndices(hay, needle) {
  const hits = [];
  let from = 0;
  while (true) {
    const i = hay.indexOf(needle, from);
    if (i < 0) break;
    const before = i > 0 ? hay[i - 1] : "";
    const after = hay[i + needle.length] || "";
    const leftOk = !(IDENT.test(before) && IDENT.test(needle[0]));
    const rightOk = !(IDENT.test(after) && IDENT.test(needle[needle.length - 1]));
    if (leftOk && rightOk) hits.push({ start: i, end: i + needle.length });
    from = i + 1;
  }
  return hits;
}

/** Flattens all text nodes under `row` into one string, remembering where each node sits. */
function flattenRow(row) {
  const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let text = "";
  let n;
  while ((n = walker.nextNode())) {
    nodes.push({ node: n, start: text.length, end: text.length + n.nodeValue.length });
    text += n.nodeValue;
  }
  return { text, nodes };
}

function pointFor(nodes, offset) {
  for (const rec of nodes) if (offset >= rec.start && offset <= rec.end) return { node: rec.node, offset: offset - rec.start };
  return null;
}

/**
 * Wraps the flattened-text range [start, end) of `row` in a `.tok-card` span, even when that
 * range crosses the syntax highlighter's own spans (Range.extractContents splits/rejoins them).
 */
function wrapRange(row, nodes, start, end, idx) {
  const s = pointFor(nodes, start), e = pointFor(nodes, end);
  if (!s || !e) return;
  const range = document.createRange();
  range.setStart(s.node, s.offset);
  range.setEnd(e.node, e.offset);
  const span = document.createElement("span");
  span.className = "tok-card";
  span.tabIndex = 0;
  span.dataset.tokIdx = String(idx);
  span.appendChild(range.extractContents());
  range.insertNode(span);
}

/** Attaches token cards to a pinned runner's live editor. `cards` is the parsed `tokens` fence. */
export function attachTokenCards(handle, cards) {
  if (!Array.isArray(cards) || !cards.length) return;

  function rewrap() {
    const rows = handle.lines();
    rows.forEach((row, rowIdx) => {
      const { text, nodes } = flattenRow(row);
      const hits = [];
      cards.forEach((spec, idx) => {
        if (spec.line && spec.line - 1 !== rowIdx) return;
        for (const h of boundedIndices(text, spec.token)) hits.push({ ...h, idx });
      });
      // Wrap right-to-left so each match's captured node/offset stays valid for matches to its left.
      hits.sort((a, b) => b.start - a.start);
      for (const h of hits) wrapRange(row, nodes, h.start, h.end, h.idx);
    });
  }

  function boundedReplace(text, token, repl, firstOnly) {
    const hits = boundedIndices(text, token);
    if (!hits.length) return null;
    const use = firstOnly ? hits.slice(0, 1) : hits;
    let out = "", cursor = 0;
    for (const h of use) { out += text.slice(cursor, h.start) + repl; cursor = h.end; }
    return out + text.slice(cursor);
  }

  function doSwap(spec) {
    const code = handle.editor.getValue();
    let next = null;
    if (spec.line) {
      const lines = code.split("\n");
      const replaced = lines[spec.line - 1] == null ? null : boundedReplace(lines[spec.line - 1], spec.token, spec.swap.with, true);
      if (replaced != null) { lines[spec.line - 1] = replaced; next = lines.join("\n"); }
    } else {
      next = boundedReplace(code, spec.token, spec.swap.with, false);
    }
    if (next == null) return;
    handle.editor.setValue(next);
    rewrap();
    handle.el.querySelector(".run-btn")?.click();
  }

  let openState = null; // { card, span }
  function closeCard() {
    if (!openState) return;
    openState.card.remove();
    openState.span.classList.remove("active");
    openState = null;
  }
  // Document-level handlers are registered once; each instance subscribes and is dropped when
  // its editor leaves the DOM, so navigating between lessons does not accumulate listeners.
  LIVE.add(closeCard);
  const gone = new MutationObserver(() => { if (!handle.el.isConnected) { LIVE.delete(closeCard); gone.disconnect(); } });
  gone.observe(document.getElementById("content") || document.body, { childList: true, subtree: false });
  function positionCard(card, anchor) {
    document.body.append(card);
    const r = anchor.getBoundingClientRect();
    const w = card.offsetWidth;
    let left = r.left + window.scrollX;
    if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
    if (left < 8) left = 8;
    card.style.left = left + "px";
    card.style.top = r.bottom + window.scrollY + 6 + "px";
  }
  function openFor(span, spec) {
    closeCard();
    span.classList.add("active");
    const card = el("div", "tok-card-pop");
    const story = el("div", "tok-card-story");
    story.innerHTML = inline(spec.story || "");
    card.append(story);
    if (spec.swap) {
      const btn = el("button", "reset-btn tok-swap-btn", spec.swap.with === "" ? "Try: remove it" : `Try: replace with ${spec.swap.with}`);
      btn.addEventListener("click", () => { doSwap(spec); closeCard(); });
      card.append(btn);
      if (spec.swap.why) {
        const why = el("div", "tok-card-why");
        why.innerHTML = inline(spec.swap.why);
        card.append(why);
      }
    }
    const closeBtn = el("button", "tok-card-close", "\u00d7");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.addEventListener("click", closeCard);
    card.append(closeBtn);
    positionCard(card, span);
    openState = { card, span };
  }

  handle.el.addEventListener("click", (e) => {
    const span = e.target.closest(".tok-card");
    if (!span) return;
    if (openState && openState.span === span) { closeCard(); return; }
    const spec = cards[Number(span.dataset.tokIdx)];
    if (spec) openFor(span, spec);
  });
  handle.el.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList?.contains("tok-card")) {
      e.preventDefault();
      const spec = cards[Number(e.target.dataset.tokIdx)];
      if (spec) openFor(e.target, spec);
    }
  });

  rewrap();
  handle.editor.onChange(rewrap);
  handle.el.querySelector(".reset-btn")?.addEventListener("click", rewrap);
}
