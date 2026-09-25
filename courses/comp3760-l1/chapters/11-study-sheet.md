---
title: Study sheet (Lecture 1)
minutes: 10
---

The main quizzes are **closed-everything**, so this page is what should be in your head, not something to bring. Read it, close it, write it out from memory, and reread whatever you could not reproduce.

## The definition (slide 7)

> An algorithm is a **sequence of unambiguous instructions** for obtaining a **required output** for **any legitimate input** in a **finite amount of time**.

Valid-algorithm check, one question per part:

| Part | Fails when... |
|---|---|
| unambiguous instructions | a step cannot be carried out the same way by everyone ("pick a good pivot") |
| required output | it can finish without producing the answer |
| any legitimate input | some allowed input is not handled (a case with no branch) |
| finite amount of time | any legitimate input makes it loop forever (equal x and y in ReturnTheBiggest) |

There is always more than one algorithm for a problem. We care whether it is **correct**, **time-efficient**, **space-efficient**. Pseudocode is the "Common Tongue" of computing; this is not a programming course.

Problem types: sorting, searching, string processing, graph, combinatorial, numerical, optimization. Design techniques: brute force, divide and conquer, decrease and conquer, transform and conquer, space/time tradeoffs, greedy, dynamic programming, iterative improvement, backtracking, branch and bound.

## Two facts and one definition (slides 24, 27)

1. Running time depends on the **input size**.
2. Total execution time depends primarily on the **number of instructions executed**; how long each specific instruction takes is secondary.

**Basic operation** = the statement that gets executed most frequently. Count only that. The result is a function of n: the running time C(n).

Tie-breakers, in order (slide 41; "guidelines, not strict rules"):

1. function calls (growing with N)
2. function calls (constant time)
3. key comparisons (comparing data)
4. assignments (copying data)
5. expression evaluations

Arithmetic: multiplication/division before addition/subtraction. Also: deepest inside the loop wins; a loop with a constant bound (1 to 10) does not grow with n, so its body is never the basic operation when something else grows.

## The recipe (slide 62, textbook p62)

1. Decide on a parameter for the input's size.
2. Identify the basic operation.
3. Check whether its count depends only on the size; if not, do best/worst/average separately.
4. Set up a sum for the count.
5. Simplify to a closed form.
6. Name the efficiency class.

Sum facts you need: $\sum_{i=l}^{u} 1 = u - l + 1$, $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$, so $\sum_{i=1}^{n-1} i = \frac{(n-1)n}{2}$, and $\sum_{i=0}^{n-1} n = n^2$.

## Counts to know cold

| Algorithm | Basic operation | Count | Class |
|---|---|---|---|
| find largest (find) | comparison A[i] > m | n − 1 (best = worst) | O(n) |
| Mystery1, one loop | body | n | O(n) |
| Mystery2, n × n array | addition | n² | O(n²) |
| insertion sort (Loops) | key comparison A[j] > v | worst (n − 1)n/2, best n − 1 | O(n²) |
| matrix multiplication | multiplication, 3 loops | n³ | O(n³) |
| halving loop (i ← i/2) | division | ⌊log₂ n⌋ + 1 ≈ log n | O(log n) |
| sequential search | key comparison | worst n, best 1 | O(n) |
| element uniqueness | comparison, inner loop | worst n(n − 1)/2 = n²/2 − n/2, best 1 | O(n²) |
| fib recursive vs fib2 | calls vs additions | grows like 1.6ⁿ vs n − 1 | fib2 wins (1627 ms vs 0 ms at N = 40) |

Worst case = most possible steps; best = "get lucky"; average = "on average". **Unless otherwise specified, always analyze the worst case.**

## Order of growth (slides 59 to 61)

What matters is growth as n → ∞. Table 2.1 at n = 10 and n = 100:

| n | log₂ n | n | n log₂ n | n² | n³ | 2ⁿ | n! |
|---|---|---|---|---|---|---|---|
| 10 | 3.3 | 10 | 33 | 10² | 10³ | 10³ | 3.6·10⁶ |
| 100 | 6.6 | 100 | 660 | 10⁴ | 10⁶ | 1.3·10³⁰ | 9.3·10¹⁵⁷ |

Classes, slowest to fastest growing, with the textbook's signature for each:

| Class | Name | Signature |
|---|---|---|
| 1 | constant | no dependence on n |
| log n | logarithmic | cut the problem size by a constant factor each iteration; cannot even look at all its input |
| n | linear | scan a list of size n (sequential search) |
| n log n | n-log-n | divide and conquer (mergesort, quicksort average) |
| n² | quadratic | two embedded loops (elementary sorts, n × n matrices) |
| n³ | cubic | three embedded loops (linear algebra) |
| 2ⁿ | exponential | all subsets of an n-element set |
| n! | factorial | all permutations of an n-element set |

## Big-O, Big-Ω, Big-Θ (slides 67 to 81)

- $f(n) \in O(g(n))$: there are a constant $c$ and a positive integer $n_0$ with $f(n) \le c \cdot g(n)$ for all $n \ge n_0$. Bounded **above**. "At MOST that long."
- $f(n) \in \Omega(g(n))$: $f(n) \ge c \cdot g(n)$ for all $n \ge n_0$. Bounded **below**. "At LEAST that long."
- $f(n) \in \Theta(g(n))$: $c_2 \cdot g(n) \le f(n) \le c_1 \cdot g(n)$ for all $n \ge n_0$. Bounded both ways. "THAT long."

Worked example: $2n + 6 \in O(n)$ with $c = 4$, $n_0 = 3$ (at n = 3: 12 ≤ 12, and from there down the c·g column stays ahead). Many other (c, n₀) pairs also work.

Simple rule: **drop lower-order terms and constant factors.**

| Function | Class |
|---|---|
| 50n³ + 20n + 4 | O(n³) |
| 4n² + 10, n(2n + 1) | O(n²) |
| 3 log n + 1 | O(log n) |
| 3 log n + n | O(n) |
| 1 + log 6, 5! + 3² | O(1) |
| 10n | O(n) |
| 5n² + 20 | O(n²) |
| 10000n + 2ⁿ | O(2ⁿ) |
| log(n)·(1 + n) | O(n log n) |

We usually use Big-O: it focuses on the worst case and it is what people mean when they talk about algorithms.

## Traps

- O is an upper bound, so **n ∈ O(n²) is true**; it just is not the tight class. n² ∈ O(n) is false.
- A constant-bound loop (1 to 10, 1 to 5) contributes a constant factor, never a power of n.
- "Two basic operations" is never the answer.
- "How many times" wants the count (n, n², n(n − 1)/2, log n), not the class; "efficiency class" wants O(…).
- A function call is always the most expensive kind of statement in the tie-break; an addition is the cheapest arithmetic.
- Integer halving (i ← i/2) is logarithmic; subtracting a constant is linear.

## Self-check

```quiz
[
  {
    "q": "Fill in the definition: an algorithm is a sequence of ________ instructions for obtaining a required output for any legitimate input in a finite amount of time.",
    "type": "text",
    "answer": ["unambiguous"],
    "explain": "Unambiguous. Every step must mean exactly one thing."
  },
  {
    "q": "The basic operation of an algorithm is the statement that...",
    "options": ["gets executed most frequently", "takes the most time per execution", "appears first inside the outermost loop", "returns the result"],
    "answer": 0,
    "explain": "The statement that gets executed most frequently. Per-execution cost only enters through the tie-breakers when two lines tie on frequency."
  },
  {
    "q": "Put the first three tie-breakers in order: which comes first?",
    "options": ["function calls", "key comparisons", "assignments", "expression evaluations"],
    "answer": 0,
    "explain": "1 function calls (growing with N), 2 function calls (constant time), 3 key comparisons, 4 assignments, 5 expression evaluations."
  },
  {
    "q": "What is $\\sum_{i=1}^{n-1} i$?",
    "options": ["$n^2$", "$\\frac{(n-1)n}{2}$", "$\\frac{n(n+1)}{2}$", "$n - 1$"],
    "answer": 1,
    "explain": "The sum 1 + 2 + … + (n − 1) is (n − 1)n / 2, the worst-case comparison count of insertion sort. n(n + 1)/2 is the sum up to n."
  },
  {
    "q": "Which class does an algorithm that halves its input each iteration belong to?",
    "options": ["constant", "logarithmic", "linear", "n-log-n"],
    "answer": 1,
    "explain": "Cutting a problem's size by a constant factor on each iteration is the textbook's description of a logarithmic algorithm."
  },
  {
    "q": "Big-Θ means f(n) is bounded...",
    "options": ["above only", "below only", "both above and below by constant multiples of g(n)", "by g(n) exactly, with c = 1"],
    "answer": 2,
    "explain": "c₂ g(n) ≤ f(n) ≤ c₁ g(n) for all n ≥ n₀: bounded above and below, so f and g have the same rate of growth."
  }
]
```
