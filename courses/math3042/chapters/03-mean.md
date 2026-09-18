---
title: Mean (raw & grouped)
minutes: 15
---

A **measure of centre** answers one question: what is a "typical" value of $X$? The mean is the one everyone already knows how to compute — but the quiz cares about the details: which symbol is which, and what happens when your data arrives already grouped into a frequency table.

## Sample mean vs population mean

$$\bar{X} = \frac{\sum X}{n}$$

$\bar{X}$ (read "X-bar") is the **sample mean** — a **statistic**, computed from $n$ observations you actually collected.

$$\mu = \frac{\sum X}{N}$$

$\mu$ (mu) is the **population mean** — a **parameter**, computed from all $N$ members of the population. Same arithmetic, different symbol, different scope. The quiz likes to ask "which of these is a parameter?" — the answer is always $\mu$, never $\bar{X}$.

:::quiz Quiz note
$\bar{X}$ and $\mu$ use the exact same formula shape (sum divided by count). The only difference is whether you divided by a **sample** size $n$ or a **population** size $N$. Don't let the different letters convince you the math is different — it isn't.
:::

## Worked example: ages

The instructor's own example. Ages in a sample: $22, 19, 20, 22, 35, 19, 21, 23$.

1. Sum: $22+19+20+22+35+19+21+23 = 181$
2. Count: $n = 8$
3. Mean: $\bar{X} = \dfrac{181}{8} = \mathbf{22.625}$

In R: `mean(c(22, 19, 20, 22, 35, 19, 21, 23))` → `22.625`.

:::tip Calculator
Find your calculator's **STAT mode** before the quiz, not during it. Enter these eight ages as a 1-variable data list and read off $\bar{x}$. You should get `22.625`. If you can't find STAT mode under exam pressure you will lose easy marks — practice it now.
:::

```widget
stat-calc
{ "data": "22 19 20 22 35 19 21 23", "title": "Ages example" }
```

## Grouped data

Sometimes you don't get the raw values — you get a **frequency table**: how many observations ($f_i$) fell into each group ($i$), where each group is represented by its **class mark** $X_i$ (the midpoint of that group's interval). The grouped mean formula:

$$\bar{X} = \frac{\sum f_i X_i}{\sum f_i}$$

Here $i$ indexes the groups (row 1, row 2, ...), $f_i$ is the frequency (count) in group $i$, and $X_i$ is the midpoint of group $i$'s interval. You're treating every observation in a group as if it were exactly at that group's midpoint.

### Worked example: Old Faithful eruption durations

| $X_i$ | 1.75 | 2.25 | 2.75 | 3.25 | 3.75 | 4.25 | 4.75 | 5.25 |
|---|---|---|---|---|---|---|---|---|
| $f_i$ | 51 | 41 | 5 | 7 | 30 | 73 | 61 | 4 |

1. $\sum f_i = 51+41+5+7+30+73+61+4 = 272$
2. $\sum f_i X_i = 51(1.75)+41(2.25)+5(2.75)+7(3.25)+30(3.75)+73(4.25)+61(4.75)+4(5.25) = 951.5$
3. $\bar{X} = \dfrac{951.5}{272} = \mathbf{3.498}$

```widget
grouped-mean
{ "rows": [[1.75, 51], [2.25, 41], [2.75, 5], [3.25, 7], [3.75, 30], [4.25, 73], [4.75, 61], [5.25, 4]], "title": "Old Faithful eruption durations, grouped" }
```

### Why 3.498 instead of 3.488?

The **raw** (ungrouped) mean of the actual `faithful$eruptions` data is `3.488`. The grouped calculation gives `3.498` — close, but not identical.

The reason: grouping throws away information. Every single observation inside a class gets replaced by that class's midpoint before you average. An eruption that actually lasted 1.90 minutes and one that lasted 1.60 minutes both get counted as `1.75` if they fall in the same bin. You've traded exact values for a summary table, so some precision is unavoidably lost. The grouped mean is an **approximation** of the true mean, not a recomputation of it.

:::quiz Quiz note
"The grouped mean formula always gives the exact same answer as computing the mean from raw data." **False.** It gives an *approximation* — usually close, but only exact in the unlikely case that every value inside each class happens to equal that class's midpoint.
:::

## Another grouped example: steel rods

Lab 1's pencil problem 2: rod diameters given as a frequency table (diameter : count) — $10.00\text{mm}\!:\!40$, $10.01\!:\!75$, $10.02\!:\!100$, $10.03\!:\!90$, $10.04\!:\!45$ (here the diameters themselves are already the class marks, $\sum f_i = 350$). Working the formula through gives

$$\bar{X} = 10.02071 \text{ mm}$$

Same formula, same process — sum $f_i X_i$, divide by sum $f_i$.

```quiz
[
  {
    "q": "Sample: 4, 8, 6, 10, 7. What is $\\bar{X}$?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0.05,
    "explain": "$\\sum X = 4+8+6+10+7=35$, $n=5$, $\\bar{X}=35/5=7$."
  },
  {
    "q": "For the ages 22, 19, 20, 22, 35, 19, 21, 23, what is $\\bar{X}$?",
    "type": "numeric",
    "answer": 22.625,
    "tolerance": 0.01,
    "explain": "$\\sum X = 181$, $n = 8$, $181/8 = 22.625$."
  },
  {
    "q": "Which symbol represents a population parameter, not a sample statistic?",
    "options": ["$\\bar{X}$", "$\\mu$", "$s$", "$n$"],
    "answer": 1,
    "explain": "$\\mu$ is the population mean, computed over all $N$ members of the population. $\\bar{X}$, $s$, and $n$ are all sample quantities."
  },
  {
    "q": "In the grouped mean formula $\\bar{X} = \\frac{\\sum f_i X_i}{\\sum f_i}$, what does $X_i$ represent?",
    "options": ["The number of groups", "The frequency of group $i$", "The midpoint (class mark) of group $i$", "The total sample size"],
    "answer": 2,
    "explain": "$X_i$ is the class mark — the midpoint of group $i$'s interval. $f_i$ is the frequency."
  },
  {
    "q": "Old Faithful grouped data: $X_i$ = 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5.25 with $f_i$ = 51, 41, 5, 7, 30, 73, 61, 4. What is the grouped mean?",
    "type": "numeric",
    "answer": 3.498,
    "tolerance": 0.01,
    "explain": "$\\sum f_i = 272$, $\\sum f_i X_i = 951.5$, $\\bar{X} = 951.5/272 = 3.498$."
  },
  {
    "q": "The grouped mean (3.498) exactly equals the raw-data mean (3.488) for the Old Faithful eruptions.",
    "type": "tf",
    "answer": false,
    "explain": "They are close but not equal. Grouping replaces every value in a class with that class's midpoint, which loses precision."
  },
  {
    "q": "Why can a grouped mean differ from the mean computed directly on raw data?",
    "options": ["Grouped means always round up", "Every observation in a class is replaced by that class's midpoint before averaging, losing information", "The grouped formula divides by $N$ instead of $n$", "Frequency tables can only hold whole numbers"],
    "answer": 1,
    "explain": "Replacing individual values with a shared class mark is an approximation — it's not the same arithmetic as summing the exact raw values."
  },
  {
    "q": "R code `mean(c(22, 19, 20, 22, 35, 19, 21, 23))` returns which value?",
    "type": "numeric",
    "answer": 22.625,
    "tolerance": 0.01,
    "explain": "Same ages example: $181/8 = 22.625$."
  },
  {
    "q": "Steel rod diameters (Lab 1, pencil problem 2), grouped as 10.00mm:40, 10.01:75, 10.02:100, 10.03:90, 10.04:45. What is $\\bar{X}$ (5 decimals)?",
    "type": "numeric",
    "answer": 10.02071,
    "tolerance": 0.0005,
    "unit": "mm",
    "explain": "$\\sum f_i X_i / \\sum f_i = 10.02071$ mm, worked the same way as the Old Faithful example."
  }
]
```
