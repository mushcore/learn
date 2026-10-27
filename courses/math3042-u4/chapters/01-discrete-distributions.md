---
title: Discrete random variables, their distributions, mean and standard deviation
minutes: 25
---
<!-- facts: poe1.chaos.affix-count, gms.scroll.chaos-outcomes, gms.box.lucky-jewel-box, poe1.sockets.count-weights -->

How many affixes does one Chaos Orb leave, on average? A probability distribution lists the values with their probabilities, and its mean and standard deviation summarize the list the way $\bar{X}$ and $s$ summarize a data set.

## A discrete random variable has countably many values

*A discrete random variable $X$ is a random variable that has either a finite number or a countable number of values.* The notes' example is $X$ = the number of children a random person has in their lifetime: possible values 0, 1, 2, 3, 4, 5, …, a *countable infinity*.

*The discrete probability distribution of $X$ tells us $P(x)$ for any possible value $x$.* It can be given by a table, by a probability histogram, or by a formula (the named distributions of the next lessons).

## Requirements for a discrete probability distribution

- $\sum P(x) = 1$: the probabilities of all the possible values add to 1.
- $0 \le P(x) \le 1$ for each possible value $x$.

## Canadian family size in 2023

Statistics Canada counted families by number of children: 4 978 190 with 0, 2 770 850 with 1, 2 266 190 with 2, 1 049 870 with 3, a total of 11 065 100. The "3" bar is really "3 or more" in the StatCan table. Dividing each count by the total gives the distribution, drawn as a probability histogram with the bars touching (`space=0`):

| $x$ | 0 | 1 | 2 | 3 | total |
|---|---|---|---|---|---|
| $P(x)$ | 0.4499 | 0.2504 | 0.2048 | 0.0949 | 1.0000 |

```r
X.vals <- c(0,1,2,3)
N.vals <- c(4978190, 2770850, 2266190, 1049870)
p.vals <- round(N.vals / sum(N.vals), 4)
barplot(p.vals, names.arg=X.vals, space=0,
        xlab="X = Number of Children", ylab="P(X)",
        main="Canadian Family Size in 2023")
cbind(p.vals)
```

```text
     p.vals
[1,] 0.4499
[2,] 0.2504
[3,] 0.2048
[4,] 0.0949
```

## The parameters: μ is the expected value, σ the standard deviation

*The mean and standard deviation of a random variable $X$ are called the parameters of its probability distribution.*

The notes start from a fair six-sided die. `sample(1:6, 100, replace=TRUE)` gave 100 rolls whose mean was `sum(X.vals) / 100` = **3.38**. For *all possible* rolls, each face carries probability $\frac16$:

$$\mu = \tfrac16 \cdot 1 + \tfrac16 \cdot 2 + \tfrac16 \cdot 3 + \tfrac16 \cdot 4 + \tfrac16 \cdot 5 + \tfrac16 \cdot 6 = \tfrac{21}{6} = 3.5$$

The instructor's bubble: the sample mean $\dfrac{N_1 \cdot 1 + N_2 \cdot 2 + \cdots}{N}$ is the same weighted sum with relative frequencies $N_i/N$ in place of $\frac16$. As $N$ grows, $\bar{X}$ settles at $\mu$; 3.38 is one sample's estimate of 3.5.

Definition: if $X$ is a discrete random variable with probability distribution $P(x)$,

$$\mu = \sum_x [x \cdot P(x)] = x_1 P(x_1) + x_2 P(x_2) + \cdots$$

*The mean $\mu$ is also called the "expected value" of $X$ and can be written as $E[X]$* (handwritten: the *expectation of $X$*). The variance and standard deviation weight the squared distances from $\mu$ the same way:

$$\sigma^2 = \sum_x [(x - \mu)^2 \cdot P(x)], \qquad \sigma = \sqrt{\sum_x (x - \mu)^2 \, P(x)}$$

Take the square root once, of the whole sum, never term by term.

## One Chaos Orb leaves 4, 5 or 6 affixes

A Chaos Orb, the PoE1 currency that rerolls every modifier on a rare item, leaves 4, 5 or 6 affixes at 8:3:1, the wiki gives [PoE1, 3.29 Allflame Chaos Orb, checked 2026-10-27]. X = the affix count then has $P(4) = \frac{8}{12}$, $P(5) = \frac{3}{12}$, $P(6) = \frac{1}{12}$. One Chaos Orb produces exactly one affix count from a published weight table summing to $\frac{12}{12} = 1$, so the table is a discrete distribution.

```quiz
[
  {"q": "X = affixes after one Chaos Orb, P(4) = 8/12, P(5) = 3/12, P(6) = 1/12. The expected number of affixes μ = E[X] = ? (2 decimals)", "type": "numeric", "answer": 4.42, "tolerance": 0.05, "explain": "μ = Σ x P(x) = 4(8/12) + 5(3/12) + 6(1/12) = (32 + 15 + 6)/12 = 53/12 = 4.4167 ≈ 4.42 affixes."},
  {"q": "Same table. σ = ? (2 decimals)", "type": "numeric", "answer": 0.64, "tolerance": 0.05, "explain": "With μ = 4.4167: σ² = (4 − 4.4167)²(8/12) + (5 − 4.4167)²(3/12) + (6 − 4.4167)²(1/12) = 0.1157 + 0.0851 + 0.2089 = 0.4097; σ = √0.4097 = 0.6401 ≈ 0.64. One square root, of the whole sum."}
]
```

$$\mu = 4 \cdot \tfrac{8}{12} + 5 \cdot \tfrac{3}{12} + 6 \cdot \tfrac{1}{12} = \tfrac{32 + 15 + 6}{12} = \tfrac{53}{12} = 4.42$$

$$\sigma^2 = (4 - 4.4167)^2 \tfrac{8}{12} + (5 - 4.4167)^2 \tfrac{3}{12} + (6 - 4.4167)^2 \tfrac{1}{12} = 0.1157 + 0.0851 + 0.2089 = 0.4097, \qquad \sigma = \sqrt{0.4097} = 0.64$$

```r
X.vals <- c(4, 5, 6)
p.vals <- c(8, 3, 1) / 12
mu <- sum( X.vals * p.vals )
sig = sqrt( sum((X.vals - mu)^2 * p.vals) )
c(mu, sig)
```

```text
[1] 4.4166667 0.6400955
```

### The Chaos Orb table: the sum check, the bars, and μ and σ term by term

```widget
pmf-table
{ "rows": [[4, "8/12"], [5, "3/12"], [6, "1/12"]], "xlab": "X = affixes after one Chaos Orb", "simulate": true, "presets": false, "title": "One Chaos Orb: 4, 5 or 6 affixes at 8:3:1, with μ = 4.42 and σ = 0.64" }
```

## Number of children: μ and σ

```quiz
[
  {
    "q": "Family size: P(0) = 0.4499, P(1) = 0.2504, P(2) = 0.2048, P(3) = 0.0949. The expected number of children μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.94,
    "tolerance": 0.01,
    "explain": "μ = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0 + 0.2504 + 0.4096 + 0.2847 = 0.94."
  }
]
```

$$\mu = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0 + 0.2504 + 0.4096 + 0.2847 = 0.94$$

$$\sigma^2 = (0 - 0.94)^2 (0.4499) + (1 - 0.94)^2 (0.2504) + (2 - 0.94)^2 (0.2048) + (3 - 0.94)^2 (0.0949)$$
$$= 0.3975 + 0.0009 + 0.2301 + 0.4027 = 1.03, \qquad \sigma = \sqrt{1.03} = 1.016 \approx 1.02$$

No family has 0.94 children; the expected value is a long-run average, not a possible value.

```widget
pmf-table
{ "preset": "Canadian family size", "simulate": true, "title": "Family size: the sum check, the histogram, and μ and σ term by term" }
```

```r
mu <- sum( X.vals * p.vals )
sig = sqrt( sum((X.vals - mu)^2 * p.vals) )
c(mu, sig)
```

```text
[1] 0.9447000 1.0155008
```

The unrounded 0.9447 and 1.0155 agree with the hand values to the two decimals the notes box.

## Minimum of two dice: μ and σ

*The random experiment is rolling two fair six-sided dice. Let $X$ = the minimum of the two die values.* The sample space is the 6 × 6 grid of 36 equally likely pairs. The minimum is 1 whenever either die shows 1: the whole top row and the whole left column, 11 cells. The minimum is 2 on the next L-shape in, 9 cells. Each L inward is 2 cells shorter, so

$$P(1) = \tfrac{11}{36}, \; P(2) = \tfrac{9}{36}, \; P(3) = \tfrac{7}{36}, \; P(4) = \tfrac{5}{36}, \; P(5) = \tfrac{3}{36}, \; P(6) = \tfrac{1}{36}$$

(11 + 9 + 7 + 5 + 3 + 1 = 36, so the table is a distribution).

```quiz
[
  {
    "q": "Minimum of two dice, P(x) = 11/36, 9/36, 7/36, 5/36, 3/36, 1/36 for x = 1, …, 6. μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 2.53,
    "tolerance": 0.01,
    "explain": "μ = (1·11 + 2·9 + 3·7 + 4·5 + 5·3 + 6·1)/36 = (11 + 18 + 21 + 20 + 15 + 6)/36 = 91/36 = 2.53."
  }
]
```

$$\mu = 1 \cdot \tfrac{11}{36} + 2 \cdot \tfrac{9}{36} + 3 \cdot \tfrac{7}{36} + 4 \cdot \tfrac{5}{36} + 5 \cdot \tfrac{3}{36} + 6 \cdot \tfrac{1}{36} = \tfrac{91}{36} = 2.53$$

$$\sigma^2 = (1 - 2.53)^2 \tfrac{11}{36} + (2 - 2.53)^2 \tfrac{9}{36} + (3 - 2.53)^2 \tfrac{7}{36} + (4 - 2.53)^2 \tfrac{5}{36} + (5 - 2.53)^2 \tfrac{3}{36} + (6 - 2.53)^2 \tfrac{1}{36}$$
$$= 0.7153 + 0.0702 + 0.0430 + 0.3001 + 0.5084 + 0.3345 = 1.97, \qquad \sigma = \sqrt{1.97} = 1.40$$

```widget
pmf-table
{ "preset": "minimum of two dice", "simulate": true, "grid": true, "title": "Minimum of two dice: the 36 pairs by their minimum, P(x) = (13 − 2x)/36, and μ and σ term by term" }
```

```r
X.vals <- c(1,2,3,4,5,6)
Probs <- c(11/36, 9/36, 7/36, 5/36, 3/36, 1/36)
mu <- sum(X.vals*Probs)
sig <- sqrt(sum((X.vals-mu)^2*Probs))
c(mu, sig)
```

```text
[1] 2.527778 1.404084
```

## Minimum of three dice, by simulation

With three dice the grid is a 6 × 6 × 6 cube, so the notes ask for the mean *by simulation in R*, 100 000 rolls of three dice. `sd()` is the sample standard deviation; with 100 000 trials it estimates $\sigma$ to about two decimals.

```r
m.trials <- 10^5
X.vals <- integer(m.trials)
for (i.trial in 1:m.trials){
  X.vals[i.trial] <- min( sample(1:6, 3, replace=TRUE) )
}
mu <- mean(X.vals)
sig <- sd(X.vals)
c(mu, sig)
```

```text
[1] 2.042750 1.143986
```

The digits past the second vary from run to run; the instructor wrote $\mu = 2.04$, $\sigma = 1.15$ and *$\mu$ gets smaller for more dice*: the more dice you roll, the more likely one of them is a 1. Counting the cube exactly gives $P(x) = ((7 - x)^3 - (6 - x)^3)/216$, with $\mu = 2.0417$ and $\sigma = 1.1439$.

```widget
pmf-table
{ "preset": "minimum of three dice", "simulate": true, "title": "Minimum of three dice: the exact 216-cell table beside a simulation" }
```

## μ for a Chaos Scroll, a Lucky Jewel Box and a socket roll

```quiz
[
  {"q": "A successful Chaos Scroll, the GMS scroll that moves each stat by a random amount, changes one stat by X with the wiki's table P(−5) = 4.94 %, P(−4) = 2.97 %, P(−3) = 3.65 %, P(−2) = 8.0 %, P(−1) = 13.7 %, P(0) = 18.38 %, P(+1) = 19.31 %, P(+2) = 15.87 %, P(+3) = 10.21 %, P(+4) = 1.98 %, P(+5) = 0.99 % [GMS, v.271 Chaos Scroll, checked 2026-10-27]. P(the stat goes down) = ? (4 decimals)", "type": "numeric", "answer": 0.3326, "tolerance": 0.0001, "explain": "Down means X < 0: P(−5) + P(−4) + P(−3) + P(−2) + P(−1) = 0.0494 + 0.0297 + 0.0365 + 0.0800 + 0.1370 = 0.3326. The eleven rows sum to 1.0000, so the table is a distribution."},
  {"q": "Same Chaos Scroll table. μ = E[X] = ? (2 decimals)", "type": "numeric", "answer": 0.17, "tolerance": 0.05, "explain": "μ = Σ x P(x). Negative side: −5(0.0494) − 4(0.0297) − 3(0.0365) − 2(0.0800) − 1(0.1370) = −0.2470 − 0.1188 − 0.1095 − 0.1600 − 0.1370 = −0.7723. Positive side: 1(0.1931) + 2(0.1587) + 3(0.1021) + 4(0.0198) + 5(0.0099) = 0.1931 + 0.3174 + 0.3063 + 0.0792 + 0.0495 = 0.9455. μ = −0.7723 + 0.9455 = 0.1732 ≈ 0.17: on average a stat rises by under a fifth of a point."},
  {"q": "Each Lucky Jewel Box also rolls a Sol Erda Fragment bonus of 3, 5, 15, 20, 35, 40, 45 or 50 fragments with probabilities 0.45, 0.25, 0.10, 0.07, 0.06, 0.04, 0.02, 0.01, Nexon's published rates (2022 post) [GMS, Lucky Jewel Box 2022 rate post, checked 2026-10-27]. Expected fragments per box E[X] = ? (3 significant digits)", "type": "numeric", "answer": 10.6, "tolerance": 0.05, "explain": "E[X] = 3(0.45) + 5(0.25) + 15(0.10) + 20(0.07) + 35(0.06) + 40(0.04) + 45(0.02) + 50(0.01) = 1.35 + 1.25 + 1.50 + 1.40 + 2.10 + 1.60 + 0.90 + 0.50 = 10.6 fragments. No box gives 10.6; 70 % of boxes give 3 or 5, and the rare big rolls pull the mean up."},
  {"type": "fill", "q": "Complete the demo-notebook line for the Sol Erda mean (`X.vals <- c(3, 5, 15, 20, 35, 40, 45, 50)`, `p.vals <- c(0.45, 0.25, 0.10, 0.07, 0.06, 0.04, 0.02, 0.01)`).", "code": "mu <- sum( X.vals * ___ )", "answer": ["p.vals"], "explain": "μ = Σ x P(x), so each value is multiplied by its probability and the products are summed. R prints [1] 10.6."},
  {"q": "On a PoE1 item that can hold six sockets, at item level 50 or higher, the wiki gives socket-count weights 50, 120, 100, 30, 5 and 1 for 1 to 6 sockets [PoE1, 3.29 Allflame item sockets, checked 2026-10-27]. P(6 sockets) = ? (4 decimals)", "type": "numeric", "answer": 0.0033, "tolerance": 0.0001, "explain": "Weights become probabilities by dividing by their total: 50 + 120 + 100 + 30 + 5 + 1 = 306, so P(6) = 1/306 = 0.0033."},
  {"q": "Same item. The expected number of sockets μ = ? (2 decimals)", "type": "numeric", "answer": 2.42, "tolerance": 0.05, "explain": "μ = Σ x P(x) = (1·50 + 2·120 + 3·100 + 4·30 + 5·5 + 6·1)/306 = (50 + 240 + 300 + 120 + 25 + 6)/306 = 741/306 = 2.4216 ≈ 2.42 sockets."}
]
```

```quiz
[
  {
    "q": "A random variable has the distribution P(0) = 0.1, P(1) = 0.3, P(2) = 0.4, P(3) = 0.2. Its mean μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 1.7,
    "tolerance": 0.01,
    "explain": "μ = Σ x P(x) = 0(0.1) + 1(0.3) + 2(0.4) + 3(0.2) = 0 + 0.3 + 0.8 + 0.6 = 1.70."
  },
  {
    "q": "Same distribution (P = 0.1, 0.3, 0.4, 0.2 on x = 0, 1, 2, 3). Its standard deviation σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.9,
    "tolerance": 0.01,
    "explain": "σ² = (0−1.7)²(0.1) + (1−1.7)²(0.3) + (2−1.7)²(0.4) + (3−1.7)²(0.2) = 0.289 + 0.147 + 0.036 + 0.338 = 0.81, so σ = √0.81 = 0.90. Root the whole sum, not each term."
  },
  {
    "q": "Which table is a valid discrete probability distribution?",
    "options": ["P(1) = 0.5, P(2) = 0.3, P(3) = 0.3", "P(1) = 0.6, P(2) = −0.1, P(3) = 0.5", "P(1) = 0.45, P(2) = 0.35, P(3) = 0.20", "P(1) = 0.4, P(2) = 0.4, P(3) = 0.1"],
    "answer": 2,
    "explain": "Both requirements: every P(x) between 0 and 1, and Σ P(x) = 1. 0.5 + 0.3 + 0.3 sums to 1.1, the table with −0.1 has a negative probability, and 0.4 + 0.4 + 0.1 sums to 0.9; 0.45 + 0.35 + 0.20 = 1."
  },
  {
    "q": "The expected value E[X] must be one of the possible values of X.",
    "type": "tf",
    "answer": false,
    "explain": "E[X] is a probability-weighted average: the family-size mean is 0.94 children and a fair die's mean is 3.5, neither a possible value."
  },
  {
    "q": "Two fair dice are rolled and X is the minimum. P(X = 3) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.1944,
    "tolerance": 0.0002,
    "explain": "The L-shape of cells whose smaller value is 3 has 7 cells (the row 3 and column 3 cells with both dice ≥ 3): P(3) = 7/36 = 0.1944. In general P(x) = (13 − 2x)/36."
  },
  {
    "q": "100 simulated die rolls averaged 3.38 while the die's μ is 3.5. Why do they differ?",
    "options": ["The simulation was wrong", "μ should be recomputed from the 100 rolls", "A fair die cannot have a mean of 3.5 because 3.5 is not a face", "The sample mean uses relative frequencies N_i/N, which only approach 1/6 as N grows; μ uses the exact probabilities"],
    "answer": 3,
    "explain": "The handwritten bubble: X̄ = (N₁·1 + N₂·2 + …)/N is the same weighted sum as μ with N_i/N in place of 1/6. A larger simulation lands closer to 3.5."
  },
  {
    "q": "The standard deviation of the number rolled on a fair six-sided die is σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 1.71,
    "tolerance": 0.01,
    "explain": "μ = 3.5; σ² = Σ (x − 3.5)² (1/6) = (6.25 + 2.25 + 0.25 + 0.25 + 2.25 + 6.25)/6 = 17.5/6 = 2.917; σ = √2.917 = 1.71."
  },
  {
    "q": "The variance of a discrete random variable is defined as...",
    "options": ["$\\sum x^2 P(x)$", "$\\sum (x - \\mu)^2 \\, P(x)$", "$\\sqrt{\\sum (x - \\mu)^2 \\, P(x)}$", "$\\sum (x - \\mu) \\, P(x)$"],
    "answer": 1,
    "explain": "σ² weights each squared distance from μ by its probability; σ is its square root. Σ (x − μ) P(x) is always 0."
  },
  {
    "q": "The mean μ of a random variable is also called its ___ value, written E[X].",
    "type": "text",
    "answer": ["expected", "expected value", "expectation"],
    "explain": "The notes' phrase: the mean μ is also called the expected value of X and can be written as E[X]."
  },
  {
    "q": "In the demo notebook, the mean of the minimum of three dice is found with `mean(X.vals)` after a `for` loop. This number is...",
    "options": ["exactly μ, because R computes Σ x P(x)", "an estimate of μ from 100 000 simulated trials, close to 2.04 but varying slightly per run", "the median of the three dice", "always 2.53, the same as for two dice"],
    "answer": 1,
    "explain": "Simulation replaces probabilities by relative frequencies, so mean() and sd() estimate μ and σ; the instructor read 2.04 and 1.15 off his run. The exact values are 2.0417 and 1.1439, smaller than the two-dice 2.53 because a third die makes a 1 more likely."
  }
]
```
