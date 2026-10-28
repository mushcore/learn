---
title: The counting rule, permutations and combinations
minutes: 30
---
<!-- facts: classic.server.identity, classic.jobs.second-job-paths, poe2.classes.ascendancy-structure, poe2.gems.support-sockets -->

Classical probability is a ratio of two counts, and even the job choices on one MapleStory Classic account are too many to list. Section 3.2 gives three counting tools and one decision: does order matter, and may an item be chosen twice?

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

:::info R syntax
| Code | What it does |
|---|---|
| `factorial(4)` | 4!, the product 4 × 3 × 2 × 1. |
| `choose(52, 4)` | nCr with n = 52 and k = 4: the number of 4-card sets from 52. |
| `choose(52, 4) * factorial(4)` | `*` multiplies: the sets times the 4! orders of each set gives P(52, 4). |

**Left to right**

- `factorial(4)`: "The factorial (`factorial`) of 4 (`4`)."
- `choose(52, 4) * factorial(4)`: "The number of ways to choose (`choose`) 4 (`4`) from 52 (`52`), times (`*`) the factorial (`factorial`) of 4 (`4`)."
- `choose(52, 4)`: "The number of ways to choose (`choose`) 4 (`4`) from 52 (`52`)."

**Right to left**, the order R runs it

- `factorial(4)`: "Take 4 (`4`) and multiply down to 1 (`factorial`)."
- `choose(52, 4) * factorial(4)`: "Count the 4-card sets (`choose(52, 4)`), compute 4! (`factorial(4)`), then multiply them (`*`)."
- `choose(52, 4)`: "Take 52 and 4 (`52, 4`) and count the unordered selections (`choose`)."
:::

## Three Classic characters, ten 2nd-job paths

A MapleStory Classic account holds up to 3 characters, and at Lv. 30 each takes one of 10 2nd-job paths [Classic, Grand Launch Release Notes 2026-10-20 (Nexon), checked 2026-10-27]: 3 each for Warrior and Magician, 2 each for Bowman and Thief. Both counts are Nexon's, so all three ways of choosing are sourced: with repeats, in order without repeats, and as a set.

```quiz
[
  {"q": "Each of the 3 characters takes a path, repeats allowed. How many assignments (character 1, 2, 3)?", "type": "numeric", "answer": 1000, "tolerance": 0, "explain": "Counting rule, 10 choices per slot: $10 \\times 10 \\times 10 = 10^3 = 1000$."},
  {"q": "All three paths different, in character-slot order. How many?", "type": "numeric", "answer": 720, "tolerance": 0, "explain": "The set shrinks by one per slot: $P(10, 3) = 10 \\times 9 \\times 8 = 720$."},
  {"q": "Which 3 different paths the account covers, order ignored. How many sets?", "type": "numeric", "answer": 120, "tolerance": 0, "explain": "$C(10, 3) = P(10, 3)/3! = 720/6 = 120$."}
]
```

Each set of 3 paths appears $3! = 6$ times among the 720 sequences, which is the ÷ r!.

### P(10, 3) and C(10, 3) for one account

```widget
counting-calc
{ "n": 10, "r": 3, "kind": "perm", "presets": false }
```

## Count PoE2 ascendancies, gem sockets and Classic job sets

PoE2 has 8 playable classes and 22 regular ascendancies [PoE2, 0.5.5e Forbidden Rites, Character class (poe2wiki), checked 2026-10-27]: six classes offer 3 each and the Ranger and Druid 2 each. A PoE2 skill gem has 2 to 5 support sockets [PoE2, 0.5.5e Forbidden Rites, Gem socket (poe2wiki), checked 2026-10-27].

```quiz
[
  {"q": "A new PoE2 character picks a class, then one of that class's ascendancies. How many (class, ascendancy) outcomes are there?", "type": "numeric", "answer": 22, "tolerance": 0, "explain": "The classes do not all offer the same number, so the product rule does not apply; the groups are disjoint, so add them: $6 \\times 3 + 2 \\times 2 = 18 + 4 = 22$."},
  {"q": "Two PoE2 characters, first and second, must have different ascendancies. How many ordered pairs?", "type": "numeric", "answer": 462, "tolerance": 0, "explain": "Order matters, no repeats: $P(22, 2) = 22 \\times 21 = 462$."},
  {"q": "The same two characters, but only the pair of ascendancies counts, not which came first. How many pairs?", "type": "numeric", "answer": 231, "tolerance": 0, "explain": "$C(22, 2) = P(22, 2)/2! = 462/2 = 231$."},
  {"q": "Three PoE2 skill gems each sit at one support-socket count from 2 to 5. How many (gem 1, gem 2, gem 3) socket configurations?", "type": "numeric", "answer": 64, "tolerance": 0, "explain": "2, 3, 4 or 5 is 4 choices per gem, repeats allowed: $4^3 = 64$."},
  {"q": "A Classic account's 3 characters cover 3 different 2nd-job paths. Suppose every set of 3 paths is equally likely. $P(\\text{all three paths belong to the same 1st job})$? (4 decimals)", "type": "numeric", "answer": 0.0167, "tolerance": 6e-05, "explain": "Sets over sets. Only Warrior and Magician have 3 paths: $C(3, 3) + C(3, 3) = 2$ favourable sets; Bowman and Thief have $C(2, 3) = 0$. Total $C(10, 3) = 120$. $P = 2/120 = 0.0167$."},
  {"type": "fill", "q": "Fill the blank so R prints the number of 3-path sets for a Classic account.", "code": "choose(10, ___)\n## [1] 120", "answer": ["3"], "explain": "$C(10, 3)$: 10 paths, 3 characters, order ignored. `choose(10, 3) * factorial(3)` would give $P(10, 3) = 720$."}
]
```

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
