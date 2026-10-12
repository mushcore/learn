---
title: Conditional probability, independence, the multiplication rule
minutes: 25
---

"What is the probability a student uses an iPhone?" and "what is the probability a student uses an iPhone, given that they are right-handed?" are different questions with different sample spaces. Conditional probability is the second kind, and comparing the two answers is the test for independence.

## Conditional probability

If $A$ and $B$ are events, the **conditional probability of $B$ given $A$** is

$$P(B \mid A) = \frac{|A \cap B|}{|A|}$$

Think of $P(B \mid A)$ as the probability of $B$ if we restrict the sample space to be $A$: the denominator is no longer all of $S$ but only the outcomes where $A$ happened. The filled notes label $A$ the *condition* and write *given* with an arrow at every bar: the event after the bar is the condition, and it goes in the denominator.

## The two-way table

The notes describe the students in MATH 3042 by handedness and phone type:

| | iPhone | Android | Other | row total |
|---|---|---|---|---|
| Left | 5 | 2 | 1 | 8 |
| Right | 52 | 5 | 4 | 61 |
| Ambidextrous | 1 | 0 | 1 | 2 |
| column total | 58 | 7 | 6 | 71 |

Select one student at random.

- $P(\text{Right}) = \dfrac{|\text{Right}|}{|S|} = \dfrac{61}{71} = 0.8592$: a row total over the grand total.
- $P(\text{iPhone} \mid \text{Right}) = \dfrac{|\text{iPhone} \cap \text{Right}|}{|\text{Right}|} = \dfrac{52}{61} = 0.8526$: restrict to the Right row; the cell over the **row** total.
- $P(\text{Right} \mid \text{iPhone}) = \dfrac{|\text{Right} \cap \text{iPhone}|}{|\text{iPhone}|} = \dfrac{52}{58} = 0.8966$: restrict to the iPhone column; the same cell over the **column** total.

The two conditionals share a numerator and differ only in which total is the new sample space. The filled notes box all three answers to four decimals, so give four. (Strictly $52/61 = 0.85246$ rounds to 0.8525; the notes' 0.8526 is the instructor's rounding, and either earns the mark.)

```widget
two-way
```

Click "Right" to see every conditional in that row, "iPhone" for the column, and the cell 52 for both at once with the independence test below.

## Independence

Events $A$ and $B$ are **independent** if

$$P(A \cap B) = P(A) \cdot P(B)$$

and otherwise **dependent**. The margin gloss: independent means the two events *don't influence each other*. Are Right and iPhone independent? The instructor's layout is three probabilities and a check:

$$P(\text{Right} \cap \text{iPhone}) = \frac{52}{71} = 0.7324, \qquad P(\text{Right}) = \frac{61}{71} = 0.8592, \qquad P(\text{iPhone}) = \frac{58}{71} = 0.8169$$

$$\text{Check: } 0.8592 \times 0.8169 = 0.7019 \ne 0.7324 \quad \Rightarrow \quad \text{NOT INDEPENDENT}$$

The product of the two marginals is not the joint probability, so the events are **dependent**: handedness carries some information about phone type in this class.

The notes prove an equivalent test: $A$ and $B$ are independent exactly when $P(B \mid A) = P(B)$, *prob of B given A* equals *prob of B*, so knowing $A$ does not change the probability of $B$. Starting from $|A \cap B|/|S| = (|A|/|S|)(|B|/|S|)$ and multiplying both sides by $|S|/|A|$ gives $|A \cap B|/|A| = |B|/|S|$, which is $P(B \mid A) = P(B)$. On the table: $P(\text{iPhone} \mid \text{Right}) = 0.8526$ against $P(\text{iPhone}) = 0.8169$; different, so dependent, the same verdict.

:::quiz Independent is not mutually exclusive
Mutually exclusive events with positive probabilities are always **dependent**: if $A$ happened, $B$ certainly did not, so $P(B \mid A) = 0 \ne P(B)$. Independence means the overlap is exactly $P(A)P(B)$, never zero.
:::

## The multiplication rule (AND)

$$P(A \cap B) = P(A) \cdot P(B) \quad \text{if independent}, \qquad P(A \cap B) = P(A) \cdot P(B \mid A) \quad \text{if dependent}$$

The second form is the general one (it reduces to the first when $P(B \mid A) = P(B)$), and it is the one the notes highlight: the instructor's nickname is the **AND rule**, because $\cap$ reads as "and".

**Two Aces from a standard deck.** Name the events the way the notes do: $A_1$ = *event that 1st card is Ace*, $A_2$ = event that the 2nd card is an Ace. Both parts are then the same formula, $P(A_1 \cap A_2) = P(A_1) \times P(A_2 \mid A_1)$, and only the second factor changes.

(a) The first card is replaced before the second draw: the draws are independent, so $P(A_2 \mid A_1) = P(A_2) = 4/52$ and $P(A_1 \cap A_2) = \dfrac{4}{52} \times \dfrac{4}{52} = \dfrac{1}{169} = 0.0059$.

(b) The first card is not replaced: given the first was an Ace, 3 Aces remain among 51 cards, so $P(A_1 \cap A_2) = \dfrac{4}{52} \times \dfrac{3}{51} = \dfrac{1}{221} = 0.0045$.

The margin note beside the two boxed answers is *these differ*: replacing the card is what makes the draws independent.

Rearranging the general multiplication rule gives the **conditional probability formula** in terms of probabilities rather than counts:

$$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$

This is the form Bayes' rule (next lesson) is built from.

```quiz
[
  {
    "q": "$P(B \\mid A)$ is defined as...",
    "options": ["$|A \\cap B| / |S|$", "$|A \\cap B| / |A|$", "$|A| / |B|$", "$|B| / |S|$"],
    "answer": 1,
    "explain": "Restrict the sample space to A: the outcomes in both, over the outcomes in A."
  },
  {
    "q": "From the handedness table (71 students, 61 right-handed), P(Right) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8592,
    "tolerance": 0.0003,
    "explain": "61/71 = 0.8592: a row total over the grand total."
  },
  {
    "q": "P(iPhone | Right) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8525,
    "tolerance": 0.0003,
    "explain": "Restrict to the Right row: 52 iPhone users out of 61 right-handers, 52/61 = 0.8525 (boxed 0.8526 in the notes)."
  },
  {
    "q": "P(Right | iPhone) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8966,
    "tolerance": 0.0003,
    "explain": "Restrict to the iPhone column: 52 of 58, 52/58 = 0.8966. Same cell, different total."
  },
  {
    "q": "Which pair of numbers decides whether Right and iPhone are independent?",
    "options": ["P(Right) and P(iPhone)", "P(Right ∩ iPhone) = 52/71 = 0.7324 versus P(Right)·P(iPhone) = 0.8592 × 0.8169 = 0.7019", "row total and column total", "52 and 71"],
    "answer": 1,
    "explain": "Independence means the joint probability equals the product of the marginals. The notes' check: 0.7019 ≠ 0.7324, NOT INDEPENDENT."
  },
  {
    "q": "P(iPhone) from the table = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.8169,
    "tolerance": 0.0003,
    "explain": "A column total over the grand total: 58/71 = 0.8169. It is the second factor in the independence check and the P(B) in the test P(B | A) = P(B)."
  },
  {
    "q": "A and B are independent if and only if...",
    "options": ["$P(A \\cap B) = 0$", "$P(B \\mid A) = P(B)$", "$P(A) = P(B)$", "$P(A \\cup B) = 1$"],
    "answer": 1,
    "explain": "The notes' fact, proved from the definition: knowing A happened does not change the probability of B."
  },
  {
    "q": "Two events with positive probabilities that are mutually exclusive are...",
    "options": ["independent", "dependent", "complementary", "equally likely"],
    "answer": 1,
    "explain": "If A happened, B cannot have: P(B | A) = 0 ≠ P(B)."
  },
  {
    "q": "Two cards drawn with replacement. P(two Aces)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0059,
    "tolerance": 0.0001,
    "explain": "Independent draws: P(A1) × P(A2 | A1) with P(A2 | A1) = P(A2): (4/52)(4/52) = 1/169 = 0.0059."
  },
  {
    "q": "Two cards drawn without replacement. P(two Aces)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0045,
    "tolerance": 0.0001,
    "explain": "Dependent: P(A1) × P(A2 | A1) = (4/52)(3/51) = 1/221 = 0.0045. The notes' margin: these differ."
  },
  {
    "q": "The general multiplication rule is...",
    "options": ["$P(A \\cap B) = P(A) + P(B)$", "$P(A \\cap B) = P(A) \\cdot P(B \\mid A)$", "$P(A \\cap B) = P(A) \\cdot P(B)$ always", "$P(A \\cap B) = P(A) / P(B)$"],
    "answer": 1,
    "explain": "Multiply the first probability by the conditional probability of the second given the first; when independent, P(B | A) = P(B) and it collapses to the product."
  },
  {
    "q": "Rearranged, the multiplication rule gives $P(B \\mid A) =$ ...",
    "options": ["$P(A \\cap B) / P(A)$", "$P(A) / P(A \\cap B)$", "$P(A \\cap B) / P(B)$", "$P(A) \\cdot P(B)$"],
    "answer": 0,
    "explain": "The conditional probability formula in terms of probabilities, the starting point for Bayes' rule."
  }
]
```
