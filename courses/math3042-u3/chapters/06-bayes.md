---
title: Bayes' rule on a tree diagram
minutes: 30
---
<!-- facts: poe1.ladder.hc-dead-by-rank, classic.cashshop.mfc-rates, classic.cashshop.founders-mfc-rates -->

You know each ladder rank band's dead share, $P(B \mid A_i)$, and you see a dead character; Bayes' rule, named after Thomas Bayes (1702 to 1761), turns that around into $P(A_i \mid B)$, the chance it came from each band.

A tree diagram makes it arithmetic.

## Sex and handedness

A class is 60% female and 40% male; 5% of the women are left-handed, 15% of the men.

**(a) Pick a random student: P(left-handed)?** The instructor's sketch is a box split into an F column and an M column, with the left-handers as a strip crossing both:

```diagram
{ "type": "grid", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "hf", "label": "Female 0.60", "row": 0, "col": 1 },
  { "id": "hm", "label": "Male 0.40", "row": 0, "col": 2 },
  { "id": "l", "label": "Left", "row": 1, "col": 0 },
  { "id": "lf", "label": "0.6 × 0.05 = 0.03", "row": 1, "col": 1 },
  { "id": "lm", "label": "0.4 × 0.15 = 0.06", "row": 1, "col": 2 },
  { "id": "r", "label": "Right", "row": 2, "col": 0 },
  { "id": "rf", "label": "0.57", "row": 2, "col": 1 },
  { "id": "rm", "label": "0.34", "row": 2, "col": 2 }
], "hi": ["l", "lf", "lm"], "caption": "Each cell is column share × rate. The Left row holds every left-hander: 0.03 + 0.06." }
```

1. Two ways to be left-handed: female then left, male then left.
2. Each is the AND rule:
   $$0.6 \times 0.05 = 0.03 \qquad 0.4 \times 0.15 = 0.06$$
3. A student is one or the other, so add:
   $$0.03 + 0.06 = \mathbf{0.09}$$

$$P(L) = P(F \cap L) + P(M \cap L) = P(F)\,P(L \mid F) + P(M)\,P(L \mid M) = 0.6 \times 0.05 + 0.4 \times 0.15 = \mathbf{0.09}$$

**(b) Pick a random left-handed student: P(female)?** Of the 0.09 left-handers, 0.03 came through the female branch.

The notes label this step *[Bayes']*:

$$P(\text{Female} \mid \text{Left}) = \frac{P(\text{Female} \cap \text{Left})}{P(\text{Left})} = \frac{0.6 \times 0.05}{0.6 \times 0.05 + 0.4 \times 0.15} = \mathbf{0.3333}$$

The instructor's conclusion sentence, in words: *One third of left-handed students are female.*

Write a sentence like it after every Bayes answer; the number alone does not say which way the conditioning runs.

Women are the majority of the class yet the minority of its left-handers, because men are three times as likely to be left-handed and that outweighs the 60/40 split.

```widget
bayes-tree
{ "preset": "sex and handedness" }
```

In whole numbers: of 1000 students, 600 F → 30 L and 400 M → 60 L, so 30 of the 90 left-handers are female.

```widget
bayes-flow-play
{ "preset": "sex and handedness" }
```

## The rule for two branches

Suppose $S$ is made up of two **exhaustive and mutually exclusive** events $A_1$ and $A_2$ (together they cover $S$, and they do not overlap), $S = A_1 \cup A_2$, *like Male ∪ Female*. Then for any event $B$,

$$P(A_1 \mid B) = \frac{P(A_1 \cap B)}{P(B)} = \frac{P(A_1)\,P(B \mid A_1)}{P(A_1)\,P(B \mid A_1) + P(A_2)\,P(B \mid A_2)}$$

Numerator: the path through $A_1$. Denominator: every path that ends in $B$.

The formula is nothing more than the conditional probability formula with $P(B)$ expanded into its branches.

:::tip Who is who
In lesson 5, $A$ was the condition in $P(B \mid A)$. In Bayes' rule the answer has $B$ as the condition.

| symbol | role | CPUs | handedness | ladder |
|---|---|---|---|---|
| $A_i$ | the branch chosen first (prior) | maker | sex | rank band |
| $B$ | what you observe | defective | left-handed | dead |

The problem gives $P(B \mid A_i)$; Bayes turns it into $P(A_i \mid B)$.
:::

## The general theorem

If $A_1, A_2, \ldots, A_k$ are exhaustive and mutually exclusive for $S$, then any $B \subseteq S$ splits into disjoint slices:

$$B = (A_1 \cap B) \cup (A_2 \cap B) \cup \cdots \cup (A_k \cap B)$$

so

$$P(B) = \sum_i P(A_i)\,P(B \mid A_i)$$

which is the **law of total probability**, and for any of the $A_i$

$$P(A_i \mid B) = \frac{P(A_i)\,P(B \mid A_i)}{P(A_1)\,P(B \mid A_1) + \cdots + P(A_k)\,P(B \mid A_k)}$$

The notes' caption for this box is *Bayes' Theorem in General*: the two-branch rule with $k$ branches in the denominator.

## Defective CPUs

| Company | Market share | Percent defective |
|---|---|---|
| Intel | 85.0% | 1.0% |
| AMD | 10.0% | 3.0% |
| Other | 5.0% | 2.0% |

The instructor's tree starts at *Start*.

The first branches are the makers, $A_1$, $A_2$, $A_3$, with their market shares; each maker splits into Defective and Non-defective with its defect rate.

Each leaf shows the branch rate → the joint probability of its path.

```diagram
{ "type": "tree", "nodes": [
  { "id": "s", "label": "Start" },
  { "id": "i", "label": "Intel", "sub": "0.85", "parent": "s" },
  { "id": "a", "label": "AMD", "sub": "0.10", "parent": "s" },
  { "id": "o", "label": "Other", "sub": "0.05", "parent": "s" },
  { "id": "id", "label": "Defective", "sub": "0.01 → 0.0085", "parent": "i" },
  { "id": "in", "label": "Non-defective", "sub": "0.99 → 0.8415", "parent": "i" },
  { "id": "ad", "label": "Defective", "sub": "0.03 → 0.0030", "parent": "a" },
  { "id": "an", "label": "Non-defective", "sub": "0.97 → 0.0970", "parent": "a" },
  { "id": "od", "label": "Defective", "sub": "0.02 → 0.0010", "parent": "o" },
  { "id": "on", "label": "Non-defective", "sub": "0.98 → 0.0490", "parent": "o" }
], "hi": ["id", "ad", "od"], "caption": "Multiply along a path; add the lit leaves for P(D) = 0.0125; one lit leaf ÷ 0.0125 is the posterior." }
```

**(a) Pick a random CPU: P(defective)?** The three paths are *mutually exclusive* (a CPU has one maker), so their probabilities add:

$$P(\text{Defective}) = P(\text{Intel} \cap \text{Def}) + P(\text{AMD} \cap \text{Def}) + P(\text{Other} \cap \text{Def}) = 0.0085 + 0.0030 + 0.0010 = \mathbf{0.0125}$$

**(b) Pick a random defective unit: P(Intel)?** The instructor rewords the question first, *What fraction of defective CPUs are from Intel?*, then applies Bayes:

$$P(\text{Intel} \mid \text{Defective}) = \frac{P(\text{Intel} \cap \text{Def})}{P(\text{Defective})} = \frac{0.85 \times 0.01}{0.85 \times 0.01 + 0.10 \times 0.03 + 0.05 \times 0.02} = \frac{0.0085}{0.0125} = \mathbf{0.68}$$

Conclusion sentence: *68% of defective units are from Intel.*

AMD and Other account for the rest of the defective units:

$$P(\text{AMD} \mid \text{Def}) = \dfrac{0.0030}{0.0125} = 0.24 \qquad P(\text{Other} \mid \text{Def}) = \dfrac{0.0010}{0.0125} = 0.08$$

The three posteriors add to 1, as they must.

Intel's share of the defective units (68%) is below its market share (85%) because its defect rate is the lowest.

```widget
bayes-tree
{ "preset": "defective CPUs" }
```

### 10 000 CPUs, split and then restricted

The same tree in whole numbers: 10 000 CPUs split by maker (8500, 1000, 500), then each maker by defective (85, 30, 10).

Conditioning on "defective" throws away everything except those 125 units, and the answer is read off what remains:

$$\dfrac{85}{125} = \mathbf{0.68}$$

```widget
bayes-flow-play
{}
```

:::quiz The two questions
(a) asks for $P(B)$: multiply along each path and **add**. (b) asks for $P(A_i \mid B)$: one path **divided** by that sum.

Read which is which before touching the calculator: "randomly select a CPU" is (a); "randomly select a defective unit" restricts the sample space to $B$ and is (b).
:::

## Which rank band a dead Hardcore character came from

The universe is **these 800 sampled characters, 200 from each of four pages** of PoE1's Hardcore Allflame ladder (Hardcore, the league that flags dead characters).

One of them is picked at random and is dead: which page?

| Rank band $A_i$ | $P(A_i)$ in the sample | $P(\text{dead} \mid A_i)$ |
|---|---|---|
| 1-200 | 200/800 = 0.25 | 69/200 = 0.345 |
| 3001-3200 | 0.25 | 120/200 = 0.600 |
| 7401-7600 | 0.25 | 158/200 = 0.790 |
| 14801-15000 | 0.25 | 157/200 = 0.785 |

Each prior 0.25 is 200 of these 800, not of the whole ladder, so inside these 800 the four pages are exhaustive and mutually exclusive: the CPU tree's shape.

```quiz
[
  {"q": "$P(\\text{dead})$ for a random one of the 800? (4 decimals)", "type": "numeric", "answer": 0.63, "tolerance": 0.0001, "explain": "Add the four paths: $$0.25(0.345) + 0.25(0.600) + 0.25(0.790) + 0.25(0.785) = 0.08625 + 0.15 + 0.1975 + 0.19625 = \\mathbf{0.6300}$$"},
  {"q": "$P(\\text{14801-15000} \\mid \\text{dead})$? (4 decimals)", "type": "numeric", "answer": 0.3115, "tolerance": 0.0001, "explain": "One path over the total: $$0.19625/0.63 = \\mathbf{0.3115}$$ Counts: 157 of the 504 dead, $$157/504 = 0.3115$$"},
  {"q": "$P(\\text{1-200} \\mid \\text{dead})$? (4 decimals)", "type": "numeric", "answer": 0.1369, "tolerance": 0.0001, "explain": "$$0.08625/0.63 = \\mathbf{0.1369}$$ or $69/504$."}
]
```

$$P(\text{dead}) = 0.25 \times 0.345 + 0.25 \times 0.600 + 0.25 \times 0.790 + 0.25 \times 0.785 = \mathbf{0.6300}$$

$$P(\text{14801-15000} \mid \text{dead}) = \frac{0.25 \times 0.785}{0.6300} = \frac{0.19625}{0.6300} = \mathbf{0.3115}$$

Conclusion sentence: *31.15% of the dead characters in this sample are from ranks 14801-15000.*

The posteriors add to one:

$$0.1369 + 0.2381 + 0.3135 + 0.3115 = 1$$

This is lesson 5's two-way table read down the Dead column, 157 of the 504 dead:

$$\dfrac{157}{504} = 0.3115$$

When the priors come from counts in one table, the tree is the long way round.

## Which Mystery Fashion Crate gave a 1.00 % item

The Classic Mystery Fashion Crate (a Cash Shop box giving one of 50 cosmetic items) had two versions at Nexon's published rates: Founder's, 16 items at 1.00 % and 2 at 3.00 %; Grand Launch, 15 at 1.00 %, 4 at 3.00 % and one at 1.50 %.

One crate is picked at random, each equally likely, and opened.

One crate gives one item, so its items are mutually exclusive and the OR rule adds them. Sixteen items at 1.00 % make

$$16 \times 0.01 = 0.16$$

| crate | P(crate) | P(1.00 % item \| crate) | P(3.00 % item \| crate) | P(1.50 % item \| crate) |
|---|---|---|---|---|
| Founder's | 0.5 | 16 × 0.01 = 0.16 | 2 × 0.03 = 0.06 | 0 |
| Grand Launch | 0.5 | 15 × 0.01 = 0.15 | 4 × 0.03 = 0.12 | 0.015 |

```quiz
[
  {"q": "$P(\\text{a 1.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.155, "tolerance": 0.0001, "explain": "$$P(\\text{1.00 \\%} \\mid \\text{Founder's}) = 16 \\times 0.01 = 0.16$$ $$P(\\text{1.00 \\%} \\mid \\text{Grand Launch}) = 15 \\times 0.01 = 0.15$$ Law of total probability: $$0.5(0.16) + 0.5(0.15) = 0.08 + 0.075 = \\mathbf{0.1550}$$"},
  {"q": "A 1.00 % item came out. $P(\\text{Founder's} \\mid \\text{1.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.5161, "tolerance": 0.0001, "explain": "One path over the total: $$0.08/0.155 = \\mathbf{0.5161}$$"},
  {"q": "Which sentence states $P(\\text{Founder's} \\mid \\text{1.00 \\% item}) = 0.5161$ correctly?", "options": ["About 51.6% of the 1.00 % items from these two equally likely crates come from the Founder's crate", "About 51.6% of Founder's crates give a 1.00 % item", "The Founder's crate gives a 1.00 % item 16% of the time", "About 51.6% of all crates opened are Founder's"], "answer": 0, "explain": "The condition after the bar is the group you talk about: among 1.00 % items. \"16% of Founder's crates give a 1.00 % item\" is the other direction, $P(\\text{1.00 \\%} \\mid \\text{Founder's})$."},
  {"q": "A 3.00 % item came out. $P(\\text{Grand Launch} \\mid \\text{3.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.6667, "tolerance": 0.0001, "explain": "$$P(\\text{3.00 \\%} \\mid \\text{Founder's}) = 2 \\times 0.03 = 0.06$$ $$P(\\text{3.00 \\%} \\mid \\text{Grand Launch}) = 4 \\times 0.03 = 0.12$$ Total: $$0.5(0.06) + 0.5(0.12) = 0.09$$ Posterior: $$0.06/0.09 = \\mathbf{0.6667}$$"},
  {"q": "The 1.50 % item came out. $P(\\text{Grand Launch} \\mid \\text{1.50 \\% item})$?", "type": "numeric", "answer": 1, "tolerance": 0.0001, "explain": "The Founder's crate has no 1.50 % item, so its path is $0.5 \\times 0 = 0$. Posterior: $$\\dfrac{0.5(0.015)}{0 + 0.5(0.015)} = \\mathbf{1}$$"},
  {"q": "Out of 1000 crates, 500 of each, how many give a 1.00 % item?", "type": "numeric", "answer": 155, "tolerance": 0, "explain": "Founder's plus Grand Launch: $$500 \\times 0.16 + 500 \\times 0.15 = 80 + 75 = \\mathbf{155}$$ And $80/155 = 0.5161$ again."}
]
```

```quiz
[
  {
    "q": "60% of a class is female, 5% of women and 15% of men are left-handed. P(a random student is left-handed)?",
    "type": "numeric",
    "answer": 0.09,
    "tolerance": 0.001,
    "explain": "Add the two paths that end in left-handed: $$0.60 \\times 0.05 + 0.40 \\times 0.15 = 0.03 + 0.06 = \\mathbf{0.09}$$"
  },
  {
    "q": "Same class. P(female | left-handed)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3333,
    "tolerance": 0.0005,
    "explain": "$$\\dfrac{P(F \\cap L)}{P(L)} = \\dfrac{0.6 \\times 0.05}{0.6 \\times 0.05 + 0.4 \\times 0.15} = \\dfrac{0.03}{0.09} = \\mathbf{0.3333}$$ In words: one third of left-handed students are female."
  },
  {
    "q": "Which sentence correctly states the result P(Female | Left) = 0.3333?",
    "options": ["One third of female students are left-handed", "One third of left-handed students are female", "One third of students are female and left-handed", "Left-handed students are one third of the class"],
    "answer": 1,
    "explain": "The condition (after the bar) is the group you are talking about: among left-handed students, one third are female. 'Of female students, 5% are left-handed' is the other direction, P(L | F)."
  },
  {
    "q": "Events $A_1, \\ldots, A_k$ are exhaustive and mutually exclusive when...",
    "options": ["they all have the same probability", "together they cover the whole sample space and do not overlap", "each has probability 1/k", "they are independent"],
    "answer": 1,
    "explain": "Exhaustive: their union is S. Mutually exclusive: no two overlap. Female/male and Intel/AMD/Other both qualify."
  },
  {
    "q": "The law of total probability says $P(B) =$...",
    "options": ["$\\sum_i P(A_i)$", "$\\sum_i P(A_i) P(B \\mid A_i)$", "$P(A_1) P(B \\mid A_1)$", "$1 - P(A_1)$"],
    "answer": 1,
    "explain": "B is cut into the slices $A_i \\cap B$; each slice's probability is $P(A_i)\\,P(B \\mid A_i)$; add them: $$P(B) = \\sum_i P(A_i)\\,P(B \\mid A_i)$$"
  },
  {
    "q": "CPUs: Intel 85% share, 1% defective; AMD 10%, 3%; Other 5%, 2%. P(a random CPU is defective)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0125,
    "tolerance": 0.0001,
    "explain": "$$0.85(0.01) + 0.10(0.03) + 0.05(0.02) = 0.0085 + 0.0030 + 0.0010 = \\mathbf{0.0125}$$"
  },
  {
    "q": "P(Intel | defective)? (2 decimals)",
    "type": "numeric",
    "answer": 0.68,
    "tolerance": 0.005,
    "explain": "$$0.0085 / 0.0125 = \\mathbf{0.68}$$ Intel's path over the total defective probability."
  },
  {
    "q": "P(AMD | defective)? (2 decimals)",
    "type": "numeric",
    "answer": 0.24,
    "tolerance": 0.005,
    "explain": "$$0.0030 / 0.0125 = \\mathbf{0.24}$$ The three posteriors add to 1: $$0.68 + 0.24 + 0.08 = 1$$"
  },
  {
    "q": "Why is Intel's share of defective units (68%) smaller than its market share (85%)?",
    "options": ["Because 68 is less than 85 always", "Because Intel's defect rate (1%) is the lowest of the three, so it contributes fewer defectives per unit sold", "Because AMD sells more", "It is a rounding error"],
    "answer": 1,
    "explain": "The posterior weighs the prior (share) by the likelihood (defect rate); a low defect rate pulls Intel's posterior below its prior."
  },
  {
    "q": "Which question asks for a Bayes posterior $P(A_i \\mid B)$ rather than a total probability $P(B)$?",
    "options": ["If you randomly select a CPU, what is the probability it is defective?", "If you randomly select a defective unit, what is the probability it is Intel?", "What fraction of CPUs are Intel?", "What is P(defective | Intel)?"],
    "answer": 1,
    "explain": "'Randomly select a defective unit' restricts the sample space to B and asks about the branch: a path divided by P(B)."
  },
  {
    "q": "Out of 10 000 CPUs in the example, how many are defective, and how many of those are Intel?",
    "options": ["125 defective, 85 Intel", "1250 defective, 850 Intel", "125 defective, 30 Intel", "85 defective, 85 Intel"],
    "answer": 0,
    "explain": "8500 Intel × 1% = 85, 1000 AMD × 3% = 30, 500 Other × 2% = 10: $$85 + 30 + 10 = \\mathbf{125} \\text{ defective}$$ And $$85/125 = 0.68$$"
  }
]
```
