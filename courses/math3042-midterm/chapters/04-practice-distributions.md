---
title: "Q11, Q12: Poisson floods and the three-card game"
minutes: 25
---
The last two questions on the practice paper are worth 5 marks each and combine two ideas: a Poisson count with a rescaled λ followed by two independent intervals, and a card game worked without replacement followed by an expected value and two independent games.

## Q11 (5 marks). On average, a major flood in the Fraser Valley occurs once every 20 years.

> Assume that floods occur independently and with equal likelihood at any time of the year.

**a. [2]** What is the probability that *two major floods* occur in the Fraser Valley in the next 10 years?

**b. [3]** What is the probability *the next major flood* in the Fraser Valley will occur between 10 and 20 years from now?

```quiz
[
  {
    "q": "**Q11a.** First, λ for a 10-year interval = ?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.001,
    "explain": "λ must be the mean count for the interval in the question: $$\\lambda = \\dfrac{1}{20} \\text{ per year} \\times 10 \\text{ years} = \\mathbf{0.5} \\text{ floods}$$ Using the yearly rate 0.05 answers a question about one year."
  },
  {
    "q": "**Q11a.** P(exactly two major floods in the next 10 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0758,
    "tolerance": 0.0001,
    "explain": "Let X = the number of major floods in the Fraser Valley in the next 10 years. Under the given assumptions (independent, equally likely at any time, known mean) this is a **Poisson** variable with mean $$\\lambda = \\dfrac{1}{20} \\text{ yr}^{-1} \\times 10 \\text{ yr} = 0.5$$ Therefore $$P(X = 2) = \\dfrac{e^{-\\lambda} \\lambda^x}{x!} = \\dfrac{e^{-0.5} \\cdot 0.5^2}{2!} = \\dfrac{0.606531 \\times 0.25}{2} = \\mathbf{0.0758}$$"
  },
  {
    "q": "**Q11b.** P(the next major flood occurs between 10 and 20 years from now)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2387,
    "tolerance": 0.0001,
    "explain": "The event means **no** flood in the next 10 years and then **at least one** flood in the 10 years after that. The two 10-year intervals do not overlap, so they are independent, and each has λ = 0.5.\n\n$$P(\\text{next flood 10 to 20 years from now}) = P(X = 0) \\cdot (1 - P(X = 0))$$ $$= \\dfrac{e^{-0.5} \\cdot 0.5^0}{0!} \\cdot \\left(1 - \\dfrac{e^{-0.5} \\cdot 0.5^0}{0!}\\right) = 0.606531 \\times 0.393469 = \\mathbf{0.2387}$$\n\nTwo slips to avoid: \\$1 - P(0)$ with λ = 1 (0.6321) is \"at least one flood in 20 years\", which includes floods in the first 10; P(0)·P(1) (0.1839) is \"exactly one\" in the second interval, but the next flood may be followed by more."
  }
]
```

Part a carries one mark for λ and the distribution, one for the number.

Part b's three marks go to the translation: "the next flood is between 10 and 20 years from now" is the same event as "zero floods in years 0 to 10, and one or more in years 10 to 20".

Once that sentence is written, the rest is two Poisson values with the same λ.

```diagram
{ "type": "flow", "title": "Q11b on a timeline", "nodes": [ { "id": "now", "label": "Now", "kind": "pill" }, { "id": "w1", "label": "Years 0–10", "sub": "0 floods · λ = 0.5 · P = 0.6065" }, { "id": "w2", "label": "Years 10–20", "sub": "≥ 1 flood · λ = 0.5 · P = 0.3935" } ], "edges": [ { "from": "now", "to": "w1" }, { "from": "w1", "to": "w2", "label": "then" } ], "hi": ["w1", "w2"], "caption": "Separate windows are independent: 0.6065 × 0.3935 = 0.2387." }
```

:::info Optional: the key's geometric route
The key adds a bracket: "this is equivalent also to a geometric variable problem with p = 1 − e^(−0.05)".

1. Each year is a trial, with $q = e^{-0.05}$:
   $$p = P(\ge 1 \text{ flood in a year}) = 1 - e^{-0.05} = 0.0488$$
2. No flood in years 1–10:
   $$q^{10} = e^{-0.5} = 0.6065$$
3. No flood in years 1–20:
   $$q^{20} = e^{-1} = 0.3679$$
4. The first flood is in years 11–20 when step 2 happens but step 3 does not:
   $$q^{10} - q^{20} = 0.6065 - 0.3679 = \mathbf{0.2387}$$
   the same number.
:::

### Floods in a 10-year interval

The rate composer for Q11: 1 flood per 20 years, over a 10-year interval, gives λ = 0.5 and P(X = 2).

The widget has no year unit, so the unit reads "day"; read it as year.

```widget
poisson-calc
{ "rate": 1, "per": 20, "unit": "day", "interval": 10, "x": 2, "op": "eq", "presets": false, "title": "Q11: 1 flood per 20 years over 10 years (read day as year)" }
```

Set x to 0 for the P(X = 0) that Q11b uses twice, and the interval to 20 to see λ = 1.

Taught in [Poisson: counts per interval](#/math3042-u4/poisson) and [geometric](#/math3042-u4/geometric).

The pattern "next event between a and b" and two separate intervals are drilled in [Poisson across separate intervals](#/math3042-midterm/expected-dollars-shortcuts).

## Q12 (5 marks). The rules of a gambling game are as follows:

> - You draw 3 cards, without replacement, from a standard deck of cards.
> - If all three cards are the same rank (e.g., 3 Kings), then you win \$200.
> - If all three cards are different ranks (e.g., Seven, King, Ace), then you win \$2.
> - Otherwise, you win nothing.
>
> After each game the 3 cards drawn are replaced in the deck and the deck is reshuffled.

**a. [1]** If you play this game once, what is the probability that you win exactly \$2?

**b. [2]** If you play this game repeatedly, how much do you win per game on average?

**c. [2]** If you play this game twice, what is the probability that you win at least \$5 in total?

```quiz
[
  {
    "q": "**Q12a.** P(win exactly \\$2), all three ranks different? (4 decimals)",
    "type": "numeric",
    "answer": 0.8282,
    "tolerance": 0.0001,
    "explain": "The first card can be anything (52/52). The second must avoid the first card's rank: 48 of the 51 left. The third must avoid both ranks: 44 of the 50 left. $$P(\\text{win 2 dollars}) = \\dfrac{52}{52} \\times \\dfrac{48}{51} \\times \\dfrac{44}{50} = 0.828235 \\to \\mathbf{0.8282}$$"
  },
  {
    "q": "**Q12b.** First, P(win \\$200), all three the same rank? (4 decimals)",
    "type": "numeric",
    "answer": 0.0024,
    "tolerance": 0.0001,
    "explain": "The first card sets the rank (52/52). Three cards of that rank remain in 51, then two in 50. $$P(\\text{win 200 dollars}) = \\dfrac{52}{52} \\times \\dfrac{3}{51} \\times \\dfrac{2}{50} = 0.00235294 \\to \\mathbf{0.0024}$$ Carry 0.002353 into the expected value; the rounded 0.0024 moves the answer by a cent."
  },
  {
    "q": "**Q12b.** Average winnings per game? (dollars, to the cent)",
    "type": "numeric",
    "answer": 2.13,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Let X = the winnings to the player in one game: \\$200 with probability 0.002353, \\$2 with probability 0.828235, \\$0 otherwise. $$E(X) = 200 \\cdot P(\\text{win 200 dollars}) + 2 \\cdot P(\\text{win 2 dollars}) + 0 \\cdot P(\\text{win 0 dollars})$$ $$= 200(0.002353) + 2(0.828235) + 0 = 0.470588 + 1.656471 = \\mathbf{2.13} \\text{ dollars}$$ The question says *win*, and the game has no entry fee, so these are gross winnings. Rounding first gives \\$2.14: $$200 \\times 0.0024 + 2 \\times 0.83 = 2.14$$"
  },
  {
    "q": "**Q12c.** Two games: P(win at least \\$5 in total)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0047,
    "tolerance": 0.0001,
    "explain": "The only way to reach \\$5 is a \\$200 win in at least one game: two \\$2 wins make only \\$4. Let p = P(win $200) = 0.002353. The outcomes of the games are independent, so by the addition rule\n\n$$P(\\text{total} \\ge 5) = P(200 \\text{ in game 1}) + P(200 \\text{ in game 2}) - P(200 \\text{ in both})$$ $$= 0.002353 + 0.002353 - 0.002353^2 = \\mathbf{0.0047}$$\n\nThe complement gives the same: $$1 - (1 - 0.002353)^2 = 0.0047$$"
  }
]
```

The three outcomes of one game, X = the winnings to the player:

| Outcome | x (dollars) | P(x) | x · P(x) |
|---|---|---|---|
| all three the same rank | 200 | 0.002353 | 0.4706 |
| all different | 2 | 0.828235 | 1.6565 |
| exactly two share a rank | 0 | 0.169412 | 0 |
| Σ | | 1 | 2.1271 |

Part c is marked on one sentence: the only way to win at least \$5 is to win \$200 at least once.

Then it is "A or B" for two independent games, and the overlap term p² is tiny (0.0000055) but belongs in the formula.

"Without replacement" applies inside a game; "the cards are replaced and the deck reshuffled" is what makes the two games independent.

The fractions can also be written with combinations, which checks part a:

$$P(\text{win 2 dollars}) = \dfrac{C(13, 3) \cdot 4^3}{C(52, 3)} = \dfrac{286 \times 64}{22100} = \mathbf{0.8282}$$

$$P(\text{win 200 dollars}) = \dfrac{13 \cdot C(4, 3)}{C(52, 3)} = \dfrac{52}{22100} = \mathbf{0.002353}$$

Taught in [counting](#/math3042-u3/counting), [conditional probability and independence](#/math3042-u3/conditional-independence) and [discrete distributions](#/math3042-u4/discrete-distributions).

Expected winnings against expected profit are compared in [expected value in dollars](#/math3042-midterm/expected-dollars-shortcuts).

```quiz
[
  {
    "q": "Fraser Valley floods (one per 20 years): P(at least one major flood in the next 10 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3935,
    "tolerance": 0.0001,
    "explain": "λ = 0.5 for 10 years. $$P(X \\ge 1) = 1 - P(0) = 1 - e^{-0.5} = 1 - 0.606531 = \\mathbf{0.3935}$$"
  },
  {
    "q": "P(no major flood in the next 20 years)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3679,
    "tolerance": 0.0001,
    "explain": "Rescale: $$\\lambda = \\dfrac{1}{20} \\times 20 = 1$$ Then $$P(0) = e^{-1} = \\mathbf{0.3679}$$ Equivalently two independent 10-year intervals with no flood: $$0.606531^2 = 0.3679$$"
  },
  {
    "q": "For a 30-year interval, λ = ?",
    "options": ["1.5", "0.05", "30", "0.6667"],
    "answer": 0,
    "explain": "Rate times interval: $$\\lambda = \\dfrac{1}{20} \\text{ per year} \\times 30 \\text{ years} = \\mathbf{1.5} \\text{ floods}$$"
  },
  {
    "q": "P(the next major flood occurs between 20 and 30 years from now)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1447,
    "tolerance": 0.0001,
    "explain": "No flood in the first 20 years (λ = 1), then at least one in the next 10 (λ = 0.5): $$P = e^{-1} \\cdot (1 - e^{-0.5}) = 0.367879 \\times 0.393469 = \\mathbf{0.1447}$$"
  },
  {
    "q": "Three-card game: P(win nothing in both of two games)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0287,
    "tolerance": 0.0001,
    "explain": "Win nothing means exactly two cards share a rank, the complement of the other two outcomes: $$1 - 0.828235 - 0.002353 = 0.169412$$ The games are independent, so multiply: $$0.169412^2 = 0.028700 \\to \\mathbf{0.0287}$$"
  },
  {
    "q": "Winning \\$2 in each of two games satisfies \"at least \\$5 in total\".",
    "type": "tf",
    "answer": false,
    "explain": "\\$2 + \\$2 = \\$4, short of \\$5. Only a \\$200 win in at least one game reaches \\$5, which is why Q12c needs only P(win \\$200)."
  },
  {
    "q": "Expected total winnings over 10 games of the three-card game? (dollars, to the cent)",
    "type": "numeric",
    "answer": 21.27,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Expected values add over independent games: $$10 \\times E(X) = 10 \\times 2.12706 = \\mathbf{21.27} \\text{ dollars}$$ Multiplying the rounded \\$2.13 gives \\$21.30; carry the unrounded value."
  }
]
```
