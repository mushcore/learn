---
title: "Review 5: abstract classes, interfaces, the diamond and copy-and-swap (Q13 to Q16: 14 marks)"
minutes: 35
---
:::quiz What the paper asks and what earns the marks
Four Part A definitions: Q13 (3 marks) how to make a class abstract, Q14 (2) whether C++ has interfaces, Q15 (6) the diamond in three parts, Q16 (3) how copy-and-swap works and an easy way to break it. That is 14 marks of short written answers. The marker looks for the C++ term, the rule behind it, and one line of code that shows it. The same ideas come back as multiple choice and as read-the-output questions: which function a base pointer calls, what a sliced copy prints, which destructors run on `delete`.
:::

**Understand before the exam (cannot be looked up):**

- A `virtual` call through a pointer or reference runs the version of the object's real class. Through a plain object, it runs the object's own class.
- Copying a derived object into a base object keeps only the base part (slicing).
- A pure virtual function (`= 0`) makes the class abstract: no objects of it, pointers and references only.
- In a diamond, the bottom class holds one base per path unless the middle classes inherit `virtual`ly. With a virtual base, the bottom class constructs it.
- Copy-and-swap: the by-value parameter makes the copy, the swap hands the old data to the copy, the copy's destructor frees it.

**On the sheet (look up, do not memorise):**

- The code for every pattern here: *Sheet side 2, "F. Deep copy, copy-and-swap, abstract, interface, diamond"*.
- The four model answers, condensed: *Sheet side 1, "C. Definitions in three moves"*.
- Virtual base order, virtual destructor and slicing in a trace: *Sheet side 1, "A. Trace rules"*.

Do if time is short: the Q13 and Q16 sections, then variants 1, 2 and 7. The rest are marked "if time".

## Virtual functions, `override` and slicing, from zero

Picture a base pointer `Npc* n` holding the address of a `Grendel`. The pointer's type says Npc. The object it points at is a Grendel. Which `talk()` runs?

The slide's rule: a virtual member is "a base class member function that can be redefined in the derived class". Mark it `virtual` in the base and the call goes to the object's real class at run time (dynamic binding). Without `virtual`, the pointer's type decides at compile time.

Writing `override` on the derived version asks the compiler to check that it really overrides a base virtual. A typo in the name or a missing `const` then fails to compile instead of silently adding a new function.

The second slide rule: "polymorphism only works with pointers or references". A base **object** made from a derived one is a new Npc built by the Npc copy constructor; the Grendel part is cut off. That is slicing.

```cpp run pin npc.cpp
// predict: Write the seven lines printed.
#include <iostream>
using namespace std;

class Npc {
public:
    virtual void talk() const { cout << "Npc talks" << endl; }
    virtual ~Npc() { cout << "~Npc" << endl; }
};

class Grendel : public Npc {
public:
    void talk() const override { cout << "Grendel the Really Old talks" << endl; }
    ~Grendel() { cout << "~Grendel" << endl; }
};

int main()
{
    Npc* n = new Grendel;
    n->talk();
    n->Npc::talk();
    Npc copy = *n;
    copy.talk();
    delete n;
    cout << "end of main" << endl;
    return 0;
}
```

1. `n->talk();` is a virtual call through a pointer to a Grendel, so Grendel's override runs: `Grendel the Really Old talks`.
2. `n->Npc::talk();` names the class with `::`, which switches dispatch off: `Npc talks`.
3. `Npc copy = *n;` slices: `copy` is an Npc object, so `copy.talk();` prints `Npc talks` even though `talk` is virtual.
4. `delete n;` runs the destructor through the base pointer. `~Npc` is virtual, so the Grendel destructor runs first: `~Grendel`.
5. The base part is destroyed after the derived part: `~Npc`.
6. `end of main`.
7. `copy` goes out of scope at the closing brace: `~Npc`.

```diagram
{ "type": "grid", "title": "Npc copy = *n: what is copied", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "Npc part", "row": 0, "col": 1 },
  { "id": "h2", "label": "Grendel part", "row": 0, "col": 2 },
  { "id": "h3", "label": "talk() runs", "row": 0, "col": 3 },
  { "id": "r1", "label": "*n (heap)", "row": 1, "col": 0 },
  { "id": "r1a", "label": "yes", "row": 1, "col": 1 },
  { "id": "r1b", "label": "yes", "row": 1, "col": 2 },
  { "id": "r1c", "label": "Grendel's", "row": 1, "col": 3 },
  { "id": "r2", "label": "copy (stack)", "row": 2, "col": 0 },
  { "id": "r2a", "label": "copied", "row": 2, "col": 1 },
  { "id": "r2b", "label": "cut off", "row": 2, "col": 2 },
  { "id": "r2c", "label": "Npc's", "row": 2, "col": 3 }
], "hi": ["r2b", "r2c"], "caption": "The Npc copy constructor copies only the Npc part. The copy is an Npc for its whole life, so a virtual call on it can only reach Npc's version." }
```

The destructor rule, in the slide's words: "if a class contains a virtual function, the destructor should be virtual too". Remove `virtual` from `~Npc` and `delete n;` is undefined behaviour; g++ prints only `~Npc` and the Grendel part is never destroyed.

```widget
dispatch-viz
{ "virtual": true, "handle": "val", "object": "derived" }
```

## Q13 (3 marks): an abstract class

The slide: an abstract class is "implemented as a class that has one or more pure virtual functions". The `= 0` after the declaration is the pure specifier. C++ has no `abstract` keyword.

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
3. `delete s;` through the virtual destructor: `~Circle`.
4. Then the base part: `~Shape`.

The two commented lines are the rule in action. Uncommented, `// Shape s;` gives g++'s `cannot declare variable 's' to be of abstract type 'Shape'`, and `Ring` gets the same error: it overrides nothing, so it inherits the pure virtual and stays abstract.

The slide's other rules: an abstract class cannot be a by-value parameter type or a return type (`void functionB(A aParam); // WRONG`), but `A* pa;` and `A&` are fine. A declaration cannot have both a pure specifier and a body: `virtual void g() { } = 0; // ERROR!`.

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
  }
]
```

## Q14 (2 marks): interfaces

C++ has no `interface` keyword. The slide calls an interface a "pure abstract class": "pure virtual functions, no other kinds of functions (+ a regular virtual destructor)", and no data. A class implements it by inheriting from it and overriding every function.

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

1. `Step* route[2] = { new Walk, new Talk };` holds two different classes behind one interface pointer type. The first pass of the loop calls `step->name()` and then `step->run();` on the Walk: `Walk: walk to NPC 313`.
2. The second pass reaches the Talk: `Talk: talk to Grendel the Really Old`.
3. `delete step;` on the Walk goes through `virtual ~Step() {}`, so the derived destructor runs: `~Walk`.
4. The same for the Talk: `~Talk`.

That virtual destructor is the reason the slide puts it in every interface: "to ensure that when an instance of an implementing class is deleted polymorphically the correct derived destructor is called".

The slide's table, from least implemented to most:

| | Interface | Abstract class | Concrete class |
|---|---|---|---|
| Functions | only pure virtual | at least 1 pure virtual, others allowed | no pure virtual |
| Data members | none | allowed | allowed |
| Virtual destructor | yes | yes | if it is a base class that has children |
| Instantiate | can NOT | can NOT | CAN |

```quiz
[
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
  }
]
```

## Q15 (6 marks): the diamond

**a. How it happens.** Two classes, student and mathematician, each inherit from the same base, person. A fourth class, math_student, inherits from both. Drawn as a class diagram, that is the "classic diamond shape".

```diagram
{ "type": "layers", "title": "One math_student object, two layouts", "nodes": [
  { "id": "nv", "label": "math_student, plain inheritance" },
  { "id": "nvs", "label": "student", "parent": "nv" },
  { "id": "nvsp", "label": "person (name)", "parent": "nvs" },
  { "id": "nvm", "label": "mathematician", "parent": "nv" },
  { "id": "nvmp", "label": "person (name)", "parent": "nvm" },
  { "id": "v", "label": "math_student, virtual person" },
  { "id": "vs", "label": "student", "parent": "v" },
  { "id": "vm", "label": "mathematician", "parent": "v" },
  { "id": "vp", "label": "person (shared)", "parent": "v" }
], "hi": ["nvsp", "nvmp", "vp"], "caption": "Plain inheritance: two person subobjects, two names, two constructor calls. With class student : public virtual person (and the same for mathematician): one person, owned by the most-derived object and shared by both sides." }
```

**b. The ambiguity.** If student and mathematician both have `all_info()` and math_student does not, `bob.all_info()` does not compile: g++ says `request for member 'all_info' is ambiguous`. The slide: "there is no priority for one or the other". Three fixes: qualify the call (`bob.mathematician::all_info()`), override the function in math_student, or, when the function comes from person itself, make person a virtual base so there is only one copy to call.

**c. The most-derived class's job.** With a virtual base, the slide says "it is the responsibility of the most derived class (math_student) to call the shared base constructor". The middle classes' calls are ignored: "The person constructor calls in mathematician and student are disabled when they are indirectly called from a derived class."

```cpp run pin diamond.cpp
// predict: Write the eight lines printed.
#include <iostream>
#include <string>
using namespace std;

class person {
public:
    person() { cout << "person default constructor" << endl; }
    person(const string& name) : name(name) { cout << "person 1-param constructor" << endl; }
    virtual void all_info() const { cout << "[person name=" << name << "]" << endl; }
protected:
    string name;
};

class student : public virtual person {
public:
    student(const string& name, const string& passed) : person(name), passed(passed)
    { cout << "student constructor" << endl; }
    void all_info() const override { person::all_info(); cout << "I passed: " << passed << endl; }
protected:
    string passed;
};

class mathematician : public virtual person {
public:
    mathematician(const string& name, const string& proved) : person(name), proved(proved)
    { cout << "mathematician constructor" << endl; }
    void all_info() const override { person::all_info(); cout << "I proved: " << proved << endl; }
protected:
    string proved;
};

class math_student : public student, public mathematician {
public:
    math_student(const string& name, const string& passed, const string& proved)
        : person(name), student(name, passed), mathematician(name, proved)
    { cout << "math_student constructor" << endl; }
    void all_info() const override { student::all_info(); mathematician::all_info(); }
};

int main()
{
    math_student bob("Robert Robson", "Algebra", "Fermat's Last Theorem");
    bob.all_info();
    return 0;
}
```

1. The virtual base is built first, by the most-derived class, from `: person(name), student(name, passed), mathematician(name, proved)`: `person 1-param constructor`.
2. Then the direct bases in the order written after the colon of `class math_student : public student, public mathematician`. The `person(name)` inside student's list is skipped: `student constructor`.
3. Same for mathematician: `mathematician constructor`.
4. The body of the bottom class runs last: `math_student constructor`.
5. `bob.all_info();` runs math_student's override, which calls `student::all_info()` (fix one and fix two together). That calls `person::all_info()` on the one shared person: `[person name=Robert Robson]`.
6. `I passed: Algebra`.
7. `mathematician::all_info()` reads the same person: `[person name=Robert Robson]`.
8. `I proved: Fermat's Last Theorem`.

Delete `person(name), ` from math_student's list and run it again. The first line becomes `person default constructor`, and both `name=` lines print an empty name: the middle classes passed the name, but their calls were disabled. Delete math_student's `all_info` override instead, and g++ refuses the class: `no unique final overrider for 'virtual void person::all_info() const' in 'math_student'`.

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": true, "init": "most" }
```

```quiz
[
  {
    "type": "free",
    "q": "Q15 (6). In C++, multiple inheritance may result in a class diamond-shaped inheritance pattern. a. How does this happen? b. Does this cause any ambiguities with respect to member functions? How can the ambiguities be solved? c. What is the key responsibility of the most-derived class at the bottom of the diamond?",
    "model": "a. Two classes (student, mathematician) inherit from the same base (person), and a fourth class (math_student) inherits from both. Without `virtual` inheritance the bottom object holds two person subobjects.\n\nb. Yes. A function inherited from both sides, `all_info()`, has no priority for one or the other, so `bob.all_info()` is ambiguous and does not compile. Fix it by qualifying the call (`bob.mathematician::all_info()`), by overriding the function in math_student, or, for a function that comes from person itself, by making person a virtual base (`class student : public virtual person`) so there is one copy.\n\nc. With a virtual base, math_student must call the shared base's constructor itself: `math_student(...) : person(name), student(name, passed), mathematician(name, proved)`. The middle classes' calls to person's constructor are ignored, so if math_student forgets, person is default-constructed and the name is lost.",
    "points": [
      "Two classes inherit one base; a fourth inherits from both",
      "Without virtual inheritance the base is stored twice",
      "A function from both sides is ambiguous: the call does not compile",
      "Fixes: qualify with `::`, override in the bottom class, or virtual inheritance",
      "The most-derived class calls the virtual base's constructor in its initializer list",
      "The middle classes' calls are ignored; forgetting it default-constructs the base"
    ],
    "rows": 8,
    "explain": "Two marks per part. For a, the shape (two middle classes, one shared base, one bottom class). For b, the yes plus at least two fixes. For c, the constructor call in the bottom class's list plus what goes wrong without it: the default constructor runs and the name is empty."
  }
]
```

## Q16 (3 marks): copy-and-swap

The slide's canonical copy assignment is a member function:

```cpp
MyClass& MyClass::operator=(MyClass rhs) { mySwap(*this, rhs); return *this; }
```

The slide's three steps: "1. use the copy constructor to create a local copy of the original object; 2. acquire the copied data with a swap function, swapping old data with new; 3. the temporary local copy is destroyed, taking the old data and leaving the new data in the destination." It needs "1. Working copy constructor 2. A swap function. 3. Working destructor", and the swap must swap all data members without throwing.

```cpp run pin copyswap.cpp
// predict: Write the eight lines printed.
#include <iostream>
#include <string>
#include <utility>
using namespace std;

class Character {
    string name;
    int count;
    int* skillIds;                             // owns a heap array
public:
    Character(const string& n, int c) : name(n), count(c), skillIds(new int[c])
    {
        for (int i = 0; i < count; ++i) skillIds[i] = 10 * (i + 1);
        cout << "build " << name << endl;
    }
    Character(const Character& other)          // deep copy: a new array
        : name(other.name), count(other.count), skillIds(new int[other.count])
    {
        for (int i = 0; i < count; ++i) skillIds[i] = other.skillIds[i];
        cout << "copy " << name << endl;
    }
    ~Character()
    {
        cout << "free " << name << endl;
        delete[] skillIds;
    }
    void mySwap(Character& first, Character& second)
    {
        using std::swap;
        swap(first.name, second.name);         // every member, one by one
        swap(first.count, second.count);
        swap(first.skillIds, second.skillIds);
    }
    Character& operator=(Character other)      // other BY VALUE: step 1, the copy
    {
        mySwap(*this, other);                  // step 2, the swap
        return *this;
    }                                          // step 3, other dies with the old array
    void learn(int i, int id) { skillIds[i] = id; }
    void print() const
    {
        cout << name << ":";
        for (int i = 0; i < count; ++i) cout << " " << skillIds[i];
        cout << endl;
    }
};

int main()
{
    Character a("Magician", 3);
    Character b("Thief", 2);
    b = a;
    a.learn(0, 99);
    a.print();
    b.print();
    return 0;
}
```

1. `Character a("Magician", 3);` builds a with the array 10 20 30: `build Magician`.
2. `Character b("Thief", 2);` builds b with its own array 10 20: `build Thief`.
3. `b = a;` calls `Character& operator=(Character other)`. The parameter is by value and a is an existing object, so the copy constructor builds `other` with a fresh array: `copy Magician`. That is step 1.
4. `mySwap(*this, other);` exchanges name, count and pointer one by one (step 2). b now owns the new array; other owns the Thief array. When the function returns, other is destroyed (step 3): `free Thief`, and the old array is deleted.
5. `a.learn(0, 99);` changes only a's array: `Magician: 99 20 30`.
6. b has its own deep copy, untouched: `Magician: 10 20 30`.
7. At the end of main, objects die in reverse order of construction. b goes first: `free Magician`.
8. Then a: `free Magician`. Two arrays, two `delete[]`, no double free.

```diagram
{ "type": "grid", "title": "Inside b = a, just after mySwap", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "name", "row": 0, "col": 1 },
  { "id": "h2", "label": "skillIds points at", "row": 0, "col": 2 },
  { "id": "a0", "label": "a", "row": 1, "col": 0 },
  { "id": "a1", "label": "Magician", "row": 1, "col": 1 },
  { "id": "a2", "label": "array 1: 10 20 30", "row": 1, "col": 2 },
  { "id": "b0", "label": "b", "row": 2, "col": 0 },
  { "id": "b1", "label": "Magician", "row": 2, "col": 1 },
  { "id": "b2", "label": "array 3: 10 20 30", "row": 2, "col": 2 },
  { "id": "o0", "label": "other", "row": 3, "col": 0 },
  { "id": "o1", "label": "Thief", "row": 3, "col": 1 },
  { "id": "o2", "label": "array 2: 10 20", "row": 3, "col": 2 }
], "hi": ["o1", "o2"], "caption": "Array 3 was made by the copy constructor for other; the swap moved it into b. other now holds b's old state, and its destructor frees array 2 when operator= returns." }
```

The easy errors, each one line away from the right code:

- **Parameter by reference**, `Character& operator=(Character& other)`: no copy is made, so the swap gives the right-hand object your old data.
- **`std::swap(*this, other)` on the whole object**: the slide's warning, "it uses the copy constructor and the copy assignment operator → recursive spiral". `std::swap` calls `operator=`, which calls `std::swap`, until the stack overflows.
- **A member left out of `mySwap`**: both objects end up with mixed state, for example b's old count with a's array.

```widget
copy-swap
{ "mode": "swap", "predict": true }
```

```quiz
[
  {
    "type": "free",
    "q": "Q16 (3). When we implement the assignment operator, we use the \"copy and swap\" algorithm. How does the \"copy and swap\" algorithm work? Can you identify an easy way to introduce an error into a \"copy and swap\" function?",
    "model": "`MyClass& operator=(MyClass other) { mySwap(*this, other); return *this; }`\n\n1. The parameter is taken **by value**, so the copy constructor makes a local copy of the right-hand side.\n2. `mySwap` exchanges every data member between `*this` and the copy: the left-hand object now holds the new data, the copy holds the old.\n3. The copy is destroyed when the function returns, and its destructor frees the old data.\n\nIt needs a working copy constructor, a swap function and a working destructor. Easy errors: taking the parameter by reference (no copy, so the right-hand object receives the old data), calling `std::swap` on the whole object (it calls `operator=` again: infinite recursion), or leaving a member out of the swap.",
    "points": [
      "The by-value parameter makes the copy through the copy constructor",
      "The swap exchanges every member between `*this` and the copy",
      "The copy's destructor frees the old data when the function returns",
      "Names one easy error: by-reference parameter, `std::swap` on the whole object, or a missing member"
    ],
    "rows": 7,
    "explain": "One mark for the copy (by value, copy constructor), one for the swap and the destruction of the old state, one for a correct easy error with its consequence. The one-line operator at the top of the answer earns its keep: it shows the by-value parameter without a sentence."
  }
]
```

## New variants (if time)

Eight new items in the exam's shapes. Predict on paper first.

```quiz
[
  {
    "q": "Variant 1. What does this program print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\npublic:\n    virtual void hit() const { cout << \"Mob hit\" << endl; }\n    void name() const { cout << \"Mob\" << endl; }\n};\n\nclass Slime : public Mob {\npublic:\n    void hit() const override { cout << \"Slime hit\" << endl; }\n    void name() const { cout << \"Slime\" << endl; }\n};\n\nvoid fight(Mob m) { m.hit(); }\n\nint main() {\n    Slime slime;\n    Mob& m = slime;\n    m.hit();\n    m.name();\n    fight(slime);\n    slime.name();\n}",
    "options": [
      "Slime hit\nMob\nMob hit\nSlime",
      "Slime hit\nSlime\nSlime hit\nSlime",
      "Mob hit\nMob\nMob hit\nSlime",
      "Slime hit\nMob\nSlime hit\nSlime"
    ],
    "answer": 0,
    "explain": "1. `m.hit();`: `m` is a reference to a Slime and `hit` is virtual, so Slime's version runs: `Slime hit`.\n2. `m.name();`: `name` is not virtual, so the reference's type, Mob, decides: `Mob`.\n3. `fight(slime);` passes by value into `Mob m`. The Mob copy constructor copies only the Mob part (slicing), so inside, `m.hit()` is a call on a Mob object: `Mob hit`.\n4. `slime.name();` is called on a Slime object directly: `Slime`."
  },
  {
    "q": "Variant 2. `~Npc` is not virtual here. What does g++ print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc {\npublic:\n    Npc() { cout << \"Npc\" << endl; }\n    ~Npc() { cout << \"~Npc\" << endl; }\n};\n\nclass Grendel : public Npc {\npublic:\n    Grendel() { cout << \"Grendel\" << endl; }\n    ~Grendel() { cout << \"~Grendel\" << endl; }\n};\n\nint main() {\n    Npc* n = new Grendel;\n    delete n;\n    Grendel g;\n}",
    "options": [
      "Npc\nGrendel\n~Npc\nNpc\nGrendel\n~Grendel\n~Npc",
      "Npc\nGrendel\n~Grendel\n~Npc\nNpc\nGrendel\n~Grendel\n~Npc",
      "Npc\nGrendel\n~Npc\n~Grendel\nNpc\nGrendel\n~Grendel\n~Npc",
      "Grendel\nNpc\n~Npc\nGrendel\nNpc\n~Npc\n~Grendel"
    ],
    "answer": 0,
    "explain": "1. `new Grendel` constructs base first, then derived: `Npc`, `Grendel`.\n2. `delete n;` goes through an `Npc*`. The destructor is not virtual, so the pointer's type decides and only `~Npc` runs. This is undefined behaviour; g++ prints `~Npc` and never destroys the Grendel part. Npc has no virtual function here, so g++ does not even warn; the fix is still `virtual ~Npc()` for any class that is deleted through a base pointer (the slide's version: \"if a class contains a virtual function, the destructor should be virtual too\").\n3. `Grendel g;` constructs `Npc`, `Grendel`.\n4. At the end of main, `g` is destroyed in reverse: `~Grendel`, `~Npc`. A destructor called on the object itself never needs `virtual`."
  },
  {
    "q": "Variant 3. `Module` declares `virtual void tick() = 0;` and `Fight : public Module` overrides `tick()`. `f` is a `Fight`. Which line fails to compile?",
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
    "q": "Variant 4. `Module` declares two pure virtual functions, `tick()` and `name()`. `Rest : public Module` overrides only `tick()`. `Rest r;` compiles.",
    "type": "tf",
    "answer": false,
    "explain": "Rest inherits `name()` still marked `= 0`. A derived class is abstract \"unless we override each pure virtual function\", so Rest is abstract and `Rest r;` is the same compile error as `Module m;`. A class below Rest that overrides `name()` would be concrete."
  },
  {
    "q": "Variant 5. No `virtual` inheritance anywhere. What does `Hunt h;` print, construction and destruction?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Module {\npublic:\n    Module() { cout << \"Module\" << endl; }\n    ~Module() { cout << \"~Module\" << endl; }\n};\n\nclass Walk : public Module {\npublic:\n    Walk() { cout << \"Walk\" << endl; }\n    ~Walk() { cout << \"~Walk\" << endl; }\n};\n\nclass Fight : public Module {\npublic:\n    Fight() { cout << \"Fight\" << endl; }\n    ~Fight() { cout << \"~Fight\" << endl; }\n};\n\nclass Hunt : public Walk, public Fight {\npublic:\n    Hunt() { cout << \"Hunt\" << endl; }\n    ~Hunt() { cout << \"~Hunt\" << endl; }\n};\n\nint main() {\n    Hunt h;\n}",
    "options": [
      "Module\nWalk\nModule\nFight\nHunt\n~Hunt\n~Fight\n~Module\n~Walk\n~Module",
      "Module\nWalk\nFight\nHunt\n~Hunt\n~Fight\n~Walk\n~Module",
      "Module\nWalk\nModule\nFight\nHunt\n~Hunt\n~Walk\n~Module\n~Fight\n~Module",
      "Hunt\nWalk\nModule\nFight\nModule\n~Module\n~Fight\n~Module\n~Walk\n~Hunt"
    ],
    "answer": 0,
    "explain": "1. Bases construct in the order written after the colon of `class Hunt : public Walk, public Fight`, each base before its own derived part. Walk first: `Module`, `Walk`.\n2. Then Fight, with its own second Module: `Module`, `Fight`. Two Module lines because plain inheritance gives one Module per path, as in Q27.\n3. Hunt's body: `Hunt`.\n4. Destruction is the exact reverse of the five construction lines: `~Hunt`, `~Fight`, `~Module`, `~Walk`, `~Module`. Ten lines in total. With `virtual public Module` on both middle classes there would be one Module, built first and destroyed last."
  },
  {
    "q": "Variant 6. Module is a virtual base and Hunt's constructor does not name it. What does this program print?",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Module {\nprotected:\n    string name;\npublic:\n    Module() : name(\"unnamed\") { cout << \"Module()\" << endl; }\n    Module(const string& n) : name(n) { cout << \"Module(\" << n << \")\" << endl; }\n};\n\nclass Walk : virtual public Module {\npublic:\n    Walk(const string& n) : Module(n) { cout << \"Walk\" << endl; }\n    void show() const { cout << \"I am \" << name << endl; }\n};\n\nclass Fight : virtual public Module {\npublic:\n    Fight(const string& n) : Module(n) { cout << \"Fight\" << endl; }\n};\n\nclass Hunt : public Walk, public Fight {\npublic:\n    Hunt(const string& n) : Walk(n), Fight(n) { cout << \"Hunt\" << endl; }\n};\n\nint main() {\n    Hunt h(\"Slime hunt\");\n    h.show();\n    Walk w(\"to Olaf\");\n    w.show();\n}",
    "options": [
      "Module()\nWalk\nFight\nHunt\nI am unnamed\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module(Slime hunt)\nWalk\nFight\nHunt\nI am Slime hunt\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module(Slime hunt)\nWalk\nModule(Slime hunt)\nFight\nHunt\nI am Slime hunt\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module()\nWalk\nFight\nHunt\nI am unnamed\nModule()\nWalk\nI am unnamed"
    ],
    "answer": 0,
    "explain": "1. Hunt is the most-derived class, so it constructs the virtual base Module first. Its list `: Walk(n), Fight(n)` does not name Module, so Module's default constructor runs: `Module()`.\n2. Walk's `Module(n)` and Fight's `Module(n)` are disabled while a Hunt is being built: `Walk`, `Fight`.\n3. `Hunt`.\n4. `h.show();` reads the one shared Module, whose name is the default: `I am unnamed`.\n5. `Walk w(\"to Olaf\");` makes Walk the most-derived class this time, so its own `Module(n)` call runs: `Module(to Olaf)`, `Walk`.\n6. `w.show();`: `I am to Olaf`. The fix for the hunt is `Hunt(const string& n) : Module(n), Walk(n), Fight(n)`."
  },
  {
    "q": "Variant 7. The parameter of `operator=` is a reference. What does this program print?",
    "code": "#include <iostream>\n#include <string>\n#include <utility>\nusing namespace std;\n\nclass Character {\n    string name;\npublic:\n    Character(const string& n) : name(n) {}\n    void mySwap(Character& first, Character& second) {\n        using std::swap;\n        swap(first.name, second.name);\n    }\n    Character& operator=(Character& other) {   // by reference: the bug\n        mySwap(*this, other);\n        return *this;\n    }\n    void print() const { cout << name << endl; }\n};\n\nint main() {\n    Character a(\"Magician\");\n    Character b(\"Thief\");\n    b = a;\n    a.print();\n    b.print();\n}",
    "options": [
      "Thief\nMagician",
      "Magician\nMagician",
      "Magician\nThief",
      "Thief\nThief"
    ],
    "answer": 0,
    "explain": "1. `b = a;` binds `other` directly to a: no copy is made.\n2. `mySwap(*this, other);` exchanges b's and a's names: b becomes Magician, a becomes Thief.\n3. `a.print();`: `Thief`. Assignment was never meant to change its right-hand side.\n4. `b.print();`: `Magician`. This is the first easy error of Q16: with `Character other` by value, the copy constructor would make a copy, the copy would take Thief and die, and both lines would print `Magician`."
  },
  {
    "q": "Variant 8. A `Character` whose copy assignment is `Character& operator=(Character other) { std::swap(*this, other); return *this; }`. What happens when `b = a;` runs?",
    "options": [
      "`std::swap` calls `operator=` again, which calls `std::swap` again: the recursion never ends and the program crashes",
      "It works: `std::swap` exchanges the whole object in one step",
      "It does not compile: `std::swap` cannot take a class type",
      "It works but leaks the old data, because no destructor runs"
    ],
    "answer": 0,
    "explain": "1. `b = a;` copies a into `other` and enters `operator=`.\n2. `std::swap(*this, other)` is written with a temporary and assignments: `*this = ...` inside it calls `operator=` again.\n3. That call reaches `std::swap` again, and so on. The slide: \"Don't use std::swap on the ENTIRE object: it uses the copy constructor and the copy assignment operator → recursive spiral.\" On the app's server the program crashes with a stack overflow (exit code 253) at `b = a;`; nothing after that line prints. Swap the members one by one in `mySwap` instead."
  }
]
```
