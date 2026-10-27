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

Without B's override of `f()`, B and C are both abstract. With `A::f()` plain (not virtual), the `override` keyword becomes an error, because there is nothing virtual to override.

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

## Classify four new hierarchies and finish an abstract `Instrument`

New classes this time: shapes, a bank account, an A-to-F chain and a polygon, each one abstract or concrete for a reason you can point to.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual ~Shape() = default;\n    virtual int area() const = 0;\n    void describe() const { cout << \"area \" << area() << endl; }\n};\n\nclass Square : public Shape {\n    int side;\npublic:\n    Square(int s) : side(s) {}\n    int area() const override { return side * side; }\n};\n\nclass Strip : public Shape {\n    int w, h;\npublic:\n    Strip(int w, int h) : w(w), h(h) {}\n    int area() const override { return w * h; }\n};\n\nint main() {\n    Shape* shapes[] = { new Square(4), new Strip(3, 5) };\n    for (Shape* s : shapes) {\n        s->describe();\n        delete s;\n    }\n    return 0;\n}",
    "options": [
      "`area 16`\n`area 15`",
      "`area 0`\n`area 0`",
      "a compile error: `describe()` calls a pure virtual function",
      "`area 16`\n`area 16`"
    ],
    "answer": 0,
    "explain": "Shape is abstract (area is pure), but `describe()` is an ordinary member with a body, and the call `area()` inside it is virtual. Each object in the array is concrete: the Square computes 4 * 4 = 16 and the Strip computes 3 * 5 = 15, so describe prints `area 16` then `area 15`. Calling a pure virtual function is only a problem from the abstract class's constructor or destructor; from an ordinary member called on a finished object it dispatches to the override."
  },
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Account {\npublic:\n    virtual ~Account() = default;\n    virtual double rate() const = 0;\n    virtual double fee() const = 0;\n};\n\nclass Savings : public Account {\npublic:\n    double rate() const override { return 0.02; }\n};\n\nint main() {\n    Savings s;\n    cout << s.rate() << endl;\n    return 0;\n}",
    "answer": [
      17
    ],
    "explain": "Account has two pure virtual functions, `rate()` and `fee()`. Savings overrides only `rate()`, so it inherits `fee() = 0` and is still abstract. The class itself compiles; the error is at `Savings s;`: cannot declare variable 's' to be of abstract type 'Savings'. Override `fee()` too and the line compiles."
  },
  {
    "q": "A has two pure virtual functions, `f` and `g`. How many of B, C, D, E and F can be instantiated?",
    "type": "numeric",
    "code": "struct A { virtual ~A() = default; virtual void f() = 0; virtual void g() = 0; };\nstruct B : A { void f() override {} };\nstruct C : B { void g() override {} };\nstruct D : A { void f() override {} void g() override {} };\nstruct E : C { };\nstruct F : B { void f() override {} };\n\nint main() { return 0; }",
    "answer": 3,
    "tolerance": 0,
    "explain": "Track which pure functions are still unimplemented. B overrides f only: g is pure, abstract. C derives from B and adds g: both done, concrete. D overrides both: concrete. E adds nothing to C, which is concrete, so E is concrete. F derives from B and overrides f again, but g is still pure: abstract. Concrete: C, D, E = 3 (checked with `std::is_abstract_v`)."
  },
  {
    "q": "Make `perimeter` pure virtual so that `Polygon` is abstract.",
    "type": "fill",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Polygon {\npublic:\n    virtual ~Polygon() = default;\n    virtual double perimeter() const ___;\n};\n\nclass Triangle : public Polygon {\n    double a, b, c;\npublic:\n    Triangle(double a, double b, double c) : a(a), b(b), c(c) {}\n    double perimeter() const override { return a + b + c; }\n};\n\nint main() {\n    Triangle t(3, 4, 5);\n    const Polygon& p = t;\n    cout << p.perimeter() << endl;\n    return 0;\n}",
    "answer": [
      "= 0",
      "=0"
    ],
    "explain": "The pure specifier `= 0` goes after `const` and before the semicolon: `virtual double perimeter() const = 0;`. Triangle overrides it, so `p.perimeter()` through the Polygon reference returns 3 + 4 + 5 = 12."
  }
]
```

```challenge
{"prompt": "<code>Instrument</code> is abstract: <code>sound()</code> is pure virtual and <code>play(n)</code> prints the sound n times. Write two concrete classes, <code>Drum</code> whose <code>sound()</code> returns <code>\"boom\"</code> and <code>Bell</code> whose <code>sound()</code> returns <code>\"ding\"</code>, each marked <code>override</code>.", "starter": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Instrument {\npublic:\n    virtual ~Instrument() = default;\n    virtual string sound() const = 0;\n    void play(int times) const {\n        for (int i = 0; i < times; ++i) cout << sound() << (i + 1 < times ? \" \" : \"\\n\");\n    }\n};\n\n// write Drum and Bell here\n\nint main() {\n    Drum d;\n    Bell b;\n    const Instrument& first = d;\n    first.play(2);\n    b.play(3);\n    return 0;\n}\n", "expected": "boom boom\nding ding ding", "hints": ["<code>class Drum : public Instrument { public: ... };</code>", "The override must match exactly: <code>string sound() const override</code>, including the <code>const</code>.", "If <code>Drum d;</code> says abstract type, a signature does not match the pure function."], "solution": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Instrument {\npublic:\n    virtual ~Instrument() = default;\n    virtual string sound() const = 0;\n    void play(int times) const {\n        for (int i = 0; i < times; ++i) cout << sound() << (i + 1 < times ? \" \" : \"\\n\");\n    }\n};\n\nclass Drum : public Instrument {\npublic:\n    string sound() const override { return \"boom\"; }\n};\n\nclass Bell : public Instrument {\npublic:\n    string sound() const override { return \"ding\"; }\n};\n\nint main() {\n    Drum d;\n    Bell b;\n    const Instrument& first = d;\n    first.play(2);\n    b.play(3);\n    return 0;\n}\n"}
```
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
    "explain": "Pointers and references to an abstract class are fine; anything that would create an A by value (a variable, a return value, a by-value parameter) is rejected. Since C++20 only defining or calling such a function is an error, and the app's compiler accepts the bare declarations `A g();` and `void h(A a);`."
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
