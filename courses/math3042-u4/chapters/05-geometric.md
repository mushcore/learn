---
title: Geometric: trials until the first success
minutes: 18
---

The binomial counts successes in a fixed number of trials. The geometric distribution turns the question around: keep running the same trials and count how many it takes to reach the first success.

## X = the number of trials it takes to obtain the first "success"

Slide wording: the Geometric Distribution is *based on the same assumptions as the binomial distribution: $n$ trials each with probability of success $p$*. What changes is the variable: $X$ = *the number of trials it takes to obtain the first "success"*. Its possible values are 1, 2, 3, … with no upper limit, because there is no fixed $n$: the trials stop when the first success arrives. A binomial $X$ runs from 0 to $n$; a geometric $X$ starts at 1 (the first trial can itself be the success) and is unbounded.

## The help line: P(3)

*Suppose a tech-support telephone help line is occupied 75% of the time. Find the probability that you will have to call 3 times to gain access.*

```quiz
[
  {
    "q": "The help line is occupied 75 % of the time. P(you first get through on the 3rd call) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.1406,
    "tolerance": 0.0002,
    "explain": "Fail, fail, succeed: 0.75 × 0.75 × 0.25 = 0.1406."
  }
]
```

If you first gain access on the 3rd call, then you had to have: *failure on the first call*, probability $q = 0.75$; *failure on the second call*, probability $q = 0.75$; *success on the third call*, probability $p = 0.25$. The calls are independent, so the three probabilities multiply:

$$P(3) = 0.75 \times 0.75 \times 0.25 = 0.5625 \times 0.25 = 0.1406$$

## The formula: x − 1 failures, then one success

Slide wording: *suppose every trial of a random experiment has probability $p$ of success and probability $q = 1 - p$ of failure, and all trials are independent. Let $X$ = the number of trials it takes to get the first success (possible values: 1, 2, 3, …).* Then

$$P(X = x) = q^{x-1} \cdot p, \qquad \mu = \frac{1}{p}, \qquad \sigma^2 = \frac{1 - p}{p^2}$$

$x$ is the trial number of the first success, so $x - 1$ failures come before it (one factor of $q$ each) and the single success supplies the one factor of $p$. The exponent is $x - 1$, never $x$: $P(3)$ has two 0.75s in it, not three.

The notes derive $\mu = 1/p$ from the definition $\mu = \sum x P(x)$ and say *you are not expected to be able to perform a derivation like the following*. The chain, for the curious: $\sum_{x \ge 1} x q^{x-1} p = p \cdot \frac{d}{dq}\left[\sum_{x \ge 1} q^x\right] = p \cdot \frac{d}{dq}\left[\frac{q}{1-q}\right] = p \cdot \frac{1}{(1-q)^2} = \frac{p}{p^2} = \frac{1}{p}$ (sum of a geometric series, quotient rule, then $1 - q = p$).

## Failure, failure, success, drawn as boxes

```widget
geometric-calc
{ "p": 0.25, "x": 3, "preset": "help line (p = 0.25)", "title": "The help line: q^(x-1) p with the chain of calls drawn, the bars for x = 1..15, and the R lines" }
```

Every added box is another $q$, so the bars fall by the factor $q = 0.75$ each step. At $p = 0.05$ the mean $1/p$ is 20 while the tallest bar stays at $x = 1$.

## E[X] and σ for the help line

*Let $X$ = the number of times you must call until you get access.*

$$E[X] = \frac{1}{p} = \frac{1}{0.25} = 4 \text{ calls}, \qquad \sigma_X = \sqrt{\frac{1 - p}{p^2}} = \sqrt{\frac{0.75}{0.0625}} = \sqrt{12} = 3.46$$

A 1-in-4 chance per call needs about 4 calls on average, which is what $1/p$ says. The standard deviation is almost as large as the mean: the distribution has a long right tail of unlucky callers.

```r
p <- 0.25
q <- 1 - p
mu <- 1/p
sig <- sqrt((1 - p)/p^2)
c(mu, sig)
```
```text
[1] 4.000000 3.464102
```

## P(X ≥ 4): the complement, or three failures in a row

"At least 4 calls" is everything except 1, 2 or 3 calls, where $P(1) = 0.25$, $P(2) = 0.75 \times 0.25 = 0.1875$ and $P(3) = 0.1406$:

$$P(X \ge 4) = 1 - P(1) - P(2) - P(3) = 1 - 0.25 - 0.1875 - 0.1406 = 0.4219$$

The shortcut gives the same number: needing at least 4 calls means the first three all failed, $q^3 = 0.75^3 = 0.421875$. In general $P(X \ge x) = q^{x-1}$ (the first $x - 1$ trials all fail) and $P(X \le x) = 1 - q^x$.

## R counts failures: dgeom(x − 1, p)

R's geometric variable is the number of **failures before** the first success, so the lecture's $X = x$ is R's $x - 1$. Every `dgeom` and `pgeom` call in this course carries that shift.

```r
q^2 * p                    # P(X = 3) by the formula
dgeom(2, p)                # the same: 2 failures, then the success
1 - p - q*p - q^2*p        # P(X >= 4) by the complement
1 - pgeom(2, p)            # pgeom(2, p) = P(at most 2 failures) = P(X <= 3)
```
```text
[1] 0.140625
[1] 0.140625
[1] 0.421875
[1] 0.421875
```

The probability histogram the notes ask for uses the formula directly on a vector of $x$ values:

```r
X.vals <- 1:10
p.vals <- q^(X.vals - 1)*p
round(p.vals, 4)
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="X", ylab="P(x)", main="Number of Calls to Get Access")
```
```text
 [1] 0.2500 0.1875 0.1406 0.1055 0.0791 0.0593 0.0445 0.0334 0.0250 0.0188
```

Each bar is 0.75 times the one before it, so the histogram is strictly decreasing: the **mode is 1** even though the mean is 4. The ten bars add to 0.9437; the missing 0.0563 is $q^{10}$, the tail beyond 10 calls.

## Practice Problem 23: the "success" can be a miss

An expert hits the target 95% of the time; what is the probability the first miss is on the 15th shot? The event we are waiting for is a miss, so success = miss with $p = 0.05$, $q = 0.95$ and $x = 15$:

$$P(X = 15) = 0.95^{14} \times 0.05 = 0.4877 \times 0.05 = 0.0244$$

```widget
geometric-calc
{ "p": 0.05, "x": 15, "preset": "expert shot misses (p = 0.05)", "title": "Practice Problem 23: fourteen hits, then the first miss" }
```

```quiz
[
  {
    "q": "A geometric X with p = 0.2. P(X = 4)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1024,
    "tolerance": 0.0003,
    "explain": "Three failures then the success: 0.8^3 × 0.2 = 0.512 × 0.2 = 0.1024. The exponent is x − 1 = 3."
  },
  {
    "q": "For the help line (X = number of calls until access, p = 0.25), which R call gives P(X = 3)?",
    "options": ["`dgeom(3, 0.25)`", "`dgeom(2, 0.25)`", "`pgeom(3, 0.25)`", "`dbinom(3, 3, 0.25)`"],
    "answer": 1,
    "explain": "R counts failures before the first success, so the lecture's X = 3 (two failures, then success) is dgeom(2, 0.25) = 0.140625."
  },
  {
    "q": "Which formula is P(X = 5) for a geometric variable?",
    "options": ["$q^4 p$", "$q^5 p$", "$q^4 p^5$", "$p^4 q$"],
    "answer": 0,
    "explain": "Four failures, each with probability q, then the one success with probability p: q^(x−1) p with x = 5."
  },
  {
    "q": "Write P(X = 3) for the help line (occupied 75 % of the time) as the geometric formula with the numbers substituted. Use ^ for powers, * between factors, no spaces.",
    "type": "text",
    "answer": ["0.75^2*0.25", "(0.75)^2*0.25", "(0.75)^2*(0.25)", "0.75^2*(0.25)", "0.25*0.75^2", "0.75*0.75*0.25", "(1-0.25)^2*0.25", "0.75^(3-1)*0.25"],
    "explain": "q^(x−1) · p with q = 0.75, p = 0.25, x = 3: 0.75² · 0.25 = 0.1406. Two failures, so the exponent is 2."
  },
  {
    "q": "You keep calling the help line until you get through, but each failed call makes the next one more likely to connect (callers ahead of you give up). Which geometric assumption fails?",
    "options": ["the same probability p of success on every trial", "each trial is a success or a failure", "X counts the trials up to and including the first success", "X can take the value 1"],
    "answer": 0,
    "explain": "The geometric keeps the binomial's assumptions: the same p on every trial and independent trials. A p that rises call by call breaks equal p; the other three still hold."
  },
  {
    "q": "A geometric X with p = 0.2. E[X]? ",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "explain": "μ = 1/p = 1/0.2 = 5 trials on average."
  },
  {
    "q": "A geometric X with p = 0.2. P(X ≥ 3)? (2 decimals)",
    "type": "numeric",
    "answer": 0.64,
    "tolerance": 0.002,
    "explain": "At least 3 trials means the first two both failed: q^2 = 0.8^2 = 0.64. The long way, 1 − 0.2 − 0.16 = 0.64, agrees."
  },
  {
    "q": "The possible values of a geometric random variable are...",
    "options": ["0, 1, 2, …, n", "0, 1, 2, …", "1, 2, 3, … with no upper limit", "1, 2, …, n"],
    "answer": 2,
    "explain": "The first success can come on trial 1 at the earliest, and there is no fixed n, so the values run 1, 2, 3, … forever. (R's version starts at 0 because it counts failures.)"
  },
  {
    "q": "For the help line, the most likely number of calls is 4, because E[X] = 4.",
    "type": "tf",
    "answer": false,
    "explain": "The histogram is strictly decreasing: P(1) = 0.25 is the tallest bar, so the mode is 1. The mean of 4 is pulled up by the long tail of unlucky callers."
  },
  {
    "q": "Roll a fair die until the first 6. P(the first 6 is on the 3rd roll)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1157,
    "tolerance": 0.0003,
    "explain": "p = 1/6, q = 5/6: (5/6)^2 × (1/6) = 25/216 = 0.1157."
  },
  {
    "q": "What does `1 - pgeom(2, 0.25)` compute for the lecture's X?",
    "options": ["P(X = 3)", "P(X ≤ 2)", "P(X ≥ 3)", "P(X ≥ 4)"],
    "answer": 3,
    "explain": "pgeom(2, p) is P(at most 2 failures) = P(X ≤ 3), so its complement is P(X ≥ 4) = 0.421875 = 0.75^3."
  },
  {
    "q": "A geometric X with p = 0.2. σ? (2 decimals)",
    "type": "numeric",
    "answer": 4.47,
    "tolerance": 0.02,
    "explain": "σ² = (1 − p)/p² = 0.8/0.04 = 20, so σ = √20 = 4.47. Take the square root of the variance, not of 1 − p alone."
  }
]
```
