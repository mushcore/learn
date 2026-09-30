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

`sum(freq.tab)` is 236 (one student has no writing hand recorded), and `paste0` glues the pieces into "Writing Hand of Students (n = 236)". Do not hard-code the 236: the lab says so twice, and so does the quiz.

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

`cumsum(heights.freq)` accumulates: 6, 19, 39, 84, 126, 153, 181, 198, 206, 208, so 126 students are under 175 cm. The ogive is `plot()` of the lower limits against the cumulative counts with a 0 inserted at the front (`cumul.freq <- c(0, cumul.freq)`), and Task 7 dresses it: `type="b"` for points and lines, `pch=19`, `lty = 2`, `lwd=2`, axis labels, and `main=paste("Ogive of", sum(heights.freq), "student heights")` for the 208.

:::warn Two ogive conventions
Unit 2's notes plot cumulative **relative** frequency against the **upper** class limits. Lab 3 plots cumulative **counts** against the **lower** limits with a 0 at the first lower limit. Both are ogives; read the axes before answering a question about one.
:::

## Histograms and scatter plots

`hist(numerical.heights)` picks width-5 bins and poor labels; Task 6 specifies everything: `hist(numerical.Heights, breaks=seq(150, 200, by=2.5), right=FALSE, col="pink", xlab="Heights (cm)", ylab="Frequency", main=paste0("Heights of Students (n = ", length(numerical.Heights), ")"))`, with `length()` supplying the 209 (here `survey[!is.na(survey$Height), "Height"]` keeps the 200 cm student).

Scatter plots use lattice's model formula, `xyplot(Wr.Hnd ~ Height, data=survey, col="black")`, a spread-out cloud with little correlation. Task 8 draws two: `xyplot(Pulse ~ Height, ...)` and `xyplot(Wr.Hnd ~ NW.Hnd, ...)`, each with `pch=19`, a hex colour and `main=paste0("... (n = ", nrow(survey), ")")`. Writing hand against non-writing hand is the far stronger linear relation (the two spans are nearly equal for everyone; $r \approx 0.95$), while pulse against height is a cloud ($r \approx -0.07$). `cor(x, y, use="complete.obs")` confirms it with the NAs skipped.

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
