---
title: Binomial mean and variance; is a count unusual?
minutes: 18
---

Summing $x \cdot P(x)$ over 51 bars to find the shoppers' mean is possible but pointless: for a binomial variable the parameters collapse to $\mu = np$ and $\sigma = \sqrt{npq}$. With $\mu$ and $\sigma$ in hand, a Z-score says whether an observed count is unusual.

## The shortcut formulas

*The mean and variance of any probability distribution are found using*

$$\mu = \sum x \cdot P(x), \qquad \sigma^2 = \sum (x - \mu)^2 \cdot P(x)$$

*It is possible to start with these definitions and then to use the binomial distribution assumptions to derive the results*

$$\mu = np, \qquad \sigma^2 = npq, \qquad \sigma = \sqrt{npq}$$

The mean is the number of trials times the success probability: 50 visitors at 25 % each should average 12.5 sales. The variance is $npq$, and $\sigma$ is its square root, not $npq$ itself.

The rolling-3s table from the last lesson checks the shortcut against the definition: $\sum x P(x) = 0(0.4019) + 1(0.4019) + 2(0.1608) + 3(0.0322) + 4(0.0032) + 5(0.0001) = 0.8334$, and $np = 5 \cdot \frac16 = 0.8333$. Same number, one line instead of six.

## Online shoppers: μ and σ

```quiz
[
  {
    "q": "n = 50, p = 0.25. The standard deviation σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 3.06,
    "tolerance": 0.01,
    "explain": "σ = √(npq) = √(50 × 0.25 × 0.75) = √9.375 = 3.06. The variance is 9.375; take its root."
  }
]
```

$n = 50$, $p = 0.25$, $q = 0.75$:

$$\mu = 50(0.25) = 12.5, \qquad \sigma = \sqrt{50(0.25)(0.75)} = \sqrt{9.375} = 3.06$$

On the histogram the peak sits at 12 and 13, and $\mu \pm 2\sigma = 12.5 \pm 6.1$ runs from 6.4 to 18.6, which is where nearly all the bar area is.

```r
n <- 50
p <- 0.25
q <- 1 - p
mu <- n*p
sig <- sqrt(n*p*q)
c(mu, sig)
```

```text
[1] 12.500000  3.061862
```

```widget
binomial-calc
{ "n": 50, "p": 0.25, "x": 6, "op": "eq", "preset": "online shoppers", "title": "Online shoppers: μ = np and σ = √npq under the bars, and the Z of any x" }
```

## Unusual means more than 2 standard deviations from the mean

An observed count $x$ is converted to a Z-score exactly as a data value was in Unit 2:

$$Z = \frac{x - \mu}{\sigma}$$

$|Z| > 2$ is **unusual**; $Z < -2$ is *unusually low*, $Z > 2$ *unusually high*. A value between $-2$ and $2$ is within the range chance alone produces, even when it is on the low side of $\mu$. Quiz 4 Part 2 also accepted the tail probability as the test: the count is unusual when $P(X \le x)$ (or $P(X \ge x)$ on the high side) is below 0.025. Both tests are taught; they agree in every example of this unit.

## Laser printers: is 14 repairs unusually low?

*For a certain model of laser printer, the probability of a unit needing repairs in the first year is 10%. In an attempt to reduce this rate, modifications were made to the printer design and a year later a study of 200 randomly selected modified laser printers was conducted.*

**(a)** *Assuming the modifications had no effect on the printer reliability, find the mean and standard deviation of the number of laser printers that need repair among 200.* $X$ = the number needing repair is binomial with $n = 200$, $p = 0.10$:

$$\mu = 200(0.10) = 20, \qquad \sigma = \sqrt{200(0.10)(0.90)} = \sqrt{18} = 4.24$$

**(b)** *Suppose that in the sample of 200 laser printers, 14 needed repair. Assuming the modifications had no effect, is this rate unusually low?*

```quiz
[
  {
    "q": "n = 200 printers, p = 0.10, and 14 needed repair. Z = ? (2 decimals)",
    "type": "numeric",
    "answer": -1.41,
    "tolerance": 0.01,
    "explain": "μ = 200(0.10) = 20, σ = √(200 × 0.10 × 0.90) = √18 = 4.24, Z = (14 − 20)/4.24 = −1.41."
  }
]
```

$$Z = \frac{14 - 20}{4.24} = -1.41$$

$-1.41$ is not beyond $-2$: **not unusual**. The tail agrees: $P(X \le 14) = 0.0929$, above 0.025.

**(c)** *Does this sample provide good evidence that the modifications improved the reliability of this model of laser printer?* No: 14 repairs is within what the old 10 % rate produces by chance alone, so the sample is consistent with no improvement. Not unusual is not evidence of no effect either; it is insufficient evidence of an effect.

```widget
binomial-calc
{ "preset": "laser printers", "x": 14, "op": "le", "title": "Laser printers: n = 200, p = 0.10; the Z readout for x = 14 and the left-tail probability" }
```

```widget
normal-curve
{ "mu": 20, "sigma": 4.24, "x": 14, "title": "Where Z = −1.41 sits on a bell with μ = 20 and σ = 4.24: inside the ±2σ band" }
```

```r
n <- 200
p <- 0.1
q <- 1-p
mu <- n*p
sig <- sqrt(n*p*q)
c(mu, sig)
X <- 14
Z <- (X-mu)/sig
Z
pbinom(14, 200, 0.1)
```

```text
[1] 20.000000  4.242641
[1] -1.414214
[1] 0.09294618
```

## Escalated calls: μ, σ and an unusual day

15 % of a call centre's calls are escalated to a supervisor, independently of each other. One day 160 calls come in and 35 of them are escalated.

```quiz
[
  {"q": "X = the number of the 160 calls that are escalated. Name its distribution (one word).", "type": "text", "answer": ["binomial", "binomial distribution"], "explain": "Fixed n = 160 calls, each escalated or not, the same p = 0.15, calls independent: binomial with n = 160, p = 0.15."},
  {"q": "μ = ? (1 decimal)", "type": "numeric", "answer": 24.0, "tolerance": 0.06, "explain": "μ = np = 160 × 0.15 = 24.0 escalations."},
  {"q": "σ = ? (2 decimals)", "type": "numeric", "answer": 4.52, "tolerance": 0.006, "explain": "σ = √(npq) = √(160 × 0.15 × 0.85) = √20.4 = 4.5166 ≈ 4.52. The square root goes over npq; σ is not npq."},
  {"q": "Z for the 35 escalations = ? (2 decimals)", "type": "numeric", "answer": 2.44, "tolerance": 0.01, "explain": "Z = (x − μ)/σ = (35 − 24)/4.52 = 11/4.52 = 2.43; with the unrounded σ = 4.5166 it is 2.44. Either is accepted."},
  {"q": "Is 35 escalations unusual?", "options": ["Yes, unusually high: Z is above 2", "No, because 35 is within 2 of μ = 24", "Yes, unusually low", "No, because any count below n is possible"], "answer": 0, "explain": "Z = 2.44 > 2, so 35 is unusually high. The tail test agrees: P(X ≥ 35) = 0.0128, below 0.025. The 2 in the rule counts standard deviations, not escalations."},
  {"type": "fill", "q": "Complete the R line for the high-side tail P(X ≥ 35).", "code": "1 - pbinom(___, 160, 0.15)", "answer": ["34"], "explain": "pbinom(34, …) is P(X ≤ 34), so 1 − pbinom(34, 160, 0.15) = P(X ≥ 35) = 0.0128409. Using 35 would drop the X = 35 bar from the tail."}
]
```

```quiz
[
  {
    "q": "n = 50, p = 0.25. The mean number of sales μ = ? (1 decimal)",
    "type": "numeric",
    "answer": 12.5,
    "tolerance": 0.05,
    "explain": "μ = np = 50 × 0.25 = 12.5, the centre of the probability histogram."
  },
  {
    "q": "For a binomial variable, σ = npq.",
    "type": "tf",
    "answer": false,
    "explain": "npq is the variance σ². The standard deviation is σ = √(npq): for the printers √18 = 4.24, not 18."
  },
  {
    "q": "200 modified printers, 10 % repair rate if the modifications did nothing. Which Z-score belongs to 14 repairs?",
    "options": ["$Z = (20 - 14)/4.24 = 1.41$", "$Z = (14 - 20)/4.24 = -1.41$", "$Z = (14 - 20)/18 = -0.33$", "$Z = (14 - 20)/20 = -0.30$"],
    "answer": 1,
    "explain": "Z = (x − μ)/σ with μ = 20 and σ = √18 = 4.24; a count below the mean has a negative Z. Dividing by 18 uses the variance by mistake."
  },
  {
    "q": "n = 100, p = 0.2, and you observe x = 30. Z = ? (1 decimal)",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.05,
    "explain": "μ = 100(0.2) = 20, σ = √(100 × 0.2 × 0.8) = √16 = 4, Z = (30 − 20)/4 = 2.5: beyond 2, unusually high."
  },
  {
    "q": "14 repairs out of 200 gave Z = −1.41. The right conclusion is...",
    "options": ["The modifications clearly improved reliability", "The modifications had no effect", "14 is not unusually low, so the sample is not good evidence of an improvement", "The sample is too small to compute Z"],
    "answer": 2,
    "explain": "|Z| < 2 means 14 is within the range chance produces under the old 10 % rate. That fails to show an improvement; it does not prove there was none."
  },
  {
    "q": "n = 400, p = 0.05. σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 4.36,
    "tolerance": 0.01,
    "explain": "σ = √(400 × 0.05 × 0.95) = √19 = 4.36; μ = 400 × 0.05 = 20."
  },
  {
    "q": "Using the tail-probability test accepted on Quiz 4, a count x is unusually low when...",
    "options": ["$P(X \\le x) < 0.025$", "$P(X = x) < 0.5$", "$x < \\mu$", "$P(X \\le x) < 0.5$"],
    "answer": 0,
    "explain": "A left tail below 0.025 matches Z < −2 (about 2.5 % of a bell lies below −2). For the printers P(X ≤ 14) = 0.093, so 14 is not unusual by either test."
  },
  {
    "q": "Rolling a die 5 times and counting 3s: μ = ? (2 decimals)",
    "type": "numeric",
    "answer": 0.83,
    "tolerance": 0.01,
    "explain": "μ = np = 5 × 1/6 = 0.83, the same as Σ x P(x) over the six-row table (0.8334)."
  }
]
```
