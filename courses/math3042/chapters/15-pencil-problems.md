---
title: Pencil problems, worked
minutes: 35
---

Lab 1 says these seven "Pencil Problems" are the preparation for the **theory part** of the quiz — no R, just a calculator.

## Problem 1 — Plywood thickness

Eighteen thickness measurements (inches) of ¾" plywood:

```text
0.754 0.735 0.754 0.748 0.740 0.752 0.747 0.740 0.751
0.741 0.740 0.742 0.748 0.732 0.750 0.747 0.750 0.752
```

Find the mean, median, range, and sample standard deviation.

```widget
stat-calc
{ "data": "0.754 0.735 0.754 0.748 0.740 0.752 0.747 0.740 0.751 0.741 0.740 0.742 0.748 0.732 0.750 0.747 0.750 0.752", "title": "Plywood thickness (n = 18)" }
```

```quiz
[
  { "q": "Mean thickness $\\bar{X}$ (4 decimals)?", "type": "numeric", "answer": 0.7457, "tolerance": 0.0005, "unit": "in", "explain": "$\\bar{X} = \\Sigma X / n = 13.4230/18 = 0.7457222$." },
  { "q": "Median thickness (with $n=18$, an even count)?", "type": "numeric", "answer": 0.7475, "tolerance": 0.0005, "unit": "in", "explain": "Sort all 18 values and average the 9th and 10th: $(0.747+0.748)/2 = 0.7475$." },
  { "q": "Range $R$?", "type": "numeric", "answer": 0.022, "tolerance": 0.0005, "unit": "in", "explain": "$R = \\max - \\min = 0.754 - 0.732 = 0.022$." },
  { "q": "Sample standard deviation $s$ (4 decimals)?", "type": "numeric", "answer": 0.00656, "tolerance": 0.0002, "unit": "in", "explain": "1. $\\Sigma X = 13.423$, $\\bar{X} = 0.7457222$. 2. $\\Sigma(X-\\bar{X})^2 = 0.00073161$. 3. $s = \\sqrt{0.00073161/17} = \\sqrt{0.000043036} = 0.006560$. Calculator: STAT → 1-var, enter the 18 values, read $s_x$, not $\\sigma_x$." }
]
```

## Problem 2 — Steel rods (grouped data)

A sample of 350 rod diameters, given as a frequency table:

| Diameter (mm) $X_i$ | Frequency $f_i$ |
|---|---|
| 10.00 | 40 |
| 10.01 | 75 |
| 10.02 | 100 |
| 10.03 | 90 |
| 10.04 | 45 |

```widget
grouped-mean
{ "rows": [[10.00, 40], [10.01, 75], [10.02, 100], [10.03, 90], [10.04, 45]], "title": "Steel rod diameters (n = 350)" }
```

```quiz
[
  { "q": "Grouped mean $\\bar{X} = \\Sigma f_i X_i / \\Sigma f_i$ (5 decimals)?", "type": "numeric", "answer": 10.02071, "tolerance": 0.0002, "unit": "mm", "explain": "$\\Sigma f_i = 350$, $\\Sigma f_i X_i = 3507.25$, $\\bar{X} = 3507.25/350 = 10.02071$ mm." },
  { "q": "Grouped standard deviation $s = \\sqrt{\\Sigma f_i (X_i-\\bar{X})^2/(\\Sigma f_i - 1)}$ (4 decimals)?", "type": "numeric", "answer": 0.012, "tolerance": 0.0005, "unit": "mm", "explain": "One row per class mark, $f_i(X_i - \\bar{X})^2$ with $\\bar{X} = 10.02071$: $\\Sigma f(X - \\bar{X})^2 = 0.0171633 + 0.0086097 + 0.0000510 + 0.0077602 + 0.0167372 = 0.0503214$. $s = \\sqrt{0.0503214/349} = \\sqrt{0.000144187} = 0.012008$ mm. The denominator $\\Sigma f_i - 1 = 349$ is the grouped version of $n-1$ (lesson 5 has the full table)." }
]
```

## Problem 3 — Gold price volatility

Daily opening price of gold (CA$ per oz), 10 days:

```text
6195.20 6377.58 6374.78 6448.51 6439.12 6343.34 6231.64 6244.87 6023.88 6127.91
```

a. Find the typical price (give more than one measure). b. Find $s$ — the typical day-to-day deviation from the mean (a measure of *volatility*). c. If price is normal, find the $\bar{X} \pm 3s$ range and the chance of falling outside it.

```widget
stat-calc
{ "data": "6195.20 6377.58 6374.78 6448.51 6439.12 6343.34 6231.64 6244.87 6023.88 6127.91", "title": "Gold price, C$/oz (10 days)" }
```

```quiz
[
  { "q": "Mean price?", "type": "numeric", "answer": 6280.68, "tolerance": 1, "unit": "C$", "explain": "$\\bar{X} = 62806.83/10 = 6280.683$." },
  { "q": "Median price?", "type": "numeric", "answer": 6294.1, "tolerance": 1, "unit": "C$", "explain": "Sorted, the 5th and 6th values are 6244.87 and 6343.34; $(6244.87 + 6343.34)/2 = 6294.105$. Mean and median are the **two typical-value measures** asked for in part (a)." },
  { "q": "Sample standard deviation $s$?", "type": "numeric", "answer": 139.73, "tolerance": 1, "unit": "C$", "explain": "$\\bar{X} = 6280.683$; $\\Sigma(X-\\bar{X})^2 = 175719.86$; $s = \\sqrt{175719.86/9} = \\sqrt{19524.43} = 139.73$, the typical amount price moves away from its own mean day to day. Calculator: read $s_x$." },
  { "q": "Upper limit of $\\bar{X} + 3s$?", "type": "numeric", "answer": 6699.87, "tolerance": 1, "unit": "C$", "explain": "$6280.683 + 3(139.7298) = 6699.873$." },
  { "q": "Lower limit of $\\bar{X} - 3s$?", "type": "numeric", "answer": 5861.49, "tolerance": 1, "unit": "C$", "explain": "$6280.683 - 3(139.7298) = 5861.493$." },
  { "q": "If price really is normally distributed, what is the probability it lands **outside** $\\bar{X}\\pm3s$, just by chance?", "type": "numeric", "answer": 0.3, "tolerance": 0.05, "unit": "%", "explain": "The empirical rule says 99.7% lies inside $\\mu\\pm3\\sigma$, so $100\\% - 99.7\\% = 0.3\\%$ lies outside." }
]
```

## Problem 4 — Which worker is more consistent?

Hank: mean 62 items/shift, $s = 4.2$. Pete: mean 59 items/shift, $s = 4.1$. Pete's $s$ is *smaller* — does that make him more consistent? You cannot compare raw $s$ values directly when the means differ; use the **coefficient of variation** $CV = \frac{s}{\bar{X}} \times 100\%$.

```quiz
[
  { "q": "Hank's CV?", "type": "numeric", "answer": 6.77, "tolerance": 0.1, "unit": "%", "explain": "$CV_{Hank} = 100 \\times 4.2/62 = 6.774\\%$." },
  { "q": "Pete's CV?", "type": "numeric", "answer": 6.95, "tolerance": 0.1, "unit": "%", "explain": "$CV_{Pete} = 100 \\times 4.1/59 = 6.949\\%$." },
  { "q": "Even though Pete's raw $s$ (4.1) is smaller than Hank's (4.2), who is the more consistent worker?", "options": ["Hank — smaller CV", "Pete — smaller raw s", "They are equally consistent", "Cannot tell without more data"], "answer": 0, "explain": "$CV$ scales $s$ relative to the mean. Hank's CV (6.77%) is smaller than Pete's (6.95%), so Hank is relatively more consistent even though his raw $s$ is larger. This is exactly why CV exists: it lets you compare variability across different means." }
]
```

## Problem 5 — Lumber moisture content

4x4 lumber ships with $\mu = 18\%$ moisture, $\sigma = 0.5\%$, bell-shaped.

```quiz
[
  { "q": "(a) Chebyshev's rule: minimum % of boards with moisture between 17% and 19% (which is $\\mu \\pm 2\\sigma$)?", "type": "numeric", "answer": 75, "tolerance": 1, "unit": "%", "explain": "$k=2$: $(1 - 1/2^2)\\times100\\% = 75\\%$. Chebyshev gives a guaranteed *minimum*, valid for any shape." },
  { "q": "(b) Empirical rule: % of boards between 17% and 19% (same interval, but now we use the bell shape)?", "type": "numeric", "answer": 95, "tolerance": 1, "unit": "%", "explain": "Because the data is bell-shaped we can use the sharper empirical rule instead of Chebyshev's guarantee: $\\mu \\pm 2\\sigma \\to 95\\%$." },
  { "q": "(c) Empirical rule: % of boards **above** 19.5% (which is $\\mu + 3\\sigma$)?", "type": "numeric", "answer": 0.15, "tolerance": 0.05, "unit": "%", "explain": "Above $\\mu+3\\sigma$ is the last of the eight slices (lesson 7): $0.15\\%$, half of the $0.3\\%$ outside $\\pm3\\sigma$." },
  { "q": "(d) Empirical rule: % of boards between 18% (the mean) and 18.5% ($\\mu+1\\sigma$)?", "type": "numeric", "answer": 34, "tolerance": 1, "unit": "%", "explain": "Mean to $+1\\sigma$ is one slice: $68\\%/2 = 34\\%$." },
  { "q": "(e) Building code needs moisture under 19% ($\\mu+2\\sigma$). What % of 4x4's qualify?", "type": "numeric", "answer": 97.5, "tolerance": 0.5, "unit": "%", "explain": "Add the slices up to $+2\\sigma$: $0.15 + 2.35 + 13.5 + 34 + 34 + 13.5 = 97.5\\%$." },
  {"type": "shade", "q": "Problem 5(b). Moisture $\\mu=18\\%$, $\\sigma=0.5\\%$, bell-shaped. Shade 17% to 19% and read the percentage.", "mu": 18, "sigma": 0.5, "answer": 95, "lo": -2, "hi": 2, "explain": "17 and 19 are $\\mu\\pm2\\sigma$ — the empirical rule gives 95% (Chebyshev would only promise 75%)."},
  {"type": "shade", "q": "Problem 5(c). Shade above 19.5%.", "mu": 18, "sigma": 0.5, "answer": 0.15, "tolerance": 0.1, "region": "above", "lo": 3, "explain": "19.5 is $\\mu+3\\sigma$; the upper tail beyond $3\\sigma$ is $0.3\\%/2 = 0.15\\%$."},
  {"type": "shade", "q": "Problem 5(d). Shade from the mean (18%) up to 18.5%.", "mu": 18, "sigma": 0.5, "answer": 34, "tolerance": 1, "lo": 0, "hi": 1, "explain": "Mean to $+1\\sigma$ is half of the 68% band = 34%."},
  {"type": "shade", "q": "Problem 5(e). Shade everything below 19% — the boards suitable to be closed in.", "mu": 18, "sigma": 0.5, "answer": 97.5, "tolerance": 1, "region": "below", "hi": 2, "explain": "19 is $\\mu+2\\sigma$: the slices $0.15 + 2.35 + 13.5 + 34 + 34 + 13.5 = 97.5\\%$."}
]
```

## Problem 6 — Usual or unusual body temperature?

$\mu = 98.20°F$, $\sigma = 0.62°F$. "Unusual" means $|Z| > 2$, i.e. outside $\mu \pm 2\sigma$.

```quiz
[
  { "q": "Lower bound of the usual range $\\mu - 2\\sigma$ (°F)?", "type": "numeric", "answer": 96.96, "tolerance": 0.01, "explain": "$98.20 - 2(0.62) = 96.96$." },
  { "q": "Upper bound of the usual range $\\mu + 2\\sigma$ (°F)?", "type": "numeric", "answer": 99.44, "tolerance": 0.01, "explain": "$98.20 + 2(0.62) = 99.44$." },
  { "q": "Is $101.00°F$ usual or unusual?", "options": ["unusual", "usual"], "answer": 0, "explain": "$Z = (101.00-98.20)/0.62 = 4.52$, and $|Z| > 2$: $101.00 > 99.44$, so it is **unusual**." },
  { "q": "Is $96.90°F$ usual or unusual?", "options": ["unusual", "usual"], "answer": 0, "explain": "$Z = (96.90-98.20)/0.62 = -2.10$: just below the lower bound 96.96, so **unusual**." },
  { "q": "Is $96.98°F$ usual or unusual?", "options": ["usual", "unusual"], "answer": 0, "explain": "$Z = (96.98-98.20)/0.62 = -1.97$: inside $[96.96, 99.44]$, so **usual**." }
]
```

## Problem 7 — Comparing two drainage sites

Drainage rate ($L/m^2\cdot s$) at two candidate building sites:

| Site A | Site B |
|---|---|
| 2.99 | 1.02 |
| 4.75 | 3.56 |
| 8.79 | 3.5 |
| 5.59 | 3.45 |
| 2.32 | 4.5 |
| 1.9 | 13.6 |
| | 4.5 |
| | 2.3 |
| | 3.5 |
| | 2.6 |
| | 3.31 |
| | 3.1 |

a. Which site drains better (higher rate, more consistent)? b. Site B is bell-shaped — could its max and/or min be discounted as too extreme? c. If Site A's minimum were excluded, what happens to its mean and $s$?

```widget
stat-calc
{ "data": "2.99 4.75 8.79 5.59 2.32 1.9", "presets": { "Site A": "2.99 4.75 8.79 5.59 2.32 1.9", "Site B": "1.02 3.56 3.5 3.45 4.5 13.6 4.5 2.3 3.5 2.6 3.31 3.1" }, "title": "Drainage rate, L/m²·s" }
```

```quiz
[
  { "q": "Mean drainage rate, Site A?", "type": "numeric", "answer": 4.39, "tolerance": 0.02, "explain": "$\\bar{X}_A = (2.99+4.75+8.79+5.59+2.32+1.9)/6 = 26.34/6 = 4.39$." },
  { "q": "Mean drainage rate, Site B?", "type": "numeric", "answer": 4.078, "tolerance": 0.02, "explain": "$\\bar{X}_B = 48.94/12 = 4.0783$." },
  { "q": "Coefficient of variation, Site A?", "type": "numeric", "answer": 58.85, "tolerance": 0.5, "unit": "%", "explain": "$s_A = 2.5836$, so $CV_A = 100\\times2.5836/4.39 = 58.85\\%$." },
  { "q": "Coefficient of variation, Site B?", "type": "numeric", "answer": 77.04, "tolerance": 0.5, "unit": "%", "explain": "$s_B = 3.1421$ (calculator $s_x$); $CV_B = 3.1421/4.0783 \\times 100\\% = 77.04\\%$." },
  { "q": "(a) Which site would you recommend building on?", "options": ["Site A — higher mean drainage and lower CV (more consistent)", "Site B — higher mean drainage", "Site B — lower CV", "Neither; the data are inconclusive"], "answer": 0, "explain": "Site A has both a higher mean (4.39 vs 4.078) and a much lower CV (58.85% vs 77.04%), so it drains better *and* more consistently." },
  { "q": "(b) Site B's maximum value (13.6) is more than $3s$ above Site B's mean.", "type": "tf", "answer": true, "explain": "$\\bar{X}_B + 3s_B = 4.078 + 3(3.142) \\approx 13.50$, and $13.6 > 13.50$, so the max sits just past 3 standard deviations — it could reasonably be discounted as an outlier." },
  { "q": "(b) Site B's minimum value (1.02) is also more than $3s$ below Site B's mean.", "type": "tf", "answer": false, "explain": "$\\bar{X}_B - 3s_B \\approx -5.35$, and $1.02$ is nowhere near that — only the maximum, not the minimum, is extreme enough to consider discounting. That is the $3s$ test this lab asks for. The $1.5 \\times IQR$ fence rule (lesson 11) is stricter here and also flags 1.02; the two rules can disagree." },
  { "q": "(c) If Site A's minimum (1.9) is removed, the new mean will...", "options": ["Increase", "Decrease", "Stay exactly the same"], "answer": 0, "explain": "Removing the smallest value pulls the mean up: $4.39 \\to 4.888$." },
  { "q": "(c) If Site A's minimum (1.9) is removed, the new standard deviation will...", "options": ["Increase", "Decrease", "Stay exactly the same"], "answer": 1, "explain": "Removing the point furthest from the mean reduces spread: $s_A$ drops from $2.5836 \\to 2.5463$." }
]
```
