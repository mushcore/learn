---
title: Lab 3: charts of the survey data
minutes: 22
---

Lab 3 redoes Unit 2's charts in R on a real data frame, `survey` from the MASS package (237 statistics students: writing hand, heights, pulse, hand spans).

Its eight tasks are the shape of the RStudio part of a quiz: reproduce a given chart, with a title computed from the data rather than typed.

Packages: `MASS`, `lattice`, `dplyr`.

## Pie charts

A pie from raw percentages needs a vector of values and a vector of labels:

```r
percents <- c(10,30,5,35,20)
home.type <- c("On Campus","Parents","Alone", "Roommates", "Spouse")
pie(percents, home.type)
```

:::info R syntax
| Code | What it does |
|---|---|
| `percents <- c(10,30,5,35,20)` | `<-` is assignment. `c()` combines the five numbers into one vector, stored as `percents`. |
| `home.type <- c("On Campus", …)` | A vector of five strings, each in quotes; the dot is just part of the name. |
| `pie(percents, home.type)` | Draws a pie chart. Positionally, x = `percents` (the slice sizes) and labels = `home.type`, matched in order. |

**Left to right**

- `percents <- c(10,30,5,35,20)`: "Store under the name percents (`percents <-`) the combined (`c()`) numbers 10, 30, 5, 35 and 20."
- `home.type <- c("On Campus", …)`: "Store under the name home.type (`home.type <-`) the combined (`c()`) five label strings (`"On Campus"`, …)."
- `pie(percents, home.type)`: "Draw a pie chart (`pie`) with slice sizes percents (`percents`) and labels home.type (`home.type`)."

**Right to left**, the order R runs it

- `percents <- c(10,30,5,35,20)`: "Combine the five numbers into a vector (`c()`), then store it as percents (`percents <-`)."
- `home.type <- c("On Campus", …)`: "Combine the five strings into a vector (`c()`), then store it as home.type (`home.type <-`)."
- `pie(percents, home.type)`: "Look up percents (`percents`) and home.type (`home.type`), then draw the pie from them (`pie`)."
:::

Task 1 adds a title and colours:

```r
pie(percents, home.type,
    main="Living Arrangments of Students",
    col=c("pink", "snow","turquoise", "orange", "skyblue"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `pie(percents, home.type, …)` | As above: x = `percents`, labels = `home.type`. A call may continue over several lines until its bracket closes. |
| `main="Living Arrangments of Students"` | The title, a string in quotes (the lab's own spelling). |
| `col=c("pink", "snow", …)` | Slice colours, one per slice in order, combined into a vector with `c()`. |

**Left to right**

- `pie(percents, home.type, main=…, col=…)`: "Draw a pie chart (`pie`) with slice sizes percents (`percents`), labels home.type (`home.type`), a title (`main=`) and five colours (`col=c(…)`)."

**Right to left**, the order R runs it

- `pie(percents, home.type, main=…, col=…)`: "Combine the five colour names (`c(…)`), take the title string (`main=`), look up the sizes and labels (`percents`, `home.type`), then draw the pie (`pie`)."
:::

From a data frame, the first step is Unit 2's frequency table:

```r
data(survey)
levels( survey$W.Hnd )
freq.tab <- table( survey$W.Hnd )
freq.tab
```
```text
[1] "Left"  "Right"

 Left Right
   18   218
```

:::info R syntax
| Code | What it does |
|---|---|
| `data(survey)` | Loads the `survey` data frame from the MASS package into the session. |
| `survey$W.Hnd` | `$` picks one column of a data frame by name: the writing-hand column. |
| `levels( survey$W.Hnd )` | Lists the categories of a factor column. `[1]` in the output is the position of the first value on the printed line. |
| `freq.tab <- table( survey$W.Hnd )` | `table()` counts how many rows fall in each category; the counts are stored in `freq.tab`. |
| `freq.tab` | A name on its own line prints it: each category name above its count. |

**Left to right**

- `data(survey)`: "Load the data set (`data`) called survey (`survey`)."
- `levels( survey$W.Hnd )`: "The categories (`levels`) of the W.Hnd column (`W.Hnd`) of the survey data (`survey$`)."
- `freq.tab <- table( survey$W.Hnd )`: "Store under the name freq.tab (`freq.tab <-`) the count of each category (`table`) in the W.Hnd column (`W.Hnd`) of the survey data (`survey$`)."
- `freq.tab`: "Print freq.tab (`freq.tab`)."

**Right to left**, the order R runs it

- `data(survey)`: "Find the data set named survey (`survey`) and load it (`data`)."
- `levels( survey$W.Hnd )`: "Take the survey data (`survey`), pull out its W.Hnd column (`$W.Hnd`), then list its categories (`levels`)."
- `freq.tab <- table( survey$W.Hnd )`: "Take the survey data (`survey`), pull out W.Hnd (`$W.Hnd`), count each category (`table`), then store the counts as freq.tab (`freq.tab <-`)."
- `freq.tab`: "Look up freq.tab (`freq.tab`) and print it."
:::

`freq.tab` is a named vector: `freq.tab[1]` and `freq.tab["Left"]` print `Left 18` with the name; `freq.tab[["Left"]]` prints just `18`.

`pie(freq.tab)` uses the names as labels. To put the counts on the labels, build new ones with `paste0()`:

```r
new.labels <- paste0(names(freq.tab), "\n(", freq.tab,")")
new.labels
```
```text
[1] "Left\n(18)"   "Right\n(218)"
```

:::info R syntax
| Code | What it does |
|---|---|
| `names(freq.tab)` | The category names of the table, as a vector of strings. |
| `paste0(…, "\n(", freq.tab, ")")` | Glues its arguments into strings with no separator, element by element: one label per category. |
| `"\n("` | `\n` inside quotes is a line-break character, followed by an opening bracket. |
| `new.labels` | Prints the two labels; R shows `\n` as typed rather than breaking the line. |

**Left to right**

- `new.labels <- paste0(names(freq.tab), "\n(", freq.tab,")")`: "Store under the name new.labels (`new.labels <-`) the glued-together strings (`paste0`) of the category names (`names`) of freq.tab (`freq.tab`), a line break and opening bracket (`"\n("`), the counts (`freq.tab`) and a closing bracket (`")"`)."
- `new.labels`: "Print new.labels (`new.labels`)."

**Right to left**, the order R runs it

- `new.labels <- paste0(names(freq.tab), "\n(", freq.tab,")")`: "Take freq.tab (`freq.tab`) and get its category names (`names`), glue each name to a line break and bracket, its count and a closing bracket (`paste0`), then store the labels as new.labels (`new.labels <-`)."
- `new.labels`: "Look up new.labels (`new.labels`) and print it."
:::

`\n` is a line break inside the label.

Task 2's chart, with the title composed from the data:

```r
new.labels <- paste0( names(freq.tab), "\n(", freq.tab, " students)")
pie( freq.tab, new.labels, radius=1.0,
     main=paste0("Writing Hand of Students (n = ", sum(freq.tab), ")"),
     col=c("grey","pink"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `new.labels <- paste0( names(freq.tab), "\n(", freq.tab, " students)")` | As above, but each label ends with the word students after the count. |
| `pie( freq.tab, new.labels, …)` | x = `freq.tab` (slice sizes), labels = `new.labels`. |
| `radius=1.0` | The size of the pie; 1.0 draws it larger than the default. |
| `main=paste0("Writing Hand of Students (n = ", sum(freq.tab), ")")` | The title. `sum(freq.tab)` adds the counts, and `paste0` builds the title string around that number. |
| `col=c("grey","pink")` | Slice colours, used in order: Left grey, Right pink. |

**Left to right**

- `new.labels <- paste0( names(freq.tab), "\n(", freq.tab, " students)")`: "Store under the name new.labels (`new.labels <-`) the glued strings (`paste0`) of each category name (`names(freq.tab)`), a line break and bracket (`"\n("`), its count (`freq.tab`) and the word students with a closing bracket (`" students)"`)."
- `pie( freq.tab, new.labels, … )`: "Draw a pie chart (`pie`) of the counts (`freq.tab`) with labels new.labels (`new.labels`), at size 1.0 (`radius=1.0`), titled (`main=`) with the glued string (`paste0`) of the title text and the total count (`sum(freq.tab)`), coloured grey and pink (`col=c("grey","pink")`)."

**Right to left**, the order R runs it

- `new.labels <- paste0( names(freq.tab), "\n(", freq.tab, " students)")`: "Get the category names of freq.tab (`names(freq.tab)`), glue each to a line break, its count and the word students (`paste0`), then store the labels as new.labels (`new.labels <-`)."
- `pie( freq.tab, new.labels, … )`: "Add up the counts (`sum(freq.tab)`), glue that total into the title string (`paste0`), combine the two colours (`c("grey","pink")`), then draw the pie of freq.tab with those labels, radius, title and colours (`pie`)."
:::

`sum(freq.tab)` is 236 (one student has no writing hand recorded), and `paste0` glues the pieces into "Writing Hand of Students (n = 236)".

Do not hard-code the 236: the lab says so twice.

```widget
cat-charts
{ "categories": { "Left": 18, "Right": 218 }, "title": "survey$W.Hnd: the frequency table, pie and bar the lab draws" }
```

## Bar charts

`barplot(freq.tab)` draws the same table as bars. Task 3 turns it sideways:

```r
barplot(freq.tab)
barplot(freq.tab,
        horiz = TRUE,
        main=paste0("Writing hands of Students (n =", sum(freq.tab), ")"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `barplot(freq.tab)` | Draws one bar per category; height = the counts in `freq.tab`, labelled with their names. |
| `horiz = TRUE` | Lays the bars sideways, growing to the right. |
| `main=paste0("Writing hands of Students (n =", sum(freq.tab), ")")` | The title: `paste0` glues the text to the total from `sum(freq.tab)` with no separator. |

**Left to right**

- `barplot(freq.tab)`: "Draw a bar chart (`barplot`) of the counts (`freq.tab`)."
- `barplot(freq.tab, horiz = TRUE, main=…)`: "Draw a bar chart (`barplot`) of the counts (`freq.tab`), sideways (`horiz = TRUE`), titled (`main=`) with the text glued (`paste0`) to the total count (`sum(freq.tab)`)."

**Right to left**, the order R runs it

- `barplot(freq.tab)`: "Look up the counts (`freq.tab`) and draw them as bars (`barplot`)."
- `barplot(freq.tab, horiz = TRUE, main=…)`: "Add up the counts (`sum(freq.tab)`), glue the total into the title (`paste0`), then draw the sideways bars with that title (`barplot`, `horiz = TRUE`, `main=`)."
:::

Bars are better than slices for comparing two categories, and `horiz = TRUE` is the only new argument.

## Stem plots

`head(cbind(survey$Height))` shows the raw values as a column, `NA` included.

The first lines `stem(survey$Height)` prints:

```text
  The decimal point is 1 digit(s) to the right of the |

  15 | 0224
  15 | 555566777777899
```

Task 4's plot, `stem(survey$Height, scale=2)`, starts:

```text
  The decimal point is at the |

  150 | 0
  152 | 045
```

| call | key line | stems | how to read one line |
|---|---|---|---|
| `stem(survey$Height)` | 1 digit(s) to the right of the \| | 15, 15, 16, 16, … 20: each tens value twice | `15 \| 0224` is 150, 152, 152, 154 cm; the next `15` line is 155 to 159 |
| `stem(survey$Height, scale=2)` | at the \| | 150, 152, …, 200: twice as many stems | `152 \| 045` is 152.0, 152.4, 152.5 cm |

:::info R syntax
| Code | What it does |
|---|---|
| `stem(survey$Height)` | `$` picks the Height column of the `survey` data frame; `stem` prints a stem-and-leaf plot of it in the console. |
| `head(cbind(survey$Height))` | `cbind` makes the heights one column; `head` shows only its first rows. |
| `stem(survey$Height, scale=2)` | `scale=2` makes the plot about twice as long, so there are twice as many stems. |

**Left to right**

- `stem(survey$Height)`: "Print a stem plot (`stem`) of the Height column (`Height`) of the survey data (`survey$`)."
- `head(cbind(survey$Height))`: "The first rows (`head`) of the heights (`survey$Height`) bound into one column (`cbind`)."
- `stem(survey$Height, scale=2)`: "Print a stem plot (`stem`) of the heights (`survey$Height`) at double length (`scale=2`)."

**Right to left**, the order R runs it

- `stem(survey$Height)`: "Take the survey data (`survey`), pull out Height (`$Height`), then print its stem plot (`stem`)."
- `head(cbind(survey$Height))`: "Pull out the heights (`survey$Height`), bind them into a column (`cbind`), then keep the first few rows (`head`) and print them."
- `stem(survey$Height, scale=2)`: "Pull out the heights (`survey$Height`), set double length (`scale=2`), then print the stem plot (`stem`)."
:::

## Frequency distributions and cumulative frequencies

`range(survey$Height)` prints `NA NA`: missing values poison the range.

Drop them first, then cut the interval into classes of width 5 and count:

:::info R syntax
| Code | What it does |
|---|---|
| `range(survey$Height)` | The smallest and largest of the Height column; any `NA` (missing value) in it makes both results `NA`. |

**Left to right**

- "The smallest and largest values (`range`) of the Height column (`Height`) of the survey data (`survey$`)."

**Right to left**, the order R runs it

- "Take the survey data (`survey`), pull out Height (`$Height`), then find its smallest and largest values (`range`)."
:::

```r
numerical.heights <- survey$Height[ !is.na(survey$Height) ]
range(numerical.heights)
lower.limits <- seq(150, 200, by=5)
heights.classes = cut(numerical.heights, lower.limits, right=FALSE)
heights.freq = table(heights.classes)
cbind(heights.freq)
```
```text
[1] 150 200
          heights.freq
[150,155)            6
[155,160)           13
[160,165)           20
[165,170)           45
[170,175)           42
[175,180)           27
[180,185)           28
[185,190)           17
[190,195)            8
[195,200)            2
```

:::info R syntax
| Code | What it does |
|---|---|
| `is.na(survey$Height)` | `TRUE` for each missing height, `FALSE` for each recorded one. |
| `!is.na(…)` | `!` is NOT: it flips each `TRUE` and `FALSE`, so recorded heights become `TRUE`. |
| `survey$Height[ … ]` | `[ ]` with a logical vector keeps only the elements where it is `TRUE`. Stored as `numerical.heights`. |
| `range(numerical.heights)` | Prints the smallest and largest value. |
| `seq(150, 200, by=5)` | from = 150, to = 200, in steps of `by` = 5: 150, 155, …, 200. |
| `heights.classes = cut(numerical.heights, lower.limits, right=FALSE)` | `=` assigns, like `<-`. `cut` puts each value of x into a class; breaks = `lower.limits`. |
| `right=FALSE` | Classes are closed on the left and open on the right, `[150,155)`. |
| `heights.freq = table(heights.classes)` | Counts the heights in each class. |
| `cbind(heights.freq)` | Binds the counts as one column, so the table prints vertically under the heading `heights.freq`. |

**Left to right**

- `numerical.heights <- survey$Height[ !is.na(survey$Height) ]`: "Store under the name numerical.heights (`numerical.heights <-`) the Height column of survey (`survey$Height`), keeping only the positions (`[ ]`) where it is not (`!`) missing (`is.na`)."
- `range(numerical.heights)`: "The smallest and largest values (`range`) of numerical.heights (`numerical.heights`)."
- `lower.limits <- seq(150, 200, by=5)`: "Store under the name lower.limits (`lower.limits <-`) the sequence (`seq`) from 150 (`150`) to 200 (`200`) in steps of 5 (`by=5`)."
- `heights.classes = cut(numerical.heights, lower.limits, right=FALSE)`: "Store under the name heights.classes (`heights.classes =`) the class (`cut`) of each value in numerical.heights (`numerical.heights`) using the breaks lower.limits (`lower.limits`), closed on the left (`right=FALSE`)."
- `heights.freq = table(heights.classes)`: "Store under the name heights.freq (`heights.freq =`) the count of each class (`table`) in heights.classes (`heights.classes`)."
- `cbind(heights.freq)`: "Show as one column (`cbind`) the counts heights.freq (`heights.freq`)."

**Right to left**, the order R runs it

- `numerical.heights <- survey$Height[ !is.na(survey$Height) ]`: "Pull out the Height column (`survey$Height`), mark the missing values (`is.na`), flip the marks so recorded values are TRUE (`!`), keep those positions (`[ ]`), then store the result as numerical.heights (`numerical.heights <-`)."
- `range(numerical.heights)`: "Look up numerical.heights (`numerical.heights`), then find its smallest and largest values (`range`)."
- `lower.limits <- seq(150, 200, by=5)`: "Count from 150 to 200 in fives (`seq(150, 200, by=5)`), then store the sequence as lower.limits (`lower.limits <-`)."
- `heights.classes = cut(numerical.heights, lower.limits, right=FALSE)`: "Take the heights and the breaks, sort each height into its left-closed class (`cut`, `right=FALSE`), then store the classes (`heights.classes =`)."
- `heights.freq = table(heights.classes)`: "Count the heights in each class (`table`), then store the counts (`heights.freq =`)."
- `cbind(heights.freq)`: "Take the counts (`heights.freq`), bind them into one column (`cbind`) and print it."
:::

`cut()` assigns each height to a class labelled `[150,155)`, closed on the left and open on the right because of `right=FALSE`, exactly Unit 2's convention; `table()` counts.

Task 5 repeats it for male and female heights with the same limits (`subset(survey, Sex == "Male")$Height`, NAs dropped, `breaks=seq(overall.min, overall.max+5, by=5)`) and concludes that female heights are noticeably smaller while the spread looks similar.

:::info R syntax
| Code | What it does |
|---|---|
| `subset(survey, Sex == "Male")` | Keeps only the rows of `survey` where the condition is `TRUE`; `==` tests equality with the string `"Male"`. |
| `…$Height` | `$` then takes the Height column of those rows. |
| `breaks=seq(overall.min, overall.max+5, by=5)` | Break points from `overall.min` up to `overall.max` + 5 in steps of 5; `+` adds, so the last class covers the maximum. |

**Left to right**

- `subset(survey, Sex == "Male")$Height`: "The Height column (`$Height`) of the subset (`subset`) of survey (`survey`) where Sex (`Sex`) equals (`==`) Male (`"Male"`)."
- `breaks=seq(overall.min, overall.max+5, by=5)`: "Break points (`breaks=`) as a sequence (`seq`) from overall.min (`overall.min`) to overall.max plus 5 (`overall.max+5`) in steps of 5 (`by=5`)."

**Right to left**, the order R runs it

- `subset(survey, Sex == "Male")$Height`: "Test each row's Sex against Male (`Sex == "Male"`), keep the TRUE rows of survey (`subset`), then pull out their Height column (`$Height`)."
- `breaks=seq(overall.min, overall.max+5, by=5)`: "Add 5 to overall.max (`overall.max+5`), count from overall.min up to it in fives (`seq`, `by=5`), then pass that as the break points (`breaks=`)."
:::

The ogive takes three steps: running totals, a 0 in front, then the plot.

Task 7's version of the plot:

```r
cumul.freq <- cumsum(heights.freq)
cumul.freq <- c(0, cumul.freq)
plot(lower.limits, cumul.freq,
     col="black",
     type="b",
     pch=19,
     cex=0.75,
     lty = 2,
     lwd=2,
     xlab="student heights (cm)",
     ylab="number of students",
     main=paste("Ogive of", sum(heights.freq), "student heights"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `cumul.freq <- cumsum(heights.freq)` | `cumsum` gives running totals: each entry is the sum of all counts up to and including that class. Stored as `cumul.freq`. |
| `cumul.freq <- c(0, cumul.freq)` | `c()` puts a 0 in front of the old vector, and `<-` stores the longer vector back under the same name. |
| `plot(lower.limits, cumul.freq, …)` | Plots points with x = `lower.limits` and y = `cumul.freq`, paired in order. |
| `col="black"` | The colour of the points and lines. |
| `type="b"` | Draws both points and lines joining them. |
| `pch=19` | The point symbol: 19 is a filled circle. |
| `cex=0.75` | Point size: 0.75 of the default. |
| `lty = 2` | The line type: 2 is dashed. |
| `lwd=2` | The line width: twice the default. |
| `xlab=`, `ylab=` | The axis labels, as strings. |
| `main=paste("Ogive of", sum(heights.freq), "student heights")` | `paste` glues its pieces with a space between each, unlike `paste0`. |

**Left to right**

- `cumul.freq <- cumsum(heights.freq)`: "Store under the name cumul.freq (`cumul.freq <-`) the running totals (`cumsum`) of heights.freq (`heights.freq`)."
- `cumul.freq <- c(0, cumul.freq)`: "Store under the name cumul.freq (`cumul.freq <-`) a 0 (`0`) combined (`c()`) with the old cumul.freq (`cumul.freq`)."
- `plot(lower.limits, cumul.freq, …)`: "Plot (`plot`) lower.limits (`lower.limits`) across against cumul.freq (`cumul.freq`) up, in black (`col="black"`), as points and lines (`type="b"`), filled circles (`pch=19`) at 0.75 size (`cex=0.75`), dashed (`lty = 2`) and thick (`lwd=2`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`) pasted with spaces (`paste`) around the total count (`sum(heights.freq)`)."

**Right to left**, the order R runs it

- `cumul.freq <- cumsum(heights.freq)`: "Take heights.freq (`heights.freq`), add it up as it goes (`cumsum`), then store it as cumul.freq (`cumul.freq <-`)."
- `cumul.freq <- c(0, cumul.freq)`: "Look up the old cumul.freq, put 0 in front (`c(0, …)`), then store the result under the same name (`cumul.freq <-`)."
- `plot(lower.limits, cumul.freq, …)`: "Add up the counts (`sum(heights.freq)`) and paste the title (`paste`), look up the two vectors (`lower.limits`, `cumul.freq`), pair them in order, then draw them with the chosen style and labels (`plot`)."
:::

The padding is what makes the pairs line up: `lower.limits` is `seq(150, 200, by=5)`, eleven values, and the padded counts are eleven too.

```diagram
{ "type": "grid", "nodes": [
  { "id": "x0", "label": "lower.limits", "row": 0, "col": 0 },
  { "id": "x1", "label": "150", "row": 0, "col": 1 },
  { "id": "x2", "label": "155", "row": 0, "col": 2 },
  { "id": "x3", "label": "160", "row": 0, "col": 3 },
  { "id": "x4", "label": "165", "row": 0, "col": 4 },
  { "id": "x5", "label": "170", "row": 0, "col": 5 },
  { "id": "x6", "label": "175", "row": 0, "col": 6 },
  { "id": "x7", "label": "180", "row": 0, "col": 7 },
  { "id": "x8", "label": "185", "row": 0, "col": 8 },
  { "id": "x9", "label": "190", "row": 0, "col": 9 },
  { "id": "x10", "label": "195", "row": 0, "col": 10 },
  { "id": "x11", "label": "200", "row": 0, "col": 11 },
  { "id": "y0", "label": "cumul.freq", "row": 1, "col": 0 },
  { "id": "y1", "label": "0", "row": 1, "col": 1 },
  { "id": "y2", "label": "6", "row": 1, "col": 2 },
  { "id": "y3", "label": "19", "row": 1, "col": 3 },
  { "id": "y4", "label": "39", "row": 1, "col": 4 },
  { "id": "y5", "label": "84", "row": 1, "col": 5 },
  { "id": "y6", "label": "126", "row": 1, "col": 6 },
  { "id": "y7", "label": "153", "row": 1, "col": 7 },
  { "id": "y8", "label": "181", "row": 1, "col": 8 },
  { "id": "y9", "label": "198", "row": 1, "col": 9 },
  { "id": "y10", "label": "206", "row": 1, "col": 10 },
  { "id": "y11", "label": "208", "row": 1, "col": 11 }
], "hi": ["y1", "y6"], "caption": "Eleven x values, eleven padded counts: 0 at 150, and 126 at 175 means 126 heights below 175 cm." }
```

So 0 sits at 150 and each class's count sits at that class's right boundary: 6 at 155, 126 at 175 (126 students are under 175 cm), 208 at 200.

Task 7's arguments only style the plot (`type="b"` joins the points with lines) and compute the title, "Ogive of 208 student heights".

:::warn Lab 3's ogive and Unit 2's
Both put each cumulative value at the right end of its class, with a 0 at the start.

Two things differ:

| | Lab 3 (R) | Unit 2 (pencil) |
|---|---|---|
| y-axis | cumulative counts, up to 208 | cumulative relative frequency, up to 1.000 |
| x-values | class boundaries 155, 160, … | upper limits 154, 159, … |

The variable is called `lower.limits` because each boundary is also the next class's lower limit.
:::

## Lab 3 pencil problems

They repeat Lab 2's.

- **Class width**: $n = 250$, min 51.3, max 135.4. The ideal width is the range over $\sqrt{n}$, written $R/\sqrt{n}$, rounded to a convenient value; the number of classes is then the range over the width, rounded up.
- **Old Faithful waiting times**: a stem plot from 43 to 96 minutes, with one cluster in the 50s and most waits between 75 and 85.
- **Boxplots of heights by sex**: the female box's upper quartile (Q3) sits below the male box's lower quartile (Q1).

```diagram
{ "type": "grid", "nodes": [
  { "id": "h0", "label": "height →", "row": 0, "col": 0 },
  { "id": "h1", "label": "F Q1", "row": 0, "col": 1 },
  { "id": "h2", "label": "F median", "row": 0, "col": 2 },
  { "id": "h3", "label": "F Q3", "row": 0, "col": 3 },
  { "id": "h4", "label": "M Q1", "row": 0, "col": 4 },
  { "id": "h5", "label": "M median", "row": 0, "col": 5 },
  { "id": "h6", "label": "M Q3", "row": 0, "col": 6 },
  { "id": "f0", "label": "Female box", "row": 1, "col": 0 },
  { "id": "f1", "label": "box", "row": 1, "col": 1 },
  { "id": "f2", "label": "box", "row": 1, "col": 2 },
  { "id": "f3", "label": "75% below", "row": 1, "col": 3 },
  { "id": "f4", "label": "", "row": 1, "col": 4 },
  { "id": "f5", "label": "", "row": 1, "col": 5 },
  { "id": "f6", "label": "", "row": 1, "col": 6 },
  { "id": "m0", "label": "Male box", "row": 2, "col": 0 },
  { "id": "m1", "label": "", "row": 2, "col": 1 },
  { "id": "m2", "label": "", "row": 2, "col": 2 },
  { "id": "m3", "label": "", "row": 2, "col": 3 },
  { "id": "m4", "label": "75% above", "row": 2, "col": 4 },
  { "id": "m5", "label": "box", "row": 2, "col": 5 },
  { "id": "m6", "label": "box", "row": 2, "col": 6 }
], "hi": ["f3", "m4"], "caption": "Two boxes on one height axis. The female Q3 is left of the male Q1, so the two boxes do not overlap." }
```

Read it as: female Q3 < male Q1, so three quarters of the women are below a height that three quarters of the men are above.

```quiz
[
  { "q": "A data set has $n = 250$, minimum 51.3 and maximum 135.4. What is the ideal class width $R/\\sqrt{n}$? (2 decimals)", "type": "numeric", "answer": 5.32, "tolerance": 0.01, "explain": "$$R = 135.4 - 51.3 = 84.1$$ $$\\sqrt{250} = 15.81$$ $$\\dfrac{84.1}{15.81} = \\mathbf{5.32}$$ Round to a convenient 5.3 (16 classes) or 5 (17 classes)." },
  { "q": "With width 5.3, how many classes cover 51.3 to 135.4?", "type": "numeric", "answer": 16, "tolerance": 0, "explain": "$$\\dfrac{84.1}{5.3} = 15.9 \\to \\mathbf{16} \\text{ classes}$$ Width 5 needs $$\\dfrac{84.1}{5} = 16.8 \\to 17$$" },
  { "q": "The Old Faithful waiting-time stem plot runs from 43 to 96 minutes with most values between 75 and 85 and a second cluster in the 50s. Its shape is...", "options": ["bimodal", "symmetric and unimodal", "uniform", "skewed right with one peak"], "answer": 0, "explain": "Two clusters, two peaks: short waits after short eruptions and long waits after long ones." },
  { "q": "In side-by-side boxplots, the female Q3 is below the male Q1. Which sentence follows?", "options": ["75% of female students are shorter than the shortest 25% of male students", "every female student is shorter than every male student", "the medians are equal", "50% of female students are taller than the tallest male"], "answer": 0, "explain": "75% of females lie below the female Q3; the shortest 25% of males lie below the male Q1, which is higher still. The boxplot says nothing about every individual." }
]
```

The class width, step by step:

1. Range:
   $$R = 135.4 - 51.3 = 84.1$$
2. Root of $n$:
   $$\sqrt{250} = 15.81$$
3. Ideal width:
   $$\dfrac{84.1}{15.81} = \mathbf{5.32}$$
4. Classes at width 5.3:
   $$\dfrac{84.1}{5.3} = 15.9 \to \mathbf{16} \text{ classes}$$
5. Classes at width 5:
   $$\dfrac{84.1}{5} = 16.8 \to \mathbf{17} \text{ classes}$$

The Old Faithful plot has two clusters, so it is bimodal.

For the boxplots, the instructor's sentences are *75% of female students are shorter than the shortest 25% of male students* and, when the male median sits above the female maximum, *50% of the male students are taller than the tallest female student*.

## Histograms and scatter plots

`hist(numerical.heights)` picks width-5 bins and poor labels; Task 6 specifies everything:

```r
hist(numerical.heights)
hist(numerical.heights,
     breaks=seq(150, 200, by=2.5),
     right=FALSE,
     col="pink",
     xlab="Heights (cm)",
     ylab="Frequency",
     main=paste0("Heights of Students (n = ", length(numerical.heights), ")"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `hist(numerical.heights)` | Draws a histogram of x = `numerical.heights`, with R choosing the bins and labels. |
| `breaks=seq(150, 200, by=2.5)` | Bin edges 150, 152.5, …, 200: `seq` with from = 150, to = 200, by = 2.5. |
| `right=FALSE` | Bins closed on the left and open on the right, `[150,152.5)`. |
| `col="pink"` | The bar fill colour. |
| `xlab=`, `ylab=` | The axis labels, as strings. |
| `main=paste0("Heights of Students (n = ", length(numerical.heights), ")")` | `length` counts the values; `paste0` glues that number into the title with no separator. |
| `cut(..., right=FALSE)` | The earlier `cut` call, shortened with `...`; `right=FALSE` makes its classes left-closed too. |

**Left to right**

- `hist(numerical.heights)`: "Draw a histogram (`hist`) of numerical.heights (`numerical.heights`)."
- `hist(numerical.heights, breaks=…, right=FALSE, col="pink", xlab=…, ylab=…, main=…)`: "Draw a histogram (`hist`) of numerical.heights with edges (`breaks=`) from 150 to 200 in steps of 2.5 (`seq(150, 200, by=2.5)`), left-closed bins (`right=FALSE`), pink bars (`col="pink"`), axis labels (`xlab=`, `ylab=`) and a title (`main=`) glued (`paste0`) around the number of heights (`length(numerical.heights)`)."
- `cut(..., right=FALSE)`: "Sort into classes (`cut`) the values and breaks (`...`), closed on the left (`right=FALSE`)."

**Right to left**, the order R runs it

- `hist(numerical.heights)`: "Look up numerical.heights (`numerical.heights`) and draw its histogram (`hist`)."
- `hist(numerical.heights, breaks=…, right=FALSE, col="pink", xlab=…, ylab=…, main=…)`: "Build the edges (`seq(150, 200, by=2.5)`), count the heights (`length`) and glue the title (`paste0`), then draw the histogram with those edges, left-closed bins, colour and labels (`hist`)."
- `cut(..., right=FALSE)`: "Take the values and breaks (`...`), make the classes left-closed (`right=FALSE`), then sort each value into its class (`cut`)."
:::

The lab's solution spells the variable `numerical.Heights`; R names are case-sensitive, so use the spelling you defined.

`length()` gives 209, every non-missing height. The table above summed to 208 because `cut(..., right=FALSE)` leaves the one 200 cm student outside `[195,200)`; `hist()` closes its last bin, so the histogram counts that student.

Scatter plots use lattice's model formula, `xyplot(Wr.Hnd ~ Height, data=survey, col="black")`, a spread-out cloud with little correlation.

Task 8 draws two: `xyplot(Pulse ~ Height, ...)` and `xyplot(Wr.Hnd ~ NW.Hnd, ...)`, each with `pch=19`, a hex colour and `main=paste0("... (n = ", nrow(survey), ")")`.

Writing hand against non-writing hand is the far stronger linear relation (the two spans are nearly equal for everyone; $r \approx 0.95$), while pulse against height is a cloud ($r \approx -0.07$). `cor(x, y, use="complete.obs")` confirms it with the NAs skipped.

:::info R syntax
| Code | What it does |
|---|---|
| `xyplot(Wr.Hnd ~ Height, data=survey, col="black")` | lattice's scatter plot. `~` is a formula: y ~ x, so Wr.Hnd goes up and Height across. |
| `data=survey` | Says where to find the columns named in the formula. |
| `col="black"` | The point colour. |
| `xyplot(Pulse ~ Height, ...)`, `xyplot(Wr.Hnd ~ NW.Hnd, ...)` | The same call with other columns; `...` stands for the other arguments. |
| `main=paste0("... (n = ", nrow(survey), ")")` | `nrow` counts the rows of the data frame; `paste0` glues it into the title. |
| `cor(x, y, use="complete.obs")` | The correlation r of x and y; `use="complete.obs"` drops every pair with a missing value. |

**Left to right**

- `xyplot(Wr.Hnd ~ Height, data=survey, col="black")`: "A scatter plot (`xyplot`) of Wr.Hnd (`Wr.Hnd`) against (`~`) Height (`Height`) from the survey data (`data=survey`) in black (`col="black"`)."
- `xyplot(Pulse ~ Height, ...)`: "A scatter plot (`xyplot`) of Pulse (`Pulse`) against (`~`) Height (`Height`) with the other arguments (`...`)."
- `xyplot(Wr.Hnd ~ NW.Hnd, ...)`: "A scatter plot (`xyplot`) of Wr.Hnd (`Wr.Hnd`) against (`~`) NW.Hnd (`NW.Hnd`) with the other arguments (`...`)."
- `main=paste0("... (n = ", nrow(survey), ")")`: "A title (`main=`) glued (`paste0`) from the text and the number of rows (`nrow`) of survey (`survey`)."
- `cor(x, y, use="complete.obs")`: "The correlation (`cor`) of x (`x`) and y (`y`) using only complete pairs (`use="complete.obs"`)."

**Right to left**, the order R runs it

- `xyplot(Wr.Hnd ~ Height, data=survey, col="black")`: "Find the columns in survey (`data=survey`), read the formula as y = Wr.Hnd, x = Height (`~`), then draw the black points (`xyplot`, `col="black"`)."
- `xyplot(Pulse ~ Height, ...)`: "Read the formula y = Pulse, x = Height (`~`), then draw the points (`xyplot`)."
- `xyplot(Wr.Hnd ~ NW.Hnd, ...)`: "Read the formula y = Wr.Hnd, x = NW.Hnd (`~`), then draw the points (`xyplot`)."
- `main=paste0("... (n = ", nrow(survey), ")")`: "Count the rows of survey (`nrow(survey)`), glue the count into the text (`paste0`), then use it as the title (`main=`)."
- `cor(x, y, use="complete.obs")`: "Drop the pairs with a missing value (`use="complete.obs"`), then compute the correlation of what is left (`cor`)."
:::

## Pie labels, missing values and classes for trip data

A data frame `trips` has a categorical `Mode` (Bike 12, Bus 41, Car 27, Walk 20) and a numerical `Minutes` with a few `NA` values.

```quiz
[
  {"type": "fill", "q": "Fill the blank so each pie label shows the count under the name.", "code": "freq.tab <- table(trips$Mode)\nnew.labels <- paste0(names(freq.tab), \"\\n(\", ___, \")\")\nnew.labels\n## [1] \"Bike\\n(12)\" \"Bus\\n(41)\"  \"Car\\n(27)\"  \"Walk\\n(20)\"", "answer": ["freq.tab"], "explain": "`paste0()` works element by element: each name, a line break, then the matching count from `freq.tab`."},
  {"q": "`main=paste0(\"Travel Mode (n = \", sum(freq.tab), \")\")`. What does the title read?", "options": ["Travel Mode (n = 100)", "Travel Mode (n = 4)", "Travel Mode (n = sum(freq.tab))", "Travel Mode (n = 41)"], "answer": 0, "explain": "`sum(freq.tab)` adds the counts: $$12 + 41 + 27 + 20 = \\mathbf{100}$$ `length(freq.tab)` would be the 4 categories."},
  {"type": "fill", "q": "`range(trips$Minutes)` prints `NA NA`. Fill the blank that keeps only the recorded values.", "code": "minutes <- trips$Minutes[ ___(trips$Minutes) ]\nrange(minutes)", "answer": ["!is.na"], "explain": "`is.na()` is TRUE for missing values; `!` flips it, so the logical index keeps every recorded value."},
  {"type": "fill", "q": "Fill the argument that makes each class closed on the left.", "code": "table(cut(minutes, breaks=seq(0, 50, by=10), right=___))\n## [0,10) [10,20) [20,30) [30,40) [40,50)\n##       3       8      12       5       2", "answer": ["FALSE", "F"], "explain": "`right=FALSE` gives classes like [10,20): 10 is in, 20 starts the next class, Unit 2's convention."},
  {"q": "`cumsum()` of those frequencies is 3, 11, 23, 28, 30. How many trips took less than 30 minutes?", "type": "numeric", "answer": 23, "tolerance": 0, "explain": "Classes [0,10), [10,20), [20,30) all lie below 30: $$3 + 8 + 12 = \\mathbf{23}$$ This is the third cumulative count."},
  {"q": "Lab 3's ogive is `plot(seq(0, 50, by=10), c(0, cumsum(freqs)))`. At which $x$ is the point with height 23 drawn?", "type": "numeric", "answer": 30, "tolerance": 0, "explain": "The padded counts 0, 3, 11, 23, 28, 30 pair with 0, 10, 20, 30, 40, 50: each count sits at its class's right boundary, so 23 (everything below 30) is at $x = 30$."}
]
```

```quiz
[
  {
    "q": "`freq.tab <- table(survey$W.Hnd)` gives Left 18, Right 218. What does `freq.tab[[\"Left\"]]` print?",
    "options": ["`Left 18` with the name", "`[1] 18`", "`[1] \"Left\"`", "an error"],
    "answer": 1,
    "explain": "Double brackets drop the name; single brackets keep it."
  },
  {
    "q": "What does `paste0(names(freq.tab), \"\\n(\", freq.tab, \")\")` produce?",
    "options": ["\"Left\\n(18)\" \"Right\\n(218)\"", "\"Left (18) Right (218)\"", "236", "an error: cannot paste a table"],
    "answer": 0,
    "explain": "paste0 works element by element with no separator; \\n is a line break inside each label."
  },
  {
    "q": "Why does the lab insist on `main=paste0(\"... (n = \", sum(freq.tab), \")\")` instead of typing 236?",
    "options": ["paste0 is faster", "The title must be computed from the data so it stays correct if the data changes; hard-coding n is marked wrong", "R cannot print numbers in titles", "236 is not the right number"],
    "answer": 1,
    "explain": "Task 2: use code to compose the title; do not hard-code the value after n =. sum(freq.tab) is 236 because one writing hand is missing."
  },
  {
    "q": "Which argument turns `barplot(freq.tab)` sideways?",
    "type": "text",
    "answer": ["horiz = TRUE", "horiz=TRUE", "horiz"],
    "explain": "barplot(freq.tab, horiz = TRUE, main=...) is Task 3."
  },
  {
    "q": "`range(survey$Height)` prints `NA NA`. Which line fixes it?",
    "options": ["`range(survey$Height, na=0)`", "`numerical.heights <- survey$Height[ !is.na(survey$Height) ]` then `range(numerical.heights)`", "`range(survey)`", "`survey$Height <- 0`"],
    "answer": 1,
    "explain": "Keep only the non-missing values with a logical index; the range is then 150 to 200."
  },
  {
    "q": "`cut(numerical.heights, seq(150, 200, by=5), right=FALSE)` labels its first class...",
    "options": ["`[150,155)`", "`(150,155]`", "`150-154`", "`[150,155]`"],
    "answer": 0,
    "explain": "right=FALSE: closed on the left, open on the right, so 155 starts the next class, Unit 2's convention."
  },
  {
    "q": "The cumulative frequencies are 6, 19, 39, 84, 126, 153, 181, 198, 206, 208. How many students are shorter than 175 cm?",
    "type": "numeric",
    "answer": 126,
    "tolerance": 0,
    "explain": "The fifth class is [170,175); its cumulative count 126 is everyone below 175."
  },
  {
    "q": "Before plotting Lab 3's ogive, `cumul.freq <- c(0, cumul.freq)` is run. Why?",
    "options": ["To make the vector longer", "To insert a 0 at the first lower limit, because no data points lie below it", "cumsum forgets the first value", "To reverse the order"],
    "answer": 1,
    "explain": "The ogive starts at 0 at the first lower limit and rises to n = 208 at the last."
  },
  {
    "q": "In `plot(lower.limits, cumul.freq, type=\"b\", pch=19, lty=2)`, `type=\"b\"` means...",
    "options": ["bars", "both points and lines", "blue", "boxplot"],
    "answer": 1,
    "explain": "b for both; pch=19 filled circles; lty=2 dashed line; lwd=2 thicker."
  },
  {
    "q": "Which pair of survey variables has the stronger linear correlation?",
    "options": ["Pulse and Height", "Wr.Hnd and NW.Hnd (writing and non-writing hand spans)", "They are equal", "Height and W.Hnd"],
    "answer": 1,
    "explain": "The two hand spans are nearly identical for every student (r about 0.95); pulse against height is a cloud (r about -0.07)."
  }
]
```
