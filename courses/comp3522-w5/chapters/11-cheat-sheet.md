---
title: One-page cheat sheet (Week 5)
minutes: 10
---

Everything Quiz 5 can ask, in tables. Read this last, on the way to the lab.

## Assertions versus exceptions

| | `assert` | exception |
|---|---|---|
| for | detecting **programming errors** | situations that prevent proper continuation (errors that cannot be handled locally) |
| header | `<cassert>` (a macro inherited from C) | `<exception>` for `std::exception` and `terminate`; `<stdexcept>` for the useful ones |
| when false / thrown | **immediately terminates** the program | control jumps to the first matching `catch` up the stack |
| turn off | `#define NDEBUG` **before** `#include <cassert>` | cannot be turned off |
| example | `assert(result >= 0.0);` postcondition | `if (!f.is_open()) throw cannot_open_file();` |

C error codes (`return 1` for error, `return 0` for success, like `main` still does): the caller can ignore them; the function cannot return its result; results go back through reference or pointer arguments; no expressions from results.

## throw and catch

```cpp
throw "text";                 // const char*, NOT std::string
throw 42;                     // any type can be thrown
throw cannot_open_file();     // a user type: struct cannot_open_file { };
throw std::invalid_argument("Denominator cannot be zero");   // standard, <stdexcept>

try { /* code that throws */ }
catch (e1_type1& e1) { /* handle */ }
```

Best practice: define exception types or use the standard ones. A constructor that throws creates **no object** (nothing to destroy); already-built bases and members are destroyed. Java's checked exceptions do not exist in C++.

## The six catch guidelines

| # | Guideline (slide wording) | Code | What goes wrong otherwise |
|---|---|---|---|
| 1 | **Catch exceptions by reference** | `catch (parent_type& e)` | by value slices: `what()` becomes the parent's |
| 2 | **The first catch-block with a matching type is executed** | one handler runs per throw | |
| 3 | **Further catch-blocks of the same type or child-types are ignored**; child type first | `catch (child_type&)` then `catch (parent_type&)` | parent first swallows the child; g++ warns, does not error |
| 4 | **A catch-block with an ellipsis catches all exceptions**; last | `catch (...) { }` | catches ints and strings too |
| 5 | consider capturing, an informative message, and terminating | `cerr << "FILE NOT FOUND. TERMINATING...\n"; exit(EXIT_FAILURE);` (`<cstdlib>`) | |
| 6 | or continue after a message or rescue by **rethrowing** | bare `throw;` | `throw e;` throws a sliced copy |

Stack unwinding (ex_unwind): destructors of locals run as **each frame is left**, before the next handler runs. `g3 destroyed` precedes `level2 caught`; a frame with no handler is passed straight through; `main continues` after the handler.

## noexcept

- C++03 throw specifications (which types may be thrown): deprecated, don't.
- `double square_root(double x) noexcept { ... }`: callers never check for exceptions; if one is thrown anyway **the program ends** (terminate, handler in main never runs).
- **Destructors are implicitly noexcept.** Never throw from one; it is treated as a run-time error and execution ends.

## std::exception and its family

```cpp
struct myexception : public exception {
    const char* what() const noexcept override { return "My exception happened"; }
};
catch (exception& e) { cout << e.what(); }   // virtual what(), returns const char*
```

| Header | Type | Thrown by / meaning |
|---|---|---|
| `<exception>` | `std::exception` | base class designed to be derived; virtual `what()` |
| `<new>` | `bad_alloc` | `new` on allocation failure |
| `<typeinfo>` | `bad_cast`, `bad_typeid` | `dynamic_cast` when it fails; `typeid` |
| `<functional>` | `bad_function_call` | a bad call |
| `<memory>` | `bad_weak_ptr` | `shared_ptr` when passed a bad `weak_ptr` |
| `<stdexcept>` | `logic_error` → `invalid_argument`, `length_error`, `out_of_range` | errors detectable before running (bad argument, bad size, bad index) |
| `<stdexcept>` | `runtime_error` → `range_error`, `overflow_error` | errors known only while running |

Uncaught exception: **`terminate`** → termination handler → **`abort`** (CRASH AND BURN). No unwinding: locals in main are not destroyed, nothing after the throw prints.

## The five programs

| Program | Key line | Prints |
|---|---|---|
| exception.cpp | `throw myexception();` caught as `exception&` | `My exception happened` |
| exception2.cpp | `throw "message error";` handlers myexception&, exception&, A&, const char* | `message error` (`A{}` → `random class error`; `myexception()` → `myexception caught` / `C++ Exception`) |
| exception3.cpp | `std::string("abc").substr(10)` (slide: length_error; g++ throws out_of_range) caught as `const exception&` | `basic_string::substr: __pos (which is 10) > this->size() (which is 3)` |
| exception4.cpp | `Name{a}` with empty `a` throws `invalid_argument("No first name!")` | `No first name!` |
| exception5.cpp | `C(int x) try : A(), my_b(x) {...} catch (...) { ...; throw; }`, `B(int)` throws | `Making a B`, `B() created`, `Making a C`, `A() created`, `B() being created`, `A() destroyed`, `C not constructed!`, then terminate: no `B() destroyed`, no `Code not called...` |

## Coupling and cohesion

| | Coupling | Cohesion |
|---|---|---|
| boxed definition | **the strength of the connection between modules** | **the glue that holds a module together** |
| refers to | links between separate units | the number and diversity of tasks a single unit is responsible for |
| aim | **loose** (not tight) | **high** (not low) |
| why | understand one class without reading others; change one with little effect on others; maintainability | understand what a unit does; accurate names; reuse |
| bad case | cascade of changes, hard to understand in isolation, complex control flow, hard to test | functions doing multiple tasks, classes with no clear identity |

Dependency: if A uses B, A depends on B. Tight coupling is a form of strong dependency. **Inheritance and interfaces/abstract classes are the most common and effective way of decoupling code** (Sushi → abstract Filling; UI → DataSource interface with TextFile, SQLite DB, JSON File). We still have a dependency; aim for weak ones. Design principles are high-level guidelines (design patterns come later).

## SOLID (Robert C. Martin, Uncle Bob)

| | Boxed statement | Slide example | Fix |
|---|---|---|---|
| **S**ingle Responsibility | each class is responsible for only one thing; one reason to change | `User` is a user, creates `MyDatabase`, posts to forum | `User` + `PostWriter(MyDatabase*)` |
| **O**pen/Closed | open for extension, closed for modification | `UIWidget::draw()` if-chain on `string type` | `virtual void draw() = 0;` overridden in `UIButton`, `UITextBox`, `UIScrollBar` |
| **L**iskov Substitution | if S is a subtype of T, objects of T may be replaced with objects of S | `Canvas` with `UIPanel*`, `UIScrollbar*`, `UIButton*` | `vector<UIWidget*>`, `for (UIWidget* widget : ui_widgets) widget->draw();` |
| **I**nterface Segregation | no client should be forced to depend on functions it does not use; many client-specific interfaces beat one general-purpose one; SRP for interfaces | `Animal` with pure `walk`, `swim`, `fly`: Human must fly | `Animal` (breathe, eat) + `Walkable`, `Swimmable`, `Flyable`; `Human : public Animal, public Walkable, public Swimmable` |
| **D**ependency Inversion | high-level and low-level modules should depend on abstractions; abstractions should not depend on details, details on abstractions; combined effect of OCP + LSP | `UI → TextFile` | `UI → DataSource ← TextFile / SQLiteDB / JSONFile`; interfaces cannot be instantiated, concrete classes can |

Character creation (slides 90–91): `Game → CharacterCreationUI → SaveFileWriter` becomes `Game → CharacterCreationUI`, `Game → CharacterCreator → SaveWriter ← SaveFileWriter, CloudSaveWriter` (SRP, SRP, DIP).

## Law of Demeter

Boxed: **each unit should have only limited knowledge about other units: only units "closely" related to the current unit. Each unit should only talk to its friends; don't talk to strangers.**

| Before (#BAD) | After (#OK) |
|---|---|
| Cashier: `money = customer.getWallet().getMoney(amount)` | Cashier: `money = customer.getMoney(amount)`; Customer: `return wallet.getMoney(amount)` |
| classes know public members several classes away | classes know public members of **neighbouring** classes |
| `obj.getX().getY().getZ().doSomething();` train wreck | restructure so each class is responsible for its own data |
| Game: `characterUI.getCharacterCreator().save(characterUI.getCharacterCreator().createCharacter())` | swap Game and CharacterCreationUI: `data = characterUI.getData(); characterCreator.initiateCharacterCreation(data);` |

Count the classes reached through return values, not the dots on one neighbour. Often forgotten: "Suggestion of Demeter".

:::quiz Fifteen true or false (answers at the bottom)
1. `assert` is a function.
2. `#define NDEBUG` after `#include <cassert>` disables assertions.
3. `throw "x";` throws a `std::string`.
4. `catch (parent_type& e)` also catches a thrown `child_type`.
5. Catching by value can slice the exception.
6. A `catch (...)` may be followed by `catch (int)`.
7. Bare `throw;` rethrows the same object.
8. A `noexcept` function that throws is caught by the caller's `catch (...)`.
9. Destructors are implicitly `noexcept`.
10. `what()` returns `std::string`.
11. `out_of_range` derives from `runtime_error`.
12. An uncaught exception calls `terminate`, then `abort`.
13. We aim for loose coupling and high cohesion.
14. OCP is implemented by adding `else if` branches.
15. Demeter forbids calling two methods on the same neighbour.

Answers, in order: F F F T T · F T F T F · F T T F F
:::

```quiz
[
  {
    "q": "Rapid fire: which handler order is correct for `invalid_argument`, `exception`, `...`?",
    "options": ["`...`, `exception&`, `invalid_argument&`", "`exception&`, `invalid_argument&`, `...`", "`invalid_argument&`, `exception&`, `...`", "any order; the best match is chosen"],
    "answer": 2,
    "explain": "First match wins, so child before parent and the ellipsis last."
  },
  {
    "q": "`throw e;` versus `throw;` inside a handler: which keeps the derived type?",
    "options": ["`throw;`", "`throw e;`", "both", "neither"],
    "answer": 0,
    "explain": "The bare throw rethrows the original object; throw e; copies into the handler's static type."
  },
  {
    "q": "Which never prints in exception5.cpp?",
    "options": ["A() destroyed", "C not constructed!", "B() being created", "B() destroyed"],
    "answer": 3,
    "explain": "my_b was never built and main's b is never unwound because terminate ends the program."
  },
  {
    "q": "Slide 89: which can be instantiated?",
    "options": ["interfaces", "concrete classes such as UI and TextFile", "abstract classes", "all of them"],
    "answer": 1,
    "explain": "Interfaces and abstract classes declare; concrete classes implement the details and can be instantiated."
  },
  {
    "q": "`customer.getWallet().getMoney(amount)` breaks...",
    "options": ["Open/Closed", "Liskov Substitution", "the Law of Demeter", "Interface Segregation"],
    "answer": 2,
    "explain": "Cashier reaches through Customer into Wallet, a stranger. Ask the neighbour instead: customer.getMoney(amount)."
  }
]
```
