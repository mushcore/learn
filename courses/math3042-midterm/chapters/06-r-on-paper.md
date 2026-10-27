---
title: "R on paper: the d, p, q, r families, inequalities, simulation functions"
minutes: 20
---

The R sheet names a few distribution functions but never their arguments, and the exam asks for runnable lines written by hand. This lesson fixes the signatures, the inequality-to-function table and the shape of a simulation function from Labs 6 and 7.

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

### Thirty rolls of a 12-sided die

The bars are $P(X = x)$ for n = 30, p = 1/12; change the operation to see which `dbinom` or `pbinom` line produces the shaded bars.

```widget
binomial-calc
{ "n": 30, "p": "1/12", "x": 2, "op": "le", "title": "Lab 6: X = number of 8s in 30 rolls of a 12-sided die" }
```

## Twelve signatures to know cold

```r
dbinom(x, n, p)        pbinom(k, n, p)        rbinom(m, n, p)
dhyper(x, K, N-K, n)   phyper(k, K, N-K, n)   rhyper(m, K, N-K, n)
dgeom(x-1, p)          pgeom(k-1, p)          rgeom(m, p) + 1
dpois(x, lambda)       ppois(k, lambda)       rpois(m, lambda)
```

In `r` functions the first argument m is how many values to draw. The hypergeometric slots are, in order: x, successes in the population, failures in the population, sample size. Leave the failures as an unevaluated sum, as the instructor does: `dhyper(9, 42, 116+154, 20)`.

The course counts geometric *trials* up to and including the first success; R's geometric functions count *failures* before it. So the trial number x goes in as `x-1`, P(X ≤ k) is `pgeom(k-1, p)`, and a simulated trial count is `rgeom(m, p) + 1`.

### The model and its R call from four questions

Answer the four questions for a story and the widget names the distribution with its R call.

```widget
dist-picker
{ "scenarios": "practice" }
```

## An inequality becomes a p-function

```quiz
[
  { "q": "Lab 6 T3: chip coatings, n = 100, p = 0.20. P(X < 25) is `pbinom(k, 100, 0.20)` with which k?", "type": "fill", "code": "pbinom(___, 100, 0.20)", "answer": ["24"], "explain": "`p` includes its argument, and X < 25 stops at 24: `pbinom(24, 100, 0.20)` = 0.8686." }
]
```

`p(k)` always includes k, so every event is rewritten as "at most something". The examples are the labs' own commands and outputs.

| Event | Rewrite | Lab 6 T3: n = 100, p = 0.2 | Lab 7 T10: λ = 34 |
|---|---|---|---|
| exactly k | `d(k)` | X = 25: `dbinom(25,n,p)` = 0.04388 | X = 34: `dpois(34,lambda)` = 0.06825 |
| at most k | `p(k)` | X ≤ 25: `pbinom(25,n,p)` = 0.9125 | X ≤ 30: `ppois(30,lambda)` = 0.2804 |
| fewer than k | `p(k-1)` | X < 25: `pbinom(24,n,p)` = 0.8686 | X < 30: `ppois(30-1,lambda)` = 0.2235 |
| at least k | `1 - p(k-1)` | X ≥ 25: `1-pbinom(24,n,p)` = 0.1314 | X ≥ 38: `1-ppois(37,lambda)` = 0.2681 |
| more than k | `1 - p(k)` | X > 25: `1-pbinom(25,n,p)` = 0.0875 | X > 38: `1-ppois(38,lambda)` = 0.2166 |
| a to b inclusive | `p(b) - p(a-1)` | 20 to 30: `pbinom(30,n,p)-pbinom(19,n,p)` = 0.5338 | 30 to 40: `ppois(40,lambda)-ppois(29,lambda)` = 0.6429 |

`lower.tail = FALSE` turns `p` into the upper tail, $P(X > k)$, so `1 - phyper(11, 42, 116+154, 20)` and `phyper(11, 42, 116+154, 20, lower.tail = FALSE)` are the same answer. The upper tail starts *above* k in both forms.

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

Independent periods multiply. A question about the total over a longer interval rescales λ instead. The second event contains the first, so its probability is larger.

## The formula typed into R, without the sheet

```r
choose(n, x)*p^x*(1-p)^(n-x)          # binomial, = dbinom(x, n, p)
lambda^x/factorial(x)*exp(-lambda)    # Poisson, = dpois(x, lambda)
q^(x-1)*p                             # geometric in trials, = dgeom(x-1, p)
```

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

`Park.Until.Ticket` counts trials directly, so it needs no `+ 1`; `rgeom(m, p) + 1` is the one-line version.

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

## Thirty rolls of a 12-sided die, X = the number of 8s

Lab 6's die again: n = 30, p = 1/12. Write each command on paper before filling the slot.

```quiz
[
  { "q": "P(exactly 4 eights).", "type": "fill", "code": "dbinom(___, 30, 1/12)", "answer": ["4"], "explain": "`d` is one bar: `dbinom(4, 30, 1/12)` = 0.1376." },
  { "q": "P(fewer than 4 eights).", "type": "fill", "code": "pbinom(___, 30, 1/12)", "answer": ["3"], "explain": "X < 4 is X ≤ 3: `pbinom(3, 30, 1/12)` = 0.7625." },
  { "q": "P(at least 4 eights).", "type": "fill", "code": "1 - pbinom(___, 30, 1/12)", "answer": ["3"], "explain": "X ≥ 4 is the complement of X ≤ 3: `1 - pbinom(3, 30, 1/12)` = 1 − 0.7625 = 0.2375." },
  { "q": "P(between 1 and 5 eights, inclusive).", "type": "fill", "code": "pbinom(5, 30, 1/12) - pbinom(___, 30, 1/12)", "answer": ["0"], "explain": "p(b) − p(a − 1) with a = 1, b = 5: `pbinom(5, 30, 1/12) - pbinom(0, 30, 1/12)` = 0.8916." },
  { "q": "P(more than 4 eights) without writing `1 -`.", "type": "fill", "code": "pbinom(4, 30, 1/12, lower.tail = ___)", "answer": ["FALSE", "F"], "explain": "`lower.tail = FALSE` gives P(X > 4), the same as `1 - pbinom(4, 30, 1/12)` = 0.0999." },
  { "q": "Simulate the 30-roll experiment 1000 times, giving the number of 8s in each. Write the full command on paper, then type the name of the function you used.", "type": "text", "answer": ["rbinom"], "explain": "`rbinom(1000, 30, 1/12)`: m = 1000 draws, size n = 30, prob p = 1/12. Their mean settles near μ = np = 30/12 = 2.5." }
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
