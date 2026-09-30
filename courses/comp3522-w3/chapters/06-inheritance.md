---
title: Inheritance, access levels, which constructor runs
minutes: 25
---

C++ implements everything you did in Java: inheritance, polymorphism, abstract classes and interfaces. The vocabulary changes (base class and derived class instead of superclass and subclass), the colon replaces `extends`, and one new dial appears: the access level of the inheritance itself.

## The syntax

```cpp run pin vehicle.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

//Base class
class Vehicle
{
    public:
        int fuel;
        void accelerate() { fuel--; cout << "vroom, fuel " << fuel << endl; }
        void decelerate() { cout << "slowing" << endl; }
};

// Sub class inheriting from Base Class(Parent)
class Bus : public Vehicle
{
    public:
        int passengers;
};

int main()
{
    Bus bus;
    bus.fuel = 50;          // inherited from Vehicle
    bus.passengers = 12;    // Bus's own member
    bus.accelerate();       // inherited
    cout << bus.passengers << " passengers" << endl;
    return 0;
}
```

`class Bus : public Vehicle` is Java's `class Bus extends Vehicle`. The derived class inherits every **accessible** member of the base: `bus.fuel = 50;` and `bus.accelerate();` use members declared in Vehicle. Push common attributes as high into the hierarchy as possible; Bus adds only what is specific to a bus.

## What the derived class can see

Derived classes inherit all the accessible members of the base class, and the keyword after the colon may be `public`, `protected` or `private`. That keyword **limits the most accessible level** of the inherited members:

| Member in base | after `: public` | after `: protected` | after `: private` |
|---|---|---|---|
| public | public | protected | private |
| protected | protected | protected | private |
| private | not accessible | not accessible | not accessible |

The private row never changes: a base's private members are not accessible from any derived class, whatever the keyword.

```widget
access-matrix
```

The shipped Visibility project is the table as code:

```cpp run pin Spy.hpp
// predict: Write the two lines printed by main. Then uncomment privatePrint() in PublicSpy::print and read the error.
#include <iostream>
using namespace std;

class Spy {
public:
    void publicPrint() {cout << "public" << endl;}
protected:
    void protectedPrint() {cout << "protected" << endl;}
private:
    void privatePrint() {cout << "private" << endl;}
};

class PublicSpy : public Spy {
public:
    void print() {
        publicPrint(); //still public
        protectedPrint(); //still protected
        //privatePrint();
    }
};

class ProtectedSpy : protected Spy {
public:
    void print() {
        publicPrint(); //changed to protected
        protectedPrint(); //still protected
    }
};

class PrivateSpy : private Spy {   // classes inherit privately by default
public:
    void print() {
        publicPrint(); //changed to private
        protectedPrint(); //changed to private
    }
};

class PrivateSpy2 : private PrivateSpy {
public:
    void print() {
        //publicPrint();     nothing is accessible any more
    }
};

int main() {
    PrivateSpy p;
    p.print();
    return 0;
}
```

Inside each `print()`, the inherited functions are callable in all three classes because a member function of the derived class is inside the derived class. The keyword decides what happens **next**: after `class PrivateSpy : private Spy`, `publicPrint(); //changed to private` is private in PrivateSpy, so `PrivateSpy2` inherits nothing it can call, and `p.publicPrint()` from main would fail. `//privatePrint();` stays commented everywhere: private in Spy means Spy only. The comment `classes inherit privately by default` is the trap: `class X : Spy` with no keyword is private inheritance, and only a `struct` defaults to public.

## What is not inherited

A publicly derived class inherits access to everything except:

1. constructors and
2. the destructor, which are not inherited as such but are **called automatically** by the derived class's own constructors and destructor;
3. friends (Week 4);
4. private members.

## Which base constructor gets called

You choose the base constructor in the derived constructor's member initialization list, the C++ spelling of Java's `super(...)`. Say nothing and the base's **default** constructor runs.

```cpp run pin whichconstructor.cpp
// predict: Write all five lines printed (one is blank).
#include <iostream>
using namespace std;

class Base
{
  public:
    Base ()
      { cout << "Base: no parameters\n"; }
    Base (int a)
      { cout << "Base: int parameter " << a << "\n"; }
};

class Derived_One : public Base
{
  public:
    Derived_One (int a) // LOOK AT THIS!
      { cout << "Derived_One: int parameter " << a << "\n\n";}
};

class Derived_Two : public Base
{
  public:
    Derived_Two (int a) : Base (a) // COMPARE TO THIS!
      { cout << "Derived_Two: int parameter " << a << "\n"; }
};

int main ()
{
  Derived_One first_child(0);
  Derived_Two second_child(0);
  return 0;
}
```

`Derived_One (int a) // LOOK AT THIS!` has no initializer list, so the compiler inserts a call to `Base ()` and `Base: no parameters` prints before the derived body. `Derived_Two (int a) : Base (a) // COMPARE TO THIS!` passes the argument up, so `Base (int a)` runs instead. In both cases the base constructor runs **first**: a derived object is built base part first, then its own members, then its own body.

```widget
lifetime-trace
{ "preset": "Base before derived (whichconstructor.cpp)", "presets": false }
```

The shipped `private.cpp` shows the three wrong ways to initialize a base's private member from a derived constructor: `B(int x) : x{x}` fails with `member initializer 'x' does not name a non-static data member or base class` (x belongs to A, and a derived list may only name its own members and direct bases); `B(int x) { set_x(x); }` compiles but default-constructs A and then assigns, the "NO DON'T DO THIS" of the slide; the right one is `B(int x) : A{x}`.

```quiz
[
  {
    "q": "The C++ equivalent of Java's `class Circle extends Shape` is...",
    "options": ["`class Circle extends Shape`", "`class Circle : public Shape`", "`class Circle implements Shape`", "`class Shape : Circle`"],
    "answer": 1,
    "explain": "The colon plus an access keyword replaces extends. Base on the right, derived on the left."
  },
  {
    "q": "`class Spy` has public `publicPrint()`, protected `protectedPrint()`, private `privatePrint()`. After `class ProtectedSpy : protected Spy`, what is `publicPrint()` inside ProtectedSpy?",
    "options": ["public", "protected", "private", "not accessible"],
    "answer": 1,
    "explain": "The inheritance keyword caps the level: public becomes protected. protectedPrint stays protected; privatePrint is never accessible in a derived class."
  },
  {
    "q": "After `class PrivateSpy : private Spy`, can `main` call `p.publicPrint()` on a PrivateSpy `p`?",
    "type": "tf",
    "answer": false,
    "explain": "Private inheritance changed publicPrint to private in PrivateSpy, so only PrivateSpy's own members may call it. Inside PrivateSpy::print it still works."
  },
  {
    "q": "`class X : Spy { };` with no access keyword. What kind of inheritance is that?",
    "options": ["public", "protected", "private", "a compile error"],
    "answer": 2,
    "explain": "The shipped comment: classes inherit privately by default. A struct would default to public."
  },
  {
    "q": "Which are NOT inherited by a publicly derived class, according to the slide? (select all)",
    "options": ["constructors", "the destructor", "friends", "private members", "public member functions"],
    "answer": [0, 1, 2, 3],
    "explain": "Constructors and the destructor are not inherited as such (they are called automatically by the derived class's own), friends are not inherited, and private members are inaccessible. Public members are inherited."
  },
  {
    "q": "What does `Derived_One first_child(0);` print, given `Derived_One(int a)` has no initializer list and Base has both `Base()` and `Base(int)`?",
    "options": ["Base: int parameter, then Derived_One: int parameter", "Base: no parameters, then Derived_One: int parameter", "Derived_One: int parameter only", "A compile error"],
    "answer": 1,
    "explain": "With nothing in the list the compiler inserts a call to the base's default constructor, just like Java's implicit super(). Derived_Two writes : Base(a) to pick the int one."
  },
  {
    "q": "In what order do things run when a derived object is constructed?",
    "options": ["Derived body, then base constructor", "Base constructor, then the derived class's members, then the derived body", "Members, then base, then body", "All at the same time"],
    "answer": 1,
    "explain": "Base part first (its constructor prints first), then the derived class's own members in declaration order, then the derived constructor's body. Destruction is the reverse."
  },
  {
    "type": "fill",
    "q": "Make the derived constructor pass its argument to the base constructor.",
    "code": "Derived_Two(int a) : ___ { }",
    "answer": ["Base(a)", "Base (a)", "Base{a}"],
    "explain": "The base constructor call sits in the member initialization list, spelled like a member initializer: Base(a)."
  },
  {
    "q": "`class B : public A` where A has a private `int x`. Why does `B(int x) : x{x} { }` fail?",
    "options": ["x is a bad name", "A derived class's initializer list may name only its own members and its direct bases; x belongs to A. Write : A{x} instead", "Braces are not allowed in initializer lists", "int cannot be initialized with braces"],
    "answer": 1,
    "explain": "g++: member initializer 'x' does not name a non-static data member or base class. The base initializes its own members; the derived class passes the value up with A{x}."
  }
]
```
