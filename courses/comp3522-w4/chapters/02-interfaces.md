---
title: Interfaces and the virtual destructor
minutes: 18
---

Java has a separate keyword, `interface`, for a type with behaviour and no implementation. C++ builds the same thing from the pure specifier: an interface is a class whose every function is pure virtual, plus one thing Java never asks for, a virtual destructor.

## The C++ interface

```cpp
class Animal
{
public:
    virtual ~Animal( ) {} //regular virtual destructor
    virtual void move_x(int x) = 0;
    virtual void move_y(int y) = 0;
    virtual void eat( ) = 0;
};
```

An interface describes the behaviour of a class without committing to an implementation: no implementation at all, only a polymorphic interface. It has pure virtual functions and no other kinds of functions, except the regular virtual destructor, and no data. Java's `class Dog implements Animal` becomes `class Dog : public Animal` with every function overridden.

## Not implemented, partly implemented, fully implemented

| | Interface | Abstract class | Concrete class |
|---|---|---|---|
| functions | only pure virtual | at least 1 pure virtual; may also have virtual and non-virtual functions | no pure virtual functions |
| destructor | virtual | virtual | virtual if it is a base class that has children |
| data members | none | yes | yes |
| instantiate? | cannot | cannot | can |

An abstract class defines an implementation and is intended to be extended by concrete classes; it enforces a contract between the class designer and the users of the class. An interface is a pure abstract class: purely virtual functions, no data.

## Why the destructor must be virtual

The Week 3 rule "if a class contains a virtual function, the destructor should be virtual too" gets its reason here. Interfaces are used through base pointers, and objects reached through base pointers are deleted through base pointers.

```cpp run pin virtualDtor.cpp
// predict: Which destructors print? Write the lines in order.
#include <iostream>
using namespace std;

class Animal
{
public:
    ~Animal() { cout << "~Animal" << endl; }     // NOT virtual: the bug
    virtual void eat() = 0;
};

class Dog : public Animal
{
    int* bowl;
public:
    Dog() : bowl(new int[10]) {}
    ~Dog() { cout << "~Dog frees the bowl" << endl; delete[] bowl; }
    void eat() override { cout << "crunch" << endl; }
};

int main()
{
    Animal* a = new Dog;
    a->eat();
    delete a;      // which destructor runs?
    return 0;
}
```

```cpp diff virtualDtor.cpp with a virtual destructor
#include <iostream>
using namespace std;

class Animal
{
public:
    virtual ~Animal() { cout << "~Animal" << endl; }   // regular virtual destructor
    virtual void eat() = 0;
};

class Dog : public Animal
{
    int* bowl;
public:
    Dog() : bowl(new int[10]) {}
    ~Dog() { cout << "~Dog frees the bowl" << endl; delete[] bowl; }
    void eat() override { cout << "crunch" << endl; }
};

int main()
{
    Animal* a = new Dog;
    a->eat();
    delete a;      // which destructor runs?
    return 0;
}
```

:::before Before: non-virtual destructor
`delete a;      // which destructor runs?` looks only at the pointer's static type, `Animal`, so `~Animal` runs and `~Dog` never does: the bowl leaks, and deleting a derived object through a base pointer without a virtual destructor is undefined behaviour (g++ warns about it). `crunch` still prints because `eat` is virtual.
:::

:::after After: virtual destructor
`virtual ~Animal() { cout << "~Animal" << endl; }` makes the destructor call dynamic: `delete a` now runs `~Dog frees the bowl` first and `~Animal` after it, the same reverse order as any derived object. That is the slide's reason for the virtual destructor in an interface: to ensure that when an instance of an implementing class is deleted polymorphically, the correct destructor of the derived class is called.
:::

The destructor of a derived class always calls the base destructor afterwards; `virtual` only decides whether the derived one is reached in the first place.

```widget
dispatch-viz
{ "title": "The same question for print(): with the pointer's static type Base, only virtual reaches the derived version" }
```

```quiz
[
  {
    "q": "A C++ interface contains...",
    "options": ["pure virtual functions only, plus a regular virtual destructor, and no data", "at least one pure virtual function and any data it likes", "only non-virtual functions", "a constructor and a destructor only"],
    "answer": 0,
    "explain": "The slide's definition: describe behaviour without committing to an implementation; pure virtual functions, no other kinds, plus the virtual destructor; no data members."
  },
  {
    "q": "Which of these distinguish an abstract class from an interface? (select all)",
    "options": ["an abstract class may have data members", "an abstract class may have virtual and non-virtual functions with bodies", "an abstract class can be instantiated", "an interface needs no destructor"],
    "answer": [0, 1],
    "explain": "Both cannot be instantiated and both have a virtual destructor. The abstract class is partly implemented (at least one pure virtual, plus data and bodies); the interface is not implemented at all."
  },
  {
    "q": "Why does an interface declare `virtual ~Animal() {}`?",
    "options": ["Because every class must declare a destructor", "So that deleting an implementing object through an `Animal*` runs the derived class's destructor", "To make the interface abstract", "To prevent copying"],
    "answer": 1,
    "explain": "Objects used through base pointers are deleted through base pointers; without a virtual destructor only the base destructor runs (undefined behaviour, leaked members)."
  },
  {
    "q": "What does this print?",
    "code": "class Base { public: ~Base() { cout << \"B\"; } virtual void f() = 0; };\nclass Derived : public Base { public: ~Derived() { cout << \"D\"; } void f() override {} };\nint main() { Base* p = new Derived; delete p; }",
    "options": ["DB", "B", "D", "BD"],
    "answer": 1,
    "explain": "The destructor is not virtual, so delete p uses the static type Base: only ~Base runs. With virtual ~Base() the output would be DB (derived first, then base)."
  },
  {
    "q": "A concrete class needs a virtual destructor...",
    "options": ["always", "never", "if it is a base class that has children (may be deleted through a base pointer)", "only if it has data members"],
    "answer": 2,
    "explain": "The table's third column: virtual destructor if base class that has children. A leaf class that nobody derives from does not need one."
  },
  {
    "q": "In Java, `class Dog implements Animal`. In C++ the same relationship is written...",
    "options": ["`class Dog implements Animal`", "`class Dog : public Animal` with every pure virtual function overridden", "`interface Dog : Animal`", "`class Dog : Animal = 0`"],
    "answer": 1,
    "explain": "C++ has one inheritance syntax for both extending and implementing; UML draws it as realization (dashed line) when the base is an interface."
  },
  {
    "q": "A pure abstract class is another name for an interface.",
    "type": "tf",
    "answer": true,
    "explain": "The slide: an interface is a 'pure abstract class' in C++, purely virtual functions and no data."
  }
]
```
