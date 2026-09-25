---
title: std::string & getline
minutes: 20
---

In C, a "string" was a `char` array that you had to terminate with `'\0'` yourself. C++ gives you a proper class instead: `std::string`, declared in the `<string>` header. The instructor makes a point of the spelling: it is **lower-case `string`**, not Java's `String`. This lesson covers how to create and compare strings, how to pick characters out of them, and the one function you will use constantly to read them: `getline`.

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

All three declarations **statically allocate a string object** (it lives on the stack, no `new` needed) and each one calls a constructor:

- `string s1;` calls the **default constructor**. `s1` is a real, usable string that happens to be empty. That is why the first output line starts with a space: an empty `s1`, then `" "`, then `Hello`.
- `string s2 = "Hello";` builds a string from a literal.
- `string s3{"world!"};` is the same idea with uniform (brace) initialization, the style the course prefers.

The second line prints `s2 has 5 characters, s3 has 6`. Two things to notice: `size()` and `length()` are **the same function under two names**, and the count is 5 for `Hello` because, in the instructor's words, *"in C++, the string object needn't terminate with `\0`."* The class keeps track of its own length; there is no hidden terminator you have to count or add.

## Member functions: size, length, c_str

Because `string` is a class, it comes with member functions. The slides list three:

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

`cin >> line;` reads one whitespace-delimited word into the string, exactly as it would into an `int`. `line.size()` and `line.length()` both print `9`. The line `const char * c_line = line.c_str();` is the bridge back to C: when you need to hand a string to an old C function that expects a `char *`, `c_str()` gives you a pointer to a null-terminated copy. It is `const` because you are not allowed to modify the string through that pointer; change the `string` object instead.

## Comparing strings

In Java you had to call `compareTo` or override `equals`. In C++ the relational operators `>`, `<`, `>=`, `<=`, `==`, `!=` work directly on strings, and they compare **lexicographically**: character by character, using the character codes, the way a dictionary orders words.

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
    cout << (b > a) << endl;          // 'b' comes after 'a'
    cout << (a == "apple") << endl;   // == compares the characters, not addresses
    cout << ("Zebra" < a) << endl;    // 'Z' (90) is less than 'a' (97)
    cout << (a < "apples") << endl;   // a shorter prefix comes first
    return 0;
}
```

The instructor's example is the first one: `cout << (b > a) << endl;` prints `true` because, comparing `bear` with `apple`, the character `b` comes after `a`. The other three lines are the cases quizzes like:

- `cout << (a == "apple") << endl;` is `true`. Unlike Java, `==` compares the **contents** of the strings.
- `"Zebra" < a` is `true` even though Z is "later" in the alphabet, because comparison uses character codes and every upper-case letter (`'Z'` is 90) is smaller than every lower-case letter (`'a'` is 97).
- `a < "apples"` is `true`: when one string runs out while all its characters matched, the shorter one is smaller.

:::quiz Java habits
"You need `compareTo` or `equals` to compare two C++ strings" is **false**. The operators are overloaded for `std::string`; `s1 == s2` compares characters, and `s1 < s2` is lexicographic. (For C `char` arrays that would compare addresses, which is exactly why `std::string` exists.)
:::

## Picking out characters: `[ ]` and `at`

You can use square brackets on a string as if it were an array, or the `at(size_type pos)` member function. Both give you a **reference** to the character at that index, so you can read it or assign to it.

```cpp run pin indexing.cpp
// predict: Write everything printed, including the last line.
#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

int main()
{
    string s = "hello";
    cout << s[0] << endl;      // prints h
    cout << s.at(1) << endl;   // prints e
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

`cout << s[0] << endl;` prints `h` and `cout << s.at(1) << endl;` prints `e`, exactly the slide's two examples. Because both return a reference, `s[0] = 'j';` changes the first character in place, and the string becomes `jell!`.

The difference between the two is what happens with a bad index. `s[10]` on a 5-character string is **undefined behaviour**: no check, you read whatever memory sits there. `s.at(10)` **checks the bounds** and throws a `std::out_of_range` exception, which the `try`/`catch` above turns into a message. Exceptions get their own week later; for now remember: `at` checks, `[ ]` does not.

## A short aside on classes

The slides pause here for a preview of something you will meet properly in a few weeks. Three innocent-looking lines call three different pieces of the `string` class:

```cpp run pin classesAside.cpp
// predict: Which line prints "COMP 3522", and what does first hold at the end?
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

- `string first;` calls the **default constructor** (an empty string).
- `string second = first;` is a declaration with an initializer, so it calls the **copy constructor**: `second` is a brand-new object holding a copy of `first`'s characters.
- `first = second;` has no type in front of it, so it is not a declaration: it calls the **assignment operator** on an object that already exists.

The point of the extra prints is that a copy is a *copy*: after `second = "COMP 3522";`, `first` is still empty, because the two strings are separate objects. Only the later `first = second;` copies the characters across. Keep the three names in mind (default constructor, copy constructor, assignment operator); when we write our own classes you will implement all three.

## Reading a whole line: `getline`

`cin >> input` stops at the first whitespace, which is useless for a name like `Jeff Yim`. The `getline` function, defined in `<string>`, reads a **line** of characters from an input stream, puts them in the string you give it, **tosses the newline**, and returns the original input stream.

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

Run it and look closely at the second line. `cin >> word;` extracts `Hello` and stops **at** the space; the space is not consumed. Then `getline(cin, rest);` starts reading right there, so `rest` is `" World"` **with the leading space**. The signature the slides give is:

```cpp
string input;
getline(cin, input); // returns cin
```

The return value is `cin` itself, which is what makes the loop idiom further down work.

### The optional third argument: a delimiter

The full form is `getline(inputstream, input, delimiter)`. By default the delimiter is the newline; give a different character and `getline` reads up to that character instead (and tosses it):

```cpp run pin delimiter.cpp
// stdin: Yim,Jeff,COMP3522
// predict: What are the three fields printed?
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

`getline(cin, last, ',');` reads `Yim` and throws the comma away, `getline(cin, first, ',');` reads `Jeff`, and the plain `getline(cin, course);` takes the rest of the line. This is how you split comma-separated data without writing a parser.

## When getline stops, and what it sets

The slides list exactly three ways an extraction can end. `getline` keeps pulling characters until:

1. **EOF** is reached: the characters read so far go into the string and **eofbit is set**.
2. The **delimiter (or newline) is extracted**: it is **tossed**, not stored, and the read succeeds.
3. So many characters were extracted that they exceed what a string can hold, which **sets the failbit**. (You will not hit this one in practice.)

Plus the one case that is not on that list but is on the next slide: if `getline` cannot read **even one character** because the stream is already at EOF, it sets **both eofbit and failbit** and leaves the string **unchanged**.

Play with the simulator first. `\n` is Enter and `*` marks the end of the input (the slide uses `*` for EOF too):

```widget
getline-sim
{ "input": "Hello\\nworld\\n", "calls": 2 }
```

Now the slide's table, reproduced with a real program. Each row shows what one `getline(cin, input)` call leaves in `input` for that keyboard input:

| cin user input | `string input` | bits set |
|---|---|---|
| `Hello World` (then EOF) | `Hello World` | eofbit |
| `Hello\nworld\n` | `Hello` | none |
| `\nWorld\n` | EMPTY | none |
| `Hello*` | `Hello` | eofbit |
| `Hello\n*` | `Hello` | none |
| `*` | no change | eofbit **and** failbit |

```cpp run pin getlineTable.cpp
// stdin: Hello\nworld\n
// predict: With the input above, what does each of the two calls leave in input, and which bits are set?
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

The program starts with `string input = "unchanged";` so that you can *see* the "no change" row. Edit the stdin box to test every row of the table (leave it empty for the `*` row, which is EOF right away):

- `Hello\nworld\n`: first call `[Hello]`, second call `[world]`, nothing set. The newlines were extracted and tossed.
- `\nWorld\n`: first call `[]`. An empty line is a **successful** read of zero characters; no bit is set.
- `Hello` with no Enter: `[Hello] eof=1 fail=0`. The read succeeded (eofbit only). The **second** call then finds nothing and sets failbit as well; `input` keeps `Hello`.
- Empty stdin: `[unchanged] eof=1 fail=1`. Nothing could be read, so the string is untouched and both bits are set.

:::quiz eofbit alone is not a failure
"If `getline` hits EOF, the read fails." **False.** Hitting EOF *after* reading some characters sets only eofbit and the read succeeds (`cin` is still true). It is failing to read *anything* that sets failbit. Same rule as `cin >> n` from Week 1.
:::

## The standard idiom: process a stream line by line

Because `getline` returns the stream, and a stream converts to `false` once failbit is set, the slides give this pattern:

```cpp run pin lineByLine.cpp
// stdin: first line\nsecond line\nthird
// predict: How many times does the loop body run, and what is printed?
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

`while (getline(cin, line))` reads a line, and the value of the expression is `cin`, which is true as long as no failbit is set. The third line has no newline after it: `getline` still returns it (eofbit only), so the body runs three times. The **fourth** call cannot read anything, sets failbit, and the loop ends. That last failing call is what stops the loop; you never need to test `eof()` yourself.

## The classic trap: `cin >>` followed by `getline`

This one costs students marks every term. Ask for a number with `>>`, then ask for a name with `getline`, and the name comes back empty.

```cpp run pin mixTrap.cpp
// stdin: 42\nJeff Yim
// predict: The user types 42, Enter, then "Jeff Yim". What does the program print for the name?
#include <iostream>
#include <string>
using namespace std;

int main()
{
    int n;
    string name;
    cout << "Enter a number: ";
    cin >> n;
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "\nn = " << n << ", name = [" << name << "]" << endl;
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
    cout << "Enter a number: ";
    cin >> n;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "\nn = " << n << ", name = [" << name << "]" << endl;
    return 0;
}
```

:::before Before
`cin >> n;` reads the digits `42` and stops at the newline **without consuming it**. The newline is still sitting in the buffer. `getline(cin, name);` then reads up to the first newline, which is immediately, and returns an empty string. The output is `name = []` and the program never waited for the second line.
:::

:::after After
The fix is the Week 1 recovery tool: `cin.ignore(numeric_limits<streamsize>::max(), '\n');` throws away everything up to and including that leftover newline, so the next `getline` reads the real line, `Jeff Yim`. (`numeric_limits` lives in `<limits>`.)
:::

Toggle **Before** and **After** on the program and run both. The rule to remember: `>>` leaves the newline behind, `getline` consumes it. Whenever you switch from `>>` to `getline`, `ignore` the rest of the line first.

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
    "options": ["`input` is empty and no bits are set", "`input` is unchanged, and eofbit and failbit are both set", "`input` is unchanged and only eofbit is set", "the program crashes"],
    "answer": 1,
    "explain": "The last row of the slide's table: no character could be extracted, so input keeps its old value and both eofbit and failbit are set (cin is now false)."
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
