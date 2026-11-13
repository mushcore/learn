---
title: "Before you start: area as probability, the e^x and ln keys, the four R letters"
minutes: 8
---
<!-- facts: none; a reference page for calculator keys and R naming, with no instructor example of its own -->
Every Part 1 answer in Unit 5 ends with an area, an $e^x$ press or an ln press on the calculator. This page covers those keys, the rounding rules and how R names its functions, so no later lesson stops to explain them.

## A count versus a measurement

Quiz 7's variables were **counts**: 0, 1, 2 and so on, with nothing in between. Just like the number of emails in an inbox: you can have 3 or 4, never 3.6.

Unit 5's variables are **measurements**: a wait of 6.3 minutes, a battery at 9.02 volts. Just like reading a ruler: between any two marks there is always another value.

That one difference changes how a probability is found. A count gets its probability from a formula for each value. A measurement gets it from an area.

## A probability is an area, and the whole area is 1

In Unit 5 a probability is drawn as the area of a shape above a number line. **The whole shape always has area 1**, because the measurement is certain to land somewhere on the line.

Unit 5 uses three shapes: a flat rectangle (uniform), a bell (normal) and a curve that starts high and falls (exponential). Each is shaded in full below, and each shaded area is 1.

```diagram
{"type": "curve", "title": "Three shapes, each with total area 1", "panels": [{"title": "Uniform: flat", "x": [-2, 23], "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 0, "to": 20, "label": "area 1", "tone": "green"}], "ticks": [0, 20]}, {"title": "Normal: a bell", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"label": "area 1", "tone": "hl"}], "ticks": [0]}, {"title": "Exponential: falls from 0", "x": [-0.3, 5], "curves": [{"dist": "exp", "beta": 1, "tone": "red"}], "shade": [{"label": "area 1", "tone": "hl", "labelAt": [2, 0.5]}], "ticks": [0]}]}
```

The simplest shape is a rectangle. **The area of a rectangle is width × height.** For example, a floor tile 2 metres long and 0.5 metres wide covers 1 square metre.

Take a bus that comes every 20 minutes, with your wait spread evenly from 0 to 20 minutes:

- $20$, the width: every wait from 0 to 20 minutes is possible.
- $0.05$, the height of the rectangle, which is $1/20$.

$$\text{whole area} = \underbrace{20}_{\text{width, 0 to 20 min}} \times \underbrace{0.05}_{\text{height}} = \mathbf{1}$$

The chance of waiting between 8 and 11 minutes is the strip of the rectangle from 8 to 11:

- $11 - 8 = 3$, the width of the strip in minutes.
- $0.05$, the same height.

The shaded strip is 3 wide and 0.05 high, so its area is 0.15.

```diagram
{"type": "curve", "title": "The strip from 8 to 11 has area 0.15", "x": [-2, 24], "xlabel": "T, the wait (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 8, "to": 11, "label": "0.15", "tone": "green"}], "ticks": [0, 8, 11, 20], "heights": [{"x": 21.5, "of": 10, "label": "0.05"}]}
```

$$P(8 \le T \le 11) = \underbrace{(11 - 8)}_{\text{strip width}} \times \underbrace{0.05}_{\text{height}} = \mathbf{0.15}$$

## The e^x key with a fraction in the exponent

The exponential distribution uses $e = 2.718\ldots$ raised to a negative fraction, such as $e^{-4/2.5}$. **Work the exponent out first, or put it in brackets.** For example, $-4 \div 2.5 = -1.6$, so $e^{-4/2.5}$ is the same number as $e^{-1.6}$.

- $-4$, the time asked about with its minus sign.
- $2.5$, the mean wait in seconds.

Exponent first:

$$\underbrace{-4}_{\text{time, with its minus}} \div \underbrace{2.5}_{\text{mean wait}} = -1.6$$

Then the key:

$$e^{-1.6} = \mathbf{0.201897}$$

On the calculator type 1.6, the sign key (+/− or (−)), then $e^x$. On a calculator that takes the key first, press $e^x$, then type ( −4 ÷ 2.5 ) with both brackets.

:::warn Without brackets, the calculator divides after the e^x
Typing $e^x$, −4, ÷, 2.5 gives $e^{-4} \div 2.5 = 0.0073$, a different number. Brackets or the exponent worked out first avoid it.
:::

The exponential answers then subtract that number from 1. The 1 is the whole area. For a mean wait of 2.5 seconds, $e^{-1.6}$ is the tail past 4 seconds, and what is left is the area from 0 to 4:

```diagram
{"type": "curve", "title": "Area from 0 to 4 is 1 − e^(−1.6) = 0.7981", "x": [-0.7, 12], "xlabel": "X, the wait (seconds)", "curves": [{"dist": "exp", "beta": 2.5, "tone": "red"}], "shade": [{"to": 4, "label": "0.7981", "tone": "hl"}, {"from": 4, "label": "0.2019", "tone": "blue", "labelAt": [7, 0.3]}], "ticks": [0, 4]}
```

In numbers:

$$1 - e^{-1.6} = \underbrace{1}_{\text{whole area}} - \underbrace{0.201897}_{e^{-1.6}\text{, from above}} = \mathbf{0.7981}$$

**Keep six digits in the middle of a calculation and round only on the last line.**

## The ln key undoes e^x

**ln is the key that undoes $e^x$.** Whatever power $e$ was raised to, ln gives that power back. Just like square and square root: squaring 3 gives 9, and the root of 9 gives 3 back.

$$\ln(e^{-1.6}) = \underbrace{-1.6}_{\text{the power e was raised to}}$$

ln of a number between 0 and 1 is negative. For example:

$$\ln(\underbrace{0.05}_{\text{the area left over}}) = \mathbf{-2.995732}$$

ln is how a later lesson solves for a time. The waiting time with 95 % of the area below it, for a mean wait of 2.5 seconds, is:

- $2.5$, the mean wait in seconds.
- $0.05$, which is $1 - 0.95$: the area above the time asked for.

The shaded area from 0 up to the unknown time is 0.95, and the thin tail past it is 0.05. The time turns out to be 7.49 seconds.

```diagram
{"type": "curve", "title": "Area 0.95 below 7.49 seconds", "x": [-0.7, 12], "xlabel": "X, the wait (seconds)", "curves": [{"dist": "exp", "beta": 2.5, "tone": "red"}], "shade": [{"to": 7.49, "label": "0.95", "tone": "hl"}, {"from": 7.49, "label": "0.05", "tone": "dim"}], "ticks": [0, {"x": 7.49, "label": "7.49"}]}
```

$$x = -\underbrace{2.5}_{\text{mean wait}} \times \ln(\underbrace{0.05}_{1 - 0.95}) = -2.5 \times (-2.995732) = \mathbf{7.4893}$$

The two minus signs cancel, so the time is positive: 7.49 seconds.

## The square root key

A standard deviation in Unit 5 often has a root in it. For a wait spread evenly over 20 minutes it is $20/\sqrt{12}$. Press 12 and the root key, then divide 20 by the result.

$$\dfrac{\underbrace{20}_{\text{width, 0 to 20 min}}}{\sqrt{12}} = \dfrac{20}{3.464102} = \mathbf{5.7735}$$

## Rounding on Part 1

**A probability is rounded to 4 decimals. A mean $\mu$, a standard deviation $\sigma$ and a final value x are rounded to 2 decimals**, unless the question's data shows more. Just like a receipt: the total is printed to the cent, but the till keeps every digit until the end.

**A Z-score is rounded to 2 decimals before you look it up in the Z table, always.** The table has one row and one column for each two-decimal z, and nothing in between.

## The four R letters

Every R function in Unit 5 is one letter followed by the distribution's name. **The first letter says what comes back:**

- `p` gives the area to the left of a value: a probability.
- `q` goes from an area back to the value: a percentile.
- `r` makes random values: a simulation.
- `d` gives the height of the curve. **For a measurement the height is not a probability.**

The rest of the name is the distribution: `unif` for uniform, `norm` for normal, `exp` for exponential. For example, `pnorm` is the area to the left under a normal curve, and `qexp` turns an area back into an exponential waiting time.

```diagram
{"type": "grid", "title": "First letter + distribution = the function", "nodes": [{"id": "h0", "label": "", "row": 0, "col": 0}, {"id": "h1", "label": "unif", "row": 0, "col": 1}, {"id": "h2", "label": "norm", "row": 0, "col": 2}, {"id": "h3", "label": "exp", "row": 0, "col": 3}, {"id": "h4", "label": "gives back", "row": 0, "col": 4}, {"id": "p0", "label": "p", "row": 1, "col": 0}, {"id": "p1", "label": "punif", "row": 1, "col": 1}, {"id": "p2", "label": "pnorm", "row": 1, "col": 2}, {"id": "p3", "label": "pexp", "row": 1, "col": 3}, {"id": "p4", "label": "area to the left", "row": 1, "col": 4}, {"id": "q0", "label": "q", "row": 2, "col": 0}, {"id": "q1", "label": "qunif", "row": 2, "col": 1}, {"id": "q2", "label": "qnorm", "row": 2, "col": 2}, {"id": "q3", "label": "qexp", "row": 2, "col": 3}, {"id": "q4", "label": "value for an area", "row": 2, "col": 4}, {"id": "r0", "label": "r", "row": 3, "col": 0}, {"id": "r1", "label": "runif", "row": 3, "col": 1}, {"id": "r2", "label": "rnorm", "row": 3, "col": 2}, {"id": "r3", "label": "rexp", "row": 3, "col": 3}, {"id": "r4", "label": "random values", "row": 3, "col": 4}, {"id": "d0", "label": "d", "row": 4, "col": 0}, {"id": "d1", "label": "dunif", "row": 4, "col": 1}, {"id": "d2", "label": "dnorm", "row": 4, "col": 2}, {"id": "d3", "label": "dexp", "row": 4, "col": 3}, {"id": "d4", "label": "height, not a probability", "row": 4, "col": 4}], "hi": ["p0", "p1", "p2", "p3", "p4"], "caption": "The p row does most of the work on Part 2."}
```

The notes check one paper answer this way: the chance that an IQ score is 120 or lower, when scores are normal with mean 100 and standard deviation 15. That chance is the area under the IQ bell to the left of 120.

```diagram
{"type": "curve", "title": "P(IQ ≤ 120) is the area left of 120, 0.9088", "x": [46, 154], "xlabel": "IQ score", "curves": [{"dist": "normal", "mu": 100, "sigma": 15}], "shade": [{"to": 120, "label": "0.9088", "tone": "hl"}, {"from": 120, "label": "0.0912", "tone": "blue"}], "ticks": [100, 120]}
```

```r
pnorm(120, 100, 15)
```

```text
[1] 0.9087888
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(…)` | The area to the left under a normal curve. |
| `120` | Fills the slot `q`: the value the area runs up to. |
| `100` | Fills the slot `mean`: the centre of the curve. |
| `15` | Fills the slot `sd`: the standard deviation. |
| `[1]` | In the output, the position of the first value on the printed line, not part of the answer. |

**Left to right**

- "The normal area to the left (`pnorm`) of 120 (`q`), for a curve with mean 100 (`mean`) and standard deviation 15 (`sd`)."

**Right to left**, the order R runs it

- "Take the value 120, the mean 100 and the standard deviation 15, then return the area to the left of 120 (`pnorm`)."
:::

## Remember

- A probability in Unit 5 is an area; the whole area is 1; a rectangle's area is width × height.
- $e^x$ with a fraction: work the exponent out first, or use brackets.
- ln undoes $e^x$, and ln of a number below 1 is negative.
- Probability to 4 decimals; μ, σ and x to 2; Z to 2 before the table.
- `p` area, `q` value, `r` random, `d` height.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $\sigma^2 = \dfrac{1}{12}(b-a)^2$
- Exponential: $F(x) = 1 - e^{-x/\beta}$

**Not on the sheet, so know it:**

- A rectangle's area is width × height, and the whole area under a density is 1.
- σ is the square root of the sheet's σ², so the uniform's σ is $(b-a)/\sqrt{12}$.
- ln undoes $e^x$: $\ln(e^{k}) = k$.
- The first letter of an R function: `p` area, `q` value, `r` random, `d` height.
:::

```quiz
[
  {"q": "$e^{-0.6}$ = ? (4 decimals)", "type": "numeric", "answer": 0.5488, "tolerance": 0.0001, "explain": "Type 0.6, the sign key, then $e^x$: $$e^{-0.6} = 0.548812 = \\mathbf{0.5488}$$ Rounded on the last line to 4 decimals."},
  {"q": "$1 - e^{-2}$ = ? (4 decimals)", "type": "numeric", "answer": 0.8647, "tolerance": 0.0001, "explain": "First $e^{-2} = 0.135335$, then take it from the whole area: $$\\underbrace{1}_{\\text{whole area}} - \\underbrace{0.135335}_{e^{-2}} = \\mathbf{0.8647}$$"},
  {"q": "$-10 \\times \\ln(0.5)$ = ? (2 decimals)", "type": "numeric", "answer": 6.93, "tolerance": 0.01, "explain": "ln of a number below 1 is negative: $\\ln(0.5) = -0.693147$. $$-\\underbrace{10}_{\\text{the multiplier}} \\times \\underbrace{(-0.693147)}_{\\ln(0.5)} = \\mathbf{6.93}$$ The two minus signs cancel. This is the median wait when the mean wait is 10 minutes."},
  {"q": "$12/\\sqrt{12}$ = ? (2 decimals)", "type": "numeric", "answer": 3.46, "tolerance": 0.01, "explain": "$\\sqrt{12} = 3.464102$. $$\\dfrac{\\underbrace{12}_{\\text{width}}}{\\underbrace{3.464102}_{\\sqrt{12}}} = \\mathbf{3.46}$$ This is the standard deviation of a wait spread evenly over 12 minutes. A number over its own root is just the root."},
  {"q": "Which first letter of an R function turns an area back into a value, such as the 90th percentile?", "options": ["`q`", "`p`", "`r`", "`d`"], "answer": 0, "explain": "`q` goes from an area to the value with that area to its left, as in `qnorm` or `qexp`. `p` goes the other way, `r` makes random values, and `d` gives the height of the curve."},
  {"q": "A rectangle runs from 0 to 40 with height 0.025. What is the area of the strip from 10 to 18? (4 decimals)", "type": "numeric", "answer": 0.2, "tolerance": 0.0001, "explain": "The whole rectangle has area $40 \\times 0.025 = 1$, so a strip of it is a probability. $$\\underbrace{(18 - 10)}_{\\text{strip width}} \\times \\underbrace{0.025}_{\\text{height}} = \\mathbf{0.2000}$$"}
]
```
