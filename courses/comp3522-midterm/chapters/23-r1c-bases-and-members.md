---
title: "Extra 2: base first, members next, body last: Q27 and Q28"
minutes: 20
---
This lesson teaches the order in which the parts of one object are built and torn down. It prepares you for Q27 and Q28, two "What is printed?" questions worth four marks each.

## How a derived object is built, in plain words

Inheritance means one class is built on top of another class, called its base. A derived object carries a whole base object inside it.

A class can also hold other objects as members. They are smaller boxes inside the big box.

So one declaration can print several constructor lines, one per part. The object is built from the inside out: the base part, then each member, then the derived constructor's own body.

Tearing down runs the other way, from the outside in. Think of a house: the foundation first, then the rooms, then the paint, and demolition strips the paint first.

```diagram
{ "type": "flow", "title": "One derived object, built", "nodes": [
  { "id": "b", "label": "Base part", "sub": "its whole chain" },
  { "id": "m", "label": "Members", "sub": "in declaration order" },
  { "id": "y", "label": "Body", "sub": "the derived line" }
], "edges": [ { "from": "b", "to": "m" }, { "from": "m", "to": "y" } ], "hi": ["b"], "caption": "Construction goes from the inside out, and destruction runs the same arrows backwards." }
```

## A tiny program you can run in your head

`Bot` has one base, `Module`, and one member, `Walk walk;`. Every constructor and destructor prints its class name.

```cpp run pin bot.cpp
// predict: Write all 6 lines. Which constructor prints first?
#include <iostream>
using namespace std;

class Module
{
public:
    Module() { cout << "Module" << endl; }
    ~Module() { cout << "~Module" << endl; }
};

class Walk
{
public:
    Walk() { cout << "Walk" << endl; }
    ~Walk() { cout << "~Walk" << endl; }
};

class Bot : public Module
{
    Walk walk;
public:
    Bot() { cout << "Bot" << endl; }
    ~Bot() { cout << "~Bot" << endl; }
};

int main()
{
    Bot bot;
}
```

1. `Bot bot;` starts with the base named in `class Bot : public Module`: `Module`.
2. Then the member `Walk walk;`: `Walk`.
3. Then the body of `Bot()`: `Bot`.
4. At the end of `main` the body of `~Bot()` runs first: `~Bot`.
5. Then the member: `~Walk`.
6. Then the base, last: `~Module`.

Three parts went up and the same three came down in the mirror order.

## Two bases

A class may list two bases after the colon. They are built in the order they are written there, each with its whole chain.

```cpp run pin hero.cpp
// predict: Write all 6 lines. Which base is built first?
#include <iostream>
using namespace std;

class Walker
{
public:
    Walker() { cout << "Walker" << endl; }
    ~Walker() { cout << "~Walker" << endl; }
};

class Fighter
{
public:
    Fighter() { cout << "Fighter" << endl; }
    ~Fighter() { cout << "~Fighter" << endl; }
};

class Hero : public Fighter, public Walker
{
public:
    Hero() { cout << "Hero" << endl; }
    ~Hero() { cout << "~Hero" << endl; }
};

int main()
{
    Hero hero;
}
```

1. `class Hero : public Fighter, public Walker` lists `Fighter` first: `Fighter`.
2. Then the second base: `Walker`.
3. Then the body: `Hero`.
4. At the end of `main`: `~Hero`.
5. The base built last dies first: `~Walker`.
6. Then `~Fighter`.

The order of the class definitions in the file does not matter. Only the list after the colon does.

## The rule, in the slide's words

- A derived object is built base first, then its members in declaration order, then the constructor body. Destruction is the exact reverse.
- Bases are constructed in the order they are listed after the colon.
- With `virtual` in front of a base, every path to that base shares one copy. "Virtual base classes permit us to store the members of a common base only once."
- The shared base is "a common object that is part of the most derived class". The most-derived class builds it, once, before every other base.

```diagram
{ "type": "flow", "title": "Building one derived object", "nodes": [
  { "id": "v", "label": "Virtual bases", "sub": "once, by the most-derived" },
  { "id": "b", "label": "Other bases", "sub": "in the order after the colon" },
  { "id": "m", "label": "Members", "sub": "in declaration order" },
  { "id": "y", "label": "Body", "sub": "the constructor's own line" }
], "edges": [ { "from": "v", "to": "b" }, { "from": "b", "to": "m" }, { "from": "m", "to": "y" } ], "hi": ["y"], "caption": "Each base is itself built this way, base first. Destruction runs the arrows backwards: the destructor body, members in reverse, bases in reverse, the virtual base last." }
```

:::warn Each base brings its whole chain
Without `virtual`, two paths to the same base give two separate copies of it. Each copy prints its own constructor line and its own destructor line.
:::

## The paper's question, worked: Q27

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
7. All bases are done, so E's body runs: `E allocated`.
8. `E e;` dies at the end of `main`. The reverse starts with E's body: `E deallocated`.
9. D was built last, so it goes first: `D deallocated`.
10. D's B: `B deallocated`.
11. D's A: `A deallocated`.
12. Then the C chain: `C deallocated`.
13. `B deallocated`.
14. `A deallocated`.

## The paper's question, worked: Q28

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

The picture now has one A that every B shares. It still has two Bs: C's virtual one and D's ordinary one.

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

Why the output differs, in one sentence: B inherits A virtually, so E holds one shared A, built once and first by E, and one `A allocated` and one `A deallocated` disappear.

1. Virtual bases come first, built by E. The shared A: `A allocated`.
2. C's virtual B: `B allocated`.
3. Now the ordinary bases in the order written. C's B is already built: `C allocated`.
4. D's B is ordinary, so D builds it. Its A is the shared one, already built: `B allocated`.
5. `D allocated`.
6. `E allocated`.
7. The reverse begins: `E deallocated`.
8. `D deallocated`.
9. D's own B: `B deallocated`.
10. `C deallocated`.
11. The virtual B: `B deallocated`.
12. The shared A was built first, so it dies last: `A deallocated`.

g++ also warns `virtual base 'B' inaccessible in 'E' due to ambiguity`. E has two Bs, so the name `B` is ambiguous inside E, but the 12 lines still print.

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": false, "init": "most" }
```

The widget's person, student, mathematician and math_student play B, C, D and E. C inherits B virtually and D does not, so there is one shared B plus a second B inside D, exactly Q28's two Bs.

Q28's single A, shared by both Bs, is not drawn. Toggle the second `virtual` to see the diamond with one person.

## Try it

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
    "q": "Q27 with the two bases of E swapped: `class E : public D, public C`. What is printed?",
    "code": "#include <iostream>\nclass A\n{\npublic:\n    A() { std::cout << \"A allocated\" << std::endl; }\n    ~A() { std::cout << \"A deallocated\" << std::endl; } };\n\nclass B : public A\n{\npublic:\n    B() { std::cout << \"B allocated\" << std::endl; }\n    ~B() { std::cout << \"B deallocated\" << std::endl; } };\n\nclass C : public B\n{\npublic:\n    C() { std::cout << \"C allocated\" << std::endl; }\n    ~C() { std::cout << \"C deallocated\" << std::endl; } };\n\nclass D : public B\n{\npublic:\n    D() { std::cout << \"D allocated\" << std::endl; }\n    ~D() { std::cout << \"D deallocated\" << std::endl; } };\n\nclass E : public D, public C\n{\npublic:\n    E() { std::cout << \"E allocated\" << std::endl; }\n    ~E() { std::cout << \"E deallocated\" << std::endl; } };\n\nint main()\n{\n    E e;\n}",
    "options": [
      "A allocated\nB allocated\nD allocated\nA allocated\nB allocated\nC allocated\nE allocated\nE deallocated\nC deallocated\nB deallocated\nA deallocated\nD deallocated\nB deallocated\nA deallocated",
      "A allocated\nB allocated\nC allocated\nA allocated\nB allocated\nD allocated\nE allocated\nE deallocated\nD deallocated\nB deallocated\nA deallocated\nC deallocated\nB deallocated\nA deallocated",
      "A allocated\nB allocated\nD allocated\nA allocated\nB allocated\nC allocated\nE allocated\nE deallocated\nD deallocated\nB deallocated\nA deallocated\nC deallocated\nB deallocated\nA deallocated",
      "A allocated\nB allocated\nD allocated\nC allocated\nE allocated\nE deallocated\nC deallocated\nD deallocated\nB deallocated\nA deallocated"
    ],
    "answer": 0,
    "explain": "1. `class E : public D, public C` lists D first, so the D chain is built first: `A allocated`, `B allocated`, `D allocated`. 2. Then the C chain with its own A and B: `A allocated`, `B allocated`, `C allocated`. 3. E's body: `E allocated`. 4. The exact reverse: `E deallocated`, then C was built last so its chain goes first: `C deallocated`, `B deallocated`, `A deallocated`. 5. Then the D chain: `D deallocated`, `B deallocated`, `A deallocated`. Still 14 lines: nothing is shared without `virtual`."
  },
  {
    "type": "tf",
    "q": "In a class hierarchy with a virtual base, the middle class that inherits it virtually is the one that constructs the shared base.",
    "answer": false,
    "explain": "The most-derived class constructs the shared virtual base, once, before every other base. In Q28 that is `E`, so `A allocated` is the very first line even though `E` never names `A`."
  },
  {
    "type": "free",
    "q": "Q28's second part: explain in one sentence why the output is different from Q27's.",
    "model": "Because `B` inherits `A` virtually, there is only one shared `A` in `E`, constructed once (first) by the most-derived class `E` instead of once per `B`, so one `A allocated` and one `A deallocated` disappear (14 lines become 12).",
    "points": ["names virtual inheritance of A (`class B : virtual public A`)", "only one shared A subobject", "constructed once, by the most-derived class E", "one A allocated and one A deallocated fewer: 12 lines"],
    "rows": 3,
    "explain": "1. Name the cause: `class B : virtual public A`. 2. Contrast: in Q27 each B carried its own A, so A appeared twice, and now every B in E shares one A. 3. The effect on the output: E builds that A once, first, so one constructor line and one destructor line of A disappear. D's B is still an ordinary base, so B still appears twice."
  }
]
```

## Remember

- One declaration prints one line per part: base chain, then members in declaration order, then the body. Destruction is the mirror.
- Bases go in the order after the colon. A virtual base goes first of all, once, built by the most-derived class.
- Draw the tree of subobjects before writing a line: the count of boxes is the count of constructor lines.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for the order rules and Q27 and Q28 side by side.
