---
title: "Everything on Quiz 9 is one pile of dots"
minutes: 15
---
<!-- facts: none; the iPhone, IQ and exponential numbers are the notes' and the lab's, quoted from the OUTLINE's verified numbers -->
The sampling distribution of p-hat. The standard error. The margin of error. The confidence interval. The Central Limit Theorem. The QQ plot.

## Six things to memorise are one picture

They usually arrive as six separate things to memorise. They are not separate. They are one picture: a pile of dots.

```diagram
{"type": "curve", "title": "The opening shot: one pile of dots", "x": [-0.7, 12.7], "xlabel": "the number each sample gives", "curves": [{"dist": "bars", "start": 0, "values": [0.0022, 0.0088, 0.027, 0.0648, 0.121, 0.176, 0.1995, 0.176, 0.121, 0.0648, 0.027, 0.0088, 0.0022], "hi": [6]}, {"dist": "normal", "mu": 6, "sigma": 2, "dashed": true}], "ticks": [{"x": 0, "label": "low"}, {"x": 6, "label": "centre"}, {"x": 12, "label": "high"}], "notes": [{"text": ["each bar: samples", "that landed there"], "at": [10.6, 0.85], "to": [8.1, 0.45]}]}
```

Bars stacked tallest in the middle, falling away the same on both sides. Every question on Quiz 9 is a fact about this stack.

## One sample gives one number; many samples give a pile

So, let's build it from nothing. Take 200 BCIT students at random. Count the iPhone users. Divide by 200.

That share has a name: $\hat{p}$ (say "p-hat"). Here X is the count of iPhone users, so $\hat{p} = X/n$.

Drop it on a number line as a blue dot. Take another 200 students. Their share lands somewhere else.

Here is the one question all of Quiz 9 asks: **if I took another sample, how far could my number move?**

### A thousand samples, a thousand dots

Watch the dots. No one tells them to make a bell. They make one anyway.

```widget
sample-pile-play
{"stat": "phat", "p": 0.572, "n": 200, "what": "iPhone users", "title": "A thousand samples of 200 students pile up into a bell around 0.572"}
```

That pile is the **sampling distribution of $\hat{p}$**: in the notes' words, *the probability distribution of p-hat for all possible random samples of size n.* Just like a term of commute weeks: each week's share of late buses is one dot, and the term stacks those shares into a pile.

A bell is what the notes call **normal**. The two words mean the same.

## The pile sits on the truth, and its width has a formula

The pink line is the truth: 57.2% of all BCIT students use an iPhone. That is p. In real life you never see it.

The pile is centred right on the pink line.

$$\mu_{\hat{p}} = \underbrace{p}_{\text{the truth}} = \mathbf{0.572}$$

The green arrow is the width of the pile. Its name is the **standard error**, the standard deviation of $\hat{p}$. A typical sample lands about one green arrow from the truth.

$$\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$$

- $p = 0.572$, the share of all BCIT students who use an iPhone.
- $q = 1 - p = 0.428$, the share who do not.
- $n = 200$, the students in one sample.

$$\dfrac{pq}{n} = \dfrac{\underbrace{0.572}_{p} \times \underbrace{0.428}_{q = 1 - p}}{\underbrace{200}_{\text{students per sample}}} = 0.00122408$$

$$\sigma_{\hat{p}} = \underbrace{\sqrt{0.00122408}}_{\text{root of the line above}} = \mathbf{0.0350}$$

School teaches this as a separate rule. It is not. It is the binomial's $\sqrt{npq}$ for the count X, divided by n.

```diagram
{"type": "curve", "title": "Centre 0.572, one width 0.0350 each side", "x": [0.45, 0.7], "xlabel": "p-hat, the share in one sample", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035}], "lines": [{"x": 0.572, "label": "p = 0.572", "full": true, "solid": true, "tone": "red"}], "spans": [{"from": 0.572, "to": 0.607, "y": 0.45, "label": "0.0350"}], "ticks": [0.537, 0.572, 0.607]}
```

**The pile is a bell when np and nq are both 5 or more.** Here both pass easily.

$$np = \underbrace{200}_{n} \times \underbrace{0.572}_{p} = \mathbf{114.4} \qquad nq = \underbrace{200}_{n} \times \underbrace{0.428}_{q} = \mathbf{85.6}$$

## 95% of the pile lies within 1.96 widths of the centre

Now walk out from the centre, one green arrow at a time. At 1.96 arrows each side, you hold 95% of the dots. The other 5% splits into two tails of 2.5%.

Why 1.96? The Z table gives 0.975 to its left: the middle 95% plus one tail.

That reach is the orange arm. Its name is the **margin of error**, E.

$$E = \underbrace{1.96}_{\text{reach for 95\%, in widths}} \times \underbrace{0.0350}_{\text{one width}} = \mathbf{0.0686}$$

$$\underbrace{0.572}_{p} - \underbrace{0.0686}_{E} = \mathbf{0.503} \qquad \underbrace{0.572}_{p} + \underbrace{0.0686}_{E} = \mathbf{0.641}$$

```diagram
{"type": "curve", "title": "The middle 95% reaches from 0.503 to 0.641", "x": [0.45, 0.7], "xlabel": "p-hat", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035}], "shade": [{"to": 0.503, "label": "2.5%", "tone": "dim"}, {"from": 0.503, "to": 0.641, "label": "95%", "tone": "hl"}, {"from": 0.641, "label": "2.5%", "tone": "dim"}], "ticks": [0.503, 0.572, 0.641]}
```

For example, the notes write: *there is a 95% probability that p-hat is between 50.3% and 64.1%.* Another level swaps the 1.96: 1.645 for 90%, 2.576 for 99%.

$$E = z_{\alpha/2}\sqrt{\dfrac{pq}{n}}$$

## Your interval is the same reach, measured from your own dot

Here is the catch. In real life you never see the pink line. You get one sample: one blue dot.

But a reach works both ways. **If your dot is within E of the truth, the truth is within E of your dot.** So put the orange arm on your own dot. That is the **confidence interval**.

School teaches this as a separate rule. It is not. It is the margin of error, measured from the other end.

### A hundred samples, a hundred arms

Watch the arms. Most touch the pink line. A few land too far out and miss.

```widget
ci-flip-play
{"p": 0.572, "n": 200, "level": 0.95, "count": 100, "title": "About 95 of 100 arms of length E cover the truth"}
```

Just like a net cast from where you stand: you never see the fish, but a net that wide catches it from most spots.

### The notes' one sample: 117 iPhone users out of 200

- $n = 200$, the students in the sample.
- $X = 117$, the iPhone users among them.

The truth is unknown now, so your dot stands in: $\hat{p}$ and $\hat{q}$ replace p and q in the width.

$$\hat{p} = \dfrac{\underbrace{117}_{\text{iPhone users}}}{\underbrace{200}_{\text{students}}} = \mathbf{0.585} \qquad \hat{q} = \underbrace{1}_{\text{everyone}} - \underbrace{0.585}_{\hat{p}} = \mathbf{0.415}$$

$$\dfrac{\hat{p}\hat{q}}{n} = \dfrac{\underbrace{0.585}_{\hat{p}} \times \underbrace{0.415}_{\hat{q}}}{\underbrace{200}_{n}} = 0.001213875$$

$$E = \underbrace{1.96}_{z \text{ for } 95\%} \times \underbrace{\sqrt{0.001213875}}_{0.034841 \text{, the width}} = \mathbf{0.0683}$$

$$\underbrace{0.585}_{\hat{p}} - \underbrace{0.0683}_{E} = \mathbf{0.517} \qquad \underbrace{0.585}_{\hat{p}} + \underbrace{0.0683}_{E} = \mathbf{0.653}$$

The notes conclude: *with 95% confidence we think the proportion of all BCIT students who use an iPhone is between 51.7% and 65.3%.*

$$\hat{p} - E < p < \hat{p} + E \qquad E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$$

## Boil each sample down to an average instead: the same pile

Now change one thing. Take each sample's average instead of a share.

IQ scores make a bell with mean 100 and standard deviation 15. Take 25 people. Average their scores. That average is $\bar{X}$ (say "X-bar"). Here X is one person's score.

### A thousand averages of 25 scores

Watch the pile stack up on 100 again, much narrower than the scores themselves.

```widget
sample-pile-play
{"stat": "xbar", "pop": "normal", "mu": 100, "sigma": 15, "n": 25, "what": "IQ score", "title": "Averages of 25 IQ scores pile up around 100, one width of 3 each side"}
```

Same pile. The pink line is now μ. Only the green arrow is new.

$$\mu_{\bar{X}} = \underbrace{\mu}_{\text{the truth}} = \mathbf{100} \qquad \sigma_{\bar{X}} = \dfrac{\underbrace{15}_{\sigma \text{, one person}}}{\underbrace{\sqrt{25}}_{\sqrt{n} = 5}} = \mathbf{3}$$

**Averaging narrows the pile, because high and low scores in one sample cancel.** For example, one person can score 130, but an average of 25 people almost never does. The notes call this width the *standard error of the mean*.

## The pile is a bell even when the population is not

Now break the population. The lab's exponential, mean 0.25, is badly skewed: tall at 0, then falling, with a long right tail.

Average 1 value, then 2, 10, 50 and 100. Watch the shape at each size.

```widget
xbar-n-play
{"pop": "exp", "mu": 0.25, "ns": [1, 2, 10, 50, 100], "title": "Averages from a skewed population turn into a bell as n grows"}
```

At n = 1 the pile is as skewed as the population. By n = 50 it is a bell. The green arrow shrinks the whole way.

$$\sigma_{\bar{X}} = \dfrac{\underbrace{0.25}_{\sigma}}{\underbrace{\sqrt{100}}_{\sqrt{n} = 10}} = \mathbf{0.025}$$

That is the **Central Limit Theorem: the pile of X-bar is a bell when X is normal, or when n is 30 or more.** Just like song lengths: a few songs run very long, yet averages of 30 songs pile up in an even bell.

## A QQ plot tells a bell from a list of numbers

One question is left. You hold a list of numbers. Are they bell-shaped? It matters when n is under 30, because then the rule promises a bell only if X is normal.

A histogram of a few values is too lumpy to tell. So sort the values. Beside each, put where a perfect bell-shaped sample of that size would sit. Plot one against the other.

### Thirty values against a perfect bell

Watch the grey dots move into place, one pair at a time. They fall along a straight line.

```widget
qq-build-play
{"shape": "normal", "n": 30, "title": "Thirty values from a bell fall along a straight line"}
```

In the lab's words, *if the data come from a normal distribution, then the points will form a line with positive slope.* **A QQ plot on a straight line means the data are bell-shaped.** For example, points that bend up steeply at the right say the values have a long right tail.

## The whole picture in six lines

So here it is, all in one picture.

1. Take a sample, boil it down to one number, drop it as a dot. Repeat: the dots make a pile.
2. The pile sits on the truth: p for a share, μ for an average.
3. Its width is the standard error: $\sqrt{pq/n}$ for a share, $\sigma/\sqrt{n}$ for an average.
4. 95% of the pile lies within 1.96 widths of the centre. That reach is the margin of error E.
5. Measured from your own dot, the same reach is the confidence interval, $\hat{p} \pm E$.
6. The pile of shares is a bell when np and nq are 5 or more. The pile of averages is a bell when X is normal or n is 30 or more. A straight QQ plot says X is normal.

**Quiz 9 is not six rules. It is one pile of dots.** When a question hands you a sample, look for the pile behind it. It is always there.

| Thing the notes teach | What it is in the picture | Lesson |
|---|---|---|
| sampling distribution of $\hat{p}$ | the pile, when each sample is boiled down to a share | [The pile of p-hat](#/math3042-q9/phat-sampling-distribution) |
| $\mu_{\hat{p}} = p$ | where the pile is centred: on the truth | [The pile of p-hat](#/math3042-q9/phat-sampling-distribution) |
| $\sigma_{\hat{p}} = \sqrt{pq/n}$ | how wide the pile is | [The pile of p-hat](#/math3042-q9/phat-sampling-distribution) |
| $np \ge 5$ and $nq \ge 5$ | when the pile is a bell | [The pile of p-hat](#/math3042-q9/phat-sampling-distribution) |
| margin of error $E = z_{\alpha/2}\sqrt{pq/n}$ | how far from the centre 95% of the pile reaches | [The margin of error](#/math3042-q9/margin-of-error) |
| confidence interval $\hat{p} \pm E$ | the same reach, measured from your one dot instead of from the centre | [A confidence interval for p](#/math3042-q9/ci-for-p) |
| sampling distribution of $\bar{X}$ | the pile, when each sample is boiled down to an average | [The pile of X-bar](#/math3042-q9/xbar-sampling-distribution) |
| $\mu_{\bar{X}} = \mu$, $\sigma_{\bar{X}} = \sigma/\sqrt{n}$ | the centre and width of that pile | [The pile of X-bar](#/math3042-q9/xbar-sampling-distribution) |
| Central Limit Theorem, $n \ge 30$ | the pile is a bell even when the population is not | [The Central Limit Theorem](#/math3042-q9/clt-shape-rule) |
| QQ plot | a test of whether a set of numbers is bell-shaped: line = yes | [The QQ plot](#/math3042-q9/qq-plot) |
