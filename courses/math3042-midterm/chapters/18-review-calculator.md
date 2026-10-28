---
title: "Review 7: the TI-36X Pro on this paper"
minutes: 15
---
<!-- facts: none; calculator key sequences, no examples needed -->

The TI-36X Pro is allowed ("a scientific calculator with statistics functions") and it does more of this paper than it looks: one-variable statistics with quartiles, binomial and Poisson probabilities from a menu, combinations and $e^x$. Each sequence below ends with a check value. Press each one once before the exam on the check data; if the number matches, you own that key.

:::quiz What the calculator earns you
- Q1, Q2, Q10 need no calculator beyond a Z-score.
- Q6 and Q12: $\mu = \sum x P(x)$ typed as one line.
- Q3, Q4: powers and nCr.
- Q11: Poisson from the DISTR menu, or $e^{-\lambda}$ by hand with the sheet's formula.
- Everything else is rounding: a probability to 4 decimals, anything else to 3 significant digits. Leave the calculator in float mode and round on paper.
:::

## Three keys to find now

| Key | Where | Does |
|---|---|---|
| `data` | top row, left of centre | opens the lists L1, L2, L3 |
| `2nd` `data` = `stat-reg/distr` | printed above `data` | the STAT and DISTR menus |
| `prb` | left block | nCr, nPr, `!` (factorial) |
| `2nd` `ln` = $e^x$ | printed above `ln` | $e$ to a power |
| `(-)` | bottom row, left of `enter` | a negative sign; the `−` key is subtraction and gives a syntax error in $e^{-2}$ |
| `◄►` toggle | above `enter` | turns a fraction or $\sqrt{}$ answer into a decimal |
| `^` | right block | powers: `0.9 ^ 5` |

:::warn Fraction answers
In MathPrint mode the calculator may show $\frac{1}{4}$ or $\frac{5}{6}$ instead of a decimal. Press the `◄►` toggle to get 0.25 or 0.8333. A probability is always written as a decimal on the paper.
:::

## Mean, standard deviation and quartiles from a list

Used when the paper hands you raw numbers (a small data set for a median, quartiles or an outlier check).

1. `data`. Type each value into L1, pressing `enter` after each: `2` `enter` `4` `enter` ... .
2. `2nd` `data` (stat-reg/distr). Choose **1-Var Stats**.
3. DATA: L1. FRQ: ONE. Move down to CALC and press `enter`.
4. Move down the list with the down arrow.

| Line | Meaning | Check data 2, 4, 4, 4, 5, 7, 9, 5 gives |
|---|---|---|
| n | count | 8 |
| $\bar{x}$ | mean | 5 |
| Sx | sample SD, the sheet's $s$ with $n - 1$ | 2.138 |
| $\sigma$x | population SD, the sheet's $\sigma$ with $N$ | 2 |
| $\Sigma$x | sum | 40 |
| $\Sigma$x² | sum of squares | 232 |
| minX, Q1, Med, Q3, maxX | five-number summary | 2, 4, 4.5, 6, 9 |

The paper's $s$ is **Sx**. Use $\sigma$x only when the question says the data are the whole population.

Q1 and Q3 here match the course's hand method (median of each half, dropping the middle value when $n$ is odd), so the fences $Q_1 - 1.5\,IQR$ and $Q_3 + 1.5\,IQR$ can come straight from these lines: $IQR = 6 - 4 = 2$, fences $1$ and $9$.

To clear the lists before the next question: `data` `data`, then choose the clear option for L1 (or ALL).

To reuse a statistic in a formula, such as a Z-score, `2nd` `data`, choose **StatVars**, and pick $\bar{x}$ or Sx; it pastes the stored value. $Z$ for the value 9: `(9 − ` $\bar{x}$ `) ÷ Sx` gives $4/2.138 = 1.87$, not unusual.

## Expected value from a probability table

Type the sum as one line. For $x = 0, 1, 2, 3$ with $P(x) = 0.1, 0.2, 0.3, 0.4$:

```text
0 × 0.1 + 1 × 0.2 + 2 × 0.3 + 3 × 0.4   enter   →   2
```

Then the variance shortcut on the sheet, $\sigma^2 = \sum x^2 P(x) - \mu^2$:

```text
0 × 0.1 + 1 × 0.2 + 4 × 0.3 + 9 × 0.4 − 2 ^ 2   enter   →   1
```

$\sigma = \sqrt{1} = 1$. Carry $\mu$ unrounded into the second line; if $\mu$ is long, use `2nd` `(-)` (ans) to recall it, or store it with `sto→` `x`.

A money question is the same line with $x$ = prize − cost: for a \$2 ticket that pays \$50 with probability 0.01 and nothing otherwise, `48 × 0.01 + (−2) × 0.99` gives $-1.50$, an expected loss of \$1.50 per ticket.

## nCr, nPr, factorial

`10` `prb` choose **nCr** `3` `enter` gives 120. `5` `prb` **nCr** `2` gives 10. `prb` **!** after a number gives its factorial: `5` `prb` **!** gives 120. The `prb` menu also has **nPr** for ordered picks.

A hypergeometric probability is three nCr's typed as one fraction. P(2 faulty of 6 taken from 25 with 4 faulty):

```text
(4 nCr 2 × 21 nCr 4) ÷ 25 nCr 6   enter   →   0.2028
```

## Powers and the complement

`0.9 ^ 5` `enter` gives 0.5905, so P(at least one success in 5 tries at 0.1) is `1 − 0.9 ^ 5` = 0.4095. A geometric probability is the same key: P(first success on try 7, $p = 0.3$) is `0.7 ^ 6 × 0.3` = 0.0353.

## $e^{-\lambda}$ for Poisson by hand

`2nd` `ln` opens $e^{\,\square}$; type `(-)` `2`, close the bracket if the calculator opened one, `enter`: 0.1353. P(3 events, $\lambda = 2$) from the sheet's formula:

```text
e^(−2) × 2 ^ 3 ÷ 3 prb !   enter   →   0.1804
```

Type `(-)` for the negative sign, never the `−` key.

## Binomial and Poisson from the DISTR menu

This is the fastest route on Q11 and on any binomial count, and it also checks a hand calculation.

1. `2nd` `data` (stat-reg/distr), arrow right to the **DISTR** tab.
2. Choose **Binompdf** for P(X = x) or **Binomcdf** for P(X ≤ x); **Poispdf** for P(X = x) or **Poiscdf** for P(X ≤ x).
3. Answer the prompts in order: Binom asks n, p, then x; Pois asks $\lambda$, then x. Pick the single-value option if it offers a list. Move to CALC and press `enter`.

| Call | Keys | Check |
|---|---|---|
| P(X = 3), n = 10, p = 0.5 | Binompdf n=10 p=0.5 x=3 | 0.1172 |
| P(X ≤ 3), n = 10, p = 0.5 | Binomcdf n=10 p=0.5 x=3 | 0.1719 |
| P(X = 3), $\lambda$ = 2 | Poispdf λ=2 x=3 | 0.1804 |
| P(X ≤ 2), $\lambda$ = 2 | Poiscdf λ=2 x=2 | 0.6767 |

The cdf is "at most", the same as R's `p` functions, so the inequality table carries over: fewer than k is cdf(k − 1), at least k is 1 − cdf(k − 1), more than k is 1 − cdf(k). There is no hypergeometric or geometric entry; those are the nCr and power lines above.

:::warn Write the formula anyway
The marks are for the setup. Even when the DISTR menu gives the number, write "Let X = ...", the pmf from the sheet, and the substituted line, then the number. A bare 0.1804 earns one mark of three.
:::

```quiz
[
  {
    "q": "On the 1-Var Stats screen, which line is the sample standard deviation $s$ that the formula sheet defines with $n - 1$?",
    "options": ["Sx", "σx", "Σx²", "Q3"],
    "answer": 0,
    "explain": "Sx divides by $n - 1$, the sheet's $s$. σx divides by $N$ and is the population $\\sigma$. For the check data Sx = 2.138 and σx = 2."
  },
  {
    "q": "You need $e^{-1.5}$. Which key gives the minus sign?",
    "options": ["the (-) key left of enter", "the − subtraction key", "either, they are the same", "2nd then −"],
    "answer": 0,
    "explain": "The (-) key is negation. The − key is binary subtraction and gives a syntax error after $e^{\\square}$. $e^{-1.5} = 0.2231$."
  },
  {
    "q": "Poiscdf with λ = 2 and x = 2 returns 0.6767. Which probability is that?",
    "options": ["P(X ≤ 2)", "P(X = 2)", "P(X ≥ 2)", "P(X > 2)"],
    "answer": 0,
    "explain": "cdf is cumulative: at most x. $$P(X \\le 2) = e^{-2}(1 + 2 + 2) = 0.1353 \\times 5 = \\mathbf{0.6767}$$ P(X > 2) would be $1 - 0.6767 = 0.3233$."
  },
  {
    "q": "Type `(4 nCr 2 × 21 nCr 4) ÷ 25 nCr 6` and round to 4 decimals.",
    "type": "numeric",
    "answer": 0.2028,
    "tolerance": 0.0006,
    "explain": "$$\\dfrac{C(4,2)\\,C(21,4)}{C(25,6)} = \\dfrac{6 \\times 5985}{177100} = \\mathbf{0.2028}$$ the hypergeometric formula on the sheet, with the three combinations typed through the prb menu."
  },
  {
    "q": "The calculator shows the answer $\\frac{5}{6}$ for a probability. What do you do before writing it on the paper?",
    "options": ["press the ◄► toggle and write 0.8333", "write 5/6, a fraction is exact", "multiply by 100 and write 83 %", "press 2nd enter"],
    "answer": 0,
    "explain": "The cover rule wants a probability to four decimals. The toggle key turns the exact fraction into 0.8333."
  },
  {
    "q": "P(at least one success in 4 independent tries at p = 0.35). Type `1 − 0.65 ^ 4`, 4 decimals.",
    "type": "numeric",
    "answer": 0.8215,
    "tolerance": 0.0006,
    "explain": "$$1 - P(\\text{none}) = 1 - 0.65^4 = 1 - 0.1785 = \\mathbf{0.8215}$$ The power key does the four multiplications."
  }
]
```
