---
title: Testing and debugging
minutes: 22
---

Lab 3 asks you to review the testing deck from COMP 2910 before writing your first Catch tests. This lesson is that deck, with its one code example turned into runnable C++ and its partition exercise turned into a widget.

## The warm-up: what is the output?

```cpp run pin warmup.cpp
// predict: Write the two lines printed. Count how many times the block runs.
#include <iostream>
using namespace std;

int main()
{
    int sum = 1;
    for (int i = 0; i <= 4; i++);
    {
        sum = sum + 1;
    }
    cout << "The result is: " << sum << endl;
    cout << "Double result: " << sum << sum << endl;
    return 0;
}
```

The semicolon in `for (int i = 0; i <= 4; i++);` ends the loop with an empty body, so the braces that follow are an ordinary block, and in the second line two insertions of `sum` sit side by side. It compiles cleanly (g++ warns about the misleading indentation, nothing more), which is the deck's point: syntax errors are found by the compiler; **logic errors** are bugs, and the IDE cannot help. Some have no immediately obvious manifestation.

## Testing is not debugging

- **Testing** reveals the **existence** of a problem. **Debugging** pinpoints the **source**. The manifestation may occur some distance from its source.
- Typical error situations: a class or method implemented incorrectly, the specification not met, an inappropriate object request (an invalid index), an inconsistent object state. The environment (a bad URL, a missing file) can be the cause, "but it usually is" programmer error.
- Prevention: software engineering techniques such as encapsulation lessen the likelihood. Detection: modularization and documentation improve the odds, and then you test and debug.

Three debugging techniques from the deck: **print statements** (most popular; put them in the right places, expect voluminous output, plan how to turn them off), **walkthroughs** (tabulate key variables and state changes after each call; explaining your code to a peer often makes you spot the error yourself), and **debuggers** (breakpoints, Step and Step-into, the call stack, watching variable and object state; CLion's is the one you will use in the lab).

The deck's in-class debugger activity sums a range of integers; in CLion, a breakpoint inside the loop lets you watch the aggregator `sum` grow each pass:

```cpp run
// stdin: 3 7
// predict: Input is 3 7. Write the line printed.
#include <iostream>
using namespace std;

int main()
{
    int low, high;
    cin >> low >> high;
    int sum = 0;
    for (int i = low; i <= high; i++)
    {
        sum += i;           // breakpoint here: watch i and sum
    }
    cout << "sum of " << low << ".." << high << " = " << sum << endl;
    return 0;
}
```

## Testing = verification + validation

Verification asks "did we build the app correctly?" and hunts for incorrect or undesirable behaviour. Validation asks "did we build the correct app?" and demonstrates to developer and customer that the requirements are met. The axioms: testing cannot show that bugs do not exist; a bug is a bug only if it is observed; you cannot fix every bug; subtle bugs stay hidden while major ones remain; specifications are a moving target.

**Dynamic testing** provides input, receives output and compares it with the expected behaviour. **Static testing** reviews the source, the documentation and the project plan without running anything. **Functional (black box)** tests come from the specification and treat the system as atomic; **structural (white box)** tests come from the code and examine the internals.

## Partitions and boundaries

Understand the contract of the test subject and look for violations, with positive tests (valid data) and negative tests (invalid data). Test the boundaries: zero, one, full; max and min; just inside and just outside; typical values; error values. Then create **disjoint equivalence partitions**: identify the inputs that are processed the same way (coverage), make each group a separate partition (disjointness), and let each test exercise one and only one partition (representation).

```widget
partitions
```

The deck's answer for a function that accepts 100 to 999 is five tests: 50 (way off), 100 and 999 (the boundaries), 500 (an arbitrary value inside), 1500 (way off). Each one exercises one partition or one edge of it.

## The three kinds of testing in COMP 3522

**Assertions** document and check preconditions (what the caller must promise), postconditions (what the code promises if the preconditions held) and invariants (what never changes). The `assert` macro from `<cassert>`, inherited from C, evaluates an expression and terminates the program immediately if it is false; defining `NDEBUG` before the include turns every assertion off.

```cpp run pin assertDemo.cpp
// stdin: 9
// predict: Input is 9. Write what prints.
#include <cassert>
#include <cmath>
#include <iostream>
using namespace std;

// Compute square root of non-negative number
double square_root(double x)
{
    assert(x >= 0);              // precondition: the caller promised this
    double result = sqrt(x);
    assert(result >= 0.0);       // postcondition: should be positive
    return result;
}

int main()
{
    double x;
    cin >> x;
    cout << "root of " << x << " is " << square_root(x) << endl;
    return 0;
}
```

`assert(x >= 0);` is the precondition and `assert(result >= 0.0);` the postcondition of the deck's example. With a negative input the first assertion fails, the program aborts with a message naming the file, line and expression, and the exit code is non-zero: the bug is caught at its source instead of surfacing as a `nan` somewhere downstream.

**Unit tests** exercise a very small, specific area of functionality by invoking one function in one context (the deck's example: add a large value to a sorted list and confirm it appears at the end). A unit is the smallest testable part: a function, a method, a behaviour. Each unit test should **Assemble, Act, Assert**, and consider the starting state, the inputs and the expected result. JUnit organizes test methods into test cases with assertions and fixtures; in C++ we use **Catch**, next lesson.

**Regression testing** re-runs the whole suite. Whenever you find and fix a bug, add a test for it and rerun everything, because fixing new bugs can reintroduce old ones; run the regression tests as often as possible.

Two strategies close the deck. **Test-driven development**: write the tests first, implement, the code is complete when the tests pass, refactor and pass again. **Simplify**: find the simplest input that provokes the bug, which is often not the input that revealed it; take pieces away until the bug disappears, or add them until it appears; binary-search the statements between the first good and the first bad intermediate result.

## Choose tests and find the bug in four new functions

New specifications for partitions and boundaries, and new bugs for the output that reveals them.

```quiz
[
  {
    "type": "numeric",
    "q": "What does this print? (g++ warns about the loop.)",
    "code": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int total = 0;\n    for (int i = 1; i <= 3; i++);\n    {\n        total += 5;\n    }\n    cout << total << endl;\n    return 0;\n}",
    "answer": 5,
    "explain": "The `;` right after the `for (...)` is the loop's whole body, an empty statement run three times. The braces are an ordinary block that runs once afterwards: total = 0 + 5 = 5, not 15."
  },
  {
    "q": "A function accepts ages from 18 to 65 inclusive. Which five test values follow the deck's recipe (way off below, both boundaries, a typical inside value, way off above)?",
    "options": [
      "5, 18, 40, 65, 90",
      "17, 18, 19, 64, 65",
      "18, 30, 40, 50, 65",
      "0, 17, 66, 100, 200"
    ],
    "answer": 0,
    "explain": "The partitions are below 18, 18 to 65, and above 65. The deck's pattern for 100 to 999 was 50, 100, 500, 999, 1500: one value well outside each side, both boundaries, one typical value inside. Here: 5, 18, 40, 65, 90."
  },
  {
    "type": "numeric",
    "q": "`sumTo(n)` should return 1 + 2 + ... + n. A test calls `sumTo(4)` and expects 10. What does the program print?",
    "code": "#include <iostream>\nusing namespace std;\n\nint sumTo(int n)\n{\n    int sum = 0;\n    for (int i = 1; i < n; ++i)\n    {\n        sum += i;\n    }\n    return sum;\n}\n\nint main()\n{\n    cout << sumTo(4) << endl;\n    return 0;\n}",
    "answer": 6,
    "explain": "The test reveals the bug's existence: 6 instead of 10. Debugging pinpoints the source: `i < n` stops at 3, so 1 + 2 + 3 = 6. The fix is `i <= n`, and the test stays in the suite as a regression test."
  },
  {
    "q": "What does this print?",
    "code": "#define NDEBUG\n#include <cassert>\n#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int x = -1;\n    assert(x > 0);\n    cout << \"done \" << x << endl;\n    return 0;\n}",
    "options": [
      "`done -1`",
      "`Assertion failed: x > 0`",
      "`nothing: the program aborts`",
      "`done 0`"
    ],
    "answer": 0,
    "explain": "`#define NDEBUG` before `#include <cassert>` turns every `assert` into nothing, so the false condition is never checked and the program runs on. Output: `done -1`. Without NDEBUG it would stop with `Assertion failed`."
  },
  {
    "type": "numeric",
    "q": "`grade(int score)` accepts 0 to 100 and returns pass for 50 or more. How many disjoint equivalence partitions cover every int input?",
    "answer": 4,
    "tolerance": 0,
    "explain": "Inputs processed the same way form one partition: below 0 (invalid), 0 to 49 (fail), 50 to 100 (pass), above 100 (invalid). Four partitions, each tested by at least one value, with boundary tests at -1, 0, 49, 50, 100 and 101."
  }
]
```

```challenge
{
  "prompt": "Write <code>bool isValidPercent(int p)</code> that accepts 0 to 100 inclusive. The boundary tests in <code>main</code> are written and must print:<pre>-1 false\n0 true\n50 true\n100 true\n101 false</pre>",
  "starter": "#include <iostream>\nusing namespace std;\n\n// isValidPercent here\n\nint main()\n{\n    int tests[] = {-1, 0, 50, 100, 101};\n    for (int t : tests)\n    {\n        cout << t << ' ' << boolalpha << isValidPercent(t) << endl;\n    }\n    return 0;\n}\n",
  "expected": "-1 false\n0 true\n50 true\n100 true\n101 false\n",
  "hints": [
    "Both ends are valid: <code>>=</code> and <code><=</code>.",
    "<code>return p >= 0 && p <= 100;</code>"
  ],
  "solution": "#include <iostream>\nusing namespace std;\n\nbool isValidPercent(int p)\n{\n    return p >= 0 && p <= 100;\n}\n\nint main()\n{\n    int tests[] = {-1, 0, 50, 100, 101};\n    for (int t : tests)\n    {\n        cout << t << ' ' << boolalpha << isValidPercent(t) << endl;\n    }\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "What does this print?",
    "code": "int sum = 1;\nfor (int i = 0; i <= 4; i++);\n{\n    sum = sum + 1;\n}\ncout << \"The result is: \" << sum << endl;",
    "options": ["The result is: 6", "The result is: 2", "The result is: 5", "a compile error"],
    "answer": 1,
    "explain": "The semicolon after the for makes its body empty; the braces form a block that runs once, so sum becomes 2. A logic error the compiler accepts."
  },
  {
    "q": "Testing reveals the existence of a problem; debugging pinpoints its source.",
    "type": "tf",
    "answer": true,
    "explain": "The deck's Testing != Debugging slide. The manifestation of a bug may be far from its source, which is why both skills are crucial."
  },
  {
    "q": "\"Did we build the correct app?\" is the question asked by...",
    "options": ["verification", "validation", "regression testing", "static testing"],
    "answer": 1,
    "explain": "Validation demonstrates that the software meets its requirements; verification (did we build the app correctly?) hunts for incorrect behaviour."
  },
  {
    "q": "Which of these are testing axioms from the deck? (select all)",
    "options": ["Testing can't show that bugs don't exist", "A bug is a bug only if it's observed", "Once tested, a program has no bugs", "Specifications and requirements are a moving target"],
    "answer": [0, 1, 3],
    "explain": "The deck also adds: we cannot fix all the bugs, and subtle bugs stay hidden while major ones remain. 'No bugs after testing' contradicts the first axiom."
  },
  {
    "q": "Reviewing the source code and documentation without running the program is...",
    "options": ["dynamic testing", "static testing", "black-box testing", "regression testing"],
    "answer": 1,
    "explain": "Static testing reviews the source, the documentation and the project plan. Dynamic testing runs the app with an input and compares the output with the expected behaviour."
  },
  {
    "q": "A function accepts numbers from 100 to 999. Which five test values does the deck choose?",
    "options": ["100, 200, 300, 400, 500", "50, 100, 500, 999, 1500", "0, 1, 2, 3, 4", "99, 100, 101, 998, 999"],
    "answer": 1,
    "explain": "One from each partition (50 below, 500 inside, 1500 above) plus the two boundaries 100 and 999. Each test exercises one and only one partition."
  },
  {
    "q": "Tests derived from the specification, treating the system as atomic, are called...",
    "options": ["structural (white box)", "functional (black box)", "unit tests", "assertions"],
    "answer": 1,
    "explain": "Black box: based on specifications, covers as much specified behaviour as possible. White box: based on code, examines the internals."
  },
  {
    "q": "How do you turn off every `assert` in a file?",
    "options": ["Delete `<cassert>`", "`#define NDEBUG` before `#include <cassert>`", "Compile with -Wall", "Call `assert(false)` once"],
    "answer": 1,
    "explain": "Defining NDEBUG makes the assert macro expand to nothing. Assertions check preconditions, postconditions and invariants, and abort the program when one is false."
  },
  {
    "q": "The three steps of a unit test are...",
    "options": ["Compile, Run, Debug", "Assemble, Act, Assert", "Plan, Code, Test", "Input, Output, Compare"],
    "answer": 1,
    "explain": "Assemble the starting state, act by invoking the unit, assert the expected result or end state."
  },
  {
    "q": "You just fixed a bug. What does regression testing say to do next?",
    "options": ["Delete the old tests, they passed already", "Add a test for the bug and rerun all your tests, because fixing new bugs can reintroduce old ones", "Only rerun the test that failed", "Write the fix again in Java"],
    "answer": 1,
    "explain": "Regression = re-running the suite. The suite grows with every bug found, and it runs as frequently as possible."
  }
]
```
