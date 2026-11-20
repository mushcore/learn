---
title: "The sampling distribution of X-bar: centre mu, width sigma over root n"
minutes: 12
---
<!-- facts: none; the IQ, income and dice examples come from the notes (section 6.3); every other number is computed in the writer's check script -->
A sample of incomes, IQ scores or download times gets boiled down to its average, not a share. This lesson builds the pile of those averages and answers the one question for them: if I took another sample, how far could my average move?

## Boil each sample down to its average

Take 25 people. Write down each IQ score. Add them up and divide by 25.

That one number is the sample's average. It has a name: $\bar{X}$ (say "X-bar"). Here $X$ is one value of the variable, such as one person's IQ.

Now take another 25 people. Their average comes out a little different. A third sample gives a third average.

**The sampling distribution of $\bar{X}$ is the pile of all the averages you could get from samples of size n.** Just like the pile of p-hat values, except each sample is boiled down to an average instead of a share.

The pink line is the truth, $\mu$, the average of the whole population. You never see it. A blue dot is one sample's $\bar{X}$, the only thing you see. The green arrow is the width of the pile.

## The pile of IQ averages, built one sample at a time

Watch the blue dots land around the pink line. No one tells them to make a bell. Then watch the green arrow: the pile is far narrower than the spread of single people.

```widget
sample-pile-play
{ "stat": "xbar", "pop": "normal", "mu": 100, "sigma": 15, "n": 25, "what": "IQ score", "title": "Averages of 25 IQ scores pile up around 100 with width 3" }
```

## Two dice: the smallest pile of averages

Roll two dice. Average the two numbers. That is one sample of size 2.

- $X$, the number one die shows: 1 to 6, each with chance 1/6.
- $n = 2$, the dice in one sample.
- $\bar{X}$, the average of the two dice.

There are 6 × 6 = 36 ways the pair can land, all equally likely. The table lists every average and the pairs that give it.

```diagram
{"type": "grid", "title": "All 36 pairs of two dice, sorted by their average", "nodes": [
{"id": "h0", "label": "Average", "row": 0, "col": 0}, {"id": "h1", "label": "Pairs (die 1, die 2)", "row": 0, "col": 1}, {"id": "h2", "label": "Count of 36", "row": 0, "col": 2},
{"id": "a1", "label": "1", "row": 1, "col": 0}, {"id": "p1", "label": "(1,1)", "row": 1, "col": 1}, {"id": "c1", "label": "1", "row": 1, "col": 2},
{"id": "a2", "label": "1.5", "row": 2, "col": 0}, {"id": "p2", "label": "(1,2) (2,1)", "row": 2, "col": 1}, {"id": "c2", "label": "2", "row": 2, "col": 2},
{"id": "a3", "label": "2", "row": 3, "col": 0}, {"id": "p3", "label": "(1,3) (2,2) (3,1)", "row": 3, "col": 1}, {"id": "c3", "label": "3", "row": 3, "col": 2},
{"id": "a4", "label": "2.5", "row": 4, "col": 0}, {"id": "p4", "label": "(1,4) (2,3) (3,2) (4,1)", "row": 4, "col": 1}, {"id": "c4", "label": "4", "row": 4, "col": 2},
{"id": "a5", "label": "3", "row": 5, "col": 0}, {"id": "p5", "label": "(1,5) (2,4) (3,3) (4,2) (5,1)", "row": 5, "col": 1}, {"id": "c5", "label": "5", "row": 5, "col": 2},
{"id": "a6", "label": "3.5", "row": 6, "col": 0}, {"id": "p6", "label": "(1,6) (2,5) (3,4) (4,3) (5,2) (6,1)", "row": 6, "col": 1}, {"id": "c6", "label": "6", "row": 6, "col": 2},
{"id": "a7", "label": "4", "row": 7, "col": 0}, {"id": "p7", "label": "(2,6) (3,5) (4,4) (5,3) (6,2)", "row": 7, "col": 1}, {"id": "c7", "label": "5", "row": 7, "col": 2},
{"id": "a8", "label": "4.5", "row": 8, "col": 0}, {"id": "p8", "label": "(3,6) (4,5) (5,4) (6,3)", "row": 8, "col": 1}, {"id": "c8", "label": "4", "row": 8, "col": 2},
{"id": "a9", "label": "5", "row": 9, "col": 0}, {"id": "p9", "label": "(4,6) (5,5) (6,4)", "row": 9, "col": 1}, {"id": "c9", "label": "3", "row": 9, "col": 2},
{"id": "a10", "label": "5.5", "row": 10, "col": 0}, {"id": "p10", "label": "(5,6) (6,5)", "row": 10, "col": 1}, {"id": "c10", "label": "2", "row": 10, "col": 2},
{"id": "a11", "label": "6", "row": 11, "col": 0}, {"id": "p11", "label": "(6,6)", "row": 11, "col": 1}, {"id": "c11", "label": "1", "row": 11, "col": 2}
], "hi": ["a6", "p6", "c6"], "caption": "Six pairs average 3.5. Only one pair averages 1, and only one averages 6."}
```

Stack those counts as bars and the pile appears. It is a triangle, tallest at 3.5.

```diagram
{"type": "curve", "title": "The pile of two-dice averages: a triangle peaked at 3.5", "x": [1, 13], "xlabel": "average of the two dice", "ylabel": "pairs out of 36", "curves": [{"dist": "bars", "start": 2, "values": [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], "hi": [7]}], "ticks": [{"x": 2, "label": "1"}, {"x": 4, "label": "2"}, {"x": 6, "label": "3"}, {"x": 7, "label": "3.5"}, {"x": 8, "label": "4"}, {"x": 10, "label": "5"}, {"x": 12, "label": "6"}], "yticks": [{"y": 1, "label": "1"}, {"y": 6, "label": "6"}]}
```

One die alone is flat: every face has the same chance. The averages are not flat. They pile up in the middle, because many pairs average 3.5 and only one pair averages 1.

The centre of this pile is 3.5, the same as one die's mean. Its width is 1.21, smaller than one die's 1.71.

## Why averaging narrows the pile

A high value and a low value cancel. A 6 with a 1 averages 3.5.

To get an extreme average, most of the values in the sample must be extreme in the same direction. That is rare, and it gets rarer as n grows.

**Bigger samples give averages that tend to sit closer to $\mu$.** For example, one person with an IQ of 120 is common enough, but 25 people averaging 120 would be astonishing.

## The centre and the width, each symbol named

It is not a new rule. It is the centre and the width of the pile you just built.

$$\mu_{\bar{X}} = \mu \qquad \sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$$

- $\mu$, the mean of one value $X$: the pink line.
- $\sigma$, the standard deviation of one value $X$.
- $n$, the number of values in each sample.
- $\mu_{\bar{X}}$, where the pile of averages is centred.
- $\sigma_{\bar{X}}$, the width of the pile: the green arrow.

**The pile of averages is centred on the truth, and its width is $\sigma$ divided by the root of n.** The notes put it this way: *Think of $\mu_{\bar{X}}$ as the average of the averages. Think of $\sigma_{\bar{X}}$ as the typical error between $\bar{X}$ and $\mu$ ("standard error of the mean").*

For example, two dice: the centre is 3.5, and the width is one die's 1.71 divided by $\sqrt{2}$:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{1.71}_{\text{sd of one die}}}{\underbrace{\sqrt{2}}_{\text{root of 2 dice}}} = \mathbf{1.21}$$

:::warn The root is of n, not of the whole fraction
Divide $\sigma$ by $\sqrt{n}$. Taking $\sqrt{\sigma / n}$ instead gives a different number with the wrong units.
:::

## IQ scores in samples of 25

IQ scores are normal; this is the notes' example.

- $\mu = 100$, the mean IQ of all people.
- $\sigma = 15$, the standard deviation of one person's IQ.
- $n = 25$, the people in each sample.

Centre:

$$\mu_{\bar{X}} = \underbrace{100}_{\mu, \text{ mean IQ}} = \mathbf{100}$$

Width:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{15}_{\text{sd of one IQ}}}{\underbrace{\sqrt{25}}_{\text{root of 25 people}}} = \dfrac{15}{5} = \mathbf{3}$$

Shape: normal, because X is normal. The notes write it as *normal because: X is normal*.

The wide bell is single people: one width each side of 100 reaches 85 and 115. The narrow bell is averages of 25: one width each side reaches 97 and 103. Same centre, one fifth of the width.

```diagram
{"type": "curve", "title": "One person against the average of 25: same centre, one fifth the width", "x": [50, 150], "xlabel": "IQ score", "curves": [{"dist": "normal", "mu": 100, "sigma": 15, "tone": "dim", "label": "one person: sd 15", "labelAt": [128, 0.3]}, {"dist": "normal", "mu": 100, "sigma": 3, "tone": "ink", "label": "average of 25: sd 3", "labelAt": [118, 0.75]}], "ticks": [85, 97, 100, 103, 115]}
```

## Canadian incomes in samples of 30

Income is heavily skewed: most people earn a moderate amount and a few earn a great deal. This is the notes' example, in thousands of dollars.

- $\mu = 98.8$, the mean income of all Canadians, in \$1000.
- $\sigma = 58.6$, the standard deviation of one income, in \$1000.
- $n = 30$, the people in each sample.

$$\mu_{\bar{X}} = \underbrace{98.8}_{\mu, \text{ mean income}} = \mathbf{98.8}$$

$$\sigma_{\bar{X}} = \dfrac{\underbrace{58.6}_{\text{sd of one income}}}{\underbrace{\sqrt{30}}_{\text{root of 30 people}}} = \mathbf{10.7}$$

The notes write \$98.8K and \$10.7K. Shape: X is not normal, but n is 30 or more, so the pile is approximately normal. The notes write *normal since n ≥ 30*. When the pile is a bell, and when it is not, is [the Central Limit Theorem lesson](#/math3042-q9/clt-shape-rule).

## Downloads, batteries, juice bottles and a bigger sample

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- If X is a numerical random variable with mean $\mu$ and standard deviation $\sigma$, then for the sampling distribution of $\overline{X}$ for samples of size n: $\mu_{\overline{X}} = \mu$, $\sigma_{\overline{X}} = \dfrac{\sigma}{\sqrt{n}}$.

**Not on the sheet, so know it:**

- The centre does not change with n; only the width does.
- To find n from a target width, square $\dfrac{\sigma}{\sigma_{\bar{X}}}$.
- $\sigma_{\bar{X}}$ is called the standard error of the mean.
:::

```quiz
[
  {"q": "A campus file server's download times X have mean μ = 48 s and standard deviation σ = 12 s. For samples of n = 36 downloads, find $\\sigma_{\\bar{X}}$, the standard deviation of the sample mean (in seconds).", "type": "numeric", "answer": 2, "tolerance": 0.01, "explain": "X = one download time, $\\sigma = 12$ s its standard deviation, $n = 36$ downloads per sample. $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{12}_{\\text{sd of one download}}}{\\underbrace{\\sqrt{36}}_{\\text{root of 36 downloads}}} = \\dfrac{12}{6} = \\mathbf{2}$$ So the average of 36 downloads typically lands about 2 s from 48 s."},
  {"q": "A phone model's battery life X has mean μ = 18.4 hours and σ = 2.4 hours. A lab tests samples of n = 64 phones. Find $\\sigma_{\\bar{X}}$ in hours.", "type": "numeric", "answer": 0.3, "tolerance": 0.001, "explain": "X = one phone's battery life, $\\sigma = 2.4$ h its standard deviation, $n = 64$ phones per sample. $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{2.4}_{\\text{sd of one phone}}}{\\underbrace{\\sqrt{64}}_{\\text{root of 64 phones}}} = \\dfrac{2.4}{8} = \\mathbf{0.3}$$"},
  {"q": "Same phones: μ = 18.4 hours, σ = 2.4 hours, samples of n = 64. Where is the pile of sample means centred?", "options": ["18.4 hours", "0.3 hours", "18.4 / 64 = 0.2875 hours", "2.4 hours"], "answer": 0, "explain": "$\\mu_{\\bar{X}} = \\mu$: the average of the averages is the population mean, $\\underbrace{18.4}_{\\mu}$ hours, for any sample size. The 0.3 is the width of the pile, not its centre. 2.4 is the spread of single phones."},
  {"q": "A factory line fills juice bottles; one bottle's volume X has σ = 14 mL. How many bottles must each sample hold so that the standard error of the mean is 2 mL?", "type": "numeric", "answer": 49, "tolerance": 0.4, "explain": "Set the width equal to 2 and solve: $\\dfrac{14}{\\sqrt{n}} = 2$, so $\\sqrt{n} = \\dfrac{14}{2} = 7$. $$n = \\left(\\dfrac{\\underbrace{14}_{\\text{sd of one bottle}}}{\\underbrace{2}_{\\text{target width}}}\\right)^2 = 7^2 = \\mathbf{49}$$"},
  {"q": "A survey team multiplies its sample size by 4 (from n = 25 to n = 100). What happens to the standard error of the mean, $\\sigma / \\sqrt{n}$?", "options": ["It is cut in half", "It is cut to one quarter", "It doubles", "It stays the same"], "answer": 0, "explain": "The root of 4 is 2, so the denominator doubles: $$\\dfrac{\\sigma}{\\underbrace{\\sqrt{4n}}_{\\text{4 times the sample}}} = \\dfrac{\\sigma}{\\underbrace{2}_{\\text{root of 4}}\\sqrt{n}}$$ The width is cut in half. To cut it to a quarter you would need 16 times the sample."},
  {"q": "True or false: taking bigger samples moves the centre of the pile of sample means closer to μ.", "type": "tf", "answer": false, "explain": "The centre is already exactly μ for every sample size: $\\mu_{\\bar{X}} = \\mu$. A bigger n only makes the pile narrower, so each single average tends to land closer to μ."}
]
```

## Remember

- **One sample, boiled down to its average, is one blue dot $\bar{X}$. All the averages you could get make the pile.**
- **Centre: $\mu_{\bar{X}} = \mu$. Width: $\sigma_{\bar{X}} = \sigma / \sqrt{n}$, the standard error of the mean.**
- Averaging cancels highs against lows, so the pile is narrower than the population.
- Four times the sample, half the width.
- The centre never moves with n.
- The shape needs a reason: X normal, or n of 30 or more.
