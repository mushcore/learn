---
title: "Extra 5: slicing and the virtual destructor: the Parent and Child program"
minutes: 20
---
This lesson teaches what happens when a derived object is handled through its base type: by copy, and through a pointer. It prepares you for the review lecture's Parent and Child program, a likely Part B trace.

## What slicing is, in plain words

A derived object holds a base part plus its own extra part. A variable of the base type has room for the base part only.

So copying a derived object into a base variable copies only the base part. The extra part is cut off, and that cut is called slicing.

The base class's copy constructor makes that copy. The result is a plain base object, so only the base destructor runs when it dies.

Think of a boss saved into a slot built for ordinary mobs. The slot keeps the mob part and drops every boss phase.

```diagram
{ "type": "grid", "title": "A Boss copied into a Mob", "nodes": [
  { "id": "h0", "label": "variable", "row": 0, "col": 0 },
  { "id": "h1", "label": "Mob part", "row": 0, "col": 1 },
  { "id": "h2", "label": "Boss part", "row": 0, "col": 2 },
  { "id": "z0", "label": "zakum (Boss)", "row": 1, "col": 0 },
  { "id": "z1", "label": "yes", "row": 1, "col": 1 },
  { "id": "z2", "label": "yes", "row": 1, "col": 2 },
  { "id": "s0", "label": "saved (Mob)", "row": 2, "col": 0 },
  { "id": "s1", "label": "copied", "row": 2, "col": 1 },
  { "id": "s2", "label": "no room: sliced", "row": 2, "col": 2 }
], "hi": ["s2"], "caption": "A base variable holds only a base object: copying a derived object into it keeps the base part and slices off the rest." }
```

## A tiny program you can run in your head

```cpp run pin slice.cpp
// predict: Write all 7 lines. Which copy constructor runs, Mob's or Boss's?
#include <iostream>
using namespace std;

class Mob
{
public:
    Mob() { cout << "Mob()" << endl; }
    Mob(const Mob&) { cout << "Mob(copy)" << endl; }
    ~Mob() { cout << "~Mob" << endl; }
};

class Boss : public Mob
{
public:
    Boss() { cout << "Boss()" << endl; }
    ~Boss() { cout << "~Boss" << endl; }
};

int main()
{
    Boss zakum;
    Mob saved = zakum;
    cout << "saved" << endl;
}
```

1. `Boss zakum;` builds the base part first: `Mob()`.
2. Then the Boss body: `Boss()`.
3. `Mob saved = zakum;` declares a new Mob. A Mob holds only a Mob, so the Mob copy constructor copies zakum's Mob part: `Mob(copy)`.
4. `cout << "saved" << endl;` prints `saved`.
5. At the end of `main`, `saved` dies first. It is a plain Mob: `~Mob`.
6. Then `zakum`, derived part first: `~Boss`.
7. Then its base part: `~Mob`.

Two objects, three destructor lines: one for `saved` and two for the two parts of `zakum`.

## The slicing rule, in the slide's words

- The copy constructor runs "When passing an object by value to a function". The parameter's type decides which class's copy constructor runs.
- `Base b = derived;` and `void f(Base b)` called with a Derived both run the Base copy constructor, and later only the Base destructor.
- A reference parameter such as `Parent &p` makes no object and slices nothing.

## The paper's program, worked: Parent and Child by value

The review code's `ParentChild` program has a `struct Parent` with a virtual destructor and a `struct Child : public Parent`. Two functions take a `Parent` by value and by reference, and here the third experiment is switched on.

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
3. `passByValue(c);` must make a new `Parent p`, so Parent's copy constructor copies c's Parent part: `A Parent copy was made.` Child's copy constructor never runs.
4. The body: `in passByValue`.
5. `p` dies as the function returns. It is a plain Parent: `Parent destructor.`
6. `passByReference(c);` binds `p` to c itself and makes no object: `in passByReference`.
7. `return 0;` ends `main`, and c dies, derived part first: `Child destructor.`
8. `Parent destructor.`

`Parent saved = c;` would slice the same way. It prints one `A Parent copy was made.` and, later, one `Parent destructor.` for it.

## What a virtual destructor is, in plain words

A pointer is a variable that holds the address of an object. A `Parent*` may hold the address of a whole Child made with `new`, which builds the object on the heap.

`delete` through that pointer must pick a destructor. A function marked `virtual` is chosen by the object's real type, not by the pointer's type.

So with a virtual base destructor, `delete` runs the Child destructor and then the Parent one. Without `virtual`, only the Parent destructor runs and the Child part is never cleaned up.

```diagram
{ "type": "grid", "title": "delete p; with p a Base*", "nodes": [
  { "id": "h0", "label": "~Base is", "row": 0, "col": 0 },
  { "id": "h1", "label": "delete p prints", "row": 0, "col": 1 },
  { "id": "v0", "label": "virtual", "row": 1, "col": 0 },
  { "id": "v1", "label": "~Derived, ~Base", "row": 1, "col": 1 },
  { "id": "n0", "label": "not virtual", "row": 2, "col": 0 },
  { "id": "n1", "label": "~Base only", "row": 2, "col": 1 }
], "hi": ["v1"], "caption": "A virtual destructor lets delete start at the object's real type; without it the pointer's type decides and the derived part is skipped." }
```

## A tiny program you can run in your head

```cpp run pin vdelete.cpp
// predict: Write all 5 lines. Does ~Zakum run?
#include <iostream>
using namespace std;

class Boss
{
public:
    Boss() { cout << "Boss()" << endl; }
    virtual ~Boss() { cout << "~Boss" << endl; }
};

class Zakum : public Boss
{
public:
    Zakum() { cout << "Zakum()" << endl; }
    ~Zakum() { cout << "~Zakum" << endl; }
};

int main()
{
    Boss* b = new Zakum;
    delete b;
    cout << "channel closed" << endl;
}
```

1. `Boss* b = new Zakum;` builds a whole Zakum, base first: `Boss()`.
2. Then `Zakum()`.
3. `delete b;` goes through a `Boss*`, but `virtual ~Boss()` sends the call to the real type: `~Zakum`.
4. Then the base part: `~Boss`.
5. `cout << "channel closed" << endl;` prints `channel closed`.

## The virtual destructor rule, in the slide's words

- Slide 74: "When a destructor of a child type is destroyed, it will execute its own destruction code, then call its parent's destructor".
- Slide 75: "Problem happens when we destroy a pointer/reference of a base type, assigned to a child type object."
- Slide 77: base classes should always have a virtual destructor. Week 3 puts it as "if a class contains a virtual function, the destructor should be virtual too".

:::warn One destructor line short
When a `delete` prints fewer destructor lines than the `new` printed constructor lines, the base destructor is missing `virtual`. The standard calls that delete undefined behaviour.
:::

## The paper's program, worked: no virtual destructor

The second experiment of the same program, with `virtual` removed from `~Parent`.

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
3. `delete pPtr;` calls the destructor through a `Parent*`. `~Parent()` is not virtual, so the pointer's type decides: `Parent destructor.` and nothing else.

`Child destructor.` never prints, and these three lines are what g++ does. With `virtual ~Parent()` the same `main` prints four lines: both constructors, then `Child destructor.` and `Parent destructor.`

## Try it

```quiz
[
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
    "explain": "1. `Grendel g;`: `Npc()`, `Grendel()`. 2. `Npc saved = g;` makes a new Npc from g: the Npc copy constructor runs on g's Npc part, `Npc(copy)`. `Grendel(copy)` never runs. 3. `greet(g)` takes `Npc` by value: another slice, `Npc(copy)`. 4. `greet`. 5. The parameter dies on return: `~Npc`. 6. End of `main`, reverse order: `saved` is a plain Npc, `~Npc`, then `g`, `~Grendel`, `~Npc`. Three objects, four destructor lines: 1 for the parameter, 1 for `saved`, 2 for `g`."
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
    "explain": "1. Construction is unchanged: `Npc()`, `Grendel()`. 2. `talk`. 3. `delete n;` with a non-virtual destructor is decided by the pointer's type, `Npc*`, so only `~Npc` runs and `~Grendel` is skipped. That is undefined behaviour, and this is what g++ prints. 4. `done`. Five lines, one destructor short of the constructors: the warning sign."
  },
  {
    "type": "tf",
    "q": "Per slide 77, base classes should always have a virtual destructor.",
    "answer": true,
    "explain": "The slide's rule. Without it, `delete` through a base pointer runs only the base destructor, as the Parent and Child program shows."
  }
]
```

## Remember

- A base variable or by-value base parameter holds only a base: the base copy constructor runs, and only the base destructor later.
- `delete` through a base pointer runs the derived destructor only when the base destructor is `virtual`.
- Count: a `new` that printed two constructor lines needs a `delete` that prints two destructor lines.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for the Parent/Child variants.
