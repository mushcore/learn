---
title: "The Central Limit Theorem: when the pile of X-bar is a bell"
minutes: 12
---
<!-- facts: none; the dice, skewed-X and exponential examples come from the notes (section 6.3) and Lab 9; the practice items are new -->
The centre and the width of the pile of averages need no conditions. Its shape does, and every answer gives the shape with its reason.

## Averages of a lopsided population

Start with one value $X$: one wait at a help desk. It is usually short and now and then very long. Its histogram is a steep wall on the left and a long tail to the right.

Average two waits, and the pile of averages is still lopsided. Average fifty, and the pile is a bell.

"Bell" and "normal" mean the same thing in this module: the symmetric hump of the normal distribution.

**The Central Limit Theorem says the pile of averages becomes a bell as n grows, even when X itself is not a bell.** Just like one long wait turning up now and then, while an average of fifty waits that is far from the usual is rare on either side.

## Averages of exponential waits, from n = 1 to n = 100

This is Lab 9's second population: an exponential variable, mostly small values with a long right tail, with mean 0.25 and standard deviation 0.25. The pink line is the truth, $\mu = 0.25$. Each blue dot is one sample's $\bar{X}$ (say "X-bar"). The green arrow is the width of the pile, $\sigma / \sqrt{n}$.

Watch the pile at n = 1 and 2: it leans hard, like the population. By n = 10 it is close to a bell. By n = 100 it is a narrow bell, and the green arrow has shrunk from 0.25 to 0.025.

```widget
xbar-n-play
{ "pop": "exp", "mu": 0.25, "ns": [1, 2, 10, 50, 100], "title": "Exponential waits: the pile of averages leans at n = 1 and becomes a bell by n = 50" }
```

The lab's answer: *For small samples, the distribution of X-bar is highly skewed like the exponential distribution. As n increases beyond about 10, the shape becomes closer to a "bell shaped" normal.*

## The rule has two doors

**$\bar{X}$ is normal if X is normal, for any n. If X is not normal, $\bar{X}$ is approximately normal once n is 30 or more.**

**If X is not normal and n is under 30, you cannot say $\bar{X}$ is normal.** For example, averages of 4 skewed waits are still lopsided; averages of 40 are a bell.

```diagram
{"type": "tree", "title": "Is the pile of X-bar normal?", "nodes": [
{"id": "q1", "label": "Is X normal?"},
{"id": "y1", "label": "Yes: X-bar is normal", "sub": "for any n", "parent": "q1"},
{"id": "q2", "label": "No: is n 30 or more?", "parent": "q1"},
{"id": "y2", "label": "Yes: X-bar is approximately normal", "sub": "Central Limit Theorem", "parent": "q2"},
{"id": "n2", "label": "No: cannot say X-bar is normal", "parent": "q2"}
], "hi": ["y1", "y2"], "caption": "Two doors lead to a bell. A skewed X with a small n leads to neither."}
```

The first door needs no theorem: averages of normal values are always normal. In Lab 9, averages from a normal population were bells at every n from 1 to 100; they only became *narrower and taller as n increases*.

## Dice: n = 2 is a triangle, n = 50 is a bell

One die is flat: faces 1 to 6, each with chance 1/6. Flat is not normal, so only the second door can help. This is the notes' example.

- $\mu = 3.5$, the mean of one die.
- $\sigma = 1.71$, the standard deviation of one die.
- $n = 2$, then $n = 50$, the dice in one sample.

With two dice:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{1.71}_{\text{sd of one die}}}{\underbrace{\sqrt{2}}_{\text{root of 2 dice}}} = \mathbf{1.21}$$

The notes write *Shape is not exactly normal*: the pile is a triangle. Two is far below 30.

With fifty dice:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{1.71}_{\text{sd of one die}}}{\underbrace{\sqrt{50}}_{\text{root of 50 dice}}} = \mathbf{0.242}$$

The notes write *Normal since n ≥ 30*. The centre stays at 3.5 both times.

```diagram
{"type": "curve", "title": "Averages of dice: a triangle at n = 2, a narrow bell at n = 50", "panels": [
{"title": "n = 2: a triangle", "x": [1, 13], "xlabel": "average of 2 dice", "curves": [{"dist": "bars", "start": 2, "values": [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], "hi": [7]}], "ticks": [{"x": 2, "label": "1"}, {"x": 7, "label": "3.5"}, {"x": 12, "label": "6"}]},
{"title": "n = 50: a bell, sd 0.242", "x": [0.5, 6.5], "xlabel": "average of 50 dice", "curves": [{"dist": "normal", "mu": 3.5, "sigma": 0.242}], "ticks": [1, 3.5, 6]}
]}
```

Watch the flat population on top and the pile below turn from a triangle into a bell.

```widget
xbar-n-play
{ "pop": "dice", "ns": [1, 2, 10, 50], "title": "Dice: flat for one die, a triangle for two, a bell by fifty" }
```

## The more lopsided X is, the bigger n must be

The notes put it this way: *If the distribution of a variable X is highly skewed then it requires a larger n before the sampling distribution of X-bar becomes close to normal.*

Their three pictures: X is *highly right skewed*. Averages of 4 are *less skewed but still not a good fit to a normal distribution*. Averages of 30: *Now X-bar fits a normal distribution.*

**30 is the course's line for every X that is not normal.** For example, averages of 10 dice already look close to a bell, but the answer for n = 10 is still "cannot say it is normal".

## The bell check in numbers: 68, 95, 99.7

A bell keeps about 68% of its pile within one width of the centre, 95% within two, and 99.7% within three. Lab 9 counted the real shares for the exponential pile, over 100 000 samples.

| Sample size | within 1 width | within 2 widths | within 3 widths |
|---|---|---|---|
| n = 1 | 0.86418 | 0.9509 | 0.98167 |
| n = 5 | 0.70204 | 0.95803 | 0.99009 |
| n = 50 | 0.68385 | 0.95464 | 0.99652 |

At n = 1 the shares are far off: the pile is the lopsided population itself. At n = 5 they are close. At n = 50 they are very close to 68, 95 and 99.7: a bell.

## The sheet prints n > 30

The formula sheet prints *n > 30*. The notes and the lab write n ≥ 30, and the notes' income example uses exactly n = 30 and calls the pile normal. Write "n ≥ 30".

## Three statements that sound like a contradiction

Take a skewed population and one random sample of 100 from it.

1. **The population is not normal.** Its histogram is skewed.
2. **One sample of 100 is not normal either.** A sample looks like its population, so its histogram is skewed too.
3. **The pile of sample means is approximately normal.** Each dot in it is a whole sample's average, and n = 100 is 30 or more.

School teaches this as a puzzle. It is not. The Central Limit Theorem talks only about the third object, the pile. [Three different objects](#/math3042-q9/population-sample-pile) works through it.

## Espresso shots, help-desk tickets, downloads and a platform wait

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\overline{X}$ is normally distributed as long as: X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- The notes and the lab write $n \ge 30$; exactly 30 counts.
- X not normal and n under 30: you cannot say $\bar{X}$ is normal.
- Always give the reason with the shape.
:::

```quiz
[
  {"q": "A coffee shop's espresso shots have volumes X that are normal with μ = 30 mL and σ = 2 mL. A barista measures samples of n = 10 shots. Is $\\bar{X}$ normal?", "options": ["Yes, normal for any n, because X is normal", "Yes, approximately normal, because n is 30 or more", "Cannot say it is normal: X is not normal and n is under 30", "No: n = 10 is too small, so $\\bar{X}$ is not normal"], "answer": 0, "explain": "X is normal, so the first door opens: averages of normal values are normal for every n. That n = 10 is under 30 does not matter here."},
  {"q": "Help-desk ticket times X are strongly right skewed: most tickets close fast and a few take hours. A manager averages samples of n = 10 tickets. Is $\\bar{X}$ normal?", "options": ["Yes, normal for any n, because X is normal", "Yes, approximately normal, because n is 30 or more", "Cannot say it is normal: X is not normal and n is under 30", "Yes: every average is normal"], "answer": 2, "explain": "X is not normal, so the first door is shut. n = 10 is under 30, so the second door is shut too. The answer is that you cannot say $\\bar{X}$ is normal; with a strongly skewed X, averages of 10 still lean."},
  {"q": "Download times X from a campus server are right skewed. A script averages samples of n = 40 downloads. Is $\\bar{X}$ normal?", "options": ["Yes, normal for any n, because X is normal", "Yes, approximately normal, because n is 30 or more", "Cannot say it is normal: X is not normal and n is under 30", "No: a skewed X always gives a skewed $\\bar{X}$"], "answer": 1, "explain": "X is not normal, but n = 40 is 30 or more, so by the Central Limit Theorem $\\bar{X}$ is approximately normal."},
  {"q": "Waits X on a SkyTrain platform have an unknown shape. A rider averages samples of n = 64 waits. Is $\\bar{X}$ normal?", "options": ["Yes, normal for any n, because X is normal", "Yes, approximately normal, because n is 30 or more", "Cannot say it is normal: X is not normal and n is under 30", "No: the shape of X must be known first"], "answer": 1, "explain": "Nothing says X is normal, but n = 64 is 30 or more. The Central Limit Theorem works whatever the shape of X, so $\\bar{X}$ is approximately normal."},
  {"q": "Scores X on a COMP course lab are normal with μ = 72 and σ = 10. A TA averages samples of n = 4 scores. Is $\\bar{X}$ normal?", "options": ["Yes, normal for any n, because X is normal", "Yes, approximately normal, because n is 30 or more", "Cannot say it is normal: X is not normal and n is under 30", "No: n must be at least 30"], "answer": 0, "explain": "X is normal, so $\\bar{X}$ is normal for any n, even n = 4. The rule n ≥ 30 is only needed when X is not normal."},
  {"q": "True or false: one random sample of 100 values from a strongly skewed population will have a bell-shaped histogram, by the Central Limit Theorem.", "type": "tf", "answer": false, "explain": "A sample looks like its population, so its histogram is skewed too. The Central Limit Theorem is about the pile of many sample means, not about the values inside one sample."}
]
```

## Remember

- **X normal: $\bar{X}$ normal for any n.**
- **X not normal: $\bar{X}$ approximately normal once n is 30 or more.**
- **X not normal and n under 30: cannot say it is normal.**
- The more skewed X is, the larger n must be; the course line is 30.
- The sheet prints n > 30; write n ≥ 30 with the reason.
- The population and one sample keep their shape. Only the pile of averages becomes a bell.
