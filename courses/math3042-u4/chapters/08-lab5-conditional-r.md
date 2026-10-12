---
title: Lab 5: conditional probability from the SFU weather data
minutes: 30
---

Lab 5 asks four questions of 58 years of daily weather at SFU (1965–2022, from the Government of Canada "Daily Data Report"): is precipitation more likely on Mondays, which season is wettest, do cold or warm days change the chance of precipitation, and does the season change that dependence. The tools are *filtering*, *segmenting*, and conditional probabilities read off `table()`. Packages: `dplyr`, `mosaic`.

:::info Outputs computed from the CSV
No solutions were posted for Lab 5. Every output below was computed from `SFU.Weather.with.Precip.csv` with the Task 1 filter applied and checked against the answers the lab notebook states (0.488, 8.0 mm, winter).
:::

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

Plain `read.csv(..., header=TRUE, na="NA")` reads `Date` as a string; `colClasses` names each column's type in order, so `Date` becomes a real Date (needed for `weekdays()` later), followed by `Year`, `Month` (three-letter text), `Day`, `Temp.deg.C`, `Total.Rain.mm` and `Total.Precip.mm` (rain plus melted snow). `months` fixes the calendar order, which nothing in the data supplies: text sorts alphabetically.

## Task 1: filter out the missing days

`filter(df, condition)` keeps the rows where the condition is `TRUE`. `is.na()` is the only test that detects `NA` (`x == NA` is itself `NA`):

```r
SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))
nrow(SFU.Weather)
```
```text
[1] 17582
```

21 184 days become 17 582. Without this step `mean()` returns `NA` and every table below has a different total.

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

The result is a **named vector**, one value per month, in alphabetical order. Indexing by name fixes the order: `Monthly.Mean.Temp[months]` returns Jan to Dec, so Task 3's chart is

```r
barplot(Monthly.Mean.Temp[months], col="lightblue",
        xlab="Month", ylab="Mean Temp (deg C)",
        main=paste0("Mean Monthly Temperature at SFU (", min(SFU.Weather$Year),
                    "-", max(SFU.Weather$Year), ")"))
```

Warmest two months: **Aug (17.39) and Jul (17.10)**; coldest two: **Dec (2.89) and Jan (2.90)**.

## with(): work inside the data frame

`with(df, expr)` evaluates `expr` with the data frame's columns in scope, so `df$` is not repeated:

```r
max(SFU.Weather$Temp.deg.C) - min(SFU.Weather$Temp.deg.C)
with(SFU.Weather, max(Temp.deg.C) - min(Temp.deg.C))
```
```text
[1] 51.8
[1] 51.8
```

## The standardized temperature anomaly: cold for the month

*A "cold" day in July is not as cold as a "cold" day in January*, so the lab standardizes each day against its own month: `Z.anomaly` $= (X - \bar{X})/s$ with $\bar{X}$ and $s$ *calculated separately for each month*.

```r
Z.Temp.anomaly <- with(SFU.Weather,
     (Temp.deg.C - Monthly.Mean.Temp[Month])/Monthly.SD.Temp[Month])
SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly
```

`Monthly.Mean.Temp[Month]` is a vectorised lookup: `Month` is a column of 17 582 month names, and indexing the named vector by it returns the right monthly mean for every row at once. Assigning to `SFU.Weather$Z.Temp.anomaly` appends a new column. A 2.9 °C day scores 0 in January and about −4.3 in July.

Task 4 draws it with mosaic's `histogram`, classes of width 0.25 and a fitted normal curve:

```r
histogram(~Z.Temp.anomaly, data=SFU.Weather, type="density", fit="normal",
          breaks=seq(-6, 6, by=0.25), xlab="Standardized temperature anomaly")
```

The anomalies run from −5.8 to 5.5 with mean 0 and sd 1.00, and the bars sit under the curve: *normally distributed (more or less)*.

## Segmenting with nested ifelse

`ifelse(test, yes, no)` works element by element; a second `ifelse` in the `no` slot gives three categories:

```r
SFU.Weather$Temp.Seg <- with(SFU.Weather,
     ifelse(Z.Temp.anomaly < -0.4307, "Cold",
            ifelse(Z.Temp.anomaly <= 0.4307, "Mid", "Warm")))
```

*Cold* is $Z < -0.4307$, *Mid* is $-0.4307 \le Z \le 0.4307$, *Warm* is $Z > 0.4307$. The inner test only sees days that failed the first one, so `<= 0.4307` there already means "at least −0.4307". The cut points ±0.4307 are the normal distribution's tertiles, which is why the segments come out near one third each.

## Tasks 5 and 6: the segment proportions and their pie

A probability from data is a count over the number of rows; `Temp.Seg == "Cold"` is a logical vector and `sum()` counts its `TRUE`s:

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

`prop.table(table(SFU.Weather$Temp.Seg))` gives the same three proportions in one call, and Task 6's pie is Lab 3's recipe on that table, `pie(table(SFU.Weather$Temp.Seg), main=paste0("Temperature segments, n = ", nrow(SFU.Weather)))`, title composed from the data.

```widget
cat-charts
{ "categories": { "Cold": 6046, "Mid": 5956, "Warm": 5580 }, "title": "table(Temp.Seg): the three segments as a table, pie and bar" }
```

## Task 7: seasons by %in%, then seasonal mean precipitation

`Month %in% c("Jun","Jul","Aug")` is `TRUE` when the month is one of the three, so the same nested `ifelse` builds `Season`:

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

*Winter is the wettest season at SFU with 8.0 mm per day on average*; summer averages 2.3 mm.

## Day of week and the precipitation flag

```r
SFU.Weather$DoW <- weekdays(SFU.Weather$Date)
SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)
```

`weekdays()` needs the Date class from the import. `has.Precip` is a logical column, `TRUE` on any day with measurable precipitation.

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

`table()` on two columns gives rows by the first and columns by the second, indexed like a matrix by name. The names are strings, including `"TRUE"`: the logical levels became text, so `tab1["Monday", TRUE]` would not work. `tab1[ ,"TRUE"]` is the whole wet column, so $P(\text{Precip})$ = 8577/17 582 = 0.4878; `tab1["Monday",]` is the Monday row, so the conditional is the cell over its **row** total, 1222/2506 = 0.4876. *The fact that these two probabilities are so close (~0.488) means that having precipitation is independent of a day being Monday*: $P(B \mid A) = P(B)$ is Unit 3's test. The other days sit between 0.483 and 0.493.

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

$P(\text{Precip} > 0 \mid \text{Cold}) = 3455/6046 = 0.5715$, $P(\text{Precip} > 0 \mid \text{Mid}) = 2906/5956 = 0.4879$, $P(\text{Precip} > 0 \mid \text{Warm}) = 2216/5580 = 0.3971$. Each is a cell over the total of its condition, the row; 3455 over the grand total 17 582 would be the joint probability 0.1965 instead. The lab's answer: *yes, since the probability of precipitation given a Cold day is greater than the probability of precipitation on a Warm or Mid day.* Temperature and precipitation are dependent.

```widget
two-way
{ "rows": ["Cold", "Mid", "Warm"], "cols": ["Precip = 0", "Precip > 0"], "data": [[2591, 3455], [3050, 2906], [3364, 2216]], "select": "row", "r": 0, "title": "tab2: click a row for P(Precip > 0 | segment), the Precip > 0 column for P(segment | Precip > 0)" }
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

The denominator is $P(\text{Precip})$ = 0.4878 again, by total probability. The second line is the self-check: the same conditional straight from the table, 2216/8577, the Warm cell over the wet **column** total. The two must agree; with four-decimal values on paper the ratio comes to 0.2583, a rounding difference only. To see the tree, pick the three-branch preset "defective CPUs" in the widget and type Warm's numbers into the first row (P = 0.3174, conditional 0.3971), Cold's into the second (0.3439, 0.5715) and Mid's into the third (0.3388, 0.4879); the labels stay Intel, AMD and Other, but the arithmetic is Task 9's (its note that the rounded priors add to 1.0001 can be ignored).

```widget
bayes-tree
{ "preset": "defective CPUs", "title": "Task 9 on the tree: overwrite the three priors and three conditionals with the segment numbers" }
```

## Task 10: does the season change the dependence? A three-way table

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

Three variables give a three-dimensional table indexed `[has.Precip, Temp.Seg, Season]`; a blank index keeps every level of that dimension. `sum(tab2[ ,"Warm","Winter"])` is all warm winter days (400 + 1035 = 1435), and 1035/1435 = 0.7213 is $P(\text{Precip} > 0 \mid \text{Warm and Winter})$. *The season where SFU is most likely to have precipitation on a warm day is winter.* The season reverses the dependence: in winter a warm day is wetter than a cold one (0.72 against 612/1199 = 0.51), in summer a cold day is far wetter than a warm one (897/1701 = 0.53 against 0.09).

## Task 11: the month with the wettest warm days

The same table by `Month`, the wet row over wet plus dry, indexed by `months` for order and scaled to percent:

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

**December** has the greatest probability of precipitation given a warm day, 78.2% (390 of 499 warm December days), with Nov 75.0% and Jan 74.9% close behind; July's 5.7% is the lowest. The bars reproduce the lab's figure: high in winter, near zero in July and August.

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
