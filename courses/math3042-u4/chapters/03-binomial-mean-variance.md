---
title: Binomial mean and variance; is a count unusual?
minutes: 22
---
<!-- facts: gms.starforce.rates-15-plus, gms.starforce.star-catch, classic.scroll.tiers -->

Tap forty items once each at 15 stars: how many successes should you expect, and when is a count unusual?

For a binomial variable the parameters collapse to two shortcut formulas, and a Z-score says whether an observed count is unusual.

## The shortcut formulas

*The mean and variance of any probability distribution are found using*

$$\mu = \sum x \cdot P(x), \qquad \sigma^2 = \sum (x - \mu)^2 \cdot P(x)$$

*It is possible to start with these definitions and then to use the binomial distribution assumptions to derive the results*

$$\mu = np, \qquad \sigma^2 = npq, \qquad \sigma = \sqrt{npq}$$

The mean is the number of trials times the success probability: 50 visitors at 25 % each should average 12.5 sales.

Each visitor contributes, on average, 0.25 of a sale (1 with probability 0.25, 0 otherwise). Fifty visitors add fifty of those:

$$50 \times 0.25 = \mathbf{12.5} \text{ sales}$$

The variance is $npq$, and $\sigma$ is its square root, not $npq$ itself.

The rolling-3s table from the last lesson checks the shortcut against the definition:

$$\sum x P(x) = 0(0.4019) + 1(0.4019) + 2(0.1608) + 3(0.0322) + 4(0.0032) + 5(0.0001) = 0.8334$$

$$np = 5 \cdot \tfrac16 = 0.8333$$

Same number, one line instead of six.

## Online shoppers: μ and σ

```quiz
[
  {
    "q": "n = 50, p = 0.25. The standard deviation σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 3.06,
    "tolerance": 0.01,
    "explain": "$$\\sigma = \\sqrt{npq} = \\sqrt{50 × 0.25 × 0.75} = \\sqrt{9.375} = \\mathbf{3.06}$$ The variance is 9.375; take its root."
  }
]
```

$n = 50$, $p = 0.25$, $q = 0.75$:

$$\mu = 50(0.25) = \mathbf{12.5}, \qquad \sigma = \sqrt{50(0.25)(0.75)} = \sqrt{9.375} = \mathbf{3.06}$$

On the histogram the peak sits at 12 and 13.

Two standard deviations either side of the mean:

$$\mu \pm 2\sigma = 12.5 \pm 6.1 = 6.4 \text{ to } 18.6$$

That is where nearly all the bar area is.

```r
n <- 50
p <- 0.25
q <- 1 - p
mu <- n*p
sig <- sqrt(n*p*q)
c(mu, sig)
```

```text
[1] 12.500000  3.061862
```

:::info R syntax
| Code | What it does |
|---|---|
| `n <- 50`, `p <- 0.25` | `<-` is assignment: it stores each number under its name. |
| `q <- 1 - p` | `-` subtracts; the result, 0.75, is stored in `q`. |
| `mu <- n*p` | `*` multiplies: μ = np. |
| `sig <- sqrt(n*p*q)` | `sqrt()` takes the square root of the product npq. |
| `c(mu, sig)` | `c()` combines the two values into one vector so they print on one line. |
| `[1]` | R starts each printed line with the position of its first value; `[1]` means value 1. |

**Left to right**

- `n <- 50`: "Store under the name n (`n <-`) the number 50."
- `p <- 0.25`: "Store under the name p (`p <-`) the number 0.25."
- `q <- 1 - p`: "Store under the name q (`q <-`) 1 minus (`-`) p (`p`)."
- `mu <- n*p`: "Store under the name mu (`mu <-`) n (`n`) times (`*`) p (`p`)."
- `sig <- sqrt(n*p*q)`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of n times p times q (`n*p*q`)."
- `c(mu, sig)`: "Combine (`c`) mu (`mu`) and sig (`sig`)."

**Right to left**, the order R runs it

- `n <- 50`: "Take 50 and store it as n (`n <-`)."
- `p <- 0.25`: "Take 0.25 and store it as p (`p <-`)."
- `q <- 1 - p`: "Subtract p from 1 (`1 - p`), then store it as q (`q <-`)."
- `mu <- n*p`: "Multiply n by p (`n*p`), then store it as mu (`mu <-`)."
- `sig <- sqrt(n*p*q)`: "Multiply n, p and q (`n*p*q`), take the square root (`sqrt`), then store it as sig (`sig <-`)."
- `c(mu, sig)`: "Take mu and sig (`mu`, `sig`), put them in one vector (`c`), and print it."
:::

```widget
binomial-calc
{ "n": 50, "p": 0.25, "x": 6, "op": "eq", "preset": "online shoppers", "title": "Online shoppers: μ = np and σ = √npq under the bars, and the Z of any x" }
```

## Unusual means more than 2 standard deviations from the mean

An observed count $x$ is converted to a Z-score exactly as a data value was in Unit 2:

$$Z = \frac{x - \mu}{\sigma}$$

$|Z| > 2$ is **unusual**.

A value between $-2$ and $2$ is within the range chance alone produces, even when it is on the low side of $\mu$.

The tail probability is a second test: the count is unusual when the tail beyond it is below 0.025. Each side has its own tail and its own R call:

| Side | Z test | Tail test | Tail in R (binomial) | Example: shoppers, $\mu = 12.5$, $\sigma = 3.06$ |
|---|---|---|---|---|
| low | $Z < -2$ | $P(X \le x) < 0.025$ | `pbinom(x, n, p)` | $x = 6$: $Z = (6 - 12.5)/3.06 = -2.12$, tail `pbinom(6, 50, 0.25)` = 0.0194: unusually low |
| high | $Z > 2$ | $P(X \ge x) < 0.025$ | `1 - pbinom(x-1, n, p)` | $x = 20$: $Z = (20 - 12.5)/3.06 = 2.45$, tail `1 - pbinom(19, 50, 0.25)` = 0.0139: unusually high |

Both tests are taught and agree in every lecture example of this unit.

Right at the edge they can split (shoppers $x = 19$: $Z = 2.12$ but the tail is 0.0287), so use the test the question names.

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(x, n, p)`, `pbinom(6, 50, 0.25)` | `pbinom(q, size, prob)`: P(X ≤ q), the low tail; here q = 6, size = 50 (n), prob = 0.25 (p). |
| `1 - pbinom(x-1, n, p)`, `1 - pbinom(19, 50, 0.25)` | q = x − 1 = 19, so `pbinom` gives P(X ≤ 19) and `1 -` turns it into the high tail P(X ≥ 20). |

**Left to right**

- `pbinom(6, 50, 0.25)`: "The binomial probability of at most (`pbinom`) 6 sales (`q = 6`) from 50 visitors (`size = 50`) at 0.25 (`prob = 0.25`)."
- `1 - pbinom(19, 50, 0.25)`: "One minus (`1 -`) the probability of at most (`pbinom`) 19 sales (`q = 19`) from 50 visitors (`size = 50`) at 0.25 (`prob = 0.25`)."

**Right to left**, the order R runs it

- `pbinom(6, 50, 0.25)`: "Take q = 6, size = 50 and prob = 0.25, and compute P(X ≤ 6) (`pbinom`)."
- `1 - pbinom(19, 50, 0.25)`: "Compute P(X ≤ 19) (`pbinom`), then subtract it from 1 (`1 -`)."
:::

## Forty items tapped once at 15→16

Star Force, the GMS enhancement that adds stars to gear, succeeds 30 % at 15→16, with 67.90 % maintain and 2.10 % destroy: Nexon's v.264 published rates, without the Star Catch bonus that v.271 builds in.

Tap each of 40 items once at 15 stars and let X = the number of successes.

One tap per item keeps p fixed and the items independent, and X counts successes only, so maintain and destroy are both just "not a success": X is binomial with $n = 40$, $p = 0.30$.

```quiz
[
  {"q": "40 items, one tap each at 15→16, p = 0.30. The mean number of successes μ = ? (1 decimal)", "type": "numeric", "answer": 12.0, "tolerance": 0.05, "explain": "$$\\mu = np = 40 × 0.30 = \\mathbf{12.0} \\text{ successes}$$"},
  {"q": "Same 40 taps. σ = ? (2 decimals)", "type": "numeric", "answer": 2.9, "tolerance": 0.05, "explain": "$$\\sigma = \\sqrt{npq} = \\sqrt{40 × 0.30 × 0.70} = \\sqrt{8.4} = 2.8983 \\approx \\mathbf{2.90}$$ q = 0.70 is maintain plus destroy: $$0.6790 + 0.0210 = 0.70$$"},
  {"q": "The 40 taps give 19 successes. Z = ? (2 decimals)", "type": "numeric", "answer": 2.42, "tolerance": 0.01, "explain": "$$Z = \\dfrac{x − μ}{σ} = \\dfrac{19 − 12}{2.8983} = \\mathbf{2.42}$$ 2.41 with σ rounded to 2.90; either is accepted. Above 2: unusually high."}
]
```

With $n = 40$, $p = 0.30$, $q = 0.70$:

$$\mu = 40(0.30) = 12, \qquad \sigma = \sqrt{40(0.30)(0.70)} = \sqrt{8.4} = 2.90, \qquad Z = \frac{19 - 12}{2.90} = \mathbf{2.41}$$

$Z > 2$: 19 successes is **unusually high** for a 30 % rate.

The tail agrees: $P(X \ge 19) = 0.0148$, below 0.025.

```r
n <- 40
p <- 0.3
q <- 1 - p
mu <- n*p
sig <- sqrt(n*p*q)
c(mu, sig)
Z <- (19 - mu)/sig
Z
1 - pbinom(18, 40, 0.3)
```

```text
[1] 12.000000  2.898275
[1] 2.415229
[1] 0.01477705
```

:::info R syntax
| Code | What it does |
|---|---|
| `n <- 40`, `p <- 0.3`, `q <- 1 - p` | As above; the new values replace the old ones under the same names. |
| `mu <- n*p`, `sig <- sqrt(n*p*q)`, `c(mu, sig)` | As above: μ, σ, then both printed on one line. |
| `Z <- (19 - mu)/sig` | The brackets make the subtraction happen first; `/` then divides by `sig`. |
| `Z` | A name alone on a line prints its value. |
| `1 - pbinom(18, 40, 0.3)` | `pbinom(q, size, prob)` is P(X ≤ q): q = 18, size = 40 (n), prob = 0.3 (p). `1 -` turns it into P(X ≥ 19). |

**Left to right**

- `n <- 40`, `p <- 0.3`, `q <- 1 - p`: "Store under the names n, p and q (`n <-`, `p <-`, `q <-`) the numbers 40, 0.3 and 1 minus p (`1 - p`)."
- `mu <- n*p`: "Store under the name mu (`mu <-`) n times p (`n*p`)."
- `sig <- sqrt(n*p*q)`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of n times p times q (`n*p*q`)."
- `c(mu, sig)`: "Combine (`c`) mu and sig (`mu`, `sig`)."
- `Z <- (19 - mu)/sig`: "Store under the name Z (`Z <-`) 19 minus mu (`19 - mu`) divided by (`/`) sig (`sig`)."
- `Z`: "Show Z (`Z`)."
- `1 - pbinom(18, 40, 0.3)`: "One minus (`1 -`) the probability of at most (`pbinom`) 18 successes (`q = 18`) in 40 trials (`size = 40`) at 0.3 (`prob = 0.3`)."

**Right to left**, the order R runs it

- `n <- 40`, `p <- 0.3`, `q <- 1 - p`: "Take 40 and 0.3 and store them as n and p (`n <-`, `p <-`); subtract p from 1 (`1 - p`) and store it as q (`q <-`)."
- `mu <- n*p`: "Multiply n by p (`n*p`), then store it as mu (`mu <-`)."
- `sig <- sqrt(n*p*q)`: "Multiply n, p and q (`n*p*q`), take the square root (`sqrt`), and store it as sig (`sig <-`)."
- `c(mu, sig)`: "Put mu and sig in one vector (`c`) and print it."
- `Z <- (19 - mu)/sig`: "Subtract mu from 19 (`19 - mu`), divide by sig (`/`), and store it as Z (`Z <-`)."
- `Z`: "Look up Z (`Z`) and print it."
- `1 - pbinom(18, 40, 0.3)`: "Compute P(X ≤ 18) for size 40 and prob 0.3 (`pbinom`), subtract it from 1 (`1 -`), and print."
:::

### Forty taps at 30 %: μ and σ under the bars, and the right tail from 19

```widget
binomial-calc
{ "n": 40, "p": 0.3, "x": 19, "op": "ge", "title": "40 taps at 15→16, p = 0.30: μ = 12, σ = 2.90, and Z for 19 successes" }
```

## Laser printers: is 14 repairs unusually low?

*For a certain model of laser printer, the probability of a unit needing repairs in the first year is 10%. In an attempt to reduce this rate, modifications were made to the printer design and a year later a study of 200 randomly selected modified laser printers was conducted.*

**(a)** *Assuming the modifications had no effect on the printer reliability, find the mean and standard deviation of the number of laser printers that need repair among 200.*

$X$ = the number needing repair is binomial with $n = 200$, $p = 0.10$:

$$\mu = 200(0.10) = \mathbf{20}, \qquad \sigma = \sqrt{200(0.10)(0.90)} = \sqrt{18} = \mathbf{4.24}$$

**(b)** *Suppose that in the sample of 200 laser printers, 14 needed repair. Assuming the modifications had no effect, is this rate unusually low?*

```quiz
[
  {
    "q": "n = 200 printers, p = 0.10, and 14 needed repair. Z = ? (2 decimals)",
    "type": "numeric",
    "answer": -1.41,
    "tolerance": 0.01,
    "explain": "$$\\mu = 200(0.10) = 20, \\quad \\sigma = \\sqrt{200 × 0.10 × 0.90} = \\sqrt{18} = 4.24$$ $$Z = \\dfrac{14 − 20}{4.24} = \\mathbf{−1.41}$$"
  }
]
```

Standardize the 14 repairs:

$$Z = \frac{14 - 20}{4.24} = \mathbf{-1.41}$$

$-1.41$ is not beyond $-2$: **not unusual**.

The tail agrees: $P(X \le 14) = 0.0929$, above 0.025.

**(c)** *Does this sample provide good evidence that the modifications improved the reliability of this model of laser printer?*

No: 14 repairs is within what the old 10 % rate produces by chance alone, so the sample is consistent with no improvement.

This does not show the modifications failed. It only shows that 14 repairs could easily happen under the old 10 % rate, so the sample cannot prove an improvement.

```widget
binomial-calc
{ "preset": "laser printers", "x": 14, "op": "le", "title": "Laser printers: n = 200, p = 0.10; the Z readout for x = 14 and the left-tail probability" }
```

```widget
normal-curve
{ "mu": 20, "sigma": 4.24, "x": 14, "title": "Where Z = −1.41 sits on a bell with μ = 20 and σ = 4.24: inside the ±2σ band" }
```

```r
n <- 200
p <- 0.1
q <- 1-p
mu <- n*p
sig <- sqrt(n*p*q)
c(mu, sig)
X <- 14
Z <- (X-mu)/sig
Z
pbinom(14, 200, 0.1)
```

```text
[1] 20.000000  4.242641
[1] -1.414214
[1] 0.09294618
```

:::info R syntax
| Code | What it does |
|---|---|
| `n <- 200`, `p <- 0.1`, `q <- 1-p` | As above, with the printer numbers. |
| `mu <- n*p`, `sig <- sqrt(n*p*q)`, `c(mu, sig)` | As above. |
| `X <- 14` | Stores the observed count. R names are case-sensitive, so `X` and `x` would be different names. |
| `Z <- (X-mu)/sig` | Brackets first, then `/`: the Z-score of 14. |
| `Z` | Prints the value of `Z`. |
| `pbinom(14, 200, 0.1)` | q = 14, size = 200 (n), prob = 0.1 (p): P(X ≤ 14), the left tail. |

**Left to right**

- `n <- 200`, `p <- 0.1`, `q <- 1-p`: "Store under the names n, p and q (`n <-`, `p <-`, `q <-`) 200, 0.1 and 1 minus p (`1-p`)."
- `mu <- n*p`: "Store under the name mu (`mu <-`) n times p (`n*p`)."
- `sig <- sqrt(n*p*q)`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of n times p times q (`n*p*q`)."
- `c(mu, sig)`: "Combine (`c`) mu and sig (`mu`, `sig`)."
- `X <- 14`: "Store under the name X (`X <-`) the number 14."
- `Z <- (X-mu)/sig`: "Store under the name Z (`Z <-`) X minus mu (`X-mu`) divided by (`/`) sig (`sig`)."
- `Z`: "Show Z (`Z`)."
- `pbinom(14, 200, 0.1)`: "The probability of at most (`pbinom`) 14 repairs (`q = 14`) in 200 printers (`size = 200`) at 0.1 (`prob = 0.1`)."

**Right to left**, the order R runs it

- `n <- 200`, `p <- 0.1`, `q <- 1-p`: "Take 200 and 0.1 and store them as n and p (`n <-`, `p <-`); subtract p from 1 (`1-p`) and store it as q (`q <-`)."
- `mu <- n*p`: "Multiply n by p (`n*p`), then store it as mu (`mu <-`)."
- `sig <- sqrt(n*p*q)`: "Multiply n, p and q (`n*p*q`), take the square root (`sqrt`), and store it as sig (`sig <-`)."
- `c(mu, sig)`: "Put mu and sig in one vector (`c`) and print it."
- `X <- 14`: "Take 14 and store it as X (`X <-`)."
- `Z <- (X-mu)/sig`: "Subtract mu from X (`X-mu`), divide by sig (`/`), and store it as Z (`Z <-`)."
- `Z`: "Look up Z (`Z`) and print it."
- `pbinom(14, 200, 0.1)`: "Take q = 14, size = 200 and prob = 0.1, compute P(X ≤ 14) (`pbinom`), and print."
:::

## Fifty Greater scrolls and thirty Intermediate scrolls: unusual counts?

In MapleStory Classic a Greater scroll succeeds 10 % of the time and an Intermediate scroll 60 %, by meowdb's copy of the in-game item text.

Each use has the same fixed rate and uses are independent.

```quiz
[
  {"q": "50 Greater scrolls are used, p = 0.10 each, and X = the number that succeed. μ = ? (1 decimal)", "type": "numeric", "answer": 5.0, "tolerance": 0.05, "explain": "X is binomial with n = 50, p = 0.10: $$\\mu = np = 50 × 0.10 = \\mathbf{5.0} \\text{ successes}$$"},
  {"q": "Same 50 Greater scrolls. σ = ? (2 decimals)", "type": "numeric", "answer": 2.12, "tolerance": 0.05, "explain": "$$\\sigma = \\sqrt{npq} = \\sqrt{50 × 0.10 × 0.90} = \\sqrt{4.5} = 2.1213 \\approx \\mathbf{2.12}$$ The variance is 4.5; σ is its square root."},
  {"q": "The 50 Greater scrolls give 11 successes. Z = ? (2 decimals)", "type": "numeric", "answer": 2.83, "tolerance": 0.01, "explain": "$$Z = \\dfrac{x − μ}{σ} = \\dfrac{11 − 5}{2.1213} = \\mathbf{2.83}$$ Above 2: 11 successes is unusually high for a 10 % scroll."},
  {"type": "fill", "q": "Complete the R line for the high-side tail P(X ≥ 11) on the 50 Greater scrolls.", "code": "1 - pbinom(___, 50, 0.1)", "answer": ["10"], "explain": "pbinom(10, …) is P(X ≤ 10), so $$1 − \\text{pbinom}(10, 50, 0.1) = P(X ≥ 11) = 0.009354602$$ That is below 0.025. Using 11 would drop the X = 11 bar from the tail."},
  {"q": "30 Intermediate scrolls, p = 0.60 each. σ = ? (2 decimals)", "type": "numeric", "answer": 2.68, "tolerance": 0.05, "explain": "$$\\mu = 30 × 0.60 = 18, \\quad \\sigma = \\sqrt{30 × 0.60 × 0.40} = \\sqrt{7.2} = 2.6833 \\approx \\mathbf{2.68}$$"},
  {"q": "13 successes from 30 Intermediate scrolls is unusually low.", "type": "tf", "answer": false, "explain": "$$Z = \\dfrac{13 − 18}{2.6833} = \\mathbf{−1.86}$$ Not beyond −2: low, but within what a 60 % rate produces by chance. The tail agrees: P(X ≤ 13) = 0.0481, above 0.025."}
]
```

```quiz
[
  {
    "q": "n = 50, p = 0.25. The mean number of sales μ = ? (1 decimal)",
    "type": "numeric",
    "answer": 12.5,
    "tolerance": 0.05,
    "explain": "$$\\mu = np = 50 × 0.25 = \\mathbf{12.5}$$ It is the centre of the probability histogram."
  },
  {
    "q": "For a binomial variable, σ = npq.",
    "type": "tf",
    "answer": false,
    "explain": "npq is the variance σ². The standard deviation is σ = √(npq). For the printers: $$\\sigma = \\sqrt{18} = 4.24, \\text{ not } 18$$"
  },
  {
    "q": "200 modified printers, 10 % repair rate if the modifications did nothing. Which Z-score belongs to 14 repairs?",
    "options": ["$Z = (20 - 14)/4.24 = 1.41$", "$Z = (14 - 20)/4.24 = -1.41$", "$Z = (14 - 20)/18 = -0.33$", "$Z = (14 - 20)/20 = -0.30$"],
    "answer": 1,
    "explain": "Z = (x − μ)/σ with μ = 20 and σ = √18 = 4.24; a count below the mean has a negative Z. Dividing by 18 uses the variance by mistake."
  },
  {
    "q": "n = 100, p = 0.2, and you observe x = 30. Z = ? (1 decimal)",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.05,
    "explain": "$$\\mu = 100(0.2) = 20, \\quad \\sigma = \\sqrt{100 × 0.2 × 0.8} = \\sqrt{16} = 4$$ $$Z = \\dfrac{30 − 20}{4} = \\mathbf{2.5}$$ Beyond 2: unusually high."
  },
  {
    "q": "14 repairs out of 200 gave Z = −1.41. The right conclusion is...",
    "options": ["The modifications clearly improved reliability", "The modifications had no effect", "14 is not unusually low, so the sample is not good evidence of an improvement", "The sample is too small to compute Z"],
    "answer": 2,
    "explain": "|Z| < 2 means 14 is within the range chance produces under the old 10 % rate. That fails to show an improvement; it does not prove there was none."
  },
  {
    "q": "n = 400, p = 0.05. σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 4.36,
    "tolerance": 0.01,
    "explain": "$$\\sigma = \\sqrt{400 × 0.05 × 0.95} = \\sqrt{19} = \\mathbf{4.36}$$ $$\\mu = 400 × 0.05 = 20$$"
  },
  {
    "q": "Using the tail-probability test accepted on Quiz 4, a count x is unusually low when...",
    "options": ["$P(X \\le x) < 0.025$", "$P(X = x) < 0.5$", "$x < \\mu$", "$P(X \\le x) < 0.5$"],
    "answer": 0,
    "explain": "A left tail below 0.025 matches Z < −2 (about 2.5 % of a bell lies below −2). For the printers P(X ≤ 14) = 0.093, so 14 is not unusual by either test."
  },
  {
    "q": "Rolling a die 5 times and counting 3s: μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.83,
    "tolerance": 0.01,
    "explain": "$$\\mu = np = 5 × 1/6 = \\mathbf{0.83}$$ It matches Σ x P(x) over the six-row table (0.8334)."
  }
]
```
