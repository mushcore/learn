---
title: Cumulative frequencies & ogives
minutes: 20
---

A frequency distribution answers "how many values are **in** this class?" Very often the question is instead "how many values are **below** this point?", which is a percentile question. Adding the frequencies up as you go down the table answers it, and plotting those running totals gives the **ogive** (the instructor's pronunciation note: **"oh-jive"**).

## Two definitions

- The **cumulative frequency** of a class is *"the number of individuals that fall into any class up to and including that class."*
- The **cumulative relative frequency** distribution is *"the fraction of individuals that fall into any class up to and including that class."*

So cumulative frequency is a running count, and cumulative relative frequency is that count divided by $n$.

## Building the table (Old Faithful, $n = 272$)

Start from the frequency distribution of the histogram lesson (width 0.200, first class 1.6 to 1.799). The instructor filled the first rows by hand:

| Lower | Upper | Frequency | Cumul Freq | Cumul Rel Freq |
|---|---|---|---|---|
| 1.6 | 1.799 | 12 | 12 | $12/272 = 0.044$ |
| 1.8 | 1.999 | 39 | $12 + 39 = 51$ | $51/272 = 0.1875$ |
| 2.0 | 2.199 | 20 | $51 + 20 = 71$ | $71/272 = 0.2610$ |
| ... and so on ... | | | | |
| 5.0 | 5.199 | 4 | 272 | $272/272 = 1.000$ |

Two rules he wrote beside the table:

- Each cumulative frequency is the **previous cumulative frequency plus this class's frequency** (12, then 12 + 39 = 51, then 51 + 20 = 71, ...).
- **"Last cumulative frequency = $n$."** The running total must end at 272, and the last cumulative relative frequency must be 1.000. That is your arithmetic check.

The complete table, with one extra row on top that the ogive needs:

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

The instructor highlighted the **Upper Class Limit** column and labelled it **"X-axis"**, and the **Cumul Rel Freq** column labelled **"Y-axis"**: those two columns are the ogive. The row at the top (upper limit 1.599, cumulative 0) is *"one additional point at the beginning of the curve to indicate the 0.0 point"*: nothing is below the first class.

## Reading the table

**"How many eruptions had a duration of less than 4.0 minutes?"** Answer: **134**, the cumulative frequency of the class that ends at 3.999. The instructor's note: "total # up to 3.999". Everything in classes up to and including 3.8–3.999 is below 4.0.

**"Estimate the median eruption time using the cumulative relative frequencies."** The median has 50% below it. Run down the last column: 0.493 at 3.999 is still under 0.5, and 0.607 at 4.199 is over it, so the median must be inside the class 4.0–4.199. His answer: **"$Q_2$ is somewhere between 4.0 and 4.199."** (R's exact median is 4.000, at the bottom of that class.)

The same logic locates any percentile: find the first row whose cumulative relative frequency reaches $p$, and $P_p$ lies in that class.

### In R

The demo notebook builds the table with `cut()` (assign each value to a class), `table()` (count), `cumsum()` (running total), and division by $n$:

```r
freq.distribution <- table(cut(faithful$eruptions,
                               breaks=seq(1.6, 5.2, 0.2),
                               right=FALSE, include.lowest=TRUE))

cumul.freq.dist <- cumsum(freq.distribution)
n.total <-  nrow(faithful)

cumul.rel.freq.dist <- round( cumul.freq.dist / n.total , 3)
cbind(cumul.rel.freq.dist)
```

`cumsum()` is the whole trick: it turns 12, 39, 20, ... into 12, 51, 71, ... `cbind()` just prints the result as a vertical column, the same layout as the notes.

## The ogive

> An ogive ("oh-jive") shows the cumulative relative frequencies plotted against the upper class limits.

So the points are $(1.599, 0.000)$, $(1.799, 0.044)$, $(1.999, 0.188)$, $(2.199, 0.261)$, ..., $(5.199, 1.000)$, joined by straight segments. The curve can only go up (or stay flat), because a cumulative total never decreases, and it ends at 1.0. The instructor's caption: **"Shows all percentiles at once."** Every point on the curve is a statement "this fraction of the data is below this $X$."

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

`type="b"` draws **b**oth points and connecting lines. `c(0, cumul.rel.freq.dist)` prepends the 0 for the 1.599 point, which is why `upper.class.limits` starts at 1.599. `abline(v=...)` and `abline(h=...)` draw dotted vertical and horizontal guide lines, the "reading" lines below.

### Reading the ogive, the two directions

**Given $X$, find the percentage below it**: go straight up from $X$ on the horizontal axis to the curve, then straight across to the vertical axis.

- *What percentage of eruptions have a duration below 3.0 minutes?* Up from 3.0, across: **approximately 35%**. The instructor turns that into percentile notation: $P_{35} = 3.0$. (The table agrees: 0.357 at 2.999.)
- *What percentage have a duration below 4.1 minutes?* 4.1 sits between the points at 3.999 (0.493) and 4.199 (0.607), so read the segment: **approximately 55%**, hence $P_{55} = 4.1$.

**Given a percentage, find $X$**: go across from $p$ on the vertical axis to the curve, then straight down.

- *What value of eruption duration has 30% of eruptions below and 70% above?* Across from 0.30, down: **about 2.35**. In his words: "About 30% of eruptions had $X < 2.35$, 70% of eruptions had $X \ge 2.35$. $P_{30} = 2.35$."

Percentiles were defined in Unit 1 ([Quartiles & percentiles](#/math3042/quartiles-percentiles)): $P_k$ separates the lower $k\%$ from the upper $(100-k)\%$. The ogive is a graph of exactly that function, read in either direction.

## Try it

Drag the yellow vertical guide to a duration and read the fraction below it; drag the green horizontal guide to a percentage and read the percentile. The second preset is the Lab 2 pencil problem (test scores of 2287 students), read the same way.

```widget
ogive
```

:::quiz Percentage between two values
An ogive question often asks for the fraction **between** $a$ and $b$. Read the cumulative fraction at $b$, read it at $a$, subtract. On the Lab 2 test-score ogive, "between 30 and 40" is $40\% - 15\% = 25\%$, and "the top 25%" starts at the score where the curve reaches 75% (about 48) and runs to the maximum (60). The pencil-problems lesson works all three parts.
:::

:::tip What the axes must be
Students lose marks by plotting cumulative frequency against **lower** limits or class midpoints. The ogive uses **upper class limits** on the horizontal axis (a class's whole count is below its upper limit) and **cumulative relative frequency** on the vertical axis, starting from an extra point at 0.
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
