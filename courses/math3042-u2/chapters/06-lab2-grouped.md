---
title: favstats, model formulas, percentiles, Z-scores
minutes: 26
---

Lab 2 is where Unit 1's numbers (mean, sd, quartiles, fences, $Sk$, $Z$) get applied to a **real data frame, one group at a time**. The lab itself is not collected, but the instructor says it prepares you for the quizzes, and the R idioms in it (model formulas, `favstats`, `quantile(probs=)`, `percent_rank`, `scale`) are exactly what a "what does this R code compute?" question looks like. This lesson walks the whole notebook, task by task, with the instructor's own output.

## The data: `quine`

The lab analyzes school absences in Walgett, New South Wales, Australia. The data set is built into the `MASS` package; the lab also needs `mosaic` (grouped statistics) and `dplyr` (percent ranks):

```r
library(MASS)
library(mosaic)
library(dplyr)
data(quine)
View(quine)
```

`View()` opens the spreadsheet-style viewer in RStudio. Each row is **one child**. There is one numerical variable and four categorical ones:

| Column | Type | Values |
|---|---|---|
| `Days` | numerical | number of days the child was absent |
| `Sex` | categorical | `"F"` or `"M"` |
| `Eth` | categorical | ethnic background: Aboriginal `"A"` or not `"N"` |
| `Age` | categorical | age group (school form): `"F0"`, `"F1"`, `"F2"`, `"F3"` |
| `Lrn` | categorical | learner status: average `"AL"` or slow `"SL"` |

There are $n = 146$ children (`nrow(quine)` returns 146). Everything in the lab is a question of the form "summarize `Days`, for everyone or for one group of children."

## `summary()`: six numbers in one call

Base R's `summary()` gives the five-number summary plus the mean:

```r
X.vals <- c(9, 10, 8, 10, 11, 12, 11, 11)
summary( X.vals )
```
```text
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   8.00    9.75   10.50   10.25   11.00   12.00
```

Read it left to right: minimum, $Q_1$, median ($Q_2$), mean $\bar{X}$, $Q_3$, maximum. Note the order: the **mean sits in the middle of the line**, between the median and $Q_3$, which trips people up when copying numbers into a table. `summary()` does not report the standard deviation; you need a separate `sd()` call.

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

The lab's table, rounded to one decimal:

| Statistic | Value |
|---|---|
| $\bar{X}$ | 16.5 |
| $s$ | 16.3 |
| min | 0.0 |
| $Q_1$ | 5.0 |
| $Q_2$ | 11.0 |
| $Q_3$ | 22.8 |
| max | 81.0 |

Two things already stand out. The mean (16.5) is well above the median (11.0), so the distribution is skewed right. And $s \approx \bar{X}$, so relative variation is huge: some children are almost never absent, a few are absent for months.

## `favstats()` and the model formula

The `mosaic` package's `favstats()` is `summary()` plus the sd, the count and a missing-value count, but its syntax is different:

```r
favstats(~Days, data=quine)
```
```text
 min Q1 median    Q3 max    mean       sd   n missing
   0  5     11 22.75  81 16.4589 16.25322 146       0
```

The first argument `~Days` is a **model formula**. Read `~` as "in terms of". `~Days` on its own just says "use the `Days` variable"; `data=quine` says which data frame it lives in. This looks like extra typing until you want statistics **per group**:

```r
favstats(Days~Lrn, data=quine)
```
```text
  Lrn min Q1 median   Q3 max     mean       sd  n missing
1  AL   0  5     12 22.5  69 15.81928 13.91012 83       0
2  SL   0  5     10 22.5  81 17.30159 18.99035 63       0
```

`Days~Lrn` reads "Days, grouped by Lrn": one row of statistics per learner type. The instructor's conclusion: "slow" learners had a greater mean days absent (17.3 days) than "average" learners (15.8 days).

:::tip Reading a formula
- `~X` : just the variable `X`.
- `Y~G` : the numerical variable `Y`, one result per level of the categorical variable `G`.
- `Y~G1+G2` : one result per combination of two categorical variables (you will see this below).

The same `~` appears in `boxplot(extra~group, data=sleep)` from Unit 1. It is one idea used everywhere in R.
:::

```widget
group-stats
{ "by": "Sex" }
```

The widget above is the whole lab in one place: pick a grouping and it prints the `favstats` table, draws one boxplot per group on a shared axis, computes grouped percentiles, and runs the Z-score check from the end of the lab. Use it to confirm every number below.

### The mosaic overrides

`mosaic` also teaches the familiar functions to accept formulas, so all of these work with `~X` or `X~G` and `data=`:

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

`mean(Days~Sex)` returns one mean per level of `Sex`, as a named vector; `round(..., 1)` rounds every element to one decimal. Boys were absent about three days more on average.

### Task 4: Pearson's skewness, overall and by sex

Unit 1's formula is $Sk = \dfrac{3(\bar{X} - Q_2)}{s}$. With mosaic functions it is one line, and the grouped version is the same line with a formula:

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

Check the whole-sample number by hand: $3(16.4589 - 11)/16.25322 = 3(5.4589)/16.25322 = 1.0076$. The whole sample is **highly skewed right** ($Sk > 1$). Both sexes are skewed right; girls slightly more (0.98) than boys (0.71), and neither is quite past the "highly skewed" line of 1 on its own. Because the grouped `mean`, `median` and `sd` all return vectors with the same names `F` and `M`, R does the arithmetic element by element, and the result keeps the names.

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

The mosaic way is `histogram()` with a formula. `type="count"` asks for frequencies on the vertical axis (the default is density):

```r
histogram( ~net, data=TenMileRace,
           type="count",
           breaks=seq(2800, 10600, by=200),
           right = FALSE,
           col="pink",
           xlab="net (seconds)",
           main=paste0("Cherry Blossom Race (n = ", nrow(TenMileRace), ")"))
```

Two idioms to know:

- `paste0(...)` glues strings and numbers together with no separator, so the title reads `Cherry Blossom Race (n = 8636)` and updates itself if the data changes. The lab keeps asking for $n$ "without hard-coding": that means `nrow(df)` inside `paste0`, never typing 146.
- `breaks=seq(lo, hi, by=w)` sets the class limits, and `right = FALSE` makes each class $[\text{lower}, \text{upper})$, the same rule as the histogram lesson.

### Task 5: histogram of `Days`

Classes of width 5 starting from zero, $n$ in the title, and the colour "coral" as a hex RGB code:

```r
histogram(~Days, data=quine,
          type="count",
          col="#FF7256",
          breaks=seq(0, 85, by=5),
          main=paste0("Days absent (n = ", nrow(quine), ")"))
```

`"#FF7256"` is red FF, green 72, blue 56 in hexadecimal: coral. The tallest bars are at 0 to 15 days and the bars trail off all the way to 80. The instructor's one-sentence answer: **the long right tail is consistent with the high skewness ($Sk = 1.01$) for the entire sample.** A picture and a number agreeing is the point of Unit 2.

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

`bwplot` ("box-and-whisker plot") draws the same five-number summary as `boxplot`, but its box has a **dot for the median** instead of a line, and its whiskers are dashed. On the `Days` plot the box sits at 5 to 22.75, the whiskers stop near 0 and 48, and a string of open circles runs out to 81: those are the outliers.

### Task 7: how many outliers?

Same fence rule as Unit 1, written with mosaic's `quantile()` and the `prob=` argument:

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

By hand: $IQR = 22.75 - 5 = 17.75$, so $1.5 \times IQR = 26.625$. Lower fence $= 5 - 26.625 = -21.625$ (no child can be below it, since days cannot be negative). Upper fence $= 22.75 + 26.625 = 49.375$. Eight children were absent more than 49.375 days: 53, 53, 54, 57, 60, 67, 69 and 81.

The code has two idioms worth remembering. `|` is OR applied to every row at once, so `is.outlier` is a logical vector with one `TRUE`/`FALSE` per child. And `sum()` of a logical vector **counts the `TRUE`s**, because R treats `TRUE` as 1 and `FALSE` as 0.

## Comparing groups

Statistics for `Days` grouped by `Sex`:

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

That is how to read a grouped table: compare the same column across the rows, and do not let one extreme value (81) override the quartiles.

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

`bwplot(Days~Eth)` puts the two boxes side by side, vertically, one per level of `Eth`. The two observations from the solutions:

1. Aboriginal students tended to have more days absent, based on the median (15 vs 7) and the mean (21.2 vs 12.2).
2. Aboriginal students had greater variability in days absent (sd 17.7 vs 13.6, and a wider box: IQR 26 vs 12).

## Comparisons with multiple factors

Group by two categorical variables with `+` in the formula. R names each combination `Eth.Sex`:

```r
mean(Days~Eth+Sex, data=quine)
```
```text
     A.F      N.F      A.M      N.M
20.92105 10.07143 21.61290 14.71429
```

Four groups: Aboriginal girls average 20.9 days, non-Aboriginal girls 10.1, Aboriginal boys 21.6, non-Aboriginal boys 14.7. Ethnicity moves the mean by about 10 days; sex moves it by only a few.

```widget
group-stats
{ "by": ["Eth", "Sex"] }
```

### Task 9: which group is most (and least) consistent?

"Relatively consistent" is Unit 1's coefficient of variation, $CV = s/\bar{X}$, and a smaller CV means more consistent. The solution computes it for every group at once and lets `which.min`/`which.max` pick:

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

The CVs are roughly A.F 0.94, A.M 0.71, N.F 0.89, N.M 1.18. Aboriginal boys are the most consistent group (their sd is the smallest relative to their mean); non-Aboriginal boys the least (sd 17.4 on a mean of only 14.7). `which.min` returns the position of the smallest element; `names()` turns that into the group label; `sprintf` drops it into the sentence at `%s`.

:::warn The task said Age + Sex
Task 9 asks for groups by `Age` and `Sex`, but the posted solution groups by `Eth` and `Sex`. If you redo it as written, change both formulas to `Days~Age+Sex` (eight groups: `F0.F`, `F1.F`, ..., `F3.M`). The method is identical; only the labels change.
:::

## Percentiles: `quantile()` and `probs=`

With no second argument, `quantile()` returns the quartiles, which are also the five-number summary:

```r
quantile(~Days, data=quine)
```
```text
   0%   25%   50%   75%  100%
 0.00  5.00 11.00 22.75 81.00
```

Any percentile $P_k$ comes from `probs=` with $k$ written as a decimal. The 90th percentile of days absent:

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

Notice $P_{20} = P_{30} = 5$: so many children have exactly 5 days that two percentiles land on the same value. Percentiles of a discrete variable repeat.

### Task 10: percentiles by group

Add a grouping variable and the `prob=` argument (mosaic accepts `prob` or `probs`):

```r
quantile(Days~Lrn, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))
```
```text
  Lrn 20% 40%  60% 80%
1  AL   5 8.8 16.0  27
2  SL   5 6.0 13.2  28
```

Learner status makes a fairly small difference at every percentile: the 20th percentiles are identical (5 and 5) and the 80th almost so (27 and 28). Now the same by `Sex` and by `Eth`:

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

The instructor's answer: **`Eth` is the categorical variable that leads to the greatest differences**; it is associated with about twice as many days of absence at each percentile level (6 vs 3, 13 vs 5, 20 vs 10.6, 36.8 vs 19.6). `Sex` and `Lrn` barely move the percentiles.

## Percentile rank: the other direction

`quantile()` goes from a percentage to a value. `percent_rank()` (from `dplyr`, so no formula, just the column) goes from a value to its percentage:

```r
head( percent_rank(quine$Days) )
```
```text
[1] 0.08965517 0.47586207 0.55862069 0.17931034 0.17931034 0.53793103
```

The first child in the data frame was absent 2 days, and that sits at the 8.965517th percentile: it is larger than about 8.97% of all `Days` values (13 of the other 145 children have fewer days: $13/145 = 0.0897$). Percentile rankings are usually quoted as whole numbers:

```r
head( round(100*percent_rank(quine$Days) ))
```
```text
[1]  9 48 56 18 18 54
```

So the first student was absent more often than 9% of all students; the third one (15 days) more often than 56%.

### Task 11: percentile ranks for one subgroup

Build a logical vector that is `TRUE` for male `F0` students, use it in square brackets to keep only those ranks, and `cbind()` to print them as a column:

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

`&` is AND, row by row. `x[logical]` keeps the elements where the logical vector is `TRUE` (logical indexing). `cbind` ("column bind") makes a one-column matrix, which prints vertically instead of wrapping across the console. Seventeen boys are in form F0; one of them (rank 99) is near the top of the whole school for absences and two (rank 0) had perfect attendance.

### Subset by percentile rank

To pull out the children above the 75th percentile:

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

`subset(df, condition)` keeps the rows where the condition is `TRUE`; inside `subset` you can name columns directly, without `quine$`. Thirty-seven rows come back, and most of them are `A` in the `Eth` column, which matches everything above.

### Task 12: who is in the bottom quarter?

```r
P25.students <- subset( quine, percent_rank( Days ) < 0.25 )
round(prop.table( table(P25.students$Sex )),3)
```
```text
    F     M
0.622 0.378
```

`table()` counts each sex among the low-absence children; `prop.table()` divides by the total to give proportions ($\hat{p}$ per category). Female students are by far the larger fraction (62.2%) of the 25% with the fewest absences, even though girls are only 80 of 146 (54.8%) overall.

## Z-scores, Chebyshev's theorem and the empirical rule

A $Z$-score says how many standard deviations a value is from the mean. `scale()` computes $Z = (X - \bar{X})/s$ for every element of a vector:

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

The first child (2 days) is 0.89 standard deviations **below** the mean: $(2 - 16.4589)/16.25322 = -0.8896$. Like a percentile rank, a $Z$-score locates one value relative to the rest.

### Task 13: how many are far from the mean?

Count the children at least 1, 2 and 3 standard deviations away (above or below):

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

`abs()` throws away the sign so "above or below" is one comparison, and `sum()` of the resulting logical vector counts the `TRUE`s. Thirty-two children are more than 1 sd out, eight more than 2 sd out, three more than 3 sd out. (Eight is also the number of outliers from Task 7; here they agree, but remember Unit 1's warning: **outlier and unusual are different definitions**.)

### Task 14: does the data obey Chebyshev? The empirical rule?

Convert the counts to fractions **within** $\pm k$ sd:

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

Chebyshev's theorem holds, as it must for any data set. The empirical rule fails at $k = 1$ and $k = 3$. The instructor's answer: **the empirical rule does not hold for `Days`, since it is not a normally distributed variable. It cannot be, since it is significantly skewed, as shown by $Sk$ earlier.** A right-skewed variable piles up close to the mean on the left (so more than 68% sit within one sd) and then has a long tail (so more than 0.3% sit beyond three sd).

:::quiz The pattern the quiz likes
Chebyshev is a guarantee for **any** distribution; the 68–95–99.7 rule is a prediction for **bell-shaped** distributions only. Real skewed data satisfies the first and breaks the second. If a question gives you $Sk = 1.01$ and asks whether the empirical rule applies, the answer is no, and the reason is the skewness.
:::

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
