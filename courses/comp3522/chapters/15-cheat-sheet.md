---
title: One-page cheat sheet
minutes: 10
---

Everything Quiz 1 can ask, in tables. Read this last, on the way to the lab.

## Program skeleton

```cpp
#include <iostream>      // preprocessor directive — NO semicolon, ends at newline
using namespace std;     // optional; brings all std names into scope

int main()               // execution starts here; returns int
{
    cout << "hi" << endl;
    return 0;            // 0 = no errors. Omitting it still compiles (implicit return 0)
}
```

| Symbol | Name | Used for |
|---|---|---|
| `::` | scope resolution | members of a **namespace or class** — `std::cout`, `ios_base::hex` |
| `.` | dot | members of an **object** — `cout.setf(...)`, `cin.clear()` |
| `<<` | insertion | write to an output stream; returns the stream, so it chains |
| `>>` | extraction | read from an input stream; returns the stream, so it chains |

## Files

| | Header (`.hpp`) | Source (`.cpp`) |
|---|---|---|
| Contains | **declarations** (interface) | **definitions** (implementation) |
| Function | `int add(int a, int b);` — ends with `;`, no body | `int add(int a, int b) { return a+b; }` |
| Include guard | `#pragma once` (preferred over `#ifndef`) | — |
| Needs a partner header? | — | yes, except `main.cpp` |

- `#include "mine.hpp"` = your files (quotes); `#include <iostream>` = library (angle brackets, no extension).
- **Never `#include` a `.cpp` file.**
- C headers exist as `<cmath>`, `<climits>`, `<cstdlib>` (drop `.h`, prepend `c`).
- Declared but never defined → **linker** error. Defined twice → **multiple definition** error.

## `using` options

| Option | Scope of visibility |
|---|---|
| `using namespace std;` at file scope | all `std` names, from that line to end of file |
| `using std::cout;` at file scope | only `cout`, rest of file |
| `using std::cout;` inside a function | only `cout`, only inside that function |

## Fundamental types

| Type | Typical size | Note |
|---|---|---|
| `bool` | 1 | `true`/`false`, **prints as 1/0** unless `boolalpha` |
| `char` | 1 | an **integer** type; `'A'` is 65 |
| `short` | 2 | |
| `int` | 4 | ±2,147,483,647 |
| `long` | 4 on Windows | 8 on Linux/macOS — implementation-defined |
| `long long` | 8 | |
| `float` | 4 | ~7 significant digits |
| `double` | 8 | ~15–16 significant digits |
| `long double` | 16 | extended precision |
| `void` | — | no type |

- C++ is **strongly typed**: every variable has a type and that type never changes.
- A declaration needs **type + name + optional initialization**.
- Identifiers: letters, digits, underscores; **may not start with a digit**; begin with a letter (rarely an underscore).

## Initialization

| Form | Syntax | Narrowing |
|---|---|---|
| C-like (assignment) | `int x = 0;` | allowed silently |
| Constructor | `int x(0);` | allowed silently |
| **Uniform (C++11)** | `int x{0};` | **compile error** — prefer this |

`int sum{x + y + z};` with `double x,y,z` → *error: narrowing conversion*. That is the point of `{}`.

## Operators

| Category | Operators |
|---|---|
| Arithmetic | `+` `-` `*` `/` `%` |
| Compound | `+=` `-=` `*=` `/=` `%=` (also `<<=` `>>=` `&=` `|=` `^=`) |
| Increment/decrement | `++` `--` (**pre** vs **post** matters) |
| Relational | `==` `!=` `>` `>=` `<` `<=` |
| Logical | `!` `&&` `||` (`&&`/`||` **short-circuit**) |
| Assorted | `?:` ternary, `,` comma, `( )` cast, `sizeof` |

- `int / int` **truncates toward zero**: `7/2` is 3, `-7/2` is −3. `%` gives the remainder and takes the **sign of the left operand**.
- One `double` operand promotes the whole division: `(double)a / b`. Casting after (`(double)(a/b)`) is too late.
- `x++` uses the **old** value then increments; `++x` increments **first**.
- Comma operator evaluates left (for side effects), discards it, and yields the right.

## Casting and constants

```cpp
float f = 2.25; int i = (int)f;   // 2 — truncates, never rounds
```

| Kind | Syntax | Rules |
|---|---|---|
| `#define` | `#define PI 3.14159` | preprocessor, **no semicolon**, textual replacement |
| `const` | `const int n = 1;` | **must** be initialized in its declaration; may come from runtime (e.g. `cin`) |
| `constexpr` | `constexpr double d{1.3};` | **must** be known at **compile time** |

`void f(const int num)` = "I promise not to change this value."

## Output manipulators

For `int n = 123`, `double d = 123.456789`, `bool b = true`:

| Manipulator | Output | Manipulator | Output |
|---|---|---|---|
| `showpos` | `+123` | `dec` | `123` |
| `hex` | `7b` | `oct` | `173` |
| `uppercase << hex` | `7B` | `showbase << hex` | `0x7b` |
| `fixed` | `123.456789` | `scientific` | `1.234568e+02` |
| `setprecision(7)` | `123.4568` | default precision | **6 significant digits** |
| `boolalpha` | `true` | `noboolalpha` | `1` |
| `showpoint` (on 100.0) | `100.000` | `noshowpoint` | `100` |
| `setw(6) << left` (−123) | `-123··` | `setw(6) << internal` | `-··123` |
| `setw(6) << right` | `··-123` | `setfill('*') << setw(5)` | `**123` |

- `setw` applies to the **next field only**. Every other manipulator is **sticky**.
- `setw`, `setfill`, `setprecision` need `#include <iomanip>`.
- Member-function equivalents: `cout.setf(ios_base::showpos)`, `cout.width(5)`, `cout.precision()`.
- Two-argument form needs the field: `cout.setf(ios_base::hex, ios_base::basefield)`; also `floatfield`, `adjustfield`.

## Input and stream state

| Member function | True when |
|---|---|
| `fail()` | badbit **or** failbit is set |
| `bad()` | badbit is set |
| `eof()` | eofbit is set |
| `good()` | goodbit is set (**no** bits set) |

`cin` is true exactly when `cin.fail()` is false → `while (cin >> n)` works.

For `int n; cin >> n;`:

| Input | `n` | failbit | eofbit |
|---|---|---|---|
| `123 456` | 123 | not set | not set |
| `123<EOF>` | 123 | not set | **set** |
| `hello` | unchanged | **set** | not set |
| `<EOF>` | unchanged | **set** | **set** |

Recovery:

```cpp
#include <limits>
cin.clear();                                          // unset the flags
cin.ignore(numeric_limits<streamsize>::max(), '\n');  // throw away the bad line
```

| `ignore` call | Effect |
|---|---|
| `ignore()` | skip 1 character |
| `ignore(128)` | skip 128 characters or until EOF |
| `ignore(128, '\n')` | skip up to 128, or until EOF, or until `'\n'` |

Reading into a `char[]` is unsafe (`char[]` decays to `char*`, `cin` does not know the size). Fix with `cin >> setw(5) >> name;`.

## True or false

:::quiz Answers in order: F T T F T · F T T F T · F T F T F
1. Preprocessor directives end with a semicolon.
2. `main` compiles even with no `return` statement.
3. `endl` flushes the stream; `'\n'` does not.
4. `int x{2.5};` compiles with a warning.
5. `char` is an integer type.
6. `7 / 2` evaluates to 3.5 in C++.
7. `%` takes the sign of its left operand.
8. `&&` may skip evaluating its right operand.
9. A `const` can be declared without an initializer and assigned later.
10. A `const` may be initialized from `cin`, but a `constexpr` may not.
11. `setw` stays in effect for all later output.
12. Default `cout` precision is 6 significant digits.
13. `cin.good()` is true if only eofbit is set.
14. After a failed extraction the variable keeps its previous value.
15. `#include` may be used on a `.cpp` file if you are careful.
:::

```quiz
[
  {
    "q": "Rapid fire: `cout << 17 % 5 << ' ' << 17 / 5;` prints…",
    "options": ["2 3", "3 2", "2 3.4", "3.4 2"],
    "answer": 0,
    "explain": "17 % 5 = 2 (remainder), 17 / 5 = 3 (integer division truncates)."
  },
  {
    "q": "Which needs `#include <iomanip>`?",
    "options": ["`hex`", "`boolalpha`", "`setprecision`", "`showpos`"],
    "answer": 2,
    "explain": "setw, setfill and setprecision are the parameterised manipulators in <iomanip>. The flag-style manipulators live in <iostream>."
  },
  {
    "q": "`int x = 5; cout << x++ << x;` prints…",
    "options": ["55", "56", "65", "66"],
    "answer": 1,
    "explain": "x++ yields the old value 5, then x becomes 6, so the second insertion prints 6."
  },
  {
    "q": "Which initialization refuses a narrowing conversion?",
    "options": ["`int x = 2.5;`", "`int x(2.5);`", "`int x{2.5};`", "all three"],
    "answer": 2,
    "explain": "Only uniform (brace) initialization prohibits implicit narrowing — that is why the slides prefer it."
  },
  {
    "q": "After `cin >> n` fails on the input `hello`, what must you call before further reading?",
    "options": ["`cin.clear()` only", "`cin.ignore(...)` only", "`cin.clear()` then `cin.ignore(...)`", "nothing — the next read recovers"],
    "answer": 2,
    "explain": "clear() unsets failbit; ignore() removes the offending characters still sitting in the buffer. Without both, every later read fails too."
  },
  {
    "q": "`const int n = read_from_cin();` compiles, but `constexpr int n = read_from_cin();` does not. Why?",
    "options": ["const cannot hold a function result", "constexpr needs a value known at compile time, before the program ever runs", "constexpr only works with int", "There is no real difference — both fail"],
    "answer": 1,
    "explain": "const only promises the value won't change after it's set, so a runtime result is fine. constexpr insists the value is known while compiling, before any input exists."
  },
  {
    "q": "`cin.good()` returns true when…",
    "options": ["failbit or badbit is set", "only eofbit is set", "no iostate bits are set at all", "the last read succeeded, regardless of state"],
    "answer": 2,
    "explain": "good() is true iff goodbit is the whole state — that means none of failbit, badbit, or eofbit are set."
  },
  {
    "q": "`cout << setw(6) << setfill('0') << 42 << 7;` prints…",
    "options": ["`0000420000007`", "`0000427`", "`00004207`", "`0000420007`"],
    "answer": 1,
    "explain": "setw applies to the next field only, so `42` is padded to 6 wide with the sticky fill character `0` (`000042`), then `7` prints at its natural width with no further padding: `0000427`."
  }
]
```
