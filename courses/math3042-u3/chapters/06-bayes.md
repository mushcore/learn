---
title: Bayes' rule on a tree diagram
minutes: 25
---

You know how often each group produces an outcome ($P(B \mid A_i)$: 5% of women are left-handed) and you observe the outcome; Bayes' rule, named after Thomas Bayes (1702 to 1761), turns that around into the probability of the group given the outcome ($P(A_i \mid B)$: a left-handed student is a woman with what probability?). A tree diagram makes it arithmetic.

## Sex and handedness

A class is 60% female and 40% male; 5% of the women are left-handed, 15% of the men.

**(a) Pick a random student: P(left-handed)?** The left-handers come from two branches, and the branches are mutually exclusive, so add the two paths:

$$P(L) = P(F)\,P(L \mid F) + P(M)\,P(L \mid M) = 0.60(0.05) + 0.40(0.15) = 0.03 + 0.06 = 0.09$$

**(b) Pick a random left-handed student: P(female)?** Of the 0.09 left-handers, 0.03 came through the female branch:

$$P(F \mid L) = \frac{P(F \cap L)}{P(L)} = \frac{0.03}{0.09} = \frac{1}{3}$$

Women are the majority of the class yet the minority of its left-handers, because men are three times as likely to be left-handed and that outweighs the 60/40 split.

```widget
bayes-tree
{ "preset": "sex and handedness" }
```

## The rule for two branches

Suppose $S$ is made up of two **exhaustive and mutually exclusive** events $A_1$ and $A_2$ (together they cover $S$, and they do not overlap). Then for any event $B$,

$$P(A_1 \mid B) = \frac{P(A_1 \cap B)}{P(B)} = \frac{P(A_1)\,P(B \mid A_1)}{P(A_1)\,P(B \mid A_1) + P(A_2)\,P(B \mid A_2)}$$

Numerator: the path through $A_1$. Denominator: every path that ends in $B$. The formula is nothing more than the conditional probability formula with $P(B)$ expanded into its branches.

## The general theorem

If $A_1, A_2, \ldots, A_k$ are exhaustive and mutually exclusive for $S$, then any $B \subseteq S$ splits into disjoint slices, $B = (A_1 \cap B) \cup (A_2 \cap B) \cup \cdots \cup (A_k \cap B)$, so

$$P(B) = \sum_i P(A_i)\,P(B \mid A_i)$$

which is the **law of total probability**, and for any of the $A_i$

$$P(A_i \mid B) = \frac{P(A_i)\,P(B \mid A_i)}{P(A_1)\,P(B \mid A_1) + \cdots + P(A_k)\,P(B \mid A_k)}$$

## Defective CPUs

| Company | Market share | Percent defective |
|---|---|---|
| Intel | 85.0% | 1.0% |
| AMD | 10.0% | 3.0% |
| Other | 5.0% | 2.0% |

The tree has three first-level branches ($A_1$ = Intel 0.85, $A_2$ = AMD 0.10, $A_3$ = Other 0.05), each splitting into Defective and Non-Defective.

**(a) Pick a random CPU: P(defective)?**

$$P(D) = 0.85(0.01) + 0.10(0.03) + 0.05(0.02) = 0.0085 + 0.0030 + 0.0010 = 0.0125$$

**(b) Pick a random defective unit: P(Intel)?**

$$P(\text{Intel} \mid D) = \frac{0.0085}{0.0125} = 0.68$$

AMD accounts for $0.0030/0.0125 = 0.24$ of the defective units and Other for $0.0010/0.0125 = 0.08$; the three posteriors add to 1, as they must. Intel's share of the defective units (68%) is below its market share (85%) because its defect rate is the lowest.

```widget
bayes-tree
{ "preset": "defective CPUs" }
```

The last column of the widget's table restates the tree in whole numbers: of 10 000 CPUs, 8500 are Intel and 85 of those are defective, 1000 are AMD with 30 defective, 500 Other with 10 defective; 125 defective in all, 85 of them Intel, $85/125 = 0.68$. If the algebra ever feels slippery, count a population of 10 000.

:::quiz The two questions
(a) asks for $P(B)$: multiply along each path and **add**. (b) asks for $P(A_i \mid B)$: one path **divided** by that sum. Read which is which before touching the calculator: "randomly select a CPU" is (a); "randomly select a defective unit" restricts the sample space to $B$ and is (b).
:::

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
    "q": "Same class. P(female | left-handed)? (3 decimals)",
    "type": "numeric",
    "answer": 0.333,
    "tolerance": 0.002,
    "explain": "P(F ∩ L) / P(L) = 0.03 / 0.09 = 1/3. The female path over the total left-handed probability."
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
