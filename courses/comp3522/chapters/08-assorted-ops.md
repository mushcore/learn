---
title: Ternary, comma, sizeof, bitwise
minutes: 18
---

The slide calls these "some more assorted operators" — ternary, comma ("yuck", in the instructor's own words), casting, and `sizeof`. The sample code for this section is `assortedOps.cpp`; we reproduce it here exactly, plus the bitwise operators from `bits.cpp` and `const_vs_constexpr.cpp`.

## Ternary operator `?:`

`condition ? valueIfTrue : valueIfFalse` is a single expression that replaces a whole if/else when both branches just assign a value. The sample code originally wrote this as an if/else and then showed the ternary equivalent in a comment:

```cpp
if (x < 5)
{
    lessThanNum = true;
}
else
{
    lessThanNum = false;
}
// same thing, one line:
lessThanNum = x < 5 ? true : false;
```

```widget
expr-stepper
{ "expr": "x < 5 ? 1 : 0", "env": { "x": 3, "n": 1 }, "presets": ["x < 5 ? 1 : 0", "x < 5 ? 1 : 0"] }
```

## The comma operator

The comma operator evaluates a list of expressions **left to right** and the value of the whole thing is the value of the **last** one. Every expression in between still runs — for its side effects — its value is just thrown away.

```widget
expr-stepper
{ "expr": "(++n, n)", "env": { "n": 1 }, "presets": ["(++n, n)", "(++n, 2*n)"] }
```

Here is the full `assortedOps.cpp` sample, with the ternary rewrite from above already applied. Run it with input `3`:

```cpp run pin assortedOps.cpp
// stdin: 3
// predict: Input is 3. Write the four lines this prints, in order.
#include <iostream>

int main() {
    // ternary
    int x = 0;
    bool lessThanNum = false;
    std::cout << "Enter a number" << std::endl;
    std::cin >> x;
    lessThanNum = x < 5 ? true : false;
    std::cout << x << " is less than 5: " << std::boolalpha << lessThanNum << std::endl;

    // comma operator
    int n = 1;
    int m = (++n, std::cout << "n = " << n << '\n', ++n, 2*n);
    std::cout << "m = " << (++m, m) << '\n';

    // casting operator
    int anInt = 0;
    float aFloat = (float)anInt;
    std::cout << "aFloat = " << aFloat << '\n';

    return 0;
}
```

Trace the `m` line by hand — this is exactly how the quiz will ask it:

1. `n` starts at `1`.
2. `++n` — first item in the comma list — makes `n = 2`.
3. `std::cout << "n = " << n << '\n'` — second item — **prints `n = 2`**. Its value (the stream) is discarded.
4. `++n` — third item — makes `n = 3`.
5. `2*n` — last item — evaluates to `6`. That becomes the value of the whole comma expression, so `m = 6`.
6. On the next line, `(++m, m)` increments `m` to `7` and then evaluates to `m` (7) — so it **prints `m = 7`**.

:::quiz The comma operator is not a tuple and not a function-call separator
`int m = (a, b);` does **not** create a pair — it evaluates `a`, throws the result away, evaluates `b`, and `m` becomes `b`. Don't confuse the comma **operator** (needs parentheses, evaluates to the last expression) with the commas that separate function arguments or declarations like `int x, y;` — those are not the comma operator at all.
:::

## Casting operator

C-style casting with parentheses works in C++: `(float)anInt` explicitly converts `anInt` to a `float`, same as the slide's `int y = (int)x; //truncates value`. It is a distinct operator from an implicit conversion (like promoting an `int` to `double` in mixed arithmetic) — here you are asking for the conversion yourself.

## `sizeof`

`sizeof` returns the number of bytes a type or variable occupies **on the current platform** — it's not a fixed universal constant.

```cpp run
#include <iostream>

int main()
{
    std::cout << "sizeof(int): " << sizeof(int) << " bytes" << std::endl;
    std::cout << "sizeof(double): " << sizeof(double) << " bytes" << std::endl;
    std::cout << "sizeof(char): " << sizeof(char) << " bytes" << std::endl;

    int x = 42;
    std::cout << "sizeof(x): " << sizeof(x) << " bytes" << std::endl;
    return 0;
}
```

## Bitwise operators and their compound forms

```cpp run pin bits.cpp
// predict: All five start at 2. Write the five numbers printed.
#include <iostream>
using namespace std;

int main() {
    int a = 2;
    int b = 2;
    int c = 2;
    int d = 2;
    int e = 2;

    a >>= 1; // equal to a = a >> 1;
    b <<= 1; // equal to b = b << 1;
    c &= 1;  // equal to c = c & 1;
    d |= 1;  // equal to d = d | 1;
    e ^= 1;  // equal to e = e ^ 1;

    cout << a << endl;
    cout << b << endl;
    cout << c << endl;
    cout << d << endl;
    cout << e << endl;

    return 0;
}
```

The `bits.cpp` sample runs every bitwise operator's compound form on `a = b = c = d = e = 2`:

`2` in binary is `010`. Work through each:

| Expression | Binary | Decimal |
|---|---|---|
| `a >>= 1` (`010 >> 1`) | `001` | `1` |
| `b <<= 1` (`010 << 1`) | `100` | `4` |
| `c &= 1` (`010 & 001`) | `000` | `0` |
| `d \|= 1` (`010 \| 001`) | `011` | `3` |
| `e ^= 1` (`010 ^ 001`) | `011` | `3` |

Click bits directly to see this for any starting values:

```widget
bitwise
{ "a": 2, "b": 1 }
```

`const_vs_constexpr.cpp` chains two of these on the same variable, then reads a runtime value into a `const int`. Run it with input `7`:

```cpp run
// stdin: 7
#include <iostream>
#include <limits>
using namespace std;

int main()
{
    cout << numeric_limits<int>::max() << endl;
    int a = 1;
    int b = 2;
    cout << a << endl;
    a <<= 3;
    cout << a << endl;
    cout << (a |= b) << endl;

    int input;
    cin >> input;
    const int constantinput = input;   // this compiles - a const can take a runtime value
    cout << constantinput << endl;
    return 0;
}
```

`a` starts at `1` (`001`). `a <<= 3` shifts left three places to `1000` = `8`. Then `a |= b` with `b = 2` (`010`) ORs `1000 | 0010 = 1010` = `10`, and — because `|=` is an expression, not a statement — `cout << (a |= b)` prints the **new** value of `a`, `10`, in the same line that updates it. Output so far: `2147483647`, `1`, `8`, `10`.

The last two lines are the sample's actual point (it's named `const_vs_constexpr.cpp`, after all): `const int constantinput = input;` compiles fine even though `input` is only known once the user types it at runtime — a `const` only promises the value won't change *after* initialization, so it prints whatever was typed, `7`. A `constexpr` in the same spot would **not** compile, because `constexpr` requires the value to be known at compile time, before the program ever runs.

In one sentence: `const` can be set from a runtime value and never change again; `constexpr` must already be a compile-time value.

```quiz
[
  {
    "q": "In `assortedOps.cpp`, `n` starts at 1. What does the program print for the `n = ` line?",
    "code": "int n = 1;\nint m = (++n, std::cout << \"n = \" << n << '\\n', ++n, 2*n);",
    "options": ["n = 1", "n = 2", "n = 3", "n = 6"],
    "answer": 1,
    "explain": "The first comma item `++n` runs before the print, making n = 2 by the time cout << n executes."
  },
  {
    "q": "What is the value of `m` after `int m = (++n, std::cout << ..., ++n, 2*n);` given n starts at 1?",
    "options": ["2", "3", "6", "7"],
    "answer": 2,
    "explain": "n goes 1 -> 2 (print) -> 3, then the comma expression's value is the last item, 2*n = 2*3 = 6."
  },
  {
    "q": "What does `std::cout << \"m = \" << (++m, m) << '\\n';` print, given m is 6 beforehand?",
    "options": ["m = 6", "m = 7", "m = 12", "m = 13"],
    "answer": 1,
    "explain": "`(++m, m)` increments m to 7 first, then evaluates to m — the last item in the comma list — so it prints 7."
  },
  {
    "q": "The comma operator `(expr1, expr2)` evaluates both expressions left to right, and the whole expression's value is that of the last one.",
    "type": "tf",
    "answer": true,
    "explain": "Every expression in the list runs for its side effects; only the last one's value survives."
  },
  {
    "q": "`lessThanNum = x < 5 ? true : false;` is equivalent to which control structure?",
    "options": ["A switch statement", "An if/else that assigns true or false to lessThanNum", "A while loop", "A comma expression"],
    "answer": 1,
    "explain": "The ternary operator is a compact expression form of an if/else that produces a value."
  },
  {
    "q": "What does this print? (a starts at 2, run `bits.cpp`'s `a >>= 1;`)",
    "code": "int a = 2;\na >>= 1;\nstd::cout << a;",
    "options": ["1", "0", "4", "2"],
    "answer": 0,
    "explain": "2 is `010` in binary. Shifting right by 1 gives `001` = 1."
  },
  {
    "q": "What does this print? (b starts at 2, run `bits.cpp`'s `b <<= 1;`)",
    "code": "int b = 2;\nb <<= 1;\nstd::cout << b;",
    "options": ["1", "3", "4", "0"],
    "answer": 2,
    "explain": "2 is `010`. Shifting left by 1 gives `100` = 4."
  },
  {
    "q": "In `const_vs_constexpr.cpp`, `a` starts at 1. What does `cout << (a |= b) << endl;` print after `a <<= 3;` (with `b = 2`)?",
    "options": ["8", "10", "3", "1"],
    "answer": 1,
    "explain": "a <<= 3 makes a = 8 (`1000`). a |= b with b = 2 (`0010`) gives `1010` = 10, and the expression prints the updated a."
  },
  {
    "q": "In `const_vs_constexpr.cpp`, why does `const int constantinput = input;` compile even though `input` is only read from `cin` at runtime?",
    "options": ["It doesn't compile — const values must be known at compile time", "`const` only promises the value won't change after it's initialized; it can still be set from a runtime value", "`const` is silently ignored by the compiler", "`cin >> input` runs at compile time"],
    "answer": 1,
    "explain": "const means \"read-only after initialization,\" not \"known at compile time.\" That stricter guarantee is what `constexpr` provides — a `constexpr` in the same spot would fail to compile."
  },
  {
    "q": "`sizeof(int)` always returns exactly 4, on every platform and compiler.",
    "type": "tf",
    "answer": false,
    "explain": "`sizeof` reports the size on the current platform. 4 bytes is typical for `int` on common desktop platforms, but it is not a language guarantee."
  }
]
```
