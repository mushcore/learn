---
title: Choosing the basic operation (and the tie-breakers)
minutes: 15
---

[Counting statements](#/comp3760-l1/counting-statements) gave the definition and slide 27's tie-breakers; this lesson applies them where the answer is not obvious.

## The order of precedence

The lecture's own picks fix what each one means:

1. **Count first.** The line whose count grows fastest with $n$ wins; tie-breakers only settle equal counts. The definition names one statement, so "two basic operations" is never the answer.
2. **Deepest inside the loop** means loop depth: the number of loops around a line. A loop's own test (the `for` or `while` line) counts as inside that loop, and an `if` adds no depth, so in `find` lines 3, 4 and 5 are equally deep.
3. **Which one is more "expensive"**: slide 41's list, below. In `find` it picks the comparison on line 4.

## Example 3: Loops

Slide 35 asks what it does, what the basic operation is, and how many times it executes for input size $n$.

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

Slide 36 traces it on `5 2 4 6 1 3`: each pass picks up $v = A[i]$, slides the larger elements to its left one place right, and drops $v$ into the gap. That is insertion sort. The arrays after the five passes are `2 5 4 6 1 3`, `2 4 5 6 1 3`, `2 4 5 6 1 3`, `1 2 4 5 6 3`, `1 2 3 4 5 6`, with 1, 2, 1, 4 and 4 key comparisons: twelve for this input. The count depends on the order of the input ([Best, worst and average case](#/comp3760-l1/best-worst-average)).

## Which statement is the basic operation?

Slide 37: **Two options: there are variable assignments and comparisons. Most people would say the basic operation is the key comparison `A[j]>v`.** Why? **It is really the key thing being checked in each loop**, and **"data" comparisons are often considered more expensive than simple numerical comparisons or assignments.**

In the worst case (descending input) lines 5, 6 and 7 each execute $\frac{n(n-1)}{2}$ times. Line 5 is the `while` test, as deep as lines 6 and 7, so cost settles the tie: line 5 compares data, lines 6 and 7 only copy and subtract.

```widget
op-counter
{ "preset": "Loops (insertion sort)", "mode": "worst", "presets": false, "title": "Loops: how many times each line runs" }
```

At $n = 10$ that is 45 each.

### Loops on the slide-36 array, one comparison at a time

The gap left by $v$ moves left on every true comparison; the first false one, or $j$ reaching −1, ends the pass.

```widget
insertion-play
{ "array": [5, 2, 4, 6, 1, 3], "title": "Loops on 5 2 4 6 1 3: one step per key comparison A[j] > v" }
```

:::tip Two comparisons on one line
`j≥0` is a plain numerical check; `A[j]>v` is the **key comparison**, the one that compares array data and the one to name.
:::

## The tie-breaker list

Slide 41 orders "more expensive"; the highest item that applies decides.

1. **Function calls (growing with N)**
2. **Function calls (constant time)**
3. **Key comparisons (comparing data)**
4. **Assignments (copying data)**
5. **Expression evaluations**

**Arithmetic tie-breakers:** 1. **Multiplication/division** 2. **Addition/subtraction**

:::warn Guidelines, not laws
**These are all more like guidelines than strict rules.** The list never overrides the count: a statement run $n^2$ times beats a call run $n$ times.
:::

### Function calls rank first: CountSomething2

Slide 10's algorithm counts the primes among $100a + b$, $1 \le a, b \le n$.

```pseudo
1. Algorithm CountSomething2(int n)
2.     count = 0
3.     for a = 1 to n do
4.         for b = 1 to n do
5.             val = 100*a + b
6.             if SomeMathLib.isPrime(val)
7.                 count++
8.             endif
9.         endfor
10.    endfor
11.    return count
12. END
```

Lines 5 and 6 both execute $n^2$ times (line 7 only for primes). Line 6 is a **function call**, the top of the list, so it beats line 5's arithmetic: $C(n) = n^2$. A call can hide a whole loop.

```widget
op-counter
{ "preset": "CountSomething2 (isPrime)", "presets": false, "title": "CountSomething2: the isPrime call ties with line 5 on count" }
```

## Four traps

### A constant loop is not a basic operation: DoSomething(N)

```pseudo
 1. Algorithm DoSomething(N)
 2.   s = 0
 3.   t = 0
 4.   u = 0
 5.   for i = 1 to 10 do
 6.       for j = 1 to 10 do
 7.           s = s + i
 8.       endfor
 9.   endfor
10.   for x = 1 to N do
11.       t = t + x
12.   endfor
13.   for p = 1 to N do
14.       u = u * max(s, t)
15.   endfor
16. END
```

Line 7 runs exactly **100 times, whatever N is**, so it cannot be the basic operation even though 100 beats $N = 10$. Lines 11 and 14 tie at $N$; line 14 makes a **constant-time function call** (tie-breaker 2) and **multiplies**, so it wins. $C(N) = N$.

```widget
op-counter
{ "preset": "DoSomething(N) (10×10 then N)", "n": 10, "presets": false, "title": "DoSomething(N): line 7 is stuck at 100 while lines 11 and 14 grow" }
```

### Two loops, one basic operation: CountSomethingElse(N)

```pseudo
 1. Algorithm CountSomething(int N)
 2.     A = new array[1..N]
 3.     for i = 1 to N do
 4.         sum1 = 0
 5.         for j = 1 to i do
 6.             sum1 = sum1 + j
 7.         endfor
 8.         A[i] = sum1
 9.     endfor
10.     sum2 = 0
11.     for i = 1 to N do
12.         sum2 = sum2 + A[i]
13.     endfor
14.     return sum2
15. END
```

Slide 11's `CountSomethingElse` under a shorter name. Line 6 runs $1 + 2 + \ldots + N = \frac{N(N+1)}{2}$ times, line 12 only $N$ (55 against 10 at $N = 10$), so line 6 alone is the basic operation.

```widget
loop-grid
{ "preset": "triangle1", "n": 6, "title": "CountSomethingElse: line 6 runs once per dot, i dots on pass i" }
```

```widget
op-counter
{ "preset": "CountSomethingElse(N)", "presets": false, "title": "CountSomethingElse(N): line 6 against line 12" }
```

### A tie at the same depth: the halving loop with a countdown

```pseudo
 1. j = 0
 2. i = n
 3. while i > 0 do
 4.    j = j+1
 5.    if j > 0 then
 6.       x = i
 7.       while x > 0
 8.          x = x - j
 9.       end-while
10.    end-if
11.    i = i/2
12. end-while
```

With integer division `i/2`, the outer loop runs $⌊\log_2 n⌋ + 1$ times, and so do lines 3, 4, 5, 6 and 11. For $n = 10$, $x$ falls 10, 9, …, 0, then 5, 3, 1, −1, then 2, −1, then 1, −3: line 8 runs 10 + 3 + 1 + 1 = 15 times.

Line 7, the test `while x > 0`, also runs 15 times when a loop test is counted once per pass, as the slides count `find`'s `for` line. The two are equally deep, so cost decides: line 8 is an assignment with a subtraction; `x > 0` compares a counter with 0, not data. Basic operation: **line 8**.

```widget
op-counter
{ "preset": "Halving with countdown", "n": 10, "presets": false, "title": "The halving loop: lines 7 and 8 against the rest" }
```

### The countdown, one outer pass at a time

The bar is $i$, halved after every pass; the marker is $x$ stepping down by $j$. Doubling $n$ adds one pass.

```widget
halving-play
{ "mode": "countdown", "n": 10, "title": "The countdown fragment at n = 10: one step per outer pass" }
```

### A comparison that never changes: UnusualAdd

```pseudo
1. Algorithm UnusualAdd(A[n], B[n])
2.     C = new array[n]
3.     for i = 0 to n-1 do
4.         if A[n]==B[n] then
5.             C[i] = A[i]
6.         else
7.             C[i] = A[i] + B[i]
8.         endif
9.     endfor
10. END
```

Line 4 compares the same out-of-range pair on every pass, so the same branch is taken every time.

```widget
op-counter
{ "preset": "UnusualAdd(A, B)", "mode": "equal", "predict": true, "presets": false, "title": "UnusualAdd: predict the counts, then flip the branch" }
```

Line 4 runs $n$ times, and so does whichever of lines 5 and 7 the branch selects. A **key comparison** (tie-breaker 3) beats assignments (4): the basic operation is line 4, executed **n** times, not $n/2$ and not $2n$.

```quiz
[
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation.",
    "code": "Algorithm Triple(A[0..n-1])\n    total ← 0\n    for i ← 0 to n-1 do\n        for j ← 0 to n-1 do\n            for k ← 0 to n-1 do\n                total ← total + weight(A[i], A[j], A[k])\n            endfor\n        endfor\n    endfor\n    return total",
    "answer": 6,
    "explain": "Line 6 is the only statement inside all three loops, so it runs $n^3$ times, more than any other line. It also contains a function call, the top of the tie-breaker list, so even a competing line at the same depth would lose to it. Running time: $C(n) = n^3$."
  },
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation.",
    "code": "Algorithm Fives(n)\n    a ← 0\n    b ← 0\n    for i ← 1 to n do\n        for j ← 1 to 5 do\n            a ← a + j\n        endfor\n        b ← b * i\n    endfor\n    return a + b",
    "answer": 6,
    "explain": "The inner loop has a constant bound, but it sits inside the $n$ loop, so line 6 runs $5n$ times, which grows with $n$. Line 8 runs $n$ times. $5n > n$ for every $n$, so line 6 wins on count alone and no tie-breaker is needed (the multiplication on line 8 never gets a vote). Compare DoSomething(N), where the constant loop was beside the $N$ loop and its 100 executions did not grow at all."
  },
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation.",
    "code": "Algorithm Halve(n)\n    k ← 0\n    m ← n\n    while m > 1 do\n        m ← m / 2\n        k ← k + 1\n    endwhile\n    return k",
    "answer": 5,
    "explain": "Lines 5 and 6 are both inside the loop and both run $⌊\\log_2 n⌋$ times, so they tie on count and on depth. The arithmetic tie-breaker decides: **multiplication/division** outranks **addition/subtraction**, so line 5 (`m ← m / 2`) is the basic operation. Running time: $C(n) = \\log n$."
  },
  {
    "q": "Which kind of statement sits at the top of the lecture's tie-breaker list?",
    "options": ["Assignments (copying data)", "Key comparisons (comparing data)", "Function calls (growing with N)", "Expression evaluations"],
    "answer": 2,
    "explain": "The order is: 1 function calls (growing with N), 2 function calls (constant time), 3 key comparisons (comparing data), 4 assignments (copying data), 5 expression evaluations. Function calls rank first because a call can hide an entire loop of work."
  },
  {
    "q": "As an arithmetic tie-breaker, multiplication or division outranks addition or subtraction.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 41's arithmetic tie-breakers are 1 multiplication/division, 2 addition/subtraction. That is what makes line 14 of DoSomething(N), `u = u * max(s, t)`, beat line 11, `t = t + x`, when both run N times."
  },
  {
    "q": "The tie-breakers are strict rules: applying them always identifies the basic operation with no judgement involved.",
    "type": "tf",
    "answer": false,
    "explain": "The slide's own words: **these are all more like guidelines than strict rules**. Slide 37 says the same thing differently: \"most people would say\" the key comparison is the basic operation. The count comes first; the guidelines only settle ties."
  },
  {
    "q": "What is the basic operation in this algorithm?",
    "code": "1. Algorithm Mix(N)\n2.     p = 0\n3.     q = 0\n4.     for i = 1 to 20 do\n5.         for j = 1 to 20 do\n6.             p = p + 1\n7.         endfor\n8.     endfor\n9.     for k = 1 to N do\n10.        q = q + p\n11.    endfor\n12.    return q",
    "options": ["Line 6: p = p + 1, because it runs 400 times", "Line 10: q = q + p", "Line 4: the outer for loop with index i", "There is no basic operation, because N might be smaller than 400"],
    "answer": 1,
    "explain": "Line 6 runs exactly 400 times no matter what N is; a count that does not depend on the input size cannot be the basic operation, even if it happens to be the largest number for small N. Line 10 runs N times and grows with N, so it is the basic operation and $C(N) = N$. The same trap as DoSomething(N), where line 7 is stuck at 100."
  },
  {
    "q": "In the Loops algorithm (insertion sort), which statement did the lecture pick as the basic operation?",
    "code": "1. Loops(A[0..n-1])\n2.  for i ← 1 to n-1 do\n3.    v ← A[i]\n4.    j ← i-1\n5.    while j≥0 and A[j]>v do\n6.       A[j+1] ← A[j]\n7.       j ← j-1\n8.    A[j+1] ← v",
    "options": ["Line 3: v ← A[i], the assignment that starts each pass", "Line 5: the key comparison A[j] > v", "Line 6: A[j+1] ← A[j], the assignment that moves data", "Line 8: A[j+1] ← v"],
    "answer": 1,
    "explain": "Lines 5, 6 and 7 tie on count in the worst case ($\\frac{n(n-1)}{2}$ each), and line 5, the `while` test, counts as inside the loop it controls, so all three are equally deep and \"more expensive\" decides. Line 5 is a **key comparison** (comparing data); lines 6 and 7 are an assignment and a subtraction. Slide 37: it is really the key thing being checked in each loop, and data comparisons are often considered more expensive than simple numerical comparisons or assignments."
  },
  {
    "q": "In `find`, line 5 (`m ← A[i]`) sits inside the `if`, and the slide counts it n − 1 times like line 4. Why is line 4 still the basic operation?",
    "code": "1. Algo: find( A[0…n-1] )\n2.    m ← A[0]\n3.    for i ← 1 to n-1 do\n4.       if A[i] > m\n5.          m ← A[i]\n6.    return m",
    "options": ["Depth counts loops, not ifs: lines 4 and 5 are both one loop deep, so cost decides, and a key comparison outranks an assignment", "Line 5 is deeper, so line 5 is the basic operation", "Line 4 comes first in the listing", "Line 4 is the only line that runs n − 1 times"],
    "answer": 0,
    "explain": "\"Deepest inside the loop\" is about loop depth. An `if` adds no depth, so lines 3, 4 and 5 are all one loop deep and tie; slide 41's cost list then puts the key comparison (3) above the assignment (4). Position in the listing is never a criterion, and lines 3 and 5 also run n − 1 times on the slide."
  },
  {
    "q": "In CountSomethingElse(N), how many times is line 6 (`sum1 = sum1 + j`) executed when N = 6?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0,
    "explain": "Line 6 runs $i$ times for each $i$ from 1 to N: $1 + 2 + 3 + 4 + 5 + 6 = 21 = \\frac{6 \\cdot 7}{2}$. Line 12 runs only 6 times. One basic operation: line 6."
  },
  {
    "q": "Which of these is NOT one of slide 27's tie-breakers for the basic operation?",
    "options": ["Deepest inside the loop", "Which one is more \"expensive\"", "The statement that appears first in the algorithm", "Maybe sometimes we don't care"],
    "answer": 2,
    "explain": "The three tie-breakers on slide 27 are: deepest inside the loop; which one is more \"expensive\"; or maybe sometimes we don't care. Position in the listing is never a criterion; only the count, the depth and the cost are."
  }
]
```
