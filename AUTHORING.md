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
1. Static code: ```` ```cpp ```` / ```` ```r ```` / ```` ```text ```` (text → labelled "output").
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
- Do NOT edit engine files (`app/`, `server.js`, `course.json`). Only write your assigned chapter files.
