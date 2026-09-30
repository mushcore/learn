---
title: One-page cheat sheet (Week 3)
minutes: 10
---

Everything Quiz 3 can ask, in tables. Read this last, on the way to the lab.

## Classes

| Fact | Detail |
|---|---|
| `struct` vs `class` | identical, except struct members are **public** by default and class members **private** |
| a class may contain | data members, member functions, type definitions, contained classes |
| ends with | `};` (objects may be declared between `}` and `;`) |
| access | public: anywhere · protected: the class and derived classes · private: the class only |
| two-file layout | `X.hpp` declarations (with an include guard), `X.cpp` definitions written `double Circle::area() { ... }` |
| four OOP words | encapsulation (private data, public get/set) · abstraction (show only relevant details; access specifiers, headers) · inheritance · polymorphism |

## Constructors

```cpp
class Circle {
    double radius;
public:
    Circle();                 // no return type, not even void
    Circle(int r);
};
Circle::Circle() { radius = 10; }
Circle::Circle(int r) : radius(r) { }     // member initialization list
```

| Declaration | Calls |
|---|---|
| `Circle c;` | default constructor |
| `Circle c();` | **nothing**: a function prototype (most vexing parse) |
| `Circle c{};` | default constructor |
| `Circle c(2);` / `Circle c{2};` | `Circle(int)` |
| `Circle d(c);` / `Circle d = c;` | **copy constructor** |
| `d = c;` | copy **assignment operator** (no constructor) |

- Declaring any constructor removes the compiler's default one; overload `Circle()` or give every parameter a default value (`Complex(double r = 0, double i = 0)` is a default constructor).
- Members are initialized **in declaration order**, whatever the list says (`-Wreorder`). Class-type members not in the list are default-constructed before the body; fundamental members stay uninitialized. Always use the list.
- Same names allowed: `Complex(double r, double i) : r(r), i(i) { }` (outside parentheses = member).
- Default arguments: trailing parameters only; written in the header prototype, not the source; `char *= nullptr` is an error (space needed).
- `double get() const { ... }`: promises not to modify the object; use on every getter. Default member values: `double r = 0.0, i = 0.0;`.

## Copy constructor and destructor

| | Signature | Called when |
|---|---|---|
| copy constructor | `Complex(const Complex& c) : r(c.r), i(c.i) { }` | a new object is created from an existing one |
| destructor | `~Complex() { ... }` (no parameters, no return type, one per class) | end of scope, `delete` / `delete[]`, program end (statics) |

- `const`: copies mutable and immutable objects. `&`: prevents the infinite copy loop.
- Compiler-generated copy constructor copies every member in declaration order: a pointer member is copied, its array is not (**shallow copy**, shared data, double free with a destructor). Deep copy: `MyVector(const MyVector& v) : size(v.size), data(new double[size]) { for (...) data[i] = v.data[i]; }`.
- `~MyVector() { delete[] data; }`. Objects in a scope are destroyed in **reverse** order of construction. By-value parameters are copy constructed on the call and destroyed on return.
- Rules for later: never throw from a destructor; a class with a virtual function needs a virtual destructor.

## Forward declaration

`class Car;` introduces the name; then only `Car*` and `Car&` may be declared (`Car owner;` gives *incomplete type*). Breaks the Car.hpp ↔ Wheel.hpp include cycle.

## Inheritance

```cpp
class Bus : public Vehicle { ... };        // Java: extends
class Derived_Two : public Base {
public:
    Derived_Two(int a) : Base(a) { }       // choose the base constructor; otherwise Base() runs
};
```

| base member | `: public` | `: protected` | `: private` (the default for `class`) |
|---|---|---|---|
| public | public | protected | private |
| protected | protected | protected | private |
| private | never accessible from a derived class | | |

- Not inherited: constructors, destructor (called automatically by the derived ones), friends, private members.
- Construction order: base, then the derived class's members, then the derived body. Destruction reverses it.
- A derived initializer list may name only its own members and direct bases: `B(int x) : x{x}` fails when x belongs to A; write `: A{x}`.

## Polymorphism

- A pointer (or reference) to a derived class is type-compatible with a pointer (reference) to its base: `Shape* s = &rect;`.
- Through a base pointer only the base's members are visible; `virtual` in the base lets a call run the derived override: **dynamic binding = late binding = polymorphic dispatch**. A class with a virtual function is a **polymorphic class**.
- Only through pointers and references. `Polygon p2 = rect;` **slices**: p2 is a Polygon and prints the base version.
- `var.Base::print()` calls the base version explicitly (qualified name lookup). `override` makes the compiler check that a base virtual with that signature exists.

| virtual2.cpp | prints |
|---|---|
| `Base& dr = d; dr.print();` | derived |
| `Base* dp = &d; dp->print();` | derived |
| `dr.Base::print();` | base |
| `Base baseDerived = d; baseDerived.print();` | base |

## Testing and debugging

- Testing reveals the **existence** of a problem; debugging pinpoints the **source**. Verification: built the app correctly? Validation: built the correct app?
- Static testing reviews code and documents; dynamic testing runs with inputs. Black box from the spec; white box from the code.
- Boundaries: zero, one, full; max/min; just inside/outside; typical; error values. Disjoint equivalence partitions: 100–999 → tests 50, 100, 500, 999, 1500.
- Assertions (`<cassert>`, off with `#define NDEBUG`) check preconditions, postconditions, invariants. Unit tests: Assemble, Act, Assert. Regression: add a test for every fixed bug and rerun everything. TDD: tests first. Simplify: smallest input that provokes the bug, binary search.

## Lab 3 and Catch

`MyStack`: `int` array of size 10 (`constexpr`), top index starts at −1, positive ints only, `push` returns false when full, `pop` decrements only, `top()` const returns −1 when empty, `empty()`, `full()`, `print()` returns a string. `unit_tests.cpp` starts with `#define CATCH_CONFIG_MAIN` then `#include "catch.hpp"`; comment out your own main; one `TEST_CASE("description", "tag") { ... REQUIRE(expr); }` per case.

## UML

| Relationship | Arrow | C++ |
|---|---|---|
| association | solid line | member `B*` / `B&` / `B` |
| generalization | solid line, hollow triangle | `class A : public B` |
| realization | dashed line, hollow triangle | implements an interface |
| dependency | dashed arrow | uses B as a parameter or local |
| composition | filled diamond at the whole | parts die with the whole |
| aggregation | hollow diamond at the whole | parts live on |

Collaboration diagram: objects `name : Class` underlined, links, numbered messages (1.1, 1.2), structural view. Sequence diagram: lifelines, activations, call / return / self / create messages, time-based view.

:::quiz Fifteen true or false (answers at the bottom)
1. `struct` members are private by default.
2. A constructor may be declared `void Circle();`.
3. `Circle c();` creates a Circle with the default constructor.
4. Members are initialized in the order of the initialization list.
5. Default arguments are allowed only for trailing parameters.
6. `Complex(const Complex& c)` is the copy constructor's canonical form.
7. `anotherCopyC = c;` calls the copy constructor.
8. The compiler-generated copy constructor deep-copies pointer members.
9. A destructor has no parameters and no return type.
10. Local objects are destroyed in reverse order of construction.
11. With `class Car;` only, `Car owner;` compiles as a member.
12. `class X : Spy` is public inheritance.
13. Constructors are inherited by a derived class.
14. `Polygon p2 = rect; p2.area();` uses the derived override.
15. `dr.Base::print()` bypasses dynamic binding.

Answers, in order: F F F F T · T F F T T · F F F F T
:::

```quiz
[
  {
    "q": "Rapid fire: `Circle c{};` calls...",
    "options": ["the default constructor", "nothing (a prototype)", "Circle(int) with 0", "the copy constructor"],
    "answer": 0,
    "explain": "Braces cannot be read as a function declaration, so this is the safe default-constructor spelling."
  },
  {
    "q": "Which member runs first when `Derived_Two second_child(0);` executes?",
    "options": ["the Derived_Two body", "the Base constructor chosen in the initializer list", "the destructor", "main"],
    "answer": 1,
    "explain": "Base first, then the derived class's members, then the derived body."
  },
  {
    "q": "A class owns a `double* data` allocated with `new[]`. Which three members must it write itself?",
    "options": ["constructor, getter, setter", "copy constructor, destructor (and, in Week 4, the assignment operator)", "only the destructor", "none; the compiler handles pointers"],
    "answer": 1,
    "explain": "The compiler's versions copy the pointer (shallow) and free nothing; a class with an owned pointer needs its own copy constructor and destructor, and next week its own operator=."
  },
  {
    "q": "`Polygon* poly = &trgl; poly->area();` prints the triangle's area only if...",
    "options": ["Triangle is declared before Polygon", "`area` is declared `virtual` in Polygon", "poly is a reference", "area is private"],
    "answer": 1,
    "explain": "Without virtual the call binds to Polygon::area at compile time and prints 0."
  },
  {
    "q": "Filled diamond at the whole means...",
    "options": ["aggregation: parts survive", "composition: parts cannot exist without the whole", "generalization", "dependency"],
    "answer": 1,
    "explain": "Composition: destroy the order and its order_items go with it. Hollow diamond is aggregation (ducks outlive the pond)."
  }
]
```
