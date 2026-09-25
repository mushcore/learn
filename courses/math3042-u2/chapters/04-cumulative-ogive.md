---
title: Cumulative frequencies & ogives
minutes: 17
---

A frequency distribution answers "how many values are **in** this class?" A percentile question asks "how many values are **below** this point?" Running totals down the table answer it, and plotting those totals gives the **ogive** (the instructor's pronunciation note: **"oh-jive"**).

## Two definitions

- The **cumulative frequency** of a class is *"the number of individuals that fall into any class up to and including that class."*
- The **cumulative relative frequency** distribution is *"the fraction of individuals that fall into any class up to and including that class."*

Cumulative frequency is a running count; cumulative relative frequency is that count divided by $n$.

## Building the table (Old Faithful, $n = 272$)

Start from the histogram lesson's frequency distribution (width 0.200, first class 1.6 to 1.799). The instructor filled the first rows by hand:

| Lower | Upper | Frequency | Cumul Freq | Cumul Rel Freq |
|---|---|---|---|---|
| 1.6 | 1.799 | 12 | 12 | $12/272 = 0.044$ |
| 1.8 | 1.999 | 39 | $12 + 39 = 51$ | $51/272 = 0.1875$ |
| 2.0 | 2.199 | 20 | $51 + 20 = 71$ | $71/272 = 0.2610$ |
| ... and so on ... | | | | |
| 5.0 | 5.199 | 4 | 272 | $272/272 = 1.000$ |

His two rules beside the table:

- Each cumulative frequency is the **previous cumulative frequency plus this class's frequency**: 12, then 12 + 39 = 51, then 51 + 20 = 71.
- **"Last cumulative frequency = $n$."** The running total must end at 272 and the last cumulative relative frequency at 1.000: the arithmetic check.

The complete table, with the extra row on top that the ogive needs:

| Lower Class Limit | Upper Class Limit | Frequency | Cumul Freq | Cumul Rel Freq |
|---|---|---|---|---|
| | 1.599 | | 0 | 0.000 |
| 1.6 | 1.799 | 12 | 12 | 0.044 |
| 1.8 | 1.999 | 39 | 51 | 0.188 |
| 2.0 | 2.199 | 20 | 71 | 0.261 |
| 2.2 | 2.399 | 18 | 89 | 0.327 |
| 2.4 | 2.599 | 3 | 92 | 0.338 |
| 2.6 | 2.799 | 3 | 95 | 0.349 |
| 2.8 | 2.999 | 2 | 97 | 0.357 |
| 3.0 | 3.199 | 1 | 98 | 0.360 |
| 3.2 | 3.399 | 4 | 102 | 0.375 |
| 3.4 | 3.599 | 6 | 108 | 0.397 |
| 3.6 | 3.799 | 10 | 118 | 0.434 |
| 3.8 | 3.999 | 16 | 134 | 0.493 |
| 4.0 | 4.199 | 31 | 165 | 0.607 |
| 4.2 | 4.399 | 29 | 194 | 0.713 |
| 4.4 | 4.599 | 35 | 229 | 0.842 |
| 4.6 | 4.799 | 28 | 257 | 0.945 |
| 4.8 | 4.999 | 11 | 268 | 0.985 |
| 5.0 | 5.199 | 4 | 272 | 1.000 |
| | | Total = 272 | 272 | |

The instructor labelled the **Upper Class Limit** column **"X-axis"** and the **Cumul Rel Freq** column **"Y-axis"**: those two columns are the ogive. The top row (upper limit 1.599, cumulative 0) is *"one additional point at the beginning of the curve to indicate the 0.0 point"*.

## Reading the table

**"How many eruptions had a duration of less than 4.0 minutes?"** **134**, the cumulative frequency of the class ending at 3.999 ("total # up to 3.999").

**"Estimate the median eruption time using the cumulative relative frequencies."** The median has 50% below it. In the last column 0.493 at 3.999 is under 0.5 and 0.607 at 4.199 is over it, so **"$Q_2$ is somewhere between 4.0 and 4.199."** (R's exact median is 4.000, at the bottom of that class.) Any percentile $P_p$ is located the same way: the first row whose cumulative relative frequency reaches $p$.

### In R

The demo notebook builds the table with `cut()` (assign each value to a class), `table()` (count), `cumsum()` (running total) and division by $n$:

```r
freq.distribution <- table(cut(faithful$eruptions,
                               breaks=seq(1.6, 5.2, 0.2),
                               right=FALSE, include.lowest=TRUE))

cumul.freq.dist <- cumsum(freq.distribution)
n.total <-  nrow(faithful)

cumul.rel.freq.dist <- round( cumul.freq.dist / n.total , 3)
cbind(cumul.rel.freq.dist)
```

`cumsum()` turns 12, 39, 20, ... into 12, 51, 71, ...; `cbind()` prints the result as a vertical column.

## The ogive

> An ogive ("oh-jive") shows the cumulative relative frequencies plotted against the upper class limits.

The points are $(1.599, 0.000)$, $(1.799, 0.044)$, $(1.999, 0.188)$, $(2.199, 0.261)$, ..., $(5.199, 1.000)$, joined by straight segments. The curve only rises or stays flat, because a cumulative total never decreases, and it ends at 1.0. The instructor's caption: **"Shows all percentiles at once."**

```r
upper.class.limits <- seq(1.599, 5.199, 0.2)
ogive.values <- c(0, cumul.rel.freq.dist)

plot(upper.class.limits, ogive.values, type="b", lwd=3,
     ylab="Cumulative Relative Frequency",
     xlab="Eruption Duration (min)",
     main="Ogive for Eruption Duration",
     xaxp=c(1.6, 5.2, 36),
     yaxp=c(0, 1, 20))

grid()

# these lines are added to help read the graph at certain values
abline(v = 4.1, lty=3)
abline(h = 0.55, lty=3)
abline(h = 0.357, lty=3)
```

`type="b"` draws **b**oth points and lines. `c(0, cumul.rel.freq.dist)` prepends the 0 for the 1.599 point, which is why `upper.class.limits` starts at 1.599. `abline(v=...)` and `abline(h=...)` draw the dotted guide lines used below.

### Reading the ogive, the two directions

**Given $X$, find the percentage below it**: up from $X$ to the curve, then across to the vertical axis.

- *What percentage of eruptions have a duration below 3.0 minutes?* **Approximately 35%**, so $P_{35} = 3.0$. (The table has 0.357 at 2.999.)
- *What percentage have a duration below 4.1 minutes?* 4.1 lies between the points at 3.999 (0.493) and 4.199 (0.607); reading the segment gives **approximately 55%**, so $P_{55} = 4.1$.

**Given a percentage, find $X$**: across from $p$ on the vertical axis to the curve, then down.

- *What value of eruption duration has 30% of eruptions below and 70% above?* **About 2.35.** In his words: "About 30% of eruptions had $X < 2.35$, 70% of eruptions had $X \ge 2.35$. $P_{30} = 2.35$."

The ogive is the graph of the percentile function from Unit 1 ([Quartiles & percentiles](#/math3042/quartiles-percentiles)), read in either direction.

```widget
ogive
```

:::quiz Two ogive traps
The fraction **between** $a$ and $b$ is the height at $b$ minus the height at $a$; on the Lab 2 test-score ogive, "between 30 and 40" is $40\% - 15\% = 25\%$. And the horizontal axis is the **upper** class limits, never lower limits or midpoints, because a class's whole count lies below its upper limit.
:::

```quiz
[
  {"q": "Old Faithful classes have frequencies 12, 39, 20, 18, ... What is the cumulative frequency of the third class (2.0 to 2.199)?", "type": "numeric", "answer": 71, "tolerance": 0, "explain": "$12 + 39 = 51$, then $51 + 20 = 71$."},
  {"q": "What is the cumulative relative frequency of the second class (1.8 to 1.999)? (3 decimals)", "type": "numeric", "answer": 0.188, "tolerance": 0.001, "explain": "Cumulative frequency 51, divided by $n = 272$: $51/272 = 0.1875 \\approx 0.188$."},
  {"q": "The last cumulative frequency in any table must equal...", "options": ["$n$, the total number of individuals", "the largest single frequency", "the number of classes", "100"], "answer": 0, "explain": "The running total ends when every individual has been counted: 272 here. The last cumulative relative frequency is therefore 1.000."},
  {"q": "How many Old Faithful eruptions lasted less than 4.0 minutes?", "type": "numeric", "answer": 134, "tolerance": 0, "explain": "The cumulative frequency of the class ending at 3.999 is 134: 'total # up to 3.999'."},
  {"q": "Using cumulative relative frequencies 0.493 at 3.999 and 0.607 at 4.199, the median eruption time is...", "options": ["somewhere between 4.0 and 4.199", "exactly 3.999", "somewhere between 3.8 and 3.999", "about 0.5 minutes"], "answer": 0, "explain": "0.5 is first reached inside the class 4.0-4.199 (0.493 is below 0.5, 0.607 is above), so Q2 lies in that class."},
  {"q": "An ogive plots cumulative relative frequency against the lower class limits.", "type": "tf", "answer": false, "explain": "Against the UPPER class limits: a class's whole count is below its upper limit. One extra point (1.599, 0) is added at the start."},
  {"q": "Why is the point (1.599, 0) added to the Old Faithful ogive?", "options": ["To show that 0% of the data lies below the first class", "Because 1.599 is the median", "R requires an even number of points", "To make the curve pass through the origin"], "answer": 0, "explain": "The notes: 'we insert one additional point at the beginning of the curve to indicate the 0.0 point of cumulative relative frequency.'"},
  {"q": "From the ogive, about what percentage of eruptions last less than 3.0 minutes?", "type": "numeric", "answer": 35, "tolerance": 2, "unit": "%", "explain": "Up from 3.0 to the curve, across: approximately 35%, so $P_{35} = 3.0$ (the table gives 0.357 at 2.999)."},
  {"q": "Which eruption duration has 30% of eruptions below it and 70% above it (the 30th percentile)?", "type": "numeric", "answer": 2.35, "tolerance": 0.15, "unit": "min", "explain": "Across from 0.30 to the curve, then down: about 2.35, i.e. $P_{30} = 2.35$."},
  {"q": "Which R function turns the frequencies 12, 39, 20, ... into the running totals 12, 51, 71, ...?", "options": ["`cumsum()`", "`sum()`", "`cut()`", "`table()`"], "answer": 0, "explain": "`cumsum()` computes cumulative sums; `cut()` assigns values to classes and `table()` counts them, then `cumsum()` accumulates."},
  {"q": "In `plot(upper.class.limits, ogive.values, type=\"b\", ...)`, what does `type=\"b\"` draw?", "options": ["Both the points and the lines connecting them", "Bars", "Only the points", "A box plot"], "answer": 0, "explain": "'b' is for both; 'p' would give points only and 'l' lines only."},
  {"q": "On an ogive the curve can go down between two consecutive points.", "type": "tf", "answer": false, "explain": "Cumulative frequency never decreases (a class adds zero or more individuals), so the ogive only rises or stays flat, ending at 1.0."}
]
```
