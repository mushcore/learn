---
title: "Core 5: the stack and the heap: new, delete, leaks and dangling pointers (Q5, Q6)"
minutes: 15
---
This lesson shows the two places a program keeps its boxes, and what goes wrong when one of them is not cleaned up. It prepares Q5, static versus dynamic allocation, and Q6, the memory leak you write and then plug.

## What the stack and the heap are, in plain words

Every function call gets a stack frame: a block of boxes for its own variables. The boxes appear at their declarations and vanish by themselves when the function ends.

The slides call this automatic allocation. The exam calls it static allocation, and its sizes are fixed when the program is compiled.

The heap is a second store of boxes that you ask for yourself while the program runs. A heap box has no name, so you reach it through a pointer that holds its address.

A heap box stays until you hand it back. C++ has no garbage collector, so nothing cleans it up for you.

```diagram
{ "type": "grid", "title": "Two places a box can live", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "stack", "sub": "static, automatic", "row": 0, "col": 1 },
  { "id": "h2", "label": "heap", "sub": "dynamic", "row": 0, "col": 2 },
  { "id": "a0", "label": "made by", "row": 1, "col": 0 },
  { "id": "a1", "label": "the declaration", "row": 1, "col": 1 },
  { "id": "a2", "label": "new, at run time", "row": 1, "col": 2 },
  { "id": "b0", "label": "size known", "row": 2, "col": 0 },
  { "id": "b1", "label": "at compile time", "row": 2, "col": 1 },
  { "id": "b2", "label": "can be chosen at run time", "row": 2, "col": 2 },
  { "id": "c0", "label": "reached by", "row": 3, "col": 0 },
  { "id": "c1", "label": "its name", "row": 3, "col": 1 },
  { "id": "c2", "label": "a pointer", "row": 3, "col": 2 },
  { "id": "d0", "label": "ends at", "row": 4, "col": 0 },
  { "id": "d1", "label": "the end of its scope", "row": 4, "col": 1 },
  { "id": "d2", "label": "delete", "row": 4, "col": 2 }
], "hi": ["d1", "d2"], "caption": "A stack box ends by itself at the end of its scope; a heap box ends only at delete." }
```

## A tiny program you can run in your head

`new` makes one heap box and gives back its address. `delete` hands the box back.

```cpp run pin heapInt.cpp
// predict: Three lines (the last prints the word "empty" or "not empty").
#include <iostream>
using namespace std;

int main()
{
    int* hp = new int(80);        // a heap box holding 80; hp holds its address
    cout << *hp << endl;
    *hp -= 30;
    cout << *hp << endl;

    delete hp;                    // the heap box is gone; hp still holds the old address
    hp = nullptr;                 // now hp says "no box"
    cout << (hp == nullptr ? "empty" : "not empty") << endl;
    return 0;
}
```

1. `int* hp = new int(80);` makes a heap int holding 80. The stack box `hp` holds its address, so `cout << *hp << endl;` prints `80`.
2. `*hp -= 30;` writes through the pointer: `50`.
3. `delete hp;` frees the heap box, and `hp = nullptr;` empties the pointer: `empty`.

Two boxes were involved all along. `hp` lives on the stack, and the int it points at lives on the heap.

## The rule, in the slide's words

- "Dynamic = manual": the instructor's warning is that dynamic memory management is manual memory management.
- `new` and `new[]` "return a pointer" to the memory just allocated.
- Every `new` needs a `delete`. Pair `new` with `delete` and `new[]` with `delete[]`.

## Dangling pointers and nullptr

After `delete p;` the pointer still holds the old address. It is now a **dangling pointer**: it points at a box that no longer belongs to you.

Reading `*p` through a dangling pointer is undefined behaviour, and a second `delete p;` is too. So write `p = nullptr;` straight after the `delete`.

`nullptr` is the pointer value that means "points at nothing". It can be tested with `if (p != nullptr)`, and deleting it does nothing.

## Both places in one program

A constructor is the function that runs when an object is made, and a destructor runs when it ends. Here they print, so the output shows when each Mob lives and dies.

```cpp run pin stackHeap.cpp
// predict: Write every line printed, in order.
#include <iostream>
#include <string>
using namespace std;

class Mob
{
public:
    Mob(int id, string name) : id{id}, name{name} { cout << "spawn " << name << endl; }
    ~Mob() { cout << "gone " << name << endl; }
    int id;
    string name;
};

Mob* spawn()
{
    Mob local(7, "stack Slime");             // static (automatic): on the stack
    Mob* m = new Mob(7, "heap Slime");       // dynamic: on the heap
    return m;                                // local dies here; *m does not
}

int main()
{
    Mob* slime = spawn();
    cout << "back in main: " << slime->name << endl;
    delete slime;                            // the programmer ends it
    slime = nullptr;

    int n = 3;                               // a size chosen at run time
    int* skillIds = new int[n];
    for (int i = 0; i < n; ++i)
        skillIds[i] = 10 * (i + 1);
    cout << skillIds[0] << " " << skillIds[n - 1] << endl;
    delete[] skillIds;                       // new[] pairs with delete[]
    return 0;
}
```

1. `Mob local(7, "stack Slime");` runs the constructor: `spawn stack Slime`.
2. `new Mob(7, "heap Slime")` runs it for a heap Mob: `spawn heap Slime`.
3. `return m;` copies the address out. Then `spawn` ends and `local` is destroyed: `gone stack Slime`.
4. The heap Mob is still there: `back in main: heap Slime`.
5. `delete slime;` runs its destructor and frees it: `gone heap Slime`.
6. `new int[n]` made three ints with `n` known only at run time: `10 30`.

```diagram
{ "type": "grid", "title": "Where each box lives in stackHeap.cpp", "nodes": [
  { "id": "h0", "label": "box", "row": 0, "col": 0 },
  { "id": "h1", "label": "where", "row": 0, "col": 1 },
  { "id": "h2", "label": "made by", "row": 0, "col": 2 },
  { "id": "h3", "label": "ends at", "row": 0, "col": 3 },
  { "id": "a0", "label": "local", "row": 1, "col": 0 },
  { "id": "a1", "label": "stack, spawn's frame", "row": 1, "col": 1 },
  { "id": "a2", "label": "its declaration", "row": 1, "col": 2 },
  { "id": "a3", "label": "spawn's closing brace", "row": 1, "col": 3 },
  { "id": "b0", "label": "m, slime", "sub": "the pointers", "row": 2, "col": 0 },
  { "id": "b1", "label": "stack", "row": 2, "col": 1 },
  { "id": "b2", "label": "their declarations", "row": 2, "col": 2 },
  { "id": "b3", "label": "their scopes' end", "row": 2, "col": 3 },
  { "id": "c0", "label": "the heap Mob", "row": 3, "col": 0 },
  { "id": "c1", "label": "heap", "row": 3, "col": 1 },
  { "id": "c2", "label": "new", "row": 3, "col": 2 },
  { "id": "c3", "label": "delete slime;", "row": 3, "col": 3 },
  { "id": "d0", "label": "three ints", "row": 4, "col": 0 },
  { "id": "d1", "label": "heap", "row": 4, "col": 1 },
  { "id": "d2", "label": "new int[n]", "row": 4, "col": 2 },
  { "id": "d3", "label": "delete[] skillIds;", "row": 4, "col": 3 }
], "hi": ["c3", "d3"], "caption": "The pointer is a stack box; what it points at is a heap box. Ending one does not end the other." }
```

## The paper's question, worked: a leak and its fix

A memory leak is a heap box that is never deleted. Once the last pointer to it is gone, nothing can reach it, yet it stays allocated until the program exits.

The usual way it happens: the pointer is a stack box, so it vanishes when the function ends. The heap boxes it pointed at do not vanish with it.

```diagram
{ "type": "flow", "title": "How huntLeaks leaks", "nodes": [
  { "id": "a", "label": "new Mob[3]", "sub": "three heap Mobs" },
  { "id": "b", "label": "pack holds", "sub": "their address" },
  { "id": "c", "label": "closing brace", "sub": "pack is gone" },
  { "id": "d", "label": "three Mobs left", "sub": "no pointer to them" }
], "edges": [
  { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" }
], "hi": ["d"], "caption": "A leak is heap memory still allocated after the last pointer to it is gone." }
```

In the program, `static int alive` is one counter shared by every Mob. Each constructor adds one and each destructor takes one away.

```cpp run pin leak.cpp
// predict: Four lines. Mob::alive counts the Mobs that exist right now.
#include <iostream>
using namespace std;

struct Mob
{
    static int alive;
    int hp = 50;
    Mob() { ++alive; }
    ~Mob() { --alive; }
};
int Mob::alive = 0;

void huntLeaks()
{
    Mob* pack = new Mob[3];
    pack[0].hp -= 10;
    cout << "hunting, alive " << Mob::alive << endl;
}   // pack (the pointer) dies here; the three Mobs do not

void huntFixed()
{
    Mob* pack = new Mob[3];
    pack[0].hp -= 10;
    cout << "hunting, alive " << Mob::alive << endl;
    delete[] pack;      // the fix: underline it on paper
    pack = nullptr;     // no dangling address left behind
}

int main()
{
    huntLeaks();
    cout << "after huntLeaks, alive " << Mob::alive << endl;
    huntFixed();
    cout << "after huntFixed, alive " << Mob::alive << endl;
    return 0;
}
```

1. `Mob* pack = new Mob[3];` runs three constructors: `hunting, alive 3`.
2. `huntLeaks` returns. The stack box `pack` is gone, but the three heap Mobs are not, and no pointer reaches them: `after huntLeaks, alive 3`.
3. `huntFixed` makes three more: `hunting, alive 6`.
4. `delete[] pack;` runs three destructors and frees the array: `after huntFixed, alive 3`. The leaked three stay until the program exits.

:::warn Re-pointing before delete also leaks
The slides' other leak is `i = a;` then `delete i;`. That frees the second block and loses the first, so the fix is `delete i;` first, then `i = a;`.
:::

## Try it

```quiz
[
  {
    "type": "free",
    "q": "Q5 (4 marks). What is the difference between static allocation and dynamic allocation? You may provide code snippets to help illustrate the difference.",
    "model": "Static (automatic) allocation happens at the declaration: `int x = 5; Fraction f(1, 2);` live on the stack, their size is known at compile time, and they are destroyed automatically when their scope ends. Dynamic allocation happens at run time with `new`: `int* p = new int(5); Fraction* f = new Fraction(1, 2);` live on the heap, are reached through a pointer, can have a size decided at run time (`new int[n]`), and live until the programmer frees them with `delete p; delete f;` (`delete[]` for arrays). Dynamic means manual: there is no garbage collector.",
    "points": [
      "Static/automatic: stack, made at the declaration",
      "Static: size fixed at compile time, destroyed when the scope ends",
      "Dynamic: new at run time, on the heap, returns a pointer",
      "Dynamic: lives until delete; the programmer must free it",
      "Dynamic size can be chosen at run time: new int[n]",
      "Code for both: int x = 5; and int* p = new int(5); delete p;"
    ],
    "rows": 5,
    "explain": "Move 1: the words stack, heap, `new`, `delete`. Move 2: the contrast is lifetime (scope end vs `delete`), size (compile time vs run time) and who cleans up (the compiler vs the programmer). Move 3: one line of each, with the matching `delete`. The word static here means automatic stack allocation; it is not the `static` keyword of Week 7."
  },
  {
    "type": "free",
    "q": "Q6 (4 marks). What is a memory leak? How do we prevent memory leaks in C++? Write a short function to demonstrate code that generates a memory leak, and then 'insert' and underline some code that 'plugs' the leak.",
    "model": "A memory leak is heap memory allocated with `new` that is never released with `delete`, so once no pointer reaches it, it stays allocated until the program ends. Prevent it by pairing every `new` with a `delete` (`new[]` with `delete[]`), deleting before re-pointing an owning pointer, freeing owned memory in the class's destructor, and setting deleted pointers to `nullptr`. `void leak() { int* p = new int[100]; p[0] = 1; }` leaks the 100 ints when `p` goes out of scope; the fix is the underlined line `delete[] p;` before the closing brace.",
    "points": [
      "Leak: memory from new never freed with delete",
      "Unreachable once the last pointer to it is gone",
      "Prevent: every new has a delete, new[] has delete[]",
      "Free owned memory in the destructor; delete before re-pointing",
      "A function with new and no delete",
      "The fix inserted and underlined: delete[] p;"
    ],
    "rows": 6,
    "explain": "Move 1: the definition names `new`, `delete` and the heap. Move 2: the contrast is a stack variable, which frees itself at scope end, against heap memory, which waits for `delete` forever. Move 3: the function, then the one inserted line, underlined on paper. Use `delete[]` because the function used `new[]`; plain `delete` on an array from `new[]` is undefined behaviour."
  },
  {
    "q": "What prints? (The slides' leak, with constructors and destructors that print.)",
    "code": "struct Mob\n{\n    string name;\n    Mob(string n) : name{n} { cout << \"spawn \" << name << endl; }\n    ~Mob() { cout << \"gone \" << name << endl; }\n};\n\nint main()\n{\n    Mob a(\"Slime A\");\n    Mob* b = new Mob(\"Slime B\");\n    Mob* c = new Mob(\"Slime C\");\n    b = c;\n    delete b;\n    cout << \"end of main\" << endl;\n    return 0;\n}",
    "options": [
      "spawn Slime A\nspawn Slime B\nspawn Slime C\ngone Slime C\nend of main\ngone Slime A",
      "spawn Slime A\nspawn Slime B\nspawn Slime C\ngone Slime B\nend of main\ngone Slime A",
      "spawn Slime A\nspawn Slime B\nspawn Slime C\ngone Slime C\nend of main\ngone Slime B\ngone Slime A",
      "spawn Slime A\nspawn Slime B\nspawn Slime C\ngone Slime C\ngone Slime A\nend of main"
    ],
    "answer": 0,
    "explain": "1. `Mob a(\"Slime A\");` is on the stack: `spawn Slime A`.\n2. The two `new` calls print `spawn Slime B` and `spawn Slime C`.\n3. `b = c;` copies C's address into `b`. Nothing points at Slime B any more: it has leaked.\n4. `delete b;` deletes what `b` points at now, Slime C: `gone Slime C`.\n5. `end of main` prints.\n6. At the closing brace the stack object `a` is destroyed: `gone Slime A`. Slime B's destructor never runs. The slides' fix: `delete b;` before `b = c;`."
  },
  {
    "q": "True or false: after `int* hp = new int(80); delete hp;`, the pointer `hp` holds `nullptr`.",
    "type": "tf",
    "answer": false,
    "explain": "1. `delete hp;` frees the heap int and runs nothing else on the pointer.\n2. `hp` keeps the old address: it is a dangling pointer, and reading `*hp` or deleting it again is undefined behaviour.\n3. So assign `nullptr` yourself, as the slides do for any empty pointer: `delete hp; hp = nullptr;`. Deleting a null pointer is safe and does nothing."
  }
]
```

## Remember

- A pointer is a stack box and what it points at is a heap box. Ending one does not end the other.
- Every `new` needs a `delete`, and `new[]` needs `delete[]`. Re-pointing first loses the old box.
- After `delete p;` write `p = nullptr;`, because `delete` leaves the old address behind.
- *On the sheet:* side 1 bottom and side 2, band 2 "What is X? How is it different from Y? When is it used?", for the Q5 and Q6 wording.
