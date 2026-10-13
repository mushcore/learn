// Shared playback bar for widgets that animate a process: restart, step back, play / pause, step
// forward, a scrub slider and a speed button. The position is a real number from 0 to `count`;
// whole numbers are the rest points between steps, and the fraction is how far the current step
// has been drawn. The widget draws one frame in onFrame(pos) and never runs a timer of its own.
import { el } from "./dom.js";

const SPEEDS = [0.5, 1, 2];
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * opts: count (number of steps), stepMs (time for one step at 1×; a number or a function), onFrame(pos, playing),
 * unit (word after the counter, "bit" gives "bit 3 of 8"), limit() (optional: the furthest
 * position allowed right now, for widgets that hold the next step back until a question is
 * answered), onBlocked() (optional: called when play or step is pressed at the limit).
 * Returns { el, pos(), set(pos), reset(count), play(), pause(), next() }.
 */
export function createPlayback(opts) {
  let count = Math.max(1, opts.count | 0), pos = 0, playing = false, target = null, speed = 1, raf = 0, last = 0, held = 0;
  const stepMs = () => (typeof opts.stepMs === "function" ? opts.stepMs() : opts.stepMs) || 900, unit = opts.unit || "step";
  const limit = () => Math.min(count, opts.limit ? opts.limit() : count);

  const bar = el("div", "playback");
  const mk = (text, label) => { const b = el("button", "viz-btn playback-btn", text); b.type = "button"; b.setAttribute("aria-label", label); b.title = label; return b; };
  const restartB = mk("⏮", "Restart"), prevB = mk("◀", `Back one ${unit}`), playB = mk("▶ Play", "Play"), nextB = mk("▶|", `Forward one ${unit}`);
  playB.classList.add("playback-play");
  const range = document.createElement("input");
  range.type = "range"; range.min = 0; range.step = 0.5; range.className = "playback-slider";
  range.setAttribute("aria-label", `Position, in ${unit}s`);
  const where = el("span", "playback-pos");
  const speedB = mk("1×", "Playback speed");
  bar.append(restartB, prevB, playB, nextB, range, where, speedB);

  function paint() {
    range.max = count; range.value = pos;
    const done = Math.min(count, Math.floor(pos + 1e-9));
    where.textContent = `${unit} ${Math.min(count, done + (pos > done ? 1 : 0))} of ${count}`;
    playB.textContent = playing ? "⏸ Pause" : pos >= count ? "↻ Replay" : "▶ Play";
    playB.setAttribute("aria-label", playing ? "Pause" : pos >= count ? "Replay" : "Play");
    prevB.disabled = restartB.disabled = pos <= 0;
    nextB.disabled = pos >= count;
    opts.onFrame(pos, playing);
  }
  function stop() { playing = false; target = null; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function tick(now) {
    raf = 0;
    if (!bar.isConnected) { stop(); return; }
    // The first rAF timestamp can precede the performance.now() taken in run(), so never let dt go negative.
    const dt = Math.max(0, Math.min(100, now - last)); last = now;
    const end = target != null ? Math.min(target, limit()) : limit();
    if (reducedMotion()) {
      // No tweening: hold each finished step on screen for its duration, then jump to the next.
      held += dt;
      if (held >= stepMs() / speed) { held = 0; pos = Math.min(end, Math.floor(pos + 1e-9) + 1); }
    } else pos = Math.min(end, pos + (dt / stepMs()) * speed);
    if (pos >= end - 1e-9) { pos = end; stop(); } else raf = requestAnimationFrame(tick);
    paint();
  }
  function run(to) {
    if (pos >= limit() - 1e-9) { if (pos < count && opts.onBlocked) opts.onBlocked(); return; }
    target = to; playing = true; held = reducedMotion() ? stepMs() / speed : 0; last = performance.now();
    if (!raf) raf = requestAnimationFrame(tick);
    paint();
  }
  const api = {
    el: bar,
    pos: () => pos,
    set(p) { stop(); pos = Math.max(0, Math.min(limit(), p)); paint(); },
    reset(n) { stop(); if (n) count = Math.max(1, n | 0); pos = 0; paint(); },
    play() { if (pos >= count) pos = 0; run(null); },
    pause() { stop(); paint(); },
    next() { run(Math.floor(pos + 1e-9) + 1); },
  };
  restartB.addEventListener("click", () => api.set(0));
  prevB.addEventListener("click", () => api.set(Math.ceil(pos - 1e-9) - 1));
  nextB.addEventListener("click", () => api.next());
  playB.addEventListener("click", () => (playing ? api.pause() : api.play()));
  range.addEventListener("input", () => api.set(parseFloat(range.value)));
  speedB.addEventListener("click", () => { speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]; speedB.textContent = `${speed}×`; });
  paint();
  return api;
}
