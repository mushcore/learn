---
title: The normal distribution: shape, μ and σ
minutes: 15
---

Unit 1 used the bell curve as a picture behind the empirical rule and Z-scores. This lesson makes it a distribution: a density with a formula, two parameters, and a shape you can read $\mu$ and $\sigma$ off by eye.

## The most important distribution

Slide wording: "The most important continuous distribution in probability and statistics is the *Normal Distribution*." It fits heights, IQ scores, measurement errors and channel noise, and later in the course the averages of samples from any distribution.

## Three properties

The notes list three:

- **Bell shaped**
- **Symmetric about $\mu$**
- **Distance from center to "inflection point" is $\sigma$**

The inflection point is where the curve stops bending downward and starts bending outward, on the way down from the peak toward the tail. Each side of the bell has one, and it sits exactly one standard deviation from the centre. So on any drawn normal curve you can read $\mu$ at the peak and $\sigma$ as the distance from the peak to the point where the slope is steepest.

## The pdf

$$f(x) = \frac{e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma}\right)^2}}{\sigma\sqrt{2\pi}}$$

Recognise it; never integrate it. Two things are worth reading from it. The exponent is $-\frac{1}{2}Z^2$ with $Z = \frac{x - \mu}{\sigma}$, the Unit 1 Z-score, so the shape depends on $x$ only through its distance from $\mu$ in units of $\sigma$. At $x = \mu$ the exponent is 0 and $e^0 = 1$, so the peak height is $\frac{1}{\sigma\sqrt{2\pi}}$: a smaller $\sigma$ gives a taller peak. For $\sigma = 1$ the peak is $\frac{1}{\sqrt{2\pi}} = 0.3989$, the green curve's 0.4 in the figure.

## The four curves in the figure

The figure plots $x$ from $-5$ to $5$ with the legend giving $\mu$ and $\sigma^2$, the variance, not $\sigma$:

| Curve | $\mu$ | $\sigma^2$ | $\sigma$ | Peak height |
|---|---|---|---|---|
| red, tall and narrow | 0 | 0.2 | 0.447 | 0.892 |
| green | 0 | 1.0 | 1 | 0.399 |
| blue, flat and wide | 0 | 5.0 | 2.236 | 0.178 |
| magenta, shifted left | $-2$ | 0.5 | 0.707 | 0.564 |

The red, green and blue curves share the centre 0 and differ only in spread. The magenta curve is centred at $-2$ and has its own spread, $\sigma^2 = 0.5$, between the red and green ones, so its peak 0.564 sits between theirs. Every one of them has total area 1, which is why the wide blue curve must be low.

## What μ and σ do

The notes' four rules:

- If $\mu$ increases, then the distribution shifts to the right.
- If $\mu$ decreases, then the distribution shifts to the left.
- If $\sigma$ increases, then the distribution becomes *wider* and *shorter*.
- If $\sigma$ decreases, then the distribution becomes *taller* and *narrower*.

$\mu$ moves the curve without changing its shape; $\sigma$ changes the shape without moving the centre. Width and height move together because the area is fixed at 1.

## The four curves, one at a time

```widget
normal-curve
{ "mu": 0, "sigma": 1, "x": 1, "title": "The p. 78 figure: the four curves, with μ and σ adjustable", "presets": { "σ² = 0.2": [0, 0.447, 0], "σ² = 1": [0, 1, 0], "σ² = 5": [0, 2.236, 0], "μ = −2, σ² = 0.5": [-2, 0.707, -2] } }
```

A new $\mu$ shifts the curve; a new $\sigma$ flattens or sharpens it. "Shade ±1σ" shows the 68 % band of Unit 1 as an area.

## Why areas come from a table

Slide wording: "It is challenging to compute areas from the pdf $f(x)$ since there is no elementary antiderivative of $e^{-x^2}$. Instead, we use a table of values or a suitable calculator."

Property 3 of the last lesson still holds, $P(a \le X \le b) = F(b) - F(a)$, but there is no formula for $F$. Its values were computed numerically once and printed as the Z table; R's `pnorm` computes the same numbers. The empirical rule is three entries of that table: the areas inside $\mu \pm \sigma$, $\mu \pm 2\sigma$ and $\mu \pm 3\sigma$ are 0.6827, 0.9545 and 0.9973, rounded in Unit 1 to 68 %, 95 % and 99.7 %.

## Bolt lengths with μ = 50 mm and σ² = 6.25

Bolt lengths are normal with μ = 50 mm and variance σ² = 6.25 mm², the way the p. 78 legend labels its curves.

```quiz
[
  {"q": "σ = ? (mm)", "type": "numeric", "answer": 2.5, "tolerance": 0.006, "unit": "mm", "explain": "The legend-style label is the variance; σ = √6.25 = 2.5 mm."},
  {"q": "The inflection point above the mean is at x = ? (mm)", "type": "numeric", "answer": 52.5, "tolerance": 0.006, "unit": "mm", "explain": "The inflection points sit one σ from the centre: 50 ± 2.5, so 47.5 mm and 52.5 mm."},
  {"q": "Write the peak height f(50) = 1/(σ√(2π)) with the number in, no spaces, using `sqrt(...)`, `pi` and `*`.", "type": "text", "answer": ["1/(2.5*sqrt(2*pi))", "1/(2.5*sqrt(2pi))", "1/(sqrt(2*pi)*2.5)", "1/2.5/sqrt(2*pi)"], "explain": "At x = μ the exponent is 0 and e⁰ = 1, leaving 1/(σ√(2π)) = 1/(2.5 × 2.5066) = 0.1596."},
  {"q": "Peak height f(50) = ? (4 decimals)", "type": "numeric", "answer": 0.1596, "tolerance": 6e-05, "explain": "1/(2.5√(2π)) = 1/6.2666 = 0.1596, lower than the σ = 1 peak 0.3989 because the wider curve must keep area 1."},
  {"type": "shade", "q": "Shade the bolts longer than the upper inflection point, 52.5 mm. What percentage is it?", "mu": 50, "sigma": 2.5, "answer": 15.87, "tolerance": 1, "region": "above", "lo": 1, "explain": "52.5 is μ + σ. The band μ ± σ holds 68.27 %, leaving 31.73 % in two equal tails: 15.87 % above 52.5 mm."},
  {"type": "fill", "q": "Complete the R line for the area between the two inflection points.", "code": "pnorm(52.5, 50, ___) - pnorm(47.5, 50, 2.5)", "answer": ["2.5"], "explain": "pnorm takes σ, not the variance: pnorm(52.5, 50, 2.5) − pnorm(47.5, 50, 2.5) = 0.6826895, the 68 % of the empirical rule. Typing 6.25 would make the curve far too wide."}
]
```

```quiz
[
  {
    "q": "If $\\sigma$ increases and $\\mu$ stays the same, the normal curve becomes...",
    "options": ["taller and narrower", "wider and shorter", "shifted to the right", "asymmetric"],
    "answer": 1,
    "explain": "The notes' rule: larger $\\sigma$ means wider and shorter. The area stays 1, so a wider curve must be lower; the centre does not move."
  },
  {
    "q": "Where are the inflection points of a normal curve?",
    "options": ["at $\\mu$", "at $\\mu \\pm \\sigma$", "at $\\mu \\pm 2\\sigma$", "where the curve meets the axis"],
    "answer": 1,
    "explain": "Distance from centre to inflection point is $\\sigma$: the curve changes from bending down to bending out exactly one standard deviation from the mean, on each side. The curve never meets the axis."
  },
  {
    "type": "shade",
    "q": "IQ scores are normal with $\\mu = 100$, $\\sigma = 15$. Shade the region between the two inflection points, $\\mu - \\sigma$ to $\\mu + \\sigma$.",
    "mu": 100, "sigma": 15, "answer": 68.27, "tolerance": 1, "lo": -1, "hi": 1,
    "explain": "The inflection points sit at $85$ and $115$, one $\\sigma$ each side. The area between them is 0.6827, the 68 % of the empirical rule."
  },
  {
    "q": "In the p. 78 figure, which curve is the tallest?",
    "options": ["$\\mu = 0$, $\\sigma^2 = 5.0$", "$\\mu = 0$, $\\sigma^2 = 1.0$", "$\\mu = -2$, $\\sigma^2 = 0.5$", "$\\mu = 0$, $\\sigma^2 = 0.2$"],
    "answer": 3,
    "explain": "Smallest variance, smallest $\\sigma = 0.447$, tallest peak: $1/(0.447\\sqrt{2\\pi}) = 0.89$. The $\\sigma^2 = 5$ curve is the flattest at 0.18."
  },
  {
    "q": "The magenta curve has $\\sigma^2 = 0.5$. What is its standard deviation $\\sigma$? (3 decimals)",
    "type": "numeric",
    "answer": 0.707,
    "tolerance": 0.002,
    "explain": "The legend gives the variance; $\\sigma = \\sqrt{0.5} = 0.707$. Reading $\\sigma^2$ as $\\sigma$ is the notation trap of the next lessons, where $N(100, 15^2)$ means $\\sigma = 15$."
  },
  {
    "q": "A normal curve is symmetric about its mean $\\mu$.",
    "type": "tf",
    "answer": true,
    "explain": "Property 2 in the notes. It is why a left tail at $-z$ equals a right tail at $+z$, and why half the area, 0.5, lies on each side of $\\mu$."
  },
  {
    "q": "If $\\mu$ increases while $\\sigma$ stays the same, the curve...",
    "options": ["shifts to the right with the same shape", "becomes taller", "becomes wider", "shifts to the left"],
    "answer": 0,
    "explain": "$\\mu$ only locates the centre. Shape, height and width belong to $\\sigma$ alone."
  },
  {
    "q": "For $\\sigma = 1$ the peak of the normal pdf, at $x = \\mu$, is $1/\\sqrt{2\\pi}$. What is that value? (4 decimals)",
    "type": "numeric",
    "answer": 0.3989,
    "tolerance": 0.0005,
    "explain": "At $x = \\mu$ the exponent is 0 and $e^0 = 1$, leaving $1/(\\sigma\\sqrt{2\\pi}) = 1/2.5066 = 0.3989$, the green curve's peak in the figure. A density height, not a probability."
  },
  {
    "type": "shade",
    "q": "Heights are normal with $\\mu = 175$ cm, $\\sigma = 7$ cm. Shade everything below the mean. What percentage is that?",
    "mu": 175, "sigma": 7, "answer": 50, "tolerance": 1, "region": "below", "hi": 0,
    "explain": "Symmetry about $\\mu$ puts half the area, 50 %, on each side of 175 cm. This is the 0.5000 that the Z table shows at $z = 0.00$."
  }
]
```
