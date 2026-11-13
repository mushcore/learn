---
title: "runif, rexp, rnorm: simulate, draw the histogram, count the share"
minutes: 12
---
<!-- facts: none; every value is from Lab 8 or computed -->
Part 2 also asks you to invent many waits or voltages in R, draw them, and count how many land in a range. The count checks the area you found with a p function.

## A simulated share estimates an area

**An r function makes random values that follow a curve. The share of those values below 6 estimates P(X < 6), and more values give a closer estimate.** Just like timing your bus wait on a thousand mornings: the share of mornings under 6 minutes settles near the true chance.

The lab's bus comes every 20 minutes and you arrive at a random moment, so the wait is uniform from 0 to 20: a flat rectangle 0.05 tall. The shaded strip is the area the simulation tries to hit.

```widget
pdf-area
{ "dist": "uniform", "a": 0, "b": 20, "lo": null, "hi": 6, "showCdf": false, "title": "Bus wait, uniform on 0 to 20: the area left of 6 that the simulated share estimates" }
```

## One random wait, then the slots

The lab starts with one wait.

- $n = 1$, how many values to make.
- $0$ and $20$, the shortest and longest possible waits in minutes.

```r
runif(n=1, min=0, max=20)
```

```text
[1] 12.74
```

:::info R syntax
| Code | What it does |
|---|---|
| `runif(n=1, min=0, max=20)` | Makes `n` = 1 random value on the rectangle from `min` = 0 to `max` = 20. Each slot is named. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `runif(n=1, min=0, max=20)`: "Make random uniform values (`runif`), one of them (`n=1`), between 0 (`min=0`) and 20 (`max=20`)."

**Right to left**, the order R runs it

- `runif(n=1, min=0, max=20)`: "Build the rectangle from 0 to 20, pick one point on it at random (`runif`), print it."
:::

A new run prints a different wait: 12.74 is the lab's one draw. **Each r function takes how many values first, then the same curve numbers as its p function.**

```r
runif(n, min, max)
rexp(n, rate)
rnorm(n, mean, sd)
```

:::info R syntax
| Code | What it does |
|---|---|
| `runif(n, min, max)` | `n` values on the rectangle from `min` to `max`. |
| `rexp(n, rate)` | `n` exponential waits; `rate` is 1/β. |
| `rnorm(n, mean, sd)` | `n` values from the bell with this `mean` and `sd`. |

**Left to right**

- `runif(n, min, max)`: "Make n (`n`) random uniform values (`runif`) between min (`min`) and max (`max`)."
- `rexp(n, rate)`: "Make n (`n`) random exponential waits (`rexp`) at rate (`rate`)."
- `rnorm(n, mean, sd)`: "Make n (`n`) random normal values (`rnorm`) with mean (`mean`) and sd (`sd`)."

**Right to left**, the order R runs it

- `runif(n, min, max)`: "Build the rectangle, draw n points from it (`runif`)."
- `rexp(n, rate)`: "Build the falling curve for this rate, draw n points (`rexp`)."
- `rnorm(n, mean, sd)`: "Build the bell, draw n points (`rnorm`)."
:::

:::warn n is how many values, not a value of X
A 6 in the first slot of `runif` makes six random waits. It does not measure the area left of 6; that is the job of `punif`.
:::

## The histogram of 100 000 waits

The lab draws $m = 10^5$ waits and plots them with `histogram` from the `mosaic` package. The package must be loaded once per session:

```r
library(mosaic)
X.min <- 0
X.max <- 20
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | Loads the `mosaic` package, which supplies `histogram`. |
| `X.min <- 0`, `X.max <- 20` | Stores the ends of the rectangle. The dot is part of the name. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) called mosaic (`mosaic`)."
- `X.min <- 0`, `X.max <- 20`: "Store 0 under X.min and 20 under X.max (`<-`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Find mosaic and attach its functions (`library`)."
- `X.min <- 0`, `X.max <- 20`: "Store both values (`<-`)."
:::

The lab's histogram block, as written:

```r
m.trials <- 10^5
X.vals <- runif(m.trials, X.min, X.max)
histogram(X.vals,
          breaks=seq(X.min, X.max, by=1),
          right=FALSE,
          type="density",
          xlab="X (min)", ylab="P(X)",
          main="Simulated Wait Times")
```

:::info R syntax
| Code | What it does |
|---|---|
| `m.trials <- 10^5` | `^` raises to a power: 100 000 values to make. |
| `runif(m.trials, X.min, X.max)` | n = m.trials, min = X.min, max = X.max. `X.vals` holds all 100 000 waits. |
| `histogram(X.vals, …)` | Draws bars of the waits; the first slot is the data. |
| `breaks=seq(X.min, X.max, by=1)` | `seq` counts from 0 to 20 in steps of 1, so the classes start at 0, 1, 2 and so on. |
| `right=FALSE` | Each class includes its left end, not its right: a wait of exactly 6 goes in the 6-to-7 class. |
| `type="density"` | Bar heights are scaled so the bar areas add to 1, so the bars sit on the pdf. |
| `xlab="X (min)", ylab="P(X)"` | The axis labels, each a string in quotes. |
| `main="Simulated Wait Times"` | The title. |

**Left to right**

- `m.trials <- 10^5`: "Store under m.trials (`m.trials <-`) ten to the fifth (`10^5`)."
- `X.vals <- runif(m.trials, X.min, X.max)`: "Store under X.vals (`X.vals <-`) m.trials random uniform waits (`runif`) from X.min to X.max."
- `histogram(X.vals, …)`: "Draw a histogram (`histogram`) of the waits (`X.vals`) with classes from 0 to 20 by 1 (`breaks=seq(…)`), left ends included (`right=FALSE`), bar areas adding to 1 (`type="density"`), labelled axes (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `m.trials <- 10^5`: "Compute 100 000 (`10^5`), store it (`<-`)."
- `X.vals <- runif(m.trials, X.min, X.max)`: "Look up the three names, draw 100 000 waits (`runif`), store them (`<-`)."
- `histogram(X.vals, …)`: "Build the class limits (`seq`), sort the waits into classes, scale the bars (`type="density"`), draw them with labels (`histogram`)."
:::

The picture is 20 bars of almost equal height near 0.05, the height of the rectangle. That is the flat pdf, drawn from data.

:::tip type="density" puts the bars on the curve
With it, each bar's area is the share of values in its class, so the bar tops trace $f(x)$. Bars of counts or percentages are far taller than the pdf and do not sit on it.
:::

The lab then redraws with $m = 100$ and builds the title from the value of `m.trials`:

```r
m.trials <- 10^2
X.vals <- runif(m.trials, X.min, X.max)
histogram(X.vals,
          breaks=seq(X.min, X.max, by=1),
          right=FALSE,
          type="density",
          xlab="X (min)", ylab="P(X)",
          main=paste0("Prob. Histogram of X (m = ", m.trials, " )"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `m.trials <- 10^2` | 100 values this time. |
| `runif(…)`, `breaks=`, `right=`, `type=`, `xlab=`, `ylab=` | As in the block above. |
| `paste0("Prob. Histogram of X (m = ", m.trials, " )")` | Joins the text, the value of `m.trials` and the closing text with nothing between: the title reads with 100 in it. |

**Left to right**

- `m.trials <- 10^2`: "Store 100 (`10^2`) under m.trials (`m.trials <-`)."
- `X.vals <- runif(m.trials, X.min, X.max)`: "Store under X.vals 100 random uniform waits (`runif`)."
- `histogram(X.vals, …)`: "Draw the same histogram (`histogram`) with a title joined (`paste0`) around the value of m.trials."

**Right to left**, the order R runs it

- `m.trials <- 10^2`: "Compute 100, store it."
- `X.vals <- runif(m.trials, X.min, X.max)`: "Draw 100 waits (`runif`), store them (`<-`)."
- `histogram(X.vals, …)`: "Build the title (`paste0`) and the class limits (`seq`), then draw (`histogram`)."
:::

The lab's answer to "how does it differ": *The histogram for m = 100 is way more irregular than with m = 10^5 simulated values.* With 100 waits, about 5 land in each class, so chance alone makes some bars twice as tall as others.

## Count the share below 6

**`X.vals < 6` gives TRUE or FALSE for each wait, and `sum` counts the TRUEs. Dividing by how many waits there are gives the share.** For example, if 3 of 10 waits are under 6 minutes, the share is 0.3.

```r
sum(X.vals < 6)/length(X.vals)
```

```text
[1] 0.2987
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals < 6` | Compares every wait with 6: TRUE where it is less, FALSE otherwise. |
| `sum(…)` | Adds the TRUEs as 1 and the FALSEs as 0: the count below 6. |
| `length(X.vals)` | How many values `X.vals` holds, here 100 000. |
| `/` | Divides the count by the total: the share. |

**Left to right**

- `sum(X.vals < 6)/length(X.vals)`: "The count (`sum`) of waits less than 6 (`X.vals < 6`), divided by (`/`) the number of waits (`length(X.vals)`)."

**Right to left**, the order R runs it

- `sum(X.vals < 6)/length(X.vals)`: "Test each wait against 6 (`<`), count the TRUEs (`sum`), count all the waits (`length`), divide (`/`)."
:::

The lab printed 0.2987 for the run with $10^5$ waits. The theory is the strip on paper:

```diagram
{"type": "curve", "title": "The simulated share 0.2987 estimates the area 0.3000", "x": [-2, 24], "xlabel": "X = wait (min)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 0, "to": 6, "label": "0.3000", "tone": "green"}], "ticks": [0, 6, 20], "notes": [{"text": ["simulated share:", "0.2987"], "at": [13, 0.55], "to": [5, 0.75], "tone": "hl"}]}
```

The strip from 0 to 6 covers 6 of the 20 minutes. Its area, 0.3000, is the target; the share of simulated waits below 6 lands next to it.

$$P(X < 6) = \dfrac{\underbrace{6 - 0}_{\text{strip width}}}{\underbrace{20 - 0}_{\text{full width}}} = \mathbf{0.3000}$$

The two differ by 0.0013. A new run gives a slightly different share, always close to 0.3000.

## The exponential and normal versions

The lab's second bus has no timetable: the wait is exponential with mean $\beta = 10$ minutes, a curve that starts high at 0 and falls.

- $\beta = 10$, the mean wait in minutes, stored as `beta`.
- $m = 10^5$, the number of waits to make.

```r
m.trials <- 10^5
X.vals <- rexp(m.trials, rate=1/beta)
histogram(X.vals, breaks=seq(0, 300, by=5), xlab="X (min)", ylab="P(X)", type="density",
          main=paste0("Prob Hist of X (m =", m.trials, " )"))
sum( X.vals < 6) / m.trials
```

```text
[1] 0.4529
```

:::info R syntax
| Code | What it does |
|---|---|
| `rexp(m.trials, rate=1/beta)` | n = m.trials waits, rate = 1/beta, 0.1 per minute. |
| `breaks=seq(0, 300, by=5)` | Classes 5 minutes wide from 0 to 300, so the long right tail fits. This lab block has no `right=FALSE`. |
| `sum( X.vals < 6) / m.trials` | The count below 6 divided by the number of waits. `m.trials` here does the job of `length(X.vals)`. |

**Left to right**

- `m.trials <- 10^5`: "Store 100 000 under m.trials (`<-`)."
- `X.vals <- rexp(m.trials, rate=1/beta)`: "Store under X.vals (`X.vals <-`) m.trials random exponential waits (`rexp`) at rate one over beta (`rate=1/beta`)."
- `histogram(X.vals, …)`: "Draw a histogram (`histogram`) with 5-minute classes up to 300 (`breaks=seq(0, 300, by=5)`), labels, density bars (`type="density"`) and a joined title (`paste0`)."
- `sum( X.vals < 6) / m.trials`: "The count (`sum`) of waits under 6 (`X.vals < 6`) divided by (`/`) m.trials."

**Right to left**, the order R runs it

- `m.trials <- 10^5`: "Compute 100 000, store it."
- `X.vals <- rexp(m.trials, rate=1/beta)`: "Compute 0.1, draw 100 000 waits (`rexp`), store them."
- `histogram(X.vals, …)`: "Build the classes (`seq`) and the title (`paste0`), draw the bars (`histogram`)."
- `sum( X.vals < 6) / m.trials`: "Test each wait (`<`), count the TRUEs (`sum`), divide (`/`)."
:::

The simulation gives 0.4529; the exact area, from `pexp`, is 0.4512, as in [the p-function lesson](#/math3042-q8/r-p-functions).

```diagram
{"type": "curve", "title": "The simulated share 0.4529 estimates the area 0.4512", "x": [-2.7, 45], "xlabel": "X = wait (min)", "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"to": 6, "label": "0.4512", "tone": "hl", "labelAt": [15, 0.55]}], "ticks": [0, 6, 10], "notes": [{"text": ["simulated share:", "0.4529"], "at": [30, 0.55], "tone": "hl"}]}
```

The shaded piece left of 6 is the exact area. The share of simulated waits under 6 is a close estimate of it.

On the histograms the lab wrote: *The histogram using 10^5 trials is much smoother and extends further to the right (although with very low probabilities).*

The lab's batteries have voltages on a bell, and a battery ships when its voltage is between 8.9 V and 9.1 V.

- $\mu = 9.01$ V, the mean voltage, stored as `mu`.
- $\sigma = 0.05$ V, the standard deviation, stored as `sig`.
- $8.9$ and $9.1$, the shipping limits.

```r
m.trials <- 10^5
X.vals <- rnorm(m.trials, mean=mu, sd=sig)
p2 <- sum(X.vals > 8.9 & X.vals < 9.1) / m.trials
```

:::info R syntax
| Code | What it does |
|---|---|
| `rnorm(m.trials, mean=mu, sd=sig)` | n = m.trials voltages from the bell with mean `mu` and sd `sig`. |
| `X.vals > 8.9 & X.vals < 9.1` | `&` is TRUE only where both tests are TRUE: voltages strictly between the limits. |
| `p2 <- sum(…) / m.trials` | The share that ships, stored as `p2`. |

**Left to right**

- `m.trials <- 10^5`: "Store 100 000 under m.trials (`<-`)."
- `X.vals <- rnorm(m.trials, mean=mu, sd=sig)`: "Store under X.vals 100 000 random normal voltages (`rnorm`) with mean mu (`mean=mu`) and sd sig (`sd=sig`)."
- `p2 <- sum(X.vals > 8.9 & X.vals < 9.1) / m.trials`: "Store under p2 (`p2 <-`) the count (`sum`) of voltages above 8.9 (`X.vals > 8.9`) and (`&`) below 9.1 (`X.vals < 9.1`), divided by (`/`) m.trials."

**Right to left**, the order R runs it

- `m.trials <- 10^5`: "Compute 100 000, store it."
- `X.vals <- rnorm(m.trials, mean=mu, sd=sig)`: "Draw 100 000 voltages (`rnorm`), store them."
- `p2 <- sum(X.vals > 8.9 & X.vals < 9.1) / m.trials`: "Test each voltage against both limits, keep TRUE where both hold (`&`), count (`sum`), divide (`/`), store (`p2 <-`)."
:::

The lab's run gave 0.9506. By the Z table the exact answer is 0.9641 − 0.0139 = 0.9502, worked in [the p-function lesson](#/math3042-q8/r-p-functions).

## The uniform's mean and standard deviation

**For a uniform on $a$ to $b$, the mean is the midpoint and the standard deviation is the width over $\sqrt{12}$.** For example, the bus wait on 0 to 20 averages 10 minutes, the middle of the rectangle.

```r
X.mean <- (X.min + X.max)/2
X.sig <- (X.max - X.min)/sqrt(12)
```

:::info R syntax
| Code | What it does |
|---|---|
| `(X.min + X.max)/2` | Brackets add first, then `/2` halves: the midpoint. |
| `(X.max - X.min)/sqrt(12)` | The width divided by `sqrt(12)`, the square root of 12. |

**Left to right**

- `X.mean <- (X.min + X.max)/2`: "Store under X.mean (`X.mean <-`) the sum of the ends (`X.min + X.max`) over 2 (`/2`)."
- `X.sig <- (X.max - X.min)/sqrt(12)`: "Store under X.sig (`X.sig <-`) the width (`X.max - X.min`) over the root of 12 (`sqrt(12)`)."

**Right to left**, the order R runs it

- `X.mean <- (X.min + X.max)/2`: "Add the ends, halve, store."
- `X.sig <- (X.max - X.min)/sqrt(12)`: "Subtract the ends, compute the root of 12 (`sqrt`), divide, store."
:::

$$\mu = \dfrac{\underbrace{0}_{a} + \underbrace{20}_{b}}{2} = \mathbf{10} \qquad \sigma = \dfrac{\underbrace{20 - 0}_{\text{width}}}{\underbrace{3.464102}_{\sqrt{12}}} = \mathbf{5.7735}$$

The lab: mean 10 and standard deviation 5.7735. Calling `mean(X.vals)` and `sd(X.vals)` right after the first histogram block, while `X.vals` still holds the 100 000 uniform waits, lands close to both.

:::info R syntax
| Code | What it does |
|---|---|
| `mean(X.vals)` | The average of the simulated waits. |
| `sd(X.vals)` | Their standard deviation. |

**Left to right**

- `mean(X.vals)`: "The average (`mean`) of the waits (`X.vals`)."
- `sd(X.vals)`: "The standard deviation (`sd`) of the waits (`X.vals`)."

**Right to left**, the order R runs it

- `mean(X.vals)`: "Take the waits, average them (`mean`)."
- `sd(X.vals)`: "Take the waits, compute their standard deviation (`sd`)."
:::

## Simulation against theory, in one sentence

```diagram
{"type": "flow", "title": "From random values to the check", "nodes": [{"id": "r", "label": "r function", "sub": "runif, rexp, rnorm"}, {"id": "v", "label": "m values", "sub": "X.vals"}, {"id": "h", "label": "histogram", "sub": "bars on the pdf"}, {"id": "s", "label": "the share", "sub": "sum(test)/m"}, {"id": "p", "label": "compare", "sub": "the p function"}], "edges": [{"from": "r", "to": "v"}, {"from": "v", "to": "h"}, {"from": "h", "to": "s"}, {"from": "s", "to": "p"}], "hi": ["p"], "caption": "The last part of the lab asks for one sentence comparing the share with the exact area."}
```

**A comparison sentence names both numbers, says they are close, and says why they differ.** A model: "The simulated share, 0.2987, is within 0.0013 of the theoretical 0.3000; the small gap is random, and with more values it shrinks." For example, the battery sentence would read 0.9506 against 0.9502.

## A SkyTrain wait, a bolt line and a help desk

A SkyTrain comes every 8 minutes and you arrive at a random moment, so the wait is uniform.

- $a = 0$, the shortest wait in minutes.
- $b = 8$, the longest wait.
- $m = 10^5$, the number of waits to simulate, stored as `m.trials`.

A factory cuts bolts whose lengths follow a bell.

- $\mu = 50$ mm, the mean length.
- $\sigma = 0.4$ mm, the standard deviation.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$; $\mu = \dfrac{a+b}{2}$; $\sigma^2 = \dfrac{1}{12}(b-a)^2$
- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- σ is the square root of the sheet's σ².
- The share of simulated values in a range estimates the area over that range.
- Every R function name, argument and operator: nothing in RStudio is on the sheet.
:::

```quiz
[
  {"type": "fill", "q": "Simulate the SkyTrain waits. Type the function name.", "code": "X.vals <- ___(m.trials, 0, 8)", "answer": ["runif"], "explain": "A uniform wait, random values: `X.vals <- runif(m.trials, 0, 8)`, n = m.trials, min = 0, max = 8."},
  {"type": "fill", "q": "Make each class include its left end. Type the logical value.", "code": "histogram(X.vals, breaks=seq(0, 8, by=0.5), right=___, type=\"density\")", "answer": ["FALSE", "F"], "explain": "`right=FALSE` puts a wait of exactly 3 in the 3-to-3.5 class, so the lower class limits are 0, 0.5, 1 and so on."},
  {"type": "fill", "q": "Make the bar areas add to 1 so the bars sit on the pdf. Type the value, with its quotes.", "code": "histogram(X.vals, breaks=seq(0, 8, by=0.5), right=FALSE, type=___)", "answer": ["\"density\"", "'density'"], "explain": "`type=\"density\"` scales the bars. For the SkyTrain they sit near the rectangle's height, $\\tfrac{1}{8} = 0.125$."},
  {"type": "fill", "q": "The simulated share of bolts between 49.4 and 50.6 mm. Type the operator that means both conditions.", "code": "X.vals <- rnorm(m.trials, 50, 0.4)\nsum(X.vals > 49.4 ___ X.vals < 50.6)/m.trials", "answer": ["&"], "explain": "`&` is TRUE where both tests hold. The share should land near the exact area: $$Z = \\dfrac{\\underbrace{50.6}_{\\text{upper limit}} - \\underbrace{50}_{\\text{mean}}}{\\underbrace{0.4}_{\\text{standard deviation}}} = 1.50$$ and $-1.50$ for 49.4, so $$\\underbrace{0.9332}_{\\text{table at } 1.50} - \\underbrace{0.0668}_{\\text{table at } -1.50} = \\mathbf{0.8664}$$ The doubled `&&` is for single TRUE/FALSE values, not a whole column of tests."},
  {"type": "fill", "q": "The simulated share of SkyTrain waits under 3 minutes. Type the function that counts the values.", "code": "sum(X.vals < 3)/___(X.vals)", "answer": ["length"], "explain": "`length(X.vals)` is how many waits there are. The share should land near $$\\dfrac{\\underbrace{3 - 0}_{\\text{strip width}}}{\\underbrace{8 - 0}_{\\text{full width}}} = \\mathbf{0.3750}$$"},
  {"type": "fill", "q": "Class limits 0, 0.5, 1, … up to 8. Type the function name.", "code": "breaks=___(0, 8, by=0.5)", "answer": ["seq"], "explain": "`seq(0, 8, by=0.5)` counts from 0 to 8 in steps of 0.5: 17 limits, 16 classes."},
  {"q": "The SkyTrain simulation is run once with m = 100 and once with m = 10^5, and each time the share of waits under 3 minutes is counted. What changes?", "options": ["With 10^5 values the histogram is smoother and the share lands closer to 0.375", "With 10^5 values the share is exactly 0.375", "With 100 values the bars sit higher, because fewer values are drawn", "Nothing: both runs give the same histogram, since the curve is the same"], "answer": 0, "explain": "More values, less random wobble: the bars settle near the height 0.125 and the share near 0.375. It is never exact, and `type=\"density\"` keeps the bar areas adding to 1 for any m."}
]
```

## Remember

- r makes random values: `runif`, `rexp`, `rnorm`. The first slot is how many.
- `histogram` is from `mosaic`: load it with `library`.
- `breaks=` with `seq` sets the class limits, `right=FALSE` includes the left end, `type="density"` puts the bars on the pdf.
- Share: `sum` of the test divided by `length` or `m.trials`.
- `&` means both conditions hold.
- More values: smoother histogram, share closer to the exact area. Never exactly equal.
- Compare in one sentence: both numbers, close, the gap is random.
