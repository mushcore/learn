// Interactive data-communications widgets for COMP 3721 Week 7 (Lectures 07a, 07b and the 07c note):
// error detection and correction (block codes, Hamming distance, parity, CRC division, checksum, FEC)
// and data-link control (byte and bit stuffing, Simple and Stop-and-Wait). No top-level DOM access, so
// Bun can import the pure functions for tests.
import { el } from "./dom.js";

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

export const WIDGETS = {
  "codeword-lab": codewordLab,
  "crc-calc": crcCalc,
  "checksum-calc": checksumCalc,
  "stuffing": stuffing,
};
