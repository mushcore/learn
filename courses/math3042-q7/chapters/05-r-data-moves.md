---
title: "Working with data in RStudio: import, filter, add a column, tally"
minutes: 12
---
<!-- facts: none; the data moves use the lab's SFU weather file and the survey data, with no game context -->
Part 2 hands you a data frame and asks for a probability. Six moves take you from the raw file to that number, and each one is a line from the labs.

## A data frame is a table with named columns

A **data frame** is R's name for a table. Each **row** is one case: one student in `survey`, one day in the SFU weather file. Each **column** is one variable, and `$` picks a column out by its name. Just like a spreadsheet: one line per case, one heading per column.

**A probability from data is a count of rows that pass a test, divided by the number of rows that count.** For example, if 3 of your 10 bus rides last month were late, the share of late rides is 3 out of 10. Every move below either cleans the table or makes the test easier to write.

:::tip Every probability in Part 2 is a count over a count
So each move below does one of two jobs: put the right rows in the bottom, or make the test on top easy to write.
:::

```diagram
{"type": "flow", "title": "From the raw file to a probability", "nodes": [{"id": "raw", "label": "Raw file", "kind": "cylinder"}, {"id": "imp", "label": "Import", "sub": "with types"}, {"id": "fil", "label": "Filter", "sub": "drop NA rows"}, {"id": "col", "label": "New columns", "sub": "logical, ifelse"}, {"id": "tab", "label": "Tally", "sub": "table, mean"}, {"id": "prob", "label": "Probability", "kind": "pill"}], "edges": [{"from": "raw", "to": "imp"}, {"from": "imp", "to": "fil"}, {"from": "fil", "to": "col"}, {"from": "col", "to": "tab"}, {"from": "tab", "to": "prob"}], "hi": ["prob"], "caption": "Each arrow is one or two lines of R."}
```

## Five days small enough to hold in your head

Take five days of precipitation in millimetres: 0, 2.4, 0, 0.8, and one day with no reading, NA.

Filtering drops the NA day, which leaves 4 days. Just like a sign-up sheet with one blank line: you do not count the blank line as a person. A new column asks "more than 0?" of each day and gets FALSE, TRUE, FALSE, TRUE. Two of the four are TRUE.

- 4, the number of days left after the filter.
- 2, the number of those days with precipitation above 0.

```diagram
{"type": "grid", "title": "Five days, filtered, then tested", "nodes": [{"id": "h0", "label": "Day", "row": 0, "col": 0}, {"id": "h1", "label": "Precip (mm)", "row": 0, "col": 1}, {"id": "h2", "label": "Kept by filter", "row": 0, "col": 2}, {"id": "h3", "label": "More than 0?", "row": 0, "col": 3}, {"id": "d1", "label": "1", "row": 1, "col": 0}, {"id": "p1", "label": "0", "row": 1, "col": 1}, {"id": "k1", "label": "yes", "row": 1, "col": 2}, {"id": "t1", "label": "FALSE", "row": 1, "col": 3}, {"id": "d2", "label": "2", "row": 2, "col": 0}, {"id": "p2", "label": "2.4", "row": 2, "col": 1}, {"id": "k2", "label": "yes", "row": 2, "col": 2}, {"id": "t2", "label": "TRUE", "row": 2, "col": 3}, {"id": "d3", "label": "3", "row": 3, "col": 0}, {"id": "p3", "label": "0", "row": 3, "col": 1}, {"id": "k3", "label": "yes", "row": 3, "col": 2}, {"id": "t3", "label": "FALSE", "row": 3, "col": 3}, {"id": "d4", "label": "4", "row": 4, "col": 0}, {"id": "p4", "label": "0.8", "row": 4, "col": 1}, {"id": "k4", "label": "yes", "row": 4, "col": 2}, {"id": "t4", "label": "TRUE", "row": 4, "col": 3}, {"id": "d5", "label": "5", "row": 5, "col": 0}, {"id": "p5", "label": "NA", "row": 5, "col": 1}, {"id": "k5", "label": "dropped", "row": 5, "col": 2}, {"id": "t5", "label": "", "row": 5, "col": 3}], "hi": ["t2", "t4"], "caption": "Two TRUE rows out of the four kept: 2/4 = 0.5."}
```

$$P(\text{wet}) = \dfrac{\text{TRUE rows}}{\text{rows left}} = \dfrac{\underbrace{2}_{\text{wet days}}}{\underbrace{4}_{\text{days left after filter}}} = \mathbf{0.5}$$

Keep the NA day and the count of rows is wrong. That is why **the filter comes before the tally**.

:::warn An NA row left in still counts in the bottom
Divide by all five days and the answer drops to 0.4 instead of 0.5:

$$\dfrac{\underbrace{2}_{\text{wet days}}}{\underbrace{5}_{\text{all days, NA included}}} = 0.4$$
:::

## Six moves from the labs

### Move 1: load a package and a built-in data set

```r
library(MASS)
head(survey)
nrow(survey)
names(survey)
levels(survey$Exer)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(MASS)` | Loads the package MASS, which holds the `survey` data. |
| `head(survey)` | Shows the first six rows. |
| `nrow(survey)` | The number of rows. |
| `names(survey)` | The column names, as text. |
| `levels(survey$Exer)` | `$` picks the column `Exer`; `levels()` lists the categories a factor column can take. |

**Left to right**

- `library(MASS)`: "Load the package (`library`) MASS (`MASS`)."
- `head(survey)`: "Show the first rows (`head`) of the survey data (`survey`)."
- `nrow(survey)`: "Count the rows (`nrow`) of the survey data (`survey`)."
- `names(survey)`: "List the column names (`names`) of the survey data (`survey`)."
- `levels(survey$Exer)`: "List the categories (`levels`) of the Exer column (`$Exer`) of the survey data (`survey`)."

**Right to left**, the order R runs it

- `library(MASS)`: "Find the package MASS and load it (`library`)."
- `head(survey)`: "Take the survey data (`survey`) and print its first six rows (`head`)."
- `nrow(survey)`: "Take the survey data (`survey`) and count its rows (`nrow`)."
- `names(survey)`: "Take the survey data (`survey`) and print its column names (`names`)."
- `levels(survey$Exer)`: "Take the survey data (`survey`), pull out Exer (`$Exer`), and list its categories (`levels`)."
:::

`survey` has 237 rows, one per student. A **factor** is a column of categories with a fixed list of levels. Just like a drop-down cell in a spreadsheet: it can only hold one of the listed choices. The factor columns include `Sex`, `W.Hnd`, `Exer` with the levels Freq, Some and None, and `Smoke` with Heavy, Regul, Occas and Never. The numeric ones include `Pulse`, `Height` and `Age`. Several columns contain NA.

:::warn Knitting starts from an empty session
`survey` can work in the console and still fail in the knit. **Put `library(MASS)` in the notebook above the first use of `survey`.**
:::

### Move 2: import a CSV with a type for every column

A **CSV** is a plain text file of a table, with commas between the values. The SFU weather file, `SFU.Weather.with.Precip.csv`, holds daily weather at SFU, one row per day.

```r
SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv",
                        header=TRUE, na.strings ="NA",
                        colClasses = c("Date", "integer",
                                       "character", "integer",
                                       "numeric", "numeric",
                                       "numeric"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather <- read.csv(…)` | `<-` stores the data frame that `read.csv` reads from the file. |
| `"SFU.Weather.with.Precip.csv"` | The file name, in quotes; the file sits in the same folder as the notebook. |
| `header=TRUE` | The first line of the file holds the column names. |
| `na.strings ="NA"` | The text NA in the file means a missing value. |
| `colClasses = c(…)` | One type per column, in the file's order; `c()` combines the seven type names into one vector. |
| `"Date"`, `"integer"`, `"character"`, `"numeric"` | A date, a whole number, text, and a decimal number. |

**Left to right**

- "Store under the name SFU.Weather (`SFU.Weather <-`) the table read from the CSV file (`read.csv`) with a header line (`header=TRUE`), NA as missing (`na.strings ="NA"`) and these seven column types (`colClasses = c(…)`)."

**Right to left**, the order R runs it

- "Combine the seven type names (`c`), read the file with them (`read.csv`, `header=TRUE`, `na.strings ="NA"`), and store the data frame (`SFU.Weather <-`)."
:::

The seven columns are Date, Year, Month, Day, `Temp.deg.C`, `Total.Rain.mm` and `Total.Precip.mm`. **Without `colClasses` the Date column arrives as text and a date function cannot read it.** Just like a spreadsheet cell holding a date as plain text: it cannot sort by date or give a weekday.

:::tip colClasses is what lets weekdays() work later
[The next lesson](#/math3042-q7/r-probabilities-from-data) turns each Date into a day name, and that only works on a column read as a date.
:::

### Move 3: drop the rows with missing values

```r
library(dplyr)
SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C), !is.na(Total.Precip.mm))
# or, with no package, in base R
SFU.Weather <- subset(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))
nrow(SFU.Weather)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr)` | Loads dplyr, the package that provides `filter()`. |
| `filter(SFU.Weather, …, …)` | `filter(data, cond, cond)`: keeps the rows where every condition is TRUE. The commas act as AND. |
| `is.na(Temp.deg.C)` | TRUE where the temperature is missing. Inside `filter` a column is named without `SFU.Weather$`. |
| `!` | NOT: flips TRUE and FALSE, so `!is.na(…)` is TRUE where a value is present. |
| `#` | Starts a comment; R ignores the rest of the line. |
| `subset(SFU.Weather, …)` | `subset(data, cond)`: base R's version, with one condition. |
| `&` | AND: TRUE only when both sides are TRUE. |
| `nrow(SFU.Weather)` | The number of rows left. |

**Left to right**

- `library(dplyr)`: "Load the package (`library`) dplyr."
- `SFU.Weather <- filter(…)`: "Store back under SFU.Weather (`SFU.Weather <-`) the rows kept (`filter`) where the temperature is not missing (`!is.na(Temp.deg.C)`) and the precipitation is not missing (`!is.na(Total.Precip.mm)`)."
- `SFU.Weather <- subset(…)`: "Store back under SFU.Weather (`SFU.Weather <-`) the rows kept (`subset`) where the temperature is present (`!is.na`) and (`&`) the precipitation is present (`!is.na`)."
- `nrow(SFU.Weather)`: "Count the rows (`nrow`) of SFU.Weather."

**Right to left**, the order R runs it

- `library(dplyr)`: "Find dplyr and load it (`library`)."
- `SFU.Weather <- filter(…)`: "Test each row for a missing temperature (`is.na`), flip it (`!`), do the same for precipitation, keep the rows passing both (`filter`), and store the result (`SFU.Weather <-`)."
- `SFU.Weather <- subset(…)`: "Test both columns for missing values (`is.na`), flip each (`!`), join with AND (`&`), keep the TRUE rows (`subset`), and store the result (`SFU.Weather <-`)."
- `nrow(SFU.Weather)`: "Take SFU.Weather and count its rows (`nrow`)."
:::

Either line gives the same rows. After the filter, `nrow` counts 17582 days in the SFU file, and a plot title built from it reads n = 17582 days.

A comparison such as `Temp.deg.C != NA` does not work: **any comparison with NA gives NA, never TRUE.**

:::warn Use is.na(), never == NA or != NA
A filter on `Temp.deg.C != NA` gets NA on every row, so it keeps no rows at all.
:::

### Move 4: add a logical column

A **logical column** (a **logical vector** inside a data frame) holds only TRUE, FALSE or NA, one per row. Just like a checkbox column in a spreadsheet: ticked or not ticked on each line.

```r
SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)
survey$is.Smoker <- (survey$Smoke != "Never")
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather$has.Precip <-` | `$` with a new name adds a column to the data frame. |
| `SFU.Weather$Total.Precip.mm > 0` | Compares every row with 0 and gives TRUE or FALSE for each. |
| `( … )` | The brackets only group; the column is the same without them. |
| `survey$Smoke != "Never"` | `!=` is "not equal": TRUE for every student whose Smoke level is anything but Never. The level name is a string, in quotes. |

**Left to right**

- `SFU.Weather$has.Precip <- …`: "Store in a new column has.Precip (`SFU.Weather$has.Precip <-`) whether the precipitation (`SFU.Weather$Total.Precip.mm`) is more than (`>`) zero (`0`)."
- `survey$is.Smoker <- …`: "Store in a new column is.Smoker (`survey$is.Smoker <-`) whether the Smoke level (`survey$Smoke`) is not equal to (`!=`) Never (`"Never"`)."

**Right to left**, the order R runs it

- `SFU.Weather$has.Precip <- …`: "Pull out the precipitation column (`$Total.Precip.mm`), compare each value with 0 (`> 0`), and store the TRUE/FALSE values as has.Precip (`SFU.Weather$has.Precip <-`)."
- `survey$is.Smoker <- …`: "Pull out the Smoke column (`$Smoke`), test each value against Never (`!= "Never"`), and store the TRUE/FALSE values as is.Smoker (`survey$is.Smoker <-`)."
:::

**A row whose Smoke is NA gets NA in `is.Smoker`, not FALSE.** The NA stays until you filter it out or tell a function to skip it.

:::tip TRUE counts 1 and FALSE counts 0
That is why `sum()` of a logical column is the number of TRUE rows, which Move 6 uses.
:::

### Move 5: segment with ifelse and %in%

To **segment** is to give each row a group label. Just like sorting mail into boxes: try the first box, and if the letter does not fit, try the next one.

```r
SFU.Weather$Season <- with(SFU.Weather,
    ifelse(Month %in% c("Jun","Jul","Aug"), "Summer",
      ifelse(Month %in% c("Sep","Oct","Nov"), "Autumn",
        ifelse( Month %in% c("Dec","Jan","Feb"), "Winter",
          ifelse(Month %in% c("Mar","Apr","May"), "Spring",
            NA)))))
SFU.Weather$Temp.Seg <- with(SFU.Weather,
    ifelse( Z.Temp.anomaly < -0.4307, "Cold",
      ifelse (Z.Temp.anomaly <= 0.4307, "Mid",
        "Warm")))
```

:::info R syntax
| Code | What it does |
|---|---|
| `with(SFU.Weather, …)` | Inside the brackets a column is named on its own, so `Month` means `SFU.Weather$Month`. |
| `ifelse(…, "Summer", …)` | Three slots, `test`, `yes`, `no`: the `yes` value where the test is TRUE, the `no` value elsewhere, row by row. |
| `Month %in% c("Jun","Jul","Aug")` | `%in%` is TRUE for each row whose month is one of the three listed. |
| `ifelse(…, "Summer", ifelse(…))` | The `no` slot holds the next `ifelse`, so a row falls through until a test is TRUE. |
| `NA` | The last `no`: a month in none of the lists gets a missing value. |
| `Z.Temp.anomaly < -0.4307` | The lab's standardized temperature column compared with the lower cut point. |
| `<=` | Less than or equal: the Mid band includes 0.4307. |

**Left to right**

- `SFU.Weather$Season <- …`: "Store in a new column Season (`SFU.Weather$Season <-`), working inside the weather data (`with`), Summer if (`ifelse`) the month is in (`%in%`) June to August (`c(…)`), else Autumn for September to November, else Winter for December to February, else Spring for March to May, else missing (`NA`)."
- `SFU.Weather$Temp.Seg <- …`: "Store in a new column Temp.Seg (`SFU.Weather$Temp.Seg <-`), inside the weather data (`with`), Cold if (`ifelse`) the anomaly is below −0.4307 (`<`), else Mid if it is at most 0.4307 (`<=`), else Warm."

**Right to left**, the order R runs it

- `SFU.Weather$Season <- …`: "For each row, test the month against the summer list (`%in%`), then the autumn, winter and spring lists in turn (the inner `ifelse` calls), pick the first label that matches, and store the labels as Season (`SFU.Weather$Season <-`)."
- `SFU.Weather$Temp.Seg <- …`: "For each row, test the anomaly against −0.4307 (`<`), then against 0.4307 (`<=`), choose Cold, Mid or Warm (`ifelse`), and store the labels as Temp.Seg (`SFU.Weather$Temp.Seg <-`)."
:::

`Z.Temp.anomaly` is each day's temperature minus its month's mean, divided by its month's standard deviation. The cut points −0.4307 and 0.4307 split it into three groups of about a third each. **Two groups need one `ifelse`; four groups need three nested ones plus a last `no`.** For example, three groups (Cold, Mid, Warm) need two.

:::tip %in% replaces a chain of == tests joined by OR
`Month %in% c("Jun","Jul","Aug")` gives the same TRUE/FALSE as testing Jun, Jul and Aug one at a time and joining them with OR.
:::

### Move 6: tally, then divide

To **tally** is to count. Just like counting the ticked boxes in a checkbox column, then dividing by the number of lines. The formula is the five-day case again, with the SFU file's rows:

- 17582, the number of days left in the SFU file after the filter.

$$P(\text{Cold}) = \dfrac{\text{rows where Temp.Seg is Cold}}{\text{all rows}} = \dfrac{\text{Cold days}}{\underbrace{17582}_{\text{days left after filter}}} = \mathbf{0.3439}$$

```r
p.Cold <- sum(SFU.Weather$Temp.Seg == "Cold") / nrow(SFU.Weather)
p.Mid <- sum(SFU.Weather$Temp.Seg == "Mid") / nrow(SFU.Weather)
p.Warm <- sum(SFU.Weather$Temp.Seg == "Warm") / nrow(SFU.Weather)
round(c(p.Cold, p.Mid, p.Warm), 4)
```

```text
[1] 0.3439 0.3388 0.3174
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather$Temp.Seg == "Cold"` | `==` tests equality: TRUE on every Cold day. |
| `sum(…)` | Adds the TRUE/FALSE values; TRUE counts 1, so this is the number of Cold days. |
| `/ nrow(SFU.Weather)` | Divides by the number of rows. |
| the `p.Mid` and `p.Warm` lines | The same pattern for the other two labels. |
| `round(c(p.Cold, p.Mid, p.Warm), 4)` | `c()` puts the three in one vector; `round(x, digits)` rounds each to 4 decimals. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `p.Cold <- …` and the two lines like it: "Store under the name p.Cold (`p.Cold <-`) the count (`sum`) of days whose segment (`SFU.Weather$Temp.Seg`) equals (`==`) Cold, divided by (`/`) the number of rows (`nrow`)."
- `round(…)`: "Round (`round`) the three probabilities combined (`c`) to four decimals (`4`)."

**Right to left**, the order R runs it

- `p.Cold <- …` and the two lines like it: "Pull out the segment column (`$Temp.Seg`), test each day for Cold (`==`), count the TRUEs (`sum`), divide by the row count (`nrow`), and store it (`p.Cold <-`)."
- `round(…)`: "Combine the three values (`c`), round each to four decimals (`round`), and print."
:::

The three printed values add to 1.0001; the extra 0.0001 is rounding.

:::warn == compares, = assigns
Typed on its own line, `SFU.Weather$Temp.Seg = "Cold"` does not count anything: it overwrites every label with Cold.
:::

The same tallies on `survey`:

```r
table(survey$Exer)
prop.table(table(survey$Exer))
table(survey[c("Exer", "Smoke")])
mean(SFU.Weather$Temp.Seg == "Cold")
```

:::info R syntax
| Code | What it does |
|---|---|
| `table(survey$Exer)` | Counts the students in each Exer level. NA values are left out of the count. |
| `prop.table(table(…))` | `prop.table(t)` divides each count by the table's total, so the entries are proportions that add to 1. |
| `survey[c("Exer", "Smoke")]` | `[ ]` with a vector of names keeps just those two columns. |
| `table(survey[…])` | Two columns in, a two-way table out: rows by Exer, columns by Smoke. |
| `mean(SFU.Weather$Temp.Seg == "Cold")` | The mean of TRUE/FALSE values is the share of TRUE, the same number as `p.Cold`. |

**Left to right**

- `table(survey$Exer)`: "Count (`table`) each level of Exer (`$Exer`) in survey."
- `prop.table(table(survey$Exer))`: "The proportions (`prop.table`) of the count table (`table`) of Exer (`survey$Exer`)."
- `table(survey[c("Exer", "Smoke")])`: "Count (`table`) every combination in the Exer and Smoke columns (`survey[c("Exer", "Smoke")]`)."
- `mean(SFU.Weather$Temp.Seg == "Cold")`: "The average (`mean`) of whether each segment (`SFU.Weather$Temp.Seg`) equals (`==`) Cold."

**Right to left**, the order R runs it

- `table(survey$Exer)`: "Pull out Exer (`$Exer`) and count each level (`table`)."
- `prop.table(table(survey$Exer))`: "Pull out Exer (`$Exer`), count each level (`table`), and divide by the total (`prop.table`)."
- `table(survey[c("Exer", "Smoke")])`: "Combine the two names (`c`), keep those columns (`[ ]`), and count each pair of levels (`table`)."
- `mean(SFU.Weather$Temp.Seg == "Cold")`: "Pull out the segments (`$Temp.Seg`), test each for Cold (`==`), and average the TRUE/FALSE values (`mean`)."
:::

No printed values are given here for `survey`; Part 2 marks the code that produces them.

The long version of every move is in [Lab 5: conditional probability in R](#/math3042-u4/lab5-conditional-r) and [Review: working with data in R](#/math3042-midterm/review-r-data).

## A pulse study on survey and a new CSV, one blank per line

```quiz
[
  {"type": "fill", "q": "Keep only the students with a recorded pulse and an exercise level.", "code": "survey2 <- filter(survey, ___(Pulse), !is.na(Exer))", "answer": ["!is.na"], "explain": "The full line is `survey2 <- filter(survey, !is.na(Pulse), !is.na(Exer))`. `is.na()` is TRUE on a missing value and `!` flips it, so the row stays when the pulse is present. The comma between the two conditions means AND."},
  {"type": "fill", "q": "A logical column that is TRUE for every student who does not write with the right hand.", "code": "survey$not.Right <- (survey$W.Hnd ___ \"Right\")", "answer": ["!="], "explain": "The full line is `survey$not.Right <- (survey$W.Hnd != \"Right\")`. `!=` is \"not equal\", so Left gives TRUE and Right gives FALSE. A student with NA in `W.Hnd` gets NA."},
  {"type": "fill", "q": "Label a student Active when the exercise level is Freq or Some, Inactive otherwise.", "code": "survey$Active <- ifelse(survey$Exer ___ c(\"Freq\",\"Some\"), \"Active\", \"Inactive\")", "answer": ["%in%"], "explain": "The full line is `survey$Active <- ifelse(survey$Exer %in% c(\"Freq\",\"Some\"), \"Active\", \"Inactive\")`. `%in%` is TRUE when the level is one of the listed ones; `ifelse(test, yes, no)` then picks the label row by row."},
  {"type": "fill", "q": "The barplot title must show the number of students left after the filter, computed, not typed.", "code": "main=paste0(\"Pulse of surveyed students (n = \", ___(survey2), \")\")", "answer": ["nrow"], "explain": "The full argument is `main=paste0(\"Pulse of surveyed students (n = \", nrow(survey2), \")\")`. `nrow()` counts the rows of the filtered frame, so the title stays right if the filter changes. Lab 5's title used the same move and printed n = 17582 days."},
  {"type": "fill", "q": "The share of students at each Smoke level, as proportions that add to 1.", "code": "___(table(survey$Smoke))", "answer": ["prop.table"], "explain": "The full line is `prop.table(table(survey$Smoke))`. `table()` counts each level; `prop.table()` divides each count by the total of the table."},
  {"type": "fill", "q": "Import a two-column file of dates and readings so the first column is a real date.", "code": "readings <- read.csv(\"readings.csv\", header=TRUE, ___=c(\"Date\",\"numeric\"))", "answer": ["colClasses"], "explain": "The full line is `readings <- read.csv(\"readings.csv\", header=TRUE, colClasses=c(\"Date\",\"numeric\"))`. `colClasses` takes one type per column in the file's order; without it the date column is read as text."}
]
```

## Remember

- A probability from data is the rows that pass the test over the rows that count.
- `colClasses` gives one type per column, in the file's order.
- Drop missing rows with `!` and `is.na()` inside `filter()` or `subset()`; a comparison with NA is never TRUE.
- `$` with a new name adds a column; a comparison fills it with TRUE and FALSE.
- `ifelse()` nests for more than two groups; `%in%` tests "one of these".
- `table()` counts, `prop.table()` turns counts into proportions, and `mean()` of a TRUE/FALSE column is the proportion of TRUE.
- The title's n comes from `nrow()`, never typed.
