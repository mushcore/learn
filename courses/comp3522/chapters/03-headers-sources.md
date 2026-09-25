---
title: Header vs source files
minutes: 15
---

Unlike Java, C++ splits code across **two kinds of files**: header files **declare** interfaces (what exists, what it's called, what it takes), and source files **implement** them (the actual body of code). Java has no equivalent — a `.java` file both declares and defines a class in one place.

## Declaration vs definition

A **non-defining function declaration** (also called a *prototype*) states the return type, name, and parameters — but has **no body**, and ends with a semicolon:

```cpp
int add(int first, int second);
```

A **definition** is the full implementation:

```cpp
int add(int first, int second)
{
    return first + second;
}
```

Anything that calls `add` only needs to have *seen the declaration* — the compiler just needs to know the function's shape to generate a call to it. The actual body is resolved later, at link time.

## The calculator sample

The Week 1 sample code (`HelloWorld/`) builds this pattern with an `add` function and deliberately hides a `subtract` function. The three files, unchanged:

**calculator.hpp** — the header. Declares the interface:

```cpp
/*
 * Write function signatures in header file.
 * Header files act as an interface to other files. Only expose function
 * signatures that other files will need access to.
 */

#pragma once //prevents multiple inclusion of this header file during compilation

int add(int first, int second); //add function is usable by external files
//int subtract(int first, int second); //subtract function is hidden to external files if this line is commented
```

**calculator.cpp** — the source. Implements *both* functions:

```cpp
/*
 * Always #include the header file that's associated with this source file
 * Write the full implementations of any function signatures of the header file
 */

#include "calculator.hpp"

int add(int first, int second) {
    return first + second;
}

int subtract(int first, int second) {
    return first - second;
}
```

**main.cpp** — uses the calculator:

```cpp pin main.cpp
#include <iostream> //header file to use cout
#include "calculator.hpp" //include header files for functions that don't exist in this file. NEVER include .cpp file

using namespace std; //use std namespace to avoid needing to write `std::` with cout

int main() {
    cout << "Hello, World!" << endl;

    cout << add(10,5); //calls add function in calculator file
    //cout << subtract(10, 5); //calls subtract function in calculator file

    return 0;
}
```

Running this prints `Hello, World!` then `15` (from `add(10,5)`).

:::quiz Why can't main.cpp call subtract?
`subtract` is fully implemented in `calculator.cpp`, but `main.cpp` only includes `calculator.hpp`, and the `subtract` declaration is commented out of that header. While compiling `main.cpp` the compiler has never seen a function named `subtract`, so calling it is a compile error, not a linker error. Uncommenting the header line alone fixes it.
:::

```widget
compile-pipeline
```

## Rules for headers and sources

- **Quotes vs angle brackets**: `#include "calculator.hpp"` for your own headers (the preprocessor looks in your project directory first); `#include <iostream>` for library headers (angle brackets, no extension).
- **Never `#include` a `.cpp` file.** Only ever include headers. `main.cpp` connects to `calculator.cpp`'s code through `calculator.hpp`, never by including `calculator.cpp` directly.
- **`#pragma once`**, not `#ifndef` include guards. Both stop a header's contents from being pasted into the same file twice (which would redeclare everything and fail to compile), but `#pragma once` is one line instead of three (`#ifndef X_H` / `#define X_H` / `#endif`) and is what the slides prefer.
- **Every `.cpp` should have a matching `.hpp`** — except `main.cpp`. `main.cpp` is the one file that's allowed to exist without a header of its own, since nothing else needs to call into it.
- A source file **connects** to its header by `#include`-ing it and giving the *matching* function declaration as its definition — same return type, name, and parameter types.

## Multi-file build tools

CLion builds C++ projects with **CMake**, a build tool that plays the same role as Java's **ant**: ant reads `build.xml`; CMake reads **`CMakeLists.txt`**. Adding a new `.cpp`/`.hpp` pair to a project means adding it to `CMakeLists.txt` so the build knows to compile it.

Lab 1 has you add this line to `CMakeLists.txt` to turn on stricter compiler warnings:

```text
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -pedantic")
```

- `-Wall` — enable most common warnings (unused variables, etc.)
- `-Wextra` — enable additional warnings beyond `-Wall`
- `-pedantic` — warn about anything that isn't strict ISO C++

The `cpp run` blocks on this site compile with the same flags.

## Declaration before use

One file can still show the rule that makes the multi-file version work: the compiler must see a declaration before it sees a call.

```cpp run
#include <iostream>
using namespace std;

int add(int first, int second); // declaration — no body, ends with ;

int main()
{
    cout << add(10, 5) << endl; // compiler already knows add's shape here
    return 0;
}

int add(int first, int second) // definition — full body
{
    return first + second;
}
```

Without the standalone declaration line, the call in `main` is a compile error, because the compiler has not seen `add` yet. In the multi-file project, `#include "calculator.hpp"` supplies that declaration.

## Summary (from the slides)

1. One `main` method.
2. `main` may call other functions, just like C.
3. In C++, the source file is a `.cpp` file.
4. In C++, the header file is a `.hpp` file.
5. Put function declarations in the header file.
6. Put function declarations *and* definitions in the source file.
7. Use `#pragma once` instead of `#ifndef` to ensure a header file is only included once.

```quiz
[
  {
    "type": "fill",
    "q": "Fill in main.cpp's own-project include of the calculator header.",
    "code": "#include \"___\"",
    "answer": "calculator.hpp",
    "explain": "Your own headers are included with quotes and the full filename, e.g. #include \"calculator.hpp\"."
  },
  {
    "type": "fill",
    "q": "Fill in the directive calculator.hpp uses to prevent being included twice.",
    "code": "#pragma ___",
    "answer": "once",
    "explain": "#pragma once is the one-line alternative to #ifndef/#define/#endif include guards."
  },
  {
    "q": "What does a non-defining function declaration contain?",
    "options": ["Return type, name, parameters, and a body", "Only the function name", "Return type, name, and parameters, but no body — ends with a semicolon", "Only the parameter list"],
    "answer": 2,
    "explain": "A declaration (prototype) is the function's shape only — return type, name, parameters — with no body, terminated by a semicolon."
  },
  {
    "q": "In the calculator sample code, calling `subtract(10, 5)` from `main.cpp` fails to compile even though `calculator.cpp` fully implements `subtract`.",
    "type": "tf",
    "answer": true,
    "explain": "main.cpp only includes calculator.hpp, and the subtract declaration is commented out of that header — so the compiler never sees subtract while compiling main.cpp, regardless of what calculator.cpp contains."
  },
  {
    "q": "Which file(s) should `main.cpp` include to use the calculator's `add` function?",
    "options": ["`calculator.cpp`", "`calculator.hpp`", "Both `calculator.hpp` and `calculator.cpp`", "Neither — add is automatically visible"],
    "answer": 1,
    "explain": "You always include the header, never the .cpp file. #include \"calculator.hpp\" gives main.cpp the declaration it needs to call add."
  },
  {
    "q": "It is acceptable to `#include` a `.cpp` file directly instead of its header.",
    "type": "tf",
    "answer": false,
    "explain": "Never include a .cpp file. #include statements should only ever paste in headers; the rule is explicitly called out in the sample code's comments."
  },
  {
    "q": "Which preprocessor mechanism does the course prefer for preventing a header from being included more than once?",
    "options": ["`#ifndef` / `#define` / `#endif` include guards", "`#pragma once`", "`#include <once>`", "Nothing is needed — headers can't be included twice"],
    "answer": 1,
    "explain": "Use #pragma once instead of #ifndef guards — it does the same job in one line."
  },
  {
    "q": "Which include syntax is correct for your own project header versus a standard library header?",
    "options": ["Angle brackets for both", "Quotes for both", "Quotes for your own header, angle brackets for library headers", "Angle brackets for your own header, quotes for library headers"],
    "answer": 2,
    "explain": "`#include \"calculator.hpp\"` (quotes) for your own files, `#include <iostream>` (angle brackets) for standard library headers."
  },
  {
    "q": "Every `.cpp` file in a project should have a matching `.hpp` file, with one exception. Which file is that exception?",
    "options": ["`calculator.cpp`", "`main.cpp`", "The first file created in the project", "There is no exception"],
    "answer": 1,
    "explain": "main.cpp is the one source file allowed to stand alone without a matching header, since no other file needs to call into it."
  },
  {
    "q": "CMake's `CMakeLists.txt` plays the same role in a C++ project as which file does in a Java/ant project?",
    "options": ["`pom.xml`", "`build.xml`", "`web.xml`", "`manifest.json`"],
    "answer": 1,
    "explain": "The lab draws this comparison directly: cmake is a build tool similar to ant, and CMakeLists.txt is cmake's equivalent of ant's build.xml."
  },
  {
    "q": "What do the `-Wall -Wextra -pedantic` compiler flags do?",
    "options": ["Optimize the executable for speed", "Enable additional compiler warnings, including strict ISO C++ conformance checks", "Automatically fix common bugs", "Disable all compiler output"],
    "answer": 1,
    "explain": "-Wall and -Wextra turn on broader sets of warnings, and -pedantic warns about non-standard-conforming code — none of them change program behavior, they just surface more issues at compile time."
  },
  {
    "q": "If a function is called before its declaration or definition has appeared in the file (and no header brought in the declaration earlier), what happens?",
    "options": ["The linker silently ignores it", "It compiles fine because C++ scans the whole file first", "A compile error occurs — the compiler hasn't seen the function's shape yet", "It runs but returns garbage"],
    "answer": 2,
    "explain": "C++ processes a file top to bottom; the compiler needs to have already seen a declaration (or the full definition) before it can generate a call to that name."
  }
]
```
