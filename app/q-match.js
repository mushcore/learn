// Question type "match": left column of fixed terms, right column of draggable
// answers (shuffled deterministically so retries look the same). Each left row
// is a drop target. Touch screens have no HTML5 drag, so a chip can also be
// tapped to pick it up and a row tapped to place it (tap a placed chip to put it
// back); a <select> under each term is the keyboard path. All three stay in
// sync. Graded when every pair lines up.
import { registerQuestionType } from "./quiz.js";
import { inline } from "./markdown.js";

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// Deterministic seeded shuffle so a retry of the same question looks the same.
function seededShuffle(arr, seed) {
  let s = seed >>> 0 || 1;
  const rand = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

registerQuestionType("match", (qEl, spec) => {
  const pairs = spec.pairs;
  const n = pairs.length;
  const seed = hashSeed(spec.q + JSON.stringify(pairs));
  const poolOrder = seededShuffle([...Array(n).keys()], seed);
  // assignment[leftIndex] = rightIndex | null
  const assignment = new Array(n).fill(null);
  let graded = false;
  let picked = null; // pool chip picked up by a tap, waiting for a row

  const box = el("div", "match-box");
  const rowsEl = el("div", "match-rows");
  const pool = el("div", "match-pool");
  box.append(rowsEl, pool);
  qEl.append(box);
  qEl.append(el("div", "q-note", "Drag an answer onto its term, tap an answer then its term, or use the dropdown."));

  const rowRefs = [];

  function assign(leftIndex, rightIndex) {
    if (graded) return;
    if (rightIndex != null) {
      for (let i = 0; i < n; i++) if (assignment[i] === rightIndex) assignment[i] = null;
    }
    assignment[leftIndex] = rightIndex;
    picked = null;
    render();
  }

  function render() {
    rowsEl.innerHTML = "";
    rowRefs.length = 0;
    pairs.forEach(([left], i) => {
      const row = el("div", "match-row");
      const term = el("div", "match-term");
      term.innerHTML = inline(left);
      row.append(term);

      const drop = el("div", "match-drop");
      if (!graded) {
        drop.tabIndex = 0;
        drop.setAttribute("role", "button");
        drop.setAttribute("aria-label", assignment[i] != null ? "remove this answer" : picked != null ? "place the picked answer here" : "drop target");
        const place = () => {
          if (graded) return;
          if (picked != null) assign(i, picked);
          else if (assignment[i] != null) assign(i, null);
        };
        drop.addEventListener("click", place);
        drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); place(); } });
        if (picked != null) drop.classList.add("ready");
      }
      if (assignment[i] != null) {
        const chip = el("div", "match-chip placed");
        chip.innerHTML = inline(pairs[assignment[i]][1]);
        chip.draggable = !graded;
        chip.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", String(assignment[i]));
        });
        drop.append(chip);
      } else {
        drop.append(el("span", "match-drop-hint", picked != null ? "tap to place" : "drop here"));
      }
      drop.addEventListener("dragover", (e) => { if (!graded) e.preventDefault(); });
      drop.addEventListener("drop", (e) => {
        e.preventDefault();
        if (graded) return;
        const idx = Number(e.dataTransfer.getData("text/plain"));
        if (Number.isInteger(idx)) assign(i, idx);
      });
      row.append(drop);

      const select = document.createElement("select");
      select.className = "q-input match-select";
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = "\u2014 choose \u2014";
      select.append(blank);
      poolOrder.forEach((ri) => {
        const opt = document.createElement("option");
        opt.value = String(ri);
        opt.textContent = pairs[ri][1];
        if (assignment[i] === ri) opt.selected = true;
        select.append(opt);
      });
      select.disabled = graded;
      select.addEventListener("change", () => {
        const v = select.value === "" ? null : Number(select.value);
        assign(i, v);
      });
      row.append(select);

      if (graded) {
        const ok = assignment[i] === i;
        row.classList.add(ok ? "correct" : "incorrect");
        if (!ok) { const ans = el("div", "match-answer"); ans.innerHTML = "correct: " + inline(pairs[i][1]); row.append(ans); }
      }

      rowsEl.append(row);
      rowRefs.push(row);
    });

    pool.innerHTML = "";
    if (!graded) {
      poolOrder.forEach((ri) => {
        if (assignment.includes(ri)) return;
        const chip = el("div", "match-chip" + (picked === ri ? " picked" : ""));
        chip.innerHTML = inline(pairs[ri][1]);
        chip.draggable = true;
        chip.tabIndex = 0;
        chip.setAttribute("role", "button");
        chip.setAttribute("aria-pressed", String(picked === ri));
        chip.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", String(ri));
        });
        const pick = () => { picked = picked === ri ? null : ri; render(); pool.querySelector(".match-chip.picked")?.focus({ preventScroll: true }); };
        chip.addEventListener("click", pick);
        chip.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
        pool.append(chip);
      });
    }
  }

  render();

  return () => {
    graded = true;
    render();
    return assignment.every((a, i) => a === i);
  };
});
