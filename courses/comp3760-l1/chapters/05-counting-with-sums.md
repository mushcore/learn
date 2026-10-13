---
title: Setting up and simplifying the sums
minutes: 15
---

Once the basic operation is chosen, "how many times is it executed?" is a counting problem: write the loops as summations, then simplify to a function of $n$.

## An algorithm for analyzing algorithms

Slide 43 states the recipe as an algorithm whose input is an algorithm:

1. **Decide on the basic operation** (may require tie-breakers).
2. **Count how many times the basic operation is executed**: set up summations, simplify to an expression (function) that depends on $N$.
3. **This is the running time.**
4. **Determine big-O class of the running time function.**

The textbook's version is numbered (slide 62, which cites p. 62 of the textbook):

1. **Decide on a parameter indicating the input's size.**
2. **Identify the algorithm's basic operation.**
3. **Be sure the number of times the basic operation is executed depends only on the size of the input.** If it depends on some other property, the best/worst/average case efficiencies must be investigated separately.
4. **Set up a sum expressing the number of times the basic operation is executed.**
5. **Use summation algebra to find a closed-form expression for the sum** from step 4.
6. **Determine the efficiency class of the algorithm using asymptotic notations.**

Steps 4 and 5 are this lesson; step 3 is [Best, worst and average case](#/comp3760-l1/best-worst-average), step 6 [Big-O, Big-Ω, Big-Θ](#/comp3760-l1/big-o-omega-theta).

## The two summation facts you need

From the Math Review (and textbook Appendix A): **a sum of ones counts the terms**, $u - l + 1$ of them:

$$\sum_{i=l}^{u} 1 = u - l + 1$$

So $\sum_{i=1}^{n} 1 = n$, $\sum_{i=0}^{n-1} 1 = n$, and $\sum_{j=i+1}^{n-1} 1 = n - 1 - i$. **The sum of the first $n$ integers:**

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

With $n - 1$ in place of $n$: $\sum_{i=1}^{n-1} i = \frac{(n-1)n}{2}$; for $n = 5$, $1 + 2 + 3 + 4 = 10$. A constant added $n$ times is $c \cdot n$, and a sum splits term by term: $\sum (a_i - b_i) = \sum a_i - \sum b_i$.

## Example 1: Mystery1, a single loop

```pseudo
1. Mystery1(n)  // n > 0
2.  S ← 0
3.  for i ← 1 to n do
4.      S ← S + i * i
5.  return S
```

It calculates $1^2 + 2^2 + \ldots + n^2$; the basic operation is line 4. Slide 30: once each time through the loop, so $1 + 1 + \ldots + 1$ ($n$ times) $= \sum_{i=1}^{n} 1 = n$.

```widget
op-counter
{ "preset": "Mystery1 (sum of squares)", "presets": false, "title": "Mystery1: line 4 runs n times" }
```

## Example 2: Mystery2, two nested loops

```pseudo
1. Mystery2(A[0..n-1][0..n-1])  // n > 0
2.  S ← 0
3.  for i ← 0 to n-1 do
4.     for j ← 0 to n-1 do
5.        S ← S + A[i][j];
6.  return S
```

It sums the elements of $A$; the basic operation is the addition on line 5. Slides 32 to 34: the outer loop gives $\sum_{i=0}^{n-1}(\text{whatever the inner loop does})$, and the inner loop $\sum_{j=0}^{n-1} 1$ for each outer iteration:

$$\sum_{i=0}^{n-1} \sum_{j=0}^{n-1} 1 = \sum_{i=0}^{n-1} n = n + n + \ldots + n = n^2$$

```widget
loop-grid
{ "preset": "square", "n": 6, "title": "Mystery2: one dot for every (i, j) the inner statement runs for" }
```

```widget
op-counter
{ "preset": "Mystery2 (sum of an n×n array)", "presets": false, "title": "Mystery2: line 5 runs n² times" }
```

## Example 3: Loops, a triangle of iterations

```pseudo
1. Loops(A[0..n-1])
2.  for i ← 1 to n-1 do
3.    v ← A[i]
4.    j ← i-1
5.    while j≥0 and A[j]>v do
6.       A[j+1] ← A[j]
7.       j ← j-1
8.    A[j+1] ← v
```

The basic operation is the key comparison `A[j]>v` on line 5 ([why](#/comp3760-l1/basic-operation)). Slides 38 to 40: **look at the outer loop first**, $i$ from 1 up to $n-1$; the inner loop, $j$ from $i-1$ down to 0, does one basic operation per iteration:

$$\sum_{i=1}^{n-1} \sum_{j=0}^{i-1} 1 = \sum_{i=1}^{n-1} i = \frac{(n-1)n}{2}$$

```widget
loop-grid
{ "preset": "lower", "n": 6, "title": "Loops: the inner loop runs i times on pass i" }
```

The dots form half a square, so the count is about $\frac{n^2}{2}$. "$j$ goes from $i-1$ down to 0" assumes every comparison is true: the worst case, which the lecture counts unless told otherwise.

## Three nested loops: matrix multiplication

```pseudo
1. MatrixMultiply(A[0..n-1, 0..n-1], B[0..n-1, 0..n-1])
2.   for i ← 0 to n-1 do
3.     for j ← 0 to n-1 do
4.       C[i, j] ← 0
5.       for k ← 0 to n-1 do
6.         C[i, j] ← C[i, j] + A[i, k] * B[k, j]
7.   return C
```

Slide 50: input size is the matrix dimension; the basic operation is the innermost expression and assignment, which slide 83 narrows to **multiplication of two numbers**:

$$C(n) = \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} \sum_{k=0}^{n-1} 1 = \sum_{i=0}^{n-1} \sum_{j=0}^{n-1} n = \sum_{i=0}^{n-1} n^2 = n^3$$

```widget
op-counter
{ "preset": "MatrixMultiply", "presets": false, "title": "MatrixMultiply: line 6 runs n³ times, line 4 only n²" }
```

## A loop that halves: Example3

```pseudo
1. Example3(n)
2.   sum ← 0
3.   i ← n
4.   while i ≥ 1
5.      sum ← sum + 1
6.      i ← i/2
7.   return sum
```

Slide 51: **calculating an unusual sum**; input size the number $n$; basic operation the **division & assignment on line 6** (**but note that div-by-2 is actually a super-fast op**). With no `for` bound to sum over, count the values of $i$: $n, n/2, n/4, \ldots, 1$ (integer division), $⌊\log_2 n⌋ + 1$ of them, written $C(n) = \log n$. For $n = 8$: $i = 8, 4, 2, 1$. A control variable divided by a constant each pass gives a logarithmic count.

```widget
op-counter
{ "preset": "Example3 (halving loop)", "presets": false, "title": "Example3: line 6 runs ⌊log₂ n⌋ + 1 times" }
```

### Example3, one pass at a time

Each pass cuts the bar to $⌊i/2⌋$; doubling $n$ adds exactly one link to the chain of $i$ values.

```widget
halving-play
{ "mode": "example3", "n": 8, "title": "Example3 at n = 8: one step per pass of the while loop" }
```

## The element uniqueness problem, all the algebra

Slide 84's algorithm (from the textbook) checks whether all elements of an array are distinct.

```pseudo
ALGORITHM UniqueElements(A[0..n-1])
    //Determines whether all the elements in a given array are distinct
    //Input: An array A[0..n-1]
    //Output: Returns "true" if all the elements in A are distinct
    //        and "false" otherwise
    for i ← 0 to n-2 do
        for j ← i+1 to n-1 do
            if A[i] = A[j] return false
    return true
```

Slide 85: input size $n$, the size of the array; basic operation the **comparison in the innermost loop**; worst case (no two elements equal, so the loops run to the end):

$$C(n) = \sum_{i=0}^{n-2} \sum_{j=i+1}^{n-1} 1 = \sum_{i=0}^{n-2} (n - 1 - i - 1 + 1) = \sum_{i=0}^{n-2} (n - 1 - i)$$

Split into three sums, each over $n-1$ terms ($i$ from 0 to $n-2$):

$$= \sum_{i=0}^{n-2} n - \sum_{i=0}^{n-2} 1 - \sum_{i=0}^{n-2} i = n(n-1) - (n-1) - \frac{(n-2)(n-1)}{2}$$

$$= n^2 - n - n + 1 - \frac{n^2}{2} + \frac{3n}{2} - 1 = \frac{n^2}{2} - \frac{n}{2} \in O(n^2)$$

For $n = 4$: six pairs, and $\frac{16}{2} - \frac{4}{2} = 6$. Also $\frac{n^2}{2} - \frac{n}{2} = \frac{n(n-1)}{2}$, the number of pairs from $n$ items.

```widget
loop-grid
{ "preset": "upper", "n": 6, "title": "UniqueElements: j starts one past i" }
```

```widget
op-counter
{ "preset": "UniqueElements", "mode": "worst", "n": 10, "predict": true, "presets": false, "title": "UniqueElements in the worst case: predict each line's count" }
```

### UniqueElements, one comparison at a time

The lit dot is the pair being compared and walks the triangle row by row. A duplicate stops the walk at its own dot, the early exit behind the best case of 1.

```widget
pairs-play
{ "array": [4, 9, 2, 7, 5], "title": "UniqueElements: one step per comparison A[i] = A[j]" }
```

```quiz
[
  {
    "q": "Mystery2 is run on a 12 × 12 array. How many times is the basic operation (the addition on line 5) executed?",
    "type": "numeric",
    "answer": 144,
    "tolerance": 0,
    "explain": "$\\sum_{i=0}^{11} \\sum_{j=0}^{11} 1 = \\sum_{i=0}^{11} 12 = 12 \\cdot 12 = 144$. Two full nested loops to $n$ give $n^2$."
  },
  {
    "q": "Loops (insertion sort) is run on 10 elements in descending order (the worst case). How many key comparisons `A[j] > v` are made?",
    "type": "numeric",
    "answer": 45,
    "tolerance": 0,
    "explain": "$\\sum_{i=1}^{n-1} \\sum_{j=0}^{i-1} 1 = \\sum_{i=1}^{9} i = \\frac{9 \\cdot 10}{2} = 45$. The inner loop runs $i$ times on pass $i$, a triangle of iterations."
  },
  {
    "q": "How many times is the basic operation executed for input size n?",
    "code": "Algorithm Pairs(A[0..n-1])\n    c ← 0\n    for i ← 0 to n-1 do\n        for j ← 0 to n-1 do\n            if A[i] + A[j] = 0 then\n                c ← c + 1\n            endif\n        endfor\n    endfor\n    return c",
    "options": ["n", "n/2", "2n", "n^2"],
    "answer": 3,
    "explain": "The basic operation is the comparison `A[i] + A[j] = 0`, which runs once per $(i, j)$ pair. Both loops run the full $0$ to $n-1$, so $\\sum_{i=0}^{n-1} \\sum_{j=0}^{n-1} 1 = n^2$. The `if` body does not matter: the comparison itself is what runs every time."
  },
  {
    "q": "The two loop bodies (`s ← s + A[i]` and `s ← s - A[i]`) tie as the most frequent statements. How many times do they execute in total, for input size n?",
    "code": "Algorithm Twice(A[0..n-1])\n    s ← 0\n    for i ← 0 to n-1 do\n        s ← s + A[i]\n    endfor\n    for i ← 0 to n-1 do\n        s ← s - A[i]\n    endfor\n    return s",
    "options": ["n", "n/2", "2n", "n^2"],
    "answer": 2,
    "explain": "Two loops run one after the other, not nested, so their counts add rather than multiply: $\\sum_{i=0}^{n-1} 1 + \\sum_{i=0}^{n-1} 1 = n + n = 2n$ additions and subtractions. Each line on its own runs $n$ times, so the count of one named line is $n$; either way the class is $O(n)$, never $n^2$, because the loops are sequential, not nested."
  },
  {
    "q": "Which summation counts the basic operation in this fragment?",
    "code": "for i ← 1 to n do\n    for j ← 1 to i do\n        x ← x + 1\n    endfor\nendfor",
    "options": ["$\\sum_{i=1}^{n} \\sum_{j=1}^{n} 1$", "$\\sum_{i=1}^{n} \\sum_{j=1}^{i} 1$", "$\\sum_{j=1}^{i} 1$", "$\\sum_{i=1}^{n} i^2$"],
    "answer": 1,
    "explain": "The outer loop gives $\\sum_{i=1}^{n}$; the inner loop runs from 1 to $i$, giving $\\sum_{j=1}^{i} 1$ inside it. Simplified: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$. A double sum with both bounds $n$ would be a full square ($n^2$); the inner bound of $i$ is exactly what makes it a triangle instead."
  },
  {
    "q": "Example3 (the halving loop) is run with n = 1000. How many times is line 6, `i ← i/2`, executed?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "explain": "$i$ takes the values 1000, 500, 250, 125, 62, 31, 15, 7, 3, 1: ten passes, and $⌊\\log_2 1000⌋ + 1 = 9 + 1 = 10$. The slide writes $C(n) = \\log n$."
  },
  {
    "q": "UniqueElements is run on an array of 8 distinct values. How many comparisons `A[i] = A[j]` are made?",
    "type": "numeric",
    "answer": 28,
    "tolerance": 0,
    "explain": "All distinct means the worst case: every pair is compared once. $\\frac{n^2}{2} - \\frac{n}{2} = 32 - 4 = 28$, which is also $\\frac{8 \\cdot 7}{2}$, the number of pairs."
  },
  {
    "q": "$\\sum_{i=1}^{n-1} i$ equals...",
    "options": ["$\\frac{n(n+1)}{2}$", "$\\frac{(n-1)n}{2}$", "$n - 1$", "$n^2$"],
    "answer": 1,
    "explain": "$\\sum_{i=1}^{m} i = \\frac{m(m+1)}{2}$; with $m = n - 1$ that is $\\frac{(n-1)n}{2}$. This is the count for Loops. $\\frac{n(n+1)}{2}$ is $\\sum_{i=1}^{n} i$, the count for CountSomethingElse, whose inner loop runs to $i$ with $i$ going all the way to $n$."
  },
  {
    "q": "In the textbook's general strategy for analyzing non-recursive algorithms, which step is \"Set up a sum expressing the number of times the basic operation is executed\"?",
    "options": ["Step 2", "Step 3", "Step 4", "Step 6"],
    "shuffle": false,
    "answer": 2,
    "explain": "1 decide on a parameter for the input's size; 2 identify the basic operation; 3 be sure the count depends only on the size of the input; 4 set up a sum; 5 use summation algebra to find a closed form; 6 determine the efficiency class using asymptotic notations."
  },
  {
    "q": "Put the textbook's six steps for analyzing a non-recursive algorithm in order.",
    "type": "reorder",
    "lang": "pseudo",
    "lines": [
      "Decide on a parameter indicating the input's size",
      "Identify the algorithm's basic operation",
      "Be sure the basic operation count depends only on the size of the input",
      "Set up a sum expressing the number of times the basic operation is executed",
      "Use summation algebra to find a closed-form expression for the sum",
      "Determine the efficiency class using asymptotic notations"
    ],
    "explain": "Slide 62, from the textbook: size parameter, basic operation, check that the count depends only on the size (otherwise best/worst/average separately), set up the sum, find its closed form, name the efficiency class."
  },
  {
    "q": "MatrixMultiply is run on two 5 × 5 matrices. How many times is the innermost multiplication executed?",
    "type": "numeric",
    "answer": 125,
    "tolerance": 0,
    "explain": "Three nested loops, each 0 to $n-1$: $\\sum \\sum \\sum 1 = n^3 = 125$. Line 4, `C[i, j] ← 0`, runs only $n^2 = 25$ times, which is why it is not the basic operation."
  }
]
```
