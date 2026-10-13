---
title: Quartiles & percentiles
minutes: 16
---

Range and standard deviation tell you how spread out $X$ is. A **measure of position** tells you where a particular value sits relative to the rest of the data. Quartiles and percentiles are both measures of position.

## Quartiles

Sorted data can be cut into four equal-sized quarters by three cut points:

| | Meaning |
|---|---|
| $Q_1$ | separates the lowest 25% from the upper 75% |
| $Q_2$ | the median — separates the lowest 50% from the upper 50% |
| $Q_3$ | separates the lowest 75% from the upper 25% |

## Hand method for small data sets

To find $Q_1$ and $Q_3$ by hand: find the median first, then treat the **lower half** and **upper half** as their own mini data sets and take the median of each. If $n$ is **odd**, exclude the middle value itself from both halves before you split.

The median examples, extended to quartiles:

**Odd $n = 7$:** $19, 19, 20, (22), 23, 25, 50$ → median $Q_2 = 22$.
Exclude the 22, split what's left: lower half $19, 19, 20$ → $Q_1 = 19$ (its median). Upper half $23, 25, 50$ → $Q_3 = 25$.

**Even $n = 6$:** $19, 20, (23, 27), 29, 30$ → median $Q_2 = \frac{23+27}{2} = 25$.
No value to exclude — split evenly: lower half $19, 20, 23$ → $Q_1 = 20$. Upper half $27, 29, 30$ → $Q_3 = 29$.

The boxplot below puts the hand quartiles for the odd example beside R's: R's `quantile()` interpolates and gives $Q_1 = 19.5$, $Q_3 = 24$, so the two methods differ on small data sets.

```widget
boxplot
{ "data": "19 19 20 22 23 25 50", "note": "The odd n = 7 median example: hand method vs R" }
```

## A large example: faithful eruptions

The `faithful$eruptions` data set has $n = 272$ values. $25\%$ of $272 = 68$, so $Q_1$ separates the lowest 68 values from the upper 204. By hand, that lands between the 68th and 69th sorted values:

$Q_1 = \frac{68\text{th} + 69\text{th}}{2} = \frac{2.150 + 2.167}{2} = 2.1585$

$Q_2 = \frac{136\text{th} + 137\text{th}}{2} = 4.000$

$Q_3 = \frac{204\text{th} + 205\text{th}}{2} = 4.4585$

R's `quantile()` function does not compute quartiles exactly this way — it interpolates slightly differently and reports $Q_1 = 2.16275$ and $Q_3 = 4.45425$ for the same data. Both are correct.

:::quiz Slight disagreement is OK
**"There are about 10 different ways to define quartiles. Slight disagreement is OK."** A hand-calculated $Q_1$ that differs slightly from R's `quantile()` output is expected, not a mistake.
:::

## Percentiles

A **percentile** $P_k$ generalizes the idea: it separates the lowest $k\%$ of the data from the upper $(100-k)\%$. Quartiles are just three specific percentiles:

$Q_1 = P_{25} \qquad Q_2 = P_{50} \qquad Q_3 = P_{75}$

In R: `quantile(data$X, k/100)`; give the percentage as a decimal (`0.33` for the 33rd percentile, not `33`).

Example: `quantile(faithful$eruptions, 0.33)` gives $P_{33} = 2.417$. That means 33% of eruption durations are below 2.417 minutes, and 67% are above.

## The five-number summary

Calling `quantile()` with no second argument returns all five landmark values at once — minimum, $Q_1$, $Q_2$, $Q_3$, maximum:

```text
    0%      25%      50%      75%     100%
1.60000  2.16275  4.00000  4.45425  5.10000
```

That's `quantile(faithful$eruptions)`. This five-number summary is exactly what a boxplot draws.

## The boxplot of the first ten eruptions

```widget
boxplot
{ "data": "1.800 1.950 2.283 2.883 3.333 3.600 3.600 4.350 4.533 4.700", "note": "First 10 faithful eruption durations (minutes)" }
```

## Hand quartiles for two new data sets

Data set A ($n = 9$): 14, 22, 9, 17, 30, 11, 25, 19, 13. Data set B ($n = 10$): 3.1, 4.5, 2.8, 5.0, 3.9, 4.2, 6.1, 3.3, 4.8, 5.6.

```quiz
[
  {"q": "Data set A: find $Q_2$.", "type": "numeric", "answer": 17, "tolerance": 0, "explain": "Sorted: 9, 11, 13, 14, **17**, 19, 22, 25, 30. The 5th of 9 values is 17."},
  {"q": "Data set A: find $Q_1$ by the hand method.", "type": "numeric", "answer": 12, "tolerance": 0, "explain": "$n$ is odd, so leave out the median 17. Lower half 9, 11, 13, 14; its median is $(11 + 13)/2 = 12$."},
  {"q": "Data set A: find $Q_3$ by the hand method.", "type": "numeric", "answer": 23.5, "tolerance": 0, "explain": "Upper half (17 excluded) 19, 22, 25, 30; its median is $(22 + 25)/2 = 23.5$."},
  {"q": "Data set B: find $Q_1$ by the hand method.", "type": "numeric", "answer": 3.3, "tolerance": 0.001, "explain": "Sorted: 2.8, 3.1, 3.3, 3.9, 4.2 | 4.5, 4.8, 5.0, 5.6, 6.1 ($Q_2 = (4.2 + 4.5)/2 = 4.35$). $n$ is even, nothing is excluded; the lower half's middle value is 3.3."},
  {"q": "Which symbol names the value with 75% of the data below it? (either name)", "type": "text", "answer": ["Q3", "Q_3", "P75", "P_75", "Q₃", "P₇₅"], "explain": "The third quartile $Q_3$, which is also the 75th percentile $P_{75}$."},
  {"type": "fill", "q": "Data set A in R. Fill the blank so `quantile()` returns $P_{75}$.", "code": "A <- c(14, 22, 9, 17, 30, 11, 25, 19, 13)\nquantile(A, ___)\n## 75%\n##  22", "answer": ["0.75", ".75"], "explain": "Give the percentage as a decimal: 0.75. R interpolates differently from the hand method (22 against the hand $Q_3 = 23.5$; for $P_{25}$ it gives 13 against 12). Slight disagreement is OK."}
]
```

```quiz
[
  {
    "q": "For the sorted data 19, 19, 20, 22, 23, 25, 50, what is $Q_1$ (using the hand method)?",
    "type": "numeric",
    "answer": 19,
    "explain": "Median is 22 (4th value). Exclude it since $n=7$ is odd. Lower half is 19, 19, 20; its median is 19."
  },
  {
    "q": "Same data set, 19, 19, 20, 22, 23, 25, 50. What is $Q_3$?",
    "type": "numeric",
    "answer": 25,
    "explain": "Upper half (excluding the median 22) is 23, 25, 50; its median is 25."
  },
  {
    "q": "For 19, 20, 23, 27, 29, 30 ($n=6$, even), what is $Q_1$?",
    "type": "numeric",
    "answer": 20,
    "explain": "$n$ is even, so no value is excluded. Lower half is 19, 20, 23; its median is 20."
  },
  {
    "q": "The faithful eruptions data has $n = 272$. How many values fall at or below $Q_1$?",
    "type": "numeric",
    "answer": 68,
    "explain": "25% of 272 = 68."
  },
  {
    "q": "What is $Q_1$ of the faithful data by the hand method (average of the 68th and 69th sorted values)?",
    "type": "numeric",
    "answer": 2.1585,
    "tolerance": 0.001,
    "explain": "$(2.150 + 2.167)/2 = 2.1585$."
  },
  {
    "q": "R's `quantile()` reports $Q_1 = 2.16275$ for the same faithful data. Why doesn't this exactly match the hand-method answer of 2.1585?",
    "options": ["One of the two methods contains an arithmetic error", "R and the hand method use different (but both valid) definitions of quartile", "R uses the population formula and the hand method uses the sample formula", "The faithful data set changed between calculations"],
    "answer": 1,
    "explain": "There are roughly 10 accepted ways to define a quartile. Small disagreements between methods are expected, not errors."
  },
  {
    "q": "$Q_1$ corresponds to which percentile?",
    "options": ["$P_{10}$", "$P_{25}$", "$P_{50}$", "$P_{75}$"],
    "answer": 1,
    "explain": "$Q_1 = P_{25}$: it separates the lowest 25% from the rest."
  },
  {
    "q": "`quantile(faithful$eruptions, 0.33)` returns 2.417. This means 67% of the data lies below 2.417.",
    "type": "tf",
    "answer": false,
    "explain": "$P_{33}$ means 33% lies below and 67% lies above — the opposite."
  },
  {
    "q": "Which values make up the five-number summary returned by a plain `quantile(data$X)` call? (select all)",
    "options": ["Minimum", "Mean", "$Q_1$", "$Q_2$ (median)", "$Q_3$", "Maximum"],
    "answer": [0, 2, 3, 4, 5],
    "explain": "The five-number summary is min, $Q_1$, $Q_2$, $Q_3$, max. The mean is not part of it."
  }
]
```
