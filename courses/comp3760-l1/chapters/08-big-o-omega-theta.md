---
title: Big-O, Big-Ω, Big-Θ
minutes: 15
---

[Order of growth](#/comp3760-l1/order-of-growth) needs a formal "grows no faster than". Slide 63: **Asymptotic order of growth: a way of comparing functions**, with **Big O (pronounced "big oh")**, **Big Ω** and **Big Θ**.

## Some functions are essentially the same

Slides 64-66 circle the fifteen functions from the previous lesson that are "essentially the same", then nest the circles ("Even better"), innermost first:

- $1$ (constant): $5!+3^2$, $8675309$, $1+\log_2 6$
- $\log n$: $3\log_2 n+1$, $\log_2 n$
- $n$: $3737n$, $3\log_2 n+n$
- $n\log n$: $4n\log_2 n$
- $n^2$: $4n^2+10$, $n(2n+1)$
- $n^3$: $50n^3+20n+4$, $n^2+3n^3$
- $2^n$: $2^n-1$; $3^n$: $3^n$; $n!$: $\log_2 n+9n!$

Inside one oval the differences are constant factors and lower-order terms ($1 + \log_2 6 \approx 3.58$ has no $n$ at all). Each oval sits inside the next, and "inside" means "grows no faster than": Big-O.

## Big-O, the formal definition

Slide 67: $O(g(n))$ is the **set of all functions whose rate of growth is the same as or lower than that of $g(n)$.** We also say **"$f(n)$ is bounded above by a constant multiple of $g(n)$"**, or (carelessly) just **"$f(n)$ is bounded by $g(n)$"**.

> A function $f(n)$ is in the set $O(g(n))$ [denoted: $f(n) \in O(g(n))$] if there is a constant $c$ and a positive integer $n_0$ such that
>
> $$f(n) \le c \cdot g(n) \text{ for all } n \ge n_0$$
>
> i.e. $f(n)$ is bounded above by some constant multiple of $g(n)$.

$O(g(n))$ is a set, hence $\in$. The constant $c$ absorbs constant factors; $n_0$ ignores small inputs, which absorbs lower-order terms.

## Example: is 2n + 6 in O(n)?

We need a constant $c$ and a constant $n_0$ with $f(n) \le c \cdot g(n)$ for all $n \ge n_0$. **Many will work.** Slide 70 uses $c = 4$ and $n_0 = 3$:

| $n$ | $f(n) = 2n + 6$ | $c \cdot g(n) = 4n$ |
|---|---|---|
| 1 | 8 | 4 |
| 2 | 10 | 8 |
| 3 | 12 | 12 |
| 4 | 14 | 16 |
| 5 | 16 | 20 |
| 6 | 18 | 24 |

"**Looks good from here down**", the slide says beside $n = 3$: $4n$ grows twice as fast as $2n + 6$, so $f(n) \in O(n)$. A $c$ that is too small cannot be rescued by a bigger $n_0$: $2n + 6 \le 2n$ never holds.

```widget
big-o-check
{ "f": "2n+6", "g": "n", "c": 4, "n0": 3, "mode": "O", "presets": false, "title": "Is 2n + 6 in O(n)? The slide's c = 4, n0 = 3; move the sliders and watch where it breaks" }
```

## The simple rule

Slide 71: **drop lower order terms and constant factors.** $50n^3 + 20n + 4 \in O(n^3)$; $4n^2 + 10 \in O(n^2)$; $n(2n + 1) \in O(n^2)$; $3\log n + 1 \in O(\log n)$; $3\log n + n \in O(n)$; $1 + \log 6 \in O(1)$; $5! + 3^2 \in O(1)$. Multiply out first ($n(2n + 1) = 2n^2 + n$), keep the fastest-growing term, drop its constant; no $n$ at all means constant ($5! + 3^2 = 129$).

## Big-Ω: bounded below

Slide 72: $\Omega(g(n))$ is the **set of all functions whose rate of growth is the same as or higher than that of $g(n)$.**

> A function $f(n)$ is in the set $\Omega(g(n))$ if there is a constant $c$ and a positive integer $n_0$ such that $f(n) \ge c \cdot g(n)$ for all $n \ge n_0$, i.e. $f(n)$ is **bounded below** by some constant multiple of $g(n)$.

$2n + 6 \ge 2n$ for every $n$, so $c = 2$, $n_0 = 1$ shows $2n + 6 \in \Omega(n)$.

## Big-Θ: bounded both ways

Slide 75: $Θ(g(n))$ is the **set of all functions that have the same rate of growth as $g(n)$.**

> A function $f(n)$ is in the set $Θ(g(n))$ if there are constants $c_1$ and $c_2$, and a positive integer $n_0$ such that $c_2 \, g(n) \le f(n) \le c_1 \, g(n)$ for all $n \ge n_0$, i.e. $f(n)$ is **bounded both above and below** by constant multiples of $g(n)$.

Being in $Θ(g(n))$ is being in both $O(g(n))$ and $\Omega(g(n))$: $2n + 6 \in Θ(n)$ with $c_1 = 4$, $c_2 = 2$, $n_0 = 3$.

Slide 79's intuition: **Big-O: execution will take at MOST that long. Big-Ω: at LEAST that long. Big-Θ: THAT long.** Slide 80: **we will usually focus on Big-O**, because it **focuses on worst case efficiency** and is **most common when people talk about algorithms.**

:::quiz Big-O is an upper bound, so it can be loose
$n \in O(n)$, $n \in O(n^2)$ and $n \in O(2^n)$ are all **true**; $n^2 \in O(n)$ is **false**: no $c$ makes $n^2 \le cn$ for all large $n$. The efficiency class means the tight bound: $3n^2 + 5 \in O(n^3)$, but its class is $O(n^2)$.
:::

## Four functions to classify

Slide 81: $10n \in O(n)$; $5n^2 + 20 \in O(n^2)$; $10000n + 2^n \in O(2^n)$; $\log(n) \cdot (1 + n) \in O(n \log n)$, which multiplies out to $\log n + n\log n$. The third is the trap: $10000n$ is larger for small $n$, but from $n = 18$ on $2^n$ is, and it doubles every step while $10000n$ only adds $10000$.

```widget
big-o-check
{ "f": "10000n + 2^n", "g": "2^n", "c": 2, "n0": 20, "mode": "O", "presets": true, "title": "10000n + 2^n in O(2^n): with c = 2 the bound holds from n = 18 on; try the other presets and the Ω and Θ modes" }
```

Slides 82-85 give the lecture's examples their classes: max element (basic operation **comparison**) $n - 1 \in O(n)$; matrix multiplication (input size **matrix dimensions or total number of elements**, basic operation **multiplication of two numbers**) $n^3 \in O(n^3)$; element uniqueness $\frac{n^2}{2} - \frac{n}{2} \in O(n^2)$ ([the algebra](#/comp3760-l1/counting-with-sums)).

## Bound and classify one new fragment and two new functions

Count `Blend`'s basic operation and name its class, then find the constants that prove two bounds.

```quiz
[
  {
    "type": "spotbug",
    "lang": "pseudo",
    "q": "Click the line that is the basic operation of `Blend`.",
    "code": "Algorithm Blend(A[0..n-1])\n    s ← 0\n    for i ← 0 to n-1 do\n        for j ← 0 to i do\n            s ← s + A[j] * A[i]\n        endfor\n    endfor\n    for k ← 0 to n-1 do\n        s ← s - A[k]\n    endfor\n    return s",
    "answer": 5,
    "explain": "Line 5 runs i + 1 times on pass i, $\\frac{n(n+1)}{2}$ in total; line 9 runs only n times. Count decides before any tie-breaker: line 5 (a multiplication and an addition) is the basic operation."
  },
  {
    "q": "`Blend` is run on n = 10 elements. How many times is line 5 executed?",
    "type": "numeric",
    "answer": 55,
    "tolerance": 0,
    "explain": "$\\sum_{i=0}^{n-1} \\sum_{j=0}^{i} 1 = \\sum_{i=0}^{n-1} (i + 1) = 1 + 2 + \\ldots + 10 = \\frac{10 \\cdot 11}{2} = 55$. Line 9 runs 10 times."
  },
  {
    "type": "text",
    "q": "What is the efficiency class of `Blend`? (write it as O(…))",
    "answer": ["o(n^2)", "o(n²)", "n^2", "n²", "quadratic", "θ(n^2)", "θ(n²)", "o(n*n)"],
    "explain": "C(n) = $\\frac{n(n+1)}{2} = \\frac{n^2}{2} + \\frac{n}{2}$. Drop the lower-order term and the constant factor: O(n²). Even counting line 9 as well, $\\frac{n^2}{2} + \\frac{3n}{2}$ is still O(n²): a sequential linear loop never changes a quadratic class."
  },
  {
    "type": "reorder",
    "lang": "pseudo",
    "q": "Put the proof that 3n + 20 ∈ O(n) in order.",
    "lines": [
      "want: 3n + 20 ≤ c·n for all n ≥ n0",
      "pick c = 5: need 3n + 20 ≤ 5n",
      "subtract 3n from both sides: 20 ≤ 2n",
      "divide by 2: n ≥ 10, so take n0 = 10",
      "so 3n + 20 ∈ O(n) with c = 5 and n0 = 10"
    ],
    "explain": "State the definition, choose a c larger than the leading coefficient 3, solve the inequality for n, read off n₀, conclude. Check at the boundary: n = 10 gives 50 ≤ 50, and n = 9 gives 47 > 45, so n₀ = 10 is the smallest that works for c = 5."
  },
  {
    "q": "To show $n^2 + 30n \\in O(n^2)$ with $c = 2$, what is the smallest $n_0$ that works?",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0,
    "explain": "$n^2 + 30n \\le 2n^2$ is the same as $30n \\le n^2$, i.e. $30 \\le n$ for $n > 0$. At $n = 30$: $900 + 900 = 1800 \\le 1800$. At $n = 29$: $841 + 870 = 1711 > 1682$. So $n_0 = 30$."
  },
  {
    "q": "$n \\log_2 n \\in \\Omega(n)$.",
    "type": "tf",
    "answer": true,
    "explain": "True. Ω needs $f(n) \\ge c \\cdot g(n)$ for all $n \\ge n_0$. With $c = 1$, $n_0 = 2$: $\\log_2 n \\ge 1$ for $n \\ge 2$, so $n \\log_2 n \\ge n$. n log n grows at least as fast as n (it is not in O(n), so it is not in Θ(n))."
  }
]
```

```quiz
[
  {
    "q": "What is the efficiency class of $10000n + 2^n$?",
    "options": ["$O(n)$", "$O(n^2)$", "$O(2^n)$", "$O(n \\log n)$"],
    "answer": 2,
    "explain": "$2^n$ is the fastest-growing term, so the class is $O(2^n)$. The constant 10000 only decides where the crossover happens (at $n = 18$), not which term wins in the end."
  },
  {
    "q": "What is the efficiency class of $\\log(n) \\cdot (1 + n)$?",
    "options": ["$O(\\log n)$", "$O(n)$", "$O(n \\log n)$", "$O(n^2)$"],
    "answer": 2,
    "explain": "Multiply out: $\\log n + n \\log n$. The $n \\log n$ term dominates, so the class is $O(n \\log n)$, exactly as the slide's fourth example."
  },
  {
    "q": "$n \\in O(n^2)$.",
    "type": "tf",
    "answer": true,
    "explain": "True. $O(n^2)$ is the set of all functions that grow no faster than $n^2$, and $n$ certainly qualifies ($n \\le 1 \\cdot n^2$ for all $n \\ge 1$). It is a loose bound, but Big-O only promises an upper bound."
  },
  {
    "q": "$n^2 \\in O(n)$.",
    "type": "tf",
    "answer": false,
    "explain": "False. You would need $n^2 \\le c \\cdot n$ for all $n \\ge n_0$, i.e. $n \\le c$ for all large $n$, which no constant $c$ can satisfy. $n^2$ grows strictly faster than $n$."
  },
  {
    "q": "If $f(n) \\in Θ(g(n))$, then $f(n) \\in O(g(n))$ and $f(n) \\in \\Omega(g(n))$.",
    "type": "tf",
    "answer": true,
    "explain": "True. Θ means bounded both above and below by constant multiples of $g(n)$: the upper half of the sandwich is the Big-O condition and the lower half is the Big-Ω condition."
  },
  {
    "type": "match",
    "q": "Match each function to its efficiency class (drop lower-order terms and constant factors).",
    "pairs": [
      ["$50n^3 + 20n + 4$", "$O(n^3)$"],
      ["$4n^2 + 10$", "$O(n^2)$"],
      ["$3\\log n + n$", "$O(n)$"],
      ["$3\\log n + 1$", "$O(\\log n)$"],
      ["$5! + 3^2$", "$O(1)$"],
      ["$4n\\log_2 n$", "$O(n \\log n)$"],
      ["$\\log_2 n + 9n!$", "$O(n!)$"]
    ],
    "explain": "Keep the fastest-growing term and strip its coefficient. $3\\log n + n$ is linear because $n$ outgrows $\\log n$; $5! + 3^2 = 129$ has no $n$, so it is constant; $9n!$ dwarfs $\\log_2 n$, so the last one is factorial."
  },
  {
    "q": "Which notation says 'execution will take at LEAST that long'?",
    "options": ["Big-O", "Big-Ω", "Big-Θ", "None of them; they all give upper bounds"],
    "answer": 1,
    "explain": "From the slide's intuition summary: Big-O is at MOST that long, Big-Ω is at LEAST that long, Big-Θ is THAT long. Ω is the lower bound: $f(n) \\ge c \\cdot g(n)$ for all $n \\ge n_0$."
  },
  {
    "q": "Which statement is the formal definition of $f(n) \\in O(g(n))$?",
    "options": [
      "There is a constant $c$ and a positive integer $n_0$ such that $f(n) \\le c \\cdot g(n)$ for all $n \\ge n_0$",
      "There is a constant $c$ such that $f(n) \\le c \\cdot g(n)$ for all $n \\ge 1$",
      "$f(n) \\le g(n)$ for all $n$",
      "There is a constant $c$ and a positive integer $n_0$ such that $f(n) \\ge c \\cdot g(n)$ for all $n \\ge n_0$"
    ],
    "answer": 0,
    "explain": "Both constants matter: $c$ absorbs constant factors and $n_0$ lets small inputs be ignored. Without $n_0$, $2n + 6 \\le 4n$ would fail at $n = 1$ and $n = 2$. The version with $\\ge$ is the Big-Ω definition."
  },
  {
    "q": "To show $2n + 6 \\in O(n)$ with $c = 3$ instead of the slide's $c = 4$, what is the smallest $n_0$ that works?",
    "options": ["1", "3", "6", "No $n_0$ works with $c = 3$"],
    "shuffle": false,
    "answer": 2,
    "explain": "$2n + 6 \\le 3n$ is the same as $6 \\le n$, so $n_0 = 6$: at $n = 5$, $16 > 15$; at $n = 6$, $18 \\le 18$. The slide's $n_0 = 3$ belongs to $c = 4$. A different pair, the same conclusion: any $c > 2$ works with a large enough $n_0$."
  },
  {
    "q": "Why does the course usually focus on Big-O rather than Ω or Θ? Select all that apply.",
    "options": [
      "It focuses on worst-case efficiency",
      "It is the most common notation when people talk about algorithms",
      "It gives the exact running time",
      "Ω and Θ cannot be applied to nonrecursive algorithms"
    ],
    "answer": [0, 1],
    "explain": "The slide gives exactly two reasons: Big-O focuses on worst-case efficiency, and it is most common when people talk about algorithms. Big-O is an upper bound, not an exact time (that would be Θ), and Ω and Θ apply to any function."
  },
  {
    "q": "The worst-case count for element uniqueness simplified to $\\frac{n^2}{2} - \\frac{n}{2}$. Its efficiency class is:",
    "options": ["$O(n)$", "$O(n^2)$", "$O(n^3)$", "$O(\\frac{n^2}{2})$"],
    "answer": 1,
    "explain": "Drop the lower-order term $-\\frac{n}{2}$ and the constant factor $\\frac{1}{2}$: $O(n^2)$. Writing $O(\\frac{n^2}{2})$ is not wrong as a set (it is the same set as $O(n^2)$), but the class is always named without constant factors."
  }
]
```
