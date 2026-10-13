# MATH 3042 Unit 4 — notes, demo notebook 4, Lab 5 and Quiz 4 Part 2 transcribed (source of every number in this module)

Source files (Learning Hub export, 2026-10-12, 11:33 AM): `MATH_3042_Lecture_Unit_04.pdf` (19 pages, printed pp. 55–73) and `MATH_3042_Lecture_Unit_04 (filled partially).pdf` (OneNote capture dated October 4, 2026, 9:34 PM; **handwriting on pp. 55–57 only**, pp. 58–73 blank, so every answer from p. 58 on is computed here and checked against `demo_notebook_Unit_04.Rmd`, "Carl Gladish, Oct 10, 2026"); `Lab Assignment 5.zip` (`Lab_05_Notebook.Rmd`, "Lab Assignment 5 - Conditional Probability", Oct 5, 2026, **no solutions posted**; its outputs below were computed from `SFU.Weather.with.Precip.csv`); `Quiz_4_Part_2_V1_Solutions.pdf` and `Quiz_4_Part_2_V3_Solutions.pdf` (the RStudio quiz on Lab 4; transcribed in `../GAP.md` §b2 for the u3 update, summarised at the end here for format). Pencil problems for Unit 4 are not posted.

Notation: the notes write $nCx$ for $C(n, x)$ and $q = 1 - p$. R's `dbinom(x, n, p)`, `pbinom(x, n, p)` (cumulative $P(X \le x)$), `dhyper(x, K, N-K, n)`, `phyper`, `dgeom(x-1, p)` (**R counts failures before the first success, so the lecture's $X = x$ is R's $x - 1$**), `pgeom(x-1, p)`, `dpois(x, lambda)`, `ppois`.

## p.55 — Discrete probability distributions
- Definition: a **discrete random variable** $X$ is a random variable that has either a *finite* number or a *countable* number of values. e.g. $X$ = the number of children a random person has in their lifetime. Handwritten: "Possible values: 0, 1, 2, 3, 4, 5, …", "countable infinity".
- Definition: the **discrete probability distribution** of $X$ tells us $P(x)$ for any possible value $x$. It can be given by a table/histogram or a formula. Handwritten label on the chart: "Probability Histogram".
- Figure "Canadian Family Size in 2023" (bars at $X$ = 0, 1, 2, 3; y = P(X); x-axis "X = Number of Children"; source https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110001301). Handwritten: arrow to the first bar "$x = 0$, $P(0) = 0.4499$"; table

| $x$ | $P(x)$ |
|---|---|
| 0 | 0.4499 |
| 1 | 0.2504 |
| 2 | 0.2048 |
| 3 | 0.0949 |
| | 1.000 |

- **Requirements for a discrete probability distribution**: $\sum P(x) = 1$ (sum of all probabilities equals 1); $0 \le P(x) \le 1$ for each possible value $x$ (handwritten "between 0 and 1").
- Demo notebook, family size: `X.vals <- c(0,1,2,3); N.vals <- c(4978190, 2770850, 2266190, 1049870); p.vals <- round(N.vals / sum(N.vals), 4)` → 0.4499 0.2504 0.2048 0.0949 (sum of N.vals = 11 065 100); `barplot(p.vals, names.arg=X.vals, space=0, xlab="X = Number of Children", ylab="P(X)", main="Canadian Family Size in 2023")`; `cbind(p.vals)`. The "3" bar is really "3 or more" in the StatCan table (not said in the notes; say it as our reading).

## p.56 — 4.1 Mean and standard deviation of a random variable
- The mean and standard deviation of a random variable $X$ are called the **parameters** of its probability distribution.
- Example: mean value of $X$ = number rolled on a fair 6-sided die. R: `X.vals <- sample(1:6, 100, replace=TRUE)` prints 100 values (5 3 3 4 4 5 4 4 5 3 3 6 2 1 5 5 1 4 2 2 5 5 3 3 1 6 4 5 3 3 4 / 3 3 6 4 1 5 2 1 2 1 5 1 2 5 1 1 5 1 1 3 4 2 2 3 5 1 2 3 3 5 3 / 6 1 6 1 6 2 2 5 5 5 6 2 5 3 5 1 5 5 5 1 5 2 3 3 1 6 2 5 6 4 1 / 2 1 3 4 4 4 6); `sum(X.vals) / 100` → **3.38** (circled). "If we could compute the mean for all possible rolls":
  $$\mu = \tfrac16 \cdot 1 + \tfrac16 \cdot 2 + \tfrac16 \cdot 3 + \tfrac16 \cdot 4 + \tfrac16 \cdot 5 + \tfrac16 \cdot 6 = \tfrac{21}{6} = \mathbf{3.5}$$
  Handwritten bubble: the sample mean is $\dfrac{(N_1/6) \cdot 1 + (N_2/6) \cdot 2 + \cdots}{N}$-style — "(N/6)×1 + (N/6)×2 + (N/6)×3 + … over N", i.e. the sample mean is the same weighted sum with relative frequencies in place of probabilities.
- Definition: if $X$ is discrete with distribution $P(x)$,
  $$\mu = \sum_x [x \cdot P(x)] = x_1 P(x_1) + x_2 P(x_2) + \cdots$$
  The mean $\mu$ is also called the **"expected value"** of $X$ and can be written $E[X]$ (handwritten "expectation of X").
  $$\sigma^2 = \sum_x [(x - \mu)^2 \cdot P(x)] \quad (\text{"variance"}), \qquad \sigma = \sqrt{\sum_x (x-\mu)^2 P(x)} \quad (\text{"standard deviation"})$$
- (Computed) die: $\sigma = \sqrt{17.5/6} = 1.708$.

## p.57 — children, minimum of two dice, minimum of three dice
- **Number of children**: $\mu = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = \mathbf{0.94}$ (0.9447). $\sigma^2 = (0 - 0.94)^2 0.4499 + (1 - 0.94)^2 0.2504 + (2 - 0.94)^2 0.2048 + (3 - 0.94)^2 0.0949 = 1.03$; $\sigma = \sqrt{1.03} = 1.016 \approx \mathbf{1.02}$. Demo: `mu <- sum(X.vals * p.vals); sig = sqrt(sum((X.vals - mu)^2 * p.vals)); c(mu, sig)` → 0.9447 1.0155.
- **Minimum of two dice**: random experiment is rolling two fair six-sided dice, $X$ = the minimum of the two values. Sample-space grid annotated: the top row and left column (11 cells) have minimum 1; the circled (2,2)-corner "x = 2" L-shape has 9 cells; so $P(1) = 11/36$, $P(2) = 9/36$, $P(3) = 7/36$, $P(4) = 5/36$, $P(5) = 3/36$, $P(6) = 1/36$ (in general $P(x) = (13 - 2x)/36$).
  $$\mu = 1 \cdot \tfrac{11}{36} + 2 \cdot \tfrac{9}{36} + 3 \cdot \tfrac{7}{36} + 4 \cdot \tfrac{5}{36} + 5 \cdot \tfrac{3}{36} + 6 \cdot \tfrac{1}{36} = \mathbf{2.53} \ (91/36 = 2.5278)$$
  $$\sigma^2 = (1 - 2.53)^2 \tfrac{11}{36} + (2 - 2.53)^2 \tfrac{9}{36} + \cdots + (6 - 2.53)^2 \tfrac{1}{36} = 1.97, \quad \sigma = \sqrt{1.97} = \mathbf{1.40}$$
  Demo: `Probs <- c(11/36, 9/36, 7/36, 5/36, 3/36, 1/36)` → `c(mu, sig)` 2.5278 1.4041.
- **Minimum of three dice**, by simulation in R: handwritten $\mu = \mathbf{2.04}$, $\sigma = \mathbf{1.15}$, "$\mu$ gets smaller for more dice." Demo: `m.trials <- 10^5; X.vals <- integer(m.trials); for (i.trial in 1:m.trials){ X.vals[i.trial] <- min( sample(1:6, 3, replace=TRUE) ) }; mu <- mean(X.vals); sig <- sd(X.vals)`. (Computed exact: $P(x) = ((7-x)^3 - (6-x)^3)/216$ = 0.4213, 0.2824, 0.1713, 0.0880, 0.0324, 0.0046; $\mu = 2.0417$, $\sigma = 1.144$.)

## p.58 — 4.2 Binomial distribution
- "In these above examples, we were forced to calculate $\mu$ and $\sigma$ from the definitions (or simulation). There are some random experiments that are so commonly used that statisticians have developed exact formulas dealing with them." List: **Binomial, Geometric, Hypergeometric, Poisson**.
- The binomial distribution arises for $X$ = the number of "successes" in a series of $n$ independent trials. A **trial** is any random experiment that has just two possible outcomes, called "success" and "failure" by convention: Win/Lose, Live/Die, True/False, Pass/Fail.
- **Example (Online Shopping)**: $n = 50$ online shoppers visit your website during one hour; for each visitor the probability that they complete a sale is $p = 25\%$; $X$ = the number of visitors who complete a sale. $X$ is binomial assuming: **1. Fixed $n$** (the total number of visitors is known and fixed); **2. Success/Failure** (each visitor either completes a sale or not); **3. Equal $p$** (each visitor has the same probability of completing a sale); **4. Independence** (each visitor's outcome is unaffected by other visitors' outcomes).

## p.59 — the shoppers' distribution, $P(X = 6)$
- Figure "Probability Distribution of X", pink bars at $X$ = 0 … 50 (ticks 0, 3, 6, …, 48), peak near 12–13 at about 0.13, essentially zero past 25. Demo: `p.vals[x+1] = choose(n, x)*p^x*(1-p)^(n-x)` for `x in 0:n`, `barplot(p.vals, names.arg=X.vals, col="pink", space=0, xlab="X = # Sales", ylab="P(X)", main="Probability Distribution of X")`.
- "As an example, let's calculate just one value: $P(X = 6)$" (blank). Computed: $P(X = 6) = C(50, 6)\,0.25^6\,0.75^{44} = 15\,890\,700 \times 2.441 \times 10^{-4} \times 3.18 \times 10^{-6} = \mathbf{0.0123}$. Demo: `choose(50, 6) * 0.25^6 * 0.75^44` → 0.01234465.
- (Computed, for a widget preset) the first values: $P(0) \approx 0$, …, $P(5) = 0.0049$, $P(6) = 0.0123$, $P(8) = 0.0463$, $P(10) = 0.0985$, $P(12) = 0.1294$, $P(13) = 0.1261$, $P(15) = 0.0888$, $P(20) = 0.0077$.

## p.60 — rolling 3s; the general formula
- Example: rolling a fair die 5 times and counting the number of 3s is a binomial experiment; $X$ = the number of 3s. "Check the conditions" (blank): fixed $n = 5$; each roll is a 3 or not; $p = 1/6$ every roll; rolls independent. "Calculate the probability distribution of $X$" (blank). Computed / demo: $P(0) = (5/6)^5 = 0.4019$; $P(1) = C(5,1)(1/6)(5/6)^4 = 0.4019$; $P(2) = C(5,2)(1/6)^2(5/6)^3 = 0.1608$; $P(3) = 0.0322$; $P(4) = 0.0032$; $P(5) = 0.0001$. Demo: `p.vals <- dbinom(X.vals, n, p)` with `barplot(..., main="Number of 3s Rolled For n=5 Dice")`, then `(5/6)^5` vs `dbinom(0, 5, 1/6)`, `choose(5,1)*(1/6)*(5/6)^4` vs `dbinom(1, 5, 1/6)`, `choose(5,2)*(1/6)^2*(5/6)^3` vs `dbinom(2, 5, 1/6)`. (Computed: $\mu = 5/6 = 0.833$, $\sigma = \sqrt{5 \cdot \frac16 \cdot \frac56} = 0.833$.)
- **General formula**: if $X$ satisfies the conditions of a binomial variable with $n$ trials and probability $p$ of success,
  $$P(x) = nCx \cdot p^x \cdot q^{n-x}, \qquad nCx = \frac{n!}{(n-x)!\,x!}$$

## p.61 — jacks with replacement (blank; computed)
- 5 cards **with** replacement, $P(\text{2 jacks})$: $p = 4/52$, $n = 5$: $C(5,2)(4/52)^2(48/52)^3 = 10 \times 0.005917 \times 0.7865 = \mathbf{0.0465}$ (`dbinom(2, 5, 4/52)` → 0.04654006).
- At least 2 jacks: $1 - P(0) - P(1) = 1 - (48/52)^5 - 5(4/52)(48/52)^4 = 1 - 0.6702 - 0.2792 = \mathbf{0.0506}$ (`1 - pbinom(1, 5, 4/52)` → 0.05058).

## p.62 — mean and variance of a binomial
- "The mean and variance of any probability distribution are found using" $\mu = \sum x P(x)$, $\sigma^2 = \sum (x - \mu)^2 P(x)$. "It is possible to start with these definitions and then to use the binomial distribution assumptions to derive the results":
  $$\mu = np, \qquad \sigma^2 = npq$$
- Example, shoppers $n = 50$, $p = 0.25$: (blank) $\mu = 50(0.25) = \mathbf{12.5}$, $\sigma = \sqrt{50(0.25)(0.75)} = \sqrt{9.375} = \mathbf{3.06}$. Demo: `mu <- n*p; sig <- sqrt(n*p*q); c(mu, sig)` → 12.5 3.0619. The figure of the distribution is repeated.

## p.63 — laser printers (blank; computed and demo)
- A certain model of laser printer: probability of needing repairs in the first year is 10 %. Modifications were made; a year later 200 randomly selected modified printers were studied.
  - (a) Assuming no effect: $\mu = 200(0.1) = \mathbf{20}$, $\sigma = \sqrt{200(0.1)(0.9)} = \sqrt{18} = \mathbf{4.24}$.
  - (b) 14 needed repair; unusually low? $Z = (14 - 20)/4.24 = \mathbf{-1.41}$; not beyond $-2$, so **not unusual** (computed tail: `pbinom(14, 200, 0.1)` = 0.093). Demo: `X <- 14; Z <- (X-mu)/sig; Z` → −1.414214.
  - (c) "Does this sample provide good evidence that the modifications improved the reliability?" **No**: 14 repairs is within what chance alone produces under the old 10 % rate (|Z| < 2); the sample is consistent with no improvement. (Our wording; the in-class answer replaces it.)

## p.64 — 4.3 Hypergeometric distribution
- Similar to the binomial: $X$ = number of successes in a series of $n$ trials. Table of differences:

| Binomial | Hypergeometric |
|---|---|
| trials are *independent* | trials are *dependent* |
| sampling *with replacement*, or sampling from an *infinite* population | sampling *without replacement* from a finite population |
| same probability $p$ for each trial | probability of success changes for subsequent trials |

- "If the number of trials, $n$, is small compared to the population size, then the Binomial model and the Hypergeometric model give *very similar* probabilities."
- **Formula**: a population of $N$ objects contains $K$ "success" objects and $N - K$ "failure" objects; a random sample of size $n$; $X$ = the number of "success" objects in the sample:
  $$P(x) = \frac{C(K, x) \cdot C(N - K,\ n - x)}{C(N, n)}, \quad x = 0, 1, 2, \ldots, n$$
  $$\mu = n \cdot \frac{K}{N}, \qquad \sigma^2 = n \cdot \frac{K}{N} \cdot \frac{N - K}{N} \cdot \frac{N - n}{N - 1}$$

## p.65 — jacks: hypergeometric vs binomial; the superdeck
- 5 cards from 52, $X$ = number of Jacks (4 in the deck), $P(X = 2)$. Hypergeometric (without replacement): $P(X = 2) = \dfrac{C(4,2) \cdot C(48,3)}{C(52,5)} = \dfrac{6 \cdot 17\,296}{2\,598\,960} = \mathbf{0.0399}$; printed `> dhyper(2, 4, 48, 5)` → `0.03992982`. Binomial (with replacement): $P(X = 2) = C(5,2)\,(4/52)^2\,(48/52)^3 = \mathbf{0.0465}$; printed `> dbinom(2, 5, 4/52)` → `0.04654006`.
- Superdeck of 10 decks ($N = 520$, $K = 40$, $n = 5$): Hypergeometric (blank; computed) $\dfrac{C(40,2)\,C(480,3)}{C(520,5)} = \mathbf{0.0460}$ (`dhyper(2, 40, 480, 5)` → 0.04597); Binomial: $p = 40/520 = 4/52$, same as before, $\mathbf{0.0465}$. Demo: `N <- 520; K <- 40; n <- 5; dhyper(2, K, N-K, 5); dbinom(2, 5, K/N)`. The two answers close up because $n/N$ fell from $5/52 = 9.6\%$ to $5/520 = 0.96\%$.

## p.66 — 5 % rule; Mac users
- **5 % Rule**: if the sample size $n$ is 5 % or less of the total population $N$, then probabilities calculated using Hypergeometric and Binomial distributions are practically the same.
- Example: a class of 90 students has 40 Apple Mac users; a random sample of 10; $X$ = the number of Mac users in the sample. Hypergeometric with (blank) $N = 90$, $K = 40$, $n = 10$ ($n/N = 11\% > 5\%$, so the binomial is not a good stand-in).
  - (a) $P(X = 4) = \dfrac{C(40,4)\,C(50,6)}{C(90,10)} = \dfrac{91\,390 \times 15\,890\,700}{5.7206 \times 10^{12}} = \mathbf{0.2539}$ (`dhyper(4, 40, 50, 10)` → 0.2538614).
  - (b) $P(X \le 4) = P(0) + \cdots + P(4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = \mathbf{0.5189}$ (`phyper(4, 40, 50, 10)` → 0.5188862).

## p.67 — Mac users (c)–(e)
- (c) $\mu = 10 \cdot \dfrac{40}{90} = \mathbf{4.44}$; $\sigma^2 = 10 \cdot \dfrac{40}{90} \cdot \dfrac{50}{90} \cdot \dfrac{80}{89} = 2.2194$, $\sigma = \mathbf{1.49}$ (the binomial would give 1.57). Demo: `p <- K/N; mu <- n*K/N; sig <- sqrt(n*p*(1-p)*(N-n)/(N-1)); c(mu, sig)` → 4.4444 1.4898.
- (d) Probability histogram, printed figure "Number of Mac Users in a Sample (n=10)", pink bars at x = 0 … 10, y "P(X=x)" to 0.25, peak at 4 (≈ 0.25) then 5 (≈ 0.24). Demo: `X.vals <- 0:n; p.vals <- dhyper(X.vals, K, N-K, n); barplot(p.vals, names.arg=X.vals, col="pink", space=0, xlab="x", ylab="P(x)", main="Number of Mac Users in a Sample (n=10)")`. Values: 0.0018, 0.0175, 0.0732, 0.1725, 0.2539, 0.2437, 0.1545, 0.0639, 0.0165, 0.0024, 0.0001.
- (e) $X = 8$ unusual? $Z = (8 - 4.44)/1.49 = \mathbf{2.39}$, beyond 2 → **unusual** (`1 - phyper(7, 40, 50, 10)` = 0.019, also below 0.025). Demo: `X <- 8; Z <- (X-mu)/sig; Z` → 2.386629.

## p.68 — 4.4 Geometric distribution
- Same assumptions as the binomial ($n$ trials each with probability of success $p$) but $X$ = **the number of trials it takes to obtain the first "success"**.
- Example: a tech-support help line is occupied 75 % of the time; probability you must call 3 times to gain access. Solution: failure on the first call, probability $q = 0.75$; failure on the second, $q = 0.75$; success on the third, $p = 0.25$. Therefore $P(3) =$ (blank) $0.75 \cdot 0.75 \cdot 0.25 = \mathbf{0.1406}$.
- **Formulas**: every trial has probability $p$ of success and $q = 1 - p$ of failure, trials independent; $X$ = the number of trials it takes to get the first success (possible values 1, 2, 3, …):
  $$P(X = x) = q^{x-1} \cdot p, \qquad \mu = \frac{1}{p}, \qquad \sigma^2 = \frac{1 - p}{p^2}$$

## p.69 — derivation of $\mu$ (not examinable); help-line mean and sd
- "You are not expected to be able to perform a derivation like the following, but it may help you to be familiar with it": $\mu = \sum_{x=1}^{\infty} x P(x)$ (definition) $= \sum x q^{x-1} p$ (sub formula) $= p \left[\sum x q^{x-1}\right]$ (factor out $p$) $= p \frac{d}{dq}\left[\sum_{x=1}^{\infty} q^x\right]$ (since $x q^{x-1} = \frac{d}{dq} q^x$) $= p \frac{d}{dq}\left[\frac{q}{1-q}\right]$ (sum of a geometric series) $= p \frac{(1-q) + q}{(1-q)^2}$ (quotient rule) $= p \frac{1}{(1-q)^2} = \frac{p}{p^2} = \frac{1}{p}$ (using $p = 1 - q$).
- Example continued, $X$ = number of calls until access: $E[X] = 1/0.25 = \mathbf{4}$ calls; $\sigma_X = \sqrt{0.75/0.25^2} = \sqrt{12} = \mathbf{3.46}$. Demo: `p <- 0.25; q <- 1-p; mu <- 1/p; sig <- sqrt((1-p)/p^2)`.

## p.70 — $P(X \ge 4)$ and the histogram
- $P(X \ge 4) = 1 - P(1) - P(2) - P(3) = 1 - 0.25 - 0.1875 - 0.1406 = \mathbf{0.4219}$ (equivalently $q^3 = 0.75^3$: three failures in a row). Demo: `1 - p - q*p - q^2*p`; `1 - dgeom(0,p) - dgeom(1,p) - dgeom(2,p)`; `1 - pgeom(2, p)` — note the **0-based R arguments**.
- Histogram: `X.vals <- 1:10; p.vals <- q^(X.vals - 1)*p; barplot(p.vals, names.arg=X.vals, col="pink", space=0, xlab="X", ylab="P(x)", main="Number of Calls to Get Access")`: 0.25, 0.1875, 0.1406, 0.1055, 0.0791, 0.0593, 0.0445, 0.0334, 0.0250, 0.0188 (always decreasing; the mode is 1).

## p.71 — 4.5 Poisson distribution
- Named after Siméon Poisson (1781–1840); "one of the most important probability distributions in engineering and computer science. It arises whenever we are modelling events that occur randomly throughout a given time interval." Examples: $X$ = number of jobs arriving for service at a CPU per second; $X$ = number of bits arriving in error at a network node per minute.
- **Assumptions**: $X$ = the number of occurrences of an event over some interval; occurrences happen with uniform probability over the time interval; occurrences are independent of each other; the *mean* number of occurrences is known: $\lambda$ = mean number of occurrences during the time interval.
- **Formulas**: $P(X = x) = \dfrac{\lambda^x}{x!} e^{-\lambda}$, $e = 2.71828\ldots$ (Euler's constant); $\mu = \lambda$, $\sigma^2 = \lambda$.

## p.72 — web server (blank; computed and demo)
- A web server gets on average one request every 2 seconds; requests random and independent. One-minute interval: $\lambda = 60/2 = 30$ requests per minute (demo: `lambda <- 1/2 * 60`).
  - $P(X = 20) = \dfrac{30^{20}}{20!} e^{-30} = \mathbf{0.0134}$ (`lambda^20/factorial(20)*exp(-lambda)`, `dpois(20, lambda)` → 0.01341115).
  - $P(X \le 20) = \mathbf{0.0353}$ (`ppois(20, lambda)` → 0.03528462).
  - Unusual? $\mu = 30$, $\sigma = \sqrt{30} = 5.48$, $Z = (20 - 30)/5.48 = \mathbf{-1.83}$ → **not unusual** by the Z rule (|Z| < 2); the tail 0.0353 is above 0.025 too. Demo: `mu <- lambda; sig <- sqrt(lambda); X <- 20; Z <- (X-mu)/sig; Z` → −1.825742.

## p.73 — the web-server histogram
- Demo: `X.vals <- 0:80; p.vals <- dpois(X.vals, lambda); barplot(p.vals, names.arg=X.vals, space=0, col="pink", xlab="x", ylab="P(x)", main="Requests to a Web Server in One Minute")`. Values: $P(20) = 0.0134$, $P(25) = 0.0511$, $P(30) = 0.0726$ (peak; $P(29) = P(30)$), $P(35) = 0.0453$, $P(40) = 0.0139$; bell-shaped, slightly right-skewed.

## Lab 5 (Oct 5, 2026): Lab Assignment 5 — Conditional Probability (R; no solutions posted, outputs computed from the CSV)
- Objectives: SFU weather data 1965–2022 (Government of Canada "Daily Data Report", station Burnaby Simon Fraser U, climate ID 1101158, elevation 365.80 m; the first clipboard image is that web page). Questions: is precipitation more likely on Mondays; which season is precipitation most likely; do high or low temperatures affect the probability of precipitation; does the season influence that dependence. Skills: *filtering*, *segmenting*, conditional probabilities from data. "This lab combines skills from Labs 1 to 4." Packages `dplyr`, `mosaic`. `Something <- NA` is the instructor's placeholder for missing code. The pencil problems line is struck out: "This week, the Pencil Problems are posted separately as a pdf file" (= `Unit_03_Practice_Problems.pdf`, see `../GAP.md` §b3).
- Import: `SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na="NA")` (file saved beside the notebook; a relative path `"../../Data/..."` also shown). `read.csv` reads `Date` as a string; control types with `colClasses = c("Date", "integer", "character", "integer", "numeric", "numeric", "numeric")` and `na.strings="NA"`. Variables: `Date` (Date), `Year` (integer), `Month` (character), `Day` (integer), `Temp.deg.C`, `Total.Rain.mm`, `Total.Precip.mm` (includes rain and snow, melted). `months <- c("Jan", ..., "Dec")` fixes the month order. (The notebook's bullet list says Temp.dec.C once; the column is `Temp.deg.C`.)
- **Task 1**: drop rows where `Temp.deg.C` or `Total.Precip.mm` is NA: `SFU.Weather <- filter(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))` → 21 184 rows become **17 582**.
- **Task 2**: `Monthly.Mean.Temp <- mean(Temp.deg.C ~ Month, data=SFU.Weather)`; `Monthly.SD.Temp <- sd(Temp.deg.C ~ Month, data=SFU.Weather)` (mosaic formula versions; named vectors indexed by month name). Computed means (°C): Jan 2.90, Feb 4.16, Mar 5.82, Apr 8.41, May 11.82, Jun 14.54, Jul 17.10, Aug 17.39, Sep 14.52, Oct 9.70, Nov 5.36, Dec 2.89; sds: Jan 3.68, Feb 3.21, Mar 2.89, Apr 3.21, May 3.49, Jun 3.58, Jul 3.33, Aug 3.23, Sep 3.29, Oct 2.97, Nov 3.32, Dec 3.51.
- **Task 3**: `barplot(Monthly.Mean.Temp[months], ...)` (index by the `months` vector to order them). Warmest two: **Aug, Jul**; coldest two: **Dec, Jan**.
- `with`: `max(SFU.Weather$Temp.deg.C) - min(SFU.Weather$Temp.deg.C)` ≡ `with(SFU.Weather, max(Temp.deg.C) - min(Temp.deg.C))`.
- Standardized temperature anomaly: "A cold day in July is not as cold as a cold day in January." `Z.anomaly` $= (X - \bar X)/s$ with $\bar X$, $s$ per month: `Z.Temp.anomaly <- with(SFU.Weather, (Temp.deg.C - Monthly.Mean.Temp[Month])/Monthly.SD.Temp[Month])`; append as a column `SFU.Weather$Z.Temp.anomaly <- Z.Temp.anomaly`. (Computed: mean 0, sd 0.9997, range −5.81 to 5.51.)
- **Task 4**: `histogram(~Z.Temp.anomaly, data=SFU.Weather, type="density", fit="normal", breaks=seq(-6, 6, by=0.25), ...)` — classes of width 0.25, a normal curve overlaid; "the standardized temperature anomaly is normally distributed (more or less)".
- Segmenting: `SFU.Weather$Temp.Seg <- with(SFU.Weather, ifelse(Z.Temp.anomaly < -0.4307, "Cold", ifelse(Z.Temp.anomaly <= 0.4307, "Mid", "Warm")))` — Cold $Z < -0.4307$, Mid $-0.4307 \le Z \le 0.4307$, Warm $Z > 0.4307$ (±0.4307 are the normal tertiles, so each third ≈ 1/3; not said in the lab).
- **Task 5**: `p.Cold <- sum(SFU.Weather$Temp.Seg == "Cold")/nrow(SFU.Weather)` etc. (or `prop.table(table(...))`). Computed counts Cold 6046, Mid 5956, Warm 5580 → `round(c(p.Cold, p.Mid, p.Warm), 4)` = **0.3439 0.3388 0.3174**.
- **Task 6**: `pie(table(SFU.Weather$Temp.Seg), ...)` with labels and a computed title.
- **Task 7**: `SFU.Weather$Season <- with(SFU.Weather, ifelse(Month %in% c("Jun","Jul","Aug"), "Summer", ifelse(Month %in% c("Sep","Oct","Nov"), "Autumn", ifelse(Month %in% c("Dec","Jan","Feb"), "Winter", "Spring"))))`; `seasons <- c("Summer","Autumn","Winter","Spring")`; `Seasonal.Mean.Precip <- mean(Total.Precip.mm ~ Season, data=SFU.Weather)`; `barplot(Seasonal.Mean.Precip[seasons], col="lightgreen", xlab="Season", ylab="Mean Total Precip (mm)")`. Lab's answer: "Winter is the wettest season at SFU with **8.0 mm per day** on average." Computed: Winter 8.04, Autumn 6.74, Spring 4.85, Summer 2.28.
- Day of week: `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)` (needs the Date class); `SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)`.
- Are Mondays rainier? `tab1 <- table(SFU.Weather[c("DoW", "has.Precip")])` (rows days, columns FALSE/TRUE); `p.Precip <- sum(tab1[ ,"TRUE"]) / sum(tab1)` → **0.4878**; `p.Precip.Cond.Monday <- tab1["Monday","TRUE"]/sum(tab1["Monday",])` → **0.4876** (Monday 1284 dry, 1222 wet). "The fact that these two probabilities are so close (~0.488) means that having precipitation is independent of a day being Monday." (Other days: Tue 0.4835, Wed 0.4927, Thu 0.4829, Fri 0.4916, Sat 0.4911, Sun 0.4854.)
- **Task 8**: `tab2 <- table(SFU.Weather[c("Temp.Seg", "has.Precip")])`:

| Temp.Seg | Precip = 0 | Precip > 0 | P(Precip > 0 \| seg) |
|---|---|---|---|
| Cold | 2591 | 3455 | 3455/6046 = **0.5715** |
| Mid | 3050 | 2906 | 2906/5956 = **0.4879** |
| Warm | 3364 | 2216 | 2216/5580 = **0.3971** |

  `p.Precip.Cold <- tab2["Cold","TRUE"]/sum(tab2["Cold",])` etc. Lab's answer: "Yes, since the probability of precipitation given a Cold day is greater than the probability of precipitation on a Warm or Mid day."
- **Task 9**: Bayes: $P(\text{Warm} \mid \text{Precip} > 0) = \dfrac{P(\text{Warm})\,P(\text{P} \mid \text{Warm})}{P(\text{Cold})P(\text{P} \mid \text{Cold}) + P(\text{Mid})P(\text{P} \mid \text{Mid}) + P(\text{Warm})P(\text{P} \mid \text{Warm})} = \dfrac{0.3174 \times 0.3971}{0.3439 \times 0.5715 + 0.3388 \times 0.4879 + 0.3174 \times 0.3971} = \dfrac{0.1260}{0.1965 + 0.1653 + 0.1260} = \mathbf{0.2584}$ (`p.Warm.Precip <- p.Warm*p.Precip.Warm/(p.Cold*p.Precip.Cold + p.Mid*p.Precip.Mid + p.Warm*p.Precip.Warm)`; check from the table 2216/8577 = 0.2584).
- **Task 10**: `tab2 <- table(SFU.Weather[c("has.Precip","Temp.Seg","Season")])` (3-way; index `tab2["TRUE","Warm","Summer"]/sum(tab2[ ,"Warm","Summer"])`). Computed $P(\text{Precip} > 0 \mid \text{Warm and season})$ (wet / all warm days of that season): Summer 125/1437 = 0.0870 (1312 dry); Autumn 588/1368 = 0.4298 (780 dry); Winter 1035/1435 = 0.7213 (400 dry); Spring 468/1340 = 0.3493 (872 dry). `round(..., 4)` → **0.0870 0.4298 0.7213 0.3493**. Sentence (the lab's own example): "The season where SFU is most likely to have precipitation on a warm day is **winter**."
- **Task 11**: month with the greatest $P(\text{Precip} > 0 \mid \text{Warm})$; reproduce the bar plot "Likelihood of Rain on a Warm Day, by Month" (light blue bars, y "%" 0–100, x "Month" Jan…Dec). Computed %: Jan 74.9, Feb 62.0, Mar 51.8, Apr 31.8, May 20.2, Jun 15.2, Jul 5.7, Aug 5.8, Sep 12.4, Oct 40.2, Nov 75.0, **Dec 78.2** (the answer). Code shape: `tab3 <- table(SFU.Weather[c("has.Precip","Temp.Seg","Month")]); pct <- 100*tab3["TRUE","Warm",months]/(tab3["TRUE","Warm",months] + tab3["FALSE","Warm",months]); barplot(pct, col="lightblue", ylim=c(0,100), xlab="Month", ylab="%", main="Likelihood of Rain on a Warm Day, by Month")`.

## Quiz 4 Part 2 (RStudio, on Lab 4) — the format the next R quiz will follow
Full transcription in `../GAP.md` §b2. Shape: two questions; Q1 (a) one `sample()` call with `prob=`, (b) a function that simulates $m$ trials of a 13-game match with a for loop, (c) a relative-frequency probability (`sum(X.vals >= 7)/m.trials` → 0.77156; exact binomial $P(X \ge 7)$ with $n = 13$, $p = 0.6$ is 0.7712 — a Unit 4 check), (d) `hist(X.vals, breaks=seq(-0.5, 13.5, by=1), freq=FALSE, ...)`, (e) `mean`, `sd` (7.80, 1.77; binomial $np = 7.8$, $\sqrt{npq} = 1.77$), Z for 3 wins −2.72, left tail `sum(X.vals <= 3)/m` = 0.0081; "unusual" accepted either as Z = −2.7 or as tail 0.0080 < 0.0250. Q2 modifies the game (a die roll of 6 gives the win to B) with `replicate`. V3 is a blackjack version with `cards <- c(rep(1:10, 4), rep(10, 12))` and a function returning `list(mean=, sig=)`.

## Checks made while writing
- Every number above recomputed in `../compute.py`: family μ = 0.9447 (0.94), σ = 1.0155; min of two dice 2.5278 / 1.4041; shoppers P(6) = 0.012345, μ 12.5, σ 3.0619; printers Z = −1.4142; jacks 0.039930 vs 0.046540; superdeck 0.045971; Mac P(4) = 0.253861, P(≤4) = 0.518886, μ 4.4444, σ 1.4898, Z(8) = 2.3866; geometric P(3) = 0.140625, μ 4, σ 3.4641, P(X ≥ 4) = 0.421875; Poisson P(20) = 0.013411, P(≤20) = 0.035285, Z = −1.8257.
- Lab 5 numbers come from the CSV with the Task 1 filter applied (17 582 rows); if the instructor's solutions use a different NA rule the counts will shift slightly, the conclusions (independent of Monday; Cold wettest; Winter; Dec) will not.
- The notes never state a numeric "unusual" rule for discrete variables beyond the Z-score; Quiz 4 Part 2 accepted both |Z| > 2 and a tail probability < 0.025. Teach both.
