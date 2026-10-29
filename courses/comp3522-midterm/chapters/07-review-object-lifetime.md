---
title: "Review 1: tracing constructors, destructors and copies (Q20, Q27, Q28 and the review programs: about 15 marks plus MC)"
minutes: 60
---
:::quiz What the paper asks and what earns the marks
Q20 (7 marks), Q27 (4) and Q28 (4) each print a program and ask "What is printed to standard output by this code?", with the line count as a hint: 14, 14 and 12 lines. Q28 adds "Explain in 1 sentence why the output is different from the output in question 27." The review lecture re-posted Q20 and a Parent/Child program, so a copy trace and a virtual-destructor or slicing trace are the likeliest Part B questions, and the same rules feed several multiple-choice items. The marker compares your lines with the real output in order: every line is a constructor or destructor message, so a missing copy or a swapped destructor costs a line.
:::

**Understand before the exam (cannot be looked up):**

- Each statement in `main` either creates an object (a constructor line), makes a copy (a copy-constructor line), or creates nothing. Read every statement and ask which.
- A by-value parameter is a new object; a reference parameter is the caller's object under another name.
- Every object built is destroyed exactly once, in reverse order of construction. Count constructions and destructions: they must match.
- A derived object is built from the inside out (bases, then members, then the body) and torn down from the outside in.
- A virtual base is built once, first, by the most-derived class.
- A `Parent` parameter or variable holds only a `Parent`, even when you hand it a `Child`.

**On the sheet (look up, do not memorise):**

- The count-by-rule table, the order rules and the Q20 fourteen lines: *Sheet side 1, "A. Trace rules"*.
- The three moments the copy constructor runs and the elision cases: *Sheet side 2, "I. Static, copy elision"*.
- The Q1 (copy constructor) and Q8 (destructor) definitions: *Sheet side 1, "C. Definitions in three moves"*.

Do if time is short: "One object, two lines", "The rules as a table", Q20, Q27 and Q28. The rest are marked "if time".

## One object, two lines

A constructor is the member function that runs when an object is created. A destructor, written `~Mob()`, runs when the object is destroyed. Neither is called by name in `main`: the compiler inserts the calls. In every exam program each of them prints a line, so the output is a record of objects being born and dying.

```cpp run pin slime.cpp
// predict: Write every line printed. Which line does the closing brace of the inner block print?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    int id;
    string name;
public:
    Mob(int id, const string& name) : id(id), name(name) { cout << name << " spawned" << endl; }
    ~Mob() { cout << name << " died" << endl; }
};

int main()
{
    cout << "enter map" << endl;
    {
        Mob slime(7, "Slime");
        cout << "fighting" << endl;
    }
    cout << "leave map" << endl;
}
```

1. `cout << "enter map" << endl;` prints `enter map`.
2. `Mob slime(7, "Slime");` creates an object, so the constructor prints `Slime spawned`.
3. `cout << "fighting" << endl;` prints `fighting`.
4. The inner block's closing `}` ends the scope of `slime`. Its destructor prints `Slime died`. Nothing in the code says so; the brace is the call.
5. `cout << "leave map" << endl;` prints `leave map`.

The slide's words for the destructor: a "member function automatically called before the object is destroyed", invoked when the lifetime ends: "program termination (statics), end of scope, explicit `delete` / `delete[]`".

## The rules as a table

Every row below is a rule you apply to one statement. `A` is any class whose constructors and destructor print.

| You write | Constructor line(s) | Destructor line(s) |
|---|---|---|
| `A a;` | default constructor | one, when `a`'s scope ends |
| `A b = a;` or `A b(a);` | copy constructor (a new object made from `a`) | one, when `b`'s scope ends |
| `b = a;` (both already exist) | none: this is the assignment operator | none |
| `f(a)` with `void f(A x)` (by value) | one copy at the call, into `x` | one, when the function returns |
| `f(a)` with `void f(A& x)` or `const A&` | none | none |
| `return input;` where `input` is a parameter | one copy into the return value (never elided) | that copy dies later (next rows) |
| `A y = f(a);` | none extra: the return value **is** `y` | `y`'s, at its scope end |
| `f(a);` with the result unused | the return copy, as above | the returned temporary at the `;`, then the parameter |
| a derived object `D d;` | base constructor, then members in declaration order, then the body | the exact reverse |
| `class E : public C, public D` | bases in the order written after the colon | the reverse |
| a virtual base | constructed once, first, by the most-derived class | last |
| `Base* p = new Derived; delete p;` | Base, then Derived | virtual destructor: Derived, then Base. Not virtual: Base only |
| `Base b = derived;` or `void f(Base b)` called with a Derived | the **Base** copy constructor (slicing) | only the Base destructor |

The Week 7 slide lists the three moments the copy constructor runs: "When invoking the copy constructor directly", "When passing an object by value to a function", "When returning an object by value from a function". It adds that copy elision "may be used by some compilers to eliminate a temporary object". The real rules: a returned parameter is never elided, so it is always copied; since C++17 the function's result initializing a new variable (`A y = f(a);`) is always built straight into that variable; and a returned named local (`return local;`) may be built straight into the caller's variable too (named return value optimization), which g++ does, so no copy line prints.

```diagram
{ "type": "flow", "title": "Building one derived object", "nodes": [
  { "id": "v", "label": "Virtual bases", "sub": "once, by the most-derived" },
  { "id": "b", "label": "Other bases", "sub": "in the order after the colon" },
  { "id": "m", "label": "Members", "sub": "in declaration order" },
  { "id": "y", "label": "Body", "sub": "the constructor's own line" }
], "edges": [ { "from": "v", "to": "b" }, { "from": "b", "to": "m" }, { "from": "m", "to": "y" } ], "hi": ["y"], "caption": "Each base is itself built this way, base first. Destruction runs the arrows backwards: the destructor body, members in reverse, bases in reverse, the virtual base last." }
```

One substituted example. The `Mob` below prints `spawn`, `copy` and `despawn` with its name. Apply one row of the table per statement before you run it.

```cpp run pin copies.cpp
// predict: Write all 9 lines. Which statement prints nothing of its own?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    string name;
public:
    Mob(const string& name) : name(name) { cout << "spawn " << name << endl; }
    Mob(const Mob& other) : name(other.name) { cout << "copy " << name << endl; }
    ~Mob() { cout << "despawn " << name << endl; }
    const string& getName() const { return name; }
};

void fight(Mob target)
{
    cout << "fight " << target.getName() << endl;
}

void look(const Mob& target)
{
    cout << "look " << target.getName() << endl;
}

int main()
{
    Mob slime("Slime");
    Mob twin = slime;
    twin = slime;
    fight(slime);
    look(slime);
    cout << "end of main" << endl;
}
```

1. `Mob slime("Slime");` is a new object: `spawn Slime`.
2. `Mob twin = slime;` declares a new object from an existing one, so the copy constructor runs: `copy Slime`. The `=` here is initialization, not assignment.
3. `twin = slime;` changes an object that already exists. That is the assignment operator, which prints nothing here.
4. `fight(slime);` passes by value, so `Mob target` is copy constructed: `copy Slime`.
5. The body prints `fight Slime`.
6. `fight` returns and `target` dies: `despawn Slime`.
7. `look(slime);` takes `const Mob& target`: no new object. The body prints `look Slime`.
8. `end of main`.
9. The closing brace destroys `twin`, then `slime`, the reverse of construction: `despawn Slime` twice.

Check: 3 constructions (1 spawn, 2 copies), 3 destructions. g++ also warns that the implicit assignment operator is deprecated when a class writes its own copy constructor; the warning does not change the output.

## Q20, worked

Q20 (7). "What is printed to standard output by this code? HINT: this prints 14 lines."

```cpp run pin q20.cpp
// predict: Write all 14 lines in order. Count the copies: by-value parameter, by-value return, two declarations.
#include <iostream>

using namespace std;

class A
{
public:
    A() { cout << "Default constructor!" << endl; }
    ~A() { cout << "Destructor!" << endl; }
    A(const A&) { cout << "Copy constructor!" << endl;}
};

A foo(A input)
{
    cout << "Look ma, I'm fooing!" << endl;
    return input;
}

int main()
{
    A littleA;
    foo(littleA);
    A anotherA = littleA;
    A yetAnotherA = foo(littleA);
}
```

1. `A littleA;` runs the default constructor: `Default constructor!`.
2. `foo(littleA);` copies the argument into the by-value parameter of `A foo(A input)`: `Copy constructor!`.
3. The body prints `Look ma, I'm fooing!`.
4. `return input;` copies the parameter into the returned temporary: `Copy constructor!`. A parameter is never elided into the return value.
5. The statement ends at its `;` and nobody kept the result, so the temporary dies: `Destructor!`.
6. Then `input` dies: `Destructor!`. (g++ destroys the temporary first; both lines read the same, so the order cannot show.)
7. `A anotherA = littleA;` is a new object from an existing one: `Copy constructor!`.
8. `A yetAnotherA = foo(littleA);` first copies into `input`: `Copy constructor!`.
9. The body: `Look ma, I'm fooing!`.
10. `return input;` copies again: `Copy constructor!`. This copy **is** `yetAnotherA`; no further copy into it.
11. `input` dies when the statement ends: `Destructor!`.
12. The closing brace of `main` destroys `yetAnotherA`: `Destructor!`.
13. Then `anotherA`: `Destructor!`.
14. Then `littleA`: `Destructor!`.

Tally: 1 default, 5 copies, 2 fooing lines, 6 destructors = 14. Six objects were made (1 + 5), six destroyed. The review copy of this program adds a `cout << endl;` after each statement in `main`, giving the same 14 lines with four blank ones between the groups.

```widget
lifetime-trace
{"program": "#include <iostream>\n\nusing namespace std;\n\nclass A\n{\npublic:\n    A() { cout << \"Default constructor!\" << endl; }\n    ~A() { cout << \"Destructor!\" << endl; }\n    A(const A&) { cout << \"Copy constructor!\" << endl;}\n};\n\nA foo(A input)\n{\n    cout << \"Look ma, I'm fooing!\" << endl;\n    return input;\n}\n\nint main()\n{\n    A littleA;\n    foo(littleA);\n    A anotherA = littleA;\n    A yetAnotherA = foo(littleA);\n}", "presets": false}
```

## Q27 and Q28, worked

Q27 (4). "What is printed to standard output by this code? HINT: this prints 14 lines."

```cpp run pin q27.cpp
// predict: Write all 14 lines. How many times is A constructed?
#include <iostream>
class A
{
public:
    A() { std::cout << "A allocated" << std::endl; }
    ~A() { std::cout << "A deallocated" << std::endl; } };

class B : public A
{
public:
    B() { std::cout << "B allocated" << std::endl; }
    ~B() { std::cout << "B deallocated" << std::endl; } };

class C : public B
{
public:
    C() { std::cout << "C allocated" << std::endl; }
    ~C() { std::cout << "C deallocated" << std::endl; } };

class D : public B
{
public:
    D() { std::cout << "D allocated" << std::endl; }
    ~D() { std::cout << "D deallocated" << std::endl; } };

class E : public C, public D
{
public:
    E() { std::cout << "E allocated" << std::endl; }
    ~E() { std::cout << "E deallocated" << std::endl; } };

int main()
{
    E e;
}
```

Draw the object before you write a line. Nothing is virtual, so each base brings its whole chain with it.

```diagram
{ "type": "tree", "title": "Q27: the subobjects inside E e", "nodes": [
  { "id": "e", "label": "E" },
  { "id": "c", "label": "C", "parent": "e" },
  { "id": "d", "label": "D", "parent": "e" },
  { "id": "b1", "label": "B", "sub": "C's own", "parent": "c" },
  { "id": "b2", "label": "B", "sub": "D's own", "parent": "d" },
  { "id": "a1", "label": "A", "sub": "under C's B", "parent": "b1" },
  { "id": "a2", "label": "A", "sub": "under D's B", "parent": "b2" }
], "hi": ["a1", "a2"], "caption": "Two complete A-B chains: seven subobjects, seven constructor lines, seven destructor lines." }
```

1. `class E : public C, public D` lists C first, so the C chain is built first, base first: `A allocated`.
2. `B allocated`.
3. `C allocated`.
4. Then the D chain, with its own A: `A allocated`.
5. `B allocated`.
6. `D allocated`.
7. All bases done, E's body: `E allocated`.
8. `E e;` dies at the end of `main`. Reverse order starts with E's body: `E deallocated`.
9. D was built last, so it goes first: `D deallocated`.
10. D's B: `B deallocated`.
11. D's A: `A deallocated`.
12. Then the C chain: `C deallocated`.
13. `B deallocated`.
14. `A deallocated`.

Q28 (4). Same classes except `class B : virtual public A` and `class C : virtual public B`. "Hint: this prints 12 lines. Explain in 1 sentence why the output is different from the output in question 27."

```cpp run pin q28.cpp
// predict: Write all 12 lines. Which two lines of Q27 disappear?
#include <iostream>
class A
{
public:
    A() { std::cout << "A allocated" << std::endl; }
    ~A() { std::cout << "A deallocated" << std::endl; } };

class B : virtual public A
{
public:
    B() { std::cout << "B allocated" << std::endl; }
    ~B() { std::cout << "B deallocated" << std::endl; } };

class C : virtual public B
{
public:
    C() { std::cout << "C allocated" << std::endl; }
    ~C() { std::cout << "C deallocated" << std::endl; } };

class D : public B
{
public:
    D() { std::cout << "D allocated" << std::endl; }
    ~D() { std::cout << "D deallocated" << std::endl; } };

class E : public C, public D
{
public:
    E() { std::cout << "E allocated" << std::endl; }
    ~E() { std::cout << "E deallocated" << std::endl; } };

int main()
{
    E e;
}
```

```quiz
[
  {
    "type": "free",
    "q": "Q28's second part: explain in one sentence why the output is different from Q27's.",
    "model": "Because `B` inherits `A` virtually, there is only one shared `A` in `E`, constructed once (first) by the most-derived class `E` instead of once per `B`, so one `A allocated` and one `A deallocated` disappear (14 lines become 12).",
    "points": ["names virtual inheritance of A (`class B : virtual public A`)", "only one shared A subobject", "constructed once, by the most-derived class E", "one A allocated and one A deallocated fewer: 12 lines"],
    "rows": 3,
    "explain": "In Q27 each B carried its own A, so A appeared twice. Making A a virtual base of B means every B in E points at the same single A, and E builds it before anything else. D's B is still an ordinary base, so B still appears twice; only A is shared."
  }
]
```

The picture now has one A that every B shares, and two Bs: C's virtual one and D's ordinary one.

```diagram
{ "type": "tree", "title": "Q28: the subobjects inside E e", "nodes": [
  { "id": "e", "label": "E" },
  { "id": "a", "label": "A", "sub": "virtual, shared", "parent": "e" },
  { "id": "bv", "label": "B", "sub": "virtual, C's", "parent": "e" },
  { "id": "c", "label": "C", "parent": "e" },
  { "id": "d", "label": "D", "parent": "e" },
  { "id": "b2", "label": "B", "sub": "D's own", "parent": "d" }
], "hi": ["a"], "caption": "Virtual bases hang off the most-derived class E, which builds them first: A, then C's B. Both Bs use the one A. Six subobjects, twelve lines." }
```

1. Virtual bases come first, built by E. The shared A: `A allocated`.
2. C's virtual B: `B allocated`.
3. Now the ordinary bases in the order written. C's B is already built: `C allocated`.
4. D's B is ordinary, so D builds it (its A is the shared one, already built): `B allocated`.
5. `D allocated`.
6. `E allocated`.
7. Reverse: `E deallocated`.
8. `D deallocated`.
9. D's own B: `B deallocated`.
10. `C deallocated`.
11. The virtual B: `B deallocated`.
12. The shared A, built first, dies last: `A deallocated`.

g++ also warns `virtual base 'B' inaccessible in 'E' due to ambiguity`: E has two Bs, so the name `B` is ambiguous inside E. It is only a warning; the 12 lines print.

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": false, "init": "most" }
```

The widget's person, student, mathematician and math_student play B, C, D and E: C inherits B virtually and D does not, so there is one shared B plus a second B inside D, exactly Q28's two Bs. Q28's single A, shared by both Bs, is not drawn.

## The Parent and Child program, worked (if time)

The review code's `ParentChild` program has a `struct Parent` with a virtual destructor, a `struct Child : public Parent`, and two functions taking a `Parent` by value and by reference. Here its third experiment is switched on.

```cpp run pin ParentChild-value.cpp
// predict: The third experiment of the review program is switched on. Write all 8 lines.
#include <iostream>
using namespace std;
struct Parent
{
    Parent() { cout << "Parent default constructor.\n"; }
    Parent(const Parent&) { cout << "A Parent copy was made.\n"; }
    virtual ~Parent() {cout << "Parent destructor.\n"; }
};

struct Child : public Parent
{
    Child() { cout << "Child default constructor.\n"; }
    Child(const Child&) { cout << "A Child copy was made.\n"; }
    ~Child() {cout << "Child destructor.\n"; }
};

void passByValue(Parent p) {
    cout << "in passByValue" << endl;
}

void passByReference(Parent &p) {
    cout << "in passByReference" << endl;
}

int main()
{
    //examine constructor/destructor calls when passing by value or reference in functions
    Child c;
    passByValue(c);
    passByReference(c);

    return 0;
}
```

1. `Child c;` builds the base part first: `Parent default constructor.`
2. Then Child's body: `Child default constructor.`
3. `passByValue(c);` must make a new `Parent p`. A Parent can only hold a Parent, so Parent's copy constructor copies c's Parent part: `A Parent copy was made.` This is slicing; Child's copy constructor never runs.
4. The body: `in passByValue`.
5. `p` dies as the function returns. It is a plain Parent: `Parent destructor.`
6. `passByReference(c);` binds `p` to c itself, no object: `in passByReference`.
7. `return 0;` ends `main`, and c dies, derived part first: `Child destructor.`
8. `Parent destructor.`

`Parent saved = c;` would slice the same way: one `A Parent copy was made.` and, later, one `Parent destructor.` for it.

Now the second experiment, with `virtual` removed from `~Parent`.

```cpp run pin ParentChild-nonvirtual.cpp
// predict: Parent's destructor is NOT virtual here. Write every line g++ prints.
#include <iostream>
using namespace std;
struct Parent
{
    Parent() { cout << "Parent default constructor.\n"; }
    Parent(const Parent&) { cout << "A Parent copy was made.\n"; }
    ~Parent() {cout << "Parent destructor.\n"; }
};

struct Child : public Parent
{
    Child() { cout << "Child default constructor.\n"; }
    Child(const Child&) { cout << "A Child copy was made.\n"; }
    ~Child() {cout << "Child destructor.\n"; }
};

int main()
{
    //examine constructor/destructor calls if parent does NOT have virtual destructor
    Parent *pPtr = new Child;
    delete pPtr;

    return 0;
}
```

1. `Parent *pPtr = new Child;` builds a whole Child on the heap, base first: `Parent default constructor.`
2. `Child default constructor.`
3. `delete pPtr;` calls the destructor through a `Parent*`. `~Parent()` is not virtual, so the call is decided by the pointer's type, not the object's: `Parent destructor.` and nothing else.

`Child destructor.` never prints. The standard calls this undefined behaviour; the three lines are what g++ does. With `virtual ~Parent()` the same `main` prints four lines: Parent and Child constructors, then `Child destructor.` and `Parent destructor.`, exactly like a `Child c;` on the stack. The Week 3 rule: "if a class contains a virtual function, the destructor should be virtual too".

## New variants

Each program below is new. Write the output on paper first, count constructions against destructions, then choose.

One of them counts objects with `static int alive;`. A static data member is one variable shared by every object of the class, so each constructor's `++alive` and each destructor's `--alive` change the same count.

```quiz
[
  {
    "q": "A base and two members. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Module { public: Module() { cout << \"Module\" << endl; } ~Module() { cout << \"~Module\" << endl; } };\nclass Walk { public: Walk() { cout << \"Walk\" << endl; } ~Walk() { cout << \"~Walk\" << endl; } };\nclass Fight { public: Fight() { cout << \"Fight\" << endl; } ~Fight() { cout << \"~Fight\" << endl; } };\n\nclass Engine : public Module\n{\n    Walk walk;\n    Fight fight;\npublic:\n    Engine() { cout << \"Engine\" << endl; }\n    ~Engine() { cout << \"~Engine\" << endl; }\n};\n\nint main()\n{\n    Engine engine;\n}",
    "options": [
      "Module\nWalk\nFight\nEngine\n~Engine\n~Fight\n~Walk\n~Module",
      "Walk\nFight\nModule\nEngine\n~Engine\n~Module\n~Fight\n~Walk",
      "Module\nWalk\nFight\nEngine\n~Module\n~Walk\n~Fight\n~Engine",
      "Engine\nModule\nWalk\nFight\n~Fight\n~Walk\n~Module\n~Engine"
    ],
    "answer": 0,
    "explain": "1. `Engine engine;` starts with the base: `Module`. 2. Then the members in declaration order, `Walk walk;` before `Fight fight;`: `Walk`, `Fight`. 3. Then the body: `Engine`. 4. At the end of `main` the exact reverse: the body `~Engine`, members in reverse `~Fight`, `~Walk`, the base last `~Module`. Four up, four down."
  },
  {
    "q": "A function that returns a local. What does g++ print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Route\n{\npublic:\n    Route() { cout << \"Route()\" << endl; }\n    Route(const Route&) { cout << \"Route(copy)\" << endl; }\n    ~Route() { cout << \"~Route\" << endl; }\n};\n\nRoute buildRoute()\n{\n    Route r;\n    cout << \"route generated\" << endl;\n    return r;\n}\n\nint main()\n{\n    Route route = buildRoute();\n    cout << \"questing\" << endl;\n}",
    "options": [
      "Route()\nroute generated\nquesting\n~Route",
      "Route()\nroute generated\nRoute(copy)\n~Route\nquesting\n~Route",
      "Route()\nroute generated\nRoute(copy)\nquesting\n~Route\n~Route",
      "route generated\nRoute()\nquesting\n~Route"
    ],
    "answer": 0,
    "explain": "Real output, four lines. 1. `Route r;` inside `buildRoute`: `Route()`. 2. `route generated`. 3. `return r;` returns a named local, and g++ builds `r` directly in `route` (named return value optimization), so no copy and no early destructor. 4. `questing`. 5. `route` dies at the end of `main`: `~Route`. The slide says returning by value calls the copy constructor and that some compilers may eliminate it; NRVO is that optional elimination, and g++ does it. Contrast Q20, where the returned object is a parameter and is always copied."
  },
  {
    "q": "The engine ticks by reference and snapshots by value. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Engine\n{\npublic:\n    Engine() { cout << \"Engine()\" << endl; }\n    Engine(const Engine&) { cout << \"Engine(copy)\" << endl; }\n    ~Engine() { cout << \"~Engine\" << endl; }\n};\n\nvoid tick(Engine&)\n{\n    cout << \"tick\" << endl;\n}\n\nvoid snapshot(Engine)\n{\n    cout << \"snapshot\" << endl;\n}\n\nint main()\n{\n    Engine engine;\n    for (int i = 0; i < 2; i++)\n        tick(engine);\n    snapshot(engine);\n    cout << \"unload\" << endl;\n}",
    "options": [
      "Engine()\ntick\ntick\nEngine(copy)\nsnapshot\n~Engine\nunload\n~Engine",
      "Engine()\nEngine(copy)\ntick\n~Engine\nEngine(copy)\ntick\n~Engine\nEngine(copy)\nsnapshot\n~Engine\nunload\n~Engine",
      "Engine()\ntick\ntick\nsnapshot\nunload\n~Engine",
      "Engine()\ntick\ntick\nEngine(copy)\nsnapshot\nunload\n~Engine\n~Engine"
    ],
    "answer": 0,
    "explain": "1. `Engine engine;`: `Engine()`. 2. The loop calls `tick(engine)` twice; `Engine&` makes no object, so just `tick`, `tick`. 3. `snapshot(engine)` takes `Engine` by value: `Engine(copy)`, then `snapshot`. 4. The parameter dies when `snapshot` returns, before the next statement: `~Engine`. 5. `unload`. 6. `engine` dies at the end of `main`: `~Engine`. Two objects, two destructors."
  },
  {
    "q": "`Npc* n = new Grendel; delete n;` with a virtual destructor. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc\n{\npublic:\n    Npc() { cout << \"Npc()\" << endl; }\n    virtual ~Npc() { cout << \"~Npc\" << endl; }\n};\n\nclass Grendel : public Npc\n{\npublic:\n    Grendel() { cout << \"Grendel()\" << endl; }\n    ~Grendel() { cout << \"~Grendel\" << endl; }\n};\n\nint main()\n{\n    Npc* n = new Grendel;\n    cout << \"talk\" << endl;\n    delete n;\n    cout << \"done\" << endl;\n}",
    "options": [
      "Npc()\nGrendel()\ntalk\n~Grendel\n~Npc\ndone",
      "Npc()\nGrendel()\ntalk\n~Npc\ndone",
      "Grendel()\nNpc()\ntalk\n~Npc\n~Grendel\ndone",
      "Npc()\nGrendel()\ntalk\ndone\n~Grendel\n~Npc"
    ],
    "answer": 0,
    "explain": "1. `new Grendel` builds the base first: `Npc()`, then `Grendel()`. 2. `talk`. 3. `delete n;` goes through an `Npc*`, but `~Npc` is virtual, so the call reaches the real type: `~Grendel`, then the base `~Npc`. 4. `done`. A heap object dies at `delete`, not at the end of `main`, so nothing prints after `done`."
  },
  {
    "q": "The same program with `virtual` removed from `~Npc`. What does g++ print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc\n{\npublic:\n    Npc() { cout << \"Npc()\" << endl; }\n    ~Npc() { cout << \"~Npc\" << endl; }\n};\n\nclass Grendel : public Npc\n{\npublic:\n    Grendel() { cout << \"Grendel()\" << endl; }\n    ~Grendel() { cout << \"~Grendel\" << endl; }\n};\n\nint main()\n{\n    Npc* n = new Grendel;\n    cout << \"talk\" << endl;\n    delete n;\n    cout << \"done\" << endl;\n}",
    "options": [
      "Npc()\nGrendel()\ntalk\n~Npc\ndone",
      "Npc()\nGrendel()\ntalk\n~Grendel\n~Npc\ndone",
      "Npc()\ntalk\n~Npc\ndone",
      "Npc()\nGrendel()\ntalk\n~Grendel\ndone"
    ],
    "answer": 0,
    "explain": "1. Construction is unchanged: `Npc()`, `Grendel()`. 2. `talk`. 3. `delete n;` with a non-virtual destructor is decided by the pointer's type, `Npc*`, so only `~Npc` runs and `~Grendel` is skipped (undefined behaviour; this is what g++ prints). 4. `done`. Five lines, one destructor short of the constructors: the warning sign."
  },
  {
    "q": "A loop that spawns two mobs per wave, with a static counter. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob\n{\npublic:\n    static int alive;\n    Mob() { ++alive; cout << \"spawn \" << alive << endl; }\n    ~Mob() { --alive; cout << \"despawn \" << alive << endl; }\n};\n\nint Mob::alive = 0;\n\nint main()\n{\n    for (int wave = 1; wave <= 2; wave++)\n    {\n        Mob a;\n        Mob b;\n        cout << \"wave \" << wave << endl;\n    }\n}",
    "options": [
      "spawn 1\nspawn 2\nwave 1\ndespawn 1\ndespawn 0\nspawn 1\nspawn 2\nwave 2\ndespawn 1\ndespawn 0",
      "spawn 1\nspawn 2\nwave 1\nspawn 3\nspawn 4\nwave 2\ndespawn 3\ndespawn 2\ndespawn 1\ndespawn 0",
      "spawn 1\nspawn 2\nwave 1\ndespawn 1\ndespawn 0\nwave 2",
      "spawn 1\nspawn 1\nwave 1\ndespawn 0\ndespawn 0\nspawn 1\nspawn 1\nwave 2\ndespawn 0\ndespawn 0"
    ],
    "answer": 0,
    "explain": "`static int alive;` is one counter shared by every Mob. 1. Wave 1: `Mob a;` makes it 1 (`spawn 1`), `Mob b;` makes it 2 (`spawn 2`), then `wave 1`. 2. The loop body's `}` ends the scope: `b` dies first (`despawn 1`), then `a` (`despawn 0`). 3. The next pass declares fresh objects: `spawn 1`, `spawn 2`, `wave 2`, `despawn 1`, `despawn 0`. Each pass of a loop body builds and destroys its locals."
  },
  {
    "q": "Slicing, twice. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc\n{\npublic:\n    Npc() { cout << \"Npc()\" << endl; }\n    Npc(const Npc&) { cout << \"Npc(copy)\" << endl; }\n    virtual ~Npc() { cout << \"~Npc\" << endl; }\n};\n\nclass Grendel : public Npc\n{\npublic:\n    Grendel() { cout << \"Grendel()\" << endl; }\n    Grendel(const Grendel& other) : Npc(other) { cout << \"Grendel(copy)\" << endl; }\n    ~Grendel() { cout << \"~Grendel\" << endl; }\n};\n\nvoid greet(Npc)\n{\n    cout << \"greet\" << endl;\n}\n\nint main()\n{\n    Grendel g;\n    Npc saved = g;\n    greet(g);\n}",
    "options": [
      "Npc()\nGrendel()\nNpc(copy)\nNpc(copy)\ngreet\n~Npc\n~Npc\n~Grendel\n~Npc",
      "Npc()\nGrendel()\nNpc(copy)\nGrendel(copy)\nNpc(copy)\nGrendel(copy)\ngreet\n~Grendel\n~Npc\n~Grendel\n~Npc\n~Grendel\n~Npc",
      "Npc()\nGrendel()\nNpc(copy)\nNpc(copy)\ngreet\n~Npc\n~Grendel\n~Npc\n~Npc",
      "Npc()\nGrendel()\ngreet\n~Grendel\n~Npc"
    ],
    "answer": 0,
    "explain": "1. `Grendel g;`: `Npc()`, `Grendel()`. 2. `Npc saved = g;` makes a new Npc from g: the Npc copy constructor runs on g's Npc part, `Npc(copy)`. `Grendel(copy)` never runs. 3. `greet(g)` takes `Npc` by value: another slice, `Npc(copy)`. 4. `greet`. 5. The parameter dies on return: `~Npc`. 6. End of `main`, reverse order: `saved` is a plain Npc, `~Npc`; then `g`, `~Grendel`, `~Npc`. Three objects, four destructor lines: 1 for the parameter, 1 for `saved`, 2 for `g` (its Grendel part and its Npc part)."
  },
  {
    "q": "A returned parameter nobody keeps. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob\n{\npublic:\n    Mob() { cout << \"Mob()\" << endl; }\n    Mob(const Mob&) { cout << \"Mob(copy)\" << endl; }\n    ~Mob() { cout << \"~Mob\" << endl; }\n};\n\nMob respawn(Mob m)\n{\n    cout << \"respawn\" << endl;\n    return m;\n}\n\nint main()\n{\n    Mob slime;\n    respawn(slime);\n    cout << \"next\" << endl;\n}",
    "options": [
      "Mob()\nMob(copy)\nrespawn\nMob(copy)\n~Mob\n~Mob\nnext\n~Mob",
      "Mob()\nMob(copy)\nrespawn\n~Mob\nnext\n~Mob",
      "Mob()\nMob(copy)\nrespawn\nMob(copy)\n~Mob\nnext\n~Mob\n~Mob",
      "Mob()\nrespawn\nMob(copy)\n~Mob\nnext\n~Mob"
    ],
    "answer": 0,
    "explain": "The first half of Q20 with new names. 1. `Mob slime;`: `Mob()`. 2. `respawn(slime);` copies into `Mob m`: `Mob(copy)`. 3. `respawn`. 4. `return m;` copies the parameter into the returned temporary: `Mob(copy)`. 5. The result is unused, so at the `;` the temporary dies (`~Mob`) and then `m` (`~Mob`). 6. `next`. 7. `slime` dies at the end of `main`: `~Mob`."
  }
]
```
