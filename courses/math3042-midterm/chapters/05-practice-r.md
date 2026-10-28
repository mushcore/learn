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

:::info R syntax
| Code | What it does |
|---|---|
| `Gestation$wt` | `$` picks one column of a data frame by name: the `wt` column of `Gestation`. It fills `x`, the data. |
| `0.20` | Fills `probs`: the proportion for the percentile, between 0 and 1. |
| `quantile(…)` | Returns the value below which that proportion of the data lies, labelled `20%` when printed. |

**Left to right**

- "Find the value with a given proportion of the data below it (`quantile`) in the wt column (`wt`) of the Gestation data (`Gestation$`), at the proportion 0.20 (`0.20`)."

**Right to left**, the order R runs it

- "Take the Gestation data (`Gestation`), pull out its wt column (`$wt`), and find the weight with 20 % of the values below it (`0.20`, `quantile`)."
:::

The column is reached with `$`. A bare `quantile(wt, 0.20)` fails because no object called `wt` exists outside the data frame.

:::info R syntax
| Code | What it does |
|---|---|
| `quantile(wt, 0.20)` | `wt` fills `x`, but R looks for an object named `wt` on its own, finds none, and stops with an error. 0.20 fills `probs`. |

**Left to right**

- `quantile(wt, 0.20)`: "Find the 0.20 quantile (`quantile`, `0.20`) of an object called wt (`wt`), which does not exist outside the data frame."

**Right to left**, the order R runs it

- `quantile(wt, 0.20)`: "Look up an object named wt (`wt`), fail to find it, and stop before `quantile` ever runs."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr)` | Loads the dplyr package, which provides `filter`. Run it once per session before the first `filter` call. |
| `premature_babies <-` | `<-` is assignment: the result is stored under the name `premature_babies`, which makes it a new dataset. |
| `filter(Gestation, …)` | The first argument is the data frame; `filter` keeps only the rows where the condition after it is TRUE. |
| `gestation < 250` | `<` is "less than", checked row by row. The column is named bare: `filter` looks it up inside `Gestation`. |

**Left to right**

- `library(dplyr)`: "Load the package (`library`) called dplyr (`dplyr`)."
- `premature_babies <- filter(Gestation, gestation < 250)`: "Store under the name premature_babies (`premature_babies <-`) the rows kept (`filter`) from the Gestation data (`Gestation`) where the gestation column (`gestation`) is less than (`<`) 250 (`250`)."

**Right to left**, the order R runs it

- `library(dplyr)`: "Find the package dplyr (`dplyr`) and load it (`library`)."
- `premature_babies <- filter(Gestation, gestation < 250)`: "Take the Gestation data (`Gestation`), test each row's gestation (`gestation`) for being less than (`<`) 250 (`250`), keep the rows where that is true (`filter`), and store the result as premature_babies (`premature_babies <-`)."
:::

`filter` keeps whole rows, so every column comes along. The other accepted forms:

```r
premature_babies <- subset(Gestation, gestation < 250)
premature_babies <- Gestation[Gestation$gestation < 250, ]
```

:::info R syntax
| Code | What it does |
|---|---|
| `subset(Gestation, gestation < 250)` | Base R, no package. The first argument `x` is the data frame; the second, `subset`, is the row condition, with the column named bare. |
| `Gestation$gestation < 250` | Gives one TRUE or FALSE per row. Outside `filter` and `subset` the column needs `$`. |
| `Gestation[ rows , ]` | `[ ]` on a data frame takes rows before the comma and columns after it. TRUE rows are kept; the empty slot after the comma means all columns. |
| `<-` | Assignment, as above: both lines store the result in `premature_babies`. |

**Left to right**

- `premature_babies <- subset(Gestation, gestation < 250)`: "Store under the name premature_babies (`premature_babies <-`) the part (`subset`) of the Gestation data (`Gestation`) where gestation (`gestation`) is less than (`<`) 250 (`250`)."
- `premature_babies <- Gestation[Gestation$gestation < 250, ]`: "Store under the name premature_babies (`premature_babies <-`) the Gestation data (`Gestation`) at the rows (`[ ]`) where its gestation column (`Gestation$gestation`) is less than (`<`) 250 (`250`), with every column (the empty slot after `,`)."

**Right to left**, the order R runs it

- `premature_babies <- subset(Gestation, gestation < 250)`: "Take the Gestation data (`Gestation`), check each row's gestation (`gestation`) against less than (`<`) 250 (`250`), keep the rows that pass (`subset`), and store them as premature_babies (`premature_babies <-`)."
- `premature_babies <- Gestation[Gestation$gestation < 250, ]`: "Pull out the gestation column (`Gestation$gestation`), mark each row TRUE where it is less than (`<`) 250 (`250`), pick those rows and all columns (`,`) from Gestation (`Gestation[ ]`), and store them as premature_babies (`premature_babies <-`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | Loads the mosaic package, which makes `bwplot` available. |
| `wt ~ race` | `~` builds a formula: the numeric variable on the left, the grouping variable on the right. It fills `bwplot`'s first argument, `x`. |
| `data = Gestation` | The data frame the formula's names are looked up in, so no `$` is needed. |
| `main = "…"` | The plot title, a string in quotes. |
| `xlab = "…"`, `ylab = "…"` | The x-axis and y-axis labels. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) called mosaic (`mosaic`)."
- `bwplot(wt ~ race, data = Gestation, main = …, xlab = …, ylab = …)`: "Draw box-and-whisker plots (`bwplot`) of birth weight (`wt`) split by (`~`) race (`race`), from the Gestation data (`data = Gestation`), with a title (`main =`), an x-axis label (`xlab =`) and a y-axis label (`ylab =`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Find the package mosaic (`mosaic`) and load it (`library`)."
- `bwplot(wt ~ race, data = Gestation, main = …, xlab = …, ylab = …)`: "Build the formula weight by race (`wt ~ race`), look its names up in Gestation (`data = Gestation`), take the title (`main =`) and the axis labels (`xlab =`, `ylab =`), then draw the boxplots (`bwplot`)."
:::

or, in base R with no package:

```r
boxplot(wt ~ race, data = Gestation, main = "Boxplots of Birth Weights by Race",
        xlab = "Mother's Race", ylab = "Baby's Birth Weight (ounces)")
```

:::info R syntax
| Code | What it does |
|---|---|
| `boxplot(wt ~ race, …)` | Base R's boxplot; no `library()` call. The formula fills its first argument, `formula`, with the same left-right meaning as above. |
| `data = Gestation` | Where `wt` and `race` are found. |
| `main =`, `xlab =`, `ylab =` | Title and axis labels, as in the `bwplot` line. |

**Left to right**

- "Draw boxplots (`boxplot`) of birth weight (`wt`) split by (`~`) race (`race`), from the Gestation data (`data = Gestation`), with a title (`main =`) and axis labels (`xlab =`, `ylab =`)."

**Right to left**, the order R runs it

- "Build the formula weight by race (`wt ~ race`), look its names up in Gestation (`data = Gestation`), take the title and labels (`main =`, `xlab =`, `ylab =`), then draw the boxplots (`boxplot`)."
:::

With a formula, `data = Gestation` replaces the `$`. The R sheet provided at the exam lists neither `filter` nor `bwplot`; both come from memory.

Taught in [Lab 2: grouped data in R](#/math3042-u2/lab2-grouped) and [R essentials](#/math3042/r-essentials). The full set of data-frame commands is in [R on paper](#/math3042-midterm/r-on-paper).

## Q8 (3 marks). Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area.

> The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. Twenty passengers are randomly selected, without replacement. Write a single R command that

Twenty drawn without replacement from a population of 312 split into "on this flight" and "not on this flight" is **hypergeometric**. R's hypergeometric functions take four numbers in a fixed order:

| Slot | R's name | Means | Q8a (flight 911) | Q8b, Q8c (flight 311) |
|---|---|---|---|---|
| 1 | `nn` / `x` / `q` | simulations, or the count asked about | 1 | 9, 11 |
| 2 | `m` | successes in the population (K) | 154 | 42 |
| 3 | `n` | failures in the population (N − K) | 42+116 | 116+154 |
| 4 | `k` | sample size (the course's n) | 20 | 20 |

:::warn R's n is the failures
In the hypergeometric functions R's slot `n` holds the failures in the population, N − K. The course's n, the sample size, goes in R's last slot, `k`.
:::

The instructor writes the failures as an unevaluated sum such as `116+154`, which shows the marker which flights you counted.

```diagram
{ "type": "tree", "nodes": [ { "id": "p", "label": "312 passengers", "sub": "N" }, { "id": "s", "label": "m: successes", "sub": "flight 911: 154 (K)", "parent": "p" }, { "id": "f", "label": "n: failures", "sub": "42+116 (N − K)", "parent": "p" } ], "hi": ["s"], "caption": "Q8a splits the 312 into R's m and n, then draws k = 20 from all of them." }
```

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

:::info R syntax
| Code | What it does |
|---|---|
| `1` | Fills `nn`: how many random values to draw, here one simulated group. |
| `154` | Fills `m`: successes in the population (flight 911). |
| `42+116` | Fills `n`: failures in the population. `+` adds; R works out the sum before the call runs. This `n` is not a sample size. |
| `20` | Fills `k`: the sample size. |

**Left to right**

- "Simulate a hypergeometric count (`rhyper`) once (`1`) from 154 successes (`154`) and 42 plus 116 failures (`42+116`), drawing 20 (`20`)."

**Right to left**, the order R runs it

- "Add 42 and 116 (`42+116`) to get the failures, take the 154 successes (`154`), the sample of 20 (`20`) and one simulation (`1`), then draw the random count (`rhyper`)."
:::

The output is random, a single whole number near the hypergeometric mean μ = nK/N = 20 × 154/312 = 9.87.

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

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(9, 42, 116+154, 20)` | x = 9 (the count asked about), m = 42 successes, n = 116+154 failures, k = 20 drawn. Returns P(X = 9). |

**Left to right**

- "The hypergeometric probability of exactly (`dhyper`) 9 (`9`) when there are 42 successes (`42`) and 116 plus 154 failures (`116+154`), drawing 20 (`20`)."

**Right to left**, the order R runs it

- "Add 116 and 154 (`116+154`) to get the failures, take the count 9 (`9`), the 42 successes (`42`) and the sample of 20 (`20`), then compute P(X = 9) (`dhyper`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `phyper(11, 42, 116+154, 20)` | q = 11, m = 42, n = 116+154, k = 20. Returns the cumulative P(X ≤ 11). |
| `1 - …` | `-` subtracts: one minus the call's result. |

**Left to right**

- "One (`1`) minus (`-`) the hypergeometric probability of at most (`phyper`) 11 (`11`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`)."

**Right to left**, the order R runs it

- "Add 116 and 154 (`116+154`), compute P(X ≤ 11) (`phyper`, `11`) for 42 successes (`42`) and 20 drawn (`20`), then subtract it (`-`) from one (`1`)."
:::

or

```r
phyper(11, 42, 116+154, 20, lower.tail = FALSE)
```

:::info R syntax
| Code | What it does |
|---|---|
| `phyper(11, 42, 116+154, 20, …)` | Same four slots as above: q, m, n, k. |
| `lower.tail = FALSE` | A named argument. Its default, TRUE, gives P(X ≤ q); FALSE gives the upper tail P(X > q). `FALSE` is upper case, no quotes. |

**Left to right**

- "The hypergeometric cumulative probability (`phyper`) at 11 (`11`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`), taken from the upper tail (`lower.tail = FALSE`)."

**Right to left**, the order R runs it

- "Add 116 and 154 (`116+154`), switch to the upper tail (`lower.tail = FALSE`), and compute P(X > 11) (`phyper`, `11`) for 42 successes (`42`) and 20 drawn (`20`)."
:::

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
    "explain": "`rbinom(reps, size, prob)`: one draw, n trials, probability 0.045 of being caught on each. 4.5 % is written as 0.045."
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

:::info R syntax
| Code | What it does |
|---|---|
| `skytrain_sneaking <- function(n) { … }` | `function(n)` makes a function with one input, `n`; the braces hold its body. `<-` stores it under the name `skytrain_sneaking`. |
| `rbinom(1, n, 0.045)` | `1` fills R's first slot (R's help calls it `n`: how many random counts to draw). The function's own input, `n` trips, fills the second slot, `size`. Same letter, two jobs: only the position tells R which is which. `0.045` fills `prob`. |
| `times_caught <-` | Stores the drawn count inside the function. |
| `return(times_caught/n)` | `/` divides; `return()` hands the proportion back to whoever called the function. |

**Left to right**

- `skytrain_sneaking <- function(n) { … }`: "Store under the name skytrain_sneaking (`skytrain_sneaking <-`) a function (`function`) of one input n (`(n)`) that runs the lines in braces (`{ }`)."
- `times_caught <- rbinom(1, n, 0.045)`: "Store under times_caught (`times_caught <-`) one (`1`) random binomial count (`rbinom`) from n trials (`n`) with probability 0.045 (`0.045`)."
- `return(times_caught/n)`: "Hand back (`return`) times_caught (`times_caught`) divided by (`/`) n (`n`)."

**Right to left**, the order R runs it

- `skytrain_sneaking <- function(n) { … }`: "Build a function (`function`) with input n (`(n)`) and body in braces (`{ }`), then store it as skytrain_sneaking (`skytrain_sneaking <-`)."
- `times_caught <- rbinom(1, n, 0.045)`: "Take one draw (`1`), n trials (`n`) and probability 0.045 (`0.045`), simulate the count (`rbinom`), and store it as times_caught (`times_caught <-`)."
- `return(times_caught/n)`: "Divide (`/`) times_caught (`times_caught`) by n (`n`), then hand the result back (`return`)."
:::

or

```r
skytrain_sneaking2 <- function(n) {
  caught <- sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045))
  # 0 is successfully snuck on, 1 is caught
  return(sum(caught)/n)
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `skytrain_sneaking2 <- function(n) { … }` | A second function with one input `n`, built as above. |
| `sample(0:1, …)` | `0:1` is the values 0 and 1 (`:` makes a whole-number sequence); it fills `x`, the values to draw from. |
| `n` | Fills `size`: how many values to draw, one per trip. |
| `replace = TRUE` | Draws with replacement, so 0 and 1 can come up again on every draw. |
| `prob = c(0.955, 0.045)` | `c()` combines numbers into a vector; one probability per value of `x`, in the same order. |
| `# 0 is successfully snuck on, 1 is caught` | `#` starts a comment: R ignores the rest of the line. |
| `return(sum(caught)/n)` | `sum()` adds the zeros and ones, giving the number caught; divided by `n` and returned. |

**Left to right**

- `skytrain_sneaking2 <- function(n) { … }`: "Store under the name skytrain_sneaking2 (`skytrain_sneaking2 <-`) a function (`function`) of one input n (`(n)`) that runs the lines in braces (`{ }`)."
- `caught <- sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045))`: "Store under caught (`caught <-`) a random sample (`sample`) from the values 0 to 1 (`0:1`), n of them (`n`), with replacement (`replace = TRUE`), with probabilities (`prob =`) combined (`c`) as 0.955 and 0.045 (`0.955`, `0.045`)."
- `return(sum(caught)/n)`: "Hand back (`return`) the total (`sum`) of caught (`caught`) divided by (`/`) n (`n`)."

**Right to left**, the order R runs it

- `skytrain_sneaking2 <- function(n) { … }`: "Build a function (`function`) with input n (`(n)`) and body in braces (`{ }`), then store it as skytrain_sneaking2 (`skytrain_sneaking2 <-`)."
- `caught <- sample(0:1, n, replace = TRUE, prob = c(0.955, 0.045))`: "Make the values 0 and 1 (`0:1`), combine 0.955 and 0.045 into the probabilities (`c`, `prob =`), allow repeats (`replace = TRUE`), draw n values (`n`, `sample`), and store them as caught (`caught <-`)."
- `return(sum(caught)/n)`: "Add up caught (`caught`, `sum`), divide by n (`/`, `n`), then hand the result back (`return`)."
:::

`sum(caught)/n` and `mean(caught)` are the same number: the mean of a vector of zeros and ones is the proportion of ones. The key writes `skytrain_sneaking=function(n){ ... }`; `=` and `<-` both assign.

:::info R syntax
| Code | What it does |
|---|---|
| `mean(caught)` | The average of the vector `caught`; for zeros and ones, the proportion of ones. |
| `skytrain_sneaking=function(n){ ... }` | The key's spelling: `=` stores the function, exactly as `<-` would. Spaces around `=` and before `{` are optional. |

**Left to right**

- `mean(caught)`: "The average (`mean`) of caught (`caught`)."
- `skytrain_sneaking=function(n){ ... }`: "Store under the name skytrain_sneaking (`skytrain_sneaking=`) a function (`function`) of one input n (`(n)`) with the body in braces (`{ }`)."

**Right to left**, the order R runs it

- `mean(caught)`: "Take caught (`caught`) and average it (`mean`)."
- `skytrain_sneaking=function(n){ ... }`: "Build a function (`function`) of n (`(n)`) with its body (`{ }`), then store it as skytrain_sneaking (`skytrain_sneaking=`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `20*3.50` | `*` multiplies: the fares avoided. |
| `skytrain_sneaking(20)` | Calls the part a function with `n` = 20; it returns one random proportion. |
| `…*20*173` | Proportion times 20 tries times the fine. |
| `-` | Subtracts; `*` is done before `-`, as in ordinary arithmetic. |

**Left to right**

- "Twenty (`20`) times (`*`) 3.50 (`3.50`), minus (`-`) the simulated proportion caught (`skytrain_sneaking`) over 20 tries (`(20)`) times 20 (`*20`) times 173 (`*173`)."

**Right to left**, the order R runs it

- "Run the function with n = 20 (`skytrain_sneaking(20)`), multiply the proportion by 20 and by 173 (`*20*173`), work out 20 times 3.50 (`20*3.50`), then subtract the fines from the fares (`-`)."
:::

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
