// Trace-by-hand question type.
//
// The student is shown the program (static, numbered) and must type the sequence of values a
// named variable takes across execution — one input per authored step. Grading compares the
// typed sequence to the author's `steps`. After grading, the engine re-runs the program through
// the real tracer (`traceProgram`) and reveals the actual value + source line for each step,
// lighting that code row on hover: the reveal IS the lesson, not just a pass/fail mark.
import { el } from "./dom.js";
import { highlight } from "./highlight.js";
import { traceProgram } from "./trace.js";
import { registerQuestionType } from "./quiz.js";

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

/** Distinct-value changes of `varName` across trace steps, in execution order (first appearance counts). */
function changesOf(steps, varName) {
  const out = [];
  let have = false;
  let prev;
  for (const s of steps) {
    if (!(varName in s.vars)) continue;
    const v = s.vars[varName];
    if (!have || v !== prev) { out.push({ line: s.line, value: v }); prev = v; have = true; }
  }
  return out;
}

function buildCode(code) {
  const wrap = el("div", "trace-code");
  code.replace(/\s+$/, "").split("\n").forEach((text, i) => {
    const row = el("div", "pl");
    row.dataset.line = String(i + 1);
    row.innerHTML = `<span class="ln">${i + 1}</span><span class="lc">${highlight("cpp", text) || " "}</span>`;
    wrap.append(row);
  });
  return wrap;
}

registerQuestionType("trace", (qEl, spec, ctx) => {
  // The engine already dropped a plain `.q-code` preview before delegating to us; we own the
  // code display for this type (numbered, hover-linkable), so replace it.
  const existingCode = qEl.querySelector(".q-code");
  if (existingCode) existingCode.remove();

  const box = el("div", "trace-box");
  const codeEl = buildCode(spec.code);
  const rowsOf = () => [...codeEl.querySelectorAll(".pl")];
  const lightLine = (line) => {
    rowsOf().forEach((r) => r.classList.remove("hot"));
    const row = rowsOf()[line - 1];
    if (row) row.classList.add("hot");
  };
  const clearLight = () => rowsOf().forEach((r) => r.classList.remove("hot"));

  const side = el("div", "trace-side");
  side.append(el("div", "q-note", `Type the value \`${spec.var}\` holds after each step that changes it.`));
  const inputs = spec.steps.map((_, i) => {
    const row = el("div", "trace-input-row");
    row.append(el("label", "trace-input-label", `after step ${i + 1}`));
    const input = document.createElement("input");
    input.type = "text";
    input.className = "q-input";
    input.autocomplete = "off";
    input.spellcheck = false;
    row.append(input);
    side.append(row);
    return input;
  });
  const reveal = el("div", "trace-reveal");
  side.append(reveal);

  box.append(codeEl, side);
  qEl.append(box);

  // Sanity-check the authored steps once, on mount, against a real run (console.warn only — the
  // question still uses the authored steps as the answer key so grading stays deterministic).
  traceProgram(spec.code, spec.stdin || "").then((t) => {
    if (!t.ok) { console.warn(`trace question "${spec.q}": tracer could not run the program — ${t.error}`); return; }
    const real = changesOf(t.steps, spec.var).map((c) => c.value);
    const authored = spec.steps.map((s) => String(s).trim());
    if (JSON.stringify(real) !== JSON.stringify(authored)) {
      console.warn(`trace question "${spec.q}": authored steps ${JSON.stringify(authored)} for "${spec.var}" disagree with the real sequence ${JSON.stringify(real)}`);
    }
  });

  return () => {
    const expected = spec.steps.map((s) => norm(s));
    const given = inputs.map((inp) => norm(inp.value));
    const ok = expected.length === given.length && expected.every((v, i) => v === given[i]);
    inputs.forEach((inp, i) => {
      inp.disabled = true;
      inp.classList.add(given[i] === expected[i] ? "correct" : "incorrect");
    });

    reveal.innerHTML = "";
    reveal.append(el("div", "trace-reveal-head", "Tracing the real program…"));
    traceProgram(spec.code, spec.stdin || "").then((t) => {
      reveal.innerHTML = "";
      if (!t.ok) { reveal.append(el("div", "q-note", t.error)); return; }
      const changes = changesOf(t.steps, spec.var);
      reveal.append(el("div", "trace-reveal-head", `Real trace of \`${spec.var}\``));
      changes.forEach((c, i) => {
        const item = el("div", "trace-reveal-row");
        item.tabIndex = 0;
        item.innerHTML = `<b>${i + 1}.</b> <code>${spec.var} = ${c.value}</code><span class="trace-reveal-line">line ${c.line}</span>`;
        item.addEventListener("mouseenter", () => lightLine(c.line));
        item.addEventListener("mouseleave", clearLight);
        item.addEventListener("focus", () => lightLine(c.line));
        item.addEventListener("blur", clearLight);
        reveal.append(item);
      });
      if (!changes.length) reveal.append(el("div", "q-note", `The tracer never saw \`${spec.var}\` change.`));
    });

    return ok;
  };
});
