---
title: "Review 3: the class questions written in three moves (Q1, Q7 to Q12: 24 marks)"
minutes: 40
---
:::quiz What the paper asks and what earns the marks
Seven Part A definitions on the practice midterm: Q1 copy constructor (4), Q7 `const` argument and `const` member function (6), Q8 when the destructor runs (3), Q9 the three initialization forms (4), Q10 `::` vs `.` (2), Q11 class vs struct (2), Q12 forward declaration (3). That is 24 marks, all written answers. The marker looks for three moves in each: the definition in the slide's term, the contrast with the thing it gets confused with, and one line of code that shows it.
:::

**Understand before the exam (cannot be looked up):**

- Which statements call the copy constructor and which call assignment, by reading a line like `b = a;` versus `Mob b = a;`.
- Why a class that owns a pointer needs a deep copy: two objects, one array.
- What `const` after a parameter list promises, and why a `const T&` parameter can only call `const` member functions.
- Where each object dies: scope end, `delete`, the end of a temporary's statement, members after the body, statics last; always in reverse order.
- How a constructor picks its base constructor and in which order members are built.

**On the sheet (look up, do not memorise):**

- The seven model answers, condensed: *Sheet side 1, "C. Definitions in three moves"*.
- Construction and destruction order: *Sheet side 1, "A. Trace rules"*.
- The copy constructor and destructor written out for a real class: *Sheet side 2, "E. Fraction, complete"*.
- A deep-copy constructor: *Sheet side 2, "F. Deep copy, copy-and-swap, abstract, interface, diamond"*.
- The three initialization forms and narrowing: *Sheet side 2, "J. Week 1 syntax"*.

Do if time is short: the three moves, Q1, Q7, Q8 (13 of the 24 marks) and the new variants. Q9 to Q12 and the constructor rules are marked "if time".

## Three moves for every definition

A two- to six-mark definition is marked on facts, not length. Three moves cover every question in this lesson.

```diagram
{ "type": "flow", "title": "How to write a Part A definition", "nodes": [
  { "id": "d", "label": "Define", "sub": "the slide's term" },
  { "id": "c", "label": "Contrast", "sub": "the confused thing" },
  { "id": "x", "label": "Code", "sub": "one line that shows it" }
], "edges": [ { "from": "d", "to": "c" }, { "from": "c", "to": "x" } ], "hi": ["d"], "caption": "Q1 example: the constructor that builds a new object as a copy of an existing one; not used by b = a; (that is assignment); Mob(const Mob& other)." }
```

A "when is it used" question adds a list: name every moment, each with its line of code.

## Q1 (4): the copy constructor

A copy constructor builds a **new** object as a copy of an existing object of the same class. Its signature is `T(const T& other)`.

The slide says "stick with const and & for copy constructor". The `const` lets you copy mutable and immutable objects alike. The `&` stops an infinite loop: a by-value parameter would itself need a copy, which calls the copy constructor, which needs a copy, and so on.

It runs at four moments, all of them a new object made from an old one: `T b(a);`, `T b = a;`, passing by value, and returning by value. The slide words the last one as "returning by value calls the copy constructor". In C++17 the compiler may skip that copy for a returned local and must skip it for a returned temporary; a returned parameter is always copied.

`b = a;` on an existing `b` is not a copy constructor call. It is the assignment operator.

```cpp run pin copy_moments.cpp
// predict: Write every line printed, in order.
#include <iostream>
#include <string>
using namespace std;

class Mob {
    int id;
    string name;
public:
    Mob(int i, const string& n) : id(i), name(n) { cout << "make " << name << endl; }
    Mob(const Mob& other) : id(other.id), name(other.name) { cout << "copy " << name << endl; }
    Mob& operator=(const Mob& other)
    {
        id = other.id;
        name = other.name;
        cout << "assign " << name << endl;
        return *this;
    }
};

Mob pass(Mob m)
{
    return m;
}

int main()
{
    Mob slime(7, "Slime");
    Mob a(slime);
    Mob b = slime;
    b = slime;
    cout << "-- pass" << endl;
    Mob c = pass(slime);
    return 0;
}
```

1. `make Slime`: `Mob slime(7, "Slime");` runs the two-argument constructor.
2. `copy Slime`: `Mob a(slime);` is a new object from an old one.
3. `copy Slime`: `Mob b = slime;` looks like assignment but declares `b`, so it is the copy constructor.
4. `assign Slime`: `b = slime;` changes an object that already exists.
5. `-- pass`: the marker line.
6. `copy Slime`: `Mob c = pass(slime);` passes by value, so the parameter `m` is copied from `slime`.
7. `copy Slime`: `return m;` copies the parameter out. That copy **is** `c`: no third line.

### Shallow copy versus deep copy

The compiler writes a copy constructor for you that copies every member. For a pointer member it copies the address, not the array. That is a **shallow copy**: two objects, one array.

```diagram
{ "type": "grid", "title": "Character warrior and its copy", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "skillIds holds", "row": 0, "col": 1 },
  { "id": "h2", "label": "array it reaches", "row": 0, "col": 2 },
  { "id": "w0", "label": "warrior", "row": 1, "col": 0 },
  { "id": "w1", "label": "0x100", "row": 1, "col": 1 },
  { "id": "w2", "label": "1 2 3 at 0x100", "row": 1, "col": 2 },
  { "id": "s0", "label": "shallow copy", "row": 2, "col": 0 },
  { "id": "s1", "label": "0x100 (same)", "row": 2, "col": 1 },
  { "id": "s2", "label": "the same 1 2 3", "row": 2, "col": 2 },
  { "id": "d0", "label": "deep copy", "row": 3, "col": 0 },
  { "id": "d1", "label": "0x200 (new)", "row": 3, "col": 1 },
  { "id": "d2", "label": "own 1 2 3 at 0x200", "row": 3, "col": 2 }
], "hi": ["s1", "d1"], "caption": "Shallow: a write through the copy changes warrior's array, and both destructors delete[] 0x100 (a double delete). Deep: each object owns its own array." }
```

A **deep copy** allocates a new array and copies the elements into it.

```cpp run pin deep_copy.cpp
// predict: Write the two lines printed.
#include <iostream>
#include <string>
using namespace std;

class Character {
public:
    string name;
    int size;
    int* skillIds;

    Character(const string& n, int s) : name(n), size(s), skillIds(new int[s])
    {
        for (int i = 0; i < size; ++i) skillIds[i] = i + 1;
    }
    Character(const Character& other)
        : name(other.name), size(other.size), skillIds(new int[other.size])
    {
        for (int i = 0; i < size; ++i) skillIds[i] = other.skillIds[i];
    }
    ~Character() { delete[] skillIds; }
};

int main()
{
    Character warrior("Warrior", 3);
    Character copy = warrior;
    copy.skillIds[0] = 9;
    cout << warrior.skillIds[0] << endl;
    cout << copy.skillIds[0] << endl;
    return 0;
}
```

1. `1`: `copy.skillIds[0] = 9;` wrote into the copy's own array, made by `skillIds(new int[other.size])`, so `warrior` still holds 1.
2. `9`: the copy's first element.

Delete the hand-written copy constructor and the program writes 9 into the one shared array, then both destructors run `delete[]` on the same address.

```quiz
[
  {
    "type": "free",
    "q": "Q1 (4). What is a copy constructor? When is it used? Be specific. Code snippets may be used as (an) example(s).",
    "model": "The constructor that builds a **new** object as a copy of an existing object of the same class: `Mob(const Mob& other)`. `const` so const and non-const objects can both be copied; `&` because a by-value parameter would itself need a copy, recursing forever. Used when a new object is initialized from another: `Mob b(a);`, `Mob b = a;`, passing a `Mob` to a function by value, and returning one by value. Not used by `b = a;` when `b` already exists: that is the copy assignment operator. The compiler-generated one copies member by member (a shallow copy); a class that owns a pointer writes its own deep copy that allocates a new array.",
    "points": [
      "New object built as a copy of an existing one of the same class",
      "Signature `T(const T& other)`, with why const and why &",
      "The four moments: T b(a), T b = a, pass by value, return by value",
      "Contrast: b = a on an existing object is the assignment operator",
      "Default copy is shallow; a pointer member needs a deep copy"
    ],
    "rows": 6,
    "explain": "Each point is one checkable fact. The return-by-value moment is the slide's wording; in C++17 the compiler may skip that copy for a returned local and must skip it for a returned temporary, but returning a parameter always copies, which is why `Mob c = pass(slime);` above printed two copy lines and not one or three."
  }
]
```

## Q7 (6): a const parameter and a const member function

Two different `const`s. On a parameter, `void report(const Mob& m)` promises the function will not change the argument. With `&` it also avoids the copy, and callers may pass const objects and temporaries.

After the parameter list, `int getHp() const` makes a **const member function**. The slide: "I promise this function's code will NOT change this object's member variables". Inside it `this` points to const, and the compiler rejects any write to a member.

The two meet here: through a `const Mob&` you may call **only** const member functions.

```cpp run pin const_member.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

class Mob {
    int hp;
public:
    Mob(int h) : hp(h) {}
    int getHp() const { return hp; }
    void hit(int damage) { hp -= damage; }
};

void report(const Mob& m)
{
    cout << "hp " << m.getHp() << endl;
    // m.hit(5);    // error: passing 'const Mob' as 'this' argument discards qualifiers
}

int main()
{
    Mob slime(50);
    const Mob target(80);
    report(slime);
    report(target);
    slime.hit(20);
    report(slime);
    return 0;
}
```

1. `hp 50`: `report(slime);` binds `m` to `slime`; `m.getHp()` is legal because `getHp` is const.
2. `hp 80`: `report(target);` passes a const object, which `const Mob& m` accepts.
3. `hp 30`: `slime.hit(20);` is legal because `slime` itself is not const.

Uncomment `m.hit(5);` and g++ stops with the error in the comment: `hit` is not const, so it cannot run on a const object.

```quiz
[
  {
    "q": "Click the line g++ rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Walk {\n    int steps;\npublic:\n    Walk(int s) : steps(s) {}\n    int getSteps() { return steps; }\n    void add(int n) { steps += n; }\n};\n\nvoid show(const Walk& w)\n{\n    cout << w.getSteps() << endl;\n}\n\nint main()\n{\n    Walk walk(3);\n    walk.add(2);\n    show(walk);\n    return 0;\n}",
    "answer": [14],
    "explain": "1. `show` takes `const Walk& w`, so `w` is const inside it.\n2. `getSteps()` has no `const` after its parameter list, so it might change a member.\n3. Calling it on `w` is refused at that call: `error: passing 'const Walk' as 'this' argument discards qualifiers`.\n4. The fix is one word on the getter: `int getSteps() const { return steps; }`.\n5. `walk.add(2);` in main is fine: `walk` is not const."
  },
  {
    "type": "free",
    "q": "Q7 (6). With respect to the const keyword: a. What is the purpose of making an argument to a function const? b. What is the purpose of adding the const keyword to a function header?",
    "model": "a. A `const` parameter, `void report(const Mob& m)`, promises the function will not modify the argument; the compiler rejects any statement that tries. With a reference it gives no copy plus the safety of pass by value, and lets callers pass const objects and temporaries.\n\nb. `const` after the parameter list, `int getHp() const`, makes a const member function: it promises not to change any data member of the object (`this` points to const), the compiler enforces it, and only const member functions can be called on a const object or through a const reference. Every getter should be const.",
    "points": [
      "a. const parameter: the function cannot modify the argument; compiler-enforced",
      "a. const reference: no copy, and const objects and temporaries can be passed",
      "b. const member function: promises not to change data members",
      "b. inside it `this` is a pointer to const; the compiler rejects writes",
      "b. only const member functions can be called on a const object or const reference",
      "A line of code for each, such as `void report(const Mob& m)` and `int getHp() const`"
    ],
    "rows": 7,
    "explain": "Six marks, three per part. Part b earns its third mark with the consequence: a getter without `const` cannot be called through `const Mob&`, which is exactly the error in the program above."
  }
]
```

## Q8 (3): when the destructor runs

The destructor `~T()` runs automatically when an object's lifetime ends. The slide lists program termination for statics, end of scope, and explicit `delete` / `delete[]`. Two more cases come from the same rule: a temporary dies at the end of the full statement that made it, and members and bases die after the enclosing destructor's body. Objects in one scope die in the reverse order of their construction.

```cpp run pin destructor_timing.cpp
// predict: Write every line printed, in order (16 lines).
#include <iostream>
#include <string>
using namespace std;

class Mob {
    string name;
public:
    Mob(const string& n) : name(n) { cout << "spawn " << name << endl; }
    ~Mob() { cout << "drop " << name << endl; }
};

class Fight {
    Mob target;
public:
    Fight() : target("Slime") { cout << "fight starts" << endl; }
    ~Fight() { cout << "fight ends" << endl; }
};

string look(const Mob&)
{
    return "seen";
}

int main()
{
    static Mob s("S");
    {
        Mob a("A");
    }
    Mob* p = new Mob("B");
    delete p;
    cout << look(Mob("T")) << endl;
    Mob w("W");
    Fight f;
    cout << "end of main" << endl;
    return 0;
}
```

1. `spawn S`: `static Mob s("S");` is built the first time control reaches it.
2. `spawn A`: `Mob a("A");` inside the inner block.
3. `drop A`: the block's closing brace. Scope end.
4. `spawn B`: `Mob* p = new Mob("B");` on the heap.
5. `drop B`: `delete p;`. Without it, B would never be dropped.
6. `spawn T`: the temporary `Mob("T")` is built for the call.
7. `seen`: `look` returns, and the line prints.
8. `drop T`: the temporary dies at the `;` of that statement.
9. `spawn W`: `Mob w("W");`.
10. `spawn Slime`: `Fight f;` builds its member `target` first.
11. `fight starts`: then the `Fight` body.
12. `end of main`.
13. `fight ends`: at `return 0;` the locals die in reverse, `f` first; its body runs before its member.
14. `drop Slime`: the member `target`, after the body.
15. `drop W`: built before `f`, so dropped after it.
16. `drop S`: statics die after `main` returns.

```diagram
{ "type": "flow", "title": "Fight f: built inside out, destroyed outside in", "nodes": [
  { "id": "m1", "label": "spawn Slime", "sub": "member first" },
  { "id": "b1", "label": "fight starts", "sub": "then the body" },
  { "id": "b2", "label": "fight ends", "sub": "body first" },
  { "id": "m2", "label": "drop Slime", "sub": "then the member" }
], "edges": [ { "from": "m1", "to": "b1" }, { "from": "b1", "to": "b2", "label": "scope ends" }, { "from": "b2", "to": "m2" } ], "hi": ["b2"], "caption": "The destructor is the exact reverse of the constructor. A base class sits outside the members: built before them, destroyed after them." }
```

```quiz
[
  {
    "type": "free",
    "q": "Q8 (3). We rarely invoke an object's destructor directly. When is an object's destructor invoked for us (automatically)?",
    "model": "When the object's lifetime ends: when it goes out of scope (the end of the block or function it was declared in, also when an exception unwinds the stack through it); when `delete` (or `delete[]`) is applied to a pointer to a dynamically allocated object; for a temporary, at the end of the full expression that created it; for members and base subobjects, after the enclosing object's destructor body; for static and global objects, when the program ends. Objects in one scope are destroyed in the reverse order of their construction.",
    "points": [
      "Out of scope: end of the block or function",
      "delete or delete[] on a dynamically allocated object",
      "A temporary at the end of its full expression",
      "Members and bases after the enclosing destructor body; statics at program end",
      "Reverse order of construction"
    ],
    "rows": 5,
    "explain": "Three marks: scope end, `delete`, and one more case with the reverse-order rule cover it. The program above shows every case in turn: `drop A` at a brace, `drop B` at `delete p;`, `drop T` at the end of its statement, `drop Slime` after `fight ends`, `drop S` last."
  }
]
```

## Q9 (4): three ways to initialize (if time)

The slide's three forms: C-like `int x = 0;`, constructor `int x(0);`, and uniform (C++11) `int x {0};`. Prefer braces. In the slide's words, "it prohibits implicit narrowing conversion among built-in types".

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

1. `3 3 7`: `int a = speed;` and `int b(speed);` silently drop the .7; `int c{7};` is exact.

Uncomment `int d{3.7};` and the program does not compile. With a variable, `int d{speed};`, the standard still calls it an error, but g++ on the course's flags prints only a narrowing warning; answer the exam with the slide: braces refuse narrowing.

Braces also dodge the "most vexing parse": `Mob m{};` is always an object.

```quiz
[
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
  }
]
```

## Q10 (2): `::` versus `.` and `->` (if time)

`::` is the scope resolution operator. It names something inside a namespace or a class: `std::cout`, a member defined outside its class, a static member. `.` names a member of one particular object. `->` does the same through a pointer.

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
3. `2`: `Walk::trips` names the class's one static counter; both constructors ran `++trips;`.

```quiz
[
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

## Q11 (2): class versus struct (if time)

The slide: "A struct and a class are the same thing in C++. Except when we use the keyword struct, members get public access by default!" Default inheritance follows the same rule.

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
2. `120`: `walk.targetX()` is public and reads the private `target` from inside the class.

```quiz
[
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
  }
]
```

## Q12 (3): forward declaration (if time)

A forward declaration, `class MapDb;`, tells the compiler the name is a class before its definition. The slide's case: a `Car` has `Wheel`s and each `Wheel` points back at its `Car`, so each header would include the other forever.

With only the declaration, the type is **incomplete**: you may declare a pointer or a reference to it, but not an object, because the compiler does not yet know its size.

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

1. `portal 1 in Magic Library`: `MapDb library("Magic Library");` builds a portal with `exit(1, this)`, and `owner->name` works because `Portal::show` is defined after `MapDb` is complete.

```quiz
[
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

## The constructor rules the multiple choice tests (if time)

Four rules from the Week 3 slides:

- `Circle my_circle();` is "a function prototype. MOST VEXING PARSE". `Circle my_circle;` and `Circle my_circle{};` call the default constructor.
- Members are initialized "by the order of member declaration and not by the order of their appearance in member initialization list".
- Write any constructor and the compiler no longer supplies a default one.
- A derived constructor names its base constructor in its initializer list, `Derived(int a) : Base(a)`; otherwise `Base()` runs.

```cpp run pin ctor_rules.cpp
// predict: Write every line printed, in order (7 lines).
#include <iostream>
#include <string>
using namespace std;

class Npc {
public:
    Npc() { cout << "Npc()" << endl; }
    Npc(int id) { cout << "Npc(" << id << ")" << endl; }
};

class Grendel : public Npc {
public:
    Grendel(int id) : Npc(id) { cout << "Grendel" << endl; }
};

class Olaf : public Npc {
public:
    Olaf(const string& town) { cout << "Olaf in " << town << endl; }
};

class Step {
public:
    Step(const string& s) { cout << "Step " << s << endl; }
};

class Talk {
    Step first;
    Step second;
public:
    Talk() : second("second"), first("first") { cout << "Talk" << endl; }
};

int main()
{
    Grendel g(313);
    Olaf o("Lith Harbor");
    // Olaf none;      // error: no matching function for call to 'Olaf::Olaf()'
    Talk t;
    return 0;
}
```

1. `Npc(313)`: `Grendel(int id) : Npc(id)` picks the base constructor; the base runs first.
2. `Grendel`: then the derived body.
3. `Npc()`: `Olaf(const string& town)` names no base constructor, so `Npc()` runs.
4. `Olaf in Lith Harbor`: then the body.
5. `Step first`: `Step first;` is declared first, so it is built first, even though the list names `second("second")` first.
6. `Step second`.
7. `Talk`: the body after all members.

The compile also prints a `-Wreorder` warning about that list. `Olaf none;` stays commented out: `Olaf` wrote a constructor, so it has no default one.

## New variants in the exam's shapes

```quiz
[
  {
    "q": "What prints? This `Character` has no copy constructor and no destructor.",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Character {\npublic:\n    int* skillIds;\n    Character() : skillIds(new int[3]{1, 2, 3}) {}\n};\n\nint main() {\n    Character mage;\n    Character copy = mage;\n    copy.skillIds[0] = 9;\n    cout << mage.skillIds[0] << \" \" << copy.skillIds[0] << endl;\n    delete[] mage.skillIds;\n    return 0;\n}",
    "options": ["9 9", "1 9", "1 1", "9 1"],
    "answer": 0,
    "explain": "1. `Character copy = mage;` uses the compiler's copy constructor, which copies each member.\n2. The member is a pointer, so `copy.skillIds` holds the same address as `mage.skillIds`: one array, two names.\n3. `copy.skillIds[0] = 9;` writes into that shared array.\n4. Both reads see 9: `9 9`.\n5. A deep copy (`new int[3]` plus a loop) would print `1 9`."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\npublic:\n    Mob() {}\n    Mob(const Mob&) { cout << \"copy\" << endl; }\n    Mob& operator=(const Mob&) { cout << \"assign\" << endl; return *this; }\n};\n\nvoid hunt(Mob) {}\nvoid look(const Mob&) {}\n\nint main() {\n    Mob slime;\n    hunt(slime);\n    look(slime);\n    Mob other = slime;\n    other = slime;\n    return 0;\n}",
    "options": ["copy\ncopy\nassign", "copy\ncopy\ncopy\nassign", "copy\nassign\nassign", "copy\nassign"],
    "answer": 0,
    "explain": "1. `hunt(slime);` passes by value: the parameter is a new object, `copy`.\n2. `look(slime);` passes by reference: no new object, nothing prints.\n3. `Mob other = slime;` declares a new object: `copy`.\n4. `other = slime;` changes an existing object: `assign`.\n5. Three lines: copy, copy, assign."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\n    char tag;\npublic:\n    Mob(char t) : tag(t) { cout << \"+\" << tag; }\n    ~Mob() { cout << \"-\" << tag; }\n};\n\nint main() {\n    Mob a('a');\n    {\n        Mob b('b');\n        Mob c('c');\n    }\n    Mob d('d');\n    cout << \"|\";\n    return 0;\n}",
    "options": ["+a+b+c-c-b+d|-d-a", "+a+b+c-b-c+d|-a-d", "+a+b+c+d|-d-c-b-a", "+a+b+c-c-b+d-d|-a"],
    "answer": 0,
    "explain": "1. `+a`, then `+b +c` in the inner block.\n2. The inner closing brace destroys its objects in reverse: `-c -b`.\n3. `+d`, then `|`.\n4. The end of `main` destroys the rest in reverse: `d` was built after `a`, so `-d -a`.\n5. All on one line: `+a+b+c-c-b+d|-d-a`."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc {\npublic:\n    Npc() { cout << \"Npc()\" << endl; }\n    Npc(int id) { cout << \"Npc \" << id << endl; }\n};\n\nclass Grendel : public Npc {\npublic:\n    Grendel(int id) { cout << \"Grendel \" << id << endl; }\n};\n\nint main() {\n    Grendel g(313);\n    return 0;\n}",
    "options": ["Npc()\nGrendel 313", "Npc 313\nGrendel 313", "Grendel 313", "Grendel 313\nNpc()"],
    "answer": 0,
    "explain": "1. The base is always built before the derived body.\n2. `Grendel(int id)` has no initializer list, so it does not name `Npc(id)`, and `Npc()` runs: `Npc()`.\n3. Then the body: `Grendel 313`.\n4. To get `Npc 313`, write `Grendel(int id) : Npc(id)`."
  },
  {
    "q": "Inside `main`, what does the line `Mob slime();` do?",
    "options": [
      "Declares a function named `slime` that takes no arguments and returns a `Mob`",
      "Creates a `Mob` named `slime` with the default constructor",
      "Creates a `Mob` named `slime` with every member set to zero",
      "Does not compile"
    ],
    "answer": 0,
    "explain": "1. Anything that can be read as a function declaration is read as one.\n2. `Mob slime();` fits the shape `ReturnType name(parameters);`, so it declares a function: the slide's MOST VEXING PARSE.\n3. It compiles (g++ adds a warning), but no object exists, so any later use of `slime` as a `Mob` fails.\n4. Write `Mob slime;` or `Mob slime{};` for the default constructor."
  },
  {
    "q": "True or false: a `struct` cannot have private members or member functions; only a `class` can.",
    "type": "tf",
    "answer": false,
    "explain": "1. The only difference is the default: `struct` members are public until a `private:` label, `class` members are private until a `public:` label.\n2. A struct can have constructors, member functions, `private:` sections and base classes.\n3. The same default applies to inheritance: `struct D : B` is public, `class D : B` is private."
  },
  {
    "q": "Only `class MapDb;` has been seen; the definition of `MapDb` comes later. Which members can `class Portal` declare now? Select all that compile.",
    "options": ["`MapDb* owner;`", "`MapDb& owner;`", "`MapDb db;`", "`MapDb maps[2];`"],
    "answer": [0, 1],
    "explain": "1. After `class MapDb;` the type is incomplete: its size is unknown.\n2. A pointer and a reference have a known size, so `MapDb* owner;` and `MapDb& owner;` compile.\n3. `MapDb db;` and `MapDb maps[2];` need the size of a `MapDb`, so g++ says `field 'db' has incomplete type 'MapDb'`.\n4. That is why the slide's Wheel holds `Car *owner; // Must be pointer or reference`."
  }
]
```
