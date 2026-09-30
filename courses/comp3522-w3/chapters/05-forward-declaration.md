---
title: Forward declarations and organizing code
minutes: 12
---

A Car has Wheels and a Wheel points back at the Car that owns it. Each header needs the other, and the slides call this our first C++ OOP conundrum.

## The circular include

```cpp pin Car.hpp and Wheel.hpp, as first written
// Car.hpp
#include "Wheel.hpp"
class Car
{
    Wheel wheels[4];
};

// Wheel.hpp
#include "Car.hpp"     // UH OH! THIS IS TROUBLE!
class Wheel
{
    Car * owner;
};
```

`#include "Wheel.hpp"` pastes Wheel.hpp into Car.hpp (Week 1: the preprocessor copies the file in). Wheel.hpp begins with `#include "Car.hpp"`, which pastes Car.hpp, which pastes Wheel.hpp again, and so on until the preprocessor gives up. Include guards stop the infinite loop, but then whichever class is compiled first meets a name it has never seen, and the error message is not helpful.

## The fix is one line

```cpp run pin forwardDecl.cpp
// predict: Write the line printed.
#include <iostream>
using namespace std;

class Car; // Forward declaration (so simple!)

class Wheel
{
public:
    Car *owner; // Must be pointer or reference
};

class Car
{
public:
    int id;
    Wheel wheels[4];
    Car(int id) : id(id) { for (Wheel& w : wheels) w.owner = this; }
};

int main()
{
    Car car(7);
    cout << "wheel 2 belongs to car " << car.wheels[2].owner->id << endl;
    return 0;
}
```

`class Car; // Forward declaration (so simple!)` tells the compiler that a class named Car exists somewhere, without saying what is in it. That is enough to declare `Car *owner; // Must be pointer or reference`, because every pointer is the same size whatever it points at. It is not enough to declare a `Car` member by value: the compiler would have to know how big a Car is to lay Wheel out, and it does not. In this single-file version Car is defined further down, and the constructor's `w.owner = this` gives each wheel the address of its car.

:::danger The caution on the slide
With only a forward declaration you may declare a **reference or a pointer** to the type, nothing else. Write `Car owner;` and the compiler answers `field 'owner' has incomplete type 'Car'`. Calling a member through the pointer also needs the full definition to be visible, which is why the source file includes both headers while the header includes neither.
:::

## Headers and sources

Each unit of code is split into a header (`.hpp`) with the declarations and a source (`.cpp`) with the definitions. A declaration tells the compiler that a function or class exists somewhere and may be called in the current compilation unit; the definition is the code. The Circle project of lesson 1 is the pattern:

| File | Holds | Includes |
|---|---|---|
| `Circle.hpp` | `class Circle { ... };` with prototypes, under an include guard | headers it needs for the declarations |
| `Circle.cpp` | `Circle::Circle()`, `Circle::area()`, ... | `"Circle.hpp"` |
| `main.cpp` | `int main()` that uses Circle | `"Circle.hpp"` |

The shipped headers open with an include guard, `#ifndef CIRCLE_CIRCLE_HPP` / `#define CIRCLE_CIRCLE_HPP` / `#endif`, so a header pasted twice into one file defines the class only once. `#pragma once` from Week 1 does the same in one line. Default argument values go in the header prototypes (lesson 2); the definitions in the source repeat the signatures without them.

```quiz
[
  {
    "q": "Why does `Car.hpp` including `Wheel.hpp` while `Wheel.hpp` includes `Car.hpp` fail?",
    "options": ["Two headers cannot include each other by C++ rule", "Each include pastes the other file, which pastes the first again: an endless include chain, and with guards one class is used before it is declared", "Headers cannot contain classes", "The linker refuses circular dependencies"],
    "answer": 1,
    "explain": "The preprocessor inserts files textually; Car.hpp includes Wheel.hpp which includes Car.hpp which includes Wheel.hpp… and the error message does not help. The slide's solution is forward declaration."
  },
  {
    "q": "What does `class Car;` on its own line do?",
    "options": ["Defines an empty class Car", "Creates a Car object", "Promises the compiler that a class named Car exists, so pointers and references to it may be declared before its definition", "Includes Car.hpp"],
    "answer": 2,
    "explain": "A forward declaration introduces the name only. The full definition comes later (or in another file)."
  },
  {
    "q": "After `class Car;` and nothing else, which member declarations inside `class Wheel` compile? (select all)",
    "options": ["`Car * owner;`", "`Car & owner;`", "`Car owner;`", "`Car owners[4];`"],
    "answer": [0, 1],
    "explain": "Only a pointer or a reference: the compiler knows their size without seeing Car. A Car by value, alone or in an array, needs the complete type: 'field has incomplete type'."
  },
  {
    "q": "The compiler prints `field 'owner' has incomplete type`. What went wrong?",
    "options": ["A semicolon is missing", "A class was forward-declared and then used by value (not through a pointer or reference) before its definition", "The header has no include guard", "owner is private"],
    "answer": 1,
    "explain": "Incomplete type means declared but not defined. Change the member to a pointer or reference, or include the full definition."
  },
  {
    "q": "Which file holds the definitions (bodies) of a class's member functions in the two-file layout?",
    "options": ["The header (.hpp)", "The source (.cpp)", "main.cpp", "Both"],
    "answer": 1,
    "explain": "Header: declarations of functions and classes, which tell the compiler the code exists and can be called. Source: the definitions (implementations)."
  },
  {
    "q": "`#ifndef CIRCLE_CIRCLE_HPP` / `#define CIRCLE_CIRCLE_HPP` / `#endif` around a header...",
    "options": ["makes the header compile faster", "prevents the class from being defined twice when the header is included more than once in one file", "declares the class Circle", "is required by CLion"],
    "answer": 1,
    "explain": "An include guard. The first inclusion defines the macro; later inclusions skip the body. #pragma once is the one-line equivalent."
  }
]
```
