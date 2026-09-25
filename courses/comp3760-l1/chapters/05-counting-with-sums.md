---
title: Setting up and simplifying the sums
minutes: 18
---

Once the basic operation is chosen, "how many times is it executed?" is a counting problem, and the lecture solves it the same way every time: write the loops as summations, then simplify to a function of $n$. This lesson works every example from the slides and gives you the only two summation facts you need.

## An algorithm for analyzing algorithms

Slide 43 states the recipe as an algorithm whose input is an algorithm:

1. **Decide on the basic operation** (may require tie-breakers).
2. **Count how many times the basic operation is executed**: set up summations, simplify to an expression (function) that depends on $N$.
3. **This is the running time.**
4. **Determine big-O class of the running time function.**

The textbook's version (slide 62, from p. 62) is the one to memorize, because a quiz can ask for a step by number:

1. **Decide on a parameter indicating the input's size.**
2. **Identify the algorithm's basic operation.**
3. **Be sure the number of times the basic operation is executed depends only on the size of the input.** If it depends on some other property, the best/worst/average case efficiencies must be investigated separately.
4. **Set up a sum expressing the number of times the basic operation is executed.**
5. **Use summation algebra to find a closed-form expression for the sum** from step 4.
6. **Determine the efficiency class of the algorithm using asymptotic notations.**

Steps 4 and 5 are this lesson. Step 3 is [Best, worst and average case](#/comp3760-l1/best-worst-average); step 6 is [Big-O, Big-Ω, Big-Θ](#/comp3760-l1/big-o-omega-theta).

## The two summation facts you need

The slides point to the Math Review and to Appendix A of the textbook for these. Everything in Lecture 1 comes from two identities.

**A sum of ones counts the terms.** From $l$ to $u$ inclusive there are $u - l + 1$ terms:

$$\sum_{i=l}^{u} 1 = u - l + 1$$

So $\sum_{i=1}^{n} 1 = n$, $\sum_{i=0}^{n-1} 1 = n$, and $\sum_{j=i+1}^{n-1} 1 = n - 1 - i$.

**The sum of the first $n$ integers.**

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

Replace $n$ by $n - 1$ and you get the form the lecture uses most: $\sum_{i=1}^{n-1} i = \frac{(n-1)n}{2}$. Check it with $n = 5$: $1 + 2 + 3 + 4 = 10 = \frac{4 \cdot 5}{2}$.

Two consequences you will use without thinking: a constant $c$ added $n$ times is $\sum_{i=0}^{n-1} c = c \cdot n$, and a sum can be split term by term, $\sum (a_i - b_i) = \sum a_i - \sum b_i$.

## Example 1: Mystery1, a single loop

```pseudo
1. Mystery1(n)  // n > 0
2.  S ← 0
3.  for i ← 1 to n do
4.      S ← S + i * i
5.  return S
```

**What does it do?** Calculates $1^2 + 2^2 + 3^2 + \ldots + n^2$. **Basic operation?** It's line 4. **How many times?** Slide 30 spells it out: the basic operation is executed once each time through the loop, 1st time: 1, 2nd time: 1, …, $n$th time: 1, so you have a sum $1 + 1 + 1 + \ldots + 1$ ($n$ times) $= n$. In summation form:

$$\sum_{i=1}^{n} 1 = n$$

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

**What does it do?** Calculates the sum of the elements in array $A$. **Basic operation?** The addition on line 5.

**How many times?** Work from the outside in, the way slides 32 to 34 do.

- **The outer loop:** $i$ goes from 0 to $n-1$, so we have $\sum_{i=0}^{n-1} (\text{whatever the inner loop does})$.
- **The inner loop:** $j$ goes from 0 to $n-1$, and at each iteration we do one basic operation, so the inner loop contributes $\sum_{j=0}^{n-1} 1$. We do this for each iteration of the outer loop:

$$\sum_{i=0}^{n-1} \sum_{j=0}^{n-1} 1$$

- **Simplify from the inside:** the inner summation is $\sum_{j=0}^{n-1} 1 = 1 + 1 + \ldots + 1 = n$. So the outer summation is $\sum_{i=0}^{n-1} n = n + n + \ldots + n = n^2$.

```widget
loop-grid
{ "preset": "square", "n": 6, "title": "Mystery2: one dot for every (i, j) the inner statement runs for" }
```

Every dot is one execution of line 5. A full $n \times n$ square: $n^2$ dots.

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

The basic operation is the key comparison `A[j]>v` on line 5 ([why](#/comp3760-l1/basic-operation)). Slides 38 to 40:

- **Look at the outer loop first.** There is a variable $i$ getting incremented from 1 up to $n-1$, so we have $\sum_{i=1}^{n-1}(\ldots)$.
- **The inner loop:** $j$ goes from $i-1$ down to 0, and at each iteration we do one basic operation. Mathematically the number of steps is $\sum_{j=0}^{i-1} 1$. We do this for each iteration of the outer loop, so the total number of basic operations is:

$$\sum_{i=1}^{n-1} \sum_{j=0}^{i-1} 1$$

- **Simplifying the sum.** We know $\sum_{j=0}^{i-1} 1 = i$ (the terms run from 0 to $i-1$, that is $i$ of them). So $\sum_{i=1}^{n-1} \sum_{j=0}^{i-1} 1 = \sum_{i=1}^{n-1} i$, which equals

$$\frac{(n-1)n}{2}$$

```widget
loop-grid
{ "preset": "lower", "n": 6, "title": "Loops: the inner loop runs i times on pass i" }
```

The dots form a triangle, half of a square, which is why the answer is about $\frac{n^2}{2}$. Note the assumption hiding in "$j$ goes from $i-1$ down to 0": the comparison must be true every time for $j$ to get all the way down. That is the worst case, an input in descending order. The lecture counts the worst case unless told otherwise.

## Three nested loops: matrix multiplication

Slides 50 and 83 use the standard algorithm for multiplying two $n \times n$ matrices; here it is in the slides' style.

```pseudo
1. MatrixMultiply(A[0..n-1, 0..n-1], B[0..n-1, 0..n-1])
2.   for i ← 0 to n-1 do
3.     for j ← 0 to n-1 do
4.       C[i, j] ← 0
5.       for k ← 0 to n-1 do
6.         C[i, j] ← C[i, j] + A[i, k] * B[k, j]
7.   return C
```

**Input size measure:** the matrix dimension (elements per row/col). **Basic operation:** the innermost expression and assignment, which slide 83 narrows to **multiplication of two numbers**. Three loops, each running $n$ times, so three sums:

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

**Problem:** calculating an unusual sum. **Input size measure:** the number $n$. **Basic operation:** the division and assignment on line 6 (**but note that div-by-2 is actually a super-fast op**).

There is no `for` bound to sum over, so count the values $i$ takes. Starting at $n$, it is halved (integer division) until it drops below 1: $n, n/2, n/4, \ldots, 1$. The number of halvings before a number below 1 appears is $⌊\log_2 n⌋ + 1$, and the slide writes the running time as

$$C(n) = \log n$$

For $n = 8$: $i = 8, 4, 2, 1$, four passes, and $\log_2 8 + 1 = 4$. For $n = 1000$: $1000, 500, 250, 125, 62, 31, 15, 7, 3, 1$, ten passes, and $⌊\log_2 1000⌋ + 1 = 9 + 1 = 10$. Doubling $n$ adds a single pass. This is the shape to recognize on a quiz: **a loop whose control variable is divided by a constant each time runs a logarithmic number of times.**

```widget
op-counter
{ "preset": "Example3 (halving loop)", "presets": false, "title": "Example3: line 6 runs ⌊log₂ n⌋ + 1 times" }
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

- **Parameter for input size:** $n$, the size of the array.
- **Basic operation:** comparison in the innermost loop.
- **Worst case efficiency count** (no two elements equal, so the loops run to the end). The nested loop, from slide 85, one line at a time:

$$C(n) = \sum_{i=0}^{n-2} \sum_{j=i+1}^{n-1} 1$$

The inner sum runs from $j = i+1$ to $j = n-1$, which is $(n-1) - (i+1) + 1$ terms:

$$= \sum_{i=0}^{n-2} (n - 1 - i - 1 + 1) = \sum_{i=0}^{n-2} (n - 1 - i)$$

Split it into three sums, each over $n-1$ terms ($i$ from 0 to $n-2$):

$$= \sum_{i=0}^{n-2} n - \sum_{i=0}^{n-2} 1 - \sum_{i=0}^{n-2} i = n(n-1) - (n-1) - \frac{(n-2)(n-1)}{2}$$

Expand and collect:

$$= n^2 - n - n + 1 - \frac{n^2}{2} + \frac{3n}{2} - 1 = \frac{n^2}{2} - \frac{n}{2} \in O(n^2)$$

Sanity check with $n = 4$: pairs $(0,1), (0,2), (0,3), (1,2), (1,3), (2,3)$, six comparisons, and $\frac{16}{2} - \frac{4}{2} = 6$. Notice that $\frac{n^2}{2} - \frac{n}{2} = \frac{n(n-1)}{2}$, the number of pairs you can pick from $n$ items, which is a shortcut worth remembering: every "compare each element with every later element" loop costs $\frac{n(n-1)}{2}$.

```widget
loop-grid
{ "preset": "upper", "n": 6, "title": "UniqueElements: j starts one past i" }
```

```widget
op-counter
{ "preset": "UniqueElements", "mode": "worst", "presets": false, "title": "UniqueElements: the comparison in the worst case" }
```

:::quiz Three shapes to recognize instantly
- **Single loop to $n$:** $\sum_{i=1}^{n} 1 = n$.
- **Two full nested loops to $n$:** $\sum \sum 1 = n^2$; three of them, $n^3$.
- **Inner loop bounded by the outer index** (to $i$, from $i+1$, down from $i-1$): a triangle, $\sum i = \frac{n(n-1)}{2}$ or $\frac{n(n+1)}{2}$, so about $\frac{n^2}{2}$.
- **Control variable halved each pass:** $\log_2 n$ passes (plus one).
:::

## Try it

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
    "explain": "Two loops run one after the other, not nested, so their counts add rather than multiply: $\\sum_{i=0}^{n-1} 1 + \\sum_{i=0}^{n-1} 1 = n + n = 2n$ additions and subtractions. Each line on its own runs $n$ times, so if a quiz names one line as *the* basic operation its count is $n$; either way the class is $O(n)$, never $n^2$, because the loops are sequential, not nested."
  },
  {
    "q": "Which summation counts the basic operation in this fragment?",
    "code": "for i ← 1 to n do\n    for j ← 1 to i do\n        x ← x + 1\n    endfor\nendfor",
    "options": ["$\\sum_{i=1}^{n} \\sum_{j=1}^{n} 1$", "$\\sum_{i=1}^{n} \\sum_{j=1}^{i} 1$", "$\\sum_{j=1}^{i} 1$", "$\\sum_{i=1}^{n} i^2$"],
    "answer": 1,
    "explain": "The outer loop gives $\\sum_{i=1}^{n}$; the inner loop runs from 1 to $i$, giving $\\sum_{j=1}^{i} 1$ inside it. Simplified: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$. The first option would be a full square ($n^2$), and the inner bound of $i$ is exactly what makes it a triangle instead."
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
    "answer": 2,
    "explain": "1 decide on a parameter for the input's size; 2 identify the basic operation; 3 be sure the count depends only on the size of the input; 4 set up a sum; 5 use summation algebra to find a closed form; 6 determine the efficiency class using asymptotic notations."
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
