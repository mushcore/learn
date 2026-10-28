---
title: 68–95–99.7 rule
minutes: 20
---
<!-- facts: classic.data.monsters, gms.data.ranking-level-hero-2026-10-27 -->

If $X$ follows a **normal distribution**, the **empirical rule** gives three fixed percentages for the share of values near the mean, built entirely from $\mu$ and $\sigma$ (or $\bar{X}$ and $s$ for a sample).

If $X$ is not bell-shaped, those percentages can be far off, and a skewed MapleStory Classic monster list shows by how much.

A normal distribution is the symmetric bell: most values near the mean, thinning out evenly on both sides.

## The three bands

| Interval | % of values | Exact figure |
|---|---|---|
| $\mu \pm \sigma$ | 68% | 68.27% |
| $\mu \pm 2\sigma$ | 95% | 95.45% |
| $\mu \pm 3\sigma$ | 99.7% | 99.73% |

The notes use the rounded numbers everywhere; the exact figures are what the true normal curve gives.

:::quiz Quiz note
The empirical rule applies **only to (approximately) normally distributed** variables.

Chebyshev's theorem (next lesson) works for *any* distribution, with weaker bounds.
:::

## Worked example: IQ scores

IQ scores are normal with $\mu = 100$, $\sigma = 15$.

- 68% of people score between:
  $$100 - 15 = \mathbf{85} \quad \text{and} \quad 100 + 15 = \mathbf{115}$$
- 95% of people score between:
  $$100 - 30 = \mathbf{70} \quad \text{and} \quad 100 + 30 = \mathbf{130}$$
- 99.7% of people score between:
  $$100 - 45 = \mathbf{55} \quad \text{and} \quad 100 + 45 = \mathbf{145}$$

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 130, "presets": { "IQ score": [100, 15, 130] } }
```

## Reading the tails

The three bands cut the bell into eight slices.

The curve is symmetric, so each band's share splits evenly between its two sides:

- The 1σ band, one side:
  $$\dfrac{68}{2} = 34$$
- The 2σ band minus the 1σ band, split over two sides:
  $$\dfrac{95 - 68}{2} = 13.5$$
- The 3σ band minus the 2σ band, split over two sides:
  $$\dfrac{99.7 - 95}{2} = 2.35$$
- What is left beyond 3σ, one side:
  $$\dfrac{100 - 99.7}{2} = 0.15$$

```diagram
{ "type": "grid", "title": "The eight slices of the empirical rule (IQ: μ = 100, σ = 15)", "nodes": [
  { "id": "h0", "label": "Slice", "row": 0, "col": 0 }, { "id": "h1", "label": "% in slice", "row": 0, "col": 1 }, { "id": "h2", "label": "% below its right edge", "row": 0, "col": 2 }, { "id": "h3", "label": "IQ at right edge", "row": 0, "col": 3 },
  { "id": "r1", "label": "below −3σ", "row": 1, "col": 0 }, { "id": "a1", "label": "0.15", "row": 1, "col": 1 }, { "id": "b1", "label": "0.15", "row": 1, "col": 2 }, { "id": "c1", "label": "55", "row": 1, "col": 3 },
  { "id": "r2", "label": "−3σ to −2σ", "row": 2, "col": 0 }, { "id": "a2", "label": "2.35", "row": 2, "col": 1 }, { "id": "b2", "label": "2.5", "row": 2, "col": 2 }, { "id": "c2", "label": "70", "row": 2, "col": 3 },
  { "id": "r3", "label": "−2σ to −σ", "row": 3, "col": 0 }, { "id": "a3", "label": "13.5", "row": 3, "col": 1 }, { "id": "b3", "label": "16", "row": 3, "col": 2 }, { "id": "c3", "label": "85", "row": 3, "col": 3 },
  { "id": "r4", "label": "−σ to μ", "row": 4, "col": 0 }, { "id": "a4", "label": "34", "row": 4, "col": 1 }, { "id": "b4", "label": "50", "row": 4, "col": 2 }, { "id": "c4", "label": "100", "row": 4, "col": 3 },
  { "id": "r5", "label": "μ to +σ", "row": 5, "col": 0 }, { "id": "a5", "label": "34", "row": 5, "col": 1 }, { "id": "b5", "label": "84", "row": 5, "col": 2 }, { "id": "c5", "label": "115", "row": 5, "col": 3 },
  { "id": "r6", "label": "+σ to +2σ", "row": 6, "col": 0 }, { "id": "a6", "label": "13.5", "row": 6, "col": 1 }, { "id": "b6", "label": "97.5", "row": 6, "col": 2 }, { "id": "c6", "label": "130", "row": 6, "col": 3 },
  { "id": "r7", "label": "+2σ to +3σ", "row": 7, "col": 0 }, { "id": "a7", "label": "2.35", "row": 7, "col": 1 }, { "id": "b7", "label": "99.85", "row": 7, "col": 2 }, { "id": "c7", "label": "145", "row": 7, "col": 3 },
  { "id": "r8", "label": "above +3σ", "row": 8, "col": 0 }, { "id": "a8", "label": "0.15", "row": 8, "col": 1 }, { "id": "b8", "label": "100", "row": 8, "col": 2 }, { "id": "c8", "label": "–", "row": 8, "col": 3 }
], "hi": ["a4", "a5"], "caption": "The slices 0.15, 2.35, 13.5, 34, 34, 13.5, 2.35, 0.15 add to 100; any tail is a sum of slices." }
```

Every tail question is now "add the slices":

- Above $\mu + 2\sigma$ (and $5\%$ outside $\mu \pm 2\sigma$, both sides):
  $$2.35 + 0.15 = \mathbf{2.5\%}$$
- Between $\mu$ and $\mu + \sigma$: one slice, $34\%$.
- Below $\mu - \sigma$:
  $$0.15 + 2.35 + 13.5 = \mathbf{16\%}$$
- Below $\mu + \sigma$:
  $$0.15 + 2.35 + 13.5 + 34 + 34 = \mathbf{84\%}$$
- Above $\mu + 3\sigma$: one slice, $0.15\%$.

## Classic World monster HP: the rule fails on a skewed list

meowdb's monster table for MapleStory Classic World, Nexon's separate classic-era server, lists 92 monsters with their HP. Drop the 5 rows that give 0 EXP (four Lv 200 "Super" test mobs and the Lv 30 Straw Training Dummy) and 87 monsters remain.

Most have a few hundred to a few thousand HP, with median 1 001, but bosses and high-level monsters run from Mano's 7 420 up to Jr. Balrog's 325 400.

The rule assumes a bell and this list is heavily right-skewed, so the rule should fail here.

The 87 values have $\bar{X}$ = 8 610 HP and $s$ = 36 800 HP (unrounded 8 614.07 and 36 751.8).

```quiz
[
  {"q": "Classic World monster HP, 87 monsters: $\\bar{X} = 8614.07$, $s = 36751.8$. Lower end of $\\bar{X} \\pm s$? (3 significant digits)", "type": "numeric", "answer": -28100, "tolerance": 50, "unit": "HP", "explain": "$$\\bar{X} - s = 8614.07 - 36751.8 = -28137.7$$ That is **−28 100** HP to 3 significant digits. A negative HP: no monster can sit at or below it, so nothing lies below the band, where a bell would put 16% of values."},
  {"q": "83 of the 87 HP values fall inside $\\bar{X} \\pm s$ (−28 100 to 45 400 HP). What percentage is that? (1 decimal)", "type": "numeric", "answer": 95.4, "tolerance": 0.05, "unit": "%", "explain": "$$\\dfrac{83}{87} = 0.9540 = \\mathbf{95.4\\%}$$ The rule says about 68%. Only the four biggest monsters (Shade 47 000, Zombie Mushmom 66 640, Rotten Mushmom 86 400, Jr. Balrog 325 400) are outside: the few huge values inflate $s$ until one $s$ covers nearly the whole list."}
]
```

| Band | Interval (HP) | Monsters inside | Share | Rule says |
|---|---|---|---|---|
| $\bar{X} \pm s$ | −28 100 to 45 400 | 83 | 95.4% | 68% |
| $\bar{X} \pm 2s$ | −64 900 to 82 100 | 85 | 97.7% | 95% |
| $\bar{X} \pm 3s$ | −102 000 to 119 000 | 86 | 98.9% | 99.7% |

Three things break:

1. No lower tail: every lower end is negative HP.
2. The one-$s$ band holds 95.4%, not 68%, because four giants inflate $s$.
3. Jr. Balrog is outside even $\pm 3s$: 1.1% of the list against the rule's 0.3%.

Check first: a mean of 8 610 against a median of 1 001 warns that the rule does not apply; use Chebyshev's rule (lesson 9).

## Lab 1 pencil problem 5: moisture content

Moisture content is normal with $\mu = 18$, $\sigma = 0.5$.

- **(b)** Between 17 and 19 ($\mu \pm 2\sigma$, since $2 \times 0.5 = 1$): **95%**
- **(c)** Above 19.5 ($\mu + 3\sigma$, since $3 \times 0.5 = 1.5$): the last slice, **0.15%**
- **(d)** Between 18 and 18.5 ($\mu$ to $\mu + \sigma$): one slice, **34%**
- **(e)** Below 19 ($\mu + 2\sigma$), the slices up to $+2\sigma$:
  $$0.15 + 2.35 + 13.5 + 34 + 34 + 13.5 = \mathbf{97.5\%}$$

```widget
normal-curve
{ "mu": 18, "sigma": 0.5, "x": 19, "presets": { "Moisture (b)/(e): X=19": [18, 0.5, 19], "Moisture (c): X=19.5": [18, 0.5, 19.5], "Moisture (d): X=18.5": [18, 0.5, 18.5] } }
```

## Lab 1 pencil problem 3c: gold prices

Ten days of gold prices: mean $6280.683$, $s = 139.7298$. The $\pm 3s$ interval runs from:

$$6280.683 - 3(139.7298) = \mathbf{5861.493} \quad \text{to} \quad 6280.683 + 3(139.7298) = \mathbf{6699.873}$$

By the empirical rule, 99.7% of values (assuming approximate normality) fall inside that interval, so the chance of a value falling **outside** $\pm 3s$ is:

$$100\% - 99.7\% = \mathbf{0.3\%}$$

## The rule against the top 500 Heroes' levels

Nexon's North America ranking lists the top 500 Heroes, a MapleStory warrior job, at levels 293 to 300: 85 at 293, 102 at 294, 200 at 295, 59 at 296, 24 at 297, 13 at 298, 11 at 299 and 6 at 300. From those counts $\bar{X} = 294.896$ and $s = 1.43991$.

The list piles up at 295 but stops at 293, because rank 501 is cut off.

```quiz
[
  {"q": "Top 500 Heroes: $\\bar{X} = 294.896$, $s = 1.43991$. Upper end of $\\bar{X} \\pm s$? (2 decimals, because the band ends fall between whole levels)", "type": "numeric", "answer": 296.34, "tolerance": 0.005, "explain": "$$\\bar{X} + s = 294.896 + 1.43991 = 296.336 \\approx \\mathbf{296.34}$$ The lower end is: $$294.896 - 1.43991 = 293.456$$ So the band holds levels 294, 295 and 296. Rounding to 3 significant digits would turn 293.456 into 293 and wrongly put level 293 inside; at $2s$ the same happens to 297.776 and level 298."},
  {"q": "What percentage of the 500 Heroes sit inside $\\bar{X} \\pm s$? (1 decimal)", "type": "numeric", "answer": 72.2, "tolerance": 0.05, "unit": "%", "explain": "Levels 294 to 296: $$102 + 200 + 59 = 361 \\text{ Heroes}$$ $$\\dfrac{361}{500} = \\mathbf{72.2\\%}$$ The rule says about 68%: close."},
  {"q": "What percentage sit inside $\\bar{X} \\pm 2s$? (1 decimal)", "type": "numeric", "answer": 94.0, "tolerance": 0.05, "unit": "%", "explain": "$2s = 2.87982$, so the band is $292.016$ to $297.776$: levels 293 to 297. $$85 + 102 + 200 + 59 + 24 = 470$$ $$\\dfrac{470}{500} = \\mathbf{94.0\\%}$$ The rule says 95%."},
  {"q": "What percentage sit inside $\\bar{X} \\pm 3s$? (1 decimal)", "type": "numeric", "answer": 98.8, "tolerance": 0.05, "unit": "%", "explain": "$3s = 4.31973$, so the band is $290.576$ to $299.216$: levels 293 to 299, $500 - 6 = 494$ Heroes. $$\\dfrac{494}{500} = \\mathbf{98.8\\%}$$ The rule says 99.7%. The six level-300 Heroes are the ones outside."},
  {"q": "Every Hero outside $\\bar{X} \\pm 2s$ is above the mean.", "type": "tf", "answer": true, "explain": "The lower end, 292.016, is below the lowest level on the list (293), so nobody falls out the bottom. The 30 Heroes outside ($13 + 11 + 6$ at levels 298 to 300) are all on the high side. A bell splits the outside 5% evenly between two tails; a list cut off at rank 500 has no lower tail, so the rule fits only roughly."}
]
```

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
    "explain": "Add the two slices above $+2\\sigma$: $$2.35 + 0.15 = \\mathbf{2.5\\%}$$ Same as half of the $100-95=5\\%$ outside the band."
  },
  {
    "q": "What percentage of a normal distribution lies between $\\mu$ and $\\mu+\\sigma$ (not the full $\\mu\\pm\\sigma$ band)?",
    "type": "numeric",
    "answer": 34,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "The full $\\mu\\pm\\sigma$ band is 68%; by symmetry each half (mean to $+\\sigma$, and mean to $-\\sigma$) is: $$\\dfrac{68\\%}{2} = \\mathbf{34\\%}$$"
  },
  {
    "q": "Moisture content is normal with $\\mu=18$, $\\sigma=0.5$. What percentage of readings fall above 19.5?",
    "type": "numeric",
    "answer": 0.15,
    "tolerance": 0.02,
    "unit": "%",
    "explain": "19.5 is $\\mu+3\\sigma$: $$18+3(0.5)=19.5$$ Beyond $\\pm3\\sigma$ is this much in total: $$100-99.7=0.3\\%$$ Split over two tails, that is $\\mathbf{0.15\\%}$ per tail."
  },
  {
    "q": "Same moisture distribution ($\\mu=18$, $\\sigma=0.5$). What percentage of readings fall below 19?",
    "type": "numeric",
    "answer": 97.5,
    "tolerance": 0.2,
    "unit": "%",
    "explain": "19 is $\\mu+2\\sigma$. Add the slices up to $+2\\sigma$: $$0.15 + 2.35 + 13.5 + 34 + 34 + 13.5 = \\mathbf{97.5\\%}$$"
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
    "explain": "$$6280.683 + 3(139.7298) = \\mathbf{6699.873}$$"
  },
  {
    "q": "For that gold price data, what is the chance a value falls outside the $\\pm 3s$ interval, assuming approximate normality?",
    "type": "numeric",
    "answer": 0.3,
    "tolerance": 0.02,
    "unit": "%",
    "explain": "99.7% falls inside $\\mu\\pm3\\sigma$, so this much falls outside: $$100\\%-99.7\\%=\\mathbf{0.3\\%}$$"
  },
  {"type": "shade", "q": "Shade the region that holds about **95%** of a normal distribution ($\\mu=18$, $\\sigma=0.5$ moisture content).", "mu": 18, "sigma": 0.5, "answer": 95, "lo": -2, "hi": 2, "explain": "$\\mu\\pm2\\sigma$ is 17 to 19, which holds 95% (exactly 95.45%). Drag the handles to $-2\\sigma$ and $+2\\sigma$."},
  {"type": "shade", "q": "Shade everything **below** $\\mu+\\sigma$. What percentage is that?", "mu": 18, "sigma": 0.5, "answer": 84, "tolerance": 1, "region": "below", "hi": 1, "explain": "Add the slices up to $+\\sigma$: $$0.15 + 2.35 + 13.5 + 34 + 34 = \\mathbf{84\\%}$$"},
  {"type": "shade", "q": "Shade everything **above** $\\mu+3\\sigma$ (above 19.5%).", "mu": 18, "sigma": 0.5, "answer": 0.15, "tolerance": 0.1, "region": "above", "lo": 3, "explain": "99.7% is inside $\\pm3\\sigma$, leaving 0.3% split between two tails: 0.15% each."}
]
```