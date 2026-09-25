---
title: favstats, model formulas, percentiles, Z-scores
minutes: 22
---

Lab 2 applies Unit 1's numbers (mean, sd, quartiles, fences, $Sk$, $Z$) to a real data frame, one group at a time. Its R idioms (model formulas, `favstats`, `quantile(probs=)`, `percent_rank`, `scale`) are what a "what does this R code compute?" question looks like; every task below shows the instructor's own output.

## The data: `quine`

School absences in Walgett, New South Wales, from the `MASS` package; the lab also needs `mosaic` (grouped statistics) and `dplyr` (percent ranks):

```r
library(MASS)
library(mosaic)
library(dplyr)
data(quine)
View(quine)
```

`View()` opens the spreadsheet viewer in RStudio. Each row is **one child**, with one numerical variable and four categorical ones:

| Column | Type | Values |
|---|---|---|
| `Days` | numerical | number of days the child was absent |
| `Sex` | categorical | `"F"` or `"M"` |
| `Eth` | categorical | ethnic background: Aboriginal `"A"` or not `"N"` |
| `Age` | categorical | age group (school form): `"F0"`, `"F1"`, `"F2"`, `"F3"` |
| `Lrn` | categorical | learner status: average `"AL"` or slow `"SL"` |

$n = 146$ children (`nrow(quine)`). Every task summarizes `Days`, for everyone or for one group.

## `summary()`: six numbers in one call

```r
X.vals <- c(9, 10, 8, 10, 11, 12, 11, 11)
summary( X.vals )
```
```text
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   8.00    9.75   10.50   10.25   11.00   12.00
```

Left to right: minimum, $Q_1$, median ($Q_2$), mean $\bar{X}$, $Q_3$, maximum. The **mean sits in the middle of the line**, between the median and $Q_3$. `summary()` does not report the standard deviation; that needs `sd()`.

### Task 2: summary statistics of `Days`

```r
summary(quine$Days)
sd(quine$Days)
```
```text
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   0.00    5.00   11.00   16.46   22.75   81.00
[1] 16.25322
```

| Statistic | Value |
|---|---|
| $\bar{X}$ | 16.5 |
| $s$ | 16.3 |
| min | 0.0 |
| $Q_1$ | 5.0 |
| $Q_2$ | 11.0 |
| $Q_3$ | 22.8 |
| max | 81.0 |

The mean (16.5) is well above the median (11.0), so the distribution is skewed right, and $s \approx \bar{X}$: some children are almost never absent, a few are absent for months.

## `favstats()` and the model formula

`mosaic`'s `favstats()` is `summary()` plus the sd, the count and a missing-value count, with a different syntax:

```r
favstats(~Days, data=quine)
```
```text
 min Q1 median    Q3 max    mean       sd   n missing
   0  5     11 22.75  81 16.4589 16.25322 146       0
```

`~Days` is a **model formula**: read `~` as "in terms of". `~Days` alone means "the `Days` variable", and `data=quine` names the data frame. The payoff is statistics **per group**:

```r
favstats(Days~Lrn, data=quine)
```
```text
  Lrn min Q1 median   Q3 max     mean       sd  n missing
1  AL   0  5     12 22.5  69 15.81928 13.91012 83       0
2  SL   0  5     10 22.5  81 17.30159 18.99035 63       0
```

`Days~Lrn` reads "Days, grouped by Lrn": one row per learner type. The instructor's conclusion: "slow" learners had a greater mean days absent (17.3 days) than "average" learners (15.8 days).

:::tip Reading a formula
- `~X`: just the variable `X`.
- `Y~G`: the numerical variable `Y`, one result per level of the categorical variable `G`.
- `Y~G1+G2`: one result per combination of two categorical variables.

The same `~` is in `boxplot(extra~group, data=sleep)` from Unit 1.
:::

```widget
group-stats
{ "by": "Sex" }
```

### The mosaic overrides

`mosaic` also teaches the familiar functions to accept `~X` or `X~G` with `data=`:

- `mean( ~X, data=df)`, `median( ~X, data=df)`, `sd( ~X, data=df)`, `var( ~X, data=df)`
- `min( ~X, data=df)`, `max( ~X, data=df)`, `sum( ~X, data=df)`
- `IQR( ~X, data=df)`, `quantile( ~X, data=df)`
- `favstats( ~X, data=df)`, `histogram( ~X, data=df)`, `bwplot( ~X, data=df)`

`histogram()` and `bwplot()` are the mosaic (lattice) versions of `hist()` and `boxplot()`.

### Task 3: mean days absent by sex

```r
round(mean(Days~Sex, data=quine), 1)
```
```text
   F    M
15.2 18.0
```

| Sex | $\bar{X}$ |
|---|---|
| F | 15.2 |
| M | 18.0 |

`mean(Days~Sex)` returns one mean per level of `Sex` as a named vector; `round(..., 1)` rounds every element. Boys were absent about three days more on average.

### Task 4: Pearson's skewness, overall and by sex

Unit 1's $Sk = \dfrac{3(\bar{X} - Q_2)}{s}$ is one line with mosaic functions, and the grouped version is the same line with a formula:

```r
Sk.all <- 3*(mean(~Days, data=quine) - median(~Days, data=quine))/sd(~Days, data=quine)
Sk.all
Sk.grouped <- 3*(mean(Days~Sex, data=quine) - median(Days~Sex, data=quine))/sd(Days~Sex, data=quine)
Sk.grouped
```
```text
[1] 1.007598
        F         M
0.9839306 0.7132158
```

| Group | $Sk$ |
|---|---|
| all | 1.01 |
| Sex = F | 0.98 |
| Sex = M | 0.71 |

By hand for the whole sample: $3(16.4589 - 11)/16.25322 = 3(5.4589)/16.25322 = 1.0076$: **highly skewed right** ($Sk > 1$). Both sexes are skewed right, girls (0.98) slightly more than boys (0.71), neither past 1 on its own. The grouped `mean`, `median` and `sd` all return vectors named `F` and `M`, so R does the arithmetic element by element and keeps the names.

## Histograms: `hist()` versus `histogram()`

Lab 1 drew the Cherry Blossom race times with base R's `hist()`:

```r
data(TenMileRace)
hist( TenMileRace$net,
      breaks=seq(2800, 10600, by=200),
      right = FALSE,
      col="pink",
      xlab="net (seconds)",
      main=paste0("Cherry Blossom Race (n = ", nrow(TenMileRace), ")"))
```

The mosaic way is `histogram()` with a formula; `type="count"` puts frequencies on the vertical axis (the default is density):

```r
histogram( ~net, data=TenMileRace,
           type="count",
           breaks=seq(2800, 10600, by=200),
           right = FALSE,
           col="pink",
           xlab="net (seconds)",
           main=paste0("Cherry Blossom Race (n = ", nrow(TenMileRace), ")"))
```

Two idioms:

- `paste0(...)` glues strings and numbers with no separator, so the title reads `Cherry Blossom Race (n = 8636)` and updates with the data. "Without hard-coding" $n$ means `nrow(df)` inside `paste0`, never typing 146.
- `breaks=seq(lo, hi, by=w)` sets the class limits and `right = FALSE` makes each class $[\text{lower}, \text{upper})$, as in the histogram lesson.

### Task 5: histogram of `Days`

Width 5 from zero, $n$ in the title, the colour "coral" as a hex RGB code:

```r
histogram(~Days, data=quine,
          type="count",
          col="#FF7256",
          breaks=seq(0, 85, by=5),
          main=paste0("Days absent (n = ", nrow(quine), ")"))
```

`"#FF7256"` is red FF, green 72, blue 56. The tallest bars are at 0 to 15 days and the bars trail off to 80. The instructor's answer: **the long right tail is consistent with the high skewness ($Sk = 1.01$) for the entire sample.**

## Box plots: `boxplot()` versus `bwplot()`

Base R, horizontal:

```r
boxplot( TenMileRace$net, horizontal = TRUE,
         xlab="net time (sec)",
         main="Cherry Blossom Race times")
```

### Task 6: `bwplot()` of `Days`

```r
bwplot(~Days, data=quine, horizontal=TRUE,
       xlab="Days Absent",
       main=paste0("Box plot of Days Absent (n =", nrow(quine), ")"))
```

`bwplot` ("box-and-whisker plot") draws the same five-number summary as `boxplot`, with a **dot for the median** instead of a line and dashed whiskers. The box sits at 5 to 22.75, the whiskers stop near 0 and 48, and open circles run out to 81: the outliers.

### Task 7: how many outliers?

Unit 1's fence rule with mosaic's `quantile()` and `prob=`:

```r
Q1 <- quantile(~Days, data=quine, prob=0.25)
Q3 <- quantile(~Days, data=quine, prob=0.75)
lower.fence <- Q1 - 1.5*(Q3 - Q1)
upper.fence <- Q3 + 1.5*(Q3 - Q1)

is.outlier <- (quine$Days > upper.fence) |
              (quine$Days < lower.fence)

sum(is.outlier)
```
```text
[1] 8
```

By hand: $IQR = 22.75 - 5 = 17.75$, $1.5 \times IQR = 26.625$, lower fence $= 5 - 26.625 = -21.625$ (unreachable, since days cannot be negative), upper fence $= 22.75 + 26.625 = 49.375$. Eight children exceed it: 53, 53, 54, 57, 60, 67, 69 and 81.

Two idioms: `|` is OR applied to every row at once, so `is.outlier` is one `TRUE`/`FALSE` per child, and `sum()` of a logical vector **counts the `TRUE`s** (R treats `TRUE` as 1 and `FALSE` as 0).

## Comparing groups

```r
favstats(Days~Sex, data=quine)
```
```text
  Sex min   Q1 median    Q3 max     mean       sd  n missing
1   F   0 5.00     10 20.25  81 15.22500 15.93100 80       0
2   M   0 5.25     14 27.00  69 17.95455 16.63401 66       0
```

The instructor's three observations:

- There were both boys and girls with **perfect attendance** (zero days of absence): both minimums are 0.
- At each quartile ($Q_1$, $Q_2$, $Q_3$) boys had **more** absences than girls: 5.25 vs 5, 14 vs 10, 27 vs 20.25.
- However, the child with the **most** absences was female: max 81 vs 69.

Compare the same column across rows, and do not let one extreme value (81) override the quartiles.

### Task 8: grouped by ethnicity

```r
bwplot( Days~Eth, data=quine)
favstats(Days~Eth, data=quine)
```
```text
  Eth min Q1 median Q3 max     mean       sd  n missing
1   A   0  6     15 32  81 21.23188 17.71851 69       0
2   N   0  4      7 16  69 12.18182 13.56051 77       0
```

```widget
group-stats
{ "by": "Eth" }
```

`bwplot(Days~Eth)` draws one box per level of `Eth`, side by side. The solutions' two observations:

1. Aboriginal students tended to have more days absent, based on the median (15 vs 7) and the mean (21.2 vs 12.2).
2. Aboriginal students had greater variability in days absent (sd 17.7 vs 13.6, and a wider box: IQR 26 vs 12).

## Comparisons with multiple factors

Group by two categorical variables with `+`; R names each combination `Eth.Sex`:

```r
mean(Days~Eth+Sex, data=quine)
```
```text
     A.F      N.F      A.M      N.M
20.92105 10.07143 21.61290 14.71429
```

Aboriginal girls average 20.9 days, non-Aboriginal girls 10.1, Aboriginal boys 21.6, non-Aboriginal boys 14.7. Ethnicity moves the mean by about 10 days, sex by a few.

```widget
group-stats
{ "by": ["Eth", "Sex"] }
```

### Task 9: which group is most (and least) consistent?

"Relatively consistent" is Unit 1's coefficient of variation, $CV = s/\bar{X}$; smaller is more consistent. The solution computes every group at once and lets `which.min`/`which.max` pick:

```r
CV.grouped <- sd(Days~Eth+Sex, data=quine) /
              mean(Days~Eth+Sex, data=quine)

sprintf("The most consistent group is %s.",
        names(which.min( CV.grouped )))
sprintf("The least consistent group is %s.",
        names(which.max( CV.grouped )))
```
```text
[1] "The most consistent group is A.M."
[1] "The least consistent group is N.M."
```

The CVs are roughly A.F 0.94, A.M 0.71, N.F 0.89, N.M 1.18: Aboriginal boys are the most consistent, non-Aboriginal boys the least (sd 17.4 on a mean of only 14.7). `which.min` gives the position of the smallest element, `names()` its label, and `sprintf` drops it into the sentence at `%s`.

:::warn The task said Age + Sex
Task 9 asks for `Age` and `Sex`, but the posted solution groups by `Eth` and `Sex`. Redoing it as written means `Days~Age+Sex` in both formulas (eight groups, `F0.F` to `F3.M`); the method is identical.
:::

## Percentiles: `quantile()` and `probs=`

With no second argument `quantile()` returns the quartiles, the five-number summary:

```r
quantile(~Days, data=quine)
```
```text
   0%   25%   50%   75%  100%
 0.00  5.00 11.00 22.75 81.00
```

Any $P_k$ comes from `probs=` with $k$ as a decimal. The 90th percentile:

```r
quantile(~Days, probs=0.9, data=quine)
```
```text
90%
 40
```

Ninety percent of children were absent 40 days or fewer. Several at once, as a vector or a sequence:

```r
quantile(~Days, probs=c(0.1, 0.9), data=quine)
quantile(~Days, probs=seq(0.1,0.9, by=0.1), data=quine)
```
```text
10% 90%
  2  40
10% 20% 30% 40% 50% 60% 70% 80% 90%
  2   5   5   7  11  14  20  27  40
```

$P_{20} = P_{30} = 5$: so many children have exactly 5 days that two percentiles land on the same value. Percentiles of a discrete variable repeat.

### Task 10: percentiles by group

Add a grouping variable (mosaic accepts `prob` or `probs`):

```r
quantile(Days~Lrn, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))
```
```text
  Lrn 20% 40%  60% 80%
1  AL   5 8.8 16.0  27
2  SL   5 6.0 13.2  28
```

Learner status makes little difference: the 20th percentiles are identical (5 and 5) and the 80th almost so (27 and 28). By `Sex` and by `Eth`:

```r
quantile(Days~Sex, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))
quantile(Days~Eth, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))
```
```text
  Sex 20%  40% 60%  80%
1   F   5  6.6  13 23.2
2   M   5 10.0  16 30.0
  Eth 20% 40%  60%  80%
1   A   6  13 20.0 36.8
2   N   3   5 10.6 19.6
```

The instructor's answer: **`Eth` is the categorical variable that leads to the greatest differences**, about twice as many days at each percentile (6 vs 3, 13 vs 5, 20 vs 10.6, 36.8 vs 19.6). `Sex` and `Lrn` barely move the percentiles.

## Percentile rank: the other direction

`quantile()` goes from a percentage to a value. `percent_rank()` (from `dplyr`: no formula, just the column) goes from a value to its percentage:

```r
head( percent_rank(quine$Days) )
```
```text
[1] 0.08965517 0.47586207 0.55862069 0.17931034 0.17931034 0.53793103
```

The first child (2 days) is at the 8.97th percentile: 13 of the other 145 children have fewer days, $13/145 = 0.0897$. Rankings are usually quoted as whole numbers:

```r
head( round(100*percent_rank(quine$Days) ))
```
```text
[1]  9 48 56 18 18 54
```

The first student was absent more often than 9% of all students; the third (15 days) more often than 56%.

### Task 11: percentile ranks for one subgroup

A logical vector that is `TRUE` for male `F0` students, square brackets to keep only those ranks, `cbind()` to print them as a column:

```r
is.F0.Male <- (quine$Sex=="M") & (quine$Age=="F0")
cbind(round(100*percent_rank( quine$Days )[is.F0.Male]))
```
```text
      [,1]
 [1,]    9
 [2,]   48
 [3,]   56
 [4,]   18
 [5,]   18
 [6,]   54
 [7,]   70
 [8,]   72
 [9,]   31
[10,]   66
[11,]   99
[12,]    0
[13,]    0
[14,]    9
[15,]   37
[16,]   48
[17,]   52
```

`&` is AND, row by row; `x[logical]` keeps the elements where the vector is `TRUE`; `cbind` ("column bind") makes a one-column matrix that prints vertically. Seventeen boys are in form F0; one (rank 99) is near the top of the school for absences and two (rank 0) had perfect attendance.

### Subset by percentile rank

The children above the 75th percentile:

```r
subset( quine, percent_rank(Days) > 0.75)
```
```text
    Eth Sex Age Lrn Days
15    A   M  F2  SL   32
16    A   M  F2  SL   53
17    A   M  F2  SL   57
...
146   N   F  F3  AL   37
```

`subset(df, condition)` keeps the rows where the condition is `TRUE`, and inside it columns are named without `quine$`. Thirty-seven rows come back, most of them `A` in `Eth`.

### Task 12: who is in the bottom quarter?

```r
P25.students <- subset( quine, percent_rank( Days ) < 0.25 )
round(prop.table( table(P25.students$Sex )),3)
```
```text
    F     M
0.622 0.378
```

`table()` counts each sex among the low-absence children and `prop.table()` divides by the total ($\hat{p}$ per category). Girls are 62.2% of the quarter with the fewest absences, against 80 of 146 (54.8%) overall.

## Z-scores, Chebyshev's theorem and the empirical rule

`scale()` computes $Z = (X - \bar{X})/s$ for every element of a vector:

```r
head( scale( quine$Days ) )
```
```text
           [,1]
[1,] -0.8896023
[2,] -0.3358659
[3,] -0.1512872
[4,] -0.7050235
[5,] -0.7050235
[6,] -0.2128134
```

The first child (2 days) is 0.89 standard deviations **below** the mean: $(2 - 16.4589)/16.25322 = -0.8896$.

### Task 13: how many are far from the mean?

Children at least 1, 2 and 3 standard deviations from the mean, above or below:

```r
Z.scores <- scale( quine$Days )
sum(abs(Z.scores) > 1)
sum(abs(Z.scores) > 2)
sum(abs(Z.scores) > 3)
```
```text
[1] 32
[1] 8
[1] 3
```

`abs()` drops the sign so "above or below" is one comparison, and `sum()` counts the `TRUE`s: 32, 8 and 3 children. Eight is also the outlier count from Task 7; they agree here, but **outlier and unusual are different definitions** (Unit 1).

### Task 14: does the data obey Chebyshev? The empirical rule?

Fractions **within** $\pm k$ sd:

```r
n.students <- nrow(quine)
p1 <- sum(abs(Z.scores) <= 1) / n.students
p2 <- sum(abs(Z.scores) <= 2) / n.students
p3 <- sum(abs(Z.scores) <= 3) / n.students

#Chebyshev's Theorem says:
p1 >= (1 - 1/1^2)
p2 >= (1 - 1/2^2)
p3 >= (1 - 1/3^2)
```
```text
[1] TRUE
[1] TRUE
[1] TRUE
```

```r
#Empirical Rule predicts 0.68, 0.95, and 0.997
p1 # too large
p2 # pretty close
p3 # too low
```
```text
[1] 0.7808219
[1] 0.9452055
[1] 0.9794521
```

| $k$ | fraction within $\pm k\,s$ | Chebyshev: at least $1 - 1/k^2$ | empirical rule |
|---|---|---|---|
| 1 | 0.781 | 0 | 0.68 (too large) |
| 2 | 0.945 | 0.75 | 0.95 (pretty close) |
| 3 | 0.979 | 0.889 | 0.997 (too low) |

Chebyshev's theorem holds, as it must for any data set. The empirical rule fails at $k = 1$ and $k = 3$. The instructor's answer: **the empirical rule does not hold for `Days`, since it is not a normally distributed variable. It cannot be, since it is significantly skewed, as shown by $Sk$ earlier.** A right-skewed variable piles up near the mean on the left (more than 68% within one sd) and then has a long tail (more than 0.3% beyond three sd).

```quiz
[
  {
    "q": "In `favstats(Days~Lrn, data=quine)`, what does the formula `Days~Lrn` mean?",
    "options": ["Days divided by Lrn", "Days, grouped by the levels of Lrn (one row of statistics per learner type)", "The correlation between Days and Lrn", "Days is approximately equal to Lrn"],
    "answer": 1,
    "explain": "Read `~` as 'in terms of': the numerical variable on the left, summarized separately for each level of the categorical variable on the right. `~Days` alone means 'just Days'."
  },
  {
    "q": "`summary(quine$Days)` prints `0.00 5.00 11.00 16.46 22.75 81.00`. What is $Q_3$?",
    "type": "numeric",
    "answer": 22.75,
    "tolerance": 0.01,
    "explain": "The order is Min, 1st Qu., Median, Mean, 3rd Qu., Max. The mean (16.46) sits in the middle of the line; $Q_3$ is the fifth number, 22.75."
  },
  {
    "q": "Using $\\bar{X} = 16.4589$, $Q_2 = 11$ and $s = 16.25322$, compute Pearson's $Sk$ for `Days` (2 decimals).",
    "type": "numeric",
    "answer": 1.01,
    "tolerance": 0.02,
    "explain": "$Sk = 3(16.4589 - 11)/16.25322 = 16.3767/16.25322 = 1.0076 \\approx 1.01$: highly skewed right."
  },
  {
    "q": "$Q_1 = 5$ and $Q_3 = 22.75$ for `Days`. What is the upper fence for outliers? (3 decimals)",
    "type": "numeric",
    "answer": 49.375,
    "tolerance": 0.01,
    "explain": "$IQR = 17.75$, $1.5 \\times IQR = 26.625$, upper fence $= 22.75 + 26.625 = 49.375$. Eight children exceed it."
  },
  {
    "q": "What does `sum(is.outlier)` return when `is.outlier` is a logical vector?",
    "options": ["The sum of the outlying Days values", "The number of TRUE values, i.e. how many outliers there are", "TRUE if there is at least one outlier", "An error, because you cannot sum logicals"],
    "answer": 1,
    "explain": "R coerces TRUE to 1 and FALSE to 0, so summing a logical vector counts how many elements satisfy the condition: 8 here."
  },
  {
    "q": "`favstats(Days~Sex)` gives medians F 10, M 14 and maxima F 81, M 69. Which statement matches the instructor's reading?",
    "options": ["Girls have more absences than boys at every quartile", "Boys have more absences at each quartile, but the single most-absent child was a girl", "Boys and girls are identical", "The maximum shows boys are absent more overall"],
    "answer": 1,
    "explain": "Compare the same column across rows: boys are higher at $Q_1$, $Q_2$ and $Q_3$; the one extreme value (81) belongs to a girl and does not change the quartile comparison."
  },
  {
    "q": "`quantile(~Days, probs=0.9, data=quine)` returns 40. Interpret it.",
    "options": ["40% of children were absent 90 days or more", "90% of children were absent 40 days or fewer", "The average child was absent 40 days", "40 children were absent more than 90% of the time"],
    "answer": 1,
    "explain": "$P_{90} = 40$ separates the lower 90% from the upper 10%: nine tenths of the children have Days $\\le 40$."
  },
  {
    "q": "Which categorical variable produced the largest differences in `Days` at the 20th, 40th, 60th and 80th percentiles?",
    "type": "text",
    "answer": ["Eth", "ethnicity", "ethnic background"],
    "explain": "By Eth the percentiles were A 6, 13, 20, 36.8 versus N 3, 5, 10.6, 19.6: about twice as many days at each level. Sex and Lrn barely differed."
  },
  {
    "q": "`round(100*percent_rank(quine$Days))` gives 9 for the first child (2 days absent). What does 9 mean?",
    "options": ["The child was absent 9 days", "The child's Days value is larger than about 9% of all Days values", "9% of children were absent exactly 2 days", "The child is in the top 9% for absences"],
    "answer": 1,
    "explain": "A percentile rank is the percentage of values below this one: 13 of the other 145 children had fewer days, $13/145 = 0.0897 \\approx 9\\%$."
  },
  {
    "q": "The first value of `scale(quine$Days)` is $-0.8896$. This means the first child's Days value is about 0.89 standard deviations **above** the mean.",
    "type": "tf",
    "answer": false,
    "explain": "`scale()` returns $Z = (X - \\bar{X})/s$; a negative Z is below the mean: $(2 - 16.46)/16.25 = -0.89$."
  },
  {
    "q": "For `Days`, the fraction within $\\pm 1$ sd is 0.781, within $\\pm 2$ sd is 0.945, within $\\pm 3$ sd is 0.979. Which is true?",
    "options": ["Chebyshev's theorem is violated at k = 3", "Both Chebyshev's theorem and the empirical rule are satisfied", "Chebyshev's theorem is satisfied but the empirical rule is not, because Days is skewed rather than bell-shaped", "The empirical rule is satisfied but Chebyshev is not"],
    "answer": 2,
    "explain": "Chebyshev needs at least 0, 0.75 and 0.889: all true. The empirical rule predicts 0.68, 0.95 and 0.997: 0.781 is too large and 0.979 too low. The rule only applies to approximately normal data, and $Sk = 1.01$ says Days is far from normal."
  },
  {
    "type": "match",
    "q": "Match each R call from Lab 2 to what it computes.",
    "pairs": [
      ["`favstats(~Days, data=quine)`", "min, quartiles, max, mean, sd, n and missing count for Days"],
      ["`mean(Days~Eth+Sex, data=quine)`", "one mean per combination of ethnicity and sex (A.F, N.F, A.M, N.M)"],
      ["`quantile(~Days, probs=0.9, data=quine)`", "the value with 90% of children at or below it"],
      ["`percent_rank(quine$Days)`", "for each child, the fraction of children with fewer days"],
      ["`scale(quine$Days)`", "the Z-score of every Days value"],
      ["`prop.table(table(P25.students$Sex))`", "the proportion of each sex within a subset"]
    ],
    "explain": "quantile goes from a percentage to a value; percent_rank goes from a value to a percentage. favstats is summary() plus sd and n; scale() standardizes; prop.table turns counts into proportions."
  }
]
```
