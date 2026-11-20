---
title: "90%, 95%, 99%: more confidence costs a wider interval"
minutes: 14
---
<!-- facts: none; n = 50, X = 34 is the notes' example and n = 100, X = 65 is practice problem 1; every other number is new and checked by script -->
Same sample, a bigger promise. The only number that changes is the critical value, and it drags the whole interval wider.

## A bigger promise needs a longer arm

Start from the pile of p-hats. The pink line is the truth, p. A blue dot is one sample's $\hat{p}$ (say "p-hat").

The green arrow is the width of the pile, the standard error. The orange arm is the margin of error, E.

Changing the level does not change the pile. It changes how much of the pile the arm must reach.

**95% of the pile lies within 1.96 green arrows of the centre. 99% needs 2.576 arrows. 90% needs only 1.645.** So a 99% arm is longer than a 95% arm, and a 90% arm is shorter.

**More confidence means a wider interval, from the same data.** Just like a fishing net: to catch 99 fish in 100 instead of 95, you need a wider net.

## The notes' survey at 95% and at 99%

A random sample of 50 BCIT students finds 34 iPhone users. Here X is the count of successes in the sample.

- $n = 50$, the number of students asked.
- $X = 34$, the number who use an iPhone.
- 95% in part a, 99% in part b.

Both parts share these lines:

$$\hat{p} = \dfrac{\underbrace{34}_{\text{iPhone users}}}{\underbrace{50}_{\text{students}}} = \mathbf{0.68} \qquad \hat{q} = \dfrac{\underbrace{16}_{\text{others}}}{\underbrace{50}_{\text{students}}} = \mathbf{0.32}$$

$$n\hat{p} = \underbrace{34}_{X} \ge 5 \qquad n\hat{q} = \underbrace{16}_{n - X} \ge 5$$

$$\dfrac{\hat{p}\hat{q}}{n} = \dfrac{\underbrace{0.68}_{\text{p-hat}} \times \underbrace{0.32}_{\text{q-hat}}}{\underbrace{50}_{\text{sample size}}} = 0.004352 \qquad \sqrt{\underbrace{0.004352}_{\text{the fraction}}} = \mathbf{0.065970}$$

**Part a, 95%.** $1 - \alpha = 0.95$ and $z_{0.025} = 1.96$.

$$E = \underbrace{1.96}_{\text{critical value}} \times \underbrace{0.065970}_{\text{standard error}} = 0.12930 = \mathbf{0.129}$$

$$\underbrace{0.68}_{\text{p-hat}} - \underbrace{0.129}_{E} = \mathbf{0.551} \qquad \underbrace{0.68}_{\text{p-hat}} + \underbrace{0.129}_{E} = \mathbf{0.809}$$

The notes conclude: *The population proportion p (of iPhone users) is between 0.551 and 0.809 with 95% confidence.*

**Part b, 99%.** $1 - \alpha = 0.99$, so $\alpha = 0.01$ and $\alpha/2 = 0.005$. The critical value is $z_{0.005} = 2.576$.

$$E = \underbrace{2.576}_{\text{critical value}} \times \underbrace{0.065970}_{\text{standard error}} = 0.16994 = \mathbf{0.170}$$

$$\underbrace{0.68}_{\text{p-hat}} - \underbrace{0.170}_{E} = \mathbf{0.51} \qquad \underbrace{0.68}_{\text{p-hat}} + \underbrace{0.170}_{E} = \mathbf{0.85}$$

The notes mark E as *larger than for 95% confidence*. Both arms start from the same dot, 0.68. The 99% arm is $2.576 / 1.96 = 1.31$ times as long.

```diagram
{"type": "curve", "title": "Same dot, two arms: 99% reaches further than 95%", "x": [0.44, 0.92], "xlabel": "p", "curves": [{"dist": "normal", "mu": 0.68, "sigma": 0.066, "tone": "dim"}], "lines": [{"x": 0.68, "label": "p-hat = 0.68", "side": "right", "full": true, "tone": "blue"}], "spans": [{"from": 0.551, "to": 0.809, "y": 0.42, "label": "95%: 0.551 to 0.809", "tone": "hl"}, {"from": 0.51, "to": 0.85, "y": 0.14, "label": "99%: 0.51 to 0.85", "tone": "red"}], "ticks": [0.51, 0.551, 0.809, 0.85]}
```

R's `prop.test()` prints a slightly different 99% interval, 0.4879 to 0.8276, because it uses another formula, which the notes call the Wilson interval; on paper you use the hand formula above.

## Finding z for any level, step by step

The critical value $z_{\alpha/2}$ cuts off $\alpha/2$ in the right tail. **To find it, work from the level to the area on the left, then read the Z table backwards.** For example, 90%:

```diagram
{"type": "flow", "title": "From a level to its critical value: 90%", "nodes": [{"id": "l", "label": "Level", "sub": "1 − α = 0.90"}, {"id": "a", "label": "Alpha", "sub": "α = 0.10"}, {"id": "h", "label": "Each tail", "sub": "α/2 = 0.05"}, {"id": "left", "label": "Area to the left", "sub": "1 − α/2 = 0.95"}, {"id": "z", "label": "Read backwards", "sub": "z = 1.645"}], "edges": [{"from": "l", "to": "a"}, {"from": "a", "to": "h"}, {"from": "h", "to": "left"}, {"from": "left", "to": "z"}], "hi": ["left"], "caption": "The table gives areas to the left, so look up 1 − α/2, not α/2."}
```

The middle 90% of the bell sits between −1.645 and 1.645. Each tail holds 0.05.

```diagram
{"type": "curve", "title": "90%: the middle 0.90, with 0.05 in each tail", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.645, "label": "0.05", "tone": "dim"}, {"from": -1.645, "to": 1.645, "label": "0.90", "tone": "hl"}, {"from": 1.645, "label": "0.05", "tone": "dim"}], "ticks": [-1.645, 0, 1.645]}
```

In the table, 0.95 falls between 0.9495 at 1.64 and 0.9505 at 1.65. Halfway is **1.645**.

For 99%, the area to the left is $1 - 0.005 = 0.995$. It falls between 0.9949 at 2.57 and 0.9951 at 2.58. The course uses **2.576**.

The notes also give the R way, `qnorm(1 - alpha/2)`:

```r
alpha <- 1 - 0.90
qnorm(1 - alpha/2)
```

:::info R syntax
| Code | What it does |
|---|---|
| `alpha <- 1 - 0.90` | `<-` is assignment: it stores 0.10 under the name `alpha`. |
| `qnorm(1 - alpha/2)` | Slots `qnorm(p, mean, sd)`: p = 0.95, the area to the left; mean and sd left out, so the standard normal. Returns the z with that area to its left. |
| `alpha/2` | `/` divides: 0.05, the area in each tail. |

**Left to right**

- `alpha <- 1 - 0.90`: "Store under the name alpha (`alpha <-`) one minus the level (`1 - 0.90`)."
- `qnorm(1 - alpha/2)`: "The z with this area to its left (`qnorm`): one minus (`1 -`) half of alpha (`alpha/2`)."

**Right to left**, the order R runs it

- `alpha <- 1 - 0.90`: "Work out 1 minus 0.90, then store the 0.10 as `alpha`."
- `qnorm(1 - alpha/2)`: "Halve alpha (`alpha/2`), take it from 1 (`1 -`) to get 0.95, then find the z with 0.95 to its left (`qnorm`)."
:::

R returns 1.644854, which rounds to the 1.645 the course uses.

## The practice sheet's iPhone survey at 90%

A random sample of 100 BCIT students finds 65 iPhone users. The practice sheet asks for a 90% confidence interval for p.

- $n = 100$, the number of students asked.
- $X = 65$, the number who use an iPhone.
- 90%, the confidence level.

$$\hat{p} = \dfrac{\underbrace{65}_{\text{iPhone users}}}{\underbrace{100}_{\text{students}}} = \mathbf{0.65} \qquad \hat{q} = \underbrace{1}_{\text{everyone}} - \underbrace{0.65}_{\text{p-hat}} = \mathbf{0.35}$$

**Line 1, conditions.**

$$n\hat{p} = \underbrace{65}_{X} \ge 5 \qquad n\hat{q} = \underbrace{100}_{n} - \underbrace{65}_{X} = \mathbf{35} \ge 5$$

**Line 2, confidence level.**

$$1 - \alpha = \mathbf{0.90}$$

**Line 3, critical value.**

$$\dfrac{\alpha}{2} = \dfrac{\underbrace{0.10}_{\alpha}}{2} = 0.05 \qquad z_{0.05} = \mathbf{1.645}$$

**Line 4, margin of error.**

$$\dfrac{\hat{p}\hat{q}}{n} = \dfrac{\underbrace{0.65}_{\text{p-hat}} \times \underbrace{0.35}_{\text{q-hat}}}{\underbrace{100}_{\text{sample size}}} = 0.002275$$

$$E = \underbrace{1.645}_{\text{critical value}} \times \underbrace{\sqrt{0.002275}}_{\text{standard error, 0.047697}} = 0.078461 = \mathbf{0.0785}$$

**Line 5, limits.**

$$\hat{p} - E = \underbrace{0.65}_{\text{p-hat}} - \underbrace{0.0785}_{E} = \mathbf{0.5715} \qquad \hat{p} + E = \underbrace{0.65}_{\text{p-hat}} + \underbrace{0.0785}_{E} = \mathbf{0.7285}$$

**Line 6, conclusion.** The sheet's answer: *We are 90% confident that the population proportion of iPhone users among BCIT students is between 57.15% and 72.85%.*

## What "95% confident" means: the arm is the random thing

Here is the trap. p does not move. It is one fixed number. What moves is your dot, and the arm goes with it.

Take a new sample and you get a new dot and a new arm. **95% confidence means that 95% of all samples give an arm that covers p.** The 95% describes the method.

Once you hold your one arm, it either covers p or it misses. You cannot see which, because you cannot see the pink line. Just like a machine that seals 95% of bags properly: the 95% describes the machine, and any one bag is sealed or not.

So write the notes' sentence, *With 95% confidence we think ...*, and mean "my arm came from a method that catches p 95 times in 100".

Watch the count at the end. At 95%, about 95 arms in 100 touch the pink line.

```widget
ci-flip-play
{ "p": 0.572, "n": 200, "level": 0.95, "count": 100, "title": "At 95%, about 95 of 100 arms cover the truth" }
```

:::warn p is not the thing that is random
"There is a 95% probability that p is between 0.551 and 0.809" treats p as if it could move. It cannot. Say that 95% of samples give an interval that covers p, or write "with 95% confidence".
:::

## Library seats, a factory line, downloads and a campus survey at 90% and 99%

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\hat{p} - E < p < \hat{p} + E$, $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$

**Not on the sheet, so know it:**

- $\alpha = 1 -$ level; look up the area $1 - \alpha/2$ to the left in the Z table.
- Critical values: 1.645 (90%), 1.96 (95%), 2.576 (99%).
- $\hat{p} = X/n$, $\hat{q} = 1 - \hat{p}$; the six lines.
:::

```quiz
[
  {"q": "Use the same steps for a level the sheet never lists: what is the critical value $z_{\\alpha/2}$ for an 85% confidence interval? (2 decimals)", "type": "numeric", "answer": 1.44, "tolerance": 0.006, "explain": "$1 - \\alpha = 0.85$, so $\\alpha = 0.15$ and $\\alpha/2 = 0.075$. The area to the left of the cut is $1 - 0.075 = 0.925$. In the Z table the closest cell is 0.9251, at row 1.4, column .04, so $z_{0.075} = \\mathbf{1.44}$. R: `qnorm(0.925)` gives 1.4395."},
  {"q": "What is the critical value $z_{\\alpha/2}$ for a 92% confidence interval? (2 decimals)", "type": "numeric", "answer": 1.75, "tolerance": 0.006, "explain": "$1 - \\alpha = 0.92$, so $\\alpha = 0.08$ and $\\alpha/2 = 0.04$. The area to the left is $1 - 0.04 = 0.96$. The closest cell is 0.9599, at row 1.7, column .05, so $z_{0.04} = \\mathbf{1.75}$. The trap is looking up the level, 0.92, as the area to the left: that gives 1.41. The table needs $1 - \\alpha/2 = 0.96$. R: `qnorm(0.96)` gives 1.7507."},
  {"q": "In a random sample of 180 library visitors, 99 found a free seat within five minutes. Find E for a 90% confidence interval for p, the share of all visitors who find a seat that fast. (4 decimals)", "type": "numeric", "answer": 0.061, "tolerance": 0.0006, "explain": "$n = 180$ visitors, $X = 99$, so $\\hat{p} = 99/180 = 0.55$ and $\\hat{q} = 0.45$. **Line 1:** $n\\hat{p} = 99 \\ge 5$, $n\\hat{q} = 81 \\ge 5$. **Line 2:** $1 - \\alpha = 0.90$. **Line 3:** $z_{0.05} = 1.645$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.55}_{\\text{p-hat}} \\times \\underbrace{0.45}_{\\text{q-hat}}}{\\underbrace{180}_{\\text{visitors}}} = 0.001375$$ $$E = \\underbrace{1.645}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.001375}}_{\\text{standard error, 0.037081}} = \\mathbf{0.0610}$$ **Line 5:** $(0.4890, 0.6110)$. **Line 6:** We are 90% confident that between 48.90% and 61.10% of all library visitors find a seat within five minutes."},
  {"q": "A factory line samples 400 items and finds 60 with a scratch. Find the upper limit of a 99% confidence interval for p, the share of all items with a scratch. Use $z = 2.576$. (4 decimals)", "type": "numeric", "answer": 0.196, "tolerance": 0.0006, "explain": "$n = 400$ items, $X = 60$, so $\\hat{p} = 0.15$ and $\\hat{q} = 0.85$. **Line 1:** $n\\hat{p} = 60 \\ge 5$, $n\\hat{q} = 340 \\ge 5$. **Line 2:** $1 - \\alpha = 0.99$. **Line 3:** $z_{0.005} = 2.576$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.15}_{\\text{p-hat}} \\times \\underbrace{0.85}_{\\text{q-hat}}}{\\underbrace{400}_{\\text{items}}} = 0.00031875$$ $$E = \\underbrace{2.576}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.00031875}}_{\\text{standard error, 0.017854}} = 0.0460$$ **Line 5:** $$\\hat{p} + E = \\underbrace{0.15}_{\\text{p-hat}} + \\underbrace{0.0460}_{E} = \\mathbf{0.1960}$$ and the lower limit is 0.1040. **Line 6:** We are 99% confident that between 10.40% and 19.60% of all items from the line have a scratch."},
  {"q": "A download mirror logs 450 random downloads; 342 finished in under a minute. Find the lower limit of a 90% confidence interval for p, the share of all downloads that finish in under a minute. (4 decimals)", "type": "numeric", "answer": 0.7269, "tolerance": 0.0006, "explain": "$n = 450$ downloads, $X = 342$, so $\\hat{p} = 0.76$ and $\\hat{q} = 0.24$. **Line 1:** $n\\hat{p} = 342 \\ge 5$, $n\\hat{q} = 108 \\ge 5$. **Line 2:** $1 - \\alpha = 0.90$. **Line 3:** $z_{0.05} = 1.645$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.76}_{\\text{p-hat}} \\times \\underbrace{0.24}_{\\text{q-hat}}}{\\underbrace{450}_{\\text{downloads}}} = 0.00040533$$ $$E = \\underbrace{1.645}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.00040533}}_{\\text{standard error, 0.020133}} = 0.0331$$ **Line 5:** $$\\hat{p} - E = \\underbrace{0.76}_{\\text{p-hat}} - \\underbrace{0.0331}_{E} = \\mathbf{0.7269}$$ and the upper limit is 0.7931. **Line 6:** We are 90% confident that between 72.69% and 79.31% of all downloads finish in under a minute."},
  {"q": "A campus survey asks 300 random students; 138 bring lunch from home. Find E for a 99% confidence interval for p. Use $z = 2.576$. (4 decimals)", "type": "numeric", "answer": 0.0741, "tolerance": 0.0006, "explain": "$n = 300$ students, $X = 138$, so $\\hat{p} = 0.46$ and $\\hat{q} = 0.54$. **Line 1:** $n\\hat{p} = 138 \\ge 5$, $n\\hat{q} = 162 \\ge 5$. **Line 2:** $1 - \\alpha = 0.99$. **Line 3:** $z_{0.005} = 2.576$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.46}_{\\text{p-hat}} \\times \\underbrace{0.54}_{\\text{q-hat}}}{\\underbrace{300}_{\\text{students}}} = 0.000828$$ $$E = \\underbrace{2.576}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.000828}}_{\\text{standard error, 0.028775}} = \\mathbf{0.0741}$$ **Line 5:** $(0.3859, 0.5341)$. **Line 6:** We are 99% confident that between 38.59% and 53.41% of all students bring lunch from home."},
  {"q": "Which sentence says what 95% confidence means?", "options": ["If we took many samples of this size, about 95% of the intervals they give would cover p.", "p moves around and lands inside this interval 95% of the time.", "95% of the sample lies between the two limits.", "95% of the population lies between the two limits."], "answer": 0, "explain": "**The interval is the random thing; p is fixed.** 95% of samples give an arm that covers p, so the 95% describes the method. The limits are about a share, not about where individual people or sample values sit."},
  {"q": "True or false: with the same sample, a 99% confidence interval is narrower than a 95% one, because it is more certain.", "type": "tf", "answer": false, "explain": "The critical value grows from 1.96 to 2.576, so E grows by the same factor, 1.31. In the notes' survey, E goes from 0.129 to 0.170 and the interval widens from (0.551, 0.809) to (0.51, 0.85). **More confidence costs a wider interval.**"}
]
```

## Remember

- **More confidence, longer arm: 1.645 for 90%, 1.96 for 95%, 2.576 for 99%.**
- **Find z from the area to the left, $1 - \alpha/2$: the Z table read backwards, or R's `qnorm()`.**
- Only z changes with the level; p-hat, q-hat and the standard error stay put.
- **95% of samples give an arm that covers p. p is fixed; the arm is random.**
- Write "We are 95% confident that ..."; never "95% of the sample".
