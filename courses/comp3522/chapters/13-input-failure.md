---
title: When input fails
minutes: 20
---

Every stream, including `cin`, carries status bits called `ios_base::iostate`. They are the difference between a program that loops forever on bad input and one that recovers. The samples `AddIntegers.cpp` and `AddIntegersError.cpp` show both.

## The `iostate` bits

`ios_base::iostate` contains four bits:

- **`failbit`** — an operation failed (e.g. you tried to read an `int` and the next characters weren't a number).
- **`badbit`** — a stream error (something more serious than a bad conversion, like a lost connection).
- **`eofbit`** — set when the stream hits end-of-file.
- **`goodbit`** — literally zero; no bits are set, meaning everything is fine.

`cin` converts to `true` exactly when `cin.fail()` is `false` — that's the entire reason this idiom works:

```cpp
int n;
if (cin >> n) { /* n was read successfully */ }
while (cin >> n) { /* loop while reads keep succeeding */ }
```

## Testing the bits with member functions

Member functions on `cin` test the bits. The slides' exact "true iff" wording:

1. **`fail()`** — true iff `badbit` **or** `failbit` is set.
2. **`bad()`** — true iff `badbit` is set.
3. **`eof()`** — true iff `eofbit` is set.
4. **`good()`** — true iff `goodbit` is set (no bits are set at all).

## Worked examples: `int n; cin >> n;`

The slides' table (`*` stands for EOF):

| User input | `n` afterward (slide) | `n` with g++ | `failbit` | `eofbit` |
|---|---|---|---|---|
| `123 456` | `123` | `123` | Not set | Not set |
| `123` then EOF | `123` | `123` | Not set | Set |
| `hello` | No change | **0** | Set | Not set |
| EOF alone | No change | no change | Set | Set |

Two traps:

- The slide says a failed read leaves `n` unchanged. Since C++11 that holds only when the read meets the end of the input before any character. When there are characters and they are not a number, as with `hello`, `n` is set to **0**. Start with `int n = 42;`, type `hello`, and g++ prints `0`.
- The offending characters (`hello`) **stay in the buffer**. A failed extraction never consumes them, so every later read on the same stream also fails.

### One extraction at a time

Each step is one `cin >> n`: the cursor skips whitespace, reads what fits, and the bits light up when a read fails.

```widget
cin-sim
{ "reads": ["int n"], "input": "hello", "presets": { "valid": "123 456", "letters": "hello", "eof after number": "123", "EOF alone": "" } }
```

:::quiz A failed read does not clear itself
Once `failbit` is set, every later `cin >> anything` fails immediately, without looking at the buffer, until `cin.clear()` is called. This is the usual reason a read-numbers-in-a-loop program seems to hang or skip input.
:::

## Recovering: `clear()` and `ignore()`

Fixing a failed stream is a two-step process:

1. **`cin.clear();`** — unsets `failbit`/`badbit`/`eofbit`. This does **not** remove the bad characters from the buffer — it only resets the stream's status so reads are attempted again.
2. **`cin.ignore(...)`** — throws away characters from the buffer so the next real read doesn't immediately hit the same bad data.

`ignore` has several forms, from the slides:

```cpp
ignore();               // skips/ignores/tosses 1 character
ignore(128);             // skips 128 characters, or until EOF
ignore(128, '\n');       // skips up to 128 characters, or until EOF, or until '\n'
ignore(LLONG_MAX, '\n'); // throws away up to LLONG_MAX characters, or until '\n'
```

## The idiomatic way to flush a whole line

`128` or `LLONG_MAX` are both awkward magic numbers. The standard idiom uses `<limits>`:

```cpp
#include <limits>
cin.clear(); // unsets failbits
cin.ignore(numeric_limits<streamsize>::max(), '\n');
```

`numeric_limits<streamsize>::max()` is as many characters as the type can represent; with `'\n'` as the stop condition it means "throw away everything up to and including the next newline." The instructor wraps the pair in a helper:

```cpp
void ignoreline(istream& is)
{
    is.clear();
    is.ignore(numeric_limits<streamsize>::max(), '\n');
}
```

## `AddIntegers.cpp` vs `AddIntegersError.cpp`

Both samples read integers in a loop until the input stops being a number, then read words in a second loop until the user types `quit`. Only one of them works.

### `AddIntegers.cpp`

```cpp run pin AddIntegers.cpp
// stdin: 5 6 x\nhello quit
// predict: Input is 5 6 x, Enter, hello quit. Write every line printed.
#include <iostream>
#include <limits>
using namespace std;
int main() {
    int n;
    cout << "Enter a number: " << endl;
    while(cin >> n)
    {
        cout << "Enter a number: " << n << endl;
    }

    string name = "";
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(),'\n');
    cout << "Enter a string, type ''quit'' to leave: " << endl;
    while(cin >> name)
    {
        if(name == "quit") {
            break;
        }
        cout << "Enter a string, type ''quit'' to leave: " << name << endl;
    }

    cout << "Ending program\n";
    return 0;
}
```

`while(cin >> n)` ends when the read of `x` fails: `failbit` is set, `n` becomes 0 and `x` stays in the buffer. `cin.clear();` unsets `failbit`, and `cin.ignore(numeric_limits<streamsize>::max(),'\n');` discards the leftover `x` and the newline, so `while(cin >> name)` starts on a clean line and stops at `quit`.

### `AddIntegersError.cpp`

```cpp run pin AddIntegersError.cpp
// stdin: 5 6 x\nhello quit
// predict: Same input. Write every line printed.
#include <iostream>
#include <limits>
using namespace std;
int main() {
    int n;
    cout << "Enter a number: " << endl;
    while(cin >> n)
    {
        cout << "Enter a number: " << n << endl;
    }

    string name = "";

    cout << "Enter a string, type ''quit'' to leave: " << endl;
    while(cin >> name)
    {
        if(name == "quit") {
            break;
        }
        cout << "Enter a string, type ''quit'' to leave: " << name << endl;
    }

    cout << "Ending program\n";
    return 0;
}
```

The only difference is the missing `cin.clear();` and `cin.ignore(...)` pair before `string name = "";`. `cout << "Enter a string..."` still prints, because `cout` does not depend on `cin`'s state. But `while(cin >> name)` checks the stream before reading anything, finds `failbit` still set from the `x`, and is false on its very first check.

```widget
cin-sim
{ "reads": ["int n", "int n", "int n", "string name"], "input": "5 6 x\\nhello quit", "presets": { "fails on x": "5 6 x\\nhello quit", "all valid": "5 6 7\\nhello quit" } }
```

## Track failbit through four new inputs

For each run, follow the stream state after every extraction; once failbit is set, later reads do nothing until `clear()`.

```quiz
[
  {
    "q": "The input is `12 x 5`. What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int a = -1, b = -1, c = -1;\n    cin >> a >> b >> c;\n    cout << a << ' ' << b << ' ' << c << ' ' << cin.fail() << endl;\n    return 0;\n}",
    "options": [
      "`12 0 -1 1`",
      "`12 -1 -1 1`",
      "`12 0 5 0`",
      "`12 -1 5 1`"
    ],
    "answer": 0,
    "explain": "a reads 12. b meets `x`: the read fails, g++ stores 0 in b and sets failbit. The read into c is skipped because the stream has already failed, so c keeps -1. `fail()` is true, printed as 1. Output: `12 0 -1 1`."
  },
  {
    "type": "numeric",
    "q": "The input is `abc` on the first line and `9` on the second. What does this print?",
    "code": "#include <iostream>\n#include <limits>\nusing namespace std;\n\nint main()\n{\n    int n = -1;\n    cin >> n;\n    cin.clear();\n    cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n    cin >> n;\n    cout << n << endl;\n    return 0;\n}",
    "answer": 9,
    "explain": "The first read fails on `abc` (n becomes 0, failbit set). `clear()` unsets failbit, but `abc` is still in the buffer; `ignore(..., '\\n')` throws it away up to and including the newline. The second read then finds `9`. Without the `ignore`, it would fail on `abc` again."
  },
  {
    "q": "The input is `8` followed immediately by end of file (no Enter). What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int n = 0;\n    cin >> n;\n    cout << n << ' ' << cin.eof() << ' ' << cin.fail() << endl;\n    return 0;\n}",
    "options": [
      "`8 1 0`",
      "`8 0 0`",
      "`0 1 1`",
      "`8 1 1`"
    ],
    "answer": 0,
    "explain": "The read takes `8`, looks for another digit and hits end of file, so eofbit is set. A value was read, so failbit stays clear. Output: `8 1 0`, the slide's `123*` row with a new number."
  },
  {
    "q": "The input is `4 5 6 done 7`. What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int n, sum = 0, count = 0;\n    while (cin >> n)\n    {\n        sum += n;\n        ++count;\n    }\n    cout << sum << ' ' << count << endl;\n    return 0;\n}",
    "options": [
      "`15 3`",
      "`22 4`",
      "`15 4`",
      "`0 0`"
    ],
    "answer": 0,
    "explain": "`while (cin >> n)` runs while the stream is good. It reads 4, 5 and 6 (sum 15, count 3), then fails on `done`, which ends the loop. The 7 is never read. Output: `15 3`."
  }
]
```

```challenge
{
  "prompt": "Read integers until one fails, then print <code>count 3 sum 12</code>. Recover the stream, throw away the rest of that line, read one word and print <code>word quit</code>. The test input is <code>3 8 1 x</code> on one line and <code>quit</code> on the next.",
  "starter": "#include <iostream>\n#include <limits>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    int n, count = 0, sum = 0;\n    string word;\n    // your code here\n    return 0;\n}\n",
  "stdin": "3 8 1 x\nquit\n",
  "expected": "count 3 sum 12\nword quit\n",
  "hints": [
    "Loop with <code>while (cin >> n)</code>.",
    "Recover with <code>cin.clear();</code> then <code>cin.ignore(numeric_limits<streamsize>::max(), '\\n');</code> before <code>cin >> word;</code>."
  ],
  "solution": "#include <iostream>\n#include <limits>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    int n, count = 0, sum = 0;\n    string word;\n    while (cin >> n)\n    {\n        ++count;\n        sum += n;\n    }\n    cout << \"count \" << count << \" sum \" << sum << endl;\n    cin.clear();\n    cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n    cin >> word;\n    cout << \"word \" << word << endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "type": "fill",
    "q": "Fill in the member function call that unsets `failbit`/`badbit`/`eofbit` on `cin`.",
    "code": "cin.___();",
    "answer": "clear",
    "explain": "cin.clear() resets the stream's status bits so reads are attempted again; it does not touch the buffer."
  },
  {
    "type": "fill",
    "q": "Fill in the idiomatic 'flush the rest of the line' call.",
    "code": "cin.ignore(numeric_limits<___>::max(), '\\n');",
    "answer": "streamsize",
    "explain": "numeric_limits<streamsize>::max() is as many characters as the type can represent, combined with '\\n' as a stop condition."
  },
  {
    "type": "reorder",
    "q": "Put these lines in order to build a program that reads integers until one fails, recovers the stream, then reads a name and prints it.",
    "compile": true,
    "stdin": "5 6 x\nhello quit",
    "lines": [
      "#include <iostream>",
      "#include <limits>",
      "using namespace std;",
      "int main() {",
      "    int n;",
      "    while (cin >> n) {}",
      "    cin.clear();",
      "    cin.ignore(numeric_limits<streamsize>::max(), '\\n');",
      "    string name;",
      "    cin >> name;",
      "    cout << name << endl;",
      "    return 0;",
      "}"
    ],
    "explain": "The integer loop fails on 'x', leaving failbit set and 'x' in the buffer. clear() unsets the bits, ignore() discards the leftover 'x' and newline, then cin >> name reads 'hello' cleanly."
  },
  {
    "q": "Which iostate bit means \"stream reached end-of-file\"?",
    "options": ["failbit", "badbit", "eofbit", "goodbit"],
    "answer": 2,
    "explain": "eofbit is specifically set when the stream hits EOF."
  },
  {
    "q": "According to the slides' exact wording, `fail()` returns true iff...",
    "options": ["only badbit is set", "only failbit is set", "badbit or failbit is set", "eofbit is set"],
    "answer": 2,
    "explain": "fail() is true iff badbit OR failbit is set — either one triggers it."
  },
  {
    "q": "For `int n; cin >> n;` with input `hello`, what happens to `n` and failbit?",
    "options": ["n becomes 0, failbit set", "n is unchanged, failbit set, eofbit set", "n is unchanged, failbit not set", "n becomes garbage, failbit not set"],
    "answer": 0,
    "explain": "g++ follows C++11: characters are present but are not a number, so n is set to 0 and failbit is set (eofbit is not). The slide's table says 'No change' for n; that was the C++98 rule and still holds when the read meets EOF before any character."
  },
  {
    "q": "After a failed `cin >> n`, what happens to the offending characters still in the buffer?",
    "options": ["They are discarded automatically", "They remain in the buffer, causing later reads to also fail", "They are converted to whitespace", "cin crashes the program"],
    "answer": 1,
    "explain": "A failed extraction never consumes the bad characters — they stay put, so subsequent reads against the same data fail too."
  },
  {
    "q": "What does `cin.clear();` do by itself?",
    "options": ["Removes bad characters from the buffer", "Unsets the failbit/badbit/eofbit flags but leaves buffer contents untouched", "Reads and discards one line", "Terminates the program"],
    "answer": 1,
    "explain": "clear() only resets the stream's status bits; you still need ignore() to actually discard the bad data."
  },
  {
    "q": "Which ignore() call throws away characters up to and including the next newline, using the largest possible count?",
    "options": ["ignore()", "ignore(128)", "ignore(128, '\\n')", "ignore(numeric_limits<streamsize>::max(), '\\n')"],
    "answer": 3,
    "explain": "This is the idiomatic 'flush the rest of the line' call: as many characters as the type can hold, stopping at the newline."
  },
  {
    "q": "In AddIntegersError.cpp, why does the second `while (cin >> name)` loop never execute even once?",
    "options": ["name is declared with the wrong type", "cin is already in a failed state from reading 'x', so cin >> name refuses to attempt any read", "The stdin data ran out before the loop started", "There's a syntax error in the loop condition"],
    "answer": 1,
    "explain": "failbit is still set from the earlier failed integer read; without cin.clear(), any further cin >> immediately reports failure without even trying, so the while condition is false from the start."
  },
  {
    "q": "In AddIntegers.cpp, what two calls sit between the integer loop and the string loop that AddIntegersError.cpp is missing?",
    "options": ["cin.sync() and cin.tie()", "cin.clear() and cin.ignore(numeric_limits<streamsize>::max(), '\\n')", "cin.reset() and cin.flush()", "cout.flush() and cin.close()"],
    "answer": 1,
    "explain": "AddIntegers.cpp calls cin.clear() to unset the failbit, then cin.ignore(...) to discard the leftover 'x' and newline before the second loop starts."
  },
  {
    "q": "`cout << \"prompt\" << endl;` printing successfully proves that `cin` is currently in a good (non-failed) state.",
    "type": "tf",
    "answer": false,
    "explain": "Writing to cout is entirely independent of cin's status bits; a prompt can print while cin is still stuck in a failed state."
  },
  {
    "q": "With input `5 6 x` followed by `hello quit`, what is the very last line AddIntegers.cpp prints?",
    "options": ["Enter a string, type ''quit'' to leave: quit", "Ending program", "Enter a string, type ''quit'' to leave: hello", "Enter a number: x"],
    "answer": 1,
    "explain": "After the second loop breaks on reading 'quit' (without printing it), the program falls through to cout << \"Ending program\\n\";."
  },
  {
    "type": "spotbug",
    "q": "This is `AddIntegersError.cpp` again. Click the line where the missing recovery call belongs — right before it, the program needs `cin.clear(); cin.ignore(numeric_limits<streamsize>::max(), '\\n');`.",
    "code": "#include <iostream>\n#include <limits>\nusing namespace std;\nint main() {\n    int n;\n    cout << \"Enter a number: \" << endl;\n    while(cin >> n)\n    {\n        cout << \"Enter a number: \" << n << endl;\n    }\n\n    string name = \"\";\n\n    cout << \"Enter a string, type ''quit'' to leave: \" << endl;\n    while(cin >> name)\n    {\n        if(name == \"quit\") {\n            break;\n        }\n        cout << \"Enter a string, type ''quit'' to leave: \" << name << endl;\n    }\n\n    cout << \"Ending program\\n\";\n    return 0;\n}",
    "answer": 12,
    "explain": "Line 12: right before `string name = \"\";`, AddIntegers.cpp inserts `cin.clear();` and `cin.ignore(numeric_limits<streamsize>::max(), '\\n');`. Without them, failbit is still set from the failed `x` read, so the second `while (cin >> name)` never runs."
  },
  {
    "type": "match",
    "q": "Match each `cin` member function to its exact 'true iff' definition from the slides.",
    "pairs": [
      ["`fail()`", "true iff badbit or failbit is set"],
      ["`bad()`", "true iff badbit is set"],
      ["`eof()`", "true iff eofbit is set"],
      ["`good()`", "true iff goodbit is set (no bits set)"]
    ],
    "explain": "fail() is the OR of badbit and failbit; the other three each test exactly one bit — good() is only true when nothing is set at all."
  },
  {
    "type": "match",
    "q": "For `int n; cin >> n;`, match the typed input to what happens to `n` and the status bits, per the slides' table.",
    "pairs": [
      ["`123 456`", "n = 123, failbit not set, eofbit not set"],
      ["`123` then EOF", "n = 123, failbit not set, eofbit set"],
      ["`hello`", "n = 0 (C++11), failbit set, eofbit not set"],
      ["EOF alone", "n unchanged, failbit set, eofbit set"]
    ],
    "explain": "A successful numeric read never sets failbit even right before EOF. Non-numeric characters set failbit and store 0 in n (the slide's 'No change' is the pre-C++11 rule); meeting EOF before any character sets both bits and leaves n alone."
  }
]
```
