---
title: "R on paper: the d, p, q, r families, inequalities, simulation functions"
minutes: 24
---
<!-- facts: classic.scroll.tiers, gms.starforce.rates-0-14, gms.starforce.star-catch, poe1.ladder.hc-dead-by-rank -->

The R sheet names a few distribution functions but never their arguments, and the exam asks for runnable lines written by hand. This lesson fixes the signatures, the inequality-to-function table and the shape of a simulation function from Labs 6 and 7, and writes the calls for Unit 4's scroll, Star Force and ladder examples.

## d is P(X = x), p is P(X ≤ q), q is a quantile, r is a random draw

Every distribution has four functions that share a first letter. `d` gives one bar, $P(X = x)$. `p` gives the cumulative $P(X \le q)$, the bars from 0 up to and including q. `q` goes backwards from a probability to the value. `r` draws random values. In Lab 6's words, "size means n, prob means p". Lab 6 opens with a 12-sided die rolled 30 times, X = the number of 8s:

```r
choose(30,3)*(1/12)^3*(11/12)^27   # P(X = 3) by the formula
dbinom(3, 30, 1/12)                # the same bar
pbinom(2, 30, 1/12)                # P(X <= 2)
```
```text
[1] 0.2242
[1] 0.2242
[1] 0.5383
```

:::info R syntax
| Code | What it does |
|---|---|
| `choose(30,3)` | n choose x, the number of ways to pick 3 rolls out of 30. |
| `*(1/12)^3*(11/12)^27` | `^` raises to a power, `/` divides, `*` multiplies: the binomial formula written out. |
| `# P(X = 3) by the formula` | `#` starts a comment: R ignores the rest of the line. |
| `dbinom(3, 30, 1/12)` | x = 3, size = 30 (n), prob = 1/12 (p). Returns P(X = 3). |
| `pbinom(2, 30, 1/12)` | q = 2, size = 30, prob = 1/12. Returns P(X ≤ 2). |
| `[1]` | In the output, the index of the first value on the printed line. Each line here prints one value. |

**Left to right**

- `choose(30,3)*(1/12)^3*(11/12)^27`: "The number of ways to choose (`choose`) 3 of 30 (`30,3`), times (`*`) one twelfth (`1/12`) to the power (`^`) 3, times (`*`) eleven twelfths (`11/12`) to the power (`^`) 27."
- `dbinom(3, 30, 1/12)`: "The binomial probability of exactly (`dbinom`) 3 (`3`) in 30 trials (`30`) with probability one twelfth (`1/12`)."
- `pbinom(2, 30, 1/12)`: "The binomial probability of at most (`pbinom`) 2 (`2`) in 30 trials (`30`) with probability one twelfth (`1/12`)."

**Right to left**, the order R runs it

- `choose(30,3)*(1/12)^3*(11/12)^27`: "Divide 1 by 12 and 11 by 12 (`/`), raise them to the powers 3 and 27 (`^`), count the ways to choose 3 of 30 (`choose`), then multiply all three (`*`)."
- `dbinom(3, 30, 1/12)`: "Divide 1 by 12 (`1/12`), take 3 successes (`3`) and 30 trials (`30`), then compute P(X = 3) (`dbinom`)."
- `pbinom(2, 30, 1/12)`: "Divide 1 by 12 (`1/12`), take the cut-off 2 (`2`) and 30 trials (`30`), then add up P(0) to P(2) (`pbinom`)."
:::

### Thirty rolls of a 12-sided die

The bars are $P(X = x)$ for n = 30, p = 1/12; change the operation to see which `dbinom` or `pbinom` line produces the shaded bars.

```widget
binomial-calc
{ "n": 30, "p": "1/12", "x": 2, "op": "le", "title": "Lab 6: X = number of 8s in 30 rolls of a 12-sided die" }
```

## Twelve signatures to know cold

R's argument names reuse the course's letters for other things. Each cell reads "R's name → what you put there, in the course's symbols"; `reps` is how many random values an `r` function draws.

| Position | binomial | hypergeometric | geometric | Poisson |
|---|---|---|---|---|
| 1 (d, p) | `x` / `q` → x or k | `x` / `q` → x or k | `x` / `q` → x − 1 or k − 1 failures | `x` / `q` → x or k |
| 1 (r) | `n` → reps | `nn` → reps | `n` → reps | `n` → reps |
| 2 | `size` → n trials | `m` → K successes | `prob` → p | `lambda` → λ |
| 3 | `prob` → p | `n` → N − K failures | | |
| 4 | | `k` → n, the sample size | | |

:::warn R's n, m and k are not the course's
In `dhyper`, `phyper` and `rhyper`, R's `m` is the successes K, R's `n` is the failures N − K, and R's `k` is the course's sample size n. In every `r` function R's first argument, also named `n`, is reps, not a number of trials.
:::

| | $P(X = x)$ | $P(X \le k)$ | `reps` random values |
|---|---|---|---|
| binomial | `dbinom(x, n, p)` | `pbinom(k, n, p)` | `rbinom(reps, n, p)` |
| hypergeometric | `dhyper(x, K, N-K, n)` | `phyper(k, K, N-K, n)` | `rhyper(reps, K, N-K, n)` |
| geometric | `dgeom(x-1, p)` | `pgeom(k-1, p)` | `rgeom(reps, p) + 1` |
| Poisson | `dpois(x, lambda)` | `ppois(k, lambda)` | `rpois(reps, lambda)` |

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(x, n, p)` | R's names: x = x, size = n trials, prob = p. Returns P(X = x). |
| `pbinom(k, n, p)` | q = k, size = n, prob = p. Returns P(X ≤ k). |
| `rbinom(reps, n, p)` | R's `n` = reps values to draw (not the trials), size = n, prob = p. |
| `dhyper(x, K, N-K, n)` | x = x, m = K successes in the population, n = N-K failures, k = n sample size. R's `n` is the failures. |
| `phyper(k, K, N-K, n)` | q = k, then m, n, k as in `dhyper`. Returns P(X ≤ k). |
| `rhyper(reps, K, N-K, n)` | nn = reps values to draw, then R's m, n, k as in `dhyper`. |
| `dgeom(x-1, p)` | x = x-1 failures before the first success, prob = p. |
| `pgeom(k-1, p)` | q = k-1 failures, prob = p. Returns P(at most k trials). |
| `rgeom(reps, p) + 1` | R's `n` = reps values to draw, prob = p; `+ 1` adds one to every value, turning failures into trials. |
| `dpois(x, lambda)` | x = x, lambda = the mean count for the interval. |
| `ppois(k, lambda)` | q = k, lambda. Returns P(X ≤ k). |
| `rpois(reps, lambda)` | R's `n` = reps values to draw, lambda. |

**Left to right**

**Binomial**

- `dbinom(x, n, p)`: "The binomial probability of exactly (`dbinom`) x successes (`x`) in n trials (`n`) with probability p (`p`)."
- `pbinom(k, n, p)`: "The binomial probability of at most (`pbinom`) k (`k`) in n trials (`n`) with probability p (`p`)."
- `rbinom(reps, n, p)`: "Draw at random (`rbinom`) reps counts (`reps`), each from n trials (`n`) with probability p (`p`)."

**Hypergeometric**

- `dhyper(x, K, N-K, n)`: "The hypergeometric probability of exactly (`dhyper`) x (`x`) with K successes (`K`) and N minus K failures (`N-K`), drawing n (`n`)."
- `phyper(k, K, N-K, n)`: "The hypergeometric probability of at most (`phyper`) k (`k`) with K successes (`K`), N minus K failures (`N-K`), drawing n (`n`)."
- `rhyper(reps, K, N-K, n)`: "Draw at random (`rhyper`) reps counts (`reps`) with K successes (`K`), N minus K failures (`N-K`), drawing n (`n`)."

**Geometric**

- `dgeom(x-1, p)`: "The geometric probability of exactly (`dgeom`) x minus 1 failures (`x-1`) before a success with probability p (`p`)."
- `pgeom(k-1, p)`: "The geometric probability of at most (`pgeom`) k minus 1 failures (`k-1`) with probability p (`p`)."
- `rgeom(reps, p) + 1`: "Draw at random (`rgeom`) reps failure counts (`reps`) with probability p (`p`), plus one (`+ 1`) each."

**Poisson**

- `dpois(x, lambda)`: "The Poisson probability of exactly (`dpois`) x (`x`) with mean lambda (`lambda`)."
- `ppois(k, lambda)`: "The Poisson probability of at most (`ppois`) k (`k`) with mean lambda (`lambda`)."
- `rpois(reps, lambda)`: "Draw at random (`rpois`) reps counts (`reps`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

**Binomial**

- `dbinom(x, n, p)`: "Take x (`x`), n trials (`n`) and p (`p`), then compute P(X = x) (`dbinom`)."
- `pbinom(k, n, p)`: "Take k (`k`), n (`n`) and p (`p`), then add up P(0) to P(k) (`pbinom`)."
- `rbinom(reps, n, p)`: "Take how many draws (`reps`), n (`n`) and p (`p`), then simulate the counts (`rbinom`)."

**Hypergeometric**

- `dhyper(x, K, N-K, n)`: "Subtract K from N for the failures (`N-K`), take x (`x`), K (`K`) and the sample size (`n`), then compute P(X = x) (`dhyper`)."
- `phyper(k, K, N-K, n)`: "Subtract K from N (`N-K`), take k (`k`), K (`K`) and n (`n`), then add up P(0) to P(k) (`phyper`)."
- `rhyper(reps, K, N-K, n)`: "Subtract K from N (`N-K`), take how many draws (`reps`), K (`K`) and n (`n`), then simulate the counts (`rhyper`)."

**Geometric**

- `dgeom(x-1, p)`: "Subtract 1 from the trial number (`x-1`), take p (`p`), then compute the probability of that many failures first (`dgeom`)."
- `pgeom(k-1, p)`: "Subtract 1 from k (`k-1`), take p (`p`), then compute the cumulative probability (`pgeom`)."
- `rgeom(reps, p) + 1`: "Take how many draws (`reps`) and p (`p`), simulate failure counts (`rgeom`), then add one to each (`+ 1`)."

**Poisson**

- `dpois(x, lambda)`: "Take x (`x`) and the mean (`lambda`), then compute P(X = x) (`dpois`)."
- `ppois(k, lambda)`: "Take k (`k`) and the mean (`lambda`), then add up P(0) to P(k) (`ppois`)."
- `rpois(reps, lambda)`: "Take how many draws (`reps`) and the mean (`lambda`), then simulate the counts (`rpois`)."
:::

Leave the hypergeometric failures as an unevaluated sum, as the instructor does: `dhyper(9, 42, 116+154, 20)`.

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(9, 42, 116+154, 20)` | x = 9, m = 42 successes, n = 116+154 failures, k = 20 drawn. `+` adds before the call runs, so the sum can stay unevaluated. |

**Left to right**

- `dhyper(9, 42, 116+154, 20)`: "The hypergeometric probability of exactly (`dhyper`) 9 (`9`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`)."

**Right to left**, the order R runs it

- `dhyper(9, 42, 116+154, 20)`: "Add 116 and 154 (`116+154`), take 9, 42 and 20 (`9`, `42`, `20`), then compute P(X = 9) (`dhyper`)."
:::

:::warn Course counts trials, R counts failures
The course's geometric X counts *trials* up to and including the first success; R's geometric functions count *failures* before it. So the trial number x goes in as `x-1`, P(X ≤ k) is `pgeom(k-1, p)`, and a simulated trial count is `rgeom(reps, p) + 1`.
:::

```diagram
{ "type": "flow", "nodes": [ { "id": "t1", "label": "Fail", "sub": "trial 1 · failure 1" }, { "id": "t2", "label": "Fail", "sub": "trial 2 · failure 2" }, { "id": "t3", "label": "Fail", "sub": "trial 3 · failure 3" }, { "id": "t4", "label": "Success", "sub": "trial 4" } ], "edges": [ { "from": "t1", "to": "t2" }, { "from": "t2", "to": "t3" }, { "from": "t3", "to": "t4" } ], "hi": ["t4"], "caption": "Course X = 4 trials; R sees 3 failures, so P(X = 4) is dgeom(3, p)." }
```

The same chain on a new case, p = 0.25 and the first success on trial 6: the boxes, the product 0.75⁵ × 0.25 and the R line with the shift.

```widget
geometric-calc
{ "p": 0.25, "x": 6, "presets": false, "title": "First success on trial 6, p = 0.25: dgeom(6-1, 0.25)" }
```

### The model and its R call from four questions

Answer the four questions for a story and the widget names the distribution with its R call.

```widget
dist-picker
{ "scenarios": "practice" }
```

## Seven scrolls, taps to 14→15, twenty ladder picks: one call each

In MapleStory Classic an Intermediate scroll succeeds 60 % [Classic, Classic World Intermediate scroll, checked 2026-10-27] by meowdb's copy of the in-game item text. Star Force, the GMS enhancement that adds stars to gear, succeeds 30 % at 14→15 on the wiki's table [GMS, the wiki's Star Force table 14→15, checked 2026-10-27], without the Star Catch bonus that v.271 builds in. On the PoE1 Hardcore Allflame ladder 69 of the characters ranked 1–200 were dead [PoE1, 3.29 Hardcore Allflame ladder, checked 2026-10-27].

| Story | Numbers | Why this model | Model |
|---|---|---|---|
| 7 Intermediate scrolls on one item | n = 7, p = 0.6 | fixed n, the same p each use whatever the last one did | binomial |
| taps 14→15 | p = 0.30 | count taps to the first success; below 15 stars a failed tap keeps the star on a non-Superior item | geometric |
| 20 ladder picks | N = 200, K = 69 dead, n = 20 | a fixed list, nobody twice, and 20 is 10 % of 200 | hypergeometric |

```quiz
[
  { "q": "Seven Intermediate scrolls at p = 0.6, X = the number that succeed. P(at most 4 succeed).", "type": "fill", "code": "pbinom(___, 7, 0.6)", "answer": ["4"], "explain": "`p` includes its argument, so X ≤ 4 is `pbinom(4, 7, 0.6)` = 0.580096, which rounds to 0.5801. It is the complement of Unit 4's P(X ≥ 5) = 0.4199." },
  { "q": "Taps to the first 14→15 success, p = 0.30. P(the first success is on the 4th tap).", "type": "fill", "code": "dgeom(___, 0.30)", "answer": ["3", "4-1", "4 - 1"], "explain": "The course counts taps (trials); R counts failures before the success. Tap 4 is 3 failures, then the success: `dgeom(3, 0.30)` = 0.7³ × 0.3 = 0.343 × 0.3 = 0.1029." },
  { "q": "Same taps. P(the first success comes within the first 5 taps) = P(X ≤ 5)? (4 decimals)", "type": "numeric", "answer": 0.8319, "tolerance": 0.0001, "explain": "Within 5 taps is the complement of 5 failures in a row: 1 − q⁵ = 1 − 0.7⁵ = 1 − 0.16807 = 0.83193, so 0.8319. In R, `pgeom(5-1, 0.30)` = `pgeom(4, 0.30)`: R counts failures, so 5 taps is at most 4 failures." },
  { "q": "Twenty of the Hardcore Allflame top 200 (69 dead), nobody picked twice, X = the number dead. P(at most 5 dead).", "type": "fill", "code": "phyper(5, 69, ___, 20)", "answer": ["131", "200-69", "200 - 69"], "explain": "Slots: x = 5, successes in the population 69 dead, failures in the population 200 − 69 = 131 alive, sample size 20. `phyper(5, 69, 131, 20)` = 0.2477983, so 0.2478." },
  { "q": "Simulate 1000 values of X = taps to the first 14→15 success, in the course's trial count. Write the full command on paper, then type the name of the function you used.", "type": "text", "answer": ["rgeom"], "explain": "`rgeom(1000, 0.30) + 1`: reps = 1000 draws, p = 0.30. `rgeom` returns failures before the first success, so the `+ 1` turns each into a tap count starting at 1. Their mean settles near 1/p = 3.33 taps." }
]
```

```r
pbinom(4, 7, 0.6)          # at most 4 of 7 scrolls succeed
dgeom(4-1, 0.30)           # first 14->15 success on tap 4
pgeom(5-1, 0.30)           # first success within 5 taps
phyper(5, 69, 131, 20)     # at most 5 dead in 20 picks
```
```text
[1] 0.580096
[1] 0.1029
[1] 0.83193
[1] 0.2477983
```

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(4, 7, 0.6)` | q = 4, size = 7, prob = 0.6. |
| `dgeom(4-1, 0.30)` | x = 4-1 = 3 failures, prob = 0.30. `-` subtracts before the call runs. |
| `pgeom(5-1, 0.30)` | q = 4 failures, prob = 0.30. |
| `phyper(5, 69, 131, 20)` | q = 5, m = 69 successes, n = 131 failures, k = 20 drawn. |
| `# …` | Comments, ignored by R. Each output line is the value of one call. |

**Left to right**

- `pbinom(4, 7, 0.6)`: "The binomial probability of at most (`pbinom`) 4 (`4`) in 7 trials (`7`) with probability 0.6 (`0.6`)."
- `dgeom(4-1, 0.30)`: "The geometric probability of exactly (`dgeom`) 4 minus 1 failures (`4-1`) with probability 0.30 (`0.30`)."
- `pgeom(5-1, 0.30)`: "The geometric probability of at most (`pgeom`) 5 minus 1 failures (`5-1`) with probability 0.30 (`0.30`)."
- `phyper(5, 69, 131, 20)`: "The hypergeometric probability of at most (`phyper`) 5 (`5`) with 69 successes (`69`), 131 failures (`131`) and 20 drawn (`20`)."

**Right to left**, the order R runs it

- `pbinom(4, 7, 0.6)`: "Take 4 (`4`), 7 trials (`7`) and 0.6 (`0.6`), then add up P(0) to P(4) (`pbinom`)."
- `dgeom(4-1, 0.30)`: "Subtract 1 from 4 (`4-1`), take 0.30 (`0.30`), then compute P(3 failures first) (`dgeom`)."
- `pgeom(5-1, 0.30)`: "Subtract 1 from 5 (`5-1`), take 0.30 (`0.30`), then compute P(at most 4 failures) (`pgeom`)."
- `phyper(5, 69, 131, 20)`: "Take 5 (`5`), 69 dead (`69`), 131 alive (`131`) and 20 picks (`20`), then add up P(0) to P(5) (`phyper`)."
:::

The course counts taps, R counts failures before the first success: tap 4 is `dgeom(4-1, 0.30)`, within 5 taps is `pgeom(5-1, 0.30)`, and `rgeom(1000, 0.30) + 1` simulates 1000 tap counts.

:::info R syntax
| Code | What it does |
|---|---|
| `rgeom(1000, 0.30)` | R's first argument, `n` = 1000 values to draw; prob = 0.30. Each value is a count of failures. |
| `+ 1` | Adds 1 to every one of the 1000 values at once. |

**Left to right**

- `rgeom(1000, 0.30) + 1`: "Draw at random (`rgeom`) 1000 failure counts (`1000`) with probability 0.30 (`0.30`), plus one (`+ 1`) each."

**Right to left**, the order R runs it

- `rgeom(1000, 0.30) + 1`: "Take 1000 draws and 0.30 (`1000`, `0.30`), simulate the failure counts (`rgeom`), then add one to each (`+ 1`)."
:::

### Seven Intermediate scrolls: the bars pbinom adds

The shaded bars are $P(0)$ to $P(4)$; their sum is the `pbinom(4, 7, 0.6)` line above.

```widget
binomial-calc
{ "n": 7, "p": 0.6, "x": 4, "op": "le", "title": "7 Intermediate scrolls at p = 0.6: P(X ≤ 4) = pbinom(4, 7, 0.6) = 0.5801" }
```

## An inequality becomes a p-function

```quiz
[
  { "q": "Lab 6 T3: chip coatings, n = 100, p = 0.20. P(X < 25) is `pbinom(k, 100, 0.20)` with which k?", "type": "fill", "code": "pbinom(___, 100, 0.20)", "answer": ["24"], "explain": "`p` includes its argument, and X < 25 stops at 24: `pbinom(24, 100, 0.20)` = 0.8686." }
]
```

`p(k)` always includes k, so every event is rewritten as "at most something". The grid marks the integers each event keeps, around k = 25:

```diagram
{"type": "grid", "title": "Which integers each event includes", "nodes": [{"id": "h0", "label": "Event", "row": 0, "col": 0}, {"id": "h1", "label": "23", "row": 0, "col": 1}, {"id": "h2", "label": "24", "row": 0, "col": 2}, {"id": "h3", "label": "25", "row": 0, "col": 3}, {"id": "h4", "label": "26", "row": 0, "col": 4}, {"id": "h5", "label": "27", "row": 0, "col": 5}, {"id": "h6", "label": "R call", "row": 0, "col": 6}, {"id": "r1", "label": "X < 25", "row": 1, "col": 0}, {"id": "c11", "label": "■", "row": 1, "col": 1}, {"id": "c12", "label": "■", "row": 1, "col": 2}, {"id": "c13", "label": "", "row": 1, "col": 3}, {"id": "c14", "label": "", "row": 1, "col": 4}, {"id": "c15", "label": "", "row": 1, "col": 5}, {"id": "r1c", "label": "pbinom(24,…)", "row": 1, "col": 6}, {"id": "r2", "label": "X ≤ 25", "row": 2, "col": 0}, {"id": "c21", "label": "■", "row": 2, "col": 1}, {"id": "c22", "label": "■", "row": 2, "col": 2}, {"id": "c23", "label": "■", "row": 2, "col": 3}, {"id": "c24", "label": "", "row": 2, "col": 4}, {"id": "c25", "label": "", "row": 2, "col": 5}, {"id": "r2c", "label": "pbinom(25,…)", "row": 2, "col": 6}, {"id": "r3", "label": "X ≥ 25", "row": 3, "col": 0}, {"id": "c31", "label": "", "row": 3, "col": 1}, {"id": "c32", "label": "", "row": 3, "col": 2}, {"id": "c33", "label": "■", "row": 3, "col": 3}, {"id": "c34", "label": "■", "row": 3, "col": 4}, {"id": "c35", "label": "■", "row": 3, "col": 5}, {"id": "r3c", "label": "1 - pbinom(24,…)", "row": 3, "col": 6}, {"id": "r4", "label": "X > 25", "row": 4, "col": 0}, {"id": "c41", "label": "", "row": 4, "col": 1}, {"id": "c42", "label": "", "row": 4, "col": 2}, {"id": "c43", "label": "", "row": 4, "col": 3}, {"id": "c44", "label": "■", "row": 4, "col": 4}, {"id": "c45", "label": "■", "row": 4, "col": 5}, {"id": "r4c", "label": "1 - pbinom(25,…)", "row": 4, "col": 6}], "hi": ["c11", "c12", "c21", "c22", "c23", "c33", "c34", "c35", "c44", "c45"], "caption": "A p-call counts from the left up to and including its argument; an upper tail is 1 minus the part left of it."}
```

The examples in the table are the labs' own commands and outputs.

| Event | Rewrite | Lab 6 T3: n = 100, p = 0.2 | Lab 7 T10: λ = 34 |
|---|---|---|---|
| exactly k | `d(k)` | X = 25: `dbinom(25,n,p)` = 0.04388 | X = 34: `dpois(34,lambda)` = 0.06825 |
| at most k | `p(k)` | X ≤ 25: `pbinom(25,n,p)` = 0.9125 | X ≤ 30: `ppois(30,lambda)` = 0.2804 |
| fewer than k | `p(k-1)` | X < 25: `pbinom(24,n,p)` = 0.8686 | X < 30: `ppois(30-1,lambda)` = 0.2235 |
| at least k | `1 - p(k-1)` | X ≥ 25: `1-pbinom(24,n,p)` = 0.1314 | X ≥ 38: `1-ppois(37,lambda)` = 0.2681 |
| more than k | `1 - p(k)` | X > 25: `1-pbinom(25,n,p)` = 0.0875 | X > 38: `1-ppois(38,lambda)` = 0.2166 |
| a to b inclusive | `p(b) - p(a-1)` | 20 to 30: `pbinom(30,n,p)-pbinom(19,n,p)` = 0.5338 | 30 to 40: `ppois(40,lambda)-ppois(29,lambda)` = 0.6429 |

:::info R syntax
| Code | What it does |
|---|---|
| `n`, `p`, `lambda` | Names that must hold numbers first, for example `n <- 100`, `p <- 0.2`, `lambda <- 34`. |
| `dbinom(25,n,p)`, `dpois(34,lambda)` | x = 25, size = n, prob = p; x = 34, lambda. Each returns P(X = x). |
| `pbinom(25,n,p)`, `ppois(30,lambda)` | q = 25 or 30. Each returns P(X ≤ q). |
| `pbinom(24,n,p)`, `ppois(30-1,lambda)` | q = 24, or q = 30-1 = 29, which R works out before the call. |
| `1-pbinom(24,n,p)`, `1-ppois(37,lambda)`, `1-pbinom(25,n,p)`, `1-ppois(38,lambda)` | `1-` subtracts the cumulative probability from one: the upper tail. |
| `pbinom(30,n,p)-pbinom(19,n,p)`, `ppois(40,lambda)-ppois(29,lambda)` | Two cumulative calls; `-` subtracts the smaller from the larger. |

**Left to right**

- `dbinom(25,n,p)`: "The binomial probability of exactly (`dbinom`) 25 (`25`) in n trials (`n`) with probability p (`p`)."
- `dpois(34,lambda)`: "The Poisson probability of exactly (`dpois`) 34 (`34`) with mean lambda (`lambda`)."
- `pbinom(25,n,p)`: "The binomial probability of at most (`pbinom`) 25 (`25`) in n trials (`n`) with probability p (`p`)."
- `ppois(30,lambda)`: "The Poisson probability of at most (`ppois`) 30 (`30`) with mean lambda (`lambda`)."
- `pbinom(24,n,p)`: "The binomial probability of at most (`pbinom`) 24 (`24`) in n trials (`n`) with probability p (`p`)."
- `ppois(30-1,lambda)`: "The Poisson probability of at most (`ppois`) 30 minus 1 (`30-1`) with mean lambda (`lambda`)."
- `1-pbinom(24,n,p)`: "One (`1`) minus (`-`) the binomial probability of at most (`pbinom`) 24 (`24`), n trials (`n`), probability p (`p`)."
- `1-ppois(37,lambda)`: "One (`1`) minus (`-`) the Poisson probability of at most (`ppois`) 37 (`37`) with mean lambda (`lambda`)."
- `1-pbinom(25,n,p)`: "One (`1`) minus (`-`) the binomial probability of at most (`pbinom`) 25 (`25`), n trials (`n`), probability p (`p`)."
- `1-ppois(38,lambda)`: "One (`1`) minus (`-`) the Poisson probability of at most (`ppois`) 38 (`38`) with mean lambda (`lambda`)."
- `pbinom(30,n,p)-pbinom(19,n,p)`: "The binomial probability of at most (`pbinom`) 30 (`30`), minus (`-`) that of at most (`pbinom`) 19 (`19`), both with n and p (`n`, `p`)."
- `ppois(40,lambda)-ppois(29,lambda)`: "The Poisson probability of at most (`ppois`) 40 (`40`), minus (`-`) that of at most (`ppois`) 29 (`29`), both with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- `dbinom(25,n,p)`: "Look up n and p (`n`, `p`), take 25 (`25`), then compute P(X = 25) (`dbinom`)."
- `dpois(34,lambda)`: "Look up lambda (`lambda`), take 34 (`34`), then compute P(X = 34) (`dpois`)."
- `pbinom(25,n,p)`: "Look up n and p, take 25, then add up P(0) to P(25) (`pbinom`)."
- `ppois(30,lambda)`: "Look up lambda, take 30, then add up P(0) to P(30) (`ppois`)."
- `pbinom(24,n,p)`: "Look up n and p, take 24, then add up P(0) to P(24) (`pbinom`)."
- `ppois(30-1,lambda)`: "Subtract 1 from 30 (`30-1`), look up lambda, then add up P(0) to P(29) (`ppois`)."
- `1-pbinom(24,n,p)`: "Add up P(0) to P(24) (`pbinom`), then subtract from one (`1-`)."
- `1-ppois(37,lambda)`: "Add up P(0) to P(37) (`ppois`), then subtract from one (`1-`)."
- `1-pbinom(25,n,p)`: "Add up P(0) to P(25) (`pbinom`), then subtract from one (`1-`)."
- `1-ppois(38,lambda)`: "Add up P(0) to P(38) (`ppois`), then subtract from one (`1-`)."
- `pbinom(30,n,p)-pbinom(19,n,p)`: "Compute P(X ≤ 30) and P(X ≤ 19) (`pbinom`, `pbinom`), then subtract the second from the first (`-`)."
- `ppois(40,lambda)-ppois(29,lambda)`: "Compute P(X ≤ 40) and P(X ≤ 29) (`ppois`, `ppois`), then subtract the second from the first (`-`)."
:::

`lower.tail = FALSE` turns `p` into the upper tail, $P(X > k)$, so `1 - phyper(11, 42, 116+154, 20)` and `phyper(11, 42, 116+154, 20, lower.tail = FALSE)` are the same answer. The upper tail starts *above* k in both forms.

:::info R syntax
| Code | What it does |
|---|---|
| `1 - phyper(11, 42, 116+154, 20)` | q = 11, m = 42, n = 116+154, k = 20 gives P(X ≤ 11); `1 -` takes it from one. |
| `lower.tail = FALSE` | A named argument. The default, TRUE, gives P(X ≤ q); FALSE gives P(X > q) directly. |

**Left to right**

- `1 - phyper(11, 42, 116+154, 20)`: "One (`1`) minus (`-`) the hypergeometric probability of at most (`phyper`) 11 (`11`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`)."
- `phyper(11, 42, 116+154, 20, lower.tail = FALSE)`: "The hypergeometric cumulative probability (`phyper`) at 11 (`11`) with 42 successes (`42`), 116 plus 154 failures (`116+154`) and 20 drawn (`20`), from the upper tail (`lower.tail = FALSE`)."

**Right to left**, the order R runs it

- `1 - phyper(11, 42, 116+154, 20)`: "Add 116 and 154 (`116+154`), add up P(0) to P(11) (`phyper`), then subtract from one (`1 -`)."
- `phyper(11, 42, 116+154, 20, lower.tail = FALSE)`: "Add 116 and 154 (`116+154`), switch to the upper tail (`lower.tail = FALSE`), then compute P(X > 11) (`phyper`)."
:::

## Two separate years against one doubled interval

```quiz
[
  { "q": "Lab 7 T10: transformers fail at λ = 34 per year. `ppois(34, 34)^2` (at most 34 in each of two years) and `ppois(68, 68)` (at most 68 over the two years) give the same probability.", "type": "tf", "answer": false, "explain": "They are different events. Squaring needs both years at or below 34; the doubled interval only caps the total, so 20 then 48 counts. The outputs are 0.2975 and 0.5322." }
]
```

```r
ppois(34, 34)^2      # at most 34 in each of two independent years
ppois(68, 2*34)      # at most 68 in the two years together
```
```text
[1] 0.2975
[1] 0.5322
```

:::info R syntax
| Code | What it does |
|---|---|
| `ppois(34, 34)` | q = 34, lambda = 34. Returns P(X ≤ 34) for one year. |
| `^2` | Squares the result: the same probability multiplied by itself. |
| `ppois(68, 2*34)` | q = 68, lambda = 2*34; `*` multiplies, computed before the call. |

**Left to right**

- `ppois(34, 34)^2`: "The Poisson probability of at most (`ppois`) 34 (`34`) with mean 34 (`34`), squared (`^2`)."
- `ppois(68, 2*34)`: "The Poisson probability of at most (`ppois`) 68 (`68`) with mean 2 times 34 (`2*34`)."

**Right to left**, the order R runs it

- `ppois(34, 34)^2`: "Take 34 and the mean 34 (`34`, `34`), compute P(X ≤ 34) (`ppois`), then square it (`^2`)."
- `ppois(68, 2*34)`: "Multiply 2 by 34 (`2*34`) for the mean, take 68 (`68`), then compute P(X ≤ 68) (`ppois`)."
:::

Year 1 = 20 failures, year 2 = 48: the total 68 passes `ppois(68, 68)`, but year 2 breaks "at most 34 in each year". So the doubled-interval event contains the each-year event and is more likely (0.5322 against 0.2975). Independent periods multiply; a question about the total over a longer interval rescales λ instead.

## The formula typed into R, without the sheet

```r
choose(n, x)*p^x*(1-p)^(n-x)          # binomial, = dbinom(x, n, p)
lambda^x/factorial(x)*exp(-lambda)    # Poisson, = dpois(x, lambda)
q^(x-1)*p                             # geometric in trials, = dgeom(x-1, p)
```

:::info R syntax
| Code | What it does |
|---|---|
| `choose(n, x)*p^x*(1-p)^(n-x)` | `choose(n, x)` is nCx; `^` is a power, `*` multiplies. `n`, `x` and `p` must already hold numbers. |
| `lambda^x/factorial(x)*exp(-lambda)` | `factorial(x)` is x!, `exp(-lambda)` is e to the power −λ, `/` divides. |
| `q^(x-1)*p` | `q` and `p` are variables you set first. The brackets make the power x − 1, not just x. |
| `# …` | Comments naming the built-in call each line equals. |

**Left to right**

- `choose(n, x)*p^x*(1-p)^(n-x)`: "The ways to choose (`choose`) x of n (`n, x`), times (`*`) p (`p`) to the power (`^`) x, times (`*`) one minus p (`1-p`) to the power (`^`) n minus x (`n-x`)."
- `lambda^x/factorial(x)*exp(-lambda)`: "Lambda (`lambda`) to the power (`^`) x, divided by (`/`) x factorial (`factorial(x)`), times (`*`) e to the minus lambda (`exp(-lambda)`)."
- `q^(x-1)*p`: "q (`q`) to the power (`^`) x minus 1 (`x-1`), times (`*`) p (`p`)."

**Right to left**, the order R runs it

- `choose(n, x)*p^x*(1-p)^(n-x)`: "Work out 1 minus p (`1-p`) and n minus x (`n-x`), raise p and 1 minus p to their powers (`^`), count the ways (`choose`), then multiply the three (`*`)."
- `lambda^x/factorial(x)*exp(-lambda)`: "Raise lambda to x (`lambda^x`), divide by x factorial (`/`, `factorial`), then multiply by e to the minus lambda (`*`, `exp`)."
- `q^(x-1)*p`: "Subtract 1 from x (`x-1`), raise q to that power (`q^`), then multiply by p (`*p`)."
:::

## A simulation function draws, then returns

Q9's rule is that the function "should simulate this random process, not simply compute the average outcome". The draw comes from an `r` function or from `sample()`:

```r
name <- function(n) {
  X <- rbinom(1, n, p)                 # one draw: successes in n trials
  return(X/n)
}
# or
name <- function(n) {
  X <- sample(0:1, n, replace = TRUE, prob = c(1-p, p))
  return(sum(X)/n)
}
sim <- replicate(10000, name(50))      # repeat the experiment
prop.table(table(sim))                 # relative frequency of each value
mean(sim)                              # settles near the expected value
```

:::info R syntax
| Code | What it does |
|---|---|
| `name <- function(n) { … }` | `function(n)` makes a function with input `n`; `<-` stores it under `name`. The body sits in braces. |
| `X <- rbinom(1, n, p)` | `1` fills R's first slot (R calls it `n`: how many counts to draw). The function's input `n` fills the second slot, `size`. Same letter, two jobs: only the position tells them apart. prob = `p`, which must be set outside. Stores the count in `X`. |
| `return(X/n)` | Hands back the proportion. |
| `# or` | A comment: the second definition replaces the first if both are run. |
| `sample(0:1, n, replace = TRUE, prob = c(1-p, p))` | x = `0:1` (`:` makes 0, 1), size = `n`, draws with replacement, `c()` gives one probability per value. |
| `return(sum(X)/n)` | `sum()` counts the ones; divided by `n`. |
| `replicate(10000, name(50))` | Runs `name(50)` 10000 times and collects the results: n = 10000 repeats, expr = the call to repeat. |
| `prop.table(table(sim))` | `table()` counts each distinct value; `prop.table()` turns those counts into proportions. |
| `mean(sim)` | The average of the 10000 results. |

**Left to right**

- `name <- function(n) { X <- rbinom(1, n, p); return(X/n) }`: "Store under name (`name <-`) a function (`function`) of n (`(n)`) that stores in X (`X <-`) one (`1`) random binomial count (`rbinom`) from n trials (`n`) with probability p (`p`), and hands back (`return`) X divided by n (`X/n`)."
- `name <- function(n) { X <- sample(…); return(sum(X)/n) }`: "Store under name (`name <-`) a function (`function`) of n (`(n)`) that stores in X (`X <-`) a sample (`sample`) of n (`n`) values from 0 to 1 (`0:1`) with replacement (`replace = TRUE`) and probabilities (`prob =`) 1 minus p and p (`c(1-p, p)`), and hands back (`return`) their total (`sum`) divided by n (`/n`)."
- `sim <- replicate(10000, name(50))`: "Store under sim (`sim <-`) the results of repeating (`replicate`) 10000 times (`10000`) the call name with n = 50 (`name(50)`)."
- `prop.table(table(sim))`: "The proportions (`prop.table`) of the tally of each value (`table`) in sim (`sim`)."
- `mean(sim)`: "The average (`mean`) of sim (`sim`)."

**Right to left**, the order R runs it

- `name <- function(n) { X <- rbinom(1, n, p); return(X/n) }`: "Build a function (`function`) of n (`(n)`) whose body draws one count (`rbinom(1, n, p)`), stores it in X (`X <-`), divides by n (`X/n`) and hands it back (`return`), then store the function as name (`name <-`)."
- `name <- function(n) { X <- sample(…); return(sum(X)/n) }`: "Build a function (`function`) of n (`(n)`) whose body makes the probabilities (`c(1-p, p)`), draws n zeros and ones (`sample`, `0:1`, `replace = TRUE`), stores them in X (`X <-`), adds them (`sum`), divides by n (`/n`) and hands it back (`return`); store it as name (`name <-`)."
- `sim <- replicate(10000, name(50))`: "Run name with n = 50 (`name(50)`), repeat that 10000 times (`10000`, `replicate`), and store the results as sim (`sim <-`)."
- `prop.table(table(sim))`: "Take sim (`sim`), count each value (`table`), then turn the counts into proportions (`prop.table`)."
- `mean(sim)`: "Take sim (`sim`) and average it (`mean`)."
:::

The labs wrote theirs in the same shape:

```r
Left.Prop <- function(n, p) { X <- rbinom(1, n, p); X/n }       # Lab 6 T7

Draw.Cards <- function(m, n) {                                   # Lab 7 T2: aces in n cards
  X <- numeric(m)
  for (i in 1:m) X[i] <- sum(sample(1:52, n, replace = FALSE) <= 4)
  return(X)
}

Park.Until.Ticket <- function(p) {                               # Lab 7 T6a: trials to a ticket
  x <- 1
  while (sample(c("Ticket", "None"), 1, prob = c(p, 1-p)) == "None") x <- x + 1
  return(x)
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `Left.Prop <- function(n, p) { X <- rbinom(1, n, p); X/n }` | A function with two inputs, stored as `Left.Prop`. `;` separates two statements on one line. `rbinom` is as above. With no `return()`, the last value, `X/n`, is returned. |
| `Draw.Cards <- function(m, n) {`, `Park.Until.Ticket <- function(p) {` | Two more functions stored by name, with inputs `m` and `n`, and `p`. The dots are just part of the names. |
| `# Lab 6 T7` | Comments naming the lab task, ignored by R. |
| `X <- numeric(m)` | A vector of `m` zeros, one slot per repetition. |
| `for (i in 1:m) …` | Runs the rest of the line once for each `i` = 1 to `m`. |
| `X[i] <-` | `[ ]` picks slot `i` (R counts from 1) and stores the result there. |
| `sample(1:52, n, replace = FALSE)` | x = the cards 1 to 52, size = `n` cards, no card twice. |
| `<= 4` | Compares every card to 4, giving TRUE for cards 1 to 4, the aces. |
| `sum(…)` | Adds the TRUEs (each counts as 1): the number of aces. |
| `x <- 1` | Starts the trial count at 1. |
| `while (…) x <- x + 1` | Repeats `x <- x + 1` as long as the condition stays TRUE. |
| `sample(c("Ticket", "None"), 1, prob = c(p, 1-p))` | x = the two strings, size = 1 draw, "Ticket" with probability `p`. |
| `== "None"` | `==` tests equality: TRUE when the draw is "None", so the loop goes on. |
| `return(x)` | Hands back the trial count. |

**Left to right**

- `Left.Prop <- function(n, p) { … }`: "Store under Left.Prop (`Left.Prop <-`) a function (`function`) of n and p (`(n, p)`) that stores in X (`X <-`) one (`1`) binomial count (`rbinom`) from n trials (`n`) with probability p (`p`), then (`;`) gives X divided by n (`X/n`)."
- `Draw.Cards <- function(m, n) { … }`: "Store under Draw.Cards (`Draw.Cards <-`) a function (`function`) of m and n (`(m, n)`) whose body runs the seven steps listed under Draw.Cards step by step below."
- `Park.Until.Ticket <- function(p) { … }`: "Store under Park.Until.Ticket (`Park.Until.Ticket <-`) a function (`function`) of p (`(p)`) that starts x at 1 (`x <- 1`), and while (`while`) one draw (`sample`, `1`) from Ticket and None (`c("Ticket", "None")`) with probabilities p and 1 minus p (`prob = c(p, 1-p)`) equals (`==`) None, adds 1 to x (`x <- x + 1`), then hands back x (`return(x)`)."

**Right to left**, the order R runs it

- `Left.Prop <- function(n, p) { … }`: "Build a function (`function`) of n and p (`(n, p)`) whose body draws one count (`rbinom(1, n, p)`), stores it in X (`X <-`), and ends with X divided by n (`X/n`); store it as Left.Prop (`Left.Prop <-`)."
- `Draw.Cards <- function(m, n) { … }`: "Build a function (`function`) of m and n whose body makes m zeros (`numeric(m)`, `X <-`); each time round (`for (i in 1:m)`) it deals n of the cards 1 to 52 (`sample(1:52, n, replace = FALSE)`), marks the aces (`<= 4`), counts them (`sum`) and fills slot i (`X[i] <-`); it hands back X (`return(X)`). Store it as Draw.Cards (`Draw.Cards <-`)."
- `Park.Until.Ticket <- function(p) { … }`: "Build a function (`function`) of p whose body sets x to 1 (`x <- 1`); each time round it makes the probabilities (`c(p, 1-p)`), draws one outcome (`sample`), tests it against None (`==`), and if equal adds 1 (`x <- x + 1`); it hands back x (`return(x)`). Store it as Park.Until.Ticket (`Park.Until.Ticket <-`)."

**Draw.Cards step by step** (the lab names reps `m`)

1. `X <- numeric(m)`: make m empty slots.
2. `for (i in 1:m)`: repeat m times.
3. `sample(1:52, n, replace = FALSE)`: deal n cards.
4. `<= 4`: mark cards 1 to 4, the aces.
5. `sum(…)`: count the marks.
6. `X[i] <-`: store the count in slot i.
7. `return(X)`: hand back all m counts.
:::

`Park.Until.Ticket` counts trials directly, so it needs no `+ 1`; `rgeom(reps, p) + 1` is the one-line version.

:::info R syntax
| Code | What it does |
|---|---|
| `rgeom(reps, p)` | R's first argument, `n` = reps values to draw (here a name standing for a number); prob = p. Returns failure counts. |
| `+ 1` | Adds 1 to every value, turning failures before the success into trial numbers. |

**Left to right**

- `rgeom(reps, p) + 1`: "Draw at random (`rgeom`) reps failure counts (`reps`) with probability p (`p`), plus one (`+ 1`) each."

**Right to left**, the order R runs it

- `rgeom(reps, p) + 1`: "Take reps and p (`reps`, `p`), simulate the failure counts (`rgeom`), then add one to each (`+ 1`)."
:::

## Data-frame commands from Q7 and the labs

```r
quantile(df$col, 0.20)                        # 20th percentile of one column
library(dplyr)
small <- filter(df, col < 250)                # or subset(df, col < 250)
library(mosaic)
bwplot(y ~ g, data = df, main = "...", xlab = "...", ylab = "...")
boxplot(y ~ g, data = df)                     # base R, no library needed
favstats(y ~ g, data = df)                    # five-number summary, mean, sd, n per group
histogram(~ y, data = df)                     # mosaic; base R: hist(df$y)
table(df$a, df$b)                             # two-way counts
mean(y ~ g, data = df)                        # mean of y for each group
```

:::info R syntax
| Code | What it does |
|---|---|
| `quantile(df$col, 0.20)` | `$` picks the column `col` of data frame `df`, filling `x`; 0.20 fills `probs`. |
| `library(dplyr)`, `library(mosaic)` | Load a package so its functions (`filter`; `bwplot`, `favstats`, `histogram`) can be called. |
| `small <- filter(df, col < 250)` | Keeps the rows of `df` where `col < 250`; `<` is "less than". Stored in `small`. |
| `y ~ g` | `~` makes a formula: `y` on the left is summarised, grouped by `g` on the right. |
| `data = df` | The data frame the formula's names come from. |
| `main = "...", xlab = "...", ylab = "..."` | Title and axis labels, each a quoted string. |
| `boxplot(y ~ g, data = df)` | Base R side-by-side boxplots; the formula fills `formula`. |
| `favstats(y ~ g, data = df)` | One row of summary statistics per group. |
| `histogram(~ y, data = df)` | A formula with nothing left of `~`: one variable, no groups. |
| `table(df$a, df$b)` | Two columns give a two-way table of counts. |
| `mean(y ~ g, data = df)` | With mosaic loaded, `mean` accepts a formula and gives one mean per group. |
| `# …` | Comments, ignored by R. |

**Left to right**

- `quantile(df$col, 0.20)`: "The value with a given proportion below it (`quantile`) in column col (`col`) of df (`df$`), at 0.20 (`0.20`)."
- `library(dplyr)`: "Load the package (`library`) dplyr (`dplyr`)."
- `small <- filter(df, col < 250)`: "Store under small (`small <-`) the rows kept (`filter`) from df (`df`) where col (`col`) is less than (`<`) 250 (`250`)."
- `library(mosaic)`: "Load the package (`library`) mosaic (`mosaic`)."
- `bwplot(y ~ g, data = df, …)`: "Draw boxplots (`bwplot`) of y (`y`) by (`~`) g (`g`) from df (`data = df`), with a title (`main =`) and axis labels (`xlab =`, `ylab =`)."
- `boxplot(y ~ g, data = df)`: "Draw base R boxplots (`boxplot`) of y (`y`) by (`~`) g (`g`) from df (`data = df`)."
- `favstats(y ~ g, data = df)`: "Summary statistics (`favstats`) of y (`y`) by (`~`) g (`g`) from df (`data = df`)."
- `histogram(~ y, data = df)`: "Draw a histogram (`histogram`) of (`~`) y (`y`) from df (`data = df`)."
- `table(df$a, df$b)`: "Count each combination (`table`) of column a (`df$a`) and column b (`df$b`)."
- `mean(y ~ g, data = df)`: "The average (`mean`) of y (`y`) by (`~`) g (`g`) from df (`data = df`)."

**Right to left**, the order R runs it

- `quantile(df$col, 0.20)`: "Take df (`df`), pull out col (`$col`), and find the value with 20 % below it (`0.20`, `quantile`)."
- `library(dplyr)`: "Find dplyr (`dplyr`) and load it (`library`)."
- `small <- filter(df, col < 250)`: "Take df (`df`), test col less than 250 (`col < 250`) row by row, keep the passing rows (`filter`), store them as small (`small <-`)."
- `library(mosaic)`: "Find mosaic (`mosaic`) and load it (`library`)."
- `bwplot(y ~ g, data = df, …)`: "Build the formula y by g (`y ~ g`), look it up in df (`data = df`), take the title and labels (`main =`, `xlab =`, `ylab =`), then draw (`bwplot`)."
- `boxplot(y ~ g, data = df)`: "Build y by g (`y ~ g`), look it up in df (`data = df`), then draw (`boxplot`)."
- `favstats(y ~ g, data = df)`: "Build y by g (`y ~ g`), look it up in df (`data = df`), then summarise each group (`favstats`)."
- `histogram(~ y, data = df)`: "Build the one-sided formula (`~ y`), look y up in df (`data = df`), then draw (`histogram`)."
- `table(df$a, df$b)`: "Pull out columns a and b (`df$a`, `df$b`), then count each pair of values (`table`)."
- `mean(y ~ g, data = df)`: "Build y by g (`y ~ g`), look it up in df (`data = df`), then average each group (`mean`)."
:::

## Thirty rolls of a 12-sided die, X = the number of 8s

Lab 6's die again: n = 30, p = 1/12. Write each command on paper before filling the slot.

```quiz
[
  { "q": "P(exactly 4 eights).", "type": "fill", "code": "dbinom(___, 30, 1/12)", "answer": ["4"], "explain": "`d` is one bar: `dbinom(4, 30, 1/12)` = 0.1376." },
  { "q": "P(fewer than 4 eights).", "type": "fill", "code": "pbinom(___, 30, 1/12)", "answer": ["3"], "explain": "X < 4 is X ≤ 3: `pbinom(3, 30, 1/12)` = 0.7625." },
  { "q": "P(at least 4 eights).", "type": "fill", "code": "1 - pbinom(___, 30, 1/12)", "answer": ["3"], "explain": "X ≥ 4 is the complement of X ≤ 3: `1 - pbinom(3, 30, 1/12)` = 1 − 0.7625 = 0.2375." },
  { "q": "P(between 1 and 5 eights, inclusive).", "type": "fill", "code": "pbinom(5, 30, 1/12) - pbinom(___, 30, 1/12)", "answer": ["0"], "explain": "p(b) − p(a − 1) with a = 1, b = 5: `pbinom(5, 30, 1/12) - pbinom(0, 30, 1/12)` = 0.8916." },
  { "q": "P(more than 4 eights) without writing `1 -`.", "type": "fill", "code": "pbinom(4, 30, 1/12, lower.tail = ___)", "answer": ["FALSE", "F"], "explain": "`lower.tail = FALSE` gives P(X > 4), the same as `1 - pbinom(4, 30, 1/12)` = 0.0999." },
  { "q": "Simulate the 30-roll experiment 1000 times, giving the number of 8s in each. Write the full command on paper, then type the name of the function you used.", "type": "text", "answer": ["rbinom"], "explain": "`rbinom(1000, 30, 1/12)`: reps = 1000 draws, size n = 30, prob p = 1/12. Their mean settles near μ = np = 30/12 = 2.5." }
]
```

```quiz
[
  { "q": "Lab 6 T2d: `1 - pbinom(6, 30, 1/12)` returned 0.01023. What does `pbinom(6, 30, 1/12)` return? (4 decimals)", "type": "numeric", "answer": 0.9898, "tolerance": 0.0001, "explain": "`pbinom(6, …)` is P(X ≤ 6), the complement of P(X > 6): 1 − 0.01023 = 0.98977, which rounds to 0.9898 (the lab's output)." },
  { "q": "Lab 7 T4: N = 999 with K = 333 successes, a sample of n = 300. `phyper(109, 333, 666, 300)` returns 0.9175. What is P(X ≥ 110)? (4 decimals)", "type": "numeric", "answer": 0.0825, "tolerance": 0.0001, "explain": "X ≥ 110 is the complement of X ≤ 109: `1 - phyper(109, 333, 666, 300)` = 1 − 0.9175 = 0.0825 (the lab prints 0.08254)." },
  { "q": "A fair die is rolled until the first 6. P(the first 6 is on roll 4).", "type": "fill", "code": "dgeom(___, 1/6)", "answer": ["3", "4-1", "4 - 1"], "explain": "The course counts trials, R counts failures before the success: roll 4 is 3 failures, `dgeom(3, 1/6)` = (5/6)³(1/6) = 0.0965." },
  { "q": "Simulate 1000 values of X = the day of the first parking ticket, p = 0.1, in the course's trial count.", "type": "fill", "code": "rgeom(1000, 0.1) ___", "answer": ["+ 1", "+1"], "explain": "`rgeom` returns failures before the first success; adding 1 turns each into the trial number, so values start at 1." },
  { "q": "Transformers fail at 34 per year. P(at most 60 failures over the next two years).", "type": "fill", "code": "ppois(60, ___)", "answer": ["68", "2*34", "34*2", "2 * 34", "34 * 2"], "explain": "One count over a doubled interval rescales λ: 2 × 34 = 68, so `ppois(60, 68)` = 0.1824. Squaring a one-year probability would answer a different question." },
  { "q": "Ten cards are dealt from a 52-card deck. P(exactly 3 hearts).", "type": "fill", "code": "dhyper(3, 13, ___, 10)", "answer": ["39", "52-13", "52 - 13"], "explain": "Slots: x = 3, successes in the population 13, failures in the population 52 − 13 = 39, sample size 10. `dhyper(3, 13, 39, 10)` = 0.2781." },
  { "q": "Same deal: P(more than 4 hearts) with one `phyper` call and no `1 -`.", "type": "fill", "code": "phyper(4, 13, 39, 10, lower.tail = ___)", "answer": ["FALSE", "F"], "explain": "`lower.tail = FALSE` returns P(X > 4) = 0.0568, the same as `1 - phyper(4, 13, 39, 10)`." },
  { "q": "Write a function that takes n, the number of COMP 2121 quiz questions a student guesses on (4 choices each), and returns the simulated proportion guessed right. Write it on paper, then type the name of the function that does the random draw.", "type": "text", "answer": ["rbinom", "sample"], "explain": "`guess_prop <- function(n) { X <- rbinom(1, n, 0.25); return(X/n) }` or `guess_prop <- function(n) { X <- sample(0:1, n, replace = TRUE, prob = c(0.75, 0.25)); return(sum(X)/n) }`. Returning `n*0.25/n` computes the average instead of simulating and scores zero." },
  { "q": "The data frame `survey` has a column `Pulse`. Write the command for its 90th percentile on paper, then type the function name.", "type": "text", "answer": ["quantile"], "explain": "`quantile(survey$Pulse, 0.90)`. The `$` picks the column; 0.90 is the proportion for the 90th percentile. If the column has missing values, add `na.rm = TRUE`." },
  { "q": "`pgeom(9, 1/6)` is the probability that the first 6 comes within the first 10 rolls.", "type": "tf", "answer": true, "explain": "P(X ≤ 10) in trials is `pgeom(10-1, 1/6)` = 1 − (5/6)¹⁰ = 0.8385 (Lab 7 T7a)." }
]
```
