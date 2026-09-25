---
title: "#define, const, constexpr"
minutes: 16
---

A constant is a value that **cannot change after it is initialized**, Java's `final`. C++ has three ways to make one, from three eras of the language.

## Old style: `#define`

```cpp
#define PI 3.1415926535
```

This is a **preprocessor directive**, not a C++ statement — the same family as `#include`. That means two things:

- **No semicolon.** A preprocessor directive ends at the newline, just like `#include <iostream>` has none.
- It is **pure textual replacement**. Before the compiler ever sees your code, the preprocessor swaps every occurrence of `PI` for the literal text `3.1415926535`. `PI` is never a variable, never has a type, and never occupies memory.

That textual replacement is also the pitfall. Define a constant as an expression instead of a single number:

```cpp
#define TWICE 2 + 3
int x = TWICE * 4;   // you probably expect 20
```

After preprocessing this is literally `int x = 2 + 3 * 4;`, which is `14`, not `20`, because multiplication binds tighter than the pasted `+`. `const` and `constexpr` don't have this problem: they are real, typed values the compiler reasons about, not text pasted into your source.

## `const`: mandatory initialization

The slide's example is a short list of lines that do and don't compile:

```cpp
const int some_value = 1;
some_value = 9;              // ERROR!
const int some_other_value;  // ERROR!
```

`some_value = 9;` fails because you promised this value wouldn't change. `const int some_other_value;` fails for a different reason: **it is mandatory to set a `const` value in its declaration.** There is no "declare now, assign later" for a `const`.

The valid forms from the same slide use the three initialization styles you already know (`=`, `()`, `{}`); the initializer just has to be present:

```cpp
const float pi(3.14159);
const char top_score{'A'};
const bool larger{some_value < pi};
```

## `const` as a function parameter

```cpp
void myFunc(const int num) { /* ... */ }
```

Marking a parameter `const` is a promise to whoever reads the signature: **"I promise not to change this value."** The function can read `num` but cannot reassign it.

## `constexpr`: known at compile time

```cpp
constexpr double another_value{1.3};
```

`constexpr` means **"to be evaluated at compile time."** The compiler computes and bakes in the value while compiling, so no runtime work is needed to produce it.

The key distinction the slides draw between the two:

- A **`constexpr`** *must* be assigned a value by compile time.
- A **`const`** *can* be assigned a value after compile time (i.e., while the program is running).

That difference is exactly what `const_vs_constexpr.cpp` demonstrates.

## Walking through `const_vs_constexpr.cpp`

Input is `7`:

```cpp run pin const_vs_constexpr.cpp
// stdin: 7
// predict: Input is 7. Write the five lines printed.
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
	// This compiles.  A const never changes.
	const int constantinput = input;

	// This does not compile. A constexpr must be known at compile-time.
	//constexpr int constantinput2 = input;

	cout << constantinput << endl;
	return 0;
}
```

```tokens
[
  { "token": "const", "line": 19, "story": "`const` only promises **\"won't change after it's set\"** — it tolerates a value that's only known at runtime, like the `input` this line reads from `cin`.", "swap": { "with": "constexpr", "why": "`constexpr` demands a value known **at compile time**, before the program has run and before `cin >> input;` has read anything. Run it: the compiler now rejects this line with an error like `the value of 'input' is not usable in a constant expression` — the exact error shown for the commented-out line below it." } }
]
```

With `7` typed: `numeric_limits<int>::max()` prints `2147483647`, the largest `int` on this platform; `cout << a << endl;` prints `1`; `a <<= 3;` shifts `1` (`001`) to `8` (`1000`); `cout << (a |= b) << endl;` makes `a = 8 | 2 = 10` (`1010`) and, because `|=` is an expression, prints the updated value `10`. Then `cin >> input;` reads the `7`, `const int constantinput = input;` compiles because a `const` only needs its value known when the program *runs*, and `cout << constantinput << endl;` prints `7`.

## Why the `constexpr` line is commented out

The commented-out line does not compile:

```cpp
constexpr int constantinput2 = input;
```

`input` only gets a value when `cin >> input` runs, at runtime. A `constexpr` needs a value the compiler can compute **while compiling**, before any input exists. The error:

```text
error: the value of 'input' is not usable in a constant expression
note: 'input' was not declared 'constexpr'
```

## `constexpr` as an array size

The `readName.cpp` sample uses `constexpr` for exactly the kind of value that *is* known at compile time — a fixed array size:

```cpp
constexpr int firstNameLength = 5;
char firstName[firstNameLength];
```

An array's size has to be known when the compiler lays out memory for it, so `constexpr` is the idiomatic choice here — not `const`, and definitely not `#define`. This is the same `firstNameLength` used later with `cin >> setw(5) >> firstName;` to stop `cin` from overflowing the 5-byte buffer.

```quiz
[
  {
    "q": "A `const` variable must be initialized at the point where it is declared.",
    "type": "tf",
    "answer": true,
    "explain": "const int x; with no initializer is a compile error. It is mandatory to set a const value in its declaration."
  },
  {
    "q": "A `constexpr` variable can be initialized from a value read via `cin`.",
    "type": "tf",
    "answer": false,
    "explain": "constexpr must be known at compile time, before the program runs and before any input exists. Only const tolerates a runtime-determined value."
  },
  {
    "q": "`#define PI 3.1415926535` needs a semicolon at the end, just like a normal C++ statement.",
    "type": "tf",
    "answer": false,
    "explain": "#define is a preprocessor directive, not a statement — it ends at the newline with no semicolon, same as #include."
  },
  {
    "q": "What best describes what `#define PI 3.1415926535` actually does?",
    "options": ["Creates a typed double variable named PI", "Textually replaces every occurrence of PI with 3.1415926535 before compilation", "Creates a const double at compile time", "Creates a constexpr double"],
    "answer": 1,
    "explain": "The preprocessor performs pure text substitution — PI never becomes a real typed variable."
  },
  {
    "q": "Which of these lines fails to compile? `const int some_other_value;`",
    "type": "tf",
    "answer": true,
    "explain": "A const declared with no initializer at all is an error — there's no later point where you're allowed to assign it."
  },
  {
    "q": "Run `const_vs_constexpr.cpp` with input `7`. What is printed on the line right after `numeric_limits<int>::max()`?",
    "code": "int a = 1;\nint b = 2;\ncout << a << endl;\na <<= 3;\ncout << a << endl;\ncout << (a |= b) << endl;",
    "options": ["8", "1", "2", "10"],
    "answer": 1,
    "explain": "a starts at 1 and that first cout << a << endl; runs before a <<= 3 changes it."
  },
  {
    "q": "In the same run, what does `cout << (a |= b) << endl;` print, given a is 8 and b is 2 at that point?",
    "options": ["8", "2", "10", "1010"],
    "answer": 2,
    "explain": "a |= b sets a = 8 | 2 = 10 (binary 1000 | 0010 = 1010), and the expression's value — the updated a — is what gets printed."
  },
  {
    "q": "Why does `constexpr int constantinput2 = input;` fail to compile, when `const int constantinput = input;` (same `input`) compiles fine?",
    "options": [
      "constexpr variables cannot be int",
      "input has the wrong type",
      "constexpr requires a value known at compile time; input is only known once cin reads it at runtime",
      "There is no real difference — both fail"
    ],
    "answer": 2,
    "explain": "const only promises 'won't change after it's set' and tolerates a runtime value. constexpr promises 'known while compiling', which a cin read can never satisfy."
  },
  {
    "q": "In `readName.cpp`, `constexpr int firstNameLength = 5;` is used as...",
    "options": ["A runtime input buffer", "An array size, known at compile time", "A #define macro", "A function parameter"],
    "answer": 1,
    "explain": "Array sizes must be known at compile time, making constexpr the idiomatic choice — exactly the value later reused in cin >> setw(5)."
  },
  {
    "q": "`void myFunc(const int num) {...}` means...",
    "options": [
      "num is a compile-time constant",
      "The function promises not to change num's value inside the function body",
      "num must be passed by reference",
      "This is invalid C++ syntax"
    ],
    "answer": 1,
    "explain": "const on a parameter is a promise to callers and readers: the function will not reassign that parameter internally."
  },
  {
    "type": "spotbug",
    "q": "Click every line involved in the compile error in this program.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    const int n;\n    n = 5;\n    cout << n << endl;\n    return 0;\n}",
    "answer": [5, 6],
    "explain": "Line 5: `const int n;` has no initializer, which is itself mandatory-initializer error — a const must be set at the point of declaration. Line 6: `n = 5;` then tries to assign it afterward, which fails for the separate reason that a const, once set, can never change."
  }
]
```
