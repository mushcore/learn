---
title: Every lecture example, worked
minutes: 35
---

Every lecture example in the order it appears: a numeric item first, then the arithmetic and the demo notebook's R check.

The quiz at the end is the same problems with the numbers changed.

## 4.1 Mean and standard deviation of a random variable

```quiz
[
  { "q": "Fair die, $X$ = the number rolled. $\\mu$ = ? (1 decimal)", "type": "numeric", "answer": 3.5, "tolerance": 0.01, "explain": "$$\\mu = (1/6)(1 + 2 + 3 + 4 + 5 + 6) = 21/6 = \\mathbf{3.5}$$ A sample of 100 rolls averaged 3.38; the sample mean wanders, μ does not." }
]
```

**Mean of a die roll.**

$$\mu = \tfrac16 \cdot 1 + \tfrac16 \cdot 2 + \cdots + \tfrac16 \cdot 6 = \tfrac{21}{6} = \mathbf{3.5}$$

The notes' 100 simulated rolls gave **3.38**, a sample mean that approaches 3.5 as the number of rolls grows.

```quiz
[
  { "q": "Canadian family size: $P(x) = 0.4499, 0.2504, 0.2048, 0.0949$ for $x = 0, 1, 2, 3$. The mean number of children $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 0.94, "tolerance": 0.01, "explain": "$$0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0.2504 + 0.4096 + 0.2847 = 0.9447 \\approx \\mathbf{0.94}$$ E[X] is not a possible value of X; it is the long-run average." },
  { "q": "Same table: the standard deviation of the number of children $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.02, "tolerance": 0.01, "explain": "$$\\sigma^2 = (0 − 0.94)^2(0.4499) + (1 − 0.94)^2(0.2504) + (2 − 0.94)^2(0.2048) + (3 − 0.94)^2(0.0949) = 0.3975 + 0.0009 + 0.2301 + 0.4027 = 1.03$$ $$\\sigma = \\sqrt{1.03} = \\mathbf{1.02}$$ Take the root of the sum, never the sum of roots." }
]
```

**Number of children.**

1. Mean:
   $$\mu = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0.9447 \approx \mathbf{0.94}$$
2. Variance:
   $$\sigma^2 = (0 - 0.94)^2 (0.4499) + (1 - 0.94)^2 (0.2504) + (2 - 0.94)^2 (0.2048) + (3 - 0.94)^2 (0.0949) = 1.03$$
3. Standard deviation:
   $$\sigma = \sqrt{1.03} = \mathbf{1.02}$$

R: `c(mu, sig)` prints `0.9447 1.0155`.

:::info R syntax
| Code | What it does |
|---|---|
| `c(mu, sig)` | `c()` combines values into one vector; here the stored mean `mu` and standard deviation `sig`, so both print on one line. |

**Left to right**

- `c(mu, sig)`: "Combine (`c`) the mean (`mu`) and the standard deviation (`sig`)."

**Right to left**, the order R runs it

- `c(mu, sig)`: "Look up mu and sig (`mu`, `sig`), put them in one vector (`c`), and print it."
:::

```quiz
[
  { "q": "Two fair dice, $X$ = the minimum of the two values, so $P(x) = 11/36, 9/36, 7/36, 5/36, 3/36, 1/36$ for $x = 1 \\ldots 6$. The minimum of two dice: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 2.53, "tolerance": 0.01, "explain": "$$\\dfrac{1·11 + 2·9 + 3·7 + 4·5 + 5·3 + 6·1}{36} = \\dfrac{91}{36} = \\mathbf{2.53}$$ The 11 cells with minimum 1 are the top row and left column of the 6 × 6 grid; each later L-shape has two fewer cells." },
  { "q": "The minimum of two dice: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.40, "tolerance": 0.01, "explain": "$$\\sigma^2 = \\sum (x − 2.53)^2 P(x) = (2.34)(11/36) + (0.28)(9/36) + (0.22)(7/36) + (2.16)(5/36) + (6.10)(3/36) + (12.04)(1/36) = 1.97$$ $$\\sigma = \\sqrt{1.97} = \\mathbf{1.40}$$" }
]
```

**Minimum of two dice.** From the 36-cell grid: 11 cells have minimum 1, 9 have minimum 2, then 7, 5, 3, 1.

In general:

$$P(x) = \dfrac{13 - 2x}{36}$$

1. Mean:
   $$\mu = 1 \cdot \tfrac{11}{36} + 2 \cdot \tfrac{9}{36} + 3 \cdot \tfrac{7}{36} + 4 \cdot \tfrac{5}{36} + 5 \cdot \tfrac{3}{36} + 6 \cdot \tfrac{1}{36} = \tfrac{91}{36} = \mathbf{2.53}$$
2. Variance:
   $$\sigma^2 = (1 - 2.53)^2 \tfrac{11}{36} + \cdots + (6 - 2.53)^2 \tfrac{1}{36} = 1.97$$
3. Standard deviation:
   $$\sigma = \sqrt{1.97} = \mathbf{1.40}$$

R prints `2.5278 1.4041`.

**Minimum of three dice, by simulation.** The demo's $10^5$ simulated triples give $\mu \approx \mathbf{2.04}$, $\sigma \approx \mathbf{1.15}$.

The exact distribution counts the 216 ordered triples:

$$P(x) = \dfrac{(7-x)^3 - (6-x)^3}{216}$$

with $\mu = 2.0417$, $\sigma = 1.144$.

The notes' remark: *$\mu$ gets smaller for more dice.*

## 4.2 Binomial distribution

```quiz
[
  { "q": "Online shoppers: $n = 50$ visitors, each completes a sale with $p = 0.25$. $P(X = 6)$ for the shoppers = ? (4 decimals)", "type": "numeric", "answer": 0.0123, "tolerance": 0.0001, "explain": "$$C(50, 6) · 0.25^6 · 0.75^{44} = 15\\,890\\,700 × 2.441 × 10^{−4} × 3.18 × 10^{−6} = \\mathbf{0.0123}$$ The exponent on q is n − x = 44, not x." }
]
```

**$P(X = 6)$ for the shoppers.** Conditions: fixed $n = 50$, sale or no sale, the same $p = 0.25$ for every visitor, visitors independent.

Substitute into the formula:

$$P(6) = C(50, 6)\,0.25^6\,0.75^{44} = 15\,890\,700 \times 2.441 \times 10^{-4} \times 3.18 \times 10^{-6} = \mathbf{0.0123}$$

R: `dbinom(6, 50, 0.25)` prints `0.01234465`.

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(6, 50, 0.25)` | `dbinom(x, size, prob)`, the binomial P(X = x): x = 6, size = 50 (n), prob = 0.25 (p). |

**Left to right**

- `dbinom(6, 50, 0.25)`: "The binomial probability of exactly (`dbinom`) 6 sales (`x = 6`) among 50 visitors (`size = 50`) at 0.25 each (`prob = 0.25`)."

**Right to left**, the order R runs it

- `dbinom(6, 50, 0.25)`: "Take x = 6, size = 50 and prob = 0.25, compute P(X = 6) (`dbinom`), and print it."
:::

```quiz
[
  { "q": "A fair die is rolled 5 times, $X$ = the number of 3s. $P(X = 0)$ for the number of 3s = ? (4 decimals)", "type": "numeric", "answer": 0.4019, "tolerance": 0.0001, "explain": "$$(5/6)^5 = \\mathbf{0.4019}$$ Every roll misses. C(5, 0) = 1 and (1/6)^0 = 1, so the formula collapses to q^n." },
  { "q": "$P(X = 2)$ for the number of 3s in 5 rolls = ? (4 decimals)", "type": "numeric", "answer": 0.1608, "tolerance": 0.0001, "explain": "$$C(5, 2)(1/6)^2(5/6)^3 = 10 × 0.02778 × 0.5787 = \\mathbf{0.1608}$$" }
]
```

**Rolling 3s, $n = 5$.** Check the conditions: five rolls, fixed; each roll is a 3 or not; $p = 1/6$ on every roll; rolls independent.

1. No 3s:
   $$P(0) = (5/6)^5 = \mathbf{0.4019}$$
2. One 3:
   $$P(1) = C(5,1)(1/6)(5/6)^4 = \mathbf{0.4019}$$
3. Two 3s:
   $$P(2) = C(5,2)(1/6)^2(5/6)^3 = \mathbf{0.1608}$$
4. Three, four and five 3s: $P(3) = 0.0322$, $P(4) = 0.0032$, $P(5) = 0.0001$

The six add to 1.0001 by rounding. R: `dbinom(0:5, 5, 1/6)`.

:::info R syntax
| Code | What it does |
|---|---|
| `0:5` | `a:b` is the whole numbers from a to b, so x is the six values 0 to 5 at once. |
| `dbinom(0:5, 5, 1/6)` | x = 0:5, size = 5 rolls (n), prob = 1/6 (p): returns all six probabilities in one vector. |

**Left to right**

- `dbinom(0:5, 5, 1/6)`: "The binomial probabilities (`dbinom`) of 0 to 5 threes (`0:5`) in 5 rolls (`size = 5`) at 1/6 each (`prob = 1/6`)."

**Right to left**, the order R runs it

- `dbinom(0:5, 5, 1/6)`: "Make 0 to 5 (`0:5`), divide 1 by 6 (`1/6`), compute P(X = x) for each of the six x values (`dbinom`), and print them."
:::

```quiz
[
  { "q": "Five cards drawn **with** replacement. P(exactly 2 Jacks) = ? (4 decimals)", "type": "numeric", "answer": 0.0465, "tolerance": 0.0001, "explain": "Binomial with n = 5, p = 4/52: $$C(5, 2)(4/52)^2(48/52)^3 = 10 × 0.005917 × 0.7865 = \\mathbf{0.0465}$$ Replacement keeps p at 4/52 on every draw." },
  { "q": "Five cards with replacement. P(at least 2 Jacks) = ? (4 decimals)", "type": "numeric", "answer": 0.0506, "tolerance": 0.0001, "explain": "$$1 − P(0) − P(1) = 1 − (48/52)^5 − 5(4/52)(48/52)^4 = 1 − 0.6702 − 0.2792 = \\mathbf{0.0506}$$ 'At least 2' is the complement of {0, 1}, not of {0}." }
]
```

**Jacks with replacement.**

1. Exactly 2:
   $$P(X = 2) = C(5,2)\,(4/52)^2\,(48/52)^3 = \mathbf{0.0465}$$
2. At least 2:
   $$P(X \ge 2) = 1 - (48/52)^5 - 5\,(4/52)(48/52)^4 = 1 - 0.6702 - 0.2792 = \mathbf{0.0506}$$

R: `dbinom(2, 5, 4/52)` prints `0.04654006`; `1 - pbinom(1, 5, 4/52)` prints `0.05058269`.

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(2, 5, 4/52)` | x = 2 jacks, size = 5 cards (n), prob = 4/52 (p). |
| `1 - pbinom(1, 5, 4/52)` | `pbinom(q, size, prob)` is P(X ≤ q), here q = 1; `1 -` subtracts it from 1, giving P(X ≥ 2). |

**Left to right**

- `dbinom(2, 5, 4/52)`: "The binomial probability of exactly (`dbinom`) 2 jacks (`x = 2`) in 5 cards (`size = 5`) at 4/52 (`prob = 4/52`)."
- `1 - pbinom(1, 5, 4/52)`: "One minus (`1 -`) the probability of at most (`pbinom`) 1 jack (`q = 1`) in 5 cards (`size = 5`) at 4/52 (`prob = 4/52`)."

**Right to left**, the order R runs it

- `dbinom(2, 5, 4/52)`: "Divide 4 by 52 (`4/52`), compute P(X = 2) for size 5 (`dbinom`), and print."
- `1 - pbinom(1, 5, 4/52)`: "Divide 4 by 52 (`4/52`), compute P(X ≤ 1) (`pbinom`), subtract it from 1 (`1 -`), and print."
:::

```quiz
[
  { "q": "Online shoppers: $\\sigma$ for $n = 50$, $p = 0.25$ = ? (2 decimals)", "type": "numeric", "answer": 3.06, "tolerance": 0.01, "explain": "$$\\sigma = \\sqrt{npq} = \\sqrt{50 × 0.25 × 0.75} = \\sqrt{9.375} = \\mathbf{3.06}$$ The mean is μ = np = 12.5. The histogram's centre and spread match." }
]
```

**Shoppers' $\mu$ and $\sigma$.**

1. Mean:
   $$\mu = np = 50(0.25) = \mathbf{12.5}$$
2. Standard deviation:
   $$\sigma = \sqrt{npq} = \sqrt{50(0.25)(0.75)} = \sqrt{9.375} = \mathbf{3.06}$$

R prints `12.5 3.0619`.

```quiz
[
  { "q": "Laser printers: 10 % need repair in the first year; 200 modified printers are followed. Assuming no effect, printers: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 4.24, "tolerance": 0.01, "explain": "$$\\mu = 200(0.1) = 20, \\quad \\sigma = \\sqrt{200 × 0.1 × 0.9} = \\sqrt{18} = \\mathbf{4.24}$$" },
  { "q": "14 of the 200 needed repair. Printers: $Z$ for 14 = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -1.41, "tolerance": 0.01, "explain": "$$Z = \\dfrac{14 − 20}{4.24} = \\mathbf{−1.41}$$ Not beyond −2, so 14 is not unusually low; the sample is consistent with the old 10 % rate." }
]
```

**Laser printers.**

1. (a) Mean and standard deviation:
   $$\mu = 200(0.1) = \mathbf{20}, \qquad \sigma = \sqrt{200(0.1)(0.9)} = \sqrt{18} = \mathbf{4.24}$$
2. (b) Z-score of 14:
   $$Z = \dfrac{14 - 20}{4.24} = -1.41$$
   Within $\pm 2$; tail check `pbinom(14, 200, 0.1)` = 0.093, above 0.025. R: `Z` prints `-1.414214`. **Not unusual**
3. (c) Good evidence of improvement? 14 repairs is what chance produces under the old rate. **No**

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(14, 200, 0.1)` | `pbinom(q, size, prob)`: q = 14, size = 200 (n), prob = 0.1 (p). It returns P(X ≤ 14), the left tail. |

**Left to right**

- `pbinom(14, 200, 0.1)`: "The binomial probability of at most (`pbinom`) 14 repairs (`q = 14`) among 200 printers (`size = 200`) at 0.1 each (`prob = 0.1`)."

**Right to left**, the order R runs it

- `pbinom(14, 200, 0.1)`: "Take q = 14, size = 200 and prob = 0.1, add up P(0) through P(14) (`pbinom`), and print."
:::

## 4.3 Hypergeometric distribution

```quiz
[
  { "q": "Five cards, 2 Jacks, without replacement = ? (4 decimals)", "type": "numeric", "answer": 0.0399, "tolerance": 0.0001, "explain": "$$\\dfrac{C(4, 2) C(48, 3)}{C(52, 5)} = \\dfrac{6 × 17\\,296}{2\\,598\\,960} = \\mathbf{0.0399}$$ The binomial gives 0.0465. The failures slot C(48, 3) counts the 3 non-Jacks." },
  { "q": "A superdeck of 10 decks ($N = 520$, $K = 40$, $n = 5$). P(2 Jacks) without replacement = ? (4 decimals)", "type": "numeric", "answer": 0.0460, "tolerance": 0.0001, "explain": "$$\\dfrac{C(40, 2) C(480, 3)}{C(520, 5)} = \\mathbf{0.0460}$$ The binomial with p = 40/520 = 4/52 is still 0.0465. n/N fell from 9.6 % to 0.96 %, so the two agree." }
]
```

**Jacks: hypergeometric vs binomial.**

1. One deck, without replacement:
   $$P(X = 2) = \dfrac{C(4,2)\,C(48,3)}{C(52,5)} = \dfrac{6 \times 17\,296}{2\,598\,960} = \mathbf{0.0399}$$
   `dhyper(2, 4, 48, 5)` prints `0.03992982`, against the with-replacement **0.0465**.
2. Superdeck:
   $$P(X = 2) = \dfrac{C(40,2)\,C(480,3)}{C(520,5)} = \mathbf{0.0460}$$
   `dhyper(2, 40, 480, 5)` prints `0.04597`; the binomial with $p = 40/520 = 4/52$ is still 0.0465.

The gap closed because $n/N$ fell from $5/52 = 9.6\%$ to $5/520 = 0.96\%$: the 5 % rule.

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(2, 4, 48, 5)` | `dhyper(x, m, n, k)`: x = 2 jacks, m = 4 jacks in the deck, n = 48 non-jacks, k = 5 cards drawn. R's `n` is the failures, not the sample size. |
| `dhyper(2, 40, 480, 5)` | The same slots for the superdeck: m = 40 jacks, n = 480 non-jacks, k = 5. |

**Left to right**

- `dhyper(2, 4, 48, 5)`: "The hypergeometric probability (`dhyper`) of 2 jacks (`x = 2`) from a deck with 4 jacks (`m = 4`) and 48 other cards (`n = 48`) when 5 are drawn (`k = 5`)."
- `dhyper(2, 40, 480, 5)`: "The hypergeometric probability (`dhyper`) of 2 jacks (`x = 2`) from 40 jacks (`m = 40`) and 480 other cards (`n = 480`) when 5 are drawn (`k = 5`)."

**Right to left**, the order R runs it

- `dhyper(2, 4, 48, 5)`: "Take x = 2, m = 4, n = 48 and k = 5, compute P(X = 2) (`dhyper`), and print."
- `dhyper(2, 40, 480, 5)`: "Take x = 2, m = 40, n = 480 and k = 5, compute P(X = 2) (`dhyper`), and print."
:::

```quiz
[
  { "q": "Mac users: 90 students, 40 Mac users, sample of 10. Mac users: $P(X = 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2539, "tolerance": 0.0001, "explain": "$$\\dfrac{C(40, 4) C(50, 6)}{C(90, 10)} = \\dfrac{91\\,390 × 15\\,890\\,700}{5.7206 × 10^{12}} = \\mathbf{0.2539}$$ n/N = 11 % > 5 %, so the binomial is not an acceptable stand-in here." },
  { "q": "Mac users: $P(X \\le 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.5189, "tolerance": 0.0001, "explain": "$$P(0) + … + P(4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = \\mathbf{0.5189}$$ In R, phyper(4, 40, 50, 10)." },
  { "q": "Mac users: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.44, "tolerance": 0.01, "explain": "$$\\mu = nK/N = 10 × 40/90 = \\mathbf{4.44}$$" },
  { "q": "Mac users: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.49, "tolerance": 0.01, "explain": "$$\\sigma^2 = 10 × (40/90)(50/90)(80/89) = 2.2194, \\quad \\sigma = \\mathbf{1.49}$$ The binomial would say: $$\\sqrt{10 × 0.444 × 0.556} = 1.57$$ The factor (N − n)/(N − 1) = 80/89 shrinks it." },
  { "q": "Mac users: $Z$ for $X = 8$ = ? (2 decimals)", "type": "numeric", "answer": 2.39, "tolerance": 0.01, "explain": "$$Z = \\dfrac{8 − 4.44}{1.49} = \\mathbf{2.39}$$ Beyond 2: unusual. The tail agrees: P(X ≥ 8) = 0.019 < 0.025." }
]
```

**Mac users, $N = 90$, $K = 40$, $n = 10$.**

1. (a) Exactly 4:
   $$P(X = 4) = \dfrac{C(40,4)\,C(50,6)}{C(90,10)} = \dfrac{91\,390 \times 15\,890\,700}{5.7206 \times 10^{12}} = \mathbf{0.2539}$$
   R: `dhyper(4, 40, 50, 10)` prints `0.2538614`.
2. (b) At most 4:
   $$P(X \le 4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = \mathbf{0.5189}$$
   R: `phyper(4, 40, 50, 10)` prints `0.5188862`.
3. (c) Mean and standard deviation:
   $$\mu = 10 \cdot \tfrac{40}{90} = \mathbf{4.44}, \qquad \sigma^2 = 10 \cdot \tfrac{40}{90} \cdot \tfrac{50}{90} \cdot \tfrac{80}{89} = 2.2194, \qquad \sigma = \mathbf{1.49}$$
   R: `c(mu, sig)` prints `4.4444 1.4898`.
4. (d) The histogram peaks at 4 (0.2539), then 5 (0.2437). **Mode 4**
5. (e) Z-score of 8:
   $$Z = \dfrac{8 - 4.44}{1.49} = 2.39$$
   Beyond 2. R tail: `1 - phyper(7, 40, 50, 10)` = 0.019. **Unusual**

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(4, 40, 50, 10)` | x = 4, m = 40 Mac users, n = 50 others (R's n is the failures), k = 10 sampled. |
| `phyper(4, 40, 50, 10)` | `phyper(q, m, n, k)`: the same slots with q = 4, giving P(X ≤ 4). |
| `c(mu, sig)` | `c()` combines the stored `mu` and `sig` so they print on one line. |
| `1 - phyper(7, 40, 50, 10)` | P(X ≤ 7) subtracted from 1 (`1 -`): P(X ≥ 8), the right tail. |

**Left to right**

- `dhyper(4, 40, 50, 10)`: "The hypergeometric probability (`dhyper`) of 4 Mac users (`x = 4`) with 40 Mac users (`m = 40`) and 50 others (`n = 50`) in the class and 10 sampled (`k = 10`)."
- `phyper(4, 40, 50, 10)`: "The probability of at most (`phyper`) 4 Mac users (`q = 4`) with the same 40, 50 and 10 (`m`, `n`, `k`)."
- `c(mu, sig)`: "Combine (`c`) mu and sig (`mu`, `sig`)."
- `1 - phyper(7, 40, 50, 10)`: "One minus (`1 -`) the probability of at most (`phyper`) 7 Mac users (`q = 7`) with 40, 50 and 10 (`m`, `n`, `k`)."

**Right to left**, the order R runs it

- `dhyper(4, 40, 50, 10)`: "Take x, m, n and k, compute P(X = 4) (`dhyper`), and print."
- `phyper(4, 40, 50, 10)`: "Take q, m, n and k, add up P(0) through P(4) (`phyper`), and print."
- `c(mu, sig)`: "Look up mu and sig (`mu`, `sig`), put them in one vector (`c`), and print."
- `1 - phyper(7, 40, 50, 10)`: "Add up P(0) through P(7) (`phyper`), subtract from 1 (`1 -`), and print."
:::

## 4.4 Geometric distribution

```quiz
[
  { "q": "A help line is busy 75 % of the time. Help line: $P(X = 3)$, access on exactly the third call = ? (4 decimals)", "type": "numeric", "answer": 0.1406, "tolerance": 0.0001, "explain": "Two failures then a success, q^(x−1) p with x = 3: $$0.75 × 0.75 × 0.25 = \\mathbf{0.1406}$$ The exponent on q is 2, not 3." },
  { "q": "Help line: $E[X]$, the expected number of calls = ? (integer)", "type": "numeric", "answer": 4, "tolerance": 0.01, "explain": "$$\\mu = 1/p = 1/0.25 = \\mathbf{4} \\text{ calls}$$" },
  { "q": "Help line: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 3.46, "tolerance": 0.01, "explain": "$$\\sigma^2 = q/p^2 = 0.75/0.0625 = 12, \\quad \\sigma = \\sqrt{12} = \\mathbf{3.46}$$" },
  { "q": "Help line: $P(X \\ge 4)$, at least four calls = ? (4 decimals)", "type": "numeric", "answer": 0.4219, "tolerance": 0.0001, "explain": "$$1 − P(1) − P(2) − P(3) = 1 − 0.25 − 0.1875 − 0.1406 = \\mathbf{0.4219}$$ That is 0.75³: the first three calls all fail." }
]
```

**Help line, $p = 0.25$.** R counts failures before the first success, so the lecture's $x$ is R's $x - 1$, and "at least $x$" is `1 - pgeom(x-2, p)`.

1. Access on the third call:
   $$P(3) = 0.75 \cdot 0.75 \cdot 0.25 = \mathbf{0.1406}$$
   R: `dgeom(2, 0.25)` prints `0.140625`.
2. Expected calls:
   $$E[X] = 1/0.25 = \mathbf{4} \text{ calls}$$
3. Standard deviation:
   $$\sigma = \sqrt{0.75/0.25^2} = \sqrt{12} = \mathbf{3.46}$$
4. At least four calls:
   $$P(X \ge 4) = 1 - 0.25 - 0.1875 - 0.1406 = 0.75^3 = \mathbf{0.4219}$$
   R: `1 - pgeom(2, 0.25)` prints `0.421875`.
5. Histogram: 0.25, 0.1875, 0.1406, 0.1055, 0.0791, … always decreasing, so the mode is 1 even though the mean is 4. **Mode 1**

:::info R syntax
| Code | What it does |
|---|---|
| `dgeom(2, 0.25)` | `dgeom(x, prob)`: x = 2 failures before the first success, prob = 0.25, which is the lecture's P(X = 3). |
| `1 - pgeom(2, 0.25)` | `pgeom(q, prob)` with q = 2 is the chance of at most 2 failures; `1 -` takes the complement. |

**Left to right**

- `dgeom(2, 0.25)`: "The geometric probability (`dgeom`) of exactly 2 failures before the first success (`x = 2`) at 0.25 per call (`prob = 0.25`)."
- `1 - pgeom(2, 0.25)`: "One minus (`1 -`) the probability of at most (`pgeom`) 2 failures (`q = 2`) at 0.25 per call (`prob = 0.25`)."

**Right to left**, the order R runs it

- `dgeom(2, 0.25)`: "Take x = 2 and prob = 0.25, compute the chance of 2 failures then a success (`dgeom`), and print."
- `1 - pgeom(2, 0.25)`: "Compute the chance of at most 2 failures (`pgeom`), subtract it from 1 (`1 -`), and print."
:::

## 4.5 Poisson distribution

```quiz
[
  { "q": "A web server gets one request every 2 seconds on average. Web server: $\\lambda$ for a one-minute interval = ?", "type": "numeric", "answer": 30, "tolerance": 0.01, "explain": "$$60 \\text{ s} / 2 \\text{ s} = \\mathbf{30} \\text{ requests per minute}$$ Rescale λ to the interval the question asks about before anything else." },
  { "q": "Web server: $P(X = 20)$ requests in a minute = ? (4 decimals)", "type": "numeric", "answer": 0.0134, "tolerance": 0.0001, "explain": "$$\\dfrac{30^{20} e^{−30}}{20!} = \\mathbf{0.0134}$$" },
  { "q": "Web server: $P(X \\le 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0353, "tolerance": 0.0001, "explain": "Cumulative: ppois(20, 30) = 0.0353; by hand it is the sum of 21 terms P(0) … P(20)." },
  { "q": "Web server: $Z$ for 20 requests = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -1.83, "tolerance": 0.01, "explain": "$$\\mu = 30, \\quad \\sigma = \\sqrt{30} = 5.48$$ $$Z = \\dfrac{20 − 30}{5.48} = \\mathbf{−1.83}$$ Within ±2: not unusual, and the tail 0.0353 > 0.025 agrees." }
]
```

**Web server.**

1. The mean for one minute:
   $$\lambda = 60/2 = \mathbf{30} \text{ per minute}$$
   R: `lambda <- 1/2 * 60`.
2. Exactly 20:
   $$P(X = 20) = \dfrac{30^{20}}{20!} e^{-30} = \mathbf{0.0134}$$
   R: `dpois(20, lambda)` prints `0.01341115`.
3. At most 20: $P(X \le 20)$. R: `ppois(20, lambda)` prints `0.03528462`. **0.0353**
4. Unusual?
   $$\mu = 30, \qquad \sigma = \sqrt{30} = 5.48, \qquad Z = \dfrac{20 - 30}{5.48} = -1.83$$
   **Not unusual**
5. The histogram `dpois(0:80, 30)` peaks at 29 and 30 (0.0726 each), bell-shaped with a slight right skew. **Peak 29 and 30**

:::info R syntax
| Code | What it does |
|---|---|
| `lambda <- 1/2 * 60` | `<-` is assignment. `/` and `*` run left to right, (1/2) × 60, and the result is stored as `lambda`. |
| `dpois(20, lambda)` | `dpois(x, lambda)`: x = 20, lambda = the stored mean per minute. |
| `ppois(20, lambda)` | `ppois(q, lambda)`: q = 20, giving P(X ≤ 20). |
| `dpois(0:80, 30)` | `0:80` is the whole numbers 0 to 80, so x is 81 values at once, with lambda = 30. |

**Left to right**

- `lambda <- 1/2 * 60`: "Store under the name lambda (`lambda <-`) one half (`1/2`) times (`*`) 60."
- `dpois(20, lambda)`: "The Poisson probability of exactly (`dpois`) 20 requests (`x = 20`) with mean lambda (`lambda`)."
- `ppois(20, lambda)`: "The Poisson probability of at most (`ppois`) 20 requests (`q = 20`) with mean lambda (`lambda`)."
- `dpois(0:80, 30)`: "The Poisson probabilities (`dpois`) of 0 to 80 requests (`0:80`) with mean 30 (`lambda = 30`)."

**Right to left**, the order R runs it

- `lambda <- 1/2 * 60`: "Divide 1 by 2 (`1/2`), multiply by 60 (`* 60`), then store it as lambda (`lambda <-`)."
- `dpois(20, lambda)`: "Look up lambda (`lambda`), compute P(X = 20) (`dpois`), and print."
- `ppois(20, lambda)`: "Look up lambda (`lambda`), add up P(0) through P(20) (`ppois`), and print."
- `dpois(0:80, 30)`: "Make 0 to 80 (`0:80`), compute P(X = x) for each with mean 30 (`dpois`), and print the 81 values."
:::

:::info A complete answer line
Name the distribution and check its conditions, write the formula with the numbers substituted, show the arithmetic, and give 4 decimals for a probability and 2 for $\mu$, $\sigma$ or $Z$.

For example, write

$$C(40,4)\,C(50,6)/C(90,10) = 0.2539$$

not a bare 0.2539.
:::

```quiz
[
  { "q": "$x = 0, 1, 2, 3$ with $P(x) = 0.30, 0.35, 0.25, 0.10$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 1.15, "tolerance": 0.01, "explain": "$$0(0.30) + 1(0.35) + 2(0.25) + 3(0.10) = 0.35 + 0.50 + 0.30 = \\mathbf{1.15}$$" },
  { "q": "$x = 0, 1, 2, 3$ with $P(x) = 0.30, 0.35, 0.25, 0.10$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 0.96, "tolerance": 0.01, "explain": "$$\\sigma^2 = (1.15)^2(0.30) + (0.15)^2(0.35) + (0.85)^2(0.25) + (1.85)^2(0.10) = 0.3968 + 0.0079 + 0.1806 + 0.3423 = 0.9275$$ $$\\sigma = \\sqrt{0.9275} = \\mathbf{0.96}$$" },
  { "q": "Two fair dice, $X$ = the maximum of the two values: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.47, "tolerance": 0.01, "explain": "Mirror the minimum: P(x) = (2x − 1)/36, so P(6) = 11/36 and P(1) = 1/36. $$\\mu = \\dfrac{1 + 6 + 15 + 28 + 45 + 66}{36} = \\dfrac{161}{36} = \\mathbf{4.47} = 7 − 2.53$$" },
  { "q": "$X$ = the maximum of the two values: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.40, "tolerance": 0.01, "explain": "Flip both dice (x → 7 − x). The flipped pair's minimum is 7 minus the original maximum, so max has the same distribution as 7 − min: $$P_{\\max}(x) = P_{\\min}(7 − x) = \\dfrac{2x − 1}{36}, \\quad \\mu = 7 − 2.53 = 4.47$$ The spread is unchanged: σ = **1.40**." },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $P(X = 6)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0151, "tolerance": 0.0001, "explain": "$$C(40, 6)\\, 0.3^6\\, 0.7^{34} = 3\\,838\\,380 × 0.000729 × 5.41 × 10^{−6} = \\mathbf{0.0151}$$" },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 12, "tolerance": 0.01, "explain": "$$np = 40 × 0.3 = \\mathbf{12}$$" },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 2.90, "tolerance": 0.01, "explain": "$$\\sqrt{40 × 0.3 × 0.7} = \\sqrt{8.4} = \\mathbf{2.90}$$" },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $Z$ for $X = 18$ = ? (2 decimals)", "type": "numeric", "answer": 2.07, "tolerance": 0.01, "explain": "$$Z = \\dfrac{18 − 12}{2.90} = \\mathbf{2.07}$$ Beyond 2: 18 successes would be unusually high." },
  { "q": "A fair die is rolled 4 times. P(exactly two 6s), the number of 6s in 4 rolls = ? (4 decimals)", "type": "numeric", "answer": 0.1157, "tolerance": 0.0001, "explain": "$$C(4, 2)(1/6)^2(5/6)^2 = 6 × 0.02778 × 0.6944 = \\mathbf{0.1157}$$" },
  { "q": "Five cards with replacement: P(exactly 3 Kings) = ? (4 decimals)", "type": "numeric", "answer": 0.0039, "tolerance": 0.0001, "explain": "$$C(5, 3)(4/52)^3(48/52)^2 = 10 × 0.000455 × 0.8521 = \\mathbf{0.0039}$$" },
  { "q": "Five cards with replacement: P(at least 3 Kings) = ? (4 decimals)", "type": "numeric", "answer": 0.0040, "tolerance": 0.0001, "explain": "$$P(3) + P(4) + P(5) = 0.003878 + 0.000162 + 0.000003 = \\mathbf{0.0040}$$ Or 1 − pbinom(2, 5, 4/52). The complement of 'at least 3' is {0, 1, 2}." },
  { "q": "Five cards: P(exactly 3 Kings without replacement) = ? (4 decimals)", "type": "numeric", "answer": 0.0017, "tolerance": 0.0001, "explain": "$$\\dfrac{C(4, 3) C(48, 2)}{C(52, 5)} = \\dfrac{4 × 1128}{2\\,598\\,960} = \\mathbf{0.0017}$$ That is less than half the with-replacement 0.0039: n/N = 9.6 % fails the 5 % rule." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $P(X = 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2442, "tolerance": 0.0001, "explain": "$$\\dfrac{C(30, 4) C(50, 8)}{C(80, 12)} = \\dfrac{27\\,405 × 536\\,878\\,650}{6.0247 × 10^{13}} = \\mathbf{0.2442}$$ In R, dhyper(4, 30, 50, 12)." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $P(X \\le 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.5078, "tolerance": 0.0001, "explain": "$$P(0) + … + P(4) = 0.0020 + 0.0186 + 0.0742 + 0.1688 + 0.2442 = \\mathbf{0.5078}$$ Each term is C(30, x) C(50, 12 − x)/C(80, 12); phyper(4, 30, 50, 12)." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.5, "tolerance": 0.01, "explain": "$$nK/N = 12 × 30/80 = \\mathbf{4.50}$$" },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.56, "tolerance": 0.01, "explain": "$$\\sigma^2 = 12 (30/80)(50/80)(68/79) = 2.4209, \\quad \\sigma = \\mathbf{1.56}$$ The binomial would give 1.68; n/N = 15 % so the correction matters." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $Z$ for $X = 9$ = ? (2 decimals)", "type": "numeric", "answer": 2.89, "tolerance": 0.01, "explain": "$$Z = \\dfrac{9 − 4.5}{1.56} = \\mathbf{2.89}$$ Unusual." },
  { "q": "Geometric, $p = 0.2$: $P(X = 3)$ = ? (4 decimals)", "type": "numeric", "answer": 0.128, "tolerance": 0.0001, "explain": "$$0.8 × 0.8 × 0.2 = \\mathbf{0.1280}$$" },
  { "q": "Geometric, $p = 0.2$: $E[X]$ = ? (integer)", "type": "numeric", "answer": 5, "tolerance": 0.01, "explain": "$$1/p = 1/0.2 = \\mathbf{5} \\text{ trials}$$" },
  { "q": "Geometric, $p = 0.2$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 4.47, "tolerance": 0.01, "explain": "$$\\sqrt{0.8/0.04} = \\sqrt{20} = \\mathbf{4.47}$$" },
  { "q": "Geometric, $p = 0.2$: $P(X \\ge 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.512, "tolerance": 0.0001, "explain": "The first three trials all fail: $$q^3 = 0.8^3 = \\mathbf{0.512}$$ Equivalently: $$1 − 0.2 − 0.16 − 0.128 = 0.512$$" },
  { "q": "A server gets one request every 2.5 seconds on average. $\\lambda$ per minute = ?", "type": "numeric", "answer": 24, "tolerance": 0.01, "explain": "$$60/2.5 = \\mathbf{24} \\text{ requests per minute}$$" },
  { "q": "Poisson, $\\lambda = 24$: $P(X = 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0624, "tolerance": 0.0001, "explain": "$$\\dfrac{24^{20}}{20!} = \\dfrac{4.020 × 10^{27}}{2.433 × 10^{18}} = 1.652 × 10^9$$ Multiply by e^(−24) = 3.775 × 10⁻¹¹: $$1.652 × 10^9 × 3.775 × 10^{−11} = \\mathbf{0.0624}$$ In R, dpois(20, 24)." },
  { "q": "Poisson, $\\lambda = 24$: $P(X \\le 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2426, "tolerance": 0.0001, "explain": "ppois(20, 24) = 0.2426." },
  { "q": "Poisson, $\\lambda = 24$: $Z$ for 20 requests = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -0.82, "tolerance": 0.01, "explain": "$$\\sigma = \\sqrt{24} = 4.90, \\quad Z = \\dfrac{20 − 24}{4.90} = \\mathbf{−0.82}$$ Not unusual; the left tail 0.2426 is far above 0.025." }
]
```

## The changed-numbers problems in the widgets

```widget
pmf-table
{ "rows": [[0, "0.30"], [1, "0.35"], [2, "0.25"], [3, "0.10"]], "simulate": false, "presets": false, "title": "The changed table: P(x) = 0.30, 0.35, 0.25, 0.10 on x = 0 to 3" }
```

```widget
binomial-calc
{ "n": 40, "p": 0.3, "x": 18, "op": "eq", "title": "Binomial n = 40, p = 0.3: P(X = x), μ, σ and Z for the chosen x" }
```

```widget
hyper-vs-binom
{ "N": 80, "K": 30, "n": 12, "x": 4, "zx": 9, "title": "Hypergeometric N = 80, K = 30, n = 12 beside the binomial with p = 30/80" }
```
