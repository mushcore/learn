// COMP 4736 Part 3 widgets (Processes): process-states-play, context-switch-play, cpu-util,
// multiprog-play, and fork-play (shared with Part 5, System Calls). Facts, numbers and wording come
// from spec/comp4736/p3/_SOURCE-NOTES.md, p5/_SOURCE-NOTES.md, LABS.md and midterm/_SOURCE-NOTES.md.
// Every -play widget draws one frame per onFrame(pos) on the shared playback bar (app/playback.js).
import { el, slider, btnRow } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  // The figures are drawn on a 360-unit-wide canvas: cap them so they do not balloon on wide screens.
  if (tag === "svg") e.style.cssText = "max-width:620px;margin-left:auto;margin-right:auto";
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth01 = (u) => { const c = clamp(u, 0, 1); return c * c * (3 - 2 * c); };
const lerpN = (a, b, t) => a + (b - a) * t;
const sty = (e, css) => { e.style.cssText = css; return e; };
let uid = 0;
function cell(label, value, note) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label), el("div", "stat-value", value));
  if (note) c.append(el("div", "stat-note", note));
  return c;
}
function grid(out, rows) {
  out.innerHTML = "";
  for (const [l, v, n] of rows) out.append(cell(l, v, n));
}
/** Rounds for display: 4 decimals, or 3 significant figures for tiny values. */
function fx(v, d = 4) {
  if (!Number.isFinite(v)) return "—";
  const t = v !== 0 && Math.abs(v) < 1e-4 ? v.toPrecision(3) : String(Number(v.toFixed(d)));
  return t.replace(/^-/, "−");
}
const pct = (v, d = 2) => `${fx(v * 100, d)} %`;
const sup = (b, e) => `${b}<sup>${e}</sup>`;
const supTxt = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c] ?? c).join("");
function presetRow(items, onPick) {
  const row = el("div", "viz-btn-row");
  for (const [label, fn] of items) {
    const b = el("button", "viz-btn", label);
    b.type = "button";
    b.addEventListener("click", () => fn());
    row.append(b);
  }
  return row;
}
function numField(label, value, onChange, opts = {}) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.value = value;
  if (opts.step) input.step = opts.step;
  if (opts.min != null) input.min = opts.min;
  if (opts.max != null) input.max = opts.max;
  sty(input, "width:110px");
  input.addEventListener("input", () => { const v = parseFloat(input.value); if (Number.isFinite(v)) onChange(v); });
  row.append(el("label", null, label), input);
  if (opts.suffix) row.append(el("span", "widget-note", opts.suffix));
  return { row, input, set: (v) => { input.value = v; } };
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
function playParts(box) {
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  ask.hidden = true;
  return { caption, ask };
}
const setText = (node, t) => { if (node.textContent !== t) node.textContent = t; };

// ---------- shared: state-diagram geometry ----------
function trim(n, dx, dy) {
  const ax = Math.abs(dx) || 1e-9, ay = Math.abs(dy) || 1e-9;
  return Math.min(n.hw / ax, n.hh / ay);
}
/** A curved arrow from node a to node b; `bend` pushes it sideways (pairs of opposite arrows separate). */
function arrowGeom(a, b, bend) {
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const px = -uy, py = ux, sh = bend * 0.45;
  const ta = trim(a, ux, uy), tb = trim(b, ux, uy) + 4;
  const p0 = [a.x + ux * ta + px * sh, a.y + uy * ta + py * sh], p1 = [b.x - ux * tb + px * sh, b.y - uy * tb + py * sh];
  const c = [(p0[0] + p1[0]) / 2 + px * bend, (p0[1] + p1[1]) / 2 + py * bend];
  return { p0, c, p1, px, py };
}
function qpt(g, t) {
  const u = 1 - t;
  return [u * u * g.p0[0] + 2 * u * t * g.c[0] + t * t * g.p1[0], u * u * g.p0[1] + 2 * u * t * g.c[1] + t * t * g.p1[1]];
}
function markers(svg, id) {
  const defs = svgEl("defs");
  for (const [k, col] of [["dim", "var(--ink-dim)"], ["hot", "var(--hl)"], ["red", "var(--red)"]]) {
    const m = svgEl("marker", { id: `os2-ah-${id}-${k}`, viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
    m.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: col }));
    defs.append(m);
  }
  svg.append(defs);
}

// ---------- widget: process-states-play ----------
const T3 = {
  nodes: {
    running: { x: 180, y: 34, hw: 58, hh: 19, lines: ["Running"] },
    blocked: { x: 66, y: 194, hw: 58, hh: 19, lines: ["Blocked"] },
    ready: { x: 294, y: 194, hw: 58, hh: 19, lines: ["Ready"] },
  },
  arrows: {
    1: { from: "running", to: "blocked", bend: 22, legend: "Process blocks for input" },
    2: { from: "running", to: "ready", bend: -22, legend: "Scheduler picks another process" },
    3: { from: "ready", to: "running", bend: -18, legend: "Scheduler picks this process" },
    4: { from: "blocked", to: "ready", bend: 14, legend: "Input becomes available" },
  },
  name: { running: "Running", ready: "Ready", blocked: "Blocked" },
  events: [
    { keys: ["reads from a pipe with no input", "reads from a pipe", "reads from the terminal with no input", "reads from a terminal with no input", "blocks for input", "process blocks for input", "waits for input"], from: "running", t: 1, why: "In UNIX, when a process reads from a pipe or special file (e.g., a terminal) and there is no input available, the process is automatically blocked." },
    { keys: ["pause() system call", "pause()", "pause", "calls pause()"], from: "running", t: 1, why: "In some systems the process can execute a system call, such as pause, to get into blocked state." },
    { keys: ["quantum expires", "time is up", "clock interrupt", "scheduler picks another process"], from: "running", t: 2, why: "The scheduler decides that the running process has run long enough, and it is time to let another process have some CPU time." },
    { keys: ["scheduled", "scheduler picks this process", "gets the cpu"], from: "ready", t: 3, why: "All the other processes have had their fair share and it is time for the first process to get the CPU to run again." },
    { keys: ["input arrives", "input becomes available", "external event happens", "i/o completes"], from: "blocked", t: 4, why: "The external event for which the process was waiting (such as the arrival of some input) happens. If no other process is running, transition 3 follows; otherwise it may have to wait in ready state until the CPU is available and its turn comes." },
  ],
  start: "running",
};
const LX = {
  nodes: {
    R: { x: 180, y: 116, hw: 64, hh: 20, lines: ["(R) Running/", "Runnable"] },
    D: { x: 64, y: 30, hw: 58, hh: 20, lines: ["(D) Uninterruptible", "Sleep"] },
    T: { x: 296, y: 30, hw: 58, hh: 20, lines: ["(T) Stopped"] },
    S: { x: 64, y: 202, hw: 58, hh: 20, lines: ["(S) Interruptible", "Sleep"] },
    Z: { x: 296, y: 202, hw: 58, hh: 20, lines: ["(Z) Zombie"] },
  },
  arrows: {
    "R>D": { from: "R", to: "D", bend: 12, label: "" },
    "D>R": { from: "D", to: "R", bend: 12, label: "wake up" },
    "R>S": { from: "R", to: "S", bend: 12, label: "" },
    "S>R": { from: "S", to: "R", bend: 12, label: "wake up/signal" },
    "R>T": { from: "R", to: "T", bend: 12, label: "SIGSTOP" },
    "T>R": { from: "T", to: "R", bend: 12, label: "SIGCONT" },
    "R>Z": { from: "R", to: "Z", bend: 0, label: "Exit()" },
  },
  man: {
    R: "running or runnable (on run queue)",
    S: "interruptible sleep (waiting for an event to complete and can be killed)",
    D: "uninterruptible sleep (usually IO and cannot be killed)",
    T: "stopped by job control signal",
    Z: "defunct (\"zombie\") process, terminated but not reaped by its parent",
  },
  events: [
    { keys: ["waits for disk i/o", "disk i/o", "waits for i/o"], from: ["R"], to: "D" },
    { keys: ["sleeps on an event", "sleep()", "sleep(30)", "sleep", "waits for an event", "sleeps"], from: ["R"], to: "S" },
    { keys: ["wake up", "wakes up", "event completes", "i/o completes"], from: ["D", "S"], to: "R" },
    { keys: ["signal", "a signal arrives", "kill"], from: ["S"], to: "R" },
    { keys: ["sigstop", "ctrl-z"], from: ["R"], to: "T" },
    { keys: ["sigcont", "fg"], from: ["T"], to: "R" },
    { keys: ["exit()", "exit", "exits", "returns from main"], from: ["R"], to: "Z" },
    { keys: ["parent waits", "wait()", "parent calls wait()", "reaped"], from: ["Z"], to: "gone" },
  ],
  start: "R",
};
const PS_PRESETS = {
  three: [
    ["slide 26 story", ["reads from a pipe with no input", "input arrives", "scheduled", "quantum expires", "scheduled"]],
    ["practice Q47: no Blocked → Running", ["quantum expires", "scheduled", "pause() system call", "scheduled", "input arrives", "scheduled"]],
  ],
  linux: [
    ["slide 61 tour", ["sleeps on an event", "wake up", "waits for disk I/O", "wake up", "SIGSTOP", "SIGCONT", "exit()", "parent waits"]],
    ["D cannot be killed", ["waits for disk I/O", "signal", "wake up", "sleeps on an event", "signal", "exit()"]],
  ],
};
const normEv = (s) => String(s).trim().toLowerCase().replace(/[.!]+$/, "").replace(/\s+/g, " ");
function psTrace(model, events) {
  const M = model === "linux" ? LX : T3;
  const states = [M.start], steps = [];
  let unknown = [];
  for (const raw of events) {
    const cur = states[states.length - 1], ev = normEv(raw);
    const defs = M.events.filter((d) => d.keys.includes(ev));
    if (!defs.length) unknown.push(raw);
    if (model === "linux") {
      const d = defs.find((x) => x.from.includes(cur));
      const to = cur === "gone" ? "gone" : d ? d.to : cur;
      let text, arrow = null;
      if (cur === "gone") text = `"${raw}": the process has already been reaped; nothing is left to change.`;
      else if (d && to === "gone") text = `"${raw}": the parent's wait() reaps the zombie. The parent process is responsible for waiting for child process to terminate and then cleaning up the child process entry from the process table (the slide draws no arrow out of Z).`;
      else if (d) {
        arrow = `${cur}>${to}`;
        const lab = LX.arrows[arrow].label;
        text = `"${raw}": ${cur} → ${to}${lab ? ` (the arrow labelled ${lab})` : ""}. ${to}: ${LX.man[to]}.`;
        if (to === "Z") text += " It stays Z until its parent waits.";
      } else if (cur === "D" && ev === "signal") text = `"${raw}" while in D: nothing happens. D returns to R only on wake up: an uninterruptible sleep (usually IO) cannot be killed.`;
      else if (!defs.length) text = `"${raw}" is not an event this widget knows; the process stays ${cur}.`;
      else text = `"${raw}" has no arrow out of ${cur} on the slide's diagram, so the process stays ${cur}.`;
      steps.push({ ev: raw, from: cur, to, arrow, text });
      states.push(to);
    } else {
      const d = defs.find((x) => x.from === cur);
      let text, t = null, to = cur;
      if (d) {
        t = d.t; to = T3.arrows[t].to;
        text = `"${raw}": transition ${t}, ${T3.name[cur]} → ${T3.name[to]}: ${T3.arrows[t].legend.toLowerCase()}. ${d.why}`;
      } else if (cur === "blocked" && defs.some((x) => x.t === 3)) {
        text = `"${raw}" while Blocked: no transition. There is no Blocked → Running arrow: a blocked process is unable to run until some external event happens, so the scheduler cannot pick it. It stays Blocked.`;
      } else if (!defs.length) text = `"${raw}" is not an event this widget knows; the process stays ${T3.name[cur]}.`;
      else text = `"${raw}" while ${T3.name[cur]}: no transition. No arrow leaves ${T3.name[cur]} for this event, so the process stays ${T3.name[cur]}.`;
      steps.push({ ev: raw, from: cur, to, t, text });
      states.push(to);
    }
  }
  return { states, steps, unknown };
}
function processStatesPlay(box, cfg) {
  const id = ++uid;
  let model = cfg.model === "linux" ? "linux" : "three";
  let events = Array.isArray(cfg.events) && cfg.events.length ? cfg.events.map(String) : PS_PRESETS[model][0][1].slice();
  let tr = psTrace(model, events), pb = null;
  box.append(el("h4", null, cfg.title || "Process states: one event at a time"));
  const modeRow = btnRow(["three-state (slide 26)", "Linux ps states (slide 61)"], (i) => { model = i ? "linux" : "three"; events = PS_PRESETS[model][0][1].slice(); drawPresets(); input.value = events.join(", "); restart(); }, model === "linux" ? 1 : 0);
  const presetBox = el("div");
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "text"; input.value = events.join(", "); sty(input, "width:100%;max-width:560px");
  input.setAttribute("aria-label", "Events, separated by commas");
  row.append(el("label", null, "events"), input);
  const { caption, ask } = playParts();
  const pk = predictKit(ask, "Predict each transition before it happens", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 360 232", class: "curve-svg net-svg", role: "img" });
  const strip = sty(el("div"), "display:flex;flex-wrap:wrap;gap:4px;margin:6px 0;font-size:12px");
  const legend = sty(el("div", "widget-note"), "margin:4px 0 0");
  const note = el("p", "widget-note");
  box.append(modeRow, presetBox, row, pk.row, svg, strip, legend, caption, ask);
  function drawPresets() {
    presetBox.innerHTML = "";
    presetBox.append(presetRow(PS_PRESETS[model].map(([name, evs]) => [name, () => { events = evs.slice(); input.value = events.join(", "); restart(); }])));
  }
  drawPresets();
  const M = () => (model === "linux" ? LX : T3);
  function nodeBox(key, n, hot, dim) {
    const g = svgEl("g", { opacity: dim ? 0.45 : 1 });
    g.append(svgEl("rect", { x: n.x - n.hw, y: n.y - n.hh, width: 2 * n.hw, height: 2 * n.hh, rx: model === "three" ? n.hh : 7, fill: hot ? "var(--hl-soft)" : "var(--paper)", stroke: hot ? "var(--hl)" : "var(--rule-strong)", "stroke-width": hot ? 2 : 1.2 }));
    n.lines.forEach((t, i) => g.append(svgEl("text", { x: n.x, y: n.y + 4 + (i - (n.lines.length - 1) / 2) * 12, "text-anchor": "middle", "font-size": n.lines.length > 1 ? 10 : 12.5, fill: "var(--ink)" }, t)));
    svg.append(g);
  }
  function frame(pos) {
    const N = tr.steps.length, q = pk.asking(pos, N);
    const s = q ? pk.answered : Math.ceil(pos - 1e-9) - 1;
    const u = q ? 0 : clamp(pos - s, 0, 1);
    const st = s >= 0 ? tr.steps[s] : null;
    const curState = q ? tr.states[pk.answered] : st ? (u >= 1 - 1e-9 ? st.to : st.from) : tr.states[0];
    svg.innerHTML = "";
    markers(svg, id);
    const m = M();
    const hotArrow = !q && st ? (model === "linux" ? st.arrow : st.t) : null;
    for (const [k, a] of Object.entries(m.arrows)) {
      const g = arrowGeom(m.nodes[a.from], m.nodes[a.to], a.bend), hot = String(k) === String(hotArrow);
      svg.append(svgEl("path", { d: `M${g.p0} Q${g.c} ${g.p1}`, fill: "none", stroke: hot ? "var(--hl)" : "var(--ink-dim)", "stroke-width": hot ? 2.6 : 1.4, "marker-end": `url(#os2-ah-${id}-${hot ? "hot" : "dim"})` }));
      const mid = qpt(g, 0.5), lab = model === "linux" ? a.label : k;
      if (lab) {
        const off = model === "linux" ? 9 : 11;
        svg.append(svgEl("text", { x: mid[0] + g.px * off * Math.sign(a.bend || 1), y: mid[1] + g.py * off * Math.sign(a.bend || 1) + 4, "text-anchor": "middle", "font-size": model === "linux" ? 9.5 : 13, "font-weight": 600, fill: hot ? "var(--hl)" : "var(--ink-2)" }, lab));
      }
    }
    const gone = curState === "gone";
    for (const [k, n] of Object.entries(m.nodes)) nodeBox(k, n, k === curState || (gone && k === "Z"), gone && k === "Z");
    // token
    let tok = null;
    if (!q && st && u < 1 - 1e-9 && hotArrow != null) {
      const a = m.arrows[hotArrow];
      tok = qpt(arrowGeom(m.nodes[a.from], m.nodes[a.to], a.bend), smooth01(u));
    } else if (!gone) { const n = m.nodes[curState]; tok = [n.x + n.hw - 10, n.y - n.hh + 2]; }
    if (st && st.to === "gone" && !q) {
      const n = m.nodes.Z;
      svg.append(svgEl("text", { x: n.x, y: n.y - n.hh - 6, "text-anchor": "middle", "font-size": 10, fill: "var(--red)" }, "reaped: removed"));
      if (u < 1) tok = [n.x + n.hw - 10, n.y - n.hh + 2];
    }
    if (tok) svg.append(svgEl("circle", { cx: tok[0], cy: tok[1], r: 6.5, fill: "var(--hl)", stroke: "var(--paper)", "stroke-width": 1.5, opacity: st && st.to === "gone" && !q ? 1 - u : 1 }));
    if (!q && st && hotArrow == null && st.to !== "gone" && u > 0 && u < 1) {
      const n = m.nodes[st.from];
      svg.append(svgEl("text", { x: n.x, y: n.y + n.hh + 14, "text-anchor": "middle", "font-size": 11, fill: "var(--red)" }, "✕ no arrow for this event"));
    }
    // event strip
    strip.innerHTML = "";
    tr.steps.forEach((x, i) => {
      const active = i === (q ? pk.answered : s);
      const done = q ? i < pk.answered : i < s || (i === s && u >= 1 - 1e-9);
      const chip = sty(el("span", null, `${i + 1}. ${x.ev}${done ? (model === "linux" ? ` → ${x.to === "gone" ? "reaped" : x.to}` : x.t ? ` → ${x.t}` : " → none") : ""}`),
        `padding:2px 7px;border-radius:5px;border:1px solid ${active ? "var(--hl)" : "var(--rule)"};background:${active ? "var(--hl-soft)" : "var(--paper)"};color:${done || active ? "var(--ink)" : "var(--ink-dim)"}`);
      strip.append(chip);
    });
    // legend
    if (model === "three") {
      legend.innerHTML = "";
      for (const k of [1, 2, 3, 4]) {
        const sp = sty(el("span", null, `${k}. ${T3.arrows[k].legend}`), `margin-right:12px;white-space:nowrap;${String(k) === String(hotArrow) ? "color:var(--hl);font-weight:600" : ""}`);
        legend.append(sp, " ");
      }
    } else legend.textContent = "man ps: R running or runnable · S interruptible sleep · D uninterruptible sleep · T stopped by job control signal · Z defunct (\"zombie\")";
    let text;
    if (q) {
      const x = tr.steps[pk.answered], from = model === "linux" ? x.from : T3.name[x.from];
      text = model === "linux" ? `Event ${pk.answered + 1}: "${x.ev}" while the process is in ${from}. Which state is it in next?` : `Event ${pk.answered + 1}: "${x.ev}" while the process is ${from}. Which transition happens?`;
    } else if (!st) text = model === "linux" ? "The process starts in R (running or runnable). Press Play to apply the events one at a time." : "The process starts Running. Press Play to apply the events one at a time; each one moves it along a numbered arrow, or not at all.";
    else {
      text = `Event ${s + 1}, ${st.text}`;
      if (s === N - 1 && u >= 1 - 1e-9) {
        text += model === "three" ? ` Path: ${T3.name[tr.states[0]]} → ${tr.steps.map((x) => x.t || "none").join(" → ")}.` : "";
        text += pk.tally();
      }
    }
    setText(caption, text);
    if (q) {
      const x = tr.steps[pk.answered];
      const opts = model === "linux"
        ? ["R", "S", "D", "T", "Z", "removed"].map((L) => {
          const ans = x.to === "gone" ? "removed" : x.to;
          return { label: L, ok: L === ans, why: x.text };
        })
        : ["1", "2", "3", "4", "none"].map((L) => ({ label: L, ok: L === String(x.t || "none"), why: L === "none" ? `There is an arrow for "${x.ev}" from ${T3.name[x.from]}.` : `Transition ${L} is ${T3.name[T3.arrows[L].from]} → ${T3.name[T3.arrows[L].to]} (${T3.arrows[L].legend.toLowerCase()}), and the process is ${T3.name[x.from]}.` }));
      pk.render(true, `${model}|${events.join("|")}`, opts);
    } else pk.render(false);
  }
  function restart() {
    tr = psTrace(model, events);
    note.textContent = tr.unknown.length ? `Unknown event${tr.unknown.length > 1 ? "s" : ""}: ${tr.unknown.join(", ")}. Known: ${M().events.map((d) => d.keys[0]).join(", ")}.` : model === "three" ? "Slide 26: there is no Blocked → Running and no Ready → Blocked arrow. Transitions 2 and 3 are caused by the process scheduler, without the process even knowing about them." : "Slide 61: D returns only on wake up, S on wake up/signal; nothing leaves Z except being reaped by the parent's wait().";
    pk.reset();
    pb.reset(tr.steps.length);
  }
  pb = createPlayback({ count: tr.steps.length, unit: "event", onFrame: frame, stepMs: () => cfg.stepMs || 1300, limit: () => pk.limit(tr.steps.length), onBlocked: () => pk.nudge() });
  box.append(pb.el, note);
  input.addEventListener("change", () => {
    const evs = input.value.split(/\s*[,;\n]\s*/).map((x) => x.trim()).filter(Boolean);
    if (evs.length) { events = evs.slice(0, 20); restart(); }
  });
  restart();
}

// ---------- widget: context-switch-play ----------
const CS_ROWS = [["PC", "pc"], ["PSW", "psw"], ["SP", "sp"], ["Registers", "regs"], ["State", "state"]];
const hex = (v) => "0x" + v.toString(16).toUpperCase().padStart(4, "0");
function csBuild(rounds) {
  const P = [
    { pc: 0x1000, psw: "0x0202", sp: "0x7FF0", ax: 5, bx: 9 },
    { pc: 0x2400, psw: "0x0246", sp: "0x6FA0", ax: 1, bx: 3 },
  ];
  const regs = (r) => `AX=${r.ax} BX=${r.bx}`;
  const view = (r) => ({ pc: hex(r.pc), psw: r.psw, sp: r.sp, regs: regs(r) });
  let cpu = { ...P[0] }, owner = 0, kernel = false;
  const pcb = [{ saved: null, state: "Running" }, { saved: { ...P[1] }, state: "Ready" }];
  const snaps = [], steps = [];
  const snap = () => snaps.push({ cpu: view(cpu), owner, kernel, pcb: pcb.map((x) => ({ v: x.saved ? view(x.saved) : null, state: x.state })) });
  const name = (i) => `P${i + 1}`;
  snap();
  const run = (resumed) => {
    const a = owner, from = cpu.pc;
    cpu.pc += 0x10; cpu.ax += 1;
    steps.push({ kind: "run", a, label: `Process ${name(a)}`, text: resumed ? `${name(a)} runs again from ${hex(from)}, the program counter restored from its PCB, and reaches ${hex(cpu.pc)}: it resumes as if it had never been stopped.` : `${name(a)} is running: its program counter moves from ${hex(from)} to ${hex(cpu.pc)}, and AX becomes ${cpu.ax}.`, ask: { q: "Which process does the CPU run in this step?", opts: [0, 1].map((i) => ({ label: name(i), ok: i === a, why: `The CPU holds ${name(a)}'s program counter and registers, so ${name(a)} runs.` })) } });
    snap();
  };
  run(false);
  for (let r = 0; r < rounds; r++) {
    const a = owner, b = 1 - a, blocks = r % 2 === 1;
    const woke = pcb[b].state === "Blocked";
    if (woke) pcb[b].state = "Ready";
    kernel = true;
    steps.push({ kind: "trap", a, b, label: blocks ? "system call" : "interrupt", text: (blocks ? `${name(a)} makes a system call (read) and must wait for input, so the CPU scheduler decides to switch to another process.` : `A clock interrupt: the scheduler decides that ${name(a)} has run long enough, and it is time to let another process have some CPU time.`) + (woke ? ` (Meanwhile ${name(b)}'s input arrived: Blocked → Ready.)` : "") + ` The operating system takes over the CPU.`, ask: { q: "What must the OS do first?", opts: [{ label: `save ${name(a)}'s state`, ok: true }, { label: `restore ${name(b)}'s state`, ok: false, why: `Restoring ${name(b)} first would overwrite ${name(a)}'s program counter and registers before they are kept.` }, { label: `keep running ${name(a)}`, ok: false, why: "The scheduler has decided to switch from one process to another." }] } });
    snap();
    pcb[a].saved = { ...cpu }; pcb[a].state = blocks ? "Blocked" : "Ready";
    steps.push({ kind: "save", a, b, label: `Save ${name(a)} state`, text: `Save ${name(a)} state: the OS saves the current process's context, including its program counter (${hex(cpu.pc)}), register values (${regs(cpu)}) and other relevant state information, into ${name(a)}'s PCB (Process Control Block). ${name(a)} is now ${pcb[a].state}.`, ask: { q: `Where does ${name(a)}'s program counter go now?`, opts: [{ label: `into ${name(a)}'s PCB`, ok: true }, { label: `into ${name(b)}'s PCB`, ok: false, why: `Each process has its own entry; ${name(a)}'s context goes into ${name(a)}'s PCB.` }, { label: "it is thrown away", ok: false, why: `It must be saved so that ${name(a)} can be restarted later as if it had never been stopped.` }] } });
    snap();
    cpu = { ...pcb[b].saved }; owner = b; pcb[b].state = "Running"; kernel = false;
    steps.push({ kind: "restore", a, b, label: `Restore ${name(b)} state`, text: `Restore ${name(b)} state: the OS loads the saved state of ${name(b)} from its PCB (program counter ${hex(cpu.pc)}, ${regs(cpu)}) into the CPU so that it can resume execution.`, ask: { q: "Where does the CPU's new program counter come from?", opts: [{ label: `${name(b)}'s PCB`, ok: true }, { label: `${name(a)}'s PCB`, ok: false, why: `${name(a)}'s PCB holds ${name(a)}'s context; the CPU now loads ${name(b)}'s.` }, { label: `${name(a)}'s PC + 1`, ok: false, why: `The next process is ${name(b)}, and its program counter is the one saved in its PCB.` }] } });
    snap();
    run(r >= 1 || b === 0 ? true : false);
    steps[steps.length - 1].ask.q = "Which process runs after this step?";
  }
  return { snaps, steps };
}
function contextSwitchPlay(box, cfg) {
  let rounds = clamp(Math.round(+cfg.rounds || 2), 1, 6);
  let cs = csBuild(rounds), pb = null;
  box.append(el("h4", null, cfg.title || "Context switch: save one PCB, restore another"));
  const row = el("div", "unit-row");
  const sel = document.createElement("select");
  for (let i = 1; i <= 6; i++) { const o = el("option", null, `${i}`); o.value = i; if (i === rounds) o.selected = true; sel.append(o); }
  row.append(el("label", null, "context switches"), sel);
  const { caption, ask } = playParts();
  const pk = predictKit(ask, "Predict each step before it happens", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const strip = sty(el("div"), "display:flex;flex-wrap:wrap;gap:4px;margin:8px 0;font-size:12px;align-items:center");
  const svg = svgEl("svg", { viewBox: "0 0 360 200", class: "curve-svg net-svg", role: "img" });
  const note = el("p", "widget-note", "PC = program counter, PSW = program status word, SP = stack pointer: the first rows of the slide's process-table entry (process management: registers, program counter, program status word, stack pointer, process state, …). The addresses and register values are made-up examples.");
  box.append(row, pk.row, strip, svg, caption, ask);
  const COLS = { cpu: 103, p0: 205, p1: 309 }, Y0 = 52, DY = 28;
  function frame(pos) {
    const N = cs.steps.length, q = pk.asking(pos, N);
    const s = q ? pk.answered : Math.ceil(pos - 1e-9) - 1, u = q ? 0 : clamp(pos - s, 0, 1);
    const st = s >= 0 ? cs.steps[s] : null;
    const before = cs.snaps[Math.max(0, s)], after = cs.snaps[s + 1] || cs.snaps[0];
    const show = q ? cs.snaps[pk.answered] : !st ? cs.snaps[0] : u >= 1 - 1e-9 ? after : before;
    svg.innerHTML = "";
    // headers
    const hdr = (x, w, t, hot) => {
      svg.append(svgEl("rect", { x: x - w / 2, y: 8, width: w, height: 26, rx: 5, fill: hot ? "var(--hl-soft)" : "var(--paper-3)", stroke: hot ? "var(--hl)" : "var(--rule)" }));
      svg.append(svgEl("text", { x, y: 25, "text-anchor": "middle", "font-size": 11.5, "font-weight": 600, fill: "var(--ink)" }, t));
    };
    const moving = !q && st && (st.kind === "save" || st.kind === "restore") && u > 0 && u < 1;
    hdr(COLS.cpu, 92, show.kernel ? "CPU: OS" : `CPU: P${show.owner + 1}`, !q && st && st.kind !== "trap");
    hdr(COLS.p0, 96, "PCB of P1", moving && (st.kind === "save" ? st.a === 0 : st.b === 0));
    hdr(COLS.p1, 96, "PCB of P2", moving && (st.kind === "save" ? st.a === 1 : st.b === 1));
    svg.append(svgEl("text", { x: 257, y: 192, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, "process table"));
    CS_ROWS.forEach(([lab, key], r) => {
      const y = Y0 + r * DY;
      svg.append(svgEl("text", { x: 4, y: y + 4, "font-size": 9.5, fill: "var(--ink-2)" }, lab));
      for (const [col, x] of [["cpu", COLS.cpu], ["p0", COLS.p0], ["p1", COLS.p1]]) {
        svg.append(svgEl("rect", { x: x - (col === "cpu" ? 46 : 48), y: y - 11, width: col === "cpu" ? 92 : 96, height: 22, rx: 4, fill: "var(--paper)", stroke: "var(--rule)" }));
        let v;
        if (col === "cpu") v = key === "state" ? (show.kernel ? "kernel" : `running P${show.owner + 1}`) : show.cpu[key];
        else { const p = show.pcb[col === "p0" ? 0 : 1]; v = key === "state" ? p.state : p.v ? p.v[key] : "—"; }
        // While values fly, the destination keeps its old contents until they land.
        if (moving && key !== "state") {
          const dst = st.kind === "save" ? (st.a === 0 ? "p0" : "p1") : "cpu";
          if (col === dst) v = "";
        }
        const stale = col !== "cpu" && key !== "state" && show.pcb[col === "p0" ? 0 : 1].state === "Running";
        svg.append(svgEl("text", { x, y: y + 4, "text-anchor": "middle", "font-size": 10.5, fill: key === "state" ? (v === "Running" || /^running/.test(v) ? "var(--green)" : v === "Blocked" ? "var(--red)" : "var(--ink)") : stale ? "var(--ink-dim)" : "var(--ink)" }, v));
      }
      if (moving && key !== "state") {
        const srcX = st.kind === "save" ? COLS.cpu : (st.b === 0 ? COLS.p0 : COLS.p1);
        const dstX = st.kind === "save" ? (st.a === 0 ? COLS.p0 : COLS.p1) : COLS.cpu;
        const val = st.kind === "save" ? before.cpu[key] : after.cpu[key];
        const t = smooth01(clamp(u * 1.2 - r * 0.05, 0, 1));
        svg.append(svgEl("text", { x: lerpN(srcX, dstX, t), y: y + 4 - Math.sin(Math.PI * t) * 9, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: "var(--hl)" }, val));
      }
    });
    // strip, slide 32 sequence
    strip.innerHTML = "";
    strip.append(sty(el("span", null, "CPU ↓"), "color:var(--ink-dim);margin-right:2px"));
    const chipOf = (i, label) => {
      const active = i === s && !q || q && i === pk.answered, done = q ? i < pk.answered : i < s || (i === s && u >= 1 - 1e-9);
      strip.append(sty(el("span", null, label), `padding:2px 7px;border-radius:5px;border:1px solid ${active ? "var(--hl)" : "var(--rule)"};background:${active ? "var(--hl-soft)" : "var(--paper)"};color:${done || active ? "var(--ink)" : "var(--ink-dim)"}`));
    };
    cs.steps.forEach((x, i) => chipOf(i, x.label));
    let text;
    if (q) text = `Step ${pk.answered + 1} of ${N}. ${cs.steps[pk.answered].ask.q}`;
    else if (!st) text = "P1 is running; P2 is ready and waiting, its saved state in its PCB. Press Play to follow the slide's sequence: Save P1 state, Restore P2 state, and back.";
    else text = st.text + (s === N - 1 && u >= 1 - 1e-9 ? pk.tally() : "");
    setText(caption, text);
    if (q) pk.render(true, `cs|${rounds}`, shuffleStable(cs.steps[pk.answered].ask.opts.map((o) => ({ why: "", ...o })), pk.answered + 3));
    else pk.render(false);
  }
  function restart() { cs = csBuild(rounds); pk.reset(); pb.reset(cs.steps.length); }
  pb = createPlayback({ count: cs.steps.length, unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 1400, limit: () => pk.limit(cs.steps.length), onBlocked: () => pk.nudge() });
  box.append(pb.el, note);
  sel.addEventListener("change", () => { rounds = +sel.value; restart(); });
  restart();
}

// ---------- widget: cpu-util ----------
function cpuUtil(box, cfg) {
  const modes = ["curve", "ram", "inverse", "parallel"];
  let mode = modes.includes(cfg.mode) ? cfg.mode : "curve";
  const num = (v, d) => (Number.isFinite(+v) ? +v : d);
  const S = {
    p: clamp(num(cfg.p, 0.8), 0, 0.99), n: clamp(Math.round(num(cfg.n, 10)), 1, 20),
    ram: num(cfg.ram, 4), os: num(cfg.os, 512), size: num(cfg.size, 256), target: clamp(num(cfg.target, 0.99), 0.01, 0.9999),
    ramP: clamp(num(cfg.p, 0.8), 0, 0.99),
    invTarget: clamp(num(cfg.target, 0.9), 0.01, 0.9999), invFind: cfg.find === "p" ? "p" : "n",
    k: clamp(Math.round(num(cfg.k, 2)), 1, 20), C: num(cfg.cpu, 20), parP: clamp(mode === "parallel" && cfg.p != null ? num(cfg.p, 0.5) : 0.5, 0, 0.99),
  };
  if (mode === "inverse" && cfg.n != null && cfg.find == null) S.invFind = "p";
  box.append(el("h4", null, cfg.title || "CPU utilization = 1 − pⁿ"));
  const tabs = btnRow(["1 − pⁿ curve", "RAM budget", "inverse", "parallel jobs"], (i) => { mode = modes[i]; build(); }, modes.indexOf(mode));
  const ctl = el("div"), out = el("div");
  box.append(tabs, ctl, out);
  const showPresets = cfg.presets !== false;
  function build() {
    ctl.innerHTML = "";
    if (mode === "curve") {
      if (showPresets) ctl.append(presetRow([
        ["slide 46: 80 %, n = 10", () => { S.p = 0.8; S.n = 10; build(); }],
        ["slide 44 / lab 4 Q8: 80 %, n = 3", () => { S.p = 0.8; S.n = 3; build(); }],
        ["50 % I/O wait, n = 2", () => { S.p = 0.5; S.n = 2; build(); }],
        ["20 % I/O wait, n = 1", () => { S.p = 0.2; S.n = 1; build(); }],
      ]));
      ctl.append(slider("p (I/O wait fraction)", 0, 0.99, 0.01, S.p, (v) => { S.p = v; draw(); }, (v) => v.toFixed(2)).row);
      ctl.append(slider("n (processes in memory)", 1, 20, 1, S.n, (v) => { S.n = v; draw(); }, (v) => String(v)).row);
    } else if (mode === "ram") {
      if (showPresets) ctl.append(presetRow([["practice Q3: 4 GB, 512 MB OS, 256 MB each, 99 %", () => { Object.assign(S, { ram: 4, os: 512, size: 256, target: 0.99 }); build(); }]]));
      ctl.append(numField("RAM", S.ram, (v) => { S.ram = v; draw(); }, { step: 1, min: 0.25, suffix: "GB" }).row);
      ctl.append(numField("OS size", S.os, (v) => { S.os = v; draw(); }, { step: 64, min: 0, suffix: "MB" }).row);
      ctl.append(numField("process size", S.size, (v) => { S.size = v; draw(); }, { step: 32, min: 1, suffix: "MB" }).row);
      ctl.append(numField("goal utilization", S.target, (v) => { S.target = clamp(v, 0.01, 0.9999); draw(); }, { step: 0.01, min: 0.01, max: 0.9999 }).row);
      ctl.append(slider("p, to check", 0, 0.99, 0.01, S.ramP, (v) => { S.ramP = v; draw(); }, (v) => v.toFixed(2)).row);
    } else if (mode === "inverse") {
      ctl.append(btnRow(["smallest n, given p", "largest p, given n"], (i) => { S.invFind = i ? "p" : "n"; build(); }, S.invFind === "p" ? 1 : 0));
      if (showPresets) ctl.append(presetRow([
        ["slide 46: 80 %, waste below 10 %", () => { Object.assign(S, { invFind: "n", p: 0.8, invTarget: 0.9 }); build(); }],
        ["practice Q3: n = 14, 99 %", () => { Object.assign(S, { invFind: "p", n: 14, invTarget: 0.99 }); build(); }],
      ]));
      ctl.append(numField("goal utilization", S.invTarget, (v) => { S.invTarget = clamp(v, 0.01, 0.9999); draw(); }, { step: 0.01, min: 0.01, max: 0.9999 }).row);
      if (S.invFind === "n") ctl.append(slider("p (I/O wait fraction)", 0.01, 0.99, 0.01, S.p, (v) => { S.p = v; draw(); }, (v) => v.toFixed(2)).row);
      else ctl.append(slider("n (processes in memory)", 1, 20, 1, S.n, (v) => { S.n = v; draw(); }, (v) => String(v)).row);
    } else {
      if (showPresets) ctl.append(presetRow([["practice Q4: 2 jobs × 20 min, 50 % I/O wait", () => { Object.assign(S, { k: 2, C: 20, parP: 0.5 }); build(); }]]));
      ctl.append(numField("jobs k", S.k, (v) => { S.k = clamp(Math.round(v), 1, 20); draw(); }, { step: 1, min: 1, max: 20 }).row);
      ctl.append(numField("CPU time each", S.C, (v) => { S.C = Math.max(0.1, v); draw(); }, { step: 1, min: 1, suffix: "min" }).row);
      ctl.append(slider("p (I/O wait fraction)", 0, 0.95, 0.01, S.parP, (v) => { S.parP = v; draw(); }, (v) => v.toFixed(2)).row);
    }
    draw();
  }
  function chart(p, n, extra) {
    const W = 360, H = 214, L = 34, R = 10, T = 10, B = 48, xmax = Math.max(10, n);
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "curve-svg net-svg", role: "img" });
    const X = (v) => L + (v / xmax) * (W - L - R), Y = (v) => T + (1 - v) * (H - T - B);
    for (let g = 0; g <= 100; g += 20) {
      svg.append(svgEl("line", { x1: L, x2: W - R, y1: Y(g / 100), y2: Y(g / 100), stroke: "var(--rule)", "stroke-width": 0.7 }));
      svg.append(svgEl("text", { x: L - 4, y: Y(g / 100) + 3, "text-anchor": "end", "font-size": 9, fill: "var(--ink-dim)" }, g));
    }
    for (let i = 0; i <= xmax; i += xmax > 10 ? 2 : 1) svg.append(svgEl("text", { x: X(i), y: H - B + 12, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }, i));
    svg.append(svgEl("text", { x: (L + W - R) / 2, y: H - B + 25, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-2)" }, "Degree of multiprogramming"));
    svg.append(svgEl("text", { x: 10, y: (T + H - B) / 2, "text-anchor": "middle", "font-size": 9.5, fill: "var(--ink-2)", transform: `rotate(-90 10 ${(T + H - B) / 2})` }, "CPU utilization (in percent)"));
    const curve = (pp, col, w, dash) => {
      const pts = [];
      for (let i = 0; i <= xmax * 4; i++) { const x = i / 4; pts.push(`${X(x).toFixed(1)},${Y(1 - Math.pow(pp, x)).toFixed(1)}`); }
      svg.append(svgEl("polyline", { points: pts.join(" "), fill: "none", stroke: col, "stroke-width": w, "stroke-dasharray": dash }));
      for (let i = 1; i <= xmax; i++) svg.append(svgEl("circle", { cx: X(i), cy: Y(1 - Math.pow(pp, i)), r: w > 2 ? 2.4 : 1.8, fill: col }));
    };
    const fam = [[0.2, "20% I/O wait", ""], [0.5, "50% I/O wait", "5 3"], [0.8, "80% I/O wait", "2 3"]];
    const isFam = fam.some(([pp]) => Math.abs(pp - p) < 1e-9);
    if (!isFam) fam.push([p, `p = ${p.toFixed(2)}`, ""]);
    fam.forEach(([pp, lab, dash], i) => {
      const hot = Math.abs(pp - p) < 1e-9, col = hot ? "var(--hl)" : "var(--ink-dim)";
      curve(pp, col, hot ? 2.4 : 1.2, hot ? "" : dash);
      const lx = 6 + i * 88;
      svg.append(svgEl("line", { x1: lx, x2: lx + 18, y1: H - 6, y2: H - 6, stroke: col, "stroke-width": hot ? 2.4 : 1.4, "stroke-dasharray": hot ? "" : dash }));
      svg.append(svgEl("text", { x: lx + 22, y: H - 3, "font-size": 9, fill: hot ? "var(--hl)" : "var(--ink-2)" }, lab));
    });
    const U = 1 - Math.pow(p, n);
    svg.append(svgEl("line", { x1: X(n), x2: X(n), y1: Y(0), y2: Y(U), stroke: "var(--hl)", "stroke-dasharray": "3 3" }));
    svg.append(svgEl("circle", { cx: X(n), cy: Y(U), r: 5, fill: "var(--hl)", stroke: "var(--paper)", "stroke-width": 1.5 }));
    svg.append(svgEl("text", { x: X(n) + (n > xmax * 0.7 ? -6 : 6), y: Y(U) + (U > 0.9 ? 14 : -7), "text-anchor": n > xmax * 0.7 ? "end" : "start", "font-size": 10, "font-weight": 600, fill: "var(--hl)" }, `${fx(U * 100, 1)} %`));
    if (extra) extra(svg, X, Y);
    return svg;
  }
  function stepsBox(lines) {
    const d = el("div", "stat-steps");
    d.innerHTML = lines.map((l) => `<div style="margin:3px 0">${l}</div>`).join("");
    return d;
  }
  function draw() {
    out.innerHTML = "";
    const g = el("div", "stat-grid");
    if (mode === "curve") {
      const { p, n } = S, w = Math.pow(p, n), U = 1 - w;
      out.append(chart(p, n));
      grid(g, [["CPU utilization", pct(U)], ["CPU waste (all n waiting)", fx(w), pct(w)]]);
      const lines = [`CPU utilization = 1 − ${sup("p", "n")} = 1 − ${sup(fx(p, 2), n)} = 1 − ${fx(w)} = <b>${fx(U)}</b>`, `<i>CPU waste</i> = ${sup(fx(p, 2), n)} ≈ ${fx(w)}: the probability that all ${n} process${n > 1 ? "es are" : " is"} waiting for I/O (in which case the CPU will be idle).`];
      if (n === 3) {
        const a = Math.pow(1 - p, 3), b = 3 * p * Math.pow(1 - p, 2), c = 3 * p * p * (1 - p);
        lines.push(`Slide 44, n = 3: U = (1 − p)³ + 3p(1 − p)² + 3p²(1 − p) = ${fx(a)} + ${fx(b)} + ${fx(c)} = ${fx(a + b + c)} = 1 − p³. The term 3p(1 − p)² = ${fx(b)} is the case "exactly one waiting, two ready" (lab 4 Q8).`);
      }
      if (Math.abs(p - 0.8) < 1e-9 && n === 10) lines.push("Slide 46: <i>CPU waste = (0.8)¹⁰ ≈ 0.1074</i>. That is 10.74 %, a hair above 10 %; see the inverse tab.");
      lines.push("The model assumes that all n processes are independent (slide 46).");
      out.append(g, stepsBox(lines));
    } else if (mode === "ram") {
      const ramMB = S.ram * 1024, free = ramMB - S.os, n = Math.max(0, Math.floor(free / S.size));
      const lines = [`${fx(S.ram, 3)} GB = ${fx(S.ram, 3)} × 1024 = ${fx(ramMB, 1)} MB`, `Memory for programs = ${fx(ramMB, 1)} − ${fx(S.os, 1)} = ${fx(free, 1)} MB`, `Processes that fit = ⌊${fx(free, 1)} ÷ ${fx(S.size, 1)}⌋ = <b>${n}</b>${free / S.size !== n && n > 0 ? ` (${fx(free / S.size, 3)} rounded down)` : ""}`];
      if (n >= 1) {
        const pMax = Math.pow(1 - S.target, 1 / n), U = 1 - Math.pow(S.ramP, n);
        lines.push(`Goal ${fx(S.target)}: 1 − ${sup("p", n)} = ${fx(S.target)} ⇒ ${sup("p", n)} = ${fx(1 - S.target)} ⇒ p = ${fx(1 - S.target)}<sup>1/${n}</sup> = <b>${fx(pMax)}</b> ≈ ${fx(pMax, 2)}: each process may wait for I/O up to about ${fx(pMax * 100, 0)} % of the time.`);
        lines.push(`Check with p = ${fx(S.ramP, 2)}: utilization = 1 − ${sup(fx(S.ramP, 2), n)} = 1 − ${fx(Math.pow(S.ramP, n))} = ${fx(U)} (${pct(U)}), ${U >= S.target ? "meets" : "misses"} the goal.`);
        grid(g, [["processes in memory n", String(n)], ["max I/O wait p", fx(pMax), `for ${pct(S.target, 2)} utilization`], [`utilization at p = ${fx(S.ramP, 2)}`, pct(U)]]);
        out.append(chart(S.ramP, Math.min(20, n)));
      } else { lines.push("No process fits: the OS leaves too little memory."); grid(g, [["processes in memory n", "0"]]); }
      out.append(g, stepsBox(lines));
    } else if (mode === "inverse") {
      const w = 1 - S.invTarget;
      if (S.invFind === "n") {
        const p = S.p;
        const exact = Math.log(w) / Math.log(p);
        let nMin = Math.max(1, Math.ceil(exact - 1e-12));
        while (Math.pow(p, nMin) >= w - 1e-15 && Math.pow(p, nMin) > w) nMin++;
        const lines = [`Goal: CPU waste ${sup(fx(p, 2), "n")} below ${fx(w)} (utilization at least ${fx(S.invTarget)}).`, `n ≥ ln ${fx(w)} ÷ ln ${fx(p, 2)} = ${fx(Math.log(w))} ÷ ${fx(Math.log(p))} = ${fx(exact, 3)} ⇒ smallest whole n = <b>${nMin}</b>.`];
        const rows = [];
        for (let k = Math.max(1, nMin - 2); k <= Math.min(40, nMin + 1); k++) {
          const ww = Math.pow(p, k);
          rows.push(`<tr${k === nMin ? ' style="color:var(--hl);font-weight:600"' : ""}><td>${k}</td><td>${sup(fx(p, 2), k)} = ${fx(ww)}</td><td>${pct(ww)}</td><td>${ww < w ? "below" : "not below"}</td></tr>`);
        }
        const tbl = el("div");
        tbl.innerHTML = `<table class="group-table" style="margin:8px 0"><tr><th>n</th><th>waste pⁿ</th><th>%</th><th>vs ${pct(w, 2)}</th></tr>${rows.join("")}</table>`;
        if (Math.abs(p - 0.8) < 1e-9 && Math.abs(w - 0.1) < 1e-9) lines.push(`Slide 46 says: <i>"if processes spend 80% of their time waiting for I/O, at least 10 processes must be in memory at once to get the CPU waste below 10%"</i>, with <i>CPU waste = (0.8)¹⁰ ≈ 0.1074</i>. But 0.1074 is 10.74 %, just above 10 %: by the arithmetic, 11 processes are needed (0.8¹¹ ≈ ${fx(Math.pow(0.8, 11))} = ${pct(Math.pow(0.8, 11))}). The slide reads the figure, where the 80 % curve reaches about 90 % at n = 10; a quiz may still expect "10".`);
        grid(g, [["smallest n", String(nMin)], [`waste at n = ${nMin}`, fx(Math.pow(p, nMin)), pct(Math.pow(p, nMin))], [`waste at n = ${nMin - 1 || 1}`, fx(Math.pow(p, Math.max(1, nMin - 1)))]]);
        out.append(chart(p, Math.min(20, nMin)), g, tbl, stepsBox(lines));
      } else {
        const n = S.n, pMax = Math.pow(w, 1 / n);
        grid(g, [["largest p", fx(pMax), `≈ ${fx(pMax * 100, 1)} % I/O wait`], ["check 1 − pⁿ", fx(1 - Math.pow(pMax, n))]]);
        out.append(chart(clamp(Number(pMax.toFixed(2)), 0, 0.99), n), g, stepsBox([`1 − ${sup("p", n)} = ${fx(S.invTarget)} ⇒ ${sup("p", n)} = ${fx(w)} ⇒ p = ${fx(w)}<sup>1/${n}</sup> = e<sup>ln ${fx(w)} / ${n}</sup> = e<sup>${fx(Math.log(w) / n)}</sup> = <b>${fx(pMax)}</b>`, n === 14 && Math.abs(w - 0.01) < 1e-9 ? "Practice Q3: p<sup>14</sup> = 0.01 ⇒ p ≈ 0.72." : ""].filter(Boolean)));
      }
    } else {
      const { k, C, parP: p } = S;
      const alone = C / (1 - p), seq = k * alone, U = 1 - Math.pow(p, k), par = (k * C) / U;
      const lines = [
        `One job alone: the CPU is busy ${fx((1 - p) * 100, 1)} % of the time, so ${fx(C, 2)} min of CPU takes T = ${fx(C, 2)} ÷ (1 − ${fx(p, 2)}) = <b>${fx(alone, 2)} min</b> (the paper writes ${fx(C, 2)} + ${fx(p, 2)} × T = T).`,
        `Sequentially: ${k} × ${fx(alone, 2)} = <b>${fx(seq, 2)} min</b> for the last one to finish.`,
        `In parallel: CPU utilization = 1 − ${sup(fx(p, 2), k)} = ${fx(U)}. The CPU must deliver ${k} × ${fx(C, 2)} = ${fx(k * C, 2)} min of work, so T<sub>total</sub> = ${fx(k * C, 2)} ÷ ${fx(U)} = <b>${fx(par, 2)} min</b>.`,
        `The model treats the jobs as independent and keeps all ${k} jobs in memory until the last one finishes.`,
      ];
      grid(g, [["one job alone", `${fx(alone, 2)} min`], ["sequential", `${fx(seq, 2)} min`], ["parallel", `${fx(par, 2)} min`, `utilization ${fx(U)}`]]);
      const svg = svgEl("svg", { viewBox: "0 0 360 70", class: "curve-svg net-svg", role: "img" }), mx = Math.max(seq, par);
      [["sequential", seq, "var(--ink-dim)"], ["parallel", par, "var(--hl)"]].forEach(([lab, v, col], i) => {
        const y = 8 + i * 30, w = (v / mx) * 220;
        svg.append(svgEl("text", { x: 4, y: y + 14, "font-size": 10.5, fill: "var(--ink-2)" }, lab));
        svg.append(svgEl("rect", { x: 74, y, width: w, height: 20, rx: 3, fill: col, opacity: 0.85 }));
        svg.append(svgEl("text", { x: 78 + w, y: y + 14, "font-size": 10.5, fill: "var(--ink)" }, `${fx(v, 1)} min`));
      });
      out.append(svg, g, stepsBox(lines));
    }
  }
  build();
}

// ---------- widget: multiprog-play ----------
const MP_DEFAULT = { A: "cpu 2 io 3 cpu 3", B: "cpu 1 io 6 cpu 1", C: "cpu 8 io 1 cpu 1" };
function parseJob(s) {
  const out = [];
  const re = /(cpu|io|i\/o)\s*(\d+)/gi;
  let m;
  while ((m = re.exec(String(s)))) out.push({ t: m[1].toLowerCase() === "cpu" ? "cpu" : "io", n: clamp(+m[2], 1, 30) });
  return out.length && out.reduce((a, b) => a + b.n, 0) <= 60 ? out : null;
}
function mpSim(jobs, order) {
  // Without multiprogramming: each job runs to completion, in order; the CPU idles during its I/O.
  const seq = [];
  for (const j of order) {
    const cnt = { cpu: 0, io: 0 };
    for (const b of jobs[j]) for (let i = 0; i < b.n; i++) {
      cnt[b.t]++;
      const cells = { [j]: { t: b.t, num: cnt[b.t] } };
      seq.push({ owner: b.t === "cpu" ? j : null, cells, ioBy: b.t === "io" ? j : null });
    }
  }
  // With multiprogramming: each unit the CPU goes to the first READY job in `order` (preemptive, fixed priority).
  const st = {};
  for (const j of order) st[j] = { bi: 0, left: jobs[j][0].n, cnt: { cpu: 0, io: 0 } };
  const done = (j) => st[j].bi >= jobs[j].length;
  const kind = (j) => (done(j) ? null : jobs[j][st[j].bi].t);
  const mp = [];
  let prev = null;
  for (let t = 0; t < 200 && order.some((j) => !done(j)); t++) {
    const ready = order.filter((j) => kind(j) === "cpu");
    const owner = ready[0] || null;
    const cells = {};
    for (const j of order) {
      const k = kind(j);
      if (k === "io" || (k === "cpu" && j === owner)) { st[j].cnt[k]++; cells[j] = { t: k, num: st[j].cnt[k] }; }
      else if (k === "cpu") cells[j] = { t: "wait" };
    }
    // Why the CPU goes where it goes, in the lesson's words.
    let why;
    const prevKind = prev && !done(prev) ? kind(prev) : null;
    const ord = order.join(", ");
    if (!owner) why = `the CPU is idle: ${order.filter((j) => kind(j) === "io").join(" and ")} ${order.filter((j) => kind(j) === "io").length > 1 ? "are" : "is"} doing I/O and no job is ready.`;
    else if (t === 0) why = `${owner} is first in the order ${ord}, so ${owner} gets the CPU.`;
    else if (owner === prev) why = `${owner} keeps the CPU (CPU unit ${cells[owner].num} of ${jobs[owner].filter((b) => b.t === "cpu").reduce((a, b) => a + b.n, 0)}).`;
    else if (prev && prevKind === "cpu") why = `${owner} is ready again, and ${owner} comes before ${prev}, so ${owner} takes the CPU.`;
    else if (prev && prevKind === "io") why = `${prev} started I/O, so the CPU takes ${owner}${ready.length > 1 ? ` (${owner} is the first ready job in the order ${ord})` : ""}.`;
    else if (prev && done(prev)) why = `${prev} is finished, so the CPU takes ${owner}.`;
    else why = `the CPU takes ${owner}, the first ready job in the order ${ord}.`;
    mp.push({ owner, cells, why });
    for (const j of order) {
      if (!cells[j] || cells[j].t === "wait") continue;
      if (--st[j].left === 0) { st[j].bi++; if (!done(j)) st[j].left = jobs[j][st[j].bi].n; }
    }
    prev = owner;
  }
  return { seq, mp };
}
function multiprogPlay(box, cfg) {
  const src = cfg.jobs && typeof cfg.jobs === "object" ? cfg.jobs : MP_DEFAULT;
  let texts = {};
  for (const [k, v] of Object.entries(src).slice(0, 5)) texts[k] = String(v);
  let orderText = cfg.order || Object.keys(texts).join(" ");
  let jobs = {}, order = [], sim = null, pb = null;
  box.append(el("h4", null, cfg.title || "CPU utilization with and without multiprogramming"));
  const form = el("div");
  const { caption, ask } = playParts();
  const pk = predictKit(ask, "Predict who has the CPU before each time unit", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const svg = svgEl("svg", { viewBox: "0 0 360 300", class: "curve-svg net-svg", role: "img" });
  const stats = el("div", "stat-grid");
  const note = el("p", "widget-note");
  const rule = el("p", "widget-note");
  box.append(form, rule, pk.row, svg, caption, ask);
  function buildForm() {
    form.innerHTML = "";
    form.append(presetRow([["practice Q2", () => { texts = { ...MP_DEFAULT }; orderText = "A B C"; buildForm(); restart(); }]]));
    for (const k of Object.keys(texts)) {
      const r = el("div", "unit-row"), inp = document.createElement("input");
      inp.type = "text"; inp.value = texts[k]; sty(inp, "width:180px");
      inp.setAttribute("aria-label", `bursts of job ${k}`);
      inp.addEventListener("change", () => { texts[k] = inp.value; restart(); });
      r.append(el("label", null, `job ${k}`), inp);
      form.append(r);
    }
    const r = el("div", "unit-row"), inp = document.createElement("input");
    inp.type = "text"; inp.value = orderText; sty(inp, "width:180px");
    inp.addEventListener("change", () => { orderText = inp.value; restart(); });
    r.append(el("label", null, "order"), inp);
    form.append(r);
  }
  const COL = { cpu: "var(--blue)", io: "#e8a87c", wait: "var(--paper-3)" };
  function frame(pos) {
    const L1 = sim.seq.length, L2 = sim.mp.length, N = Math.max(L1, L2), q = pk.asking(pos, N);
    const s = q ? pk.answered : Math.ceil(pos - 1e-9) - 1, u = q ? 0 : clamp(pos - s, 0, 1);
    const shownUpTo = q ? pk.answered : pos; // cells with t < shownUpTo are drawn (partial for the last)
    const LBL = 30, W = 360, cw = (W - LBL - 6) / N, rowH = 15;
    svg.innerHTML = "";
    let y = 4;
    const panel = (title, arr, L) => {
      svg.append(svgEl("text", { x: 2, y: y + 10, "font-size": 11, "font-weight": 600, fill: "var(--ink)" }, title));
      y += 16;
      const rows = [...order, "CPU"];
      const hotT = q ? pk.answered : s;
      if (hotT >= 0 && hotT < L) svg.append(svgEl("rect", { x: LBL + hotT * cw, y: y - 1, width: cw, height: rows.length * rowH + 1, fill: "var(--hl-soft)" }));
      rows.forEach((j, r) => {
        const yy = y + r * rowH;
        svg.append(svgEl("text", { x: 4, y: yy + 11, "font-size": 10, fill: j === "CPU" ? "var(--hl)" : "var(--ink-2)" }, j));
        svg.append(svgEl("rect", { x: LBL, y: yy, width: L * cw, height: rowH - 2, fill: "none", stroke: "var(--rule)", "stroke-width": 0.5 }));
        for (let t = 0; t < L && t < shownUpTo; t++) {
          const frac = Math.min(1, shownUpTo - t), x = LBL + t * cw;
          if (j === "CPU") {
            const o = arr[t].owner;
            svg.append(svgEl("rect", { x: x + 0.5, y: yy, width: Math.max(0, cw * frac - 1), height: rowH - 2, fill: o ? "var(--green-soft)" : "var(--red-soft)", stroke: o ? "var(--green)" : "var(--red)", "stroke-width": 0.6 }));
            if (frac > 0.6) svg.append(svgEl("text", { x: x + cw / 2, y: yy + 10, "text-anchor": "middle", "font-size": Math.min(9, cw * 0.8), fill: o ? "var(--green)" : "var(--red)" }, o || "–"));
          } else {
            const c = arr[t].cells[j];
            if (!c) continue;
            svg.append(svgEl("rect", { x: x + 0.5, y: yy, width: Math.max(0, cw * frac - 1), height: rowH - 2, fill: COL[c.t], opacity: c.t === "wait" ? 0.8 : 0.9 }));
            if (c.num && frac > 0.6 && cw >= 9) svg.append(svgEl("text", { x: x + cw / 2, y: yy + 10, "text-anchor": "middle", "font-size": Math.min(8.5, cw * 0.7), fill: "#10141c" }, c.num));
          }
        }
      });
      y += rows.length * rowH + 2;
      for (let t = 0; t <= N; t += N > 20 ? 5 : 2) svg.append(svgEl("text", { x: LBL + t * cw, y: y + 9, "text-anchor": "middle", "font-size": 8.5, fill: "var(--ink-dim)" }, t));
      y += 18;
    };
    panel("a) without multiprogramming", sim.seq, L1);
    panel("b) with multiprogramming", sim.mp, L2);
    // legend
    [["CPU", COL.cpu], ["I/O", COL.io], ["ready, waiting for the CPU", COL.wait]].forEach(([lab, col], i) => {
      const x = 4 + i * 74;
      svg.append(svgEl("rect", { x, y: y - 2, width: 10, height: 10, fill: col }));
      svg.append(svgEl("text", { x: x + 14, y: y + 7, "font-size": 9.5, fill: "var(--ink-2)" }, lab));
    });
    svg.setAttribute("viewBox", `0 0 360 ${y + 14}`);
    // stats
    const busy1 = sim.seq.filter((c) => c.owner).length, busy2 = sim.mp.filter((c) => c.owner).length;
    const upTo = Math.floor(q ? pk.answered : pos + 1e-9);
    const live = (arr, L, busy) => {
      if (upTo >= L) return [`${busy}/${L} = ${fx(busy / L, 3)}`, `CPU busy ${busy} of ${L} units`];
      const b = arr.slice(0, upTo).filter((c) => c.owner).length;
      return [upTo ? `${b}/${upTo} so far` : "—", `finishes at ${L} units`];
    };
    const a = live(sim.seq, L1, busy1), b = live(sim.mp, L2, busy2);
    grid(stats, [["utilization, without", a[0], a[1]], ["utilization, with", b[0], b[1]]]);
    let text;
    const tq = q ? pk.answered : s;
    if (q) text = tq < L2 ? `Time unit ${tq} (with multiprogramming): who has the CPU?` : `Time unit ${tq}, without multiprogramming (the other chart is finished): who has the CPU?`;
    else if (s < 0) text = `Press Play: one step = one time unit. Total CPU time is ${busy1} units; CPU utilization = total CPU time ÷ total real time.`;
    else {
      const parts = [];
      if (s < L2) parts.push(`t = ${s}, with multiprogramming: ${sim.mp[s].why}`);
      else parts.push(`With multiprogramming everything finished after ${L2} units.`);
      if (s < L1) {
        const c = sim.seq[s];
        parts.push(c.owner ? `Without: ${c.owner} has the CPU.` : `Without: the CPU idles while ${c.ioBy} does I/O.`);
      }
      if (s === N - 1 && u >= 1 - 1e-9) parts.push(`CPU utilization: without ${busy1}/${L1} = ${fx(busy1 / L1, 3)}, with ${busy2}/${L2} = ${fx(busy2 / L2, 3)}.${pk.tally()}`);
      text = parts.join(" ");
    }
    setText(caption, text);
    if (q) {
      const arr = tq < L2 ? sim.mp : sim.seq, ans = arr[tq].owner || "idle";
      const why = tq < L2 ? `${sim.mp[tq].why.replace(/^./, (c) => c.toUpperCase())}` : ans === "idle" ? `The running job is doing I/O and nobody else may use the CPU.` : `${ans} runs to completion before the next job starts.`;
      pk.render(true, `mp|${JSON.stringify(texts)}|${tq}`, [...order, "idle"].map((j) => ({ label: j, ok: j === ans, why })));
    } else pk.render(false);
  }
  function restart() {
    const errs = [];
    jobs = {};
    for (const [k, v] of Object.entries(texts)) { const p = parseJob(v); if (p) jobs[k] = p; else errs.push(k); }
    order = String(orderText).trim().split(/[\s,]+/).filter((j) => jobs[j]);
    order = [...new Set(order)];
    for (const k of Object.keys(jobs)) if (!order.includes(k)) order.push(k);
    if (!order.length) { jobs = {}; for (const [k, v] of Object.entries(MP_DEFAULT)) jobs[k] = parseJob(v); order = ["A", "B", "C"]; errs.push("all"); }
    sim = mpSim(jobs, order);
    rule.textContent = `Rule with multiprogramming: in each time unit the CPU goes to the first ready job in the order ${order.join(", ")}; a job whose I/O has finished takes the CPU back from a later job, and I/O of different jobs overlaps. (Our reading of the instructor's chart; it reproduces it exactly.)`;
    note.textContent = errs.length ? `Could not read job ${errs.join(", ")}: write bursts like "cpu 2 io 3 cpu 3" (each 1–30 units, at most 60 per job).` : "Practice paper Q2: CPU utilization = total CPU time ÷ total real time. Without multiprogramming 16 ÷ (16 + 10) = 16/26 = 0.615; with multiprogramming 16/17 = 0.94, idle only at t = 15.";
    pk.reset();
    pb.reset(Math.max(sim.seq.length, sim.mp.length));
  }
  buildForm();
  sim = { seq: [{}], mp: [{}] };
  pb = createPlayback({ count: 1, unit: "time unit", onFrame: (p) => (order.length ? frame(p) : null), stepMs: () => cfg.stepMs || 700, limit: () => pk.limit(Math.max(sim.seq.length, sim.mp.length)), onBlocked: () => pk.nudge() });
  box.append(pb.el, stats, note);
  restart();
}

// ---------- widget: fork-play ----------
// A program is { title, source, code: [lines], pid, ppid, shell, childPids, first, cmd, steps }.
// steps: { line, op, ... } with op one of
//   print  { text, append? }   text placeholders: {getpid} {getppid} {$var}
//   fork   { v? }              the parent gets the child's pid in v, the child gets 0
//   getpid { v }
//   set    { v, value, say?, ask? }
//   if     { cond: [var, "==" | "!=" | "<" | ">", number], else: line }   false: jump to the first step at or after `else`
//   goto   { to: line }        (instant)    nop (instant)
//   wait   { call? }           blocks until a child has exited, then reaps it
//   sleep  { n }               state S; it wakes when nothing else can run
//   exit   { code?, ret? }     ret: "return 0" from main
//   exec   { prog, call?, out: [lines] }   replaces the image; the new program prints `out` and exits
//   end    { say }             stops the trace (the shell's endless loop)
// Every step may carry `say` (a string, or { parent, child }) appended to its caption, and `ask` { q, options, answer, why }.
const INC3 = ["#include <stdio.h>", "#include <unistd.h>", "#include <sys/types.h>"];
const FORK_PROGRAMS = {
  "fork and print pids": {
    source: "Part 5 slides 26–28: both processes run the lines after fork(). The parent's pid (735) is ours; the slide shows only the child's 736.",
    code: [...INC3, "int main()", "{", '    printf("Line number : %d  \\n", __LINE__);', "    pid_t pid;", "    pid = fork();", '    printf("Line number : %d , pid = %d \\n", __LINE__, pid);', '    printf("Line number : %d , pid = %d \\n", __LINE__, pid);', "", "    return 0;", "}"],
    pid: 735, ppid: 433, childPids: [736],
    steps: [{ line: 6, op: "print", text: "Line number : 6" }, { line: 7, op: "nop" }, { line: 8, op: "fork", v: "pid" }, { line: 9, op: "print", text: "Line number : 9 , pid = {$pid}" }, { line: 10, op: "print", text: "Line number : 10 , pid = {$pid}" }, { line: 12, op: "exit", ret: true }],
  },
  "parent and child branch": {
    source: "Part 5 slides 29–31: if (pid==0) picks the child's body; the child returns at line 11 and never reaches line 13. The parent's pid (983) is ours; the slide shows the child's 984.",
    code: [...INC3, "int main()", "{", '    printf("Line number : %d  \\n", __LINE__);', "    pid_t pid;", "    pid = fork();", "    if (pid==0){", '        printf("Line number : %d  , pid = %d \\n", __LINE__, pid);', "        return 0;", "    }", '    printf("Line number : %d , pid = %d \\n", __LINE__, pid);', "", "    return 0;", "}"],
    pid: 983, ppid: 433, childPids: [984],
    steps: [{ line: 6, op: "print", text: "Line number : 6" }, { line: 7, op: "nop" }, { line: 8, op: "fork", v: "pid" }, { line: 9, op: "if", cond: ["pid", "==", 0], else: 13 }, { line: 10, op: "print", text: "Line number : 10  , pid = {$pid}" }, { line: 11, op: "exit", ret: true }, { line: 13, op: "print", text: "Line number : 13 , pid = {$pid}" }, { line: 15, op: "exit", ret: true }],
  },
  "fork and waitpid": {
    source: "Part 5 slide 32: waitpid makes the parent wait, so the child's lines come before the parent's line 20. The parent's pid (1824) is ours; the slide shows the child's 1825.",
    code: ["#include <stdio.h>", "#include <unistd.h>", "#include <sys/wait.h>", "", "int main()", "{", "    int status;", "    pid_t fork_return = fork();", "    if (fork_return == 0){", "        int sum = 0;", "        for(int i=1; i<101; i++){", "            sum += i;", "            }", '        printf("child done : sum = %d \\n", sum);', "    }", "    else{", '        printf("Line : %d \\n", __LINE__);', "        waitpid(-1, &status, 0);", "    }", '    printf("Line : %d , Fork return = %d \\n", __LINE__, fork_return);', "    return 0;", "}"],
    pid: 1824, ppid: 433, childPids: [1825],
    steps: [{ line: 7, op: "nop" }, { line: 8, op: "fork", v: "fork_return" }, { line: 9, op: "if", cond: ["fork_return", "==", 0], else: 16 },
      { line: 10, op: "set", v: "sum", value: 5050, lines: [10, 13], say: "The loop adds i = 1, 2, …, 100: sum = 100 × 101 ÷ 2 = 5050.", ask: { q: "What is sum after the loop?", options: ["5050", "5000", "4950", "100"], answer: 0, why: "1 + 2 + … + 100 = 100 × 101 ÷ 2 = 5050." } },
      { line: 14, op: "print", text: "child done : sum = {$sum}" }, { line: 15, op: "goto", to: 20 }, { line: 17, op: "print", text: "Line : 17" }, { line: 18, op: "wait", call: "waitpid(-1, &status, 0)" }, { line: 20, op: "print", text: "Line : 20 , Fork return = {$fork_return}" }, { line: 21, op: "exit", ret: true }],
  },
  "fork 4508 and 4509": {
    source: "Part 3 slide 48: fork() returns the child's pid (4509) in the parent and 0 in the child; the parent keeps its own pid 4508. The slide is a figure; this small program is ours.",
    code: ["#include <stdio.h>", "#include <unistd.h>", "", "int main()", "{", "    pid_t fork_return_value = fork();", '    printf("fork_return_value = %d, pid = %d\\n",', "           fork_return_value, getpid());", "    return 0;", "}"],
    pid: 4508, ppid: 433, childPids: [4509],
    steps: [{ line: 6, op: "fork", v: "fork_return_value" }, { line: 7, op: "print", text: "fork_return_value = {$fork_return_value}, pid = {getpid}" }, { line: 9, op: "exit", ret: true }],
  },
  "execve": {
    source: "Part 5 slides 35–37: a successful execve does not return, so \"Error\" is never printed. The pid (600) is ours.",
    code: ["#include<stdio.h>", "#include<stdlib.h>", "#include<unistd.h>", "", "int main(int argc, char* argv[]){", '    static char *args[] = { "", "-al","-d", NULL };', '    execve("/usr/bin/ls",args,0);', '    printf("Error \\n");', "    return 0;", "}"],
    pid: 600, ppid: 433,
    steps: [{ line: 6, op: "nop" }, { line: 7, op: "exec", prog: "/usr/bin/ls", call: 'execve("/usr/bin/ls",args,0)', out: ["drwxr-xr-x 4 user user 21 May 17 04:55 ."] }, { line: 8, op: "print", text: "Error" }, { line: 9, op: "exit", ret: true }],
  },
  "stripped-down shell": {
    source: "Part 3 slide 49 / Part 5 slide 38: the shell forks, the child execve's the command, the parent waits for it. One pass of the loop with the command ls; the pids and ls's output (main.c main.exe, from Part 3 slide 15) are illustrative.",
    code: ["#define TRUE 1", "", "while (TRUE) {                      /* repeat forever */", "    type_prompt( );                 /* display prompt on the screen */", "    read_command(command, parameters); /* read input from terminal */", "", "    if (fork( ) != 0) {             /* fork off child process */", "        /* Parent code. */", "        waitpid(−1, &status, 0);    /* wait for child to exit */", "    } else {", "        /* Child code. */", "        execve(command, parameters, 0); /* execute command */", "    }", "}"],
    pid: 1352, ppid: 1351, shell: "mintty", image: "shell", childPids: [1490], cmd: null,
    steps: [{ line: 3, op: "nop" }, { line: 4, op: "print", text: "~$", say: "type_prompt( ) displays the prompt on the screen." },
      { line: 5, op: "print", text: " ls", append: true, say: "read_command reads input from the terminal: the user types ls.", ask: { q: "What does read_command do?", options: ["reads the command (ls) from the terminal", "runs ls", "creates a process"], answer: 0, why: "read_command only reads input from terminal; fork and execve do the rest." } },
      { line: 7, op: "fork", v: "ret", call: "fork( )" }, { line: 7, op: "if", cond: ["ret", "!=", 0], else: 12, text: "fork( ) != 0" },
      { line: 9, op: "wait", call: "waitpid(−1, &status, 0)" }, { line: 10, op: "goto", to: 14 },
      { line: 12, op: "exec", prog: "ls", call: "execve(command, parameters, 0)", out: ["main.c  main.exe"] },
      { line: 14, op: "end", say: "Back to the top of while (TRUE): the shell displays the prompt again and repeats forever.", ask: { q: "What does the shell do next?", options: ["prompts again: the loop repeats forever", "exits, because ls has finished"], answer: 0, why: "while (TRUE) repeats forever." } }],
  },
  "zombie": {
    source: "Part 3 slides 63–64: the parent does not wait, so the child that exited is a zombie (Z) while the parent sleeps; top shows \"1 zombie\". The slides show only the output (Child: pid is 1550, Parent: pid is 1549); this program is ours.",
    code: ["#include <stdio.h>", "#include <stdlib.h>", "#include <unistd.h>", "", "int main()", "{", "    pid_t pid = fork();", "    if (pid == 0) {", '        printf("Child: pid is %d\\n", getpid());', "        exit(0);", "    }", "    sleep(1);", '    printf("Parent: pid is %d\\n", getpid());', "    sleep(60);      /* no wait(): the child stays a zombie */", "    return 0;", "}"],
    pid: 1549, ppid: 910, childPids: [1550],
    steps: [{ line: 7, op: "fork", v: "pid" }, { line: 8, op: "if", cond: ["pid", "==", 0], else: 12 }, { line: 9, op: "print", text: "Child: pid is {getpid}" }, { line: 10, op: "exit", code: 0 }, { line: 12, op: "sleep", n: 1 }, { line: 13, op: "print", text: "Parent: pid is {getpid}" }, { line: 14, op: "sleep", n: 60, say: "top now shows \"1 zombie\": pid 1550 is Z (VIRT, RES and SHR all 0), its parent 1549 is S." }, { line: 15, op: "exit", ret: true }],
  },
  "zombie fixed with wait": {
    source: "Part 3 slides 65–66: with wait(), the parent reaps the child and top shows \"0 zombie\". The slides show only the output (Child: pid is 1850, Parent: pid is 1849); this program is ours.",
    code: ["#include <stdio.h>", "#include <stdlib.h>", "#include <unistd.h>", "#include <sys/wait.h>", "", "int main()", "{", "    pid_t pid = fork();", "    if (pid == 0) {", '        printf("Child: pid is %d\\n", getpid());', "        exit(0);", "    }", "    sleep(1);", '    printf("Parent: pid is %d\\n", getpid());', "    wait(NULL);", "    sleep(60);", "    return 0;", "}"],
    pid: 1849, ppid: 910, childPids: [1850],
    steps: [{ line: 8, op: "fork", v: "pid" }, { line: 9, op: "if", cond: ["pid", "==", 0], else: 13 }, { line: 10, op: "print", text: "Child: pid is {getpid}" }, { line: 11, op: "exit", code: 0 }, { line: 13, op: "sleep", n: 1 }, { line: 14, op: "print", text: "Parent: pid is {getpid}" }, { line: 15, op: "wait", call: "wait(NULL)" }, { line: 16, op: "sleep", n: 60, say: "top now shows \"0 zombie\": only the parent 1849 is listed." }, { line: 17, op: "exit", ret: true }],
  },
  "orphan": {
    source: "Part 3 slides 67–68: a.out(474) terminates before its child a.out(475), and pstree shows 475 re-parented to pid 1 (tini, playing init's role in the slide's container). The slides show no code; this program is ours.",
    code: ["#include <stdio.h>", "#include <unistd.h>", "", "int main()", "{", "    pid_t pid = fork();", "    if (pid == 0) {", "        sleep(2);", '        printf("Child: my parent is %d\\n", getppid());', "        return 0;", "    }", '    printf("Parent: pid is %d, exiting\\n", getpid());', "    return 0;", "}"],
    pid: 474, ppid: 433, childPids: [475],
    steps: [{ line: 6, op: "fork", v: "pid" }, { line: 7, op: "if", cond: ["pid", "==", 0], else: 12 }, { line: 8, op: "sleep", n: 2 }, { line: 9, op: "print", text: "Child: my parent is {getppid}" }, { line: 10, op: "exit", ret: true }, { line: 12, op: "print", text: "Parent: pid is {getpid}, exiting" }, { line: 13, op: "exit", ret: true }],
  },
  "two forks": {
    source: "Two forks in a row: every process that runs a fork() adds one child, so 1 → 2 → 4 processes and four lines. The pids are illustrative.",
    code: ["#include <stdio.h>", "#include <unistd.h>", "", "int main()", "{", "    fork();", "    fork();", '    printf("hello from pid %d\\n", getpid());', "    return 0;", "}"],
    pid: 500, ppid: 433, sched: "rr", orderNote: "The order between the processes is not guaranteed; this is one possible order.",
    steps: [{ line: 6, op: "fork" }, { line: 7, op: "fork" }, { line: 8, op: "print", text: "hello from pid {getpid}" }, { line: 9, op: "exit", ret: true }],
  },
  "lab 4 main1": {
    source: "Lab 4 Q1 (main1.c): the parent prints the child's pid 91 as fork's return value, the child prints 0; ps shows main1.out S 83 88 and main1.out S 88 91.",
    code: ["#include <stdio.h>", "#include <unistd.h>", "", "int main(){", "", "    pid_t fork_return = fork();", "    pid_t  pid = getpid();", '    printf("fork return value = %d , pid = %d \\n", fork_return, pid);', "    sleep(1);", "", "    return 0;", "}"],
    pid: 88, ppid: 83, childPids: [91], cmd: "./main1.out &",
    steps: [{ line: 6, op: "fork", v: "fork_return" }, { line: 7, op: "getpid", v: "pid" }, { line: 8, op: "print", text: "fork return value = {$fork_return} , pid = {$pid}" }, { line: 9, op: "sleep", n: 1, say: { child: "Both processes are now S (sleeping), as the lab's ps shows: main1.out S 83 88 (the parent, whose parent is the shell 83) and main1.out S 88 91." } }, { line: 11, op: "exit", ret: true }],
  },
  "lab 4 main3": {
    source: "Lab 4 Q9–Q11 (main3.c): the child prints Process x and exits; the parent prints Process y and sleeps, so ps shows the parent S and the child Z. The pids are illustrative.",
    code: ["#include <stdio.h>", "#include <stdlib.h>", "#include <unistd.h>", "", "int main() {", "    pid_t pid = fork();", "", "    if (pid < 0) {", '        perror("fork failed");', "        exit(1);", "    }", "", "    if (pid == 0) {", '        printf("Process x \\n");', "        exit(0);", "    } else {", '        printf("Process y \\n");', "        sleep(30);", "    }", "", "    return 0;", "}"],
    pid: 130, ppid: 83, childPids: [131], cmd: "./main3.out",
    steps: [{ line: 6, op: "fork", v: "pid" }, { line: 8, op: "if", cond: ["pid", "<", 0], else: 13 }, { line: 9, op: "print", text: "fork failed" }, { line: 10, op: "exit", code: 1 }, { line: 13, op: "if", cond: ["pid", "==", 0], else: 16 }, { line: 14, op: "print", text: "Process x" }, { line: 15, op: "exit", code: 0, say: { child: "ps now shows the parent main3.out S (sleeping in sleep(30)) and the child main3.out Z (it exited and the parent has not called wait()): Lab 4 Q11." } }, { line: 17, op: "print", text: "Process y" }, { line: 18, op: "sleep", n: 30 }, { line: 21, op: "exit", ret: true }],
  },
};
const FORK_ALIASES = { "fork and wait": "fork and waitpid", "waitpid": "fork and waitpid", "shell": "stripped-down shell", "slide 48": "fork 4508 and 4509", "main1": "lab 4 main1", "main3": "lab 4 main3", "zombie fixed": "zombie fixed with wait", "exec": "execve" };
const PCOL = ["var(--blue)", "var(--green)", "var(--purple)", "var(--hl)", "var(--red)", "var(--ink-2)"];
function forkTrace(prog) {
  const S = prog.steps;
  const procs = [], term = [], steps = [], snaps = [];
  let nextPid = prog.pid + 1;
  const childPids = (prog.childPids || []).slice();
  let initUsed = false, sleepSeq = 0, orderNoteDone = false, forked = false;
  const idxOfLine = (L) => { const i = S.findIndex((s) => s.line >= L); return i < 0 ? S.length : i; };
  procs.push({ i: 0, pid: prog.pid, ppid: prog.ppid, parent: -1, gen: 0, image: prog.image || "a.out", list: S, pc: 0, vars: {}, state: "R", forkRet: null, gone: false, sleepAt: 0, woke: false });
  const role = (p) => (p.parent === -1 && p.i === 0 ? "parent" : "child");
  const who = (p) => procs.length === 1 ? `pid ${p.pid}` : `pid ${p.pid} (${p.i === 0 ? "parent" : procs[p.parent] && procs[p.parent].i === 0 ? "child" : "child of " + (procs[p.parent] ? procs[p.parent].pid : "?")})`;
  const evalText = (t, p, over = {}) => t.replace(/\{getpid\}/g, over.getpid ?? p.pid).replace(/\{getppid\}/g, over.getppid ?? p.ppid).replace(/\{\$(\w+)\}/g, (m, v) => (over[v] ?? p.vars[v] ?? "?"));
  const live = () => procs.filter((p) => !p.gone);
  const settle = (p) => {
    for (let g = 0; g < 50; g++) {
      const s = p.list[p.pc];
      if (!s) return;
      if (s.op === "nop") p.pc++;
      else if (s.op === "goto") p.pc = idxOfLine(s.to);
      else return;
    }
  };
  const snapshot = () => {
    for (const p of procs) if (!p.gone) settle(p);
    snaps.push({ procs: procs.map((p) => ({ i: p.i, pid: p.pid, ppid: p.ppid, parent: p.parent, gen: p.gen, image: p.image, state: p.state, vars: { ...p.vars }, forkRet: p.forkRet, gone: p.gone, line: p.state === "Z" || p.gone || p.list !== S ? null : (S[p.pc] ? S[p.pc].line : null) })), term: term.map((t) => ({ ...t })), initUsed });
  };
  const reapers = (p) => {
    // Who will reap p when it exits, judged from the state before the exit.
    if (p.i === 0) return "shell";
    if (p.ppid === 1) return "init";
    const par = procs[p.parent];
    if (par && par.state === "W") return "waiting";
    return "zombie";
  };
  function exitProc(p, step) {
    const fate = reapers(p);
    p.state = "Z";
    const kids = procs.filter((c) => c.parent === p.i && !c.gone && c.ppid === p.pid);
    const adopted = [], adoptedZ = [];
    for (const c of kids) {
      c.ppid = 1; initUsed = true;
      if (c.state === "Z") { c.gone = true; step.reaped.push(c.i); adoptedZ.push(c.pid); } else adopted.push(c.pid);
    }
    if (fate === "shell" || fate === "init") { p.gone = true; step.reaped.push(p.i); }
    else if (fate === "waiting") procs[p.parent].state = "R";
    return { fate, adopted, adoptedZ, kids };
  }
  function pickNext(curI) {
    const r = procs.find((p) => !p.gone && p.state === "R" && p.i !== curI) || procs.find((p) => !p.gone && p.state === "R");
    if (r) return r.i;
    const sl = procs.filter((p) => !p.gone && p.state === "S").sort((a, b) => a.sleepAt - b.sleepAt)[0];
    if (sl) { sl.state = "R"; sl.woke = true; return sl.i; }
    return -1;
  }
  snapshot();
  let cur = 0, lastRunner = 0, stop = false;
  for (let guard = 0; guard < 90 && !stop; guard++) {
    let p = procs[cur];
    if (!p || p.gone || p.state !== "R") { cur = pickNext(cur); if (cur < 0) break; p = procs[cur]; }
    settle(p);
    const s = p.list[p.pc];
    const step = { i: p.i, pid: p.pid, line: p.list === S && s ? s.line : null, lines: s && s.lines, op: s ? s.op : "exit", reaped: [], born: null, printed: false, text: "", ask: null };
    let pre = "";
    if (p.woke) { pre = `pid ${p.pid} wakes up from sleep. `; p.woke = false; }
    else if (forked && p.i !== lastRunner && !orderNoteDone && !prog.steps.some((x) => x.op === "wait")) {
      pre = ""; orderNoteDone = "pending";
    }
    const say = s && s.say ? (typeof s.say === "string" ? s.say : s.say[role(p)] || "") : "";
    const nLive = live().length;
    const roleWord = p.i === 0 ? "the parent" : "the child";
    if (!s) {
      const r = exitProc(p, step);
      step.text = `${who(p)} reaches the end of main and terminates.`;
      void r;
    } else if (s.op === "print") {
      const out = evalText(s.text, p);
      if (s.append && term.length) term[term.length - 1].text += out; else term.push({ text: out, i: p.i });
      step.printed = true; step.out = out;
      step.text = s.append ? `${who(p)}: ${say}` : s.line == null ? `${who(p)}, now running ${p.image}, prints "${out}".` : `${who(p)} runs line ${s.line} and prints "${out}".${say ? " " + say : ""}`;
      if (s.ask) step.ask = mkAsk(s.ask);
      else if (/\{/.test(s.text)) {
        const cands = new Set();
        const nums = new Set([0, p.pid, p.ppid, ...procs.map((x) => x.pid)]);
        const keys = [...s.text.matchAll(/\{(\$?\w+)\}/g)].map((m) => m[1]);
        for (const q of procs) if (q !== p && !q.gone) cands.add(evalText(s.text, q));
        for (const k of keys) for (const n of nums) {
          const over = k.startsWith("$") ? { [k.slice(1)]: n } : { [k]: n };
          cands.add(evalText(s.text, p, over));
        }
        cands.delete(out);
        const opts = [out, ...[...cands].slice(0, 3)];
        step.ask = { q: `What does ${who(p)} print at line ${s.line}?`, opts: shuffleStable(opts.map((o) => ({ label: o, ok: o === out, why: `In this process ${keys.map((k) => k === "getpid" ? `getpid() is ${p.pid}` : k === "getppid" ? `getppid() is ${p.ppid}` : `${k.slice(1)} is ${p.vars[k.slice(1)]}`).join(" and ")}: fork() returns 0 in the child and the child's pid in the parent.` })), s.line) };
      } else if (nLive === 1) {
        step.ask = { q: `How many processes print "${out}" here?`, opts: [{ label: "1", ok: true }, { label: "2", ok: false, why: forked ? "The other processes have finished or take another branch." : "Only one process exists before the fork." }] };
      } else {
        step.ask = { q: `Which process prints "${out}" at line ${s.line}?`, opts: live().filter((x) => x.state !== "Z").map((x) => ({ label: `pid ${x.pid}`, ok: x === p, why: `The branch tests the value fork() returned: 0 in the child, the child's pid in the parent; only pid ${p.pid} reaches line ${s.line} now.` })) };
      }
      p.pc++;
    } else if (s.op === "fork") {
      const cpid = childPids.length ? childPids.shift() : nextPid;
      nextPid = Math.max(nextPid, cpid) + 1;
      const c = { i: procs.length, pid: cpid, ppid: p.pid, parent: p.i, gen: p.gen + 1, image: p.image, list: p.list, pc: p.pc + 1, vars: { ...p.vars }, state: "R", forkRet: 0, gone: false, sleepAt: 0, woke: false };
      if (s.v) { p.vars[s.v] = cpid; c.vars[s.v] = 0; }
      p.forkRet = cpid;
      procs.push(c);
      step.born = c.i;
      step.text = `${who(p)} calls ${s.call || "fork()"}: a child, pid ${cpid}, is created, a copy of the parent. fork() returns ${cpid} (the child's pid) in the parent and 0 in the child; execution in both continues at the instruction following the fork. ${nLive + 1} processes now.`;
      const ans = nLive + 1;
      const optsN = [...new Set([ans, nLive * 2, ans + 1, Math.max(1, nLive)])].sort((a, b) => a - b);
      step.ask = { q: `How many processes exist after ${who(p)} runs line ${s.line}?`, opts: optsN.map((n) => ({ label: String(n), ok: n === ans, why: `Each process that calls fork() adds exactly one child: ${nLive} + 1 = ${ans}.` })) };
      p.pc++;
      forked = true;
    } else if (s.op === "getpid") {
      p.vars[s.v] = p.pid;
      step.text = `${who(p)} runs line ${s.line}: getpid() returns its own pid, ${p.pid}, so ${s.v} = ${p.pid}.`;
      const opts = [...new Set([p.pid, 0, ...procs.filter((x) => x !== p).map((x) => x.pid)])].slice(0, 4);
      step.ask = { q: `What does getpid() return in ${who(p)}?`, opts: opts.map((n) => ({ label: String(n), ok: n === p.pid, why: "getpid() gets the process ID of the current process; it is never the fork return value." })) };
      p.pc++;
    } else if (s.op === "set") {
      p.vars[s.v] = s.value;
      step.text = `${who(p)} runs line${s.lines ? `s ${s.lines[0]}–${s.lines[1]}` : ` ${s.line}`}: ${say || `${s.v} = ${s.value}.`}`;
      step.ask = s.ask ? mkAsk(s.ask) : null;
      p.pc++;
    } else if (s.op === "if") {
      const [v, op, k] = s.cond, x = p.vars[v];
      const ok = op === "==" ? x === k : op === "!=" ? x !== k : op === "<" ? x < k : x > k;
      const condText = s.text || `${v} ${op} ${k}`;
      step.text = `${who(p)} tests ${condText}: ${v} is ${x} in ${roleWord}, so the test is ${ok ? "true and it runs the body" : `false and it skips to line ${S[idxOfLine(s.else)] ? S[idxOfLine(s.else)].line : s.else}`}.`;
      step.ask = { q: `${who(p)}: is ${condText} true here?`, opts: [{ label: "true", ok: ok, why: `${v} is ${x} in this process.` }, { label: "false", ok: !ok, why: `${v} is ${x} in this process.` }] };
      p.pc = ok ? p.pc + 1 : idxOfLine(s.else);
    } else if (s.op === "wait") {
      const z = procs.find((c) => c.parent === p.i && c.ppid === p.pid && c.state === "Z" && !c.gone);
      const kidsLive = procs.some((c) => c.parent === p.i && c.ppid === p.pid && !c.gone);
      const call = s.call || "wait(NULL)";
      const O = ["waits (blocks) until a child exits", "reaps the exited child and goes on", "returns −1 at once: no children"];
      let ans;
      if (z) {
        z.gone = true; step.reaped.push(z.i); p.pc++; ans = 1;
        step.text = `${who(p)}: ${call} returns ${z.pid}. The parent reaps the zombie child: its entry leaves the process table, so no zombie remains.`;
      } else if (kidsLive) {
        p.state = "W"; ans = 0;
        step.text = `${who(p)} calls ${call}: no child has exited yet, so the parent waits for the child to exit (its state is S, sleeping in wait).`;
      } else { p.pc++; ans = 2; step.text = `${who(p)} calls ${call}: it has no children, so the call returns −1 at once.`; }
      step.ask = { q: `${who(p)} calls ${call}. What happens?`, opts: O.map((o, j) => ({ label: o, ok: j === ans, why: z ? `Its child ${z.pid} has already exited and is a zombie.` : kidsLive ? "Its child is still running." : "It has no child to wait for." })) };
    } else if (s.op === "sleep") {
      p.state = "S"; p.sleepAt = ++sleepSeq; p.pc++;
      step.text = `${who(p)} calls sleep(${s.n}): it is in state S (interruptible sleep), and the CPU runs another process.${say ? " " + say : ""}`;
      step.ask = { q: `Which ps state is ${who(p)} in during sleep(${s.n})?`, opts: ["R", "S", "D", "Z"].map((L) => ({ label: L, ok: L === "S", why: "S: interruptible sleep (waiting for an event to complete and can be killed)." })) };
    } else if (s.op === "exec") {
      p.image = s.prog;
      p.list = [...s.out.map((t) => ({ line: null, op: "print", text: t, ask: { q: "What appears next on the terminal?", options: [t, "Error"], answer: 0, why: "A successful execve does not return: the old program, with its printf, is gone." } })), { line: null, op: "exit", ret: true, prog: s.prog }];
      p.pc = 0;
      const after = S.find((x) => x.line > s.line && x.op !== "nop");
      step.text = `${who(p)} calls ${s.call}: the program that is currently being run by the calling process is replaced with a new program (${s.prog}), with newly initialized stack, heap, and data segments. Same pid ${p.pid}; the code after the call no longer exists in it.`;
      step.ask = { q: `Will ${who(p)} ever run line ${after ? after.line : s.line + 1}, the line after the call?`, opts: [{ label: `no: it now runs ${s.prog}`, ok: true }, { label: "yes, after the call returns", ok: false, why: "execve replaces the process's core image; on success it never returns." }] };
    } else if (s.op === "exit") {
      const fate = reapers(p);
      const r = exitProc(p, step);
      const how = s.ret ? (p.list === S ? "returns from main (return 0), which terminates it like exit(0)" : `(${s.prog}) finishes and exits`) : `calls exit(${s.code ?? 0}) and terminates`;
      let t = `${who(p)} ${how}.`;
      if (r.adopted.length) t += ` It exits before its child${r.adopted.length > 1 ? "ren" : ""} ${r.adopted.join(", ")}: ${r.adopted.length > 1 ? "they are orphans, adopted" : "the child is an orphan, adopted"} by init (pid 1).`;
      if (r.adoptedZ.length) t += ` Its zombie child ${r.adoptedZ.join(", ")} is adopted by init (pid 1), which reaps it, so the zombie disappears.`;
      if (fate === "shell") t += ` Its parent, the shell (${prog.ppid}), waits for it and reaps it.`;
      else if (fate === "init") t += " Its parent is init (pid 1), which reaps it at once.";
      else if (fate === "waiting") t += ` Its parent ${procs[p.parent].pid} is already waiting, so it is a zombie only until the parent's wait returns.`;
      else t += ` Its parent ${procs[p.parent].pid} has not called wait(), so it is a zombie (Z): terminated but not reaped by its parent.`;
      if (say) t += " " + say;
      step.text = t;
      const O = [["shell", `the shell (${prog.ppid}), its parent`], ["waiting", "its parent, already in wait()"], ["zombie", "nobody yet: it stays a zombie (Z)"], ["init", "init (pid 1), which adopted it"]];
      step.ask = { q: `${who(p)} terminates. Who reaps it?`, opts: O.map(([k, label]) => ({ label, ok: k === fate, why: fate === "zombie" ? "Its parent is alive and has not called wait()." : fate === "waiting" ? "Its parent is blocked in wait()." : fate === "init" ? "Its parent has exited, so init adopted it." : "The process was started by the shell, which waits for it." })) };
    } else if (s.op === "end") {
      step.text = `${who(p)}: ${say}`;
      step.ask = s.ask ? mkAsk(s.ask) : null;
      stop = true;
    }
    if (orderNoteDone === "pending") { step.text += " " + (prog.orderNote || "The order between parent and child is not guaranteed unless wait enforces it; this is the order the slide's run printed."); orderNoteDone = true; }
    step.text = pre + step.text;
    if (!step.ask) step.ask = { q: `Which process runs the next line?`, opts: live().map((x) => ({ label: `pid ${x.pid}`, ok: x === p, why: "" })) };
    steps.push(step);
    lastRunner = p.i;
    snapshot();
    if (stop) break;
    if (s && s.op === "fork" && prog.first === "child") cur = step.born;
    else if (p.gone || p.state !== "R") cur = pickNext(p.i);
    else if (prog.sched === "rr") { const nx = procs.find((x) => x.i > p.i && !x.gone && x.state === "R") || procs.find((x) => !x.gone && x.state === "R"); cur = nx ? nx.i : p.i; }
    if (cur < 0) break;
  }
  return { procs, steps, snaps };
  function mkAsk(a) { return { q: a.q, opts: a.options.map((o, j) => ({ label: o, ok: j === a.answer, why: a.why || "" })) }; }
}
/** Shuffles options deterministically (so the right answer is not always first) from a seed. */
function shuffleStable(arr, seed) {
  const a = arr.slice();
  let x = (seed * 9301 + 49297) % 233280;
  for (let i = a.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function forkLayout(procs) {
  // Leaf-order layout on the birth tree, fixed for the whole trace so boxes never jump.
  const kids = procs.map(() => []);
  for (const p of procs) if (p.parent >= 0) kids[p.parent].push(p.i);
  let leaf = 0;
  const xs = [];
  const walk = (i) => {
    if (!kids[i].length) { xs[i] = leaf++; return xs[i]; }
    const v = kids[i].map(walk);
    xs[i] = (v[0] + v[v.length - 1]) / 2;
    return xs[i];
  };
  walk(0);
  const slots = Math.max(1, leaf), W = 360;
  return procs.map((p) => ({ x: ((xs[p.i] + 0.5) / slots) * W, y: 40 + p.gen * 84 }));
}
function forkPlay(box, cfg) {
  let name = FORK_ALIASES[cfg.preset] || cfg.preset;
  const custom = cfg.program && Array.isArray(cfg.program.steps) && Array.isArray(cfg.program.code) ? { pid: 1000, ppid: 433, ...cfg.program } : null;
  if (!custom && !FORK_PROGRAMS[name]) name = "fork and print pids";
  let prog = custom || FORK_PROGRAMS[name], tr = null, layout = null, pb = null;
  box.append(el("h4", null, cfg.title || "fork(): step the program, watch the processes"));
  const presetSel = document.createElement("select");
  if (custom) { const o = el("option", null, custom.title || "this program"); o.value = "__custom"; presetSel.append(o); }
  for (const k of Object.keys(FORK_PROGRAMS)) { const o = el("option", null, k); o.value = k; if (!custom && k === name) o.selected = true; presetSel.append(o); }
  const prow = el("div", "unit-row");
  sty(presetSel, "max-width:100%");
  prow.append(el("label", null, "program"), presetSel);
  const { caption, ask } = playParts();
  const pk = predictKit(ask, "Predict each step before it runs", () => pb, () => frame(pb.pos()));
  pk.set(cfg.predict);
  const panes = sty(el("div"), "display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:10px;align-items:start;margin:8px 0");
  const codeBox = sty(el("div"), "background:var(--paper);border:1px solid var(--rule);border-radius:6px;font-family:var(--mono);font-size:12px;line-height:1.5;padding:6px 0;min-width:0");
  const right = sty(el("div"), "min-width:0");
  const svg = svgEl("svg", { viewBox: "0 0 360 200", class: "curve-svg net-svg", role: "img" });
  sty(svg, "margin:0;max-width:620px");
  const termBox = sty(el("div"), "background:#0f131b;border:1px solid var(--rule);border-radius:6px;font-family:var(--mono);font-size:12px;line-height:1.5;padding:6px 8px;min-height:3em;white-space:pre-wrap;word-break:break-word;color:var(--ink)");
  right.append(svg, sty(el("div", null, "terminal"), "font-size:11px;color:var(--ink-dim);margin:4px 0 2px"), termBox);
  panes.append(codeBox, right);
  const note = el("p", "widget-note");
  box.append(prow, pk.row, panes, caption, ask);
  const lineEls = [];
  function buildCode() {
    codeBox.innerHTML = ""; lineEls.length = 0;
    prog.code.forEach((t, k) => {
      const row = sty(el("div"), "display:flex;gap:6px;padding:0 8px 0 0;border-left:3px solid transparent");
      const no = sty(el("span", null, String(k + 1)), "width:2.2em;flex-shrink:0;text-align:right;color:var(--ink-dim);user-select:none");
      const marks = sty(el("span"), "display:flex;flex-wrap:wrap;gap:1px;flex-shrink:0;width:30px;align-content:flex-start");
      const tx = sty(el("span", null, t || " "), "white-space:pre-wrap;word-break:break-word;min-width:0;color:var(--ink-2)");
      row.append(no, marks, tx);
      codeBox.append(row);
      lineEls.push({ row, marks });
    });
  }
  function frame(pos) {
    const N = tr.steps.length, q = pk.asking(pos, N);
    const s = q ? pk.answered : Math.ceil(pos - 1e-9) - 1, u = q ? 1 : clamp(pos - s, 0, 1);
    const st = !q && s >= 0 ? tr.steps[s] : null;
    const snap = q ? tr.snaps[pk.answered] : s < 0 ? tr.snaps[0] : tr.snaps[s + 1];
    const qStep = q ? tr.steps[pk.answered] : null;
    // code pane
    lineEls.forEach(({ row, marks }) => { row.style.background = ""; row.style.borderLeftColor = "transparent"; marks.innerHTML = ""; });
    const hotStep = q ? qStep : st;
    if (hotStep) {
      const L = hotStep.lines ? hotStep.lines : hotStep.line != null ? [hotStep.line, hotStep.line] : null;
      if (L) for (let k = L[0]; k <= L[1]; k++) if (lineEls[k - 1]) { lineEls[k - 1].row.style.background = "var(--hl-soft)"; lineEls[k - 1].row.style.borderLeftColor = PCOL[hotStep.i % PCOL.length]; }
    }
    for (const p of snap.procs) {
      if (p.gone || p.line == null || !lineEls[p.line - 1]) continue;
      lineEls[p.line - 1].marks.append(sty(el("span", null, String(p.pid)), `font-size:9.5px;padding:0 3px;border-radius:3px;background:${PCOL[p.i % PCOL.length]};color:#10141c;line-height:1.5`));
    }
    // tree
    svg.innerHTML = "";
    const rows = Math.max(...tr.procs.map((p) => p.gen)) + 1;
    svg.setAttribute("viewBox", `0 0 360 ${40 + rows * 84 - 10}`);
    const pill = (x, label, on) => {
      svg.append(svgEl("rect", { x: x - 46, y: 4, width: 92, height: 18, rx: 9, fill: "var(--paper)", stroke: on ? "var(--ink-2)" : "var(--rule)", "stroke-dasharray": on ? "" : "3 3" }));
      svg.append(svgEl("text", { x, y: 17, "text-anchor": "middle", "font-size": 10, fill: on ? "var(--ink-2)" : "var(--ink-dim)" }, label));
    };
    const SHX = 70, INX = 290;
    pill(SHX, `${prog.shell || "bash"} (${prog.ppid})`, true);
    pill(INX, "init (pid 1)", snap.initUsed);
    const BW = 126, BH = 66;
    const posOf = (p) => {
      const L = layout[p.i];
      if (st && st.born === p.i && u < 1) { const par = layout[p.parent], t = smooth01(u); return { x: lerpN(par.x, L.x, t), y: lerpN(par.y, L.y, t) }; }
      return L;
    };
    const visible = snap.procs.filter((p) => !p.gone || (st && st.reaped.includes(p.i) && u < 1));
    for (const p of visible) {
      const P = posOf(p), op = st && st.reaped.includes(p.i) ? 1 - smooth01(u) : st && st.born === p.i ? smooth01(u) : 1;
      let from;
      if (p.ppid === 1) from = { x: INX, y: 22 };
      else if (p.parent === -1) from = { x: SHX, y: 22 };
      else { const par = posOf(snap.procs[p.parent]); from = { x: par.x, y: par.y + BH }; }
      svg.append(svgEl("line", { x1: from.x, y1: from.y, x2: P.x, y2: P.y, stroke: p.ppid === 1 ? "var(--purple)" : "var(--rule-strong)", "stroke-dasharray": p.ppid === 1 ? "4 3" : "", "stroke-width": 1.2, opacity: op }));
    }
    for (const p of visible) {
      const P = posOf(p), op = st && st.reaped.includes(p.i) ? 1 - smooth01(u) : st && st.born === p.i ? smooth01(u) : 1;
      const g = svgEl("g", { opacity: op });
      const runner = (q ? qStep.i : st ? st.i : 0) === p.i;
      const col = PCOL[p.i % PCOL.length];
      const zomb = p.state === "Z";
      g.append(svgEl("rect", { x: P.x - BW / 2, y: P.y, width: BW, height: BH, rx: 6, fill: runner ? "var(--hl-soft)" : "var(--paper)", stroke: zomb ? "var(--red)" : runner ? "var(--hl)" : col, "stroke-width": runner ? 2 : 1.3, "stroke-dasharray": zomb ? "4 3" : "" }));
      g.append(svgEl("rect", { x: P.x - BW / 2, y: P.y, width: 5, height: BH, fill: col }));
      const stName = { R: "R", S: "S", W: "S (wait)", Z: "Z zombie" }[p.state] || p.state;
      const lines = [[`pid ${p.pid} · ppid ${p.ppid}`, "var(--ink)", 600], [`${p.image} · ${stName}`, zomb ? "var(--red)" : "var(--ink-2)", 400]];
      if (p.forkRet != null) lines.push([`fork() → ${p.forkRet}`, "var(--ink-2)", 400]);
      const vs = Object.entries(p.vars).filter(([k]) => k !== "ret").map(([k, v]) => `${k}=${v}`).join(" ");
      if (vs) lines.push([vs, "var(--blue)", 400]);
      lines.slice(0, 4).forEach(([t, c, w], k) => g.append(svgEl("text", { x: P.x - BW / 2 + 10, y: P.y + 14 + k * 14, "font-size": t.length > 18 ? 9 : 10, fill: c, "font-weight": w }, t.length > 20 ? t.slice(0, 19) + "…" : t)));
      svg.append(g);
    }
    // terminal
    termBox.innerHTML = "";
    termBox.append(sty(el("div", null, `~$ ${prog.cmd === undefined ? "./a.out" : prog.cmd || ""}`), prog.cmd === null ? "display:none" : "color:var(--ink-dim)"));
    snap.term.forEach((t, k) => {
      let text = t.text;
      if (st && st.printed && k === snap.term.length - 1 && u < 1) {
        const prev = tr.snaps[s].term[k];
        const base = prev ? prev.text : "";
        text = base + text.slice(base.length, base.length + Math.ceil((text.length - base.length) * Math.min(1, u * 1.4)));
      }
      const d = sty(el("div"), "display:flex;justify-content:space-between;gap:8px");
      d.append(sty(el("span", null, text), `color:${PCOL[t.i % PCOL.length]}`), sty(el("span", null, String(tr.procs[t.i].pid)), "color:var(--ink-dim);font-size:10px;flex-shrink:0"));
      termBox.append(d);
    });
    let text;
    if (q) text = `Step ${pk.answered + 1} of ${N}. ${qStep.ask.q}`;
    else if (s < 0) text = `One process, pid ${prog.pid}, is about to run the program. Press Play to step it; each process's next line is marked with its pid.`;
    else text = st.text + (s === N - 1 && u >= 1 - 1e-9 ? pk.tally() : "");
    setText(caption, text);
    if (q) pk.render(true, `fork|${presetSel.value}`, qStep.ask.opts.map((o) => ({ why: "", ...o })));
    else pk.render(false);
  }
  function restart() {
    tr = forkTrace(prog);
    layout = forkLayout(tr.procs);
    buildCode();
    note.textContent = `${prog.source || ""} ${prog.orderNote || "The interleaving of parent and child is the slide's; on a real machine the order is not guaranteed unless wait enforces it."}`;
    pk.reset();
    pb.reset(tr.steps.length);
  }
  tr = forkTrace(prog); layout = forkLayout(tr.procs);
  pb = createPlayback({ count: tr.steps.length, unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 1200, limit: () => pk.limit(tr.steps.length), onBlocked: () => pk.nudge() });
  box.append(pb.el, note);
  presetSel.addEventListener("change", () => { prog = presetSel.value === "__custom" ? custom : FORK_PROGRAMS[presetSel.value]; restart(); });
  restart();
}

export const WIDGETS = {
  "process-states-play": processStatesPlay,
  "context-switch-play": contextSwitchPlay,
  "cpu-util": cpuUtil,
  "multiprog-play": multiprogPlay,
  "fork-play": forkPlay,
};
