---
title: The standard normal distribution and the Z table
minutes: 20
---
<!-- facts: none; no bank quantity is measured or published as normal -->

There is no formula for the area under a normal curve, so the areas were computed once and printed in a table. One table is enough, for one particular normal curve: the standard normal, with $\mu = 0$ and $\sigma = 1$. This lesson is how to read that table forwards, for an area, and backwards, for a $z$.

:::info Which kind of table
The answers below assume the course's table is the cumulative left-tail table of $P(Z \le z)$, with $z$ to two decimals, and give the 4 decimals such a table shows. If the posted table is instead the "area from 0 to $z$" kind, add 0.5 to its entry for a positive $z$ to get $P(Z \le z)$.
:::

## μ = 0, σ = 1 gives the Z-distribution

Slide wording: "If we choose $\mu = 0$ and $\sigma = 1$, then the resulting normal distribution is called the *standard normal distribution* or the *Z-distribution*."

$$f(z) = \frac{e^{-\frac{1}{2}z^2}}{\sqrt{2\pi}}$$

This is the general pdf with $\mu = 0$ and $\sigma = 1$ substituted. Its horizontal axis is the Z-score of Unit 1: $z = 1.96$ means 1.96 standard deviations above the mean. Every other normal curve is reached from this one by standardizing, the next lesson's subject.

## What the table gives

Each entry is $P(Z \le z)$, the area under the curve to the left of $z$. The rows give $z$ to one decimal, the columns give the second decimal, .00 to .09. For $z = 1.96$: row **1.9**, column **.06**. Negative $z$ has its own rows, or is read by symmetry.

$P(Z \le 0) = 0.5000$, half the area on each side of the mean; the entries climb toward 1 and reach 0.9987 by $z = 3.00$. Symmetry gives

$$P(Z \le -z) = P(Z \ge z) = 1 - P(Z \le z)$$

so a table with only positive rows still gives every left tail of a negative $z$.

## Three reading patterns

| Question | Read |
|---|---|
| left tail $P(Z \le z)$ | the entry, directly |
| right tail $P(Z > z)$ | $1 -$ the entry |
| between $P(z_1 \le Z \le z_2)$ | entry at $z_2$ minus entry at $z_1$ |

Because a single point has no area, $P(Z < z)$ and $P(Z \le z)$ are the same entry, and $P(Z > z) = P(Z \ge z)$.

## The three lookups

Slide wording: "Suppose $Z$ follows a *standard normal distribution*. Determine each of the following using the table of standard normal probabilities and using R."

```quiz
[
  {
    "q": "$Z$ is standard normal. What is $P(Z > 2.33)$? (4 decimals)",
    "type": "numeric",
    "answer": 0.0099,
    "tolerance": 0.0002,
    "explain": "Row 2.3, column .03 gives $P(Z \\le 2.33) = 0.9901$. The right tail is $1 - 0.9901 = 0.0099$."
  }
]
```

**$P(Z \le -1.96)$.** Row $-1.9$, column .06: $\mathbf{0.0250}$. Without negative rows, $P(Z \le -1.96) = 1 - P(Z \le 1.96) = 1 - 0.9750 = 0.0250$ by symmetry.

**$P(Z > +2.33)$.** Row 2.3, column .03 gives $P(Z \le 2.33) = 0.9901$. The question asks for the right tail:

$$P(Z > 2.33) = 1 - 0.9901 = \mathbf{0.0099}$$

**$P(0.55 \le Z \le 1.10)$.** Two entries. Row 1.1, column .00 gives 0.8643; row 0.5, column .05 gives 0.7088:

$$P(0.55 \le Z \le 1.10) = P(Z \le 1.10) - P(Z \le 0.55) = 0.8643 - 0.7088 = \mathbf{0.1555}$$

Upper entry minus lower entry. A negative result means the subtraction was the wrong way round.

In R, `pnorm(z)` is $P(Z \le z)$ with the defaults $\mu = 0$, $\sigma = 1$, so the three patterns become three one-liners:

```r
pnorm(-1.96)
1 - pnorm(2.33)
pnorm(1.10) - pnorm(0.55)
```

```text
[1] 0.0249979
[1] 0.009903076
[1] 0.1554936
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(-1.96)` | P(Z ≤ q) with q = −1.96. With `mean` and `sd` left out, they take their defaults 0 and 1. |
| `1 - pnorm(2.33)` | One minus the left tail: the right tail above 2.33. |
| `pnorm(1.10) - pnorm(0.55)` | Upper left tail minus lower left tail: the area between. |
| `[1]` | In the output, the position of the first value on each printed line. |

**Left to right**

- `pnorm(-1.96)`: "The standard normal area to the left (`pnorm`) of minus 1.96 (`-1.96`)."
- `1 - pnorm(2.33)`: "One (`1`) minus (`-`) the standard normal area to the left (`pnorm`) of 2.33 (`2.33`)."
- `pnorm(1.10) - pnorm(0.55)`: "The standard normal area to the left (`pnorm`) of 1.10 (`1.10`), minus (`-`) the area to the left (`pnorm`) of 0.55 (`0.55`)."

**Right to left**, the order R runs it

- `pnorm(-1.96)`: "Take minus 1.96 (`-1.96`) and find the standard normal area to its left (`pnorm`)."
- `1 - pnorm(2.33)`: "Find the area left of 2.33 (`pnorm(2.33)`), then take it away from one (`1 -`)."
- `pnorm(1.10) - pnorm(0.55)`: "Find the area left of 1.10 (`pnorm(1.10)`), find the area left of 0.55 (`pnorm(0.55)`), then subtract the second from the first (`-`)."
:::

R agrees with the table to 4 decimals in all three. The values 1.96 and 2.33 are worth remembering: they cut off a 2.5 % and a 1 % tail, and the course's confidence intervals will use them.

## The table, highlighted

```widget
z-table
{ "z": -1.96, "mode": "left", "title": "P(Z ≤ −1.96): row −1.9, column .06" }
```

The widget's "right tail" and "between" modes print the arithmetic line under the table.

## Reading the table backwards

A percentile question gives the area and asks for $z$. Search the body of the table for the area, then read the row and column.

- $P(Z \le z) = 0.975$: 0.9750 sits in row 1.9, column .06, so $z = 1.96$.
- $P(Z \le z) = 0.95$: no entry is exactly 0.9500. Row 1.6 has 0.9495 in column .04 and 0.9505 in column .05, equally far on each side, so $z = 1.645$, halfway between 1.64 and 1.65.

R's `qnorm` is the backwards table:

```r
qnorm(0.975)
qnorm(0.95)
```

```text
[1] 1.959964
[1] 1.644854
```

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(0.975)` | The z with P(Z ≤ z) = p, here p = 0.975; `mean` and `sd` default to 0 and 1. |
| `qnorm(0.95)` | The same with p = 0.95. |

**Left to right**

- `qnorm(0.975)`: "The standard normal value with probability 0.975 (`0.975`) below it (`qnorm`)."
- `qnorm(0.95)`: "The standard normal value with probability 0.95 (`0.95`) below it (`qnorm`)."

**Right to left**, the order R runs it

- `qnorm(0.975)`: "Take the probability 0.975 (`0.975`) and find the z that has that much area to its left (`qnorm`)."
- `qnorm(0.95)`: "Take the probability 0.95 (`0.95`) and find the z that has that much area to its left (`qnorm`)."
:::

```widget
z-table
{ "p": 0.95, "mode": "inverse", "title": "Backwards: which z has 0.95 to its left?" }
```

## Three table-reading slips

The two-decimal split: 1.96 is row 1.9 and column .06, never row 1.96 or column .96. A right tail needs the $1 -$; the entry alone is the left tail, and 0.9901 is not $P(Z > 2.33)$. And a "between" is the larger entry minus the smaller, never the two added.

## Four more table reads, forward and backward

Z is standard normal, N(0, 1); read each answer from the left-tail table with z to 2 decimals.

```quiz
[
  {"q": "Write the table arithmetic for P(Z > 1.47) as one subtraction with the entry in, no spaces.", "type": "text", "answer": ["1-0.9292"], "explain": "A right tail is 1 minus the entry: row 1.4, column .07 gives 0.9292, so 1 − 0.9292 = 0.0708."},
  {"q": "P(Z > 1.47) = ? (4 decimals)", "type": "numeric", "answer": 0.0708, "tolerance": 6e-05, "explain": "1 − P(Z ≤ 1.47) = 1 − 0.9292 = 0.0708. R: 1 − pnorm(1.47) = 0.0707809."},
  {"q": "P(−1.23 ≤ Z ≤ 0.68) = ? (4 decimals)", "type": "numeric", "answer": 0.6424, "tolerance": 6e-05, "explain": "Between: entry at 0.68 minus entry at −1.23 = 0.7517 − 0.1093 = 0.6424. (Row −1.2, column .03 is 0.1093; by symmetry also 1 − 0.8907.)"},
  {"type": "fill", "q": "Complete the R line for P(−1.23 ≤ Z ≤ 0.68).", "code": "pnorm(0.68) - pnorm(___)", "answer": ["-1.23"], "explain": "Upper left tail minus lower left tail: pnorm(0.68) − pnorm(−1.23) = 0.6423992, the table's 0.6424."},
  {"q": "Which z has P(Z ≤ z) = 0.80? (2 decimals)", "type": "numeric", "answer": 0.84, "tolerance": 0.005, "explain": "Backwards: no entry is exactly 0.8000. Row 0.8 has 0.7995 at .04 and 0.8023 at .05; 0.7995 is nearer, so z = 0.84. qnorm(0.80) = 0.8416."},
  {"type": "shade", "q": "Shade P(Z > 0.5) on the standard normal curve. What percentage is it?", "mu": 0, "sigma": 1, "answer": 30.85, "tolerance": 1, "region": "above", "lo": 0.5, "explain": "Right tail: 1 − P(Z ≤ 0.50) = 1 − 0.6915 = 0.3085, so 30.85 %. Drag the lower handle to 0.5; the region to its right is the tail."}
]
```

```quiz
[
  {
    "q": "$P(Z \\le 1.28)$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8997,
    "tolerance": 0.0002,
    "explain": "A left tail, read directly: row 1.2, column .08 gives 0.8997. So $z = 1.28$ is close to the 90th percentile of $Z$."
  },
  {
    "q": "$P(Z > -0.75)$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.7734,
    "tolerance": 0.0002,
    "explain": "Row $-0.7$, column .05 gives $P(Z \\le -0.75) = 0.2266$; the right tail is $1 - 0.2266 = 0.7734$. By symmetry this also equals $P(Z \\le 0.75)$."
  },
  {
    "q": "$P(-1.00 \\le Z \\le 2.00)$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8185,
    "tolerance": 0.0002,
    "explain": "Upper entry minus lower entry: $P(Z \\le 2.00) - P(Z \\le -1.00) = 0.9772 - 0.1587 = 0.8185$. The 34 % and 47.5 % slices of the empirical rule added, more precisely. R's `pnorm(2) - pnorm(-1)` gives 0.8186 because it does not round the two entries first."
  },
  {
    "q": "Write the table arithmetic for $P(0.55 \\le Z \\le 1.10)$ from the two entries 0.8643 and 0.7088, as one subtraction with no spaces.",
    "type": "text",
    "answer": ["0.8643-0.7088", "0.8643−0.7088", ".8643-.7088"],
    "explain": "Between is the upper entry minus the lower entry: $P(Z \\le 1.10) - P(Z \\le 0.55) = 0.8643 - 0.7088 = 0.1555$. The other order gives a negative number, and adding the entries gives more than 1."
  },
  {
    "q": "Which $z$ has $P(Z \\le z) = 0.975$? (2 decimals)",
    "type": "numeric",
    "answer": 1.96,
    "tolerance": 0.005,
    "explain": "Backwards: 0.9750 is in row 1.9, column .06, so $z = 1.96$. It leaves 2.5 % in the upper tail; by symmetry $-1.96$ leaves 2.5 % in the lower tail."
  },
  {
    "q": "Which R line computes $P(Z > 2.33)$?",
    "options": ["`pnorm(2.33)`", "`qnorm(2.33)`", "`pnorm(-2.33) - pnorm(2.33)`", "`1 - pnorm(2.33)`"],
    "answer": 3,
    "explain": "`pnorm(z)` is the left tail $P(Z \\le z)$, so the right tail is 1 minus it, 0.009903. `qnorm` goes backwards from a probability to a $z$, and 2.33 is not a probability."
  },
  {
    "type": "shade",
    "q": "Shade $P(Z \\le -1.5)$ on the standard normal curve. What percentage is it?",
    "mu": 0, "sigma": 1, "answer": 6.68, "tolerance": 0.5, "region": "below", "hi": -1.5,
    "explain": "Row $-1.5$, column .00: 0.0668, so 6.68 %. Drag the upper handle to $-1.5$; the region to its left is the left tail."
  },
  {
    "type": "shade",
    "q": "Shade $P(-0.5 \\le Z \\le 1.0)$. What percentage is it?",
    "mu": 0, "sigma": 1, "answer": 53.28, "tolerance": 1, "lo": -0.5, "hi": 1,
    "explain": "Between: $P(Z \\le 1.00) - P(Z \\le -0.50) = 0.8413 - 0.3085 = 0.5328$, so 53.28 %."
  },
  {
    "q": "By symmetry, $P(Z \\le -2.33)$ equals...",
    "options": ["$P(Z > 2.33) = 0.0099$", "$P(Z \\le 2.33) = 0.9901$", "$0.5 - 0.0099$", "$P(Z > -2.33)$"],
    "answer": 0,
    "explain": "A left tail at $-z$ mirrors the right tail at $+z$: $P(Z \\le -z) = P(Z \\ge z) = 1 - P(Z \\le z)$. So it is $1 - 0.9901 = 0.0099$."
  },
  {
    "q": "To look up $P(Z \\le 1.96)$ in the table you use...",
    "options": ["row 1.96, column .00", "row 1.0, column .96", "row 1.9, column .06", "row 1.9, column .60"],
    "answer": 2,
    "explain": "Rows carry $z$ to one decimal and columns carry the second decimal: $1.96 = 1.9 + 0.06$. The entry there is 0.9750."
  }
]
```
