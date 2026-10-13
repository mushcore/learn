---
title: The counting rule, permutations and combinations
minutes: 28
---

Classical probability is a ratio of two counts, and for anything bigger than three coins the counts are too large to list. Section 3.2 gives three counting tools and one decision: does order matter, and may an item be chosen twice?

## The fundamental counting rule

If sets $S_1, S_2, \ldots, S_k$ contain $n_1, n_2, \ldots, n_k$ elements, there are $n_1 \times n_2 \times \cdots \times n_k$ ways to choose one element from each. Roll a die five times: each roll has 6 outcomes, so $|S| = 6^5 = 7776$.

**Five cards with replacement, first three red and last two Kings.** With replacement, each draw is from the full deck and the draws are independent. A standard deck has 52 cards, half red (hearts and diamonds) and half black (spades and clubs); four suits of 13 (A, 2 to 10, J, Q, K); four cards of each rank; 12 face cards (J, Q, K in each suit). So

$$P(A) = \frac{|A|}{|S|} = \frac{26 \times 26 \times 26 \times 4 \times 4}{52 \times 52 \times 52 \times 52 \times 52} = \frac{281\,216}{380\,204\,032} = 0.00074$$

$|A|$ and $|S|$ each by the counting rule, then one division; cancelling first gives the same $(1/2)^3 (1/13)^2 = 1/1352$.

**Five cards without replacement, all red.** Now each draw removes a card: 26 red of 52, then 25 of 51, 24 of 50, 23 of 49, 22 of 48:

$$P(A) = \frac{26 \times 25 \times 24 \times 23 \times 22}{52 \times 51 \times 50 \times 49 \times 48} = \frac{7\,893\,600}{311\,875\,200} = 0.0253$$

Numerator and denominator are the counting rule applied to shrinking sets. The filled notes put the with-replacement version, $26^5 / 52^5$, beside it for contrast.

## Factorials, permutations, combinations

| Function | Definition | Counts |
|---|---|---|
| factorial | $n! = n \times (n-1) \times \cdots \times 2 \times 1$ | arrangements of all $n$ items in a sequence |
| permutations | $P(n, r) = \dfrac{n!}{(n-r)!} = n(n-1)\cdots(n-r+1)$ | **ordered** sequences of $r$ items chosen from $n$, no repeats |
| combinations | $C(n, r) = \dfrac{P(n, r)}{r!} = \dfrac{n!}{r!\,(n-r)!}$ | **unordered** groups (hands, committees) of $r$ from $n$ |

$P(n, r)$ is the counting rule with the set shrinking by one each step. $C(n, r)$ divides by $r!$ because every unordered group of $r$ was counted $r!$ times among the ordered sequences.

```widget
counting-calc
{ "preset": "4 cards in sequence P(52,4)" }
```

### Where the ÷ r! comes from

Each position is filled from a set one smaller than the last, $52 \cdot 51 \cdot 50 \cdot 49$ for four cards in sequence. The last step gathers the $4! = 24$ orderings of the same four cards into one hand, which turns $P(52, 4)$ into $C(52, 4)$.

```widget
perm-fill-play
{}
```

## Which formula

| Question to ask | Answer | Use |
|---|---|---|
| may an item be chosen more than once (with replacement, dice, coins)? | yes | counting rule, $n^r$ |
| order matters (a sequence, a row of seats, first/second/third)? | yes, no repeats | $P(n, r)$ |
| order does not matter (a hand, a committee, a group)? | no repeats | $C(n, r)$ |

A probability is then favourable count over total count, both computed the same way: $C$ above and below the line, or $P$ above and below. Mixing them, $C$ above and $P$ below, is the error to avoid.

:::quiz Sequence versus hand
"Sequence", "arrange", "in order", "first and second" mean $P$. "Hand", "committee", "select a group", "choose" mean $C$. The same four cards give 24 sequences but one hand; $C \le P$, equal only when $r \le 1$.
:::

## The notes' examples

All of these are presets in the calculator above. Decide P, C or $n^r$ for each before working it:

- Arrange the four Aces in a sequence.
- Select four cards from a deck and arrange them in a sequence.
- A hand of four cards (no sequence).
- 90 students, a front row of 9 seats: *the 9 seats define a sequence of students*.
- A sequence of 3 cards, all diamonds, and the probability of that.
- A five-person committee from 20 instructors: *the committee is a combination (i.e. set) of instructors*.
- A spade flush: five cards, all spades, no replacement.

On the calculator: $C(52, 4)$ is `52  2nd F  nCr  4`; `nPr` gives permutations and `n!` factorials. In R: `factorial(4)`, `choose(52, 4) * factorial(4)` for $P(52, 4)$, `choose(52, 4)` for $C(52, 4)$.

```quiz
[
  {
    "q": "A die is rolled five times. How large is the sample space?",
    "type": "numeric",
    "answer": 7776,
    "tolerance": 0,
    "explain": "6 choices at each of 5 rolls: 6^5 = 7776 (the fundamental counting rule)."
  },
  {
    "q": "Five cards drawn with replacement. P(all five are hearts)? (5 decimals)",
    "type": "numeric",
    "answer": 0.000977,
    "tolerance": 0.000005,
    "explain": "With replacement every draw is from the full deck: 13/52 = 1/4 each time, so (1/4)^5 = 13^5 / 52^5 = 371 293 / 380 204 032 = 0.000977."
  },
  {
    "q": "Two cards drawn without replacement. P(both are Aces)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0045,
    "tolerance": 0.00005,
    "explain": "4 Aces of 52, then 3 of the remaining 51: (4 × 3)/(52 × 51) = 12/2652 = 0.004525."
  },
  {
    "q": "Five cards drawn WITH replacement, all red? (5 decimals)",
    "type": "numeric",
    "answer": 0.03125,
    "tolerance": 0.00003,
    "explain": "The deck is whole for every draw: 26^5 / 52^5 = (1/2)^5 = 0.03125. Without replacement the same event is 0.0253, smaller because each red card drawn thins the reds that remain."
  },
  {
    "q": "How many ways can the four Aces be arranged in a sequence?",
    "type": "numeric",
    "answer": 24,
    "tolerance": 0,
    "explain": "4! = 4 × 3 × 2 × 1 = 24. As a permutation, P(4, 4) = 4!/(4 − 4)! = 24/0! = 24/1, which is why 0! = 1 by definition."
  },
  {
    "q": "$P(52, 4)$ = ?",
    "type": "numeric",
    "answer": 6497400,
    "tolerance": 0,
    "explain": "n = 52 available, r = 4 selected: P(52, 4) = 52!/48! = 52 × 51 × 50 × 49 = 6 497 400 ordered sequences."
  },
  {
    "q": "$C(52, 4)$ = ?",
    "type": "numeric",
    "answer": 270725,
    "tolerance": 0,
    "explain": "The number of sequences over the number of sequences with the same four cards: P(52, 4) / 4! = 6 497 400 / 24 = 270 725 hands, the calculator's 52 nCr 4."
  },
  {
    "q": "A class has 90 students and the front row has 9 seats. The number of ways to fill the row is...",
    "options": ["$C(90, 9)$", "$P(90, 9) = 90 \\cdot 89 \\cdots 82$", "$90^9$", "$9!$"],
    "answer": 1,
    "explain": "The seats are distinct positions, so order matters and nobody sits twice: P(90, 9) = 2.56 × 10^17 (using calculator); written out, 90 · 89 ⋯ 82 = 256 284 917 589 254 400."
  },
  {
    "q": "How many sequences of 3 cards, drawn without replacement, are all diamonds?",
    "type": "numeric",
    "answer": 1716,
    "tolerance": 0,
    "explain": "n = 13 diamonds, r = 3 in order: P(13, 3) = 13 × 12 × 11 = 1716."
  },
  {
    "q": "P(a sequence of 3 cards is all diamonds)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0129,
    "tolerance": 0.0001,
    "explain": "Sequences over sequences: P(13, 3) / P(52, 3) = 1716 / 132 600 = 0.0129."
  },
  {
    "q": "A five-person committee from 20 instructors can be formed in how many ways?",
    "type": "numeric",
    "answer": 15504,
    "tolerance": 0,
    "explain": "A committee has no order: C(20, 5) = 20!/(15! 5!) = (20 · 19 · 18 · 17 · 16)/(5 · 4 · 3 · 2 · 1) = 15 504."
  },
  {
    "q": "P(spade flush) when five cards are dealt? (6 decimals)",
    "type": "numeric",
    "answer": 0.000495,
    "tolerance": 0.000003,
    "explain": "Favourable hands C(13, 5) = 1287 over all hands C(52, 5) = 2 598 960: 0.000495, which the notes round to 0.0005 (about one hand in 2020). P(13, 5)/P(52, 5) gives the same ratio because the 5! cancels."
  },
  {
    "q": "$C(n, r)$ is always less than or equal to $P(n, r)$.",
    "type": "tf",
    "answer": true,
    "explain": "C = P / r!, and r! ≥ 1, with equality only for r = 0 or 1. Each unordered group was counted r! times among the ordered sequences."
  },
  {
    "type": "match",
    "q": "Match each situation to its count.",
    "pairs": [
      ["five dice rolled at once", "$6^5$ (counting rule, repeats allowed)"],
      ["four cards arranged in order", "$P(52, 4)$"],
      ["a hand of four cards", "$C(52, 4)$"],
      ["the four Aces in every possible order", "$4!$"]
    ],
    "explain": "Repeats allowed: n^r. Order matters, no repeats: P. Order irrelevant: C. All n items in order: n!."
  }
]
```
