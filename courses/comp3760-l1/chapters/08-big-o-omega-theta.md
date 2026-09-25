---
title: Big-O, Big-Ω, Big-Θ
minutes: 18
---

[Order of growth](#/comp3760-l1/order-of-growth) ended with a promise: a formal way to say "this function grows no faster than that one". That is what the three asymptotic notations are. The slide title is **Asymptotic order of growth: a way of comparing functions**, and the three tools are **Big O (pronounced "big oh")**, **Big Ω** and **Big Θ**.

## Some functions are essentially the same

Take the fifteen functions from the previous lesson. The instructor draws circles around the ones that are "essentially the same", then nests the circles inside one another ("Even better"). Read from the innermost oval outwards:

| Class | Functions the slide groups together |
|---|---|
| $1$ (constant) | $5!+3^2$, $8675309$, $1+\log_2 6$ |
| $\log n$ | $3\log_2 n+1$, $\log_2 n$ |
| $n$ | $3737n$, $3\log_2 n+n$ |
| $n\log n$ | $4n\log_2 n$ |
| $n^2$ | $4n^2+10$, $n(2n+1)$ |
| $n^3$ | $50n^3+20n+4$, $n^2+3n^3$ |
| $2^n$ | $2^n-1$ |
| $3^n$ | $3^n$ |
| $n!$ | $\log_2 n+9n!$ |

Two things the picture says without words:

- **Inside one oval, the differences are constants and lower-order terms.** $3737n$ and $3\log_2 n + n$ are both "linear": $3737$ is just a constant factor, and $3\log_2 n$ is a term that $n$ outgrows. $1 + \log_2 6$ is a *number* (about 3.58): there is no $n$ in it at all.
- **Each oval sits inside the next.** Constant is inside logarithmic is inside linear, and so on out to $n!$: $1 ⊂ \log n ⊂ n ⊂ n\log n ⊂ n^2 ⊂ n^3 ⊂ 2^n ⊂ 3^n ⊂ n!$. "Inside" means "grows no faster than". Big-O is the formal name for that relationship.

## Big-O in pictures

> $O(g(n))$ is the **set of all functions whose rate of growth is the same as or lower than that of $g(n)$.**

The slide's picture is a shaded region under a curve labelled $O(g(n))$: every function that stays inside the shading belongs to the set. We also say **"$f(n)$ is bounded above by a constant multiple of $g(n)$"**, or (carelessly) just **"$f(n)$ is bounded by $g(n)$"**.

The second picture adds the detail that makes the definition work. A wiggly $f(n)$ pokes above $c \cdot g(n)$ for small $n$, but from a point marked $n_0$ onwards it stays underneath. Before $n_0$ we do not care; after $n_0$ it must always hold.

## Big-O, the formal definition

> A function $f(n)$ is in the set $O(g(n))$ [denoted: $f(n) \in O(g(n))$] if there is a constant $c$ and a positive integer $n_0$ such that
>
> $$f(n) \le c \cdot g(n) \text{ for all } n \ge n_0$$
>
> i.e. $f(n)$ is bounded above by some constant multiple of $g(n)$.

Three parts to keep straight:

- $O(g(n))$ is a **set** of functions, so the correct symbol is $\in$ ("is in"). You will see $f(n) = O(g(n))$ written elsewhere; the slides use $\in$.
- $c$ is allowed to be **any** positive constant. That is what makes constant factors disappear.
- $n_0$ lets you **ignore small inputs**. That is what makes lower-order terms disappear.

## Example: is 2n + 6 in O(n)?

By the definition we need to find a constant $c$ and a constant $n_0$ such that $f(n) \le c \cdot g(n)$ for all $n \ge n_0$. **Many will work.** The slide uses $c = 4$ and $n_0 = 3$:

| $n$ | $f(n) = 2n + 6$ | $c \cdot g(n) = 4n$ | |
|---|---|---|---|
| 1 | 8 | 4 | no |
| 2 | 10 | 8 | no |
| 3 | 12 | 12 | yes |
| 4 | 14 | 16 | yes |
| 5 | 16 | 20 | yes |
| 6 | 18 | 24 | yes |

"**Looks good from here down**", the slide says beside $n = 3$: once $4n$ has caught up it grows twice as fast as $2n + 6$, so it never falls behind again. Therefore $f(n) \in O(n)$.

You can also do it with algebra: $2n + 6 \le 4n$ exactly when $6 \le 2n$, that is $n \ge 3$. So $n_0 = 3$ is the smallest that works with $c = 4$.

```widget
big-o-check
{ "f": "2n+6", "g": "n", "c": 4, "n0": 3, "mode": "O", "presets": false, "title": "Is 2n + 6 in O(n)? The slide's c = 4, n0 = 3; move the sliders and watch where it breaks" }
```

Try these on the sliders:

- **$c = 3$.** Now $2n + 6 \le 3n$ needs $n \ge 6$, so $n_0 = 3$ fails but $n_0 = 6$ works. Different pair, same conclusion.
- **$c = 2$.** $2n + 6 \le 2n$ is never true. A $c$ that is too small can never be rescued by a bigger $n_0$. Any $c > 2$ works.
- **$g(n) = n^2$.** With $c = 1$ and $n_0 = 4$ ($2n + 6 \le n^2$ from $n = 4$ on), $2n + 6 \in O(n^2)$ as well. That is correct and important: see the callout below.

## The simple rule

The definition is what a proof needs. For a quiz, the slide gives the shortcut: **drop lower order terms and constant factors.**

| Function | Class |
|---|---|
| $50n^3 + 20n + 4$ | $\in O(n^3)$ |
| $4n^2 + 10$ | $\in O(n^2)$ |
| $n(2n + 1)$ | $\in O(n^2)$ |
| $3\log n + 1$ | $\in O(\log n)$ |
| $3\log n + n$ | $\in O(n)$ |
| $1 + \log 6$ | $\in O(1)$ |
| $5! + 3^2$ | $\in O(1)$ |

The procedure, in the order the slide's examples need it:

1. **Multiply out** if needed: $n(2n + 1) = 2n^2 + n$.
2. **Keep the fastest-growing term**, using the nesting order: $n$ beats $\log n$, $n^2$ beats $n$, $2^n$ beats every power of $n$.
3. **Drop its constant factor**: $2n^2 \to n^2$, $3\log n \to \log n$.
4. **No $n$ at all means constant**: $1 + \log 6$ and $5! + 3^2 = 129$ are just numbers, so they are $O(1)$.

## Big-Ω: bounded below

> $\Omega(g(n))$ is the **set of all functions whose rate of growth is the same as or higher than that of $g(n)$.**

> A function $f(n)$ is in the set $\Omega(g(n))$ [denoted: $f(n) \in \Omega(g(n))$] if there is a constant $c$ and a positive integer $n_0$ such that
>
> $$f(n) \ge c \cdot g(n) \text{ for all } n \ge n_0$$
>
> i.e. $f(n)$ is **bounded below** by some constant multiple of $g(n)$.

Same shape as Big-O with the inequality flipped. In the picture the shading is now *above* $c \cdot g(n)$, and from $n_0$ on, $f(n)$ stays up in it. Switch the widget above to Ω mode: $2n + 6 \ge 2n$ for every $n$, so $c = 2$, $n_0 = 1$ shows $2n + 6 \in \Omega(n)$.

## Big-Θ: bounded both ways

> $Θ(g(n))$ is the **set of all functions that have the same rate of growth as $g(n)$.**

> A function $f(n)$ is in the set $Θ(g(n))$ [denoted: $f(n) \in Θ(g(n))$] if there are constants $c_1$ and $c_2$, and a positive integer $n_0$ such that
>
> $$c_2 \, g(n) \le f(n) \le c_1 \, g(n) \text{ for all } n \ge n_0$$
>
> i.e. $f(n)$ is **bounded both above and below** by constant multiples of $g(n)$.

The picture is a band: $c_1 g(n)$ on top, $c_2 g(n)$ underneath, and $f(n)$ trapped between them from $n_0$ on. Being in $Θ(g(n))$ is exactly being in both $O(g(n))$ and $\Omega(g(n))$. For $2n + 6$: upper constant $c_1 = 4$ (from $n_0 = 3$), lower constant $c_2 = 2$ (from $n_0 = 1$), so with $n_0 = 3$ both hold and $2n + 6 \in Θ(n)$. Θ mode in the widget shows both lines at once; `c` is the upper constant $c_1$ and `c2` the lower one.

## Summary of the three notations

The slide's "intuition" summary is the version to memorize:

| Notation | Picture | Intuition |
|---|---|---|
| Big-O | $f(n)$ stays **under** $c \cdot g(n)$ from $n_0$ on | execution will take **at MOST** that long |
| Big-Ω | $f(n)$ stays **above** $c \cdot g(n)$ from $n_0$ on | execution will take **at LEAST** that long |
| Big-Θ | $f(n)$ stays **between** $c_2 g(n)$ and $c_1 g(n)$ | execution will take **THAT** long |

**In general, we will usually focus on Big-O.** Why? It **focuses on worst-case efficiency** (the case we agreed to analyze in [Best, worst and average case](#/comp3760-l1/best-worst-average)), and it is the **most common when people talk about algorithms.**

:::quiz Big-O is an upper bound, so it can be loose
Because $O(g(n))$ is "everything that grows no faster than $g$", a slow function belongs to every bigger set too: $n \in O(n)$, and also $n \in O(n^2)$, $n \in O(2^n)$, all **true**. What is **false** is the other direction: $n^2 \in O(n)$ cannot hold, because no constant $c$ makes $n^2 \le cn$ for all large $n$.

When a question asks for *the efficiency class* of a function it wants the **tight** one, the smallest oval the function fits in: the class of $3n^2 + 5$ is $O(n^2)$, not $O(n^3)$, even though $3n^2 + 5 \in O(n^3)$ is technically true. Θ is the notation that says "tight" explicitly.
:::

## Four functions to classify

The slide's "Examples" pair each function with its class:

| Function | Efficiency class | Why |
|---|---|---|
| $10n$ | $O(n)$ | drop the constant factor 10 |
| $5n^2 + 20$ | $O(n^2)$ | drop $+20$ and the factor 5 |
| $10000n + 2^n$ | $O(2^n)$ | $2^n$ outgrows $10000n$ (at $n = 20$ they are $10^6$ against $2 \cdot 10^5$); drop the linear term |
| $\log(n) \cdot (1 + n)$ | $O(n \log n)$ | multiply out: $\log n + n\log n$; drop the smaller $\log n$ |

The third one is the trap: the huge constant $10000$ makes the linear term win for small $n$, but "small" ends around $n = 18$, and after that $2^n$ doubles every step while $10000n$ only adds $10000$.

```widget
big-o-check
{ "f": "10000n + 2^n", "g": "2^n", "c": 2, "n0": 20, "mode": "O", "presets": true, "title": "10000n + 2^n in O(2^n): with c = 2 the bound holds from n = 18 on; try the other presets and the Ω and Θ modes" }
```

Type your own into the boxes: `5n^2 + 20` against `n^2` (try $c = 6$, $n_0 = 5$), `log(n)(1+n)` against `n log n` (try $c = 2$, $n_0 = 2$), or `3 log n + n` against `n`.

## The three examples, now with classes

The lecture closes by returning to the three analyses from earlier, each finished with its class:

- **Find the max element in a list.** Input size $n$ (number of list items); basic operation: comparison. $C(n) = \sum_{i=1}^{n-1} 1 = n - 1 \in O(n)$.
- **Multiplication of two matrices.** Input size: matrix dimension; basic operation: multiplication of two numbers. $C(n) = \sum_{i=0}^{n-1}\sum_{j=0}^{n-1}\sum_{k=0}^{n-1} 1 = n^3 \in O(n^3)$.
- **Element uniqueness.** Input size $n$; basic operation: the comparison in the innermost loop; worst case $C(n) = \frac{n^2}{2} - \frac{n}{2} \in O(n^2)$ (the full simplification is in [Setting up and simplifying the sums](#/comp3760-l1/counting-with-sums)).

Notice how the last line of every analysis is the simple rule in action: $n - 1 \to n$, $\frac{n^2}{2} - \frac{n}{2} \to n^2$.

## Try it

```quiz
[
  {
    "q": "What is the efficiency class of $10000n + 2^n$?",
    "options": ["$O(n)$", "$O(n^2)$", "$O(2^n)$", "$O(n \\log n)$"],
    "answer": 2,
    "explain": "$2^n$ is the fastest-growing term, so the class is $O(2^n)$. The constant 10000 only decides where the crossover happens (around $n = 18$), not which term wins in the end."
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
    "explain": "Both constants matter: $c$ absorbs constant factors and $n_0$ lets small inputs be ignored. Without $n_0$, $2n + 6 \\le 4n$ would fail at $n = 1$ and $n = 2$. The last option, with $\\ge$, is the Big-Ω definition."
  },
  {
    "q": "To show $2n + 6 \\in O(n)$ with $c = 4$, what is the smallest $n_0$ that works?",
    "options": ["1", "2", "3", "6"],
    "answer": 2,
    "explain": "$2n + 6 \\le 4n$ is the same as $6 \\le 2n$, i.e. $n \\ge 3$. The slide's table shows it: at $n = 2$, $10 > 8$ (fails); at $n = 3$, $12 \\le 12$ (holds), and it 'looks good from here down'."
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
