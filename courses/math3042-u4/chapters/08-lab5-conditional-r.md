---
title: Lab 5: conditional probability from the SFU weather data
minutes: 30
---
<!-- facts: poe1.ladder.hc-dead-by-rank -->

Lab 5 asks four questions of 58 years of daily SFU weather (1965–2022): are Mondays wetter, which season is wettest, do cold or warm days change the chance of precipitation, and does the season change that? Packages: `dplyr`, `mosaic`.

## Import: tell read.csv the column types

```r
SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv",
                        header=TRUE, na.strings="NA",
                        colClasses = c("Date", "integer", "character", "integer",
                                       "numeric", "numeric", "numeric"))
months <- c("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")
nrow(SFU.Weather)
```
```text
[1] 21184
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather <- read.csv(…)` | `<-` is assignment: the data frame `read.csv()` returns is stored as `SFU.Weather`. The dots are part of the name. |
| `"SFU.Weather.with.Precip.csv"` | The file to read, a string in quotes, looked for in the working directory. |
| `header=TRUE` | The file's first line holds the column names. |
| `na.strings="NA"` | Cells containing the text NA become missing values. |
| `colClasses = c("Date", "integer", …)` | `c()` combines seven type names, one per column in order: Date, integer, text, integer and three numeric. |
| `months <- c("Jan", …, "Dec")` | A vector of the 12 month abbreviations in calendar order. |
| `nrow(SFU.Weather)` | The number of rows in the data frame. |
| `[1]` | R starts each printed line with the position of its first value; `[1]` means value 1. |

**Left to right**

- `SFU.Weather <- read.csv(…)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the table read from the CSV file (`read.csv`) named SFU.Weather.with.Precip.csv, whose first line is the header (`header=TRUE`), where NA means missing (`na.strings="NA"`), with the seven column types combined in order (`colClasses = c(…)`)."
- `months <- c(…)`: "Store under the name months (`months <-`) the combination (`c`) of the twelve month names."
- `nrow(SFU.Weather)`: "The number of rows (`nrow`) of SFU.Weather (`SFU.Weather`)."

**Right to left**, the order R runs it

- `SFU.Weather <- read.csv(…)`: "Combine the seven type names (`c`), read the file with the header, the NA rule and those types (`read.csv`, `header=TRUE`, `na.strings`, `colClasses`), and store the data frame as SFU.Weather (`SFU.Weather <-`)."
- `months <- c(…)`: "Combine the twelve names (`c`), then store them as months (`months <-`)."
- `nrow(SFU.Weather)`: "Take SFU.Weather, count its rows (`nrow`), and print."
:::

`colClasses` makes `Date` a real Date, which `weekdays()` needs later; `Total.Precip.mm` is rain plus melted snow. `months` fixes the calendar order, since text sorts alphabetically.

## Task 1: filter out the missing days

`filter(df, condition)` keeps the rows where the condition is `TRUE`. `is.na()` is the only test that detects `NA` (`x == NA` is itself `NA`):

```r
SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))
nrow(SFU.Weather)
```
```text
[1] 17582
```

:::info R syntax
| Code | What it does |
|---|---|
| `filter(SFU.Weather, …)` | dplyr's `filter()`: keeps the rows where the condition is TRUE. Columns are named directly, without `$`. |
| `is.na(Temp.deg.C)` | TRUE for each missing value in the column. |
| `!` | NOT: flips TRUE and FALSE, so `!is.na(…)` is TRUE where a value is present. |
| `&` | AND: TRUE only where the conditions on both sides are TRUE. |
| `SFU.Weather <- …` | Overwrites the data frame with the filtered one. |
| `nrow(SFU.Weather)` | The number of rows left. |

**Left to right**

- `SFU.Weather <- filter(…)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the rows kept (`filter`) from SFU.Weather where the temperature is not (`!`) missing (`is.na(Temp.deg.C)`) and (`&`) the precipitation is not (`!`) missing (`is.na(Total.Precip.mm)`)."
- `nrow(SFU.Weather)`: "The number of rows (`nrow`) of SFU.Weather."

**Right to left**, the order R runs it

- `SFU.Weather <- filter(…)`: "Test each temperature and precipitation for missing (`is.na`), flip both tests (`!`), require both (`&`), keep the matching rows (`filter`), and store the result back as SFU.Weather (`SFU.Weather <-`)."
- `nrow(SFU.Weather)`: "Take SFU.Weather, count its rows (`nrow`), and print."
:::

21 184 days become 17 582. Without it `mean()` returns `NA`.

## Tasks 2 and 3: grouped mean and sd with mosaic's formula interface

mosaic's `mean()` and `sd()` accept `y ~ group`:

```r
Monthly.Mean.Temp <- mean(Temp.deg.C ~ Month, data=SFU.Weather)
Monthly.SD.Temp <- sd(Temp.deg.C ~ Month, data=SFU.Weather)
round(Monthly.Mean.Temp, 2)
```
```text
  Apr   Aug   Dec   Feb   Jan   Jul   Jun   Mar   May   Nov   Oct   Sep
 8.41 17.39  2.89  4.16  2.90 17.10 14.54  5.82 11.82  5.36  9.70 14.52
```

:::info R syntax
| Code | What it does |
|---|---|
| `Temp.deg.C ~ Month` | `~` builds a formula; mosaic's `mean()` reads it as "Temp.deg.C for each value of Month". |
| `data=SFU.Weather` | The data frame where the column names in the formula are found. |
| `mean(…)`, `sd(…)` | With a formula, mosaic returns one mean (or standard deviation) per month, as a named vector. |
| `round(Monthly.Mean.Temp, 2)` | `round(x, digits)`: each monthly mean to 2 decimals. |
| printed names | A named vector prints each name above its value; there is no `[1]`. |

**Left to right**

- `Monthly.Mean.Temp <- mean(…)`: "Store under the name Monthly.Mean.Temp (`Monthly.Mean.Temp <-`) the mean (`mean`) of temperature (`Temp.deg.C`) by (`~`) month (`Month`) in SFU.Weather (`data=SFU.Weather`)."
- `Monthly.SD.Temp <- sd(…)`: "Store under the name Monthly.SD.Temp (`Monthly.SD.Temp <-`) the standard deviation (`sd`) of temperature by (`~`) month in SFU.Weather (`data=`)."
- `round(Monthly.Mean.Temp, 2)`: "Round (`round`) the monthly means (`Monthly.Mean.Temp`) to 2 decimals (`2`)."

**Right to left**, the order R runs it

- `Monthly.Mean.Temp <- mean(…)`: "Look in SFU.Weather (`data=`), group temperature by month (`~`), average each group (`mean`), and store the named vector as Monthly.Mean.Temp (`Monthly.Mean.Temp <-`)."
- `Monthly.SD.Temp <- sd(…)`: "Group temperature by month (`~`), take each group's standard deviation (`sd`), and store it as Monthly.SD.Temp (`Monthly.SD.Temp <-`)."
- `round(Monthly.Mean.Temp, 2)`: "Take the monthly means, round them to 2 decimals (`round`), and print."
:::

The result is a **named vector** in alphabetical order; `Monthly.Mean.Temp[months]` returns Jan to Dec, so Task 3's chart is

```r
barplot(Monthly.Mean.Temp[months], col="lightblue",
        xlab="Month", ylab="Mean Temp (deg C)",
        main=paste0("Mean Monthly Temperature at SFU (", min(SFU.Weather$Year),
                    "-", max(SFU.Weather$Year), ")"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `Monthly.Mean.Temp[months]` | `[ ]` with a vector of names picks those entries in that order: January to December. |
| `col="lightblue"` | The bar fill colour. |
| `xlab=`, `ylab=` | The x-axis and y-axis labels, as strings. |
| `main=paste0(…)` | The title. `paste0()` joins its pieces into one string with nothing between them. |
| `SFU.Weather$Year` | `$` takes one column of a data frame by name. |
| `min(…)`, `max(…)` | The first and last year, so the year range in the title is computed, not typed. |

**Left to right**

- "Draw a bar chart (`barplot`) of the monthly means in calendar order (`Monthly.Mean.Temp[months]`), in light blue (`col="lightblue"`), with axis labels (`xlab=`, `ylab=`), titled (`main=`) by joining (`paste0`) the text, the smallest (`min`) year of the Year column (`SFU.Weather$Year`), a dash, the largest (`max`) year, and a closing bracket."

**Right to left**, the order R runs it

- "Pull out the Year column (`SFU.Weather$Year`), find its smallest and largest values (`min`, `max`), join them with the text into one title (`paste0`), reorder the means by month name (`Monthly.Mean.Temp[months]`), and draw the bars with the colour, labels and title (`barplot`, `col=`, `xlab=`, `ylab=`, `main=`)."
:::

Warmest two months: **Aug (17.39) and Jul (17.10)**; coldest two: **Dec (2.89) and Jan (2.90)**.

## with(): work inside the data frame

`with(df, expr)` evaluates `expr` with the columns in scope, without `df$`:

```r
max(SFU.Weather$Temp.deg.C) - min(SFU.Weather$Temp.deg.C)
with(SFU.Weather, max(Temp.deg.C) - min(Temp.deg.C))
```
```text
[1] 51.8
[1] 51.8
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather$Temp.deg.C` | As above, `$` takes the temperature column. |
| `max(…) - min(…)` | The largest temperature minus the smallest. |
| `with(SFU.Weather, …)` | `with(data, expr)`: runs expr with the data frame's columns usable by name, so no `$` is needed. |

**Left to right**

- `max(SFU.Weather$Temp.deg.C) - min(SFU.Weather$Temp.deg.C)`: "The largest (`max`) of the temperature column of SFU.Weather (`SFU.Weather$Temp.deg.C`) minus (`-`) the smallest (`min`) of the same column."
- `with(SFU.Weather, max(Temp.deg.C) - min(Temp.deg.C))`: "Inside SFU.Weather (`with`), the largest (`max`) temperature (`Temp.deg.C`) minus (`-`) the smallest (`min`) temperature."

**Right to left**, the order R runs it

- `max(SFU.Weather$Temp.deg.C) - min(SFU.Weather$Temp.deg.C)`: "Pull out the temperature column (`$Temp.deg.C`), find its largest and smallest values (`max`, `min`), subtract (`-`), and print."
- `with(SFU.Weather, max(Temp.deg.C) - min(Temp.deg.C))`: "Make SFU.Weather's columns visible (`with`), find the largest and smallest temperature (`max`, `min`), subtract (`-`), and print."
:::

## The standardized temperature anomaly: cold for the month

*A "cold" day in July is not as cold as a "cold" day in January*, so the lab standardizes each day against its own month: `Z.anomaly` $= (X - \bar{X})/s$ with $\bar{X}$ and $s$ *calculated separately for each month*.

```r
Z.Temp.anomaly <- with(SFU.Weather,
     (Temp.deg.C - Monthly.Mean.Temp[Month])/Monthly.SD.Temp[Month])
SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly
```

:::info R syntax
| Code | What it does |
|---|---|
| `with(SFU.Weather, …)` | As above: the columns are usable by name inside. |
| `Monthly.Mean.Temp[Month]` | `Month` is a column of month names; indexing the named vector by it returns the matching mean for every row. |
| `Monthly.SD.Temp[Month]` | The same lookup for the monthly standard deviation. |
| `(Temp.deg.C - …)/…` | `-` and `/` work row by row on whole vectors; the brackets make the subtraction happen first. |
| `SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly` | Assigning to a new `$` name adds that column to the data frame. |

**Left to right**

- `Z.Temp.anomaly <- with(…)`: "Store under the name Z.Temp.anomaly (`Z.Temp.anomaly <-`), inside SFU.Weather (`with`), each temperature (`Temp.deg.C`) minus (`-`) its month's mean (`Monthly.Mean.Temp[Month]`), divided by (`/`) its month's standard deviation (`Monthly.SD.Temp[Month]`)."
- `SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly`: "Store in a new column Z.Temp.anomaly of SFU.Weather (`SFU.Weather$Z.Temp.anomaly <-`) the vector Z.Temp.anomaly."

**Right to left**, the order R runs it

- `Z.Temp.anomaly <- with(…)`: "Make the columns visible (`with`), look up each row's monthly mean and sd (`Monthly.Mean.Temp[Month]`, `Monthly.SD.Temp[Month]`), subtract the mean from the temperature (`-`), divide by the sd (`/`), and store the vector as Z.Temp.anomaly (`Z.Temp.anomaly <-`)."
- `SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly`: "Take the vector Z.Temp.anomaly and put it in the data frame as a new column (`SFU.Weather$Z.Temp.anomaly <-`)."
:::

`Monthly.Mean.Temp[Month]` is a vectorised lookup: it returns the right monthly mean for all 17 582 rows at once. Three rows of the result:

| Date | Month | Temp.deg.C | Monthly.Mean.Temp[Month] | Monthly.SD.Temp[Month] | Z |
|---|---|---|---|---|---|
| 1966-01-01 | Jan | −2.5 | 2.90 | 3.67 | (−2.5 − 2.90)/3.67 = −1.47 |
| 1968-01-14 | Jan | 8.6 | 2.90 | 3.67 | (8.6 − 2.90)/3.67 = 1.55 |
| 1971-07-02 | Jul | 12.0 | 17.10 | 3.33 | (12.0 − 17.10)/3.33 = −1.53 |

Each row's `Month` picks its own mean and sd. The July day at 12.0 °C is warmer than the mild January day at 8.6 °C, yet its Z is negative: cold for July.

Task 4 draws it with mosaic's `histogram` and a fitted normal curve:

```r
histogram(~Z.Temp.anomaly, data=SFU.Weather, type="density", fit="normal",
          breaks=seq(-6, 6, by=0.25), xlab="Standardized temperature anomaly")
```

:::info R syntax
| Code | What it does |
|---|---|
| `histogram(~Z.Temp.anomaly, …)` | The `histogram()` loaded with mosaic. The one-sided formula `~x` names the variable to plot. |
| `data=SFU.Weather` | The data frame that holds `Z.Temp.anomaly`. |
| `type="density"` | The y-axis shows density rather than counts, so a probability curve can sit on the same scale. |
| `fit="normal"` | Overlays a normal curve fitted to the data. |
| `breaks=seq(-6, 6, by=0.25)` | `seq(from, to, by)`: bin edges from −6 to 6 every 0.25. |
| `xlab=` | The x-axis label. |

**Left to right**

- "Draw a histogram (`histogram`) of (`~`) the anomaly (`Z.Temp.anomaly`) from SFU.Weather (`data=SFU.Weather`) on a density scale (`type="density"`) with a fitted normal curve (`fit="normal"`), bins from −6 to 6 in steps of 0.25 (`breaks=seq(-6, 6, by=0.25)`), and an x-axis label (`xlab=`)."

**Right to left**, the order R runs it

- "Build the bin edges from −6 to 6 by 0.25 (`seq`), find the anomaly column in SFU.Weather (`data=`, `~Z.Temp.anomaly`), and draw the density histogram with its normal curve and label (`histogram`, `type=`, `fit=`, `xlab=`)."
:::

The anomalies run from −5.8 to 5.5 with mean 0 and sd 1.00, and the bars sit under the curve: *normally distributed (more or less)*.

## Segmenting with nested ifelse

`ifelse(test, yes, no)` works element by element; a second `ifelse` in the `no` slot gives three categories:

```r
SFU.Weather$Temp.Seg <- with(SFU.Weather,
     ifelse(Z.Temp.anomaly < -0.4307, "Cold",
            ifelse(Z.Temp.anomaly <= 0.4307, "Mid", "Warm")))
```

:::info R syntax
| Code | What it does |
|---|---|
| `ifelse(Z.Temp.anomaly < -0.4307, "Cold", …)` | `ifelse(test, yes, no)`, row by row: "Cold" where the test is TRUE, otherwise whatever the third argument gives. |
| `<`, `<=` | Less than; less than or equal to. |
| `ifelse(Z.Temp.anomaly <= 0.4307, "Mid", "Warm")` | The inner `ifelse` in the `no` slot: "Mid" or "Warm" for the rows that were not Cold. |
| `with(SFU.Weather, …)` | The columns are usable by name inside. |
| `SFU.Weather$Temp.Seg <- …` | Stores the labels as a new column. |

**Left to right**

- "Store in a new column Temp.Seg (`SFU.Weather$Temp.Seg <-`), inside SFU.Weather (`with`), the label Cold if (`ifelse`) the anomaly is below (`<`) −0.4307, otherwise, if (`ifelse`) it is at most (`<=`) 0.4307, Mid, otherwise Warm."

**Right to left**, the order R runs it

- "Make the columns visible (`with`); for every row, test the anomaly against 0.4307 (`<=`) to choose Mid or Warm (inner `ifelse`), test it against −0.4307 (`<`) to choose Cold or that inner result (outer `ifelse`), and store the labels as Temp.Seg (`SFU.Weather$Temp.Seg <-`)."
:::

The inner test only sees days that failed the first, so *Mid* is $-0.4307 \le Z \le 0.4307$ and *Warm* is $Z > 0.4307$.

Tertiles are the two cut points that split the bell into three equal areas: in R, `qnorm(1/3)` = −0.4307, and by symmetry `qnorm(2/3)` = 0.4307. That is why the segments come out near one third each.

```r
qnorm(1/3)
qnorm(2/3)
```
```text
[1] -0.4307273
[1] 0.4307273
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(1/3)` | `qnorm(p)`: the z with area p to its left under the standard normal curve (mean 0, sd 1). |
| `1/3` | One third, computed first and passed as p. |

**Left to right**

- `qnorm(1/3)`: "The standard normal cut point (`qnorm`) with one third of the area to its left (`1/3`)."
- `qnorm(2/3)`: "The cut point (`qnorm`) with two thirds of the area to its left (`2/3`)."

**Right to left**, the order R runs it

- `qnorm(1/3)`: "Divide 1 by 3 (`1/3`), find the z with that much area to its left (`qnorm`), and print."
- `qnorm(2/3)`: "Divide 2 by 3 (`2/3`), find the z with that much area to its left (`qnorm`), and print."
:::

```widget
pdf-area
{ "dist": "normal", "mu": 0, "sigma": 1, "lo": -0.4307, "hi": 0.4307, "showCdf": false, "title": "Standard normal cut at ±0.4307: Cold (left) | Mid (shaded, 0.3333) | Warm (right), one third each" }
```

The shaded middle is Mid, 0.3333; the left tail below −0.4307 is Cold and the right tail above 0.4307 is Warm, 0.3333 each.

## Tasks 5 and 6: the segment proportions and their pie

`sum()` of a logical vector counts its `TRUE`s, so each proportion is a count over the rows:

```r
p.Cold <- sum(SFU.Weather$Temp.Seg == "Cold")/nrow(SFU.Weather)
p.Mid  <- sum(SFU.Weather$Temp.Seg == "Mid")/nrow(SFU.Weather)
p.Warm <- sum(SFU.Weather$Temp.Seg == "Warm")/nrow(SFU.Weather)
round(c(p.Cold, p.Mid, p.Warm), 4)
table(SFU.Weather$Temp.Seg)
```
```text
[1] 0.3439 0.3388 0.3174

Cold  Mid Warm
6046 5956 5580
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather$Temp.Seg == "Cold"` | `==` tests equality: TRUE or FALSE for each row. |
| `sum(…)` | TRUE counts as 1 and FALSE as 0, so the sum is the number of TRUEs. |
| `/nrow(SFU.Weather)` | Divides that count by the number of rows. |
| `p.Mid  <- …`, `p.Warm <- …` | The same pattern for "Mid" and "Warm"; the extra spaces only line the code up. |
| `round(c(p.Cold, p.Mid, p.Warm), 4)` | `c()` combines the three proportions; `round()` keeps 4 decimals. |
| `table(SFU.Weather$Temp.Seg)` | `table()` counts each distinct value; the labels print above their counts. |

**Left to right**

- `p.Cold`, `p.Mid`, `p.Warm` lines: "Store under the name p.Cold (`p.Cold <-`) the count (`sum`) of rows whose segment (`SFU.Weather$Temp.Seg`) equals (`==`) Cold, divided by (`/`) the number of rows (`nrow`); the same for Mid and Warm."
- `round(c(p.Cold, p.Mid, p.Warm), 4)`: "Round (`round`) to 4 decimals (`4`) the combination (`c`) of the three proportions."
- `table(SFU.Weather$Temp.Seg)`: "The tally (`table`) of the segment column of SFU.Weather (`SFU.Weather$Temp.Seg`)."

**Right to left**, the order R runs it

- `p.Cold`, `p.Mid`, `p.Warm` lines: "Pull out the segment column (`$Temp.Seg`), test each row against the label (`==`), count the TRUEs (`sum`), divide by the row count (`/nrow`), and store the result (`p.Cold <-`, and so on)."
- `round(c(p.Cold, p.Mid, p.Warm), 4)`: "Combine the three (`c`), round to 4 decimals (`round`), and print."
- `table(SFU.Weather$Temp.Seg)`: "Pull out the segment column (`$Temp.Seg`), count each label (`table`), and print."
:::

`prop.table(table(SFU.Weather$Temp.Seg))` gives the same proportions in one call. Task 6's pie is Lab 3's recipe with a computed title: `pie(table(SFU.Weather$Temp.Seg), main=paste0("Temperature segments, n = ", nrow(SFU.Weather)))`.

:::info R syntax
| Code | What it does |
|---|---|
| `prop.table(table(SFU.Weather$Temp.Seg))` | `table()` counts each segment; `prop.table()` turns the counts into proportions of the total. |
| `pie(table(SFU.Weather$Temp.Seg), …)` | `pie()` draws one slice per count in the table. |
| `main=paste0("Temperature segments, n = ", nrow(SFU.Weather))` | The title: `paste0()` joins the text and the row count with nothing between them, so n is computed. |

**Left to right**

- `prop.table(table(SFU.Weather$Temp.Seg))`: "The proportions (`prop.table`) of the tally (`table`) of the segment column of SFU.Weather (`SFU.Weather$Temp.Seg`)."
- `pie(…)`: "Draw a pie (`pie`) of the tally (`table`) of the segment column (`SFU.Weather$Temp.Seg`), titled (`main=`) by joining (`paste0`) the text and the number of rows (`nrow(SFU.Weather)`)."

**Right to left**, the order R runs it

- `prop.table(table(SFU.Weather$Temp.Seg))`: "Pull out the segment column (`$Temp.Seg`), count each label (`table`), divide each count by the total (`prop.table`), and print."
- `pie(…)`: "Count the rows (`nrow`), join them into the title (`paste0`), count each segment (`table`), and draw the pie with that title (`pie`, `main=`)."
:::

```widget
cat-charts
{ "categories": { "Cold": 6046, "Mid": 5956, "Warm": 5580 }, "title": "table(Temp.Seg): the three segments as a table, pie and bar" }
```

## Task 7: seasons by %in%, then seasonal mean precipitation

`%in%` tests membership in a set, so the same nested `ifelse` builds `Season`:

```r
SFU.Weather$Season <- with(SFU.Weather,
     ifelse(Month %in% c("Jun","Jul","Aug"), "Summer",
            ifelse(Month %in% c("Sep","Oct","Nov"), "Autumn",
                   ifelse(Month %in% c("Dec","Jan","Feb"), "Winter", "Spring"))))
seasons <- c("Summer","Autumn","Winter","Spring")
Seasonal.Mean.Precip <- mean(Total.Precip.mm ~ Season, data=SFU.Weather)
round(Seasonal.Mean.Precip[seasons], 2)
barplot(Seasonal.Mean.Precip[seasons], col="lightgreen",
        xlab="Season", ylab="Mean Total Precip (mm)")
```
```text
Summer Autumn Winter Spring
  2.28   6.74   8.03   4.85
```

:::info R syntax
| Code | What it does |
|---|---|
| `Month %in% c("Jun","Jul","Aug")` | `%in%` is TRUE for each row whose Month is one of the listed values. |
| `ifelse(…, "Summer", ifelse(…, "Autumn", ifelse(…, "Winter", "Spring")))` | Three nested `ifelse` calls: each row gets the first season whose test is TRUE, and "Spring" if none is. |
| `seasons <- c("Summer","Autumn","Winter","Spring")` | The order to display the seasons in. |
| `mean(Total.Precip.mm ~ Season, data=SFU.Weather)` | As above: one mean per season, as a named vector. |
| `Seasonal.Mean.Precip[seasons]` | Picks the entries by name, in the `seasons` order. |
| `round(…, 2)` | Two decimals. |
| `barplot(…, col="lightgreen", xlab=…, ylab=…)` | One bar per season, light green, with axis labels. |

**Left to right**

- `SFU.Weather$Season <- with(…)`: "Store in a new column Season (`SFU.Weather$Season <-`), inside SFU.Weather (`with`), Summer if (`ifelse`) the month is in (`%in%`) June to August, otherwise Autumn if it is in September to November, otherwise Winter if it is in December to February, otherwise Spring."
- `seasons <- c(…)`: "Store under the name seasons (`seasons <-`) the combination (`c`) of the four season names."
- `Seasonal.Mean.Precip <- mean(…)`: "Store under the name Seasonal.Mean.Precip (`Seasonal.Mean.Precip <-`) the mean (`mean`) of precipitation (`Total.Precip.mm`) by (`~`) season (`Season`) in SFU.Weather (`data=`)."
- `round(Seasonal.Mean.Precip[seasons], 2)`: "Round (`round`) to 2 decimals the seasonal means in display order (`Seasonal.Mean.Precip[seasons]`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of the seasonal means in order (`Seasonal.Mean.Precip[seasons]`), in light green (`col=`), with axis labels (`xlab=`, `ylab=`)."

**Right to left**, the order R runs it

- `SFU.Weather$Season <- with(…)`: "Make the columns visible (`with`), test each month against the three lists (`%in%`, `c`), choose the season from the innermost `ifelse` outwards, and store the labels as Season (`SFU.Weather$Season <-`)."
- `seasons <- c(…)`: "Combine the four names (`c`), then store them as seasons (`seasons <-`)."
- `Seasonal.Mean.Precip <- mean(…)`: "Group precipitation by season (`~`), average each group (`mean`), and store it as Seasonal.Mean.Precip (`Seasonal.Mean.Precip <-`)."
- `round(Seasonal.Mean.Precip[seasons], 2)`: "Reorder the means by name (`[seasons]`), round to 2 decimals (`round`), and print."
- `barplot(…)`: "Reorder the means (`[seasons]`) and draw them as bars with the colour and labels (`barplot`)."
:::

*Winter is the wettest season at SFU with 8.0 mm per day on average*; summer averages 2.3 mm.

## Day of week and the precipitation flag

```r
SFU.Weather$DoW <- weekdays(SFU.Weather$Date)
SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)
```

:::info R syntax
| Code | What it does |
|---|---|
| `weekdays(SFU.Weather$Date)` | The day name of each date, such as "Monday". It needs a real Date column. |
| `SFU.Weather$DoW <- …` | Stores the day names as a new column. |
| `SFU.Weather$Total.Precip.mm > 0` | `>` is greater than: TRUE or FALSE for each row. |
| `( … )` | The brackets only group; the new column holds TRUE and FALSE values. |

**Left to right**

- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Store in a new column DoW (`SFU.Weather$DoW <-`) the day name (`weekdays`) of each date (`SFU.Weather$Date`)."
- `SFU.Weather$has.Precip <- (…)`: "Store in a new column has.Precip (`SFU.Weather$has.Precip <-`) whether the precipitation (`SFU.Weather$Total.Precip.mm`) is greater than (`>`) 0."

**Right to left**, the order R runs it

- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Pull out the Date column (`$Date`), turn each date into a day name (`weekdays`), and store them as DoW (`SFU.Weather$DoW <-`)."
- `SFU.Weather$has.Precip <- (…)`: "Pull out the precipitation column (`$Total.Precip.mm`), compare each value with 0 (`> 0`), and store the TRUE/FALSE results as has.Precip (`SFU.Weather$has.Precip <-`)."
:::

`has.Precip` is `TRUE` on any day with measurable precipitation.

## Are Mondays rainier? A two-way table and one conditional

```r
tab1 <- table(SFU.Weather[c("DoW", "has.Precip")])
tab1
p.Precip <- sum(tab1[ ,"TRUE"])/sum(tab1)
p.Precip
p.Precip.Cond.Monday <- tab1["Monday","TRUE"]/sum(tab1["Monday",])
p.Precip.Cond.Monday
```
```text
           has.Precip
DoW         FALSE TRUE
  Friday     1277 1235
  Monday     1284 1222
  Saturday   1280 1235
  Sunday     1287 1214
  Thursday   1300 1214
  Tuesday    1298 1215
  Wednesday  1279 1242
[1] 0.4878285
[1] 0.4876297
```

:::info R syntax
| Code | What it does |
|---|---|
| `SFU.Weather[c("DoW", "has.Precip")]` | `[ ]` with a vector of column names keeps just those columns, as a data frame. |
| `table(…)` | On two columns: a two-way table of counts, rows by the first column, columns by the second. |
| `tab1` | A name alone prints the table. |
| `tab1[ ,"TRUE"]` | `[row, column]`: the blank row slot keeps every row; `"TRUE"` is the column's name, as a string. |
| `sum(tab1)` | Adds every cell: all days. |
| `tab1["Monday","TRUE"]` | One cell, picked by row name and column name. |
| `sum(tab1["Monday",])` | The blank column slot keeps the whole Monday row; `sum()` gives its total. |
| `p.Precip`, `p.Precip.Cond.Monday` | Each name alone prints its value. |

**Left to right**

- `tab1 <- table(…)`: "Store under the name tab1 (`tab1 <-`) the two-way count table (`table`) of the DoW and has.Precip columns (`SFU.Weather[c("DoW", "has.Precip")]`)."
- `tab1`: "Show tab1 (`tab1`)."
- `p.Precip <- sum(tab1[ ,"TRUE"])/sum(tab1)`: "Store under the name p.Precip (`p.Precip <-`) the total (`sum`) of the TRUE column (`tab1[ ,"TRUE"]`) divided by (`/`) the total of the whole table (`sum(tab1)`)."
- `p.Precip`: "Show p.Precip."
- `p.Precip.Cond.Monday <- …`: "Store under the name p.Precip.Cond.Monday (`<-`) the Monday, TRUE cell (`tab1["Monday","TRUE"]`) divided by (`/`) the total (`sum`) of the Monday row (`tab1["Monday",]`)."
- `p.Precip.Cond.Monday`: "Show p.Precip.Cond.Monday."

**Right to left**, the order R runs it

- `tab1 <- table(…)`: "Keep the two columns (`[c(…)]`), count every combination (`table`), and store the table as tab1 (`tab1 <-`)."
- `tab1`: "Look up tab1 and print it."
- `p.Precip <- sum(tab1[ ,"TRUE"])/sum(tab1)`: "Take the TRUE column (`[ ,"TRUE"]`) and add it (`sum`), add the whole table (`sum(tab1)`), divide (`/`), and store as p.Precip (`p.Precip <-`)."
- `p.Precip`: "Look up p.Precip and print it."
- `p.Precip.Cond.Monday <- …`: "Take the Monday row and add it (`sum`), take the Monday, TRUE cell, divide (`/`), and store as p.Precip.Cond.Monday (`<-`)."
- `p.Precip.Cond.Monday`: "Look it up and print it."
:::

The rule every conditional in this lab uses: the condition picks the total you divide by. Task 8 below builds `tab2` the same way, segments by the wet flag:

:::tip Which total? (tab2)
| You want | Numerator | Denominator | R (tab2) |
|---|---|---|---|
| P(wet \| Cold) | Cold-wet cell | Cold row total | `tab2["Cold","TRUE"]/sum(tab2["Cold",])` |
| P(Cold \| wet) | Cold-wet cell | wet column total | `tab2["Cold","TRUE"]/sum(tab2[ ,"TRUE"])` |
| P(Cold and wet) | Cold-wet cell | grand total | `tab2["Cold","TRUE"]/sum(tab2)` |
| P(wet) | wet column total | grand total | `sum(tab2[ ,"TRUE"])/sum(tab2)` |
:::

:::info R syntax
| Code | What it does |
|---|---|
| `tab2["Cold","TRUE"]` | `[row, column]` by name: the one Cold-wet cell. |
| `sum(tab2["Cold",])` | Blank column slot: the whole Cold row, added up. |
| `sum(tab2[ ,"TRUE"])` | Blank row slot: the whole wet column, added up. |
| `sum(tab2)` | Every cell added: the grand total. |
| `/` | Divides the numerator by the denominator. |

**Left to right**

- `tab2["Cold","TRUE"]/sum(tab2["Cold",])`: "The Cold-wet cell (`tab2["Cold","TRUE"]`) divided by (`/`) the total (`sum`) of the Cold row (`tab2["Cold",]`)."
- `tab2["Cold","TRUE"]/sum(tab2[ ,"TRUE"])`: "The same cell divided by (`/`) the total (`sum`) of the wet column (`tab2[ ,"TRUE"]`)."
- `tab2["Cold","TRUE"]/sum(tab2)`: "The same cell divided by (`/`) the total of every cell (`sum(tab2)`)."
- `sum(tab2[ ,"TRUE"])/sum(tab2)`: "The wet column total (`sum(tab2[ ,"TRUE"])`) divided by (`/`) the grand total (`sum(tab2)`)."

**Right to left**, the order R runs it

- `tab2["Cold","TRUE"]/sum(tab2["Cold",])`: "Take the Cold row and add it (`sum`), take the Cold-wet cell, and divide (`/`)."
- `tab2["Cold","TRUE"]/sum(tab2[ ,"TRUE"])`: "Take the wet column and add it (`sum`), take the Cold-wet cell, and divide (`/`)."
- `tab2["Cold","TRUE"]/sum(tab2)`: "Add every cell (`sum`), take the Cold-wet cell, and divide (`/`)."
- `sum(tab2[ ,"TRUE"])/sum(tab2)`: "Add every cell (`sum(tab2)`), add the wet column (`sum(tab2[ ,"TRUE"])`), and divide (`/`)."
:::

```diagram
{ "type": "grid", "title": "P(wet | Cold): divide by the Cold row total", "nodes": [
  { "id": "h0", "label": "tab2", "row": 0, "col": 0 }, { "id": "h1", "label": "FALSE (dry)", "row": 0, "col": 1 }, { "id": "h2", "label": "TRUE (wet)", "row": 0, "col": 2 }, { "id": "h3", "label": "Row total", "row": 0, "col": 3 },
  { "id": "c0", "label": "Cold", "row": 1, "col": 0 }, { "id": "c1", "label": "2591", "row": 1, "col": 1 }, { "id": "c2", "label": "3455", "row": 1, "col": 2 }, { "id": "c3", "label": "6046", "row": 1, "col": 3 },
  { "id": "m0", "label": "Mid", "row": 2, "col": 0 }, { "id": "m1", "label": "3050", "row": 2, "col": 1 }, { "id": "m2", "label": "2906", "row": 2, "col": 2 }, { "id": "m3", "label": "5956", "row": 2, "col": 3 },
  { "id": "w0", "label": "Warm", "row": 3, "col": 0 }, { "id": "w1", "label": "3364", "row": 3, "col": 1 }, { "id": "w2", "label": "2216", "row": 3, "col": 2 }, { "id": "w3", "label": "5580", "row": 3, "col": 3 },
  { "id": "t0", "label": "Column total", "row": 4, "col": 0 }, { "id": "t1", "label": "9005", "row": 4, "col": 1 }, { "id": "t2", "label": "8577", "row": 4, "col": 2 }, { "id": "t3", "label": "17582", "row": 4, "col": 3 }
], "hi": ["c1", "c2", "c3"], "caption": "Condition on Cold: only the Cold row counts, so P(wet | Cold) is the Cold-wet cell 3455 over the Cold row total 6046." }
```

```diagram
{ "type": "grid", "title": "P(Cold | wet): divide by the wet column total", "nodes": [
  { "id": "h0", "label": "tab2", "row": 0, "col": 0 }, { "id": "h1", "label": "FALSE (dry)", "row": 0, "col": 1 }, { "id": "h2", "label": "TRUE (wet)", "row": 0, "col": 2 }, { "id": "h3", "label": "Row total", "row": 0, "col": 3 },
  { "id": "c0", "label": "Cold", "row": 1, "col": 0 }, { "id": "c1", "label": "2591", "row": 1, "col": 1 }, { "id": "c2", "label": "3455", "row": 1, "col": 2 }, { "id": "c3", "label": "6046", "row": 1, "col": 3 },
  { "id": "m0", "label": "Mid", "row": 2, "col": 0 }, { "id": "m1", "label": "3050", "row": 2, "col": 1 }, { "id": "m2", "label": "2906", "row": 2, "col": 2 }, { "id": "m3", "label": "5956", "row": 2, "col": 3 },
  { "id": "w0", "label": "Warm", "row": 3, "col": 0 }, { "id": "w1", "label": "3364", "row": 3, "col": 1 }, { "id": "w2", "label": "2216", "row": 3, "col": 2 }, { "id": "w3", "label": "5580", "row": 3, "col": 3 },
  { "id": "t0", "label": "Column total", "row": 4, "col": 0 }, { "id": "t1", "label": "9005", "row": 4, "col": 1 }, { "id": "t2", "label": "8577", "row": 4, "col": 2 }, { "id": "t3", "label": "17582", "row": 4, "col": 3 }
], "hi": ["c2", "m2", "w2", "t2"], "caption": "Condition on wet: only the wet column counts, so P(Cold | wet) is the same cell 3455 over the wet column total 8577. P(Cold and wet) would divide by the grand total 17582." }
```

Back to `tab1`:

- **Orientation.** `table()` on two columns gives rows by the first column (DoW) and columns by the second (has.Precip), indexed by name.
- **`"TRUE"` is a string.** The logical levels became the names `"FALSE"` and `"TRUE"`, so `tab1["Monday", TRUE]` would not work. `tab1[ ,"TRUE"]` is the whole wet column, so $P(\text{Precip})$ = 8577/17 582 = 0.4878. `tab1["Monday",]` is the Monday row, so the conditional is the cell over its **row** total, 1222/2506 = 0.4876.
- **Verdict.** *The fact that these two probabilities are so close (~0.488) means that having precipitation is independent of a day being Monday*: $P(B \mid A) = P(B)$ is Unit 3's test.

## Task 8: are cold days wetter?

```r
tab2 <- table(SFU.Weather[c("Temp.Seg", "has.Precip")])
tab2
p.Precip.Cold <- tab2["Cold","TRUE"]/sum(tab2["Cold",])
p.Precip.Mid  <- tab2["Mid","TRUE"]/sum(tab2["Mid",])
p.Precip.Warm <- tab2["Warm","TRUE"]/sum(tab2["Warm",])
c(p.Precip.Cold, p.Precip.Mid, p.Precip.Warm)
```
```text
        has.Precip
Temp.Seg FALSE TRUE
    Cold  2591 3455
    Mid   3050 2906
    Warm  3364 2216
[1] 0.5714522 0.4879113 0.3971326
```

:::info R syntax
| Code | What it does |
|---|---|
| `table(SFU.Weather[c("Temp.Seg", "has.Precip")])` | As above: a two-way table, rows by Temp.Seg, columns by has.Precip. |
| `tab2` | Prints the table. |
| `tab2["Cold","TRUE"]/sum(tab2["Cold",])` | As above: one cell over its row total. |
| `p.Precip.Mid  <- …`, `p.Precip.Warm <- …` | The same pattern for the Mid and Warm rows; the extra spaces only line the code up. |
| `c(p.Precip.Cold, p.Precip.Mid, p.Precip.Warm)` | Combines the three so they print on one line. |

**Left to right**

- `tab2 <- table(…)`: "Store under the name tab2 (`tab2 <-`) the count table (`table`) of the Temp.Seg and has.Precip columns (`SFU.Weather[c(…)]`)."
- `tab2`: "Show tab2."
- `p.Precip.Cold`, `p.Precip.Mid`, `p.Precip.Warm` lines: "Store under each name (`<-`) the segment's TRUE cell (`tab2["Cold","TRUE"]`) divided by (`/`) the total (`sum`) of that segment's row (`tab2["Cold",]`)."
- `c(…)`: "Combine (`c`) the three conditional probabilities."

**Right to left**, the order R runs it

- `tab2 <- table(…)`: "Keep the two columns (`[c(…)]`), count every combination (`table`), and store as tab2 (`tab2 <-`)."
- `tab2`: "Look up tab2 and print it."
- `p.Precip.Cold`, `p.Precip.Mid`, `p.Precip.Warm` lines: "Add the segment's row (`sum`), take its TRUE cell, divide (`/`), and store the result (`<-`)."
- `c(…)`: "Put the three in one vector (`c`) and print it."
:::

Each line is the first row of the "Which total?" table: $P(\text{Precip} > 0 \mid \text{Cold}) = 3455/6046 = 0.5715$; Mid 2906/5956 = 0.4879; Warm 2216/5580 = 0.3971. 3455 over the grand total 17 582 would be the joint probability 0.1965 instead. The lab's answer: *yes, since the probability of precipitation given a Cold day is greater than the probability of precipitation on a Warm or Mid day.* Temperature and precipitation are dependent.

```widget
two-way
{ "rows": ["Cold", "Mid", "Warm"], "cols": ["Precip = 0", "Precip > 0"], "data": [[2591, 3455], [3050, 2906], [3364, 2216]], "select": "row", "r": 0, "title": "tab2: a row gives P(Precip > 0 | segment), the Precip > 0 column gives P(segment | Precip > 0)" }
```

## Task 9: Bayes from the Task 5 and Task 8 numbers

The segments are exhaustive and mutually exclusive, so Unit 3's theorem reverses the condition:

$$P(\text{Warm} \mid \text{P} > 0) = \frac{P(\text{Warm})\,P(\text{P} \mid \text{Warm})}{P(\text{Cold})P(\text{P} \mid \text{Cold}) + P(\text{Mid})P(\text{P} \mid \text{Mid}) + P(\text{Warm})P(\text{P} \mid \text{Warm})}$$

$$= \frac{0.3174 \times 0.3971}{0.3439 \times 0.5715 + 0.3388 \times 0.4879 + 0.3174 \times 0.3971} = \frac{0.1260}{0.1965 + 0.1653 + 0.1260} = \frac{0.1260}{0.4878} = 0.2584$$

```r
p.Warm.Precip <- p.Warm*p.Precip.Warm /
  (p.Cold*p.Precip.Cold + p.Mid*p.Precip.Mid + p.Warm*p.Precip.Warm)
p.Warm.Precip
tab2["Warm","TRUE"]/sum(tab2[ ,"TRUE"])
```
```text
[1] 0.2583654
[1] 0.2583654
```

:::info R syntax
| Code | What it does |
|---|---|
| `p.Warm*p.Precip.Warm /` | The numerator. The line ends with `/`, so R keeps reading the next line as the rest of the statement. |
| `(p.Cold*p.Precip.Cold + p.Mid*p.Precip.Mid + p.Warm*p.Precip.Warm)` | `+` adds; the brackets make the whole sum the denominator. `*` runs before `+`. |
| `p.Warm.Precip` | Prints the stored value. |
| `tab2["Warm","TRUE"]/sum(tab2[ ,"TRUE"])` | The Warm, TRUE cell over the total of the TRUE column (blank row slot = every row). |

**Left to right**

- `p.Warm.Precip <- …`: "Store under the name p.Warm.Precip (`p.Warm.Precip <-`) p.Warm times p.Precip.Warm (`p.Warm*p.Precip.Warm`) divided by (`/`) the sum (`+`) of the three products of segment share and conditional probability."
- `p.Warm.Precip`: "Show p.Warm.Precip."
- `tab2["Warm","TRUE"]/sum(tab2[ ,"TRUE"])`: "The Warm, TRUE cell (`tab2["Warm","TRUE"]`) divided by (`/`) the total (`sum`) of the TRUE column (`tab2[ ,"TRUE"]`)."

**Right to left**, the order R runs it

- `p.Warm.Precip <- …`: "Multiply each pair (`*`), add the three products in the brackets (`+`), divide the Warm product by that sum (`/`), and store it as p.Warm.Precip (`p.Warm.Precip <-`)."
- `p.Warm.Precip`: "Look it up and print it."
- `tab2["Warm","TRUE"]/sum(tab2[ ,"TRUE"])`: "Take the TRUE column and add it (`sum`), take the Warm, TRUE cell, divide (`/`), and print."
:::

The denominator is $P(\text{Precip})$ = 0.4878 again, by total probability. The second line checks it straight from the table, the second row of the "Which total?" table: 2216/8577, the Warm cell over the wet **column** total. Four-decimal values on paper give 0.2583, a rounding difference only.

### The same three branches on Unit 3's tree

```widget
bayes-tree
{ "preset": "temperature segments (Lab 5)", "title": "Task 9 on a tree: the three segments, P(Precip > 0) on each branch" }
```

## Task 10: does the season change the dependence? A three-way table

`tab2` is reused for a new three-way table; has.Precip is now the first index.

```r
tab2 <- table(SFU.Weather[c("has.Precip","Temp.Seg","Season")])
tab2[ , , "Winter"]
tab2[ , , "Summer"]
p.Precip.Warm.Summer <- tab2["TRUE","Warm","Summer"]/sum(tab2[ ,"Warm","Summer"])
p.Precip.Warm.Autumn <- tab2["TRUE","Warm","Autumn"]/sum(tab2[ ,"Warm","Autumn"])
p.Precip.Warm.Winter <- tab2["TRUE","Warm","Winter"]/sum(tab2[ ,"Warm","Winter"])
p.Precip.Warm.Spring <- tab2["TRUE","Warm","Spring"]/sum(tab2[ ,"Warm","Spring"])
round(c(p.Precip.Warm.Summer, p.Precip.Warm.Autumn,
        p.Precip.Warm.Winter, p.Precip.Warm.Spring), 4)
```
```text
          Temp.Seg
has.Precip Cold  Mid Warm
     FALSE  587  523  400
     TRUE   612  962 1035
          Temp.Seg
has.Precip Cold  Mid Warm
     FALSE  804 1209 1312
     TRUE   897  348  125
[1] 0.0870 0.4298 0.7213 0.3493
```

:::info R syntax
| Code | What it does |
|---|---|
| `table(SFU.Weather[c("has.Precip","Temp.Seg","Season")])` | Three columns give a three-way table, indexed `[has.Precip, Temp.Seg, Season]`. |
| `tab2 <- …` | Overwrites the earlier two-way `tab2`. |
| `tab2[ , , "Winter"]`, `tab2[ , , "Summer"]` | Two blank slots keep every level of the first two dimensions: one season's slice, printed as a two-way table. |
| `tab2["TRUE","Warm","Summer"]` | One cell, by three names. |
| `sum(tab2[ ,"Warm","Summer"])` | Blank first slot: both has.Precip values for warm summer days, summed. |
| the four `p.Precip.Warm.…` lines | The same pattern for Summer, Autumn, Winter and Spring. |
| `round(c(…), 4)` | One call split over two lines; R keeps reading until the brackets close. |

**Left to right**

- `tab2 <- table(…)`: "Store under the name tab2 (`tab2 <-`) the three-way count table (`table`) of has.Precip, Temp.Seg and Season (`SFU.Weather[c(…)]`)."
- `tab2[ , , "Winter"]`, `tab2[ , , "Summer"]`: "Show the Winter slice, then the Summer slice, of tab2 (`tab2[ , , …]`)."
- the four `p.Precip.Warm.…` lines: "Store under each name (`<-`) the TRUE, Warm cell for the season (`tab2["TRUE","Warm","Summer"]`) divided by (`/`) the total (`sum`) of warm days in that season (`tab2[ ,"Warm","Summer"]`)."
- `round(c(…), 4)`: "Round (`round`) to 4 decimals the combination (`c`) of the four seasonal probabilities."

**Right to left**, the order R runs it

- `tab2 <- table(…)`: "Keep the three columns (`[c(…)]`), count every combination (`table`), and store as tab2 (`tab2 <-`)."
- `tab2[ , , "Winter"]`, `tab2[ , , "Summer"]`: "Cut out the season's slice (`[ , , …]`) and print it."
- the four `p.Precip.Warm.…` lines: "Add the warm days for the season (`sum`), take the wet warm cell, divide (`/`), and store the result (`<-`)."
- `round(c(…), 4)`: "Combine the four (`c`), round to 4 decimals (`round`), and print."
:::

A three-way table is indexed `[has.Precip, Temp.Seg, Season]`; a blank index keeps every level. `sum(tab2[ ,"Warm","Winter"])` is all 400 + 1035 = 1435 warm winter days, so $P(\text{Precip} > 0 \mid \text{Warm and Winter})$ = 1035/1435 = 0.7213. *The season where SFU is most likely to have precipitation on a warm day is winter.*

| Season | P(wet \| Cold) | P(wet \| Warm) | Wetter |
|---|---|---|---|
| Winter | 612/1199 = 0.51 | 1035/1435 = 0.72 | warm |
| Summer | 897/1701 = 0.53 | 125/1437 = 0.09 | cold |

**The season reverses which temperature segment is wetter.**

## Task 11: the month with the wettest warm days

The same table by `Month`, as percentages in calendar order:

```r
tab3 <- table(SFU.Weather[c("has.Precip","Temp.Seg","Month")])
pct <- 100*tab3["TRUE","Warm",months]/
       (tab3["TRUE","Warm",months] + tab3["FALSE","Warm",months])
round(pct, 1)
barplot(pct, col="lightblue", ylim=c(0,100),
        xlab="Month", ylab="%", main="Likelihood of Rain on a Warm Day, by Month")
```
```text
 Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
74.9 62.0 51.8 31.8 20.2 15.2  5.7  5.8 12.4 40.2 75.0 78.2
```

:::info R syntax
| Code | What it does |
|---|---|
| `tab3 <- table(SFU.Weather[c("has.Precip","Temp.Seg","Month")])` | As above, a three-way table, with Month as the third dimension. |
| `tab3["TRUE","Warm",months]` | The `months` vector in the third slot returns 12 values, in calendar order. |
| `100*…/(… + …)` | Wet over wet plus dry, times 100: a percentage per month. The line break after `/` is fine. |
| `round(pct, 1)` | One decimal. |
| `barplot(pct, …)` | One bar per month. |
| `col="lightblue"` | The bar colour. |
| `ylim=c(0,100)` | Fixes the y-axis range at 0 to 100. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title. |

**Left to right**

- `tab3 <- table(…)`: "Store under the name tab3 (`tab3 <-`) the three-way count table (`table`) of has.Precip, Temp.Seg and Month (`SFU.Weather[c(…)]`)."
- `pct <- …`: "Store under the name pct (`pct <-`) 100 times (`100*`) the wet warm counts by month (`tab3["TRUE","Warm",months]`) divided by (`/`) the wet plus (`+`) dry warm counts (`tab3["FALSE","Warm",months]`)."
- `round(pct, 1)`: "Round (`round`) pct to 1 decimal (`1`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of pct (`pct`) in light blue (`col=`), with the y-axis from 0 to 100 (`ylim=c(0,100)`), axis labels (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `tab3 <- table(…)`: "Keep the three columns, count every combination (`table`), and store as tab3 (`tab3 <-`)."
- `pct <- …`: "Pick the wet and dry warm counts in month order (`[ ,"Warm",months]`), add them (`+`), divide the wet counts by the sum (`/`), multiply by 100 (`100*`), and store as pct (`pct <-`)."
- `round(pct, 1)`: "Take pct, round to 1 decimal (`round`), and print."
- `barplot(…)`: "Combine 0 and 100 for the axis range (`c(0,100)`) and draw pct as bars with the colour and labels (`barplot`)."
:::

**December** has the greatest probability of precipitation given a warm day, 78.2% (390 of 499 warm December days); July's 5.7% is the lowest.

## Dead characters by rank band on the Hardcore ladder

The 3.29 Hardcore Allflame ladder flags each character dead or alive. Four 200-character pages of it, ranks 1-200, 3001-3200, 7401-7600 and 14801-15000, hold 69, 120, 158 and 157 dead characters [PoE1, 3.29 Hardcore Allflame ladder, checked 2026-10-27]. Suppose `hc` holds those 800 characters, one row each, with the page in `band` and the ladder's `dead` flag as TRUE or FALSE. These are real counts in a two-way table, so P(dead | band) is a row proportion exactly as in Task 8 (the "Which total?" table, with bands for segments and dead for wet), and the universe is these 800 sampled characters, not the whole ladder.

```r
hc$band <- factor(hc$band, levels=c("1-200", "3001-3200", "7401-7600", "14801-15000"))
tab5 <- table(hc[c("band", "dead")])
tab5
```
```text
             dead
band          FALSE TRUE
  1-200         131   69
  3001-3200      80  120
  7401-7600      42  158
  14801-15000    43  157
```

:::info R syntax
| Code | What it does |
|---|---|
| `factor(hc$band, levels=c(…))` | `factor()` turns text into categories; `levels=` sets their order, which `table()` then follows. |
| `hc$band <- …` | Replaces the `band` column with the ordered version. |
| `tab5 <- table(hc[c("band", "dead")])` | As above: a two-way table, rows by band, columns by dead. |
| `tab5` | Prints the table. |

**Left to right**

- `hc$band <- factor(…)`: "Store in the band column of hc (`hc$band <-`) the band column turned into categories (`factor`) with the four levels in rank order (`levels=c(…)`)."
- `tab5 <- table(hc[c("band", "dead")])`: "Store under the name tab5 (`tab5 <-`) the count table (`table`) of the band and dead columns of hc (`hc[c(…)]`)."
- `tab5`: "Show tab5."

**Right to left**, the order R runs it

- `hc$band <- factor(…)`: "Combine the four level names (`c`), pull out the band column (`hc$band`), make it a factor in that order (`factor`, `levels=`), and store it back (`hc$band <-`)."
- `tab5 <- table(hc[c("band", "dead")])`: "Keep the two columns (`hc[c(…)]`), count every combination (`table`), and store as tab5 (`tab5 <-`)."
- `tab5`: "Look up tab5 and print it."
:::

The `factor` line plays the part of `months`: as text, "14801-15000" would sort second.

```quiz
[
  {"q": "From tab5, P(dead | ranks 1-200) = ? (4 decimals)", "type": "numeric", "answer": 0.345, "tolerance": 0.0001, "explain": "Condition on the 1-200 row: its dead cell over its row total, 69/(131 + 69) = 69/200 = 0.3450."},
  {"type": "fill", "q": "Complete the R line for P(dead | ranks 1-200).", "code": "tab5[\"1-200\",\"TRUE\"]/sum(tab5[___,])", "answer": ["\"1-200\"", "'1-200'"], "explain": "The denominator is the 1-200 row total, so the row index is the string \"1-200\" and the column index is left empty. tab5[ ,\"TRUE\"] would be the whole dead column instead."},
  {"q": "Which call prints each band's share dead and alive, every row summing to 1?", "options": ["`prop.table(tab5, 1)`", "`prop.table(tab5)`", "`prop.table(tab5, 2)`", "`table(hc$dead)/800`"], "answer": 0, "explain": "The margin 1 divides each cell by its row total: dead shares 0.345, 0.600, 0.790 and 0.785 down the bands. prop.table(tab5) divides by the grand total 800 (joint probabilities), margin 2 by the column totals, and table(hc$dead)/800 drops the bands."},
  {"q": "P(dead) over all 800 sampled characters = ? (4 decimals)", "type": "numeric", "answer": 0.63, "tolerance": 0.0001, "explain": "The dead column over the grand total: (69 + 120 + 158 + 157)/800 = 504/800 = 0.6300. In R, sum(tab5[ ,\"TRUE\"])/sum(tab5)."},
  {"q": "In these 800 characters, being dead is independent of the rank band.", "type": "tf", "answer": false, "explain": "Independence needs P(dead | band) = P(dead) for every band. P(dead | 1-200) = 0.3450 is far below P(dead) = 0.6300, so the top page dies much less: dependent."},
  {"q": "P(ranks 1-200 | dead) = ? (4 decimals)", "type": "numeric", "answer": 0.1369, "tolerance": 0.0001, "explain": "Now the condition is the dead column: 69/(69 + 120 + 158 + 157) = 69/504 = 0.1369. Same cell as P(dead | 1-200), different total; in R, tab5[\"1-200\",\"TRUE\"]/sum(tab5[ ,\"TRUE\"])."}
]
```

```quiz
[
  {
    "type": "fill",
    "q": "Complete Task 1: keep only the rows where neither variable is missing.",
    "code": "SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C) & !___(Total.Precip.mm))",
    "answer": ["is.na"],
    "explain": "is.na() is the only test that detects NA; the & joins the two conditions and ! negates each. 21 184 rows become 17 582."
  },
  {
    "q": "`Monthly.Mean.Temp <- mean(Temp.deg.C ~ Month, data=SFU.Weather)` returns the months in alphabetical order. Which call plots them January to December?",
    "options": ["`barplot(Monthly.Mean.Temp)`", "`barplot(sort(Monthly.Mean.Temp))`", "`barplot(Monthly.Mean.Temp[months])`", "`barplot(Monthly.Mean.Temp, order=months)`"],
    "answer": 2,
    "explain": "The result is a named vector; indexing it by the months vector returns the values in that order. sort() would order by temperature and barplot has no order argument."
  },
  {
    "q": "What does `Monthly.Mean.Temp[Month]` do inside `with(SFU.Weather, ...)`?",
    "options": ["returns the mean of the whole Month column", "looks up the monthly mean for every row at once, giving a vector as long as the data frame", "returns one number, the mean for the current month", "fails because Month is text"],
    "answer": 1,
    "explain": "Month is a column of 17 582 names; indexing a named vector by it is a vectorised lookup, which is what makes (Temp.deg.C − mean)/sd work row by row."
  },
  {
    "q": "From tab2, P(Precip > 0 | Cold) = ? (Cold: 2591 dry, 3455 wet; 4 decimals)",
    "type": "numeric",
    "answer": 0.5715,
    "tolerance": 0.0003,
    "explain": "The cell over its row total: 3455/(2591 + 3455) = 3455/6046 = 0.5715."
  },
  {
    "q": "From tab2, P(Cold | Precip > 0) = ? (wet days: Cold 3455, Mid 2906, Warm 2216; 4 decimals)",
    "type": "numeric",
    "answer": 0.4028,
    "tolerance": 0.0003,
    "explain": "Now the condition is the wet column: 3455/(3455 + 2906 + 2216) = 3455/8577 = 0.4028. Same cell as the previous question, different total."
  },
  {
    "q": "Task 9: P(Warm | Precip > 0) by Bayes, using P(Cold, Mid, Warm) = 0.3439, 0.3388, 0.3174 and P(Precip | seg) = 0.5715, 0.4879, 0.3971? (4 decimals)",
    "type": "numeric",
    "answer": 0.2584,
    "tolerance": 0.0003,
    "explain": "0.3174 × 0.3971 = 0.1260 over 0.1965 + 0.1653 + 0.1260 = 0.4878: 0.2583 on paper, 0.2584 with R's unrounded variables, and 2216/8577 = 0.2584 straight from the table."
  },
  {
    "q": "Precipitation is more likely on Mondays than on other days at SFU.",
    "type": "tf",
    "answer": false,
    "explain": "P(Precip | Monday) = 0.4876 against P(Precip) = 0.4878: equal to three decimals, so precipitation is independent of the day being Monday."
  },
  {
    "q": "Which expression is P(Precip > 0 | Warm and Winter) from the three-way `tab2 <- table(SFU.Weather[c(\"has.Precip\",\"Temp.Seg\",\"Season\")])`?",
    "options": ["`tab2[\"TRUE\",\"Warm\",\"Winter\"]/sum(tab2)`", "`tab2[\"TRUE\",\"Warm\",\"Winter\"]/sum(tab2[ ,\"Warm\",\"Winter\"])`", "`tab2[\"TRUE\",\"Warm\",\"Winter\"]/sum(tab2[\"TRUE\", , ])`", "`sum(tab2[ ,\"Warm\",\"Winter\"])/sum(tab2)`"],
    "answer": 1,
    "explain": "The condition is Warm and Winter, so divide the wet cell by all warm winter days (wet + dry): 1035/1435 = 0.7213. Dividing by sum(tab2) gives a joint probability; dividing by the wet slice conditions on precipitation instead."
  },
  {
    "q": "Why does `tab1[\"Monday\", TRUE]` not select the wet Monday cell?",
    "options": ["Monday must be lower-case", "the table's column names are the strings \"FALSE\" and \"TRUE\", so the index must be the string \"TRUE\"", "tables cannot be indexed by name", "it selects the dry cell"],
    "answer": 1,
    "explain": "table() turns the logical levels into dimnames, which are text. The logical TRUE as an index means \"all columns\" instead."
  },
  {
    "q": "Which season has the most precipitation per day at SFU, and about how much?",
    "options": ["Autumn, 6.7 mm", "Spring, 4.9 mm", "Winter, 8.0 mm", "Summer, 2.3 mm"],
    "answer": 2,
    "explain": "mean(Total.Precip.mm ~ Season) gives Winter 8.03, Autumn 6.74, Spring 4.85, Summer 2.28 mm per day."
  }
]
```
