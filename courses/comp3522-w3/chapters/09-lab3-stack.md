---
title: Lab 3: MyStack and Catch unit tests
minutes: 30
---

Lab 3 has two halves: implement an array-based stack of positive ints exactly as specified, then prove it works with Catch unit tests instead of a `main` full of `cout`. Both halves are marked against the wording of the spec, so this lesson follows it line by line.

## The specification

| Requirement | Detail |
|---|---|
| files | `myStack.hpp` and `myStack.cpp`; class named `MyStack` (C++ already has `std::stack`) |
| contents | positive ints only; negative numbers are reserved for errors |
| storage | a C-style `int` array of size 10; the maximum size is a `constexpr`, never a magic number |
| second member | an `int` holding the index of the current top |
| default constructor | top index starts at **-1**, an index that can never be real, so a new stack is empty |
| `bool push(int)` | adds to the top; returns true if added, false if the stack was full |
| `void pop()` | decrements the top index; the old value is ignored, not zeroed |
| `int top() const` | returns the top value without removing it; **-1** on an empty stack (keep -1 in a global const) |
| `bool empty() const`, `bool full() const` | the two edge states |
| `print() const` | bottom to top, easy to read, and returns something testable (a string) |

```cpp run pin myStack.cpp
// predict: Write everything printed. Which push returns false?
#include <iostream>
#include <sstream>
#include <string>
using namespace std;

constexpr int MAX_SIZE = 10;
const int EMPTY_TOP = -1;   // returned by top() on an empty stack

class MyStack {
    int items[MAX_SIZE];
    int topIndex;           // invariant: -1 <= topIndex < MAX_SIZE
public:
    MyStack() : topIndex(-1) {}
    bool push(int value) {
        if (full() || value < 0) return false;   // precondition: room, and a positive value
        items[++topIndex] = value;               // postcondition: top() == value
        return true;
    }
    void pop() {
        if (!empty()) --topIndex;                // the old top is simply forgotten
    }
    int top() const { return empty() ? EMPTY_TOP : items[topIndex]; }
    bool empty() const { return topIndex == -1; }
    bool full() const { return topIndex == MAX_SIZE - 1; }
    string print() const {
        if (empty()) return "(the stack is empty)";
        ostringstream out;
        out << "bottom [";
        for (int i = 0; i <= topIndex; ++i) out << (i ? " " : "") << items[i];
        out << "] top";
        return out.str();
    }
};

int main() {
    MyStack s;
    cout << s.print() << endl;
    for (int v = 1; v <= 11; ++v) {
        if (!s.push(v * 10)) cout << "push(" << v * 10 << ") returned false" << endl;
    }
    cout << s.print() << endl;
    s.pop();
    s.pop();
    cout << "top is " << s.top() << ", full? " << s.full() << endl;
    return 0;
}
```

`constexpr int MAX_SIZE = 10;` is the maximum size the spec asks for, and `int items[MAX_SIZE];` uses it instead of a literal 10. `MyStack() : topIndex(-1) {}` makes a new stack empty. `push` refuses when the stack is full or the value is not positive and returns false, otherwise `items[++topIndex] = value;` writes into the next free slot; the eleventh push in the loop is the one that returns false. `pop` only moves the index down, which answers the lab's question "why not zero it out?": the slot above the top is unreachable, so its old contents are irrelevant and the next push overwrites them. `print` returns a `string` built with an `ostringstream` so a test can compare it.

The comments name the **precondition** (what the caller promises), the **postcondition** (what the function promises) and the **invariant** (what is always true of `topIndex`); the lab asks for exactly those in your comments.

## Catch in three lines

Catch is a single header, `catch.hpp`, already in the cloned project. In a new `unit_tests.cpp`:

```cpp
#define CATCH_CONFIG_MAIN   // This tells Catch to provide a main(), put this in one cpp file
#include "catch.hpp"
#include "myStack.hpp"

TEST_CASE("A new stack is empty", "testTag1")
{
    MyStack tester;

    REQUIRE(tester.empty() == true);
    REQUIRE(tester.full() == false);
}
```

`CATCH_CONFIG_MAIN` makes the header generate an invisible `main` that finds every `TEST_CASE` and runs it, so your own `main` must be commented out (or the linker sees two). Each `TEST_CASE` has a description and an optional tag; `REQUIRE` asserts something that must be true and reports the line and the expression when it is not. Then Run | Edit Configurations, add a Catch configuration called Unit Tests, and Run.

Write each test case as if it were its own separate main: they run independently, in any order. Do not write one giant test case. The description in the first parameter must describe the test; no other comments are required.

## The lab's suggested cases, as Catch tests

The runner cannot ship the 650 KB `catch.hpp`, so the program below carries a 20-line stand-in that provides the same `TEST_CASE` and `REQUIRE` and prints a similar summary. Your tests are the part that matters.

```cpp run pin unit_tests.cpp
// predict: Which test cases fail, and on which REQUIRE lines? Write the summary line.
#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <sstream>
using namespace std;

// ---- a 20-line stand-in for catch.hpp (same TEST_CASE / REQUIRE spelling) ----
struct TestCase { string name; function<void()> body; };
static vector<TestCase>& tests() { static vector<TestCase> t; return t; }
static int failures = 0, checks = 0;
struct Registrar { Registrar(const string& n, function<void()> f) { tests().push_back({n, f}); } };
#define CAT2(a, b) a##b
#define CAT(a, b) CAT2(a, b)
#define TEST_CASE(name, tags) static void CAT(test_, __LINE__)(); static Registrar CAT(reg_, __LINE__)(name, CAT(test_, __LINE__)); static void CAT(test_, __LINE__)()
#define REQUIRE(expr) do { ++checks; if (!(expr)) { ++failures; cout << "  FAILED: REQUIRE( " #expr " ) at line " << __LINE__ << endl; } } while (0)
int main() { size_t failed = 0; for (auto& t : tests()) { cout << "TEST_CASE \"" << t.name << "\"" << endl; int before = failures; t.body(); if (failures > before) ++failed; } if (failed) cout << "test cases: " << tests().size() << " | " << tests().size() - failed << " passed | " << failed << " failed" << endl; else cout << "All tests passed (" << checks << " assertions in " << tests().size() << " test cases)" << endl; return failed ? 1 : 0; }
// ---- end of stand-in ----

constexpr int MAX_SIZE = 10;
const int EMPTY_TOP = -1;

class MyStack {
    int items[MAX_SIZE];
    int topIndex;
public:
    MyStack() : topIndex(-1) {}
    bool push(int value) { if (full() || value < 0) return false; items[++topIndex] = value; return true; }
    void pop() { if (!empty()) --topIndex; }
    int top() const { return empty() ? EMPTY_TOP : items[topIndex]; }
    bool empty() const { return topIndex == -1; }
    bool full() const { return topIndex == MAX_SIZE - 2; }   // off by one: two tests below catch it
};

TEST_CASE("A new stack is empty", "testTag1")
{
    MyStack tester;
    REQUIRE(tester.empty() == true);
    REQUIRE(tester.full() == false);
}

TEST_CASE("Pop an empty stack leaves it empty and top is -1", "edge")
{
    MyStack s;
    s.pop();
    REQUIRE(s.empty());
    REQUIRE(s.top() == EMPTY_TOP);
}

TEST_CASE("Pop empty stack then add values", "edge")
{
    MyStack s;
    s.pop();
    REQUIRE(s.push(5));
    REQUIRE(s.top() == 5);
}

TEST_CASE("Push more than the maximum: extra pushes fail and top is the tenth value", "edge")
{
    MyStack s;
    for (int i = 1; i <= MAX_SIZE; ++i) REQUIRE(s.push(i));
    REQUIRE(s.push(99) == false);
    REQUIRE(s.top() == MAX_SIZE);
}

TEST_CASE("Push X values, pop Y values, check top", "typical")
{
    MyStack s;
    for (int i = 1; i <= 7; ++i) s.push(i * 10);
    s.pop(); s.pop(); s.pop();
    REQUIRE(s.top() == 40);
}

TEST_CASE("Push exactly 10 values: stack is full and top is the tenth", "boundary")
{
    MyStack s;
    for (int i = 1; i <= MAX_SIZE; ++i) s.push(i);
    REQUIRE(s.full() == true);
    REQUIRE(s.top() == 10);
}
```

Six of the seven FAQ cases, each its own `TEST_CASE`. The class in this file has a planted bug: `bool full() const { return topIndex == MAX_SIZE - 2; }` reports the stack full after nine values, one short of the ten the spec promises. Only tests that reach the boundary can notice, which is what boundary tests are for; fix the comparison to `MAX_SIZE - 1` and rerun to see `All tests passed`.

:::tip Catch is slow to compile
The lab's own advice: test the edge cases with an ordinary `main` first, and only once the stack behaves write the unit tests. Magic numbers are allowed inside tests.
:::

```challenge
{ "prompt": "The tests are written; the stack is not. Implement <code>push</code>, <code>pop</code> and <code>top</code> exactly as the lab specifies (positive ints only, <code>false</code> when full, <code>-1</code> from <code>top()</code> on an empty stack). All five test cases must pass, printing the summary line <code>All tests passed (14 assertions in 5 test cases)</code>.", "starter": "#include <iostream>\n#include <string>\n#include <vector>\n#include <functional>\nusing namespace std;\nstruct TestCase { string name; function<void()> body; };\nstatic vector<TestCase>& tests() { static vector<TestCase> t; return t; }\nstatic int failures = 0, checks = 0;\nstruct Registrar { Registrar(const string& n, function<void()> f) { tests().push_back({n, f}); } };\n#define CAT2(a, b) a##b\n#define CAT(a, b) CAT2(a, b)\n#define TEST_CASE(name, tags) static void CAT(test_, __LINE__)(); static Registrar CAT(reg_, __LINE__)(name, CAT(test_, __LINE__)); static void CAT(test_, __LINE__)()\n#define REQUIRE(expr) do { ++checks; if (!(expr)) { ++failures; cout << \"  FAILED: REQUIRE( \" #expr \" ) at line \" << __LINE__ << endl; } } while (0)\nint main() { size_t failed = 0; for (auto& t : tests()) { cout << \"TEST_CASE \\\"\" << t.name << \"\\\"\" << endl; int before = failures; t.body(); if (failures > before) ++failed; } if (failed) cout << \"test cases: \" << tests().size() << \" | \" << tests().size() - failed << \" passed | \" << failed << \" failed\" << endl; else cout << \"All tests passed (\" << checks << \" assertions in \" << tests().size() << \" test cases)\" << endl; return failed ? 1 : 0; }\n\nconstexpr int MAX_SIZE = 10;\nconst int EMPTY_TOP = -1;\n\nclass MyStack {\n    int items[MAX_SIZE];\n    int topIndex;\npublic:\n    MyStack() : topIndex(-1) {}\n    bool push(int value) {\n        // TODO\n        return false;\n    }\n    void pop() {\n        // TODO\n    }\n    int top() const {\n        // TODO\n        return 0;\n    }\n    bool empty() const { return topIndex == -1; }\n    bool full() const { return topIndex == MAX_SIZE - 1; }\n};\n\nTEST_CASE(\"A new stack is empty\", \"t1\") { MyStack s; REQUIRE(s.empty()); REQUIRE(!s.full()); REQUIRE(s.top() == EMPTY_TOP); }\nTEST_CASE(\"Push then top\", \"t2\") { MyStack s; REQUIRE(s.push(7)); REQUIRE(s.top() == 7); REQUIRE(!s.empty()); }\nTEST_CASE(\"Negative values are refused\", \"t3\") { MyStack s; REQUIRE(s.push(-3) == false); REQUIRE(s.empty()); }\nTEST_CASE(\"Full stack refuses an eleventh push\", \"t4\") { MyStack s; for (int i = 1; i <= 10; ++i) s.push(i); REQUIRE(s.full()); REQUIRE(s.push(11) == false); REQUIRE(s.top() == 10); }\nTEST_CASE(\"Pop removes the top; pop on empty is harmless\", \"t5\") { MyStack s; s.push(1); s.push(2); s.pop(); REQUIRE(s.top() == 1); s.pop(); s.pop(); REQUIRE(s.empty()); REQUIRE(s.top() == EMPTY_TOP); }\n", "expected": "TEST_CASE \"A new stack is empty\"\nTEST_CASE \"Push then top\"\nTEST_CASE \"Negative values are refused\"\nTEST_CASE \"Full stack refuses an eleventh push\"\nTEST_CASE \"Pop removes the top; pop on empty is harmless\"\nAll tests passed (14 assertions in 5 test cases)", "hints": ["push: if the stack is full or the value is negative, return false; otherwise store at <code>items[++topIndex]</code> and return true.", "pop: only decrement <code>topIndex</code> when the stack is not empty.", "top: return <code>EMPTY_TOP</code> when empty, else <code>items[topIndex]</code>."], "solution": "#include <iostream>\n#include <string>\n#include <vector>\n#include <functional>\nusing namespace std;\nstruct TestCase { string name; function<void()> body; };\nstatic vector<TestCase>& tests() { static vector<TestCase> t; return t; }\nstatic int failures = 0, checks = 0;\nstruct Registrar { Registrar(const string& n, function<void()> f) { tests().push_back({n, f}); } };\n#define CAT2(a, b) a##b\n#define CAT(a, b) CAT2(a, b)\n#define TEST_CASE(name, tags) static void CAT(test_, __LINE__)(); static Registrar CAT(reg_, __LINE__)(name, CAT(test_, __LINE__)); static void CAT(test_, __LINE__)()\n#define REQUIRE(expr) do { ++checks; if (!(expr)) { ++failures; cout << \"  FAILED: REQUIRE( \" #expr \" ) at line \" << __LINE__ << endl; } } while (0)\nint main() { size_t failed = 0; for (auto& t : tests()) { cout << \"TEST_CASE \\\"\" << t.name << \"\\\"\" << endl; int before = failures; t.body(); if (failures > before) ++failed; } if (failed) cout << \"test cases: \" << tests().size() << \" | \" << tests().size() - failed << \" passed | \" << failed << \" failed\" << endl; else cout << \"All tests passed (\" << checks << \" assertions in \" << tests().size() << \" test cases)\" << endl; return failed ? 1 : 0; }\n\nconstexpr int MAX_SIZE = 10;\nconst int EMPTY_TOP = -1;\n\nclass MyStack {\n    int items[MAX_SIZE];\n    int topIndex;\npublic:\n    MyStack() : topIndex(-1) {}\n    bool push(int value) {\n        if (full() || value < 0) return false;\n        items[++topIndex] = value;\n        return true;\n    }\n    void pop() {\n        if (!empty()) --topIndex;\n    }\n    int top() const {\n        return empty() ? EMPTY_TOP : items[topIndex];\n    }\n    bool empty() const { return topIndex == -1; }\n    bool full() const { return topIndex == MAX_SIZE - 1; }\n};\n\nTEST_CASE(\"A new stack is empty\", \"t1\") { MyStack s; REQUIRE(s.empty()); REQUIRE(!s.full()); REQUIRE(s.top() == EMPTY_TOP); }\nTEST_CASE(\"Push then top\", \"t2\") { MyStack s; REQUIRE(s.push(7)); REQUIRE(s.top() == 7); REQUIRE(!s.empty()); }\nTEST_CASE(\"Negative values are refused\", \"t3\") { MyStack s; REQUIRE(s.push(-3) == false); REQUIRE(s.empty()); }\nTEST_CASE(\"Full stack refuses an eleventh push\", \"t4\") { MyStack s; for (int i = 1; i <= 10; ++i) s.push(i); REQUIRE(s.full()); REQUIRE(s.push(11) == false); REQUIRE(s.top() == 10); }\nTEST_CASE(\"Pop removes the top; pop on empty is harmless\", \"t5\") { MyStack s; s.push(1); s.push(2); s.pop(); REQUIRE(s.top() == 1); s.pop(); s.pop(); REQUIRE(s.empty()); REQUIRE(s.top() == EMPTY_TOP); }\n" }
```

## Marking

Out of 10: 2 for committing and pushing after every non-trivial change, 3 for the data structure exactly as described, 3 for testing it exactly as described, 2 for style (comments, names, atomic functions, constants instead of magic numbers). A program that does not compile earns zero. Submit through GitHub, not the Learning Hub. If Cygwin complains "too many sections" or "File too big" when compiling the Catch file, add `-Wa,-mbig-obj` to `CMAKE_CXX_FLAGS` in CMakeLists.txt.

## Run new operations on a three-slot stack

`SmallStack` follows the lab's rules with a maximum size of 3: positive ints only, `false` when full, `-1` from `top()` when empty.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nconstexpr int MAX = 3;\n\nclass SmallStack\n{\n    int items[MAX];\n    int topIndex;\npublic:\n    SmallStack() : topIndex(-1) { }\n    bool push(int v)\n    {\n        if (topIndex == MAX - 1 || v < 0) return false;\n        items[++topIndex] = v;\n        return true;\n    }\n    void pop() { if (topIndex != -1) --topIndex; }\n    int top() const { return topIndex == -1 ? -1 : items[topIndex]; }\n    bool empty() const { return topIndex == -1; }\n};\n\nint main()\n{\n    SmallStack s;\n    s.push(4);\n    s.push(9);\n    s.pop();\n    s.push(2);\n    cout << s.top() << ' ';\n    s.pop();\n    s.pop();\n    cout << s.top() << ' ' << boolalpha << s.empty() << endl;\n    return 0;\n}",
    "options": [
      "`2 -1 true`",
      "`9 4 false`",
      "`2 4 true`",
      "`2 0 true`"
    ],
    "answer": 0,
    "explain": "Push 4, push 9, pop removes 9, push 2: the stack is 4 2 and `top()` is 2. Two pops empty it, so `top()` returns the lab's -1 and `empty()` is true. Output: `2 -1 true`."
  },
  {
    "type": "text",
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nconstexpr int MAX = 3;\n\nclass SmallStack\n{\n    int items[MAX];\n    int topIndex;\npublic:\n    SmallStack() : topIndex(-1) { }\n    bool push(int v)\n    {\n        if (topIndex == MAX - 1 || v < 0) return false;\n        items[++topIndex] = v;\n        return true;\n    }\n    void pop() { if (topIndex != -1) --topIndex; }\n    int top() const { return topIndex == -1 ? -1 : items[topIndex]; }\n    bool empty() const { return topIndex == -1; }\n};\n\nint main()\n{\n    SmallStack s;\n    cout << s.push(1) << s.push(-5) << s.push(2) << s.push(3) << s.push(4) << endl;\n    return 0;\n}",
    "answer": [
      "10110"
    ],
    "explain": "The operands of one `<<` chain are evaluated left to right in C++17 and later. `push(1)` succeeds (1). `push(-5)` is refused because the lab stores positive ints only (0). `push(2)` and `push(3)` fill the three slots (1 1). `push(4)` finds the stack full (0). Output: `10110`."
  },
  {
    "q": "A student's `empty()` returns `topIndex == 0`. Which of these Catch tests fail? (select all)",
    "options": [
      "`MyStack s; REQUIRE(s.empty());`",
      "`MyStack s; s.push(5); REQUIRE(!s.empty());`",
      "`MyStack s; s.push(5); s.push(6); REQUIRE(!s.empty());`",
      "`MyStack s; REQUIRE(s.top() == -1);`"
    ],
    "answer": [
      0,
      1
    ],
    "explain": "A new stack has topIndex -1, so `empty()` returns false and the first test fails. After one push topIndex is 0, so `empty()` wrongly returns true and the second fails. After two pushes topIndex is 1, which the bug reports correctly, and `top()` does not use `empty()`. Testing the boundaries zero and one catches it."
  },
  {
    "q": "`pop()` is written as `void pop() { --topIndex; }` with no check. On a new stack, `pop()` then `push(8)` runs. What goes wrong?",
    "options": [
      "topIndex goes to -2, and the push writes to `items[-1]`, outside the array",
      "Nothing: `push` resets topIndex to 0",
      "The pop throws an exception",
      "The compiler rejects `--topIndex` on a negative value"
    ],
    "answer": 0,
    "explain": "-1 − 1 = -2. `push` then does `items[++topIndex]` with topIndex -1: an out-of-bounds write that corrupts memory without any error message. That is why the lab's suggested tests include \"pop an empty stack, then add values\"."
  }
]
```

```challenge
{
  "prompt": "Write <code>class CharStack</code> in the lab's style (array of size <code>MAX</code>, top index starting at -1) with <code>push(char)</code>, <code>pop()</code>, <code>top() const</code> and <code>empty() const</code>. <code>main</code> pushes the letters of <code>stack</code> and pops them all, printing <code>kcats</code>.",
  "starter": "#include <iostream>\n#include <string>\nusing namespace std;\n\nconstexpr int MAX = 10;\n\n// class CharStack here\n\nint main()\n{\n    CharStack s;\n    string word = \"stack\";\n    for (char c : word)\n    {\n        s.push(c);\n    }\n    while (!s.empty())\n    {\n        cout << s.top();\n        s.pop();\n    }\n    cout << endl;\n    return 0;\n}\n",
  "expected": "kcats\n",
  "hints": [
    "Members: <code>char items[MAX]; int topIndex;</code> and a constructor setting <code>topIndex(-1)</code>.",
    "<code>push</code>: refuse when <code>topIndex == MAX - 1</code>, else <code>items[++topIndex] = c;</code>"
  ],
  "solution": "#include <iostream>\n#include <string>\nusing namespace std;\n\nconstexpr int MAX = 10;\n\nclass CharStack\n{\n    char items[MAX];\n    int topIndex;\npublic:\n    CharStack() : topIndex(-1) { }\n    bool push(char c)\n    {\n        if (topIndex == MAX - 1) return false;\n        items[++topIndex] = c;\n        return true;\n    }\n    void pop()\n    {\n        if (!empty()) --topIndex;\n    }\n    char top() const { return items[topIndex]; }\n    bool empty() const { return topIndex == -1; }\n};\n\nint main()\n{\n    CharStack s;\n    string word = \"stack\";\n    for (char c : word)\n    {\n        s.push(c);\n    }\n    while (!s.empty())\n    {\n        cout << s.top();\n        s.pop();\n    }\n    cout << endl;\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "Why must the stack class be called `MyStack` rather than `Stack`?",
    "options": ["Stack is a keyword", "C++ already has a built-in `std::stack` and the lab wants to avoid naming conflicts", "Class names must start with My", "The autograder searches for MyStack"],
    "answer": 1,
    "explain": "The lab's hint: C++ has a built-in stack and we want to avoid naming conflicts."
  },
  {
    "q": "What should the default constructor set the top index to, and why?",
    "options": ["0, the first slot", "-1, an index that can never be a real position, so a new stack is empty", "10, the maximum", "Any value; push sets it"],
    "answer": 1,
    "explain": "A new stack of int is empty, so the index should be something that can never be a real index: -1. empty() then tests for it."
  },
  {
    "q": "`pop()` does not zero out the removed value. Why is that fine?",
    "options": ["Zeroing is impossible in C++", "The slot is above the top index and can never be read; the next push overwrites it", "Because the value was negative", "It is a bug in the spec"],
    "answer": 1,
    "explain": "Decrementing the top index makes the old value unreachable through the stack's interface; the lab's 'why not?' question has this answer."
  },
  {
    "q": "What does `top()` return on an empty stack, per the lab FAQ?",
    "type": "numeric",
    "answer": -1,
    "tolerance": 0,
    "explain": "Return -1 when checking the top of an empty stack, saved in a global const. Negative numbers are reserved for errors because the stack holds positive ints only."
  },
  {
    "q": "Which two lines must appear at the top of `unit_tests.cpp` for Catch to work?",
    "options": ["`#include <catch>` and `int main()`", "`#define CATCH_CONFIG_MAIN` and `#include \"catch.hpp\"`", "`#pragma once` and `using namespace catch;`", "`#include \"myStack.hpp\"` twice"],
    "answer": 1,
    "explain": "CATCH_CONFIG_MAIN tells Catch to generate a main (in exactly one .cpp file); then the header is included. Your own main must be commented out."
  },
  {
    "q": "Why comment out your own `main` when using Catch?",
    "options": ["Catch runs faster without it", "Catch generates its own main; two mains in one program is a link error", "main cannot coexist with classes", "The lab forbids main"],
    "answer": 1,
    "explain": "CATCH_CONFIG_MAIN produces an invisible main that runs every TEST_CASE; a second definition of main would clash."
  },
  {
    "q": "How should test cases be organized?",
    "options": ["One giant TEST_CASE that tests everything", "Each TEST_CASE written as its own separate main, run independently", "One REQUIRE per file", "Tests inside the class"],
    "answer": 1,
    "explain": "The FAQ: write code in each TEST_CASE block as if it was its own separate main method; each is run independently."
  },
  {
    "q": "In the planted-bug program, `full()` compares `topIndex == MAX_SIZE - 2`. Which test cases catch it?",
    "options": ["A new stack is empty", "Push exactly 10 values: stack is full and top is the tenth", "Pop an empty stack leaves it empty and top is -1", "Push more than the maximum: extra pushes fail and top is the tenth value"],
    "answer": [1, 3],
    "explain": "With 10 slots the last valid index is 9, so full() must compare with MAX_SIZE - 1. MAX_SIZE - 2 reports full after nine values, so the tenth push is refused: both tests that push ten values fail (the tenth REQUIRE(s.push(i)) and REQUIRE(s.top() == MAX_SIZE) in one, REQUIRE(s.top() == 10) in the other). A new stack is still empty and not full, and popping an empty stack never reaches full()."
  },
  {
    "q": "What does `REQUIRE(tester.empty() == true);` do when `empty()` returns false?",
    "options": ["Nothing; REQUIRE is a comment", "Records a failed assertion for that test case, reporting the expression and the line", "Deletes the stack", "Stops the whole program silently"],
    "answer": 1,
    "explain": "REQUIRE asserts what should be true and reports a failure with the expression text and line number; the run summary counts failed test cases."
  }
]
```
