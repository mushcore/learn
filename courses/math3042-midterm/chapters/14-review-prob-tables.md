---
title: "Review 3: probability tables, expected value and expected winnings"
minutes: 30
---
<!-- facts: gms.box.lucky-jewel-box, classic.scroll.tiers, classic.scroll.stat-ladders, gms.scroll.chaos-outcomes, gms.starforce.rates-15-plus, gms.starforce.rates-0-14, gms.starforce.trace-recovery, gms.starforce.meso-cost, gms.starforce.star-catch -->

A box's drop table, a scroll's stat change and a Star Force tap's three outcomes are all probability tables, so the paper's spam-call and lottery questions are the same sums you already do in game.

:::quiz What the paper asks and what earns the marks
About 5 to 7 marks: Q6 (a table of spam calls, 3 marks), Q3c (expected profit on a lottery ticket, 2 marks), Q12b (average winnings in a card game, 2 marks).

Each mark is one rule written out: add rows of the table, $\mu = \sum x\,P(x)$, or multiply for independent days. The marker wants "Let X = ...", the rule's name, the substituted line, and the answer rounded (probability 4 decimals, anything else 3 significant digits) with its unit.
:::

## Write this on the paper

For every table or money question, copy this frame and fill it in:

1. **Let X =** (the thing being counted or the net dollars, in words).
2. **The table:** one row of x values, one row of P(x). Check $\sum P(x) = 1$.
3. **The rule:** "add the rows" (for at least / at most), "$\mu = \sum x P(x)$" (for expected value), or "since days are independent, multiply".
4. **Substitute:** every product written out, then the total.
5. **Answer:** rounded, with a unit, and for money a sentence: "an expected loss of \$0.40 per ticket".

Mandatory if time is short: Q6, Q3c, and the first three new variants at the end. The rest is marked "if time".

## A discrete random variable and its table

A **random variable** X is a number decided by chance: the number of spam calls today, the dollars you net on a ticket.

It is **discrete** when its values can be listed (0, 1, 2, ...), not measured on a scale.

A **probability table** (a probability distribution) lists every value x and its chance P(x). Abdullah's spam calls per day:

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P(x) | 0.02 | 0.23 | 0.41 | 0.17 | 0.11 | 0.06 |

Two rules make it a valid table: every P(x) is between 0 and 1, and the P(x) add to 1:

$$0.02 + 0.23 + 0.41 + 0.17 + 0.11 + 0.06 = 1.00$$

**Finding a missing probability.** If one P(x) is blank, it is whatever makes the total 1. The Lucky Jewel Box, a GMS cash-shop box, adds one bonus roll of Sol Erda Fragments (a crafting material); in Nexon's published rates (2022 post), X = fragments is 3, 5, 15, 20, 35, 40, 45 or 50 with 0.45, 0.25, ?, 0.07, 0.06, 0.04, 0.02, 0.01. The box gives exactly one bonus row, so the rows are a full table:

$$? = 1 - (0.45 + 0.25 + 0.07 + 0.06 + 0.04 + 0.02 + 0.01) = 1 - 0.90 = 0.10$$

## At least, at most: add the rows

The values of X cannot happen together (today cannot have both 2 and 3 calls), so the probability of a group of values is the sum of their rows.

- "At least 3" means 3, 4 or 5: $P(X \ge 3) = 0.17 + 0.11 + 0.06 = 0.34$.
- "At most 1" means 0 or 1: $P(X \le 1) = 0.02 + 0.23 = 0.25$.
- "Fewer than 2" means 0 or 1 (2 is left out); "more than 2" means 3, 4, 5.

:::warn At least includes the number; fewer than and more than do not
"At least 3" starts at 3. "More than 3" starts at 4. "Fewer than 2" stops at 1. Write the list of x values before adding.
:::

## The expected value μ = Σ x P(x)

The **expected value** (the mean, μ, also written E(X)) is the long-run average of X over many days: multiply each value by its probability and add.

Tiny case: an Intermediate scroll, the MapleStory Classic tier that succeeds 60 % of the time, adds INT +2 to an overall on a success and nothing on a failure. In the long run you average $2(0.6) + 0(0.4) = 1.2$ INT per scroll.

The formula is **on the formula sheet, under Discrete Probability Distributions**:

$$\mu = \sum x\,P(x)$$

Abdullah, substituted:

$$\mu = 0(0.02) + 1(0.23) + 2(0.41) + 3(0.17) + 4(0.11) + 5(0.06) = 0 + 0.23 + 0.82 + 0.51 + 0.44 + 0.30 = 2.3 \text{ calls}$$

An expected value need not be a value X can take: 2.3 calls is an average.

## The variance by the shortcut

The **variance** σ² measures spread around μ; the **standard deviation** σ is its square root, in the same units as X.

Both forms are **on the formula sheet, under Discrete Probability Distributions**:

$$\sigma^2 = \sum (x - \mu)^2 P(x) \qquad \text{or} \qquad \sigma^2 = \sum x^2 P(x) - \mu^2$$

The second (the shortcut) needs one column of $x^2 P(x)$ and one subtraction. Abdullah:

$$\sum x^2 P(x) = 1(0.23) + 4(0.41) + 9(0.17) + 16(0.11) + 25(0.06) = 0.23 + 1.64 + 1.53 + 1.76 + 1.50 = 6.66$$

$$\sigma^2 = 6.66 - 2.3^2 = 6.66 - 5.29 = 1.37, \qquad \sigma = \sqrt{1.37} = 1.17 \text{ calls}$$

:::warn Carry μ unrounded into the shortcut
The shortcut subtracts two close numbers, so a rounded μ moves the answer. Canadian family size has μ = 0.9447: $1.9237 - 0.9447^2 = 1.03$, but with μ = 0.94 it gives $1.9237 - 0.8836 = 1.04$. Keep μ at full calculator precision.
:::

## Two independent days multiply

**Independent** means one day's outcome does not change the other's chances. Then "this today AND that tomorrow" is a product (the multiplication rule, on the sheet under Probability Rules: $P(A \cap B) = P(A) \cdot P(B)$ "if events A and B are independent"):

$$P(2 \text{ today and } 0 \text{ tomorrow}) = P(2) \cdot P(0) = 0.41(0.02) = 0.0082$$

## Expected value in dollars: X = prize − cost

For a ticket or a game, let X = the **net payoff**: what you end with after paying. A winning row is prize minus cost; a losing row is minus the cost, because the cost is paid either way.

Q3c's ticket costs \$2.50 and pays \$100 with probability 0.021:

| x (dollars) | −2.50 | 97.50 |
|---|---|---|
| P(x) | 0.979 | 0.021 |

$$E(X) = -2.50(0.979) + 97.50(0.021) = -2.4475 + 2.0475 = -0.40 \text{ dollars}$$

Say the sign in words: **"There is an expected loss of \$0.40 per ticket."** A positive E(X) is "an expected profit of ...".

:::warn Net, not gross, when there is a cost
Writing \$100 in the win row and never subtracting the \$2.50 gives + \$2.10, the wrong sign. When the game is free (Q12b), X is just the winnings.
:::

Over many plays, expected values add: 100 plays at E(X) per play expect $100 \times E(X)$.

## Sample midterm Q6 (3 marks)

> The probability distribution for the number of spam phone calls that Abdullah receives per day is given in the following table:
>
> x: 0, 1, 2, 3, 4, 5 with P(x): 0.02, 0.23, 0.41, 0.17, 0.11, 0.06
>
> a. [1] What is the probability that Abdullah receives at least 3 spam calls today?
> b. [1] What is Abdullah's expected number of spam calls per day?
> c. [1] If we assume that days are independent of each other, what is the probability that Abdullah receives exactly 2 spam calls today and no spam calls tomorrow?

Write all three on paper, then check.

```quiz
[
  {
    "q": "**Q6a.** P(at least 3 spam calls today)? (4 decimals)",
    "type": "numeric",
    "answer": 0.34,
    "tolerance": 0.0001,
    "explain": "\"At least 3\" includes 3. The values 3, 4, 5 are mutually exclusive, so add: $$P(3) + P(4) + P(5) = 0.17 + 0.11 + 0.06 = \\mathbf{0.34} \\text{ or } \\mathbf{34\\%}$$ The complement gives the same: $$1 - (0.02 + 0.23 + 0.41) = 0.34$$"
  },
  {
    "q": "**Q6b.** Expected number of spam calls per day?",
    "type": "numeric",
    "answer": 2.3,
    "tolerance": 0.01,
    "unit": "calls",
    "explain": "Multiply each value by its probability and add: $$E(X) = \\sum x P(x) = 0(0.02) + 1(0.23) + 2(0.41) + 3(0.17) + 4(0.11) + 5(0.06)$$ $$= 0 + 0.23 + 0.82 + 0.51 + 0.44 + 0.30 = \\mathbf{2.3} \\text{ calls}$$ \"Expected value is 2.3 spam calls per day.\""
  },
  {
    "q": "**Q6c.** P(exactly 2 today and none tomorrow)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0082,
    "tolerance": 0.0001,
    "explain": "**Since days are independent**, multiply: $$P(2) \\cdot P(0) = 0.41(0.02) = \\mathbf{0.0082} \\text{ or } \\mathbf{0.82\\%}$$"
  }
]
```

The table with its x · P(x) column and bar chart:

```widget
pmf-table
{ "rows": [[0, "0.02"], [1, "0.23"], [2, "0.41"], [3, "0.17"], [4, "0.11"], [5, "0.06"]], "xlab": "X = spam calls per day", "presets": false, "title": "Abdullah's spam calls: μ = Σ x P(x)" }
```

## Sample midterm Q3c and Q12b (2 marks each)

> **Q3.** Each ticket purchased in the "Math Rules" scratch and win lottery has a 2.1% chance of winning a prize of \$100. c. [2] If tickets cost \$2.50 each, what is the expected profit or loss per ticket to students who play?

> **Q12.** You draw 3 cards, without replacement, from a standard deck of cards. If all three cards are the same rank (e.g., 3 Kings), then you win \$200. If all three cards are different ranks (e.g., Seven, King, Ace), then you win \$2. Otherwise, you win nothing. b. [2] If you play this game repeatedly, how much do you win per game on average?

For Q12b the two probabilities come from Q12a's card counting: P(all different) $= \frac{48}{51} \times \frac{44}{50} = 0.828235$ and P(all same rank) $= \frac{3}{51} \times \frac{2}{50} = 0.002353$. The full card work is in [Q11, Q12](#/math3042-midterm/practice-distributions).

```quiz
[
  {
    "q": "**Q3c.** Expected profit per ticket? (dollars; a loss is negative)",
    "type": "numeric",
    "answer": -0.40,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Let X = the net profit on one ticket. A losing ticket is − \\$2.50; a winning ticket is the prize minus the cost: $$100 - 2.50 = 97.50 \\text{ dollars}$$ The table: X = − \\$2.50 with P(X) = 0.979; X = \\$97.50 with P(X) = 0.021.\n\nThe expected value: $$E(X) = \\sum x P(x) = -2.50(0.979) + 97.50(0.021) = -2.4475 + 2.0475 = \\mathbf{-0.40} \\text{ dollars}$$ \"There is an expected loss of \\$0.40 per ticket.\""
  },
  {
    "q": "**Q12b.** Average winnings per game? (dollars, to the cent)",
    "type": "numeric",
    "answer": 2.13,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Let X = the winnings to the player in one game: \\$200 with probability 0.002353, \\$2 with probability 0.828235, \\$0 otherwise. $$E(X) = 200 \\cdot P(\\text{win 200 dollars}) + 2 \\cdot P(\\text{win 2 dollars}) + 0 \\cdot P(\\text{win 0 dollars})$$ $$= 200(0.002353) + 2(0.828235) + 0 = 0.470588 + 1.656471 = \\mathbf{2.13} \\text{ dollars}$$ The game has no entry fee, so these are gross winnings. Rounding the probabilities first gives \\$2.14: carry them unrounded."
  }
]
```

## Lab and Unit 4 practice questions

**Lab 6, Task 5** computes the mean and SD of a table in R, the same $\sum x P(x)$ by machine:

```r
mu <- sum(X.vals *P.vals)
sig <- sqrt(sum((X.vals - mu)^2*P.vals))
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <-` | `<-` stores the result under the name `mu`. |
| `X.vals *P.vals` | Multiplies the vector of x values by the vector of probabilities, slot by slot: x · P(x). |
| `sum(...)` | Adds the products: $\sum x P(x)$. |
| `(X.vals - mu)^2*P.vals` | For each x: subtract μ, square (`^2`), times P(x). |
| `sqrt(...)` | Square root of the summed column: σ. |

**Left to right**

- `mu <- sum(X.vals *P.vals)`: "Store as mu the total of x times P(x)."
- `sig <- sqrt(sum((X.vals - mu)^2*P.vals))`: "Store as sig the square root of the total of (x minus mu) squared times P(x)."

**Right to left**, the order R runs it

- `mu`: "Multiply slot by slot, add, then store."
- `sig`: "Subtract mu, square, multiply by P(x), add, take the square root, then store."
:::

The lab's answer: for its 20 chips at p = 1/4 (a binomial table, so μ = np = 5), both routes give $Z = (0 - 5)/1.936 = -2.582$, below −2, so zero defective coatings would be unusual.

**Unit 4 practice problem 4 (overbooking).** X = passengers who cannot board, P(x) = 0.067, 0.141, 0.274, 0.331, 0.187 for x = 0 to 4.

```quiz
[
  {
    "q": "PP4. Expected number of passengers not boarded (3 significant digits).",
    "type": "numeric",
    "answer": 2.43,
    "tolerance": 0.05,
    "unit": "passengers",
    "explain": "First check it is a distribution: $$0.067 + 0.141 + 0.274 + 0.331 + 0.187 = 1.000$$ Then the mean: $$\\mu = \\sum x P(x) = 0(0.067) + 1(0.141) + 2(0.274) + 3(0.331) + 4(0.187)$$ $$= 0 + 0.141 + 0.548 + 0.993 + 0.748 = \\mathbf{2.43} \\text{ passengers}$$"
  },
  {
    "q": "PP2a. A 30-year-old man survives the year with probability 0.9989 and pays a \\$180 premium for a \\$100,000 policy. Expected cost to the company? (dollars; a gain is negative)",
    "type": "numeric",
    "answer": -70,
    "tolerance": 0.01,
    "unit": "dollars",
    "explain": "Let X = the company's net cost. It pays \\$100,000 with probability $$1 - 0.9989 = 0.0011$$ and keeps the \\$180 premium either way. $$E(X) = 100{,}000(0.0011) - 180 = 110 - 180 = \\mathbf{-70}$$ The company expects to gain \\$70 per policy."
  }
]
```

More of the sixteen are in [the Unit 4 practice problems](#/math3042-midterm/unit4-practice-problems).

## New variants

The first three are mandatory; the rest are "if time". The table for items 1 to 4 is the wiki's for a successful Chaos Scroll of Goodness, a GMS scroll that changes each stat on the item by 0 to +5: X = the change to one stat. A scroll gives exactly one change per stat, so the six rows are a full table.

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P(x) | 0.1838 | 0.3301 | ? | 0.1387 | 0.0494 | 0.0593 |

Items 5 to 7 use Star Force, the GMS enhancement that adds stars to gear. From 15 stars a tap succeeds (+1 star) with 0.30, keeps the star with 0.679 and destroys the item with 0.021: Nexon's v.264 published rates, without the Star Catch bonus that v.271 builds in. A destroyed item's trace restores it at 12 stars. Below 15 the wiki's table gives 14→15 a success rate of 0.30 with no destruction, and a failure keeps the star.

```quiz
[
  {
    "q": "1 (mandatory). Find the missing P(2). (4 decimals)",
    "type": "numeric",
    "answer": 0.2387,
    "tolerance": 0.0001,
    "explain": "Let X = the change to one stat. **Rule:** the probabilities of a table add to 1. $$\\sum P(x) = 1$$ Substitute the five known rows: $$P(2) = 1 - (0.1838 + 0.3301 + 0.1387 + 0.0494 + 0.0593) = 1 - 0.7613 = \\mathbf{0.2387}$$"
  },
  {
    "q": "2 (mandatory). P(X ≥ 2), a gain of at least 2? (4 decimals)",
    "type": "numeric",
    "answer": 0.4861,
    "tolerance": 0.0001,
    "explain": "\"At least 2\" includes 2: the values 2, 3, 4, 5. **Rule:** the values are mutually exclusive, so add their rows. $$P(X \\ge 2) = 0.2387 + 0.1387 + 0.0494 + 0.0593 = \\mathbf{0.4861}$$"
  },
  {
    "q": "3 (mandatory). P(X < 2), a gain of fewer than 2? (4 decimals)",
    "type": "numeric",
    "answer": 0.5139,
    "tolerance": 0.0001,
    "explain": "\"Fewer than 2\" leaves 2 out: the values 0 and 1. $$P(X < 2) = P(0) + P(1) = 0.1838 + 0.3301 = \\mathbf{0.5139}$$ Check by the complement of item 2: $$1 - 0.4861 = 0.5139$$"
  },
  {
    "q": "4 (if time). μ and σ for the stat-change table: enter σ. (3 significant digits)",
    "type": "numeric",
    "answer": 1.36,
    "tolerance": 0.006,
    "unit": "stat points",
    "explain": "**Mean** (on the sheet): $$\\mu = \\sum x P(x) = 0(0.1838) + 1(0.3301) + 2(0.2387) + 3(0.1387) + 4(0.0494) + 5(0.0593)$$ $$= 0 + 0.3301 + 0.4774 + 0.4161 + 0.1976 + 0.2965 = 1.7177 \\text{ points}$$ **Shortcut** (on the sheet): first the $x^2 P(x)$ column $$\\sum x^2 P(x) = 0 + 1(0.3301) + 4(0.2387) + 9(0.1387) + 16(0.0494) + 25(0.0593)$$ $$= 0.3301 + 0.9548 + 1.2483 + 0.7904 + 1.4825 = 4.8061$$ Then, with μ unrounded, $$\\sigma^2 = 4.8061 - 1.7177^2 = 4.8061 - 2.95049 = 1.85561$$ $$\\sigma = \\sqrt{1.85561} = 1.3622 \\to \\mathbf{1.36} \\text{ points}$$"
  },
  {
    "q": "5 (if time). One tap on a 15-star item, no Safeguard. Let X = the net change in stars: +1, 0, or −3 when the item is destroyed and its trace restores it at 12. E(X)? (3 significant digits)",
    "type": "numeric",
    "answer": 0.237,
    "tolerance": 0.0005,
    "unit": "stars",
    "explain": "Let X = stars after the tap minus stars before. Three rows: $$16 - 15 = +1 \\text{ with } P = 0.30$$ $$15 - 15 = 0 \\text{ with } P = 0.679$$ $$12 - 15 = -3 \\text{ with } P = 0.021$$ Check: $0.30 + 0.679 + 0.021 = 1$. **Rule:** $\\mu = \\sum x P(x)$. $$E(X) = 1(0.30) + 0(0.679) + (-3)(0.021) = 0.30 + 0 - 0.063 = \\mathbf{0.237} \\text{ stars}$$ \"An expected net gain of 0.237 stars per tap.\" The destroy row is a loss, like the cost row of a ticket."
  },
  {
    "q": "6 (if time). One 14→15 tap on a Lv 150 item: X = stars gained, 1 with P = 0.30 and 0 with P = 0.70. The tap costs 67,400,800 mesos, computed from the wiki's formula $1000 + L^3 \\cdot 15^{2.7}/75$ at L = 150. E(X)? (stars per tap)",
    "type": "numeric",
    "answer": 0.30,
    "tolerance": 0.005,
    "unit": "stars",
    "explain": "Let X = stars gained per tap: 1 with P = 0.30, 0 with P = 0.70. The values are already net stars, so nothing to subtract. $$E(X) = 1(0.30) + 0(0.70) = \\mathbf{0.30} \\text{ stars per tap}$$ In mesos, each tap costs the same, so the expected cost per star gained is $$\\dfrac{67{,}400{,}800}{0.30} = 224{,}669{,}333 \\text{ mesos}$$ The cost is computed: $$1000 + \\dfrac{150^3 \\times 15^{2.7}}{75} = 67{,}400{,}847 \\to 67{,}400{,}800 \\text{ mesos}$$ rounded to the nearest 100."
  },
  {
    "q": "7 (if time). Same tap, once on each of 100 different 14-star Lv 150 items: expected total stars gained? (Then say the mesos spent.)",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0.05,
    "unit": "stars",
    "explain": "Expected values add over taps: $$100 \\times E(X) = 100 \\times 0.30 = \\mathbf{30.0} \\text{ stars}$$ The mesos are fixed, not random: $$100 \\times 67{,}400{,}800 = 6{,}740{,}080{,}000 \\text{ mesos}$$ about 6.74 billion for an expected 30 stars."
  },
  {
    "q": "8 (if time). Stat-change table, two successful Chaos Scrolls of Goodness on two different items, independent: P(both give the same change)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2249,
    "tolerance": 0.0001,
    "explain": "\"The same change\" is 0 and 0, or 1 and 1, ..., or 5 and 5: six cases that cannot happen together, so they add. One scroll's result does not change the other's chances, so within a case the two are **independent** and multiply: $$P(\\text{same}) = P(0)^2 + P(1)^2 + \\dots + P(5)^2$$ $$= 0.1838^2 + 0.3301^2 + 0.2387^2 + 0.1387^2 + 0.0494^2 + 0.0593^2$$ $$= 0.033782 + 0.108966 + 0.056978 + 0.019238 + 0.002440 + 0.003516 = 0.224921 \\to \\mathbf{0.2249}$$"
  }
]
```
