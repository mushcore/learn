---
title: "qnorm, qexp, qunif: from a percentage back to a value"
minutes: 12
---
<!-- facts: none; every value is from Lab 8, the Unit 5 notes or the demo notebook, or computed -->
Some questions give the area and ask for the value: the 75th percentile voltage, the median wait. On paper that is the table read backwards or the ln line. In R it is the q function.

## q undoes p

**A q function takes an area to the left and returns the value with that much area below it.** It is the p function run backwards. Just like a class list sorted by height: p answers "what share is shorter than 170 cm", q answers "how tall is the student three quarters of the way up the list".

```diagram
{"type": "flow", "title": "p and q go opposite ways", "nodes": [{"id": "x", "label": "a value", "sub": "9.07 V"}, {"id": "p", "label": "p function", "sub": "pnorm"}, {"id": "a", "label": "an area", "sub": "0.8849"}, {"id": "q", "label": "q function", "sub": "qnorm"}, {"id": "x2", "label": "the value again", "sub": "9.07 V"}], "edges": [{"from": "x", "to": "p"}, {"from": "p", "to": "a"}, {"from": "a", "to": "q"}, {"from": "q", "to": "x2"}], "hi": ["q"], "caption": "pnorm(9.07, mean=9.01, sd=0.05) printed 0.8849 in the lab. Give that area to qnorm with the same mean and sd and 9.07 comes back."}
```

```diagram
{"type": "curve", "title": "A q function runs backwards: the area goes in, the cut-off comes out", "panels": [{"title": "qnorm(0.75, 9.01, 0.05)", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 9.0437, "label": "0.75 in", "tone": "hl"}], "lines": [{"x": 9.0437, "solid": true, "tone": "blue"}], "ticks": [{"x": 9.0437, "label": "9.044 out"}]}, {"title": "qexp(0.5, rate=0.1)", "x": [-2.7, 45], "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"to": 6.9315, "label": "0.5 in", "tone": "hl", "labelAt": [20, 0.55]}], "lines": [{"x": 6.9315, "solid": true, "tone": "blue"}], "ticks": [{"x": 6.9315, "label": "6.93 out"}]}, {"title": "qunif(0.3, 0, 20)", "x": [-3, 23], "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 0, "to": 6, "label": "0.3 in", "tone": "green"}], "lines": [{"x": 6, "solid": true, "tone": "blue"}], "ticks": [0, {"x": 6, "label": "6 out"}, 20]}]}
```

Each panel starts from a shaded area on the left, the number you type. The q function slides the cut until the area to its left is exactly that much, and returns where the cut stands.

## The voltage with three quarters of the batteries below it

The lab's batteries have voltages that follow a bell centred on 9.01 V. The widget shades the left 75 % of the bell and reads the table backwards to the cut-off.

```widget
normal-prob
{ "mu": 9.01, "sigma": 0.05, "lo": null, "hi": null, "p": 0.75, "title": "Battery voltages: the value with 0.75 of the area to its left, by table and by qnorm" }
```

## The 75th percentile in one line

The lab asks for the 75th percentile voltage.

- $\mu = 9.01$ V, the mean voltage.
- $\sigma = 0.05$ V, the standard deviation.
- $0.75$, the area that must lie to the left of the answer.

```r
P75 <- qnorm(0.75, mean=9.01, sd=0.05)
P75
```

```text
[1] 9.044
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(0.75, mean=9.01, sd=0.05)` | p = 0.75, the area to the left; `mean=` and `sd=` fix the bell. Returns a voltage. |
| `P75 <-` | `<-` stores the result under the name `P75`. Storing prints nothing. |
| `P75` | A name alone on a line prints its value. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `P75 <- qnorm(0.75, mean=9.01, sd=0.05)`: "Store under P75 (`P75 <-`) the value with 0.75 of the area to its left (`qnorm(0.75, …)`) on the bell with mean 9.01 (`mean=9.01`) and sd 0.05 (`sd=0.05`)."
- `P75`: "Show P75 (`P75`)."

**Right to left**, the order R runs it

- `P75 <- qnorm(0.75, mean=9.01, sd=0.05)`: "Build the bell, find where its area reaches 0.75 (`qnorm`), store that voltage (`P75 <-`)."
- `P75`: "Look up P75 and print it."
:::

On paper, 0.75 is closest to the table cell 0.7486, at $z = 0.67$. Then $x = \mu + Z\sigma$:

$$x = \underbrace{9.01}_{\text{mean}} + \underbrace{0.67}_{\text{table } z} \times \underbrace{0.05}_{\text{standard deviation}} = 9.0435 \approx \mathbf{9.04}$$

R prints 9.044 because it uses the exact z, 0.6745, not the table's two decimals. Both round to 9.04 V.

## The slots, by R's own names

**Each q function takes the area first, then the same curve numbers as its p function.**

```r
qunif(p, min, max)
qnorm(p, mean, sd)
qexp(p, rate)
```

:::info R syntax
| Code | What it does |
|---|---|
| `qunif(p, min, max)` | `p` the area to the left, `min` and `max` the ends of the rectangle. |
| `qnorm(p, mean, sd)` | `p` the area, `mean` μ, `sd` σ. Left out, `mean` is 0 and `sd` is 1, so it reads the Z table backwards. |
| `qexp(p, rate)` | `p` the area, `rate` 1/β. |

**Left to right**

- `qunif(p, min, max)`: "The uniform value (`qunif`) with area p (`p`) to its left, on min (`min`) to max (`max`)."
- `qnorm(p, mean, sd)`: "The normal value (`qnorm`) with area p (`p`) to its left, for this mean (`mean`) and sd (`sd`)."
- `qexp(p, rate)`: "The exponential value (`qexp`) with area p (`p`) to its left, at this rate (`rate`)."

**Right to left**, the order R runs it

- `qunif(p, min, max)`: "Build the rectangle, walk right until the area reaches p (`qunif`)."
- `qnorm(p, mean, sd)`: "Build the bell, walk right until the area reaches p (`qnorm`)."
- `qexp(p, rate)`: "Build the falling curve, walk right until the area reaches p (`qexp`)."
:::

The uniform one is the paper rule $a + p(b - a)$. For example, the bus wait uniform on 0 to 20 has 30 % of its area left of 6 minutes, so `qunif(0.3, 0, 20)` returns 6, computed:

$$x = \underbrace{0}_{a} + \underbrace{0.3}_{\text{area asked}} \times (\underbrace{20 - 0}_{\text{full width}}) = \mathbf{6}$$

:::info R syntax
| Code | What it does |
|---|---|
| `qunif(0.3, 0, 20)` | p = 0.3, min = 0, max = 20: the wait with 30 % of the rectangle to its left. |

**Left to right**

- `qunif(0.3, 0, 20)`: "The uniform value (`qunif`) with area 0.3 to its left on 0 to 20."

**Right to left**, the order R runs it

- `qunif(0.3, 0, 20)`: "Build the rectangle from 0 to 20, find where its area reaches 0.3 (`qunif`), print 6."
:::

## Larger than 95 %, lower than 95 %

**"Larger than 95 % of the voltages" means 0.95 of the area lies to its left. "Lower than 95 % of the voltages" means 95 % lies to its right, so only 0.05 lies to its left.** For example, the student taller than 95 % of the class stands near the top of the list; the student shorter than 95 % stands near the bottom.

```diagram
{"type": "curve", "title": "Larger than 95 % has 0.95 to its left; lower than 95 % has 0.05", "panels": [{"title": "Larger than 95 %: qnorm(0.95, …)", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 9.0922, "label": "0.95", "tone": "hl"}, {"from": 9.0922, "tone": "dim"}], "ticks": [9.01, {"x": 9.0922, "label": "9.092"}]}, {"title": "Lower than 95 %: qnorm(0.05, …)", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 8.9278, "label": "0.05", "tone": "hl", "labelAt": [8.87, 0.35]}, {"from": 8.9278, "label": "0.95", "tone": "blue"}], "ticks": [{"x": 8.9278, "label": "8.928"}, 9.01]}]}
```

On the left the cut sits high, with 0.95 of the bell below it. On the right the cut sits low: the 0.95 lies above it, so the number typed into `qnorm` is the 0.05 below.

The same batteries, with the mean and standard deviation stored first:

- $\mu = 9.01$ V, the mean voltage, stored as `mu`.
- $\sigma = 0.05$ V, the standard deviation, stored as `sig`.
- 0.95, 0.05 and 0.25: the areas to the left for the three questions.

```r
mu <- 9.01
sig <- 0.05
qnorm(0.95, mu, sig)
qnorm(0.05, mu, sig)
qnorm(0.25, mu, sig)
```

```text
[1] 9.092
[1] 8.928
[1] 8.976
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- 9.01`, `sig <- 0.05` | Stores the mean and the standard deviation. |
| `qnorm(0.95, mu, sig)` | Unnamed slots in R's order: p = 0.95, mean = mu, sd = sig. Larger than 95 % of voltages. |
| `qnorm(0.05, mu, sig)` | p = 0.05: lower than 95 % of voltages. |
| `qnorm(0.25, mu, sig)` | p = 0.25: the 25th percentile, the first quartile. |

**Left to right**

- `mu <- 9.01`, `sig <- 0.05`: "Store 9.01 under mu and 0.05 under sig (`<-`)."
- `qnorm(0.95, mu, sig)`: "The normal value (`qnorm`) with 0.95 of the area to its left."
- `qnorm(0.05, mu, sig)`: "The normal value (`qnorm`) with 0.05 of the area to its left."
- `qnorm(0.25, mu, sig)`: "The normal value (`qnorm`) with 0.25 of the area to its left."

**Right to left**, the order R runs it

- `mu <- 9.01`, `sig <- 0.05`: "Store both values (`<-`)."
- `qnorm(0.95, mu, sig)`, `qnorm(0.05, mu, sig)`, `qnorm(0.25, mu, sig)`: "Look up mu and sig, find where the area reaches 0.95, then 0.05, then 0.25 (`qnorm`), print each."
:::

:::warn "Lower than 95 %" is the 5th percentile
Typing 0.95 for it gives 9.092, the voltage at the top end. The value below 95 % of the batteries is near the bottom, 8.928.
:::

The table agrees to two decimals. For the first line the table gives $z = 1.645$, halfway between the cells 0.9495 and 0.9505:

$$x = \underbrace{9.01}_{\text{mean}} + \underbrace{1.645}_{\text{table } z} \times \underbrace{0.05}_{\text{standard deviation}} = 9.09225 \approx \mathbf{9.09}$$

The notes' demo does the same for the flight radiation, mean 4.35 mrem and standard deviation 0.5 mrem: `qnorm(0.95, mu, sigma)` returns 5.17 mrem, the notes' $4.35 + 1.645 \times 0.5$.

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(0.95, mu, sigma)` | p = 0.95, mean = mu (4.35 here), sd = sigma (0.5): the 95th percentile radiation. |

**Left to right**

- `qnorm(0.95, mu, sigma)`: "The normal value (`qnorm`) with 0.95 of the area to its left, for mean mu (`mu`) and sd sigma (`sigma`)."

**Right to left**, the order R runs it

- `qnorm(0.95, mu, sigma)`: "Look up mu and sigma, find where the area reaches 0.95 (`qnorm`), print it."
:::

## The exponential bus: median and quartiles

The lab's second bus has a mean wait of 10 minutes with no timetable. The curve starts high at 0 and falls, so half the waits are shorter than the mean. The widget's slider moves the area; the line `qexp` returns sits under it.

```widget
exp-wait
{ "beta": 10, "unit": "min", "p": 0.5, "mode": "percentile", "title": "Exponential bus, β = 10 min: the wait with half the area to its left" }
```

- $\beta = 10$, the mean wait in minutes, stored as `beta`.
- rate $= 1/\beta = 0.1$, the buses per minute.
- 0.5, 0.25 and 0.75: the areas for the median and the two quartiles.

```r
qexp(0.5, rate=1/10)
Q1 <- qexp(0.25, rate=1/beta)
Q3 <- qexp(0.75, rate=1/beta)
IQR <- Q3 - Q1
pexp(13.86, rate=1/beta)
```

:::info R syntax
| Code | What it does |
|---|---|
| `qexp(0.5, rate=1/10)` | p = 0.5, rate = 1/10: the median wait. |
| `Q1 <- qexp(0.25, rate=1/beta)` | The first quartile, stored as `Q1`. `beta` was stored as 10 earlier. |
| `Q3 <- qexp(0.75, rate=1/beta)` | The third quartile, stored as `Q3`. |
| `IQR <- Q3 - Q1` | Subtracts the stored quartiles and stores the interquartile range. |
| `pexp(13.86, rate=1/beta)` | The check: the area left of 13.86, Q3 rounded, should be close to 0.75. |

**Left to right**

- `qexp(0.5, rate=1/10)`: "The exponential value (`qexp`) with half the area to its left, rate one tenth (`rate=1/10`)."
- `Q1 <- qexp(0.25, rate=1/beta)`: "Store under Q1 (`Q1 <-`) the value with 0.25 to its left (`qexp`)."
- `Q3 <- qexp(0.75, rate=1/beta)`: "Store under Q3 (`Q3 <-`) the value with 0.75 to its left (`qexp`)."
- `IQR <- Q3 - Q1`: "Store under IQR (`IQR <-`) Q3 minus Q1 (`Q3 - Q1`)."
- `pexp(13.86, rate=1/beta)`: "The exponential area to the left of (`pexp`) 13.86."

**Right to left**, the order R runs it

- `qexp(0.5, rate=1/10)`: "Compute 0.1, find where the area reaches 0.5 (`qexp`), print it."
- `Q1 <- qexp(0.25, rate=1/beta)`: "Compute 0.1, find the 0.25 point (`qexp`), store it (`Q1 <-`)."
- `Q3 <- qexp(0.75, rate=1/beta)`: "Compute 0.1, find the 0.75 point (`qexp`), store it (`Q3 <-`)."
- `IQR <- Q3 - Q1`: "Look up both quartiles, subtract (`-`), store (`IQR <-`)."
- `pexp(13.86, rate=1/beta)`: "Measure the area up to 13.86 (`pexp`), print it."
:::

The lab printed 6.931 for the median and 0.7499 for the check, and gave the rest in words: Q1 = 2.8768, Q3 = 13.8629, IQR = 10.9861. The check returns 0.7499, not 0.75, because 13.86 is Q3 cut short.

On paper the median is the ln line $x = -\beta \ln(1 - p)$:

$$x = -\underbrace{10}_{\beta} \times \ln(1 - \underbrace{0.5}_{\text{area asked}}) = -10 \times \underbrace{(-0.693147)}_{\ln 0.5} = \mathbf{6.93}$$

The notes' teller, mean 2 minutes, works the same way: `qexp(0.75, rate)` returns 2.7726, computed, the 75th percentile of 2.77 minutes that `log(1 - 0.75)*-2` gave in [the p-function lesson](#/math3042-q8/r-p-functions).

:::info R syntax
| Code | What it does |
|---|---|
| `qexp(0.75, rate)` | p = 0.75; `rate` was stored as 1/2, the teller's customers per minute. |
| `log(1 - 0.75)*-2` | The same percentile from the formula: −2 × ln(0.25). |

**Left to right**

- `qexp(0.75, rate)`: "The exponential value (`qexp`) with 0.75 of the area to its left, at the stored rate (`rate`)."
- `log(1 - 0.75)*-2`: "The natural log (`log`) of one minus 0.75, times minus 2 (`*-2`)."

**Right to left**, the order R runs it

- `qexp(0.75, rate)`: "Look up rate, find where the area reaches 0.75 (`qexp`), print it."
- `log(1 - 0.75)*-2`: "Compute 0.25, take its ln (`log`), multiply by −2 (`*`)."
:::

## Pearson's skewness from the median

**Pearson's coefficient of skewness compares the mean with the median: $Sk = 3(\mu - \text{median})/\sigma$.** For example, a few very long bus waits pull the mean up past the median, and Sk comes out positive.

```diagram
{"type": "curve", "title": "A symmetric bell has Sk = 0; a long right tail makes Sk positive", "panels": [{"title": "Normal: mean = median", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "lines": [{"x": 0, "full": true, "tone": "purple", "label": "mean = median"}], "ticks": [0], "notes": [{"text": "Sk = 0", "at": [2.4, 0.7], "tone": "ink"}]}, {"title": "Exponential bus, β = 10", "x": [-2.7, 45], "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "lines": [{"x": 6.9315, "full": true, "tone": "blue", "label": "median 6.93", "side": "left"}, {"x": 10, "full": true, "tone": "purple", "label": "mean 10", "side": "right"}], "ticks": [0], "notes": [{"text": ["long tail pulls", "the mean right"], "at": [32, 0.5], "to": [30, 0.06], "tone": "red"}]}]}
```

The bell is the same on both sides, so its mean and median sit on one line. The exponential's tail stretches far to the right; the mean, 10, lies past the median, 6.93, and Sk = 3(10 − 6.93)/10 is positive.

For the exponential, every piece is known exactly.

- $\mu = \beta = 10$, the mean wait.
- median $= Q_2 = 6.931472$, from `qexp` at 0.5.
- $\sigma = \beta = 10$, the standard deviation of an exponential.

```r
Q2 <- qexp(0.50, rate=1/beta)
Sk <- 3*(beta - Q2)/beta
Sk
```

```text
[1] 0.9206
```

:::info R syntax
| Code | What it does |
|---|---|
| `Q2 <- qexp(0.50, rate=1/beta)` | The median, stored as `Q2`. |
| `3*(beta - Q2)/beta` | Pearson's formula: `beta` stands in for both the mean and the standard deviation. The brackets do the subtraction first. |
| `Sk <-`, `Sk` | Stores the result, then prints it. |

**Left to right**

- `Q2 <- qexp(0.50, rate=1/beta)`: "Store under Q2 (`Q2 <-`) the value with half the area to its left (`qexp`)."
- `Sk <- 3*(beta - Q2)/beta`: "Store under Sk (`Sk <-`) three times (`3*`) the mean minus the median (`beta - Q2`), divided by (`/`) the standard deviation (`beta`)."
- `Sk`: "Show Sk."

**Right to left**, the order R runs it

- `Q2 <- qexp(0.50, rate=1/beta)`: "Find the 0.5 point (`qexp`), store it (`Q2 <-`)."
- `Sk <- 3*(beta - Q2)/beta`: "Subtract inside the brackets, multiply by 3, divide by beta, store (`Sk <-`)."
- `Sk`: "Print Sk."
:::

$$Sk = \dfrac{3(\underbrace{10}_{\text{mean}} - \underbrace{6.931472}_{\text{median}})}{\underbrace{10}_{\text{standard deviation}}} = \mathbf{0.9206}$$

**A positive Sk means the long tail is on the right.** The lab's sentence: *Pearson's skewness is 0.9206, so X is skewed right significantly.* The course's descriptive unit calls Sk above +1 or below −1 highly skewed and anything between only mildly skewed, so 0.9206 sits just inside the line. The lab still answers "significantly", so follow the lab and show the comparison: "Sk = 0.92, positive and close to +1, so the wait is skewed right significantly."

## A bolt line, a help desk and a SkyTrain wait

A factory cuts bolts whose lengths follow a bell.

- $\mu = 50$ mm, the mean length.
- $\sigma = 0.4$ mm, the standard deviation.

A help desk's waits between calls are exponential.

- $\beta = 4$, the mean wait between calls in minutes.

A SkyTrain comes every 8 minutes and you arrive at a random moment, so the wait is uniform from 0 to the gap between trains.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$
- Exponential: $F(x) = 1 - e^{-x/\beta}$; $\mu = \beta$
- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- $x = \mu + Z\sigma$ for a normal percentile; $x = -\beta\ln(1-p)$ for an exponential percentile.
- The q function takes the area to the left of the answer.
- "Larger than k % of the values": k/100 to the left. "Lower than k % of the values" or "exceeded by only k %": 1 − k/100 to the left.
- β = 1/rate, in the question's time unit; R's rate slot takes 1/β.
:::

```quiz
[
  {"type": "fill", "q": "The bolt length that only 10 % of bolts exceed. Type the area that goes in the blank.", "code": "qnorm(___, 50, 0.4)", "answer": ["0.90", "0.9", ".9", ".90"], "explain": "Only 10 % above means 90 % below, and q takes the area to the left: `qnorm(0.90, 50, 0.4)`. By table, 0.90 is closest to the cell 0.8997 at $z = 1.28$: $$x = \\underbrace{50}_{\\text{mean}} + \\underbrace{1.28}_{\\text{table } z} \\times \\underbrace{0.4}_{\\text{standard deviation}} = \\mathbf{50.51}$$ R's exact z, 1.2816, gives 50.5126, also 50.51 mm."},
  {"type": "fill", "q": "The bolt length that is lower than 95 % of bolt lengths. Type the area that goes in the blank.", "code": "qnorm(___, 50, 0.4)", "answer": ["0.05", ".05"], "explain": "95 % lie above it, so 5 % lie below: `qnorm(0.05, 50, 0.4)`. By table $z = -1.645$: $$x = \\underbrace{50}_{\\text{mean}} - \\underbrace{1.645}_{\\text{table } z} \\times \\underbrace{0.4}_{\\text{standard deviation}} = \\mathbf{49.34}$$ Typing 0.95 gives 50.66 mm, the top end."},
  {"type": "fill", "q": "The median wait between help desk calls. Type the function name.", "code": "___(0.5, rate=1/4)", "answer": ["qexp"], "explain": "An area in, a time out, on the exponential: `qexp(0.5, rate=1/4)`. On paper: $$x = -\\underbrace{4}_{\\beta} \\times \\underbrace{(-0.693147)}_{\\ln(1 - 0.5)} = \\mathbf{2.77}$$ minutes, below the mean of 4 because the tail is on the right."},
  {"type": "fill", "q": "The 90th percentile help desk wait. Type what goes in the rate slot as a number or fraction.", "code": "qexp(0.9, rate=___)", "answer": ["1/4", "0.25", ".25"], "explain": "The rate is one over the mean wait, a quarter of a call per minute: `qexp(0.9, rate=1/4)`. On paper: $$x = -\\underbrace{4}_{\\beta} \\times \\underbrace{(-2.302585)}_{\\ln(1 - 0.9)} = \\mathbf{9.21}$$ minutes."},
  {"type": "fill", "q": "The SkyTrain wait with 30 % of waits shorter than it. Type the area that goes in the blank.", "code": "qunif(___, 0, 8)", "answer": ["0.30", "0.3", ".3", ".30"], "explain": "30 % shorter is 0.30 of the area to the left: `qunif(0.30, 0, 8)`. On paper: $$x = \\underbrace{0}_{a} + \\underbrace{0.30}_{\\text{area asked}} \\times (\\underbrace{8 - 0}_{\\text{full width}}) = \\mathbf{2.40}$$ minutes."},
  {"q": "The batteries have mean 9.01 V and standard deviation 0.05 V. Which line gives the voltage exceeded by only 10 % of batteries?", "options": ["`qnorm(0.90, 9.01, 0.05)`", "`qnorm(0.10, 9.01, 0.05)`", "`pnorm(0.90, 9.01, 0.05)`", "`1 - qnorm(0.10, 9.01, 0.05)`"], "answer": 0, "explain": "Exceeded by 10 % leaves 90 % to the left, and q takes the left area: `qnorm(0.90, 9.01, 0.05)`. By table: $$x = \\underbrace{9.01}_{\\text{mean}} + \\underbrace{1.28}_{\\text{table } z} \\times \\underbrace{0.05}_{\\text{standard deviation}} = \\mathbf{9.07}$$ V. 0.10 gives the bottom 10 %; `pnorm` expects a voltage, not an area; one minus a voltage is not a voltage."}
]
```

## Remember

- q takes the area to the left and returns the value: `qunif`, `qnorm`, `qexp`.
- The area goes first, then the same curve numbers as the p function.
- "Larger than 95 %" is 0.95; "lower than 95 %" is 0.05.
- On paper the normal answer is $\mu + Z\sigma$ with the table z; R's exact z can move the third decimal.
- Exponential percentile: $-\beta\ln(1-p)$; the median is $0.6931\beta$, below the mean.
- `rate=1/beta` in `qexp` as in `pexp`.
- Skewness: 3 × (mean − median) / sd, with `beta` as the mean and the sd and `Q2` as the median; positive means skewed right.
