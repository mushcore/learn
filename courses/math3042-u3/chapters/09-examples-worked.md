---
title: Every lecture example, worked
minutes: 30
---

The Unit 3 notes were posted with the answer lines blank. Every example is worked here in the order it appears, with the arithmetic that goes on the answer line and a check where the demo notebook simulated it. Cover the solution, write yours, then compare; the quiz at the end is the same problems with the numbers changed.

## 3.1 Probability

**Three coins, $X$ = number of heads: is $X = 1$ or $X = 2$ more likely?** $S$ = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}, 8 outcomes. $P(X = 1) = 3/8$ (HTT, THT, TTH); $P(X = 2) = 3/8$ (HHT, HTH, THH). Equally likely.

**Five coins, all the same.** $|S| = 2^5 = 32$; $A$ = {HHHHH, TTTTT}; $P = 2/32 = 1/16 = 0.0625$.

**Five coins, at least two heads.** Fewer than two heads: 0 heads (1 way) + 1 head (5 ways) = 6. $P = 1 - 6/32 = 26/32 = 0.8125$.

**Boxcars.** 36 equally likely pairs, one is (6, 6): $P(B) = 1/36 = 0.0278$. Simulation of $10^5$ trials: about 0.028; `1/(6^2)` in the notebook prints 0.02777778.

## 3.2 Counting

**A die rolled five times.** $6^5 = 7776$ outcomes.

**Five cards with replacement, first three red and last two Kings.** $(26/52)^3 (4/52)^2 = (1/2)^3 (1/13)^2 = 1/1352 = 0.00074$.

**Five cards without replacement, all red.** $\dfrac{26}{52} \cdot \dfrac{25}{51} \cdot \dfrac{24}{50} \cdot \dfrac{23}{49} \cdot \dfrac{22}{48} = 0.0253$ (equivalently $C(26, 5)/C(52, 5) = 65\,780 / 2\,598\,960$).

**Arrange the four Aces.** $4! = 24$. Notebook: `factorial(4)` is 24.

**Select four cards and arrange them.** $P(52, 4) = 52 \cdot 51 \cdot 50 \cdot 49 = 6\,497\,400$. Notebook: `choose(52, 4) * factorial(4)`.

**A hand of four cards.** $C(52, 4) = 6\,497\,400 / 24 = 270\,725$. Notebook: `choose(52, 4)`. Calculator: `52 2ndF nCr 4`.

**90 students, 9 front-row seats.** Order matters (distinct seats): $P(90, 9) = 90 \cdot 89 \cdot 88 \cdot 87 \cdot 86 \cdot 85 \cdot 84 \cdot 83 \cdot 82 = 2.563 \times 10^{17}$.

**Three cards in sequence, all diamonds.** $P(13, 3) = 13 \cdot 12 \cdot 11 = 1716$ sequences. (As a probability: $1716 / P(52, 3) = 1716 / 132\,600 = 0.0129$.)

**A five-person committee from 20.** $C(20, 5) = \dfrac{20!}{5!\,15!} = 15\,504$.

**Spade flush.** $\dfrac{C(13, 5)}{C(52, 5)} = \dfrac{1287}{2\,598\,960} = 0.000495$.

```widget
counting-calc
{ "preset": "committee C(20,5)" }
```

## 3.3 Probability rules

**Two dice, sum less than 12.** Complement is sum = 12, one outcome: $1 - 1/36 = 35/36 = 0.9722$.

**Birthday problem, 23 people.** $P(\text{all different}) = \dfrac{365 \cdot 364 \cdots 343}{365^{23}} = 0.4927$; $P(\text{match}) = 1 - 0.4927 = 0.5073$. Notebook simulation: about 0.507.

**Top card is a 7 or an Ace.** Mutually exclusive: $4/52 + 4/52 = 8/52 = 2/13 = 0.1538$.

**Two-way table (71 students).** $P(\text{Right}) = 61/71 = 0.859$; $P(\text{iPhone} \mid \text{Right}) = 52/61 = 0.852$; $P(\text{Right} \mid \text{iPhone}) = 52/58 = 0.897$.

**Are Right and iPhone independent?** $P(\text{Right} \cap \text{iPhone}) = 52/71 = 0.732$ versus $P(\text{Right})\,P(\text{iPhone}) = (61/71)(58/71) = 0.702$. Not equal: dependent. (Or: $P(\text{iPhone} \mid \text{Right}) = 0.852 \ne P(\text{iPhone}) = 0.817$.)

**Two Aces.** (a) With replacement: $(4/52)(4/52) = 1/169 = 0.00592$. (b) Without: $(4/52)(3/51) = 1/221 = 0.00452$.

**Sex and handedness.** (a) $P(L) = 0.60(0.05) + 0.40(0.15) = 0.03 + 0.06 = 0.09$. (b) $P(F \mid L) = 0.03/0.09 = 1/3 = 0.333$.

**Defective CPUs.** (a) $P(D) = 0.85(0.01) + 0.10(0.03) + 0.05(0.02) = 0.0085 + 0.0030 + 0.0010 = 0.0125$. (b) $P(\text{Intel} \mid D) = 0.0085/0.0125 = 0.68$.

```widget
bayes-tree
{ "preset": "defective CPUs" }
```

:::quiz The four things that get marked
Show the sample-space size or the formula name ($P$ or $C$), the substituted numbers, the arithmetic, and the final answer with the right number of decimals. A bare 0.68 earns less than $0.0085/0.0125 = 0.68$.
:::

```quiz
[
  {
    "q": "Four fair coins are flipped. P(exactly two heads)? (4 decimals)",
    "type": "numeric",
    "answer": 0.375,
    "tolerance": 0.001,
    "explain": "|S| = 16; two heads can occupy C(4, 2) = 6 positions: 6/16 = 0.375."
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
    "explain": "Not mutually exclusive (two red Kings): 4/52 + 26/52 - 2/52 = 28/52 = 0.5385."
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
    "explain": "0.036 / 0.064 = 0.5625."
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
