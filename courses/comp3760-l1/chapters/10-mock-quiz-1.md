---
title: Mock Quiz 1 (Lecture 1)
minutes: 25
---

Quiz 1 covers **Lecture 1**: the definition of an algorithm, time and space efficiency, the basic operation and its tie-breakers, counting how many times it runs, best and worst case, orders of growth, and Big-O, Big-Ω and Big-Θ. The real quiz is **one take only, timed, closed-everything**, and it is **multiple choice over short pseudocode**. The first five questions here are in exactly the instructor's style: *is this a valid algorithm?*, *what is the basic operation?*, *how many times is it performed?* The rest cover the remaining slides in the same format.

One sitting, no notes. Every explanation names the slide fact the question was built from.

:::tip How to read a "basic operation" question
Three checks, in order. **Which line runs the most as n grows?** Constant loops (1 to 10, 1 to 5) do not grow, so their bodies are out no matter how big the constant is. **Ties?** Deepest inside the loop first, then the tie-breaker list: function calls, key comparisons, assignments, expression evaluations; multiplication and division before addition and subtraction. **One answer.** An algorithm has one basic operation; "this code has two basic operations" is always a distractor.
:::

```quiz
[
  {
    "q": "Is this a valid algorithm?",
    "code": "Algorithm ReturnTheBiggest(x, y)\n    if x > y then\n        return x\n    else if y > x then\n        return y\n    else\n        // deliberate infinite loop\n        // do not return at all\n        // if x&y are equal\n        while true\n            ;\n    end-if-else\nEND",
    "options": ["Yes", "No"],
    "answer": 1,
    "explain": "No. The definition requires a required output **for any legitimate input in a finite amount of time**. Equal inputs are legitimate (nothing rules them out), and for them the program loops forever and never produces an output. The instructions are unambiguous and it works for x ≠ y, but one failing input is enough."
  },
  {
    "q": "What is the basic operation in the following algorithm?",
    "code": " 1. Algorithm DoSomething(N)\n 2.   s = 0\n 3.   t = 0\n 4.   u = 0\n 5.   for i = 1 to 10 do\n 6.       for j = 1 to 10 do\n 7.           s = s + i\n 8.       endfor\n 9.   endfor\n10.   for x = 1 to N do\n11.       t = t + x\n12.   endfor\n13.   for p = 1 to N do\n14.       u = u * max(s, t)\n15.   endfor\n16. END",
    "options": ["Line 5: for loop with index i", "Line 7: Assignment statement with s", "Line 11: Assignment statement with t", "Line 14: Assignment statement with u"],
    "answer": 3,
    "explain": "Line 7 runs exactly 100 times whatever N is (10 × 10), so it does not grow with the input and cannot be the basic operation. Lines 11 and 14 both run N times: a tie. The tie-breakers decide it: line 14 makes a **function call** (max) and does a **multiplication**; line 11 only adds. Function calls sit at the top of the list and multiplication beats addition, so line 14."
  },
  {
    "q": "How many times is the basic operation performed in the following algorithm?",
    "code": "Algorithm UnusualAdd(A[n], B[n])\n    C = new array[n]\n    for i = 0 to n-1 do\n        if A[n]==B[n] then\n            C[i] = A[i]\n        else\n            C[i] = A[i] + B[i]\n        endif\n    endfor\nEND",
    "options": ["n", "n/2", "2n", "n^2"],
    "answer": 0,
    "explain": "One loop, i from 0 to n − 1, is **n** passes. The basic operation is the comparison in the if (or, if you prefer, the assignment that follows it); either way it runs once per pass. Exactly one of the two branches runs each time, so the assignments also total n, never 2n. That the comparison is A[n]==B[n] (the same out-of-range pair every pass) is a distraction; it changes nothing about the count."
  },
  {
    "q": "What is the basic operation in the pseudocode fragment shown here?",
    "code": " 1. j = 0\n 2. i = n\n 3. while i > 0 do\n 4.    j = j+1\n 5.    if j > 0 then\n 6.       x = i\n 7.       while x > 0\n 8.          x = x - j\n 9.       end-while\n10.    end-if\n11.    i = i/2\n12. end-while",
    "options": ["Line 3 - while loop/condition", "Line 4 – assignment statement j=j+1", "Line 5 – if statement/condition", "Line 8 – assignment statement x=x-j"],
    "answer": 3,
    "explain": "Line 8 is the **deepest** statement, inside both while loops, and it runs the most. The outer loop halves i each pass, so lines 3, 4, 5, 6 and 11 run only about log₂ n times; but on the very first pass alone (j = 1) line 8 runs n times, counting x down from n. Deepest and most frequent: line 8."
  },
  {
    "q": "What is the basic operation in the pseudocode fragment shown here?",
    "code": " 1.  Algorithm CountSomething(int N)\n 2.      A = new array[1..N]\n 3.      for i = 1 to N do\n 4.          sum1 = 0\n 5.          for j = 1 to i do\n 6.              sum1 = sum1 + j\n 7.          endfor\n 8.          A[i] = sum1\n 9.      endfor\n10.      sum2 = 0\n11.      for i = 1 to N do\n12.          sum2 = sum2 + A[i]\n13.      endfor\n14.      return sum2\n15.  END",
    "options": ["Line 3 - outer loop of double for loop", "Line 5 - inner loop of double for loop", "Line 6 - sum1 assignment statement", "Line 12 - sum2 assignment statement", "This code has two basic operations - Line 6 & Line 12"],
    "answer": 2,
    "explain": "Line 6 sits inside the double loop and runs 1 + 2 + … + N = **N(N + 1) / 2** times. Line 12 runs only N times. The basic operation is **the statement that gets executed most frequently**, singular; an algorithm has one, so the last option is a distractor. Lines 3 and 5 are loop headers, and the assignment inside the inner loop beats them on the tie-breakers anyway."
  },
  {
    "q": "An algorithm's step 3 reads: \"choose a good pivot from the array\". Which part of the definition of an algorithm does this violate?",
    "options": ["a sequence of unambiguous instructions", "for obtaining a required output", "for any legitimate input", "in a finite amount of time"],
    "answer": 0,
    "explain": "\"A good pivot\" is not an instruction anyone can carry out the same way twice: it is **ambiguous**. The definition: *a sequence of unambiguous instructions for obtaining a required output for any legitimate input in a finite amount of time*. The other three parts are about outputs, inputs and termination, not about how the steps are written."
  },
  {
    "q": "There is always more than one algorithm for the same problem.",
    "type": "tf",
    "answer": true,
    "explain": "True, slide 8's title is \"There can't be only one\": there is always more than one algorithm for the same problem, and we care about several characteristics: is it correct? time-efficient? space-efficient?"
  },
  {
    "q": "Which of these is NOT one of the algorithm design techniques listed in the lecture?",
    "options": ["Brute force", "Divide and conquer", "Greedy approach", "Sorting"],
    "answer": 3,
    "explain": "Sorting is an **important problem type** (with searching, string processing, graph, combinatorial, numerical and optimization problems). The design techniques are brute force, divide and conquer, decrease and conquer, transform and conquer, space and time tradeoffs, greedy approach, dynamic programming, iterative improvement, backtracking, branch and bound."
  },
  {
    "q": "Why is fib2 (the array version) so much faster than the recursive fib, according to the lecture?",
    "options": ["It stores successive results so we don't have to re-compute them", "It uses integers instead of recursion, and integers are faster", "It only computes even-numbered Fibonacci numbers", "Java optimizes for loops but not recursion"],
    "answer": 0,
    "explain": "The recursive version *recursively calls the Fib function over and over again*, recomputing the same values; fib2 *stores successive results so we don't have to re-compute them*. Very soon the second approach is much, much faster: at N = 40 the slide measured 1627 ms against 0 ms."
  },
  {
    "q": "According to the lecture, the total execution time of an algorithm depends primarily on...",
    "options": ["the number of instructions executed", "the programming language it is written in", "the exact execution time of each specific instruction", "how many variables it declares"],
    "answer": 0,
    "explain": "Slide 24's two facts: running time depends on the **input size**, and total execution time depends primarily on **the number of instructions executed**; different execution times of specific instructions are of secondary importance. That is why we count instructions instead of timing code."
  },
  {
    "q": "For find( A[0…n-1] ) (m ← A[0]; for i ← 1 to n−1 do if A[i] > m then m ← A[i]; return m), the lecture counted every statement and got f(n) = 1 + 3(n − 1) + 1. How many statements execute for n = 8?",
    "type": "numeric",
    "answer": 23,
    "tolerance": 0,
    "explain": "f(8) = 1 + 3 × 7 + 1 = 23, which is 3n − 1 with n = 8. Counting only the basic operation (the comparison A[i] > m) gives n − 1 = 7 instead; both are functions of n, which is the point."
  },
  {
    "q": "How many times is the basic operation executed for input size n?",
    "code": "Mystery2(A[0..n-1][0..n-1])  // n > 0\n S ← 0\n for i ← 0 to n-1 do\n    for j ← 0 to n-1 do\n        S ← S + A[i][j]\n return S",
    "options": ["n", "2n", "n^2", "n(n-1)/2"],
    "answer": 2,
    "explain": "The addition is inside two loops of n each: Σ_{i=0}^{n−1} Σ_{j=0}^{n−1} 1 = Σ_{i=0}^{n−1} n = **n²**. 2n would be two loops one after the other, not nested; n(n−1)/2 is the triangular count of a loop whose inner bound depends on i."
  },
  {
    "q": "Insertion sort (Loops on the slides) in the worst case: how many times is the key comparison A[j] > v executed?",
    "code": "Loops(A[0..n-1])\n  for i ← 1 to n-1 do\n    v ← A[i]\n    j ← i-1\n    while j≥0 and A[j]>v do\n       A[j+1] ← A[j]\n       j ← j-1\n    A[j+1] ← v",
    "options": ["n − 1", "n^2", "(n − 1)n / 2", "n log n"],
    "answer": 2,
    "explain": "For each i the inner loop runs j from i − 1 down to 0, that is i comparisons, so the total is Σ_{i=1}^{n−1} i = **(n − 1)n / 2**. n − 1 is the best case (already sorted: one failed comparison per pass). n² is the right *class* but not the count the quiz asks for."
  },
  {
    "q": "How many times is the basic operation (the division on line 6) executed, as a function of n?",
    "code": "1. Example3(n)\n2.   sum ← 0\n3.   i ← n\n4.   while i ≥ 1\n5.      sum ← sum + 1\n6.      i ← i/2\n7.   return sum",
    "options": ["n", "n/2", "log n", "sqrt(n)"],
    "answer": 2,
    "explain": "i is cut in half every pass, so the loop runs about **log₂ n** times (exactly ⌊log₂ n⌋ + 1 with integer division). Cutting the problem's size by a constant factor on each iteration is the textbook's description of a logarithmic algorithm. n/2 would be *subtracting* 2 each time, not dividing."
  },
  {
    "q": "What is the basic operation in this algorithm? (isSorted looks at every element of A.)",
    "code": "1. Algorithm Check(A[0..n-1])\n2.    count = 0\n3.    for i = 0 to n-1 do\n4.        if isSorted(A) then\n5.            count = count + 1\n6.        endif\n7.    endfor\n8.    return count",
    "options": ["Line 3: the for loop", "Line 4: the call to isSorted(A)", "Line 5: the assignment to count", "Line 8: the return"],
    "answer": 1,
    "explain": "Lines 3, 4 and 5 all run at most n times, so the tie-breaker list decides: **function calls (growing with N)** are number one, and isSorted does work that grows with n. Line 5 is an assignment (number four) and runs at most as often as line 4. The return runs once."
  },
  {
    "q": "Unless otherwise specified, you should always analyze the worst case.",
    "type": "tf",
    "answer": true,
    "explain": "True, slide 54 word for word. We usually focus on worst-case analysis; Big-O is preferred for the same reason. There are many situations where best case = worst case, such as finding the largest element in an unsorted list."
  },
  {
    "q": "Searching for a key K in an unsorted list of n items with sequential search: what are C_best(n) and C_worst(n), counting key comparisons?",
    "options": ["C_best = 1, C_worst = n", "C_best = 0, C_worst = n − 1", "C_best = n, C_worst = n", "C_best = 1, C_worst = n log n"],
    "answer": 0,
    "explain": "If K is the first element, one comparison finds it: C_best(n) = 1. If K is last or absent, every element is compared: C_worst(n) = n. The count *depends on the order of the input*, which is exactly why best, worst and average cases are distinguished."
  },
  {
    "q": "What is the efficiency class of 10000n + 2^n?",
    "options": ["O(n)", "O(n^2)", "O(2^n)", "O(n log n)"],
    "answer": 2,
    "explain": "Drop lower-order terms and constant factors. 2ⁿ grows faster than any polynomial, so 10000n is the lower-order term however big its constant looks: **O(2ⁿ)**. Slide 81."
  },
  {
    "q": "What is the efficiency class of log(n) · (1 + n)?",
    "options": ["O(log n)", "O(n)", "O(n log n)", "O(n^2)"],
    "answer": 2,
    "explain": "Multiply out: log n + n log n. The n log n term dominates, so **O(n log n)**. Slide 81's fourth example."
  },
  {
    "q": "Which statement is the lecture's formal definition of f(n) ∈ O(g(n))?",
    "options": [
      "there is a constant c and a positive integer n₀ such that f(n) ≤ c · g(n) for all n ≥ n₀",
      "there is a constant c and a positive integer n₀ such that f(n) ≥ c · g(n) for all n ≥ n₀",
      "f(n) ≤ g(n) for every n",
      "f(n) and g(n) have the same value for large n"
    ],
    "answer": 0,
    "explain": "Big-O is an **upper** bound: f(n) is bounded above by some constant multiple of g(n) from n₀ onward. The ≥ version is Big-Ω. No constant c and no n₀ is the trap in the third option: 2n + 6 ≤ n is never true, yet 2n + 6 ∈ O(n) with c = 4 and n₀ = 3."
  },
  {
    "q": "n ∈ O(n²).",
    "type": "tf",
    "answer": true,
    "explain": "True. O(n²) is the set of all functions whose rate of growth is the same as **or lower than** n², and n grows more slowly. It is a loose bound, not the *efficiency class* of n (which is O(n)), but the membership statement is true. n² ∈ O(n) would be false."
  },
  {
    "q": "Big-Ω, in the lecture's one-line intuition, means execution will take...",
    "options": ["at MOST that long", "at LEAST that long", "exactly THAT long", "on average that long"],
    "answer": 1,
    "explain": "Big-O: at MOST that long. Big-Ω: at LEAST that long. Big-Θ: THAT long (bounded above and below). Slide 79."
  },
  {
    "type": "match",
    "q": "Match each function to its efficiency class (drop lower-order terms and constant factors).",
    "pairs": [
      ["50n³ + 20n + 4", "O(n³)"],
      ["n(2n + 1)", "O(n²)"],
      ["4n log₂ n", "O(n log n)"],
      ["3 log₂ n + n", "O(n)"],
      ["3 log₂ n + 1", "O(log n)"],
      ["5! + 3²", "O(1)"],
      ["2ⁿ − 1", "O(2ⁿ)"]
    ],
    "explain": "Multiply out where needed (n(2n + 1) = 2n² + n), keep only the fastest-growing term, and throw away its constant. 5! + 3² = 129 has no n at all, so it is constant. 3 log₂ n + n is linear because n beats log n."
  },
  {
    "q": "Which efficiency class does the textbook describe as \"typically characterizes efficiency of algorithms with two embedded loops\"?",
    "options": ["linear", "n-log-n", "quadratic", "cubic"],
    "answer": 2,
    "explain": "Two embedded loops → **quadratic** (n²): elementary sorting algorithms and n-by-n matrix operations. Three embedded loops → cubic. Scanning a list once → linear. Divide-and-conquer such as mergesort → n log n."
  },
  {
    "q": "How many times is the basic operation performed in this fragment?",
    "code": "for i = 1 to n do\n    for j = 1 to 5 do\n        x = x + i * j\n    endfor\nendfor",
    "options": ["n", "5n", "n^2", "5"],
    "answer": 1,
    "explain": "The inner loop always runs 5 times, so the body runs 5 × n = **5n** times. Its class is O(n): the 5 is a constant factor. A constant inner loop never makes an algorithm quadratic."
  },
  {
    "q": "UniqueElements compares A[i] with A[j] for every pair i < j. For n = 6 and an array where all elements are distinct, how many comparisons are made?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "All distinct means no early return, so every pair is compared: n(n − 1)/2 = 6 × 5 / 2 = **15**, which is 5 + 4 + 3 + 2 + 1. That is the worst case; the best case (A[0] = A[1]) is a single comparison."
  }
]
```

:::quiz Scoring yourself
The real quiz drops your lowest score across the term but allows no re-takes, so treat a miss here as the cheapest mistake you will make all week. Anything under 90%: open the lesson the explanation points to, then come back and retake. The review queue on the home page will keep re-asking what you missed until you get it right twice.
:::
