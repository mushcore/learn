---
title: Chebyshev's rule
minutes: 12
---

The empirical rule (68-95-99.7) has one condition attached: the data must be **approximately normal** (bell-shaped, symmetric). When the shape is unknown, skewed, or definitely not normal, **Chebyshev's rule** applies instead.

## The rule

For **any** data set — any shape at all — the fraction of values with a Z-score between $-k$ and $+k$ is **at least**:

$$1 - \frac{1}{k^2}$$

The word "at least" is the whole point: Chebyshev gives a guaranteed lower bound that holds no matter how weird the distribution is. The empirical rule gives an exact estimate, but only when normality holds.

:::quiz "At least" is not "approximately"
Write "at least" for a Chebyshev answer and "approximately" for an empirical-rule answer; the Chebyshev guarantee is a floor, not an estimate.
:::

## Comparing the two rules

| $k$ | Chebyshev (at least) | Empirical rule (if normal) |
|---|---|---|
| 1 | $1 - 1/1 = 0\%$ | 68% |
| 2 | $1 - 1/4 = 75\%$ | 95% |
| 3 | $1 - 1/9 = 88.9\%$ | 99.7% |

Chebyshev's numbers are always smaller (weaker) than the empirical rule's, because Chebyshev has to work for every possible shape of data, including the worst case.

```widget
chebyshev
```

## Why $k = 1$ gives 0%

At $k=1$, Chebyshev guarantees nothing, and the bound is *tight*: a data set with **half the values at $-10$ and half at $+10$** has $\mu = 0$ and $\sigma = 10$, every value at $Z = \pm 1$ exactly, and none strictly between $-1$ and $+1$. Some data set really does achieve the worst case, so Chebyshev cannot promise more than 0% at $k=1$.

## When to use which rule

- Data is **roughly bell-shaped / normal** — use the empirical rule (68-95-99.7). It's more precise.
- Data's shape is **unknown, skewed, or you can't assume normal** — use Chebyshev. It's weaker but always valid.

## Worked example: moisture content

Pencil problem: moisture content has $\mu = 18$, $\sigma = 0.5$, and the shape is **not assumed normal**, so Chebyshev applies.

Question: what fraction of readings are guaranteed to fall between **17 and 19**?

First find $k$: $17$ and $19$ are each $1$ unit from the mean, and $\sigma = 0.5$, so $k = \frac{1}{0.5} = 2$.

$1 - \frac{1}{k^2} = 1 - \frac{1}{4} = 0.75 = \mathbf{75\%}$

At least 75% of moisture readings fall between 17 and 19, whatever the true shape of the distribution.

```quiz
[
  {
    "q": "Chebyshev's rule states that the fraction of data with Z between −k and +k is at least what?",
    "options": ["$1/k^2$", "$1 - 1/k^2$", "$1 - k^2$", "$k^2 - 1$"],
    "answer": 1,
    "explain": "$1 - 1/k^2$ — and this holds for any distribution shape, unlike the empirical rule."
  },
  {
    "q": "Using Chebyshev's rule, what percentage of data is guaranteed to lie within $k = 3$ standard deviations of the mean?",
    "type": "numeric",
    "answer": 88.9,
    "tolerance": 0.2,
    "unit": "%",
    "explain": "$1 - 1/9 = 0.8889 \\approx 88.9\\%$. Compare to 99.7% if the data were normal — Chebyshev is a weaker but universal guarantee."
  },
  {
    "q": "Using Chebyshev's rule, what percentage of data is guaranteed to lie within $k = 2$ standard deviations of the mean?",
    "type": "numeric",
    "answer": 75,
    "tolerance": 1,
    "unit": "%",
    "explain": "$1 - 1/4 = 0.75 = 75\\%$, versus 95% under the empirical rule (which requires normality)."
  },
  {
    "q": "What does Chebyshev's rule guarantee at $k = 1$?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "$1 - 1/1^2 = 0$. Chebyshev makes no guarantee at all within one standard deviation — the empirical rule's 68% only applies to (approximately) normal data."
  },
  {
    "q": "A data set with half its values at $Z=-1$ and half at $Z=+1$ shows that Chebyshev's $k=1$ bound of 0% cannot be improved in general.",
    "type": "tf",
    "answer": true,
    "explain": "That exact data set (half at $-10$, half at $+10$, with $\\mu=0, \\sigma=10$) has 0% of values strictly between $Z=-1$ and $Z=1$, so the 0% bound is achieved, not just theoretical."
  },
  {
    "q": "Chebyshev's rule requires the data to be approximately normal in order to apply.",
    "type": "tf",
    "answer": false,
    "explain": "The opposite is true — Chebyshev's rule works for ANY distribution shape. The empirical rule is the one that requires (approximate) normality."
  },
  {
    "q": "Moisture content has $\\mu = 18$, $\\sigma = 0.5$, and unknown shape. Using Chebyshev, what percentage of readings are guaranteed to fall between 17 and 19?",
    "type": "numeric",
    "answer": 75,
    "tolerance": 1,
    "unit": "%",
    "explain": "17 and 19 are each 1.0 from the mean; $k = 1.0/0.5 = 2$; Chebyshev gives $1 - 1/4 = 75\\%$."
  },
  {
    "q": "You are told a data set is heavily skewed and want a guaranteed lower bound for the fraction within 3 standard deviations of the mean. Which rule should you use?",
    "options": ["Empirical rule, because skew doesn't matter", "Chebyshev's rule, because it works for any shape", "Neither rule applies to skewed data", "Pearson's skewness formula"],
    "answer": 1,
    "explain": "Chebyshev is the universal tool — it applies regardless of shape, at the cost of a weaker (smaller) guaranteed percentage."
  },
  {
    "q": "For the same $k$, is Chebyshev's guaranteed percentage always less than or equal to the empirical rule's percentage (when the data actually is normal)?",
    "type": "tf",
    "answer": true,
    "explain": "Chebyshev must hold for the worst-case shape, so its bound is always weaker (smaller) than or equal to the empirical rule's estimate for normal data."
  }
]
```