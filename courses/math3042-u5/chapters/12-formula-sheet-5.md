---
title: Formula sheet (Unit 5)
minutes: 8
---

Everything from Unit 5 on one page: the definitions, the three distributions side by side, the Z-table reading patterns, the worked numbers from the notes and the R. No new explanations here; if a line does not make sense, go back to its lesson. Every worked number is computed from blank notes; the in-class values replace them.

## Definitions

| Term | Meaning |
|---|---|
| continuous random variable | takes values on an interval of the real number line; uncountably infinite possible values |
| $P(X = x) = 0$ | a single point has no width, so no area; $P(X \le b) = P(X < b)$ |
| probability density function $f(x)$ | $P(X \le b) = ∫_{-\infty}^{b} f(x)\,dx$: probabilities are areas under $f$ |
| cumulative probability function | $F(x) = P(X \le x) = ∫_{-\infty}^{x} f(t)\,dt$ |
| percentile $x_p$ | the $x$ with $F(x_p) = p$ |

## Properties of a pdf

| Property | Statement |
|---|---|
| 1. total area | $F(+\infty) = ∫_{-\infty}^{+\infty} f(x)\,dx = 1$ |
| 2. positivity | $f(x) \ge 0$ for all $x$ |
| 3. interval | $P(a \le X \le b) = ∫_a^b f(x)\,dx = F(b) - F(a)$ |
| mean, variance | $\mu = ∫ x\,f(x)\,dx$, $\sigma^2 = ∫ (x - \mu)^2 f(x)\,dx$ (the Unit 4 sums with ∫ for Σ) |

Heights are not probabilities: the uniform's $1/(b - a)$ and the exponential's $f(0) = 1/\beta$ can exceed 1.

## The three distributions

| | Uniform on $[a, b]$ | Normal $N(\mu, \sigma^2)$ | Exponential, mean $\beta$ |
|---|---|---|---|
| models | equally likely over an interval (bus wait) | heights, IQ, noise | waiting time in a memory-less system |
| pdf | $f(x) = \dfrac{1}{b - a}$, $a \le x \le b$ | $f(x) = \dfrac{e^{-\frac12\left(\frac{x - \mu}{\sigma}\right)^2}}{\sigma\sqrt{2\pi}}$ | $f(x) = \dfrac{1}{\beta} e^{-x/\beta}$, $x \ge 0$ |
| $F(x)$ | $\dfrac{x - a}{b - a}$ | no closed form: table or `pnorm` | $1 - e^{-x/\beta}$ |
| $\mu$ | $\dfrac{a + b}{2}$ | $\mu$ | $\beta$ |
| $\sigma$ | $\dfrac{b - a}{\sqrt{12}}$ | $\sigma$ (the $\sigma^2$ in $N(\mu, \sigma^2)$ is the variance) | $\beta$ (mean = sd) |
| $P(c \le X \le d)$ | $\dfrac{d - c}{b - a}$ | $P\!\left(\frac{c - \mu}{\sigma} \le Z \le \frac{d - \mu}{\sigma}\right)$ | $e^{-c/\beta} - e^{-d/\beta}$ |
| $P(X > x)$ | $\dfrac{b - x}{b - a}$ | $1 - P(Z \le z)$ | $e^{-x/\beta}$ |
| percentile $x_p$ | $a + p(b - a)$ | $\mu + z_p\sigma$, $z_p$ from the table backwards | $-\beta \ln(1 - p)$ |
| R area | `punif(x, a, b)` | `pnorm(x, mu, sigma)`, `pnorm(z)` | `pexp(x, rate = 1/beta)` |
| R percentile | `qunif(p, a, b)` | `qnorm(p, mu, sigma)`, `qnorm(p)` | `qexp(p, rate = 1/beta)` |
| memoryless | | | $P(X > s + t \mid X > s) = P(X > t)$ |

Rate to $\beta$: 30 customers per hour is $\beta = 60/30 = 2$ min; R's `rate` is $1/\beta$, never $\beta$.

## Normal: shape and the Z table

Bell shaped; symmetric about $\mu$; distance from centre to inflection point is $\sigma$. $\mu$ up shifts right, $\mu$ down shifts left; $\sigma$ up is wider and shorter, $\sigma$ down taller and narrower. No elementary antiderivative of $e^{-x^2}$, so areas come from the table of $P(Z \le z)$ ($\mu = 0$, $\sigma = 1$). Key idea: $Z = \dfrac{X - \mu}{\sigma}$ is standard normal.

| Pattern | Read | Example |
|---|---|---|
| left tail $P(Z \le z)$ | directly, row = first decimal, column = second | $P(Z \le -1.96) = 0.0250$ |
| right tail $P(Z > z)$ | $1 -$ the table value | $P(Z > 2.33) = 1 - 0.9901 = 0.0099$ |
| between | upper value minus lower value | $P(0.55 \le Z \le 1.10) = 0.8643 - 0.7088 = 0.1555$ |
| from the mean | table value minus 0.5000 | $P(0 \le Z \le 1.30) = 0.9032 - 0.5 = 0.4032$ |
| symmetry | $P(Z \le -z) = P(Z \ge z)$ | $P(Z \le -1.28) = P(Z > 1.28) = 0.1003$ |
| backwards (percentile) | find the area in the body, read $z$ from the margins; then $x = \mu + z\sigma$ | 0.95 is between 1.64 and 1.65: $z = 1.645$ |

| $z$ | 0.50 | 1.00 | 1.28 | 1.33 | 1.50 | 1.645 | 1.96 | 2.00 | 2.33 | 2.576 | 3.00 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $P(Z \le z)$ | 0.6915 | 0.8413 | 0.8997 | 0.9082 | 0.9332 | 0.9500 | 0.9750 | 0.9772 | 0.9901 | 0.9950 | 0.9987 |
| upper tail | 0.3085 | 0.1587 | 0.1003 | 0.0918 | 0.0668 | 0.0500 | 0.0250 | 0.0228 | 0.0099 | 0.0050 | 0.0013 |

The five to remember for the one-page note: 1.28 (90 %), 1.645 (95 %), 1.96 (97.5 %), 2.33 (99 %), 2.576 (99.5 %) below.

## The worked numbers

| Example | Answer |
|---|---|
| bus every 20 min: 8 to 11, more than 12, exactly 4 | $3/20 = 0.15$; $8/20 = 0.40$; $0$ ($\mu = 10$, $\sigma = 5.77$) |
| $P(Z \le -1.96)$, $P(Z > 2.33)$, $P(0.55 \le Z \le 1.10)$ | $0.0250$; $1 - 0.9901 = 0.0099$; $0.8643 - 0.7088 = 0.1555$ |
| IQ $N(100, 15^2)$ below 120 | $Z = 20/15 = 1.33$: table $0.9082$; `pnorm(120, 100, 15)` = $0.9088$ (unrounded $Z$) |
| radiation $\mu = 4.35$, $\sigma = 0.5$: 4.35 to 5.00; above 5.00; 95th percentile | $Z = 1.30$: $0.9032 - 0.5 = 0.4032$; $1 - 0.9032 = 0.0968$; $4.35 + 1.645(0.5) = 5.17$ mrem |
| Gaussian noise $\sigma = 0.22$ V, levels 2 V and 3 V, threshold 2.5 V | $Z = 0.5/0.22 = 2.27$: $1 - 0.9884 = 0.0116$ (R 0.0115) |
| web server $\beta = 2.5$ s: pdf; $P(X \le 4)$; $\sigma$; $F(x)$; 95th percentile | $0.4\,e^{-0.4x}$; $1 - e^{-1.6} = 0.7981$; $2.5$; $1 - e^{-x/2.5}$; $-2.5 \ln 0.05 = 7.49$ s |
| teller 30 per hour ($\beta = 2$ min): 1.5 to 2.5; 2.5 to 3.5 given 1; 75th percentile | $e^{-0.75} - e^{-1.25} = 0.1859$; $(e^{-1.25} - e^{-1.75})/e^{-0.5} = 0.1859$ (memoryless); $-2 \ln 0.25 = 2.77$ min |

## R

| Call | Does |
|---|---|
| `punif(11, 0, 20) - punif(8, 0, 20)`, `1 - punif(12, 0, 20)` | uniform areas: 0.15, 0.4 |
| `pnorm(z)`, `1 - pnorm(z)`, `pnorm(z2) - pnorm(z1)` | Z table: left tail, right tail, between |
| `pnorm(x, mu, sigma)` | normal area without standardizing: `pnorm(120, 100, 15)` = 0.9087888 |
| `qnorm(p)`, `qnorm(p, mu, sigma)` | $z_p$ (`qnorm(0.95)` = 1.644854); the percentile in $x$ units (`qnorm(0.95, 4.35, 0.5)` = 5.172427) |
| `pexp(x, rate = 1/beta)`, `qexp(p, rate = 1/beta)` | exponential area and percentile: `pexp(4, 0.4)` = 0.7981035, `qexp(0.95, 0.4)` = 7.489331 |
| `dnorm`, `dexp`, `dunif` | density heights, for `curve(dnorm(x, 100, 15), 40, 160)` |
| `runif(n, a, b)`, `rnorm(n, mu, sigma)`, `rexp(n, rate)` | simulated draws; `mean(X <= 4)` estimates $P(X \le 4)$, `mean(X)` and `sd(X)` land near $\mu$ and $\sigma$ |

```quiz
[
  {"q": "Rapid fire: $P(X > x)$ for an exponential variable?", "options": ["$1 - e^{-x/\\beta}$", "$e^{-x/\\beta}$", "$\\frac{1}{\\beta} e^{-x/\\beta}$", "$-\\beta \\ln(1 - x)$"], "answer": 1, "explain": "The complement of $F(x) = 1 - e^{-x/\\beta}$."},
  {"q": "The $z$ with 95 % of the standard normal below it?", "options": ["1.28", "1.96", "1.645", "2.33"], "answer": 2, "explain": "0.9495 at 1.64 and 0.9505 at 1.65; the table-backwards value is 1.645. 1.96 leaves 2.5 % above."},
  {"q": "In $X \\sim N(100, 15^2)$ the 15 is the...", "type": "text", "answer": ["standard deviation", "sd", "sigma", "σ"], "explain": "The parentheses hold $\\mu$ and the variance $\\sigma^2$; the standard deviation is its square root, 15."},
  {"q": "The R argument that carries $1/\\beta$ in `pexp` and `qexp`?", "type": "text", "answer": ["rate", "rate = 1/beta", "rate=1/beta"], "explain": "`pexp(4, rate = 1/2.5)`; passing 2.5 itself describes a mean of 0.4."},
  {"q": "A uniform variable on $[a, b]$ has mean...", "options": ["$(a + b)/2$", "$(b - a)/2$", "$1/(b - a)$", "$(b - a)/\\sqrt{12}$"], "answer": 0, "explain": "The midpoint. $1/(b - a)$ is the height and $(b - a)/\\sqrt{12}$ the standard deviation."}
]
```
