---
title: "Know cold for Quiz 7: the two formulas, the words table, the R lines, the six data moves"
minutes: 5
---
<!-- facts: none; a one-page reference sheet of the course's formulas and the labs' R lines -->
Cover each right-hand column and say it aloud before you look.

## The two formulas

Unusual means $|Z| > 2$, with $Z = (x - \mu)/\sigma$.

| | $P(x)$ | $\mu$ | $\sigma$ | Use it when |
|---|---|---|---|---|
| Binomial | $C(n, x)\, p^x\, q^{n-x}$ | $np$ | $\sqrt{npq}$ | fixed $n$ trials, two outcomes, the same $p$, independent |
| Poisson | $\dfrac{\lambda^x e^{-\lambda}}{x!}$ | $\lambda$ | $\sqrt{\lambda}$ | a count in an interval; $\lambda$ = rate × the question's interval |

## The words become a sum, then an R line

Poisson is the same table with `ppois(k, lambda)` in place of `pbinom(k, n, p)`.

| Words | Values of X | On paper | R |
|---|---|---|---|
| exactly $k$ | $k$ | $P(k)$ | `dbinom(k, n, p)` |
| at most $k$ | $0, \ldots, k$ | $P(0) + \cdots + P(k)$ | `pbinom(k, n, p)` |
| fewer than $k$ | $0, \ldots, k-1$ | $P(0) + \cdots + P(k-1)$ | `pbinom(k-1, n, p)` |
| at least $k$ | $k, k+1, \ldots$ | $1 - [P(0) + \cdots + P(k-1)]$ | `1 - pbinom(k-1, n, p)` |
| more than $k$ | $k+1, \ldots$ | $1 - [P(0) + \cdots + P(k)]$ | `1 - pbinom(k, n, p)` |
| $a$ to $b$ inclusive | $a, \ldots, b$ | $P(a) + \cdots + P(b)$ | `pbinom(b, n, p) - pbinom(a-1, n, p)` |
| at least one | $1, 2, \ldots$ | $1 - P(0)$ | `1 - dbinom(0, n, p)` |
| at most $k$ in each of two separate intervals | each interval alone | $P(X \le k) \times P(X \le k)$ | `ppois(k, lambda)^2` |
| at most $k$ over one interval twice as long | one interval | $\lambda$ doubled | `ppois(k, 2*lambda)` |

## The d, p, r slots

The first letter says what comes back; the slots are R's own argument names.

| Letter | Gives | Binomial | Poisson |
|---|---|---|---|
| d | $P(X = x)$ | `dbinom(x, size, prob)` | `dpois(x, lambda)` |
| p | $P(X \le q)$ | `pbinom(q, size, prob)` | `ppois(q, lambda)` |
| r | random values | `rbinom(n, size, prob)` | `rpois(n, lambda)` |

## The six data moves

One line each, from Labs 5 and 6.

| Move | R line |
|---|---|
| 1. Load a package and its data | `library(MASS); head(survey)` |
| 2. Import with column types | `SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na.strings="NA", colClasses=c("Date","integer","character","integer","numeric","numeric","numeric"))` |
| 3. Drop the NA rows | `SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C), !is.na(Total.Precip.mm))`, then `nrow(SFU.Weather)` prints 17582 |
| 4. Add a logical column | `SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)` |
| 5. Segment with `ifelse` | `SFU.Weather$Summer <- with(SFU.Weather, ifelse(Month %in% c("Jun","Jul","Aug"), "Summer", "Not summer"))` |
| 6. Tally | `table(SFU.Weather[c("Temp.Seg", "has.Precip")])`; `prop.table(table(survey$Exer))` |

## Conditional probability and independence in R

A and B are logical columns; on `survey` add `na.rm=TRUE` or filter the NA rows first.

| Want | R |
|---|---|
| $P(A)$ | `mean(A)` or `sum(A)/length(A)` |
| $P(A \text{ or } B)$ | `mean(A \| B)` |
| $P(A \text{ and } B)$ | `mean(A & B)` |
| $P(A \mid B)$ | `sum(A & B)/sum(B)` or `mean(A[B])` |
| $P(A \mid B)$ from a two-way table | `tab["B-row","TRUE"]/sum(tab["B-row", ])` |
| mutually exclusive | `if (sum(A & B) == 0) print("Mutually exclusive") else print("Not mutually exclusive")` |
| independent | `if (abs(p.A.given.B - p.A) < 0.01) print("Independent") else print("Not independent")` |
| a sentence with the numbers | `print(paste0("P(A\|B) = ", round(p.A.given.B, 4), ", P(A) = ", round(p.A, 4)))` |

## Rounding and the three traps

A probability to 4 decimals, μ, σ and Z to 2; carry 6 digits until the last line.

| Trap | The right line |
|---|---|
| `rbinom`'s first slot is how many values to draw, not the binomial $n$ | `rbinom(10^5, 50, 0.13)`: 100 000 draws, each a count out of 50 |
| "at least $k$" stops the cumulative one below $k$ | `1 - pbinom(k-1, n, p)`, never `1 - pbinom(k, n, p)` |
| a column with NA gives NA | `mean(survey$Pulse, na.rm=TRUE)`, or `filter(survey, !is.na(Pulse))` first |

```quiz
[
  {
    "type": "fill",
    "q": "$\\sigma$ for a binomial count.",
    "code": "sigma = sqrt(___)",
    "answer": ["npq", "n*p*q", "n*p*(1-p)"],
    "explain": "$$\\sigma = \\sqrt{npq}$$ For a Poisson count it is $\\sqrt{\\lambda}$."
  },
  {
    "type": "fill",
    "q": "P(at least 4) for a binomial with $n = 20$, $p = 0.3$. Fill the slot.",
    "code": "1 - pbinom(___, 20, 0.3)",
    "answer": ["3"],
    "explain": "At least 4 is $1 - P(X \\le 3)$, so the cumulative stops at 3."
  },
  {
    "type": "fill",
    "q": "1000 simulated counts, each out of 25 trials with $p = 0.4$. Fill the first slot.",
    "code": "rbinom(___, 25, 0.4)",
    "answer": ["1000", "10^3", "1e3"],
    "explain": "`rbinom(n, size, prob)`: the first slot is how many values to draw (1000); size = 25 is the binomial n."
  },
  {
    "type": "fill",
    "q": "Calls at 4 per hour. P(at most 2 calls in 30 minutes). Fill the lambda slot.",
    "code": "ppois(2, ___)",
    "answer": ["2", "4*0.5", "4/2"],
    "explain": "Rescale to the question's interval: $$\\lambda = 4 \\times 0.5 = \\mathbf{2}$$"
  },
  {
    "type": "fill",
    "q": "P(A given B) from two logical columns.",
    "code": "sum(A & B)/sum(___)",
    "answer": ["B"],
    "explain": "Given B makes the B rows the whole group, so divide by the count of B."
  },
  {
    "type": "fill",
    "q": "Drop the rows where `Pulse` is missing.",
    "code": "svy <- filter(survey, ___(Pulse))",
    "answer": ["!is.na"],
    "explain": "`filter(survey, !is.na(Pulse))` keeps the rows where Pulse is present."
  }
]
```
