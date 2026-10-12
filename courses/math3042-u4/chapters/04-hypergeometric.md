---
title: Hypergeometric: sampling without replacement, and the 5% rule
minutes: 24
---

Deal five cards and count the jacks: each card dealt changes the deck, so $p$ is not constant and the binomial formula is wrong. The hypergeometric distribution is the exact formula for sampling without replacement, and the 5 % rule says when the binomial is close enough anyway.

## Binomial versus hypergeometric

*The hypergeometric distribution is similar to the binomial distribution. In both cases, we are concerned with the variable $X$ = number of successes in a series of $n$ trials.* The difference:

| Binomial | Hypergeometric |
|---|---|
| trials are *independent* | trials are *dependent* |
| sampling *with replacement*, or sampling from an *infinite* population | sampling *without replacement* from a finite population |
| same probability $p$ for each trial | probability of success changes for subsequent trials |

*If the number of trials, $n$, is small compared to the population size, then the Binomial model and the Hypergeometric model give very similar probabilities.* Removing one card from a deck of 52 matters; removing one from 520 barely does.

## The formula: N objects, K successes, a sample of n

*Suppose a population of $N$ objects contains $K$ "success" objects and $N - K$ "failure" objects. If you select a random sample of size $n$ from this population, let $X$ = the number of "success" objects in the sample.* Then

$$P(x) = \frac{C(K, x) \cdot C(N - K,\ n - x)}{C(N, n)}, \qquad x = 0, 1, 2, \ldots, n$$

It is Unit 3's classical probability with combinations: $C(N, n)$ counts every possible sample, $C(K, x)$ the ways to pick the $x$ successes from the $K$ available, $C(N - K, n - x)$ the ways to pick the other $n - x$ sample members from the $N - K$ failures. Both the failure count and the failure slots appear in the second factor.

$$\mu = n \cdot \frac{K}{N}, \qquad \sigma^2 = n \cdot \frac{K}{N} \cdot \frac{N - K}{N} \cdot \frac{N - n}{N - 1}$$

With $p = K/N$ these are the binomial's $np$ and $npq$ times a correction factor $\frac{N - n}{N - 1}$, which is below 1 whenever $n > 1$: sampling without replacement has the same mean and a smaller spread.

## Two jacks in five cards: 0.0399 without replacement, 0.0465 with

*Suppose you sample 5 cards from a deck of 52 cards. Let $X$ = the number of Jacks you get in the sample (there are 4 Jacks in the deck). What is $P(X = 2)$?* $N = 52$, $K = 4$, $n = 5$, $x = 2$:

$$P(X = 2) = \frac{C(4, 2) \cdot C(48, 3)}{C(52, 5)} = \frac{6 \times 17\,296}{2\,598\,960} = \frac{103\,776}{2\,598\,960} = 0.0399$$

With replacement (last lesson's binomial, $p = 4/52$): $C(5, 2)(4/52)^2(48/52)^3 = 0.0465$. The binomial overstates it because after a jack is dealt the deck holds only 3 jacks in 51.

```widget
hyper-vs-binom
{ "N": 52, "K": 4, "n": 5, "x": 2, "decks": 1, "preset": "jacks in 5 cards", "title": "Jacks in 5 cards: hypergeometric beside binomial; slide decks to 10 for the superdeck" }
```

`dhyper(x, K, N - K, n)` takes the successes, the failures and the sample size, not $N$.

```r
N <- 52
K <- 4
n <- 5
choose(K, 2)*choose(N-K, n-2) / choose(N, n)
dhyper(2, 4, 48, 5)
choose(5,2)*(4/52)^2*(48/52)^3
dbinom(2, 5, 4/52)
```

```text
[1] 0.03992982
[1] 0.03992982
[1] 0.04654006
[1] 0.04654006
```

## The superdeck: ten decks shuffled together

*Now, suppose you combine 10 decks of cards into one "superdeck". If you randomly select 5 cards, what is the probability of getting 2 Jacks?* $N = 520$, $K = 40$, $n = 5$:

$$P(X = 2) = \frac{C(40, 2) \cdot C(480, 3)}{C(520, 5)} = \frac{780 \times 18\,316\,960}{310\,784\,578\,104} = 0.0460$$

The binomial uses $p = 40/520 = 4/52$, the same as before, so it still gives 0.0465. The two answers closed up because the sample is now a smaller fraction of the population: $n/N$ fell from $5/52 = 9.6\%$ to $5/520 = 0.96\%$.

```r
N <- 520
K <- 40
n <- 5
dhyper(2, K, N-K, 5)
dbinom(2, 5, K/N)
```

```text
[1] 0.04597149
[1] 0.04654006
```

## The 5 % rule

*If the sample size $n$ is 5 % or less of the total population $N$, then probabilities calculated using Hypergeometric and Binomial distributions are practically the same.* Compute $n/N$ first: 0.96 % passes, 9.6 % does not.

## Mac users: N = 90, K = 40, n = 10

*Suppose a class of 90 students has 40 Apple Mac users. To conduct a market research survey, you randomly select a sample of 10 students. Let $X$ = the number of Apple Mac users in the sample.* The sample is drawn without replacement, so *$X$ is a hypergeometric variable with parameters* $N = 90$, $K = 40$, $n = 10$. $n/N = 10/90 = 11\%$ fails the 5 % rule, so the binomial is not an acceptable stand-in here.

**(a)** *What is the probability that 4 students in the sample are Apple Mac users?*

$$P(4) = \frac{C(40, 4) \cdot C(50, 6)}{C(90, 10)} = \frac{91\,390 \times 15\,890\,700}{5.7206 \times 10^{12}} = \frac{1.4523 \times 10^{12}}{5.7206 \times 10^{12}} = 0.2539$$

**(b)** *What is the probability that 4 or fewer of them are Apple Mac users?* $P(X \le 4)$ is the sum of five terms, each from the same formula:

$$P(X \le 4) = P(0) + P(1) + P(2) + P(3) + P(4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = 0.5189$$

**(c)** *What are the mean and standard deviation of $X$?*

$$\mu = 10 \cdot \frac{40}{90} = 4.44, \qquad \sigma^2 = 10 \cdot \frac{40}{90} \cdot \frac{50}{90} \cdot \frac{80}{89} = 2.2194, \qquad \sigma = \sqrt{2.2194} = 1.49$$

The binomial would give $\sqrt{10(0.444)(0.556)} = 1.57$; the correction factor $80/89 = 0.899$ shrinks the variance.

**(d)** *Generate a probability histogram of $X$.* The printed figure `Number of Mac Users in a Sample (n=10)` has pink bars at $x = 0, \ldots, 10$, peaking at 4 (0.2539) with 5 just behind (0.2437), and nothing visible past 8.

**(e)** *If you found $X = 8$ Mac users, would this be considered unusual?*

$$Z = \frac{8 - 4.44}{1.49} = 2.39$$

Beyond 2: **unusual**. The tail agrees, $P(X \ge 8) = 0.0165 + 0.0024 + 0.0001 = 0.019 < 0.025$.

```widget
hyper-vs-binom
{ "preset": "Mac users (N = 90)", "x": 8, "title": "Mac users: n/N = 11 % fails the 5 % rule; μ = 4.44, σ = 1.49 against the binomial's 1.57; Z for x = 8" }
```

```r
N <- 90
K <- 40
n <- 10
p <- K/N
dhyper(4, K, N-K, n)
phyper(4, K, N-K, n)
mu <- n*K/N
sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))
c(mu, sig)
X.vals <- 0:n
p.vals <- dhyper(X.vals, K, N-K, n)
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="x", ylab="P(x)", main="Number of Mac Users in a Sample (n=10)")
round(p.vals, 4)
X <- 8
Z <- (X-mu)/sig
Z
```

```text
[1] 0.2538614
[1] 0.5188862
[1] 4.444444 1.489781
 [1] 0.0018 0.0175 0.0732 0.1725 0.2539 0.2437 0.1545 0.0639 0.0165 0.0024
[11] 0.0001
[1] 2.386629
```

`phyper(4, K, N-K, n)` is the cumulative $P(X \le 4)$, the same five-term sum in one call.

:::info Where the numbers come from
Pages 65 to 67 of the posted notes are blank apart from the two printed R lines for the jacks; the superdeck and every Mac-users answer are computed here and checked against the demo notebook's `dhyper`, `phyper`, `c(mu, sig)` and `Z` outputs.
:::

:::quiz Three arguments, none of them N
`dhyper(x, K, N-K, n)` wants successes, failures, draws. Writing `dhyper(4, 40, 90, 10)` describes a population of 130 and gives the wrong answer with no error message.
:::

```quiz
[
  {
    "q": "Which row of the binomial-versus-hypergeometric comparison is wrong?",
    "options": ["Binomial: trials independent; hypergeometric: trials dependent", "Binomial: with replacement or an infinite population; hypergeometric: without replacement from a finite population", "Binomial: p changes from trial to trial; hypergeometric: same p every trial", "Binomial: same p every trial; hypergeometric: the probability of success changes for subsequent trials"],
    "answer": 2,
    "explain": "It is reversed. Replacement keeps p constant (binomial); removing an object changes the odds for the next draw (hypergeometric)."
  },
  {
    "q": "A box holds N = 20 parts, K = 8 of them defective. A sample of n = 5 is drawn without replacement. P(exactly 2 defective) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.3973,
    "tolerance": 0.0002,
    "explain": "C(8,2) · C(12,3) / C(20,5) = 28 × 220 / 15 504 = 6160/15 504 = 0.3973. In R: dhyper(2, 8, 12, 5)."
  },
  {
    "q": "In $P(x) = C(K, x) \\cdot C(N - K, n - x) / C(N, n)$, the factor $C(N - K, n - x)$ counts...",
    "options": ["the ways to choose the successes", "the ways to choose the n − x failures in the sample from the N − K failures in the population", "every possible sample of size n", "the ways to choose x objects from N"],
    "answer": 1,
    "explain": "Failures appear in both slots: N − K available, n − x needed. C(K, x) picks the successes and C(N, n) is the whole sample space."
  },
  {
    "q": "Which sample satisfies the 5 % rule, so the binomial is an acceptable stand-in?",
    "options": ["n = 10 from N = 90", "n = 25 from N = 400", "n = 20 from N = 500", "n = 5 from N = 52"],
    "answer": 2,
    "explain": "n/N: 10/90 = 11 %, 25/400 = 6.25 %, 20/500 = 4 %, 5/52 = 9.6 %. Only 4 % is 5 % or less."
  },
  {
    "q": "Class of 90 with 40 Mac users, sample of 10. μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 4.44,
    "tolerance": 0.01,
    "explain": "μ = n · K/N = 10 × 40/90 = 4.44, the same as the binomial's np with p = 40/90."
  },
  {
    "q": "Same class. σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 1.49,
    "tolerance": 0.01,
    "explain": "σ² = 10 (40/90)(50/90)(80/89) = 2.2194, σ = 1.49. Without the correction factor 80/89 the binomial gives 1.57."
  },
  {
    "q": "Same class. Z for a sample with 8 Mac users = ? (2 decimals)",
    "type": "numeric",
    "answer": 2.39,
    "tolerance": 0.02,
    "explain": "Z = (8 − 4.44)/1.49 = 2.39, beyond 2: unusually high. The tail P(X ≥ 8) = 0.019 is below 0.025 too."
  },
  {
    "type": "fill",
    "q": "Complete the R call for P(X = 4) Mac users in a sample of 10 from 90 students, 40 of them Mac users.",
    "code": "dhyper(4, ___, ___, 10)",
    "answer": ["40", "50"],
    "explain": "dhyper(x, K, N − K, n): 40 successes, 50 failures, 10 draws. It returns 0.2538614."
  },
  {
    "q": "For the same N, K and n (with n > 1), the hypergeometric σ is always smaller than the binomial σ with p = K/N.",
    "type": "tf",
    "answer": true,
    "explain": "σ²_hyper = npq × (N − n)/(N − 1), and the correction factor is below 1 whenever n > 1: Mac users 1.49 against 1.57. The means are equal."
  },
  {
    "q": "Five cards from one deck gave P(2 jacks) = 0.0399 (hypergeometric) against 0.0465 (binomial); from a 10-deck superdeck the hypergeometric answer is 0.0460. Why did it move toward the binomial?",
    "options": ["Because the superdeck has more jacks, so p went up", "Because n/N fell from 9.6 % to 0.96 %, so removing a card barely changes the next draw", "Because C(520, 5) is larger", "It did not; the binomial answer changed instead"],
    "answer": 1,
    "explain": "p = 40/520 = 4/52 is unchanged, so the binomial still gives 0.0465. The sample is now under 1 % of the population, inside the 5 % rule, and the two models nearly agree."
  }
]
```
