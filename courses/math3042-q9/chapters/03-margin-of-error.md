---
title: "The margin of error: how far 95% of the pile reaches"
minutes: 10
---
<!-- facts: none; the iPhone reach is the notes' page 87 example, the critical values are Z-table cells, the practice scenarios are new and checked in Python -->
The pile of p-hat has a centre and a width. This lesson measures how far from the centre most of the pile reaches: the other half of "If I took another sample, how far could my number move?"

## 95% of the pile sits within 1.96 widths of the centre

Start at **the pink line**, the true share p. The pile of p-hat is a bell around it.

Walk outward one width at a time. Each width is the standard deviation of $\hat{p}$, **the green arrow**.

Stop when the stretch around the centre holds 95% of the dots. You stop at 1.96 widths on each side.

That distance has a name: **the margin of error, E**. In the animations it is **the orange arm**. It is not a new rule. It is the width of the same pile, times 1.96.

**The margin of error at 95% is 1.96 standard deviations of $\hat{p}$: 95% of all samples land within E of p.** Just like a bus that arrives within 4 minutes of its timetable on 95% of trips: the 4 minutes is the reach, not a promise for any one trip.

On the standard bell the picture is fixed: 95% in the middle, 2.5% in each tail, cuts at −1.96 and 1.96.

```diagram
{"type": "curve", "title": "The middle 95% of a bell lies between Z = −1.96 and 1.96", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.96, "label": "2.5%", "tone": "dim"}, {"from": -1.96, "to": 1.96, "label": "95%", "tone": "hl"}, {"from": 1.96, "label": "2.5%", "tone": "dim"}], "ticks": [-1.96, 0, 1.96]}
```

## Why 1.96: the Z table read backwards

The middle 95% leaves 5% outside. Split in two, that is 2.5% in each tail.

The table holds areas to the left. Everything left of the right cut is the middle plus the left tail:

$$\text{area left of the cut} = \underbrace{0.95}_{\text{middle}} + \underbrace{0.025}_{\text{left tail}} = \mathbf{0.975}$$

Find 0.9750 inside the table, not in the margins. It sits at row 1.9, column .06. So the cut is **1.96**.

```widget
z-table
{ "mode": "inverse", "p": 0.975, "title": "Area 0.975 to the left: row 1.9, column .06, so z = 1.96" }
```

The long version of reading the table backwards is [From a percentage back to a value](#/math3042-q8/normal-backwards).

## The notes' iPhone reach: 0.503 to 0.641

The share of all BCIT students who use an iPhone is 0.572, and samples have 200 students; this is the notes' example. The previous lesson found the pile's width.

- $p = 0.572$, the true share.
- $\sigma_{\hat{p}} = 0.0350$, the width of the pile of p-hat.
- $1.96$, the number of widths that hold 95%.

$$E = \underbrace{1.96}_{\text{widths for 95\%}} \times \underbrace{0.0350}_{\sigma_{\hat{p}}} = \mathbf{0.0686}$$

$$p - E = \underbrace{0.572}_{p} - \underbrace{0.0686}_{E} = 0.5034 = \mathbf{0.503} \qquad p + E = \underbrace{0.572}_{p} + \underbrace{0.0686}_{E} = 0.6406 = \mathbf{0.641}$$

The notes write the conclusion as *There is a 95% probability that $\hat{p}$ is between 50.3% and 64.1%.*

```diagram
{"type": "curve", "title": "95% of the p-hat pile lies within E = 0.0686 of 0.572", "x": [0.45, 0.695], "xlabel": "p-hat", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035}], "shade": [{"to": 0.503, "label": "2.5%", "tone": "dim"}, {"from": 0.503, "to": 0.641, "label": "95%", "tone": "hl"}, {"from": 0.641, "label": "2.5%", "tone": "dim"}], "ticks": [{"x": 0.503, "label": "0.503"}, {"x": 0.572, "label": "0.572"}, {"x": 0.641, "label": "0.641"}], "spans": [{"from": 0.572, "to": 0.641, "y": 1.05, "label": "E = 0.0686"}]}
```

## E for any confidence level, each symbol named

The notes' general line: *In general* $E = z_{\alpha/2}\sqrt{pq/n}$, with $z_{\alpha/2}$ the *critical Z for a given confidence level*.

$$E = z_{\alpha/2} \sqrt{\frac{pq}{n}}$$

- $1 - \alpha$, the **confidence level**: the share of the pile the reach must hold, such as 0.95.
- $\alpha$, the share left outside, such as 0.05.
- $\alpha/2$, the share in one tail, such as 0.025.
- $z_{\alpha/2}$, the **critical Z**: the Z with $\alpha/2$ of the area to its right.
- $\sqrt{pq/n}$, the width of the pile, $\sigma_{\hat{p}}$.

**E is the critical Z times the width of the pile.** For example, at 95%: $\alpha = 0.05$, $\alpha/2 = 0.025$, and $z_{0.025} = 1.96$.

## The three critical values: 1.645, 1.96, 2.576

Each one comes from the same move: the area to the left of the right cut is $1 - \alpha/2$. Find it inside the table.

```diagram
{"type": "grid", "title": "Critical Z for the three common levels", "nodes": [{"id": "h0", "label": "level 1 − α", "row": 0, "col": 0}, {"id": "h1", "label": "α", "row": 0, "col": 1}, {"id": "h2", "label": "α/2", "row": 0, "col": 2}, {"id": "h3", "label": "area left", "sub": "1 − α/2", "row": 0, "col": 3}, {"id": "h4", "label": "table cells", "row": 0, "col": 4}, {"id": "h5", "label": "z", "row": 0, "col": 5}, {"id": "a0", "label": "90%", "row": 1, "col": 0}, {"id": "a1", "label": "0.10", "row": 1, "col": 1}, {"id": "a2", "label": "0.05", "row": 1, "col": 2}, {"id": "a3", "label": "0.95", "row": 1, "col": 3}, {"id": "a4", "label": "0.9495 at 1.64", "sub": "0.9505 at 1.65", "row": 1, "col": 4}, {"id": "a5", "label": "1.645", "row": 1, "col": 5}, {"id": "b0", "label": "95%", "row": 2, "col": 0}, {"id": "b1", "label": "0.05", "row": 2, "col": 1}, {"id": "b2", "label": "0.025", "row": 2, "col": 2}, {"id": "b3", "label": "0.975", "row": 2, "col": 3}, {"id": "b4", "label": "0.9750 at 1.96", "row": 2, "col": 4}, {"id": "b5", "label": "1.96", "row": 2, "col": 5}, {"id": "c0", "label": "99%", "row": 3, "col": 0}, {"id": "c1", "label": "0.01", "row": 3, "col": 1}, {"id": "c2", "label": "0.005", "row": 3, "col": 2}, {"id": "c3", "label": "0.995", "row": 3, "col": 3}, {"id": "c4", "label": "0.9949 at 2.57", "sub": "0.9951 at 2.58", "row": 3, "col": 4}, {"id": "c5", "label": "2.576", "row": 3, "col": 5}], "hi": ["a5", "b5", "c5"], "caption": "Read the level, halve what is left over, look up 1 − α/2 inside the table."}
```

- **90%:** 0.95 is not printed. It sits exactly halfway between 0.9495 at 1.64 and 0.9505 at 1.65, so z = 1.645.
- **95%:** 0.9750 is printed at 1.96.
- **99%:** 0.995 sits halfway between 0.9949 at 2.57 and 0.9951 at 2.58. The course uses **2.576**, the exact value to three decimals.

In R, one call gives the cut for any level. The notes write it as `qnorm(1 - alpha/2)`:

```r
qnorm(1 - 0.10/2)
qnorm(1 - 0.05/2)
qnorm(1 - 0.01/2)
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(1 - 0.10/2)` | Slots `qnorm(p, mean, sd)`: p = 0.95, the area to the left; mean and sd left out, so the standard bell (0 and 1). |
| `0.10/2` | `/` divides: α = 0.10 split into two tails, 0.05 each. `-` subtracts it from 1. |
| `qnorm(1 - 0.05/2)` | The same call with α = 0.05: area 0.975 to the left. |
| `qnorm(1 - 0.01/2)` | The same call with α = 0.01: area 0.995 to the left. |
| `qnorm(1 - alpha/2)` | The notes' general form, with α stored under the name `alpha`. |

**Left to right**

- `qnorm(1 - 0.10/2)`: "The Z with a given area to its left (`qnorm`), where that area is 1 minus (`1 -`) a tenth split in two (`0.10/2`)."
- `qnorm(1 - 0.05/2)`: "The same, with 0.05 split in two (`0.05/2`)."
- `qnorm(1 - 0.01/2)`: "The same, with 0.01 split in two (`0.01/2`)."
- `qnorm(1 - alpha/2)`: "The same, with whatever α is stored in `alpha`, split in two (`alpha/2`)."

**Right to left**, the order R runs it

- `qnorm(1 - 0.10/2)`: "Halve 0.10 to get 0.05 (`/2`), take it from 1 to get 0.95 (`1 -`), then find the Z with 0.95 to its left (`qnorm`)."
- `qnorm(1 - 0.05/2)`: "Halve 0.05 to 0.025, take it from 1 to get 0.975, then find its Z (`qnorm`)."
- `qnorm(1 - 0.01/2)`: "Halve 0.01 to 0.005, take it from 1 to get 0.995, then find its Z (`qnorm`)."
- `qnorm(1 - alpha/2)`: "Read `alpha`, halve it, take it from 1, then find its Z (`qnorm`)."
:::

R prints 1.644854, 1.959964 and 2.575829: the three critical values before rounding.

:::tip Know 1.645, 1.96 and 2.576 by sight
They are not on the formula sheet. A table reading of 1.64 or 1.65, or 2.575 or 2.58, lands on almost the same E.
:::

## More confidence, a longer reach; a bigger sample, a shorter one

Keep the iPhone pile, width 0.0350. Ask for more of the pile, and the reach grows:

$$E_{90} = \underbrace{1.645}_{z \text{ for } 90\%} \times \underbrace{0.0350}_{\sigma_{\hat{p}}} = \mathbf{0.0576} \qquad E_{95} = \underbrace{1.96}_{z \text{ for } 95\%} \times \underbrace{0.0350}_{\sigma_{\hat{p}}} = \mathbf{0.0686} \qquad E_{99} = \underbrace{2.576}_{z \text{ for } 99\%} \times \underbrace{0.0350}_{\sigma_{\hat{p}}} = \mathbf{0.0902}$$

**More confidence means a longer reach.** For example, holding 99% of the pile instead of 95% takes 2.576 widths instead of 1.96.

```diagram
{"type": "curve", "title": "More of the pile needs a longer reach", "panels": [{"title": "90%: ±1.645", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": -1.645, "to": 1.645, "label": "90%", "tone": "hl"}], "ticks": [-1.645, 1.645]}, {"title": "95%: ±1.96", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": -1.96, "to": 1.96, "label": "95%", "tone": "hl"}], "ticks": [-1.96, 1.96]}, {"title": "99%: ±2.576", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": -2.576, "to": 2.576, "label": "99%", "tone": "hl"}], "ticks": [-2.576, 2.576]}]}
```

Now keep 95% and take samples of 800, four times 200:

$$\frac{pq}{n} = \frac{\underbrace{0.572}_{p} \times \underbrace{0.428}_{q}}{\underbrace{800}_{n}} = 0.00030602$$

$$\sigma_{\hat{p}} = \underbrace{\sqrt{0.00030602}}_{\text{root of the whole fraction}} = 0.017493 = \mathbf{0.0175}$$

$$E = \underbrace{1.96}_{z \text{ for } 95\%} \times \underbrace{0.0175}_{\sigma_{\hat{p}}} = \mathbf{0.0343}$$

**Four times the sample, half the reach**, because n sits under a square root and $\sqrt{4} = 2$. For example, 0.0686 at n = 200 becomes 0.0343 at n = 800.

The next step turns this reach around and measures it from your own sample: [A confidence interval for p](#/math3042-q9/ci-for-p).

## Reach for bikes, coffee orders and downloads, and two new critical values

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$
- $E = z_{\alpha/2} \cdot \sqrt{\dfrac{\hat{p}\hat{q}}{n}}$

**Not on the sheet, so know it:**

- With p known, as in these questions, p and q go in the root: $E = z_{\alpha/2}\sqrt{pq/n}$.
- $q = 1 - p$; $\alpha = 1 - \text{confidence level}$.
- The critical Z has $\alpha/2$ to its right, so look up $1 - \alpha/2$ inside the table.
- 90% → 1.645, 95% → 1.96, 99% → 2.576.
:::

```quiz
[
  {"q": "40% of all students on a campus bike to class. Samples of 150 students are taken. Find the margin of error at 95%. (4 decimals)", "type": "numeric", "answer": 0.0784, "tolerance": 0.0006, "explain": "$p = 0.40$ the share who bike, $q = 0.60$, $n = 150$ students, 95% so $z_{0.025} = 1.96$. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.40}_{p} \\times \\underbrace{0.60}_{q}}{\\underbrace{150}_{n}} = 0.0016$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0016}}_{\\text{root of the whole fraction}} = 0.04$$ $$E = \\underbrace{1.96}_{z \\text{ for } 95\\%} \\times \\underbrace{0.04}_{\\sigma_{\\hat{p}}} = \\mathbf{0.0784}$$"},
  {"q": "A quarter of all orders at a coffee shop are iced drinks. Samples of 300 orders are taken. Find the margin of error at 90%. (4 decimals)", "type": "numeric", "answer": 0.0411, "tolerance": 0.0006, "explain": "$p = 0.25$ the iced share, $q = 0.75$, $n = 300$ orders. 90%: $\\alpha = 0.10$, $\\alpha/2 = 0.05$, area 0.95 to the left, halfway between 1.64 and 1.65, so $z_{0.05} = 1.645$. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.25}_{p} \\times \\underbrace{0.75}_{q}}{\\underbrace{300}_{n}} = 0.000625$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.000625}}_{\\text{root of the whole fraction}} = 0.025$$ $$E = \\underbrace{1.645}_{z \\text{ for } 90\\%} \\times \\underbrace{0.025}_{\\sigma_{\\hat{p}}} = 0.041125 = \\mathbf{0.0411}$$ With 1.64 or 1.65 you get 0.0410 or 0.04125, also accepted."},
  {"q": "10% of all downloads from a file server time out. Samples of 400 downloads are taken. Find the margin of error at 99%. (4 decimals)", "type": "numeric", "answer": 0.0386, "tolerance": 0.0006, "explain": "$p = 0.10$ the time-out share, $q = 0.90$, $n = 400$ downloads. 99%: $\\alpha = 0.01$, $\\alpha/2 = 0.005$, area 0.995 to the left, so $z_{0.005} = 2.576$. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.10}_{p} \\times \\underbrace{0.90}_{q}}{\\underbrace{400}_{n}} = 0.000225$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.000225}}_{\\text{root of the whole fraction}} = 0.015$$ $$E = \\underbrace{2.576}_{z \\text{ for } 99\\%} \\times \\underbrace{0.015}_{\\sigma_{\\hat{p}}} = 0.03864 = \\mathbf{0.0386}$$ With 2.58 you get 0.0387, also accepted."},
  {"q": "Find the critical value $z_{\\alpha/2}$ for a 98% confidence level. (2 decimals)", "type": "numeric", "answer": 2.33, "tolerance": 0.005, "explain": "$1 - \\alpha = 0.98$, so $\\alpha = 0.02$ and $\\alpha/2 = 0.01$. $$\\text{area left} = \\underbrace{1}_{\\text{whole area}} - \\underbrace{0.01}_{\\alpha/2} = 0.99$$ Inside the table the closest cell is 0.9901 at row 2.3, column .03 (0.9898 at 2.32 is further). So $z_{0.01} = \\mathbf{2.33}$. R's `qnorm(0.99)` gives 2.3263, also accepted."},
  {"q": "Find the critical value $z_{\\alpha/2}$ for an 80% confidence level. (2 decimals)", "type": "numeric", "answer": 1.28, "tolerance": 0.005, "explain": "$1 - \\alpha = 0.80$, so $\\alpha = 0.20$ and $\\alpha/2 = 0.10$. $$\\text{area left} = \\underbrace{1}_{\\text{whole area}} - \\underbrace{0.10}_{\\alpha/2} = 0.90$$ Inside the table the closest cell is 0.8997 at row 1.2, column .08 (0.9015 at 1.29 is further). So $z_{0.10} = \\mathbf{1.28}$. R's `qnorm(0.90)` gives 1.2816, also accepted."},
  {"q": "Half of all students at a campus carry a reusable cup (p = 0.5). Samples of 100 students give a 95% margin of error of 0.098. The samples grow to 400 students. What is the new margin of error?", "options": ["0.049, half as long", "0.0245, a quarter as long", "0.098, unchanged because p is unchanged", "0.196, twice as long"], "answer": 0, "explain": "$n$ goes from 100 to 400, four times larger. $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.5}_{p} \\times \\underbrace{0.5}_{q}}{\\underbrace{400}_{n}} = 0.000625$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.000625}}_{\\text{root of the whole fraction}} = 0.025$$ $$E = \\underbrace{1.96}_{z \\text{ for } 95\\%} \\times \\underbrace{0.025}_{\\sigma_{\\hat{p}}} = \\mathbf{0.049}$$ n sits under a square root, so four times n halves E. A quarter would need n multiplied by 16. A bigger n always shortens E, even with p unchanged."}
]
```

## Remember

- **E is the critical Z times the width of the pile: $E = z_{\alpha/2}\sqrt{pq/n}$.**
- **95% → 1.96, 90% → 1.645, 99% → 2.576.** Look up $1 - \alpha/2$ inside the table; in R, `qnorm` does the lookup.
- Halve α before the lookup: one tail holds $\alpha/2$.
- More confidence, a longer reach. Four times the sample, half the reach.
