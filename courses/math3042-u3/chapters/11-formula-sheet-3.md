---
title: Formula sheet (Unit 3)
minutes: 8
---

Everything from Unit 3 and Labs 3 and 4 on one page: the definitions, the rules, the worked numbers from the notes, and the R. No new explanations here; if a line does not make sense, go back to its lesson.

## Definitions

| Term | Meaning |
|---|---|
| random experiment | a procedure whose outcome cannot be predicted |
| sample space $S$ | the set of all possible outcomes |
| event $A$ | any subset of $S$ |
| random variable $X$ | a number that depends on the outcome |
| classical probability | $P(A) = \dfrac{\lvert A \rvert}{\lvert S \rvert}$, equally likely outcomes; $0 \le P(A) \le 1$, impossible 0, certain 1 |
| relative frequency | $P(A) \approx \dfrac{x}{n}$ after $n$ trials with $x$ successes |
| law of large numbers | $x/n \to P(A)$ as $n$ grows |
| mutually exclusive | cannot both occur in one trial: $P(A \cap B) = 0$ |
| independent | $P(A \cap B) = P(A)P(B)$, equivalently $P(B \mid A) = P(B)$ |
| exhaustive and mutually exclusive | $A_1, \ldots, A_k$ cover $S$ and do not overlap |

## Counting

| Rule | Formula | Use when |
|---|---|---|
| fundamental counting rule | $n_1 \times n_2 \times \cdots \times n_k$ (often $n^r$) | one choice from each set; repeats allowed (dice, coins, cards with replacement) |
| factorial | $n! = n(n-1)\cdots 1$ | all $n$ items in order |
| permutations | $P(n, r) = \dfrac{n!}{(n-r)!}$ | ordered sequence of $r$ from $n$, no repeats (calculator `nPr`) |
| combinations | $C(n, r) = \dfrac{n!}{r!\,(n-r)!} = \dfrac{P(n, r)}{r!}$ | unordered hand or committee of $r$ from $n$ (calculator `nCr`) |

Deck: 52 cards, 26 red (hearts, diamonds) and 26 black (spades, clubs), 4 suits of 13, 4 of each rank, 12 face cards.

| Example | Answer |
|---|---|
| die rolled five times | $6^5 = 7776$ |
| 5 cards with replacement, 3 red then 2 Kings | $(1/2)^3 (1/13)^2 = 1/1352 = 0.00074$ |
| 5 cards without replacement, all red | $\frac{26}{52}\cdot\frac{25}{51}\cdot\frac{24}{50}\cdot\frac{23}{49}\cdot\frac{22}{48} = 0.0253$ |
| arrange 4 Aces | $4! = 24$ |
| 4 cards in sequence | $P(52, 4) = 6\,497\,400$ |
| hand of 4 | $C(52, 4) = 270\,725$ |
| 9 seats, 90 students | $P(90, 9) \approx 2.56 \times 10^{17}$ |
| 3 diamonds in sequence | $P(13, 3) = 1716$ |
| committee of 5 from 20 | $C(20, 5) = 15\,504$ |
| spade flush | $C(13, 5)/C(52, 5) = 1287/2\,598\,960 = 0.000495$ |

## Rules

| Rule | Formula |
|---|---|
| complement | $P(\bar{A}) = 1 - P(A)$ (use for "at least one", "less than the maximum") |
| addition | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$; mutually exclusive: $P(A) + P(B)$ |
| conditional | $P(B \mid A) = \dfrac{\lvert A \cap B \rvert}{\lvert A \rvert} = \dfrac{P(A \cap B)}{P(A)}$ |
| multiplication | $P(A \cap B) = P(A)\,P(B \mid A)$; independent: $P(A)\,P(B)$ |
| total probability | $P(B) = \sum_i P(A_i)\,P(B \mid A_i)$ |
| Bayes | $P(A_i \mid B) = \dfrac{P(A_i)\,P(B \mid A_i)}{\sum_j P(A_j)\,P(B \mid A_j)}$ |

| Example | Answer |
|---|---|
| two dice, sum $< 12$ | $1 - 1/36 = 35/36 = 0.9722$ |
| birthday, 23 people | $1 - P(365, 23)/365^{23} = 1 - 0.4927 = 0.5073$ |
| 7 or Ace | $4/52 + 4/52 = 8/52 = 0.1538$ |
| table: $P(\text{Right})$, $P(\text{iPhone} \mid \text{Right})$, $P(\text{Right} \mid \text{iPhone})$ | $61/71 = 0.859$, $52/61 = 0.852$, $52/58 = 0.897$; dependent ($0.732 \ne 0.702$) |
| two Aces with / without replacement | $1/169 = 0.00592$ / $1/221 = 0.00452$ |
| left-handed: $P(L)$, $P(F \mid L)$ | $0.6(0.05) + 0.4(0.15) = 0.09$; $0.03/0.09 = 1/3$ |
| CPUs: $P(D)$, $P(\text{Intel} \mid D)$ | $0.0085 + 0.0030 + 0.0010 = 0.0125$; $0.0085/0.0125 = 0.68$ |

Two-way table: a conditional is the cell over the **row** total (given the row) or over the **column** total (given the column). Tree: multiply along a path; add the paths ending in $B$ for $P(B)$; divide one path by that sum for the posterior.

## R (Lab 3, Lab 4, demo notebook)

| Command | Does |
|---|---|
| `table(survey$W.Hnd)`, `names()`, `[1]`, `["Left"]`, `[["Left"]]` | frequency table as a named vector; single brackets keep the name, double drop it |
| `paste0(names(freq.tab), "\n(", freq.tab, ")")` | labels with counts; `paste0("... (n = ", sum(freq.tab), ")")` a computed title |
| `pie(freq.tab, labels, radius=1.0, main, col)`, `barplot(freq.tab, horiz=TRUE, main)` | pie and horizontal bar |
| `stem(x)`, `stem(x, scale=2)` | stem plot; `scale` multiplies the number of stems |
| `x[!is.na(x)]`, `range(x)` | drop missing values, then the range |
| `cut(x, seq(lo, hi, by=w), right=FALSE)`, `table()`, `cumsum()` | classes $[\text{lower}, \text{upper})$, frequencies, cumulative frequencies |
| `plot(lower.limits, c(0, cumul.freq), type="b", pch=19, lty=2, lwd=2)` | Lab 3's ogive |
| `hist(x, breaks=seq(150, 200, by=2.5), right=FALSE, col, xlab, ylab, main)` | histogram with chosen classes |
| `xyplot(y ~ x, data=survey, pch=19, col, main)`, `cor(x, y, use="complete.obs")` | scatter plot, correlation ignoring NAs |
| `sample(x, n, replace=TRUE, prob=)`, `sample.int(6, n, replace=TRUE)` | simulate draws; `replace=TRUE` for dice and coins, `FALSE` for cards |
| `sum(v == "H")` | count successes |
| `f <- function(m) { ...; return(k/m) }` | a function returning $k/m$ |
| `for (i in 1:m) { res[i] <- ... }` with `numeric(m)` / `character(m)` | a loop that stores results |
| `replicate(m, expr)` | run `expr` $m$ times and collect the results |
| `prop.table(table(x))`, `barplot(...)`, `histogram(x, type="d", breaks=seq(-0.5, n+0.5, by=1))` | relative-frequency bar plot; mosaic density histogram of an integer $X$ |
| `factorial(4)`, `choose(52, 4)`, `choose(52, 4) * factorial(4)` | $4!$, $C(52, 4)$, $P(52, 4)$ |

Lab 4 conclusions: the estimate's variability falls by about $\sqrt{10}$ per tenfold increase in $m$; as $n$ grows the distribution of $X$ (number of 3s, number of red cards) approaches a normal shape with centre $n/6$ or $n/2$; sampling without replacement narrows it without moving the centre.

```quiz
[
  {"q": "Rapid fire: $P(A \\cup B)$ for mutually exclusive A and B?", "options": ["$P(A) + P(B)$", "$P(A)P(B)$", "$P(A) + P(B) - P(A)P(B)$", "0"], "answer": 0, "explain": "The overlap is empty, so nothing to subtract."},
  {"q": "$P(B \\mid A)$ in terms of probabilities?", "options": ["$P(A \\cap B)/P(A)$", "$P(A \\cap B)/P(B)$", "$P(A)P(B)$", "$P(A)/P(B)$"], "answer": 0, "explain": "Restrict to A."},
  {"q": "$C(n, r)$ equals...", "options": ["$P(n, r) / r!$", "$P(n, r) \\cdot r!$", "$n^r$", "$n! / r!$"], "answer": 0, "explain": "Divide the ordered count by the r! orderings of each group."},
  {"q": "Which R argument makes `sample()` allow repeated values?", "type": "text", "answer": ["replace=TRUE", "replace = TRUE", "replace"], "explain": "Dice and coins need it; cards (without replacement) do not."},
  {"q": "The posterior $P(A_i \\mid B)$ is one path of the tree divided by...", "options": ["P(A_i)", "P(B), the sum of every path ending in B", "1", "P(B | A_i)"], "answer": 1, "explain": "Bayes' rule: joint over total."}
]
```
