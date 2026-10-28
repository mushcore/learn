---
title: Expected value in dollars, the variance shortcut, Poisson across separate intervals
minutes: 22
---
<!-- facts: gms.starforce.rates-15-plus, gms.starforce.safeguard, gms.starforce.meso-cost, gms.starforce.star-catch, classic.scroll.tiers, classic.scroll.stat-ladders, gms.box.lucky-jewel-box -->

Mesos per star and fragments per box need the same three moves as the practice paper and the Unit 4 problems, and no unit lesson teaches them: an expected value in money, the formula sheet's second variance formula, and probabilities over separate intervals.

## X is the net amount per play

For a game, a lottery or an insurance policy, X is what one play is worth to the person asked about: the prize minus the cost, or the payout minus the premium.

Table the values of X with their probabilities first, then take the mean:

$$\mu = \sum x\,P(x)$$

X = net gain to the buyer.

The "Math Rules" lottery costs 2.50 dollars a ticket and pays 100 dollars with probability 0.021. A win is worth, net:

$$100 - 2.50 = 97.50 \text{ dollars}$$

A loss is −2.50.

| x (dollars) | −2.50 | 97.50 |
|---|---|---|
| P(x) | 0.979 | 0.021 |

$$E(X) = -2.50(0.979) + 97.50(0.021) = -2.4475 + 2.0475 = \mathbf{-0.40} \text{ dollars}$$

The sign goes into words: "There is an expected loss of \$0.40 per ticket."

The three-card game asks "how much do you win per game on average", and the game costs nothing to enter, so X = the gross winnings to the player: 200 with probability 0.002353, 2 with probability 0.828235, 0 otherwise.

$$E(X) = 200(0.002353) + 2(0.828235) = \mathbf{2.13} \text{ dollars per game}$$

If a question gives a price to play, subtract it from every value of X first.

### The insurer's side: practice problem 2

A 30-year-old man survives the year with probability 0.9989 and pays a premium of 180 dollars for a 100,000-dollar policy.

A 50-year-old woman survives with probability 0.9971 and buys a 75,000-dollar policy.

```quiz
[
  { "q": "What premium for the woman's policy gives the company the same expected cost as the man's? (dollars, to the cent)", "type": "numeric", "answer": 287.5, "tolerance": 0.01, "unit": "dollars", "explain": "Expected cost to the company: $$\\text{payout} \\times P(\\text{death}) - \\text{premium}$$ Man: $$100{,}000(1 - 0.9989) - 180 = 110 - 180 = -70$$ a 70-dollar expected gain. Woman: $$75{,}000(0.0029) - P = -70 \\quad\\Rightarrow\\quad 217.50 - P = -70 \\quad\\Rightarrow\\quad P = \\mathbf{287.50}$$" }
]
```

Here X = net cost to the company, so a positive X is bad for the company, the opposite sign to the buyer's net gain above.

The man's policy:

| Outcome | X = company's net cost | P |
|---|---|---|
| dies | 100,000 − 180 = 99,820 | 0.0011 |
| survives | −180 | 0.9989 |

The expected cost:

$$E(X) = 99{,}820(0.0011) - 180(0.9989) = 109.80 - 179.80 = \mathbf{-70}$$

The premium is in both rows, so this simplifies to payout × P(death) − premium:

$$100{,}000(0.0011) - 180 = 110 - 180 = -70$$

A cost of −70 is a gain of 70, so the practice-problem answer sheet writes "−70 (company gains 70 dollars)".

The woman's premium P must give the same −70:

$$75{,}000(0.0029) - P = -70 \quad\Rightarrow\quad 217.50 - P = -70 \quad\Rightarrow\quad P = \mathbf{287.50} \text{ dollars}$$

## Expected mesos for 15→16 stars on a Lv 150 item, Safeguard on

Star Force is the GMS enhancement that adds stars to gear.

X = the number of taps to reach 16 stars.

- Success: p = 0.30 per 15→16 tap, 30 %, Nexon's v.264 published rates, without the Star Catch bonus that v.271 builds in.
- Safeguard: an extra 200 % of the base cost, so cost × 3. It turns destruction into maintain: a failed tap keeps the star, so each tap is success or stay with the same p every time, and X is geometric.
- Cost per tap, computed from the wiki's formula at L = 150:
  $$1000 + \dfrac{L^3 \cdot 16^{2.7}}{200} = 30{,}087{,}200 \text{ mesos}$$
  With Safeguard:
  $$30{,}087{,}200 \times 3 = \mathbf{90{,}261{,}600} \text{ mesos}$$

:::tip Constant cost per tap
Expected mesos is the cost per tap times the expected number of taps:

$$E(\text{mesos}) = \text{cost per tap} \times E(\text{taps})$$

A geometric count has $E(X) = 1/p$, so:

$$E(\text{mesos}) = \text{cost} \times \dfrac{1}{p}$$
:::

```quiz
[
  { "q": "Safeguarded taps at 90,261,600 mesos each, p = 0.30 per tap. Expected mesos to reach 16 stars? (use 1/p exactly)", "type": "numeric", "answer": 300872000, "tolerance": 1, "unit": "mesos", "explain": "X = taps is geometric, so $$E(X) = \\dfrac{1}{p} = \\dfrac{1}{0.30} = 3.33333 \\text{ taps}$$ Each tap costs the same, so $$E(\\text{mesos}) = 90{,}261{,}600 \\times E(X) = \\dfrac{90{,}261{,}600}{0.30} = \\mathbf{300{,}872{,}000} \\text{ mesos}$$ About 301 million. The cost per tap is computed: $$1000 + \\dfrac{150^3 \\times 16^{2.7}}{200} = 1000 + \\dfrac{3{,}375{,}000 \\times 1782.88755}{200} = 30{,}087{,}227 \\to 30{,}087{,}200$$ times 3 with Safeguard." }
]
```

$$E(\text{mesos}) = 90{,}261{,}600 \times \frac{1}{0.30} = \mathbf{300{,}872{,}000} \text{ mesos}$$

## The variance shortcut on the formula sheet

The formula sheet prints two forms, and they are equal:

$$\sigma^2 = \sum (x-\mu)^2 P(x) \qquad \text{or} \qquad \sigma^2 = \sum x^2 P(x) - \mu^2$$

The second needs one column of $x^2 P(x)$ and one subtraction.

```quiz
[
  { "q": "Canadian family size: x = 0, 1, 2, 3 children with P(x) = 0.4499, 0.2504, 0.2048, 0.0949. Compute σ² with the shortcut. (3 significant digits)", "type": "numeric", "answer": 1.03, "tolerance": 0.005, "explain": "The mean: $$\\mu = 0.2504 + 0.4096 + 0.2847 = 0.9447$$ The x²P(x) column: $$\\sum x^2 P(x) = 0 + 0.2504 + 4(0.2048) + 9(0.0949) = 0.2504 + 0.8192 + 0.8541 = 1.9237$$ The shortcut: $$\\sigma^2 = 1.9237 - 0.9447^2 = 1.9237 - 0.892458 = 1.03124 \\to \\mathbf{1.03}$$" }
]
```

| x | 0 | 1 | 2 | 3 | Σ |
|---|---|---|---|---|---|
| P(x) | 0.4499 | 0.2504 | 0.2048 | 0.0949 | 1 |
| x P(x) | 0 | 0.2504 | 0.4096 | 0.2847 | μ = 0.9447 |
| x² P(x) | 0 | 0.2504 | 0.8192 | 0.8541 | 1.9237 |

By the shortcut:

$$\sigma^2 = 1.9237 - 0.9447^2 = 1.9237 - 0.892458 = 1.03124 \to \mathbf{1.03}$$

That is the same as the notes' long form, and $\sigma = 1.0155 \to 1.02$.

:::warn Carry μ unrounded into the shortcut
The notes write μ = 0.94. Squared and subtracted, it gives a result one unit off in the last digit:

$$1.9237 - 0.8836 = 1.0401 \to 1.04$$

The long form barely moves with the rounded mean (1.03126), but the shortcut subtracts two close numbers, so keep μ at six significant digits.
:::

Abdullah's spam calls from Q6, step by step:

1. The x²P(x) column:
   $$\sum x^2P(x) = 1^2(0.23) + 2^2(0.41) + 3^2(0.17) + 4^2(0.11) + 5^2(0.06) = 0.23 + 1.64 + 1.53 + 1.76 + 1.50 = 6.66$$
2. The squared mean:
   $$\mu^2 = 2.3^2 = 5.29$$
3. The shortcut:
   $$\sigma^2 = 6.66 - 5.29 = \mathbf{1.37}$$

So $\sigma = 1.17$ calls per day.

### The spam-call table, column by column

The widget fills the long-form column; its σ² matches the shortcut's 1.37.

```widget
pmf-table
{ "rows": [[0, "0.02"], [1, "0.23"], [2, "0.41"], [3, "0.17"], [4, "0.11"], [5, "0.06"]], "xlab": "X = spam calls per day", "title": "Practice paper Q6: Abdullah's spam calls" }
```

## Sol Erda Fragments per Lucky Jewel Box by the shortcut

A Lucky Jewel Box adds 3, 5, 15, 20, 35, 40, 45 or 50 Sol Erda Fragments at 45, 25, 10, 7, 6, 4, 2 and 1 %, Nexon's published rates (2022 post): one table summing to 1, so $\sum x\,P(x)$ applies.

```quiz
[
  { "q": "X = bonus fragments per box, the eight values and rates above. μ = ? (3 significant digits)", "type": "numeric", "answer": 10.6, "tolerance": 0.05, "unit": "fragments", "explain": "Add the x P(x) column: $$\\mu = 1.35 + 1.25 + 1.50 + 1.40 + 2.10 + 1.60 + 0.90 + 0.50 = \\mathbf{10.6} \\text{ fragments per box}$$" },
  { "q": "Same box: σ² by the shortcut. (3 significant digits)", "type": "numeric", "answer": 151, "tolerance": 0.5, "explain": "Add the x² P(x) column: $$4.05 + 6.25 + 22.5 + 28.0 + 73.5 + 64.0 + 40.5 + 25.0 = 263.8$$ The shortcut: $$\\sigma^2 = 263.8 - 10.6^2 = 263.8 - 112.36 = 151.44 \\to \\mathbf{151}$$ So σ = 12.3 fragments." }
]
```

### The Sol Erda bonus table

Its long form gives the same 151.44.

```widget
pmf-table
{ "rows": [[3, "0.45"], [5, "0.25"], [15, "0.10"], [20, "0.07"], [35, "0.06"], [40, "0.04"], [45, "0.02"], [50, "0.01"]], "xlab": "X = bonus Sol Erda Fragments per box", "title": "Lucky Jewel Box: Sol Erda Fragment bonus (Nexon's published rates, 2022 post)", "presets": false }
```

## Separate intervals multiply; one longer interval rescales λ

Poisson counts in non-overlapping intervals are independent.

"Exactly 1 in this 5 minutes and exactly 1 in the next 5" is two events, so the probabilities multiply.

"2 in the 10 minutes" is one count over a longer interval, so λ is rescaled and the formula is used once.

```quiz
[
  { "q": "Practice problem 13: a cafeteria gets 0.3 customers per minute. P(exactly 1 in a 5-minute span and exactly 1 in the next 5 minutes)? (4 decimals)", "type": "numeric", "answer": 0.112, "tolerance": 0.0001, "explain": "Per span: $$\\lambda = 0.3 \\times 5 = 1.5$$ One customer: $$P(1) = 1.5e^{-1.5} = 0.334695$$ The spans are independent: $$0.334695^2 = \\mathbf{0.1120}$$" }
]
```

Cafeteria, 0.3 per minute. For 10 minutes, $\lambda = 3$:

$$P(X = 2) = \frac{3^2}{2!}e^{-3} = \mathbf{0.2240}$$

$$P(X \ge 2) = 1 - e^{-3}(1 + 3) = \mathbf{0.8009}$$

For each 5-minute span $\lambda = 1.5$, so:

$$P(1)^2 = 0.334695^2 = \mathbf{0.1120}$$

That is half of 0.2240: the 10-minute count of 2 also includes 2 then 0 and 0 then 2.

```diagram
{"type": "grid", "title": "Two customers in 10 minutes, split into two 5-minute spans", "nodes": [{"id": "h0", "label": "First 5 min", "row": 0, "col": 0}, {"id": "h1", "label": "Second 5 min", "row": 0, "col": 1}, {"id": "h2", "label": "Probability", "row": 0, "col": 2}, {"id": "a0", "label": "2", "row": 1, "col": 0}, {"id": "a1", "label": "0", "row": 1, "col": 1}, {"id": "a2", "label": "0.2510 × 0.2231", "sub": "= 0.0560", "row": 1, "col": 2}, {"id": "b0", "label": "1", "row": 2, "col": 0}, {"id": "b1", "label": "1", "row": 2, "col": 1}, {"id": "b2", "label": "0.3347²", "sub": "= 0.1120", "row": 2, "col": 2}, {"id": "c0", "label": "0", "row": 3, "col": 0}, {"id": "c1", "label": "2", "row": 3, "col": 1}, {"id": "c2", "label": "0.2231 × 0.2510", "sub": "= 0.0560", "row": 3, "col": 2}, {"id": "t0", "label": "total", "row": 4, "col": 0}, {"id": "t1", "label": "", "row": 4, "col": 1}, {"id": "t2", "label": "0.2240", "sub": "= P(2 in 10 min)", "row": 4, "col": 2}], "hi": ["b0", "b1", "b2"], "caption": "The two-span question asks for the lit row, 0.1120; the 10-minute count of 2 adds all three rows, 0.2240."}
```

### One 5-minute span at the cafeteria

Square the P(X = 1) the widget shows for the two-span answer.

```widget
poisson-calc
{ "rate": 0.3, "per": 1, "unit": "min", "interval": 5, "x": 1, "op": "eq", "title": "Practice problem 13: 0.3 customers per minute over a 5-minute span" }
```

The 100-year flood (practice problem 16) works the same way with $\lambda = 0.5$ per 50 years:

| Event | λ | Formula | P |
|---|---|---|---|
| ≥ 1 in 50 yr | 0.5 | 1 − e^(−0.5) | 0.3935 |
| exactly 1 in 50 yr | 0.5 | 0.5e^(−0.5) | 0.3033 |
| 1 in each of two 50-yr spans | 0.5 each | 0.3033² | 0.0920 |
| exactly 2 in 100 yr | 1 | e^(−1)/2! | 0.1839 |

"The next event falls between a and b" is two independent pieces: none in the first a, then at least one in the next b − a.

Practice paper Q11b, floods at λ = 0.5 per 10 years:

$$P(0)\,(1 - P(0)) = 0.606531 \times 0.393469 = \mathbf{0.2387}$$

```diagram
{"type": "flow", "title": "The next event between a and b", "nodes": [{"id": "now", "label": "Now", "kind": "pill"}, {"id": "w1", "label": "Years 0–10", "sub": "0 floods · λ = 0.5 · P = 0.6065"}, {"id": "w2", "label": "Years 10–20", "sub": "≥ 1 flood · λ = 0.5 · P = 0.3935"}], "edges": [{"from": "now", "to": "w1"}, {"from": "w1", "to": "w2", "label": "then"}], "hi": ["w1", "w2"], "caption": "Separate windows are independent: 0.6065 × 0.3935 = 0.2387."}
```

## A Safeguarded 16→17 tap, an Intermediate Hat HP scroll, a 4-calls-per-hour help line

```quiz
[
  { "q": "The same Lv 150 item, now at 16 stars: a 16→17 tap also succeeds 30 % with Safeguard on, and the base cost is 1000 + 150³ × 17^2.7/200, rounded to the nearest 100. Expected mesos to reach 17 stars? (use 1/p exactly)", "type": "numeric", "answer": 354379000, "tolerance": 1, "unit": "mesos", "explain": "Base cost, computed: $$1000 + \\dfrac{3{,}375{,}000 \\times 2099.96515}{200} = 35{,}437{,}912 \\to 35{,}437{,}900$$ Safeguard triples it: 106,313,700 per tap. Taps are geometric with p = 0.30, so $$E = \\dfrac{106{,}313{,}700}{0.30} = \\mathbf{354{,}379{,}000} \\text{ mesos}$$" },
  { "q": "An Intermediate Hat HP scroll adds Max HP +15 at a 60 % success rate by meowdb's copy of the item text, else nothing. X = HP gained from one use. μ = ?", "type": "numeric", "answer": 9, "tolerance": 0.05, "unit": "HP", "explain": "X = 15 with P = 0.6, X = 0 with P = 0.4. $$\\mu = 15(0.6) + 0(0.4) = \\mathbf{9} \\text{ HP}$$ A Lesser Hat HP scroll gives +10 every time, so it has the larger expected gain per slot." },
  { "q": "Same scroll: σ by the shortcut. (3 significant digits)", "type": "numeric", "answer": 7.35, "tolerance": 0.005, "unit": "HP", "explain": "The x²P(x) column: $$\\sum x^2P(x) = 15^2(0.6) + 0 = 135$$ The shortcut: $$\\sigma^2 = 135 - 9^2 = 135 - 81 = 54$$ The long form agrees: $$(15 - 9)^2(0.6) + (0 - 9)^2(0.4) = 21.6 + 32.4 = 54$$ Then $$\\sigma = \\sqrt{54} = 7.34847 \\to \\mathbf{7.35} \\text{ HP}$$" },
  { "q": "A help line gets 4 calls per hour. P(exactly 1 call in a 15-minute span and exactly 1 in the next 15 minutes)? (4 decimals)", "type": "numeric", "answer": 0.1353, "tolerance": 0.0001, "explain": "Per span: $$\\lambda = 4 \\times \\dfrac{15}{60} = 1$$ One call: $$P(1) = 1 \\cdot e^{-1} = 0.367879$$ Independent spans: $$0.367879^2 = e^{-2} = \\mathbf{0.1353}$$" },
  { "q": "Same line: P(exactly 2 calls in a 30-minute span)? (4 decimals)", "type": "numeric", "answer": 0.2707, "tolerance": 0.0001, "explain": "One interval, so rescale: $$\\lambda = 4 \\times \\dfrac{30}{60} = 2$$ Then $$P(2) = \\dfrac{2^2}{2!} \\cdot e^{-2} = 2 \\times 0.135335 = \\mathbf{0.2707}$$ Twice the two-span answer, because 2 then 0 and 0 then 2 also count." },
  { "q": "Same line: P(the next call comes between 15 and 30 minutes from now)? (4 decimals)", "type": "numeric", "answer": 0.2325, "tolerance": 0.0001, "explain": "No call in the first 15 minutes, then at least one in the next 15, independent, with λ = 1 per span: $$P(0)(1 - P(0)) = e^{-1}(1 - e^{-1}) = 0.367879 \\times 0.632121 = \\mathbf{0.2325}$$" }
]
```

```quiz
[
  { "q": "A SkyTrain charity raffle sells tickets at 5 dollars, each with a 1-in-400 chance of a 1000-dollar prize. Expected value per ticket to the buyer? (dollars, to the cent)", "type": "numeric", "answer": -2.5, "tolerance": 0.01, "unit": "dollars", "explain": "Net values: a win is 995 (the 1000 prize less the 5 cost) with P = 0.0025 (1 in 400), a loss is −5 with P = 0.9975. $$E(X) = 995(0.0025) - 5(0.9975) = 2.4875 - 4.9875 = \\mathbf{-2.50}$$ An expected loss of 2.50 dollars per ticket." },
  { "q": "A laptop warranty costs 120 dollars; 4 % of laptops need a 1500-dollar repair under it. Expected cost to the company per warranty? (dollars; negative means a gain)", "type": "numeric", "answer": -60, "tolerance": 0.01, "unit": "dollars", "explain": "Expected cost: $$\\text{payout} \\times P(\\text{claim}) - \\text{premium} = 1500(0.04) - 120 = 60 - 120 = \\mathbf{-60}$$ The company expects to gain 60 dollars per warranty sold." },
  { "q": "x = 0, 1, 2, 3, 4 with P(x) = 0.10, 0.25, 0.35, 0.20, 0.10. σ by the shortcut? (3 significant digits)", "type": "numeric", "answer": 1.12, "tolerance": 0.005, "explain": "The mean: $$\\mu = 0.25 + 0.70 + 0.60 + 0.40 = 1.95$$ The x²P(x) column: $$\\sum x^2P(x) = 0.25 + 1.40 + 1.80 + 1.60 = 5.05$$ The shortcut: $$\\sigma^2 = 5.05 - 1.95^2 = 5.05 - 3.8025 = 1.2475$$ Then $$\\sigma = \\sqrt{1.2475} = 1.11692 \\to \\mathbf{1.12}$$" },
  { "q": "In the shortcut σ² = Σx²P(x) − μ², rounding μ to two decimals before squaring can change the last digit of σ².", "type": "tf", "answer": true, "explain": "Canadian family size: μ = 0.9447 gives $$1.9237 - 0.892458 = 1.03124 \\to 1.03$$ but μ = 0.94 gives $$1.9237 - 0.8836 = 1.0401 \\to 1.04$$ Carry μ at six significant digits." },
  { "q": "SkyTrain service alerts arrive at 0.8 per day. P(exactly 1 alert on Monday and exactly 1 on Tuesday)? (4 decimals)", "type": "numeric", "answer": 0.1292, "tolerance": 0.0001, "explain": "λ = 0.8 per day. $$P(1) = 0.8e^{-0.8} = 0.8 \\times 0.449329 = 0.359463$$ Separate days are independent: $$0.359463^2 = \\mathbf{0.1292}$$" },
  { "q": "Same rate: P(exactly 2 alerts over Monday and Tuesday together)? (4 decimals)", "type": "numeric", "answer": 0.2584, "tolerance": 0.0001, "explain": "One count over two days: $$\\lambda = 2 \\times 0.8 = 1.6$$ Then $$P(2) = \\dfrac{1.6^2}{2!} \\cdot e^{-1.6} = 1.28 \\times 0.201897 = \\mathbf{0.2584}$$" },
  { "q": "Same rate: P(the next alert comes on the second day, not the first)? (4 decimals)", "type": "numeric", "answer": 0.2474, "tolerance": 0.0001, "explain": "None on day 1, then at least one on day 2: $$P(0)(1 - P(0)) = e^{-0.8}(1 - e^{-0.8}) = 0.449329 \\times 0.550671 = \\mathbf{0.2474}$$" },
  { "q": "For a Poisson rate, P(exactly 1 on each of two days) equals P(exactly 2 over the two days).", "type": "tf", "answer": false, "explain": "The two-day count of 2 also includes 2 then 0 and 0 then 2. At 0.8 per day: 0.1292 against 0.2584." }
]
```
