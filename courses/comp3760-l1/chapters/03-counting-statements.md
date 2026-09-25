---
title: Counting statements: f(n) for find
minutes: 12
---

`fib` showed two correct algorithms differing by a factor of thousands. The lecture's method predicts that **before writing code**: count how many statements execute for an input of size $n$.

## How to determine efficiency

The obvious idea: **do it experimentally**, i.e. write a bunch of implementations and see which one is fastest. The slide lists the problems:

- **Time consuming and expensive** (you have to build every candidate first)
- **It is not accurate** (the numbers depend on the machine, the language, the compiler, what else is running)

> Another idea: **estimate efficiency before writing code.**

## What we know

Two facts the method rests on:

1. **Running time (efficiency) of an algorithm depends on the input size.**
2. **The total execution time for any algorithm depends primarily on the number of instructions executed.** Different execution times of specific instructions are of **secondary importance**.

So instead of measuring seconds, count instructions as a function of the input size $n$.

## Counting every statement in find

```pseudo
1. Algo: find( A[0…n-1] )
2.    m ← A[0]
3.    for i ← 1 to n-1 do
4.       if A[i] > m
5.          m ← A[i]
6.    return m
```

**How many instructions are executed if n = 3?** The slide counts each statement:

| stmt | #times (n = 3) |
|---|---|
| 1 | 0? 1? |
| 2 | 1 |
| 3 | 2 |
| 4 | 2 |
| 5 | 2 |
| 6 | 1 |

Line 1 is the header, counted 0 times (the slide shrugs at "0? 1?" and settles on 0). Lines 2 and 6 run once each. Lines 3, 4 and 5 run once per iteration, and the loop runs $i = 1$ to $n - 1$, which is $n - 1 = 2$ times.

$$f(3) = 1 + 3 \times (3 - 1) + 1 = 8$$

```widget
op-counter
{ "preset": "find (largest element)", "n": 3, "presets": false, "title": "find: how many times each line runs" }
```

The slide's second table, for $n = 8$:

| stmt | #times (n = 8) |
|---|---|
| 1 | 0 |
| 2 | 1 |
| 3 | 7 |
| 4 | 7 |
| 5 | 7 |
| 6 | 1 |

$$f(8) = 1 + 3 \times (8 - 1) + 1 = 23$$

For an input of size $n$, the running time is

$$f(n) = 1 + 3(n - 1) + 1 = 3n - 1$$

:::warn Line 5 runs only when the if is true
`m ← A[i]` executes only on iterations where `A[i] > m`. The slide counts it $n - 1$ times, which is what happens for an ascending array, and the widget counts it the same way. On a descending array line 5 runs 0 times and the total is $2n$ instead of $3n - 1$. This is why the lecture moves away from counting every statement.
:::

## Basic operations

> **Which instruction in find gets executed the most?**

| stmt | n = 3 | n = 10 | n = 100 |
|---|---|---|---|
| 1 | 0 | 0 | 0 |
| 2 | 1 | 1 | 1 |
| 3 | 2 | 9 | 99 |
| 4 | 2 | 9 | 99 |
| 5 | 2 | 9 | 99 |
| 6 | 1 | 1 | 1 |

Lines 3, 4 and 5 tie at $n - 1$; everything else is a constant that stops mattering as $n$ grows. The lecture's definition:

> **We define the basic operation of an algorithm as the statement that gets executed most frequently.**

with tiebreakers:

- **deepest inside the loop**;
- **which one is more "expensive"**;
- **or maybe sometimes we don't care**.

For `find` the accepted choice is line 4, the comparison `A[i] > m`: it is inside the loop, it is the actual work of the algorithm (a comparison of data), and it runs every iteration regardless of the input, unlike line 5. So **the running time of find is**

$$f(n) = n - 1$$

> **We don't count instructions that are not basic operations.**

:::tip The fundamental concept
**Count the number of basic operations executed for an input of size n.** That count, as a function of $n$, is the running time.
:::

$3n - 1$ (every statement) and $n - 1$ (basic operation only) both grow linearly in $n$; the second is simpler to compute and does not depend on which statements happened to be inside the `if`. [Choosing the basic operation](#/comp3760-l1/basic-operation) makes that choice in harder pseudocode; [Setting up and simplifying the sums](#/comp3760-l1/counting-with-sums) counts it when loops nest.

```quiz
[
  {
    "q": "Counting every statement of `find` as the slide does, how many instructions are executed for n = 8?",
    "code": "1. Algo: find( A[0…n-1] )\n2.    m ← A[0]\n3.    for i ← 1 to n-1 do\n4.       if A[i] > m\n5.          m ← A[i]\n6.    return m",
    "type": "numeric",
    "answer": 23,
    "tolerance": 0,
    "explain": "f(8) = 1 + 3 × (8 − 1) + 1 = 1 + 21 + 1 = 23: line 2 once, lines 3, 4, 5 seven times each, line 6 once, line 1 not counted."
  },
  {
    "q": "Using f(n) = 3n − 1, how many statements execute in `find` for n = 10?",
    "type": "numeric",
    "answer": 29,
    "tolerance": 0,
    "explain": "3 × 10 − 1 = 29. Check it against the table: 1 + 9 + 9 + 9 + 1 = 29."
  },
  {
    "q": "Counting only the basic operation, how many times does `find` execute it for n = 100?",
    "type": "numeric",
    "answer": 99,
    "tolerance": 0,
    "explain": "The basic operation (the comparison on line 4) runs once per iteration, and the loop runs i = 1 to n − 1: 99 times. f(n) = n − 1."
  },
  {
    "q": "Which line is the basic operation of `find`?",
    "code": "1. Algo: find( A[0…n-1] )\n2.    m ← A[0]\n3.    for i ← 1 to n-1 do\n4.       if A[i] > m\n5.          m ← A[i]\n6.    return m",
    "options": ["Line 2: the assignment m ← A[0]", "Line 4: the comparison A[i] > m", "Line 5: the assignment m ← A[i]", "Line 6: return m"],
    "answer": 1,
    "explain": "The basic operation is the statement executed most frequently; lines 3, 4, 5 tie at n − 1, and the tie goes to the comparison A[i] > m: it is the real work of the algorithm and it runs every iteration, while line 5 only runs when the if is true. Lines 2 and 6 run once."
  },
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation.",
    "code": "Algo: find( A[0…n-1] )\n   m ← A[0]\n   for i ← 1 to n-1 do\n      if A[i] > m\n         m ← A[i]\n   return m",
    "answer": 4,
    "explain": "Line 4, `if A[i] > m`. It executes n − 1 times, as often as anything in the algorithm, and it is the comparison that does the finding."
  },
  {
    "q": "The total execution time of an algorithm depends primarily on the number of instructions executed; the different execution times of specific instructions are of secondary importance.",
    "type": "tf",
    "answer": true,
    "explain": "That is fact 2 on the \"What we know\" slide, word for word. It is what justifies counting instructions instead of measuring seconds."
  },
  {
    "q": "The lecture's preferred way to determine an algorithm's efficiency is to write several implementations and time them.",
    "type": "tf",
    "answer": false,
    "explain": "False. The experimental approach is time consuming, expensive and not accurate. The lecture's idea is to estimate efficiency before writing code, by counting basic operations as a function of the input size."
  },
  {
    "q": "Counting only its basic operation, the running time of `find` is…",
    "options": ["n − 1", "3n − 1", "n", "n²"],
    "answer": 0,
    "explain": "f(n) = n − 1: the comparison runs once per iteration and the loop runs n − 1 times. 3n − 1 is the count of every statement, which the lecture stops using once the basic operation is defined."
  },
  {
    "q": "Where does the formula f(n) = 3n − 1 for `find` come from?",
    "options": ["1 + 3(n − 1) + 1: one statement before the loop, three per iteration, one after", "3 statements per element for all n elements, minus the header", "n statements for each of the 3 loop lines, minus 1 for the return", "It is the number of comparisons plus the number of assignments"],
    "answer": 0,
    "explain": "Line 2 runs once, lines 3, 4, 5 run n − 1 times each (3(n − 1)), line 6 runs once: 1 + 3(n − 1) + 1 = 3n − 1."
  },
  {
    "q": "According to the lecture, which of these is a tiebreaker when several statements execute equally often?",
    "options": ["The statement that appears first in the pseudocode", "The statement deepest inside the loop", "The statement with the shortest name", "The statement that uses the most variables"],
    "answer": 1,
    "explain": "The slide's tiebreakers: deepest inside the loop; which one is more expensive; or maybe sometimes we don't care. Position in the listing and variable counts are not criteria."
  }
]
```
