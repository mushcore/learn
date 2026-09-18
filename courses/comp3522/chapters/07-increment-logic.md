---
title: ++/--, relational & logical operators
minutes: 15
---

Three more operator families the quiz will test: increment/decrement, relational (comparison), and logical.

## Pre vs post

The slide's own reminder:

```cpp
int x;
x++; //post
++x; //pre
```

- **`x++` (postfix)**: use the **current** value of `x` in the surrounding expression, **then** increment it.
- **`++x` (prefix)**: increment `x` **first**, then use the new value.

Predict what each program prints before you run it — both start with `x = 5`:

```cpp run
#include <iostream>

int main()
{
    int x = 5;
    std::cout << x++ << ' ' << x << std::endl;
    return 0;
}
```

```cpp run
#include <iostream>

int main()
{
    int x = 5;
    std::cout << ++x << ' ' << x << std::endl;
    return 0;
}
```

The first program prints `5 6` — the first `<<` grabs the old `x` (5) and increments as a side effect; by the time the second `<<` runs, `x` is already 6. The second prints `6 6` because `x` is incremented *before* it is used at all.

Step through it here — the default expression combines both increments on the same variable in one line:

```widget
expr-stepper
{ "expr": "x++ + ++x", "env": { "x": 3 }, "presets": ["x++ + ++x", "++x + x++", "x-- - --x"] }
```

:::warn Don't write this in real code
`x++ + ++x` modifies `x` twice with no defined order between the two operands of `+`. The stepper gives you one deterministic answer for practice, but real compilers are allowed to produce different results for this exact expression — it's undefined behaviour. Never modify the same variable twice in one expression like this outside a classroom example.
:::

## Relational operators

Six of them, and they all produce a `bool`:

| Operator | Meaning |
|---|---|
| `==` | equal to |
| `!=` | not equal to |
| `>` | greater than |
| `>=` | greater than or equal to |
| `<` | less than |
| `<=` | less than or equal to |

```cpp run
#include <iostream>

int main()
{
    int a = 5, b = 3;
    std::cout << (a > b) << std::endl;                        // 1
    std::cout << std::boolalpha << (a > b) << std::endl;       // true
    std::cout << std::boolalpha << (5 == 5.0) << std::endl;    // true
    return 0;
}
```

`bool` values print as `1` / `0` by default. `std::cout << std::boolalpha` switches `cout` to print `true` / `false` instead — it changes **how output is displayed**, not the underlying value.

## Logical operators and short-circuit evaluation

```cpp run pin ShortCircuit.cpp
// predict: Write the exact lines printed (which checking lines appear?).
#include <iostream>
#include <string>

bool loud(bool value, std::string label)
{
    std::cout << "checking " << label << std::endl;
    return value;
}

int main()
{
    std::cout << std::boolalpha;
    std::cout << (loud(false, "left") && loud(true, "right")) << std::endl;
    std::cout << (loud(true, "left") || loud(true, "right")) << std::endl;
    return 0;
}
```

```tokens
[
  { "token": "&&", "line": 13, "story": "`&&` **short-circuits**: because the left operand `loud(false, \"left\")` is `false`, the whole expression is already `false`, so `loud(true, \"right\")` is never called at all — `right` never gets checked.", "swap": { "with": "&", "why": "`&` is the **bitwise AND** operator, not a logical one. Streamed onto two `bool`s it still works (they convert to `0`/`1`), but it does **not** short-circuit — both operands are always evaluated first, so `loud(true, \"right\")` now runs and prints `checking right` even though the left side is already `false`." } }
]
```

| Operator | Meaning |
|---|---|
| `!` | logical NOT |
| `&&` | logical AND |
| `\|\|` | logical OR |

`&&` and `\|\|` **short-circuit**: the right-hand side is only evaluated if it can change the answer.

`std::cout << (loud(false, "left") && loud(true, "right")) << std::endl;` calls `loud(false, "left")` first. That call runs `std::cout << "checking " << label << std::endl;`, printing `checking ` followed by the label, and `return value;` hands back `false`. Because the left side of `&&` is `false`, the whole expression must be `false`, so `loud(true, "right")` is never called — `right` never gets checked. The next line, `std::cout << (loud(true, "left") || loud(true, "right")) << std::endl;`, tells the same story for `||`: `loud(true, "left")` returns `true`, so the right side is skipped.

:::quiz `=` is not `==`
`if (x = 10)` **compiles**. It assigns `10` to `x`, and then tests the assigned value for truthiness (non-zero is true), so the branch runs every time unless you assign `0`. This is one of the most common real bugs in C and C++\.

```cpp run
#include <iostream>

int main()
{
    int x = 5;
    if (x = 10)
    {
        std::cout << "x is now " << x << std::endl;
    }
    return 0;
}
```
:::

```quiz
[
  {
    "q": "What does this print?",
    "code": "int x = 5;\nstd::cout << x++ << ' ' << x;",
    "options": ["5 5", "5 6", "6 6", "6 5"],
    "answer": 1,
    "explain": "Postfix `x++` uses the current value (5) first, then increments. By the second `<<`, x is 6."
  },
  {
    "q": "What does this print?",
    "code": "int x = 5;\nstd::cout << ++x << ' ' << x;",
    "options": ["5 6", "6 6", "5 5", "6 5"],
    "answer": 1,
    "explain": "Prefix `++x` increments first; x is already 6 for both reads."
  },
  {
    "q": "`x++` increments `x` immediately and then returns the new value.",
    "type": "tf",
    "answer": false,
    "explain": "That describes `++x` (prefix). Postfix `x++` returns the OLD value and increments as a side effect."
  },
  {
    "q": "What does this print?",
    "code": "int a = 5, b = 3;\nstd::cout << (a > b);",
    "options": ["true", "1", "false", "0"],
    "answer": 1,
    "explain": "`bool` results print as 1 or 0 unless the stream has `boolalpha` set. `a > b` is true, printed as `1`."
  },
  {
    "q": "What does this print?",
    "code": "std::cout << std::boolalpha << (5 == 5.0);",
    "options": ["true", "1", "false", "compile error"],
    "answer": 0,
    "explain": "5 (int) compares equal to 5.0 (double) after promotion, and boolalpha makes cout print `true` instead of `1`."
  },
  {
    "q": "In `a && b`, if `a` evaluates to `false`, `b` is never evaluated.",
    "type": "tf",
    "answer": true,
    "explain": "Short-circuit evaluation: once the left side of `&&` is false, the result must be false, so the right side is skipped."
  },
  {
    "q": "In `a || b`, if `a` evaluates to `true`, `b` is never evaluated.",
    "type": "tf",
    "answer": true,
    "explain": "Short-circuit evaluation: once the left side of `||` is true, the result must be true, so the right side is skipped."
  },
  {
    "q": "What is wrong with `if (x = 10) { ... }` when the programmer meant to check whether `x` equals `10`?",
    "options": ["Nothing — it works correctly", "It's an assignment, not a comparison — it sets x to 10 and the branch runs (10 is truthy)", "It fails to compile", "It only compiles when x is a pointer"],
    "answer": 1,
    "explain": "`=` assigns and evaluates to the assigned value. The programmer wanted `==`. This is a classic bug and quiz trap."
  },
  {
    "q": "Which of these are relational operators? (select all)",
    "options": ["`>=`", "`&&`", "`!=`", "`<=`"],
    "answer": [0, 2, 3],
    "explain": "`&&` is a logical operator, not relational. `>=`, `!=`, `<=` compare two values and produce a bool."
  }
]
```
