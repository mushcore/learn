---
title: The uniform distribution: waiting for the bus
minutes: 20
---
<!-- facts: classic.formula.damage-roll -->

A bus comes every twenty minutes and you arrive at a random moment. Every wait from 0 to 20 minutes is equally likely, so the probability of any range of waits is just a fraction of the 20 minutes. That is the uniform distribution, and it is the one continuous distribution whose areas are rectangles. MapleStory Classic's damage roll draws a uniform multiplier on every hit, so the same rectangle answers how often a hit draws its multiplier from the top quarter of the multiplier's range.

## A flat density on [a, b]

Slide wording: "The first specific type of continuous probability distribution we will examine is the simplest: a *uniform distribution* on an interval $[a, b]$."

The density is a rectangle: constant from $a$ to $b$ and zero everywhere else. The total area must be 1, and the rectangle is $b - a$ wide, so its height is forced:

$$f(x) = \frac{1}{b - a} \quad \text{for } a \le x \le b$$

Every probability is then a rectangle's area, width times height:

$$P(c \le X \le d) = (d - c) \times \frac{1}{b - a} = \frac{d - c}{b - a}$$

The probability of an interval is its length as a fraction of the whole interval. The mean sits in the middle and the standard deviation is a fixed fraction of the width:

$$\mu = \frac{a + b}{2}, \qquad \sigma = \frac{b - a}{\sqrt{12}}$$

## Classic's base multiplier B, uniform on [0.8, 1.0]

In MapleStory Classic, meowdb's reconstructed damage formula multiplies every hit by a base multiplier B drawn as `uniform(0.8, 1.0)` [Classic, meowdb's Classic World formulas page, no version shown, checked 2026-10-27]. The formula draws B afresh on each hit from a flat density whose two ends are known, which is exactly a uniform on $[a, b] = [0.8, 1.0]$, with height $1/0.2 = 5$. Only B is uniform: the hit's final damage combines B with a second uniform draw, the stat term, so the damage number itself is not flat between its minimum and maximum.

```quiz
[
  {"q": "B is uniform on [0.8, 1.0]. P(B > 0.95) = ? (4 decimals)", "type": "numeric", "answer": 0.25, "tolerance": 0.0001, "explain": "The interval runs from 0.95 to the end at 1.0, length 0.05, out of a whole of 1.0 − 0.8 = 0.2: 0.05/0.2 = 0.2500. As a rectangle, width 0.05 times height 5."},
  {"q": "The mean multiplier μ = ?", "type": "numeric", "answer": 0.9, "tolerance": 0.0005, "explain": "μ = (a + b)/2 = (0.8 + 1.0)/2 = 0.9, the middle of the flat density."},
  {"q": "σ of B = ? (3 significant digits)", "type": "numeric", "answer": 0.0577, "tolerance": 0.0001, "explain": "σ = (b − a)/√12 = 0.2/3.4641 = 0.0577."}
]
```

**More than 0.95?** The interval is 0.95 to 1.0, so its length is $1.0 - 0.95 = 0.05$, not 0.95:

$$P(B > 0.95) = \frac{1.0 - 0.95}{1.0 - 0.8} = \frac{0.05}{0.2} = \mathbf{0.2500}$$

One hit in four draws B in the top quarter of B's range. **Mean and standard deviation.** $\mu = \dfrac{0.8 + 1.0}{2} = 0.9$ and $\sigma = \dfrac{0.2}{\sqrt{12}} = \dfrac{0.2}{3.4641} = 0.0577$. In R the right tail is `1 - punif(0.95, 0.8, 1.0)`, which prints 0.25.

### B above 0.95 as a rectangle

```widget
pdf-area
{ "dist": "uniform", "a": 0.8, "b": 1.0, "lo": 0.95, "hi": null, "showCdf": false, "title": "Classic base multiplier B, uniform on [0.8, 1.0]: P(B > 0.95)" }
```

The density is 5 high because the interval is only 0.2 wide; the shaded rectangle is 0.05 by 5.

## The bus example

Slide wording: "A bus arrives exactly once every twenty minutes. However, you don't know its schedule, so when you start waiting for the bus, the time $T$ you must wait is random and uniformly distributed." So $T$ is uniform on $[0, 20]$, with density height $\frac{1}{20} = 0.05$ per minute.

```quiz
[
  {
    "q": "$T$ is uniform on $[0, 20]$ minutes. What is $P(8 \\le T \\le 11)$?",
    "type": "numeric",
    "answer": 0.15,
    "tolerance": 0.001,
    "explain": "The interval is 3 minutes long out of 20: $3/20 = 0.15$. As a rectangle, width 3 times height 0.05."
  }
]
```

**Between 8 and 11 minutes?**

$$P(8 \le T \le 11) = \frac{11 - 8}{20} = \frac{3}{20} = \mathbf{0.15}$$

**More than 12 minutes?** The interval is from 12 up to the end at 20, so its length is $20 - 12 = 8$, not 12:

$$P(T > 12) = \frac{20 - 12}{20} = \frac{8}{20} = \mathbf{0.40}$$

**Exactly 4 minutes?** The interval from 4 to 4 has width zero:

$$P(T = 4) = \mathbf{0}$$

**Mean and standard deviation.** $\mu = \dfrac{0 + 20}{2} = 10$ minutes, $\sigma = \dfrac{20}{\sqrt{12}} = \dfrac{20}{3.4641} = 5.77$ minutes.

In R, `punif(x, a, b)` is the area to the left of $x$, so an interval is a difference of two calls and a right tail is $1 -$ one call:

```r
punif(11, 0, 20) - punif(8, 0, 20)
1 - punif(12, 0, 20)
punif(4, 0, 20) - punif(4, 0, 20)
```

```text
[1] 0.15
[1] 0.4
[1] 0
```

## The rectangle under the bus density

```widget
pdf-area
{ "dist": "uniform", "a": 0, "b": 20, "lo": 8, "hi": 11, "showCdf": false, "title": "Bus wait T, uniform on [0, 20]" }
```

The same rectangle with bounds 12 and 20 is "more than 12 minutes"; with both bounds at 4 it has no width.

## Height is density, not probability

The height 0.05 is not the probability of anything: a uniform on $[0, 0.5]$ has height 2, and no probability is 2. Height times width is probability. `dunif(4, 0, 20)` returns 0.05, the height of the density at 4, and is never the answer to a "what is the probability" question.

Units must match the interval. If the same bus question is posed in hours, the wait is uniform on $[0, \frac{1}{3}]$ and "more than 0.2 hours" is $\dfrac{1/3 - 0.2}{1/3} = 0.40$, the same answer as 12 minutes. Mixing a limit in minutes with an interval in hours gives nonsense.

## New intervals for Classic's multiplier B

B is uniform on [0.8, 1.0] on every hit. Each item asks for a range, a percentile or the σ band of the same B.

```quiz
[
  {"q": "P(0.85 ≤ B ≤ 0.92) = ? (4 decimals)", "type": "numeric", "answer": 0.35, "tolerance": 0.0001, "explain": "Width over total width: (0.92 − 0.85)/(1.0 − 0.8) = 0.07/0.2 = 0.3500. The total width is 0.2, not 1.0: the interval starts at 0.8."},
  {"type": "fill", "q": "Complete the R line for P(0.85 ≤ B ≤ 0.92).", "code": "punif(0.92, ___, 1.0) - punif(0.85, 0.8, 1.0)", "answer": ["0.8", ".8"], "explain": "punif(x, a, b) is F(x) = (x − a)/(b − a), so both calls take a = 0.8 and b = 1.0: 0.6 − 0.25 = 0.35, printed as 0.35."},
  {"q": "P(B < 0.83) = ? (4 decimals)", "type": "numeric", "answer": 0.15, "tolerance": 0.0001, "explain": "Measure from a = 0.8, not from 0: (0.83 − 0.8)/0.2 = 0.03/0.2 = 0.1500. P(B < 0.83) and P(B ≤ 0.83) are equal, since a single value has probability 0."},
  {"q": "The 90th percentile of B, the value with 90 % of hits below it, is b₀ = ?", "type": "numeric", "answer": 0.98, "tolerance": 0.0005, "explain": "Solve (b₀ − 0.8)/0.2 = 0.90: b₀ = 0.8 + 0.90 × 0.2 = 0.98. In R, qunif(0.9, 0.8, 1.0) prints 0.98."},
  {"q": "P(μ − σ ≤ B ≤ μ + σ) = ? (4 decimals)", "type": "numeric", "answer": 0.5774, "tolerance": 0.0001, "explain": "μ ± σ = 0.9 ± 0.0577 = 0.8423 to 0.9577, a width of 2σ = 0.11547. Over 0.2: 0.11547/0.2 = 0.5774, which is 2/√12 for every uniform. A flat density puts 57.74 % within one σ, not the normal's 68 %."},
  {"q": "The variance σ² of B = ? (3 significant digits)", "type": "numeric", "answer": 0.00333, "tolerance": 0.000005, "explain": "σ² = (b − a)²/12 = 0.2²/12 = 0.04/12 = 0.00333, the square of σ = 0.0577."}
]
```

```quiz
[
  {
    "q": "A bus comes every 30 minutes and $T$ is uniform on $[0, 30]$. What is $P(5 \\le T \\le 12)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.2333,
    "tolerance": 0.0002,
    "explain": "Length of the interval over length of the whole: $(12 - 5)/30 = 7/30 = 0.2333$."
  },
  {
    "q": "Same bus, uniform on $[0, 30]$. What is $P(T > 20)$?",
    "options": ["$20/30 = 0.6667$", "$10/30 = 0.3333$", "$1/30 = 0.0333$", "0"],
    "answer": 1,
    "explain": "'More than 20' runs from 20 to the end at 30, a length of 10: $10/30 = 0.3333$. The length is $b - 20$, not 20."
  },
  {
    "q": "Same bus, uniform on $[0, 30]$. Write the set-up for $P(T > 20)$: the interval's length over the whole length, as two subtractions with no spaces, in the form `(d-c)/(b-a)`.",
    "type": "text",
    "answer": ["(30-20)/(30-0)", "(30-20)/30", "(30−20)/(30−0)", "(30−20)/30"],
    "explain": "'More than 20' is the interval from 20 to $b = 30$: length $30 - 20$, over the whole length $30 - 0$. Written out, $P(T > 20) = (30 - 20)/(30 - 0) = 10/30 = 0.3333$. Writing $20/30$ measures the wrong side."
  },
  {
    "q": "For $T$ uniform on $[0, 30]$, what is the height of the density $f(t)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.0333,
    "tolerance": 0.0002,
    "explain": "$f(t) = 1/(b - a) = 1/30 = 0.0333$. It makes the rectangle's area $30 \\times 0.0333 = 1$; it is a density, not a probability."
  },
  {
    "q": "$T$ uniform on $[0, 30]$. What is the mean wait $\\mu$ in minutes?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0.01,
    "unit": "min",
    "explain": "$\\mu = (a + b)/2 = (0 + 30)/2 = 15$: the middle of a flat density."
  },
  {
    "q": "$T$ uniform on $[0, 30]$. What is $\\sigma$ in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 8.66,
    "tolerance": 0.02,
    "unit": "min",
    "explain": "$\\sigma = (b - a)/\\sqrt{12} = 30/3.4641 = 8.66$. For the 20-minute bus the same formula gave 5.77."
  },
  {
    "q": "The height of a uniform density, $1/(b - a)$, is the probability of each value in $[a, b]$.",
    "type": "tf",
    "answer": false,
    "explain": "Each individual value has probability 0. The height is a density: multiply it by an interval's width to get that interval's probability. A uniform on $[0, 0.5]$ has height 2, which could not be a probability."
  },
  {
    "q": "$T$ uniform on $[0, 30]$. Which R line gives $P(T > 20)$?",
    "options": ["`punif(20, 0, 30)`", "`dunif(20, 0, 30)`", "`1 - punif(20, 0, 30)`", "`punif(30, 0, 20)`"],
    "answer": 2,
    "explain": "`punif` is the area to the left of its first argument, so a right tail is 1 minus it; `dunif` is the density height 1/30. The arguments are x, then a, then b."
  },
  {
    "q": "$X$ is uniform on $[2, 10]$. What is $P(X \\le 4)$?",
    "type": "numeric",
    "answer": 0.25,
    "tolerance": 0.001,
    "explain": "The interval from the start $a = 2$ to 4 has length 2, out of a total length of $10 - 2 = 8$: $2/8 = 0.25$. With $a \\ne 0$, measure from $a$, not from 0."
  },
  {
    "q": "For the 20-minute bus, $P(T = 10)$, the probability of waiting exactly the mean, is...",
    "options": ["0", "0.05", "0.5", "1/20 of 0.5"],
    "answer": 0,
    "explain": "A single value is an interval of width zero, so its probability is 0 whatever the distribution. 0.05 is the density height, not a probability."
  }
]
```
