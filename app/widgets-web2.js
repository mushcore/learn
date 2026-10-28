// COMP 4537 web widgets, part 2: http-anatomy, storage-sim, dom-build-play, db-relate, css-box.
// Facts, numbers and wording come from spec/comp4537/l1/_SOURCE-NOTES-A.md and -B.md (URL, DOM,
// box model, display/visibility/position, specificity), l2 (architectures, Web Storage), l3 (request
// anatomy, GET vs POST) and l7 (patient/visit, authors/books, SQL). dom-build-play draws one frame
// per onFrame(pos) on the shared playback bar (app/playback.js) and runs no timer of its own.
import { el } from "./dom.js";
import { createPlayback } from "./playback.js";

// ---------- shared ----------
const CSS = `
.w2-sec { margin: 14px 0 6px; font-size: 13px; font-weight: 600; color: var(--ink-2); }
.w2-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
.w2-col { flex: 1 1 260px; min-width: 0; }
.w2-in { background: var(--paper); color: var(--ink); border: 1px solid var(--rule-strong); border-radius: 6px; padding: 4px 7px; font-family: var(--mono); font-size: 12.5px; min-width: 0; box-sizing: border-box; }
.w2-in:disabled { opacity: 0.5; }
.w2-pre { font-family: var(--mono); font-size: 12.5px; line-height: 1.45; background: var(--paper); color: var(--ink); border: 1px solid var(--rule); border-radius: 6px; padding: 8px 10px; margin: 6px 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.w2-dim { color: var(--ink-dim); }
.w2-err { color: var(--red); }
.w2-ok { color: var(--green); }
.w2-chip { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 11px; font-family: var(--mono); border: 1px solid var(--rule); background: var(--paper); color: var(--ink-2); }
.w2-url { font-family: var(--mono); font-size: 14px; line-height: 2.1; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px 10px; overflow-wrap: anywhere; }
.w2-url span { border-bottom: 3px solid currentColor; padding-bottom: 1px; }
.w2-c-scheme { color: var(--red); } .w2-c-host { color: var(--blue); } .w2-c-port { color: var(--purple); } .w2-c-path { color: var(--green); } .w2-c-query { color: var(--hl); }
.w2-url .w2-sep { border: 0; color: var(--ink-dim); }
.w2-legend { display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 12px; margin: 4px 0 8px; }
.w2-legend b { font-weight: 600; }
.w2-kv { display: flex; gap: 6px; align-items: center; margin: 4px 0; flex-wrap: wrap; }
.w2-kv .w2-in { flex: 1 1 90px; width: 90px; }
.w2-kv .viz-btn { padding: 3px 8px; }
.w2-nowrap { white-space: nowrap; }
.w2-field { display: flex; flex-direction: column; gap: 2px; flex: 1 1 80px; min-width: 0; font-size: 11.5px; color: var(--ink-dim); }
.w2-field .w2-in { width: 100%; }
.w2-table { border-collapse: collapse; font-size: 12.5px; margin: 4px 0; }
.w2-table caption { text-align: left; font-weight: 600; font-size: 12.5px; color: var(--ink-2); padding: 2px 0 4px; }
.w2-table th, .w2-table td { border: 1px solid var(--rule); padding: 3px 7px; text-align: left; background: var(--paper); color: var(--ink); }
.w2-table th { background: var(--paper-3); font-weight: 600; font-size: 12px; }
.w2-table tbody tr { cursor: pointer; }
.w2-table td.w2-lit, .w2-table tr.w2-lit td { background: var(--hl-soft); }
.w2-table tr.w2-src td { background: var(--hl-soft); box-shadow: inset 0 0 0 1px var(--hl); }
.w2-table tr.w2-bad td { background: var(--red-soft); color: var(--red); text-decoration: line-through; }
.w2-table tr.w2-new td { background: var(--green-soft); }
.w2-tag { font-size: 10px; font-weight: 700; margin-left: 4px; padding: 0 4px; border-radius: 3px; vertical-align: 1px; }
.w2-tag-pk { background: var(--hl-soft); color: var(--hl); }
.w2-tag-fk { background: var(--blue-soft); color: var(--blue); }
.w2-tag-uq { background: var(--red-soft); color: var(--red); }
.w2-browsers { display: flex; flex-wrap: wrap; gap: 10px; }
.w2-browser { flex: 1 1 280px; min-width: 0; border: 1px solid var(--rule-strong); border-radius: 8px; background: var(--paper); padding: 6px 8px 8px; }
.w2-browser > .w2-bname { font-size: 12.5px; font-weight: 600; margin-bottom: 4px; }
.w2-tab { border: 1px solid var(--rule); border-radius: 6px; padding: 6px; margin-top: 6px; background: var(--paper-2); cursor: pointer; }
.w2-tab.w2-active { border-color: var(--hl); box-shadow: 0 0 0 1px var(--hl); }
.w2-tab.w2-sees { background: var(--green-soft); }
.w2-tab select { width: 100%; }
.w2-store { font-family: var(--mono); font-size: 11.5px; margin-top: 4px; overflow-wrap: anywhere; }
.w2-store .w2-dim { font-family: var(--body); }
.w2-store-cur { font-weight: 600; }
.w2-code { list-style: none; counter-reset: ln; padding: 6px 8px; margin: 0; font-family: var(--mono); font-size: 12px; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; overflow-wrap: anywhere; }
.w2-code li { counter-increment: ln; padding: 1px 4px; border-radius: 4px; }
.w2-code li::before { content: counter(ln); display: inline-block; width: 1.6em; color: var(--ink-dim); }
.w2-code li.w2-cur { background: var(--hl-soft); color: var(--ink); box-shadow: inset 3px 0 0 var(--hl); }
.w2-code li.w2-done { color: var(--ink-2); }
.w2-tree { font-family: var(--mono); font-size: 12px; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px 8px; }
.w2-node { padding: 1px 4px; border-left: 1px solid var(--rule-strong); margin-left: 4px; border-radius: 0 4px 4px 0; overflow-wrap: anywhere; }
.w2-node.w2-txt { color: var(--ink-dim); font-style: italic; }
.w2-node.w2-lit { background: var(--hl-soft); color: var(--ink); border-left-color: var(--hl); }
.w2-node.w2-tgt { box-shadow: inset 0 0 0 1px var(--hl); }
.w2-node.w2-gone { color: var(--red); text-decoration: line-through; }
.w2-node.w2-add { background: var(--green-soft); }
.w2-idx { display: inline-block; margin-left: 6px; padding: 0 5px; border-radius: 4px; background: var(--hl); color: var(--paper); font-style: normal; font-size: 11px; }
.w2-float { margin-top: 6px; border: 1px dashed var(--rule-strong); border-radius: 6px; padding: 4px 8px; font-family: var(--mono); font-size: 12px; }
.w2-page { border: 1px solid var(--rule-strong); border-radius: 6px; background: var(--paper); overflow: hidden; }
.w2-page-bar { background: var(--paper-3); font-size: 11.5px; padding: 3px 8px; color: var(--ink-2); border-bottom: 1px solid var(--rule); }
.w2-page-body { padding: 6px 10px; font-size: 13px; color: var(--ink); min-height: 60px; }
.w2-page-body h1 { font-size: 18px; margin: 4px 0; } .w2-page-body h2 { font-size: 15px; margin: 4px 0; }
.w2-page-body p { margin: 4px 0; } .w2-page-body ul { margin: 4px 0; padding-left: 20px; }
.w2-page-body button { font: inherit; font-size: 12px; margin: 2px 4px 2px 0; min-width: 24px; min-height: 22px; }
.w2-page-body .w2-pg-lit { outline: 2px solid var(--hl); outline-offset: 1px; background: var(--hl-soft); }
.w2-page-body .w2-pg-add { background: var(--green-soft); }
.w2-page-body [data-idx]::after { content: "[" attr(data-idx) "]"; margin-left: 6px; font-family: var(--mono); font-size: 11px; color: var(--hl); }
.w2-boxes { width: 100%; height: auto; display: block; margin: 6px auto; }
.w2-inline-demo { background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 10px; font-size: 13px; line-height: 2; }
.w2-inline-demo span.w2-ib { border: 2px solid var(--green); background: var(--green-soft); padding: 2px 8px; border-radius: 3px; color: var(--ink); }
.w2-inline-demo span.w2-ib.w2-mid { border-color: var(--hl); background: var(--hl-soft); }
.w2-win { position: relative; height: 170px; border: 1px solid var(--rule-strong); border-radius: 6px; background: var(--paper); overflow: hidden; }
.w2-win-bar { height: 20px; background: var(--paper-3); border-bottom: 1px solid var(--rule); font-size: 11px; padding: 2px 8px; color: var(--ink-2); box-sizing: border-box; }
.w2-win-scroll { position: absolute; top: 20px; left: 0; right: 0; bottom: 0; overflow-y: auto; }
.w2-win-content { position: relative; padding: 6px 10px; font-size: 12.5px; color: var(--ink-2); }
.w2-win-content p { margin: 0 0 6px; }
.w2-posbox { width: max-content; white-space: nowrap; padding: 4px 6px; background: var(--hl-soft); border: 2px solid var(--hl); border-radius: 4px; font-size: 11.5px; color: var(--ink); font-family: var(--mono); box-sizing: border-box; }
.w2-arch { display: flex; flex-direction: column; align-items: stretch; gap: 4px; margin: 8px 0; }
.w2-abox { border: 1.5px solid var(--rule-strong); border-radius: 8px; background: var(--paper); padding: 8px 10px; text-align: center; font-size: 13px; color: var(--ink); }
.w2-abox small { display: block; color: var(--ink-dim); font-size: 11.5px; }
.w2-abox.w2-hot { border-color: var(--hl); background: var(--hl-soft); }
.w2-abox.w2-db { border-radius: 50% / 14px; background: var(--paper-3); }
.w2-arrow { text-align: center; color: var(--ink-dim); font-size: 12px; line-height: 1.2; }
.w2-arow { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
.w2-arow > div { flex: 1 1 90px; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.w2-list { margin: 4px 0 8px; padding-left: 20px; font-size: 13.5px; }
.w2-list li { margin: 2px 0; }
.w2-steps { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
.w2-sql { font-family: var(--mono); font-size: 12.5px; background: var(--paper); border: 1px solid var(--rule); border-radius: 6px; padding: 6px 8px; overflow-wrap: anywhere; }
.w2-sql div { padding: 1px 4px; border-radius: 4px; }
.w2-sql div.w2-cur { background: var(--hl-soft); box-shadow: inset 3px 0 0 var(--hl); }
.w2-sql div.w2-bad { background: var(--red-soft); color: var(--red); }
.w2-ta { width: 100%; min-height: 96px; resize: vertical; }
.w2-scroll-x { overflow-x: auto; max-width: 100%; }
.w2-sliders .slider-row label { width: 112px; flex: 0 0 auto; }
.w2-sliders .slider-row .val { width: 62px; white-space: nowrap; }
.w2-swatch { display: inline-block; width: 12px; height: 12px; border-radius: 3px; vertical-align: -1px; margin-right: 4px; border: 1px solid var(--rule-strong); }
`;
function injectCss() {
  if (typeof document === "undefined" || document.getElementById("widgets-web2-css")) return;
  const s = document.createElement("style");
  s.id = "widgets-web2-css";
  s.textContent = CSS;
  document.head.append(s);
}
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const setText = (node, t) => { if (node.textContent !== t) node.textContent = t; };
function button(label, onClick, cls = "viz-btn") {
  const b = el("button", cls, label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
/** A row of mutually exclusive buttons. Returns { row, set(i) }. */
function choice(labels, active, onPick) {
  const row = el("div", "viz-btn-row");
  const btns = labels.map((l, i) => {
    const b = button(l, () => { set(i); onPick(i); });
    row.append(b);
    return b;
  });
  function set(i) { btns.forEach((b, j) => b.classList.toggle("active", j === i)); }
  set(active);
  return { row, set };
}
function textIn(value, label, cls = "w2-in") {
  const i = document.createElement("input");
  i.type = "text"; i.className = cls; i.value = value; i.spellcheck = false;
  if (label) i.setAttribute("aria-label", label);
  return i;
}
function selectIn(options, value, label) {
  const s = document.createElement("select");
  s.className = "w2-in";
  for (const o of options) {
    const [v, t] = Array.isArray(o) ? o : [o, o];
    const opt = document.createElement("option");
    opt.value = v; opt.textContent = t;
    s.append(opt);
  }
  s.value = value;
  if (label) s.setAttribute("aria-label", label);
  return s;
}
function check(label, on) {
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox"; cb.checked = !!on;
  row.append(cb, " " + label);
  return { row, cb };
}

// ---------- shared: predict mode (as in widgets-net3.js) ----------
/** Predict-mode state for a playback: the next step waits until its right answer is picked. `redraw` repaints the frame. */
function predictKit(ask, label, getPb, redraw) {
  const s = { on: false, answered: 0, asked: 0, firstTry: 0, missed: false, wrong: null, key: null, refocus: false };
  const row = el("label", "playback-check");
  const cb = document.createElement("input");
  cb.type = "checkbox";
  row.append(cb, " " + label);
  s.row = row;
  s.set = (v) => { s.on = !!v; cb.checked = s.on; };
  s.reset = () => { s.answered = 0; s.asked = 0; s.firstTry = 0; s.missed = false; s.wrong = null; s.key = null; };
  s.asking = (pos, n) => s.on && s.answered < n && Math.abs(pos - s.answered) < 1e-6;
  s.limit = (n) => (s.on ? s.answered : n);
  s.nudge = () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
  s.tally = () => (s.asked > 0 ? ` ${s.firstTry} of ${s.asked} right on the first try.` : "");
  function pick(o, e) {
    s.asked += s.wrong == null && !s.missed ? 1 : 0;
    s.refocus = e.detail === 0;
    if (!o.ok) { s.missed = true; s.wrong = o.label; redraw(); return; }
    if (!s.missed) s.firstTry++;
    s.missed = false; s.wrong = null; s.answered++;
    getPb().next();
  }
  /** Shows the answer buttons while `show` is true. opts: [{ label, ok, why }]; `why` is quoted after a wrong pick. */
  s.render = (show, keyBase, opts) => {
    const key = show ? `${keyBase}|${s.answered}|${s.wrong}` : "";
    if (key === s.key) return;
    s.key = key; ask.innerHTML = ""; ask.hidden = !s.on;
    if (!key) return;
    const btns = opts.map((o) => {
      const b = el("button", "viz-btn" + (o.label === s.wrong ? " playback-wrong" : ""), o.label);
      b.type = "button";
      b.addEventListener("click", (e) => pick(o, e));
      ask.append(b);
      return b;
    });
    const w = opts.find((o) => o.label === s.wrong);
    if (w) ask.append(el("span", "playback-feedback", `Not ${w.label}. ${w.why}`));
    if (s.refocus) { s.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
  };
  cb.addEventListener("change", () => {
    const pb = getPb();
    s.on = cb.checked; pb.pause(); s.reset();
    // Steps already on screen count as answered; the questions start at the next one.
    s.answered = Math.ceil(pb.pos() - 1e-9);
    pb.set(pb.pos());
  });
  return s;
}

// ---------- widget: http-anatomy ----------
// Lecture 3 slides 31-36 (headers, data/body, endpoint, methods; GET puts the query string in the
// URL, POST puts the data in the body) and lecture 1 slides 45-46 (the URL's parts).
const HA_METHODS = ["GET", "POST", "PUT", "DELETE"];
const HA_TYPES = ["application/x-www-form-urlencoded", "application/json", "text/plain"];
const HA_METHOD_NOTE = {
  GET: "GET: Get resource from the server. The query string (name/value pairs) is sent in the URL of a GET request, so the body is empty (slides 32, 34).",
  POST: "POST: Create resource to the server. The data sent to the server with POST is stored in the request body of the HTTP request (not part of the URL) (slides 32, 36).",
  PUT: "PUT: Update existing resource on the server (slide 32). Like POST, its data travels in the request body.",
  DELETE: "DELETE: Delete existing resource from the server (slide 32). This widget sends its parameters in the query string, as GET does, and no body.",
};
const haEntries = (o) => (o && typeof o === "object" && !Array.isArray(o) ? Object.entries(o).map(([k, v]) => [String(k), v == null ? "" : String(v)]) : []);
const haPath = (p) => { let s = String(p || "/").trim().split("?")[0].split("#")[0]; if (!s.startsWith("/")) s = "/" + s; return s; };
function httpAnatomy(box, cfg) {
  injectCss();
  const m0 = String(cfg.method || "GET").toUpperCase();
  const st = {
    method: HA_METHODS.includes(m0) ? m0 : "GET",
    scheme: cfg.scheme === "https" ? "https" : "http",
    host: typeof cfg.host === "string" && cfg.host.trim() ? cfg.host.trim() : "localhost",
    port: cfg.port != null && String(cfg.port).trim() !== "" ? String(cfg.port).trim() : "8888",
    path: haPath(typeof cfg.path === "string" ? cfg.path : "/getDate"),
    params: cfg.params === undefined ? [["name", "John"]] : haEntries(cfg.params),
    headers: [],
    ctype: HA_TYPES[0],
  };
  for (const [k, v] of haEntries(cfg.headers)) {
    if (k.toLowerCase() === "content-type") { if (HA_TYPES.includes(v)) st.ctype = v; } else st.headers.push([k, v]);
  }
  let real = null, ticket = 0;

  box.append(el("h4", null, cfg.title || "An HTTP request, part by part"));
  const methodRow = choice(HA_METHODS, HA_METHODS.indexOf(st.method), (i) => { st.method = HA_METHODS[i]; update(); });
  box.append(methodRow.row);

  // URL
  box.append(el("div", "w2-sec", "Endpoint: the URL where the API server is listening"));
  const urlBar = el("div", "w2-url");
  urlBar.setAttribute("aria-live", "polite");
  const legend = el("div", "w2-legend");
  for (const [cls, name] of [["scheme", "protocol"], ["host", "domain name (host)"], ["port", "port"], ["path", "path"], ["query", "query string"]]) {
    const s = el("span", "w2-c-" + cls);
    s.append(el("b", null, "▬ "), name);
    legend.append(s);
  }
  const fields = el("div", "w2-row");
  fields.style.gap = "6px";
  const fScheme = selectIn(["http", "https"], st.scheme, "protocol");
  const fHost = textIn(st.host, "host"), fPort = textIn(st.port, "port"), fPath = textIn(st.path, "path");
  for (const [lab, inp, grow] of [["protocol", fScheme, "0 0 76px"], ["host", fHost, "2 1 120px"], ["port", fPort, "0 0 64px"], ["path", fPath, "3 1 140px"]]) {
    const f = el("label", "w2-field");
    f.style.flex = grow;
    f.append(lab, inp);
    fields.append(f);
  }
  box.append(urlBar, legend, fields);
  fScheme.addEventListener("change", () => { st.scheme = fScheme.value; update(); });
  fHost.addEventListener("input", () => { st.host = fHost.value.trim() || "localhost"; update(); });
  fPort.addEventListener("input", () => { st.port = fPort.value.replace(/\D/g, "").slice(0, 5); update(); });
  fPath.addEventListener("input", () => { st.path = haPath(fPath.value); update(); });

  // parameters
  box.append(el("div", "w2-sec", "Parameters (name/value pairs)"));
  const paramBox = el("div");
  box.append(paramBox);
  function kvRows(target, list, kind) {
    target.innerHTML = "";
    list.forEach((pair, i) => {
      const r = el("div", "w2-kv");
      const k = textIn(pair[0], `${kind} ${i + 1} name`), v = textIn(pair[1], `${kind} ${i + 1} value`);
      k.addEventListener("input", () => { pair[0] = k.value; update(); });
      v.addEventListener("input", () => { pair[1] = v.value; update(); });
      const x = button("✕", () => { list.splice(i, 1); kvRows(target, list, kind); update(); });
      x.setAttribute("aria-label", `Remove ${kind} ${i + 1}`);
      r.append(k, el("span", "w2-dim", kind === "header" ? ":" : "="), v, x);
      target.append(r);
    });
    target.append(button(`+ ${kind}`, () => { list.push(kind === "header" ? ["X-Requested-With", "XMLHttpRequest"] : ["", ""]); kvRows(target, list, kind); update(); }));
  }
  kvRows(paramBox, st.params, "parameter");

  // headers
  box.append(el("div", "w2-sec", "Headers: the additional details for the server"));
  const ctRow = el("div", "w2-kv");
  const ctSel = selectIn(HA_TYPES, st.ctype, "Content-Type");
  ctSel.style.flex = "1 1 200px";
  ctRow.append(el("span", "w2-chip", "Content-Type"), ctSel);
  ctSel.addEventListener("change", () => { st.ctype = ctSel.value; update(); });
  const hdrBox = el("div");
  box.append(ctRow, hdrBox);
  kvRows(hdrBox, st.headers, "header");

  // body, raw request, response
  box.append(el("div", "w2-sec", "Data (body)"));
  const bodyPre = el("pre", "w2-pre");
  const note = el("p", "widget-note");
  box.append(bodyPre, note);
  box.append(el("div", "w2-sec", "The raw request, as it goes on the wire"));
  const rawPre = el("pre", "w2-pre");
  box.append(rawPre);
  const respHead = el("div", "w2-sec");
  const respPre = el("pre", "w2-pre");
  respPre.setAttribute("aria-live", "polite");
  const sendRow = el("div", "viz-btn-row");
  const sendB = button("Send to the app's echo endpoint", send);
  const sendNote = el("span", "widget-note");
  sendNote.style.margin = "0";
  sendRow.append(sendB, sendNote);
  box.append(respHead, respPre, sendRow);

  const hasBody = () => st.method === "POST" || st.method === "PUT";
  const named = () => st.params.filter(([k]) => k.trim() !== "");
  function query() { return hasBody() ? "" : new URLSearchParams(named()).toString(); }
  function body() {
    if (!hasBody()) return "";
    const p = named();
    if (!p.length) return "";
    if (st.ctype === "application/json") return JSON.stringify(Object.fromEntries(p));
    if (st.ctype === "text/plain") return p.map(([k, v]) => `${k}=${v}`).join("\n");
    return new URLSearchParams(p).toString();
  }
  const defaultPort = () => (st.scheme === "https" ? "443" : "80");
  const hostHeader = () => st.host + (st.port && st.port !== defaultPort() ? ":" + st.port : "");
  const userHeaders = () => st.headers.filter(([k]) => k.trim() !== "" && k.trim().toLowerCase() !== "content-type");
  const echoPath = () => (st.path === "/api/echo" || st.path.startsWith("/api/echo/") ? st.path : "/api/echo" + (st.path === "/" ? "" : st.path));
  function update() {
    real = null; ticket++;
    const q = query(), b = body(), withBody = hasBody();
    urlBar.innerHTML = "";
    const add = (cls, t) => urlBar.append(cls ? el("span", "w2-c-" + cls, t) : Object.assign(el("span", "w2-sep", t)));
    add("scheme", st.scheme); add(null, "://"); add("host", st.host);
    if (st.port) { add(null, ":"); add("port", st.port); }
    add("path", st.path);
    if (q) { add(null, "?"); add("query", q); }
    ctSel.disabled = !withBody;
    ctRow.title = withBody ? "" : "No body, so no Content-Type is sent";
    if (withBody) {
      bodyPre.classList.remove("w2-dim");
      bodyPre.textContent = b || "(empty: no parameters)";
    } else {
      bodyPre.classList.add("w2-dim");
      bodyPre.textContent = q ? `(no body: ${st.method} moved the parameters into the URL as ?${q})` : `(no body)`;
    }
    const n = named().length;
    note.textContent = HA_METHOD_NOTE[st.method] + (n ? (withBody ? ` Here the ${n === 1 ? "parameter is" : `${n} parameters are`} in the body as ${st.ctype}.` : ` Here the ${n === 1 ? "parameter is" : `${n} parameters are`} in the query string.`) : "");
    const lines = [`${st.method} ${st.path}${q ? "?" + q : ""} HTTP/1.1`, `Host: ${hostHeader()}`];
    for (const [k, v] of userHeaders()) lines.push(`${k.trim()}: ${v}`);
    if (withBody) lines.push(`Content-Type: ${st.ctype}`, `Content-Length: ${new TextEncoder().encode(b).length}`);
    rawPre.textContent = lines.join("\n") + "\n\n" + (withBody ? b : "");
    // What the echo endpoint will answer (it echoes only these request headers).
    const echoed = {};
    if (withBody) echoed["content-type"] = st.ctype;
    for (const [k, v] of userHeaders()) { const lk = k.trim().toLowerCase(); if (lk === "accept" || lk === "x-requested-with") echoed[lk] = v; }
    const reply = { method: st.method, path: echoPath(), query: Object.fromEntries(new URLSearchParams(q)), headers: echoed, body: b };
    respHead.textContent = "The response: status line, headers, body (what the echo endpoint will send back)";
    respPre.classList.remove("w2-err");
    respPre.textContent = `HTTP/1.1 200 OK\nContent-Type: application/json\nAccess-Control-Allow-Origin: *\n\n${JSON.stringify(reply, null, 2)}`;
    sendB.disabled = false;
    sendNote.textContent = `sends ${st.method} ${echoPath()}${q ? "?" + q : ""} to this app's server; the browser adds headers such as Accept and Origin, and the echo shows them.`;
  }
  async function send() {
    const my = ++ticket, q = query(), b = body();
    const url = location.origin + echoPath() + (q ? "?" + q : "");
    sendB.disabled = true; sendNote.textContent = "sending…";
    try {
      const headers = new Headers();
      for (const [k, v] of userHeaders()) headers.set(k.trim(), v);
      if (hasBody()) headers.set("Content-Type", st.ctype);
      const res = await fetch(url, { method: st.method, headers, body: hasBody() ? b : undefined });
      const text = await res.text();
      if (my !== ticket) return;
      let shown = text;
      try { shown = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON: show the text */ }
      const hdr = ["content-type", "access-control-allow-origin"].filter((h) => res.headers.get(h) != null).map((h) => `${h}: ${res.headers.get(h)}`);
      real = { status: res.status };
      respHead.textContent = `The real response from ${location.origin}${echoPath()}`;
      respPre.classList.toggle("w2-err", !res.ok);
      respPre.textContent = `HTTP ${res.status} ${res.statusText || ""}`.trim() + "\n" + hdr.join("\n") + "\n\n" + shown;
      sendNote.textContent = res.ok ? "real reply received. Edit any part to build a new request." : `the server answered ${res.status}.`;
    } catch (e) {
      if (my !== ticket) return;
      respHead.textContent = "The request failed";
      respPre.classList.add("w2-err");
      respPre.textContent = `${e && e.name ? e.name : "Error"}: ${e && e.message ? e.message : e}`;
      sendNote.textContent = "no reply: the error above is what fetch reported.";
    }
    sendB.disabled = false;
  }
  update();
}

// ---------- widget: storage-sim ----------
// Lecture 2 slides 32-37: web storage is per origin; localStorage has no expiration date;
// sessionStorage is lost when the browser tab is closed; values are always strings.
const SS_URLS = [
  "https://aaa.com/labs/1/index.html",
  "https://aaa.com/labs/5/hello.html",
  "https://lab.aaa.com/1/index.html",
  "http://aaa.com/labs/1/index.html",
  "http://localhost:3000/labs/1/index.html",
  "http://localhost:8000/labs/1/index.html",
];
const SS_BROWSERS = ["Chrome", "Firefox"];
function ssOrigin(u) {
  const x = new URL(u);
  const protocol = x.protocol.replace(":", "");
  return { protocol, host: x.hostname, port: x.port || (protocol === "https" ? "443" : "80"), path: x.pathname };
}
const ssKey = (o) => `${o.protocol}://${o.host}:${o.port}`;
const ssShort = (u) => { const o = ssOrigin(u); return `${o.protocol}://${o.host}${new URL(u).port ? ":" + o.port : ""}`; };
function storageSim(box, cfg) {
  injectCss();
  let mode = cfg.mode === "session" ? "session" : "local";
  const tabs = [
    { b: 0, t: 0, url: SS_URLS[0] }, { b: 0, t: 1, url: SS_URLS[1] },
    { b: 1, t: 0, url: SS_URLS[0] }, { b: 1, t: 1, url: SS_URLS[2] },
  ];
  let active = 0, last = null;
  const local = new Map(), session = new Map(), opened = [0, 0, 0, 0];
  const area = (m, tab) => {
    const o = ssKey(ssOrigin(tab.url));
    const k = m === "local" ? `${tab.b}|${o}` : `${tab.b}|${tab.t}|${opened[tabs.indexOf(tab)]}|${o}`;
    const map = m === "local" ? local : session;
    if (!map.has(k)) map.set(k, new Map());
    return map.get(k);
  };
  const tabName = (i) => `${SS_BROWSERS[tabs[i].b]} tab ${tabs[i].t + 1}`;

  box.append(el("h4", null, cfg.title || "Which tabs see the stored data?"));
  const modeRow = choice(["localStorage", "sessionStorage"], mode === "session" ? 1 : 0, (i) => { mode = i ? "session" : "local"; last = null; render(); });
  box.append(modeRow.row);
  const wrap = el("div", "w2-browsers");
  box.append(wrap);
  const panels = [];
  for (let b = 0; b < 2; b++) {
    const w = el("div", "w2-browser");
    w.append(el("div", "w2-bname", SS_BROWSERS[b]));
    tabs.forEach((tab, i) => {
      if (tab.b !== b) return;
      const p = el("div", "w2-tab");
      p.tabIndex = -1;
      const head = el("div", "w2-kv");
      head.style.margin = "0 0 2px";
      const name = el("span", "w2-chip", `tab ${tab.t + 1}`);
      const sel = selectIn(SS_URLS, tab.url, `${tabName(i)} address`);
      sel.style.flex = "1 1 160px";
      sel.addEventListener("change", () => { tab.url = sel.value; active = i; last = null; render(); });
      head.append(name, sel);
      const store = el("div", "w2-store");
      p.append(head, store);
      p.addEventListener("click", (e) => { if (e.target.tagName !== "SELECT" && active !== i) { active = i; render(); } });
      w.append(p);
      panels[i] = { p, store };
    });
    wrap.append(w);
  }
  const form = el("div", "w2-row");
  form.style.cssText = "gap:6px;margin-top:10px;align-items:flex-end";
  const fk = textIn("myKey", "key"), fv = textIn("Monday and Friday", "value");
  for (const [lab, inp, g] of [["key", fk, "1 1 90px"], ["value", fv, "2 1 140px"]]) {
    const f = el("label", "w2-field");
    f.style.flex = g;
    f.append(lab, inp);
    form.append(f);
  }
  const who = el("p", "widget-note");
  who.style.margin = "8px 0 4px";
  const acts = el("div", "viz-btn-row");
  const api = () => (mode === "local" ? "localStorage" : "sessionStorage");
  acts.append(
    button("setItem(key, value)", () => act("set")),
    button("getItem(key)", () => act("get")),
    button("removeItem(key)", () => act("remove")),
    button("clear()", () => act("clear")),
    button("close tab and reopen", () => act("close")),
  );
  const result = el("pre", "w2-pre");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(who, form, acts, result, caption);
  box.append(el("p", "widget-note", "Slide 32: web storage is per origin. The slide says \"per domain and protocol\"; the port is part of the origin too, so http://localhost:3000 and http://localhost:8000 do not share. The path is ignored."));

  function why(i, j, m) {
    const A = tabs[i], B = tabs[j];
    if (A.b !== B.b) return `${tabName(j)}: a different browser never sees it; each browser keeps its own storage on your computer.`;
    const a = ssOrigin(A.url), b = ssOrigin(B.url);
    const diff = [];
    if (a.protocol !== b.protocol) diff.push(`protocol ${b.protocol} ≠ ${a.protocol}`);
    if (a.host !== b.host) diff.push(`host ${b.host} ≠ ${a.host}`);
    if (a.port !== b.port) diff.push(`port ${b.port} ≠ ${a.port}`);
    if (diff.length) return `${tabName(j)}: different origin (${diff.join(", ")}).`;
    if (m === "session") return `${tabName(j)}: same origin, but sessionStorage belongs to one tab only.`;
    return `${tabName(j)}: same browser and same origin (protocol, host, port)${a.path !== b.path ? `; the path ${b.path} vs ${a.path} is ignored` : ""}.`;
  }
  function act(kind) {
    const tab = tabs[active], k = fk.value, v = fv.value, s = area(mode, tab);
    let call, out;
    if (kind === "set") {
      s.set(k, String(v));
      call = `${api()}.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)})`;
      out = /^\s*-?\d+(\.\d+)?\s*$/.test(v) ? `stored as the string ${JSON.stringify(String(v))}: name/value pairs are always stored as strings (slide 34). Convert with Number() when reading it back.` : "stored.";
    } else if (kind === "get") {
      call = `${api()}.getItem(${JSON.stringify(k)})`;
      out = s.has(k) ? `→ ${JSON.stringify(s.get(k))}` : "→ null (no such key in this tab's storage)";
    } else if (kind === "remove") {
      call = `${api()}.removeItem(${JSON.stringify(k)})`;
      out = s.delete(k) ? "removed." : "nothing to remove; no error.";
    } else if (kind === "clear") {
      call = `${api()}.clear()`;
      out = `cleared everything for ${ssShort(tab.url)} in ${SS_BROWSERS[tab.b]}${mode === "session" ? ", in this tab only" : ""}.`;
      s.clear();
    } else {
      opened[active]++;
      call = `(${tabName(active)} closed and opened again at the same address)`;
      out = "its sessionStorage is gone (data is lost when the browser tab is closed); its localStorage is still there (no expiration date).";
    }
    result.textContent = `${tabName(active)}  ${call}\n${out}`;
    last = kind === "close" ? null : { kind, from: active, m: mode };
    render();
  }
  function listStore(target, m, tab, cur) {
    const s = area(m, tab);
    const line = el("div", cur ? "w2-store-cur" : "w2-dim");
    line.append(el("span", null, m === "local" ? "localStorage: " : "sessionStorage: "));
    if (!s.size) line.append(el("span", "w2-dim", "(empty)"));
    else line.append([...s].map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(", "));
    target.append(line);
  }
  function render() {
    const tab = tabs[active];
    setText(who, `Active: ${tabName(active)} at ${tab.url}. The buttons call ${api()} in this tab; click another tab to switch.`);
    tabs.forEach((t, i) => {
      const { p, store } = panels[i];
      p.classList.toggle("w2-active", i === active);
      const sees = last && last.kind === "set" && i !== last.from && area(last.m, t) === area(last.m, tabs[last.from]);
      p.classList.toggle("w2-sees", !!sees);
      store.innerHTML = "";
      listStore(store, "local", t, mode === "local");
      listStore(store, "session", t, mode === "session");
    });
    let text;
    if (last && last.kind === "set") {
      const others = tabs.map((_, j) => j).filter((j) => j !== last.from);
      const shared = others.filter((j) => area(last.m, tabs[j]) === area(last.m, tabs[last.from]));
      const notShared = others.filter((j) => !shared.includes(j));
      text = `${last.m === "local" ? "localStorage" : "sessionStorage"} written in ${tabName(last.from)}. ` +
        (shared.length ? `Shared with ${shared.map((j) => why(last.from, j, last.m)).join(" ")} ` : "No other tab sees it. ") +
        (notShared.length ? `Not visible in ${notShared.map((j) => why(last.from, j, last.m)).join(" ")}` : "");
    } else if (mode === "local") text = "localStorage stores data with no expiration date. All pages from the same origin can store and access the same data within the same browser on your computer. Write a value with setItem and watch which tabs show it.";
    else text = "sessionStorage stores data for one session: it belongs to one tab, and the data is lost when the browser tab is closed. Write a value and compare the two tabs at the same origin.";
    setText(caption, text.trim());
  }
  render();
  result.textContent = `${tabName(active)}  (no call yet)`;
}

// ---------- widget: dom-build-play ----------
// Lecture 1 slides 152-157: the DOM tree; createElement then appendChild (slide 155, exercise on
// slide 156); getElementsByTagName returns an array of elements of the given type (slide 157).
let domUid = 0;
const DN = (tag, kids = [], extra = {}) => ({ id: ++domUid, tag, kids, ...extra });
const DT = (text) => ({ id: ++domUid, text });
function domFind(n, id) {
  if (n.id === id) return n;
  for (const k of n.kids || []) { const f = domFind(k, id); if (f) return f; }
  return null;
}
function domAll(n, pred, out = []) {
  if (pred(n)) out.push(n);
  for (const k of n.kids || []) domAll(k, pred, out);
  return out;
}
const domBody = (st) => st.tree.kids.find((k) => k.tag === "body");
/** Each preset: an initial tree and steps. A step's apply(st) mutates a copy of the state and returns
 * { lit: {id: label}, tgt: [ids lit before the change], gone: [ids removed], add: [ids added], log, text }. */
const DOM_PRESETS = {
  button: () => {
    const tree = DN("html", [DN("head", [DN("title", [DT("page title")])]), DN("body", [])]);
    const create = (v) => ({
      code: `let ${v} = document.createElement("BUTTON");`,
      apply(st) { const n = DN("button", [], { varName: v }); st.floating.push(n); st.vars[v] = n.id; return { add: [n.id], text: `1: create that element in memory. document.createElement("BUTTON") makes a <button> called ${v}; it is not in the DOM tree yet, so the page shows nothing new.` }; },
      ask: { q: `Where is ${v} after this line?`, opts: [["only in memory, not in the tree", true], ["the last child of body", false, "createElement only creates that element in memory; placing it in the DOM tree is step 2, appendChild."], ["the first child of body", false, "createElement does not place the element anywhere; appendChild does."]] },
    });
    const text = (v, t, attached) => ({
      code: `${v}.innerHTML = "${t}";`,
      apply(st) { const n = domFind({ kids: [st.tree, ...st.floating] }, st.vars[v]); const tx = DT(t); n.kids = [tx]; return { lit: { [n.id]: "" }, add: [tx.id], text: attached ? `3: do something to make that button visible! (e.g. give it a value). innerHTML gives ${v} the text "${t}", and the page draws it.` : `innerHTML gives ${v} the text "${t}", but ${v} is still only in memory: the page does not change until it is appended.` }; },
      ask: attached
        ? { q: "What does the page show after this line?", opts: [[`a button labelled ${t}`, true], ["an empty button", false, "innerHTML sets the content of the element, and this button is already in the DOM tree, so the page updates."], ["nothing", false, `${v} was appended in the line before, so it is on the page.`]] }
        : { q: `Is ${v} on the page now?`, opts: [["no, it is only in memory", true], ["yes, after button 1", false, "Giving a detached element a value does not place it in the DOM tree; only appendChild does."]] },
    });
    const append = (v, first) => ({
      code: `document.body.appendChild(${v});`,
      apply(st) {
        const i = st.floating.findIndex((n) => n.id === st.vars[v]); const [n] = st.floating.splice(i, 1); const body = domBody(st); body.kids.push(n);
        return { tgt: [body.id], lit: { [n.id]: "" }, add: [n.id], text: first ? `2: place that element in DOM tree. appendChild adds ${v} as the last child of body; the page now draws it, empty because it has no text yet.` : `appendChild adds ${v} as the last child of body, after button 1: the page now shows both buttons in that order.` };
      },
      ask: first
        ? { q: "Where does the node attach?", opts: [["inside body", true], ["inside head", false, "document.body.appendChild attaches to body; head holds the title, not page content."], ["it stays in memory", false, "appendChild is the call that places the element in the DOM tree."]] }
        : { q: "Where does the node attach?", opts: [["after button 1 (last child of body)", true], ["before button 1 (first child of body)", false, "appendChild adds the node as the last child of the element it is called on."], ["inside button 1", false, "It is called on document.body, so the new node becomes a child of body, not of the button."]] },
    });
    return { tree, steps: [create("btn"), append("btn", true), text("btn", "button 1", true), create("btn2"), text("btn2", "button 2", false), append("btn2", false)], note: "Slide 155 adds one button in three steps; lines 4 to 6 do slide 156's exercise (\"Add two buttons dynamically\") without the click handlers." };
  },
  byTag: () => {
    const ps = [DN("p", [DT("Hello ...... World!")]), DN("p", [DT("Hello World!")]), DN("p", [DT("Hello ...... World!")])];
    const tree = DN("html", [DN("head", [DN("title", [DT("page title")])]), DN("body", [...ps, DN("script", [DT("…")])])]);
    return {
      tree,
      steps: [
        { code: `let pElements = document.getElementsByTagName("p");`, apply(st) { const found = domAll(st.tree, (n) => n.tag === "p"); st.vars.pElements = found.map((n) => n.id); return { lit: Object.fromEntries(found.map((n, i) => [n.id, String(i)])), text: `getElementsByTagName returns an array of elements of the given type: the ${found.length} <p> elements, in document order, at indexes [0] to [${found.length - 1}]. The <script> is not a <p>, so it is not in the list.` }; },
          ask: { q: "How many elements does it return?", opts: [["1", false, "It returns every element of the given type, not just the first."], ["3", true], ["4", false, "Only <p> elements count; the <script> element is not a p."]] } },
        { code: `console.log(pElements.length);`, apply(st) { const ids = st.vars.pElements; return { lit: Object.fromEntries(ids.map((id, i) => [id, String(i)])), log: String(ids.length), text: `pElements.length is ${ids.length}. (It is an HTMLCollection: indexable with [ ] and has .length, though not a true Array.)` }; },
          ask: { q: "What does the console print?", opts: [["2", false, "length counts the elements (3); the last index is 2."], ["3", true], ["undefined", false, "The returned list has a length property."]] } },
        { code: `pElements[1].innerHTML = "just Hello!";`, apply(st) { const n = domFind(st.tree, st.vars.pElements[1]); const old = n.kids.map((k) => k.id); const tx = DT("just Hello!"); n.kids = [tx]; return { tgt: [n.id], lit: { [n.id]: "1" }, gone: old, add: [tx.id], text: `With index 1, the second paragraph "Hello World!" becomes "just Hello!": indexes start at 0.` }; },
          ask: { q: "Which paragraph changes?", opts: [["the first", false, "Indexes start at 0, so [0] is the first paragraph and [1] the second."], ["the second", true], ["the third", false, "[2] would be the third; [1] is the second."]] } },
      ],
      note: "Slide 157's page and script; line 2 is added to show the length.",
    };
  },
  innerHTML: () => {
    const lis = ["Jeff Brown", "Jack Ma", "Amy Alam"].map((t) => DN("li", [DT(t)]));
    const tree = DN("html", [DN("head", [DN("title", [DT("page title")])]), DN("body", [DN("h1", [DT("hello page")]), DN("p", [DT("Welcome home.")]), DN("h2", [DT("Our team")]), DN("ul", lis, { attr: 'id="team"' }), DN("p", [DT("Contact us")])])]);
    return {
      tree,
      steps: [
        { code: `let team = document.getElementById("team");`, apply(st) { const n = domAll(st.tree, (x) => x.attr === 'id="team"')[0]; st.vars.team = n.id; return { lit: { [n.id]: "" }, text: `getElementById returns the one element whose id is "team": the <ul>. The id of an element should be unique within a page.` }; },
          ask: { q: "What does getElementById light?", opts: [["one element: the ul", true], ["every li in the list", false, "It matches by id, and only the <ul> has id=\"team\"."], ["every element with an id", false, "It returns the single element with that exact id."]] } },
        { code: `team.innerHTML = "<li>Amy Alam</li><li>Lin Chen</li>";`, apply(st) { const n = domFind(st.tree, st.vars.team); const gone = []; for (const k of n.kids) domAll(k, () => true, gone); const add = [DN("li", [DT("Amy Alam")]), DN("li", [DT("Lin Chen")])]; n.kids = add; const addIds = []; for (const k of add) domAll(k, () => true, addIds); return { tgt: [n.id], lit: { [n.id]: "" }, gone: gone.map((x) => x.id), add: addIds.map((x) => x.id), text: `Writing innerHTML replaces the whole subtree inside the <ul>: the three old <li> elements are removed and the two new ones are built from the string.` }; },
          ask: { q: "What happens to the three old <li>?", opts: [["removed: the subtree is replaced", true], ["kept, new items added after", false, "Assigning innerHTML replaces everything inside the element; adding would need appendChild (or +=)."], ["kept, new items added first", false, "innerHTML = … throws the old content away."]] } },
        { code: `let items = document.getElementsByTagName("li");`, apply(st) { const found = domAll(st.tree, (n) => n.tag === "li"); return { lit: Object.fromEntries(found.map((n, i) => [n.id, String(i)])), text: `getElementsByTagName("li") now finds ${found.length} elements, [0] "Amy Alam" and [1] "Lin Chen": the old items are no longer in the DOM tree.` }; },
          ask: { q: "How many <li> does it find now?", opts: [["2", true], ["3", false, "The three original items were removed when innerHTML replaced the subtree."], ["5", false, "Removed elements are no longer in the tree, so they are not found."]] } },
      ],
      note: "Slide 153's page, with id=\"team\" added to the <ul> for this example; the names in the new list are made up.",
    };
  },
};
const DOM_PRESET_NAMES = { button: "createElement + appendChild", innerHTML: "innerHTML + getElementById", byTag: "getElementsByTagName" };
function domBuildPlay(box, cfg) {
  injectCss();
  let preset = DOM_PRESETS[cfg.preset] ? cfg.preset : "button";
  let P = null, states = [], metas = [], pb = null;
  box.append(el("h4", null, cfg.title || "DOM calls, one line at a time"));
  const presetKeys = Object.keys(DOM_PRESETS);
  const presetRow = choice(presetKeys.map((k) => DOM_PRESET_NAMES[k]), presetKeys.indexOf(preset), (i) => { preset = presetKeys[i]; restart(); });
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = true;
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const pk = predictKit(ask, "Predict each line before it runs", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const code = el("ol", "w2-code");
  const cols = el("div", "w2-row");
  const left = el("div", "w2-col"), right = el("div", "w2-col");
  const treeBox = el("div", "w2-tree");
  const floatBox = el("div", "w2-float");
  const page = el("div", "w2-page");
  const pageBar = el("div", "w2-page-bar"), pageBody = el("div", "w2-page-body");
  page.append(pageBar, pageBody);
  const consoleBox = el("pre", "w2-pre");
  left.append(el("div", "w2-sec", "DOM tree (in memory)"), treeBox, floatBox);
  right.append(el("div", "w2-sec", "Rendered page"), page, consoleBox);
  cols.append(left, right);
  const note = el("p", "widget-note");
  box.append(presetRow.row, pk.row, el("div", "w2-sec", "Script"), code, cols, caption, ask);

  function build() {
    domUid = 0;
    P = DOM_PRESETS[preset]();
    states = [{ tree: P.tree, floating: [], vars: {}, log: [] }];
    metas = [];
    for (const s of P.steps) {
      const st = JSON.parse(JSON.stringify(states[states.length - 1]));
      const m = s.apply(st);
      if (m.log != null) st.log.push(m.log);
      metas.push(m);
      states.push(st);
    }
    code.innerHTML = "";
    P.steps.forEach((s) => code.append(el("li", null, s.code)));
    note.textContent = P.note || "";
  }
  function drawTree(st, look) {
    treeBox.innerHTML = "";
    treeBox.append(el("div", "w2-dim", "document"));
    const walk = (n, depth) => {
      const row = el("div", "w2-node" + (n.text != null ? " w2-txt" : ""));
      row.style.marginLeft = 4 + depth * 14 + "px";
      row.textContent = n.text != null ? `"${n.text}"` : `<${n.tag}${n.attr ? " " + n.attr : ""}>${n.varName ? "" : ""}`;
      look(n, row);
      treeBox.append(row);
      for (const k of n.kids || []) walk(k, depth + 1);
    };
    walk(st.tree, 1);
    floatBox.innerHTML = "";
    floatBox.hidden = !states.some((x) => x.floating.length);
    floatBox.append(el("span", "w2-dim", "in memory, not in the tree: "));
    if (!st.floating.length) floatBox.append(el("span", "w2-dim", "nothing"));
    for (const n of st.floating) {
      const sp = el("span", "w2-node");
      sp.style.cssText = "display:inline-block;margin:2px 6px 2px 0";
      sp.textContent = `${n.varName} = <${n.tag}>${n.kids.length ? ` "${n.kids[0].text}"` : ""}`;
      look(n, sp);
      floatBox.append(sp);
    }
  }
  function drawPage(st, look) {
    const title = domAll(st.tree, (n) => n.tag === "title")[0];
    pageBar.textContent = "▢ " + (title && title.kids[0] ? title.kids[0].text : "");
    pageBody.innerHTML = "";
    const make = (n) => {
      if (n.text != null) { const t = document.createElement("span"); t.textContent = n.text; look(n, t, true); return t; }
      if (n.tag === "script" || n.tag === "head") return null;
      const e = document.createElement(["h1", "h2", "p", "ul", "li", "button"].includes(n.tag) ? n.tag : "div");
      if (n.tag === "button") { e.type = "button"; e.tabIndex = -1; }
      for (const k of n.kids || []) { const c = make(k); if (c) e.append(c); }
      look(n, e, true);
      return e;
    };
    const body = domBody(st);
    for (const k of body.kids) { const c = make(k); if (c) pageBody.append(c); }
    if (!body.kids.some((k) => k.tag !== "script")) pageBody.append(el("span", "w2-dim", "(empty page)"));
  }
  function frame(pos) {
    const N = P.steps.length, q = pk.asking(pos, N);
    const s = q ? pk.answered : Math.ceil(pos - 1e-9) - 1; // step in progress or just finished
    const u = q ? 0 : clamp(pos - s, 0, 1);
    const atRest = !q && s >= 0 && u >= 1 - 1e-9;
    const before = !q && s >= 0 && u < 0.5;
    const st = q ? states[pk.answered] : s < 0 ? states[0] : before ? states[s] : states[s + 1];
    const m = !q && s >= 0 ? metas[s] : null;
    const fadeIn = m && !before ? (atRest ? 1 : clamp((u - 0.5) * 2, 0, 1)) : 1;
    const look = (n, node, page) => {
      if (!m) return;
      const litCls = page ? "w2-pg-lit" : "w2-lit";
      if (before) {
        if ((m.tgt || []).includes(n.id)) node.classList.add(page ? litCls : "w2-tgt");
        if ((m.gone || []).includes(n.id)) { node.classList.add(page ? "w2-pg-lit" : "w2-gone"); node.style.opacity = String(1 - u * 2 * 0.8); }
        return;
      }
      if (m.lit && n.id in m.lit) { node.classList.add(litCls); if (m.lit[n.id] !== "") node.setAttribute(page ? "data-idx" : "data-i", m.lit[n.id]); if (!page && m.lit[n.id] !== "") node.append(el("span", "w2-idx", `[${m.lit[n.id]}]`)); }
      if ((m.add || []).includes(n.id)) { node.classList.add(page ? "w2-pg-add" : "w2-add"); node.style.opacity = String(0.2 + 0.8 * fadeIn); }
    };
    drawTree(st, look);
    drawPage(st, look);
    const lines = code.children;
    for (let i = 0; i < lines.length; i++) {
      const cur = i === (q ? pk.answered : s);
      lines[i].classList.toggle("w2-cur", cur);
      lines[i].classList.toggle("w2-done", !cur && i < (q ? pk.answered : s));
    }
    const hasLog = P.steps.some((x, i) => metas[i].log != null);
    consoleBox.hidden = !hasLog;
    if (hasLog) consoleBox.textContent = "console: " + (st.log.length ? st.log.join("\n") : "");
    let text;
    if (q) text = `Line ${pk.answered + 1}: ${P.steps[pk.answered].code} ${P.steps[pk.answered].ask.q}`;
    else if (s < 0) text = "Press Play to run the script one line at a time. The DOM tree is what the browser keeps in memory; the rendered page is what it draws from that tree.";
    else {
      text = `Line ${s + 1}: ${m.text}`;
      if (s === N - 1 && atRest) text += pk.tally();
    }
    setText(caption, text);
    if (q) {
      const a = P.steps[pk.answered].ask;
      pk.render(true, `${preset}`, a.opts.map(([label, ok, why]) => ({ label, ok, why: why || "" })));
    } else pk.render(false);
  }
  function restart() {
    build();
    pk.reset();
    pb.reset(P.steps.length);
  }
  build();
  pb = createPlayback({ count: P.steps.length, unit: "line", onFrame: frame, stepMs: () => cfg.stepMs || 1100, limit: () => pk.limit(P.steps.length), onBlocked: () => pk.nudge() });
  box.append(pb.el, note);
  restart();
}

// ---------- widget: db-relate ----------
// Lecture 7 slides 16-30 and 66-70: patient/visit (slide 25's SQL and data), 1:M from patient to
// visit (slide 23), the referential integrity constraint (slide 30), authors/books M:M (slides 66-68).
function dbRelate(box, cfg) {
  injectCss();
  const RELS = ["1:M", "1:1", "M:M"];
  let rel = RELS.includes(cfg.relation) ? cfg.relation : "1:M";
  let sel = null, extra = [], msg = null, deleted = false;
  box.append(el("h4", null, cfg.title || "Related tables: click a row"));
  const relRow = choice(["1:M  patient → visit", "1:1  UNIQUE foreign key", "M:M  authors and books"], RELS.indexOf(rel), (i) => { rel = RELS[i]; reset(); });
  const tables = el("div", "w2-row");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const tryRow = el("div", "w2-kv");
  const out = el("pre", "w2-pre");
  const note = el("p", "widget-note");
  box.append(relRow.row, tables, caption, el("div", "w2-sec", "Referential integrity"), tryRow, out, note);
  const PAT = [{ patientid: 1, name: "Sara Brown" }, { patientid: 2, name: "John Smith" }, { patientid: 3, name: "Jack Ma" }];
  const VIS = [{ visitid: 1, patientid: 1, visitDate: "2002-01-01" }, { visitid: 2, patientid: 2, visitDate: "2018-08-08" }, { visitid: 3, patientid: 2, visitDate: "2019-09-09" }];
  const AUT = [{ authorID: 1, name: "Sarah Brown" }, { authorID: 2, name: "John Smith" }];
  const BOOK = [{ bookID: 1, title: "The Moon" }, { bookID: 2, title: "The Earth" }, { bookID: 3, title: "The Sun" }];
  const AB = [{ authorID: 1, bookID: 1 }, { authorID: 1, bookID: 2 }, { authorID: 2, bookID: 2 }, { authorID: 2, bookID: 3 }];
  const patients = () => PAT.filter((p) => !(deleted && p.patientid === 2));
  const visits = () => VIS.concat(extra.filter((r) => r.t === "visit").map((r) => r.row));
  const links = () => AB.concat(extra.filter((r) => r.t === "ab").map((r) => r.row));
  // In 1:1 the foreign key is UNIQUE: a second visit for the same patient is invalid.
  const invalidVisit = (v, i, all) => rel === "1:1" && all.findIndex((x) => x.patientid === v.patientid) < i;

  function table(cap, cols, rows, key, litFn, cls) {
    const t = el("table", "w2-table");
    t.append(el("caption", null, cap));
    const thead = el("thead"), tr = el("tr");
    for (const c of cols) {
      const th = el("th", null, c.name);
      for (const tg of c.tags || []) th.append(el("span", "w2-tag w2-tag-" + tg.toLowerCase(), tg));
      tr.append(th);
    }
    thead.append(tr);
    t.append(thead);
    const tb = el("tbody");
    rows.forEach((r, i) => {
      const row = el("tr");
      const extraCls = cls ? cls(r, i) : "";
      if (extraCls) row.classList.add(extraCls);
      const l = litFn(r);
      if (l) row.classList.add(l);
      for (const c of cols) row.append(el("td", null, String(r[c.name])));
      row.tabIndex = 0;
      const pick = () => { sel = sel && sel.t === key && sel.r === r ? null : { t: key, r }; msg = null; render(); };
      row.addEventListener("click", pick);
      row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      tb.append(row);
    });
    t.append(tb);
    const w = el("div", "w2-scroll-x");
    w.append(t);
    return w;
  }
  function render() {
    tables.innerHTML = "";
    let text;
    if (rel !== "M:M") {
      const P = patients(), V = visits();
      const litP = (p) => (sel && sel.t === "patient" && sel.r === p ? "w2-src" : sel && sel.t === "visit" && sel.r.patientid === p.patientid ? "w2-lit" : "");
      const litV = (v) => (sel && sel.t === "visit" && sel.r === v ? "w2-src" : sel && sel.t === "patient" && sel.r.patientid === v.patientid ? "w2-lit" : "");
      tables.append(
        table("patient", [{ name: "patientid", tags: ["PK"] }, { name: "name" }], P, "patient", litP),
        table("visit", [{ name: "visitid", tags: ["PK"] }, { name: "patientid", tags: rel === "1:1" ? ["FK", "UQ"] : ["FK"] }, { name: "visitDate" }], V, "visit", litV,
          (v, i) => (invalidVisit(v, i, V) ? "w2-bad" : extra.some((r) => r.row === v) ? "w2-new" : "")),
      );
      const bad = V.filter((v, i) => invalidVisit(v, i, V));
      if (sel && sel.t === "patient") {
        const mine = V.filter((v) => v.patientid === sel.r.patientid);
        text = `Patient ${sel.r.patientid} (${sel.r.name}) has ${mine.length ? `${mine.length} visit${mine.length > 1 ? "s" : ""}: visitid ${mine.map((v) => v.visitid).join(", ")}` : "no visits"}, matched through patientid. ${mine.length > 1 ? "A single patient (single row) in the Patient table can relate to multiple rows of the Visit table." : mine.length ? "" : "WHERE patient.patientid = visit.patientid has no match for this patient, so a join leaves this patient out."}`;
      } else if (sel && sel.t === "visit") {
        const p = P.find((x) => x.patientid === sel.r.patientid);
        text = `Visit ${sel.r.visitid} has patientid ${sel.r.patientid}, the foreign key: a primary key of another table present in this table. It points to ${p ? `patient ${p.patientid}, ${p.name}` : "no patient"}.`;
      } else text = rel === "1:1"
        ? `With UNIQUE on the foreign key column patientid, each patient can appear in visit at most once: one to one relationship means a patient could visit the office "only" once! Visit ${bad.map((v) => v.visitid).join(", ")} repeats patientid 2, so it is invalid (MySQL would refuse it: Duplicate entry '2' for key 'patientid').`
        : "One patient can visit multiple times: a one to Many (1:M) relationship from Patient to Visit, through patientid (primary key in patient, foreign key in visit). Click a patient to light its visits, or a visit to light its patient.";
    } else {
      const L = links();
      const litA = (a) => (sel && sel.t === "author" && sel.r === a ? "w2-src" : sel && sel.t === "ab" && sel.r.authorID === a.authorID ? "w2-lit" : sel && sel.t === "book" && L.some((l) => l.bookID === sel.r.bookID && l.authorID === a.authorID) ? "w2-lit" : "");
      const litB = (b) => (sel && sel.t === "book" && sel.r === b ? "w2-src" : sel && sel.t === "ab" && sel.r.bookID === b.bookID ? "w2-lit" : sel && sel.t === "author" && L.some((l) => l.authorID === sel.r.authorID && l.bookID === b.bookID) ? "w2-lit" : "");
      const litL = (l) => (sel && sel.t === "ab" && sel.r === l ? "w2-src" : sel && sel.t === "author" && sel.r.authorID === l.authorID ? "w2-lit" : sel && sel.t === "book" && sel.r.bookID === l.bookID ? "w2-lit" : "");
      tables.append(
        table("author", [{ name: "authorID", tags: ["PK"] }, { name: "name" }], AUT, "author", litA),
        table("authorBook", [{ name: "authorID", tags: ["PK", "FK"] }, { name: "bookID", tags: ["PK", "FK"] }], L, "ab", litL, (l) => (extra.some((r) => r.row === l) ? "w2-new" : "")),
        table("book", [{ name: "bookID", tags: ["PK"] }, { name: "title" }], BOOK, "book", litB),
      );
      if (sel && sel.t === "author") {
        const bs = L.filter((l) => l.authorID === sel.r.authorID).map((l) => BOOK.find((b) => b.bookID === l.bookID).title);
        text = `${sel.r.name} (authorID ${sel.r.authorID}) has ${bs.length} rows in authorBook, so ${bs.length} book${bs.length === 1 ? "" : "s"}: ${bs.join(", ")}. Author to authorBook is 1:M.`;
      } else if (sel && sel.t === "book") {
        const as = L.filter((l) => l.bookID === sel.r.bookID).map((l) => AUT.find((a) => a.authorID === l.authorID).name);
        text = `"${sel.r.title}" (bookID ${sel.r.bookID}) has ${as.length} author${as.length === 1 ? "" : "s"}: ${as.join(" and ")}. Book to authorBook is 1:M too.`;
      } else if (sel && sel.t === "ab") text = `The row (${sel.r.authorID}, ${sel.r.bookID}) links one author to one book. Its composite primary key (authorID, bookID) means the same pair cannot be stored twice; each column is also a foreign key, one per parent table.`;
      else text = "Sarah Brown authored \"The Moon\"; Sarah Brown and John Smith co-authored \"The Earth\"; John Smith authored \"The Sun\". The table authorBook which links the other two tables is referred as associative entity or associative table: Author → authorBook is 1:M and Book → authorBook is 1:M, which together make M:M.";
    }
    setText(caption, text);
    if (msg) { out.textContent = msg.text; out.className = "w2-pre " + (msg.ok ? "w2-ok" : "w2-err"); out.hidden = false; } else out.hidden = true;
  }
  function drawTry() {
    tryRow.innerHTML = "";
    if (rel !== "M:M") {
      const pid = textIn("5", "patientid for the new visit");
      pid.style.cssText = "width:56px;flex:0 0 56px";
      const ins = button("INSERT visit", () => {
        const id = parseInt(pid.value, 10);
        const V = visits(), nextId = Math.max(...V.map((v) => v.visitid)) + 1;
        const sql = `INSERT INTO visit VALUES (${nextId}, ${Number.isFinite(id) ? id : "NULL"}, '2020-02-02');`;
        if (!Number.isFinite(id)) msg = { ok: false, text: `${sql}\n#1048 - Column 'patientid' cannot be null (it is NOT NULL)` };
        else if (!patients().some((p) => p.patientid === id)) msg = { ok: false, text: `${sql}\n#1452 - Cannot add or update a child row: a foreign key constraint fails (CONSTRAINT \`fk_has_patient\` FOREIGN KEY (\`patientid\`) REFERENCES \`patient\` (\`patientid\`))\n\nRefused: there is no patient ${id}, and visit.patientid must match a patient.patientid.` };
        else if (rel === "1:1" && V.some((v, i) => v.patientid === id && !invalidVisit(v, i, V))) msg = { ok: false, text: `${sql}\n#1062 - Duplicate entry '${id}' for key 'patientid'\n\nRefused by UNIQUE: patient ${id} already has a visit.` };
        else { extra.push({ t: "visit", row: { visitid: nextId, patientid: id, visitDate: "2020-02-02" } }); msg = { ok: true, text: `${sql}\nInserted: patient ${id} exists, so the foreign key is satisfied.` }; }
        sel = null; render();
      });
      const del = button("DELETE patient 2", () => {
        const sql = "DELETE FROM patient WHERE patientid = 2;";
        if (deleted) msg = { ok: true, text: `${sql}\n0 rows affected.` };
        else if (visits().some((v) => v.patientid === 2)) msg = { ok: false, text: `${sql}\n#1451 - Cannot delete or update a parent row: a foreign key constraint fails (CONSTRAINT \`fk_has_patient\` ...)\n\nSlide 30: the 2nd and 3rd rows of Visit table would not make sense! The constraint refuses the delete.` };
        else { deleted = true; msg = { ok: true, text: `${sql}\n1 row deleted: no visit refers to patient 2.` }; }
        sel = null; render();
      });
      tryRow.append(el("span", "w2-dim", "new visit for patientid"), pid, ins, del, button("reset", reset));
      note.textContent = "Data from slide 25's SQL (CREATE TABLE patient / visit with CONSTRAINT fk_has_patient FOREIGN KEY(patientid) REFERENCES patient(patientid)). The #1452 and #1062 messages are MySQL's wording; the slides show only the constraint.";
    } else {
      const a = textIn("3", "authorID"), b = textIn("1", "bookID");
      a.style.cssText = b.style.cssText = "width:44px;flex:0 0 44px";
      const ins = button("INSERT authorBook", () => {
        const ai = parseInt(a.value, 10), bi = parseInt(b.value, 10);
        const sql = `INSERT INTO authorBook VALUES (${ai}, ${bi});`;
        if (!AUT.some((x) => x.authorID === ai)) msg = { ok: false, text: `${sql}\n#1452 - Cannot add or update a child row: a foreign key constraint fails (CONSTRAINT \`fk_has_author\` ...)\n\nRefused: no author ${ai}.` };
        else if (!BOOK.some((x) => x.bookID === bi)) msg = { ok: false, text: `${sql}\n#1452 - Cannot add or update a child row: a foreign key constraint fails (CONSTRAINT \`fk_has_book\` ...)\n\nRefused: no book ${bi}.` };
        else if (links().some((l) => l.authorID === ai && l.bookID === bi)) msg = { ok: false, text: `${sql}\n#1062 - Duplicate entry '${ai}-${bi}' for key 'PRIMARY'\n\nRefused: the composite primary key (authorID, bookID) already has this pair.` };
        else { extra.push({ t: "ab", row: { authorID: ai, bookID: bi } }); msg = { ok: true, text: `${sql}\nInserted: author ${ai} is now linked to book ${bi}.` }; }
        sel = null; render();
      });
      tryRow.append(el("span", "w2-dim", "authorID"), a, el("span", "w2-dim", "bookID"), b, ins, button("reset", reset));
      note.textContent = "Data from slide 66; columns from slide 67's SQL (PRIMARY KEY(authorID, bookID), fk_has_author, fk_has_book). The #1452 and #1062 messages are MySQL's wording.";
    }
  }
  function reset() { sel = null; extra = []; msg = null; deleted = false; drawTry(); render(); }
  reset();
}

// ---------- widget: css-box ----------
// Lecture 1 slides 177-184: the box model's four parts, display (block, inline, none),
// visibility:hidden, and position (static, fixed; the slide's absolute example).
function cssBox(box, cfg) {
  injectCss();
  const num = (v, d, lo, hi) => (Number.isFinite(+v) ? clamp(Math.round(+v), lo, hi) : d);
  const v = {
    width: num(cfg.width, 120, 20, 400), height: num(cfg.height, 40, 10, 200),
    padding: num(cfg.padding, 10, 0, 60), border: num(cfg.border, 2, 0, 30), margin: num(cfg.margin, 20, 0, 60),
  };
  box.append(el("h4", null, cfg.title || "The box model: content, padding, border, margin"));
  const sliders = {};
  const LIMS = { width: [20, 400], height: [10, 200], padding: [0, 60], border: [0, 30], margin: [0, 60] };
  const LABEL = { width: "content width", height: "content height", padding: "padding", border: "border", margin: "margin" };
  const sl = el("div", "w2-sliders");
  for (const k of ["width", "height", "padding", "border", "margin"]) {
    const row = el("div", "slider-row");
    const lab = el("label", null, LABEL[k]);
    const input = document.createElement("input");
    input.type = "range"; input.min = LIMS[k][0]; input.max = LIMS[k][1]; input.step = 1; input.value = v[k];
    input.setAttribute("aria-label", LABEL[k]);
    const val = el("span", "val", v[k] + " px");
    input.addEventListener("input", () => { v[k] = +input.value; val.textContent = v[k] + " px"; drawBox(); });
    row.append(lab, input, val);
    sl.append(row);
    sliders[k] = { input, val };
  }
  const presets = el("div", "viz-btn-row");
  const setAll = (o) => { Object.assign(v, o); for (const k in sliders) { sliders[k].input.value = v[k]; sliders[k].val.textContent = v[k] + " px"; } drawBox(); };
  presets.append(button("slide 178: 300 / 20 / 10 / 30", () => setAll({ width: 300, height: 60, padding: 20, border: 10, margin: 30 })), button("no padding, border or margin", () => setAll({ padding: 0, border: 0, margin: 0 })));
  const svg = svgEl("svg", { class: "w2-boxes", role: "img" });
  const legend = el("div", "w2-legend");
  const total = el("p", "playback-caption");
  total.setAttribute("aria-live", "polite");
  box.append(sl, presets, svg, legend, total);
  function drawBox() {
    const { width: w, height: h, padding: p, border: b, margin: m } = v;
    const W = w + 2 * (p + b + m), H = h + 2 * (p + b + m);
    const pad = 4, VW = Math.max(W, 160) + 2 * pad, VH = H + 2 * pad;
    svg.setAttribute("viewBox", `0 0 ${VW} ${VH}`);
    svg.style.maxWidth = Math.max(260, VW) + "px";
    svg.setAttribute("aria-label", `Nested boxes: margin ${m}, border ${b}, padding ${p}, content ${w} by ${h} pixels`);
    svg.innerHTML = "";
    const x0 = (VW - W) / 2, y0 = pad, fs = Math.max(9, Math.min(13, VW / 30));
    const rect = (o, fill, stroke, dash) => svg.append(svgEl("rect", { x: x0 + o, y: y0 + o, width: W - 2 * o, height: H - 2 * o, fill, stroke, "stroke-width": 1, "stroke-dasharray": dash || "none" }));
    rect(0, "var(--paper-3)", "var(--ink-dim)", "4 3");
    if (b > 0) rect(m, "var(--green)", "var(--green)");
    rect(m + b, "var(--paper)", "var(--rule-strong)");
    rect(m + b + p, "var(--paper-2)", "var(--ink-dim)", "4 3");
    const label = (o, band, text, color) => { if (band >= fs * 1.25) svg.append(svgEl("text", { x: x0 + o + 4, y: y0 + o + Math.min(band, fs * 1.6) - 3, "font-size": fs, fill: color }, text)); };
    label(0, m, "Margin", "var(--ink-2)");
    label(m, b, "Border", "var(--paper)");
    label(m + b, p, "Padding", "var(--ink-2)");
    svg.append(svgEl("text", { x: x0 + W / 2, y: y0 + H / 2 + fs / 3, "text-anchor": "middle", "font-size": fs, fill: "var(--ink)" }, h >= fs ? `Content ${w} × ${h}` : ""));
    legend.innerHTML = "";
    for (const [name, fill, val] of [["Margin", "var(--paper-3)", `${m} px`], ["Border", "var(--green)", `${b} px`], ["Padding", "var(--paper)", `${p} px`], ["Content", "var(--paper-2)", `${w} × ${h} px`]]) {
      const sp = el("span");
      const sw = el("span", "w2-swatch");
      sw.style.background = fill;
      sp.append(sw, el("b", null, name), ` ${val}`);
      legend.append(sp);
    }
    setText(total, `Total width = content + 2·padding + 2·border + 2·margin = ${w} + 2·${p} + 2·${b} + 2·${m} = ${W} px; total height = ${h} + 2·${p} + 2·${b} + 2·${m} = ${H} px. The width property sets only the content (box-sizing: content-box, the default). Padding and margin are transparent; the border goes around the padding and content.`);
  }
  drawBox();

  // display and visibility
  box.append(el("div", "w2-sec", "display and visibility on the middle box"));
  let disp = "inline", hidden = false;
  const dRow = choice(["display: inline", "display: block", "display: none"], 0, (i) => { disp = ["inline", "block", "none"][i]; drawDisp(); });
  const vis = check("visibility: hidden", false);
  vis.cb.addEventListener("change", () => { hidden = vis.cb.checked; drawDisp(); });
  const demo = el("div", "w2-inline-demo");
  const spans = ["first", "middle", "last"].map((t, i) => el("span", "w2-ib" + (i === 1 ? " w2-mid" : ""), t));
  demo.append("Text before ", spans[0], " and ", spans[1], " and ", spans[2], " after.");
  const dNote = el("p", "playback-caption");
  dNote.setAttribute("aria-live", "polite");
  box.append(dRow.row, vis.row, demo, dNote);
  function drawDisp() {
    spans[1].style.display = disp;
    spans[1].style.visibility = hidden ? "hidden" : "visible";
    let t;
    if (disp === "none") t = "display: none removes the element from the screen without deleting it: the other boxes close up as if it were not there.";
    else if (hidden) t = `visibility:hidden also hides an element. However, the element will still take up the same space as before: the gap stays${disp === "block" ? ", a whole line of it" : ""}.`;
    else if (disp === "block") t = "A block-level element always starts on a new line and takes up the full width available.";
    else t = "An inline element does not start on a new line and only takes up as much width as necessary (span, a and img are inline by default).";
    if (disp === "none" || hidden) t += " In both cases the element is not removed from the DOM tree.";
    if (disp === "none" && hidden) t += " (visibility has no visible effect while display is none.)";
    setText(dNote, t);
  }
  drawDisp();

  // position
  box.append(el("div", "w2-sec", "position on the small box (left: 20px; top: 10px); scroll the window"));
  let pos = "static";
  const pRow = choice(["static", "absolute", "fixed"], 0, (i) => { pos = ["static", "absolute", "fixed"][i]; drawPos(); });
  const win = el("div", "w2-win");
  const bar = el("div", "w2-win-bar", "browser window");
  const scroller = el("div", "w2-win-scroll");
  scroller.tabIndex = 0;
  scroller.setAttribute("aria-label", "Scrolling page");
  const content = el("div", "w2-win-content");
  const posBox = el("div", "w2-posbox");
  const paras = Array.from({ length: 9 }, (_, i) => el("p", null, `Paragraph ${i + 1} of the page.`));
  content.append(paras[0], paras[1]);
  content.append(posBox);
  for (let i = 2; i < paras.length; i++) content.append(paras[i]);
  scroller.append(content);
  win.append(bar, scroller);
  const pNote = el("p", "playback-caption");
  pNote.setAttribute("aria-live", "polite");
  box.append(pRow.row, win, pNote);
  function drawPos() {
    posBox.textContent = `position: ${pos}`;
    posBox.style.position = "static"; posBox.style.left = posBox.style.top = "";
    if (posBox.parentNode !== content) content.insertBefore(posBox, paras[2]);
    if (pos === "absolute") { posBox.style.position = "absolute"; posBox.style.left = "20px"; posBox.style.top = "10px"; }
    if (pos === "fixed") {
      // A real position:fixed would pin to this app's window; the frame stands in for the browser window.
      win.append(posBox);
      posBox.style.position = "absolute"; posBox.style.left = "20px"; posBox.style.top = "30px";
    }
    const t = {
      static: "static: Default value. Elements render in order, as they appear in the document flow; left and top have no effect.",
      absolute: "absolute (the slide's example, style=\"left:20px; position: absolute;\"): the box leaves the flow and is placed relative to its nearest positioned ancestor, here the page content, so it scrolls with the page. The slide does not define absolute.",
      fixed: "fixed: The element is positioned relative to the browser window: it stays put while the page scrolls under it. (In this frame the grey box stands in for the window.)",
    }[pos];
    setText(pNote, t);
  }
  drawPos();
}

// ---------- widget: arch-compare (P3) ----------
// Lecture 2 slides 10-22: monolithic, layered (n-tier), microservices; slide 16's definitions.
const ARCH = {
  monolithic: {
    name: "Monolithic",
    def: "All application logic (UI, business logic, data access) is bundled together in a single deployable unit. Entire software typically resides on one machine, written in one backend stack (slides 11, 19).",
    pros: ["Simple to build and deploy (slide 19).", "Best for: prototyping, MVPs, apps that won't need frequent independent updates (slide 11)."],
    cons: ["Hard to scale and maintain as complexity grows (slide 19).", "To add a new feature: 1- shut down entire application, 2- add the new feature, 3- (may need to) recompile everything before deployment (slide 11).", "A critical bug in the payment module: shut down the entire application, fix the bug, potentially recompile everything, then redeploy (slide 10)."],
  },
  layered: {
    name: "Layered (n-Tier)",
    def: "Separate concerns into layers. Each layer handles one responsibility. Layers = functional elements (slides 12, 13).",
    pros: ["Slide 12's question is the reason for it: changing the database doesn't require rewriting the UI.", "Each layer handles one responsibility (slide 12)."],
    cons: ["The deck gives no list of cons for the layered pattern."],
  },
  microservices: {
    name: "Microservices",
    def: "A collection of loosely coupled, independently deployable services. Each handles one function and communicates via API (slides 14, 20).",
    pros: ["Update or fix one service without shutting everything down.", "Each service = one function → assign separate teams, speed up development.", "Each service can reside in a separate machine, use a different tech stack.", "If Facebook shuts down, Messenger can keep running, because Messenger is a separate service (slide 14)."],
    cons: ["Communication between services = many API calls → complexity increases.", "Requires orchestration, monitoring, and careful API design."],
    used: "Used by: Uber, Netflix, Amazon, eBay, SoundCloud, Groupon (slide 20).",
  },
};
function archCompare(box, cfg) {
  injectCss();
  const KEYS = Object.keys(ARCH);
  let pattern = KEYS.includes(cfg.pattern) ? cfg.pattern : "monolithic";
  box.append(el("h4", null, cfg.title || "One picture, three architectures"));
  const row = choice(KEYS.map((k) => ARCH[k].name), KEYS.indexOf(pattern), (i) => { pattern = KEYS[i]; draw(); });
  const pic = el("div", "w2-arch");
  pic.setAttribute("role", "img");
  const def = el("p", "playback-caption");
  def.setAttribute("aria-live", "polite");
  const lists = el("div", "w2-row");
  box.append(row.row, pic, def, lists);
  box.append(el("div", "w2-sec", "Reliability vs robustness vs resilience (slide 16)"));
  const rrr = el("ul", "w2-list");
  for (const [t, d, ex] of [
    ["Reliability", "works correctly and consistently under normal conditions.", "A banking API successfully returns balances for almost every valid request."],
    ["Robustness", "handles bad input or unexpected conditions safely.", "Invalid JSON returns 400 Bad Request; the API does not crash or corrupt data."],
    ["Resilience", "continues essential service or recovers after disruption.", "If recommendations fail, an online store still lets users search, add items to carts, and pay."],
  ]) {
    const li = el("li");
    li.append(el("b", null, t + ": "), d + " ", el("span", "w2-dim", "Example: " + ex));
    rrr.append(li);
  }
  box.append(rrr, el("p", "widget-note", "Memory aid: Reliable = works normally · Robust = handles bad conditions · Resilient = survives and recovers from failure."));
  const abox = (title, sub, cls = "") => { const b = el("div", "w2-abox " + cls, title); if (sub) b.append(el("small", null, sub)); return b; };
  const arrow = (t) => el("div", "w2-arrow", t);
  function draw() {
    pic.innerHTML = "";
    const A = ARCH[pattern];
    if (pattern === "monolithic") {
      const unit = abox("One deployable unit", "one machine, one backend stack", "w2-hot");
      unit.style.textAlign = "left";
      const inner = el("div", "w2-arch");
      inner.append(abox("UI"), abox("Business logic"), abox("Data access"));
      unit.append(inner);
      pic.append(abox("Users (browser)"), arrow("↕"), unit, arrow("↕"), abox("Database", null, "w2-db"));
    } else if (pattern === "layered") {
      pic.append(abox("Users (browser)"), arrow("↕"));
      [["Presentation layer (UI layer)", "interaction with the end-user is handled (e.g. form page)"], ["Business layer (business logic)", "controls the application's logic (e.g. decision making, routing requests)"], ["Application layer", "where the core functions of the app are implemented (e.g. libraries)"], ["Data access layer", "where access and retrieval of data are handled (e.g. databases)"]]
        .forEach(([t, s], i) => { if (i) pic.append(arrow("↕")); pic.append(abox(t, s, "w2-hot")); });
      pic.append(arrow("↕"), abox("Database", null, "w2-db"));
    } else {
      pic.append(abox("Clients", "Client scripts (HTML, AJAX)"), arrow("↓ AJAX API calls     ↑ JSON"), abox("API gateway", "the only portal in touch with the outside world", "w2-hot"), arrow("↕   ↕   ↕"));
      const svc = el("div", "w2-arow");
      for (const [t, where] of [["user profile service", "USA"], ["inventory service", "Korea"], ["file service", ""]]) {
        const c = el("div");
        c.append(abox(t, where), arrow("↕"), abox("its own store", null, "w2-db"));
        svc.append(c);
      }
      pic.append(svc);
    }
    pic.setAttribute("aria-label", `${A.name} architecture`);
    setText(def, A.def);
    lists.innerHTML = "";
    for (const [h, items] of [["Pros", A.pros], ["Cons", A.cons]]) {
      const c = el("div", "w2-col");
      c.append(el("div", "w2-sec", h));
      const ul = el("ul", "w2-list");
      for (const t of items) ul.append(el("li", null, t));
      c.append(ul);
      lists.append(c);
    }
    if (A.used) lists.append(el("p", "widget-note", A.used));
    if (pattern === "microservices") lists.append(el("p", "widget-note", "The services and gateway follow the course figure (slide 22: services in the USA, Korea and Japan behind one API gateway). Slide 22 draws no database per service; the stores here mark that each service can be a separate machine with its own data."));
  }
  draw();
}

// ---------- widget: sql-order (P3) ----------
// Lecture 7 slides 49-60: the clause order Select / From / Where / Group by / Having (slide 55),
// ORDER BY last (slides 41, 51), and the WHERE / HAVING rules (slides 54-60). The Customers rows
// are made up for the widget (the slides use the w3schools Customers table).
const SQL_ROWS = [
  { CustomerID: 1, CustomerName: "Ana Lopez", City: "Mexico City", Country: "Mexico" },
  { CustomerID: 2, CustomerName: "Ben Ortiz", City: "Monterrey", Country: "Mexico" },
  { CustomerID: 3, CustomerName: "Chloe Martin", City: "Paris", Country: "France" },
  { CustomerID: 4, CustomerName: "Arjun Rao", City: "Vancouver", Country: "Canada" },
  { CustomerID: 5, CustomerName: "Dana Kim", City: "Toronto", Country: "Canada" },
  { CustomerID: 6, CustomerName: "Ali Haddad", City: "Mexico City", Country: "Mexico" },
];
const SQL_COLS = ["CustomerID", "CustomerName", "City", "Country"];
const SQL_KW = ["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY"];
const SQL_PRESETS = [
  ["slide 59 case 4 (ok)", "SELECT Country, COUNT(CustomerID) as c\nFROM Customers\nGROUP BY Country\nhaving c>2"],
  ["case 1: WHERE on COUNT()", "SELECT Country, COUNT(CustomerID)\nFROM Customers\nwhere COUNT(CustomerID) >2\nGROUP BY Country"],
  ["case 2: WHERE on alias", "SELECT Country, COUNT(CustomerID) as c\nFROM Customers\nwhere c>2\nGROUP BY Country"],
  ["case 3: HAVING first", "SELECT Country, COUNT(CustomerID) as c\nFROM Customers\nhaving c>2\nGROUP BY Country"],
  ["slide 58 (ok)", "SELECT Country, COUNT(CustomerID)\nFROM Customers\nwhere CustomerName like \"A%\"\nGROUP BY Country"],
  ["slide 58 (not ok)", "SELECT Country, COUNT(CustomerID)\nFROM Customers\nGROUP BY Country\nwhere CustomerName like \"A%\""],
  ["slide 51", "SELECT COUNT(CustomerID), Country\nFROM Customers\nGROUP BY Country\nORDER BY COUNT(CustomerID) DESC"],
  ["HAVING, no GROUP BY", "SELECT COUNT(CustomerID)\nFROM Customers\nHAVING COUNT(CustomerID) > 5"],
];
const SQL_AGG = ["COUNT", "MIN", "MAX", "SUM", "AVG"];
function sqlTokens(s) {
  const out = [], re = /\s*(?:(\d+(?:\.\d+)?)|'([^']*)'|"([^"]*)"|(<>|!=|<=|>=|=|<|>)|([(),*])|([A-Za-z_][\w.]*))/y;
  let m, i = 0;
  s = s.trim();
  while (i < s.length) {
    re.lastIndex = i;
    m = re.exec(s);
    if (!m || m[0].length === 0) throw new Error(`cannot read "${s.slice(i).trim().slice(0, 12)}"`);
    i = re.lastIndex;
    if (m[1] != null) out.push({ t: "num", v: +m[1] });
    else if (m[2] != null || m[3] != null) out.push({ t: "str", v: m[2] != null ? m[2] : m[3] });
    else if (m[4]) out.push({ t: "op", v: m[4] === "!=" ? "<>" : m[4] });
    else if (m[5]) out.push({ t: m[5] });
    else out.push({ t: "id", v: m[6], u: m[6].toUpperCase() });
    if (/^\s+$/.test(s.slice(i))) break;
  }
  return out;
}
/** Parses an expression: comparisons joined by AND / OR / NOT, operands are numbers, strings, columns and aggregates. */
function sqlExpr(tokens) {
  let p = 0;
  const peek = () => tokens[p], take = () => tokens[p++];
  const isKw = (k) => peek() && peek().t === "id" && peek().u === k;
  function or() { let a = and(); while (isKw("OR")) { take(); a = { k: "or", a, b: and() }; } return a; }
  function and() { let a = not(); while (isKw("AND")) { take(); a = { k: "and", a, b: not() }; } return a; }
  function not() { if (isKw("NOT")) { take(); return { k: "not", a: not() }; } return cmp(); }
  function cmp() {
    const a = operand();
    if (peek() && peek().t === "op") return { k: "cmp", op: take().v, a, b: operand() };
    if (isKw("LIKE")) { take(); return { k: "like", a, b: operand() }; }
    if (isKw("NOT") && tokens[p + 1] && tokens[p + 1].u === "LIKE") { take(); take(); return { k: "not", a: { k: "like", a, b: operand() } }; }
    return a;
  }
  function operand() {
    const t = take();
    if (!t) throw new Error("the expression ends too early");
    if (t.t === "num" || t.t === "str") return { k: "lit", v: t.v };
    if (t.t === "*") return { k: "star" };
    if (t.t === "(") { const e = or(); if (!peek() || take().t !== ")") throw new Error("missing )"); return e; }
    if (t.t === "id" && SQL_AGG.includes(t.u) && peek() && peek().t === "(") {
      take();
      let distinct = false;
      if (isKw("DISTINCT")) { take(); distinct = true; }
      const arg = peek() && peek().t === "*" ? (take(), { k: "star" }) : operand();
      if (!peek() || take().t !== ")") throw new Error(`missing ) after ${t.u}(`);
      return { k: "agg", fn: t.u, arg, distinct };
    }
    if (t.t === "id") return { k: "col", name: t.v };
    throw new Error(`unexpected "${t.v || t.t}"`);
  }
  const e = or();
  return { e, rest: tokens.slice(p) };
}
const sqlHasAgg = (e) => !!e && (e.k === "agg" || ["a", "b"].some((k) => e[k] && sqlHasAgg(e[k])));
const sqlCols = (e, out = []) => { if (!e) return out; if (e.k === "col") out.push(e.name); if (e.k !== "agg") { sqlCols(e.a, out); sqlCols(e.b, out); } return out; };
function sqlText(e) {
  if (!e) return "";
  if (e.k === "lit") return typeof e.v === "string" ? `"${e.v}"` : String(e.v);
  if (e.k === "star") return "*";
  if (e.k === "col") return e.name;
  if (e.k === "agg") return `${e.fn}(${e.distinct ? "DISTINCT " : ""}${sqlText(e.arg)})`;
  if (e.k === "cmp") return `${sqlText(e.a)} ${e.op} ${sqlText(e.b)}`;
  if (e.k === "like") return `${sqlText(e.a)} LIKE ${sqlText(e.b)}`;
  if (e.k === "not") return `NOT ${sqlText(e.a)}`;
  return `${sqlText(e.a)} ${e.k.toUpperCase()} ${sqlText(e.b)}`;
}
/** Splits a SELECT into its clauses in written order; blanks string contents so keywords inside quotes are ignored. */
function sqlClauses(q) {
  const blank = q.replace(/'[^']*'|"[^"]*"/g, (m) => m[0] + " ".repeat(m.length - 2) + m[0]);
  const re = /\b(SELECT|FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY)\b/gi;
  const hits = [];
  let m;
  while ((m = re.exec(blank))) hits.push({ kw: m[1].toUpperCase().replace(/\s+/, " "), at: m.index, end: re.lastIndex });
  return hits.map((h, i) => ({ kw: h.kw, text: q.slice(h.end, i + 1 < hits.length ? hits[i + 1].at : q.length).trim().replace(/;\s*$/, ""), lead: q.slice(0, hits[0] ? hits[0].at : 0).trim() }));
}
function sqlRun(q) {
  const cl = sqlClauses(q);
  const res = { clauses: cl, errors: [], notes: [], stages: [] };
  const fail = (msg, bad) => { res.errors.push(msg); res.bad = bad; return res; };
  if (!cl.length || cl[0].kw !== "SELECT" || cl[0].lead) return fail("Start with SELECT.");
  const seen = {};
  for (const c of cl) { if (seen[c.kw]) return fail(`${c.kw} is written twice.`); seen[c.kw] = c; }
  if (!seen.FROM) return fail("A SELECT needs FROM: which table?");
  // Written-order rules (slides 54-60).
  const idx = (k) => cl.findIndex((c) => c.kw === k);
  if (seen.WHERE && seen["GROUP BY"] && idx("WHERE") > idx("GROUP BY")) return fail(`Not ok! Where cannot be used after we grouped rows (slide 58). Rule 1 (slide 60): the "where" has to go before the "having" and the group by. Or place Where before Group by (slide 57). (A real database stops with a syntax error near "where".)`, "WHERE");
  if (seen.HAVING && seen["GROUP BY"] && idx("HAVING") < idx("GROUP BY")) return fail(`Not ok! Having cannot be used before we have grouped the rows! (slide 59, case 3). Rule 3 (slide 60): "having" has to be used only after we used "group by".`, "HAVING");
  if (seen.WHERE && seen.HAVING && idx("WHERE") > idx("HAVING")) return fail(`The "where" has to go before the "having" (slide 60, rule 1).`, "WHERE");
  const order = cl.map((c) => SQL_KW.indexOf(c.kw));
  if (order.some((v, i) => i && v < order[i - 1])) return fail(`Write the clauses in this order: ${SQL_KW.join(", ")} (slide 55's skeleton, with ORDER BY last as in slides 41 and 51).`);
  // SELECT list
  let items;
  try {
    items = [];
    const toks = sqlTokens(seen.SELECT.text);
    let cur = [], depth = 0;
    const parts = [];
    for (const t of toks) { if (t.t === "(") depth++; if (t.t === ")") depth--; if (t.t === "," && depth === 0) { parts.push(cur); cur = []; } else cur.push(t); }
    parts.push(cur);
    for (const part of parts) {
      if (!part.length) throw new Error("an empty item in the SELECT list");
      let alias = null, body = part;
      const asAt = part.findIndex((t) => t.t === "id" && t.u === "AS");
      if (asAt >= 0) { alias = part[asAt + 1] && part[asAt + 1].v; body = part.slice(0, asAt); if (!alias) throw new Error("AS needs a name"); }
      const { e, rest } = sqlExpr(body);
      if (rest.length) throw new Error(`unexpected "${rest[0].v || rest[0].t}" in SELECT`);
      items.push({ e, alias, label: alias || sqlText(e) });
    }
  } catch (err) { return fail(`SELECT: ${err.message}.`); }
  const from = seen.FROM.text.replace(/[[\]`]/g, "").trim();
  if (!/^customers$/i.test(from)) return fail(`This widget has one table, Customers (columns ${SQL_COLS.join(", ")}); FROM ${from} is not available.`);
  const aliases = Object.fromEntries(items.filter((i) => i.alias).map((i) => [i.alias.toLowerCase(), i]));
  const colName = (n) => SQL_COLS.find((c) => c.toLowerCase() === n.toLowerCase().replace(/^customers\./i, ""));
  const parse = (kw) => {
    const { e, rest } = sqlExpr(sqlTokens(seen[kw].text));
    if (rest.length) throw new Error(`unexpected "${rest[0].v || rest[0].t}"`);
    return e;
  };
  let where = null, having = null, groupCols = [], orderBy = [];
  try {
    if (seen.WHERE) {
      where = parse("WHERE");
      if (sqlHasAgg(where)) return fail(`Not ok! Where cannot be used on aggregate functions (slide 59, case 1). Rule 2 (slide 60): "where" cannot be used on aggregate functions. SQLite says: misuse of aggregate: ${where && JSON.stringify(sqlText(where)).includes("COUNT") ? "count()" : "an aggregate"} (slide 56). Use HAVING after GROUP BY.`, "WHERE");
      const al = sqlCols(where).find((c) => !colName(c) && aliases[c.toLowerCase()]);
      if (al) return fail(`Not ok! Where cannot be used on aggregate functions (place having ${sqlText(where)} after "group by") (slide 59, case 2): ${al} is an alias for ${sqlText(aliases[al.toLowerCase()].e)}, an aggregate. MySQL says: Unknown column '${al}' in 'where clause'.`, "WHERE");
    }
    if (seen["GROUP BY"]) groupCols = seen["GROUP BY"].text.split(",").map((s) => s.trim()).filter(Boolean);
    if (seen.HAVING) having = parse("HAVING");
    if (seen["ORDER BY"]) {
      for (const part of seen["ORDER BY"].text.split(",")) {
        const toks = sqlTokens(part);
        let desc = false;
        const last = toks[toks.length - 1];
        if (last && last.t === "id" && (last.u === "DESC" || last.u === "ASC")) { desc = last.u === "DESC"; toks.pop(); }
        const { e, rest } = sqlExpr(toks);
        if (rest.length) throw new Error(`unexpected "${rest[0].v || rest[0].t}" in ORDER BY`);
        orderBy.push({ e, desc });
      }
    }
  } catch (err) { return fail(err.message + "."); }
  for (const c of [...sqlCols(where), ...groupCols, ...items.flatMap((i) => sqlCols(i.e))]) if (!colName(c) && !aliases[c.toLowerCase()]) return fail(`Unknown column '${c}'. Customers has ${SQL_COLS.join(", ")}.`);
  // Evaluation
  const like = (v, pat) => new RegExp("^" + String(pat).replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".") + "$", "i").test(String(v));
  function val(e, ctx) {
    switch (e.k) {
      case "lit": return e.v;
      case "col": {
        const c = colName(e.name);
        if (c) return (ctx.row || (ctx.rows && ctx.rows[0]) || {})[c];
        const a = aliases[e.name.toLowerCase()];
        if (a && ctx.rows) return val(a.e, ctx);
        throw new Error(`Unknown column '${e.name}'`);
      }
      case "agg": {
        const rows = ctx.rows || [ctx.row];
        let vs = e.arg.k === "star" ? rows.map(() => 1) : rows.map((r) => val(e.arg, { row: r })).filter((v) => v != null);
        if (e.distinct) vs = [...new Set(vs)];
        if (e.fn === "COUNT") return vs.length;
        if (!vs.length) return null;
        if (e.fn === "MIN") return vs.reduce((a, b) => (b < a ? b : a));
        if (e.fn === "MAX") return vs.reduce((a, b) => (b > a ? b : a));
        const sum = vs.reduce((a, b) => a + Number(b), 0);
        return e.fn === "SUM" ? sum : Math.round((sum / vs.length) * 100) / 100;
      }
      case "cmp": {
        const a = val(e.a, ctx), b = val(e.b, ctx);
        const [x, y] = typeof a === "number" || typeof b === "number" ? [Number(a), Number(b)] : [String(a), String(b)];
        return { "=": x === y, "<>": x !== y, "<": x < y, ">": x > y, "<=": x <= y, ">=": x >= y }[e.op];
      }
      case "like": return like(val(e.a, ctx), val(e.b, ctx));
      case "not": return !val(e.a, ctx);
      case "and": return !!(val(e.a, ctx) && val(e.b, ctx));
      case "or": return !!(val(e.a, ctx) || val(e.b, ctx));
      case "star": return "*";
      default: return null;
    }
  }
  try {
    let rows = SQL_ROWS.slice();
    res.stages.push({ kw: "FROM", cols: SQL_COLS, rows: rows.map((r) => SQL_COLS.map((c) => r[c])), text: `FROM Customers: the table's ${rows.length} rows are the starting set.` });
    if (where) {
      const kept = rows.filter((r) => val(where, { row: r }));
      res.stages.push({ kw: "WHERE", cols: SQL_COLS, rows: kept.map((r) => SQL_COLS.map((c) => r[c])), text: `WHERE ${sqlText(where)} filters single rows before any grouping: ${kept.length} of ${rows.length} rows kept.` });
      rows = kept;
    }
    const aggUsed = items.some((i) => sqlHasAgg(i.e)) || !!having;
    let groups = null;
    if (groupCols.length) {
      const gc = groupCols.map((g) => colName(g));
      const map = new Map();
      for (const r of rows) { const k = gc.map((c) => r[c]).join("\u0000"); if (!map.has(k)) map.set(k, []); map.get(k).push(r); }
      groups = [...map.values()];
      res.stages.push({ kw: "GROUP BY", cols: [...gc, "rows in the group"], rows: groups.map((g) => [...gc.map((c) => g[0][c]), g.map((r) => r.CustomerName).join(", ")]), text: `GROUP BY ${groupCols.join(", ")} groups rows that have the same values into summary rows: ${groups.length} group${groups.length === 1 ? "" : "s"}.` });
    } else if (aggUsed) {
      groups = [rows];
      res.notes.push("No GROUP BY but an aggregate: the whole (filtered) table is one group, so the result has one row.");
    }
    if (having) {
      if (!groupCols.length) res.errors.push(`Slide 60, rule 3: "having" has to be used only after we used "group by" (having does not make sense if we have not grouped rows yet). The course keys this as wrong; MySQL and standard SQL do accept it, treating the whole table as one group, which is what runs below.`);
      const before = groups.length;
      groups = groups.filter((g) => val(having, { rows: g }));
      res.stages.push({ kw: "HAVING", cols: [...(groupCols.length ? groupCols.map(colName) : []), "rows in the group"], rows: groups.map((g) => [...groupCols.map((c) => g[0][colName(c)]), g.map((r) => r.CustomerName).join(", ")]), text: `HAVING ${sqlText(having)} filters whole groups, so it may use aggregates${sqlCols(having).some((c) => aliases[c.toLowerCase()] && !colName(c)) ? " (and the SELECT alias, which MySQL and SQLite allow here)" : ""}: ${groups.length} of ${before} group${before === 1 ? "" : "s"} kept. HAVING is like "WHERE" when we use GROUP BY.` });
    }
    const outRows = groups ? groups.map((g) => ({ ctx: { rows: g } })) : rows.map((r) => ({ ctx: { row: r } }));
    const star = items.length === 1 && items[0].e.k === "star";
    const cols = star ? SQL_COLS : items.map((i) => i.label);
    let table = outRows.map((o) => ({ o, cells: star ? SQL_COLS.map((c) => (o.ctx.row || o.ctx.rows[0])[c]) : items.map((i) => val(i.e, o.ctx)) }));
    if (groups && groupCols.length) {
      const loose = items.filter((i) => !sqlHasAgg(i.e)).flatMap((i) => sqlCols(i.e)).filter((c) => !groupCols.some((g) => colName(g) === colName(c)));
      if (loose.length) res.notes.push(`${loose.join(", ")} is not in GROUP BY and not aggregated: SQLite shows one row's value from each group; MySQL's default mode refuses it.`);
    }
    res.stages.push({ kw: "SELECT", cols, rows: table.map((t) => t.cells), text: `SELECT ${items.map((i) => i.label).join(", ")} picks the columns${aggUsed ? " and computes each aggregate over its group" : ""}: ${table.length} row${table.length === 1 ? "" : "s"}.` });
    if (orderBy.length) {
      table = table.slice().sort((x, y) => {
        for (const { e, desc } of orderBy) {
          const lab = items.findIndex((i) => i.alias && e.k === "col" && i.alias.toLowerCase() === e.name.toLowerCase());
          const a = lab >= 0 ? x.cells[lab] : val(e, x.o.ctx), b = lab >= 0 ? y.cells[lab] : val(e, y.o.ctx);
          if (a < b) return desc ? 1 : -1;
          if (a > b) return desc ? -1 : 1;
        }
        return 0;
      });
      res.stages.push({ kw: "ORDER BY", cols, rows: table.map((t) => t.cells), text: `ORDER BY ${orderBy.map((o) => sqlText(o.e) + (o.desc ? " DESC" : "")).join(", ")} sorts the final rows${orderBy.some((o) => o.desc) ? "; DESC puts the highest first" : " (ascending is the default)"}.` });
    }
  } catch (err) { return fail(err.message + "."); }
  return res;
}
function sqlOrder(box, cfg) {
  injectCss();
  let query = typeof cfg.query === "string" && cfg.query.trim() ? cfg.query.trim() : SQL_PRESETS[0][1];
  let res = null, stage = 0;
  box.append(el("h4", null, cfg.title || "Written order vs the order it runs"));
  const presets = el("div", "viz-btn-row");
  for (const [name, q] of SQL_PRESETS) presets.append(button(name, () => { query = q; ta.value = q; run(); }));
  const ta = document.createElement("textarea");
  ta.className = "w2-in w2-ta";
  ta.value = query; ta.spellcheck = false;
  ta.setAttribute("aria-label", "SQL query");
  const build = el("div", "viz-btn-row");
  const written = el("div", "w2-sql");
  const steps = el("div", "w2-steps");
  const tableBox = el("div", "w2-scroll-x");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const errBox = el("div");
  box.append(presets, ta, el("div", "w2-sec", "Clause buttons (written order)"), build, el("div", "w2-sec", "The query as written"), written, errBox, el("div", "w2-sec", "Run in logical order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY"), steps, tableBox, caption);
  box.append(el("p", "widget-note", `Customers: six made-up rows (${SQL_COLS.join(", ")}). The logical order is how the database evaluates the clauses; slides 55 and 60 give the written order and the rules.`));
  ta.addEventListener("input", () => { query = ta.value; run(); });
  const SNIP = { WHERE: 'CustomerName like "A%"', "GROUP BY": "Country", HAVING: "COUNT(CustomerID) > 1", "ORDER BY": "Country" };
  function toggle(kw) {
    const cl = sqlClauses(query);
    if (!cl.length || cl[0].kw !== "SELECT") return;
    const has = cl.some((c) => c.kw === kw);
    let next = has ? cl.filter((c) => c.kw !== kw) : cl.concat([{ kw, text: SNIP[kw] }]);
    if (!has && kw === "HAVING" && !cl.some((c) => c.kw === "GROUP BY")) next.push({ kw: "GROUP BY", text: "Country" });
    next = next.slice().sort((a, b) => SQL_KW.indexOf(a.kw) - SQL_KW.indexOf(b.kw));
    query = next.map((c) => `${c.kw} ${c.text}`).join("\n");
    ta.value = query;
    run();
  }
  function run() {
    res = sqlRun(query);
    stage = res.stages.length ? res.stages.length - 1 : 0;
    build.innerHTML = "";
    const present = new Set(res.clauses.map((c) => c.kw));
    for (const kw of SQL_KW) {
      const b = button(kw, () => toggle(kw));
      if (present.has(kw)) b.classList.add("active");
      if (kw === "SELECT" || kw === "FROM") b.disabled = true;
      b.setAttribute("aria-pressed", String(present.has(kw)));
      build.append(b);
    }
    errBox.innerHTML = "";
    for (const e of res.errors) errBox.append(el("p", "w2-pre w2-err", e));
    for (const n of res.notes) errBox.append(el("p", "widget-note", n));
    draw();
  }
  function draw() {
    written.innerHTML = "";
    const cur = res.stages[stage];
    const fatal = !res.stages.length;
    for (const c of res.clauses) {
      const d = el("div", null, `${c.kw} ${c.text}`);
      if (cur && c.kw === cur.kw) d.classList.add("w2-cur");
      written.append(d);
    }
    if (fatal && res.bad) res.clauses.forEach((c, i) => { if (c.kw === res.bad) written.children[i].classList.add("w2-bad"); });
    steps.innerHTML = "";
    res.stages.forEach((s, i) => {
      const b = button(`${i + 1} ${s.kw}`, () => { stage = i; draw(); });
      if (i === stage) b.classList.add("active");
      steps.append(b);
    });
    tableBox.innerHTML = "";
    if (!cur) { setText(caption, res.errors.length ? "The query does not run; nothing to show." : ""); return; }
    const t = el("table", "w2-table");
    t.append(el("caption", null, `after ${cur.kw}`));
    const thead = el("thead"), tr = el("tr");
    for (const c of cur.cols) tr.append(el("th", null, c));
    thead.append(tr);
    t.append(thead);
    const tb = el("tbody");
    if (!cur.rows.length) { const r = el("tr"), td = el("td", "w2-dim", "(no rows)"); td.colSpan = cur.cols.length; r.append(td); tb.append(r); }
    for (const row of cur.rows) { const r = el("tr"); for (const v of row) r.append(el("td", null, v == null ? "NULL" : String(v))); tb.append(r); }
    t.append(tb);
    tableBox.append(t);
    setText(caption, `Step ${stage + 1} of ${res.stages.length}: ${cur.text}`);
  }
  run();
}

// ---------- widget: specificity-calc (P3) ----------
// Lecture 1 slide 186: three rules that all apply to the div; which one wins? The answer is not on
// the slide; the (ids, classes, elements) count is the CSS specificity rule.
function specOf(sel) {
  const parts = [];
  let a = 0, b = 0, c = 0, s = sel.trim();
  if (!s) throw new Error("empty selector");
  const add = (text, col) => { parts.push([text, col]); if (col === "id") a++; else if (col === "class") b++; else if (col === "element") c++; };
  const re = /^(?:(#[-\w]+)|(\.[-\w]+)|(\[[^\]]*\])|(::[-\w]+)|(:(?:not|is|has|where)\()|(:[-\w]+(?:\([^)]*\))?)|([a-zA-Z][-\w]*|\*)|(\s*[>+~]\s*|\s+)|(,))/;
  while (s.length) {
    const m = re.exec(s);
    if (!m) throw new Error(`cannot read "${s.slice(0, 10)}"`);
    if (m[9]) throw new Error("one selector at a time (no commas)");
    if (m[5]) {
      // :not(x) / :is(x) / :has(x) count as their argument; :where(x) counts zero.
      let depth = 1, i = m[0].length;
      while (i < s.length && depth) { if (s[i] === "(") depth++; if (s[i] === ")") depth--; i++; }
      const inner = s.slice(m[0].length, i - 1);
      const r = specOf(inner);
      if (!m[5].startsWith(":where")) { a += r.a; b += r.b; c += r.c; }
      parts.push([s.slice(0, i), m[5].startsWith(":where") ? "zero" : "inner"]);
      s = s.slice(i);
      continue;
    }
    if (m[1]) add(m[1], "id");
    else if (m[2] || m[3] || m[6]) add(m[0], "class");
    else if (m[4]) add(m[4], "element");
    else if (m[7]) add(m[7], m[7] === "*" ? "zero" : "element");
    s = s.slice(m[0].length);
  }
  return { a, b, c, parts };
}
const SPEC_COLORS = ["blueviolet", "pink", "greenyellow", "khaki", "lightblue"];
const SPEC_PRESETS = {
  slide: { el: '<div id="myId">This is a div</div>', rules: [["#myId", "blueviolet"], ["div#myId", "pink"], ["div[id=myId]", "greenyellow"]] },
  pair: { el: '<p id="intro" class="note">A short note</p>', rules: [["p.note", "khaki"], ["#intro", "lightblue"]] },
};
function specificityCalc(box, cfg) {
  injectCss();
  let P = typeof cfg.a === "string" || typeof cfg.b === "string"
    ? { el: typeof cfg.element === "string" ? cfg.element : SPEC_PRESETS.pair.el, rules: [[cfg.a || "p.note", SPEC_COLORS[3]], [cfg.b || "#intro", SPEC_COLORS[4]]] }
    : JSON.parse(JSON.stringify(SPEC_PRESETS.slide));
  box.append(el("h4", null, cfg.title || "Which rule wins? Count ids, classes, elements"));
  const presets = el("div", "viz-btn-row");
  presets.append(button("slide 186: three rules", () => { P = JSON.parse(JSON.stringify(SPEC_PRESETS.slide)); build(); }), button("p.note vs #intro", () => { P = JSON.parse(JSON.stringify(SPEC_PRESETS.pair)); build(); }));
  const elRow = el("label", "w2-field");
  const elIn = textIn(P.el, "the element the rules target");
  elRow.append("the element (HTML)", elIn);
  const rulesBox = el("div");
  const tbl = el("div", "w2-scroll-x");
  const demo = el("div", "w2-inline-demo");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(presets, elRow, el("div", "w2-sec", "Rules, in source order"), rulesBox, tbl, el("div", "w2-sec", "Result"), demo, caption);
  box.append(el("p", "widget-note", "Compare the counts left to right: more ids wins; if equal, more classes, attribute selectors and pseudo-classes; then more elements. A full tie goes to the rule written later. An inline style attribute beats every selector."));
  elIn.addEventListener("input", () => { P.el = elIn.value; calc(); });
  function build() {
    elIn.value = P.el;
    rulesBox.innerHTML = "";
    P.rules.forEach((r, i) => {
      const row = el("div", "w2-kv");
      const sw = el("span", "w2-swatch");
      sw.style.background = r[1];
      const inp = textIn(r[0], `rule ${i + 1} selector`);
      inp.addEventListener("input", () => { r[0] = inp.value; calc(); });
      const decl = el("span", "w2-dim w2-nowrap", "{ background-color: ");
      decl.append(sw, ` ${r[1]}; }`);
      row.append(el("span", "w2-chip", String(i + 1)), inp, decl);
      rulesBox.append(row);
    });
    calc();
  }
  function target() {
    const tpl = document.createElement("template");
    tpl.innerHTML = `<div>${P.el}</div>`;
    const wrap = tpl.content.firstElementChild;
    return wrap && wrap.firstElementChild ? { wrap, node: wrap.firstElementChild } : null;
  }
  function calc() {
    const t = target();
    const rows = P.rules.map(([sel, color], i) => {
      try {
        const s = specOf(sel);
        let matches = null;
        if (t) { try { matches = t.node.matches(sel); } catch { matches = null; } }
        return { i, sel, color, s, matches };
      } catch (err) { return { i, sel, color, err: err.message }; }
    });
    const live = rows.filter((r) => !r.err && r.matches !== false);
    let win = null;
    for (const r of live) if (!win || r.s.a > win.s.a || (r.s.a === win.s.a && (r.s.b > win.s.b || (r.s.b === win.s.b && r.s.c >= win.s.c)))) win = r;
    tbl.innerHTML = "";
    const tab = el("table", "w2-table");
    const thead = el("thead"), tr = el("tr");
    for (const h of ["rule", "ids", "classes", "elements", "pieces"]) tr.append(el("th", null, h));
    thead.append(tr);
    tab.append(thead);
    const tb = el("tbody");
    for (const r of rows) {
      const row = el("tr");
      if (r === win) row.classList.add("w2-src");
      if (r.err || r.matches === false) row.classList.add("w2-dim");
      row.append(el("td", null, `${r.i + 1}  ${r.sel}`));
      if (r.err) { const td = el("td", "w2-err", r.err); td.colSpan = 4; row.append(td); }
      else {
        row.append(el("td", null, String(r.s.a)), el("td", null, String(r.s.b)), el("td", null, String(r.s.c)));
        row.append(el("td", null, r.s.parts.map(([p, col]) => `${p} → ${col}`).join(", ") + (r.matches === false ? " (does not match the element)" : "")));
      }
      tb.append(row);
    }
    tab.append(tb);
    tbl.append(tab);
    demo.innerHTML = "";
    if (t) {
      const node = t.node.cloneNode(true);
      node.style.background = win ? win.color : "transparent";
      node.style.color = "#111";
      node.style.padding = "4px 8px";
      node.style.margin = "0";
      demo.append(node);
    } else demo.append(el("span", "w2-err", "Type one HTML element, such as <p class=\"note\">text</p>."));
    const tri = (r) => `(${r.s.a}, ${r.s.b}, ${r.s.c})`;
    let text;
    if (!win) text = "No rule matches the element, so none of these colours applies.";
    else {
      const others = live.filter((r) => r !== win);
      const tie = others.filter((r) => r.s.a === win.s.a && r.s.b === win.s.b && r.s.c === win.s.c);
      text = `${win.sel} ${tri(win)} wins, so the element is ${win.color}.`;
      if (others.length) {
        const beat = others.filter((r) => !tie.includes(r));
        if (beat.length) text += ` It beats ${beat.map((r) => `${r.sel} ${tri(r)}`).join(" and ")}: ${beat.every((r) => r.s.a < win.s.a) ? "it has more ids" : beat.every((r) => r.s.a === win.s.a && r.s.b < win.s.b) ? "same ids, more classes or attributes" : "the first column that differs is higher"}.`;
        if (tie.length) text += ` It ties with ${tie.map((r) => r.sel).join(" and ")} and wins because it is written later.`;
      }
      const skipped = rows.filter((r) => r.matches === false);
      if (skipped.length) text += ` ${skipped.map((r) => r.sel).join(", ")} does not match the element, so it takes no part.`;
    }
    setText(caption, text);
  }
  build();
}

export const WIDGETS = {
  "http-anatomy": httpAnatomy,
  "storage-sim": storageSim,
  "dom-build-play": domBuildPlay,
  "db-relate": dbRelate,
  "css-box": cssBox,
  "arch-compare": archCompare,
  "sql-order": sqlOrder,
  "specificity-calc": specificityCalc,
};
