---
title: Mean (raw & grouped)
minutes: 18
---
<!-- facts: poe1.data.divine-chaos-allflame, gms.data.ranking-level-hero-2026-10-27 -->

What did a Divine Orb typically cost over the last ten days of Allflame, and what level is a typical top-500 Hero? A **measure of centre** answers that question for any variable $X$; the details that matter are which symbol is which, and what to do when the data arrives already grouped into a frequency table.

## Sample mean vs population mean

$$\bar{X} = \frac{\sum X}{n}$$

$\bar{X}$ (read "X-bar") is the **sample mean** — a **statistic**, computed from $n$ observations you actually collected.

$$\mu = \frac{\sum X}{N}$$

$\mu$ (mu) is the **population mean** — a **parameter**, computed from all $N$ members of the population. Same arithmetic, different scope: $\mu$ is the parameter, $\bar{X}$ the statistic.

## Worked example: ages

Ages in a sample: $22, 19, 20, 22, 35, 19, 21, 23$.

1. Sum: $22+19+20+22+35+19+21+23 = 181$
2. Count: $n = 8$
3. Mean: $\bar{X} = \dfrac{181}{8} = \mathbf{22.625}$

In R: `mean(c(22, 19, 20, 22, 35, 19, 21, 23))` → `22.625`.

:::info R syntax
| Code | What it does |
|---|---|
| `c(22, 19, 20, 22, 35, 19, 21, 23)` | `c()` combines the eight ages, separated by commas, into one vector. |
| `mean(…)` | Adds the values in the vector and divides by how many there are. |

**Left to right**

- `mean(c(22, 19, 20, 22, 35, 19, 21, 23))`: "The average (`mean`) of the combined values (`c`) 22, 19, 20, 22, 35, 19, 21 and 23 (`22, 19, 20, 22, 35, 19, 21, 23`)."

**Right to left**, the order R runs it

- `mean(c(22, 19, 20, 22, 35, 19, 21, 23))`: "Take the eight ages (`22, 19, 20, 22, 35, 19, 21, 23`), combine them into one vector (`c`), and average it (`mean`)."
:::

:::tip Calculator
Enter these eight ages in your calculator's **STAT mode** as a 1-variable data list; it should read $\bar{x}$ = `22.625`.
:::

```widget
stat-calc
{ "data": "22 19 20 22 35 19 21 23", "title": "Ages example" }
```

## Ten days of Divine Orb prices in Allflame

A Divine Orb is PoE1's high-value currency; poe.ninja records its price once a day in chaos orbs, the everyday currency. The last ten days of its Allflame series, 18 to 27 October 2026, read 319.0, 316.5, 316.5, 305.0, 300.0, 300.0, 265.0, 265.0, 300.0 and 270.0 chaos [PoE1, 3.29 Allflame, poe.ninja daily Divine price, checked 2026-10-27]. Each day contributes one value, so the mean of the window is $\sum X / n$ with $n = 10$.

```quiz
[
  {"q": "Compute $\\bar{X}$ for the ten Divine prices before reading the working. (1 decimal)", "type": "numeric", "answer": 295.7, "tolerance": 0.05, "unit": "chaos", "explain": "$\\sum X = 319.0 + 316.5 + 316.5 + 305.0 + 300.0 + 300.0 + 265.0 + 265.0 + 300.0 + 270.0 = 2957.0$, $n = 10$, so $\\bar{X} = 2957.0/10 = 295.7$ chaos."}
]
```

1. Sum: $319.0 + 316.5 + 316.5 + 305.0 + 300.0 + 300.0 + 265.0 + 265.0 + 300.0 + 270.0 = 2957.0$
2. Count: $n = 10$
3. Mean: $\bar{X} = \dfrac{2957.0}{10} = \mathbf{295.7}$ chaos

The window is ten days cut from a 96-day series, so 295.7 is a sample mean $\bar{X}$.

### The ten prices in the calculator

```widget
stat-calc
{ "data": "319.0 316.5 316.5 305.0 300.0 300.0 265.0 265.0 300.0 270.0", "title": "Allflame Divine price in chaos, 18 to 27 October 2026" }
```

## Grouped data

Sometimes you don't get the raw values — you get a **frequency table**: how many observations ($f_i$) fell into each group ($i$), where each group is represented by its **class mark** $X_i$ (the midpoint of that group's interval).

Tiny case: 3, 3, 3, 5 as a table is $X_i = 3$ with $f = 3$, and $X_i = 5$ with $f = 1$. The raw sum $3 + 3 + 3 + 5$ is $3(3) + 5(1) = 14$, and there are $3 + 1 = 4$ values, so $\bar{X} = 14/4 = 3.5$. So $f_i X_i$ means "this value, added $f_i$ times". The grouped mean formula:

$$\bar{X} = \frac{\sum f_i X_i}{\sum f_i}$$

Every observation in a group is treated as if it were exactly at that group's midpoint.

### Worked example: Old Faithful eruption durations

| Interval | 1.5–2.0 | 2.0–2.5 | 2.5–3.0 | 3.0–3.5 | 3.5–4.0 | 4.0–4.5 | 4.5–5.0 | 5.0–5.5 |
|---|---|---|---|---|---|---|---|---|
| $X_i$ | 1.75 | 2.25 | 2.75 | 3.25 | 3.75 | 4.25 | 4.75 | 5.25 |
| $f_i$ | 51 | 41 | 5 | 7 | 30 | 73 | 61 | 4 |
| $f_i X_i$ | 89.25 | 92.25 | 13.75 | 22.75 | 112.5 | 310.25 | 289.75 | 21 |

1. $\sum f_i = 51+41+5+7+30+73+61+4 = 272$
2. $\sum f_i X_i$ = sum of the bottom row $= 951.5$
3. $\bar{X} = \dfrac{951.5}{272} = \mathbf{3.498}$

```widget
grouped-mean
{ "rows": [[1.75, 51], [2.25, 41], [2.75, 5], [3.25, 7], [3.75, 30], [4.25, 73], [4.75, 61], [5.25, 4]], "title": "Old Faithful eruption durations, grouped" }
```

### Why 3.498 instead of 3.488?

The **raw** (ungrouped) mean of the actual `faithful$eruptions` data is `3.488`; the grouped calculation gives `3.498`. Grouping throws away information: every observation inside a class is replaced by that class's midpoint before you average, so an eruption of 1.90 minutes and one of 1.60 minutes both count as `1.75` if they share a bin. The grouped mean is an **approximation** of the true mean, not a recomputation of it.

## The top 500 Heroes: a grouped mean that is exact

Nexon's North America job ranking lists the top 500 characters of the Hero job, at levels 293 to 300 [GMS, v.271 Hero job ranking, checked 2026-10-27]. Counted by level, that list is a frequency table:

| Level $X_i$ | 300 | 299 | 298 | 297 | 296 | 295 | 294 | 293 |
|---|---|---|---|---|---|---|---|---|
| Heroes $f_i$ | 6 | 11 | 13 | 24 | 59 | 200 | 102 | 85 |

A level is a whole number, so every Hero in a column is exactly at its $X_i$: here $\sum f_i X_i / \sum f_i$ is the raw mean, not an approximation like Old Faithful's 3.498.

```quiz
[
  {"q": "Compute $\\sum f_i X_i$ for the Hero table.", "type": "numeric", "answer": 147448, "tolerance": 0, "explain": "$300(6) + 299(11) + 298(13) + 297(24) + 296(59) + 295(200) + 294(102) + 293(85) = 1800 + 3289 + 3874 + 7128 + 17464 + 59000 + 29988 + 24905 = 147448$."},
  {"q": "Compute the mean level of the 500 Heroes. (3 decimals)", "type": "numeric", "answer": 294.896, "tolerance": 0.001, "explain": "$\\sum f_i = 6 + 11 + 13 + 24 + 59 + 200 + 102 + 85 = 500$, so $\\bar{X} = 147448/500 = 294.896$. Averaging all 500 levels one by one gives the same 294.896."}
]
```

1. $\sum f_i = 6 + 11 + 13 + 24 + 59 + 200 + 102 + 85 = 500$
2. $\sum f_i X_i = 1800 + 3289 + 3874 + 7128 + 17464 + 59000 + 29988 + 24905 = 147448$
3. $\bar{X} = \dfrac{147448}{500} = \mathbf{294.896}$

Level 295 is the most common level (200 of the 500 Heroes). The mean, 294.896, lands just below it because 187 Heroes sit one or two levels below 295 and only 113 sit above it.

### The Hero table in the grouped-mean widget

```widget
grouped-mean
{ "rows": [[300, 6], [299, 11], [298, 13], [297, 24], [296, 59], [295, 200], [294, 102], [293, 85]], "title": "Top 500 Heroes by level, GMS North America, 2026-10-27" }
```

## Another grouped example: steel rods

Lab 1's pencil problem 2: rod diameters given as a frequency table (diameter : count) — $10.00\text{mm}\!:\!40$, $10.01\!:\!75$, $10.02\!:\!100$, $10.03\!:\!90$, $10.04\!:\!45$. Here the diameters themselves are the class marks.

1. $\sum f_i = 40 + 75 + 100 + 90 + 45 = 350$
2. $\sum f_i X_i = 10.00(40) + 10.01(75) + 10.02(100) + 10.03(90) + 10.04(45) = 400 + 750.75 + 1002 + 902.7 + 451.8 = 3507.25$
3. $\bar{X} = 3507.25/350 = \mathbf{10.02071}$ mm

Check: it lies between 10.00 and 10.04, nearest the 100-rod class 10.02.

## The ten days before, and the top 100 Heroes

The ten Allflame Divine prices before the window above, 8 to 17 October 2026, are 368.5, 350.0, 326.0, 350.0, 357.0, 355.0, 360.0, 320.0, 315.6 and 324.0 chaos [PoE1, 3.29 Allflame, poe.ninja daily Divine price, checked 2026-10-27]. The top 100 of the Hero ranking, counted by level, are 300: 6, 299: 11, 298: 13, 297: 24 and 296: 46, and the full ranking holds 227,326 Heroes [GMS, v.271 Hero job ranking, checked 2026-10-27].

```quiz
[
  {"q": "Divine prices, 8 to 17 October: what is $\\sum X$? (1 decimal)", "type": "numeric", "answer": 3426.1, "tolerance": 0.05, "unit": "chaos", "explain": "$368.5 + 350.0 + 326.0 + 350.0 + 357.0 + 355.0 + 360.0 + 320.0 + 315.6 + 324.0 = 3426.1$."},
  {"q": "Compute $\\bar{X}$ for those ten prices. (2 decimals)", "type": "numeric", "answer": 342.61, "tolerance": 0.05, "unit": "chaos", "explain": "$\\bar{X} = \\sum X / n = 3426.1/10 = 342.61$ chaos, about 47 chaos above the 295.7 of the following ten days."},
  {"q": "Top 100 Heroes: compute $\\sum f_i X_i$.", "type": "numeric", "answer": 29707, "tolerance": 0, "explain": "$300(6) + 299(11) + 298(13) + 297(24) + 296(46) = 1800 + 3289 + 3874 + 7128 + 13616 = 29707$."},
  {"q": "Compute the mean level of the top 100 Heroes. (2 decimals)", "type": "numeric", "answer": 297.07, "tolerance": 0.005, "explain": "$\\sum f_i = 6 + 11 + 13 + 24 + 46 = 100$, so $\\bar{X} = 29707/100 = 297.07$. Levels are exact values, so this grouped mean is also the raw mean."},
  {"q": "Treat the 500 listed Heroes as drawn from all 227,326 ranked Heroes. Which symbol names 294.896?", "type": "text", "answer": ["X̄", "x̄", "x bar", "X bar", "x-bar", "xbar", "\\bar{X}"], "explain": "500 of 227,326 is a sample, so its mean is the statistic $\\bar{X}$; $\\mu$ would be the mean level of all 227,326. (The top 500 is not a random sample, so it overstates $\\mu$, but the symbol rule is about scope.)"},
  {"type": "fill", "q": "Fill the blank so R prints the mean of the 8 to 17 October prices.", "code": "price <- c(368.5, 350.0, 326.0, 350.0, 357.0, 355.0, 360.0, 320.0, 315.6, 324.0)\n___(price)\n## [1] 342.61", "answer": ["mean"], "explain": "`mean(price)` is $\\sum X / n = 3426.1/10 = 342.61$."}
]
```

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
    "explain": "1. $\\sum f_i = 40 + 75 + 100 + 90 + 45 = 350$. 2. $\\sum f_i X_i = 10.00(40) + 10.01(75) + 10.02(100) + 10.03(90) + 10.04(45) = 400 + 750.75 + 1002 + 902.7 + 451.8 = 3507.25$. 3. $\\bar{X} = 3507.25/350 = 10.02071$ mm. Check: it lies between 10.00 and 10.04, nearest the 100-rod class 10.02."
  }
]
```
