---
title: Percentiles and the memoryless property: the bank teller
minutes: 20
---

Two questions remain for an exponential variable: which wait is longer than 95 % of waits (a percentile, read backwards from $F$), and what the time already spent tells you about the time still to come (nothing, which is what memoryless means).

:::info Computed answers
The notes leave every answer line blank. The numbers here are computed and checked in R; the in-class numbers replace them if they differ.
:::

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

```widget
exp-wait
{ "beta": 2.5, "x": 7.49, "p": 0.95, "title": "Web server: the percentile slider; x_p = −β ln(1 − p), so p = 0.95 lands at 7.49 s" }
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

## Memoryless: the time already spent does not change the time to come

Divide the two tail areas and the elapsed time cancels:

$$P(X > s + t \mid X > s) = \frac{P(X > s + t)}{P(X > s)} = \frac{e^{-(s+t)/\beta}}{e^{-s/\beta}} = e^{-t/\beta} = P(X > t)$$

Having waited $s$ already, the chance of waiting at least $t$ more is the chance a fresh wait exceeds $t$. The exponential is the only continuous distribution with this property, which is why the notes introduce it as the model for "waiting time in a memory-less system". For the teller: the chance a customer who has taken 1 minute needs more than 3 minutes in total is $P(X > 2) = e^{-1} = 0.3679$, the same as a new customer needing more than 2.

```widget
exp-wait
{ "beta": 2, "x": 2.5, "lo": 1.5, "hi": 2.5, "p": 0.75, "elapsed": 1, "title": "Bank teller, β = 2 min: the memoryless toggle redraws the remaining-time density after 1 minute; it coincides with the original" }
```

:::quiz Memoryless cuts both ways
A customer who has already taken 5 minutes is no closer to finishing than one who just sat down. The intuition "they must be nearly done" is the gambler's fallacy in continuous time, and the quiz can test it with a true/false.
:::

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
