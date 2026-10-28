---
title: "Review 2: R for data on paper: quantile, filter, favstats, bwplot"
minutes: 30
---
<!-- facts: gms.data.ranking-overall-legendary-2026-10-27 -->
:::quiz What the paper asks and what earns the marks
Q7 (4 marks) gives a help-file excerpt for a data frame and asks for R commands written by hand: a percentile (1), a filtered dataset (1), side-by-side boxplots (2). Each mark needs a full, runnable line: the right function, the exact column names from the excerpt, real numbers, and the `library()` line when a package is needed. The second boxplot mark is for the title and axis labels.
:::

**Write this on the paper.** Swap in the data frame and column names from the excerpt:

```r
quantile(Data$col, 0.20)
library(dplyr)
new_data <- filter(Data, col < 250)
library(mosaic)
bwplot(y ~ group, data = Data, main = "Title", xlab = "Group label", ylab = "Y label")
favstats(y ~ group, data = Data)
```

The generic R sheet at the exam lists `quantile` but not `filter`, `favstats` or `bwplot`, and gives no arguments: the four shapes above come from memory.

Do if time is short: Q7 and new variants 1 to 3. The rest are marked "if time".

## The ideas, from zero

**A data frame** is R's table: one row per individual (a baby, a runner), one column per variable (weight, race). `Gestation` is a data frame with 1236 rows.

**`Data$col`** pulls one column out as a list of numbers: `Gestation$wt` is the 1236 birth weights. Use `$` when a function takes plain numbers, like `quantile`.

**A formula `y ~ g`** reads "y split by g": the numeric column on the left, the grouping column on the right. Functions that take a formula also take `data = Data`, and then the columns are named bare, no `$`.

**Inside `filter` and `subset`** the columns are also named bare, because the data frame is the first argument.

**Comparisons**: `<` less than, `<=` at most, `>` more than, `>=` at least, `==` equal to (two equals signs), `&` and, `|` or. A text value goes in quotes: `race == "white"`.

:::warn Two traps that lose the mark
The percentile is a proportion: `0.20`, never `20`. Equality is `==`; a single `=` inside `filter` is an error.
:::

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

The column names come from the excerpt: `wt` for birth weight, `gestation` for days of gestation, `race` for the mother's race. R is case-sensitive.

**a. [1]** Give an R command (or commands) that would output the 20th percentile birth weight.

**b. [1]** We define premature births as those born before 250 days of gestation. Give an R command (or commands) that would create a dataset consisting of all of the data for only those babies with a gestation period of less than 250 days.

**c. [2]** Give an R command (or commands) that would create side-by-side boxplots of the birth weights, grouped by race of the mother.

```quiz
[
  {
    "type": "fill",
    "q": "**Q7a.** Write the full command on paper, then fill the slot: the 20th percentile of birth weight.",
    "code": "quantile(Gestation$wt, ___)",
    "answer": ["0.20", "0.2", ".2", ".20"],
    "explain": "Model answer: `quantile(Gestation$wt, 0.20)`. The data frame, `$`, the column, then the proportion 0.20 (not 20). `quantile(Gestation$wt, 20)` is an error: 20 is outside [0, 1]."
  },
  {
    "type": "fill",
    "q": "**Q7b.** Write both lines on paper, then fill the comparison: babies born before 250 days.",
    "code": "premature_babies <- filter(Gestation, gestation ___ 250)",
    "answer": ["<"],
    "explain": "Model answer: `library(dplyr)` then `premature_babies <- filter(Gestation, gestation < 250)`. \"Less than 250 days\" is `<`, not `<=`. \"Create a dataset\" means store the result under a name with `<-`. Also full marks: `subset(Gestation, gestation < 250)` or `Gestation[Gestation$gestation < 250, ]`."
  },
  {
    "type": "fill",
    "q": "**Q7c.** Write both lines on paper with a title and labels, then fill the left side of the formula.",
    "code": "bwplot(___ ~ race, data = Gestation, main = \"Boxplots of Birth Weights by Race\", xlab = \"Mother's Race\", ylab = \"Baby's Birth Weight (ounces)\")",
    "answer": ["wt"],
    "explain": "Model answer: `library(mosaic)` then `bwplot(wt ~ race, data = Gestation, main = \"Boxplots of Birth Weights by Race\", xlab = \"Mother's Race\", ylab = \"Baby's Birth Weight (ounces)\")`. The variable being summarised goes left of `~`, the group right of it. Base R `boxplot(wt ~ race, data = Gestation, main = ..., xlab = ..., ylab = ...)` is also full marks. The second mark is for the title and labels."
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

The fuller walk-through, with the `subset` and `[ , ]` forms, is in [Q7 to Q9](#/math3042-midterm/practice-r).

## Lab questions on the same commands

**Lab 1, Task 7.** "Write an expression that returns a data frame for all runner from the state of "Ethiopia"." Lab answer: `TenMileRace[ TenMileRace$state == "Ethiopia", ]`. A text value in quotes, `==` for equality.

**Lab 1, Task 9.** "Use subset to write an R expression that returns all rows of TenMileRace with runners whose net is between 3000 seconds and 10000 seconds (including endpoints)." Lab answer:

```r
mid.runners <- subset(TenMileRace, (net >= 3000) & (net <= 10000) )
```

:::info R syntax
| Code | What it does |
|---|---|
| `subset(TenMileRace, …)` | Base R, no package: keeps the rows of `TenMileRace` where the condition is TRUE. |
| `net >= 3000` | "net is at least 3000", one TRUE or FALSE per row; the column is named bare. |
| `&` | "and": a row is kept only if both conditions are TRUE. |
| `net <= 10000` | "net is at most 10000". "Including endpoints" is why it is `>=` and `<=`. |
| `mid.runners <-` | Stores the kept rows under the name `mid.runners`. |

**Left to right**

- "Store as mid.runners (`mid.runners <-`) the rows (`subset`) of TenMileRace (`TenMileRace`) where net is at least 3000 (`net >= 3000`) and (`&`) net is at most 10000 (`net <= 10000`)."

**Right to left**, the order R runs it

- "Test each row's net against at least 3000 (`net >= 3000`) and at most 10000 (`net <= 10000`), combine the two with and (`&`), keep the rows of TenMileRace that pass (`subset`), and store them as mid.runners (`mid.runners <-`)."
:::

**Lab 1, Task 14.** "Use filter to get a data frame containing all Male runners who are not from "VA" and not from "MD"." Lab answer: `filter(TenMileRace, sex == "M", !(state=="VA"), !(state=="MD"))`. In `filter`, commas between conditions mean "and"; `!` means "not".

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$state == "Ethiopia"` | One TRUE or FALSE per row: is this runner's state the text "Ethiopia"? Outside `filter` and `subset` the column needs `$`. |
| `TenMileRace[ rows , ]` | `[ ]` takes rows before the comma, columns after it; the empty slot means all columns. |
| `sex == "M"` | Inside `filter`, the column is named bare; the text value is in quotes. |
| `!(state=="VA")` | `!` flips TRUE and FALSE: keeps runners whose state is not "VA". |
| `,` between conditions | In `filter`, each comma means "and". |

**Left to right**

- `TenMileRace[ TenMileRace$state == "Ethiopia", ]`: "From TenMileRace (`TenMileRace[ ]`) take the rows where the state column (`TenMileRace$state`) equals (`==`) Ethiopia (`"Ethiopia"`), with all columns (the empty slot after `,`)."
- `filter(TenMileRace, sex == "M", !(state=="VA"), !(state=="MD"))`: "Keep the rows (`filter`) of TenMileRace (`TenMileRace`) where sex is M (`sex == "M"`) and the state is not VA (`!(state=="VA")`) and not MD (`!(state=="MD")`)."

**Right to left**, the order R runs it

- `TenMileRace[ TenMileRace$state == "Ethiopia", ]`: "Pull out the state column, mark each row TRUE where it equals Ethiopia, then pick those rows and every column from TenMileRace."
- `filter(TenMileRace, sex == "M", !(state=="VA"), !(state=="MD"))`: "Test each row for sex M, flip the VA and MD tests with `!`, and keep the rows where all three are TRUE (`filter`)."
:::

**Lab 2, percentiles.** `quantile(~Days, probs=0.9, data=quine)` gives `90%  40`; `quantile(~Days, probs=c(0.1, 0.9), data=quine)` gives `10% 2, 90% 40`. This is mosaic's formula form; on the paper `quantile(quine$Days, c(0.1, 0.9))` gives the same numbers.

```r
quantile(quine$Days, c(0.1, 0.9))
```

:::info R syntax
| Code | What it does |
|---|---|
| `quine$Days` | The `Days` column of the `quine` data frame, as plain numbers. |
| `c(0.1, 0.9)` | `c()` combines values into one vector: two proportions at once. It fills `probs`. |
| `quantile(…)` | Returns one percentile per proportion, labelled `10%` and `90%`. |

**Left to right**

- "Find the percentiles (`quantile`) of the Days column of quine (`quine$Days`) at the proportions 0.1 and 0.9 combined (`c(0.1, 0.9)`)."

**Right to left**, the order R runs it

- "Combine 0.1 and 0.9 into one vector (`c(0.1, 0.9)`), pull out the Days column (`quine$Days`), and return the value with 10 % below it and the value with 90 % below it (`quantile`)."
:::

**Lab 2, Task 8.** "Use bwplot() to create side-by-side box plots for the number of Days of absence, grouped by ethnicity (Eth). Also, use favstats() to compare sample statistics for Days grouped by Eth." Lab answer: `bwplot( Days~Eth, data=quine)` and

```r
favstats(Days ~ Eth, data = quine)
```

:::info R syntax
| Code | What it does |
|---|---|
| `favstats(…)` | From mosaic (`library(mosaic)` first): prints min, Q1, median, Q3, max, mean, sd, n and missing. |
| `Days ~ Eth` | Formula: summarise `Days`, one row per value of `Eth`. |
| `data = quine` | Where `Days` and `Eth` are found, so no `$`. |

**Left to right**

- "Give the favourite summary statistics (`favstats`) of Days (`Days`) split by (`~`) ethnicity (`Eth`), from the quine data (`data = quine`)."

**Right to left**, the order R runs it

- "Build the formula Days by Eth (`Days ~ Eth`), look the names up in quine (`data = quine`), and print one row of statistics per group (`favstats`)."
:::

## New variants

A data frame `Ranking` is read from `gms-ranking-overall-legendary-2026-10-27.csv`, the top 500 characters in Nexon's North America overall ranking for GMS (MapleStory) on 2026-10-27, all 500 rows. Its columns, named as the CSV has them: `rank`, `level` (297 to 300), `exp` (exp into the current level), `job_name` (text, the character's job, the game's class: 51 different jobs, Night Lord the most common with 61) and `world_id` (Nexon's numeric world code). One row per character with a numeric column and a text group column is exactly the shape `quantile`, `filter`, `bwplot` and `favstats` work on.

```quiz
[
  {
    "type": "fill",
    "q": "**Variant 1.** The 90th percentile of character level.",
    "code": "quantile(Ranking$level, ___)",
    "answer": ["0.90", "0.9", ".9", ".90"],
    "explain": "The 90th percentile is the proportion 0.90: $$90\\% = 0.90$$ Full line: `quantile(Ranking$level, 0.90)`."
  },
  {
    "type": "fill",
    "q": "**Variant 2.** Both quartiles of level, Q1 and Q3, in one command.",
    "code": "quantile(Ranking$level, ___)",
    "answer": ["c(0.25, 0.75)", "c(0.25,0.75)", "c(.25, .75)", "c(.25,.75)"],
    "explain": "Q1 has 25 % below it, Q3 has 75 %. `c()` combines both proportions into one vector: `quantile(Ranking$level, c(0.25, 0.75))` prints `25%` and `75%`."
  },
  {
    "type": "fill",
    "q": "**Variant 3.** A dataset of characters at most level 298.",
    "code": "below_299 <- filter(Ranking, level ___ 298)",
    "answer": ["<="],
    "explain": "\"At most 298\" includes 298, so `<=`. `<` would drop the level-298 characters. Needs `library(dplyr)` on the line before."
  },
  {
    "type": "fill",
    "q": "**Variant 4 (if time).** A dataset of characters above level 297.",
    "code": "high_level <- filter(Ranking, level ___ 297)",
    "answer": [">"],
    "explain": "\"Above\" excludes 297 itself: `>`. \"At least 297\" would be `>=`, and would keep all 500 rows."
  },
  {
    "type": "fill",
    "q": "**Variant 5 (if time).** Only the Night Lord characters. Type the value exactly as it goes in the code.",
    "code": "night_lords <- filter(Ranking, job_name == ___)",
    "answer": ["\"Night Lord\"", "'Night Lord'"],
    "explain": "A text value goes in quotes, spelled, spaced and capitalised exactly as in the data: `\"Night Lord\"`. Without quotes R stops with an error. Equality is `==`, two signs."
  },
  {
    "type": "fill",
    "q": "**Variant 6 (if time).** Night Lords at level 300, with `subset`.",
    "code": "nl_300 <- subset(Ranking, (job_name == \"Night Lord\") ___ (level == 300))",
    "answer": ["&"],
    "explain": "Both conditions must hold, so `&` (and). `|` would keep every Night Lord plus every level-300 character. With `filter` a comma does the same job: `filter(Ranking, job_name == \"Night Lord\", level == 300)`."
  },
  {
    "type": "fill",
    "q": "**Variant 7 (if time).** Side-by-side boxplots of level by job, titled and labelled.",
    "code": "bwplot(level ~ ___, data = Ranking, main = \"Levels by Job, GMS Top 500\", xlab = \"Job\", ylab = \"Level\")",
    "answer": ["job_name"],
    "explain": "Numeric column left of `~`, group right: `level ~ job_name`, the column name exactly as in the CSV, underscore included. `library(mosaic)` first. `main`, `xlab` and `ylab` earn the second mark."
  },
  {
    "type": "fill",
    "q": "**Variant 8 (if time).** Summary statistics of level for each job. Fill the formula.",
    "code": "favstats(___, data = Ranking)",
    "answer": ["level ~ job_name", "level~job_name"],
    "explain": "`favstats(level ~ job_name, data = Ranking)`, after `library(mosaic)`: one row per job with min, Q1, median, Q3, max, mean, sd and n."
  }
]
```
