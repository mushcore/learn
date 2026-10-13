import { markLessonScore, markLessonDone, lessonState, recordAnswer } from "./progress.js";
import { inline } from "./markdown.js";

/**
 * Quiz schema: array of questions
 *   { q, options: [..], answer: idx | idx[], explain }          MCQ / multi-select
 *   { q, type: "numeric", answer: number, tolerance?: number, unit?: string, explain }
 *   { q, type: "tf", answer: true|false, explain }
 *   { q, type: "text", answer: "string" | ["alt1","alt2"], explain }   case-insensitive trimmed match
 * A question may have `image` (URL) or `code` (string) shown under the prompt.
 */

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function inlineMd(s) {
  return String(s).split("\n").map(inline).join("<br/>");
}

let quizCounter = 0;

/**
 * Registry for interactive question types. A plugin is `(qEl, spec, ctx) => grader` where
 * `grader()` returns true/false and marks its own UI (`correct`/`incorrect` classes).
 */
export const QUESTION_TYPES = {};
export function registerQuestionType(name, fn) { QUESTION_TYPES[name] = fn; }

export function mountQuiz(container, questions, ctx) {
  const box = el("div", "quiz-box");
  const quizId = `quiz-${++quizCounter}`;
  const h = el("h4", null, "Check yourself");
  h.append(el("span", "count", `${questions.length} question${questions.length === 1 ? "" : "s"}`));
  box.append(h);

  const graders = [];

  questions.forEach((spec, qi) => {
    const qEl = el("div", "quiz-q");
    const head = el("div", "q-text");
    head.innerHTML = `<span class="q-num">${qi + 1}.</span> ${inlineMd(spec.q)}`;
    qEl.append(head);
    if (spec.code) {
      const pre = el("pre", "q-code", spec.code);
      qEl.append(pre);
    }
    const type = spec.type || (Array.isArray(spec.answer) ? "multi" : "mcq");
    const explain = el("div", "quiz-explain");
    explain.innerHTML = inlineMd(spec.explain || "");

    if (type === "mcq" || type === "multi") {
      const name = `${quizId}-q${qi}`;
      const opts = spec.options.map((opt, oi) => {
        const label = el("label", "quiz-opt");
        const input = document.createElement("input");
        input.type = type === "multi" ? "checkbox" : "radio";
        input.name = name;
        input.value = oi;
        const span = el("span");
        span.innerHTML = inlineMd(opt);
        label.append(input, span);
        return { label, input, oi };
      });
      // Options are shown in a random order (the file order would otherwise give the answer away);
      // `"shuffle": false` keeps the file order for options that must stay in sequence.
      const order = opts.slice();
      if (spec.shuffle !== false) {
        for (let k = order.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1));
          [order[k], order[j]] = [order[j], order[k]];
        }
      }
      for (const o of order) qEl.append(o.label);
      if (type === "multi") qEl.append(el("div", "q-note", "Select all that apply."));
      graders.push(() => {
        const correct = new Set(Array.isArray(spec.answer) ? spec.answer : [spec.answer]);
        let chosen = new Set(opts.filter((o) => o.input.checked).map((o) => o.oi));
        let ok = chosen.size === correct.size && [...chosen].every((c) => correct.has(c));
        for (const o of opts) {
          o.input.disabled = true;
          o.label.classList.remove("correct", "incorrect");
          if (correct.has(o.oi)) o.label.classList.add("correct");
          else if (chosen.has(o.oi)) o.label.classList.add("incorrect");
        }
        return ok;
      });
    } else if (type === "tf") {
      const name = `${quizId}-q${qi}`;
      const opts = [true, false].map((v) => {
        const label = el("label", "quiz-opt");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = name;
        input.value = String(v);
        label.append(input, el("span", null, v ? "True" : "False"));
        qEl.append(label);
        return { label, input, v };
      });
      graders.push(() => {
        const chosenOpt = opts.find((o) => o.input.checked);
        let ok = !!chosenOpt && chosenOpt.v === spec.answer;
        for (const o of opts) {
          o.input.disabled = true;
          if (o.v === spec.answer) o.label.classList.add("correct");
          else if (o.input.checked) o.label.classList.add("incorrect");
        }
        return ok;
      });
    } else if (type === "numeric" || type === "text") {
      const row = el("div", "q-input-row");
      const input = document.createElement("input");
      input.type = "text";
      input.className = "q-input";
      input.placeholder = type === "numeric" ? "your answer" : "type your answer";
      row.append(input);
      if (spec.unit) row.append(el("span", "q-unit", spec.unit));
      const verdict = el("span", "q-verdict");
      row.append(verdict);
      qEl.append(row);
      graders.push(() => {
        let ok;
        const raw = input.value.trim();
        if (type === "numeric") {
          const val = parseFloat(raw.replace(/[%,$]/g, ""));
          const tol = spec.tolerance ?? Math.max(Math.abs(spec.answer) * 0.005, 0.005);
          ok = Number.isFinite(val) && Math.abs(val - spec.answer) <= tol;
        } else {
          const answers = (Array.isArray(spec.answer) ? spec.answer : [spec.answer]).map((a) => String(a).trim().toLowerCase());
          ok = answers.includes(raw.toLowerCase());
        }
        input.disabled = true;
        input.classList.add(ok ? "correct" : "incorrect");
        verdict.textContent = ok ? "✓" : `✗ answer: ${Array.isArray(spec.answer) ? spec.answer[0] : spec.answer}${spec.unit ? " " + spec.unit : ""}`;
        verdict.className = "q-verdict " + (ok ? "pass" : "fail");
        return ok;
      });
    } else if (QUESTION_TYPES[type]) {
      graders.push(QUESTION_TYPES[type](qEl, spec, ctx));
    } else {
      qEl.append(el("div", "stat-note", `Unknown question type: ${type}`));
      graders.push(() => false);
    }
    qEl.append(explain);
    box.append(qEl);
  });

  const footer = el("div", "quiz-footer");
  const submit = el("button", "run-btn", "Check answers");
  const retry = el("button", "reset-btn", "Try again");
  retry.style.display = "none";
  const score = el("div", "quiz-score");
  footer.append(submit, score, retry);
  box.append(footer);
  container.appendChild(box);

  submit.addEventListener("click", () => {
    let correct = 0;
    const missed = [];
    const qEls = box.querySelectorAll(".quiz-q");
    const chosenText = (qEl) => {
      const checked = [...qEl.querySelectorAll("input:checked")].map((i) => i.closest("label")?.innerText.replace(/\s*(your answer|correct)$/, "").trim());
      if (checked.length) return checked.join(", ");
      const t = qEl.querySelector(".q-input");
      return t ? (t.value.trim() || "(blank)") : "(blank)";
    };
    graders.forEach((g, i) => {
      const ok = g();
      if (ok) correct++; else missed.push(i);
      // A lesson may hold several quiz blocks; the review queue indexes questions across the whole lesson.
      if (ctx && ctx.lessonId) recordAnswer(ctx.recordAs ? ctx.recordAs[i].lesson : ctx.lessonId, ctx.recordAs ? ctx.recordAs[i].index : (ctx.quizBase || 0) + i, ok, ctx.course);
      qEls[i].classList.add(ok ? "got" : "missed");
      const explain = box.querySelectorAll(".quiz-explain")[i];
      explain.classList.add("show");
    });
    const pct = Math.round((100 * correct) / graders.length);
    const passed = pct >= 80;
    score.textContent = `${correct} / ${graders.length} (${pct}%)`;
    score.className = "quiz-score " + (passed ? "pass" : "fail");
    submit.style.display = "none";
    retry.style.display = "";
    // With several quiz blocks in one lesson, the lesson score is the sum over the blocks answered so far,
    // and the lesson is complete only when every block has been answered and the total is 80% or more.
    const blockCount = (ctx && ctx.quizBlocks) || 1;
    let lessonPassed = passed;
    let blocksLeft = 0;
    if (ctx && ctx.lessonId && !ctx.review) {
      const st = lessonState(ctx.lessonId);
      const blocks = { ...(st.quizBlocks || {}), [ctx.quizBlock || 0]: { score: correct, total: graders.length } };
      const sum = Object.values(blocks).reduce((a, b) => ({ score: a.score + b.score, total: a.total + b.total }), { score: 0, total: 0 });
      blocksLeft = Math.max(0, blockCount - Object.keys(blocks).length);
      lessonPassed = blocksLeft === 0 && sum.total > 0 && sum.score / sum.total >= 0.8;
      if (blockCount > 1) markLessonScore(ctx.lessonId, "quizBlocks", blocks);
      markLessonScore(ctx.lessonId, "quiz", blockCount > 1 ? sum : { score: correct, total: graders.length });
      if (lessonPassed && !lessonState(ctx.lessonId).done) markLessonDone(ctx.lessonId, true);
      if (ctx.onProgress) ctx.onProgress();
    } else if (ctx && ctx.review && ctx.onProgress) ctx.onProgress();
    const summary = el("div", "quiz-summary");
    const msg = el("div", "msg");
    const moreBlocks = blocksLeft ? ` ${blocksLeft} more quiz block${blocksLeft === 1 ? "" : "s"} in this lesson to go.` : "";
    const completeNote = lessonPassed ? " This lesson is marked complete." : (passed && blockCount > 1 ? moreBlocks : "");
    if (missed.length === 0) msg.innerHTML = `<b>All correct.</b>${completeNote}`;
    else if (passed) msg.innerHTML = `<b>Passed.</b>${completeNote} Missed ${missed.length} — the explanations under each are worth a read.`;
    else msg.innerHTML = `<b>Missed ${missed.length} of ${graders.length}.</b> Read the explanations, then try again — 80% marks ${blockCount > 1 ? "this block" : "the lesson"} complete.`;
    summary.append(msg);
    if (missed.length) {
      const review = el("button", "reset-btn", "Jump to first missed");
      review.addEventListener("click", () => qEls[missed[0]].scrollIntoView({ behavior: "smooth", block: "center" }));
      summary.append(review);
    }
    if (ctx && ctx.nextHref) {
      const nextA = el("a", "run-btn", `Next: ${ctx.nextTitle}`);
      nextA.href = ctx.nextHref;
      summary.append(nextA);
    }
    footer.append(summary);
    score.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  retry.addEventListener("click", () => {
    // Rebuild the quiz in place.
    const parent = box.parentNode;
    const next = box.nextSibling;
    box.remove();
    const tmp = document.createElement("div");
    mountQuiz(tmp, questions, ctx);
    parent.insertBefore(tmp.firstChild, next);
  });
}
