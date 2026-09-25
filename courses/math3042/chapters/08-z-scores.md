---
title: Z-scores & unusual values
minutes: 16
---

The empirical rule tells you percentages for whole bands ($\mu \pm \sigma$, $\mu \pm 2\sigma$, ...). A **Z-score** tells you the same thing for a single, specific value: it converts $X$ into "how many standard deviations from the mean."

## The formula

$$Z = \frac{X - \mu}{\sigma}$$

That's the population version; for a sample use $Z = \dfrac{X - \bar{X}}{s}$ instead — same idea, matched to the data you have.

**"Z = how many standard deviations something is from the mean."** $Z$ has no units, so it works the same whether $X$ is in cm, kg, or IQ points.

- $Z > 0$: $X$ is above the mean.
- $Z < 0$: $X$ is below the mean.
- $Z = 0$: $X$ equals the mean exactly.

## Worked example: women's heights

Women's heights: $\mu = 164.7$ cm, $\sigma = 7.1$ cm.

$X = 175$: $Z = \frac{175 - 164.7}{7.1} = \frac{10.3}{7.1} = \mathbf{1.45}$

$X = 178.9$: $Z = \frac{178.9 - 164.7}{7.1} = \frac{14.2}{7.1} = \mathbf{2.0}$

$X = 155$ (below the mean): $Z = \frac{155 - 164.7}{7.1} = \frac{-9.7}{7.1} = \mathbf{-1.37}$; a negative $Z$ means the value sits below the mean.

$Z = 2.0$ lands exactly on an empirical-rule boundary: 95% of the data sits inside $\mu \pm 2\sigma$, with a 2.5% tail on each side, so the percentage of women **below** 178.9 cm is $2.5\% + 95\% = \mathbf{97.5\%}$.

```widget
normal-curve
{ "mu": 164.7, "sigma": 7.1, "x": 178.9, "title": "Women's height — Z = 2.0" }
```

## Going backwards: Z to X

Rearrange the formula to find the raw value that corresponds to a given Z-score:

$X = \mu + Z\sigma$ (population) or $X = \bar{X} + Zs$ (sample)

On an IQ test ($\mu = 100$, $\sigma = 15$), what score has $Z = 3.2$?

$X = 100 + 3.2 \times 15 = 100 + 48 = \mathbf{148}$

## The empirical rule, restated in Z

Because $Z$ measures distance from the mean in units of $\sigma$, the empirical rule bands are the same bands, relabelled:

| Z range | % of data |
|---|---|
| $-1 < Z < 1$ | 68% |
| $-2 < Z < 2$ | 95% |
| $-3 < Z < 3$ | 99.7% |

## Unusual values

**Unusual: $Z < -2$ or $Z > +2$.** Since 95% of values sit inside $-2 < Z < 2$, the remaining 5% (split into two 2.5% tails) is "unusual" — not impossible, just rare.

:::quiz Outlier ≠ Unusual
**"Outlier ≠ Unusual."** Two different rules that usually, but not always, agree:
- **Unusual** uses the Z-score: $Z < -2$ or $Z > +2$.
- **Outlier** uses the IQR fence rule: below $Q_1 - 1.5 \times IQR$ or above $Q_3 + 1.5 \times IQR$.
:::

### Worked example: LeBron James

Men's heights: $\mu = 178.4$ cm, $\sigma = 7.6$ cm. LeBron James is 203 cm tall.

$Z = \frac{203 - 178.4}{7.6} = \frac{24.6}{7.6} = \mathbf{3.24}$

$3.24 > 2$, so LeBron's height **is unusual**: a rare value, not a mistake.

The cutoffs for "unusual" male heights are $\mu \pm 2\sigma$: below $178.4 - 15.2 = \mathbf{163.2}$ cm or above $178.4 + 15.2 = \mathbf{193.6}$ cm.

```widget
normal-curve
{ "mu": 178.4, "sigma": 7.6, "x": 203, "title": "Men's height — LeBron at Z = 3.24" }
```

## Z and the percentage below on the curve

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 130 }
```

## Pencil problem: body temperature

$\mu = 98.20$, $\sigma = 0.62$. The "usual" range is $\mu \pm 2\sigma = 98.20 \pm 1.24$, i.e. **96.96 to 99.44**.

- $101.00$: well above 99.44 → **unusual**.
- $96.90$: below 96.96 → **unusual**.
- $96.98$: inside 96.96–99.44 → **usual** (just barely).

```quiz
[
  {
    "q": "Women's heights have $\\mu = 164.7$, $\\sigma = 7.1$. What is the Z-score for $X = 175$? (2 decimals)",
    "type": "numeric",
    "answer": 1.45,
    "tolerance": 0.02,
    "explain": "$Z = (175 - 164.7)/7.1 = 10.3/7.1 = 1.45$."
  },
  {
    "q": "Same population. What percentage of women are shorter than 178.9 cm?",
    "type": "numeric",
    "answer": 97.5,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "$Z = 2.0$ exactly, so below is $95\\% + 2.5\\%$ (half the middle band plus the lower tail) $= 97.5\\%$."
  },
  {
    "q": "IQ is $\\mu = 100$, $\\sigma = 15$. What IQ score corresponds to $Z = 3.2$?",
    "type": "numeric",
    "answer": 148,
    "tolerance": 1,
    "explain": "$X = \\mu + Z\\sigma = 100 + 3.2(15) = 148$."
  },
  {
    "q": "A Z-score is considered unusual when it is less than $-2$ or greater than $+2$.",
    "type": "tf",
    "answer": true,
    "explain": "That range covers about 95% of values (empirical rule); the remaining ~5% in the two tails is labelled unusual."
  },
  {
    "q": "Roughly what percentage of individuals in a normal population are 'unusual' ($|Z| > 2$)?",
    "options": ["0.3%", "2.5%", "5%", "32%"],
    "answer": 2,
    "explain": "95% fall inside $-2 < Z < 2$, leaving about 5% outside (2.5% in each tail)."
  },
  {
    "q": "An outlier (by the IQR fence rule) and an 'unusual' value (by Z-score) are computed the same way and always agree.",
    "type": "tf",
    "answer": false,
    "explain": "Outlier ≠ Unusual: outlier uses $Q_1/Q_3$ and $1.5 \\times IQR$; unusual uses $Z$ and $\\pm 2\\sigma$. They often agree but are different definitions."
  },
  {
    "q": "Men's heights: $\\mu = 178.4$, $\\sigma = 7.6$. LeBron James is 203 cm. What is his Z-score? (2 decimals)",
    "type": "numeric",
    "answer": 3.24,
    "tolerance": 0.02,
    "explain": "$Z = (203 - 178.4)/7.6 = 24.6/7.6 = 3.24$."
  },
  {
    "q": "Body temperatures: $\\mu = 98.20$, $\\sigma = 0.62$. Is $96.98°$ usual or unusual?",
    "options": ["Usual", "Unusual", "Cannot tell without more data", "It is an outlier but not unusual"],
    "answer": 0,
    "explain": "Usual range is $\\mu \\pm 2\\sigma = 96.96$ to $99.44$. $96.98$ falls just inside it, so it is usual."
  },
  {
    "q": "Body temperatures: $\\mu = 98.20$, $\\sigma = 0.62$. What is the lower cutoff for a 'usual' temperature? (2 decimals)",
    "type": "numeric",
    "answer": 96.96,
    "tolerance": 0.01,
    "explain": "$\\mu - 2\\sigma = 98.20 - 1.24 = 96.96$."
  },
  {
    "q": "The Z-score formula for a sample uses $\\bar{X}$ and $s$; the population version uses $\\mu$ and $\\sigma$.",
    "type": "tf",
    "answer": true,
    "explain": "$Z = (X - \\bar{X})/s$ for a sample, $Z = (X - \\mu)/\\sigma$ for a population — same idea, matched to the data you have."
  },
  {"type": "shade", "q": "Women's heights are normal with $\\mu=164.7$ cm, $\\sigma=7.1$ cm. Shade the region below $X = 178.9$ cm ($Z = 2$).", "mu": 164.7, "sigma": 7.1, "answer": 97.5, "tolerance": 1, "region": "below", "hi": 2, "explain": "$Z=2$, so shade to $+2\\sigma$: 50% below the mean plus 47.5% between the mean and $+2\\sigma$ = 97.5%."}
]
```