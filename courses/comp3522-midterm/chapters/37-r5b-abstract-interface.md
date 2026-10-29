---
title: "Extra 3: abstract classes and interfaces (Q13, Q14)"
minutes: 15
---
This lesson teaches what makes a class abstract and how C++ writes an interface without a keyword for it. It prepares you for the two short definitions Q13 and Q14, and for the "which line compiles" multiple choice.

## What an abstract class is, in plain words

Some base classes describe an idea, not a thing you can hold. Every quest can be run, but "a quest" in general has no steps to run.

A pure virtual function is a promise with no body. The base class says "every class below me will have this function" and writes no code for it.

A virtual function is one whose call goes to the real object's version at run time. The pure kind simply has no version of its own.

A class that holds even one such promise is abstract. No object of it can exist, because one of its functions has nothing to run.

A derived class that keeps every promise, by writing a body for each one, is concrete. Concrete means objects of it can be made.

A derived class that skips even one promise inherits it unkept. It is still abstract.

```diagram
{ "type": "tree", "title": "One promise, three classes", "nodes": [
  { "id": "q", "label": "Quest", "sub": "run() = 0: abstract" },
  { "id": "h", "label": "SlimeHunt", "sub": "writes run(): concrete", "parent": "q" },
  { "id": "b", "label": "BossQuest", "sub": "writes nothing: abstract", "parent": "q" }
], "hi": ["h"], "caption": "Only a class that gives every pure virtual function a body can have objects. A child that skips one stays abstract." }
```

## A tiny program you can run in your head

```cpp run pin quest.cpp
// predict: Write the line printed.
#include <iostream>
using namespace std;

class Quest {
public:
    virtual void run() const = 0;
    virtual ~Quest() {}
};

class SlimeHunt : public Quest {
public:
    void run() const override { cout << "hunt 10 slimes" << endl; }
};

int main()
{
    // Quest blank;
    SlimeHunt hunt;
    Quest& q = hunt;
    q.run();
    return 0;
}
```

1. `virtual void run() const = 0;` makes Quest abstract. `SlimeHunt hunt;` is legal because SlimeHunt writes `run`. Then `Quest& q = hunt;` names it through the abstract type, and `q.run();` dispatches to SlimeHunt: `hunt 10 slimes`.

Uncomment `// Quest blank;` and g++ refuses: `cannot declare variable 'blank' to be of abstract type 'Quest'`. A reference or a pointer to Quest is fine. An object of Quest is not.

## The rule, in the slide's words

- An abstract class is "implemented as a class that has one or more pure virtual functions". The `= 0` is the "pure specifier".
- C++ has no `abstract` keyword. The pure specifier alone makes a class abstract.
- A derived class is abstract "unless we override each pure virtual function".
- Pointers and references to an abstract class are fine. An object, a by-value parameter and a return type are not: `void functionB(A aParam); // WRONG`.
- A declaration cannot have both a pure specifier and a body: `virtual void g() { } = 0; // ERROR!`.

The trap: a class that overrides some of its pure virtual functions but not all is still abstract.

## The paper's question, worked: Q13

Q13 asks how to make a class abstract. The program below shows each part of the answer: the pure specifier, a concrete child, and a child that stays abstract.

```cpp run pin abstract.cpp
// predict: Write the four lines printed.
#include <iostream>
using namespace std;

class Shape {                                  // abstract: one pure virtual
public:
    virtual double area() const = 0;           // pure specifier
    void describe() const { cout << "area " << area() << endl; }
    virtual ~Shape() { cout << "~Shape" << endl; }
};

class Circle : public Shape {                  // concrete: overrides area
public:
    double area() const override { return 3; }
    ~Circle() { cout << "~Circle" << endl; }
};

class Ring : public Shape {                    // still abstract: no area
};

int main()
{
    // Shape s;      // error: cannot declare variable 's' to be of abstract type 'Shape'
    // Ring r;       // error: cannot declare variable 'r' to be of abstract type 'Ring'
    Shape* s = new Circle;
    cout << s->area() << endl;
    s->describe();
    delete s;
    return 0;
}
```

1. `Shape* s = new Circle;` is legal: a pointer to an abstract class is fine, and Circle is concrete because it overrides `area`. `cout << s->area() << endl;` dispatches to Circle: `3`.
2. `s->describe();` is an ordinary Shape function, but inside it `area()` is still a virtual call on a Circle: `area 3`.
3. `delete s;` goes through the virtual destructor: `~Circle`.
4. Then the base part: `~Shape`.

The two commented lines are the rule in action. `Shape s;` fails because Shape has a pure virtual function.

`Ring r;` fails the same way. Ring overrides nothing, so it inherits the pure virtual and stays abstract.

## What an interface is, in plain words

An interface is a list of things a class promises to do, with no code and no data. Java has a keyword for it, and C++ does not.

C++ writes an interface as a class made only of pure virtual functions. The slide calls it a "pure abstract class".

It also gets one ordinary virtual destructor with an empty body. A destructor is the function that runs when an object dies, and the virtual one makes `delete` through the interface pointer reach the right class.

A class "implements" the interface by inheriting from it and writing every function. A class may inherit several interfaces at once.

```cpp run pin interface.cpp
// predict: Write the four lines printed.
#include <iostream>
#include <string>
using namespace std;

class Step {                                   // an interface: no data, no bodies
public:
    virtual ~Step() {}                         // regular virtual destructor
    virtual string name() const = 0;
    virtual void run() = 0;
};

class Walk : public Step {                     // "implements" Step
public:
    string name() const override { return "Walk"; }
    void run() override { cout << "walk to NPC 313" << endl; }
    ~Walk() { cout << "~Walk" << endl; }
};

class Talk : public Step {
public:
    string name() const override { return "Talk"; }
    void run() override { cout << "talk to Grendel the Really Old" << endl; }
    ~Talk() { cout << "~Talk" << endl; }
};

int main()
{
    Step* route[2] = { new Walk, new Talk };
    for (Step* step : route) {
        cout << step->name() << ": ";
        step->run();
    }
    for (Step* step : route) {
        delete step;
    }
    return 0;
}
```

1. `Step* route[2] = { new Walk, new Talk };` holds two different classes behind one interface pointer type. The first pass calls `step->name()` and then `step->run();` on the Walk: `Walk: walk to NPC 313`.
2. The second pass reaches the Talk: `Talk: talk to Grendel the Really Old`.
3. `delete step;` on the Walk goes through `virtual ~Step() {}`, so the derived destructor runs: `~Walk`.
4. The same for the Talk: `~Talk`.

The slide gives the reason for that destructor. It is there "to ensure that when an instance of an implementing class is deleted polymorphically the correct derived destructor is called".

```diagram
{ "type": "grid", "title": "The slide's table, least implemented first", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "Interface", "row": 0, "col": 1 },
  { "id": "h2", "label": "Abstract class", "row": 0, "col": 2 },
  { "id": "h3", "label": "Concrete class", "row": 0, "col": 3 },
  { "id": "f0", "label": "Functions", "row": 1, "col": 0 },
  { "id": "f1", "label": "only pure virtual", "row": 1, "col": 1 },
  { "id": "f2", "label": "1+ pure virtual, others allowed", "row": 1, "col": 2 },
  { "id": "f3", "label": "no pure virtual", "row": 1, "col": 3 },
  { "id": "d0", "label": "Data members", "row": 2, "col": 0 },
  { "id": "d1", "label": "none", "row": 2, "col": 1 },
  { "id": "d2", "label": "allowed", "row": 2, "col": 2 },
  { "id": "d3", "label": "allowed", "row": 2, "col": 3 },
  { "id": "v0", "label": "Virtual dtor", "row": 3, "col": 0 },
  { "id": "v1", "label": "yes", "row": 3, "col": 1 },
  { "id": "v2", "label": "yes", "row": 3, "col": 2 },
  { "id": "v3", "label": "if it is a base with children", "row": 3, "col": 3 },
  { "id": "i0", "label": "Instantiate", "row": 4, "col": 0 },
  { "id": "i1", "label": "can NOT", "row": 4, "col": 1 },
  { "id": "i2", "label": "can NOT", "row": 4, "col": 2 },
  { "id": "i3", "label": "CAN", "row": 4, "col": 3 }
], "hi": ["f1", "d1", "i1", "i2"], "caption": "An interface is an abstract class with nothing but pure virtual functions and a virtual destructor. Neither can be instantiated." }
```

:::tip The marker's three moves
For Q13 and Q14, name the thing in the slide's words, contrast it with Java's keyword, and give one line of code.
:::

## Try it

```quiz
[
  {
    "type": "free",
    "q": "Q13 (3). How do we make a class abstract in C++?",
    "model": "Give the class at least one **pure virtual function**: `virtual double area() const = 0;` (`= 0` is the pure specifier). There is no `abstract` keyword. An abstract class cannot be instantiated (`Shape s;` does not compile), but pointers and references to it are fine (`Shape* s = new Circle;`). A derived class stays abstract until it overrides every pure virtual function it inherits.",
    "points": [
      "At least one pure virtual function, written `virtual ... = 0;`",
      "No `abstract` keyword in C++",
      "Cannot be instantiated; pointers and references are allowed",
      "A derived class stays abstract until it overrides every pure virtual"
    ],
    "rows": 4,
    "explain": "Three moves: the definition in the slide's term (one or more pure virtual functions), the contrast (no keyword, unlike Java's `abstract class`), and the line of code (`virtual double area() const = 0;`). The fourth point, about derived classes, shows you know the rule beyond the definition: a class that misses one pure virtual is still abstract."
  },
  {
    "type": "free",
    "q": "Q14 (2). Does C++ have interfaces? Explain.",
    "model": "Not as a keyword. An interface is written as a **pure abstract class**: only pure virtual functions, no data members, plus a virtual destructor (`class Step { public: virtual ~Step() {} virtual void run() = 0; };`). A class implements it by inheriting from it (several interfaces at once, through multiple inheritance) and overriding every function.",
    "points": [
      "No `interface` keyword",
      "Written as a class with only pure virtual functions and no data",
      "Has a virtual destructor",
      "Implemented by inheriting and overriding every function"
    ],
    "rows": 4,
    "explain": "Two marks: one for \"no keyword, but a pure abstract class\", one for how a class implements it. The virtual destructor and multiple inheritance make the answer complete."
  },
  {
    "q": "`Module` declares `virtual void tick() = 0;` and `Fight : public Module` overrides `tick()`. `f` is a `Fight`. Which line fails to compile?",
    "options": [
      "`Module m;`",
      "`Module* p = new Fight;`",
      "`Module& r = f;`",
      "`void run(Module& m);`"
    ],
    "answer": 0,
    "explain": "`Module` has a pure virtual function, so it is abstract and no object of it can exist: `Module m;` gives `cannot declare variable 'm' to be of abstract type 'Module'`. A pointer to Module holding a Fight is fine, because Fight overrides every pure virtual and is concrete. References to Module, as a variable or a parameter, are fine too. The slide's rule: pointers and references OK; objects, by-value parameters and return values WRONG."
  },
  {
    "q": "`Module` declares two pure virtual functions, `tick()` and `name()`. `Rest : public Module` overrides only `tick()`. `Rest r;` compiles.",
    "type": "tf",
    "answer": false,
    "explain": "Rest inherits `name()` still marked `= 0`. A derived class is abstract \"unless we override each pure virtual function\", so Rest is abstract and `Rest r;` is the same compile error as `Module m;`. A class below Rest that overrides `name()` would be concrete."
  }
]
```

## Remember

- One pure virtual function, `= 0`, makes a class abstract. No objects of it, only pointers and references.
- A child stays abstract until it writes a body for every pure virtual function it inherits.
- An interface is a pure abstract class: only pure virtual functions, no data, and a virtual destructor.
- *On the sheet:* Sheet side 2, band 2 "What is X? How is it different from Y? When is it used?" for Q13 and Q14, and side 2, band 3 "Write the function / class / program" for the abstract class code.
