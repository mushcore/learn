---
title: The lecture's practice problems, worked
minutes: 15
---

The last slide of Lecture 1 sets three problems. **For each of the following problems, write an algorithm and then determine: (a) its basic operation, (b) basic operation count, (c) if basic op count depends on input form.**

1. Computing the sum of a set of numbers
2. Computing $n!$ ($n$ factorial)
3. Checking whether all elements in a given array are distinct

Do each one on paper before reading the worked version. The recipe is the "algorithm for analyzing algorithms" from the slides: **decide on the basic operation** (may require tie-breakers), **count how many times the basic operation is executed** (set up summations, simplify to an expression that depends on $N$; this is the running time), then **determine the big-O class** of the running time function.

## Problem 1: the sum of a set of numbers

```pseudo
1. Algorithm SumAll(A[0..n-1])
2.    sum ← 0
3.    for i ← 0 to n-1 do
4.        sum ← sum + A[i]
5.    endfor
6.    return sum
```

- **Input size:** $n$, the number of numbers.
- **(a) Basic operation:** the addition `sum + A[i]` on line 4. It is the statement executed most frequently (the only one inside the loop), and among the candidates it is the one doing the work. If you prefer to name it "the assignment on line 4", that is the same line: the tie-breaker list ranks the arithmetic in the expression, but either name points at line 4.
- **(b) Count:** once per pass of the loop, $i$ from $0$ to $n - 1$:
  $$C(n) = \sum_{i=0}^{n-1} 1 = n$$
- **(c) Depends on input form?** **No.** Every element is added exactly once whatever its value; there is no `if` that could skip work. Best case = worst case = $n$.
- **Class:** $C(n) = n \in O(n)$, linear: "algorithms that scan a list of size $n$".

This is the same shape as `Mystery1` on the slides (`S ← S + i * i` inside `for i ← 1 to n`), which also came out to exactly $n$.

## Problem 2: n factorial

```pseudo
1. Algorithm Factorial(n)   // n ≥ 0
2.    f ← 1
3.    for i ← 2 to n do
4.        f ← f * i
5.    endfor
6.    return f
```

- **Input size:** the number $n$ itself (as in `Example3` on the slides, where the input size measure was "number $n$").
- **(a) Basic operation:** the multiplication `f * i` on line 4. Tie-breakers agree: it is the deepest statement, and multiplication ranks above addition on the arithmetic list.
- **(b) Count:** $i$ runs from $2$ to $n$, which is $n - 2 + 1$ values:
  $$C(n) = \sum_{i=2}^{n} 1 = n - 1 \quad (n \ge 2)$$
  If you wrote the loop as `for i ← 1 to n`, the count is $n$ (one wasted multiplication by 1). Both answers are right for their own algorithm; on a quiz, count the loop you were shown.
- **(c) Depends on input form?** **No.** The count depends only on the size $n$, not on any property of the input.
- **Class:** $O(n)$.

:::tip Starting at 1 or at 0
`Factorial(0)` and `Factorial(1)` both return 1 without entering the loop: the `for i ← 2 to n` bound is empty when $n < 2$, so the count formula $n - 1$ only applies for $n \ge 2$. When you state a count, say for which $n$ it holds if the loop can be empty.
:::

## Problem 3: are all the elements distinct?

This is the slide's `UniqueElements` algorithm (textbook Example 3):

```pseudo
1. UniqueElements(A[0..n-1])
2.   for i ← 0 to n-2 do
3.     for j ← i+1 to n-1 do
4.       if A[i] = A[j] return false
5.   return true
```

- **Input size:** $n$, the size of the array.
- **(a) Basic operation:** the **comparison in the innermost loop**, `A[i] = A[j]` on line 4. Key comparisons outrank the loop bookkeeping.
- **(b) Count:** the algorithm can stop early, so the count is not a single number. In the **worst case** (all elements distinct, or the only duplicate is the last pair) every comparison happens:
  $$C_{worst}(n) = \sum_{i=0}^{n-2} \sum_{j=i+1}^{n-1} 1 = \sum_{i=0}^{n-2} (n - 1 - i) = \frac{n^2}{2} - \frac{n}{2}$$
  (the full simplification is worked line by line in [Setting up and simplifying the sums](#/comp3760-l1/counting-with-sums)). In the **best case** `A[0] = A[1]` and the very first comparison returns `false`: $C_{best}(n) = 1$.
- **(c) Depends on input form?** **Yes.** This is the whole point of the third problem: the count depends on *where* (and whether) a duplicate sits. Step 3 of the textbook's strategy says that when this happens, best, worst and average cases must be investigated separately, and the slide rule is **unless otherwise specified, you should always analyze the worst case.**
- **Class:** $C_{worst}(n) = \frac{n^2}{2} - \frac{n}{2} \in O(n^2)$, quadratic: two embedded loops.

Run the three problems through the counter and compare the "worst" and "best" modes for `UniqueElements`; the other two have no modes because their counts cannot vary.

```widget
op-counter
{ "title": "Every algorithm in the module: pick a preset, set n, predict the counts, then reveal the basic operation" }
```

## From the textbook

The slide before the practice problems lists exercises from Levitin, 3rd edition. Do them on paper with the book open; they are in the same style as the quiz.

- Chapter 1.1, page 8, question 5
- Chapter 1.2, page 18, question 9
- Chapter 1.3, page 23, question 1
- Chapter 2.1, page 50, question 2
- Chapter 2.2, page 60, question 5
- Chapter 2.3, page 68, questions 5 and 6

## Three more, in the quiz's style

The quiz shows a short fragment and asks *what is the basic operation* or *how many times is it performed*. These three are not on the slides; they are built to catch the three most common mistakes.

### A: a halving loop with a constant inner loop

```pseudo
1. Algorithm FragA(n)
2.    i ← n
3.    while i ≥ 1 do
4.        for k ← 1 to 5 do
5.            print(k)
6.        endfor
7.        i ← i/2
8.    endwhile
```

- **Basic operation:** line 5. It is the deepest statement, and it runs 5 times for every pass of the outer loop, so it is executed most often. (Line 7, the division, runs only once per pass.)
- **Count:** the outer loop is `Example3` from the slides: with integer division, $i$ takes the values $n, ⌊n/2⌋, ⌊n/4⌋, \ldots, 1$, which is $⌊\log_2 n⌋ + 1$ passes. Each pass runs line 5 five times:
  $$C(n) = 5 \cdot (⌊\log_2 n⌋ + 1)$$
  For $n = 8$: $i = 8, 4, 2, 1$, four passes, $C = 20$.
- **Class:** $O(\log n)$. The constant 5 is a constant factor and disappears. A constant-bound inner loop never changes the class.

### B: a nested loop whose inner bound is a constant

```pseudo
1. Algorithm FragB(A[0..n-1])
2.    count ← 0
3.    for i ← 0 to n-1 do
4.        for j ← 1 to 20 do
5.            if A[i] > j then
6.                count ← count + 1
7.            endif
8.        endfor
9.    endfor
10.   return count
```

- **Basic operation:** the comparison `A[i] > j` on line 5. It is executed on every pass of the inner loop; line 6 only runs when the comparison is true, so it can never be executed more often than line 5, and a key comparison outranks an assignment on the tie-breaker list anyway.
- **Count:** the inner loop runs exactly 20 times for each of the $n$ values of $i$:
  $$C(n) = \sum_{i=0}^{n-1} \sum_{j=1}^{20} 1 = \sum_{i=0}^{n-1} 20 = 20n$$
- **Class:** $O(n)$, **not** $O(n^2)$. Two nested loops give $n^2$ only when *both* bounds grow with $n$. Here the inner bound is the constant 20, so the algorithm is linear. This is the trap the quiz's `DoSomething(N)` fragment is built on: its $10 \times 10$ loop contributes a constant 100 no matter how big $N$ gets.

### C: a loop that calls a function that loops

```pseudo
1. Algorithm FragC(A[0..n-1])
2.    total ← 0
3.    for i ← 0 to n-1 do
4.        total ← total + SumAll(A)
5.    endfor
6.    return total
```

`SumAll` is Problem 1's algorithm: it adds up all $n$ elements, so each call does $n$ additions.

- **Basic operation:** the call `SumAll(A)` on line 4. The tie-breaker list starts with **function calls (growing with $N$)**: a call whose own cost grows with the input outranks everything else in the statement, including the addition next to it.
- **Basic operation count:** the call happens once per pass of the loop:
  $$C(n) = \sum_{i=0}^{n-1} 1 = n$$
- **Total work and class:** each call costs $n$ additions, so the algorithm as a whole performs $n \cdot n = n^2$ additions and its class is $O(n^2)$.

:::quiz "How many times" is not the same question as "what class"
For FragC, **the basic operation is performed $n$ times** (that is the literal count of the call) but **the efficiency class is $O(n^2)$** (the count multiplied by what each call costs). The slides give you the tie-breaker rule that makes the call the basic operation; the consequence, that a growing-cost call carries its cost into the class, is the reason that rule sits at the top of the list. Read the question: a count question wants $n$; a class question wants $O(n^2)$.
:::

## Try it

```quiz
[
  {
    "q": "What does this algorithm compute?",
    "code": "Algorithm Q(A[0..n-1])\n   s ← 0\n   for i ← 0 to n-1 do\n       s ← s + A[i]\n   endfor\n   return s",
    "options": ["The largest element of A", "The sum of the elements of A", "The number of elements of A", "The average of A"],
    "answer": 1,
    "explain": "It starts a running total at 0 and adds every element once, so it returns the sum. To count elements it would add 1 each time; the average would need a division by n at the end."
  },
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation of this algorithm.",
    "code": "Algorithm Factorial(n)\n   f ← 1\n   for i ← 2 to n do\n       f ← f * i\n   endfor\n   return f",
    "answer": 4,
    "explain": "Line 4, the multiplication f * i, is the statement inside the loop, executed n − 1 times; the initialization and the return run once each. The for line is loop bookkeeping, and multiplication outranks it on the tie-breaker list."
  },
  {
    "q": "In `Factorial(n)` with the loop `for i ← 2 to n`, how many multiplications are performed for $n = 10$?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "$i$ takes the values 2, 3, ..., 10: that is $10 - 2 + 1 = 9$ values, so $C(n) = n - 1 = 9$. A loop from 1 to n would do 10."
  },
  {
    "q": "The number of times the basic operation of `UniqueElements` is executed depends on the input.",
    "type": "tf",
    "answer": true,
    "explain": "True. It returns false the moment it finds a duplicate: best case 1 comparison (A[0] = A[1]), worst case $\\frac{n^2}{2} - \\frac{n}{2}$ (all distinct). That is why part (c) of the practice problem exists, and why you analyze the worst case unless told otherwise."
  },
  {
    "q": "How many times is the comparison on line 5 executed?",
    "code": "1. Algorithm FragB(A[0..n-1])\n2.    count ← 0\n3.    for i ← 0 to n-1 do\n4.        for j ← 1 to 20 do\n5.            if A[i] > j then\n6.                count ← count + 1\n7.            endif\n8.        endfor\n9.    endfor\n10.   return count",
    "options": ["$n$", "$20n$", "$n^2$", "$20n^2$"],
    "answer": 1,
    "explain": "The inner loop runs exactly 20 times for each of the $n$ values of $i$: $\\sum_{i=0}^{n-1} 20 = 20n$. The inner bound is a constant, so there is no $n^2$."
  },
  {
    "q": "What is the efficiency class of `FragB` above?",
    "options": ["$O(1)$", "$O(n)$", "$O(n \\log n)$", "$O(n^2)$"],
    "answer": 1,
    "explain": "$C(n) = 20n$; drop the constant factor 20 and the class is $O(n)$. Two nested loops only give $n^2$ when both bounds grow with $n$."
  },
  {
    "q": "In `FragA(n)` (a while loop that halves $i$ from $n$ down to 1 with integer division, containing a `for k ← 1 to 5` loop), how many times is the inner statement executed for $n = 8$?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "explain": "$i$ takes the values 8, 4, 2, 1: four passes ($⌊\\log_2 8⌋ + 1 = 4$). Each pass runs the inner loop 5 times, so $5 \\times 4 = 20$. The general count is $5(⌊\\log_2 n⌋ + 1) \\in O(\\log n)$."
  },
  {
    "q": "What is the basic operation of this algorithm? `SumAll(A)` adds up all $n$ elements of A.",
    "code": "1. Algorithm FragC(A[0..n-1])\n2.    total ← 0\n3.    for i ← 0 to n-1 do\n4.        total ← total + SumAll(A)\n5.    endfor\n6.    return total",
    "options": ["Line 2: the assignment total ← 0", "Line 3: the for loop", "Line 4: the addition total + ...", "Line 4: the function call SumAll(A)"],
    "answer": 3,
    "explain": "Function calls whose cost grows with $N$ are first on the tie-breaker list. The call and the addition are on the same line and run the same number of times; the call wins the tie because it does $n$ additions of its own each time."
  },
  {
    "q": "For `FragC` above, how many times is the basic operation performed, and what is the efficiency class?",
    "options": ["$n$ times; $O(n)$", "$n$ times; $O(n^2)$", "$n^2$ times; $O(n^2)$", "$n^2$ times; $O(n)$"],
    "answer": 1,
    "explain": "The call on line 4 happens once per pass, so the basic operation is performed $n$ times. But each call costs $n$ additions, so the total work is $n \\cdot n = n^2$ and the class is $O(n^2)$. Count questions and class questions can have different-looking answers."
  },
  {
    "q": "For which of the three practice problems does the basic operation count NOT depend on the form of the input? Select all that apply.",
    "options": ["Computing the sum of a set of numbers", "Computing $n!$", "Checking whether all elements in an array are distinct"],
    "answer": [0, 1],
    "explain": "The sum always adds every element ($n$ additions) and the factorial always does $n - 1$ multiplications; neither has a branch that can skip work. Distinctness can stop at the first duplicate, so its count ranges from 1 to $\\frac{n^2}{2} - \\frac{n}{2}$."
  }
]
```
