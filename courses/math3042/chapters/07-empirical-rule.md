---
title: 68–95–99.7 rule
minutes: 15
---

If $X$ follows a **normal distribution**, you don't need to integrate anything to know roughly what fraction of values fall near the mean. The **empirical rule** gives you three fixed percentages, built entirely from $\mu$ and $\sigma$ (or $\bar{X}$ and $s$ for a sample).

## The three bands

| Interval | % of values | Exact figure |
|---|---|---|
| $\mu \pm \sigma$ | 68% | 68.27% |
| $\mu \pm 2\sigma$ | 95% | 95.45% |
| $\mu \pm 3\sigma$ | 99.7% | 99.73% |

The rounded numbers (68, 95, 99.7) are what the notes use everywhere; the exact figures in the right column are what you'd get from the true normal curve if you needed extra precision. Each band is centered on the mean and grows by one more standard deviation on each side.

:::quiz Quiz note
The empirical rule **only applies to variables that are (approximately) normally distributed**. Chebyshev's theorem (next lesson) is the one that works for *any* distribution, but its bounds are weaker. If a quiz question doesn't say "normal" or show a bell curve, don't reach for 68-95-99.7.
:::

## Worked example: IQ scores

IQ scores are normal with $\mu = 100$, $\sigma = 15$.

- 68% of people score between $100 - 15 = 85$ and $100 + 15 = 115$
- 95% of people score between $100 - 30 = 70$ and $100 + 30 = 130$
- 99.7% of people score between $100 - 45 = 55$ and $100 + 45 = 145$

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 130, "presets": { "IQ score": [100, 15, 130] } }
```

Drag the shading mode to **"Shade ±2σ"** on the widget above. It highlights the 70–130 interval and shows the 95% figure directly on the curve — that's the same number you just computed by hand as $\mu \pm 2\sigma$.

## Reading the tails

Because the normal curve is symmetric, you can split each band's *leftover* probability evenly between the two tails.

- Outside $\mu \pm 2\sigma$ is $100\% - 95\% = 5\%$ total, split into **2.5% in each tail** (below $\mu - 2\sigma$ and above $\mu + 2\sigma$).
- Between $\mu$ and $\mu + \sigma$ is **half** of the 68% band: $68\%/2 = 34\%$.
- Below $\mu - \sigma$ is the lower half (50%) minus that same 34% slice: $50\% - 34\% = 16\%$.
- Below $\mu + \sigma$ is the lower half (50%) plus that 34% slice: $50\% + 34\% = 84\%$.
- Above $\mu + 3\sigma$ is half of the leftover $0.3\%$: $0.3\%/2 = 0.15\%$.

::: tip Building any percentage from the three bands
Every empirical-rule question on the quiz is just adding and subtracting slices of 68/95/99.7, using the fact that the curve is symmetric about $\mu$. Sketch the curve, mark $\mu-3\sigma \ldots \mu+3\sigma$, and label each slice: 0.15, 2.35, 13.5, 34, 34, 13.5, 2.35, 0.15 (those eight slices sum to 100%).
:::

## Lab 1 pencil problem 5: moisture content

Moisture content is normal with $\mu = 18$, $\sigma = 0.5$.

- **(b)** Between 17 and 19 ($\mu \pm 2\sigma$, since $2 \times 0.5 = 1$): **95%**
- **(c)** Above 19.5 ($\mu + 3\sigma$, since $3 \times 0.5 = 1.5$): the whole upper tail beyond $3\sigma$ is $0.3\% / 2 =$ **0.15%**
- **(d)** Between 18 and 18.5 ($\mu$ to $\mu + \sigma$): half of 68% = **34%**
- **(e)** Below 19 ($\mu + 2\sigma$): everything up to the mean (50%) plus the slice from $\mu$ to $\mu+2\sigma$ (half of 95% = 47.5%) = **97.5%**

```widget
normal-curve
{ "mu": 18, "sigma": 0.5, "x": 19, "presets": { "Moisture (b)/(e): X=19": [18, 0.5, 19], "Moisture (c): X=19.5": [18, 0.5, 19.5], "Moisture (d): X=18.5": [18, 0.5, 18.5] } }
```

## Lab 1 pencil problem 3c: gold prices

Ten days of gold prices: mean $6280.683$, $s = 139.7298$. The $\pm 3s$ interval is

$6280.683 - 3(139.7298) = 5861.493$ to $6280.683 + 3(139.7298) = 6699.873$

By the empirical rule, 99.7% of values (assuming approximate normality) fall inside that interval, so the chance of a value falling **outside** $\pm 3s$ is $100\% - 99.7\% = 0.3\%$.

```quiz
[
  {
    "q": "For a normal distribution, what percentage of values fall within $\\mu \\pm 2\\sigma$?",
    "options": ["68%", "95%", "99.7%", "50%"],
    "answer": 1,
    "explain": "The empirical rule: $\\mu\\pm\\sigma \\to 68\\%$, $\\mu\\pm2\\sigma \\to 95\\%$, $\\mu\\pm3\\sigma \\to 99.7\\%$."
  },
  {
    "q": "The empirical rule (68-95-99.7) applies to any distribution, regardless of shape.",
    "type": "tf",
    "answer": false,
    "explain": "It only applies to (approximately) normal distributions. Chebyshev's theorem is the one that works for any distribution, but with weaker bounds."
  },
  {
    "q": "IQ scores are normal with $\\mu=100$, $\\sigma=15$. What interval contains 95% of scores?",
    "options": ["85 to 115", "70 to 130", "55 to 145", "77.5 to 122.5"],
    "answer": 1,
    "explain": "95% corresponds to $\\mu \\pm 2\\sigma = 100 \\pm 30$, i.e. 70 to 130."
  },
  {
    "q": "For a normal distribution, what percentage lies outside $\\mu \\pm 2\\sigma$ in the single upper tail (above $\\mu+2\\sigma$)?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "Outside $\\pm2\\sigma$ total is $100-95=5\\%$; the curve is symmetric so each tail gets half: $5\\%/2 = 2.5\\%$."
  },
  {
    "q": "What percentage of a normal distribution lies between $\\mu$ and $\\mu+\\sigma$ (not the full $\\mu\\pm\\sigma$ band)?",
    "type": "numeric",
    "answer": 34,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "The full $\\mu\\pm\\sigma$ band is 68%; by symmetry each half (mean to $+\\sigma$, and mean to $-\\sigma$) is $68\\%/2=34\\%$."
  },
  {
    "q": "Moisture content is normal with $\\mu=18$, $\\sigma=0.5$. What percentage of readings fall above 19.5?",
    "type": "numeric",
    "answer": 0.15,
    "tolerance": 0.02,
    "unit": "%",
    "explain": "19.5 is $\\mu+3\\sigma$ ($18+3(0.5)=19.5$). Beyond $\\pm3\\sigma$ is $100-99.7=0.3\\%$ total, split into $0.15\\%$ per tail."
  },
  {
    "q": "Same moisture distribution ($\\mu=18$, $\\sigma=0.5$). What percentage of readings fall below 19?",
    "type": "numeric",
    "answer": 97.5,
    "tolerance": 0.2,
    "unit": "%",
    "explain": "19 is $\\mu+2\\sigma$. Below the mean is 50%, plus the slice from $\\mu$ to $\\mu+2\\sigma$ (half of 95% = 47.5%), giving $50+47.5=97.5\\%$."
  },
  {
    "q": "Same moisture distribution. What percentage of readings fall between 18 and 18.5?",
    "type": "numeric",
    "answer": 34,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "18.5 is $\\mu+\\sigma$ ($18+0.5$). Between $\\mu$ and $\\mu+\\sigma$ is half of the 68% band = 34%."
  },
  {
    "q": "Gold prices: mean 6280.683, $s=139.7298$. What is the upper bound of the $\\mu \\pm 3s$ interval?",
    "type": "numeric",
    "answer": 6699.873,
    "tolerance": 0.5,
    "explain": "$6280.683 + 3(139.7298) = 6699.873$."
  },
  {
    "q": "For that gold price data, what is the chance a value falls outside the $\\pm 3s$ interval, assuming approximate normality?",
    "type": "numeric",
    "answer": 0.3,
    "tolerance": 0.02,
    "unit": "%",
    "explain": "99.7% falls inside $\\mu\\pm3\\sigma$, so $100\\%-99.7\\%=0.3\\%$ falls outside."
  },
  {"type": "shade", "q": "Shade the region that holds about **95%** of a normal distribution ($\\mu=18$, $\\sigma=0.5$ moisture content).", "mu": 18, "sigma": 0.5, "answer": 95, "lo": -2, "hi": 2, "explain": "$\\mu\\pm2\\sigma$ is 17 to 19, which holds 95% (exactly 95.45%). Drag the handles to $-2\\sigma$ and $+2\\sigma$."},
  {"type": "shade", "q": "Shade everything **below** $\\mu+\\sigma$. What percentage is that?", "mu": 18, "sigma": 0.5, "answer": 84, "tolerance": 1, "region": "below", "hi": 1, "explain": "50% sits below the mean, plus half of the 68% band = 34%, so 84%."},
  {"type": "shade", "q": "Shade everything **above** $\\mu+3\\sigma$ (above 19.5%).", "mu": 18, "sigma": 0.5, "answer": 0.15, "tolerance": 0.1, "region": "above", "lo": 3, "explain": "99.7% is inside $\\pm3\\sigma$, leaving 0.3% split between two tails: 0.15% each."}
]
```