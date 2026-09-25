# Lesson authoring contract

Lessons are markdown files in `courses/<course>/chapters/NN-slug.md`, rendered by `app/markdown.js`.
Validate with `bun validate.js courses/<course>/chapters/NN-slug.md` (server must be running on :4321; it compiles every C++ block).

## Front matter (required)
```
---
title: Lesson title
minutes: 15
---
```

## Supported markdown
- `#`–`####` headings, paragraphs, `-` / `1.` lists (2-space continuation lines OK), `> quote`, `---` rule
- tables with `| a | b |` + `|---|---|` separator
- inline: `` `code` ``, `**bold**`, `*italic*`, `[text](url)`
- inline math between `$...$` (LaTeX subset): `\frac{a}{b}` / `\dfrac`, `\sqrt{x}`, `\bar{X}`, `\hat{p}`, `\tilde{X}`, `\text{words}`, `\mathbf{x}`,
  `^{..}`, `_{..}`, `\sum \mu \sigma \rho \pm \times \cdot \le \ge \ne \approx \infty \in \ldots \to \min \max \%`, `\quad`/`\qquad` spacing. Display math: `$$...$$` on its own line (centred, larger). The opening `$` must be followed by a non-space and the closing `$` preceded by a non-space, so R's `df$col` in prose is safe (put R code in backticks anyway).
:::tip Optional title
Body markdown (paragraphs, lists).
:::
```
  kinds: `tip` (green), `warn` (yellow), `danger` (red), `quiz` / `exam` (purple, use for "the quiz asks this" notes), `info` (blue, default).

## Fenced blocks
1. Static code: ```` ```cpp ```` / ```` ```r ```` / ```` ```pseudo ```` (pseudocode: keywords in the COMP 3760 dialect highlighted) / ```` ```text ```` (text → labelled "output").
2. Runnable, editable C++ (compiled with g++ -std=c++20 -Wall -Wextra -pedantic; 5 s limit):
````
```cpp run
// stdin: 12 34\n56
#include <iostream>
int main() { ... }
```
````
   `// stdin:` line is optional; it pre-fills the stdin box (`\n` = Enter) and is stripped from the code. **Any program that reads cin MUST have a `// stdin:` line** or validation fails with a timeout.
2b. Pinned example. Prefer the runnable form — one block, docked beside the prose that follows (until the next heading of the same or higher level), editable and runnable in place:
````
```cpp run pin precisionAndWidth.cpp
// stdin: 3 4
// predict: Input is 3 4. Write every line printed.
#include <iostream>
...
```
````
   `cpp pin <title>` (no `run`) gives a read-only listing for code that cannot run alone (multi-file, or intentionally non-compiling). Never keep a separate `cpp run` copy of a pinned program — one copy only (redundancy hurts learning).
   `// predict:` asks the student to write the expected output before Run is enabled and grades the guess against real stdout (generation effect). Use it on every program whose output the prose explains.
   **Reference linking is automatic**: every inline `` `code` `` span in the section whose text occurs in the program (respecting identifier boundaries, so `ostream` does not match `iostream`) highlights the matching line(s) on hover, and vice versa, even after the student edits the code. Quote the lines you explain verbatim in backticks. `validate.js` fails a pin with fewer than 2 linkable references.
3. Challenge (graded by stdout equality, whitespace-trimmed per line):
````
```challenge
{ "prompt": "HTML allowed", "starter": "code\n", "expected": "exact stdout", "stdin": "optional", "hints": ["html", "..."], "solution": "full working code (validated by compiling)" }
```
````
4. Quiz (JSON array). Question text/options/explain support `` `code` ``, `**bold**`, `$math$`:
````
```quiz
[
  { "q": "MCQ?", "options": ["a", "b", "c", "d"], "answer": 1, "explain": "why" },
  { "q": "Select all", "options": ["a", "b", "c"], "answer": [0, 2], "explain": "why" },
  { "q": "True or false", "type": "tf", "answer": false, "explain": "why" },
  { "q": "Compute", "type": "numeric", "answer": 0.9788, "tolerance": 0.002, "unit": "cm", "explain": "worked steps" },
  { "q": "Name it", "type": "text", "answer": ["median", "Q2"], "explain": "why" },
  { "q": "What prints?", "code": "int x = 5;\ncout << x++ << x;", "options": ["55", "56", "65", "66"], "answer": 1, "explain": "..." }
]
```
````
   `code` (string) shows a code box under the question. Default numeric tolerance = 0.5% of answer.
   Interactive types (see `app/q-*.js`): `fill` (`code` with `___` blanks, `answer`), `reorder` (`lines`), `spotbug` (`code`, `answer` = 1-based row number(s) to click; add `"lang": "pseudo"` for pseudocode), `match` (`pairs: [[left, right], …]`), `shade` (normal-curve region), `trace` (`code`, `steps`).
5. Widget (first line = name, remaining lines = optional JSON config):
````
```widget
stat-calc
{ "data": "5.0 4.5 6.0 7.0 5.2" }
```
````

## Widget catalogue
C++ (`app/widgets-cpp.js`):
- `compile-pipeline` — clickable preprocessor→compiler→linker→exe diagram (headers vs sources, #include pasting, #pragma once, linker errors).
- `type-sizes` — clickable sizeof/range cards for bool, char, short, int, long, long long, float, double, long double, void.
- `init-forms` — pick source type/value and target type → shows `=`, `()`, `{}` results, narrowing error.
- `expr-stepper` — step-by-step evaluation of an expression. cfg: `{ "expr": "x++ + ++x", "env": {"x": 3}, "presets": ["...", "..."] }` (variables must be declared in env; default env x=3,a=1,n=1). Supports + - * / % << >> comparisons && || ! ?: , = += etc, ++/-- pre/post, parentheses, int and float literals.
- `int-division` — sliders a, b → a/b, a%b, casts.
- `cin-sim` — simulates `cin >>` on typed input showing failbit/eofbit/buffer. cfg: `{ "reads": ["int n","int m","string word"], "input": "12abc", "presets": {"label": "input", ...} }`.
- `manipulators` — toggle hex/oct/showbase/uppercase/showpos/fixed/scientific/showpoint/boolalpha/left/right/internal + setw/setfill/setprecision → shows exactly what cout prints.
- `bitwise` — 8-bit a, b with clickable bits → & | ^ ~ << >> and compound forms.
- `namespaces` — the three `using` options from the slides, side by side.

Stats (`app/widgets-stats.js`):
- `stat-calc` — full descriptive-stats calculator + boxplot + worked s. cfg: `{ "data": "…", "presets": {"label": "data", …}, "title": "…" }`.
- `normal-curve` — μ, σ, X slider → Z, % below, empirical-rule bands, unusual flag. cfg: `{ "mu": 100, "sigma": 15, "x": 130, "presets": {"label": [mu, sigma, x]} }`.
- `chebyshev` — k slider: 1−1/k² vs normal.
- `boxplot` — data → sorted values, quartiles (R + hand method), IQR, fences, outliers, drawn boxplot. cfg: `{ "data": "…", "note": "…" }`.
- `scatter-corr` — draggable scatter with live r and the formula filled in; presets incl. the lecture circuit data.
- `grouped-mean` — editable Xᵢ/fᵢ table → grouped mean and sd. cfg: `{ "rows": [[x,f],…], "title": "…" }`.
- `skewness` — skew slider showing mean vs median and Pearson Sk.
- `proportion` — editable frequency table → p̂ per category, mode. cfg: `{ "categories": {"Black": 95, …} }`.

Stats, Unit 2 (`app/widgets-viz.js`; datasets in `app/data-stats.js`: faithful, quine, BCIT.students, mtcars, precip, cats, gold, plywood):
- `cat-charts` — editable frequency table → R-style pie (counter-clockwise from 3 o'clock, R's default colours) and lightgreen bar chart, mode row, the `table()`/`pie()`/`barplot()` code and named-vector indexing (`[3]`, `["Brown"]`, `[[3]]`). cfg: `{ "categories": {"Black": 95, …}, "title": "…" }`.
- `stem-leaf` — data → stem | leaf plot with R's header line and key, leaf-unit selector (tens…thousandths), split / single / double stems. cfg: `{ "data": "…", "unit": 1, "width": 1, "preset": "20 heights (lecture)" }`. Presets: 20 heights, all 302 heights, Old Faithful (rounded), BCIT Age.
- `hist-builder` — the 7-step class recipe live (√n, R/√n, precision, first lower limit, limits table with frequency / rel / cumulative / cum-rel, histogram) with editable width and start, √n-suggest and too-many/too-few buttons, R-style floating-point `seq()` breaks so counts match `hist(..., right = FALSE)`. cfg: `{ "preset": "Old Faithful eruptions (n = 272)" }` or `{ "data": "…", "width": 2, "start": 18, "label": "Age" }`. Presets: BCIT Age, Old Faithful, Plywood, quine Days, Gold.
- `ogive` — cumulative relative frequency vs upper class limits (plus the 0 point), draggable vertical guide (% below X) and horizontal guide (X at percentile p), class table. cfg: `{ "preset": "Test scores, 2287 students (Lab 2 pencil #4)" }`. Presets: Old Faithful, Test scores, BCIT Age, quine Days.
- `group-stats` — quine Days grouped: favstats-style table (min Q1 median Q3 max mean sd n CV Sk), side-by-side boxplots with fences/outliers, the R code (`favstats(Days~Sex, data=quine)`, `bwplot`, `mean(Days~Eth+Sex)`), grouped percentiles from an editable probs list, and the |Z| > k / Chebyshev / empirical check. cfg: `{ "by": "Sex" }` or `{ "by": ["Eth", "Sex"] }` or `{ "by": [] }`, `"probs": "0.2 0.4 0.6 0.8"`.

C++, Week 2 (`app/widgets-cpp2.js`):
- `pointer-viz` — steps a small C++ program (declarations, pointers, references, `=`, `+=`, `++`, `*p`, `&x`, `new`/`new[]`/`delete`/`delete[]`, `cout`, function calls with by-value / pointer / reference parameters) and draws stack frames, heap boxes, addresses (0xffffcc10…, 0xffff000a…), arrows, dangling and LEAKED markers, with a per-step explanation and an optional watch table. cfg: `{ "preset": "swap with pointers" }` or `{ "program": "…", "watch": ["x", "y"], "presets": false, "title": "…" }`. Presets: "Practice activity (fill in x and y)", "swap by value (does it work?)", "swap with pointers", "swap with references", "reference = alias", "numRef = num2", "test(int& x, int y, int* z)", "memory leak", "leak fixed", "new / delete / new[]", "references to constants".
- `file-seek` — "Hello World" file with a cursor: open as ifstream / ofstream / ofstream+app / fstream (ofstream truncates!), tellg/tellp, seekg/seekp absolute or (offset, ios::beg/cur/end), the four slide examples (6, 4, 7, 1), get/put, file size; wrong-member calls show the compile error. cfg: `{ "content": "Hello World", "title": "…" }`.
- `open-modes` — stream class + in/out/app/trunc/ate/binary toggles → the constructor call, effective mode (fopen equivalent), whether open succeeds, whether contents are kept, cursor start.
- `rand-range` — `rand() % m + offset` range calculator with sliders, the `<random>` equivalent, and seeded rolls showing that the same seed replays the same sequence.
- `getline-sim` — `getline(cin, s)` vs `cin >> s` on typed input (`\n` = Enter, `*` = EOF): per-call buffer, string, eofbit/failbit; presets are the slide's failure table. cfg: `{ "input": "Hello\\nworld\\n", "calls": 2, "delim": "" }`.
- `vector-viz` — `vector<int>` cells with size and capacity (doubling), push_back / at / [] / erase(begin()+i) / pop_back / clear / ranged-for, and the C++ log of what you clicked. cfg: `{ "values": [5, 10, 15] }`.

Networking (`app/widgets-net.js`, COMP 3721):
- `topology` — Mesh/Star/Bus/Ring buttons + n slider (2–12) → drawn topology, link count and formula. cfg: `{ "type": "mesh", "n": 6, "title": "…" }`.
- `sine-wave` — A, f, φ sliders → time-domain plot (1 s) with T and shift markers, frequency-domain spike, T/ω/φ(rad)/equation. cfg: `{ "A": 1, "f": 2, "phase": 0, "presets": {"label": [A, f, phaseDeg]} }`.
- `freq-period` — two-way f ↔ T converter with unit prefixes and the worked step. cfg: `{ "f": 60, "unit": "Hz" }` or `{ "T": 200, "unit": "μs" }`.
- `composite` — sum of sine waves from a `freq` / `freq:amp` list → time + frequency domains, lowest/highest/bandwidth/middle frequency. cfg: `{ "components": "1:1 3:0.33 9:0.11", "presets": {"label": "…"} }`.
- `encapsulation` — 18-step walk of a message from source A through a switch and a router to B, showing the active layer and the PDU (H_L, H_N, H_T, M). cfg: `{ "title": "…" }`.
- `signal-levels` — L slider (2–16) → 8-element digital signal with bit labels, log₂ L, ⌈log₂ L⌉, unused patterns, bit rate. cfg: `{ "levels": 4 }`.

Algorithms (`app/widgets-algo.js`, COMP 3760):
- `op-counter` — pseudocode with a per-line execution count column for n = 3, 10, 100 plus a slider and quick buttons up to the preset's safe n, the most frequent row highlighted, a "Reveal the basic operation" button (generation effect), the closed-form C(n), and for find the all-statements f(n). Counts come from running the algorithm in JS with a counter per line, so they are exact. cfg: `{ "preset": "<name>", "n": 10, "mode": "worst"|"best", "presets": false, "title": "…" }`; omit `presets` to show the selector. Presets: "find (largest element)", "Mystery1 (sum of squares)", "Mystery2 (sum of an n×n array)", "Loops (insertion sort)" (worst/best), "CountSomethingElse(N)", "Example3 (halving loop)", "SequentialSearch" (worst/best), "UniqueElements" (worst/best), "MatrixMultiply", "CountSomething2 (isPrime)", "DoSomething() (no input)", "DoSomething(N) (10×10 then N)", "UnusualAdd(A, B)" (equal/different), "Halving with countdown".
- `loop-grid` — one dot per (i, j) pair a double loop visits, per-row counts, the double sum and its closed form, n slider 2–12. cfg: `{ "preset": "square"|"lower"|"upper"|"triangle1", "n": 6, "title": "…" }` (square n², lower = insertion sort (n−1)n/2, upper = unique elements n(n−1)/2, triangle1 = CountSomethingElse n(n+1)/2).
- `growth-plot` — log₂n, n, n log₂n, n², n³, 2ⁿ, n! toggles on a log-y plot, an n slider that reads every value, and Table 2.1 at n = 10 … 10⁶ (2ⁿ and n! left blank past 100 as in the textbook). cfg: `{ "show": ["n", "n^2", "2^n"], "nmax": 30, "title": "…" }`.
- `big-o-check` — f(n) and g(n) expression boxes (n, numbers, + − * / ^, parentheses, implicit multiplication, log/log2 base 2, sqrt, n!), c / c₂ / n₀ sliders, O / Ω / Θ modes, a slide-70 style table (n, f(n), c·g(n), holds?), a plot with the n₀ line and the region where the relation holds, and a verdict checked numerically up to n = 10⁶. cfg: `{ "f": "2n+6", "g": "n", "c": 4, "n0": 3, "mode": "O"|"Omega"|"Theta", "c2": 1, "presets": false, "title": "…" }`.
- `fib-race` — n slider 1–40: fib(n), recursive call count vs fib2 loop count, the call tree for n ≤ 7 with recomputed nodes in red, a per-k "times recomputed" bar list, and the slide's measured ms table (N = 30..40). cfg: `{ "n": 6, "title": "…" }`.

## Learning design (why the format is what it is)
- Explanation sits beside the code it explains (spatial contiguity), never above a scrolled-away block. Pin the program.
- One copy of any program (redundancy principle). Highlight only what is being discussed (signaling); a wrong highlight is worse than none.
- Make the student produce before revealing: `// predict:` on runnable examples, numeric answers before worked solutions.
- Every quiz miss is queued for review and re-asked across lessons until answered correctly twice (retrieval practice, spacing, interleaving, successive relearning — Dunlosky et al. 2013). Write explanations so they teach on re-read, not just confirm.

## Style
- Boot.dev style: short sections, one idea each; **explain then let them try**; every lesson ends with a `quiz` block of 5–10 questions that mirror the real quiz format (MCQ, true/false, "which of these", "what does this print", numeric for stats).
- Ground everything in the instructor's material (slide wording, sample code, worked numbers). Where the slides make a claim that is a likely true/false trap, call it out in a `:::quiz` callout.
- Visual first: use a widget wherever a concept can be seen. Use `cpp run` blocks generously (C++ course) — the student learns by editing and running.
- No emojis. No filler. Technical but friendly.
- Concise prose (house rule since the 2026-09-25 review; the reviewer found Week 2 lessons twice the density of Week 1 for the same material):
  - One telling per fact. The code comment says what a line does; one sentence beside the code says why or gives the number. No "line by line" list that restates the comments, and no callout that restates the paragraph above it. A `:::quiz` callout exists only for a trap the prose has not already stated.
  - Instructor quotes only when they carry a mental model or a rule the quiz uses (the box with a nickname, dynamic = manual, keep a tally, seed once). No colour quotes.
  - The intro is one or two sentences stating the problem the lesson solves. No table-of-contents sentence ("This lesson covers ...").
  - No stage directions ("Read it inside out", "Run it", "Now drive it yourself") and no quiz meta-talk ("the quiz will ask", "students lose marks on this every term").
  - Trivial members (`close()`, `exit(1)`) get one sentence. Short sentences; no parenthetical asides.
  - Headings and callout titles state the fact or name the thing. Never the format: no "the one-sentence version", "the rule in one line", "What it is", "Good to know", "Summary", "Quick recap", "Try it". A `quiz` block gets no heading at all (its box is already labelled); a widget section is headed by what the widget shows.
  - Budget: 500-800 prose words per lesson outside code and quizzes. A lesson over 900 is restating something. Mock quizzes, cheat sheets and formula sheets are reference material and are exempt.
- Do NOT edit engine files (`app/`, `server.js`, `course.json`). Only write your assigned chapter files.
