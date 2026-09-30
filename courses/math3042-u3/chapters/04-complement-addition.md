---
title: The complement and addition rules
minutes: 20
---

Two rules turn hard counts into easy ones. The complement rule counts what you do not want; the addition rule combines two events without counting their overlap twice.

## The complement rule

For any event $A$ in a sample space $S$, the **complementary event** is everything else, $\bar{A} = S - A$, and since $A$ and $\bar{A}$ together are all of $S$,

$$P(\bar{A}) = 1 - P(A)$$

**Two dice, sum less than 12.** The only sum that is not less than 12 is 12 itself, the single outcome (6, 6). So $P(\text{sum} < 12) = 1 - 1/36 = 35/36 = 0.9722$. Counting the 35 favourable outcomes directly gives the same answer with 35 times the work.

```widget
sample-space
{ "mode": "dice", "event": "under12", "title": "Sum < 12: 35 outcomes in A, one in the complement" }
```

**The birthday problem.** A room holds 23 people; what is the probability that at least two share a birthday (day and month, any year)? Assume all 365 dates are equally likely and ignore February 29. "At least two share" is a tangle of cases; its complement, "all 23 birthdays are different", is one product. The first person can have any birthday; the second must avoid one date, the third two dates, and so on:

$$P(\text{all different}) = \frac{365}{365} \cdot \frac{364}{365} \cdot \frac{363}{365} \cdots \frac{343}{365} = \frac{P(365, 23)}{365^{23}} = 0.4927$$

$$P(\text{at least one match}) = 1 - 0.4927 = 0.5073$$

More likely than not, with only 23 people. The demo notebook's simulation (`sample(1:365, 23, replace=TRUE)` and `length(unique(...)) < 23` over $10^5$ rooms) lands on 0.507.

```widget
birthday
```

## The addition rule

For one trial and two events $A$ and $B$,

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

$A \cup B$ is "$A$ or $B$ (or both)"; $A \cap B$ is "both". The subtraction removes the outcomes in both events, which $P(A) + P(B)$ counted twice.

Events $A$ and $B$ are **mutually exclusive** if they cannot both occur in one trial: $A$ = draw a black card and $B$ = draw a heart. Then $P(A \cap B) = 0$ and the rule simplifies to $P(A \cup B) = P(A) + P(B)$.

**Top card is a 7 or an Ace.** A card cannot be both, so the events are mutually exclusive: $P = 4/52 + 4/52 = 8/52 = 2/13 = 0.1538$.

**Top card is a heart or an Ace** (for contrast). The Ace of hearts is in both, so $P = 13/52 + 4/52 - 1/52 = 16/52 = 0.3077$; forgetting the subtraction gives 17/52 and counts the Ace of hearts twice.

```widget
prob-rules
{ "preset": "7 or Ace (top card)" }
```

Switch to "heart or Ace" to see the overlap appear, and to "black card or heart" for the notes' mutually exclusive pair.

:::quiz Mutually exclusive is about one trial
Black and heart cannot both happen to the same card. They can certainly both happen across two draws. The addition rule and the definition of mutually exclusive always refer to **one trial** of the experiment.
:::

```quiz
[
  {
    "q": "The complement rule states...",
    "options": ["$P(\\bar{A}) = P(A)$", "$P(\\bar{A}) = 1 - P(A)$", "$P(\\bar{A}) = 1 / P(A)$", "$P(\\bar{A}) = P(S) - 1$"],
    "answer": 1,
    "explain": "A and its complement together make up S and share nothing, so their probabilities add to 1."
  },
  {
    "q": "Two dice are rolled. P(sum is less than 12)? (4 decimals)",
    "type": "numeric",
    "answer": 0.9722,
    "tolerance": 0.0003,
    "explain": "The complement is sum = 12, the single outcome (6, 6): 1 - 1/36 = 35/36 = 0.9722."
  },
  {
    "q": "In the birthday problem with 23 people, the complement of 'at least two share a birthday' is...",
    "options": ["nobody has a birthday", "exactly two share a birthday", "all 23 birthdays are different", "everyone shares a birthday"],
    "answer": 2,
    "explain": "'At least two share' fails only when every birthday is distinct; that single case is the one product to compute."
  },
  {
    "q": "P(all 23 birthdays are different) = ?",
    "options": ["$P(365, 23) / 365^{23} = 0.4927$", "$23 / 365$", "$C(365, 23) / 365^{23}$", "$1 / 365^{23}$"],
    "answer": 0,
    "explain": "365 × 364 × … × 343 favourable ordered assignments over 365^23 possible ones: 0.4927, so P(match) = 0.5073."
  },
  {
    "q": "P(at least two of 23 people share a birthday)? (3 decimals)",
    "type": "numeric",
    "answer": 0.507,
    "tolerance": 0.002,
    "explain": "1 - 0.4927 = 0.5073, matching the notebook's simulation."
  },
  {
    "q": "The addition rule is $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$. Why subtract?",
    "options": ["Because probabilities cannot exceed 1", "The outcomes in both A and B were counted twice in P(A) + P(B)", "To make the events mutually exclusive", "It is only needed for dice"],
    "answer": 1,
    "explain": "Adding the two counts double-counts the overlap; subtracting it once corrects that."
  },
  {
    "q": "Events A and B are mutually exclusive when...",
    "options": ["they have the same probability", "they cannot both occur in one trial of the experiment", "one is the complement of the other", "they are independent"],
    "answer": 1,
    "explain": "Black card and heart: no single card is both. Then P(A ∩ B) = 0 and P(A ∪ B) = P(A) + P(B)."
  },
  {
    "q": "Top card of a shuffled deck: P(a 7 or an Ace)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1538,
    "tolerance": 0.0003,
    "explain": "Mutually exclusive: 4/52 + 4/52 = 8/52 = 0.1538."
  },
  {
    "q": "Top card: P(a heart or an Ace)?",
    "options": ["17/52", "16/52", "13/52", "4/52"],
    "answer": 1,
    "explain": "13/52 + 4/52 - 1/52 (the Ace of hearts is in both): 16/52 = 0.3077."
  },
  {
    "q": "'Draw a black card' and 'draw a heart' are mutually exclusive.",
    "type": "tf",
    "answer": true,
    "explain": "Hearts are red; no card is both black and a heart. The notes' own example."
  }
]
```
