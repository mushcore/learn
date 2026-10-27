---
title: Median & mode
minutes: 18
---
<!-- facts: poe1.ladder.ruthless-levels, classic.monster.training-hp, gms.data.ranking-level-hero-2026-10-27 -->

The top 200 of a PoE1 ladder are most often level 92 with a tail to 99, and one boss carries almost half the HP of twelve monsters: which value is "typical"? The **median** and **mode** each answer the question differently, and each has a situation where it beats the mean outright.

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

## Ruthless ladder ranks 1-200: three centres from one level table

The official PoE1 Ruthless Allflame ladder listed these levels for ranks 1-200 on 27 October 2026 [PoE1, 3.29 Allflame Ruthless ladder, checked 2026-10-27]:

| Level | 92 | 93 | 94 | 95 | 96 | 97 | 99 |
|---|---|---|---|---|---|---|---|
| Characters | 88 | 53 | 29 | 15 | 7 | 7 | 1 |

The counts pile up at 92 with a thin tail to 99, a right-skewed table, so the three centres land in different places.

```quiz
[
  {"q": "What is the mode of the 200 levels?", "type": "numeric", "answer": 92, "tolerance": 0, "explain": "Level 92 has the largest count, 88, so the mode is 92."},
  {"q": "What is the median $Q_2$ of the 200 levels?", "type": "numeric", "answer": 93, "tolerance": 0, "explain": "$n = 200$ is even, so average the 100th and 101st sorted values. Counting up: 88 characters reach position 88, then $88 + 53 = 141$, so positions 89 to 141 are all 93. Both middle values are 93: $Q_2 = (93 + 93)/2 = 93$."},
  {"q": "The 200 levels sum to 18626. Compute $\\bar{X}$. (2 decimals)", "type": "numeric", "answer": 93.13, "tolerance": 0.005, "explain": "$\\bar{X} = 18626/200 = 93.13$."}
]
```

1. Mode: 92, with 88 characters.
2. Median: $n = 200$, so average the 100th and 101st values. Cumulative counts are 88 at level 92 and $88 + 53 = 141$ at 93, so both middle positions are 93 and $Q_2 = 93$.
3. Mean: $\sum X = 92(88) + 93(53) + 94(29) + 95(15) + 96(7) + 97(7) + 99(1) = 18626$, and $\bar{X} = 18626/200 = 93.13$.

Mode $<$ median $<$ mean: the seven characters at 97 and the one at 99 pull the mean up, while the median only sees that they sit above the middle.

### Every 8th rank in the calculator

It holds every 8th rank (8, 16, ..., 200): 25 levels, mode 92, median 93, mean 93.04.

```widget
stat-calc
{ "data": "92 92 92 92 92 92 92 92 92 92 92 93 93 93 93 93 93 93 94 94 94 94 95 95 97", "title": "Ruthless Allflame levels, every 8th rank from 1-200" }
```

## Twelve Classic training monsters: one boss

meowdb's monster table for MapleStory Classic lists these HP values for twelve Victoria Island training monsters, sorted: 45, 115, 142, 172, 233, 403, 510, 842, 982, 1336, 3218 and 7420, the last being Mano, a field boss [Classic, Classic World Grand Launch build, meowdb monster table, checked 2026-10-27].

```quiz
[
  {"q": "Compute the median HP of the twelve monsters.", "type": "numeric", "answer": 456.5, "tolerance": 0, "explain": "$n = 12$ is even, so average the 6th and 7th values: $(403 + 510)/2 = 456.5$ HP, a value no monster has."}
]
```

$n = 12$, so $Q_2 = (403 + 510)/2 = 456.5$ HP. The mean is $15418/12 = 1284.83$ HP, above nine of the twelve monsters, because Mano's 7420 alone is almost half the sum. There is no mode: no HP value repeats.

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

## Medians and modes of three more game lists

Nexon's North America ranking of the top 500 Heroes, counted by level from 293 up, reads 293: 85, 294: 102, 295: 200, 296: 59, 297: 24, 298: 13, 299: 11, 300: 6 [GMS, v.271 Hero job ranking, checked 2026-10-27]. Ruthless Allflame ranks 4601-4800 read 17: 66, 18: 96, 19: 38 [PoE1, 3.29 Allflame Ruthless ladder, checked 2026-10-27]. Drop Mano from the twelve Classic monsters and eleven HP values remain.

```quiz
[
  {"q": "Top 500 Heroes: what is the mode level?", "type": "numeric", "answer": 295, "tolerance": 0, "explain": "Level 295 has the largest count, 200 of the 500 Heroes, so the mode is 295."},
  {"q": "Top 500 Heroes: what is the median level $Q_2$?", "type": "numeric", "answer": 295, "tolerance": 0, "explain": "$n = 500$ is even, so average the 250th and 251st values. Cumulative counts from the bottom: 85 at 293, $85 + 102 = 187$ at 294, $187 + 200 = 387$ at 295. Positions 188 to 387 are 295, so $Q_2 = (295 + 295)/2 = 295$. Here mode and median agree; the mean, 294.896, is pulled below them by the 187 Heroes at 293 and 294."},
  {"q": "Ruthless ranks 4601-4800: what is the median level?", "type": "numeric", "answer": 18, "tolerance": 0, "explain": "$n = 200$: average the 100th and 101st values. Cumulative counts: 66 at 17, $66 + 96 = 162$ at 18, so positions 67 to 162 are 18 and $Q_2 = 18$."},
  {"q": "Without Mano, the HP values are 45, 115, 142, 172, 233, 403, 510, 842, 982, 1336, 3218. What is the median?", "type": "numeric", "answer": 403, "tolerance": 0, "explain": "$n = 11$ is odd, so the median is the 6th sorted value: 403 HP. Removing the boss moved the median from 456.5 to 403, a small step."},
  {"q": "Same eleven monsters: compute $\\bar{X}$. (2 decimals)", "type": "numeric", "answer": 727.09, "tolerance": 0.005, "explain": "$\\sum X = 15418 - 7420 = 7998$, so $\\bar{X} = 7998/11 = 727.09$ HP. Removing Mano dropped the mean by 557.74 HP while the median moved only 53.5."},
  {"type": "fill", "q": "Fill the blank with what R prints.", "code": "hp <- c(45, 115, 142, 172, 233, 403, 510, 842, 982, 1336, 3218, 7420)\nmedian(hp)\n## [1] ___", "answer": ["456.5"], "explain": "`median()` sorts, then averages the 6th and 7th of the twelve values: $(403 + 510)/2 = 456.5$."}
]
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
