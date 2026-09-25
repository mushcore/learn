import { createEditor } from "./editor.js";

/** POST code+stdin to /api/run; returns the server's result object. */
export async function runCode(code, stdin) {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, stdin }),
  });
  if (!res.ok) throw new Error(`server error ${res.status}`);
  return res.json();
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

export function renderResult(outEl, result) {
  outEl.classList.remove("empty");
  outEl.innerHTML = "";
  if (result.error) {
    outEl.append(el("div", "stderr-text", result.error));
    return;
  }
  if (!result.compile.ok) {
    outEl.append(el("div", "stream-label", "compile error"), el("div", "stderr-text", result.compile.stderr || "(unknown compile error)"));
    return;
  }
  const { run } = result;
  if (result.compile.stderr) {
    outEl.append(el("div", "stream-label", "warnings"), el("div", "warn-text", result.compile.stderr));
  }
  if (run.stdout) outEl.append(el("div", "stream-label", "stdout"), el("div", "stdout-text", run.stdout));
  if (run.stderr) outEl.append(el("div", "stream-label", "stderr"), el("div", "stderr-text", run.stderr));
  if (!run.stdout && !run.stderr) outEl.append(el("div", "stdout-text", "(no output)"));
  const status = run.timedOut ? "fail" : run.code === 0 ? "pass" : "fail";
  outEl.append(el("div", `exit-line ${status}`, run.timedOut ? "Timed out after 5 s. Infinite loop, or waiting for input that never came? Add it to the stdin box." : run.code === 0 ? "Exited with code 0" : `Exited with code ${run.code}`));
}

/**
 * Mounts an editable, runnable C++ block.
 * A leading `// stdin: ...` line in the code pre-fills the stdin box (use \n for newlines).
 */
/**
 * Mounts an editable, runnable C++ block. Directives on leading comment lines:
 *   // stdin: ...      pre-fills the stdin box (\n = Enter)
 *   // predict: ...    asks the student to write the expected output before Run is enabled
 *                      (text after the colon is the prompt; default prompt if empty)
 * Returns { el, editor, lines() } so a pinned section can link references into the live code.
 */
export function mountRunner(container, code, ctx, opts = {}) {
  let initialStdin = "";
  const stdinMatch = code.match(/^\/\/\s*stdin:\s*(.*)$/m);
  if (stdinMatch) { initialStdin = stdinMatch[1]; code = code.replace(/^\/\/\s*stdin:.*\n?/m, ""); }
  let predict = null;
  const predictMatch = code.match(/^\/\/\s*predict:\s*(.*)$/m);
  if (predictMatch) { predict = predictMatch[1].trim() || "What will this print? Write your guess first."; code = code.replace(/^\/\/\s*predict:.*\n?/m, ""); }

  const box = el("div", "runner" + (opts.pinned ? " pinned-runner" : ""));
  const head = el("div", "runner-head");
  const tag = el("span", "lang-tag", opts.title || "C++, editable");
  tag.append(el("kbd", null, "Ctrl+Enter"));
  head.append(tag, el("span", "spacer"));
  const resetBtn = el("button", "reset-btn", "Reset");
  const runBtn = el("button", "run-btn", "Run");
  head.append(resetBtn, runBtn);

  const editor = createEditor(code, "cpp");

  const stdinRow = el("div", "stdin-row");
  const stdinInput = document.createElement("input");
  stdinInput.type = "text";
  stdinInput.placeholder = "input for cin (\\n = Enter)";
  stdinInput.title = "Text fed to cin — separate values with spaces, write \\n for Enter";
  stdinInput.value = initialStdin;
  stdinRow.append(el("label", null, "stdin"), stdinInput);

  let predictBox = null;
  if (predict) {
    predictBox = el("div", "predict-row");
    const ta = document.createElement("textarea");
    ta.className = "predict-input"; ta.rows = 2; ta.placeholder = "your prediction";
    predictBox.append(el("label", null, predict), ta);
    runBtn.disabled = true;
    runBtn.title = "Write a prediction first";
    ta.addEventListener("input", () => { runBtn.disabled = ta.value.trim().length < 1; runBtn.title = runBtn.disabled ? "Write a prediction first" : ""; });
    predictBox._ta = ta;
  }

  const output = el("div", "runner-output empty");
  box.append(head, editor.el, stdinRow);
  if (predictBox) box.append(predictBox);
  box.append(output);
  container.appendChild(box);

  async function run() {
    if (runBtn.disabled) return;
    runBtn.disabled = true;
    runBtn.textContent = "Running…";
    try {
      const stdin = stdinInput.value.replace(/\\n/g, "\n");
      const result = await runCode(editor.getValue(), stdin);
      renderResult(output, result);
      if (result.run && opts.pinned) { const { linkOutput } = await import("./scrub.js"); linkOutput({ el: box, lines: () => editor.lineRows() }, result.run.stdout); }
      if (predictBox && result.run) {
        const guess = predictBox._ta.value.trim().split("\n").map((l) => l.trimEnd()).join("\n");
        const actual = result.run.stdout.trim().split("\n").map((l) => l.trimEnd()).join("\n");
        const verdict = el("div", "predict-verdict " + (guess === actual ? "pass" : "fail"), guess === actual ? "Your prediction matched." : "Different from your prediction — compare line by line, then read the explanation again.");
        output.append(verdict);
      }
    } catch (e) {
      output.classList.remove("empty");
      output.innerHTML = "";
      output.append(el("div", "stderr-text", String(e.message || e)));
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = "Run";
    }
  }
  runBtn.addEventListener("click", run);
  editor.el.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); });
  resetBtn.addEventListener("click", () => editor.setValue(code));
  return { el: box, editor, lines: () => editor.lineRows() };
}
