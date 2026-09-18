---
title: Skewness
minutes: 12
---

Every measure so far has been about centre (mean, median), variation (range, SD, IQR), or position (Z-scores, percentiles). **Skewness** is a different kind of number entirely — it doesn't tell you where the data is or how spread out it is. It tells you how **non-symmetrical** the distribution is.

## Where mean and median disagree

For a perfectly symmetric distribution, the mean and the median sit at exactly the same spot. The moment a distribution grows a long tail on one side, the mean gets pulled toward that tail (because the mean uses every value, including the extreme ones) while the median barely moves (because the median only cares about rank).

- **Symmetric** → mean = median → skewness = 0.
- **Skewed left** (long tail on the left) → the tail drags the mean **down below** the median → skewness < 0.
- **Skewed right** (long tail on the right) → the tail drags the mean **up above** the median → skewness > 0.

A quick way to remember it: the sign of the skewness matches the side the mean sits relative to the median, which matches the side the tail points.

## Pearson's coefficient of skewness

$Sk = 3 \cdot \frac{\bar{X} - Q_2}{s}$ (sample) or $Sk = 3 \cdot \frac{\mu - Q_2}{\sigma}$ (population)

$Q_2$ is just the median. The factor of 3 and the division by $s$ (or $\sigma$) turn the raw gap between mean and median into a unit-free number you can compare across data sets.

**Highly skewed** is a specific threshold, not a vibe:
- Highly skewed **left**: $Sk < -1$.
- Highly skewed **right**: $Sk > +1$.

Anything between $-1$ and $+1$ is only mildly skewed (or symmetric, near 0).

:::quiz Sign direction
It is easy to get this backwards under quiz pressure. Say it out loud: **skewed left → mean is LESS than median** (the left tail pulls the mean down), **skewed right → mean is GREATER than median** (the right tail pulls the mean up). If a question gives you "mean 50, median 55," the mean is below the median, so the distribution is skewed **left** — even though nothing in the numbers says "left" directly.
:::

## Worked example: cat bodyweights

The instructor's example uses the `cats$Bwt` data from R's `MASS` package (n = 144 domestic cats):

- Mean $\bar{X} = 2.724$
- Median $Q_2 = 2.7$
- Sample SD $s = 0.4853$

$Sk = 3 \cdot \frac{2.724 - 2.7}{0.4853} \approx \mathbf{0.146}$

In R this is one line:

```r
3 * (mean(cats$Bwt) - median(cats$Bwt)) / sd(cats$Bwt)
```

$0.146$ is positive but well inside $(-1, 1)$, so cat bodyweight is **mildly skewed right** — a small number of heavier cats stretch the upper tail, pulling the mean just above the median.

:::warn Don't use the `moments` package formula
R's `moments` library has a `skewness()` function, but it uses a **different formula** (based on the third standardized moment, not Pearson's mean/median formula). The instructor was explicit: "ignore this" for this course. Always compute Pearson's $Sk = 3(\bar{X}-Q_2)/s$ by hand or with the one-liner above — not `moments::skewness()`.
:::

## Drag the data

Drag the skew slider and watch what happens: the median stays put while the mean slides toward whichever tail grows longer, and the Pearson $Sk$ value tracks that gap.

```widget
skewness
{ "title": "Skewness: mean chases the tail, median barely moves" }
```

## Drag the data

Now build the skew yourself. Drag a single point out into a tail and watch Pearson's $Sk$ cross the ±1 threshold.

```widget
drag-data
{ "data": "4 5 5 6 6 6 7 7 8", "title": "Drag a point out into a tail", "claims": [
  { "when": "sk>1", "text": "Sk > 1: highly skewed right — the tail you built is on the right." },
  { "when": "sk<-1", "text": "Sk < -1: highly skewed left — the tail you built is on the left." },
  { "when": "sk>0 && sk<=1", "text": "0 < Sk ≤ 1: mildly skewed right." },
  { "when": "sk<0 && sk>=-1", "text": "-1 ≤ Sk < 0: mildly skewed left." },
  { "when": "mean==median || (sk>-0.05 && sk<0.05)", "text": "Nearly symmetric: mean and median are close together." }
]}
```

## Quick recap

| Situation | Mean vs median | Sign of Sk |
|---|---|---|
| Symmetric | mean = median | $Sk = 0$ |
| Skewed left | mean < median | $Sk < 0$ |
| Skewed right | mean > median | $Sk > 0$ |
| Highly skewed left | — | $Sk < -1$ |
| Highly skewed right | — | $Sk > +1$ |

```quiz
[
  {
    "q": "A distribution has mean 50 and median 55. Which way is it skewed?",
    "options": ["Left", "Right", "It is symmetric", "Cannot tell from this"],
    "answer": 0,
    "explain": "Mean (50) is less than median (55), so $Sk < 0$: skewed left. The left tail pulls the mean down below the median."
  },
  {
    "q": "A distribution has mean 82 and median 75, with sample SD 6. Compute Pearson's Sk (2 decimals).",
    "type": "numeric",
    "answer": 3.5,
    "tolerance": 0.05,
    "explain": "$Sk = 3(82-75)/6 = 3(7)/6 = 21/6 = 3.5$."
  },
  {
    "q": "Is the distribution in the previous question highly skewed?",
    "type": "tf",
    "answer": true,
    "explain": "$Sk = 3.5 > 1$, so it is highly skewed right."
  },
  {
    "q": "For the cats bodyweight example, $\\bar{X} = 2.724$, $Q_2 = 2.7$, $s = 0.4853$. Compute Sk (3 decimals).",
    "type": "numeric",
    "answer": 0.146,
    "tolerance": 0.003,
    "explain": "$Sk = 3(2.724 - 2.7)/0.4853 \\approx 0.146$, computed in R with `3*(mean(cats$Bwt)-median(cats$Bwt))/sd(cats$Bwt)`."
  },
  {
    "q": "The cats bodyweight distribution ($Sk \\approx 0.146$) is:",
    "options": ["Highly skewed left", "Mildly skewed right", "Highly skewed right", "Perfectly symmetric"],
    "answer": 1,
    "explain": "$0 < 0.146 < 1$: positive but small, so it is mildly skewed right, not highly skewed."
  },
  {
    "q": "In a symmetric distribution, the mean is always exactly equal to the median.",
    "type": "tf",
    "answer": true,
    "explain": "Symmetric means the mean and median coincide, giving $Sk = 0$."
  },
  {
    "q": "If a distribution has a long tail stretching out to the left, what happens to the mean relative to the median?",
    "options": ["Mean shifts right, above the median", "Mean shifts left, below the median", "Mean and median stay equal", "The median shifts, not the mean"],
    "answer": 1,
    "explain": "A left tail contains extreme low values, which pull the mean (which uses every value) down below the median (which only reflects rank)."
  },
  {
    "q": "R's `moments::skewness()` function should be used for Pearson's coefficient of skewness in this course.",
    "type": "tf",
    "answer": false,
    "explain": "The instructor said to ignore the `moments` package formula. Use Pearson's $Sk = 3(\\bar{X}-Q_2)/s$ instead."
  },
  {
    "q": "A distribution has $Sk = -1.4$. What does this tell you?",
    "options": ["Highly skewed right", "Highly skewed left", "Mildly skewed left", "Symmetric"],
    "answer": 1,
    "explain": "$Sk < -1$ is the threshold for highly skewed left."
  }
]
```
