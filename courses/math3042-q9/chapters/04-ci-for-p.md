---
title: "A confidence interval for p: measure the reach from your own dot"
minutes: 15
---
<!-- facts: none; the iPhone survey (n = 200, X = 117) is the notes' 6.2 example; every other number is new and checked by script -->
In real life nobody hands you p. You hold one sample and one share, and you want to say where the truth is.

## You hold one dot, and the line is hidden

Start from the pile of p-hats. The pink line is the truth, p. It sits in the middle of the pile.

A blue dot is one sample's share, $\hat{p}$ (say "p-hat"). The green arrow is the width of the pile, the standard error.

The orange arm is the margin of error, E. **95% of the pile lands within E of the pink line.** That was [the margin of error](#/math3042-q9/margin-of-error).

Now the catch. In real life you never see the pink line. You see one blue dot.

Here is the flip. If the dot is within E of the line, then the line is within E of the dot. Distance works both ways.

**So measure the same reach from your own dot: from $\hat{p} - E$ to $\hat{p} + E$. That stretch is the confidence interval for p.** Just like a friend who texts "I'm within 2 km of the station": then the station is within 2 km of your friend.

School teaches the confidence interval as a separate rule. It is not. It is the margin of error, measured from the other end.

## The flip, one arm at a time

Watch the arms. Most of them touch the pink line. A few miss, and from inside one sample you cannot tell which.

```widget
ci-flip-play
{ "p": 0.572, "n": 200, "level": 0.95, "count": 100, "title": "Measured from each dot, about 95 of 100 arms reach the truth" }
```

## A dot inside the reach and a dot outside it

Take the notes' iPhone pile, with the truth at 0.572 and n = 200. 95% of the pile lies between 0.503 and 0.641.

On the left, a sample lands at 0.585, inside that reach. Its arm runs from 0.517 to 0.653 and crosses 0.572.

On the right, a sample lands at 0.66, outside the reach. Its arm runs from 0.594 to 0.726 and misses 0.572.

```diagram
{"type": "curve", "title": "Inside the reach, the arm covers p; outside, it misses", "panels": [{"title": "p-hat = 0.585: covers", "x": [0.45, 0.75], "xlabel": "p-hat", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035, "tone": "dim"}], "shade": [{"from": 0.503, "to": 0.641, "tone": "dim"}], "lines": [{"x": 0.572, "label": "p = 0.572", "side": "left", "full": true, "tone": "red"}], "spans": [{"from": 0.517, "to": 0.653, "y": 0.18, "label": "0.517 to 0.653", "tone": "hl"}], "ticks": [0.503, 0.585, 0.641]}, {"title": "p-hat = 0.66: misses", "x": [0.45, 0.75], "xlabel": "p-hat", "curves": [{"dist": "normal", "mu": 0.572, "sigma": 0.035, "tone": "dim"}], "shade": [{"from": 0.503, "to": 0.641, "tone": "dim"}], "lines": [{"x": 0.572, "label": "p = 0.572", "side": "left", "full": true, "tone": "red"}], "spans": [{"from": 0.594, "to": 0.726, "y": 0.18, "label": "0.594 to 0.726", "tone": "hl"}], "ticks": [0.503, 0.641, 0.66]}]}
```

## What changes: p-hat stands in for p

The width of the pile needs p: $\sqrt{pq/n}$. You do not have p. So use the sample's own share in its place.

Here X is the count of successes in the sample, such as the number of students who use an iPhone.

- $\hat{p} = \dfrac{X}{n}$, the share of the sample that are successes.
- $\hat{q} = 1 - \hat{p}$, the share that are not.

$$E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$$

- $z_{\alpha/2}$, the critical value: 1.96 for 95%.
- $\hat{p}$ and $\hat{q}$, the sample's two shares.
- $n$, the sample size.

The bell check uses p-hat too. **Both $n\hat{p} \ge 5$ and $n\hat{q} \ge 5$ must hold, or the rest of the procedure is invalid.** $n\hat{p}$ is just X, and $n\hat{q}$ is just $n - X$. For example, 4 broken mugs in a sample of 150 gives $n\hat{p} = 4$, below 5: no interval.

## The six lines

**A confidence interval answer has six lines: conditions, confidence level, critical value, margin of error, limits, one-sentence conclusion.** The practice sheet lists exactly these steps for every interval question.

```diagram
{"type": "flow", "title": "The six lines of a confidence interval for p", "nodes": [{"id": "c", "label": "1. Conditions", "sub": "X ≥ 5, n − X ≥ 5"}, {"id": "l", "label": "2. Level", "sub": "1 − α"}, {"id": "z", "label": "3. Critical value", "sub": "z for α/2"}, {"id": "e", "label": "4. Margin of error", "sub": "E"}, {"id": "lim", "label": "5. Limits", "sub": "p̂ − E, p̂ + E"}, {"id": "s", "label": "6. Conclusion", "sub": "one sentence"}], "edges": [{"from": "c", "to": "l"}, {"from": "l", "to": "z"}, {"from": "z", "to": "e"}, {"from": "e", "to": "lim"}, {"from": "lim", "to": "s"}], "hi": ["e"], "caption": "If line 1 fails, stop: the procedure is invalid."}
```

| Line | What you write | What the marker checks |
|---|---|---|
| 1. Conditions | $n\hat{p} = 117 \ge 5$, $n\hat{q} = 83 \ge 5$ | both products, each compared with 5 |
| 2. Confidence level | $1 - \alpha = 0.95$ | the level as a decimal |
| 3. Critical value | $z_{0.025} = 1.96$ | the z that matches the level |
| 4. Margin of error | $E = 1.96\sqrt{0.585 \times 0.415/200} = 0.0683$ | the formula, its numbers, and E |
| 5. Limits | $(\hat{p} - E, \hat{p} + E) = (0.517, 0.653)$ | both limits |
| 6. Conclusion | "With 95% confidence ... between 51.7% and 65.3%." | level, population, both limits, in context |

## The notes' iPhone survey in six lines

Now suppose nobody knows the share of all BCIT students who use an iPhone. A random sample of 200 students finds 117 iPhone users.

- $n = 200$, the number of students asked.
- $X = 117$, the number who use an iPhone.
- 95%, the confidence level asked for.

First the two sample shares:

$$\hat{p} = \dfrac{\underbrace{117}_{\text{iPhone users}}}{\underbrace{200}_{\text{students asked}}} = \mathbf{0.585} \qquad \hat{q} = \underbrace{1}_{\text{everyone}} - \underbrace{0.585}_{\text{p-hat}} = \mathbf{0.415}$$

**Line 1, conditions.**

$$n\hat{p} = \underbrace{117}_{X} \ge 5 \qquad n\hat{q} = \underbrace{200}_{n} - \underbrace{117}_{X} = \mathbf{83} \ge 5$$

**Line 2, confidence level.**

$$1 - \alpha = \mathbf{0.95}$$

**Line 3, critical value.**

$$\alpha = \underbrace{1}_{\text{whole area}} - \underbrace{0.95}_{\text{level}} = 0.05 \qquad z_{\alpha/2} = z_{0.025} = \mathbf{1.96}$$

**Line 4, margin of error.** Label the fraction first, then take the root.

$$\dfrac{\hat{p}\hat{q}}{n} = \dfrac{\underbrace{0.585}_{\text{p-hat}} \times \underbrace{0.415}_{\text{q-hat}}}{\underbrace{200}_{\text{sample size}}} = 0.00121388$$

$$E = \underbrace{1.96}_{\text{critical value}} \times \underbrace{\sqrt{0.00121388}}_{\text{standard error, 0.034841}} = 0.068288 = \mathbf{0.0683}$$

**Line 5, limits.**

$$\hat{p} - E = \underbrace{0.585}_{\text{p-hat}} - \underbrace{0.0683}_{E} = \mathbf{0.5167} \qquad \hat{p} + E = \underbrace{0.585}_{\text{p-hat}} + \underbrace{0.0683}_{E} = \mathbf{0.6533}$$

The notes round these to 0.517 and 0.653.

**Line 6, conclusion.** The notes write: *With 95% confidence we think the proportion of all BCIT students who use an iPhone is between 51.7% and 65.3%.*

## A new survey in the same six lines: second monitors

A COMP course surveys a random sample of 160 students. 52 of them use a second monitor at home.

- $n = 160$, the number of students asked.
- $X = 52$, the number with a second monitor.
- 95%, the confidence level.

$$\hat{p} = \dfrac{\underbrace{52}_{\text{with a monitor}}}{\underbrace{160}_{\text{students asked}}} = \mathbf{0.325} \qquad \hat{q} = \underbrace{1}_{\text{everyone}} - \underbrace{0.325}_{\text{p-hat}} = \mathbf{0.675}$$

**Line 1, conditions.**

$$n\hat{p} = \underbrace{52}_{X} \ge 5 \qquad n\hat{q} = \underbrace{160}_{n} - \underbrace{52}_{X} = \mathbf{108} \ge 5$$

**Line 2, confidence level.**

$$1 - \alpha = \mathbf{0.95}$$

**Line 3, critical value.**

$$\alpha = \underbrace{1}_{\text{whole area}} - \underbrace{0.95}_{\text{level}} = 0.05 \qquad z_{\alpha/2} = z_{0.025} = \mathbf{1.96}$$

**Line 4, margin of error.**

$$\dfrac{\hat{p}\hat{q}}{n} = \dfrac{\underbrace{0.325}_{\text{p-hat}} \times \underbrace{0.675}_{\text{q-hat}}}{\underbrace{160}_{\text{sample size}}} = 0.00137109$$

$$E = \underbrace{1.96}_{\text{critical value}} \times \underbrace{\sqrt{0.00137109}}_{\text{standard error, 0.037028}} = 0.072575 = \mathbf{0.0726}$$

**Line 5, limits.**

$$\hat{p} - E = \underbrace{0.325}_{\text{p-hat}} - \underbrace{0.0726}_{E} = \mathbf{0.2524} \qquad \hat{p} + E = \underbrace{0.325}_{\text{p-hat}} + \underbrace{0.0726}_{E} = \mathbf{0.3976}$$

**Line 6, conclusion.** We are 95% confident that between 25.24% and 39.76% of all students in the course use a second monitor at home.

## The conclusion sentence names the population

**The sentence names the level, the population, the thing counted, and both limits.** The pattern: "We are 95% confident that the proportion of [population] who [thing counted] is between [lower] and [upper]." For example, "all BCIT students" and "use an iPhone".

The 95% describes the method, not your one arm. **95% of all samples give an arm that covers p.** Your one arm either covers it or misses, and you cannot see which. The full story is in [90%, 95%, 99%](#/math3042-q9/ci-confidence-level).

:::warn The interval is about everyone, not about the sample
"95% of the sample use an iPhone" is wrong twice: 58.5% of the sample do, and you know that exactly. The interval guesses the share in the whole population.
:::

## Help desk tickets, faulty parts, headphones, oat milk, failed downloads

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- $\hat{p} - E < p < \hat{p} + E$, $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$

**Not on the sheet, so know it:**

- $\hat{p} = X/n$ and $\hat{q} = 1 - \hat{p}$.
- 95% uses $z_{0.025} = 1.96$.
- The six lines: conditions, level, critical value, E, limits, one-sentence conclusion.
- If a condition fails, the procedure is invalid: no interval.
:::

```quiz
[
  {"q": "A help desk samples 240 tickets at random; 66 were closed the same day. Find the margin of error E for a 95% confidence interval for p, the share of all tickets closed the same day. (4 decimals)", "type": "numeric", "answer": 0.0565, "tolerance": 0.0006, "explain": "$n = 240$ tickets, $X = 66$ closed the same day, so $\\hat{p} = 66/240 = 0.275$ and $\\hat{q} = 0.725$. **Line 1:** $n\\hat{p} = 66 \\ge 5$ and $n\\hat{q} = 240 - 66 = 174 \\ge 5$. **Line 2:** $1 - \\alpha = 0.95$. **Line 3:** $z_{0.025} = 1.96$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.275}_{\\text{p-hat}} \\times \\underbrace{0.725}_{\\text{q-hat}}}{\\underbrace{240}_{\\text{tickets}}} = 0.00083073$$ $$E = \\underbrace{1.96}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.00083073}}_{\\text{standard error, 0.028822}} = \\mathbf{0.0565}$$ **Line 5:** $0.275 \\pm 0.0565$ gives $(0.2185, 0.3315)$. **Line 6:** We are 95% confident that between 21.85% and 33.15% of all the desk's tickets are closed the same day."},
  {"q": "A factory line inspects 500 parts at random and finds 35 faulty. Find the lower limit of a 95% confidence interval for p, the share of all parts that are faulty. (4 decimals)", "type": "numeric", "answer": 0.0476, "tolerance": 0.0006, "explain": "$n = 500$ parts, $X = 35$ faulty, so $\\hat{p} = 35/500 = 0.07$ and $\\hat{q} = 0.93$. **Line 1:** $n\\hat{p} = 35 \\ge 5$ and $n\\hat{q} = 465 \\ge 5$. **Line 2:** $1 - \\alpha = 0.95$. **Line 3:** $z_{0.025} = 1.96$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.07}_{\\text{p-hat}} \\times \\underbrace{0.93}_{\\text{q-hat}}}{\\underbrace{500}_{\\text{parts}}} = 0.0001302$$ $$E = \\underbrace{1.96}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.0001302}}_{\\text{standard error, 0.011411}} = 0.0224$$ **Line 5:** $$\\hat{p} - E = \\underbrace{0.07}_{\\text{p-hat}} - \\underbrace{0.0224}_{E} = \\mathbf{0.0476}$$ and the upper limit is 0.0924. **Line 6:** We are 95% confident that between 4.76% and 9.24% of all parts from the line are faulty."},
  {"q": "On a SkyTrain platform, 208 of 320 randomly chosen riders wear headphones. Find the upper limit of a 95% confidence interval for p, the share of all riders who wear headphones. (4 decimals)", "type": "numeric", "answer": 0.7023, "tolerance": 0.0006, "explain": "$n = 320$ riders, $X = 208$ with headphones, so $\\hat{p} = 208/320 = 0.65$ and $\\hat{q} = 0.35$. **Line 1:** $n\\hat{p} = 208 \\ge 5$ and $n\\hat{q} = 112 \\ge 5$. **Line 2:** $1 - \\alpha = 0.95$. **Line 3:** $z_{0.025} = 1.96$. **Line 4:** $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.65}_{\\text{p-hat}} \\times \\underbrace{0.35}_{\\text{q-hat}}}{\\underbrace{320}_{\\text{riders}}} = 0.00071094$$ $$E = \\underbrace{1.96}_{\\text{critical value}} \\times \\underbrace{\\sqrt{0.00071094}}_{\\text{standard error, 0.026663}} = 0.0523$$ **Line 5:** $$\\hat{p} + E = \\underbrace{0.65}_{\\text{p-hat}} + \\underbrace{0.0523}_{E} = \\mathbf{0.7023}$$ and the lower limit is 0.5977. **Line 6:** We are 95% confident that between 59.77% and 70.23% of all riders on the platform wear headphones."},
  {"q": "In the headphones survey (208 of 320 riders), what number does line 1 compare with 5 for $n\\hat{q}$?", "type": "numeric", "answer": 112, "tolerance": 0.4, "explain": "$n\\hat{q}$ is the count of failures, $n - X$: $$n\\hat{q} = \\underbrace{320}_{\\text{riders}} - \\underbrace{208}_{\\text{with headphones}} = \\mathbf{112} \\ge 5$$ The other condition is $n\\hat{p} = X = 208 \\ge 5$. Both pass."},
  {"q": "A coffee shop samples 150 orders at random; 57 use oat milk. The 95% interval works out to $(0.3023, 0.4577)$. Which conclusion sentence is right?", "options": ["We are 95% confident that between 30.23% and 45.77% of all the shop's orders use oat milk.", "95% of the 150 sampled orders use oat milk at a rate between 30.23% and 45.77%.", "Between 30.23% and 45.77% of the 150 sampled orders use oat milk, with 95% confidence.", "We are 95% confident that 38% of all the shop's orders use oat milk."], "answer": 0, "explain": "$n = 150$ orders, $X = 57$, so $\\hat{p} = 0.38$; $E = 1.96\\sqrt{0.38 \\times 0.62/150} = 0.0777$, limits 0.3023 and 0.4577. The sentence names the level, the whole population (all the shop's orders), the thing counted, and both limits. The sample's share is known exactly (38%), so a sentence about the 150 sampled orders says nothing new; a single number drops the interval."},
  {"q": "A download server logs 120 random downloads; 3 of them failed. A student is asked for a 95% confidence interval for the share of all downloads that fail. What is the right answer?", "options": ["The procedure is invalid: $n\\hat{p} = 3$ is below 5.", "The interval is $0.025 \\pm 1.96\\sqrt{0.025 \\times 0.975/120}$.", "Use 99% instead, because the share is small.", "The interval is valid because $n\\hat{q} = 117 \\ge 5$."], "answer": 0, "explain": "$n = 120$ downloads, $X = 3$ failed. Line 1: $n\\hat{p} = X = 3$, which is less than 5. **Both conditions must hold; if either fails, the rest of the procedure is invalid.** One passing condition is not enough, and changing the level does not repair the shape of the pile."},
  {"q": "True or false: if the help desk had sampled 960 tickets instead of 240, with the same share closed the same day, the margin of error would be half as large.", "type": "tf", "answer": true, "explain": "$n$ sits under the square root. Four times the tickets makes $\\hat{p}\\hat{q}/n$ four times smaller and its root two times smaller, so E halves: $$E = \\underbrace{1.96}_{\\text{critical value}} \\times \\sqrt{\\dfrac{0.275 \\times 0.725}{960}} = 0.0282$$ against 0.0565 before."}
]
```

## Remember

- **The interval is the margin of error measured from your own dot: $\hat{p} \pm E$.**
- **E uses p-hat and q-hat: $E = z_{\alpha/2}\sqrt{\hat{p}\hat{q}/n}$.** Take the root of the whole fraction.
- **Six lines: conditions, level, critical value, E, limits, conclusion.**
- **Check $X \ge 5$ and $n - X \ge 5$ first. If either fails, the procedure is invalid.**
- The sentence is about the whole population, with the level and both limits.
