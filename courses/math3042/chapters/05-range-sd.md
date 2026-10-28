---
title: Range & standard deviation
minutes: 20
---
<!-- facts: poe1.data.divine-chaos-allflame -->

How far does a Divine Orb's daily price stray in a quiet week, and what does one bad day do to that number?

A **measure of variation** quantifies how spread out the values of $X$ are. Two numbers from the notes: the range (crude) and the standard deviation (the important one).

## Range

$$R = \text{maximum } X - \text{minimum } X$$

Ages 22, 19, 20, 22, 35, 19, 21, 23 (lesson 3):

$$R = 35 - 19 = \mathbf{16} \text{ years}$$

It depends on only **two** values, so one weird data point changes everything.

## Standard deviation

The **typical distance of the $X$ values away from the mean**. Same units as $X$.

Why square? For 5.0, 4.5, 6.0, 7.0, 5.2 (mean 5.54) the plain deviations $X - \bar{X}$ are −0.54, −1.04, +0.46, +1.46, −0.34, and they add to 0. They always do, so their average says nothing.

Squaring makes every term positive; the square root at the end returns to the units of $X$.

| | Formula | Kind |
|---|---|---|
| Sample sd | $s = \sqrt{\frac{\sum (X - \bar{X})^2}{n - 1}}$ | statistic |
| Population sd | $\sigma = \sqrt{\frac{\sum (X - \mu)^2}{N}}$ | parameter |

:::warn Three facts
- Sample $s$ divides by **$n - 1$**, not $n$. Reason given in the notes: this makes $s$ a **better approximation of $\sigma$** ($s^2$ is an *unbiased estimator* of $\sigma^2$).
- $s$ uses the sample mean $\bar{X}$; $\sigma$ uses the population mean $\mu$.
- Standard deviation depends on **all** of the data values — unlike $R$ and $IQR$ (the spread of the middle half, lesson 11).
:::

$s^2$, the value before the square root, is the **variance**; its units are squared, while $s$ and $\sigma$ have the units of $X$.

### s for the lecture sample 5.0, 4.5, 6.0, 7.0, 5.2

Calculate $s$ from the sample $5.0,\ 4.5,\ 6.0,\ 7.0,\ 5.2$ before reading the working below.

```quiz
[
  {
    "q": "For the sample 5.0, 4.5, 6.0, 7.0, 5.2 what is the sample standard deviation $s$? (3 decimals)",
    "type": "numeric",
    "answer": 0.979,
    "tolerance": 0.002,
    "explain": "$\\bar{X}=5.54$ and $\\sum(X-\\bar{X})^2 = 3.832$, so: $$s=\\sqrt{\\dfrac{3.832}{4}}=\\mathbf{0.9788}$$"
  }
]
```

Each part of the formula is linked to its step in the working and its bar in the chart.

$$s = \tag{sqrt}{\sqrt{\tag{frac}{\frac{\tag{dev}{\sum (X - \bar{X})^2}}{\tag{nm1}{n - 1}}}}}$$

1. Mean:
   $$\bar{X} = \dfrac{5.0 + 4.5 + 6.0 + 7.0 + 5.2}{5} = \dfrac{27.7}{5} = 5.54$$
2. Deviations: $-0.54, -1.04, 0.46, 1.46, -0.34$ (sum 0).
3. Squared deviations, added:
   $$\tag{dev-0}{(5.0-5.54)^2} + \tag{dev-1}{(4.5-5.54)^2} + \tag{dev-2}{(6.0-5.54)^2} + \tag{dev-3}{(7.0-5.54)^2} + \tag{dev-4}{(5.2-5.54)^2} = \tag{dev-0}{0.2916} + \tag{dev-1}{1.0816} + \tag{dev-2}{0.2116} + \tag{dev-3}{2.1316} + \tag{dev-4}{0.1156} = \tag{dev}{3.832}$$
4. Divide by {{nm1}}$n - 1 = 4${{/nm1}}:
   $$\tag{frac}{\dfrac{3.832}{4} = 0.958}$$
5. Square root:
   $$\tag{sqrt}{s = \sqrt{0.958} = \mathbf{0.9788}}$$

```widget
stat-bars
{ "data": "5.0 4.5 6.0 7.0 5.2", "tag": "dev", "title": "Each bar is one squared deviation from the mean" }
```

In R: `sd(c(5.0, 4.5, 6.0, 7.0, 5.2))` → `0.9788`.

R's `sd` **always** computes the sample version with $n-1$.

:::info R syntax
| Code | What it does |
|---|---|
| `c(5.0, 4.5, 6.0, 7.0, 5.2)` | `c()` combines the five values, separated by commas, into one vector. |
| `sd(…)` | The sample standard deviation of the vector, dividing by n − 1. |

**Left to right**

- `sd(c(5.0, 4.5, 6.0, 7.0, 5.2))`: "The sample standard deviation (`sd`) of the combined values (`c`) 5.0, 4.5, 6.0, 7.0 and 5.2 (`5.0, 4.5, 6.0, 7.0, 5.2`)."

**Right to left**, the order R runs it

- `sd(c(5.0, 4.5, 6.0, 7.0, 5.2))`: "Take the five values (`5.0, 4.5, 6.0, 7.0, 5.2`), combine them into one vector (`c`), and compute its sample standard deviation (`sd`)."
:::

:::tip Reading s on the calculator
In STAT mode, read $\bar{x}$, $s$ (often labelled $s_x$ or $\sigma_{n-1}$) and $\sigma$ (labelled $\sigma_n$).
:::

## Seven days of Allflame Divine prices, by hand

poe.ninja's daily price of a Divine Orb, PoE1's high-value currency, in chaos orbs for 15 to 21 September 2026 reads 346.0, 337.0, 324.0, 345.0, 343.0, 343.0 and 342.0 chaos.

A trader holding Divines that week wants to know how far a typical day strayed from the week's level, which is what $s$ measures, in chaos.

```quiz
[
  {"q": "What is the range $R$ of the seven prices?", "type": "numeric", "answer": 22, "tolerance": 0, "unit": "chaos", "explain": "$$R = 346.0 - 324.0 = \\mathbf{22.0} \\text{ chaos}$$"},
  {"q": "Compute the sample standard deviation $s$ of the seven prices before reading the working. (3 significant digits)", "type": "numeric", "answer": 7.62, "tolerance": 0.005, "unit": "chaos", "explain": "Mean: $$\\bar{X} = \\dfrac{2380.0}{7} = 340.0$$ Deviations $6, -3, -16, 5, 3, 3, 2$; squares: $$36 + 9 + 256 + 25 + 9 + 9 + 4 = 348$$ Then: $$s = \\sqrt{\\dfrac{348}{6}} = \\sqrt{58} = \\mathbf{7.6158} \\text{ chaos}$$"}
]
```

1. Range:
   $$R = 346.0 - 324.0 = \mathbf{22.0} \text{ chaos}$$
2. Mean:
   $$\bar{X} = \dfrac{346.0 + 337.0 + 324.0 + 345.0 + 343.0 + 343.0 + 342.0}{7} = \dfrac{2380.0}{7} = 340.0$$
3. Deviations: $6, -3, -16, 5, 3, 3, 2$; squared and added:
   $$36 + 9 + 256 + 25 + 9 + 9 + 4 = 348$$
4. Divide by $n - 1 = 6$:
   $$\dfrac{348}{6} = 58$$
5. Square root:
   $$s = \sqrt{58} = 7.6158 \approx \mathbf{7.62} \text{ chaos}$$

The single 324.0 day supplies 256 of the 348, so it dominates both $R$ and $s$.

Treated as the whole population, the same week gives:

$$\sigma = \sqrt{\dfrac{348}{7}} = \mathbf{7.051} \text{ chaos}$$

:::tip s or σ?
If the data are some of the group (the usual case, and any question that says "sample"), use $s$ with $n - 1$. R's `sd()` and the calculator's $s_x$ give this.

Use $\sigma$ with $N$ only when the question says the data are the whole population.
:::

### One bar per day

The 324.0 bar towers over the other six.

```widget
stat-bars
{ "data": "346.0 337.0 324.0 345.0 343.0 343.0 342.0", "tag": "gdev", "title": "Allflame Divine price, 15 to 21 September 2026: squared deviations from 340.0" }
```

## Grouped data

When you only have a frequency table, use class marks $X_i$ and frequencies $f_i$:

$$\bar{X} = \frac{\sum f_i X_i}{\sum f_i} \qquad s = \sqrt{\frac{\sum f_i (X_i - \bar{X})^2}{\sum f_i - 1}}$$

This is Lab 1 pencil problem 2 (steel rods, $n = 350$). Lesson 3 found $\bar{X} = 10.02071$ mm.

Each row of the table below takes one class mark's distance from that mean, squares it, then counts it $f_i$ times:

| $X_i$ | $f_i$ | $X_i - \bar{X}$ | $(X_i - \bar{X})^2$ | $f_i(X_i - \bar{X})^2$ |
|---|---|---|---|---|
| 10.00 | 40 | −0.02071 | 0.00042908 | 0.0171633 |
| 10.01 | 75 | −0.01071 | 0.00011480 | 0.0086097 |
| 10.02 | 100 | −0.00071 | 0.00000051 | 0.0000510 |
| 10.03 | 90 | 0.00929 | 0.00008622 | 0.0077602 |
| 10.04 | 45 | 0.01929 | 0.00037194 | 0.0167372 |
| | **350** | | | **Σ = 0.0503214** |

Divide the total by $\sum f_i - 1 = 349$ and take the root:

$$s = \sqrt{\dfrac{0.0503214}{349}} = \sqrt{0.000144187} = \mathbf{0.012008} \text{ mm}$$

$\sum f_i - 1 = 349$ is just $n - 1$, because $\sum f_i = n$.

Check: 0.012 mm is about one 0.01 mm step between class marks, a sensible typical distance.

```widget
grouped-mean
{ "rows": [[10.00, 40], [10.01, 75], [10.02, 100], [10.03, 90], [10.04, 45]], "title": "Steel rod diameters (Lab 1, pencil problem 2)" }
```

## Five Allflame days ending on poe.ninja's 204.0 reading

Shift the window: the Allflame Divine prices for 18 to 22 September 2026 are 345.0, 343.0, 343.0, 342.0 and 204.0 chaos.

The 204.0 is a one-day drop in poe.ninja's recorded series, between readings of 342.0 and 360.0, not a lasting price change; the formulas still take it as one of the five values.

```quiz
[
  {"q": "Compute $\\bar{X}$. (1 decimal)", "type": "numeric", "answer": 315.4, "tolerance": 0.05, "unit": "chaos", "explain": "Sum: $$\\sum X = 345.0 + 343.0 + 343.0 + 342.0 + 204.0 = 1577.0$$ With $n = 5$: $$\\bar{X} = \\dfrac{1577.0}{5} = \\mathbf{315.4} \\text{ chaos}$$"},
  {"q": "Compute $\\sum (X - \\bar{X})^2$. (1 decimal)", "type": "numeric", "answer": 15517.2, "tolerance": 0.05, "explain": "Deviations: $29.6, 27.6, 27.6, 26.6, -111.4$. Squared and added: $$876.16 + 761.76 + 761.76 + 707.56 + 12409.96 = \\mathbf{15517.2}$$"},
  {"q": "Compute the sample standard deviation $s$. (2 decimals)", "type": "numeric", "answer": 62.28, "tolerance": 0.05, "unit": "chaos", "explain": "$$s = \\sqrt{\\dfrac{15517.2}{5 - 1}} = \\sqrt{3879.3} = \\mathbf{62.284} \\text{ chaos}$$ About eight times the 7.62 of the 15 to 21 September week."},
  {"q": "Treat the five days as the whole population. Compute $\\sigma$. (2 decimals)", "type": "numeric", "answer": 55.71, "tolerance": 0.05, "unit": "chaos", "explain": "Divide by $N = 5$: $$\\sigma = \\sqrt{\\dfrac{15517.2}{5}} = \\sqrt{3103.44} = \\mathbf{55.709} \\text{ chaos}$$ Smaller than $s$."},
  {"q": "What is the range $R$?", "type": "numeric", "answer": 141, "tolerance": 0, "unit": "chaos", "explain": "$$R = 345.0 - 204.0 = \\mathbf{141.0} \\text{ chaos}$$ One day moved it from 22.0 to 141.0, since $R$ uses only the two extremes."},
  {"type": "fill", "q": "Fill the blank with the R function that prints $s$.", "code": "___(c(345.0, 343.0, 343.0, 342.0, 204.0))\n## [1] 62.28403", "answer": ["sd"], "explain": "`sd()` always divides by $n - 1$: $$\\sqrt{\\dfrac{15517.2}{4}} = 62.28403$$"}
]
```

```quiz
[
  {
    "q": "The lecture sample 5.0, 4.5, 6.0, 7.0, 5.2 ($\\sum(X - \\bar{X})^2 = 3.832$), treated as a whole **population**: what is $\\sigma$? (3 decimals)",
    "type": "numeric",
    "answer": 0.875,
    "tolerance": 0.002,
    "explain": "Divide by $N=5$ instead: $$\\sigma = \\sqrt{\\dfrac{3.832}{5}} = \\mathbf{0.8754}$$ Smaller than $s$ — dividing by $n-1$ inflates $s$ slightly on purpose."
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
    "explain": "$$R = 0.754 - 0.732 = \\mathbf{0.022} \\text{ in}$$"
  }
]
```
