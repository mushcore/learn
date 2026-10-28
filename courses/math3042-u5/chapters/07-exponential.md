---
title: The exponential distribution: waiting between requests
minutes: 18
---
<!-- facts: none; U4 Poisson has no bank rate, so there is no game waiting time -->

How long until the next http request reaches your server? The exponential distribution is the continuous model for that kind of waiting time, and one number, the average wait $\beta$, fixes everything about it.

## The definition has one parameter, β

Slide wording: "The exponential probability distribution is a model for *waiting time in a memory-less system*. A random variable $X$ is said to be *exponentially distributed* if $X \ge 0$ and the pdf for $X$ is"

$$f(x) = \frac{1}{\beta} e^{-x/\beta}$$

"for some parameter $\beta > 0$."

Two facts sit in that formula. $X \ge 0$: a wait cannot be negative, so $f(x) = 0$ to the left of 0. And $\beta$ is the average wait: the mean of the distribution works out to exactly $\beta$ (below). "Memory-less" is the subject of the next lesson.

## β is the mean wait; the rate is 1/β

A problem hands you one of two numbers. "Average wait 2.5 seconds" is $\beta = 2.5$ s directly. "30 customers per hour" is a **rate**, and $\beta$ is its reciprocal in the units you want: $60/30 = 2$ minutes per customer. R's `pexp` and `qexp` take the rate, not $\beta$, so the call is `pexp(4, rate = 1/2.5)`; `pexp(4, 2.5)` silently uses a mean of 0.4 s and returns 0.9999546.

:::info R syntax
| Code | What it does |
|---|---|
| `pexp(4, rate = 1/2.5)` | The exponential F(x): q = 4, and the named argument `rate` = 1/2.5 = 0.4; `/` divides. |
| `pexp(4, 2.5)` | The unnamed second value fills `rate`, so 2.5 is taken as the rate, not the mean. |

**Left to right**

- `pexp(4, rate = 1/2.5)`: "The exponential area to the left (`pexp`) of 4 (`4`) with rate (`rate =`) one divided by 2.5 (`1/2.5`)."
- `pexp(4, 2.5)`: "The exponential area to the left (`pexp`) of 4 (`4`) with 2.5 (`2.5`) as the rate."

**Right to left**, the order R runs it

- `pexp(4, rate = 1/2.5)`: "Divide one by 2.5 (`1/2.5`), pass it as the rate (`rate =`), then find the area left of 4 (`pexp(4, …)`)."
- `pexp(4, 2.5)`: "Take 2.5 as the rate (`2.5`), then find the area left of 4 (`pexp(4, …)`)."
:::

## The density is highest at 0 and decays steadily

```widget
pdf-area
{ "dist": "exponential", "beta": 2.5, "lo": 0, "hi": 4, "showCdf": true, "title": "Exponential, β = 2.5 s: the area from 0 to 4 on the left, F(x) = 1 − e^(−x/β) on the right" }
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

Slide wording: $\mu = \int_0^{+\infty} x \cdot f(x)\,dx = \beta$ and $\sigma^2 = \int_0^{+\infty} (x - \mu)^2 \cdot f(x)\,dx = \beta^2$.

So $\sigma = \beta$: for an exponential variable the standard deviation equals the mean. Given the mean, you have the standard deviation without any further work.

## Web server: the average wait is 2.5 s

Slide wording: "The amount of time $X$ that your web server waits in between http requests can be reasonably modelled as an exponential variable. Suppose the average wait time is 2.5 seconds."

**(a) The pdf for $X$.** $\beta = 2.5$, so $1/\beta = 0.4$ and $x/2.5 = 0.4x$:

$$f(x) = \frac{1}{2.5} e^{-x/2.5} = 0.4\,e^{-0.4x}, \quad x \ge 0$$

**(b) $P(X \le 4)$.**

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: $P(X \\le 4)$? (4 decimals)", "type": "numeric", "answer": 0.7981, "tolerance": 0.0005, "explain": "$F(4) = 1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$." }
]
```

$$P(X \le 4) = \int_0^{4} 0.4\,e^{-0.4x}\,dx = 1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$$

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

:::info R syntax
| Code | What it does |
|---|---|
| `beta <- 2.5` | `<-` is assignment: stores the mean wait under the name `beta`. |
| `# (b) P(X <= 4)` | `#` starts a comment: R ignores the rest of the line. |
| `pexp(4, rate = 1/beta)` | The exponential F(x): q = 4, and the named argument `rate` = 1/β = 0.4. `/` divides. |
| `1 - pexp(4, rate = 1/beta)` | One minus F(4): the right tail P(X > 4). |
| `dexp(0, rate = 1/beta)` | The density height f(x) at x = 0, not an area. |
| `[1]` | In the output, the position of the first value on each printed line. |

**Left to right**

- `beta <- 2.5`: "Store under the name beta (`beta <-`) the number 2.5 (`2.5`)."
- `pexp(4, rate = 1/beta)`: "The exponential area to the left (`pexp`) of 4 (`4`) with rate (`rate =`) one divided by beta (`1/beta`)."
- `1 - pexp(4, rate = 1/beta)`: "One (`1`) minus (`-`) the exponential area to the left (`pexp`) of 4 (`4`) with rate one over beta (`rate = 1/beta`)."
- `dexp(0, rate = 1/beta)`: "The exponential density height (`dexp`) at 0 (`0`) with rate (`rate =`) one over beta (`1/beta`)."

**Right to left**, the order R runs it

- `beta <- 2.5`: "Take 2.5 (`2.5`) and store it as beta (`beta <-`)."
- `pexp(4, rate = 1/beta)`: "Look up beta (`beta`), divide one by it (`1/beta`), pass that as the rate (`rate =`), then find the area left of 4 (`pexp(4, …)`)."
- `1 - pexp(4, rate = 1/beta)`: "Compute the rate (`1/beta`), find the area left of 4 (`pexp(4, …)`), then take it away from one (`1 -`)."
- `dexp(0, rate = 1/beta)`: "Compute the rate (`1/beta`), then find the density's height at 0 (`dexp(0, …)`)."
:::

```widget
exp-wait
{ "beta": 2.5, "x": 4, "lo": 1, "hi": 3, "title": "Web server, β = 2.5 s: P(X ≤ x) and P(X > x), with μ = σ = 2.5 marked" }
```

### Gaps between requests

Unit 4 counted the same stream: 1 request per 2.5 s is a Poisson count with $\lambda = 24$ per minute. Here each step is one gap between consecutive requests, and the histogram of gap lengths settles onto the density $0.4\,e^{-0.4x}$, with about 80 % of the gaps under 4 s.

```widget
arrivals-play
{ "mode": "gaps" }
```

## Gaps between cars at a toll booth, mean 8 s

The time X between cars arriving at a toll booth is a memoryless waiting time with an average of 8 seconds.

```quiz
[
  {"q": "Name the distribution of X (one word).", "type": "text", "answer": ["exponential", "exponential distribution"], "explain": "A waiting time in a memoryless system: exponential with β = 8 s, f(x) = (1/8)e^(−x/8) for x ≥ 0, and μ = σ = 8 s."},
  {"q": "R's rate for this X = ? (3 decimals, per second)", "type": "numeric", "answer": 0.125, "tolerance": 0.0006, "explain": "rate = 1/β = 1/8 = 0.125 cars per second."},
  {"q": "P(X ≤ 5), the next car within 5 s = ? (4 decimals)", "type": "numeric", "answer": 0.4647, "tolerance": 6e-05, "explain": "F(5) = 1 − e^(−5/8) = 1 − e^(−0.625) = 1 − 0.5353 = 0.4647."},
  {"type": "fill", "q": "Complete the R call for P(X ≤ 5).", "code": "pexp(5, rate = ___)", "answer": ["1/8", "0.125", ".125"], "explain": "pexp takes the rate 1/β, not β: pexp(5, rate = 1/8) = 0.4647386. pexp(5, 8) would describe a mean gap of 1/8 s."},
  {"q": "P(4 ≤ X ≤ 12) = ? (4 decimals)", "type": "numeric", "answer": 0.3834, "tolerance": 6e-05, "explain": "F(12) − F(4) = e^(−4/8) − e^(−12/8) = e^(−0.5) − e^(−1.5) = 0.6065 − 0.2231 = 0.3834."},
  {"q": "Write P(X > 12) from the cdf with the numbers in, no spaces, using `e^(...)`.", "type": "text", "answer": ["e^(-12/8)", "e^(-1.5)", "1-(1-e^(-12/8))", "exp(-12/8)", "exp(-1.5)"], "explain": "P(X > x) = 1 − F(x) = e^(−x/β), so P(X > 12) = e^(−12/8) = e^(−1.5) = 0.2231."}
]
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
    "q": "Web server, $\\beta = 2.5$ s. Write $P(X \\le 4)$ from the cdf with the numbers in, no spaces, using `e^(...)` for the exponential, for example `1-e^(-x/b)`.",
    "type": "text",
    "answer": ["1-e^(-4/2.5)", "1-e^(-1.6)", "1-exp(-4/2.5)", "1-exp(-1.6)", "1−e^(−4/2.5)", "1−e^(−1.6)", "1-e^(-0.4*4)", "1-e^(-0.4·4)"],
    "explain": "$F(x) = 1 - e^{-x/\\beta}$ with $x = 4$, $\\beta = 2.5$: $1 - e^{-4/2.5} = 1 - e^{-1.6} = 0.7981$. Writing $e^{-4/2.5}$ alone is $P(X > 4)$."
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
