---
title: R from Lab 1
minutes: 18
---

The R mechanics from **Lab 1** (`Lab_01_Notebook.Solutions.pdf`, `demo_notebook_Unit_01.Rmd`) and what each one returns.

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

Index with `[row, column]`, by position or by name:

```r
TenMileRace[1, 2]
TenMileRace[1, "time"]
```
```text
[1] 6060
[1] 6060
```

A vector of rows picks several rows at once:

```r
TenMileRace[c(1,2,3,4,5), "time"]
```
```text
[1] 6060 4515 5026 4229 5293
```

`$` pulls out a whole column as a vector. `TenMileRace` has 8636 rows, so printing the whole column would flood the console; `head()` shows just the first several:

```r
head(TenMileRace$time, 5)
```
```text
[1] 6060 4515 5026 4229 5293
```

## Logical vectors and counting

Comparing a column to a value gives a **Boolean (logical) vector** — one `TRUE`/`FALSE` per row, not a single answer:

```r
TenMileRace$time < 3000
```
```text
[1] FALSE FALSE FALSE FALSE FALSE ...
```

R treats `FALSE` as `0` and `TRUE` as `1`, so summing a logical vector **counts how many are TRUE**:

```r
sum(TenMileRace$time < 3000)
```
```text
[1] 15
```

Use the same condition inside `[rows, ]` to pull out the matching rows (empty column slot = "all columns"):

```r
TenMileRace[TenMileRace$time < 3000, "time"]
```
```text
[1] 2825 2818 2852 2933 2874 2836 2961 2999 2899 2963 2876 2816 2872 2891 2869
```

## Subsetting: subset(), &, |, !, %in%

`subset(df, condition)` is a cleaner way to write the same row filter:

```r
subset(TenMileRace, net > 10000)
```

Combine conditions with `&` (AND), `|` (OR), `!` (NOT) — same as C++'s `&&`/`||`/`!` but vectorized over every row at once:

```r
subset(TenMileRace, net > 10000 & sex == "F")
```

`%in%` checks membership in a set of values — much shorter than chaining `|`:

```r
subset(TenMileRace, state %in% c("VA","MD","DC"))
```

`dplyr::filter()` does the same job; **commas between conditions mean AND**:

```r
library(dplyr)
filter(TenMileRace, sex == "F", net > 10000)
```

A practical trick: US state codes are 2 characters, so a `state` value longer than 2 characters means the runner registered from outside the US. `as.character()` converts the factor to plain text first so `nchar()` can measure it:

```r
non.usa.runners <- subset(TenMileRace, nchar(as.character(state)) > 2)
nrow(non.usa.runners)
```
```text
[1] 32
```

32 runners in `TenMileRace` are non-US entrants.

## Factors: levels(), table(), droplevels()

`sex` is stored as a **factor** — a categorical variable with a fixed set of allowed values (**levels**):

```r
levels(TenMileRace$sex)
```
```text
[1] "F" "M"
```

`table()` counts how many rows fall in each level:

```r
table(TenMileRace$sex)
```
```text
   F    M
4325 4311
```

If you `table()` a **subset** of the data, R still lists every original level, even ones with zero rows in that subset — because the factor still "remembers" all its possible levels, only the counts changed:

```r
my.subset <- subset(TenMileRace, state %in% c("VA", "MD", "DC"))
table(my.subset$state)
```
```text
 AK  AL  AR  AZ  CA  CO  CT  DC  DE  ...  MD  ...  VA  ...  WV
  0   0   0   0   0   0   0 1642   0  ... 2166  ... 3689 ...   0
```

`droplevels()` removes the levels that have zero rows left, so `table()` only shows the ones actually present:

```r
table(droplevels(my.subset$state))
```
```text
  DC   MD   VA
1642 2166 3689
```

`which.max()` finds the level with the biggest count. Restrict to two-character (US) state codes first, then ask which level has the most runners:

```r
usa.runners <- droplevels(subset(TenMileRace, nchar(as.character(state)) == 2))
us.state.tab <- table(usa.runners$state)
levels(usa.runners$state)[which.max(us.state.tab)]
```
```text
[1] "VA"
```

## rank()

`rank()` converts values to their position when sorted; ties share a rank. `ties.method="min"` gives tied values the **lowest** rank in their tied group:

```r
rank(c(50,200,50,400,200,700), ties.method="min")
```
```text
[1] 1 3 1 5 3 6
```

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

`sd()` always computes the **sample** standard deviation, dividing by $n-1$ like the by-hand formula (plywood example in the pencil problems: `sd(X.vals)` → 0.006560179). There is no built-in population-sd function; write `sqrt(sum((x-mean(x))^2)/length(x))` for that.

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

One probability given to `quantile(x, p)` returns a single cut point; no second argument returns the full five-number summary (min, Q1, median, Q3, max).

Correlation between two numeric vectors:

```r
cor(circuit.df$Resistance, circuit.df$Fail.time)
```
```text
[1] 0.8324
```

## Plots: boxplot() and hist()

`boxplot(extra ~ group, data=sleep)` uses a **model formula**: `extra ~ group` means "plot `extra` grouped by `group`" (read the `~` as "explained by" / "grouped by").

```r
boxplot(extra~group, data=sleep)
```

`hist()` needs explicit bin edges via `breaks`, and `right=FALSE` controls which end of each bin is included:

```r
hist(TenMileRace$time, breaks=seq(2800, 10600, by=200), right=FALSE, col='pink')
```

`right=FALSE` means each class interval includes its **left** endpoint but excludes its right endpoint: the bin `[3000, 3200)` includes a value of exactly 3000, and a value of exactly 3200 falls into the *next* bin. The default, `right=TRUE`, is the opposite: `(3000, 3200]`.

## Packages

`library(pkg)` loads an already-installed package into your session; `install.packages("pkg")` downloads and installs one you don't have yet. The safe pattern used in the lab checks first so you don't re-download every time:

```r
if (!require("mosaicData", quietly=TRUE)) {
  install.packages("mosaicData")
}
library(mosaicData)
```

`require()` returns `TRUE`/`FALSE` instead of erroring like a bare `library()` call would if the package were missing, so it can drive an `if`.

## Predict R's output for new vectors

Each item runs one Lab 1 function on a new vector.

```quiz
[
  {"type": "fill", "q": "Fill the blank so ties share the lowest rank.", "code": "rank(c(14, 9, 21, 9, 30, 14), ties.method=\"___\")\n## [1] 3 1 5 1 6 3", "answer": ["min"], "explain": "Sorted: 9, 9, 14, 14, 21, 30. The two 9s share rank 1, the two 14s share rank 3 (ranks 1 and 2 are used up), then 21 is 5 and 30 is 6."},
  {"type": "fill", "q": "Fill the comparison so `sum()` counts the values above 10.", "code": "x <- c(7, 15, 3, 22, 18, 9)\nsum(x ___ 10)\n## [1] 3", "answer": [">"], "explain": "`x > 10` is FALSE TRUE FALSE TRUE TRUE FALSE; `sum()` counts the TRUEs: 15, 22, 18 make 3."},
  {"type": "fill", "q": "Fill the two positions that pick out 15 and 22.", "code": "x <- c(7, 15, 3, 22, 18, 9)\nx[c(___, ___)]\n## [1] 15 22", "answer": ["2", "4"], "explain": "R counts from 1: position 2 holds 15 and position 4 holds 22."},
  {"q": "`scores <- c(71, 85, 64, 90, 78)`. What does `sd(scores)` print? (4 decimals)", "type": "numeric", "answer": 10.4547, "tolerance": 0.0001, "explain": "$\\bar{X} = 388/5 = 77.6$; $\\sum(X - \\bar{X})^2 = 437.2$; `sd` divides by $n - 1 = 4$: $\\sqrt{437.2/4} = 10.4547$ (R prints 10.45466)."},
  {"q": "Same `scores`. What does `IQR(scores)` print?", "type": "numeric", "answer": 14.0, "tolerance": 0, "explain": "Sorted 64, 71, 78, 85, 90. With $n = 5$, R's quartiles land exactly on the 2nd and 4th values: $Q_1 = 71$, $Q_3 = 85$, so $IQR = 14$."},
  {"q": "`hist(x, breaks=seq(60, 100, by=10), right=FALSE)`. A value of exactly 80 is counted in which class?", "options": ["[80, 90)", "[70, 80)", "both", "neither"], "answer": 0, "explain": "right=FALSE closes each class on the left and opens it on the right, so 80 starts the class [80, 90) and is excluded from [70, 80)."}
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
