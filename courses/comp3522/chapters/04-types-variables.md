---
title: Types & variables
minutes: 14
---

C++ is a **strongly typed** language: every variable has a type, and that type never changes for the lifetime of the variable. Before you write a single expression, you need to know what a declaration looks like and what types are available.

## Declaring a variable

A variable declaration needs three things:

1. A **type**
2. A **variable name**
3. An **optional initialization**

```cpp
int num = 1;
```

`int` is the type, `num` is the name, `= 1` is the (optional) initialization. Leave the initialization off and `num` still exists — it just holds garbage until you assign it something.

## Naming identifiers

The rules the slides give for a legal identifier:

- Made of **letters**, **digits**, and **underscores**
- Must **not start with a digit**
- Begins with a **letter**, or (rarely — style discourages it) an **underscore**

`my_var`, `count2`, `_temp` are all legal. `2ndPlace` is not (starts with a digit), and `my-var` is not (hyphens aren't allowed in identifiers).

## The common fundamental types

| Category | Types | Notes |
|---|---|---|
| Boolean | `bool` | `true` / `false`, represented as **1 or 0** |
| Integer | `char`, `short`, `int`, `long` | whole numbers of increasing (or equal) size |
| Floating point | `float`, `double`, `long double` | numbers with a fractional part |
| No type | `void` | means "no type" — used for functions that return nothing, among other things |

```widget
type-sizes
```

Click through the cards above. Sizes are platform/compiler dependent — the C++ standard only guarantees minimums and relative orderings (`sizeof(short) <= sizeof(int) <= sizeof(long) <= sizeof(long long)`), not exact byte counts.

Run this to see the actual sizes on the compiler this site uses, plus the largest value an `int` can hold — the same call the `const_vs_constexpr.cpp` sample from lecture opens with:

```cpp run
#include <iostream>
#include <limits>
using namespace std;

int main()
{
    cout << "bool:        " << sizeof(bool) << " byte(s)" << endl;
    cout << "char:        " << sizeof(char) << " byte(s)" << endl;
    cout << "short:       " << sizeof(short) << " byte(s)" << endl;
    cout << "int:         " << sizeof(int) << " byte(s)" << endl;
    cout << "long:        " << sizeof(long) << " byte(s)" << endl;
    cout << "long long:   " << sizeof(long long) << " byte(s)" << endl;
    cout << "float:       " << sizeof(float) << " byte(s)" << endl;
    cout << "double:      " << sizeof(double) << " byte(s)" << endl;
    cout << "long double: " << sizeof(long double) << " byte(s)" << endl;

    cout << "int max:     " << numeric_limits<int>::max() << endl;
    return 0;
}
```

`numeric_limits<int>::max()` is `2147483647` on the vast majority of compilers today (a 32-bit `int`) — that number shows up straight from the lecture's `const_vs_constexpr.cpp` sample, so it's worth recognizing on sight.

## `char` is an integer type

```cpp run pin char-is-int.cpp
#include <iostream>
using namespace std;

int main()
{
    char letter = 'A';
    cout << letter << endl;          // printed as a character: A
    cout << (int)letter << endl;     // printed as a number: 65

    bool flag = true;
    cout << flag << endl;            // bool prints as 1, not "true"
    return 0;
}
```

This trips people up coming from Java: `char` is not a separate "character" category — it's an **integer type** that happens to be interpreted as a character by `cout` by default. `char letter = 'A';` declares a char holding the letter A; `cout << letter << endl;` prints it as a character, while `cout << (int)letter << endl;` casts it to `int` first and prints its numeric ASCII value, `65`. The same default-printing rule affects `bool`: `bool flag = true;` followed by `cout << flag << endl;` prints `1`, not the word `true`.

:::quiz Quiz note
`bool` values print as `1`/`0` **by default** — not the words `"true"`/`"false"`. You'll see later that `cout << boolalpha` can change this, but out of the box it's always `1` or `0`.
:::

## Quick recap

- Every variable declaration is **type, name, optional init** — in that order.
- Identifiers: letters/digits/underscores, never starting with a digit.
- `bool`, `char`/`short`/`int`/`long` (integers), `float`/`double`/`long double` (floating point), `void` (no type) are the fundamental types the slides call out.
- `char` is an integer type under the hood.

```quiz
[
  {
    "q": "Which three things does a C++ variable declaration need?",
    "options": ["Type, name, optional initialization", "Name, scope, access modifier", "Type, size, alignment", "Name, initialization, semicolon only"],
    "answer": 0,
    "explain": "The slides list exactly these three: type, variable name, and an optional initialization."
  },
  {
    "q": "Once a variable is declared with a type in C++, that type can later change.",
    "type": "tf",
    "answer": false,
    "explain": "C++ is strongly typed: a variable's type is fixed for its entire lifetime."
  },
  {
    "q": "Which of these is a **valid** C++ identifier?",
    "options": ["3count", "my_var", "class", "first name"],
    "answer": 1,
    "explain": "`my_var` is letters/underscore only and doesn't start with a digit. `3count` starts with a digit, `class` is a reserved keyword, and `first name` contains a space."
  },
  {
    "q": "By default, `cout << someBool;` prints…",
    "options": ["the words \"true\" or \"false\"", "1 or 0", "T or F", "it does not compile"],
    "answer": 1,
    "explain": "bool is represented as 1 or 0; the words \"true\"/\"false\" only appear once you turn on the `boolalpha` manipulator."
  },
  {
    "q": "Select every type below that is an **integer** type in C++.",
    "options": ["char", "float", "short", "long", "double"],
    "answer": [0, 2, 3],
    "explain": "char, short, and long are integer types (alongside int). float and double are floating-point types."
  },
  {
    "q": "What does this print?",
    "code": "char letter = 'A';\ncout << letter << \" \" << (int)letter;",
    "options": ["A 65", "65 A", "A A", "compile error"],
    "answer": 0,
    "explain": "cout prints a bare char as a character ('A'); casting it to int prints its numeric value (65)."
  },
  {
    "q": "`void` is best described as…",
    "options": ["a synonym for `int`", "a type meaning \"no type\"", "a keyword only usable in Java", "a floating-point type"],
    "answer": 1,
    "explain": "The slides list `void` under fundamental types as \"no type\" — most commonly used as a function return type meaning it returns nothing."
  },
  {
    "q": "`numeric_limits<int>::max()` prints `2147483647` on virtually every modern compiler.",
    "type": "tf",
    "answer": true,
    "explain": "That's the largest value a (typical 32-bit) int can hold — printed directly by the const_vs_constexpr.cpp sample from lecture."
  }
]
```
