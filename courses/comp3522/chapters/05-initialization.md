---
title: Three ways to initialize
minutes: 12
---

Unlike Java, C++ has three syntaxes for initializing a variable.

## The three forms

```cpp
int x = 0;   // 1. C-like initialization — assignment operator
int x(0);    // 2. Constructor initialization — parentheses
int x{0};    // 3. Uniform initialization — curly braces (C++11)
```

All three set `x` to `0`; they are three spellings of the same thing.

```widget
init-forms
```

## Why prefer uniform initialization?

The slides' reason to prefer uniform initialization (the `{}` form): **it prohibits implicit narrowing conversion** among built-in types. `=` and `()` silently truncate a value that does not fit the target type; `{}` refuses to compile.

```cpp pin narrowing.cpp
double x, y, z;
int sum = x + y + z;   // ok (value of expression truncated to int)
int sum(x + y + z);    // same — still truncates
int sum{x + y + z};    // ERROR! This won't work. We're happy!
```

Given `double x, y, z;`, `int sum = x + y + z;` and `int sum(x + y + z);` compile and truncate; `int sum{x + y + z};` does not compile. The slide's comment on that line, "We're happy!", is the point: the error catches silent data loss at compile time.

### `=` and `()` truncate

```cpp run
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

int main()
{
    double x = 1.5, y = 1.5, z = 1.5;

    int sum = x + y + z;    // = form
    cout << "sum with =  : " << sum << endl;

    int sum2(x + y + z);    // () form
    cout << "sum with () : " << sum2 << endl;

    return 0;
}
```

`x + y + z` is `4.5`, a `double`; `=` and `()` drop the `.5` with no warning.

### `{}` with literals: a compile error

Uniform initialization treats that same truncation as an error when the compiler can see, at compile time, that the value doesn't fit:

```cpp
#include <iostream>
using namespace std;

int main()
{
    int sum{1.5 + 1.5 + 1.5};   // ERROR: narrowing conversion, double -> int
    cout << sum << endl;

    return 0;
}
```

The compiler stops before the program runs:

```text
main.cpp: In function 'int main()':
main.cpp:6:23: error: narrowing conversion of '4.5e+0' from 'double' to 'int' [-Wnarrowing]
    6 |     int sum{1.5 + 1.5 + 1.5};   // ERROR: narrowing conversion, double -> int
      |             ~~~~~~~~~~^~~~~
```

:::warn When the value comes from a variable instead of a literal
Swap the literals for the `double x, y, z` variables (`int sum{x + y + z};`) and g++ only prints a `-Wnarrowing` **warning**: it compiles and truncates to `4`, like `=` and `()`. Both cases are ill-formed by the standard, but g++ escalates to an error only when it can evaluate the narrowed value at compile time. The slides' answer is the standard's: `{}` narrowing "won't work."
:::

:::quiz C++11
Uniform initialization (`{}`) is a **C++11** feature. The `=` and `()` forms are older and both allow narrowing; only `{}` blocks it.
:::

## Predict truncation and narrowing in four new initializations

Each item mixes the three forms with `double` sources; decide which truncate and which refuse to compile.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    double d = 3.75;\n    int a = d;\n    int b(d + 2.5);\n    cout << a << ' ' << b << ' ' << a + b << endl;\n    return 0;\n}",
    "options": [
      "`3 6 9`",
      "`3.75 6.25 10`",
      "`4 6 10`",
      "`error: narrowing conversion`"
    ],
    "answer": 0,
    "explain": "The C-like and constructor forms convert silently and truncate: `a` gets 3 from 3.75, `b` gets 6 from 6.25. 3 + 6 = 9. Output: `3 6 9`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int a(7);\n    int b{a};\n    int c = b + a;\n    cout << a << ' ' << b << ' ' << c << endl;\n    return 0;\n}",
    "options": [
      "`7 7 14`",
      "`7 0 7`",
      "`7 7 7`",
      "`error: {} needs a literal`"
    ],
    "answer": 0,
    "explain": "All three forms are valid and here no conversion happens (int to int), so `{}` has nothing to refuse: a = 7, b = 7, c = 14. Output: `7 7 14`."
  },
  {
    "q": "Which of these declarations compile? (select all)",
    "options": [
      "`int a{7};`",
      "`double d{7};`",
      "`int b{7.0};`",
      "`char c{65};`",
      "`char big{300};`"
    ],
    "answer": [
      0,
      1,
      3
    ],
    "explain": "Braces reject only narrowing. `int a{7}` needs no conversion. `double d{7}` and `char c{65}` convert constants that fit exactly, which is not narrowing. `int b{7.0}` is floating to integer, always narrowing, so it is an error even though 7.0 is whole. `char big{300}` is an error because 300 does not fit in a `char` (-128 to 127)."
  },
  {
    "type": "spotbug",
    "q": "Click the line that fails to compile.",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int dollars = 9.99;\n    int cents(0.75 * 100);\n    int total{19.99 * 100};\n    cout << dollars << ' ' << cents << ' ' << total << endl;\n    return 0;\n}",
    "answer": 8,
    "explain": "Lines 6 and 7 use `=` and `()`, which truncate silently (9.99 to 9; 0.75 × 100 is 75.0, stored as 75). Line 8 uses `{}` on a `double` value, so g++ stops with `narrowing conversion of '1.9989999999999998e+3' from 'double' to 'int'`. The value is computed at compile time, which is why g++ makes this an error rather than the `-Wnarrowing` warning it gives for `double` variables."
  }
]
```

```challenge
{
  "prompt": "Three lab marks are <code>8.5</code>, <code>9.25</code> and <code>7.75</code>. Store their sum in a <code>double</code> named <code>total</code> using uniform initialization, then store the truncated whole number in an <code>int</code> named <code>whole</code> using the C-like form. Print <code>total: 25.5 whole: 25</code>.",
  "starter": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    double m1 = 8.5, m2 = 9.25, m3 = 7.75;\n    // total and whole here\n    return 0;\n}\n",
  "expected": "total: 25.5 whole: 25\n",
  "hints": [
    "<code>double total{m1 + m2 + m3};</code> is fine: no narrowing from double to double.",
    "<code>int whole{total};</code> would not compile; <code>int whole = total;</code> truncates."
  ],
  "solution": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    double m1 = 8.5, m2 = 9.25, m3 = 7.75;\n    double total{m1 + m2 + m3};\n    int whole = total;\n    cout << \"total: \" << total << \" whole: \" << whole << endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "Which of these is **uniform initialization**?",
    "options": ["`int x = 0;`", "`int x(0);`", "`int x{0};`", "`int x[0];`"],
    "answer": 2,
    "explain": "Uniform (C++11) initialization uses curly braces."
  },
  {
    "q": "`int x(0);` is called…",
    "options": ["C-like initialization", "constructor initialization", "uniform initialization", "default initialization"],
    "answer": 1,
    "explain": "The parentheses form is constructor initialization, available since early C++ (not C++11-only)."
  },
  {
    "q": "Uniform initialization (`{}`) was introduced in which C++ standard?",
    "options": ["The original C++ (pre-standard)", "C++98", "C++11", "C++20"],
    "answer": 2,
    "explain": "The slides label it explicitly: \"Uniform initialization (C++11)\"."
  },
  {
    "q": "What does this print?",
    "code": "double x = 1.5, y = 1.5, z = 1.5;\nint sum = x + y + z;\ncout << sum;",
    "options": ["4", "4.5", "5", "it does not compile"],
    "answer": 0,
    "explain": "x + y + z is 4.5 as a double; assigning into an int with `=` truncates (does not round) to 4."
  },
  {
    "q": "`int sum{x + y + z};`, where `x`, `y`, `z` are `double`s, compiles and truncates just like the `=` and `()` forms.",
    "type": "tf",
    "answer": false,
    "explain": "Answer as the slides do: `{}` prohibits the narrowing, so the line \"won't work\". Real g++ is softer when the doubles are variables: it prints a -Wnarrowing warning and truncates to 4 (see the warning box above). With literals, `int sum{1.5 + 1.5 + 1.5};`, g++ makes it an error."
  },
  {
    "q": "Select every valid way to initialize `int x` with the value `0`.",
    "options": ["`int x = 0;`", "`int x(0);`", "`int x{0};`", "`int x[0];`"],
    "answer": [0, 1, 2],
    "explain": "`int x[0];` declares a zero-length array, not an initialized int — it's not one of the three initialization forms."
  },
  {
    "q": "Why does the course prefer uniform initialization over `=` or `()`?",
    "options": ["It runs faster at runtime", "It prohibits implicit narrowing conversions between built-in types", "It is required by every compiler", "It only works with strings"],
    "answer": 1,
    "explain": "Straight from the slides: uniform initialization prohibits implicit narrowing conversion among built-in types, catching data-loss bugs at compile time."
  },
  {
    "q": "`int sum(x + y + z);`, where `x, y, z` are `double`s, behaves the same as `int sum = x + y + z;` in terms of truncation.",
    "type": "tf",
    "answer": true,
    "explain": "The slides mark the `()` line \"// same\" as the `=` line — both allow the narrowing truncation; only `{}` blocks it."
  },
  {
    "type": "spotbug",
    "q": "Click the line that fails to compile with a narrowing-conversion error.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    int x{2.5};\n    cout << x << endl;\n    return 0;\n}",
    "answer": 5,
    "explain": "Line 5: `int x{2.5};` uses uniform initialization to put a `double` value into an `int` — brace initialization prohibits that implicit narrowing, so g++ rejects it at compile time instead of silently truncating to 2."
  }
]
```
