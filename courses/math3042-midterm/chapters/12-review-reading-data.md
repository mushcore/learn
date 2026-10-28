---
title: "Review 1: reading histograms, boxplots and summary tables"
minutes: 30
---
<!-- facts: poe1.data.divine-chaos-allflame, poe1.data.divine-chaos-mirage, poe1.data.divine-chaos-keepers, classic.monster.training-hp, classic.data.monsters, gms.data.ranking-level-hero-2026-10-27 -->
:::quiz What the paper asks and what earns the marks
Q1 (5 marks) reads a histogram: a percentage, the mean and median, and whether the empirical rule applies. Q2 (4 marks) recommends one of two products from a summary table. Q10 (4 marks) is TRUE or FALSE on boxplots, each with a reason. About 13 of 46 marks, and almost no arithmetic: the marks are for a verdict plus the numbers that back it.
:::

**Write this on the paper** for every interpretation question:

1. The verdict first: "TRUE", "No", "I recommend tablet Y".
2. Two numbers read from the figure or table, both groups' values side by side: "SD 10.8 vs 34.7".
3. The feature by name: "bimodal", "right-skewed", "the box width (IQR)", "the median line".

Do if time is short: Q1, Q2, Q10 and new variants 1 to 3. The rest are marked "if time".

## The ideas, from zero

The tiny cases below use poe.ninja's daily price of the Divine Orb, a Path of Exile 1 currency item, counted in Chaos Orbs (chaos), the game's everyday currency, over the Allflame league (96 days to 2026-10-27). One day gives one price, so the list is a plain set of numbers to average and sort.

**Mean.** Add the values, divide by how many: the last three Allflame days gave 265, 300 and 270 chaos, so the mean is $835/3 = 278$ chaos. On the sheet, under Descriptive Statistics: $\bar{X} = \dfrac{\sum x}{n}$ for a sample, $\mu = \dfrac{\sum x}{N}$ for a population.

**Median.** The middle value once the data are in order. Its position is $(n+1)/2$: sorted, the three prices are 265, 270, 300, position $(3+1)/2 = 2$, so the median is 270 chaos. For all 96 Allflame days, $(96+1)/2 = 48.5$, halfway between the 48th and 49th. Not on the sheet: remember $(n+1)/2$.

**Mode.** The most common value, or on a histogram the tallest bar.

**Standard deviation (SD, $s$).** The typical distance of a value from the mean. Small SD means the values are close together: consistent, reliable. On the sheet, under Descriptive Statistics: $s = \sqrt{\sum (x - \bar{X})^2 \,/\, (n - 1)}$ for a sample, $\sigma = \sqrt{\sum (x - \mu)^2 \,/\, N}$ for a population. You will read $s$ from a table, not compute it.

**Coefficient of variation (CV).** SD as a percentage of the mean, so two groups can be compared on one scale: $CV = s/\bar{X} \times 100\%$. For $s = 10.8$, $\bar X = 133.2$: $10.8/133.2 \times 100\% = 8.11\%$. On the sheet, under Descriptive Statistics, as $CV = \dfrac{s}{\bar{X}} \times 100\%$. Smaller CV = more consistent.

**Histogram shapes.** A histogram is bars over classes of the data; bar height is how many values fall in that class.

- *Bell-shaped*: one peak in the middle, symmetric.
- *Right-skewed*: the long tail runs to the right (a few large values).
- *Left-skewed*: the long tail runs to the left.
- *Bimodal*: two peaks.

:::warn Skew moves the mean, not the median
The tail drags the mean toward it; the median barely moves. Right tail: mean > median. Left tail: mean < median. Not on the sheet.
:::

**Empirical rule.** For bell-shaped data, about 68 % of values lie within 1 SD of the mean, 95 % within 2 SD, 99.7 % within 3 SD. On the sheet, under Empirical Rule, as three lines: "68 % of data values are within one standard deviation of the mean", then 95 % within two, 99.7 % within three. The trap: it holds **only** for bell shapes; skewed or bimodal data break it, and saying so is the mark.

**Z-score.** How many SDs a value sits from the mean: $Z = (x - \bar X)/s$. On the sheet, under Descriptive Statistics, as $Z = \dfrac{x - \bar{X}}{s}$. A value with $|Z| > 2$ is called unusual (not on the sheet).

Nexon's North America job ranking on 2026-10-27 lists the top 500 Heroes, a GMS job, with mean level 294.896 and SD 1.44. A level-300 Hero: $Z = (300 - 294.896)/1.44 = 5.104/1.44 = 3.54$, so level 300 is unusual even inside the top 500. A level-294 Hero: $Z = (294 - 294.896)/1.44 = -0.62$, ordinary. Z needs no bell shape; it only measures distance from this list's own mean in units of its own SD, which is why the same formula works on any data set.

**Quartiles and IQR.** $Q_1$ has 25 % of the data below it, $Q_2$ is the median, $Q_3$ has 75 % below. The interquartile range $IQR = Q_3 - Q_1$ is the spread of the middle half (remember this one). The fences $Q_1 - 1.5\,IQR$ and $Q_3 + 1.5\,IQR$ are on the sheet, under Outliers; a value outside a fence is an outlier.

**Reading a boxplot.**

- The box runs from $Q_1$ to $Q_3$, so its width is the IQR.
- The line inside the box is the median.
- The whiskers reach the most extreme values still inside the fences.
- Dots beyond the whiskers are outliers.
- Skew: the longer whisker (and the side the median is pushed away from) points to the tail. Median near $Q_1$ with a long upper whisker = right-skewed.

## Q1 (5 marks). The following histogram summarizes the length (in cm) of flower petals from 150 different iris flowers.

The paper shows "Histogram of Flower Petal Lengths" with bins 0.5 cm wide, redrawn here from its bar heights.

```widget
freq-hist
{ "start": 2.5, "width": 0.5, "freq": [37, 13, 0, 1, 4, 11, 21, 21, 17, 16, 5, 4], "label": "Petal length (cm)", "unit": "petals", "mean": "midpoint", "median": true, "toggles": true, "title": "Histogram of Flower Petal Lengths (n = 150)", "note": "Answer Q1b on paper first, then tick the boxes to see the mean marker and the median class." }
```

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
    "explain": "Count the short ones and take the complement. Petals under 4 cm: $$37 + 13 + 0 = 50$$ Petals at least 4 cm long, as a share of 150: $$\\dfrac{150 - 50}{150} = \\dfrac{100}{150} = \\mathbf{0.6667} \\text{ or } \\mathbf{66.67\\%}$$ The key writes exactly that: \"There are 37+13=50 that are less than 4cm long, so 100/150 = 0.6667 or 66.67% are at least 4cm long.\""
  },
  {
    "q": "**Q1b.** The mean petal length is approximately? (cm)",
    "type": "numeric",
    "answer": 5.25,
    "tolerance": 0.25,
    "unit": "cm",
    "explain": "Any value from 5.0 to 5.5 is a fair reading; the key gives **5.25 cm** with the note \"must be below the median\". The 50 petals under 3.5 cm sit far to the left and pull the mean down. The class-midpoint estimate agrees: $$2.75(37) + 3.25(13) + 4.25(1) + 4.75(4) + 5.25(11) + 5.75(21) + 6.25(21) + 6.75(17) + 7.25(16) + 7.75(5) + 8.25(4) = 779.5$$ $$\\bar{X} = \\dfrac{779.5}{150} = \\mathbf{5.20} \\text{ cm}$$"
  },
  {
    "q": "**Q1b.** The median petal length is approximately? (cm)",
    "type": "numeric",
    "answer": 5.75,
    "tolerance": 0.25,
    "unit": "cm",
    "explain": "Median position: $$\\dfrac{150 + 1}{2} = 75.5$$ halfway between the 75th and 76th petal. The Cumulative column reaches 66 at the end of 5.0–5.5, and the next class takes positions 67 to $$66 + 21 = 87$$ so positions 75 and 76 fall in **5.5–6.0**. The key takes the class midpoint, **5.75 cm**. Anything in 5.5 to 6.0 earns the mark."
  },
  {
    "type": "free",
    "q": "**Q1c.** Is it reasonable to use the empirical rule on this dataset? Justify with specific features of the histogram.",
    "model": "No. We can see from the histogram that the distribution is bimodal, with a second frequency peak on the left, making the distribution asymmetric and left-skewed. The empirical rule requires an approximately normal (bell-shaped) distribution.",
    "points": ["Verdict: No", "Names the shape: bimodal (two peaks) or left-skewed / not symmetric", "Points to the feature: a second peak of about 50 petals at 2.5–3.5 cm, apart from the main peak at 5.5–6.5 cm", "States the rule needs a bell-shaped (approximately normal) distribution"],
    "rows": 4,
    "explain": "The model answer is the key's own, verbatim. Two marks: the verdict with the reason (the rule needs a bell shape) and a feature you can point to on the figure."
  }
]
```

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

:::warn The key's centre sentence is reversed
The posted solution says the mean is higher for Y and the median higher for X. The table says the opposite: X has the higher mean (135.5 vs 133.2), Y the higher median (135.7 vs 130.2). The recommendation, Y, is right.
:::

```quiz
[
  {
    "type": "free",
    "q": "**Q2.** Write your recommendation: verdict, two measures of centre, two measures of spread.",
    "model": "I recommend tablet Y. The two tablets have comparable average battery life: tablet X has the higher mean (135.5 vs 133.2 min) while tablet Y has the higher median (135.7 vs 130.2 min), and both centres are well above 120 minutes. Tablet Y's battery life is much less variable: its standard deviation is 10.8 min against 34.7, its variance 116.6 against 1204.1, and its range 37.0 against 80.7 min. So a larger proportion of Y's batteries will last beyond 120 minutes, which makes tablet Y the more reliable choice.",
    "points": ["Verdict first: tablet Y", "Mean compared with both numbers: 135.5 vs 133.2", "Median compared with both numbers: 130.2 vs 135.7, centres close and above 120", "Two spread measures with both numbers: SD 34.7 vs 10.8, variance or range (80.7 vs 37.0)", "Links small spread to reliability: more of Y's batteries last past 120 min"],
    "rows": 6,
    "explain": "Reliability is about spread, so once the centres are shown to be close, the spread measures win the argument. Why the smaller SD wins: 120 minutes is $$Z_Y = \\dfrac{120 - 133.2}{10.8} = \\mathbf{-1.22}$$ SDs from Y's mean but only $$Z_X = \\dfrac{120 - 135.5}{34.7} = \\mathbf{-0.45}$$ from X's, so far more of X's batteries fall short of 2 hours."
  },
  {
    "q": "The coefficient of variation of tablet Y's battery life? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 8.11,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "On the sheet: $$CV = \\dfrac{s}{\\bar{X}} \\times 100\\% = \\dfrac{10.8}{133.2} \\times 100\\% = \\mathbf{8.11\\%}$$ Tablet X: $$\\dfrac{34.7}{135.5} \\times 100\\% = 25.6\\%$$ A third of X's relative spread."
  }
]
```

## Q10 (4 marks). The chart below shows the inflation-adjusted price of gold ($ per oz) since 2019, grouped by year (2019 to 2025).

The paper shows horizontal side-by-side boxplots, "Price of Gold Since 2019". Approximate readings:

| Year | Box, Q1 to Q3 ($ per oz) | IQR = box width | Median ($ per oz) |
|---|---|---|---|
| 2019 | about 1300 to 1500 | about 200 | about 1420 |
| 2020 | about 1680 to 1890 | about 210 | about 1770 |
| 2021 | very narrow box | very small | about 1780 |
| 2022 | about 1750 to 1880 | about 130 | about 1800 |
| 2023 | about 1930 to 1990 (narrow) | about 60 | about 1960 |
| 2024 | about 2250 to 2630 | about 380 | about 2390 |
| 2025 | about 3120 to 3380, whiskers about 2790 to 4090 | about 260 | about 3280 |

> For each statement below, write TRUE or FALSE and briefly explain your answer.

**a. [2]** The median price of gold has more than doubled from 2019 to 2025.

**b. [2]** The variability (or "volatility" in finance terms) of the price of gold has steadily increased from 2019 to 2025.

```quiz
[
  {
    "q": "**Q10a.** The median price of gold has more than doubled from 2019 to 2025.",
    "type": "tf",
    "answer": true,
    "explain": "Model answer (key): \"TRUE. The median price in 2019 was below 1500 $ per oz while the median price in 2025 was approximately 3300 $ per oz, which is more than double.\" Double the 2019 median: $$2 \\times 1420 = 2840$$ and 3280 is above it: $$\\dfrac{3280}{1420} = \\mathbf{2.31}$$ Use the median line inside each box, not the box edges."
  },
  {
    "q": "**Q10b.** The variability of the price of gold has steadily increased from 2019 to 2025.",
    "type": "tf",
    "answer": false,
    "explain": "Model answer (key): \"FALSE. Variability in this context is best represented by the interquartile range (IQR), which is the width of the box in the box plots. There is not clear trend in the IQR. For instance, 2024 has the largest IQR while 2020 and 2025 are approximately the same.\" The IQR falls from 2020 to 2023 (210 to 60), jumps in 2024 (380), falls in 2025 (260). \"Steadily\" fails."
  }
]
```

Each TRUE/FALSE part: one mark for the word, one for the reason that names the feature (median line, box width) and cites two years.

## Lab 2 questions on the same skills

**Lab 2, Task 5.** "How does the shape of the histogram reflect your calculated value of Sk?" Lab answer: "The long right tail is consistent with the high skewness (Sk = 1.01) for the entire sample." $Sk = 3(\bar X - Q_2)/s$ is on the sheet; positive Sk means right skew, mean above median (16.5 vs 11 days absent).

**Lab 2, Task 8.** `favstats(Days~Eth, data=quine)` gave:

| Eth | min | Q1 | median | Q3 | max | mean | sd | n |
|---|---|---|---|---|---|---|---|---|
| A | 0 | 6 | 15 | 32 | 81 | 21.23 | 17.72 | 69 |
| N | 0 | 4 | 7 | 16 | 69 | 12.18 | 13.56 | 77 |

"Make two observations." Lab answer: "1. Aboriginal students tended to have more days absent, based on the median and the mean. 2. Aboriginal students had greater variability in days absent."

**Lab 2, Task 14.** Within 1, 2, 3 SDs the lab found 0.781, 0.945, 0.979 of students, against the rule's 0.68, 0.95, 0.997. Lab answer: "The Empirical rule does not hold for Days, since it is not a normally distributed variable. It cannot be, since it is significantly skewed."

**Lab 2, pencil problem 3** (ten gold prices). IQR = 172.57, fences 5945.455 and 6635.735; the minimum 6023.88 and maximum 6448.51 sit inside both, so "There were no outliers in the sample."

```quiz
[
  {
    "type": "free",
    "q": "**Lab 2, Task 8.** From the favstats table by Eth, make two observations about how days absent differ between the groups.",
    "model": "1. Aboriginal (A) students tended to have more days absent: median 15 vs 7 and mean 21.2 vs 12.2 days. 2. Aboriginal students had greater variability in days absent: SD 17.7 vs 13.6 and IQR 32 − 6 = 26 vs 16 − 4 = 12.",
    "points": ["Centre: A higher, citing median 15 vs 7 or mean 21.2 vs 12.2", "Spread: A more variable, citing SD 17.7 vs 13.6", "Or IQR 26 vs 12 as the second spread figure", "Each observation cites both groups' numbers"],
    "rows": 4,
    "explain": "Same pattern as Q2: one centre comparison, one spread comparison, both numbers each time. IQR for A: $$32 - 6 = 26$$ for N: $$16 - 4 = 12$$"
  },
  {
    "q": "**Lab 2, Task 14.** The days-absent data are right-skewed. Should 95 % of students lie within 2 SDs of the mean?",
    "options": ["No: the empirical rule only applies to bell-shaped data", "Yes: the empirical rule applies to any data", "Yes, because n = 146 is large"],
    "answer": 0,
    "explain": "The rule's 68-95-99.7 holds for bell shapes only. Here the 1-SD share was 0.781, well above 0.68, and the 3-SD share 0.979, below 0.997: skew breaks the rule."
  }
]
```

## New variants

**Variant 1.** The 96 Allflame daily Divine prices (all rows, `receive_value_chaos`) in classes 50 chaos wide; a price on a boundary counts in the upper class. A league's price starts low and settles high, so the shape is the point of the question.

| Chaos | 50–100 | 100–150 | 150–200 | 200–250 | 250–300 | 300–350 | 350–400 | 400–450 |
|---|---|---|---|---|---|---|---|---|
| Frequency | 3 | 5 | 26 | 8 | 4 | 25 | 24 | 1 |
| Cumulative | 3 | 8 | 34 | 42 | 46 | 71 | 95 | 96 |

```widget
freq-hist
{ "start": 50, "width": 50, "freq": [3, 5, 26, 8, 4, 25, 24, 1], "label": "Divine Orb price (chaos)", "unit": "days", "mean": "midpoint", "median": true, "toggles": true, "title": "Allflame daily Divine prices (n = 96)", "note": "Read the shape first: how many peaks, and where is the long tail?" }
```

**Variant 2.** A trader holding Divine Orbs through a whole league wants the steadier price. poe.ninja's daily price over two finished leagues, all days of each (chaos):

| Statistic | Mirage (n=137) | Keepers (n=123) |
|---|---|---|
| Mean | 379.6 | 157.7 |
| Median | 368.0 | 150.0 |
| Standard deviation | 140.8 | 37.5 |
| Minimum | 36.3 | 44.85 |
| Maximum | 612.0 | 271.3 |

**Variant 3.** A boxplot of the HP (hit points) of 12 common MapleStory Classic training monsters from meowdb's fan database, hand method: box from 157 to 1159, median line at 456.5, lower whisker to 45, upper whisker to 1336, dots at 3218 (Drake) and 7420 (Mano, a boss). One boss among field monsters is the kind of value the fences exist to flag.

```quiz
[
  {
    "q": "**Variant 1.** On what percentage of Allflame days was the Divine price at least 300 chaos? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 52.08,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "\"At least 300\" is the class 300–350 and everything above it. Under 300 is the cumulative at the end of 250–300: 46. So $$\\dfrac{96 - 46}{96} = \\dfrac{50}{96} = \\mathbf{0.5208} \\text{ or } \\mathbf{52.08\\%}$$"
  },
  {
    "q": "**Variant 1.** On what percentage of days was the price under 200 chaos? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 35.42,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "The cumulative column at the end of 150–200 is $$3 + 5 + 26 = 34$$ so $$\\dfrac{34}{96} = \\mathbf{0.3542} \\text{ or } \\mathbf{35.42\\%}$$"
  },
  {
    "q": "**Variant 1.** Which is true of the mean and median Divine price?",
    "options": ["the mean is above the median: the data are right-skewed", "the mean is below the median: the cheap early days drag the mean down", "they are about equal: the data are bell-shaped"],
    "answer": 1,
    "explain": "Two peaks (150–200 and 300–400) and a tail of cheap days on the left. Median position $$\\dfrac{96+1}{2} = 48.5$$ falls in 300–350 (cumulative 46, then 71), so the median is about **325 chaos**. The midpoint mean is $$\\dfrac{75(3) + 125(5) + 175(26) + 225(8) + 275(4) + 325(25) + 375(24) + 425(1)}{96} = \\dfrac{25850}{96} = \\mathbf{269} \\text{ chaos}$$ below the median. The raw data agree: mean 269, median 300 chaos. Bimodal as well, so the empirical rule would not apply."
  },
  {
    "type": "free",
    "q": "**Variant 2.** Which league's Divine price was steadier? Cite two measures of centre and two of spread.",
    "model": "Keepers had the steadier Divine price. The centres differ a lot: Mirage's mean was 379.6 vs Keepers' 157.7 chaos, and its median 368.0 vs 150.0, so the SDs alone mislead. Keepers is still steadier: SD 37.5 vs 140.8 chaos, CV 23.8 % vs 37.1 %, and range 226 vs 576 chaos. Relative to its own price level, Keepers' price moved less.",
    "points": ["Verdict first: Keepers", "Two centre measures with both numbers: mean 379.6 vs 157.7, median 368.0 vs 150.0", "SD with both numbers: 140.8 vs 37.5", "CV with both numbers, because the centres differ: 37.1 % vs 23.8 %", "Range as a further spread figure: 576 vs 226"],
    "rows": 6,
    "explain": "When the means differ this much, compare spread on one scale with the CV. Mirage: $$\\dfrac{140.8}{379.6} \\times 100\\% = \\mathbf{37.1\\%}$$ Keepers: $$\\dfrac{37.5}{157.7} \\times 100\\% = \\mathbf{23.8\\%}$$ Ranges: $$612.0 - 36.3 = 575.7 \\approx 576, \\quad 271.3 - 44.85 = 226.45 \\approx 226$$"
  },
  {
    "q": "**Variant 3.** The median HP is 500.",
    "type": "tf",
    "answer": false,
    "explain": "The median is the line inside the box, at **456.5**: with $n = 12$ it is the mean of the 6th and 7th values, $$\\dfrac{403 + 510}{2} = 456.5$$ 500 is not marked on the plot."
  },
  {
    "q": "**Variant 3.** The IQR is 1002 HP.",
    "type": "tf",
    "answer": true,
    "explain": "The box width is the IQR: $$IQR = Q_3 - Q_1 = 1159 - 157 = \\mathbf{1002}$$"
  },
  {
    "q": "**Variant 3 (if time).** Mano's 7420 HP is an outlier.",
    "type": "tf",
    "answer": true,
    "explain": "Upper fence (on the sheet, under Outliers): $$Q_3 + 1.5\\,IQR = 1159 + 1.5(1002) = \\mathbf{2662}$$ 7420 is above 2662, so it is an outlier, drawn as a dot; Drake's 3218 is one too. Lower fence: $$157 - 1503 = -1346$$ the whisker end 45 is inside it."
  },
  {
    "q": "**Variant 3 (if time).** The HP values are left-skewed.",
    "type": "tf",
    "answer": false,
    "explain": "FALSE: right-skewed. The upper whisker is longer ($$1336 - 1159 = 177$$ against $$157 - 45 = 112$$), the median 456.5 sits nearer $Q_1$ than $Q_3$ ($$456.5 - 157 = 299.5$$ against $$1159 - 456.5 = 702.5$$), and both outliers are on the high side."
  },
  {
    "q": "**Variant 4 (if time).** The top 500 Heroes (a GMS job) in Nexon's North America job ranking on 2026-10-27 have mean level 294.896 and SD 1.44. Is a level-300 Hero unusual? Type the Z-score (3 significant digits).",
    "type": "numeric",
    "answer": 3.54,
    "tolerance": 0.01,
    "explain": "Let x = 300. On the sheet: $$Z = \\dfrac{x - \\bar X}{s} = \\dfrac{300 - 294.896}{1.44} = \\mathbf{3.54}$$ $|Z| = 3.54 > 2$, so yes, level 300 is unusual even within the top 500. Z needs no bell: it measures distance from this list's own mean in its own SD."
  },
  {
    "q": "**Variant 5 (if time).** meowdb's 87 Classic monsters (the 92-row table minus the 5 rows with 0 EXP) have mean HP 8610 and SD 36 800. What percentage of them lie within 1 SD of the mean? (percent, 2 decimals)",
    "type": "numeric",
    "answer": 95.4,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "Unrounded, within 1 SD means $$8614 - 36\\,752 < 0 \\le \\text{HP} \\le 8614 + 36\\,752 = 45\\,366$$ Every monster but the 4 above 45 366 HP qualifies: $$\\dfrac{83}{87} = \\mathbf{0.9540} \\text{ or } \\mathbf{95.40\\%}$$ The empirical rule says 68 %. It fails because HP is heavily right-skewed: a few bosses inflate the SD, so nearly everything sits inside 1 SD. Answer \"the rule does not apply\" and name the skew."
  }
]
```
