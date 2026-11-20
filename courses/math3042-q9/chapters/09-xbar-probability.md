---
title: "A probability about X-bar or p-hat: the same Z recipe with the pile's width"
minutes: 12
---
<!-- facts: none; the elevator example is the notes' page 94 and the iPhone pile is the notes' section 6.1; the practice items are new -->
This lesson goes one step past the pages the quiz announced. It is here because the recipe is the Quiz 8 Z recipe with one number swapped, so a question about an average costs almost nothing extra to learn.

## Same recipe, narrower pile

On Quiz 8, a question about one value used the bell of single values. Its width was $\sigma$.

A question about an average uses the pile of averages instead. The pink line, the truth $\mu$, is still the centre. Only the width changes: the green arrow, $\sigma / \sqrt{n}$.

**To find a probability about $\bar{X}$ (say "X-bar"), standardize with the width of the pile, $\sigma / \sqrt{n}$, then use the Z table.** Just like reading a ruler marked in millimetres instead of centimetres: the same steps, a smaller unit.

$$Z = \dfrac{\bar{x} - \mu}{\sigma / \sqrt{n}}$$

- $\bar{x}$, the average asked about: a blue dot's position.
- $\mu$, the population mean: the centre of the pile.
- $\sigma / \sqrt{n}$, the width of the pile of averages.
- $Z$, how many widths the average sits from the centre, rounded to two decimals.

The pile must be a bell for the table to apply: X normal, or n of 30 or more. With X not normal and n under 30 you cannot say it is normal, and the table does not apply.

## One student heavier than 200 lb

The weights of male BCIT students are normal; this is the notes' example. Here $X$ is one value of the variable: one student's weight.

- $\mu = 173.2$ lb, the mean weight.
- $\sigma = 29.5$ lb, the standard deviation of one weight.
- $x = 200$ lb, the weight asked about.

One student is one value, so the width is $\sigma$ itself:

$$Z = \dfrac{\underbrace{200}_{\text{weight asked}} - \underbrace{173.2}_{\text{mean}}}{\underbrace{29.5}_{\text{sd of one student}}} = \mathbf{0.91}$$

$$P(X > 200) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.8186}_{\text{area left of 0.91}} = \mathbf{0.1814}$$

About 18% of single students weigh more than 200 lb.

## Ten students in an elevator rated for 2000 lb

The notes' second part: an elevator holds 2000 lb. What is the chance that 10 random students exceed it?

The question names a total. Turn it into an average: **a total over 2000 for 10 people is the same event as an average over 200.**

$$\dfrac{\underbrace{2000}_{\text{capacity in lb}}}{\underbrace{10}_{\text{students}}} = \mathbf{200}$$

For example, 10 students averaging 201 lb weigh 2010 lb in total, which is over the limit.

- $\mu_{\bar{X}} = 173.2$ lb, the centre of the pile of averages.
- $n = 10$, the students in the elevator.
- $\bar{x} = 200$ lb, the average asked about.

The width of the pile:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{29.5}_{\text{sd of one student}}}{\underbrace{\sqrt{10}}_{\text{root of 10 students}}} = \mathbf{9.33}$$

Shape: normal, because X is normal. That door works for any n, so n = 10 is fine. Ten is under 30, so a skewed X would not have been enough.

$$Z = \dfrac{\underbrace{200}_{\text{average asked}} - \underbrace{173.2}_{\text{mean}}}{\underbrace{9.33}_{\text{width of the pile}}} = 2.8725 = \mathbf{2.87}$$

$$P(\bar{X} > 200) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.9979}_{\text{area left of 2.87}} = \mathbf{0.0021}$$

:::tip The notes round Z to 2.9 and get 0.0019
With Z = 2.9 the table gives 1 − 0.9981 = 0.0019. With Z to two decimals, 2.87, it gives 0.0021. Both are about 0.2%.
:::

The same 200 lb sits under 1 width from the centre for one student, but nearly 3 widths out for an average of ten. The left bell is single students; the right one is averages of ten, on the same axis.

```diagram
{"type": "curve", "title": "Over 200 lb: 0.1814 for one student, 0.0021 for an average of ten", "panels": [
{"title": "One student, sd 29.5", "x": [95, 252], "xlabel": "weight (lb)", "curves": [{"dist": "normal", "mu": 173.2, "sigma": 29.5}], "shade": [{"from": 200, "label": "0.1814", "tone": "hl"}], "ticks": [173.2, 200]},
{"title": "Average of 10, sd 9.33", "x": [95, 252], "xlabel": "average weight (lb)", "curves": [{"dist": "normal", "mu": 173.2, "sigma": 9.33}], "shade": [{"from": 200, "label": "0.0021", "tone": "hl"}], "ticks": [173.2, 200]}
]}
```

Put the pile's width into the normal calculator. It standardizes, reads the table and prints R's unrounded answer beside it.

```widget
normal-prob
{ "mu": 173.2, "sigma": 9.33, "lo": 200, "hi": null, "title": "Average of 10 students over 200 lb: Z = 2.87, 1 − 0.9979" }
```

## The p-hat pile: more than 60% iPhone users

The same recipe works on the pile of shares. The notes' iPhone pile: 57.2% of all BCIT students use an iPhone, and samples hold 200 students.

- $p = 0.572$, the true share: the pink line.
- $n = 200$, the students in one sample.
- $\sigma_{\hat{p}} = 0.0350$, the width of the pile, from [the p-hat lesson](#/math3042-q9/phat-sampling-distribution).
- $\hat{p} = 0.60$, the sample share asked about.

The bell check passes: $np = 114.4$ and $nq = 85.6$, both at least 5.

$$Z = \dfrac{\underbrace{0.60}_{\text{share asked}} - \underbrace{0.572}_{\text{true share}}}{\underbrace{0.0350}_{\text{width of the pile}}} = \mathbf{0.80}$$

$$P(\hat{p} > 0.60) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.7881}_{\text{area left of 0.80}} = \mathbf{0.2119}$$

About one sample in five shows more than 60% iPhone users, even though the truth is 57.2%.

```diagram
{"type": "curve", "title": "P(p-hat > 0.60) is the right tail, 0.2119", "x": [0.46, 0.685], "xlabel": "p-hat, the share in a sample of 200", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035}], "shade": [{"from": 0.60, "label": "0.2119", "tone": "hl"}], "ticks": [0.572, {"x": 0.60, "label": "0.60"}]}
```

```widget
z-table
{ "z": 0.80, "mode": "right", "title": "P(Z > 0.80): 1 − 0.7881" }
```

## Coffee bags, a delivery van, bike commuters and a lunch survey

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\mu_{\overline{X}} = \mu$, $\sigma_{\overline{X}} = \dfrac{\sigma}{\sqrt{n}}$; $\overline{X}$ is normally distributed as long as: X is normally distributed, or $n > 30$.
- $\mu_{\hat{p}} = p$, $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$; $\hat{p}$ is normally distributed as long as: $np \ge 5$, and $nq \ge 5$.

**Not on the sheet, so know it:**

- $Z = \dfrac{\bar{x} - \mu}{\sigma / \sqrt{n}}$ for an average; $Z = \dfrac{\hat{p} - p}{\sigma_{\hat{p}}}$ for a share. Round Z to two decimals.
- A total for n items is an average: divide the total by n.
- Right tail is 1 minus the table; between is the bigger cell minus the smaller.
:::

```quiz
[
  {"q": "A coffee roaster's bags have weights X that are normal with μ = 340 g and σ = 12 g. A café buys a box of 16 bags. Find the probability that the box's mean bag weight is below 334 g. (4 decimals)", "type": "numeric", "answer": 0.0228, "tolerance": 0.0001, "explain": "X = one bag's weight, normal, so $\\bar{X}$ is normal for any n. $\\mu = 340$ g the mean, $\\sigma = 12$ g one bag's sd, $n = 16$ bags. $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{12}_{\\text{sd of one bag}}}{\\underbrace{\\sqrt{16}}_{\\text{root of 16 bags}}} = \\mathbf{3}$$ $$Z = \\dfrac{\\underbrace{334}_{\\text{average asked}} - \\underbrace{340}_{\\text{mean}}}{\\underbrace{3}_{\\text{width of the pile}}} = \\mathbf{-2.00}$$ A left tail is the cell itself: $$P(\\bar{X} < 334) = P(Z < \\underbrace{-2.00}_{\\text{row -2.0, column .00}}) = \\mathbf{0.0228}$$"},
  {"q": "Same bags: μ = 340 g, σ = 12 g. Which width do you divide by to find the chance that ONE bag weighs under 334 g?", "options": ["12, the sd of one bag", "3, the sd of the average of 16", "12 / 16 = 0.75", "the square root of 12"], "answer": 0, "explain": "One bag is one value of X, so its bell has width $\\sigma = 12$: $Z = (334 - 340)/12 = -0.50$, area 0.3085. The width $12/\\sqrt{16} = 3$ belongs only to the pile of averages of 16."},
  {"q": "A courier van carries 25 parcels. Each parcel's weight X is normal with μ = 4.0 kg and σ = 1.5 kg. Find the probability that the 25 parcels weigh more than 109 kg in total. (4 decimals)", "type": "numeric", "answer": 0.1151, "tolerance": 0.0001, "explain": "A total over 109 kg for 25 parcels is an average over $\\dfrac{\\underbrace{109}_{\\text{total kg}}}{\\underbrace{25}_{\\text{parcels}}} = 4.36$ kg. X is normal, so $\\bar{X}$ is normal even though n = 25 is under 30. $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{1.5}_{\\text{sd of one parcel}}}{\\underbrace{\\sqrt{25}}_{\\text{root of 25 parcels}}} = \\mathbf{0.3}$$ $$Z = \\dfrac{\\underbrace{4.36}_{\\text{average asked}} - \\underbrace{4.0}_{\\text{mean}}}{\\underbrace{0.3}_{\\text{width of the pile}}} = \\mathbf{1.20}$$ $$P(\\bar{X} > 4.36) = \\underbrace{1}_{\\text{the whole area}} - \\underbrace{0.8849}_{\\text{area left of 1.20}} = \\mathbf{0.1151}$$"},
  {"q": "20% of all BCIT students bike to campus. A campus survey asks a random sample of 400 students. Find the probability that more than 25% of the sample bike. (4 decimals)", "type": "numeric", "answer": 0.0062, "tolerance": 0.0001, "explain": "$p = 0.2$ the true share, $q = 0.8$, $n = 400$ students. Bell check: $np = 80$ and $nq = 320$, both at least 5. $$\\dfrac{\\underbrace{0.2}_{p} \\times \\underbrace{0.8}_{q}}{\\underbrace{400}_{n}} = 0.0004$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0004}}_{\\text{root of the line above}} = \\mathbf{0.02}$$ $$Z = \\dfrac{\\underbrace{0.25}_{\\text{share asked}} - \\underbrace{0.2}_{\\text{true share}}}{\\underbrace{0.02}_{\\text{width of the pile}}} = \\mathbf{2.50}$$ $$P(\\hat{p} > 0.25) = \\underbrace{1}_{\\text{the whole area}} - \\underbrace{0.9938}_{\\text{area left of 2.50}} = \\mathbf{0.0062}$$"},
  {"q": "Half of all students in a COMP course bring lunch from home. A random sample of 100 of them is surveyed. Find the probability that the sample share is between 0.45 and 0.58. (4 decimals)", "type": "numeric", "answer": 0.7865, "tolerance": 0.0001, "explain": "$p = 0.5$ the true share, $q = 0.5$, $n = 100$. Bell check: $np = 50$ and $nq = 50$. $$\\dfrac{\\underbrace{0.5}_{p} \\times \\underbrace{0.5}_{q}}{\\underbrace{100}_{n}} = 0.0025$$ $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.0025}}_{\\text{root of the line above}} = \\mathbf{0.05}$$ One Z per bound: $$Z_1 = \\dfrac{\\underbrace{0.45}_{\\text{lower share}} - \\underbrace{0.5}_{\\text{true share}}}{\\underbrace{0.05}_{\\text{width}}} = -1.00 \\qquad Z_2 = \\dfrac{\\underbrace{0.58}_{\\text{upper share}} - \\underbrace{0.5}_{\\text{true share}}}{\\underbrace{0.05}_{\\text{width}}} = 1.60$$ $$P(0.45 < \\hat{p} < 0.58) = \\underbrace{0.9452}_{\\text{area left of 1.60}} - \\underbrace{0.1587}_{\\text{area left of -1.00}} = \\mathbf{0.7865}$$"}
]
```

## Remember

- **About one value: divide by $\sigma$. About an average of n: divide by $\sigma / \sqrt{n}$.**
- About a share: divide by $\sigma_{\hat{p}} = \sqrt{pq/n}$, after checking $np \ge 5$ and $nq \ge 5$.
- A total for n items becomes an average: divide by n first.
- The table needs a bell: X normal (any n), or n of 30 or more.
- Round Z to two decimals; right tail is 1 minus the cell.
- The long version of the table moves is [Any normal on paper](#/math3042-q8/normal-on-paper).
