---
title: "Three different objects: the population, one sample, the pile of sample means"
minutes: 12
---
<!-- facts: none; the help desk waits are made up; 0.4 and 1.5 computed in writer-f/heights_check.py and by hand -->
Part 2 draws three pictures from one data set. Two are not bells, and one is a bell. They look like they disagree. They do not, because they are pictures of three different objects.

## Three lists of numbers, built from nothing

Take a campus help desk. Every call waits some minutes before someone picks up. Most waits are short. A few are very long.

Here, X is one value of the variable: the wait of one call.

- **The population** is every wait there is. Its average is the truth, $\mu$. Picture it as the pink line. You never see it in real life.
- **One sample** is 100 waits you log. Each one is a grey dot, a raw data value.
- **One sample mean**, $\bar{X}$ (say "X-bar"), is that sample boiled down to one number: its average. Picture it as one blue dot.
- **The pile** is what you get when you repeat: another 100 waits, another average, another blue dot. Ten thousand times.

**The population, one sample and the pile of sample means are three different lists of numbers. Each has its own shape.** Just like a city's commute times, the 100 commutes you log in one month, and the monthly averages of thousands of months: the same kind of number, three different lists.

```diagram
{"type": "grid", "title": "Three objects, three shapes", "nodes": [{"id": "h0", "label": "", "row": 0, "col": 0}, {"id": "h1", "label": "what it holds", "row": 0, "col": 1}, {"id": "h2", "label": "how many", "row": 0, "col": 2}, {"id": "h3", "label": "shape", "row": 0, "col": 3}, {"id": "h4", "label": "plot that judges it", "row": 0, "col": 4}, {"id": "p0", "label": "population", "row": 1, "col": 0}, {"id": "p1", "label": "every wait", "row": 1, "col": 1}, {"id": "p2", "label": "all of them", "row": 1, "col": 2}, {"id": "p3", "label": "right skewed", "row": 1, "col": 3}, {"id": "p4", "label": "histogram", "row": 1, "col": 4}, {"id": "s0", "label": "one sample", "row": 2, "col": 0}, {"id": "s1", "label": "100 waits", "sub": "rexp(100, …)", "row": 2, "col": 1}, {"id": "s2", "label": "100", "row": 2, "col": 2}, {"id": "s3", "label": "right skewed", "sub": "like its population", "row": 2, "col": 3}, {"id": "s4", "label": "histogram, QQ plot", "row": 2, "col": 4}, {"id": "m0", "label": "pile of means", "row": 3, "col": 0}, {"id": "m1", "label": "10 000 averages", "sub": "replicate(…)", "row": 3, "col": 1}, {"id": "m2", "label": "10 000", "row": 3, "col": 2}, {"id": "m3", "label": "a bell", "sub": "n = 100 ≥ 30", "row": 3, "col": 3}, {"id": "m4", "label": "histogram with fit", "row": 3, "col": 4}], "hi": ["m3"], "caption": "Only the third row is about X-bar. Only the third row is a bell."}
```

## The population is skewed

Lay every wait on a number line. Short waits pile up near 0. The long waits trail off to the right.

That shape has a name: **right skewed**. For example, a 2-minute wait is common, and a 20-minute wait is rare but happens.

Take the mean wait as 4 minutes. For waits like these, the standard deviation is also 4 minutes.

- $\mu = 4$, the mean wait in minutes.
- $\sigma = 4$, the standard deviation in minutes.

```diagram
{"type": "curve", "title": "Two skewed shapes and one bell", "panels": [{"title": "Population: every wait", "x": [-1, 20], "xlabel": "X = wait (min)", "curves": [{"dist": "exp", "beta": 4, "tone": "ink"}], "ticks": [0, 4, 10, 20]}, {"title": "One sample of 100: still skewed", "x": [-1, 16], "xlabel": "X = wait (min)", "curves": [{"dist": "bars", "start": 0, "values": [22, 17, 13, 10, 8, 6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1], "tone": "dim"}], "ticks": [0, 4, 10, 15]}, {"title": "Pile of 10 000 means: a bell", "x": [2.6, 5.4], "xlabel": "X-bar (min)", "curves": [{"dist": "normal", "mu": 4, "sigma": 0.4, "tone": "hl"}], "ticks": [3.2, 4, 4.8]}]}
```

The first two panels have the same lean. The third is a bell, and much narrower: look at its axis.

## One sample of 100 looks like its population

Log 100 waits. In R, `rexp` makes them, with `rate` set to 1 over the mean.

```r
one.sample <- rexp(100, rate=1/4)
histogram(one.sample, type="density")
qqnorm(one.sample, pch=20)
qqline(one.sample, col="red", lty="dashed")
```

:::info R syntax
| Code | What it does |
|---|---|
| `one.sample <- …` | `<-` stores the result under the name `one.sample`. The dot is part of the name. |
| `rexp(100, rate=1/4)` | 100 random waits (`n` = 100) from the exponential with `rate` = 1/4, so the mean is 4. |
| `histogram(one.sample, type="density")` | From `mosaic`: bars of the 100 waits, scaled so their areas add to 1. |
| `qqnorm(one.sample, pch=20)` | The QQ plot of the 100 waits, drawn with small filled dots. |
| `qqline(one.sample, col="red", lty="dashed")` | Adds the reference line, red and dashed. |

**Left to right**

- `one.sample <- rexp(100, rate=1/4)`: "Store under one.sample (`one.sample <-`) one hundred random exponential waits (`rexp`) at rate one quarter (`rate=1/4`)."
- `histogram(one.sample, type="density")`: "Draw a histogram (`histogram`) of the sample (`one.sample`) as a density (`type="density"`)."
- `qqnorm(one.sample, pch=20)`: "Draw the QQ plot (`qqnorm`) of the sample with filled dots (`pch=20`)."
- `qqline(one.sample, col="red", lty="dashed")`: "Add the reference line (`qqline`), red (`col="red"`) and dashed (`lty="dashed"`)."

**Right to left**, the order R runs it

- `one.sample <- rexp(100, rate=1/4)`: "Compute 1/4, draw 100 waits (`rexp`), store them (`<-`)."
- `histogram(one.sample, type="density")`: "Sort the waits into classes, scale the bars, draw them (`histogram`)."
- `qqnorm(one.sample, pch=20)`: "Sort the waits, pair each with its ideal Z, plot the dots (`qqnorm`)."
- `qqline(one.sample, col="red", lty="dashed")`: "Find the quartiles, draw the line through them (`qqline`)."
:::

On screen: the histogram's bars are tall near 0 and trail off to the right. The QQ plot bends: flat at the left, curving up far above the line at the right. Your waits are random, so your exact bars differ; the lean does not.

### Building the QQ plot of one skewed sample

Watch the right end. The longest waits climb far above where a bell would put them.

```widget
qq-build-play
{ "shape": "right", "n": 100, "title": "One sample of 100 skewed waits: the QQ plot bends" }
```

**A sample looks like its population, however large it is.** For example, 1000 waits draw the skewed shape even more clearly than 100. A bigger sample never turns into a bell.

:::warn n ≥ 30 does not make the sample normal
The 30 rule is about the pile of sample means. A sample of 100 from a skewed population is skewed, and its QQ plot bends.
:::

## The pile of 10 000 sample means is a bell

Now boil each sample down to one blue dot, its average. Do it 10 000 times.

```r
Xbar.vals <- replicate(10^4, mean(rexp(100, rate=1/4)))
mean(Xbar.vals)
sd(Xbar.vals)
histogram(Xbar.vals, type="density", fit="normal")
```

:::info R syntax
| Code | What it does |
|---|---|
| `replicate(10^4, …)` | Runs the expression 10 000 times and returns the results as one vector. `^` is a power. |
| `mean(rexp(100, rate=1/4))` | One sample of 100 waits, boiled down to its average. |
| `Xbar.vals <- …` | Stores the 10 000 averages. |
| `mean(Xbar.vals)`, `sd(Xbar.vals)` | The centre and the standard deviation of the pile. |
| `fit="normal"` | Draws the fitted bell over the bars. |

**Left to right**

- `Xbar.vals <- replicate(10^4, mean(rexp(100, rate=1/4)))`: "Store under Xbar.vals (`Xbar.vals <-`) ten thousand (`10^4`) repeats (`replicate`) of the average (`mean`) of 100 random waits (`rexp`)."
- `mean(Xbar.vals)`: "The average (`mean`) of the averages (`Xbar.vals`)."
- `sd(Xbar.vals)`: "The standard deviation (`sd`) of the averages."
- `histogram(Xbar.vals, type="density", fit="normal")`: "Draw a density histogram (`histogram`, `type="density"`) of the averages with a fitted bell (`fit="normal"`)."

**Right to left**, the order R runs it

- `Xbar.vals <- replicate(10^4, mean(rexp(100, rate=1/4)))`: "Draw 100 waits (`rexp`), average them (`mean`), repeat 10 000 times (`replicate`), store the list (`<-`)."
- `mean(Xbar.vals)`: "Take the averages, average them (`mean`)."
- `sd(Xbar.vals)`: "Take the averages, find their spread (`sd`)."
- `histogram(Xbar.vals, type="density", fit="normal")`: "Bin the averages, scale the bars, fit and draw the bell (`histogram`)."
:::

On screen: a bell, centred near 4, with the fitted curve hugging the bars. The two printed numbers are random, so yours will differ. They land close to the theory.

The centre of the pile is the truth, the pink line:

$$\mu_{\bar{X}} = \underbrace{\mu}_{\text{mean of one wait}} = \mathbf{4}$$

The width of the pile, the green arrow, is the standard error:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{4}_{\sigma,\ \text{sd of one wait}}}{\underbrace{\sqrt{100}}_{n = 100\ \text{waits per sample}}} = \mathbf{0.4}$$

It is a bell because $n = 100$ is 30 or more. That is the Central Limit Theorem. The rule in full is [the Central Limit Theorem lesson](#/math3042-q9/clt-shape-rule).

### The pile of means turning into a bell

Watch the top and the bottom. The population on top stays skewed. The pile below loses its lean as n grows.

```widget
xbar-n-play
{ "pop": "exp", "mu": 4, "ns": [1, 10, 100], "title": "Skewed waits, yet the pile of means becomes a bell" }
```

## Does this contradict the Central Limit Theorem? No.

The template asks exactly this. School teaches it as a paradox. It is not: the three pictures are of three objects.

**The Central Limit Theorem is about the pile of sample means, $\bar{X}$. It says nothing about X, or about the values inside one sample.**

A model answer in three sentences:

> No. The Central Limit Theorem is about the distribution of the sample mean X-bar, not about X or the values in one sample. One sample of 100 waits looks like its skewed population, while the 10 000 sample means form a bell because n = 100 is 30 or more.

## Sort statements about waits, downloads and loaves

A download log: the time to fetch one file is right skewed.

- $\mu = 12$ seconds, the mean download time.
- $\sigma = 12$ seconds, the standard deviation.
- $n = 64$, the downloads in each sample.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\mu_{\bar{X}} = \mu$, $\sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$
- $\bar{X}$ is normally distributed as long as: X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- The course teaches the second door as $n \ge 30$.
- A sample looks like its population, however large it is.
- The theorem is about the pile of sample means, never about one sample.
:::

```quiz
[
  {"q": "Which object does this line make? `Xbar.vals <- replicate(10^4, mean(rexp(100, rate=1/4)))`", "options": ["The pile of sample means", "One sample", "The population", "One sample mean"], "answer": 0, "explain": "`replicate` repeats 10 000 times: each time a sample of 100, boiled down to its `mean`. The result is 10 000 blue dots: the pile."},
  {"q": "Which object does this line make? `one.sample <- rexp(100, rate=1/4)`", "options": ["One sample", "The pile of sample means", "One sample mean", "The population"], "answer": 0, "explain": "100 waits, not averaged: one sample of raw data values. Its shape is the population's shape, right skewed."},
  {"q": "After `one.sample` is made, what does `mean(one.sample)` give?", "options": ["One sample mean: a single blue dot", "The pile of sample means", "The population mean, the truth", "The standard error"], "answer": 0, "explain": "The average of one sample of 100 is one number, one dot in the pile. The truth $\\mu$ is the pile's centre, and no single sample gives it exactly."},
  {"q": "Help desk waits are right skewed. Select every object that is right skewed.", "options": ["The population of waits", "One sample of 100 waits", "The pile of 10 000 sample means of 100 waits"], "answer": [0, 1], "explain": "A sample looks like its population, so both lean right. The pile of means is a bell because $n = 100 \\ge 30$."},
  {"type": "tf", "q": "One sample of 100 help desk waits has n = 100, which is 30 or more, so its QQ plot should be a straight line.", "answer": false, "explain": "The 30 rule is about the pile of sample means. One sample of 100 skewed waits is skewed, and its QQ plot bends up at the right."},
  {"type": "numeric", "q": "Downloads: $\\mu = 12$ s, $\\sigma = 12$ s, samples of $n = 64$. What is the standard deviation of the pile of sample means, in seconds?", "answer": 1.5, "tolerance": 0.01, "unit": "s", "explain": "The width of the pile: $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{12}_{\\sigma,\\ \\text{sd of one download}}}{\\underbrace{\\sqrt{64}}_{n = 64\\ \\text{downloads per sample}}} = \\mathbf{1.5}$$ The pile is a bell, since $n = 64 \\ge 30$, though one sample of 64 downloads stays skewed."},
  {"type": "text", "q": "A bakery's loaf weights are skewed. One sample of 50 loaves has a skewed histogram, and the 10 000 simulated sample means of 50 loaves make a bell. Does this contradict the Central Limit Theorem? Answer yes or no.", "answer": ["NO", "No", "no"], "explain": "No. The theorem is about the distribution of X-bar, the pile of means, which is a bell because $n = 50 \\ge 30$. One sample looks like its skewed population, as it should."}
]
```

## Remember

- Population, one sample, pile of sample means: three objects, three shapes.
- A sample looks like its population, however large it is.
- The pile of means is a bell when X is normal or $n \ge 30$.
- Pile centre $\mu$, pile width $\sigma/\sqrt{n}$.
- The theorem is about $\bar{X}$, never about one sample. So no contradiction.
