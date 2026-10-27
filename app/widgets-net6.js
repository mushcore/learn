// Interactive data-communications widgets for COMP 3721 Week 7 (Lectures 07a, 07b and the 07c note):
// error detection and correction (block codes, Hamming distance, parity, CRC division, checksum, FEC)
// and data-link control (byte and bit stuffing, Simple and Stop-and-Wait). No top-level DOM access, so
// Bun can import the pure functions for tests.
import { el } from "./dom.js";
import { createPlayback } from "./playback.js";

// ---------- pure arithmetic (exported; pinned by spec/comp3721/tools/net6.test.js) ----------
const BITS = /^[01]+$/;
const xorBits = (a, b) => { let s = ""; for (let i = 0; i < a.length; i++) s += a[i] === b[i] ? "0" : "1"; return s; };

/** Mod-2 long division in the slide-38 layout: one step per quotient bit; the remainder keeps divisor.length − 1 bits. */
export function crcDivide(dividend, divisor) {
  if (!BITS.test(String(dividend ?? "")) || !BITS.test(String(divisor ?? ""))) throw new Error("bits only");
  if (divisor[0] !== "1") throw new Error("divisor must start with 1");
  const n = divisor.length, zeros = "0".repeat(n);
  if (dividend.length < n) return { quotient: "0", remainder: dividend.padStart(n - 1, "0"), steps: [] };
  const steps = [];
  let quotient = "", win = dividend.slice(0, n), x = "";
  for (let i = n; ; i++) {
    const useDivisor = win[0] === "1";
    x = xorBits(win, useDivisor ? divisor : zeros);
    steps.push({ window: win, useDivisor, xor: x });
    quotient += useDivisor ? "1" : "0";
    if (i >= dividend.length) break;
    win = x.slice(1) + dividend[i];
  }
  return { quotient, remainder: x.slice(1), steps };
}
/** CRC encoder: append divisor.length − 1 zeros, divide, codeword = dataword + remainder. */
export function crcEncode(dataword, divisor) {
  const zeros = "0".repeat(Math.max(0, String(divisor ?? "").length - 1));
  const { remainder } = crcDivide(String(dataword ?? "") + zeros, divisor);
  return { remainder, codeword: dataword + remainder };
}
/** CRC decoder: the syndrome is the remainder of the received word ÷ divisor. */
export const crcSyndrome = (received, divisor) => crcDivide(received, divisor).remainder;

/** One's complement sum of m-bit words: the raw sum, each value after a carry fold (until it fits), the final sum. */
export function onesComplementSum(words, m) {
  const mod = 2 ** m, raw = words.reduce((s, v) => s + v, 0), wraps = [];
  let v = raw;
  while (v > mod - 1) { v = Math.floor(v / mod) + (v % mod); wraps.push(v); }
  return { raw, wraps, sum: v };
}
/** Checksum = complement of the one's complement sum = (2^m − 1) − sum. */
export const checksum = (words, m) => 2 ** m - 1 - onesComplementSum(words, m).sum;

/** Hamming distance: the number of positions where two equal-length words differ. */
export function hamming(a, b) {
  if (String(a).length !== String(b).length) throw new Error("words must have the same length");
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}
function closestPair(codewords) {
  let best = { d: Infinity, i: -1, j: -1 };
  for (let i = 0; i < codewords.length; i++)
    for (let j = i + 1; j < codewords.length; j++) {
      const d = hamming(codewords[i], codewords[j]);
      if (d < best.d) best = { d, i, j };
    }
  return best;
}
/** Minimum Hamming distance over all pairs of codewords (Infinity for fewer than two). */
export const dmin = (codewords) => closestPair(codewords).d;

// Bit stuffing: after a 0 (or the flag's last 0), count consecutive 1s; at five, insert a 0 and restart the count.
function stuffBitsMarked(bits) {
  let out = "", run = 0;
  const inserted = [], counts = [];
  for (const b of bits) {
    out += b;
    run = b === "1" ? run + 1 : 0;
    counts.push(run);
    if (run === 5) { inserted.push(out.length); out += "0"; run = 0; }
  }
  return { out, inserted, counts };
}
function unstuffBitsMarked(bits) {
  let out = "", run = 0, invalid = false;
  const removed = [];
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i];
    out += b;
    run = b === "1" ? run + 1 : 0;
    if (run === 5) {
      if (bits[i + 1] === "0") { removed.push(i + 1); i++; run = 0; }
      else if (bits[i + 1] === "1") invalid = true;
      else run = 0;
    }
  }
  return { out, removed, invalid };
}
export const stuffBits = (bits) => stuffBitsMarked(bits).out;
export const unstuffBits = (bits) => unstuffBitsMarked(bits).out;

// Byte stuffing: an ESC goes in front of every FLAG or ESC in the data; the receiver drops each ESC and keeps the next byte.
const isSpecial = (t) => t === "FLAG" || t === "ESC";
function stuffBytesMarked(tokens) {
  const out = [], inserted = [];
  for (const t of tokens) { if (isSpecial(t)) { inserted.push(out.length); out.push("ESC"); } out.push(t); }
  return { out, inserted };
}
function unstuffBytesMarked(tokens) {
  const out = [], removed = [];
  let dangling = false, bareFlag = false;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "ESC") { removed.push(i); i++; if (i < tokens.length) out.push(tokens[i]); else dangling = true; }
    else { if (tokens[i] === "FLAG") bareFlag = true; out.push(tokens[i]); }
  }
  return { out, removed, dangling, bareFlag };
}
export const stuffBytes = (tokens) => stuffBytesMarked(tokens).out;
export const unstuffBytes = (tokens) => unstuffBytesMarked(tokens).out;

// ---------- shared DOM helpers (called only inside widgets) ----------
/** Bit string as one cell per bit. cls(i, bit) returns extra classes for a cell; opts.sm uses small cells. */
function bitCells(bits, cls, opts = {}) {
  const row = el("span", "net6-cells");
  [...String(bits)].forEach((b, i) => {
    const extra = cls ? cls(i, b) : "";
    const c = el("span", "net6-b" + (opts.sm ? " sm" : "") + (extra ? " " + extra : ""), b);
    if (opts.onClick) { c.classList.add("click"); c.setAttribute("role", "button"); c.title = `bit ${i + 1}`; c.addEventListener("click", () => opts.onClick(i)); }
    row.append(c);
  });
  return row;
}
/** A labelled row: label, then nodes or strings. */
function line(label, ...parts) {
  const row = el("div", "net6-row");
  if (label != null) row.append(el("span", "lab", label));
  for (const p of parts) if (p != null) row.append(typeof p === "string" ? el("span", null, p) : p);
  return row;
}
function statCell(label, value, note) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label), el("div", "stat-value", value));
  if (note) c.append(el("div", "stat-note", note));
  return c;
}
/** A labelled text box; get() is the trimmed text. */
function textField(label, value, width = 220) {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "text"; input.spellcheck = false; input.value = value ?? "";
  input.setAttribute("aria-label", label);
  input.style.width = `${width}px`; input.style.maxWidth = "100%";
  row.append(el("label", null, label), input);
  return { row, input, get: () => input.value.trim(), set: (v) => { input.value = v ?? ""; }, on: (fn) => input.addEventListener("input", fn) };
}
/** Buttons with one active choice; set(i) moves the highlight without firing. */
function choice(labels, active, onPick) {
  const row = el("div", "viz-btn-row");
  const btns = labels.map((l, i) => {
    const b = el("button", "viz-btn" + (i === active ? " active" : ""), l);
    b.type = "button";
    b.addEventListener("click", () => { set(i); onPick(i, l); });
    row.append(b);
    return b;
  });
  function set(i) { btns.forEach((b, j) => b.classList.toggle("active", j === i)); }
  return { row, set };
}
function checkbox(label, checked, onChange) {
  const lab = el("label", "net5-check");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, document.createTextNode(label));
  return { row: lab, input };
}
function button(label, onClick) {
  const b = el("button", "viz-btn", label);
  b.type = "button";
  b.addEventListener("click", onClick);
  return b;
}
/** Bit inputs, one per cell; get() is the typed string (blanks as spaces); mark(i, ok) colours one. */
function bitInputs(count, label) {
  const row = el("span", "net6-cells");
  const ins = [];
  for (let i = 0; i < count; i++) {
    const inp = document.createElement("input");
    inp.type = "text"; inp.maxLength = 1; inp.className = "net6-in"; inp.inputMode = "numeric";
    inp.setAttribute("aria-label", `${label} bit ${i + 1}`);
    inp.addEventListener("input", () => { inp.classList.remove("bad", "ok"); if (inp.value && i + 1 < count) ins[i + 1].focus(); });
    ins.push(inp); row.append(inp);
  }
  return {
    row,
    get: () => ins.map((x) => (x.value.trim() || " ")).join(""),
    mark: (i, ok) => { ins[i].classList.toggle("ok", ok); ins[i].classList.toggle("bad", !ok); },
  };
}
const verdict = (cls, text) => el("div", "net6-verdict " + cls, text);
/** cfg.presets: an object { label: cfg } replaces the built-ins; a list of names picks built-ins (a short name matches a built-in that starts with it). */
function presetsOf(cfg, builtIn, aliases = {}) {
  const find = (n) => {
    if (builtIn[n]) return [n, builtIn[n]];
    if (aliases[n] && builtIn[aliases[n]]) return [n, builtIn[aliases[n]]];
    const k = Object.keys(builtIn).find((b) => b.startsWith(n));
    return k ? [n, builtIn[k]] : null;
  };
  if (Array.isArray(cfg.presets)) {
    const o = {};
    for (const n of cfg.presets) { const hit = find(String(n)); if (hit) o[hit[0]] = hit[1]; }
    return Object.keys(o).length ? o : builtIn;
  }
  if (cfg.presets && typeof cfg.presets === "object" && Object.keys(cfg.presets).length) return cfg.presets;
  return builtIn;
}
/** cfg.preset (optional): a preset label applied at start. */
const startPreset = (cfg, presets) => (cfg.preset && presets[cfg.preset] ? presets[cfg.preset] : null);

// ---------- widget: codeword-lab ----------
const parityOf = (d) => ([...d].filter((b) => b === "1").length % 2 ? "1" : "0");
const binCount = (i, k) => i.toString(2).padStart(k, "0");
const CODES = {
  "parity-5-4": { label: "Parity C(5, 4) (slide 27)", k: 4, build: (d) => d + parityOf(d), parity: true },
  "crc-7-4": { label: "CRC C(7, 4) (slide 34)", k: 4, build: (d) => crcEncode(d, "1011").codeword, divisor: "1011" },
  "c3-2": { label: "C(3, 2)", list: ["000", "011", "101", "110"], parity: true },
  "c5-2": { label: "C(5, 2)", list: ["00000", "01011", "10101", "11110"] },
};
/** The dataword → codeword table of a code: { datawords, codewords, k, n, r, parity, divisor, error }. */
function codeTable(code, cfg) {
  if (code === "custom") {
    const cw = Array.isArray(cfg.codewords) ? cfg.codewords.map((c) => String(c).trim()) : [];
    const n = cw.length ? cw[0].length : 0;
    if (cw.length < 2 || !cw.every((c) => BITS.test(c) && c.length === n)) return { error: "Custom code: give at least two codewords, bit strings of one length." };
    let dw = Array.isArray(cfg.datawords) ? cfg.datawords.map((d) => String(d).trim()) : null;
    const k0 = Math.max(1, Math.ceil(Math.log2(cw.length)));
    if (!dw || dw.length !== cw.length || !dw.every((d) => BITS.test(d) && d.length === dw[0].length)) dw = cw.map((_, i) => binCount(i, k0));
    const k = dw[0].length, r = Math.max(0, n - k);
    const parity = r === 1 && cw.every((c, i) => c === dw[i] + parityOf(dw[i]));
    return { datawords: dw, codewords: cw, k, n, r, parity, divisor: null, custom: true };
  }
  const c = CODES[code] || CODES["parity-5-4"];
  if (c.list) {
    const k = Math.round(Math.log2(c.list.length)), n = c.list[0].length;
    return { datawords: c.list.map((_, i) => binCount(i, k)), codewords: c.list, k, n, r: n - k, parity: !!c.parity, divisor: null };
  }
  const datawords = Array.from({ length: 2 ** c.k }, (_, i) => binCount(i, c.k));
  const codewords = datawords.map(c.build);
  const n = codewords[0].length;
  return { datawords, codewords, k: c.k, n, r: n - c.k, parity: !!c.parity, divisor: c.divisor || null };
}
const redundantCls = (k) => (i) => (i >= k ? "rd" : "");
const CODE_KEYS = ["parity-5-4", "crc-7-4", "c3-2", "c5-2"];
const CW_MODES = ["table", "distance", "send"];
const CW_RULE = "The receiver only checks whether the received word is a valid codeword: not in the table → discarded; in the table → accepted, even when it is not the codeword that was sent (an undetected error).";

function codewordLab(box, cfg) {
  const presets = cfg.presets ? presetsOf(cfg, {}) : null;
  const names = presets ? Object.keys(presets) : [];
  const init = (c) => ({
    code: CODE_KEYS.includes(c.code) || c.code === "custom" ? c.code : "parity-5-4",
    mode: CW_MODES.includes(c.mode) ? c.mode : "send",
    a: c.a != null ? String(c.a) : "10101",
    b: c.b != null ? String(c.b) : "11110",
    send: c.send != null ? String(c.send) : "1011",
    flips: new Set((Array.isArray(c.flips) ? c.flips : []).map((p) => Math.round(+p) - 1).filter((p) => p >= 0)),
    codewords: c.codewords, datawords: c.datawords,
    predict: !!c.predict,
  });
  let st = init(presets && startPreset(cfg, presets) ? { ...cfg, ...startPreset(cfg, presets) } : cfg);
  let guess = null, tally = { right: 0, total: 0 };

  box.append(el("h4", null, cfg.title || "Block codes: datawords, codewords and Hamming distance"));
  if (names.length) box.append(choice(names, -1, (i) => { st = init({ ...cfg, ...presets[names[i]] }); syncControls(); render(); }).row);
  const codeLabels = CODE_KEYS.map((k) => CODES[k].label).concat(cfg.code === "custom" || Array.isArray(cfg.codewords) ? ["Custom"] : []);
  const codeIndex = () => (st.code === "custom" ? CODE_KEYS.length : CODE_KEYS.indexOf(st.code));
  const codeCh = choice(codeLabels, codeIndex(), (i) => { st.code = i < CODE_KEYS.length ? CODE_KEYS[i] : "custom"; st.flips = new Set(); st.send = ""; guess = null; render(); });
  const modeCh = choice(["Table", "Distance d(a, b)", "Send and receive"], CW_MODES.indexOf(st.mode), (i) => { st.mode = CW_MODES[i]; syncControls(); render(); });
  const aF = textField("word a", st.a, 160), bF = textField("word b", st.b, 160);
  aF.on(() => { st.a = aF.get(); render(); });
  bF.on(() => { st.b = bF.get(); render(); });
  const distIn = el("div");
  distIn.append(aF.row, bF.row);
  const pred = checkbox("Predict the receiver's decision first", st.predict, (v) => { st.predict = v; guess = null; render(); });
  const out = el("div");
  box.append(codeCh.row, modeCh.row, distIn, pred.row, out);

  function syncControls() {
    codeCh.set(codeIndex()); modeCh.set(CW_MODES.indexOf(st.mode));
    aF.set(st.a); bF.set(st.b); pred.input.checked = st.predict;
    distIn.style.display = st.mode === "distance" ? "" : "none";
    pred.row.style.display = st.mode === "send" ? "" : "none";
  }

  function tableSection(t) {
    const sec = el("div");
    const cp = closestPair(t.codewords);
    const tbl = el("div", "net6-table");
    t.datawords.forEach((d, i) => {
      const pair = el("div", "net6-pair" + (i === cp.i || i === cp.j ? " hot" : ""));
      pair.append(bitCells(d, null, { sm: true }), el("span", "arr", "→"), bitCells(t.codewords[i], redundantCls(t.k), { sm: true }));
      tbl.append(pair);
    });
    sec.append(line("Dataword → codeword", el("span", "net6-key", t.r ? `redundant bits (r = ${t.r}) in blue` : "")));
    sec.append(tbl);
    const valid = t.codewords.length, total = 2 ** t.n;
    const g = el("div", "stat-grid");
    g.append(
      statCell("dataword bits k", String(t.k)),
      statCell("redundant bits r", String(t.r), "r = n − k"),
      statCell("codeword bits n", String(t.n)),
      statCell(t.custom ? "valid codewords" : "valid codewords 2^k", String(valid)),
      statCell(t.custom ? "invalid words 2^n − valid" : "invalid 2^n − 2^k", String(total - valid)),
      statCell("total n-bit words 2^n", String(total)),
    );
    sec.append(g);
    const d = cp.d;
    sec.append(el("p", "math-line", `d_min = ${d}: closest pair ${t.codewords[cp.i]} and ${t.codewords[cp.j]} (highlighted), d = ${d}; every pair checked.`));
    sec.append(el("p", "math-line", `detects up to d_min − 1 = ${d - 1}, corrects up to ⌊(d_min − 1)/2⌋ = ${Math.floor((d - 1) / 2)}`));
    return sec;
  }

  function distanceSection() {
    const sec = el("div");
    const a = st.a, b = st.b;
    if (!BITS.test(a) || !BITS.test(b)) { sec.append(el("p", "widget-note", "Bits only: type two words of 0s and 1s.")); return sec; }
    sec.append(line("a", bitCells(a)), line("b", bitCells(b)));
    if (a.length !== b.length) { sec.append(el("p", "widget-note", `The two words differ in length (${a.length} and ${b.length} bits): Hamming distance is defined only for words of the same size.`)); return sec; }
    const x = xorBits(a, b);
    sec.append(line("a ⊕ b", bitCells(x, (i, v) => (v === "1" ? "hot" : ""))));
    sec.append(el("p", "math-line", `d(a, b) = number of 1s = ${hamming(a, b)}`));
    return sec;
  }

  function sendSection(t) {
    const sec = el("div");
    let di = t.datawords.indexOf(st.send);
    if (di < 0) { di = t.datawords.indexOf("1011"); if (di < 0) di = t.datawords.length - 1; st.send = t.datawords[di]; }
    const sent = t.codewords[di];
    for (const p of [...st.flips]) if (p >= t.n) st.flips.delete(p);
    const received = [...sent].map((b, i) => (st.flips.has(i) ? (b === "1" ? "0" : "1") : b)).join("");
    const pick = el("div", "viz-btn-row net6-dw");
    t.datawords.forEach((d, i) => {
      const btn = button(d, () => { st.send = d; st.flips = new Set(); guess = null; render(); });
      if (i === di) btn.classList.add("active");
      pick.append(btn);
    });
    sec.append(line("Dataword", null), pick);
    sec.append(line("Sent codeword", bitCells(sent, redundantCls(t.k))));
    sec.append(line("Received (click a bit to flip it)", bitCells(received, (i) => (st.flips.has(i) ? "bad" : ""), { onClick: (i) => { if (st.flips.has(i)) st.flips.delete(i); else st.flips.add(i); guess = null; render(); } })));
    const x = xorBits(sent, received), d = hamming(sent, received);
    sec.append(line("sent ⊕ received", bitCells(x, (i, v) => (v === "1" ? "hot" : ""))));
    sec.append(el("p", "math-line", `d(sent, received) = number of 1s = ${d}`));
    if (t.parity) {
      const names = [...received].map((_, i) => (i === t.n - 1 ? "q0" : `b${t.n - 2 - i}`));
      const ones = [...received].filter((b) => b === "1").length;
      sec.append(el("p", "math-line", `s0 = ${names.join(" + ")} = ${[...received].join(" + ")} = ${ones} = ${ones % 2} (mod 2)`));
    }
    let syn = null;
    if (t.divisor) { syn = crcSyndrome(received, t.divisor); sec.append(el("p", "math-line", `Syndrome = remainder of ${received} ÷ ${t.divisor} = ${syn}`)); }
    const vi = t.codewords.indexOf(received);
    const kind = received === sent ? "accepted" : vi < 0 ? "discarded" : "wrong";
    const v = el("div");
    const showVerdict = () => {
      const tail = syn != null ? ` (syndrome ${syn})` : "";
      if (kind === "accepted") v.append(verdict("ok", `No error: ${received} is the codeword sent; dataword ${t.datawords[di]} accepted${tail}.`));
      else if (kind === "discarded") {
        v.append(verdict("bad", `Invalid codeword: detected, discarded${tail}.`));
        const cp = closestPair(t.codewords);
        if (cp.d >= 3) {
          let best = -1, bd = Infinity;
          t.codewords.forEach((c, i) => { const h = hamming(c, received); if (h < bd) { bd = h; best = i; } });
          const nc = t.codewords[best];
          if (bd === 1) v.append(el("p", "math-line", `nearest codeword ${nc} (dataword ${t.datawords[best]}), distance 1: could be corrected${nc === sent ? "" : `, but the sender sent ${sent}: with ${d} flips, correcting picks the wrong codeword`}.`));
          else v.append(el("p", "math-line", `nearest codeword ${nc} is ${bd} bits away: more than ⌊(d_min − 1)/2⌋ = ${Math.floor((cp.d - 1) / 2)}, so it cannot be corrected.`));
        }
      } else v.append(verdict("warn", `Accepted but wrong: valid codeword ${received} (dataword ${t.datawords[vi]}): error undetected${tail}.`));
    };
    if (st.predict && guess == null) {
      const q = el("div", "net6-predict");
      q.append(el("p", "widget-note", "Before the verdict: what does the receiver do with this word?"));
      const opts = [["accepted", "Accepted (no error)"], ["discarded", "Discarded (error detected)"], ["wrong", "Accepted but wrong (undetected)"]];
      const row = el("div", "viz-btn-row");
      for (const [key, lab] of opts) row.append(button(lab, () => { guess = key; tally.total++; if (key === kind) tally.right++; render(); }));
      q.append(row);
      v.append(q);
    } else {
      if (st.predict && guess != null) v.append(el("p", guess === kind ? "net6-ok" : "net6-bad", guess === kind ? `Right. (${tally.right} of ${tally.total} right so far)` : `Not quite. ${CW_RULE} (${tally.right} of ${tally.total} right so far)`));
      showVerdict();
    }
    sec.append(v);
    return sec;
  }

  function render() {
    out.innerHTML = "";
    distIn.style.display = st.mode === "distance" ? "" : "none";
    pred.row.style.display = st.mode === "send" ? "" : "none";
    if (st.mode === "distance") { out.append(distanceSection()); }
    const t = codeTable(st.code, st);
    if (t.error) { out.append(el("p", "widget-note", t.error)); return; }
    if (st.mode === "table") { out.append(tableSection(t)); return; }
    if (st.mode === "send") out.append(sendSection(t));
    const det = document.createElement("details");
    det.className = "net6-details";
    det.append(el("summary", null, `The ${codeLabels[codeIndex()] || "custom"} code: table, counts and d_min`), tableSection(t));
    out.append(det);
  }
  syncControls();
  render();
}

// ---------- widget: crc-calc ----------
const CRC_PRESETS = {
  "Encoder: 1001 ÷ 1011 (slide 38)": { dataword: "1001", divisor: "1011", mode: "encode" },
  "Decoder, uncorrupted 1001110 (slide 40)": { divisor: "1011", mode: "decode", received: "1001110" },
  "Decoder, corrupted 1000110 (slide 40)": { divisor: "1011", mode: "decode", received: "1000110" },
  "07c note: 100100110 ÷ 10011": { divisor: "10011", mode: "decode", received: "100100110", note: "The 07c note writes this remainder as 101; with the divisor's 5 bits the remainder has 4 bits: 0101." },
};
/** The slide-38 long division as rows of fixed-width slots. */
function divisionView(divisor, dividend, r, opts) {
  const n = divisor.length, L = dividend.length, base = n + 1, cols = base + L;
  const wrap = el("div", "net6-div");
  const drow = (items, tag, rowCls) => {
    const row = el("div", "net6-drow" + (rowCls ? " " + rowCls : ""));
    for (let c = 0; c < cols; c++) { const it = items[c]; row.append(el("span", "net6-slot" + (it && it.cls ? " " + it.cls : ""), it ? it.t : "")); }
    if (tag) row.append(el("span", "net6-tag", tag));
    return row;
  };
  const place = (bits, at, cls) => { const o = {}; [...bits].forEach((b, i) => { o[at + i] = { t: b, cls: typeof cls === "function" ? cls(i) : cls }; }); return o; };
  if (opts.showSteps && r.steps.length) wrap.append(drow(place(r.quotient, base + n - 1, "q"), "Quotient (discarded)"));
  const head = { ...place(divisor, 0, "b"), [n]: { t: ")", cls: "paren" }, ...place(dividend, base, (i) => "bar" + (opts.encode && i >= L - (n - 1) ? " y" : "")) };
  wrap.append(drow(head, opts.encode ? "Dividend = dataword + zeros" : "Dividend = received codeword"));
  if (!opts.showSteps) return wrap;
  const zeros = "0".repeat(n);
  r.steps.forEach((s, i) => {
    if (i > 0) wrap.append(drow(place(s.window, base + i, (j) => (j === n - 1 ? "down" : "")), `bring down ${s.window[n - 1]}`));
    wrap.append(drow(place(s.useDivisor ? divisor : zeros, base + i, "b ul"), s.useDivisor ? null : `Leftmost bit 0: use ${zeros} divisor`));
  });
  const last = r.steps.length - 1;
  wrap.append(drow(place(r.remainder, base + last + 1, "y"), opts.encode ? "Remainder" : "Syndrome"));
  return wrap;
}

function crcCalc(box, cfg) {
  const presets = presetsOf(cfg, CRC_PRESETS), names = Object.keys(presets);
  const init = (c) => ({
    dataword: c.dataword != null ? String(c.dataword) : "1001",
    divisor: c.divisor != null ? String(c.divisor) : "1011",
    mode: c.mode === "decode" ? "decode" : "encode",
    received: c.received != null ? String(c.received) : "1001110",
    hide: !!c.hide, note: c.note || "",
  });
  let st = init({ ...cfg, ...(startPreset(cfg, presets) || {}) }), revealed = false;
  box.append(el("h4", null, cfg.title || "CRC: mod-2 long division"));
  box.append(choice(names, -1, (i) => { st = init({ hide: cfg.hide, ...presets[names[i]] }); revealed = false; sync(); render(); }).row);
  const modeCh = choice(["Encode (sender)", "Decode (receiver)"], st.mode === "decode" ? 1 : 0, (i) => { st.mode = i ? "decode" : "encode"; st.note = ""; revealed = false; sync(); render(); });
  const dF = textField("dataword", st.dataword, 170), vF = textField("divisor", st.divisor, 120), rF = textField("received", st.received, 200);
  dF.on(() => { st.dataword = dF.get(); st.note = ""; revealed = false; render(); });
  vF.on(() => { st.divisor = vF.get(); st.note = ""; revealed = false; render(); });
  rF.on(() => { st.received = rF.get(); st.note = ""; revealed = false; render(); });
  const out = el("div");
  box.append(modeCh.row, dF.row, vF.row, rF.row, out);
  function sync() {
    modeCh.set(st.mode === "decode" ? 1 : 0);
    dF.set(st.dataword); vF.set(st.divisor); rF.set(st.received);
    dF.row.style.display = st.mode === "encode" ? "" : "none";
    rF.row.style.display = st.mode === "decode" ? "" : "none";
  }
  function render() {
    out.innerHTML = "";
    const enc = st.mode === "encode", dv = st.divisor;
    if (!/^1[01]{1,8}$/.test(dv)) { out.append(el("p", "widget-note", "Divisor: 2 to 9 bits (0s and 1s) with a leading 1.")); return; }
    if (enc && !/^[01]{1,16}$/.test(st.dataword)) { out.append(el("p", "widget-note", "Dataword: 1 to 16 bits (0s and 1s only).")); return; }
    if (!enc && (!BITS.test(st.received) || st.received.length < dv.length || st.received.length > 25)) { out.append(el("p", "widget-note", `Received word: bits only, at least as long as the divisor (${dv.length} bits) and at most 25 bits.`)); return; }
    const nk = dv.length - 1;
    const dividend = enc ? st.dataword + "0".repeat(nk) : st.received;
    const r = crcDivide(dividend, dv);
    const hidden = st.hide && !revealed;
    const n = enc ? st.dataword.length + nk : st.received.length, k = n - nk;
    const scroll = el("div", "net6-scroll");
    scroll.append(divisionView(dv, dividend, r, { encode: enc, showSteps: !hidden }));
    out.append(scroll);
    if (hidden) {
      const bi = bitInputs(nk, enc ? "remainder" : "syndrome");
      const msg = el("span", "net6-msg");
      const check = button("Check", () => {
        const g = bi.get(); let ok = true;
        for (let i = 0; i < nk; i++) { const good = g[i] === r.remainder[i]; bi.mark(i, good); if (!good) ok = false; }
        if (ok) { revealed = true; render(); } else msg.textContent = "Wrong bits are red: try again or reveal.";
      });
      const reveal = button("Reveal", () => { revealed = true; render(); });
      out.append(line(enc ? `Remainder (${nk} bits)` : `Syndrome (${nk} bits)`, bi.row, check, reveal, msg));
    } else if (enc) {
      out.append(line("Remainder", bitCells(r.remainder, () => "y")), el("p", "math-line", `Quotient ${r.quotient} (discarded), remainder ${r.remainder}.`));
      out.append(line("Codeword = dataword + remainder", bitCells(st.dataword + r.remainder, (i) => (i < st.dataword.length ? "dw" : "y"))));
    } else {
      const zero = !/1/.test(r.remainder);
      out.append(line("Syndrome", bitCells(r.remainder, () => "y")), el("p", "math-line", `Quotient ${r.quotient}, syndrome = ${r.remainder}.`));
      out.append(verdict(zero ? "ok" : "bad", zero ? `Zero → dataword ${st.received.slice(0, k)} accepted.` : "Non-zero → dataword discarded."));
    }
    if (st.note) out.append(el("p", "widget-note", st.note));
    const g = el("div", "stat-grid");
    g.append(
      statCell("n (codeword bits)", String(n)),
      statCell("k (dataword bits)", String(k)),
      statCell("divisor size n − k + 1", String(dv.length)),
      statCell("remainder size n − k", String(nk)),
      statCell("zeros appended", enc ? String(nk) : "0", enc ? null : "the receiver divides the codeword as it arrives"),
    );
    out.append(g, el("p", "widget-note", "Note: Multiply: AND, Subtract: XOR."));
  }
  sync();
  render();
}

// ---------- widget: checksum-calc ----------
const CHECKSUM_PRESETS = {
  "Slide 49 sender (7, 11, 12, 0, 6)": { words: "7 11 12 0 6", base: "dec", m: 4, side: "sender" },
  "Slide 49 receiver (…, checksum 9)": { words: "7 11 12 0 6", base: "dec", m: 4, side: "receiver", checksum: "9" },
  "Corrupted packet (7, 11, 12, 0, 7, 9)": { words: "7 11 12 0 7", base: "dec", m: 4, side: "receiver", checksum: "9" },
  "Forouzan, 16-bit hex (466F 726F 757A 616E)": { words: "466F 726F 757A 616E", base: "hex", m: 16, side: "sender" },
  "Forouzan receiver (+ 7038)": { words: "466F 726F 757A 616E", base: "hex", m: 16, side: "receiver", checksum: "7038" },
};
// Short names a lesson may list in `presets` (w7/OUTLINE.md lesson 07).
const CHECKSUM_ALIASES = {
  "Slide 49 sender": "Slide 49 sender (7, 11, 12, 0, 6)",
  "Slide 49 receiver": "Slide 49 receiver (…, checksum 9)",
  "Corrupted: 7, 11, 12, 0, 7, 9": "Corrupted packet (7, 11, 12, 0, 7, 9)",
  "Forouzan (16-bit hex)": "Forouzan, 16-bit hex (466F 726F 757A 616E)",
};
const BASES = ["dec", "bin", "hex"];
function parseIn(tok, base) {
  const t = String(tok).trim();
  if (base === "bin") return BITS.test(t) ? parseInt(t, 2) : NaN;
  if (base === "hex") return /^(0x)?[0-9a-f]+$/i.test(t) ? parseInt(t.replace(/^0x/i, ""), 16) : NaN;
  return /^\d+$/.test(t) ? parseInt(t, 10) : NaN;
}
const binOf = (v, m) => v.toString(2).padStart(m, "0");
const hexOf = (v, m) => v.toString(16).toUpperCase().padStart(Math.ceil(m / 4), "0");
const fmtIn = (v, base, m) => (base === "bin" ? binOf(v, m) : base === "hex" ? hexOf(v, m) : String(v));

function checksumCalc(box, cfg) {
  const presets = presetsOf(cfg, CHECKSUM_PRESETS, CHECKSUM_ALIASES), names = Object.keys(presets);
  const init = (c) => ({
    words: c.words != null ? (Array.isArray(c.words) ? c.words.join(" ") : String(c.words)) : "7 11 12 0 6",
    base: BASES.includes(c.base) ? c.base : "dec",
    m: [4, 8, 16].includes(+c.m) ? +c.m : 4,
    side: c.side === "receiver" ? "receiver" : "sender",
    checksum: c.checksum != null ? String(c.checksum) : "",
    hide: !!c.hide,
  });
  let st = init({ ...cfg, ...(startPreset(cfg, presets) || {}) }), revealed = false;
  box.append(el("h4", null, cfg.title || "Checksum: one's complement sum and its complement"));
  box.append(choice(names, -1, (i) => { st = init({ hide: cfg.hide, ...presets[names[i]] }); revealed = false; sync(); render(); }).row);
  const baseCh = choice(["decimal", "binary", "hex"], BASES.indexOf(st.base), (i) => {
    const nb = BASES[i], conv = (txt) => { const toks = txt.split(/[\s,]+/).filter(Boolean); const vs = toks.map((t) => parseIn(t, st.base)); return vs.every(Number.isFinite) ? vs.map((v) => fmtIn(v, nb, st.m)).join(" ") : txt; };
    st.words = conv(st.words); if (st.checksum) st.checksum = conv(st.checksum);
    st.base = nb; revealed = false; sync(); render();
  });
  const mCh = choice(["m = 4", "m = 8", "m = 16"], [4, 8, 16].indexOf(st.m), (i) => { st.m = [4, 8, 16][i]; revealed = false; render(); });
  const sideCh = choice(["Sender", "Receiver"], st.side === "receiver" ? 1 : 0, (i) => { st.side = i ? "receiver" : "sender"; revealed = false; sync(); render(); });
  const wF = textField("words", st.words, 240), cF = textField("received checksum", st.checksum, 110);
  wF.on(() => { st.words = wF.get(); revealed = false; render(); });
  cF.on(() => { st.checksum = cF.get(); revealed = false; render(); });
  const out = el("div");
  box.append(baseCh.row, mCh.row, sideCh.row, wF.row, cF.row, out);
  function sync() {
    baseCh.set(BASES.indexOf(st.base)); mCh.set([4, 8, 16].indexOf(st.m)); sideCh.set(st.side === "receiver" ? 1 : 0);
    wF.set(st.words); cF.set(st.checksum);
    cF.row.style.display = st.side === "receiver" ? "" : "none";
  }
  function render() {
    out.innerHTML = "";
    const { m, base } = st, mask = 2 ** m - 1, recv = st.side === "receiver";
    const toks = st.words.split(/[\s,]+/).filter(Boolean);
    const words = toks.map((t) => parseIn(t, base));
    const badTok = toks.find((_, i) => !Number.isFinite(words[i]));
    const baseName = { dec: "decimal", bin: "binary", hex: "hex" }[base];
    if (!toks.length || badTok != null) { out.append(el("p", "widget-note", toks.length ? `"${badTok}" is not a ${baseName} number.` : "Type the words, separated by spaces.")); return; }
    let cs = 0;
    if (recv) {
      cs = st.checksum ? parseIn(st.checksum, base) : checksum(words, m);
      if (!Number.isFinite(cs)) { out.append(el("p", "widget-note", `The received checksum "${st.checksum}" is not a ${baseName} number.`)); return; }
    }
    const all = recv ? words.concat([cs]) : words;
    const sumR = onesComplementSum(all, m), result = mask - sumR.sum;
    const hidden = st.hide && !revealed;
    const flagged = all.filter((v) => v > mask);
    const tbl = document.createElement("table");
    const tr = (label, bitsNode, dec, hex, cls) => {
      const row = document.createElement("tr");
      if (cls) row.className = cls;
      for (const c of [label, bitsNode, dec, hex]) { const td = document.createElement("td"); if (c != null) td.append(typeof c === "string" ? document.createTextNode(c) : c); row.append(td); }
      tbl.append(row);
    };
    const bits = (v, cls) => bitCells(v > mask ? v.toString(2) : binOf(v, m), () => (v > mask ? "bad" : cls || ""), { sm: true });
    words.forEach((v, i) => tr(`word ${i + 1}`, bits(v), String(v), "0x" + hexOf(v, m), v > mask ? "flag" : ""));
    if (recv) tr("Received checksum", bits(cs, "y"), String(cs), "0x" + hexOf(cs, m), cs > mask ? "flag" : "");
    else tr("Initialized checksum", bits(0), "0", "0x" + hexOf(0, m));
    if (hidden) {
      const sumIn = document.createElement("input"), resIn = document.createElement("input");
      for (const [inp, lab] of [[sumIn, "sum"], [resIn, "checksum"]]) { inp.type = "text"; inp.className = "q-input small"; inp.spellcheck = false; inp.setAttribute("aria-label", `${lab} in ${baseName}`); }
      tr("Sum (in one's complement)", sumIn, null, null, "rule");
      tr(recv ? "Calculated checksum" : "Actual checksum", resIn, null, null);
      const scroll = el("div", "net6-scroll net6-sum"); scroll.append(tbl); out.append(scroll);
      const msg = el("span", "net6-msg");
      const check = button("Check", () => {
        const a = parseIn(sumIn.value, base) === sumR.sum, b = parseIn(resIn.value, base) === result;
        sumIn.classList.toggle("correct", a); sumIn.classList.toggle("incorrect", !a);
        resIn.classList.toggle("correct", b); resIn.classList.toggle("incorrect", !b);
        if (a && b) { revealed = true; render(); } else msg.textContent = `Type both in ${baseName}; red ones are wrong.`;
      });
      out.append(line(null, `Type the sum and the checksum in ${baseName}.`, check, button("Reveal", () => { revealed = true; render(); }), msg));
      return;
    }
    tr("Sum (raw)", bitCells(sumR.raw.toString(2).padStart(m, "0"), null, { sm: true }), String(sumR.raw), "0x" + hexOf(sumR.raw, m), "rule");
    tr("Sum (in one's complement)", bits(sumR.sum, "rd"), String(sumR.sum), "0x" + hexOf(sumR.sum, m));
    tr(recv ? "Calculated checksum" : "Actual checksum", bits(result, "ok"), String(result), "0x" + hexOf(result, m));
    const scroll = el("div", "net6-scroll net6-sum"); scroll.append(tbl); out.append(scroll);
    if (flagged.length) out.append(verdict("bad", `${flagged.join(", ")} ${flagged.length > 1 ? "are" : "is"} outside 0 … ${mask}: ${flagged.length > 1 ? "they do" : "it does"} not fit in ${m} bits.`));
    // wrap rows
    const steps = el("div", "stat-steps");
    let prev = sumR.raw;
    if (!sumR.wraps.length) steps.append(el("p", "math-line", `${sumR.raw} fits in ${m} bits: no wrapping.`));
    for (const next of sumR.wraps) {
      const hi = Math.floor(prev / 2 ** m), lo = prev % 2 ** m;
      if (base === "hex") steps.append(el("p", "math-line", `0x${prev.toString(16).toUpperCase()} → ${hexOf(lo, m)} + ${hi.toString(16).toUpperCase()} = ${next > mask ? next.toString(16).toUpperCase() : hexOf(next, m)}`));
      else steps.append(el("p", "math-line", `${prev} = (${prev.toString(2)})₂ = (${hi.toString(2)})₂ + (${binOf(lo, m)})₂ = (${next > mask ? next.toString(2) : binOf(next, m)})₂ = ${next}`));
      prev = next;
    }
    const sb = binOf(sumR.sum, m), rb = binOf(result, m), sh = hexOf(sumR.sum, m);
    steps.append(
      el("p", "math-line", `Complement in binary: flip every bit, ${sb} → ${rb}`),
      el("p", "math-line", `in decimal: (2^${m} − 1) − ${sumR.sum} = ${mask} − ${sumR.sum} = ${result}`),
      el("p", "math-line", `in hex: F − d per digit, ${[...sh].map((d) => `F−${d}`).join(", ")} = ${hexOf(result, m)}`),
    );
    out.append(steps);
    if (recv) {
      const ok = result === 0;
      out.append(verdict(ok ? "ok" : "bad", `Calculated checksum ${fmtIn(result, base, m)}: ${ok ? "0 → accepted" : "not 0 → rejected"}.`));
    } else {
      const pkt = el("div", "net6-packet");
      pkt.append(el("span", "lab", "Packet "), document.createTextNode(toks.join(", ") + ", "), el("b", null, fmtIn(result, base, m)));
      out.append(line(`Actual checksum ${fmtIn(result, base, m)}`, null), pkt);
    }
    out.append(el("p", "widget-note", `Two zeros in one's complement: positive zero ${"0".repeat(m)}, negative zero ${"1".repeat(m)} (= 2^${m} − 1 = ${mask}).`));
  }
  sync();
  render();
}

// ---------- widget: stuffing ----------
const STUFF_PRESETS = {
  "Slide 21 (22 bits)": { mode: "bit", data: "0001111111001111101000" },
  "Flag pattern in the data (01111110)": { mode: "bit", data: "01111110" },
  "Seventeen 1s": { mode: "bit", data: "11111111111111111" },
  "Slide 15 (Flag and ESC in the data)": { mode: "byte", data: "d FLAG d d ESC d" },
};
const DEFAULT_DATA = { bit: "0001111111001111101000", byte: "d FLAG d d ESC d" };
const normTok = (t) => (/^flag$/i.test(t) ? "FLAG" : /^esc$/i.test(t) ? "ESC" : t);
const tokText = (t) => (t === "FLAG" ? "Flag" : t);
function byteCells(tokens, cls) {
  const row = el("span", "net6-cells");
  tokens.forEach((t, i) => { const extra = cls ? cls(i, t) : ""; row.append(el("span", "net6-b tok" + (t === "FLAG" ? " flag" : "") + (extra ? " " + extra : ""), tokText(t))); });
  return row;
}
function frameView(mode, dataNode) {
  const f = el("div", "net6-frame");
  const flag = () => (mode === "bit" ? bitCells("01111110", () => "flag", { sm: true }) : el("span", "fld flag", "Flag"));
  f.append(flag(), el("span", "fld", "Header"), dataNode, el("span", "fld", "Trailer"), flag());
  return f;
}

function stuffing(box, cfg) {
  const presets = presetsOf(cfg, STUFF_PRESETS), names = Object.keys(presets);
  const init = (c) => {
    const mode = c.mode === "byte" ? "byte" : "bit";
    const view = c.view === "unstuff" ? "unstuff" : "stuff";
    let data = c.data != null ? (Array.isArray(c.data) ? c.data.join(" ") : String(c.data)) : DEFAULT_DATA[mode];
    if (c.data == null && view === "unstuff") data = mode === "bit" ? stuffBits(data) : stuffBytes(data.split(/\s+/)).join(" ");
    return { mode, view, data, hide: !!c.hide };
  };
  let st = init({ ...cfg, ...(startPreset(cfg, presets) || {}) }), revealed = false;
  box.append(el("h4", null, cfg.title || "Framing: byte stuffing and bit stuffing"));
  box.append(choice(names, -1, (i) => { st = init({ hide: cfg.hide, ...presets[names[i]] }); revealed = false; sync(); render(); }).row);
  const modeCh = choice(["Bit stuffing", "Byte stuffing"], st.mode === "byte" ? 1 : 0, (i) => { st.mode = i ? "byte" : "bit"; st.view = "stuff"; st.data = DEFAULT_DATA[st.mode]; revealed = false; sync(); render(); });
  const viewCh = choice(["Stuff (sender)", "Unstuff (receiver)"], st.view === "unstuff" ? 1 : 0, (i) => {
    const nv = i ? "unstuff" : "stuff";
    if (nv !== st.view) {
      if (st.mode === "bit" && BITS.test(st.data)) st.data = nv === "unstuff" ? stuffBits(st.data) : unstuffBits(st.data);
      if (st.mode === "byte") { const t = st.data.split(/\s+/).filter(Boolean).map(normTok); st.data = (nv === "unstuff" ? stuffBytes(t) : unstuffBytes(t)).join(" "); }
    }
    st.view = nv; revealed = false; sync(); render();
  });
  const dF = textField("data", st.data, 300);
  dF.on(() => { st.data = dF.get(); revealed = false; render(); });
  const out = el("div");
  box.append(modeCh.row, viewCh.row, dF.row, out);
  function sync() { modeCh.set(st.mode === "byte" ? 1 : 0); viewCh.set(st.view === "unstuff" ? 1 : 0); dF.set(st.data); dF.row.querySelector("label").textContent = st.view === "unstuff" ? "received field" : "data"; }
  function hiddenRow(answer, render2) {
    const inp = document.createElement("input");
    inp.type = "text"; inp.className = "q-input"; inp.spellcheck = false; inp.setAttribute("aria-label", "stuffed data");
    inp.style.maxWidth = "100%";
    const msg = el("span", "net6-msg");
    const norm = (s) => (st.mode === "bit" ? s.replace(/\s+/g, "") : s.trim().split(/\s+/).map(normTok).join(" "));
    const check = button("Check", () => {
      const g = norm(inp.value), ok = g === answer;
      inp.classList.toggle("correct", ok); inp.classList.toggle("incorrect", !ok);
      if (ok) { revealed = true; render2(); return; }
      if (st.mode === "bit") { let i = 0; while (i < g.length && g[i] === answer[i]) i++; msg.textContent = `First difference at bit ${i + 1} (${g.length} bits typed, ${answer.length} expected).`; }
      else msg.textContent = `Not yet: ${g.split(" ").filter(Boolean).length} bytes typed, ${answer.split(" ").length} expected.`;
    });
    return line(st.view === "unstuff" ? "Type the data to upper layer" : "Type the stuffed data", inp, check, button("Reveal", () => { revealed = true; render2(); }), msg);
  }
  function render() {
    out.innerHTML = "";
    const bit = st.mode === "bit", unit = bit ? "bits" : "bytes";
    const hidden = st.hide && !revealed;
    if (bit) {
      const d = st.data.replace(/\s+/g, "");
      if (!/^[01]{1,64}$/.test(d)) { out.append(el("p", "widget-note", "Bit mode: 1 to 64 bits, 0s and 1s only.")); return; }
      if (st.view === "stuff") {
        const s = stuffBitsMarked(d), ins = new Set(s.inserted), extra = s.inserted.length;
        out.append(line(`Data from upper layer (${d.length} bits)`, null), el("div", "net6-scroll", null));
        out.lastChild.append(bitCells(d, (i) => (s.counts[i] === 5 ? "run5" : ""), { sm: true }));
        const cnt = el("div", "net6-scroll"); cnt.append(bitCells(s.counts.map(String).join(""), (i) => (s.counts[i] === 5 ? "cnt hot" : "cnt"), { sm: true }));
        out.append(line("Consecutive 1s after a 0 (5 → stuff)", null), cnt);
        if (hidden) { out.append(hiddenRow(s.out, render)); return; }
        out.append(line("Frame sent", null), frameView("bit", bitCells(s.out, (i) => (ins.has(i) ? "bad" : "dw"), { sm: true })));
        out.append(el("p", "math-line", `${extra} extra ${extra === 1 ? "bit" : "bits"}: ${d.length} → ${s.out.length} bits${extra ? ` (stuffed 0s at bits ${s.inserted.map((p) => p + 1).join(", ")} of the field)` : ": no run of five 1s"}`));
        const back = unstuffBits(s.out);
        const u = el("div", "net6-scroll"); u.append(bitCells(back, null, { sm: true }));
        out.append(line("Unstuffed: data to upper layer", el("span", back === d ? "net6-ok" : "net6-bad", back === d ? "✓ equals the data sent" : "✗ differs")), u);
      } else {
        const u = unstuffBitsMarked(d), rem = new Set(u.removed);
        const rec = el("div", "net6-scroll"); rec.append(bitCells(d, (i) => (rem.has(i) ? "bad gone" : "dw"), { sm: true }));
        out.append(line(`Frame received: data field (${d.length} bits)`, null), frameView("bit", rec));
        if (u.invalid) out.append(verdict("bad", "Six 1s in a row: the sender never puts that in the data field (it looks like the flag 01111110), so this is not a valid stuffed field."));
        if (hidden) { out.append(hiddenRow(u.out, render)); return; }
        out.append(el("p", "math-line", `${u.removed.length} ${u.removed.length === 1 ? "bit" : "bits"} removed (each 0 after five 1s): ${d.length} → ${u.out.length} bits`));
        const o = el("div", "net6-scroll"); o.append(bitCells(u.out, null, { sm: true }));
        const again = stuffBits(u.out) === d;
        out.append(line("Data to upper layer", el("span", again ? "net6-ok" : "net6-bad", again ? "✓ stuffing it again gives the received field" : "✗ stuffing it again does not give the received field")), o);
      }
    } else {
      const toks = st.data.split(/\s+/).filter(Boolean).map(normTok);
      if (!toks.length || toks.length > 24) { out.append(el("p", "widget-note", "Byte mode: 1 to 24 bytes separated by spaces; FLAG and ESC are the special bytes, anything else is data.")); return; }
      if (st.view === "stuff") {
        const s = stuffBytesMarked(toks), ins = new Set(s.inserted), extra = s.inserted.length;
        out.append(line(`Data from upper layer (${toks.length} bytes)`, byteCells(toks)));
        if (hidden) { out.append(hiddenRow(s.out.join(" "), render)); return; }
        out.append(line("Frame sent", null), frameView("byte", byteCells(s.out, (i) => (ins.has(i) ? "esc" : ""))));
        out.append(el("p", "math-line", `${extra} extra ${extra === 1 ? "byte" : "bytes"}: ${toks.length} → ${s.out.length} bytes (an ESC before every Flag or ESC in the data)`));
        const back = unstuffBytes(s.out), same = back.join(" ") === toks.join(" ");
        out.append(line("Unstuffed: data to upper layer", byteCells(back), el("span", same ? "net6-ok" : "net6-bad", same ? "✓ equals the data sent" : "✗ differs")));
      } else {
        const u = unstuffBytesMarked(toks), rem = new Set(u.removed);
        out.append(line(`Frame received: data field (${toks.length} bytes)`, null), frameView("byte", byteCells(toks, (i) => (rem.has(i) ? "esc gone" : ""))));
        if (u.bareFlag) out.append(verdict("bad", "A Flag without an ESC in front: the receiver would take it as the end of the frame."));
        if (u.dangling) out.append(verdict("bad", "The field ends with an ESC: there is no next byte to treat as data."));
        if (hidden) { out.append(hiddenRow(u.out.join(" "), render)); return; }
        out.append(el("p", "math-line", `${u.removed.length} ESC ${u.removed.length === 1 ? "byte" : "bytes"} removed (the byte after each ESC is kept as data): ${toks.length} → ${u.out.length} bytes`));
        out.append(line("Data to upper layer", byteCells(u.out)));
      }
    }
    out.append(el("p", "widget-note", bit ? "Rule: whenever five consecutive 1s follow a 0 in the data, add one extra 0 so the receiver does not mistake 01111110 for a flag; the receiver removes the 0 after any five 1s." : "Rule: an ESC is added whenever there is a flag or ESC in the text; the receiver removes each ESC and treats the next character as data, not as a delimiting flag."));
  }
  sync();
  render();
}

// ---------- Task 3: pure event generators for the animations (exported; pinned by net6.test.js) ----------
const toTokens = (data) => (Array.isArray(data) ? data.map((t) => normTok(String(t))) : String(data ?? "").split(/\s+/).filter(Boolean).map(normTok));
/**
 * The steps of the stuff-play animation. Sender pass (unstuff false): one step per bit/byte of the
 * stuffed output; `index` is its position in the output, `insert` marks a stuffed 0 / an inserted ESC.
 * Receiver pass (unstuff true): one step per bit/byte of the received field (the stuffed `data`);
 * `insert` marks the bit/ESC the receiver removes. `count`: bit mode, the consecutive 1s after this
 * step (0 after a stuffed or removed 0); byte mode, the ESC bytes inserted (or removed) so far.
 */
export function stuffSteps(mode, data, unstuff) {
  const steps = [];
  if (mode === "byte") {
    const toks = toTokens(data);
    let n = 0;
    if (!unstuff) {
      for (const t of toks) {
        if (isSpecial(t)) steps.push({ index: steps.length, insert: true, count: ++n });
        steps.push({ index: steps.length, insert: false, count: n });
      }
      return steps;
    }
    const rec = stuffBytes(toks);
    for (let i = 0; i < rec.length; i++) {
      if (rec[i] === "ESC") { steps.push({ index: i, insert: true, count: ++n }); i++; if (i >= rec.length) break; }
      steps.push({ index: i, insert: false, count: n });
    }
    return steps;
  }
  const bits = String(data ?? "").replace(/\s+/g, "");
  let run = 0;
  if (!unstuff) {
    for (const b of bits) {
      run = b === "1" ? run + 1 : 0;
      steps.push({ index: steps.length, insert: false, count: run });
      if (run === 5) { run = 0; steps.push({ index: steps.length, insert: true, count: 0 }); }
    }
    return steps;
  }
  const rec = stuffBits(bits);
  for (let i = 0; i < rec.length; i++) {
    run = rec[i] === "1" ? run + 1 : 0;
    steps.push({ index: i, insert: false, count: run });
    if (run === 5 && rec[i + 1] === "0") { i++; run = 0; steps.push({ index: i, insert: true, count: 0 }); }
  }
  return steps;
}

const SW_SCENARIOS = ["all", "normal", "frame-lost", "ack-lost", "frame-corrupted", "ack-corrupted"];
const SW_D = 1.6, SW_TO = 4.6; // time units: one crossing of the link; the sender's time-out
/**
 * The slide-35 flow diagram as a list of events, each with its drawing (time units on the y axis).
 * Internal: stopWaitEvents exports the { who, text, timer, lost } view of it.
 */
function swScript(protocol, scenario, seq) {
  const simple = protocol === "simple";
  seq = !!seq && !simple;
  const ev = [];
  let t = 0, pkt = 0, s = 0;
  const F = (n) => (seq ? `Frame ${n}` : "Frame"), A = (n) => (seq ? `ACK ${n}` : "ACK");
  const arrow = (a, t1, b, t2, style, label, extra = {}) => ({ type: "arrow", a, t1, b, t2, style, label, ...extra });
  const kinds = simple
    ? (scenario === "frame-lost" ? ["normal", "frame-lost"] : ["normal", "normal"])
    : (!SW_SCENARIOS.includes(scenario) || scenario === "all" ? ["normal", "frame-lost", "ack-lost"] : [scenario]);
  const RULE = {
    send: simple ? "Ready + \"Packet came from network layer.\" → \"Make a frame and send it.\"" : "Ready + \"Packet came from network layer.\" → \"Make a frame, save a copy, and send the frame. Start the timer.\"",
    resend: "Blocking + \"Time-out.\" → \"Resend the saved frame. Restart the timer.\"",
    deliver: simple ? "\"Frame arrived.\" → \"Deliver the packet to network layer.\"" : "Ready + \"Error-free frame arrived.\" → \"Extract and deliver the packet to network layer. Send ACK.\"",
    "discard-frame": "Ready + \"Corrupted frame arrived.\" → \"Discard the frame.\"",
    "discard-ack": "Blocking + \"Corrupted ACK arrived.\" → \"Discard the ACK.\"",
    seqcopy: "With sequence numbers the receiver checks the number: a frame that is not the one it expects was already delivered, so it is discarded and the ACK for the expected frame is sent again.",
    ack: "\"An acknowledgment number always define the sequence number of the next frame to receive.\"",
  };
  for (const kind of kinds) {
    const p = ++pkt, n = s, r = 1 - n;
    ev.push({ who: "sender", kind: "packet", sender: "Ready",
      text: simple ? `Packet ${p} came from the network layer.` : `Packet ${p} came from the network layer; the sender is Ready, so it accepts it.`,
      draw: [arrow("sn", t, "sd", t + 0.5, "packet", "Packet")] });
    t += 0.6;
    let sendT = t;
    const frameLost = kind === "frame-lost", frameBad = kind === "frame-corrupted";
    ev.push({ who: "sender", kind: "send", sender: simple ? "Ready" : "Blocking", timer: simple ? undefined : "start", ask: "send", rule: RULE.send,
      text: simple ? "The sender makes a frame and sends it: no saved copy, no timer." : `The sender makes ${F(n)}, saves a copy, sends it and starts the timer (dark blue clock). Sender: Blocking: no new packet is accepted until the ACK arrives.`,
      draw: [...(simple ? [] : [{ type: "timer", t: sendT, kind: "start" }]), arrow("sd", sendT, "rd", sendT + SW_D, "frame", F(n), { half: frameLost, bad: frameBad })] });
    if (frameLost || frameBad) {
      if (frameLost) ev.push({ who: "link", kind: "lost", lost: true, sender: simple ? "Ready" : "Blocking",
        text: simple ? "Frame lost: the Simple protocol has no error control, so nobody notices and the packet is gone." : `Frame lost: ${F(n)} never reaches the receiver, so no ACK comes back.`,
        draw: [{ type: "mark", x: "mid", t: sendT + SW_D / 2, text: "✕ Lost", color: "var(--red)", dy: 14 }] });
      else ev.push({ who: "receiver", kind: "discard-frame", sender: "Blocking", ask: "discard-frame", rule: RULE["discard-frame"],
        text: "Corrupted frame arrived: the CRC does not check, so the receiver discards the frame and sends no ACK.",
        draw: [{ type: "mark", x: "rd", t: sendT + SW_D, text: "Corrupted: discarded", color: "var(--red)", side: "right" }] });
      if (simple) { t = sendT + SW_D + 0.8; continue; }
      sendT += SW_TO;
      ev.push({ who: "sender", kind: "timeout", sender: "Blocking", timer: "restart", ask: "resend", rule: RULE.resend,
        text: frameLost ? `Frame lost: no ACK comes back, the timer expires; the sender resends the saved frame (${F(n)} (resent)) and restarts the timer (light blue clock).`
          : "A lost frame means either lost or corrupted: no ACK comes back, the timer expires; the sender resends the saved frame and restarts the timer (light blue clock).",
        draw: [{ type: "timer", t: sendT, kind: "restart" }, arrow("sd", sendT, "rd", sendT + SW_D, "frame", `${F(n)} (resent)`)] });
    }
    let tA = sendT + SW_D;
    if (simple) {
      ev.push({ who: "receiver", kind: "deliver", sender: "Ready", ask: "deliver", rule: RULE.deliver,
        text: "Frame arrived: the receiver delivers the packet to the network layer. Nothing goes back: the Simple protocol has no flow or error control.",
        draw: [arrow("rd", tA, "rn", tA + 0.5, "packet", "Packet")] });
      t = tA + 0.9;
      continue;
    }
    ev.push({ who: "receiver", kind: "deliver", sender: "Blocking", ask: "deliver", rule: RULE.deliver, delivered: p,
      text: seq ? `${F(n)} arrived error-free and is the frame expected: the receiver delivers Packet ${p} to the network layer.` : `Error-free frame arrived: the receiver extracts Packet ${p} and delivers it to the network layer.`,
      draw: [arrow("rd", tA, "rn", tA + 0.5, "packet", "Packet")] });
    let tK = tA + 0.6;
    const ackLost = kind === "ack-lost", ackBad = kind === "ack-corrupted";
    ev.push({ who: "receiver", kind: "ack", sender: "Blocking", ask: seq ? "ack" : null, answer: r, rule: RULE.ack,
      text: seq ? `The receiver sends ACK ${r}: an acknowledgment number names the next frame to receive.` : "The receiver sends an ACK back to the sender.",
      draw: [arrow("rd", tK, "sd", tK + SW_D, "ack", A(r), { half: ackLost, bad: ackBad })] });
    if (ackLost || ackBad) {
      if (ackLost) ev.push({ who: "link", kind: "lost", lost: true, sender: "Blocking",
        text: `ACK lost: ${seq ? `ACK ${r}` : "the ACK"} never reaches the sender, which is still Blocking with its timer running.`,
        draw: [{ type: "mark", x: "mid", t: tK + SW_D / 2, text: "✕ Lost", color: "var(--red)", dy: 14 }] });
      else ev.push({ who: "sender", kind: "discard-ack", sender: "Blocking", ask: "discard-ack", rule: RULE["discard-ack"],
        text: "Corrupted ACK arrived: the sender discards the ACK and stays Blocking; the timer keeps running.",
        draw: [{ type: "mark", x: "sd", t: tK + SW_D, text: "Corrupted: discarded", color: "var(--red)", side: "left" }] });
      sendT += SW_TO;
      ev.push({ who: "sender", kind: "timeout", sender: "Blocking", timer: "restart", ask: "resend", rule: RULE.resend,
        text: `${ackLost ? "ACK lost" : "No error-free ACK"}: the timer expires; the sender resends the saved frame (${F(n)} (resent)) and restarts the timer (light blue clock).`,
        draw: [{ type: "timer", t: sendT, kind: "restart" }, arrow("sd", sendT, "rd", sendT + SW_D, "frame", `${F(n)} (resent)`)] });
      tA = sendT + SW_D;
      if (seq) ev.push({ who: "receiver", kind: "seqcopy", sender: "Blocking", ask: "discard-frame", rule: RULE.seqcopy,
        text: `Frame ${n} again: the receiver expected Frame ${r}, so it discards the frame and resends ACK ${r}.`,
        draw: [{ type: "mark", x: "rd", t: tA, text: `Frame ${n} discarded`, color: "var(--blue)", side: "right" }] });
      else ev.push({ who: "receiver", kind: "deliver", sender: "Blocking", ask: "deliver", rule: RULE.deliver, delivered: p, dup: true,
        text: `${ackLost ? "ACK lost" : "ACK corrupted"}: the receiver already delivered this packet; without sequence numbers it delivers it again: a duplicate.`,
        draw: [arrow("rd", tA, "rn", tA + 0.5, "packet", "Packet"), { type: "mark", x: "rn", t: tA + 0.95, text: "Duplicate", color: "var(--blue)", side: "left" }] });
      tK = tA + 0.6;
      ev.push({ who: "receiver", kind: "ack", sender: "Blocking", ask: seq ? "ack" : null, answer: r, rule: RULE.ack,
        text: seq ? `ACK ${r} goes back again: the receiver still expects Frame ${r}.` : "The receiver sends an ACK again.",
        draw: [arrow("rd", tK, "sd", tK + SW_D, "ack", A(r))] });
    }
    ev.push({ who: "sender", kind: "ack-arrive", sender: "Ready", timer: "stop",
      text: seq ? `ACK ${r} arrived error-free: the sender stops the timer (white clock) and discards the saved frame; Frame ${r} is next. Sender: Ready.` : "Error-free ACK arrived: the sender stops the timer (white clock) and discards the saved frame. Sender: Ready.",
      draw: [{ type: "timer", t: tK + SW_D, kind: "stop" }] });
    s = r;
    t = tK + SW_D + 0.7;
  }
  return ev;
}
/** stop-wait-play's events: who acts, the caption text, the timer event, and whether a frame or ACK is lost. */
export function stopWaitEvents(protocol, scenario, seq) {
  return swScript(protocol, scenario, seq).map((e) => {
    const o = { who: e.who, text: e.text };
    if (e.timer) o.timer = e.timer;
    if (e.lost) o.lost = true;
    return o;
  });
}

// ---------- shared playback helpers (Task 3) ----------
const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));
/**
 * Predict-mode bookkeeping shared by the -play widgets. `done` holds the question steps answered right;
 * block(count, needs) is the first unanswered question step (the playback's limit).
 */
function playQuiz(getPb, redraw) {
  const q = { on: false, done: new Set(), asked: 0, first: 0, missed: false, wrong: null, key: null, refocus: false };
  q.reset = () => { q.done = new Set(); q.asked = 0; q.first = 0; q.missed = false; q.wrong = null; q.key = null; };
  q.block = (count, needs) => { for (let i = 0; i < count; i++) if (needs(i) && !q.done.has(i)) return i; return count; };
  q.answer = (i, ok, v, e) => {
    if (!q.missed && q.wrong == null) q.asked++;
    q.refocus = !!e && e.detail === 0;
    if (!ok) { q.missed = true; q.wrong = v; redraw(); return false; }
    if (!q.missed) q.first++;
    q.missed = false; q.wrong = null; q.done.add(i);
    getPb().next();
    return true;
  };
  q.tally = () => (q.asked ? ` ${q.first} of ${q.asked} right on the first try.` : "");
  return q;
}
function predictToggle(label, checked, onChange) {
  const lab = el("label", "playback-check");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, " " + label);
  return { row: lab, input };
}
const nudge = (ask) => () => { ask.classList.remove("playback-nudge"); void ask.offsetWidth; ask.classList.add("playback-nudge"); };
/** Answer buttons in the ask row; a wrong pick is marked and the rule printed under them. */
function askButtons(ask, q, opts, onPick, feedback) {
  const btns = opts.map(([v, lab]) => {
    const b = el("button", "viz-btn" + (v === q.wrong ? " playback-wrong" : ""), lab);
    b.type = "button";
    b.addEventListener("click", (e) => onPick(v, e));
    ask.append(b);
    return b;
  });
  if (q.wrong != null && feedback) ask.append(el("span", "playback-feedback", feedback));
  if (q.refocus) { q.refocus = false; (btns.find((b) => !b.classList.contains("playback-wrong")) || btns[0]).focus(); }
}

// ---------- widget: crc-play ----------
// The slide-38 division one quotient bit per step, then a final step for the remainder (or syndrome).
function crcPlay(box, cfg) {
  const presets = presetsOf(cfg, CRC_PRESETS), names = Object.keys(presets);
  const init = (c) => ({
    dataword: c.dataword != null ? String(c.dataword) : "1001",
    divisor: c.divisor != null ? String(c.divisor) : "1011",
    mode: c.mode === "decode" ? "decode" : "encode",
    received: c.received != null ? String(c.received) : "1000110",
  });
  let st = init({ ...cfg, ...(startPreset(cfg, presets) || {}) });
  let D = null, pb = null, err = "";
  const q = playQuiz(() => pb, () => frame(pb.pos()));
  q.on = !!cfg.predict;

  box.append(el("h4", null, cfg.title || "CRC division, one quotient bit at a time"));
  const presetCh = choice(names, -1, (i) => { st = init(presets[names[i]]); sync(); restart(); });
  const modeCh = choice(["Encode (sender)", "Decode (receiver)"], st.mode === "decode" ? 1 : 0, (i) => { st.mode = i ? "decode" : "encode"; sync(); restart(); });
  const dF = textField("dataword", st.dataword, 170), vF = textField("divisor", st.divisor, 120), rF = textField("received", st.received, 200);
  dF.on(() => { st.dataword = dF.get(); restart(); });
  vF.on(() => { st.divisor = vF.get(); restart(); });
  rF.on(() => { st.received = rF.get(); restart(); });
  const pred = predictToggle("Predict each quotient bit and the remainder", q.on, (v) => {
    q.on = v; pb.pause(); q.reset();
    for (let i = 0; i < Math.ceil(pb.pos() - 1e-9); i++) q.done.add(i);
    pb.set(pb.pos());
  });
  const view = el("div", "net6-scroll");
  const out = el("div");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  box.append(presetCh.row, modeCh.row, dF.row, vF.row, rF.row, pred.row, view, out, caption, ask);
  function sync() {
    modeCh.set(st.mode === "decode" ? 1 : 0);
    dF.set(st.dataword); vF.set(st.divisor); rF.set(st.received);
    dF.row.style.display = st.mode === "encode" ? "" : "none";
    rF.row.style.display = st.mode === "decode" ? "" : "none";
  }
  function compute() {
    const enc = st.mode === "encode", dv = st.divisor;
    err = "";
    if (!/^1[01]{1,8}$/.test(dv)) err = "Divisor: 2 to 9 bits (0s and 1s) with a leading 1.";
    else if (enc && !/^[01]{1,16}$/.test(st.dataword)) err = "Dataword: 1 to 16 bits (0s and 1s only).";
    else if (!enc && (!BITS.test(st.received) || st.received.length < dv.length || st.received.length > 25)) err = `Received word: bits only, at least as long as the divisor (${dv.length} bits) and at most 25 bits.`;
    if (err) { D = null; return; }
    const nk = dv.length - 1, dividend = enc ? st.dataword + "0".repeat(nk) : st.received;
    D = { enc, dv, nk, dividend, r: crcDivide(dividend, dv), data: enc ? st.dataword : st.received.slice(0, st.received.length - nk) };
  }
  const count = () => (D ? D.r.steps.length + 1 : 1);
  const asking = (pos) => {
    if (!q.on || !D) return -1;
    const b = q.block(count(), () => true);
    return b < count() && Math.abs(pos - b) < 1e-6 ? b : -1;
  };
  function stepCaption(i) {
    const { dv, r } = D, n = dv.length, zeros = "0".repeat(n), s = r.steps[i], next = r.steps[i + 1];
    const by = s.useDivisor ? dv : zeros;
    const head = s.useDivisor ? `Step ${i + 1}: leftmost bit 1, so use the divisor ${dv}.` : `Step ${i + 1}: leftmost bit 0: use ${zeros}.`;
    if (!next) return `${head} ${s.window} ⊕ ${by} = ${s.xor}; no bits left to bring down. Quotient ${r.quotient}.`;
    const down = next.window[n - 1];
    return s.useDivisor ? `${head} ${s.window} ⊕ ${by} = ${s.xor}; drop the leading 0 and bring down ${down} → ${next.window}.` : `${head} ${s.window} ⊕ ${by} = ${s.xor} → bring down ${down} → ${next.window}.`;
  }
  function finalCaption() {
    const { enc, r, data } = D;
    if (enc) return `Remainder ${r.remainder}: codeword ${data} ${r.remainder}.`;
    const zero = !/1/.test(r.remainder);
    return `Syndrome ${r.remainder}: ${zero ? `Zero → dataword ${data} accepted.` : "Non-zero → dataword discarded."}`;
  }
  function divisionRows(pos, hot) {
    const { dv, dividend, r, enc } = D, n = dv.length, L = dividend.length, base = n + 1, cols = base + L, S = r.steps.length, zeros = "0".repeat(n);
    const f = (k) => clamp01(pos - k);
    const wrap = el("div", "net6-div");
    const drow = (items, tag) => {
      const row = el("div", "net6-drow");
      for (let c = 0; c < cols; c++) { const it = items[c]; row.append(el("span", "net6-slot" + (it && it.cls ? " " + it.cls : ""), it ? it.t : "")); }
      if (tag) row.append(el("span", "net6-tag", tag));
      return row;
    };
    const place = (bits, at, cls) => { const o = {}; [...bits].forEach((b, i) => { o[at + i] = { t: b, cls: typeof cls === "function" ? cls(i) : cls }; }); return o; };
    const winCls = (k) => (j) => (k === hot && k < S ? (j === 0 ? "win lead" : "win") : "");
    // quotient: bit k appears once step k starts
    const qo = {};
    for (let k = 0; k < S; k++) if (f(k) > 0) qo[base + n - 1 + k] = { t: r.quotient[k], cls: "q" + (k === hot ? " qhot" : "") };
    wrap.append(drow(qo, "Quotient"));
    const head = { ...place(dv, 0, "b"), [n]: { t: ")", cls: "paren" } };
    [...dividend].forEach((b, j) => { head[base + j] = { t: b, cls: "bar" + (enc && j >= L - (n - 1) ? " y" : "") + (j < n && hot === 0 && S > 0 ? " win" + (j === 0 ? " lead" : "") : "") }; });
    wrap.append(drow(head, enc ? "Dividend = dataword + zeros" : "Dividend = received codeword"));
    for (let k = 0; k < S; k++) {
      const s = r.steps[k];
      if (k > 0) {
        if (f(k - 1) < 0.66) break;
        wrap.append(drow(place(s.window, base + k, (j) => [j === n - 1 ? "down" : "", winCls(k)(j)].filter(Boolean).join(" ")), `bring down ${s.window[n - 1]}`));
      }
      if (f(k) < 0.33) break;
      wrap.append(drow(place(s.useDivisor ? dv : zeros, base + k, "b ul"), s.useDivisor ? `leftmost bit 1: use the divisor ${dv}` : `Leftmost bit 0: use ${zeros} divisor`));
    }
    if (f(S) >= 0.5) wrap.append(drow(place(r.remainder, base + S, "y"), enc ? "Remainder" : "Syndrome"));
    return wrap;
  }
  function renderAsk(pos, qi) {
    const key = qi >= 0 ? `${qi}|${qi < count() - 1 ? q.wrong : ""}` : "";
    if (key === q.key) return;
    q.key = key; ask.innerHTML = ""; ask.hidden = !q.on;
    if (qi < 0) return;
    const S = D.r.steps.length;
    if (qi < S) {
      askButtons(ask, q, [["1", `1 (XOR the divisor ${D.dv})`], ["0", `0 (XOR ${"0".repeat(D.dv.length)})`]],
        (v, e) => q.answer(qi, v === (D.r.steps[qi].useDivisor ? "1" : "0"), v, e),
        "Look only at the leftmost bit of the window: 1 → divisor, 0 → 0000.");
      return;
    }
    const bi = bitInputs(D.nk, D.enc ? "remainder" : "syndrome");
    const msg = el("span", "playback-feedback");
    const check = button("Check", (e) => {
      const g = bi.get(); let ok = true;
      for (let i = 0; i < D.nk; i++) { const good = g[i] === D.r.remainder[i]; bi.mark(i, good); if (!good) ok = false; }
      if (!ok) msg.textContent = `Not yet: wrong bits are red. Do the last XOR, then drop its leading bit: the ${D.enc ? "remainder" : "syndrome"} is the last n − k = ${D.nk} bits.`;
      q.answer(qi, ok, "x", e);
    });
    ask.append(el("span", "net6-msg", `Type the ${D.enc ? "remainder" : "syndrome"} (${D.nk} bits):`), bi.row, check, msg);
  }
  function frame(pos) {
    view.innerHTML = ""; out.innerHTML = "";
    if (!D) { caption.textContent = err; ask.innerHTML = ""; q.key = null; return; }
    const N = count(), S = N - 1, qi = asking(pos), drawn = Math.ceil(pos - 1e-9) - 1, hot = qi >= 0 ? qi : drawn;
    view.append(divisionRows(pos, hot));
    if (pos - S >= 0.5) {
      if (D.enc) out.append(line("Codeword = dataword + remainder", bitCells(D.data + D.r.remainder, (i) => (i < D.data.length ? "dw" : "y"))));
      else { const zero = !/1/.test(D.r.remainder); out.append(verdict(zero ? "ok" : "bad", zero ? `Syndrome ${D.r.remainder}: Zero → dataword ${D.data} accepted.` : `Syndrome ${D.r.remainder}: Non-zero → dataword discarded.`)); }
    }
    let text;
    if (qi >= 0) text = qi < S ? `Step ${qi + 1}: the window is ${D.r.steps[qi].window}. Quotient bit: 1 (XOR the divisor) or 0 (XOR ${"0".repeat(D.dv.length)})?` : `Last step: what is the ${D.enc ? "remainder" : "syndrome"}?`;
    else if (drawn < 0) text = D.enc ? `Dividend = dataword ${D.data} + ${D.nk} zeros = ${D.dividend}. Press Play to divide by ${D.dv} one quotient bit at a time.` : `Dividend = received codeword ${D.dividend}. Press Play to divide by ${D.dv} one quotient bit at a time.`;
    else if (drawn < S) text = stepCaption(drawn);
    else text = finalCaption() + (pos >= N ? q.tally() : "");
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(pos, qi);
  }
  function restart() { compute(); q.reset(); pb.reset(count()); }
  compute();
  pb = createPlayback({ count: count(), unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 1600,
    limit: () => (q.on && D ? q.block(count(), () => true) : count()), onBlocked: nudge(ask) });
  box.append(pb.el, el("p", "widget-note", "Each step: the leftmost bit of the window picks the divisor (1) or 0000 (0); XOR, drop the leading 0, bring down the next bit. Multiply: AND, Subtract: XOR."));
  sync();
  restart();
}

// ---------- widget: stuff-play ----------
// The sender's pass one bit (byte) per step, the frame crossing between the flags, then the receiver's pass.
function stuffPlay(box, cfg) {
  const presets = presetsOf(cfg, STUFF_PRESETS), names = Object.keys(presets);
  const init = (c) => {
    const mode = c.mode === "byte" ? "byte" : "bit";
    return { mode, data: c.data != null ? (Array.isArray(c.data) ? c.data.join(" ") : String(c.data)) : DEFAULT_DATA[mode] };
  };
  const unstuff = cfg.unstuff !== false;
  let st = init({ ...cfg, ...(startPreset(cfg, presets) || {}) });
  let P = null, pb = null, err = "";
  const q = playQuiz(() => pb, () => frame(pb.pos()));
  q.on = !!cfg.predict;

  box.append(el("h4", null, cfg.title || (st.mode === "byte" ? "Byte stuffing, one byte at a time" : "Bit stuffing: the sender's counter of 1s")));
  const presetCh = choice(names, -1, (i) => { st = init(presets[names[i]]); sync(); restart(); });
  const modeCh = choice(["Bit stuffing", "Byte stuffing"], st.mode === "byte" ? 1 : 0, (i) => { st.mode = i ? "byte" : "bit"; st.data = DEFAULT_DATA[st.mode]; sync(); restart(); });
  const dF = textField("data", st.data, 300);
  dF.on(() => { st.data = dF.get(); restart(); });
  const pred = predictToggle("Predict each step before it is drawn", q.on, (v) => {
    q.on = v; pb.pause(); q.reset();
    for (let i = 0; i < Math.ceil(pb.pos() - 1e-9); i++) q.done.add(i);
    pb.set(pb.pos());
  });
  const view = el("div");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  box.append(presetCh.row, modeCh.row, dF.row, pred.row, view, caption, ask);
  function sync() { modeCh.set(st.mode === "byte" ? 1 : 0); dF.set(st.data); }
  function compute() {
    err = "";
    const bit = st.mode === "bit";
    let data;
    if (bit) { data = st.data.replace(/\s+/g, ""); if (!/^[01]{1,64}$/.test(data)) err = "Bit mode: 1 to 64 bits, 0s and 1s only."; }
    else { data = toTokens(st.data); if (!data.length || data.length > 24) err = "Byte mode: 1 to 24 bytes separated by spaces; FLAG and ESC are the special bytes, anything else is data."; }
    if (err) { P = null; return; }
    const S = stuffSteps(st.mode, data, false), R = unstuff ? stuffSteps(st.mode, data, true) : [];
    const sent = bit ? stuffBits(data) : stuffBytes(data);
    // data index of each sender step (an inserted ESC belongs to the byte after it; a stuffed 0 to the bit before it)
    const dIdx = [];
    let k = -1;
    S.forEach((s, j) => { if (bit) { if (!s.insert) k++; dIdx.push(k); } else { if (!s.insert && !(j > 0 && S[j - 1].insert)) k++; if (s.insert) k++; dIdx.push(k); } });
    P = { bit, data, S, R, sent, dIdx, extra: S.filter((s) => s.insert).length };
  }
  const count = () => (P ? P.S.length + (unstuff ? 1 + P.R.length : 0) : 1);
  const needs = (i) => {
    if (!P || i >= P.S.length) return false;
    const s = P.S[i];
    if (P.bit) return !s.insert && P.data[P.dIdx[i]] === "1";
    return s.insert || i === 0 || !P.S[i - 1].insert;
  };
  const answerOf = (i) => (P.bit ? !!(P.S[i + 1] && P.S[i + 1].insert) : P.S[i].insert);
  const asking = (pos) => {
    if (!q.on || !P) return -1;
    const b = q.block(count(), needs);
    return b < count() && Math.abs(pos - b) < 1e-6 ? b : -1;
  };
  const unitName = () => (P.bit ? "bits" : "bytes");
  function capSender(i) {
    const s = P.S[i], d = P.dIdx[i];
    if (P.bit) {
      if (s.insert) return "Five 1s after a 0: stuff a 0 so 01111110 cannot appear in the data. The counter resets to 0.";
      const b = P.data[d];
      if (b === "0") return `Bit ${d + 1} is 0: copied; the counter of consecutive 1s resets to 0.`;
      return s.count === 5 ? `Bit ${d + 1} is 1: five consecutive 1s after a 0. A 0 goes in next.` : `Bit ${d + 1} is 1: copied; ${s.count} consecutive ${s.count === 1 ? "1" : "1s"}.`;
    }
    const t = P.data[d];
    if (s.insert) return `Byte ${d + 1} is ${t === "FLAG" ? "a Flag" : "an ESC"}: an ESC is inserted before it (orange), so the receiver treats the byte as data, not as a delimiting flag.`;
    return isSpecial(t) ? `Byte ${d + 1}, the ${tokText(t)}, is copied after its ESC.` : `Byte ${d + 1} is "${t}": a data byte, copied as is.`;
  }
  function capReceiver(j) {
    const s = P.R[j], i = s.index;
    if (P.bit) {
      if (s.insert) return `Received bit ${i + 1} is a 0 after five 1s: the receiver removes it (a stuffed bit) and resets the counter.`;
      const b = P.sent[i];
      return b === "0" ? `Received bit ${i + 1} is 0: kept; the counter resets to 0.` : `Received bit ${i + 1} is 1: kept; ${s.count} consecutive ${s.count === 1 ? "1" : "1s"}.`;
    }
    const t = P.sent[i];
    if (s.insert) return `Received byte ${i + 1} is an ESC: the receiver removes it and keeps the next byte as data.`;
    return j > 0 && P.R[j - 1].insert ? `Received byte ${i + 1}, ${tokText(t)}, follows an ESC: kept as data, not as a flag.` : `Received byte ${i + 1}, "${tokText(t)}": data, kept.`;
  }
  function finalText() {
    const n = P.data.length, m = P.sent.length, u = unitName();
    if (!unstuff) return `Sender done: ${n} → ${m} ${u}, ${P.extra} extra ${P.extra === 1 ? u.slice(0, -1) : u}.`;
    return `Receiver done: the ${m}-${u.slice(0, -1)} field gives the ${n} ${u} sent: ${P.extra} ${P.bit ? "stuffed 0" : "ESC byte"}${P.extra === 1 ? "" : "s"} removed.`;
  }
  function cols(cells, counts, cls, cur) {
    const row = el("div", "net6-cols");
    cells.forEach((c, i) => {
      const col = el("span", "net6-col");
      const extra = cls(i);
      col.append(el("span", "net6-b sm" + (P.bit ? "" : " tok") + (c === "FLAG" ? " flag" : "") + (i === cur ? " cur" : "") + (extra ? " " + extra : ""), P.bit ? c : tokText(c)));
      if (counts) col.append(el("span", "net6-b sm cnt" + (counts[i] === 5 ? " hot" : ""), counts[i] == null ? "" : String(counts[i])));
      row.append(col);
    });
    return row;
  }
  function renderAsk(qi) {
    const key = qi >= 0 ? `${qi}|${q.wrong}` : "";
    if (key === q.key) return;
    q.key = key; ask.innerHTML = ""; ask.hidden = !q.on;
    if (qi < 0) return;
    const right = answerOf(qi);
    askButtons(ask, q, [[true, P.bit ? "Yes, stuff a 0 after it" : "Yes, insert ESC"], [false, "No"]], (v, e) => q.answer(qi, v === right, v, e),
      P.bit ? "Rule: whenever five consecutive 1s follow a 0 in the data, add one extra 0; count the 1s since the last 0, including this one."
        : "Rule: an ESC is added whenever there is a flag or ESC in the text; any other byte is data and is copied as is.");
  }
  function frame(pos) {
    view.innerHTML = "";
    if (!P) { caption.textContent = err; ask.innerHTML = ""; q.key = null; return; }
    const N = count(), nS = P.S.length, qi = asking(pos), drawn = Math.ceil(pos - 1e-9) - 1, hot = qi >= 0 ? qi : drawn;
    const sDone = Math.max(0, Math.min(nS, drawn + 1));
    const curD = hot >= 0 && hot < nS ? P.dIdx[hot] : -1;
    const dataArr = P.bit ? [...P.data] : P.data;
    // counts under each data bit, once its step is drawn
    let counts = null;
    if (P.bit) { counts = dataArr.map(() => null); P.S.slice(0, sDone).forEach((s, j) => { if (!s.insert) counts[P.dIdx[j]] = s.count; }); }
    const doneD = new Set(P.S.slice(0, sDone).map((_, j) => P.dIdx[j]));
    view.append(line(`Data from upper layer (${P.data.length} ${unitName()})`, null),
      cols(dataArr, counts, (i) => (doneD.has(i) ? "" : "dim"), curD));
    if (P.bit) view.append(el("p", "net6-msg", "Under each bit: consecutive 1s after a 0 (5 → stuff)."));
    const outArr = P.bit ? [...P.sent].slice(0, sDone) : P.sent.slice(0, sDone);
    const ins = new Set(P.S.slice(0, sDone).filter((s) => s.insert).map((s) => s.index));
    const mk = (arr, insSet) => (P.bit ? bitCells(arr.join(""), (i) => (insSet.has(i) ? "bad" : "dw"), { sm: true }) : byteCells(arr, (i) => (insSet.has(i) ? "esc" : "")));
    view.append(line(`Stuffed data (${outArr.length} ${unitName()})`, outArr.length ? mk(outArr, ins) : el("span", "net6-msg", "—")));
    if (unstuff && drawn >= nS) {
      const allIns = new Set(P.S.filter((s) => s.insert).map((s) => s.index));
      view.append(line("Frame on the link", null), frameView(P.bit ? "bit" : "byte", mk(P.bit ? [...P.sent] : P.sent, allIns)));
    }
    if (unstuff && drawn > nS) {
      const rDone = Math.min(P.R.length, drawn - nS);
      const rec = P.bit ? [...P.sent] : P.sent;
      const rHot = hot - nS - 1, curR = rHot >= 0 && rHot < P.R.length ? P.R[rHot].index : -1;
      const seen = new Set(), removed = new Set();
      let rc = P.bit ? rec.map(() => null) : null;
      const kept = [];
      P.R.slice(0, rDone).forEach((s) => { seen.add(s.index); if (s.insert) removed.add(s.index); else kept.push(rec[s.index]); if (rc) rc[s.index] = s.count; });
      view.append(line(`Received data field (${rec.length} ${unitName()})`, null),
        cols(rec, rc, (i) => (removed.has(i) ? (P.bit ? "bad gone" : "esc gone") : seen.has(i) ? "" : "dim"), curR));
      view.append(line(`Data to upper layer (${kept.length} ${unitName()})`, kept.length ? (P.bit ? bitCells(kept.join(""), null, { sm: true }) : byteCells(kept)) : el("span", "net6-msg", "—")));
    }
    let text;
    if (qi >= 0) {
      const d = P.dIdx[qi], t = dataArr[d];
      text = P.bit ? `Bit ${d + 1} is 1; the counter of consecutive 1s stands at ${P.S[qi].count - 1}. Insert a 0 after this bit?` : `Byte ${d + 1} is ${t === "FLAG" ? "a Flag" : t === "ESC" ? "an ESC" : `"${t}"`}. Insert ESC before this byte?`;
    } else if (drawn < 0) text = P.bit ? "The sender scans the data bit by bit, counting consecutive 1s after a 0. Press Play." : "The sender scans the data byte by byte, looking for Flag and ESC bytes. Press Play.";
    else if (drawn < nS) text = drawn === nS - 1 && !unstuff ? `${capSender(drawn)} ${finalText()}` : capSender(drawn);
    else if (drawn === nS) text = `The frame crosses the link between the flags: ${P.bit ? "01111110" : "Flag"} | Header | ${P.sent.length} ${unitName()} of stuffed data | Trailer | ${P.bit ? "01111110" : "Flag"}. The receiver now scans the data field.`;
    else text = drawn === N - 1 ? `${capReceiver(drawn - nS - 1)} ${finalText()}` : capReceiver(drawn - nS - 1);
    if (pos >= N) text += q.tally();
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(qi);
  }
  function restart() { compute(); q.reset(); pb.reset(count()); }
  compute();
  pb = createPlayback({ count: count(), unit: "step", onFrame: frame, stepMs: () => cfg.stepMs || 900,
    limit: () => (q.on && P ? q.block(count(), needs) : count()), onBlocked: nudge(ask) });
  box.append(pb.el, el("p", "widget-note", st.mode === "byte" ? "Rule: an ESC is added whenever there is a flag or ESC in the text; the receiver removes each ESC and treats the next character as data." : "Rule: whenever five consecutive 1s follow a 0 in the data, add one extra 0 so the receiver does not mistake 01111110 for a flag; the receiver removes the 0 after any five 1s."));
  sync();
  restart();
}

// ---------- widget: stop-wait-play ----------
// The slide-35 (or slide-32) flow diagram, one event per step, with the sender's and receiver's FSM states.
const SW_X = { sn: 36, sd: 160, rd: 320, rn: 444, mid: 240 };
const SW_LABELS = { all: "All three (slide 35)", normal: "Normal", "frame-lost": "Frame lost", "ack-lost": "ACK lost", "frame-corrupted": "Frame corrupted", "ack-corrupted": "ACK corrupted" };
const SW_NEXT = [["send", "Send the next frame"], ["resend", "Time-out: resend the saved frame"], ["deliver", "Deliver the packet and send ACK"], ["discard-frame", "Discard the frame"], ["discard-ack", "Discard the ACK"]];
const SW_NEXT_SIMPLE = [["send", "Send the frame"], ["deliver", "Deliver the packet to the network layer"], ["discard-frame", "Discard the frame"]];
function swClock(x, y, kind) {
  const g = svgEl("g");
  const fill = kind === "start" ? "#1f4e9c" : kind === "stop" ? "var(--ink)" : "var(--blue)";
  const hand = kind === "stop" ? "var(--paper)" : kind === "start" ? "var(--ink)" : "var(--paper)";
  g.append(svgEl("circle", { cx: x, cy: y, r: 7, fill, stroke: "var(--blue)", "stroke-width": 1.4 }),
    svgEl("line", { x1: x, y1: y, x2: x, y2: y - 4.5, stroke: hand, "stroke-width": 1.4 }),
    svgEl("line", { x1: x, y1: y, x2: x + 3.5, y2: y, stroke: hand, "stroke-width": 1.4 }));
  return g;
}
function stopWaitPlay(box, cfg) {
  let protocol = cfg.protocol === "simple" ? "simple" : "stop-and-wait";
  let scenario = SW_SCENARIOS.includes(cfg.scenario) ? cfg.scenario : "all";
  let seq = !!cfg.seq;
  let E = [], pb = null;
  const q = playQuiz(() => pb, () => frame(pb.pos()));
  q.on = !!cfg.predict;

  box.append(el("h4", null, cfg.title || "Flow diagram: frames, ACKs and the timer"));
  const protoCh = choice(["Simple (slide 32)", "Stop-and-Wait (slide 35)"], protocol === "simple" ? 0 : 1, (i) => { protocol = i ? "stop-and-wait" : "simple"; sync(); restart(); });
  const scenKeys = SW_SCENARIOS;
  const scenCh = choice(scenKeys.map((k) => SW_LABELS[k]), scenKeys.indexOf(scenario), (i) => { scenario = scenKeys[i]; restart(); });
  const seqBox = checkbox("Sequence numbers (slide 36): Frame 0, 1 and ACK 1, 0", seq, (v) => { seq = v; restart(); });
  const pred = predictToggle("Predict each action before it is drawn", q.on, (v) => {
    q.on = v; pb.pause(); q.reset();
    for (let i = 0; i < Math.ceil(pb.pos() - 1e-9); i++) q.done.add(i);
    pb.set(pb.pos());
  });
  const badges = el("div", "net6-badges");
  const svg = svgEl("svg", { viewBox: "0 0 480 300", class: "curve-svg net-svg", style: "max-width: 560px" });
  const legend = el("div", "net6-legend");
  const caption = el("p", "playback-caption");
  caption.setAttribute("aria-live", "polite");
  const ask = el("div", "viz-btn-row playback-ask");
  box.append(protoCh.row, scenCh.row, seqBox.row, pred.row, badges, svg, legend, caption, ask);
  function sync() {
    protoCh.set(protocol === "simple" ? 0 : 1);
    const sw = protocol !== "simple";
    seqBox.row.style.display = sw ? "" : "none";
    legend.style.display = sw ? "" : "none";
  }
  // legend: the slide's three clocks
  for (const [kind, text] of [["start", "Start the timer."], ["stop", "Stop the timer."], ["restart", "Restart a time-out timer."]]) {
    const item = el("span", "net6-legend-item");
    const ic = svgEl("svg", { viewBox: "0 0 18 18", width: 16, height: 16 });
    ic.append(swClock(9, 9, kind));
    item.append(ic, document.createTextNode(text));
    legend.append(item);
  }
  const needs = (i) => !!E[i] && !!E[i].ask && (E[i].ask !== "ack" || seq);
  const asking = (pos) => {
    if (!q.on) return -1;
    const b = q.block(E.length, needs);
    return b < E.length && Math.abs(pos - b) < 1e-6 ? b : -1;
  };
  const sim = () => protocol === "simple";
  function renderAsk(qi) {
    const key = qi >= 0 ? `${qi}|${q.wrong}` : "";
    if (key === q.key) return;
    q.key = key; ask.innerHTML = ""; ask.hidden = !q.on;
    if (qi < 0) return;
    const e = E[qi];
    if (e.ask === "ack") {
      askButtons(ask, q, [[0, "ACK 0"], [1, "ACK 1"]], (v, ev) => q.answer(qi, v === e.answer, v, ev), `${e.rule} The receiver now expects Frame ${e.answer}.`);
      return;
    }
    askButtons(ask, q, sim() ? SW_NEXT_SIMPLE : SW_NEXT, (v, ev) => q.answer(qi, v === e.ask, v, ev), e.rule);
  }
  function summary() {
    const del = E.filter((e) => e.kind === "deliver").length, pk = E.filter((e) => e.kind === "packet").length;
    const dup = E.find((e) => e.dup);
    let s = `Done: ${pk} ${pk === 1 ? "packet" : "packets"} sent, ${del} ${del === 1 ? "delivery" : "deliveries"} to the network layer.`;
    if (dup) s += ` Packet ${dup.delivered} was delivered twice: Duplicate.`;
    else if (seq && E.some((e) => e.kind === "seqcopy")) s += " Each packet was delivered once: the sequence numbers caught the resent frame.";
    else if (sim() && E.some((e) => e.lost)) s += " The lost packet was never delivered: no error control.";
    return s;
  }
  function frame(pos) {
    const qi = asking(pos), drawn = Math.ceil(pos - 1e-9) - 1, hot = qi >= 0 ? -1 : drawn;
    const U = 21, TOP = 52;
    const maxT = Math.max(1, ...E.flatMap((e) => e.draw.map((d) => (d.type === "arrow" ? d.t2 : d.t + 0.4))));
    const H = TOP + maxT * U + 40, y = (t) => TOP + t * U;
    svg.setAttribute("viewBox", `0 0 480 ${H.toFixed(0)}`);
    svg.innerHTML = "";
    const X = SW_X;
    // headers and time lines
    svg.append(svgEl("text", { x: (X.sn + X.sd) / 2, y: 14, "text-anchor": "middle", "font-size": 13, fill: "var(--ink-2)" }, "Sending node"),
      svgEl("text", { x: (X.rd + X.rn) / 2, y: 14, "text-anchor": "middle", "font-size": 13, fill: "var(--ink-2)" }, "Receiving node"));
    for (const [k, lab] of [["sn", "Network"], ["sd", "Data-link"], ["rd", "Data-link"], ["rn", "Network"]]) {
      svg.append(svgEl("text", { x: X[k], y: 32, "text-anchor": "middle", "font-size": 12, fill: "var(--ink-dim)" }, lab));
      svg.append(svgEl("line", { x1: X[k], y1: 40, x2: X[k], y2: H - 22, stroke: "var(--rule-strong)", "stroke-dasharray": "4 4" }));
      svg.append(svgEl("text", { x: X[k], y: H - 8, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, "Time ↓"));
    }
    E.forEach((e, i) => {
      if (i > drawn) return;
      const f = i === drawn ? clamp01(pos - i) || 1 : 1, isHot = i === hot;
      for (const d of e.draw) {
        if (d.type === "arrow") {
          const x1 = X[d.a], y1 = y(d.t1), x2f = X[d.b], y2f = y(d.t2);
          const reach = (d.half ? 0.5 : 1) * f;
          const x2 = x1 + (x2f - x1) * reach, y2 = y1 + (y2f - y1) * reach;
          const color = d.bad ? "var(--red)" : d.style === "packet" ? "var(--blue)" : d.style === "ack" ? "var(--green)" : "var(--ink)";
          svg.append(svgEl("line", { x1, y1, x2, y2, stroke: color, "stroke-width": isHot ? 2.8 : 1.8, "stroke-dasharray": d.style === "packet" ? "5 3" : "none" }));
          if (reach >= 1 - 1e-9) {
            const ang = Math.atan2(y2 - y1, x2 - x1), a1 = ang + 2.7, a2 = ang - 2.7;
            svg.append(svgEl("polygon", { points: `${x2},${y2} ${x2 + 8 * Math.cos(a1)},${y2 + 8 * Math.sin(a1)} ${x2 + 8 * Math.cos(a2)},${y2 + 8 * Math.sin(a2)}`, fill: color }));
          }
          // Labels sit on the free side of a slanted arrow: above-right of a frame (it descends to the right), above-left of an ACK.
          const at = d.half ? 0.2 : 0.45, rightward = x2f > x1;
          const lx = d.style === "packet" ? (x1 + x2f) / 2 : x1 + (x2f - x1) * at + (rightward ? 4 : -4), ly = d.style === "packet" ? Math.min(y1, y2f) - 4 : y1 + (y2f - y1) * at - 6;
          const anchor = d.style === "packet" ? "middle" : rightward ? "start" : "end";
          if (f > 0.3) svg.append(svgEl("text", { x: lx, y: ly, "text-anchor": anchor, "font-size": 12.5, fill: isHot ? "var(--hl)" : color, "font-weight": isHot ? "700" : "400" }, d.label));
        } else if (d.type === "timer") svg.append(swClock(X.sd - 16, y(d.t), d.kind));
        else if (d.type === "mark") {
          const anchor = d.side === "right" ? "start" : d.side === "left" ? "end" : "middle", dx = d.side === "right" ? 8 : d.side === "left" ? -8 : 0;
          svg.append(svgEl("text", { x: X[d.x] + dx, y: y(d.t) + 4 + (d.dy || 0), "text-anchor": anchor, "font-size": 12.5, "font-weight": "700", fill: isHot ? "var(--hl)" : d.color }, d.text));
        }
      }
    });
    if (sim() && drawn >= E.length - 1) svg.append(svgEl("text", { x: 240, y: H - 26, "text-anchor": "middle", "font-size": 14, fill: "var(--ink-dim)" }, "• • •"));
    // FSM badges
    const sState = drawn >= 0 && E[drawn] ? E[drawn].sender : "Ready";
    badges.innerHTML = "";
    const pill = (text, on) => el("span", "net6-pill" + (on ? " on" : ""), text);
    const sb = el("span", "net6-badge"); sb.append(el("span", "lab", "Sender"), pill("Ready", sState === "Ready"));
    if (!sim()) sb.append(pill("Blocking", sState === "Blocking"));
    const rb = el("span", "net6-badge"); rb.append(el("span", "lab", "Receiver"), pill("Ready", true));
    badges.append(sb, rb);
    let text;
    if (qi >= 0) text = E[qi].ask === "ack" ? "Which acknowledgment number?" : `What happens next? (${E[qi].who === "sender" ? "the sender acts" : "the receiver acts"})`;
    else if (drawn < 0) text = sim() ? "Simple protocol (slide 32): no flow or error control. Press Play." : "Stop-and-Wait (slide 35): one frame at a time, a timer, and an ACK for each error-free frame. Press Play.";
    else {
      text = E[drawn].text;
      if (pos >= E.length) text += " " + summary() + q.tally();
    }
    if (caption.textContent !== text) caption.textContent = text;
    renderAsk(qi);
  }
  function restart() { E = swScript(protocol, scenario, seq); q.reset(); pb.reset(E.length); }
  E = swScript(protocol, scenario, seq);
  pb = createPlayback({ count: E.length, unit: "event", onFrame: frame, stepMs: () => cfg.stepMs || 1500,
    limit: () => (q.on ? q.block(E.length, needs) : E.length), onBlocked: nudge(ask) });
  box.append(pb.el, el("p", "widget-note", "A lost frame means either lost or corrupted. A lost ACK means either lost or corrupted."));
  sync();
  restart();
}

export const WIDGETS = {
  "codeword-lab": codewordLab,
  "crc-calc": crcCalc,
  "checksum-calc": checksumCalc,
  "stuffing": stuffing,
  "crc-play": crcPlay,
  "stuff-play": stuffPlay,
  "stop-wait-play": stopWaitPlay,
};
