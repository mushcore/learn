---
title: Lab 3: charts of the survey data
minutes: 22
---

Lab 3 redoes Unit 2's charts in R on a real data frame, `survey` from the MASS package (237 statistics students: writing hand, heights, pulse, hand spans), and its eight tasks are the shape of the RStudio part of a quiz: reproduce a given chart, with a title computed from the data rather than typed. Packages: `MASS`, `lattice`, `dplyr`.

## Pie charts

A pie from raw percentages needs a vector of values and a vector of labels:

```r
percents <- c(10,30,5,35,20)
home.type <- c("On Campus","Parents","Alone", "Roommates", "Spouse")
pie(percents, home.type)
```

Task 1 adds a title and colours: `pie(percents, home.type, main="Living Arrangments of Students", col=c("pink", "snow","turquoise", "orange", "skyblue"))`.

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

`freq.tab` is a named vector: `freq.tab[1]` and `freq.tab["Left"]` print `Left 18` with the name; `freq.tab[["Left"]]` prints just `18`. `pie(freq.tab)` uses the names as labels. To put the counts on the labels, build new ones with `paste0()`:

```r
new.labels <- paste0(names(freq.tab), "\n(", freq.tab,")")
new.labels
```
```text
[1] "Left\n(18)"   "Right\n(218)"
```

`\n` is a line break inside the label. Task 2's chart, with the title composed from the data:

```r
new.labels <- paste0( names(freq.tab), "\n(", freq.tab, " students)")
pie( freq.tab, new.labels, radius=1.0,
     main=paste0("Writing Hand of Students (n = ", sum(freq.tab), ")"),
     col=c("grey","pink"))
```

`sum(freq.tab)` is 236 (one student has no writing hand recorded), and `paste0` glues the pieces into "Writing Hand of Students (n = 236)". Do not hard-code the 236: the lab says so twice.

```widget
cat-charts
{ "categories": { "Left": 18, "Right": 218 }, "title": "survey$W.Hnd: the frequency table, pie and bar the lab draws" }
```

## Bar charts

`barplot(freq.tab)` draws the same table as bars. Task 3 turns it sideways: `barplot(freq.tab, horiz = TRUE, main=paste0("Writing hands of Students (n =", sum(freq.tab), ")"))`. Bars are better than slices for comparing two categories, and `horiz = TRUE` is the only new argument.

## Stem plots

`stem(survey$Height)` prints "The decimal point is 1 digit(s) to the right of the |" and split stems: `15 | 0224` is 150 to 154 cm, the next `15 | 5555...` is 155 to 159. `head(cbind(survey$Height))` shows the raw values as a column, `NA` included. Task 4's plot, `stem(survey$Height, scale=2)`, doubles the number of stems so the key line becomes "The decimal point is at the |" and stems run 150, 152, ..., 200 (`152 | 045` is 152.0, 152.4, 152.5).

## Frequency distributions and cumulative frequencies

`range(survey$Height)` prints `NA NA`: missing values poison the range. Drop them first, then cut the interval into classes of width 5 and count:

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

`cut()` assigns each height to a class labelled `[150,155)`, closed on the left and open on the right because of `right=FALSE`, exactly Unit 2's convention; `table()` counts. Task 5 repeats it for male and female heights with the same limits (`subset(survey, Sex == "Male")$Height`, NAs dropped, `breaks=seq(overall.min, overall.max+5, by=5)`) and concludes that female heights are noticeably smaller while the spread looks similar.

`cumsum(heights.freq)` accumulates: 6, 19, 39, 84, 126, 153, 181, 198, 206, 208, so 126 students are under 175 cm. The ogive is `plot(lower.limits, cumul.freq)` after a 0 is inserted at the front (`cumul.freq <- c(0, cumul.freq)`). `lower.limits` is `seq(150, 200, by=5)`, eleven values, and the padded counts are eleven too, so 0 sits at 150 and each class's count sits at that class's right boundary: 6 at 155, 19 at 160, 208 at 200. Task 7 dresses it: `type="b"` for points and lines, `pch=19`, `lty = 2`, `lwd=2`, axis labels, and `main=paste("Ogive of", sum(heights.freq), "student heights")` for the 208.

:::warn Lab 3's ogive and Unit 2's
Both put each cumulative value at the right end of its class, with a 0 at the start. Two things differ. Lab 3's y-axis is cumulative **counts** (up to 208); Unit 2's is cumulative **relative** frequency (up to 1.000). Lab 3's x-values are the class **boundaries** 155, 160, … (the variable is called `lower.limits` because each is also the next class's lower limit); Unit 2's are the **upper limits** 154, 159, … of whole-number classes.
:::

## Lab 3 pencil problems

They repeat Lab 2's. **Class width**: $n = 250$, min 51.3, max 135.4. $\sqrt{250} = 15.8$ classes, so the ideal width is $(135.4 - 51.3)/15.8 = 5.32$, rounded to 5.3 (16 classes) or 5 (17 classes). **Old Faithful waiting times**: the stem plot runs from 43 to 96 minutes, is bimodal, and most waits fall between 75 and 85. **Boxplots of heights by sex**: when the female box's upper quartile sits below the male box's lower quartile, *75% of female students are shorter than the shortest 25% of male students*; when the male median sits above the female maximum, *50% of the male students are taller than the tallest female student*.

```quiz
[
  { "q": "A data set has $n = 250$, minimum 51.3 and maximum 135.4. What is the ideal class width $R/\\sqrt{n}$? (2 decimals)", "type": "numeric", "answer": 5.32, "tolerance": 0.01, "explain": "R = 135.4 − 51.3 = 84.1 and √250 = 15.81, so 84.1/15.81 = 5.32. Round to a convenient 5.3 (16 classes) or 5 (17 classes)." },
  { "q": "With width 5.3, how many classes cover 51.3 to 135.4?", "type": "numeric", "answer": 16, "tolerance": 0, "explain": "84.1/5.3 = 15.9, rounded up to 16 classes. Width 5 needs 84.1/5 = 16.8, so 17." },
  { "q": "The Old Faithful waiting-time stem plot runs from 43 to 96 minutes with most values between 75 and 85 and a second cluster in the 50s. Its shape is...", "options": ["bimodal", "symmetric and unimodal", "uniform", "skewed right with one peak"], "answer": 0, "explain": "Two clusters, two peaks: short waits after short eruptions and long waits after long ones." },
  { "q": "In side-by-side boxplots, the female Q3 is below the male Q1. Which sentence follows?", "options": ["75% of female students are shorter than the shortest 25% of male students", "every female student is shorter than every male student", "the medians are equal", "50% of female students are taller than the tallest male"], "answer": 0, "explain": "75% of females lie below the female Q3; the shortest 25% of males lie below the male Q1, which is higher still. The boxplot says nothing about every individual." }
]
```

## Histograms and scatter plots

`hist(numerical.heights)` picks width-5 bins and poor labels; Task 6 specifies everything: `hist(numerical.heights, breaks=seq(150, 200, by=2.5), right=FALSE, col="pink", xlab="Heights (cm)", ylab="Frequency", main=paste0("Heights of Students (n = ", length(numerical.heights), ")"))`. The lab's solution spells the variable `numerical.Heights`; R names are case-sensitive, so use the spelling you defined. `length()` gives 209, every non-missing height. The table above summed to 208 because `cut(..., right=FALSE)` leaves the one 200 cm student outside `[195,200)`; `hist()` closes its last bin, so the histogram counts that student.

Scatter plots use lattice's model formula, `xyplot(Wr.Hnd ~ Height, data=survey, col="black")`, a spread-out cloud with little correlation. Task 8 draws two: `xyplot(Pulse ~ Height, ...)` and `xyplot(Wr.Hnd ~ NW.Hnd, ...)`, each with `pch=19`, a hex colour and `main=paste0("... (n = ", nrow(survey), ")")`. Writing hand against non-writing hand is the far stronger linear relation (the two spans are nearly equal for everyone; $r \approx 0.95$), while pulse against height is a cloud ($r \approx -0.07$). `cor(x, y, use="complete.obs")` confirms it with the NAs skipped.

## Pie labels, missing values and classes for trip data

A data frame `trips` has a categorical `Mode` (Bike 12, Bus 41, Car 27, Walk 20) and a numerical `Minutes` with a few `NA` values.

```quiz
[
  {"type": "fill", "q": "Fill the blank so each pie label shows the count under the name.", "code": "freq.tab <- table(trips$Mode)\nnew.labels <- paste0(names(freq.tab), \"\\n(\", ___, \")\")\nnew.labels\n## [1] \"Bike\\n(12)\" \"Bus\\n(41)\"  \"Car\\n(27)\"  \"Walk\\n(20)\"", "answer": ["freq.tab"], "explain": "`paste0()` works element by element: each name, a line break, then the matching count from `freq.tab`."},
  {"q": "`main=paste0(\"Travel Mode (n = \", sum(freq.tab), \")\")`. What does the title read?", "options": ["Travel Mode (n = 100)", "Travel Mode (n = 4)", "Travel Mode (n = sum(freq.tab))", "Travel Mode (n = 41)"], "answer": 0, "explain": "`sum(freq.tab)` adds the counts, $12 + 41 + 27 + 20 = 100$; `length(freq.tab)` would be the 4 categories."},
  {"type": "fill", "q": "`range(trips$Minutes)` prints `NA NA`. Fill the blank that keeps only the recorded values.", "code": "minutes <- trips$Minutes[ ___(trips$Minutes) ]\nrange(minutes)", "answer": ["!is.na"], "explain": "`is.na()` is TRUE for missing values; `!` flips it, so the logical index keeps every recorded value."},
  {"type": "fill", "q": "Fill the argument that makes each class closed on the left.", "code": "table(cut(minutes, breaks=seq(0, 50, by=10), right=___))\n## [0,10) [10,20) [20,30) [30,40) [40,50)\n##       3       8      12       5       2", "answer": ["FALSE", "F"], "explain": "`right=FALSE` gives classes like [10,20): 10 is in, 20 starts the next class, Unit 2's convention."},
  {"q": "`cumsum()` of those frequencies is 3, 11, 23, 28, 30. How many trips took less than 30 minutes?", "type": "numeric", "answer": 23, "tolerance": 0, "explain": "Classes [0,10), [10,20), [20,30) all lie below 30: $3 + 8 + 12 = 23$, the third cumulative count."},
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
