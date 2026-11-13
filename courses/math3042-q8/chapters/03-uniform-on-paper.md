---
title: "Uniform on paper: a rectangle of width b − a and height 1/(b − a)"
minutes: 10
---
<!-- facts: none; the notes' bus and Lab 8's bus are the instructor examples, no bank entry is a uniform measurement -->
Some waits are equally likely to land anywhere between two limits. Every question about them on paper is the area of a rectangle.

## Every value between a and b is equally likely

A **uniform distribution** on $[a, b]$ gives every value between a lower limit a and an upper limit b the same chance. The notes call it the simplest continuous distribution. Just like your wait for a bus that comes every 20 minutes when you arrive at a random moment: a 3-minute wait is as likely as a 17-minute one.

**Its picture is a flat rectangle from a to b, with nothing outside it.** Sketch it on paper as a box sitting on the number line, with a and b marked under its corners.

The red line is flat at height 1/(b − a) between a and b, and it lies on the axis, at height 0, everywhere else. The width b − a times that height is 1.

```diagram
{"type": "curve", "title": "Uniform on [a, b]: flat at 1/(b − a), zero outside", "x": [0, 10.5], "xlabel": "X", "ylabel": "prob. density", "curves": [{"dist": "uniform", "a": 2, "b": 8, "tone": "red"}], "ticks": [{"x": 2, "label": "a"}, {"x": 8, "label": "b"}], "heights": [{"x": 9.2, "of": 5, "label": "1/(b − a)"}]}
```

## A download that finishes between 2 and 10 seconds

A file finishes downloading at a random moment between 2 and 10 seconds after you click. The shaded strip is the chance it takes more than 7 seconds.

```widget
pdf-area
{ "dist": "uniform", "a": 2, "b": 10, "lo": 7, "hi": null, "showCdf": false, "title": "Download time X, uniform from 2 to 10 seconds: P(X > 7)" }
```

The rectangle starts at 2, not at 0. Drag the left bound below 2 and the area stops growing: there is no rectangle there to add.

## The rectangle from 2 to 10: height 1/8

The whole area must be 1, and the rectangle is $10 - 2 = 8$ seconds wide. So its height is $1/8 = 0.125$.

- $a = 2$, the shortest possible download time, in seconds.
- $b = 10$, the longest possible time.
- $7$, the time the question asks about: more than 7 seconds.

$$\text{height} = \dfrac{1}{\underbrace{10}_{b} - \underbrace{2}_{a}} = \dfrac{1}{8} = 0.125$$

The strip from 7 to the end at 10 is a rectangle of its own, 3 seconds wide and 0.125 high. Its area is 0.3750.

```diagram
{"type": "curve", "title": "P(X > 7) is the strip from 7 to 10, 0.3750", "x": [0, 12], "xlabel": "X, download time (seconds)", "ylabel": "prob. density", "curves": [{"dist": "uniform", "a": 2, "b": 10, "tone": "red"}], "shade": [{"from": 7, "label": "0.3750", "tone": "green"}], "ticks": [0, 2, 7, 10], "heights": [{"x": 11, "of": 6, "label": "1/8 = 0.125"}]}
```

In numbers:

$$P(X > 7) = \underbrace{(10 - 7)}_{\text{strip width}} \times \underbrace{0.125}_{\text{height}} = \mathbf{0.3750}$$

:::warn The height is 1/(b − a), not 1/b
With $1/10$ as the height, the whole rectangle from 2 to 10 would have area $8 \times 0.1 = 0.8$, not 1. Every answer after it comes out too small.
:::

## The uniform formulas, every symbol named

The formula sheet gives four lines. For the download:

- $a = 2$ and $b = 10$, the two limits.
- $x$, the value the question asks about.
- $c$ and $d$, the two ends of the strip asked about, with $c \le d$.

**The height is $f(x) = \dfrac{1}{b-a}$, and a probability is strip width × height:**

$$P(c \le X \le d) = \dfrac{\underbrace{d - c}_{\text{strip width}}}{\underbrace{b - a}_{\text{whole width}}}$$

For example, a strip half as wide as the rectangle holds half the area.

```diagram
{"type": "flow", "title": "Every uniform probability", "nodes": [{"id": "w", "label": "Strip width", "sub": "d − c, cut at a and b"}, {"id": "h", "label": "× height", "sub": "1/(b − a)"}, {"id": "p", "label": "= probability", "sub": "4 decimals"}], "edges": [{"from": "w", "to": "h"}, {"from": "h", "to": "p"}], "hi": ["p"], "caption": "The notes' bus: (11 − 8) × 1/20 = 0.1500."}
```

**A strip that sticks out past b is cut off at b, and one that starts before a is cut off at a.** Just like measuring a shadow on a table: the part that hangs off the edge does not count. For the download, 6 to 12 seconds:

- $6$ and $12$, the ends asked about.
- $10$, where the rectangle ends, so the strip stops there.

The shaded strip runs from 6 to 10 only. From 10 to 12 the curve lies on the axis, so that part adds no area. The strip's area is 0.5000.

```diagram
{"type": "curve", "title": "P(6 ≤ X ≤ 12) stops at b = 10: 0.5000", "x": [0, 14], "xlabel": "X, download time (seconds)", "curves": [{"dist": "uniform", "a": 2, "b": 10, "tone": "red"}], "shade": [{"from": 6, "to": 10, "label": "0.5000", "tone": "green"}], "lines": [{"x": 12, "full": true, "tone": "dim", "label": "12: no area here", "side": "left"}], "ticks": [2, 6, 10, 12]}
```

$$P(6 \le X \le 12) = \underbrace{(10 - 6)}_{\text{cut off at b = 10}} \times \underbrace{0.125}_{\text{height}} = \mathbf{0.5000}$$

**The area up to x is $F(x) = \dfrac{x-a}{b-a}$.** For example, the chance the download is done within 4 seconds is the strip from 2 to 4, a quarter of the rectangle's width. Its area is 0.2500.

```diagram
{"type": "curve", "title": "F(4) is the area up to 4, 0.2500", "x": [0, 12], "xlabel": "X, download time (seconds)", "curves": [{"dist": "uniform", "a": 2, "b": 10, "tone": "red"}], "shade": [{"to": 4, "label": "0.2500", "tone": "green"}], "ticks": [2, 4, 10]}
```

From the formula:

$$F(4) = \dfrac{\underbrace{4}_{x} - \underbrace{2}_{a}}{\underbrace{10}_{b} - \underbrace{2}_{a}} = \dfrac{2}{8} = \mathbf{0.2500}$$

**The mean is the midpoint, $\mu = \dfrac{a+b}{2}$.** Just like the balance point of a ruler: the middle.

$$\mu = \dfrac{\underbrace{2}_{a} + \underbrace{10}_{b}}{2} = \mathbf{6.00}$$

**The variance is $\sigma^2 = \dfrac{1}{12}(b-a)^2$, and σ is its square root.** The 12 is always 12. The notes find the mean with an integral; the sheet gives both results.

$$\sigma^2 = \dfrac{1}{12}(\underbrace{10}_{b} - \underbrace{2}_{a})^2 = \dfrac{64}{12} = 5.333333$$

$$\sigma = \sqrt{5.333333} = \mathbf{2.31}$$

**A percentile is the value with area p to its left: $x = a + p(b - a)$.** It comes from setting $F(x) = p$ and solving for x. For example, the 30th percentile of the download time:

- $p = 0.30$, the area to the left of the value asked for.

Here the area is given and the cut-off is unknown. The cut-off sits 30 % of the way along the rectangle, at 4.40.

```diagram
{"type": "curve", "title": "The 30th percentile, 4.40, has area 0.30 to its left", "x": [0, 12], "xlabel": "X, download time (seconds)", "curves": [{"dist": "uniform", "a": 2, "b": 10, "tone": "red"}], "shade": [{"to": 4.4, "label": "0.30", "tone": "green"}], "ticks": [2, {"x": 4.4, "label": "4.40"}, 10]}
```

$$x = \underbrace{2}_{a} + \underbrace{0.30}_{p} \times (\underbrace{10}_{b} - \underbrace{2}_{a}) = 2 + 2.4 = \mathbf{4.40}$$

So 30 % of downloads are done within 4.40 seconds.

## The notes' bus and Lab 8's bus

The notes' example is the bus that comes once every 20 minutes, with your wait T uniform from 0 to 20 minutes.

- $a = 0$, the shortest wait.
- $b = 20$, the longest wait.
- $\dfrac{1}{20} = 0.05$, the height.

It asks three things, each a strip of the same rectangle: between 8 and 11 minutes, more than 12 minutes, and exactly 4 minutes. The first strip is 3 wide, the second runs from 12 to the end at 20, and the third is a single line with no width.

```diagram
{"type": "curve", "title": "The three bus questions: 0.1500, 0.40 and 0", "panels": [{"title": "Between 8 and 11", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 8, "to": 11, "label": "0.1500", "tone": "green"}], "ticks": [0, 8, 11, 20]}, {"title": "More than 12", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"from": 12, "label": "0.40", "tone": "green"}], "ticks": [0, 12, 20]}, {"title": "Exactly 4", "x": [-2, 23], "xlabel": "T (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "lines": [{"x": 4, "solid": true, "tone": "green", "label": "area 0"}], "ticks": [0, 4, 20]}]}
```

Between 8 and 11 minutes:

$$P(8 \le T \le 11) = \underbrace{(11 - 8)}_{\text{strip width}} \times \underbrace{\dfrac{1}{20}}_{\text{height}} = \mathbf{0.1500}$$

More than 12 minutes, the strip from 12 to the end at 20:

$$P(T \ge 12) = \underbrace{(20 - 12)}_{\text{strip width}} \times \underbrace{\dfrac{1}{20}}_{\text{height}} = \mathbf{0.40}$$

Exactly 4 minutes is a strip of width 0: $P(T = 4) = \mathbf{0.0000}$. The notes box all three answers, each beside a sketch of the rectangle with the strip shaded.

Lab 8 uses the same bus wait, 0 to 20 minutes, and asks three more things. Less than 6 minutes is the strip from 0 to 6, three tenths of the rectangle.

```diagram
{"type": "curve", "title": "P(X < 6) is the strip from 0 to 6, 0.3000", "x": [-2, 23], "xlabel": "X, the wait (minutes)", "curves": [{"dist": "uniform", "a": 0, "b": 20, "tone": "red"}], "shade": [{"to": 6, "label": "0.3000", "tone": "green"}], "ticks": [0, 6, 20]}
```

$$P(X < 6) = \dfrac{\underbrace{6 - 0}_{\text{strip width}}}{\underbrace{20 - 0}_{\text{whole width}}} = \mathbf{0.3000}$$

The mean and the standard deviation:

$$\mu = \dfrac{\underbrace{0}_{a} + \underbrace{20}_{b}}{2} = \mathbf{10} \qquad \sigma = \dfrac{\underbrace{20 - 0}_{b - a}}{\sqrt{12}} = \mathbf{5.7735}$$

The lab prints σ to 4 decimals; on Part 1 write 5.77. The long version is [the uniform distribution](#/math3042-u5/uniform).

## A help desk callback and a lab printer warming up

A help desk calls you back at a random moment between 5 and 30 minutes after you log a ticket. A lab printer takes a random time between 10 and 40 seconds to warm up.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $f(x) = \dfrac{1}{b-a},\ a \le x \le b$
- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$
- Uniform: $\mu = \dfrac{a+b}{2}$
- Uniform: $\sigma^2 = \dfrac{1}{12}(b-a)^2$

**Not on the sheet, so know it:**

- A probability is strip width × height, with the strip cut off at a and b.
- A single exact value has probability 0.
- σ is the square root of the sheet's σ².
- The percentile with area p to its left is $a + p(b - a)$.
:::

```quiz
[
  {"q": "The help desk callback X is uniform from 5 to 30 minutes. What is $P(20 \\le X \\le 35)$? (4 decimals)", "type": "numeric", "answer": 0.4, "tolerance": 0.0001, "explain": "Let X = the wait for the callback, uniform with $a = 5$ and $b = 30$. The height is $1/(30 - 5) = 1/25 = 0.04$. The strip sticks out past 30, so it is cut off there: $$P(20 \\le X \\le 35) = \\underbrace{(30 - 20)}_{\\text{cut off at b = 30}} \\times \\underbrace{0.04}_{\\text{height}} = \\mathbf{0.4000}$$"},
  {"q": "The same callback, uniform from 5 to 30 minutes. What is the chance you wait more than 24 minutes? (4 decimals)", "type": "numeric", "answer": 0.24, "tolerance": 0.0001, "explain": "The strip runs from 24 to the end at 30: $$P(X > 24) = \\dfrac{\\underbrace{30 - 24}_{\\text{strip width}}}{\\underbrace{30 - 5}_{\\text{whole width}}} = \\dfrac{6}{25} = \\mathbf{0.2400}$$"},
  {"q": "The same callback. What is the chance it comes exactly 15 minutes after you log the ticket? (4 decimals)", "type": "numeric", "answer": 0, "tolerance": 0.0001, "explain": "One exact value is a strip of width 0: $$P(X = 15) = \\underbrace{0}_{\\text{strip width}} \\times \\underbrace{0.04}_{\\text{height}} = \\mathbf{0.0000}$$"},
  {"q": "The printer warm-up X is uniform from 10 to 40 seconds. What is its standard deviation σ, in seconds? (2 decimals)", "type": "numeric", "answer": 8.66, "tolerance": 0.01, "explain": "Let X = the warm-up time, uniform with $a = 10$ and $b = 40$. The mean is the midpoint, $(10 + 40)/2 = 25$ seconds. The variance from the sheet: $$\\sigma^2 = \\dfrac{1}{12}(\\underbrace{40}_{b} - \\underbrace{10}_{a})^2 = \\dfrac{900}{12} = 75$$ σ is its square root: $$\\sigma = \\sqrt{75} = \\mathbf{8.66}$$"},
  {"q": "The same printer, uniform from 10 to 40 seconds. What is the 25th percentile of the warm-up time, in seconds? (2 decimals)", "type": "numeric", "answer": 17.5, "tolerance": 0.01, "explain": "The value with area 0.25 to its left, from $F(x) = 0.25$: $$x = \\underbrace{10}_{a} + \\underbrace{0.25}_{p} \\times (\\underbrace{40}_{b} - \\underbrace{10}_{a}) = 10 + 7.5 = \\mathbf{17.50}$$ A quarter of the way along the rectangle."}
]
```

## Remember

- Uniform on $[a, b]$: **a flat rectangle of width $b - a$ and height $1/(b - a)$.**
- **Probability = strip width × height**, with the strip cut off at a and b.
- The height is $1/(b - a)$, never $1/b$.
- Exactly one value: 0.
- $\mu = (a + b)/2$; $\sigma = (b - a)/\sqrt{12}$.
- Percentile: $x = a + p(b - a)$.
- In R, the notes' answers are `punif(11, 0, 20) - punif(8, 0, 20)` and `1 - punif(12, 0, 20)`.

:::info R syntax
| Code | What it does |
|---|---|
| `punif(11, 0, 20)` | The uniform area to the left of 11: slots `punif(q, min, max)`, so q = 11, min = 0 (a), max = 20 (b). |
| `- punif(8, 0, 20)` | Subtracts the area to the left of 8, leaving the strip from 8 to 11. |
| `1 - punif(12, 0, 20)` | The whole area, 1, minus the area to the left of 12: more than 12 minutes. |

**Left to right**

- `punif(11, 0, 20) - punif(8, 0, 20)`: "The uniform area to the left (`punif`) of 11 on 0 to 20, minus (`-`) the uniform area to the left of 8 on 0 to 20."
- `1 - punif(12, 0, 20)`: "One minus (`1 -`) the uniform area to the left (`punif`) of 12 on 0 to 20."

**Right to left**, the order R runs it

- `punif(11, 0, 20) - punif(8, 0, 20)`: "Compute the area up to 11 (`punif(11, 0, 20)`), compute the area up to 8 (`punif(8, 0, 20)`), then subtract (`-`)."
- `1 - punif(12, 0, 20)`: "Compute the area up to 12 (`punif`), then take it away from 1 (`1 -`)."
:::
