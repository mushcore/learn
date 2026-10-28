// Runnable JavaScript and HTML blocks (COMP 4537): ```js run, ```js run pin <title>,
// ```html run, ```html run pin <title>. Each Run builds a fresh sandboxed iframe
// (sandbox="allow-scripts", srcdoc) that loads a console shim and then the student's code as a
// classic script, so `var` hoisting, `window.a` and top-level `this` behave as in a browser
// page. The shim posts console lines, uncaught errors and its pending-work count to the parent.
// A run ends when no timer/XHR/fetch is pending and 400 ms passed since the last message, or at
// the 6 s cap. Test hook (render checks only): `autorun=1` in location.hash clicks every Run.
import { createEditor } from "./editor.js";
import { serialize, formatArgs, parseDirectives, comparePrediction } from "./jsformat.js";

const QUIET_MS = 400;
const CAP_MS = 6000;

// One in-memory Web Storage per lesson render, shared by every block in the lesson so a writer
// page and a reader page in two blocks see the same "localStorage". Any block's Reset clears it.
const store = { local: new Map(), session: new Map() };
export function resetJsStore() {
  store.local.clear();
  store.session.clear();
}

// ---- the shim that runs inside the iframe, before the student's code ----------------------
// Written as a real function so it is syntax-checked; embedded by source with its config.
function shimMain(cfg, serialize) {
  const post = (m) => { try { parent.postMessage(m, "*"); } catch (e) { /* ignore */ } };
  const NP = Promise;
  const nThen = NP.prototype.then;
  // Reading a logged promise's state attaches a reaction, which marks the promise handled, so
  // a rejection nobody handles would never reach "unhandledrejection". The student's handlers
  // are tracked by wrapping then (catch and finally call it); when a logged promise rejects with
  // none attached, the shim's reaction rethrows, and its derived promise raises the same
  // "Uncaught (in promise)" line, at the same point, that Chrome prints. An `await` on the
  // promise is not seen by the wrapper.
  const handled = new WeakSet(), watched = new WeakSet();
  NP.prototype.then = function (onF, onR) { handled.add(this); return nThen.call(this, onF, onR); };

  // Console lines leave in order. A line holding a promise waits (one microtask) until the
  // promise's state at log time is known: a reaction on an already-settled promise is queued
  // before a reaction on a fresh resolved promise, so whichever fires first tells the state.
  const queue = [];
  const flush = () => { while (queue.length && queue[0].wait === 0) post(queue.shift().msg); };
  function emit(msg, args) {
    const entry = { wait: 0, msg };
    const onPromise = (p, tag) => {
      entry.wait++;
      let decided = false;
      const decide = (state, v) => {
        if (decided) return;
        decided = true;
        tag.__promise = state;
        if (state !== "pending") tag.value = serialize(v, onPromise);
        entry.wait--;
        flush();
      };
      const rethrow = !watched.has(p);
      watched.add(p);
      try {
        nThen.call(p, (v) => decide("fulfilled", v), (e) => { decide("rejected", e); if (rethrow && !handled.has(p)) throw e; });
      } catch (e) { decide("pending"); return; }
      nThen.call(NP.resolve(), () => decide("pending"));
    };
    if (args) msg.args = args.map((a) => { try { return serialize(a, onPromise); } catch (e) { return String(a); } });
    queue.push(entry);
    flush();
  }

  const levels = { log: "log", info: "log", debug: "log", dir: "log", warn: "warn", error: "error" };
  for (const [name, level] of Object.entries(levels)) {
    console[name] = (...args) => emit({ type: "log", level }, args);
  }
  window.alert = (x) => emit({ type: "log", level: "log", prefix: "[alert] " }, [x === undefined ? "" : String(x)]);
  const prompts = cfg.prompts.slice();
  window.prompt = () => (prompts.length ? prompts.shift() : null);

  window.addEventListener("error", (e) => emit({ type: "log", level: "error", text: e.message || "Uncaught error" }));
  window.addEventListener("unhandledrejection", (e) => emit({ type: "log", level: "error", prefix: "Uncaught (in promise) " }, [e.reason]));

  // Pending work: a timer counts until it fires (or is cleared); an interval until cleared;
  // an XHR until loadend; a fetch until it settles.
  let pending = 0;
  const report = () => post({ type: "pending", n: pending });
  const st = window.setTimeout, ct = window.clearTimeout, si = window.setInterval, ci = window.clearInterval;
  const timers = new Set(), intervals = new Set();
  const call = (fn, self, a) => (typeof fn === "function" ? fn.apply(self, a) : (0, eval)(String(fn)));
  window.setTimeout = function (fn, ms, ...a) {
    let id;
    pending++; report();
    id = st.call(window, function () {
      try { return call(fn, this, a); } finally { if (timers.delete(id)) pending--; report(); }
    }, ms);
    timers.add(id);
    return id;
  };
  window.clearTimeout = function (id) { if (timers.delete(id)) { pending--; report(); } return ct.call(window, id); };
  window.setInterval = function (fn, ms, ...a) {
    pending++; report();
    const id = si.call(window, function () { return call(fn, this, a); }, ms);
    intervals.add(id);
    return id;
  };
  window.clearInterval = function (id) { if (intervals.delete(id)) { pending--; report(); } return ci.call(window, id); };
  if (window.XMLHttpRequest) {
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...a) {
      let done = false;
      const finish = () => { if (!done) { done = true; pending--; report(); } };
      pending++; report();
      this.addEventListener("loadend", finish);
      try { return send.apply(this, a); } catch (e) { finish(); throw e; } finally { if (this.readyState === 4) finish(); }
    };
  }
  if (window.fetch) {
    const f = window.fetch;
    window.fetch = function (...a) {
      pending++; report();
      const dec = () => { pending--; report(); };
      return nThen.call(f.apply(this, a), (r) => { dec(); return r; }, (e) => { dec(); throw e; });
    };
  }

  // In-memory Web Storage: a sandboxed iframe throws on the real one. Seeded from the lesson's
  // store; every change is posted back so the next run (or another block) sees it.
  function makeStorage(kind, init) {
    const m = new Map(init);
    const sync = () => post({ type: "storage", kind, entries: [...m] });
    const api = {
      getItem(k) { k = String(k); return m.has(k) ? m.get(k) : null; },
      setItem(k, v) { m.set(String(k), String(v)); sync(); },
      removeItem(k) { m.delete(String(k)); sync(); },
      clear() { m.clear(); sync(); },
      key(i) { const ks = [...m.keys()]; return i < ks.length ? ks[i] : null; },
      get length() { return m.size; },
    };
    return new Proxy(api, {
      get(t, p) { if (p in t) return t[p]; return typeof p === "string" && m.has(p) ? m.get(p) : undefined; },
      set(t, p, v) { if (p in t) return true; m.set(String(p), String(v)); sync(); return true; },
      deleteProperty(t, p) { m.delete(String(p)); sync(); return true; },
      has(t, p) { return p in t || m.has(p); },
      ownKeys() { return [...m.keys()]; },
      getOwnPropertyDescriptor(t, p) { return m.has(p) ? { value: m.get(p), enumerable: true, configurable: true, writable: true } : undefined; },
    });
  }
  try { Object.defineProperty(window, "localStorage", { value: makeStorage("local", cfg.local), configurable: true }); } catch (e) { /* ignore */ }
  try { Object.defineProperty(window, "sessionStorage", { value: makeStorage("session", cfg.session), configurable: true }); } catch (e) { /* ignore */ }

  const hasBody = () => {
    const b = document.body;
    if (!b) return false;
    for (const n of b.childNodes) {
      if (n.nodeName === "SCRIPT") continue;
      if (n.nodeType === 3 && !n.textContent.trim()) continue;
      return true;
    }
    return false;
  };
  // Push the page state whenever it changes, so the parent never has to ask: a query would
  // cost a round trip at the end of every run, and headless Chrome's virtual time drops it.
  let lastBody = false;
  const reportBody = () => { const b = hasBody(); if (b !== lastBody) { lastBody = b; post({ type: "status", hasBody: b }); } };
  new MutationObserver(reportBody).observe(document, { childList: true, subtree: true, characterData: true });
}

const escScript = (s) => s.replace(/<\/script/gi, "<\\/script");
const DONE = `<script>parent.postMessage({type:"sync-done"},"*")</script>`;

function shimTag(prompts) {
  const cfg = { prompts, local: [...store.local], session: [...store.session] };
  // A stored value or prompt holding "</script>" must not end the tag early.
  const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
  return `<script>const SERVER = ${json(location.origin)};\n(${shimMain})(${json(cfg)}, ${serialize});</script>`;
}

/** The iframe document: the shim first, then the student's program (js) or page (html). */
export function buildSrcdoc(code, mode, prompts = []) {
  const shim = shimTag(prompts);
  if (mode !== "html") {
    return `<!doctype html><html><head><meta charset="utf-8">${shim}<script>${escScript(code)}\n</script>${DONE}</head><body></body></html>`;
  }
  let doc = code;
  if (!/<html[\s>]/i.test(doc) && !/<!doctype/i.test(doc)) doc = `<!doctype html><html><head><meta charset="utf-8"></head><body>${doc}</body></html>`;
  const head = /<head[^>]*>/i.exec(doc);
  const htmlTag = /<html[^>]*>/i.exec(doc);
  if (head) doc = doc.slice(0, head.index + head[0].length) + shim + doc.slice(head.index + head[0].length);
  else if (htmlTag) doc = doc.slice(0, htmlTag.index + htmlTag[0].length) + `<head>${shim}</head>` + doc.slice(htmlTag.index + htmlTag[0].length);
  else doc = shim + doc;
  const close = doc.toLowerCase().lastIndexOf("</body>");
  return close >= 0 ? doc.slice(0, close) + DONE + doc.slice(close) : doc + DONE;
}

// ---- parent side ------------------------------------------------------------------------
const listeners = new Map(); // iframe contentWindow -> handler
window.addEventListener("message", (e) => {
  const h = listeners.get(e.source);
  if (h && e.data && typeof e.data === "object") h(e.data);
});

function lineText(msg) {
  if (msg.text != null) return msg.text;
  return (msg.prefix || "") + formatArgs(msg.args || []);
}

/**
 * Run `code` in a fresh sandboxed iframe placed in `host`. Calls onLine({text, level}) per
 * console line and onEnd({capped, hasBody}) once. Returns { iframe, stop() }.
 */
function execute({ code, mode, prompts, host, onLine, onEnd }) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts");
  iframe.setAttribute("title", mode === "html" ? "page preview" : "program page");
  let syncDone = false, pending = 0, last = Date.now(), ended = false, hasBody = false;
  const start = Date.now();
  const handler = (msg) => {
    last = Date.now();
    if (msg.type === "log") onLine({ text: lineText(msg), level: msg.level });
    else if (msg.type === "pending") pending = msg.n;
    else if (msg.type === "sync-done") syncDone = true;
    else if (msg.type === "storage" && (msg.kind === "local" || msg.kind === "session") && Array.isArray(msg.entries)) store[msg.kind] = new Map(msg.entries);
    else if (msg.type === "status") hasBody = !!msg.hasBody;
  };
  const finish = (capped) => {
    if (ended) return;
    ended = true;
    clearInterval(tick);
    onEnd({ capped, hasBody: !capped && hasBody });
  };
  const tick = setInterval(() => {
    const now = Date.now();
    if (now - start >= CAP_MS) finish(true);
    else if (syncDone && pending <= 0 && now - last >= QUIET_MS) finish(false);
  }, 50);
  iframe.srcdoc = buildSrcdoc(code, mode, prompts);
  host.append(iframe);
  listeners.set(iframe.contentWindow, handler);
  return {
    iframe,
    stop() {
      ended = true;
      clearInterval(tick);
      listeners.delete(iframe.contentWindow);
      iframe.remove();
    },
  };
}

/**
 * Run a program off-screen and collect its console (used by `lang: "js"` challenges).
 * Resolves { lines: string[], error: string | null }; uncaught errors go to `error`.
 */
export function runJsCapture(code) {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    host.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-9999px;top:0";
    document.body.append(host);
    const lines = [];
    let error = null;
    const { prompts, code: body } = parseDirectives(code);
    const run = execute({
      code: body, mode: "js", prompts, host,
      onLine: ({ text, level }) => { if (level === "error" && /^Uncaught /.test(text)) { if (!error) error = text; } else lines.push(text); },
      onEnd: ({ capped }) => {
        run.stop();
        host.remove();
        if (capped && !error) error = "(still running after 6 s)";
        resolve({ lines, error });
      },
    });
  });
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/**
 * Mount an editable, runnable JavaScript (mode "js") or HTML (mode "html") block.
 * Returns { el, editor, lines() } like mountRunner, so pinned sections link references into it.
 */
export function mountJsRunner(container, code, ctx, opts = {}) {
  const mode = opts.mode === "html" ? "html" : "js";
  const parsed = parseDirectives(code);
  const initial = parsed.code;
  const prompts = parsed.prompts;
  const predict = parsed.predict;

  const box = el("div", `runner js-runner ${mode}-mode` + (opts.pinned ? " pinned-runner" : ""));
  const head = el("div", "runner-head");
  const tag = el("span", "lang-tag", opts.title || (mode === "html" ? "HTML, editable" : "JavaScript, editable"));
  tag.append(el("kbd", null, "Ctrl+Enter"));
  head.append(tag, el("span", "spacer"));
  const resetBtn = el("button", "reset-btn", "Reset");
  const runBtn = el("button", "run-btn", "Run");
  head.append(resetBtn, runBtn);

  const editor = createEditor(initial, mode);
  const main = el("div", "js-main");
  main.append(editor.el);
  let preview = null;
  if (mode === "html") {
    preview = el("div", "html-preview");
    preview.append(el("div", "html-preview-empty", "Run to render the page here."));
    main.append(preview);
  }

  let predictBox = null, predictTa = null;
  if (predict) {
    predictBox = el("div", "predict-row");
    predictTa = document.createElement("textarea");
    predictTa.className = "predict-input"; predictTa.rows = 2; predictTa.placeholder = "your prediction";
    const hint = el("span", "predict-hint", "Run is locked until you write a prediction here (any guess counts).");
    predictBox.append(el("label", null, predict), predictTa, hint);
    runBtn.disabled = true;
    runBtn.classList.add("locked");
    runBtn.title = "Write a prediction first";
    predictTa.addEventListener("input", () => {
      runBtn.disabled = predictTa.value.trim().length < 1;
      runBtn.classList.toggle("locked", runBtn.disabled);
      runBtn.title = runBtn.disabled ? "Write a prediction first" : "";
      hint.style.display = runBtn.disabled ? "" : "none";
    });
  }

  const outWrap = el("div", "js-out empty");
  const consoleBox = el("div", "runner-output js-console");
  const pagePane = el("div", "page-pane");
  pagePane.append(el("div", "stream-label", "page"));
  outWrap.append(consoleBox);
  if (mode === "js") outWrap.append(pagePane);

  box.append(head, main);
  if (predictBox) box.append(predictBox);
  box.append(outWrap);
  container.appendChild(box);

  let current = null;
  let lines = [];
  const clearRun = () => {
    if (current) current.stop();
    current = null;
    lines = [];
    consoleBox.innerHTML = "";
    pagePane.classList.remove("show");
    [...pagePane.querySelectorAll("iframe")].forEach((f) => f.remove());
  };

  function run(force) {
    if (runBtn.disabled && !force) return;
    clearRun();
    outWrap.classList.remove("empty");
    consoleBox.append(el("div", "stream-label", "console"));
    runBtn.disabled = true;
    runBtn.textContent = "Running…";
    let host;
    if (mode === "html") {
      preview.innerHTML = "";
      host = preview;
    } else host = pagePane;
    const handle = execute({
      code: editor.getValue(), mode, prompts, host,
      onLine: ({ text, level }) => {
        lines.push(text);
        consoleBox.append(el("div", "console-line" + (level === "error" ? " err" : level === "warn" ? " warn" : ""), text));
        consoleBox.scrollTop = consoleBox.scrollHeight;
      },
      onEnd: ({ capped, hasBody }) => {
        if (capped) {
          consoleBox.append(el("div", "console-line cap", "(still running after 6 s)"));
          // The html preview stays (it is the page the student is looking at); a js program's
          // hidden page is torn down so its interval stops.
          if (mode === "js") { handle.stop(); current = null; }
        } else if (mode === "js") {
          if (hasBody) pagePane.classList.add("show");
          else { handle.stop(); current = null; }
        }
        if (!lines.length) consoleBox.append(el("div", "console-empty", mode === "html" ? "(nothing logged)" : "(no output)"));
        if (predictTa) {
          const ok = comparePrediction(predictTa.value, lines.join("\n"));
          consoleBox.append(el("div", "predict-verdict " + (ok ? "pass" : "fail"), ok ? "Your prediction matched." : "Different from your prediction — compare line by line, then read the explanation again."));
        }
        runBtn.disabled = !!(predictTa && !predictTa.value.trim());
        runBtn.textContent = "Run";
      },
    });
    current = handle;
  }

  runBtn.addEventListener("click", () => run(false));
  editor.el.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(false); });
  resetBtn.addEventListener("click", () => {
    clearRun();
    resetJsStore();
    outWrap.classList.add("empty");
    if (preview) { preview.innerHTML = ""; preview.append(el("div", "html-preview-empty", "Run to render the page here.")); }
    editor.setValue(initial);
  });
  if (/[?&]autorun=1\b/.test(location.hash)) setTimeout(() => run(true), 200);
  return { el: box, editor, lines: () => editor.lineRows() };
}
