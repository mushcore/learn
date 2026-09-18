// Question types `fill` (blank inside code) and `reorder` (drag lines into order).
import { registerQuestionType } from "./quiz.js";
import { highlight } from "./highlight.js";
import { runCode } from "./runner.js";
import { el } from "./dom.js";

const norm = (s) => String(s).replace(/\s+/g, " ").trim();

registerQuestionType("fill", (qEl, spec) => {
  const box = el("div", "q-code fill-code");
  const parts = spec.code.split("___");
  const inputs = [];
  const answers = Array.isArray(spec.answer) ? spec.answer : [spec.answer];
  const width = Math.max(6, ...answers.map((a) => String(a).length)) + 2;
  parts.forEach((p, i) => {
    const s = document.createElement("span"); s.innerHTML = highlight("cpp", p); box.append(s);
    if (i < parts.length - 1) {
      const inp = document.createElement("input"); inp.className = "fill-input"; inp.style.width = width + "ch"; inp.spellcheck = false; inp.setAttribute("aria-label", "fill in the blank");
      box.append(inp); inputs.push(inp);
    }
  });
  const out = el("div", "runner-output empty");
  qEl.append(box);
  const filled = () => { let s = ""; parts.forEach((p, i) => { s += p; if (i < inputs.length) s += inputs[i].value; }); return s; };
  let runBtn = null;
  if (spec.compile) {
    runBtn = el("button", "reset-btn", "Run it");
    runBtn.addEventListener("click", async () => { const r = await runCode(filled(), spec.stdin || ""); out.classList.remove("empty"); out.innerHTML = ""; out.append(el("div", r.compile?.ok ? "stdout-text" : "stderr-text", r.compile?.ok ? (r.run.stdout || "(no output)") : r.compile?.stderr || r.error)); });
    qEl.append(runBtn, out);
  }
  return () => {
    let ok;
    if (spec.compile) {
      // graded synchronously on the last run result if present; otherwise on text match
      const text = out.querySelector(".stdout-text")?.textContent;
      ok = text != null && (spec.expected == null || norm(text) === norm(spec.expected));
      if (text == null) ok = inputs.every((inp) => answers.some((a) => norm(a) === norm(inp.value)));
    } else {
      // single blank: any accepted answer; multiple blanks: answer array in order
      ok = inputs.length === 1 ? answers.some((a) => norm(a) === norm(inputs[0].value)) : inputs.every((inp, i) => norm(answers[i] ?? "") === norm(inp.value));
    }
    inputs.forEach((inp, i) => { inp.disabled = true; inp.classList.add(ok ? "correct" : "incorrect"); if (!ok) inp.title = "expected: " + (inputs.length === 1 ? answers[0] : answers[i]); });
    if (!ok) { const hint = el("div", "q-verdict fail", `expected: ${inputs.length === 1 ? answers[0] : answers.join(" · ")}`); qEl.insertBefore(hint, qEl.querySelector(".quiz-explain")); }
    if (runBtn) runBtn.disabled = true;
    return ok;
  };
});

function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }

registerQuestionType("reorder", (qEl, spec) => {
  const lines = spec.lines.slice();
  const rnd = seeded(lines.join("\n"));
  let order = lines.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  if (order.every((v, i) => v === i)) order.reverse();
  const list = el("div", "reorder-list");
  const out = el("div", "runner-output empty");
  function render() {
    list.innerHTML = "";
    order.forEach((idx, pos) => {
      const row = el("div", "reorder-row"); row.draggable = true; row.dataset.pos = pos;
      const code = el("code"); code.innerHTML = highlight("cpp", lines[idx]) || "&nbsp;";
      const up = el("button", "reset-btn scrub-step", "↑"), dn = el("button", "reset-btn scrub-step", "↓");
      up.disabled = pos === 0; dn.disabled = pos === order.length - 1;
      up.addEventListener("click", () => move(pos, pos - 1)); dn.addEventListener("click", () => move(pos, pos + 1));
      row.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", String(pos)); row.classList.add("dragging"); });
      row.addEventListener("dragend", () => row.classList.remove("dragging"));
      row.addEventListener("dragover", (e) => { e.preventDefault(); row.classList.add("over"); });
      row.addEventListener("dragleave", () => row.classList.remove("over"));
      row.addEventListener("drop", (e) => { e.preventDefault(); row.classList.remove("over"); move(Number(e.dataTransfer.getData("text/plain")), pos); });
      row.append(code, up, dn);
      list.append(row);
    });
  }
  function move(from, to) { if (to < 0 || to >= order.length) return; const [v] = order.splice(from, 1); order.splice(to, 0, v); render(); }
  render();
  qEl.append(list);
  let runBtn = null;
  if (spec.compile) { runBtn = el("button", "reset-btn", "Run it"); runBtn.addEventListener("click", async () => { const r = await runCode(order.map((i) => lines[i]).join("\n"), spec.stdin || ""); out.classList.remove("empty"); out.innerHTML = ""; out.append(el("div", r.compile?.ok ? "stdout-text" : "stderr-text", r.compile?.ok ? (r.run.stdout || "(no output)") : r.compile?.stderr || r.error)); }); qEl.append(runBtn, out); }
  return () => {
    const ok = order.every((v, i) => v === i);
    [...list.children].forEach((row, pos) => { row.draggable = false; row.querySelectorAll("button").forEach((b) => (b.disabled = true)); row.classList.add(order[pos] === pos ? "correct" : "incorrect"); });
    if (!ok) { const sol = el("div", "q-code reorder-solution"); sol.innerHTML = `<div class="stat-label">correct order</div>` + lines.map((l) => highlight("cpp", l)).join("\n"); qEl.insertBefore(sol, qEl.querySelector(".quiz-explain")); }
    if (runBtn) runBtn.disabled = true;
    return ok;
  };
});
