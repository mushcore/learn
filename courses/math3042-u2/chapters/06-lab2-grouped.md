---
title: favstats, model formulas, percentiles, Z-scores
minutes: 24
---
<!-- facts: poe1.data.divine-chaos-allflame, poe1.data.divine-chaos-mirage, poe1.data.divine-chaos-keepers -->

Lab 2 applies Unit 1's statistics to a real data frame, one group at a time.

## The data: `quine`

School absences in Walgett, New South Wales, from `MASS`; `mosaic` gives grouped statistics and `dplyr` percent ranks:

```r
library(MASS)
library(mosaic)
library(dplyr)
data(quine)
View(quine)
```

Each of the $n = 146$ rows is **one child**: `Days` absent, plus the categories `Sex`, `Eth` (Aboriginal `"A"` or not `"N"`), `Age` (form `"F0"` to `"F3"`) and `Lrn` (average `"AL"` or slow `"SL"`).

## `summary()`

```r
X.vals <- c(9, 10, 8, 10, 11, 12, 11, 11)
summary( X.vals )
```
```text
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   8.00    9.75   10.50   10.25   11.00   12.00
```

The **mean sits in the middle**: minimum, $Q_1$, median, mean, $Q_3$, maximum. `sd()` is separate.

### Task 2: summary of `Days`

```r
summary(quine$Days)
sd(quine$Days)
```
```text
   Min. 1st Qu.  Median    Mean 3rd Qu.    Max.
   0.00    5.00   11.00   16.46   22.75   81.00
[1] 16.25322
```

$\bar{X} = 16.5$ is well above $Q_2 = 11.0$: skewed right.

## `favstats()` and the model formula

`favstats()` adds sd, $n$ and a missing count:

```r
favstats(~Days, data=quine)
```
```text
 min Q1 median    Q3 max    mean       sd   n missing
   0  5     11 22.75  81 16.4589 16.25322 146       0
```

`~Days` is a **model formula**, read "in terms of". With a variable on the left it gives statistics **per group**:

```r
favstats(Days~Lrn, data=quine)
```
```text
  Lrn min Q1 median   Q3 max     mean       sd  n missing
1  AL   0  5     12 22.5  69 15.81928 13.91012 83       0
2  SL   0  5     10 22.5  81 17.30159 18.99035 63       0
```

The instructor's conclusion: "slow" learners had a greater mean days absent (17.3) than "average" learners (15.8). `Y~G1+G2` gives one result per combination of two categorical variables.

```widget
group-stats
{ "by": "Sex" }
```

`mosaic` lets `mean`, `median`, `sd`, `IQR`, `quantile` and the rest take `~X` or `X~G` with `data=df`; `histogram()` and `bwplot()` are its `hist()` and `boxplot()`.

### Task 3: mean by sex

```r
round(mean(Days~Sex, data=quine), 1)
```
```text
   F    M
15.2 18.0
```

Boys were absent about three days more.

### Task 4: $Sk$ overall and by sex

Unit 1's $Sk = \dfrac{3(\bar{X} - Q_2)}{s}$, ungrouped and grouped:

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

By hand: $3(16.4589 - 11)/16.25322 = 1.0076$, **highly skewed right** ($Sk > 1$). Girls (0.98) are slightly more skewed than boys (0.71).

## Task 5: `histogram()` of `Days`

The mosaic histogram; `type="count"` puts frequencies on the vertical axis, and `paste0` builds the title from `nrow(quine)` so $n$ is never hard-coded:

```r
histogram(~Days, data=quine,
          type="count",
          col="#FF7256",
          breaks=seq(0, 85, by=5),
          main=paste0("Days absent (n = ", nrow(quine), ")"))
```

`"#FF7256"` is "coral" as a hex RGB code. The instructor's answer: **the long right tail is consistent with the high skewness ($Sk = 1.01$) for the entire sample.**

## Task 6: `bwplot()` of `Days`

```r
bwplot(~Days, data=quine, horizontal=TRUE,
       xlab="Days Absent",
       main=paste0("Box plot of Days Absent (n =", nrow(quine), ")"))
```

`bwplot` marks the median with a **dot**; the box is 5 to 22.75, the whiskers end at 0 and 48, and circles run out to 81.

### Task 7: how many outliers?

Unit 1's fence rule:

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

By hand: $IQR = 17.75$, lower fence $5 - 26.625 = -21.625$ (unreachable), upper fence $22.75 + 26.625 = 49.375$. Eight children exceed it: 53, 53, 54, 57, 60, 67, 69 and 81. `sum()` of a logical vector **counts the `TRUE`s**.

## Comparing groups

```r
favstats(Days~Sex, data=quine)
```
```text
  Sex min   Q1 median    Q3 max     mean       sd  n missing
1   F   0 5.00     10 20.25  81 15.22500 15.93100 80       0
2   M   0 5.25     14 27.00  69 17.95455 16.63401 66       0
```

Three observations: both sexes include **perfect attendance** (minimum 0); boys had **more** absences at each quartile (5.25 vs 5, 14 vs 10, 27 vs 20.25); yet the child with the **most** absences was female (81 vs 69).

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

Aboriginal students had more days absent (median 15 vs 7, mean 21.2 vs 12.2) and more variability (sd 17.7 vs 13.6, IQR 26 vs 12).

## Two factors

Group by two categorical variables with `+`; R names each combination `Eth.Sex`:

```r
mean(Days~Eth+Sex, data=quine)
```
```text
     A.F      N.F      A.M      N.M
20.92105 10.07143 21.61290 14.71429
```

Ethnicity moves the mean by about 10 days, sex by a few.

```widget
group-stats
{ "by": ["Eth", "Sex"] }
```

### Task 9: the most consistent group

Most consistent means smallest $CV = s/\bar{X}$:

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

The CVs are about A.F 0.94, A.M 0.71, N.F 0.89, N.M 1.18. `names(which.min(...))` labels the smallest. The task says `Age` and `Sex`; the posted solution uses `Eth` and `Sex`.

## Percentiles: `quantile()` and `probs=`

With no second argument `quantile()` returns the five-number summary:

```r
quantile(~Days, data=quine)
```
```text
   0%   25%   50%   75%  100%
 0.00  5.00 11.00 22.75 81.00
```

Any $P_k$ comes from `probs=`:

```r
quantile(~Days, probs=0.9, data=quine)
```
```text
90%
 40
```

Ninety percent were absent 40 days or fewer. Several at once:

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

$P_{20} = P_{30} = 5$: so many children have exactly 5 days that two percentiles coincide.

### Task 10: percentiles by group

With a grouping variable (mosaic accepts `prob` or `probs`):

```r
quantile(Days~Lrn, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))
```
```text
  Lrn 20% 40%  60% 80%
1  AL   5 8.8 16.0  27
2  SL   5 6.0 13.2  28
```

Learner status makes little difference. By `Sex` and by `Eth`:

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

The instructor's answer: **`Eth` is the categorical variable that leads to the greatest differences**, about twice as many days at each percentile.

## Percentile rank

`quantile()` goes from a percentage to a value; `dplyr`'s `percent_rank()` (no formula) goes from a value to its percentage:

```r
head( percent_rank(quine$Days) )
```
```text
[1] 0.08965517 0.47586207 0.55862069 0.17931034 0.17931034 0.53793103
```

The first child (2 days): 13 of the other 145 children have fewer days, $13/145 = 0.0897$. As whole numbers:

```r
head( round(100*percent_rank(quine$Days) ))
```
```text
[1]  9 48 56 18 18 54
```

The first child was absent more often than 9% of all students; the third (14 days), 56%.

### Task 11: ranks for one subgroup

Ranks of the male `F0` students only:

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

`&` is AND; `x[logical]` keeps the `TRUE` positions. Seventeen boys are in form F0; one (rank 99) is near the top for absences.

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

`subset()` keeps the rows where the condition is `TRUE`. Thirty-seven rows come back, 25 of them `A`.

### Task 12: the bottom quarter

```r
P25.students <- subset( quine, percent_rank( Days ) < 0.25 )
round(prop.table( table(P25.students$Sex )),3)
```
```text
    F     M
0.622 0.378
```

`prop.table()` turns the counts into proportions: girls are 62.2% of the bottom quarter, against 80 of 146 (54.8%) overall.

## Z-scores with `scale()`

`scale()` computes $Z = (X - \bar{X})/s$ for every element:

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

The first child: $(2 - 16.4589)/16.25322 = -0.8896$, 0.89 sd **below** the mean.

### Task 13: counts beyond k sd

Children more than 1, 2 and 3 sd from the mean:

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

`abs()` makes "above or below" one comparison. Eight matches Task 7's outlier count, but **outlier and unusual are different definitions** (Unit 1).

### Task 14: Chebyshev and the empirical rule

Fractions **within** $\pm k$ sd against Chebyshev's $1 - 1/k^2$ (0, 0.75, 0.889):

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

Chebyshev holds, as it must; the empirical rule misses at $k = 1$ and $3$: **the empirical rule does not hold for `Days`, since it is not a normally distributed variable. It cannot be, since it is significantly skewed, as shown by $Sk$ earlier.**

## favstats, fences and Z-scores for three leagues' Divine prices

poe.ninja's daily price of a Divine Orb, a high-value currency item, in Chaos Orbs covers all of Keepers (123 days) and Mirage (137) and the first 96 days of Allflame [PoE1, 3.27 Keepers, 3.28 Mirage and 3.29 Allflame Divine price series from poe.ninja, checked 2026-10-27]. `divine` stacks the three price columns unedited, one row per league-day, with `league` as the factor.

```quiz
[
  {"type": "fill", "q": "Fill the blank to get one row of statistics per league.", "code": "af <- read.csv(\"poe1-ninja-divine-chaos-allflame.csv\")\nke <- read.csv(\"poe1-ninja-divine-chaos-keepers.csv\")\nmi <- read.csv(\"poe1-ninja-divine-chaos-mirage.csv\")\ndivine <- data.frame(price = c(af$receive_value_chaos, ke$receive_value_chaos, mi$receive_value_chaos),\n                     league = rep(c(\"Allflame\", \"Keepers\", \"Mirage\"), times = c(96, 123, 137)))\nfavstats(price ~ ___, data=divine)\n##     league   min     Q1 median    Q3   max     mean        sd   n missing\n## 1 Allflame 75.90 193.30    300 350.0 400.0 268.9917  89.49155  96       0\n## 2  Keepers 44.85 142.15    150 176.5 271.3 157.7333  37.52127 123       0\n## 3   Mirage 36.30 274.70    368 500.0 612.0 379.6226 140.83837 137       0", "answer": ["league"], "explain": "`Y ~ G` gives the statistics of Y separately for each level of G: price in terms of league. The three rows come out in alphabetical order, Allflame, Keepers, Mirage, and n = 96 + 123 + 137 = 356 rows in all."},
  {"q": "From the Allflame row, compute Pearson's $Sk$. (2 decimals)", "type": "numeric", "answer": -1.04, "tolerance": 0.006, "explain": "$Sk = 3(\\bar{X} - Q_2)/s = 3(268.9917 - 300)/89.49155 = -93.0249/89.49155 = -1.0395$: highly skewed left. The cheap first weeks of the league pull the mean below the median."},
  {"q": "From the Keepers row, compute the upper fence. (3 decimals)", "type": "numeric", "answer": 228.025, "tolerance": 0.001, "explain": "$IQR = 176.5 - 142.15 = 34.35$; upper fence $= 176.5 + 1.5(34.35) = 176.5 + 51.525 = 228.025$ chaos. Keepers' maximum 271.3 is beyond it, so the box plot shows outliers on the right; the lower fence is $142.15 - 51.525 = 90.625$, above the minimum 44.85."},
  {"q": "Keepers' first day was priced at 44.85 chaos. Compute its Z-score within the Keepers league, as `scale()` on that league would. (2 decimals)", "type": "numeric", "answer": -3.01, "tolerance": 0.006, "explain": "$Z = (X - \\bar{X})/s = (44.85 - 157.7333)/37.52127 = -112.8833/37.52127 = -3.0085$: more than 3 sd below the Keepers mean, so unusual."},
  {"q": "`CV <- sd(price~league, data=divine)/mean(price~league, data=divine)`, then `names(which.min(CV))`. Which league is printed?", "type": "text", "answer": ["Keepers"], "explain": "$CV = s/\\bar{X}$: Allflame $89.49155/268.9917 = 0.333$, Keepers $37.52127/157.7333 = 0.238$, Mirage $140.83837/379.6226 = 0.371$. The smallest is Keepers, the most consistent league relative to its own price level."},
  {"q": "Side-by-side box plots of price by league: write the full mosaic command on paper, then type the name of the function you used.", "type": "text", "answer": ["bwplot", "boxplot"], "explain": "`library(mosaic)` then `bwplot(price ~ league, data=divine, main=paste0(\"Divine price by league (n = \", nrow(divine), \")\"))`. Base R's `boxplot(price ~ league, data=divine)` draws the same boxes."}
]
```

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
