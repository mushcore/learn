---
title: "Exponential backwards and memoryless: solve for the time with ln; time already waited does not count"
minutes: 12
---
<!-- facts: none; no bank entry gives a measured waiting time -->
Some questions give the area and ask for the wait: the time that 95 % of waits stay under. Others say part of the wait has already passed. The ln key answers the first, and one subtraction answers the second.

## A percentile is the wait with a given area to its left

**The p-th percentile of X is the value with area p to its left.** For example, the 95th percentile of the web server's wait is the wait that 95 % of waits stay under, and only 5 % run past.

This is [the last lesson's](#/math3042-q8/exponential-on-paper) move run backwards. There, x went in and an area came out. Here the area goes in and x comes out.

## The web server's 95th percentile, drawn

The curve is the same falling curve: highest at 0, a long tail to the right. The shaded area from 0 to the percentile is 0.95. The cut-off sits far out on the tail, because the last 5 % is spread thin over a long stretch.

```widget
exp-wait
{ "beta": 2.5, "unit": "s", "p": 0.95, "mode": "percentile", "title": "Web server, β = 2.5 s: the wait with area 0.95 to its left" }
```

On paper, sketch the curve, shade from 0 to an unknown x, and write "area = 0.95" on the shading, as the notes do.

```diagram
{"type": "curve", "title": "The 95th percentile x has area 0.95 to its left", "x": [-0.7, 12], "xlabel": "X = wait time (s)", "curves": [{"dist": "exp", "beta": 2.5, "tone": "red"}], "shade": [{"to": 7.49, "label": "area = 0.95", "tone": "hl"}, {"from": 7.49, "label": "0.05", "tone": "dim", "labelAt": [10, 0.3]}], "lines": [{"x": 7.49, "solid": true, "tone": "hl"}], "ticks": [0, {"x": 7.49, "label": "x = ?"}]}
```

The area is known and the cut-off is not. The thin 0.05 past x stretches far to the right, so x lands well past the mean of 2.5.

## The notes' four lines for the web server

The web server's wait between requests is exponential with a mean of 2.5 seconds. Find the 95th percentile. This is the notes' example.

- $\beta = 2.5$, the mean wait in seconds.
- $p = 0.95$, the area to the left of the wait asked for.

Step 1: set the area to the left, F(x), equal to 0.95.

$$1 - e^{-x/2.5} = \underbrace{0.95}_{\text{area to the left}}$$

Step 2: move the e term to one side and the numbers to the other. $1 - 0.95$ is the area to the right.

$$\underbrace{1 - 0.95}_{\text{area to the right, 0.05}} = e^{-x/2.5}$$

Step 3: press ln on both sides. **ln is the key that undoes $e^x$**, so ln of $e^{-x/2.5}$ is just $-x/2.5$.

$$\ln(\underbrace{1 - 0.95}_{\text{0.05}}) = -x/2.5$$

Step 4: multiply both sides by −2.5 to leave x alone.

$$x = -\underbrace{2.5}_{\text{mean wait}} \times \underbrace{\ln(1 - 0.95)}_{\text{−2.995732}} = \mathbf{7.49 \text{ s}}$$

## The shortcut: x = −β ln(1 − p)

The four lines always end the same way. **The p-th percentile of an exponential is $-\beta \ln(1 - p)$.**

$$x_p = -\underbrace{\beta}_{\text{mean wait}} \times \ln(1 - \underbrace{p}_{\text{area to the left}})$$

- $\beta$, the mean wait, in the unit the answer needs.
- $p$, the area to the left as a decimal: 0.95 for the 95th percentile.
- $1 - p$, the area to the right. Its ln is negative, so the minus sign makes x positive.

The bank teller serves 30 customers an hour, so the mean service time is 2 minutes. Find the 75th percentile. This is the notes' example.

- $\beta = 2$, the mean service time in minutes, from 60/30.
- $p = 0.75$, the area to the left.

$$x = -\underbrace{2}_{\text{mean service time}} \times \ln(1 - \underbrace{0.75}_{\text{area to the left}}) = -2 \times (-1.386294) = \mathbf{2.77 \text{ min}}$$

For example, three customers in four are served within 2.77 minutes.

```diagram
{"type": "curve", "title": "The teller's 75th percentile: area 0.75 left of 2.77 min", "x": [-0.5, 9], "xlabel": "X = time to serve (min)", "curves": [{"dist": "exp", "beta": 2, "tone": "red"}], "shade": [{"to": 2.77, "label": "0.75", "tone": "hl"}, {"from": 2.77, "label": "0.25", "tone": "dim", "labelAt": [5.5, 0.3]}], "ticks": [0, 2, 2.77]}
```

The shaded piece from 0 to 2.77 holds three quarters of the area. The tail past 2.77 holds the last quarter.

## The median is β times ln 2

**The median is the 50th percentile**, so p = 0.5. The minus sign and ln(0.5) together give ln 2 = 0.693147.

$$\text{median} = -\beta \times \ln(1 - \underbrace{0.5}_{\text{half the area}}) = \beta \ln 2 = 0.6931\,\beta$$

A switch has an exponential life with a mean of 1000 hours. Find its median life. This is from the unit's practice problems.

- $\beta = 1000$, the mean life in hours.

$$\text{median} = \underbrace{1000}_{\text{mean life in hours}} \times \underbrace{\ln 2}_{\text{0.693147}} = \mathbf{693.1 \text{ h}}$$

Half the switches fail before 693.1 hours, though the mean life is 1000 hours.

## A bus with a 10-minute mean wait: quartiles

A person waits for a bus, and the wait is exponential with a mean of 10 minutes. This is Lab 8's second bus scenario, which asks for the median, the quartiles and the interquartile range.

- $\beta = 10$, the mean wait in minutes.
- 0.25, 0.50 and 0.75, the areas to the left of $Q_1$, the median and $Q_3$.

$$\text{median} = \underbrace{10}_{\text{mean wait}} \times \underbrace{\ln 2}_{\text{0.693147}} = \mathbf{6.931 \text{ min}}$$

$$Q_1 = -\underbrace{10}_{\text{mean wait}} \times \ln(1 - \underbrace{0.25}_{\text{area left of } Q_1}) = -10 \times (-0.287682) = \mathbf{2.8768}$$

$$Q_3 = -\underbrace{10}_{\text{mean wait}} \times \ln(1 - \underbrace{0.75}_{\text{area left of } Q_3}) = -10 \times (-1.386294) = \mathbf{13.8629}$$

$$IQR = \underbrace{13.8629}_{Q_3} - \underbrace{2.8768}_{Q_1} = \mathbf{10.9861}$$

```diagram
{"type": "grid", "title": "Bus wait, β = 10 minutes: the cut-offs in order", "nodes": [{"id": "h0", "label": "", "row": 0, "col": 0}, {"id": "h1", "label": "Q1", "row": 0, "col": 1}, {"id": "h2", "label": "Median", "row": 0, "col": 2}, {"id": "h3", "label": "Mean β", "row": 0, "col": 3}, {"id": "h4", "label": "Q3", "row": 0, "col": 4}, {"id": "m0", "label": "Minutes", "row": 1, "col": 0}, {"id": "m1", "label": "2.88", "row": 1, "col": 1}, {"id": "m2", "label": "6.93", "row": 1, "col": 2}, {"id": "m3", "label": "10", "row": 1, "col": 3}, {"id": "m4", "label": "13.86", "row": 1, "col": 4}, {"id": "a0", "label": "Area to the left", "row": 2, "col": 0}, {"id": "a1", "label": "0.25", "row": 2, "col": 1}, {"id": "a2", "label": "0.50", "row": 2, "col": 2}, {"id": "a3", "label": "more than 0.50", "row": 2, "col": 3}, {"id": "a4", "label": "0.75", "row": 2, "col": 4}], "hi": ["m2", "m3"], "caption": "The median comes before the mean: more than half of the waits are shorter than the mean."}
```

The four pieces below each hold a quarter of the area. They get wider to the right, because the curve gets lower.

```diagram
{"type": "curve", "title": "Bus, β = 10 min: Q1, median and Q3 cut the area into quarters", "x": [-2.7, 45], "xlabel": "X = wait (min)", "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"to": 2.8768, "label": "0.25", "tone": "hl", "labelAt": [1.4, 0.15]}, {"from": 2.8768, "to": 6.9315, "label": "0.25", "tone": "blue", "labelAt": [4.9, 0.15]}, {"from": 6.9315, "to": 13.8629, "label": "0.25", "tone": "hl", "labelAt": [10.4, 0.1]}, {"from": 13.8629, "label": "0.25", "tone": "blue", "labelAt": [26, 0.3]}], "lines": [{"x": 10, "full": true, "tone": "purple", "label": "mean 10"}], "ticks": [{"x": 2.8768, "label": "2.88"}, {"x": 6.9315, "label": "6.93"}, {"x": 13.8629, "label": "13.86"}]}
```

## The median sits below the mean

The median, 6.93 minutes, is below the mean, 10 minutes. **The long right tail pulls the mean up, and the median stays put.** Just like house prices on a street with one mansion: the mansion lifts the average, not the middle house.

Pearson's coefficient from the formula sheet measures this. For an exponential the mean is β and the standard deviation is β too.

$$Sk = \dfrac{3(\underbrace{10}_{\text{mean, } \beta} - \underbrace{6.931472}_{\text{median}})}{\underbrace{10}_{\text{standard deviation, } \beta}} = \mathbf{0.9206}$$

The lab's sentence: *Pearson's skewness is 0.9206, so X is skewed right significantly.*

## Memoryless: time already waited does not count

**For an exponential wait, the time already waited does not change the chance of the time still to come.** For example, at a stop where buses come at random, arriving just after a bus left or several minutes later gives the same wait from that moment. This is the lab's "technical point".

The instructor's sentence: *The system is memoryless, meaning that the amount of time you have already waited has no influence on how much additional time you will wait.*

## Cutting off the time already waited, drawn

Step through the widget. It shades the tail past s, cuts the curve at s, stretches what is left back to a total area of 1, and slides it back to 0. The stretched piece lands exactly on the original falling curve.

```widget
memoryless-play
{ "beta": 2, "s": 1, "t": 2, "unit": "min", "title": "Bank teller, β = 2 min: the wait left after 1 minute has the same curve as a fresh wait" }
```

## The teller who has already spent 1 minute

The teller has already spent 1 minute with a customer. What is the chance the whole service takes between 2.5 and 3.5 minutes? This is the notes' example.

- $\beta = 2$, the mean service time in minutes.
- $s = 1$, the minutes already spent.
- 2.5 and 3.5, the bounds on the total time, in minutes.

"Given" means a conditional probability, from Unit 3. **The chance of A given B is the chance of both, divided by the chance of B.** The sheet's line $P(A \cap B) = P(A) \cdot P(B \mid A)$ is the same rule, rearranged, with the names A and B swapped. For example, among BCIT students who drink coffee, the share who take it black is the black-coffee drinkers divided by all the coffee drinkers.

$$P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}$$

Here A is "2.5 to 3.5" and B is "at least 1". Every time from 2.5 to 3.5 is already past 1, so A lies inside B, and "A and B" is just A.

```diagram
{"type": "curve", "title": "Given X ≥ 1: the strip 2.5 to 3.5 out of everything past 1", "x": [-0.5, 9], "xlabel": "X = time to serve (min)", "curves": [{"dist": "exp", "beta": 2, "tone": "red"}], "shade": [{"from": 1, "tone": "blue"}, {"from": 2.5, "to": 3.5, "tone": "hl", "label": "A: 0.1127", "labelAt": [4.3, 0.55]}], "ticks": [0, 1, 2.5, 3.5], "notes": [{"text": "B, from 1 on: 0.6065", "at": [6.6, 0.4], "to": [5.5, 0.07], "tone": "blue"}]}
```

The blue area is everything from 1 minute on, the chance of B. The highlighted strip from 2.5 to 3.5 is A. The answer is the strip as a share of the blue area.

$$P(2.5 \le X \le 3.5 \mid X \ge 1) = \dfrac{\underbrace{P(2.5 \le X \le 3.5)}_{\text{A and B, which is A}}}{\underbrace{P(X \ge 1)}_{\text{B, already 1 min}}}$$

$$= \dfrac{(1 - \underbrace{e^{-3.5/2}}_{\text{past 3.5 min}}) - (1 - \underbrace{e^{-2.5/2}}_{\text{past 2.5 min}})}{1 - (1 - \underbrace{e^{-1/2}}_{\text{past 1 min}})}$$

$$= \dfrac{-e^{-3.5/2} + e^{-2.5/2}}{e^{-1/2}} = \dfrac{\underbrace{0.112731}_{\text{strip 2.5 to 3.5}}}{\underbrace{0.606531}_{\text{tail past 1}}} = \mathbf{0.1859}$$

The instructor writes "same as previous" beside it: 0.1859 is the chance that a fresh service takes 1.5 to 2.5 minutes.

## The shortcut: subtract the time already waited

**Given s already waited, subtract s from every bound and answer as if the wait started now.** Just like a stopwatch reset to zero at the moment the question is asked.

```diagram
{"type": "curve", "title": "Same answer: the share past 1, or a fresh strip", "panels": [{"title": "0.1127 out of 0.6065", "x": [-0.5, 9], "curves": [{"dist": "exp", "beta": 2, "tone": "red"}], "shade": [{"from": 1, "tone": "blue"}, {"from": 2.5, "to": 3.5, "tone": "hl"}], "ticks": [1, 2.5, 3.5], "notes": [{"text": "ratio 0.1859", "at": [6, 0.6], "tone": "hl"}]}, {"title": "Fresh wait, 1.5 to 2.5", "x": [-0.5, 9], "curves": [{"dist": "exp", "beta": 2, "tone": "red"}], "shade": [{"from": 1.5, "to": 2.5, "label": "0.1859", "tone": "hl", "labelAt": [4.5, 0.55]}], "ticks": [0, 1.5, 2.5]}]}
```

On the left, the strip is taken as a share of the blue tail. On the right, the clock starts again at 0 and the bounds move down by 1. Both give 0.1859.

```diagram
{"type": "flow", "title": "Already waited s: shift, then answer fresh", "nodes": [{"id": "g", "label": "Given", "sub": "1 min already spent"}, {"id": "s", "label": "Subtract s", "sub": "2.5 − 1 and 3.5 − 1"}, {"id": "n", "label": "New bounds", "sub": "1.5 to 2.5 min"}, {"id": "a", "label": "Fresh wait", "sub": "e^(−1.5/2) − e^(−2.5/2)"}], "edges": [{"from": "g", "to": "s"}, {"from": "s", "to": "n"}, {"from": "n", "to": "a"}], "hi": ["s"], "caption": "The teller: the same 0.1859 as a service that has just started."}
```

:::tip The time already waited drops out of the answer
Only the further time matters. A question that adds "given 1 minute has passed" changes the bounds, never β.
:::

## An office-hours queue, a grinder blade, a check-in counter, a printer and a help phone

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Exponential: $F(x) = 1 - e^{-x/\beta}$
- Exponential: $\mu = \beta$ and $\sigma^2 = \beta^2$
- Conditional: $P(A \cap B) = P(A) \cdot P(B \mid A)$

**Not on the sheet, so know it:**

- $x = -\beta\ln(1-p)$ for an exponential percentile.
- The median is $\beta \ln 2$.
- $P(X > x) = e^{-x/\beta}$; between a and b is $e^{-a/\beta} - e^{-b/\beta}$.
- Given s already waited: subtract s from every bound, then answer as a fresh wait.
- β = 1/rate, in the question's time unit.
:::

```quiz
[
  {"q": "The wait in a COMP course's office-hours queue is exponential with a mean of 4 minutes. Find the 90th percentile of the wait, in minutes. (2 decimals)", "type": "numeric", "answer": 9.21, "tolerance": 0.01, "unit": "min", "explain": "Let X = the minutes waited in the queue, exponential with $\\beta = 4$. The 90th percentile has area 0.90 to its left: $$x = -\\underbrace{4}_{\\text{mean wait}} \\times \\ln(1 - \\underbrace{0.90}_{\\text{area to the left}}) = -4 \\times (-2.302585) = \\mathbf{9.21 \\text{ min}}$$"},
  {"q": "A coffee grinder's blade lasts an exponential time with a mean of 3 years. Find the median life of the blade, in years. (2 decimals)", "type": "numeric", "answer": 2.08, "tolerance": 0.01, "unit": "years", "explain": "Let X = the blade's life in years, $\\beta = 3$. The median has area 0.5 to its left, and $-\\ln(0.5) = \\ln 2$: $$\\text{median} = \\underbrace{3}_{\\text{mean life in years}} \\times \\underbrace{\\ln 2}_{\\text{0.693147}} = \\mathbf{2.08 \\text{ years}}$$"},
  {"q": "Service at a YVR check-in counter takes an exponential time with a mean of 5 minutes. A passenger has already been at the counter for 2 minutes. P(the total service time is between 4 and 6 minutes)? (4 decimals)", "type": "numeric", "answer": 0.2210, "tolerance": 0.0001, "explain": "Let X = the total service time in minutes, $\\beta = 5$, with $s = 2$ minutes already spent. Memoryless: subtract 2 from both bounds, so the question is a fresh wait of 2 to 4 minutes: $$P(2 \\le X \\le 4) = \\underbrace{e^{-2/5}}_{\\text{past 2 min}} - \\underbrace{e^{-4/5}}_{\\text{past 4 min}} = 0.670320 - 0.449329 = \\mathbf{0.2210}$$ The ratio gives the same: $$\\dfrac{\\underbrace{e^{-4/5} - e^{-6/5}}_{\\text{strip 4 to 6}}}{\\underbrace{e^{-2/5}}_{\\text{tail past 2}}} = \\dfrac{0.148135}{0.670320} = 0.2210$$"},
  {"q": "Jobs at a library printer wait in the queue for an exponential time with a mean of 6 minutes. P(a job waits longer than the mean)? (4 decimals)", "type": "numeric", "answer": 0.3679, "tolerance": 0.0001, "explain": "Let X = the minutes a job waits, $\\beta = 6$. Longer than the mean is the tail past 6: $$P(X > 6) = \\underbrace{e^{-6/6}}_{\\text{6 min asked, mean 6}} = e^{-1} = \\mathbf{0.3679}$$ The β cancels, so every exponential wait runs past its mean with chance 0.3679. The mean sits above the median."},
  {"q": "A SkyTrain station's help phone gets an average of 12 calls an hour, and the time between calls is exponential. Find the 80th percentile of the time between calls, in minutes. (2 decimals)", "type": "numeric", "answer": 8.05, "tolerance": 0.01, "unit": "min", "explain": "Let X = the minutes between calls. First the mean wait in minutes: $$\\beta = \\dfrac{\\underbrace{60 \\text{ min}}_{\\text{one hour}}}{\\underbrace{12}_{\\text{calls in that hour}}} = 5 \\text{ min}$$ $$x = -\\underbrace{5}_{\\text{mean minutes between calls}} \\times \\ln(1 - \\underbrace{0.80}_{\\text{area to the left}}) = -5 \\times (-1.609438) = \\mathbf{8.05 \\text{ min}}$$"}
]
```

## Remember

- **The p-th percentile is $x = -\beta \ln(1 - p)$**; ln undoes $e^x$.
- The median is $\beta \ln 2 = 0.6931\,\beta$, below the mean β: the exponential is skewed right.
- **Given s already waited, subtract s from every bound, then answer fresh.**
- The long way is $P(A \mid B) = P(A \cap B)/P(B)$, and it gives the same number.
- A rate becomes β = 1/rate before any of this.
- In R, `qexp` does the percentile in one line: [the q functions](#/math3042-q8/r-q-functions). The long version is [Percentiles and the memoryless property](#/math3042-u5/exponential-memoryless).
