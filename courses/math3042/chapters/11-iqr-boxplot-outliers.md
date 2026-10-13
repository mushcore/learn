---
title: IQR, boxplots & outliers
minutes: 18
---

Quartiles are position markers. The **interquartile range** turns them into a measure of variation, and the **boxplot** turns the whole five-number summary into a picture.

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

The instructor's conclusion from that plot: *"Generally, the drug for group 2 was more effective than the drug for group 1 (not for all individuals)."* The hedge matters: the group 2 box sits higher overall, but the boxes still overlap, so it isn't true for every individual.

## Outliers and fences

A value is flagged as an **outlier** if it falls outside a pair of *fences* built from $Q_1$, $Q_3$, and the IQR:

$\text{lower fence} = Q_1 - 1.5 \times IQR$

$\text{upper fence} = Q_3 + 1.5 \times IQR$

Anything beyond a fence is drawn as its own circle on the boxplot, and the whisker on that side stops at the **last value still inside the fence** — not at the true min/max.

### Worked example: `precip` (annual precipitation, 70 US cities)

$Q_1 = 29.375$, $Q_3 = 42.775$, so:

$IQR = 42.775 - 29.375 = 13.4$

$\text{lower fence} = 29.375 - 1.5(13.4) = 9.275$

$\text{upper fence} = 42.775 + 1.5(13.4) = 62.875$

Any city below 9.275 or above 62.875 inches is an outlier. In the real data that's Mobile (67.0, above the upper fence) and Phoenix (7.0), Reno (7.2), Albuquerque (7.8), and El Paso (7.8) — all below the lower fence.

```widget
boxplot
{ "dataset": "precip", "note": "precip: average annual precipitation (inches), 70 US cities" }
```

:::warn Outlier ≠ Unusual
**Unusual** (empirical rule / Z-scores) means more than 2 standard deviations from the mean. **Outlier** (boxplots) means beyond $1.5 \times IQR$ past a quartile. A value can be one without being the other.
:::

## Site B drainage data

Lab 1 pencil problem 7 gave two drainage-rate samples. Site B's values include one large reading, 13.6, that the instructor flagged as possibly extreme using the empirical rule ($3\sigma$ test); the fence method below gives a second opinion on the same data.

```widget
boxplot
{ "data": "1.02 3.56 3.5 3.45 4.5 13.6 4.5 2.3 3.5 2.6 3.31 3.1", "note": "Site B drainage rate (litre / m^2 s), n = 12" }
```

## The fences stay put while the maximum moves

The upper fence is built from $Q_1$ and $Q_3$, which barely move when the largest point moves, so the point crosses a fence that stays put.

```widget
drag-data
{ "data": "2.3 2.6 3.1 3.31 3.45 3.5 3.5 3.56 4.5 4.5 5.2", "title": "The rightmost point and the upper fence", "claims": [
  { "when": "max>uf", "text": "The maximum is beyond the upper fence: it's an outlier by the 1.5·IQR rule." },
  { "when": "max<=uf && max>=lf", "text": "Every value is within the fences: no outliers right now." },
  { "when": "min<lf", "text": "The minimum is beyond the lower fence: it's an outlier too." },
  { "when": "range>iqr", "text": "The full range is wider than the IQR — the middle 50% is tighter than the whole spread." }
]}
```

## Fences and outliers for twelve delivery times

Twelve delivery times in minutes: 18, 22, 25, 21, 19, 24, 47, 23, 20, 26, 14, 22.

```quiz
[
  {"q": "Find $Q_1$ by the hand method.", "type": "numeric", "answer": 19.5, "tolerance": 0, "explain": "Sorted: 14, 18, 19, 20, 21, 22 | 22, 23, 24, 25, 26, 47. Lower half 14, 18, 19, 20, 21, 22; its median is $(19 + 20)/2 = 19.5$."},
  {"q": "Find $Q_3$ by the hand method.", "type": "numeric", "answer": 24.5, "tolerance": 0, "explain": "Upper half 22, 23, 24, 25, 26, 47; its median is $(24 + 25)/2 = 24.5$."},
  {"q": "Compute the upper fence.", "type": "numeric", "answer": 32.0, "tolerance": 0, "explain": "$IQR = 24.5 - 19.5 = 5$. Upper fence $= Q_3 + 1.5 \\times IQR = 24.5 + 7.5 = 32$."},
  {"q": "Compute the lower fence.", "type": "numeric", "answer": 12.0, "tolerance": 0, "explain": "$Q_1 - 1.5 \\times IQR = 19.5 - 7.5 = 12$. The minimum 14 is inside it, so there is no low outlier."},
  {"q": "Only 47 is beyond a fence. Where does the boxplot's upper whisker end?", "type": "numeric", "answer": 26, "tolerance": 0, "unit": "min", "explain": "47 > 32 is drawn as its own circle; the whisker stops at the largest value still inside the fence, 26."},
  {"type": "fill", "q": "The same check in R. Fill the blank in the fence rule.", "code": "times <- c(18, 22, 25, 21, 19, 24, 47, 23, 20, 26, 14, 22)\nQ1 <- quantile(times, 0.25)   # 19.75\nQ3 <- quantile(times, 0.75)   # 24.25\nupper.fence <- Q3 + ___*(Q3 - Q1)\nsum(times > upper.fence)\n## [1] 1", "answer": ["1.5"], "explain": "R's quartiles (19.75, 24.25) differ slightly from the hand ones, so its upper fence is $24.25 + 1.5(4.5) = 31$; the verdict is the same, one outlier (47)."}
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
    "q": "Site B's minimum value, 1.02, is also an outlier by the fence rule (lower fence $\\approx 1.745$), even though the instructor's $3\\sigma$ check only flagged the maximum.",
    "type": "tf",
    "answer": true,
    "explain": "1.02 is below the lower fence of about 1.745. The IQR/fence method and the $3\\sigma$ empirical-rule method don't have to agree — they're different rules for different purposes."
  },
  {
    "q": "In `boxplot(extra ~ group, data = sleep)`, what does the whisker length depend on if there are outliers present?",
    "options": ["The whisker still reaches the true min and max", "The whisker stops at the last data value still inside the fence", "The whisker is always exactly $1.5 \\times IQR$ long", "Whiskers disappear entirely when outliers exist"],
    "answer": 1,
    "explain": "Outliers are drawn separately as circles; the whisker only extends to the most extreme non-outlier value."
  }
]
```
