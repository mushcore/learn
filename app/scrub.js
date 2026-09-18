// "Scrub the execution": a slider under a pinned runner. Dragging it highlights the current line,
// shows the variables at that step, and lights the prose paragraph that quotes that line.
// Also links each line of program output back to the `cout` statement that produced it.
import { el } from "./dom.js";
import { traceProgram } from "./trace.js";
import { attachTokenCards } from "./tokencards.js";

const norm = (s) => s.replace(/\s+/g, " ").trim();

/**
 * Attaches a scrubber to a pinned runner. `handle` = { el, editor, lines() }; `scope` = the prose
 * element whose `code.ref` spans point at lines; `stdinInput` = the runner's stdin field;
 * `tokens` = optional parsed `tokens` fence spec array (click-a-token cards on the live code).
 */
export function attachScrubber(handle, scope, stdinInput, tokens) {
  attachTokenCards(handle, tokens);
  const bar = el("div", "scrub");
  const btn = el("button", "reset-btn", "Trace");
  btn.title = "Run with a tracer and step through every line";
  const slider = document.createElement("input");
  slider.type = "range"; slider.min = 0; slider.max = 0; slider.value = 0; slider.disabled = true; slider.className = "scrub-slider";
  const pos = el("span", "scrub-pos", "");
  const prevB = el("button", "reset-btn scrub-step", "←"), nextB = el("button", "reset-btn scrub-step", "→");
  prevB.disabled = nextB.disabled = true;
  const vars = el("div", "scrub-vars");
  const note = el("div", "scrub-note", "Trace runs your current code and records every variable after every line. Drag to scrub; ← → step.");
  bar.append(btn, prevB, slider, nextB, pos);
  handle.el.append(bar, vars, note);

  let steps = [], prevVars = {};
  const rows = () => handle.lines();
  function paint(k) {
    const step = steps[k]; if (!step) return;
    rows().forEach((r) => r.classList.remove("cur", "hot"));
    const row = rows()[step.line - 1];
    if (row) { row.classList.add("cur"); row.scrollIntoView({ block: "nearest" }); }
    pos.textContent = `step ${k + 1} / ${steps.length} · line ${step.line}`;
    vars.innerHTML = "";
    const names = Object.keys(step.vars);
    if (!names.length) vars.append(el("span", "scrub-empty", "no variables yet"));
    for (const n of names) {
      const cell = el("span", "scrub-var" + (prevVars[n] !== undefined && prevVars[n] !== step.vars[n] ? " changed" : prevVars[n] === undefined ? " new" : ""));
      cell.innerHTML = `<b>${n}</b> = <code>${step.vars[n].replace(/</g, "&lt;")}</code>`;
      vars.append(cell);
    }
    prevVars = step.vars;
    // light the prose that quotes this line
    scope.querySelectorAll("code.ref.cur").forEach((s) => s.classList.remove("cur"));
    const lineIdx = String(step.line - 1);
    scope.querySelectorAll("code.ref").forEach((s) => { if ((s.dataset.lines || "").split(",").includes(lineIdx)) s.classList.add("cur"); });
    prevB.disabled = k === 0; nextB.disabled = k === steps.length - 1;
  }
  async function trace() {
    btn.disabled = true; btn.textContent = "Tracing…"; note.textContent = "";
    const stdin = (stdinInput?.value || "").replace(/\\n/g, "\n");
    const t = await traceProgram(handle.editor.getValue(), stdin);
    btn.disabled = false; btn.textContent = "Trace";
    if (!t.ok) { note.textContent = t.error; return; }
    steps = t.steps; prevVars = {};
    slider.max = Math.max(0, steps.length - 1); slider.value = 0; slider.disabled = steps.length < 2;
    paint(0);
    note.textContent = steps.length ? "" : "The program produced no trace steps.";
    linkOutput(handle, t.stdout);
  }
  btn.addEventListener("click", trace);
  slider.addEventListener("input", () => paint(Number(slider.value)));
  prevB.addEventListener("click", () => { slider.value = Math.max(0, Number(slider.value) - 1); paint(Number(slider.value)); });
  nextB.addEventListener("click", () => { slider.value = Math.min(steps.length - 1, Number(slider.value) + 1); paint(Number(slider.value)); });
  handle.el.addEventListener("keydown", (e) => { if (steps.length && (e.key === "ArrowLeft" || e.key === "ArrowRight") && e.target === slider) { /* native */ } });
  return { trace };
}

/**
 * Output ↔ code: for each line of stdout, find the `cout` statement whose string literals occur in it
 * (in order), and link both ways on hover. Purely static matching; good for Week 1 programs.
 */
export function linkOutput(handle, stdout) {
  const outEl = handle.el.querySelector(".runner-output");
  if (!outEl) return;
  const stdoutEl = outEl.querySelector(".stdout-text");
  if (!stdoutEl) return;
  const coutRows = handle.lines().map((r, i) => ({ r, i, text: r.textContent })).filter((x) => /cout\s*<</.test(x.text));
  const lits = (t) => [...t.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g)].map((m) => (m[1] ?? m[2] ?? "").replace(/\\n/g, "").replace(/\\'/g, "'")).filter((s) => s.trim());
  const lines = stdout.replace(/\n$/, "").split("\n");
  stdoutEl.innerHTML = "";
  let cursor = 0; // walk cout rows in order to keep attribution sensible when the same literal repeats
  for (const line of lines) {
    const span = el("span", "out-line", line || " ");
    span.append(document.createTextNode("\n"));
    // best match: first cout row (from cursor) whose literals all appear in this line, else any row
    const candidates = coutRows.map((x) => ({ x, ls: lits(x.text) })).filter((c) => c.ls.length && c.ls.every((l) => line.includes(l)));
    const pick = candidates.find((c) => c.x.i >= cursor) || candidates[0];
    if (pick) {
      cursor = pick.x.i;
      span.classList.add("linked"); span.dataset.line = String(pick.x.i);
      const on = () => { pick.x.r.classList.add("hot"); span.classList.add("hot"); };
      const off = () => { pick.x.r.classList.remove("hot"); span.classList.remove("hot"); };
      span.addEventListener("mouseenter", on); span.addEventListener("mouseleave", off);
      pick.x.r.addEventListener("mouseenter", () => span.classList.add("hot"));
      pick.x.r.addEventListener("mouseleave", () => span.classList.remove("hot"));
    }
    stdoutEl.append(span);
  }
}
