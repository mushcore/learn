---
title: "Two-step questions: a threshold between two levels, and a normal answer used as a binomial p"
minutes: 10
---
<!-- facts: none; no bank entry gives a normal probability chained into a second step -->
The past quizzes chain their parts: an answer from one part becomes the input of the next. A normal probability is often that first answer.

## One answer feeds the next step

**In a two-step question, step 1 finds a normal probability and step 2 uses it as an input.** For example, step 1 finds the chance that one tablet is underweight, and step 2 finds the chance that a box of ten holds at least one underweight tablet.

There are three shapes: a threshold halfway between two levels, a normal answer used as the p of a binomial, and a share outside a tolerance band.

## A misread bit: the threshold sits halfway between the two levels

A digital line sends bit 0 as 2 volts and bit 1 as 3 volts. Noise on the line adds a small random amount, up or down, to every voltage. The receiver reads whichever level is closer, so anything at 2.5 V or more reads as a 1. **The threshold sits halfway between the two levels.** Just like a line judge calling a ball in or out by which side of the line it lands on.

Fifteen bits sent in a row, 0 0 1 1 1 1 0 1 1 1 0 0 0 1 1. The clean signal steps between 2 V and 3 V; the noise makes the received trace jitter around each level.

```diagram
{"type": "curve", "title": "Bits sent as 2 V and 3 V, with noise on top", "x": [0, 15], "y": [1.4, 3.6], "xlabel": "time", "ylabel": "voltage", "height": 110, "curves": [{"dist": "steps", "start": 0, "values": [2, 2, 3, 3, 3, 3, 2, 3, 3, 3, 2, 2, 2, 3, 3], "noise": 0.2, "tone": "red", "cells": ["0", "0", "1", "1", "1", "1", "0", "1", "1", "1", "0", "0", "0", "1", "1"]}], "yticks": [{"y": 2, "label": "2 V"}, {"y": 3, "label": "3 V"}]}
```

A sent 0 is misread when the noise pushes 2 V up past 2.5 V. **The misread chance is the chance that the noise is larger than half the gap between the levels.** For example, a gap of 1 V means noise above 0.5 V flips the bit.

## Two noise bells and the threshold between them

```widget
bit-error
{ "v0": 2, "v1": 3, "sigma": 0.22, "title": "Bit 0 at 2 V, bit 1 at 3 V, noise σ = 0.22 V" }
```

Two identical bells sit side by side, one centred on 2 V and one on 3 V. The threshold is a vertical line at 2.5 V. The thin tail of the left bell past 2.5 is shaded: a sent 0 read as a 1. The matching tail of the right bell below 2.5 is a sent 1 read as a 0. Widen σ and both tails grow.

## The notes' bit error, in the instructor's layout

The noise X is normal, which the notes call *Gaussian noise*.

- $\mu = 0$, the mean noise in volts: on average the noise adds nothing.
- $\sigma = 0.22$, the standard deviation of the noise in volts.
- $x = 0.5$, the noise that just reaches the threshold.

The noise bell is centred on 0. One standard deviation, 0.22 V, either side of 0 marks where the bell bends.

```diagram
{"type": "curve", "title": "Noise X ~ N(0, 0.22²): σ = 0.22 V either side of 0", "x": [-0.8, 0.8], "xlabel": "X = channel noise (V)", "curves": [{"dist": "normal", "mu": 0, "sigma": 0.22}], "points": [{"x": -0.22, "tone": "red"}, {"x": 0.22, "tone": "red"}], "lines": [{"x": -0.22, "tone": "red"}, {"x": 0.22, "tone": "red"}], "ticks": [-0.22, 0, 0.22]}
```

Half the gap:

$$x = \underbrace{2.5}_{\text{threshold}} - \underbrace{2}_{\text{level of bit 0}} = \mathbf{0.5 \text{ V}}$$

Standardize the noise of 0.5 V:

$$Z = \dfrac{\underbrace{0.5}_{\text{noise at threshold}} - \underbrace{0}_{\text{mean noise}}}{\underbrace{0.22}_{\text{standard deviation}}} = 2.2727 \to \mathbf{2.27}$$

A misread is noise past 0.5 V, the thin right tail of the noise bell, more than two standard deviations out. Its area is 0.0116.

```diagram
{"type": "curve", "title": "P(X > 0.5) is the right tail, 0.0116", "x": [-0.8, 0.8], "xlabel": "X = channel noise (V)", "curves": [{"dist": "normal", "mu": 0, "sigma": 0.22}], "shade": [{"to": 0.5, "label": "table: 0.9884", "tone": "blue"}, {"from": 0.5, "label": "0.0116", "tone": "hl"}], "ticks": [0, 0.22, 0.5]}
```

It is a right tail, so 1 minus the cell at 2.27:

$$P(X > 0.5) = P(Z > 2.27) = 1 - \underbrace{0.9884}_{\text{area left of 2.27}} = \mathbf{0.0116}$$

About 12 bits in every 1000 sent zeros arrive as ones. The bells have the same shape, so a sent 1 read as a 0 has the same chance.

```r
1 - pnorm(2.5, 2, 0.22)
pnorm(2.5, 3, 0.22)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(2.5, 2, 0.22)` | Slots `pnorm(q, mean, sd)`: q = 2.5, mean = 2, sd = 0.22. The area to the left of 2.5 V for a sent 0. |
| `1 - pnorm(…)` | The whole area minus the area to the left: the right tail, received at 2.5 V or more. |
| `pnorm(2.5, 3, 0.22)` | The same bell centred on 3 V: the area below 2.5 V for a sent 1. |

**Left to right**

- `1 - pnorm(2.5, 2, 0.22)`: "One minus (`1 -`) the normal area to the left (`pnorm`) of 2.5 (`q`) for mean 2 (`mean`) and standard deviation 0.22 (`sd`)."
- `pnorm(2.5, 3, 0.22)`: "The normal area to the left (`pnorm`) of 2.5 (`q`) for mean 3 (`mean`) and standard deviation 0.22 (`sd`)."

**Right to left**, the order R runs it

- `1 - pnorm(2.5, 2, 0.22)`: "Take 2.5, 2 and 0.22, find the area to the left (`pnorm`), then subtract it from 1 (`1 -`)."
- `pnorm(2.5, 3, 0.22)`: "Take 2.5, 3 and 0.22, then return the area to the left (`pnorm`)."
:::

This R works in volts received, not in noise, and both lines give 0.0115. R uses the exact Z, 2.2727, so it differs from the table's 0.0116 in the fourth decimal; the instructor boxed the table answer. The long version is [Normal applications](#/math3042-u5/normal-applications).

## A normal answer becomes the p of a binomial

The active ingredient in a medication tablet has a mass that is normal. The label promises 50 mg. A patient receives 10 tablets. What is the chance that at least one holds less than 50 mg? This is from the unit's practice problems.

- $\mu = 51$, the mean mass in mg.
- $\sigma = 2.5$, the standard deviation in mg.
- $x = 50$, the rated mass on the label.
- $n = 10$, the tablets the patient receives.

```widget
normal-prob
{ "mu": 51, "sigma": 2.5, "lo": null, "hi": 50, "title": "One tablet below the rated 50 mg" }
```

The bell is centred on 51, and the area left of 50 is shaded: a little over a third of the bell.

Step 1 is the normal question for one tablet.

$$Z = \dfrac{\underbrace{50}_{\text{rated mass}} - \underbrace{51}_{\text{mean mass}}}{\underbrace{2.5}_{\text{standard deviation}}} = \mathbf{-0.40}$$

$$P(X < 50) = P(Z < \underbrace{-0.40}_{\text{Z from above}}) = \underbrace{0.3446}_{\text{the cell at }-0.40} = \mathbf{0.3446}$$

Step 2 counts tablets. **The normal answer becomes the p of a binomial: the chance that one trial is a "success".** Each tablet is a separate trial with the same chance, so the count Y of light tablets among 10 is binomial. Just like flipping a coin that lands heads 34.46 % of the time, ten times.

```diagram
{"type": "flow", "title": "Normal, then binomial", "nodes": [{"id": "a", "label": "Normal area", "sub": "P(X < 50) = 0.3446"}, {"id": "p", "label": "p for one trial", "sub": "p = 0.3446, q = 0.6554"}, {"id": "b", "label": "Binomial(n, p)", "sub": "n = 10 tablets"}, {"id": "c", "label": "The count question", "sub": "at least one: 1 − q^10"}], "edges": [{"from": "a", "to": "p"}, {"from": "p", "to": "b"}, {"from": "b", "to": "c"}], "hi": ["p"], "caption": "Carry p to 4 decimals into the binomial, as the instructor's solutions do."}
```

The binomial formula is $P(x) = C(n, x)\, p^x q^{n-x}$, with $q = 1 - p$; it is taught in [the binomial on paper](#/math3042-q7/binomial-on-paper).

- $p = 0.3446$, the chance one tablet is below 50 mg, from step 1.
- $q = 0.6554$, the chance one tablet is at 50 mg or more: the whole 1 minus p.

At least one is everything except none. None is $P(0) = q^{10}$, because $C(10, 0) = 1$ and $p^0 = 1$.

The two steps side by side. On the left, the normal area below 50 mg gives p = 0.3446. On the right, that p builds the binomial bars for 0 to 10 light tablets; "at least one" is every bar except the one at 0, which is only 0.0146 tall.

```diagram
{"type": "curve", "title": "Step 1 gives p; step 2 uses it", "panels": [{"title": "Step 1: P(X < 50) = 0.3446", "x": [42, 60], "xlabel": "X = mass (mg)", "curves": [{"dist": "normal", "mu": 51, "sigma": 2.5}], "shade": [{"to": 50, "label": "0.3446", "tone": "hl"}], "ticks": [50, 55]}, {"title": "Step 2: Y ~ Bin(10, 0.3446)", "x": [-0.7, 10.7], "xlabel": "Y = light tablets", "curves": [{"dist": "bars", "start": 0, "values": [0.0146, 0.077, 0.182, 0.255, 0.235, 0.148, 0.065, 0.019, 0.004, 0.0005, 0.00002], "hi": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}], "ticks": [0, 2, 4, 6, 8, 10], "notes": [{"text": ["left out: the bar at 0,", "P(0) = 0.0146"], "at": [8.2, 0.75], "tone": "ink"}]}]}
```

$$P(Y \ge 1) = 1 - P(0) = 1 - \underbrace{0.6554^{10}}_{\text{all 10 at 50 mg or more}} = 1 - 0.014624 = \mathbf{0.9854}$$

The mean number of light tablets among 10 is $\mu = np$ from the formula sheet:

$$\mu = \underbrace{10}_{\text{tablets}} \times \underbrace{0.3446}_{\text{chance one is light}} = \mathbf{3.45 \text{ tablets}}$$

:::warn Step 2 uses p, not Z
0.3446 is the p of the binomial. Feeding −0.40 or 50 into $C(n, x)\,p^x q^{n-x}$ gives nonsense; only a probability between 0 and 1 belongs there.
:::

## Outside a tolerance band

A part is good when it falls inside a band, written as a target "± a tolerance". **The share outside the band is 1 minus the share inside it.** For example, 0.300 ± 0.002 cm means anything from 0.298 cm to 0.302 cm passes.

The same tablets are acceptable from 47 mg to 55 mg. What share lies outside?

- $\mu = 51$ and $\sigma = 2.5$, the mean and standard deviation in mg, as above.
- 47 and 55, the limits of the band in mg.

The band from 47 to 55 sits evenly around the mean of 51. The two shaded tails outside it are the share asked for; together they hold 0.1096.

```diagram
{"type": "curve", "title": "Outside 47 to 55: two tails, 0.0548 each", "x": [42, 60], "xlabel": "X = mass (mg)", "curves": [{"dist": "normal", "mu": 51, "sigma": 2.5}], "shade": [{"to": 47, "label": "0.0548", "tone": "hl"}, {"from": 47, "to": 55, "label": "inside: 0.8904", "tone": "blue"}, {"from": 55, "label": "0.0548", "tone": "hl"}], "ticks": [47, 51, 55]}
```

$$Z_{\text{low}} = \dfrac{\underbrace{47}_{\text{lower limit}} - \underbrace{51}_{\text{mean mass}}}{\underbrace{2.5}_{\text{standard deviation}}} = \mathbf{-1.60} \qquad Z_{\text{high}} = \dfrac{\underbrace{55}_{\text{upper limit}} - \underbrace{51}_{\text{mean mass}}}{\underbrace{2.5}_{\text{standard deviation}}} = \mathbf{1.60}$$

$$P(\text{outside}) = 1 - (\underbrace{0.9452}_{\text{left of 1.60}} - \underbrace{0.0548}_{\text{left of }-1.60}) = 1 - 0.8904 = \mathbf{0.1096}$$

A band need not be centred on the mean. Metal washers must have an inside diameter of 0.300 ± 0.002 cm. A supplier's washers are normal; what share meets the specification? This is also from the unit's practice problems.

- $\mu = 0.301$, the mean diameter in cm: 0.001 above the target.
- $\sigma = 0.001$, the standard deviation in cm.
- 0.298 and 0.302, the limits of the band in cm.

```widget
normal-prob
{ "mu": 0.301, "sigma": 0.001, "lo": 0.298, "hi": 0.302, "title": "Washers inside 0.298 to 0.302 cm" }
```

The bell is centred on 0.301, right of the band's middle. The shaded band runs from three standard deviations below the mean to one above, so more is cut off on the right.

$$Z_{\text{low}} = \dfrac{\underbrace{0.298}_{\text{lower limit}} - \underbrace{0.301}_{\text{mean}}}{\underbrace{0.001}_{\text{standard deviation}}} = \mathbf{-3.00} \qquad Z_{\text{high}} = \dfrac{\underbrace{0.302}_{\text{upper limit}} - \underbrace{0.301}_{\text{mean}}}{\underbrace{0.001}_{\text{standard deviation}}} = \mathbf{1.00}$$

$$P(0.298 \le X \le 0.302) = \underbrace{0.8413}_{\text{left of 1.00}} - \underbrace{0.0013}_{\text{left of }-3.00} = \mathbf{0.8400}$$

84 % of the washers pass. Moving the mean back to 0.300 would pass more.

## A sensor, espresso shots, an airport shuttle and bolts

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$
- Binomial: $P(x) = C(n,x)\,p^x q^{n-x}$, $\mu = np$
- Complement: $P(\bar A) = 1 - P(A)$

**Not on the sheet, so know it:**

- The Z table gives the area to the left of z; a right tail is 1 minus the cell; between is a subtraction.
- Between two levels, the threshold is halfway; the misread chance is the noise passing half the gap.
- A normal answer becomes the binomial p, carried to 4 decimals; $q = 1 - p$.
- At least one is $1 - q^n$; none is $q^n$.
- Outside a band is 1 minus inside.
:::

```quiz
[
  {"q": "A sensor sends 1 V for \"off\" and 4 V for \"on\". Noise on the wire is normal with mean 0 V and standard deviation 0.6 V, and the receiver reads whichever level is closer. What is the chance that a sent \"off\" is read as \"on\"? (4 decimals)", "type": "numeric", "answer": 0.0062, "tolerance": 0.0001, "explain": "Let X = the noise in volts, normal with $\\mu = 0$ and $\\sigma = 0.6$. The threshold is halfway between the levels, 2.5 V, so a sent 1 V is misread when the noise passes half the gap: $$x = \\underbrace{2.5}_{\\text{threshold}} - \\underbrace{1}_{\\text{level of off}} = 1.5$$ $$Z = \\dfrac{\\underbrace{1.5}_{\\text{noise at threshold}} - \\underbrace{0}_{\\text{mean noise}}}{\\underbrace{0.6}_{\\text{standard deviation}}} = 2.50$$ $$P(X > 1.5) = 1 - \\underbrace{0.9938}_{\\text{area left of 2.50}} = \\mathbf{0.0062}$$"},
  {"q": "A coffee shop's espresso shots have a volume that is normal with mean 30 mL and standard deviation 2 mL. A shot under 27 mL counts as short. Of 8 shots pulled in a row, what is the chance that exactly 2 are short? Carry p to 4 decimals. (4 decimals)", "type": "numeric", "answer": 0.0825, "tolerance": 0.0005, "explain": "Step 1, one shot. Let X = the volume, normal with $\\mu = 30$ mL and $\\sigma = 2$ mL. $$Z = \\dfrac{\\underbrace{27}_{\\text{short limit}} - \\underbrace{30}_{\\text{mean}}}{\\underbrace{2}_{\\text{standard deviation}}} = -1.50 \\qquad P(X < 27) = 0.0668$$ Step 2, the count. Y = short shots among 8 is binomial with $n = 8$ shots, $p = 0.0668$ the chance one is short, $q = 0.9332$ the chance it is not. $$P(2) = \\underbrace{28}_{C(8, 2)} \\times \\underbrace{0.0668^2}_{\\text{2 short}} \\times \\underbrace{0.9332^6}_{\\text{6 not short}} = 28 \\times 0.004462 \\times 0.660463 = \\mathbf{0.0825}$$"},
  {"q": "A YVR airport shuttle ride takes a time that is normal with mean 24 minutes and standard deviation 3 minutes. A ride over 30 minutes is late. Over 5 separate rides, what is the chance that none is late? Carry p to 4 decimals. (4 decimals)", "type": "numeric", "answer": 0.8911, "tolerance": 0.0005, "explain": "Step 1, one ride. Let X = the ride time, normal with $\\mu = 24$ and $\\sigma = 3$. $$Z = \\dfrac{\\underbrace{30}_{\\text{late limit}} - \\underbrace{24}_{\\text{mean}}}{\\underbrace{3}_{\\text{standard deviation}}} = 2.00 \\qquad P(X > 30) = 1 - \\underbrace{0.9772}_{\\text{left of 2.00}} = 0.0228$$ Step 2: $n = 5$ rides, $p = 0.0228$ the chance one is late, $q = 0.9772$ the chance it is on time. None late is all 5 on time: $$P(0) = \\underbrace{0.9772^5}_{\\text{5 on-time rides}} = \\mathbf{0.8911}$$ R's unrounded p gives 0.8913; both are accepted."},
  {"q": "The same shuttle: over 50 rides, what is the mean number of late rides? (2 decimals)", "type": "numeric", "answer": 1.14, "tolerance": 0.01, "explain": "The count of late rides among 50 is binomial with $n = 50$ rides and $p = 0.0228$, the chance one ride is late from the last question. $$\\mu = \\underbrace{50}_{\\text{rides}} \\times \\underbrace{0.0228}_{\\text{chance one is late}} = \\mathbf{1.14}$$"},
  {"q": "A factory line makes bolts whose diameter must be 10.00 ± 0.05 mm. The diameters are normal with mean 10.01 mm and standard deviation 0.02 mm. What share of bolts falls outside the specification? (4 decimals)", "type": "numeric", "answer": 0.0241, "tolerance": 0.0001, "explain": "Let X = a bolt's diameter, normal with $\\mu = 10.01$ and $\\sigma = 0.02$. The band runs from 9.95 to 10.05 mm. $$Z_{\\text{low}} = \\dfrac{\\underbrace{9.95}_{\\text{lower limit}} - \\underbrace{10.01}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = -3.00 \\qquad Z_{\\text{high}} = \\dfrac{\\underbrace{10.05}_{\\text{upper limit}} - \\underbrace{10.01}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = 2.00$$ $$P(\\text{outside}) = 1 - (\\underbrace{0.9772}_{\\text{left of 2.00}} - \\underbrace{0.0013}_{\\text{left of }-3.00}) = 1 - 0.9759 = \\mathbf{0.0241}$$"}
]
```

## Remember

- Two levels: the threshold is halfway, and a misread is noise past half the gap.
- **A normal answer, carried to 4 decimals, becomes the p of a binomial.**
- At least one is $1 - q^n$; none is $q^n$; the mean count is $np$.
- **Outside a band is 1 minus inside**; a band off the mean gives two different Z sizes.
- Step 2 takes the probability, never the Z.
- In R the whole tablet chain is `1 - (1 - pnorm(50, 51, 2.5))^10`.

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(50, 51, 2.5)` | Slots `pnorm(q, mean, sd)`: the chance one tablet is below 50 mg, the p. |
| `1 - pnorm(…)` | q, the chance one tablet is at 50 mg or more. |
| `(…)^10` | `^` raises to a power: all 10 tablets at 50 mg or more. |
| `1 - (…)^10` | The complement: at least one tablet below 50 mg. |

**Left to right**

- `1 - (1 - pnorm(50, 51, 2.5))^10`: "One minus (`1 -`) the tenth power (`^10`) of one minus (`1 -`) the normal area to the left (`pnorm`) of 50 for mean 51 and standard deviation 2.5."

**Right to left**, the order R runs it

- `1 - (1 - pnorm(50, 51, 2.5))^10`: "Find the area left of 50 (`pnorm`), subtract it from 1 (`1 -`), raise that to the 10th power (`^10`), then subtract the result from 1 (`1 -`)."
:::
