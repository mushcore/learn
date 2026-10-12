---
title: The exponential distribution: waiting between requests
minutes: 18
---

How long until the next http request reaches your server? The exponential distribution is the continuous model for that kind of waiting time, and one number, the average wait $\beta$, fixes everything about it.

:::info Computed answers
The Unit 5 notes were posted with every answer line blank. Every number in this lesson is computed from the formulas and checked in R; the in-class numbers replace them if they differ.
:::

## The definition has one parameter, β

Slide wording: "The exponential probability distribution is a model for *waiting time in a memory-less system*. A random variable $X$ is said to be *exponentially distributed* if $X \ge 0$ and the pdf for $X$ is"

$$f(x) = \frac{1}{\beta} e^{-x/\beta}$$

"for some parameter $\beta > 0$."

Two facts sit in that formula. $X \ge 0$: a wait cannot be negative, so $f(x) = 0$ to the left of 0. And $\beta$ is the average wait: the mean of the distribution works out to exactly $\beta$ (below). "Memory-less" is the subject of the next lesson.

## β is the mean wait; the rate is 1/β

A problem hands you one of two numbers. "Average wait 2.5 seconds" is $\beta = 2.5$ s directly. "30 customers per hour" is a **rate**, and $\beta$ is its reciprocal in the units you want: $60/30 = 2$ minutes per customer. R's `pexp` and `qexp` take the rate, not $\beta$, so the call is `pexp(4, rate = 1/2.5)`; `pexp(4, 2.5)` silently uses a mean of 0.4 s and returns 0.9999546.

## The density is highest at 0 and decays steadily

```widget
pdf-area
{ "dist": "exponential", "beta": 2.5, "lo": 0, "hi": 4, "showCdf": true, "title": "Exponential, β = 2.5 s: drag the bounds; the right panel is F(x) = 1 − e^(−x/β)" }
```

$f(0) = 1/\beta$ is the highest point of the curve: the shortest waits are the most likely, and the density falls by the same factor $e^{-1}$ every $\beta$ units. The distribution is right-skewed with its mode at 0 and a tail that never reaches zero, which is why long waits are rare but never impossible. A larger $\beta$ starts the curve lower (at $1/\beta$) and stretches it to the right.

## F(x) = 1 − e^(−x/β)

Slide wording: "In general, if $X$ is an exponential random variable with pdf $f(x) = \frac{1}{\beta} e^{-x/\beta}$ then the cumulative probability density function is"

$$F(x) = P(X \le x) = 1 - e^{-x/\beta}$$

It is the integral of $f$ from 0 to $x$: the antiderivative of $\frac{1}{\beta} e^{-t/\beta}$ is $-e^{-t/\beta}$, so $F(x) = -e^{-x/\beta} - (-e^{0}) = 1 - e^{-x/\beta}$. That is the only integral this unit needs, because every exponential probability is a difference of $F$ values:

| Question | Formula |
|---|---|
| $P(X \le x)$ | $1 - e^{-x/\beta}$ |
| $P(X > x)$ | $e^{-x/\beta}$ (complement; no "1 −" needed) |
| $P(a \le X \le b)$ | $F(b) - F(a) = e^{-a/\beta} - e^{-b/\beta}$ |

Because $X$ is continuous, $P(X < x)$ and $P(X \le x)$ are the same number.

## μ = β and σ = β

Slide wording: $\mu = ∫_0^{+\infty} x \cdot f(x)\,dx = \beta$ and $\sigma^2 = ∫_0^{+\infty} (x - \mu)^2 \cdot f(x)\,dx = \beta^2$.

So $\sigma = \beta$: for an exponential variable the standard deviation equals the mean. Given the mean, you have the standard deviation without any further work.

## Web server: the average wait is 2.5 s

Slide wording: "The amount of time $X$ that your web server waits in between http requests can be reasonably modelled as an exponential variable. Suppose the average wait time is 2.5 seconds."

**(a) The pdf for $X$.** $\beta = 2.5$, so $1/\beta = 0.4$ and $x/2.5 = 0.4x$:

$$f(x) = \frac{1}{2.5} e^{-x/2.5} = 0.4\,e^{-0.4x}, \quad x \ge 0$$

**(b) $P(X \le 4)$.** Compute it before reading on.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: $P(X \\le 4)$? (4 decimals)", "type": "numeric", "answer": 0.7981, "tolerance": 0.0005, "explain": "$F(4) = 1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$." }
]
```

$$P(X \le 4) = ∫_0^{4} 0.4\,e^{-0.4x}\,dx = 1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$$

On the calculator: $4 \div 2.5 = 1.6$, change sign, $e^x$, then $1 -$. About 80 % of gaps between requests are 4 s or shorter; the other 20 % is $P(X > 4) = e^{-1.6} = 0.2019$.

**(c) The standard deviation of $X$.** $\sigma = \beta = 2.5$ s.

**(d) The cumulative function.** $F(x) = 1 - e^{-x/2.5}$, equivalently $1 - e^{-0.4x}$, for $x \ge 0$. Part (e), the 95th percentile, is in the next lesson.

```r
beta <- 2.5
pexp(4, rate = 1/beta)        # (b) P(X <= 4)
1 - pexp(4, rate = 1/beta)    # P(X > 4)
dexp(0, rate = 1/beta)        # f(0) = 1/beta, the height at zero
```

```text
[1] 0.7981035
[1] 0.2018965
[1] 0.4
```

```widget
exp-wait
{ "beta": 2.5, "x": 4, "lo": 1, "hi": 3, "title": "Web server, β = 2.5 s: slide x and read P(X ≤ x) and P(X > x); μ = σ = 2.5 are marked" }
```

```quiz
[
  {
    "q": "The mean wait is 2.5 s. Which R line gives $P(X \\le 4)$?",
    "options": ["`pexp(4, 2.5)`", "`pexp(2.5, 4)`", "`pexp(4, rate = 0.4)`", "`dexp(4, rate = 0.4)`"],
    "answer": 2,
    "explain": "R's second argument is the rate $1/\\beta = 0.4$, not the mean. `pexp(4, 2.5)` uses a mean of 0.4 s and returns 0.9999546; `dexp` is the density height, not an area."
  },
  {
    "q": "Web server, $\\beta = 2.5$ s: $P(X \\le 1)$, the chance the next request arrives within 1 s? (4 decimals)",
    "type": "numeric",
    "answer": 0.3297,
    "tolerance": 0.0005,
    "explain": "$1 - e^{-1/2.5} = 1 - e^{-0.4} = 1 - 0.6703 = 0.3297$."
  },
  {
    "q": "For an exponential random variable the standard deviation equals the mean.",
    "type": "tf",
    "answer": true,
    "explain": "$\\mu = \\beta$ and $\\sigma^2 = \\beta^2$, so $\\sigma = \\beta$. A mean of 2.5 s is a standard deviation of 2.5 s."
  },
  {
    "q": "A teller sees 30 customers per hour. The $\\beta$ of the service time, in minutes?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0.01,
    "explain": "30 per hour is a rate; $\\beta$ is the average time per customer: $60/30 = 2$ minutes. The rate in R would be 0.5 per minute."
  },
  {
    "q": "For $\\beta = 2.5$, the height of the density at $x = 0$, $f(0)$, is...",
    "options": ["0", "0.4", "1", "2.5"],
    "answer": 1,
    "explain": "$f(0) = \\frac{1}{\\beta} e^{0} = 1/\\beta = 0.4$, the highest point of the curve. Heights are not probabilities; the area under the whole curve is 1."
  },
  {
    "q": "Web server, $\\beta = 2.5$ s: $P(X > 5)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.1353,
    "tolerance": 0.0005,
    "explain": "$P(X > x) = e^{-x/\\beta} = e^{-5/2.5} = e^{-2} = 0.1353$. No '1 −' for an upper tail when you start from $e^{-x/\\beta}$."
  },
  {
    "q": "Which is the pdf of an exponential variable with mean $\\beta = 4$?",
    "options": ["$f(x) = 0.25\\,e^{-0.25x}$, $x \\ge 0$", "$f(x) = 4\\,e^{-4x}$, $x \\ge 0$", "$f(x) = 1 - e^{-x/4}$", "$f(x) = 0.25\\,e^{-4x}$, $x \\ge 0$"],
    "answer": 0,
    "explain": "$\\frac{1}{\\beta} e^{-x/\\beta}$ with $\\beta = 4$: $1/\\beta = 0.25$ appears both as the leading factor and in the exponent. $1 - e^{-x/4}$ is $F(x)$, the cdf."
  },
  {
    "q": "Web server, $\\beta = 2.5$ s: $P(1 \\le X \\le 3)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.3691,
    "tolerance": 0.0005,
    "explain": "$F(3) - F(1) = e^{-1/2.5} - e^{-3/2.5} = e^{-0.4} - e^{-1.2} = 0.6703 - 0.3012 = 0.3691$."
  },
  {
    "q": "If $\\beta$ is doubled, the density curve...",
    "options": ["starts higher at 0 and decays faster", "keeps the same height at 0 but shifts right", "becomes symmetric about $\\beta$", "starts lower at 0 (height $1/\\beta$) and decays more slowly"],
    "answer": 3,
    "explain": "The height at 0 is $1/\\beta$, so it halves; the tail stretches because long waits become more likely. The mode stays at 0: an exponential curve is never symmetric."
  }
]
```
