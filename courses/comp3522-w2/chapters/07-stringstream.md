---
title: istringstream
minutes: 12
---

A `std::string` cannot pull a number out of `" 123abc"`; streams can. An **istringstream** is "a class that's just a wrapper around an existing string": it makes a string behave like `cin`, so every `>>` rule you know works on text already in memory.

## `istringstream` comes from `<sstream>`

- Great for reading and manipulating strings.
- Defined in the `<sstream>` header.
- Its actual type is `basic_istringstream<char>`; `istringstream` is the convenient name.

Because it is a stream, it has the same extraction operator, state bits (eofbit, failbit) and `clear()` as `cin`. The only new part is how you load text into it.

## Loading a string and extracting a number

```cpp run pin firstIss.cpp
// predict: What single value prints?
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    string input{" 123abc"};
    istringstream iss{input};
    int n;
    iss >> n;
    cout << n << endl;
    return 0;
}
```

`istringstream iss{input};` passes the string to the constructor, and `iss >> n;` does what `cin >> n` would do with that text typed at the keyboard: skip the leading whitespace, read the longest run that can be an `int`, and stop at the first character that cannot.

The slides also load the text **after** construction with `str()`, which is how you reuse one stream for many strings:

```cpp
istringstream iss;
int n;
iss.str(" 123abc");
iss >> n;
cout << n << endl;   // 123
```

## Extracting a number and then a string

```cpp run pin numberThenString.cpp
// predict: Write the two lines printed.
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    istringstream iss;
    int n;
    string aString;
    iss.str(" 123abc");
    iss >> n >> aString;
    cout << n << endl;
    cout << aString << endl;
    return 0;
}
```

`iss >> n >> aString;` chains two extractions: an `int`, then a **string**, which means one whitespace-delimited word. The slide's second input, `" 123a b c"`, gives the string only `a`, because the space after it is a delimiter.

The Week 1 simulator models `>>` on any text, which is what an istringstream does. With the `abc` preset the `int` extraction fails, stores 0 and leaves the letters in place, as with `cin`.

```widget
cin-sim
{ "reads": ["int n", "string aString"], "input": " 123abc", "presets": {" 123abc": " 123abc", " 123a b c": " 123a b c", "12 34 56": "12 34 56", "abc": "abc"} }
```

## Reading everything as strings: the `eof` loop

```cpp run pin eofLoop.cpp
// predict: Write the lines printed, one per line.
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    istringstream iss;
    iss.str(" 123a b c");
    while(!iss.eof())
    {
        string newString;
        iss >> newString;
        cout << newString << endl;
    }
    return 0;
}
```

`iss >> newString;` has a string as destination every pass, so digits are not special: a string stops only at whitespace. `while(!iss.eof())` runs until an extraction reaches the end of the text and sets eofbit.

:::warn The eof loop is fragile
Add one trailing space (`" 123a b c "`) and the loop runs once more than there are words: after the last word the stream is not at EOF yet, the next extraction finds only whitespace and fails, and an empty string prints. The robust form tests the read itself, `while (iss >> newString)`.
:::

## The real job: numbers typed one per line

The slides end with two programs that read lines from the keyboard, pull the leading number off each, and add them up: `getline` to take a whole line safely, an istringstream to parse it.

```cpp run pin sumReuse.cpp
// stdin: 12\n50\nabc\n 7 8
// predict: The lines typed are 12, 50, abc, and " 7 8". Write the line printed: sum = N
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    string line;
    int n, sum{0};
    istringstream iss; //create new iss
    while (getline(cin, line)) {
        iss.clear(); //clear iss of failbits
        iss.str(line); //load line string into re-used iss
        if (iss >> n) {
            sum += n;
        }
    }
    cout << "sum = " << sum << endl;
    return 0;
}
```

`if (iss >> n) {` is true only if the extraction succeeded, so a line like `abc` is skipped rather than breaking the sum, and only the leading number of a line is read. The one `istringstream iss;` is created once and reused for every line.

### Why `clear()` is there

In the video, deleting `clear()` and typing `12`, Enter, `50`, Enter makes the 50 silently **not added**. Extracting the int from `12` runs into the end of the text, which sets **eofbit**. `iss.str("50")` replaces the text but not the state bits, and a stream with eofbit set refuses to extract, so every later line is lost: **`str()` loads new text; only `clear()` resets the state.**

:::warn About the video's explanation
The video says the stream failed because it "was expecting the space character after 12". The precise cause is the eofbit left over from the previous line, which `str()` does not reset.
:::

## The alternative: a fresh stream per line

```cpp run pin sumFresh.cpp
// stdin: 12\n50\nabc\n 7 8
// predict: Same input as before. Write the line printed (sum = N). Does this version need clear()?
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    string line;
    int n, sum{0};
    while (getline(cin, line)) {
        istringstream iss{line}; //load line string into new iss
        if (iss >> n) {
            sum += n;
        }
    }
    cout << "sum = " << sum << endl;
    return 0;
}
```

`istringstream iss{line}; //load line string into new iss` builds a new stream every pass, so there are no leftover bits and no `clear()`/`str()` pair. Both work; the instructor prefers **reusing** one stream as "more effective in use of our memory".

:::quiz A failed extraction into an int
If `iss >> n` fails (the line was `abc`), g++ follows the C++11 rule: a failed numeric extraction **stores 0** in `n` and sets failbit. The `if (iss >> n)` guard keeps that 0 out of the sum.
:::

## `ostringstream`: the output direction

The output direction exists too. An `ostringstream` collects whatever you insert with `<<` and hands it back as one string with `str()`:

```cpp run pin oss.cpp
// predict: Write the one line printed, exactly: the string, then its length in parentheses.
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

int main()
{
    ostringstream oss;
    int a = 3522;
    int b = 2526;
    oss << "COMP " << a << " and " << b;
    string output = oss.str();
    cout << output << " (" << output.length() << " characters)" << endl;
    return 0;
}
```

`oss << "COMP " << a << " and " << b;` formats as `cout` would, but into memory, and `string output = oss.str();` extracts the result. Manipulators such as `setprecision` work here too, which is how you round a number into a string.

## Extract from four new strings

An `istringstream` reads its string exactly as `cin` reads the keyboard, failbit and eofbit included.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <sstream>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    istringstream iss{\"42 7.5 x9\"};\n    int a;\n    double b;\n    string c;\n    iss >> a >> b >> c;\n    cout << a + b << ' ' << c << endl;\n    return 0;\n}",
    "options": [
      "`49.5 x9`",
      "`49 x9`",
      "`42 7.5`",
      "`49.5 9`"
    ],
    "answer": 0,
    "explain": "`a` reads 42, `b` reads 7.5, `c` reads the word `x9`. 42 + 7.5 = 49.5 (the int is promoted to double). Output: `49.5 x9`."
  },
  {
    "type": "numeric",
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <sstream>\nusing namespace std;\n\nint main()\n{\n    istringstream iss{\"8 9 ten 11\"};\n    int n, sum = 0;\n    while (iss >> n)\n    {\n        sum += n;\n    }\n    cout << sum << endl;\n    return 0;\n}",
    "answer": 17,
    "explain": "The loop reads 8 and 9 (sum 17), then fails on `ten`. Failbit ends the loop, so 11 is never read."
  },
  {
    "q": "The input lines are `5`, `6` and `7`. This version reuses one stream but never calls `clear()`. What does it print?",
    "code": "#include <iostream>\n#include <sstream>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    string line;\n    istringstream iss;\n    int n, sum = 0;\n    while (getline(cin, line))\n    {\n        iss.str(line);\n        if (iss >> n)\n        {\n            sum += n;\n        }\n    }\n    cout << sum << endl;\n    return 0;\n}",
    "options": [
      "`5`",
      "`18`",
      "`0`",
      "`7`"
    ],
    "answer": 0,
    "explain": "Reading 5 from `\"5\"` hits the end of the string and sets eofbit. `str(line)` replaces the text but does not reset the state bits, so every later `iss >> n` fails at once. Only the first line counts: `5`. With `iss.clear();` first, the sum is 18."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <sstream>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    ostringstream oss;\n    oss << \"Lab\" << 3 << '-' << 2.50;\n    string s = oss.str();\n    cout << s << ' ' << s.size() << endl;\n    return 0;\n}",
    "options": [
      "`Lab3-2.5 8`",
      "`Lab3-2.50 9`",
      "`Lab 3 - 2.5 11`",
      "`Lab3-2.5 7`"
    ],
    "answer": 0,
    "explain": "An `ostringstream` formats exactly like `cout`: no separators, and 2.50 prints as `2.5` under the default format. The string is `Lab3-2.5`, which has 8 characters. Output: `Lab3-2.5 8`."
  }
]
```

```challenge
{
  "prompt": "Each input line is a name and a score. Read the lines with <code>getline</code>, pull the two fields out with an <code>istringstream</code>, and print the best student and the average:<pre>best: Bo 95\naverage: 82.3333</pre>",
  "starter": "#include <iostream>\n#include <sstream>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    string line, name, bestName;\n    int score, bestScore = -1, total = 0, count = 0;\n    // your code here\n    return 0;\n}\n",
  "stdin": "Ana 80\nBo 95\nCy 72\n",
  "expected": "best: Bo 95\naverage: 82.3333\n",
  "hints": [
    "A fresh stream per line needs no <code>clear()</code>: <code>istringstream iss{line}; iss >> name >> score;</code>",
    "Divide as a double: <code>(double)total / count</code>."
  ],
  "solution": "#include <iostream>\n#include <sstream>\n#include <string>\nusing namespace std;\n\nint main()\n{\n    string line, name, bestName;\n    int score, bestScore = -1, total = 0, count = 0;\n    while (getline(cin, line))\n    {\n        istringstream iss{line};\n        if (iss >> name >> score)\n        {\n            total += score;\n            ++count;\n            if (score > bestScore)\n            {\n                bestScore = score;\n                bestName = name;\n            }\n        }\n    }\n    cout << \"best: \" << bestName << ' ' << bestScore << endl;\n    cout << \"average: \" << (double)total / count << endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "Which header must you include to use `istringstream`?",
    "options": ["`<string>`", "`<sstream>`", "`<fstream>`", "`<iostream>`"],
    "answer": 1,
    "explain": "String streams live in <sstream>. <string> gives std::string and getline; <fstream> is for files."
  },
  {
    "q": "The purpose of an `istringstream` is best described as...",
    "options": ["a faster replacement for std::string", "a wrapper around an existing string so you can extract from it with `>>` like `cin`", "a way to read a file into a string", "a string that cannot be modified"],
    "answer": 1,
    "explain": "It is a stream whose source is a string, so all the >> behaviour you know from cin (skip whitespace, read what fits the type, set failbit) applies to text already in memory."
  },
  {
    "q": "What does this print?",
    "code": "istringstream iss{\" 123abc\"};\nint n;\niss >> n;\ncout << n;",
    "options": ["123abc", "123", "0", "an error: abc is not a number"],
    "answer": 1,
    "explain": "Leading whitespace is skipped, the digits 123 are read, and extraction stops at the first character that cannot be part of an int. abc stays in the stream."
  },
  {
    "q": "What does this print (two lines)?",
    "code": "istringstream iss;\nint n;\nstring aString;\niss.str(\" 123a b c\");\niss >> n >> aString;\ncout << n << endl << aString;",
    "options": ["123 then abc", "123 then a", "123a then b", "123 then a b c"],
    "answer": 1,
    "explain": "n gets 123 and the stream pauses at a; a string extraction reads one word, so it takes a and stops at the space. b c remain in the stream."
  },
  {
    "q": "With `iss.str(\" 123a b c\")`, the loop `while(!iss.eof()) { string s; iss >> s; cout << s << endl; }` prints...",
    "options": ["123 / a / b / c", "123a / b / c", "123abc", "a / b / c"],
    "answer": 1,
    "explain": "Every extraction is into a string, so 123a is one whitespace-delimited word; then b, then c, at which point eofbit is set and the loop ends."
  },
  {
    "q": "`iss.str(line)` replaces the stream's text AND resets its failbit/eofbit.",
    "type": "tf",
    "answer": false,
    "explain": "str() only replaces the contents. The state bits stay as they were, which is exactly why the reuse loop calls iss.clear() first."
  },
  {
    "q": "In the reuse loop, `iss.clear()` is called every pass in order to...",
    "options": ["empty the string inside the stream", "reset the failbit/eofbit left over from the previous line so the next extraction can work", "free the memory used by the stream", "convert the line to lowercase"],
    "answer": 1,
    "explain": "Reading 12 runs into the end of the text and sets eofbit; without clear() the next iss >> n fails immediately and that line's number is lost, which is what the video demonstrates."
  },
  {
    "q": "Which of these are valid ways to give an istringstream its text? (select all)",
    "options": ["`istringstream iss{input};`", "`iss.str(input);`", "`iss = input;`", "`istringstream iss(input);`"],
    "answer": [0, 1, 3],
    "explain": "Construct from a string (brace or parenthesis syntax) or load later with str(). You cannot assign a string directly to a stream."
  },
  {
    "q": "The input lines are `12`, `50`, `abc`, ` 7 8`. What does the reuse program print for the sum?",
    "type": "numeric",
    "answer": 69,
    "tolerance": 0,
    "explain": "12 + 50 = 62; abc fails the if (iss >> n) test and is skipped; from \" 7 8\" only the leading 7 is extracted: 62 + 7 = 69."
  },
  {
    "q": "Why does the instructor prefer reusing one `istringstream` over creating a new one inside the loop?",
    "options": ["the per-loop version does not compile", "reuse is more effective in its use of memory; both give the same functionality", "a new stream cannot be constructed from a string", "clear() is faster than the constructor"],
    "answer": 1,
    "explain": "Both approaches work (the fresh-stream version needs no clear()); the instructor prefers reuse as the more memory-efficient habit."
  },
  {
    "type": "fill",
    "q": "Complete the reuse loop so that each line's leading integer is added to the sum only when the extraction succeeds.",
    "code": "while (getline(cin, line)) {\n    iss.___;\n    iss.str(line);\n    if (iss >> n) {\n        sum += n;\n    }\n}",
    "answer": ["clear()", "clear ()"],
    "explain": "clear() resets the state bits before the next str() and extraction; without it the second and later lines fail."
  },
  {
    "q": "`ostringstream oss; oss << 35 << 22; string s = oss.str();` leaves `s` equal to...",
    "options": ["`\"57\"`", "`\"3522\"`", "`\"35 22\"`", "it does not compile"],
    "answer": 1,
    "explain": "Insertion formats each value as text and appends it, exactly as cout would print it: 35 followed by 22 is the string \"3522\". str() returns the collected text."
  }
]
```
