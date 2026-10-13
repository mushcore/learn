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
