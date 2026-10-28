---
title: What the midterm looks like, and the study order through Units 1 to 4
minutes: 15
---

The midterm is a 90-minute paper exam in four question shapes, and each shape has a fixed way to earn full marks. This lesson gives the rules on the cover, the marks on the practice paper, and the order to work through the four unit modules.

## Wednesday Oct 28, 3:00 pm, SW5-1840, 90 minutes

| Item | Rule |
|---|---|
| Date and time | Wednesday Oct 28 2026, 3:00 pm |
| Room | SW5-1840 |
| Length | 90 minutes; the practice paper is 46 marks, so about two minutes per mark |
| Allowed | Paper and pencil and "a scientific calculator with statistics functions. No other devices are allowed." |
| Coverage | Units 1 to 4, everything up to the Poisson distribution; Unit 5 is out |
| R | "R programming and language is on the exam (write an R command that does XYZ...)" |
| Weight | 30 % of the course grade |
| Provided | A formula sheet and an R sheet; "you can't bring your own" |
| Rounding | "If your answer is a probability, round it to four digits after the decimal point. Otherwise, round to three significant digits." |

The formula sheet gives every descriptive formula, the probability rules, Bayes, $P(n,r)$ and $C(n,r)$, and the four distributions with $\mu$ and $\sigma^2$.

The R sheet is the generic Base R cheat sheet. It names `dbinom`, `pbinom`, `dpois` and `ppois` but gives no argument order, and it has no `dhyper`, `phyper`, `rhyper`, no geometric functions, no `sample()`, no `lower.tail`, no `filter` and no `bwplot`. Those come from memory; [R on paper](#/math3042-midterm/r-on-paper) lists them.

## The practice paper: 12 questions, 46 marks

| Q | Marks | What it asks | Unit |
|---|---|---|---|
| 1 | 5 (1+2+2) | Read a histogram; estimate mean and median; does the empirical rule apply? | U1/U2 |
| 2 | 4 | Written recommendation from two summary-statistics tables | U1 |
| 3 | 4 (1+1+2) | Independent events, complement, expected profit | U3/U4 |
| 4 | 3 | Without replacement, a sum of mutually exclusive cases | U3 |
| 5 | 3 | Bayes' rule | U3 |
| 6 | 3 (1+1+1) | A probability table: $P(X \ge k)$, $E(X)$, two independent days | U4 |
| 7 | 4 (1+1+2) | R: `quantile`, a `filter`, side-by-side boxplots | U1/U2 R |
| 8 | 3 (1+1+1) | R: `rhyper`, `dhyper`, `phyper` | U4 R |
| 9 | 3 (2+1) | R: write a simulation function, then use it | U3/U4 R |
| 10 | 4 (2+2) | TRUE or FALSE with explanation, from side-by-side boxplots | U2 |
| 11 | 5 (2+3) | Poisson with a rescaled rate; the next event between 10 and 20 years | U4 |
| 12 | 5 (1+2+2) | Cards without replacement, expected winnings, two games | U3/U4 |

Ten marks are R written by hand (Q7 to Q9), about thirteen are written interpretation (Q1, Q2, Q10), and the remaining 23 are calculation.

There is no multiple choice; true or false appears only as "TRUE or FALSE and briefly explain".

## Four question shapes, four ways to answer

**Calculation.** Define X in words ("Let X = the number of major floods in the next 10 years"). Name the rule ("Since tickets are independent", "Using Bayes' Rule"). Write the formula in symbols, substitute, then give the number with its unit, rounded by the cover rule: "0.8438 or 84.38 %", "an expected loss of \$0.40 per ticket".

**Interpretation.** Verdict first, then two or more numbers from the figure or table, then the feature by name: "bimodal", "left-skewed", "the IQR is the width of the box", "route B is more consistent: its standard deviation is 4.2 minutes against route A's 9.6". A paragraph without numbers earns part marks at best.

**R command.** A full runnable line with the real argument values: `library(dplyr)` before `filter`, `Gestation$wt` for a column, `data = Gestation` for a formula like `wt ~ race`. Write `dhyper(9, 42, 116+154, 20)`, never `dhyper(x, K, N-K, n)`.

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr)` | Loads the dplyr package, which provides `filter`. |
| `dhyper(9, 42, 116+154, 20)` | x = 9, m = 42 successes in the population, n = 116+154 failures (`+` adds before the call), k = 20 drawn. Returns P(X = 9). R's slot named `n` holds the failures, not the sample size; the sample size goes in R's last slot, `k`. |
| `dhyper(x, K, N-K, n)` | The template: R's slots x, m, n, k filled by the course's x, K, N−K, n. Letters alone do not run unless they hold numbers. |

**Left to right**

- `library(dplyr)`: "Load the package (`library`) called dplyr (`dplyr`)."
- `dhyper(9, 42, 116+154, 20)`: "The hypergeometric probability of exactly (`dhyper`) 9 (`9`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`)."
- `dhyper(x, K, N-K, n)`: "The hypergeometric probability of exactly (`dhyper`) x (`x`) with K successes (`K`), N minus K failures (`N-K`) and n drawn (`n`)."

**Right to left**, the order R runs it

- `library(dplyr)`: "Find the package dplyr (`dplyr`) and load it (`library`)."
- `dhyper(9, 42, 116+154, 20)`: "Add 116 and 154 (`116+154`), take 9, 42 and 20 (`9`, `42`, `20`), then compute P(X = 9) (`dhyper`)."
- `dhyper(x, K, N-K, n)`: "Subtract K from N (`N-K`), take x, K and n (`x`, `K`, `n`), then compute P(X = x) (`dhyper`)."
:::

:::warn R's n is not the course's n
In `dhyper` R's `n` is the failures N − K; the course's sample size n goes in R's `k`.
:::

**R function.** `name <- function(n) { ... return(...) }`. The body must simulate with an r-function or `sample()`.

A function whose body only returns the long-run proportion, such as `return(0.045)` for a 4.5 % chance, computes the average instead of simulating and scores zero (practice Q9).

:::info R syntax
| Code | What it does |
|---|---|
| `name <-` | `<-` is assignment: the function is stored under the name `name`. |
| `function(n) { … }` | Makes a function with one input, `n`; the lines inside the braces are its body. |
| `return(...)` | Hands the result back to whoever called the function. |
| `...` | Here just a placeholder for code you write, not R syntax. |
| `return(0.045)` | Hands back the fixed number 0.045 every call: nothing random is drawn. |

**Left to right**

- `name <- function(n) { ... return(...) }`: "Store under the name name (`name <-`) a function (`function`) of one input n (`(n)`) whose body in braces (`{ }`) ends by handing back a result (`return`)."
- `return(0.045)`: "Hand back (`return`) the number 0.045 (`0.045`)."

**Right to left**, the order R runs it

- `name <- function(n) { ... return(...) }`: "Build a function (`function`) with input n (`(n)`) and a body (`{ }`) that ends with `return`, then store it under the name name (`name <-`)."
- `return(0.045)`: "Take 0.045 (`0.045`) and hand it back (`return`)."
:::

## The study order through Units 1 to 4

Work through these in order. The minutes are each lesson's own estimate.

| Unit 1: describing numbers | Min | After it you can |
|---|---|---|
| [What statistics is](#/math3042/what-is-statistics) | 12 | use the vocabulary: population, sample, parameter, statistic |
| [Mean](#/math3042/mean) | 15 | compute a raw and a grouped mean |
| [Median and mode](#/math3042/median-mode) | 15 | find the median at position (n + 1)/2 |
| [Range and SD](#/math3042/range-sd) | 18 | compute s and σ by the formula |
| [Coefficient of variation](#/math3042/cv) | 12 | say which dataset is more variable relative to its mean |
| [Empirical rule](#/math3042/empirical-rule) | 15 | apply 68–95–99.7 and say when it does not apply |
| [Z-scores](#/math3042/z-scores) | 16 | call a value unusual when the absolute Z exceeds 2 |
| [Chebyshev](#/math3042/chebyshev) | 12 | give the "at least" percentage for any k |
| [Quartiles and percentiles](#/math3042/quartiles-percentiles) | 16 | find Q1, Q2, Q3 by the course's hand method |
| [IQR, boxplots, outliers](#/math3042/iqr-boxplot-outliers) | 18 | compute the fences and read a boxplot |
| [Skewness](#/math3042/skewness) | 12 | read skew from mean against median, and Pearson's Sk |
| [R from Lab 1](#/math3042/r-essentials) | 18 | write `mean`, `sd`, `quantile`, `subset` on a column |
| [Formula sheet](#/math3042/formula-sheet) | 20 | know which Unit 1 formulas are given |

Optional: [correlation](#/math3042/correlation), [categorical data](#/math3042/categorical).

| Unit 2: pictures of data | Min | After it you can |
|---|---|---|
| [Frequency tables](#/math3042-u2/frequency-tables) | 12 | build relative frequencies from counts |
| [Histograms](#/math3042-u2/histograms) | 20 | read shape, centre and spread from a histogram |
| [favstats and model formulas](#/math3042-u2/lab2-grouped) | 22 | write `favstats(y ~ g, data = df)` and `bwplot(y ~ g, data = df)` |
| [Unit 2 sheet](#/math3042-u2/formula-sheet-2) | 8 | recall the class-width recipe |

:::info R syntax
| Code | What it does |
|---|---|
| `y ~ g` | `~` builds a formula: the numeric variable `y` on the left, the grouping variable `g` on the right. |
| `data = df` | The data frame the formula's names are looked up in, so no `$` is needed. |
| `favstats(y ~ g, data = df)` | From mosaic: one row of summary statistics for `y` per group of `g`. |
| `bwplot(y ~ g, data = df)` | From mosaic: side-by-side boxplots of `y`, one per group. The formula fills its first argument, `x`. |

**Left to right**

- `favstats(y ~ g, data = df)`: "Summary statistics (`favstats`) of y (`y`) split by (`~`) g (`g`) from the data frame df (`data = df`)."
- `bwplot(y ~ g, data = df)`: "Boxplots (`bwplot`) of y (`y`) split by (`~`) g (`g`) from the data frame df (`data = df`)."

**Right to left**, the order R runs it

- `favstats(y ~ g, data = df)`: "Build the formula y by g (`y ~ g`), look its names up in df (`data = df`), then summarise each group (`favstats`)."
- `bwplot(y ~ g, data = df)`: "Build the formula y by g (`y ~ g`), look its names up in df (`data = df`), then draw the boxplots (`bwplot`)."
:::

Optional: [stem-and-leaf](#/math3042-u2/stem-and-leaf), [ogives](#/math3042-u2/cumulative-ogive), [scatter plots](#/math3042-u2/scatter-plots).

| Unit 3: probability | Min | After it you can |
|---|---|---|
| [Sample spaces and events](#/math3042-u3/probability-sample-space) | 18 | list outcomes and count favourable ones |
| [Counting](#/math3042-u3/counting) | 28 | choose between $P(n,r)$ and $C(n,r)$ |
| [Complement and addition](#/math3042-u3/complement-addition) | 20 | use 1 − P(none) and the addition rule |
| [Conditional probability, independence](#/math3042-u3/conditional-independence) | 25 | multiply sequential fractions without replacement |
| [Bayes](#/math3042-u3/bayes) | 25 | reverse a conditional with a tree |
| [Simulating with sample()](#/math3042-u3/lab4-simulations) | 28 | write `sample(..., replace = TRUE, prob = ...)` inside a function |
| [Unit 3 sheet](#/math3042-u3/formula-sheet-3) | 8 | know which rules are given |

:::info R syntax
| Code | What it does |
|---|---|
| `sample(...` | Draws random values. The first two slots, `x` (the values to draw from) and `size` (how many), are left as `...` here. |
| `replace = TRUE` | Draws with replacement, so a value can come up again on every draw. |
| `prob = ...` | One probability per value of `x`, in the same order; left as a placeholder here. |

**Left to right**

- `sample(..., replace = TRUE, prob = ...)`: "Draw a random sample (`sample`) from some values (`...`), with replacement (`replace = TRUE`), using given probabilities (`prob =`)."

**Right to left**, the order R runs it

- `sample(..., replace = TRUE, prob = ...)`: "Take the values and how many (`...`), allow repeats (`replace = TRUE`), attach the probabilities (`prob =`), then draw (`sample`)."
:::

Optional: [relative frequency](#/math3042-u3/relative-frequency-lln), [the 28 practice problems](#/math3042-u3/practice-problems).

| Unit 4: discrete distributions | Min | After it you can |
|---|---|---|
| [Discrete distributions](#/math3042-u4/discrete-distributions) | 22 | compute $\mu$ and $\sigma$ from a table |
| [Binomial](#/math3042-u4/binomial) | 24 | check the four conditions and use the formula |
| [Binomial μ and σ](#/math3042-u4/binomial-mean-variance) | 18 | call a count unusual with Z |
| [Hypergeometric](#/math3042-u4/hypergeometric) | 24 | use the three-C formula and the 5 % rule |
| [Geometric](#/math3042-u4/geometric) | 18 | count trials to the first success |
| [Poisson](#/math3042-u4/poisson) | 18 | rescale λ to the interval asked |
| [Which distribution](#/math3042-u4/choosing-distribution) | 20 | name the model and its R function |
| [Lab 5: conditional probability in R](#/math3042-u4/lab5-conditional-r) | 30 | read a two-way `table` in R |
| [Unit 4 sheet](#/math3042-u4/formula-sheet-4) | 8 | know which pmfs and moments are given |

That is 33 core lessons and 595 minutes, close to ten hours by the lessons' own estimates; the optional rows add more. Then this module, in this order:

1. [Mock midterm A](#/math3042-midterm/mock-midterm-a), cold, on paper, under exam timing.
2. The practice paper worked: [Q1, Q2, Q10](#/math3042-midterm/practice-descriptive), [Q3 to Q6](#/math3042-midterm/practice-probability), [Q11, Q12](#/math3042-midterm/practice-distributions), [Q7 to Q9](#/math3042-midterm/practice-r).
3. [R on paper](#/math3042-midterm/r-on-paper) and [expected dollars, the variance shortcut, Poisson over two intervals](#/math3042-midterm/expected-dollars-shortcuts).
4. [The sixteen Unit 4 practice problems](#/math3042-midterm/unit4-practice-problems).
5. [Mock midterm B](#/math3042-midterm/mock-midterm-b), under exam timing.
6. [The know-cold sheet](#/math3042-midterm/know-cold-sheet), rewritten from memory.

:::tip Mock A comes before the practice paper
Take Mock A cold after the unit lessons and before the practice paper, so the practice paper's model answers land on questions you have already struggled with.
:::

```quiz
[
  {
    "q": "Which room is the midterm in?",
    "type": "text",
    "answer": ["SW5-1840", "sw5 1840", "SW5 1840", "SW51840"],
    "explain": "SW5-1840, Wednesday Oct 28 2026, 3:00 pm."
  },
  {
    "q": "How many minutes long is the midterm?",
    "type": "numeric",
    "answer": 90,
    "tolerance": 0,
    "unit": "min",
    "explain": "90 minutes for 46 marks on the practice paper: about two minutes per mark."
  },
  {
    "q": "Your answer to a question is the probability 0.238651. What do you write?",
    "options": ["0.2387", "0.239", "0.24", "0.238651"],
    "answer": 0,
    "explain": "The cover rule: a probability is rounded to four digits after the decimal point, so 0.2387 (or 23.87 %). Three significant digits (0.239) is the rule for everything that is not a probability."
  },
  {
    "q": "Which of these does the provided R sheet leave out, so you must know them from memory? Select all.",
    "options": ["`dhyper`, `phyper` and `rhyper`", "`sample()` with `replace` and `prob`", "the argument `lower.tail`", "the function names `dbinom` and `ppois`", "`quantile`"],
    "answer": [0, 1, 2],
    "explain": "The Base R sheet's distributions table names the normal, Poisson, binomial and uniform d/p/q/r functions, without argument order, and its maths section lists `quantile`. It has no hypergeometric or geometric functions, no `sample()`, no `lower.tail`, no `filter` and no `bwplot`."
  },
  {
    "q": "The Poisson distribution is the last topic on the midterm. Which unit is it in?",
    "options": ["Unit 4", "Unit 3", "Unit 5", "Unit 2"],
    "answer": 0,
    "explain": "Unit 4, discrete probability distributions: binomial, hypergeometric, geometric, Poisson. Coverage is Units 1 to 4, everything up to Poisson; Unit 5 (continuous distributions) is out."
  },
  {
    "q": "How many of the practice paper's 46 marks are R commands or functions written by hand?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "marks",
    "explain": "Q7, Q8 and Q9 carry 4, 3 and 3 marks: $$4 + 3 + 3 = \\mathbf{10} \\text{ marks}$$ They are `quantile`, `filter` and `bwplot`; `rhyper`, `dhyper` and `phyper`; a simulation function and a line that uses it."
  }
]
```
