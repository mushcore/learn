---
title: Pure virtual functions and abstract classes
minutes: 20
---

Week 3's `virtual int area() { return 0; }` was flagged as a bad example: a base class that invents a fake area so the function has a body. The honest version says "every shape has an area, but I cannot compute it": a **pure virtual function**, and a class that has one is **abstract**.

## The pure specifier

```cpp run pin abstract.cpp
// predict: Write the line printed. Then uncomment `creature some_beast;` and read the error.
#include <iostream>
#include <string>

class creature //abstract class
{
public:
    virtual void all_info() const = 0;   // PURE SPECIFIER
};

class person : public creature
{
public:
    person() = default;
    person(const std::string& name) : name(name) {}
    void all_info() const override { std::cout << "My name is " << name << std::endl; }
protected:
    std::string name;
};

int main()
{
    //creature some_beast;   // Error: abstract class

    creature* hulk = new person("Dr Bruce Banner");
    hulk->all_info();
    delete static_cast<person*>(hulk);   // see the next lesson for why the cast is needed here
    return 0;
}
```

`virtual void all_info() const = 0;   // PURE SPECIFIER` declares the function and the `= 0` says there is no body: derived classes must supply one. That single line makes `creature` abstract, and `//creature some_beast;   // Error: abstract class` is the consequence: an abstract class cannot be instantiated, just like Java. It is used to define an implementation or a base class intended to be extended. `person` overrides the pure function, so it is concrete, and `creature* hulk = new person("Dr Bruce Banner");` is the normal use: a pointer to the abstract base, an object of the concrete class.

Java spells the same idea `public abstract class AbstractClass {}` with `extends`; C++ has no `abstract` keyword, only the pure specifier.

## Rules for abstract classes

- A pure virtual function **must be overridden** by a concrete derived class.
- A declaration cannot have both a pure specifier and a definition: `virtual void g() { } = 0; // ERROR!`
- An abstract class cannot be used as a function **return type** or **parameter type**: `A functionA(); // WRONG`, `void functionB(A aParam); // WRONG`, because both would need to create an A.
- **Pointers and references** to an abstract class are fine: `A* pa; // OK`, `A& functionA(A& aParam); // OK`.
- Virtual members are inherited: a class derived from an abstract class is **still abstract** unless it overrides every pure virtual function. An abstract class may be derived from a non-abstract class.
- Calling a pure virtual function, directly or indirectly, from an abstract class's constructor is **undefined** (the derived part does not exist yet).

```widget
abstract-check
```

Toggle B's override of `f()` off and watch B and C both turn abstract; make `A::f()` plain (not virtual) and the `override` keyword becomes an error, because there is nothing virtual to override.

## An abstract class may carry data and ordinary functions

```cpp run pin abstractData.cpp
// predict: Write the two lines printed.
#include <iostream>
#include <string>
using namespace std;

class AbstractClass
{
public:
    virtual void AbstractMemberFunction() = 0;
    virtual void NonAbstractMemberFunction1() { cout << "virtual, with a body" << endl; }
    void NonAbstractMemberFunction2() { cout << "not virtual, x = " << x << endl; }
    int x = 7;
};

class ConcreteClass : public AbstractClass
{
public:
    void AbstractMemberFunction() override { }
    void NonAbstractMemberFunction1() override { cout << "overridden" << endl; }
};

int main()
{
    ConcreteClass c;
    AbstractClass& ref = c;
    ref.NonAbstractMemberFunction1();
    ref.NonAbstractMemberFunction2();
    return 0;
}
```

Only `virtual void AbstractMemberFunction() = 0;` is pure; the class also has a virtual function with a body, a non-virtual function and a data member `int x = 7;`. `ConcreteClass` overrides the pure one (required) and the virtual one (optional), so `ref.NonAbstractMemberFunction1();` prints `overridden` through the reference while the non-virtual call prints the base's line. That mix, at least one pure virtual function plus whatever else, is what separates an abstract class from an interface, next lesson.

```quiz
[
  {
    "q": "How is a C++ class made abstract?",
    "options": ["With the keyword `abstract` before `class`", "By giving it at least one pure virtual function: `virtual void f() = 0;`", "By making all members private", "By deleting its constructor"],
    "answer": 1,
    "explain": "C++ has no abstract keyword. A class with one or more pure virtual functions cannot be instantiated; = 0 is the pure specifier."
  },
  {
    "q": "`class A { virtual void g() { } = 0; };` ...",
    "options": ["is the recommended way to give a default body", "is an error: a declaration cannot have both a pure specifier and a definition", "makes g private", "compiles with a warning"],
    "answer": 1,
    "explain": "The slide marks it ERROR! Pure virtual means no body here; the body belongs to the derived classes."
  },
  {
    "q": "Which uses of an abstract class `A` compile? (select all)",
    "options": ["`A* pa;`", "`A& f(A& a);`", "`A g();`", "`void h(A a);`", "`A a;`"],
    "answer": [0, 1],
    "explain": "Pointers and references to an abstract class are fine; anything that would create an A by value (a variable, a return value, a by-value parameter) is rejected."
  },
  {
    "q": "B derives from abstract class A but overrides only one of A's two pure virtual functions. B is...",
    "options": ["concrete", "still abstract", "a compile error", "an interface"],
    "answer": 1,
    "explain": "Virtual members are inherited: a derived class stays abstract unless it overrides EACH pure virtual function, just like Java."
  },
  {
    "q": "What does this print?",
    "code": "class creature { public: virtual void all_info() const = 0; };\nclass person : public creature {\n    string name;\npublic:\n    person(const string& n) : name(n) {}\n    void all_info() const override { cout << \"My name is \" << name; }\n};\nint main() {\n    creature* hulk = new person(\"Dr Bruce Banner\");\n    hulk->all_info();\n}",
    "options": ["My name is Dr Bruce Banner", "a compile error: creature is abstract", "nothing", "My name is"],
    "answer": 0,
    "explain": "The pointer is to the abstract base, the object is a concrete person; the virtual call dispatches to person::all_info. Only creature some_beast; would be an error."
  },
  {
    "q": "Calling a pure virtual function from the constructor of the abstract class is...",
    "options": ["how you initialize derived classes", "undefined behaviour", "always a compile error", "fine as long as it is virtual"],
    "answer": 1,
    "explain": "The slide's CAUTION: during the base constructor the derived part does not exist yet, so there is no override to call."
  },
  {
    "q": "An abstract class may contain data members and non-virtual member functions.",
    "type": "tf",
    "answer": true,
    "explain": "The slide's AbstractClass has a pure virtual function, a virtual function with a body, a plain function and int x. Only an interface is restricted to pure virtual functions."
  },
  {
    "q": "`void f() override` in a derived class, where the base's `f()` is not virtual, gives...",
    "options": ["a new virtual function", "an error: 'f' marked 'override' but does not override", "a warning", "a pure virtual function"],
    "answer": 1,
    "explain": "override demands a virtual function with the same signature in a base class. It is the compiler check that protects you from typos, and it fails when there is nothing virtual to override."
  }
]
```
