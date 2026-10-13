---
title: Types & variables
minutes: 14
---

C++ is a **strongly typed** language: every variable has a type, and that type never changes for the lifetime of the variable.

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

Sizes are platform/compiler dependent — the C++ standard only guarantees minimums and relative orderings (`sizeof(short) <= sizeof(int) <= sizeof(long) <= sizeof(long long)`), not exact byte counts.

The actual sizes on this compiler, plus the largest value an `int` can hold, the call `const_vs_constexpr.cpp` opens with:

```cpp run
// predict: Write the size printed for each type, then the int max.
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

`numeric_limits<int>::max()` is `2147483647` on nearly every compiler today (a 32-bit `int`); the number is worth recognizing on sight.

## `char` is an integer type

```cpp run pin char-is-int.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

int main()
{
    char letter = 'A';
    cout << letter << endl;          // as a character
    cout << (int)letter << endl;     // as a number

    bool flag = true;
    cout << flag << endl;
    return 0;
}
```

`char` is an **integer type** that `cout` prints as a character by default; `cout << (int)letter << endl;` asks for its numeric code instead. `bool` has the same default: it prints as a number until the `boolalpha` manipulator from the output lesson is on.

## Read four new declarations and their output

New variables of each fundamental type; the trick in each is how the type stores the value.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    char c = 'a';\n    c = c + 2;\n    cout << c << ' ' << (int)c << endl;\n    return 0;\n}",
    "options": [
      "`c 99`",
      "`a2 99`",
      "`c c`",
      "`99 c`"
    ],
    "answer": 0,
    "explain": "`char` is an integer type: `'a'` is 97, and 97 + 2 = 99, which is the code for `'c'`. Printed as a `char` it shows `c`; cast to `int` it shows 99. Output: `c 99`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    bool done = 7;\n    cout << done << ' ' << done + done << endl;\n    return 0;\n}",
    "options": [
      "`1 2`",
      "`7 14`",
      "`true 2`",
      "`1 1`"
    ],
    "answer": 0,
    "explain": "Any non-zero value stored in a `bool` becomes `true`, which `cout` prints as `1`. In `done + done` each `bool` is promoted to the `int` 1, so the sum is 2. Output: `1 2`."
  },
  {
    "q": "Which of these are valid C++ identifiers? (select all)",
    "options": [
      "`_count`",
      "`2ndPlace`",
      "`total_score`",
      "`my-var`",
      "`int`"
    ],
    "answer": [
      0,
      2
    ],
    "explain": "Identifiers use letters, digits and underscores and cannot start with a digit: `_count` and `total_score` are valid. `2ndPlace` starts with a digit, `my-var` contains a minus sign (it would parse as `my - var`), and `int` is a keyword."
  },
  {
    "type": "text",
    "q": "On the lab machines' g++, what does this print? Type the digits.",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout << sizeof(char) << sizeof(short) << sizeof(int) << sizeof(long long) << endl;\n    return 0;\n}",
    "answer": [
      "1248"
    ],
    "explain": "`sizeof` gives bytes: `char` 1, `short` 2, `int` 4, `long long` 8. With no separators the four numbers print as `1248`. Only `sizeof(char)` is guaranteed to be 1; the others are what this compiler uses."
  }
]
```

```challenge
{
  "prompt": "Declare an <code>int</code> named <code>labs</code> holding 10, a <code>double</code> named <code>weight</code> holding 2.5, a <code>char</code> named <code>grade</code> holding <code>'B'</code> and a <code>bool</code> named <code>passed</code> holding <code>true</code>. Print them on one line separated by single spaces: <code>10 2.5 B 1</code>.",
  "starter": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    // declarations here\n\n    // one cout line here\n    return 0;\n}\n",
  "expected": "10 2.5 B 1\n",
  "hints": [
    "A char literal uses single quotes: <code>'B'</code>.",
    "Without <code>boolalpha</code>, <code>true</code> prints as <code>1</code>."
  ],
  "solution": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int labs = 10;\n    double weight = 2.5;\n    char grade = 'B';\n    bool passed = true;\n    cout << labs << ' ' << weight << ' ' << grade << ' ' << passed << endl;\n    return 0;\n}\n"
}
```

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
