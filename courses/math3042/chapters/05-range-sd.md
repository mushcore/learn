---
title: Range & standard deviation
minutes: 20
---
<!-- facts: poe1.data.divine-chaos-allflame -->

How far does a Divine Orb's daily price stray in a quiet week, and what does one bad day do to that number? A **measure of variation** quantifies how spread out the values of $X$ are. Two numbers from the notes: the range (crude) and the standard deviation (the important one).

## Range

$R = \text{maximum } X - \text{minimum } X$

Classroom ages: $R = 35 - 18 = 17$ years. It depends on only **two** values, so one weird data point changes everything.

## Standard deviation

The **typical distance of the $X$ values away from the mean**. Same units as $X$.

| | Formula | Kind |
|---|---|---|
| Sample sd | $s = \sqrt{\frac{\sum (X - \bar{X})^2}{n - 1}}$ | statistic |
| Population sd | $\sigma = \sqrt{\frac{\sum (X - \mu)^2}{N}}$ | parameter |

:::warn Four facts
- Sample $s$ divides by **$n - 1$**, not $n$. Reason given in the notes: this makes $s$ a **better approximation of $\sigma$** ($s^2$ is an *unbiased estimator* of $\sigma^2$).
- $s$ uses the sample mean $\bar{X}$; $\sigma$ uses the population mean $\mu$.
- The **units of $s$ and $\sigma$ are the same as the units of $X$** (unlike variance, which is squared).
- Standard deviation depends on **all** of the data values — unlike $R$ and $IQR$.
:::

### s for the lecture sample 5.0, 4.5, 6.0, 7.0, 5.2

Calculate $s$ from the sample $5.0,\ 4.5,\ 6.0,\ 7.0,\ 5.2$ before reading the working below.

```quiz
[
  {
    "q": "For the sample 5.0, 4.5, 6.0, 7.0, 5.2 what is the sample standard deviation $s$? (3 decimals)",
    "type": "numeric",
    "answer": 0.979,
    "tolerance": 0.002,
    "explain": "$\\bar{X}=5.54$, $\\sum(X-\\bar{X})^2 = 3.832$, $s=\\sqrt{3.832/4}=0.9788$."
  }
]
```

Each part of the formula is linked to its step in the working and its bar in the chart.

$$s = \tag{sqrt}{\sqrt{\tag{frac}{\frac{\tag{dev}{\sum (X - \bar{X})^2}}{\tag{nm1}{n - 1}}}}}$$

1. Mean: $\bar{X} = \frac{5.0 + 4.5 + 6.0 + 7.0 + 5.2}{5} = \frac{27.7}{5} = 5.54$
2. Deviations squared: {{dev-0}}$(5.0-5.54)^2${{/dev-0}} + {{dev-1}}$(4.5-5.54)^2${{/dev-1}} + {{dev-2}}$(6.0-5.54)^2${{/dev-2}} + {{dev-3}}$(7.0-5.54)^2${{/dev-3}} + {{dev-4}}$(5.2-5.54)^2${{/dev-4}}
   $=$ {{dev-0}}$0.2916${{/dev-0}} $+$ {{dev-1}}$1.0816${{/dev-1}} $+$ {{dev-2}}$0.2116${{/dev-2}} $+$ {{dev-3}}$2.1316${{/dev-3}} $+$ {{dev-4}}$0.1156${{/dev-4}} $=$ {{dev}}$3.832${{/dev}}
3. Divide by {{nm1}}$n - 1 = 4${{/nm1}}: {{frac}}$3.832 / 4 = 0.958${{/frac}}
4. Square root: {{sqrt}}$s = \sqrt{0.958} = \mathbf{0.9788}${{/sqrt}}

```widget
stat-bars
{ "data": "5.0 4.5 6.0 7.0 5.2", "tag": "dev", "title": "Each bar is one squared deviation from the mean" }
```

In R: `sd(c(5.0, 4.5, 6.0, 7.0, 5.2))` → `0.9788`. R's `sd` **always** computes the sample version with $n-1$.

:::tip Reading s on the calculator
In STAT mode, read $\bar{x}$, $s$ (often labelled $s_x$ or $\sigma_{n-1}$) and $\sigma$ (labelled $\sigma_n$).
:::

## Seven days of Allflame Divine prices, by hand

poe.ninja's daily price of a Divine Orb, PoE1's high-value currency, in chaos orbs for 15 to 21 September 2026 reads 346.0, 337.0, 324.0, 345.0, 343.0, 343.0 and 342.0 chaos [PoE1, 3.29 Allflame, poe.ninja daily Divine price, checked 2026-10-27]. A trader holding Divines that week wants to know how far a typical day strayed from the week's level, which is what $s$ measures, in chaos.

```quiz
[
  {"q": "What is the range $R$ of the seven prices?", "type": "numeric", "answer": 22, "tolerance": 0, "unit": "chaos", "explain": "$R = 346.0 - 324.0 = 22.0$ chaos."},
  {"q": "Compute the sample standard deviation $s$ of the seven prices before reading the working. (3 significant digits)", "type": "numeric", "answer": 7.62, "tolerance": 0.005, "unit": "chaos", "explain": "$\\bar{X} = 2380.0/7 = 340.0$. Deviations $6, -3, -16, 5, 3, 3, 2$; squares $36 + 9 + 256 + 25 + 9 + 9 + 4 = 348$. $s = \\sqrt{348/6} = \\sqrt{58} = 7.6158$ chaos."}
]
```

1. Range: $R = 346.0 - 324.0 = 22.0$ chaos.
2. Mean: $\bar{X} = \dfrac{346.0 + 337.0 + 324.0 + 345.0 + 343.0 + 343.0 + 342.0}{7} = \dfrac{2380.0}{7} = 340.0$
3. Deviations: $6, -3, -16, 5, 3, 3, 2$; squared: $36 + 9 + 256 + 25 + 9 + 9 + 4 = 348$
4. Divide by $n - 1 = 6$: $348/6 = 58$
5. Square root: $s = \sqrt{58} = 7.6158 \approx \mathbf{7.62}$ chaos

The single 324.0 day supplies 256 of the 348, so it dominates both $R$ and $s$. Treated as the whole population, the same week gives $\sigma = \sqrt{348/7} = 7.051$ chaos.

### One bar per day

The 324.0 bar towers over the other six.

```widget
stat-bars
{ "data": "346.0 337.0 324.0 345.0 343.0 343.0 342.0", "tag": "gdev", "title": "Allflame Divine price, 15 to 21 September 2026: squared deviations from 340.0" }
```

## Grouped data

When you only have a frequency table, use class marks $X_i$ and frequencies $f_i$:

$\bar{X} = \frac{\sum f_i X_i}{\sum f_i}$ and $s = \sqrt{\frac{\sum f_i (X_i - \bar{X})^2}{\sum f_i - 1}}$

This is Lab 1 pencil problem 2 (steel rods, $n = 350$): $\bar{X} = 10.02071$ mm, $s = 0.01200781$ mm.

```widget
grouped-mean
{ "rows": [[10.00, 40], [10.01, 75], [10.02, 100], [10.03, 90], [10.04, 45]], "title": "Steel rod diameters (Lab 1, pencil problem 2)" }
```

## Five Allflame days ending on poe.ninja's 204.0 reading

Shift the window: the Allflame Divine prices for 18 to 22 September 2026 are 345.0, 343.0, 343.0, 342.0 and 204.0 chaos [PoE1, 3.29 Allflame, poe.ninja daily Divine price, checked 2026-10-27]. The 204.0 is a one-day drop in poe.ninja's recorded series, between readings of 342.0 and 360.0, not a lasting price change; the formulas still take it as one of the five values.

```quiz
[
  {"q": "Compute $\\bar{X}$. (1 decimal)", "type": "numeric", "answer": 315.4, "tolerance": 0.05, "unit": "chaos", "explain": "$\\sum X = 345.0 + 343.0 + 343.0 + 342.0 + 204.0 = 1577.0$, $n = 5$, $\\bar{X} = 1577.0/5 = 315.4$ chaos."},
  {"q": "Compute $\\sum (X - \\bar{X})^2$. (1 decimal)", "type": "numeric", "answer": 15517.2, "tolerance": 0.05, "explain": "Deviations: $29.6, 27.6, 27.6, 26.6, -111.4$. Squared: $876.16 + 761.76 + 761.76 + 707.56 + 12409.96 = 15517.2$."},
  {"q": "Compute the sample standard deviation $s$. (2 decimals)", "type": "numeric", "answer": 62.28, "tolerance": 0.05, "unit": "chaos", "explain": "$15517.2/(5 - 1) = 3879.3$, $s = \\sqrt{3879.3} = 62.284$ chaos, about eight times the 7.62 of the 15 to 21 September week."},
  {"q": "Treat the five days as the whole population. Compute $\\sigma$. (2 decimals)", "type": "numeric", "answer": 55.71, "tolerance": 0.05, "unit": "chaos", "explain": "Divide by $N = 5$: $15517.2/5 = 3103.44$, $\\sigma = \\sqrt{3103.44} = 55.709$ chaos, smaller than $s$."},
  {"q": "What is the range $R$?", "type": "numeric", "answer": 141, "tolerance": 0, "unit": "chaos", "explain": "$R = 345.0 - 204.0 = 141.0$ chaos. One day moved it from 22.0 to 141.0, since $R$ uses only the two extremes."},
  {"type": "fill", "q": "Fill the blank with the R function that prints $s$.", "code": "___(c(345.0, 343.0, 343.0, 342.0, 204.0))\n## [1] 62.28403", "answer": ["sd"], "explain": "`sd()` always divides by $n - 1$: $\\sqrt{15517.2/4} = 62.28403$."}
]
```

```quiz
[
  {
    "q": "Same data, but treat it as a whole **population**. What is $\\sigma$? (3 decimals)",
    "type": "numeric",
    "answer": 0.875,
    "tolerance": 0.002,
    "explain": "Divide by $N=5$ instead: $\\sqrt{3.832/5} = 0.8754$. Smaller than $s$ — dividing by $n-1$ inflates $s$ slightly on purpose."
  },
  {
    "q": "Why does the sample standard deviation divide by $n-1$ instead of $n$?",
    "options": ["Because samples are always smaller than populations", "So that $s$ is a better approximation of $\\sigma$", "To keep the units the same as $X$", "Because the mean uses one of the values"],
    "answer": 1,
    "explain": "That is the reason stated in the notes. Dividing by $n$ would systematically underestimate $\\sigma$."
  },
  {
    "q": "Which measures of variation depend on **all** the data values? (select all)",
    "options": ["Range $R$", "Standard deviation $s$", "Interquartile range $IQR$", "Population standard deviation $\\sigma$"],
    "answer": [1, 3],
    "explain": "Range uses only max and min; IQR uses only Q1 and Q3. Standard deviation sums over every value."
  },
  {
    "q": "The units of the standard deviation are the square of the units of $X$.",
    "type": "tf",
    "answer": false,
    "explain": "Standard deviation has the **same** units as $X$ (the square root undoes the squaring). Variance $s^2$ is what has squared units."
  },
  {
    "q": "The plywood sample (Lab 1, pencil problem 1) has max 0.754 and min 0.732 inches. What is the range?",
    "type": "numeric",
    "answer": 0.022,
    "tolerance": 0.0005,
    "unit": "in",
    "explain": "$R = 0.754 - 0.732 = 0.022$."
  }
]
```
