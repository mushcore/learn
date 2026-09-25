---
title: Linear correlation r
minutes: 15
---

So far every measure has described a single variable. Very often two numerical variables are measured on the same individual — height and weight, study hours and exam score, resistance and failure time. **Correlation** measures how strongly two variables move together, and specifically how strongly they move together in a **straight line**.

## Pearson's correlation coefficient

$r = \dfrac{n(\sum xy) - (\sum x)(\sum y)}{\sqrt{n(\sum x^2) - (\sum x)^2} \cdot \sqrt{n(\sum y^2) - (\sum y)^2}}$

Every piece is a plain sum you can get from a table: $\sum x$, $\sum y$, $\sum xy$, $\sum x^2$, $\sum y^2$, and $n$ pairs. In R it collapses to one call:

```r
r <- cor(X, Y)
```

$r$ is the **sample** statistic. The **population** version is written $\rho$ (rho) — same idea, different symbol, because you rarely have the whole population.

## Worked example: resistance and failure time

The electric-circuit data: $n = 12$ components, $x$ = resistance, $y$ = time to failure.

| x | y | xy | x² | y² |
|---|---|---|---|---|
| 43 | 32 | 1376 | 1849 | 1024 |
| 29 | 20 | 580 | 841 | 400 |
| 44 | 45 | 1980 | 1936 | 2025 |
| 33 | 35 | 1155 | 1089 | 1225 |
| 33 | 22 | 726 | 1089 | 484 |
| 47 | 46 | 2162 | 2209 | 2116 |
| 34 | 28 | 952 | 1156 | 784 |
| 31 | 26 | 806 | 961 | 676 |
| 48 | 37 | 1776 | 2304 | 1369 |
| 34 | 33 | 1122 | 1156 | 1089 |
| 46 | 47 | 2162 | 2116 | 2209 |
| 37 | 30 | 1110 | 1369 | 900 |
| **Σ = 459** | **Σ = 401** | **Σ = 15907** | **Σ = 18075** | **Σ = 14301** |

Plug the column totals straight into the formula:

$r = \dfrac{12(15907) - (459)(401)}{\sqrt{12(18075) - 459^2} \cdot \sqrt{12(14301) - 401^2}}$

$= \dfrac{190884 - 184059}{\sqrt{216900 - 210681} \cdot \sqrt{171612 - 160801}} = \dfrac{6825}{\sqrt{6219} \cdot \sqrt{10811}} = \dfrac{6825}{78.86 \times 103.98} \approx \mathbf{0.8324}$

$r = 0.8324$ is close to 1, so resistance and failure time have a **strong positive linear correlation**: higher resistance tends to go with a longer time to failure.

## Properties of r

- $-1 \le r \le 1$ always.
- $r$ does **not** change if $X$ or $Y$ are converted to different units (cm to inches, dollars to cents — same $r$).
- Swapping which variable is $X$ and which is $Y$ does **not** change $r$.
- $r$ only measures **linear** association. Two variables can be strongly, perfectly related in a curved (non-linear) way and still have $r \approx 0$.
- $r$ is the sample statistic; $\rho$ is the corresponding population parameter.

| Value of r | Interpretation |
|---|---|
| $r = 1$ | Perfect positive linear correlation |
| close to 1 (e.g. 0.8–0.99) | Strong positive linear correlation |
| $r \approx 0$ | No linear correlation |
| close to $-1$ (e.g. $-0.8$ to $-0.99$) | Strong negative linear correlation |
| $r = -1$ | Perfect negative linear correlation |

## Drag the points

```widget
scatter-corr
{ "title": "Linear correlation r — drag the points or pick a preset" }
```

The **"Curved (r≈0 but related!)"** preset traces a perfect parabola ($y = x^2$): $y$ is completely determined by $x$, yet $r$ comes out near 0, because the relationship is curved, not linear. "No linear correlation" is the correct phrase; "no relationship at all" is not.

## Correlation does not imply causation

Even a strong $r$ never tells you that one variable *causes* the other. Ice cream consumption and boating accidents are positively correlated across the months of the year, but eating ice cream does not cause boating accidents: both rise and fall with a hidden third factor (warm weather, more people out on boats and buying ice cream). Always ask whether a third variable could explain a correlation before claiming causation.

```quiz
[
  {
    "q": "For x = {1,2,3,4,5}, y = {2,4,5,4,5}, compute r (4 decimals).",
    "type": "numeric",
    "answer": 0.7746,
    "tolerance": 0.005,
    "explain": "n=5, Σx=15, Σy=20, Σxy=66, Σx²=55, Σy²=86. Numerator = 5(66)-15(20) = 330-300 = 30. Denominator = √(5(55)-15²)·√(5(86)-20²) = √(275-225)·√(430-400) = √50·√30 ≈ 7.0711×5.4772 ≈ 38.730. r = 30/38.730 ≈ 0.7746."
  },
  {
    "q": "In the circuit data, Σx = 459, Σy = 401, Σxy = 15907, Σx² = 18075, Σy² = 14301, n = 12. Compute r (4 decimals).",
    "type": "numeric",
    "answer": 0.8324,
    "tolerance": 0.005,
    "explain": "Numerator = 12(15907)-(459)(401) = 190884-184059 = 6825. Denominator = √(12(18075)-459²)·√(12(14301)-401²) = √6219·√10811 ≈ 78.86×103.98 ≈ 8199.6. r = 6825/8199.6 ≈ 0.8324."
  },
  {
    "q": "The circuit example (r = 0.8324) shows:",
    "options": ["A strong negative linear correlation", "No linear correlation", "A strong positive linear correlation", "A perfect linear correlation"],
    "answer": 2,
    "explain": "r = 0.8324 is close to 1 (positive), so it indicates a strong positive linear correlation, not a perfect one (which would require r = 1)."
  },
  {
    "q": "If X is converted from cm to inches, r between X and Y changes.",
    "type": "tf",
    "answer": false,
    "explain": "r is unit-free — changing units on either variable does not change r."
  },
  {
    "q": "Swapping which variable is labeled X and which is labeled Y changes the value of r.",
    "type": "tf",
    "answer": false,
    "explain": "r is symmetric in X and Y; swapping them gives the same r."
  },
  {
    "q": "A data set follows a perfect parabola $y = x^2$ over a symmetric range of x. What will Pearson's r be close to?",
    "options": ["1", "-1", "0", "0.5"],
    "answer": 2,
    "explain": "r only detects linear relationships. A symmetric parabola has no consistent linear trend, so r is close to 0 even though y is completely determined by x."
  },
  {
    "q": "Ice cream sales and boating accidents are positively correlated across the year. This proves ice cream causes boating accidents.",
    "type": "tf",
    "answer": false,
    "explain": "Correlation does not imply causation. Both variables likely rise and fall with a third factor: warm weather."
  },
  {
    "q": "Which symbol denotes the population correlation coefficient (as opposed to the sample statistic r)?",
    "options": ["$\\sigma$", "$\\mu$", "$\\rho$", "$\\bar{X}$"],
    "answer": 2,
    "explain": "r is the sample statistic; the population parameter is denoted $\\rho$ (rho)."
  },
  {
    "q": "A value of r = -0.95 indicates:",
    "options": ["Strong positive linear correlation", "No linear correlation", "Strong negative linear correlation", "An error, since r cannot be negative"],
    "answer": 2,
    "explain": "r close to -1 means a strong negative linear correlation: as one variable increases, the other tends to decrease."
  }
]
```
