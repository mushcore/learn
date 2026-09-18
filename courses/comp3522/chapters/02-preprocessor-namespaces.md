---
title: Preprocessor & namespaces
minutes: 12
---

Before `g++` compiles a single line of your code, a separate program called the **preprocessor** runs over the text and rewrites it. Understanding what it does — and what it does *not* do — clears up a lot of "why doesn't this have a semicolon?" confusion.

## Preprocessor directives

A line starting with `#` is a **preprocessor directive**: an instruction for the preprocessor, not the compiler.

- Directives are **not followed by a semicolon** — they end at the newline, not at a `;`.
- `#include` pulls in the text of a header file (a library, or `#define` (constants), or your own `.hpp`).
- `#define` defines a constant or macro (the old-style way to define constants, before `const`/`constexpr`).
- `#ifdef`, `#ifndef`, `#if`, `#endif` do **conditional compilation** — they can make the preprocessor skip or include blocks of code before the compiler ever sees them.

```cpp
#include <iostream>
#define PI 3.1415926535
```

:::quiz Semicolons and preprocessor directives
A likely trap question: "`#include <iostream>` must end with a semicolon." **False.** Directives end at the newline. If you put a `;` after one, you've just added an (often harmless) empty statement to your *code* — the directive itself never wants one.
:::

## Namespaces

C++ has no packages the way Java does. Instead it has **namespaces**:

- Similar to a Java package — they exist to **prevent name collisions**.
- Every function and object in the standard C++ library lives inside the **`std`** namespace: `std::cout`, `std::endl`, `std::string`, and so on.
- `::` is the scope resolution operator — "the `cout` that lives inside `std`".

Without namespaces, if two libraries both declared a `sort` function, including both headers would be an error. `std::sort` and `mylib::sort` can coexist.

## The `using` keyword

```cpp run pin using-namespace-std.cpp
#include <iostream>

//ALL names from std namespace visible below here
using namespace std;

int main()
{
    cout << "Hello world!" << endl;
    return 0;
}
```

`using` is C++'s answer to Java's `import` — it exists purely to **save typing**. It does not change what code is valid, only what you're allowed to write without the `std::` prefix. The pinned example adds one line, `using namespace std;`, and from there down `int main()` can write `cout << "Hello world!" << endl;` and `return 0;` with no `std::` prefix anywhere.

The slides show three variations of this idea. Try each below.

### Option 1: `using namespace std;`

Every name from `std` becomes visible from that line down to the end of the file: after `using namespace std;`, `int main()` can call `cout << "Hello world!" << endl;` and `return 0;` with no `std::` prefix anywhere.

### Option 2: `using std::cout;`

Only the names you explicitly list become visible — nothing else from `std` is unlocked.

```cpp run
#include <iostream>

//ONLY cout and endl from std namespace visible below here
using std::cout;
using std::endl;

int main()
{
    cout << "Hello world!" << endl;
    return 0;
}
```

### Option 3: inside `main`

Placing the `using` declarations *inside* the function scopes them to that function only. Nothing outside `main` gets the shortcut.

```cpp run
#include <iostream>

int main()
{
    //ONLY cout and endl from std namespace visible in this FUNCTION
    using std::cout;
    using std::endl;
    cout << "Hello world!" << endl;
    return 0;
}
```

```widget
namespaces
```

## When to use `using namespace std;`

The course's own sample code (`main.cpp` in `HelloWorld`) uses `using namespace std;` at the top of the file, right after the includes — it's the least typing for a small program with one file.

The risk shows up as projects grow:

- It pulls **every** name from `std` into scope — including ones you didn't ask for. If you also `using namespace` a second library that happens to define a function called, say, `count` or `distance`, you get an **ambiguous name** compile error that has nothing to do with your logic.
- Putting `using namespace std;` in a **header file** is especially bad: every `.cpp` file that `#include`s that header inherits the blanket `using`, whether it wants it or not. That's why the rule of thumb is: never put `using namespace` in a header.

Option 2 (name a handful of specific names) and Option 3 (scope it to one function) both avoid this by only unlocking exactly what you use.

## What happens if you use neither?

If a program calls `cout` with no `std::` prefix and no `using` declaration anywhere in scope, the compiler has never heard of the name `cout` — it only knows `std::cout`.

```cpp
#include <iostream>

int main()
{
    cout << "Hello world!" << endl;   // no std::, no using — compiler doesn't know "cout"
    return 0;
}
```

```text
main.cpp: In function 'int main()':
main.cpp:5:5: error: 'cout' was not declared in this scope; did you mean 'std::cout'?
    5 |     cout << "Hello world!" << endl;
      |     ^~~~
      |     std::cout
main.cpp:5:31: error: 'endl' was not declared in this scope; did you mean 'std::endl'?
    5 |     cout << "Hello world!" << endl;
      |                               ^~~~
      |                               std::endl
```

This is a compiler error, not a preprocessor error — it happens because name lookup runs during compilation, well after the preprocessor has already finished inserting `<iostream>`'s contents. Modern g++ is even helpful enough to suggest the fix (`did you mean 'std::cout'?`), but it still refuses to guess for you.

```quiz
[
  {
    "type": "fill",
    "q": "Fill in the keyword that unlocks every name from std without a prefix.",
    "code": "using ___ std;",
    "answer": "namespace",
    "explain": "using namespace std; pulls every name from the std namespace into scope from that line down."
  },
  {
    "q": "A preprocessor directive like `#define PI 3.1415926535` must end with a semicolon.",
    "type": "tf",
    "answer": false,
    "explain": "Directives are instructions for the preprocessor, not the compiler, and end at the newline — never with a semicolon."
  },
  {
    "q": "Which of these is a preprocessor directive used for conditional compilation?",
    "options": ["`#include`", "`#define`", "`#ifdef`", "`using`"],
    "answer": 2,
    "explain": "`#ifdef`/`#ifndef`/`#if`/`#endif` let the preprocessor include or skip blocks of code. `#include` pulls in a header; `#define` defines a constant; `using` is not a preprocessor directive at all."
  },
  {
    "q": "The standard C++ library's functions and objects (like `cout`) live in which namespace?",
    "options": ["`main`", "`cpp`", "`std`", "`iostream`"],
    "answer": 2,
    "explain": "Everything in the standard library — cout, endl, string, sort, etc. — lives inside namespace std."
  },
  {
    "q": "What does `using namespace std;` most closely resemble in Java?",
    "options": ["`public static void main`", "`import`", "a class definition", "a try/catch block"],
    "answer": 1,
    "explain": "using is C++'s equivalent of Java's import — it saves typing by unlocking names without a prefix, it doesn't change what's valid."
  },
  {
    "q": "With `using std::cout; using std::endl;` at file scope (not `using namespace std;`), which of these can you write without a `std::` prefix?",
    "options": ["Only `cout` and `endl`", "Every name in `std`", "Nothing — you still need `std::`", "Only names used inside `main`"],
    "answer": 0,
    "explain": "Option 2 only unlocks the specific names you list with using — everything else in std still needs the std:: prefix."
  },
  {
    "q": "If `using std::cout;` is written *inside* `main()`, where is `cout` usable without the `std::` prefix?",
    "options": ["Everywhere in the file", "Only inside `main`", "Only in functions defined after `main`", "Nowhere — it has no effect inside a function"],
    "answer": 1,
    "explain": "Option 3 scopes the using declaration to the enclosing block — here, main — so it has no effect outside that function."
  },
  {
    "q": "Why is `using namespace std;` considered risky inside a header file?",
    "options": ["It slows down compilation significantly", "It causes a linker error every time", "Every .cpp file that includes the header inherits the blanket using, risking name collisions it didn't ask for", "Header files cannot contain using declarations at all"],
    "answer": 2,
    "explain": "A using namespace in a header propagates to every file that includes it, which can silently create ambiguous-name errors as a project grows."
  },
  {
    "q": "What compiler error appears if you write `cout << \"hi\";` with `#include <iostream>` but no `using` declaration and no `std::` prefix?",
    "options": ["A preprocessor error about a missing header", "'cout' was not declared in this scope", "A linker error about an undefined symbol", "It compiles fine but prints nothing"],
    "answer": 1,
    "explain": "The compiler only knows the name std::cout; without std:: or a using declaration, plain cout is an unknown identifier — a compile-time name lookup error, not a preprocessor problem."
  },
  {
    "q": "The COMP 3522 sample code's `main.cpp` uses `using namespace std;`.",
    "type": "tf",
    "answer": true,
    "explain": "It's a small, single-file program, so the convenience outweighs the risk — but the same choice would be discouraged in a header or a large multi-file project."
  },
  {
    "type": "spotbug",
    "q": "Click the line with the bug — this program fails to compile.",
    "code": "#include <iostream>;\nusing namespace std;\nint main()\n{\n    cout << \"Hello world!\" << endl;\n    return 0;\n}",
    "answer": 1,
    "explain": "Line 1: a preprocessor directive ends at the newline, not at a `;`. That stray semicolon becomes a lone empty statement sitting outside any function, which is not valid C++ — g++ rejects it with something like \"extra ';' outside of a function is invalid in C++\"."
  }
]
```
