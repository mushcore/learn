---
title: Frequency tables, pie charts, bar charts
minutes: 15
---
<!-- facts: poe2.data.ascendancy-counts-forbidden-rites, poe1.ladder.class-counts -->

poe.ninja's PoE2 build ladder tracks 124 117 characters [PoE2, 0.5.5e Forbidden Rites build ladder, checked 2026-10-27], and the only summary of their base class is a count per class. Unit 1 summarized data with **numbers**; Unit 2 summarizes it with **pictures**, starting with categorical data: a count per category and the two charts that display those counts.

## The data set for the whole unit

Unit 2 runs on a sample of $n = 302$ BCIT students, one row per student:

| Variable | Type | Values |
|---|---|---|
| `Eye.Colour` | categorical | Black, Blue, Brown, Green, Other |
| `Age` | numerical (integer) | 18 to 42 years |
| `Wr.Hnd` | categorical | writing hand: R, L, A |
| `Height.CM` | numerical | 141 to 199 cm |

Load it with `read.csv`:

```r
BCIT.students <- read.csv(file.path("Data", "BCIT.students.csv"), row.names = 1)
```

The printed notes show `read.csv("Data\BCIT.students.txt", row.names = 1, sep="")`, which does not run: `"\B"` is not a valid R escape, and `sep=""` splits on spaces rather than commas. `file.path()` joins the folder and file name with the right separator, as the demo notebook does.

`row.names = 1` makes the first column the row labels, not data. `BCIT.students$Eye.Colour` is then the eye-colour column, like `TenMileRace$net` in Lab 1.

## Step 1: the frequency table

A **frequency** is a count. `table()` counts how many individuals fall in each category:

```r
freq.tab <- table( BCIT.students$Eye.Colour )
freq.tab
```
```text
Black  Blue Brown Green Other
   95    52   130    10    15
```

**R lists the categories alphabetically**, not by size and not in the order they appear in the data. The counts sum to $n$: $95 + 52 + 130 + 10 + 15 = 302$.

The instructor's note on the chart: **"Brown is the modal colour (i.e. mode)."** The **mode** is the category with the highest frequency, and it is the only measure of centre a categorical variable has. Dividing a count by $n$ gives the Unit 1 sample proportion: $\hat{p}(\text{Brown}) = 130/302 = 0.4305$ ([Categorical data: proportion & mode](#/math3042/categorical)).

### R detail: a table is a "named vector"

`freq.tab` is a vector whose elements carry names. Index it by position or by name; the bracket style decides whether the name comes along:

```r
freq.tab[3]
freq.tab["Brown"]
freq.tab[[3]]
names(freq.tab)
```
```text
Brown
  130
Brown
  130
[1] 130
[1] "Black" "Blue"  "Brown" "Green" "Other"
```

Single brackets keep the name attached; **double square brackets drop it** and return the bare `[1] 130`. Position 3 is Brown only because of the alphabetical order: Black (1), Blue (2), Brown (3), Green (4), Other (5).

## Step 2a: the pie chart

```r
pie(freq.tab, radius=1.0, main="Eye Colour in BCIT Students (n = 302)")
```

One slice per category, and the **angle of each slice is the category's relative frequency** $x/n$: Brown is $130/302 = 43\%$ of the circle, Green $10/302 = 3.3\%$. The instructor's annotation: **"shows relative frequency."** A pie answers "what fraction of the sample is Brown?" at a glance. It is bad at precise comparison: you cannot read off whether Black (95) beats Blue (52).

R draws the slices in alphabetical order, counter-clockwise from 3 o'clock, in its default colours (white, light blue, misty rose, light cyan, lavender). `radius=1.0` fills the plotting area; `main=` is the title.

## Step 2b: the bar chart

```r
barplot(freq.tab, col="lightgreen",
        xlab="Eye Colour", ylab="Frequency",
        main="Eye Colour in BCIT Students (n = 302)")
```

One bar per category with **height equal to the frequency**. The instructor's annotations: the y-axis shows **"absolute freq."**, and the chart **"shows absolute frequency, better for comparisons."** All bars share one axis, so Brown (130) against Black (95) is read exactly.

The rule from the notes:

> A pie chart is better at showing what fraction a sample forms out of the whole sample.
> A bar chart is better at showing how two categories compare to each other.

Both charts are drawn from the same frequency table.

```widget
cat-charts
```

## 124 117 PoE2 characters by base class

Each character counts once under its ascendancy, the specialization picked inside one of eight base classes. Summed per base class, the counts make one categorical variable with real counts that sum to $n = 124\,117$ tracked characters, not every player.

```quiz
[
  {"q": "Mercenary holds 44 833 of the 124 117 characters. Its relative frequency $\\hat{p}$ = ? (4 decimals)", "type": "numeric", "answer": 0.3612, "tolerance": 0.0001, "explain": "$\\hat{p} = 44\\,833/124\\,117 = 0.3612$, or 36.12 % of the ladder."},
  {"q": "How many degrees of `pie()`'s circle does the Mercenary slice take? (1 decimal)", "type": "numeric", "answer": 130.0, "tolerance": 0.06, "unit": "°", "explain": "Angle = relative frequency × 360°: $0.36122 \\times 360° = 130.0°$."}
]
```

| Base class | Frequency | Relative frequency | Percent | Pie angle |
|---|---|---|---|---|
| Druid | 10 771 | 0.0868 | 8.68 % | 31.2° |
| Huntress | 11 400 | 0.0918 | 9.18 % | 33.1° |
| Mercenary | 44 833 | 0.3612 | 36.12 % | 130.0° |
| Monk | 15 356 | 0.1237 | 12.37 % | 44.5° |
| Ranger | 9 009 | 0.0726 | 7.26 % | 26.1° |
| Sorceress | 14 616 | 0.1178 | 11.78 % | 42.4° |
| Warrior | 5 340 | 0.0430 | 4.30 % | 15.5° |
| Witch | 12 792 | 0.1031 | 10.31 % | 37.1° |
| total | 124 117 | 1.0000 | 100.00 % | 360° |

Mercenary is the modal base class. poe.ninja publishes counts, not rows, so the table is typed as a named vector in `table()`'s alphabetical order:

```r
base.tab <- c(Druid=10771, Huntress=11400, Mercenary=44833, Monk=15356,
              Ranger=9009, Sorceress=14616, Warrior=5340, Witch=12792)
pie(base.tab, main="PoE2 base classes (n = 124117)")
barplot(base.tab, col="lightgreen", ylab="Frequency")
```

The pie shows Mercenary as over a third of the circle; only the bars settle Monk against Sorceress, whose slices differ by 2.1°.

## Dressing up a bar chart (from the demo notebook)

The demo notebook's extra `barplot()` arguments, to recognize rather than memorize:

```r
barplot(freq.tab,  col=c("black","lightblue","brown","lightgreen","white"),
        border="black",
        ylab="Frequency",
        main=paste("Eye Colour of Students ( n = ", nrow(BCIT.students), ")"),
        sub="(synthetic data from Carl Gladish)",
        space = 0.1,
        legend.text=FALSE,
        horiz=FALSE,
        density=30, angle=30)
```

- `col=c(...)`: one colour per bar, in alphabetical category order.
- `main=paste("... n = ", nrow(BCIT.students), ")")` builds the title from the row count, so $n$ is **never hard-coded**. Lab 2 asks for this.
- `space` is the gap between bars, `horiz=TRUE` lays them sideways, `density`/`angle` hatch them.

:::tip Percentages instead of counts
A pie chart can be drawn straight from percentages when a question gives those instead of counts (Lab 3 does it with `pie(percents, labels)`).
:::

## Count the ascendancies of 800 Hardcore ladder characters

Four pages of the PoE1 Hardcore Allflame ladder hold 800 characters, one row each in `hc`; the largest of 21 ascendancy counts are Luminary 162, Chieftain 110 and Elementalist 109 [PoE1, 3.29 Hardcore Allflame ladder, checked 2026-10-27]. `hc.tab <- table(hc$ascendancy)`, and `top3` is the table for those three only.

```quiz
[
  {"q": "Compute $\\hat{p}$ for Luminary in these 800 characters. (4 decimals)", "type": "numeric", "answer": 0.2025, "tolerance": 0.0001, "explain": "$\\hat{p} = 162/800 = 0.2025$, about 20.3 % of the sampled characters."},
  {"q": "What is the modal ascendancy?", "type": "text", "answer": ["Luminary"], "explain": "Luminary has the largest frequency, 162. The mode is the category, not the count."},
  {"q": "In `pie(hc.tab)`, how many degrees does the Chieftain slice take? (1 decimal)", "type": "numeric", "answer": 49.5, "tolerance": 0.06, "unit": "°", "explain": "Relative frequency × 360°: $110/800 = 0.1375$, and $0.1375 \\times 360° = 49.5°$."},
  {"q": "Chieftain (110) and Elementalist (109) differ by one character. Which chart shows which one is larger?", "options": ["The bar chart", "The pie chart", "Both equally", "Neither"], "answer": 0, "explain": "The bars share one Frequency axis, so 110 against 109 is read off the heights. The two slices are 49.5° and 49.1°, which the eye cannot separate: a pie shows fraction of the whole, a bar chart compares."},
  {"q": "`top3` holds the Chieftain, Elementalist and Luminary counts. What does `top3[[2]]` print?", "options": ["`[1] 109`", "`[1] 110`", "`Elementalist` above `109`", "`[1] 162`"], "answer": 0, "explain": "`table()` lists the categories alphabetically: Chieftain (1), Elementalist (2), Luminary (3). Position 2 is Elementalist, and double brackets drop the name, so R prints `[1] 109`."},
  {"type": "fill", "q": "Fill the blank so the title's $n$ is computed from the data frame, not typed.", "code": "barplot(hc.tab, col=\"lightgreen\", ylab=\"Frequency\",\n        main=paste0(\"Hardcore ascendancies (n = \", ___(hc), \")\"))", "answer": ["nrow"], "explain": "`nrow(hc)` counts the rows, one per character, so the title reads n = 800 and stays right if the data changes."}
]
```

```quiz
[
  {"q": "Which R function builds a frequency table from a categorical column?", "options": ["`table(x)`", "`freq(x)`", "`summary(x)`", "`hist(x)`"], "answer": 0, "explain": "`table()` counts how many rows fall in each category; the notes assign it to `freq.tab` and feed that to both `pie()` and `barplot()`."},
  {"q": "In what order does `table(BCIT.students$Eye.Colour)` list the categories?", "options": ["Alphabetically: Black, Blue, Brown, Green, Other", "Largest count first", "The order they first appear in the data", "Randomly"], "answer": 0, "explain": "R orders the levels alphabetically, which is why position 3 is Brown."},
  {"q": "`freq.tab` is Black 95, Blue 52, Brown 130, Green 10, Other 15. What does `freq.tab[[3]]` print?", "options": ["`Brown` on one line and `130` below it", "`[1] 130`", "`[1] 52`", "`Brown 52`"], "answer": 1, "explain": "Double brackets return the bare value with the name dropped; position 3 is Brown (alphabetical), whose count is 130."},
  {"q": "Which chart is better for showing what fraction of the whole sample each category makes up?", "options": ["Pie chart", "Bar chart", "Histogram", "Stem-and-leaf plot"], "answer": 0, "explain": "Slice area is relative frequency, so the pie shows fraction-of-the-whole directly. The instructor's annotation: pie 'shows relative frequency'."},
  {"q": "Which chart is better for comparing two categories against each other?", "options": ["Bar chart", "Pie chart", "Ogive", "Box plot"], "answer": 0, "explain": "Bars share one Frequency axis, so heights can be compared exactly; the notes say a bar chart 'shows absolute frequency, better for comparisons'."},
  {"q": "The vertical axis of the eye-colour bar chart shows relative frequency (proportions).", "type": "tf", "answer": false, "explain": "`barplot(freq.tab, ...)` plots the counts themselves; the axis is labelled Frequency and shows absolute frequency (Brown reaches 130)."},
  {"q": "What is the mode of eye colour in this sample, and what is its sample proportion (4 decimals)?", "type": "numeric", "answer": 0.4305, "tolerance": 0.001, "explain": "Brown is the modal colour: it has the largest frequency, 130. $\\hat{p} = 130/302 = 0.4305$."},
  {"q": "How many students are in the sample if the frequency table reads 95, 52, 130, 10, 15?", "type": "numeric", "answer": 302, "tolerance": 0, "explain": "Frequencies always add to $n$: $95+52+130+10+15 = 302$."},
  {"q": "In `main=paste(\"Eye Colour ( n = \", nrow(BCIT.students), \")\")`, why call `nrow()` instead of typing 302?", "options": ["So the title's n is computed from the data and is never hard-coded", "Because R cannot print numbers in titles", "To make the chart wider", "It sorts the bars"], "answer": 0, "explain": "`nrow()` returns the number of rows; if the data changes, the title stays correct. Lab 2 asks for titles built this way."},
  {"q": "Which measure of centre is the only one that always makes sense for a categorical variable?", "type": "text", "answer": ["mode", "the mode", "modal category"], "explain": "You cannot average colours; the mode (most frequent category, here Brown) is the only centre for categorical data."},
  {"type": "match", "q": "Match each R piece to what it does.", "pairs": [["`table(x)`", "counts rows per category (the frequency table)"], ["`pie(freq.tab)`", "one slice per category, area = relative frequency"], ["`barplot(freq.tab, col=\"lightgreen\")`", "one bar per category, height = frequency"], ["`freq.tab[\"Brown\"]`", "the Brown count, with its name attached"], ["`freq.tab[[3]]`", "the third count as a bare number, name dropped"], ["`nrow(BCIT.students)`", "the sample size n, computed from the data"]], "explain": "Single brackets keep names, double brackets drop them; both charts are drawn from the same table."}
]
```
