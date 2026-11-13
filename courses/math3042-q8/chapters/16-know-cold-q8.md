---
title: "Know cold for Quiz 8: three curves, three moves, the Z recipe, the exponential lines, the R letters"
minutes: 5
---
<!-- facts: none; a one-page reference sheet of Unit 5's formulas, table moves and Lab 8's R lines -->
Cover each right-hand column and say it aloud before you look.

## The three curves

**A probability is an area under the curve, and the whole area is 1.**

| | Shape | Area from | $\mu$ | $\sigma$ | Use it when |
|---|---|---|---|---|---|
| Uniform on $a$ to $b$ | a flat rectangle, height $\dfrac{1}{b-a}$ | width × height: $F(x) = \dfrac{x-a}{b-a}$ | $\dfrac{a+b}{2}$ | $\dfrac{b-a}{\sqrt{12}}$ | every value from $a$ to $b$ is equally likely: a random arrival at a stop with a fixed timetable |
| Normal $N(\mu, \sigma^2)$ | a bell, symmetric about $\mu$ | the Z table, after $Z = \dfrac{x-\mu}{\sigma}$ | $\mu$ | $\sigma$ | a measurement that clusters round a centre: volumes, diameters, voltages, scores |
| Exponential, mean $\beta$ | starts high at 0 and falls | $F(x) = 1 - e^{-x/\beta}$ | $\beta$ | $\beta$ | the wait until the next random event at a steady rate |

**One exact value has probability 0, so ≤ and < give the same area.** There is no "k − 1" step as in the binomial and the Poisson.

```diagram
{"type": "curve", "title": "The three shapes to sketch from memory", "panels": [{"title": "Uniform on a to b", "x": [-3, 23], "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "ticks": [{"x": 0, "label": "a"}, {"x": 20, "label": "b"}]}, {"title": "Normal", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "ticks": [{"x": 0, "label": "μ"}]}, {"title": "Exponential", "x": [-0.3, 5], "curves": [{"dist": "exp", "beta": 1, "tone": "red"}], "points": [{"x": 0, "tone": "red"}], "ticks": [0, {"x": 1, "label": "β"}]}]}
```

A flat rectangle that stops at a and b; a bell centred on μ; a curve that starts at its peak at 0 and falls with a long right tail.

## The three moves

| Words | Area | Uniform | Normal, by table | Exponential |
|---|---|---|---|---|
| less than $x$ | left | $\dfrac{x-a}{b-a}$ | the table at $z$ | $1 - e^{-x/\beta}$ |
| more than $x$ | right | $\dfrac{b-x}{b-a}$ | $1 -$ the table at $z$ | $e^{-x/\beta}$ |
| between $c$ and $d$ | big left minus small left | $\dfrac{d-c}{b-a}$ | table at $z_d$ minus table at $z_c$ | $e^{-c/\beta} - e^{-d/\beta}$ |

A strip that sticks out past $b$ is cut off at $b$. Half the normal area lies on each side of $\mu$, so the table at 0.00 is 0.5000.

```diagram
{"type": "curve", "title": "Left, right, between: shade first, then pick the move", "panels": [{"title": "less than x", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.8, "tone": "hl"}], "ticks": [{"x": 0.8, "label": "x"}]}, {"title": "more than x", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.8, "tone": "blue"}, {"from": 0.8, "tone": "hl"}], "ticks": [{"x": 0.8, "label": "x"}]}, {"title": "between c and d", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": -0.9, "to": 1.2, "tone": "hl"}], "ticks": [{"x": -0.9, "label": "c"}, {"x": 1.2, "label": "d"}]}]}
```

In each panel the highlighted area is the one asked for. In the middle panel the blue part is what a left-area tool hands you, and the highlighted tail is what is left of the whole.

## The Z recipe

| Direction | Steps |
|---|---|
| Forwards: value → area | 1. $Z = \dfrac{x-\mu}{\sigma}$. 2. **Round Z to 2 decimals.** 3. Row = Z to one decimal, column = the second decimal; the cell is the area to the left. 4. Apply the move. |
| Backwards: area → value | 1. Turn the words into the area to the **left**. 2. Find that area inside the table, read z off the row and column. 3. $x = \mu + Z\sigma$. |
| Unusual | **Z below −2 or above 2.** Answer YES or NO and show Z. |

| Area to the left | 0.90 | 0.95 | 0.975 | 0.99 | 0.10 | 0.05 | 0.025 | 0.01 |
|---|---|---|---|---|---|---|---|---|
| $z$ | 1.28 | 1.645 | 1.96 | 2.33 | −1.28 | −1.645 | −1.96 | −2.33 |

0.95 falls between the cells 0.9495 (1.64) and 0.9505 (1.65), so the instructor takes 1.645.

```diagram
{"type": "curve", "title": "Forwards: value in, area out. Backwards: area in, value out", "panels": [{"title": "Forwards (table, p function)", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.9, "label": "area = ?", "tone": "hl"}], "lines": [{"x": 0.9, "solid": true, "tone": "blue"}], "ticks": [{"x": 0.9, "label": "x known"}]}, {"title": "Backwards (table inside, q function)", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.9, "label": "area known", "tone": "blue"}], "lines": [{"x": 0.9, "solid": true, "tone": "hl"}], "ticks": [{"x": 0.9, "label": "x = ?"}]}]}
```

Same picture both ways. Forwards, the cut is given and the shaded area is the answer. Backwards, the shaded area is given and the cut is the answer.

## The exponential lines

| Want | Line |
|---|---|
| $\beta$ from a rate | $\beta = \dfrac{1}{\text{rate}}$, in the question's unit: 12 per hour gives $\beta = 60/12 = 5$ minutes |
| percentile $p$ | $x = -\beta\ln(1-p)$, from $1 - e^{-x/\beta} = p$ |
| median | $\beta\ln 2 = 0.6931\,\beta$, below the mean $\beta$: skewed right |
| memoryless | given $s$ already waited, subtract $s$ from every bound and answer as if starting fresh |
| the same, in the instructor's layout | $P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$, e.g. $\dfrac{P(c \le X \le d)}{P(X \ge s)}$ |
| link to Poisson | $P(\text{wait} > t) = e^{-t/\beta}$ is the Poisson chance of no events in time $t$ |

## The chain shapes

| Shape | The chain |
|---|---|
| normal → binomial | a normal area becomes $p$ (carry 4 decimals); then $C(n,x)\,p^x q^{n-x}$, at least one $= 1 - q^n$, $\mu = np$, $\sigma = \sqrt{npq}$ |
| rate → exponential | rate per hour → $\beta$ in minutes → $F(x)$, a tail, a percentile |
| threshold between two levels | the midpoint is the cut-off; misread when the noise passes half the gap |
| tolerance band | outside the band $= 1 - (\text{table at } z_{hi} - \text{table at } z_{lo})$ |

## The d, p, q, r slots

The first letter says what comes back; the slots are R's own argument names. `rate` is $1/\beta$.

| Letter | Gives | Uniform | Normal | Exponential |
|---|---|---|---|---|
| d | the height of the curve, **not** a probability | `dunif(x, min, max)` | `dnorm(x, mean, sd)` | `dexp(x, rate)` |
| p | the area to the left of q | `punif(q, min, max)` | `pnorm(q, mean, sd)` | `pexp(q, rate)` |
| q | the value with area p to its left | `qunif(p, min, max)` | `qnorm(p, mean, sd)` | `qexp(p, rate)` |
| r | n random values | `runif(n, min, max)` | `rnorm(n, mean, sd)` | `rexp(n, rate)` |

Right tail: `1 - pnorm(x, mu, sig)` or `pnorm(x, mu, sig, lower.tail=FALSE)`. Between: `pnorm(d, mu, sig) - pnorm(c, mu, sig)`. `pnorm(z)` alone uses mean 0 and sd 1. `exp(x)` is $e^x$, `log(x)` is ln, `sqrt(x)` the root.

## The Lab 8 lines

| Job | R line |
|---|---|
| simulate | `X.vals <- runif(m.trials, X.min, X.max)`, with `m.trials <- 10^5` |
| histogram (`library(mosaic)`) | `histogram(X.vals, breaks=seq(X.min, X.max, by=1), right=FALSE, type="density", xlab="X (min)", ylab="P(X)", main="Simulated Wait Times")` |
| simulated share | `sum(X.vals < 6)/length(X.vals)` printed 0.2987; theory 0.3000 |
| both conditions | `sum(X.vals > 8.9 & X.vals < 9.1) / m.trials` printed 0.9506; theory 0.9502 |
| uniform mean and sd | `(X.min + X.max)/2` and `(X.max - X.min)/sqrt(12)`: 10 and 5.7735 |
| exponential quartiles | `Q1 <- qexp(0.25, rate=1/beta)`, `Q3 <- qexp(0.75, rate=1/beta)`, `IQR <- Q3 - Q1` |
| skewness | `Sk <- 3*(beta - Q2)/beta` printed 0.9206: mean β, median Q2, sd β |
| the comparison sentence | more simulated values give a smoother histogram, closer to the curve, and a share closer to the p function's value |

`breaks` sets the class limits; `right=FALSE` puts each class's left end in it; `type="density"` makes the bar areas add to 1 so the bars sit on the pdf.

## Rounding and the traps

**A probability to 4 decimals; μ, σ, Z and a time to 2.** Carry 6 digits until the last line.

| Trap | The right line |
|---|---|
| `pexp` takes the rate | **`pexp(6, rate=1/beta)`**, never `pexp(6, beta)` |
| $N(\mu, \sigma^2)$ holds the variance | $N(100, 15^2)$: $\sigma = 15$; $\sigma^2 = 1.3225$ gives $\sigma = 1.15$ |
| the sheet gives $\sigma^2$ | take the root: uniform $\sigma = (b-a)/\sqrt{12}$, exponential $\sigma = \beta$ |
| `dunif` is a height | `dunif(4, 0, 20)` returns 0.05; $P(T = 4) = 0$ |
| Z unrounded at the table | round Z to 2 decimals first; table 0.9082 and R 0.9088 differ for that reason |
| a negative z | use the negative page of the table; the area is less than 0.5 |
| "lower than 95 %" | that value has 5 % below it: the 5th percentile, `qnorm(0.05, mu, sig)` |
| β in hours, x in minutes | convert first: β and x in the same unit |

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Exponential: $F(x) = 1 - e^{-x/\beta}$; $\mu = \beta$; $\sigma^2 = \beta^2$
- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- β = 1/rate, in the question's time unit.
- $x = \mu + Z\sigma$ for a normal percentile; $x = -\beta\ln(1-p)$ for an exponential one.
- Right tail is 1 minus the table.
:::

```quiz
[
  {
    "type": "fill",
    "q": "The help-desk wait has a mean of 4 minutes, and no `beta` is stored. P(wait < 6). Fill the rate slot with a number.",
    "code": "pexp(6, rate=___)",
    "answer": ["1/4", "0.25", ".25"],
    "explain": "`pexp(q, rate)` takes the rate, $1/\\beta = 1/4 = 0.25$ per minute. `rate=4` would describe a wait whose mean is a quarter of a minute."
  },
  {
    "type": "fill",
    "q": "The voltage lower than 90 % of batteries. Fill the area, as a decimal.",
    "code": "qnorm(___, mu, sig)",
    "answer": ["0.10", "0.1", ".1", ".10"],
    "explain": "Lower than 90 % of batteries means 90 % lie above it, so only 0.10 of the area is to its left: the 10th percentile, not the 90th."
  },
  {
    "type": "fill",
    "q": "A normal percentile from the z read in the table.",
    "code": "x = mu + ___ * sigma",
    "answer": ["Z", "z"],
    "explain": "$$x = \\mu + Z\\sigma$$ Z is the number of standard deviations from the mean, so a negative Z gives a value below the mean."
  },
  {
    "type": "fill",
    "q": "The standard deviation of a uniform on `a` to `b`.",
    "code": "sigma = (b - a)/sqrt(___)",
    "answer": ["12"],
    "explain": "The sheet gives $\\sigma^2 = \\dfrac{1}{12}(b-a)^2$; the root is $\\dfrac{b-a}{\\sqrt{12}}$."
  },
  {
    "type": "fill",
    "q": "The share of simulated values strictly between 8.9 and 9.1. Fill the operator.",
    "code": "sum(X.vals > 8.9 ___ X.vals < 9.1) / m.trials",
    "answer": ["&"],
    "explain": "`&` is and, value by value: TRUE only when both conditions hold."
  },
  {
    "type": "fill",
    "q": "Density bars whose areas add to 1. Fill the string, quotes included.",
    "code": "histogram(X.vals, breaks=seq(0, 15, by=1), right=FALSE, type=___)",
    "answer": ["\"density\"", "'density'"],
    "explain": "`type=\"density\"` makes each bar's area the share of values in its class, so the bars sit on the pdf."
  }
]
```
