---
title: Standardizing: IQ, cosmic radiation, Gaussian noise
minutes: 25
---
<!-- facts: none; no bank quantity is measured or published as normal -->

The Z table covers one curve, with $\mu = 0$ and $\sigma = 1$. IQ has $\mu = 100$ and $\sigma = 15$; radiation dose has $\mu = 4.35$ and $\sigma = 0.5$. One conversion, $Z = (X - \mu)/\sigma$, turns any normal question into a Z-table question, and the reverse conversion $x = \mu + z\sigma$ turns a percentile back into real units.

## The IQ example and the N(100, 15²) notation

Slide wording: "The IQ of a randomly selected person is a continuous variable $X$ that follows a normal distribution with parameters $\mu = 100$ and $\sigma = 15$. (This is sometimes written as $X ∼ N(100, 15^2)$.)"

The second number inside $N(\cdot, \cdot)$ is the **variance**, $15^2 = 225$. The standard deviation is still 15, and R's `pnorm` takes the standard deviation. The notes print the R answer for the probability that an IQ is below 120:

```r
pnorm(120, 100, 15)
```

```text
[1] 0.9087888
```

The arguments are $x$, then $\mu$, then $\sigma$. In the notes' figure of the IQ bell, from about 40 to 160, this is the area to the left of 120.

## Key idea: Z = (X − μ)/σ

Slide wording: "If $X$ follows a normal distribution with mean $\mu$ and standard deviation $\sigma$, then $Z = \dfrac{X - \mu}{\sigma}$ automatically follows a standard normal distribution."

This is the Unit 1 Z-score with a new payoff: the area to the left of $x$ under the $X$ curve equals the area to the left of $z$ under the $Z$ curve. Every normal probability is three steps: standardize the bound(s), read the table, apply the pattern (left, right or between).

Slide wording: "Now do the same calculation using only the $Z$ table."

```quiz
[
  {
    "q": "IQ is $N(100, 15^2)$. Using the Z table, what is $P(X < 120)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.9082,
    "tolerance": 0.0007,
    "explain": "$Z = (120 - 100)/15 = 1.33$; row 1.3, column .03 gives 0.9082. R's 0.9088 uses the unrounded $Z = 1.3333$; both are accepted."
  }
]
```

$$Z = \frac{120 - 100}{15} = \frac{20}{15} = 1.33$$

Row 1.3, column .03: $P(Z \le 1.33) = \mathbf{0.9082}$.

R gave 0.9088. The difference is in the 4th decimal because the table forces $Z$ to be rounded to 1.33 while R uses $1.3333\ldots$; on paper give the table answer; the R answer is the exact one.

## The standardizing step, written out

```widget
normal-prob
{ "mu": 100, "sigma": 15, "lo": null, "hi": 120, "title": "IQ below 120: Z = (120 − 100)/15 = 1.33" }
```

### The curve being standardized, step by step

Subtracting $\mu$ slides the curve to 0 and dividing by $\sigma$ squeezes it into the standard normal; the shaded area never changes. The other presets are the radiation and noise examples below.

```widget
standardize-play
{ "preset": "IQ below 120" }
```

## Cosmic radiation on a trans-Canada flight

$X$ = the cosmic radiation dose on a trans-Canada flight, normal with $\mu = 4.35$ mrem and $\sigma = 0.500$ mrem.

**(a) $P(4.35 \le X \le 5.00)$.** Standardize both ends. The lower bound is the mean, so $Z = 0$; the upper is

$$Z = \frac{5.00 - 4.35}{0.500} = \frac{0.65}{0.500} = 1.30$$

Between: $P(0 \le Z \le 1.30) = P(Z \le 1.30) - P(Z \le 0) = 0.9032 - 0.5000 = \mathbf{0.4032}$.

**(b) $P(X > 5.00)$.** The same $Z = 1.30$, right tail: $1 - 0.9032 = \mathbf{0.0968}$. Parts (a) and (b) add to 0.5000, the whole upper half.

**(c) The 95th percentile.** Backwards. Find $z$ with $P(Z \le z) = 0.95$: the table has 0.9495 at 1.64 and 0.9505 at 1.65, so $z = 1.645$. Then un-standardize:

$$x = \mu + z\sigma = 4.35 + 1.645 \times 0.500 = 4.35 + 0.8225 = \mathbf{5.17 \text{ mrem}}$$

The percentile recipe is always table backwards, then $x = \mu + z\sigma$.

```r
pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)
1 - pnorm(5, 4.35, 0.5)
qnorm(0.95, 4.35, 0.5)
```

```text
[1] 0.4031995
[1] 0.09680048
[1] 5.172427
```

`qnorm(p, mu, sigma)` does the backwards read and the un-standardizing in one call.

```widget
normal-prob
{ "mu": 4.35, "sigma": 0.5, "lo": null, "hi": null, "p": 0.95, "title": "Radiation: the 95th percentile, z = 1.645, x = 4.35 + 1.645(0.5)" }
```

## Gaussian noise and the bit error

Slide wording: "In a digital system, information is represented by electrical signals; one voltage level represents the bit 0 and another voltage level represents the bit 1." The levels are **binary bit 0 → 2 volts, binary bit 1 → 3 volts**. "Because of *channel noise* during transmission, voltage received by the receiver is distorted. Often, channel noise can be modeled as a normally distributed random variable; in this case it is called *Gaussian noise*." The noise is normal with $\mu = 0$ V, $\sigma = 0.22$ V.

The question: if the sender sends a 0 bit, what is the probability that the receiver interprets it as a 1 instead, assuming the receiver interprets the signal by whichever voltage level is closer?

"Whichever level is closer" fixes the threshold at the midpoint, **2.5 V**. A sent 0 arrives as $2 + N$ volts, $N$ being the noise, and is read as a 1 when $2 + N > 2.5$, that is when $N > 0.5$ V. The question is a right tail of the noise distribution:

$$Z = \frac{0.5 - 0}{0.22} = 2.27, \qquad P(N > 0.5) = P(Z > 2.27) = 1 - 0.9884 = \mathbf{0.0116}$$

About 1.2 % of transmitted 0-bits are flipped. By symmetry a sent 1 (3 V) is read as 0 when $N < -0.5$, with the same probability, so 0.0116 is the bit error rate of the link.

```r
1 - pnorm(0.5, 0, 0.22)
```

```text
[1] 0.01152131
```

R's 0.0115 uses the unrounded $Z = 2.2727$.

## Two bells and a threshold

```widget
bit-error
{ "v0": 2, "v1": 3, "sigma": 0.22 }
```

Raising $\sigma$ grows the tails that cross 2.5 V; moving the levels apart shrinks them. This is COMP 3721's bit error rate as a function of the signal-to-noise ratio.

## Phone battery life, N(40, 4²) hours

A phone model's battery lasts X hours on a full charge, normal with μ = 40 hours and σ = 4 hours.

```quiz
[
  {"q": "Write the standardizing step for P(X < 45), the Z value as a fraction with no spaces, in the form `(x-mu)/sigma` with the numbers in.", "type": "text", "answer": ["(45-40)/4"], "explain": "Z = (x − μ)/σ = (45 − 40)/4 = 5/4 = 1.25."},
  {"q": "P(X < 45) from the Z table = ? (4 decimals)", "type": "numeric", "answer": 0.8944, "tolerance": 6e-05, "explain": "Z = 1.25; row 1.2, column .05: P(Z ≤ 1.25) = 0.8944. Here Z is exact, so R agrees: pnorm(45, 40, 4) = 0.8943502."},
  {"type": "fill", "q": "Complete the R call for P(X < 45).", "code": "pnorm(45, ___, ___)", "answer": ["40", "4"], "explain": "pnorm(x, mean, sd): μ = 40, then σ = 4 (not the variance 16)."},
  {"type": "shade", "q": "Shade P(36 ≤ X ≤ 46), between 36 and 46 hours. What percentage is it?", "mu": 40, "sigma": 4, "answer": 77.45, "tolerance": 1, "lo": -1, "hi": 1.5, "explain": "Z = (36 − 40)/4 = −1.00 and (46 − 40)/4 = 1.50. Between: 0.9332 − 0.1587 = 0.7745, so 77.45 %. The handles go to −1σ and +1.5σ."},
  {"q": "P(36 ≤ X ≤ 46) = ? (4 decimals)", "type": "numeric", "answer": 0.7745, "tolerance": 6e-05, "explain": "P(Z ≤ 1.50) − P(Z ≤ −1.00) = 0.9332 − 0.1587 = 0.7745. In R, pnorm(46, 40, 4) − pnorm(36, 40, 4)."},
  {"q": "The 10th percentile of battery life, the life only 10 % of phones fall below = ? (2 decimals, hours)", "type": "numeric", "answer": 34.88, "tolerance": 0.006, "unit": "h", "explain": "Backwards: P(Z ≤ z) = 0.10 is nearest 0.1003 at z = −1.28 (0.0985 at −1.29 is farther). x = μ + zσ = 40 + (−1.28)(4) = 40 − 5.12 = 34.88 hours. qnorm(0.10, 40, 4) = 34.8738."}
]
```

```quiz
[
  {
    "q": "Heights are $N(175, 7^2)$ cm. What is $P(X < 182)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.8413,
    "tolerance": 0.0002,
    "explain": "$Z = (182 - 175)/7 = 1.00$; row 1.0, column .00 gives 0.8413. One $\\sigma$ above the mean: the 84 % of the empirical rule."
  },
  {
    "q": "Heights are $N(175, 7^2)$ cm. Write the standardizing step for $P(X < 182)$, the $Z$ value as a fraction with no spaces, in the form `(x-mu)/sigma` with the numbers in.",
    "type": "text",
    "answer": ["(182-175)/7", "(182−175)/7"],
    "explain": "$Z = (x - \\mu)/\\sigma = (182 - 175)/7 = 7/7 = 1.00$. Subtract the mean first, then divide by the standard deviation 7, not the variance 49."
  },
  {
    "q": "Heights are $N(175, 7^2)$. What is $P(X > 189)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.0228,
    "tolerance": 0.0002,
    "explain": "$Z = (189 - 175)/7 = 2.00$; the entry is 0.9772 and the right tail is $1 - 0.9772 = 0.0228$."
  },
  {
    "q": "Heights are $N(175, 7^2)$. What height is the 90th percentile? (2 decimals, cm)",
    "type": "numeric",
    "answer": 183.96,
    "tolerance": 0.05,
    "unit": "cm",
    "explain": "Backwards: $P(Z \\le z) = 0.90$ is nearest 0.8997 at $z = 1.28$. Then $x = 175 + 1.28 \\times 7 = 183.96$ cm. `qnorm(0.90, 175, 7)` gives 183.97."
  },
  {
    "q": "$X ∼ N(100, 15^2)$ means the standard deviation of $X$ is 225.",
    "type": "tf",
    "answer": false,
    "explain": "The second parameter is the variance, $15^2 = 225$; the standard deviation is 15. Standardize with $\\sigma = 15$ and call `pnorm(x, 100, 15)`."
  },
  {
    "q": "Why is 2.5 V the threshold in the bit-error example?",
    "options": ["it is the mean of the noise", "it is $\\mu + \\sigma$ for the 2 V level", "the notes define it as the error voltage", "the receiver picks whichever level is closer, and 2.5 V is the midpoint of 2 V and 3 V"],
    "answer": 3,
    "explain": "A received voltage above 2.5 V is nearer 3 V than 2 V, so it is read as a 1. A sent 0 is misread when the noise exceeds $2.5 - 2 = 0.5$ V."
  },
  {
    "q": "A noisier channel has Gaussian noise with $\\sigma = 0.25$ V, levels still 2 V and 3 V. What is the probability a sent 0 is read as a 1? (4 decimals)",
    "type": "numeric",
    "answer": 0.0228,
    "tolerance": 0.0002,
    "explain": "Misread when $N > 0.5$: $Z = 0.5/0.25 = 2.00$, $P(Z > 2.00) = 1 - 0.9772 = 0.0228$. Compare 0.0116 at $\\sigma = 0.22$: a little more noise doubles the error rate."
  },
  {
    "type": "shade",
    "q": "Noise is normal with $\\mu = 0$ V, $\\sigma = 0.22$ V. Shade the region above $\\mu + 1.5\\sigma$ (above 0.33 V). What percentage is it?",
    "mu": 0, "sigma": 0.22, "answer": 6.68, "tolerance": 0.5, "region": "above", "lo": 1.5,
    "explain": "A right tail at $z = 1.5$: $1 - 0.9332 = 0.0668$, so 6.68 %. The actual threshold, 0.5 V, is $z = 2.27$ and leaves only 1.16 %."
  },
  {
    "q": "Which R line gives the 95th percentile of the radiation dose, $N(4.35, 0.5^2)$?",
    "options": ["`pnorm(0.95, 4.35, 0.5)`", "`qnorm(0.95, 4.35, 0.25)`", "`qnorm(0.95, 4.35, 0.5)`", "`1 - pnorm(0.95, 4.35, 0.5)`"],
    "answer": 2,
    "explain": "A percentile goes from a probability to an $x$, which is `qnorm`; the third argument is the standard deviation 0.5, not the variance 0.25. The result is 5.172427."
  },
  {
    "q": "Radiation dose is $N(4.35, 0.5^2)$ mrem. What is the 99th percentile? (2 decimals)",
    "type": "numeric",
    "answer": 5.52,
    "tolerance": 0.01,
    "unit": "mrem",
    "explain": "$P(Z \\le z) = 0.99$ is 0.9901 at $z = 2.33$. Then $x = 4.35 + 2.33 \\times 0.5 = 5.515$, which rounds to 5.52 mrem. `qnorm(0.99, 4.35, 0.5)` gives 5.513, so 5.51 is accepted too."
  }
]
```
