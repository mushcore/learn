---
title: IQR, boxplots & outliers
minutes: 22
---
<!-- facts: classic.monster.training-hp, poe1.data.divine-chaos-allflame -->

A boss among field monsters has far more HP than anything around it, and the fences built from the quartiles decide whether it is an outlier. Quartiles are position markers. The **interquartile range** turns them into a measure of variation, and the **boxplot** turns the whole five-number summary into a picture.

## IQR: the range of the middle 50%

$IQR = Q_3 - Q_1$

It is the range of just the middle 50% of the data — the "typical" spread, with the extreme quarters on each end trimmed away.

:::quiz Advantage and disadvantage are the same fact
Compared to the range $R$, the IQR's **advantage** and its **disadvantage** are the same fact: it ignores extreme values, so a single outlier cannot blow it up, and it throws away real information about the tails.
:::

## From five-number summary to boxplot

The five-number summary (min, $Q_1$, $Q_2$, $Q_3$, max) draws directly onto a **boxplot**:

- the **box** spans $Q_1$ to $Q_3$ — the middle 50% of the data
- a **thick line** inside the box marks the median $Q_2$
- **whiskers** extend out to the min and max, *as long as there are no outliers*

## Side-by-side boxplots

Boxplots are most useful for comparing groups. `boxplot(extra ~ group, data = sleep)` draws one box per level of `group`, plotting the numeric variable `extra` against it. The `extra ~ group` syntax is a **model formula**: "extra as explained by group."

:::info R syntax
| Code | What it does |
|---|---|
| `extra ~ group` | `~` builds a formula: the left side (`extra`) is plotted, split by the right side (`group`). |
| `data = sleep` | Named argument: look up the formula's column names in R's built-in `sleep` data frame. |
| `boxplot(…)` | Draws one box plot per group, side by side. |

**Left to right**

- `boxplot(extra ~ group, data = sleep)`: "Draw box plots (`boxplot`) of extra (`extra`) grouped by (`~`) group (`group`), using the columns of the sleep data (`data = sleep`)."

**Right to left**, the order R runs it

- `boxplot(extra ~ group, data = sleep)`: "Take the sleep data (`data = sleep`), build the formula extra grouped by group (`extra ~ group`), split the extra values by group, and draw one box plot per group (`boxplot`)."
:::

The instructor's conclusion from that plot: *"Generally, the drug for group 2 was more effective than the drug for group 1 (not for all individuals)."* The hedge matters: the group 2 box sits higher overall, but the boxes still overlap, so it isn't true for every individual.

## Outliers and fences

:::tip On paper, use the hand method
R's `quantile()` and the boxplot widget interpolate (lesson 10), so their fences differ slightly from the hand method's; the verdict usually agrees. When a question gives $Q_1$ and $Q_3$, use the ones given.
:::

A value is flagged as an **outlier** if it falls outside a pair of *fences* built from $Q_1$, $Q_3$, and the IQR:

$\text{lower fence} = Q_1 - 1.5 \times IQR$

$\text{upper fence} = Q_3 + 1.5 \times IQR$

Anything beyond a fence is drawn as its own circle on the boxplot, and the whisker on that side stops at the **last value still inside the fence** — not at the true min/max.

### Worked example: `precip` (annual precipitation, 70 US cities)

$Q_1 = 29.375$, $Q_3 = 42.775$, so:

1. $IQR = 42.775 - 29.375 = 13.4$
2. Step $= 1.5 \times 13.4 = 20.1$
3. Lower fence $= 29.375 - 20.1 = 9.275$; upper fence $= 42.775 + 20.1 = 62.875$
4. Check both ends: the four driest cities, Phoenix (7.0), Reno (7.2), Albuquerque (7.8) and El Paso (7.8), are below 9.275; Mobile, 67.0, is above 62.875. All five are outliers.

```widget
boxplot
{ "dataset": "precip", "note": "precip: average annual precipitation (inches), 70 US cities" }
```

:::warn Outlier ≠ Unusual
A value can be one without being the other.

| | Unusual | Outlier |
|---|---|---|
| built from | $\bar{X}$ and $s$ (or $\mu$, $\sigma$) | $Q_1$, $Q_3$, IQR |
| cutoffs | $\bar{X} \pm 2s$ | $Q_1 - 1.5\,IQR$, $Q_3 + 1.5\,IQR$ |
| do extreme values move the cutoffs? | yes, they inflate $s$ | barely |
| taught in | lesson 8 | lesson 11 |
:::

## Site B drainage data

Lab 1 pencil problem 7 gave two drainage-rate samples. Site B's values include one large reading, 13.6, that the instructor flagged as possibly extreme using the empirical rule ($3\sigma$ test); the fence method below gives a second opinion on the same data.

```widget
boxplot
{ "data": "1.02 3.56 3.5 3.45 4.5 13.6 4.5 2.3 3.5 2.6 3.31 3.1", "note": "Site B drainage rate (litre / m^2 s), n = 12" }
```

## Twelve Classic training monsters: which HP values pass the fences?

meowdb's monster table gives the HP of twelve common Victoria Island training monsters in MapleStory Classic [Classic, Classic World Grand Launch build, meowdb monster table, checked 2026-10-27]: Snail 45, Slime 115, Orange Mushroom 142, Ribbon Pig 172, Green Mushroom 233, Horny Mushroom 403, Wild Boar 510, Fire Boar 842, Jr. Wraith 982, Lupin 1336, Drake 3218, and Mano, a boss, 7420. A boss placed among field monsters is the kind of value fences exist to flag, and the fences come from $Q_1$ and $Q_3$, which one huge value cannot drag.

```quiz
[
  {"q": "Use the hand method on the twelve HP values. What is the upper fence?", "type": "numeric", "answer": 2662, "tolerance": 0, "unit": "HP", "explain": "Sorted halves: 45, 115, 142, 172, 233, 403 | 510, 842, 982, 1336, 3218, 7420. $Q_1 = (142 + 172)/2 = 157$, $Q_3 = (982 + 1336)/2 = 1159$, $IQR = 1159 - 157 = 1002$. Upper fence $= 1159 + 1.5(1002) = 1159 + 1503 = 2662$."},
  {"q": "Which monsters are outliers by the fence rule? Select all.", "options": ["Mano (7420)", "Drake (3218)", "Lupin (1336)", "Snail (45)"], "answer": [0, 1], "explain": "Upper fence 2662: Mano 7420 and Drake 3218 are above it, Lupin 1336 is inside. Lower fence $157 - 1503 = -1346$, so no HP can sit below it and Snail is inside."},
  {"q": "Where does the boxplot's upper whisker end?", "type": "numeric", "answer": 1336, "tolerance": 0, "unit": "HP", "explain": "Drake and Mano are drawn as their own circles; the whisker stops at the largest value still inside the fence, Lupin's 1336."}
]
```

Sorted and split: 45, 115, 142, 172, 233, 403 | 510, 842, 982, 1336, 3218, 7420.

$Q_1 = \dfrac{142 + 172}{2} = 157$, $Q_3 = \dfrac{982 + 1336}{2} = 1159$, $IQR = 1159 - 157 = 1002$

$\text{upper fence} = 1159 + 1.5(1002) = 2662$, $\text{lower fence} = 157 - 1503 = -1346$

Mano at 7420 is past the upper fence, and so is Drake at 3218, an ordinary Lv 50 monster. The fence flags values far from the middle half; it does not know which monster is a boss. The upper whisker stops at Lupin, 1336.

```diagram
{ "type": "flow", "nodes": [ { "id": "lo", "label": "45", "sub": "whisker end" }, { "id": "q1", "label": "Q1 157", "sub": "box edge" }, { "id": "q2", "label": "Q2 456.5", "sub": "thick line" }, { "id": "q3", "label": "Q3 1159", "sub": "box edge" }, { "id": "hi", "label": "1336 Lupin", "sub": "whisker end" }, { "id": "out", "label": "3218, 7420", "sub": "circles: outliers" }, { "id": "uf", "label": "upper fence 2662", "sub": "whisker stops at the last value inside", "kind": "note" } ], "edges": [ { "from": "lo", "to": "q1" }, { "from": "q1", "to": "q2" }, { "from": "q2", "to": "q3" }, { "from": "q3", "to": "hi" }, { "from": "hi", "to": "out" }, { "from": "uf", "to": "hi", "dashed": true } ], "hi": ["hi", "out"], "caption": "Whiskers stop at the last value inside a fence, not at the min/max: 1336 is inside 2662, so 3218 and 7420 are drawn as circles." }
```

### The training monsters' boxplot

The widget marks outliers with R's quartiles, 164.5 and 1070.5, so its upper fence is 2429.5 instead of 2662; the same two monsters fall past it.

```widget
boxplot
{ "data": "45 115 142 172 233 403 510 842 982 1336 3218 7420", "note": "HP of 12 MapleStory Classic training monsters (meowdb monster table, Grand Launch build). Hand fences: Q1 = 157, Q3 = 1159, upper fence 2662." }
```

### Mano moves, the fence stays put

R's $Q_3$ for twelve values uses only the 9th and 10th, 982 and 1336, so dragging Mano anywhere above 1336 leaves the upper fence at 2429.5. Drag Drake inside the fence as well and the outlier claim turns false.

```widget
drag-data
{ "data": "45 115 142 172 233 403 510 842 982 1336 3218 7420", "title": "Twelve training monsters' HP: drag Mano and Drake toward the field", "claims": [
  { "when": "max>uf", "text": "The largest HP is beyond the upper fence: an outlier by the 1.5·IQR rule." },
  { "when": "max<=uf && min>=lf", "text": "Every HP is within the fences: no outliers right now." },
  { "when": "min<lf", "text": "The smallest HP is beyond the lower fence: an outlier too." },
  { "when": "range>iqr", "text": "The full range is wider than the IQR: the middle 50% is tighter than the whole spread." }
]}
```

## Fences on the first and last 30 days of Allflame Divine prices

poe.ninja's daily price of a Divine Orb, PoE1's high-value currency, in Chaos Orbs runs from 75.9 chaos on the Allflame league's first day [PoE1, 3.29 Allflame, poe.ninja daily Divine price, checked 2026-10-27]. Are the cheap league-start days outliers, and is a one-day dip near the end?

```quiz
[
  {"q": "The first 30 days of Allflame, sorted (chaos): 75.9, 83.5, 90.0, 107.0, 117.1, 117.4, 121.8, 123.0, 155.0, 163.4, 170.0, 171.8, 172.1, 172.7, 180.6, 189.5, 190.0, 193.0, 193.0, 193.0, 193.3, 193.3, 193.5, 193.6, 195.3, 197.4, 199.0, 199.6, 201.0, 208.2. Find $Q_1$ by the hand method.", "type": "numeric", "answer": 123.0, "tolerance": 0, "unit": "chaos", "explain": "$n = 30$: the lower half is the first 15 values, and its median is the 8th value, 123.0."},
  {"q": "Same 30 days. Find $Q_3$ by the hand method.", "type": "numeric", "answer": 193.5, "tolerance": 0, "unit": "chaos", "explain": "The upper half is values 16 to 30; its median is the 8th of those, the 23rd overall, 193.5."},
  {"q": "Same 30 days. Compute the lower fence.", "type": "numeric", "answer": 17.25, "tolerance": 0.01, "unit": "chaos", "explain": "$IQR = 193.5 - 123.0 = 70.5$. Lower fence $= 123.0 - 1.5(70.5) = 123.0 - 105.75 = 17.25$."},
  {"q": "The day-1 price, 75.9 chaos, is an outlier in the first 30 days.", "type": "tf", "answer": false, "explain": "Lower fence 17.25; 75.9 > 17.25, so it is inside. The cheap days are not rare in this window: 8 of 30 sit at 123.0 or below, so they set $Q_1$ itself, and a fence built from them cannot flag them."},
  {"q": "The last 30 days to 2026-10-27, sorted: 163.8, 265.0, 265.0, 270.0, 300.0, 300.0, 300.0, 305.0, 315.6, 316.5, 316.5, 319.0, 320.0, 324.0, 326.0, 350.0, 350.0, 355.0, 357.0, 360.0, 364.0, 364.5, 366.0, 368.5, 369.0, 370.0, 370.0, 370.0, 377.2, 379.0. Compute the hand-method lower fence.", "type": "numeric", "answer": 213.5, "tolerance": 0.01, "unit": "chaos", "explain": "$Q_1$ is the 8th value, 305.0; $Q_3$ is the 23rd, 366.0. $IQR = 61.0$. Lower fence $= 305.0 - 1.5(61.0) = 305.0 - 91.5 = 213.5$. The one-day dip to 163.8, a receive-side-only reading (see the z-scores lesson), is below it: an outlier."},
  {"type": "fill", "q": "The last-30-days check in R. Fill the blank in the fence rule.", "code": "# last30 holds the 30 prices above\nQ1 <- quantile(last30, 0.25)   # 307.65\nQ3 <- quantile(last30, 0.75)   # 365.625\nsum(last30 < Q1 - ___*(Q3 - Q1))\n## [1] 1", "answer": ["1.5"], "explain": "R's quartiles differ from the hand ones, so its lower fence is $307.65 - 1.5(57.975) = 220.6875$; the verdict is the same, one outlier (163.8)."}
]
```

```quiz
[
  {
    "q": "The `precip` data has $Q_1 = 29.375$ and $Q_3 = 42.775$. What is the IQR?",
    "type": "numeric",
    "answer": 13.4,
    "tolerance": 0.05,
    "explain": "$IQR = 42.775 - 29.375 = 13.4$."
  },
  {
    "q": "What is the upper fence for the `precip` data?",
    "type": "numeric",
    "answer": 62.875,
    "tolerance": 0.05,
    "explain": "$Q_3 + 1.5 \\times IQR = 42.775 + 1.5(13.4) = 62.875$."
  },
  {
    "q": "What is the lower fence for the `precip` data?",
    "type": "numeric",
    "answer": 9.275,
    "tolerance": 0.05,
    "explain": "$Q_1 - 1.5 \\times IQR = 29.375 - 1.5(13.4) = 9.275$."
  },
  {
    "q": "Mobile has an average precipitation of 67.0 inches. Is it an outlier?",
    "type": "tf",
    "answer": true,
    "explain": "67.0 is above the upper fence of 62.875, so yes."
  },
  {
    "q": "A hypothetical city with 50.0 inches of precipitation would be an outlier for the `precip` data.",
    "type": "tf",
    "answer": false,
    "explain": "50.0 is between the lower fence (9.275) and upper fence (62.875), so it is not an outlier — even though it's above $Q_3$."
  },
  {
    "q": "Site B's drainage data is 1.02, 2.3, 2.6, 3.1, 3.31, 3.45, 3.5, 3.5, 3.56, 4.5, 4.5, 13.6. Using R's `quantile()`, $Q_1 = 2.975$ and $Q_3 = 3.795$. What is the IQR?",
    "type": "numeric",
    "answer": 0.82,
    "tolerance": 0.01,
    "explain": "$IQR = 3.795 - 2.975 = 0.82$."
  },
  {
    "q": "For Site B, what is the upper fence ($Q_3 = 3.795$, $IQR = 0.82$)?",
    "type": "numeric",
    "answer": 5.025,
    "tolerance": 0.02,
    "explain": "$3.795 + 1.5(0.82) = 5.025$."
  },
  {
    "q": "Site B's maximum value, 13.6, is an outlier by the $1.5 \\times IQR$ fence rule.",
    "type": "tf",
    "answer": true,
    "explain": "13.6 is far above the upper fence of 5.025."
  },
  {
    "q": "Site B's minimum value, 1.02, is also an outlier by the fence rule (R's lower fence $= 2.975 - 1.5(0.82) = 2.975 - 1.23 = 1.745$), even though the instructor's $3\\sigma$ check only flagged the maximum.",
    "type": "tf",
    "answer": true,
    "explain": "1.02 is below the lower fence 1.745. By hand: $Q_1 = 2.85$, $Q_3 = 4.03$, IQR = 1.18, fences 1.08 and 5.80, the same two outliers. The lab's $3s$ test (lesson 15) flags only 13.6; the fence rule also flags 1.02. They are different rules."
  },
  {
    "q": "In `boxplot(extra ~ group, data = sleep)`, what does the whisker length depend on if there are outliers present?",
    "options": ["The whisker still reaches the true min and max", "The whisker stops at the last data value still inside the fence", "The whisker is always exactly $1.5 \\times IQR$ long", "Whiskers disappear entirely when outliers exist"],
    "answer": 1,
    "explain": "Outliers are drawn separately as circles; the whisker only extends to the most extreme non-outlier value."
  }
]
```
