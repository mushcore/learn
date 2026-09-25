---
title: find, and why fib needs a better algorithm
minutes: 12
---

Two worked examples from the slides. `find` is the algorithm the whole module keeps coming back to: small enough to count every statement by hand. `fib` is the motivation: two correct algorithms for the same problem, one of which becomes unusable within seconds.

## find: read it first

```pseudo
1. Algo: find( A[0…n-1] )
2.    m ← A[0]
3.    for i ← 1 to n-1 do
4.       if A[i] > m
5.          m ← A[i]
6.    return m
```

The slide asks only: **what does it do?** Walk it with a small array before reading on: `A = 5 2 4 6 1 3`.

`m` starts as `A[0]`. Each later element is compared with `m`, and whenever it is bigger it replaces `m`. When the loop ends, `m` is the biggest thing seen. **It finds the largest element of an array.**

## Correctness

The slide asks three questions about `find`:

- Will `find` work correctly?
- **for any possible input?** (how many are there?)
- **within a finite amount of time?**

And then: *how would you argue this rigorously?* The lecture leaves it as a question. A short argument: after the loop has looked at `A[i]`, `m` is the largest of `A[0..i]` (true before the loop for `i = 0`, and each iteration keeps it true). The loop runs exactly $n - 1$ times, so it finishes, and it finishes with `m` equal to the largest of `A[0..n-1]`. That covers every input of every size, which is what "any legitimate input" demands. The number of possible inputs is unlimited, so testing a few can never replace an argument.

## Time efficiency

> Is `find` a time-efficient algorithm? **Seems good.** To find the largest, you need to **check each array element exactly once.**

Any algorithm that finds the largest element of an unsorted array has to look at every element (skip one and it could be the maximum). `find` looks at each exactly once, so nothing can do fundamentally less work.

## Space efficiency

> Is `find` a space-efficient algorithm? (amount of memory) **Again, it seems reasonable.** **Two temp variables introduced.**

The two are `m` and `i`. `find` does not copy the array or build anything that grows with $n$; the extra memory is the same two variables whether $n$ is 3 or 3 million.

:::quiz Space efficiency counts extra memory
A true/false item like "find is not space-efficient because it stores a copy of the array" is false. It introduces two temporary variables and nothing else. The input array itself is not counted against the algorithm.
:::

## Variation of the problem

> What if you are guaranteed that `A` is **pre-sorted**? Is this `find()` algorithm still efficient? **Could you do better?**

Yes. If the array is sorted in ascending order, the largest element is the last one: `return A[n-1]`. That is one step no matter how big $n$ is. `find` still gives the right answer on a sorted array, but it does $n - 1$ comparisons to discover something the guarantee already told you.

This is the lesson's point about problems versus algorithms: change the problem (add a guarantee about the input) and a different algorithm becomes the efficient one.

## Why do we care? fib

Computing the $n$-th Fibonacci number: 0, 1, 1, 2, 3, 5, 8, 13, …

**First algorithm**, straight from the definition:

```pseudo
Algo: fib( n )
   if n ≤ 1
      return n
   else
      return fib( n-1 ) + fib( n-2 )
```

```java
public static int fib(int n)  {
   if (n<=1)
      return n;
   else
      return ( fib(n-1) + fib(n-2) );
}
```

**Second algorithm**, building up from the bottom in an array:

```pseudo
Algo: fib2( n )
   F[0] ← 0; F[1] ← 1;
   for i ← 2 to n do
      F[i] ← F[i-1] + F[i-2]
   return F[n]
```

```java
public static int fib2(int n) {
   int[] f = new int[n+1];
   f[0] = 0;
   f[1] = 1;
   for (int i=2; i<=n; i++)
       f[i] = f[i-1] + f[i-2];
   return f[n];
}
```

Both are correct. The instructor timed them:

| N | Fib1 (ms) | Fib2 (ms) |
|---|---|---|
| 30 | 9 | 0 |
| 31 | 11 | 0 |
| 32 | 22 | 0 |
| 33 | 83 | 0 |
| 34 | 90 | 0 |
| 35 | 148 | 0 |
| 36 | 237 | 0 |
| 37 | 429 | 0 |
| 38 | 722 | 0 |
| 39 | 1105 | 0 |
| 40 | 1627 | 0 |

The difference, in the slide's words:

- **First approach**: recursively calls the Fib function **over and over again**.
- **Second approach**: **stores successive results so we don't have to re-compute them.**
- **Very soon the second approach is much, much faster.**

Look at where the time goes. `fib(5)` calls `fib(4)` and `fib(3)`; `fib(4)` calls `fib(3)` again and `fib(2)`; every `fib(3)` calls `fib(2)` again… The same small subproblems are recomputed an enormous number of times. `fib2` computes each `F[i]` exactly once.

```widget
fib-race
{ "n": 6, "title": "fib vs fib2: how much work each one does" }
```

Push `n` up. The call count for `fib` roughly multiplies by 1.6 every time `n` goes up by one (the timing column does the same: 9, 11, 22, …, 1627 ms), while `fib2` adds one loop iteration.

## So?

> **Fib is a basic example of why we care about algorithm efficiency.** A well thought out algorithm can run **much faster**. There can be **big variation** in efficiency.

The next lesson, [Counting statements](#/comp3760-l1/counting-statements), turns "much faster" into something you can compute from the pseudocode before writing a line of Java.

## Try it

```quiz
[
  {
    "q": "What does this algorithm do?",
    "code": "Algo: find( A[0…n-1] )\n   m ← A[0]\n   for i ← 1 to n-1 do\n       if A[i] > m\n          m ← A[i]\n   return m",
    "options": ["It sorts the array", "It finds the largest element of the array", "It finds the position of the largest element", "It finds the smallest element of the array"],
    "answer": 1,
    "explain": "m starts as A[0] and is replaced whenever a bigger element is found, so the return value is the largest element. (It returns the value m, not the index i, so option 3 is wrong.)"
  },
  {
    "q": "For an array of n = 8 elements, how many times does `find` evaluate the comparison `A[i] > m`?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "The loop runs i = 1 to n−1, which is n − 1 = 7 iterations, and the comparison happens once per iteration. Each element after A[0] is checked exactly once."
  },
  {
    "q": "`find` is not space-efficient because it stores a copy of the array.",
    "type": "tf",
    "answer": false,
    "explain": "False. The slide says two temp variables are introduced (m and i) and calls that reasonable. Nothing is copied and the extra memory does not grow with n."
  },
  {
    "q": "You are guaranteed that A is pre-sorted in ascending order. What is the most efficient way to get the largest element?",
    "options": ["Run find(A) unchanged", "return A[n-1]", "return A[0]", "Sort A again, then return A[n-1]"],
    "answer": 1,
    "explain": "In an ascending sorted array the largest element is the last one, so `return A[n-1]` is one step for any n. find still works but does n − 1 unnecessary comparisons; A[0] would be the smallest."
  },
  {
    "q": "According to the lecture, why is fib2 so much faster than the recursive fib?",
    "options": ["Java arrays are faster than recursion in general", "It stores successive results so it does not have to re-compute them", "It uses fewer variables", "It only computes even-numbered Fibonacci numbers"],
    "answer": 1,
    "explain": "The recursive fib calls the Fib function over and over again on the same subproblems; fib2 stores successive results in F so each value is computed once. That is the slide's stated difference."
  },
  {
    "q": "How many calls to `fib` (including the first one) happen when the recursive `fib(5)` runs?",
    "code": "Algo: fib( n )\n   if n ≤ 1\n      return n\n   else\n      return fib( n-1 ) + fib( n-2 )",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "calls(0) = calls(1) = 1, and calls(n) = 1 + calls(n−1) + calls(n−2): calls(2) = 3, calls(3) = 5, calls(4) = 9, calls(5) = 15. Fifteen calls to produce fib(5) = 5, most of them recomputing fib(3), fib(2) and fib(1)."
  },
  {
    "q": "The recursive `fib` and `fib2` return the same value for every n ≥ 0.",
    "type": "tf",
    "answer": true,
    "explain": "Both are correct algorithms for the same problem; they differ in time efficiency, not in the answer. That is the point of \"there is always more than one algorithm for the same problem\"."
  },
  {
    "q": "From the instructor's timing table, how long did the recursive Fib1 take for N = 40?",
    "options": ["9 ms", "148 ms", "722 ms", "1627 ms"],
    "answer": 3,
    "explain": "1627 ms at N = 40, up from 9 ms at N = 30. Fib2 took 0 ms for every N in the table."
  },
  {
    "q": "Of the three characteristics the lecture cares about, which one does the recursive `fib` fail?",
    "options": ["Correctness", "Time efficiency", "Space efficiency", "It fails none of them"],
    "answer": 1,
    "explain": "It is correct and it only uses a few variables per call, but it recomputes the same values over and over, so it is not time-efficient: 1627 ms for N = 40 and climbing fast."
  },
  {
    "q": "How many times does the loop body `F[i] ← F[i-1] + F[i-2]` execute in `fib2(10)`?",
    "code": "Algo: fib2( n )\n   F[0] ← 0; F[1] ← 1;\n   for i ← 2 to n do\n      F[i] ← F[i-1] + F[i-2]\n   return F[n]",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "i runs from 2 to 10 inclusive: 10 − 2 + 1 = 9 iterations. In general fib2 does n − 1 additions, one per array cell above F[1]."
  }
]
```
