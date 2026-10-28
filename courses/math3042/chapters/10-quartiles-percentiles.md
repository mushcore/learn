---
title: Quartiles & percentiles
minutes: 20
---
<!-- facts: classic.monster.training-hp, poe1.ladder.ruthless-levels -->

Range and standard deviation tell you how spread out $X$ is. A **measure of position** tells you where a particular value sits relative to the rest of the data: where a Classic training monster's HP sits among its neighbours, or what share of a ladder is below level 95. Quartiles and percentiles are both measures of position.

## Quartiles

Sorted data can be cut into four equal-sized quarters by three cut points:

| | Meaning |
|---|---|
| $Q_1$ | separates the lowest 25% from the upper 75% |
| $Q_2$ | the median — separates the lowest 50% from the upper 50% |
| $Q_3$ | separates the lowest 75% from the upper 25% |

## Hand method for small data sets

To find $Q_1$ and $Q_3$ by hand: find the median first, then treat the **lower half** and **upper half** as their own mini data sets and take the median of each. If $n$ is **odd**, exclude the middle value itself from both halves before you split.

The median examples, extended to quartiles:

**Odd $n = 7$:** $19, 19, 20, (22), 23, 25, 50$ → median $Q_2 = 22$.
Exclude the 22, split what's left: lower half $19, 19, 20$ → $Q_1 = 19$ (its median). Upper half $23, 25, 50$ → $Q_3 = 25$.

**Even $n = 6$:** $19, 20, (23, 27), 29, 30$ → median $Q_2 = \frac{23+27}{2} = 25$.
No value to exclude — split evenly: lower half $19, 20, 23$ → $Q_1 = 20$. Upper half $27, 29, 30$ → $Q_3 = 29$.

The boxplot below puts the hand quartiles for the odd example beside R's: R's `quantile()` interpolates and gives $Q_1 = 19.5$, $Q_3 = 24$, so the two methods differ on small data sets.

```widget
boxplot
{ "data": "19 19 20 22 23 25 50", "note": "The odd n = 7 median example: hand method vs R" }
```

## Twelve Classic training monsters: quartiles by hand

meowdb's monster table lists HP for twelve common Victoria Island training monsters in MapleStory Classic World, Nexon's separate classic-era server [Classic, Classic World Grand Launch training monsters, checked 2026-10-27]. Sorted: 45 (Snail), 115, 142, 172, 233, 403, 510, 842, 982, 1 336, 3 218, 7 420 (Mano, a boss). Twelve values is a small sorted list with even $n$, the hand method's case: split into two halves of six, with nothing excluded.

```quiz
[
  {"q": "The 12 training monsters' HP, sorted: 45, 115, 142, 172, 233, 403, 510, 842, 982, 1336, 3218, 7420. $Q_1$ by the hand method?", "type": "numeric", "answer": 157, "tolerance": 0, "unit": "HP", "explain": "$n = 12$ is even, so nothing is excluded. Lower half: 45, 115, 142, 172, 233, 403; its median is $(142 + 172)/2 = 157$."},
  {"q": "Same list. $Q_3$ by the hand method?", "type": "numeric", "answer": 1159, "tolerance": 0, "unit": "HP", "explain": "Upper half: 510, 842, 982, 1336, 3218, 7420; its median is $(982 + 1336)/2 = 1159$."}
]
```

$Q_2 = \frac{403 + 510}{2} = 456.5$. Lower half 45, 115, 142, 172, 233, 403 gives $Q_1 = \frac{142 + 172}{2} = \mathbf{157}$; upper half 510, 842, 982, 1 336, 3 218, 7 420 gives $Q_3 = \frac{982 + 1336}{2} = \mathbf{1159}$. Half the monsters sit between 157 and 1 159 HP, and Mano's 7 420 does not move any quartile.

### Hand quartiles and R's for the twelve monsters

The boxplot shows both methods on the same twelve values: R's `quantile()` interpolates to $Q_1 = 164.5$ and $Q_3 = 1070.5$, against the hand method's 157 and 1 159.

```widget
boxplot
{ "data": "45 115 142 172 233 403 510 842 982 1336 3218 7420", "note": "HP of 12 Classic World training monsters (meowdb, Grand Launch build): hand method vs R" }
```

## A large example: faithful eruptions

The `faithful$eruptions` data set has $n = 272$ values. $25\%$ of $272 = 68$, so $Q_1$ separates the lowest 68 values from the upper 204. By hand, that lands between the 68th and 69th sorted values:

$Q_1 = \frac{68\text{th} + 69\text{th}}{2} = \frac{2.150 + 2.167}{2} = 2.1585$

$Q_2 = \frac{136\text{th} + 137\text{th}}{2} = 4.000$

$Q_3 = \frac{204\text{th} + 205\text{th}}{2} = 4.4585$

R's `quantile()` function does not compute quartiles exactly this way — it interpolates slightly differently and reports $Q_1 = 2.16275$ and $Q_3 = 4.45425$ for the same data. Both are correct.

:::quiz Slight disagreement is OK
**"There are about 10 different ways to define quartiles. Slight disagreement is OK."** A hand-calculated $Q_1$ that differs slightly from R's `quantile()` output is expected, not a mistake.
:::

## Percentiles

A **percentile** $P_k$ generalizes the idea: it separates the lowest $k\%$ of the data from the upper $(100-k)\%$. Quartiles are just three specific percentiles:

$Q_1 = P_{25} \qquad Q_2 = P_{50} \qquad Q_3 = P_{75}$

In R: `quantile(data$X, k/100)`; give the percentage as a decimal (`0.33` for the 33rd percentile, not `33`).

:::info R syntax
| Code | What it does |
|---|---|
| `data$X` | A template: `$` picks column `X` of a data frame called `data`; put your own names in. This fills `quantile()`'s argument `x`. |
| `k/100` | `/` divides: the percentile k turned into a proportion. This fills the argument `probs`. |
| `quantile(…)` | Returns the cut point with that proportion of the data below it. |

**Left to right**

- `quantile(data$X, k/100)`: "The cut point (`quantile`) of column X (`X`) of the data (`data$`) with k percent (`k/100`) of the values below it."

**Right to left**, the order R runs it

- `quantile(data$X, k/100)`: "Take the data (`data`) and pull out its column X (`$X`), divide k by 100 (`k/100`) to get a proportion, and find the cut point at that proportion (`quantile`)."
:::

Example: `quantile(faithful$eruptions, 0.33)` gives $P_{33} = 2.417$. That means 33% of eruption durations are below 2.417 minutes, and 67% are above.

:::info R syntax
| Code | What it does |
|---|---|
| `faithful$eruptions` | `$` picks the `eruptions` column of R's built-in `faithful` data frame; fills argument `x`. |
| `0.33` | Fills argument `probs`: the 33rd percentile, written as a proportion. |
| `quantile(…)` | Returns that one cut point, printed under its label `33%`. |

**Left to right**

- `quantile(faithful$eruptions, 0.33)`: "The cut point (`quantile`) of the eruptions column (`eruptions`) of the faithful data (`faithful$`) with 33 percent of the values below it (`0.33`)."

**Right to left**, the order R runs it

- `quantile(faithful$eruptions, 0.33)`: "Take the faithful data (`faithful`), pull out its eruptions column (`$eruptions`), and find the cut point (`quantile`) at proportion 0.33 (`0.33`)."
:::

## The five-number summary

Calling `quantile()` with no second argument returns all five landmark values at once — minimum, $Q_1$, $Q_2$, $Q_3$, maximum:

```text
    0%      25%      50%      75%     100%
1.60000  2.16275  4.00000  4.45425  5.10000
```

That's `quantile(faithful$eruptions)`. This five-number summary is exactly what a boxplot draws.

:::info R syntax
| Code | What it does |
|---|---|
| `faithful$eruptions` | The `eruptions` column of the `faithful` data frame; fills argument `x`. |
| `quantile(…)` | With `probs` left out, R uses 0, 0.25, 0.5, 0.75 and 1, so it returns the five-number summary, each under its percent label. |

**Left to right**

- `quantile(faithful$eruptions)`: "The five-number summary (`quantile`) of the eruptions column (`eruptions`) of the faithful data (`faithful$`)."

**Right to left**, the order R runs it

- `quantile(faithful$eruptions)`: "Take the faithful data (`faithful`), pull out its eruptions column (`$eruptions`), and find the cut points at 0%, 25%, 50%, 75% and 100% (`quantile`)."
:::

## The boxplot of the first ten eruptions

```widget
boxplot
{ "data": "1.800 1.950 2.283 2.883 3.333 3.600 3.600 4.350 4.533 4.700", "note": "First 10 faithful eruption durations (minutes)" }
```

## Quartiles without the boss, and a percentile on the Ruthless ladder

Drop Mano and eleven field monsters remain: 45, 115, 142, 172, 233, 403, 510, 842, 982, 1 336, 3 218 HP. Then take the official PoE1 Ruthless Allflame ladder, where ranks 1 to 200 on 2026-10-27 have levels 92: 88 characters, 93: 53, 94: 29, 95: 15, 96: 7, 97: 7, 99: 1 [PoE1, 3.29 Allflame Ruthless ladder, checked 2026-10-27].

```quiz
[
  {"q": "The 11 field monsters (Mano dropped): $Q_1$ by the hand method?", "type": "numeric", "answer": 142, "tolerance": 0, "unit": "HP", "explain": "$n = 11$ is odd: the median is the 6th value, 403, and it is left out of both halves. Lower half 45, 115, 142, 172, 233; its median is 142."},
  {"q": "Same 11 field monsters: $Q_3$ by the hand method?", "type": "numeric", "answer": 982, "tolerance": 0, "unit": "HP", "explain": "Upper half (403 excluded): 510, 842, 982, 1336, 3218; its median is 982."},
  {"q": "Ruthless ranks 1 to 200: $Q_1$ by the hand method (average of the 50th and 51st sorted levels)?", "type": "numeric", "answer": 92, "tolerance": 0, "explain": "Sorted, positions 1 to 88 are level 92, so the 50th and 51st are both 92: $Q_1 = (92 + 92)/2 = 92$."},
  {"q": "Ruthless ranks 1 to 200: $Q_3$ by the hand method (average of the 150th and 151st)?", "type": "numeric", "answer": 94, "tolerance": 0, "explain": "Sort the 200 levels from lowest to highest; $Q_3$ is the average of the values at positions 150 and 151. Running totals of the counts say which level fills which positions: 92 fills 1 to 88, 93 fills 89 to 141 (88 + 53 = 141), and 94 fills 142 to 170 (141 + 29 = 170). Positions 150 and 151 both fall in 142 to 170, so both are 94, and $Q_3 = (94 + 94)/2 = 94$. ($Q_2$, the 100th and 101st, falls in the 93 block, 89 to 141, so it is 93.)"},
  {"q": "What percentage of ranks 1 to 200 are below level 95?", "type": "numeric", "answer": 85, "tolerance": 0, "unit": "%", "explain": "$88 + 53 + 29 = 170$ characters are below 95, and $170/200 = 0.85 = 85\\%$. Level 95 covers positions 171 to 185, so it sits around $P_{85}$ to $P_{92}$."},
  {"type": "fill", "q": "The Ruthless levels in R. Fill the blank so `quantile()` returns $P_{90}$.", "code": "lvl <- rep(c(92, 93, 94, 95, 96, 97, 99), c(88, 53, 29, 15, 7, 7, 1))\nquantile(lvl, ___)\n## 90%\n##  95", "answer": ["0.9", "0.90", ".9"], "explain": "Give the percentage as a decimal: 0.9. 90% of 200 is 180; the 180th and 181st sorted levels are both 95 (level 95 covers positions 171 to 185), so the hand method and R agree on $P_{90} = 95$."}
]
```

```quiz
[
  {
    "q": "For the sorted data 19, 19, 20, 22, 23, 25, 50, what is $Q_1$ (using the hand method)?",
    "type": "numeric",
    "answer": 19,
    "explain": "Median is 22 (4th value). Exclude it since $n=7$ is odd. Lower half is 19, 19, 20; its median is 19."
  },
  {
    "q": "Same data set, 19, 19, 20, 22, 23, 25, 50. What is $Q_3$?",
    "type": "numeric",
    "answer": 25,
    "explain": "Upper half (excluding the median 22) is 23, 25, 50; its median is 25."
  },
  {
    "q": "For 19, 20, 23, 27, 29, 30 ($n=6$, even), what is $Q_1$?",
    "type": "numeric",
    "answer": 20,
    "explain": "$n$ is even, so no value is excluded. Lower half is 19, 20, 23; its median is 20."
  },
  {
    "q": "The faithful eruptions data has $n = 272$. How many values fall at or below $Q_1$?",
    "type": "numeric",
    "answer": 68,
    "explain": "25% of 272 = 68."
  },
  {
    "q": "What is $Q_1$ of the faithful data by the hand method (average of the 68th and 69th sorted values)?",
    "type": "numeric",
    "answer": 2.1585,
    "tolerance": 0.001,
    "explain": "$(2.150 + 2.167)/2 = 2.1585$."
  },
  {
    "q": "R's `quantile()` reports $Q_1 = 2.16275$ for the same faithful data. Why doesn't this exactly match the hand-method answer of 2.1585?",
    "options": ["One of the two methods contains an arithmetic error", "R and the hand method use different (but both valid) definitions of quartile", "R uses the population formula and the hand method uses the sample formula", "The faithful data set changed between calculations"],
    "answer": 1,
    "explain": "There are roughly 10 accepted ways to define a quartile. Small disagreements between methods are expected, not errors."
  },
  {
    "q": "$Q_1$ corresponds to which percentile?",
    "options": ["$P_{10}$", "$P_{25}$", "$P_{50}$", "$P_{75}$"],
    "answer": 1,
    "explain": "$Q_1 = P_{25}$: it separates the lowest 25% from the rest."
  },
  {
    "q": "`quantile(faithful$eruptions, 0.33)` returns 2.417. This means 67% of the data lies below 2.417.",
    "type": "tf",
    "answer": false,
    "explain": "$P_{33}$ means 33% lies below and 67% lies above — the opposite."
  },
  {
    "q": "Which values make up the five-number summary returned by a plain `quantile(data$X)` call? (select all)",
    "options": ["Minimum", "Mean", "$Q_1$", "$Q_2$ (median)", "$Q_3$", "Maximum"],
    "answer": [0, 2, 3, 4, 5],
    "explain": "The five-number summary is min, $Q_1$, $Q_2$, $Q_3$, max. The mean is not part of it."
  }
]
```
