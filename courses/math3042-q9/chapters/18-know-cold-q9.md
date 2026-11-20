---
title: "Know cold for Quiz 9: two piles, six lines, three critical values, the R lines"
minutes: 5
---
<!-- facts: none; a one-page reference sheet of notes 6.1 to 6.3, the interval layout, Lab 9's QQ rules and the Part 2 template's R lines -->
Cover each right-hand column and say it aloud before you look.

## The picture in six lines

1. Take a sample, boil it down to one number, drop it as a dot. Repeat: the dots make a pile, the **sampling distribution**.
2. The pile sits on the truth: p for a share, μ for an average.
3. Its width is the **standard error**: $\sqrt{pq/n}$ for a share, $\sigma/\sqrt{n}$ for an average.
4. 95% of the pile lies within 1.96 widths of the centre. That reach is the **margin of error** E.
5. Measured from your own dot, the same reach is the **confidence interval** $\hat{p} \pm E$.
6. The pile of shares is a bell when $np$ and $nq$ are 5 or more. The pile of averages is a bell when X is normal or $n \ge 30$. A straight QQ plot says X is normal.

The one question behind all of it: **if I took another sample, how far could my number move?**

## The two piles side by side

| | Pile of $\hat{p}$ (a share) | Pile of $\bar{X}$ (an average) |
|---|---|---|
| One dot is | $\hat{p} = X/n$, X the count of successes | $\bar{X}$, the mean of n values, X one value |
| Centre | $\mu_{\hat{p}} = p$ | $\mu_{\bar{X}} = \mu$ |
| Width | $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$ | $\sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$, the standard error of the mean |
| Bell when | $np \ge 5$ and $nq \ge 5$ | X is normal (any n), or $n \ge 30$ |
| Notes' example | p = 0.572, n = 200: centre 0.572, width 0.0350; np = 114.4, nq = 85.6 | IQ, μ = 100, σ = 15, n = 25: centre 100, width 3, normal because X is |

**Describe a pile in three parts: the mean, the standard deviation, the shape with its reason.** Quadruple n and the width halves.

## The six lines of an interval for p

| Line | What you write | iPhone example: n = 200, X = 117, 95% |
|---|---|---|
| 1. Conditions | $n\hat{p} \ge 5$ and $n\hat{q} \ge 5$; if either fails, stop: the procedure is invalid | 117 and 83, both pass |
| 2. Level | $1 - \alpha$ | 0.95, so α = 0.05 |
| 3. Critical value | $z_{\alpha/2}$ | $z_{0.025} = 1.96$ |
| 4. Margin of error | $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$ | $\hat{p} = 0.585$, $\hat{q} = 0.415$, E = 0.0683 |
| 5. Limits | $\hat{p} - E$ and $\hat{p} + E$ | 0.517 and 0.653 |
| 6. Sentence | We are (level) confident that the proportion of (all ...) is between (lower) and (upper). | between 51.7% and 65.3% |

**What is random is the interval, not p.** 95% of samples give an interval that covers p.

## The three critical values

| Level $1 - \alpha$ | α | α/2 in each tail | Area to the left | $z_{\alpha/2}$ |
|---|---|---|---|---|
| 90% | 0.10 | 0.05 | 0.95 | **1.645** |
| 95% | 0.05 | 0.025 | 0.975 | **1.96** |
| 99% | 0.01 | 0.005 | 0.995 | **2.576** |

Read the Z table backwards at the area to the left, or type `qnorm(1 - alpha/2)`. More confidence, a longer arm.

```diagram
{"type": "curve", "title": "More confidence, a wider middle: 1.645, 1.96, 2.576", "panels": [{"title": "90%", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.645, "tone": "dim"}, {"from": -1.645, "to": 1.645, "label": "0.90", "tone": "hl"}, {"from": 1.645, "tone": "dim"}], "ticks": [-1.645, 1.645]}, {"title": "95%", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.96, "tone": "dim"}, {"from": -1.96, "to": 1.96, "label": "0.95", "tone": "hl"}, {"from": 1.96, "tone": "dim"}], "ticks": [-1.96, 1.96]}, {"title": "99%", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -2.576, "tone": "dim"}, {"from": -2.576, "to": 2.576, "label": "0.99", "tone": "hl"}, {"from": 2.576, "tone": "dim"}], "ticks": [-2.576, 2.576]}]}
```

Three bells with the middle shaded. The cuts move out as the level rises, and each tail holds α/2.

## The sample-size line

| Want | Line |
|---|---|
| n for a target E, p unknown | $n = \dfrac{1}{4}\left[z_{\alpha/2} \cdot \dfrac{1}{E}\right]^2$, the worst case $p = q = \frac{1}{2}$ |
| n for a target E, p known | $n = pq\left[z_{\alpha/2} \cdot \dfrac{1}{E}\right]^2$ |
| then | **round UP** to a whole number: 16589.44 becomes 16590 |

The notes' case: E = 1% at 99% gives 16589.44; the notes then say "at least 16600". 16590 or 16600 is right; 16589 falls short.

## The shape rule

| X is | n | The pile of $\bar{X}$ is |
|---|---|---|
| normal | any | normal, because X is normal |
| not normal | 30 or more | approximately normal, by the Central Limit Theorem |
| not normal or unknown | under 30 | cannot say: check X with a QQ plot |

The sheet prints $n > 30$; the notes and the lab write $n \ge 30$, and the notes' own n = 30 example is called normal. A highly skewed X needs a larger n.

## Reading a QQ plot

| You see | It means |
|---|---|
| points roughly along the line | normal |
| a little wobble at the two ends | typical; still normal |
| flat at the bottom left, curving up steeply at the right | right skewed |
| below the line at the far left, above it at the far right | heavy tails |
| an S that flattens at both ends | no tails, squeezed between two limits |
| flat steps with a jump in the middle | two humps |

About 15 points at least. For a small sample a QQ plot shows more than a histogram.

## The R lines for the template

| Heading | R line |
|---|---|
| first chunk | `library(mosaic)` |
| Q1 load | `heights <- read.csv("heights.csv")`, then `head(heights)` |
| Q1 two-way table | `table(heights$age, heights$sex)`: rows the first vector, columns the second |
| Q2 histogram | `histogram(heights$height_cm, type="density", fit="normal", xlab="Height (cm)", ylab="Probability Density", main="Heights")` |
| Q3a one sample | `X.sample <- sample(heights$height_cm, 100)`, then `mean(X.sample)` |
| Q3b QQ plot | `qqnorm(X.sample, pch=20, main="QQ Plot of a Sample (n=100)")` then `qqline(X.sample, col="red", lty="dashed")`, same chunk |
| Q4a theory | `mu <- mean(heights$height_cm)`, `sigma <- sd(heights$height_cm)`, then `sigma/sqrt(100)` |
| Q4a simulation | `Xbar.vals <- replicate(10^4, mean(sample(heights$height_cm, 100)))`, then `mean(Xbar.vals)` and `sd(Xbar.vals)` |
| Q4b histogram | `histogram(Xbar.vals, type="density", fit="normal", xlab="Xbar", ylab="Probability Density", main="Sampling Distribution of Xbar (n = 100)")` |

`sample(x, size)` draws without replacement; `replicate(m, expr)` runs `expr` m times; `sd` divides by n − 1. On `heights.csv`: two humps in the population, about 149.97 for the centre and 2.47 for the width of the pile of means.

## The traps

| Trap | The right line |
|---|---|
| p versus $\hat{p}$ | p is the truth you never see; $\hat{p} = X/n$ is your sample's share. The interval uses $\hat{p}$ and $\hat{q}$ |
| the root | the root covers the whole fraction: $\sqrt{\hat{p}\hat{q}/n}$, not $\sqrt{\hat{p}\hat{q}}/n$ |
| α versus α/2 | 95% puts 0.025 in each tail: $z_{0.025} = 1.96$, not $z_{0.05}$ |
| a sample size | round UP, never to the nearest |
| one sample of 100 from a skewed population | it looks like its population: skewed, with a bent QQ plot. Only the pile of means is a bell |
| does the pile of means contradict the CLT? | no: the theorem is about the pile of means, not the population or one sample |
| the sheet's $n > 30$ | the notes use $n \ge 30$ |

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $n = \dfrac{1}{4}\left[z_{\alpha/2} \cdot \dfrac{1}{E}\right]^2$, sample size for a confidence interval for p.
- $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$.

**Not on the sheet, so know it:**

- The critical values 1.645 (90%), 1.96 (95%), 2.576 (99%).
- A sample size is rounded UP.
:::

```quiz
[
  {"q": "A campus survey wants a 95% margin of error of at most 0.03 for a share, with no guess for p. How many students must it ask?", "type": "numeric", "answer": 1068, "tolerance": 0.4, "explain": "No guess for p, so use the worst case $p = q = \\frac{1}{2}$, the $\\frac{1}{4}$ line. $$n = \\underbrace{\\tfrac{1}{4}}_{pq \\text{ at worst}}\\left[\\underbrace{1.96}_{z \\text{ for } 95\\%} \\times \\dfrac{1}{\\underbrace{0.03}_{E}}\\right]^2 = 1067.11$$ Rounded UP: **1068** students. 1067 would give an E a little over 0.03."},
  {"type": "fill", "q": "The margin of error for a share. Fill the symbol that the whole product is divided by.", "code": "E = z * sqrt(phat * qhat / ___)", "answer": ["n"], "explain": "$E = z_{\\alpha/2}\\sqrt{\\hat{p}\\hat{q}/n}$: the root covers the whole fraction, sample size n included."},
  {"type": "fill", "q": "The critical value for a 98% interval, read from the Z table to 2 decimals.", "code": "z = ___", "answer": ["2.33", "2.326", "2.3263"], "explain": "98% leaves 0.02, so 0.01 in each tail, and the area to the left is 0.99. The table has 0.9898 at 2.32 and 0.9901 at 2.33; 0.9901 is closer, so **2.33**. R's `qnorm(0.99)` gives 2.3263."},
  {"type": "fill", "q": "The QQ plot of one sample. Fill the function that draws the points; the reference line comes after it.", "code": "___(X.sample, pch=20)\nqqline(X.sample, col=\"red\", lty=\"dashed\")", "answer": ["qqnorm"], "explain": "`qqnorm` draws the points: sample quantiles against theoretical normal quantiles. `qqline` adds the line, so it must come after, in the same chunk."},
  {"type": "fill", "q": "Ten thousand sample means of 100 heights. Fill the function name.", "code": "Xbar.vals <- ___(10^4, mean(sample(heights$height_cm, 100)))", "answer": ["replicate"], "explain": "`replicate(m, expr)` runs `expr` m times and returns the m results as a vector: here 10 000 values of X-bar."},
  {"q": "A population is skewed right. One random sample of 100 values is drawn from it. Is the histogram of that one sample a bell? Answer YES or NO.", "type": "text", "answer": ["NO", "No", "no"], "explain": "A sample looks like its population, so it is skewed too, and its QQ plot bends. The Central Limit Theorem makes the pile of many sample means a bell, not one sample."}
]
```
