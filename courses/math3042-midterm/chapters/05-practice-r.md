---
title: "Q7 to Q9: quantile, filter and bwplot; rhyper, dhyper, phyper; a simulation function"
minutes: 25
---
Ten of the practice paper's 46 marks are R written by hand. Each answer is a full, runnable line with real argument values, the `library()` call when a package is needed, `$` for a column and `data =` for a formula. Write every command on paper before you open the model answer.

## Q7 (4 marks). This question uses the data from the Gestation dataframe, which is part of the library mosaicData.

> Below is an excerpt of the help file for this data set.

```text
Data from the Child Health and Development Studies

Description
Birth weight, date, and gestational period collected as part of the Child Health and
Development Studies in 1961 and 1962. Information about the baby's parents — age,
education, height, weight, and whether the mother smoked is also recorded.

Usage
data(Gestation)

Format
A data frame with 1236 observations on the following variables.
id         identification number
date       birth date where 1096=January 1, 1961
gestation  length of gestation (in days)
wt         birth weight (in ounces)
parity     total number of previous pregnancies (including fetal deaths and still births)
sex        "male"
race       mother's race: "asian", "black", "mex", "mixed", or "white"
…
```

The excerpt is the only place the column names appear: `wt` for **birth weight**, `gestation` for the length of **gestation**, `race` for the mother's **race**. Copy them exactly; R is case-sensitive.

**a. [1]** Give an R command (or commands) that would output the 20th percentile birth weight.

```quiz
[
  {
    "q": "**Q7a.** Write the full command on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["quantile"],
    "explain": "`quantile(Gestation$wt, 0.20)`. The data frame, `$`, the column, then the proportion 0.20 (not 20). The R sheet lists `quantile` under Maths functions but gives no arguments."
  },
  {
    "type": "fill",
    "q": "Fill the slot: the 20th percentile of birth weight.",
    "code": "quantile(Gestation$wt, ___)",
    "answer": ["0.20", "0.2", ".2", ".20"],
    "explain": "The second argument is `probs`, a proportion between 0 and 1. `quantile(Gestation$wt, 20)` is an error: 20 is outside [0, 1]."
  }
]
```

```r
quantile(Gestation$wt, 0.20)
```

The column is reached with `$`. A bare `quantile(wt, 0.20)` fails because no object called `wt` exists outside the data frame.

**b. [1]** We define premature births as those born before 250 days of gestation. Give an R command (or commands) that would create a dataset consisting of all of the data for only those babies with a gestation period of less than 250 days.

```quiz
[
  {
    "q": "**Q7b.** Write the full command (or commands) on paper, then type the name of the function that keeps the rows.",
    "type": "text",
    "answer": ["filter", "subset"],
    "explain": "`library(dplyr)` then `premature_babies <- filter(Gestation, gestation < 250)`. \"Create a dataset\" means assign the result to a name. Base R's `subset(Gestation, gestation < 250)` is also a full answer, as is the indexing form `Gestation[Gestation$gestation < 250, ]`."
  },
  {
    "type": "fill",
    "q": "Fill the comparison: babies born before 250 days.",
    "code": "premature_babies <- filter(Gestation, gestation ___ 250)",
    "answer": ["<"],
    "explain": "\"Less than 250 days\" is `<`, not `<=`. Inside `filter`, the column is named bare (no `Gestation$`), because `filter` looks it up in the data frame given first."
  }
]
```

```r
library(dplyr)
premature_babies <- filter(Gestation, gestation < 250)
```

`filter` keeps whole rows, so every column comes along. The other accepted forms:

```r
premature_babies <- subset(Gestation, gestation < 250)
premature_babies <- Gestation[Gestation$gestation < 250, ]
```

The comma inside the brackets matters: rows before it, all columns after it.

**c. [2]** Give an R command (or commands) that would create side-by-side boxplots of the birth weights, grouped by race of the mother.

```quiz
[
  {
    "q": "**Q7c.** Write the full command on paper, with a title and axis labels, then type the name of the plotting function you used.",
    "type": "text",
    "answer": ["bwplot", "boxplot"],
    "explain": "`library(mosaic)` then `bwplot(wt ~ race, data = Gestation, main = \"Boxplots of Birth Weights by Race\", xlab = \"Mother's Race\", ylab = \"Baby's Birth Weight (ounces)\")`. The formula is response `~` group: the numeric column on the left, the factor on the right. Base R's `boxplot(wt ~ race, data = Gestation, main = ..., xlab = ..., ylab = ...)` is also a full answer. The second mark is for the title and labels."
  },
  {
    "type": "fill",
    "q": "Fill the left side of the formula: boxplots of birth weight grouped by race.",
    "code": "bwplot(___ ~ race, data = Gestation)",
    "answer": ["wt"],
    "explain": "The variable being summarised goes left of `~`, the grouping variable right of it: `wt ~ race`. Swapping them asks for boxplots of race grouped by weight, which is meaningless."
  }
]
```

```r
library(mosaic)
bwplot(wt ~ race, data = Gestation, main = "Boxplots of Birth Weights by Race",
       xlab = "Mother's Race", ylab = "Baby's Birth Weight (ounces)")
```

or, in base R with no package:

```r
boxplot(wt ~ race, data = Gestation, main = "Boxplots of Birth Weights by Race",
        xlab = "Mother's Race", ylab = "Baby's Birth Weight (ounces)")
```

With a formula, `data = Gestation` replaces the `$`. The R sheet provided at the exam lists neither `filter` nor `bwplot`; both come from memory.

Taught in [Lab 2: grouped data in R](#/math3042-u2/lab2-grouped) and [R essentials](#/math3042/r-essentials). The full set of data-frame commands is in [R on paper](#/math3042-midterm/r-on-paper).

## Q8 (3 marks). Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area.

> The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. Twenty passengers are randomly selected, without replacement. Write a single R command that

Twenty drawn without replacement from a population of 312 split into "on this flight" and "not on this flight" is **hypergeometric**. R's hypergeometric functions take four numbers in a fixed order: the count x (or, for `rhyper`, the number of simulations), the successes in the population, the failures in the population, the sample size. In R's own argument names that is `x` (or `nn`), `m`, `n`, `k`. The instructor writes the failures as an unevaluated sum such as `116+154`, which shows the marker which flights you counted.

**a. [1]** Simulates this scenario and determines the number of passengers in the group of 20 that were on flight 911.

```quiz
[
  {
    "q": "**Q8a.** Write the full command on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["rhyper"],
    "explain": "`rhyper(1, 154, 42+116, 20)`. \"Simulates\" means an r-function. One simulation, 154 successes (on flight 911), 42 + 116 failures (on the other two flights), 20 drawn."
  },
  {
    "type": "fill",
    "q": "Fill the last slot.",
    "code": "rhyper(1, 154, 42+116, ___)",
    "answer": ["20"],
    "explain": "The fourth slot is the sample size k: twenty passengers selected. The first slot, 1, is how many simulated groups to draw."
  }
]
```

```r
rhyper(1, 154, 42+116, 20)
```

The output is random, a single whole number near the mean 20 × 154/312 = 9.87.

**b. [1]** Computes the probability that exactly 9 of the 20 passengers were on flight 311.

```quiz
[
  {
    "q": "**Q8b.** Write the full command on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["dhyper"],
    "explain": "`dhyper(9, 42, 116+154, 20)`. \"Exactly\" is the d-function, P(X = 9). The successes are now flight 311's 42 passengers and the failures the other two flights."
  },
  {
    "type": "fill",
    "q": "Fill the successes slot.",
    "code": "dhyper(9, ___, 116+154, 20)",
    "answer": ["42"],
    "explain": "Successes in the population: the 42 passengers on flight 311. The success group changes from part a to part b, so the failures change with it, from 42+116 to 116+154."
  }
]
```

```r
dhyper(9, 42, 116+154, 20)
```

It returns about 0.0002997: nine from a flight that holds 13 % of the room is far above the expected 20 × 42/312 = 2.7.

**c. [1]** Computes the probability that at least 12 of the 20 passengers were on flight 311.

```quiz
[
  {
    "q": "**Q8c.** Write the full command on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["phyper"],
    "explain": "`1 - phyper(11, 42, 116+154, 20)` or `phyper(11, 42, 116+154, 20, lower.tail = FALSE)`. P(X ≥ 12) = 1 − P(X ≤ 11); the p-function is cumulative from the left, so the cut is at 11, not 12."
  },
  {
    "type": "fill",
    "q": "Fill the first slot of the complement form.",
    "code": "1 - phyper(___, 42, 116+154, 20)",
    "answer": ["11"],
    "explain": "At least 12 = everything except 11 or fewer: 1 − P(X ≤ 11). Writing 12 here computes P(X ≥ 13)."
  },
  {
    "type": "fill",
    "q": "Fill the switch that makes phyper return the upper tail.",
    "code": "phyper(11, 42, 116+154, 20, lower.tail = ___)",
    "answer": ["FALSE", "F"],
    "explain": "`lower.tail = FALSE` returns P(X > 11) = P(X ≥ 12) directly. It is the only named argument in the hypergeometric answers, and it is upper-case FALSE."
  }
]
```

```r
1 - phyper(11, 42, 116+154, 20)
```

or

```r
phyper(11, 42, 116+154, 20, lower.tail = FALSE)
```

Both return about 4.45 × 10⁻⁷. The question asks only for the command; no number is needed.

Taught in [hypergeometric](#/math3042-u4/hypergeometric) and [choosing the distribution](#/math3042-u4/choosing-distribution). Every d, p, q, r signature and the inequality table are in [R on paper](#/math3042-midterm/r-on-paper).

## Q9 (3 marks). Rather than paying the $3.50 fare to take the SkyTrain, a student may decide to sneak on and risk paying the $173 fine if caught.

> Suppose that each time they sneak on there is a 4.5% chance of getting caught and having to pay the fine.

**a. [2]** Write an R function that takes as input an integer n that represents the number of times the student sneaks on the SkyTrain and returns the proportion of times they get caught. Your function should simulate this random process, not simply compute the average outcome.

```quiz
[
  {
    "q": "**Q9a.** Write the whole function on paper, then type the name of the R function inside it that does the random part.",
    "type": "text",
    "answer": ["rbinom", "sample"],
    "explain": "Either model answer earns both marks.\n\n`skytrain_sneaking <- function(n) { times_caught <- rbinom(1, n, 0.045); return(times_caught/n) }`\n\nor\n\n`skytrain_sneaking2 <- function(n) { caught <- sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045)); return(sum(caught)/n) }`\n\nThe number caught in n independent tries with the same 0.045 is binomial, so one `rbinom` draw gives it; the `sample` version draws n zeros and ones and counts the ones."
  },
  {
    "type": "fill",
    "q": "Fill the probability slot of the binomial draw.",
    "code": "times_caught <- rbinom(1, n, ___)",
    "answer": ["0.045", ".045"],
    "explain": "`rbinom(m, size, prob)`: one draw, n trials, probability 0.045 of being caught on each. 4.5 % is written as 0.045."
  },
  {
    "type": "fill",
    "q": "Fill the probability of a 0 (got on without being caught).",
    "code": "caught <- sample(0:1, n, replace = TRUE, prob = c(___, 0.045))",
    "answer": ["0.955", ".955", "1-0.045", "1 - 0.045"],
    "explain": "`prob` lists one probability per value of `0:1`, in the same order: 0 (not caught) with 0.955, 1 (caught) with 0.045. `replace = TRUE` lets the same value come up again on every try."
  },
  {
    "q": "A function whose body is `return(n*0.045/n)` earns the two marks.",
    "type": "tf",
    "answer": false,
    "explain": "It returns 0.045 every time, the long-run average, with nothing random in it. The question says the function \"should simulate this random process, not simply compute the average outcome\". It needs an r-function or `sample`."
  }
]
```

```r
skytrain_sneaking <- function(n) {
  times_caught <- rbinom(1, n, 0.045)
  return(times_caught/n)
}
```

or

```r
skytrain_sneaking2 <- function(n) {
  caught <- sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045))
  # 0 is successfully snuck on, 1 is caught
  return(sum(caught)/n)
}
```

`sum(caught)/n` and `mean(caught)` are the same number: the mean of a vector of zeros and ones is the proportion of ones. The key writes `skytrain_sneaking=function(n){ ... }`; `=` and `<-` both assign.

**b. [1]** Write a command or series of commands that uses your function from part a. to compute the total number of dollars saved by a single student who attempts to sneak on the SkyTrain 20 times.

```quiz
[
  {
    "q": "**Q9b.** Write the command on paper, then type the name of the function it calls.",
    "type": "text",
    "answer": ["skytrain_sneaking", "skytrain_sneaking2", "skytrain_sneaking(20)", "skytrain_sneaking2(20)"],
    "explain": "`20*3.50 - skytrain_sneaking(20)*20*173`. Twenty fares avoided is 20 × 3.50 = 70 dollars saved. The function returns the proportion caught, so proportion × 20 is the number of fines, each 173 dollars. The result is random; a negative value means the student lost money."
  },
  {
    "type": "fill",
    "q": "Fill the fine.",
    "code": "20*3.50 - skytrain_sneaking(20)*20*___",
    "answer": ["173"],
    "explain": "Each time caught costs the $173 fine. Proportion caught × 20 tries = number of fines; × 173 = dollars paid."
  }
]
```

```r
20*3.50 - skytrain_sneaking(20)*20*173
```

Part b reuses part a: call the function with n = 20, then turn the proportion into dollars. Calling it once gives one random student; the expected value comes next.

Taught in [Lab 4: simulations](#/math3042-u3/lab4-simulations) and [binomial](#/math3042-u4/binomial). Simulation functions and `replicate` are in [R on paper](#/math3042-midterm/r-on-paper).

```quiz
[
  {
    "q": "Q9's student sneaks on 20 times. Expected dollars saved (fares avoided minus expected fines)? A loss is negative.",
    "type": "numeric",
    "answer": -85.70,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Fares avoided: 20 × 3.50 = 70 dollars. Expected number caught: 20 × 0.045 = 0.9, so expected fines 0.9 × 173 = 155.70 dollars. Expected saving 70 − 155.70 = −85.70: an expected loss of 85.70 dollars. Simulated runs of Q9b scatter around this."
  },
  {
    "type": "fill",
    "q": "Probability that exactly 5 of the 20 passengers were on flight 811. Fill the successes slot.",
    "code": "dhyper(5, ___, 42+154, 20)",
    "answer": ["116"],
    "explain": "Flight 811 had 116 passengers: those are the successes. The failures are the other two flights, 42 + 154 = 196."
  },
  {
    "type": "fill",
    "q": "Probability that at most 3 of the 20 passengers were on flight 311. Fill the first slot.",
    "code": "phyper(___, 42, 116+154, 20)",
    "answer": ["3"],
    "explain": "At most 3 is P(X ≤ 3), exactly what the p-function returns: `phyper(3, 42, 116+154, 20)`. No complement and no shift."
  },
  {
    "type": "fill",
    "q": "The 90th percentile birth weight. Fill the slot.",
    "code": "quantile(Gestation$wt, ___)",
    "answer": ["0.90", "0.9", ".9", ".90"],
    "explain": "The 90th percentile is the proportion 0.90."
  },
  {
    "q": "Which package must be loaded before `bwplot` can be called? (one word)",
    "type": "text",
    "answer": ["mosaic", "lattice"],
    "explain": "`library(mosaic)`, as in the key. `bwplot` itself comes from lattice, which mosaic loads. Base R's `boxplot` needs no package."
  },
  {
    "q": "In `skytrain_sneaking2`, `mean(caught)` returns the same value as `sum(caught)/n`.",
    "type": "tf",
    "answer": true,
    "explain": "`caught` holds n zeros and ones. Its mean is (number of ones)/n, the proportion caught, which is what `sum(caught)/n` computes."
  },
  {
    "q": "`rhyper(1, 154, 42+116, 20)` returns the same number every time it is run.",
    "type": "tf",
    "answer": false,
    "explain": "The r-functions draw random values: each call simulates a new group of 20. The d- and p-functions return fixed probabilities."
  }
]
```
