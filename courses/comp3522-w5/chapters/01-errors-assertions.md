---
title: Errors, assertions and the trouble with error codes
minutes: 16
---

A negative number reaches `square_root`; a file the program needs is not there. C++ has one tool for each kind of trouble: assertions for mistakes in the program, exceptions for situations the function cannot deal with itself. This lesson draws that line and shows why the C habit of returning an error code is not enough.

## Four typical error situations

The slides list where errors come from:

1. implementing a class or function incorrectly;
2. failing to meet the specification;
3. making an inappropriate object request (an invalid index);
4. generating an inconsistent or inappropriate object state (arising through class extension).

All four are the programmer's doing, and the next slide, "Not ALWAYS Programmer Error", carries the footnote *but it usually is*. The exceptions arise from the environment: an incorrect URL entered, a network interruption; and file processing is particularly error-prone (missing files, lack of appropriate permissions). Java already drew this line with its exception classes, which the slide lists as the bridge from last year:

| Java exception | Thrown when |
|---|---|
| `NullPointerException` | an application attempts to use an object reference that is set to null |
| `ArrayIndexOutOfBoundsException` | an index is out of range |
| `ClassCastException` | code attempted to cast an object to a subclass of which it is not an instance |
| `ConcurrentModificationException` | concurrent modification of an object when such modification is not permissible |

## Assertions for programming errors, exceptions for what cannot continue

Slide wording: **1. Assertions are for detecting programming errors. 2. Exceptions for situations that prevent proper continuation of the program** (errors that cannot be handled locally). An index that is out of range is a bug in your code, so you assert it. A missing file is the environment's doing: the function that noticed it cannot fix it, so it throws an exception for a caller that can.

## assert terminates the program the moment its expression is false

```cpp run pin ex_assert.cpp
// predict: Write every line printed to stdout before the program stops.
// assert from <cassert>: terminates immediately when the expression is false (unless NDEBUG was defined first).
#include <iostream>
#include <cassert>
using namespace std;

int main() {
    int x = 5;
    assert(x == 5);
    cout << "first assert passed" << endl;
    assert(x > 10);           // false: abort with a message on stderr
    cout << "not reached" << endl;
    return 0;
}
```

`assert` is a macro from the header `<cassert>`, inherited from C. It evaluates an expression and *immediately terminates the program if false*. `assert(x == 5);` is true, so nothing happens and `first assert passed` prints. `assert(x > 10);` is false: a message naming the failed expression, the file and the line goes to stderr and the program terminates with a non-zero exit code, so `cout << "not reached" << endl;` never runs. There is nothing to catch and no handler to write. An assertion that fires means the code is wrong, not the input, and the fix is a code change.

## NDEBUG before the include turns every assert off

```cpp run pin ex_assert_ndebug.cpp
// predict: The same program with NDEBUG defined. Write both lines printed.
// Same program with NDEBUG defined before <cassert>: every assert disappears.
#include <iostream>
#define NDEBUG
#include <cassert>
using namespace std;

int main() {
    int x = 5;
    assert(x == 5);
    cout << "first assert passed" << endl;
    assert(x > 10);           // compiled away
    cout << "reached: asserts are off" << endl;
    return 0;
}
```

Assertions are easy to turn off for a release build: define `NDEBUG` before including the header. `#define NDEBUG` on the line above `#include <cassert>` makes the macro expand to nothing, so `assert(x > 10);           // compiled away` is not compiled at all and `reached: asserts are off` prints. The order is the whole trick: a `#define NDEBUG` placed after the include is too late, because the header has already been read with assertions on. g++ even warns that `x` is now an unused variable, since the two asserts were its only uses.

## The slide's square_root: check the input somehow, assert the result

```cpp
#include <cassert>
// Compute square root of non-negative number
double square_root(double x)
{
  check_somehow(x >= 0);
  … // Perform our calculation
  assert(result >= 0.0); // Should be positive
  return result;
}
```

`check_somehow(x >= 0)` stands for the precondition. A negative `x` comes from the caller, so the function has to report it rather than crash; the next lesson replaces the placeholder with a `throw`. `assert(result >= 0.0)` checks the postcondition: if the calculation ever produces a negative root, the calculation itself is wrong, a programming error, and the assertion is the right tool.

## C error codes: return 1 means error

```cpp run pin read_matrix_file.cpp
// predict: The file does not exist. Write the two lines printed.
// Slide 10: a C-style function that reports failure with a return value.
#include <iostream>
#include <fstream>
using namespace std;

int read_matrix_file(const char* fname)
{
    fstream f(fname);
    if (!f.is_open()) { return 1; } //return 1 means error
    // ... read the matrix here
    return 0; //return 0 means success
}

int main()
{
    int code = read_matrix_file("no_such_file.txt");
    cout << "read_matrix_file returned " << code << endl;
    read_matrix_file("no_such_file.txt");   // the code is silently dropped
    cout << "still running" << endl;
    return 0;
}
```

*In C, programmers used to return error codes (like main still does).* `if (!f.is_open()) { return 1; } //return 1 means error` reports a file that would not open and `return 0; //return 0 means success` reports success; the caller has to compare the number to know which happened. Problem #1: *we can ignore the error code*. The first call stores it and prints `read_matrix_file returned 1`; the second, `read_matrix_file("no_such_file.txt");   // the code is silently dropped`, throws the number away and the program carries on as if the matrix had been read. The slide lists four more problems:

1. we can't return our computational results;
2. we have to return a success/error code;
3. we are forced to pass references/pointers as arguments;
4. this can prevent us from building expressions with the results.

The return value is spent on the status, so the matrix itself must come back through a reference or pointer parameter, and `read_matrix_file(a) + read_matrix_file(b)` would add two status codes, not two matrices.

```challenge
{
  "prompt": "Write <code>int safe_divide(int a, int b)</code> that asserts <code>b != 0</code> and returns <code>a / b</code>. <code>main</code> prints <code>safe_divide(10, 2)</code> on its own line.",
  "starter": "#include <iostream>\n#include <cassert>\nusing namespace std;\n\n// int safe_divide(int a, int b) ...\n\nint main()\n{\n    // print safe_divide(10, 2)\n    return 0;\n}\n",
  "expected": "5",
  "hints": ["The assertion goes before the division: <code>assert(b != 0);</code>", "A division by zero is a programmer error (the caller broke the precondition), which is why an assertion and not an exception is asked for."],
  "solution": "#include <iostream>\n#include <cassert>\nusing namespace std;\n\nint safe_divide(int a, int b)\n{\n    assert(b != 0);\n    return a / b;\n}\n\nint main()\n{\n    cout << safe_divide(10, 2) << endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "According to the slides, which tool is for detecting programming errors?",
    "options": ["Exceptions", "Error codes", "Assertions", "`cerr` messages"],
    "answer": 2,
    "explain": "Assertions are for detecting programming errors; exceptions are for situations that prevent proper continuation of the program (errors that cannot be handled locally)."
  },
  {
    "q": "`assert` is a function declared in `<cassert>`.",
    "type": "tf",
    "answer": false,
    "explain": "It is a macro inherited from C. That is why defining NDEBUG before the include can make it expand to nothing: there is no function call left in the program."
  },
  {
    "q": "What is printed to stdout?",
    "code": "#include <iostream>\n#include <cassert>\nusing namespace std;\nint main() {\n    int n = 3;\n    cout << \"a\" << endl;\n    assert(n < 0);\n    cout << \"b\" << endl;\n}",
    "options": ["`a` only; the program then terminates", "`a` then `b`", "`b` only", "Nothing; it does not compile"],
    "answer": 0,
    "explain": "n < 0 is false, so assert immediately terminates the program after a goes out; b is never reached. The failure message goes to stderr, not stdout."
  },
  {
    "q": "Where must `#define NDEBUG` go to turn assertions off?",
    "options": ["Anywhere in the file", "Before `#include <cassert>`", "After `#include <cassert>`", "Inside main, before the first assert"],
    "answer": 1,
    "explain": "The header reads NDEBUG when it is included. Defined before the include, every assert expands to nothing; defined after, the header has already been processed with assertions on."
  },
  {
    "q": "Which are problems with C-style error codes listed on the slides? (select all)",
    "options": ["The error code can be ignored", "We can't return our computational results", "They do not compile in C++", "They force us to pass references or pointers as arguments"],
    "answer": [0, 1, 3],
    "explain": "Problem #1 is that the code can be ignored; the rest: the return value is spent on a status, results must come back through reference or pointer arguments, and expressions cannot be built with the results. They compile fine, which is part of the problem: main still returns one."
  },
  {
    "q": "A program cannot open the input file the user named. The slides' tool for this is an assertion.",
    "type": "tf",
    "answer": false,
    "explain": "A missing file is an error from the environment, not a programming error, and the function cannot handle it locally. That is an exception's job; assertions are for bugs in the code."
  },
  {
    "q": "In the slide's `square_root`, what does `assert(result >= 0.0)` check?",
    "options": ["That the caller passed a non-negative x", "That the file opened", "That `NDEBUG` is defined", "The postcondition: the calculation produced a sensible result"],
    "answer": 3,
    "explain": "The precondition x >= 0 is checked somehow (an exception, next lesson) because the bad value comes from the caller; the postcondition is asserted because a negative root can only mean the calculation itself is wrong."
  },
  {
    "q": "`main` still reports success or failure with a return value, the C way.",
    "type": "tf",
    "answer": true,
    "explain": "The slide: in C, programmers used to return error codes, like main still does. return 0 means success, a non-zero value means an error."
  }
]
```
