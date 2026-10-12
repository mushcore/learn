---
title: Every lecture example, worked
minutes: 35
---

The Unit 5 notes were posted with every answer line blank. Each example part is here in the order it appears, pp. 75 to 85: answer it first in the box, then compare with the arithmetic that belongs on the answer line and the R check. The closing quiz is the same problems with the numbers changed.

:::info Computed answers
Every value is computed from the formulas and checked in R, with a left-tail $P(Z \le z)$ table assumed for the normal parts. The in-class numbers replace these if they differ.
:::

## 5.1 The bus comes every twenty minutes (p. 75)

$T$ is uniform on $[0, 20]$: a flat density of height $1/20 = 0.05$, so an interval's probability is its length over 20.

```quiz
[
  { "q": "A bus arrives exactly once every twenty minutes. P(you wait between 8 and 11 minutes)? (2 decimals)", "type": "numeric", "answer": 0.15, "tolerance": 0.005, "explain": "$(11 - 8)/20 = 3/20 = 0.15$." }
]
```

**(a)** $P(8 \le T \le 11) = \dfrac{11 - 8}{20} = \dfrac{3}{20} = 0.15$.

```quiz
[
  { "q": "Bus every twenty minutes: P(you wait more than 12 minutes)? (2 decimals)", "type": "numeric", "answer": 0.40, "tolerance": 0.005, "explain": "The interval is 12 to 20, length 8: $8/20 = 0.40$. Not 12/20." }
]
```

**(b)** $P(T > 12) = \dfrac{20 - 12}{20} = \dfrac{8}{20} = 0.40$.

```quiz
[
  { "q": "Bus every twenty minutes: P(you wait exactly 4 minutes)?", "type": "numeric", "answer": 0, "tolerance": 0.0001, "explain": "A single point has no width, so its area under the density is 0. True for every continuous variable." }
]
```

**(c)** $P(T = 4) = 0$. The mean and standard deviation, not asked in the notes: $\mu = (0 + 20)/2 = 10$ min, $\sigma = 20/\sqrt{12} = 5.77$ min.

```r
punif(11, 0, 20) - punif(8, 0, 20);  1 - punif(12, 0, 20);  punif(4, 0, 20) - punif(4, 0, 20)
```

```text
[1] 0.15
[1] 0.4
[1] 0
```

## The standard normal Z (p. 79)

```quiz
[
  { "q": "$P(Z \\le -1.96)$? (4 decimals)", "type": "numeric", "answer": 0.0250, "tolerance": 0.0002, "explain": "Row −1.9, column .06 of the left-tail table: 0.0250. R: 0.0249979." }
]
```

**(a)** $P(Z \le -1.96) = 0.0250$, read directly from the table.

```quiz
[
  { "q": "$P(Z > +2.33)$? (4 decimals)", "type": "numeric", "answer": 0.0099, "tolerance": 0.0002, "explain": "Right tail: $1 - P(Z \\le 2.33) = 1 - 0.9901 = 0.0099$." }
]
```

**(b)** $P(Z > 2.33) = 1 - P(Z \le 2.33) = 1 - 0.9901 = 0.0099$.

```quiz
[
  { "q": "$P(0.55 \\le Z \\le 1.10)$? (4 decimals)", "type": "numeric", "answer": 0.1555, "tolerance": 0.0002, "explain": "Upper minus lower: $0.8643 - 0.7088 = 0.1555$." }
]
```

**(c)** $P(0.55 \le Z \le 1.10) = P(Z \le 1.10) - P(Z \le 0.55) = 0.8643 - 0.7088 = 0.1555$.

```r
pnorm(-1.96);  1 - pnorm(2.33);  pnorm(1.10) - pnorm(0.55)
```

```text
[1] 0.0249979
[1] 0.009903076
[1] 0.1554936
```

## IQ below 120, $X \sim N(100, 15^2)$ (p. 80)

```quiz
[
  { "q": "IQ is $N(100, 15^2)$. The notes print `pnorm(120, 100, 15)`. What does it return, the probability an IQ is below 120? (4 decimals)", "type": "numeric", "answer": 0.9088, "tolerance": 0.0007, "explain": "R: 0.9087888. With the table, $Z = 20/15 = 1.33$ gives 0.9082; the two differ because R keeps $Z = 1.3333$." }
]
```

**(a) In R:** `pnorm(120, 100, 15)` prints `0.9087888`. The $15^2$ in $N(100, 15^2)$ is the variance; the standard deviation passed to `pnorm` is 15.

**(b) With the Z table:** $Z = \dfrac{120 - 100}{15} = \dfrac{20}{15} = 1.33$; $P(Z \le 1.33) = 0.9082$. R's 0.9088 comes from the unrounded $Z = 1.3333$; either is accepted when the method is shown.

## Cosmic radiation, $\mu = 4.35$, $\sigma = 0.500$ mrem (p. 81)

```quiz
[
  { "q": "Radiation on a trans-Canada flight is normal with $\\mu = 4.35$, $\\sigma = 0.5$ mrem. $P(4.35 \\le X \\le 5.00)$? (4 decimals)", "type": "numeric", "answer": 0.4032, "tolerance": 0.0002, "explain": "$Z$ runs from 0 to $(5.00 - 4.35)/0.5 = 1.30$: $0.9032 - 0.5000 = 0.4032$." }
]
```

**(a)** $Z = \dfrac{5.00 - 4.35}{0.500} = 1.30$, and the lower end is the mean, $Z = 0$: $P(0 \le Z \le 1.30) = 0.9032 - 0.5000 = 0.4032$.

```quiz
[
  { "q": "Same flight: $P(X > 5.00)$, the probability of more than 5.00 mrem? (4 decimals)", "type": "numeric", "answer": 0.0968, "tolerance": 0.0002, "explain": "$1 - 0.9032 = 0.0968$; or $0.5 - 0.4032$ from part (a)." }
]
```

**(b)** $P(X > 5.00) = P(Z > 1.30) = 1 - 0.9032 = 0.0968$.

```quiz
[
  { "q": "Same flight: the 95th percentile of the radiation dose, in mrem? (2 decimals)", "type": "numeric", "answer": 5.17, "tolerance": 0.01, "explain": "Table backwards: 0.95 sits between 1.64 (0.9495) and 1.65 (0.9505), so $z = 1.645$; $x = 4.35 + 1.645(0.5) = 5.17$." }
]
```

**(c)** $P(Z \le z) = 0.95$ gives $z = 1.645$; un-standardize: $x = \mu + z\sigma = 4.35 + 1.645(0.500) = 5.17$ mrem.

```r
pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5);  1 - pnorm(5, 4.35, 0.5);  qnorm(0.95, 4.35, 0.5)
```

```text
[1] 0.4031995
[1] 0.09680048
[1] 5.172427
```

## Gaussian noise: a 0 bit read as a 1 (p. 82)

Bit 0 is sent as 2 V, bit 1 as 3 V; the receiver picks whichever level is closer, so the threshold is 2.5 V. Noise is normal with $\mu = 0$ V, $\sigma = 0.22$ V.

```quiz
[
  { "q": "Noise is Gaussian with $\\sigma = 0.22$ V; 0 is sent as 2 V, 1 as 3 V. P(a sent 0 is received as a 1)? (4 decimals)", "type": "numeric", "answer": 0.0116, "tolerance": 0.0002, "explain": "Misread when the noise exceeds 0.5 V: $Z = 0.5/0.22 = 2.27$; $1 - 0.9884 = 0.0116$. R with the unrounded Z: 0.0115." }
]
```

A sent 0 is misread when the noise pushes 2 V past 2.5 V, that is when $N > 0.5$: $Z = \dfrac{0.5 - 0}{0.22} = 2.27$; $P(Z > 2.27) = 1 - 0.9884 = 0.0116$. About 1.2 % of 0 bits flip; by symmetry a sent 1 is misread with the same probability.

```r
1 - pnorm(0.5, 0, 0.22);  1 - pnorm(2.27)
```

```text
[1] 0.01152131
[1] 0.01160379
```

## 5.3 Web server, average wait 2.5 s (pp. 83–84)

```quiz
[
  { "q": "The wait between http requests is exponential with mean 2.5 s. The pdf for $X$ is...", "options": ["$f(x) = 2.5\\,e^{-2.5x}$", "$f(x) = 0.4\\,e^{-0.4x}$, $x \\ge 0$", "$f(x) = 1 - e^{-x/2.5}$", "$f(x) = 0.4\\,e^{-2.5x}$"], "answer": 1, "explain": "$\\beta = 2.5$: $\\frac{1}{2.5} e^{-x/2.5} = 0.4\\,e^{-0.4x}$. Option 2 is $F(x)$." }
]
```

**(a)** $\beta = 2.5$: $f(x) = \dfrac{1}{2.5} e^{-x/2.5} = 0.4\,e^{-0.4x}$ for $x \ge 0$.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: $P(X \\le 4)$? (4 decimals)", "type": "numeric", "answer": 0.7981, "tolerance": 0.0005, "explain": "$1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$." }
]
```

**(b)** $P(X \le 4) = ∫_0^{4} 0.4\,e^{-0.4x}\,dx = 1 - e^{-1.6} = 1 - 0.2019 = 0.7981$.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: the standard deviation of $X$, in seconds?", "type": "numeric", "answer": 2.5, "tolerance": 0.01, "explain": "$\\sigma^2 = \\beta^2$, so $\\sigma = \\beta = 2.5$ s." }
]
```

**(c)** $\sigma = \beta = 2.5$ s.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: the cumulative function $F(x)$ is...", "options": ["$1 - e^{-x/2.5}$, $x \\ge 0$", "$0.4\\,e^{-0.4x}$", "$1 - e^{-2.5x}$", "$e^{-x/2.5}$"], "answer": 0, "explain": "$F(x) = 1 - e^{-x/\\beta}$ with $\\beta = 2.5$. $e^{-x/2.5}$ alone is $P(X > x)$." }
]
```

**(d)** $F(x) = 1 - e^{-x/2.5}$ for $x \ge 0$.

```quiz
[
  { "q": "Web server, $\\beta = 2.5$ s: use $F(x)$ to find the 95th percentile, in seconds. (2 decimals)", "type": "numeric", "answer": 7.49, "tolerance": 0.01, "explain": "$1 - e^{-x/2.5} = 0.95 \\Rightarrow x = -2.5 \\ln 0.05 = 7.49$ s." }
]
```

**(e)** $1 - e^{-x/2.5} = 0.95 \Rightarrow e^{-x/2.5} = 0.05 \Rightarrow x = -2.5 \ln 0.05 = 2.5 \times 2.9957 = 7.49$ s.

```r
pexp(4, rate = 1/2.5);  qexp(0.95, rate = 1/2.5)
```

```text
[1] 0.7981035
[1] 7.489331
```

## Bank teller, 30 customers per hour (p. 85)

The 30 per hour is a rate: $\beta = 60/30 = 2$ minutes per customer, $F(x) = 1 - e^{-x/2}$.

```quiz
[
  { "q": "A teller sees 30 customers per hour; service time is exponential. P(a customer takes between 1.5 and 2.5 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1859, "tolerance": 0.0005, "explain": "$\\beta = 2$ min: $e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = 0.1859$." }
]
```

**(a)** $P(1.5 \le X \le 2.5) = F(2.5) - F(1.5) = e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = 0.1859$.

```quiz
[
  { "q": "Same teller ($\\beta = 2$ min). Given the teller has already spent 1 minute with a customer, P(the service takes between 2.5 and 3.5 minutes in total)? (4 decimals)", "type": "numeric", "answer": 0.1859, "tolerance": 0.0005, "explain": "$\\dfrac{e^{-1.25} - e^{-1.75}}{e^{-0.5}} = \\dfrac{0.2865 - 0.1738}{0.6065} = 0.1859$, equal to (a) by the memoryless property: 2.5 to 3.5 in total is 1.5 to 2.5 more." }
]
```

**(b)** $P(2.5 \le X \le 3.5 \mid X > 1) = \dfrac{P(2.5 \le X \le 3.5)}{P(X > 1)} = \dfrac{e^{-1.25} - e^{-1.75}}{e^{-0.5}} = \dfrac{0.2865 - 0.1738}{0.6065} = 0.1859$. The same as (a): the exponential is memoryless, so the remaining 1.5 to 2.5 minutes has a fresh customer's distribution.

```quiz
[
  { "q": "Same teller, 30 customers per hour: the 75th percentile of the service time, in minutes? (2 decimals)", "type": "numeric", "answer": 2.77, "tolerance": 0.01, "explain": "$1 - e^{-x/2} = 0.75 \\Rightarrow x = -2 \\ln 0.25 = 2.77$ min." }
]
```

**(c)** $1 - e^{-x/2} = 0.75 \Rightarrow e^{-x/2} = 0.25 \Rightarrow x = -2 \ln 0.25 = 2 \times 1.3863 = 2.77$ minutes.

```r
rate <- 0.5
pexp(2.5, rate) - pexp(1.5, rate);  (pexp(3.5, rate) - pexp(2.5, rate)) / (1 - pexp(1, rate));  qexp(0.75, rate)
```

```text
[1] 0.1858618
[1] 0.1858618
[1] 2.772589
```

:::quiz What the answer line must show
The formula in symbols, the numbers substituted, the intermediate values (the $Z$, the table value, the $e^{-x/\beta}$) and the final answer with its units. A bare 0.1859 earns less than $e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = 0.1859$.
:::

```quiz
[
  {
    "q": "The bus now comes every 15 minutes. P(you wait between 8 and 11 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2,
    "tolerance": 0.0005,
    "explain": "$T$ is uniform on $[0, 15]$: $(11 - 8)/15 = 3/15 = 0.2$."
  },
  {
    "q": "Bus every 15 minutes: P(you wait more than 12 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2,
    "tolerance": 0.0005,
    "explain": "$(15 - 12)/15 = 3/15 = 0.2$."
  },
  {
    "q": "Bus every 15 minutes: the mean wait $\\mu$, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 7.5,
    "tolerance": 0.01,
    "explain": "$(a + b)/2 = (0 + 15)/2 = 7.5$ min; $\\sigma = 15/\\sqrt{12} = 4.33$ min."
  },
  {
    "q": "Bus every 15 minutes: P(you wait exactly 7.5 minutes)?",
    "options": ["1/15", "0.5", "0", "7.5/15"],
    "answer": 2,
    "explain": "A point has zero width. 1/15 is the density height, not a probability."
  },
  {
    "q": "$P(Z \\le -1.28)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.1003,
    "tolerance": 0.0002,
    "explain": "Left tail read directly: 0.1003. By symmetry it equals $P(Z > 1.28) = 1 - 0.8997$."
  },
  {
    "q": "$P(-1.28 \\le Z \\le 1.28)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.7995,
    "tolerance": 0.0003,
    "explain": "$0.8997 - 0.1003 = 0.7994$ from the table (R: 0.7995): the middle 80 %."
  },
  {
    "q": "IQ is $N(100, 15^2)$. P(an IQ above 130)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0228,
    "tolerance": 0.0002,
    "explain": "$Z = (130 - 100)/15 = 2.00$; $1 - 0.9772 = 0.0228$."
  },
  {
    "q": "The noise standard deviation rises to $\\sigma = 0.30$ V (levels 2 V and 3 V, threshold 2.5 V). P(a sent 0 is read as 1)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0475,
    "tolerance": 0.0005,
    "explain": "$Z = 0.5/0.30 = 1.67$; $1 - 0.9525 = 0.0475$ (R with $Z = 1.6667$: 0.0478). More noise, four times the error rate of $\\sigma = 0.22$."
  },
  {
    "q": "A server's wait between requests is exponential with $\\beta = 4$ s. Which is the pdf?",
    "options": ["$f(x) = 4\\,e^{-4x}$", "$f(x) = 0.25\\,e^{-x/4}$, $x \\ge 0$", "$f(x) = 1 - e^{-x/4}$", "$f(x) = 0.25\\,e^{-4x}$"],
    "answer": 1,
    "explain": "$\\frac{1}{\\beta} e^{-x/\\beta}$ with $\\beta = 4$; $e^{-x/4} = e^{-0.25x}$."
  },
  {
    "q": "$\\beta = 4$ s: $P(X \\le 4)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.6321,
    "tolerance": 0.0005,
    "explain": "$1 - e^{-4/4} = 1 - e^{-1} = 1 - 0.3679 = 0.6321$. The probability of waiting less than the mean is always 0.6321 for an exponential."
  },
  {
    "q": "$\\beta = 4$ s: the standard deviation of $X$, in seconds?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "explain": "$\\sigma = \\beta$."
  },
  {
    "q": "$\\beta = 4$ s: the 95th percentile, in seconds? (2 decimals)",
    "type": "numeric",
    "answer": 11.98,
    "tolerance": 0.02,
    "explain": "$-4 \\ln 0.05 = 4 \\times 2.9957 = 11.98$ s."
  },
  {
    "q": "A teller now sees 20 customers per hour. The $\\beta$ of the service time, in minutes?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "explain": "$60/20 = 3$ minutes per customer; rate $1/3$ per minute."
  },
  {
    "q": "Teller, 20 customers per hour: P(a customer takes between 1.5 and 2.5 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1719,
    "tolerance": 0.0005,
    "explain": "$\\beta = 3$: $e^{-1.5/3} - e^{-2.5/3} = e^{-0.5} - e^{-0.8333} = 0.6065 - 0.4346 = 0.1719$."
  },
  {
    "q": "Teller, 20 customers per hour: the teller has already spent 1 minute with a customer. P(the service takes between 2.5 and 3.5 minutes in total)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1719,
    "tolerance": 0.0005,
    "explain": "Memoryless: the same as P(1.5 to 2.5 more) = 0.1719. Directly: $(e^{-0.8333} - e^{-1.1667})/e^{-0.3333} = (0.4346 - 0.3114)/0.7165 = 0.1719$."
  },
  {
    "q": "Teller, 20 customers per hour: the 75th percentile of the service time, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 4.16,
    "tolerance": 0.01,
    "explain": "$-3 \\ln 0.25 = 3 \\times 1.3863 = 4.16$ min."
  },
  {
    "q": "Which R line checks the teller's 75th percentile at 20 customers per hour?",
    "options": ["`qexp(0.75, 3)`", "`qexp(0.75, rate = 20)`", "`pexp(0.75, rate = 1/3)`", "`qexp(0.75, rate = 1/3)`"],
    "answer": 3,
    "explain": "q for a percentile and rate $= 1/\\beta = 1/3$ per minute. `qexp(0.75, 3)` uses rate 3 (mean 20 s) and returns 0.46."
  }
]
```
