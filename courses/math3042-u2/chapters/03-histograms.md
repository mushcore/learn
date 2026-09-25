---
title: Histograms: the class recipe
minutes: 20
---

Histograms are **"most common and important"** (the instructor's margin note): a bar chart for numerical data that groups values into a manageable number of rectangles and gives every possible $X$ value a place on the axis. The recipe below is the one thing in Unit 2 you must be able to run by hand.

## Three steps

To make a histogram, we:

1. Divide the range of $X$ values into a series of **classes of equal width**.
2. Count the number of $X$ values that fall into each class. This count is the **frequency**.
3. Plot a **rectangle** showing the frequency (or relative frequency) for each class.

R picks classes for you if you let it:

```r
hist( BCIT.students$Age, col="lightblue")
```

That gives classes 18–20, 20–22, 22–24, ..., the biggest rectangle (about 110 students) over 20–22, and a long, nearly empty tail out to 42. The notes' seven-step recipe defines the classes yourself.

## The recipe, worked on Age ($n = 302$, min 18, max 42)

**1. Initial number of classes: $\sqrt{n}$.**

$$\sqrt{n} = \sqrt{302} = 17.4$$

**2. Initial class width: range divided by $\sqrt{n}$.**

$$\text{class width} = \frac{R}{\sqrt{n}} = \frac{42 - 18}{17.4} = 1.38$$

The instructor calls this **"the ideal class width."** It is a starting point: 1.38 is not a usable width for whole-number ages.

**3. Round the class width to match the precision of $X$:** $1.38 \to 2$, the **"actual class width."** Ages are whole years, so the width is a whole number. A width of 1 would give one rectangle per age, the bar plot again; "round (up or down)" to a nice number.

**4. First lower class limit = the minimum $X$ (you may round it down):** $18$.

**5. Determine all class limits.** Add the width for each next lower limit: 18, 20, 22, ... Each **upper limit is one unit of precision below the next lower limit**: 19, 21, 23, ..., so classes never overlap and leave no gaps.

**6. Count the $X$ values in each class.** The result is the **frequency distribution**:

| lower class limit | upper class limit | frequency |
|---|---|---|
| 18 | 19 | 35 |
| 20 | 21 | 94 |
| 22 | 23 | 104 |
| 24 | 25 | 53 |
| 26 | 27 | 10 |
| 28 | 29 | 2 |
| 30 | 31 | 1 |
| 32 | 33 | 0 |
| 34 | 35 | 1 |
| 36 | 37 | 0 |
| 38 | 39 | 1 |
| 40 | 41 | 0 |
| 42 | 43 | 1 |

The frequencies add to 302. Classes with frequency 0 (32–33, 36–37, 40–41) stay in the table and on the chart as empty rectangles, which is what the bar plot hid.

**7. Plot a rectangle for each class, showing the frequency:**

```r
hist(BCIT.students$Age,
     breaks=seq(18, 44, by=2), right = FALSE,
     xlab="Age", ylab="Frequency", xaxp=c(15,45, 15),
     main="Age of BCIT Students (n = 302)")
```

- `breaks=seq(18, 44, by=2)`: boundaries 18, 20, ..., 44, thirteen classes of width 2 from the first lower limit. The sequence must run past the maximum (42), hence 44.
- `right = FALSE`: each class **includes its left boundary and excludes its right boundary**. The instructor's arrow to the first rectangle: **"this rectangle represents students with $18 \le X < 20$, not including 20."** A 20-year-old is in the second class.
- `xaxp=c(15, 45, 15)` places tick marks from 15 to 45 every 2 years; `xlab`, `ylab`, `main` label the chart.

:::quiz right = FALSE
Class "18–19" is $[18, 20)$: 18 is in, 20 is out. The default `right = TRUE` would give $(18, 20]$, the opposite. The notes always use `right = FALSE`.
:::

## Features of a histogram

The notes' six properties:

- Variable $X$ goes along the horizontal axis.
- The $X$ axis is divided into **classes**.
- The **frequency** of a given class is shown as the **height** of the rectangle for that class.
- Classes have **equal width**.
- There are **no gaps** between classes.
- Each $X$ value falls into **exactly one** class.

## Second worked example: Old Faithful ($n = 272$)

`faithful$eruptions` runs from 1.6 to 5.1 minutes with three decimals. The instructor's margin work:

$$\sqrt{n} = \sqrt{272} = 16.5$$
$$\text{range of } X = \max - \min = 5.1 - 1.6 = 3.5$$
$$\text{ideal class width} = \frac{\text{range}}{\sqrt{n}} = \frac{3.5}{16.5} = 0.21212$$

The rounding rule in his words: **"The class width must have the same number of decimal places as the $X$ data (3 digits). We also should round down to a 'nice' number. → actual class width = 0.200."**

Lower limits start at the minimum, 1.600, and rise by 0.200. Each upper limit is 0.001 below the next lower limit, so the first class is 1.600 to 1.799, where 1.799 is **"the last possible $X$ value before the next lower limit."**

| Lower class limit | Upper class limit | Frequency |
|---|---|---|
| 1.600 | 1.799 | 12 |
| 1.800 | 1.999 | 39 |
| 2.000 | 2.199 | 20 |
| 2.200 | 2.399 | 18 |
| 2.400 | 2.599 | 3 |
| 2.600 | 2.799 | 3 |
| 2.800 | 2.999 | 2 |
| 3.000 | 3.199 | 1 |
| 3.200 | 3.399 | 4 |
| 3.400 | 3.599 | 6 |
| 3.600 | 3.799 | 10 |
| 3.800 | 3.999 | 16 |
| 4.000 | 4.199 | 31 |
| 4.200 | 4.399 | 29 |
| 4.400 | 4.599 | 35 |
| 4.600 | 4.799 | 28 |
| 4.800 | 4.999 | 11 |
| 5.000 | 5.199 | 4 |

Eighteen classes, frequencies summing to 272. The histogram *"is a direct visual representation of the frequency distribution"*:

```r
hist( faithful$eruptions,
      breaks=seq(1.6, 5.2, by=0.2), right=FALSE,
      xlab="Eruptions (sec)",
      main="Eruption duration of Old Faithful (n = 272)",
      col="pink")
```

The first pink rectangle is $1.600 \le X < 1.800$. Conclusion from the notes: **eruption durations cluster around two different values, 2.0 and 4.5**, the two humps of the stem-and-leaf plot. The shape is bimodal, and the mean (3.49) sits in the empty valley between the peaks.

:::warn Six frequencies that do not match an exact count
Counting the Old Faithful values by hand with exact class limits gives different numbers in six classes: 2.200–2.399 has 16 (not 18), 2.400–2.599 has 5 (not 3), 2.600–2.799 has 2 (not 3), 2.800–2.999 has 3 (not 2), 4.600–4.799 has 22 (not 28) and 4.800–4.999 has 17 (not 11). The notes' table is what R's `hist()` printed: `seq(1.6, 5.2, 0.2)` builds its boundaries by repeated floating-point addition, so some are stored as 2.4000000000000004, 2.8000000000000003 and 4.800000000000001, and a value exactly on such a boundary (2.400, 2.800, 4.800) falls into the class **below**. Use the notes' numbers; the method is not wrong, and "exactly on a boundary" is where a computer and a pencil can disagree.
:::

## Pitfalls: too many classes, too few classes

**Using too many classes is bad.** Old Faithful with a width of 0.020 instead of 0.200 (about 175 classes) **"shows a jagged shape and lots of empty classes."** Individual values show as spikes and the two humps disappear in the noise.

**Using too few classes is also bad.** A width of 2.000 (two classes: 1.6–3.6 and 3.6–5.6) **"doesn't show enough detail about the shape of the distribution."** The bimodal shape is gone.

**"Using $\sqrt{n}$ avoids these problems."**

```widget
hist-builder
```

```widget
hist-builder
{ "preset": "Old Faithful eruptions (n = 272)", "title": "Old Faithful: the 18 classes from the notes" }
```

```quiz
[
  {"q": "For the Age data ($n = 302$, min 18, max 42), what is the initial number of classes from the $\\sqrt{n}$ rule? (1 decimal)", "type": "numeric", "answer": 17.4, "tolerance": 0.05, "explain": "$\\sqrt{302} = 17.4$."},
  {"q": "Same data: what is the ideal (initial) class width $R/\\sqrt{n}$? (2 decimals)", "type": "numeric", "answer": 1.38, "tolerance": 0.01, "explain": "$R = 42 - 18 = 24$; $24 / 17.4 = 1.38$."},
  {"q": "Why does the instructor use 2 as the actual class width for Age instead of 1.38?", "options": ["The width must match the precision of X (whole years), rounded to a nice number", "R only accepts even numbers", "Because 1.38 rounds to 2 by the usual rule", "So that there are exactly 302 classes"], "answer": 0, "explain": "Step 3: round the class width to match the precision of X. Ages are integers, so the width is a whole number; 2 is the nice choice (width 1 would just be the bar plot)."},
  {"q": "With lower limits 18, 20, 22, ... and width 2, what is the upper class limit of the class that starts at 20?", "type": "numeric", "answer": 21, "tolerance": 0, "explain": "Each upper limit is one unit of precision (1 year) below the next lower limit: $22 - 1 = 21$."},
  {"q": "`hist(x, breaks=seq(18, 44, by=2), right=FALSE)`: a student who is exactly 20 years old is counted in which class?", "options": ["20 to 21 (the class [20, 22))", "18 to 19 (the class [18, 20))", "Both classes", "Neither; boundary values are dropped"], "answer": 0, "explain": "right=FALSE makes each class [lower, next lower): 18-19 is 18 ≤ X < 20, 'not including 20', so 20 starts the next class."},
  {"q": "Old Faithful: $n = 272$, min 1.6, max 5.1. What is the ideal class width? (5 decimals)", "type": "numeric", "answer": 0.21212, "tolerance": 0.0005, "explain": "$\\sqrt{272} = 16.5$; range $= 5.1 - 1.6 = 3.5$; $3.5 / 16.5 = 0.21212$."},
  {"q": "The instructor rounds 0.21212 to which actual class width, and why?", "options": ["0.200: same number of decimal places as the data (3) and rounded down to a nice number", "0.2: one decimal is enough", "0.212: round to three decimals", "0.25: a quarter is nicer"], "answer": 0, "explain": "'The class width must have the same number of decimal places as the X data (3 digits); we also should round down to a nice number → actual class width = 0.200.'"},
  {"q": "In the Old Faithful table the class starting at 1.600 has upper limit 1.799. What is 1.799?", "options": ["The last possible X value before the next lower limit, 1.800", "The midpoint of the class", "The mean of the class", "A rounding error"], "answer": 0, "explain": "Upper limit = next lower limit minus one unit of precision (0.001): 1.800 - 0.001 = 1.799, so classes touch without overlapping."},
  {"q": "Which of these is NOT one of the six features of a histogram from the notes?", "options": ["Classes may have different widths to fit the data", "There are no gaps between classes", "Each X value falls into exactly one class", "Frequency is shown as the height of the rectangle"], "answer": 0, "explain": "Classes have EQUAL width. The other three are on the list, along with X on the horizontal axis and the axis divided into classes."},
  {"q": "Drawing the Old Faithful histogram with a class width of 0.020 instead of 0.200 gives which problem?", "options": ["A jagged shape with lots of empty classes (too many classes)", "Not enough detail about the shape (too few classes)", "A perfect picture; more classes is always better", "The frequencies no longer add to 272"], "answer": 0, "explain": "Too many classes: individual values show as spikes and many classes are empty. Too few (width 2.000) hides the shape. √n avoids both."},
  {"q": "Which conclusion does the Old Faithful histogram support?", "options": ["Durations cluster around two values, about 2.0 and 4.5 minutes", "Durations are bell-shaped around 3.5 minutes", "Most eruptions last exactly 3.0 minutes", "Durations are uniform between 1.6 and 5.1"], "answer": 0, "explain": "Two humps (bimodal) with a near-empty valley around 2.6-3.4. The mean 3.49 falls in the valley."},
  {"type": "match", "q": "Match each step of the recipe to its Age-data value.", "pairs": [["initial number of classes √n", "17.4"], ["ideal class width R/√n", "1.38"], ["actual class width", "2"], ["first lower class limit", "18"], ["upper limit of the first class", "19"], ["frequency of the class 22 to 23", "104"]], "explain": "√302 = 17.4; (42-18)/17.4 = 1.38 → 2; start at the minimum 18; upper = 20 - 1 = 19; the tallest class 22-23 holds 104 students."}
]
```
