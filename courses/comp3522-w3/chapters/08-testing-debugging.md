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

The semicolon in `for (int i = 0; i <= 4; i++);` ends the loop with an empty body, so the loop counts to 5 doing nothing. The braces that follow are an ordinary block that runs **once**: `sum = sum + 1;` makes sum 2, and the second line prints `22` because two insertions of 2 sit side by side. It compiles cleanly (g++ warns about the misleading indentation, nothing more), which is the deck's point: syntax errors are found by the compiler; **logic errors** are bugs, and the IDE cannot help. Some have no immediately obvious manifestation.

## Testing is not debugging

- **Testing** reveals the **existence** of a problem. **Debugging** pinpoints the **source**. The manifestation may occur some distance from its source.
- Typical error situations: implementing a class or method incorrectly, failing to meet the specification, making an inappropriate object request (an invalid index), generating an inconsistent object state (often through class extension). Errors also arise from the environment (a bad URL, a network interruption, a missing file, missing permissions), "but it usually is" programmer error.
- Prevention: software engineering techniques such as encapsulation lessen the likelihood. Detection: modularization and documentation improve the odds, and then you test and debug.

Three debugging techniques from the deck: **print statements** (most popular; put them in the right places, expect voluminous output, plan how to turn them off), **walkthroughs** (tabulate key variables and state changes after each call; explaining your code to a peer often makes you spot the error yourself), and **debuggers** (breakpoints, Step and Step-into, the call stack, watching variable and object state; CLion's is the one you will use in the lab).

## Testing = verification + validation

Verification asks "did we build the app correctly?" and hunts for incorrect or undesirable behaviour. Validation asks "did we build the correct app?" and demonstrates to developer and customer that the requirements are met. The axioms: testing cannot show that bugs do not exist; a bug is a bug only if it is observed; you cannot fix every bug; subtle bugs stay hidden while major ones remain; specifications are a moving target.

**Dynamic testing** provides input, receives output and compares it with the expected behaviour. **Static testing** reviews the source, the documentation and the project plan without running anything. **Functional (black box)** tests come from the specification and treat the system as atomic; **structural (white box)** tests come from the code and examine the internals.

## Partitions and boundaries

Understand the contract of the test subject and look for violations, with positive tests (valid data) and negative tests (invalid data). Test the boundaries: zero, one, full; max and min; just inside and just outside; typical values; error values. Then create **disjoint equivalence partitions**: identify the inputs that are processed the same way (coverage), make each group a separate partition (disjointness), and let each test exercise one and only one partition (representation).

```widget
partitions
```

The deck's answer for a function that accepts 100 to 999 is five tests: 50 (way off), 100 and 999 (the boundaries), 500 (an arbitrary value inside), 1500 (way off). Click them in and watch the checklist fill.

## The three kinds of testing in COMP 3522

**Assertions** document and check preconditions (what the caller must promise), postconditions (what the code promises if the preconditions held) and invariants (what never changes). The `assert` macro from `<cassert>`, inherited from C, evaluates an expression and terminates the program immediately if it is false; defining `NDEBUG` before the include turns every assertion off.

```cpp run pin assertDemo.cpp
// stdin: 9
// predict: Input is 9. Write what prints. Then change the input to -4 and describe what happens to the exit code.
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

`assert(x >= 0);` is the precondition and `assert(result >= 0.0);` the postcondition of the deck's example. With 9 the program prints 3. With a negative input the first assertion fails, the program aborts with a message naming the file, line and expression, and the exit code is non-zero: the bug is caught at its source instead of surfacing as a `nan` somewhere downstream.

**Unit tests** exercise a very small, specific area of functionality by invoking one function in one context (the deck's example: add a large value to a sorted list and confirm it appears at the end). A unit is the smallest testable part: a function, a method, a behaviour. Each unit test should **Assemble, Act, Assert**, and consider the starting state, the inputs and the expected result. JUnit organizes test methods into test cases with assertions and fixtures; in C++ we use **Catch**, next lesson.

**Regression testing** re-runs the whole suite. Whenever you find and fix a bug, add a test for it and rerun everything, because fixing new bugs can reintroduce old ones; run the regression tests as often as possible.

Two strategies close the deck. **Test-driven development**: write the tests first, implement, the code is complete when the tests pass, refactor and pass again. **Simplify**: find the simplest input that provokes the bug, which is often not the input that revealed it; narrow it down by binary search; take pieces away until the bug disappears, or add pieces until it appears; trace intermediate results and binary-search the ordered set of statements between the first and the last.

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
