---
title: Z-scores & unusual values
minutes: 20
---
<!-- facts: gms.data.ranking-level-hero-2026-10-27, poe1.data.divine-chaos-allflame -->

Is a level-300 Hero unusual among the top 500, or a Divine Orb price unusual for its month? A **Z-score** answers for a single, specific value: it converts $X$ into "how many standard deviations from the mean," the per-value version of the empirical rule's bands.

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

### Standardizing 178.9 cm into Z = 2.0

Subtracting $\mu = 164.7$ slides the whole curve left until its centre sits at 0; dividing by $\sigma = 7.1$ then squeezes it into the standard normal, where 178.9 cm lands at $Z = 2.0$. The shaded area never changes, only the axis.

```widget
standardize-play
{ "mu": 164.7, "sigma": 7.1, "lo": null, "hi": 178.9, "unit": "cm", "var": "X", "presets": false, "table": false, "title": "Women's height: X = 178.9 cm becomes Z = 2.0" }
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

## A level-300 Hero against the top 500

Nexon's North America ranking lists the top 500 Heroes, a MapleStory warrior job, at levels 293 to 300 [GMS, v.271 Hero ranking, checked 2026-10-27]: 85 at 293, 102 at 294, 200 at 295, 59 at 296, 24 at 297, 13 at 298, 11 at 299 and 6 at 300. The 500 are a sample cut from 227 326 ranked Heroes, so use $\bar{X}$ and $s$: from the counts, $\bar{X} = 294.896$ and $s = 1.43991$. A Z-score only measures how far 300 sits from this list's own mean in this list's own $s$, so it needs no bell; turning that Z into a percentage would.

```quiz
[
  {"q": "Top 500 Heroes: $\\bar{X} = 294.896$, $s = 1.43991$. Z-score of a level-300 Hero? (2 decimals)", "type": "numeric", "answer": 3.54, "tolerance": 0.01, "explain": "$Z = (X - \\bar{X})/s = (300 - 294.896)/1.43991 = 5.104/1.43991 = 3.54$. That is above +2, so a level-300 Hero is unusual even within the top 500."}
]
```

$Z = \dfrac{300 - 294.896}{1.43991} = \dfrac{5.104}{1.43991} = \mathbf{3.54}$

$3.54 > 2$, so level 300 is **unusual** even here. The high cutoff is $\bar{X} + 2s = 294.896 + 2.880 = 297.78$, so all 30 Heroes at levels 298 to 300 are unusual. The lowest level, 293, gives $Z = (293 - 294.896)/1.43991 = -1.32$: usual. Nobody on the list is unusually low, because it stops at rank 500. Z still works on this lopsided list; it just reports the lopsidedness.

## Pencil problem: body temperature

$\mu = 98.20$, $\sigma = 0.62$. The "usual" range is $\mu \pm 2\sigma = 98.20 \pm 1.24$, i.e. **96.96 to 99.44**.

- $101.00$: well above 99.44 → **unusual**.
- $96.90$: below 96.96 → **unusual**.
- $96.98$: inside 96.96–99.44 → **usual** (just barely).

## Z-scores for a month of Allflame Divine prices

The Divine Orb is PoE1's high-value currency, priced in Chaos Orbs. Take poe.ninja's daily Divine price for the last 30 days of the Allflame league, 2026-09-28 to 2026-10-27 [PoE1, 3.29 Allflame Divine price, checked 2026-10-27]: $\bar{X} = 329.22$ chaos and $s = 46.5915$ chaos. The window opens with poe.ninja's 163.8-chaos reading for 28 September, a receive-side-only dip (that day's pay side works out to about 300 chaos), likely a recording artifact. The 27 October price is 270.0, and the window's high is 379.0.

```quiz
[
  {"q": "Allflame Divine, last 30 days: $\\bar{X} = 329.22$, $s = 46.5915$ chaos. Z-score of poe.ninja's 163.8-chaos reading? (2 decimals)", "type": "numeric", "answer": -3.55, "tolerance": 0.01, "explain": "$Z = (X - \\bar{X})/s = (163.8 - 329.22)/46.5915 = -165.42/46.5915 = -3.55$: three and a half standard deviations below the window's mean."},
  {"q": "Is the 163.8-chaos reading usual or unusual for this window?", "type": "text", "answer": ["unusual", "Unusual", "it is unusual"], "explain": "$Z = -3.55 < -2$, so it is unusual: far below every other day in the window, which runs 265.0 to 379.0. A Z-score this far out is how you catch a likely recording error before trusting it."},
  {"q": "Z-score of the 27 October price, 270.0 chaos? (2 decimals)", "type": "numeric", "answer": -1.27, "tolerance": 0.01, "explain": "$Z = (270.0 - 329.22)/46.5915 = -59.22/46.5915 = -1.27$: below the mean but inside $-2 < Z < 2$, so usual."},
  {"q": "Above what price is a day unusually high for this window? (chaos, 1 decimal)", "type": "numeric", "answer": 422.4, "tolerance": 0.05, "unit": "chaos", "explain": "Unusual means $Z > 2$: $X = \\bar{X} + 2s = 329.22 + 2(46.5915) = 329.22 + 93.183 = 422.4$ chaos. The window's high of 379.0 is below it, so no day is unusually high. The low cutoff is $329.22 - 93.183 = 236.0$ chaos."},
  {"q": "Which price has $Z = -1.5$ in this window? (chaos, 1 decimal)", "type": "numeric", "answer": 259.3, "tolerance": 0.05, "unit": "chaos", "explain": "$X = \\bar{X} + Zs = 329.22 + (-1.5)(46.5915) = 329.22 - 69.887 = 259.3$ chaos."}
]
```

```quiz
[
  {
    "q": "Women's heights have $\\mu = 164.7$, $\\sigma = 7.1$. What is the Z-score for $X = 180$? (2 decimals)",
    "type": "numeric",
    "answer": 2.15,
    "tolerance": 0.02,
    "explain": "$Z = (180 - 164.7)/7.1 = 15.3/7.1 = 2.15$: 2.15 standard deviations above the mean."
  },
  {
    "q": "Same population. What percentage of women are shorter than 150.5 cm?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "$Z = (150.5 - 164.7)/7.1 = -14.2/7.1 = -2.0$ exactly. 95% sits inside $\\mu \\pm 2\\sigma$, so the two tails share 5% and the lower tail alone is $5\\% / 2 = 2.5\\%$. Above 178.9 cm ($Z = +2$) is the matching 2.5%; below it is the whole 95% band plus the lower tail, 97.5%."
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