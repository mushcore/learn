---
title: When input fails
minutes: 20
---

Every stream — including `cin` — carries a set of status bits called `ios_base::iostate`. Understanding these bits is the difference between a program that silently loops forever on bad input and one that recovers cleanly. This lesson reproduces the instructor's `AddIntegers.cpp` and `AddIntegersError.cpp` samples, which exist specifically to show what happens when you get this wrong.

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

You can test these bits directly with member functions on `cin`. The slides give exact "true iff" definitions — memorize the wording, it's exactly how a quiz will phrase it:

1. **`fail()`** — true iff `badbit` **or** `failbit` is set.
2. **`bad()`** — true iff `badbit` is set.
3. **`eof()`** — true iff `eofbit` is set.
4. **`good()`** — true iff `goodbit` is set (no bits are set at all).

## Worked examples: `int n; cin >> n;`

The slides' table (`*` stands for EOF):

| User input | `n` afterward | `failbit` | `eofbit` |
|---|---|---|---|
| `123 456` | `123` | Not set | Not set |
| `123` then EOF | `123` | Not set | Set |
| `hello` | No change | Set | Not set |
| EOF alone | No change | Set | Set |

Two things to notice and remember, because they're both trap material:

- On a **failed** read, `n` is left **completely unchanged** — not zeroed, not garbage, just whatever it held before the read was attempted.
- The offending characters (like `hello`) **stay in the buffer**. They are never consumed by a failed extraction, which means every later read against that same stream will *also* fail immediately, since the same bad characters are still sitting there waiting to be read.

```widget
cin-sim
{ "reads": ["int n"], "input": "hello", "presets": { "valid": "123 456", "letters": "hello", "eof after number": "123" } }
```

:::quiz A failed read does not clear itself
Once `failbit` is set, the stream stays in a failed state and every subsequent `cin >> anything` fails immediately too — without even looking at the buffer — until you explicitly call `cin.clear()`. This is the single most common reason a "read numbers in a loop" program appears to hang or skip input entirely.
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

`numeric_limits<streamsize>::max()` is "as many characters as the type can even represent," combined with `'\n'` as a stop condition — in practice this means "throw away everything up to and including the next newline." The instructor wraps this exact pair of calls into a reusable helper:

```cpp
void ignoreline(istream& is)
{
    is.clear();
    is.ignore(numeric_limits<streamsize>::max(), '\n');
}
```

## `AddIntegers.cpp` vs `AddIntegersError.cpp`

Both samples do the same thing on paper: read integers in a loop until the input stops being a number, then read words in a second loop until the user types `quit`. Only one of them works. Run both with the same input and compare.

### `AddIntegers.cpp`

```cpp run pin AddIntegers.cpp
// stdin: 5 6 x\nhello quit
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

Trace it: `while(cin >> n)` reads `5`, then `6`, then hits `x` — the extraction fails, `n` is unchanged, `x` stays in the buffer, and `failbit` stops the loop. Then `cin.clear();` unsets `failbit`, and `cin.ignore(numeric_limits<streamsize>::max(),'\n');` throws away everything up to and including the newline right after `x` — that discards the leftover `x` and the line break, leaving `hello quit` ready to read. `while(cin >> name)` then reads `hello` (prints it), reads `quit`, and `break`s. Full output:

```text
Enter a number: 
Enter a number: 5
Enter a number: 6
Enter a string, type ''quit'' to leave: 
Enter a string, type ''quit'' to leave: hello
Ending program
```

### `AddIntegersError.cpp`

```cpp run pin AddIntegersError.cpp
// stdin: 5 6 x\nhello quit
// predict: Input is 5 6 x then hello quit. Which prompts print, and does the string loop run?
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

```cpp diff AddIntegers.cpp (fixed)
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

Use the **Before / After** toggle on the program. The two added lines are the whole fix.

:::before Before
With `failbit` still set from the `x`, `while(cin >> name)` is false on its first check. The string loop never runs; the output jumps straight to `Ending program`.
:::

:::after After
`cin.clear();` resets the flags and `cin.ignore(numeric_limits<streamsize>::max(),'\n');` discards the rest of the bad line. Now `while(cin >> name)` reads `hello`, then `quit`, and exits normally.
:::

This is byte-for-byte the same first loop — it fails on `x` exactly the same way, leaving `failbit` set. The difference is what happens next: **there is no `cin.clear()` call anywhere before the second loop.** `cout << "Enter a string..."` still prints, because printing to `cout` has nothing to do with `cin`'s state — but the moment `while(cin >> name)` is evaluated, the stream is *already* in a failed state from the `x` read. `cin >> name` checks the stream's state before attempting to read anything at all; since it's already failed, the extraction refuses to run and the whole `while` condition is `false` on its very first check. The loop body never executes — not even once — so `hello` and `quit` are simply never read. Full output:

```text
Enter a number: 
Enter a number: 5
Enter a number: 6
Enter a string, type ''quit'' to leave: 
Ending program
```

```widget
cin-sim
{ "reads": ["int n"], "input": "5 6 x", "presets": { "fails on x": "5 6 x", "all valid": "5 6 7" } }
```

:::quiz Printing a prompt does not fix a failed stream
`cout << "Enter a string..." << endl;` always runs — it's unconditional. It is easy to assume that because a prompt printed, the next read must be ready to go. It isn't: a failed `cin` stays failed across any number of unrelated `cout` statements until something explicitly calls `cin.clear()`.
:::

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
    "options": ["n becomes 0, failbit set", "n is unchanged, failbit set", "n is unchanged, failbit not set", "n becomes garbage, failbit not set"],
    "answer": 1,
    "explain": "The slide's table shows: input 'hello' -> n: No change, failbit: set, eofbit: Not set."
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
      ["`hello`", "n unchanged, failbit set, eofbit not set"],
      ["EOF alone", "n unchanged, failbit set, eofbit set"]
    ],
    "explain": "A successful numeric read never sets failbit even right before EOF. Any non-numeric input leaves n untouched and sets failbit; hitting EOF while trying to read sets eofbit too."
  }
]
```
