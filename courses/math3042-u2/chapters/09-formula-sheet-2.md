---
title: Formula & recipe sheet (Unit 2)
minutes: 8
---

Everything from Unit 2 and Lab 2 on one page: the recipes, the definitions, and the R commands. No new explanations here; if a line does not make sense, go back to its chapter. The Unit 1 formulas it leans on ($Q_1$, $Q_3$, fences, $Sk$, $CV$, $Z$) are restated at the bottom.

## Which chart for which data

| Data | Charts | What each one shows |
|---|---|---|
| Categorical (eye colour) | frequency table, **pie chart**, **bar chart** | pie: fraction of the whole (relative frequency); bar: absolute frequency, better for comparing categories; the tallest bar is the **modal** category |
| Numerical, small $n$ | **stem-and-leaf plot** | every value, sorted, with the shape visible (a frequency distribution of $X$) |
| Numerical, integer $X$ | bar plot of `table(X)` | one bar per value; **not recommended** (too many rectangles, missing $X$ values on the axis) |
| Numerical, any $n$ | **histogram** | frequency per class of equal width; the most common and important chart |
| Numerical | box plot | five-number summary, fences, outliers (Unit 1) |
| Numerical | **ogive** | cumulative relative frequency; reads off any percentile |
| Two numerical variables | **scatter plot** | one point $(X, Y)$ per individual; trend direction matches the sign of $r$ |

## Stem-and-leaf

1. Leaf = the last digit you keep; stem = everything in front of it (163 → 16 | 3). If the data has too many digits, **round first** (2.283 → 2.28 → 22 | 8).
2. Stems down the left of a vertical line, one leaf per value on the right, **leaves sorted**.
3. R may **split** each stem into two lines (leaves 0–4, then 5–9) or merge stems when there would be too many lines.
4. Read R's key line: "The decimal point is 1 digit(s) to the **right** of the |" means 14 | 1 is 141; "1 digit(s) to the **left**" means 16 | 0 is 1.60.

Interpretation: the longest line is where the data piles up (centre, mode); two separate piles mean two clusters (Old Faithful: about 1.8 and 4.4 min).

## Histogram recipe (7 steps)

1. Initial number of classes $= \sqrt{n}$.
2. Ideal class width $= \dfrac{R}{\sqrt{n}} = \dfrac{\max - \min}{\sqrt{n}}$.
3. Round the width to the **precision of $X$** and to a nice number (round down if in doubt).
4. First lower class limit = minimum $X$ (may be rounded down).
5. Lower limits go up by the width; each **upper limit = next lower limit − one unit of precision**.
6. Count the values in each class: the **frequency distribution** ($\Sigma f = n$).
7. Draw one rectangle per class, height = frequency, no gaps.

| | Age (BCIT students) | Old Faithful eruptions |
|---|---|---|
| $n$, $\sqrt{n}$ | 302, 17.4 | 272, 16.5 |
| $R$ | $42 - 18 = 24$ | $5.1 - 1.6 = 3.5$ |
| ideal width | $24/17.4 = 1.38$ | $3.5/16.5 = 0.212$ |
| actual width | 2 | 0.200 (3 decimals like the data) |
| first class | 18–19 | 1.600–1.799 |
| frequencies | 35, 94, 104, 53, 10, 2, 1, 0, 1, 0, 1, 0, 1 | 12, 39, 20, 18, 3, 3, 2, 1, 4, 6, 10, 16, 31, 29, 35, 28, 11, 4 |
| R | `hist(x, breaks=seq(18, 44, by=2), right=FALSE)` | `hist(x, breaks=seq(1.6, 5.2, by=0.2), right=FALSE)` |

`right = FALSE`: a class is $[\text{lower}, \text{next lower})$, e.g. $18 \le X < 20$. Features: equal widths, no gaps, every value in exactly one class, frequency = height.

Pitfalls: far too many classes (width ÷ 10) gives a jagged shape with empty classes; far too few (width × 10) hides the shape. $\sqrt{n}$ avoids both.

## Cumulative frequencies and the ogive

- **Relative frequency** of a class $= f / n$.
- **Cumulative frequency** of a class $=$ the number of values in that class **and every class before it**; the last one equals $n$.
- **Cumulative relative frequency** $=$ cumulative frequency $/ n$; the last one equals 1.000.
- **Ogive**: plot cumulative relative frequency (Y) against the **upper class limits** (X), joined by lines, with one extra point at 0 just before the first class (1.599, 0).

Reading an ogive:

| Question | Move |
|---|---|
| What fraction is below $X$? | up from $X$ to the curve, across to the Y axis |
| Which $X$ is the $p$-th percentile $P_p$? | across from $p$ to the curve, down to the X axis |
| What fraction is between $a$ and $b$? | (fraction below $b$) − (fraction below $a$) |
| Top $k\%$? | scores above $P_{100-k}$ |

Old Faithful readings: $P_{35} \approx 3.0$, $P_{55} \approx 4.1$, $P_{30} \approx 2.35$; 134 eruptions (0.493) are below 4.0, so the median is in 4.0–4.199.

## Scatter plot

One point $(X, Y)$ per individual. Downward trend ↔ $r < 0$; upward ↔ $r > 0$. mtcars: $Y$ = mpg, $X$ = wt, `cor(mtcars$wt, mtcars$mpg)` = −0.868, line of best fit (regression line) `mpg = -5.344*wt + 37.285`.

## Unit 1 formulas used inside Unit 2

- $Q_1, Q_2, Q_3$: sort, split into halves (R's `quantile()` interpolates; small differences are fine). $IQR = Q_3 - Q_1$.
- Fences: $Q_1 - 1.5 \times IQR$ and $Q_3 + 1.5 \times IQR$; beyond a fence = **outlier**.
- $Sk = \dfrac{3(\bar{X} - Q_2)}{s}$; $Sk > 0$ skewed right, $|Sk| > 1$ highly skewed.
- $CV = \dfrac{s}{\bar{X}} \times 100\%$: smaller $CV$ = more relatively consistent.
- $Z = \dfrac{X - \bar{X}}{s}$ (R: `scale(x)`); unusual if $|Z| > 2$.
- Empirical rule percentiles (normal data): $P_{2.5} = \mu - 2\sigma$, $P_{16} = \mu - \sigma$, $P_{50} = \mu$, $P_{84} = \mu + \sigma$, $P_{97.5} = \mu + 2\sigma$.
- Chebyshev (any shape): at least $1 - 1/k^2$ within $\pm k$ sd (75% for $k=2$, 88.9% for $k=3$). Skewed data can satisfy Chebyshev and still break the empirical rule (quine Days: 0.781, 0.945, 0.979 vs 0.68, 0.95, 0.997).

## R commands

| Command | Does |
|---|---|
| `table(x)` | frequency table (named vector, alphabetical); `freq.tab[3]` keeps the name, `freq.tab[[3]]` drops it |
| `pie(freq.tab, radius=1.0, main="...")` | pie chart |
| `barplot(freq.tab, col="lightgreen", xlab, ylab, main)` | bar chart (for integer data: `barplot(table(x))`) |
| `stem(x)`, `stem(x, scale=0.5)` | stem-and-leaf; `scale` compresses the number of stems |
| `hist(x, breaks=seq(lo, hi, by=w), right=FALSE, col, xlab, main)` | histogram with $[\text{lower}, \text{upper})$ classes |
| `table(cut(x, breaks=seq(...), right=FALSE))`, `cumsum(...)` | frequency distribution, cumulative frequencies; divide by `nrow(df)` for relative |
| `plot(upper.limits, c(0, cum.rel), type="b")` | ogive (`type="b"` = both points and lines) |
| `plot(x, y)`, `xyplot(y ~ x, data=df, type=c("p","r"))` | scatter plot; lattice's `xyplot` adds the regression line with `"r"` |
| `cor(x, y)` | correlation coefficient $r$ |
| `summary(x)` | Min., 1st Qu., Median, Mean, 3rd Qu., Max. |
| `favstats(~X, data=df)`, `favstats(X ~ G, data=df)` | mosaic: min, Q1, median, Q3, max, mean, sd, n (per group with `X ~ G`) |
| `mean(X ~ G1 + G2, data=df)` (also `median`, `sd`, `var`, `IQR`, `quantile`) | one statistic per group combination, named `G1.G2` |
| `quantile(~X, probs=0.9, data=df)`, `probs=c(0.1, 0.9)`, `probs=seq(0.1, 0.9, by=0.1)` | percentiles (decimals, not percents) |
| `histogram(~X, data=df, type="count", breaks, col="#FF7256")`, `bwplot(~X, data=df, horizontal=TRUE)`, `bwplot(X ~ G, data=df)` | mosaic/lattice histogram and box plots (side by side with `X ~ G`) |
| `percent_rank(x)` (dplyr) | percentile ranking of every value as a decimal; `round(100*...)` for whole percents |
| `subset(df, percent_rank(X) > 0.75)` | rows above the 75th percentile |
| `prop.table(table(x))` | fractions instead of counts |
| `scale(x)` | Z-scores; `sum(abs(scale(x)) > 2)` counts values beyond 2 sd |
| `cbind(v)` | print a vector as a vertical column |
| `paste0("... (n = ", nrow(df), ")")` | build a title with $n$ without hard-coding it |

```quiz
[
  {"q": "Rapid fire: ideal class width formula?", "options": ["$R/\\sqrt{n}$", "$\\sqrt{n}/R$", "$R/n$", "$n/R$"], "answer": 0, "explain": "Range divided by the square root of the sample size, then rounded to the data's precision and a nice number."},
  {"q": "Upper class limit = next lower limit minus...", "options": ["one unit of the data's precision", "the class width", "1 always", "half the class width"], "answer": 0, "explain": "Whole-number data: 20 − 1 = 19. Three-decimal data: 1.800 − 0.001 = 1.799."},
  {"q": "An ogive's X axis holds the...", "options": ["upper class limits", "lower class limits", "class marks", "frequencies"], "answer": 0, "explain": "Cumulative relative frequency is plotted at each upper class limit, plus a 0 point before the first class."},
  {"q": "The last cumulative relative frequency is always...", "type": "numeric", "answer": 1, "tolerance": 0, "explain": "Everything is at or below the last upper limit: $n/n = 1$."},
  {"q": "`favstats(Days ~ Eth, data=quine)` gives one row per...", "options": ["level of Eth (A and N)", "student", "day", "quartile"], "answer": 0, "explain": "The model formula groups Days by the categorical variable on the right of the ~."},
  {"q": "Which R function turns a vector of values into their Z-scores?", "type": "text", "answer": ["scale", "scale()", "scale(x)"], "explain": "`scale(x)` subtracts the mean and divides by the sample sd for every value."}
]
```
