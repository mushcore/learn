---
title: Range & standard deviation
minutes: 18
---

A **measure of variation** quantifies how spread out the values of $X$ are. Two numbers from the notes: the range (crude) and the standard deviation (the important one).

## Range

$R = \text{maximum } X - \text{minimum } X$

Instructor's example: ages in the classroom, $R = 35 - 18 = 17$ years. Easy, but it depends on only **two** values — one weird data point changes everything.

## Standard deviation

The **typical distance of the $X$ values away from the mean**. Same units as $X$.

| | Formula | Kind |
|---|---|---|
| Sample sd | $s = \sqrt{\frac{\sum (X - \bar{X})^2}{n - 1}}$ | statistic |
| Population sd | $\sigma = \sqrt{\frac{\sum (X - \mu)^2}{N}}$ | parameter |

:::warn Four facts
- Sample $s$ divides by **$n - 1$**, not $n$. Reason given in the notes: this makes $s$ a **better approximation of $\sigma$** (the instructor added: $s^2$ is an *unbiased estimator* of $\sigma^2$).
- $s$ uses the sample mean $\bar{X}$; $\sigma$ uses the population mean $\mu$.
- The **units of $s$ and $\sigma$ are the same as the units of $X$** (unlike variance, which is squared).
- Standard deviation depends on **all** of the data values — unlike $R$ and $IQR$.
:::

### Worked example from the lecture

Calculate $s$ from the sample $5.0,\ 4.5,\ 6.0,\ 7.0,\ 5.2$. Hover any part of the formula to see where it shows up in the working, and any bar in the chart to see its deviation.

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

In R: `sd(c(5.0, 4.5, 6.0, 7.0, 5.2))` → `0.9788`. (R's `sd` **always** computes the sample version with $n-1$.)

:::tip Calculator
Put your calculator in STAT mode, enter the data, and read $\bar{x}$, $s$ (often labelled $s_x$ or $\sigma_{n-1}$) and $\sigma$ (labelled $\sigma_n$). Know which key is which before the quiz.
:::

## Calculator

Paste any data set. It shows the sorted values, every statistic from this unit, and the worked $s$ computation.

```widget
stat-calc
{ "data": "5.0 4.5 6.0 7.0 5.2" }
```

## Grouped data

When you only have a frequency table, use class marks $X_i$ and frequencies $f_i$:

$\bar{X} = \frac{\sum f_i X_i}{\sum f_i}$ and $s = \sqrt{\frac{\sum f_i (X_i - \bar{X})^2}{\sum f_i - 1}}$

This is Lab 1 pencil problem 2 (steel rods, $n = 350$): $\bar{X} = 10.02071$ mm, $s = 0.01200781$ mm.

```widget
grouped-mean
{ "rows": [[10.00, 40], [10.01, 75], [10.02, 100], [10.03, 90], [10.04, 45]], "title": "Steel rod diameters (Lab 1, pencil problem 2)" }
```

```quiz
[
  {
    "q": "For the sample 5.0, 4.5, 6.0, 7.0, 5.2 what is the sample standard deviation $s$? (3 decimals)",
    "type": "numeric",
    "answer": 0.979,
    "tolerance": 0.002,
    "explain": "$\\bar{X}=5.54$, $\\sum(X-\\bar{X})^2 = 3.832$, $s=\\sqrt{3.832/4}=0.9788$."
  },
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
