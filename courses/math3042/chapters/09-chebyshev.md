---
title: Chebyshev's rule
minutes: 18
---
<!-- facts: classic.data.monsters -->

The empirical rule (68-95-99.7) has one condition attached: the data must be **approximately normal** (bell-shaped, symmetric). When the shape is unknown, skewed, or definitely not normal, as with the MapleStory Classic monster HP list where the empirical rule failed, **Chebyshev's rule** applies instead.

## The rule

For **any** data set — any shape at all — the fraction of values with a Z-score between $-k$ and $+k$ is **at least**:

$$1 - \frac{1}{k^2}$$

The word "at least" is the whole point: Chebyshev gives a guaranteed lower bound that holds no matter how weird the distribution is. The empirical rule gives an approximate percentage, and only when the data are bell-shaped: write "at least" for a Chebyshev answer and "approximately" for an empirical-rule answer.

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

## Classic World monster HP: the bound that still holds

meowdb's monster table for MapleStory Classic World, Nexon's separate classic-era server, gives HP for 92 monsters [Classic, Classic World Grand Launch monster table, checked 2026-10-27]. Without the 5 rows that give 0 EXP (test mobs and a training dummy), 87 remain, with $\bar{X}$ = 8 614.07 HP and $s$ = 36 751.8 HP. The median is 1 001 and Jr. Balrog has 325 400, so the list is heavily right-skewed. That non-bell shape is exactly where the empirical rule failed and "at least" is the only promise left.

```quiz
[
  {"q": "Classic monster HP, 87 values. Chebyshev guarantees at least what percentage within $\\bar{X} \\pm 2s$?", "type": "numeric", "answer": 75, "tolerance": 0.05, "unit": "%", "explain": "$k = 2$: $1 - 1/k^2 = 1 - 1/4 = 0.75 = 75\\%$. The bound uses only $k$; it does not care that HP is skewed."},
  {"q": "85 of the 87 HP values actually fall inside $\\bar{X} \\pm 2s$ (−64 900 to 82 100 HP). What percentage is that? (1 decimal)", "type": "numeric", "answer": 97.7, "tolerance": 0.05, "unit": "%", "explain": "$85/87 = 0.9770 = 97.7\\%$, at least 75% as promised. Only Rotten Mushmom (86 400) and Jr. Balrog (325 400) are outside."}
]
```

| $k$ | Interval (HP) | Inside | Observed | Chebyshev: at least | Empirical rule says |
|---|---|---|---|---|---|
| 1.5 | −46 500 to 63 700 | 84 | 96.6% | 55.6% | (no band) |
| 2 | −64 900 to 82 100 | 85 | 97.7% | 75% | 95% |
| 3 | −102 000 to 119 000 | 86 | 98.9% | 88.9% | 99.7% |

At every $k$ the observed share clears Chebyshev's bound, so the bound is true here, as it must be for any list. The empirical rule's 99.7% at $k = 3$ is not: Jr. Balrog sits outside, leaving 1.1% beyond $\pm 3s$. Chebyshev is also far from tight on this list, 98.9% against a promise of 88.9%; "at least" is a floor, not an estimate.

## Worked example: moisture content

Pencil problem: moisture content has $\mu = 18$, $\sigma = 0.5$, and the shape is **not assumed normal**, so Chebyshev applies.

Question: what fraction of readings are guaranteed to fall between **17 and 19**?

First find $k$: $17$ and $19$ are each $1$ unit from the mean, and $\sigma = 0.5$, so $k = \frac{1}{0.5} = 2$.

$1 - \frac{1}{k^2} = 1 - \frac{1}{4} = 0.75 = \mathbf{75\%}$

At least 75% of moisture readings fall between 17 and 19, whatever the true shape of the distribution.

## Chebyshev bounds for Classic monster EXP

The same 87 monsters give EXP per kill with $\bar{X} = 165.839$ and $s = 356.411$; the median is 69, so EXP is right-skewed too. No bell is assumed.

```quiz
[
  {"q": "Upper end of $\\bar{X} \\pm 2.5s$ for monster EXP? (1 decimal)", "type": "numeric", "answer": 1056.9, "tolerance": 0.05, "unit": "EXP", "explain": "$2.5s = 2.5(356.411) = 891.03$, so $\\bar{X} + 2.5s = 165.839 + 891.03 = 1056.9$ EXP. The lower end, $165.839 - 891.03 = -725.2$, is below zero, as with HP."},
  {"q": "At least what percentage of the 87 monsters give EXP within $\\bar{X} \\pm 2.5s$?", "type": "numeric", "answer": 84, "tolerance": 0.05, "unit": "%", "explain": "$1 - 1/k^2 = 1 - 1/2.5^2 = 1 - 1/6.25 = 1 - 0.16 = 0.84 = 84\\%$."},
  {"q": "Which two words go in front of that 84%?", "type": "text", "answer": ["at least", "At least", "at-least"], "explain": "Chebyshev is a guaranteed lower bound for any shape: at least 84%. The empirical rule would say \"approximately\", and only for normal data."},
  {"q": "At most what percentage of the monsters give EXP outside $\\bar{X} \\pm 2.5s$?", "type": "numeric", "answer": 16, "tolerance": 0.05, "unit": "%", "explain": "If at least 84% are inside, at most $100 - 84 = 16\\%$ are outside ($1/k^2 = 1/6.25 = 0.16$)."},
  {"q": "Only King Slime (2 400 EXP) and Jr. Balrog (2 188 EXP) lie outside $\\bar{X} \\pm 2.5s$. What percentage is inside? (1 decimal)", "type": "numeric", "answer": 97.7, "tolerance": 0.05, "unit": "%", "explain": "$85/87 = 0.9770 = 97.7\\%$, comfortably above the guaranteed 84%."}
]
```

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