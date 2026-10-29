---
title: "Extra 8: deep copy and copy-and-swap (Q16)"
minutes: 20
---
This lesson teaches why a class that owns memory must copy that memory itself, and how copy-and-swap writes the assignment operator from parts you already have. It prepares you for Q16 and for the "what does `b = a;` print" traces.

## What a deep copy is, in plain words

Some objects own memory on the heap. The heap is memory the program asks for with `new` and must hand back with `delete[]`.

The object itself keeps only a pointer to that memory. A pointer is a variable that holds an address, like a slip of paper with a locker number on it.

The compiler's own copy copies the slip, not the locker. Two objects then point at one array: a shallow copy.

A change through one object shows up in the other. Worse, both destructors free the same array, and the second free crashes or corrupts memory.

A deep copy gives the new object its own array, with the same values copied in. That is the job of a copy constructor you write yourself.

```diagram
{ "type": "grid", "title": "Two Bags after a copy", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "shallow copy", "row": 0, "col": 1 },
  { "id": "h2", "label": "deep copy", "row": 0, "col": 2 },
  { "id": "m0", "label": "mine.potions", "row": 1, "col": 0 },
  { "id": "m1", "label": "array A", "row": 1, "col": 1 },
  { "id": "m2", "label": "array A", "row": 1, "col": 2 },
  { "id": "y0", "label": "yours.potions", "row": 2, "col": 0 },
  { "id": "y1", "label": "array A (shared)", "row": 2, "col": 1 },
  { "id": "y2", "label": "array B (its own)", "row": 2, "col": 2 }
], "hi": ["y1", "y2"], "caption": "A shallow copy shares one array between two objects. A deep copy gives the new object its own array, so each destructor frees only its own." }
```

## A tiny program you can run in your head

```cpp run pin bag.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

class Bag {
public:
    int* potions;
    Bag() : potions(new int[1]{5}) {}
    Bag(const Bag& other) : potions(new int[1]{other.potions[0]}) {}
    ~Bag() { delete[] potions; }
};

int main()
{
    Bag mine;
    Bag yours = mine;
    yours.potions[0] = 0;
    cout << "mine: " << mine.potions[0] << endl;
    cout << "yours: " << yours.potions[0] << endl;
    return 0;
}
```

1. `Bag yours = mine;` runs `Bag(const Bag& other)`, which makes a new array holding 5. Then `yours.potions[0] = 0;` writes only that new array, so `cout << "mine: " << mine.potions[0] << endl;` prints `mine: 5`.
2. `cout << "yours: " << yours.potions[0] << endl;` prints `yours: 0`.

The two bags are independent, and each `~Bag()` frees a different array.

## Assignment, and copy-and-swap, in plain words

Assignment is a different moment from copying. In `b = a;` both objects already exist, so no constructor runs.

The function that runs is the copy assignment operator, written `operator=`. It must throw away b's old array and give b its own copy of a's data.

Copy-and-swap does that with three parts you already wrote. The copy constructor makes the copy, a swap function trades the insides, and the destructor cleans up.

```diagram
{ "type": "flow", "title": "b = a, by copy-and-swap", "nodes": [
  { "id": "c", "label": "1. copy", "sub": "other = copy of a" },
  { "id": "s", "label": "2. swap", "sub": "b and other trade" },
  { "id": "d", "label": "3. other dies", "sub": "frees b's old array" }
], "edges": [ { "from": "c", "to": "s" }, { "from": "s", "to": "d" } ], "hi": ["s"], "caption": "The by-value parameter makes the copy, the swap hands b the new data, and the copy's destructor takes the old data away." }
```

## The rule, in the slide's words

The slide's canonical copy assignment is a member function:

```cpp
MyClass& MyClass::operator=(MyClass rhs) { mySwap(*this, rhs); return *this; }
```

- "1. use the copy constructor to create a local copy of the original object." The parameter `rhs` is taken by value, so that copy happens before the body runs.
- "2. acquire the copied data with a swap function, swapping old data with new."
- "3. the temporary local copy is destroyed, taking the old data and leaving the new data in the destination."
- It needs "1. Working copy constructor 2. A swap function. 3. Working destructor". The swap must swap every data member and must not throw.

The trap: the by-value parameter is not a mistake to fix. It is step 1.

## The paper's question, worked: Q16

The program below builds the whole idiom on a Character that owns an array of skill ids.

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

The easy errors are each one line away from the right code.

- **Parameter by reference**, `Character& operator=(Character& other)`. No copy is made, so the swap hands the right-hand object your old data.
- **`std::swap(*this, other)` on the whole object.** The slide warns "it uses the copy constructor and the copy assignment operator → recursive spiral". `std::swap` calls `operator=`, which calls `std::swap`, until the stack overflows.
- **A member left out of `mySwap`.** Both objects end up with mixed state, for example b's old count with a's array.

:::warn Swap the members, never the whole object
Inside `operator=`, swap each member with `using std::swap;` and `swap(first.name, second.name);`. Calling `std::swap` on two whole objects calls `operator=` again.
:::

```widget
copy-swap
{ "mode": "swap", "predict": true }
```

## Try it

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
  },
  {
    "q": "The parameter of `operator=` is a reference. What does this program print?",
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
    "q": "A `Character` whose copy assignment is `Character& operator=(Character other) { std::swap(*this, other); return *this; }`. What happens when `b = a;` runs?",
    "options": [
      "`std::swap` calls `operator=` again, which calls `std::swap` again: the recursion never ends and the program crashes",
      "It works: `std::swap` exchanges the whole object in one step",
      "It does not compile: `std::swap` cannot take a class type",
      "It works but leaks the old data, because no destructor runs"
    ],
    "answer": 0,
    "explain": "1. `b = a;` copies a into `other` and enters `operator=`.\n2. `std::swap(*this, other)` is written with a temporary and assignments: `*this = ...` inside it calls `operator=` again.\n3. That call reaches `std::swap` again, and so on. The slide: \"Don't use std::swap on the ENTIRE object: it uses the copy constructor and the copy assignment operator → recursive spiral.\" On the app's server the program crashes with a stack overflow (exit code 253) at `b = a;`; nothing after that line prints. Swap the members one by one in `mySwap` instead."
  },
  {
    "q": "In copy-and-swap, the left-hand object's old array is freed by the destructor of the by-value parameter, when `operator=` returns.",
    "type": "tf",
    "answer": true,
    "explain": "After the swap, the parameter holds the left-hand object's old pointer. The parameter is a local object, so its destructor runs as the function ends and its `delete[]` frees that old array. No line of `operator=` calls `delete` by hand."
  }
]
```

## Remember

- A class that owns heap memory needs its own copy constructor that makes a new array: a deep copy.
- Copy-and-swap: the by-value parameter copies, the swap trades every member, the parameter's destructor frees the old data.
- The easy errors: a reference parameter, `std::swap` on the whole object, a member missing from the swap.
- *On the sheet:* Sheet side 2, band 3 "Write the function / class / program" (Deep copy), and side 2, band 2 "What is X? How is it different from Y? When is it used?" (Copy and swap).
