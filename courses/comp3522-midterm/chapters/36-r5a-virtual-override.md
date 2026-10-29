---
title: "Extra 6: virtual functions and override: which function runs"
minutes: 15
---
This lesson teaches how C++ picks which version of a function runs when a base-class handle holds a derived object. It prepares you for the "what is printed" questions that mix base pointers, references and copies.

## What a virtual function is, in plain words

Inheritance lets one class build on another. A Slime is a Mob with extras: it gets every member of Mob, and it may replace some of Mob's functions with its own versions.

Because every Slime is a Mob, a variable that points at a Mob may point at a Slime. A pointer is a variable that stores the address of an object.

A reference is a second name for an object that already exists. A reference of type Mob may also name a Slime.

Now two types are in play. One is the type the pointer or reference was declared with. The other is the type of the object it really reaches.

When both classes have a function with the same name, one of the two types must decide. For a plain member function, the declared type decides, and the compiler fixes the choice while it compiles.

For a virtual function, the object decides. The running program looks at the real object and calls that class's version.

Picture a name tag. The tag says "Mob", and the creature wearing it is a Slime. A plain call reads the tag. A virtual call looks at the creature.

```diagram
{ "type": "grid", "title": "A Mob pointer holding a Slime", "nodes": [
  { "id": "h0", "label": "call", "row": 0, "col": 0 },
  { "id": "h1", "label": "pointer says", "row": 0, "col": 1 },
  { "id": "h2", "label": "object is", "row": 0, "col": 2 },
  { "id": "h3", "label": "version run", "row": 0, "col": 3 },
  { "id": "r1", "label": "plain function", "row": 1, "col": 0 },
  { "id": "r1a", "label": "Mob", "row": 1, "col": 1 },
  { "id": "r1b", "label": "Slime", "row": 1, "col": 2 },
  { "id": "r1c", "label": "Mob's", "row": 1, "col": 3 },
  { "id": "r2", "label": "virtual function", "row": 2, "col": 0 },
  { "id": "r2a", "label": "Mob", "row": 2, "col": 1 },
  { "id": "r2b", "label": "Slime", "row": 2, "col": 2 },
  { "id": "r2c", "label": "Slime's", "row": 2, "col": 3 }
], "hi": ["r1a", "r1c", "r2b", "r2c"], "caption": "A plain call follows the pointer's declared type. A virtual call follows the object the pointer really reaches." }
```

## A tiny program you can run in your head

```cpp run pin mob.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

class Mob {
public:
    void name() const { cout << "Mob" << endl; }
    virtual void hit() const { cout << "Mob hit" << endl; }
};

class Slime : public Mob {
public:
    void name() const { cout << "Slime" << endl; }
    void hit() const override { cout << "Slime hit" << endl; }
};

int main()
{
    Slime slime;
    Mob* m = &slime;
    m->name();
    m->hit();
    return 0;
}
```

1. `m->name();` calls a plain function. The pointer `Mob* m` decides, so Mob's version runs: `Mob`.
2. `m->hit();` calls a virtual function. The object is a Slime, so `void hit() const override` runs: `Slime hit`.

The same pointer, the same object, two answers: the word `virtual` in Mob is the only difference.

## The rule, in the slide's words

- A virtual member is "a base class member function that can be redefined in the derived class". The call goes to the object's real class at run time: dynamic binding.
- Without `virtual`, the declared type of the pointer or reference decides at compile time: static binding.
- "Polymorphism only works with pointers or references." A call on a plain object always runs that object's own class.

The trap: `virtual` is written in the base class, and every override below it is virtual too, with or without the word.

### `override` catches a typo

Writing `override` after a derived function asks the compiler to check one thing. A function in the base class, with the same name and the same parameters, must be virtual.

Without the check, a misspelled name quietly becomes a brand-new function. The base's version keeps running and nothing warns you.

```cpp pin typo.cpp
#include <iostream>
using namespace std;

class Mob {
public:
    virtual void hit() const { cout << "Mob hit" << endl; }
};

class Slime : public Mob {
public:
    void hitt() const override { cout << "Slime hit" << endl; }   // typo: two t's
};

int main()
{
    Slime slime;
    return 0;
}
```

The base declares `virtual void hit() const`. The derived line `void hitt() const override` has two t's, so it overrides nothing.

g++ stops with `'void Slime::hitt() const' marked 'override', but does not override`. A missing `const` gives the same error, because the parameters must match exactly.

### A copy holds only the base part

A Mob variable is a box the size of a Mob. Copying a Slime into it runs the Mob copy constructor, which copies the Mob part and cuts the Slime part off. That is slicing, and a virtual call on the copy can only reach Mob's version.

## The exam's shape, worked: a base pointer to a Grendel

The exam mixes all three cases in one program: a virtual call through a pointer, a call that names the class, and a sliced copy.

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

A destructor is the function that runs when an object dies. The slide's rule for it: "if a class contains a virtual function, the destructor should be virtual too".

Remove `virtual` from `~Npc` and `delete n;` is undefined behaviour. g++ prints only `~Npc`, and the Grendel part is never destroyed.

:::warn A virtual call on a plain object is not virtual
`copy.talk()` runs Npc's version even though `talk` is virtual. Dispatch needs a pointer or a reference. A sliced copy has nothing left to dispatch to.
:::

```widget
dispatch-viz
{ "virtual": true, "handle": "val", "object": "derived" }
```

## Try it

```quiz
[
  {
    "q": "What does this program print?",
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
    "q": "`~Npc` is not virtual here. What does g++ print?",
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
    "q": "`n` is an `Npc*` holding a `Grendel`, `talk` is virtual in Npc, and Grendel overrides it. Which call runs Npc's `talk`?",
    "options": [
      "`n->Npc::talk();`",
      "`n->talk();`",
      "`Npc& r = *n; r.talk();`",
      "`(*n).talk();`"
    ],
    "answer": 0,
    "explain": "Naming the class with `::` switches dispatch off, so `n->Npc::talk();` runs Npc's version. The other three reach the Grendel object through a pointer or a reference: `(*n)` is the object itself seen through the pointer, and `r` is a second name for it. All three dispatch to Grendel's override."
  },
  {
    "q": "Writing `override` on the derived function is what makes a call through a base pointer reach the derived version.",
    "type": "tf",
    "answer": false,
    "explain": "`virtual` in the base class makes the call dynamic. `override` only asks the compiler to check that a matching base virtual exists, so a typo or a missing `const` fails to compile. Remove `override` from a correct override and the program prints the same; remove `virtual` from the base and the base's version runs."
  }
]
```

## Remember

- A virtual call through a pointer or a reference runs the object's own version. A plain call, or any call on a plain object, runs the declared type's version.
- Copying a derived object into a base variable keeps only the base part: slicing.
- A class with a virtual function needs a virtual destructor, or `delete` through a base pointer skips the derived destructor.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for traces, and side 2, band 4 "True/false and multiple choice traps".
