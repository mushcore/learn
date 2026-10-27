---
title: Expected value in dollars, the variance shortcut, Poisson across separate intervals
minutes: 18
---

The practice paper and the Unit 4 problems use three moves no unit lesson teaches: an expected value in dollars, the sheet's second variance formula, and probabilities over separate intervals.

## X is the net amount per play

For a game, a lottery or an insurance policy, X is what one play is worth to the person asked about: the prize minus the cost, or the payout minus the premium. Table the values of X with their probabilities first, then $\mu = \sum x\,P(x)$.

The "Math Rules" lottery costs 2.50 dollars a ticket and pays 100 dollars with probability 0.021. A win is worth 100 − 2.50 = 97.50 net; a loss is −2.50.

| x (dollars) | −2.50 | 97.50 |
|---|---|---|
| P(x) | 0.979 | 0.021 |

$$E(X) = -2.50(0.979) + 97.50(0.021) = -2.4475 + 2.0475 = -0.40$$

The sign goes into words: "There is an expected loss of $0.40 per ticket."

The three-card game asks "how much do you win per game on average", and the game costs nothing to enter, so its X is the gross winnings: 200 with probability 0.002353, 2 with probability 0.828235, 0 otherwise. $E = 200(0.002353) + 2(0.828235) = 2.13$ dollars per game. If a question gives a price to play, subtract it from every value of X first.

### The insurer's side: practice problem 2

A 30-year-old man survives the year with probability 0.9989 and pays a premium of 180 dollars for a 100,000-dollar policy. A 50-year-old woman survives with probability 0.9971 and buys a 75,000-dollar policy.

```quiz
[
  { "q": "What premium for the woman's policy gives the company the same expected cost as the man's? (dollars, to the cent)", "type": "numeric", "answer": 287.5, "tolerance": 0.01, "unit": "dollars", "explain": "Expected cost to the company = payout × P(death) − premium. Man: 100,000(1 − 0.9989) − 180 = 110 − 180 = −70, a 70-dollar expected gain. Woman: 75,000(0.0029) − P = −70, so 217.50 − P = −70 and P = 287.50." }
]
```

For the company, X is the payout if the client dies minus the premium it keeps either way. The man's policy: $100{,}000(0.0011) - 180 = 110 - 180 = -70$. A negative expected cost is a gain, so the sheet answers "−70 (company gains 70 dollars)". The woman's premium P must give the same −70:

$$75{,}000(0.0029) - P = -70 \quad\Rightarrow\quad 217.50 - P = -70 \quad\Rightarrow\quad P = 287.50$$

## The variance shortcut on the formula sheet

The sheet prints two forms, and they are equal:

$$\sigma^2 = \sum (x-\mu)^2 P(x) \qquad \text{or} \qquad \sigma^2 = \sum x^2 P(x) - \mu^2$$

The second needs one column of $x^2 P(x)$ and one subtraction.

```quiz
[
  { "q": "Canadian family size: x = 0, 1, 2, 3 children with P(x) = 0.4499, 0.2504, 0.2048, 0.0949. Compute σ² with the shortcut. (3 significant digits)", "type": "numeric", "answer": 1.03, "tolerance": 0.005, "explain": "μ = 0.2504 + 0.4096 + 0.2847 = 0.9447. Σx²P(x) = 0 + 0.2504 + 4(0.2048) + 9(0.0949) = 0.2504 + 0.8192 + 0.8541 = 1.9237. σ² = 1.9237 − 0.9447² = 1.9237 − 0.892458 = 1.03124, so 1.03." }
]
```

| x | 0 | 1 | 2 | 3 | Σ |
|---|---|---|---|---|---|
| P(x) | 0.4499 | 0.2504 | 0.2048 | 0.0949 | 1 |
| x P(x) | 0 | 0.2504 | 0.4096 | 0.2847 | μ = 0.9447 |
| x² P(x) | 0 | 0.2504 | 0.8192 | 0.8541 | 1.9237 |

$\sigma^2 = 1.9237 - 0.9447^2 = 1.9237 - 0.892458 = 1.03124 \to 1.03$, the same as the notes' long form, and $\sigma = 1.0155 \to 1.02$.

:::warn Carry μ unrounded into the shortcut
The notes write μ = 0.94. Squared and subtracted, it gives 1.9237 − 0.8836 = 1.0401 → 1.04, one unit off in the last digit. The long form barely moves with the rounded mean (1.03126), but the shortcut subtracts two close numbers, so keep μ at six significant digits.
:::

Abdullah's spam calls from Q6: $\sum x^2 P(x) = 0.23 + 1.64 + 1.53 + 1.76 + 1.50 = 6.66$ and $\mu = 2.3$, so $\sigma^2 = 6.66 - 5.29 = 1.37$ and $\sigma = 1.17$ calls per day.

### The spam-call table, column by column

The widget fills the long-form column; its σ² matches the shortcut's 1.37.

```widget
pmf-table
{ "rows": [[0, "0.02"], [1, "0.23"], [2, "0.41"], [3, "0.17"], [4, "0.11"], [5, "0.06"]], "xlab": "X = spam calls per day", "title": "Practice paper Q6: Abdullah's spam calls" }
```

## Separate intervals multiply; one longer interval rescales λ

Poisson counts in non-overlapping intervals are independent. "Exactly 1 in this 5 minutes and exactly 1 in the next 5" is two events, so the probabilities multiply. "2 in the 10 minutes" is one count over a longer interval, so λ is rescaled and the formula is used once.

```quiz
[
  { "q": "Practice problem 13: a cafeteria gets 0.3 customers per minute. P(exactly 1 in a 5-minute span and exactly 1 in the next 5 minutes)? (4 decimals)", "type": "numeric", "answer": 0.112, "tolerance": 0.0001, "explain": "λ = 0.3 × 5 = 1.5 per span. P(1) = 1.5e^(−1.5) = 0.334695. The spans are independent: 0.334695² = 0.1120." }
]
```

Cafeteria, 0.3 per minute. For 10 minutes, $\lambda = 3$: $P(X = 2) = \frac{3^2}{2!}e^{-3} = 0.2240$ and $P(X \ge 2) = 1 - e^{-3}(1 + 3) = 0.8009$. For each 5-minute span $\lambda = 1.5$, so $P(1)^2 = 0.334695^2 = 0.1120$, half of 0.2240: the 10-minute count of 2 also includes 2 then 0 and 0 then 2.

### One 5-minute span at the cafeteria

Square the P(X = 1) the widget shows for the two-span answer.

```widget
poisson-calc
{ "rate": 0.3, "per": 1, "unit": "min", "interval": 5, "x": 1, "op": "eq", "title": "Practice problem 13: 0.3 customers per minute over a 5-minute span" }
```

The 100-year flood (practice problem 16) works the same way with $\lambda = 0.5$ per 50 years: at least 1 in 50 years is $1 - e^{-0.5} = 0.3935$; exactly 1 is $0.5e^{-0.5} = 0.3033$; exactly 1 in each of two 50-year spans is $0.3033^2 = 0.0920$; exactly 2 in 100 years, with $\lambda = 1$, is $\frac{1}{2}e^{-1} = 0.1839$.

"The next event falls between a and b" is two independent pieces: none in the first a, then at least one in the next b − a. Practice paper Q11b, floods at λ = 0.5 per 10 years: $P(0)\,(1 - P(0)) = 0.606531 \times 0.393469 = 0.2387$.

## A one-card game, a backup log, a 4-calls-per-hour help line

```quiz
[
  { "q": "A BCIT club game: draw one card; an ace pays you 10 dollars net, anything else costs you 1 dollar. Expected value per play? (dollars, to the cent; negative for a loss)", "type": "numeric", "answer": -0.15, "tolerance": 0.01, "unit": "dollars", "explain": "X = 10 with P = 4/52, X = −1 with P = 48/52. E(X) = 10(4/52) − 1(48/52) = 40/52 − 48/52 = −8/52 = −0.153846: an expected loss of 0.15 dollars per play." },
  { "q": "Failed nightly backups per week: x = 0, 1, 2, 3 with P(x) = 0.50, 0.30, 0.15, 0.05. μ = ?", "type": "numeric", "answer": 0.75, "tolerance": 0.001, "explain": "μ = 0(0.50) + 1(0.30) + 2(0.15) + 3(0.05) = 0 + 0.30 + 0.30 + 0.15 = 0.75 failures per week." },
  { "q": "Same table: σ by the shortcut. (3 significant digits)", "type": "numeric", "answer": 0.887, "tolerance": 0.001, "explain": "Σx²P(x) = 0 + 0.30 + 4(0.15) + 9(0.05) = 0.30 + 0.60 + 0.45 = 1.35. σ² = 1.35 − 0.75² = 1.35 − 0.5625 = 0.7875. The long form agrees: (0.75)²(0.50) + (0.25)²(0.30) + (1.25)²(0.15) + (2.25)²(0.05) = 0.28125 + 0.01875 + 0.234375 + 0.253125 = 0.7875. σ = √0.7875 = 0.887412, so 0.887." },
  { "q": "A help line gets 4 calls per hour. P(exactly 1 call in a 15-minute span and exactly 1 in the next 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1353, "tolerance": 0.0001, "explain": "λ = 4 × 15/60 = 1 per span. P(1) = 1·e^(−1) = 0.367879. Independent spans: 0.367879² = e^(−2) = 0.1353." },
  { "q": "Same line: P(exactly 2 calls in a 30-minute span)? (4 decimals)", "type": "numeric", "answer": 0.2707, "tolerance": 0.0001, "explain": "One interval, so rescale: λ = 4 × 30/60 = 2. P(2) = 2²/2! · e^(−2) = 2 × 0.135335 = 0.2707. Twice the two-span answer, because 2 then 0 and 0 then 2 also count." },
  { "q": "Same line: P(the next call comes between 15 and 30 minutes from now)? (4 decimals)", "type": "numeric", "answer": 0.2325, "tolerance": 0.0001, "explain": "No call in the first 15 minutes, then at least one in the next 15, independent: P(0)(1 − P(0)) with λ = 1 per span = e^(−1)(1 − e^(−1)) = 0.367879 × 0.632121 = 0.2325." }
]
```

```quiz
[
  { "q": "A SkyTrain charity raffle sells tickets at 5 dollars, each with a 1-in-400 chance of a 1000-dollar prize. Expected value per ticket to the buyer? (dollars, to the cent)", "type": "numeric", "answer": -2.5, "tolerance": 0.01, "unit": "dollars", "explain": "Net values: 1000 − 5 = 995 with P = 1/400 = 0.0025, −5 with P = 0.9975. E(X) = 995(0.0025) − 5(0.9975) = 2.4875 − 4.9875 = −2.50: an expected loss of 2.50 dollars per ticket." },
  { "q": "A laptop warranty costs 120 dollars; 4 % of laptops need a 1500-dollar repair under it. Expected cost to the company per warranty? (dollars; negative means a gain)", "type": "numeric", "answer": -60, "tolerance": 0.01, "unit": "dollars", "explain": "Expected cost = payout × P(claim) − premium = 1500(0.04) − 120 = 60 − 120 = −60. The company expects to gain 60 dollars per warranty sold." },
  { "q": "x = 0, 1, 2, 3, 4 with P(x) = 0.10, 0.25, 0.35, 0.20, 0.10. σ by the shortcut? (3 significant digits)", "type": "numeric", "answer": 1.12, "tolerance": 0.005, "explain": "μ = 0.25 + 0.70 + 0.60 + 0.40 = 1.95. Σx²P(x) = 0.25 + 1.40 + 1.80 + 1.60 = 5.05. σ² = 5.05 − 1.95² = 5.05 − 3.8025 = 1.2475. σ = √1.2475 = 1.11692, so 1.12." },
  { "q": "In the shortcut σ² = Σx²P(x) − μ², rounding μ to two decimals before squaring can change the last digit of σ².", "type": "tf", "answer": true, "explain": "Canadian family size: μ = 0.9447 gives 1.9237 − 0.892458 = 1.03124 → 1.03, but μ = 0.94 gives 1.9237 − 0.8836 = 1.0401 → 1.04. Carry μ at six significant digits." },
  { "q": "SkyTrain service alerts arrive at 0.8 per day. P(exactly 1 alert on Monday and exactly 1 on Tuesday)? (4 decimals)", "type": "numeric", "answer": 0.1292, "tolerance": 0.0001, "explain": "λ = 0.8 per day. P(1) = 0.8e^(−0.8) = 0.8 × 0.449329 = 0.359463. Separate days are independent: 0.359463² = 0.1292." },
  { "q": "Same rate: P(exactly 2 alerts over Monday and Tuesday together)? (4 decimals)", "type": "numeric", "answer": 0.2584, "tolerance": 0.0001, "explain": "One count over two days: λ = 2 × 0.8 = 1.6. P(2) = 1.6²/2! · e^(−1.6) = 1.28 × 0.201897 = 0.2584." },
  { "q": "Same rate: P(the next alert comes on the second day, not the first)? (4 decimals)", "type": "numeric", "answer": 0.2474, "tolerance": 0.0001, "explain": "None on day 1, then at least one on day 2: P(0)(1 − P(0)) = e^(−0.8)(1 − e^(−0.8)) = 0.449329 × 0.550671 = 0.2474." },
  { "q": "For a Poisson rate, P(exactly 1 on each of two days) equals P(exactly 2 over the two days).", "type": "tf", "answer": false, "explain": "The two-day count of 2 also includes 2 then 0 and 0 then 2. At 0.8 per day: 0.1292 against 0.2584." }
]
```
