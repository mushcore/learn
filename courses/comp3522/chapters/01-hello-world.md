---
title: Anatomy of Hello World
minutes: 12
---

Every C++ program you write this term starts from this shape. The program below is compiled with the same `g++` CLion uses, and it is editable.

## Line by line

Hovering a row of the table highlights the matching line of the program, and vice versa.

```cpp run pin HelloWorld.cpp
#include <iostream>

int main()
{
    std::cout << "Hello world!" << std::endl;
    return 0;
}
```

```tokens
[
  { "token": "std::endl", "story": "`std::endl` is an **output manipulator**: it writes a newline *and flushes* `cout`'s internal buffer immediately. A plain `'\\n'` just adds the newline character — the buffer flushes on its own later, which is usually fine and slightly cheaper.", "swap": { "with": "'\\n'", "why": "The screen output looks identical — `Hello world!` followed by a newline — because `main` returning also flushes the buffer. The difference only matters when a program writes a lot of output before it ends." } },
  { "token": "std::cout", "story": "The **scope resolution operator** `::` says \"look inside namespace `std`\" for whatever follows — here, `cout`. Without `using namespace std;`, every standard-library name needs its `std::` prefix." },
  { "token": "return 0;", "story": "`0` tells the operating system the program ran without errors. It's best practice to write it explicitly, but `main` is special: if you omit `return`, the compiler inserts `return 0;` for you." }
]
```

| Piece | What it is | Java equivalent |
|---|---|---|
| `#include <iostream>` | Preprocessor directive that pulls in the **header file** for the iostream part of the standard library. Angle brackets, no file extension, **no semicolon**. | `import` |
| `int main()` | The one function every program must have. Execution starts here. Returns an `int`. | `public static void main` |
| `std::cout` | Predefined **object** of type `ostream` — the standard output stream (`stdout` in C, `System.out` in Java). | `System.out` |
| `<<` | The **insertion operator**. An overloaded function applied to an output stream. | `print` |
| `::` | The **scope resolution operator**: "the `cout` that lives inside namespace `std`". | `.` on a package/class |
| `std::endl` | An **output manipulator**: inserts a newline **and flushes** the stream buffer. | `println` |
| `return 0;` | 0 tells the OS the program ran without errors. | — |

:::tip C++ vs Java, the one-sentence version
Java has an **API**; C++ has a **standard library**. Java has packages; C++ has **namespaces**. Java methods; C++ **member functions**.
:::

## `::` versus `.`

- **`::`** (scope resolution) → access **members of a namespace or class**: `std::cout`, `ios_base::hex`
- **`.`** (dot) → access **members of an object** (an instance): `cout.setf(...)`, `cin.clear()`

Both appear together in `std::cout.setf(std::ios_base::boolalpha)`: `std::` picks the namespace, `.setf` calls a member function on the object.

## What `<<` really does

`std::cout << n;` is a function call: `std::cout.operator<<(n);` whose header looks like `ostream& operator<<(int);`. It **returns the stream**, which is why you can chain: `cout << a << b << endl;` works because `(cout << a)` gives back `cout`.

## `endl` vs `'\n'`

`cout` has an internal buffer (a `streambuf`). `endl` writes `\n` **and flushes** the buffer to the screen. Writing `"\n"` just adds the newline; the buffer flushes on its own later. Both print a newline; `endl` is sometimes not necessary.

```cpp run
#include <iostream>

int main()
{
    std::cout << "one" << std::endl;   // newline + flush
    std::cout << "two\n";              // newline only
    std::cout << "three" << '\n';      // a char works too
    return 0;
}
```

## `main` and its return value

Two valid signatures:

```cpp
int main()
int main(int argc, char ** argv)   // command-line arguments
```

- `main` returns an `int`. **0 = ran without errors.**
- Best practice: leave `return 0;` at the end.
- **But the code still runs if `return` is omitted** — `main` is special and implicitly returns 0.

```cpp run
#include <iostream>

int main()
{
    std::cout << "no return statement, still fine" << std::endl;
}
```

## The C headers are still there

C header files are part of the C++ standard library, renamed with a `c` prefix and no `.h`:

| C | C++ |
|---|---|
| `math.h` | `<cmath>` |
| `limits.h` | `<climits>` |
| `stdlib.h` | `<cstdlib>` |

```challenge
{
  "prompt": "Make the program print exactly two lines: <code>COMP 3522</code> and then <code>Hello, World!</code>. Use <code>std::</code> (no <code>using</code>) and finish with <code>return 0;</code>.",
  "starter": "#include <iostream>\n\nint main()\n{\n    // your code here\n}\n",
  "expected": "COMP 3522\nHello, World!",
  "hints": ["Each line needs its own <code>std::endl</code> or <code>\\n</code>.", "<code>std::cout << \"COMP 3522\" << std::endl;</code>"],
  "solution": "#include <iostream>\n\nint main()\n{\n    std::cout << \"COMP 3522\" << std::endl;\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "Which operator is the *scope resolution* operator, used to access members of a namespace or class?",
    "options": ["`.`", "`::`", "`->`", "`<<`"],
    "answer": 1,
    "explain": "`::` reaches into a namespace or class (`std::cout`). The dot `.` reaches into an object instance (`cout.setf`)."
  },
  {
    "q": "`std::endl` inserts a newline and…",
    "options": ["clears the screen", "flushes the output stream buffer", "closes the stream", "does nothing else — it is identical to `'\\n'`"],
    "answer": 1,
    "explain": "endl is an output manipulator: newline + flush of cout's internal streambuf. `\\n` only adds the newline."
  },
  {
    "q": "If you omit `return 0;` at the end of `main`, the program will not compile.",
    "type": "tf",
    "answer": false,
    "explain": "It compiles and runs; main implicitly returns 0. Writing `return 0;` is best practice, not a requirement."
  },
  {
    "q": "`std::cout` is best described as…",
    "options": ["a function that prints", "a keyword", "a predefined object of type `ostream`", "a macro defined by the preprocessor"],
    "answer": 2,
    "explain": "cout is a global object of class ostream declared in `<iostream>`; `<<` is a member function called on it."
  },
  {
    "q": "Which of these are true about `#include <iostream>`? (select all)",
    "options": ["It is handled by the preprocessor, not the compiler", "It must end with a semicolon", "The angle brackets mean a standard-library header", "There is no `.h` extension"],
    "answer": [0, 2, 3],
    "explain": "Preprocessor directives end at the newline — never with a semicolon."
  },
  {
    "q": "The C header `math.h` is available in C++ as…",
    "options": ["`<math>`", "`<cmath>`", "`<math.hpp>`", "it is not available"],
    "answer": 1,
    "explain": "C headers are included in the C++ standard library as `<cNAME>`: cmath, climits, cstdlib…"
  }
]
```
