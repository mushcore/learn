---
title: What an algorithm is (and is not)
minutes: 12
---

Lecture 1 covers textbook sections **1.1, 1.2, 1.3 and 2.1**. The session topics, in the instructor's order:

- Why do we care? What are we doing here?
- Define **algorithm**
- Examine **time efficiency** and **space efficiency**
- Determine the **basic operation** for a given algorithm represented in pseudocode
- Determine the **running time** of an algorithm
- Define asymptotic notations (**big-O**)

This lesson is the first two bullets. The rest of the module is the other four.

## Why we care

- **Algorithms are at the core of computer programming.**
- There are many important, **standard algorithms**.
- We want to **design new algorithms** and **analyze their efficiency**.

That last bullet is the whole course in one line: design, then analyze. Lecture 1 is entirely about the analyzing half.

## The definition

> An **algorithm** is a **sequence of unambiguous instructions** for obtaining a **required output** for **any legitimate input** in a **finite amount of time**.

Memorize it as four requirements, because a quiz question can attack any one of them:

| Requirement | What it rules out |
|---|---|
| a sequence of **unambiguous** instructions | "pick a nice element", "sort it somehow": steps a reader could carry out two different ways |
| obtaining a **required output** | a procedure that runs but never produces the answer the problem asks for |
| for **any legitimate input** | a procedure that works for the inputs you tried but breaks (or is undefined) for some other valid input |
| in a **finite amount of time** | anything that can loop forever for some legitimate input |

The slide draws the picture: a **problem** goes in, the **algorithm** sits inside the "computer", an **input** goes in one side and the **output** comes out the other. The algorithm is the recipe that turns *every* legitimate input for that problem into the required output.

## There can't be only one

> **There is always more than one algorithm for the same problem.**

So we need ways to compare them. The lecture names three characteristics we care about:

- Is it **correct**?
- Is it **time-efficient**?
- Is it **space-efficient**?

Correctness is non-negotiable. Time and space are what the rest of this module measures.

## Problem types and design techniques

Two lists from the slides. You do not analyze them yet; they are the map of the whole course.

**Important problem types** (7):

- Sorting
- Searching
- String processing
- Graph problems
- Combinatorial problems
- Numerical problems
- Optimization problems

**Algorithm design techniques** (10):

- Brute force
- Divide and conquer
- Decrease and conquer
- Transform and conquer
- Space and time tradeoffs
- Greedy approach
- Dynamic programming
- Iterative improvement
- Backtracking
- Branch and bound

:::quiz Problem type or design technique?
"Sorting" is a **problem type**. "Divide and conquer" is a **design technique** (a way of building an algorithm for a problem). A quiz can mix the two lists in one set of options; keep them apart.
:::

## Not a programming course, but pseudocode everywhere

From the course intro: **"This is not a programming course!"** We will certainly write code (labs are in Java), but we are mostly studying the **abstract idea of algorithms**, and *"you may actually need to suspend some of your coding skilz at times."*

To represent, communicate and discuss algorithms we still need a language, and that language is **pseudocode**:

- used **a LOT**: lectures, textbook, quizzes, labs, exams
- expresses basic programming statements: **variables, assignments, expressions, conditional statements, loops, subroutines**
- the **"Common Tongue" of computing**: "everybody" can understand it
- if ever in doubt, ask

Every quiz question in this course is a short piece of pseudocode followed by a question about it. Reading pseudocode quickly and exactly is the skill being tested.

## Is this a valid algorithm?

The first question type. Here is one in the quiz's own style:

```pseudo
Algorithm ReturnTheBiggest(x, y)
    if x > y then
        return x
    else if y > x then
        return y
    else
        // deliberate infinite loop
        // do not return at all
        // if x&y are equal
        while true
            ;
    end-if-else
END
```

Check it against the four requirements. The instructions are unambiguous. For $x > y$ and $y > x$ it returns the required output. But $x = y$ is a **legitimate input** (two equal numbers is a perfectly normal thing to hand this procedure), and for that input it runs `while true` and never returns.

:::quiz Answer: No
It fails **"in a finite amount of time"** (and, as a consequence, never produces the required output for that input). One legitimate input that loops forever is enough to disqualify the whole thing. Do not be distracted by the fact that it works for *most* inputs: the definition says **any** legitimate input.
:::

The general method: for each of the four requirements, try to find one legitimate input that breaks it. If you can, the answer is No.

## What does it do?

Before you can analyze pseudocode you have to be able to read it. The lecture opens with three mystery algorithms and asks only "what does this do?". Work each one before opening the answer.

```pseudo
Algorithm DoSomething()
    count = 0
    do
        x = count+1
        secret = 100*x + 10*x + x
        if secret % 37 == 0
            count++
        endif
    while x < 100
    return count
END
```

`secret` is $100x + 10x + x = 111x$, and $111 = 3 \times 37$, so `secret % 37 == 0` is **true on every pass**. `count` therefore increments every time, `x` walks 1, 2, 3, …, 100, the loop stops when `x` reaches 100, and the algorithm returns **100**. It takes no input at all, so its work is the same every time it runs:

```widget
op-counter
{ "preset": "DoSomething() (no input)", "n": 10, "presets": false, "title": "DoSomething(): the counts do not depend on n" }
```

Move the slider. Nothing changes. An algorithm with no input has no input size, and its running time is a constant.

```pseudo
Algorithm CountSomething2(int n)
    count = 0
    for a = 1 to n do
        for b = 1 to n do
            val = 100*a + b
            if SomeMathLib.isPrime(val)
                count++
            endif
        endfor
    endfor
    return count
END
```

For every pair $(a, b)$ with $1 \le a, b \le n$ it forms the number $100a + b$ and asks a library whether it is prime. It **counts the primes among the numbers $100a + b$**. Note the call to `SomeMathLib.isPrime(val)`: it will matter in [Choosing the basic operation](#/comp3760-l1/basic-operation).

```pseudo
Algorithm CountSomethingElse(int N)
    A = new array[1..N]
    for i = 1 to N do
        sum1 = 0
        for j = 1 to i do
            sum1 = sum1 + j
        endfor
        A[i] = sum1
    endfor
    sum2 = 0
    for i = 1 to N do
        sum2 = sum2 + A[i]
    endfor
    return sum2
END
```

The first loop fills `A[i]` with $1 + 2 + \ldots + i$ (the $i$-th triangular number). The second loop adds them all up. So it returns the **sum of the first $N$ triangular numbers**. This exact algorithm comes back as a quiz question about basic operations, so remember its shape: a double loop where the inner bound is `i`, followed by a single loop.

## Try it

```quiz
[
  {
    "q": "Which of these is NOT one of the four requirements in the lecture's definition of an algorithm?",
    "options": ["A sequence of unambiguous instructions", "Obtaining a required output", "For any legitimate input", "Written in a programming language such as Java"],
    "answer": 3,
    "explain": "The definition: a sequence of unambiguous instructions, for obtaining a required output, for any legitimate input, in a finite amount of time. Algorithms are written in pseudocode in this course; a programming language is never part of the definition."
  },
  {
    "q": "Is this a valid algorithm?",
    "code": "Algorithm ReturnTheBiggest(x, y)\n    if x > y then\n        return x\n    else if y > x then\n        return y\n    else\n        // deliberate infinite loop\n        // do not return at all\n        // if x&y are equal\n        while true\n            ;\n    end-if-else\nEND",
    "options": ["Yes", "No"],
    "answer": 1,
    "explain": "No. When x = y (a legitimate input) it enters `while true` and never returns, so it does not finish in a finite amount of time and never produces the required output for that input. One bad legitimate input is enough."
  },
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that makes ReturnTheBiggest fail the definition for some legitimate input.",
    "code": "Algorithm ReturnTheBiggest(x, y)\n    if x > y then\n        return x\n    else if y > x then\n        return y\n    else\n        while true\n            ;\n    end-if-else\nEND",
    "answer": 7,
    "explain": "Line 7, `while true`, is reached whenever x = y and loops forever. Every other line is a legitimate, unambiguous step that terminates."
  },
  {
    "q": "Is this a valid algorithm?",
    "code": "Algorithm Larger(x, y)\n    if x >= y then\n        return x\n    else\n        return y\n    endif\nEND",
    "options": ["Yes", "No"],
    "answer": 0,
    "explain": "Yes. The instructions are unambiguous, every legitimate input (any pair of numbers, equal or not) reaches a `return`, and it produces the required output, the larger value, in a finite amount of time. The `>=` is what makes the x = y case safe."
  },
  {
    "q": "Is this a valid algorithm?",
    "code": "Algorithm PickOne(A[0..n-1])\n    choose a nice element of A\n    return it\nEND",
    "options": ["Yes", "No"],
    "answer": 1,
    "explain": "No. \"Choose a nice element\" is not an unambiguous instruction: two readers could pick different elements, or none. The definition requires a sequence of unambiguous instructions."
  },
  {
    "q": "What does `DoSomething()` return?",
    "code": "Algorithm DoSomething()\n    count = 0\n    do\n        x = count+1\n        secret = 100*x + 10*x + x\n        if secret % 37 == 0\n            count++\n        endif\n    while x < 100\n    return count\nEND",
    "options": ["0", "1", "37", "100"],
    "answer": 3,
    "explain": "secret = 111x and 111 = 3 × 37, so secret % 37 == 0 on every pass and count increments every time. x runs 1, 2, …, 100, the loop ends when x = 100, and count is 100."
  },
  {
    "q": "There is always more than one algorithm for the same problem.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide titled \"There can't be only one\", and it is why we need to compare algorithms on correctness, time efficiency and space efficiency."
  },
  {
    "q": "Which of these is an algorithm design technique rather than a problem type?",
    "options": ["Sorting", "Graph problems", "Divide and conquer", "Numerical problems"],
    "answer": 2,
    "explain": "Divide and conquer is one of the ten design techniques. Sorting, graph problems and numerical problems are three of the seven important problem types."
  },
  {
    "q": "What does `CountSomethingElse(N)` compute?",
    "code": "Algorithm CountSomethingElse(int N)\n    A = new array[1..N]\n    for i = 1 to N do\n        sum1 = 0\n        for j = 1 to i do\n            sum1 = sum1 + j\n        endfor\n        A[i] = sum1\n    endfor\n    sum2 = 0\n    for i = 1 to N do\n        sum2 = sum2 + A[i]\n    endfor\n    return sum2\nEND",
    "options": ["The sum 1 + 2 + … + N", "The sum of the first N triangular numbers (1) + (1+2) + … + (1+2+…+N)", "N factorial", "The largest element of A"],
    "answer": 1,
    "explain": "The inner loop stores A[i] = 1 + 2 + … + i (the i-th triangular number); the last loop adds A[1] through A[N]. So the result is the sum of the first N triangular numbers."
  },
  {
    "q": "In COMP 3760, pseudocode is used in lectures, the textbook, quizzes, labs and exams.",
    "type": "tf",
    "answer": true,
    "explain": "The intro slide lists exactly those five: lectures, textbook, quizzes, labs, exams. Pseudocode is \"the Common Tongue of computing\"."
  }
]
```
