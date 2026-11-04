---
title: "Poisson on paper: events per interval, with λ rescaled to the question's interval"
minutes: 12
---
<!-- facts: none; no bank entry gives a measured count per time interval -->
Some counts have no fixed number of tries: calls in an hour, flaws in a cable, failures in a year. You know only the average rate, and the Poisson formula turns that rate into a probability.

## A Poisson count: events in a stretch of time or space

Events happen one at a time, independently, at a steady average rate. You watch a fixed stretch: an hour, five metres, a year. X counts the events in it.

X can be 0, 1, 2, and so on with no upper limit. That is the difference from the binomial, which stops at n.

## A help desk at 2 tickets an hour

A help desk gets 2 tickets an hour on average. What is the chance of a quiet hour with none?

The answer uses the number $e = 2.718\ldots$, the $e^x$ key on the calculator. For a mean of 2, no tickets has probability $e^{-2}$.

$$P(0) = e^{-2} = \mathbf{0.1353}$$

Exactly one ticket is twice that, because the mean is 2.

$$P(1) = 2 \times e^{-2} = 2 \times 0.135335 = \mathbf{0.2707}$$

## The formula, with λ named

$$P(x) = \dfrac{\lambda^x e^{-\lambda}}{x!}$$

For the help desk, each symbol is:

- $\lambda = 2$, the mean number of tickets in the interval asked about, one hour.
- $x$, the number of tickets asked about.
- $x!$ is $x \times (x-1) \times \dots \times 1$, with $0! = 1$.

$$P(1) = \dfrac{2^1 \, e^{-2}}{1!} = \dfrac{2 \times 0.135335}{1} = \mathbf{0.2707}$$

The mean of a Poisson count is λ itself, and its standard deviation is $\sqrt{\lambda}$. For the help desk, $\mu = 2$ and $\sigma = \sqrt{2} = 1.41$.

## λ must match the question's interval

The question often gives a rate for one interval and asks about another. Multiply the rate by the length of the interval asked about, in the same units.

$$\lambda = \text{rate} \times \text{interval}$$

Lab 7 Task 8 has cables with 0.75 flaws per metre, and asks about five metres.

$$\lambda = 0.75 \times 5 = \mathbf{3.75}$$

The lab's table then starts with P(0) = 0.023518. The help desk over 90 minutes is 1.5 hours, so $\lambda = 2 \times 1.5 = 3$.

```diagram
{"type": "flow", "title": "Rescale λ before the formula", "nodes": [{"id": "r", "label": "Rate", "sub": "0.75 flaws per metre"}, {"id": "t", "label": "× interval asked", "sub": "5 metres"}, {"id": "l", "label": "λ for this question", "sub": "0.75 × 5 = 3.75"}, {"id": "f", "label": "Formula", "sub": "P(x) with λ = 3.75"}], "edges": [{"from": "r", "to": "t"}, {"from": "t", "to": "l"}, {"from": "l", "to": "f"}], "hi": ["l"], "caption": "The help desk the same way: 2 per hour × 1.5 hours = 3."}
```

## Separate intervals multiply; one longer interval rescales

Counts in intervals that do not overlap are independent. "At most 34 in each of two years" is the one-year answer squared.

"At most 68 over two years" is one interval, twice as long. It uses $\lambda = 2 \times 34 = 68$ in a single `ppois`.

## Lab 7 Task 10: 34 transformer failures a year

A city averages 34 transformer failures a year, so $\lambda = 34$ for one year. The lab's eight parts are exactly 34, at most 30, fewer than 30, more than 38, at least 38, 30 to 40 inclusive, at most 34 in each of two years, and at most 68 over two years.

```r
lambda <- 34
dpois(34, lambda)
ppois(30, lambda)
ppois(30-1, lambda)
1 - ppois(38, lambda)
1 - ppois(37, lambda)
ppois(40,lambda) - ppois(29, lambda)
ppois(34, lambda)^2
ppois(68, lambda*2)
```

```text
[1] 0.06825
[1] 0.2804
[1] 0.2235
[1] 0.2166
[1] 0.2681
[1] 0.6429
[1] 0.2975
[1] 0.5322
```

:::info R syntax
| Code | What it does |
|---|---|
| `lambda <- 34` | `<-` stores 34 under the name `lambda`. |
| `dpois(34, lambda)` | Slots `dpois(x, lambda)`: x = 34, lambda = 34. P(X = 34). |
| `ppois(30, lambda)` | Slots `ppois(q, lambda)`: P(X ≤ 30). |
| `30-1` | R works out 29 first: fewer than 30 stops at 29. |
| `1 - ppois(38, lambda)`, `1 - ppois(37, lambda)` | The complement: more than 38, and at least 38. |
| `ppois(40,lambda) - ppois(29, lambda)` | Up to 40 minus up to 29 leaves 30 to 40. The missing space changes nothing. |
| `^2` | Squares the one-year answer: two separate years. |
| `lambda*2` | `*` multiplies: λ for the two-year interval, 68. |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- `lambda <- 34`: "Store under the name lambda (`lambda <-`) 34."
- the `dpois` and `ppois` lines: "Exactly 34 (`dpois(34, lambda)`); at most 30 (`ppois(30, lambda)`); at most 30 minus 1 (`ppois(30-1, lambda)`); one minus (`1 -`) at most 38; one minus at most 37; at most 40 minus (`-`) at most 29."
- `ppois(34, lambda)^2`: "At most 34 in a year (`ppois(34, lambda)`), squared (`^2`)."
- `ppois(68, lambda*2)`: "At most 68 (`ppois(68, …)`) with mean lambda times two (`lambda*2`)."

**Right to left**, the order R runs it

- `lambda <- 34`: "Take 34 and store it as lambda (`<-`)."
- the `dpois` and `ppois` lines: "Look up lambda, work out any arithmetic inside (`30-1`), compute each probability (`dpois`, `ppois`), then subtract (`1 -`, `-`) last."
- `ppois(34, lambda)^2`: "Compute P(X ≤ 34) (`ppois`), then square it (`^2`)."
- `ppois(68, lambda*2)`: "Double lambda (`lambda*2`), then compute P(X ≤ 68) with that mean (`ppois`)."
:::

The last two differ because "each of two years" needs both years at 34 or fewer, while "over two years" also allows 40 then 28. The R side is drilled in [dbinom, pbinom, dpois, ppois](#/math3042-q7/r-binomial-poisson). The long versions are [Poisson: counts per interval](#/math3042-u4/poisson) and [Review 6: Poisson plug-in](#/math3042-midterm/review-poisson-plugin).

## A COMP inbox, a cable line, a SkyTrain station and a lottery kiosk

```quiz
[
  {"q": "A COMP course inbox gets 4 emails an hour. P(exactly 2 in 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1839, "tolerance": 0.0001, "explain": "Let X = the number of emails in 15 minutes. Poisson, rescaled: $$\\lambda = 4 \\times \\dfrac{15}{60} = 1$$ $$P(2) = \\dfrac{1^2 \\, e^{-1}}{2!} = \\dfrac{0.367879}{2} = \\mathbf{0.1839}$$"},
  {"q": "A factory line's cable has 0.3 flaws per metre. P(at least one flaw in 4 metres)? (4 decimals)", "type": "numeric", "answer": 0.6988, "tolerance": 0.0001, "explain": "Let X = the number of flaws in 4 metres. $$\\lambda = 0.3 \\times 4 = 1.2$$ At least one is the complement of none: $$P(X \\ge 1) = 1 - P(0) = 1 - e^{-1.2} = 1 - 0.301194 = \\mathbf{0.6988}$$"},
  {"q": "The same inbox, 4 emails an hour. P(exactly 1 email in a 15-minute span and exactly 1 in the next 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1353, "tolerance": 0.0001, "explain": "Each 15-minute span has $\\lambda = 4 \\times \\frac{15}{60} = 1$. $$P(1) = \\dfrac{1^1 \\, e^{-1}}{1!} = 0.367879$$ The spans do not overlap, so they are independent. Multiply: $$0.367879 \\times 0.367879 = \\mathbf{0.1353}$$"},
  {"q": "A SkyTrain station logs 3 delays a week. P(at most 2 delays in 2 weeks)? (4 decimals)", "type": "numeric", "answer": 0.0620, "tolerance": 0.0001, "explain": "Let X = the number of delays in 2 weeks. One interval, twice as long: $$\\lambda = 3 \\times 2 = 6, \\quad e^{-6} = 0.002479$$ $$P(X \\le 2) = e^{-6}\\left(1 + 6 + \\dfrac{6^2}{2!}\\right) = 0.002479 \\times 25 = \\mathbf{0.0620}$$"},
  {"q": "A lottery kiosk sells 0.5 winning tickets a day. P(exactly 3 winners in a 7-day week)? (4 decimals)", "type": "numeric", "answer": 0.2158, "tolerance": 0.0001, "explain": "Let X = the number of winning tickets in 7 days. $$\\lambda = 0.5 \\times 7 = 3.5$$ $$P(3) = \\dfrac{3.5^3 \\, e^{-3.5}}{3!} = \\dfrac{42.875 \\times 0.030197}{6} = \\mathbf{0.2158}$$"}
]
```

## Remember

- Poisson counts events in a fixed interval at a known average rate; there is no fixed n.
- $\lambda = \text{rate} \times \text{interval}$, in the same units, before anything else.
- $P(x) = \dfrac{\lambda^x e^{-\lambda}}{x!}$, and $P(0) = e^{-\lambda}$.
- At least one is $1 - e^{-\lambda}$.
- Separate intervals multiply; one longer interval rescales λ.
- $\mu = \lambda$ and $\sigma = \sqrt{\lambda}$.
- In R, `dpois(x, lambda)` for exactly and `ppois(q, lambda)` for at most.

:::info R syntax
| Code | What it does |
|---|---|
| `dpois(x, lambda)` | P(X = x): x is the count, lambda is the mean for the interval asked about. |
| `ppois(q, lambda)` | P(X ≤ q): adds P(0) through P(q). |

**Left to right**

- `dpois(x, lambda)`: "The Poisson probability of exactly (`dpois`) x (`x`) with mean lambda (`lambda`)."
- `ppois(q, lambda)`: "The Poisson probability of at most (`ppois`) q (`q`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- `dpois(x, lambda)`: "Take x and lambda, then return P(X = x) (`dpois`)."
- `ppois(q, lambda)`: "Take q and lambda, then add P(0) through P(q) (`ppois`)."
:::
