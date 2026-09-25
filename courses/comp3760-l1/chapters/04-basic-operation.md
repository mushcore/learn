---
title: Choosing the basic operation (and the tie-breakers)
minutes: 18
---

In [Counting statements](#/comp3760-l1/counting-statements) you counted every statement of `find` and got $f(n) = 3n - 1$. The lecture then throws most of that work away: **we define the basic operation of an algorithm as the statement that gets executed most frequently**, and **we don't count instructions that are not basic operations**. This lesson is about picking that one statement when it is not obvious, which is exactly what the quiz asks over and over.

## The definition, and what breaks a tie

> **We define the basic operation of an algorithm as the statement that gets executed most frequently.**

When two statements are executed the same number of times, slide 27 gives three tie-breakers:

- **deepest inside the loop**
- **which one is more "expensive"**
- **or maybe sometimes we don't care**

And the sentence the whole course rests on: **this is the fundamental concept we use to analyze algorithmic efficiency: count the number of basic operations executed for an input of size n.**

:::quiz One algorithm, one basic operation
The definition says *the* statement, singular. When a quiz option reads "this code has two basic operations", it is the distractor. Two statements can tie on count; a tie-breaker then picks one of them. Two statements can also both grow with $n$ while one grows faster; the faster one wins outright.
:::

## Example 3: Loops

Slide 35 asks three questions about this algorithm: what does it do, what is the basic operation, and how many times is the operation executed for input size $n$.

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

**What does it do?** Slide 36 traces it on `5 2 4 6 1 3`. Each pass picks up $v = A[i]$ (shown in bold), slides the larger elements to its left one place right, and drops $v$ into the gap. That is insertion sort, which the textbook covers later; the slide just calls it `Loops`.

| pass $i$ | $v = A[i]$ | comparisons `A[j]>v` made | array after the pass |
|---|---|---|---|
| start | | | 5 **2** 4 6 1 3 |
| 1 | 2 | 1 (5 > 2) | 2 5 **4** 6 1 3 |
| 2 | 4 | 2 (5 > 4, then 2 > 4 fails) | 2 4 5 **6** 1 3 |
| 3 | 6 | 1 (5 > 6 fails at once) | 2 4 5 6 **1** 3 |
| 4 | 1 | 4 (6, 5, 4, 2 all > 1) | 1 2 4 5 6 **3** |
| 5 | 3 | 4 (6, 5, 4 > 3, then 2 > 3 fails) | 1 2 3 4 5 6 |

Twelve comparisons in total for this input. Keep that column in mind: the number depends on the *order* of the input, which is the subject of [Best, worst and average case](#/comp3760-l1/best-worst-average).

## Which statement is the basic operation?

Slide 37 is honest that there is a choice:

> **Two options: there are variable assignments and comparisons. Most people would say the basic operation is the key comparison `A[j]>v`.**

Why? Two reasons, in the slide's words:

- **It is really the key thing being checked in each loop.**
- **"Data" comparisons are often considered more expensive than simple numerical comparisons or assignments.**

Count the lines and you see why a tie-breaker is needed at all. In the worst case (input in descending order, so every comparison is true and $j$ walks all the way down to 0) lines 5, 6 and 7 each execute $\frac{n(n-1)}{2}$ times. They tie on frequency, and all three are inside the innermost loop. "More expensive" settles it: line 5 compares *data*, lines 6 and 7 only copy and subtract.

```widget
op-counter
{ "preset": "Loops (insertion sort)", "mode": "worst", "presets": false, "title": "Loops: how many times each line runs" }
```

Set $n = 10$ and read the column: line 5 is executed 45 times, and so are lines 6 and 7. Flip the mode to *best* (already sorted input) and the inner loop stops after one comparison every pass, so line 5 drops to $n - 1$ while lines 6 and 7 fall to 0. The basic operation is still line 5 in both cases; the count is what changes.

:::tip Two comparisons on one line
Line 5 contains two comparisons: `j≥0` is a plain numerical check and `A[j]>v` is the *key comparison* (it compares array data). When the slides say "the basic operation is the comparison", they mean the key comparison. On a quiz, an option that names the data comparison beats one that names the loop counter check.
:::

## The tie-breaker list

Slide 41 turns "more expensive" into an ordered list. Learn it in this order; a quiz option is decided by the *highest* item that applies.

1. **Function calls (growing with N)**
2. **Function calls (constant time)**
3. **Key comparisons (comparing data)**
4. **Assignments (copying data)**
5. **Expression evaluations**

**Arithmetic tie-breakers:**

1. **Multiplication/division**
2. **Addition/subtraction**

:::warn Guidelines, not laws
The slide ends with: **these are all more like guidelines than strict rules.** A true/false question can be built on that sentence. The ranking tells you which of two equally frequent statements to prefer; it never overrides the count itself. A statement that runs $n^2$ times beats a function call that runs $n$ times.
:::

### Function calls beat everything: CountSomething2

Slide 10's algorithm counts how many numbers of the form $100a + b$ (with $1 \le a, b \le n$) are prime.

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

Lines 5 and 6 both execute $n^2$ times (line 7 only when `val` happens to be prime, so it cannot be the most frequent). Line 5 is an assignment with a multiplication and an addition; line 6 is a **function call**. Function calls sit at the top of the tie-breaker list, so line 6 is the basic operation and the running time is $C(n) = n^2$. The cost hidden inside `isPrime` is exactly why the list ranks calls first: one call can be a whole loop of its own.

```widget
op-counter
{ "preset": "CountSomething2 (isPrime)", "presets": false, "title": "CountSomething2: the isPrime call ties with line 5 on count" }
```

## The quiz's favourite question

The sample quiz asks "what is the basic operation?" four different ways. Each one tests a different trap.

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

Line 7 runs exactly **100 times, whatever N is**. For $N = 10$ that is more than any other line, and that is the trap: the running time is a function of the input size, and 100 does not grow with $N$. As soon as $N$ passes 100, lines 11 and 14 overtake it and keep growing. A statement whose count does not depend on $N$ cannot be the basic operation.

That leaves lines 11 and 14, tied at $N$ executions each. Line 11 is an addition. Line 14 calls `max(s, t)`, a **constant-time function call** (tie-breaker 2), and then **multiplies** (arithmetic tie-breaker 1). Line 14 wins on both lists. The running time is $C(N) = N$.

```widget
op-counter
{ "preset": "DoSomething(N) (10×10 then N)", "n": 10, "presets": false, "title": "DoSomething(N): line 7 is stuck at 100 while lines 11 and 14 grow" }
```

Drag $n$ from 10 to 100 and past it. The 100 never moves.

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

This is slide 11's `CountSomethingElse` under a shorter name. Line 6 is inside a loop that runs $i$ times inside a loop that runs $N$ times: $1 + 2 + \ldots + N = \frac{N(N+1)}{2}$ executions. Line 12 runs $N$ times. For $N = 10$ that is 55 against 10, and the gap widens with $N$. The basic operation is line 6, full stop. "Line 6 and line 12" is the distractor: the second loop is a smaller term that big-O will throw away anyway.

```widget
op-counter
{ "preset": "CountSomethingElse(N)", "presets": false, "title": "CountSomethingElse(N): line 6 against line 12" }
```

### Deepest wins: the halving loop with a countdown

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

Read `i/2` as integer division (with real division `i` would never reach 0 and the loop would never end). Then `i` takes the values $n, n/2, n/4, \ldots$ and the outer loop runs only $⌊\log_2 n⌋ + 1$ times, so lines 4, 5, 6 and 11 each run that few times. Line 8 runs once for every step of the inner countdown, and on the very first pass alone (with $j = 1$) it runs $n$ times. It is the deepest statement and by far the most frequent one. For $n = 10$:

| outer pass | $i$ | $j$ | $x$ takes the values | line 8 runs |
|---|---|---|---|---|
| 1 | 10 | 1 | 10, 9, 8, …, 0 | 10 |
| 2 | 5 | 2 | 5, 3, 1, −1 | 3 |
| 3 | 2 | 3 | 2, −1 | 1 |
| 4 | 1 | 4 | 1, −3 | 1 |

Fifteen executions of line 8 against four of everything in the outer loop. Basic operation: **line 8**, the assignment `x = x - j`.

```widget
op-counter
{ "preset": "Halving with countdown", "n": 10, "presets": false, "title": "The halving loop: line 8 against the rest" }
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

The loop runs $n$ times. Line 4 executes every pass, so $n$ times. It compares `A[n]` with `B[n]`, the same (out-of-range) pair every time, so the same branch is taken every pass and either line 5 or line 7 also runs $n$ times, never both. Line 4 is a **key comparison** (tie-breaker 3); lines 5 and 7 are assignments (tie-breaker 4). Basic operation: the comparison on line 4, executed **n** times. The odd index does not change the count, and the quiz's "how many times" answer is $n$, not $n/2$ (both branches are not split between passes) and not $2n$.

## Try it

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
    "explain": "The inner loop has a constant bound, but it sits *inside* the $n$ loop, so line 6 runs $5n$ times, which grows with $n$. Line 8 runs $n$ times. $5n > n$ for every $n$, so line 6 wins on count alone and no tie-breaker is needed (the multiplication on line 8 never gets a vote). Compare DoSomething(N), where the constant loop was *beside* the $N$ loop and its 100 executions did not grow at all."
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
    "explain": "Line 6 runs exactly 400 times no matter what N is; a count that does not depend on the input size cannot be the basic operation, even if it happens to be the largest number for small N. Line 10 runs N times and grows with N, so it is the basic operation and $C(N) = N$. The same trap as the quiz's DoSomething(N), where line 7 is stuck at 100."
  },
  {
    "q": "In the Loops algorithm (insertion sort), which statement did the lecture pick as the basic operation?",
    "code": "1. Loops(A[0..n-1])\n2.  for i ← 1 to n-1 do\n3.    v ← A[i]\n4.    j ← i-1\n5.    while j≥0 and A[j]>v do\n6.       A[j+1] ← A[j]\n7.       j ← j-1\n8.    A[j+1] ← v",
    "options": ["Line 3: v ← A[i], the assignment that starts each pass", "Line 5: the key comparison A[j] > v", "Line 6: A[j+1] ← A[j], the assignment that moves data", "Line 8: A[j+1] ← v"],
    "answer": 1,
    "explain": "Lines 5, 6 and 7 tie on count in the worst case ($\\frac{n(n-1)}{2}$ each) and all sit in the innermost loop, so \"more expensive\" decides. Line 5 is a **key comparison** (comparing data); lines 6 and 7 are an assignment and a subtraction. Slide 37: it is really the key thing being checked in each loop, and data comparisons are often considered more expensive than simple numerical comparisons or assignments."
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
