---
title: "Review 6: Poisson plug-in: rescale λ, then use the sheet"
minutes: 30
---
<!-- facts: none; no bank entry gives counts per time interval, so the Poisson examples stay the instructor's and the labs' -->

:::quiz What the paper asks and what earns the marks
The practice paper's Q11a (2 marks): floods average once every 20 years; P(exactly two floods in the next 10 years)?

One mark for "Let X = the number of floods in 10 years; Poisson with λ = 1/20 × 10 = 0.5", one for the plugged-in formula and 0.0758.

Q11b's setup reuses the same λ and multiplies two separate intervals: about 2 to 3 marks in all from one formula on the sheet.
:::

## Write this on the paper

1. "Let X = the number of [events] in [the interval in the question]."
2. "X is Poisson with $\lambda$ = rate × interval = ... × ... = ..."
3. "$P(X = x) = \dfrac{e^{-\lambda}\lambda^x}{x!}$" (copied from the sheet), then the same line with your numbers.
4. The number, rounded to 4 decimals.

Do the sample question and the first three variants below; the rest are "if time".

## The ideas, from zero

### What a Poisson count is

A **Poisson variable** X counts how many times an event happens in a fixed stretch of time or space (an hour, 10 years, one page, one metre of cable), when the events happen independently at a steady average rate. X can be 0, 1, 2, 3, ... with no fixed upper limit.

Examples: calls to a help line per hour, floods per 10 years, typos per page.

### λ is the mean count for the interval in the question

**λ** (lambda) is the average number of events in the interval the question asks about. The question usually gives a rate for a *different* interval, so rescale first:

$$\lambda = \text{rate} \times \text{interval length}$$

| Given rate | Interval asked | λ |
|---|---|---|
| 6 per hour | 20 minutes = 1/3 hour | $6 \times \frac{20}{60} = 2$ |
| 1.2 per year | 10 years | $1.2 \times 10 = 12$ |
| 3 per page | half a page | $3 \times 0.5 = 1.5$ |
| 1 per 20 years | 10 years | $\frac{1}{20} \times 10 = 0.5$ |

```diagram
{"type": "flow", "title": "Rescale λ: the help line's 20-minute question", "nodes": [{"id": "r", "label": "Rate per unit", "sub": "6 per hour"}, {"id": "t", "label": "× interval length", "sub": "20/60 hour"}, {"id": "l", "label": "λ for this question", "sub": "6 × 20/60 = 2"}], "edges": [{"from": "r", "to": "t"}, {"from": "t", "to": "l"}], "hi": ["l"], "caption": "The same three boxes for the floods: 1/20 per year, × 10 years, λ = 0.5."}
```

This rescaling is **not** on the sheet; it is the step that earns the first mark.

:::warn λ must match the interval in the question
Put the units the same before multiplying (minutes with minutes, hours with hours). Using the yearly flood rate 0.05 for a 10-year question gives a wrong answer for every part that follows.
:::

### The formula, on the sheet

**On the sheet, under Discrete Probability Distributions, Poisson Distribution**:

$$P(x) = \dfrac{e^{-\lambda}\lambda^x}{x!}, \qquad \mu = \lambda, \qquad \sigma^2 = \lambda$$

$x!$ ("x factorial") is $x \times (x-1) \times \dots \times 1$, with $0! = 1$ and $\lambda^0 = 1$.

Tiny case, λ = 2, exactly 3 events:

$$P(3) = \dfrac{e^{-2} \cdot 2^3}{3!} = \dfrac{0.135335 \times 8}{6} = 0.1804$$

### e^(−λ) on a calculator

Press the $e^x$ key (on most calculators it is SHIFT then ln), then the negative key (−), then λ, then =. For λ = 2: $e^{-2} = 0.135335$. Keep six digits until the last step.

### The three shapes built from P(x)

- **At least one**, complement rule: $P(X \ge 1) = 1 - P(0) = 1 - e^{-\lambda}$, because $P(0) = \frac{e^{-\lambda}\lambda^0}{0!} = e^{-\lambda}$.
- **At most 2**: add three terms, $P(0) + P(1) + P(2)$.
- **More than 2**: $1 - [P(0) + P(1) + P(2)]$.

```diagram
{"type": "grid", "title": "Which terms each wording uses", "nodes": [{"id": "r0c0", "label": "Event", "row": 0, "col": 0}, {"id": "r0c1", "label": "P(0)", "row": 0, "col": 1}, {"id": "r0c2", "label": "P(1)", "row": 0, "col": 2}, {"id": "r0c3", "label": "P(2)", "row": 0, "col": 3}, {"id": "r0c4", "label": "Then", "row": 0, "col": 4}, {"id": "r1c0", "label": "exactly 2", "row": 1, "col": 0}, {"id": "r1c1", "label": "", "row": 1, "col": 1}, {"id": "r1c2", "label": "", "row": 1, "col": 2}, {"id": "r1c3", "label": "P(2)", "row": 1, "col": 3}, {"id": "r1c4", "label": "that term", "row": 1, "col": 4}, {"id": "r2c0", "label": "at most 2", "row": 2, "col": 0}, {"id": "r2c1", "label": "P(0)", "row": 2, "col": 1}, {"id": "r2c2", "label": "P(1)", "row": 2, "col": 2}, {"id": "r2c3", "label": "P(2)", "row": 2, "col": 3}, {"id": "r2c4", "label": "add the three", "row": 2, "col": 4}, {"id": "r3c0", "label": "at least 1", "row": 3, "col": 0}, {"id": "r3c1", "label": "P(0)", "row": 3, "col": 1}, {"id": "r3c2", "label": "", "row": 3, "col": 2}, {"id": "r3c3", "label": "", "row": 3, "col": 3}, {"id": "r3c4", "label": "1 − P(0)", "row": 3, "col": 4}, {"id": "r4c0", "label": "more than 2", "row": 4, "col": 0}, {"id": "r4c1", "label": "P(0)", "row": 4, "col": 1}, {"id": "r4c2", "label": "P(1)", "row": 4, "col": 2}, {"id": "r4c3", "label": "P(2)", "row": 4, "col": 3}, {"id": "r4c4", "label": "1 − the sum", "row": 4, "col": 4}], "hi": ["r1c3", "r2c1", "r2c2", "r2c3", "r3c1", "r4c1", "r4c2", "r4c3"], "caption": "Lit cells are the terms you compute. \"At least 1\" and \"more than 2\" compute the lit terms and subtract from 1."}
```

### Separate intervals multiply

Counts in intervals that do not overlap are independent, so "exactly 1 in this hour **and** exactly 1 in the next hour" is $P(1) \times P(1)$, each with the one-hour λ.

That is not the same as "exactly 2 in the two hours", which uses the two-hour λ and also counts the 2-then-0 and 0-then-2 splits.

```diagram
{"type": "flow", "title": "Two separate hours, exactly 1 bus in each", "nodes": [{"id": "now", "label": "Now", "kind": "pill"}, {"id": "h1", "label": "Hour 1", "sub": "exactly 1 · λ = 2 · P(1)"}, {"id": "h2", "label": "Hour 2", "sub": "exactly 1 · λ = 2 · P(1)"}], "edges": [{"from": "now", "to": "h1"}, {"from": "h1", "to": "h2", "label": "then"}], "hi": ["h1", "h2"], "caption": "The hours do not overlap, so they are independent: P(1) × P(1) = 0.0733, each with the one-hour λ."}
```

## Sample midterm question: Q11

> **Question 11 [5 marks].** On average, a major flood in the Fraser Valley occurs once every 20 years. Assume that floods occur independently and with equal likelihood at any time of the year.
>
> a. [2] What is the probability that two major floods occur in the Fraser Valley in the next 10 years?
>
> b. [3] What is the probability the next major flood in the Fraser Valley will occur between 10 and 20 years from now?

```quiz
[
  {
    "q": "**Q11a.** First, λ for a 10-year interval = ?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.001,
    "explain": "λ must be the mean count for the interval in the question: $$\\lambda = \\dfrac{1}{20} \\text{ per year} \\times 10 \\text{ years} = \\mathbf{0.5} \\text{ floods}$$ Using the yearly rate 0.05 answers a question about one year."
  },
  {
    "q": "**Q11a.** P(exactly two major floods in the next 10 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0758,
    "tolerance": 0.0001,
    "explain": "Let X = the number of major floods in the Fraser Valley in the next 10 years. Under the given assumptions (independent, equally likely at any time, known mean) this is a **Poisson** variable with mean $$\\lambda = \\dfrac{1}{20} \\text{ yr}^{-1} \\times 10 \\text{ yr} = 0.5$$ Therefore $$P(X = 2) = \\dfrac{e^{-\\lambda} \\lambda^x}{x!} = \\dfrac{e^{-0.5} \\cdot 0.5^2}{2!} = \\dfrac{0.606531 \\times 0.25}{2} = \\mathbf{0.0758}$$"
  },
  {
    "q": "**Q11b.** P(the next major flood occurs between 10 and 20 years from now)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2387,
    "tolerance": 0.0001,
    "explain": "The event means **no** flood in the next 10 years and then **at least one** flood in the 10 years after that. The two 10-year intervals do not overlap, so they are independent, and each has λ = 0.5.\n\n$$P(\\text{next flood 10 to 20 years from now}) = P(X = 0) \\cdot (1 - P(X = 0))$$ $$= \\dfrac{e^{-0.5} \\cdot 0.5^0}{0!} \\cdot \\left(1 - \\dfrac{e^{-0.5} \\cdot 0.5^0}{0!}\\right) = 0.606531 \\times 0.393469 = \\mathbf{0.2387}$$\n\nTwo slips to avoid: \\$1 - P(0)$ with λ = 1 (0.6321) is \"at least one flood in 20 years\", which includes floods in the first 10; P(0)·P(1) (0.1839) is \"exactly one\" in the second interval, but the next flood may be followed by more."
  }
]
```

Part b's setup is the sentence "zero floods in years 0 to 10, and one or more in years 10 to 20"; once written, it is two Poisson values with the same λ, multiplied because the intervals are separate.

```diagram
{ "type": "flow", "title": "Q11b on a timeline", "nodes": [ { "id": "now", "label": "Now", "kind": "pill" }, { "id": "w1", "label": "Years 0–10", "sub": "0 floods · λ = 0.5 · P = 0.6065" }, { "id": "w2", "label": "Years 10–20", "sub": "≥ 1 flood · λ = 0.5 · P = 0.3935" } ], "edges": [ { "from": "now", "to": "w1" }, { "from": "w1", "to": "w2", "label": "then" } ], "hi": ["w1", "w2"], "caption": "Separate windows are independent: 0.6065 × 0.3935 = 0.2387." }
```

The rate composer: 1 flood per 20 years over a 10-year interval (the widget has no year unit; read day as year).

```widget
poisson-calc
{ "rate": 1, "per": 20, "unit": "day", "interval": 10, "x": 2, "op": "eq", "presets": false, "title": "Q11: 1 flood per 20 years over 10 years (read day as year)" }
```

More on the full question in [Q11, Q12](#/math3042-midterm/practice-distributions) and on separate intervals in [Poisson across separate intervals](#/math3042-midterm/expected-dollars-shortcuts).

## Lab 7: dpois and ppois

**Task 8**: "A factory produces fibre optic cables that have an average of 0.75 flaws per meter. Use dpois() to give an exact probability distribution for the number of flaws in five meters of cable." The lab rescales first, `lambda <- 0.75*5`, which is $\lambda = 3.75$, and its table starts `0 0.023518`, `1 0.088192`. By hand: $P(0) = e^{-3.75} = 0.0235$.

**Task 10**: "A city records an average of 34 transformer failures per year." Three of its parts, with the lab's printed answers:

```r
dpois(34, lambda)
ppois(30, lambda)
ppois(34, lambda)^2
```
```text
[1] 0.06825
[1] 0.2804
[1] 0.2975
```

:::info R syntax
| Code | What it does |
|---|---|
| `dpois(` | the Poisson probability of exactly x |
| `34` (in `dpois`) | x, the count asked about |
| `lambda` | the mean for the interval, set earlier by `lambda <- 34` |
| `ppois(30, lambda)` | the probability of at most 30 (30 or fewer): P(0) + ... + P(30) |
| `^2` | squares the result: the same probability in two separate years, multiplied |

**Left to right**

- `dpois(34, lambda)`: "The Poisson probability of exactly (`dpois`) 34 (`34`) with mean lambda (`lambda`)."
- `ppois(30, lambda)`: "The Poisson probability of at most (`ppois`) 30 (`30`) with mean lambda (`lambda`)."
- `ppois(34, lambda)^2`: "The probability of at most 34 (`ppois(34, lambda)`), squared (`^2`)."

**Right to left**, the order R runs it

- `dpois(34, lambda)`: "Look up lambda = 34, take x = 34, compute P(X = 34) (`dpois`)."
- `ppois(30, lambda)`: "Take 30 and lambda, add P(0) through P(30) (`ppois`)."
- `ppois(34, lambda)^2`: "Compute P(X ≤ 34) (`ppois`), then square it (`^2`), because the two years are separate intervals."
:::

(a) "exactly 34 transformers fail in a year" is `dpois(34, lambda)`; (b) "30 or fewer" is `ppois(30, lambda)`; (g) "34 or fewer transformers fail in each of two consecutive years" squares the one-year answer because separate years multiply. Part (h), "68 or fewer over a two-year period", is one interval instead, so the lab doubles λ: `ppois(68, lambda*2)`.

## Unit 4 practice problems: Poisson

```quiz
[
  {
    "q": "**PP13a.** Customers arrive at a cafeteria at 0.3 per minute. P(exactly 2 in 10 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2240,
    "tolerance": 0.0001,
    "explain": "Let X = the number of customers in 10 minutes. $$\\lambda = 0.3 \\times 10 = 3$$ $$P(2) = \\dfrac{3^2 e^{-3}}{2!} = \\dfrac{9(0.049787)}{2} = \\mathbf{0.2240}$$"
  },
  {
    "q": "**PP13c.** Same cafeteria: P(exactly 1 in a 5-minute span and exactly 1 in the next 5 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1120,
    "tolerance": 0.0001,
    "explain": "Each 5-minute span has $$\\lambda = 0.3 \\times 5 = 1.5$$ and $$P(1) = 1.5e^{-1.5} = 0.334695$$ The spans do not overlap, so they are independent: $$0.334695^2 = \\mathbf{0.1120}$$"
  },
  {
    "q": "**PP16a.** A \"100-year flood\" happens on average once every 100 years, randomly and independently. P(at least one in the next 50 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3935,
    "tolerance": 0.0001,
    "explain": "$$\\lambda = \\dfrac{1}{100} \\times 50 = 0.5$$ At least one, by the complement: $$1 - P(0) = 1 - e^{-0.5} = 1 - 0.606531 = \\mathbf{0.3935}$$"
  },
  {
    "q": "**PP16b.** Same flood: P(exactly one in the next 50 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3033,
    "tolerance": 0.0001,
    "explain": "λ = 0.5: $$P(1) = \\dfrac{e^{-0.5} \\cdot 0.5^1}{1!} = 0.5 \\times 0.606531 = \\mathbf{0.3033}$$"
  }
]
```

All sixteen are worked in [Unit 4 practice problems](#/math3042-midterm/unit4-practice-problems).

## New variants

The first three are mandatory; the rest are "if time".

```quiz
[
  {
    "q": "A help line gets 6 calls per hour. P(exactly 3 calls in a 20-minute span)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1804,
    "tolerance": 0.0006,
    "explain": "Let X = the number of calls in 20 minutes. Rescale: $$\\lambda = 6 \\times \\dfrac{20}{60} = 2$$ Poisson formula (sheet): $$P(3) = \\dfrac{e^{-2} \\cdot 2^3}{3!} = \\dfrac{0.135335 \\times 8}{6} = 0.180447 \\to \\mathbf{0.1804}$$"
  },
  {
    "q": "Same line: P(no calls in a 20-minute span)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1353,
    "tolerance": 0.0006,
    "explain": "λ = 2 as before. $$P(0) = \\dfrac{e^{-2} \\cdot 2^0}{0!} = \\dfrac{0.135335 \\times 1}{1} = \\mathbf{0.1353}$$ $2^0 = 1$ and $0! = 1$, so P(0) is just $e^{-\\lambda}$."
  },
  {
    "q": "Same line: P(at least one call in a 20-minute span)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8647,
    "tolerance": 0.0006,
    "explain": "Complement rule: at least one = 1 − none. $$P(X \\ge 1) = 1 - P(0) = 1 - e^{-2} = 1 - 0.135335 = 0.864665 \\to \\mathbf{0.8647}$$"
  },
  {
    "q": "*If time.* A typist averages 3 typos per page. P(at most 2 typos on half a page)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8088,
    "tolerance": 0.0006,
    "explain": "Let X = typos on half a page. $$\\lambda = 3 \\times 0.5 = 1.5, \\quad e^{-1.5} = 0.223130$$ At most 2 = add three terms: $$P(0) + P(1) + P(2) = 0.223130\\left(1 + 1.5 + \\dfrac{1.5^2}{2!}\\right) = 0.223130(1 + 1.5 + 1.125) = 0.223130 \\times 3.625 = 0.808847 \\to \\mathbf{0.8088}$$"
  },
  {
    "q": "*If time.* Same typist: P(more than 2 typos on half a page)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1912,
    "tolerance": 0.0006,
    "explain": "More than 2 is the complement of at most 2: $$P(X > 2) = 1 - P(X \\le 2) = 1 - 0.808847 = 0.191153 \\to \\mathbf{0.1912}$$"
  },
  {
    "q": "*If time.* Buses arrive at 2 per hour. What λ do you use for a 90-minute wait?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.001,
    "explain": "Same units first: 90 minutes = 1.5 hours. $$\\lambda = 2 \\times 1.5 = \\mathbf{3} \\text{ buses}$$"
  },
  {
    "q": "*If time.* Same buses, 2 per hour: P(exactly 1 bus in the first hour and exactly 1 in the second hour)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0733,
    "tolerance": 0.0006,
    "explain": "Each hour has λ = 2: $$P(1) = \\dfrac{e^{-2} \\cdot 2^1}{1!} = 2 \\times 0.135335 = 0.270671$$ The hours do not overlap, so they are independent; multiply: $$0.270671 \\times 0.270671 = 0.073263 \\to \\mathbf{0.0733}$$"
  },
  {
    "q": "*If time.* Write the R line for the first variant: P(exactly 3 calls in 20 minutes) at 6 calls per hour.",
    "type": "fill",
    "code": "dpois(___, ___)",
    "answer": ["3", "2"],
    "explain": "`dpois(x, lambda)`: x = 3 is the count asked about; lambda is the rescaled mean for 20 minutes, $6 \\times \\frac{20}{60} = 2$. So `dpois(3, 2)`, which gives 0.1804. Writing `dpois(3, 6)` uses the one-hour rate and answers a different question."
  }
]
```

Check the variants with the rate composer, one per rescaled λ:

```widget
poisson-calc
{"rate": 6, "per": 60, "unit": "min", "interval": 20, "x": 3, "op": "eq", "presets": false, "title": "Help line: 6 calls per 60 minutes over 20 minutes; set x to 0 for no calls"}
```

```widget
poisson-calc
{"rate": 3, "per": 1, "unit": "page", "interval": 0.5, "x": 2, "op": "le", "presets": false, "title": "Typist: 3 typos per page over half a page, at most 2"}
```

```widget
poisson-calc
{"rate": 2, "per": 60, "unit": "min", "interval": 90, "x": 1, "op": "eq", "presets": false, "title": "Buses: 2 per 60 minutes; interval 90 for the 90-minute λ, 60 for one hour"}
```
