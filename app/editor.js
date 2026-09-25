import { highlight } from "./highlight.js";

/**
 * Minimal syntax-highlighted textarea editor. The highlight overlay is one row per line
 * (`.el-line[data-line]`) so reference linking can light up lines of live, editable code.
 * Returns { el, getValue, setValue, lineRows() }.
 */
export function createEditor(initialCode, lang = "cpp") {
  const wrap = document.createElement("div");
  wrap.className = "editor-wrap";

  const pre = document.createElement("pre");
  pre.className = "highlight";

  const textarea = document.createElement("textarea");
  textarea.spellcheck = false;
  textarea.value = initialCode;

  // The editor is always as tall as its content, so there is never a vertical scrollbar. When a
  // long line brings in a horizontal scrollbar, leave room for it so the last line is not covered.
  function fit() {
    textarea.style.height = "auto";
    const hbar = textarea.scrollWidth > textarea.clientWidth ? 20 : 0;
    textarea.style.height = textarea.scrollHeight + 4 + hbar + "px";
  }
  function sync() {
    const lines = textarea.value.split("\n");
    pre.innerHTML = lines.map((l, i) => `<div class="el-line" data-line="${i + 1}">${highlight(lang, l) || " "}</div>`).join("") + "\n";
    fit();
  }
  textarea.addEventListener("input", sync);
  textarea.addEventListener("scroll", () => {
    pre.scrollTop = textarea.scrollTop;
    pre.scrollLeft = textarea.scrollLeft;
  });
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart, end = textarea.selectionEnd;
      textarea.value = textarea.value.slice(0, start) + "    " + textarea.value.slice(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      sync();
    }
  });

  wrap.appendChild(pre);
  wrap.appendChild(textarea);
  sync();
  requestAnimationFrame(fit);
  // Lines soft-wrap, so the content height depends on the width: re-measure whenever the editor
  // gets narrower or wider (window resize, sidebar toggle, layout change) and once web fonts land.
  if (window.ResizeObserver) {
    let lastWidth = 0;
    new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (w !== lastWidth) { lastWidth = w; fit(); }
    }).observe(wrap);
  }
  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  return {
    el: wrap,
    textarea,
    getValue: () => textarea.value,
    setValue: (v) => { textarea.value = v; sync(); },
    lineRows: () => [...pre.querySelectorAll(".el-line")],
    onChange: (fn) => textarea.addEventListener("input", fn),
  };
}
