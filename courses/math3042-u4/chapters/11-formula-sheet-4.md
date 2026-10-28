---
title: Formula sheet (Unit 4)
minutes: 8
---

Everything from Unit 4 and Lab 5 on one page: the definitions, the general formulas, one row per distribution, the two rules, the worked numbers from the notes, and the R.

No new explanations here; if a line does not make sense, go back to its lesson.

## Definitions

| Term | Meaning |
|---|---|
| discrete random variable | a random variable with a *finite* or *countable* number of values (number of children: 0, 1, 2, …) |
| discrete probability distribution | gives $P(x)$ for every possible $x$, as a table, a probability histogram or a formula |
| requirements | $\sum P(x) = 1$ and $0 \le P(x) \le 1$ for each $x$ |
| parameters | the mean $\mu$ and standard deviation $\sigma$ of a random variable |
| expected value | $E[X] = \mu$; the limit of the sample mean (100 die rolls averaged 3.38; all rolls 3.5) |
| trial | a random experiment with two outcomes, "success" and "failure" (Win/Lose, Pass/Fail) |
| unusual | $\lvert Z \rvert > 2$ with $Z = (x - \mu)/\sigma$; equivalently a tail probability below 0.025 |

## Any discrete distribution

$$\mu = \sum_x x\,P(x) \qquad \sigma^2 = \sum_x (x - \mu)^2\,P(x) \qquad \sigma = \sqrt{\sigma^2}$$

Lay the table out as $x$, $P(x)$, $x P(x)$, $(x - \mu)^2 P(x)$; total the last two columns; root the second total.

| Example | $P(x)$ | $\mu$ | $\sigma$ |
|---|---|---|---|
| fair die | $1/6$ each | $21/6 = 3.5$ | $\sqrt{17.5/6} = 1.71$ |
| Canadian family size, $x = 0 \ldots 3$ | 0.4499, 0.2504, 0.2048, 0.0949 | $0.9447 = 0.94$ | $\sqrt{1.03} = 1.02$ |
| minimum of two dice, $x = 1 \ldots 6$ | $11, 9, 7, 5, 3, 1$ over 36, i.e. $(13 - 2x)/36$ | $91/36 = 2.53$ | $\sqrt{1.97} = 1.40$ |
| minimum of three dice (simulated, $10^5$ trials) | | $2.04$ | $1.15$ |

## The four named distributions

| | Binomial | Hypergeometric | Geometric | Poisson |
|---|---|---|---|---|
| $X$ is | successes in $n$ trials | successes in a sample of $n$ from $N$ objects with $K$ successes | trials to the first success: 1, 2, 3, … | occurrences in an interval |
| conditions | fixed $n$; success/failure; equal $p$; independent | without replacement from a finite population; $p$ changes; trials dependent | same trial assumptions as binomial, no fixed $n$ | uniform rate over the interval; independent; mean $\lambda$ known |
| $P(x)$ | $nCx\,p^x q^{n-x}$, $q = 1 - p$ | $\dfrac{C(K,x)\,C(N-K,\,n-x)}{C(N,n)}$ | $q^{x-1}\,p$ | $\dfrac{\lambda^x}{x!}\,e^{-\lambda}$ |
| $\mu$ | $np$ | $n\dfrac{K}{N}$ | $\dfrac{1}{p}$ | $\lambda$ |
| $\sigma^2$ | $npq$ | $n\dfrac{K}{N}\dfrac{N-K}{N}\dfrac{N-n}{N-1}$ | $\dfrac{1-p}{p^2}$ | $\lambda$ |
| R: $P(X = x)$ | `dbinom(x, n, p)` | `dhyper(x, K, N-K, n)` | `dgeom(x-1, p)` | `dpois(x, lambda)` |
| R: $P(X \le x)$ | `pbinom(x, n, p)` | `phyper(x, K, N-K, n)` | `pgeom(x-1, p)` | `ppois(x, lambda)` |
| R: $P(X \ge x)$ | `1 - pbinom(x-1, n, p)` | `1 - phyper(x-1, K, N-K, n)` | `1 - pgeom(x-2, p)` $= q^{x-1}$ | `1 - ppois(x-1, lambda)` |

Shortcuts:

$$P(X \ge x) = 1 - P(X \le x - 1)$$

In R that is `1 - p*(x-1, …)`, except the geometric, whose R count of failures makes it `1 - pgeom(x-2, p)`.

Geometric tails (the first $x - 1$ trials all fail):

$$P(X \ge x) = q^{x-1} \qquad P(X > x) = q^x$$

Combinations, on the Sharp as `n 2ndF nCr x`:

$$nCx = \dfrac{n!}{(n-x)!\,x!}$$

$e^{-\lambda}$ on the Sharp is `lambda +/- 2ndF e^x`.

**5 % rule**: if $n \le 0.05\,N$ the binomial with $p = K/N$ gives practically the same probabilities as the hypergeometric (superdeck: $5/520 = 0.96\%$, 0.0460 vs 0.0465).

At $n/N = 5/52 = 9.6\%$ or $10/90 = 11\%$ it does not (0.0399 vs 0.0465; $\sigma$ 1.49 vs 1.57).

**Unusual**: compute $\mu$ and $\sigma$ from the row above, then:

$$Z = \dfrac{x - \mu}{\sigma}$$

Beyond $\pm 2$ is unusual.

The tail check says the same. Low side: $P(X \le x)$ = `pbinom(x, …)` / `phyper(x, …)` / `ppois(x, …)`. High side: $P(X \ge x)$ = `1 - p*(x-1, …)` (geometric `x-2`). Unusual if below 0.025.

Not unusual means consistent with chance, not evidence of no effect.

**Poisson $\lambda$**: rescale to the interval asked about before substituting (1 per 2 s is $60/2 = 30$ per minute; 3 per hour is 1 per 20 minutes).

## Worked numbers from the notes

| Example | Answer |
|---|---|
| shoppers $n = 50$, $p = 0.25$: $P(X = 6)$ | $C(50,6)\,0.25^6\,0.75^{44} = 0.0123$ |
| shoppers $\mu$, $\sigma$ | $50(0.25) = 12.5$; $\sqrt{50(0.25)(0.75)} = \sqrt{9.375} = 3.06$ |
| 3s in 5 rolls, $p = 1/6$ | $P(0 \ldots 5)$ = 0.4019, 0.4019, 0.1608, 0.0322, 0.0032, 0.0001 |
| 2 Jacks in 5, with replacement | $C(5,2)(4/52)^2(48/52)^3 = 0.0465$ |
| at least 2 Jacks, with replacement | $1 - (48/52)^5 - 5(4/52)(48/52)^4 = 1 - 0.6702 - 0.2792 = 0.0506$ |
| printers $n = 200$, $p = 0.1$: $\mu$, $\sigma$, $Z(14)$ | $20$; $\sqrt{18} = 4.24$; $(14 - 20)/4.24 = -1.41$, not unusual, no good evidence of improvement |
| 2 Jacks in 5, without replacement | $C(4,2)\,C(48,3)/C(52,5) = 6 \cdot 17\,296/2\,598\,960 = 0.0399$ |
| superdeck $N = 520$, $K = 40$ | $C(40,2)\,C(480,3)/C(520,5) = 0.0460$; binomial still 0.0465 |
| Mac users $N = 90$, $K = 40$, $n = 10$: $P(4)$, $P(\le 4)$ | $C(40,4)\,C(50,6)/C(90,10) = 0.2539$; $0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = 0.5189$ |
| Mac users $\mu$, $\sigma$, $Z(8)$ | $10 \cdot 40/90 = 4.44$; $\sqrt{10 \cdot \frac{40}{90} \cdot \frac{50}{90} \cdot \frac{80}{89}} = \sqrt{2.2194} = 1.49$; $(8 - 4.44)/1.49 = 2.39$, unusual |
| help line $p = 0.25$: $P(3)$, $E[X]$, $\sigma$, $P(X \ge 4)$ | $0.75^2(0.25) = 0.1406$; $1/0.25 = 4$; $\sqrt{0.75/0.25^2} = \sqrt{12} = 3.46$; $1 - 0.25 - 0.1875 - 0.1406 = 0.75^3 = 0.4219$ |
| web server 1 per 2 s: $\lambda$, $P(20)$, $P(\le 20)$, $Z(20)$ | $30$ per minute; $30^{20} e^{-30}/20! = 0.0134$; $0.0353$; $(20 - 30)/5.48 = -1.83$, not unusual |

Histograms: binomial shoppers peaks at 12–13, nothing past 25; Mac users peaks at 4 then 5; geometric is always decreasing (mode 1, mean 4); Poisson $\lambda = 30$ peaks at 29–30, bell-shaped with a slight right skew.

Probability histogram in R: `barplot(p.vals, names.arg=X.vals, space=0, col="pink", xlab, ylab, main)`.

## R (demo notebook and Lab 5)

| Command | Does |
|---|---|
| `mu <- sum(X.vals*p.vals); sig <- sqrt(sum((X.vals-mu)^2*p.vals))` | $\mu$ and $\sigma$ from a table |
| `for (i in 1:m) { X.vals[i] <- min(sample(1:6, 3, replace=TRUE)) }; mean(X.vals); sd(X.vals)` | simulated $\mu$, $\sigma$ (minimum of three dice) |
| `choose(n, x) * p^x * (1-p)^(n-x)` = `dbinom(x, n, p)` | binomial by hand and by function |
| `1 - pbinom(x-1, n, p)` | $P(X \ge x)$ |
| `dhyper(x, K, N-K, n)`, `phyper(x, K, N-K, n)` | hypergeometric; successes, failures, draws |
| `dgeom(x-1, p)`, `pgeom(x-1, p)`, `1 - pgeom(x-1, p)`, `1 - pgeom(x-2, p)` | geometric $P(X = x)$, $P(X \le x)$, $P(X > x)$ with R's 0-based count of failures; P(X ≥ x) = `1 - pgeom(x-2, p)` = $q^{x-1}$ |
| `lambda^x/factorial(x)*exp(-lambda)` = `dpois(x, lambda)`, `ppois(x, lambda)` | Poisson |
| `Z <- (X-mu)/sig` | the unusual test |
| `read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na="NA", colClasses=c("Date","integer","character","integer","numeric","numeric","numeric"))` | import with Date as a date |
| `filter(df, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))` | drop rows missing either (21 184 to 17 582) |
| `mean(Temp.deg.C ~ Month, data=df)`, `sd(Temp.deg.C ~ Month, data=df)` | mosaic grouped mean and sd as named vectors |
| `barplot(Monthly.Mean.Temp[months])` | months in calendar order (Aug, Jul warmest; Dec, Jan coldest) |
| `with(df, (Temp.deg.C - Monthly.Mean.Temp[Month])/Monthly.SD.Temp[Month])` | per-month $Z$ anomaly by vectorised lookup |
| `histogram(~Z.Temp.anomaly, data=df, type="density", fit="normal", breaks=seq(-6, 6, by=0.25))` | the anomaly is roughly normal |
| `ifelse(Z < -0.4307, "Cold", ifelse(Z <= 0.4307, "Mid", "Warm"))` | three segments, about a third each (0.3439, 0.3388, 0.3174) |
| `ifelse(Month %in% c("Jun","Jul","Aug"), "Summer", ifelse(...))` | seasons; Winter wettest, 8.0 mm per day |
| `weekdays(df$Date)`, `df$has.Precip <- df$Total.Precip.mm > 0` | day of week (needs the Date class), wet-day flag |
| `tab1 <- table(df[c("DoW","has.Precip")])`; `sum(tab1[,"TRUE"])/sum(tab1)`; `tab1["Monday","TRUE"]/sum(tab1["Monday",])` | $P(\text{Precip}) = 0.4878$; $P(\text{Precip} \mid \text{Monday}) = 0.4876$: independent |
| `tab2["Cold","TRUE"]/sum(tab2["Cold",])` | cell over row total: Cold 0.5715, Mid 0.4879, Warm 0.3971 |
| `p.Warm*p.Precip.Warm/(p.Cold*p.Precip.Cold + p.Mid*p.Precip.Mid + p.Warm*p.Precip.Warm)` | Bayes $P(\text{Warm} \mid \text{Precip}) = 0.2584$ = `2216/8577` from the table |
| `tab2["TRUE","Warm","Summer"]/sum(tab2[,"Warm","Summer"])` | three-way table: 0.0870 Summer, 0.4298 Autumn, 0.7213 Winter, 0.3493 Spring |
| `pie(table(df$Temp.Seg), main=paste0("... (n = ", nrow(df), ")"))` | pie with a computed title |

```quiz
[
  {"q": "Rapid fire: the binomial $\\sigma$ is...", "options": ["$npq$", "$\\sqrt{npq}$", "$\\sqrt{np}$", "$np$"], "answer": 1, "explain": "σ² = npq; root it. Shoppers: $$\\sigma = \\sqrt{9.375} = \\mathbf{3.06}$$"},
  {"q": "Geometric $P(X = x)$ = ?", "options": ["$q^x p$", "$p^{x-1} q$", "$q^{x-1} p$", "$nCx\\,q^{x-1} p$"], "answer": 2, "explain": "x − 1 failures then one success, in that order, so no nCx."},
  {"q": "The hypergeometric variance carries the extra factor...", "options": ["$(N - n)/(N - 1)$", "$n/N$", "$K/N$", "$1/p$"], "answer": 0, "explain": "The finite-population correction, below 1, so σ is smaller than the binomial's 1.57 (Mac users: 1.49)."},
  {"q": "Which R function gives the lecture's $P(X = 3)$ for a geometric with $p = 0.25$?", "type": "text", "answer": ["dgeom(2, 0.25)", "dgeom(2,0.25)", "dgeom(2, p)", "dgeom(2,p)"], "explain": "R counts failures before the first success, so the lecture's x = 3 is R's 2."},
  {"q": "Poisson with $\\lambda = 16$: $\\sigma$ = ?", "options": ["16", "8", "256", "4"], "answer": 3, "explain": "$$\\sigma = \\sqrt{\\lambda} = \\sqrt{16} = \\mathbf{4}$$"}
]
```
