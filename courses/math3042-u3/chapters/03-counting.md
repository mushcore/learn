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

Both numerator and denominator are the counting rule applied to shrinking sets. The filled notes put the with-replacement version beside it for contrast:

$$P(A) = \frac{26^5}{52^5} = 0.03125 \quad \text{(with replacement)}$$

With replacement every draw is 26/52; without, each red card drawn makes the next slightly less likely, which is why 0.0253 is below 0.03125.

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

The notes' examples, all in the widget's presets:

- **Arrange the four Aces in a sequence**: $4 \times 3 \times 2 \times 1 = 24$. As a permutation, $P(4, 4) = \dfrac{4!}{(4 - 4)!} = \dfrac{24}{0!} = \dfrac{24}{1} = 24$, which is why $0! = 1$ by definition.
- **Select four cards from a deck and arrange them in a sequence**: $n = 52$ available, $r = 4$ selected, $P(52, 4) = \dfrac{52!}{48!} = 52 \cdot 51 \cdot 50 \cdot 49 = 6\,497\,400$.
- **A hand of four cards** (no sequence): the number of sequences over the number of sequences with the same four cards, $C(52, 4) = \dfrac{52 \cdot 51 \cdot 50 \cdot 49}{4 \cdot 3 \cdot 2 \cdot 1} = 270\,725$.
- **90 students, a front row of 9 seats**: *the 9 seats define a sequence of students*, so $P(90, 9) = 2.56 \times 10^{17}$ *(using calculator)*; written out, $90 \cdot 89 \cdots 82 = 256\,284\,917\,589\,254\,400$.
- **A sequence of 3 cards, all diamonds**: $n = 52$, $r = 3$; $P(13, 3) = 13 \cdot 12 \cdot 11 = 1716$ sequences, and the notes go on to the probability, $P(\text{all diamonds}) = \dfrac{P(13, 3)}{P(52, 3)} = \dfrac{1716}{132\,600} = 0.0129$.
- **A five-person committee from 20 instructors**: *the committee is a combination (i.e. set) of instructors*, $C(20, 5) = \dfrac{20!}{15!\,5!} = \dfrac{20 \cdot 19 \cdot 18 \cdot 17 \cdot 16}{5 \cdot 4 \cdot 3 \cdot 2 \cdot 1} = 15\,504$.
- **A spade flush** (five cards, all spades, no replacement): favourable hands $C(13, 5) = 1287$, all hands $C(52, 5) = 2\,598\,960$, so $P = \dfrac{C(13, 5)}{C(52, 5)} = 0.0005$ to the notes' four decimals (0.000495, about one hand in 2020). The notes also write it as $\dfrac{P(13, 5)}{P(52, 5)} = 0.0005$: sequences over sequences gives the same ratio, because the $5!$ cancels.

On the calculator: $C(52, 4)$ is `52  2nd F  nCr  4`; `nPr` gives permutations and `n!` factorials. In R: `factorial(4)`, `choose(52, 4) * factorial(4)` for $P(52, 4)$, `choose(52, 4)` for $C(52, 4)$.

## Which formula

| Question to ask | Answer | Use |
|---|---|---|
| may an item be chosen more than once (with replacement, dice, coins)? | yes | counting rule, $n^r$ |
| order matters (a sequence, a row of seats, first/second/third)? | yes, no repeats | $P(n, r)$ |
| order does not matter (a hand, a committee, a group)? | no repeats | $C(n, r)$ |

A probability is then favourable count over total count, both computed the same way: the spade flush uses $C$ above and below the line (or $P$ above and below, same answer), the diamonds sequence uses $P(13, 3) / P(52, 3) = 1716 / 132\,600 = 0.0129$. Mixing them, $C$ above and $P$ below, is the error to avoid.

:::quiz Sequence versus hand
"Sequence", "arrange", "in order", "first and second" mean $P$. "Hand", "committee", "select a group", "choose" mean $C$. The same four cards give 24 sequences but one hand; $C$ is always the smaller number.
:::

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
    "q": "Five cards drawn with replacement. P(first three red and last two Kings)?",
    "options": ["$(26/52)^3 (4/52)^2 = 1/1352$", "$26/52 + 4/52$", "$(26/52)(25/51)(24/50)(4/49)(3/48)$", "$C(26,3) C(4,2) / C(52,5)$"],
    "answer": 0,
    "explain": "With replacement every draw is from the full deck, so multiply the five independent probabilities: 281 216 / 380 204 032 = (1/2)^3 (1/13)^2 = 1/1352 = 0.00074."
  },
  {
    "q": "Five cards without replacement, all red. Which product is correct?",
    "options": ["$(26/52)^5$", "$\\dfrac{26}{52} \\cdot \\dfrac{25}{51} \\cdot \\dfrac{24}{50} \\cdot \\dfrac{23}{49} \\cdot \\dfrac{22}{48}$", "$26/52 \\times 5$", "$5/52$"],
    "answer": 1,
    "explain": "Each red card drawn removes one red card and one card from the deck: 0.0253. Equivalently C(26,5)/C(52,5)."
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
    "explain": "4! = 4 × 3 × 2 × 1 = 24, or P(4, 4) = 4!/0! with 0! = 1."
  },
  {
    "q": "$P(52, 4)$ = ?",
    "type": "numeric",
    "answer": 6497400,
    "tolerance": 0,
    "explain": "52 × 51 × 50 × 49 = 6 497 400 ordered sequences of four cards."
  },
  {
    "q": "$C(52, 4)$ = ?",
    "type": "numeric",
    "answer": 270725,
    "tolerance": 0,
    "explain": "P(52, 4) / 4! = 6 497 400 / 24 = 270 725 hands: the calculator's 52 nCr 4."
  },
  {
    "q": "A class has 90 students and the front row has 9 seats. The number of ways to fill the row is...",
    "options": ["$C(90, 9)$", "$P(90, 9) = 90 \\cdot 89 \\cdots 82$", "$90^9$", "$9!$"],
    "answer": 1,
    "explain": "The seats are distinct positions, so order matters and nobody sits twice: a permutation, about 2.56 × 10^17."
  },
  {
    "q": "How many sequences of 3 cards, drawn without replacement, are all diamonds?",
    "type": "numeric",
    "answer": 1716,
    "tolerance": 0,
    "explain": "P(13, 3) = 13 × 12 × 11 = 1716."
  },
  {
    "q": "A five-person committee from 20 instructors can be formed in how many ways?",
    "type": "numeric",
    "answer": 15504,
    "tolerance": 0,
    "explain": "A committee has no order: C(20, 5) = 20!/(5! 15!) = 15 504."
  },
  {
    "q": "P(spade flush) when five cards are dealt? (6 decimals)",
    "type": "numeric",
    "answer": 0.000495,
    "tolerance": 0.000003,
    "explain": "C(13, 5) / C(52, 5) = 1287 / 2 598 960 = 0.000495."
  },
  {
    "q": "$C(n, r)$ is always less than or equal to $P(n, r)$.",
    "type": "tf",
    "answer": true,
    "explain": "C = P / r!, and r! ≥ 1. Each unordered group was counted r! times among the ordered sequences."
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
