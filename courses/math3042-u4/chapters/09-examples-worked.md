---
title: Every lecture example, worked
minutes: 35
---

Every lecture example in the order it appears: a numeric item first, then the arithmetic and the demo notebook's R check. The quiz at the end is the same problems with the numbers changed.

## 4.1 Mean and standard deviation of a random variable

```quiz
[
  { "q": "Fair die, $X$ = the number rolled. $\\mu$ = ? (1 decimal)", "type": "numeric", "answer": 3.5, "tolerance": 0.01, "explain": "μ = (1/6)(1 + 2 + 3 + 4 + 5 + 6) = 21/6 = 3.5. A sample of 100 rolls averaged 3.38; the sample mean wanders, μ does not." }
]
```

**Mean of a die roll.** $\mu = \tfrac16 \cdot 1 + \tfrac16 \cdot 2 + \cdots + \tfrac16 \cdot 6 = \tfrac{21}{6} = 3.5$. The notes' 100 simulated rolls gave **3.38**, a sample mean that approaches 3.5 as the number of rolls grows.

```quiz
[
  { "q": "Canadian family size: $P(x) = 0.4499, 0.2504, 0.2048, 0.0949$ for $x = 0, 1, 2, 3$. The mean number of children $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 0.94, "tolerance": 0.01, "explain": "0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0.2504 + 0.4096 + 0.2847 = 0.9447 = 0.94. E[X] is not a possible value of X; it is the long-run average." },
  { "q": "Same table: the standard deviation of the number of children $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.02, "tolerance": 0.01, "explain": "σ² = (0 − 0.94)²(0.4499) + (1 − 0.94)²(0.2504) + (2 − 0.94)²(0.2048) + (3 − 0.94)²(0.0949) = 0.3975 + 0.0009 + 0.2301 + 0.4027 = 1.03; σ = √1.03 = 1.02. Take the root of the sum, never the sum of roots." }
]
```

**Number of children.** $\mu = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0.9447 = \mathbf{0.94}$. $\sigma^2 = (0 - 0.94)^2 (0.4499) + (1 - 0.94)^2 (0.2504) + (2 - 0.94)^2 (0.2048) + (3 - 0.94)^2 (0.0949) = 1.03$; $\sigma = \sqrt{1.03} = \mathbf{1.02}$. R: `c(mu, sig)` prints `0.9447 1.0155`.

```quiz
[
  { "q": "Two fair dice, $X$ = the minimum of the two values, so $P(x) = 11/36, 9/36, 7/36, 5/36, 3/36, 1/36$ for $x = 1 \\ldots 6$. The minimum of two dice: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 2.53, "tolerance": 0.01, "explain": "(1·11 + 2·9 + 3·7 + 4·5 + 5·3 + 6·1)/36 = 91/36 = 2.53. The 11 cells with minimum 1 are the top row and left column of the 6 × 6 grid; each later L-shape has two fewer cells." },
  { "q": "The minimum of two dice: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.40, "tolerance": 0.01, "explain": "σ² = Σ (x − 2.53)² P(x) = (2.34)(11/36) + (0.28)(9/36) + (0.22)(7/36) + (2.16)(5/36) + (6.10)(3/36) + (12.04)(1/36) = 1.97; σ = √1.97 = 1.40." }
]
```

**Minimum of two dice.** From the 36-cell grid: 11 cells have minimum 1, 9 have minimum 2, then 7, 5, 3, 1 (in general $P(x) = (13 - 2x)/36$). $\mu = 1 \cdot \tfrac{11}{36} + 2 \cdot \tfrac{9}{36} + 3 \cdot \tfrac{7}{36} + 4 \cdot \tfrac{5}{36} + 5 \cdot \tfrac{3}{36} + 6 \cdot \tfrac{1}{36} = \tfrac{91}{36} = \mathbf{2.53}$. $\sigma^2 = (1 - 2.53)^2 \tfrac{11}{36} + \cdots + (6 - 2.53)^2 \tfrac{1}{36} = 1.97$, $\sigma = \mathbf{1.40}$. R prints `2.5278 1.4041`.

**Minimum of three dice, by simulation.** The demo's $10^5$ simulated triples give $\mu \approx \mathbf{2.04}$, $\sigma \approx \mathbf{1.15}$ (exact: $P(x) = ((7-x)^3 - (6-x)^3)/216$, $\mu = 2.0417$, $\sigma = 1.144$). The notes' remark: *$\mu$ gets smaller for more dice.*

## 4.2 Binomial distribution

```quiz
[
  { "q": "Online shoppers: $n = 50$ visitors, each completes a sale with $p = 0.25$. $P(X = 6)$ for the shoppers = ? (4 decimals)", "type": "numeric", "answer": 0.0123, "tolerance": 0.0001, "explain": "C(50, 6) · 0.25^6 · 0.75^44 = 15 890 700 × 2.441 × 10⁻⁴ × 3.18 × 10⁻⁶ = 0.0123. The exponent on q is n − x = 44, not x." }
]
```

**$P(X = 6)$ for the shoppers.** Conditions: fixed $n = 50$, sale or no sale, the same $p = 0.25$ for every visitor, visitors independent. $P(6) = C(50, 6)\,0.25^6\,0.75^{44} = 15\,890\,700 \times 2.441 \times 10^{-4} \times 3.18 \times 10^{-6} = \mathbf{0.0123}$. R: `dbinom(6, 50, 0.25)` prints `0.01234465`.

```quiz
[
  { "q": "A fair die is rolled 5 times, $X$ = the number of 3s. $P(X = 0)$ for the number of 3s = ? (4 decimals)", "type": "numeric", "answer": 0.4019, "tolerance": 0.0001, "explain": "(5/6)^5 = 0.4019: every roll misses. C(5, 0) = 1 and (1/6)^0 = 1, so the formula collapses to q^n." },
  { "q": "$P(X = 2)$ for the number of 3s in 5 rolls = ? (4 decimals)", "type": "numeric", "answer": 0.1608, "tolerance": 0.0001, "explain": "C(5, 2)(1/6)²(5/6)³ = 10 × 0.02778 × 0.5787 = 0.1608." }
]
```

**Rolling 3s, $n = 5$.** Check the conditions: five rolls, fixed; each roll is a 3 or not; $p = 1/6$ on every roll; rolls independent. Distribution: $P(0) = (5/6)^5 = 0.4019$, $P(1) = C(5,1)(1/6)(5/6)^4 = 0.4019$, $P(2) = C(5,2)(1/6)^2(5/6)^3 = 0.1608$, $P(3) = 0.0322$, $P(4) = 0.0032$, $P(5) = 0.0001$ (sum 1.0001 by rounding). R: `dbinom(0:5, 5, 1/6)`.

```quiz
[
  { "q": "Five cards drawn **with** replacement. P(exactly 2 Jacks) = ? (4 decimals)", "type": "numeric", "answer": 0.0465, "tolerance": 0.0001, "explain": "Binomial with n = 5, p = 4/52: C(5, 2)(4/52)²(48/52)³ = 10 × 0.005917 × 0.7865 = 0.0465. Replacement keeps p at 4/52 on every draw." },
  { "q": "Five cards with replacement. P(at least 2 Jacks) = ? (4 decimals)", "type": "numeric", "answer": 0.0506, "tolerance": 0.0001, "explain": "1 − P(0) − P(1) = 1 − (48/52)^5 − 5(4/52)(48/52)^4 = 1 − 0.6702 − 0.2792 = 0.0506. 'At least 2' is the complement of {0, 1}, not of {0}." }
]
```

**Jacks with replacement.** $P(X = 2) = C(5,2)\,(4/52)^2\,(48/52)^3 = \mathbf{0.0465}$; $P(X \ge 2) = 1 - (48/52)^5 - 5\,(4/52)(48/52)^4 = 1 - 0.6702 - 0.2792 = \mathbf{0.0506}$. R: `dbinom(2, 5, 4/52)` prints `0.04654006`; `1 - pbinom(1, 5, 4/52)` prints `0.05058269`.

```quiz
[
  { "q": "Online shoppers: $\\sigma$ for $n = 50$, $p = 0.25$ = ? (2 decimals)", "type": "numeric", "answer": 3.06, "tolerance": 0.01, "explain": "σ = √(npq) = √(50 × 0.25 × 0.75) = √9.375 = 3.06, with μ = np = 12.5. The histogram's centre and spread match." }
]
```

**Shoppers' $\mu$ and $\sigma$.** $\mu = np = 50(0.25) = \mathbf{12.5}$; $\sigma = \sqrt{npq} = \sqrt{50(0.25)(0.75)} = \sqrt{9.375} = \mathbf{3.06}$. R prints `12.5 3.0619`.

```quiz
[
  { "q": "Laser printers: 10 % need repair in the first year; 200 modified printers are followed. Assuming no effect, printers: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 4.24, "tolerance": 0.01, "explain": "μ = 200(0.1) = 20; σ = √(200 × 0.1 × 0.9) = √18 = 4.24." },
  { "q": "14 of the 200 needed repair. Printers: $Z$ for 14 = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -1.41, "tolerance": 0.01, "explain": "Z = (14 − 20)/4.24 = −1.41. Not beyond −2, so 14 is not unusually low; the sample is consistent with the old 10 % rate." }
]
```

**Laser printers.** (a) $\mu = 200(0.1) = \mathbf{20}$, $\sigma = \sqrt{200(0.1)(0.9)} = \sqrt{18} = \mathbf{4.24}$. (b) $Z = (14 - 20)/4.24 = \mathbf{-1.41}$: within $\pm 2$, **not unusual** (tail check: `pbinom(14, 200, 0.1)` = 0.093, above 0.025). (c) Good evidence of improvement? **No**: 14 repairs is what chance produces under the old rate. R: `Z` prints `-1.414214`.

## 4.3 Hypergeometric distribution

```quiz
[
  { "q": "Five cards, 2 Jacks, without replacement = ? (4 decimals)", "type": "numeric", "answer": 0.0399, "tolerance": 0.0001, "explain": "C(4, 2) C(48, 3)/C(52, 5) = 6 × 17 296/2 598 960 = 0.0399, against the binomial 0.0465. The failures slot C(48, 3) counts the 3 non-Jacks." },
  { "q": "A superdeck of 10 decks ($N = 520$, $K = 40$, $n = 5$). P(2 Jacks) without replacement = ? (4 decimals)", "type": "numeric", "answer": 0.0460, "tolerance": 0.0001, "explain": "C(40, 2) C(480, 3)/C(520, 5) = 0.0460; the binomial with p = 40/520 = 4/52 is still 0.0465. n/N fell from 9.6 % to 0.96 %, so the two agree." }
]
```

**Jacks: hypergeometric vs binomial.** $P(X = 2) = \dfrac{C(4,2)\,C(48,3)}{C(52,5)} = \dfrac{6 \times 17\,296}{2\,598\,960} = \mathbf{0.0399}$ (`dhyper(2, 4, 48, 5)` prints `0.03992982`), against the with-replacement $\mathbf{0.0465}$. **Superdeck**: $\dfrac{C(40,2)\,C(480,3)}{C(520,5)} = \mathbf{0.0460}$ (`dhyper(2, 40, 480, 5)` prints `0.04597`); binomial with $p = 40/520 = 4/52$ is still $0.0465$. The gap closed because $n/N$ fell from $5/52 = 9.6\%$ to $5/520 = 0.96\%$: the 5 % rule.

```quiz
[
  { "q": "Mac users: 90 students, 40 Mac users, sample of 10. Mac users: $P(X = 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2539, "tolerance": 0.0001, "explain": "C(40, 4) C(50, 6)/C(90, 10) = 91 390 × 15 890 700/5.7206 × 10¹² = 0.2539. n/N = 11 % > 5 %, so the binomial is not an acceptable stand-in here." },
  { "q": "Mac users: $P(X \\le 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.5189, "tolerance": 0.0001, "explain": "P(0) + … + P(4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = 0.5189; phyper(4, 40, 50, 10)." },
  { "q": "Mac users: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.44, "tolerance": 0.01, "explain": "μ = nK/N = 10 × 40/90 = 4.44." },
  { "q": "Mac users: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.49, "tolerance": 0.01, "explain": "σ² = 10 × (40/90)(50/90)(80/89) = 2.2194; σ = 1.49. The binomial would say √(10 × 0.444 × 0.556) = 1.57; the factor (N − n)/(N − 1) = 80/89 shrinks it." },
  { "q": "Mac users: $Z$ for $X = 8$ = ? (2 decimals)", "type": "numeric", "answer": 2.39, "tolerance": 0.01, "explain": "Z = (8 − 4.44)/1.49 = 2.39, beyond 2: unusual. The tail agrees: P(X ≥ 8) = 0.019 < 0.025." }
]
```

**Mac users, $N = 90$, $K = 40$, $n = 10$.** (a) $P(X = 4) = \dfrac{C(40,4)\,C(50,6)}{C(90,10)} = \dfrac{91\,390 \times 15\,890\,700}{5.7206 \times 10^{12}} = \mathbf{0.2539}$ (`dhyper(4, 40, 50, 10)` prints `0.2538614`). (b) $P(X \le 4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = \mathbf{0.5189}$ (`phyper(4, 40, 50, 10)` prints `0.5188862`). (c) $\mu = 10 \cdot \tfrac{40}{90} = \mathbf{4.44}$; $\sigma^2 = 10 \cdot \tfrac{40}{90} \cdot \tfrac{50}{90} \cdot \tfrac{80}{89} = 2.2194$, $\sigma = \mathbf{1.49}$ (`c(mu, sig)` prints `4.4444 1.4898`). (d) The histogram peaks at 4 (0.2539) then 5 (0.2437). (e) $Z = (8 - 4.44)/1.49 = \mathbf{2.39}$, beyond 2: **unusual** (`1 - phyper(7, 40, 50, 10)` = 0.019).

## 4.4 Geometric distribution

```quiz
[
  { "q": "A help line is busy 75 % of the time. Help line: $P(X = 3)$, access on exactly the third call = ? (4 decimals)", "type": "numeric", "answer": 0.1406, "tolerance": 0.0001, "explain": "Two failures then a success: 0.75 × 0.75 × 0.25 = q^(x−1) p with x = 3. The exponent on q is 2, not 3." },
  { "q": "Help line: $E[X]$, the expected number of calls = ? (integer)", "type": "numeric", "answer": 4, "tolerance": 0.01, "explain": "μ = 1/p = 1/0.25 = 4 calls." },
  { "q": "Help line: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 3.46, "tolerance": 0.01, "explain": "σ² = q/p² = 0.75/0.0625 = 12; σ = √12 = 3.46." },
  { "q": "Help line: $P(X \\ge 4)$, at least four calls = ? (4 decimals)", "type": "numeric", "answer": 0.4219, "tolerance": 0.0001, "explain": "1 − P(1) − P(2) − P(3) = 1 − 0.25 − 0.1875 − 0.1406 = 0.4219, which is 0.75³: the first three calls all fail." }
]
```

**Help line, $p = 0.25$.** $P(3) = 0.75 \cdot 0.75 \cdot 0.25 = \mathbf{0.1406}$. $E[X] = 1/0.25 = \mathbf{4}$ calls; $\sigma = \sqrt{0.75/0.25^2} = \sqrt{12} = \mathbf{3.46}$. $P(X \ge 4) = 1 - 0.25 - 0.1875 - 0.1406 = \mathbf{0.4219} = 0.75^3$. R counts failures before the first success, so the lecture's $x$ is R's $x - 1$: `dgeom(2, 0.25)` prints `0.140625`; `1 - pgeom(2, 0.25)` prints `0.421875`. The histogram, 0.25, 0.1875, 0.1406, 0.1055, 0.0791, … always decreasing, so the mode is 1 even though the mean is 4.

## 4.5 Poisson distribution

```quiz
[
  { "q": "A web server gets one request every 2 seconds on average. Web server: $\\lambda$ for a one-minute interval = ?", "type": "numeric", "answer": 30, "tolerance": 0.01, "explain": "60 s / 2 s = 30 requests per minute. Rescale λ to the interval the question asks about before anything else." },
  { "q": "Web server: $P(X = 20)$ requests in a minute = ? (4 decimals)", "type": "numeric", "answer": 0.0134, "tolerance": 0.0001, "explain": "30^20 e^(−30)/20! = 0.0134." },
  { "q": "Web server: $P(X \\le 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0353, "tolerance": 0.0001, "explain": "Cumulative: ppois(20, 30) = 0.0353; by hand it is the sum of 21 terms P(0) … P(20)." },
  { "q": "Web server: $Z$ for 20 requests = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -1.83, "tolerance": 0.01, "explain": "μ = 30, σ = √30 = 5.48; Z = (20 − 30)/5.48 = −1.83. Within ±2: not unusual, and the tail 0.0353 > 0.025 agrees." }
]
```

**Web server.** $\lambda = 60/2 = \mathbf{30}$ per minute (`lambda <- 1/2 * 60`). $P(X = 20) = \dfrac{30^{20}}{20!} e^{-30} = \mathbf{0.0134}$ (`dpois(20, lambda)` prints `0.01341115`). $P(X \le 20) = \mathbf{0.0353}$ (`ppois(20, lambda)` prints `0.03528462`). Unusual? $\mu = 30$, $\sigma = \sqrt{30} = 5.48$, $Z = (20 - 30)/5.48 = \mathbf{-1.83}$: **not unusual**. The histogram `dpois(0:80, 30)` peaks at 29 and 30 (0.0726 each), bell-shaped with a slight right skew.

:::info A complete answer line
Name the distribution and check its conditions, write the formula with the numbers substituted, show the arithmetic, and give 4 decimals for a probability and 2 for $\mu$, $\sigma$ or $Z$: $C(40,4)\,C(50,6)/C(90,10) = 0.2539$, not a bare 0.2539.
:::

```quiz
[
  { "q": "$x = 0, 1, 2, 3$ with $P(x) = 0.30, 0.35, 0.25, 0.10$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 1.15, "tolerance": 0.01, "explain": "0(0.30) + 1(0.35) + 2(0.25) + 3(0.10) = 0.35 + 0.50 + 0.30 = 1.15." },
  { "q": "$x = 0, 1, 2, 3$ with $P(x) = 0.30, 0.35, 0.25, 0.10$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 0.96, "tolerance": 0.01, "explain": "σ² = (1.15)²(0.30) + (0.15)²(0.35) + (0.85)²(0.25) + (1.85)²(0.10) = 0.3968 + 0.0079 + 0.1806 + 0.3423 = 0.9275; σ = 0.96." },
  { "q": "Two fair dice, $X$ = the maximum of the two values: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.47, "tolerance": 0.01, "explain": "Mirror the minimum: P(x) = (2x − 1)/36, so P(6) = 11/36 and P(1) = 1/36. μ = (1 + 6 + 15 + 28 + 45 + 66)/36 = 161/36 = 4.47 = 7 − 2.53." },
  { "q": "$X$ = the maximum of the two values: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.40, "tolerance": 0.01, "explain": "The maximum is 7 minus the minimum, so the spread is the same: σ = 1.40." },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $P(X = 6)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0151, "tolerance": 0.0001, "explain": "C(40, 6) 0.3^6 0.7^34 = 3 838 380 × 0.000729 × 5.41 × 10⁻⁶ = 0.0151." },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 12, "tolerance": 0.01, "explain": "np = 40 × 0.3 = 12." },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 2.90, "tolerance": 0.01, "explain": "√(40 × 0.3 × 0.7) = √8.4 = 2.90." },
  { "q": "Binomial, $n = 40$, $p = 0.3$: $Z$ for $X = 18$ = ? (2 decimals)", "type": "numeric", "answer": 2.07, "tolerance": 0.01, "explain": "(18 − 12)/2.90 = 2.07, beyond 2: 18 successes would be unusually high." },
  { "q": "A fair die is rolled 4 times. P(exactly two 6s), the number of 6s in 4 rolls = ? (4 decimals)", "type": "numeric", "answer": 0.1157, "tolerance": 0.0001, "explain": "C(4, 2)(1/6)²(5/6)² = 6 × 0.02778 × 0.6944 = 0.1157." },
  { "q": "Five cards with replacement: P(exactly 3 Kings) = ? (4 decimals)", "type": "numeric", "answer": 0.0039, "tolerance": 0.0001, "explain": "C(5, 3)(4/52)³(48/52)² = 10 × 0.000455 × 0.8521 = 0.0039." },
  { "q": "Five cards with replacement: P(at least 3 Kings) = ? (4 decimals)", "type": "numeric", "answer": 0.0040, "tolerance": 0.0001, "explain": "P(3) + P(4) + P(5) = 0.003878 + 0.000162 + 0.000003 = 0.0040; or 1 − pbinom(2, 5, 4/52). The complement of 'at least 3' is {0, 1, 2}." },
  { "q": "Five cards: P(exactly 3 Kings without replacement) = ? (4 decimals)", "type": "numeric", "answer": 0.0017, "tolerance": 0.0001, "explain": "C(4, 3) C(48, 2)/C(52, 5) = 4 × 1128/2 598 960 = 0.0017, less than half the with-replacement 0.0039: n/N = 9.6 % fails the 5 % rule." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $P(X = 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2442, "tolerance": 0.0001, "explain": "C(30, 4) C(50, 8)/C(80, 12) = 27 405 × 536 878 650/6.0247 × 10¹³ = 0.2442; dhyper(4, 30, 50, 12)." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $P(X \\le 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.5078, "tolerance": 0.0001, "explain": "phyper(4, 30, 50, 12) = 0.5078: the five terms P(0) … P(4) added." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 4.5, "tolerance": 0.01, "explain": "nK/N = 12 × 30/80 = 4.50." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.56, "tolerance": 0.01, "explain": "σ² = 12 (30/80)(50/80)(68/79) = 2.4209; σ = 1.56. The binomial would give 1.68; n/N = 15 % so the correction matters." },
  { "q": "Hypergeometric, $N = 80$, $K = 30$, $n = 12$: $Z$ for $X = 9$ = ? (2 decimals)", "type": "numeric", "answer": 2.89, "tolerance": 0.01, "explain": "(9 − 4.5)/1.56 = 2.89: unusual." },
  { "q": "Geometric, $p = 0.2$: $P(X = 3)$ = ? (4 decimals)", "type": "numeric", "answer": 0.128, "tolerance": 0.0001, "explain": "0.8 × 0.8 × 0.2 = 0.1280." },
  { "q": "Geometric, $p = 0.2$: $E[X]$ = ? (integer)", "type": "numeric", "answer": 5, "tolerance": 0.01, "explain": "1/p = 1/0.2 = 5 trials." },
  { "q": "Geometric, $p = 0.2$: $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 4.47, "tolerance": 0.01, "explain": "√(0.8/0.04) = √20 = 4.47." },
  { "q": "Geometric, $p = 0.2$: $P(X \\ge 4)$ = ? (4 decimals)", "type": "numeric", "answer": 0.512, "tolerance": 0.0001, "explain": "q³ = 0.8³ = 0.512: the first three trials all fail. Equivalently 1 − 0.2 − 0.16 − 0.128." },
  { "q": "A server gets one request every 2.5 seconds on average. $\\lambda$ per minute = ?", "type": "numeric", "answer": 24, "tolerance": 0.01, "explain": "60/2.5 = 24 requests per minute." },
  { "q": "Poisson, $\\lambda = 24$: $P(X = 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.0624, "tolerance": 0.0001, "explain": "24^20 e^(−24)/20! = 0.0624; dpois(20, 24)." },
  { "q": "Poisson, $\\lambda = 24$: $P(X \\le 20)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2426, "tolerance": 0.0001, "explain": "ppois(20, 24) = 0.2426." },
  { "q": "Poisson, $\\lambda = 24$: $Z$ for 20 requests = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -0.82, "tolerance": 0.01, "explain": "σ = √24 = 4.90; Z = (20 − 24)/4.90 = −0.82. Not unusual; the left tail 0.2426 is far above 0.025." }
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
