// Before/after diff toggle for a pinned runnable program.
//
// A `cpp run pin` block can be followed immediately by a `cpp diff <title>` fence holding an
// "after" variant of the same program. markdown.js stores that as `pin.diff = { title, code,
// nocompile }` and calls `attachDiff(handle, diff, prose)` once the pin section is flushed.
// This module adds a [Before] [After] toggle to the runner head; switching state swaps the
// editor text via `handle.editor.setValue` and briefly marks the lines that changed. Prose
// elements with `data-state="before"`/`"after"` (author `:::before` / `:::after` callouts) are
// dimmed when their state is not the active one.
import { el } from "./dom.js";

const STRIP_DIRECTIVES = /^\/\/\s*(stdin|predict):.*\n?/gm;

/** Diffs two line arrays (trimmed comparison) via a classic LCS DP. Returns the set of line
 * indices in `a` that were removed and the set of indices in `b` that were added. */
function diffLines(a, b) {
  const ta = a.map((l) => l.trim());
  const tb = b.map((l) => l.trim());
  const n = ta.length, m = tb.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = ta[i] === tb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const delA = new Set(), addB = new Set();
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (ta[i] === tb[j]) { i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { delA.add(i); i++; }
    else { addB.add(j); j++; }
  }
  while (i < n) delA.add(i++);
  while (j < m) addB.add(j++);
  return { delA, addB };
}

/**
 * `handle` = { el, editor, lines() } from mountRunner. `diff` = { title, code, nocompile }.
 * `prose` = the `.pin-prose` element whose `[data-state]` callouts follow this pin's active state.
 */
export function attachDiff(handle, diff, prose) {
  const head = handle.el.querySelector(".runner-head");
  const spacer = handle.el.querySelector(".spacer");
  if (!head) return;

  const beforeCode = handle.editor.getValue();
  const afterCode = diff.code.replace(STRIP_DIRECTIVES, "");
  const { delA, addB } = diffLines(beforeCode.split("\n"), afterCode.split("\n"));

  const toggle = el("div", "diff-toggle");
  const beforeBtn = el("button", "diff-btn active", "Before");
  const afterBtn = el("button", "diff-btn", "After");
  beforeBtn.type = "button"; afterBtn.type = "button";
  toggle.append(beforeBtn, afterBtn);
  if (spacer) head.insertBefore(toggle, spacer); else head.appendChild(toggle);

  if (prose) prose.dataset.diffState = "before";

  let state = "before";
  let flashTimer = null;

  function mark(indices) {
    const rows = handle.lines();
    const cls = state === "after" ? "diff-add" : "diff-del";
    indices.forEach((idx) => rows[idx]?.classList.add(cls));
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => rows.forEach((r) => r.classList.remove("diff-add", "diff-del")), 600);
  }

  function setState(next) {
    if (next === state) return;
    state = next;
    beforeBtn.classList.toggle("active", state === "before");
    afterBtn.classList.toggle("active", state === "after");
    handle.editor.setValue(state === "after" ? afterCode : beforeCode);
    // setValue() does not fire an `input` event; dispatch one so reference relinking (which
    // listens for editor changes) picks up the swapped code.
    handle.editor.textarea.dispatchEvent(new Event("input", { bubbles: true }));
    mark(state === "after" ? addB : delA);
    if (prose) prose.dataset.diffState = state;
  }

  beforeBtn.addEventListener("click", () => setState("before"));
  afterBtn.addEventListener("click", () => setState("after"));
}
