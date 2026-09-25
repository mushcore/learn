// Question type "spotbug": code shown as clickable numbered rows; student clicks
// the line(s) that are the bug (or the fix location). Multi-select when
// spec.answer is an array. Graded by exact set match.
import { registerQuestionType } from "./quiz.js";
import { highlight } from "./highlight.js";

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

registerQuestionType("spotbug", (qEl, spec) => {
  const answer = new Set([].concat(spec.answer).map(Number));
  const lines = String(spec.code).replace(/\n$/, "").split("\n");
  const selected = new Set();

  const box = el("div", "spotbug-code");
  const rows = lines.map((line, i) => {
    const lineNo = i + 1;
    const row = el("div", "spotbug-line");
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-pressed", "false");
    row.append(el("span", "spotbug-num", String(lineNo)));
    const src = el("span", "spotbug-src");
    src.innerHTML = highlight(spec.lang || "cpp", line) || "\u00a0";
    row.append(src);
    const toggle = () => {
      if (row.classList.contains("done")) return;
      if (selected.has(lineNo)) {
        selected.delete(lineNo);
        row.classList.remove("picked");
        row.setAttribute("aria-pressed", "false");
      } else {
        selected.add(lineNo);
        row.classList.add("picked");
        row.setAttribute("aria-pressed", "true");
      }
    };
    row.addEventListener("click", toggle);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
    box.append(row);
    return row;
  });
  qEl.append(box);
  qEl.append(el("div", "q-note", answer.size > 1 ? "Click every line involved." : "Click the line."));

  return () => {
    const ok = selected.size === answer.size && [...selected].every((s) => answer.has(s));
    rows.forEach((row, i) => {
      const lineNo = i + 1;
      row.classList.add("done");
      row.tabIndex = -1;
      row.setAttribute("aria-disabled", "true");
      if (answer.has(lineNo)) row.classList.add("correct");
      else if (selected.has(lineNo)) row.classList.add("incorrect");
    });
    return ok;
  };
});
