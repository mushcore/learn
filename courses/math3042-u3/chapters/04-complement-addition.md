---
title: The complement and addition rules
minutes: 22
---
<!-- facts: gms.box.divine-wishing-bell, poe1.fusing.six-link-measured, poe2.damage.lucky-binary, poe2.ninja.main-skill-shares -->

"At least one 17-Star Enhancement from a stack of Divine Wishing Bells" is a tangle of cases; its opposite, "none at all", is one product.

The filled notes call section 3.3 the *"short cut"* and nickname the three rules by the English word each one handles: the complement rule is the **NOT rule**, the addition rule is the **OR rule**, and the multiplication rule of the next lesson is the **AND rule**.

Read a problem, find its not / or / and, and you have found the rule.

## The complement rule (NOT)

For any event $A$ in a sample space $S$, the **complementary event** is everything else, $\bar{A} = S - A = \{x \in S \mid x \notin A\}$, and since $A$ and $\bar{A}$ together are all of $S$,

$$P(\bar{A}) = \frac{|\bar{A}|}{|S|} = \frac{|S| - |A|}{|S|} = 1 - P(A)$$

The instructor's one-line example: $P(\text{Not Rain}) = 1 - P(\text{Rain})$.

**Two dice, sum less than 12.** The only sum that is not less than 12 is 12 itself, the single outcome (6, 6). So

$$P(\text{sum} < 12) = 1 - \dfrac{1}{36} = \dfrac{35}{36} = \mathbf{0.9722}$$

Counting the 35 favourable outcomes directly gives the same answer with 35 times the work.

```widget
sample-space
{ "mode": "dice", "event": "under12", "title": "Sum < 12: 35 outcomes in A, one in the complement" }
```

**The birthday problem.** A room holds 23 people; what is the probability that at least two share a birthday (day and month, any year)? Assume all 365 dates are equally likely and ignore February 29.

"At least two share" is a tangle of cases; its complement, "all 23 birthdays are different", is one product.

The first person can have any birthday; the second must avoid one date, the third two dates, and so on. Person k must avoid the k − 1 dates already taken, so person 23 has

$$365 - 22 = 343 \text{ choices}$$

Top: 23 factors, which is P(365, 23):

$$365 \times 364 \times \cdots \times 343$$

Bottom: 365 multiplied 23 times, $365^{23}$.

$$P(\text{all different}) = \frac{365}{365} \cdot \frac{364}{365} \cdot \frac{363}{365} \cdots \frac{343}{365} = \frac{P(365, 23)}{365^{23}} = 0.4927$$

$$P(\text{at least one match}) = 1 - 0.4927 = \mathbf{0.5073}$$

More likely than not, with only 23 people.

The demo notebook simulates one room with two lines, repeats them over $10^5$ rooms, and lands on 0.507:

```r
bdays <- sample(1:365, 23, replace=TRUE)
length(unique(bdays)) < 23
```

:::info R syntax
| Code | What it does |
|---|---|
| `bdays <- …` | `<-` is assignment: it stores the 23 sampled birthdays under the name `bdays`. |
| `sample(1:365, 23, replace=TRUE)` | `1:365` is the whole numbers 1 to 365. `sample` fills x = those dates, size = 23 people; `replace=TRUE` lets two people share a date. |
| `unique(bdays)` | Keeps one copy of each distinct value in `bdays`. |
| `length(unique(bdays)) < 23` | `length` counts the distinct dates; `<` is less than, so `TRUE` means at least one date repeated. |

**Left to right**

- `bdays <- sample(1:365, 23, replace=TRUE)`: "Store under the name bdays (`bdays <-`) a random sample (`sample`) from the dates 1 to 365 (`1:365`) of size 23 (`23`) with replacement (`replace=TRUE`)."
- `length(unique(bdays)) < 23`: "Whether the number (`length`) of distinct values (`unique`) in bdays (`bdays`) is less than (`<`) 23 (`23`)."

**Right to left**, the order R runs it

- `bdays <- sample(1:365, 23, replace=TRUE)`: "Build the dates 1 to 365 (`1:365`), allow repeats (`replace=TRUE`), draw 23 of them (`sample`), then store them as bdays (`bdays <-`)."
- `length(unique(bdays)) < 23`: "Take bdays (`bdays`), drop the duplicates (`unique`), count what is left (`length`), then compare the count with 23 (`< 23`)."
:::

```widget
birthday
```

### The product of shrinking fractions, one person at a time

Each person who enters multiplies P(all different) by one more fraction:

$$\dfrac{365 - k + 1}{365}$$

The fractions stay close to 1, yet their product falls below 0.5 at person 23.

```widget
birthday-play
{}
```

## The addition rule (OR)

For one trial and two events $A$ and $B$,

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

$A \cup B$ is "$A$ or $B$ (or both)", the *union*; $A \cap B$ is "$A$ and $B$", the *intersection*.

The subtraction *avoids double counting*: the outcomes in both events were counted twice in $P(A) + P(B)$.

```widget
prob-rules
{ "preset": "red card or Ace" }
```

The diagram shows the in-class example: 26 red cards and 4 Aces overlap in the 2 red Aces, so the union holds 28 of 52 cards.

The other presets hold the rows of the table below.

Events $A$ and $B$ are **mutually exclusive** if they cannot both occur in one trial: $A$ = draw a black card and $B$ = draw a heart.

Then $P(A \cap B) = 0$ and the rule simplifies to

$$P(A \cup B) = P(A) + P(B)$$

| Top card is … | P(A) | P(B) | overlap P(A ∩ B) | P(A ∪ B) |
|---|---|---|---|---|
| black or a heart | 26/52 | 13/52 | 0 | 39/52 = 0.7500 |
| a 7 or an Ace | 4/52 | 4/52 | 0 | 8/52 = 0.1538 |
| a heart or an Ace | 13/52 | 4/52 | 1/52 | 16/52 = 0.3077 |
| red or an Ace | 26/52 | 4/52 | 2/52 | 28/52 = 0.5385 |

The first two rows are mutually exclusive, so the overlap is 0.

In the last two, the Ace of hearts (or the two red Aces) sits in both events; forgetting the subtraction counts it twice.

The instructor worked red/Ace in class to show an overlap.

:::quiz Mutually exclusive is about one trial
Black and heart cannot both happen to the same card. They can certainly both happen across two draws.

The addition rule and the definition of mutually exclusive always refer to **one trial** of the experiment.
:::

## At least one 17-Star Enhancement in 33 Divine Wishing Bells

A Divine Wishing Bell, a GMS cash-shop box, costs 3,500 NX, or 99,000 NX for 33, and gives one reward from Nexon's table of 33 rows summing to 100.00 %.

Two rows are a 100 % 17-Star Enhancement, a coupon that puts 17 stars on an item: 0.50 % for Lv. 150 and 0.20 % for Lv. 160.

Each bell gives exactly one reward, so its rows are mutually exclusive and add, and each bell is opened independently of the last.

:::tip None in 33 is an AND
"None in 33 bells" means none in bell 1 AND none in bell 2 AND … AND none in bell 33. For independent bells you multiply the 33 chances (the AND rule, next lesson).

So "at least one in $n$ tries" is

$$1 - P(\text{none in one try})^n$$

OR on one try, NOT, AND across the tries, NOT again.
:::

```quiz
[
  {"q": "You open 33 bells. $P(\\text{at least one 17-Star Enhancement})$? (4 decimals)", "type": "numeric", "answer": 0.2069, "tolerance": 6e-05, "explain": "OR rule on one bell, exclusive rows: $$0.0050 + 0.0020 = 0.0070$$ NOT rule, none in one bell: $$1 - 0.0070 = 0.9930$$ None in 33 independent bells: $$0.993^{33} = 0.7931$$ At least one: $$1 - 0.7931 = \\mathbf{0.2069}$$"}
]
```

1. OR, one bell:
   $$0.0050 + 0.0020 = 0.0070$$
2. NOT, one bell gives none:
   $$1 - 0.0070 = 0.9930$$
3. AND, 33 independent bells give none:
   $$0.993^{33} = 0.7931$$
4. NOT, at least one:
   $$1 - 0.7931 = \mathbf{0.2069}$$

A better-than-even chance takes 99 bells, three 33-bell bundles or 297,000 NX (computed):

$$1 - 0.993^{99} = 1 - 0.4989 = \mathbf{0.5011}$$

## Six-links, lucky crits and main-skill shares

A 2017 test of n = 100 000 Orbs of Fusing, the currency that rerolls socket links, on a 20 %-quality six-socket item measured the six-link chance at about 1 in 1000.

In PoE2 a lucky crit, hit or block succeeds with probability $2p - p^2$.

"At least one six-link in many Fusings" is the bells pattern again: NOT on one use, AND across the independent uses, NOT again.

```quiz
[
  {"q": "Take the six-link chance as 1/1000 per Fusing, independent uses. $P(\\text{at least one six-link in 1000 Fusings})$? (4 decimals)", "type": "numeric", "answer": 0.6323, "tolerance": 6e-05, "explain": "NOT rule: no six-link in one use is $0.999$; in 1000 uses $$0.999^{1000} = 0.3677$$ At least one: $$1 - 0.3677 = \\mathbf{0.6323}$$ 1000 Fusings is not a sure thing."},
  {"type": "fill", "q": "Fill the blank so R prints the chance of at least one six-link, close to the wiki's \"about 77 %\".", "code": "1 - (1 - 1/1000)^___\n## [1] 0.7770372", "answer": ["1500"], "explain": "$$1 - 0.999^{1500} = 1 - 0.2230 = \\mathbf{0.7770}$$ This is the wiki's about 77 % chance within 1500 Fusings."},
  {"q": "A PoE2 crit chance of 40 % is made lucky. $P(\\text{crit})$? (4 decimals)", "type": "numeric", "answer": 0.64, "tolerance": 6e-05, "explain": "$2p - p^2 = 1 - (1 - p)^2$, a NOT rule: $$1 - 0.60^2 = 1 - 0.36 = \\mathbf{0.6400}$$ Read as an OR rule it is $$p + p - p \\times p = 0.40 + 0.40 - 0.16 = 0.6400$$ the overlap subtracted once. This is the poe2wiki's 40 % to 64 % example."},
  {"q": "One Divine Wishing Bell. The 15-Star Enhancement rows are 0.70 % (Lv. 150) and 0.60 % (Lv. 160). $P(\\text{a 15-Star or a 17-Star Enhancement})$? (4 decimals)", "type": "numeric", "answer": 0.02, "tolerance": 6e-05, "explain": "One bell, one reward: the four rows are mutually exclusive, so add: $$0.0070 + 0.0060 + 0.0050 + 0.0020 = \\mathbf{0.0200}$$"},
  {"q": "Of 124 117 PoE2 ladder characters, 18 % use Herald of Ice and 17 % use Frost Bomb as a main skill. So $P(\\text{Herald of Ice or Frost Bomb}) = 0.18 + 0.17 = 0.35$.", "type": "tf", "answer": false, "explain": "A character can use several main skills; poe.ninja's twelve listed shares sum to 162 %. The events are not mutually exclusive and the overlap is not published, so the OR rule gives only bounds: between 0.18 (complete overlap) and 0.35 (none)."}
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
    "explain": "The complement is sum = 12, the single outcome (6, 6): $$1 - 1/36 = 35/36 = \\mathbf{0.9722}$$"
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
    "explain": "Favourable ordered assignments over possible ones: $$\\dfrac{365 \\times 364 \\times \\cdots \\times 343}{365^{23}} = \\mathbf{0.4927}$$ So $P(\\text{match}) = 0.5073$."
  },
  {
    "q": "P(at least two of 23 people share a birthday)? (3 decimals)",
    "type": "numeric",
    "answer": 0.507,
    "tolerance": 0.002,
    "explain": "$$1 - 0.4927 = \\mathbf{0.5073}$$ This matches the notebook's simulation."
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
    "explain": "Black card and heart: no single card is both. Then $P(A \\cap B) = 0$ and $$P(A \\cup B) = P(A) + P(B)$$"
  },
  {
    "q": "Top card of a shuffled deck: P(a 7 or an Ace)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1538,
    "tolerance": 0.0003,
    "explain": "Mutually exclusive: $$4/52 + 4/52 = 8/52 = \\mathbf{0.1538}$$"
  },
  {
    "q": "Top card: P(a heart or an Ace)?",
    "options": ["17/52", "16/52", "13/52", "4/52"],
    "answer": 1,
    "explain": "The Ace of hearts is in both: $$13/52 + 4/52 - 1/52 = \\mathbf{16/52} = 0.3077$$"
  },
  {
    "q": "Top card: P(a red card or an Ace)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5385,
    "tolerance": 0.0003,
    "explain": "The in-class example. Not mutually exclusive, two Aces are red: $$26/52 + 4/52 - 2/52 = 28/52 = \\mathbf{0.5385}$$"
  },
  {
    "q": "Top card: P(a black card or a heart)? (4 decimals)",
    "type": "numeric",
    "answer": 0.75,
    "tolerance": 0.0003,
    "explain": "Mutually exclusive, so the subtraction term is 0: $$26/52 + 13/52 = 39/52 = \\mathbf{0.7500}$$"
  },
  {
    "q": "Which nickname does the instructor give each rule?",
    "options": ["complement = AND, addition = OR, multiplication = NOT", "complement = OR, addition = NOT, multiplication = AND", "complement = NOT, addition = OR, multiplication = AND", "all three are the OR rule"],
    "answer": 2,
    "explain": "NOT rule: $$P(\\text{not } A) = 1 - P(A)$$ OR rule: $$P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)$$ AND rule: $$P(A \\text{ and } B) = P(A)\\,P(B \\mid A)$$ The English word in the question names the rule."
  },
  {
    "q": "'Draw a black card' and 'draw a heart' are mutually exclusive.",
    "type": "tf",
    "answer": true,
    "explain": "Hearts are red; no card is both black and a heart. The notes' own example."
  }
]
```
