---
title: Three ways to initialize
minutes: 12
---

Unlike Java, C++ gives you three different syntaxes for initializing a variable, and the quiz expects you to recognize all three by sight.

## The three forms

```cpp
int x = 0;   // 1. C-like initialization — assignment operator
int x(0);    // 2. Constructor initialization — parentheses
int x{0};    // 3. Uniform initialization — curly braces (C++11)
```

All three set `x` to `0`. They are not new syntaxes for three different features — they're three different **spellings** of "initialize this variable now."

```widget
init-forms
```

Pick a source type/value and a target type in the widget above and watch what each form does — in particular watch what happens when the target type is narrower than the source value.

## Why prefer uniform initialization?

Straight from the slides: uniform initialization (the `{}` form) is preferred because **it prohibits implicit narrowing conversion** among built-in types. The `=` and `()` forms will silently truncate a value that doesn't fit the target type; `{}` refuses to compile.

```cpp pin narrowing.cpp
double x, y, z;
int sum = x + y + z;   // ok (value of expression truncated to int)
int sum(x + y + z);    // same — still truncates
int sum{x + y + z};    // ERROR! This won't work. We're happy!
```

Given `double x, y, z;`, the `=` form `int sum = x + y + z;` and the `()` form `int sum(x + y + z);` both compile and silently truncate. The `{}` form `int sum{x + y + z};` is different — the slides' own reaction to that last line is "We're happy!" because it refuses to compile instead. A compile error here is the feature, not a bug: it catches a whole class of silent-data-loss bugs at compile time instead of letting them run.

### See the truncation happen

```cpp run
#include <iostream>
using namespace std;

int main()
{
    double x = 1.5, y = 1.5, z = 1.5;

    int sum = x + y + z;    // = form: truncates 4.5 down to 4
    cout << "sum with =  : " << sum << endl;

    int sum2(x + y + z);    // () form: same truncation
    cout << "sum with () : " << sum2 << endl;

    return 0;
}
```

`x + y + z` is `4.5`, a `double`. Assigning it into an `int` with `=` or `()` silently drops the `.5` — you get `4`, with no warning that you lost information.

### Now watch `{}` refuse to compile

Uniform initialization treats that same truncation as an error instead of silently allowing it — when the compiler can see, at compile time, that the value doesn't fit:

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

Try to compile that and the compiler stops you before it ever runs:

```text
main.cpp: In function 'int main()':
main.cpp:6:23: error: narrowing conversion of '4.5e+0' from 'double' to 'int' [-Wnarrowing]
    6 |     int sum{1.5 + 1.5 + 1.5};   // ERROR: narrowing conversion, double -> int
      |             ~~~~~~~~~~^~~~~
```

That's the whole point: `=` and `()` let a `double` quietly become an `int`; `{}` makes that an error you have to fix explicitly (e.g. with a cast).

:::warn When the value comes from a variable instead of a literal
Swap the literals for the `double x, y, z` variables from the previous example (`int sum{x + y + z};`) and g++ only prints a `-Wnarrowing` **warning** — it still compiles and still truncates to `4`, exactly like `=` and `()`. The narrowing rule is part of the C++ standard either way (both cases are technically ill-formed), but g++ only escalates to a hard error when it can evaluate the narrowed value itself, at compile time. The quiz follows the slides: treat `{}` narrowing as "won't compile."
:::

:::quiz Quiz note
Uniform initialization (`{}`) is a **C++11** feature — it did not exist in earlier C++. The `=` and `()` forms are older and both allow narrowing; only `{}` blocks it.
:::

## Quick recap

- Three forms, same result when types match: `= `, `()`, `{}`.
- `{}` is the odd one out: it's C++11-only, and it's the only form that **prohibits narrowing conversions**.
- A `double` truncating into an `int` compiles fine with `=`/`()` and loses data silently; the same code with `{}` is a compile error.

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
    "explain": "This is exactly the case uniform initialization is designed to catch: it is a compile error (narrowing conversion), not a silent truncation."
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
