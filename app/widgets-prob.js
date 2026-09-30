// Interactive probability widgets for MATH 3042 Unit 3 (probability and counting) and Lab 4
// (simulations): sample spaces you can click, the law of large numbers, a counting calculator,
// the complement / addition rules on a Venn diagram, the birthday problem, a two-way table for
// conditional probability and independence, a Bayes tree, and the Lab 4 simulation experiments.
import { el, esc, btnRow, slider, fmtNum } from "./dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs = {}, text) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}
function note(text) { const p = el("p", "widget-note"); p.innerHTML = text; return p; }
function cell(label, value, extra) {
  const c = el("div", "stat-cell");
  c.append(el("div", "stat-label", label));
  const v = el("div", "stat-value"); v.innerHTML = value; c.append(v);
  if (extra) { const n = el("div", "stat-note"); n.innerHTML = extra; c.append(n); }
  return c;
}
function grid(out, rows) { out.innerHTML = ""; for (const r of rows) out.append(cell(...r)); }
function rcode(text) { const p = el("pre", "manip-code"); p.textContent = text; return p; }
function toggle(label, checked, onChange) {
  const lab = el("label", "oop-toggle");
  const input = document.createElement("input");
  input.type = "checkbox"; input.checked = !!checked;
  input.addEventListener("change", () => onChange(input.checked));
  lab.append(input, el("span", null, label));
  return { row: lab, input };
}
function numField(label, value, onChange, step = "any") {
  const row = el("div", "unit-row");
  const input = document.createElement("input");
  input.type = "number"; input.step = step; input.value = value; input.setAttribute("aria-label", label);
  input.addEventListener("input", () => onChange(parseFloat(input.value)));
  row.append(el("label", null, label), input);
  return { row, input };
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** k/n as a reduced fraction plus a decimal. */
function frac(k, n, d = 4) {
  if (!n) return "—";
  const g = gcd(k, n) || 1;
  const red = g > 1 && n / g !== n ? ` = ${k / g}/${n / g}` : "";
  return `${k}/${n}${red} = ${fmtNum(k / n, d)}`;
}
const pct = (p, d = 2) => `${fmtNum(100 * p, d)}%`;
function big(n) {
  const s = n.toString();
  return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
}
function sci(n) {
  const s = n.toString();
  if (s.length <= 15) return big(n);
  return `${s[0]}.${s.slice(1, 4)} × 10^${s.length - 1}`;
}
function bars(container, counts, labels, hitSet, total) {
  container.innerHTML = "";
  const row = el("div", "prob-bars"), axis = el("div", "prob-axis");
  const max = Math.max(1, ...counts);
  counts.forEach((c, i) => {
    const b = el("div", "prob-bar" + (hitSet && hitSet.has(i) ? " hit" : ""));
    b.style.height = `${(100 * c) / max}%`;
    if (counts.length <= 24) b.append(el("span", null, total ? fmtNum(c / total, 3) : String(c)));
    b.title = `${labels[i]}: ${c}${total ? ` (${fmtNum(c / total, 4)})` : ""}`;
    row.append(b);
    axis.append(el("span", null, counts.length <= 30 || i % Math.ceil(counts.length / 30) === 0 ? String(labels[i]) : ""));
  });
  container.append(row, axis);
}

// ---------- widget: sample-space ----------
function sampleSpace(box, cfg) {
  let mode = cfg.mode === "dice" ? "dice" : "coins";
  let n = Math.min(5, Math.max(1, Math.round(cfg.n ?? 3)));
  let k = cfg.k ?? 1;
  let outcomes = [], selected = new Set();
  box.append(el("h4", null, cfg.title || "Sample spaces you can count"));
  box.append(note("Click outcomes to put them in the event A, or use a preset. P(A) = |A| / |S| because every outcome is equally likely."));
  if (!cfg.mode) box.append(btnRow(["Flip n coins", "Roll two dice"], (i) => { mode = i ? "dice" : "coins"; rebuild(); }, mode === "dice" ? 1 : 0));
  const ctl = el("div"), presetRow = el("div"), gridEl = el("div", "prob-grid"), out = el("div", "stat-grid"), dist = el("div"), formula = el("div", "prob-formula");
  box.append(ctl, presetRow, gridEl, formula, out, dist);
  const sumOf = (o) => o[0] + o[1];
  const heads = (o) => o.split("").filter((c) => c === "H").length;
  function rebuild() {
    ctl.innerHTML = ""; presetRow.innerHTML = "";
    if (mode === "coins") {
      const s = slider("Number of coins n", 1, 5, 1, n, (v) => { n = v; rebuild(); }, (v) => `${v} coin${v > 1 ? "s" : ""}`);
      const sk = slider("k for the presets", 0, 5, 1, Math.min(k, n), (v) => { k = v; }, (v) => `k = ${v}`);
      ctl.append(s.row, sk.row);
      outcomes = [];
      for (let i = 0; i < 2 ** n; i++) outcomes.push(i.toString(2).padStart(n, "0").replace(/0/g, "H").replace(/1/g, "T"));
      presetRow.append(btnRow(["exactly k heads", "at least k heads", "at most k heads", "all the same", "first coin is H", "clear"], (i) => {
        if (mode !== "coins") return;
        selected = new Set();
        outcomes.forEach((o, idx) => {
          const h = heads(o);
          if ((i === 0 && h === k) || (i === 1 && h >= k) || (i === 2 && h <= k) || (i === 3 && (h === 0 || h === n)) || (i === 4 && o[0] === "H")) selected.add(idx);
        });
        draw();
      }, -1));
      if (cfg.event) { const ev = { exactly: 0, atleast: 1, atmost: 2, same: 3, first: 4 }[cfg.event]; if (ev != null) presetRow.querySelectorAll("button")[ev].click(); }
    } else {
      outcomes = [];
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) outcomes.push([a, b]);
      const sk = slider("s for the presets", 2, 12, 1, Math.min(12, Math.max(2, k)), (v) => { k = v; }, (v) => `sum = ${v}`);
      ctl.append(sk.row);
      presetRow.append(btnRow(["boxcars (6, 6)", "sum = s", "sum < 12", "doubles", "at least one 6", "sum is 7 or 11", "clear"], (i) => {
        if (mode !== "dice") return;
        selected = new Set();
        outcomes.forEach((o, idx) => {
          const s = sumOf(o);
          if ((i === 0 && o[0] === 6 && o[1] === 6) || (i === 1 && s === k) || (i === 2 && s < 12) || (i === 3 && o[0] === o[1]) || (i === 4 && (o[0] === 6 || o[1] === 6)) || (i === 5 && (s === 7 || s === 11))) selected.add(idx);
        });
        draw();
      }, -1));
      if (cfg.event) { const ev = { boxcars: 0, sum: 1, under12: 2, doubles: 3, six: 4, natural: 5 }[cfg.event]; if (ev != null) presetRow.querySelectorAll("button")[ev].click(); }
    }
    if (!cfg.event) selected = new Set();
    draw();
  }
  function draw() {
    gridEl.innerHTML = "";
    gridEl.style.gridTemplateColumns = mode === "dice" ? "repeat(6, 1fr)" : `repeat(${Math.min(8, outcomes.length)}, 1fr)`;
    outcomes.forEach((o, idx) => {
      const c = el("div", "prob-cell" + (selected.has(idx) ? " in" : ""), mode === "dice" ? `${o[0]},${o[1]}` : o);
      c.title = mode === "dice" ? `sum ${sumOf(o)}` : `${heads(o)} head${heads(o) === 1 ? "" : "s"}`;
      c.addEventListener("click", () => { if (selected.has(idx)) selected.delete(idx); else selected.add(idx); draw(); });
      gridEl.append(c);
    });
    const S = outcomes.length, A = selected.size;
    formula.innerHTML = `P(A) = <b>|A|</b> / <b>|S|</b> = <b>${A}</b> / <b>${S}</b> = <b>${fmtNum(A / S, 4)}</b>${S && A ? ` (${frac(A, S).split(" = ").slice(1).join(" = ")})` : ""}`;
    const rows = [["|S| = size of the sample space", mode === "dice" ? "6 × 6 = 36" : `2<sup>${n}</sup> = ${S}`], ["|A| = outcomes in the event", String(A)], ["P(Ā) = 1 − P(A)", fmtNum(1 - A / S, 4)]];
    if (mode === "dice" && A) rows.push(["sums in A", [...new Set([...selected].map((i) => sumOf(outcomes[i])))].sort((a, b) => a - b).join(", ")]);
    grid(out, rows);
    // distribution of X
    const counts = mode === "dice" ? Array.from({ length: 11 }, (_, i) => outcomes.filter((o) => sumOf(o) === i + 2).length) : Array.from({ length: n + 1 }, (_, i) => outcomes.filter((o) => heads(o) === i).length);
    const labels = mode === "dice" ? Array.from({ length: 11 }, (_, i) => i + 2) : Array.from({ length: n + 1 }, (_, i) => i);
    const hit = new Set();
    counts.forEach((_, i) => { const xs = mode === "dice" ? outcomes.map((o, idx) => [sumOf(o), idx]) : outcomes.map((o, idx) => [heads(o), idx]); if (xs.some(([x, idx]) => x === labels[i] && selected.has(idx))) hit.add(i); });
    dist.innerHTML = `<div class="pv-title">distribution of X = ${mode === "dice" ? "sum of the two dice" : "number of heads"} (label = P(X = x))</div>`;
    const b = el("div"); bars(b, counts, labels, hit, S); dist.append(b);
  }
  rebuild();
}

// ---------- widget: lln-sim ----------
const LLN_EXPERIMENTS = [
  { name: "Boxcars (two sixes)", p: 1 / 36, exact: "1/36 = 0.0278", trial: () => Math.floor(Math.random() * 6) === 5 && Math.floor(Math.random() * 6) === 5, r: "dice <- sample(c(1,2,3,4,5,6), 2, replace=TRUE)\nsuccess <- (dice[1] == 6) & (dice[2] == 6)" },
  { name: "Sum of two dice is 7", p: 6 / 36, exact: "6/36 = 0.1667", trial: () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2 === 7, r: "X <- sum(sample.int(6, 2, replace=TRUE))\nsuccess <- (X == 7)" },
  { name: "Heads on a fair coin", p: 0.5, exact: "1/2 = 0.5", trial: () => Math.random() < 0.5, r: 'success <- (sample(c("H","T"), 1) == "H")' },
  { name: "At least two heads in five coins", p: 26 / 32, exact: "26/32 = 0.8125", trial: () => { let h = 0; for (let i = 0; i < 5; i++) if (Math.random() < 0.5) h++; return h >= 2; }, r: 'coins <- sample(c("H","T"), 5, replace=TRUE)\nsuccess <- (sum(coins == "H") >= 2)' },
  { name: "Birthday match among 23 people", p: 0.5073, exact: "0.5073", trial: () => { const seen = new Set(); for (let i = 0; i < 23; i++) { const d = Math.floor(Math.random() * 365); if (seen.has(d)) return true; seen.add(d); } return false; }, r: "sample.bdays <- sample(1:365, 23, replace=TRUE)\nsuccess <- (length(unique(sample.bdays)) < 23)" },
];
function llnSim(box, cfg) {
  box.append(el("h4", null, cfg.title || "Relative frequency versus the classical probability"));
  let ex = LLN_EXPERIMENTS[Math.max(0, LLN_EXPERIMENTS.findIndex((e) => e.name === cfg.experiment))] || LLN_EXPERIMENTS[0];
  let n = 0, x = 0, history = [];
  box.append(btnRow(LLN_EXPERIMENTS.map((e) => e.name), (i) => { ex = LLN_EXPERIMENTS[i]; reset(); }, LLN_EXPERIMENTS.indexOf(ex)));
  box.append(note("Each button runs more trials of the same experiment and adds them to the tally. x/n wanders at first and settles on P(A) as n grows: the law of large numbers."));
  const runs = btnRow(["+1 trial", "+10", "+100", "+1 000", "+10 000", "reset"], (i) => { if (i === 5) return reset(); run([1, 10, 100, 1000, 10000][i]); }, -1);
  const out = el("div", "stat-grid"), svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" }), code = rcode("");
  box.append(runs, out, svg, code);
  function run(m) {
    for (let i = 0; i < m; i++) { n++; if (ex.trial()) x++; if (n <= 100 || n % Math.ceil(n / 400) === 0) history.push([n, x / n]); }
    history.push([n, x / n]);
    draw();
  }
  function reset() { n = 0; x = 0; history = []; draw(); }
  function draw() {
    grid(out, [["trials n", big(n)], ["successes x", big(x)], ["relative frequency x/n", n ? fmtNum(x / n, 4) : "—"], ["classical P(A)", ex.exact], ["difference", n ? fmtNum(Math.abs(x / n - ex.p), 4) : "—"]]);
    svg.innerHTML = "";
    const X0 = 50, X1 = 620, Y0 = 170, Y1 = 20;
    const maxN = Math.max(10, n);
    const xOf = (v) => X0 + ((X1 - X0) * Math.log10(Math.max(1, v))) / Math.log10(maxN);
    const yOf = (p) => Y0 - (Y0 - Y1) * p;
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
    for (const p of [0, 0.25, 0.5, 0.75, 1]) { svg.append(svgEl("text", { x: X0 - 6, y: yOf(p) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, String(p))); svg.append(svgEl("line", { x1: X0, y1: yOf(p), x2: X1, y2: yOf(p), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); }
    for (let e = 0; 10 ** e <= maxN; e++) svg.append(svgEl("text", { x: xOf(10 ** e), y: Y0 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, big(10 ** e)));
    svg.append(svgEl("text", { x: X1, y: Y0 + 28, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, "n (log scale)"));
    svg.append(svgEl("line", { x1: X0, y1: yOf(ex.p), x2: X1, y2: yOf(ex.p), stroke: "var(--green)", "stroke-width": 1.5 }));
    svg.append(svgEl("text", { x: X1, y: yOf(ex.p) - 4, "text-anchor": "end", "font-size": 10, fill: "var(--green)" }, `P(A) = ${fmtNum(ex.p, 4)}`));
    if (history.length) svg.append(svgEl("polyline", { points: history.map(([k, p]) => `${xOf(k).toFixed(1)},${yOf(p).toFixed(1)}`).join(" "), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    code.textContent = `n.trials <- ${Math.max(n, 1)}\nX.success <- 0\nfor (i.trial in 1:n.trials){\n    ${ex.r.replace(/\n/g, "\n    ")}\n    X.success <- X.success + success\n}\nprob.A <- X.success / n.trials   # ${n ? fmtNum(x / n, 4) : "…"}`;
  }
  draw();
}

// ---------- widget: counting-calc ----------
const CC_PRESETS = {
  "arrange the 4 Aces (4!)": { n: 4, r: 4, kind: "perm" },
  "4 cards in sequence P(52,4)": { n: 52, r: 4, kind: "perm" },
  "a hand of 4 cards C(52,4)": { n: 52, r: 4, kind: "comb" },
  "front row P(90,9)": { n: 90, r: 9, kind: "perm" },
  "3 diamonds in sequence P(13,3)": { n: 13, r: 3, kind: "perm" },
  "committee C(20,5)": { n: 20, r: 5, kind: "comb" },
  "spade flush C(13,5) / C(52,5)": { n: 13, r: 5, kind: "comb", over: [52, 5] },
  "five die rolls 6^5": { n: 6, r: 5, kind: "pow" },
};
const factB = (n) => { let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return f; };
const permB = (n, r) => { let p = 1n; for (let i = 0; i < r; i++) p *= BigInt(n - i); return p; };
const combB = (n, r) => (r < 0 || r > n ? 0n : permB(n, r) / factB(r));
function countingCalc(box, cfg) {
  box.append(el("h4", null, cfg.title || "Factorials, permutations and combinations"));
  const names = Object.keys(CC_PRESETS);
  let n = cfg.n ?? 52, r = cfg.r ?? 4, kind = cfg.kind || "perm", over = cfg.over || null;
  if (cfg.preset && CC_PRESETS[cfg.preset]) ({ n, r, kind, over = null } = CC_PRESETS[cfg.preset]);
  box.append(note("Two questions decide the formula. Does the order of the chosen items matter? May an item be chosen more than once? Enter n and r, or pick one of the lecture's examples."));
  if (cfg.presets !== false) box.append(btnRow(names, (i) => { ({ n, r, kind, over = null } = CC_PRESETS[names[i]]); fn.input.value = n; fr.input.value = r; draw(); }, names.indexOf(cfg.preset)));
  const fn = numField("n (items to choose from)", n, (v) => { n = v; over = null; draw(); }, 1), fr = numField("r (items chosen)", r, (v) => { r = v; over = null; draw(); }, 1);
  const kinds = btnRow(["order matters, no repeats: P(n, r)", "order does not matter: C(n, r)", "order matters, repeats allowed: n^r"], (i) => { kind = ["perm", "comb", "pow"][i]; draw(); }, ["perm", "comb", "pow"].indexOf(kind));
  const out = el("div", "stat-grid"), work = el("div", "stat-steps"), code = rcode("");
  box.append(fn.row, fr.row, kinds, out, work, code);
  function draw() {
    n = Math.max(0, Math.min(170, Math.round(n || 0))); r = Math.max(0, Math.min(170, Math.round(r || 0)));
    if (r > n && kind !== "pow") { out.innerHTML = ""; work.innerHTML = `<div class="step error">r cannot exceed n when items are not repeated: there are only ${n} to choose from.</div>`; code.textContent = ""; return; }
    const nf = factB(n), rf = factB(r), P = permB(n, r), C = combB(n, r), pow = BigInt(n) ** BigInt(r);
    const chain = (m) => Array.from({ length: Math.min(r, 6) }, (_, i) => n - i).join(" × ") + (r > 6 ? " × … × " + (n - r + 1) : "");
    const rows = [[`n! = ${n}!`, sci(nf)], [`P(${n}, ${r}) = n! / (n − r)!`, sci(P), r ? `= ${chain()}` : "= 1 (nothing chosen)"], [`C(${n}, ${r}) = n! / (r! (n − r)!)`, sci(C), `= P(${n}, ${r}) / ${r}! = ${sci(P)} / ${sci(rf)}`], [`n^r = ${n}^${r}`, sci(pow)]];
    grid(out, rows);
    const chosen = kind === "perm" ? P : kind === "comb" ? C : pow;
    let html = kind === "perm"
      ? `<div class="step final">Order matters and nothing repeats: a <b>permutation</b>. Fill the ${r} positions in turn: ${chain()} = <b>${sci(P)}</b> sequences. Calculator: <code>${n} 2ndF nPr ${r}</code>.</div>`
      : kind === "comb"
        ? `<div class="step final">Order does not matter: a <b>combination</b> (a hand, a committee). Every group of ${r} was counted ${r}! = ${sci(rf)} times among the permutations, so divide: ${sci(P)} / ${sci(rf)} = <b>${sci(C)}</b>. Calculator: <code>${n} 2ndF nCr ${r}</code>.</div>`
        : `<div class="step final">Order matters and repeats are allowed (dice, cards drawn <b>with</b> replacement): the fundamental counting rule, ${n} choices at each of ${r} steps: ${Array(Math.min(r, 6)).fill(n).join(" × ")}${r > 6 ? " × …" : ""} = <b>${sci(pow)}</b>.</div>`;
    if (over) { const tot = combB(over[0], over[1]); html += `<div class="step">Probability: C(${n}, ${r}) / C(${over[0]}, ${over[1]}) = ${sci(chosen)} / ${sci(tot)} = <b>${fmtNum(Number(chosen) / Number(tot), 6)}</b> (about 1 in ${big(Math.round(Number(tot) / Number(chosen)))}).</div>`; }
    work.innerHTML = html;
    code.textContent = `factorial(${n})            # ${sci(nf)}\nchoose(${n}, ${r}) * factorial(${r})   # P(${n}, ${r}) = ${sci(P)}\nchoose(${n}, ${r})                # C(${n}, ${r}) = ${sci(C)}\n${n}^${r}                     # ${sci(pow)}`;
  }
  draw();
}

// ---------- widget: prob-rules ----------
const PR_PRESETS = {
  "7 or Ace (top card)": { a: [4, 52], b: [4, 52], ab: [0, 52], la: "7", lb: "Ace" },
  "heart or Ace": { a: [13, 52], b: [4, 52], ab: [1, 52], la: "heart", lb: "Ace" },
  "black card or heart": { a: [26, 52], b: [13, 52], ab: [0, 52], la: "black", lb: "heart" },
  "right-handed or iPhone (71 students)": { a: [61, 71], b: [58, 71], ab: [52, 71], la: "Right", lb: "iPhone" },
  "two dice: doubles or sum 7": { a: [6, 36], b: [6, 36], ab: [0, 36], la: "doubles", lb: "sum 7" },
  "two dice: a six or sum ≥ 10": { a: [11, 36], b: [6, 36], ab: [5, 36], la: "a six", lb: "sum ≥ 10" },
};
function probRules(box, cfg) {
  box.append(el("h4", null, cfg.title || "Complement and addition rules on a Venn diagram"));
  const names = Object.keys(PR_PRESETS);
  let st = { ...PR_PRESETS[cfg.preset || names[0]] };
  box.append(note("Counts out of |S|. Click a region of the diagram to read its probability. The addition rule subtracts the overlap so it is not counted twice; when the overlap is empty the events are mutually exclusive."));
  box.append(btnRow(names, (i) => { st = { ...PR_PRESETS[names[i]] }; sync(); draw(); }, names.indexOf(cfg.preset || names[0])));
  const fS = numField("|S| (outcomes)", st.a[1], (v) => { st.a[1] = st.b[1] = st.ab[1] = v; draw(); }, 1);
  const fA = numField("|A|", st.a[0], (v) => { st.a[0] = v; draw(); }, 1), fB = numField("|B|", st.b[0], (v) => { st.b[0] = v; draw(); }, 1), fAB = numField("|A ∩ B|", st.ab[0], (v) => { st.ab[0] = v; draw(); }, 1);
  const svg = svgEl("svg", { viewBox: "0 0 640 230", class: "curve-svg net-svg" });
  const out = el("div", "stat-grid"), work = el("div", "stat-steps");
  box.append(fS.row, fA.row, fB.row, fAB.row, svg, out, work);
  let region = "union";
  function sync() { fS.input.value = st.a[1]; fA.input.value = st.a[0]; fB.input.value = st.b[0]; fAB.input.value = st.ab[0]; }
  function draw() {
    const S = st.a[1], A = st.a[0], B = st.b[0], AB = st.ab[0];
    const bad = AB > Math.min(A, B) || A > S || B > S || A + B - AB > S;
    svg.innerHTML = "";
    const rA = 70 + 40 * Math.sqrt(A / S), rB = 70 + 40 * Math.sqrt(B / S);
    const ov = AB > 0 ? 0.35 + 0.6 * (AB / Math.min(A, B)) : 0;
    const cxA = 230, cxB = AB > 0 ? cxA + rA + rB - ov * 2 * Math.min(rA, rB) : cxA + rA + rB + 24, cy = 115;
    svg.append(svgEl("rect", { x: 10, y: 10, width: 620, height: 210, rx: 8, fill: "var(--paper)", stroke: "var(--rule)" }));
    const regions = [["neither", "var(--paper-3)"], ["A", "var(--blue-soft)"], ["B", "var(--green-soft)"]];
    for (const [name, fill] of regions) {
      const shape = name === "neither" ? svgEl("rect", { x: 10, y: 10, width: 620, height: 210, rx: 8, fill: "transparent" }) : svgEl("circle", { cx: name === "A" ? cxA : cxB, cy, r: name === "A" ? rA : rB, fill, stroke: name === "A" ? "var(--blue)" : "var(--green)", "stroke-width": 2, opacity: 0.9 });
      shape.style.cursor = "pointer";
      shape.addEventListener("click", (e) => { e.stopPropagation(); region = name === "neither" ? "neither" : region === name ? "union" : name; paint(); });
      svg.append(shape);
    }
    if (AB > 0) { const lens = svgEl("circle", { cx: (cxA + cxB) / 2, cy, r: 6, fill: "var(--hl)" }); lens.style.cursor = "pointer"; lens.addEventListener("click", (e) => { e.stopPropagation(); region = "both"; paint(); }); svg.append(lens); svg.append(svgEl("text", { x: (cxA + cxB) / 2, y: cy - 12, "text-anchor": "middle", "font-size": 11, fill: "var(--hl)" }, `A∩B: ${AB}`)); }
    svg.append(svgEl("text", { x: cxA - rA / 2, y: cy + 4, "text-anchor": "middle", "font-size": 13, fill: "var(--blue)" }, `A = ${st.la}: ${A}`));
    svg.append(svgEl("text", { x: cxB + rB / 2, y: cy + 4, "text-anchor": "middle", "font-size": 13, fill: "var(--green)" }, `B = ${st.lb}: ${B}`));
    svg.append(svgEl("text", { x: 20, y: 210, "font-size": 11, fill: "var(--ink-dim)" }, `S: ${S} outcomes · neither: ${S - (A + B - AB)}`));
    if (AB === 0) svg.append(svgEl("text", { x: 620, y: 30, "text-anchor": "end", "font-size": 11, fill: "var(--hl)" }, "mutually exclusive"));
    function paint() {
      const val = { union: [A + B - AB, "P(A ∪ B)"], A: [A, "P(A)"], B: [B, "P(B)"], both: [AB, "P(A ∩ B)"], neither: [S - (A + B - AB), "P(neither) = 1 − P(A ∪ B)"] }[region];
      grid(out, [["P(A)", frac(A, S)], ["P(B)", frac(B, S)], ["P(A ∩ B)", frac(AB, S)], ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", frac(A + B - AB, S), `${A}/${S} + ${B}/${S} − ${AB}/${S}`], ["P(Ā) = 1 − P(A)", frac(S - A, S)], [`selected region: ${val[1]}`, frac(val[0], S)]]);
      const indep = Math.abs(AB / S - (A / S) * (B / S)) < 1e-9;
      work.innerHTML = bad ? `<div class="step error">These counts are impossible: |A ∩ B| cannot exceed |A| or |B|, and |A ∪ B| cannot exceed |S|.</div>` : (AB === 0
        ? `<div class="step final"><b>Mutually exclusive</b>: A and B cannot both happen in one trial, so P(A ∩ B) = 0 and the addition rule collapses to P(A ∪ B) = P(A) + P(B) = ${frac(A + B, S)}.</div>`
        : `<div class="step">Not mutually exclusive: ${AB} outcome${AB > 1 ? "s are" : " is"} in both, so adding P(A) and P(B) would count ${AB > 1 ? "them" : "it"} twice. Subtract the overlap once.</div>`)
        + `<div class="step ${indep ? "final" : ""}">Independence check: P(A)·P(B) = ${fmtNum((A / S) * (B / S), 4)} versus P(A ∩ B) = ${fmtNum(AB / S, 4)} → ${indep ? "<b>independent</b>" : "<b>dependent</b>"} (mutually exclusive events with positive probabilities are always dependent: knowing A happened tells you B did not).</div>`;
    }
    paint();
  }
  draw();
}

// ---------- widget: birthday ----------
function birthday(box, cfg) {
  box.append(el("h4", null, cfg.title || "The birthday problem: P(at least two share a birthday)"));
  let n = cfg.n ?? 23;
  box.append(note("Work through the complement: the probability that all n birthdays are different is a product of shrinking fractions. One minus that is the probability of a match."));
  const s = slider("People in the room n", 1, 70, 1, n, (v) => { n = v; draw(); }, (v) => `n = ${v}`);
  const out = el("div", "stat-grid"), svg = svgEl("svg", { viewBox: "0 0 640 200", class: "curve-svg net-svg" }), work = el("div", "stat-steps"), simRow = el("div", "unit-row"), code = rcode("");
  const simBtn = el("button", "reset-btn", "Simulate 10 000 rooms"), simOut = el("span", "stat-note", "");
  simRow.append(simBtn, simOut);
  box.append(s.row, out, svg, work, simRow, code);
  const pNoMatch = (k) => { let p = 1; for (let i = 0; i < k; i++) p *= (365 - i) / 365; return p; };
  simBtn.addEventListener("click", () => { let hits = 0; for (let t = 0; t < 10000; t++) { const seen = new Set(); for (let i = 0; i < n; i++) { const d = Math.floor(Math.random() * 365); if (seen.has(d)) { hits++; break; } seen.add(d); } } simOut.textContent = `simulated: ${hits}/10000 = ${fmtNum(hits / 10000, 4)} (exact ${fmtNum(1 - pNoMatch(n), 4)})`; });
  function draw() {
    const q = pNoMatch(n), p = 1 - q;
    grid(out, [["P(all different)", fmtNum(q, 4), `= P(365, ${n}) / 365^${n}`], ["P(at least one match) = 1 − P(all different)", fmtNum(p, 4)], ["first shared birthday more likely than not", "n = 23 (0.5073)"]]);
    const terms = Array.from({ length: Math.min(n, 5) }, (_, i) => `${365 - i}/365`);
    work.innerHTML = `<div class="step">P(all different) = ${terms.join(" · ")}${n > 5 ? ` · … · ${365 - n + 1}/365` : ""} = ${fmtNum(q, 4)}. Person 1 can have any birthday; person 2 must avoid one date, person 3 two dates, and so on.</div><div class="step final">P(match) = 1 − ${fmtNum(q, 4)} = <b>${fmtNum(p, 4)}</b> for n = ${n}.</div>`;
    svg.innerHTML = "";
    const X0 = 40, X1 = 620, Y0 = 170, Y1 = 20;
    const xOf = (k) => X0 + ((X1 - X0) * k) / 70, yOf = (v) => Y0 - (Y0 - Y1) * v;
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: "var(--ink-dim)" }));
    svg.append(svgEl("line", { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: "var(--ink-dim)" }));
    for (const v of [0, 0.5, 1]) { svg.append(svgEl("line", { x1: X0, y1: yOf(v), x2: X1, y2: yOf(v), stroke: "var(--rule)", "stroke-dasharray": "2 4" })); svg.append(svgEl("text", { x: X0 - 6, y: yOf(v) + 4, "text-anchor": "end", "font-size": 10, fill: "var(--ink-dim)" }, String(v))); }
    for (const k of [10, 23, 30, 50, 70]) svg.append(svgEl("text", { x: xOf(k), y: Y0 + 14, "text-anchor": "middle", "font-size": 10, fill: "var(--ink-dim)" }, String(k)));
    svg.append(svgEl("polyline", { points: Array.from({ length: 71 }, (_, k) => `${xOf(k).toFixed(1)},${yOf(1 - pNoMatch(k)).toFixed(1)}`).join(" "), fill: "none", stroke: "var(--blue)", "stroke-width": 2 }));
    svg.append(svgEl("circle", { cx: xOf(n), cy: yOf(p), r: 5, fill: "var(--hl)" }));
    svg.append(svgEl("text", { x: xOf(n) + 8, y: yOf(p) - 6, "font-size": 11, fill: "var(--hl)" }, `n = ${n}: ${fmtNum(p, 3)}`));
    code.textContent = `n.people <- ${n}\nprob.no.match <- prod((365 - 0:(n.people-1)) / 365)   # ${fmtNum(q, 4)}\n1 - prob.no.match                                    # ${fmtNum(p, 4)}`;
  }
  draw();
}

// ---------- widget: two-way ----------
function twoWay(box, cfg) {
  box.append(el("h4", null, cfg.title || "A two-way table: conditional probability and independence"));
  const rows = cfg.rows || ["Left", "Right", "Ambidextrous"], cols = cfg.cols || ["iPhone", "Android", "Other"];
  const data = (cfg.data || [[5, 2, 1], [52, 5, 4], [1, 0, 1]]).map((r) => r.slice());
  box.append(note("Click a row name to restrict the sample space to that row, a column name for that column, or a cell for its joint probability. Every conditional probability is a count divided by a row or column total."));
  const wrap = el("div", "table-wrap"), out = el("div", "stat-grid"), work = el("div", "stat-steps");
  box.append(wrap, out, work);
  let sel = { kind: cfg.select || "cell", r: cfg.r ?? 1, c: cfg.c ?? 0 };
  function draw() {
    const rowT = data.map((r) => r.reduce((a, b) => a + b, 0)), colT = cols.map((_, j) => data.reduce((a, r) => a + r[j], 0)), N = rowT.reduce((a, b) => a + b, 0);
    const t = el("table", "group-table tw-table");
    const head = el("tr"); head.append(el("th", null, ""));
    cols.forEach((c, j) => { const th = el("th", sel.kind === "col" && sel.c === j ? "sel" : "", c); th.addEventListener("click", () => { sel = { kind: "col", c: j, r: sel.r }; draw(); }); head.append(th); });
    head.append(el("th", null, "row total"));
    const thead = el("thead"); thead.append(head); t.append(thead);
    const tb = el("tbody");
    rows.forEach((rn, i) => {
      const tr = el("tr");
      const th = el("th", sel.kind === "row" && sel.r === i ? "sel" : "", rn); th.addEventListener("click", () => { sel = { kind: "row", r: i, c: sel.c }; draw(); }); tr.append(th);
      cols.forEach((_, j) => {
        const td = el("td", (sel.kind === "row" && sel.r === i) || (sel.kind === "col" && sel.c === j) ? "sel" : sel.kind === "cell" && sel.r === i && sel.c === j ? "hit" : "");
        const inp = document.createElement("input"); inp.type = "number"; inp.min = 0; inp.value = data[i][j]; inp.className = "q-input small"; inp.setAttribute("aria-label", `${rn} ${cols[j]}`);
        inp.addEventListener("input", () => { data[i][j] = Math.max(0, Math.round(Number(inp.value) || 0)); draw(); });
        inp.addEventListener("focus", () => { sel = { kind: "cell", r: i, c: j }; paint(); });
        td.append(inp); tr.append(td);
      });
      tr.append(el("td", null, String(rowT[i])));
      tb.append(tr);
    });
    const tot = el("tr"); tot.append(el("th", null, "column total")); colT.forEach((c) => tot.append(el("td", null, String(c)))); tot.append(el("td", null, `n = ${N}`)); tb.append(tot);
    t.append(tb);
    wrap.innerHTML = ""; wrap.append(t);
    paint();
    function paint() {
      const i = sel.r, j = sel.c, R = rows[i], C = cols[j], cellV = data[i][j];
      const pR = rowT[i] / N, pC = colT[j] / N, pRC = cellV / N;
      const indep = Math.abs(pRC - pR * pC) < 1e-9;
      if (sel.kind === "row") {
        grid(out, [[`P(${R}) = row total / n`, frac(rowT[i], N)], ...cols.map((c, jj) => [`P(${c} | ${R}) = ${data[i][jj]} / ${rowT[i]}`, frac(data[i][jj], rowT[i])])]);
        work.innerHTML = `<div class="step final">Given <b>${R}</b>, the sample space shrinks to that row (${rowT[i]} students). Each conditional probability is the cell count over the <b>row</b> total, and the row's conditionals add to 1.</div>`;
      } else if (sel.kind === "col") {
        grid(out, [[`P(${C}) = column total / n`, frac(colT[j], N)], ...rows.map((r, ii) => [`P(${r} | ${C}) = ${data[ii][j]} / ${colT[j]}`, frac(data[ii][j], colT[j])])]);
        work.innerHTML = `<div class="step final">Given <b>${C}</b>, only that column counts (${colT[j]} students): cell over the <b>column</b> total.</div>`;
      } else {
        grid(out, [[`P(${R} ∩ ${C}) = cell / n`, frac(cellV, N)], [`P(${R})`, frac(rowT[i], N)], [`P(${C})`, frac(colT[j], N)], [`P(${C} | ${R}) = cell / row total`, frac(cellV, rowT[i])], [`P(${R} | ${C}) = cell / column total`, frac(cellV, colT[j])], [`P(${R}) · P(${C})`, fmtNum(pR * pC, 4)]]);
        work.innerHTML = `<div class="step">Two different conditionals from one cell: P(${C} | ${R}) restricts to the row, P(${R} | ${C}) restricts to the column. Also P(${R} ∩ ${C}) = P(${R}) · P(${C} | ${R}) = ${fmtNum(pR, 4)} × ${fmtNum(cellV / rowT[i], 4)} = ${fmtNum(pRC, 4)} (multiplication rule).</div><div class="step ${indep ? "final" : "error"}">Independence test: P(${R} ∩ ${C}) = ${fmtNum(pRC, 4)} versus P(${R}) · P(${C}) = ${fmtNum(pR * pC, 4)} → <b>${indep ? "independent" : "dependent"}</b>${indep ? "" : `; equivalently P(${C} | ${R}) = ${fmtNum(cellV / rowT[i], 4)} ≠ P(${C}) = ${fmtNum(pC, 4)}`}.</div>`;
      }
    }
  }
  draw();
}

// ---------- widget: bayes-tree ----------
const BAYES_PRESETS = {
  "sex and handedness": { branches: [["Female", 0.6], ["Male", 0.4]], B: "Left-handed", notB: "Right-handed", cond: [0.05, 0.15] },
  "defective CPUs": { branches: [["Intel", 0.85], ["AMD", 0.10], ["Other", 0.05]], B: "Defective", notB: "Non-defective", cond: [0.01, 0.03, 0.02] },
};
function bayesTree(box, cfg) {
  box.append(el("h4", null, cfg.title || "Bayes' rule on a tree diagram"));
  const names = Object.keys(BAYES_PRESETS);
  let st = JSON.parse(JSON.stringify(BAYES_PRESETS[cfg.preset || names[0]]));
  box.append(note("Priors on the first branches, conditional probabilities on the second. Multiply along a path for a joint probability; add the paths that end in B for P(B); divide a path by P(B) to reverse the condition."));
  box.append(btnRow(names, (i) => { st = JSON.parse(JSON.stringify(BAYES_PRESETS[names[i]])); rebuild(); }, names.indexOf(cfg.preset || names[0])));
  const inputs = el("div", "oop-controls"), svg = svgEl("svg", { viewBox: "0 0 640 260", class: "curve-svg net-svg bayes-svg" }), out = el("div", "table-wrap"), work = el("div", "stat-steps");
  box.append(inputs, svg, out, work);
  function rebuild() {
    inputs.innerHTML = "";
    st.branches.forEach(([name, p], i) => {
      const f1 = numField(`P(${name})`, p, (v) => { st.branches[i][1] = v; draw(); }, 0.01);
      const f2 = numField(`P(${st.B} | ${name})`, st.cond[i], (v) => { st.cond[i] = v; draw(); }, 0.01);
      const row = el("div", "unit-row"); row.append(f1.row, f2.row); inputs.append(row);
    });
    draw();
  }
  function draw() {
    const k = st.branches.length, priors = st.branches.map((b) => b[1]), sumP = priors.reduce((a, b) => a + b, 0);
    const joint = priors.map((p, i) => p * st.cond[i]), PB = joint.reduce((a, b) => a + b, 0);
    svg.innerHTML = "";
    const rowH = 260 / k;
    st.branches.forEach(([name], i) => {
      const y = rowH * (i + 0.5);
      svg.append(svgEl("line", { x1: 30, y1: 130, x2: 200, y2: y, stroke: "var(--ink-dim)" }));
      svg.append(svgEl("text", { x: 100, y: (130 + y) / 2 - 6, "font-size": 11, fill: "var(--hl)" }, fmtNum(priors[i], 3)));
      svg.append(svgEl("text", { x: 205, y: y + 4, "font-size": 12, fill: "var(--ink)" }, name));
      for (const [j, lab, p] of [[0, st.B, st.cond[i]], [1, st.notB, 1 - st.cond[i]]]) {
        const y2 = y + (j ? 16 : -16);
        svg.append(svgEl("line", { x1: 290, y1: y, x2: 400, y2: y2, stroke: j ? "var(--rule-strong)" : "var(--green)" }));
        svg.append(svgEl("text", { x: 345, y: (y + y2) / 2 + (j ? 12 : -4), "font-size": 11, fill: j ? "var(--ink-dim)" : "var(--green)" }, fmtNum(p, 3)));
        svg.append(svgEl("text", { x: 405, y: y2 + 4, "font-size": 11, fill: j ? "var(--ink-dim)" : "var(--ink)" }, `${lab}: ${fmtNum(priors[i] * p, 4)}`));
      }
    });
    svg.append(svgEl("text", { x: 30, y: 122, "font-size": 11, fill: "var(--ink-dim)" }, "start"));
    let html = `<table class="group-table"><thead><tr><th>A<sub>i</sub></th><th>P(A<sub>i</sub>)</th><th>P(B | A<sub>i</sub>)</th><th>P(A<sub>i</sub> ∩ B) = product</th><th>P(A<sub>i</sub> | B) = joint / P(B)</th><th>per 10 000</th></tr></thead><tbody>`;
    st.branches.forEach(([name], i) => { html += `<tr><td>${esc(name)}</td><td>${fmtNum(priors[i], 3)}</td><td>${fmtNum(st.cond[i], 3)}</td><td>${fmtNum(priors[i], 3)} × ${fmtNum(st.cond[i], 3)} = ${fmtNum(joint[i], 4)}</td><td>${fmtNum(joint[i], 4)} / ${fmtNum(PB, 4)} = <b>${fmtNum(joint[i] / PB, 4)}</b></td><td>${Math.round(10000 * priors[i])} ${esc(name)}, ${Math.round(10000 * joint[i])} with ${esc(st.B)}</td></tr>`; });
    html += `<tr><td><b>total</b></td><td>${fmtNum(sumP, 3)}</td><td></td><td><b>P(B) = ${fmtNum(PB, 4)}</b></td><td>${fmtNum(joint.reduce((a, j) => a + j / PB, 0), 3)}</td><td>${Math.round(10000 * PB)} with ${esc(st.B)} in all</td></tr></tbody></table>`;
    out.innerHTML = html;
    work.innerHTML = (Math.abs(sumP - 1) > 1e-6 ? `<div class="step error">The priors add to ${fmtNum(sumP, 3)}, not 1: the A<sub>i</sub> must be exhaustive and mutually exclusive.</div>` : "")
      + `<div class="step">P(${esc(st.B)}) = ${st.branches.map(([n], i) => `${fmtNum(priors[i], 3)}(${fmtNum(st.cond[i], 3)})`).join(" + ")} = ${joint.map((j) => fmtNum(j, 4)).join(" + ")} = <b>${fmtNum(PB, 4)}</b>: the law of total probability (add every path that ends in ${esc(st.B)}).</div>`
      + `<div class="step final">Bayes: P(${esc(st.branches[0][0])} | ${esc(st.B)}) = P(${esc(st.branches[0][0])} ∩ ${esc(st.B)}) / P(${esc(st.B)}) = ${fmtNum(joint[0], 4)} / ${fmtNum(PB, 4)} = <b>${fmtNum(joint[0] / PB, 4)}</b>. The condition is reversed: we started from P(${esc(st.B)} | ${esc(st.branches[0][0])}) = ${fmtNum(st.cond[0], 3)}.</div>`;
  }
  rebuild();
}

// ---------- widget: sim-lab ----------
// The Lab 4 experiments: distribution of X from m simulated trials, the estimated P(E), and the R.
const SIM = {
  coins: { name: "n coins: X = number of heads", n: [1, 100, 10], hasP: true, hasReplace: false, event: (n) => Math.round(n / 2), r: (m, n, p, rep) => `Flip.Once <- function(){ return( sample(c("H","T"), 1${p !== 0.5 ? `, prob=c(${p}, ${fmtNum(1 - p, 3)})` : ""}) ) }\nX.vals <- replicate(${m}, sum(replicate(${n}, Flip.Once()) == "H"))\nbarplot(prop.table(table(X.vals)), xlab="X = # heads", ylab="rel. freq.")` },
  dice2: { name: "two dice: X = the sum", n: null, hasP: false, hasReplace: false, event: () => 7, r: (m) => `Prob.E <- function(m){\n  X.vals <- replicate(m, sum( sample.int(6, 2, replace=TRUE) ))\n  k <- sum(X.vals == 7)\n  return(k/m)\n}\nProb.E(${m})` },
  dice3: { name: "n dice: X = number of 3s", n: [1, 100, 5], hasP: false, hasReplace: false, event: (n) => Math.round(n / 6), r: (m, n) => `Roll.Some.Dice <- function(m, n){\n  X.vals <- replicate(m, sum(sample.int(6, n, replace=TRUE)==3))\n  X.tab <- table(X.vals)\n  barplot(X.tab, col="pink", xlab="X = # 3s", ylab="Frequency",\n          main=paste0("Number of 3s Out of ", n, " Dice (Based on ", m, " Trials)"))\n}\nRoll.Some.Dice(${m}, ${n})` },
  cards: { name: "n cards: X = number of red cards", n: [1, 50, 5], hasP: false, hasReplace: true, event: (n) => Math.round(n / 2), r: (m, n, p, rep) => `Draw.Cards <- function(m, n, replace){\n  deck <- c(rep("R", 26), rep("B", 26))\n  X.vals <- replicate(m, sum(sample(deck, n, replace) == "R"))\n  histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1),\n            xlab="X = # red cards", ylab="Prob. Density",\n            main=paste0("Number of Red Cards Out of ", n, " Cards (", m, " Trials)"))\n}\nDraw.Cards(${m}, ${n}, ${rep ? "TRUE" : "FALSE"})` },
};
function simLab(box, cfg) {
  box.append(el("h4", null, cfg.title || "Lab 4 simulations: the distribution of X from m trials"));
  const keys = Object.keys(SIM);
  let key = SIM[cfg.experiment] ? cfg.experiment : "dice3";
  let m = cfg.m ?? 1000, n = cfg.n ?? SIM[key].n?.[2] ?? 2, p = cfg.p ?? 0.5, replace = cfg.replace ?? false, target = cfg.target ?? null;
  box.append(note("Choose an experiment, the number of trials m and the number of items n, then run. The bars are the relative frequencies of each value of X; the highlighted bar is the event E you are estimating."));
  if (!cfg.experiment) box.append(btnRow(keys.map((k) => SIM[k].name), (i) => { key = keys[i]; n = SIM[key].n?.[2] ?? n; target = null; rebuild(); }, keys.indexOf(key)));
  const ctl = el("div"), runRow = btnRow(["m = 100", "m = 1 000", "m = 10 000", "run again"], (i) => { if (i < 3) m = [100, 1000, 10000][i]; run(); }, [100, 1000, 10000].indexOf(m));
  const chart = el("div"), out = el("div", "stat-grid"), code = rcode(""), evRow = el("div");
  box.append(ctl, runRow, evRow, chart, out, code);
  let counts = [], labels = [], xs = [];
  function rebuild() {
    ctl.innerHTML = "";
    const S = SIM[key];
    if (S.n) ctl.append(slider("n (items per trial)", S.n[0], S.n[1], 1, Math.min(S.n[1], Math.max(S.n[0], n)), (v) => { n = v; target = null; run(); }, (v) => `n = ${v}`).row);
    if (S.hasP) ctl.append(slider("P(H) for one coin", 0.05, 0.95, 0.05, p, (v) => { p = v; run(); }, (v) => `p = ${fmtNum(v, 2)}`).row);
    if (S.hasReplace) ctl.append(toggle("replace = TRUE (put each card back before the next draw)", replace, (v) => { replace = v; run(); }).row);
    run();
  }
  function trial() {
    if (key === "coins") { let h = 0; for (let i = 0; i < n; i++) if (Math.random() < p) h++; return h; }
    if (key === "dice2") return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
    if (key === "dice3") { let c = 0; for (let i = 0; i < n; i++) if (Math.floor(Math.random() * 6) === 2) c++; return c; }
    let red = 26, tot = 52, c = 0;
    for (let i = 0; i < n; i++) { const isRed = Math.random() < red / tot; if (isRed) c++; if (!replace) { tot--; if (isRed) red--; } }
    return c;
  }
  function run() {
    const S = SIM[key];
    xs = new Array(m);
    for (let i = 0; i < m; i++) xs[i] = trial();
    const lo = key === "dice2" ? 2 : 0, hi = key === "dice2" ? 12 : n;
    labels = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    counts = labels.map(() => 0);
    for (const x of xs) counts[x - lo]++;
    if (target == null || target < lo || target > hi) target = S.event(n);
    evRow.innerHTML = "";
    const evS = slider("Event E: X =", lo, hi, 1, target, (v) => { target = v; paint(); }, (v) => `X = ${v}`);
    evRow.append(evS.row);
    paint();
  }
  function paint() {
    const S = SIM[key];
    const lo = labels[0];
    bars(chart, counts, labels, new Set([target - lo]), m);
    const k = counts[target - lo] || 0;
    const mean = xs.reduce((a, b) => a + b, 0) / m;
    const exact = key === "dice2" ? `${6 - Math.abs(7 - target)}/36 = ${fmtNum((6 - Math.abs(7 - target)) / 36, 4)}` : key === "coins" && n === 1 ? (target === 1 ? fmtNum(p, 4) : fmtNum(1 - p, 4)) : "(later: binomial / hypergeometric)";
    const center = key === "coins" ? `n·p = ${fmtNum(n * p, 2)}` : key === "dice2" ? "7" : key === "dice3" ? `n/6 = ${fmtNum(n / 6, 2)}` : `n/2 = ${fmtNum(n / 2, 2)}`;
    grid(out, [["trials m", big(m)], [`successes k (X = ${target})`, big(k)], [`P(E) ≈ k/m`, fmtNum(k / m, 4), `exact: ${exact}`], ["mean of X over the trials", fmtNum(mean, 3), `theory: ${center}`], ["standard deviation of X", fmtNum(Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (m - 1)), 3)]]);
    code.textContent = S.r(m, n, p, replace) + `\n# estimate: P(X = ${target}) ≈ ${k}/${m} = ${fmtNum(k / m, 4)}`;
  }
  rebuild();
}

export const WIDGETS = {
  "sample-space": sampleSpace,
  "lln-sim": llnSim,
  "counting-calc": countingCalc,
  "prob-rules": probRules,
  "birthday": birthday,
  "two-way": twoWay,
  "bayes-tree": bayesTree,
  "sim-lab": simLab,
};
