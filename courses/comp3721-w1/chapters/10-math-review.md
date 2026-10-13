---
title: Logs, transformations, phase & units
minutes: 14
---

Lab 1's Math Review (A01, A02) refreshes the pieces Lecture 02 leans on: logarithms for signal levels, function transformations for phase shift, and degrees and radians for phase. These are calculator questions.

## Logarithm

A **logarithm** is a mathematical function that represents the exponent or power to which a given number (called the **base**) must be raised to obtain another number. The slide's friendlier version:

> How many of one number do we multiply to get another number?

- **Example 1:** How many 10s do we multiply to get 10,000? Answer: **4**, so $\log_{10} 10000 = 4$ ("log base-10 of 10,000 is 4").
- **Example 2:** How many 2s do we multiply to get 32? Answer: **5**, so $\log_{2} 32 = 5$ ("log base-2 of 32 is 5").

The general rule:

$$\log_{b} a = c \quad \text{means} \quad b^{c} = a$$

**If the base is not specified, it implies base 10.** E.g. $\log 100 = 2$, and $\log 8 = 3$ is false.

### Getting $\log_{2}$ on a calculator

Most calculators have only $\log$ (base 10) and $\ln$, so use the change-of-base rule:

$$\log_{2} x = \frac{\log x}{\log 2}$$

For example, $\log_{2} 1000 = \dfrac{\log 1000}{\log 2} = \dfrac{3}{0.3010} = 9.97$. Either $\log$ or $\ln$ works, as long as top and bottom use the same one.

### Powers of 2 worth memorizing

| $L$ | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 |
|---|---|---|---|---|---|---|---|---|
| $\log_{2} L$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |

## Ceiling and floor

Lecture 02 uses these when the number of bits comes out fractional; [digital signals](#/comp3721-w2/digital-signals) works its 11-level example.

- **Ceiling function** ⌈ ⌉: rounds the number **up** to the nearest integer greater than or equal to the original value. E.g. ⌈π⌉ = ⌈3.1416⌉ = **4**.
- **Floor function** ⌊ ⌋: rounds the number **down** to the nearest integer less than or equal to the original value. E.g. ⌊π⌋ = ⌊3.1416⌋ = **3**.

For signal levels you always take the ceiling: the number of bits must be an integer, and rounding down would leave some levels without a bit pattern.

## Function transformations

A **transformation** of a function means the curve representing the graph moves left, right, up, or down, or it expands or compresses, or it reflects. The A01 table, verbatim:

| Transformation | Rule | Result |
|---|---|---|
| Translation, horizontal | $y = f(x + c)$ | moves **left** if $c > 0$; moves **right** if $c < 0$ |
| Translation, vertical | $y = f(x) + c$ | moves **up** if $c > 0$; moves **down** if $c < 0$ |
| Dilation, horizontal | $y = f(cx)$ | **stretches** when $0 < c < 1$; **shrinks** when $c > 1$ |
| Dilation, vertical | $y = c f(x)$ | **stretches** when $c > 1$; **shrinks** when $0 < c < 1$ |
| Reflection about x-axis | $y = -f(x)$ | the x-axis acts as a mirror |
| Reflection about y-axis | $y = f(-x)$ | the y-axis acts as a mirror |

The horizontal rules run the "wrong" way: $f(x + 3)$ moves the graph **left**, and $f(2x)$ **shrinks** it horizontally, so twice as many cycles fit in the same width. Vertical changes behave as you expect.

### Applied to a sine wave

Lecture 02 writes a sine wave as $s(t) = A \sin(\omega t + \phi)$ with $\omega = 2\pi f$:

- $A$ multiplies the function: a **vertical dilation**. Bigger $A$, taller wave (the peak amplitude).
- $\omega$ multiplies $t$ inside: a **horizontal dilation**. Bigger $\omega$ (bigger $f$), more cycles per second (shorter period).
- $+\phi$ inside: a **horizontal translation**. Since $\sin(\omega t + \phi) = \sin(\omega(t + \phi/\omega))$, the wave moves **left** by $\phi/\omega$ seconds when $\phi > 0$; $\sin(\omega t - \phi)$ moves it **right** by $\phi/\omega$. This is Lecture 02's "Horizontal shifting (phase shift)" slide.

```widget
sine-wave
{ "A": 1, "f": 1, "phase": 0, "title": "The three transformations on s(t) = A sin(2πft + φ)", "presets": { "parent: sin t (A = 1, f = 1)": [1, 1, 0], "vertical dilation A = 3": [3, 1, 0], "horizontal dilation f = 4": [1, 4, 0], "translation φ = 90°": [1, 1, 90] } }
```

With $f = 1$ Hz, $\phi = 90°$ moves the wave left by a quarter of its 1 s period, 0.25 s.

## Degrees and radians

Phase is measured in degrees or radians. One full cycle is a full turn around the unit circle:

$$360° = 2\pi \text{ rad}$$

so $1° = \dfrac{2\pi}{360}$ rad and $1 \text{ rad} = \dfrac{360}{2\pi}°$ ($\approx 57.3°$).

| Degrees | 0° | 90° | 180° | 270° | 360° |
|---|---|---|---|---|---|
| Radians | 0 | $\pi/2$ | $\pi$ | $3\pi/2$ | $2\pi$ |
| Fraction of a cycle | 0 | 1/4 | 1/2 | 3/4 | 1 |

The A02 handout draws one cycle of a sine wave with the phase marked from 0° to 360° (0 to $2\pi$) beside the unit circle with the same angles. **One trip around the circle is one cycle of the wave**, so a fraction of a cycle is the same fraction of 360° or of $2\pi$.

For example, a wave offset by $1/8$ of a cycle has phase $\dfrac{1}{8} \times 360° = 45°$, and $45° \times \dfrac{2\pi}{360°} = \dfrac{\pi}{4} = 0.785$ rad.

Set your calculator to the mode the question uses: $\sin(90)$ in radian mode gives 0.894, not 1.

The SI prefixes for period and frequency (ms ↔ kHz, μs ↔ MHz, ns ↔ GHz) and the scientific-notation steps are in [the sine-wave lesson](#/comp3721-w2/sine-wave).

```quiz
[
  {
    "q": "$\\log_{2} 32 = $ ?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "How many 2s multiply to 32? $2 \\times 2 \\times 2 \\times 2 \\times 2 = 32$, so five. $\\log_{2} 32 = 5$."
  },
  {
    "q": "$\\log 10000 = $ ? (no base written)",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "No base means base 10. $10^{4} = 10000$, so $\\log_{10} 10000 = 4$."
  },
  {
    "q": "If no base is written on a logarithm, the base is assumed to be 2.",
    "type": "tf",
    "answer": false,
    "explain": "A logarithm with no base written implies base 10, e.g. $\\log 100 = 2$. Base 2 must be written explicitly."
  },
  {
    "q": "Compute $\\log_{2} 11$ on a calculator (2 decimals).",
    "type": "numeric",
    "answer": 3.46,
    "tolerance": 0.01,
    "explain": "$\\log_{2} 11 = \\log 11 / \\log 2 = 1.0414 / 0.3010 = 3.46$. Since $2^{3} = 8 < 11 < 16 = 2^{4}$, the answer must land between 3 and 4."
  },
  {
    "q": "What is ⌈3.46⌉ (the ceiling of 3.46)?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "The ceiling rounds up to the nearest integer greater than or equal to the value: 4. The floor ⌊3.46⌋ would be 3."
  },
  {
    "q": "The graph of $y = f(x + 2)$ is the graph of $f(x)$ moved...",
    "options": ["2 units to the right", "2 units to the left", "2 units up", "2 units down"],
    "answer": 1,
    "explain": "Horizontal translation $y = f(x + c)$ moves left if $c > 0$. With $c = 2$ the graph moves 2 units left."
  },
  {
    "q": "The graph of $y = 3 f(x)$ is a vertical dilation that _______ the graph of $f(x)$.",
    "options": ["stretches", "shrinks", "reflects", "translates"],
    "answer": 0,
    "explain": "Vertical dilation $y = c f(x)$ stretches when $c > 1$ and shrinks when $0 < c < 1$. For a sine wave this is what a larger peak amplitude $A$ does."
  },
  {
    "q": "Which rule reflects a graph about the x-axis?",
    "options": ["$y = f(-x)$", "$y = -f(x)$", "$y = f(x) - 1$", "$y = f(x - 1)$"],
    "answer": 1,
    "explain": "$y = -f(x)$ flips every y-value, so the x-axis acts as a mirror. $y = f(-x)$ reflects about the y-axis."
  },
  {
    "q": "Convert 40° to radians (3 decimals).",
    "type": "numeric",
    "answer": 0.698,
    "tolerance": 0.002,
    "unit": "rad",
    "explain": "$40° \\times 2\\pi / 360° = 2\\pi / 9 = 0.698$ rad. This is Lecture 02's example of a wave offset by 1/9 of a cycle: $\frac{1}{9} \times 360° = 40°$."
  },
  {
    "q": "A phase of $\\pi/2$ radians is how many degrees?",
    "type": "numeric",
    "answer": 90,
    "tolerance": 0,
    "unit": "°",
    "explain": "$2\\pi$ rad is 360°, so $\\pi/2$ rad is a quarter of that: 90°, one quarter of a cycle."
  }
]
```
