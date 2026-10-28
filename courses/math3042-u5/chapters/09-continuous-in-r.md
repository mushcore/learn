---
title: punif, pnorm, qnorm, pexp, qexp and curve()
minutes: 22
---
<!-- facts: classic.formula.damage-roll -->

Every area and percentile in this unit is one line of base R, in the same `p`/`q`/`d`/`r` pattern the Unit 4 notebook used for `dbinom` and `pbinom`. No Unit 5 notebook is posted yet; the one R line in the notes, `pnorm(120, 100, 15)`, sets the style. A uniform damage multiplier from MapleStory Classic gives `punif` and `runif` a second set of numbers to check.

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(120, 100, 15)` | The normal left-tail area: q = 120, mean = 100, sd = 15. |

**Left to right**

- `pnorm(120, 100, 15)`: "The normal area to the left (`pnorm`) of 120 (`120`) on the curve with mean 100 (`100`) and sd 15 (`15`)."

**Right to left**, the order R runs it

- `pnorm(120, 100, 15)`: "Take the curve with mean 100 and sd 15 (`100, 15`), then find the area left of 120 (`pnorm(120, …)`)."
:::

## The letter in front says what the function answers

| Prefix | Answers | Uniform | Normal | Exponential |
|---|---|---|---|---|
| `p` | an area: $P(X \le x)$ | `punif(x, a, b)` | `pnorm(x, mu, sigma)` | `pexp(x, rate)` |
| `q` | a percentile: the $x$ with $P(X \le x) = p$ | `qunif(p, a, b)` | `qnorm(p, mu, sigma)` | `qexp(p, rate)` |
| `d` | the density height $f(x)$ | `dunif` | `dnorm` | `dexp` |
| `r` | random draws | `runif(n, a, b)` | `rnorm(n, mu, sigma)` | `rexp(n, rate)` |

:::info R syntax
| Code | What it does |
|---|---|
| `punif(x, a, b)` | Slots: the value (R calls it `q`), then `min` = a and `max` = b. |
| `pnorm(x, mu, sigma)` | Slots: the value `q`, then `mean` = μ and `sd` = σ. |
| `pexp(x, rate)` | Slots: the value `q`, then `rate` = 1/β. |
| `qunif(p, a, b)`, `qnorm(p, mu, sigma)`, `qexp(p, rate)` | Same parameters, but the first slot is a probability `p` and the result is an x. |
| `runif(n, a, b)`, `rnorm(n, mu, sigma)`, `rexp(n, rate)` | The first slot `n` is how many random values to draw; the parameters follow. |
| `dunif`, `dnorm`, `dexp` | Named only: the same slots as the `p` functions, returning the density height. |

**Left to right**

- `punif(x, a, b)`: "The uniform area to the left (`punif`) of x (`x`) on a (`a`) to b (`b`)."
- `pnorm(x, mu, sigma)`: "The normal area to the left (`pnorm`) of x (`x`) with mean mu (`mu`) and sd sigma (`sigma`)."
- `pexp(x, rate)`: "The exponential area to the left (`pexp`) of x (`x`) at the given rate (`rate`)."
- `qunif(p, a, b)`, `qnorm(p, mu, sigma)`, `qexp(p, rate)`: "The value with probability p (`p`) below it (`qunif`, `qnorm`, `qexp`) for the same parameters."
- `runif(n, a, b)`, `rnorm(n, mu, sigma)`, `rexp(n, rate)`: "n (`n`) random draws (`runif`, `rnorm`, `rexp`) with the same parameters."

**Right to left**, the order R runs it

- `punif(x, a, b)`: "Take the interval a to b (`a, b`) and the value x (`x`), then return the area to its left (`punif`)."
- `pnorm(x, mu, sigma)`: "Take the curve's mean and sd (`mu, sigma`) and the value x (`x`), then return the area to its left (`pnorm`)."
- `pexp(x, rate)`: "Take the rate (`rate`) and the value x (`x`), then return the area to its left (`pexp`)."
- `qunif(p, a, b)`, `qnorm(p, mu, sigma)`, `qexp(p, rate)`: "Take the parameters and the probability p (`p`), then return the x with that area to its left (`qunif`, `qnorm`, `qexp`)."
- `runif(n, a, b)`, `rnorm(n, mu, sigma)`, `rexp(n, rate)`: "Take the parameters and the count n (`n`), then generate that many random values (`runif`, `rnorm`, `rexp`)."
:::

`p` and `q` are inverses: `qnorm(pnorm(1.96))` is 1.96. The normal defaults are `mu = 0, sigma = 1`, so `pnorm(z)` alone is the Z table. The exponential takes a **rate**, $1/\beta$, never $\beta$.

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(pnorm(1.96))` | The inner call runs first and gives an area; `qnorm` turns that area straight back into 1.96. |
| `pnorm(z)` | One argument: q = z, with `mean` and `sd` at their defaults 0 and 1. |

**Left to right**

- `qnorm(pnorm(1.96))`: "The value with that probability below it (`qnorm`) for the standard normal area to the left (`pnorm`) of 1.96 (`1.96`)."
- `pnorm(z)`: "The standard normal area to the left (`pnorm`) of z (`z`)."

**Right to left**, the order R runs it

- `qnorm(pnorm(1.96))`: "Take 1.96 (`1.96`), find the area to its left (`pnorm`), then find the z with that area to its left (`qnorm`), which is 1.96 again."
- `pnorm(z)`: "Take z (`z`) and find the standard normal area to its left (`pnorm`)."
:::

## punif: the bus

Every uniform area is a difference of two `punif` values, or `1 -` one of them. The arguments are `min` and `max`, the ends $a$ and $b$ of the interval; `qunif(0.75, 0, 20)` returns 15, the 75th percentile of the wait, since for a flat density the percentile is simply $a + p(b - a)$.

:::info R syntax
| Code | What it does |
|---|---|
| `qunif(0.75, 0, 20)` | The `q` prefix goes backwards: p = 0.75, min = 0, max = 20; returns the x with 0.75 to its left. |

**Left to right**

- `qunif(0.75, 0, 20)`: "The uniform value with probability 0.75 (`0.75`) below it (`qunif`) on 0 (`0`) to 20 (`20`)."

**Right to left**, the order R runs it

- `qunif(0.75, 0, 20)`: "Take the interval 0 to 20 (`0, 20`) and the probability 0.75 (`0.75`), then return the x with that area to its left (`qunif`)."
:::

```r
punif(11, 0, 20) - punif(8, 0, 20)   # between 8 and 11 minutes
1 - punif(12, 0, 20)                 # more than 12 minutes
punif(4, 0, 20) - punif(4, 0, 20)    # exactly 4 minutes
```

```text
[1] 0.15
[1] 0.4
[1] 0
```

:::info R syntax
| Code | What it does |
|---|---|
| `# between 8 and 11 minutes` | `#` starts a comment: R ignores the rest of the line. |
| `punif(11, 0, 20) - punif(8, 0, 20)` | `punif` fills q = 11 (then 8), min = 0, max = 20; `-` subtracts the two left areas. |
| `1 - punif(12, 0, 20)` | One minus the left area: the right tail above 12. |
| `punif(4, 0, 20) - punif(4, 0, 20)` | The same call twice: a zero-width interval. |
| `[1]` | In the output, the position of the first value on each printed line; one line per command. |

**Left to right**

- `punif(11, 0, 20) - punif(8, 0, 20)`: "The uniform area to the left (`punif`) of 11 (`11`) on 0 (`0`) to 20 (`20`), minus (`-`) the uniform area to the left (`punif`) of 8 (`8`) on the same interval."
- `1 - punif(12, 0, 20)`: "One (`1`) minus (`-`) the uniform area to the left (`punif`) of 12 (`12`) on 0 to 20 (`0, 20`)."
- `punif(4, 0, 20) - punif(4, 0, 20)`: "The uniform area to the left (`punif`) of 4 (`4`) on 0 to 20 (`0, 20`), minus (`-`) that same area again (`punif(4, 0, 20)`)."

**Right to left**, the order R runs it

- `punif(11, 0, 20) - punif(8, 0, 20)`: "Find the area left of 11 on 0 to 20 (`punif(11, 0, 20)`), find the area left of 8 (`punif(8, 0, 20)`), then subtract the second from the first (`-`)."
- `1 - punif(12, 0, 20)`: "Find the area left of 12 on 0 to 20 (`punif(12, 0, 20)`), then take it away from one (`1 -`)."
- `punif(4, 0, 20) - punif(4, 0, 20)`: "Find the area left of 4 (`punif(4, 0, 20)`) twice, then subtract one from the other (`-`)."
:::

## pnorm: the Z table and the three normal examples

```r
pnorm(-1.96)                       # P(Z <= -1.96), left tail
1 - pnorm(2.33)                    # P(Z > 2.33), right tail
pnorm(1.10) - pnorm(0.55)          # P(0.55 <= Z <= 1.10)
pnorm(120, 100, 15)                # IQ below 120, no standardizing needed
pnorm((120 - 100) / 15)            # the same through Z = 1.3333
pnorm(1.33)                        # Z rounded to two decimals, the table's value
pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)   # radiation (a)
1 - pnorm(5, 4.35, 0.5)                        # radiation (b)
1 - pnorm(0.5, 0, 0.22)            # noise above 0.5 V: a 0 bit read as 1
```

```text
[1] 0.0249979
[1] 0.009903076
[1] 0.1554936
[1] 0.9087888
[1] 0.9087888
[1] 0.9082409
[1] 0.4031995
[1] 0.09680048
[1] 0.01152131
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(-1.96)` | q = −1.96; `mean` and `sd` are left out, so they take their defaults 0 and 1: the Z table. |
| `1 - pnorm(2.33)` | The right tail above 2.33. |
| `pnorm(1.10) - pnorm(0.55)` | Upper left tail minus lower left tail. |
| `pnorm(120, 100, 15)` | q = 120, mean = 100, sd = 15. |
| `pnorm((120 - 100) / 15)` | The inner brackets compute Z first; then the standard normal's left area at that Z. |
| `pnorm(1.33)` | The same with Z rounded to two decimals. |
| `pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)`, `1 - pnorm(5, 4.35, 0.5)` | mean = 4.35, sd = 0.5: a between and a right tail. |
| `1 - pnorm(0.5, 0, 0.22)` | mean = 0, sd = 0.22: the right tail above 0.5. |

**Left to right**

- `pnorm(-1.96)`: "The standard normal area to the left (`pnorm`) of minus 1.96 (`-1.96`)."
- `1 - pnorm(2.33)`: "One (`1`) minus (`-`) the standard normal area to the left (`pnorm`) of 2.33 (`2.33`)."
- `pnorm(1.10) - pnorm(0.55)`: "The area to the left (`pnorm`) of 1.10 (`1.10`), minus (`-`) the area to the left (`pnorm`) of 0.55 (`0.55`)."
- `pnorm(120, 100, 15)`: "The normal area to the left (`pnorm`) of 120 (`120`) with mean 100 (`100`) and sd 15 (`15`)."
- `pnorm((120 - 100) / 15)`: "The standard normal area to the left (`pnorm`) of 120 minus 100 (`120 - 100`), divided by (`/`) 15 (`15`)."
- `pnorm(1.33)`: "The standard normal area to the left (`pnorm`) of 1.33 (`1.33`)."
- `pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)`: "The normal area left (`pnorm`) of 5 (`5`) with mean 4.35 and sd 0.5 (`4.35, 0.5`), minus (`-`) the area left (`pnorm`) of 4.35 (`4.35`) on the same curve."
- `1 - pnorm(5, 4.35, 0.5)`: "One (`1`) minus (`-`) the normal area left (`pnorm`) of 5 (`5`) with mean 4.35 and sd 0.5 (`4.35, 0.5`)."
- `1 - pnorm(0.5, 0, 0.22)`: "One (`1`) minus (`-`) the normal area left (`pnorm`) of 0.5 (`0.5`) with mean 0 (`0`) and sd 0.22 (`0.22`)."

**Right to left**, the order R runs it

- `pnorm(-1.96)`: "Take minus 1.96 (`-1.96`) and find the standard normal area to its left (`pnorm`)."
- `1 - pnorm(2.33)`: "Find the area left of 2.33 (`pnorm(2.33)`), then take it away from one (`1 -`)."
- `pnorm(1.10) - pnorm(0.55)`: "Find the area left of 1.10 (`pnorm(1.10)`) and left of 0.55 (`pnorm(0.55)`), then subtract (`-`)."
- `pnorm(120, 100, 15)`: "Take the curve with mean 100 and sd 15 (`100, 15`) and find the area left of 120 (`pnorm(120, …)`)."
- `pnorm((120 - 100) / 15)`: "Subtract 100 from 120 inside the brackets (`120 - 100`), divide by 15 (`/ 15`), then find the standard normal area left of that Z (`pnorm`)."
- `pnorm(1.33)`: "Take 1.33 (`1.33`) and find the standard normal area to its left (`pnorm`)."
- `pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)`: "Find the area left of 5 (`pnorm(5, 4.35, 0.5)`) and left of 4.35 (`pnorm(4.35, 4.35, 0.5)`), then subtract (`-`)."
- `1 - pnorm(5, 4.35, 0.5)`: "Find the area left of 5 (`pnorm(5, 4.35, 0.5)`), then take it away from one (`1 -`)."
- `1 - pnorm(0.5, 0, 0.22)`: "Find the area left of 0.5 under the noise curve (`pnorm(0.5, 0, 0.22)`), then take it away from one (`1 -`)."
:::

The IQ lines show why the table and R differ in the fourth decimal: R keeps $Z = 1.3333$, the table rounds it to 1.33. Passing `mu` and `sigma` to `pnorm` skips the standardizing step altogether. A right tail can also be asked for directly with `pnorm(2.33, lower.tail = FALSE)`, which returns the same 0.009903076 as `1 - pnorm(2.33)`; the `1 -` form is the one that matches the table arithmetic on the answer line.

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(2.33, lower.tail = FALSE)` | q = 2.33 with the standard normal; `lower.tail = FALSE` returns the area to the right instead of the left. |

**Left to right**

- `pnorm(2.33, lower.tail = FALSE)`: "The standard normal area (`pnorm`) beyond 2.33 (`2.33`), taking the upper tail instead of the lower (`lower.tail = FALSE`)."

**Right to left**, the order R runs it

- `pnorm(2.33, lower.tail = FALSE)`: "Switch off the lower tail (`lower.tail = FALSE`), take 2.33 (`2.33`), then return the area to its right (`pnorm`)."
:::

## qnorm: percentiles without the table

```r
qnorm(0.95)                        # z with 95% below: the table's 1.645
qnorm(0.95, 4.35, 0.5)             # radiation (c): the 95th percentile in mrem
4.35 + qnorm(0.95) * 0.5           # the same by mu + z sigma
qnorm(c(0.90, 0.975, 0.99, 0.995)) # z for 1.28, 1.96, 2.33, 2.576
```

```text
[1] 1.644854
[1] 5.172427
[1] 5.172427
[1] 1.281552 1.959964 2.326348 2.575829
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(0.95)` | p = 0.95 with the default mean 0 and sd 1: the z with 0.95 to its left. |
| `qnorm(0.95, 4.35, 0.5)` | p = 0.95, mean = 4.35, sd = 0.5: the percentile in mrem. |
| `4.35 + qnorm(0.95) * 0.5` | `*` multiplies and runs before `+`: μ + zσ. |
| `qnorm(c(0.90, 0.975, 0.99, 0.995))` | `c()` combines four probabilities into a vector; `qnorm` returns one z for each, all printed on one line. |

**Left to right**

- `qnorm(0.95)`: "The standard normal value with probability 0.95 (`0.95`) below it (`qnorm`)."
- `qnorm(0.95, 4.35, 0.5)`: "The value with probability 0.95 (`0.95`) below it (`qnorm`) on the curve with mean 4.35 (`4.35`) and sd 0.5 (`0.5`)."
- `4.35 + qnorm(0.95) * 0.5`: "4.35 (`4.35`) plus (`+`) the standard normal value with 0.95 below it (`qnorm(0.95)`) times (`*`) 0.5 (`0.5`)."
- `qnorm(c(0.90, 0.975, 0.99, 0.995))`: "The standard normal values (`qnorm`) for each of the combined probabilities (`c()`) 0.90, 0.975, 0.99 and 0.995."

**Right to left**, the order R runs it

- `qnorm(0.95)`: "Take 0.95 (`0.95`) and find the z with that much area to its left (`qnorm`)."
- `qnorm(0.95, 4.35, 0.5)`: "Take the curve with mean 4.35 and sd 0.5 (`4.35, 0.5`) and find the x with 0.95 to its left (`qnorm(0.95, …)`)."
- `4.35 + qnorm(0.95) * 0.5`: "Find z for 0.95 (`qnorm(0.95)`), multiply it by 0.5 (`* 0.5`), then add 4.35 (`4.35 +`)."
- `qnorm(c(0.90, 0.975, 0.99, 0.995))`: "Combine the four probabilities into a vector (`c()`), then find a z for each one (`qnorm`)."
:::

By hand with $z = 1.645$ the answer is $4.35 + 1.645(0.5) = 5.1725$, which rounds to the same 5.17 mrem.

## pexp and qexp: rate = 1/β

```r
pexp(4, rate = 1/2.5)              # web server (b), beta = 2.5 s
qexp(0.95, rate = 1/2.5)           # web server (e), 95th percentile
rate <- 30/60                      # teller: 30 per hour = 0.5 per minute, beta = 2
pexp(2.5, rate) - pexp(1.5, rate)  # teller (a)
(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))   # teller (b)
qexp(0.75, rate)                   # teller (c)
pexp(4, 2.5)                       # WRONG: rate 2.5 means beta = 0.4 s
```

```text
[1] 0.7981035
[1] 7.489331
[1] 0.1858618
[1] 0.1858618
[1] 2.772589
[1] 0.9999546
```

:::info R syntax
| Code | What it does |
|---|---|
| `pexp(4, rate = 1/2.5)` | q = 4, with the named argument `rate` = 1/β; `/` divides. |
| `qexp(0.95, rate = 1/2.5)` | p = 0.95 and the same rate: the 95th percentile. |
| `rate <- 30/60` | `<-` is assignment: stores 0.5 under the name `rate`. |
| `pexp(2.5, rate) - pexp(1.5, rate)` | The second positional argument fills `rate`, here the stored 0.5. F(2.5) − F(1.5). |
| `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))` | Brackets group: the interval's area divided by P(X > 1). |
| `qexp(0.75, rate)` | p = 0.75: the 75th percentile. |
| `pexp(4, 2.5)` | The unnamed 2.5 fills `rate`, not β, so R answers for a mean of 0.4. |

**Left to right**

- `pexp(4, rate = 1/2.5)`: "The exponential area to the left (`pexp`) of 4 (`4`) with rate (`rate =`) one divided by 2.5 (`1/2.5`)."
- `qexp(0.95, rate = 1/2.5)`: "The value with probability 0.95 (`0.95`) below it (`qexp`) for rate (`rate =`) one divided by 2.5 (`1/2.5`)."
- `rate <- 30/60`: "Store under the name rate (`rate <-`) 30 divided by 60 (`30/60`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "The exponential area left (`pexp`) of 2.5 (`2.5`) at the stored rate (`rate`), minus (`-`) the area left (`pexp`) of 1.5 (`1.5`)."
- `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))`: "The area left of 3.5 (`pexp(3.5, rate)`) minus (`-`) the area left of 2.5 (`pexp(2.5, rate)`), divided by (`/`) one minus (`1 -`) the area left of 1 (`pexp(1, rate)`)."
- `qexp(0.75, rate)`: "The value with probability 0.75 (`0.75`) below it (`qexp`) at the stored rate (`rate`)."
- `pexp(4, 2.5)`: "The exponential area left (`pexp`) of 4 (`4`) with 2.5 (`2.5`) taken as the rate."

**Right to left**, the order R runs it

- `pexp(4, rate = 1/2.5)`: "Divide one by 2.5 (`1/2.5`), pass it as the rate (`rate =`), then find the area left of 4 (`pexp(4, …)`)."
- `qexp(0.95, rate = 1/2.5)`: "Divide one by 2.5 (`1/2.5`), pass it as the rate (`rate =`), then find the x with 0.95 below it (`qexp(0.95, …)`)."
- `rate <- 30/60`: "Divide 30 by 60 (`30/60`), then store the result as rate (`rate <-`)."
- `pexp(2.5, rate) - pexp(1.5, rate)`: "Look up the rate (`rate`), find the area left of 2.5 (`pexp(2.5, rate)`) and left of 1.5 (`pexp(1.5, rate)`), then subtract (`-`)."
- `(pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate))`: "Find the area between 2.5 and 3.5 in the first brackets, find one minus the area left of 1 in the second (`1 - pexp(1, rate)`), then divide (`/`)."
- `qexp(0.75, rate)`: "Look up the rate (`rate`), then find the x with 0.75 below it (`qexp(0.75, …)`)."
- `pexp(4, 2.5)`: "Take 2.5 as the rate (`2.5`), then find the area left of 4 (`pexp(4, …)`), answering for a mean of 0.4 instead of 2.5."
:::

The last line is the trap: R accepted `2.5` as a rate and answered a different question. Write `rate = 1/beta` explicitly.

## curve(): drawing a density

`curve(expr, from, to)` plots an expression in `x`. The notes' IQ figure and the exponential's shape:

```r
curve(dnorm(x, 100, 15), from = 40, to = 160,
      xlab = "IQ", ylab = "prob density f(x)",
      main = "Distribution of IQ Scores (mu = 100, sigma = 15)")
abline(v = 120, lty = 2)                       # the X = 120 cut

curve(dexp(x, rate = 0.4), from = 0, to = 15,
      xlab = "seconds", ylab = "f(x)", main = "Exponential, beta = 2.5")
dnorm(100, 100, 15)                            # peak height of the IQ curve
dexp(0, rate = 0.4)                            # height at 0 is 1/beta
```

```text
[1] 0.02659615
[1] 0.4
```

:::info R syntax
| Code | What it does |
|---|---|
| `curve(dnorm(x, 100, 15), …)` | `curve` plots an expression written in `x`. `dnorm` is the normal density: x, mean = 100, sd = 15. |
| `from = 40, to = 160` | The range of x values to draw over. |
| `xlab = "IQ", ylab = "prob density f(x)"` | The x-axis and y-axis labels, as strings. |
| `main = "…"` | The plot title. |
| `abline(v = 120, lty = 2)` | Adds a line to the current plot: `v = 120` makes it vertical at x = 120, `lty = 2` makes it dashed. |
| `curve(dexp(x, rate = 0.4), from = 0, to = 15, …)` | Plots the exponential density with rate 0.4 from 0 to 15, with its own labels and title. |
| `dnorm(100, 100, 15)` | The density height at x = 100, the peak; it prints. |
| `dexp(0, rate = 0.4)` | The exponential's height at 0; it prints. The two `curve` calls draw but print nothing. |

**Left to right**

- `curve(dnorm(x, 100, 15), …)`: "Draw a curve (`curve`) of the normal density (`dnorm`) at each x (`x`) with mean 100 (`100`) and sd 15 (`15`), from 40 (`from = 40`) to 160 (`to = 160`), with axis labels (`xlab =`, `ylab =`) and a title (`main =`)."
- `abline(v = 120, lty = 2)`: "Add a line (`abline`) that is vertical at 120 (`v = 120`) and dashed (`lty = 2`)."
- `curve(dexp(x, rate = 0.4), …)`: "Draw a curve (`curve`) of the exponential density (`dexp`) at each x (`x`) with rate 0.4 (`rate = 0.4`), from 0 (`from = 0`) to 15 (`to = 15`), with labels and a title (`xlab =`, `ylab =`, `main =`)."
- `dnorm(100, 100, 15)`: "The normal density height (`dnorm`) at 100 (`100`) with mean 100 and sd 15 (`100, 15`)."
- `dexp(0, rate = 0.4)`: "The exponential density height (`dexp`) at 0 (`0`) with rate 0.4 (`rate = 0.4`)."

**Right to left**, the order R runs it

- `curve(dnorm(x, 100, 15), …)`: "Read the range 40 to 160 (`from`, `to`) and the labels, work out the density (`dnorm(x, 100, 15)`) at many x values in that range, then draw them as a line (`curve`)."
- `abline(v = 120, lty = 2)`: "Take the position 120 (`v = 120`) and the dashed style (`lty = 2`), then draw the line on the existing plot (`abline`)."
- `curve(dexp(x, rate = 0.4), …)`: "Read the range 0 to 15 and the labels, work out the density (`dexp(x, rate = 0.4)`) at many x values, then draw the line (`curve`)."
- `dnorm(100, 100, 15)`: "Take x = 100 on the curve with mean 100 and sd 15 (`100, 100, 15`) and return the height there (`dnorm`)."
- `dexp(0, rate = 0.4)`: "Take x = 0 and rate 0.4 (`0, rate = 0.4`) and return the height there (`dexp`)."
:::

The IQ bell peaks at 0.0266 and the exponential starts at 0.4 and decays; both are heights, not probabilities. To shade an area, `polygon()` fills a region: `xs <- seq(40, 120, 0.1); polygon(c(xs, 120, 40), c(dnorm(xs, 100, 15), 0, 0), col = "lightblue")` shades the 0.9088 below 120.

:::info R syntax
| Code | What it does |
|---|---|
| `xs <- seq(40, 120, 0.1)` | from = 40, to = 120, by = 0.1 (filled by position): the x values along the shaded stretch, stored as `xs`. |
| `;` | Separates the two commands on one line. |
| `polygon(c(xs, 120, 40), …)` | Draws a filled shape on the current plot; the first vector is the corners' x values: the curve's xs, then 120 and 40 along the axis. |
| `c(dnorm(xs, 100, 15), 0, 0)` | The matching y values: the curve's height at each x, then 0 and 0 to close the shape along the axis. |
| `col = "lightblue"` | The fill colour. |

**Left to right**

- `xs <- seq(40, 120, 0.1)`: "Store under the name xs (`xs <-`) the sequence (`seq`) from 40 (`40`) to 120 (`120`) in steps of 0.1 (`0.1`)."
- `polygon(c(xs, 120, 40), c(dnorm(xs, 100, 15), 0, 0), col = "lightblue")`: "Fill a shape (`polygon`) whose x corners are xs then 120 and 40 (`c(xs, 120, 40)`) and whose y corners are the normal density (`dnorm`) at xs with mean 100 and sd 15 (`xs, 100, 15`) then 0 and 0 (`c(…, 0, 0)`), in light blue (`col = "lightblue"`)."

**Right to left**, the order R runs it

- `xs <- seq(40, 120, 0.1)`: "Count from 40 to 120 in steps of 0.1 (`seq(40, 120, 0.1)`), then store the values as xs (`xs <-`)."
- `polygon(c(xs, 120, 40), c(dnorm(xs, 100, 15), 0, 0), col = "lightblue")`: "Join xs with 120 and 40 (`c(xs, 120, 40)`), compute the curve heights at xs (`dnorm(xs, 100, 15)`) and add two zeros (`c(…, 0, 0)`), then fill the shape with those corners in light blue (`polygon`, `col =`)."
:::

## runif, rnorm, rexp: simulate and check μ and σ

The Unit 4 habit: draw many values, then `mean()` and `sd()` should land near the formula's $\mu$ and $\sigma$.

```r
set.seed(1)
T <- runif(10000, 0, 20)           # bus waits
mean(T); sd(T)                     # near 10 and 5.77 = 20/sqrt(12)
mean(T > 12)                       # near 0.4: the fraction of TRUEs is an estimate of P(T > 12)

X <- rexp(10000, rate = 1/2.5)     # web server gaps
mean(X); sd(X)                     # both near 2.5: mean = sd = beta
mean(X <= 4)                       # near 0.7981
quantile(X, 0.95)                  # near 7.49

Y <- rnorm(10000, 100, 15)
mean(Y < 120)                      # near 0.9088
```

:::info R syntax
| Code | What it does |
|---|---|
| `set.seed(1)` | Fixes the random-number starting point, so the draws below repeat exactly on every run. |
| `T <- runif(10000, 0, 20)` | n = 10 000 random draws, min = 0, max = 20. Here n is the number of draws. The name `T` hides R's shorthand for TRUE. |
| `mean(T); sd(T)` | `;` separates two commands on one line: the sample mean, then the standard deviation. |
| `mean(T > 12)` | `>` gives a `TRUE`/`FALSE` vector; its mean is the fraction of `TRUE`s, as TRUE counts 1 and FALSE 0. |
| `X <- rexp(10000, rate = 1/2.5)` | 10 000 exponential draws with rate 0.4. |
| `mean(X <= 4)` | `<=` is less than or equal: the fraction of draws at or below 4. |
| `quantile(X, 0.95)` | x = the draws, probs = 0.95: the sample's 95th percentile. |
| `Y <- rnorm(10000, 100, 15)` | 10 000 normal draws: n, mean = 100, sd = 15. |
| `mean(Y < 120)` | `<` is less than: the fraction of draws below 120. |

**Left to right**

- `set.seed(1)`: "Set the random starting point (`set.seed`) to 1 (`1`)."
- `T <- runif(10000, 0, 20)`: "Store under the name T (`T <-`) 10 000 (`10000`) random uniform draws (`runif`) between 0 (`0`) and 20 (`20`)."
- `mean(T); sd(T)`: "The mean (`mean`) of T (`T`), then (`;`) the standard deviation (`sd`) of T (`T`)."
- `mean(T > 12)`: "The mean (`mean`) of whether each value of T (`T`) is greater than (`>`) 12 (`12`)."
- `X <- rexp(10000, rate = 1/2.5)`: "Store under the name X (`X <-`) 10 000 (`10000`) random exponential draws (`rexp`) with rate (`rate =`) one over 2.5 (`1/2.5`)."
- `mean(X); sd(X)`: "The mean (`mean`) of X, then (`;`) the standard deviation (`sd`) of X (`X`)."
- `mean(X <= 4)`: "The mean (`mean`) of whether each X (`X`) is at most (`<=`) 4 (`4`)."
- `quantile(X, 0.95)`: "The sample percentile (`quantile`) of X (`X`) at 0.95 (`0.95`)."
- `Y <- rnorm(10000, 100, 15)`: "Store under the name Y (`Y <-`) 10 000 (`10000`) random normal draws (`rnorm`) with mean 100 (`100`) and sd 15 (`15`)."
- `mean(Y < 120)`: "The mean (`mean`) of whether each Y (`Y`) is less than (`<`) 120 (`120`)."

**Right to left**, the order R runs it

- `set.seed(1)`: "Take 1 (`1`) and fix the random starting point with it (`set.seed`)."
- `T <- runif(10000, 0, 20)`: "Draw 10 000 uniform values on 0 to 20 (`runif(10000, 0, 20)`), then store them as T (`T <-`)."
- `mean(T); sd(T)`: "Look up T (`T`) and average it (`mean`); then (`;`) look up T again and find its standard deviation (`sd`)."
- `mean(T > 12)`: "Compare each value of T with 12 (`T > 12`) to get TRUE or FALSE, then average those (`mean`)."
- `X <- rexp(10000, rate = 1/2.5)`: "Divide one by 2.5 (`1/2.5`), draw 10 000 exponential values at that rate (`rexp`), then store them as X (`X <-`)."
- `mean(X); sd(X)`: "Average X (`mean`); then (`;`) find its standard deviation (`sd`)."
- `mean(X <= 4)`: "Compare each X with 4 (`X <= 4`), then average the TRUEs and FALSEs (`mean`)."
- `quantile(X, 0.95)`: "Take the draws X (`X`) and find the value with 95 % of them below it (`quantile`, `0.95`)."
- `Y <- rnorm(10000, 100, 15)`: "Draw 10 000 normal values with mean 100 and sd 15 (`rnorm(10000, 100, 15)`), then store them as Y (`Y <-`)."
- `mean(Y < 120)`: "Compare each Y with 120 (`Y < 120`), then average the TRUEs and FALSEs (`mean`)."
:::

Without `set.seed` each run prints different numbers; with the seed every run repeats the same draws. Either way the results sit within a few hundredths of the formula values. `mean(X <= 4)` is Lab 4's $k/m$ estimate written in one call.

## punif and runif on Classic's multiplier B

In MapleStory Classic, meowdb's reconstructed damage formula draws a base multiplier B as `uniform(0.8, 1.0)` on every hit [Classic, meowdb's Classic World formulas page, no version shown, checked 2026-10-27]. B is a named uniform with both limits known, so 0.8 and 1.0 are `punif`'s `min` and `max` exactly. The final damage number mixes in a second uniform draw and is not itself uniform; only B is.

```quiz
[
  {"q": "P(B > 0.95): write the full command on paper, then type the name of the function you used.", "type": "text", "answer": ["punif"], "explain": "1 - punif(0.95, 0.8, 1.0). punif is the left tail (0.95 − 0.8)/0.2 = 0.75, so the right tail is 1 − 0.75 = 0.25."},
  {"type": "fill", "q": "Complete the call for the 90th percentile of B.", "code": "qunif(0.9, ___, 1.0)", "answer": ["0.8", ".8"], "explain": "qunif(p, min, max) returns a + p(b − a) = 0.8 + 0.9 × 0.2 = 0.98."}
]
```

```r
1 - punif(0.95, 0.8, 1.0)          # P(B > 0.95): the top quarter of the range
qunif(0.9, 0.8, 1.0)               # 90th percentile of B
```

```text
[1] 0.25
[1] 0.98
```

:::info R syntax
| Code | What it does |
|---|---|
| `1 - punif(0.95, 0.8, 1.0)` | q = 0.95, min = 0.8, max = 1.0; one minus the left area is the right tail. |
| `qunif(0.9, 0.8, 1.0)` | Backwards: p = 0.9, min = 0.8, max = 1.0, the 90th percentile. |

**Left to right**

- `1 - punif(0.95, 0.8, 1.0)`: "One (`1`) minus (`-`) the uniform area to the left (`punif`) of 0.95 (`0.95`) on 0.8 (`0.8`) to 1.0 (`1.0`)."
- `qunif(0.9, 0.8, 1.0)`: "The uniform value with probability 0.9 (`0.9`) below it (`qunif`) on 0.8 (`0.8`) to 1.0 (`1.0`)."

**Right to left**, the order R runs it

- `1 - punif(0.95, 0.8, 1.0)`: "Find the area left of 0.95 on 0.8 to 1.0 (`punif(0.95, 0.8, 1.0)`), then take it away from one (`1 -`)."
- `qunif(0.9, 0.8, 1.0)`: "Take the interval 0.8 to 1.0 (`0.8, 1.0`) and the probability 0.9 (`0.9`), and return the x with that much area to its left (`qunif`)."
:::

The simulation check is the bus check with new limits: $\mu = (0.8 + 1.0)/2 = 0.9$ and $\sigma = 0.2/\sqrt{12} = 0.0577$.

```r
set.seed(1)
B <- runif(10000, 0.8, 1.0)        # 10 000 hits' multipliers
mean(B); sd(B)                     # near 0.9 and 0.0577 = 0.2/sqrt(12)
mean(B > 0.95)                     # near 0.25
```

:::info R syntax
| Code | What it does |
|---|---|
| `set.seed(1)` | Fixes the starting point of the random draws, as above. |
| `B <- runif(10000, 0.8, 1.0)` | n = 10 000 draws, min = 0.8, max = 1.0. |
| `mean(B); sd(B)` | Two commands on one line: the sample mean and standard deviation. |
| `mean(B > 0.95)` | The fraction of draws above 0.95. |

**Left to right**

- `set.seed(1)`: "Set the random starting point (`set.seed`) to 1 (`1`)."
- `B <- runif(10000, 0.8, 1.0)`: "Store under the name B (`B <-`) 10 000 (`10000`) random uniform draws (`runif`) between 0.8 (`0.8`) and 1.0 (`1.0`)."
- `mean(B); sd(B)`: "The mean (`mean`) of B (`B`), then (`;`) the standard deviation (`sd`) of B."
- `mean(B > 0.95)`: "The mean (`mean`) of whether each B (`B`) is greater than (`>`) 0.95 (`0.95`)."

**Right to left**, the order R runs it

- `set.seed(1)`: "Take 1 (`1`) and fix the random starting point with it (`set.seed`)."
- `B <- runif(10000, 0.8, 1.0)`: "Draw 10 000 uniform values on 0.8 to 1.0 (`runif(10000, 0.8, 1.0)`), then store them as B (`B <-`)."
- `mean(B); sd(B)`: "Average B (`mean`); then (`;`) find its standard deviation (`sd`)."
- `mean(B > 0.95)`: "Compare each B with 0.95 (`B > 0.95`), then average the TRUEs and FALSEs (`mean`)."
:::

## Three new problems in R

Classic's base multiplier B is uniform on [0.8, 1.0], exam scores are N(500, 100²), and the wait for a taxi is exponential with mean 6 minutes.

```quiz
[
  {"type": "fill", "q": "Complete the call for P(B ≤ 0.86).", "code": "punif(0.86, 0.8, ___)", "answer": ["1.0", "1"], "explain": "punif(x, min, max) with the interval [0.8, 1.0]: (0.86 − 0.8)/(1.0 − 0.8) = 0.06/0.2, so it prints 0.3."},
  {"type": "fill", "q": "Complete the call for the 90th percentile of exam scores.", "code": "qnorm(___, 500, 100)", "answer": ["0.9", "0.90", ".9", ".90"], "explain": "qnorm takes the probability first, as a proportion: qnorm(0.90, 500, 100) = 628.1552. By the table, z = 1.28 gives 500 + 128 = 628."},
  {"q": "Write the R line for P(score > 650), no spaces.", "type": "text", "answer": ["1-pnorm(650,500,100)", "pnorm(650,500,100,lower.tail=FALSE)", "pnorm(650,500,100,lower.tail=F)", "pnorm(650,mean=500,sd=100,lower.tail=FALSE)", "1-pnorm(650,mean=500,sd=100)"], "explain": "pnorm is the left tail P(X ≤ 650), so the right tail is 1 minus it: 1 - pnorm(650, 500, 100)."},
  {"q": "What does `1 - pnorm(650, 500, 100)` print, to 4 decimals?", "type": "numeric", "answer": 0.0668, "tolerance": 6e-05, "explain": "Z = (650 − 500)/100 = 1.50 exactly, so R and the table agree: 1 − 0.9332 = 0.0668 (R prints 0.0668072)."},
  {"type": "shade", "q": "Shade P(score > 650) on the exam-score curve. What percentage is it?", "mu": 500, "sigma": 100, "answer": 6.68, "tolerance": 1, "region": "above", "lo": 1.5, "explain": "650 is μ + 1.5σ; the right tail beyond it is 6.68 %."},
  {"type": "fill", "q": "Complete the call for P(taxi wait ≤ 3 minutes).", "code": "pexp(3, rate = ___)", "answer": ["1/6", "0.1667", ".1667", "0.16667"], "explain": "rate = 1/β = 1/6 per minute: pexp(3, rate = 1/6) = 1 − e^(−0.5) = 0.3934693. pexp(3, 6) would mean an average wait of 10 seconds."}
]
```

```quiz
[
  {
    "type": "fill",
    "q": "Complete the line that gives the 95th percentile of cosmic radiation, $\\mu = 4.35$, $\\sigma = 0.5$ mrem.",
    "code": "qnorm(___, 4.35, 0.5)",
    "answer": ["0.95"],
    "explain": "qnorm takes the probability below and returns the x: 5.172427. The table route is 4.35 + 1.645(0.5)."
  },
  {
    "q": "`pexp(4, 2.5)` is the wrong call for a web server with mean wait 2.5 s because...",
    "options": ["pexp needs the mean as the first argument", "the second argument is the rate $1/\\beta = 0.4$; 2.5 is read as a rate, i.e. a mean of 0.4 s", "pexp only accepts rate = 1", "the answer should use qexp"],
    "answer": 1,
    "explain": "R returned 0.9999546 instead of 0.7981035. Always write rate = 1/beta."
  },
  {
    "type": "match",
    "q": "Match the R prefix to the question it answers.",
    "pairs": [["`p`", "an area: $P(X \\le x)$"], ["`q`", "a percentile: the x with a given area below"], ["`d`", "the density height $f(x)$"], ["`r`", "random draws from the distribution"]],
    "explain": "pnorm, qnorm, dnorm, rnorm; the same four letters for unif and exp."
  },
  {
    "q": "Which line gives $P(Z > 2.33)$?",
    "options": ["`pnorm(2.33)`", "`qnorm(2.33)`", "`1 - pnorm(2.33)`", "`pnorm(-2.33, lower.tail = FALSE)`"],
    "answer": 2,
    "explain": "pnorm gives the left tail 0.9901; subtract from 1 for 0.009903. By symmetry `pnorm(-2.33)` would also be correct, but `pnorm(-2.33, lower.tail = FALSE)` is $P(Z > -2.33) = 0.9901$, the wrong tail."
  },
  {
    "q": "`pnorm(120, 100, 15)` prints 0.9087888 but the table gives 0.9082. Why?",
    "options": ["R uses a different normal distribution", "the table is wrong", "R keeps Z = 1.3333 while the table reads the row for Z rounded to 1.33", "pnorm returns a right tail"],
    "answer": 2,
    "explain": "`pnorm(1.33)` reproduces the table's 0.9082409. Both are accepted; say which you used."
  },
  {
    "q": "The bus comes every 20 minutes. Which line is $P(8 \\le T \\le 11)$?",
    "options": ["`punif(11, 0, 20) - punif(8, 0, 20)`", "`punif(11 - 8, 0, 20)`", "`dunif(11, 0, 20) - dunif(8, 0, 20)`", "`qunif(0.15, 0, 20)`"],
    "answer": 0,
    "explain": "Area between two points is the difference of two cumulative values: 0.55 − 0.40 = 0.15. `punif(11 - 8, 0, 20)` gives the area from 0 to 3, also 0.15 here only because the density is flat; it is the wrong idea."
  },
  {
    "q": "`mean(X <= 4)` where `X <- rexp(10000, rate = 0.4)` returns...",
    "options": ["the mean of the first 4 values", "TRUE or FALSE", "4", "the fraction of the 10 000 draws at or below 4, an estimate of $P(X \\le 4) \\approx 0.7981$"],
    "answer": 3,
    "explain": "The comparison is a logical vector; its mean is the proportion of TRUEs, Lab 4's k/m in one call."
  },
  {
    "q": "For `X <- rexp(10000, rate = 1/2.5)`, `mean(X)` and `sd(X)` both come out near...",
    "options": ["0.4", "2.5", "1.6", "6.25"],
    "answer": 1,
    "explain": "$\\mu = \\sigma = \\beta = 2.5$. The rate 0.4 is not the mean; 6.25 is the variance $\\beta^2$."
  }
]
```
