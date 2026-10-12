---
title: Which distribution, and the R function for each
minutes: 20
---

A quiz question never says "this is hypergeometric". It describes cards, printers or a help line, and the first mark is for naming the right distribution. Four questions about the story settle it, and one R pattern then computes any of them.

:::info Answers computed, not copied
The Unit 4 notes were posted blank from page 58 on; every value in this lesson is computed and checked against the demo notebook (`demo_notebook_Unit_04.Rmd`).
:::

## Four questions pick the distribution

| Ask | Yes means | $X$ is | $P(x)$ | $\mu$ | $\sigma^2$ |
|---|---|---|---|---|---|
| A fixed number of trials $n$, each success with the same $p$ (with replacement, or an infinite population)? | **Binomial** | number of successes in $n$ trials, 0 … $n$ | $nCx\, p^x q^{n-x}$ | $np$ | $npq$ |
| A fixed $n$ drawn **without replacement** from a finite population of $N$ with $K$ successes? | **Hypergeometric** | successes in the sample, 0 … $n$ | $\dfrac{C(K,x)\,C(N-K,\,n-x)}{C(N,n)}$ | $n\dfrac{K}{N}$ | $n\dfrac{K}{N}\dfrac{N-K}{N}\dfrac{N-n}{N-1}$ |
| Counting trials **until the first success**? | **Geometric** | trial number of the first success, 1, 2, 3, … | $q^{x-1} p$ | $\dfrac{1}{p}$ | $\dfrac{1-p}{p^2}$ |
| Counting **events in an interval** with a known mean rate? | **Poisson** | occurrences in the interval, 0, 1, 2, … | $\dfrac{\lambda^x}{x!} e^{-\lambda}$ | $\lambda$ | $\lambda$ |

Two refinements. If the draw is without replacement but $n/N \le 5\%$, the 5% rule says the binomial with $p = K/N$ is close enough (the superdeck: 0.0460 against 0.0465). And if none of the four fits, the general definitions still do: $\mu = \sum x P(x)$ and $\sigma^2 = \sum (x - \mu)^2 P(x)$ from the table, as for the minimum of two dice.

```widget
dist-picker
{ "scenarios": "lecture", "title": "Answer the four questions for each lecture scenario; Check names the distribution, its formula, mu, sigma and the R call" }
```

## One R pattern: d for P(X = x), p for P(X ≤ x)

Every distribution has a `d` function for a single probability and a `p` function for the cumulative probability up to and including $x$. The arguments differ, and the order matters:

| Distribution | $P(X = x)$ | $P(X \le x)$ | Arguments |
|---|---|---|---|
| Binomial | `dbinom(x, n, p)` | `pbinom(x, n, p)` | count, trials, success probability |
| Hypergeometric | `dhyper(x, K, N-K, n)` | `phyper(x, K, N-K, n)` | count, successes in population, **failures** in population, draws |
| Geometric | `dgeom(x-1, p)` | `pgeom(x-1, p)` | **failures** before the first success, so the lecture's $x$ becomes $x - 1$ |
| Poisson | `dpois(x, lambda)` | `ppois(x, lambda)` | count, mean for the interval |

`dhyper` never sees $N$: it wants the successes and the failures separately, so the Mac class is `dhyper(4, 40, 50, 10)`, not `dhyper(4, 40, 90, 10)`. "At least $x$" is `1 - p*(x-1, ...)`, the complement of "at most $x - 1$". For a by-hand check, `choose(n, x)` is $nCx$ and `factorial(x)` is $x!$.

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

Read down the outputs against the notes: 0.0123, the 3s table, 0.0465 and 0.0506, 0.0399 against 0.0465, 0.0460, 0.2539 and 0.5189, 0.1406 and 0.4219, 0.0134 and 0.0353. The `d`/`p` line is the check for any paper calculation; on the quiz the formula written out with the numbers substituted earns the marks, the R line only confirms them.

## The two recipes that go with any distribution

**Is a value unusual?** Compute $\mu$ and $\sigma$ from the distribution's shortcut formulas, then $Z = (x - \mu)/\sigma$; beyond $\pm 2$ is unusual (or a tail probability below 0.025).

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

Only the Mac count (Z = 2.39) is unusual; the printers (−1.41) and the quiet minute (−1.83) are not.

**The probability histogram.** Build the vector of $x$ values, apply the `d` function, and `barplot` with `space=0` so the bars touch:

```r
X.vals <- 0:10
p.vals <- dhyper(X.vals, 40, 50, 10)
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="x", ylab="P(x)", main="Number of Mac Users in a Sample (n=10)")
```

Swap the `d` line and the range of `X.vals` (`0:50` for the shoppers, `1:10` with `q^(X.vals - 1)*p` for the help line, `0:80` for the server) and the same four lines draw every histogram in the unit.

## Practice scenarios

```widget
dist-picker
{ "scenarios": "practice", "title": "Eight scenario cards, including Practice Problems 23 and 25: classify each, then Check" }
```

Practice Problem 23 (the first miss on the 15th shot) is geometric with success = miss, $p = 0.05$: $0.95^{14}(0.05) = 0.0244$. Practice Problem 25 (ten 4-choice questions guessed, none right) is binomial with $n = 10$, $p = 0.25$, $x = 0$: $0.75^{10} = 0.0563$, which is `dbinom(0, 10, 0.25)`.

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
    "explain": "dhyper takes the successes in the population (K = 40) and the failures (N − K = 50), never N itself: dhyper(4, 40, 50, 10) = 0.2539."
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
    "explain": "At least 2 is the complement of at most 1: 1 − pbinom(1, 5, 4/52) = 1 − 0.6702 − 0.2792 = 0.0506. Subtracting pbinom(2, ...) would wrongly remove P(2) as well."
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
    "explain": "C(8,3) × 0.3^3 × 0.7^5 = 56 × 0.027 × 0.16807 = 0.2541; dbinom(3, 8, 0.3)."
  },
  {
    "type": "fill",
    "q": "A server averages one request every 2 seconds. Complete the R call for P(exactly 20 requests in one minute).",
    "code": "dpois(20, ___)",
    "answer": ["30"],
    "explain": "λ must be the mean for the interval in the question: 60 s / 2 s = 30 requests per minute, so dpois(20, 30) = 0.0134."
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
