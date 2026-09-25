---
title: Order of growth and the efficiency classes
minutes: 14
---

By the end of [Setting up and simplifying the sums](#/comp3760-l1/counting-with-sums) every algorithm we analyzed had turned into a formula. The slide says it in five words: **Running times of algorithms are functions.**

| Algorithm | Running time |
|---|---|
| `find` (largest element) | $f(n) = n - 1$ |
| `Mystery2` (sum of an $n \times n$ array) | $f(n) = n^2$ |
| `Loops` (insertion sort, worst case) | $f(n) = \frac{(n-1)n}{2}$ |

This lesson is about comparing such functions. The next one, [Big-O, Big-Ω, Big-Θ](#/comp3760-l1/big-o-omega-theta), makes the comparison formal.

## There are LOTS of functions in the world

The slide throws fifteen functions at you, in no particular order:

$50n^3+20n+4$, $4n^2+10$, $n(2n+1)$, $3\log_2 n+1$, $3\log_2 n+n$, $1+\log_2 6$, $5!+3^2$, $\log_2 n$, $3737n$, $n^2+3n^3$, $3^n$, $\log_2 n+9n!$, $2^n - 1$, $4n\log_2 n$, $8675309$.

Any of them could be the basic-operation count of some algorithm. **Some functions are bigger than others.** But **what does "bigger" mean?** Bigger at $n = 5$? At $n = 5{,}000$? **We need a formalized way to talk about this.**

## Which one is the better algorithm?

The slide asks it with four running times:

- $C(n) = \frac{n(n-1)}{2}$
- $C(n) \approx 0.5n^2$
- $C(n) = \log n + 5$
- $C(n) = n!$

Multiply out the first one: $\frac{n(n-1)}{2} = \frac{n^2}{2} - \frac{n}{2}$. For large $n$ the $-\frac{n}{2}$ hardly matters next to $\frac{n^2}{2}$, so the first two are essentially the *same* running time written two ways. $\log n + 5$ grows far more slowly than either, and $n!$ grows faster than anything else on this page. The whole lesson is about making "essentially the same" and "grows faster" precise.

## Order of growth

Two algorithms, $f_A(n) = n$ and $f_B(n) = n^2$. The slide draws them on one axis: for the smallest inputs the red $n^2$ curve actually sits *below* the straight line $n$ (at $n = 0.5$, $n^2 = 0.25$). Then it crosses at $n = 1$ and pulls away, and it never comes back.

That crossing is the point. Which algorithm is faster on a tiny input is an accident of constants. **What we really care about: order of growth as $n \to \infty$.**

```widget
growth-plot
{ "nmax": 30, "title": "Orders of growth: drag n and read every function; toggle curves off to compare two at a time" }
```

Turn everything off except `n` and `n^2` and watch the gap open. Then turn on `2^n`: on this log-scale axis it is the curve that is still a straight line pointing up when everything polynomial has bent over. Finally `n!`, which leaves even $2^n$ behind.

## Table 2.1: values of the functions that matter

The textbook's Table 2.1 is on the slide with the note **these represent possible functions that classify basic ops counts**. Values are approximate.

| $n$ | $\log_2 n$ | $n$ | $n\log_2 n$ | $n^2$ | $n^3$ | $2^n$ | $n!$ |
|---|---|---|---|---|---|---|---|
| $10$ | 3.3 | $10^1$ | $3.3 \cdot 10^1$ | $10^2$ | $10^3$ | $10^3$ | $3.6 \cdot 10^6$ |
| $10^2$ | 6.6 | $10^2$ | $6.6 \cdot 10^2$ | $10^4$ | $10^6$ | $1.3 \cdot 10^{30}$ | $9.3 \cdot 10^{157}$ |
| $10^3$ | 10 | $10^3$ | $1.0 \cdot 10^4$ | $10^6$ | $10^9$ | | |
| $10^4$ | 13 | $10^4$ | $1.3 \cdot 10^5$ | $10^8$ | $10^{12}$ | | |
| $10^5$ | 17 | $10^5$ | $1.7 \cdot 10^6$ | $10^{10}$ | $10^{15}$ | | |
| $10^6$ | 20 | $10^6$ | $2.0 \cdot 10^7$ | $10^{12}$ | $10^{18}$ | | |

Three things to read off it:

- **$\log_2 n$ barely moves.** Multiplying $n$ by ten adds about 3.3 to $\log_2 n$. A million items need only 20 halvings.
- **$n \log_2 n$ is "almost linear".** At $n = 10^6$ it is $2.0 \cdot 10^7$, only 20 times $n$ itself, while $n^2$ is a million times $n$.
- **$2^n$ and $n!$ run off the table.** The book does not even print them past $n = 100$.

:::warn 100! on the fastest supercomputer
The slide circles $9.3 \cdot 10^{157}$ and adds: **$1.5 \times 10^{133}$ years on the world's fastest supercomputer.** An algorithm that tries every permutation of 100 items is not "slow"; it will not finish in the lifetime of the universe. That is why the efficiency *class* of an algorithm matters more than any constant factor.
:::

## Common efficiency classes

Every basic-operation count you will meet in this course lands in one of eight classes. The names and the textbook's comments (the underlined parts are what the instructor highlighted on the slide):

| Class | Name | Comments |
|---|---|---|
| $1$ | constant | Short of best-case efficiencies, very few reasonable examples can be given, since an algorithm's running time typically goes to infinity when its input size grows infinitely large. |
| $\log n$ | logarithmic | Typically, **a result of cutting a problem's size by a constant factor on each iteration of the algorithm.** Note that a logarithmic algorithm cannot take into account all its input (or even a fixed fraction of it): any algorithm that does so will have at least linear running time. |
| $n$ | linear | **Algorithms that scan a list of size $n$** (e.g., sequential search) belong to this class. |
| $n \log n$ | "n-log-n" | **Many divide-and-conquer algorithms**, including mergesort and quicksort in the average case, fall into this category. |
| $n^2$ | quadratic | Typically, characterizes efficiency of algorithms with **two embedded loops.** Elementary sorting algorithms and certain operations on $n$-by-$n$ matrices are standard examples. |
| $n^3$ | cubic | Typically, characterizes efficiency of algorithms with **three embedded loops.** Several nontrivial algorithms from linear algebra fall into this class. |
| $2^n$ | exponential | Typical for algorithms that generate **all subsets of an $n$-element set.** Often, the term "exponential" is used in a broader sense to include this and larger orders of growth as well. |
| $n!$ | factorial | Typical for algorithms that generate **all permutations of an $n$-element set.** |

Matching the classes to the algorithms you have already counted:

- `Example3` halves $i$ every pass, so it is **logarithmic**: cutting the problem's size by a constant factor on each iteration.
- `find` and `SequentialSearch` scan a list of size $n$: **linear**.
- `Loops` (insertion sort, an elementary sort) and `UniqueElements` have two embedded loops: **quadratic**.
- `MatrixMultiply` has three embedded loops: **cubic**.

:::quiz Two true/false traps hiding in the table
**A logarithmic algorithm cannot look at all of its input.** True: to touch every one of $n$ items takes at least $n$ steps, which is already linear. So anything in $O(\log n)$ must be *skipping* most of the input (binary search skips half of what is left on every step).

**Two nested loops always mean $n^2$.** False as a rule, true as a "typically". If the inner loop runs a *constant* number of times (say 1 to 10), the count is $10n$, which is linear. Count the loop bounds; do not just count the loops.
:::

## Try it

```quiz
[
  {
    "type": "match",
    "q": "Match each efficiency class to the textbook's description of where it comes from.",
    "pairs": [
      ["$\\log n$ (logarithmic)", "cutting a problem's size by a constant factor on each iteration"],
      ["$n$ (linear)", "algorithms that scan a list of size n, e.g. sequential search"],
      ["$n \\log n$", "many divide-and-conquer algorithms; mergesort and quicksort on average"],
      ["$n^2$ (quadratic)", "two embedded loops; elementary sorting algorithms"],
      ["$n^3$ (cubic)", "three embedded loops; several algorithms from linear algebra"],
      ["$2^n$ (exponential)", "generating all subsets of an n-element set"],
      ["$n!$ (factorial)", "generating all permutations of an n-element set"]
    ],
    "explain": "These are the textbook's comments from the two 'Common efficiency classes' slides. Subsets are $2^n$ (each element in or out); permutations are $n!$ (n choices, then n-1, ...). Halving gives $\\log n$; scanning gives $n$; two and three embedded loops give $n^2$ and $n^3$."
  },
  {
    "q": "Which of these functions grows fastest as $n \\to \\infty$?",
    "options": ["$n \\log_2 n$", "$n^3$", "$2^n$", "$n!$"],
    "answer": 3,
    "explain": "From slowest to fastest: $n \\log_2 n$, $n^3$, $2^n$, $n!$. Table 2.1 shows it at $n = 100$: $n^3 = 10^6$, $2^n = 1.3 \\cdot 10^{30}$, $n! = 9.3 \\cdot 10^{157}$."
  },
  {
    "q": "Which of these functions grows slowest as $n \\to \\infty$?",
    "options": ["$n$", "$\\log_2 n$", "$n \\log_2 n$", "$n^2$"],
    "answer": 1,
    "explain": "$\\log_2 n$ is the slowest-growing non-constant class: at $n = 10^6$ it is only 20, while $n$ is a million. The order is $\\log_2 n$, then $n$, then $n \\log_2 n$, then $n^2$."
  },
  {
    "q": "From Table 2.1: what is $\\log_2 n$ (approximately) when $n = 10^6$?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.5,
    "explain": "$\\log_2(10^6) \\approx 20$ because $2^{20} = 1{,}048{,}576 \\approx 10^6$. Each factor of 10 in $n$ adds about 3.3 to $\\log_2 n$: 3.3, 6.6, 10, 13, 17, 20."
  },
  {
    "q": "Because $n^2 < n$ when $n < 1$, an $n^2$ algorithm has the better order of growth.",
    "type": "tf",
    "answer": false,
    "explain": "False. The picture on the slide shows $n^2$ below $n$ only for tiny $n$; it crosses at $n = 1$ and then pulls away for good. Order of growth is about what happens as $n \\to \\infty$, not about a few small inputs."
  },
  {
    "q": "An algorithm cuts the remaining problem size in half on every iteration and does constant work per iteration. Its efficiency class is:",
    "options": ["$n$ (linear)", "$\\log n$ (logarithmic)", "$n \\log n$", "$1$ (constant)"],
    "answer": 1,
    "explain": "'A result of cutting a problem's size by a constant factor on each iteration of the algorithm' is the textbook's description of the logarithmic class. Halving $n$ down to 1 takes about $\\log_2 n$ steps."
  },
  {
    "q": "According to Table 2.1, $2^{100}$ is approximately:",
    "options": ["$10^3$", "$1.3 \\cdot 10^{30}$", "$9.3 \\cdot 10^{157}$", "$10^{12}$"],
    "answer": 1,
    "explain": "$2^{100} \\approx 1.3 \\cdot 10^{30}$. The other numbers in the row are $n^3 = 10^6$ and $n! = 9.3 \\cdot 10^{157}$; $10^3$ is $2^{10}$."
  },
  {
    "q": "A logarithmic algorithm can take into account all of its input.",
    "type": "tf",
    "answer": false,
    "explain": "False. The textbook says a logarithmic algorithm 'cannot take into account all its input (or even a fixed fraction of it): any algorithm that does so will have at least linear running time.' Looking at every item is already $n$ steps."
  },
  {
    "q": "How do the running times $C(n) = \\frac{n(n-1)}{2}$ and $C(n) \\approx 0.5n^2$ compare?",
    "options": ["They have the same order of growth", "The first grows faster", "The second grows faster", "The first is logarithmic"],
    "answer": 0,
    "explain": "$\\frac{n(n-1)}{2} = \\frac{n^2}{2} - \\frac{n}{2}$. The leading term is $0.5n^2$; the $-\\frac{n}{2}$ becomes negligible as $n$ grows. Both are quadratic."
  },
  {
    "q": "Of the four candidate running times on the slide, which is the best algorithm for large $n$?",
    "options": ["$C(n) = \\frac{n(n-1)}{2}$", "$C(n) \\approx 0.5n^2$", "$C(n) = \\log n + 5$", "$C(n) = n!$"],
    "answer": 2,
    "explain": "$\\log n + 5$ is logarithmic; the $+5$ is a constant that does not grow. The two quadratic ones are the same class, and $n!$ is factorial, the worst class on the slide."
  }
]
```
