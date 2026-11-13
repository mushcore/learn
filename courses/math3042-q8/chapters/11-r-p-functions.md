---
title: "punif, pnorm, pexp: the area to the left in one line"
minutes: 12
---
<!-- facts: none; every value is from Lab 8, the Unit 5 notes or the demo notebook, or computed -->
Part 2 asks for the same areas you found on paper, typed as one line of R. Each line below is checked against the paper answer it replaces.

## The first letter says what comes back

Every distribution in R has a family of functions: one stem and a letter in front. **The stem names the curve: `unif`, `norm` or `exp`.** **The letter p gives the area to the left of a value.** For example, the p function of the bus wait answers "what is the chance the wait is at most 6 minutes", the same area you shaded on paper.

**The letter q goes the other way, from an area back to a value. The letter r makes random values. The letter d gives the height of the curve, which is not a probability for a continuous variable.** Just like a ruler: p reads the area up to a mark, q finds the mark for a given area.

```diagram
{"type": "grid", "title": "Four letters times three curves", "nodes": [{"id": "h0", "label": "letter", "row": 0, "col": 0}, {"id": "hu", "label": "uniform", "row": 0, "col": 1}, {"id": "hn", "label": "normal", "row": 0, "col": 2}, {"id": "he", "label": "exponential", "row": 0, "col": 3}, {"id": "lp", "label": "p", "sub": "area to the left", "row": 1, "col": 0}, {"id": "pu", "label": "punif", "row": 1, "col": 1}, {"id": "pn", "label": "pnorm", "row": 1, "col": 2}, {"id": "pe", "label": "pexp", "row": 1, "col": 3}, {"id": "lq", "label": "q", "sub": "area to value", "row": 2, "col": 0}, {"id": "qu", "label": "qunif", "row": 2, "col": 1}, {"id": "qn", "label": "qnorm", "row": 2, "col": 2}, {"id": "qe", "label": "qexp", "row": 2, "col": 3}, {"id": "lr", "label": "r", "sub": "random values", "row": 3, "col": 0}, {"id": "ru", "label": "runif", "row": 3, "col": 1}, {"id": "rn", "label": "rnorm", "row": 3, "col": 2}, {"id": "re", "label": "rexp", "row": 3, "col": 3}, {"id": "ld", "label": "d", "sub": "height, not a probability", "row": 4, "col": 0}, {"id": "du", "label": "dunif", "row": 4, "col": 1}, {"id": "dn", "label": "dnorm", "row": 4, "col": 2}, {"id": "de", "label": "dexp", "row": 4, "col": 3}], "hi": ["pu", "pn", "pe"], "caption": "This lesson is the lit row. The q row is the next lesson, the r row the one after."}
```

## The strip that punif measures

The notes' bus comes every 20 minutes and you arrive at a random moment, so the wait is uniform from 0 to 20. The curve is a flat rectangle 20 wide and 0.05 tall. Drag the bounds: the panel prints the area and the `punif` line that gives it.

```widget
pdf-area
{ "dist": "uniform", "a": 0, "b": 20, "lo": 8, "hi": 11, "showCdf": true, "title": "Bus wait, uniform on 0 to 20: the strip from 8 to 11 and the punif line" }
```

## The bus strip in one line

The notes ask for the chance the wait is between 8 and 11 minutes, then more than 12.

- $a = 0$, the shortest possible wait in minutes.
- $b = 20$, the longest possible wait.
- $8$ and $11$, the ends of the strip asked about first.
- $12$, the wait the second question must beat.

On paper the strip is width times height:

$$P(8 \le T \le 11) = (\underbrace{11 - 8}_{\text{strip width}}) \times \underbrace{\tfrac{1}{20}}_{\text{height}} = \mathbf{0.1500}$$

R gets each end's area to the left and subtracts, the move $F(b) - F(a)$. These are the instructor's demo lines:

```r
punif(11, 0, 20) - punif(8, 0, 20)
1 - punif(12, 0, 20)
```

:::info R syntax
| Code | What it does |
|---|---|
| `punif(11, 0, 20)` | Area left of 11: q = 11, min = 0, max = 20. |
| `punif(8, 0, 20)` | Area left of 8, same curve. |
| `-` | Subtracts the smaller area from the larger: the strip between. |
| `1 - punif(12, 0, 20)` | The whole area, 1, minus the area left of 12: the area to the right. |

**Left to right**

- `punif(11, 0, 20) - punif(8, 0, 20)`: "The uniform area up to (`punif`) 11 on 0 to 20, minus (`-`) the uniform area up to 8 (`punif(8, 0, 20)`)."
- `1 - punif(12, 0, 20)`: "One minus (`1 -`) the uniform area up to 12 on 0 to 20 (`punif`)."

**Right to left**, the order R runs it

- `punif(11, 0, 20) - punif(8, 0, 20)`: "Compute the area left of 11 (`punif`), then left of 8, subtract (`-`), print 0.15."
- `1 - punif(12, 0, 20)`: "Compute the area left of 12 (`punif`), subtract it from 1 (`1 -`), print 0.4."
:::

The two lines give 0.15 and 0.4, computed: the notes' 0.1500 and 0.40.

## The slots, by R's own names

**Each p function takes the value first, then the numbers that fix the curve.**

```r
punif(q, min, max)
pnorm(q, mean, sd)
pexp(q, rate)
```

:::info R syntax
| Code | What it does |
|---|---|
| `punif(q, min, max)` | `q` the value, `min` the left end a, `max` the right end b. |
| `pnorm(q, mean, sd)` | `q` the value, `mean` μ, `sd` the standard deviation σ. Left out, `mean` is 0 and `sd` is 1. |
| `pexp(q, rate)` | `q` the value, `rate` the events per time unit, which is 1/β. |

**Left to right**

- `punif(q, min, max)`: "The uniform area to the left of (`punif`) q (`q`) on min (`min`) to max (`max`)."
- `pnorm(q, mean, sd)`: "The normal area to the left of (`pnorm`) q (`q`) with centre mean (`mean`) and spread sd (`sd`)."
- `pexp(q, rate)`: "The exponential area to the left of (`pexp`) q (`q`) when events come at rate (`rate`)."

**Right to left**, the order R runs it

- `punif(q, min, max)`: "Take the rectangle from min to max, then measure its area up to q (`punif`)."
- `pnorm(q, mean, sd)`: "Take the bell with this mean and sd, then measure its area up to q (`pnorm`)."
- `pexp(q, rate)`: "Take the falling curve for this rate, then measure its area up to q (`pexp`)."
:::

A normal value with no curve numbers is a Z. The notes' IQ example is $X \sim N(100, 15^2)$, and the Z examples use the standard curve:

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.
- $x = 120$, the score asked about.
- $z = -1.96$, a Z from the standard normal, mean 0 and sd 1.

```r
pnorm(120, 100, 15)
```

```text
[1] 0.9087888
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(120, 100, 15)` | q = 120, mean = 100, sd = 15: the area left of an IQ of 120. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `pnorm(120, 100, 15)`: "The normal area to the left of (`pnorm`) 120 when the mean is 100 and the sd is 15."

**Right to left**, the order R runs it

- `pnorm(120, 100, 15)`: "Build the bell for mean 100 and sd 15, measure up to 120 (`pnorm`), print 0.9087888."
:::

The table gave 0.9082, because it rounds Z = 1.3333 to 1.33 first.

```r
pnorm(-1.96)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(-1.96)` | Only q is given, so R uses mean 0 and sd 1: the Z table's area left of −1.96. |

**Left to right**

- `pnorm(-1.96)`: "The standard normal area to the left of (`pnorm`) −1.96."

**Right to left**, the order R runs it

- `pnorm(-1.96)`: "Build the standard bell, measure up to −1.96 (`pnorm`), print the area."
:::

It gives 0.0250, computed, the table's cell for −1.96.

:::warn pexp takes the rate, 1/β, never β
A bus with mean wait $\beta = 10$ minutes has rate 0.1 per minute. Writing 10 in the rate slot models a wait with mean 0.1 minutes.
:::

## Left, right and between, as on paper

**The three paper moves are the three R moves: left is the p function, right is 1 minus it, between is the larger minus the smaller.** For example, "more than 9.02 V" is everything except "at most 9.02 V".

The lab's batteries have voltages that follow a bell.

- $\mu = 9.01$ V, the mean voltage.
- $\sigma = 0.05$ V, the standard deviation.
- $9.03$, $9.02$, and $8.9$ to $9.1$: the voltages asked about, below, above and between.

```r
mu <- 9.01
sig <- 0.05
pnorm( 9.03, mean=mu, sd=sig )
1 - pnorm( 9.02, mean=mu, sd=sig )
pnorm(9.1, mu, sig) - pnorm(8.9, mu, sig)
```

```text
[1] 0.6554
[1] 0.4207
[1] 0.9502
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- 9.01`, `sig <- 0.05` | `<-` stores each number under a name, so the lines below use the names. |
| `pnorm( 9.03, mean=mu, sd=sig )` | `mean=` and `sd=` name the slots. Named slots may come in any order. Spaces inside the brackets change nothing. |
| `1 - pnorm( 9.02, … )` | One minus the area left of 9.02: the area to the right. |
| `pnorm(9.1, mu, sig) - pnorm(8.9, mu, sig)` | Unnamed slots go in R's order, q, mean, sd. Larger area minus smaller: between 8.9 and 9.1. |

**Left to right**

- `mu <- 9.01`, `sig <- 0.05`: "Store 9.01 under mu (`mu <-`) and 0.05 under sig (`sig <-`)."
- `pnorm( 9.03, mean=mu, sd=sig )`: "The normal area to the left of (`pnorm`) 9.03 with mean mu (`mean=mu`) and sd sig (`sd=sig`)."
- `1 - pnorm( 9.02, mean=mu, sd=sig )`: "One minus (`1 -`) the normal area to the left of 9.02 (`pnorm`)."
- `pnorm(9.1, mu, sig) - pnorm(8.9, mu, sig)`: "The area left of 9.1 (`pnorm(9.1, …)`) minus (`-`) the area left of 8.9 (`pnorm(8.9, …)`)."

**Right to left**, the order R runs it

- `mu <- 9.01`, `sig <- 0.05`: "Store each value under its name (`<-`)."
- `pnorm( 9.03, mean=mu, sd=sig )`: "Look up mu and sig, measure up to 9.03 (`pnorm`), print it."
- `1 - pnorm( 9.02, mean=mu, sd=sig )`: "Measure up to 9.02 (`pnorm`), subtract from 1 (`1 -`), print it."
- `pnorm(9.1, mu, sig) - pnorm(8.9, mu, sig)`: "Measure both areas (`pnorm`), subtract (`-`), print it."
:::

The lab checked the third line with the Z table. One Z per bound:

$$Z_1 = \dfrac{\underbrace{8.9}_{\text{lower limit}} - \underbrace{9.01}_{\text{mean}}}{\underbrace{0.05}_{\text{standard deviation}}} = -2.20 \qquad Z_2 = \dfrac{\underbrace{9.1}_{\text{upper limit}} - \underbrace{9.01}_{\text{mean}}}{\underbrace{0.05}_{\text{standard deviation}}} = 1.80$$

$$P(8.9 < X < 9.1) = \underbrace{0.9641}_{\text{table at } 1.80} - \underbrace{0.0139}_{\text{table at } -2.20} = \mathbf{0.9502}$$

The first two lines agree with the table as well: their Z values, 0.40 and 0.20, already have two decimals.

R also has a switch for the right tail. The notes' flight radiation has mean 4.35 mrem and standard deviation 0.5 mrem, and both demo lines below ask for more than 5.00 mrem:

```r
mu <- 4.35
sigma <- 0.500
1 - pnorm(5.0, mu, sigma)
pnorm(5.0, mu, sigma, lower.tail=FALSE)
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- 4.35`, `sigma <- 0.500` | Stores the mean and the standard deviation. |
| `1 - pnorm(5.0, mu, sigma)` | One minus the area left of 5.0: the right tail. |
| `lower.tail=FALSE` | Tells `pnorm` to return the area to the right instead of the left. |

**Left to right**

- `mu <- 4.35`, `sigma <- 0.500`: "Store 4.35 under mu and 0.5 under sigma (`<-`)."
- `1 - pnorm(5.0, mu, sigma)`: "One minus (`1 -`) the normal area to the left of 5.0 (`pnorm`)."
- `pnorm(5.0, mu, sigma, lower.tail=FALSE)`: "The normal area beyond 5.0 (`pnorm`), measured from the right (`lower.tail=FALSE`)."

**Right to left**, the order R runs it

- `mu <- 4.35`, `sigma <- 0.500`: "Store both values (`<-`)."
- `1 - pnorm(5.0, mu, sigma)`: "Measure up to 5.0 (`pnorm`), subtract from 1 (`1 -`)."
- `pnorm(5.0, mu, sigma, lower.tail=FALSE)`: "Switch to the right tail (`lower.tail=FALSE`), measure beyond 5.0 (`pnorm`)."
:::

Both print the same number, 0.0968 to four decimals, computed. That is the notes' table answer, $1 - 0.9032$.

## The exponential bus with pexp

The lab's second bus has no timetable: the wait has mean 10 minutes, and short waits are more common than long ones. The curve starts high at 0 and falls.

- $\beta = 10$, the mean wait in minutes.
- rate $= 1/\beta = 0.1$, the buses per minute.
- $6$, $10$, $15$, and $5$ to $10$: the waits asked about.

```widget
exp-wait
{ "beta": 10, "unit": "min", "x": 6, "mode": "single", "title": "Exponential bus, β = 10 min: the area left of 6 and the pexp line" }
```

```r
beta <- 10
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
| `beta <- 10` | Stores the mean wait. |
| `rate=1/beta` | Fills the `rate` slot with 1 divided by beta, 0.1. R works out `1/beta` before the call. |
| `pexp(6, rate=1/beta)` | q = 6: the area left of 6 minutes. `pexp(10, …)` is the same for 10. |
| `1 - pexp(15, rate=1/beta)` | One minus the area left of 15: more than 15 minutes. |
| `pexp(10, …) - pexp(5, …)` | Larger area minus smaller: between 5 and 10 minutes. |

**Left to right**

- `beta <- 10`: "Store 10 under beta (`beta <-`)."
- `pexp(6, rate=1/beta)`, `pexp(10, rate=1/beta)`: "The exponential area to the left of (`pexp`) 6, then 10, with rate one over beta (`rate=1/beta`)."
- `1 - pexp(15, rate=1/beta)`: "One minus (`1 -`) the exponential area to the left of 15 (`pexp`)."
- `pexp(10, rate=1/beta) - pexp(5, rate=1/beta)`: "The area left of 10 (`pexp(10, …)`) minus (`-`) the area left of 5 (`pexp(5, …)`)."

**Right to left**, the order R runs it

- `beta <- 10`: "Store 10 (`<-`)."
- `pexp(6, rate=1/beta)`, `pexp(10, rate=1/beta)`: "Compute 0.1 (`1/beta`), then measure up to 6, then up to 10 (`pexp`)."
- `1 - pexp(15, rate=1/beta)`: "Compute 0.1, measure up to 15 (`pexp`), subtract from 1 (`1 -`)."
- `pexp(10, rate=1/beta) - pexp(5, rate=1/beta)`: "Measure both areas (`pexp`), subtract (`-`)."
:::

The first line on paper is the formula $F(x) = 1 - e^{-x/\beta}$:

$$F(6) = 1 - e^{-\underbrace{6}_{\text{wait asked}}/\underbrace{10}_{\beta}} = 1 - \underbrace{0.548812}_{e^{-0.6}} = \mathbf{0.4512}$$

## dunif is a height, not a probability

The notes ask for the chance the bus wait is exactly 4 minutes. **One exact value has probability 0 for a continuous variable.** The demo marks the tempting line as wrong:

```r
dunif(4, 0, 20)  # WRONG!!!
```

:::info R syntax
| Code | What it does |
|---|---|
| `dunif(4, 0, 20)` | x = 4, min = 0, max = 20: the height of the rectangle at 4. |
| `# WRONG!!!` | `#` starts a comment, which R ignores. |

**Left to right**

- `dunif(4, 0, 20)  # WRONG!!!`: "The height of the uniform curve (`dunif`) at 4 on 0 to 20, with a note (`#`) that this is the wrong answer."

**Right to left**, the order R runs it

- `dunif(4, 0, 20)  # WRONG!!!`: "Skip the comment (`#`), build the rectangle from 0 to 20, read its height at 4 (`dunif`)."
:::

It returns 0.05, computed, the height 1/20. Just like the width of a single line on a ruler: zero, however tall the rectangle. The right answer is 0.

## exp() and log() type the formula itself

**`exp()` is $e$ to a power and `log()` is ln, the key that undoes $e^x$.** For example, a percentile solved with ln on paper can be typed in R exactly as written.

The notes' bank teller serves 30 customers an hour, so the mean service time is 2 minutes.

- $\beta = 2$, the mean service time in minutes.
- $1.5$ and $2.5$, the ends of the interval asked about.
- $1$, the minutes already spent with the customer in the conditional question.
- $0.75$, the area for the 75th percentile.

```r
beta <- 2
rate <- 1/beta
pexp(2.5, rate) - pexp(1.5, rate)
(1 - exp(-2.5/beta)) - (1 - exp(-1.5/beta))
(pexp(3.5, rate) - pexp(2.5, rate))/(1 - pexp(1, rate))
log(1 - 0.75)*-2
```

:::info R syntax
| Code | What it does |
|---|---|
| `beta <- 2`, `rate <- 1/beta` | Stores the mean, then 0.5, the customers per minute, under the name `rate`. |
| `pexp(2.5, rate)` | The second unnamed slot of `pexp` is `rate`. |
| `exp(-2.5/beta)` | $e^{-2.5/2}$. Brackets hold the whole power. |
| `(1 - exp(…)) - (1 - exp(…))` | $F(2.5) - F(1.5)$ typed from the formula sheet. |
| `( … )/(1 - pexp(1, rate))` | `/` divides: the area from 2.5 to 3.5 over the area beyond 1, the conditional probability. |
| `log(1 - 0.75)*-2` | `log()` is ln. `*` multiplies, so this is −2 × ln(0.25). |

**Left to right**

- `beta <- 2`, `rate <- 1/beta`: "Store 2 under beta, then one over beta under rate (`<-`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "The area left of 2.5 (`pexp`) minus (`-`) the area left of 1.5."
- `(1 - exp(-2.5/beta)) - (1 - exp(-1.5/beta))`: "One minus e to the minus 2.5 over beta (`1 - exp(…)`), minus (`-`) one minus e to the minus 1.5 over beta."
- `(pexp(3.5, rate) - pexp(2.5, rate))/(1 - pexp(1, rate))`: "The area from 2.5 to 3.5 (`pexp(3.5, …) - pexp(2.5, …)`) divided by (`/`) the area beyond 1 (`1 - pexp(1, rate)`)."
- `log(1 - 0.75)*-2`: "The natural log (`log`) of one minus 0.75, times minus 2 (`*-2`)."

**Right to left**, the order R runs it

- `beta <- 2`, `rate <- 1/beta`: "Store 2, compute 0.5 (`1/beta`), store it (`<-`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "Measure both areas (`pexp`), subtract (`-`)."
- `(1 - exp(-2.5/beta)) - (1 - exp(-1.5/beta))`: "Compute each power, raise e to it (`exp`), subtract each from 1, subtract the results."
- `(pexp(3.5, rate) - pexp(2.5, rate))/(1 - pexp(1, rate))`: "Compute the top difference, compute the bottom tail, divide (`/`)."
- `log(1 - 0.75)*-2`: "Compute 0.25, take its ln (`log`), multiply by −2 (`*`)."
:::

The first three lines print 0.1859, computed, the notes' answer for parts a and b. The paper line for the second:

$$\Big(1 - \underbrace{0.286505}_{e^{-2.5/2}}\Big) - \Big(1 - \underbrace{0.472367}_{e^{-1.5/2}}\Big) = \mathbf{0.1859}$$

The last line prints 2.7726, computed, the notes' 75th percentile of 2.77 minutes. Percentiles come in the next lesson, [qnorm, qexp, qunif](#/math3042-q8/r-q-functions). The long version of this lesson is [Continuous distributions in R](#/math3042-u5/continuous-in-r).

## A SkyTrain wait, a bolt line and a help desk

A SkyTrain comes every 8 minutes and you arrive at a random moment, so the wait is uniform.

- $a = 0$, the shortest wait in minutes.
- $b = 8$, the longest wait.

A factory cuts bolts whose lengths follow a bell.

- $\mu = 50$ mm, the mean length.
- $\sigma = 0.4$ mm, the standard deviation.

A help desk's waits between calls are exponential.

- $\beta = 4$, the mean wait between calls in minutes.
- rate $= 1/4 = 0.25$, the calls per minute.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Uniform: $F(x) = \dfrac{x-a}{b-a},\ x \ge a$
- Exponential: $F(x) = 1 - e^{-x/\beta}$; $\mu = \beta$
- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- $P(X > x) = 1 - F(x)$; $P(a \le X \le b) = F(b) - F(a)$.
- β = 1/rate, in the question's time unit; R's rate slot takes 1/β.
- The Z table gives the area to the left of z.
- Every R function name and its slot order: nothing in RStudio is on the sheet.
:::

```quiz
[
  {"type": "fill", "q": "P(the SkyTrain wait is less than 3 minutes). Type the function name.", "code": "___(3, 0, 8)", "answer": ["punif"], "explain": "The wait is uniform, and less than 3 is the area to the left, so the p function of the uniform: `punif(3, 0, 8)`, q = 3, min = 0, max = 8. On paper: $$\\underbrace{\\tfrac{3 - 0}{8 - 0}}_{\\text{strip width over full width}} = \\mathbf{0.3750}$$"},
  {"type": "fill", "q": "P(the next help desk call comes within 2 minutes). Type what goes in the rate slot, using the name `beta`.", "code": "beta <- 4\npexp(2, rate=___)", "answer": ["1/beta", "1 / beta"], "explain": "`pexp` takes the rate, one over the mean: `pexp(2, rate=1/beta)`. On paper: $$F(2) = 1 - e^{-\\underbrace{2}_{\\text{minutes}}/\\underbrace{4}_{\\beta}} = 1 - \\underbrace{0.606531}_{e^{-0.5}} = \\mathbf{0.3935}$$ Writing `rate=beta` would model a mean wait of a quarter of a minute."},
  {"type": "fill", "q": "P(a bolt is longer than 50.6 mm). Type the number that goes in the blank.", "code": "___ - pnorm(50.6, 50, 0.4)", "answer": ["1"], "explain": "Longer than is the right tail: the whole area, 1, minus the area to the left. `1 - pnorm(50.6, 50, 0.4)`. On paper: $$Z = \\dfrac{\\underbrace{50.6}_{\\text{length asked}} - \\underbrace{50}_{\\text{mean}}}{\\underbrace{0.4}_{\\text{standard deviation}}} = 1.50$$ $$1 - \\underbrace{0.9332}_{\\text{table at } 1.50} = \\mathbf{0.0668}$$"},
  {"type": "fill", "q": "P(a bolt is between 49.6 and 50.6 mm). Type the number that goes in the blank.", "code": "pnorm(___, 50, 0.4) - pnorm(49.6, 50, 0.4)", "answer": ["50.6"], "explain": "Between is the larger area minus the smaller, so the upper bound goes first: `pnorm(50.6, 50, 0.4) - pnorm(49.6, 50, 0.4)`. On paper, $Z = -1.00$ for 49.6 and $Z = 1.50$ for 50.6: $$\\underbrace{0.9332}_{\\text{table at } 1.50} - \\underbrace{0.1587}_{\\text{table at } -1.00} = \\mathbf{0.7745}$$"},
  {"type": "fill", "q": "The help desk has been quiet for 1 minute. P(the next call comes between 2 and 4 minutes after the last one). Type the number in the blank.", "code": "rate <- 1/4\n(pexp(4, rate) - pexp(2, rate))/(1 - pexp(___, rate))", "answer": ["1"], "explain": "The condition is the minute already waited, so the bottom is the area beyond 1: `1 - pexp(1, rate)`. Memoryless: the answer equals a fresh wait from 1 to 3 minutes. $$\\underbrace{0.778801}_{e^{-1/4}} - \\underbrace{0.472367}_{e^{-3/4}} = \\mathbf{0.3064}$$"},
  {"type": "fill", "q": "The same help desk chance as the second item, typed from the formula sheet. Type the function name.", "code": "1 - ___(-2/4)", "answer": ["exp"], "explain": "$F(x) = 1 - e^{-x/\\beta}$, and $e$ to a power is `exp()` in R: `1 - exp(-2/4)`. It prints the same value as `pexp(2, rate=1/4)`: $$1 - \\underbrace{0.606531}_{e^{-2/4}} = \\mathbf{0.3935}$$"},
  {"type": "text", "q": "Write the full line on paper for P(the help desk waits more than 6 minutes for the next call), then type the name of the function you used.", "answer": ["pexp", "pexp()", "exp", "exp()"], "explain": "More than 6 is one minus the area to the left: `1 - pexp(6, rate=1/4)`, or from the formula `exp(-6/4)`. On paper: $$P(X > 6) = e^{-\\underbrace{6}_{\\text{minutes}}/\\underbrace{4}_{\\beta}} = \\mathbf{0.2231}$$ `pexp(6, rate=1/4) - 1` would give a negative number."}
]
```

## Remember

- p gives the area to the left; the stem says which curve.
- Slots: `punif` value, min, max; `pnorm` value, mean, sd; `pexp` value, rate.
- `rate=1/beta`, never beta.
- Right tail: `1 -` in front, or `lower.tail=FALSE`. Between: larger minus smaller.
- `pnorm` with only a value is the Z table.
- `dunif` and the other d functions give a height; one exact value has probability 0.
- `exp()` is $e^x$, `log()` is ln.
