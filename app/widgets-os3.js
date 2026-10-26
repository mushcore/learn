// COMP 4736 widgets, Part 4 (threads) and Part 5 (system calls):
//   syscall-steps-play — the 11 steps of read(fd, buffer, nbytes) on the slide 21 figure, on the playback bar.
//   thread-models      — user-level / kernel-level / hybrid threads (and the three mappings), with a blocking call.
//   file-links         — link("/usr/jim/memo", "/usr/ast/note"), hard and symbolic links, deleting the original.
import { el, btnRow } from "./dom.js";
import { createPlayback } from "./playback.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
let uid = 0;
/** An arrowhead marker in `color`, appended to the svg's defs; returns url(#id). */
function marker(defs, color) {
  const id = `os3m${++uid}`;
  const m = svgEl("marker", { id, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
  m.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: color }));
  defs.append(m);
  return `url(#${id})`;
}
function styled(tag, cls, text, style) {
  const e = el(tag, cls, text);
  if (style) Object.assign(e.style, style);
  return e;
}

// Predict helper (as in widgets-net3.js): holds the playback at each step until the right answer is picked.
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
    s.answered = Math.ceil(pb.pos() - 1e-9);
    pb.set(pb.pos());
  });
  return s;
}

// ---------- widget: syscall-steps-play ----------
// Slides 19-21 (Part 5): the 11 steps of read(fd, buffer, nbytes); the x86 convention from slide 11.
const SC_CAPTION = [
  "read(fd, buffer, nbytes): system calls are performed in a series of steps. Press Play to follow the 11 numbered arrows of the figure.",
  "Step 1 (steps 1, 2, and 3 push the parameters onto the stack in reverse order): Push nbytes, the last parameter, goes on first.",
  "Step 2: Push &buffer, the second parameter. Reverse order: nbytes, then &buffer, then fd.",
  "Step 3: Push fd, the first parameter, goes on last. The stack now holds nbytes, &buffer, fd.",
  "Step 4: calling to the library procedure read. This instruction is the normal procedure-call instruction used to call all procedures (it leaves the return address on the stack).",
  "Step 5: The library procedure, possibly written in assembly language, typically puts the system-call number in a place where the operating system expects it, such as a register: on x86 Linux, EAX = 3 (sys_read).",
  "Step 6: executing a TRAP instruction to switch from user mode to kernel mode and start execution at a fixed address within the kernel (on x86 Linux the trap is int 80h). The mode flag now reads KERNEL.",
  "Step 7: The kernel code that starts following the TRAP examines the system-call number (3) and then dispatches to the correct system-call handler, usually via a table of pointers to system-call handlers indexed on system-call number.",
  "Step 8: At that point the system-call handler runs: sys_read fills buffer and leaves its result, the number of bytes read, in EAX.",
  "Step 9: Once it has completed its work, control may be returned to the user-space library procedure at the instruction following the TRAP instruction. The mode flag is back to USER.",
  "Step 10: This procedure then returns to the user program in the usual way procedure calls return (the return address comes off the stack).",
  "Step 11: To finish the job, the user program has to clean up the stack, as it does after any procedure call: Increment SP past nbytes, &buffer and fd.",
];
const MODE_Q = (step, verb) => ({
  q: `Step ${step} ${verb}. User mode or kernel mode after this step?`,
});
// One question per step, asked before it is drawn (index = step − 1).
const SC_Q = [
  { q: "Steps 1 to 3 push the parameters of read(fd, buffer, nbytes). Which push comes first?", opts: [
    { label: "Push fd", ok: false, why: "Steps 1, 2, and 3 push the parameters onto the stack in reverse order, so the last parameter goes first." },
    { label: "Push nbytes", ok: true },
    { label: "Push &buffer", ok: false, why: "Reverse order: the last parameter, nbytes, is pushed first." }] },
  { q: "nbytes is on the stack. Which step is next?", opts: [
    { label: "Push &buffer", ok: true },
    { label: "Push fd", ok: false, why: "Reverse order: nbytes, then &buffer, then fd." },
    { label: "Call read", ok: false, why: "All three parameters are pushed (steps 1, 2, and 3) before the call." }] },
  { q: "nbytes and &buffer are on the stack. Which step is next?", opts: [
    { label: "Call read", ok: false, why: "fd is still missing: steps 1, 2, and 3 push all three parameters first." },
    { label: "TRAP to the kernel", ok: false, why: "The user program never traps itself; it pushes fd, then calls the library procedure." },
    { label: "Push fd", ok: true }] },
  { q: "All three parameters are on the stack. Which step is next?", opts: [
    { label: "TRAP to the kernel", ok: false, why: "Step 4 is calling the library procedure, with the normal procedure-call instruction; the library does the TRAP." },
    { label: "Call the library procedure read", ok: true },
    { label: "Put code for read in register", ok: false, why: "That is the library procedure's job (step 5); the user program first has to call it (step 4)." }] },
  { q: "We are inside the library procedure read. Which step is next?", opts: [
    { label: "Put the system-call number in a register", ok: true },
    { label: "TRAP to the kernel", ok: false, why: "The kernel must find out which call is wanted: the library first puts the system-call number where the operating system expects it, such as a register." },
    { label: "Return to caller", ok: false, why: "Nothing has been read yet; the library still has to put the number in a register and trap." }] },
  { ...MODE_Q(6, "executes the TRAP instruction"), opts: [
    { label: "User mode", ok: false, why: "Step 6: a TRAP instruction switches from user mode to kernel mode and starts execution at a fixed address within the kernel." },
    { label: "Kernel mode", ok: true }] },
  { q: "The kernel starts at the fixed address after the TRAP. Which step is next?", opts: [
    { label: "The handler runs straight away", ok: false, why: "The kernel first examines the system-call number and dispatches through the table of pointers (step 7)." },
    { label: "Examine the number and dispatch through the table", ok: true },
    { label: "Return to the library procedure", ok: false, why: "The work has not been done yet: dispatch (step 7) and the handler (step 8) come first." }] },
  { ...MODE_Q(8, "runs the system-call handler"), opts: [
    { label: "User mode", ok: false, why: "The handler is kernel code: we stay in kernel mode until control returns to the library procedure in step 9." },
    { label: "Kernel mode", ok: true }] },
  { ...MODE_Q(9, "returns control to the library procedure at the instruction following the TRAP"), opts: [
    { label: "Kernel mode", ok: false, why: "The library procedure is in user space: returning to it switches back to user mode." },
    { label: "User mode", ok: true }] },
  { q: "Control is back in the library procedure, after the TRAP. Which step is next?", opts: [
    { label: "Return to the user program", ok: true },
    { label: "Increment SP", ok: false, why: "The library procedure first returns to the user program (step 10); the user program then cleans up the stack (step 11)." },
    { label: "TRAP again", ok: false, why: "The call is finished: the procedure returns to the user program in the usual way procedure calls return." }] },
  { q: "The user program has the result. Who removes fd, &buffer and nbytes from the stack?", opts: [
    { label: "The kernel", ok: false, why: "To finish the job, the user program has to clean up the stack, as it does after any procedure call." },
    { label: "The library procedure", ok: false, why: "The user program pushed them, and it cleans them up (Increment SP), as after any procedure call." },
    { label: "The user program (Increment SP)", ok: true }] },
];

function syscallStepsPlay(box, cfg) {
  const N = 11;
  let pb = null;
  box.append(el("h4", null, cfg.title || "The 11 steps of read(fd, buffer, nbytes)"));
  const ask = el("div", "viz-btn-row playback-ask");
  const pk = predictKit(ask, "Predict each step before it happens", () => pb, () => frame(pb.pos()));
  pk.set(!!cfg.predict);
  const wrap = styled("div", null, null, { display: "flex", flexWrap: "wrap", gap: "10px 16px", alignItems: "flex-start" });
  const svg = svgEl("svg", { viewBox: "0 0 380 340", class: "curve-svg net-svg", role: "img", "aria-label": "The 11 steps in making the system call read(fd, buffer, nbytes)" });
  svg.style.flex = "1 1 300px"; svg.style.maxWidth = "460px"; svg.style.margin = "0";
  const side = styled("div", null, null, { flex: "1 1 150px", minWidth: "150px", fontSize: "13px" });
  wrap.append(svg, side);
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  box.append(pk.row, wrap, caption, ask);

  // Static parts of the figure; the dynamic layer is redrawn per frame.
  const defs = svgEl("defs");
  svg.append(defs);
  const mkHot = marker(defs, "var(--hl)"), mkDim = marker(defs, "var(--ink-dim)");
  const layer = svgEl("g");
  // Rows: [key, label, x, y]; boxes are 190 wide, 20 high.
  const BX = 130, BW = 190, RH = 20;
  const ROWS = {
    ret: ["Return to caller", 40], trap: ["Trap to the kernel", 60], put: ["Put code for read in register", 80],
    inc: ["Increment SP", 150], call: ["Call read", 170], pfd: ["Push fd", 190], pbuf: ["Push &buffer", 210], pn: ["Push nbytes", 230],
  };
  // Where each step happens (row, or a kernel box) and its arrow.
  const STEP = [
    null,
    { at: "pn", num: [118, 244] }, { at: "pbuf", num: [118, 224] }, { at: "pfd", num: [118, 204] },
    { at: "put", path: "M130,180 C 92,172 92,100 128,90", num: [100, 140] },
    { at: "put", num: [118, 94] },
    { at: "disp", path: "M130,70 C 60,78 40,190 62,276", num: [44, 190] },
    { at: "table", path: "M110,292 L 150,292", num: [130, 284] },
    { at: "handler", path: "M218,292 L 256,292", num: [237, 284] },
    { at: "ret", path: "M300,276 C 372,230 372,70 322,50", num: [358, 190] },
    { at: "inc", path: "M320,50 C 346,72 344,140 322,160", num: [346, 112] },
    { at: "inc", num: [306, 164] },
  ];
  function txt(x, y, s, attrs = {}) { return svgEl("text", { x, y, "font-size": 11, fill: "var(--ink)", ...attrs }, s); }
  function drawStatic() {
    svg.append(svgEl("rect", { x: 22, y: 8, width: 350, height: 254, fill: "none", stroke: "var(--rule-strong)" }));
    svg.append(svgEl("rect", { x: 22, y: 262, width: 350, height: 62, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    svg.append(txt(26, 20, "Address 0xFFFFFFFF", { "font-size": 9, fill: "var(--ink-dim)" }));
    svg.append(txt(26, 336, "0", { "font-size": 9, fill: "var(--ink-dim)" }));
    svg.append(txt(14, 135, "User space", { "font-size": 10, fill: "var(--ink-dim)", transform: "rotate(-90 14 135)", "text-anchor": "middle" }));
    svg.append(txt(14, 293, "Kernel", { "font-size": 10, fill: "var(--ink-dim)", transform: "rotate(-90 14 293)", "text-anchor": "middle" }));
    svg.append(txt(BX, 34, "Library procedure read", { "font-size": 10, fill: "var(--ink-dim)" }));
    svg.append(txt(BX, 144, "User program calling read", { "font-size": 10, fill: "var(--ink-dim)" }));
    svg.append(layer);
  }
  drawStatic();
  // The dispatch table: slide 11's x86 numbers, indexed on system-call number.
  const TABLE = ["1 exit", "2 fork", "3 read", "4 write", "5 open", "6 close"];

  function state(d) {
    const stack = [];
    if (d >= 1) stack.push(["nbytes", d >= 11]);
    if (d >= 2) stack.push(["&buffer", d >= 11]);
    if (d >= 3) stack.push(["fd", d >= 11]);
    if (d >= 4 && d < 10) stack.push(["return address", false]);
    if (d >= 10) stack.push(["return address", true]);
    const kernel = d >= 6 && d <= 8;
    const eax = d < 5 ? "—" : d < 8 ? "3 (sys_read)" : "bytes read";
    const where = d === 0 || d <= 3 || d >= 10 ? "user program" : d <= 5 || d === 9 ? "library procedure read" : d === 6 ? "kernel, fixed address" : d === 7 ? "kernel, dispatch" : "kernel, sys call handler";
    return { stack, kernel, eax, where };
  }

  function frame(pos) {
    const q = pk.asking(pos, N);
    const done = Math.floor(pos + 1e-9);
    const cur = q ? 0 : Math.ceil(pos - 1e-9); // step being drawn (or just finished)
    const frac = cur > 0 ? clamp(pos - (cur - 1), 0, 1) : 0;
    const st = state(done);
    layer.innerHTML = "";
    const hotAt = cur > 0 ? STEP[cur].at : null;
    // Code rows.
    for (const [key, [label, y]] of Object.entries(ROWS)) {
      const lit = key === hotAt;
      layer.append(svgEl("rect", { x: BX, y, width: BW, height: RH, fill: lit ? "var(--hl-soft)" : "var(--paper-2)", stroke: lit ? "var(--hl)" : "var(--rule-strong)" }));
      layer.append(txt(BX + 8, y + 14, label, { fill: lit ? "var(--hl)" : "var(--ink)" }));
    }
    // Kernel boxes: Dispatch, the table of pointers, Sys call handler.
    const box3 = (x, w, label, key) => {
      const lit = key === hotAt;
      layer.append(svgEl("rect", { x, y: 276, width: w, height: 34, rx: 3, fill: lit ? "var(--hl-soft)" : "var(--paper-2)", stroke: lit ? "var(--hl)" : "var(--rule-strong)" }));
      label.forEach((s, i) => layer.append(txt(x + w / 2, 290 + i * 12 - (label.length - 1) * 5, s, { "text-anchor": "middle", fill: lit ? "var(--hl)" : "var(--ink)", "font-size": 10.5 })));
    };
    box3(40, 70, ["Dispatch"], "disp");
    box3(256, 76, ["Sys call", "handler"], "handler");
    const tLit = hotAt === "table";
    TABLE.forEach((s, i) => {
      const sel = i === 2 && done >= 7;
      layer.append(svgEl("rect", { x: 150, y: 268 + i * 9, width: 68, height: 9, fill: sel ? "var(--hl-soft)" : "var(--paper-2)", stroke: tLit ? "var(--hl)" : "var(--rule-strong)", "stroke-width": 0.8 }));
      layer.append(txt(184, 275.5 + i * 9, s, { "font-size": 8, "text-anchor": "middle", fill: sel ? "var(--hl)" : "var(--ink-dim)" }));
    });
    // Arrows and numbers: finished ones dim, the current one lit and drawn up to `frac`.
    for (let k = 1; k <= N; k++) {
      const s = STEP[k];
      if (k > cur) continue;
      const hot = k === cur;
      if (s.path) {
        const p = svgEl("path", { d: s.path, fill: "none", stroke: hot ? "var(--hl)" : "var(--ink-dim)", "stroke-width": hot ? 2.2 : 1.3, pathLength: 1 });
        if (hot && frac < 1) { p.setAttribute("stroke-dasharray", "1 1"); p.setAttribute("stroke-dashoffset", String(1 - frac)); }
        else p.setAttribute("marker-end", hot ? mkHot : mkDim);
        layer.append(p);
      }
      const [nx, ny] = s.num;
      layer.append(svgEl("circle", { cx: nx, cy: ny - 4, r: 7.5, fill: hot ? "var(--hl)" : "var(--paper-3)", stroke: hot ? "var(--hl)" : "var(--rule-strong)" }));
      layer.append(txt(nx, ny, String(k), { "text-anchor": "middle", "font-size": 10, fill: hot ? "var(--hl-ink)" : "var(--ink-2)", "font-weight": 700 }));
    }
    // Mode line between user and kernel space.
    layer.append(txt(368, 258, st.kernel ? "mode: KERNEL" : "mode: USER", { "text-anchor": "end", "font-size": 10, "font-weight": 700, fill: st.kernel ? "var(--hl)" : "var(--blue)" }));
    drawSide(st, done);
    let text;
    if (q) text = SC_Q[pk.answered].q;
    else if (cur === 0) text = SC_CAPTION[0];
    else {
      text = SC_CAPTION[cur];
      if (pos >= N - 1e-9) text += ` The call is complete: 11 steps, two mode switches (6 and 9).${pk.tally()}`;
    }
    if (caption.textContent !== text) caption.textContent = text;
    pk.render(q, "sc", q ? SC_Q[pk.answered].opts : []);
  }

  function drawSide(st, done) {
    side.innerHTML = "";
    const mode = styled("div", null, st.kernel ? "KERNEL MODE" : "USER MODE", {
      fontFamily: "var(--mono)", fontWeight: "700", padding: "4px 8px", borderRadius: "6px", textAlign: "center", marginBottom: "8px",
      border: `1px solid ${st.kernel ? "var(--hl)" : "var(--blue)"}`, color: st.kernel ? "var(--hl)" : "var(--blue)", background: st.kernel ? "var(--hl-soft)" : "var(--blue-soft)",
    });
    side.append(mode);
    side.append(styled("div", null, `running: ${st.where}`, { color: "var(--ink-2)", marginBottom: "8px" }));
    side.append(styled("div", "stat-label", "EAX (system-call number, then result)"));
    side.append(styled("div", null, st.eax, { fontFamily: "var(--mono)", color: st.eax === "—" ? "var(--ink-dim)" : "var(--ink)", marginBottom: "10px" }));
    side.append(styled("div", "stat-label", "User stack (grows down)"));
    const stk = styled("div", null, null, { display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px", fontFamily: "var(--mono)" });
    const live = st.stack.filter(([, gone]) => !gone);
    if (!st.stack.length) stk.append(styled("div", null, "(empty)", { color: "var(--ink-dim)" }));
    st.stack.forEach(([name, gone], i) => {
      const top = !gone && live.length && name === live[live.length - 1][0];
      const c = styled("div", null, null, {
        display: "flex", justifyContent: "space-between", gap: "6px", padding: "3px 8px", borderRadius: "4px",
        border: `1px solid ${top ? "var(--hl)" : "var(--rule-strong)"}`, background: top ? "var(--hl-soft)" : "var(--paper)",
        color: gone ? "var(--ink-dim)" : "var(--ink)", textDecoration: gone ? "line-through" : "none", opacity: gone ? "0.6" : "1",
      });
      c.append(el("span", null, name), el("span", null, top ? "← SP" : ""));
      stk.append(c);
    });
    side.append(stk);
    if (done >= 11) side.append(styled("div", "widget-note", "SP incremented: the 3 parameters are off the stack.", { marginTop: "6px" }));
  }

  pb = createPlayback({
    count: N, unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 1300,
    limit: () => pk.limit(N), onBlocked: () => pk.nudge(),
  });
  box.append(pb.el, el("p", "widget-note", "On x86 Linux (slide 11): system-call number in EAX, arguments in EBX, ECX, EDX, int 80h to call the kernel, result in EAX."));
  frame(0);
}

// ---------- widget: thread-models ----------
// Slides 25-42 (Part 4): threads in user space, in the kernel, and hybrid (many-to-one, one-to-one, many-to-many).
const TM_MODELS = ["user", "kernel", "hybrid"];
const TM_MAPS = ["many-to-one", "one-to-one", "many-to-many"];
const TM_INFO = {
  user: {
    title: "Implementing threads in user space: a user-level threads package",
    about: "The threads package is put entirely in user space. The kernel knows nothing about them: as far as the kernel is concerned, it is managing ordinary, single-threaded processes. Each process has its own run-time system and its own private thread table.",
    block: "Letting the thread actually make the blocking system call is unacceptable, since this will stop all the threads: the kernel blocks the whole process, and every other thread in it waits too.",
    pros: ["No trap is needed, no context switch is needed, the memory cache need not be flushed: this makes thread scheduling very fast.", "Each process can have its own customized scheduling algorithm.", "They scale better (kernel threads need table space and stack space in the kernel).", "Can be implemented on an operating system that does not support threads (a library).", "Faster to create and manage; generic, runs on any operating system."],
    cons: ["Blocking system calls: one thread reading from the keyboard will stop all the threads.", "No clock interrupts within a process: a thread runs until it voluntarily gives up the CPU.", "Multi-threaded applications cannot take advantage of multiprocessing."],
  },
  kernel: {
    title: "Implementing threads in the kernel: a threads package managed by the kernel",
    about: "No run-time system and no thread table in each process. The kernel has a thread table that keeps track of all the threads in the system, and also maintains the traditional process table.",
    block: "When a thread blocks, the kernel, at its option, can run either another thread from the same process (if one is ready) or a thread from a different process.",
    pros: ["Do not require any new, nonblocking system calls.", "On a page fault the kernel can run another runnable thread of the same process while the page is brought in.", "Kernel routines themselves can be multithreaded."],
    cons: ["The cost of a system call is substantial: if thread operations (creation, termination, etc.) are common, much more overhead.", "Slower to create and manage.", "Specific to the operating system."],
  },
};
const TM_MAP_INFO = {
  "many-to-one": {
    about: "Many to one: multiple user threads are mapped onto a single kernel thread. All user threads within a process share the same kernel thread; managed by the user-level thread library, and the kernel remains unaware of individual user threads.",
    block: "All user threads share the one kernel thread, so when it blocks in the system call they all stop, as with user-level threads (this follows from slide 38: all threads are bound to a single kernel thread).",
    pros: ["Easy thread creation and management."], cons: ["Lack of true concurrency, since all threads are bound to a single kernel thread."],
  },
  "one-to-one": {
    about: "One to one: each user thread is mapped onto a separate kernel thread; each user thread has a dedicated kernel thread for execution.",
    block: "Only the blocked thread's own kernel thread waits; the others can be scheduled independently by the kernel and keep running (this follows from slide 40).",
    pros: ["Provides true concurrency, as each user thread can be scheduled independently by the kernel."], cons: ["Creating and managing many kernel threads can introduce overhead."],
  },
  "many-to-many": {
    about: "Many to many: combines aspects of the previous two models. Multiple user threads are mapped onto an equal or smaller number of kernel threads; the user-level thread library and the kernel work together to schedule them.",
    block: "One kernel thread waits in the system call; the other kernel threads keep running the remaining user threads (this follows from slide 42).",
    pros: ["A balance between concurrency and thread creation overhead.", "Hybrid: the ultimate in flexibility (the programmer decides how many kernel threads, and how many user threads on each)."], cons: ["The library and the kernel must work together to schedule threads."],
  },
};

function wavy(x, y0, y1) {
  let d = `M${x},${y0}`;
  for (let y = y0, s = 1; y < y1; y += 8, s = -s) d += ` q ${4 * s},4 0,8`;
  return d;
}
function threadModels(box, cfg) {
  let model = TM_MODELS.includes(cfg.model) ? cfg.model : "user";
  let mapping = TM_MAPS.includes(cfg.mapping) ? cfg.mapping : "many-to-one";
  let blocked = false;
  box.append(el("h4", null, cfg.title || "Where do the threads live?"));
  box.append(btnRow(["user-level", "kernel-level", "hybrid"], (i) => { model = TM_MODELS[i]; blocked = false; draw(); }, TM_MODELS.indexOf(model)));
  const mapRow = btnRow(TM_MAPS, (i) => { mapping = TM_MAPS[i]; blocked = false; draw(); }, TM_MAPS.indexOf(mapping));
  const head = el("p", "widget-note");
  const svg = svgEl("svg", { viewBox: "0 0 360 210", class: "curve-svg net-svg", role: "img" });
  const blockBtn = el("button", "viz-btn", "One thread makes a blocking system call");
  blockBtn.type = "button";
  blockBtn.addEventListener("click", () => { blocked = !blocked; draw(); });
  const result = el("p", "playback-caption");
  result.setAttribute("aria-live", "polite");
  const pc = styled("div", null, null, { display: "flex", flexWrap: "wrap", gap: "8px 16px", fontSize: "13.5px" });
  box.append(mapRow, head, svg, blockBtn, result, pc);

  const T = (x, y, s, a = {}) => svgEl("text", { x, y, "font-size": 10, fill: "var(--ink-2)", ...a }, s);
  const C_RUN = "var(--blue)", C_BLOCK = "var(--red)", C_STOP = "var(--ink-dim)";
  function spaces(g) {
    g.append(svgEl("rect", { x: 4, y: 4, width: 352, height: 142, fill: "none", stroke: "var(--rule-strong)" }));
    g.append(svgEl("rect", { x: 4, y: 146, width: 352, height: 60, fill: "var(--paper-3)", stroke: "var(--rule-strong)" }));
    g.append(T(10, 16, "User space", { fill: "var(--ink-dim)" }));
    g.append(T(10, 160, "Kernel space", { fill: "var(--ink-dim)" }));
  }
  function table(g, x, y, rows, w, label, hot) {
    for (let i = 0; i < rows; i++) g.append(svgEl("rect", { x, y: y + i * 6, width: w, height: 6, fill: hot ? "var(--hl-soft)" : "var(--paper-2)", stroke: hot ? "var(--hl)" : "var(--ink-dim)", "stroke-width": 0.8 }));
    if (label) g.append(T(x + w / 2, y + rows * 6 + 10, label, { "text-anchor": "middle", "font-size": 8.5 }));
  }
  function drawProcesses(g) {
    spaces(g);
    const procs = [[100, 3], [255, 4]];
    procs.forEach(([cx, n], p) => {
      g.append(svgEl("circle", { cx, cy: 78, r: 58, fill: "none", stroke: "var(--ink-2)", "stroke-width": 1.3 }));
      for (let i = 0; i < n; i++) {
        const x = cx - (n - 1) * 9 + i * 18;
        let color = C_RUN;
        if (blocked && p === 0) color = i === 0 ? C_BLOCK : model === "user" ? C_STOP : C_RUN;
        g.append(svgEl("path", { d: wavy(x, 34, model === "user" ? 98 : 112), fill: "none", stroke: color, "stroke-width": 2 }));
      }
      if (model === "user") {
        g.append(svgEl("rect", { x: cx - 44, y: 104, width: 88, height: 16, rx: 2, fill: "var(--paper-2)", stroke: "var(--ink-2)" }));
        g.append(T(cx - 40, 115.5, "run-time system", { "font-size": 8.5 }));
        table(g, cx + 26, 106, 2, 16, null, false);
      }
    });
    g.append(T(100, 30, "Process", { "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }));
    if (model === "user") g.append(T(180, 140, "thread table (per process) in the run-time system", { "text-anchor": "middle", "font-size": 8.5, fill: "var(--ink-dim)" }));
    g.append(T(40, 186, "Kernel", { "font-size": 11, fill: "var(--ink)" }));
    table(g, 120, 168, 2, 50, "Process table", blocked && model === "user");
    if (model === "kernel") table(g, 230, 158, 6, 60, "Thread table", false);
    if (blocked) g.append(T(60, 124, model === "user" ? "blocked: whole process" : "blocked thread", { "font-size": 9, fill: C_BLOCK, "text-anchor": "middle" }));
  }
  function drawMapping(g) {
    spaces(g);
    const tx = [70, 140, 220, 290], ky = 182, ty = 50, dot = [180, 112];
    const kx = mapping === "many-to-one" ? [180] : [70, 140, 220, 290];
    // Which user / kernel threads run, given one blocked call from t1.
    const kState = kx.map((_, i) => (blocked && i === 0 ? "block" : "run"));
    const tState = tx.map((_, i) => {
      if (!blocked) return "run";
      if (i === 0) return "block";
      return mapping === "many-to-one" ? "stop" : "run";
    });
    const col = (s) => (s === "block" ? C_BLOCK : s === "stop" ? C_STOP : C_RUN);
    if (mapping === "one-to-one") tx.forEach((x, i) => g.append(svgEl("line", { x1: x, y1: ty + 12, x2: kx[i], y2: ky - 12, stroke: col(tState[i]), "stroke-width": 1.6 })));
    else {
      tx.forEach((x, i) => g.append(svgEl("line", { x1: x, y1: ty + 12, x2: dot[0], y2: dot[1], stroke: col(tState[i]), "stroke-width": 1.6 })));
      g.append(svgEl("circle", { cx: dot[0], cy: dot[1], r: 3.5, fill: "var(--ink)" }));
      kx.forEach((x, i) => g.append(svgEl("line", { x1: dot[0], y1: dot[1], x2: x, y2: ky - 12, stroke: col(kState[i]), "stroke-width": 1.6 })));
    }
    tx.forEach((x, i) => {
      g.append(svgEl("circle", { cx: x, cy: ty, r: 12, fill: "var(--paper-2)", stroke: col(tState[i]), "stroke-width": 2 }));
      g.append(T(x, ty + 4, "t", { "text-anchor": "middle", "font-size": 12, fill: "var(--ink)" }));
    });
    g.append(T(180, ty + 4, "…", { "text-anchor": "middle", "font-size": 14, fill: "var(--ink-dim)" }));
    kx.forEach((x, i) => {
      g.append(svgEl("circle", { cx: x, cy: ky, r: 12, fill: "var(--paper-2)", stroke: col(kState[i]), "stroke-width": 2 }));
      g.append(T(x, ky + 4, "k", { "text-anchor": "middle", "font-size": 12, fill: "var(--ink)" }));
    });
    if (kx.length > 1) g.append(T(180, ky + 4, "…", { "text-anchor": "middle", "font-size": 14, fill: "var(--ink-dim)" }));
    g.append(T(350, 30, `${mapping.replace(/-/g, " ")} relationship`, { "text-anchor": "end", "font-size": 10, fill: "var(--ink)" }));
    if (blocked) g.append(T(70, 28, "blocked", { "text-anchor": "middle", "font-size": 9, fill: C_BLOCK }));
  }
  function list(title, items) {
    const d = styled("div", null, null, { flex: "1 1 220px" });
    d.append(el("div", "stat-label", title));
    const ul = styled("ul", null, null, { margin: "4px 0 0", paddingLeft: "18px", color: "var(--ink-2)" });
    for (const s of items) ul.append(el("li", null, s));
    d.append(ul);
    return d;
  }
  function draw() {
    mapRow.hidden = model !== "hybrid";
    mapRow.style.display = model === "hybrid" ? "" : "none";
    const info = model === "hybrid" ? TM_MAP_INFO[mapping] : TM_INFO[model];
    head.textContent = model === "hybrid"
      ? "Hybrid implementations: use kernel-level threads and multiplex user-level threads onto some or all of them. The kernel is aware of only the kernel-level threads and schedules those. " + info.about
      : info.about;
    svg.innerHTML = "";
    const g = svgEl("g");
    svg.append(g);
    if (model === "hybrid") drawMapping(g); else drawProcesses(g);
    svg.setAttribute("aria-label", model === "hybrid" ? `${mapping} relationship` : TM_INFO[model].title);
    blockBtn.textContent = blocked ? "Undo: the call returns" : "One thread makes a blocking system call";
    result.textContent = blocked ? info.block : "Press the button: one thread reads from the keyboard before any keys have been hit.";
    pc.innerHTML = "";
    pc.append(list("Advantages", info.pros), list("Disadvantages", info.cons));
  }
  draw();
}

// ---------- widget: file-links ----------
// Slide 42 (link("/usr/jim/memo", "/usr/ast/note")) and slides 43-46 (my_file, my_file_h_link, my_file_s_link).
const FL_SCENES = {
  slide: {
    orig: "/usr/jim/memo", hard: "/usr/ast/note", sym: "/usr/ast/memo_s",
    cmdHard: 'link("/usr/jim/memo", "/usr/ast/note");', cmdSym: 'symlink("/usr/jim/memo", "/usr/ast/memo_s");', cmdDel: 'unlink("/usr/jim/memo");',
    ino: "70", symIno: "92",
  },
  lab: {
    orig: "my_file", hard: "my_file_h_link", sym: "my_file_s_link",
    cmdHard: "ln my_file my_file_h_link", cmdSym: "ln -s my_file my_file_s_link", cmdDel: "rm my_file",
    ino: "20829148276976248", symIno: "6192449488013181",
  },
};
function fileLinks(box, cfg) {
  const scene = cfg.scene === "lab" ? "lab" : "slide";
  const S = FL_SCENES[scene];
  let hard = false, sym = false, deleted = false, last = null;
  box.append(el("h4", null, cfg.title || (scene === "lab" ? "Hard link, symbolic link, deleting" : 'link("/usr/jim/memo", "/usr/ast/note")')));
  const row = el("div", "viz-btn-row");
  const mk = (label, fn) => { const b = el("button", "viz-btn", label); b.type = "button"; b.addEventListener("click", fn); row.append(b); return b; };
  const bHard = mk("hard link", () => { hard = true; last = "hard"; draw(); });
  const bSym = mk("symbolic link", () => { sym = true; last = "sym"; draw(); });
  const bDel = mk("delete original", () => { deleted = true; last = "del"; draw(); });
  mk("reset", () => { hard = sym = deleted = false; last = null; draw(); });
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const view = el("div");
  const svg = svgEl("svg", { viewBox: "0 0 360 150", class: "curve-svg net-svg", role: "img", "aria-label": "Names pointing at the file's data" });
  const term = el("div", "pv-out");
  box.append(row, caption, view, svg, term);
  const defs = svgEl("defs");
  const mkData = marker(defs, "var(--blue)"), mkSym = marker(defs, "var(--purple)"), mkErr = marker(defs, "var(--red)");

  const count = () => 1 + (hard ? 1 : 0) - (deleted ? 1 : 0);
  function dirTable(title, entries) {
    const t = el("table", "stl-table");
    t.style.width = "auto"; t.style.minWidth = "130px";
    const cap = el("caption", null, title);
    Object.assign(cap.style, { fontFamily: "var(--mono)", fontSize: "12.5px", color: "var(--ink-2)", textAlign: "left", paddingBottom: "3px" });
    t.append(cap);
    for (const [ino, name, mark] of entries) {
      const tr = el("tr");
      const a = el("td", "c", ino), b = el("td", null, name);
      [a, b].forEach((c) => { c.style.fontFamily = "var(--mono)"; });
      if (mark === "new") tr.className = "sel";
      if (mark === "gone") tr.className = "stl-off";
      tr.append(a, b);
      t.append(tr);
    }
    return t;
  }
  function drawSlide() {
    const ast = [["16", "mail"], ["81", "games"], ["40", "test"]];
    if (hard) ast.push(["70", "note", last === "hard" ? "new" : ""]);
    if (sym) ast.push([S.symIno + "*", "memo_s", last === "sym" ? "new" : ""]);
    const jim = [["31", "bin"], ["70", "memo", deleted ? "gone" : ""], ["59", "f.c."], ["38", "prog1"]];
    const wrap = styled("div", null, null, { display: "flex", flexWrap: "wrap", gap: "10px 24px", margin: "6px 0" });
    wrap.append(dirTable("/usr/ast", ast), dirTable("/usr/jim", jim));
    view.append(wrap);
    const inodes = [`i-node 70: regular file, link count ${count()}${count() === 0 ? " (freed)" : ""}`];
    if (sym) inodes.push(`i-node ${S.symIno}*: symbolic link, contents "/usr/jim/memo" (13 bytes), link count 1`);
    view.append(el("p", "widget-note", inodes.join(" · ") + (sym ? " (* the slide has no symbolic link; this i-number is made up)" : "")));
  }
  function stat(name) {
    if (name === S.sym) return [`  File: ${S.sym} -> ${S.orig}`, "  Size: 7           Blocks: 0     symbolic link", ` Inode: ${S.symIno}  Links: 1`, "Access: (0777/lrwxrwxrwx)"].join("\n");
    return [`  File: ${name}`, "  Size: 29          Blocks: 1     regular file", ` Inode: ${S.ino}  Links: ${count()}`, "Access: (0644/-rw-r--r--)"].join("\n");
  }
  function drawLab() {
    const names = [];
    if (!deleted) names.push(S.orig);
    if (hard) names.push(S.hard);
    if (sym) names.push(S.sym);
    const tree = [".", ...names.map((n, i) => `${i === names.length - 1 ? "└──" : "├──"} ${n}${n === S.sym ? " -> " + S.orig : ""}`), "", `0 directories, ${names.length} file${names.length === 1 ? "" : "s"}`];
    const pre = el("div", "pv-out", tree.join("\n"));
    view.append(pre);
  }
  function drawSvg() {
    svg.innerHTML = "";
    svg.append(defs);
    // The file's data on disk (one i-node) at the left; the names at the right.
    svg.append(svgEl("ellipse", { cx: 60, cy: 40, rx: 44, ry: 10, fill: "var(--paper-3)", stroke: "var(--ink-2)" }));
    svg.append(svgEl("path", { d: "M16,40 L16,100 A44,10 0 0 0 104,100 L104,40", fill: "var(--paper-3)", stroke: "var(--ink-2)" }));
    svg.append(svgEl("text", { x: 60, y: 76, "text-anchor": "middle", "font-size": 10, fill: "var(--ink)" }, scene === "lab" ? "data, 29 bytes" : "i-node 70"));
    svg.append(svgEl("text", { x: 60, y: 90, "text-anchor": "middle", "font-size": 9, fill: "var(--ink-dim)" }, `links: ${count()}`));
    const short = (n) => n.split("/").pop();
    const rows = [[S.orig, 22, "orig"], [S.hard, 66, "hard"], [S.sym, 110, "sym"]];
    for (const [name, y, kind] of rows) {
      const exists = kind === "orig" ? true : kind === "hard" ? hard : sym;
      if (!exists) continue;
      const gone = kind === "orig" && deleted;
      svg.append(svgEl("rect", { x: 186, y, width: 150, height: 24, rx: 4, fill: gone ? "var(--paper-3)" : "var(--paper-2)", stroke: kind === "sym" ? "var(--purple)" : "var(--blue)", "stroke-dasharray": gone ? "4 3" : "none", opacity: gone ? 0.6 : 1 }));
      const t = svgEl("text", { x: 261, y: y + 16, "text-anchor": "middle", "font-size": 11, fill: gone ? "var(--ink-dim)" : "var(--ink)", "text-decoration": gone ? "line-through" : "none" }, short(name));
      svg.append(t);
      if (kind !== "sym") svg.append(svgEl("path", { d: `M186,${y + 12} L108,${clamp(y + 12, 45, 100)}`, stroke: "var(--blue)", "stroke-width": 1.8, fill: "none", "stroke-dasharray": gone ? "3 4" : "none", opacity: gone ? 0.5 : 1, "marker-end": gone ? "" : mkData }));
      else if (!deleted) svg.append(svgEl("path", { d: `M336,${y + 12} C 358,${y} 358,40 338,34`, stroke: "var(--purple)", "stroke-width": 1.8, fill: "none", "marker-end": mkSym }));
      else {
        svg.append(svgEl("path", { d: `M336,${y + 12} C 358,${y} 358,40 338,34`, stroke: "var(--purple)", "stroke-width": 1.4, fill: "none", "stroke-dasharray": "4 3", "marker-end": mkSym }));
        svg.append(svgEl("path", { d: `M186,${y + 12} L150,${y + 22}`, stroke: "var(--red)", "stroke-width": 1.4, "stroke-dasharray": "4 3", fill: "none", "marker-end": mkErr }));
        svg.append(svgEl("text", { x: 146, y: y + 36, "text-anchor": "end", "font-size": 9.5, fill: "var(--red)" }, "No such file or directory"));
      }
    }
  }
  function draw() {
    bHard.disabled = hard || deleted;
    bSym.disabled = sym;
    bDel.disabled = deleted;
    view.innerHTML = "";
    if (scene === "slide") drawSlide(); else drawLab();
    drawSvg();
    // Terminal: the commands run so far, the stat lines (as on slides 43-46) and what reading each name gives.
    const lines = [];
    const cmds = [];
    if (hard) cmds.push(S.cmdHard);
    if (sym) cmds.push(S.cmdSym);
    if (deleted) cmds.push(S.cmdDel);
    if (cmds.length) lines.push(...cmds.map((c) => (scene === "lab" ? `OS:>> ${c}` : c)), "");
    const names = [];
    if (!deleted) names.push(S.orig);
    if (hard) names.push(S.hard);
    if (sym) names.push(S.sym);
    if (scene === "lab") {
      for (const n of names) lines.push(stat(n), "");
      for (const n of names) {
        lines.push(`OS:>> cat ${n}`);
        lines.push(n === S.sym && deleted ? `cat: ${n}: No such file or directory` : "Link test\nI added  second line.");
      }
    } else {
      for (const n of names) {
        const dangling = n === S.sym && deleted;
        lines.push(`open("${n}") → ${dangling ? "-1: No such file or directory" : n === S.sym ? "follows the path /usr/jim/memo → i-node 70" : "i-node 70"}`);
      }
    }
    term.textContent = lines.join("\n");
    let text;
    if (last === "hard") text = `A hard link adds a directory entry with the same i-number (${S.ino}): two names, one file. The link count rises to ${count()}.`;
    else if (last === "sym") text = `A symbolic link is a new file with its own i-number (${S.symIno}${scene === "slide" ? "*" : ""}) whose contents are the path ${scene === "lab" ? "my_file (Size: 7, the length of the name)" : "/usr/jim/memo"}; it points to the name, not the data.`;
    else if (last === "del") text = `Deleting ${S.orig} removes one name: the link count drops to ${count()}${hard ? `, and ${S.hard} still reads the data` : count() === 0 ? ", so the file's data is freed" : ""}${sym ? `; ${S.sym} still points at the name ${S.orig}, which is gone: it dangles` : ""}.`;
    else text = scene === "lab" ? `${S.orig} has inode ${S.ino} and Links: 1. Make a hard link, a symbolic link, then delete the original.` : "Two directories before linking /usr/jim/memo into ast's directory. Directory entries are i-number + name; memo is i-node 70.";
    caption.textContent = text;
  }
  draw();
}

export const WIDGETS = {
  "syscall-steps-play": syscallStepsPlay,
  "thread-models": threadModels,
  "file-links": fileLinks,
};
