---
title: R from Lab 1
minutes: 21
---
<!-- facts: gms.data.ranking-overall-legendary-2026-10-27 -->

The R mechanics from **Lab 1** (`Lab_01_Notebook.Solutions.pdf`, `demo_notebook_Unit_01.Rmd`) and what each one returns. The same calls then run on Nexon's ranking of the top 500 GMS characters.

## R Notebooks

A `.Rmd` file mixes **text chunks** (plain markdown, with LaTeX between `$...$` for formulas) and **code chunks** (fenced with ```` ```{r} ```` ... ```` ``` ````).

- **Run Current Chunk**: `Ctrl+Shift+Enter` — runs just the chunk your cursor is in and shows its output inline.
- **Preview**: renders the notebook to HTML using whatever output the chunks *already produced* — it does **not** re-run any code.
- **Knit**: re-runs **every** chunk from top to bottom in a fresh session, then renders the result to HTML, PDF, or Word.

## Assignment and variable names

R uses `<-` for assignment (`=` also works inside function calls, but `<-` is the convention):

```r
mu.female <- 164.7
sig.female <- 7.1
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu.female <- 164.7` | `<-` is assignment: it stores 164.7 under the name `mu.female`. The dot is just part of the name. |
| `sig.female <- 7.1` | Stores 7.1 under the name `sig.female`. Assignment prints nothing. |

**Left to right**

- `mu.female <- 164.7`: "Store under the name mu.female (`mu.female <-`) the number 164.7 (`164.7`)."
- `sig.female <- 7.1`: "Store under the name sig.female (`sig.female <-`) the number 7.1 (`7.1`)."

**Right to left**, the order R runs it

- `mu.female <- 164.7`: "Take the number 164.7 (`164.7`) and store it as mu.female (`mu.female <-`)."
- `sig.female <- 7.1`: "Take the number 7.1 (`7.1`) and store it as sig.female (`sig.female <-`)."
:::

The `.` in `mu.female` is just a regular character allowed in identifiers, **not** member access like `object.field` in C++/Java/Python.

Two ways to build a sequence of numbers:

```r
c(3, 6, 8, 10)
1:5
```
```text
[1]  3  6  8 10
[1] 1 2 3 4 5
```

:::info R syntax
| Code | What it does |
|---|---|
| `c(3, 6, 8, 10)` | `c()` combines the listed values, separated by commas, into one vector. |
| `1:5` | `a:b` is the whole numbers from a to b in steps of 1. |
| `[1]` | In the output, the position of the first value on that printed line; R counts from 1. |

**Left to right**

- `c(3, 6, 8, 10)`: "Combine (`c`) the values 3, 6, 8 and 10 (`3, 6, 8, 10`) into one vector."
- `1:5`: "The whole numbers from 1 (`1`) through (`:`) 5 (`5`)."

**Right to left**, the order R runs it

- `c(3, 6, 8, 10)`: "Take the values 3, 6, 8 and 10 (`3, 6, 8, 10`), combine them into one vector (`c`), and print it."
- `1:5`: "Take the end points 1 and 5 (`1`, `5`), fill in every whole number between them (`:`), and print the vector."
:::

`c()` ("combine") builds a vector from any listed values; `1:5` builds consecutive integers from 1 to 5.

## Data frames: TenMileRace

```r
library(mosaicData)
data(TenMileRace)
nrow(TenMileRace)
```
```text
[1] 8636
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaicData)` | Loads the installed package `mosaicData`, which holds the `TenMileRace` data. |
| `data(TenMileRace)` | Loads the named data set from a loaded package into the session. |
| `nrow(TenMileRace)` | The number of rows in the data frame: one per runner. |

**Left to right**

- `library(mosaicData)`: "Load the package (`library`) called mosaicData (`mosaicData`)."
- `data(TenMileRace)`: "Load the data set (`data`) called TenMileRace (`TenMileRace`)."
- `nrow(TenMileRace)`: "The number of rows (`nrow`) in the race data (`TenMileRace`)."

**Right to left**, the order R runs it

- `library(mosaicData)`: "Take the package name (`mosaicData`) and load that package (`library`)."
- `data(TenMileRace)`: "Take the data set name (`TenMileRace`) and load it into the session (`data`)."
- `nrow(TenMileRace)`: "Take the race data (`TenMileRace`) and count its rows (`nrow`)."
:::

Index with `[row, column]`, by position or by name:

```r
TenMileRace[1, 2]
TenMileRace[1, "time"]
```
```text
[1] 6060
[1] 6060
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace[1, 2]` | `[row, column]` picks cells of a data frame by position: row 1, column 2. R counts from 1. |
| `TenMileRace[1, "time"]` | The same cell, naming the column in quotes instead of giving its position. |

**Left to right**

- `TenMileRace[1, 2]`: "From the race data (`TenMileRace`), the cell (`[ , ]`) in row 1 (`1`) and column 2 (`2`)."
- `TenMileRace[1, "time"]`: "From the race data (`TenMileRace`), the cell (`[ , ]`) in row 1 (`1`) of the time column (`"time"`)."

**Right to left**, the order R runs it

- `TenMileRace[1, 2]`: "Take row 1 (`1`) and column 2 (`2`), look them up (`[ , ]`) in the race data (`TenMileRace`), and print the cell."
- `TenMileRace[1, "time"]`: "Take row 1 (`1`) and the column named time (`"time"`), look them up (`[ , ]`) in the race data (`TenMileRace`), and print the cell."
:::

A vector of rows picks several rows at once:

```r
TenMileRace[c(1,2,3,4,5), "time"]
```
```text
[1] 6060 4515 5026 4229 5293
```

:::info R syntax
| Code | What it does |
|---|---|
| `c(1,2,3,4,5)` | A vector of row numbers in the row slot picks all those rows, in that order. |
| `"time"` | The column slot: only the `time` column, so the result is a vector of five values. |

**Left to right**

- "From the race data (`TenMileRace`), the cells (`[ , ]`) in rows 1 to 5 (`c(1,2,3,4,5)`) of the time column (`"time"`)."

**Right to left**, the order R runs it

- "Combine the row numbers 1 to 5 into a vector (`c(1,2,3,4,5)`), take the time column (`"time"`), look them up (`[ , ]`) in the race data (`TenMileRace`), and print the five values."
:::

`$` pulls out a whole column as a vector. `TenMileRace` has 8636 rows, so printing the whole column would flood the console; `head()` shows just the first several:

```r
head(TenMileRace$time, 5)
```
```text
[1] 6060 4515 5026 4229 5293
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$time` | `$` picks one column of a data frame by name, as a vector. |
| `head(…, 5)` | Returns only the first values: the first argument is the vector, the second (`n`) is how many to keep. |

**Left to right**

- "The first (`head`) five values (`5`) of the time column (`time`) of the race data (`TenMileRace$`)."

**Right to left**, the order R runs it

- "Take the race data (`TenMileRace`), pull out its time column (`$time`), and keep only its first (`head`) five values (`5`)."
:::

## Logical vectors and counting

Comparing a column to a value gives a **Boolean (logical) vector** — one `TRUE`/`FALSE` per row, not a single answer:

```r
TenMileRace$time < 3000
```
```text
[1] FALSE FALSE FALSE FALSE FALSE ...
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$time` | The `time` column as a vector. |
| `< 3000` | `<` compares every value in the vector with 3000 at once, giving `TRUE` or `FALSE` for each row. |

**Left to right**

- "For the time column (`time`) of the race data (`TenMileRace$`), whether each value is less than (`<`) 3000 (`3000`)."

**Right to left**, the order R runs it

- "Take the race data (`TenMileRace`), pull out its time column (`$time`), and compare every value with 3000 (`< 3000`), giving one TRUE or FALSE per row."
:::

R treats `FALSE` as `0` and `TRUE` as `1`, so summing a logical vector **counts how many are TRUE**:

```r
sum(TenMileRace$time < 3000)
```
```text
[1] 15
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$time < 3000` | The logical vector from above: one `TRUE`/`FALSE` per row. |
| `sum(…)` | Adds the values; `TRUE` counts as 1 and `FALSE` as 0, so the result is the number of `TRUE`s. |

**Left to right**

- "The total (`sum`) of whether each value of the time column (`TenMileRace$time`) is less than (`<`) 3000 (`3000`)."

**Right to left**, the order R runs it

- "Take the race data's time column (`TenMileRace$time`), compare every value with 3000 (`< 3000`), then add up the TRUEs as 1s and the FALSEs as 0s (`sum`)."
:::

Use the same condition inside `[rows, ]` to pull out the matching rows (the column slot `"time"` keeps only the time column; an empty slot would keep all columns):

```r
TenMileRace[TenMileRace$time < 3000, "time"]
```
```text
[1] 2825 2818 2852 2933 2874 2836 2961 2999 2899 2963 2876 2816 2872 2891 2869
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace[ … , "time"]` | `[row, column]` indexing: the row slot holds a condition, the column slot names `time`. |
| `TenMileRace$time < 3000` | In the row slot, a logical vector keeps the rows where it is `TRUE` and drops the rest. |

**Left to right**

- "From the race data (`TenMileRace`), the cells (`[ , ]`) in the rows where the time (`TenMileRace$time`) is less than (`<`) 3000 (`3000`), in the time column (`"time"`)."

**Right to left**, the order R runs it

- "Take the time column (`TenMileRace$time`), compare every value with 3000 (`< 3000`) to get a TRUE/FALSE per row, use that to pick rows (`[ , ]`) of the race data (`TenMileRace`), and keep only the time column (`"time"`)."
:::

## Subsetting: subset(), &, |, !, %in%

`subset(df, condition)` is a cleaner way to write the same row filter:

```r
subset(TenMileRace, net > 10000)
```

:::info R syntax
| Code | What it does |
|---|---|
| `subset(TenMileRace, …)` | Returns the rows of the data frame (first argument) that meet the condition (second argument), with all columns. |
| `net > 10000` | The condition; inside `subset()` a column can be named bare, without `TenMileRace$`. |

**Left to right**

- "The rows (`subset`) of the race data (`TenMileRace`) where the net time (`net`) is greater than (`>`) 10000 (`10000`)."

**Right to left**, the order R runs it

- "Inside the race data (`TenMileRace`), compare each net time (`net`) with 10000 (`> 10000`), then keep the rows where that is TRUE (`subset`)."
:::

Combine conditions with `&` (AND), `|` (OR), `!` (NOT) — same as C++'s `&&`/`||`/`!` but vectorized over every row at once:

```r
subset(TenMileRace, net > 10000 & sex == "F")
```

:::info R syntax
| Code | What it does |
|---|---|
| `subset(TenMileRace, …)` | Keeps the rows that meet the condition, as above. |
| `net > 10000` | `TRUE` for each row whose `net` time is over 10000. |
| `sex == "F"` | `==` tests equality (a single `=` would assign); `TRUE` where `sex` is the text `"F"`. |
| `&` | AND, row by row: a row is kept only when both sides are `TRUE`. |

**Left to right**

- "The rows (`subset`) of the race data (`TenMileRace`) where the net time (`net`) is greater than (`>`) 10000 (`10000`) and (`&`) the sex (`sex`) equals (`==`) F (`"F"`)."

**Right to left**, the order R runs it

- "Inside the race data (`TenMileRace`), compare each net time with 10000 (`net > 10000`), check each sex against F (`sex == "F"`), combine the two with AND (`&`), then keep the rows where both are TRUE (`subset`)."
:::

`%in%` checks membership in a set of values — much shorter than chaining `|`:

```r
subset(TenMileRace, state %in% c("VA","MD","DC"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `subset(TenMileRace, …)` | Keeps the rows that meet the condition, as above. |
| `c("VA","MD","DC")` | A vector of three text values, the set to match against. |
| `state %in% …` | `%in%` is `TRUE` for each row whose `state` equals any value in the set. |

**Left to right**

- "The rows (`subset`) of the race data (`TenMileRace`) whose state (`state`) is one of (`%in%`) the set (`c`) VA, MD and DC (`"VA","MD","DC"`)."

**Right to left**, the order R runs it

- "Combine the three codes into a set (`c("VA","MD","DC")`), check each row's state (`state`) for membership in it (`%in%`) inside the race data (`TenMileRace`), then keep the rows where that is TRUE (`subset`)."
:::

`dplyr::filter()` does the same job; **commas between conditions mean AND**:

```r
library(dplyr)
filter(TenMileRace, sex == "F", net > 10000)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr)` | Loads the installed `dplyr` package, which provides `filter()`. |
| `filter(TenMileRace, …)` | The data frame comes first; each later argument is a condition on its columns, named bare. |
| `sex == "F", net > 10000` | Two conditions separated by a comma: a row is kept only when both are `TRUE`. |

**Left to right**

- `library(dplyr)`: "Load the package (`library`) called dplyr (`dplyr`)."
- `filter(TenMileRace, sex == "F", net > 10000)`: "The rows (`filter`) of the race data (`TenMileRace`) where the sex (`sex`) equals (`==`) F (`"F"`) and (`,`) the net time (`net`) is greater than (`>`) 10000 (`10000`)."

**Right to left**, the order R runs it

- `library(dplyr)`: "Take the package name (`dplyr`) and load that package (`library`)."
- `filter(TenMileRace, sex == "F", net > 10000)`: "Inside the race data (`TenMileRace`), check each sex against F (`sex == "F"`) and each net time against 10000 (`net > 10000`), then keep the rows where both are TRUE (`filter`)."
:::

A practical trick: US state codes are 2 characters, so a `state` value longer than 2 characters means the runner registered from outside the US. `as.character()` converts the factor to plain text first so `nchar()` can measure it:

```r
non.usa.runners <- subset(TenMileRace, nchar(as.character(state)) > 2)
nrow(non.usa.runners)
```
```text
[1] 32
```

:::info R syntax
| Code | What it does |
|---|---|
| `as.character(state)` | Converts the factor column to plain text strings. |
| `nchar(…)` | The number of characters in each string, one count per row. |
| `> 2` | `TRUE` for each row whose code is longer than 2 characters. |
| `non.usa.runners <- subset(…)` | Keeps those rows and stores the smaller data frame under the name `non.usa.runners`. |
| `nrow(non.usa.runners)` | Counts its rows. |

**Left to right**

- `non.usa.runners <- subset(…)`: "Store under the name non.usa.runners (`non.usa.runners <-`) the rows (`subset`) of the race data (`TenMileRace`) where the number of characters (`nchar`) in the state, as text (`as.character(state)`), is greater than (`>`) 2 (`2`)."
- `nrow(non.usa.runners)`: "The number of rows (`nrow`) in non.usa.runners (`non.usa.runners`)."

**Right to left**, the order R runs it

- `non.usa.runners <- subset(…)`: "Inside the race data (`TenMileRace`), turn each state into text (`as.character(state)`), count its characters (`nchar`), compare that with 2 (`> 2`), keep the rows where it is TRUE (`subset`), and store them as non.usa.runners (`non.usa.runners <-`)."
- `nrow(non.usa.runners)`: "Take non.usa.runners (`non.usa.runners`) and count its rows (`nrow`)."
:::

32 runners in `TenMileRace` are non-US entrants.

## Factors: levels(), table(), droplevels()

`sex` is stored as a **factor** — a categorical variable with a fixed set of allowed values (**levels**):

```r
levels(TenMileRace$sex)
```
```text
[1] "F" "M"
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$sex` | The `sex` column, stored as a factor. |
| `levels(…)` | Lists the factor's allowed values as text; the quotes in the output mark them as strings. |

**Left to right**

- "The allowed values (`levels`) of the sex column (`sex`) of the race data (`TenMileRace$`)."

**Right to left**, the order R runs it

- "Take the race data (`TenMileRace`), pull out its sex column (`$sex`), and list its allowed values (`levels`)."
:::

`table()` counts how many rows fall in each level:

```r
table(TenMileRace$sex)
```
```text
   F    M
4325 4311
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$sex` | The `sex` column. |
| `table(…)` | Counts the rows in each level; the output puts each level name above its count. |

**Left to right**

- "The count of rows in each level (`table`) of the sex column (`sex`) of the race data (`TenMileRace$`)."

**Right to left**, the order R runs it

- "Take the race data (`TenMileRace`), pull out its sex column (`$sex`), and count the rows in each level (`table`)."
:::

If you `table()` a **subset** of the data, R still lists every original level, even ones with zero rows in that subset — because the factor still "remembers" all its possible levels, only the counts changed:

```r
my.subset <- subset(TenMileRace, state %in% c("VA", "MD", "DC"))
table(my.subset$state)
```
```text
 AK  AL  AR  AZ  CA  CO  CT  DC  DE  ...  MD  ...  VA  ...  WV
  0   0   0   0   0   0   0 1642   0  ... 2166  ... 3689 ...   0
```

:::info R syntax
| Code | What it does |
|---|---|
| `my.subset <- subset(TenMileRace, state %in% c("VA", "MD", "DC"))` | Keeps the rows whose `state` is one of the three codes and stores them under the name `my.subset`. |
| `my.subset$state` | The `state` column of the subset, still a factor with every original level. |
| `table(…)` | Counts rows per level, listing every level, including those with count 0. |

**Left to right**

- `my.subset <- subset(…)`: "Store under the name my.subset (`my.subset <-`) the rows (`subset`) of the race data (`TenMileRace`) whose state (`state`) is one of (`%in%`) the set (`c`) VA, MD and DC (`"VA", "MD", "DC"`)."
- `table(my.subset$state)`: "The count of rows in each level (`table`) of the state column (`state`) of my.subset (`my.subset$`)."

**Right to left**, the order R runs it

- `my.subset <- subset(…)`: "Combine the three codes into a set (`c("VA", "MD", "DC")`), check each row's state (`state`) for membership (`%in%`) inside the race data (`TenMileRace`), keep the matching rows (`subset`), and store them as my.subset (`my.subset <-`)."
- `table(my.subset$state)`: "Take my.subset (`my.subset`), pull out its state column (`$state`), and count the rows in each of its levels (`table`)."
:::

`droplevels()` removes the levels that have zero rows left, so `table()` only shows the ones actually present:

```r
table(droplevels(my.subset$state))
```
```text
  DC   MD   VA
1642 2166 3689
```

:::info R syntax
| Code | What it does |
|---|---|
| `my.subset$state` | The subset's `state` factor, as above. |
| `droplevels(…)` | Returns the same values with the unused levels removed from the factor. |
| `table(…)` | Counts rows per remaining level, so only the three present codes appear. |

**Left to right**

- "The count of rows in each level (`table`) after dropping the unused levels (`droplevels`) of the state column (`state`) of my.subset (`my.subset$`)."

**Right to left**, the order R runs it

- "Take my.subset (`my.subset`), pull out its state column (`$state`), drop the levels with no rows (`droplevels`), and count the rows in each remaining level (`table`)."
:::

`which.max()` finds the level with the biggest count. Restrict to two-character (US) state codes first, then ask which level has the most runners:

```r
usa.runners <- droplevels(subset(TenMileRace, nchar(as.character(state)) == 2))
us.state.tab <- table(usa.runners$state)
levels(usa.runners$state)[which.max(us.state.tab)]
```
```text
[1] "VA"
```

:::info R syntax
| Code | What it does |
|---|---|
| `nchar(as.character(state)) == 2` | `TRUE` for rows whose state code is exactly 2 characters; `==` tests equality. |
| `subset(TenMileRace, …)` | Keeps those rows. |
| `droplevels(…)` | Applied to a data frame, drops unused levels from its factor columns. |
| `usa.runners <- …` | Stores the result under the name `usa.runners`. |
| `us.state.tab <- table(usa.runners$state)` | Counts runners per state and stores the table. |
| `which.max(us.state.tab)` | The position of the largest count in the table. |
| `levels(usa.runners$state)[…]` | `[ ]` picks from the vector of level names by that position, giving the state's code. |

**Left to right**

- `usa.runners <- droplevels(subset(…))`: "Store under the name usa.runners (`usa.runners <-`), with unused levels dropped (`droplevels`), the rows (`subset`) of the race data (`TenMileRace`) where the number of characters (`nchar`) in the state, as text (`as.character(state)`), equals (`==`) 2 (`2`)."
- `us.state.tab <- table(usa.runners$state)`: "Store under the name us.state.tab (`us.state.tab <-`) the count of rows in each level (`table`) of the state column (`state`) of usa.runners (`usa.runners$`)."
- `levels(usa.runners$state)[which.max(us.state.tab)]`: "The level name (`levels`) of usa.runners' state column (`usa.runners$state`) at the position (`[ ]`) of the biggest count (`which.max`) in the state table (`us.state.tab`)."

**Right to left**, the order R runs it

- `usa.runners <- droplevels(subset(…))`: "Inside the race data (`TenMileRace`), turn each state into text (`as.character(state)`), count its characters (`nchar`), check for exactly 2 (`== 2`), keep those rows (`subset`), drop the unused levels (`droplevels`), and store the result as usa.runners (`usa.runners <-`)."
- `us.state.tab <- table(usa.runners$state)`: "Take usa.runners (`usa.runners`), pull out its state column (`$state`), count the rows per level (`table`), and store the table as us.state.tab (`us.state.tab <-`)."
- `levels(usa.runners$state)[which.max(us.state.tab)]`: "Take the state table (`us.state.tab`) and find the position of its biggest count (`which.max`); list the level names of usa.runners' state column (`levels(usa.runners$state)`), and pick the name at that position (`[ ]`)."
:::

## rank()

`rank()` converts values to their position when sorted; ties share a rank. `ties.method="min"` gives tied values the **lowest** rank in their tied group:

```r
rank(c(50,200,50,400,200,700), ties.method="min")
```
```text
[1] 1 3 1 5 3 6
```

:::info R syntax
| Code | What it does |
|---|---|
| `c(50,200,50,400,200,700)` | The vector to rank, built with `c()`. |
| `rank(…)` | Returns each value's position in sorted order, printed in the original order. |
| `ties.method="min"` | A named argument: tied values all get the smallest rank of their group. |

**Left to right**

- "The rank (`rank`) of each value in the vector (`c`) 50, 200, 50, 400, 200, 700 (`50,200,50,400,200,700`), giving ties the lowest rank in their group (`ties.method="min"`)."

**Right to left**, the order R runs it

- "Combine the six values into a vector (`c(50,200,50,400,200,700)`), set ties to share their lowest rank (`ties.method="min"`), and rank each value (`rank`)."
:::

The two `50`s are both rank 1 (not 1 and 2); the next distinct value (`200`, appearing twice) gets rank 3, because ranks 1 and 2 are "used up" by the pair of `50`s.

## Descriptive statistics functions

Same measures you compute by hand, applied to `TenMileRace$net`:

```r
mean(TenMileRace$net)
median(TenMileRace$net)
min(TenMileRace$net)
max(TenMileRace$net)
```
```text
[1] 5599.065
[1] 5555
[1] 2814
[1] 10536
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$net` | The `net` column, the argument to every call here. |
| `mean(…)`, `median(…)` | The average and the middle value of the column. |
| `min(…)`, `max(…)` | The smallest and the largest value. Each of the four lines prints its own `[1]` line. |

**Left to right**

- `mean(…)`, `median(…)`, `min(…)`, `max(…)`: "The average (`mean`), the middle value (`median`), the smallest (`min`) and the largest (`max`) of the net column (`net`) of the race data (`TenMileRace$`), one per line."

**Right to left**, the order R runs it

- `mean(…)`, `median(…)`, `min(…)`, `max(…)`: "On each line, take the race data (`TenMileRace`), pull out its net column (`$net`), and compute the average (`mean`), the middle value (`median`), the smallest (`min`) or the largest (`max`)."
:::

`sd()` always computes the **sample** standard deviation, dividing by $n-1$ like the by-hand formula (plywood example in the pencil problems: `sd(X.vals)` → 0.006560179). There is no built-in population-sd function; write `sqrt(sum((x-mean(x))^2)/length(x))` for that.

:::info R syntax
| Code | What it does |
|---|---|
| `sd(X.vals)` | The sample standard deviation of the vector `X.vals`; the dot is part of the name. |
| `x-mean(x)` | `mean(x)` is the average; `-` subtracts it from every value of `x` at once, giving one deviation per value. |
| `(…)^2` | `^` raises to a power: squares every deviation. |
| `sum(…)` | Adds the squared deviations. |
| `length(x)` | The number of values in `x`, which is n. |
| `/` | Divides the sum by n, not n − 1. |
| `sqrt(…)` | The square root. |

**Left to right**

- `sd(X.vals)`: "The sample standard deviation (`sd`) of X.vals (`X.vals`)."
- `sqrt(sum((x-mean(x))^2)/length(x))`: "The square root (`sqrt`) of the total (`sum`) of the squared (`^2`) gaps between each value (`x`) and (`-`) the average (`mean(x)`), divided by (`/`) the number of values (`length(x)`)."

**Right to left**, the order R runs it

- `sd(X.vals)`: "Take X.vals (`X.vals`) and compute its sample standard deviation (`sd`)."
- `sqrt(sum((x-mean(x))^2)/length(x))`: "Find the average of x (`mean(x)`), subtract it from every value (`x-`), square each gap (`^2`), add them up (`sum`), divide by the count (`/ length(x)`), and take the square root (`sqrt`)."
:::

Quantiles and IQR, applied to `faithful$eruptions` (the same data set from the quartiles lesson):

```r
quantile(faithful$eruptions, 0.25)
quantile(faithful$eruptions)
IQR(faithful$eruptions)
```
```text
    25%
2.16275
    0%     25%     50%     75%    100%
1.60000 2.16275 4.00000 4.45425 5.10000
[1] 2.2915
```

:::info R syntax
| Code | What it does |
|---|---|
| `faithful$eruptions` | The `eruptions` column of R's built-in `faithful` data frame. |
| `quantile(faithful$eruptions, 0.25)` | The column fills `x` and 0.25 fills `probs`: one cut point, printed under its label `25%`. |
| `quantile(faithful$eruptions)` | With `probs` left out, R uses 0, 0.25, 0.5, 0.75 and 1: the five-number summary, each under its percent label. |
| `IQR(faithful$eruptions)` | Q3 minus Q1 for the column. |

**Left to right**

- `quantile(faithful$eruptions, 0.25)`: "The cut point (`quantile`) of the eruptions column (`eruptions`) of the faithful data (`faithful$`) with a quarter of the values below it (`0.25`)."
- `quantile(faithful$eruptions)`: "The five-number summary (`quantile`) of the eruptions column (`faithful$eruptions`)."
- `IQR(faithful$eruptions)`: "The interquartile range (`IQR`) of the eruptions column (`faithful$eruptions`)."

**Right to left**, the order R runs it

- `quantile(faithful$eruptions, 0.25)`: "Take the faithful data (`faithful`), pull out its eruptions column (`$eruptions`), and find the cut point (`quantile`) at probability 0.25 (`0.25`)."
- `quantile(faithful$eruptions)`: "Take the eruptions column (`faithful$eruptions`) and find the cut points at 0%, 25%, 50%, 75% and 100% (`quantile`)."
- `IQR(faithful$eruptions)`: "Take the eruptions column (`faithful$eruptions`) and subtract Q1 from Q3 (`IQR`)."
:::

One probability given to `quantile(x, p)` returns a single cut point; no second argument returns the full five-number summary (min, Q1, median, Q3, max).

Correlation between two numeric vectors:

```r
cor(circuit.df$Resistance, circuit.df$Fail.time)
```
```text
[1] 0.8324
```

:::info R syntax
| Code | What it does |
|---|---|
| `circuit.df$Resistance` | The `Resistance` column of the data frame `circuit.df`; fills `cor()`'s `x`. |
| `circuit.df$Fail.time` | The `Fail.time` column; fills `y`. The dot is part of the column name. |
| `cor(…, …)` | Pearson's correlation between the two columns, paired row by row. |

**Left to right**

- "The correlation (`cor`) of the Resistance column (`circuit.df$Resistance`) with the Fail.time column (`circuit.df$Fail.time`) of the circuit data."

**Right to left**, the order R runs it

- "Take the circuit data (`circuit.df`), pull out its Resistance column (`$Resistance`) and its Fail.time column (`$Fail.time`), and compute their correlation (`cor`)."
:::

## The GMS top 500 as a data frame

Nexon's North America overall ranking lists the level, job and world of the top 500 GMS characters [GMS, v.271 overall ranking 2026-10-27, checked 2026-10-27]. It is a real rows-and-columns table with a categorical column, `job_name`, and numeric ones, the shape `subset()` and `table()` work on. `read.csv()` reads `job_name` as text, so `==` and `%in%` compare it directly.

```r
top500 <- read.csv("gms-ranking-overall-legendary-2026-10-27.csv")
head(top500, 3)
table(top500$level)
```
```text
  rank level exp    job_name world_id
1    1   300   0      Bishop       19
2    2   300   0    Shadower        1
3    3   300   0 Battle Mage        1

297 298 299 300 
 74 199 101 126 
```

:::info R syntax
| Code | What it does |
|---|---|
| `read.csv("gms-ranking-overall-legendary-2026-10-27.csv")` | Reads the comma-separated file named in quotes into a data frame, using its first line as column names. |
| `top500 <- …` | Stores the data frame under the name `top500`. |
| `head(top500, 3)` | The first 3 rows; the leftmost numbers in the output are row names, not data. |
| `table(top500$level)` | Counts the characters at each distinct level. |

**Left to right**

- `top500 <- read.csv(…)`: "Store under the name top500 (`top500 <-`) the table read from the CSV file (`read.csv`) named gms-ranking-overall-legendary-2026-10-27.csv (`"gms-ranking-overall-legendary-2026-10-27.csv"`)."
- `head(top500, 3)`: "The first (`head`) three rows (`3`) of top500 (`top500`)."
- `table(top500$level)`: "The count of characters at each value (`table`) of the level column (`level`) of top500 (`top500$`)."

**Right to left**, the order R runs it

- `top500 <- read.csv(…)`: "Take the file name (`"gms-ranking-overall-legendary-2026-10-27.csv"`), read that CSV file into a data frame (`read.csv`), and store it as top500 (`top500 <-`)."
- `head(top500, 3)`: "Take top500 (`top500`) and keep its first (`head`) three rows (`3`)."
- `table(top500$level)`: "Take top500 (`top500`), pull out its level column (`$level`), and count the characters at each value (`table`)."
:::

```quiz
[
  {"q": "From the table, what does `nrow(subset(top500, level == 300))` print?", "type": "numeric", "answer": 126, "tolerance": 0, "explain": "`subset()` keeps the rows where `level == 300` is TRUE; the table already counted them: 126."},
  {"q": "What does `sum(top500$level >= 299)` print?", "type": "numeric", "answer": 227, "tolerance": 0, "explain": "The logical vector is TRUE for levels 299 and 300; `sum()` counts the TRUEs: $101 + 126 = 227$."}
]
```

`table(top500$job_name)` lists all 51 jobs; the counts below come from `==`, `%in%` and the numeric column.

:::info R syntax
| Code | What it does |
|---|---|
| `top500$job_name` | `$` picks the `job_name` column of the `top500` data frame. |
| `table(…)` | Counts the characters with each distinct job. |

**Left to right**

- `table(top500$job_name)`: "The count of characters for each value (`table`) of the job column (`job_name`) of top500 (`top500$`)."

**Right to left**, the order R runs it

- `table(top500$job_name)`: "Take top500 (`top500`), pull out its job column (`$job_name`), and count the characters for each job (`table`)."
:::

```r
sum(top500$job_name == "Night Lord")
nrow(subset(top500, job_name %in% c("Night Lord", "Shadower")))
nrow(subset(top500, level == 300 & job_name == "Night Lord"))
mean(top500$level)
sd(top500$level)
```
```text
[1] 61
[1] 94
[1] 21
[1] 298.558
[1] 1.024077
```

:::info R syntax
| Code | What it does |
|---|---|
| `sum(top500$job_name == "Night Lord")` | `==` gives `TRUE` per row whose job is Night Lord; `sum()` counts the `TRUE`s. |
| `subset(top500, job_name %in% c("Night Lord", "Shadower"))` | Keeps rows whose job is either of the two; `%in%` tests membership in the set. |
| `level == 300 & job_name == "Night Lord"` | `&` keeps only rows where both comparisons are `TRUE`. |
| `nrow(subset(…))` | Counts the rows `subset()` kept. |
| `mean(top500$level)`, `sd(top500$level)` | The average level and its sample standard deviation. |

**Left to right**

- `sum(top500$job_name == "Night Lord")`: "The total (`sum`) of whether each job (`top500$job_name`) equals (`==`) Night Lord (`"Night Lord"`)."
- `nrow(subset(top500, job_name %in% c("Night Lord", "Shadower")))`: "The number of rows (`nrow`) among the rows (`subset`) of top500 (`top500`) whose job (`job_name`) is one of (`%in%`) the set (`c`) Night Lord and Shadower (`"Night Lord", "Shadower"`)."
- `nrow(subset(top500, level == 300 & job_name == "Night Lord"))`: "The number of rows (`nrow`) among the rows (`subset`) of top500 (`top500`) where the level (`level`) equals (`==`) 300 (`300`) and (`&`) the job (`job_name`) equals (`==`) Night Lord (`"Night Lord"`)."
- `mean(top500$level)`: "The average (`mean`) of the level column (`top500$level`)."
- `sd(top500$level)`: "The sample standard deviation (`sd`) of the level column (`top500$level`)."

**Right to left**, the order R runs it

- `sum(top500$job_name == "Night Lord")`: "Take top500's job column (`top500$job_name`), check each job against Night Lord (`== "Night Lord"`), and count the TRUEs (`sum`)."
- `nrow(subset(top500, job_name %in% c("Night Lord", "Shadower")))`: "Combine the two jobs into a set (`c("Night Lord", "Shadower")`), check each row's job (`job_name`) for membership (`%in%`) inside top500 (`top500`), keep the matching rows (`subset`), and count them (`nrow`)."
- `nrow(subset(top500, level == 300 & job_name == "Night Lord"))`: "Inside top500 (`top500`), check each level against 300 (`level == 300`) and each job against Night Lord (`job_name == "Night Lord"`), combine them with AND (`&`), keep the matching rows (`subset`), and count them (`nrow`)."
- `mean(top500$level)`: "Take top500's level column (`top500$level`) and average it (`mean`)."
- `sd(top500$level)`: "Take top500's level column (`top500$level`) and compute its sample standard deviation (`sd`)."
:::

## Plots: boxplot() and hist()

`boxplot(extra ~ group, data=sleep)` uses a **model formula**: `extra ~ group` means "plot `extra` grouped by `group`" (read the `~` as "explained by" / "grouped by").

```r
boxplot(extra~group, data=sleep)
```

:::info R syntax
| Code | What it does |
|---|---|
| `extra~group` | `~` builds a formula: the left side (`extra`) is plotted, split by the right side (`group`). |
| `data=sleep` | Named argument: look up the formula's column names in R's built-in `sleep` data frame. |
| `boxplot(…)` | Draws one box plot per group, side by side. |

**Left to right**

- "Draw box plots (`boxplot`) of extra (`extra`) grouped by (`~`) group (`group`), using the columns of the sleep data (`data=sleep`)."

**Right to left**, the order R runs it

- "Take the sleep data (`data=sleep`), build the formula extra grouped by group (`extra~group`), split the extra values by group, and draw one box plot per group (`boxplot`)."
:::

`hist()` needs explicit bin edges via `breaks`, and `right=FALSE` controls which end of each bin is included:

```r
hist(TenMileRace$net, breaks=seq(2800, 10600, by=200), right=FALSE, col='pink')
```

:::info R syntax
| Code | What it does |
|---|---|
| `hist(TenMileRace$net, …)` | Draws a histogram; the column fills the first argument, `x`, the values to bin. |
| `seq(2800, 10600, by=200)` | Numbers from 2800 (`from`) to 10600 (`to`) in steps of 200 (`by`). |
| `breaks=` | The bin edges: here every 200 seconds from 2800 to 10600. |
| `right=FALSE` | Each bin includes its left edge and excludes its right edge. |
| `col='pink'` | The bar fill colour; single and double quotes both make a string. |

**Left to right**

- "Draw a histogram (`hist`) of the net time column (`TenMileRace$net`) with bin edges (`breaks=`) running from 2800 to 10600 in steps of 200 (`seq(2800, 10600, by=200)`), each bin keeping its left edge only (`right=FALSE`), in pink bars (`col='pink'`)."

**Right to left**, the order R runs it

- "Take the net time column (`TenMileRace$net`), build the edges 2800, 3000, …, 10600 (`seq(2800, 10600, by=200)`) and pass them as the bins (`breaks=`), make each bin left-closed (`right=FALSE`), set the colour to pink (`col='pink'`), and draw the histogram (`hist`)."
:::

`right=FALSE` means each class interval includes its **left** endpoint but excludes its right endpoint: the bin `[3000, 3200)` includes a value of exactly 3000, and a value of exactly 3200 falls into the *next* bin. The default, `right=TRUE`, is the opposite: `(3000, 3200]`.

## Packages

`library(pkg)` loads an already-installed package into your session; `install.packages("pkg")` downloads and installs one you don't have yet. The safe pattern used in the lab checks first so you don't re-download every time:

```r
if (!require("mosaicData", quietly=TRUE)) {
  install.packages("mosaicData")
}
library(mosaicData)
```

:::info R syntax
| Code | What it does |
|---|---|
| `require("mosaicData", quietly=TRUE)` | Tries to load the package and returns `TRUE` if it worked, `FALSE` if it is not installed. |
| `quietly=TRUE` | Named argument: suppresses the loading messages. |
| `!` | NOT: turns `FALSE` into `TRUE`, so the condition holds when the package is missing. |
| `if ( … ) { … }` | Runs the lines inside the braces only when the condition in brackets is `TRUE`. |
| `install.packages("mosaicData")` | Downloads and installs the package; the name goes in quotes. |
| `library(mosaicData)` | Loads the now-installed package. |

**Left to right**

- `if (!require(…)) { install.packages(…) }`: "If (`if`) it is not true (`!`) that loading (`require`) mosaicData (`"mosaicData"`) quietly (`quietly=TRUE`) worked, then install (`install.packages`) mosaicData (`"mosaicData"`)."
- `library(mosaicData)`: "Load the package (`library`) called mosaicData (`mosaicData`)."

**Right to left**, the order R runs it

- `if (!require(…)) { install.packages(…) }`: "Try to load mosaicData quietly (`require("mosaicData", quietly=TRUE)`), flip the TRUE/FALSE result (`!`), and if that gives TRUE (`if`), run the braces: install the package (`install.packages("mosaicData")`)."
- `library(mosaicData)`: "Take the package name (`mosaicData`) and load that package (`library`)."
:::

`require()` returns `TRUE`/`FALSE` instead of erroring like a bare `library()` call would if the package were missing, so it can drive an `if`.

## Predict R's output on the GMS top 500

`counts <- c(74, 199, 101, 126)` holds the level table above, levels 297 to 300 in order; `top500` is the data frame.

:::info R syntax
| Code | What it does |
|---|---|
| `c(74, 199, 101, 126)` | `c()` combines the four counts, in this order, into one vector. |
| `counts <- …` | `<-` stores the vector under the name `counts`. |

**Left to right**

- `counts <- c(74, 199, 101, 126)`: "Store under the name counts (`counts <-`) the combination (`c`) of 74, 199, 101 and 126 (`74, 199, 101, 126`)."

**Right to left**, the order R runs it

- `counts <- c(74, 199, 101, 126)`: "Take the four counts (`74, 199, 101, 126`), combine them into one vector (`c`), and store it as counts (`counts <-`)."
:::

```quiz
[
  {"type": "fill", "q": "Fill the comparison so `sum()` counts the levels held by more than 100 characters.", "code": "counts <- c(74, 199, 101, 126)\nsum(counts ___ 100)\n## [1] 3", "answer": [">"], "explain": "`counts > 100` is FALSE TRUE TRUE TRUE; `sum()` counts the TRUEs: 199, 101 and 126 make 3."},
  {"type": "fill", "q": "Fill the position that picks out the number of level 298 characters.", "code": "counts[___]\n## [1] 199", "answer": ["2"], "explain": "R counts from 1: level 297 is position 1, so level 298's count, 199, is position 2."},
  {"q": "What does `sd(counts)` print? (4 decimals)", "type": "numeric", "answer": 53.7091, "tolerance": 0.0001, "explain": "$\\bar{X} = 500/4 = 125$; deviations $-51, 74, -24, 1$; $\\sum(X - \\bar{X})^2 = 2601 + 5476 + 576 + 1 = 8654$; `sd` divides by $n - 1 = 3$: $\\sqrt{8654/3} = 53.7091$ (R prints 53.70909)."},
  {"type": "fill", "q": "Fill the operator that tests membership in a set of jobs.", "code": "sum(top500$job_name ___ c(\"Bishop\", \"Hero\", \"Shadower\"))\n## [1] 100", "answer": ["%in%"], "explain": "`%in%` gives TRUE for each row whose job is any of the three: 30 Bishops, 37 Heroes and 33 Shadowers make 100."},
  {"q": "`rank(counts, ties.method=\"min\")` prints which vector?", "options": ["1 4 2 3", "4 1 3 2", "1 2 3 4", "74 199 101 126"], "answer": 0, "explain": "Sorted: 74, 101, 126, 199. So 74 is rank 1, 199 is rank 4, 101 is rank 2 and 126 is rank 3, printed in the original order: 1 4 2 3."}
]
```

```quiz
[
  {
    "q": "What does `sum(TenMileRace$time < 3000)` return?",
    "options": [
      "The sum of every value under 3000",
      "The count of rows where time < 3000",
      "TRUE if any value is under 3000",
      "An error, because < can't be used on a whole column"
    ],
    "answer": 1,
    "explain": "The comparison produces a logical vector; `sum()` treats TRUE as 1 and FALSE as 0, so it counts how many rows satisfy the condition (15)."
  },
  {
    "q": "Which function computes the sample standard deviation (dividing by n-1) in R?",
    "options": ["var()", "sd()", "IQR()", "range()"],
    "answer": 1,
    "explain": "`sd()` always divides by n-1, matching the sample formula s = sqrt(Σ(X-X̄)²/(n-1))."
  },
  {
    "q": "In `hist(x, breaks=seq(2800,10600,by=200), right=FALSE)`, what does `right=FALSE` mean?",
    "options": [
      "Bins include their right endpoint but not their left",
      "Bins include their left endpoint but not their right",
      "The histogram is drawn upside down",
      "Only positive values are plotted"
    ],
    "answer": 1,
    "explain": "right=FALSE makes each bin half-open on the right: [a, b) — includes a, excludes b. The default (right=TRUE) is the reverse: (a, b]."
  },
  {
    "q": "What is the difference between Preview and Knit in an R Notebook?",
    "options": [
      "They are identical",
      "Preview re-runs all chunks; Knit only renders existing output",
      "Preview renders existing chunk output without re-running code; Knit re-runs every chunk before rendering",
      "Preview only works for PDF, Knit only for HTML"
    ],
    "answer": 2,
    "explain": "Preview shows an HTML rendering of whatever output the chunks already have (no re-execution). Knit runs the whole document fresh, top to bottom, then renders it."
  },
  {
    "q": "`TenMileRace[1, \"time\"]` returns 6060. What is `TenMileRace[c(1,2,3,4,5), \"time\"]`?",
    "type": "text",
    "answer": ["6060 4515 5026 4229 5293", "6060, 4515, 5026, 4229, 5293"],
    "explain": "Passing a vector of row indices returns all those rows' time values, in order: 6060 4515 5026 4229 5293."
  },
  {
    "q": "In the variable name `mu.female`, the `.` is a member-access operator like `object.field` in C++/Java/Python.",
    "type": "tf",
    "answer": false,
    "explain": "R's `.` inside a variable name is just an ordinary character; `mu.female` is one identifier. `$` is R's operator for pulling a column out of a data frame."
  },
  {
    "q": "How many non-USA entrants does `subset(TenMileRace, nchar(as.character(state)) > 2)` find?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "explain": "US state codes are exactly 2 characters, so any `state` value longer than 2 characters is a non-US entrant. There are 32 such rows."
  },
  {
    "q": "`table(my.subset$state)` (for `my.subset <- subset(TenMileRace, state %in% c(\"VA\",\"MD\",\"DC\"))`) lists only VA, MD and DC, because `subset()` drops the unused factor levels.",
    "type": "tf",
    "answer": false,
    "explain": "`subset()` keeps every original level of the factor, so the table still lists all 62 states, most with count 0. Remove the unused levels with `droplevels()`."
  },
  {
    "q": "`rank(c(50,200,50,400,200,700), ties.method=\"min\")` returns which vector?",
    "options": ["1 2 1 4 2 5", "1 3 1 5 3 6", "1 2 3 4 5 6", "1 1 3 4 5 6"],
    "answer": 1,
    "explain": "Both `50`s tie for rank 1 (lowest tied rank). The next distinct value `200` (appearing twice) then gets rank 3, since ranks 1-2 are used by the pair of 50s. Result: 1 3 1 5 3 6."
  },
  {
    "q": "In `filter(TenMileRace, sex == \"F\", net > 10000)`, what does the comma between the two conditions mean?",
    "options": ["OR", "AND", "NOT", "It's a syntax error"],
    "answer": 1,
    "explain": "dplyr's filter() treats comma-separated conditions as AND — a row must satisfy sex == \"F\" AND net > 10000 to be kept."
  }
]
```
