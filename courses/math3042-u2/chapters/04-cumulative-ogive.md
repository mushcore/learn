---
title: Cumulative frequencies & ogives
minutes: 17
---

A frequency table counts the values **in** each class; a percentile asks how many lie **below** a point. Running totals answer it, and plotting them gives the **ogive** (**"oh-jive"**).

## Two definitions

- The **cumulative frequency** of a class is *"the number of individuals that fall into any class up to and including that class."*
- The **cumulative relative frequency** distribution is *"the fraction of individuals that fall into any class up to and including that class."*

## Building the table (Old Faithful, $n = 272$)

Start from the histogram lesson's frequency distribution (width 0.200, first class 1.6 to 1.799). The instructor's two rules beside the table:

- Each cumulative frequency is the **previous cumulative frequency plus this class's frequency**: 12, then $12 + 39 = 51$, then $51 + 20 = 71$. Dividing by $n$ gives $12/272 = 0.044$, $51/272 = 0.1875$, $71/272 = 0.2610$.
- **"Last cumulative frequency = $n$."** The running total must end at 272 and the last cumulative relative frequency at $272/272 = 1.000$: the arithmetic check.

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

The instructor labelled the **Upper Class Limit** column **"X-axis"** and the **Cumul Rel Freq** column **"Y-axis"**: those two columns are the ogive. The top row (upper limit 1.599, cumulative 0) is *"one additional point at the beginning of the curve to indicate the 0.0 point"*. 1.599 is the first lower limit 1.600 minus one unit of precision: the upper limit of an imaginary empty class before the first.

## Reading the table

**"How many eruptions had a duration of less than 4.0 minutes?"** **134**, the cumulative frequency of the class ending at 3.999 ("total # up to 3.999").

**"Estimate the median eruption time using the cumulative relative frequencies."** The median has 50% below it. In the last column 0.493 at 3.999 is under 0.5 and 0.607 at 4.199 is over it, so **"$Q_2$ is somewhere between 4.0 and 4.199."** (R's exact median is 4.000, at the bottom of that class.) Any percentile $P_p$ is located the same way.

### In R

The demo notebook builds the table with `cut()`, `table()`, `cumsum()` and division by $n$:

```r
freq.distribution <- table(cut(faithful$eruptions,
                               breaks=seq(1.6, 5.2, 0.2),
                               right=FALSE, include.lowest=TRUE))

cumul.freq.dist <- cumsum(freq.distribution)
n.total <-  nrow(faithful)

cumul.rel.freq.dist <- round( cumul.freq.dist / n.total , 3)
cbind(cumul.rel.freq.dist)
```

:::info R syntax
| Code | What it does |
|---|---|
| `freq.distribution <- table(cut(…))` | `<-` is assignment: the class counts are stored as `freq.distribution`. The dots are part of the name. |
| `cut(faithful$eruptions, …)` | Replaces each eruption value with the label of the class it falls in. Its first argument, `x`, is the data. |
| `breaks=seq(1.6, 5.2, 0.2)` | `seq()` fills from = 1.6, to = 5.2, by = 0.2 by position: the class boundaries. |
| `right=FALSE` | Classes include their left boundary and exclude their right one. |
| `include.lowest=TRUE` | With `right=FALSE`, also lets a value equal to the very last boundary, 5.2, count in the last class. |
| `table( … )` | Counts how many values carry each class label. |
| `cumul.freq.dist <- cumsum(freq.distribution)` | `cumsum()` replaces each count with the running total up to and including it. |
| `n.total <-  nrow(faithful)` | `nrow()` is the number of rows in the data frame, one per eruption. |
| `round( cumul.freq.dist / n.total , 3)` | `/` divides every running total by n; `round()` fills x = that result, digits = 3 decimals. |
| `cbind(cumul.rel.freq.dist)` | Binds the vector as a column, so it prints one class per line with its label. |

**Left to right**

- `freq.distribution <- table(cut(…))`: "Store under the name freq.distribution (`freq.distribution <-`) the count per class (`table`) of the eruption durations (`faithful$eruptions`) sorted into classes (`cut`) with boundaries from 1.6 to 5.2 in steps of 0.2 (`breaks=seq(1.6, 5.2, 0.2)`), closed on the left (`right=FALSE`), with 5.2 kept in the last class (`include.lowest=TRUE`)."
- `cumul.freq.dist <- cumsum(freq.distribution)`: "Store as cumul.freq.dist (`cumul.freq.dist <-`) the running totals (`cumsum`) of the class counts (`freq.distribution`)."
- `n.total <-  nrow(faithful)`: "Store as n.total (`n.total <-`) the number of rows (`nrow`) of the Old Faithful data (`faithful`)."
- `cumul.rel.freq.dist <- round(…)`: "Store as cumul.rel.freq.dist (`cumul.rel.freq.dist <-`) the rounded (`round`) running totals (`cumul.freq.dist`) divided by (`/`) n (`n.total`), to 3 decimals (`3`)."
- `cbind(cumul.rel.freq.dist)`: "Print as one column (`cbind`) the cumulative relative frequencies (`cumul.rel.freq.dist`)."

**Right to left**, the order R runs it

- `freq.distribution <- table(cut(…))`: "Take the Old Faithful data (`faithful`), pull out its eruptions column (`$eruptions`), build the boundaries (`seq`), label each value with its class (`cut`), count each class (`table`), and store the counts as freq.distribution (`freq.distribution <-`)."
- `cumul.freq.dist <- cumsum(freq.distribution)`: "Take the counts (`freq.distribution`), add them up as running totals (`cumsum`), and store them (`cumul.freq.dist <-`)."
- `n.total <-  nrow(faithful)`: "Count the rows of the data (`nrow(faithful)`) and store the count (`n.total <-`)."
- `cumul.rel.freq.dist <- round(…)`: "Divide each running total by n (`cumul.freq.dist / n.total`), round to 3 decimals (`round`, `3`), and store the result (`cumul.rel.freq.dist <-`)."
- `cbind(cumul.rel.freq.dist)`: "Take the vector (`cumul.rel.freq.dist`), bind it as a column (`cbind`), and print it."
:::

`cut()` assigns each value to a class, `table()` counts, `cumsum()` turns 12, 39, 20, ... into 12, 51, 71, ..., and `cbind()` prints a column.

## The ogive

> An ogive ("oh-jive") shows the cumulative relative frequencies plotted against the upper class limits.

The points are $(1.599, 0.000)$, $(1.799, 0.044)$, $(1.999, 0.188)$, ..., $(5.199, 1.000)$, joined by straight segments. A cumulative total never decreases, so the curve only rises or stays flat, ending at 1.0. The horizontal axis is the **upper** class limits, because a class's whole count lies below its upper limit. The instructor's caption: **"Shows all percentiles at once."**

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

:::info R syntax
| Code | What it does |
|---|---|
| `upper.class.limits <- seq(1.599, 5.199, 0.2)` | from = 1.599, to = 5.199, by = 0.2: the 19 upper limits, including the extra 1.599. |
| `ogive.values <- c(0, cumul.rel.freq.dist)` | `c()` combines values into one vector: a 0 followed by the 18 cumulative relative frequencies. |
| `plot(upper.class.limits, ogive.values, …)` | Plots the first vector on the x-axis against the second on the y-axis, one point per pair. |
| `type="b"` | Draws both points and the lines joining them. |
| `lwd=3` | Line width, three times the default thickness. |
| `ylab=`, `xlab=`, `main=` | The y-axis label, the x-axis label and the title, each a string in quotes. |
| `xaxp=c(1.6, 5.2, 36)` | x-axis ticks from 1.6 to 5.2 split into 36 intervals: one every 0.1. |
| `yaxp=c(0, 1, 20)` | y-axis ticks from 0 to 1 split into 20 intervals: one every 0.05. |
| `grid()` | Adds light dotted grid lines at the axis ticks of the plot already drawn. |
| `# these lines are …` | `#` starts a comment: R ignores everything after it on that line. |
| `abline(v = 4.1, lty=3)` | Adds a vertical line at x = 4.1; `lty=3` makes it dotted. |
| `abline(h = 0.55, lty=3)`, `abline(h = 0.357, lty=3)` | Add dotted horizontal lines at heights 0.55 and 0.357. |

**Left to right**

- `upper.class.limits <- seq(1.599, 5.199, 0.2)`: "Store as upper.class.limits (`upper.class.limits <-`) the sequence (`seq`) from 1.599 to 5.199 in steps of 0.2 (`1.599, 5.199, 0.2`)."
- `ogive.values <- c(0, cumul.rel.freq.dist)`: "Store as ogive.values (`ogive.values <-`) a 0 combined (`c`) with the cumulative relative frequencies (`cumul.rel.freq.dist`)."
- `plot(upper.class.limits, ogive.values, …)`: "Plot (`plot`) the upper limits across (`upper.class.limits`) against the ogive heights up (`ogive.values`) as points joined by lines (`type="b"`), three times thick (`lwd=3`), with axis labels and a title (`ylab=`, `xlab=`, `main=`), x ticks every 0.1 (`xaxp=c(1.6, 5.2, 36)`) and y ticks every 0.05 (`yaxp=c(0, 1, 20)`)."
- `grid()`: "Add a grid (`grid`) to the plot."
- `abline(…)` lines: "Add a dotted (`lty=3`) straight line (`abline`): vertical at 4.1 (`v = 4.1`), then horizontal at 0.55 and 0.357 (`h = 0.55`, `h = 0.357`)."

**Right to left**, the order R runs it

- `upper.class.limits <- seq(1.599, 5.199, 0.2)`: "Build the sequence 1.599 to 5.199 by 0.2 (`seq`) and store it (`upper.class.limits <-`)."
- `ogive.values <- c(0, cumul.rel.freq.dist)`: "Put 0 in front of the cumulative relative frequencies (`c(0, cumul.rel.freq.dist)`) and store the result (`ogive.values <-`)."
- `plot(upper.class.limits, ogive.values, …)`: "Look up the x values and y values (`upper.class.limits`, `ogive.values`), combine the tick settings (`c`), set the type, width, labels and title (`type=`, `lwd=`, `ylab=`, `xlab=`, `main=`), and draw the plot (`plot`)."
- `grid()`: "Read the current plot's ticks and draw grid lines at them (`grid`)."
- `abline(…)` lines: "Set the position and the dotted style (`v =` or `h =`, `lty=3`), then draw each line on the plot (`abline`)."
:::

`type="b"` draws **b**oth points and lines. `c(0, cumul.rel.freq.dist)` prepends the 0 for the 1.599 point; `abline()` draws the dotted guide lines used below.

### Reading the ogive, the two directions

**Given $X$, find the percentage below it**: up from $X$ to the curve, then across to the vertical axis.

- *What percentage of eruptions have a duration below 3.0 minutes?* **Approximately 35%**, so $P_{35} = 3.0$. (The table has 0.357 at 2.999.)
- *What percentage have a duration below 4.1 minutes?* Between 3.999 (0.493) and 4.199 (0.607): **approximately 55%**, so $P_{55} = 4.1$.

**Given a percentage, find $X$**: across from $p$ on the vertical axis to the curve, then down.

- *What value of eruption duration has 30% of eruptions below and 70% above?* **About 2.35.** In his words: "About 30% of eruptions had $X < 2.35$, 70% of eruptions had $X \ge 2.35$. $P_{30} = 2.35$."

:::tip Reading between two table points
The ogive is straight between two table points, so a value between them is found by proportion.

1. Find the two upper limits around $X$: 3.999 (0.493) and 4.199 (0.607).
2. How far along: $(4.1 - 3.999)/0.2 = 0.505$.
3. Height: $0.493 + 0.505 \times (0.607 - 0.493) = 0.493 + 0.058 = 0.551$, about 55%.

Reverse, for $P_{30}$: 0.30 lies between 0.261 (at 2.199) and 0.327 (at 2.399). How far along: $(0.30 - 0.261)/(0.327 - 0.261) = 0.039/0.066 = 0.59$, so $X = 2.199 + 0.59 \times 0.2 = 2.32$. The instructor's 2.35 is read by eye off the drawn curve; both count.
:::

```diagram
{"type": "flow", "nodes": [{"id": "x", "label": "X = 4.1"}, {"id": "b", "label": "Table points", "sub": "(3.999, 0.493) and (4.199, 0.607)"}, {"id": "f", "label": "How far along", "sub": "0.101 / 0.2 = 0.505"}, {"id": "h", "label": "Height", "sub": "0.493 + 0.505 × 0.114 = 0.551"}], "edges": [{"from": "x", "to": "b"}, {"from": "b", "to": "f"}, {"from": "f", "to": "h"}], "hi": ["f"], "caption": "Straight line between two table points: 4.1 is 0.505 of the way from 3.999 to 4.199, so the height is 0.551, about 55%."}
```

The ogive is the graph of the percentile function from Unit 1 ([Quartiles & percentiles](#/math3042/quartiles-percentiles)), read in either direction.

:::tip Between two values
Fraction from $a$ to $b$ = (height at $b$) − (height just below $a$). With classes, that is the upper limit of the last class you want minus the upper limit of the class before the first one you want. Eruptions from 3.0 to 4.199: $0.607$ (at 4.199) $- 0.357$ (at 2.999) $= 0.250$. Check by counts: $(1 + 4 + 6 + 10 + 16 + 31)/272 = 68/272 = 0.250$.
:::

```diagram
{"type": "grid", "nodes": [{"id": "r0c0", "label": "Class", "row": 0, "col": 0}, {"id": "r0c1", "label": "2.8–2.999", "row": 0, "col": 1}, {"id": "r0c2", "label": "3.0–3.199", "row": 0, "col": 2}, {"id": "r0c3", "label": "3.2–3.399", "row": 0, "col": 3}, {"id": "r0c4", "label": "3.4–3.599", "row": 0, "col": 4}, {"id": "r0c5", "label": "3.6–3.799", "row": 0, "col": 5}, {"id": "r0c6", "label": "3.8–3.999", "row": 0, "col": 6}, {"id": "r0c7", "label": "4.0–4.199", "row": 0, "col": 7}, {"id": "r1c0", "label": "Frequency", "row": 1, "col": 0}, {"id": "r1c1", "label": "2", "row": 1, "col": 1}, {"id": "r1c2", "label": "1", "row": 1, "col": 2}, {"id": "r1c3", "label": "4", "row": 1, "col": 3}, {"id": "r1c4", "label": "6", "row": 1, "col": 4}, {"id": "r1c5", "label": "10", "row": 1, "col": 5}, {"id": "r1c6", "label": "16", "row": 1, "col": 6}, {"id": "r1c7", "label": "31", "row": 1, "col": 7}, {"id": "r2c0", "label": "Cum rel freq", "row": 2, "col": 0}, {"id": "r2c1", "label": "0.357", "row": 2, "col": 1}, {"id": "r2c2", "label": "0.360", "row": 2, "col": 2}, {"id": "r2c3", "label": "0.375", "row": 2, "col": 3}, {"id": "r2c4", "label": "0.397", "row": 2, "col": 4}, {"id": "r2c5", "label": "0.434", "row": 2, "col": 5}, {"id": "r2c6", "label": "0.493", "row": 2, "col": 6}, {"id": "r2c7", "label": "0.607", "row": 2, "col": 7}], "hi": ["r2c1", "r2c7"], "caption": "3.0 to 4.199 = 0.607 − 0.357 = 0.250: subtract the height at the class just before the first one wanted."}
```

```widget
ogive
```

### The running total drawn class by class

Each step adds one class's frequency to the running total (12, 51, 71, ...) and plots the new point at that class's upper limit. A class adds zero or more values, so no segment can point down.

```widget
ogive-play
{}
```

## Cumulative table and ogive for delivery times

Fifty delivery times in minutes were grouped into classes 10–14, 15–19, 20–24, 25–29, 30–34, 35–39 with frequencies 4, 11, 18, 9, 6, 2.

```quiz
[
  {"q": "Cumulative relative frequency of the class 20–24? (3 decimals)", "type": "numeric", "answer": 0.66, "tolerance": 0.0006, "explain": "Cumulative frequency $4 + 11 + 18 = 33$; divide by $n = 50$: $33/50 = 0.660$."},
  {"q": "How many deliveries took less than 25 minutes?", "type": "numeric", "answer": 33, "tolerance": 0, "explain": "Everything up to and including the class ending at 24: the cumulative frequency 33."},
  {"q": "The ogive gets one extra point at height 0. What is its $x$-coordinate?", "type": "numeric", "answer": 9, "tolerance": 0, "explain": "The upper limit just before the first class: 10 − 1 = 9, so the curve starts at (9, 0) and then plots (14, 0.08), (19, 0.30), …"},
  {"q": "Which class contains the median?", "options": ["20–24", "15–19", "25–29", "30–34"], "answer": 0, "explain": "The cumulative relative frequencies are 0.08, 0.30, 0.66, 0.84, 0.96, 1.00. 0.5 is first passed in the class 20–24 (0.30 below it, 0.66 at its upper limit)."},
  {"q": "What percentage of deliveries took 15 to 29 minutes?", "type": "numeric", "answer": 76, "tolerance": 0.5, "unit": "%", "explain": "Height at 29 (the last class wanted, 25–29) minus height at 14 (the class before the first one wanted, 15–19): $0.84 - 0.08 = 0.76$, i.e. 76%. Check by counts: $(11 + 18 + 9)/50 = 38/50 = 0.76$."},
  {"type": "fill", "q": "Fill the function that turns frequencies into running totals.", "code": "freqs <- c(4, 11, 18, 9, 6, 2)\n___(freqs)\n## [1]  4 15 33 42 48 50", "answer": ["cumsum"], "explain": "`cumsum()` adds each frequency to the previous total; the last value equals $n = 50$, the arithmetic check."}
]
```

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
  {"q": "Which eruption duration has 30% of eruptions below it and 70% above it (the 30th percentile)?", "type": "numeric", "answer": 2.35, "tolerance": 0.15, "unit": "min", "explain": "Across from 0.30 to the curve, then down: about 2.35, i.e. $P_{30} = 2.35$. By proportion between 0.261 (at 2.199) and 0.327 (at 2.399): $2.199 + 0.59 \\times 0.2 = 2.32$; both count."},
  {"q": "Which R function turns the frequencies 12, 39, 20, ... into the running totals 12, 51, 71, ...?", "options": ["`cumsum()`", "`sum()`", "`cut()`", "`table()`"], "answer": 0, "explain": "`cumsum()` computes cumulative sums; `cut()` assigns values to classes and `table()` counts them, then `cumsum()` accumulates."},
  {"q": "In `plot(upper.class.limits, ogive.values, type=\"b\", ...)`, what does `type=\"b\"` draw?", "options": ["Both the points and the lines connecting them", "Bars", "Only the points", "A box plot"], "answer": 0, "explain": "'b' is for both; 'p' would give points only and 'l' lines only."},
  {"q": "On an ogive the curve can go down between two consecutive points.", "type": "tf", "answer": false, "explain": "Cumulative frequency never decreases (a class adds zero or more individuals), so the ogive only rises or stays flat, ending at 1.0."}
]
```
