---
title: Formula sheet
minutes: 20
---

Everything from Unit 1 on one page. No new explanations here — this is a lookup reference for the night before the quiz. If a formula doesn't make sense, go back to its chapter.

## Symbol legend

| Symbol | Meaning | Symbol | Meaning |
|---|---|---|---|
| $X$ | a variable (measured quantity) | $N$ | population size |
| $n$ | sample size | $X_i$ | class mark / individual value $i$ |
| $\bar{X}$ | sample mean | $\mu$ | population mean |
| $s$ | sample standard deviation | $\sigma$ | population standard deviation |
| $\hat{p}$ | sample proportion | $p$ | population proportion |
| $r$ | sample correlation | $\rho$ | population correlation |
| $Q_1, Q_2, Q_3$ | quartiles ($Q_2$ = median) | $IQR$ | interquartile range |
| $f_i$ | frequency of class $i$ | $Z$ | Z-score (standard score) |
| $R$ | range | $Sk$ | Pearson skewness coefficient |
| $P_k$ | $k$-th percentile | $x$, $y$ | correlation pair values |

A **statistic** describes a sample ($\bar{X}, s, \hat{p}, r$). A **parameter** describes a population ($\mu, \sigma, p, \rho$).

## Proportions

$\hat{p} = \dfrac{x}{n}$ (sample) $\qquad p = \dfrac{X}{N}$ (population)

$x$ = count of individuals in the category, $n$ = sample size.

## Mean

$\bar{X} = \dfrac{\Sigma X}{n}$ (sample) $\qquad \mu = \dfrac{\Sigma X}{N}$ (population)

**Grouped mean:** $\bar{X} = \dfrac{\Sigma f_i X_i}{\Sigma f_i}$ — $X_i$ is the class mark (midpoint), $f_i$ its frequency.

## Median / mode

- Sort the data. Odd $n$: median is the exact middle value. Even $n$: median is the mean of the two middle values.
- Mode: the most frequently occurring value. R has no base `mode()` statistical function — build a frequency table and take the max.

## Range and standard deviation

$R = \max - \min$

$s = \sqrt{\dfrac{\Sigma(X-\bar{X})^2}{n-1}}$ (sample) $\qquad \sigma = \sqrt{\dfrac{\Sigma(X-\mu)^2}{N}}$ (population)

**Grouped:** $s = \sqrt{\dfrac{\Sigma f_i(X_i-\bar{X})^2}{\Sigma f_i - 1}}$

Sample $s$ divides by $n-1$ so that $s^2$ is an unbiased estimator of $\sigma^2$. $s$ and $\sigma$ share units with $X$; unlike $R$ and $IQR$, they depend on **every** data value.

## Coefficient of variation

$CV = \dfrac{s}{\bar{X}} \times 100\%$ (sample) $\qquad CV = \dfrac{\sigma}{\mu} \times 100\%$ (population)

Use $CV$, not raw $s$, whenever you compare variability between two data sets with **different means**.

## Z-score

$Z = \dfrac{X - \mu}{\sigma}$ (population) $\qquad Z = \dfrac{X - \bar{X}}{s}$ (sample)

Going backwards: $X = \mu + Z\sigma \qquad X = \bar{X} + Zs$

**Unusual:** $Z < -2$ or $Z > +2$ (about the outer 5%). This is a different rule from "outlier" — see fences below.

## Empirical rule (requires bell-shaped/normal data)

| Interval | % of data (in) | % of data (outside, per tail) |
|---|---|---|
| $\mu \pm 1\sigma$ | 68% | 16% |
| $\mu \pm 2\sigma$ | 95% | 2.5% |
| $\mu \pm 3\sigma$ | 99.7% | 0.15% |

**Cumulative "percent below" table** (reading left to right, empirical-rule Z-boundaries):

| $Z$ | $-3$ | $-2$ | $-1$ | $0$ | $+1$ | $+2$ | $+3$ |
|---|---|---|---|---|---|---|---|
| % of data **below** | 0.15% | 2.5% | 16% | 50% | 84% | 97.5% | 99.85% |

Read this table directly: e.g. "% below $Z=+2$" $= 97.5\%$ because it is everything up to $-2\sigma$ (2.5%) plus the whole lower half (50%) plus half of the middle band ($95\%/2 = 47.5\%$): $2.5+50+47.5$... more simply, it's $50\% + 95\%/2 = 97.5\%$, or just read the table.

## Chebyshev's rule (works for ANY distribution shape)

Fraction of data with $-k < Z < k$ is **at least** $1 - \dfrac{1}{k^2}$.

| $k$ | Minimum % (Chebyshev) |
|---|---|
| 1.5 | 55.6% |
| 2 | 75% |
| 2.5 | 84% |
| 3 | 88.9% |

"At least" is a guaranteed floor, not an estimate — use Chebyshev when the shape is unknown or not normal; use the empirical rule (sharper) only when the data is bell-shaped.

## Quartiles by hand

1. Sort the data and find the median $Q_2$.
2. If $n$ is **odd**, exclude the middle value; if $n$ is **even**, don't exclude anything.
3. $Q_1$ = median of the lower half. $Q_3$ = median of the upper half.

R's `quantile()` interpolates differently and may not match the hand method exactly — both are valid ("about 10 different ways to define quartiles").

## Percentiles

$P_k$ separates the lowest $k\%$ from the upper $(100-k)\%$. $Q_1 = P_{25}$, $Q_2 = P_{50}$, $Q_3 = P_{75}$.

In R: `quantile(data$X, k/100)` — the percentage is a **decimal** (`0.33`, not `33`).

## IQR, fences, outliers

$IQR = Q_3 - Q_1$ — the range of the middle 50%. Advantage/disadvantage: ignores extreme values (same fact, both sides).

$\text{lower fence} = Q_1 - 1.5 \times IQR \qquad \text{upper fence} = Q_3 + 1.5 \times IQR$

Beyond a fence = **outlier**. Outlier (fence rule) $\ne$ Unusual (Z-score rule) — different formulas, often but not always agree.

## Skewness (Pearson)

$Sk = \dfrac{3(\bar{X} - Q_2)}{s}$ (sample) $\qquad Sk = \dfrac{3(\mu - Q_2)}{\sigma}$ (population)

| Sign of $Sk$ | Shape | Mean vs. median |
|---|---|---|
| $Sk = 0$ | Symmetric | mean = median |
| $Sk < 0$ | Skewed left | mean < median |
| $Sk > 0$ | Skewed right | mean > median |

"Highly skewed" when $Sk < -1$ or $Sk > +1$.

## Correlation

$r = \dfrac{n\Sigma xy - \Sigma x \Sigma y}{\sqrt{n\Sigma x^2 - (\Sigma x)^2}\sqrt{n\Sigma y^2 - (\Sigma y)^2}}$

| $r$ value | Interpretation |
|---|---|
| $r = 1$ | perfect positive linear |
| $r$ close to $1$ | strong positive linear |
| $r \approx 0$ | little to no linear relationship |
| $r$ close to $-1$ | strong negative linear |
| $r = -1$ | perfect negative linear |

Properties: $-1 \le r \le 1$; unaffected by unit changes; unaffected by swapping $X$ and $Y$; measures **linear** relationships only (a strong curve can have $r \approx 0$); correlation $\ne$ causation.

## R function crib sheet

| Task | R function |
|---|---|
| Sample mean | `mean(x)` |
| Sample median | `median(x)` |
| Sample standard deviation | `sd(x)` (always the **sample** version, $n-1$) |
| Frequency table | `table(x)` |
| Mode (no base function) | `as.double(names(which.max(table(x))))` |
| Quartiles / percentiles | `quantile(x)` all five; `quantile(x, k/100)` for $P_k$ |
| Interquartile range | `IQR(x)` $= Q_3 - Q_1$ |
| Boxplot | `boxplot(x)`; `boxplot(y ~ group, data = df)` for side-by-side |
| Correlation | `cor(x, y)` |
| Histogram | `hist(x, breaks = ..., right = FALSE)` |

## Quick self-check

```quiz
[
  {
    "q": "Which formula is Chebyshev's rule?",
    "options": ["$1 - 1/k^2$", "$1 - 1/k$", "$k^2 - 1$", "$1/(1-k^2)$"],
    "answer": 0,
    "explain": "Chebyshev's rule: the fraction of data within $k$ standard deviations of the mean is at least $1 - 1/k^2$, for any distribution shape."
  },
  {
    "q": "Chebyshev's minimum guaranteed percentage at $k = 2.5$?",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "$1 - 1/2.5^2 = 1 - 1/6.25 = 1 - 0.16 = 0.84 = 84\\%$."
  },
  {
    "q": "Under the empirical rule, what percent of a normal distribution lies **below** $Z = -1$?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "From the cumulative table: $Z=-1 \\to 16\\%$ below. (Half the outer 32% outside $\\mu\\pm\\sigma$ falls in the lower tail: $32\\%/2=16\\%$.)"
  },
  {
    "q": "The upper outlier fence is $Q_3 + 1.5 \\times IQR$.",
    "type": "tf",
    "answer": true,
    "explain": "Correct — and the lower fence is $Q_1 - 1.5 \\times IQR$."
  },
  {
    "q": "Which R function directly returns $Q_3 - Q_1$?",
    "options": ["`IQR(x)`", "`range(x)`", "`sd(x)`", "`var(x)`"],
    "answer": 0,
    "explain": "`IQR(x)` computes the interquartile range directly, equivalent to `quantile(x, 0.75) - quantile(x, 0.25)`."
  },
  {
    "type": "match",
    "q": "Match each symbol to its meaning, from the legend at the top of this page.",
    "pairs": [
      ["μ", "population mean"],
      ["σ", "population standard deviation"],
      ["X̄", "sample mean"],
      ["s", "sample standard deviation"],
      ["ρ", "population correlation"],
      ["r", "sample correlation"],
      ["p̂", "sample proportion"],
      ["IQR", "interquartile range"],
      ["Z", "Z-score (standard score)"],
      ["Sk", "Pearson skewness coefficient"]
    ],
    "explain": "A statistic (X̄, s, p̂, r) describes a sample; the matching Greek-letter parameter (μ, σ, p, ρ) describes the population it estimates."
  }
]
```
