---
title: Skewness
minutes: 16
---
<!-- facts: poe1.data.divine-chaos-allflame, classic.data.monsters -->

A Divine Orb that opens a league cheap and settles high, and a monster list where a few bosses dwarf the field, are lopsided in opposite directions.

Every measure so far has been about centre (mean, median), variation (range, SD, IQR), or position (Z-scores, percentiles). **Skewness** measures none of those: it tells you how **non-symmetrical** the distribution is.

## Where mean and median disagree

For a perfectly symmetric distribution, the mean and the median sit at exactly the same spot.

The moment a distribution grows a long tail on one side, the mean gets pulled toward that tail (because the mean uses every value, including the extreme ones) while the median barely moves (because the median only cares about rank).

```widget
skewness
{ "title": "Skewness: mean chases the tail, median barely moves" }
```

- **Symmetric** → mean = median → skewness = 0.
- **Skewed left** (long tail on the left) → the tail drags the mean **down below** the median → skewness < 0.
- **Skewed right** (long tail on the right) → the tail drags the mean **up above** the median → skewness > 0.

The sign of the skewness matches the side the mean sits relative to the median, which matches the side the tail points.

## Pearson's coefficient of skewness

Sample:

$$Sk = 3 \cdot \frac{\bar{X} - Q_2}{s}$$

Population:

$$Sk = 3 \cdot \frac{\mu - Q_2}{\sigma}$$

$Q_2$ is just the median.

The factor of 3 and the division by $s$ (or $\sigma$) turn the raw gap between mean and median into a unit-free number you can compare across data sets.

**Highly skewed** has a specific threshold:
- Highly skewed **left**: $Sk < -1$.
- Highly skewed **right**: $Sk > +1$.

Anything between $-1$ and $+1$ is only mildly skewed (or symmetric, near 0).

:::quiz Sign direction
"Mean 50, median 55": the mean is below the median, so the distribution is skewed **left**, even though nothing in the numbers says "left" directly.
:::

## Pearson's Sk for Allflame Divine prices and Classic monster HP

poe.ninja's daily price of a Divine Orb, PoE1's high-value currency, climbs over the first 30 days of the Allflame league from 75.9 to about 193 chaos.

meowdb's monster table for MapleStory Classic, with the five zero-EXP test mobs dropped, lists 25 monsters from level 41 to 60: 22 field monsters between 1278 and 5428 HP and three bosses, Shade 47000, Zombie Mushmom 66640 and Rotten Mushmom 86400.

Sort the 30 prices onto a number line: 22 of them sit between 155 and 208, and the eight league-start days trail off alone down to 75.9. The long, thin side is the left, so the tail is on the left.

The monster list is the mirror image: 22 field monsters bunch below 5 500 HP and three bosses trail off alone to the right.

```widget
drag-data
{ "data": "75.9 83.5 90 107 117.1 117.4 121.8 123 155 163.4 170 171.8 172.1 172.7 180.6 189.5 190 193 193 193 193.3 193.3 193.5 193.6 195.3 197.4 199 199.6 201 208.2", "title": "Allflame Divine price (chaos), first 30 days: the left tail", "claims": [
  { "when": "mean<median", "text": "Mean below median: the left tail pulls it down." }
]}
```

```quiz
[
  {"q": "Divine Orb, first 30 Allflame days: $\\bar{X} = 165.133$, $Q_2 = 185.05$, $s = 40.077$ chaos. Compute Pearson's $Sk$. (2 decimals)", "type": "numeric", "answer": -1.49, "tolerance": 0.006, "explain": "$$Sk = \\frac{3(165.133 - 185.05)}{40.077} = \\frac{3(-19.917)}{40.077} = -1.49$$ Below $-1$: highly skewed left."},
  {"q": "Monster HP, levels 41 to 60: $\\bar{X} = 10748.04$, $Q_2 = 2998$, $s = 21861.0$. Compute Pearson's $Sk$. (2 decimals)", "type": "numeric", "answer": 1.06, "tolerance": 0.006, "explain": "$$Sk = \\frac{3(10748.04 - 2998)}{21861.0} = \\frac{3(7750.04)}{21861.0} = 1.06$$ Above $+1$: highly skewed right."}
]
```

Divine prices:

$$Sk = 3 \cdot \dfrac{165.133 - 185.05}{40.077} = \mathbf{-1.49}$$

That is highly skewed left. The eight cheapest days, 75.9 to 123.0, drag the mean about 20 chaos below the median.

Monster HP:

$$Sk = 3 \cdot \dfrac{10748.04 - 2998}{21861.0} = \mathbf{1.06}$$

That is highly skewed right. The three bosses pull the mean to more than three times the median, which is the HP of a field monster.

### The two data sets in the calculator

```widget
stat-calc
{ "data": "75.9 83.5 90 107 117.1 117.4 121.8 123 163.4 170 155 172.1 171.8 172.7 180.6 199 208.2 201 199.6 197.4 190 189.5 193 193.3 193.5 193.3 193.6 193 195.3 193", "title": "Allflame Divine Orb price (chaos), first 30 days, poe.ninja" }
```

```widget
stat-calc
{ "data": "1774 1278 2069 2134 2595 2163 2671 2285 2513 2350 47000 2899 3218 2682 3136 3924 2998 66640 5134 3520 3872 5428 4834 5184 86400", "title": "MapleStory Classic monster HP, levels 41 to 60, meowdb (n = 25)" }
```

## Worked example: cat bodyweights

The `cats$Bwt` data from R's `MASS` package (n = 144 domestic cats).

Read $\bar{X}$, $Q_2$ and $s$ off the calculator and compute $Sk$ before checking it against the working below.

```widget
stat-calc
{ "dataset": "cats", "title": "MASS::cats body weight (kg), n = 144" }
```

1. Mean: $\bar{X} = 2.724$
2. Median: $Q_2 = 2.7$
3. Sample SD: $s = 0.4853$
4. Skewness:
   $$Sk = 3 \cdot \frac{2.724 - 2.7}{0.4853} \approx \mathbf{0.146}$$

In R this is one line:

```r
3 * (mean(cats$Bwt) - median(cats$Bwt)) / sd(cats$Bwt)
```

:::info R syntax
| Code | What it does |
|---|---|
| `cats$Bwt` | `$` picks the `Bwt` (body weight) column of the `cats` data frame; `cats` comes from the `MASS` package, which must be loaded first. |
| `mean(cats$Bwt)` | The average of the column. |
| `median(cats$Bwt)` | The middle value of the column. |
| `sd(cats$Bwt)` | The sample standard deviation (divides by n − 1). |
| `( … - …)` | `-` subtracts; the brackets make R do the subtraction before multiplying and dividing. |
| `3 * … / …` | `*` multiplies and `/` divides, worked left to right: 3 times the gap, then over the SD. |

**Left to right**

- "Three (`3`) times (`*`) the gap (`( …)`) found as the average (`mean`) of the body weights (`cats$Bwt`) minus (`-`) the median (`median`) of the body weights (`cats$Bwt`), divided by (`/`) the standard deviation (`sd`) of the body weights (`cats$Bwt`)."

**Right to left**, the order R runs it

- "Take the cats data (`cats`) and pull out its body weights (`$Bwt`); find their average (`mean`) and their median (`median`) and subtract the median from the mean (`-`) inside the brackets (`( …)`); multiply that gap by three (`3 *`); then find the standard deviation (`sd`) of the weights and divide by it (`/`)."
:::

$0.146$ is positive but well inside $(-1, 1)$, so cat bodyweight is **mildly skewed right**.

A small number of heavier cats stretch the upper tail, pulling the mean just above the median.

:::warn Don't use the `moments` package formula
R's `moments` library has a `skewness()` function that uses a **different formula** (the third standardized moment, not Pearson's mean/median formula).

The course ignores it: compute Pearson's $Sk$ by hand or with the one-liner above:

$$Sk = \frac{3(\bar{X}-Q_2)}{s}$$
:::

## Sk as one point moves into a tail

Twelve settled Allflame prices sit between 324.0 and 350.0 chaos, with $Sk = -0.86$.

Drag the highest price, 350.0, down to 204.0 and watch $Sk$ pass $-1$ (it reaches $-1.06$).

```widget
drag-data
{ "data": "338 341.5 342.2 350 328 346 337 324 345 343 343 342", "title": "Twelve settled Allflame Divine prices (chaos): drag one into a tail", "claims": [
  { "when": "sk>1", "text": "Sk > 1: highly skewed right — the tail you built is on the right." },
  { "when": "sk<-1", "text": "Sk < -1: highly skewed left — the tail you built is on the left." },
  { "when": "sk>0 && sk<=1", "text": "0 < Sk ≤ 1: mildly skewed right." },
  { "when": "sk<0 && sk>=-1", "text": "-1 ≤ Sk < 0: mildly skewed left." },
  { "when": "mean==median || (sk>-0.05 && sk<0.05)", "text": "Nearly symmetric: mean and median are close together." }
]}
```

## Mean, median and Sk by shape

| Situation | Mean vs median | Sign of Sk |
|---|---|---|
| Symmetric | mean = median | $Sk = 0$ |
| Skewed left | mean < median | $Sk < 0$ |
| Skewed right | mean > median | $Sk > 0$ |
| Highly skewed left | — | $Sk < -1$ |
| Highly skewed right | — | $Sk > +1$ |

## Pearson's Sk for the whole Allflame series and the whole monster table

The full Allflame series runs 96 days, and the monster table has 87 rows after the five zero-EXP test mobs are dropped, from level 1 up to Jr. Balrog, a level 80 boss with 325400 HP.

The last item takes the final 5 Allflame days: 300.0, 265.0, 265.0, 300.0, 270.0 chaos.

```quiz
[
  {"q": "Divine Orb, all 96 Allflame days: $\\bar{X} = 268.99$, $Q_2 = 300.0$, $s = 89.49$ chaos. Compute $Sk$. (2 decimals)", "type": "numeric", "answer": -1.04, "tolerance": 0.006, "explain": "$$Sk = \\frac{3(268.99 - 300.0)}{89.49} = \\frac{3(-31.01)}{89.49} = -1.04$$"},
  {"q": "How is the 96-day Divine series skewed?", "options": ["Highly skewed left", "Mildly skewed left", "Highly skewed right", "Symmetric"], "answer": 0, "explain": "$Sk = -1.04 < -1$: highly skewed left. The cheap league-start weeks are the left tail."},
  {"q": "Classic monster HP, all 87 rows: $\\bar{X} = 8614.07$, $Q_2 = 1001$, $s = 36751.80$. Compute $Sk$. (2 decimals)", "type": "numeric", "answer": 0.62, "tolerance": 0.006, "explain": "$$Sk = \\frac{3(8614.07 - 1001)}{36751.80} = \\frac{3(7613.07)}{36751.80} = 0.62$$"},
  {"q": "The 87-row HP table is highly skewed right, because Jr. Balrog's 325400 HP is over 300 times the median.", "type": "tf", "answer": false, "explain": "$Sk = 0.62$, between 0 and 1: only mildly skewed right by Pearson's rule. The same huge values that pull the mean up also blow up $s$ in the denominator, so $Sk$ stays below 1. Read the sign and the threshold, not the size of the biggest value."},
  {"q": "Classic monster EXP per kill, all 87 rows: $\\bar{X} = 165.84$, $Q_2 = 69$, $s = 356.41$. Compute $Sk$. (2 decimals)", "type": "numeric", "answer": 0.82, "tolerance": 0.006, "explain": "$$Sk = \\frac{3(165.84 - 69)}{356.41} = \\frac{3(96.84)}{356.41} = 0.82$$ Mildly skewed right."},
  {"type": "fill", "q": "The final 5 Allflame days in R. Fill the blank in Pearson's formula.", "code": "x <- c(300.0, 265.0, 265.0, 300.0, 270.0)\n3*(mean(x) - ___(x))/sd(x)\n## [1] 1.632993", "answer": ["median"], "explain": "$$\\bar{X} = \\frac{1400}{5} = 280$$ $Q_2 = 270$. $$\\sum(X - \\bar{X})^2 = 400 + 225 + 225 + 400 + 100 = 1350$$ $$s = \\sqrt{\\frac{1350}{4}} = 18.3712$$ $$Sk = \\frac{3(280 - 270)}{18.3712} = 1.633$$ These five days alone skew right."}
]
```

```quiz
[
  {
    "q": "A distribution has mean 50 and median 55. Which way is it skewed?",
    "options": ["Left", "Right", "It is symmetric", "Cannot tell from this"],
    "answer": 0,
    "explain": "Mean (50) is less than median (55), so $Sk < 0$: skewed left. The left tail pulls the mean down below the median."
  },
  {
    "q": "A distribution has mean 82 and median 75, with sample SD 6. Compute Pearson's Sk (2 decimals).",
    "type": "numeric",
    "answer": 3.5,
    "tolerance": 0.05,
    "explain": "$$Sk = \\frac{3(82-75)}{6} = \\frac{3(7)}{6} = \\frac{21}{6} = 3.5$$"
  },
  {
    "q": "Is the distribution in the previous question highly skewed?",
    "type": "tf",
    "answer": true,
    "explain": "$Sk = 3.5 > 1$, so it is highly skewed right."
  },
  {
    "q": "For the cats bodyweight example, $\\bar{X} = 2.724$, $Q_2 = 2.7$, $s = 0.4853$. Compute Sk (3 decimals).",
    "type": "numeric",
    "answer": 0.146,
    "tolerance": 0.003,
    "explain": "$$Sk = \\frac{3(2.724 - 2.7)}{0.4853} \\approx 0.146$$ Computed in R with `3*(mean(cats$Bwt)-median(cats$Bwt))/sd(cats$Bwt)`."
  },
  {
    "q": "The cats bodyweight distribution ($Sk \\approx 0.146$) is:",
    "options": ["Highly skewed left", "Mildly skewed right", "Highly skewed right", "Perfectly symmetric"],
    "answer": 1,
    "explain": "$0 < 0.146 < 1$: positive but small, so it is mildly skewed right, not highly skewed."
  },
  {
    "q": "In a symmetric distribution, the mean is always exactly equal to the median.",
    "type": "tf",
    "answer": true,
    "explain": "Symmetric means the mean and median coincide, giving $Sk = 0$."
  },
  {
    "q": "If a distribution has a long tail stretching out to the left, what happens to the mean relative to the median?",
    "options": ["Mean shifts right, above the median", "Mean shifts left, below the median", "Mean and median stay equal", "The median shifts, not the mean"],
    "answer": 1,
    "explain": "A left tail contains extreme low values, which pull the mean (which uses every value) down below the median (which only reflects rank)."
  },
  {
    "q": "R's `moments::skewness()` function should be used for Pearson's coefficient of skewness in this course.",
    "type": "tf",
    "answer": false,
    "explain": "The instructor said to ignore the `moments` package formula. Use Pearson's formula instead: $$Sk = \\frac{3(\\bar{X}-Q_2)}{s}$$"
  },
  {
    "q": "A distribution has $Sk = -1.4$. What does this tell you?",
    "options": ["Highly skewed right", "Highly skewed left", "Mildly skewed left", "Symmetric"],
    "answer": 1,
    "explain": "$Sk < -1$ is the threshold for highly skewed left."
  }
]
```
