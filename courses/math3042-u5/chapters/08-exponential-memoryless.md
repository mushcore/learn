---
title: Percentiles and the memoryless property: the bank teller
minutes: 20
---
<!-- facts: none; U4 Poisson has no bank rate, so there is no game waiting time -->

Two questions remain for an exponential variable: which wait is longer than 95 % of waits (a percentile, read backwards from $F$), and what the time already spent tells you about the time still to come (nothing, which is what memoryless means).

## A percentile is F(x) = p solved for x

The $p$-th percentile $x_p$ is the value with $F(x_p) = p$. Solve once, in general:

$$1 - e^{-x/\beta} = p \quad \Rightarrow \quad e^{-x/\beta} = 1 - p \quad \Rightarrow \quad -\frac{x}{\beta} = \ln(1 - p) \quad \Rightarrow \quad x_p = -\beta \ln(1 - p)$$

The logarithm is of $1 - p$, the upper-tail probability, not of $p$. For the 95th percentile that is $\ln 0.05$; for the 75th, $\ln 0.25$. The result is positive because $\ln$ of a number below 1 is negative.

**Web server (e): use $F(x)$ to determine the 95th percentile of $X$**, $\beta = 2.5$ s.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: the 95th percentile of $X$, in seconds? (2 decimals)", "type": "numeric", "answer": 7.49, "tolerance": 0.01, "explain": "$1 - e^{-x/2.5} = 0.95 \\Rightarrow e^{-x/2.5} = 0.05 \\Rightarrow x = -2.5 \\ln 0.05 = 2.5 \\times 2.9957 = 7.49$ s." }
]
```

$$1 - e^{-x/2.5} = 0.95 \Rightarrow e^{-x/2.5} = 0.05 \Rightarrow x = -2.5 \ln 0.05 = 2.5 \times 2.9957 = 7.49 \text{ s}$$

Only 5 % of gaps between requests are longer than 7.49 s, three times the mean: the long tail is what the percentile measures. R's `qexp` is the inverse of `pexp` and takes the same rate:

```r
qexp(0.95, rate = 1/2.5)    # 95th percentile
-2.5 * log(0.05)            # the same by hand; log() in R is ln
```

```text
[1] 7.489331
[1] 7.489331
```

:::info R syntax
| Code | What it does |
|---|---|
| `# 95th percentile` | `#` starts a comment: R ignores the rest of the line. |
| `qexp(0.95, rate = 1/2.5)` | The inverse of `pexp`: p = 0.95, and the named `rate` = 1/β. Returns the x with 0.95 to its left. |
| `-2.5 * log(0.05)` | `log()` is the natural log, ln; `*` multiplies; the leading `-` makes the result positive. |
| `[1]` | In the output, the position of the first value on each printed line. |

**Left to right**

- `qexp(0.95, rate = 1/2.5)`: "The value with probability 0.95 (`0.95`) below it (`qexp`) for rate (`rate =`) one divided by 2.5 (`1/2.5`)."
- `-2.5 * log(0.05)`: "Minus 2.5 (`-2.5`) times (`*`) the natural log (`log`) of 0.05 (`0.05`)."

**Right to left**, the order R runs it

- `qexp(0.95, rate = 1/2.5)`: "Divide one by 2.5 (`1/2.5`), pass it as the rate (`rate =`), then find the x with 0.95 below it (`qexp(0.95, …)`)."
- `-2.5 * log(0.05)`: "Take the natural log of 0.05 (`log(0.05)`), then multiply it by minus 2.5 (`-2.5 *`)."
:::

```widget
exp-wait
{ "beta": 2.5, "x": 7.49, "p": 0.95, "mode": "percentile", "title": "Web server: the percentile slider; x_p = −β ln(1 − p), so p = 0.95 lands at 7.49 s" }
```

## Bank teller: 30 customers per hour

Slide wording: "A bank teller sees an average of 30 customers per hour. Assume that the time it takes to service customers is an exponential random variable."

The 30 is a rate. Work in minutes: $\beta = 60/30 = 2$ minutes per customer, so $F(x) = 1 - e^{-x/2}$ and the R rate is 0.5 per minute.

**(a) Between 1.5 and 2.5 minutes.**

```quiz
[
  { "q": "Teller, 30 customers per hour: $P(1.5 \\le X \\le 2.5)$, the probability a customer takes between 1.5 and 2.5 minutes? (4 decimals)", "type": "numeric", "answer": 0.1859, "tolerance": 0.0005, "explain": "$\\beta = 2$: $F(2.5) - F(1.5) = e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = 0.1859$." }
]
```

$$P(1.5 \le X \le 2.5) = F(2.5) - F(1.5) = (1 - e^{-1.25}) - (1 - e^{-0.75}) = e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = 0.1859$$

**(b) Given that the teller has already spent 1 minute with a customer, the probability that it takes between 2.5 and 3.5 minutes (in total).** This is Unit 3's conditional probability, $P(A \mid B) = P(A \cap B)/P(B)$, with areas in place of counts. The condition is $X > 1$; the event $2.5 \le X \le 3.5$ lies entirely inside it, so the intersection is the event itself:

$$P(2.5 \le X \le 3.5 \mid X > 1) = \frac{P(2.5 \le X \le 3.5)}{P(X > 1)} = \frac{e^{-1.25} - e^{-1.75}}{e^{-0.5}} = \frac{0.2865 - 0.1738}{0.6065} = \frac{0.1127}{0.6065} = 0.1859$$

The same 0.1859 as (a), and not by coincidence. "Between 2.5 and 3.5 minutes in total, given 1 minute already" is "between 1.5 and 2.5 more minutes", and the remaining time has exactly the distribution a fresh customer's time has.

**(c) The 75th percentile of $X$.**

$$1 - e^{-x/2} = 0.75 \Rightarrow e^{-x/2} = 0.25 \Rightarrow x = -2 \ln 0.25 = 2 \times 1.3863 = 2.77 \text{ minutes}$$

Three quarters of customers are served within 2.77 minutes.

```r
rate <- 30/60                                        # 0.5 per minute, beta = 2
pexp(2.5, rate) - pexp(1.5, rate)                    # (a)
(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))   # (b) conditional
qexp(0.75, rate)                                     # (c)
```

```text
[1] 0.1858618
[1] 0.1858618
[1] 2.772589
```

:::info R syntax
| Code | What it does |
|---|---|
| `rate <- 30/60` | `<-` is assignment: stores 0.5 per minute under the name `rate`. |
| `pexp(2.5, rate) - pexp(1.5, rate)` | Positionally q, then rate (the second formal is `rate`, so naming it is optional). F(2.5) − F(1.5). |
| `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))` | Brackets group: the interval's area divided by P(X > 1), the conditional probability. |
| `qexp(0.75, rate)` | p = 0.75 with the stored rate: the 75th percentile. |

**Left to right**

- `rate <- 30/60`: "Store under the name rate (`rate <-`) 30 divided by 60 (`30/60`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "The exponential area to the left (`pexp`) of 2.5 (`2.5`) at the stored rate (`rate`), minus (`-`) the area to the left (`pexp`) of 1.5 (`1.5`)."
- `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))`: "The area left of 3.5 (`pexp(3.5, rate)`) minus (`-`) the area left of 2.5 (`pexp(2.5, rate)`), all divided by (`/`) one minus (`1 -`) the area left of 1 (`pexp(1, rate)`)."
- `qexp(0.75, rate)`: "The value with probability 0.75 (`0.75`) below it (`qexp`) at the stored rate (`rate`)."

**Right to left**, the order R runs it

- `rate <- 30/60`: "Divide 30 by 60 (`30/60`), then store the result as rate (`rate <-`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "Look up the rate (`rate`), find the area left of 2.5 (`pexp(2.5, rate)`) and left of 1.5 (`pexp(1.5, rate)`), then subtract (`-`)."
- `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))`: "Find the area between 2.5 and 3.5 inside the first brackets, find one minus the area left of 1 inside the second (`1 - pexp(1, rate)`), then divide the first by the second (`/`)."
- `qexp(0.75, rate)`: "Look up the rate (`rate`), then find the x with 0.75 below it (`qexp(0.75, …)`)."
:::

## Memoryless: the time already spent does not change the time to come

Divide the two tail areas and the elapsed time cancels:

$$P(X > s + t \mid X > s) = \frac{P(X > s + t)}{P(X > s)} = \frac{e^{-(s+t)/\beta}}{e^{-s/\beta}} = e^{-t/\beta} = P(X > t)$$

Having waited $s$ already, the chance of waiting at least $t$ more is the chance a fresh wait exceeds $t$. The exponential is the only continuous distribution with this property, which is why the notes introduce it as the model for "waiting time in a memory-less system". For the teller: the chance a customer who has taken 1 minute needs more than 3 minutes in total is $P(X > 2) = e^{-1} = 0.3679$, the same as a new customer needing more than 2.

```widget
exp-wait
{ "beta": 2, "x": 2.5, "lo": 1.5, "hi": 2.5, "p": 0.75, "elapsed": 1, "mode": "memoryless", "title": "Bank teller, β = 2 min: the memoryless toggle redraws the remaining-time density after 1 minute; it coincides with the original" }
```

### The elapsed time cancelling

The tail beyond $s = 1$ is cut off, rescaled so its area is 1, and slid back by $s$: it lands on the original density, so the darker area is $P(X > 2) = 0.3679$.

```widget
memoryless-play
{ "beta": 2, "s": 1, "t": 2 }
```

:::quiz Memoryless cuts both ways
A customer who has already taken 5 minutes is no closer to finishing than one who just sat down. The intuition "they must be nearly done" is the gambler's fallacy in continuous time.
:::

## A cooling fan with a mean life of 5 years

A cooling fan's lifetime X is exponential with mean β = 5 years.

```quiz
[
  {"q": "Write the 80th-percentile set-up x_p = −β ln(1 − p) with the numbers in, no spaces, using `ln(...)` and `*`.", "type": "text", "answer": ["-5*ln(1-0.8)", "-5*ln(0.2)", "-5*ln(1-0.80)", "-5*ln(.2)", "5*ln(5)"], "explain": "Solve F(x) = 0.8: 1 − e^(−x/5) = 0.8 ⇒ e^(−x/5) = 0.2 ⇒ x = −5 ln(0.2) = 8.0472."},
  {"q": "The 80th percentile of the lifetime = ? (2 decimals, years)", "type": "numeric", "answer": 8.05, "tolerance": 0.006, "unit": "years", "explain": "x = −5 ln(1 − 0.8) = −5 ln 0.2 = 5 × 1.6094 = 8.05 years."},
  {"q": "The median lifetime (50th percentile) = ? (2 decimals, years)", "type": "numeric", "answer": 3.47, "tolerance": 0.006, "unit": "years", "explain": "x = −5 ln(0.5) = 5 ln 2 = 5 × 0.6931 = 3.47 years, below the mean 5 because the density is right-skewed."},
  {"q": "A fan has run for 3 years. P(X > 7 | X > 3), it lasts past 7 years in total = ? (4 decimals)", "type": "numeric", "answer": 0.4493, "tolerance": 6e-05, "explain": "P(X > 7)/P(X > 3) = e^(−7/5)/e^(−3/5) = e^(−4/5) = 0.4493. The 3 years cancel: only the 4 further years count."},
  {"type": "fill", "q": "Complete the R line for P(X > 7 | X > 3).", "code": "(1 - pexp(7, 1/5)) / (1 - pexp(___, 1/5))", "answer": ["3"], "explain": "The conditional is P(X > 7) over P(X > 3), each a 1 − pexp: the denominator is at the elapsed 3 years. It prints 0.4493290."},
  {"q": "For this fan, P(X > 7 | X > 3) equals P(X > 4) for a brand-new fan.", "type": "tf", "answer": true, "explain": "Memoryless: P(X > 4) = e^(−4/5) = 0.4493, the same number. A used fan's remaining life has the same distribution as a new fan's life."}
]
```

```quiz
[
  {
    "q": "The $p$-th percentile of an exponential variable with mean $\\beta$ is...",
    "options": ["$-\\beta \\ln p$", "$\\beta \\ln(1 - p)$", "$-\\beta \\ln(1 - p)$", "$1 - e^{-p/\\beta}$"],
    "answer": 2,
    "explain": "From $1 - e^{-x/\\beta} = p$: $e^{-x/\\beta} = 1 - p$, so $x = -\\beta \\ln(1 - p)$. The log is of the upper-tail probability $1 - p$."
  },
  {
    "q": "Teller, $\\beta = 2$ min: the 90th percentile of the service time, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 4.61,
    "tolerance": 0.01,
    "explain": "$-2 \\ln(1 - 0.90) = -2 \\ln 0.10 = 2 \\times 2.3026 = 4.61$ min."
  },
  {
    "q": "Teller, $\\beta = 2$ min. Write the 90th-percentile set-up $x_p = -\\beta \\ln(1 - p)$ with the numbers in, no spaces, using `ln(...)` and `*`.",
    "type": "text",
    "answer": ["-2*ln(1-0.90)", "-2*ln(1-0.9)", "-2*ln(0.10)", "-2*ln(0.1)", "−2*ln(1−0.90)", "−2*ln(1−0.9)", "−2*ln(0.10)", "−2*ln(0.1)", "-2ln(0.1)", "-2ln(1-0.9)"],
    "explain": "$x_{0.90} = -2 \\ln(1 - 0.90) = -2 \\ln 0.10 = 4.61$ min. The log is of the upper tail $1 - p = 0.10$; $\\ln 0.90$ would give 0.21 min."
  },
  {
    "q": "A customer has been with the teller for 1 minute. The probability the service takes more than 3 minutes in total, $P(X > 3 \\mid X > 1)$ with $\\beta = 2$? (4 decimals)",
    "type": "numeric",
    "answer": 0.3679,
    "tolerance": 0.0005,
    "explain": "Memoryless: it equals $P(X > 2) = e^{-2/2} = e^{-1} = 0.3679$. Directly: $e^{-1.5}/e^{-0.5} = 0.2231/0.6065 = 0.3679$."
  },
  {
    "q": "An exponential variable's standard deviation equals its mean.",
    "type": "tf",
    "answer": true,
    "explain": "$\\sigma^2 = \\beta^2$, so $\\sigma = \\beta = \\mu$. For the teller both are 2 minutes."
  },
  {
    "q": "Why is the teller's answer to (b) equal to the answer to (a)?",
    "options": ["because 1.5 + 1 = 2.5 and 2.5 + 1 = 3.5, so the intervals have the same length", "because the exponential distribution is memoryless: given 1 minute has passed, the remaining time has the same distribution as a fresh service time, and 2.5 to 3.5 in total is 1.5 to 2.5 more", "because the conditional probability of any interval equals its unconditional probability", "it is a rounding coincidence"],
    "answer": 1,
    "explain": "Equal lengths alone would not do it: for a non-memoryless distribution the two answers differ. The ratio $e^{-(s+t)/\\beta} / e^{-s/\\beta} = e^{-t/\\beta}$ removes the elapsed $s$."
  },
  {
    "q": "Web server, $\\beta = 2.5$ s: the median wait (50th percentile), in seconds? (2 decimals)",
    "type": "numeric",
    "answer": 1.73,
    "tolerance": 0.01,
    "explain": "$-2.5 \\ln 0.5 = 2.5 \\times 0.6931 = 1.73$ s, below the mean of 2.5 because the distribution is right-skewed."
  },
  {
    "q": "In R, the 75th percentile of the teller's service time ($\\beta = 2$ min) is...",
    "options": ["`qexp(0.75, 2)`", "`qexp(0.75, rate = 0.5)`", "`pexp(0.75, rate = 0.5)`", "`qexp(0.25, rate = 0.5)`"],
    "answer": 1,
    "explain": "q for a quantile, rate $= 1/\\beta = 0.5$ per minute. `qexp(0.75, 2)` uses rate 2 (mean 0.5 min) and returns 0.69."
  },
  {
    "q": "A light bulb's lifetime is exponential. After 1000 hours of use, the probability it lasts at least another 500 hours is...",
    "options": ["smaller than for a new bulb, because it is older", "zero", "larger, because it has proved reliable", "the same as the probability a new bulb lasts at least 500 hours"],
    "answer": 3,
    "explain": "Memoryless: $P(X > s + t \\mid X > s) = P(X > t)$ for every elapsed $s$. Age carries no information under this model."
  }
]
```
