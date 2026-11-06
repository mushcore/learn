---
title: "Poisson on paper: events per interval, with λ rescaled to the question's interval"
minutes: 12
---
<!-- facts: none; no bank entry gives a measured count per time interval -->
Some counts have no fixed number of tries: calls in an hour, flaws in a cable, failures in a year. You know only the average rate, and the Poisson formula turns that rate into a probability.

## A Poisson count: events in a stretch of time or space

Events happen one at a time, independently, at a steady average rate. You watch a fixed stretch: an hour, five metres, a year. **A Poisson count X is the number of events in that stretch.** Just like counting the buses that reach your stop in one hour: nobody fixes a number of tries, you only know the average.

**X can be 0, 1, 2, and so on with no upper limit.** That is the difference from the binomial, which stops at n. For example, a page of an essay can hold 0 typos or 9 typos; nothing caps the count.

## A help desk at 2 tickets an hour

A help desk gets tickets at a steady average rate. What is the chance of a quiet hour with none?

- $\lambda = 2$, the mean number of tickets in one hour.
- $x = 0$, the number of tickets the question asks about.

The answer uses the number $e = 2.718\ldots$, the $e^x$ key on the calculator. Type 2, press the sign key, then $e^x$, or type $e^x$ then −2; the keys are in [Before you start](#/math3042-q7/pre-reading). For a mean of 2, no tickets has probability $e^{-2}$. **No events at all has probability e to the minus mean.** Just like asking how often a whole hour passes with the help desk phone silent.

$$P(0) = \underbrace{e^{-2}}_{\text{e to minus the mean, 2}} = \mathbf{0.1353}$$

Exactly one ticket is twice that, because the mean is 2.

$$P(1) = \underbrace{2}_{\text{mean tickets an hour}} \times \underbrace{e^{-2}}_{\text{P(0), from above}} = 2 \times 0.135335 = \mathbf{0.2707}$$

## The formula, with λ named

$$P(x) = \dfrac{\underbrace{\lambda^x}_{\text{mean, to the power x}} \; \underbrace{e^{-\lambda}}_{\text{e to minus the mean}}}{\underbrace{x!}_{\text{x factorial}}}$$

For the help desk, each symbol is:

- $\lambda = 2$, the **mean number of events in the interval asked about** (here tickets in one hour). λ is the Greek letter lambda.
- $x$, the number of tickets asked about.
- $x!$ is $x \times (x-1) \times \dots \times 1$, with $0! = 1$.

$$P(1) = \dfrac{\underbrace{2^1}_{\text{mean 2, x = 1}} \; \underbrace{e^{-2}}_{\text{mean 2}}}{\underbrace{1!}_{\text{x = 1}}} = \dfrac{2 \times 0.135335}{1} = \mathbf{0.2707}$$

**The mean of a Poisson count is λ itself, and its standard deviation is $\sqrt{\lambda}$.** For the help desk:

$$\mu = \lambda = \underbrace{2}_{\text{mean tickets an hour}} \qquad \sigma = \sqrt{\lambda} = \sqrt{2} = \mathbf{1.41}$$

For example, pages that average 4 typos have a mean of 4 typos and a standard deviation of 2.

## λ must match the question's interval

The question often gives a rate for one interval and asks about another. **Multiply the rate by the length of the interval asked about, in the same units.** Just like a bus that comes every 10 minutes: over an hour you expect 6, not 1.

$$\lambda = \text{rate} \times \text{interval}$$

A factory makes cable with flaws spread along it. The question asks about the flaws in one piece. This is Lab 7 Task 8.

- rate = 0.75, the flaws per metre.
- interval = 5, the metres in the piece asked about.
- $\lambda = 3.75$, the mean number of flaws in that piece.

$$\lambda = \underbrace{0.75}_{\text{flaws per metre}} \times \underbrace{5}_{\text{metres asked about}} = \mathbf{3.75}$$

Its table of probabilities then starts with P(0) = 0.023518. The help desk over 90 minutes works the same way:

- rate = 2, the tickets per hour.
- interval = 1.5, the hours in 90 minutes.
- $\lambda = 3$, the mean number of tickets in those 90 minutes.

$$\lambda = \underbrace{2}_{\text{tickets per hour}} \times \underbrace{1.5}_{\text{hours asked about}} = \mathbf{3}$$

```diagram
{"type": "flow", "title": "Rescale λ before the formula", "nodes": [{"id": "r", "label": "Rate", "sub": "0.75 flaws per metre"}, {"id": "t", "label": "× interval asked", "sub": "5 metres"}, {"id": "l", "label": "λ for this question", "sub": "0.75 × 5 = 3.75"}, {"id": "f", "label": "Formula", "sub": "P(x) with λ = 3.75"}], "edges": [{"from": "r", "to": "t"}, {"from": "t", "to": "l"}, {"from": "l", "to": "f"}], "hi": ["l"], "caption": "The help desk the same way: 2 per hour × 1.5 hours = 3."}
```

:::warn λ follows the question's interval, not the given rate
A rate per hour used on a 15-minute question makes λ four times too big. Every probability after it is then wrong.
:::

## Separate intervals multiply; one longer interval rescales

**Counts in intervals that do not overlap are independent.** Just like typos on page 1 telling you nothing about typos on page 2. "At most 34 in each of two years" is the one-year answer squared.

"At most 68 over two years" is one interval, twice as long. It uses a single `ppois` with:

- rate = 34, the transformer failures per year.
- interval = 2, the years asked about.
- $\lambda = 68$, the mean number of failures in those two years.

$$\lambda = \underbrace{34}_{\text{failures per year}} \times \underbrace{2}_{\text{years asked about}} = \mathbf{68}$$

:::tip "In each of" multiplies; "over" rescales
In each of two years: square the one-year answer. Over two years: double λ and use the formula once.
:::

## 34 transformer failures a year

A city's transformers fail at a steady average rate. This is Lab 7 Task 10.

- $\lambda = 34$, the mean number of transformer failures in one year.
- exactly 34, at most 30, fewer than 30, more than 38, at least 38, 30 to 40 inclusive, at most 34 in each of two years, and at most 68 over two years: the counts the eight questions ask about.

For example, "fewer than 30" stops at 29, which is why the code writes `30-1`.

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

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Poisson: $P(x) = e^{-\lambda} \cdot \dfrac{\lambda^x}{x!}$
- Poisson: $\mu = \lambda$ and $\sigma^2 = \lambda$
- Complement: $P(\bar{A}) = 1 - P(A)$
- Independent events: $P(A \cap B) = P(A) \cdot P(B)$

**Not on the sheet, so know it:**

- $\lambda = \text{rate} \times \text{interval}$, in the units the question asks about.
- At least k is $1 - P(\text{at most } k - 1)$; at least one is $1 - P(0)$.
- "In each of two separate spans" means two independent events: multiply the two probabilities.
:::

```quiz
[
  {"q": "A COMP course inbox gets 4 emails an hour. P(exactly 2 in 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1839, "tolerance": 0.0001, "explain": "Let X = the number of emails in 15 minutes. Poisson, rescaled: $$\\lambda = \\underbrace{4}_{\\text{emails per hour}} \\times \\underbrace{\\dfrac{15}{60}}_{\\text{hours asked about}} = 1$$ $$P(2) = \\dfrac{\\underbrace{1^2}_{\\text{mean 1, x = 2}} \\, \\underbrace{e^{-1}}_{\\text{mean 1}}}{\\underbrace{2!}_{\\text{x = 2}}} = \\dfrac{0.367879}{2} = \\mathbf{0.1839}$$"},
  {"q": "A factory line's cable has 0.3 flaws per metre. P(at least one flaw in 4 metres)? (4 decimals)", "type": "numeric", "answer": 0.6988, "tolerance": 0.0001, "explain": "Let X = the number of flaws in 4 metres. $$\\lambda = \\underbrace{0.3}_{\\text{flaws per metre}} \\times \\underbrace{4}_{\\text{metres asked about}} = 1.2$$ At least one is the complement of none: $$P(X \\ge 1) = 1 - P(0) = 1 - \\underbrace{e^{-1.2}}_{\\text{no flaws, mean 1.2}} = 1 - 0.301194 = \\mathbf{0.6988}$$"},
  {"q": "The same inbox, 4 emails an hour. P(exactly 1 email in a 15-minute span and exactly 1 in the next 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1353, "tolerance": 0.0001, "explain": "Each 15-minute span has its own λ: $$\\lambda = \\underbrace{4}_{\\text{emails per hour}} \\times \\underbrace{\\tfrac{15}{60}}_{\\text{hours in a span}} = 1$$ $$P(1) = \\dfrac{\\underbrace{1^1}_{\\text{mean 1, x = 1}} \\, \\underbrace{e^{-1}}_{\\text{mean 1}}}{\\underbrace{1!}_{\\text{x = 1}}} = 0.367879$$ The spans do not overlap, so they are independent. Multiply: $$\\underbrace{0.367879}_{\\text{1 in the first span}} \\times \\underbrace{0.367879}_{\\text{1 in the next span}} = \\mathbf{0.1353}$$"},
  {"q": "A SkyTrain station logs 3 delays a week. P(at most 2 delays in 2 weeks)? (4 decimals)", "type": "numeric", "answer": 0.0620, "tolerance": 0.0001, "explain": "Let X = the number of delays in 2 weeks. One interval, twice as long: $$\\lambda = \\underbrace{3}_{\\text{delays per week}} \\times \\underbrace{2}_{\\text{weeks asked about}} = 6, \\quad e^{-6} = 0.002479$$ $$P(0) = \\underbrace{e^{-6}}_{\\text{mean 6}} = 0.002479 \\qquad P(1) = \\dfrac{\\underbrace{6^1}_{\\text{mean 6, x = 1}} \\underbrace{e^{-6}}_{\\text{mean 6}}}{\\underbrace{1!}_{\\text{x = 1}}} = 0.014873 \\qquad P(2) = \\dfrac{\\underbrace{6^2}_{\\text{mean 6, x = 2}} \\underbrace{e^{-6}}_{\\text{mean 6}}}{\\underbrace{2!}_{\\text{x = 2}}} = 0.044618$$ $$P(X \\le 2) = \\underbrace{0.002479}_{\\text{P(0)}} + \\underbrace{0.014873}_{\\text{P(1)}} + \\underbrace{0.044618}_{\\text{P(2)}} = \\mathbf{0.0620}$$"},
  {"q": "A lottery kiosk sells 0.5 winning tickets a day. P(exactly 3 winners in a 7-day week)? (4 decimals)", "type": "numeric", "answer": 0.2158, "tolerance": 0.0001, "explain": "Let X = the number of winning tickets in 7 days. $$\\lambda = \\underbrace{0.5}_{\\text{winners per day}} \\times \\underbrace{7}_{\\text{days asked about}} = 3.5$$ $$P(3) = \\dfrac{\\underbrace{3.5^3}_{\\text{mean 3.5, x = 3}} \\, \\underbrace{e^{-3.5}}_{\\text{mean 3.5}}}{\\underbrace{3!}_{\\text{x = 3}}} = \\dfrac{42.875 \\times 0.030197}{6} = \\mathbf{0.2158}$$"}
]
```

## Remember

- Poisson counts events in a fixed interval at a known average rate; there is no fixed n.
- **$\lambda = \text{rate} \times \text{interval}$, in the same units, before anything else.**
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
