---
title: ++/--, relational & logical operators
minutes: 15
---

Three more operator families: increment/decrement, relational (comparison), and logical.

## Pre vs post

The slide's own reminder:

```cpp
int x;
x++; //post
++x; //pre
```

- **`x++` (postfix)**: use the **current** value of `x` in the surrounding expression, **then** increment it.
- **`++x` (prefix)**: increment `x` **first**, then use the new value.

Both programs start with `x = 5`:

```cpp run
// predict: Write the line printed.
#include <iostream>

int main()
{
    int x = 5;
    std::cout << x++ << ' ' << x << std::endl;
    return 0;
}
```

```cpp run
// predict: Write the line printed.
#include <iostream>

int main()
{
    int x = 5;
    std::cout << ++x << ' ' << x << std::endl;
    return 0;
}
```

In the first program the first `<<` gets the old `x` and the increment happens as a side effect, so the second `<<` sees the new value. g++ with `-Wall` flags that line with a `-Wsequence-point` warning; since C++17 the operands of `<<` are evaluated left to right, so the output is still defined.

The stepper's default expression combines both increments on one variable:

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
// predict: Write the three lines printed.
#include <iostream>

int main()
{
    int a = 5, b = 3;
    std::cout << (a > b) << std::endl;
    std::cout << std::boolalpha << (a > b) << std::endl;
    std::cout << std::boolalpha << (5 == 5.0) << std::endl;
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

`&&` and `||` **short-circuit**: the right-hand side is only evaluated if it can change the answer. A `false` left side already decides `&&`, and a `true` left side already decides `||`, so in `loud(false, "left") && loud(true, "right")` the question is whether `loud` is called a second time.

:::quiz `=` is not `==`
`if (x = 10)` **compiles**. It assigns `10` to `x`, and then tests the assigned value for truthiness (non-zero is true), so the branch runs every time unless you assign `0`. This is one of the most common real bugs in C and C++.
:::

```cpp run
// predict: x starts at 5. Write the line printed, if any.
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

## Trace increments and short-circuits in four new programs

Track each variable after every statement; for `&&` and `||`, decide whether the right side runs at all.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int a = 4;\n    int b = a++ * 2;\n    int c = ++a * 2;\n    cout << a << ' ' << b << ' ' << c << endl;\n    return 0;\n}",
    "options": [
      "`6 8 12`",
      "`6 10 12`",
      "`5 8 10`",
      "`6 8 10`"
    ],
    "answer": 0,
    "explain": "`a++` yields the old 4 and then makes a 5, so b = 4 × 2 = 8. `++a` makes a 6 first and yields 6, so c = 12. Output: `6 8 12`."
  },
  {
    "type": "numeric",
    "q": "How many times does `check()` run? The program prints the count.",
    "code": "#include <iostream>\nusing namespace std;\n\nint calls = 0;\n\nbool check()\n{\n    ++calls;\n    return true;\n}\n\nint main()\n{\n    int x = 0;\n    if (x > 0 && check()) { }\n    if (x == 0 || check()) { }\n    if (x == 0 && check()) { }\n    cout << calls << endl;\n    return 0;\n}",
    "answer": 1,
    "explain": "First `if`: `x > 0` is false, so `&&` skips `check()`. Second: `x == 0` is true, so `||` already knows the answer and skips `check()`. Third: `x == 0` is true, so `&&` must evaluate `check()`. One call."
  },
  {
    "q": "What does this print? (g++ warns about the condition but compiles it.)",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int lives = 3;\n    if (lives = 0)\n        cout << \"game over\" << endl;\n    else\n        cout << \"lives: \" << lives << endl;\n    return 0;\n}",
    "options": [
      "`lives: 0`",
      "`lives: 3`",
      "`game over`",
      "`a compile error`"
    ],
    "answer": 0,
    "explain": "`lives = 0` is an assignment, not a comparison: it stores 0 and its value is 0, which is false. The `else` branch runs and prints the new value: `lives: 0`. `-Wall` flags it with `suggest parentheses around assignment used as truth value`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << boolalpha << (7 > 3 && 2 > 5) << ' ' << !(4 != 4) << ' ' << (3 <= 3) << endl;\n    return 0;\n}",
    "options": [
      "`false true true`",
      "`true false true`",
      "`0 1 1`",
      "`false false true`"
    ],
    "answer": 0,
    "explain": "`7 > 3` is true but `2 > 5` is false, so `&&` gives false. `4 != 4` is false and `!` flips it to true. `3 <= 3` is true. `boolalpha` prints words: `false true true`."
  }
]
```

```challenge
{
  "prompt": "Write <code>bool inRange(int x)</code> that returns <code>true</code> when <code>x</code> is from 100 to 999 inclusive, using one <code>&&</code>. <code>main</code> is written and prints <code>false true true false</code>.",
  "starter": "#include <iostream>\nusing namespace std;\n\n// inRange here\n\nint main()\n{\n    cout << boolalpha << inRange(99) << ' ' << inRange(100) << ' '\n         << inRange(999) << ' ' << inRange(1000) << endl;\n    return 0;\n}\n",
  "expected": "false true true false\n",
  "hints": [
    "Both bounds are inclusive: <code>>=</code> and <code><=</code>.",
    "<code>return x >= 100 && x <= 999;</code>"
  ],
  "solution": "#include <iostream>\nusing namespace std;\n\nbool inRange(int x)\n{\n    return x >= 100 && x <= 999;\n}\n\nint main()\n{\n    cout << boolalpha << inRange(99) << ' ' << inRange(100) << ' '\n         << inRange(999) << ' ' << inRange(1000) << endl;\n    return 0;\n}\n"
}
```

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
