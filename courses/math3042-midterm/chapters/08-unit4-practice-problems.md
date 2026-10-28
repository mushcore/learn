---
title: The sixteen Unit 4 practice problems, worked
minutes: 20
---

The sixteen Unit 4 practice problems, grouped by distribution, each part asked before its working. Answers follow the cover rule (a probability to four decimals, anything else to three significant digits); where the answer sheet rounds differently or slips in the last digit, the item says so.

## A probability table and its mean: PP2, PP4, PP5

Taught in [Discrete distributions: tables, mean and SD](#/math3042-u4/discrete-distributions). For money, X is the net amount to one party: payout times the chance it is paid, minus the premium or price.

### PP2. Life insurance

The probability that a 30-year-old male survives the year is 0.9989; for a 50-year-old female it is 0.9971. (a) The male is charged a premium of $180 for a policy that pays $100,000 if he dies within the year. What is the expected cost of the policy to the insurance company? (b) What premium should the female be charged for a $75,000 policy so that the company's expected cost is the same?

```quiz
[
  {
    "q": "PP2a. Expected cost of the male's policy to the company, in dollars (a gain to the company is negative).",
    "type": "numeric",
    "answer": -70,
    "tolerance": 0.01,
    "unit": "dollars",
    "explain": "Let X = the company's net cost of the policy. The company pays 100,000 dollars with probability 1 − 0.9989 = 0.0011 and collects the 180-dollar premium either way. E(X) = 100,000(0.0011) − 180 = 110 − 180 = −70. The expected cost is −70 dollars: the company expects to gain 70 dollars per policy."
  },
  {
    "q": "PP2b. Premium for the female's 75,000-dollar policy that gives the same expected cost, in dollars.",
    "type": "numeric",
    "answer": 287.5,
    "tolerance": 0.01,
    "unit": "dollars",
    "explain": "Same expected cost means 75,000(1 − 0.9971) − P = −70. 75,000(0.0029) = 217.50, so 217.50 − P = −70 and P = 217.50 + 70 = 287.50 dollars. Check: 217.50 − 287.50 = −70."
  }
]
```

$$E(X) = 100\,000(1 - 0.9989) - 180 = 110 - 180 = -70$$

$$75\,000(0.0029) - P = -70 \;\Rightarrow\; P = 217.50 + 70 = 287.50$$

The expected cost is −70 dollars, an expected gain of $70 to the company per policy; the female's premium is $287.50. The money version of this pattern is in [Expected value in dollars](#/math3042-midterm/expected-dollars-shortcuts).

```r
100000*(1-0.9989) - 180
75000*(1-0.9971) + 70
```
```text
[1] -70
[1] 287.5
```

:::info R syntax
| Code | What it does |
|---|---|
| `100000*(1-0.9989) - 180` | `*` multiplies, `-` subtracts; the brackets are worked out first. R prints the result. |
| `75000*(1-0.9971) + 70` | `+` adds: the premium that gives the same expected cost. |
| `[1]` | In the output, the index of the first value on the printed line. Each line here holds one value. |

**Left to right**

- `100000*(1-0.9989) - 180`: "100000 (`100000`) times (`*`) one minus 0.9989 (`1-0.9989`), minus (`-`) 180 (`180`)."
- `75000*(1-0.9971) + 70`: "75000 (`75000`) times (`*`) one minus 0.9971 (`1-0.9971`), plus (`+`) 70 (`70`)."

**Right to left**, the order R runs it

- `100000*(1-0.9989) - 180`: "Work out the bracket (`1-0.9989`), multiply by 100000 (`*`), then subtract 180 (`- 180`)."
- `75000*(1-0.9971) + 70`: "Work out the bracket (`1-0.9971`), multiply by 75000 (`*`), then add 70 (`+ 70`)."
:::

### PP4. Overbooking

An airline overbooks a flight. X = the number of passengers who cannot board, with P(X = x) = 0.067, 0.141, 0.274, 0.331, 0.187 for x = 0, 1, 2, 3, 4. What is the expected number of passengers who cannot board?

```quiz
[
  {
    "q": "PP4. Expected number of passengers not boarded (3 significant digits).",
    "type": "numeric",
    "answer": 2.43,
    "tolerance": 0.05,
    "unit": "passengers",
    "explain": "First check it is a distribution: 0.067 + 0.141 + 0.274 + 0.331 + 0.187 = 1.000. μ = Σ x·P(x) = 0(0.067) + 1(0.141) + 2(0.274) + 3(0.331) + 4(0.187) = 0 + 0.141 + 0.548 + 0.993 + 0.748 = 2.43 passengers."
  }
]
```

$$\mu = \sum x\,P(x) = 0 + 0.141 + 0.548 + 0.993 + 0.748 = 2.43 \text{ passengers}$$

```r
x <- 0:4
p <- c(0.067, 0.141, 0.274, 0.331, 0.187)
sum(x*p)
```
```text
[1] 2.43
```

:::info R syntax
| Code | What it does |
|---|---|
| `x <- 0:4` | `<-` is assignment; `0:4` is the whole numbers 0 to 4, stored in `x`. |
| `p <- c(0.067, …)` | `c()` combines the five probabilities into one vector, stored in `p`. |
| `x*p` | `*` on two vectors multiplies them slot by slot: x·P(x) for each x. |
| `sum(…)` | Adds those five products. |

**Left to right**

- `x <- 0:4`: "Store under the name x (`x <-`) the whole numbers 0 to 4 (`0:4`)."
- `p <- c(0.067, 0.141, 0.274, 0.331, 0.187)`: "Store under the name p (`p <-`) the five probabilities combined into one vector (`c`)."
- `sum(x*p)`: "The total (`sum`) of x (`x`) times (`*`) p (`p`), slot by slot."

**Right to left**, the order R runs it

- `x <- 0:4`: "Make the numbers 0 to 4 (`0:4`), then store them as x (`x <-`)."
- `p <- c(0.067, 0.141, 0.274, 0.331, 0.187)`: "Combine the five probabilities (`c`), then store them as p (`p <-`)."
- `sum(x*p)`: "Multiply x by p slot by slot (`x*p`), then add the products (`sum`)."
:::

### PP5. Two 12-sided dice

Two fair 12-sided dice are rolled. (a) X = the sum of the two dice: find μ and σ. (b) X = the minimum of the two dice: find μ and σ (the sheet calls this one "challenging to do by hand").

```quiz
[
  {
    "q": "PP5a. Mean of the sum of two 12-sided dice.",
    "type": "numeric",
    "answer": 13,
    "tolerance": 0.05,
    "explain": "One die has mean (1 + 12)/2 = 6.5; the sum's mean is 6.5 + 6.5 = 13. Equivalently, the 144 outcomes are symmetric about 13."
  },
  {
    "q": "PP5a. Standard deviation of the sum (3 significant digits).",
    "type": "numeric",
    "answer": 4.88194,
    "tolerance": 0.05,
    "explain": "One die: σ² = (12² − 1)/12 = 143/12 = 11.9167. The two dice are independent, so variances add: σ² = 143/6 = 23.8333 and σ = √23.8333 = 4.88. Adding the standard deviations instead (2 × 3.45 = 6.90) is wrong. The sheet prints 4.9."
  },
  {
    "q": "PP5b. Mean of the minimum of two 12-sided dice (3 significant digits).",
    "type": "numeric",
    "answer": 4.51389,
    "tolerance": 0.05,
    "explain": "P(X = k) = (2(12 − k) + 1)/144: 23, 21, 19, …, 3, 1 out of 144 for k = 1 … 12. μ = Σ k·P(k) = (1·23 + 2·21 + … + 12·1)/144 = 650/144 = 4.51."
  },
  {
    "q": "PP5b. Standard deviation of the minimum (3 significant digits).",
    "type": "numeric",
    "answer": 2.82348,
    "tolerance": 0.05,
    "explain": "Σ k²·P(k) = 4082/144 = 28.3472. Shortcut: σ² = 28.3472 − 4.51389² = 28.3472 − 20.3752 = 7.9720, σ = √7.9720 = 2.82. Carry μ unrounded; the long form Σ (k − μ)²P(k) gives the same 7.9720."
  }
]
```

**(a)** μ = 6.5 + 6.5 = 13; σ² = 143/12 + 143/12 = 143/6 = 23.8333, σ = 4.88 (the sheet rounds to 4.9).

**(b)** In the 12 × 12 grid of outcomes, the minimum is k when one die shows k and the other shows k or more: 12 − k cells with the first die at k, 12 − k with the second at k, and the single cell (k, k). So P(X = k) = (2(12 − k) + 1)/144.

| k | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| count / 144 | 23 | 21 | 19 | 17 | 15 | 13 | 11 | 9 | 7 | 5 | 3 | 1 |
| P(X = k) | 0.1597 | 0.1458 | 0.1319 | 0.1181 | 0.1042 | 0.0903 | 0.0764 | 0.0625 | 0.0486 | 0.0347 | 0.0208 | 0.0069 |
| k·count | 23 | 42 | 57 | 68 | 75 | 78 | 77 | 72 | 63 | 50 | 33 | 12 |
| k²·count | 23 | 84 | 171 | 272 | 375 | 468 | 539 | 576 | 567 | 500 | 363 | 144 |

$$\mu = \frac{650}{144} = 4.51 \qquad \sigma^2 = \frac{4082}{144} - 4.51389^2 = 7.9720 \qquad \sigma = 2.82$$

```r
X.vals <- 2:24                          # sum of two dice
p.vals <- (12 - abs(X.vals - 13))/144
mu <- sum(X.vals*p.vals); mu
sqrt(sum((X.vals-mu)^2*p.vals))
X.vals <- 1:12                          # minimum of two dice
p.vals <- (2*(12 - X.vals) + 1)/144
mu <- sum(X.vals*p.vals); mu
sqrt(sum((X.vals-mu)^2*p.vals))
```
```text
[1] 13
[1] 4.88194
[1] 4.513889
[1] 2.823478
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- 2:24` | The possible sums 2 to 24. The dot is just part of the name. |
| `# sum of two dice` | `#` starts a comment: R ignores the rest of the line. |
| `(12 - abs(X.vals - 13))/144` | Works on every value at once; `abs()` is absolute value, `/` divides. Gives P(x) for each sum. |
| `mu <- sum(X.vals*p.vals); mu` | `;` separates two statements. The first stores the mean in `mu`; the bare `mu` then prints it. |
| `sqrt(sum((X.vals-mu)^2*p.vals))` | `^2` squares each deviation; `sum` adds the weighted squares; `sqrt()` takes the square root, giving σ. |
| `X.vals <- 1:12`, `p.vals <- (2*(12 - X.vals) + 1)/144` | Reassigning overwrites the old values: now the minimum's values and probabilities. |
| last two lines | Repeat the mean and SD lines for the minimum. |

**Left to right**

- `X.vals <- 2:24`: "Store under X.vals (`X.vals <-`) the whole numbers 2 to 24 (`2:24`)."
- `p.vals <- (12 - abs(X.vals - 13))/144`: "Store under p.vals (`p.vals <-`) 12 minus (`-`) the absolute value (`abs`) of X.vals minus 13 (`X.vals - 13`), divided by (`/`) 144."
- `mu <- sum(X.vals*p.vals); mu`: "Store under mu (`mu <-`) the total (`sum`) of X.vals times p.vals (`X.vals*p.vals`), then (`;`) print mu (`mu`)."
- `sqrt(sum((X.vals-mu)^2*p.vals))`: "The square root (`sqrt`) of the total (`sum`) of X.vals minus mu (`X.vals-mu`) squared (`^2`) times p.vals (`*p.vals`)."
- `X.vals <- 1:12`, `p.vals <- (2*(12 - X.vals) + 1)/144`, then the same two lines: "Store under X.vals the numbers 1 to 12 (`1:12`) and under p.vals 2 times 12 minus X.vals, plus 1, over 144 (`(2*(12 - X.vals) + 1)/144`), then repeat the mean and SD lines (`mu <-`, `sqrt`)."

**Right to left**, the order R runs it

- `X.vals <- 2:24`: "Make the numbers 2 to 24 (`2:24`), then store them as X.vals (`X.vals <-`)."
- `p.vals <- (12 - abs(X.vals - 13))/144`: "Subtract 13 from each X.vals (`X.vals - 13`), take absolute values (`abs`), subtract from 12 (`12 -`), divide by 144 (`/144`), store as p.vals (`p.vals <-`)."
- `mu <- sum(X.vals*p.vals); mu`: "Multiply slot by slot (`X.vals*p.vals`), add up (`sum`), store as mu (`mu <-`), then print it (`; mu`)."
- `sqrt(sum((X.vals-mu)^2*p.vals))`: "Subtract mu (`X.vals-mu`), square (`^2`), weight by p.vals (`*p.vals`), add up (`sum`), take the square root (`sqrt`)."
- `X.vals <- 1:12`, `p.vals <- (2*(12 - X.vals) + 1)/144`, then the same two lines: "Make 1 to 12 and store it (`1:12`, `X.vals <-`), compute each probability and store it (`(2*(12 - X.vals) + 1)/144`, `p.vals <-`), then rerun the mean and SD lines (`mu <-`, `sqrt`)."
:::

## Binomial: PP1, PP3

Taught in [Binomial: successes in n trials](#/math3042-u4/binomial). R: `dbinom(x, n, p)` for exactly x, `pbinom(k, n, p)` for k or fewer.

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(x, n, p)` | Template: x fills `x`, n fills `size` (trials), p fills `prob`. Returns P(X = x). |
| `pbinom(k, n, p)` | Template: k fills `q`, then `size` and `prob` as above. Returns P(X ≤ k). |

**Left to right**

- `dbinom(x, n, p)`: "The binomial probability of exactly (`dbinom`) x (`x`) in n trials (`n`) with probability p (`p`)."
- `pbinom(k, n, p)`: "The binomial probability of at most (`pbinom`) k (`k`) in n trials (`n`) with probability p (`p`)."

**Right to left**, the order R runs it

- `dbinom(x, n, p)`: "Take x, n and p (`x`, `n`, `p`), then compute P(X = x) (`dbinom`)."
- `pbinom(k, n, p)`: "Take k, n and p (`k`, `n`, `p`), then add up P(0) to P(k) (`pbinom`)."
:::

### PP1. Ore samples

70 % of the ore samples from a site are undersized. Four samples are selected. Find the probability that (a) all four are undersized, (b) none is undersized, (c) three or fewer are undersized.

```quiz
[
  {
    "q": "PP1a. P(all 4 undersized), 4 decimals.",
    "type": "numeric",
    "answer": 0.2401,
    "tolerance": 0.0001,
    "explain": "Let X = the number of undersized samples among the 4. Binomial: n = 4 fixed, each undersized or not, p = 0.7 each, independent. P(X = 4) = 4C4 (0.7)⁴(0.3)⁰ = 0.2401."
  },
  {
    "q": "PP1b. P(none undersized), 4 decimals.",
    "type": "numeric",
    "answer": 0.0081,
    "tolerance": 0.0001,
    "explain": "P(X = 0) = 4C0 (0.7)⁰(0.3)⁴ = 0.0081."
  },
  {
    "q": "PP1c. P(three or fewer undersized), 4 decimals.",
    "type": "numeric",
    "answer": 0.7599,
    "tolerance": 0.0001,
    "explain": "By the complement rule, P(X ≤ 3) = 1 − P(X = 4) = 1 − 0.2401 = 0.7599. Adding P(0) through P(3) gives the same number with four times the work."
  }
]
```

X = the number of undersized samples, binomial with n = 4, p = 0.7. (a) $0.7^4 = 0.2401$. (b) $0.3^4 = 0.0081$. (c) Complement rule: $1 - P(X = 4) = 1 - 0.2401 = 0.7599$.

```r
dbinom(4, 4, 0.7)
dbinom(0, 4, 0.7)
pbinom(3, 4, 0.7)
```
```text
[1] 0.2401
[1] 0.0081
[1] 0.7599
```

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(4, 4, 0.7)`, `dbinom(0, 4, 0.7)` | x = 4 or 0, size = 4 (n), prob = 0.7 (p). Each returns P(X = x). |
| `pbinom(3, 4, 0.7)` | q = 3, size = 4, prob = 0.7. Returns P(X ≤ 3). |

**Left to right**

- `dbinom(4, 4, 0.7)`, `dbinom(0, 4, 0.7)`: "The binomial probability of exactly (`dbinom`) 4, then 0 (`4`, `0`), in 4 trials (`4`) with probability 0.7 (`0.7`)."
- `pbinom(3, 4, 0.7)`: "The binomial probability of at most (`pbinom`) 3 (`3`) in 4 trials (`4`) with probability 0.7 (`0.7`)."

**Right to left**, the order R runs it

- `dbinom(4, 4, 0.7)`, `dbinom(0, 4, 0.7)`: "Take x = 4 or 0 (`4`, `0`), 4 trials (`4`) and 0.7 (`0.7`), then compute P(X = x) (`dbinom`)."
- `pbinom(3, 4, 0.7)`: "Take 3 (`3`), 4 trials (`4`) and 0.7 (`0.7`), then add up P(0) to P(3) (`pbinom`)."
:::

### PP3. Guessing on a test

A test has 10 multiple-choice questions with 4 choices each, and a student guesses every answer. Find the probability that the student gets (a) none correct, (b) 8 out of 10 or better.

```quiz
[
  {
    "q": "PP3a. P(none correct), 4 decimals.",
    "type": "numeric",
    "answer": 0.0563135,
    "tolerance": 0.0001,
    "explain": "Let X = the number of correct answers. Binomial, n = 10, p = 1/4. P(X = 0) = (0.75)¹⁰ = 0.0563 (the sheet prints 0.05631)."
  },
  {
    "q": "PP3b. P(8 or more correct), 4 decimals.",
    "type": "numeric",
    "answer": 0.000415802,
    "tolerance": 0.00002,
    "explain": "P(X ≥ 8) = P(8) + P(9) + P(10) = 45(0.25)⁸(0.75)² + 10(0.25)⁹(0.75) + (0.25)¹⁰ = 0.000386238 + 0.0000286102 + 0.000000954 = 0.000415802 → 0.0004. The sheet prints 4.158E−4, the same number to four significant digits. In R, 'at least 8' is 1 − pbinom(7, …), not pbinom(8, …)."
  }
]
```

(a) $P(0) = 0.75^{10} = 0.0563$. (b) At least 8 is 8, 9 or 10:

$$P(X \ge 8) = 45(0.25)^8(0.75)^2 + 10(0.25)^9(0.75) + (0.25)^{10} = \frac{436}{4^{10}} = 0.000415802 \approx 0.0004$$

The sheet's 4.158E−4 is the same value in scientific notation; the cover rule gives 0.0004. Either way, scoring 8 or better by guessing is about 4 in 10,000.

```r
dbinom(0, 10, 0.25)
1 - pbinom(7, 10, 0.25)
```
```text
[1] 0.05631351
[1] 0.000415802
```

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(0, 10, 0.25)` | x = 0, size = 10, prob = 0.25. |
| `1 - pbinom(7, 10, 0.25)` | q = 7, size = 10, prob = 0.25 gives P(X ≤ 7); `1 -` subtracts it from one. |

**Left to right**

- `dbinom(0, 10, 0.25)`: "The binomial probability of exactly (`dbinom`) 0 (`0`) in 10 trials (`10`) with probability 0.25 (`0.25`)."
- `1 - pbinom(7, 10, 0.25)`: "One (`1`) minus (`-`) the binomial probability of at most (`pbinom`) 7 (`7`) in 10 trials (`10`) with probability 0.25 (`0.25`)."

**Right to left**, the order R runs it

- `dbinom(0, 10, 0.25)`: "Take 0 (`0`), 10 trials (`10`) and 0.25 (`0.25`), then compute P(X = 0) (`dbinom`)."
- `1 - pbinom(7, 10, 0.25)`: "Take 7, 10 and 0.25, add up P(0) to P(7) (`pbinom`), then subtract from one (`1 -`)."
:::

## Geometric: PP6

Taught in [Geometric: trials to the first success](#/math3042-u4/geometric). The course counts trials; R counts failures before the first success, so P(X = x) is `dgeom(x-1, p)` and P(X ≤ k) is `pgeom(k-1, p)`.

:::info R syntax
| Code | What it does |
|---|---|
| `dgeom(x-1, p)` | Template: x-1 (failures before the success) fills `x`, p fills `prob`. `-` subtracts before the call. |
| `pgeom(k-1, p)` | Template: k-1 fills `q`, p fills `prob`. Returns P(at most k-1 failures). |

**Left to right**

- `dgeom(x-1, p)`: "The geometric probability of exactly (`dgeom`) x minus 1 failures (`x-1`) with probability p (`p`)."
- `pgeom(k-1, p)`: "The geometric probability of at most (`pgeom`) k minus 1 failures (`k-1`) with probability p (`p`)."

**Right to left**, the order R runs it

- `dgeom(x-1, p)`: "Subtract 1 from x (`x-1`), take p (`p`), then compute the probability (`dgeom`)."
- `pgeom(k-1, p)`: "Subtract 1 from k (`k-1`), take p (`p`), then compute the cumulative probability (`pgeom`)."
:::

### PP6. Job applications

Each job application has a 0.15 chance of leading to an interview, independently. (a) What is the expected number of applications up to and including the first interview? (b) What is the probability that the fifth application is the first to get an interview? (c) What is the probability that three or more applications are needed?

```quiz
[
  {
    "q": "PP6a. Expected number of applications (3 significant digits).",
    "type": "numeric",
    "answer": 6.66667,
    "tolerance": 0.05,
    "unit": "applications",
    "explain": "Let X = the number of applications up to and including the first interview. Geometric with p = 0.15. μ = 1/p = 1/0.15 = 6.67 applications (the sheet prints 6.667)."
  },
  {
    "q": "PP6b. P(the fifth application is the first interview), 4 decimals.",
    "type": "numeric",
    "answer": 0.0783009,
    "tolerance": 0.0001,
    "explain": "Four failures then a success: P(X = 5) = q⁴p = 0.85⁴ × 0.15 = 0.52201 × 0.15 = 0.0783."
  },
  {
    "q": "PP6c. P(three or more applications needed), 4 decimals.",
    "type": "numeric",
    "answer": 0.7225,
    "tolerance": 0.0001,
    "explain": "Three or more are needed exactly when the first two fail: P(X ≥ 3) = q² = 0.85² = 0.7225. By the complement: 1 − P(1) − P(2) = 1 − 0.15 − 0.1275 = 0.7225."
  }
]
```

X = applications up to and including the first interview, geometric with p = 0.15. (a) $\mu = 1/0.15 = 6.67$. (b) $P(X = 5) = 0.85^4(0.15) = 0.0783$. (c) $P(X \ge 3) = 1 - 0.15 - 0.85(0.15) = 0.85^2 = 0.7225$.

R counts failures, not trials: the fifth application is 4 failures, so `dgeom(4, 0.15)`; P(X ≥ 3) = 1 − P(X ≤ 2), and P(X ≤ 2) is `pgeom(1, 0.15)`.

```r
1/0.15
dgeom(4, 0.15)
1 - pgeom(1, 0.15)
```
```text
[1] 6.666667
[1] 0.07830094
[1] 0.7225
```

:::info R syntax
| Code | What it does |
|---|---|
| `1/0.15` | `/` divides: R as a calculator. |
| `dgeom(4, 0.15)` | x = 4 failures before the first success, prob = 0.15. |
| `1 - pgeom(1, 0.15)` | q = 1 failure, prob = 0.15 gives P(at most 1 failure); `1 -` takes the complement. |

**Left to right**

- `1/0.15`: "One (`1`) divided by (`/`) 0.15 (`0.15`)."
- `dgeom(4, 0.15)`: "The geometric probability of exactly (`dgeom`) 4 failures (`4`) with probability 0.15 (`0.15`)."
- `1 - pgeom(1, 0.15)`: "One (`1`) minus (`-`) the geometric probability of at most (`pgeom`) 1 failure (`1`) with probability 0.15 (`0.15`)."

**Right to left**, the order R runs it

- `1/0.15`: "Take 0.15 (`0.15`) and divide it into one (`1/`)."
- `dgeom(4, 0.15)`: "Take 4 failures (`4`) and 0.15 (`0.15`), then compute the probability (`dgeom`)."
- `1 - pgeom(1, 0.15)`: "Take 1 (`1`) and 0.15 (`0.15`), compute P(at most 1 failure) (`pgeom`), then subtract from one (`1 -`)."
:::

## Hypergeometric: PP8, PP9, PP11, PP14, PP15

Taught in [Hypergeometric: sampling without replacement](#/math3042-u4/hypergeometric). Every one samples without replacement from a small lot, so the three-C formula applies: $P(x) = C(K,x)\,C(N-K,n-x)/C(N,n)$. In R, `dhyper(x, K, N-K, n)` takes x, the successes in the population, the failures in the population, and the sample size.

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(x, K, N-K, n)` | Template: x fills `x`, K fills `m` (successes), N-K fills `n` (failures), n fills `k` (sample size). R's `n` is the failures, not the sample. |

**Left to right**

- `dhyper(x, K, N-K, n)`: "The hypergeometric probability of exactly (`dhyper`) x (`x`) with K successes (`K`), N minus K failures (`N-K`) and n drawn (`n`)."

**Right to left**, the order R runs it

- `dhyper(x, K, N-K, n)`: "Subtract K from N (`N-K`), take x, K and n (`x`, `K`, `n`), then compute P(X = x) (`dhyper`)."
:::

### PP8. Wood lots

A lot of 20 pieces of wood contains 4 that are below strength. Five pieces are examined. Find the probability that (a) exactly 1 below-strength piece is found, (b) at most 1 is found, (c) at least 1 is found.

```quiz
[
  {
    "q": "PP8a. P(exactly 1 below strength), 4 decimals.",
    "type": "numeric",
    "answer": 0.469556,
    "tolerance": 0.0001,
    "explain": "Let X = the number of below-strength pieces in the 5 examined. Hypergeometric, N = 20, K = 4, n = 5. P(1) = C(4,1)C(16,4)/C(20,5) = 4(1820)/15504 = 7280/15504 = 0.4696."
  },
  {
    "q": "PP8b. P(at most 1), 4 decimals.",
    "type": "numeric",
    "answer": 0.75129,
    "tolerance": 0.0001,
    "explain": "P(0) = C(4,0)C(16,5)/C(20,5) = 4368/15504 = 0.281734. P(X ≤ 1) = P(0) + P(1) = 0.281734 + 0.469556 = 0.7513."
  },
  {
    "q": "PP8c. P(at least 1), 4 decimals.",
    "type": "numeric",
    "answer": 0.718266,
    "tolerance": 0.0001,
    "explain": "Complement: P(X ≥ 1) = 1 − P(0) = 1 − 0.281734 = 0.7183."
  }
]
```

N = 20, K = 4, N − K = 16, n = 5, C(20,5) = 15504.

| | Working | Answer |
|---|---|---|
| (a) $P(1)$ | $C(4,1)\,C(16,4)/C(20,5) = 7280/15504$ | 0.4696 |
| (b) $P(X \le 1)$ | $P(0) + P(1) = 4368/15504 + 0.469556$ | 0.7513 |
| (c) $P(X \ge 1)$ | $1 - P(0) = 1 - 0.281734$ | 0.7183 |

```r
dhyper(1, 4, 20-4, 5)
phyper(1, 4, 20-4, 5)
1 - dhyper(0, 4, 20-4, 5)
```
```text
[1] 0.4695562
[1] 0.75129
[1] 0.7182663
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(1, 4, 20-4, 5)` | x = 1, m = 4 successes in the lot, n = 20-4 failures (R works out the subtraction), k = 5 drawn. |
| `phyper(1, 4, 20-4, 5)` | q = 1, then m, n, k as above. Returns P(X ≤ 1). |
| `1 - dhyper(0, 4, 20-4, 5)` | One minus P(X = 0). |

**Left to right**

- `dhyper(1, 4, 20-4, 5)`: "The hypergeometric probability of exactly (`dhyper`) 1 (`1`) with 4 successes (`4`), 20 minus 4 failures (`20-4`) and 5 drawn (`5`)."
- `phyper(1, 4, 20-4, 5)`: "The hypergeometric probability of at most (`phyper`) 1 (`1`), same lot (`4`, `20-4`, `5`)."
- `1 - dhyper(0, 4, 20-4, 5)`: "One (`1`) minus (`-`) the probability of exactly (`dhyper`) 0 (`0`), same lot (`4`, `20-4`, `5`)."

**Right to left**, the order R runs it

- `dhyper(1, 4, 20-4, 5)`: "Subtract 4 from 20 (`20-4`), take 1, 4 and 5 (`1`, `4`, `5`), then compute P(X = 1) (`dhyper`)."
- `phyper(1, 4, 20-4, 5)`: "Subtract 4 from 20 (`20-4`), then add up P(0) and P(1) (`phyper`)."
- `1 - dhyper(0, 4, 20-4, 5)`: "Subtract 4 from 20 (`20-4`), compute P(X = 0) (`dhyper`), then subtract from one (`1 -`)."
:::

### PP9. Batteries

A sample of 3 is taken from a lot of 24 batteries, 6 of which are defective. Find the probability that the sample contains (a) no defectives, (b) exactly 1 defective, (c) at least 2 defectives.

```quiz
[
  {
    "q": "PP9a. P(no defectives), 4 decimals.",
    "type": "numeric",
    "answer": 0.403162,
    "tolerance": 0.0001,
    "explain": "Let X = the number of defectives in the sample of 3. Hypergeometric, N = 24, K = 6, n = 3. P(0) = C(18,3)/C(24,3) = 816/2024 = 0.4032."
  },
  {
    "q": "PP9b. P(exactly 1 defective), 4 decimals.",
    "type": "numeric",
    "answer": 0.453557,
    "tolerance": 0.0001,
    "explain": "P(1) = C(6,1)C(18,2)/C(24,3) = 6(153)/2024 = 918/2024 = 0.4536."
  },
  {
    "q": "PP9c. P(at least 2 defectives), 4 decimals.",
    "type": "numeric",
    "answer": 0.143281,
    "tolerance": 0.00006,
    "explain": "P(X ≥ 2) = 1 − P(0) − P(1) = 1 − 0.403162 − 0.453557 = 0.143281 → 0.1433. Directly: P(2) + P(3) = (270 + 20)/2024 = 290/2024 = 0.1433. The answer sheet prints 0.1432 because it subtracted the rounded parts (1 − 0.4032 − 0.4536); carry six digits until the last step."
  }
]
```

N = 24, K = 6, N − K = 18, n = 3, C(24,3) = 2024. (a) $816/2024 = 0.4032$. (b) $6 \times 153/2024 = 0.4536$. (c) $1 - 0.403162 - 0.453557 = 0.143281 \approx 0.1433$, which the direct sum $(270 + 20)/2024 = 290/2024$ confirms.

:::warn The sheet's 0.1432 is a rounding slip
The answer sheet gives 0.1432, from 1 − 0.4032 − 0.4536 with the parts already rounded. The exact value is 0.143281, which rounds to 0.1433.
:::

```r
dhyper(0, 6, 24-6, 3)
dhyper(1, 6, 24-6, 3)
1 - phyper(1, 6, 24-6, 3)
```
```text
[1] 0.4031621
[1] 0.4535573
[1] 0.1432806
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(0, 6, 24-6, 3)`, `dhyper(1, 6, 24-6, 3)` | x = 0 or 1, m = 6 defective, n = 24-6 good, k = 3 drawn. |
| `1 - phyper(1, 6, 24-6, 3)` | q = 1, same m, n, k: one minus P(X ≤ 1). |

**Left to right**

- `dhyper(0, 6, 24-6, 3)`, `dhyper(1, 6, 24-6, 3)`: "The hypergeometric probability of exactly (`dhyper`) 0, then 1 (`0`, `1`), with 6 defective (`6`), 24 minus 6 good (`24-6`) and 3 drawn (`3`)."
- `1 - phyper(1, 6, 24-6, 3)`: "One (`1`) minus (`-`) the probability of at most (`phyper`) 1 (`1`), same lot (`6`, `24-6`, `3`)."

**Right to left**, the order R runs it

- `dhyper(0, 6, 24-6, 3)`, `dhyper(1, 6, 24-6, 3)`: "Subtract 6 from 24 (`24-6`), take x = 0 or 1, 6 and 3, then compute P(X = x) (`dhyper`)."
- `1 - phyper(1, 6, 24-6, 3)`: "Subtract 6 from 24 (`24-6`), add up P(0) and P(1) (`phyper`), then subtract from one (`1 -`)."
:::

### PP11. Lotto 6/49

In Lotto 6/49 you pick 6 numbers from 1 to 49 and 6 winning numbers are drawn. What is the probability of matching exactly 3 of the 6? Express it also as "1 in …".

```quiz
[
  {
    "q": "PP11. P(match exactly 3 of 6), 4 decimals.",
    "type": "numeric",
    "answer": 0.0176504,
    "tolerance": 0.0001,
    "explain": "Let X = the number of your 6 numbers that are among the 6 drawn. Hypergeometric: N = 49, K = 6 winning numbers, N − K = 43, n = 6 picked. P(3) = C(6,3)C(43,3)/C(49,6) = 20(12341)/13983816 = 246820/13983816 = 0.0177 (the sheet prints 0.01765)."
  },
  {
    "q": "PP11. The same probability as \"1 in …\" (3 significant digits).",
    "type": "numeric",
    "answer": 56.6559,
    "tolerance": 0.05,
    "explain": "1/0.0176504 = 56.656 → 1 in 56.7. The answer sheet prints \"1 in 56.6\", which truncates instead of rounding."
  }
]
```

$$P(3) = \frac{C(6,3)\,C(43,3)}{C(49,6)} = \frac{20 \times 12\,341}{13\,983\,816} = \frac{246\,820}{13\,983\,816} = 0.0177$$

That is 1 in $1/0.0176504 = 56.656$, so **1 in 56.7**. The sheet's "1 in 56.6" truncates the last digit.

```r
dhyper(3, 6, 49-6, 6)
1/dhyper(3, 6, 49-6, 6)
```
```text
[1] 0.0176504
[1] 56.65593
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(3, 6, 49-6, 6)` | x = 3 matches, m = 6 winning numbers, n = 49-6 others, k = 6 picked. |
| `1/dhyper(…)` | One divided by that probability: the "1 in …" figure. |

**Left to right**

- `dhyper(3, 6, 49-6, 6)`: "The hypergeometric probability of exactly (`dhyper`) 3 (`3`) with 6 winning numbers (`6`), 49 minus 6 others (`49-6`) and 6 picked (`6`)."
- `1/dhyper(3, 6, 49-6, 6)`: "One (`1`) divided by (`/`) that same probability (`dhyper(3, 6, 49-6, 6)`)."

**Right to left**, the order R runs it

- `dhyper(3, 6, 49-6, 6)`: "Subtract 6 from 49 (`49-6`), take 3, 6 and 6, then compute P(X = 3) (`dhyper`)."
- `1/dhyper(3, 6, 49-6, 6)`: "Compute P(X = 3) again (`dhyper`), then divide it into one (`1/`)."
:::

### PP14. Lot of 50

A lot of 50 items contains 6 defectives. A sample of 5 is taken. Find the probability of (a) no defectives, (b) not more than 1 defective, (c) more than 2 defectives.

```quiz
[
  {
    "q": "PP14a. P(no defectives), 4 decimals.",
    "type": "numeric",
    "answer": 0.512568,
    "tolerance": 0.0001,
    "explain": "Let X = the number of defectives in the sample of 5. Hypergeometric, N = 50, K = 6, n = 5. P(0) = C(44,5)/C(50,5) = 1086008/2118760 = 0.5126."
  },
  {
    "q": "PP14b. P(not more than 1 defective), 4 decimals.",
    "type": "numeric",
    "answer": 0.896994,
    "tolerance": 0.0001,
    "explain": "P(1) = C(6,1)C(44,4)/C(50,5) = 814506/2118760 = 0.384426. P(X ≤ 1) = 0.512568 + 0.384426 = 0.8970."
  },
  {
    "q": "PP14c. P(more than 2 defectives), 4 decimals.",
    "type": "numeric",
    "answer": 0.00924409,
    "tolerance": 0.00005,
    "explain": "P(2) = C(6,2)C(44,3)/C(50,5) = 198660/2118760 = 0.093762. P(X > 2) = 1 − P(X ≤ 2) = 1 − 0.896994 − 0.093762 = 0.009244 → 0.0092. The answer sheet prints 0.0093, which is off in the last digit even from its own rounded parts (1 − 0.8970 − 0.0938 = 0.0092)."
  }
]
```

N = 50, K = 6, N − K = 44, n = 5, C(50,5) = 2,118,760.

| | Working | Answer |
|---|---|---|
| (a) $P(0)$ | $C(44,5)/C(50,5) = 1\,086\,008/2\,118\,760$ | 0.5126 |
| (b) $P(X \le 1)$ | $0.512568 + 814\,506/2\,118\,760 = 0.512568 + 0.384426$ | 0.8970 |
| (c) $P(X > 2)$ | $1 - 0.896994 - 198\,660/2\,118\,760 = 1 - 0.896994 - 0.093762$ | 0.0092 |

:::warn The sheet's 0.0093 is wrong in the last digit
"More than 2" is 1 − P(X ≤ 2) = 0.00924409, which rounds to 0.0092. The sheet prints 0.0093; even its rounded parts give 1 − 0.8970 − 0.0938 = 0.0092.
:::

```r
dhyper(0, 6, 50-6, 5)
phyper(1, 6, 50-6, 5)
1 - phyper(2, 6, 50-6, 5)
```
```text
[1] 0.5125677
[1] 0.8969935
[1] 0.009244086
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(0, 6, 50-6, 5)` | x = 0, m = 6 defective, n = 50-6 good, k = 5 drawn. |
| `phyper(1, 6, 50-6, 5)` | q = 1: P(X ≤ 1). |
| `1 - phyper(2, 6, 50-6, 5)` | q = 2: one minus P(X ≤ 2). |

**Left to right**

- `dhyper(0, 6, 50-6, 5)`: "The hypergeometric probability of exactly (`dhyper`) 0 (`0`) with 6 defective (`6`), 50 minus 6 good (`50-6`) and 5 drawn (`5`)."
- `phyper(1, 6, 50-6, 5)`: "The probability of at most (`phyper`) 1 (`1`), same lot (`6`, `50-6`, `5`)."
- `1 - phyper(2, 6, 50-6, 5)`: "One (`1`) minus (`-`) the probability of at most (`phyper`) 2 (`2`), same lot."

**Right to left**, the order R runs it

- `dhyper(0, 6, 50-6, 5)`: "Subtract 6 from 50 (`50-6`), take 0, 6 and 5, then compute P(X = 0) (`dhyper`)."
- `phyper(1, 6, 50-6, 5)`: "Subtract 6 from 50 (`50-6`), then add up P(0) and P(1) (`phyper`)."
- `1 - phyper(2, 6, 50-6, 5)`: "Subtract 6 from 50 (`50-6`), add up P(0) to P(2) (`phyper`), then subtract from one (`1 -`)."
:::

### PP15. Gas detectors

A shipment of 15 gas detectors contains 2 defectives. A sample of 3 is tested. What is the probability that the sample contains no defectives?

```quiz
[
  {
    "q": "PP15. P(no defectives in the 3 tested), 4 decimals.",
    "type": "numeric",
    "answer": 0.628571,
    "tolerance": 0.0001,
    "explain": "Let X = the number of defectives among the 3. Hypergeometric, N = 15, K = 2, n = 3. P(0) = C(2,0)C(13,3)/C(15,3) = 286/455 = 0.6286. Sequential fractions give the same: (13/15)(12/14)(11/13) = 0.6286."
  }
]
```

$$P(0) = \frac{C(13,3)}{C(15,3)} = \frac{286}{455} = 0.6286 = \frac{13}{15}\cdot\frac{12}{14}\cdot\frac{11}{13}$$

```r
dhyper(0, 2, 15-2, 3)
```
```text
[1] 0.6285714
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(0, 2, 15-2, 3)` | x = 0, m = 2 defective, n = 15-2 good, k = 3 tested. |

**Left to right**

- "The hypergeometric probability of exactly (`dhyper`) 0 (`0`) with 2 defective (`2`), 15 minus 2 good (`15-2`) and 3 tested (`3`)."

**Right to left**, the order R runs it

- "Subtract 2 from 15 (`15-2`), take 0, 2 and 3 (`0`, `2`, `3`), then compute P(X = 0) (`dhyper`)."
:::

## Poisson: PP7, PP10, PP12, PP13, PP16

Taught in [Poisson: counts per interval](#/math3042-u4/poisson). Each one starts by rescaling the rate to the interval asked about: λ = rate × interval. Separate intervals are independent, so their probabilities multiply.

### PP7. Richmond homicides

Richmond averages 116 homicides per year. Find the probability of 0, 1, 2, 3 and 4 homicides on a given day. Actual data: 268 days (73.4 %) had none, 79 days (21.6 %) had one, 1 day (0.294 %) had three, and no day had more than three.

```quiz
[
  {
    "q": "PP7. P(0 homicides on a given day), 4 decimals.",
    "type": "numeric",
    "answer": 0.727742,
    "tolerance": 0.0001,
    "explain": "Let X = the number of homicides in one day. Poisson with λ = 116/365 = 0.317808 per day. P(0) = e^(−0.317808) = 0.7277 (the sheet prints 0.728)."
  },
  {
    "q": "PP7. P(exactly 1), 4 decimals.",
    "type": "numeric",
    "answer": 0.231282,
    "tolerance": 0.0001,
    "explain": "P(1) = λe^(−λ) = 0.317808 × 0.727742 = 0.2313 (sheet 0.231)."
  },
  {
    "q": "PP7. P(exactly 2), 4 decimals.",
    "type": "numeric",
    "answer": 0.036752,
    "tolerance": 0.0001,
    "explain": "P(2) = λ²e^(−λ)/2! = 0.317808² × 0.727742/2 = 0.0368."
  },
  {
    "q": "PP7. P(exactly 3), 4 decimals.",
    "type": "numeric",
    "answer": 0.003893,
    "tolerance": 0.00002,
    "explain": "P(3) = λ³e^(−λ)/3! = 0.0039 (0.00389333; sheet 0.00389)."
  },
  {
    "q": "PP7. P(exactly 4), 4 decimals.",
    "type": "numeric",
    "answer": 0.000309333,
    "tolerance": 0.00002,
    "explain": "P(4) = λ⁴e^(−λ)/4! = 0.0003 (0.000309333; sheet 0.000309)."
  }
]
```

$\lambda = 116/365 = 0.317808$ homicides per day, then $P(x) = \lambda^x e^{-\lambda}/x!$.

| x | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| P(x), cover rule | 0.7277 | 0.2313 | 0.0368 | 0.0039 | 0.0003 |
| sheet (3 s.f.) | 0.728 | 0.231 | 0.0368 | 0.00389 | 0.000309 |
| expected days of 365 | 265.6 | 84.4 | 13.4 | 1.4 | 0.1 |
| actual days | 268 | 79 | not given | 1 | 0 |

The model fits: 268 against 265.6 days with none, 79 against 84.4 with one. The stem's "0.294 %" for one day does not equal 1/365 = 0.274 %; it is reproduced as given.

```r
round(dpois(0:4, 116/365), 4)
```
```text
[1] 0.7277 0.2313 0.0368 0.0039 0.0003
```

:::info R syntax
| Code | What it does |
|---|---|
| `dpois(0:4, 116/365)` | x = `0:4`, five values at once; lambda = 116/365 per day. Returns five probabilities. |
| `round(…, 4)` | x = the five probabilities, digits = 4 decimal places. |
| output line | All five values print on one line; `[1]` marks the first. |

**Left to right**

- "Round (`round`) to 4 decimals (`4`) the Poisson probabilities of exactly (`dpois`) 0 to 4 (`0:4`) with mean 116 over 365 (`116/365`)."

**Right to left**, the order R runs it

- "Divide 116 by 365 (`116/365`), make 0 to 4 (`0:4`), compute the five probabilities (`dpois`), then round each to 4 decimals (`round`, `4`)."
:::

### PP10. Low birth weight

A hospital averages 210 low-birth-weight babies per year. (a) What is the probability of more than 1 on a given day? (b) Would 2 on one day be unusual?

```quiz
[
  {
    "q": "PP10a. P(more than 1 in a day), 4 decimals.",
    "type": "numeric",
    "answer": 0.113851,
    "tolerance": 0.0001,
    "explain": "Let X = the number of low-birth-weight babies in one day. Poisson, λ = 210/365 = 0.575342. P(X > 1) = 1 − P(0) − P(1) = 1 − 0.562512 − 0.323637 = 0.113851 → 0.1139. The answer sheet prints 0.113, which truncates: to three significant digits it is 0.114."
  },
  {
    "q": "PP10b. True or false: 2 low-birth-weight babies in one day would be unusual.",
    "type": "tf",
    "answer": false,
    "explain": "μ = λ = 0.575342, σ = √0.575342 = 0.758513. Z = (2 − 0.575342)/0.758513 = 1.88. |Z| < 2, so 2 in a day is not unusual."
  }
]
```

$\lambda = 210/365 = 0.575342$ per day, $P(0) = 0.562512$, $P(1) = 0.323637$.

$$P(X > 1) = 1 - 0.562512 - 0.323637 = 0.113851 \approx 0.1139$$

The sheet's 0.113 is truncated; three significant digits would be 0.114. For (b), $\sigma = \sqrt{0.575342} = 0.758513$ and $Z = (2 - 0.5753)/0.7585 = 1.88$; **No**, 2 in a day is not unusual, since |Z| = 1.88 is under 2.

```r
1 - ppois(1, 210/365)
(2 - 210/365)/sqrt(210/365)
```
```text
[1] 0.1138507
[1] 1.878223
```

:::info R syntax
| Code | What it does |
|---|---|
| `1 - ppois(1, 210/365)` | q = 1, lambda = 210/365: one minus P(X ≤ 1). |
| `(2 - 210/365)/sqrt(210/365)` | The brackets group the numerator; `sqrt()` is the square root of λ, the SD. Gives the z-score. |

**Left to right**

- `1 - ppois(1, 210/365)`: "One (`1`) minus (`-`) the Poisson probability of at most (`ppois`) 1 (`1`) with mean 210 over 365 (`210/365`)."
- `(2 - 210/365)/sqrt(210/365)`: "Two minus 210 over 365 (`2 - 210/365`), divided by (`/`) the square root (`sqrt`) of 210 over 365 (`210/365`)."

**Right to left**, the order R runs it

- `1 - ppois(1, 210/365)`: "Divide 210 by 365 (`210/365`), add up P(0) and P(1) (`ppois`), then subtract from one (`1 -`)."
- `(2 - 210/365)/sqrt(210/365)`: "Work out the bracket (`2 - 210/365`), take the square root of λ (`sqrt(210/365)`), then divide the first by the second (`/`)."
:::

### PP12. Cesium-137

A sample of 1,000,000 cesium-137 atoms decays to 977,287 atoms over 365 days. What is the probability that exactly 50 atoms decay on a given day?

```quiz
[
  {
    "q": "PP12. P(exactly 50 decays on a given day), 4 decimals.",
    "type": "numeric",
    "answer": 0.0155236,
    "tolerance": 0.0001,
    "explain": "Let X = the number of atoms that decay in one day. 1,000,000 − 977,287 = 22,713 decays in 365 days, so λ = 22,713/365 = 62.2274 per day. P(50) = 62.2274⁵⁰ e^(−62.2274)/50! = 0.0155."
  }
]
```

$\lambda = (1\,000\,000 - 977\,287)/365 = 22\,713/365 = 62.2274$ decays per day, and $P(50) = 62.2274^{50}e^{-62.2274}/50! = 0.0155$. On a calculator, divide $62.2274^{50}$ by $50!$ first (about $1.64 \times 10^{25}$), then multiply by $e^{-62.2274}$.

```r
dpois(50, 22713/365)
```
```text
[1] 0.01552357
```

:::info R syntax
| Code | What it does |
|---|---|
| `dpois(50, 22713/365)` | x = 50, lambda = 22713/365; R does the division, so no rounded λ is typed. |

**Left to right**

- "The Poisson probability of exactly (`dpois`) 50 (`50`) with mean 22713 over 365 (`22713/365`)."

**Right to left**, the order R runs it

- "Divide 22713 by 365 (`22713/365`), take 50 (`50`), then compute P(X = 50) (`dpois`)."
:::

### PP13. Cafeteria

Customers arrive at a cafeteria at 0.3 per minute. Find the probability of (a) exactly 2 customers in 10 minutes, (b) 2 or more in 10 minutes, (c) exactly 1 in a 5-minute span and exactly 1 in the next 5 minutes.

```quiz
[
  {
    "q": "PP13a. P(exactly 2 in 10 minutes), 4 decimals.",
    "type": "numeric",
    "answer": 0.224042,
    "tolerance": 0.0001,
    "explain": "Let X = the number of customers in 10 minutes. λ = 0.3 × 10 = 3. P(2) = 3² e^(−3)/2! = 9(0.049787)/2 = 0.2240."
  },
  {
    "q": "PP13b. P(2 or more in 10 minutes), 4 decimals.",
    "type": "numeric",
    "answer": 0.800852,
    "tolerance": 0.0001,
    "explain": "P(X ≥ 2) = 1 − P(0) − P(1) = 1 − 0.049787 − 0.149361 = 0.8009."
  },
  {
    "q": "PP13c. P(exactly 1 in a 5-minute span and exactly 1 in the next 5 minutes), 4 decimals.",
    "type": "numeric",
    "answer": 0.112021,
    "tolerance": 0.0001,
    "explain": "Each 5-minute span has λ = 0.3 × 5 = 1.5, and P(1) = 1.5e^(−1.5) = 0.334695. The spans do not overlap, so they are independent: 0.334695² = 0.1120. This is half of (a): exactly 2 in 10 minutes also counts the 2-and-0 and 0-and-2 splits."
  }
]
```

(a) $\lambda = 0.3 \times 10 = 3$, $P(2) = 9e^{-3}/2 = 0.2240$. (b) $1 - e^{-3} - 3e^{-3} = 1 - 0.049787 - 0.149361 = 0.8009$. (c) $\lambda = 1.5$ per span; independent spans multiply: $(1.5e^{-1.5})^2 = 0.334695^2 = 0.1120$.

```r
dpois(2, 3)
1 - ppois(1, 3)
dpois(1, 1.5)^2
```
```text
[1] 0.2240418
[1] 0.8008517
[1] 0.1120209
```

:::info R syntax
| Code | What it does |
|---|---|
| `dpois(2, 3)` | x = 2, lambda = 3. |
| `1 - ppois(1, 3)` | q = 1, lambda = 3: one minus P(X ≤ 1). |
| `dpois(1, 1.5)^2` | x = 1, lambda = 1.5; `^2` squares the result. |

**Left to right**

- `dpois(2, 3)`: "The Poisson probability of exactly (`dpois`) 2 (`2`) with mean 3 (`3`)."
- `1 - ppois(1, 3)`: "One (`1`) minus (`-`) the Poisson probability of at most (`ppois`) 1 (`1`) with mean 3 (`3`)."
- `dpois(1, 1.5)^2`: "The Poisson probability of exactly (`dpois`) 1 (`1`) with mean 1.5 (`1.5`), squared (`^2`)."

**Right to left**, the order R runs it

- `dpois(2, 3)`: "Take 2 and the mean 3 (`2`, `3`), then compute P(X = 2) (`dpois`)."
- `1 - ppois(1, 3)`: "Take 1 and 3, add up P(0) and P(1) (`ppois`), then subtract from one (`1 -`)."
- `dpois(1, 1.5)^2`: "Take 1 and 1.5, compute P(X = 1) (`dpois`), then square it (`^2`)."
:::

### PP16. 100-year flood

A "100-year flood" occurs on average once every 100 years. Find the probability of (a) at least 1 in the next 50 years, (b) exactly 1 in the next 50 years, (c) exactly 1 in the next 50 years and exactly 1 in the 50 years after that, (d) exactly 2 in the next 100 years.

```quiz
[
  {
    "q": "PP16a. P(at least 1 in 50 years), 4 decimals.",
    "type": "numeric",
    "answer": 0.393469,
    "tolerance": 0.0001,
    "explain": "Let X = the number of 100-year floods in 50 years. λ = (1/100) × 50 = 0.5. P(X ≥ 1) = 1 − P(0) = 1 − e^(−0.5) = 1 − 0.606531 = 0.3935."
  },
  {
    "q": "PP16b. P(exactly 1 in 50 years), 4 decimals.",
    "type": "numeric",
    "answer": 0.303265,
    "tolerance": 0.0001,
    "explain": "P(1) = 0.5e^(−0.5) = 0.5 × 0.606531 = 0.3033."
  },
  {
    "q": "PP16c. P(exactly 1 in the next 50 years and exactly 1 in the 50 after), 4 decimals.",
    "type": "numeric",
    "answer": 0.0919699,
    "tolerance": 0.0001,
    "explain": "Two separate 50-year periods, each λ = 0.5, independent: 0.303265² = 0.0920."
  },
  {
    "q": "PP16d. P(exactly 2 in 100 years), 4 decimals.",
    "type": "numeric",
    "answer": 0.18394,
    "tolerance": 0.0001,
    "explain": "Now λ = 1 for 100 years. P(2) = 1² e^(−1)/2! = 0.367879/2 = 0.1839. It is double (c) because the 2 floods may split 1 and 1, 2 and 0, or 0 and 2 between the halves."
  }
]
```

(a) $\lambda = 50/100 = 0.5$: $1 - e^{-0.5} = 0.3935$. (b) $0.5e^{-0.5} = 0.3033$. (c) $0.303265^2 = 0.0920$. (d) $\lambda = 1$: $e^{-1}/2! = 0.1839$. Parts (c) and (d) cover the same 100 years and give different answers because (c) fixes how the two floods split between the halves; the pattern is in [Poisson across separate intervals](#/math3042-midterm/expected-dollars-shortcuts).

```r
1 - dpois(0, 0.5)
dpois(1, 0.5)
dpois(1, 0.5)^2
dpois(2, 1)
```
```text
[1] 0.3934693
[1] 0.3032653
[1] 0.09196986
[1] 0.1839397
```

:::info R syntax
| Code | What it does |
|---|---|
| `1 - dpois(0, 0.5)` | x = 0, lambda = 0.5: one minus P(X = 0). |
| `dpois(1, 0.5)`, `dpois(1, 0.5)^2` | x = 1, lambda = 0.5; the second squares it. |
| `dpois(2, 1)` | x = 2, lambda = 1. |

**Left to right**

- `1 - dpois(0, 0.5)`: "One (`1`) minus (`-`) the Poisson probability of exactly (`dpois`) 0 (`0`) with mean 0.5 (`0.5`)."
- `dpois(1, 0.5)`, `dpois(1, 0.5)^2`: "The Poisson probability of exactly (`dpois`) 1 (`1`) with mean 0.5 (`0.5`), then the same squared (`^2`)."
- `dpois(2, 1)`: "The Poisson probability of exactly (`dpois`) 2 (`2`) with mean 1 (`1`)."

**Right to left**, the order R runs it

- `1 - dpois(0, 0.5)`: "Take 0 and 0.5, compute P(X = 0) (`dpois`), then subtract from one (`1 -`)."
- `dpois(1, 0.5)`, `dpois(1, 0.5)^2`: "Take 1 and 0.5, compute P(X = 1) (`dpois`), and in the second line square it (`^2`)."
- `dpois(2, 1)`: "Take 2 and the mean 1, then compute P(X = 2) (`dpois`)."
:::

```quiz
[
  {
    "q": "Which distribution fits: a quality inspector takes 4 boards from a pallet of 30, of which 5 are warped, and counts the warped ones?",
    "options": ["Hypergeometric", "Binomial", "Geometric", "Poisson"],
    "answer": 0,
    "explain": "A fixed sample without replacement from a small finite population (4 of 30 is 13 %, over the 5 % rule): hypergeometric, as in PP8, PP9, PP14 and PP15."
  },
  {
    "q": "A help desk gets 18 tickets per 8-hour shift. What λ do you use for P(exactly 2 tickets in 30 minutes)?",
    "type": "numeric",
    "answer": 1.125,
    "tolerance": 0.006,
    "explain": "λ = rate × interval = (18/8 per hour) × 0.5 hour = 2.25 × 0.5 = 1.125."
  },
  {
    "q": "Fill the slot so the line gives P(the 6th attempt is the first success) for p = 0.2, counting attempts as the course does.",
    "type": "fill",
    "code": "dgeom(___, 0.2)",
    "answer": ["5"],
    "explain": "The course counts trials (6); R counts failures before the first success (5). `dgeom(5, 0.2)` = 0.8⁵ × 0.2 = 0.0655."
  },
  {
    "q": "Fill the slot: P(more than 2 defectives) in a sample of 6 from a lot of 40 with 7 defective.",
    "type": "fill",
    "code": "1 - phyper(___, 7, 40-7, 6)",
    "answer": ["2"],
    "explain": "More than 2 = 1 − P(X ≤ 2), so the cumulative stops at 2, as in PP14c's `1 - phyper(2, 6, 50-6, 5)`."
  },
  {
    "q": "True or false: P(exactly 1 event in each of two separate 1-hour spans) equals P(exactly 2 events in the 2 hours).",
    "type": "tf",
    "answer": false,
    "explain": "The 2-hour count also includes the 2-and-0 and 0-and-2 splits, so it is larger. With λ = 1 per hour: 1-and-1 is (e^(−1))² = 0.1353, while 2 in 2 hours (λ = 2) is 2²e^(−2)/2! = 0.2707."
  },
  {
    "q": "Same pallet: 30 boards, 5 warped, the inspector takes 4. P(at least 1 warped board), 4 decimals.",
    "type": "numeric",
    "answer": 0.538405,
    "tolerance": 0.0001,
    "explain": "Let X = the number of warped boards among the 4. Hypergeometric, N = 30, K = 5, n = 4. P(0) = C(25,4)/C(30,4) = 12650/27405 = 0.461595. P(X ≥ 1) = 1 − 0.461595 = 0.5384. In R: `1 - dhyper(0, 5, 30-5, 4)`. The binomial 1 − (25/30)⁴ = 0.5177 is the with-replacement answer and is wrong here."
  }
]
```
