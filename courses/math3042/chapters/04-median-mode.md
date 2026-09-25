---
title: Median & mode
minutes: 15
---

The mean isn't the only way to describe a "typical" value. The **median** and **mode** each answer the question differently, and each has a situation where it beats the mean outright.

## Median: the middle value

The median, written $\tilde{X}$ or $Q_2$, is the value that sits in the **middle** once the data is sorted from smallest to largest.

- **Odd $n$:** the median is the exact middle value.
- **Even $n$:** there is no single middle value, so the median is the **mean of the two middle values**.

:::warn Sort first
Sort the data first; the median of unsorted data is wrong even when the counting is right.
:::

### Worked example, odd $n$

Data: $19, 19, 20, 22, 23, 25, 50$ — already sorted, $n = 7$ (odd).

The middle position is the 4th value: $19, 19, 20, \mathbf{22}, 23, 25, 50$.

$$Q_2 = 22$$

The median ignores the `50`: it only matters that it is above the middle, not how far above.

### Worked example, even $n$

Data: $19, 20, 23, 27, 29, 30$ — sorted, $n = 6$ (even).

There are two middle values, the 3rd and 4th: $19, 20, \mathbf{23}, \mathbf{27}, 29, 30$.

$$Q_2 = \frac{23 + 27}{2} = 25$$

:::quiz Quiz note
With even $n$ the median is the **average** of the two middle values, which is often a number that does not appear in the data set (like `25` here).
:::

## Worked example: Old Faithful eruptions

The first ten `faithful$eruptions` values, sorted: $1.800,\ 1.950,\ 2.283,\ 2.883,\ 3.333,\ 3.600,\ 3.600,\ 4.350,\ 4.533,\ 4.700$.

$n = 10$ (even), so average the 5th and 6th values:

$$Q_2 = \frac{3.333 + 3.600}{2} = 3.4665$$

In R: `median(faithful$eruptions[1:10])` → `3.4665`.

```widget
stat-calc
{ "data": "1.800 1.950 2.283 2.883 3.333 3.600 3.600 4.350 4.533 4.700", "title": "First 10 Old Faithful eruptions" }
```

## Mode: the most frequent value

The mode is the value (or values) that occur **most often** in a data set. Unlike the mean and median, a data set can have:

- **no mode** (every value is unique — nothing repeats),
- **one mode** (one value clearly occurs most),
- **several modes** (a tie for most frequent — "bimodal", "multimodal").

Example from the notes: `survey$Pulse` has mode `80`, occurring 18 times — more than any other pulse value in that data set.

In R: `as.double(names(which.max(table(survey$Pulse))))` → `80`.

```widget
stat-calc
{ "data": "60 62 64 68 70 72 75 78 80 80 80 80 80 82 84 88 90 92", "title": "Pulse-style data with a clear mode (80)" }
```

## Why bother with the median at all?

The mean is sensitive to **every** value, including extreme ones, so one huge outlier can drag it a long way. The median only cares about rank order, so it barely moves.

Look back at $19, 19, 20, 22, 23, 25, 50$: the mean is $\frac{19+19+20+22+23+25+50}{7} \approx 25.4$ — pulled upward by the `50`. The median stayed at `22`, a much better description of where most of the data actually sits.

This is the central idea of skewness (next): when a distribution is skewed or has outliers, the mean and median pull apart, and the median is usually the more trustworthy "typical value."

```widget
drag-data
{ "data": "19 19 20 22 23 25 50", "title": "Drag the outlier and watch mean vs median", "claims": [
  { "when": "mean>median", "text": "The mean is above the median: the outlier is pulling it upward." },
  { "when": "mean<median", "text": "The mean is below the median: whatever you dragged down is pulling it below." },
  { "when": "mean==median", "text": "Mean equals median: perfectly balanced, no single value is dominating." },
  { "when": "max>uf", "text": "The largest value is beyond the upper fence — a classic single-outlier shape." }
]}
```

```quiz
[
  {
    "q": "Sort first: 30, 12, 25, 18, 22 (n = 5, odd). What is the median?",
    "type": "numeric",
    "answer": 22,
    "tolerance": 0.05,
    "explain": "Sorted: 12, 18, 22, 25, 30. Middle (3rd) value is 22."
  },
  {
    "q": "Sort first: 8, 3, 15, 6 (n = 4, even). What is the median?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0.05,
    "explain": "Sorted: 3, 6, 8, 15. Middle two are 6 and 8; median = (6+8)/2 = 7."
  },
  {
    "q": "For 19, 19, 20, 22, 23, 25, 50, what is $Q_2$?",
    "type": "numeric",
    "answer": 22,
    "tolerance": 0.05,
    "explain": "n = 7 (odd), already sorted; the 4th value is the median: 22."
  },
  {
    "q": "For 19, 20, 23, 27, 29, 30, what is $Q_2$?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0.05,
    "explain": "n = 6 (even); average the 3rd and 4th values: (23+27)/2 = 25."
  },
  {
    "q": "First 10 Old Faithful eruptions sorted: 1.800, 1.950, 2.283, 2.883, 3.333, 3.600, 3.600, 4.350, 4.533, 4.700. What is the median?",
    "type": "numeric",
    "answer": 3.4665,
    "tolerance": 0.01,
    "explain": "n = 10 (even); average the 5th and 6th values: (3.333 + 3.600)/2 = 3.4665."
  },
  {
    "q": "With an even sample size, the median is always one of the actual data values.",
    "type": "tf",
    "answer": false,
    "explain": "It's the average of the two middle values, which need not equal any observed data point (e.g. 25 in the 19,20,23,27,29,30 example)."
  },
  {
    "q": "`survey$Pulse` mode is 80 with frequency 18. What does this mean?",
    "options": ["80 is the average pulse value", "80 is the middle pulse value when sorted", "80 occurs more often (18 times) than any other pulse value", "There are 80 distinct pulse values recorded"],
    "answer": 2,
    "explain": "The mode is the most frequently occurring value — 80 shows up 18 times, more than any other value in the data set."
  },
  {
    "q": "A data set where every value is different (no repeats) has:",
    "options": ["A mode equal to the mean", "A mode equal to the median", "No mode at all", "Multiple modes, one per value"],
    "answer": 2,
    "explain": "The mode requires repetition. If nothing repeats, there is no mode."
  },
  {
    "q": "Why is the median often preferred over the mean when a data set has an extreme outlier?",
    "options": ["The median is always larger than the mean", "The mean gets pulled toward the outlier while the median barely moves, since it only depends on rank order", "The median uses every data value equally, unlike the mean", "The mean cannot be computed when outliers are present"],
    "answer": 1,
    "explain": "The mean sums every value, so one extreme value shifts it. The median only cares about which values are above/below the middle, so it's resistant to outliers."
  }
]
```
