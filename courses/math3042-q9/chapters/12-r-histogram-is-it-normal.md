---
title: "A histogram with a fitted normal curve: does it look like a bell?"
minutes: 8
---
<!-- facts: none; the ExponentialMeans code, its results table and its two answers are Lab 9's, quoted exactly; the four sketch histograms are made-up shapes computed in the writer's check script -->
Part 2 asks "is it normal?" more than once: of the raw data, and of the pile of sample means. The first look is always the same picture: bars, with a bell laid over them.

## Bars, and a bell laid over them

Draw the values as a histogram. Then lay over it the one bell that has the same centre and the same spread as the values. **If the bars follow that bell, the values are normal. If they do not, they are not.** "Bell-shaped" and "normal" mean the same thing here.

Just like laying a paper template over a drawing: where the drawing pokes out from under the template, the shapes differ.

This is how the pile of sample means is judged too. Each blue dot is one sample's $\bar{X}$ (say "X-bar"). Ten thousand of them make the bars. The question is whether those bars make a bell.

## One command: histogram with fit="normal"

**`histogram` comes from the `mosaic` package. With `type="density"` the bar areas add to 1, and `fit="normal"` draws the fitted normal curve over the bars.** For example, if `Xbar.vals` holds the pile from [the simulation lesson](#/math3042-q9/r-simulate-xbar), this draws it with its bell:

```r
library(mosaic)
histogram(Xbar.vals, type="density", fit="normal",
          xlab="Xbar", ylab="Probability Density",
          main="Sampling Distribution of Xbar")
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | Loads the `mosaic` package, which supplies `histogram`. Once per session is enough. |
| `histogram(Xbar.vals, …)` | Draws bars of the values in `Xbar.vals`; the first argument is the data. R picks the class limits. |
| `type="density"` | Scales the bars so their areas add to 1. The bars and the curve then share one vertical scale. |
| `fit="normal"` | Draws a normal curve with the same centre and spread as the data over the bars. |
| `xlab="Xbar", ylab="Probability Density"` | The axis labels, each a string in quotes. |
| `main="Sampling Distribution of Xbar"` | The title. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) called mosaic (`mosaic`)."
- `histogram(Xbar.vals, …)`: "Draw a histogram (`histogram`) of the sample means (`Xbar.vals`) with bar areas adding to 1 (`type="density"`), a fitted normal curve on top (`fit="normal"`), axis labels (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Find mosaic and attach its functions (`library`)."
- `histogram(Xbar.vals, …)`: "Take the values (`Xbar.vals`), sort them into classes, scale the bars (`type="density"`), find their mean and spread and draw that bell (`fit="normal"`), add the labels (`histogram`)."
:::

:::warn fit="normal" draws a bell; it does not make the data a bell
The curve is always a perfect bell, whatever the data. The verdict comes from comparing the bars with it, never from the curve alone.
:::

## A bell passes three checks

**A histogram is normal when it has one hump, is symmetric about that hump, and has bars that follow the curve up and back down.** For example, the bags from a well-run filling line pile up around the target weight, tail off evenly on both sides, and sit under the curve.

```diagram
{"type": "curve", "title": "Normal: one hump, symmetric, bars under the curve", "x": [-1, 11], "curves": [{"dist": "bars", "start": 0, "values": [0.005, 0.02, 0.057, 0.12, 0.188, 0.219, 0.188, 0.12, 0.057, 0.02, 0.005]}, {"dist": "normal", "mu": 5, "sigma": 1.8, "tone": "hl", "label": "fitted curve", "labelAt": [8.4, 0.62]}], "ticks": [], "caption": "The bar tops trace the curve: up on the left, one peak, the same way down on the right."}
```

The three checks, in order:

- **One hump.** The bars rise to a single peak.
- **Symmetric.** The left side is the mirror of the right side.
- **The bars follow the curve.** No bar pokes far above it; no stretch of the curve floats over empty space.

Small gaps between bar tops and the curve are random wobble. Judge the overall shape, not single bars.

## Three ways to fail: skewed, two humps, flat

**A histogram is not normal when it is skewed, has two humps, or is flat.** Each failure has a picture you can spot in a second.

```diagram
{"type": "curve", "title": "Three histograms that are not normal", "panels": [{"title": "Skewed", "x": [-4.6, 9.8], "curves": [{"dist": "bars", "start": 0, "values": [0.393, 0.239, 0.145, 0.088, 0.053, 0.032, 0.02, 0.012, 0.007, 0.004]}, {"dist": "normal", "mu": 1.47, "sigma": 1.79, "tone": "hl"}], "ticks": [], "notes": [{"text": "long tail", "at": [6.5, 0.4], "to": [6.5, 0.12]}, {"text": "curve, no bars", "at": [-3, 0.75], "to": [-1.5, 0.17]}]}, {"title": "Two humps", "x": [-2, 12], "curves": [{"dist": "bars", "start": 0, "values": [0.03, 0.121, 0.191, 0.121, 0.03, 0.006, 0.03, 0.121, 0.191, 0.121, 0.03]}, {"dist": "normal", "mu": 5, "sigma": 3.162, "tone": "hl"}], "ticks": [], "notes": [{"text": "dip under the peak", "at": [5, 0.92], "to": [5, 0.1]}]}, {"title": "Flat", "x": [-3, 12], "curves": [{"dist": "bars", "start": 0, "values": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]}, {"dist": "normal", "mu": 4.5, "sigma": 2.87, "tone": "hl"}], "ticks": [], "notes": [{"text": "flat bars", "at": [10.5, 0.95], "to": [8.6, 0.68]}]}], "caption": "In each panel the fitted curve has the data's own centre and spread, and still does not fit."}
```

- **Skewed.** The tallest bars sit at one end and a long tail of short bars runs off the other. The curve spills past the short end where there are no bars. For example, download times: most are quick, a few take very long.
- **Two humps.** Two separate peaks with a dip between them, right where the curve is highest. For example, a mix of two groups, each with its own typical value.
- **Flat.** All bars about the same height. The curve bulges above the middle bars and drops below the end bars. For example, the last digit of a receipt total: every digit is about as common as any other.

## The lab's exponential pile: skewed at n = 1, a bell by n = 50

The lab repeats the simulation with a population that is not a bell. X is exponential: a curve that starts high at 0 and falls, with a long right tail.

- $\beta = 0.25$, the population mean: the pink line, the truth.
- $\sigma = 0.25$, the population standard deviation. For an exponential it equals the mean.
- $n$ = 1, 2, 10, 50 and 100, the sample sizes.
- $10^5$, the number of samples for each $n$.

The function is the normal one with two changes: the sample comes from `rexp`, and the axis runs from −0.2 to 1.

```r
ExponentialMeans <- function(m.trials, n.sample){
  Xbar.vals <- numeric(m.trials)
  for (i in 1:m.trials){
    Xbar.vals[i] <- mean(rexp(n.sample, rate = 1/0.25))
  }
  h <- histogram(Xbar.vals, col="pink",
                 xlim=c(-0.2, 1),
                 type="density", fit="normal",
                 xlab="Xbar",
                 ylab="Probability Density",
                 main=paste0("Sampling Distribution of Xbar (n = ", n.sample,")"))
  return(list(mean(Xbar.vals), sd(Xbar.vals), h))
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `ExponentialMeans <- function(m.trials, n.sample){ … }` | Makes a function with two inputs: the number of samples and the size of each. |
| `numeric(m.trials)`, `for (i in 1:m.trials){ … }`, `Xbar.vals[i] <- …` | `m.trials` zeros, then one slot filled per sample; `[i]` is slot number i. |
| `rexp(n.sample, rate = 1/0.25)` | `n` = `n.sample` random values from the exponential; `rate` is 1/β, here 4. |
| `mean(…)` | Averages one sample into one X-bar. |
| `col="pink"`, `xlim=c(-0.2, 1)` | The bar fill colour; the x-axis from −0.2 to 1 for every n. `c()` joins two numbers. |
| `type="density", fit="normal"` | Bar areas add to 1; a fitted normal curve on top. |
| `xlab=`, `ylab=`, `main=paste0(…)` | Axis labels; `paste0` joins the title text and the value of `n.sample`. |
| `return(list(mean(Xbar.vals), sd(Xbar.vals), h))` | Hands back three results in order: the mean, the sd, the histogram. |

**Left to right**

- `ExponentialMeans <- function(m.trials, n.sample){ … }`: "Store under ExponentialMeans (`<-`) a function (`function`) of m.trials and n.sample."
- `Xbar.vals <- numeric(m.trials)`: "Store under Xbar.vals m.trials zeros (`numeric`)."
- `for (i in 1:m.trials){ … }`: "For each i (`for`), put in slot i (`Xbar.vals[i] <-`) the average (`mean`) of n.sample exponential values at rate 1/0.25 (`rexp`, `rate = 1/0.25`)."
- `h <- histogram(…)`: "Store under h a density histogram (`histogram`, `type="density"`) with a fitted normal curve (`fit="normal"`), an axis from −0.2 to 1 (`xlim`), labels and a joined title (`paste0`)."
- `return(list(…))`: "Hand back (`return`) a list (`list`) of the mean, the sd and h."

**Right to left**, the order R runs it

- `ExponentialMeans <- function(m.trials, n.sample){ … }`: "Build the function, store it (`<-`)."
- `Xbar.vals <- numeric(m.trials)`: "Make the zeros (`numeric`), store them."
- `for (i in 1:m.trials){ … }`: "Each time round, compute the rate, draw (`rexp`), average (`mean`), write into slot i."
- `h <- histogram(…)`: "Join the title (`paste0`), build the histogram (`histogram`), store it."
- `return(list(…))`: "Compute the mean (`mean`) and sd (`sd`), pack them with h (`list`), hand them back (`return`)."
:::

### The pile of X-bar from a skewed population, n = 1 to 100

Each step draws the skewed population on top and the pile of sample means below, on the same axis. Watch the tail on the right shrink, step by step, until the pile is a bell.

```widget
xbar-n-play
{"pop": "exp", "mu": 0.25, "ns": [1, 2, 10, 50, 100], "title": "X-bar from an exponential population: skewed for small n, a bell by n = 50"}
```

What the lab's five histograms show, in words:

- **n = 1:** the tallest bars at the left, a long tail to the right. The curve spills left of 0, where there are no bars. Skewed.
- **n = 2:** still a tall left side and a long right tail. Skewed.
- **n = 10:** one hump, nearly under the curve, with a short tail on the right.
- **n = 50 and n = 100:** narrow, symmetric, and the bars follow the curve. A bell.

The lab's printed results, with the theory beside them:

| n | mean of X-bar | sd of X-bar | theory 0.25/√n |
|---|---|---|---|
| 1 | 0.2487196 | 0.2500469 | 0.25 |
| 2 | 0.2495143 | 0.1763285 | 0.1768 |
| 10 | 0.2500092 | 0.0795868 | 0.0791 |
| 50 | 0.2499962 | 0.035486 | 0.0354 |
| 100 | 0.2499799 | 0.0249375 | 0.025 |

For example, at $n = 50$ the green arrow, the width of the pile, is:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{0.25}_{\sigma}}{\underbrace{\sqrt{50}}_{\sqrt{n}}} = \mathbf{0.0354}$$

The simulation printed 0.035486. The centre stays near 0.25 for every $n$.

The lab's answers, word for word. On the centre and the width: *The mean* $\mu_{\bar{X}}$ *does not change significantly, however* $\sigma_{\bar{X}}$ *decreases from about 0.25 to about 0.025 as n becomes larger.* On the shape: *For small samples, the distribution of* $\bar{X}$ *is highly skewed like the exponential distribution. As n increases beyond about 10, the shape becomes closer to a "bell shaped" normal.*

**The population stays skewed. Only the pile of sample means turns into a bell, and only once n is large.** The rule behind that is [the Central Limit Theorem](#/math3042-q9/clt-shape-rule).

## The answer in one sentence: verdict, then reason

**A good answer says yes or no, then names the shape it saw and whether the bars follow the curve.** Just like a referee's call: the decision first, then what was seen.

- For the exponential pile at $n = 1$: "No. The histogram is skewed to the right, with a long tail, and the bars do not follow the fitted normal curve."
- For the exponential pile at $n = 50$: "Yes. The histogram has one symmetric hump and the bars follow the fitted normal curve closely."

:::tip Name what you saw, not just the verdict
"No, it is not normal" earns less than "No, it has two humps." The reason is the shape word: skewed, two humps, flat, or one symmetric hump.
:::

For a small sample, a histogram has too few bars to judge well. [The QQ plot](#/math3042-q9/qq-plot) is the clearer test there.

## Download times, shuttle rides and receipt digits

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\overline{X}$ is normally distributed as long as: X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- The three checks: one hump, symmetric, bars follow the curve.
- The three failures: skewed, two humps, flat.
- The package, the function and every argument name are typed from memory.
:::

```quiz
[
  {"q": "A histogram of 2000 file download times has its tallest bars at the left, then shorter and shorter bars trailing far to the right. The fitted curve spills past the left end, where there are no bars. Is the download time normal?", "options": ["No: it is skewed to the right", "No: it has two humps", "Yes: it has one hump, so it is a bell", "Yes: the fitted curve is drawn, so the data are normal"], "answer": 0, "explain": "One hump is not enough: it must also be symmetric and the bars must follow the curve. A long tail on one side is skew. The curve is drawn for any data, so its presence proves nothing."},
  {"q": "A campus shuttle runs an express route and a local route. A histogram of all ride times shows two peaks, with a low dip in the middle right where the fitted curve is highest. Is the ride time normal?", "options": ["No: it has two humps", "No: it is flat", "Yes: it is symmetric", "Yes: the two peaks average out to one bell"], "answer": 0, "explain": "Two groups with two typical values give two humps. Even a symmetric histogram fails when the curve's peak sits over a dip."},
  {"q": "A histogram of the last digit of 5000 receipt totals has ten bars of about the same height. The fitted curve rises above the middle bars and drops below the end bars. Is the last digit normal?", "options": ["No: it is flat", "No: it is skewed to the right", "Yes: it is symmetric, which is enough", "Yes: the bars all lie close to 0.1"], "answer": 0, "explain": "Equal bars make a flat shape with no hump. Symmetric alone is not enough: a bell rises in the middle and falls at both ends."},
  {"q": "The pile of 10 000 sample means, each from a sample of 50 download times, is drawn with `fit=\"normal\"`. What should the histogram look like?", "options": ["One symmetric hump, with the bars following the curve", "Skewed to the right, like the download times", "Flat, because averages spread out evenly", "Two humps, one for short and one for long downloads"], "answer": 0, "explain": "The population is skewed, but with n = 50, at least 30, the Central Limit Theorem makes the pile of sample means a bell. The lab saw the same with its exponential population at n = 50."},
  {"q": "Which answer to \"Does X follow a normal distribution?\" is complete?", "options": ["No. The histogram is skewed to the right, and the bars do not follow the fitted normal curve.", "No, it is not normal.", "Yes, because R drew a normal curve on it.", "No. The mean is not 0 and the standard deviation is not 1."], "answer": 0, "explain": "A complete answer gives the verdict and the reason: the shape word and the comparison with the curve. Any mean and spread can be normal; normal does not mean standard normal."},
  {"type": "fill", "q": "Draw the bell over the bars. Type the value, with its quotes.", "code": "histogram(X, fit=___)", "answer": ["\"normal\"", "'normal'"], "explain": "`fit=\"normal\"` draws the normal curve with the data's own centre and spread over the bars."},
  {"type": "fill", "q": "Scale the bars so their areas add to 1. Type the value, with its quotes.", "code": "histogram(X, type=___, fit=\"normal\")", "answer": ["\"density\"", "'density'"], "explain": "`type=\"density\"` makes the bar areas add to 1, so the bars and the curve share one scale."},
  {"type": "fill", "q": "Load the package that supplies `histogram`. Type its name.", "code": "library(___)", "answer": ["mosaic"], "explain": "`library(mosaic)` loads mosaic once per session."},
  {"q": "True or false: `fit=\"normal\"` reshapes the data so that they follow a normal distribution.", "type": "tf", "answer": false, "explain": "It only draws a bell over the bars. The data are unchanged, and the verdict comes from how well the bars follow that bell."}
]
```

## Remember

- `histogram` is from `mosaic`: `type="density"` scales the bars, `fit="normal"` lays the bell over them.
- Normal: one hump, symmetric, bars follow the curve.
- Not normal: skewed, two humps, or flat.
- The curve is always a bell. Judge the bars against it.
- The answer: yes or no, then the shape word as the reason.
- A skewed population stays skewed. The pile of sample means becomes a bell once n is large.
