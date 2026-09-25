---
title: Lab 2 pencil problems, worked
minutes: 22
---

Lab 2 ends with four problems "meant to be done with paper and pencil (and scientific calculator)". The lab says they help you prepare for **the theory part of the quiz and the exams**, so treat them as the closest thing you have to the real questions. Do each one on paper before you open its solution: write your numbers in the "try it first" box, then compare. Every solution here follows the instructor's posted answers step by step, and says where a different but acceptable method gives a slightly different number.

## Problem 1: a frequency distribution for plywood thickness

You are given the raw data for $X$ = thickness (in inches) of a sample of $n = 18$ sheets of nominally three-quarter-inch plywood:

```text
0.754  0.735  0.754  0.748  0.740  0.752  0.747  0.740  0.751
0.741  0.740  0.742  0.748  0.732  0.750  0.747  0.750  0.752
```

Determine an appropriate number of classes and appropriate class limits for a frequency distribution. Then determine the frequencies and the relative frequencies.

:::quiz Try it first
Before reading on, write down: $\sqrt{n}$, the range $R$, the ideal class width, the class width you will actually use, the first lower class limit, and then every class with its frequency. Only then scroll.
:::

### Step 1: how many classes, how wide

The recipe from the histogram lesson:

1. Initial number of classes: $\sqrt{n} = \sqrt{18} = 4.24$, so about four or five classes.
2. Range: $R = \max - \min = 0.754 - 0.732 = 0.022$ inches.
3. Ideal class width: $R / \sqrt{n} = 0.022 / 4.24 = 0.0052$.
4. Round to the precision of the data. The data has **three decimals**, so the width must be a three-decimal number, and a "nice" one: $0.0052 \to \mathbf{0.005}$.
5. First lower class limit: the minimum, $0.730$ (rounded down from 0.732 to a clean multiple of 0.005).

### Step 2: the class limits

Lower limits go up by 0.005: 0.730, 0.735, 0.740, 0.745, 0.750. Each upper limit is the next lower limit minus one unit of precision (0.001): 0.734, 0.739, 0.744, 0.749, 0.754. The last class ends at 0.754, which is exactly the maximum, so five classes cover everything.

### Step 3: count

Sort the data first, then tally:

```text
0.732 | 0.735 | 0.740 0.740 0.740 0.741 0.742 | 0.747 0.747 0.748 0.748 | 0.750 0.750 0.751 0.752 0.752 0.754 0.754
```

| lower limit | upper limit | frequency | relative frequency |
|---|---|---|---|
| 0.730 | 0.734 | 1 | $1/18 = 0.056$ |
| 0.735 | 0.739 | 1 | 0.056 |
| 0.740 | 0.744 | 5 | 0.278 |
| 0.745 | 0.749 | 4 | 0.222 |
| 0.750 | 0.754 | 7 | 0.389 |

Frequencies sum to 18 and relative frequencies to 1.00 (0.056 + 0.056 + 0.278 + 0.222 + 0.389 = 1.001, rounding). The distribution is skewed left: most sheets are at the thick end, with a thin tail down to 0.732.

```widget
hist-builder
{ "preset": "Plywood thickness (n = 18, pencil problem)" }
```

### The same thing in R

The solution builds the table with `cut()`, which assigns each value to a class, and `table()`, which counts:

```r
X.vals <- c(0.754, 0.735, 0.754, 0.748, 0.740, 0.752, 0.747, 0.740, 0.751,
            0.741, 0.740, 0.742, 0.748, 0.732, 0.750, 0.747, 0.750, 0.752)
n <- length(X.vals)
ideal.width <- (max(X.vals)-min(X.vals))/sqrt(n)
round(ideal.width, 3)
min(X.vals)
max(X.vals)
```
```text
[1] 0.005
[1] 0.732
[1] 0.754
```

```r
lower.limits <- seq(0.730, 0.750, by=0.005)
upper.limits <- lower.limits + 0.005 - 0.001
freqs <- cbind(table(cut( X.vals, breaks=seq(0.730, 0.755, by=0.005), right=FALSE)))
rel.freqs <- round(freqs / n, 3);
freq.dist <- cbind( lower.limits, upper.limits, freqs, rel.freqs)
freq.dist
```
```text
              lower.limits upper.limits
[0.73,0.735)         0.730        0.734 1 0.056
[0.735,0.74)         0.735        0.739 1 0.056
[0.74,0.745)         0.740        0.744 5 0.278
[0.745,0.75)         0.745        0.749 4 0.222
[0.75,0.755)         0.750        0.754 7 0.389
```

`breaks=seq(0.730, 0.755, by=0.005)` lists the class boundaries; `right=FALSE` makes each class $[\text{lower}, \text{next lower})$, which is why R labels them `[0.73,0.735)`. The upper limit 0.734 in the table is the last possible data value inside that class.

:::quiz Width must match the precision
A likely trap: "the ideal width is 0.0052, so use 0.0052." No. The data has three decimals, so the class width and limits must too. Round 0.0052 to 0.005 and start from 0.730.
:::

## Problem 2: IQ percentiles from the empirical rule

IQ scores for a large population have mean $\mu = 100$ and standard deviation $\sigma = 15$. Based on the 68–95–99.7 rule, determine the IQ score equivalent to (a) $P_{2.5}$, (b) $P_{16}$, (c) $P_{50}$, (d) $P_{66}$, (e) $P_{97.5}$.

:::quiz Try it first
Sketch the bell, mark $\mu \pm \sigma$, $\mu \pm 2\sigma$, $\mu \pm 3\sigma$, and write the percentage in each band. Then write the five IQ scores.
:::

### The bands

The empirical rule splits the bell into slices. Because the curve is symmetric, each side is half of a band:

| band | percent |
|---|---|
| below $\mu - 2\sigma$ | 2.5% |
| $\mu - 2\sigma$ to $\mu - \sigma$ | 13.5% |
| $\mu - \sigma$ to $\mu$ | 34% |
| $\mu$ to $\mu + \sigma$ | 34% |
| $\mu + \sigma$ to $\mu + 2\sigma$ | 13.5% |
| above $\mu + 2\sigma$ | 2.5% |

Adding from the left gives the **cumulative** percentages, which are exactly the percentiles at each boundary:

| boundary | IQ | percent below | percentile |
|---|---|---|---|
| $\mu - 2\sigma$ | 70 | 2.5% | $P_{2.5}$ |
| $\mu - \sigma$ | 85 | 2.5 + 13.5 = 16% | $P_{16}$ |
| $\mu$ | 100 | 50% | $P_{50}$ |
| $\mu + \sigma$ | 115 | 50 + 34 = 84% | $P_{84}$ |
| $\mu + 2\sigma$ | 130 | 84 + 13.5 = 97.5% | $P_{97.5}$ |

So (a) $P_{2.5} = 100 - 2(15) = \mathbf{70}$, (b) $P_{16} = 100 - 15 = \mathbf{85}$, (c) $P_{50} = \mu = \mathbf{100}$, (e) $P_{97.5} = 100 + 2(15) = \mathbf{130}$.

:::warn Part (d): the answer key says P66 = μ + σ = 115
The posted solution writes "$P_{66} = \mu + \sigma = 115$". By the 68–95–99.7 rule, the score one standard deviation above the mean has $50\% + 34\% = 84\%$ of the population below it, so $\mu + \sigma = 115$ is $P_{84}$, not $P_{66}$. The label looks like a typo for $P_{84}$. If a quiz asks for $P_{84}$, answer 115 and explain it as $\mu + \sigma$. A true $P_{66}$ cannot be read off the empirical rule at all (it needs a $Z$ table: $Z \approx 0.41$, IQ $\approx 106$), which is another reason to suspect the typo.
:::

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 85, "title": "IQ: slide X to each boundary and read the % below" }
```

Set $X$ to 70, 85, 100, 115 and 130 in turn and confirm the "% below" cells: 2.5, 16, 50, 84, 97.5.

## Problem 3: gold prices, range, IQR and fences

The price of gold (CA$ per oz) for the last ten days of August 2026:

```text
6195.20  6377.58  6374.78  6448.51  6439.12  6343.34  6231.64  6244.87  6023.88  6127.91
```

(a) Determine the range $R$ and the interquartile range $IQR$. (b) Find the lower and upper fences for checking whether a value is an outlier. (c) Are there any outliers?

:::quiz Try it first
Sort the ten prices, then write $R$, $Q_1$, $Q_3$, $IQR$, both fences, and your outlier verdict.
:::

### Sort

```text
6023.88  6127.91  6195.20  6231.64  6244.87 | 6343.34  6374.78  6377.58  6439.12  6448.51
```

### (a) Range

$R = \max - \min = 6448.51 - 6023.88 = \mathbf{424.63}$.

### (a) IQR, the way the answer key computes it (R's `quantile()`)

R's default quantile interpolates between sorted values. With $n = 10$, $Q_1$ sits at position $1 + 0.25 \times 9 = 3.25$: a quarter of the way from the 3rd value to the 4th:

$Q_1 = 6195.20 + 0.25(6231.64 - 6195.20) = 6195.20 + 0.25(36.44) = \mathbf{6204.31}$

$Q_3$ sits at position $1 + 0.75 \times 9 = 7.75$: three quarters of the way from the 7th value to the 8th:

$Q_3 = 6374.78 + 0.75(6377.58 - 6374.78) = 6374.78 + 0.75(2.80) = \mathbf{6376.88}$

$IQR = 6376.88 - 6204.31 = \mathbf{172.57}$, which is exactly what `IQR(X.gold)` prints.

### (b) Fences

$1.5 \times IQR = 1.5 \times 172.57 = 258.855$

Lower fence $= Q_1 - 258.855 = 6204.31 - 258.855 = \mathbf{5945.455}$

Upper fence $= Q_3 + 258.855 = 6376.88 + 258.855 = \mathbf{6635.735}$

### (c) Outliers

The minimum 6023.88 is above the lower fence and the maximum 6448.51 is below the upper fence. **There are no outliers** in the sample.

### The hand method gives slightly different quartiles

Unit 1's pencil method takes $Q_1$ as the median of the lower half and $Q_3$ as the median of the upper half. With ten values, each half has five, so:

$Q_1 = 6195.20$ (3rd value), $Q_3 = 6377.58$ (8th value), $IQR = 6377.58 - 6195.20 = 182.38$

$1.5 \times IQR = 273.57$; fences $6195.20 - 273.57 = 5921.63$ and $6377.58 + 273.57 = 6651.15$. Still no outliers.

The instructor said in Unit 1 that "there are about 10 different ways to define quartiles" and that slight disagreement is fine. On a quiz, show your method; either $IQR = 172.57$ (R) or $182.38$ (hand) is acceptable, and the outlier conclusion is the same.

```widget
boxplot
{ "data": "6195.20 6377.58 6374.78 6448.51 6439.12 6343.34 6231.64 6244.87 6023.88 6127.91", "note": "Gold prices: R's quantile() versus the hand method. Both fences lie outside the data, so no outlier circles are drawn." }
```

### The R version

```r
X.gold <- c(6195.20, 6377.58, 6374.78, 6448.51, 6439.12,
            6343.34, 6231.64, 6244.87, 6023.88, 6127.91)
R <- max(X.gold) - min(X.gold)
R
Q1 <- quantile(X.gold, 0.25)
Q3 <- quantile(X.gold, 0.75)
IQR(X.gold)
lower.fence <- Q1 - 1.5*IQR(X.gold)
upper.fence <- Q3 + 1.5*IQR(X.gold)
c(lower.fence, upper.fence)
is.outlier <- (X.gold < lower.fence) | (X.gold > upper.fence)
sum(is.outlier)
```
```text
[1] 424.63
[1] 172.57
     25%      75%
5945.455 6635.735
[1] 0
```

The `25%` and `75%` labels on the fences are just names carried along from `quantile()`; the numbers are the fences.

## Problem 4: reading an ogive

The test scores of 2287 Grade 8 students in the Netherlands are represented by an ogive: cumulative percentage of students (vertical) against test score (horizontal), with points at every 5 marks.

```widget
ogive
{ "preset": "Test scores, 2287 students (Lab 2 pencil #4)" }
```

(a) What proportion of students had scores below 50? (b) What proportion had scores between 30 and 40? (c) What range of scores represents the top 25% of the class?

:::quiz Try it first
Read the curve: the height at 50, the heights at 30 and 40, and the score where the curve crosses 75%. Write three answers.
:::

### How to read an ogive

Every point on the curve is "(score, percent of students **below** that score)". So:

- To find "what proportion is below $x$": go up from $x$ to the curve, then left to the axis.
- To find "what proportion is between $a$ and $b$": read both heights and **subtract**.
- To find a percentile $P_k$: go right from $k\%$ to the curve, then down to the axis.

### (a) Below 50

Above score 50 the curve is at about **80%**. Roughly 0.80 of the 2287 students, about 1830, scored below 50.

### (b) Between 30 and 40

Height at 40 is about 39%, height at 30 is about 13%. Difference: $39\% - 13\% \approx \mathbf{25\%}$. (The answer key reads the picture as $40\% - 15\% = 25\%$; the exact heights depend on your eye, the difference is what matters.)

### (c) The top 25%

The top 25% is everyone **above** $P_{75}$. Go right from 75% to the curve: it crosses between 45 (60%) and 50 (80%), about three quarters of the way up, at a score of roughly **48**. The top quarter of the class scored from about **48 up to 60**, the maximum on the axis.

:::quiz Between means subtract
"Between 30 and 40" is the height at 40 minus the height at 30. Reading only the height at 40 (39%) is the classic mistake, and so is answering a percentile question with a percentage instead of a score. Check that your answer has the right units: percent for (a) and (b), scores for (c).
:::

```quiz
[
  {
    "q": "Plywood data, $n = 18$, min 0.732, max 0.754. What is the ideal class width $R/\\sqrt{n}$? (4 decimals)",
    "type": "numeric",
    "answer": 0.0052,
    "tolerance": 0.0002,
    "explain": "$R = 0.754 - 0.732 = 0.022$; $\\sqrt{18} = 4.243$; $0.022/4.243 = 0.0052$."
  },
  {
    "q": "The ideal width is 0.0052 and the data has three decimals. Which class width should you actually use?",
    "options": ["0.0052", "0.005", "0.01", "0.0050 rounded to 0.006"],
    "answer": 1,
    "explain": "Round to the precision of the data (three decimals) and to a nice number: 0.005."
  },
  {
    "q": "With classes 0.730–0.734, 0.735–0.739, 0.740–0.744, 0.745–0.749, 0.750–0.754, how many plywood sheets fall in the class 0.750–0.754?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "0.750, 0.750, 0.751, 0.752, 0.752, 0.754, 0.754: seven values, relative frequency $7/18 = 0.389$."
  },
  {
    "q": "In `cut(X.vals, breaks=seq(0.730, 0.755, by=0.005), right=FALSE)`, a value of exactly 0.745 lands in which class?",
    "options": ["[0.74, 0.745)", "[0.745, 0.75)", "It is dropped because it is on a boundary", "Both classes"],
    "answer": 1,
    "explain": "`right=FALSE` makes classes closed on the left and open on the right, so 0.745 is the first value of [0.745, 0.75), the class the table labels 0.745–0.749."
  },
  {
    "q": "IQ scores: $\\mu = 100$, $\\sigma = 15$. Using the empirical rule, what IQ is $P_{16}$?",
    "type": "numeric",
    "answer": 85,
    "tolerance": 0.5,
    "explain": "2.5% lie below $\\mu - 2\\sigma$ and 13.5% between $\\mu - 2\\sigma$ and $\\mu - \\sigma$, so 16% lie below $\\mu - \\sigma = 100 - 15 = 85$."
  },
  {
    "q": "Same population. What percentile is the IQ score 115?",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0.5,
    "unit": "th percentile",
    "explain": "$115 = \\mu + \\sigma$. Below it: 50% (below the mean) + 34% (mean to $+1\\sigma$) = 84%. The answer key's label P66 for this value is a typo."
  },
  {
    "q": "Same population. $P_{97.5}$ = ?",
    "type": "numeric",
    "answer": 130,
    "tolerance": 0.5,
    "explain": "97.5% lie below $\\mu + 2\\sigma = 100 + 30 = 130$ (only the top 2.5% tail is above it)."
  },
  {
    "q": "Gold prices: max 6448.51, min 6023.88. Range $R$?",
    "type": "numeric",
    "answer": 424.63,
    "tolerance": 0.01,
    "explain": "$R = 6448.51 - 6023.88 = 424.63$."
  },
  {
    "q": "Gold prices with R's quantiles: $Q_1 = 6204.31$, $Q_3 = 6376.88$. What is the upper fence? (2 decimals)",
    "type": "numeric",
    "answer": 6635.735,
    "tolerance": 0.05,
    "explain": "$IQR = 172.57$, $1.5 \\times IQR = 258.855$, upper fence $= 6376.88 + 258.855 = 6635.735$. The maximum 6448.51 is below it, so no outlier."
  },
  {
    "q": "Using the hand method (medians of the lower and upper halves), the gold-price $IQR$ is 182.38 rather than 172.57, and this changes the outlier conclusion.",
    "type": "tf",
    "answer": false,
    "explain": "Hand method: $Q_1 = 6195.20$, $Q_3 = 6377.58$, $IQR = 182.38$, fences 5921.63 and 6651.15. All ten prices are still inside the fences: no outliers either way."
  },
  {
    "q": "On the ogive of 2287 test scores, the curve is at 13% above a score of 30 and at 39% above a score of 40. What proportion of students scored between 30 and 40?",
    "type": "numeric",
    "answer": 26,
    "tolerance": 3,
    "unit": "%",
    "explain": "Between two scores is the difference of the two cumulative heights: $39\\% - 13\\% \\approx 25\\%$ to $26\\%$ (the key reads it as $40 - 15 = 25$)."
  },
  {
    "q": "On the same ogive, the curve crosses 75% at a score of about 48. Which scores make up the top 25% of the class?",
    "options": ["0 to 48", "48 to 60", "45 to 50", "exactly 48"],
    "answer": 1,
    "explain": "The top 25% are the students above $P_{75}$: from about 48 up to the maximum score on the axis, 60. A percentile question is answered with a score range, not a percentage."
  }
]
```
