---
title: "Extra 1: three ways to initialize, scope resolution versus the dot, class versus struct, forward declaration (Q9 to Q12)"
minutes: 25
---
This lesson covers four short definitions, Q9 to Q12, worth two to four marks each. Each one is a small idea with one trap.

## Three ways to give a variable its first value, in plain words

Initializing gives a variable its first value at the moment it is made. C++ has three ways to write it.

The first copies the value in with an equals sign, as C does. The second passes it in round brackets, like a constructor call, and the third uses curly braces.

Narrowing is a conversion that can lose information, like turning 3.7 into the whole number 3. Braces refuse it, while the other two forms allow it without a word.

```diagram
{ "type": "grid", "title": "The three forms given 3.7", "nodes": [
  { "id": "h0", "label": "form", "row": 0, "col": 0 },
  { "id": "h1", "label": "name", "row": 0, "col": 1 },
  { "id": "h2", "label": "int from 3.7", "row": 0, "col": 2 },
  { "id": "a0", "label": "int a = 3.7;", "row": 1, "col": 0 },
  { "id": "a1", "label": "copy, C-like", "row": 1, "col": 1 },
  { "id": "a2", "label": "stores 3", "row": 1, "col": 2 },
  { "id": "b0", "label": "int b(3.7);", "row": 2, "col": 0 },
  { "id": "b1", "label": "direct", "row": 2, "col": 1 },
  { "id": "b2", "label": "stores 3", "row": 2, "col": 2 },
  { "id": "c0", "label": "int c{3.7};", "row": 3, "col": 0 },
  { "id": "c1", "label": "brace, C++11", "row": 3, "col": 1 },
  { "id": "c2", "label": "compile error", "row": 3, "col": 2 }
], "hi": ["c2"], "caption": "Only braces refuse narrowing. The other two forms quietly drop the .7." }
```

### A tiny program

```cpp run pin init_forms.cpp
// predict: Write the line printed.
#include <iostream>
using namespace std;

int main()
{
    double speed = 3.7;
    int a = speed;      // copy initialization: stores 3
    int b(speed);       // direct initialization: stores 3
    int c{7};           // brace initialization
    // int d{3.7};      // error: narrowing conversion of '3.7...' from 'double' to 'int'
    cout << a << " " << b << " " << c << endl;
    return 0;
}
```

1. `3 3 7`: `int a = speed;` and `int b(speed);` silently drop the .7, and `int c{7};` is exact.

Uncomment `int d{3.7};` and the program does not compile. With a variable, `int d{speed};` is still an error by the standard, but g++ on the course's flags only warns.

### The rule, in the slide's words

The slide's three forms are C-like `int x = 0;`, constructor `int x(0);`, and uniform `int x {0};` from C++11. Prefer braces, because "it prohibits implicit narrowing conversion among built-in types".

Answer the exam with the slide: braces refuse narrowing. Braces also avoid the trap where `Mob m();` declares a function instead of an object.

## Naming a member with `::`, `.` and `->`

A class is a blueprint, and an object is one thing built from it. Each operator answers one question: are you naming something in the blueprint, or something in one object?

The scope operator `::` names something that lives inside a namespace or a class. A namespace is a named group of names, such as `std`, the standard library's group.

The dot `.` names a member of one particular object. The arrow `->` does the same when you hold a pointer, which is the object's address instead of the object.

```diagram
{ "type": "grid", "title": "Three ways to reach a name", "nodes": [
  { "id": "h0", "label": "operator", "row": 0, "col": 0 },
  { "id": "h1", "label": "left side is", "row": 0, "col": 1 },
  { "id": "h2", "label": "example", "row": 0, "col": 2 },
  { "id": "s0", "label": "::", "row": 1, "col": 0 },
  { "id": "s1", "label": "namespace, class", "row": 1, "col": 1 },
  { "id": "s2", "label": "Walk::trips", "row": 1, "col": 2 },
  { "id": "d0", "label": ".", "row": 2, "col": 0 },
  { "id": "d1", "label": "an object", "row": 2, "col": 1 },
  { "id": "d2", "label": "w.go()", "row": 2, "col": 2 },
  { "id": "a0", "label": "->", "row": 3, "col": 0 },
  { "id": "a1", "label": "a pointer", "row": 3, "col": 1 },
  { "id": "a2", "label": "p->go()", "row": 3, "col": 2 }
], "hi": ["s1", "d1"], "caption": "The left side decides the operator: a namespace or class takes ::, an object takes ., a pointer takes ->." }
```

### A program with all three

A `static` member belongs to the class, not to any one object, so all objects share one copy. Its name is reached with `::`.

```cpp run pin scope_dot.cpp
// predict: Write the three lines printed.
#include <iostream>

class Walk {
public:
    static int trips;
    int steps;
    Walk(int s);
    void go() const;
};

int Walk::trips = 0;

Walk::Walk(int s) : steps(s)
{
    ++trips;
}

void Walk::go() const
{
    std::cout << "walk " << steps << std::endl;
}

int main()
{
    Walk w(4);
    Walk* p = new Walk(9);
    w.go();
    p->go();
    std::cout << Walk::trips << std::endl;
    delete p;
    return 0;
}
```

1. `walk 4`: `w.go();` calls `go` on the object `w`.
2. `walk 9`: `p->go();` calls it on the object `p` points to.
3. `2`: `Walk::trips` names the class's one shared counter. Both constructors ran `++trips;`.

The definitions `Walk::Walk(int s)` and `void Walk::go() const` also use `::`. They say which class the function belongs to, because the body sits outside the class.

### The rule

`::` is the scope resolution operator: a name inside a namespace or a class. `.` accesses a member of an object, and `->` does the same through a pointer.

## Try it: Q9 and Q10

```quiz
[
  {
    "q": "Which of these lines does not compile?",
    "options": ["`int c{3.7};`", "`int a = 3.7;`", "`int b(3.7);`", "`int d{3};`"],
    "answer": 0,
    "explain": "1. `int a = 3.7;` and `int b(3.7);` narrow from `double` to `int` and silently store 3.\n2. `int d{3};` gives an `int` an `int`: nothing is lost.\n3. `int c{3.7};` asks braces to narrow, and braces refuse: `narrowing conversion of '3.7000000000000002e+0' from 'double' to 'int'`."
  },
  {
    "type": "free",
    "q": "Q9 (4). There are three ways to initialize variables in C++. What are they, and which method do we prefer to use? Why?",
    "model": "Copy (C-like) initialization `int x = 0;`, direct (constructor) initialization `int x(0);`, and uniform or brace initialization `int x{0};` (C++11). We prefer braces: they prohibit implicit narrowing conversions, so `int y{3.7};` is a compile error while `int y = 3.7;` and `int y(3.7);` silently store 3. Braces also work for every kind of object and cannot be misread as a function declaration the way `Mob m();` is.",
    "points": [
      "int x = 0; (copy, C-like)",
      "int x(0); (direct, constructor)",
      "int x{0}; (uniform, brace, C++11)",
      "Prefer braces: they refuse narrowing, with the 3.7 example"
    ],
    "rows": 4,
    "explain": "One mark per form and one for the reason. The reason must name narrowing; \"it is modern\" earns nothing."
  },
  {
    "type": "free",
    "q": "Q10 (2). When do we use the scope operator :: and when do we use the dot operator . in C++?",
    "model": "`::` is the scope resolution operator: it names something inside a namespace or a class, such as `std::cout`, `Walk::Walk(int s)` when defining a member outside the class, `Base::f()` to call a base version, or a static member `Walk::trips`. `.` accesses a member of a particular object: `w.go()`. Through a pointer, `->` does what `.` does: `p->go()`.",
    "points": [
      ":: names a member of a namespace or a class, not of an object",
      "An example such as std::cout or Walk::go defined outside the class",
      ". accesses a member of an object instance, with an example",
      "-> is the pointer form of ."
    ],
    "rows": 3,
    "explain": "Two marks: one for each operator with an example. The `->` line is a free extra that shows you know the third case."
  }
]
```

## Class versus struct, in plain words

A struct and a class are the same kind of thing: a type that holds data and functions. They differ in one default only.

That default is who may use a member that has no label above it. Public means any code may use it, and private means only the class's own functions may.

```diagram
{ "type": "grid", "title": "struct and class side by side", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "struct", "row": 0, "col": 1 },
  { "id": "h2", "label": "class", "row": 0, "col": 2 },
  { "id": "m0", "label": "members default", "row": 1, "col": 0 },
  { "id": "m1", "label": "public", "row": 1, "col": 1 },
  { "id": "m2", "label": "private", "row": 1, "col": 2 },
  { "id": "i0", "label": "inherits default", "row": 2, "col": 0 },
  { "id": "i1", "label": "public", "row": 2, "col": 1 },
  { "id": "i2", "label": "private", "row": 2, "col": 2 },
  { "id": "f0", "label": "functions, ctors", "row": 3, "col": 0 },
  { "id": "f1", "label": "allowed", "row": 3, "col": 1 },
  { "id": "f2", "label": "allowed", "row": 3, "col": 2 }
], "hi": ["m1", "m2"], "caption": "Only the default access differs. Everything else is the same." }
```

### A tiny program

```cpp run pin struct_class.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

struct Waypoint {
    int x;              // public: struct default
    int y;
};

class Walk {
    Waypoint target;    // private: class default
public:
    Walk(Waypoint t) : target(t) {}
    int targetX() const { return target.x; }
};

int main()
{
    Waypoint spot{120, 45};
    cout << spot.x << "," << spot.y << endl;
    Walk walk(spot);
    cout << walk.targetX() << endl;
    // cout << walk.target.x;   // error: 'Waypoint Walk::target' is private within this context
    return 0;
}
```

1. `120,45`: `cout << spot.x << "," << spot.y << endl;` reads public members from outside.
2. `120`: `walk.targetX()` is public, and it reads the private `target` from inside the class.

Uncomment the last `cout` and g++ refuses it with the error in the comment. `target` has no label, and in a class that means private.

### The rule, in the slide's words

The slide says: "A struct and a class are the same thing in C++. Except when we use the keyword struct, members get public access by default!" The default kind of inheritance follows the same rule.

## Forward declaration, in plain words

A forward declaration tells the compiler that a name is a class before the class is written out. It is a promise that the full definition comes later.

The slide's case is a Car that has Wheels, where each Wheel points back at its Car. Each header file would have to include the other, forever.

Until the definition arrives, the type is incomplete: the compiler does not know its size. A pointer or a reference has a known size whatever it points at, so only those may be declared.

```diagram
{ "type": "flow", "title": "Breaking the include loop", "nodes": [
  { "id": "car", "label": "Car.hpp", "sub": "includes Wheel.hpp" },
  { "id": "wh", "label": "Wheel.hpp", "sub": "says class Car;" }
], "edges": [ { "from": "car", "to": "wh", "label": "includes" }, { "from": "wh", "to": "car", "label": "Car* owner", "dashed": true } ], "hi": ["wh"], "caption": "Wheel.hpp declares class Car; instead of including Car.hpp, so the loop is gone." }
```

### A tiny program

```cpp run pin forward_decl.cpp
// predict: Write the line printed.
#include <iostream>
#include <string>
using namespace std;

class MapDb;                // forward declaration: MapDb is a class

class Portal {
public:
    int id;
    MapDb* owner;           // pointer to an incomplete type: allowed
    // MapDb db;            // error: field 'db' has incomplete type 'MapDb'
    Portal(int i, MapDb* o) : id(i), owner(o) {}
    void show() const;      // body comes after MapDb is complete
};

class MapDb {
public:
    string name;
    Portal exit;
    MapDb(const string& n) : name(n), exit(1, this) {}
};

void Portal::show() const
{
    cout << "portal " << id << " in " << owner->name << endl;
}

int main()
{
    MapDb library("Magic Library");
    library.exit.show();
    return 0;
}
```

1. `portal 1 in Magic Library`: `MapDb library("Magic Library");` builds its portal with `exit(1, this)`. Then `owner->name` works because `Portal::show` is written after `MapDb` is complete.

The body of `show` had to wait. Reading `owner->name` needs the full class, not just its name.

### The rule, in the slide's words

The slide's Wheel holds `Car *owner; // Must be pointer or reference`. The purpose is to let two classes refer to each other and to cut down on includes.

## Try it: Q11 and Q12

```quiz
[
  {
    "q": "True or false: a `struct` cannot have private members or member functions; only a `class` can.",
    "type": "tf",
    "answer": false,
    "explain": "1. The only difference is the default: `struct` members are public until a `private:` label, `class` members are private until a `public:` label.\n2. A struct can have constructors, member functions, `private:` sections and base classes.\n3. The same default applies to inheritance: `struct D : B` is public, `class D : B` is private."
  },
  {
    "type": "free",
    "q": "Q11 (2). What is the difference between the class and the struct in C++?",
    "model": "Only the default access. Members of a `struct` are public by default; members of a `class` are private by default. The default inheritance follows the same rule (`struct D : B` is public, `class D : B` is private). Otherwise they are identical: both can have constructors, member functions, access specifiers and inheritance.",
    "points": [
      "struct members are public by default",
      "class members are private by default",
      "Everything else is the same (constructors, functions, inheritance)"
    ],
    "rows": 3,
    "explain": "The trap is to say a struct cannot have functions or private members. It can; only the default differs."
  },
  {
    "q": "Only `class MapDb;` has been seen; the definition of `MapDb` comes later. Which members can `class Portal` declare now? Select all that compile.",
    "options": ["`MapDb* owner;`", "`MapDb& owner;`", "`MapDb db;`", "`MapDb maps[2];`"],
    "answer": [0, 1],
    "explain": "1. After `class MapDb;` the type is incomplete: its size is unknown.\n2. A pointer and a reference have a known size, so `MapDb* owner;` and `MapDb& owner;` compile.\n3. `MapDb db;` and `MapDb maps[2];` need the size of a `MapDb`, so g++ says `field 'db' has incomplete type 'MapDb'`.\n4. That is why the slide's Wheel holds `Car *owner; // Must be pointer or reference`."
  },
  {
    "type": "free",
    "q": "Q12 (3). What is forward declaration and what is its purpose?",
    "model": "A declaration of a class name before its full definition, `class MapDb;`, so the compiler knows the name is a class. Its purpose: code can refer to the type by pointer or reference before the definition, so two classes can refer to each other (a `Wheel` holding `Car* owner`) without each header including the other, which breaks circular includes and cuts header dependencies and compile time. Only pointers and references are allowed until the definition: `MapDb db;` is an incomplete type error.",
    "points": [
      "Declares a name before its definition: `class MapDb;`",
      "Allows pointers and references to the type before it is defined",
      "Purpose: mutual references and breaking circular includes",
      "Fewer includes, faster compiles",
      "Cannot create an object or use members of the incomplete type"
    ],
    "rows": 4,
    "explain": "Three marks: what it is, what it allows, why. The incomplete-type limit shows you know the rule behind \"must be pointer or reference\"."
  }
]
```

## Remember

- Braces refuse narrowing: `int y{3.7};` does not compile, and the other two forms store 3.
- `::` names something in a namespace or class, `.` a member of an object, `->` a member through a pointer. A struct differs from a class only in its public default.
- After `class Car;` alone, only a pointer or a reference to `Car` is allowed.
- *On the sheet:* Sheet sides 1 and 2, band 2 "What is X? How is it different from Y? When is it used?" for Q9 to Q12. Sheet side 2, band 4 "True/false and multiple choice traps", Week 1, for narrowing.
