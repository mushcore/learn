---
title: The six catch guidelines and stack unwinding
minutes: 22
---

A try block can have several handlers, and which one runs depends on the thrown type and on the order you wrote them. Six guidelines from the slides settle the order; stack unwinding is what happens to every local object between the throw and the catch.

## The six guidelines

**1. Catch exceptions by reference.** A reference captures exceptions that are derived from the reference type: `catch (e1_type1& e1) { … }`.

**2. The first catch-block with a matching type is executed.** Handlers are tried top to bottom:

```cpp
catch (e1_type1& e1) {…}
catch (e1_type2& e2) {…}
```

**3. Further catch-blocks of the same type or child-types are ignored.**

```cpp
catch (e1_type1& e1) {} //catches e1_type1
catch (e1_type1& e2) {} //IGNORED - same type as previous
```

Order matters, so the child type goes first; listed after its parent it would never run:

```cpp
catch (child_type& e1) {} //order matters. Child type first
catch (parent_type& e2) {} //sub type exception caught here
```

**4. A catch-block with an ellipsis, i.e., three dots, catches all exceptions.** *Obviously this should be the last one*: `catch (...) { // This catches EVERYTHING }`.

**5. If nothing else, consider capturing the exception, providing an informative error message, and terminating the program.**

```cpp
catch (cannot_open_file& e)
{
    cerr << "FILE NOT FOUND. TERMINATING...\n";
    exit(EXIT_FAILURE); // <cstdlib>
}
```

**6. Alternatively, we can continue after the error message or after implementing some sort of rescue, by rethrowing the exception.**

```cpp
catch (cannot_open_file& e)
{
    cerr << "FILE NOT FOUND.\n";
    ...
    throw; // Rethrows cannot_open_file exception
}
```

## Guidelines 1 to 4 in one program

```cpp run pin ex_catch_order.cpp
// predict: Each try block prints one line. Write the four lines.
// Guideline 3: child type must be caught before the parent type; by reference keeps the derived type.
#include <iostream>
#include <stdexcept>
using namespace std;

struct parent_type : public exception {
    const char* what() const noexcept override { return "parent"; }
};
struct child_type : public parent_type {
    const char* what() const noexcept override { return "child"; }
};

int main() {
    // child first: the child handler runs
    try { throw child_type(); }
    catch (child_type& e) { cout << "A: child handler: " << e.what() << endl; }
    catch (parent_type& e) { cout << "A: parent handler: " << e.what() << endl; }

    // parent first: the parent handler swallows the child (compiler warns the second is unreachable)
    try { throw child_type(); }
    catch (parent_type& e) { cout << "B: parent handler, but what() is still: " << e.what() << endl; }
    catch (child_type& e) { cout << "B: child handler: " << e.what() << endl; }

    // catch by VALUE slices the child down to a parent
    try { throw child_type(); }
    catch (parent_type e) { cout << "C: caught by value, what() is now: " << e.what() << endl; }

    // ellipsis catches everything, including a thrown int
    try { throw 42; }
    catch (exception& e) { cout << "D: exception" << endl; }
    catch (...) { cout << "D: catch-all" << endl; }
    return 0;
}
```

Every block throws a `child_type`, which derives from `parent_type`, which derives from `std::exception`. A parent handler listed first swallows the child, and g++ only warns that the child handler below it will be caught by an earlier handler. By reference the object stays a child, so the virtual `what()` dispatches to the child; by value it is copied into a new `parent_type` and sliced, which is why guideline 1 says reference. `catch (exception& e)` cannot match a thrown `int`, but `catch (...)` matches anything, gives you no variable to read, and must be the last handler or g++ refuses to compile.

```widget
catch-matcher
{ "throw": "child_type", "handlers": ["parent_type&", "child_type&", "..."], "presets": true }
```

## Stack unwinding: every frame left on the way up destroys its locals

```cpp run pin ex_unwind.cpp
// predict: Write all ten lines in order (constructed, throws, destroyed, caught, continues).
// Stack unwinding: destructors of locals run while the exception travels up, and a rethrow continues the trip.
#include <iostream>
#include <stdexcept>
using namespace std;

struct Guard {
    const char* name;
    Guard(const char* n) : name(n) { cout << "  " << name << " constructed" << endl; }
    ~Guard() { cout << "  " << name << " destroyed" << endl; }
};

int level3() {
    Guard g("g3");
    cout << "level3 throws" << endl;
    throw runtime_error("boom");
    return 3; // never reached
}

int level2() {
    Guard g("g2");
    try {
        return level3();
    } catch (runtime_error& e) {
        cout << "level2 caught: " << e.what() << ", rethrowing" << endl;
        throw; // rethrow the same object
    }
}

int level1() {
    Guard g("g1");
    return level2();   // no handler here: the exception passes straight through
}

int main() {
    try {
        level1();
    } catch (exception& e) {
        cout << "main caught: " << e.what() << endl;
    }
    cout << "main continues" << endl;
    return 0;
}
```

### The search for a handler, then the unwinding

Each frame owns a `Guard` that prints when it dies. Watch the order: the frames between the throw and the handler are left, and their locals destroyed, before the handler's body prints anything. A bare `throw;` restarts the trip from the enclosing frames. Unwinding is scope exit performed by the exception, in reverse order of construction, which is why cleanup belongs in destructors.

```widget
unwind-stepper
{ "preset": "caught in main (rethrow in level2)", "predict": true }
```

## Terminate or rethrow

Guideline 5 ends the program on purpose: `exit(EXIT_FAILURE)` from `<cstdlib>` stops it at once with a failure status, after the message has been written. Guideline 6 passes the problem up with a bare `throw;`, which rethrows the current exception object itself. `throw e;` is different: it throws a **copy** of `e`, built from the static type of the handler's parameter, so a child caught through a `parent_type&` is sliced down to a parent before it travels on.

```challenge
{
  "prompt": "The handlers are in the wrong order, so the program prints <code>parent</code>. Reorder the catch clauses (do not change the throw or the classes) so that it prints <code>child</code> and the ellipsis stays legal.",
  "starter": "#include <iostream>\n#include <exception>\nusing namespace std;\n\nstruct parent_type : public exception\n{\n    const char* what() const noexcept override { return \"parent\"; }\n};\nstruct child_type : public parent_type\n{\n    const char* what() const noexcept override { return \"child\"; }\n};\n\nint main()\n{\n    try\n    {\n        throw child_type();\n    }\n    catch (parent_type& e)\n    {\n        cout << e.what() << endl;\n    }\n    catch (child_type& e)\n    {\n        cout << e.what() << endl;\n    }\n    catch (...)\n    {\n        cout << \"unknown\" << endl;\n    }\n    return 0;\n}\n",
  "expected": "child",
  "hints": ["Guideline 3: a handler for the child type after one for its parent is ignored, so move the child handler up.", "Guideline 4: <code>catch (...)</code> must remain the last handler, or g++ refuses to compile."],
  "solution": "#include <iostream>\n#include <exception>\nusing namespace std;\n\nstruct parent_type : public exception\n{\n    const char* what() const noexcept override { return \"parent\"; }\n};\nstruct child_type : public parent_type\n{\n    const char* what() const noexcept override { return \"child\"; }\n};\n\nint main()\n{\n    try\n    {\n        throw child_type();\n    }\n    catch (child_type& e)\n    {\n        cout << e.what() << endl;\n    }\n    catch (parent_type& e)\n    {\n        cout << e.what() << endl;\n    }\n    catch (...)\n    {\n        cout << \"unknown\" << endl;\n    }\n    return 0;\n}\n"
}
```

```quiz
[
  {
    "q": "Why does guideline 1 say to catch exceptions by reference?",
    "options": ["References are faster to type", "A reference to the base type also captures derived exceptions, without slicing them to the base", "Catching by value does not compile", "Only references can be rethrown"],
    "answer": 1,
    "explain": "catch (parent_type& e) accepts a child_type and keeps it a child, so the virtual what() still gives the child's message. By value copies into a parent_type object and the child part is sliced away."
  },
  {
    "q": "A `child_type` (derived from `parent_type`) is thrown into these handlers. What prints?",
    "code": "catch (parent_type& e) { cout << \"P\"; }\ncatch (child_type& e)  { cout << \"C\"; }\ncatch (...)            { cout << \"E\"; }",
    "options": ["P", "C", "PC", "E"],
    "answer": 0,
    "explain": "The first handler with a matching type runs, and a parent reference matches a child. The child handler after it is ignored (g++ warns that it is unreachable); only one handler ever runs per throw."
  },
  {
    "q": "Where must `catch (...)` be placed, and what does it catch?",
    "options": ["First, and only standard exceptions", "Anywhere, and only class types", "Last, and every exception including ints and string literals", "Last, and only exceptions derived from `std::exception`"],
    "answer": 2,
    "explain": "The ellipsis catches EVERYTHING, so any handler after it could never run; the slide says it should obviously be last, and g++ makes that a compile error."
  },
  {
    "q": "Which statement rethrows the exception currently being handled without copying it?",
    "options": ["`throw e;`", "`rethrow;`", "`throw;`", "`return e;`"],
    "answer": 2,
    "explain": "A bare throw; sends the same object on to an outer handler. throw e; throws a new copy built from the handler's parameter type, which slices a derived exception caught by base reference."
  },
  {
    "q": "During stack unwinding, what happens to the local objects of a function that has no matching handler?",
    "options": ["They are leaked until the program ends", "Their destructors run as the frame is left, in reverse order of construction", "They are copied into the handler", "Nothing until the exception is caught"],
    "answer": 1,
    "explain": "Each frame the exception passes through is exited like any scope: locals are destroyed last-constructed first. In ex_unwind.cpp g3 is destroyed before level2's handler even runs."
  },
  {
    "q": "Click the line that breaks guideline 1.",
    "type": "spotbug",
    "code": "try {\n    throw child_type();\n}\ncatch (child_type e) {\n    cout << e.what();\n}\ncatch (parent_type& e) {\n    cout << e.what();\n}",
    "answer": 4,
    "explain": "catch (child_type e) catches by value: the thrown object is copied, and with a polymorphic type that is slicing. Guideline 1: catch by reference, child_type& e."
  },
  {
    "q": "Put the handlers in an order that compiles with no warning and runs the most specific handler for each type (`length_error` derives from `logic_error`, which derives from `exception`).",
    "type": "reorder",
    "lines": [
      "catch (length_error& e) { }",
      "catch (logic_error& e) { }",
      "catch (exception& e) { }",
      "catch (...) { }"
    ],
    "explain": "Child before parent at every level, and the ellipsis last: a handler for a type listed after one for its ancestor can never run."
  },
  {
    "q": "In `ex_unwind.cpp`, `level2` catches the exception and rethrows it. Which line is printed immediately after `level2 caught: boom, rethrowing`?",
    "options": ["`g3 destroyed`", "`main caught: boom`", "`g2 destroyed`", "`g1 destroyed`"],
    "answer": 2,
    "explain": "g3 was already destroyed when level3's frame was left. The rethrow leaves level2, so its local g2 is destroyed next; then level1's g1, then main's handler runs."
  }
]
```
