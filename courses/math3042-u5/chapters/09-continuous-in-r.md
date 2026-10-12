---
title: punif, pnorm, qnorm, pexp, qexp and curve()
minutes: 20
---

Every area and percentile in this unit is one line of base R, in the same `p`/`q`/`d`/`r` pattern the Unit 4 notebook used for `dbinom` and `pbinom`.

:::info By analogy with notebook 4
No Unit 5 demo notebook or lab is posted yet. The functions here are the base R functions the Unit 4 notebook's pattern implies, and the one R line printed in the notes, `pnorm(120, 100, 15)`, confirms the style. Outputs are computed and checked; the posted notebook replaces them if it differs.
:::

## The letter in front says what the function answers

| Prefix | Answers | Uniform | Normal | Exponential |
|---|---|---|---|---|
| `p` | an area: $P(X \le x)$ | `punif(x, a, b)` | `pnorm(x, mu, sigma)` | `pexp(x, rate)` |
| `q` | a percentile: the $x$ with $P(X \le x) = p$ | `qunif(p, a, b)` | `qnorm(p, mu, sigma)` | `qexp(p, rate)` |
| `d` | the density height $f(x)$ | `dunif` | `dnorm` | `dexp` |
| `r` | random draws | `runif(n, a, b)` | `rnorm(n, mu, sigma)` | `rexp(n, rate)` |

`p` and `q` are inverses: `qnorm(pnorm(1.96))` is 1.96. The normal defaults are `mu = 0, sigma = 1`, so `pnorm(z)` alone is the Z table. The exponential takes a **rate**, $1/\beta$, never $\beta$.

## punif: the bus

Every uniform area is a difference of two `punif` values, or `1 -` one of them. The arguments are `min` and `max`, the ends $a$ and $b$ of the interval; `qunif(0.75, 0, 20)` returns 15, the 75th percentile of the wait, since for a flat density the percentile is simply $a + p(b - a)$.

```r
punif(11, 0, 20) - punif(8, 0, 20)   # between 8 and 11 minutes
1 - punif(12, 0, 20)                 # more than 12 minutes
punif(4, 0, 20) - punif(4, 0, 20)    # exactly 4 minutes
```

```text
[1] 0.15
[1] 0.4
[1] 0
```

## pnorm: the Z table and the three normal examples

```r
pnorm(-1.96)                       # P(Z <= -1.96), left tail
1 - pnorm(2.33)                    # P(Z > 2.33), right tail
pnorm(1.10) - pnorm(0.55)          # P(0.55 <= Z <= 1.10)
pnorm(120, 100, 15)                # IQ below 120, no standardizing needed
pnorm((120 - 100) / 15)            # the same through Z = 1.3333
pnorm(1.33)                        # Z rounded to two decimals, the table's value
pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)   # radiation (a)
1 - pnorm(5, 4.35, 0.5)                        # radiation (b)
1 - pnorm(0.5, 0, 0.22)            # noise above 0.5 V: a 0 bit read as 1
```

```text
[1] 0.0249979
[1] 0.009903076
[1] 0.1554936
[1] 0.9087888
[1] 0.9087888
[1] 0.9082409
[1] 0.4031995
[1] 0.09680048
[1] 0.01152131
```

The IQ lines show why the table and R differ in the fourth decimal: R keeps $Z = 1.3333$, the table rounds it to 1.33. Passing `mu` and `sigma` to `pnorm` skips the standardizing step altogether. A right tail can also be asked for directly with `pnorm(2.33, lower.tail = FALSE)`, which returns the same 0.009903076 as `1 - pnorm(2.33)`; the `1 -` form is the one that matches the table arithmetic on the answer line.

## qnorm: percentiles without the table

```r
qnorm(0.95)                        # z with 95% below: the table's 1.645
qnorm(0.95, 4.35, 0.5)             # radiation (c): the 95th percentile in mrem
4.35 + qnorm(0.95) * 0.5           # the same by mu + z sigma
qnorm(c(0.90, 0.975, 0.99, 0.995)) # z for 1.28, 1.96, 2.33, 2.576
```

```text
[1] 1.644854
[1] 5.172427
[1] 5.172427
[1] 1.281552 1.959964 2.326348 2.575829
```

By hand with $z = 1.645$ the answer is $4.35 + 1.645(0.5) = 5.1725$, which rounds to the same 5.17 mrem.

## pexp and qexp: rate = 1/β

```r
pexp(4, rate = 1/2.5)              # web server (b), beta = 2.5 s
qexp(0.95, rate = 1/2.5)           # web server (e), 95th percentile
rate <- 30/60                      # teller: 30 per hour = 0.5 per minute, beta = 2
pexp(2.5, rate) - pexp(1.5, rate)  # teller (a)
(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))   # teller (b)
qexp(0.75, rate)                   # teller (c)
pexp(4, 2.5)                       # WRONG: rate 2.5 means beta = 0.4 s
```

```text
[1] 0.7981035
[1] 7.489331
[1] 0.1858618
[1] 0.1858618
[1] 2.772589
[1] 0.9999546
```

The last line is the trap: R accepted `2.5` as a rate and answered a different question. Write `rate = 1/beta` explicitly.

## curve(): drawing a density

`curve(expr, from, to)` plots an expression in `x`. The notes' IQ figure and the exponential's shape:

```r
curve(dnorm(x, 100, 15), from = 40, to = 160,
      xlab = "IQ", ylab = "prob density f(x)",
      main = "Distribution of IQ Scores (mu = 100, sigma = 15)")
abline(v = 120, lty = 2)                       # the X = 120 cut

curve(dexp(x, rate = 0.4), from = 0, to = 15,
      xlab = "seconds", ylab = "f(x)", main = "Exponential, beta = 2.5")
dnorm(100, 100, 15)                            # peak height of the IQ curve
dexp(0, rate = 0.4)                            # height at 0 is 1/beta
```

```text
[1] 0.02659615
[1] 0.4
```

The IQ bell peaks at 0.0266 and the exponential starts at 0.4 and decays; both are heights, not probabilities. To shade an area, `polygon()` fills a region: `xs <- seq(40, 120, 0.1); polygon(c(xs, 120, 40), c(dnorm(xs, 100, 15), 0, 0), col = "lightblue")` shades the 0.9088 below 120.

## runif, rnorm, rexp: simulate and check μ and σ

The Unit 4 habit: draw many values, then `mean()` and `sd()` should land near the formula's $\mu$ and $\sigma$.

```r
set.seed(1)
T <- runif(10000, 0, 20)           # bus waits
mean(T); sd(T)                     # near 10 and 5.77 = 20/sqrt(12)
mean(T > 12)                       # near 0.4: the fraction of TRUEs is an estimate of P(T > 12)

X <- rexp(10000, rate = 1/2.5)     # web server gaps
mean(X); sd(X)                     # both near 2.5: mean = sd = beta
mean(X <= 4)                       # near 0.7981
quantile(X, 0.95)                  # near 7.49

Y <- rnorm(10000, 100, 15)
mean(Y < 120)                      # near 0.9088
```

Each run prints different numbers (the seed fixes one run), all within a few hundredths of the formula values; `mean(X <= 4)` is Lab 4's $k/m$ estimate written in one call.

```quiz
[
  {
    "type": "fill",
    "q": "Complete the line that gives the 95th percentile of cosmic radiation, $\\mu = 4.35$, $\\sigma = 0.5$ mrem.",
    "code": "qnorm(___, 4.35, 0.5)",
    "answer": ["0.95"],
    "explain": "qnorm takes the probability below and returns the x: 5.172427. The table route is 4.35 + 1.645(0.5)."
  },
  {
    "q": "`pexp(4, 2.5)` is the wrong call for a web server with mean wait 2.5 s because...",
    "options": ["pexp needs the mean as the first argument", "the second argument is the rate $1/\\beta = 0.4$; 2.5 is read as a rate, i.e. a mean of 0.4 s", "pexp only accepts rate = 1", "the answer should use qexp"],
    "answer": 1,
    "explain": "R returned 0.9999546 instead of 0.7981035. Always write rate = 1/beta."
  },
  {
    "type": "match",
    "q": "Match the R prefix to the question it answers.",
    "pairs": [["`p`", "an area: $P(X \\le x)$"], ["`q`", "a percentile: the x with a given area below"], ["`d`", "the density height $f(x)$"], ["`r`", "random draws from the distribution"]],
    "explain": "pnorm, qnorm, dnorm, rnorm; the same four letters for unif and exp."
  },
  {
    "q": "Which line gives $P(Z > 2.33)$?",
    "options": ["`pnorm(2.33)`", "`qnorm(2.33)`", "`1 - pnorm(2.33)`", "`pnorm(-2.33, lower.tail = FALSE)`"],
    "answer": 2,
    "explain": "pnorm gives the left tail 0.9901; subtract from 1 for 0.009903. By symmetry `pnorm(-2.33)` is also correct, but option 3 flips the wrong tail."
  },
  {
    "q": "`pnorm(120, 100, 15)` prints 0.9087888 but the table gives 0.9082. Why?",
    "options": ["R uses a different normal distribution", "the table is wrong", "R keeps Z = 1.3333 while the table reads the row for Z rounded to 1.33", "pnorm returns a right tail"],
    "answer": 2,
    "explain": "`pnorm(1.33)` reproduces the table's 0.9082409. Both are accepted; say which you used."
  },
  {
    "q": "The bus comes every 20 minutes. Which line is $P(8 \\le T \\le 11)$?",
    "options": ["`punif(11, 0, 20) - punif(8, 0, 20)`", "`punif(11 - 8, 0, 20)`", "`dunif(11, 0, 20) - dunif(8, 0, 20)`", "`qunif(0.15, 0, 20)`"],
    "answer": 0,
    "explain": "Area between two points is the difference of two cumulative values: 0.55 − 0.40 = 0.15. Option 1 gives the area from 0 to 3, also 0.15 here only because the density is flat; it is the wrong idea."
  },
  {
    "q": "`mean(X <= 4)` where `X <- rexp(10000, rate = 0.4)` returns...",
    "options": ["the mean of the first 4 values", "TRUE or FALSE", "4", "the fraction of the 10 000 draws at or below 4, an estimate of $P(X \\le 4) \\approx 0.7981$"],
    "answer": 3,
    "explain": "The comparison is a logical vector; its mean is the proportion of TRUEs, Lab 4's k/m in one call."
  },
  {
    "q": "For `X <- rexp(10000, rate = 1/2.5)`, `mean(X)` and `sd(X)` both come out near...",
    "options": ["0.4", "2.5", "1.6", "6.25"],
    "answer": 1,
    "explain": "$\\mu = \\sigma = \\beta = 2.5$. The rate 0.4 is not the mean; 6.25 is the variance $\\beta^2$."
  }
]
```
