---
title: "Quiz 7: the format, the marks, and the 98-minute path"
minutes: 3
---
<!-- facts: none; a reference page about the quiz format, with no worked examples -->
Quiz 7 is this week, in your lab session. This page says what it looks like, where its 20 marks come from, and which lesson drills each part.

## The announcement

> Yes, there will be a quiz this week (Nov 3, Nov 6).
> The topics will be a combination of past topics:
> Working with data in RStudio
> Poisson distribution
> Binomial distribution
> -Carl

## Two parts, 50 minutes, 20 marks

| Part | What you do | Marks |
|---|---|---|
| Part 1 | Paper and pencil, no computer, a calculator | 10 |
| Part 2 | Open the template notebook from Learning Hub in RStudio, fill in the code, knit it to a Word file | 10 |
| Both | 50 minutes in the lab session; no makeups | 20 |

```diagram
{"type": "flow", "title": "Quiz 7 in the lab session", "nodes": [{"id": "p1", "label": "Part 1 on paper", "sub": "calculator · 10 marks"}, {"id": "p2", "label": "Part 2 in RStudio", "sub": "knit to Word · 10 marks"}, {"id": "end", "label": "50 minutes", "kind": "pill", "sub": "no makeups"}], "edges": [{"from": "p1", "to": "p2"}, {"from": "p2", "to": "end"}], "hi": ["p1", "p2"], "caption": "Bring a calculator. Part 2 uses the lab computers with RStudio only."}
```

Part 1 has two or three questions with their marks in brackets. The instructor's own solutions to past quizzes box the final number and keep the working beside it, so **the marks come from both: the set-up line, the formula with the numbers in, and the boxed answer.** Just like a math test in high school: a right answer with no working shows the marker nothing to give part marks for.

:::tip Each Part 1 answer needs its working
A boxed number alone can lose most of a question's marks. A right set-up with a slip in the last step still earns part marks.
:::

**A probability is rounded to 4 decimals. A mean $\mu$, a standard deviation $\sigma$ and a Z-score are rounded to 2 decimals.**

Part 2 has used three kinds of data so far: the SFU weather file with missing values, a simulation, and the `survey` data set from the `MASS` package. A **simulation** is code that makes up random results by rolling virtual dice, just like rolling a die over and over to see how often each face comes up. Its shapes are a new column from a factor, a probability computed by code, and a check that prints a conclusion.

## Part 2 is marked on the knitted Word file

Open the template `.Rmd` from Learning Hub in RStudio. **The grey boxes are the code chunks, and your code goes inside them.** `Ctrl+Shift+Enter` runs the chunk under the cursor and shows its output beneath it.

**Knit** is the button above the editor, or `Ctrl+Shift+K`. **It re-runs every chunk from the top in a fresh session and writes the Word file that is marked.** Just like printing a document: only what is saved in the file ends up on the page.

**A fresh session knows only what the notebook itself loads.** For example, a package you loaded by typing in the console earlier is forgotten. A chunk that worked in the console stops the knit with `object 'survey' not found` when `library(MASS)` is missing above it, and with `could not find function "filter"` when `library(dplyr)` is missing.

:::warn A package loaded only in the console stops the knit
The fix is to put every `library()` line in the first chunk of the notebook, then knit again.
:::

**Knit once at the start with the template as it is, then again after every part.** A knit that fails at minute 45 costs every mark in Part 2. The long version is [R from Lab 1](#/math3042/r-essentials).

## Where the marks come from

| Likely question | Lesson that drills it | Minutes |
|---|---|---|
| nCx, e^x and factorial on the calculator; TRUE counts 1 in R | [Before you start](#/math3042-q7/pre-reading) | 8 |
| Binomial P(X = x) with the formula and the numbers in | [Binomial on paper](#/math3042-q7/binomial-on-paper) | 12 |
| "At least", "at most", "more than", "between" | [At least, at most, more than](#/math3042-q7/at-least-at-most) | 10 |
| μ and σ of a binomial count; is a value unusual by Z | [Binomial on paper](#/math3042-q7/binomial-on-paper) | (in the 12) |
| Poisson with λ rescaled to the question's interval | [Poisson on paper](#/math3042-q7/poisson-on-paper) | 12 |
| Import and filter the data, a new logical column, an `ifelse` segment | [Working with data in RStudio](#/math3042-q7/r-data-moves) | 12 |
| P(A), P(A or B), P(A given B) by code; the exclusive and independent check with a printed conclusion | [Probabilities from a data frame](#/math3042-q7/r-probabilities-from-data) | 12 |
| `dbinom`, `pbinom`, `dpois`, `ppois`, and a simulated check with `rbinom` or `rpois` | [dbinom, pbinom, dpois, ppois](#/math3042-q7/r-binomial-poisson) | 10 |

## The 98-minute path

1. [Before you start](#/math3042-q7/pre-reading): 8 minutes.
2. [Binomial on paper](#/math3042-q7/binomial-on-paper): 12 minutes.
3. [At least, at most, more than](#/math3042-q7/at-least-at-most): 10 minutes.
4. [Poisson on paper](#/math3042-q7/poisson-on-paper): 12 minutes.
5. [Working with data in RStudio](#/math3042-q7/r-data-moves): 12 minutes.
6. [Probabilities from a data frame](#/math3042-q7/r-probabilities-from-data): 12 minutes.
7. [dbinom, pbinom, dpois, ppois](#/math3042-q7/r-binomial-poisson): 10 minutes.
8. [Mock Quiz 7 A](#/math3042-q7/mock-quiz-7-a): 25 minutes, timed.
9. [Know cold for Quiz 7](#/math3042-q7/know-cold-q7): 5 minutes.
10. [Mock Quiz 7 B](#/math3042-q7/mock-quiz-7-b): when there is time, then the know-cold sheet once more.

## The long versions

- [Binomial experiments and the binomial formula](#/math3042-u4/binomial) and [Binomial mean and variance; is a count unusual?](#/math3042-u4/binomial-mean-variance).
- [Poisson: counts per interval](#/math3042-u4/poisson) and [Review 6: Poisson plug-in](#/math3042-midterm/review-poisson-plugin).
- [Lab 5: conditional probability from the SFU weather data](#/math3042-u4/lab5-conditional-r) and [Review 2: R for data on paper](#/math3042-midterm/review-r-data).
- [Review 4: R for distributions on paper](#/math3042-midterm/review-r-distributions) and [R on paper: the d, p, q, r families](#/math3042-midterm/r-on-paper).

```quiz
[
  {"q": "What does Part 2 of the quiz produce?", "options": ["A Word file knitted from the template R notebook", "A handwritten page of R code", "An R script file uploaded on its own", "A screenshot of the RStudio console"], "answer": 0, "explain": "Part 2 starts from the template notebook on Learning Hub. You fill in the code chunks in RStudio and knit the notebook to a Word file, which is what gets marked."},
  {"q": "Part 1 may be done on a lab computer, as long as only RStudio is open.", "type": "tf", "answer": false, "explain": "Part 1 is paper and pencil with no computer. A calculator is allowed. RStudio is for Part 2 only."},
  {"q": "A binomial probability works out to 0.2242287. How is it written on Part 1?", "options": ["0.2242", "0.22", "0.224", "0.2242287"], "answer": 0, "explain": "A probability is rounded to 4 decimals: **0.2242**."},
  {"q": "A Z-score works out to −2.58199. How is it written?", "options": ["−2.58", "−2.5820", "−2.6", "−3"], "answer": 0, "explain": "μ, σ and Z are rounded to 2 decimals: **−2.58**. Beyond −2, so the value is unusual."},
  {"q": "Your chunk runs fine with `Ctrl+Shift+Enter`, but Knit stops with `object 'survey' not found`. Why?", "options": ["Knit starts a fresh session, so `library(MASS)` must be in a chunk above", "The Word file is read-only", "`survey` must be imported with `read.csv`", "Knit only renders the output the chunks already have"], "answer": 0, "explain": "Knit re-runs every chunk from the top in a new session. Your console had MASS loaded; the notebook did not. Put `library(MASS)` in the first chunk and knit again. `survey` ships inside MASS, so it is never read from a file."},
  {"q": "How many marks is Quiz 7 out of, both parts together?", "type": "numeric", "answer": 20, "tolerance": 0, "explain": "Part 1 is out of 10 and Part 2 is out of 10, for **20** in all, in 50 minutes."}
]
```
