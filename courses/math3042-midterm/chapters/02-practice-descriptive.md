---
title: "Q1, Q2, Q10: reading a histogram, recommending from a summary table, true or false on boxplots"
minutes: 25
---
Three of the practice paper's questions, 13 marks between them, ask you to read a figure or a table and write a short argument. Write your own answer on paper first; each model answer opens only after you commit to a number or a verdict.

## Q1 (5 marks). The following histogram summarizes the length (in cm) of flower petals from 150 different iris flowers.

The paper shows "Histogram of Flower Petal Lengths" with bins 0.5 cm wide. Here it is as the frequency table you would read off the bars, with the running total added.

| Petal length (cm) | Frequency | Cumulative |
|---|---|---|
| 2.5–3.0 | 37 | 37 |
| 3.0–3.5 | 13 | 50 |
| 3.5–4.0 | 0 | 50 |
| 4.0–4.5 | 1 | 51 |
| 4.5–5.0 | 4 | 55 |
| 5.0–5.5 | 11 | 66 |
| 5.5–6.0 | 21 | 87 |
| 6.0–6.5 | 21 | 108 |
| 6.5–7.0 | 17 | 125 |
| 7.0–7.5 | 16 | 141 |
| 7.5–8.0 | 5 | 146 |
| 8.0–8.5 | 4 | 150 |
| Total | 150 | |

**a. [1]** Approximately, what percentage of the flower petals were at least 4 cm long?

**b. [2]** Based on the histogram, approximate the mean and median values of the petal lengths. You are not required to show any calculations, but you must fill in the following: The mean petal length is approximately: / The median petal length is approximately:

**c. [2]** Is it reasonable to use the empirical rule on this dataset? Justify your answer with reference to specific features of the histogram.

```quiz
[
  {
    "q": "**Q1a.** Percentage of petals at least 4 cm long? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 66.67,
    "tolerance": 1,
    "unit": "%",
    "explain": "Count the short ones and take the complement. There are 37 + 13 + 0 = 50 petals under 4 cm, so 150 − 50 = 100 are at least 4 cm long: 100/150 = 0.6667 or **66.67 %**. The key writes exactly that: \"There are 37+13=50 that are less than 4cm long, so 100/150 = 0.6667 or 66.67% are at least 4cm long.\""
  },
  {
    "q": "**Q1b.** The mean petal length is approximately? (cm)",
    "type": "numeric",
    "answer": 5.25,
    "tolerance": 0.25,
    "unit": "cm",
    "explain": "Any value from 5.0 to 5.5 is a fair reading; the key gives **5.25 cm** with the note \"must be below the median\". The 50 petals under 3.5 cm sit far to the left of everything else and pull the mean down, so the mean lies below the median class. The class-midpoint estimate (Σ midpoint × frequency / 150) is 5.20 cm, which agrees."
  },
  {
    "q": "**Q1b.** The median petal length is approximately? (cm)",
    "type": "numeric",
    "answer": 5.75,
    "tolerance": 0.25,
    "unit": "cm",
    "explain": "With n = 150 the median sits between the 75th and 76th values. The cumulative count reaches 66 at the end of the 5.0–5.5 class and 87 at the end of 5.5–6.0, so the 75th and 76th values lie in **5.5–6.0**. The key takes the class midpoint, **5.75 cm**; interpolating inside the class gives 5.73 cm. Anything in 5.5 to 6.0 earns the mark."
  },
  {
    "q": "**Q1c.** Write your justification on paper, then type the one feature of this histogram that rules out the empirical rule.",
    "type": "text",
    "answer": ["bimodal", "bimodal distribution", "two peaks", "left-skewed", "left skewed", "skewed left", "skewed", "asymmetric", "not symmetric", "not bell-shaped", "not bell shaped"],
    "explain": "Model answer (verbatim from the key): \"No. We can see from the histogram that the distribution is bimodal, with a second frequency peak on the left, making the distribution asymmetric and left-skewed. The empirical rule requires an approximately normal (bell-shaped) distribution.\" The two marks are the verdict with the reason (the rule needs a bell shape) and a named feature you can point to: the second peak of 37 + 13 petals at 2.5–3.5 cm, separated from the main peak at 5.5–6.5 cm by an empty 3.5–4.0 class."
  }
]
```

The first mark on 1b is for a mean below the median; the second is for a median in the right class. Mean below median is the signature of a left tail, here the separate cluster of 50 short petals. The empirical rule (68 %, 95 %, 99.7 % within 1, 2, 3 standard deviations) is a property of bell-shaped data, which is why the verdict in 1c rests on shape and nothing else.

Taught in [the empirical rule](#/math3042/empirical-rule), [skewness](#/math3042/skewness) and [histograms](#/math3042-u2/histograms).

## Q2 (4 marks). Suppose you are researching tablet computers to provide a recommendation to the BCIT Mathematics department.

> One of the most important requirements of the instructors is that the battery must last at least 2 hours under full utilization. You have narrowed the best options down to two tablets, called here tablet X and tablet Y. Their prices and functionalities are similar. The decision as to which one to purchase comes down to which one has the most reliable battery life. You find published statistics from an experiment testing the battery life (in minutes) for each of these tablets. A summary of the data is provided below:

| Statistic | Tablet X (n=65) | Tablet Y (n=72) |
|---|---|---|
| Mean | 135.5 | 133.2 |
| Median | 130.2 | 135.7 |
| Standard deviation | 34.7 | 10.8 |
| Variance | 1204.1 | 116.6 |
| Range | 80.7 | 37.0 |
| Minimum | 91.9 | 108.2 |
| Maximum | 172.6 | 145.2 |

> Write a brief recommendation, being sure to cite relevant statistics in your explanation. You must comment on at least 2 measures of central tendency and at least 2 measures of spread in your recommendation.

```quiz
[
  {
    "q": "**Q2.** Write your recommendation on paper (verdict, two centre measures, two spread measures), then type the tablet you recommend: X or Y.",
    "type": "text",
    "answer": ["Y", "Tablet Y", "tablet y"],
    "explain": "Model answer: I recommend **tablet Y**. The two tablets have comparable average battery life: tablet X has the higher mean (135.5 vs 133.2 min, about 2 minutes more) while tablet Y has the higher median (135.7 vs 130.2 min, about 6 minutes more), and both centres are well above 120 minutes. Tablet Y's battery life is much less variable: its standard deviation is 10.8 min against 34.7, its variance 116.6 against 1204.1, and its range 37.0 against 80.7 min. So a larger proportion of Y's batteries will last beyond 120 minutes, which makes tablet Y the more reliable choice for lasting at least 2 hours."
  }
]
```

:::warn The key's centre sentence is reversed
The posted solution says "the mean battery life is about 3 minutes higher for Tablet Y, the median for Tablet X is about 6 minutes higher". The table says the opposite: X has the higher mean (135.5 vs 133.2) and Y the higher median (135.7 vs 130.2). The recommendation, Y, is right. The blank practice PDF also carries an older hidden answer that recommends X and calls Y the more variable tablet; that version is wrong.
:::

Three things carry the marks. The verdict comes first. Each comparison cites both numbers, not just "Y is less variable". And the word that decides the question is *reliable*: reliability is about spread, so the spread measures win the argument once the centres are shown to be close. The minimums do not settle it on their own, since both (91.9 and 108.2) are under 120.

The same comparison in one number is the [coefficient of variation](#/math3042/cv): CV = s / x̄ × 100 % puts the spread of each tablet on the same relative scale. Measures of centre and spread are taught in [the mean](#/math3042/mean), [median and mode](#/math3042/median-mode) and [range and standard deviation](#/math3042/range-sd).

## Q10 (4 marks). The chart below shows the inflation-adjusted price of gold ($ per oz) since 2019, grouped by year (2019 to 2025).

The paper shows horizontal side-by-side boxplots titled "Price of Gold Since 2019", price from 1000 to 4000 $ per oz. These are the approximate readings off the figure.

| Year | Box, Q1 to Q3 ($ per oz) | Median ($ per oz) |
|---|---|---|
| 2019 | about 1300 to 1500 | about 1420 |
| 2020 | about 1680 to 1890 | about 1770 |
| 2021 | very narrow box | about 1780 |
| 2022 | about 1750 to 1880 | about 1800 |
| 2023 | about 1930 to 1990 (narrow) | about 1960 |
| 2024 | about 2250 to 2630 | about 2390 |
| 2025 | about 3120 to 3380, whiskers about 2790 to 4090 | about 3280 |

> For each statement below, write TRUE or FALSE and briefly explain your answer.

**a. [2]** The median price of gold has more than doubled from 2019 to 2025.

**b. [2]** The variability (or "volatility" in finance terms) of the price of gold has steadily increased from 2019 to 2025.

```quiz
[
  {
    "q": "**Q10a.** The median price of gold has more than doubled from 2019 to 2025.",
    "type": "tf",
    "answer": true,
    "explain": "Model answer (key): \"TRUE. The median price in 2019 was below 1500 $ per oz while the median price in 2025 was approximately 3300 $ per oz, which is more than double.\" With the readings: 2 × 1420 = 2840, and the 2025 median of about 3280 is above that (3280/1420 = 2.31). Use the median line inside each box, not the box edges or the whiskers."
  },
  {
    "q": "**Q10b.** The variability of the price of gold has steadily increased from 2019 to 2025.",
    "type": "tf",
    "answer": false,
    "explain": "Model answer (key): \"FALSE. Variability in this context is best represented by the interquartile range (IQR), which is the width of the box in the box plots. There is not clear trend in the IQR. For instance, 2024 has the largest IQR while 2020 and 2025 are approximately the same.\" From the readings the box widths are about 200, 210, very narrow, 130, 60, 380 and 260: they shrink from 2020 to 2023, jump in 2024 and fall back in 2025. \"Steadily\" fails. The long 2025 whiskers do not rescue the statement; the IQR is the measure the key uses."
  }
]
```

A TRUE/FALSE part is worth 2 marks: one for the word, one for the explanation that names the feature (the median line, the box width) and cites readings from two or more years.

### The box width is the IQR

The ten days of gold prices from the Lab 2 pencil problem, in CA$ per oz. The box runs from Q1 to Q3, so its width is the IQR; the whiskers and any circled outliers are not part of it.

```widget
boxplot
{ "dataset": "gold", "note": "Ten closing prices of gold (CA$ per oz). The box runs from Q1 to Q3, so its width on the axis is the IQR = Q3 − Q1, the spread of the middle half. Whisker length is not the IQR." }
```

Taught in [IQR, boxplots and outliers](#/math3042/iqr-boxplot-outliers).

```quiz
[
  {
    "q": "From Q1's frequency table, what percentage of petals are shorter than 5 cm? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 36.67,
    "tolerance": 1,
    "unit": "%",
    "explain": "The cumulative column reaches 55 at the end of the 4.5–5.0 class: 37 + 13 + 0 + 1 + 4 = 55. 55/150 = 0.3667 or 36.67 %."
  },
  {
    "q": "A histogram has a long tail to the left. Which is true of its mean and median?",
    "options": ["the mean is below the median", "the mean is above the median", "the mean equals the median", "nothing can be said without the data"],
    "answer": 0,
    "explain": "The few small values in the left tail pull the mean down; the median, a position, barely moves. Left-skewed: mean < median. That is why Q1b's mean must be below its median."
  },
  {
    "q": "The coefficient of variation of tablet Y's battery life? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 8.11,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "CV = s / x̄ × 100 % = 10.8 / 133.2 × 100 % = 8.11 %. Tablet X: 34.7 / 135.5 × 100 % = 25.6 %. Y's spread is about a third of X's relative to the same centre."
  },
  {
    "q": "Every tablet Y battery in the experiment lasted at least 2 hours.",
    "type": "tf",
    "answer": false,
    "explain": "Y's minimum is 108.2 minutes, under 120. The recommendation rests on Y's smaller spread (s 10.8, range 37.0), which puts a larger proportion of its batteries above 120 minutes, not all of them."
  },
  {
    "q": "On a boxplot, the interquartile range is...",
    "options": ["the width of the box", "the distance between the whisker ends", "the position of the median line", "the length of the longer whisker"],
    "answer": 0,
    "explain": "The box runs from Q1 to Q3, so its width is IQR = Q3 − Q1. The distance between the whisker ends is (at most) the range."
  },
  {
    "q": "In Q10's readings, which year has the widest box?",
    "options": ["2024", "2025", "2020", "2019"],
    "answer": 0,
    "explain": "2024's box runs from about 2250 to 2630, an IQR of about 380 $ per oz; 2025's is about 3120 to 3380 (260), 2020's about 1680 to 1890 (210), 2019's about 1300 to 1500 (200)."
  }
]
```
