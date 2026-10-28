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

:::info R syntax
| Code | What it does |
|---|---|
| `BCIT.students <- …` | `<-` is assignment: it stores the data frame on the right under the name `BCIT.students`. The dots are just part of the name. |
| `read.csv(…)` | Reads a comma-separated text file into a data frame, one row per line. Its first argument, `file`, is the path. |
| `file.path("Data", "BCIT.students.csv")` | Joins the folder and the file name into one path, with `/` between them. Strings go in quotes. |
| `row.names = 1` | A named argument: column 1 of the file becomes the row labels instead of a data column. |

**Left to right**

- "Store under the name BCIT.students (`BCIT.students <-`) the data frame read from a comma-separated file (`read.csv`) whose path is the folder Data joined to the file BCIT.students.csv (`file.path("Data", "BCIT.students.csv")`), with column 1 as the row labels (`row.names = 1`)."

**Right to left**, the order R runs it

- "Join the folder Data and the file name into one path (`file.path`), read that file into a data frame with column 1 as the row labels (`read.csv`, `row.names = 1`), and store it under the name BCIT.students (`BCIT.students <-`)."
:::

`row.names = 1` makes the first column the row labels, not data. `BCIT.students$Eye.Colour` is then the eye-colour column, like `TenMileRace$net` in Lab 1.

:::warn The printed notes' version does not run
The printed notes show `read.csv("Data\BCIT.students.txt", row.names = 1, sep="")`. `file.path()` above joins the folder and file name with the right separator, as the demo notebook does.

- `\B` is not an escape R knows, so the string fails.
- `sep=""` splits on spaces, not commas.
:::

:::info R syntax
| Code | What it does |
|---|---|
| `read.csv(…)` | Reads a text file of rows into a data frame. Its first argument, `file`, is the path in quotes. |
| `"Data\BCIT.students.txt"` | Inside a string, `\` starts an escape code. `\B` is not one, so R stops with an error before reading anything. |
| `row.names = 1` | Column 1 of the file becomes the row labels, as above. |
| `sep=""` | The field separator. `""` means any run of spaces or tabs, replacing `read.csv`'s comma. |

**Left to right**

- `read.csv("Data\BCIT.students.txt", row.names = 1, sep="")`: "Read into a data frame (`read.csv`) the file at the path Data, backslash, BCIT.students.txt (`"Data\BCIT.students.txt"`), with column 1 as the row labels (`row.names = 1`) and spaces as the separator (`sep=""`)."

**Right to left**, the order R runs it

- `read.csv("Data\BCIT.students.txt", row.names = 1, sep="")`: "Read the path string (`"Data\BCIT.students.txt"`) and fail at the unknown escape `\B`; had it parsed, R would set the row labels and separator (`row.names = 1`, `sep=""`) and then read the file (`read.csv`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `BCIT.students$Eye.Colour` | `$` picks one column of a data frame by name: here the eye-colour column, one value per student. |
| `table( … )` | Counts how many times each distinct value appears, giving one count per category. |
| `freq.tab <- …` | Stores the counts under the name `freq.tab`; assignment prints nothing. |
| `freq.tab` | A name on its own line prints its value: each category name above its count. |

**Left to right**

- `freq.tab <- table( BCIT.students$Eye.Colour )`: "Store under the name freq.tab (`freq.tab <-`) the count per category (`table`) of the Eye.Colour column (`Eye.Colour`) of the student data (`BCIT.students$`)."
- `freq.tab`: "Print the table (`freq.tab`)."

**Right to left**, the order R runs it

- `freq.tab <- table( BCIT.students$Eye.Colour )`: "Take the student data (`BCIT.students`), pull out its Eye.Colour column (`$Eye.Colour`), count each category (`table`), and store the counts as freq.tab (`freq.tab <-`)."
- `freq.tab`: "Look up freq.tab (`freq.tab`) and print it."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `freq.tab[3]` | `[ ]` picks an element by position, and R counts from 1, so 3 is the third category. Single brackets keep the name. |
| `freq.tab["Brown"]` | The same element picked by its name, written as a string in quotes. |
| `freq.tab[[3]]` | Double brackets return the bare value at position 3, with the name dropped. |
| `names(freq.tab)` | Returns the element names as a vector of strings. |
| `[1]` | In printed output, `[1]` is the position of the first value on that line, not part of the value. |

**Left to right**

- `freq.tab[3]`: "From the table (`freq.tab`) take element number 3, keeping its name (`[3]`)."
- `freq.tab["Brown"]`: "From the table (`freq.tab`) take the element named Brown (`["Brown"]`)."
- `freq.tab[[3]]`: "From the table (`freq.tab`) take element number 3 as a bare value, name dropped (`[[3]]`)."
- `names(freq.tab)`: "List the names (`names`) of the table's elements (`freq.tab`)."

**Right to left**, the order R runs it

- `freq.tab[3]`: "Look up the table (`freq.tab`), then pick position 3 with its name (`[3]`)."
- `freq.tab["Brown"]`: "Look up the table (`freq.tab`), then pick the element named Brown (`["Brown"]`)."
- `freq.tab[[3]]`: "Look up the table (`freq.tab`), then pick position 3 and drop the name (`[[3]]`)."
- `names(freq.tab)`: "Look up the table (`freq.tab`), then return its element names (`names`)."
:::

Single brackets keep the name attached; **double square brackets drop it** and return the bare `[1] 130`. Position 3 is Brown only because of the alphabetical order: Black (1), Blue (2), Brown (3), Green (4), Other (5).

## Step 2a: the pie chart

```r
pie(freq.tab, radius=1.0, main="Eye Colour in BCIT Students (n = 302)")
```

:::info R syntax
| Code | What it does |
|---|---|
| `pie(freq.tab, …)` | Draws a pie chart. The first argument, `x`, gives the slice sizes; its names become the slice labels. |
| `radius=1.0` | The size of the circle. The default is 0.8, so 1.0 draws a larger pie. |
| `main="…"` | The chart title, a string in quotes. |

**Left to right**

- "Draw a pie chart (`pie`) of the eye-colour counts (`freq.tab`) with a circle of radius 1.0 (`radius=1.0`) and the title Eye Colour in BCIT Students (`main=`)."

**Right to left**, the order R runs it

- "Take the counts (`freq.tab`), set the radius to 1.0 (`radius=1.0`) and the title (`main=`), then draw the pie (`pie`)."
:::

One slice per category. Each slice's angle is the category's relative frequency times 360°. Brown: $130/302 = 0.4305$, and $0.4305 \times 360° = 155.0°$. Green: $10/302 \times 360° = 11.9°$. Check: the five angles in the pie add to 360°.

:::tip Pie angle
angle $= \dfrac{f}{n} \times 360°$, where $f$ is the category's count and $n$ the sample size.
:::

```diagram
{"type": "flow", "nodes": [{"id": "c", "label": "Brown count", "sub": "f = 130"}, {"id": "p", "label": "Relative freq", "sub": "130 / 302 = 0.4305"}, {"id": "a", "label": "Angle", "sub": "0.4305 × 360° = 155.0°"}], "edges": [{"from": "c", "to": "p", "label": "÷ n"}, {"from": "p", "to": "a", "label": "× 360°"}], "hi": ["a"], "caption": "Angle = f/n × 360°: Brown's 130 of 302 students take 155.0° of the circle."}
```

The instructor's annotation: **"shows relative frequency."** A pie answers "what fraction of the sample is Brown?" at a glance. It is bad at precise comparison: you cannot read off whether Black (95) beats Blue (52).

R draws the slices in alphabetical order, counter-clockwise from 3 o'clock, in its default colours (white, light blue, misty rose, light cyan, lavender). `radius=1.0` fills the plotting area; `main=` is the title.

## Step 2b: the bar chart

```r
barplot(freq.tab, col="lightgreen",
        xlab="Eye Colour", ylab="Frequency",
        main="Eye Colour in BCIT Students (n = 302)")
```

:::info R syntax
| Code | What it does |
|---|---|
| `barplot(freq.tab, …)` | Draws one bar per element. The first argument, `height`, gives the bar heights; the names label the bars. |
| `col="lightgreen"` | The bar fill colour, given as a colour name in quotes. |
| `xlab="Eye Colour"`, `ylab="Frequency"` | The x-axis label and the y-axis label. |
| `main="…"` | The chart title. A call can run over several lines; R reads on until the closing `)`. |

**Left to right**

- "Draw a bar chart (`barplot`) of the eye-colour counts (`freq.tab`) in light green (`col="lightgreen"`), with the axis labels Eye Colour and Frequency (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- "Take the counts (`freq.tab`), set the colour (`col="lightgreen"`), the axis labels (`xlab=`, `ylab=`) and the title (`main=`), then draw the bars (`barplot`)."
:::

One bar per category with **height equal to the frequency**. The instructor's annotations: the y-axis shows **"absolute freq."**, and the chart **"shows absolute frequency, better for comparisons."** All bars share one axis, so Brown (130) against Black (95) is read exactly.

The rule from the notes:

> A pie chart is better at showing what fraction a sample forms out of the whole sample.
> A bar chart is better at showing how two categories compare to each other.

Both charts are drawn from the same frequency table.

```widget
cat-charts
```

## 124 117 PoE2 characters by base class

Every PoE2 character belongs to exactly one of eight base classes. Counting characters per base class gives one categorical variable: 8 categories, $n = 124\,117$ tracked characters (not every player).

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

:::info R syntax
| Code | What it does |
|---|---|
| `base.tab <- c(Druid=10771, …, Witch=12792)` | `c()` combines values into one vector; `name=value` gives each element a name. The result is stored in `base.tab`. |
| `pie(base.tab, main="…")` | A pie with one slice per element, labelled by the names, with a title. |
| `barplot(base.tab, col="lightgreen", ylab="Frequency")` | One bar per element, as above, filled light green, with a y-axis label. |

**Left to right**

- `base.tab <- c(Druid=10771, …)`: "Store under the name base.tab (`base.tab <-`) the combined vector (`c`) of eight counts, each with its class name (`Druid=10771`, …, `Witch=12792`)."
- `pie(base.tab, main=…)`: "Draw a pie chart (`pie`) of the class counts (`base.tab`) with a title (`main=`)."
- `barplot(base.tab, …)`: "Draw a bar chart (`barplot`) of the class counts (`base.tab`) in light green (`col="lightgreen"`) with the y-axis label Frequency (`ylab=`)."

**Right to left**, the order R runs it

- `base.tab <- c(Druid=10771, …)`: "Pair each count with its name (`Druid=10771`, …), combine the eight into one vector (`c`), and store it as base.tab (`base.tab <-`)."
- `pie(base.tab, main=…)`: "Take the counts (`base.tab`), set the title (`main=`), then draw the pie (`pie`)."
- `barplot(base.tab, …)`: "Take the counts (`base.tab`), set the colour and y-axis label (`col=`, `ylab=`), then draw the bars (`barplot`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `barplot(freq.tab, …)` | Bars from the frequency table, as above; each line below adds one more argument. |
| `col=c("black","lightblue","brown","lightgreen","white")` | `c()` makes a vector of five colour names, used in order, one per bar. |
| `border="black"` | The colour of each bar's outline. |
| `ylab="Frequency"` | The y-axis label. |
| `main=paste(…)` | `paste()` joins its pieces into one string, putting a space between pieces. |
| `nrow(BCIT.students)` | The number of rows in the data frame, so the title's n is computed. |
| `sub="…"` | A subtitle printed below the plot. |
| `space = 0.1` | The gap before each bar, as a fraction of the average bar width: a narrow gap. |
| `legend.text=FALSE` | No legend is drawn. |
| `horiz=FALSE` | Bars stand upright; `TRUE` would lay them sideways. |
| `density=30, angle=30` | Fills the bars with hatching, 30 lines per inch slanted at 30 degrees, instead of solid colour. |

**Left to right**

- "Draw a bar chart (`barplot`) of the eye-colour counts (`freq.tab`), one colour per bar from a combined list of five (`col=c(...)`), black outlines (`border="black"`), the y-axis label Frequency (`ylab=`), a title joined (`main=paste`) from text and the number of rows of the student data (`nrow(BCIT.students)`), a subtitle (`sub=`), narrow gaps (`space = 0.1`), no legend (`legend.text=FALSE`), upright bars (`horiz=FALSE`) and hatching at 30 lines per inch and 30 degrees (`density=30, angle=30`)."

**Right to left**, the order R runs it

- "Count the rows of the student data (`nrow(BCIT.students)`), join that count into the title text (`paste`), combine the five colours (`c`), set the outlines, label, subtitle, gaps, legend, direction and hatching (`border=`, `ylab=`, `sub=`, `space=`, `legend.text=`, `horiz=`, `density=`, `angle=`), then draw the bars of the counts (`barplot(freq.tab, …)`)."
:::

- `col=c(...)`: one colour per bar, in alphabetical category order.
- `main=paste("... n = ", nrow(BCIT.students), ")")` builds the title from the row count, so $n$ is **never hard-coded**. Lab 2 asks for this.
- `space` is the gap between bars, `horiz=TRUE` lays them sideways, `density`/`angle` hatch them.

:::tip Percentages instead of counts
A pie chart can be drawn straight from percentages when a question gives those instead of counts (Lab 3 does it with `pie(percents, labels)`).
:::

:::info R syntax
| Code | What it does |
|---|---|
| `pie(percents, labels)` | By position, `percents` fills `x`, the slice sizes, and `labels` fills `labels`, the text written beside each slice. |

**Left to right**

- `pie(percents, labels)`: "Draw a pie chart (`pie`) with slices sized by the percentages (`percents`) and named by the label text (`labels`)."

**Right to left**, the order R runs it

- `pie(percents, labels)`: "Look up the percentages (`percents`) and the label text (`labels`), then draw the pie (`pie`)."
:::

## Count the ascendancies of 800 Hardcore ladder characters

Four pages of the PoE1 Hardcore Allflame ladder hold 800 characters, one row each in `hc`; the largest of 21 ascendancy counts are Luminary 162, Chieftain 110 and Elementalist 109 [PoE1, 3.29 Hardcore Allflame ladder, checked 2026-10-27]. `hc.tab <- table(hc$ascendancy)`, and `top3` is the table for those three only.

:::info R syntax
| Code | What it does |
|---|---|
| `hc$ascendancy` | `$` picks the `ascendancy` column of the data frame `hc`, one value per character. |
| `table( … )` | Counts how many characters have each ascendancy. |
| `hc.tab <- …` | Stores the counts under the name `hc.tab`. |

**Left to right**

- `hc.tab <- table(hc$ascendancy)`: "Store under the name hc.tab (`hc.tab <-`) the count per category (`table`) of the ascendancy column (`ascendancy`) of the ladder data (`hc$`)."

**Right to left**, the order R runs it

- `hc.tab <- table(hc$ascendancy)`: "Take the ladder data (`hc`), pull out its ascendancy column (`$ascendancy`), count each ascendancy (`table`), and store the counts (`hc.tab <-`)."
:::

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
