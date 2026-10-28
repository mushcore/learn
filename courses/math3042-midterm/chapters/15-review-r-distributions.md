---
title: "Review 4: R for distributions on paper: d, p and r"
minutes: 30
---
<!-- facts: gms.data.ranking-overall-legendary-2026-10-27, gms.starforce.rates-0-14, gms.starforce.star-catch, classic.scroll.tiers, poe1.fusing.six-link-measured -->

A ranked list drawn without replacement, Star Force taps below 15 and scroll uses are the paper's hypergeometric, geometric and binomial stories, so the new variants fill the same R slots from game numbers.

:::quiz What the paper asks and what earns the marks
About 3 marks: Q8 asks for three single R commands (simulate, exactly, at least) for a hypergeometric draw. Each command is 1 mark, and the mark needs the right prefix (r, d or p), the right function, every number in the right slot, and the right cut point for "at least". No output number is asked for.
:::

## Write this on the paper

For every "write an R command" question:

1. **Name the distribution** from the story (fixed n with replacement: binomial; without replacement from a population: hypergeometric; first success on try x: geometric; count per interval: Poisson).
2. **Pick the prefix** from the wording: simulate → `r`; exactly → `d`; at most, fewer than, at least, more than, between → `p`.
3. **Turn the inequality into a cut point** with the table below.
4. **Fill the slots in R's order**, writing sums unevaluated (`116+154`) so the marker sees your counts.

Mandatory if time is short: Q8 and the first three new variants. The rest is "if time".

## The four prefixes

Every distribution in R has four functions; only the first letter changes.

| Prefix | Means | Returns |
|---|---|---|
| `d` | exactly | $P(X = x)$ |
| `p` | at most (cumulative) | $P(X \le q)$, everything from 0 up to q added |
| `q` | quantile | the x value with a given cumulative probability (rare on the paper) |
| `r` | random draws | simulated values of X |

Tiny case: 30 rolls of a 12-sided die, X = number of 8s. `dbinom(3, 30, 1/12)` is P(X = 3) = 0.2242; `pbinom(2, 30, 1/12)` is P(X ≤ 2) = 0.5383 (Lab 6).

## The argument order of each family

| Distribution | d | p | r |
|---|---|---|---|
| Binomial | `dbinom(x, n, p)` | `pbinom(k, n, p)` | `rbinom(reps, n, p)` |
| Hypergeometric | `dhyper(x, K, N-K, n)` | `phyper(k, K, N-K, n)` | `rhyper(reps, K, N-K, n)` |
| Geometric | `dgeom(x-1, p)` | `pgeom(x-1, p)` | |
| Poisson | `dpois(x, lambda)` | `ppois(k, lambda)` | `rpois(reps, lambda)` |

Here n is the number of trials or the sample size, p the chance of success on one trial, N the population size, K the successes in the population, λ (lambda) the mean count for the interval, reps the number of simulated values.

:::warn Two traps: R's hypergeometric third slot, and the geometric x − 1
`dhyper`'s third slot is the population **failures**, N − K, not N; the sample size goes **last**. With N = 50 and K = 8 you write `42` (or `50-8`), never `50`.

R's geometric counts the **failures before** the first success, so "the first success is on try 5" is `dgeom(5-1, p)`.
:::

**What the provided R sheet gives you.** The generic base R sheet names only `dbinom`, `pbinom`, `rbinom`, `dpois`, `ppois`, `rpois`, and it gives no argument order. Everything in the table above (every slot order, and all of `dhyper`, `phyper`, `rhyper`, `dgeom`, `pgeom`) must come from memory.

```diagram
{ "type": "grid", "title": "Prefix by family, slots in R's order", "nodes": [ { "id": "h0", "label": "family", "row": 0, "col": 0 }, { "id": "hd", "label": "d: exactly", "row": 0, "col": 1 }, { "id": "hp", "label": "p: at most", "row": 0, "col": 2 }, { "id": "hr", "label": "r: random", "row": 0, "col": 3 }, { "id": "b0", "label": "Binomial", "row": 1, "col": 0 }, { "id": "bd", "label": "dbinom(x, n, p)", "row": 1, "col": 1 }, { "id": "bp", "label": "pbinom(k, n, p)", "row": 1, "col": 2 }, { "id": "br", "label": "rbinom(reps, n, p)", "row": 1, "col": 3 }, { "id": "y0", "label": "Hypergeometric", "row": 2, "col": 0 }, { "id": "yd", "label": "dhyper(x, K, N-K, n)", "row": 2, "col": 1 }, { "id": "yp", "label": "phyper(k, K, N-K, n)", "row": 2, "col": 2 }, { "id": "yr", "label": "rhyper(reps, K, N-K, n)", "row": 2, "col": 3 }, { "id": "g0", "label": "Geometric", "row": 3, "col": 0 }, { "id": "gd", "label": "dgeom(x-1, p)", "row": 3, "col": 1 }, { "id": "gp", "label": "pgeom(x-1, p)", "row": 3, "col": 2 }, { "id": "gr", "label": "(none)", "row": 3, "col": 3 }, { "id": "o0", "label": "Poisson", "row": 4, "col": 0 }, { "id": "od", "label": "dpois(x, lambda)", "row": 4, "col": 1 }, { "id": "op", "label": "ppois(k, lambda)", "row": 4, "col": 2 }, { "id": "or", "label": "rpois(reps, lambda)", "row": 4, "col": 3 } ], "hi": ["yd", "yp", "yr", "gd", "gp"], "caption": "Lit cells are the slots the provided R sheet does not give: every hypergeometric and geometric call. The sheet gives none of the argument orders either, so learn every cell." }
```

## The inequality table

The p-function adds from the left, up to and including its cut point. Every other wording is built from it. Example cut at k = 5:

| Words | Means | R |
|---|---|---|
| exactly 5 | X = 5 | `d...(5, ...)` |
| at most 5 | X ≤ 5 | `p...(5, ...)` |
| fewer than 5 | X ≤ 4 | `p...(4, ...)` |
| at least 5 | X ≥ 5 | `1 - p...(4, ...)` |
| more than 5 | X ≥ 6 | `1 - p...(5, ...)` or `p...(5, ..., lower.tail = FALSE)` |
| 2 to 5 inclusive | 2 ≤ X ≤ 5 | `p...(5, ...) - p...(1, ...)` |

:::warn At least k cuts at k − 1
"At least 12" is $1 - P(X \le 11)$. Writing 12 in the p-call computes "at least 13".
:::

```diagram
{ "type": "flow", "title": "Words to the p-call", "nodes": [ { "id": "w0", "label": "exactly k" }, { "id": "r0", "label": "d(k)", "kind": "pill" }, { "id": "w1", "label": "at most k" }, { "id": "r1", "label": "p(k)", "kind": "pill" }, { "id": "w2", "label": "fewer than k" }, { "id": "r2", "label": "p(k-1)", "kind": "pill" }, { "id": "w3", "label": "at least k" }, { "id": "r3", "label": "1 - p(k-1)", "kind": "pill" }, { "id": "w4", "label": "more than k" }, { "id": "r4", "label": "1 - p(k)", "kind": "pill" }, { "id": "w5", "label": "j to k", "sub": "inclusive" }, { "id": "r5", "label": "p(k) - p(j-1)", "kind": "pill" } ], "edges": [ { "from": "w0", "to": "r0" }, { "from": "w1", "to": "r1" }, { "from": "w2", "to": "r2" }, { "from": "w3", "to": "r3" }, { "from": "w4", "to": "r4" }, { "from": "w5", "to": "r5" } ], "hi": ["r2", "r3"], "caption": "Each word box points to its R call. Lit: the two that cut at k − 1, fewer than k and at least k." }
```

## One breakdown per call shape

```r
dbinom(6, 30, 1/12)
```

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom` | Binomial, exactly: returns P(X = x). |
| `6` | x, the count asked about. |
| `30` | n (R calls it `size`): the number of trials. |
| `1/12` | p (R calls it `prob`): the chance of success on one trial. |

**Left to right**

- "The binomial probability of exactly (`dbinom`) 6 (`6`) successes in 30 trials (`30`) with chance 1/12 each (`1/12`)."

**Right to left**, the order R runs it

- "Work out 1/12 (`1/12`), take 30 trials (`30`) and the count 6 (`6`), then compute P(X = 6) (`dbinom`)."
:::

```r
1 - pbinom(5, 30, 1/12)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(5, 30, 1/12)` | Binomial, cumulative: P(X ≤ 5) for n = 30, p = 1/12. |
| `1 - …` | One minus that: P(X ≥ 6), "at least 6". |

**Left to right**

- "One (`1`) minus (`-`) the binomial probability of at most (`pbinom`) 5 (`5`) in 30 trials (`30`) at 1/12 (`1/12`)."

**Right to left**, the order R runs it

- "Compute P(X ≤ 5) (`pbinom`), then subtract it (`-`) from one (`1`)."
:::

```r
pbinom(6, 30, 1/12) - pbinom(1, 30, 1/12)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(6, 30, 1/12)` | P(X ≤ 6). |
| `- pbinom(1, 30, 1/12)` | Subtracts P(X ≤ 1), leaving 2, 3, 4, 5, 6. |

**Left to right**

- "At most 6 (`pbinom(6, ...)`) minus (`-`) at most 1 (`pbinom(1, ...)`): between 2 and 6 inclusive."

**Right to left**, the order R runs it

- "Compute both cumulative probabilities, then subtract the second from the first (`-`)."
:::

```r
rbinom(1, 50, 0.13)
```

:::info R syntax
| Code | What it does |
|---|---|
| `rbinom` | Binomial, random: draws simulated values of X. |
| `1` | How many simulated values (R's `n`; here one sample). |
| `50` | `size`: trials in each sample. |
| `0.13` | `prob`: the chance of success. |

**Left to right**

- "Draw at random (`rbinom`) one value (`1`) of a binomial count in 50 trials (`50`) at 0.13 (`0.13`)."

**Right to left**, the order R runs it

- "Take the chance 0.13 (`0.13`) and 50 trials (`50`), then simulate one count (`1`, `rbinom`)."
:::

```r
phyper(100, K, N-K, n)
```

:::info R syntax
| Code | What it does |
|---|---|
| `phyper` | Hypergeometric, cumulative: P(X ≤ q). `dhyper` and `rhyper` take the same four slots. |
| `100` | q, the cut point (for `rhyper`, the number of simulations). |
| `K` | Successes in the population (R's `m`). |
| `N-K` | Failures in the population (R's `n`). `-` subtracts before the call runs. |
| `n` | The sample size (R's `k`), last. |

**Left to right**

- "The hypergeometric probability of at most (`phyper`) 100 (`100`) with K successes (`K`) and N minus K failures (`N-K`), drawing n (`n`)."

**Right to left**, the order R runs it

- "Work out N − K (`N-K`), take K, n and the cut 100, then compute P(X ≤ 100) (`phyper`)."
:::

```r
pgeom(500-1, 0.001)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pgeom` | Geometric, cumulative: P(first success by try x). `dgeom` takes the same two slots for "on try x". |
| `500-1` | x − 1: R counts the failures before the first success. |
| `0.001` | p, the chance of success on one try. |

**Left to right**

- "The geometric probability (`pgeom`) of 499 or fewer failures (`500-1`) before the first success at chance 0.001 (`0.001`)."

**Right to left**, the order R runs it

- "Work out 500 − 1 (`500-1`), take p (`0.001`), then compute P(first success within 500 tries) (`pgeom`)."
:::

```r
ppois(30-1, lambda)
```

:::info R syntax
| Code | What it does |
|---|---|
| `ppois` | Poisson, cumulative: P(X ≤ q). `dpois(x, lambda)` is exactly; `rpois(reps, lambda)` simulates. |
| `30-1` | The cut 29: "fewer than 30". |
| `lambda` | The mean count for the interval (a stored number, here 34). |

**Left to right**

- "The Poisson probability of at most (`ppois`) 29 (`30-1`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- "Work out 30 − 1 (`30-1`), look up lambda, then compute P(X ≤ 29) (`ppois`)."
:::

## Sample midterm Q8 (3 marks)

> Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area. The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. Twenty passengers are randomly selected, without replacement. Write a single R command that
>
> a. [1] Simulates this scenario and determines the number of passengers in the group of 20 that were on flight 911.
> b. [1] Computes the probability that exactly 9 of the 20 passengers were on flight 311.
> c. [1] Computes the probability that at least 12 of the 20 passengers were on flight 311.

Write all three on paper first. Without replacement from 312 people split into "on this flight" and "not": hypergeometric.

```quiz
[
  {
    "type": "fill",
    "q": "**Q8a.** Simulate: fill the failures slot (flight 911 is the success).",
    "code": "rhyper(1, 154, ___, 20)",
    "answer": ["42+116", "158", "116+42"],
    "explain": "`rhyper(1, 154, 42+116, 20)`. \"Simulates\" is an r-function. One simulation, 154 successes (flight 911), the other two flights' 42 + 116 = 158 passengers as failures, 20 drawn last."
  },
  {
    "type": "fill",
    "q": "**Q8b.** Exactly 9 on flight 311: fill the successes slot.",
    "code": "dhyper(9, ___, 116+154, 20)",
    "answer": ["42"],
    "explain": "`dhyper(9, 42, 116+154, 20)`. \"Exactly\" is the d-function. The successes are now flight 311's 42 passengers, so the failures are 116 + 154. It returns 0.0002997."
  },
  {
    "type": "fill",
    "q": "**Q8c.** At least 12 on flight 311: fill the cut point.",
    "code": "1 - phyper(___, 42, 116+154, 20)",
    "answer": ["11"],
    "explain": "$$P(X \\ge 12) = 1 - P(X \\le 11)$$ so `1 - phyper(11, 42, 116+154, 20)`, or `phyper(11, 42, 116+154, 20, lower.tail = FALSE)`. Writing 12 computes P(X ≥ 13). It returns about 4.45 × 10⁻⁷."
  }
]
```

The full breakdowns for each Q8 line are in [Q7 to Q9](#/math3042-midterm/practice-r); every signature and more drills are in [R on paper](#/math3042-midterm/r-on-paper).

## Lab questions

**Lab 6, Task 2.** A 12-sided die rolled 30 times, X = the number of 8s (`n <- 30`, `p <- 1/12`). The lab's commands: exactly 6 `dbinom(6, n, p)` = 0.02464; at most 6 `pbinom(6, n, p)` = 0.9898; at least 6 `1 - pbinom(5, n, p)` = 0.03487; more than 6 `1 - pbinom(6, n, p)` = 0.01023; between 2 and 6 `pbinom(6, n, p) - pbinom(1, n, p)` = 0.7158.

**Lab 7, Task 4.** 999 chips, 333 badly coated, 300 sampled (`N <- 999`, `K <- 333`, `n <- 300`): exactly 100 `dhyper(100, K, N-K, n)` = 0.05835; fewer than 100 `phyper(99, K, N-K, n)` = 0.4721; at least 110 `1 - phyper(109, K, N-K, n)` = 0.08254.

**Lab 7, Task 7.** A switch fails with probability 0.001 per on-off: fails by try 500 `pgeom(500-1, 0.001)` = 0.3936; does not fail until at least try 1200 `1 - pgeom(1199-1, 0.001)` = 0.3013.

**Lab 7, Task 10.** 34 transformer failures per year (`lambda <- 34`): fewer than 30 `ppois(30-1, lambda)` = 0.2235; more than 38 `1 - ppois(38, lambda)` = 0.2166; 68 or fewer over two years `ppois(68, lambda*2)`, λ doubled for the doubled interval.

```quiz
[
  {
    "type": "fill",
    "q": "Lab 7 Task 4: fewer than 100 badly coated chips.",
    "code": "phyper(___, K, N-K, n)",
    "answer": ["99", "100-1"],
    "explain": "Fewer than 100 is at most 99, so the cut is 99. The lab's output: 0.4721."
  },
  {
    "type": "fill",
    "q": "Lab 7 Task 10: more than 38 failures in a year.",
    "code": "1 - ppois(___, lambda)",
    "answer": ["38"],
    "explain": "More than 38 is everything except 38 or fewer: $$1 - P(X \\le 38)$$ The lab's output: 0.2166."
  }
]
```

## New variants

The first three are mandatory; the rest are "if time". Write the whole command on paper, then fill the blank.

The game stories, with why each fits its family:

- **Hypergeometric.** Nexon's North America overall ranking top 500 on 2026-10-27 holds 61 Night Lords (a thief job). Drawing characters from that fixed list of 500 without replacement changes the chance after every pick.
- **Geometric.** Star Force, the GMS enhancement that adds stars to gear: at 14 stars on a non-Superior item the wiki's table gives each tap a 0.30 success rate, and a failure keeps the star with no destruction, so every tap is the same independent trial until the first success.
- **Binomial.** An Intermediate scroll, the MapleStory Classic tier, succeeds 60 % of the time on every use, and one use does not change the next.
- **Large-n binomial.** An Orb of Fusing, the PoE1 currency that rerolls socket links, six-links a six-socket item about 1 time in 1000, measured over n = 100 000 Fusings in a 2017 test on a 20 %-quality item; separate players each using one Fusing are separate trials at that rate.

Name the distribution first. Practise on the cards before the variants:

```widget
dist-picker
{ "scenarios": "lecture" }
```


```quiz
[
  {
    "type": "fill",
    "q": "1 (mandatory). From the 500 ranked characters (61 Night Lords) you pick 6 at random without replacement. P(at most 1 Night Lord)? Fill R's third slot.",
    "code": "phyper(1, 61, ___, 6)",
    "answer": ["439", "500-61"],
    "explain": "Let X = Night Lords among the 6. Without replacement from a fixed list: **hypergeometric**. N = 500, K = 61, so the failures are $$N - K = 500 - 61 = 439$$ \"At most 1\" is the p-function at 1, and the sample size 6 goes last: `phyper(1, 61, 439, 6)` = 0.8409. Writing 500 in the third slot is the classic error."
  },
  {
    "type": "fill",
    "q": "2 (mandatory). Tapping 14→15 stars, success 0.30 per tap. P(the 5th tap is the first success)? Fill the first slot.",
    "code": "dgeom(___, 0.3)",
    "answer": ["4", "5-1"],
    "explain": "Let X = the tap of the first success: **geometric**, since below 15 a failure keeps the star and nothing is destroyed. \"Is\" means exactly, so the d-function. R counts the failures before the first success: $$x - 1 = 5 - 1 = 4$$ `dgeom(5-1, 0.3)` = $0.7^4 \\times 0.3$ = 0.0720."
  },
  {
    "type": "fill",
    "q": "3 (mandatory). A help desk gets 2.4 calls per hour. P(fewer than 3 calls in an hour)? Fill the cut point.",
    "code": "ppois(___, 2.4)",
    "answer": ["2", "3-1"],
    "explain": "Let X = calls in one hour: **Poisson** with λ = 2.4. \"Fewer than 3\" is 0, 1 or 2, so at most 2: `ppois(2, 2.4)` = 0.5697."
  },
  {
    "type": "fill",
    "q": "4 (if time). You use 20 Intermediate scrolls (60 % each). P(more than 14 succeed)? Fill the cut point.",
    "code": "1 - pbinom(___, 20, 0.6)",
    "answer": ["14"],
    "explain": "Let X = successes among 20 uses: **binomial**, n = 20, p = 0.6. \"More than 14\" starts at 15, so subtract at most 14: `1 - pbinom(14, 20, 0.6)` or `pbinom(14, 20, 0.6, lower.tail = FALSE)` = 0.1256."
  },
  {
    "type": "fill",
    "q": "5 (if time). 5000 players each use one Orb of Fusing on their own six-socket item (p = 0.001). P(at least 4 six-link)? Fill the cut point.",
    "code": "1 - pbinom(___, 5000, 0.001)",
    "answer": ["3", "4-1"],
    "explain": "Binomial, n = 5000, p = 0.001 (expected count $np = 5$). \"At least 4\" is everything except 3 or fewer: $$1 - P(X \\le 3)$$ `1 - pbinom(3, 5000, 0.001)` = 0.7351."
  },
  {
    "type": "fill",
    "q": "6 (if time). Typos average 3 per page. P(between 2 and 5 typos on a page, inclusive)? Fill the second cut point.",
    "code": "ppois(5, 3) - ppois(___, 3)",
    "answer": ["1", "2-1"],
    "explain": "Poisson, λ = 3. \"2 to 5\" is at most 5 minus at most 1, which removes 0 and 1 and keeps 2: `ppois(5, 3) - ppois(1, 3)` = 0.7169."
  },
  {
    "type": "fill",
    "q": "7 (if time). Same 14→15 taps (p = 0.3): P(the first success comes within the first 10 taps)? Fill the first slot.",
    "code": "pgeom(___, 0.3)",
    "answer": ["9", "10-1"],
    "explain": "Geometric, cumulative: \"within 10 taps\" is at most 10, and R wants x − 1 = 9: `pgeom(10-1, 0.3)` = $1 - 0.7^{10}$ = 0.9718."
  },
  {
    "type": "fill",
    "q": "8 (if time). Simulate the number of calls in each of 30 separate hours at the help desk (2.4 per hour). Fill the first slot.",
    "code": "rpois(___, 2.4)",
    "answer": ["30"],
    "explain": "\"Simulate\" is the r-function. The first slot of every r-function is how many random values to draw: 30 hours. `rpois(30, 2.4)` returns 30 random whole numbers averaging near 2.4. The binomial version, 1000 simulated batches of 20 Intermediate scrolls, is `rbinom(1000, 20, 0.6)`."
  }
]
```

Check each variant after you fill it: the bars, the substituted formula and the R line for its numbers.

Variant 1, hypergeometric: 6 picks from 500 with 61 Night Lords, P(X ≤ 1).

```widget
hyper-vs-binom
{ "N": 500, "K": 61, "n": 6, "x": 1, "presets": false, "title": "Variant 1: phyper(1, 61, 439, 6)" }
```

Variants 2 and 7, geometric: first success on tap 5 at p = 0.3.

```widget
geometric-calc
{ "p": 0.3, "x": 5, "presets": false, "title": "Variant 2: dgeom(5-1, 0.3)" }
```

Variant 3, Poisson: 2.4 calls per hour, fewer than 3 is at most 2.

```widget
poisson-calc
{ "rate": 2.4, "per": 1, "unit": "h", "interval": 1, "x": 2, "op": "le", "presets": false, "title": "Variant 3: ppois(2, 2.4)" }
```

Variant 4, binomial: 20 Intermediate scrolls at 0.6, more than 14 is at least 15.

```widget
binomial-calc
{ "n": 20, "p": 0.6, "x": 15, "op": "ge", "presets": false, "title": "Variant 4: 1 - pbinom(14, 20, 0.6)" }
```
