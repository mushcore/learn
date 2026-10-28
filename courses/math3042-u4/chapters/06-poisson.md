---
title: Poisson: counts per interval
minutes: 18
---
<!-- facts: none; no bank entry gives a measured count per time interval, and fixed respawn timers are not Poisson -->

Requests at a web server, jobs at a CPU, bit errors on a line: there is no fixed number of trials and no probability per trial, only a rate. The Poisson distribution gives the probability of $x$ events in an interval from one number, the mean $\lambda$.

## Events that occur randomly throughout a time interval

Slide wording: the Poisson Distribution is *named after the French mathematician Siméon Poisson (1781–1840). This distribution is one of the most important probability distributions in engineering and computer science. It arises whenever we are modelling events that occur randomly throughout a given time interval.* The notes' two examples are both from this program: $X$ = *the number of jobs arriving for service at a CPU per second*, and $X$ = *the number of bits arriving in error at a network node per minute*.

## The assumptions

- $X$ = *the number of occurrences of an event over some interval.*
- *Occurrences happen with uniform probability over the time interval.*
- *Occurrences are independent of each other.*
- *The mean number of occurrences is known:* $\lambda$ = *mean number of occurrences during the time interval.*

There is no $n$ and no $p$. The single parameter $\lambda$ belongs to a specific interval, and it must be the interval the question asks about.

## The formula

*Given the assumptions above, the probability of having $x$ occurrences is*

$$P(X = x) = \frac{\lambda^x}{x!}\,e^{-\lambda}, \qquad x = 0, 1, 2, \ldots$$

*Here $e = 2.71828\ldots$ is Euler's constant from calculus.* $\lambda^x$ is the mean raised to the count, $x!$ is the factorial of the count, and $e^{-\lambda}$ is the same for every $x$ (the calculator's $e^x$ key with a negative argument). The values are unbounded: a Poisson count can be any non-negative integer.

*The mean and variance of $X$ are*

$$\mu = \lambda, \qquad \sigma^2 = \lambda$$

so $\sigma = \sqrt{\lambda}$. One number sets the centre and the spread together.

A small case first, $\lambda = 2$ events per interval:

| $x$ | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| $\frac{2^x}{x!}e^{-2}$ | 0.1353 | 0.2707 | 0.2707 | 0.1804 | 0.0902 |

$e^{-2} = 0.1353$ is $P(0)$; each next bar is the last one times $\lambda/x$. For example $P(3) = \frac{2^3}{3!}e^{-2} = \frac{8}{6} \times 0.1353 = 0.1804$, which is $P(2) \times \frac{2}{3}$.

```widget
poisson-calc
{ "rate": 2, "per": 1, "interval": 1, "x": 3, "op": "eq", "presets": false, "title": "lambda = 2: the bars for x = 0, 1, 2, … and P(3) substituted" }
```

## The web server: rescale λ first

*Suppose a web server gets on average one request every 2 seconds. Assuming requests arrive randomly and independently over time, what is the probability that 20 requests will arrive during a one-minute interval?*

The rate is given per 2 seconds; the question is about one minute. Rescale in three steps:

1. Rate per one unit: 1 request ÷ 2 s = 0.5 per s.
2. Times the interval length in the same unit: 0.5 × 60 s = 30.
3. $\lambda = 30$ for one minute (the demo writes it as `lambda <- 1/2 * 60`).

```diagram
{ "type": "flow", "title": "Rescaling the rate to the interval", "nodes": [
  { "id": "a", "label": "1 per 2 s", "sub": "the given rate" },
  { "id": "b", "label": "0.5 per s", "sub": "rate per unit" },
  { "id": "c", "label": "30 per 60 s", "sub": "λ for one minute" }
], "edges": [ { "from": "a", "to": "b", "label": "÷ 2" }, { "from": "b", "to": "c", "label": "× 60" } ], "hi": ["c"], "caption": "λ belongs to the interval the question asks about: 1 per 2 s is 30 per minute." }
```

The same three steps rescale the tickets, CPU and accident rates later in the unit.

```quiz
[
  {
    "q": "One request every 2 seconds on average. P(exactly 20 requests in one minute) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0134,
    "tolerance": 0.0002,
    "explain": "λ = 60/2 = 30 for a minute; 30^20/20! × e^(−30) = 1.433 × 10¹¹ × 9.358 × 10⁻¹⁴ = 0.0134."
  }
]
```


$$P(X = 20) = \frac{30^{20}}{20!}\,e^{-30} = \frac{3.487 \times 10^{29}}{2.433 \times 10^{18}} \times 9.358 \times 10^{-14} = 1.433 \times 10^{11} \times 9.358 \times 10^{-14} = 0.0134$$

On a calculator, compute $30^{20} \div 20!$ first (it is about $1.4 \times 10^{11}$, well within range), then multiply by $e^{-30}$.

```r
lambda <- 1/2 * 60        # avg requests per minute
lambda^20/factorial(20)*exp(-lambda)
dpois(20, lambda)
```
```text
[1] 0.01341115
[1] 0.01341115
```

:::info R syntax
| Code | What it does |
|---|---|
| `lambda <- 1/2 * 60` | `<-` is assignment. `/` and `*` run left to right, so this is (1/2) × 60, stored in `lambda`. |
| `#` | Starts a comment: R ignores the rest of the line. |
| `lambda^20/factorial(20)*exp(-lambda)` | `^` is a power and runs first; `factorial(20)` is 20!; `exp(-lambda)` is e to the power −λ; `/` and `*` then run left to right. |
| `dpois(20, lambda)` | `dpois(x, lambda)`: x = 20, lambda = the stored mean for one minute. |
| `[1]` | R starts each printed line with the position of its first value; `[1]` means value 1. |

**Left to right**

- `lambda <- 1/2 * 60`: "Store under the name lambda (`lambda <-`) one half (`1/2`) times (`*`) 60."
- `lambda^20/factorial(20)*exp(-lambda)`: "lambda to the power 20 (`lambda^20`) divided by (`/`) 20 factorial (`factorial(20)`) times (`*`) e to the minus lambda (`exp(-lambda)`)."
- `dpois(20, lambda)`: "The Poisson probability (`dpois`) of exactly 20 requests (`x = 20`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- `lambda <- 1/2 * 60`: "Divide 1 by 2 (`1/2`), multiply by 60 (`* 60`), then store it as lambda (`lambda <-`)."
- `lambda^20/factorial(20)*exp(-lambda)`: "Raise lambda to the 20th (`lambda^20`), divide by 20! (`/factorial(20)`), multiply by e to the minus lambda (`*exp(-lambda)`), and print."
- `dpois(20, lambda)`: "Take x = 20 and the mean (`lambda`), compute P(X = 20) (`dpois`), and print."
:::

## 20 or fewer: a cumulative probability

*What is the probability that 20 or fewer requests will arrive in a given minute?* This is $P(X \le 20) = P(0) + P(1) + \cdots + P(20)$, twenty-one terms of the formula. Nobody adds them by hand; `ppois` does:

```r
ppois(20, lambda)
```
```text
[1] 0.03528462
```

:::info R syntax
| Code | What it does |
|---|---|
| `ppois(20, lambda)` | `ppois(q, lambda)`: q = 20, giving P(X ≤ 20); `lambda` is the value stored in the block above. |

**Left to right**

- "The Poisson probability of at most (`ppois`) 20 requests (`q = 20`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- "Look up lambda (`lambda`), add up P(0) through P(20) (`ppois`, `20`), and print."
:::

$P(X \le 20) = 0.0353$, almost three times $P(X = 20)$ alone: the terms for 15 to 19 contribute most of the rest.

## Is 20 requests unusual?

*Is getting 20 requests in a given minute unusual in the statistical sense?* Use the parameters: $\mu = \lambda = 30$, $\sigma = \sqrt{30} = 5.48$.

$$Z = \frac{x - \mu}{\sigma} = \frac{20 - 30}{5.48} = -1.83$$

$|Z| < 2$, so 20 requests is **not unusual**: a quiet minute, but within two standard deviations of the mean. The tail probability agrees: $P(X \le 20) = 0.0353$ is above the 0.025 cutoff Quiz 4 accepted as the alternative test.

```r
mu <- lambda
sig <- sqrt(lambda)
X <- 20
Z <- (X - mu)/sig
Z
```
```text
[1] -1.825742
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- lambda` | Copies the value of `lambda` into `mu`. |
| `sig <- sqrt(lambda)` | `sqrt()` is the square root: σ = √λ. |
| `X <- 20` | Stores the observed count. |
| `Z <- (X - mu)/sig` | The brackets make the subtraction happen first; `/` then divides by `sig`. |
| `Z` | A name alone on a line prints its value. |

**Left to right**

- `mu <- lambda`: "Store under the name mu (`mu <-`) the value of lambda (`lambda`)."
- `sig <- sqrt(lambda)`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of lambda (`lambda`)."
- `X <- 20`: "Store under the name X (`X <-`) the number 20."
- `Z <- (X - mu)/sig`: "Store under the name Z (`Z <-`) X minus mu (`X - mu`) divided by (`/`) sig (`sig`)."
- `Z`: "Show Z (`Z`)."

**Right to left**, the order R runs it

- `mu <- lambda`: "Look up lambda (`lambda`), then store it as mu (`mu <-`)."
- `sig <- sqrt(lambda)`: "Take the square root of lambda (`sqrt`), then store it as sig (`sig <-`)."
- `X <- 20`: "Take 20 and store it as X (`X <-`)."
- `Z <- (X - mu)/sig`: "Subtract mu from X (`X - mu`), divide by sig (`/`), and store it as Z (`Z <-`)."
- `Z`: "Look up Z (`Z`) and print it."
:::

## λ from a rate and an interval

```widget
poisson-calc
{ "rate": 1, "per": 2, "unit": "s", "interval": 60, "x": 20, "op": "eq", "preset": "web server", "title": "The web server: 1 request per 2 s over a 60 s interval gives lambda = 30; P(X = 20) with the formula substituted" }
```

Over a 10 s interval $\lambda$ falls to 5 and the bars shift left. The presets "CPU jobs (4 per second)" and "bit errors (3 per minute)" are the notes' two examples with a rate attached.

### Requests arriving over one minute

The requests land at random times, about one every 2 s, so the count climbs near $t/2$ without matching it exactly. Each finished minute adds its count to the histogram, which builds toward the $\lambda = 30$ bars.

```widget
arrivals-play
{}
```

## The histogram of X: bell-shaped around 30

*Generate the probability histogram for $X$ = the number of web requests in a given minute.*

```r
X.vals <- 0:80
p.vals <- dpois(X.vals, lambda)
barplot(p.vals, names.arg=X.vals, space=0, col="pink",
        xlab="x", ylab="P(x)", main="Requests to a Web Server in One Minute")
round(p.vals[c(20, 25, 30, 35, 40) + 1], 4)
```
```text
[1] 0.0134 0.0511 0.0726 0.0453 0.0139
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- 0:80` | `a:b` is the whole numbers from a to b, here 0 to 80. |
| `p.vals <- dpois(X.vals, lambda)` | x = the whole vector, so one call returns all 81 probabilities. |
| `barplot(p.vals, …)` | One bar per value; `p.vals` fills `height`. |
| `names.arg=X.vals` | The labels under the bars: 0 to 80. |
| `space=0`, `col="pink"` | No gaps between bars, and the bar colour. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title, as strings. |
| `c(20, 25, 30, 35, 40) + 1` | `c()` combines five numbers; `+ 1` adds 1 to each, because slot 1 holds P(0). |
| `p.vals[ … ]` | `[ ]` picks slots by position, counting from 1; a vector of positions returns those five slots. |
| `round(…, 4)` | `round(x, digits)`: the five probabilities to 4 decimals. |

**Left to right**

- `X.vals <- 0:80`: "Store under the name X.vals (`X.vals <-`) the whole numbers 0 to 80 (`0:80`)."
- `p.vals <- dpois(X.vals, lambda)`: "Store under the name p.vals (`p.vals <-`) the Poisson probabilities (`dpois`) of each x in X.vals (`X.vals`) with mean lambda (`lambda`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of p.vals (`p.vals`), labelled 0 to 80 (`names.arg=X.vals`), with no gaps (`space=0`), in pink (`col="pink"`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`)."
- `round(p.vals[c(20, 25, 30, 35, 40) + 1], 4)`: "Round (`round`) to 4 decimals (`4`) the slots of p.vals (`p.vals[ ]`) at 20, 25, 30, 35 and 40 (`c(…)`) plus 1 (`+ 1`)."

**Right to left**, the order R runs it

- `X.vals <- 0:80`: "Make 0 to 80 (`0:80`), then store it as X.vals (`X.vals <-`)."
- `p.vals <- dpois(X.vals, lambda)`: "Compute P(X = x) for every x in X.vals with mean lambda (`dpois`), and store them as p.vals (`p.vals <-`)."
- `barplot(…)`: "Take the heights (`p.vals`), labels (`names.arg=X.vals`), no gaps (`space=0`), colour (`col="pink"`) and text labels (`xlab=`, `ylab=`, `main=`), and draw the bars (`barplot`)."
- `round(p.vals[c(20, 25, 30, 35, 40) + 1], 4)`: "Combine the five counts (`c`), add 1 to each (`+ 1`), pick those slots of p.vals (`p.vals[ ]`), round to 4 decimals (`round`), and print."
:::

The `+ 1` is because `p.vals[1]` is $P(0)$.

Each bar is the previous one times $\lambda/x$ (from the formula), so the bars rise while $x < 30$ and fall once $x > 30$. The peak is at 29 and 30, equal because $P(30)/P(29) = 30/30 = 1$. After it the bars fall a little more slowly than they rose: bell-shaped and slightly right-skewed, with nothing visible past 50. For a large $\lambda$ the Poisson looks like the binomial histograms of the earlier lessons, centred on $\lambda$ with spread $\sqrt{\lambda}$.

:::quiz λ must match the interval in the question
Convert the rate before using it: 3 per hour over 20 minutes is $\lambda = 1$, not 3. And $\sigma$ is $\sqrt{\lambda}$, not $\lambda$.
:::

## Help-desk tickets in a 20-minute window

A help desk receives 18 tickets per hour on average, at random and independently. X = the number of tickets in a 20-minute window.

```quiz
[
  {"q": "Name the distribution of X (one word).", "type": "text", "answer": ["poisson", "poisson distribution"], "explain": "X counts occurrences over an interval, the tickets arrive with uniform probability and independently, and the mean count is known: Poisson."},
  {"q": "λ for the 20-minute window = ?", "type": "numeric", "answer": 6.0, "tolerance": 0.001, "explain": "Rescale the rate to the interval asked: 18 per hour × 20/60 hour = 6 tickets per 20 minutes. Using 18 would answer a question about a whole hour."},
  {"q": "P(X = 4) = ? (4 decimals)", "type": "numeric", "answer": 0.1339, "tolerance": 6e-05, "explain": "λ^x e^(−λ)/x! = 6⁴ e^(−6)/4! = 1296 × 0.002479/24 = 0.1339."},
  {"type": "fill", "q": "Complete the R call for P(X = 4).", "code": "dpois(___, ___)", "answer": ["4", "6"], "explain": "dpois(x, lambda): the count 4, then λ = 6 for the 20-minute window. It returns 0.1338526."},
  {"q": "P(at most 2 tickets) = ? (4 decimals)", "type": "numeric", "answer": 0.062, "tolerance": 6e-05, "explain": "P(0) + P(1) + P(2) = e^(−6)(1 + 6 + 6²/2) = 0.002479 × 25 = 0.0620. In R, ppois(2, 6)."},
  {"q": "Is a window with 12 tickets unusual? Z = ? (2 decimals)", "type": "numeric", "answer": 2.45, "tolerance": 0.01, "explain": "μ = λ = 6 and σ = √λ = √6 = 2.4495, so Z = (12 − 6)/2.4495 = 2.45. Above 2: 12 tickets is unusually high."}
]
```

```quiz
[
  {
    "q": "Calls arrive at 3 per hour on average. For a 20-minute interval, λ = ?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0.001,
    "explain": "Rescale the rate to the interval: 3 per 60 minutes is 3 × 20/60 = 1 per 20 minutes."
  },
  {
    "q": "With λ = 1, P(X = 2)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1839,
    "tolerance": 0.0003,
    "explain": "1^2/2! × e^(−1) = 0.5 × 0.3679 = 0.1839."
  },
  {
    "q": "Write P(X = 20) for the web server (λ = 30 per minute) as the Poisson formula with the numbers substituted. Use ^ for powers, ! for factorial, e^(-30) for the exponential, no spaces.",
    "type": "text",
    "answer": ["30^20/20!*e^(-30)", "30^20*e^(-30)/20!", "(30^20/20!)*e^(-30)", "e^(-30)*30^20/20!", "30^20/20!*e^-30", "30^20*e^-30/20!", "(30^20*e^(-30))/20!", "e^-30*30^20/20!"],
    "explain": "λ^x/x! · e^(−λ) with λ = 30, x = 20: 30²⁰/20! · e^(−30) = 0.0134."
  },
  {
    "q": "A café counts customers per hour, but most arrive in the ten minutes before noon. Which Poisson assumption fails?",
    "options": ["occurrences happen with uniform probability over the time interval", "X counts occurrences over an interval", "the mean number of occurrences is known", "a fixed number of trials n"],
    "answer": 0,
    "explain": "A rush at one moment means the chance of an arrival is not spread evenly over the hour. A fixed n is not a Poisson assumption at all."
  },
  {
    "q": "For a Poisson variable the mean and the variance are equal.",
    "type": "tf",
    "answer": true,
    "explain": "μ = λ and σ² = λ, so σ = √λ: for the web server, 30 and √30 = 5.48."
  },
  {
    "q": "Which R call gives the probability of 20 or fewer requests in a minute when λ = 30?",
    "options": ["`dpois(20, 30)`", "`1 - ppois(20, 30)`", "`dpois(20, 0.5)`", "`ppois(20, 30)`"],
    "answer": 3,
    "explain": "p* is cumulative, P(X ≤ x): ppois(20, 30) = 0.0353. dpois(20, 30) is the single value 0.0134, and 0.5 is the rate per second, not the λ for a minute."
  },
  {
    "q": "Jobs arrive at a CPU at 4 per second. P(no jobs arrive in a given second)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0183,
    "tolerance": 0.0003,
    "explain": "λ = 4, x = 0: 4^0/0! × e^(−4) = e^(−4) = 0.0183. Remember 0! = 1."
  },
  {
    "q": "Bit errors arrive at a node at 3 per minute. P(at most 1 error in a minute)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1991,
    "tolerance": 0.0003,
    "explain": "P(0) + P(1) = e^(−3) + 3e^(−3) = 4 × 0.0498 = 0.1991; ppois(1, 3) in R."
  },
  {
    "q": "A Poisson variable has λ = 25. Its standard deviation is...",
    "options": ["25", "5", "625", "12.5"],
    "answer": 1,
    "explain": "σ² = λ = 25, so σ = √25 = 5."
  },
  {
    "q": "With λ = 25 (σ = 5), the Z-score of x = 36 is? (1 decimal)",
    "type": "numeric",
    "answer": 2.2,
    "tolerance": 0.05,
    "explain": "Z = (36 − 25)/5 = 2.2, beyond 2, so 36 events would be unusually many."
  },
  {
    "q": "A server averages one request every 2 seconds. For a 10-second window, λ = ?",
    "options": ["0.5", "2", "5", "10"],
    "answer": 2,
    "explain": "Half a request per second times 10 seconds: λ = 5. The 0.5 is the per-second rate; the question's interval is 10 s."
  },
  {
    "q": "Which of these is NOT one of the Poisson assumptions?",
    "options": ["a fixed number of trials n", "occurrences are independent of each other", "occurrences happen with uniform probability over the interval", "the mean number of occurrences λ is known"],
    "answer": 0,
    "explain": "A fixed n belongs to the binomial. The Poisson has no trials at all, only a count over an interval with a known mean."
  }
]
```
