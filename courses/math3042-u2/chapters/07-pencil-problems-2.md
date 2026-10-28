---
title: Lab 2 pencil problems, worked
minutes: 20
---

Lab 2 ends with four problems "meant to be done with paper and pencil (and scientific calculator)" that the lab says prepare you for **the theory part of the quiz and the exams**. Each solution follows the instructor's posted answers step by step and notes where an acceptable alternative method gives a slightly different number.

## Problem 1: a frequency distribution for plywood thickness

$X$ = thickness (in inches) of a sample of $n = 18$ sheets of nominally three-quarter-inch plywood:

```text
0.754  0.735  0.754  0.748  0.740  0.752  0.747  0.740  0.751
0.741  0.740  0.742  0.748  0.732  0.750  0.747  0.750  0.752
```

Determine an appropriate number of classes and appropriate class limits for a frequency distribution. Then determine the frequencies and the relative frequencies.

### Step 1: how many classes, how wide

1. Initial number of classes: $\sqrt{n} = \sqrt{18} = 4.24$, so four or five classes.
2. Range: $R = \max - \min = 0.754 - 0.732 = 0.022$ inches.
3. Ideal class width: $R / \sqrt{n} = 0.022 / 4.24 = 0.0052$.
4. Round to the precision of the data. Three decimals, and a "nice" number: $0.0052 \to \mathbf{0.005}$.
5. First lower class limit: the minimum rounded down to a clean multiple of 0.005, $0.730$.

### Step 2: the class limits

Lower limits rise by 0.005: 0.730, 0.735, 0.740, 0.745, 0.750. Each upper limit is the next lower limit minus one unit of precision (0.001): 0.734, 0.739, 0.744, 0.749, 0.754. The last class ends exactly at the maximum, so five classes cover everything.

### Step 3: count

Sort, then tally:

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

Frequencies sum to 18 and relative frequencies to 1.00 ($0.056 + 0.056 + 0.278 + 0.222 + 0.389 = 1.001$, rounding). The distribution is skewed left: most sheets are at the thick end, with a thin tail down to 0.732.

```widget
hist-builder
{ "preset": "Plywood thickness (n = 18, pencil problem)" }
```

### The same thing in R

`cut()` assigns each value to a class and `table()` counts:

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

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- c(0.754, …, 0.752)` | `c()` combines the 18 values into one vector; `<-` stores it as `X.vals`. The call continues onto the second line. |
| `n <- length(X.vals)` | `length()` counts the elements of the vector. |
| `(max(X.vals)-min(X.vals))/sqrt(n)` | `max()` and `min()` are the largest and smallest values, `-` subtracts, `/` divides, `sqrt()` is the square root. Parentheses force the subtraction first. |
| `ideal.width <- …` | Stores the ideal width; assignment prints nothing. |
| `round(ideal.width, 3)` | Fills x = `ideal.width`, digits = 3, and prints the rounded width. |
| `min(X.vals)`, `max(X.vals)` | Each prints one value, the smallest and then the largest. |
| `[1]` | In printed output, `[1]` is the position of the first value on that line, not part of the value. |

**Left to right**

- `X.vals <- c(0.754, …, 0.752)`: "Store under the name X.vals (`X.vals <-`) the 18 thicknesses combined into one vector (`c`)."
- `n <- length(X.vals)`: "Store as n (`n <-`) the number of elements (`length`) of the thicknesses (`X.vals`)."
- `ideal.width <- …`: "Store as ideal.width (`ideal.width <-`) the largest value (`max`) minus (`-`) the smallest (`min`), divided by (`/`) the square root (`sqrt`) of n (`n`)."
- `round(ideal.width, 3)`: "Print, rounded (`round`) to 3 decimals (`3`), the ideal width (`ideal.width`)."
- `min(X.vals)`, `max(X.vals)`: "Print the smallest (`min`), then the largest (`max`), of the thicknesses (`X.vals`)."

**Right to left**, the order R runs it

- `X.vals <- c(0.754, …, 0.752)`: "Combine the 18 numbers into a vector (`c`) and store it (`X.vals <-`)."
- `n <- length(X.vals)`: "Look up the vector (`X.vals`), count its elements (`length`), and store the count (`n <-`)."
- `ideal.width <- …`: "Find the largest and smallest values (`max`, `min`), subtract inside the parentheses (`-`), take the square root of n (`sqrt(n)`), divide (`/`), and store the result (`ideal.width <-`)."
- `round(ideal.width, 3)`: "Look up the ideal width (`ideal.width`), round it to 3 decimals (`round`), and print it."
- `min(X.vals)`, `max(X.vals)`: "Look up the vector (`X.vals`), find its smallest (`min`) and print it, then its largest (`max`) and print it."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `lower.limits <- seq(0.730, 0.750, by=0.005)` | `seq()` fills from = 0.730, to = 0.750, by = 0.005: the five lower limits. |
| `upper.limits <- lower.limits + 0.005 - 0.001` | Arithmetic on a vector applies to every element: each lower limit plus the width minus one unit. |
| `cut( X.vals, breaks=seq(0.730, 0.755, by=0.005), right=FALSE)` | Replaces each value with its class label; `breaks=` lists the six boundaries, and `right=FALSE` closes each class on the left. |
| `table( … )` | Counts how many values fall in each class. |
| `freqs <- cbind( … )` | `cbind()` turns the counts into a one-column matrix whose row names are the class labels. |
| `rel.freqs <- round(freqs / n, 3);` | Divides every count by n and rounds to 3 decimals. The `;` ends a statement and is optional at a line end. |
| `freq.dist <- cbind( lower.limits, upper.limits, freqs, rel.freqs)` | Binds the four as side-by-side columns. The two vectors take their variable names as column headings; the two matrices have no column names, so those headings are blank. |
| `freq.dist` | A name on its own line prints it: one row per class, labelled by its `[lower,upper)` interval. |

**Left to right**

- `lower.limits <- seq(…)`: "Store as lower.limits (`lower.limits <-`) the sequence (`seq`) from 0.730 to 0.750 in steps of 0.005 (`by=0.005`)."
- `upper.limits <- …`: "Store as upper.limits (`upper.limits <-`) each lower limit (`lower.limits`) plus (`+`) the width 0.005 minus (`-`) one unit 0.001."
- `freqs <- cbind(table(cut(…)))`: "Store as freqs (`freqs <-`) a one-column matrix (`cbind`) of the count per class (`table`) of the thicknesses (`X.vals`) sorted into classes (`cut`) with boundaries from 0.730 to 0.755 by 0.005 (`breaks=seq(…)`), closed on the left (`right=FALSE`)."
- `rel.freqs <- round(freqs / n, 3);`: "Store as rel.freqs (`rel.freqs <-`) the counts (`freqs`) divided by (`/`) n (`n`), rounded (`round`) to 3 decimals, ending the statement (`;`)."
- `freq.dist <- cbind(…)`: "Store as freq.dist (`freq.dist <-`) the columns bound side by side (`cbind`): lower limits, upper limits, counts and relative frequencies (`lower.limits, upper.limits, freqs, rel.freqs`)."
- `freq.dist`: "Print the frequency distribution (`freq.dist`)."

**Right to left**, the order R runs it

- `lower.limits <- seq(…)`: "Build the sequence 0.730 to 0.750 by 0.005 (`seq`) and store it (`lower.limits <-`)."
- `upper.limits <- …`: "Take the lower limits (`lower.limits`), add 0.005 and subtract 0.001 from each (`+`, `-`), and store the result (`upper.limits <-`)."
- `freqs <- cbind(table(cut(…)))`: "Build the boundaries (`seq`), label each thickness with its left-closed class (`cut`, `right=FALSE`), count each class (`table`), bind the counts as a column (`cbind`), and store it (`freqs <-`)."
- `rel.freqs <- round(freqs / n, 3);`: "Divide each count by n (`freqs / n`), round to 3 decimals (`round`), and store the result (`rel.freqs <-`)."
- `freq.dist <- cbind(…)`: "Look up the four pieces (`lower.limits`, `upper.limits`, `freqs`, `rel.freqs`), bind them as columns (`cbind`), and store the table (`freq.dist <-`)."
- `freq.dist`: "Look up freq.dist (`freq.dist`) and print it."
:::

`breaks=seq(0.730, 0.755, by=0.005)` lists the boundaries and `right=FALSE` makes each class $[\text{lower}, \text{next lower})$, which is why R labels them `[0.73,0.735)`. The table's upper limit 0.734 is the last possible data value inside that class.

## Problem 2: IQ percentiles from the empirical rule

IQ scores for a large population have mean $\mu = 100$ and standard deviation $\sigma = 15$. Based on the 68–95–99.7 rule, determine the IQ score equivalent to (a) $P_{2.5}$, (b) $P_{16}$, (c) $P_{50}$, (d) $P_{66}$, (e) $P_{97.5}$.

### The bands

The empirical rule splits the symmetric bell into slices:

| band | percent |
|---|---|
| below $\mu - 2\sigma$ | 2.5% |
| $\mu - 2\sigma$ to $\mu - \sigma$ | 13.5% |
| $\mu - \sigma$ to $\mu$ | 34% |
| $\mu$ to $\mu + \sigma$ | 34% |
| $\mu + \sigma$ to $\mu + 2\sigma$ | 13.5% |
| above $\mu + 2\sigma$ | 2.5% |

Adding from the left gives the cumulative percentages, which are the percentiles at each boundary:

| boundary | IQ | percent below | percentile |
|---|---|---|---|
| $\mu - 2\sigma$ | 70 | 2.5% | $P_{2.5}$ |
| $\mu - \sigma$ | 85 | 2.5 + 13.5 = 16% | $P_{16}$ |
| $\mu$ | 100 | 50% | $P_{50}$ |
| $\mu + \sigma$ | 115 | 50 + 34 = 84% | $P_{84}$ |
| $\mu + 2\sigma$ | 130 | 84 + 13.5 = 97.5% | $P_{97.5}$ |

So (a) $P_{2.5} = 100 - 2(15) = \mathbf{70}$, (b) $P_{16} = 100 - 15 = \mathbf{85}$, (c) $P_{50} = \mu = \mathbf{100}$, (e) $P_{97.5} = 100 + 2(15) = \mathbf{130}$.

:::warn Part (d): the answer key says P66 = μ + σ = 115
The posted solution writes "$P_{66} = \mu + \sigma = 115$". By the 68–95–99.7 rule, $\mu + \sigma$ has $50\% + 34\% = 84\%$ of the population below it, so 115 is $P_{84}$; the label looks like a typo for $P_{84}$. A true $P_{66}$ cannot be read from the empirical rule at all ($Z$ table: $Z \approx 0.41$, IQ $\approx 106$). Asked for $P_{84}$, answer 115 as $\mu + \sigma$.
:::

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 85, "title": "IQ: slide X to each boundary and read the % below" }
```

## Problem 3: gold prices, range, IQR and fences

The price of gold (CA$ per oz) for the last ten days of August 2026:

```text
6195.20  6377.58  6374.78  6448.51  6439.12  6343.34  6231.64  6244.87  6023.88  6127.91
```

(a) Determine the range $R$ and the interquartile range $IQR$. (b) Find the lower and upper fences for checking whether a value is an outlier. (c) Are there any outliers?

### Sort

```text
6023.88  6127.91  6195.20  6231.64  6244.87 | 6343.34  6374.78  6377.58  6439.12  6448.51
```

### (a) Range

$R = \max - \min = 6448.51 - 6023.88 = \mathbf{424.63}$.

### (a) IQR, the way the answer key computes it (R's `quantile()`)

R's default quantile interpolates between sorted values. With $n = 10$, $Q_1$ is at position $1 + 0.25 \times 9 = 3.25$, a quarter of the way from the 3rd value to the 4th:

$Q_1 = 6195.20 + 0.25(6231.64 - 6195.20) = 6195.20 + 0.25(36.44) = \mathbf{6204.31}$

$Q_3$ is at position $1 + 0.75 \times 9 = 7.75$, three quarters of the way from the 7th value to the 8th:

$Q_3 = 6374.78 + 0.75(6377.58 - 6374.78) = 6374.78 + 0.75(2.80) = \mathbf{6376.88}$

$IQR = 6376.88 - 6204.31 = \mathbf{172.57}$, which is what `IQR(X.gold)` prints.

### (b) Fences

$1.5 \times IQR = 1.5 \times 172.57 = 258.855$

Lower fence $= Q_1 - 258.855 = 6204.31 - 258.855 = \mathbf{5945.455}$

Upper fence $= Q_3 + 258.855 = 6376.88 + 258.855 = \mathbf{6635.735}$

### (c) Outliers

The minimum 6023.88 is above the lower fence and the maximum 6448.51 below the upper fence: **there are no outliers**.

### The hand method gives slightly different quartiles

Unit 1's pencil method takes $Q_1$ as the median of the lower half and $Q_3$ of the upper half; with five values per half:

$Q_1 = 6195.20$ (3rd value), $Q_3 = 6377.58$ (8th value), $IQR = 6377.58 - 6195.20 = 182.38$

$1.5 \times IQR = 273.57$; fences $6195.20 - 273.57 = 5921.63$ and $6377.58 + 273.57 = 6651.15$. Still no outliers.

The instructor said in Unit 1 that "there are about 10 different ways to define quartiles". Show your method; $IQR = 172.57$ (R) or $182.38$ (hand) is acceptable, and the outlier conclusion is the same.

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

:::info R syntax
| Code | What it does |
|---|---|
| `X.gold <- c(6195.20, …, 6127.91)` | `c()` combines the ten prices into one vector, stored as `X.gold`. |
| `R <- max(X.gold) - min(X.gold)` | The range; R is case-sensitive, so the name `R` is just a variable. |
| `R` | A name on its own line prints its value. |
| `Q1 <- quantile(X.gold, 0.25)`, `Q3 <- quantile(X.gold, 0.75)` | `quantile()` fills x = `X.gold`, probs = 0.25 or 0.75, with R's default interpolation. The result keeps a name like `25%`. |
| `IQR(X.gold)` | Prints Q3 minus Q1, computed the same way. |
| `lower.fence <- Q1 - 1.5*IQR(X.gold)` | `*` multiplies: Q1 minus 1.5 IQR. The name `25%` carries over from `Q1`. |
| `upper.fence <- Q3 + 1.5*IQR(X.gold)` | Q3 plus 1.5 IQR, keeping the name `75%`. |
| `c(lower.fence, upper.fence)` | Combines the two fences and prints them under their carried names. |
| `(X.gold < lower.fence) \| (X.gold > upper.fence)` | `<` and `>` compare every price, giving TRUE or FALSE each; `\|` is "or", TRUE where either side is TRUE. |
| `is.outlier <- …` | Stores the ten TRUE/FALSE values. |
| `sum(is.outlier)` | `sum()` counts each TRUE as 1 and FALSE as 0, so it prints the number of outliers. |

**Left to right**

- `X.gold <- c(…)`: "Store under the name X.gold (`X.gold <-`) the ten prices combined into one vector (`c`)."
- `R <- max(X.gold) - min(X.gold)`: "Store as R (`R <-`) the largest price (`max(X.gold)`) minus (`-`) the smallest (`min(X.gold)`)."
- `R`: "Print the range (`R`)."
- `Q1 <- …`, `Q3 <- …`: "Store as Q1 (`Q1 <-`) the 25th percentile (`quantile`, `0.25`) of the prices (`X.gold`), and as Q3 (`Q3 <-`) the 75th (`0.75`)."
- `IQR(X.gold)`: "Print the interquartile range (`IQR`) of the prices (`X.gold`)."
- `lower.fence <- …`: "Store as lower.fence (`lower.fence <-`) Q1 (`Q1`) minus (`-`) 1.5 times (`*`) the IQR (`IQR(X.gold)`)."
- `upper.fence <- …`: "Store as upper.fence (`upper.fence <-`) Q3 (`Q3`) plus (`+`) 1.5 times (`*`) the IQR (`IQR(X.gold)`)."
- `c(lower.fence, upper.fence)`: "Print the two fences combined (`c`)."
- `is.outlier <- …`: "Store as is.outlier (`is.outlier <-`), for each price, whether it is below the lower fence (`X.gold < lower.fence`) or (`|`) above the upper fence (`X.gold > upper.fence`)."
- `sum(is.outlier)`: "Print the number of TRUE values (`sum`) in is.outlier (`is.outlier`)."

**Right to left**, the order R runs it

- `X.gold <- c(…)`: "Combine the ten numbers (`c`) and store them (`X.gold <-`)."
- `R <- max(X.gold) - min(X.gold)`: "Find the largest and smallest prices (`max`, `min`), subtract (`-`), and store the range (`R <-`)."
- `R`: "Look up R (`R`) and print it."
- `Q1 <- …`, `Q3 <- …`: "Compute the 0.25 and 0.75 quantiles of the prices (`quantile`) and store them (`Q1 <-`, `Q3 <-`)."
- `IQR(X.gold)`: "Look up the prices (`X.gold`), compute Q3 minus Q1 (`IQR`), and print it."
- `lower.fence <- …`: "Compute the IQR (`IQR(X.gold)`), multiply by 1.5 (`*`), subtract from Q1 (`-`), and store it (`lower.fence <-`)."
- `upper.fence <- …`: "Compute the IQR (`IQR(X.gold)`), multiply by 1.5 (`*`), add to Q3 (`+`), and store it (`upper.fence <-`)."
- `c(lower.fence, upper.fence)`: "Look up both fences, combine them (`c`), and print them."
- `is.outlier <- …`: "Compare every price with each fence (`<`, `>`), join the two results with or (`|`), and store the TRUE/FALSE values (`is.outlier <-`)."
- `sum(is.outlier)`: "Look up the TRUE/FALSE values (`is.outlier`), add them up as 1s and 0s (`sum`), and print the count."
:::

The `25%` and `75%` labels on the fences are names carried along from `quantile()`; the numbers are the fences.

## Problem 4: reading an ogive

The test scores of 2287 Grade 8 students in the Netherlands are represented by an ogive: cumulative percentage of students (vertical) against test score (horizontal), with points every 5 marks.

```widget
ogive
{ "preset": "Test scores, 2287 students (Lab 2 pencil #4)" }
```

(a) What proportion of students had scores below 50? (b) What proportion had scores between 30 and 40? (c) What range of scores represents the top 25% of the class?

### How to read an ogive

Every point is "(score, percent of students **below** that score)":

- To find "what proportion is below $x$": go up from $x$ to the curve, then left to the axis.
- To find "what proportion is between $a$ and $b$": read both heights and **subtract**.
- To find a percentile $P_k$: go right from $k\%$ to the curve, then down to the axis.

### (a) Below 50

The curve is at about **80%** above score 50: roughly 0.80 of the 2287 students, about 1830, scored below 50.

### (b) Between 30 and 40

Height at 40 about 39%, at 30 about 13%: $39\% - 13\% = \mathbf{26\%}$. The answer key reads the heights as 40% and 15%, giving $40\% - 15\% = 25\%$; the readings depend on your eye, the subtraction is what matters.

### (c) The top 25%

The top 25% is everyone **above** $P_{75}$. Across from 75%, the curve crosses between 45 (60%) and 50 (80%), three quarters of the way: $P_{75} \approx 45 + 0.75 \times 5 = 48.75$. The top quarter scored from about **48.75 up to 60**, the maximum on the axis.

:::quiz Units
Percent for (a) and (b), scores for (c). Answering a percentile question with a percentage is the classic mistake.
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
    "explain": "Between two scores is the difference of the two cumulative heights: $39\\% - 13\\% = 26\\%$ (the key reads the heights as 40% and 15%: $40 - 15 = 25$)."
  },
  {
    "q": "On the same ogive, the curve crosses 75% at a score of about 48.75. Which scores make up the top 25% of the class?",
    "options": ["0 to 48.75", "48.75 to 60", "45 to 50", "exactly 48.75"],
    "answer": 1,
    "explain": "The top 25% are the students above $P_{75}$: from about 48.75 up to the maximum score on the axis, 60. A percentile question is answered with a score range, not a percentage."
  }
]
```
