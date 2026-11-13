---
title: "Mock Quiz 8 A: Part 1 on paper (10 marks), Part 2 in RStudio (10 marks)"
minutes: 50
---
<!-- facts: none; a timed mock in the real two-part format, with a new factory-line story and new Lab 8 numbers -->
A full Quiz 8 in its real shape: one story on paper worth 10 marks, then an RStudio template on a uniform wait and an exponential wait worth 10 marks.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator and the Z table: name X in words, give its distribution and parameters, sketch and shade, write the formula, the substituted line, and the boxed number. Then 25 minutes for Part 2: write the code on paper, or in RStudio if you have it open. The items below check one part at a time; a probability to 4 decimals, μ, σ and Z to 2.
:::

## Part 1 on paper: one story, three questions, 10 marks

> **Premise.** A factory line in Richmond fills cans of sparkling water. The volume of water in a can is normally distributed with mean 355 mL and standard deviation 4 mL. Let X = the volume in a randomly chosen can, in mL.
>
> **Q1 [4 marks].**
>
> a. [2] A can holding less than 349 mL is pulled off the line as underfilled. What is the probability that a randomly chosen can is underfilled?
>
> b. [2] What is the probability that a can holds between 349 mL and 362 mL?
>
> **Q2 [3 marks].**
>
> a. [2] Find the volume that is exceeded by only 5 % of cans.
>
> b. [1] One can is found to hold 344.6 mL. Is this statistically unusual? Write YES or NO and support your answer with a calculation.
>
> **Q3 [3 marks].** Cans are packed in boxes of 12, filled independently. Let Y = the number of underfilled cans (less than 349 mL, as in Q1a) in a box.
>
> a. [2] What is the probability that a box holds at least one underfilled can?
>
> b. [1] Find the mean and the standard deviation of Y.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$
- Empirical rule: 68 % within one standard deviation of the mean, 95 % within two, 99.7 % within three
- Binomial: $P(x) = C(n,x)\,p^x q^{n-x}$
- Binomial: $\mu = np$ and $\sigma^2 = npq$
- Complement: $P(\bar A) = 1 - P(A)$

**Not on the sheet, so know it:**

- The Z table gives the area to the left of z. **Round Z to 2 decimals before you look it up.**
- Right tail is 1 minus the table; between is the bigger cell minus the smaller cell.
- A percentile: read z from the inside of the table, then $x = \mu + Z\sigma$. The top 5 % sits at $z = 1.645$.
- Unusual means Z below −2 or above 2.
- $q = 1 - p$; at least one is $1 - P(0)$; $\sigma = \sqrt{npq}$, the root of the sheet's $\sigma^2$.
:::

```quiz
[
  {
    "q": "**Q1a (2 marks).** Fill volume normal with mean 355 mL and standard deviation 4 mL. P(a can holds less than 349 mL)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0668,
    "tolerance": 0.0001,
    "explain": "Let X = the volume in a randomly chosen can, in mL. X is normal with $\\mu = 355$ mL the mean fill and $\\sigma = 4$ mL the standard deviation. Sketch a bell centred at 355 and shade the thin left tail below 349. $$Z = \\dfrac{x - \\mu}{\\sigma}$$ $$Z = \\dfrac{\\underbrace{349}_{\\text{underfill limit}} - \\underbrace{355}_{\\text{mean fill}}}{\\underbrace{4}_{\\text{standard deviation}}} = \\mathbf{-1.50}$$ The table gives the area to the left of z, which is what less than asks for: $$P(X < 349) = \\underbrace{P(Z < -1.50)}_{\\text{table: row } -1.5 \\text{, column .00}} = \\mathbf{0.0668}$$ In R, `pnorm(349, 355, 4)` gives the same 0.0668, because Z is exactly −1.50."
  },
  {
    "q": "**Q1b (2 marks).** Same line. P(a can holds between 349 mL and 362 mL)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8931,
    "tolerance": 0.0001,
    "explain": "Same X, normal with $\\mu = 355$ mL and $\\sigma = 4$ mL. Shade the band from 349 to 362; it is not centred on 355, so take one Z per bound. $$Z_1 = \\dfrac{\\underbrace{349}_{\\text{lower bound}} - \\underbrace{355}_{\\text{mean fill}}}{\\underbrace{4}_{\\text{standard deviation}}} = -1.50 \\qquad Z_2 = \\dfrac{\\underbrace{362}_{\\text{upper bound}} - \\underbrace{355}_{\\text{mean fill}}}{\\underbrace{4}_{\\text{standard deviation}}} = 1.75$$ Between is the bigger cell minus the smaller cell: everything left of 362 minus everything left of 349. $$P(349 < X < 362) = \\underbrace{0.9599}_{\\text{table at } 1.75} - \\underbrace{0.0668}_{\\text{table at } -1.50} = \\mathbf{0.8931}$$ In R, `pnorm(362, 355, 4) - pnorm(349, 355, 4)`."
  },
  {
    "q": "**Q2a (2 marks).** Same line. The volume exceeded by only 5 % of cans, in mL? (2 decimals)",
    "type": "numeric",
    "answer": 361.58,
    "tolerance": 0.02,
    "explain": "Exceeded by only 5 % means 95 % of cans lie below it, so the area to the left is 0.95. Look for 0.9500 inside the table: the cells 0.9495 at $z = 1.64$ and 0.9505 at $z = 1.65$ sit equally close, so the instructor takes the midpoint, $z = 1.645$. Turn z back into a volume: $$x = \\mu + Z\\sigma$$ $$x = \\underbrace{355}_{\\text{mean fill}} + \\underbrace{1.645}_{\\text{z with 0.95 to its left}} \\times \\underbrace{4}_{\\text{standard deviation}} = \\mathbf{361.58 \\text{ mL}}$$ In R, `qnorm(0.95, 355, 4)` gives 361.579 (computed), which also rounds to 361.58. Reading z = 1.64 or 1.65 instead gives 361.56 or 361.60, and both are accepted here."
  },
  {
    "q": "**Q2b (½ mark), the Z-score.** One can holds 344.6 mL. $Z$ = ? (2 decimals, keep the sign)",
    "type": "numeric",
    "answer": -2.6,
    "tolerance": 0.01,
    "explain": "With $x = 344.6$ mL the can found, $\\mu = 355$ mL the mean fill and $\\sigma = 4$ mL the standard deviation: $$Z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{\\underbrace{344.6}_{\\text{can found}} - \\underbrace{355}_{\\text{mean fill}}}{\\underbrace{4}_{\\text{standard deviation}}} = \\mathbf{-2.60}$$"
  },
  {
    "q": "**Q2b (½ mark), the verdict.** Is a can holding 344.6 mL statistically unusual? Type YES or NO.",
    "type": "text",
    "answer": ["YES", "Yes", "yes"],
    "explain": "$$Z = \\dfrac{\\underbrace{344.6}_{\\text{can found}} - \\underbrace{355}_{\\text{mean fill}}}{\\underbrace{4}_{\\text{standard deviation}}} = -2.60$$ A value is unusual when Z is below −2 or above 2. −2.60 is below −2, so **YES**: the can sits more than two standard deviations under the mean."
  },
  {
    "q": "**Q3a (2 marks).** Boxes of 12 cans, filled independently; Y = the number of underfilled cans in a box. P(at least one underfilled can)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5638,
    "tolerance": 0.0005,
    "explain": "Each can is underfilled or not, with the same chance, independently, in a fixed 12 cans: Y is binomial with $n = 12$ cans, $p = 0.0668$ the chance one can is underfilled (the answer to Q1a, carried to 4 decimals) and $q = 0.9332$ the chance it is not. At least one is everything except none, so use the complement. $$P(Y \\ge 1) = 1 - P(0)$$ $$P(0) = \\underbrace{C(12, 0)}_{\\text{1 way, no cans}} \\times \\underbrace{(0.0668)^0}_{\\text{no underfills}} \\times \\underbrace{(0.9332)^{12}}_{\\text{all 12 fine, 0.9332 each}} = 0.436211$$ $$P(Y \\ge 1) = 1 - \\underbrace{0.436211}_{\\text{P(0), from above}} = \\mathbf{0.5638}$$ In R, `1 - dbinom(0, 12, pnorm(349, 355, 4))` gives the same 0.5638."
  },
  {
    "q": "**Q3b (½ mark), the mean.** Same box of 12. The mean of Y, $\\mu$ = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.8,
    "tolerance": 0.01,
    "explain": "Y is binomial with $n = 12$ cans and $p = 0.0668$ the chance one is underfilled. $$\\mu = np = \\underbrace{12}_{\\text{cans in a box}} \\times \\underbrace{0.0668}_{\\text{chance of an underfill, Q1a}} = 0.8016 = \\mathbf{0.80}$$ A box holds 0.80 underfilled cans on average."
  },
  {
    "q": "**Q3b (½ mark), the standard deviation.** Same box. $\\sigma$ of Y = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.86,
    "tolerance": 0.01,
    "explain": "With $n = 12$ cans, $p = 0.0668$ the chance of an underfill and $q = 0.9332$ the chance a can is fine: $$npq = \\underbrace{12}_{\\text{cans}} \\times \\underbrace{0.0668}_{\\text{chance underfilled}} \\times \\underbrace{0.9332}_{\\text{chance fine}} = 0.748053$$ $$\\sigma = \\sqrt{npq}$$ $$\\sigma = \\underbrace{\\sqrt{0.748053}}_{\\text{root of the variance}} = \\mathbf{0.86}$$ The sheet gives $\\sigma^2 = npq$; 0.75 is the variance, and the root is the step most often left off."
  }
]
```

## Part 2 in RStudio: a shuttle wait and a help-desk wait, 10 marks

The template below is the notebook's code chunk, in the shape of Lab 8. Every `Something` is yours to write; the marks for each part sit in its comment. Task 1: a campus shuttle leaves its stop every 15 minutes and you arrive at a random moment, so your wait X is uniform on 0 to 15 minutes. Task 2: the wait Y for a help-desk agent is exponential with a mean of 8 minutes.

```r
library(mosaic)
# Task 1: the shuttle wait X is uniform on 0 to 15 minutes
X.min <- 0
X.max <- 15
m.trials <- 10^5
# (a) simulate m.trials waits                                         [1 mark]
X.vals <- Something
# (b) density histogram, one bar per minute, each bar holding its left end   [2 marks]
histogram(X.vals,
          breaks=seq(X.min, X.max, by=1),
          right=Something,
          type=Something,
          xlab="X (min)", ylab="P(X)",
          main="Simulated Shuttle Waits")
# (c) P(X < 4): the simulated share, then the theoretical value       [2 marks]
p.sim <- Something
p.theory <- Something
# Task 2: the help-desk wait Y is exponential with mean 8 minutes
beta <- 8
# (d) P(Y < 5), then P(Y > 10)                                        [2 marks]
Something
Something
# (e) the quartiles of Y and the IQR                                   [2 marks]
Q1 <- Something
Q2 <- Something
Q3 <- Something
IQR <- Something
# (f) one sentence: compare the median wait with the mean wait         [1 mark]
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | `library()` loads a package; `mosaic` holds `histogram()`. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `X.min <- 0` and `X.max <- 15` | `<-` stores a value under a name: the two ends of the uniform interval. The dot is part of the name. |
| `m.trials <- 10^5` | `^` raises to a power: 100 000, the number of values to simulate. |
| `X.vals <- Something` | Your vector of simulated waits, stored as `X.vals`. |
| `histogram(X.vals, …)` | Draws a histogram of the values in the first argument; a long call split over several lines is still one statement. |
| `breaks=seq(X.min, X.max, by=1)` | `seq(from, to, by)` builds 0, 1, 2, …, 15: the class limits, one class per minute. |
| `right=Something` | Decides whether each class includes its right end or its left end. |
| `type=Something` | Decides what the bar heights show: counts, percents, or density. |
| `xlab=`, `ylab=`, `main=` | The x-axis label, the y-axis label and the title, each a string in quotes. |
| `p.sim <- Something` and `p.theory <- Something` | Store your two answers to (c) under these names. |
| `beta <- 8` | Stores the mean wait β = 8 minutes. |
| `Something` in (d) | Your two lines, one per probability. |
| `Q1`, `Q2`, `Q3`, `IQR` lines | Store your three quartiles and the interquartile range under these names. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) mosaic (`mosaic`)."
- `X.min <- 0` and `X.max <- 15`: "Store under the name X.min (`X.min <-`) the number 0, and under X.max (`X.max <-`) the number 15."
- `m.trials <- 10^5`: "Store under the name m.trials (`m.trials <-`) 10 to the power (`^`) 5."
- `X.vals <- Something`: "Store under the name X.vals (`X.vals <-`) your expression (`Something`)."
- `histogram(…)`: "Draw a histogram (`histogram`) of X.vals (`X.vals`) with classes from X.min to X.max in steps of 1 (`breaks=seq(X.min, X.max, by=1)`), your end rule (`right=Something`), your bar type (`type=Something`), two axis labels (`xlab=`, `ylab=`) and a title (`main=`)."
- `p.sim` and `p.theory` lines: "Store under each name (`<-`) your expression (`Something`)."
- `beta <- 8`: "Store under the name beta (`beta <-`) the number 8."
- `Something` in (d): "Your two lines (`Something`)."
- `Q1`, `Q2`, `Q3`, `IQR` lines: "Store under each name (`<-`) your expression (`Something`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Load mosaic (`library`)."
- `X.min <- 0` and `X.max <- 15`: "Take 0 and store it as X.min (`X.min <-`); take 15 and store it as X.max (`X.max <-`)."
- `m.trials <- 10^5`: "Work out 10 to the 5th (`10^5`) and store it as m.trials (`m.trials <-`)."
- `X.vals <- Something`: "Evaluate your expression (`Something`) and store it as X.vals (`X.vals <-`)."
- `histogram(…)`: "Build the class limits (`seq`), read your end rule and bar type (`right=`, `type=`), then draw the histogram of X.vals (`histogram`) with its labels (`xlab=`, `ylab=`, `main=`)."
- `p.sim` and `p.theory` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `beta <- 8`: "Take 8 and store it as beta (`beta <-`)."
- `Something` in (d): "Run your two lines (`Something`)."
- `Q1`, `Q2`, `Q3`, `IQR` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
:::

Check the template one slot at a time. Each explain gives the full line and the value R would print.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$
- Exponential: $F(x) = 1 - e^{-x/\beta}$; $\mu = \beta$

**Not on the sheet, so know it:**

- The rate is $1/\beta$, in the question's time unit.
- $P(X > x) = 1 - F(x)$; for the exponential that is $e^{-x/\beta}$.
- An exponential percentile is $x = -\beta\ln(1-p)$; the median is $p = 0.5$.
- Every R function name and its argument order: nothing in RStudio is on the sheet.
:::

```quiz
[
  {
    "type": "fill",
    "q": "**Part 2 (a) (1 mark).** Simulate `m.trials` shuttle waits, uniform on `X.min` to `X.max`. Fill the function name.",
    "code": "X.vals <- ___(m.trials, X.min, X.max)",
    "answer": ["runif"],
    "explain": "The full line: `X.vals <- runif(m.trials, X.min, X.max)`. `runif(n, min, max)` makes n random values spread evenly between min and max. Its first slot is how many values to make, here 100 000. `punif` would give an area, not random values."
  },
  {
    "type": "fill",
    "q": "**Part 2 (b) (1 of 2 marks).** Each bar must include its left end: a wait of exactly 3.000 belongs to the bar from 3 to 4. Fill the logical value.",
    "code": "right=___",
    "answer": ["FALSE", "F"],
    "explain": "The full argument: `right=FALSE`. With `right=FALSE` each class is closed on the left, [3, 4), so the class limits 0, 1, 2 … from `breaks` are lower class limits. `right=TRUE` would put 3.000 in the bar from 2 to 3."
  },
  {
    "type": "fill",
    "q": "**Part 2 (b) (1 of 2 marks).** The bar areas must add to 1, so the bars sit on the pdf. Fill the string, quotes included.",
    "code": "type=___",
    "answer": ["\"density\"", "'density'"],
    "explain": "The full argument: `type=\"density\"`. Density bars have area equal to the share of values in the class, so the total area is 1 and each bar of width 1 has height near $1/15 = 0.0667$, the height of the uniform rectangle."
  },
  {
    "type": "fill",
    "q": "**Part 2 (c) (1 of 2 marks), the simulated share.** The share of simulated waits below 4 minutes. Fill the function that counts the values.",
    "code": "p.sim <- sum(X.vals < 4)/___(X.vals)",
    "answer": ["length"],
    "explain": "The full line: `p.sim <- sum(X.vals < 4)/length(X.vals)`. `X.vals < 4` gives one TRUE or FALSE per wait; `sum()` counts the TRUEs; `length()` counts all the waits. `sum(X.vals < 4)/m.trials` is the same value. Expect a number close to 0.2667, different in the third or fourth decimal each run."
  },
  {
    "type": "fill",
    "q": "**Part 2 (c) (1 of 2 marks), the theoretical value.** P(X < 4) from the uniform model. Fill the function name.",
    "code": "p.theory <- ___(4, X.min, X.max)",
    "answer": ["punif"],
    "explain": "The full line: `p.theory <- punif(4, X.min, X.max)`. `punif(q, min, max)` is the area to the left of q. On paper: $$F(4) = \\dfrac{x - a}{b - a} = \\dfrac{\\underbrace{4}_{\\text{wait asked}} - \\underbrace{0}_{\\text{shortest wait}}}{\\underbrace{15}_{\\text{longest wait}} - \\underbrace{0}_{\\text{shortest wait}}} = \\mathbf{0.2667}$$"
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** P(Y < 5) for the help-desk wait, mean 8 minutes, with `beta <- 8` defined. Fill the rate slot.",
    "code": "pexp(5, rate=___)",
    "answer": ["1/beta", "1/8", "0.125"],
    "explain": "The full line: `pexp(5, rate=1/beta)`. `pexp(q, rate)` wants the rate, 1/β = 0.125 agents per minute, never β itself. On paper: $$F(5) = 1 - e^{-x/\\beta} = 1 - e^{-\\underbrace{5}_{\\text{wait asked}}/\\underbrace{8}_{\\text{mean wait}}} = 1 - 0.535261 = \\mathbf{0.4647}$$ Writing `rate=beta` answers a question about a mean wait of 1/8 of a minute."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** P(Y > 10). Fill the number in front of the call.",
    "code": "___ - pexp(10, rate=1/beta)",
    "answer": ["1"],
    "explain": "The full line: `1 - pexp(10, rate=1/beta)`. `pexp` gives the area to the left; more than is the whole area minus that. On paper the right tail is $e^{-x/\\beta}$: $$P(Y > 10) = e^{-\\underbrace{10}_{\\text{wait asked}}/\\underbrace{8}_{\\text{mean wait}}} = e^{-1.25} = \\mathbf{0.2865}$$ `pexp(10, rate=1/beta, lower.tail=FALSE)` gives the same value."
  },
  {
    "type": "fill",
    "q": "**Part 2 (e) (1 of 2 marks).** The median wait. Fill the function name.",
    "code": "Q2 <- ___(0.5, rate=1/beta)",
    "answer": ["qexp"],
    "explain": "The full line: `Q2 <- qexp(0.5, rate=1/beta)`. `qexp(p, rate)` goes from an area back to the time with that area to its left. On paper: $$x = -\\beta\\ln(1 - p) = -\\underbrace{8}_{\\text{mean wait}} \\times \\ln(1 - \\underbrace{0.5}_{\\text{half the area}}) = -8 \\times (-0.693147) = \\mathbf{5.5452}$$ The other two lines: `Q1 <- qexp(0.25, rate=1/beta)` and `Q3 <- qexp(0.75, rate=1/beta)`."
  },
  {
    "q": "**Part 2 (e) (1 of 2 marks).** `IQR <- Q3 - Q1`. What does R print for `IQR`? Work Q1 and Q3 on paper. (4 decimals)",
    "type": "numeric",
    "answer": 8.7889,
    "tolerance": 0.0001,
    "explain": "Each quartile is $x = -\\beta\\ln(1-p)$ with $\\beta = 8$ minutes, the mean wait. $$Q_1 = -\\underbrace{8}_{\\text{mean wait}} \\times \\ln(1 - \\underbrace{0.25}_{\\text{area left of Q1}}) = -8 \\times (-0.287682) = 2.3015$$ $$Q_3 = -\\underbrace{8}_{\\text{mean wait}} \\times \\ln(1 - \\underbrace{0.75}_{\\text{area left of Q3}}) = -8 \\times (-1.386294) = 11.0904$$ $$IQR = \\underbrace{11.0904}_{Q_3} - \\underbrace{2.3015}_{Q_1} = \\mathbf{8.7889}$$ The middle half of waits runs from about 2.3 to 11.1 minutes."
  },
  {
    "q": "**Part 2 (f) (1 mark).** Which sentence compares the median wait with the mean wait correctly?",
    "options": [
      "The median wait, 5.55 minutes, is below the mean wait of 8 minutes: a few very long waits pull the mean up, so the wait is skewed right.",
      "The median wait, 5.55 minutes, is below the mean wait of 8 minutes, so the wait is skewed left.",
      "The median wait equals the mean wait of 8 minutes, because the exponential is symmetric about β.",
      "The median wait is half the mean wait, 4 minutes, because half the area lies left of the median."
    ],
    "answer": 0,
    "explain": "For an exponential the mean is β = 8 minutes and the median is $\\beta\\ln 2 = 5.55$ minutes. Short waits are common and long waits rare but possible, so the curve has a long right tail; those long waits pull the mean above the median. A mean above the median means skewed right. Half the area does lie left of the median, but the curve is not flat, so the median is not $\\beta/2$."
  }
]
```

The paper-side tables for all of this are on [the know-cold sheet](#/math3042-q8/know-cold-q8); the R lines are taught in [punif, pnorm, pexp](#/math3042-q8/r-p-functions), [qnorm, qexp, qunif](#/math3042-q8/r-q-functions) and [simulating and the histogram](#/math3042-q8/r-simulate-continuous).
