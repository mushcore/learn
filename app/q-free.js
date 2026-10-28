// Question type "free": a written answer the student marks against a model.
// Spec: { type: "free", q, model, points: ["…", …], rows?: 4, explain }.
// Reveal unlocks at 10 non-space characters and shows the model answer and one checkbox
// per point ("Tick what your answer covered"); Score locks the ticks. Correct when ticks
// reach ceil(0.6 × points). "Check answers" before Reveal counts the item as missed.
import { registerQuestionType } from "./quiz.js";
import { inline } from "./markdown.js";

const inlineMd = (s) => String(s).split("\n").map(inline).join("<br/>");

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

const MIN_CHARS = 10;

registerQuestionType("free", (qEl, spec) => {
  const points = Array.isArray(spec.points) ? spec.points : [];
  const need = Math.ceil(0.6 * points.length);

  const ta = document.createElement("textarea");
  ta.className = "free-answer";
  ta.rows = spec.rows || 4;
  ta.placeholder = "Write your answer, then reveal the model answer.";
  const actions = el("div", "free-actions");
  const reveal = el("button", "reset-btn", "Reveal model answer");
  reveal.type = "button";
  reveal.disabled = true;
  const hint = el("span", "q-note", `Write at least ${MIN_CHARS} characters to reveal.`);
  actions.append(reveal, hint);

  const model = el("div", "free-model");
  model.hidden = true;
  const pointsBox = el("div", "free-points");
  pointsBox.hidden = true;
  const boxes = points.map((p) => {
    const label = el("label", "quiz-opt");
    const input = document.createElement("input");
    input.type = "checkbox";
    const span = el("span");
    span.innerHTML = inlineMd(p);
    label.append(input, span);
    return { label, input };
  });
  const scoreBtn = el("button", "reset-btn", "Score");
  scoreBtn.type = "button";
  const tally = el("span", "q-verdict");
  if (points.length) {
    pointsBox.append(el("div", "free-points-head", "Tick what your answer covered"));
    boxes.forEach((b) => pointsBox.append(b.label));
    const row = el("div", "free-actions");
    row.append(scoreBtn, tally);
    pointsBox.append(row);
  }
  qEl.append(ta, actions, model, pointsBox);

  const written = () => ta.value.replace(/\s/g, "").length >= MIN_CHARS;
  ta.addEventListener("input", () => {
    reveal.disabled = !written();
    hint.style.display = reveal.disabled ? "" : "none";
  });

  let revealed = false, scored = false;
  const showModel = () => {
    revealed = true;
    reveal.disabled = true;
    reveal.style.display = "none";
    hint.style.display = "none";
    model.innerHTML = `<div class="free-model-head">Model answer</div>${inlineMd(spec.model || "")}`;
    model.hidden = false;
    pointsBox.hidden = false;
  };
  const ticks = () => boxes.filter((b) => b.input.checked).length;
  const lock = () => {
    scored = true;
    ta.readOnly = true;
    boxes.forEach((b) => { b.input.disabled = true; });
    scoreBtn.disabled = true;
    const ok = ticks() >= need;
    tally.textContent = `${ticks()} of ${points.length} points (${need} needed)`;
    tally.className = "q-verdict " + (ok ? "pass" : "fail");
    ta.classList.add(ok ? "correct" : "incorrect");
    return ok;
  };
  reveal.addEventListener("click", () => { if (written()) showModel(); });
  scoreBtn.addEventListener("click", lock);

  return () => {
    if (!revealed) {
      // Graded before the student marked it: show the model so the explanation makes sense.
      showModel();
      ta.readOnly = true;
      boxes.forEach((b) => { b.input.disabled = true; });
      scoreBtn.disabled = true;
      tally.textContent = "not marked: write an answer, reveal and tick before checking";
      tally.className = "q-verdict fail";
      return false;
    }
    return scored ? ticks() >= need && points.length > 0 : lock() && points.length > 0;
  };
});
