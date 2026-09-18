import { createEditor } from "./editor.js";
import { runCode } from "./runner.js";
import { markLessonScore } from "./progress.js";

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/**
 * Challenge schema: { prompt, starter, expected, hints?: string[], stdin?: string }
 * Graded by trimmed stdout equality against `expected` (whitespace-normalised).
 */
export function mountChallenge(container, spec, ctx) {
  const box = el("div", "challenge-box");
  box.append(el("div", "challenge-head", "Challenge"));
  const prompt = el("div", "challenge-prompt");
  prompt.innerHTML = spec.prompt;
  box.append(prompt);

  const head = el("div", "runner-head");
  head.append(el("span", "lang-tag", "Your solution"), el("span", "spacer"));
  const showBtn = spec.solution ? el("button", "reset-btn", "Show solution") : null;
  const runBtn = el("button", "run-btn", "Check");
  if (showBtn) head.append(showBtn);
  head.append(runBtn);

  const editor = createEditor(spec.starter || "", "cpp");
  const output = el("div", "runner-output empty");
  const hints = el("div", "hints");
  (spec.hints || []).forEach((h, i) => {
    const d = document.createElement("details");
    d.innerHTML = `<summary>Hint ${i + 1}</summary><div></div>`;
    d.querySelector("div").innerHTML = h;
    hints.appendChild(d);
  });
  box.append(head, editor.el, output, hints);
  container.appendChild(box);

  const norm = (s) => String(s).trim().split("\n").map((l) => l.trimEnd()).join("\n");

  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    runBtn.textContent = "Checking…";
    try {
      const result = await runCode(editor.getValue(), spec.stdin || "");
      output.classList.remove("empty");
      output.innerHTML = "";
      if (result.error) { output.append(el("div", "stderr-text", result.error)); return; }
      if (!result.compile.ok) {
        output.append(el("div", "stream-label", "compile error"), el("div", "stderr-text", result.compile.stderr));
        return;
      }
      const actual = norm(result.run.stdout);
      const expected = norm(spec.expected);
      const pass = actual === expected;
      output.append(el("div", "stream-label", "your stdout"), el("div", "stdout-text", result.run.stdout || "(empty)"));
      if (!pass) output.append(el("div", "stream-label", "expected"), el("div", "stdout-text", expected));
      output.append(el("div", `exit-line ${pass ? "pass" : "fail"}`, pass ? "Correct" : "Output does not match yet"));
      if (pass && ctx && ctx.lessonId) { markLessonScore(ctx.lessonId, "challenge", true); if (ctx.onProgress) ctx.onProgress(); }
    } catch (e) {
      output.classList.remove("empty");
      output.innerHTML = "";
      output.append(el("div", "stderr-text", String(e.message || e)));
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Check";
    }
  });
  if (showBtn) showBtn.addEventListener("click", () => editor.setValue(spec.solution));
}
