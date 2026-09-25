---
title: Arithmetic & compound operators
minutes: 15
---

The slide's running example for this whole unit is one line: `int a; a = 5 + 5;`. Everything about operators starts there.

## Operators, operands, literals

In `a = 5 + 5;`:

- `+` is an **operator**. The two `5`s next to it are its **operands**.
- `=` is also an operator — the **assignment operator**. `a` and the result of `5 + 5` are its operands.
- Both `5`s are **literals**: values written directly into the source code, as opposed to variables that hold a value.

So the same token can be described two ways depending on what you're pointing at: "operand of `+`" describes its *role*, "literal" describes *what kind of value it is*.

## Arithmetic operators

C++ has the five you'd expect:

| Operator | Name |
|---|---|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo (remainder) |

```cpp run
#include <iostream>

int main()
{
    int a = 17;
    int b = 5;

    std::cout << "a + b = " << a + b << std::endl;
    std::cout << "a - b = " << a - b << std::endl;
    std::cout << "a * b = " << a * b << std::endl;
    std::cout << "a / b = " << a / b << std::endl;
    std::cout << "a % b = " << a % b << std::endl;
    return 0;
}
```

## Integer division truncates

```cpp run pin NegativeDivision.cpp
// predict: Write the four numbers printed.
#include <iostream>

int main()
{
    std::cout << -7 / 2 << std::endl;
    std::cout << -7 % 2 << std::endl;
    std::cout << 7 / -2 << std::endl;
    std::cout << 7 % -2 << std::endl;
    return 0;
}
```

`17 / 5` is `3`, not `3.4`. When **both** operands of `/` are integers, the result is an integer — the fractional part is thrown away (truncated toward zero, not rounded). `%` gives you back what division dropped: `17 % 5 == 2` because `17 = 3*5 + 2`.

Negative numbers are the trap. C++ truncates **toward zero**, and `%` follows the sign of the left-hand operand (the dividend).

`-7 / 2` truncates toward zero: `-3.5` becomes `-3`, **not** `-4`. `%` fills the gap so that `(a/b)*b + a%b == a`: `-3*2 = -6` and `-7 - (-6) = -1`, so `-7 % 2` is `-1`. The same logic gives `7 / -2` equal to `-3` and `7 % -2` equal to `1`.

:::quiz Division-by-zero is not a compile error
`int x = 5 / 0;` **compiles fine** and then crashes (or does something undefined) **at runtime** — integer division by zero is undefined behaviour, not a syntax problem the compiler catches. Floating-point division by zero is different: `5.0 / 0.0` is well-defined and gives you `inf`.
:::

```widget
int-division
```

## Step through an expression

The stepper shows operator precedence and evaluation order one step at a time.

```widget
expr-stepper
{ "expr": "a / b + a % b", "env": { "a": 17, "b": 5 }, "presets": ["a / b + a % b", "-7 / 2", "-7 % 2", "a += b", "a %= 4"] }
```

## Mixed int / double

If **either** operand of an arithmetic operator is a floating-point type, the other operand is promoted to floating-point first, and the whole expression is computed as floating-point. Only when you **assign** a floating-point result back into an `int` does it get truncated.

```cpp run
#include <iostream>

int main()
{
    int a = 5;
    double b = 2.0;

    std::cout << a / 2 << std::endl;       // 2      -- int / int
    std::cout << a / b << std::endl;       // 2.5    -- a promoted to double
    int truncated = a / b;
    std::cout << truncated << std::endl;   // 2      -- 2.5 truncated on assignment
    return 0;
}
```

## Compound assignment operators

`a += 5;` means `a = a + 5;`. Same idea for the other four:

```cpp run
#include <iostream>

int main()
{
    int score = 10;
    score += 5;   // 15
    score -= 3;   // 12
    score *= 2;   // 24
    score /= 4;   // 6
    score %= 4;   // 2
    std::cout << score << std::endl;
    return 0;
}
```

```quiz
[
  {
    "q": "What does this print?",
    "code": "int a = 17, b = 5;\nstd::cout << a / b << std::endl;",
    "options": ["3.4", "3", "2", "17/5"],
    "answer": 1,
    "explain": "Both operands are int, so `/` truncates: 17/5 = 3 (fractional part dropped, not rounded)."
  },
  {
    "q": "What does this print?",
    "code": "std::cout << -7 % 2 << std::endl;",
    "options": ["1", "-1", "3", "-3"],
    "answer": 1,
    "explain": "C++ modulo follows the sign of the dividend. -7/2 truncates toward zero to -3, and -7 - (-3*2) = -1."
  },
  {
    "q": "Dividing an int by 0 (e.g. `int x = 5 / 0;`) causes a compile error.",
    "type": "tf",
    "answer": false,
    "explain": "It compiles. Integer division by zero is undefined behaviour at runtime (typically a crash), not something the compiler rejects."
  },
  {
    "q": "`5.0 / 2` evaluates to `2.5` because one operand is a `double`, so the whole expression is computed as `double`.",
    "type": "tf",
    "answer": true,
    "explain": "Mixed-type arithmetic promotes the int operand to double before dividing. Only assigning the result into an int would truncate it."
  },
  {
    "q": "In `int a; a = 5 + 5;`, what are the two `5`s?",
    "options": ["Variables", "Literals that are the operands of `+`", "Operators", "Assignment operators"],
    "answer": 1,
    "explain": "A literal is a value written directly in the source. Relative to `+`, the two literals also serve as its operands."
  },
  {
    "q": "What does this print?",
    "code": "int score = 10;\nscore += 5;\nscore /= 3;\nstd::cout << score;",
    "options": ["5", "3", "15", "3.33"],
    "answer": 0,
    "explain": "score becomes 15 after += 5, then 15/3 = 5 with integer division."
  },
  {
    "q": "Which of these are compound assignment operators shown in the slides? (select all)",
    "options": ["`+=`", "`==`", "`*=`", "`%=`"],
    "answer": [0, 2, 3],
    "explain": "`+=`, `-=`, `*=`, `/=`, `%=` are compound assignment operators. `==` is the equality (relational) operator, not assignment."
  },
  {
    "q": "You can apply `%` directly to two `double` values, e.g. `5.5 % 2.0`.",
    "type": "tf",
    "answer": false,
    "explain": "`%` in C++ only works on integer types. Floating-point remainder needs `std::fmod` from `<cmath>`."
  }
]
```
