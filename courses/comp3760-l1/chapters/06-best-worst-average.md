---
title: Best, worst and average case
minutes: 9
---

For `find`, `Mystery1` and `Mystery2` the count came out as a function of $n$ and nothing else. For a search it does not: the same $n$ can cost 1 comparison or $n$ comparisons depending on where the key is. Step 3 of the textbook's strategy exists for this case, and the lecture's rule is short: analyze the worst case.

## Example 4: searching for a key

Slide 52's problem is **searching for key in a list of n items**.

```pseudo
1. SequentialSearch(A[0..n-1], K)
2.   i ← 0
3.   while i < n and A[i] ≠ K do
4.     i ← i + 1
5.   if i < n return i
6.   else return -1
```

- **Input size measure:** number of list items, i.e. $n$.
- **Basic operation:** **key comparison / while loop**, the `A[i] ≠ K` on line 3.
- **How many times?** The slide's answer is a warning, not a number: **depends on order of input**.

If $K$ is the first element, the comparison runs once and the loop stops. If $K$ is last, or not in the list at all, the loop walks the whole array. Slide 52:

$$C_{worst}(n) = n \qquad C_{best}(n) = 1$$

```widget
op-counter
{ "preset": "SequentialSearch", "mode": "worst", "presets": false, "title": "SequentialSearch: flip the mode and watch line 3" }
```

### One comparison at a time

Each step is one execution of the key comparison on line 3. The count stops at 1 when the key is first and at $n$ when it is last or absent.

```widget
find-play
{ "array": [5, 2, 4, 6, 1, 3], "case": "last", "title": "SequentialSearch: the same n, a different count" }
```

## The three cases, defined

Slide 53, with the exact wording:

- **Worst case:** **most possible number of steps needed by an algorithm.**
- **Average case:** **number of steps needed "on average".**
- **Best case:** **number of steps needed if you "get lucky" with a particular input.**

The slide's example for all three is **the problem of finding an element in an unsorted list**: lucky means the key is first, unlucky means it is last or absent, and "on average" means somewhere in the middle (a probability calculation the lecture does not do).

## Which to use

Slide 54:

> **We will usually focus on worst-case analysis. Unless otherwise specified, you should always analyze the worst case.**

And:

> **There are many situations where best case = worst case. Example: find the largest element in an unsorted list.**

To find the largest element you must look at every element; there is no lucky input that lets `find` stop early. Its comparison runs $n - 1$ times whatever the order, so best = worst = $n - 1$ and there is nothing to investigate separately.

## Where this sits in the strategy

Step 3 of the textbook's strategy ([slide 62](#/comp3760-l1/counting-with-sums)) is this check: could the count differ for two inputs of the same size? If yes, count the worst case (and the best, if asked); if no, there is one count and one function.

| algorithm | basic operation | depends on input form? | $C_{best}(n)$ | $C_{worst}(n)$ |
|---|---|---|---|---|
| find (largest element) | comparison `A[i] > m` | no | $n - 1$ | $n - 1$ |
| Mystery1, Mystery2, MatrixMultiply | the innermost statement | no | $n$, $n^2$, $n^3$ | same |
| SequentialSearch | key comparison `A[i] ≠ K` | yes | $1$ | $n$ |
| Loops (insertion sort) | key comparison `A[j] > v` | yes | $n - 1$ | $\frac{n(n-1)}{2}$ |
| UniqueElements | comparison `A[i] = A[j]` | yes | $1$ | $\frac{n(n-1)}{2}$ |

## Two more algorithms whose count depends on the input

**Loops (insertion sort).** In [Setting up the sums](#/comp3760-l1/counting-with-sums) the inner loop was counted as running $i$ times on pass $i$, which assumes `A[j] > v` is true all the way down to $j = 0$: descending input, the worst case, $\frac{n(n-1)}{2}$ comparisons. If the input is already sorted, `A[j] > v` is false on the first try every pass: one comparison per pass, $n - 1$ in total. The slide-36 example (`5 2 4 6 1 3`, twelve comparisons for $n = 6$) sits between the best case of 5 and the worst case of 15.

**UniqueElements.** The worst case, all elements distinct, runs both loops to the end: $\frac{n^2}{2} - \frac{n}{2}$ comparisons. The best case is a duplicate in the first two positions: the first comparison `A[0] = A[1]` is true, `return false` fires, and the count is 1.

```widget
op-counter
{ "preset": "UniqueElements", "mode": "best", "presets": false, "title": "UniqueElements in the best case: one comparison, then return" }
```

### The early exit, one comparison at a time

A duplicate stops the walk through the triangle of pairs at its own dot; the presets put it first, in the middle and in the last pair.

```widget
pairs-play
{ "array": [4, 4, 2, 7, 5], "title": "UniqueElements with A[0] = A[1]: the best case" }
```

The mode does not change the basic operation: best and worst are different counts of the same statement, not different statements.

:::warn Order matters for searches and sorts, not for sums
A loop that touches every element unconditionally (a sum, a product, a matrix multiplication, finding the max) has one count. A loop with an early exit (`return` inside the loop, or a `while` whose condition reads the data) can stop early on a lucky input, and that is the signal that best and worst case differ.
:::

## Find the best and worst case of a bubble sort that stops early

`EarlyBubble` sweeps the array swapping neighbours that are out of order, and returns as soon as a whole sweep makes no swap.

```quiz
[
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation of `EarlyBubble`.",
    "code": "Algorithm EarlyBubble(A[0..n-1])\n    for i ← 0 to n-2 do\n        swapped ← false\n        for j ← 0 to n-2-i do\n            if A[j] > A[j+1] then\n                swap A[j] and A[j+1]\n                swapped ← true\n            endif\n        endfor\n        if not swapped then return\n    endfor",
    "answer": 5,
    "explain": "Line 5 runs once per pass of the inner loop for every input; lines 6 and 7 only when the pair is out of order. Lines 4 and 5 tie on count and depth, and line 5 is a **key comparison** of array data while line 4 only steps j. Basic operation: line 5, `A[j] > A[j+1]`. Its count depends on the order of the input, so best and worst must be investigated separately."
  },
  {
    "q": "Best case: `EarlyBubble` gets 10 elements already in ascending order. How many key comparisons are made?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "Pass i = 0 compares j = 0 to n − 2 = 8: 9 comparisons, all false, so no swap. `swapped` is still false and the algorithm returns after one pass. C_best(n) = n − 1 = 9."
  },
  {
    "q": "Worst case: `EarlyBubble` gets 10 elements in descending order. How many key comparisons are made?",
    "type": "numeric",
    "answer": 45,
    "tolerance": 0,
    "explain": "Descending order makes every pass swap, so the early return never fires and all n − 1 = 9 passes run. Pass i compares j = 0 to n − 2 − i: n − 1 − i comparisons. 9 + 8 + 7 + … + 1 = 45 = $\\frac{n(n-1)}{2} = \\frac{10 \\cdot 9}{2}$."
  },
  {
    "q": "`EarlyBubble` runs on A = [3, 1, 2, 4, 5]. How many key comparisons are made?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "Pass 0 compares j = 0 to 3 (4 comparisons): 3 > 1 swap → [1, 3, 2, 4, 5]; 3 > 2 swap → [1, 2, 3, 4, 5]; 3 > 4 no; 4 > 5 no. A swap happened, so pass 1 runs: j = 0 to 2 (3 comparisons), all false, no swap, return. 4 + 3 = 7, between the best case 4 and the worst case 10 for n = 5."
  },
  {
    "type": "reorder",
    "lang": "pseudo",
    "q": "Put the worst-case count of `EarlyBubble` in order.",
    "lines": [
      "worst case: descending input, every pass swaps, no early return",
      "C_worst(n) = Σ(i=0..n-2) Σ(j=0..n-2-i) 1",
      "= Σ(i=0..n-2) (n - 1 - i)",
      "= (n-1) + (n-2) + ... + 1",
      "= (n-1)n/2"
    ],
    "explain": "Name the input that makes the count largest first, then set up the sum from the loop bounds. The inner sum of ones has (n − 2 − i) − 0 + 1 = n − 1 − i terms; for i = 0, 1, …, n − 2 that is n − 1 down to 1, the first n − 1 integers, (n − 1)n/2. At n = 10: 45."
  },
  {
    "type": "text",
    "q": "What is the worst-case efficiency class of `EarlyBubble`? (name it or write it as a function of n)",
    "answer": ["quadratic", "n^2", "n²", "o(n^2)", "o(n²)", "θ(n^2)", "θ(n²)", "n*n"],
    "explain": "C_worst(n) = (n − 1)n/2 = n²/2 − n/2. Drop the lower-order term and the constant factor: quadratic, O(n²). The best case n − 1 is linear, but unless told otherwise the worst case is the one to report."
  }
]
```

```quiz
[
  {
    "q": "Unless otherwise specified, you should always analyze the worst case.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 54, word for word. The lecture will usually focus on worst-case analysis; it is the most possible number of steps needed by an algorithm."
  },
  {
    "q": "Finding the largest element in an unsorted list has a best case that is faster than its worst case.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's own example of best case = worst case. You cannot know the largest without looking at every element, so the comparison runs $n - 1$ times for every input of size $n$."
  },
  {
    "q": "Sequential search for a key K in an unsorted list of n items. What are the best-case and worst-case counts of the key comparison?",
    "options": ["$C_{best}(n) = 1$, $C_{worst}(n) = n$", "$C_{best}(n) = 1$, $C_{worst}(n) = n^2$", "$C_{best}(n) = n$, $C_{worst}(n) = n$", "$C_{best}(n) = \\log n$, $C_{worst}(n) = n$"],
    "answer": 0,
    "explain": "Slide 52: $C_{worst}(n) = n$ (the key is last or absent, every element is compared) and $C_{best}(n) = 1$ (the key is first). $\\log n$ would need a sorted list and a halving search, which this algorithm is not."
  },
  {
    "q": "What does the lecture mean by the best case of an algorithm?",
    "options": ["The number of steps needed if you \"get lucky\" with a particular input", "The number of steps needed for the smallest input size", "The number of steps needed \"on average\"", "The number of steps when the basic operation is the cheapest one"],
    "answer": 0,
    "explain": "Slide 53: best case is the number of steps needed if you \"get lucky\" with a particular input. It is about the *form* of an input of size $n$, not about a small $n$. \"On average\" is the average case."
  },
  {
    "q": "Does the basic operation count of HasZero depend on the form of the input, not just its size?",
    "code": "Algorithm HasZero(A[0..n-1])\n    for i ← 0 to n-1 do\n        if A[i] = 0 then\n            return true\n        endif\n    endfor\n    return false",
    "options": ["Yes, it depends on the input: best case 1 comparison, worst case n comparisons", "No, the comparison always runs n times", "No, the comparison always runs n − 1 times", "Yes: best case 0 comparisons, worst case n comparisons"],
    "answer": 0,
    "explain": "The `return true` inside the loop is an early exit. If $A[0] = 0$ the comparison runs once (best case, 1). If there is no zero, every element is compared: $n$ (worst case). The comparison always runs at least once for $n \\ge 1$, so a best case of 0 is wrong."
  },
  {
    "q": "Loops (insertion sort) is run on 8 elements that are already in ascending order. How many key comparisons `A[j] > v` are made?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "Already sorted is the best case: on each of the $n - 1 = 7$ passes the first comparison `A[j] > v` is false and the inner loop stops at once. One comparison per pass, 7 in total. In descending order it would be $\\frac{8 \\cdot 7}{2} = 28$."
  },
  {
    "q": "Which step of the textbook's general strategy tells you to investigate the best, worst and average cases separately when the count depends on more than the input size?",
    "options": ["Step 1: decide on a parameter indicating the input's size", "Step 2: identify the algorithm's basic operation", "Step 3: be sure the number of times the basic operation is executed depends only on the size of the input", "Step 5: use summation algebra to find a closed-form expression"],
    "answer": 2,
    "explain": "Step 3 is the check; its second sentence is the instruction: if the count depends on some other property, the best/worst/average case efficiencies must be investigated separately."
  },
  {
    "q": "The best case and the worst case of an algorithm can have different basic operations.",
    "type": "tf",
    "answer": false,
    "explain": "The basic operation is chosen from the algorithm's structure (most frequent statement, tie-breakers). Best and worst are different *counts* of that same statement for different inputs of the same size, as in UniqueElements: 1 comparison in the best case, $\\frac{n(n-1)}{2}$ in the worst, the same comparison both times."
  }
]
```
