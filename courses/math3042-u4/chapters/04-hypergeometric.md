---
title: Hypergeometric: sampling without replacement, and the 5% rule
minutes: 27
---
<!-- facts: poe1.ladder.hc-dead-by-rank, gms.data.ranking-overall-legendary-2026-10-27 -->

Pick 20 characters from the top of a ladder and count the dead: every pick changes $p$ for the next, so the binomial formula is wrong.

The hypergeometric distribution is the exact formula, and the 5 % rule says when the binomial is close enough.

## Binomial versus hypergeometric

*The hypergeometric distribution is similar to the binomial distribution. In both cases, we are concerned with the variable $X$ = number of successes in a series of $n$ trials.* The difference:

| Binomial | Hypergeometric |
|---|---|
| trials are *independent* | trials are *dependent* |
| sampling *with replacement*, or sampling from an *infinite* population | sampling *without replacement* from a finite population |
| same probability $p$ for each trial | probability of success changes for subsequent trials |

*If the number of trials, $n$, is small compared to the population size, then the Binomial model and the Hypergeometric model give very similar probabilities.*

## The formula: N objects, K successes, a sample of n

*Suppose a population of $N$ objects contains $K$ "success" objects and $N - K$ "failure" objects. If you select a random sample of size $n$ from this population, let $X$ = the number of "success" objects in the sample.* Then

$$P(x) = \frac{C(K, x) \cdot C(N - K,\ n - x)}{C(N, n)}, \qquad x = 0, 1, 2, \ldots, n$$

$C(N, n)$ counts every possible sample, $C(K, x)$ the ways to pick the $x$ successes, $C(N - K, n - x)$ the ways to pick the $n - x$ failures.

For two jacks in five cards the deck splits into two piles:

```diagram
{ "type": "tree", "title": "Two jacks in five cards: every letter of the formula", "nodes": [
  { "id": "deck", "label": "Deck N = 52" },
  { "id": "jacks", "label": "K = 4 jacks", "parent": "deck" },
  { "id": "others", "label": "N − K = 48 others", "parent": "deck" },
  { "id": "pickj", "label": "pick x = 2", "sub": "C(4, 2) ways", "parent": "jacks" },
  { "id": "picko", "label": "pick n − x = 3", "sub": "C(48, 3) ways", "parent": "others" }
], "hi": ["pickj", "picko"], "caption": "A sample of n = 5 takes x = 2 from the jacks and n − x = 3 from the others: C(4, 2) · C(48, 3) such samples out of C(52, 5)." }
```

The same five letters for the three examples of this lesson:

| | $N$ | $K$ | $N - K$ | $n$ | $x$ |
|---|---|---|---|---|---|
| Jacks | 52 | 4 | 48 | 5 | 2 |
| Mac users | 90 | 40 | 50 | 10 | 4 |
| Hardcore top 200 | 200 | 69 | 131 | 20 | 7 |

$$\mu = n \cdot \frac{K}{N}, \qquad \sigma^2 = n \cdot \frac{K}{N} \cdot \frac{N - K}{N} \cdot \frac{N - n}{N - 1}$$

With $p = K/N$ these are the binomial's $np$ and $npq$, the variance times a correction factor that is below 1 whenever $n > 1$:

$$\dfrac{N - n}{N - 1} < 1$$

Sampling without replacement has the same mean and a smaller spread.

## Two jacks in five cards, without and with replacement

```quiz
[
  {
    "q": "5 cards from a deck of 52 (4 jacks), without replacement. P(exactly 2 jacks) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0399,
    "tolerance": 0.0002,
    "explain": "$$\\dfrac{C(4, 2) · C(48, 3)}{C(52, 5)} = \\dfrac{6 × 17\\,296}{2\\,598\\,960} = \\dfrac{103\\,776}{2\\,598\\,960} = \\mathbf{0.0399}$$"
  }
]
```

*Suppose you sample 5 cards from a deck of 52 cards. Let $X$ = the number of Jacks you get in the sample (there are 4 Jacks in the deck). What is $P(X = 2)$?*

Substitute $N = 52$, $K = 4$, $n = 5$, $x = 2$:

$$P(X = 2) = \frac{C(4, 2) \cdot C(48, 3)}{C(52, 5)} = \frac{6 \times 17\,296}{2\,598\,960} = \frac{103\,776}{2\,598\,960} = \mathbf{0.0399}$$

With replacement (last lesson's binomial, $p = 4/52$):

$$C(5, 2)(4/52)^2(48/52)^3 = \mathbf{0.0465}$$

```widget
hyper-vs-binom
{ "N": 52, "K": 4, "n": 5, "x": 2, "decks": 1, "preset": "jacks in 5 cards", "title": "Jacks in 5 cards: hypergeometric beside binomial, for one deck up to the 10-deck superdeck" }
```

### Dealing without replacement: p changes card by card

The chance that the next card is a jack moves with every card dealt (4/52, then 3/51 after a jack or 4/51 after a non-jack) while the binomial keeps 4/52; in the superdeck it barely moves.

```widget
deal-play
{}
```

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

:::info R syntax
| Code | What it does |
|---|---|
| `N <- 52`, `K <- 4`, `n <- 5` | `<-` is assignment: each number is stored under its name. R is case-sensitive, so `N` and `n` are different names. |
| `choose(K, 2)*choose(N-K, n-2) / choose(N, n)` | The formula by hand: `choose()` counts combinations, `-` subtracts, `*` multiplies and `/` divides. |
| `dhyper(2, 4, 48, 5)` | `dhyper(x, m, n, k)`: x = 2 jacks, m = 4 jacks in the deck, n = 48 non-jacks, k = 5 cards drawn. R's `n` is the failures, not the lesson's n. |
| `choose(5,2)*(4/52)^2*(48/52)^3` | The binomial formula by hand; the brackets make each division happen before its power `^`. |
| `dbinom(2, 5, 4/52)` | `dbinom(x, size, prob)`: x = 2, size = 5 (n), prob = 4/52 (p). |
| `[1]` | R starts each printed line with the position of its first value; `[1]` means value 1. |

**Left to right**

- `N <- 52`, `K <- 4`, `n <- 5`: "Store under the names N, K and n (`N <-`, `K <-`, `n <-`) the numbers 52, 4 and 5."
- `choose(K, 2)*choose(N-K, n-2) / choose(N, n)`: "The combinations (`choose`) of K and 2 times (`*`) the combinations of N minus K (`N-K`) and n minus 2 (`n-2`), divided by (`/`) the combinations of N and n (`choose(N, n)`)."
- `dhyper(2, 4, 48, 5)`: "The hypergeometric probability (`dhyper`) of 2 successes (`x = 2`) when the population has 4 successes (`m = 4`) and 48 failures (`n = 48`) and 5 are drawn (`k = 5`)."
- `choose(5,2)*(4/52)^2*(48/52)^3`: "The combinations (`choose`) of 5 and 2 times (`*`) 4/52 squared (`(4/52)^2`) times (`*`) 48/52 cubed (`(48/52)^3`)."
- `dbinom(2, 5, 4/52)`: "The binomial probability (`dbinom`) of 2 successes (`x = 2`) in 5 trials (`size = 5`) at 4/52 (`prob = 4/52`)."

**Right to left**, the order R runs it

- `N <- 52`, `K <- 4`, `n <- 5`: "Take 52, 4 and 5 and store them as N, K and n (`N <-`, `K <-`, `n <-`)."
- `choose(K, 2)*choose(N-K, n-2) / choose(N, n)`: "Work out N minus K and n minus 2 (`N-K`, `n-2`), count the three sets of combinations (`choose`), multiply the first two (`*`), divide by the third (`/`), and print."
- `dhyper(2, 4, 48, 5)`: "Take x = 2, m = 4, n = 48 and k = 5, compute P(X = 2) (`dhyper`), and print."
- `choose(5,2)*(4/52)^2*(48/52)^3`: "Divide inside the brackets (`4/52`, `48/52`), raise to the powers (`^`), count the combinations (`choose`), multiply the three (`*`), and print."
- `dbinom(2, 5, 4/52)`: "Divide 4 by 52 (`4/52`), compute P(X = 2) for size 5 (`dbinom`), and print."
:::

:::warn R's dhyper slots are not the course's letters
`dhyper(x, K, N - K, n)` takes four arguments: the value $x$, the successes, the failures and the sample size, never $N$.

R names them x, m, n, k, so R's n is the failures, not the sample size.

`dhyper(2, 4, 48, 5)` is right. `dhyper(2, 4, 52, 5)` silently describes a deck of 4 + 52 = 56 cards and returns a wrong answer with no error.
:::

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(x, K, N - K, n)` | The slot pattern: R's `dhyper(x, m, n, k)` takes x, then m = K successes, then R's n = N − K failures, then k = the lesson's n drawn. |
| `dhyper(2, 4, 52, 5)` | x = 2, m = 4, n = 52, k = 5. R reads 52 as the failures, so the deck it uses has 4 + 52 = 56 cards. |

**Left to right**

- `dhyper(x, K, N - K, n)`: "The hypergeometric probability (`dhyper`) of x successes (`x`) with K successes (`K`) and N minus K failures (`N - K`) in the population and n drawn (`n`)."
- `dhyper(2, 4, 52, 5)`: "The hypergeometric probability (`dhyper`) of 2 jacks (`x = 2`) with 4 jacks (`m = 4`) and 52 non-jacks (`n = 52`) and 5 drawn (`k = 5`)."

**Right to left**, the order R runs it

- `dhyper(x, K, N - K, n)`: "Subtract K from N (`N - K`), then compute P(X = x) from x, K, the failures and n (`dhyper`)."
- `dhyper(2, 4, 52, 5)`: "Take 2, 4, 52 and 5 into the four slots, compute P(X = 2) for a deck of 56 (`dhyper`), and print."
:::

## The superdeck: ten decks shuffled together

*Now, suppose you combine 10 decks of cards into one "superdeck". If you randomly select 5 cards, what is the probability of getting 2 Jacks?*

Substitute $N = 520$, $K = 40$, $n = 5$:

$$P(X = 2) = \frac{C(40, 2) \cdot C(480, 3)}{C(520, 5)} = \frac{780 \times 18\,316\,960}{310\,784\,578\,104} = \mathbf{0.0460}$$

The binomial uses $p = 40/520 = 4/52$, so it still gives 0.0465.

The answers closed up because $n/N$ fell from $5/52 = 9.6\%$ to $5/520 = 0.96\%$.

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

:::info R syntax
| Code | What it does |
|---|---|
| `N <- 520`, `K <- 40`, `n <- 5` | As above; the new values replace the old ones. |
| `dhyper(2, K, N-K, 5)` | x = 2, m = `K` (40 jacks), n = `N-K` (480 non-jacks), k = 5 cards drawn. |
| `dbinom(2, 5, K/N)` | x = 2, size = 5, prob = `K/N`, the share of jacks in the superdeck. |

**Left to right**

- `N <- 520`, `K <- 40`, `n <- 5`: "Store under the names N, K and n (`N <-`, `K <-`, `n <-`) the numbers 520, 40 and 5."
- `dhyper(2, K, N-K, 5)`: "The hypergeometric probability (`dhyper`) of 2 jacks (`x = 2`) with K successes (`m = K`), N minus K failures (`n = N-K`) and 5 drawn (`k = 5`)."
- `dbinom(2, 5, K/N)`: "The binomial probability (`dbinom`) of 2 jacks (`x = 2`) in 5 cards (`size = 5`) at K over N (`prob = K/N`)."

**Right to left**, the order R runs it

- `N <- 520`, `K <- 40`, `n <- 5`: "Take 520, 40 and 5 and store them as N, K and n (`N <-`, `K <-`, `n <-`)."
- `dhyper(2, K, N-K, 5)`: "Look up K, subtract K from N (`N-K`), compute P(X = 2) (`dhyper`), and print."
- `dbinom(2, 5, K/N)`: "Divide K by N (`K/N`), compute P(X = 2) for size 5 (`dbinom`), and print."
:::

## The 5 % rule

*If the sample size $n$ is 5 % or less of the total population $N$, then probabilities calculated using Hypergeometric and Binomial distributions are practically the same.*

:::tip The 5 % rule in three steps
1. Compute $n/N$, the sample size over the population (not $K/N$, which is $p$).
2. If $n/N \le 0.05$, use the binomial with $p = K/N$; otherwise use the hypergeometric.
3. Why it works: each draw changes the next $p$ by about $1/N$, so $n$ draws change it by about $n/N$. A small $n/N$ leaves $p$ almost fixed.

One deck: $5/52 = 9.6\%$, and the binomial is off (0.0399 against 0.0465).

Superdeck: $5/520 = 0.96\%$, and the two agree (0.0460 against 0.0465).
:::

## Twenty characters from the Hardcore Allflame top 200

On Hardcore Allflame, the PoE1 ladder where a character that dies is flagged dead, 69 of the characters ranked 1–200 were dead when the official ladder API was read.

Pick 20 of those 200 at random, nobody twice; X = the number dead.

This is a fixed list of $N = 200$ with $K = 69$ dead, drawn without replacement, so $p$ changes after each draw: 69/200, then 68/199 after a dead pick.

A Star Force tap or a scroll use keeps its rate however many came before: that is why those were binomial.

```quiz
[
  {"q": "N = 200 characters, K = 69 dead, a sample of n = 20 without replacement. P(exactly 7 dead) = ? (4 decimals)", "type": "numeric", "answer": 0.1942, "tolerance": 0.0001, "explain": "$$\\dfrac{C(69, 7) · C(131, 13)}{C(200, 20)} = \\dfrac{1\\,078\\,897\\,248 × 2.9041 × 10^{17}}{1.6136 × 10^{27}} = \\dfrac{3.1333 × 10^{26}}{1.6136 × 10^{27}} = \\mathbf{0.1942}$$ The failures slot is N − K = 131 alive characters, of which n − x = 13 are picked."},
  {"q": "Same draw. The 5 % rule lets the binomial with p = 69/200 stand in.", "type": "tf", "answer": false, "explain": "$$n/N = 20/200 = 10\\%$$ That is above 5 %. The binomial gives 0.1842 for X = 7 against the exact 0.1942."}
]
```

Substitute $N = 200$, $K = 69$, $n = 20$, $x = 7$:

$$P(X = 7) = \frac{C(69, 7) \cdot C(131, 13)}{C(200, 20)} = \frac{3.1333 \times 10^{26}}{1.6136 \times 10^{27}} = \mathbf{0.1942}$$

The mean:

$$\mu = 20 \cdot \frac{69}{200} = \mathbf{6.9}$$

The correction factor shrinks the spread:

$$\sigma^2 = 20 \cdot \tfrac{69}{200} \cdot \tfrac{131}{200} \cdot \tfrac{180}{199} = 4.5195 \times 0.9045 = 4.0880, \qquad \sigma = \mathbf{2.02}$$

The binomial, without the factor, gives:

$$\sqrt{4.5195} = 2.13$$

```r
dhyper(7, 69, 131, 20)
dbinom(7, 20, 69/200)
```

```text
[1] 0.1941807
[1] 0.1841978
```

:::info R syntax
| Code | What it does |
|---|---|
| `dhyper(7, 69, 131, 20)` | x = 7, m = 69 dead characters, n = 131 alive ones, k = 20 picked. |
| `dbinom(7, 20, 69/200)` | x = 7, size = 20 (n), prob = 69/200 (p), the binomial stand-in. |

**Left to right**

- `dhyper(7, 69, 131, 20)`: "The hypergeometric probability (`dhyper`) of 7 dead (`x = 7`) with 69 dead (`m = 69`) and 131 alive (`n = 131`) in the list and 20 picked (`k = 20`)."
- `dbinom(7, 20, 69/200)`: "The binomial probability (`dbinom`) of 7 dead (`x = 7`) in 20 picks (`size = 20`) at 69 over 200 (`prob = 69/200`)."

**Right to left**, the order R runs it

- `dhyper(7, 69, 131, 20)`: "Take x = 7, m = 69, n = 131 and k = 20, compute P(X = 7) (`dhyper`), and print."
- `dbinom(7, 20, 69/200)`: "Divide 69 by 200 (`69/200`), compute P(X = 7) for size 20 (`dbinom`), and print."
:::

### Twenty picks from 200: hypergeometric beside binomial

```widget
hyper-vs-binom
{ "N": 200, "K": 69, "n": 20, "x": 7, "zx": 12, "presets": false, "title": "20 of the Hardcore Allflame top 200 (69 dead): n/N = 10 %, so the binomial overstates the spread" }
```

## Mac users: N = 90, K = 40, n = 10

*Suppose a class of 90 students has 40 Apple Mac users. To conduct a market research survey, you randomly select a sample of 10 students. Let $X$ = the number of Apple Mac users in the sample.*

Without replacement, *$X$ is a hypergeometric variable with parameters* $N = 90$, $K = 40$, $n = 10$.

$n/N = 10/90 = 11\%$ fails the 5 % rule, so the binomial will not do.

**(a)** *What is the probability that 4 students in the sample are Apple Mac users?*

```quiz
[
  {
    "q": "Mac users: N = 90, K = 40, n = 10. P(X = 4) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.2539,
    "tolerance": 0.0002,
    "explain": "$$\\dfrac{C(40, 4) · C(50, 6)}{C(90, 10)} = \\dfrac{91\\,390 × 15\\,890\\,700}{5.7206 × 10^{12}} = \\mathbf{0.2539}$$"
  }
]
```

Substitute $K = 40$, $N - K = 50$, $n = 10$, $x = 4$:

$$P(4) = \frac{C(40, 4) \cdot C(50, 6)}{C(90, 10)} = \frac{91\,390 \times 15\,890\,700}{5.7206 \times 10^{12}} = \frac{1.4523 \times 10^{12}}{5.7206 \times 10^{12}} = \mathbf{0.2539}$$

**(b)** *What is the probability that 4 or fewer of them are Apple Mac users?*

Five terms of the same formula. The whole table, from the R output below:

| $x$ | **0** | **1** | **2** | **3** | **4** | 5 | 6 | 7 | **8** | **9** | **10** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $P(x)$ | **0.0018** | **0.0175** | **0.0732** | **0.1725** | **0.2539** | 0.2437 | 0.1545 | 0.0639 | **0.0165** | **0.0024** | **0.0001** |

(b) adds the bold left cells; (e) adds the bold right ones.

For (b):

$$P(X \le 4) = P(0) + P(1) + P(2) + P(3) + P(4) = 0.0018 + 0.0175 + 0.0732 + 0.1725 + 0.2539 = \mathbf{0.5189}$$

**(c)** *What are the mean and standard deviation of $X$?*

$$\mu = 10 \cdot \frac{40}{90} = \mathbf{4.44}, \qquad \sigma^2 = 10 \cdot \frac{40}{90} \cdot \frac{50}{90} \cdot \frac{80}{89} = 2.2194, \qquad \sigma = \sqrt{2.2194} = \mathbf{1.49}$$

The binomial would give a larger spread:

$$\sqrt{10(0.444)(0.556)} = 1.57$$

The correction factor is $80/89 = 0.899$.

**(d)** *Generate a probability histogram of $X$.*

The printed histogram peaks at 4 (0.2539) with 5 just behind (0.2437).

**(e)** *If you found $X = 8$ Mac users, would this be considered unusual?*

$$Z = \frac{8 - 4.44}{1.49} = \mathbf{2.39}$$

Beyond 2: **unusual**.

The tail agrees:

$$P(X \ge 8) = 0.0165 + 0.0024 + 0.0001 = 0.019 < 0.025$$

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

:::info R syntax
| Code | What it does |
|---|---|
| `N <- 90`, `K <- 40`, `n <- 10` | As above, with the Mac class numbers. |
| `p <- K/N` | `/` divides: the share of Mac users. |
| `dhyper(4, K, N-K, n)` | x = 4, m = `K` (40), R's n = `N-K` (50 failures), k = `n` (the lesson's sample size, 10). |
| `phyper(4, K, N-K, n)` | `phyper(q, m, n, k)`: the same slots with q = 4, giving P(X ≤ 4). |
| `mu <- n*K/N` | `*` and `/` run left to right: nK/N. |
| `sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))` | Each bracket is worked out first; `sqrt()` roots the whole product. `p*(1-p)` is the formula's $\frac{K}{N} \cdot \frac{N-K}{N}$, since p = K/N. |
| `c(mu, sig)` | Prints μ and σ on one line. |
| `X.vals <- 0:n` | `a:b` is the whole numbers from a to b, here 0 to 10. |
| `p.vals <- dhyper(X.vals, K, N-K, n)` | x = the whole vector, so one call returns all eleven probabilities. |
| `barplot(p.vals, …)` | One bar per value; `p.vals` fills `height`. |
| `names.arg=X.vals` | The labels under the bars: 0 to 10. |
| `col="pink"`, `space=0` | The bar colour, and no gaps between bars. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title, as strings. |
| `round(p.vals, 4)` | `round(x, digits)`: each probability to 4 decimals. |
| `X <- 8`, `Z <- (X-mu)/sig`, `Z` | Stores the count, computes its Z-score (brackets first), then prints `Z`. |
| `[11]` | The long vector wraps; the second line starts at value 11, so its label is `[11]`. |

**Left to right**

- `N <- 90`, `K <- 40`, `n <- 10`: "Store under the names N, K and n (`N <-`, `K <-`, `n <-`) the numbers 90, 40 and 10."
- `p <- K/N`: "Store under the name p (`p <-`) K divided by N (`K/N`)."
- `dhyper(4, K, N-K, n)`: "The hypergeometric probability (`dhyper`) of 4 Mac users (`x = 4`) with K successes (`m = K`), N minus K failures (`n = N-K`) and n drawn (`k = n`)."
- `phyper(4, K, N-K, n)`: "The hypergeometric probability of at most (`phyper`) 4 Mac users (`q = 4`) with the same K, N minus K and n (`K`, `N-K`, `n`)."
- `mu <- n*K/N`: "Store under the name mu (`mu <-`) n times K divided by N (`n*K/N`)."
- `sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of n times p times 1 minus p (`n*p*(1-p)`) times N minus n (`N-n`) divided by N minus 1 (`/(N-1)`)."
- `c(mu, sig)`: "Combine (`c`) mu and sig (`mu`, `sig`)."
- `X.vals <- 0:n`: "Store under the name X.vals (`X.vals <-`) the whole numbers 0 to n (`0:n`)."
- `p.vals <- dhyper(X.vals, K, N-K, n)`: "Store under the name p.vals (`p.vals <-`) the hypergeometric probabilities (`dhyper`) of each x in X.vals (`X.vals`) for K, N minus K and n (`K`, `N-K`, `n`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of p.vals (`p.vals`), labelled 0 to 10 (`names.arg=X.vals`), in pink (`col="pink"`), with no gaps (`space=0`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`)."
- `round(p.vals, 4)`: "Round (`round`) p.vals (`p.vals`) to 4 decimals (`4`)."
- `X <- 8`, `Z <- (X-mu)/sig`, `Z`: "Store under the name X (`X <-`) 8; store under the name Z (`Z <-`) X minus mu (`X-mu`) divided by (`/`) sig; show Z (`Z`)."

**Right to left**, the order R runs it

- `N <- 90`, `K <- 40`, `n <- 10`: "Take 90, 40 and 10 and store them as N, K and n (`N <-`, `K <-`, `n <-`)."
- `p <- K/N`: "Divide K by N (`K/N`), then store it as p (`p <-`)."
- `dhyper(4, K, N-K, n)`: "Subtract K from N (`N-K`), compute P(X = 4) (`dhyper`), and print."
- `phyper(4, K, N-K, n)`: "Subtract K from N (`N-K`), compute P(X ≤ 4) (`phyper`), and print."
- `mu <- n*K/N`: "Multiply n by K, divide by N (`n*K/N`), then store it as mu (`mu <-`)."
- `sig <- sqrt(n*p*(1-p)*(N-n)/(N-1))`: "Work out each bracket (`1-p`, `N-n`, `N-1`), multiply and divide left to right (`*`, `/`), take the square root (`sqrt`), and store it as sig (`sig <-`)."
- `c(mu, sig)`: "Put mu and sig in one vector (`c`) and print it."
- `X.vals <- 0:n`: "Make 0 to 10 (`0:n`), then store it as X.vals (`X.vals <-`)."
- `p.vals <- dhyper(X.vals, K, N-K, n)`: "Subtract K from N (`N-K`), compute P(X = x) for every x in X.vals (`dhyper`), and store them as p.vals (`p.vals <-`)."
- `barplot(…)`: "Take the heights (`p.vals`), labels (`names.arg=X.vals`), colour (`col="pink"`), no gaps (`space=0`) and text labels (`xlab=`, `ylab=`, `main=`), and draw the bars (`barplot`)."
- `round(p.vals, 4)`: "Take p.vals, round each to 4 decimals (`round`), and print."
- `X <- 8`, `Z <- (X-mu)/sig`, `Z`: "Store 8 as X (`X <-`); subtract mu from X (`X-mu`), divide by sig (`/`) and store as Z (`Z <-`); then print Z (`Z`)."
:::

`phyper(4, K, N-K, n)` is the cumulative $P(X \le 4)$ in one call.

## Night Lords among 20 of the GMS top 500

Nexon's North America overall ranking lists 61 Night Lords, a GMS thief job, among its top 500 characters.

Pick 20 of the 500 at random without replacement; X = the number of Night Lords.

```quiz
[
  {"q": "20 picked from the 500. Does the 5 % rule hold?", "options": ["Yes: n/N = 20/500 = 4 %, so the binomial with p = 61/500 is a fair stand-in", "No: n/N = 20/500 = 4 % is above 5 %", "No: n/N = 61/500 = 12.2 %", "No: the rule needs sampling with replacement"], "answer": 0, "explain": "The rule compares the sample size with the population: n/N = 20/500 = 0.04 = 4 %, at most 5 %. 61/500 is p, not n/N."},
  {"q": "P(X = 2) by the hypergeometric formula = ? (4 decimals)", "type": "numeric", "answer": 0.2761, "tolerance": 0.0001, "explain": "N = 500, K = 61, n = 20: $$\\dfrac{C(61, 2) · C(439, 18)}{C(500, 20)} = \\dfrac{1830 × 4.0235 × 10^{31}}{2.6672 × 10^{35}} = \\mathbf{0.2761}$$"},
  {"type": "fill", "q": "Complete the R call for P(X = 2) Night Lords in the 20.", "code": "dhyper(2, 61, ___, 20)", "answer": ["439"], "explain": "dhyper(x, K, N − K, n): the successes K = 61, then the failures $$N − K = 500 − 61 = 439$$ then the sample size 20. It returns 0.2760602."},
  {"q": "P(X = 2) by the binomial stand-in, p = 61/500 = 0.122 = ? (4 decimals)", "type": "numeric", "answer": 0.2719, "tolerance": 0.0001, "explain": "$$C(20, 2) · 0.122^2 · 0.878^{18} = 190 × 0.014884 × 0.096139 = \\mathbf{0.2719}$$ That is within 0.005 of the exact 0.2761 because n/N is only 4 %. In R, dbinom(2, 20, 61/500)."},
  {"q": "μ = expected Night Lords among the 20 = ? (2 decimals)", "type": "numeric", "answer": 2.44, "tolerance": 0.05, "explain": "$$\\mu = n · K/N = 20 × 61/500 = \\mathbf{2.44}$$ It is the same as the binomial's np."},
  {"q": "Picking 50 of the 500 instead of 20, the 5 % rule still holds.", "type": "tf", "answer": false, "explain": "$$n/N = 50/500 = 10\\%$$ That is above 5 %. For X = 5 the hypergeometric gives 0.1694 and the binomial 0.1641."}
]
```

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
    "explain": "$$\\dfrac{C(8,2) · C(12,3)}{C(20,5)} = \\dfrac{28 × 220}{15\\,504} = \\dfrac{6160}{15\\,504} = \\mathbf{0.3973}$$ In R: dhyper(2, 8, 12, 5)."
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
    "explain": "$$\\mu = n · K/N = 10 × 40/90 = \\mathbf{4.44}$$ It is the same as the binomial's np with p = 40/90."
  },
  {
    "q": "Same class. σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 1.49,
    "tolerance": 0.01,
    "explain": "$$\\sigma^2 = 10 (40/90)(50/90)(80/89) = 2.2194, \\quad \\sigma = \\mathbf{1.49}$$ Without the correction factor 80/89 the binomial gives 1.57."
  },
  {
    "q": "Same class. Z for a sample with 8 Mac users = ? (2 decimals)",
    "type": "numeric",
    "answer": 2.39,
    "tolerance": 0.02,
    "explain": "$$Z = \\dfrac{8 − 4.44}{1.49} = \\mathbf{2.39}$$ Beyond 2: unusually high. The tail P(X ≥ 8) = 0.019 is below 0.025 too."
  },
  {
    "type": "fill",
    "q": "Complete the R call for P(X = 4) Mac users in a sample of 10 from 90 students, 40 of them Mac users.",
    "code": "dhyper(4, ___, ___, 10)",
    "answer": ["40", "50"],
    "explain": "dhyper(x, K, N − K, n): 40 successes, 50 failures, 10 draws. It returns 0.2538614."
  },
  {
    "type": "fill",
    "q": "Fill in the population counts for P(X = 4) Mac users (90 students, 40 Mac users, sample of 10).",
    "code": "C(___, 4) · C(___, 6) / C(90, 10)",
    "answer": ["40", "50"],
    "explain": "C(K, x) picks the 4 Mac users from the 40 available; C(N − K, n − x) picks the other 6 from the 50 non-Mac users."
  },
  {
    "q": "Write P(X = 4) for the Mac users (N = 90, K = 40, n = 10) as the hypergeometric formula with the numbers substituted. Use C(n,x), * and /, no spaces.",
    "type": "text",
    "answer": ["C(40,4)*C(50,6)/C(90,10)", "C(40,4)C(50,6)/C(90,10)", "(C(40,4)*C(50,6))/C(90,10)", "40C4*50C6/90C10", "(40C4*50C6)/90C10", "choose(40,4)*choose(50,6)/choose(90,10)"],
    "explain": "$$\\dfrac{C(K, x) · C(N − K, n − x)}{C(N, n)} = \\dfrac{C(40,4) · C(50,6)}{C(90,10)} = \\mathbf{0.2539}$$"
  },
  {
    "q": "You survey 10 of the 90 students, but each student is put back in the pool after answering and may be picked again. Which hypergeometric condition fails?",
    "options": ["sampling without replacement", "a fixed sample size n", "each object is a success or a failure", "a population of known size N"],
    "answer": 0,
    "explain": "Putting each student back keeps p = 40/90 on every draw and makes the draws independent: that is the binomial, not the hypergeometric."
  },
  {
    "q": "For the same N, K and n (with n > 1), the hypergeometric σ is always smaller than the binomial σ with p = K/N.",
    "type": "tf",
    "answer": true,
    "explain": "$$\\sigma^2_{\\text{hyper}} = npq × \\dfrac{N − n}{N − 1}$$ The correction factor is below 1 whenever n > 1: Mac users 1.49 against 1.57. The means are equal."
  },
  {
    "q": "Five cards from one deck gave P(2 jacks) = 0.0399 (hypergeometric) against 0.0465 (binomial); from a 10-deck superdeck the hypergeometric answer is 0.0460. Why did it move toward the binomial?",
    "options": ["Because the superdeck has more jacks, so p went up", "Because n/N fell from 9.6 % to 0.96 %, so removing a card barely changes the next draw", "Because C(520, 5) is larger", "It did not; the binomial answer changed instead"],
    "answer": 1,
    "explain": "p = 40/520 = 4/52 is unchanged, so the binomial still gives 0.0465. The sample is now under 1 % of the population, inside the 5 % rule, and the two models nearly agree."
  }
]
```
