---
title: Frequency tables, pie charts, bar charts
minutes: 14
---

Unit 1 summarized data with **numbers**: $\bar{X}$, $s$, quartiles, $\hat{p}$. Unit 2 summarizes the same data with **pictures**. The instructor's opening line: *"It is also important to present visual summaries of data through charts and tables."* This lesson covers the categorical case, where the only sensible summary is a count per category, and the two charts that display those counts.

## The data set for the whole unit

Everything in Unit 2 runs on a sample of $n = 302$ BCIT students. Each row is one student; the four columns are:

| Variable | Type | Values |
|---|---|---|
| `Eye.Colour` | categorical | Black, Blue, Brown, Green, Other |
| `Age` | numerical (integer) | 18 to 42 years |
| `Wr.Hnd` | categorical | writing hand: R, L, A |
| `Height.CM` | numerical | 141 to 199 cm |

Loading it in R (the notes use `read.csv` on the file `BCIT.students.csv`):

```r
BCIT.students <- read.csv("Data\BCIT.students.csv", row.names = 1, sep="")
```

`row.names = 1` tells R the first column holds row labels (1, 2, 3, ...), not data. After this line, `BCIT.students$Eye.Colour` is the eye-colour column, exactly like `TenMileRace$net` in Lab 1.

## Step 1: the frequency table

A **frequency** is a count. To summarize a categorical variable you count how many individuals fall in each category, and R's `table()` does exactly that:

```r
freq.tab <- table( BCIT.students$Eye.Colour )
freq.tab
```
```text
Black  Blue Brown Green Other
   95    52   130    10    15
```

Two things to notice, because both come up in questions:

1. **R lists the categories alphabetically** (Black, Blue, Brown, Green, Other), not in the order they appear in the data and not by size.
2. The counts sum to $n$: $95 + 52 + 130 + 10 + 15 = 302$.

The instructor's interpretation, written right on the chart: **"Brown is the modal colour (i.e. mode)."** The **mode** of a categorical variable is the category with the highest frequency, and it is the only measure of centre that makes sense for categories (there is no "average eye colour"). Dividing by $n$ turns a frequency into the sample proportion from Unit 1: $\hat{p}(\text{Brown}) = 130/302 = 0.4305$. See [Categorical data: proportion & mode](#/math3042/categorical) if that needs a refresher.

### R detail: a table is a "named vector"

The notes flag this with **R language:** the object `freq.tab` is a vector whose elements carry names. You can index it by position or by name, and the bracket style decides whether the name comes along:

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

Single brackets keep the name attached (`Brown` printed above `130`); **double square brackets drop the name** and return the bare number `[1] 130`. Position 3 is Brown only because of the alphabetical ordering.

:::quiz Position versus name
A likely question: "What does `freq.tab[3]` return?" You need the alphabetical order to answer it: Black (1), Blue (2), Brown (3), Green (4), Other (5). `freq.tab[[3]]` is the same count without its label.
:::

## Step 2a: the pie chart

```r
pie(freq.tab, radius=1.0, main="Eye Colour in BCIT Students (n = 302)")
```

`pie()` takes the frequency table and draws one slice per category. The **area (angle) of each slice is that category's fraction of the whole sample**, its relative frequency $x/n$. Brown's slice is $130/302 = 43\%$ of the circle, Green's is $10/302 = 3.3\%$.

The instructor's annotation beside the pie: **"shows relative frequency."** So the pie chart answers the question *"what fraction of the sample is Brown?"* at a glance. What it does badly is precise comparison: is Black (95) bigger than Blue (52)? You can see it, but you cannot read either number, and two slices of similar size are hard to rank by eye.

R's default slice colours are white, light blue, misty rose, light cyan, lavender, in the alphabetical order of the categories, starting at 3 o'clock and going counter-clockwise. `radius=1.0` just makes the pie fill the plotting area; `main=` is the title.

## Step 2b: the bar chart

```r
barplot(freq.tab, col="lightgreen",
        xlab="Eye Colour", ylab="Frequency",
        main="Eye Colour in BCIT Students (n = 302)")
```

`barplot()` draws one bar per category with **height equal to the frequency** (the count itself, read off the vertical axis labelled Frequency). The instructor's annotations: the y-axis shows **"absolute freq."**, and the chart **"shows absolute frequency, better for comparisons."** He drew an arrow from the top of the Black bar up to the top of the Brown bar: on a bar chart you can see exactly how much taller Brown (130) is than Black (95), because both are measured against the same axis.

The notes state the rule in two sentences you should be able to reproduce:

> A pie chart is better at showing what fraction a sample forms out of the whole sample.
> A bar chart is better at showing how two categories compare to each other.

Both charts are built from the **same frequency table**; they present the same information in related but different ways.

## Try it

Edit the frequencies (for example, make Blue 200) and watch the pie re-slice while the bars re-scale. Hover a row to find its slice and its bar. The R output and the named-vector indexing update too.

```widget
cat-charts
```

## Dressing up a bar chart (from the demo notebook)

The demo notebook shows the extra arguments `barplot()` accepts. You are not expected to memorize them, but you should recognize what each does:

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

- `col=c(...)` gives one colour per bar, in the alphabetical category order.
- `main=paste("... n = ", nrow(BCIT.students), ")")` builds the title from the data frame's row count, so the $n$ in the title is **never hard-coded**. Lab 2 asks for exactly this trick.
- `space` is the gap between bars, `horiz=TRUE` would lay the bars sideways, `density`/`angle` hatch the bars with lines.

:::tip One table, two charts, one mode
Whatever the chart, the statistical content is the frequency table. Read the mode from the tallest bar or the biggest slice; read a relative frequency by dividing a count by $n$. If a question gives you percentages instead of counts, a pie chart can be drawn straight from them (Lab 3 does that with `pie(percents, labels)`).
:::

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
