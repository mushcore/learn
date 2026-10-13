---
title: The complement and addition rules
minutes: 20
---

Two rules turn hard counts into easy ones. The complement rule counts what you do not want; the addition rule combines two events without counting their overlap twice. The filled notes call section 3.3 the *"short cut"* and nickname the three rules by the English word each one handles: the complement rule is the **NOT rule**, the addition rule is the **OR rule**, and the multiplication rule of the next lesson is the **AND rule**. Read a problem, find its not / or / and, and you have found the rule.

## The complement rule (NOT)

For any event $A$ in a sample space $S$, the **complementary event** is everything else, $\bar{A} = S - A = \{x \in S \mid x \notin A\}$, and since $A$ and $\bar{A}$ together are all of $S$,

$$P(\bar{A}) = \frac{|\bar{A}|}{|S|} = \frac{|S| - |A|}{|S|} = 1 - P(A)$$

The instructor's one-line example: $P(\text{Not Rain}) = 1 - P(\text{Rain})$.

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

### The product of shrinking fractions, one person at a time

Each person who enters multiplies P(all different) by one more fraction, $(365 - k + 1)/365$. The fractions stay close to 1, yet their product falls below 0.5 at person 23.

```widget
birthday-play
{}
```

## The addition rule (OR)

For one trial and two events $A$ and $B$,

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

$A \cup B$ is "$A$ or $B$ (or both)", the *union*; $A \cap B$ is "$A$ and $B$", the *intersection*. The subtraction *avoids double counting*: the outcomes in both events were counted twice in $P(A) + P(B)$.

Events $A$ and $B$ are **mutually exclusive** if they cannot both occur in one trial: $A$ = draw a black card and $B$ = draw a heart. Then $P(A \cap B) = 0$ and the rule simplifies to $P(A \cup B) = P(A) + P(B)$.

**Top card is black or a heart.** The notes' mutually exclusive pair, worked to a number: $P(A \cup B) = \dfrac{26}{52} + \dfrac{13}{52} = 0.7500$. The subtraction term is crossed out because it is zero.

**Top card is a red card or an Ace.** The printed notes asked for "a 7 or an Ace"; in class the instructor crossed out the 7 and worked *red card or Ace* instead, *changed problem to illustrate when A and B are not mutually exclusive*. Two Aces are red, so

$$P(\text{Red} \cup \text{Ace}) = P(\text{Red}) + P(\text{Ace}) - P(\text{Red} \cap \text{Ace}) = \frac{26}{52} + \frac{4}{52} - \frac{2}{52} = 0.5385$$

**Top card is a 7 or an Ace** (the printed version). A card cannot be both, so the events are mutually exclusive: $P = 4/52 + 4/52 = 8/52 = 2/13 = 0.1538$.

**Top card is a heart or an Ace** (one more overlap). The Ace of hearts is in both, so $P = 13/52 + 4/52 - 1/52 = 16/52 = 0.3077$; forgetting the subtraction gives 17/52 and counts the Ace of hearts twice.

```widget
prob-rules
{ "preset": "red card or Ace" }
```

The diagram shows the in-class example: 26 red cards and 4 Aces overlap in the 2 red Aces, so the union holds 28 of 52 cards. The other presets hold the printed "7 or Ace", the heart-or-Ace overlap and the mutually exclusive black-or-heart pair.

:::quiz Mutually exclusive is about one trial
Black and heart cannot both happen to the same card. They can certainly both happen across two draws. The addition rule and the definition of mutually exclusive always refer to **one trial** of the experiment.
:::

## NOT and OR on dice, birthdays and cards

Each question names a NOT or an OR; pick the rule before computing.

```quiz
[
  {"q": "Three dice are rolled. $P(\\text{at least one 6})$? (4 decimals)", "type": "numeric", "answer": 0.4213, "tolerance": 6e-05, "explain": "NOT rule: the complement is no 6 on any die, $(5/6)^3 = 125/216 = 0.5787$. So $1 - 0.5787 = 0.4213$."},
  {"q": "Ten people are in a room. $P(\\text{at least two share a birthday})$? (4 decimals)", "type": "numeric", "answer": 0.1169, "tolerance": 6e-05, "explain": "$P(\\text{all different}) = P(365, 10)/365^{10} = (365 \\times 364 \\times \\cdots \\times 356)/365^{10} = 0.8831$, so $P(\\text{match}) = 1 - 0.8831 = 0.1169$."},
  {"q": "Top card of a shuffled deck: $P(\\text{face card or heart})$? (4 decimals)", "type": "numeric", "answer": 0.4231, "tolerance": 6e-05, "explain": "OR rule with overlap: 12 face cards, 13 hearts, 3 heart face cards (J, Q, K of hearts). $12/52 + 13/52 - 3/52 = 22/52 = 0.4231$."},
  {"q": "Top card: $P(\\text{a 2, a 3 or a 4})$? (4 decimals)", "type": "numeric", "answer": 0.2308, "tolerance": 6e-05, "explain": "Mutually exclusive ranks, so just add: $4/52 + 4/52 + 4/52 = 12/52 = 0.2308$."},
  {"q": "\"Face card\" and \"heart\" are mutually exclusive.", "type": "tf", "answer": false, "explain": "The J, Q and K of hearts are both, so $P(\\text{face} \\cap \\text{heart}) = 3/52 \\ne 0$ and the subtraction is needed."},
  {"type": "fill", "q": "Fill the blank so R prints the ten-person birthday probability.", "code": "1 - prod(365:___) / 365^10\n## [1] 0.1169482", "answer": ["356"], "explain": "Ten factors from 365 down: 365, 364, …, 356, which is $P(365, 10)$. `prod()` multiplies them."}
]
```

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
    "q": "Top card: P(a red card or an Ace)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5385,
    "tolerance": 0.0003,
    "explain": "The in-class example. Not mutually exclusive, two Aces are red: 26/52 + 4/52 - 2/52 = 28/52 = 0.5385."
  },
  {
    "q": "Top card: P(a black card or a heart)? (4 decimals)",
    "type": "numeric",
    "answer": 0.75,
    "tolerance": 0.0003,
    "explain": "Mutually exclusive, so the subtraction term is 0: 26/52 + 13/52 = 39/52 = 0.7500."
  },
  {
    "q": "Which nickname does the instructor give each rule?",
    "options": ["complement = AND, addition = OR, multiplication = NOT", "complement = OR, addition = NOT, multiplication = AND", "complement = NOT, addition = OR, multiplication = AND", "all three are the OR rule"],
    "answer": 2,
    "explain": "NOT rule: P(not A) = 1 - P(A). OR rule: P(A or B) = P(A) + P(B) - P(A and B). AND rule: P(A and B) = P(A) P(B | A). The English word in the question names the rule."
  },
  {
    "q": "'Draw a black card' and 'draw a heart' are mutually exclusive.",
    "type": "tf",
    "answer": true,
    "explain": "Hearts are red; no card is both black and a heart. The notes' own example."
  }
]
```
