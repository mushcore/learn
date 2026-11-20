---
title: "The QQ plot: a straight line means the data are bell-shaped"
minutes: 12
---
<!-- facts: none; every value is from Lab 9 or computed in writer-f/heights_check.py -->
A histogram of 20 values is too lumpy to judge. The QQ plot answers one question about a list of numbers: is it bell-shaped?

In RStudio you type two lines and read the picture. On paper you may be shown a QQ plot and asked to judge it.

## Sort the data, then ask where a perfect bell would put each value

Start with one list of numbers. Sort it from smallest to largest.

Now picture a perfect bell-shaped sample of the same size. Its smallest value sits far out on the left. Its middle value sits at the centre. Each value has an ideal spot.

Plot each real value against its ideal spot. If the data are a bell, every pair keeps the same spacing. The points fall on a straight line.

**A QQ plot pairs each sorted data value with the Z score a perfect normal sample would give that position. Bell-shaped data make a straight line.** Just like lining up a class by height beside a row of marked heights: if each student stands at the right mark, the line of heads is straight.

"Bell" and "normal" mean the same thing here.

### A QQ plot built one pair at a time

The grey dots are the raw data values. Watch them get sorted, then paired one at a time with their ideal Z. No one tells them to line up; they do, because they came from a bell.

```widget
qq-build-play
{ "shape": "normal", "n": 30, "title": "30 values from a bell land on a straight line" }
```

## Nine ride times and their nine ideal spots

Nine students time their SkyTrain ride to campus. Sorted, the rides in minutes are 37, 42, 45, 48, 50, 52, 55, 58, 63.

- $n = 9$, the number of rides.
- $37$, the shortest ride; $63$, the longest.

A perfect bell sample of 9 values cuts the bell into 10 slices of equal area. The cuts sit at the 10%, 20%, …, 90% marks.

```diagram
{"type": "curve", "title": "Nine cuts split the bell into ten slices of area 0.1", "x": [-3.2, 3.2], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1, "tone": "ink"}], "shade": [{"from": 0.84, "to": 1.28, "label": "0.1", "tone": "hl"}], "lines": [{"x": -1.28}, {"x": -0.84}, {"x": -0.52}, {"x": -0.25}, {"x": 0}, {"x": 0.25}, {"x": 0.52}, {"x": 0.84}, {"x": 1.28}], "ticks": [-1.28, -0.52, 0, 0.52, 1.28]}
```

Each cut is a Z read from the Z table backwards. For example, the 90% mark is the Z with area 0.90 to its left: 1.28. The long version of reading backwards is [the Quiz 8 lesson](#/math3042-q8/normal-backwards).

```diagram
{"type": "grid", "title": "Each sorted ride beside its ideal Z", "nodes": [{"id": "h0", "label": "share below", "row": 0, "col": 0}, {"id": "h1", "label": "ideal Z", "row": 0, "col": 1}, {"id": "h2", "label": "ride (min)", "row": 0, "col": 2}, {"id": "a0", "label": "10%", "row": 1, "col": 0}, {"id": "a1", "label": "-1.28", "row": 1, "col": 1}, {"id": "a2", "label": "37", "row": 1, "col": 2}, {"id": "b0", "label": "20%", "row": 2, "col": 0}, {"id": "b1", "label": "-0.84", "row": 2, "col": 1}, {"id": "b2", "label": "42", "row": 2, "col": 2}, {"id": "c0", "label": "30%", "row": 3, "col": 0}, {"id": "c1", "label": "-0.52", "row": 3, "col": 1}, {"id": "c2", "label": "45", "row": 3, "col": 2}, {"id": "d0", "label": "40%", "row": 4, "col": 0}, {"id": "d1", "label": "-0.25", "row": 4, "col": 1}, {"id": "d2", "label": "48", "row": 4, "col": 2}, {"id": "e0", "label": "50%", "row": 5, "col": 0}, {"id": "e1", "label": "0", "row": 5, "col": 1}, {"id": "e2", "label": "50", "row": 5, "col": 2}, {"id": "f0", "label": "60%", "row": 6, "col": 0}, {"id": "f1", "label": "0.25", "row": 6, "col": 1}, {"id": "f2", "label": "52", "row": 6, "col": 2}, {"id": "g0", "label": "70%", "row": 7, "col": 0}, {"id": "g1", "label": "0.52", "row": 7, "col": 1}, {"id": "g2", "label": "55", "row": 7, "col": 2}, {"id": "i0", "label": "80%", "row": 8, "col": 0}, {"id": "i1", "label": "0.84", "row": 8, "col": 1}, {"id": "i2", "label": "58", "row": 8, "col": 2}, {"id": "j0", "label": "90%", "row": 9, "col": 0}, {"id": "j1", "label": "1.28", "row": 9, "col": 1}, {"id": "j2", "label": "63", "row": 9, "col": 2}], "hi": ["e1", "e2"], "caption": "Plot ride time up against ideal Z across: nine points."}
```

The middle ride, 50, sits at $Z = 0$. From there the rides climb about 10 minutes for each unit of Z. So the straight line through the points is "50 plus 10 times Z".

Check the longest ride against that line:

$$\underbrace{50}_{\text{middle ride}} + \underbrace{1.28}_{\text{ideal Z of the 9th}} \times \underbrace{10}_{\text{minutes per unit of Z}} = \mathbf{62.8}$$

The real ride is 63. Every ride lands within a minute of its spot, so the nine points make a straight line. The rides look bell-shaped.

R places the ideal spots by a slightly adjusted rule, so its Z values differ a little from these. The picture is the same.

## The lab's version: 99 values and the 1st percentile

The lab tells the same story with 99 values from a normal variable X. Sort them: $X_1 \le X_2 \le \ldots \le X_{99}$.

- $X_1$ should sit near the 1st percentile, $P_1$.
- $X_2$ should sit near $P_2$, and so on up to $X_{99}$ near $P_{99}$.

Each percentile has its own Z. The 1st:

```r
qnorm(0.01)
```

```text
[1] -2.326348
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(0.01)` | The Z with area 0.01 to its left. The one value fills `p`; `mean` and `sd` are left out, so R uses 0 and 1. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `qnorm(0.01)`: "Find the cut-off (`qnorm`) with 1% of the standard bell to its left (`0.01`)."

**Right to left**, the order R runs it

- `qnorm(0.01)`: "Take the area 0.01, walk the standard bell from the left until that much is covered (`qnorm`), print the Z there."
:::

So $Z_1 = -2.326$, $Z_2 = -2.054$, and $Z_{99} = 2.326$. The lab's rule: *Plotting the "Sample Quantile" X1, X2, ... against the "Theoretical Quantiles" Z1, Z2, ... gives a straight line.*

That names R's two axes. Across: "Theoretical Quantiles", the ideal Z. Up: "Sample Quantiles", your sorted data.

## qqnorm draws the dots, qqline draws the line

The lab makes 30 values that surely come from a bell, then plots them:

```r
normal.data = rnorm(30, mean=4, sd=2)
qqnorm(normal.data, pch=20, main="QQ Plot of a Sample (n=30)")
qqline(normal.data, col="red", lty="dashed")
```

:::info R syntax
| Code | What it does |
|---|---|
| `normal.data = …` | `=` stores the result under the name `normal.data`, like `<-`. |
| `rnorm(30, mean=4, sd=2)` | 30 random values (`n` = 30) from the bell with `mean` 4 and `sd` 2. |
| `qqnorm(normal.data, …)` | Draws the QQ plot: sorted data up, ideal Z across. The first slot is the data. |
| `pch=20` | The point symbol: a small filled dot. |
| `main="QQ Plot of a Sample (n=30)"` | The title, a string in quotes. |
| `qqline(normal.data, …)` | Adds the reference line through the first and third quartiles to the plot just drawn. |
| `col="red"` | Draws the line in red. |
| `lty="dashed"` | The line type: dashed. |

**Left to right**

- `normal.data = rnorm(30, mean=4, sd=2)`: "Store under normal.data (`normal.data =`) thirty random normal values (`rnorm`) with mean 4 (`mean=4`) and sd 2 (`sd=2`)."
- `qqnorm(normal.data, pch=20, main=…)`: "Draw a normal QQ plot (`qqnorm`) of the data (`normal.data`) with small filled dots (`pch=20`) and a title (`main=`)."
- `qqline(normal.data, col="red", lty="dashed")`: "Add the reference line (`qqline`) for the data (`normal.data`), in red (`col="red"`), dashed (`lty="dashed"`)."

**Right to left**, the order R runs it

- `normal.data = rnorm(30, mean=4, sd=2)`: "Draw 30 values from the bell (`rnorm`), store them (`=`)."
- `qqnorm(normal.data, pch=20, main=…)`: "Sort the data, find each ideal Z, plot the pairs as dots (`qqnorm`)."
- `qqline(normal.data, col="red", lty="dashed")`: "Find the data's quartiles, draw the dashed line through them on the open plot (`qqline`)."
:::

On screen: 30 dots rising from left to right, a dashed line through them, "Theoretical Quantiles" across and "Sample Quantiles" up. The values are random, so your dots will differ from anyone else's.

**qqline adds to the plot qqnorm just drew, so it comes second, in the same chunk.** For example, a chunk with only `qqline` has no plot to draw on.

## Roughly on the line means normal

- **Roughly on the line: the data are bell-shaped.** The lab: *The fact that the data points roughly follow a line confirms that the sample comes from a normal population.*
- **A little wobble at the two ends is normal too.** *Note that the QQ plot graph gets a bit irregular at the edges. This is typical.* The lab's own 30-value plot strays at both ends, and the lab still calls it normal.
- **Use about 15 points or more.** Fewer than that, and a bell and a non-bell look alike.
- **A bigger sample gives a straighter line.** The lab redraws with 300 values, and the middle hugs the line.

:::tip Judge the middle, forgive the ends
A few end points off the line do not make the data non-normal. A steady curve does: the points leave the line and keep moving away from it.
:::

## Four ways to miss the line

The lab shows nine QQ plots of samples from bells: all follow the line, wobbling at the ends. Then it shows four from populations that are not bells.

```diagram
{"type": "grid", "title": "What the ends do tells you the shape", "nodes": [{"id": "h0", "label": "population", "row": 0, "col": 0}, {"id": "h1", "label": "left end", "row": 0, "col": 1}, {"id": "h2", "label": "middle", "row": 0, "col": 2}, {"id": "h3", "label": "right end", "row": 0, "col": 3}, {"id": "n0", "label": "bell", "row": 1, "col": 0}, {"id": "n1", "label": "on the line", "sub": "a little wobble", "row": 1, "col": 1}, {"id": "n2", "label": "on the line", "row": 1, "col": 2}, {"id": "n3", "label": "on the line", "sub": "a little wobble", "row": 1, "col": 3}, {"id": "r0", "label": "right skewed", "row": 2, "col": 0}, {"id": "r1", "label": "flat, just above", "row": 2, "col": 1}, {"id": "r2", "label": "near the line", "row": 2, "col": 2}, {"id": "r3", "label": "curves up steeply", "sub": "far above", "row": 2, "col": 3}, {"id": "t0", "label": "heavy tails", "row": 3, "col": 0}, {"id": "t1", "label": "drops below", "row": 3, "col": 1}, {"id": "t2", "label": "on the line", "row": 3, "col": 2}, {"id": "t3", "label": "climbs above", "row": 3, "col": 3}, {"id": "u0", "label": "no tails", "sub": "flat, like 0 to 1", "row": 4, "col": 0}, {"id": "u1", "label": "flattens, above", "row": 4, "col": 1}, {"id": "u2", "label": "on the line", "row": 4, "col": 2}, {"id": "u3", "label": "flattens, below", "row": 4, "col": 3}, {"id": "b0", "label": "two humps", "row": 5, "col": 0}, {"id": "b1", "label": "flattens, above", "row": 5, "col": 1}, {"id": "b2", "label": "steep jump across", "row": 5, "col": 2}, {"id": "b3", "label": "flattens, below", "row": 5, "col": 3}], "hi": ["n2"], "caption": "Ends steeper than the line: long tails. Ends flatter than the line: short tails."}
```

**An end steeper than the line means a long tail on that side. An end flatter than the line means a short tail.** For example, a long right tail makes the right end shoot up above the line.

In the lab's four pictures:

- **Right skewed** (two of them): the left end lies almost flat, just above the line. The right end curves up steeply, far above it. The run bends like a bowl.
- **Heavy tails**: on the line through the middle. The left end drops below it and the right end climbs above it.
- **No tails**: an S that flattens at both ends. Every value is squeezed between 0 and 1, so the ends cannot reach the line.

### A right-skewed sample

Watch the right end. The biggest values run far past where a bell would put them.

```widget
qq-build-play
{ "shape": "right", "n": 30, "title": "Right skewed: the right end curves up above the line" }
```

### A heavy-tailed sample

Watch both ends. The extremes sit farther out than a bell allows, on both sides.

```widget
qq-build-play
{ "shape": "heavy", "n": 30, "title": "Heavy tails: low end below the line, high end above it" }
```

### A two-hump sample

Watch the middle. Few values sit between the humps, so the dots jump across the line there.

```widget
qq-build-play
{ "shape": "bimodal", "n": 30, "title": "Two humps: flat ends and a steep jump in the middle" }
```

## Four litters of rats: the lab's check

The lab's last task uses the `genotype` data from the `MASS` package: the weight gain of rat litters, grouped by genotype A, B, I and J. Each group is small, under 30.

```r
library(MASS)
data(genotype)
group.A <- subset(genotype, Litter=="A")
qqnorm(group.A$Wt)
qqline(group.A$Wt, col="red")
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(MASS)` | Loads the `MASS` package, which holds the `genotype` data. |
| `data(genotype)` | Makes the data set `genotype` available by name. |
| `group.A <- subset(genotype, Litter=="A")` | `<-` stores. `subset` keeps the rows where the `Litter` column equals "A". |
| `==` | Tests whether two values are equal: TRUE or FALSE for each row. |
| `group.A$Wt` | `$` picks the column `Wt`, the weight gain, from `group.A`. |
| `qqnorm(…)`, `qqline(…, col="red")` | As above: the dots, then the red reference line. |

**Left to right**

- `library(MASS)`: "Load the package (`library`) called MASS (`MASS`)."
- `data(genotype)`: "Bring in the data set (`data`) called genotype (`genotype`)."
- `group.A <- subset(genotype, Litter=="A")`: "Store under group.A (`group.A <-`) the rows (`subset`) of genotype whose Litter equals A (`Litter=="A"`)."
- `qqnorm(group.A$Wt)`: "Draw the QQ plot (`qqnorm`) of the weight column (`$Wt`) of group A (`group.A`)."
- `qqline(group.A$Wt, col="red")`: "Add the reference line (`qqline`) for the same column, in red (`col="red"`)."

**Right to left**, the order R runs it

- `library(MASS)`: "Find MASS and attach it (`library`)."
- `data(genotype)`: "Load genotype (`data`)."
- `group.A <- subset(genotype, Litter=="A")`: "Test each row's Litter against A (`==`), keep the TRUE rows (`subset`), store them (`<-`)."
- `qqnorm(group.A$Wt)`: "Pull the Wt column (`$`), sort it, plot it against ideal Z (`qqnorm`)."
- `qqline(group.A$Wt, col="red")`: "Pull the column again, find its quartiles, draw the line (`qqline`)."
:::

The lab repeats it for B, I and J. Its answer: *Yes, all four qq plots are sufficiently close to a straight line to proceed with the assumption that they come from normal distributions.*

## Why a small sample needs a QQ plot, not a histogram

Fifteen values make a histogram of four or five bars. Move one value and a bar changes height.

The QQ plot uses every value once, in order. The lab: *When our samples are small, a QQ plot gives us a clearer picture of the distribution than a histogram.*

**You need it when n is under 30 and you need X-bar to be normal.** The pile of sample means is a bell when X is normal or when $n \ge 30$. Below 30, only the first door is open, so you must check X itself. For example, the rat groups are under 30, so each group's QQ plot is the check. The rule in full is [the Central Limit Theorem lesson](#/math3042-q9/clt-shape-rule).

## Judge plots from a bakery, a help desk and a print queue

A bakery weighs 25 loaves. A help desk logs 40 call lengths. A print queue records 35 job sizes.

```quiz
[
  {"q": "The QQ plot of the 40 call lengths: through the middle the dots follow the line. At the left end they lie almost flat, just above the line. At the right end they curve up steeply, far above it. What shape is the population?", "options": ["Right skewed: a long tail of long calls", "Normal: the middle is on the line", "Heavy tails on both sides", "Flat with no tails, like values squeezed between two limits"], "answer": 0, "explain": "The right end climbs far above the line: the longest calls run much longer than a bell would allow, a long right tail. The flat left end means a short left tail. A bowl that bends up is right skew."},
  {"q": "The QQ plot of the 25 loaf weights: every dot sits close to the line, except the lightest loaf a little below it and the heaviest a little above. Is it reasonable to treat the loaf weights as normal?", "options": ["Yes: the dots roughly follow the line, and a little wobble at the ends is typical", "No: two dots are off the line", "No: 25 is under 30, so a QQ plot cannot say", "Only if the two end loaves are deleted"], "answer": 0, "explain": "The lab: the plot gets a bit irregular at the edges, and this does not mean the sample is non-normal. Judge the middle; a single point at each end is wobble, not a bend. 25 is above the minimum of about 15."},
  {"q": "The 35 job sizes all lie between 0 and 1 MB. The QQ plot is an S: on the line in the middle, flattening above the line at the left and below it at the right. What shape is the population?", "options": ["No tails: flat, like values spread evenly between two limits", "Heavy tails on both sides", "Right skewed", "Normal"], "answer": 0, "explain": "Both ends go flatter than the line, so both tails are short: the values cannot run past 0 or past 1. Heavy tails would do the opposite, low end below and high end above."},
  {"type": "fill", "q": "Draw the QQ plot of the call lengths stored in `calls`. Type the function name.", "code": "___(calls, pch=20, main=\"Call lengths\")", "answer": ["qqnorm"], "explain": "`qqnorm(calls, pch=20, main=\"Call lengths\")` plots the sorted calls up against the ideal Z across."},
  {"type": "fill", "q": "Add a dashed reference line. Type the value, with its quotes.", "code": "qqline(calls, col=\"red\", lty=___)", "answer": ["\"dashed\"", "'dashed'"], "explain": "`lty` is the line type; `lty=\"dashed\"` draws it dashed, as in the lab."},
  {"q": "Twenty SkyTrain ride times are collected, and X-bar must be normal for the next step. What has to be checked?", "options": ["That the ride times themselves look normal, with a QQ plot", "Nothing: X-bar is always normal", "That n is at least 30", "That the QQ plot of X-bar is a line"], "answer": 0, "explain": "X-bar is normal when X is normal or when $n \\ge 30$. Here $n = 20$, so the second door is shut and X itself must look like a bell. A QQ plot of the 20 rides is the check."},
  {"type": "tf", "q": "A QQ plot of 8 values that lies close to the line shows the population is normal.", "answer": false, "explain": "The lab asks for about 15 data points at least. With 8, samples from bells and from skewed populations can both land near the line."},
  {"type": "text", "q": "The help desk's QQ plot of call lengths bends up far above the line at the right end. Do the call lengths come from a normal population? Answer yes or no.", "answer": ["NO", "No", "no"], "explain": "No. Points that climb far above the line and keep climbing are not wobble: the long calls run past where a bell would put them, a right skew."}
]
```

## Remember

- A QQ plot pairs sorted data (up) with ideal Z (across).
- Roughly a straight line: normal. A little wobble at the ends is typical.
- About 15 points at least. More points, straighter line.
- An end steeper than the line: a long tail. Flatter: a short tail.
- `qqnorm` first, then `qqline`, in the same chunk.
- Needed when n is under 30 and X-bar must be normal.
