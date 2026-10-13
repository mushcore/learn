---
title: noexcept, std::exception and terminate
minutes: 24
---

A function can promise that nothing escapes it, the standard library throws its own exception classes, and an exception that no handler matches ends the program.

## noexcept: nothing is thrown out of this function

C++03 allowed us to specify which types of exceptions can be thrown from a function (like Java); the feature *was very quickly deprecated (don't do this)*. C++11 added a qualification stating that **no exceptions must be thrown out of a function**: `double square_root(double x) noexcept { ... }`. Calling code never needs to check for thrown exceptions, and if one is thrown anyway the program ends, which is what should happen.

```cpp run pin ex_noexcept.cpp
// predict: Write the stdout line(s) printed before the program stops.
// A noexcept function that throws anyway: std::terminate, no handler gets a chance.
#include <iostream>
#include <stdexcept>
using namespace std;

double square_root(double x) noexcept {
    if (x < 0) throw invalid_argument("negative");
    return x / 2; // placeholder
}

int main() {
    try {
        cout << "calling square_root(-1)" << endl;
        square_root(-1);
    } catch (...) {
        cout << "this handler never runs" << endl;
    }
    cout << "not reached" << endl;
    return 0;
}
```

The exception may not leave the function, so `std::terminate` is called at the function's boundary before any handler is searched: the `catch (...)` in main would match anything, yet it never runs.

**Destructors are implicitly declared noexcept.** NEVER throw an exception from a destructor; if you do, it is treated as a run-time error and execution ends. During unwinding that would put two exceptions in flight at once.

### A noexcept frame on the call stack

The search for a handler stops at the `noexcept` frame: terminate runs with no unwinding, so no `Guard` is destroyed and main's catch never runs.

```widget
unwind-stepper
{ "preset": "noexcept frame" }
```

## std::exception and the virtual what()

The header `<exception>` declares `std::exception`, *a base class designed to be derived*; all exceptions thrown by members of the standard library derive from it. It contains a *virtual member function called what* returning a null-terminated char sequence, a `const char*`, not a `std::string`. Override it to deliver a meaningful message. Slide form:

```cpp
struct myexception: public exception {
   const char* what() const noexcept override
   { return "My exception happened"; }
};
```

```cpp run pin exception.cpp
// predict: Write the one line printed.
// using standard exceptions
#include <iostream>
#include <exception>
using namespace std;

class myexception: public exception
{
public:
 const char* what() const noexcept
  {
    return "My exception happened";
  }
};

int main () {
  try
  {
    throw myexception();
  }
  catch (exception& e)
  {
    cout << e.what() << '\n';
  }
  return 0;
}
```

Public inheritance lets a base-class handler accept `myexception`. `what()` matches the base's signature exactly: `const` because it does not change the object, `noexcept` because the base's `what()` is noexcept and an override may not promise less. The shipped file omits `override`; the slide includes it. The handler holds an `exception&`, so the call dispatches virtually to the override.

## The family tree

```widget
exception-tree
{ "select": "length_error" }
```

Slide 26 lists what the library derives from `std::exception`:

| Exception | Description |
|---|---|
| `bad_alloc` | thrown by new on allocation failure |
| `bad_cast` | thrown by dynamic_cast when it fails in a dynamic cast |
| `bad_function_call` | thrown on a bad call |
| `bad_typeid` | thrown by typeid |
| `logic_error` | thrown when a logic error occurs |
| `bad_weak_ptr` | thrown by shared_ptr when passed a bad weak_ptr |

So `new` does not return `nullptr` when memory runs out; it throws `bad_alloc`. Slide 27, *these exceptions are actually useful*: `<stdexcept>` defines two exception types that can be inherited by custom exceptions to report errors. **`logic_error`** has `invalid_argument`, `length_error` and `out_of_range`; **`runtime_error`** has `range_error` and `overflow_error`. A logic error could have been detected before running (an empty name, an index past the end); a runtime error only the running program can discover (an overflow). Each takes a message string in its constructor and returns it from `what()`. `catch (logic_error&)` takes all three children, `catch (exception&)` everything standard. The library also has `domain_error` and `underflow_error`, which the slide omits.

```cpp run pin exception3.cpp
// predict: Write the one line printed (the library's own message).
#include <string>
#include <exception>
#include <iostream>

int main()
{
    try
    {
        //trying to start copying from index 10. Doesn't exist
        std::string("abc").substr(10); // throws std::out_of_range
    }
    catch(const std::exception& e)
    {
        std::cout << e.what() << '\n';
        //throw;   // rethrows the exception object of type std::out_of_range
    }
}
```

`substr(10)` on a three-character string throws rather than read past the end, and the library writes the message. Slide 27 files this program under `length_error` and the shipped comments say so; libstdc++ throws `out_of_range`, a sibling in the same `logic_error` family, so the same handler catches it.

## No handler anywhere: terminate, then abort

Slide 29: *if an exception is not caught by any catch statement because there is no catch statement with a matching type, the special function terminate will be called.* `std::terminate` is in `<exception>`; it calls the termination handler; the termination handler calls `abort`; CRASH AND BURN.

```cpp run pin exception5.cpp
// predict: Write the seven lines printed before the program stops.
#include <iostream>
#include <string>
/*
 * Try catch for classes
 */
using namespace std;

class A
{
public:
    A() { cout << "A() created\n"; }
    ~A() { cout << "A() destroyed\n"; }

};

class B
{
public:
    B() { cout << "B() created\n"; }
    B(int) { cout << "B() being created\n"; throw "exception"; }
    ~B() { cout << "B() destroyed\n"; }

};

class C : public A
{
private:
    B my_b;
public:
    C(int x) try : A(), my_b(x) //can try/catch on the constructor
    {
        cout << "C() created\n";
    }
    catch ( ... )
    {
        cout << "C not constructed!\n";
        throw;
    }

    ~C() { cout << "C() destroyed\n"; }
};

int main()
{
    cout << "Making a B\n";
    B b;

    cout << "Making a C\n";
    C c(1); //throws error that's not caught
    //program terminates here
    cout << "Code not called because throw not caught" << endl;
    return 0;
}
```

`C(int x) try : A(), my_b(x)` is a **function-try-block**: the `try` wraps the initializer list as well as the body, so it sees exceptions thrown by the initializers. `C` builds its base `A`, then the member `my_b`, then its body; `B(int)` throws a `const char*` before `my_b` exists. The completed base is destroyed before the handler runs. A constructor's function-try-block handler cannot rescue the object: it **always rethrows**, and the explicit `throw;` only makes that visible. `C c(1);` sits in no try block, so no handler matches: `std::terminate`, then `abort`. Terminate does not unwind the stack, so `b` is never destroyed.

### No handler anywhere

The same rule on the Guard program: with no matching catch up the stack, terminate runs straight after the throw and no destructor prints.

```widget
unwind-stepper
{ "preset": "no handler anywhere" }
```

## Break a `noexcept` promise and trace a `Car` whose engine throws

A noexcept function handed an odd number, three library calls that throw standard exceptions, and a class whose middle member fails to construct.

```quiz
[
  {
    "q": "What is printed to stdout before the program stops?",
    "code": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nint half(int x) noexcept {\n    if (x % 2 != 0) throw invalid_argument(\"odd\");\n    return x / 2;\n}\n\nint main() {\n    try {\n        cout << half(8) << endl;\n        cout << half(3) << endl;\n        cout << half(4) << endl;\n    } catch (...) {\n        cout << \"caught\" << endl;\n    }\n    cout << \"end\" << endl;\n    return 0;\n}",
    "options": [
      "`4`",
      "`4`\n`caught`\n`end`",
      "`4`\n`caught`",
      "`4`\n`2`\n`end`"
    ],
    "answer": 0,
    "explain": "half(8) returns 4. half(3) throws, but half is noexcept, so the exception may not leave it: std::terminate is called at the function's boundary and the program ends. main's `catch (...)` never gets a chance, so neither `caught` nor `end` prints. g++ even warns that this throw will always call terminate."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3};\n    try {\n        cout << v.at(2) << endl;\n        cout << v.at(3) << endl;\n    } catch (out_of_range&) {\n        cout << \"out_of_range\" << endl;\n    }\n    string inputs[] = {\"12\", \"x9\"};\n    for (const string& s : inputs) {\n        try { cout << stoi(s) << endl; }\n        catch (logic_error&) { cout << \"logic_error\" << endl; }\n    }\n    return 0;\n}",
    "options": [
      "`3`\n`out_of_range`\n`12`\n`logic_error`",
      "`3`\n`0`\n`12`\n`0`",
      "`3`\n`out_of_range`\n`12`\n`9`",
      "`3`\n`out_of_range`\n`12`"
    ],
    "answer": 0,
    "explain": "`v.at(2)` is the third element, 3. `v.at(3)` is past the end, and at() checks: it throws std::out_of_range, caught by the first handler. `stoi(\"12\")` gives 12. `stoi(\"x9\")` cannot read a number from the first character and throws std::invalid_argument, which derives from logic_error, so `catch (logic_error&)` takes it."
  },
  {
    "q": "Complete the override of `what()`.",
    "type": "fill",
    "code": "#include <iostream>\n#include <exception>\nusing namespace std;\n\nstruct not_ready : public exception {\n    const char* what() const ___ override { return \"printer not ready\"; }\n};\n\nint main() {\n    try {\n        throw not_ready();\n    } catch (exception& e) {\n        cout << e.what() << endl;\n    }\n    return 0;\n}",
    "answer": [
      "noexcept"
    ],
    "explain": "std::exception declares `virtual const char* what() const noexcept`, and an override may not promise less, so it must say `noexcept` too: `const char* what() const noexcept override`. The handler holds an `exception&`, so the call dispatches to it and prints `printer not ready`."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nstruct Part {\n    string n;\n    Part(string n) : n(n) { cout << \"+\" << n << \" \"; }\n    ~Part() { cout << \"-\" << n << \" \"; }\n};\n\nstruct Engine {\n    Engine() { cout << \"+engine \"; throw runtime_error(\"seized\"); }\n    ~Engine() { cout << \"-engine \"; }\n};\n\nstruct Car {\n    Part wheel{\"wheel\"};\n    Engine engine;\n    Part seat{\"seat\"};\n    Car() { cout << \"+car \"; }\n    ~Car() { cout << \"-car \"; }\n};\n\nint main() {\n    try {\n        Car c;\n    } catch (exception& e) {\n        cout << e.what();\n    }\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`+wheel +engine -wheel seized`",
      "`+wheel +engine -engine -wheel seized`",
      "`+wheel +engine +seat -seat -wheel seized`",
      "`+wheel +engine -wheel -car seized`"
    ],
    "answer": 0,
    "explain": "Members are built in declaration order: wheel, then engine. Engine's constructor prints `+engine` and throws, so the engine never exists (no `-engine`), seat is never built, and Car's body never runs (no `+car`, and no `-car`, because no Car object was created). Only the fully built wheel is destroyed on the way out: `-wheel`. The handler prints `seized`."
  }
]
```

```challenge
{"prompt": "Write <code>negative_age</code>, a class derived publicly from <code>std::exception</code> whose <code>what()</code> override returns <code>\"age cannot be negative\"</code>. Use the exact signature of the base's <code>what()</code>.", "starter": "#include <iostream>\n#include <exception>\nusing namespace std;\n\n// write negative_age here\n\nvoid set_age(int age) {\n    if (age < 0) throw negative_age();\n    cout << \"age set to \" << age << endl;\n}\n\nint main() {\n    int tries[] = {30, -2};\n    for (int a : tries) {\n        try {\n            set_age(a);\n        } catch (exception& e) {\n            cout << e.what() << endl;\n        }\n    }\n    return 0;\n}\n", "expected": "age set to 30\nage cannot be negative", "hints": ["<code>class negative_age : public exception { public: ... };</code>", "<code>const char* what() const noexcept override { return \"age cannot be negative\"; }</code>"], "solution": "#include <iostream>\n#include <exception>\nusing namespace std;\n\nclass negative_age : public exception {\npublic:\n    const char* what() const noexcept override {\n        return \"age cannot be negative\";\n    }\n};\n\nvoid set_age(int age) {\n    if (age < 0) throw negative_age();\n    cout << \"age set to \" << age << endl;\n}\n\nint main() {\n    int tries[] = {30, -2};\n    for (int a : tries) {\n        try {\n            set_age(a);\n        } catch (exception& e) {\n            cout << e.what() << endl;\n        }\n    }\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "A function declared `noexcept` throws anyway. What happens?",
    "options": ["The nearest `catch (...)` in the caller handles it", "The exception is converted to a return code", "It does not compile", "The program ends: `std::terminate` is called"],
    "answer": 3,
    "explain": "noexcept promises that nothing is thrown out of the function; if something is, the program ends, which the slide says is what should happen. No handler in the caller gets a chance. g++ only warns at compile time."
  },
  {
    "q": "What does `std::exception::what()` return?",
    "options": ["`std::string`", "`const char*`", "`int`", "`void`"],
    "answer": 1,
    "explain": "A null-terminated char sequence. It is virtual, so a handler holding an exception& gets the derived class's message; override it as const char* what() const noexcept override."
  },
  {
    "q": "Which of these are true of destructors and exceptions? (select all)",
    "options": ["Destructors are implicitly declared `noexcept`", "Never throw an exception from a destructor", "If a destructor throws, it is a run-time error and execution ends", "A destructor may throw as long as the caller catches it"],
    "answer": [0, 1, 2],
    "explain": "The slide's rule and its reason. Destructors run during unwinding while an exception is already in flight; a second exception cannot be handled, so the program ends."
  },
  {
    "q": "Match each exception to its family or thrower.",
    "type": "match",
    "pairs": [
      ["`invalid_argument`", "`logic_error` (in `<stdexcept>`)"],
      ["`overflow_error`", "`runtime_error` (in `<stdexcept>`)"],
      ["`bad_alloc`", "thrown by `new` on allocation failure"],
      ["`bad_cast`", "thrown by `dynamic_cast` when it fails"]
    ],
    "explain": "logic_error: invalid_argument, length_error, out_of_range. runtime_error: range_error, overflow_error. The bad_* classes derive from std::exception directly and are thrown by the language and library."
  },
  {
    "q": "`new` returns `nullptr` when no memory is available.",
    "type": "tf",
    "answer": false,
    "explain": "new throws std::bad_alloc on allocation failure (slide 26). A nullptr check after new does nothing."
  },
  {
    "q": "What does this print?",
    "code": "struct err : public exception {\n    const char* what() const noexcept override { return \"custom\"; }\n};\ntry { throw err(); }\ncatch (exception e) { cout << e.what(); }",
    "options": ["The base class's generic message: the object was sliced by catching by value", "`custom`", "Nothing; it does not compile", "`err`"],
    "answer": 0,
    "explain": "catch (exception e) copies the thrown err into a plain std::exception, losing the override. By reference, catch (exception& e), what() would dispatch to custom."
  },
  {
    "q": "When is `std::terminate` called? (select all)",
    "options": ["When an exception is thrown and no catch statement with a matching type exists anywhere up the stack", "When a `noexcept` function lets an exception escape", "Whenever `what()` is called", "When a handler finishes normally"],
    "answer": [0, 1],
    "explain": "Both end the program: terminate calls the termination handler, which calls abort. A handled exception, or a handler that ends normally, lets execution continue after the try-catch."
  },
  {
    "q": "In `exception5.cpp`, which line is printed immediately before `C not constructed!`?",
    "options": ["`B() being created`", "`C() created`", "`B() destroyed`", "`A() destroyed`"],
    "answer": 3,
    "explain": "B(int) throws during the member initializer; the already-constructed base A is destroyed before the constructor's handler runs. C() created never prints, and B() destroyed never prints because my_b never existed and terminate skips the unwinding that would destroy main's b."
  },
  {
    "q": "A constructor's function-try-block handler prints a message and ends without an explicit `throw;`. What happens?",
    "options": ["The object is created anyway", "The exception is swallowed and the constructor returns normally", "The exception is rethrown automatically; the object is still not created", "The destructor runs on the partial object"],
    "answer": 2,
    "explain": "A constructor's function-try-block handler always rethrows, because a constructor that did not finish cannot leave an object behind. The explicit throw; in exception5.cpp only makes that visible."
  },
  {
    "q": "Which header declares `std::terminate` and `std::exception`?",
    "options": ["`<stdexcept>`", "`<cassert>`", "`<exception>`", "`<cstdlib>`"],
    "answer": 2,
    "explain": "Both live in <exception>. <stdexcept> adds the logic_error and runtime_error families; <cstdlib> has exit and EXIT_FAILURE; <cassert> has assert."
  }
]
```
