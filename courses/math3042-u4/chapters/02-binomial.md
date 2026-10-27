---
title: Binomial experiments and the binomial formula
minutes: 27
---
<!-- facts: classic.scroll.tiers, gms.starforce.rates-0-14, gms.starforce.star-catch, poe1.vaal.gem-outcomes -->

How many of the scrolls you pass on an item will succeed? *There are some random experiments that are so commonly used that statisticians have developed exact formulas dealing with them*: the Binomial, Geometric, Hypergeometric and Poisson distributions. The binomial comes first: it counts successes in a fixed number of independent trials.

## A trial has two outcomes; X counts the successes

*Here a trial is any random experiment that has just two possible outcomes. By convention, these two outcomes are called "success" and "failure"*: Win/Lose, Live/Die, True/False, Pass/Fail. "Success" is whatever the question counts, not necessarily the good outcome.

*The binomial distribution arises when we are concerned with the variable $X$ = the number of "successes" in a series of $n$ independent trials.*

## Online shopping: the four conditions

*Suppose $n = 50$ online shoppers visit your website during one hour. For each visitor, the probability that they complete a sale is $p = 25\%$. Let $X$ = the number of visitors who complete a sale.* *The probability distribution of $X$ is a binomial distribution, assuming that:*

1. **Fixed $n$**: the total number of visitors is known and fixed.
2. **Success/Failure**: each visitor either completes a sale or not.
3. **Equal $p$**: each visitor has the same probability of completing a sale.
4. **Independence**: each visitor's outcome is unaffected by other visitors' outcomes.

Drawing cards without replacement breaks 3 and 4 at once (the hypergeometric distribution handles that); "keep rolling until a 6" breaks 1 (the geometric).

## The shape of the shoppers' distribution

The demo notebook builds $P(0), \ldots, P(50)$ with `choose()` and draws the probability histogram: a bell peaking at 12 and 13 (about 0.13 each), essentially zero past 25.

```r
n <- 50
p <- 0.25
X.vals <- 0:n
p.vals <- numeric(n+1)
for (x in 0:n){
  p.vals[x+1] = choose(n, x)*p^x*(1-p)^(n-x)
}
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="X = # Sales", ylab="P(X)",
        main="Probability Distribution of X")
```

`p.vals[x+1]` holds $P(X = x)$ because R vectors start at index 1 and $x$ starts at 0.

```widget
binomial-calc
{ "n": 50, "p": 0.25, "x": 6, "op": "eq", "preset": "online shoppers", "conditions": true, "title": "Online shoppers: the four conditions and P(X = 6) with the formula substituted" }
```

## The binomial formula

*If a variable $X$ satisfies the conditions of a binomial variable, with $n$ trials and probability $p$ of success, then*

$$P(x) = nCx \cdot p^x \cdot q^{n-x}, \qquad nCx = \frac{n!}{(n-x)!\,x!}, \qquad q = 1 - p$$

Read it as three factors: $nCx$ counts which $x$ of the $n$ trials are the successes; $p^x$ is the probability those $x$ trials succeed; $q^{n-x}$ is the probability the other $n - x$ trials fail. The exponent on $q$ is $n - x$, the number of failures. On the calculator $nCx$ is `n  2ndF  nCr  x`; in R it is `choose(n, x)`.

## Seven Intermediate scrolls at 60 % each

In MapleStory Classic an Intermediate scroll, the second of the four scroll tiers, succeeds 60 % of the time, by meowdb's copy of the in-game item text [Classic, Classic World Intermediate scroll, checked 2026-10-27]. You plan to use 7 of them on one item, and X = the number that succeed. Each use passes with the same fixed 60 %, one use does not change the next, and n = 7 is fixed in advance, so X is binomial with $n = 7$, $p = 0.6$.

```quiz
[
  {"q": "7 Intermediate scrolls, each succeeding with p = 0.6. P(exactly 5 succeed) = ? (4 decimals)", "type": "numeric", "answer": 0.2613, "tolerance": 0.0001, "explain": "C(7, 5) · 0.6⁵ · 0.4² = 21 × 0.07776 × 0.16 = 0.2613. The q exponent is the number of failed scrolls, 7 − 5 = 2."},
  {"q": "Same 7 scrolls. P(at least 5 succeed) = ? (4 decimals)", "type": "numeric", "answer": 0.4199, "tolerance": 0.0001, "explain": "At least 5 means 5, 6 or 7: P(5) + P(6) + P(7) = 0.2613 + 7 × 0.6⁶ × 0.4 + 0.6⁷ = 0.2613 + 0.1306 + 0.0280 = 0.4199. In R, 1 - pbinom(4, 7, 0.6)."}
]
```

$$P(X = 5) = C(7, 5) \cdot 0.6^5 \cdot 0.4^2 = 21 \times 0.07776 \times 0.16 = 0.2613$$

$$P(X \ge 5) = P(5) + P(6) + P(7) = 0.2613 + 0.1306 + 0.0280 = 0.4199$$

```r
dbinom(5, 7, 0.6)
1 - pbinom(4, 7, 0.6)
```

```text
[1] 0.2612736
[1] 0.419904
```

### Seven scroll uses: the eight bars and P(X ≥ 5)

```widget
binomial-calc
{ "n": 7, "p": 0.6, "x": 5, "op": "ge", "conditions": true, "presets": false, "title": "7 Intermediate scrolls at p = 0.6: the four conditions and P(X ≥ 5) = 0.4199" }
```

## P(X = 6) for the shoppers

```quiz
[
  {
    "q": "n = 50 shoppers, p = 0.25. P(X = 6) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0123,
    "tolerance": 0.0002,
    "explain": "C(50, 6) · 0.25⁶ · 0.75⁴⁴ = 15 890 700 × 2.441 × 10⁻⁴ × 3.182 × 10⁻⁶ = 0.0123 (R: 0.01234465)."
  }
]
```

$$P(X = 6) = C(50, 6) \cdot 0.25^6 \cdot 0.75^{44} = 15\,890\,700 \times 2.441 \times 10^{-4} \times 3.182 \times 10^{-6} = 0.0123$$

```widget
counting-calc
{ "n": 50, "r": 6, "kind": "comb", "presets": false }
```

```r
choose(50, 6) * 0.25^6 * 0.75^44
```

```text
[1] 0.01234465
```

## Rolling 3s: the full table for n = 5

*Rolling a fair die 5 times and counting the number of 3s obtained is an example of a binomial experiment. Here $X$ = the number of 3s obtained.* Check the conditions: $n = 5$ is fixed; each roll is a 3 (success) or not; $p = \frac16$ on every roll; the rolls are independent. With $q = \frac56$:

| $x$ | formula | fraction | $P(x)$ |
|---|---|---|---|
| 0 | $C(5,0)\,(\frac16)^0 (\frac56)^5$ | $3125/7776$ | 0.4019 |
| 1 | $C(5,1)\,(\frac16)^1 (\frac56)^4 = 5 \cdot \frac16 \cdot \frac{625}{1296}$ | $3125/7776$ | 0.4019 |
| 2 | $C(5,2)\,(\frac16)^2 (\frac56)^3 = 10 \cdot \frac{1}{36} \cdot \frac{125}{216}$ | $1250/7776$ | 0.1608 |
| 3 | $C(5,3)\,(\frac16)^3 (\frac56)^2 = 10 \cdot \frac{1}{216} \cdot \frac{25}{36}$ | $250/7776$ | 0.0322 |
| 4 | $C(5,4)\,(\frac16)^4 (\frac56)^1 = 5 \cdot \frac{1}{1296} \cdot \frac56$ | $25/7776$ | 0.0032 |
| 5 | $C(5,5)\,(\frac16)^5 (\frac56)^0$ | $1/7776$ | 0.0001 |

The fractions add to $7776/7776 = 1$. Zero 3s and exactly one 3 are equally likely, and the histogram falls off fast to the right.

```widget
binomial-calc
{ "preset": "number of 3s in 5 rolls", "x": 2, "op": "eq", "conditions": true, "title": "Number of 3s in 5 rolls: the six bars and each P(x) substituted" }
```

`dbinom(x, n, p)` is R's binomial formula; the demo checks it against `choose()` for the first three values.

```r
n <- 5
p <- 1/6
X.vals <- 0:5
p.vals <- dbinom(X.vals, n, p)
barplot(p.vals, names.arg=X.vals, space=0, col="pink",
        xlab="x", ylab="P(x)", main="Number of 3s Rolled For n=5 Dice")
round(p.vals, 4)
(5/6)^5
dbinom(0, 5, 1/6)
choose(5,1)*(1/6)*(5/6)^4
dbinom(1, 5, 1/6)
choose(5,2)*(1/6)^2*(5/6)^3
dbinom(2, 5, 1/6)
```

```text
[1] 0.4019 0.4019 0.1608 0.0322 0.0032 0.0001
[1] 0.4018776
[1] 0.4018776
[1] 0.4018776
[1] 0.4018776
[1] 0.160751
[1] 0.160751
```

Lab 4's `dice3` experiment is this distribution by simulation: the relative-frequency bars settle on 0.40, 0.40, 0.16, 0.03 as $m$ grows.

```widget
sim-lab
{ "experiment": "dice3", "n": 5, "m": 10000, "title": "Number of 3s in 5 dice, 10 000 trials: relative frequencies against the binomial table" }
```

## Five cards with replacement: 2 jacks, and at least 2 jacks

*Suppose 5 cards are selected with replacement from a deck.* Replacement puts each card back before the next draw, so every draw is from the full deck: $p = 4/52$ on every trial and the draws are independent, a binomial with $n = 5$.

**Exactly 2 jacks:**

$$P(X = 2) = C(5, 2) \left(\tfrac{4}{52}\right)^2 \left(\tfrac{48}{52}\right)^3 = 10 \times 0.005917 \times 0.7865 = 0.0465$$

**At least 2 jacks** means $X \in \{2, 3, 4, 5\}$; the short route is the complement of $\{0, 1\}$:

$$P(X \ge 2) = 1 - P(0) - P(1) = 1 - \left(\tfrac{48}{52}\right)^5 - 5 \left(\tfrac{4}{52}\right)\left(\tfrac{48}{52}\right)^4 = 1 - 0.6702 - 0.2792 = 0.0506$$

```widget
binomial-calc
{ "preset": "2 jacks in 5 (with replacement)", "x": 2, "op": "ge", "title": "Jacks in 5 cards with replacement: the bars for = 2 and for ≥ 2" }
```

`pbinom(x, n, p)` is the cumulative $P(X \le x)$, so $P(X \ge 2) = 1 - P(X \le 1)$ is `1 - pbinom(1, ...)`.

```r
dbinom(2, 5, 4/52)
dbinom(0, 5, 4/52)
dbinom(1, 5, 4/52)
1 - pbinom(1, 5, 4/52)
```

```text
[1] 0.04654006
[1] 0.6701769
[1] 0.2792404
[1] 0.05058269
```

:::quiz Complements and exponents
"At least 2" is $1 - P(0) - P(1)$, not $1 - P(2)$. The failure factor is $q^{n - x}$: for 2 jacks in 5 cards it is $(48/52)^3$, three failures, not $(48/52)^2$.
:::

## Six items tapped once at 12→13, and Vaal Orbs on ten gems

Star Force, the GMS enhancement that adds stars to gear, succeeds 40 % at 12→13 on the wiki's table [GMS, Star Force 12→13 wiki table, checked 2026-10-27], without the Star Catching bonus that v.271 builds in; below 15 stars a non-Superior item keeps its star when a tap fails. A Vaal Orb on a PoE1 skill gem adds one level with probability 1/8, the wiki gives [PoE1, 3.29 Allflame Vaal Orb on a gem, checked 2026-10-27].

```quiz
[
  {"q": "Six different non-Superior items are each tapped once at 12→13 (p = 0.40), and X = the number of successes. Name the distribution of X (one word).", "type": "text", "answer": ["binomial", "binomial distribution", "Binomial"], "explain": "Fixed n = 6 taps, each a success or not, the same p = 0.40 on every item, and one item's tap does not affect another's: binomial with n = 6, p = 0.4."},
  {"q": "Same six taps. P(X = 2) = ? (4 decimals)", "type": "numeric", "answer": 0.311, "tolerance": 0.0001, "explain": "C(6, 2) · 0.4² · 0.6⁴ = 15 × 0.16 × 0.1296 = 0.3110. The q exponent is the number of failed taps, 6 − 2 = 4."},
  {"type": "fill", "q": "Complete the R call for P(X = 2) on the six taps.", "code": "dbinom(___, 6, 0.4)", "answer": ["2"], "explain": "dbinom(x, n, p): the count x = 2 first, then n = 6 taps, then p = 0.4. It returns 0.31104."},
  {"q": "Same six taps. P(at least one success) = ? (4 decimals)", "type": "numeric", "answer": 0.9533, "tolerance": 0.0001, "explain": "At least one is the complement of none: 1 − P(0) = 1 − 0.6⁶ = 1 − 0.0467 = 0.9533. In R, 1 - dbinom(0, 6, 0.4)."},
  {"q": "A Vaal Orb is used on each of 10 skill gems, and X = the number of gems that gain a level (p = 1/8 each). P(X = 2) = ? (4 decimals)", "type": "numeric", "answer": 0.2416, "tolerance": 0.0001, "explain": "C(10, 2) · (1/8)² · (7/8)⁸ = 45 × 0.015625 × 0.343609 = 0.2416. In R, dbinom(2, 10, 1/8)."},
  {"q": "One item is tapped at 12→13 again and again until it succeeds, and X counts the taps. Which binomial condition fails?", "options": ["A fixed number of trials n", "The same p on every trial", "Independent trials", "Two outcomes per trial"], "answer": 0, "explain": "Below 15 stars a failure keeps the star, so every tap is still 0.40 and independent of the last, with two outcomes. What is missing is a fixed n: the count of taps is open-ended, which is the geometric distribution."}
]
```

```quiz
[
  {
    "q": "Which scenario is NOT a binomial experiment?",
    "options": ["Flip a coin 20 times and count the heads", "Draw 5 cards without replacement and count the jacks", "Ask 50 visitors independently whether they bought, each with probability 0.25", "Roll a die 5 times and count the 3s"],
    "answer": 1,
    "explain": "Without replacement the probability of a jack changes after each draw and the draws are dependent, breaking conditions 3 (equal p) and 4 (independence). That case is the hypergeometric distribution."
  },
  {
    "q": "The binomial formula is $P(x) = nCx \\cdot p^x \\cdot q^{\\,?}$. The exponent on $q$ is...",
    "options": ["$x$", "$n$", "$n - x$", "$x - 1$"],
    "answer": 2,
    "explain": "q^(n−x) is the probability that the other n − x trials fail; nCx counts which x trials are the successes."
  },
  {
    "q": "n = 8 trials, p = 0.3. P(X = 2) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.2965,
    "tolerance": 0.0002,
    "explain": "C(8, 2) · 0.3² · 0.7⁶ = 28 × 0.09 × 0.117649 = 0.2965. In R: dbinom(2, 8, 0.3)."
  },
  {
    "q": "Write P(X = 6) for the 50 shoppers (p = 0.25) as the binomial formula with the numbers substituted. Use C(n,x), ^ for powers, * between factors, no spaces.",
    "type": "text",
    "answer": ["C(50,6)*0.25^6*0.75^44", "C(50,6)*(0.25)^6*(0.75)^44", "50C6*0.25^6*0.75^44", "50C6*(0.25)^6*(0.75)^44", "choose(50,6)*0.25^6*0.75^44", "C(50,6)*0.25^6*(1-0.25)^44"],
    "explain": "nCx · p^x · q^(n−x) with n = 50, x = 6, p = 0.25, q = 0.75: C(50,6)·0.25⁶·0.75⁴⁴ = 0.0123. The q exponent is the number of failures, 50 − 6 = 44."
  },
  {
    "type": "fill",
    "q": "Fill in the count and the two exponents for P(X = 6) with n = 50, p = 0.25.",
    "code": "C(50, ___) · 0.25^___ · 0.75^___",
    "answer": ["6", "6", "44"],
    "explain": "x = 6 successes, each with p = 0.25, and n − x = 44 failures, each with q = 0.75."
  },
  {
    "q": "A die is rolled 5 times. P(at least one 3) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.5981,
    "tolerance": 0.0002,
    "explain": "1 − P(0) = 1 − (5/6)⁵ = 1 − 0.4019 = 0.5981. 'At least one' is the complement of none."
  },
  {
    "type": "fill",
    "q": "Complete the R call for P(exactly 2 threes in 5 rolls).",
    "code": "dbinom(___, ___, 1/6)",
    "answer": ["2", "5"],
    "explain": "dbinom(x, n, p): the value x first, then the number of trials n, then p. It returns 0.160751 = C(5,2)(1/6)²(5/6)³."
  },
  {
    "q": "Five cards with replacement. Which expression gives P(at least 2 jacks)?",
    "options": ["$1 - P(2)$", "$P(2) + P(3)$", "$1 - P(0) - P(1)$", "$1 - P(0)$"],
    "answer": 2,
    "explain": "At least 2 means 2, 3, 4 or 5; its complement is {0, 1}: 1 − 0.6702 − 0.2792 = 0.0506. In R, 1 − pbinom(1, 5, 4/52)."
  },
  {
    "q": "Five cards with replacement. P(exactly 2 jacks) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0465,
    "tolerance": 0.0002,
    "explain": "C(5,2) (4/52)² (48/52)³ = 10 × 0.005917 × 0.7865 = 0.0465."
  },
  {
    "q": "In R, `pbinom(1, 5, 4/52)` returns...",
    "options": ["$P(X = 1)$", "$P(X \\le 1)$", "$P(X \\ge 1)$", "$P(X > 1)$"],
    "answer": 1,
    "explain": "The p-functions are cumulative: pbinom(x, n, p) = P(X ≤ x) = P(0) + … + P(x). dbinom gives the single value P(X = x)."
  },
  {
    "q": "For the rolling-3s experiment (n = 5, p = 1/6), P(X = 0) and P(X = 1) are equal.",
    "type": "tf",
    "answer": true,
    "explain": "P(0) = (5/6)⁵ = 3125/7776 and P(1) = 5 (1/6)(5/6)⁴ = 3125/7776: both 0.4019, because 5 × (1/6) = (5/6) × 1 trades one factor of 5/6 for the 5 ways to place the single 3."
  }
]
```
