---
title: Which distribution, and the R function for each
minutes: 22
---
<!-- facts: classic.scroll.tiers, poe1.ladder.hc-dead-by-rank, gms.starforce.rates-0-14, gms.starforce.star-catch, poe1.chaos.affix-count -->

A problem never says "this is hypergeometric": it describes cards, printers or a help line.

Four questions about the story name the distribution, and one R pattern then computes any of them.

## Four questions pick the distribution

Ask the questions in this order.

The first yes names the distribution.

```diagram
{ "type": "tree", "title": "The order to ask the four questions", "nodes": [
  { "id": "q1", "label": "Events in an interval, known rate?" },
  { "id": "pois", "label": "yes: Poisson", "sub": "λ for the interval", "parent": "q1" },
  { "id": "q2", "label": "no: trials until the first success?", "parent": "q1" },
  { "id": "geo", "label": "yes: Geometric", "sub": "q^(x−1) p", "parent": "q2" },
  { "id": "q3", "label": "no: a fixed n of trials?", "parent": "q2" },
  { "id": "tab", "label": "no: build the table", "sub": "μ = Σ x P(x)", "parent": "q3" },
  { "id": "q4", "label": "yes: without replacement and n/N > 5 %?", "parent": "q3" },
  { "id": "hyp", "label": "yes: Hypergeometric", "sub": "C(K,x) C(N−K,n−x) / C(N,n)", "parent": "q4" },
  { "id": "bin", "label": "no: Binomial", "sub": "p = K/N if without replacement", "parent": "q4" }
], "hi": ["pois", "geo", "tab", "hyp", "bin"], "caption": "Interval first, then first success, then fixed n; a fixed n without replacement is hypergeometric only when n/N > 5 % (Mac class: 10/90 = 11 %)." }
```

| Ask | Yes means | $X$ is | $P(x)$ | $\mu$ | $\sigma^2$ |
|---|---|---|---|---|---|
| A fixed number of trials $n$, each success with the same $p$ (with replacement, or an infinite population)? | **Binomial** | number of successes in $n$ trials, 0 … $n$ | $nCx\, p^x q^{n-x}$ | $np$ | $npq$ |
| A fixed $n$ drawn **without replacement** from a finite population of $N$ with $K$ successes? | **Hypergeometric** | successes in the sample, 0 … $n$ | $\dfrac{C(K,x)\,C(N-K,\,n-x)}{C(N,n)}$ | $n\dfrac{K}{N}$ | $n\dfrac{K}{N}\dfrac{N-K}{N}\dfrac{N-n}{N-1}$ |
| Counting trials **until the first success**? | **Geometric** | trial number of the first success, 1, 2, 3, … | $q^{x-1} p$ | $\dfrac{1}{p}$ | $\dfrac{1-p}{p^2}$ |
| Counting **events in an interval** with a known mean rate? | **Poisson** | occurrences in the interval, 0, 1, 2, … | $\dfrac{\lambda^x}{x!} e^{-\lambda}$ | $\lambda$ | $\lambda$ |

Two refinements.

If the draw is without replacement but $n/N \le 5\%$, the 5% rule says the binomial with $p = K/N$ is close enough (the superdeck: 0.0460 against 0.0465).

If none of the four fits, the general definitions still do, from the table, as for the minimum of two dice:

$$\mu = \sum x P(x), \qquad \sigma^2 = \sum (x - \mu)^2 P(x)$$

```widget
dist-picker
{ "scenarios": "lecture", "title": "The lecture scenarios through the four questions: the distribution, its formula, mu, sigma and the R call" }
```

## One R pattern: d for P(X = x), p for P(X ≤ x)

Every distribution has a `d` function for a single probability and a `p` function for the cumulative probability up to and including $x$. The arguments differ, and the order matters:

| Distribution | $P(X = x)$ | $P(X \le x)$ | $P(X \ge x)$ | Arguments |
|---|---|---|---|---|
| Binomial | `dbinom(x, n, p)` | `pbinom(x, n, p)` | `1 - pbinom(x-1, n, p)` | count, trials, success probability |
| Hypergeometric | `dhyper(x, K, N-K, n)` | `phyper(x, K, N-K, n)` | `1 - phyper(x-1, K, N-K, n)` | count, successes in population, **failures** in population, draws |
| Geometric | `dgeom(x-1, p)` | `pgeom(x-1, p)` | `1 - pgeom(x-2, p)` $= q^{x-1}$ | **failures** before the first success, so the lecture's $x$ becomes $x - 1$ |
| Poisson | `dpois(x, lambda)` | `ppois(x, lambda)` | `1 - ppois(x-1, lambda)` | count, mean for the interval |

:::warn R's slots are not the course's letters
`dhyper`'s slots are R's m, n, k: the course's $K$, $N - K$ and $n$.

The geometric `d` and `p` functions count failures, not trials. So "at least $x$" is `1 - p*(x-1,...)` for three of the four, but `1 - pgeom(x-2, p)` for the geometric: at least $x$ trials means at least $x - 1$ failures, the complement of at most $x - 2$ failures.

Help line: `1 - pgeom(2, 0.25)` is

$$P(X \ge 4) = 0.75^3 = 0.4219$$

`1 - pgeom(3, 0.25)` would be

$$P(X > 4) = 0.75^4 = 0.3164$$
:::

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(x, n, p)`, `pbinom(x, n, p)` | R's `dbinom(x, size, prob)` and `pbinom(q, size, prob)`: the count, size = n trials, prob = p. |
| `1 - pbinom(x-1, n, p)` | `x-1` fills q, so `pbinom` gives P(X ≤ x − 1); `1 -` turns it into P(X ≥ x). |
| `dhyper(x, K, N-K, n)`, `phyper(x, K, N-K, n)` | R's `dhyper(x, m, n, k)` and `phyper(q, m, n, k)`: m = K successes, R's n = N − K failures, k = the lesson's n drawn. |
| `1 - phyper(x-1, K, N-K, n)` | The same slots with q = x − 1; one minus that is P(X ≥ x). |
| `dgeom(x-1, p)`, `pgeom(x-1, p)` | R's `dgeom(x, prob)` and `pgeom(q, prob)` count failures, so the first slot gets the lecture's x minus 1. |
| `1 - pgeom(x-2, p)` | q = x − 2 failures at most, so one minus it is at least x − 1 failures: first success on trial x or later. |
| `dpois(x, lambda)`, `ppois(x, lambda)` | R's `dpois(x, lambda)` and `ppois(q, lambda)`: the count, then the mean for the interval. |
| `1 - ppois(x-1, lambda)` | q = x − 1; one minus it is P(X ≥ x). |

**Left to right**

- `dbinom(x, n, p)`, `pbinom(x, n, p)`: "The binomial probability of exactly (`dbinom`) or at most (`pbinom`) x successes (`x`) in n trials (`n`) at chance p (`p`)."
- `1 - pbinom(x-1, n, p)`: "One minus (`1 -`) the binomial probability of at most (`pbinom`) x minus 1 successes (`x-1`) in n trials (`n`) at chance p (`p`)."
- `dhyper(x, K, N-K, n)`, `phyper(x, K, N-K, n)`: "The hypergeometric probability of exactly (`dhyper`) or at most (`phyper`) x successes (`x`) with K successes (`K`) and N minus K failures (`N-K`) in the population and n drawn (`n`)."
- `1 - phyper(x-1, K, N-K, n)`: "One minus (`1 -`) the hypergeometric probability of at most (`phyper`) x minus 1 successes (`x-1`) with K successes (`K`), N minus K failures (`N-K`) and n drawn (`n`)."
- `dgeom(x-1, p)`, `pgeom(x-1, p)`: "The geometric probability of exactly (`dgeom`) or at most (`pgeom`) x minus 1 failures (`x-1`) at chance p (`p`)."
- `1 - pgeom(x-2, p)`: "One minus (`1 -`) the probability of at most (`pgeom`) x minus 2 failures (`x-2`) at chance p (`p`)."
- `dpois(x, lambda)`, `ppois(x, lambda)`: "The Poisson probability of exactly (`dpois`) or at most (`ppois`) x events (`x`) with mean lambda (`lambda`)."
- `1 - ppois(x-1, lambda)`: "One minus (`1 -`) the Poisson probability of at most (`ppois`) x minus 1 events (`x-1`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- `dbinom(x, n, p)`, `pbinom(x, n, p)`: "Take x, n and p, then compute P(X = x) (`dbinom`) or P(X ≤ x) (`pbinom`)."
- `1 - pbinom(x-1, n, p)`: "Subtract 1 from x (`x-1`), compute P(X ≤ x − 1) (`pbinom`), and subtract it from 1 (`1 -`)."
- `dhyper(x, K, N-K, n)`, `phyper(x, K, N-K, n)`: "Subtract K from N (`N-K`), then compute P(X = x) (`dhyper`) or P(X ≤ x) (`phyper`)."
- `1 - phyper(x-1, K, N-K, n)`: "Subtract 1 from x (`x-1`) and K from N (`N-K`), compute P(X ≤ x − 1) (`phyper`), and subtract it from 1 (`1 -`)."
- `dgeom(x-1, p)`, `pgeom(x-1, p)`: "Subtract 1 from x (`x-1`), then compute the probability of that many failures (`dgeom`) or at most that many (`pgeom`)."
- `1 - pgeom(x-2, p)`: "Subtract 2 from x (`x-2`), compute the chance of at most that many failures (`pgeom`), and subtract it from 1 (`1 -`)."
- `dpois(x, lambda)`, `ppois(x, lambda)`: "Take x and lambda, then compute P(X = x) (`dpois`) or P(X ≤ x) (`ppois`)."
- `1 - ppois(x-1, lambda)`: "Subtract 1 from x (`x-1`), compute P(X ≤ x − 1) (`ppois`), and subtract it from 1 (`1 -`)."
:::

The Mac class is `dhyper(4, 40, 50, 10)`, with the 50 failures where $N$ might be expected.

For a by-hand check, `choose(n, x)` is $nCx$ and `factorial(x)` is $x!$.

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(4, 40, 50, 10)` | x = 4, m = 40 Mac users, n = 50 others (R's n is the failures), k = 10 sampled. |
| `choose(n, x)` | Counts combinations, nCx; R names its two slots `n` and `k`. |
| `factorial(x)` | x!, the product 1 × 2 × … × x. |

**Left to right**

- `dhyper(4, 40, 50, 10)`: "The hypergeometric probability (`dhyper`) of 4 Mac users (`x = 4`) with 40 Mac users (`m = 40`) and 50 others (`n = 50`) and 10 sampled (`k = 10`)."
- `choose(n, x)`: "The number of combinations (`choose`) of n items (`n`) taken x at a time (`x`)."
- `factorial(x)`: "The factorial (`factorial`) of x (`x`)."

**Right to left**, the order R runs it

- `dhyper(4, 40, 50, 10)`: "Take 4, 40, 50 and 10, compute P(X = 4) (`dhyper`), and print."
- `choose(n, x)`: "Look up n and x, count the combinations (`choose`), and return the count."
- `factorial(x)`: "Look up x, multiply 1 up to x (`factorial`), and return the product."
:::

## Every lecture example as one line

```r
dbinom(6, 50, 0.25)              # shoppers: P(X = 6), n = 50, p = 0.25
round(dbinom(0:5, 5, 1/6), 4)    # number of 3s in 5 rolls: the whole table
dbinom(2, 5, 4/52)               # 2 jacks in 5 cards WITH replacement
1 - pbinom(1, 5, 4/52)           # at least 2 jacks with replacement
dhyper(2, 4, 48, 5)              # 2 jacks in 5 cards WITHOUT replacement
dhyper(2, 40, 480, 5)            # the superdeck: N = 520, K = 40
dhyper(4, 40, 50, 10)            # Mac users: P(X = 4), N = 90, K = 40, n = 10
phyper(4, 40, 50, 10)            # Mac users: P(X <= 4)
dgeom(2, 0.25)                   # help line: P(X = 3) is 2 failures then success
1 - pgeom(2, 0.25)               # help line: P(X >= 4) = 1 - P(X <= 3)
dpois(20, 30)                    # web server: P(X = 20), lambda = 30 per minute
ppois(20, 30)                    # web server: P(X <= 20)
```
```text
[1] 0.01234465
[1] 0.4019 0.4019 0.1608 0.0322 0.0032 0.0001
[1] 0.04654006
[1] 0.05058269
[1] 0.03992982
[1] 0.04597149
[1] 0.2538614
[1] 0.5188862
[1] 0.140625
[1] 0.421875
[1] 0.01341115
[1] 0.03528462
```

:::info R syntax
| Code | What it does |
|---|---|
| `#` | Starts a comment: R ignores the rest of the line, so each line carries its own label. |
| `dbinom(6, 50, 0.25)`, `dbinom(2, 5, 4/52)` | `dbinom(x, size, prob)`: the count x, then size (n), then prob (p). |
| `round(dbinom(0:5, 5, 1/6), 4)` | `0:5` is the whole numbers 0 to 5, so x is six values at once; `round(x, digits)` keeps 4 decimals. |
| `1 - pbinom(1, 5, 4/52)` | `pbinom(q, size, prob)` is P(X ≤ q); `1 -` turns P(X ≤ 1) into P(X ≥ 2). |
| `dhyper(2, 4, 48, 5)`, `dhyper(2, 40, 480, 5)`, `dhyper(4, 40, 50, 10)` | `dhyper(x, m, n, k)`: m = successes, n = failures (R's n, not the sample size), k = number drawn. |
| `phyper(4, 40, 50, 10)` | `phyper(q, m, n, k)`: the same slots, P(X ≤ 4). |
| `dgeom(2, 0.25)` | `dgeom(x, prob)`: x counts failures before the first success, so the lecture's X = 3 is x = 2. |
| `1 - pgeom(2, 0.25)` | `pgeom(q, prob)`: at most 2 failures; `1 -` takes the complement. |
| `dpois(20, 30)`, `ppois(20, 30)` | `dpois(x, lambda)` and `ppois(q, lambda)`: the count, then the mean for the interval. |
| `[1]` | R starts each printed line with the position of its first value; every line here begins at value 1. |

**Left to right**

- `dbinom(…)` lines: "The binomial probability of exactly (`dbinom`) x successes (`x`) in n trials (`size`) at chance p (`prob`)."
- `round(dbinom(0:5, 5, 1/6), 4)`: "Round (`round`) to 4 decimals (`4`) the binomial probabilities (`dbinom`) of 0 to 5 (`0:5`) in 5 rolls (`size = 5`) at 1/6 (`prob = 1/6`)."
- `1 - pbinom(1, 5, 4/52)`: "One minus (`1 -`) the probability of at most (`pbinom`) 1 jack (`q = 1`) in 5 cards (`size = 5`) at 4/52 (`prob = 4/52`)."
- `dhyper(…)` lines: "The hypergeometric probability (`dhyper`) of x successes (`x`) with m successes (`m`) and n failures (`n`) in the population and k drawn (`k`)."
- `phyper(4, 40, 50, 10)`: "The probability of at most (`phyper`) 4 (`q = 4`) with 40 successes (`m = 40`), 50 failures (`n = 50`) and 10 drawn (`k = 10`)."
- `dgeom(2, 0.25)`: "The geometric probability (`dgeom`) of 2 failures before the first success (`x = 2`) at chance 0.25 (`prob = 0.25`)."
- `1 - pgeom(2, 0.25)`: "One minus (`1 -`) the probability of at most (`pgeom`) 2 failures (`q = 2`) at 0.25 (`prob = 0.25`)."
- `dpois(20, 30)`, `ppois(20, 30)`: "The Poisson probability of exactly (`dpois`) or at most (`ppois`) 20 events (`20`) with mean 30 (`lambda = 30`)."

**Right to left**, the order R runs it

- `dbinom(…)` lines: "Take x, size and prob, compute P(X = x) (`dbinom`), and print."
- `round(dbinom(0:5, 5, 1/6), 4)`: "Make 0 to 5 (`0:5`), compute the six binomial probabilities (`dbinom`), round them to 4 decimals (`round`), and print."
- `1 - pbinom(1, 5, 4/52)`: "Divide 4 by 52 (`4/52`), compute P(X ≤ 1) (`pbinom`), subtract it from 1 (`1 -`), and print."
- `dhyper(…)` lines: "Take x, m, n and k, compute P(X = x) (`dhyper`), and print."
- `phyper(4, 40, 50, 10)`: "Take q, m, n and k, compute P(X ≤ 4) (`phyper`), and print."
- `dgeom(2, 0.25)`: "Take 2 failures and prob 0.25, compute the probability (`dgeom`), and print."
- `1 - pgeom(2, 0.25)`: "Compute the chance of at most 2 failures (`pgeom`), subtract it from 1 (`1 -`), and print."
- `dpois(20, 30)`, `ppois(20, 30)`: "Take 20 and lambda = 30, compute P(X = 20) (`dpois`) or P(X ≤ 20) (`ppois`), and print."
:::

The outputs are the notes' answers: 0.0123, the 3s table, 0.0465 and 0.0506, 0.0399 against 0.0465, 0.0460, 0.2539 and 0.5189, 0.1406 and 0.4219, 0.0134 and 0.0353.

On paper the formula is written out with the numbers substituted; the `d`/`p` line checks it.

## The two recipes that go with any distribution

**Is a value unusual?** Compute $\mu$ and $\sigma$ from the distribution's shortcut formulas, then the Z-score:

$$Z = \dfrac{x - \mu}{\sigma}$$

Beyond $\pm 2$ is unusual (or a tail probability below 0.025).

```r
n <- 200; p <- 0.1; q <- 1 - p            # laser printers
mu <- n*p; sig <- sqrt(n*p*q)
(14 - mu)/sig
N <- 90; K <- 40; n <- 10; p <- K/N        # Mac users
mu <- n*K/N; sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))
(8 - mu)/sig
lambda <- 30                              # web server
(20 - lambda)/sqrt(lambda)
```
```text
[1] -1.414214
[1] 2.386629
[1] -1.825742
```

:::info R syntax
| Code | What it does |
|---|---|
| `;` | Separates commands written on one line; `n <- 200; p <- 0.1; q <- 1 - p` is three commands. |
| `n <- 200; p <- 0.1; q <- 1 - p` | `<-` is assignment: stores n, p and q = 1 − p. |
| `mu <- n*p; sig <- sqrt(n*p*q)` | `*` multiplies and `sqrt()` is the square root: the binomial μ and σ. |
| `(14 - mu)/sig` | Brackets first, then `/`. Not stored anywhere, so R prints it. |
| `N <- 90; K <- 40; n <- 10; p <- K/N` | Replaces `n` and `p`; R is case-sensitive, so `N` and `n` are different names. |
| `mu <- n*K/N; sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))` | The hypergeometric μ and σ; each bracket is worked out first. |
| `(8 - mu)/sig` | The Mac Z-score, printed. |
| `lambda <- 30` | Stores the Poisson mean. |
| `(20 - lambda)/sqrt(lambda)` | The server Z-score: σ = √λ in the denominator. |

**Left to right**

- `n <- 200; p <- 0.1; q <- 1 - p`: "Store under the names n, p and q (`n <-`, `p <-`, `q <-`) 200, 0.1 and 1 minus p (`1 - p`), one command after another (`;`)."
- `mu <- n*p; sig <- sqrt(n*p*q)`: "Store under the name mu (`mu <-`) n times p (`n*p`); then (`;`) store under the name sig (`sig <-`) the square root (`sqrt`) of n times p times q (`n*p*q`)."
- `(14 - mu)/sig`: "14 minus mu (`14 - mu`) divided by (`/`) sig (`sig`)."
- `N <- 90; K <- 40; n <- 10; p <- K/N`: "Store under the names N, K and n (`N <-`, `K <-`, `n <-`) 90, 40 and 10, and under p (`p <-`) K divided by N (`K/N`)."
- `mu <- n*K/N; sig <- …`: "Store under the name mu (`mu <-`) n times K over N (`n*K/N`); then store under the name sig (`sig <-`) the square root (`sqrt`) of n p (1 − p) times N minus n over N minus 1 (`(N-n)/(N-1)`)."
- `(8 - mu)/sig`: "8 minus mu (`8 - mu`) divided by (`/`) sig (`sig`)."
- `lambda <- 30`: "Store under the name lambda (`lambda <-`) the number 30."
- `(20 - lambda)/sqrt(lambda)`: "20 minus lambda (`20 - lambda`) divided by (`/`) the square root (`sqrt`) of lambda."

**Right to left**, the order R runs it

- `n <- 200; p <- 0.1; q <- 1 - p`: "Store 200 as n and 0.1 as p (`n <-`, `p <-`); subtract p from 1 (`1 - p`) and store it as q (`q <-`)."
- `mu <- n*p; sig <- sqrt(n*p*q)`: "Multiply n by p and store it as mu (`mu <-`); multiply n, p and q, take the square root (`sqrt`) and store it as sig (`sig <-`)."
- `(14 - mu)/sig`: "Subtract mu from 14 (`14 - mu`), divide by sig (`/`), and print."
- `N <- 90; K <- 40; n <- 10; p <- K/N`: "Store 90, 40 and 10 as N, K and n; divide K by N (`K/N`) and store it as p (`p <-`)."
- `mu <- n*K/N; sig <- …`: "Work out n K over N and store it as mu (`mu <-`); work out each bracket, multiply and divide, take the square root (`sqrt`), and store it as sig (`sig <-`)."
- `(8 - mu)/sig`: "Subtract mu from 8 (`8 - mu`), divide by sig (`/`), and print."
- `lambda <- 30`: "Take 30 and store it as lambda (`lambda <-`)."
- `(20 - lambda)/sqrt(lambda)`: "Subtract lambda from 20 (`20 - lambda`), take the square root of lambda (`sqrt`), divide (`/`), and print."
:::

Only the Mac count (Z = 2.39) is unusual; the printers (−1.41) and the quiet minute (−1.83) are not.

**The probability histogram.** Build the vector of $x$ values, apply the `d` function, and `barplot` with `space=0` so the bars touch:

```r
X.vals <- 0:10
p.vals <- dhyper(X.vals, 40, 50, 10)
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="x", ylab="P(x)", main="Number of Mac Users in a Sample (n=10)")
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- 0:10` | `<-` stores; `a:b` is the whole numbers from a to b, here 0 to 10. |
| `p.vals <- dhyper(X.vals, 40, 50, 10)` | x = all eleven values at once, m = 40 successes, n = 50 failures, k = 10 drawn. |
| `barplot(p.vals, …)` | One bar per value; `p.vals` fills `height`. |
| `names.arg=X.vals` | The labels under the bars: 0 to 10. |
| `col="pink"` | The bar fill colour. |
| `space=0` | No gap between bars, so they touch. |
| `xlab=`, `ylab=`, `main=` | The x-axis label, the y-axis label and the title, as strings. |

**Left to right**

- `X.vals <- 0:10`: "Store under the name X.vals (`X.vals <-`) the whole numbers 0 to 10 (`0:10`)."
- `p.vals <- dhyper(X.vals, 40, 50, 10)`: "Store under the name p.vals (`p.vals <-`) the hypergeometric probabilities (`dhyper`) of each x in X.vals (`X.vals`) with 40 successes (`m = 40`), 50 failures (`n = 50`) and 10 drawn (`k = 10`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of p.vals (`p.vals`), labelled 0 to 10 (`names.arg=X.vals`), in pink (`col="pink"`), with no gaps (`space=0`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `X.vals <- 0:10`: "Make 0 to 10 (`0:10`), then store it as X.vals (`X.vals <-`)."
- `p.vals <- dhyper(X.vals, 40, 50, 10)`: "Compute P(X = x) for every x in X.vals (`dhyper`), then store them as p.vals (`p.vals <-`)."
- `barplot(…)`: "Take the heights (`p.vals`), labels (`names.arg=X.vals`), colour (`col="pink"`), no gaps (`space=0`) and text labels (`xlab=`, `ylab=`, `main=`), and draw the bars (`barplot`)."
:::

With another `d` line and range of `X.vals` (`0:50` for the shoppers, `1:10` with `q^(X.vals - 1)*p` for the help line, `0:80` for the server), the same four lines draw every histogram in the unit.

## Practice scenarios

```widget
dist-picker
{ "scenarios": "practice", "title": "Eight scenario cards to classify, including Practice Problems 23 and 25" }
```

Practice Problem 23 (the first miss on the 15th shot) is geometric with success = miss, $p = 0.05$:

$$0.95^{14}(0.05) = \mathbf{0.0244}$$

Practice Problem 25 (ten 4-choice questions guessed, none right) is binomial with $n = 10$, $p = 0.25$, $x = 0$:

$$0.75^{10} = \mathbf{0.0563}$$

That is `dbinom(0, 10, 0.25)`.

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(0, 10, 0.25)` | `dbinom(x, size, prob)`: x = 0 right, size = 10 questions (n), prob = 0.25 (p). |

**Left to right**

- `dbinom(0, 10, 0.25)`: "The binomial probability of exactly (`dbinom`) 0 right (`x = 0`) in 10 questions (`size = 10`) at 0.25 each (`prob = 0.25`)."

**Right to left**, the order R runs it

- `dbinom(0, 10, 0.25)`: "Take x = 0, size = 10 and prob = 0.25, compute P(X = 0) (`dbinom`), and print."
:::

## Name the distribution: scrolls, a ladder draw, Star Force taps, a Chaos Orb and an intersection

Four of these stories are this unit's game examples, each with the structure its own lesson checked, so the four questions land on the same answers.

Ask them before computing anything.

```quiz
[
  {"q": "Ranks 1-200 of the Hardcore Allflame ladder hold 69 characters flagged dead out of 200. Pick 20 of those 200 characters at random, no character twice. X = the number of dead characters picked. Name the distribution (one word).", "type": "text", "answer": ["hypergeometric", "hypergeometric distribution"], "explain": "A fixed sample drawn without replacement from a finite list: hypergeometric with N = 200, K = 69, n = 20. The sample is 20/200 = 10 % of the list, above 5 %, so the binomial is not a stand-in. $$P(X = 7) = \\dfrac{C(69, 7) · C(131, 13)}{C(200, 20)} = 0.1942$$ That is dhyper(7, 69, 131, 20)."},
  {"q": "An intersection averages 0.8 accidents per month, at random. X = the number of accidents in a year. Name the distribution (one word).", "type": "text", "answer": ["poisson", "poisson distribution"], "explain": "A count of random, independent events over an interval with a known mean rate: Poisson."},
  {"q": "Same intersection: λ for one year = ?", "type": "numeric", "answer": 9.6, "tolerance": 0.001, "explain": "Rescale to the interval: $$0.8 \\text{ per month} × 12 \\text{ months} = \\mathbf{9.6} \\text{ accidents per year}$$ P(X = 10) would be dpois(10, 9.6)."},
  {"q": "Star Force, the enhancement that adds stars to gear, succeeds on a 14→15 tap 30 % of the time; on a non-Superior item a failure keeps the star and nothing is destroyed. X = the number of taps until the first success. P(X ≤ 3) = ? (4 decimals)", "type": "numeric", "answer": 0.657, "tolerance": 0.0001, "explain": "Geometric with p = 0.30: no fixed n, the same p every tap, and X counts taps to the first success. X ≤ 3 is the complement of three failed taps: $$1 − 0.70^3 = 1 − 0.343 = \\mathbf{0.6570}$$ In R, pgeom(2, 0.3), since R counts failures (3 − 1 = 2). The wiki's table leaves out the Star Catch bonus that v.271 builds in, so live success is slightly higher."},
  {"type": "fill", "q": "A Classic Intermediate scroll succeeds 60 % of the time. A player uses one on each of 5 items. X = the number that succeed. Complete the R call for P(X = 4).", "code": "dbinom(4, ___, 0.6)", "answer": ["5"], "explain": "Binomial: a fixed n = 5 uses, each a success or a failure with the same p = 0.6, independent of each other. dbinom(x, n, p) takes the count, then the trials. dbinom(4, 5, 0.6) is $$C(5, 4) × 0.6^4 × 0.4 = 5 × 0.1296 × 0.4 = 0.2592$$"},
  {"q": "A Chaos Orb rerolls every modifier on a rare item, and the result has 4, 5 or 6 affixes in the ratio 8:3:1. X = the affix count after one Chaos Orb. Which distribution does X have?", "options": ["binomial", "geometric", "Poisson", "none of the four: build the table from the weights"], "answer": 3, "explain": "One Chaos Orb is one draw from a weight table: no n trials, no waiting for a first success, no interval. So build the table, P(4) = 8/12, P(5) = 3/12, P(6) = 1/12, and use the general definition: $$\\mu = \\sum x P(x) = \\dfrac{4 × 8 + 5 × 3 + 6 × 1}{12} = \\dfrac{53}{12} = 4.42 \\text{ affixes}$$"}
]
```

```quiz
[
  {
    "type": "match",
    "q": "Match each scenario to its distribution and parameters.",
    "pairs": [
      ["50 shoppers, each buys with probability 0.25; X = number who buy", "binomial, n = 50, p = 0.25"],
      ["10 students sampled from a class of 90 with 40 Mac users; X = Mac users in the sample", "hypergeometric, N = 90, K = 40, n = 10"],
      ["A help line is busy 75% of the time; X = calls until you get through", "geometric, p = 0.25"],
      ["A server gets 1 request per 2 s; X = requests in a minute", "Poisson, λ = 30"],
      ["5 cards drawn with replacement; X = number of jacks", "binomial, n = 5, p = 4/52"],
      ["5 cards drawn without replacement; X = number of jacks", "hypergeometric, N = 52, K = 4, n = 5"],
      ["An expert hits 95% of shots; X = shot number of the first miss", "geometric, p = 0.05"],
      ["Bit errors arrive at 3 per minute; X = errors in a minute", "Poisson, λ = 3"]
    ],
    "explain": "Fixed n with the same p every time is binomial; fixed n without replacement from a finite population is hypergeometric; trials until the first success is geometric (success = the event you wait for, even a miss); events in an interval with a known rate is Poisson."
  },
  {
    "type": "fill",
    "q": "Complete the R call for P(X = 4) Mac users in a sample of 10 from a class of 90 with 40 Mac users.",
    "code": "dhyper(4, ___, ___, 10)",
    "answer": ["40", "50"],
    "explain": "dhyper takes the successes in the population (K = 40) and the failures (N − K = 50), never N itself. dhyper(4, 40, 50, 10) returns 0.2539."
  },
  {
    "q": "For the help line (X = number of calls until access, p = 0.25), `pgeom(2, 0.25)` is...",
    "options": ["P(X = 2)", "P(X ≤ 2)", "P(X ≤ 3)", "P(X ≥ 3)"],
    "answer": 2,
    "explain": "pgeom counts failures: at most 2 failures before the success means the success came by trial 3, so P(X ≤ 3) = 0.5781. Its complement 1 − pgeom(2, 0.25) is P(X ≥ 4) = 0.4219."
  },
  {
    "q": "Which R call gives P(at least 2 jacks) in 5 cards drawn with replacement?",
    "options": ["`1 - pbinom(1, 5, 4/52)`", "`1 - dbinom(2, 5, 4/52)`", "`pbinom(2, 5, 4/52)`", "`1 - pbinom(2, 5, 4/52)`"],
    "answer": 0,
    "explain": "At least 2 is the complement of at most 1: $$1 − \\text{pbinom}(1, 5, 4/52) = 1 − 0.6702 − 0.2792 = 0.0506$$ Subtracting pbinom(2,...) would wrongly remove P(2) as well."
  },
  {
    "q": "20 items are sampled without replacement from a shipment of 500. Which distribution is acceptable for the number of defectives?",
    "options": ["only the hypergeometric", "the binomial is acceptable: n/N = 4% is within the 5% rule", "only the Poisson", "the geometric"],
    "answer": 1,
    "explain": "Strictly the draw is hypergeometric, but 20/500 = 4% ≤ 5%, so the binomial with p = K/N gives practically the same probabilities. For 10 of 90 (11%) it would not."
  },
  {
    "q": "A binomial with n = 8 and p = 0.3. P(X = 3)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2541,
    "tolerance": 0.0003,
    "explain": "$$C(8,3) × 0.3^3 × 0.7^5 = 56 × 0.027 × 0.16807 = \\mathbf{0.2541}$$ In R, dbinom(3, 8, 0.3)."
  },
  {
    "type": "fill",
    "q": "A server averages one request every 2 seconds. Complete the R call for P(exactly 20 requests in one minute).",
    "code": "dpois(20, ___)",
    "answer": ["30"],
    "explain": "λ must be the mean for the interval in the question: $$60 \\text{ s} / 2 \\text{ s} = \\mathbf{30} \\text{ requests per minute}$$ dpois(20, 30) returns 0.0134."
  },
  {
    "q": "Which line of the `barplot` recipe makes the bars of a probability histogram touch?",
    "options": ["`col=\"pink\"`", "`names.arg=X.vals`", "`space=0`", "`xlab=\"x\"`"],
    "answer": 2,
    "explain": "space=0 removes the gap between bars; names.arg labels them with the x values and col only colours them."
  },
  {
    "q": "Of the three lecture Z-scores, printers −1.41, Mac users 2.39 and web server −1.83, which value is unusual?",
    "options": ["the printers' 14 repairs", "the web server's 20 requests", "none of them", "the 8 Mac users"],
    "answer": 3,
    "explain": "Only |2.39| exceeds 2. The other two are within two standard deviations of their means, so they are not unusual."
  }
]
```
