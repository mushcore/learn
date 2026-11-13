---
title: "A continuous variable: probability is an area, and one exact value has probability 0"
minutes: 10
---
<!-- facts: none; the notes' bus and body-weight examples carry the lesson, no bank entry is a continuous measurement -->
A wait, a voltage or a weight can land anywhere on a stretch of the number line, so there is no list of values to put probabilities on. Unit 5 measures probability as an area under a curve instead.

## A measurement can land anywhere, so probability is an area

A **continuous random variable** is a measurement that can take any value in a stretch of the number line. In the notes' words, *A continuous random variable X takes values on an interval of the real number line. The number of possible X values is therefore uncountably infinite.* For example, the weight of a random person can be 85 kg, 85.4 kg or 85.4172 kg: there is always another value in between.

**For a continuous variable, a probability is the area under a curve between two values, and the whole area under the curve is 1.** Just like paint on a wall: the curve says where the paint is thick, and the share of the paint between two marks is the chance of landing there.

### Bars for a count, a curve for a measurement

A count puts its probability on separate bars, one bar per value, so P(X = 5) is the height of one bar. A measurement such as a height in cm spreads its probability under a smooth curve. The single value 185.00 cm is only a line under that curve, and a line has no width.

```diagram
{"type": "curve", "title": "A count has bars; a measurement has a curve", "panels": [{"title": "Discrete: a count", "x": [-0.7, 12.7], "curves": [{"dist": "bars", "start": 0, "values": [0.003, 0.021, 0.067, 0.134, 0.189, 0.2, 0.165, 0.109, 0.059, 0.026, 0.01, 0.003, 0.001], "hi": [5]}], "ticks": [0, 2, 4, 6, 8, 10, 12], "notes": [{"text": "P(X = 5) is the height of one bar", "at": [9.3, 0.9], "to": [5.5, 0.8], "tone": "hl"}]}, {"title": "Continuous: a measurement", "x": [150, 200], "xlabel": "height (cm)", "curves": [{"dist": "normal", "mu": 175, "sigma": 7}], "ticks": [154, 161, 168, 175, 182, 189, 196], "lines": [{"x": 185, "tone": "hl", "label": "x = 185.00", "side": "right"}], "notes": [{"text": ["a line has no width,", "so no area"], "at": [193, 0.75], "tone": "hl"}]}]}
```

## The bus wait drawn as a flat rectangle

The notes' first example is a bus that arrives exactly once every 20 minutes. You do not know the schedule, so your wait T is anywhere from 0 to 20 minutes, with no wait more likely than another.

The picture is **a flat rectangle** from 0 to 20. Its height is the same everywhere, because every wait is equally likely. The shaded strip is the chance of waiting between 8 and 11 minutes. Sketch it the same way on paper: a box, the two bounds marked under it, the strip between them shaded.

```widget
pdf-area
{ "dist": "uniform", "a": 0, "b": 20, "lo": 8, "hi": 11, "showCdf": true, "title": "Bus wait T, 0 to 20 minutes: the strip from 8 to 11 is the probability" }
```

Drag the bounds and the area changes. Press "bring the bounds together" and the strip gets thinner until its area reads 0.

## A bus every 20 minutes: the strip from 8 to 11

The whole rectangle must have area 1, and it is 20 wide. So its height is $1/20 = 0.05$, because $20 \times 0.05 = 1$.

- $8$, the shortest wait asked about, in minutes.
- $11$, the longest wait asked about.
- $0.05$, the height of the rectangle: 1 spread over 20 minutes.

The shaded strip runs from 8 to 11, so it is 3 minutes wide, and it stands 0.05 high. Its area is 0.1500.

```diagram
{"type": "curve", "title": "P(8 ≤ T ≤ 11) is the strip from 8 to 11, 0.1500", "x": [-2, 24], "xlabel": "T, the wait (minutes)", "ylabel": "prob. density", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 8, "to": 11, "label": "0.1500", "tone": "green"}], "ticks": [0, 8, 11, 20], "heights": [{"x": 21.5, "of": 10, "label": "1/20 = 0.05"}], "spans": [{"from": 8, "to": 11, "y": 1.0, "label": "11 − 8 = 3"}]}
```

The strip is a thin rectangle of its own, so its area is width × height:

$$P(8 \le T \le 11) = \underbrace{(11 - 8)}_{\text{strip width, minutes}} \times \underbrace{0.05}_{\text{height}} = \mathbf{0.1500}$$

This is the notes' answer.

## One exact value has probability 0

Shrink the strip to a single point and its width is 0, so its area is 0. **The probability that a continuous variable equals one exact value is 0.** The notes put it as *the probability of any individual x is zero!* For example, the chance a random person weighs exactly 85.000 kg is 0, but the chance they weigh between 84.999 and 85.001 kg is not 0, because that strip has a width.

One exact value is a single vertical line under the curve. On the left is a weight of exactly 85.00 kg; on the right, the bus wait of exactly 4 minutes, which comes up below. Neither line has any width, so neither holds any area.

```diagram
{"type": "curve", "title": "One exact value is a line, and a line has area 0", "panels": [{"title": "Weight: exactly 85.00 kg", "x": [0, 150], "xlabel": "weight (kg)", "curves": [{"dist": "normal", "mu": 78, "sigma": 16}], "ticks": [0, {"x": 85, "label": "85.00"}], "lines": [{"x": 85, "solid": true, "tone": "hl", "label": "area 0", "side": "right"}]}, {"title": "Bus: exactly 4 minutes", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "lines": [{"x": 4, "solid": true, "tone": "green", "label": "area 0"}], "ticks": [0, 4, 20]}]}
```

$$P(X = \underbrace{85.000}_{\text{one exact weight}}) = \mathbf{0} \qquad P(\underbrace{84.999 \le X \le 85.001}_{\text{a strip 0.002 kg wide}}) \ne 0$$

Just like a dart: the chance it hits one exact mathematical point is 0, but the chance it lands inside the bullseye is not.

The bus example asks the same thing: the chance of waiting exactly 4 minutes is **0.0000**.

:::tip ≤ and < give the same area
Adding or dropping one endpoint adds or drops an area of 0. So $P(T \le 11)$ and $P(T < 11)$ are the same number, and there is no "k − 1" step as there was for the binomial and the Poisson.
:::

```diagram
{"type": "grid", "title": "Counts against measurements", "nodes": [{"id": "h0", "label": "", "row": 0, "col": 0}, {"id": "h1", "label": "Discrete (Quiz 7)", "row": 0, "col": 1}, {"id": "h2", "label": "Continuous (Unit 5)", "row": 0, "col": 2}, {"id": "a0", "label": "Values", "row": 1, "col": 0}, {"id": "a1", "label": "Counts: 0, 1, 2, …", "row": 1, "col": 1}, {"id": "a2", "label": "Any point in an interval", "row": 1, "col": 2}, {"id": "b0", "label": "P(X = x)", "row": 2, "col": 0}, {"id": "b1", "label": "From a formula", "row": 2, "col": 1}, {"id": "b2", "label": "Always 0", "row": 2, "col": 2}, {"id": "c0", "label": "Probability is", "row": 3, "col": 0}, {"id": "c1", "label": "A sum of bars", "row": 3, "col": 1}, {"id": "c2", "label": "An area under f(x)", "row": 3, "col": 2}, {"id": "d0", "label": "≤ against <", "row": 4, "col": 0}, {"id": "d1", "label": "Different: k − 1", "row": 4, "col": 1}, {"id": "d2", "label": "The same", "row": 4, "col": 2}], "hi": ["b2", "d2"], "caption": "The last row is the one that changes your working on paper."}
```

## The height f(x) and the area so far F(x)

The notes say *we don't specify P(x) for individual values of X. Instead, we specify the probability that X falls within any given interval of values.* For example, the chance a random adult is at most 182 cm tall is 0.75: a probability for an interval, never for one height.

Two functions describe the curve:

- The **probability density function**, or **pdf**, $f(x)$, is **the height of the curve at x.** For the bus, $f(t) = 0.05$ for every wait from 0 to 20. The height is not a probability; only an area is.
- The **cumulative distribution function**, or **cdf**, $F(x) = P(X \le x)$, is **the area under the curve up to x.** The notes write it as *area up to x*. For example, $F(11)$ for the bus is the chance the wait is 11 minutes or less.

Any density can be lumpy. On the left, the red curve is y = f(x) and the blue area runs from the far left up to b: that area is P(X ≤ b). On the right, a curve that rises fast and falls slowly, shaded up to x: that area is F(x).

```diagram
{"type": "curve", "title": "F(x) = P(X ≤ x) is the area up to x", "panels": [{"title": "P(X ≤ b) is the area left of b", "x": [0, 10], "xlabel": "X", "ylabel": "prob. density", "curves": [{"dist": "mix", "parts": [[0.45, 3.2, 1.1], [0.3, 5.2, 0.8], [0.25, 7, 1.3]], "tone": "red", "label": "y = f(x)", "labelAt": [7.9, 0.6]}], "shade": [{"to": 4.6, "tone": "blue", "label": "P(X ≤ b)"}], "lines": [{"x": 4.6, "solid": true, "tone": "blue"}], "ticks": [{"x": 4.6, "label": "b"}]}, {"title": "Area up to x is F(x)", "x": [0, 12], "xlabel": "X", "curves": [{"dist": "mix", "parts": [[0.5, 3, 0.7], [0.3, 4.8, 1.5], [0.2, 7.5, 2]], "tone": "red"}], "shade": [{"to": 3.4, "tone": "blue", "label": "F(x)"}], "lines": [{"x": 3.4, "tone": "red"}], "ticks": [{"x": 3.4, "label": "x"}]}]}
```

The notes write these areas with the sign $\int$. **$\int_a^b f(x)\,dx$ means "the area under the curve between a and b".** For example, $\int_8^{11} f(t)\,dt$ for the bus is the strip from 8 to 11, the 0.1500 above. You never work one out by hand. Every area in this unit comes from a rectangle, the Z table or the exponential formula.

### F(t) building up as the bound moves right

Each step moves the bound one minute to the right. The shaded area on the left and the height of F on the right are the same number at every stop, so F climbs in a straight line from 0 at 0 minutes to 1 at 20 minutes.

```widget
cdf-sweep-play
{ "preset": "bus wait: uniform on [0, 20]", "title": "Bus wait: F(t) is the area so far" }
```

For the bus, the area up to 11 minutes is a rectangle 11 wide, and the area up to 8 minutes is one 8 wide. Both stand 0.05 high.

```diagram
{"type": "curve", "title": "F(11) = 0.55 and F(8) = 0.40 for the bus", "panels": [{"title": "Up to 11: F(11) = 0.55", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"to": 11, "label": "0.55", "tone": "green"}], "ticks": [0, 11, 20]}, {"title": "Up to 8: F(8) = 0.40", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"to": 8, "label": "0.40", "tone": "green"}], "ticks": [0, 8, 20]}]}
```

In numbers:

$$F(11) = \underbrace{11}_{\text{width, 0 to 11}} \times \underbrace{0.05}_{\text{height}} = 0.55 \qquad F(8) = \underbrace{8}_{\text{width, 0 to 8}} \times \underbrace{0.05}_{\text{height}} = 0.40$$

## Three properties of every density

The notes list three properties of a pdf:

1. **Total area beneath f(x) is equal to 1.** The variable lands somewhere, for certain.
2. **Positivity: f(x) ≥ 0 for all x.** A curve never dips below the axis, because an area cannot be negative.
3. **Probability of an interval: $P(a \le X \le b) = F(b) - F(a)$.** The area up to b, minus the area up to a, leaves the strip between them.

Properties 1 and 3 as pictures. On the left the whole area under a lumpy curve is shaded, and it is 1. On the right only the strip between a and b is shaded: the area up to b with the area up to a taken away.

```diagram
{"type": "curve", "title": "The whole area is 1; a strip is F(b) − F(a)", "panels": [{"title": "Total area = 1", "x": [0, 10], "xlabel": "X", "curves": [{"dist": "mix", "parts": [[0.3, 3, 0.7], [0.25, 4.6, 0.6], [0.25, 6, 0.6], [0.2, 7.4, 0.8]], "tone": "red"}], "shade": [{"tone": "blue", "label": "area 1"}], "notes": [{"text": "P(−∞ < X < ∞) = 1", "at": [5, 0.95], "tone": "blue"}]}, {"title": "Strip from a to b", "x": [0, 12], "xlabel": "X", "curves": [{"dist": "mix", "parts": [[0.6, 4, 1.4], [0.4, 6.5, 2.5]], "tone": "red"}], "shade": [{"from": 4.6, "to": 5.8, "tone": "hl", "label": "F(b) − F(a)", "labelAt": [8.6, 0.75]}], "ticks": [{"x": 4.6, "label": "a"}, {"x": 5.8, "label": "b"}]}]}
```

Property 3 for the bus, with the two F values from above:

$$P(8 \le T \le 11) = \underbrace{F(11)}_{\text{area up to 11}} - \underbrace{F(8)}_{\text{area up to 8}} = \underbrace{0.55}_{F(11)} - \underbrace{0.40}_{F(8)} = \mathbf{0.1500}$$

Just like a tape measure: the length from 8 to 11 is the reading at 11 minus the reading at 8.

## Three curves, three ways to get the area

The course uses three continuous distributions. Each has its own shape and its own source for the area.

```diagram
{"type": "grid", "title": "The three distributions of Unit 5", "nodes": [{"id": "h0", "label": "Name", "row": 0, "col": 0}, {"id": "h1", "label": "Shape", "row": 0, "col": 1}, {"id": "h2", "label": "Models", "row": 0, "col": 2}, {"id": "h3", "label": "Area from", "row": 0, "col": 3}, {"id": "u0", "label": "Uniform", "row": 1, "col": 0}, {"id": "u1", "label": "Flat rectangle", "row": 1, "col": 1}, {"id": "u2", "label": "Any value equally likely", "row": 1, "col": 2}, {"id": "u3", "label": "Width × height", "row": 1, "col": 3}, {"id": "n0", "label": "Normal", "row": 2, "col": 0}, {"id": "n1", "label": "Bell, symmetric", "row": 2, "col": 1}, {"id": "n2", "label": "Heights, IQ, voltages", "row": 2, "col": 2}, {"id": "n3", "label": "The Z table", "row": 2, "col": 3}, {"id": "e0", "label": "Exponential", "row": 3, "col": 0}, {"id": "e1", "label": "Starts high at 0, falls", "row": 3, "col": 1}, {"id": "e2", "label": "Wait for the next event", "row": 3, "col": 2}, {"id": "e3", "label": "1 − e^(−x/β)", "row": 3, "col": 3}], "hi": ["u3", "n3", "e3"], "caption": "The notes: Normal is the \"Bell Curve\" or \"Gaussian\" distribution; Exponential is the waiting time for Poisson events."}
```

The long version is [Continuous random variables](#/math3042-u5/continuous-random-variables), then [pdf and cdf](#/math3042-u5/pdf-cdf).

## Strips of a SkyTrain wait, a download's F values, and ≤ against <

A SkyTrain comes every 5 minutes and you arrive at a random moment. Your wait X is a flat rectangle from 0 to 5 minutes with height 0.2.

The rectangle is 5 wide and 0.2 high, so its whole area is $5 \times 0.2 = 1$. Every question below is a strip of it.

```diagram
{"type": "curve", "title": "The SkyTrain wait: 0 to 5 minutes, height 0.2", "x": [-0.6, 6.4], "xlabel": "X, the wait (minutes)", "ylabel": "prob. density", "curves": [{"dist": "uniform", "a": 0, "b": 5, "tone": "red"}], "ticks": [0, 1, 2, 3, 4, 5], "heights": [{"x": 5.6, "of": 2.5, "label": "0.2"}]}
```

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $f(x) = \dfrac{1}{b-a},\ a \le x \le b$
- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$

**Not on the sheet, so know it:**

- A rectangle's area is width × height, and the whole area under a density is 1.
- $P(a \le X \le b) = F(b) - F(a)$.
- A single exact value has probability 0, so ≤ and < give the same area.
:::

```quiz
[
  {"q": "The SkyTrain wait X, a rectangle from 0 to 5 minutes with height 0.2. What is $P(1 \\le X \\le 2.5)$? (4 decimals)", "type": "numeric", "answer": 0.3, "tolerance": 0.0001, "explain": "Let X = the wait in minutes. The strip from 1 to 2.5 is a rectangle: $$P(1 \\le X \\le 2.5) = \\underbrace{(2.5 - 1)}_{\\text{strip width}} \\times \\underbrace{0.2}_{\\text{height}} = \\mathbf{0.3000}$$"},
  {"q": "The same SkyTrain wait. What is $P(X > 4.2)$, a wait of more than 4.2 minutes? (4 decimals)", "type": "numeric", "answer": 0.16, "tolerance": 0.0001, "explain": "The strip runs from 4.2 to the end of the rectangle at 5: $$P(X > 4.2) = \\underbrace{(5 - 4.2)}_{\\text{strip width}} \\times \\underbrace{0.2}_{\\text{height}} = \\mathbf{0.1600}$$"},
  {"q": "The same SkyTrain wait. What is $P(X = 2)$, a wait of exactly 2 minutes? (4 decimals)", "type": "numeric", "answer": 0, "tolerance": 0.0001, "explain": "One exact value is a strip of width 0: $$P(X = 2) = \\underbrace{0}_{\\text{strip width}} \\times \\underbrace{0.2}_{\\text{height}} = \\mathbf{0.0000}$$ The height 0.2 is not the answer: a height is not a probability."},
  {"q": "A file's download time X, in seconds, has cdf values $F(10) = 0.40$ and $F(25) = 0.85$. What is $P(10 \\le X \\le 25)$? (4 decimals)", "type": "numeric", "answer": 0.45, "tolerance": 0.0001, "explain": "Property 3 of a density, the area up to 25 minus the area up to 10: $$P(10 \\le X \\le 25) = \\underbrace{0.85}_{F(25)\\text{, area up to 25}} - \\underbrace{0.40}_{F(10)\\text{, area up to 10}} = \\mathbf{0.4500}$$"},
  {"q": "For the SkyTrain wait, how do $P(X < 2.5)$ and $P(X \\le 2.5)$ compare?", "options": ["They are equal", "$P(X < 2.5)$ is smaller by $P(X = 2.5)$, a positive amount", "$P(X \\le 2.5)$ is smaller", "$P(X < 2.5)$ must be worked out as $P(X \\le 1.5)$"], "answer": 0, "explain": "The two differ only by $P(X = 2.5)$, which is 0 for a continuous variable. Both equal $\\underbrace{2.5}_{\\text{width}} \\times \\underbrace{0.2}_{\\text{height}} = 0.5$. There is no k − 1 step for a measurement."}
]
```

## Remember

- A continuous variable is a measurement; **a probability is an area under the curve, and the whole area is 1.**
- **One exact value has probability 0**, so ≤ and < give the same answer: no k − 1 step.
- $f(x)$ is the height, not a probability. $F(x) = P(X \le x)$ is the area up to x.
- $P(a \le X \le b) = F(b) - F(a)$.
- Uniform: area from width × height. Normal: the Z table. Exponential: $1 - e^{-x/\beta}$.
- In R, the bus strip is `punif(11, 0, 20) - punif(8, 0, 20)`, which is F(11) − F(8).

:::info R syntax
| Code | What it does |
|---|---|
| `punif(11, 0, 20)` | F(11) for a uniform: slots `punif(q, min, max)`, so q = 11, min = 0, max = 20. |
| `punif(8, 0, 20)` | F(8), the same curve with q = 8. |
| `-` | Subtracts the second area from the first, leaving the strip from 8 to 11. |

**Left to right**

- `punif(11, 0, 20) - punif(8, 0, 20)`: "The uniform area to the left (`punif`) of 11 on 0 to 20, minus (`-`) the uniform area to the left of 8 on 0 to 20."

**Right to left**, the order R runs it

- `punif(11, 0, 20) - punif(8, 0, 20)`: "Compute the area up to 11 (`punif(11, 0, 20)`), compute the area up to 8 (`punif(8, 0, 20)`), then subtract (`-`)."
:::
