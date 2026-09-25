// Algorithm-analysis widgets (COMP 3760, Lecture 1): per-line execution counter for the slide and
// quiz pseudocode, a double-loop iteration grid, a growth-rate plot with Table 2.1, a big-O / Ω / Θ
// checker, and the fib vs fib2 call-count race.
import { el, esc, slider, btnRow, fmtNum } from "./dom.js";
import { highlight } from "./highlight.js";
import { inline } from "./markdown.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmtInt = (v) => Number.isFinite(v) ? Math.round(v).toLocaleString("en-US") : "—";
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
function mathP(cls, md) { const p = el("p", cls); p.innerHTML = inline(md); return p; }
const log2 = Math.log2;

// =====================================================================
// op-counter: every slide / quiz algorithm as a preset. Each preset is simulated in JS with a
// counter per line, so the numbers are exact for whatever n the student picks. Structural lines
// (headers, endfor, END) show "–".
// =====================================================================
const NONE = null;
function mk(name, opts) { return { name, ...opts }; }

const PRESETS = [
  mk("find (largest element)", {
    lines: ["Algo: find( A[0…n-1] )", "   m ← A[0]", "   for i ← 1 to n-1 do", "      if A[i] > m", "         m ← A[i]", "   return m"],
    basic: 4, nMax: 100000, nMin: 1,
    formula: "C(n) = n − 1", total: "f(n) = 1 + 3(n − 1) + 1 = 3n − 1",
    what: "Returns the largest element of A. Slide 13.",
    why: "Line 4, the comparison **A[i] > m**, runs once per pass of the loop: n − 1 times. Lines 3 and 5 tie with it numerically (the slide counts line 5 as n − 1, as for an ascending array), and the comparison wins the tie-break: it is the *key comparison*, the thing actually being checked, and data comparisons are counted as more expensive than assignments.",
    run(n) {
      const c = [NONE, 0, 0, 0, 0, 0];
      c[1] = 1;
      for (let i = 1; i <= n - 1; i++) { c[2]++; c[3]++; c[4]++; }
      c[5] = 1;
      return c;
    },
  }),
  mk("Mystery1 (sum of squares)", {
    lines: ["Mystery1(n)  // n > 0", " S ← 0", " for i ← 1 to n do", "     S ← S + i * i", " return S"],
    basic: 4, nMax: 100000, nMin: 1,
    formula: "C(n) = Σ_{i=1}^{n} 1 = n",
    what: "Calculates 1² + 2² + 3² + … + n². Slide 29.",
    why: "Line 4 is inside the only loop, so it runs once per iteration: 1 + 1 + … + 1 (n times) = **n**. It is also the most expensive line (a multiplication and an addition).",
    run(n) {
      const c = [NONE, 1, 0, 0, 1];
      for (let i = 1; i <= n; i++) { c[2]++; c[3]++; }
      return c;
    },
  }),
  mk("Mystery2 (sum of an n×n array)", {
    lines: ["Mystery2(A[0..n-1][0..n-1])  // n > 0", " S ← 0", " for i ← 0 to n-1 do", "    for j ← 0 to n-1 do", "        S ← S + A[i][j]", " return S"],
    basic: 5, nMax: 3000, nMin: 1,
    formula: "C(n) = Σ_{i=0}^{n−1} Σ_{j=0}^{n−1} 1 = Σ_{i=0}^{n−1} n = n²",
    what: "Calculates the sum of the elements in the n × n array A. Slide 31.",
    why: "Line 5, the addition, sits inside both loops: the inner loop does it n times, and the outer loop repeats the inner loop n times, so **n · n = n²**.",
    run(n) {
      const c = [NONE, 1, 0, 0, 0, 1];
      for (let i = 0; i <= n - 1; i++) { c[2]++; for (let j = 0; j <= n - 1; j++) { c[3]++; c[4]++; } }
      return c;
    },
  }),
  mk("Loops (insertion sort)", {
    lines: ["Loops(A[0..n-1])", "  for i ← 1 to n-1 do", "    v ← A[i]", "    j ← i-1", "    while j≥0 and A[j]>v do", "       A[j+1] ← A[j]", "       j ← j-1", "    A[j+1] ← v"],
    basic: 5, nMax: 3000, nMin: 1,
    modes: { worst: "worst case (A descending)", best: "best case (A already sorted)" },
    formula: { worst: "C_worst(n) = Σ_{i=1}^{n−1} Σ_{j=0}^{i−1} 1 = Σ_{i=1}^{n−1} i = (n − 1)n / 2", best: "C_best(n) = n − 1 (one comparison per pass)" },
    what: "Sorts A ascending: insertion sort. Slide 35.",
    why: "Line 5 holds the **key comparison A[j] > v**. In the worst case (A descending) every pass i compares v with all i earlier elements, so the count is 1 + 2 + … + (n − 1) = (n − 1)n / 2. Lines 6 and 7 tie with it numerically, but the comparison is the key thing being checked and data comparisons count as more expensive than assignments (slide 37).",
    run(n, mode) {
      const A = Array.from({ length: n }, (_, k) => mode === "best" ? k : n - k);
      const c = [NONE, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 1; i <= n - 1; i++) {
        c[1]++; const v = A[i]; c[2]++; let j = i - 1; c[3]++;
        while (j >= 0) { c[4]++; if (!(A[j] > v)) break; A[j + 1] = A[j]; c[5]++; j--; c[6]++; }
        A[j + 1] = v; c[7]++;
      }
      return c;
    },
  }),
  mk("CountSomethingElse(N)", {
    lines: ["Algorithm CountSomethingElse(int N)", "    A = new array[1..N]", "    for i = 1 to N do", "        sum1 = 0", "        for j = 1 to i do", "            sum1 = sum1 + j", "        endfor", "        A[i] = sum1", "    endfor", "    sum2 = 0", "    for i = 1 to N do", "        sum2 = sum2 + A[i]", "    endfor", "    return sum2", "END"],
    basic: 6, nMax: 3000, nMin: 1,
    formula: "C(N) = Σ_{i=1}^{N} Σ_{j=1}^{i} 1 = Σ_{i=1}^{N} i = N(N + 1) / 2",
    what: "A[i] = 1 + 2 + … + i (the i-th triangular number); returns the sum of the first N triangular numbers. Slide 11, and the quiz's CountSomething.",
    why: "Line 6 runs inside the double loop: 1 + 2 + … + N = **N(N + 1) / 2** times. Line 12 runs only N times, so it loses. An algorithm has **one** basic operation, the single most frequently executed statement; \"two basic operations\" is a distractor.",
    run(n) {
      const c = [NONE, 1, 0, 0, 0, 0, NONE, 0, NONE, 1, 0, 0, NONE, 1, NONE];
      for (let i = 1; i <= n; i++) { c[2]++; c[3]++; for (let j = 1; j <= i; j++) { c[4]++; c[5]++; } c[7]++; }
      for (let i = 1; i <= n; i++) { c[10]++; c[11]++; }
      return c;
    },
  }),
  mk("Example3 (halving loop)", {
    lines: ["Example3(n)", "   sum ← 0", "   i ← n", "   while i ≥ 1", "      sum ← sum + 1", "      i ← i/2", "   return sum"],
    basic: 6, nMax: 1000000, nMin: 1,
    formula: "C(n) = ⌊log₂ n⌋ + 1 ≈ log n",
    what: "Counts how many times n can be halved before it drops below 1 (integer division). Slide 51.",
    why: "Line 6, the **division and assignment**, is the slide's pick: it and line 5 both run once per pass, and division is the more expensive arithmetic (tie-breaker: multiplication/division before addition/subtraction). Each pass halves i, so the loop runs ⌊log₂ n⌋ + 1 times: cutting the problem size by a constant factor each iteration is what makes an algorithm *logarithmic*.",
    run(n) {
      const c = [NONE, 1, 1, 0, 0, 0, 1];
      let i = n;
      while (i >= 1) { c[3]++; c[4]++; i = Math.floor(i / 2); c[5]++; }
      return c;
    },
  }),
  mk("SequentialSearch", {
    lines: ["SequentialSearch(A[0..n-1], K)", "   i ← 0", "   while i < n and A[i] ≠ K do", "      i ← i + 1", "   if i < n return i", "   else return -1"],
    basic: 3, nMax: 100000, nMin: 1,
    modes: { worst: "worst case (K absent, or last)", best: "best case (K is A[0])" },
    formula: { worst: "C_worst(n) = n", best: "C_best(n) = 1" },
    what: "Returns the index of the first element equal to K, or −1. Slide 52.",
    why: "Line 3 holds the **key comparison A[i] ≠ K**. How many times it runs *depends on the order of the input*: if K is not in A every element is compared (n); if K is A[0] one comparison is enough (1). That is why best, worst and average cases exist.",
    run(n, mode) {
      const A = Array.from({ length: n }, (_, k) => k + 1);
      const K = mode === "best" ? 1 : 0;
      const c = [NONE, 1, 0, 0, 0, 0];
      let i = 0;
      while (i < n) { c[2]++; if (A[i] === K) break; i++; c[3]++; }
      if (i < n) c[4]++; else c[5]++;
      return c;
    },
  }),
  mk("UniqueElements", {
    lines: ["UniqueElements(A[0..n-1])", "  for i ← 0 to n-2 do", "    for j ← i+1 to n-1 do", "      if A[i] = A[j] return false", "  return true"],
    basic: 4, nMax: 3000, nMin: 2,
    modes: { worst: "worst case (all distinct)", best: "best case (A[0] = A[1])" },
    formula: { worst: "C_worst(n) = Σ_{i=0}^{n−2} Σ_{j=i+1}^{n−1} 1 = Σ_{i=0}^{n−2} (n − 1 − i) = n(n − 1) / 2", best: "C_best(n) = 1" },
    what: "Returns true if all elements of A are distinct, false otherwise. Slide 84.",
    why: "Line 4, the **comparison in the innermost loop**. In the worst case (all distinct) no early return happens and every pair is compared once: (n − 1) + (n − 2) + … + 1 = n(n − 1) / 2, which simplifies to n²/2 − n/2 ∈ O(n²). If A[0] = A[1] the first comparison already returns false.",
    run(n, mode) {
      const A = Array.from({ length: n }, (_, k) => k);
      if (mode === "best") A[1] = A[0];
      const c = [NONE, 0, 0, 0, 0];
      outer: for (let i = 0; i <= n - 2; i++) { c[1]++; for (let j = i + 1; j <= n - 1; j++) { c[2]++; c[3]++; if (A[i] === A[j]) break outer; } }
      if (c[3] === (n * (n - 1)) / 2) c[4] = 1;
      return c;
    },
  }),
  mk("MatrixMultiply", {
    lines: ["MatrixMultiply(A[0..n-1, 0..n-1], B[0..n-1, 0..n-1])", "   for i ← 0 to n-1 do", "      for j ← 0 to n-1 do", "         C[i, j] ← 0", "         for k ← 0 to n-1 do", "            C[i, j] ← C[i, j] + A[i, k] * B[k, j]", "   return C"],
    basic: 6, nMax: 200, nMin: 1,
    formula: "C(n) = Σ_{i=0}^{n−1} Σ_{j=0}^{n−1} Σ_{k=0}^{n−1} 1 = n³",
    what: "Multiplies two n × n matrices. Slides 50 and 83.",
    why: "Line 6, the **multiplication** (innermost expression and assignment), sits inside three embedded loops of n each: n · n · n = n³. Three embedded loops is the textbook's signature of a *cubic* algorithm.",
    run(n) {
      const c = [NONE, 0, 0, 0, 0, 0, 1];
      for (let i = 0; i < n; i++) { c[1]++; for (let j = 0; j < n; j++) { c[2]++; c[3]++; for (let k = 0; k < n; k++) { c[4]++; c[5]++; } } }
      return c;
    },
  }),
  mk("CountSomething2 (isPrime)", {
    lines: ["Algorithm CountSomething2(int n)", "    count = 0", "    for a = 1 to n do", "        for b = 1 to n do", "            val = 100*a + b", "            if SomeMathLib.isPrime(val)", "                count++", "            endif", "        endfor", "    endfor", "    return count", "END"],
    basic: 6, nMax: 3000, nMin: 1,
    formula: "C(n) = Σ_{a=1}^{n} Σ_{b=1}^{n} 1 = n²",
    what: "Counts how many of the numbers 100a + b (1 ≤ a, b ≤ n) are prime. Slide 10.",
    why: "Lines 5 and 6 both run n² times, but line 6 makes a **function call**, and function calls sit at the top of the tie-breaker list (a primality test is far more work than one multiplication and addition). Line 7 runs fewer times: only when the number is prime.",
    run(n) {
      const isPrime = (v) => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
      const c = [NONE, 1, 0, 0, 0, 0, 0, NONE, NONE, NONE, 1, NONE];
      for (let a = 1; a <= n; a++) { c[2]++; for (let b = 1; b <= n; b++) { c[3]++; c[4]++; c[5]++; if (n <= 300 ? isPrime(100 * a + b) : (100 * a + b) % 7 === 1) c[6]++; } }
      return c;
    },
  }),
  mk("DoSomething() (no input)", {
    lines: ["Algorithm DoSomething()", "    count = 0", "    do", "        x = count+1", "        secret = 100*x + 10*x + x", "        if secret % 37 == 0", "            count++", "        endif", "    while x < 100", "    return count", "END"],
    basic: 5, nMax: 1000000, nMin: 1, constant: true,
    formula: "every count is a constant: the algorithm has no input, so nothing depends on n",
    what: "secret = 111·x, and 111 = 3 × 37, so secret % 37 == 0 on every pass: count++ every time, x runs 1, 2, …, 100, and the function returns 100. Slide 9.",
    why: "Lines 4 to 6 each run exactly 100 times whether n is 3 or a million: there is **no input**, so the running time is a constant. Slide 9 is the lecture's example of code that looks busy but does not scale with anything. If you must pick one line, line 5 has the most arithmetic (two multiplications).",
    run() {
      const c = [NONE, 1, NONE, 0, 0, 0, 0, NONE, 0, 1, NONE];
      let count = 0, x;
      do { x = count + 1; c[3]++; const secret = 100 * x + 10 * x + x; c[4]++; c[5]++; if (secret % 37 === 0) { count++; c[6]++; } c[8]++; } while (x < 100);
      return c;
    },
  }),
  mk("DoSomething(N) (10×10 then N)", {
    lines: ["Algorithm DoSomething(N)", "  s = 0", "  t = 0", "  u = 0", "  for i = 1 to 10 do", "      for j = 1 to 10 do", "          s = s + i", "      endfor", "  endfor", "  for x = 1 to N do", "      t = t + x", "  endfor", "  for p = 1 to N do", "      u = u * max(s, t)", "  endfor", "END"],
    basic: 14, nMax: 1000000, nMin: 1,
    formula: "C(N) = N  (line 7 is stuck at 100 whatever N is)",
    what: "The quiz's DoSomething(N): a fixed 10 × 10 loop, then two loops of N.",
    why: "Line 7 runs exactly **100** times no matter how big N gets, so it cannot be the basic operation: we care about growth with N. Lines 11 and 14 both run N times, a tie. Tie-breakers: line 14 makes a **function call** (max) and **multiplies**; line 11 only adds. So line 14. Slide the n control past 100 to watch line 7 fall behind.",
    run(n) {
      const c = [NONE, 1, 1, 1, 0, 0, 0, NONE, NONE, 0, 0, NONE, 0, 0, NONE, NONE];
      for (let i = 1; i <= 10; i++) { c[4]++; for (let j = 1; j <= 10; j++) { c[5]++; c[6]++; } }
      c[9] = n; c[10] = n; c[12] = n; c[13] = n;
      return c;
    },
  }),
  mk("UnusualAdd(A, B)", {
    lines: ["Algorithm UnusualAdd(A[n], B[n])", "    C = new array[n]", "    for i = 0 to n-1 do", "        if A[n]==B[n] then", "            C[i] = A[i]", "        else", "            C[i] = A[i] + B[i]", "        endif", "    endfor", "END"],
    basic: 4, nMax: 1000000, nMin: 1,
    modes: { equal: "A[n] == B[n] is true", different: "A[n] == B[n] is false" },
    formula: "C(n) = n",
    what: "The quiz's UnusualAdd: one loop over n, an if that compares the same two cells every pass.",
    why: "Line 4, the **comparison**, runs once per pass: **n** times. Exactly one of lines 5 and 7 runs each pass too, so together they also total n, but whichever branch is taken, nothing here runs more than n times. n/2, 2n and n² are the distractors.",
    run(n, mode) {
      const c = [NONE, 1, 0, 0, 0, NONE, 0, NONE, NONE, NONE];
      for (let i = 0; i <= n - 1; i++) { c[2]++; c[3]++; if (mode === "different") c[6]++; else c[4]++; }
      return c;
    },
  }),
  mk("Halving with countdown", {
    lines: ["j = 0", "i = n", "while i > 0 do", "   j = j+1", "   if j > 0 then", "      x = i", "      while x > 0", "         x = x - j", "      end-while", "   end-if", "   i = i/2", "end-while"],
    basic: 8, nMax: 1000000, nMin: 1,
    formula: "outer loop: ⌊log₂ n⌋ + 1 passes; line 8 runs ⌈i/j⌉ times per pass, far more than any other line",
    what: "The quiz's nested-while fragment: i halves each pass (integer division), and each pass counts x down from i in steps of j.",
    why: "Line 8, **x = x − j**, is the deepest statement and runs the most: on the first pass alone it runs n times (j = 1). The outer loop's lines (3, 4, 5, 6, 11) run only about log₂ n times because i halves each pass. Deepest inside the loop, and most frequent: line 8.",
    run(n) {
      const c = [1, 1, 0, 0, 0, 0, 0, 0, NONE, NONE, 0, NONE];
      let j = 0, i = n;
      while (i > 0) { c[2]++; j++; c[3]++; c[4]++; if (j > 0) { let x = i; c[5]++; c[6] += Math.ceil(x / j); c[7] += Math.ceil(x / j); } i = Math.floor(i / 2); c[10]++; }
      return c;
    },
  }),
];
const PRESET_BY_NAME = Object.fromEntries(PRESETS.map((p) => [p.name, p]));

function opCounter(box, cfg) {
  let preset = PRESET_BY_NAME[cfg.preset] || PRESETS[0];
  let mode = null;
  let n = cfg.n ?? 10;
  let revealed = false;
  box.append(el("h4", null, cfg.title || "How many times does each line run?"));
  const showSel = cfg.presets !== false;
  const sel = document.createElement("select");
  sel.className = "algo-select";
  for (const p of PRESETS) { const o = document.createElement("option"); o.value = p.name; o.textContent = p.name; sel.append(o); }
  sel.value = preset.name;
  const selRow = el("div", "viz-inline");
  selRow.append(el("span", "algo-label", "Algorithm"), sel);
  if (showSel) box.append(selRow);
  const modeRow = el("div", "viz-btn-row");
  const nRow = el("div", "viz-inline");
  const quick = el("div", "viz-btn-row");
  const sl = slider("n (input size)", 1, 100, 1, 10, (v) => { n = v; draw(); }, (v) => String(v));
  const table = el("div", "oc-table");
  const stats = el("div", "stat-grid");
  const what = el("p", "widget-note");
  const revealBtn = el("button", "reset-btn", "Reveal the basic operation");
  const why = el("div", "oc-why");
  box.append(what, modeRow, nRow, sl.row, quick, table, stats, revealBtn, why);

  sel.addEventListener("change", () => { preset = PRESET_BY_NAME[sel.value]; mode = null; revealed = false; setup(); });
  revealBtn.addEventListener("click", () => { revealed = true; draw(); });

  function setup() {
    modeRow.innerHTML = "";
    if (preset.modes) {
      const keys = Object.keys(preset.modes);
      mode = keys.includes(cfg.mode) && !mode ? cfg.mode : (mode || keys[0]);
      modeRow.append(btnRow(keys.map((k) => preset.modes[k]), (i) => { mode = keys[i]; draw(); }, keys.indexOf(mode)));
    }
    const max = Math.min(preset.nMax, 100000);
    sl.input.min = preset.nMin ?? 1; sl.input.max = Math.min(max, 100);
    n = clamp(n, preset.nMin ?? 1, max);
    sl.set(Math.min(n, 100));
    quick.innerHTML = "";
    for (const q of [3, 8, 10, 100, 1000, 10000, 100000]) {
      if (q > max || q < (preset.nMin ?? 1)) continue;
      const b = el("button", "viz-btn", `n = ${q.toLocaleString("en-US")}`);
      b.addEventListener("click", () => { n = q; if (q <= 100) sl.set(q); draw(); });
      quick.append(b);
    }
    what.textContent = preset.what;
    draw();
  }

  function draw() {
    const cols = [3, 10, 100].filter((q) => q <= preset.nMax && q >= (preset.nMin ?? 1));
    if (!cols.includes(n)) cols.push(n);
    cols.sort((a, b) => a - b);
    const counts = cols.map((q) => preset.run(q, mode));
    const cur = counts[cols.indexOf(n)];
    const maxCount = Math.max(...cur.filter((v) => v != null));
    table.innerHTML = "";
    const head = el("div", "oc-row oc-head");
    head.append(el("span", "oc-ln", "line"), el("span", "oc-code", "statement"));
    for (const q of cols) head.append(el("span", "oc-cnt" + (q === n ? " cur" : ""), `n = ${q.toLocaleString("en-US")}`));
    table.append(head);
    preset.lines.forEach((text, i) => {
      const row = el("div", "oc-row");
      const isMax = cur[i] != null && cur[i] === maxCount && !preset.constant;
      if (isMax) row.classList.add("max");
      if (revealed && i + 1 === preset.basic) row.classList.add("basic");
      row.append(el("span", "oc-ln", String(i + 1)));
      const code = el("span", "oc-code");
      code.innerHTML = highlight("pseudo", text) || " ";
      row.append(code);
      counts.forEach((c, k) => {
        const v = c[i];
        const s = el("span", "oc-cnt" + (cols[k] === n ? " cur" : ""), v == null ? "–" : fmtInt(v));
        row.append(s);
      });
      table.append(row);
    });
    const basicCount = cur[preset.basic - 1];
    const f = typeof preset.formula === "string" ? preset.formula : preset.formula[mode] || Object.values(preset.formula)[0];
    const rows = [
      ["Most frequent count at this n", fmtInt(maxCount), preset.constant ? "does not change with n" : "the highlighted row(s)"],
      ["Basic operation count C(n)", revealed ? fmtInt(basicCount) : "?", revealed ? f : "reveal to see the formula"],
    ];
    if (preset.total) rows.push(["All statements f(n)", fmtInt(cur.filter((v) => v != null).reduce((a, b) => a + b, 0)), preset.total]);
    grid(stats, rows);
    why.innerHTML = "";
    revealBtn.style.display = revealed ? "none" : "";
    if (revealed) {
      why.append(mathP("oc-why-p", `**Basic operation: line ${preset.basic}.** ${preset.why}`));
    }
  }
  setup();
}

// =====================================================================
// loop-grid: every (i, j) pair a double loop visits, as a dot grid, with the sum and closed form.
// =====================================================================
const GRIDS = {
  square: {
    label: "square: i ← 0 to n−1, j ← 0 to n−1",
    code: "for i ← 0 to n-1 do\n   for j ← 0 to n-1 do\n      basic operation",
    i: (n) => [0, n - 1], j: (n, i) => [0, n - 1],
    sum: "\\sum_{i=0}^{n-1} \\sum_{j=0}^{n-1} 1 = \\sum_{i=0}^{n-1} n = n^2", closed: (n) => n * n, closedText: "n²", example: "Mystery2, matrix row × column sums",
  },
  lower: {
    label: "lower triangle: i ← 1 to n−1, j ← 0 to i−1",
    code: "for i ← 1 to n-1 do\n   for j ← 0 to i-1 do   (or: while j ≥ 0, j ← j−1)\n      basic operation",
    i: (n) => [1, n - 1], j: (n, i) => [0, i - 1],
    sum: "\\sum_{i=1}^{n-1} \\sum_{j=0}^{i-1} 1 = \\sum_{i=1}^{n-1} i = \\frac{(n-1)n}{2}", closed: (n) => (n * (n - 1)) / 2, closedText: "(n − 1)n / 2", example: "Loops (insertion sort, worst case)",
  },
  upper: {
    label: "upper triangle: i ← 0 to n−2, j ← i+1 to n−1",
    code: "for i ← 0 to n-2 do\n   for j ← i+1 to n-1 do\n      basic operation",
    i: (n) => [0, n - 2], j: (n, i) => [i + 1, n - 1],
    sum: "\\sum_{i=0}^{n-2} \\sum_{j=i+1}^{n-1} 1 = \\sum_{i=0}^{n-2} (n-1-i) = \\frac{n(n-1)}{2}", closed: (n) => (n * (n - 1)) / 2, closedText: "n(n − 1) / 2", example: "UniqueElements (worst case)",
  },
  triangle1: {
    label: "i ← 1 to n, j ← 1 to i",
    code: "for i ← 1 to n do\n   for j ← 1 to i do\n      basic operation",
    i: (n) => [1, n], j: (n, i) => [1, i],
    sum: "\\sum_{i=1}^{n} \\sum_{j=1}^{i} 1 = \\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}", closed: (n) => (n * (n + 1)) / 2, closedText: "n(n + 1) / 2", example: "CountSomethingElse(N)",
  },
};
function loopGrid(box, cfg) {
  const keys = Object.keys(GRIDS);
  let key = keys.includes(cfg.preset) ? cfg.preset : "square";
  let n = clamp(Math.round(cfg.n ?? 6), 2, 12);
  box.append(el("h4", null, cfg.title || "Every (i, j) the double loop visits"));
  const btns = btnRow(keys.map((k) => k), (i) => { key = keys[i]; draw(); }, keys.indexOf(key));
  const s = slider("n", 2, 12, 1, n, (v) => { n = v; draw(); }, (v) => String(v));
  const code = el("pre", "lg-code");
  const svg = svgEl("svg", { viewBox: "0 0 640 330", class: "curve-svg lg-svg" });
  const out = el("div", "stat-grid");
  const sumP = el("p", "lg-sum");
  box.append(btns, s.row, code, svg, sumP, out);
  function draw() {
    const g = GRIDS[key];
    code.innerHTML = highlight("pseudo", g.code);
    svg.innerHTML = "";
    const [i0, i1] = g.i(n);
    let jmin = Infinity, jmax = -Infinity;
    for (let i = i0; i <= i1; i++) { const [a, b] = g.j(n, i); if (b >= a) { jmin = Math.min(jmin, a); jmax = Math.max(jmax, b); } }
    const lo = Math.min(i0, jmin), hi = Math.max(i1, jmax);
    const cells = hi - lo + 1;
    const pad = 44, size = Math.min((640 - 2 * pad) / cells, (330 - 2 * pad) / cells);
    const ox = pad + 30, oy = pad;
    const X = (j) => ox + (j - lo) * size + size / 2;
    const Y = (i) => oy + (i - lo) * size + size / 2;
    let count = 0;
    const perRow = [];
    for (let i = i0; i <= i1; i++) {
      const [j0, j1] = g.j(n, i);
      let c = 0;
      for (let j = j0; j <= j1; j++) { svg.append(svgEl("circle", { cx: X(j), cy: Y(i), r: Math.max(3, size * 0.28), fill: "var(--hl)" })); c++; count++; }
      perRow.push(c);
      const t = svgEl("text", { x: ox + cells * size + 8, y: Y(i) + 4, "font-size": 11, fill: "var(--ink-dim)" }, `${c}`);
      svg.append(t);
    }
    for (let v = lo; v <= hi; v++) {
      svg.append(svgEl("text", { x: ox - 10, y: Y(v) + 4, "text-anchor": "end", "font-size": 11, fill: "var(--ink-2)" }, `i = ${v}`));
      svg.append(svgEl("text", { x: X(v), y: oy - 8, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, `j=${v}`));
    }
    svg.append(svgEl("text", { x: ox + cells * size + 8, y: oy - 8, "font-size": 11, fill: "var(--ink-dim)" }, "per i"));
    sumP.innerHTML = inline(`$${g.sum}$`);
    grid(out, [
      ["Dots (basic operations)", String(count), perRow.length ? perRow.join(" + ") : ""],
      ["Closed form", `${g.closedText} = ${g.closed(n)}`, `n = ${n}`],
      ["Where it appears", g.example, ""],
    ]);
  }
  draw();
}

// =====================================================================
// growth-plot: the seven columns of Table 2.1 as curves and as a table.
// =====================================================================
const lnFact = (n) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };
const GROWTH = [
  { id: "log2 n", label: "log₂ n", ln: (n) => Math.log(Math.max(1e-9, log2(n))), color: "var(--green)" },
  { id: "n", label: "n", ln: (n) => Math.log(n), color: "var(--blue)" },
  { id: "n log2 n", label: "n log₂ n", ln: (n) => Math.log(Math.max(1e-9, n * log2(n))), color: "var(--purple)" },
  { id: "n^2", label: "n²", ln: (n) => 2 * Math.log(n), color: "var(--hl)" },
  { id: "n^3", label: "n³", ln: (n) => 3 * Math.log(n), color: "#ff9f43" },
  { id: "2^n", label: "2ⁿ", ln: (n) => n * Math.LN2, color: "var(--red)" },
  { id: "n!", label: "n!", ln: (n) => lnFact(n), color: "#ff7ab6" },
];
function sci(lnv, digits = 1) {
  if (!Number.isFinite(lnv)) return "—";
  const l10 = lnv / Math.LN10;
  if (l10 < 6) { const v = Math.exp(lnv); return v >= 100 ? fmtInt(v) : fmtNum(v, v < 10 ? 1 : 0); }
  let e = Math.floor(l10); let m = Math.pow(10, l10 - e);
  if (Number(m.toFixed(digits)) >= 10) { e += 1; m = 1; }
  return `${m.toFixed(digits)}·10^${e}`;
}
function growthPlot(box, cfg) {
  const on = new Set(Array.isArray(cfg.show) && cfg.show.length ? cfg.show : GROWTH.map((g) => g.id));
  let nmax = clamp(Math.round(cfg.nmax ?? 30), 5, 100);
  let nAt = Math.min(10, nmax);
  box.append(el("h4", null, cfg.title || "Orders of growth: the functions that classify basic-operation counts"));
  const toggles = el("div", "viz-btn-row");
  for (const g of GROWTH) {
    const b = el("button", "viz-btn" + (on.has(g.id) ? " active" : ""), g.label);
    b.style.borderColor = on.has(g.id) ? g.color : "";
    b.addEventListener("click", () => { if (on.has(g.id)) on.delete(g.id); else on.add(g.id); b.classList.toggle("active", on.has(g.id)); b.style.borderColor = on.has(g.id) ? g.color : ""; draw(); });
    toggles.append(b);
  }
  const sMax = slider("plot n from 1 to", 5, 100, 1, nmax, (v) => { nmax = v; nAt = Math.min(nAt, nmax); sAt.input.max = nmax; sAt.set(nAt); draw(); }, (v) => String(v));
  const sAt = slider("read values at n =", 1, nmax, 1, nAt, (v) => { nAt = v; draw(); }, (v) => String(v));
  const svg = svgEl("svg", { viewBox: "0 0 640 320", class: "curve-svg gp-svg" });
  const out = el("div", "stat-grid");
  const tbl = el("div", "gp-table");
  const note = el("p", "widget-note", "The y-axis is logarithmic: every gridline is 10× the one below. On a linear axis 2ⁿ and n! would leave the picture almost immediately. Table 2.1 (textbook) is reproduced below the plot.");
  box.append(toggles, sMax.row, sAt.row, svg, out, note, tbl);
  function draw() {
    svg.innerHTML = "";
    const pad = { l: 60, r: 16, t: 14, b: 34 };
    const W = 640, H = 320;
    const active = GROWTH.filter((g) => on.has(g.id));
    let maxLn = 1;
    for (const g of active) maxLn = Math.max(maxLn, g.ln(nmax));
    const maxL10 = Math.ceil(maxLn / Math.LN10);
    const X = (n) => pad.l + ((n - 1) / (nmax - 1)) * (W - pad.l - pad.r);
    const Y = (lnv) => { const l10 = Math.max(-0.3, lnv / Math.LN10); return H - pad.b - (l10 / maxL10) * (H - pad.t - pad.b); };
    for (let k = 0; k <= maxL10; k++) {
      const y = Y(k * Math.LN10);
      svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: y, y2: y, stroke: "var(--rule)" }));
      svg.append(svgEl("text", { x: pad.l - 6, y: y + 4, "text-anchor": "end", "font-size": 10.5, fill: "var(--ink-dim)" }, k === 0 ? "1" : `10^${k}`));
    }
    svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: H - pad.b, y2: H - pad.b, stroke: "var(--rule-strong)" }));
    for (const n of [1, Math.round(nmax / 4), Math.round(nmax / 2), Math.round((3 * nmax) / 4), nmax]) svg.append(svgEl("text", { x: X(n), y: H - pad.b + 16, "text-anchor": "middle", "font-size": 10.5, fill: "var(--ink-dim)" }, `n=${n}`));
    for (const g of active) {
      let d = "";
      for (let n = 1; n <= nmax; n++) { const y = Y(g.ln(n)); d += (n === 1 ? "M" : "L") + X(n).toFixed(1) + "," + y.toFixed(1); }
      svg.append(svgEl("path", { d, fill: "none", stroke: g.color, "stroke-width": 2 }));
      const yl = Y(g.ln(nmax));
      svg.append(svgEl("text", { x: W - pad.r - 2, y: clamp(yl, pad.t + 8, H - pad.b - 2) - 3, "text-anchor": "end", "font-size": 11, fill: g.color }, g.label));
    }
    svg.append(svgEl("line", { x1: X(nAt), x2: X(nAt), y1: pad.t, y2: H - pad.b, stroke: "var(--ink-dim)", "stroke-dasharray": "4 4" }));
    grid(out, active.map((g) => [g.label + ` at n = ${nAt}`, sci(g.ln(nAt), 2), ""]));
    tbl.innerHTML = "";
    const head = el("div", "gp-row gp-head");
    head.append(el("span", null, "n"));
    for (const g of GROWTH) head.append(el("span", null, g.label));
    tbl.append(head);
    for (const e of [1, 2, 3, 4, 5, 6]) {
      const n = Math.pow(10, e);
      const row = el("div", "gp-row");
      row.append(el("span", null, e === 1 ? "10" : `10^${e}`));
      for (const g of GROWTH) {
        let txt;
        if (g.id === "2^n" || g.id === "n!") txt = e <= 2 ? sci(g.ln(n)) : "";
        else if (g.id === "log2 n") txt = fmtNum(log2(n), e <= 2 ? 1 : 0);
        else txt = sci(g.ln(n));
        row.append(el("span", on.has(g.id) ? "" : "dim", txt));
      }
      tbl.append(row);
    }
    tbl.append(mathP("widget-note", "Blank cells are what the textbook leaves out too: 2^1000 and 1000! are beyond any machine. 100! ≈ 9.3·10^157 steps would take about 1.5×10^133 years on the world's fastest supercomputer."));
  }
  draw();
}

// =====================================================================
// big-o-check: tiny expression parser for f(n), g(n), then the definition tested numerically.
// Grammar: expr := term (('+'|'-') term)* ; term := unary (('*'|'/'|implicit) unary)* ;
// unary := '-' unary | power ; power := postfix ('^' unary)? ; postfix := primary ('!')* ;
// primary := number | 'n' | '(' expr ')' | func postfix-level-arg
// =====================================================================
function tokenize(src) {
  const toks = [];
  const re = /\s*(?:(\d+\.?\d*)|(log2|log|lg|ln|sqrt)|(n)|([-+*/^()!×−·]))/gy;
  let i = 0;
  while (i < src.length) {
    re.lastIndex = i;
    const m = re.exec(src);
    if (!m || m.index !== i) { if (/^\s*$/.test(src.slice(i))) break; throw new Error(`cannot read "${src.slice(i, i + 6)}"`); }
    i = re.lastIndex;
    if (m[1]) toks.push({ t: "num", v: parseFloat(m[1]) });
    else if (m[2]) toks.push({ t: "fn", v: m[2] });
    else if (m[3]) toks.push({ t: "n" });
    else if (m[4]) toks.push({ t: "op", v: { "×": "*", "−": "-", "·": "*" }[m[4]] || m[4] });
  }
  return toks;
}
function parseExpr(src) {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const take = () => toks[p++];
  const startsPrimary = (t) => t && (t.t === "num" || t.t === "n" || t.t === "fn" || (t.t === "op" && t.v === "("));
  function expr() {
    let l = term();
    while (peek() && peek().t === "op" && (peek().v === "+" || peek().v === "-")) { const o = take().v; const r = term(); const L = l, R = r; l = o === "+" ? (n) => L(n) + R(n) : (n) => L(n) - R(n); }
    return l;
  }
  function term() {
    let l = unary();
    while (peek()) {
      const t = peek();
      if (t.t === "op" && (t.v === "*" || t.v === "/")) { take(); const r = unary(); const L = l, R = r; l = t.v === "*" ? (n) => L(n) * R(n) : (n) => L(n) / R(n); }
      else if (startsPrimary(t)) { const r = unary(); const L = l, R = r; l = (n) => L(n) * R(n); }
      else break;
    }
    return l;
  }
  function unary() {
    if (peek() && peek().t === "op" && peek().v === "-") { take(); const r = unary(); return (n) => -r(n); }
    return power();
  }
  function power() {
    const base = postfix();
    if (peek() && peek().t === "op" && peek().v === "^") { take(); const e = unary(); return (n) => Math.pow(base(n), e(n)); }
    return base;
  }
  function postfix() {
    let v = primary();
    while (peek() && peek().t === "op" && peek().v === "!") { take(); const V = v; v = (n) => { const x = V(n); if (x < 0 || x !== Math.floor(x)) return NaN; let s = 1; for (let k = 2; k <= x; k++) s *= k; return s; }; }
    return v;
  }
  function primary() {
    const t = take();
    if (!t) throw new Error("unexpected end");
    if (t.t === "num") return () => t.v;
    if (t.t === "n") return (n) => n;
    if (t.t === "fn") {
      const arg = postfix();
      const f = { log: log2, log2, lg: log2, ln: Math.log, sqrt: Math.sqrt }[t.v];
      return (n) => f(arg(n));
    }
    if (t.t === "op" && t.v === "(") { const e = expr(); const c = take(); if (!c || c.v !== ")") throw new Error("missing )"); return e; }
    throw new Error(`unexpected "${t.v ?? t.t}"`);
  }
  const fn = expr();
  if (p < toks.length) throw new Error(`unexpected "${toks[p].v ?? toks[p].t}"`);
  return fn;
}
const BIGO_PRESETS = [
  { label: "2n+6 vs n", f: "2n+6", g: "n", c: 4, n0: 3 },
  { label: "5n²+20 vs n²", f: "5n^2+20", g: "n^2", c: 6, n0: 5 },
  { label: "10000n+2ⁿ vs 2ⁿ", f: "10000n + 2^n", g: "2^n", c: 2, n0: 20 },
  { label: "log(n)(1+n) vs n log n", f: "log(n)(1+n)", g: "n log n", c: 2, n0: 2 },
  { label: "n(n−1)/2 vs n²", f: "n(n-1)/2", g: "n^2", c: 1, n0: 1 },
  { label: "3log₂n+n vs n", f: "3 log n + n", g: "n", c: 2, n0: 8 },
  { label: "n² vs n (fails)", f: "n^2", g: "n", c: 10, n0: 1 },
];
function bigOCheck(box, cfg) {
  let mode = ["O", "Omega", "Theta"].includes(cfg.mode) ? cfg.mode : "O";
  let c1 = cfg.c ?? 4, c2 = cfg.c2 ?? 1, n0 = cfg.n0 ?? 3;
  box.append(el("h4", null, cfg.title || "Does f(n) ≤ c · g(n) hold for all n ≥ n₀?"));
  const modeRow = btnRow(["Big-O: f ≤ c·g", "Big-Ω: f ≥ c·g", "Big-Θ: c₂·g ≤ f ≤ c₁·g"], (i) => { mode = ["O", "Omega", "Theta"][i]; draw(); }, ["O", "Omega", "Theta"].indexOf(mode));
  const inputs = el("div", "bo-inputs");
  const fIn = document.createElement("input"); fIn.className = "bo-input"; fIn.value = cfg.f || "2n+6"; fIn.spellcheck = false;
  const gIn = document.createElement("input"); gIn.className = "bo-input"; gIn.value = cfg.g || "n"; gIn.spellcheck = false;
  const lab = (t, inp) => { const w = el("label", "bo-lab"); w.append(el("span", null, t), inp); return w; };
  inputs.append(lab("f(n) =", fIn), lab("g(n) =", gIn));
  const presetRow = el("div", "viz-btn-row");
  if (cfg.presets !== false) for (const p of BIGO_PRESETS) { const b = el("button", "viz-btn", p.label); b.addEventListener("click", () => { fIn.value = p.f; gIn.value = p.g; c1 = p.c; n0 = p.n0; sC1.set(c1); sN0.set(n0); draw(); }); presetRow.append(b); }
  const sC1 = slider("c (upper constant, c₁)", 0.5, 20, 0.5, c1, (v) => { c1 = v; draw(); }, (v) => String(v));
  const sC2 = slider("c₂ (lower constant, Θ only)", 0.1, 5, 0.1, c2, (v) => { c2 = v; draw(); }, (v) => fmtNum(v, 1));
  const sN0 = slider("n₀", 1, 60, 1, n0, (v) => { n0 = v; draw(); }, (v) => String(v));
  const verdict = el("div", "bo-verdict");
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg bo-svg" });
  const tbl = el("div", "bo-table");
  const err = el("div", "bo-err");
  box.append(modeRow, inputs, presetRow, sC1.row, sC2.row, sN0.row, verdict, svg, tbl, err);
  fIn.addEventListener("input", draw); gIn.addEventListener("input", draw);

  function holds(fv, gv) {
    if (!Number.isFinite(fv) || !Number.isFinite(gv)) return false;
    if (mode === "O") return fv <= c1 * gv;
    if (mode === "Omega") return fv >= c1 * gv;
    return c2 * gv <= fv && fv <= c1 * gv;
  }
  function draw() {
    sC2.row.style.display = mode === "Theta" ? "" : "none";
    err.textContent = "";
    let f, g;
    try { f = parseExpr(fIn.value); g = parseExpr(gIn.value); } catch (e) { err.textContent = "Cannot read the expression: " + e.message; return; }
    // check n0 .. 1e6 (every n to 2000, then log-spaced)
    let firstFail = null, checkedTo = n0, overflowed = false;
    const ns = [];
    for (let n = n0; n <= 2000; n++) ns.push(n);
    for (let x = Math.log(2001); x <= Math.log(1e6); x += 0.01) ns.push(Math.round(Math.exp(x)));
    for (const n of ns) {
      const fv = f(n), gv = g(n);
      if (!Number.isFinite(fv) || !Number.isFinite(gv) || Math.abs(fv) > 1e300 || Math.abs(gv) > 1e300) { overflowed = true; break; } // past double precision (2^1024, 171!)
      checkedTo = n;
      if (!holds(fv, gv)) { firstFail = n; break; }
    }
    const rel = mode === "O" ? "f(n) ≤ c·g(n)" : mode === "Omega" ? "f(n) ≥ c·g(n)" : "c₂·g(n) ≤ f(n) ≤ c₁·g(n)";
    verdict.className = "bo-verdict " + (firstFail == null ? "ok" : "bad");
    verdict.textContent = firstFail == null
      ? `${rel} holds for every n ≥ ${n0} checked (up to ${overflowed ? fmtInt(checkedTo) + ", where the values leave double precision" : "1,000,000"}). With c = ${c1}${mode === "Theta" ? `, c₂ = ${fmtNum(c2, 1)}` : ""} and n₀ = ${n0}, f(n) ∈ ${mode === "O" ? "O" : mode === "Omega" ? "Ω" : "Θ"}(g(n)).`
      : `${rel} FAILS at n = ${fmtInt(firstFail)} (f = ${fmtNum(f(firstFail), 2)}, c·g = ${fmtNum(c1 * g(firstFail), 2)}). Raise c or n₀, or the claim is false for every c and n₀.`;
    // table like slide 70
    tbl.innerHTML = "";
    const head = el("div", "bo-row bo-head");
    head.append(el("span", null, "n"), el("span", null, "f(n)"), el("span", null, mode === "Theta" ? "c₂·g(n)" : "c·g(n)"), el("span", null, mode === "Theta" ? "c₁·g(n)" : "holds?"));
    if (mode === "Theta") head.append(el("span", null, "holds?"));
    tbl.append(head);
    const from = Math.max(1, n0 - 2);
    for (let n = from; n < from + 9; n++) {
      const row = el("div", "bo-row" + (n < n0 ? " before" : ""));
      const ok = holds(f(n), g(n));
      row.append(el("span", null, String(n)), el("span", null, fmtNum(f(n), 2)));
      if (mode === "Theta") row.append(el("span", null, fmtNum(c2 * g(n), 2)), el("span", null, fmtNum(c1 * g(n), 2)));
      else row.append(el("span", null, fmtNum(c1 * g(n), 2)));
      row.append(el("span", ok ? "ok" : "bad", n < n0 ? (ok ? "✓ (before n₀)" : "✗ (before n₀, allowed)") : ok ? "✓" : "✗"));
      tbl.append(row);
    }
    // plot
    svg.innerHTML = "";
    const W = 640, H = 300, pad = { l: 50, r: 14, t: 12, b: 30 };
    const nmax = Math.max(12, Math.round(n0 * 2.5), firstFail ? Math.min(firstFail + 4, 400) : 0);
    const series = [];
    for (let n = 1; n <= nmax; n++) series.push([n, f(n), c1 * g(n), c2 * g(n)]);
    let ymax = 0;
    for (const [, a, b, cc] of series) for (const v of [a, b, mode === "Theta" ? cc : 0]) if (Number.isFinite(v)) ymax = Math.max(ymax, v);
    ymax = ymax || 1;
    const X = (n) => pad.l + ((n - 1) / (nmax - 1)) * (W - pad.l - pad.r);
    const Y = (v) => H - pad.b - (clamp(v, 0, ymax) / ymax) * (H - pad.t - pad.b);
    const path = (idx, color, dash) => { let d = ""; series.forEach(([n, ...vals]) => { const v = vals[idx]; if (!Number.isFinite(v)) return; d += (d ? "L" : "M") + X(n).toFixed(1) + "," + Y(v).toFixed(1); }); svg.append(svgEl("path", { d, fill: "none", stroke: color, "stroke-width": 2, "stroke-dasharray": dash || "" })); };
    // shaded region where the relation holds, n >= n0
    let shade = "";
    series.forEach(([n, a, b, cc]) => { if (n < n0) return; const top = mode === "Omega" ? a : mode === "Theta" ? b : b; shade += (shade ? "L" : "M") + X(n).toFixed(1) + "," + Y(top).toFixed(1); });
    if (shade) { const last = series[series.length - 1]; svg.append(svgEl("path", { d: shade + `L${X(last[0]).toFixed(1)},${Y(0)}L${X(n0).toFixed(1)},${Y(0)}Z`, fill: "var(--hl-soft)", stroke: "none" })); }
    svg.append(svgEl("line", { x1: pad.l, x2: W - pad.r, y1: H - pad.b, y2: H - pad.b, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("line", { x1: pad.l, x2: pad.l, y1: pad.t, y2: H - pad.b, stroke: "var(--rule-strong)" }));
    svg.append(svgEl("line", { x1: X(n0), x2: X(n0), y1: pad.t, y2: H - pad.b, stroke: "var(--ink-dim)", "stroke-dasharray": "4 4" }));
    svg.append(svgEl("text", { x: X(n0), y: H - pad.b + 14, "text-anchor": "middle", "font-size": 11, fill: "var(--ink-2)" }, `n₀ = ${n0}`));
    svg.append(svgEl("text", { x: W - pad.r, y: H - pad.b + 14, "text-anchor": "end", "font-size": 11, fill: "var(--ink-dim)" }, `n = ${nmax}`));
    svg.append(svgEl("text", { x: pad.l - 4, y: pad.t + 10, "text-anchor": "end", "font-size": 10.5, fill: "var(--ink-dim)" }, sci(Math.log(ymax), 1)));
    path(0, "var(--blue)");
    path(1, "var(--hl)", "6 3");
    if (mode === "Theta") path(2, "var(--green)", "6 3");
    const legend = svgEl("g");
    const lg = (x, color, txt) => { legend.append(svgEl("line", { x1: x, x2: x + 18, y1: pad.t + 8, y2: pad.t + 8, stroke: color, "stroke-width": 2 })); legend.append(svgEl("text", { x: x + 22, y: pad.t + 12, "font-size": 11, fill: color }, txt)); };
    lg(pad.l + 8, "var(--blue)", "f(n)");
    lg(pad.l + 90, "var(--hl)", mode === "Theta" ? "c₁·g(n)" : "c·g(n)");
    if (mode === "Theta") lg(pad.l + 180, "var(--green)", "c₂·g(n)");
    svg.append(legend);
  }
  draw();
}

// =====================================================================
// fib-race: fib(n) recursive call count vs fib2's loop, and the call tree.
// =====================================================================
const FIB_MS = { 30: [9, 0], 31: [11, 0], 32: [22, 0], 33: [83, 0], 34: [90, 0], 35: [148, 0], 36: [237, 0], 37: [429, 0], 38: [722, 0], 39: [1105, 0], 40: [1627, 0] };
function fibRace(box, cfg) {
  let n = clamp(Math.round(cfg.n ?? 6), 1, 40);
  box.append(el("h4", null, cfg.title || "fib(n): how much work does each algorithm do?"));
  const s = slider("n", 1, 40, 1, n, (v) => { n = v; draw(); }, (v) => String(v));
  const out = el("div", "stat-grid");
  const svg = svgEl("svg", { viewBox: "0 0 640 300", class: "curve-svg fib-svg" });
  const treeNote = el("p", "widget-note");
  const bars = el("div", "fib-bars");
  const msTbl = el("div", "gp-table");
  box.append(s.row, out, svg, treeNote, bars, msTbl);
  const calls = [1, 1]; for (let k = 2; k <= 40; k++) calls[k] = 1 + calls[k - 1] + calls[k - 2];
  const fibv = [0, 1]; for (let k = 2; k <= 40; k++) fibv[k] = fibv[k - 1] + fibv[k - 2];
  function timesComputed(N) { const t = new Array(N + 1).fill(0); (function rec(k) { t[k]++; if (k > 1) { rec(k - 1); rec(k - 2); } })(N); return t; }
  function draw() {
    grid(out, [
      ["fib(" + n + ")", fmtInt(fibv[n]), ""],
      ["fib (recursive): calls made", fmtInt(calls[n]), "each call is one basic operation"],
      ["fib2 (array): loop iterations", fmtInt(Math.max(0, n - 1)), "plus an array of n + 1 cells"],
      ["Ratio", n >= 2 ? fmtNum(calls[n] / (n - 1), 1) + "×" : "—", "calls per fib2 iteration"],
    ]);
    svg.innerHTML = "";
    if (n <= 7) {
      const depth = n + 1;
      const W = 640, H = 300;
      const leaves = calls[n];
      let x = 0;
      const nodes = [];
      (function place(k, d) {
        const node = { k, d, x: 0 };
        if (k > 1) { const a = place(k - 1, d + 1), b = place(k - 2, d + 1); node.x = (a.x + b.x) / 2; node.children = [a, b]; }
        else { node.x = x++; }
        nodes.push(node);
        return node;
      })(n, 0);
      const leafCount = x;
      const X = (v) => 24 + (v / Math.max(1, leafCount - 1)) * (W - 48);
      const Y = (d) => 22 + (d / Math.max(1, depth - 1)) * (H - 44);
      const seen = new Map();
      for (const nd of nodes) seen.set(nd.k, (seen.get(nd.k) || 0) + 1);
      for (const nd of nodes) if (nd.children) for (const ch of nd.children) svg.append(svgEl("line", { x1: X(nd.x), y1: Y(nd.d), x2: X(ch.x), y2: Y(ch.d), stroke: "var(--rule-strong)" }));
      for (const nd of nodes) {
        const dup = seen.get(nd.k) > 1 && nd.k >= 2;
        svg.append(svgEl("circle", { cx: X(nd.x), cy: Y(nd.d), r: 11, fill: dup ? "var(--red-soft)" : "var(--paper)", stroke: dup ? "var(--red)" : "var(--blue)", "stroke-width": 1.5 }));
        svg.append(svgEl("text", { x: X(nd.x), y: Y(nd.d) + 4, "text-anchor": "middle", "font-size": 10, fill: "var(--ink)" }, `f${nd.k}`));
      }
      svg.style.display = "";
      treeNote.textContent = `The call tree of fib(${n}): ${fmtInt(calls[n])} calls, ${leaves > 1 ? "" : ""}every red node is a value that was already computed elsewhere in the tree and is being recomputed from scratch. fib2 computes each F[i] exactly once.`;
    } else {
      svg.style.display = "none";
      treeNote.textContent = `The call tree for n = ${n} has ${fmtInt(calls[n])} nodes, too many to draw; the bars show how many times each fib(k) is recomputed.`;
    }
    bars.innerHTML = "";
    const t = timesComputed(Math.min(n, 40));
    const maxT = Math.max(...t);
    for (let k = n; k >= 0; k--) {
      const row = el("div", "fib-bar-row");
      row.append(el("span", "fib-bar-lab", `fib(${k})`));
      const bar = el("div", "fib-bar");
      const fill = el("div", "fib-bar-fill");
      fill.style.width = (Math.log(t[k] + 1) / Math.log(maxT + 1)) * 100 + "%";
      bar.append(fill);
      row.append(bar, el("span", "fib-bar-val", `${fmtInt(t[k])}× (fib2: 1×)`));
      bars.append(row);
    }
    msTbl.innerHTML = "";
    const head = el("div", "gp-row gp-head"); head.append(el("span", null, "N"), el("span", null, "Fib1 (ms)"), el("span", null, "Fib2 (ms)"), el("span", null, "fib calls")); msTbl.append(head);
    for (const N of Object.keys(FIB_MS)) { const row = el("div", "gp-row" + (Number(N) === n ? " cur" : "")); row.append(el("span", null, N), el("span", null, String(FIB_MS[N][0])), el("span", null, String(FIB_MS[N][1])), el("span", null, fmtInt(calls[N]))); msTbl.append(row); }
    msTbl.append(el("p", "widget-note", "Measured times from slide 20. Fib2 stays at 0 ms because it does n − 1 additions; Fib1's time roughly doubles every time N goes up by one, like its call count."));
  }
  draw();
}

export const WIDGETS = {
  "op-counter": opCounter,
  "loop-grid": loopGrid,
  "growth-plot": growthPlot,
  "big-o-check": bigOCheck,
  "fib-race": fibRace,
};
