---
title: "Exponential on paper: a waiting time with mean β"
minutes: 12
---
<!-- facts: none; no bank entry gives a measured waiting time -->
Some measurements are waits: the time until the next customer, the next web request, the next bus. You know only the average wait, and the exponential distribution turns that average into a probability.

## The exponential: how long until the next event

Events happen one at a time, at random, at a steady average rate. **An exponential variable X is the wait until the next event.** Just like standing at a stop where buses come at random about every 10 minutes: you know the average wait, never the exact one.

A wait cannot be negative, so **X is 0 or more**. **Short waits are common and long waits are rare.** For example, at a busy coffee counter the next order usually comes within a minute or two, and a gap of fifteen minutes happens but seldom.

The notes call it *a model for waiting time in a memory-less system*. The memory-less part comes in [the next lesson](#/math3042-q8/exponential-percentile-memoryless).

## The web server's wait, drawn

The curve starts at its highest point at x = 0 and falls towards 0 without ever touching it. It is a falling curve with a long tail to the right. Sketch it that way on paper: a dot on the vertical axis, then a slide down to the right.

```diagram
{"type": "curve", "title": "An exponential starts at its peak at 0 and falls; β marks the mean", "panels": [{"title": "Any exponential", "x": [-0.3, 5], "curves": [{"dist": "exp", "beta": 1, "tone": "red"}], "points": [{"x": 0, "tone": "red"}], "ticks": [0, {"x": 1, "label": "β"}], "notes": [{"text": "long tail to the right", "at": [3.4, 0.45], "to": [3.6, 0.08], "tone": "red"}]}, {"title": "Web server, β = 2.5 s", "x": [-0.7, 12], "xlabel": "X = wait time (s)", "curves": [{"dist": "exp", "beta": 2.5, "tone": "red"}], "points": [{"x": 0, "tone": "red"}], "ticks": [0, 2.5]}]}
```

Both curves have the same shape. Only the scale changes: the web server's β of 2.5 seconds stretches the curve to the right.

```widget
exp-wait
{ "beta": 2.5, "unit": "s", "x": 4, "mode": "single", "title": "Web server, β = 2.5 s: the shaded area left of 4 is P(X ≤ 4); the rest is P(X > 4)" }
```

The shaded area left of x is the chance the wait is over by x. The unshaded tail is the chance it is longer. The two add to 1.

## A web server that waits 2.5 seconds on average

A web server waits between requests. On average the wait is 2.5 seconds. What is the chance the next request arrives within 4 seconds? This is the notes' example.

- $\beta = 2.5$, the mean wait in seconds. β is the Greek letter beta.
- $x = 4$, the wait asked about, in seconds.

**The area to the left of x is 1 minus e to the power −x/β.** Work the exponent out first: 4 divided by 2.5 is 1.6. Then press the sign key, 1.6, and $e^x$, as in [Before you start](#/math3042-q8/pre-reading).

```diagram
{"type": "curve", "title": "P(X ≤ 4) is the area left of 4: 0.7981", "x": [-0.7, 12], "xlabel": "X = wait time (s)", "curves": [{"dist": "exp", "beta": 2.5, "tone": "red"}], "shade": [{"to": 4, "label": "0.7981", "tone": "hl"}, {"from": 4, "label": "0.2019", "tone": "blue", "labelAt": [7, 0.3]}], "ticks": [0, 2.5, 4]}
```

The shaded area runs from 0 to 4 and holds most of the curve, 0.7981. The tail past 4 is the 0.2019 left over.

$$P(X \le 4) = \underbrace{1}_{\text{whole area}} - \underbrace{e^{-4/2.5}}_{\text{4 s asked, mean 2.5 s}} = 1 - 0.201897 = \mathbf{0.7981}$$

The chance the wait is longer than 4 seconds is the part that was taken away.

$$P(X > 4) = \underbrace{e^{-4/2.5}}_{\text{area past 4 s}} = \mathbf{0.2019}$$

## The formula sheet lines, with β named

The sheet gives four lines for the exponential.

$$f(x) = \dfrac{1}{\beta}\,e^{-x/\beta} \qquad F(x) = \underbrace{1}_{\text{whole area}} - \underbrace{e^{-x/\beta}}_{\text{area past x}} \qquad \mu = \beta \qquad \sigma^2 = \beta^2$$

- $\beta$ is the **mean wait**. It is the only number the distribution needs.
- $x$ is the wait the question asks about, in the same unit as β.
- $f(x)$ is the **height of the curve**. It is not a probability; use it only when a question asks for "the pdf".
- $F(x)$ is the **area to the left of x**, the chance the wait is x or less.
- $\mu = \beta$ and $\sigma = \beta$: **the mean and the standard deviation of an exponential are the same number.** The sheet gives $\sigma^2 = \beta^2$; its square root is β.

```diagram
{"type": "curve", "title": "F(x) is the area from 0 up to x", "x": [-0.3, 5], "curves": [{"dist": "exp", "beta": 1, "tone": "red"}], "shade": [{"to": 1.4, "tone": "hl"}], "lines": [{"x": 1.4, "solid": true, "tone": "hl"}], "ticks": [0, {"x": 1.4, "label": "x"}], "notes": [{"text": "area = F(x)", "at": [2.6, 0.7], "to": [0.8, 0.4], "tone": "hl"}]}
```

The shaded piece starts at 0, where the curve is highest, and stops at x. Move x right and the area grows towards 1.

For the web server, the pdf the notes box is:

$$f(x) = \dfrac{1}{\underbrace{2.5}_{\text{mean wait}}}\,e^{-x/2.5} = \mathbf{0.4}\,e^{-x/2.5}$$

The standard deviation is the mean again:

$$\sigma = \beta = \underbrace{2.5}_{\text{mean wait}} = \mathbf{2.5 \text{ s}}$$

For example, a bus with a 10-minute mean wait has a standard deviation of 10 minutes as well. The sheet's σ² = 100 is not that answer.

## Less than, more than, between

The same three moves as for any area. **Less than x is $1 - e^{-x/\beta}$. More than x is $e^{-x/\beta}$. Between a and b is $e^{-a/\beta} - e^{-b/\beta}$.** Just like cutting a strip off a long ribbon: the piece between two marks is everything past the first mark minus everything past the second.

```diagram
{"type": "grid", "title": "The three moves for an exponential wait", "nodes": [{"id": "h0", "label": "Question", "row": 0, "col": 0}, {"id": "h1", "label": "Area", "row": 0, "col": 1}, {"id": "h2", "label": "Formula", "row": 0, "col": 2}, {"id": "r1", "label": "Less than x", "row": 1, "col": 0}, {"id": "a1", "label": "left of x", "row": 1, "col": 1}, {"id": "f1", "label": "1 − e^(−x/β)", "row": 1, "col": 2}, {"id": "r2", "label": "More than x", "row": 2, "col": 0}, {"id": "a2", "label": "the tail past x", "row": 2, "col": 1}, {"id": "f2", "label": "e^(−x/β)", "row": 2, "col": 2}, {"id": "r3", "label": "Between a and b", "row": 3, "col": 0}, {"id": "a3", "label": "past a minus past b", "row": 3, "col": 1}, {"id": "f3", "label": "e^(−a/β) − e^(−b/β)", "row": 3, "col": 2}], "hi": ["f2"], "caption": "One exact wait has probability 0, so less than and at most give the same area."}
```

## β from a rate, in the question's unit

Questions often give a rate instead of a mean: 30 customers per hour, 0.2 arrivals per minute. **β is 1 divided by the rate, and it is a time.** Just like a bus that comes 6 times an hour: the average gap is 60/6 = 10 minutes.

A bank teller sees 30 customers an hour, and the question asks in minutes.

- 30, the customers per hour.
- 60, the minutes in an hour.

$$\beta = \dfrac{\underbrace{60 \text{ min}}_{\text{one hour}}}{\underbrace{30}_{\text{customers in that hour}}} = \mathbf{2 \text{ min}}$$

A passport office has arrivals at a rate of 0.2 per minute.

$$\beta = \dfrac{1}{\underbrace{0.2}_{\text{arrivals per minute}}} = \mathbf{5 \text{ min}}$$

```diagram
{"type": "flow", "title": "Rate to β, then the formula", "nodes": [{"id": "r", "label": "Rate", "sub": "30 per hour"}, {"id": "u", "label": "Pick the unit", "sub": "the question's: minutes"}, {"id": "b", "label": "β = 1 / rate", "sub": "60 / 30 = 2 min"}, {"id": "f", "label": "Formula", "sub": "e^(−x/2), x in minutes"}], "edges": [{"from": "r", "to": "u"}, {"from": "u", "to": "b"}, {"from": "b", "to": "f"}], "hi": ["b"], "caption": "The passport office the same way: 1 / 0.2 = 5 minutes."}
```

:::warn β and x must be in the same unit
A β in hours with an x in minutes puts the wrong number in the exponent. Every probability after it is then wrong.
:::

## A bank teller who serves 30 customers an hour

The time the teller takes to serve one customer is exponential. What is the chance a service takes between 1.5 and 2.5 minutes? This is the notes' example.

- $\beta = 2$, the mean service time in minutes, from 60/30 above.
- $a = 1.5$, the lower bound in minutes.
- $b = 2.5$, the upper bound in minutes.

```widget
exp-wait
{ "rate": 30, "rateUnit": "h", "unit": "min", "lo": 1.5, "hi": 2.5, "mode": "interval", "title": "Bank teller, 30 per hour so β = 2 min: the strip from 1.5 to 2.5 minutes" }
```

The strip is thin and sits on the falling part of the curve.

```diagram
{"type": "curve", "title": "P(1.5 ≤ X ≤ 2.5) is a thin strip: 0.1859", "x": [-0.5, 9], "xlabel": "X = time to serve (min)", "curves": [{"dist": "exp", "beta": 2, "tone": "red"}], "shade": [{"from": 1.5, "to": 2.5, "label": "0.1859", "tone": "hl"}], "ticks": [0, 1.5, 2.5]}
```

The strip runs from 1.5 to 2.5 minutes, one minute wide; its area is 0.1859. The instructor writes the two F values, then lets the 1s cancel.

$$P(1.5 \le X \le 2.5) = (1 - \underbrace{e^{-2.5/2}}_{\text{past 2.5 min}}) - (1 - \underbrace{e^{-1.5/2}}_{\text{past 1.5 min}})$$

$$= -\underbrace{e^{-2.5/2}}_{0.286505} + \underbrace{e^{-1.5/2}}_{0.472367} = \mathbf{0.1859}$$

## The exponential wait and the Poisson count

The waits between Poisson events are exponential. **If events come at a rate r, the wait between them is exponential with $\beta = 1/r$.** For example, the teller's 30 customers an hour is a Poisson count, and the gaps between those customers average 2 minutes.

**"The wait is longer than t" means "no event in t".** So $e^{-t/\beta}$ is the Poisson chance of zero events, with $\lambda = t/\beta$ the mean count in t. For the web server and t = 4 seconds:

$$P(\text{0 requests in 4 s}) = e^{-\lambda} = \underbrace{e^{-4/2.5}}_{\text{mean count } \lambda = 1.6} = \mathbf{0.2019}$$

That is $P(X > 4)$ from above. The Poisson formula is in [Poisson on paper](#/math3042-q7/poisson-on-paper).

## A bus with a 10-minute mean wait

A person waits for a bus, and the wait is exponential with a mean of 10 minutes. This is Lab 8's second bus scenario.

- $\beta = 10$, the mean wait in minutes.
- 6, 10, 15, and 5 to 10: the waits the four questions ask about, in minutes.

```diagram
{"type": "curve", "title": "The bus, β = 10 min: left, right and between", "panels": [{"title": "Less than 6", "x": [-2.7, 45], "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"to": 6, "label": "0.4512", "tone": "hl", "labelAt": [18, 0.6]}], "ticks": [0, 6]}, {"title": "More than 15", "x": [-2.7, 45], "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"from": 15, "label": "0.2231", "tone": "hl", "labelAt": [28, 0.45]}], "ticks": [0, 15]}, {"title": "Between 5 and 10", "x": [-2.7, 45], "curves": [{"dist": "exp", "beta": 10, "tone": "red"}], "shade": [{"from": 5, "to": 10, "label": "0.2387", "tone": "hl", "labelAt": [24, 0.6]}], "ticks": [0, 5, 10]}]}
```

Less than 6 is the piece from 0 to 6. More than 15 is the long tail. Between 5 and 10 is a strip. Less than 10 is the piece from 0 to 10, a little over the left panel's area: 0.6321.

$$P(X < 6) = 1 - \underbrace{e^{-6/10}}_{\text{past 6 min}} = 1 - 0.548812 = \mathbf{0.4512}$$

$$P(X < 10) = 1 - \underbrace{e^{-10/10}}_{\text{past 10 min}} = 1 - 0.367879 = \mathbf{0.6321}$$

$$P(X > 15) = \underbrace{e^{-15/10}}_{\text{past 15 min}} = \mathbf{0.2231}$$

$$P(5 \le X \le 10) = \underbrace{e^{-5/10}}_{\text{past 5 min}} - \underbrace{e^{-10/10}}_{\text{past 10 min}} = 0.606531 - 0.367879 = \mathbf{0.2387}$$

The lab's R lines print the same four numbers.

```r
beta <- 10 #mean waiting time
pexp(6, rate=1/beta)
pexp(10, rate=1/beta)
1 - pexp(15, rate=1/beta)
pexp(10, rate=1/beta) - pexp(5, rate=1/beta)
```

```text
[1] 0.4512
[1] 0.6321
[1] 0.2231
[1] 0.2387
```

:::info R syntax
| Code | What it does |
|---|---|
| `beta <- 10` | `<-` stores 10, the mean wait in minutes, under the name `beta`. |
| `#mean waiting time` | `#` starts a comment: R ignores the rest of the line. |
| `pexp(6, rate=1/beta)` | Slots `pexp(q, rate)`: q = 6, rate = 1/10. Returns P(X ≤ 6), the area left of 6. |
| `rate=1/beta` | Fills the slot named `rate`. `1/beta` divides 1 by 10: 0.1 per minute. `pexp` takes the rate, never β. |
| `pexp(10, rate=1/beta)` | The area left of 10. |
| `1 - pexp(15, rate=1/beta)` | The whole area 1 minus the area left of 15: more than 15 minutes. |
| `pexp(10, rate=1/beta) - pexp(5, rate=1/beta)` | The area left of 10 minus the area left of 5 leaves 5 to 10. |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- `beta <- 10 #mean waiting time`: "Store under the name beta (`beta <-`) the number 10, with a note for the reader (`#mean waiting time`)."
- `pexp(6, rate=1/beta)`: "The exponential area to the left (`pexp`) of 6 (`6`), with rate one over beta (`rate=1/beta`)."
- `pexp(10, rate=1/beta)`: "The exponential area to the left (`pexp`) of 10 (`10`), with rate one over beta (`rate=1/beta`)."
- `1 - pexp(15, rate=1/beta)`: "One minus (`1 -`) the area to the left (`pexp`) of 15 (`15`), with rate one over beta (`rate=1/beta`)."
- `pexp(10, rate=1/beta) - pexp(5, rate=1/beta)`: "The area to the left of 10 (`pexp(10, rate=1/beta)`) minus (`-`) the area to the left of 5 (`pexp(5, rate=1/beta)`)."

**Right to left**, the order R runs it

- `beta <- 10 #mean waiting time`: "Take 10 and store it as beta (`<-`); skip the comment (`#`)."
- `pexp(6, rate=1/beta)`: "Divide 1 by beta (`1/beta`), then compute the area left of 6 (`pexp`)."
- `pexp(10, rate=1/beta)`: "Divide 1 by beta (`1/beta`), then compute the area left of 10 (`pexp`)."
- `1 - pexp(15, rate=1/beta)`: "Divide 1 by beta (`1/beta`), compute the area left of 15 (`pexp`), then take it from 1 (`1 -`)."
- `pexp(10, rate=1/beta) - pexp(5, rate=1/beta)`: "Compute the area left of 10 and the area left of 5 (`pexp`), then subtract the second from the first (`-`)."
:::

The lab's written answer for the first part prints $1 - e^{-6/10} = 0.2591818$. That number is $1 - e^{-0.3}$, a slip: $1 - e^{-6/10}$ is 0.4512, the value `pexp` printed. The long version is [The exponential distribution](#/math3042-u5/exponential).

## A camera, a passport office, a coffee shop, a help desk and a chip

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Exponential: $f(x) = \dfrac{1}{\beta}e^{-x/\beta},\ x \ge 0$
- Exponential: $F(x) = 1 - e^{-x/\beta}$
- Exponential: $\mu = \beta$ and $\sigma^2 = \beta^2$

**Not on the sheet, so know it:**

- $P(X > x) = e^{-x/\beta}$, the tail past x.
- $P(a \le X \le b) = F(b) - F(a) = e^{-a/\beta} - e^{-b/\beta}$.
- β = 1/rate, in the question's time unit.
- σ is the square root of the sheet's σ², so σ = β.
:::

```quiz
[
  {"q": "A surveillance camera runs without a reset for a time that is exponential with a mean of 50 days. This is from the unit's practice problems. P(it needs a reset in less than 25 days)? (4 decimals)", "type": "numeric", "answer": 0.3935, "tolerance": 0.0001, "explain": "Let X = the days until the camera needs a reset, exponential with $\\beta = 50$ days, the mean. Less than 25 is the area to the left: $$P(X < 25) = \\underbrace{1}_{\\text{whole area}} - \\underbrace{e^{-25/50}}_{\\text{25 days asked, mean 50}} = 1 - 0.606531 = \\mathbf{0.3935}$$"},
  {"q": "The time between arrivals at a passport office is exponential, with a rate of 0.2 arrivals per minute. This is from the unit's practice problems. P(the time between arrivals is more than 10 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1353, "tolerance": 0.0001, "explain": "Let X = the minutes between arrivals. The question gives a rate, so first turn it into the mean wait: $$\\beta = \\dfrac{1}{\\underbrace{0.2}_{\\text{arrivals per minute}}} = 5 \\text{ min}$$ More than 10 is the tail on its own, with no 1 minus: $$P(X > 10) = \\underbrace{e^{-10/5}}_{\\text{10 min asked, mean 5}} = \\mathbf{0.1353}$$"},
  {"q": "The same camera, mean 50 days. P(it runs between 60 and 80 days without a reset)? (4 decimals)", "type": "numeric", "answer": 0.0993, "tolerance": 0.0001, "explain": "Let X = the days until a reset, $\\beta = 50$. Between is the area past 60 minus the area past 80: $$P(60 \\le X \\le 80) = \\underbrace{e^{-60/50}}_{\\text{past 60 days}} - \\underbrace{e^{-80/50}}_{\\text{past 80 days}} = 0.301194 - 0.201897 = \\mathbf{0.0993}$$"},
  {"q": "A campus coffee shop takes an average of 24 orders an hour, and the time between orders is exponential. P(the next order comes between 1 and 3 minutes from now)? (4 decimals)", "type": "numeric", "answer": 0.3691, "tolerance": 0.0001, "explain": "Let X = the minutes until the next order. The question asks in minutes, so β goes in minutes: $$\\beta = \\dfrac{\\underbrace{60 \\text{ min}}_{\\text{one hour}}}{\\underbrace{24}_{\\text{orders in that hour}}} = 2.5 \\text{ min}$$ $$P(1 \\le X \\le 3) = \\underbrace{e^{-1/2.5}}_{\\text{past 1 min}} - \\underbrace{e^{-3/2.5}}_{\\text{past 3 min}} = 0.670320 - 0.301194 = \\mathbf{0.3691}$$"},
  {"q": "A BCIT help desk gets an average of 4 calls an hour, and the time between calls is exponential. What is the standard deviation of the time between calls, in minutes?", "type": "numeric", "answer": 15, "tolerance": 0.01, "unit": "min", "explain": "Let X = the minutes between calls. $$\\beta = \\dfrac{\\underbrace{60 \\text{ min}}_{\\text{one hour}}}{\\underbrace{4}_{\\text{calls in that hour}}} = 15 \\text{ min}$$ The sheet gives $\\sigma^2 = \\beta^2 = 225$; σ is its square root, so the standard deviation equals the mean: $$\\sigma = \\beta = \\underbrace{15}_{\\text{mean minutes between calls}} = \\mathbf{15 \\text{ min}}$$"},
  {"q": "A chip fails at an exponential rate of 0.048 per thousand hours. This is from the unit's practice problems. P(it runs for at least 15000 hours)? (4 decimals)", "type": "numeric", "answer": 0.4868, "tolerance": 0.0001, "explain": "Let X = the chip's life in thousands of hours, so 15000 hours is $x = 15$. The rate is per thousand hours, so β is in thousands of hours: $$\\beta = \\dfrac{1}{\\underbrace{0.048}_{\\text{failures per thousand hours}}} = 20.8333$$ At least 15 is the tail: $$P(X \\ge 15) = \\underbrace{e^{-15/20.8333}}_{\\text{15 asked, mean 20.8333}} = e^{-0.72} = \\mathbf{0.4868}$$"}
]
```

## Remember

- An exponential X is a wait: X ≥ 0, short waits common, long waits rare.
- **β is the mean wait, and σ = β too.**
- **Less than x: $1 - e^{-x/\beta}$. More than x: $e^{-x/\beta}$. Between: $e^{-a/\beta} - e^{-b/\beta}$.**
- A rate becomes β = 1/rate, in the unit the question asks about.
- The wait is longer than t exactly when no Poisson event falls in t.
- In R, `pexp` takes the rate, 1/β, never β.
