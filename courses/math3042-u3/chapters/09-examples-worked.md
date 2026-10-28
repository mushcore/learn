---
title: Every lecture example, worked
minutes: 30
---

Every example in the Unit 3 notes, in the order it appears, with the answer line from the filled notes (posted 2026-10-12). Each lesson linked in the last column works the example in full; the quiz below is the same problems with the numbers changed.

| Example | Rule | Answer line | Lesson |
|---|---|---|---|
| three coins: $X = 1$ or $X = 2$ more likely? | classical | $3/8 = 3/8$, equally likely | 1 |
| five coins, all the same | classical | $2/32 = 0.0625$ | 1 |
| five coins, at least two heads | NOT | $1 - 6/32 = 0.8125$ | 1 |
| boxcars | classical / simulation | $1/36 = 0.0278$; simulated 0.0281 | 2 |
| a die rolled five times | counting rule | $6^5 = 7776$ | 3 |
| five cards with replacement, three red then two Kings | counting rule | $281\,216 / 380\,204\,032 = 0.00074$ | 3 |
| five cards without replacement, all red | counting rule | $7\,893\,600 / 311\,875\,200 = 0.0253$; with replacement $26^5/52^5 = 0.03125$ | 3 |
| arrange the four Aces | $n!$ | $4! = P(4, 4) = 24/0! = 24$ | 3 |
| four cards in sequence | $P$ | $P(52, 4) = 6\,497\,400$ | 3 |
| a hand of four cards | $C$ | $C(52, 4) = 270\,725$ | 3 |
| 90 students, 9 front-row seats | $P$ | $P(90, 9) = 2.56 \times 10^{17}$ | 3 |
| three diamonds in sequence | $P$ | $1716 / 132\,600 = 0.0129$ | 3 |
| five-person committee from 20 | $C$ | $C(20, 5) = 15\,504$ | 3 |
| spade flush | $C$ | $1287 / 2\,598\,960 = 0.0005$ | 3 |
| two dice, sum $< 12$ | NOT | $1 - 1/36 = 0.9722$ | 4 |
| birthday, 23 people | NOT | $1 - P(365, 23)/365^{23} = 0.5073$ | 4 |
| black card or heart | OR, mutually exclusive | $26/52 + 13/52 = 0.7500$ | 4 |
| red card or Ace (in class) | OR | $26/52 + 4/52 - 2/52 = 0.5385$ | 4 |
| 7 or Ace (printed) | OR, mutually exclusive | $8/52 = 0.1538$ | 4 |
| two-way table, 71 students | conditional | $61/71 = 0.8592$; $52/61 = 0.8525$; $52/58 = 0.8966$ | 5 |
| Right and iPhone independent? | independence | $0.8592 \times 0.8169 = 0.7019 \ne 52/71 = 0.7324$: not independent | 5 |
| two Aces | AND | with replacement $(4/52)^2 = 0.0059$; without $(4/52)(3/51) = 0.0045$ | 5 |
| sex and handedness | total probability, Bayes | $P(L) = 0.09$; $P(F \mid L) = 0.03/0.09 = 0.3333$ | 6 |
| defective CPUs | total probability, Bayes | $P(D) = 0.0125$; $P(\text{Intel} \mid D) = 0.0085/0.0125 = 0.68$ | 6 |

```widget
counting-calc
{ "preset": "committee C(20,5)" }
```

```widget
bayes-tree
{ "preset": "defective CPUs" }
```

:::tip A complete answer
Show the sample-space size or the formula name ($P$ or $C$), the substituted numbers, the arithmetic, and the final answer with the right number of decimals: $0.0085/0.0125 = 0.68$, not a bare 0.68.
:::

:::tip Counting positions with C
With $n$ coins, the outcomes with exactly $k$ heads are the ways to choose which $k$ of the $n$ flips are heads: $C(n, k)$. Three coins, two heads: choose 2 of 3 positions, HHT, HTH, THH, which is $C(3, 2) = 3$, the 3 of lesson 1's 8 outcomes.
:::

```quiz
[
  {
    "q": "Four fair coins are flipped. P(exactly two heads)? (4 decimals)",
    "type": "numeric",
    "answer": 0.375,
    "tolerance": 0.001,
    "explain": "Choose which 2 of the 4 flips are heads: HHTT, HTHT, HTTH, THHT, THTH, TTHH, which is C(4, 2) = 6. |S| = 2⁴ = 16, so 6/16 = 0.375."
  },
  {
    "q": "Four coins: P(at least one head)? (4 decimals)",
    "type": "numeric",
    "answer": 0.9375,
    "tolerance": 0.001,
    "explain": "Complement: no heads is 1 outcome of 16: 1 - 1/16 = 15/16 = 0.9375."
  },
  {
    "q": "Two dice: P(doubles)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1667,
    "tolerance": 0.0003,
    "explain": "Six doubles out of 36: 6/36 = 1/6."
  },
  {
    "q": "A die is rolled four times. How many outcomes are in the sample space?",
    "type": "numeric",
    "answer": 1296,
    "tolerance": 0,
    "explain": "6^4 = 1296 by the fundamental counting rule."
  },
  {
    "q": "Three cards with replacement: P(all three are face cards)? (5 decimals)",
    "type": "numeric",
    "answer": 0.01229,
    "tolerance": 0.00005,
    "explain": "12 face cards: (12/52)^3 = 0.01229."
  },
  {
    "q": "Three cards without replacement: P(all three are hearts)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0129,
    "tolerance": 0.0003,
    "explain": "(13/52)(12/51)(11/50) = 1716/132600 = 0.01294."
  },
  {
    "q": "Three cards WITH replacement: P(all three are hearts)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0156,
    "tolerance": 0.0002,
    "explain": "(13/52)^3 = (1/4)^3 = 1/64 = 0.0156, above the without-replacement 0.0129, the same contrast as the notes' 26^5/52^5 = 0.03125 against 0.0253 for five red cards."
  },
  {
    "q": "How many ways can 6 runners finish first, second and third?",
    "type": "numeric",
    "answer": 120,
    "tolerance": 0,
    "explain": "Order matters: P(6, 3) = 6 × 5 × 4 = 120."
  },
  {
    "q": "How many 3-person committees can be formed from 8 people?",
    "type": "numeric",
    "answer": 56,
    "tolerance": 0,
    "explain": "No order: C(8, 3) = 8!/(3! 5!) = 56."
  },
  {
    "q": "Five cards: P(a heart flush, all five hearts)? (6 decimals)",
    "type": "numeric",
    "answer": 0.000495,
    "tolerance": 0.000003,
    "explain": "Same count as the spade flush: C(13, 5)/C(52, 5) = 1287/2598960."
  },
  {
    "q": "Two dice: P(sum is at most 10)? (4 decimals)",
    "type": "numeric",
    "answer": 0.9167,
    "tolerance": 0.0003,
    "explain": "Complement: sum 11 (two ways) or 12 (one way) = 3/36; 1 - 3/36 = 33/36 = 0.9167."
  },
  {
    "q": "In a room of 30 people, P(at least two share a birthday)? (2 decimals)",
    "type": "numeric",
    "answer": 0.71,
    "tolerance": 0.01,
    "explain": "1 - P(365, 30)/365^30 = 1 - 0.294 = 0.706. The widget in lesson 4 draws the whole curve."
  },
  {
    "q": "Top card: P(a King or a red card)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5385,
    "tolerance": 0.0003,
    "explain": "Not mutually exclusive (two red Kings): 4/52 + 26/52 - 2/52 = 28/52 = 0.5385, the same arithmetic as the instructor's red card or Ace."
  },
  {
    "q": "Top card: P(a black card or a diamond)? (4 decimals)",
    "type": "numeric",
    "answer": 0.75,
    "tolerance": 0.0003,
    "explain": "Mutually exclusive (diamonds are red): 26/52 + 13/52 = 0.7500, the notes' black-or-heart example with the other red suit."
  },
  {
    "q": "From the handedness table, P(Android | Left)? (3 decimals)",
    "type": "numeric",
    "answer": 0.25,
    "tolerance": 0.002,
    "explain": "Restrict to the Left row: 2 Android of 8 left-handers = 0.25."
  },
  {
    "q": "From the table, P(Left | Android)? (3 decimals)",
    "type": "numeric",
    "answer": 0.286,
    "tolerance": 0.002,
    "explain": "Restrict to the Android column: 2 of 7 = 0.286."
  },
  {
    "q": "Two cards without replacement: P(two Kings)? (5 decimals)",
    "type": "numeric",
    "answer": 0.00452,
    "tolerance": 0.00003,
    "explain": "(4/52)(3/51) = 1/221, the same as two Aces."
  },
  {
    "q": "A class is 70% female; 4% of women and 12% of men are left-handed. P(left-handed)? (3 decimals)",
    "type": "numeric",
    "answer": 0.064,
    "tolerance": 0.001,
    "explain": "0.70(0.04) + 0.30(0.12) = 0.028 + 0.036 = 0.064."
  },
  {
    "q": "Same class: P(male | left-handed)? (3 decimals)",
    "type": "numeric",
    "answer": 0.5625,
    "tolerance": 0.002,
    "explain": "Male path 0.30 × 0.12 = 0.036, over P(L) = 0.064 from the last question: 0.036 / 0.064 = 0.5625."
  },
  {
    "q": "Suppliers: A 60% share with 2% defective, B 40% with 5% defective. P(a defective part came from B)? (3 decimals)",
    "type": "numeric",
    "answer": 0.625,
    "tolerance": 0.002,
    "explain": "P(D) = 0.60(0.02) + 0.40(0.05) = 0.012 + 0.020 = 0.032; P(B | D) = 0.020/0.032 = 0.625."
  }
]
```
