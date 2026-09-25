---
title: Stem-and-leaf plots
minutes: 16
---

Categorical data gets pies and bars. For a **numerical** variable there are more choices. The notes list six, and the instructor annotated three of them in the margin:

| Chart | Instructor's note |
|---|---|
| stem-and-leaf plots | "simple" |
| bar plots (for integer data) | "can be a bad choice" |
| histograms | "most common and important" |
| box plots | (Unit 1) |
| ogives | (two lessons from now) |
| scatter plots | (last lesson of the unit) |

This lesson does the first two: the stem-and-leaf plot, and why a bar plot of integer data is usually the wrong tool.

## What a stem-and-leaf plot is

The notes call it *"a simple (although old-fashioned) way to visualize data for a numerical variable $X$"* and then say the important thing: **"Essentially, a stem-and-leaf plot is a frequency distribution of $X$."** It shows how many values land in each range, like a histogram turned on its side, but it keeps every individual data value visible.

### Cutting a value into stem and leaf

Every data value is cut into two parts:

- The **leaf** is usually the last digit.
- The **stem** is everything before the last digit.

The instructor's example: $163 \to$ stem **16**, leaf **3**. Then:

1. Write every stem, in order, down the left side of a vertical line.
2. Write each value's leaf on the right side of its stem's line.
3. **Sort the leaves** on each line from smallest to largest.

## The lecture example: 20 heights

$X$ = Height (in cm) for the first 20 students in `BCIT.students`, the raw data exactly as the notes list it:

```text
163 187 169 168 170 154 167 175 153 170
159 187 163 178 158 170 169 183 170 146
```

The stems present are 14, 15, 16, 17, 18. Assigning leaves and sorting each line gives the instructor's handwritten plot:

```text
14 | 6
15 | 3 4 8 9
16 | 3 3 7 8 9 9
17 | 0 0 0 0 5 8
18 | 3 7 7
```

Check one line yourself: the values in the 150s are 154, 153, 159, 158, so stem 15 gets leaves 4, 3, 9, 8, which sort to 3 4 8 9. Count the leaves: $1 + 4 + 6 + 6 + 3 = 20$, one per student. Nothing is lost: reading a leaf back gives the original value (17 | 5 is 175).

His interpretation, written under the plot: **"The centre is around 170 cm (the mode is 170 cm)."** The longest line (stems 16 and 17 tie with six leaves each) shows where the data piles up, and 170 appears four times, more than any other value.

## Try it

Paste any data. The 20 heights are the first preset; the others show what R does with all 302 heights, with Old Faithful, and with Age.

```widget
stem-leaf
```

## Letting R do it: `stem()`

For all $n = 302$ heights *"it is better to let R do the work"*:

```r
stem(BCIT.students$Height.CM)
```
```text
The decimal point is 1 digit(s) to the right of the |

  14 | 123444
  14 | 6677888
  15 | 1111223333333444
  15 | 5555555666778888888888899999999
  16 | 00000001111112222222333333333333333344444444
  16 | 55555555555666666666667777777777888888888888888899999999
  17 | 000000000000111112222222222233333444
  17 | 5555556666666666677777778888888888888999999
  18 | 0000000001111112223333334444444
  18 | 5666777777777899
  19 | 00002334
  19 | 779
```

Two notes from the lecture:

- **R has decided to split each stem into two stems** (one line for leaves 0–4, one for leaves 5–9). With 302 values, one line per stem would be far too crowded, so R doubles the number of lines.
- **"We can easily see that the typical student height is around 165 to 170 cm"**: the longest lines are the 16 | 5–9 line and the 16 | 0–4 line.

### Reading the key line

The first line R prints, *"The decimal point is 1 digit(s) to the right of the |"*, is the key that turns stems and leaves back into numbers. The instructor circled the first row and wrote: **"therefore 14 | 1 represents 141 cm."** Put the stem and leaf together as 141 and the decimal point sits one digit to the right of the bar, so the value is 141, not 14.1.

If you want one line per stem instead of R's split, the demo notebook uses the `scale` argument to compress the number of stems by half:

```r
stem( BCIT.students$Height.CM, scale=0.5)
```

## Too many digits: round first

Some data has more precision than a stem-and-leaf plot can use. *"If a numerical variable has more than three digits of precision, it might be necessary to reduce the number of digits by rounding before making the stem-and-leaf plot."*

Example: the `eruptions` variable of the built-in `faithful` data frame (Old Faithful eruption durations, 272 of them) has four digits, such as $X = 2.283$. Using all four digits would produce far too many stems. So: **round each $X$ first, then cut it**. The instructor's diagram:

```text
2.283  →  round  →  2.28  →  stem 22, leaf 8
```

R's output for the whole data set:

```r
stem(faithful$eruptions)
```
```text
The decimal point is 1 digit(s) to the left of the |

  16 | 070355555588
  18 | 000022223333335777777777888822335777888
  20 | 00002223378800035778
  22 | 0002335578023578
  24 | 00228
  26 | 23
  28 | 080
  30 | 7
  32 | 2337
  34 | 250077
  36 | 0000823577
  38 | 2333335582225577
  40 | 00000033577888880022335555777778
  42 | 03355555778800233333555777778
  44 | 02222335557780000000023333357778888
  46 | 0000233357700000023578
  48 | 00000022335800333
  50 | 0370
```

Read the key: the decimal point is one digit to the **left** of the bar, so 16 | 0 is 1.60, and 22 | 8 is 2.28 (the rounded 2.283). Here R went the other way from the heights: each line holds **two** stems (16 covers 1.60–1.79), because 272 values spread over 1.6–5.1 would otherwise give too many lines. That is why the leaves on the 16 line run 0, 7, 0, 3, 5, ... and are not simply sorted 0–9: the first three are 1.60, 1.67, 1.70.

The instructor's conclusion under this plot: **"Most eruptions are around 1.8 or 4.4"**: two clusters with a gap between about 2.6 and 3.4. Keep this picture; the histogram lesson shows the same two humps.

:::tip The unit is minutes
`faithful$eruptions` is measured in minutes (an eruption lasts 1.6 to 5.1 min). One of the R calls in the notes labels the axis "Eruptions (sec)"; the numbers are the same either way, but if a question asks about "eruptions shorter than 4.0 minutes", it means $X < 4.0$.
:::

## Bar plots for integer data: usually a bad choice

If $X$ is an **integer** numerical variable like Age, the notes say we "occasionally" visualize it with a bar plot, exactly as for categories. **"Don't forget the `table` step!"**: `barplot()` wants counts, not raw values.

```r
barplot( table(BCIT.students$Age), xlab="Age", ylab="Frequency" )
```

The instructor crossed the resulting chart out and wrote **"Not recommended"**, for two reasons:

- **potentially too many rectangles**: one bar per distinct age.
- **can be missing X values along the horizontal axis**: nobody is 27, 31, 32, 33, 34, 36, 37, 38, 40 or 41, so those ages simply do not appear. The axis reads 18, 19, ..., 26, 28, 29, 30, 35, 39, 42 with equal spacing, which hides the real gaps. The notes call this **"one serious problem."**

That problem is exactly what a histogram fixes: it divides the whole range into classes of equal width, so every value has a place on the axis. Next lesson.

:::quiz Stem-and-leaf facts that make good true/false questions
- A stem-and-leaf plot **is** a frequency distribution (true), and unlike a histogram it keeps every individual value (true).
- The leaf is usually the **last** digit; the stem is everything before it.
- Leaves must be sorted on each line.
- R may split a stem into two lines (leaves 0–4 and 5–9) or merge two stems onto one line; the key line tells you where the decimal point goes.
- Data with more than three digits of precision should be rounded before plotting.
:::

```quiz
[
  {"q": "In a stem-and-leaf plot of heights in cm, the value 163 is split as...", "options": ["stem 16, leaf 3", "stem 1, leaf 63", "stem 163, leaf 0", "stem 3, leaf 16"], "answer": 0, "explain": "The leaf is the last digit (3); the stem is everything before it (16)."},
  {"q": "The instructor describes a stem-and-leaf plot as essentially a...", "options": ["frequency distribution of X", "measure of centre", "scatter plot", "percentile table"], "answer": 0, "explain": "Each line's length is the frequency of that stem's range, so the plot is a frequency distribution that still shows every value."},
  {"q": "For the 20 heights, which values produce the line `15 | 3 4 8 9`?", "type": "text", "answer": ["153 154 158 159", "153, 154, 158, 159", "154 153 159 158", "153,154,158,159"], "explain": "Stem 15 with leaves 3, 4, 8, 9 are 153, 154, 158, 159 (the raw data has 154, 153, 159, 158; leaves are sorted)."},
  {"q": "From the 20-height plot, what did the instructor identify as the mode?", "type": "numeric", "answer": 170, "tolerance": 0, "unit": "cm", "explain": "The 17 line reads 0 0 0 0 5 8: 170 occurs four times, more than any other value. 'The centre is around 170 cm (the mode is 170 cm).'"},
  {"q": "R prints `The decimal point is 1 digit(s) to the right of the |` above the heights plot. What value does `14 | 1` represent?", "type": "numeric", "answer": 141, "tolerance": 0, "unit": "cm", "explain": "Join stem and leaf (141) and place the decimal point one digit to the right of the bar: 141."},
  {"q": "In `stem(faithful$eruptions)` the key says the decimal point is 1 digit to the LEFT of the bar. What is `22 | 8`?", "type": "numeric", "answer": 2.28, "tolerance": 0.001, "explain": "Join to get 228, move the decimal one digit left of the bar: 2.28, which is 2.283 rounded to two decimals."},
  {"q": "Why does the instructor round 2.283 to 2.28 before making the Old Faithful stem-and-leaf plot?", "options": ["Four digits of precision would produce too many stems", "R cannot handle decimals", "Because 2.283 is an outlier", "To make the mean easier to compute"], "answer": 0, "explain": "'If we used all four digits, then we would have too many stems. Instead, round each X first and then cut it into a stem and a leaf.'"},
  {"q": "R never splits a stem across two lines; every stem always gets exactly one line.", "type": "tf", "answer": false, "explain": "For the 302 heights R split each stem into two lines (leaves 0-4 and 5-9); for Old Faithful it merged two stems per line. The key line tells you how to read it."},
  {"q": "What conclusion did the instructor write under the Old Faithful stem-and-leaf plot?", "options": ["Most eruptions are around 1.8 or 4.4 (two clusters)", "Eruptions are evenly spread from 1.6 to 5.1", "The typical eruption is about 3.0", "There are no eruptions above 4.0"], "answer": 0, "explain": "The long lines are near 18-20 and 40-46, with almost nothing around 26-32: a two-humped (bimodal) shape."},
  {"q": "`barplot(BCIT.students$Age)` is the correct way to bar-plot the ages.", "type": "tf", "answer": false, "explain": "Don't forget the table step: `barplot(table(BCIT.students$Age), ...)`. barplot() needs counts per value, not the raw ages."},
  {"q": "Which two problems make a bar plot of integer data 'not recommended'? (select all)", "options": ["Potentially too many rectangles", "It can be missing X values along the horizontal axis", "It cannot show frequencies", "It only works for categorical data"], "answer": [0, 1], "explain": "One bar per distinct value can be a lot of bars, and ages nobody has (27, 31, ...) vanish from the axis, hiding the gaps. Histograms fix both."},
  {"q": "What does `scale=0.5` do in `stem(BCIT.students$Height.CM, scale=0.5)`?", "options": ["Compresses the number of stems by half, giving one line per stem", "Halves every data value", "Plots only half the data", "Rounds the data to one decimal"], "answer": 0, "explain": "The demo notebook uses scale=0.5 to undo R's split, so each stem's leaves 0-9 sit on one line."}
]
```
