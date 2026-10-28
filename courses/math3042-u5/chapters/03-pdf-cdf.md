---
title: Probability density functions and F(x)
minutes: 15
---

Unit 4 described a discrete variable with a table of $P(x)$ values. A continuous variable has no such table, since every $P(x)$ is 0. Its description is a curve, the density $f(x)$, and every probability is an area under it. This lesson names the curve, names its running total $F(x)$, and states the three rules every density obeys.

## Intervals, not points

Slide wording: "If $X$ is a continuous random variable, then we don't specify $P(x)$ for *individual* values of $X$. Instead, we specify the probability that $X$ falls within any given *interval* of values." The notes' example is $P(0 \le X \le 182\text{ cm}) = 0.75$: three quarters of the heights lie at or below 182 cm. The 0.75 is an illustrative number, not an area of the $N(175, 7^2)$ height curve used elsewhere in this unit, which gives $P(X \le 182) = 0.8413$.

## The probability density function

**Definition.** *A probability density function (pdf) for $X$ is a function $f(x)$ where, for any real number $b$,*

$$P(X \le b) = \int_{-\infty}^{b} f(x)\,dx$$

The integral sign means "the area under $f$ from the far left up to $b$". The notes' visualization is a curve with everything to the left of $b$ shaded. You will not evaluate this integral for the normal distribution, where a table or R does it, and for the uniform and exponential distributions the area has a closed form you can write down.

## The cumulative probability function F(x)

**Definition.** *If $f(x)$ is a pdf for $X$, the cumulative probability function $F(x)$ is*

$$F(x) = P(X \le x) = \int_{-\infty}^{x} f(t)\,dt$$

$F(x)$ is the area accumulated so far, moving left to right. It starts at 0 on the far left, climbs, and reaches 1 on the far right. Unit 4's cumulative probabilities $P(X \le x)$ were the same idea as running sums of a table; the R functions with a `p` prefix, `punif`, `pnorm` and `pexp`, all return $F(x)$.

## Three properties of a pdf

The notes list what any pdf must satisfy:

1. **Total area beneath $f(x)$ is equal to 1:** $F(+\infty) = \int_{-\infty}^{+\infty} f(x)\,dx = 1$.
2. **Positivity:** $f(x) \ge 0$ for all $x$.
3. **Probability of an interval:** $P(a \le X \le b) = \int_{a}^{b} f(x)\,dx = F(b) - F(a)$.

Property 3 is the working rule of the whole unit. The area between $a$ and $b$ is the area up to $b$ minus the area up to $a$; so one function $F$ answers every interval question, and a right tail is $P(X > a) = 1 - F(a)$ by property 1.

A sketch fails to be a pdf if it dips below the axis anywhere (property 2) or if its total area is not 1 (property 1). A density may exceed 1 in height, as the uniform on $[0, 0.5]$ does with height 2; only the area is constrained.

## The uniform's F(x) and the bus again

For the uniform on $[a, b]$, the area from $a$ up to $x$ is a rectangle of width $x - a$ and height $\frac{1}{b - a}$:

$$F(x) = \frac{x - a}{b - a} \quad \text{for } a \le x \le b$$

with $F(x) = 0$ below $a$ and $F(x) = 1$ above $b$. For the bus, $F(t) = t/20$, and the three answers of the last lesson are property 3 at work:

- $P(8 \le T \le 11) = F(11) - F(8) = 0.55 - 0.40 = 0.15$
- $P(T > 12) = 1 - F(12) = 1 - 0.60 = 0.40$
- $P(T = 4) = F(4) - F(4) = 0$

```r
F <- function(t) punif(t, 0, 20)
F(11) - F(8)
1 - F(12)
F(4) - F(4)
```

```text
[1] 0.15
[1] 0.4
[1] 0
```

:::info R syntax
| Code | What it does |
|---|---|
| `F <- function(t) punif(t, 0, 20)` | `<-` is assignment. `function(t)` makes a one-argument function; its body, with no braces, is the single call `punif(q = t, min = 0, max = 20)`. |
| `F(11) - F(8)` | Calls `F` twice and subtracts: F(11) − F(8). |
| `1 - F(12)` | The right tail, one minus F(12). |
| `F(4) - F(4)` | A zero-width interval. |
| `[1]` | In the output, the position of the first value on each printed line. |

**Left to right**

- `F <- function(t) punif(t, 0, 20)`: "Store under the name F (`F <-`) a function of t (`function(t)`) that returns the uniform area to the left (`punif`) of t (`t`) on 0 to 20 (`0, 20`)."
- `F(11) - F(8)`: "F at 11 (`F(11)`) minus (`-`) F at 8 (`F(8)`)."
- `1 - F(12)`: "One (`1`) minus (`-`) F at 12 (`F(12)`)."
- `F(4) - F(4)`: "F at 4 (`F(4)`) minus (`-`) F at 4 again (`F(4)`)."

**Right to left**, the order R runs it

- `F <- function(t) punif(t, 0, 20)`: "Build a function that takes t (`function(t)`) and computes `punif(t, 0, 20)`, then store it as F (`F <-`); nothing is computed until F is called."
- `F(11) - F(8)`: "Run F on 11 (`F(11)`), run F on 8 (`F(8)`), then subtract the second from the first (`-`)."
- `1 - F(12)`: "Run F on 12 (`F(12)`), then take it away from one (`1 -`)."
- `F(4) - F(4)`: "Run F on 4 twice (`F(4)`), then subtract (`-`)."
:::

## The density and its cumulative curve side by side

```widget
pdf-area
{ "dist": "uniform", "a": 0, "b": 20, "lo": 8, "hi": 11, "showCdf": true, "title": "Bus wait: f(t) on the left, F(t) on the right" }
```

The shaded rectangle under $f$ on the left is the same number as the rise of $F$ between the two bounds on the right: $F(11) - F(8)$.

### F(t) accumulating as the bound moves right

Each step moves the bound one minute to the right. The shaded area under $f$ and the height of $F$ on the right are the same number at every stop, so $F$ climbs in a straight line from 0 at $t = 0$ to 1 at $t = 20$; the exponential setting shows $F$ rising fast and then flattening.

```widget
cdf-sweep-play
{}
```

## Mean and variance as integrals

$$\mu = \int_{-\infty}^{+\infty} x \cdot f(x)\,dx, \qquad \sigma^2 = \int_{-\infty}^{+\infty} (x - \mu)^2 f(x)\,dx$$

These are Unit 4's $\mu = \sum x \cdot P(x)$ and $\sigma^2 = \sum (x - \mu)^2 P(x)$ with the sum replaced by an integral and $P(x)$ by $f(x)\,dx$. You will not evaluate them; each distribution's result is given to you: $\frac{a + b}{2}$ and $\frac{(b - a)^2}{12}$ for the uniform, the parameters $\mu$ and $\sigma^2$ themselves for the normal, and $\beta$ and $\beta^2$ for the exponential.

## A density of x²/9 on [0, 3]

X has density f(x) = x²/9 for 0 ≤ x ≤ 3 and 0 elsewhere, so its cumulative function is F(x) = x³/27 on [0, 3].

```quiz
[
  {"q": "Total area: F(3) = ?", "type": "numeric", "answer": 1, "tolerance": 0.0001, "explain": "F(3) = 3³/27 = 27/27 = 1. Together with f(x) = x²/9 ≥ 0 this makes f a valid pdf."},
  {"q": "P(X ≤ 2) = ? (4 decimals)", "type": "numeric", "answer": 0.2963, "tolerance": 6e-05, "explain": "P(X ≤ 2) is F(2) = 2³/27 = 8/27 = 0.2963."},
  {"q": "Write P(1 ≤ X ≤ 2) as F(2) − F(1) with the numbers in, no spaces, in the form `8/27-1/27`-style fractions.", "type": "text", "answer": ["8/27-1/27", "2^3/27-1^3/27", "(8-1)/27", "8/27-1^3/27"], "explain": "F(2) − F(1) = 2³/27 − 1³/27 = 8/27 − 1/27 = 7/27 = 0.2593."},
  {"q": "P(X > 1.5) = ? (4 decimals)", "type": "numeric", "answer": 0.875, "tolerance": 6e-05, "explain": "1 − F(1.5) = 1 − 1.5³/27 = 1 − 3.375/27 = 1 − 0.125 = 0.8750."},
  {"q": "μ = ∫ x f(x) dx over [0, 3] = ? (2 decimals)", "type": "numeric", "answer": 2.25, "tolerance": 0.006, "explain": "∫₀³ x · x²/9 dx = [x⁴/36]₀³ = 81/36 = 2.25. The mean sits right of the midpoint 1.5 because the density rises toward 3."},
  {"type": "fill", "q": "Y has density f(y) = 1/5 on [4, 9]. Complete the R line for P(5 ≤ Y ≤ 8) = F(8) − F(5).", "code": "punif(8, 4, 9) - punif(___, 4, 9)", "answer": ["5"], "explain": "A flat density on [4, 9] is uniform with a = 4, b = 9. F(8) − F(5) = 4/5 − 1/5 = 0.6; punif returns F, so the second call is at the lower bound 5."}
]
```

```quiz
[
  {
    "q": "Which of these sketched functions can be a probability density function? Select all that apply.",
    "options": ["a curve that is negative between 2 and 3 and has total area 1", "a rectangle of height 0.5 on $[0, 2]$", "a triangle with total area 2", "a rectangle of height 2 on $[0, 0.5]$"],
    "answer": [1, 3],
    "explain": "A pdf needs $f(x) \\ge 0$ everywhere and total area 1. Height 0.5 on a width of 2 has area 1; height 2 on a width of 0.5 also has area 1, and a density may exceed 1. The negative dip breaks positivity; area 2 breaks property 1."
  },
  {
    "q": "$T$ is uniform on $[0, 20]$ with $F(t) = t/20$. What is $P(6 \\le T \\le 14)$?",
    "type": "numeric",
    "answer": 0.4,
    "tolerance": 0.001,
    "explain": "Property 3: $F(14) - F(6) = 0.70 - 0.30 = 0.40$, the same as the interval length 8 over 20."
  },
  {
    "q": "Write $P(8 \\le T \\le 11)$ in terms of the cumulative function $F$, with no spaces (for example `F(b)-F(a)` with the numbers in).",
    "type": "text",
    "answer": ["F(11)-F(8)", "F(11)−F(8)"],
    "explain": "Property 3: the area between 8 and 11 is the area up to 11 minus the area up to 8, $F(11) - F(8) = 0.55 - 0.40 = 0.15$. Writing $F(8) - F(11)$ gives a negative number."
  },
  {
    "q": "A variable has cumulative function $F(x) = x^2/25$ for $0 \\le x \\le 5$. What is $P(2 \\le X \\le 4)$?",
    "type": "numeric",
    "answer": 0.48,
    "tolerance": 0.001,
    "explain": "$F(4) - F(2) = 16/25 - 4/25 = 12/25 = 0.48$. Any $F$ works the same way: the area between two values is the difference of the cumulative values, no integration needed."
  },
  {
    "q": "Same $F(x) = x^2/25$ on $[0, 5]$. What is $P(X \\le 3)$?",
    "type": "numeric",
    "answer": 0.36,
    "tolerance": 0.001,
    "explain": "$F(3) = 9/25 = 0.36$: $F$ is already $P(X \\le x)$, nothing to subtract."
  },
  {
    "q": "For every pdf, $F(+\\infty) = 1$.",
    "type": "tf",
    "answer": true,
    "explain": "Property 1: the total area beneath $f(x)$ is 1, and $F(+\\infty)$ is the area from the far left to the far right. That is why a right tail is $1 - F(a)$."
  },
  {
    "q": "$F(x)$ stands for...",
    "options": ["$P(X \\le x)$, the area under $f$ up to $x$", "the height of the density at $x$", "$P(X = x)$", "the mean of $X$ up to $x$"],
    "answer": 0,
    "explain": "The cumulative probability function is the area accumulated from the far left to $x$. It runs from 0 to 1 and never decreases."
  },
  {
    "q": "A probability density function can take values greater than 1.",
    "type": "tf",
    "answer": true,
    "explain": "Only the area is constrained to 1. A uniform on $[0, 0.5]$ has height 2; a tall narrow normal has a peak above 1. Height is density, and probability is height times width."
  },
  {
    "q": "Which R function returns $F(x)$ for a uniform variable on $[a, b]$?",
    "options": ["`dunif(x, a, b)`", "`runif(x, a, b)`", "`qunif(x, a, b)`", "`punif(x, a, b)`"],
    "answer": 3,
    "explain": "The `p` prefix is the cumulative probability $P(X \\le x)$. `d` is the density height, `q` turns a probability back into an $x$ (a percentile), `r` draws random values."
  },
  {
    "q": "$X$ has density $f$ and cumulative $F$. $P(X > a)$ equals...",
    "options": ["$F(a)$", "$1 - F(a)$", "$f(a)$", "$F(a) - F(-\\infty)$"],
    "answer": 1,
    "explain": "The area to the right of $a$ is the whole area, 1, minus the area up to $a$. Because $P(X = a) = 0$, this is also $P(X \\ge a)$."
  }
]
```
