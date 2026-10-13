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

## Delete a `Report` through its interface and sort three classes

A printable report that owns a logo, then three classes from a water system to place in the interface / abstract / concrete table.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Printable {\npublic:\n    virtual ~Printable() { cout << \"~Printable\" << endl; }\n    virtual void print() const = 0;\n};\n\nclass Logo {\npublic:\n    ~Logo() { cout << \"~Logo\" << endl; }\n};\n\nclass Report : public Printable {\n    Logo logo;\npublic:\n    ~Report() { cout << \"~Report\" << endl; }\n    void print() const override { cout << \"report\" << endl; }\n};\n\nint main() {\n    Printable* p = new Report;\n    p->print();\n    delete p;\n    return 0;\n}",
    "options": [
      "`report`\n`~Report`\n`~Logo`\n`~Printable`",
      "`report`\n`~Printable`",
      "`report`\n`~Printable`\n`~Logo`\n`~Report`",
      "`report`\n`~Logo`\n`~Report`\n`~Printable`"
    ],
    "answer": 0,
    "explain": "`p->print()` is virtual: `report`. `~Printable` is virtual, so `delete p` starts at the dynamic type, Report. A destructor runs its own body first (`~Report`), then destroys the members (`~Logo`), then the base (`~Printable`): the reverse of construction (base, members, body). Without `virtual` on ~Printable only `~Printable` would be reached, and the logo would never be destroyed."
  },
  {
    "type": "match",
    "q": "Match each class to its column of the table.",
    "pairs": [
      [
        "`class Sensor { public: virtual ~Sensor() {} virtual int read() const = 0; };`",
        "interface"
      ],
      [
        "`class Tank { protected: int litres = 0; public: virtual ~Tank() {} virtual void fill() = 0; int level() const { return litres; } };`",
        "abstract class"
      ],
      [
        "`class Valve : public Tank { public: void fill() override { litres = 50; } };`",
        "concrete class"
      ]
    ],
    "explain": "Sensor has only pure virtual functions and the virtual destructor, no data: an interface. Tank has a pure `fill()` but also a data member and a function with a body: abstract, partly implemented. Valve overrides the last pure function, so it can be instantiated: concrete (a compiled check gives is_abstract 1, 1, 0 and a filled Valve reports 50)."
  },
  {
    "q": "`Drawable` is meant to be an interface. Click the line that stops it being one.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Drawable {\npublic:\n    virtual ~Drawable() {}\n    virtual void draw() const = 0;\n    int drawCount = 0;\n    virtual void resize(double factor) = 0;\n};\n\nint main() {\n    return 0;\n}",
    "answer": [
      8
    ],
    "explain": "An interface has pure virtual functions, a virtual destructor and no data. `int drawCount = 0;` is a data member, which makes Drawable an abstract class instead. It still compiles; it just no longer matches the interface column of the table."
  },
  {
    "q": "In the Report program, remove `virtual` from `~Printable`. Which lines does `delete p;` still reach?",
    "options": [
      "only `~Printable` (and the behaviour is undefined)",
      "`~Report`, `~Logo`, `~Printable` as before",
      "none of them",
      "`~Report` only"
    ],
    "answer": 0,
    "explain": "A non-virtual destructor is chosen by the pointer's static type, Printable. Only `~Printable` runs; `~Report` and therefore the Logo member's destructor are skipped. Deleting a derived object through a base pointer without a virtual destructor is undefined behaviour, which is why the interface declares one."
  }
]
```

```challenge
{"prompt": "Write an interface <code>Sensor</code> with a virtual destructor that prints <code>~Sensor</code> and a pure virtual <code>int read() const</code>. Then write <code>Thermometer</code>, which implements it: <code>read()</code> returns <code>21</code> and its destructor prints <code>~Thermometer</code>. main deletes through a <code>Sensor*</code>.", "starter": "#include <iostream>\nusing namespace std;\n\n// write the interface Sensor and the class Thermometer here\n\nint main() {\n    Sensor* s = new Thermometer;\n    cout << s->read() << endl;\n    delete s;\n    return 0;\n}\n", "expected": "21\n~Thermometer\n~Sensor", "hints": ["<code>virtual ~Sensor() { cout &lt;&lt; \"~Sensor\" &lt;&lt; endl; }</code>", "<code>virtual int read() const = 0;</code>", "If <code>~Thermometer</code> is missing from the output, the Sensor destructor is not virtual."], "solution": "#include <iostream>\nusing namespace std;\n\nclass Sensor {\npublic:\n    virtual ~Sensor() { cout << \"~Sensor\" << endl; }\n    virtual int read() const = 0;\n};\n\nclass Thermometer : public Sensor {\npublic:\n    ~Thermometer() { cout << \"~Thermometer\" << endl; }\n    int read() const override { return 21; }\n};\n\nint main() {\n    Sensor* s = new Thermometer;\n    cout << s->read() << endl;\n    delete s;\n    return 0;\n}\n"}
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
