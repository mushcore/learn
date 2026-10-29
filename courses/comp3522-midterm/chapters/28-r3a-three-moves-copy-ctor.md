---
title: "Core 6: the three-move definition, and the copy constructor (Q1)"
minutes: 20
---
This lesson shows how a written definition earns its marks, then uses that shape on the copy constructor. It prepares Q1: "What is a copy constructor? When is it used?"

## How a definition answer earns its marks, in plain words

A two- to six-mark definition is marked on facts, not on length. The marker ticks a short list of points, and three moves reach almost all of them.

The first move names the thing in the slide's own words. The second move contrasts it with the thing students confuse it with.

The third move is one line of code that shows it. A "when is it used" question adds a list: every moment, each with its own line of code.

```diagram
{ "type": "flow", "title": "How to write a Part A definition", "nodes": [
  { "id": "d", "label": "Define", "sub": "the slide's term" },
  { "id": "c", "label": "Contrast", "sub": "the confused thing" },
  { "id": "x", "label": "Code", "sub": "one line that shows it" }
], "edges": [ { "from": "d", "to": "c" }, { "from": "c", "to": "x" } ], "hi": ["d"], "caption": "Every Part A definition: the slide's term first, then the contrast, then one line of code." }
```

## What a copy constructor is, in plain words

A constructor is the function that runs when an object is born. It has the class's name and fills in the new object's data.

A copy constructor is the constructor that builds a new object as a copy of one that already exists. Think of a photocopier: the original stays, and a second sheet appears.

The key word is new. If both objects already exist and one takes the other's values, nothing is born, so no constructor runs.

That other operation is assignment. The function behind it is the assignment operator, written `operator=`.

```diagram
{ "type": "flow", "title": "A copy is a new object", "nodes": [
  { "id": "old", "label": "slime", "sub": "already exists" },
  { "id": "cc", "label": "copy constructor" },
  { "id": "nw", "label": "a", "sub": "born as a copy" }
], "edges": [ { "from": "old", "to": "cc" }, { "from": "cc", "to": "nw" } ], "hi": ["cc"], "caption": "The copy constructor runs only when a second object is born from the first." }
```

## A tiny program you can run in your head

```cpp run pin copy_or_assign.cpp
// predict: Write the four lines printed, in order.
#include <iostream>
using namespace std;

class Mob {
public:
    Mob() { cout << "make" << endl; }
    Mob(const Mob&) { cout << "copy" << endl; }
    Mob& operator=(const Mob&) { cout << "assign" << endl; return *this; }
};

int main()
{
    Mob slime;
    Mob a(slime);
    Mob b = slime;
    b = slime;
    return 0;
}
```

1. `make`: `Mob slime;` builds the first object with the default constructor, the one that takes no arguments.
2. `copy`: `Mob a(slime);` declares a new object `a` made from `slime`.
3. `copy`: `Mob b = slime;` has an `=` sign, but it starts with a type name, so it declares `b`. A new object is born.
4. `assign`: `b = slime;` names no type. `b` already exists, so this is assignment.

Ask one question per line and the output follows: is a new object being born here?

## The rule, in the slide's words

The signature is `T(const T& other)`: the class name, and one parameter that is a const reference to the same class. A reference is a second name for an object that already exists, so passing one copies nothing.

The slide says "stick with const and & for copy constructor". Each symbol has one reason.

- `const`: the copy cannot change the original, and a const object can be copied too.
- `&`: a by-value parameter would itself be a copy, which calls the copy constructor again, forever.

The copy constructor runs at four moments. Each one makes a new object from an old one.

```diagram
{ "type": "grid", "title": "Which lines call the copy constructor", "nodes": [
  { "id": "h0", "label": "moment", "row": 0, "col": 0 },
  { "id": "h1", "label": "line", "row": 0, "col": 1 },
  { "id": "h2", "label": "prints", "row": 0, "col": 2 },
  { "id": "r10", "label": "brackets", "row": 1, "col": 0 },
  { "id": "r11", "label": "Mob a(slime);", "row": 1, "col": 1 },
  { "id": "r12", "label": "copy", "row": 1, "col": 2 },
  { "id": "r20", "label": "= in a declaration", "row": 2, "col": 0 },
  { "id": "r21", "label": "Mob b = slime;", "row": 2, "col": 1 },
  { "id": "r22", "label": "copy", "row": 2, "col": 2 },
  { "id": "r30", "label": "pass by value", "row": 3, "col": 0 },
  { "id": "r31", "label": "pass(slime)", "row": 3, "col": 1 },
  { "id": "r32", "label": "copy", "row": 3, "col": 2 },
  { "id": "r40", "label": "return by value", "row": 4, "col": 0 },
  { "id": "r41", "label": "return m;", "row": 4, "col": 1 },
  { "id": "r42", "label": "copy", "row": 4, "col": 2 },
  { "id": "r50", "label": "existing object", "row": 5, "col": 0 },
  { "id": "r51", "label": "b = slime;", "row": 5, "col": 1 },
  { "id": "r52", "label": "assign", "row": 5, "col": 2 }
], "hi": ["r52"], "caption": "Four moments make a new object and call the copy constructor. A line that changes an existing object calls assignment." }
```

The slide words the last moment as "returning by value calls the copy constructor". In C++17 the compiler may skip that copy for a returned local, but a returned parameter is always copied.

:::warn The = sign trap
`Mob b = slime;` is a copy constructor call, not assignment. A line that starts with a type name declares a new object.
:::

## The four moments in one program

Passing by value means the function gets its own new object, copied from the argument. Returning by value hands a new object back to the caller.

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
7. `copy Slime`: `return m;` copies the parameter out. That copy **is** `c`, so there is no third line.

## Shallow copy and deep copy, in plain words

If you write no copy constructor, the compiler writes one for you. It copies every member, one by one.

That is fine for a number or a `string`. A pointer is different: it holds the address of some other memory, and copying it copies only the address.

So the copy and the original now reach one shared array. This is a shallow copy: two objects, one array.

A deep copy gives the new object its own new array, then copies the elements into it. A write through the copy can no longer touch the original.

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

## A deep copy you can run

`new int[s]` asks for an array on the heap, the memory a program requests while it runs. The destructor, the function that runs when an object dies, gives it back with `delete[]`.

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

1. `1`: `copy.skillIds[0] = 9;` wrote into the copy's own array, made by `skillIds(new int[other.size])`. So `warrior` still holds 1.
2. `9`: the copy's first element.

Delete the hand-written copy constructor and the 9 goes into the one shared array. Both destructors then run `delete[]` on the same address.

The rule: the compiler's copy is member by member, a shallow copy. A class that owns a pointer writes its own copy constructor that allocates.

## The paper's question, worked

Q1 in three moves looks like this.

| Move | What you write |
|---|---|
| Name it | The constructor that builds a **new** object as a copy of an existing object of the same class. |
| Contrast | Not used by `b = a;` when `b` already exists: that is the assignment operator. |
| Code | `Mob(const Mob& other)`, then the four moments, each with its line. |

Add the reason for each symbol in the signature and the shallow-versus-deep line. That covers every point on the marker's list.

## Try it

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
    "explain": "Each point is one checkable fact. The return-by-value moment is the slide's wording. In C++17 the compiler may skip that copy for a returned local and must skip it for a returned temporary, but returning a parameter always copies, which is why `Mob c = pass(slime);` above printed two copy lines and not one or three."
  },
  {
    "q": "Why does the copy constructor take its parameter as `const Mob&` and not as `Mob`?",
    "options": [
      "A by-value parameter is itself a copy, so it would call the copy constructor again, forever",
      "A by-value parameter would be destroyed before the copy is made",
      "References are faster, but a by-value copy constructor works the same way",
      "The compiler only accepts `const` parameters in constructors"
    ],
    "answer": 0,
    "explain": "1. To pass `Mob` by value, the compiler must first make the parameter, a new `Mob` copied from the argument.\n2. Making that copy calls the copy constructor, which needs another by-value copy, and so on.\n3. g++ refuses such a constructor outright: `invalid constructor; you probably meant 'Mob (const Mob&)'`.\n4. The `&` passes the original under a second name, so no copy is needed; the `const` promises not to change it."
  },
  {
    "q": "What prints? This `Character` has no copy constructor and no destructor.",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Character {\npublic:\n    int* skillIds;\n    Character() : skillIds(new int[3]{1, 2, 3}) {}\n};\n\nint main() {\n    Character mage;\n    Character copy = mage;\n    copy.skillIds[0] = 9;\n    cout << mage.skillIds[0] << \" \" << copy.skillIds[0] << endl;\n    delete[] mage.skillIds;\n    return 0;\n}",
    "options": ["9 9", "1 9", "1 1", "9 1"],
    "answer": 0,
    "explain": "1. `Character copy = mage;` uses the compiler's copy constructor, which copies each member.\n2. The member is a pointer, so `copy.skillIds` holds the same address as `mage.skillIds`: one array, two names.\n3. `copy.skillIds[0] = 9;` writes into that shared array.\n4. Both reads see 9: `9 9`.\n5. A deep copy, with `new int[3]` and a loop, would print `1 9`."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\npublic:\n    Mob() {}\n    Mob(const Mob&) { cout << \"copy\" << endl; }\n    Mob& operator=(const Mob&) { cout << \"assign\" << endl; return *this; }\n};\n\nvoid hunt(Mob) {}\nvoid look(const Mob&) {}\n\nint main() {\n    Mob slime;\n    hunt(slime);\n    look(slime);\n    Mob other = slime;\n    other = slime;\n    return 0;\n}",
    "options": ["copy\ncopy\nassign", "copy\ncopy\ncopy\nassign", "copy\nassign\nassign", "copy\nassign"],
    "answer": 0,
    "explain": "1. `hunt(slime);` passes by value: the parameter is a new object, so `copy`.\n2. `look(slime);` passes by reference: no new object, nothing prints.\n3. `Mob other = slime;` declares a new object: `copy`.\n4. `other = slime;` changes an existing object: `assign`.\n5. Three lines: copy, copy, assign."
  }
]
```

## Remember

- A copy constructor runs only when a new object is born from an existing one. `b = a;` on an existing `b` is assignment.
- In `T(const T& other)`, the `&` stops an endless chain of copies and the `const` protects the original.
- A pointer member needs a deep copy, or two objects share one array and delete it twice.
- *On the sheet:* Sheet sides 1 and 2, band 2 "What is X? How is it different from Y? When is it used?" for the copy constructor. Sheet side 2, band 3 "Write the function / class / program" for the deep copy.
