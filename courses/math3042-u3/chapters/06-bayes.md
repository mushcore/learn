---
title: Bayes' rule on a tree diagram
minutes: 30
---
<!-- facts: poe1.ladder.hc-dead-by-rank, classic.cashshop.mfc-rates, classic.cashshop.founders-mfc-rates -->

You know each ladder rank band's dead share, $P(B \mid A_i)$, and you see a dead character; Bayes' rule, named after Thomas Bayes (1702 to 1761), turns that around into $P(A_i \mid B)$, the chance it came from each band. A tree diagram makes it arithmetic.

## Sex and handedness

A class is 60% female and 40% male; 5% of the women are left-handed, 15% of the men.

**(a) Pick a random student: P(left-handed)?** The instructor's sketch is a box split into an F column and an M column with the left-handers as a shaded strip crossing both: the left-handers come from two branches, the branches are mutually exclusive, so add the two pieces, and each piece is the AND rule:

$$P(L) = P(F \cap L) + P(M \cap L) = P(F)\,P(L \mid F) + P(M)\,P(L \mid M) = 0.6 \times 0.05 + 0.4 \times 0.15 = 0.09$$

**(b) Pick a random left-handed student: P(female)?** Of the 0.09 left-handers, 0.03 came through the female branch. The notes label this step *[Bayes']*:

$$P(\text{Female} \mid \text{Left}) = \frac{P(\text{Female} \cap \text{Left})}{P(\text{Left})} = \frac{0.6 \times 0.05}{0.6 \times 0.05 + 0.4 \times 0.15} = 0.3333$$

The instructor's conclusion sentence, in words: *One third of left-handed students are female.* Write a sentence like it after every Bayes answer; the number alone does not say which way the conditioning runs. Women are the majority of the class yet the minority of its left-handers, because men are three times as likely to be left-handed and that outweighs the 60/40 split.

```widget
bayes-tree
{ "preset": "sex and handedness" }
```

## The rule for two branches

Suppose $S$ is made up of two **exhaustive and mutually exclusive** events $A_1$ and $A_2$ (together they cover $S$, and they do not overlap), $S = A_1 \cup A_2$, *like Male ∪ Female*. Then for any event $B$,

$$P(A_1 \mid B) = \frac{P(A_1 \cap B)}{P(B)} = \frac{P(A_1)\,P(B \mid A_1)}{P(A_1)\,P(B \mid A_1) + P(A_2)\,P(B \mid A_2)}$$

Numerator: the path through $A_1$. Denominator: every path that ends in $B$. The formula is nothing more than the conditional probability formula with $P(B)$ expanded into its branches.

## The general theorem

If $A_1, A_2, \ldots, A_k$ are exhaustive and mutually exclusive for $S$, then any $B \subseteq S$ splits into disjoint slices, $B = (A_1 \cap B) \cup (A_2 \cap B) \cup \cdots \cup (A_k \cap B)$, so

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

The tree starts at a node the instructor labels *Start* and has three first-level branches ($A_1$ = Intel 0.85, $A_2$ = AMD 0.10, $A_3$ = Other 0.05), each splitting into Defective and Non-Defective. Beside each Defective leaf the notes write the joint probability of that path:

$$P(\text{Intel} \cap \text{Defective}) = 0.85 \times 0.01 = 0.0085, \quad P(\text{AMD} \cap \text{Defective}) = 0.1 \times 0.03 = 0.0030, \quad P(\text{Other} \cap \text{Defective}) = 0.05 \times 0.02 = 0.0010$$

**(a) Pick a random CPU: P(defective)?** The three paths are *mutually exclusive* (a CPU has one maker), so their probabilities add:

$$P(\text{Defective}) = P(\text{Intel} \cap \text{Def}) + P(\text{AMD} \cap \text{Def}) + P(\text{Other} \cap \text{Def}) = 0.0085 + 0.0030 + 0.0010 = 0.0125$$

**(b) Pick a random defective unit: P(Intel)?** The instructor rewords the question first, *What fraction of defective CPUs are from Intel?*, then applies Bayes:

$$P(\text{Intel} \mid \text{Defective}) = \frac{P(\text{Intel} \cap \text{Def})}{P(\text{Defective})} = \frac{0.85 \times 0.01}{0.85 \times 0.01 + 0.10 \times 0.03 + 0.05 \times 0.02} = \frac{0.0085}{0.0125} = 0.68$$

Conclusion sentence: *68% of defective units are from Intel.* AMD accounts for $0.0030/0.0125 = 0.24$ of the defective units and Other for $0.0010/0.0125 = 0.08$; the three posteriors add to 1, as they must. Intel's share of the defective units (68%) is below its market share (85%) because its defect rate is the lowest.

```widget
bayes-tree
{ "preset": "defective CPUs" }
```

### 10 000 CPUs, split and then restricted

The same tree in whole numbers: 10 000 CPUs split by maker (8500, 1000, 500), then each maker by defective (85, 30, 10). Conditioning on "defective" throws away everything except those 125 units, and $85/125 = 0.68$ is read off what remains.

```widget
bayes-flow-play
{}
```

:::quiz The two questions
(a) asks for $P(B)$: multiply along each path and **add**. (b) asks for $P(A_i \mid B)$: one path **divided** by that sum. Read which is which before touching the calculator: "randomly select a CPU" is (a); "randomly select a defective unit" restricts the sample space to $B$ and is (b).
:::

## Which rank band a dead Hardcore character came from

The universe is **these 800 sampled characters, 200 from each of four pages** of PoE1's Hardcore Allflame ladder (Hardcore, the league that flags dead characters) [PoE1, 3.29 Allflame, Hardcore Allflame ladder pulled 2026-10-27, checked 2026-10-27]. One of them is picked at random and is dead: which page?

| Rank band $A_i$ | $P(A_i)$ in the sample | $P(\text{dead} \mid A_i)$ |
|---|---|---|
| 1-200 | 200/800 = 0.25 | 69/200 = 0.345 |
| 3001-3200 | 0.25 | 120/200 = 0.600 |
| 7401-7600 | 0.25 | 158/200 = 0.790 |
| 14801-15000 | 0.25 | 157/200 = 0.785 |

Inside these 800 the pages are exhaustive and mutually exclusive, with known counts and dead rates: the CPU tree's shape. The prior 0.25 is 200 of these 800, not a share of the 15 000-character ladder, on which the four pages are not exhaustive.

```quiz
[
  {"q": "$P(\\text{dead})$ for a random one of the 800? (4 decimals)", "type": "numeric", "answer": 0.63, "tolerance": 0.0001, "explain": "Add the four paths: $0.25(0.345) + 0.25(0.600) + 0.25(0.790) + 0.25(0.785) = 0.08625 + 0.15 + 0.1975 + 0.19625 = 0.6300$."},
  {"q": "$P(\\text{14801-15000} \\mid \\text{dead})$? (4 decimals)", "type": "numeric", "answer": 0.3115, "tolerance": 0.0001, "explain": "One path over the total: $0.19625/0.63 = 0.3115$. Counts: 157 of the 504 dead, $157/504 = 0.3115$."},
  {"q": "$P(\\text{1-200} \\mid \\text{dead})$? (4 decimals)", "type": "numeric", "answer": 0.1369, "tolerance": 0.0001, "explain": "$0.08625/0.63 = 0.1369$, or $69/504$."}
]
```

$$P(\text{dead}) = 0.25 \times 0.345 + 0.25 \times 0.600 + 0.25 \times 0.790 + 0.25 \times 0.785 = 0.6300$$

$$P(\text{14801-15000} \mid \text{dead}) = \frac{0.25 \times 0.785}{0.6300} = \frac{0.19625}{0.6300} = 0.3115$$

Conclusion sentence: *31.15% of the dead characters in this sample are from ranks 14801-15000.* The posteriors 0.1369, 0.2381, 0.3135 and 0.3115 add to 1; in counts, 157 of the 504 dead.

## Which Mystery Fashion Crate gave a 1.00 % item

The Classic Mystery Fashion Crate (a Cash Shop box giving one of 50 cosmetic items) had two versions at Nexon's published rates: Founder's, 16 items at 1.00 % and 2 at 3.00 % [Classic, Founder's Access Cash Shop rate page, checked 2026-10-27]; Grand Launch, 15 at 1.00 %, 4 at 3.00 % and 1 at 1.50 % [Classic, Grand Launch Cash Shop rate page, checked 2026-10-27]. One crate is picked at random, each equally likely, and opened.

```quiz
[
  {"q": "$P(\\text{a 1.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.155, "tolerance": 0.0001, "explain": "$P(\\text{1.00 \\%} \\mid \\text{Founder's}) = 16 \\times 0.01 = 0.16$ and $P(\\text{1.00 \\%} \\mid \\text{Grand Launch}) = 15 \\times 0.01 = 0.15$. Law of total probability: $0.5(0.16) + 0.5(0.15) = 0.08 + 0.075 = 0.1550$."},
  {"q": "A 1.00 % item came out. $P(\\text{Founder's} \\mid \\text{1.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.5161, "tolerance": 0.0001, "explain": "One path over the total: $0.08/0.155 = 0.5161$."},
  {"q": "Which sentence states $P(\\text{Founder's} \\mid \\text{1.00 \\% item}) = 0.5161$ correctly?", "options": ["About 51.6% of the 1.00 % items from these two equally likely crates come from the Founder's crate", "About 51.6% of Founder's crates give a 1.00 % item", "The Founder's crate gives a 1.00 % item 16% of the time", "About 51.6% of all crates opened are Founder's"], "answer": 0, "explain": "The condition after the bar is the group you talk about: among 1.00 % items. \"16% of Founder's crates give a 1.00 % item\" is the other direction, $P(\\text{1.00 \\%} \\mid \\text{Founder's})$."},
  {"q": "A 3.00 % item came out. $P(\\text{Grand Launch} \\mid \\text{3.00 \\% item})$? (4 decimals)", "type": "numeric", "answer": 0.6667, "tolerance": 0.0001, "explain": "$P(\\text{3.00 \\%} \\mid \\text{Founder's}) = 2 \\times 0.03 = 0.06$, $P(\\text{3.00 \\%} \\mid \\text{Grand Launch}) = 4 \\times 0.03 = 0.12$. Total $0.5(0.06) + 0.5(0.12) = 0.09$; posterior $0.06/0.09 = 0.6667$."},
  {"q": "The 1.50 % item came out. $P(\\text{Grand Launch} \\mid \\text{1.50 \\% item})$?", "type": "numeric", "answer": 1, "tolerance": 0.0001, "explain": "The Founder's crate has no 1.50 % item, so its path is $0.5 \\times 0 = 0$. Posterior $0.5(0.015)/(0 + 0.5(0.015)) = 1$."},
  {"q": "Out of 1000 crates, 500 of each, how many give a 1.00 % item?", "type": "numeric", "answer": 155, "tolerance": 0, "explain": "$500 \\times 0.16 = 80$ Founder's plus $500 \\times 0.15 = 75$ Grand Launch: 155, and $80/155 = 0.5161$ again."}
]
```

```quiz
[
  {
    "q": "60% of a class is female, 5% of women and 15% of men are left-handed. P(a random student is left-handed)?",
    "type": "numeric",
    "answer": 0.09,
    "tolerance": 0.001,
    "explain": "0.60 × 0.05 + 0.40 × 0.15 = 0.03 + 0.06 = 0.09: add the two paths that end in left-handed."
  },
  {
    "q": "Same class. P(female | left-handed)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3333,
    "tolerance": 0.0005,
    "explain": "P(F ∩ L) / P(L) = (0.6 × 0.05) / (0.6 × 0.05 + 0.4 × 0.15) = 0.03 / 0.09 = 0.3333. In words: one third of left-handed students are female."
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
    "q": "The law of total probability says $P(B) =$ ...",
    "options": ["$\\sum_i P(A_i)$", "$\\sum_i P(A_i) P(B \\mid A_i)$", "$P(A_1) P(B \\mid A_1)$", "$1 - P(A_1)$"],
    "answer": 1,
    "explain": "B is cut into the slices A_i ∩ B; each slice's probability is P(A_i) P(B | A_i); add them."
  },
  {
    "q": "CPUs: Intel 85% share, 1% defective; AMD 10%, 3%; Other 5%, 2%. P(a random CPU is defective)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0125,
    "tolerance": 0.0001,
    "explain": "0.85(0.01) + 0.10(0.03) + 0.05(0.02) = 0.0085 + 0.0030 + 0.0010 = 0.0125."
  },
  {
    "q": "P(Intel | defective)? (2 decimals)",
    "type": "numeric",
    "answer": 0.68,
    "tolerance": 0.005,
    "explain": "0.0085 / 0.0125 = 0.68. Intel's path over the total defective probability."
  },
  {
    "q": "P(AMD | defective)? (2 decimals)",
    "type": "numeric",
    "answer": 0.24,
    "tolerance": 0.005,
    "explain": "0.0030 / 0.0125 = 0.24. The three posteriors 0.68 + 0.24 + 0.08 add to 1."
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
    "explain": "8500 Intel × 1% = 85, 1000 AMD × 3% = 30, 500 Other × 2% = 10: 125 defective, and 85/125 = 0.68."
  }
]
```
