---
title: C-style casting
minutes: 12
---

The slide for this section is one line: `float x = 2.25; int y = (int)x; //truncates value`. Two things hide in it: what "truncates" means, and why casting fixes the integer-division bug.

## Wrapping a type in parentheses

`(int)x` is a **C-style cast**: put the target type in parentheses in front of the value. It works in C++ exactly like it did in C.

```cpp run
// predict: Write the line printed.
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
// predict: Write the two numbers printed.
#include <iostream>

int main()
{
    float a = 2.75f;
    float b = -2.75f;
    std::cout << (int)a << std::endl;
    std::cout << (int)b << std::endl;
    return 0;
}
```

A `floor()` rounds down, toward negative infinity. A C-style cast to `int` truncates toward zero: it chops off the `.75` whichever sign the number has. Integer division follows the same rule (`-7 / 2 == -3`, not `-4`).

## Using a cast to fix integer division

You've seen `int / int` truncate. The fix is to cast **before** the division happens, not after.

```cpp run pin CastBeforeOrAfter.cpp
// predict: Write the two numbers printed.
#include <iostream>

int main()
{
    int a = 7;
    int b = 2;

    std::cout << (double)a / b << std::endl;  
    std::cout << (double)(a / b) << std::endl; 
    return 0;
}
```

- `std::cout << (double)a / b << std::endl;` casts `a` to `double` **first**, so one operand of `/` is a `double` and the whole division is done in floating point.
- `std::cout << (double)(a / b) << std::endl;` computes `a / b` **first**, still `int / int`, and only then converts the already-truncated result to `double`. The cast arrives too late to save the fraction.

Parentheses control when the conversion happens.

```widget
int-division
```

## Casting between char, int, and bool

A C-style cast also converts between the small integral types. `char` is just a 1-byte integer under the hood, so casting it to `int` gives you its numeric (ASCII) code, and casting an `int` back to `char` gives you the character at that code.

```cpp run
// predict: Write the three lines printed.
#include <iostream>

int main()
{
    char c = 'A';
    int code = (int)c;
    std::cout << "code = " << code << std::endl;

    int n = 66;
    char letter = (char)n;
    std::cout << "letter = " << letter << std::endl;

    bool flag = true;
    int flagAsInt = (int)flag;
    std::cout << "flagAsInt = " << flagAsInt << std::endl;
    return 0;
}
```

`(int)c` gives the character's ASCII code and `(char)n` goes the other way. `bool` follows the usual C++ rule: `true` casts to `1`, `false` to `0`.

The `assortedOps.cpp` sample uses this same casting operator on a different pair of types:

```cpp
int anInt = 0;
float aFloat = (float)anInt;
```

## C++ has its own casting operators too

C-style casting is compact but blunt: the compiler cannot tell what kind of conversion you meant. Later this term you'll meet four named C++ casting operators that make the intent explicit: `static_cast`, `dynamic_cast`, `const_cast`, and `reinterpret_cast`. For now, recognize the names.

## Place the cast and predict four new results

Where the `(type)` sits decides whether it runs before or after the arithmetic.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    double d = -7.9;\n    cout << (int)d << ' ' << (int)(d + 0.5) << endl;\n    return 0;\n}",
    "options": [
      "`-7 -7`",
      "`-8 -7`",
      "`-8 -8`",
      "`-7 -8`"
    ],
    "answer": 0,
    "explain": "A cast to `int` truncates toward zero: -7.9 becomes -7. The \"add 0.5 then truncate\" rounding trick fails for negatives: -7.9 + 0.5 = -7.4, which also truncates to -7 (rounding would give -8). Output: `-7 -7`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int total = 17, count = 4;\n    cout << total / count << ' ' << (double)total / count << ' ' << (double)(total / count) << endl;\n    return 0;\n}",
    "options": [
      "`4 4.25 4`",
      "`4 4.25 4.25`",
      "`4.25 4.25 4`",
      "`4 4 4`"
    ],
    "answer": 0,
    "explain": "17 / 4 is int division: 4. `(double)total / count` casts first, so the division is 17.0 / 4 = 4.25. `(double)(total / count)` divides first (4) and then casts, giving 4.0, which prints as 4. Output: `4 4.25 4`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << (char)72 << (char)('a' - 32) << ' ' << (int)'0' << ' ' << (bool)-3 << endl;\n    return 0;\n}",
    "options": [
      "`HA 48 1`",
      "`72A 0 1`",
      "`Ha 48 -3`",
      "`HA 0 0`"
    ],
    "answer": 0,
    "explain": "72 is the code for `H`. `'a'` is 97 and 97 − 32 = 65, the code for `A`. The character `'0'` has code 48, not 0. Any non-zero number cast to `bool` is true, printed as 1. Output: `HA 48 1`."
  },
  {
    "type": "numeric",
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    float f = 9.99f;\n    int i = (int)f * 2;\n    cout << i << endl;\n    return 0;\n}",
    "answer": 18,
    "explain": "The cast binds tighter than `*`, so it applies to `f` alone: `(int)9.99f` is 9, then 9 × 2 = 18. Writing `(int)(f * 2)` would give `(int)19.98` = 19."
  }
]
```

```challenge
{
  "prompt": "Write <code>double average(int a, int b, int c)</code> that returns the true average, using a C-style cast so the division is not integer division. <code>main</code> prints <code>8.33333 3</code>.",
  "starter": "#include <iostream>\nusing namespace std;\n\n// average here\n\nint main()\n{\n    cout << average(7, 8, 10) << ' ' << average(2, 3, 4) << endl;\n    return 0;\n}\n",
  "expected": "8.33333 3\n",
  "hints": [
    "Cast the sum before dividing: <code>(double)(a + b + c) / 3</code>.",
    "<code>(double)((a + b + c) / 3)</code> would give 8 for the first call."
  ],
  "solution": "#include <iostream>\nusing namespace std;\n\ndouble average(int a, int b, int c)\n{\n    return (double)(a + b + c) / 3;\n}\n\nint main()\n{\n    cout << average(7, 8, 10) << ' ' << average(2, 3, 4) << endl;\n    return 0;\n}\n"
}
```

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
    "q": "Given `int a = 7, b = 2;`, what does `std::cout << (double)(a / b);` print?",
    "options": ["3.5", "3", "3.0", "7"],
    "answer": 1,
    "explain": "a / b is computed first as int/int, truncating to 3. The cast makes it the double 3.0, but cout's default format drops a zero fraction, so it prints 3. The fractional part was already gone before the cast."
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
