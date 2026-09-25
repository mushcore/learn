---
title: Reading input with cin
minutes: 16
---

Java needs a `Scanner` and setup code, and C's `scanf` "was not our friend". C++ gives you `std::cin` and the **extraction operator** `>>`, simpler and safer, with one sharp edge.

## The extraction operator `>>`

```cpp
int m, n;
cin >> m >> n; // input "12 34", or "12" <enter> "34"
```

Both forms of input above work identically. That's because `>>`:

1. Skips any leading whitespace (spaces, tabs, newlines).
2. Reads as many characters as fit the target type.
3. Stops at the first character that doesn't fit the type — and **leaves that character in the buffer** for the next read.

The third rule is why chaining `cin >> m >> n` works: each `>>` picks up where the previous one stopped. It is also the source of the failure modes in the next lesson.

## Reading an int

```cpp run
// stdin: 8
#include <iostream>
using namespace std;

int main() {
    int hours;
    cin >> hours;
    cout << "Today I slept for " << hours << " hours" << endl;
    return 0;
}
```

## Reading a floating point number

```cpp run
// stdin: 72.5
#include <iostream>
using namespace std;

int main() {
    double weight_kg;
    cin >> weight_kg;
    cout << "I weigh " << weight_kg << " kilos" << endl;
    return 0;
}
```

## Reading a string

```cpp run
// stdin: Jeffrey
#include <iostream>
using namespace std;

int main() {
    string name;
    cin >> name;
    cout << "Hello, " << name << endl;
    return 0;
}
```

`cin >> name` for a `std::string` reads one whitespace-delimited word — it stops at the first space, tab, or newline, not at the end of the line.

```widget
cin-sim
{ "reads": ["int hours", "double weight_kg", "string name"], "input": "8 72.5 Jeffrey", "presets": { "ints and text": "8 72.5 Jeffrey", "extra spaces": "  8   72.5   Jeffrey  " } }
```

## Reading into a fixed-size buffer

The slides show this example and reject it:

```cpp
constexpr int first_name_length = 5;
char first_name[first_name_length];
cin >> first_name; // NOOOOOO DON'T DO THIS
```

`char[]` decays to `char*`, so `cin` sees a raw pointer, not the array's length. It cannot know `first_name` holds only 5 characters and keeps writing past the end of the array for any input longer than 4 characters: memory you don't own.

:::danger char arrays with cin are unsafe by default
`cin >> someCharArray;` never checks how big `someCharArray` is; any word longer than the array overflows it. "Is `cin >> first_name;` on a `char[5]` safe as long as you never type more than 5 characters?" **False**: the null terminator needs a slot too (4 characters + `'\0'`).
:::

## The fix: `setw` on input

`<iomanip>`'s `setw` isn't just for output. Streamed into `cin`, it caps how many characters `>>` will pull for the *next* extraction into a `char[]`:

```cpp
#include <iomanip>
constexpr int first_name_length = 5;
char first_name[first_name_length];
cin >> setw(5) >> first_name;
```

`setw(5)` here means "read at most 4 characters, then write the null terminator" — the 5th slot is always reserved for `'\0'`, matching the array's real capacity.

## Walking through `readName.cpp`

```cpp run pin readName.cpp
// stdin: Jonathan
// predict: Input is Jonathan. What prints?
#include <iostream>
#include <iomanip>

using namespace std;
int main() {
    constexpr int firstNameLength = 5;
    char firstName[firstNameLength];
    cin >> setw(5) >> firstName;
    cout << firstName;
    return 0;
}
```

```tokens
[
  { "token": "setw(5) >> ", "line": 8, "story": "`setw(5)` caps the *next* extraction at 4 real characters plus a null terminator — exactly `firstName`'s 5-byte capacity. It's the fix the slides recommend for the classic char-array overflow bug.", "swap": { "with": "", "why": "Run it: the output is still `Jona`. On a modern compiler (`-std=c++20`) `cin >> firstName` already resolves to a **bounds-aware overload** that exists specifically for fixed-size arrays like `char firstName[5]` — it caps the read at 4 characters plus a terminator on its own, `setw` or not. This is a real safety improvement over the raw `char*` version the slides warn about: try `char* p = firstName; cin >> p;` instead and it won't even compile in C++20 — that unsafe overload was removed from the standard. `setw` still matters once you're working through an actual pointer, but a bare fixed-size array already has this protection built in." } }
]
```

The instructor's sample, with input `Jonathan`. `constexpr int firstNameLength = 5;` declares the capacity as a compile-time constant, and `char firstName[firstNameLength];` allocates a 5-byte array: room for 4 real characters plus the null terminator. `cin >> setw(5) >> firstName;` reads at most 4 characters from `"Jonathan"` (`J`, `o`, `n`, `a`), writes `'\0'` after them, and stops. The rest of the word (`than`) is left in the input buffer, ready for the *next* extraction. `cout << firstName;` prints the null-terminated C-string it holds: `Jona`.

```widget
cin-sim
{ "reads": ["char firstName[5] (setw(5))"], "input": "Jonathan", "presets": { "full name": "Jonathan", "short name": "Al" } }
```

```quiz
[
  {
    "type": "fill",
    "q": "Fill in the manipulator that caps how many characters the next read pulls into firstName.",
    "code": "cin >> ___(5) >> firstName;",
    "answer": "setw",
    "explain": "setw(5) streamed into cin limits the next extraction to at most 4 real characters plus a null terminator."
  },
  {
    "q": "For `int m, n; cin >> m >> n;`, which of these inputs works?",
    "options": ["Only \"12 34\" on one line", "Only 12, Enter, 34 on two lines", "Both \"12 34\" and 12-Enter-34", "Neither — cin needs a comma"],
    "answer": 2,
    "explain": "cin >> skips any leading whitespace, including newlines, so both forms work identically."
  },
  {
    "q": "When `cin >> n` (n is an int) hits a character that isn't a digit, what happens to that character?",
    "options": ["It's discarded silently", "It's left in the input buffer for the next read", "It causes the program to crash", "It's converted to 0"],
    "answer": 1,
    "explain": "Extraction stops at the first character that doesn't fit the target type and leaves it in the buffer — it does not consume it."
  },
  {
    "q": "Why is `cin >> first_name;` on `char first_name[5];` dangerous?",
    "options": ["cin cannot read char arrays at all", "char[] decays to char*, so cin has no way to know the array's real length", "cin always reads exactly 5 characters", "It only works with std::string, not char[]"],
    "answer": 1,
    "explain": "The array decays to a pointer, so cin cannot see its bound and will write past the end for any input word of 5+ characters."
  },
  {
    "q": "What does `cin >> setw(5) >> first_name;` actually limit the read to?",
    "options": ["Exactly 5 characters, no terminator", "At most 4 characters, plus a null terminator", "At most 5 words", "Nothing — setw only works on cout"],
    "answer": 1,
    "explain": "setw(5) reserves one slot for the null terminator, so at most 4 real characters are written into the 5-byte array."
  },
  {
    "q": "In readName.cpp, input is `Jonathan` and the array is `char firstName[5];` read with `cin >> setw(5) >> firstName;`. What does `cout << firstName;` print?",
    "code": "char firstName[5];\ncin >> setw(5) >> firstName;\ncout << firstName;",
    "options": ["Jonathan", "Jon", "Jona", "Jonat"],
    "answer": 2,
    "explain": "setw(5) allows 4 real characters (J, o, n, a) plus the null terminator, so it prints 'Jona'."
  },
  {
    "q": "`cin >> someString;` for a `std::string` reads the entire rest of the line, including spaces.",
    "type": "tf",
    "answer": false,
    "explain": "cin >> on a string reads one whitespace-delimited word and stops at the first space, tab, or newline."
  },
  {
    "q": "`setw(5)` streamed before a `cin >>` on a char array behaves like which of these on the output side?",
    "options": ["setfill", "setprecision", "setw(value) — a width limit, just applied to reading instead of writing", "It has no output-side equivalent"],
    "answer": 2,
    "explain": "It's the same manipulator, setw, applied to an extraction; it caps how many characters get written."
  },
  {
    "q": "Getting console input in C++ compared to Java's Scanner and C's scanf/fgets+sscanf is generally...",
    "options": ["More verbose than both", "Simpler than both, once you know cin's rules", "Impossible without a third-party library", "Identical in syntax to Java's Scanner"],
    "answer": 1,
    "explain": "The instructor calls scanf 'not our friend' and Java's Scanner setup non-trivial; cin >> is comparatively simple."
  },
  {
    "q": "Which header must you include to use setw on cin?",
    "options": ["<iostream> only", "<iomanip>", "<limits>", "<string>"],
    "answer": 1,
    "explain": "setw, setfill, and setprecision all live in <iomanip>."
  },
  {
    "q": "After `cin >> setw(5) >> firstName;` reads `Jonathan` into `firstName`, what is left in the input buffer?",
    "options": ["Nothing — the whole word was consumed", "than", "Jonathan", "A single space"],
    "answer": 1,
    "explain": "Only 'Jona' was written into the array; the remaining characters 'than' are still unread in the buffer."
  }
]
```
