---
title: std::string & getline
minutes: 16
---

In C a "string" was a `char` array you terminated with `'\0'` yourself. C++ gives you a class, `std::string` from `<string>`, with a lower-case `s`.

## Three ways to create a string

```cpp run pin strings.cpp
// predict: Write the two lines this prints (watch the spacing on the first one).
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string s1;              // default constructor: an empty string
    string s2 = "Hello";    // initialized from a literal
    string s3{"world!"};    // uniform initialization does the same thing
    cout << s1 << " " << s2 << " " << s3 << endl;
    cout << "s2 has " << s2.size() << " characters, s3 has " << s3.length() << endl;
    return 0;
}
```

All three **statically allocate a string object** (on the stack, no `new`); `string s1;` calls the **default constructor**, a real string that happens to be empty, and `string s3{"world!"};` uses the brace style the course prefers. "In C++, the string object needn't terminate with `\0`": the class keeps its own length.

## Member functions: size, length, c_str

The slides list three:

| Member function | Returns |
|---|---|
| `size()` | the number of characters |
| `length()` | the number of characters (same thing!) |
| `c_str()` | a **non-modifiable** standard C `char` array |

```cpp run pin sizeAndCstr.cpp
// stdin: Vancouver
// predict: The input is Vancouver. What are the three lines printed?
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string line;
    cin >> line;
    cout << line.size() << endl;
    cout << line.length() << endl;
    const char * c_line = line.c_str();
    cout << c_line << endl;
    return 0;
}
```

`const char * c_line = line.c_str();` is the bridge back to C: a pointer to a null-terminated copy for functions that expect a `char *`.

## Comparing strings

Where Java needed `compareTo` or `equals`, C++'s relational operators work directly on strings and compare **lexicographically**: character by character, by character code.

```cpp run pin compare.cpp
// predict: true or false for each of the four comparisons?
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string a = "apple";
    string b = "bear";
    cout << boolalpha;
    cout << (b > a) << endl;
    cout << (a == "apple") << endl;
    cout << ("Zebra" < a) << endl;
    cout << (a < "apples") << endl;
    return 0;
}
```

`cout << (b > a) << endl;` is the slide's example. Unlike Java, `==` compares the **contents**. Character codes decide the order, so every upper-case letter (`'Z'` is 90) sorts before every lower-case one (`'a'` is 97), and when one string runs out with all its characters matched, the shorter one is smaller.

## Picking out characters: `[ ]` and `at`

Square brackets and the `at(size_type pos)` member function both return a **reference** to the character, so you can read it or assign to it.

```cpp run pin indexing.cpp
// predict: Write everything printed, including the last line.
#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

int main()
{
    string s = "hello";
    cout << s[0] << endl;
    cout << s.at(1) << endl;
    s[0] = 'j';
    s.at(4) = '!';
    cout << s << endl;
    try {
        cout << s.at(10) << endl;
    } catch (const out_of_range& e) {
        cout << "at(10) threw out_of_range" << endl;
    }
    return 0;
}
```

`cout << s[0] << endl;` and `cout << s.at(1) << endl;` are the slide's two examples. Because both return a reference, `s[0] = 'j';` changes the string in place. The difference is a bad index: `s[10]` on a 5-character string is **undefined behaviour**, while `s.at(10)` **checks the bounds** and throws `std::out_of_range`, which the `try`/`catch` turns into a message.

## A short aside on classes

Three lines that call three different pieces of the `string` class, a preview of Week 3:

```cpp run pin classesAside.cpp
// predict: Write the three lines printed, brackets included.
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string first;           // calls default constructor
    string second = first;  // calls copy constructor
    first = second;         // calls assignment operator

    second = "COMP 3522";   // changes second only
    cout << "first: [" << first << "]" << endl;
    cout << "second: [" << second << "]" << endl;
    first = second;         // assignment operator again: copies the characters
    cout << "first: [" << first << "]" << endl;
    return 0;
}
```

`string second = first;` is a declaration with an initializer, so it calls the **copy constructor**; `first = second;` has no type in front, so it calls the **assignment operator** on an object that already exists. A copy is a copy: changing one string afterwards does not change the other.

## Reading a whole line: `getline`

`cin >> input` stops at the first whitespace, useless for `Jeff Yim`. `getline`, from `<string>`, reads a **line** into the string, **tosses the newline**, and returns the stream.

```cpp run pin getlineBasics.cpp
// stdin: Hello World
// predict: The input is "Hello World". Write the two bracketed outputs.
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string word;
    string rest;
    cin >> word;            // stops at the space
    getline(cin, rest);     // takes everything up to the newline
    cout << "[" << word << "]" << endl;
    cout << "[" << rest << "]" << endl;
    return 0;
}
```

`cin >> word;` stops at the space without consuming it, and `getline(cin, rest);` starts exactly where it stopped. The signature from the slides:

```cpp
string input;
getline(cin, input); // returns cin
```

### The optional third argument: a delimiter

The full form is `getline(inputstream, input, delimiter)`; the default delimiter is the newline:

```cpp run pin delimiter.cpp
// stdin: Yim,Jeff,COMP3522
// predict: The input is Yim,Jeff,COMP3522. Write the one line printed.
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string last, first, course;
    getline(cin, last, ',');
    getline(cin, first, ',');
    getline(cin, course);      // the last field ends at the newline (or EOF)
    cout << first << " " << last << " takes " << course << endl;
    return 0;
}
```

`getline(cin, last, ',');` reads up to the comma and throws the comma away; the plain `getline(cin, course);` takes the rest of the line.

## When getline stops, and what it sets

The slides: getline stops at **EOF** (sets **eofbit**), at the **delimiter** (extracted and tossed), or at too many characters (**failbit**). Reading **no character at all** sets eofbit and failbit.

The slide's table: what one `getline(cin, input)` call leaves in `input` (`*` is EOF).

| cin user input | `string input` | bits set |
|---|---|---|
| `Hello World` then Enter | `Hello World` | none |
| `Hello\nworld\n` | `Hello` | none |
| `\nWorld\n` | EMPTY | none |
| `Hello*` | `Hello` | eofbit |
| `Hello\n*` | `Hello` | none |
| `*` | slide: no change; g++: EMPTY | eofbit **and** failbit |

:::warn The last row with real g++
g++ empties the string on input `*`: `getline` erases it first, then finds nothing to read. The string keeps its value only when eofbit was already set by an earlier call, as on the second call after `Hello*`.
:::

### One getline call at a time

Watch where the cursor stops, which character is tossed, and when the bits light up.

```widget
getline-sim
{ "input": "Hello\\nworld\\n", "calls": 2 }
```

```cpp run pin getlineTable.cpp
// stdin: Hello\nworld\n
// predict: With the input above, write the two lines printed, in the program's own [input] eof=.. fail=.. format.
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string input = "unchanged";
    getline(cin, input);
    cout << "[" << input << "] eof=" << cin.eof() << " fail=" << cin.fail() << endl;
    getline(cin, input);
    cout << "[" << input << "] eof=" << cin.eof() << " fail=" << cin.fail() << endl;
    return 0;
}
```

`string input = "unchanged";` makes a kept value visible, and each `getline(cin, input);` is one call of the table. An empty line is a **successful** read of zero characters; reaching EOF after some characters is not a failure; reading nothing at all is.

## The standard idiom: process a stream line by line

The slides' pattern:

```cpp run pin lineByLine.cpp
// stdin: first line\nsecond line\nthird
// predict: Write the four lines printed: one per loop pass, then the read N lines summary.
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string line;
    int count = 0;
    while (getline(cin, line))
    {
        count++;
        cout << count << ": " << line << endl;
    }
    cout << "read " << count << " lines" << endl;
    return 0;
}
```

The value of `while (getline(cin, line))` is `cin`, true as long as failbit is clear. A last line with no newline after it is still returned (eofbit only); the call after it reads nothing, sets failbit and ends the loop, so you never test `eof()` yourself.

## The classic trap: `cin >>` followed by `getline`

Ask for a number with `>>`, then ask for a name with `getline`, and the name comes back empty.

```cpp run pin mixTrap.cpp
// stdin: 42\nJeff Yim
// predict: The user types 42, Enter, then Jeff Yim. Write the one line printed: n = ..., name = [...]
#include <iostream>
#include <string>
using namespace std;

int main()
{
    int n;
    string name;
    cin >> n;
    getline(cin, name);
    cout << "n = " << n << ", name = [" << name << "]" << endl;
    return 0;
}
```

```cpp diff mixTrap.cpp (fixed)
// stdin: 42\nJeff Yim
#include <iostream>
#include <string>
#include <limits>
using namespace std;

int main()
{
    int n;
    string name;
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    getline(cin, name);
    cout << "n = " << n << ", name = [" << name << "]" << endl;
    return 0;
}
```

:::before Before
`cin >> n;` reads the digits and stops at the newline **without consuming it**, so `getline(cin, name);` reads up to that newline at once.
:::

:::after After
`cin.ignore(numeric_limits<streamsize>::max(), '\n');` (from `<limits>`) throws away everything up to and including the leftover newline, so the next `getline` reads the real line.
:::

```quiz
[
  {
    "q": "Which header declares `std::string` and `getline`?",
    "options": ["`<iostream>`", "`<string>`", "`<cstring>`", "`<sstream>`"],
    "answer": 1,
    "explain": "Both the string class and the getline function are defined in <string>. <cstring> is the C header for strlen/strcpy on char arrays; <sstream> is for stringstreams."
  },
  {
    "q": "A `std::string` must be terminated with `'\\0'`, just like a C `char` array.",
    "type": "tf",
    "answer": false,
    "explain": "The slides say it directly: in C++ the string object needn't terminate with \\0. The class stores its own length; size() returns 5 for \"Hello\"."
  },
  {
    "q": "`s.size()` and `s.length()` on the same `std::string` return...",
    "options": ["different values: size counts bytes, length counts characters", "the same value: they are the same thing", "size includes the terminator, length does not", "length is only valid after c_str()"],
    "answer": 1,
    "explain": "Two names for one function; the slide literally says \"returns the number of characters (same thing!)\"."
  },
  {
    "q": "What does `c_str()` return?",
    "options": ["a modifiable copy of the string as a `char *`", "a non-modifiable standard C char array (`const char *`)", "the string's length as a C `int`", "a new `std::string`"],
    "answer": 1,
    "explain": "c_str() hands back a const char * pointing at a null-terminated copy so C functions can use it; you cannot modify the string through it."
  },
  {
    "q": "What does this print?",
    "code": "string a = \"apple\";\nstring b = \"bear\";\ncout << boolalpha << (b > a) << \" \" << (a == \"apple\");",
    "options": ["true true", "false true", "true false", "It does not compile: use compareTo"],
    "answer": 0,
    "explain": "Relational operators compare strings lexicographically: 'b' comes after 'a', so b > a is true; == compares the characters, so a == \"apple\" is true. No compareTo or equals needed."
  },
  {
    "q": "`string s = \"hello\"; cout << s[0] << s.at(1);` prints...",
    "options": ["`he`", "`h e`", "`el`", "`ho`"],
    "answer": 0,
    "explain": "s[0] is 'h' and s.at(1) is 'e', the two examples from the slide, printed with nothing between them."
  },
  {
    "q": "Which statements about `s[i]` versus `s.at(i)` are true? (select all)",
    "options": ["both return a reference to the character, so you can assign through them", "`at` checks the bounds and throws `std::out_of_range` for a bad index", "`[ ]` on an index past the end is undefined behaviour", "`[ ]` throws an exception for a bad index"],
    "answer": [0, 1, 2],
    "explain": "Both give a reference (s[0] = 'j' works). Only at() bounds-checks; a bad index with [ ] is undefined behaviour, not an exception."
  },
  {
    "type": "match",
    "q": "Match each line to the class mechanism it invokes.",
    "pairs": [
      ["`string first;`", "default constructor"],
      ["`string second = first;`", "copy constructor"],
      ["`first = second;`", "assignment operator"]
    ],
    "explain": "A declaration with no initializer calls the default constructor; a declaration initialized from another object calls the copy constructor; assigning to an object that already exists calls the assignment operator."
  },
  {
    "q": "The input is `Hello\\nworld\\n`. After one `getline(cin, input);` call, `input` holds...",
    "options": ["`Hello\\n`", "`Hello`", "`Hello world`", "`Helloworld`"],
    "answer": 1,
    "explain": "getline reads up to the newline and TOSSES the newline, so input is exactly Hello; world is still in the buffer for the next call."
  },
  {
    "q": "The input is only EOF (nothing typed). After `getline(cin, input);`...",
    "options": ["`input` is empty and no bits are set", "`input` is empty, and eofbit and failbit are both set", "`input` is unchanged and only eofbit is set", "the program crashes"],
    "answer": 1,
    "explain": "No character could be extracted, so both eofbit and failbit are set (cin is now false). The slide's table says 'no change' for the string; g++ erases it first, so it is empty. Only a call made after eofbit is already set leaves the string unchanged."
  },
  {
    "q": "The input is `Hello` followed immediately by EOF (no Enter). After `getline(cin, input);` the read has failed.",
    "type": "tf",
    "answer": false,
    "explain": "Characters were extracted before EOF, so input is Hello and only eofbit is set; failbit is clear and cin is still true. Failing to read anything at all is what sets failbit."
  },
  {
    "q": "What does `name` hold after this runs with the input `42`, Enter, `Jeff Yim`, Enter?",
    "code": "int n;\nstring name;\ncin >> n;\ngetline(cin, name);",
    "options": ["`Jeff Yim`", "`Jeff`", "an empty string", "`42`"],
    "answer": 2,
    "explain": "cin >> n stops at the newline without consuming it; getline then reads up to that leftover newline immediately and returns an empty string. Fix: cin.ignore(numeric_limits<streamsize>::max(), '\\n') before the getline."
  },
  {
    "type": "fill",
    "q": "Fill in the standard idiom for processing input line by line until it runs out.",
    "code": "string line;\nwhile (___)\n{\n    /* process line */\n}",
    "answer": ["getline(cin, line)", "getline (cin, line)"],
    "explain": "getline returns the stream, and the stream is true until a read fails (at EOF), so the loop runs once per line and stops by itself."
  }
]
```
