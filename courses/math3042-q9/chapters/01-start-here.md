---
title: "Quiz 9: the format, the marks, and the shortest path"
minutes: 5
---
<!-- facts: none; a reference page about the quiz format, the announcement and the posted Part 2 template, with no worked examples -->
Quiz 9 is in your next lab session. This page says what it covers, what each part can ask, and which lessons to open first.

## The announcement

:::quiz What the instructor posted
The quiz this week covers:

- Sampling Distribution of p-hat and X-bar: lecture notes sections 6.1 and 6.3 (up to pg 93); Lab 9.
- Confidence intervals for p-hat: lecture notes section 6.2; Unit 7 practice problems.
- Normality testing with QQ plot: see Lab 9.
:::

In this module's words: the pile of p-hat and the pile of X-bar, the confidence interval for a proportion, and the QQ plot. All of it is one picture, drawn in [Everything on Quiz 9 is one pile of dots](#/math3042-q9/one-picture).

The practice problems are the first two of the confidence-interval sheet, the ones about proportions. The rest of that sheet uses the t distribution, which is not on this quiz.

## Two parts, 20 marks

| Part | What you do | Marks |
|---|---|---|
| Part 1 | Paper and pencil with a calculator. The formula sheet and the Z table are handed out | 10 |
| Part 2 | Fill in the posted notebook template in RStudio, then knit it | 10 |

**Part 2 is marked on the knitted file, and Knit re-runs every chunk from the top.** So `library(mosaic)`, which holds `histogram`, must sit in a chunk above the first `histogram` call; the top chunk is safest. The template asks you to show all your code with `include=TRUE`.

## Part 1 asks one of three shapes

The covered notes and practice problems ask three shapes of question. Each one is a fact about the pile.

1. **Describe a sampling distribution: its mean, its standard deviation, and its shape with the reason.** For example, "averages of 36 bottles from a line filling 500 mL on average": centre, width $\sigma/\sqrt{n}$, and "normal because n is 30 or more".
2. **Build a confidence interval for p in six lines.** For example, "92 of 400 help-desk tickets were password resets; give a 95% interval for the share of all tickets".
3. **Say whether a pile or a QQ plot is normal, and why.** For example, "a QQ plot whose points bend up steeply at the right end": not normal, a long right tail.

```diagram
{"type": "grid", "title": "The three paper shapes", "nodes": [{"id": "h0", "label": "", "row": 0, "col": 0}, {"id": "h1", "label": "Describe a pile", "row": 0, "col": 1}, {"id": "h2", "label": "Interval for p", "row": 0, "col": 2}, {"id": "h3", "label": "Normal or not", "row": 0, "col": 3}, {"id": "g0", "label": "You are given", "row": 1, "col": 0}, {"id": "g1", "label": "p and n, or μ, σ, n", "row": 1, "col": 1}, {"id": "g2", "label": "n, X and a level", "row": 1, "col": 2}, {"id": "g3", "label": "a setup or a plot", "row": 1, "col": 3}, {"id": "w0", "label": "You write", "row": 2, "col": 0}, {"id": "w1", "label": "centre, width, shape", "sub": "with the reason", "row": 2, "col": 1}, {"id": "w2", "label": "the six lines", "sub": "ending in a sentence", "row": 2, "col": 2}, {"id": "w3", "label": "yes or no", "sub": "with the reason", "row": 2, "col": 3}, {"id": "k0", "label": "Key fact", "row": 3, "col": 0}, {"id": "k1", "label": "√(pq/n) or σ/√n", "row": 3, "col": 1}, {"id": "k2", "label": "E = z √(p̂q̂/n)", "row": 3, "col": 2}, {"id": "k3", "label": "X normal or n ≥ 30", "row": 3, "col": 3}], "hi": ["w1", "w2", "w3"], "caption": "What each Part 1 shape hands you, and what earns the marks."}
```

### The six lines of a confidence interval

The practice sheet asks for these steps in every interval answer. This module calls them **the six lines**:

1. Verify the conditions: $n\hat{p} \ge 5$ and $n\hat{q} \ge 5$.
2. Record the confidence level $1 - \alpha$.
3. Calculate the critical value $z_{\alpha/2}$.
4. Calculate the margin of error E.
5. Calculate the lower and upper limits.
6. Write a one-sentence conclusion.

Just like a receipt with the items listed: the total alone gives the marker nothing to award part marks for. [A confidence interval for p](#/math3042-q9/ci-for-p) drills them.

## Part 2 is the posted template

The template was posted with a data file, `heights.csv`: 3000 people, with a height in cm, an age group and a sex. Its headings, in order:

| Heading | What it asks | Lesson |
|---|---|---|
| Q1 | Load the data. Make a two-way table | [read.csv and table](#/math3042-q9/r-load-two-way-table) |
| Q2 | Histogram. Does X follow a normal distribution? | [A histogram with a fitted curve](#/math3042-q9/r-histogram-normal-fit) |
| Q3a | Simulate X-bar for one sample of size n = 100 | [Simulate X-bar in R](#/math3042-q9/r-simulate-xbar) |
| Q3b | QQ plot | [The QQ plot](#/math3042-q9/qq-plot) |
| Q3c | Does the sample come from a normal population? | [The QQ plot](#/math3042-q9/qq-plot) |
| Q4a | Mean and standard deviation of X-bar: $\mu_{\bar{X}}$ and $\sigma_{\bar{X}}$ | [The pile of X-bar](#/math3042-q9/xbar-sampling-distribution) |
| Q4b | Histogram of X-bar. Is it normal? | [A histogram with a fitted curve](#/math3042-q9/r-histogram-normal-fit) |
| Q4c | Does this contradict the Central Limit Theorem? | [Three different objects](#/math3042-q9/population-sample-pile) |

**The template asks about three different objects: the population (Q2), one sample (Q3), and the pile of sample means (Q4).** They can have three different shapes, and that is the point of Q4c. For example, a population with two humps gives a sample with two humps, while the pile of its sample means is a bell.

Which column the quiz calls X, and its exact numbers, are known only on the day. The reasoning is the same for any column. [The posted Part 2 template, worked](#/math3042-q9/part2-walkthrough) goes through every heading.

## The shortest path

The core lessons come first: they cover the shapes that carry most of the marks. Then the rest, in the order the app's plan lists them.

| Order | Lesson | What it earns | Minutes |
|---|---|---|---|
| 0 | [Everything on Quiz 9 is one pile of dots](#/math3042-q9/one-picture) | the picture every answer comes from | 15 |
| Core 1 | [A confidence interval for p](#/math3042-q9/ci-for-p) | the six lines, the biggest Part 1 question | 12 |
| Core 2 | [The pile of p-hat](#/math3042-q9/phat-sampling-distribution) | centre p, width $\sqrt{pq/n}$, the np and nq check | 10 |
| Core 3 | [The pile of X-bar](#/math3042-q9/xbar-sampling-distribution) | centre μ, width $\sigma/\sqrt{n}$; Q4a | 10 |
| Core 4 | [The Central Limit Theorem](#/math3042-q9/clt-shape-rule) | the shape and its reason, on paper and in Q4b | 10 |
| Core 5 | [Three different objects](#/math3042-q9/population-sample-pile) | Q2, Q3c and Q4c answered without mixing them up | 10 |
| Core 6 | [The posted Part 2 template, worked](#/math3042-q9/part2-walkthrough) | all of Part 2, heading by heading | 15 |
| Then | [The margin of error](#/math3042-q9/margin-of-error) | 1.645, 1.96 and 2.576 | 10 |
| Then | [90%, 95%, 99%](#/math3042-q9/ci-confidence-level) | an interval at another level | 10 |
| Then | [Sample size and overlap](#/math3042-q9/ci-sample-size-and-overlap) | n for a target E, rounded up; two intervals | 10 |
| Then | [The QQ plot](#/math3042-q9/qq-plot) | `qqnorm`, `qqline` and the verdict | 12 |
| Then | [Simulate X-bar in R](#/math3042-q9/r-simulate-xbar) | `sample`, `mean`, `replicate` | 10 |
| Then | [A histogram with a fitted curve](#/math3042-q9/r-histogram-normal-fit) | Q2 and Q4b | 8 |
| Then | [read.csv and table](#/math3042-q9/r-load-two-way-table) | Q1 | 6 |
| Then | [A probability about X-bar](#/math3042-q9/xbar-probability) | the Z recipe with the pile's width | 10 |
| Mock | [Mock Quiz 9 A](#/math3042-q9/mock-quiz-9-a) | the whole quiz, timed | 25 |
| Sheet | [Know cold for Quiz 9](#/math3042-q9/know-cold-q9) | everything above on one page | 5 |
| Mock | [Mock Quiz 9 B](#/math3042-q9/mock-quiz-9-b) | when there is time | 25 |

## How answers are rounded

- $\hat{p}$ and a standard error of $\hat{p}$: 4 decimals in the middle of a calculation. E to 4 decimals.
- Interval limits to 3 or 4 decimals, as the notes and the practice answers do.
- **A sample size is a whole number of people, rounded UP**, so the interval is at least as narrow as asked.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\mu_{\bar{x}} = \mu$, $\sigma_{\bar{x}} = \dfrac{\sigma}{\sqrt{n}}$; $\bar{X}$ is normal as long as X is normal or $n > 30$.
- $\mu_{\hat{p}} = p$, $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$; $\hat{p}$ is normal as long as $np \ge 5$ and $nq \ge 5$.
- $\hat{p} - E < p < \hat{p} + E$, $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$.

**Not on the sheet, so know it:**

- $\hat{p} = X/n$ and $\hat{q} = 1 - \hat{p}$.
- The critical values 1.645 (90%), 1.96 (95%), 2.576 (99%).
:::

```quiz
[
  {"q": "92 of 400 help-desk tickets were password resets. You want a 95% interval for the share of all tickets that are password resets. Which margin of error do you compute?", "options": ["$E = 1.96\\sqrt{\\hat{p}\\hat{q}/n}$ with $\\hat{p} = 92/400$", "$E = 1.96\\,\\sigma/\\sqrt{n}$", "$E = 1.96\\sqrt{pq/n}$ with the true share of all tickets", "$E = \\hat{p}\\hat{q}/n$"], "answer": 0, "explain": "The count of resets is a share of the sample, so this is an interval for p. The true share p is unknown, so the sample's $\\hat{p} = 92/400 = 0.23$ and $\\hat{q} = 0.77$ stand in for p and q. $\\sigma/\\sqrt{n}$ is the width of a pile of averages, not of shares."},
  {"q": "A factory line fills bottles with a mean of 500 mL and a standard deviation of 6 mL. You average 36 bottles. Which formula gives the standard deviation of that average?", "options": ["$\\sigma_{\\bar{X}} = \\sigma/\\sqrt{n}$", "$\\sigma_{\\hat{p}} = \\sqrt{pq/n}$", "$\\sigma$ itself, 6 mL", "$\\sigma/n$"], "answer": 0, "explain": "The sample is boiled down to an average, so the pile is the pile of X-bar. Its width is $\\sigma/\\sqrt{n}$: $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{6}_{\\sigma \\text{ in mL}}}{\\underbrace{\\sqrt{36}}_{\\sqrt{n} = 6}} = \\mathbf{1}$$ 6 mL is the spread of single bottles, which is wider."},
  {"q": "In a confidence interval for p, the margin of error is computed with the population's p and q.", "type": "tf", "answer": false, "explain": "In an interval the true p is unknown: that is why you build the interval. The sample's $\\hat{p}$ and $\\hat{q}$ go into $E = z_{\\alpha/2}\\sqrt{\\hat{p}\\hat{q}/n}$. The population's p and q appear only when p is given, as in describing the pile of $\\hat{p}$."},
  {"q": "Part 2 heading Q3c asks whether the sample comes from a normal population. What earns the mark?", "options": ["A QQ plot from `qqnorm` with its `qqline`, and a yes or no with the reason read off the line", "The sample mean and standard deviation", "A histogram of the 10 000 simulated sample means", "Yes, by the Central Limit Theorem, because n = 100"], "answer": 0, "explain": "Q3c is about one sample, judged by its QQ plot (Q3b): points along the line mean normal; a bend or an S means not. The Central Limit Theorem is about the pile of sample means (Q4), not about one sample, which looks like its population."}
]
```
