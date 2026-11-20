---
title: "Planning a sample size, and comparing two intervals"
minutes: 13
---
<!-- facts: none; the sample size for E = 1% at 99% is the notes' example and the A/B test is practice problem 2; every other number is new and checked by script -->
Intervals do two more jobs. Before a survey, they tell you how many people to ask. After two surveys, they tell you whether one share really beats the other.

## A bigger sample, a shorter arm

Start from the pile of p-hats. The pink line is the truth, p. A blue dot is one sample's $\hat{p}$ (say "p-hat").

The green arrow is the width of the pile, $\sqrt{pq/n}$. The orange arm is the margin of error, E: the critical value times the green arrow.

n sits under the root, at the bottom. So a bigger sample makes a narrower pile and a shorter arm.

**So choose the arm you want first, then solve for the n that gives it.** Just like choosing a bigger photo before you print: decide the sharpness you need, then pick the pixel count that delivers it.

## Solve the margin of error for n

Start from the margin of error, written with p and q:

$$E = z_{\alpha/2}\sqrt{\dfrac{pq}{n}}$$

Divide by z, square both sides, and turn the fraction over:

$$\dfrac{E}{z_{\alpha/2}} = \sqrt{\dfrac{pq}{n}} \qquad \dfrac{E^2}{z_{\alpha/2}^2} = \dfrac{pq}{n} \qquad n = pq\left(\dfrac{z_{\alpha/2}}{E}\right)^2$$

- $n$, the sample size you need.
- $p$ and $q$, the share you expect and its complement.
- $z_{\alpha/2}$, the critical value for the level: 1.645, 1.96 or 2.576.
- $E$, the margin of error you want, as a decimal: 1% is 0.01.

The sheet prints it as $n = pq\left[z_{\alpha/2} \cdot \frac{1}{E}\right]^2$. It is the same line, because $z \cdot \frac{1}{E}$ is $\frac{z}{E}$.

## Why the sheet's other line has 1/4

Before the survey you usually do not know p. That is why you are running it.

So play it safe. Use the p that makes $pq$ as big as it can be. A bigger $pq$ means a bigger n, so that n is enough whatever p turns out to be.

```diagram
{"type": "grid", "title": "pq is largest at p = 0.5, where it is 0.25", "nodes": [{"id": "h0", "label": "p", "row": 0, "col": 0}, {"id": "h1", "label": "q = 1 − p", "row": 0, "col": 1}, {"id": "h2", "label": "pq", "row": 0, "col": 2}, {"id": "a0", "label": "0.1", "row": 1, "col": 0}, {"id": "a1", "label": "0.9", "row": 1, "col": 1}, {"id": "a2", "label": "0.09", "row": 1, "col": 2}, {"id": "b0", "label": "0.2", "row": 2, "col": 0}, {"id": "b1", "label": "0.8", "row": 2, "col": 1}, {"id": "b2", "label": "0.16", "row": 2, "col": 2}, {"id": "c0", "label": "0.3", "row": 3, "col": 0}, {"id": "c1", "label": "0.7", "row": 3, "col": 1}, {"id": "c2", "label": "0.21", "row": 3, "col": 2}, {"id": "d0", "label": "0.4", "row": 4, "col": 0}, {"id": "d1", "label": "0.6", "row": 4, "col": 1}, {"id": "d2", "label": "0.24", "row": 4, "col": 2}, {"id": "e0", "label": "0.5", "row": 5, "col": 0}, {"id": "e1", "label": "0.5", "row": 5, "col": 1}, {"id": "e2", "label": "0.25", "row": 5, "col": 2}, {"id": "f0", "label": "0.6", "row": 6, "col": 0}, {"id": "f1", "label": "0.4", "row": 6, "col": 1}, {"id": "f2", "label": "0.24", "row": 6, "col": 2}, {"id": "g0", "label": "0.7", "row": 7, "col": 0}, {"id": "g1", "label": "0.3", "row": 7, "col": 1}, {"id": "g2", "label": "0.21", "row": 7, "col": 2}, {"id": "i0", "label": "0.8", "row": 8, "col": 0}, {"id": "i1", "label": "0.2", "row": 8, "col": 1}, {"id": "i2", "label": "0.16", "row": 8, "col": 2}, {"id": "j0", "label": "0.9", "row": 9, "col": 0}, {"id": "j1", "label": "0.1", "row": 9, "col": 1}, {"id": "j2", "label": "0.09", "row": 9, "col": 2}], "hi": ["e0", "e1", "e2"], "caption": "pq rises to 0.25 at p = 0.5 and falls the same way on both sides."}
```

**With no idea of p, use $p = q = \frac{1}{2}$, so $pq = \frac{1}{4}$.** That is the sheet's first line, $n = \frac{1}{4}\left[z_{\alpha/2} \cdot \frac{1}{E}\right]^2$. The notes call one half the *worst case level for E*. Just like packing for the worst weather the forecast allows: you may carry a coat you never wear, but you are never caught short.

## A tiny case: E = 0.1 at 95%

- $E = 0.1$, the arm you want: ten percentage points.
- $z_{0.025} = 1.96$, the 95% critical value.
- $pq = \frac{1}{4}$, the worst case.

$$n = \underbrace{\tfrac{1}{4}}_{\text{worst-case pq}}\left(\dfrac{\underbrace{1.96}_{\text{95 percent}}}{\underbrace{0.1}_{E}}\right)^2 = \tfrac{1}{4} \times 384.16 = \mathbf{96.04}$$

You cannot ask 96.04 people. 96 is just short: with 96 people the arm is 0.10002, a hair too long. 97 gives 0.0995, inside the target.

**A sample size always rounds UP, even from .04.** Rounding down gives an arm longer than you asked for. For example, 96.04 becomes 97.

## The notes' example: 1% at 99%

The notes want to rerun the iPhone survey with a margin of error of 1% at the 99% level. They take the worst case, $\hat{p} = \hat{q} = \frac{1}{2}$.

- $E = 0.01$, one percentage point.
- $z_{0.005} = 2.576$, the 99% critical value.
- $pq = \frac{1}{4}$, the worst case.

$$n = \underbrace{\tfrac{1}{4}}_{\text{worst-case pq}}\left(\dfrac{\underbrace{2.576}_{\text{99 percent}}}{\underbrace{0.01}_{E}}\right)^2 = \tfrac{1}{4} \times 66357.76 = \mathbf{16589.44}$$

Round up: **16590 students**.

The notes write $n = 16589$, then *We need a sample of at least 16600 students.* Either 16590 or 16600 is a safe answer. 16589 falls short: its arm is 0.0100001, just over 1%.

## When you already know roughly what p is

If an earlier survey gives a value for p, use it. The sheet's second line, $n = pq\left[z_{\alpha/2} \cdot \frac{1}{E}\right]^2$, then asks for fewer people.

For example, a campus survey last year found about 30% of students bike to class. This year's survey wants E = 0.04 at 95%.

- $p = 0.3$, last year's share, so $q = 0.7$.
- $E = 0.04$, the arm wanted.
- $z_{0.025} = 1.96$, the 95% critical value.

$$n = \underbrace{0.3}_{p} \times \underbrace{0.7}_{q} \times \left(\dfrac{\underbrace{1.96}_{\text{95 percent}}}{\underbrace{0.04}_{E}}\right)^2 = 0.21 \times 2401 = 504.21 \to \mathbf{505}$$

The worst case would ask for $0.25 \times 2401 = 600.25$, so 601. Knowing p saves 96 interviews.

## Two intervals on one line: the A/B test

A company tests two versions of its online checkout. This is practice problem 2.

- $n_A = 150$ users see interface A; 18% complete a sale, so $\hat{p}_A = 0.18$.
- $n_B = 125$ users see interface B; 24% complete a sale, so $\hat{p}_B = 0.24$.

Each gets its own six lines at 95%. The conditions pass: $150 \times 0.18 = 27$ and $150 \times 0.82 = 123$; $125 \times 0.24 = 30$ and $125 \times 0.76 = 95$.

$$E_A = \underbrace{1.96}_{\text{95 percent}} \times \underbrace{\sqrt{0.18 \times 0.82 / 150}}_{\text{standard error, 0.031369}} = \mathbf{0.0615} \qquad E_B = \underbrace{1.96}_{\text{95 percent}} \times \underbrace{\sqrt{0.24 \times 0.76 / 125}}_{\text{standard error, 0.038199}} = \mathbf{0.0749}$$

$$A: \underbrace{0.18}_{\text{p-hat A}} \pm \underbrace{0.0615}_{E_A} = \mathbf{(0.1185, 0.2415)} \qquad B: \underbrace{0.24}_{\text{p-hat B}} \pm \underbrace{0.0749}_{E_B} = \mathbf{(0.1651, 0.3149)}$$

B's dot sits higher. But the two arms share the stretch from 0.1651 to 0.2415.

```diagram
{"type": "curve", "title": "The two intervals share 0.1651 to 0.2415", "x": [0.06, 0.38], "xlabel": "share who complete a sale", "curves": [{"dist": "normal", "mu": 0.18, "sigma": 0.0314, "tone": "dim", "label": "A"}, {"dist": "normal", "mu": 0.24, "sigma": 0.0382, "tone": "dim", "label": "B"}], "spans": [{"from": 0.1185, "to": 0.2415, "y": 0.12, "label": "A: 0.1185 to 0.2415", "tone": "blue"}, {"from": 0.1651, "to": 0.3149, "y": 0.36, "label": "B: 0.1651 to 0.3149", "tone": "hl"}], "ticks": [0.1185, 0.1651, 0.2415, 0.3149]}
```

Any value in the shared stretch is believable for both. A true share of 0.20 for both interfaces fits both intervals.

The sheet's answer: *The two confidence intervals are overlapping significantly. Therefore, there is a good chance that proportion A is equal to or larger than proportion B, so we cannot say that interface [B] leads to a higher proportion of sales.*

**Intervals that overlap a lot: you cannot say one share is higher.** Intervals with no overlap at all point the other way. For example, (0.10, 0.20) and (0.25, 0.35) leave a gap, so the evidence says the second share is higher.

The notes add that a formal test for comparing two proportions exists, but it is not covered.

:::warn A higher dot is not a higher truth
B's sample share beats A's, 24% to 18%. But each dot could move by its arm in a new sample, and the arms overlap. Judge the intervals, not the dots.
:::

## Help desk, coffee shop and factory samples; stations and a café compared

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $n = \frac{1}{4}\left[z_{\alpha/2} \cdot \frac{1}{E}\right]^2$, sample size for a confidence interval for p
- $n = pq\left[z_{\alpha/2} \cdot \frac{1}{E}\right]^2$, sample size for a confidence interval for p (p and q known)

**Not on the sheet, so know it:**

- A sample size always rounds UP to the next whole number.
- E as a decimal: 3% is 0.03.
- Critical values: 1.645 (90%), 1.96 (95%), 2.576 (99%).
- Overlapping intervals: you cannot say one share is higher.
:::

```quiz
[
  {"q": "A help desk wants to estimate the share of tickets reopened within a week, to within 3 percentage points at 95% confidence. It has no earlier estimate. How many tickets must it sample?", "type": "numeric", "answer": 1068, "tolerance": 0.4, "explain": "No idea of p, so use the worst case $pq = \\frac{1}{4}$. $E = 0.03$ and $z_{0.025} = 1.96$. $$n = \\underbrace{\\tfrac{1}{4}}_{\\text{worst-case pq}}\\left(\\dfrac{\\underbrace{1.96}_{\\text{95 percent}}}{\\underbrace{0.03}_{E}}\\right)^2 = \\tfrac{1}{4} \\times 4268.44 = 1067.11$$ Round UP: $\\mathbf{1068}$ tickets. 1067 would leave the arm just over 0.03."},
  {"q": "A coffee shop wants the share of customers who order a pastry, to within 5 percentage points at 90% confidence, with no earlier estimate. Use $z = 1.645$. How many customers must it sample?", "type": "numeric", "answer": 271, "tolerance": 0.4, "explain": "Worst case $pq = \\frac{1}{4}$, $E = 0.05$, $z_{0.05} = 1.645$. $$n = \\underbrace{\\tfrac{1}{4}}_{\\text{worst-case pq}}\\left(\\dfrac{\\underbrace{1.645}_{\\text{90 percent}}}{\\underbrace{0.05}_{E}}\\right)^2 = \\tfrac{1}{4} \\times 1082.41 = 270.60$$ Round UP: $\\mathbf{271}$ customers."},
  {"q": "A factory line found last year that about 15% of its parts needed rework. It wants this year's share to within 2 percentage points at 99% confidence. Use $z = 2.576$ and last year's p. How many parts must it sample?", "type": "numeric", "answer": 2116, "tolerance": 0.4, "explain": "p is roughly known, so use the sheet's second line with $p = 0.15$, $q = 0.85$. $E = 0.02$, $z_{0.005} = 2.576$. $$n = \\underbrace{0.15}_{p} \\times \\underbrace{0.85}_{q} \\times \\left(\\dfrac{\\underbrace{2.576}_{\\text{99 percent}}}{\\underbrace{0.02}_{E}}\\right)^2 = 0.1275 \\times 16589.44 = 2115.15$$ Round UP: $\\mathbf{2116}$ parts. The worst case would ask for 4148."},
  {"q": "Two SkyTrain stations are surveyed, 300 random riders each. The share who pay by tapping a phone gives these 95% intervals: station X $(0.2292, 0.3308)$, station Y $(0.3446, 0.4554)$. What can you conclude?", "options": ["Station Y has a higher share of phone taps: the intervals do not overlap.", "We cannot say either station is higher, because both intervals are 95% intervals.", "We cannot say either station is higher, because the samples are the same size.", "Station X has a higher share, because its interval is narrower."], "answer": 0, "explain": "X: $84/300 = 0.28$, $E = 0.0508$. Y: $120/300 = 0.40$, $E = 0.0554$. X's interval ends at 0.3308 and Y's starts at 0.3446: there is a gap. **With no overlap at all, the interval further right is higher.** Every believable value for Y sits above every believable value for X."},
  {"q": "A campus café samples 200 morning customers (45 buy a pastry) and 200 evening customers (55 buy a pastry). The 95% intervals are morning $(0.1671, 0.2829)$ and evening $(0.2131, 0.3369)$. Can the café say evening customers are more likely to buy a pastry?", "options": ["No: the intervals overlap a lot, so the evening share may be equal to or lower than the morning share.", "Yes: the evening sample share, 0.275, is higher than 0.225.", "Yes: the evening interval's upper limit is higher.", "No: the conditions fail for the morning sample."], "answer": 0, "explain": "Morning: $\\hat{p} = 0.225$, $E = 0.0579$. Evening: $\\hat{p} = 0.275$, $E = 0.0619$. Both conditions pass (45, 155 and 55, 145). The intervals share 0.2131 to 0.2829, so a value such as 0.25 fits both. **Overlapping intervals: you cannot say one share is higher.** A higher dot alone proves nothing."},
  {"q": "True or false: a sample-size answer of 1067.11 should be written as 1067, because that is the nearest whole number.", "type": "tf", "answer": false, "explain": "**A sample size always rounds UP.** With 1067 people the margin of error comes out a hair larger than the target, so the next whole number, 1068, is the smallest sample that meets it."}
]
```

## Remember

- **Sample size: $n = pq\left(z_{\alpha/2}/E\right)^2$, with $pq = \frac{1}{4}$ when p is unknown.**
- **Always round n UP.** 16589.44 becomes 16590.
- Half the margin of error costs four times the sample.
- **Intervals that overlap a lot: you cannot say one share is higher.**
- Judge the two intervals, not the two dots.
