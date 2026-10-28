---
title: The formula sheet gives you this; you must know this cold
minutes: 15
---

Left: printed on the provided formula sheet. Right: printed nowhere.

Round a probability to 4 decimals, anything else to 3 significant digits.

| Unit 1: describing data: the formula sheet gives you | You must know cold |
|---|---|
| $\bar{X}$, $\mu$, $s$, $\sigma$, $Z$, $CV$, $Sk = 3(\bar{X} - Q_2)/s$ | median at $(n+1)/2$; unusual if $\lvert Z \rvert > 2$; right skew: mean > median; bimodal = two peaks |
| fences $Q_1 - 1.5\,IQR$, $Q_3 + 1.5\,IQR$; empirical rule; Chebyshev | $IQR = Q_3 - Q_1$; hand quartiles: median of each half, odd $n$ drops the median; boxplot: box $Q_1$ to $Q_3$, line $Q_2$, whiskers to the last values inside the fences; empirical rule only if bell-shaped |

| Unit 2: tables and graphs: the formula sheet gives you | You must know cold |
|---|---|
| grouped mean $\sum f x/\sum f$ ($x$ = midpoint) | about $\sqrt{n}$ classes $[a, b)$, width $\text{range}/\sqrt{n}$ rounded up; relative frequency $f/n$; cumulative = running sum |

| Unit 3: probability: the formula sheet gives you | You must know cold |
|---|---|
| addition, multiplication and complement rules; $P(n,r)$, $C(n,r)$; Bayes | $P(A \mid B) = P(A \cap B)/P(B)$; independent if $P(A \mid B) = P(A)$; at least one $= 1 - P(\text{none})$; multiply the choices; without replacement: $\frac{42}{312}\cdot\frac{41}{311}$ |

| Unit 4: discrete distributions: the formula sheet gives you | You must know cold |
|---|---|
| $\mu = \sum x P(x)$; $\sigma^2 = \sum (x-\mu)^2 P(x) = \sum x^2 P(x) - \mu^2$ | $\sum P(x) = 1$; carry $\mu$ unrounded; money: $X$ = net payoff = prize − cost |
| binomial, hypergeometric, geometric, Poisson: $P(x)$, $\mu$, $\sigma^2$ | binomial: fixed $n$, the same $p$ each trial (with replacement, or $n \le$ 5 % of $N$); hypergeometric: without replacement and $n >$ 5 % of $N$; geometric: $X$ = **trials** to the first success, $P(X \ge k) = q^{k-1}$; Poisson: counts in an interval, $\lambda$ = rate × interval, separate intervals multiply |

## R the R sheet does not give you

The R sheet has only bare binomial and Poisson names. Geometric: R counts failures.

| | $P(X = x)$ | $P(X \le k)$ | `reps` random values |
|---|---|---|---|
| binomial | `dbinom(x, n, p)` | `pbinom(k, n, p)` | `rbinom(reps, n, p)` |
| hypergeometric | `dhyper(x, K, N-K, n)` | `phyper(k, K, N-K, n)` | `rhyper(reps, K, N-K, n)` |
| geometric | `dgeom(x-1, p)` | `pgeom(k-1, p)` | `rgeom(reps, p) + 1` |
| Poisson | `dpois(x, lambda)` | `ppois(k, lambda)` | `rpois(reps, lambda)` |

| Event | R |
|---|---|
| exactly $k$ | `d(k)` |
| at most $k$ | `p(k)` |
| fewer than $k$ | `p(k-1)` |
| at least $k$ | `1 - p(k-1)` |
| more than $k$ | `1 - p(k)` or `lower.tail = FALSE` |
| $a$ to $b$ | `p(b) - p(a-1)` |
| each of two periods | `p(k)^2` |
| a doubled interval | `ppois(k, 2*lambda)` |

Simulate: `sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045))`; `f <- function(n) { X <- rbinom(1, n, p); return(X/n) }`.

Data: `quantile(df$col, 0.20)`; `library(dplyr)`, `filter(df, col < 250)`; `library(mosaic)`, `bwplot(y ~ g, data = df, main = "", xlab = "", ylab = "")` or `boxplot(y ~ g, data = df)`.

:::quiz Twenty recall prompts
Cover the Answer column, answer each prompt, then uncover.

| # | Prompt | Answer |
|---|---|---|
| 1 | $P(A \mid B)$? | $P(A \cap B)/P(B)$ |
| 2 | Independence test? | $P(A \mid B) = P(A)$ |
| 3 | P(at least one)? | $1 - P(\text{none})$ |
| 4 | Median position? | $(n+1)/2$ |
| 5 | $IQR$? | $Q_3 - Q_1$ |
| 6 | Right skew: which is larger, mean or median? | the mean |
| 7 | Unusual if? | $\lvert Z \rvert > 2$ |
| 8 | Empirical rule needs? | bell shape |
| 9 | Net payoff? | prize − cost |
| 10 | λ, 6 per hour over 20 minutes? | 2 |
| 11 | Sample without replacement from 40? | hypergeometric |
| 12 | Trials to the first success? | geometric |
| 13 | Geometric $P(X \ge k)$? | $q^{k-1}$ |
| 14 | R, geometric $P(X = x)$? | `dgeom(x-1, p)` |
| 15 | R, binomial $P(X \ge k)$? | `1 - pbinom(k-1, n, p)` |
| 16 | `dhyper` argument order? | x, K, N−K, n |
| 17 | R: P(exactly 1 in each of two separate hours)? | `dpois(1, lambda)^2` |
| 18 | Variance shortcut? | $\sum x^2P(x) - \mu^2$ |
| 19 | Rounding? | 4 decimals; 3 s.f. |
| 20 | A simulation function calls? | an r-function or `sample` |
:::

```quiz
[
  {
    "q": "P(the 7th call is the first to get through), p = 0.3, counting calls as the course does. Fill the slot.",
    "type": "fill",
    "code": "dgeom(___, 0.3)",
    "answer": ["6"],
    "explain": "R counts failures before the first success: 7 calls is 6 failures, so `dgeom(6, 0.3)` gives $$0.7^6 \\times 0.3 = \\mathbf{0.0353}$$"
  },
  {
    "q": "P(at least 4 of 15 laptops fail), each fails with probability 0.1 independently. Fill the slot.",
    "type": "fill",
    "code": "1 - pbinom(___, 15, 0.1)",
    "answer": ["3"],
    "explain": "At least 4 is the complement $$1 - P(X \\le 3)$$ so the cumulative stops at 3."
  },
  {
    "q": "A box of 25 USB keys holds 4 faulty ones; 6 are taken. P(exactly 2 faulty). Fill the population-failures slot as R expects it.",
    "type": "fill",
    "code": "dhyper(2, 4, ___, 6)",
    "answer": ["25-4", "25 - 4", "21"],
    "explain": "`dhyper(x, K, N-K, n)`: x = 2, successes in the population K = 4, failures in the population $$N - K = 25 - 4 = 21$$ sample size n = 6."
  },
  {
    "q": "Same box: P(more than 1 faulty) without the `1 -`. Fill the slot.",
    "type": "fill",
    "code": "phyper(1, 4, 21, 6, lower.tail = ___)",
    "answer": ["FALSE", "F"],
    "explain": "`lower.tail = FALSE` gives P(X > 1), the same as `1 - phyper(1, 4, 21, 6)`."
  },
  {
    "q": "Texts arrive at 2 per hour. Which λ do you use for P(exactly 3 texts in 90 minutes)?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.05,
    "explain": "Rate times interval: $$\\lambda = 2 \\text{ per hour} \\times 1.5 \\text{ hours} = \\mathbf{3}$$"
  },
  {
    "q": "Five independent tries, each succeeds with probability 0.1. P(at least one success), 4 decimals.",
    "type": "numeric",
    "answer": 0.40951,
    "tolerance": 0.0001,
    "explain": "Let X = the number of successes. $$P(\\text{at least one}) = 1 - P(\\text{none}) = 1 - 0.9^5 = 1 - 0.59049 = \\mathbf{0.4095}$$"
  },
  {
    "q": "Ten cards are dealt from a 52-card deck and the hearts are counted. Name the distribution.",
    "type": "text",
    "answer": ["hypergeometric", "hyper"],
    "explain": "A fixed sample without replacement from a finite population (10 of 52 is over 5 %), so hypergeometric with N = 52, K = 13, n = 10."
  },
  {
    "q": "Write on paper the line that filters `Gas` (a data frame) to rows with `price` above 2, then type the function you used.",
    "type": "text",
    "answer": ["filter", "subset"],
    "explain": "`library(dplyr)` then `filter(Gas, price > 2)`; or `subset(Gas, price > 2)`; or `Gas[Gas$price > 2, ]`."
  },
  {
    "q": "Write on paper side-by-side boxplots of `Pulse` by `Exer` from the `survey` data frame with a title and axis labels, then type the function you used.",
    "type": "text",
    "answer": ["bwplot", "boxplot"],
    "explain": "`library(mosaic)` then `bwplot(Pulse ~ Exer, data = survey, main = \"Pulse by exercise level\", xlab = \"Exercise\", ylab = \"Pulse (beats per minute)\")`; or `boxplot(Pulse ~ Exer, data = survey, main = \"Pulse by exercise level\", xlab = \"Exercise\", ylab = \"Pulse (beats per minute)\")`."
  },
  {
    "q": "A simulation function must draw random values. Fill the slot so `late(n)` returns the simulated proportion of n buses that are late, each late with probability 0.2.",
    "type": "fill",
    "code": "late <- function(n) {\n  X <- ___(1, n, 0.2)\n  return(X/n)\n}",
    "answer": ["rbinom"],
    "explain": "`rbinom(1, n, 0.2)` draws one binomial count of late buses; dividing by n gives the proportion. Returning `n*0.2/n` computes the average instead of simulating it and scores zero."
  }
]
```
