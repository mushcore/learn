---
title: C-style casting
minutes: 12
---

The slide for this section is one line: `float x = 2.25; int y = (int)x; //truncates value`. Two things hide in it: what "truncates" means, and why casting fixes the integer-division bug.

## Wrapping a type in parentheses

`(int)x` is a **C-style cast**: put the target type in parentheses in front of the value. It works in C++ exactly like it did in C.

```cpp run
#include <iostream>

int main()
{
    float x = 2.25f;
    int y = (int)x;   // truncates value
    std::cout << "y = " << y << std::endl;
    return 0;
}
```

The fractional `.25` is not rounded away; it is **dropped**.

## Truncation is toward zero, not "round down"

This is the trap. "Truncate" does not mean "floor" — it means "cut off the fractional part," which behaves differently once the number is negative.

```cpp run
#include <iostream>

int main()
{
    float a = 2.75f;
    float b = -2.75f;
    std::cout << (int)a << std::endl;   // predict, then run
    std::cout << (int)b << std::endl;   // predict, then run
    return 0;
}
```

`(int)2.75` is `2`. `(int)-2.75` is `-2`, **not `-3`**. A `floor()` would give you `-3`; a C-style cast to `int` truncates toward zero, chopping off `.75` and leaving `-2`. This is the same rule you already saw for integer division (`-7 / 2 == -3`, not `-4`) — casting to `int` and integer division both truncate toward zero.

## Using a cast to fix integer division

You've seen `int / int` truncate. The fix is to cast **before** the division happens, not after.

```cpp run pin CastBeforeOrAfter.cpp
// predict: Write the two numbers printed.
#include <iostream>

int main()
{
    int a = 7;
    int b = 2;

    std::cout << (double)a / b << std::endl;     // predict, then run
    std::cout << (double)(a / b) << std::endl;    // predict, then run
    return 0;
}
```

- `std::cout << (double)a / b << std::endl;` casts `a` to `double` **first**. Now one operand of `/` is a `double`, so the whole division is done in floating point: `3.5`.
- `std::cout << (double)(a / b) << std::endl;` computes `a / b` **first** — still `int / int`, which truncates to `3` — and only then casts the already-truncated `3` to `double`, giving `3.0`. The cast arrived too late to save the fractional part.

Same cast, different placement, different answer: parentheses control *when* the conversion happens.

```widget
int-division
```

## Casting between char, int, and bool

A C-style cast also converts between the small integral types. `char` is just a 1-byte integer under the hood, so casting it to `int` gives you its numeric (ASCII) code, and casting an `int` back to `char` gives you the character at that code.

```cpp run
#include <iostream>

int main()
{
    char c = 'A';
    int code = (int)c;
    std::cout << "code = " << code << std::endl;   // predict, then run

    int n = 66;
    char letter = (char)n;
    std::cout << "letter = " << letter << std::endl;   // predict, then run

    bool flag = true;
    int flagAsInt = (int)flag;
    std::cout << "flagAsInt = " << flagAsInt << std::endl;
    return 0;
}
```

`'A'` is `65`. `(int)c` gives you `65`. `(char)66` is `'B'`. `bool` follows the same rule as everywhere else in C++: `true` casts to `1`, `false` to `0`.

The `assortedOps.cpp` sample uses this same casting operator on a different pair of types:

```cpp
int anInt = 0;
float aFloat = (float)anInt;   // aFloat = 0.0
```

## C++ has its own casting operators too

C-style casting is compact but blunt: the compiler cannot tell what *kind* of conversion you meant. Later this term you'll meet four named C++ casting operators that make the intent explicit: `static_cast`, `dynamic_cast`, `const_cast`, and `reinterpret_cast`. For now, recognize the names.

```quiz
[
  {
    "q": "What does this print?",
    "code": "float x = 2.25f;\nint y = (int)x;\nstd::cout << y;",
    "options": ["2", "2.25", "3", "2.0"],
    "answer": 0,
    "explain": "A C-style cast to int truncates the fractional part; 2.25 becomes 2."
  },
  {
    "q": "What does this print?",
    "code": "float b = -2.75f;\nstd::cout << (int)b;",
    "options": ["-3", "-2", "-2.75", "2"],
    "answer": 1,
    "explain": "Truncation is toward zero, not toward negative infinity. -2.75 truncates to -2, not -3 (that would be flooring)."
  },
  {
    "q": "Casting to `int` always rounds to the nearest whole number.",
    "type": "tf",
    "answer": false,
    "explain": "It truncates (chops the fractional part), which is only the same as rounding for values already close to zero going toward zero. -2.75 -> -2, not -3."
  },
  {
    "q": "Given `int a = 7, b = 2;`, what does `(double)a / b` evaluate to?",
    "options": ["3", "3.0", "3.5", "3.50000"],
    "answer": 2,
    "explain": "Casting a to double before the division makes the whole expression floating-point: 7.0 / 2 = 3.5."
  },
  {
    "q": "Given `int a = 7, b = 2;`, what does `(double)(a / b)` evaluate to?",
    "options": ["3.5", "3", "3.0", "7.0"],
    "answer": 2,
    "explain": "a / b is computed first as int/int, truncating to 3. Casting that 3 to double afterward just gives 3.0 — the fractional part is already gone."
  },
  {
    "q": "`(double)a / b` and `(double)(a / b)` always produce the same result.",
    "type": "tf",
    "answer": false,
    "explain": "Only if a/b divides evenly. Otherwise casting before the division preserves the fraction; casting after it does not."
  },
  {
    "q": "What does `(int)'A'` evaluate to?",
    "options": ["A", "0", "65", "1"],
    "answer": 2,
    "explain": "char is a 1-byte integer type. 'A' has the ASCII code 65."
  },
  {
    "q": "What does `(int)true` evaluate to?",
    "options": ["0", "1", "true", "It does not compile"],
    "answer": 1,
    "explain": "bool follows the usual C++ convention: true casts to 1, false to 0."
  },
  {
    "q": "C++ only supports C-style parenthesis casting — it has no casting operators of its own.",
    "type": "tf",
    "answer": false,
    "explain": "C++ adds static_cast, dynamic_cast, const_cast, and reinterpret_cast, covered later this term. C-style casting still works, but it's less explicit about what conversion you intend."
  },
  {
    "q": "In `assortedOps.cpp`, what type of cast is `(float)anInt`?",
    "options": ["A C++-only cast (static_cast)", "A C-style cast", "Not a cast — implicit conversion", "A comma expression"],
    "answer": 1,
    "explain": "Wrapping the target type in parentheses in front of the value is C-style casting, and it is still legal and common in C++."
  }
]
```
