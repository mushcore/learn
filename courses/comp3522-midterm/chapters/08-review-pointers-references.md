---
title: "Review 2: pointers, references and memory (Q2 to Q6: 19 marks of definitions)"
minutes: 40
---
:::quiz What the paper asks and what earns the marks
Part A of the practice midterm asks five written definitions in a row: Q2 reference vs pointer (3 marks), Q3 pass by value, by pointer, by reference (4), Q4 `&success` vs `*success` (4), Q5 static vs dynamic allocation (4), Q6 memory leak with a function and an underlined fix (4). That is 19 of 105 marks with no output to trace. The marker looks for three moves in each answer: the definition in the slide's term, the contrast with the thing it is confused with, and one line of code. The same ideas come back in the what-prints questions, so a wrong picture of memory costs marks twice.
:::

**Understand before the exam (cannot be looked up):**

- A variable is a named box with an address. A pointer is another box whose contents are an address.
- `*p` goes to the box `p` points at, to read it or write it. `&x` gives the address of `x`.
- A reference is a second name for an existing box. Assigning to it writes that box; it never moves to another box.
- What a function receives decides what it can change: a copy (by value), an address (by pointer), or the caller's box under a new name (by reference).
- `new` makes a box that outlives the function; only `delete` ends it. A box nobody points at any more is a leak.

**On the sheet (look up, do not memorise):**

- *Sheet side 1, "B. Pointers, references, memory"*: the declaration forms, `->`, `new`/`delete`/`new[]`/`delete[]`, leak and dangling pointer.
- *Sheet side 1, "C. Definitions in three moves"*: the condensed answers to Q2 to Q6, to check your wording against.
- *Sheet side 1, "D. Right-left rule"*: for reading a type like `string**` aloud.

Do if time is short: the box pictures, swap three ways, the stack and the heap, the leak, then the five answers. The Q4 section and the new variants are marked "if time".

The new programs borrow names from a MapleStory Classic quester: mob 7 is the Slime, Grendel the Really Old is an NPC, a character climbs from level 1 to 30.

## Boxes, addresses and names, from zero

Start with one variable. `int level = 1;` makes a box named `level` somewhere in memory, at an address the computer picks. Draw every variable this way: name, address, contents.

```diagram
{ "type": "grid", "title": "Step 1: int level = 1;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "1", "row": 1, "col": 2 }
], "hi": ["a2"], "caption": "One box. The address is made up for the picture; a real run prints something like 0x61fe14." }
```

A pointer is a box that holds an address. `int* p = &level;` reads right to left: `&level` is the address of `level`, and `p` stores it. Then `*p = 10;` follows the address and writes into the box at the end of it.

```diagram
{ "type": "grid", "title": "Step 2: int* p = &level; then *p = 10;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "10", "sub": "written through p", "row": 1, "col": 2 },
  { "id": "b0", "label": "p", "sub": "int*", "row": 2, "col": 0 },
  { "id": "b1", "label": "0x1008", "row": 2, "col": 1 },
  { "id": "b2", "label": "0x1000", "sub": "level's address", "row": 2, "col": 2 }
], "hi": ["a2", "b2"], "caption": "p is its own box with its own address. *p means the box at 0x1000, which is level." }
```

The two uses of `*` and `&`. In a declaration, `int*` means "pointer to int" and `int&` means "reference to int". In an expression, `*p` dereferences and `&x` takes an address. The lecture's rule for `&`: a type to its left means a reference, otherwise it is address-of.

A reference is a second name for a box that already exists. `int& lv = level;` makes no new box: `lv` and `level` are the same box. The slides call it an **alias**: "anything done to the reference is done to the referent". So it must be initialized when declared; there is nothing for it to name otherwise.

```diagram
{ "type": "grid", "title": "Step 3: int& lv = level; then lv = 30;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level, lv", "sub": "two names", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "30", "row": 1, "col": 2 },
  { "id": "b0", "label": "p", "row": 2, "col": 0 },
  { "id": "b1", "label": "0x1008", "row": 2, "col": 1 },
  { "id": "b2", "label": "0x1000", "row": 2, "col": 2 }
], "hi": ["a0"], "caption": "No row for lv: it is a name on level's box, not a box." }
```

A reference is never re-seated. `lv = jobLevel;` does not make `lv` name `jobLevel`; it copies the value of `jobLevel` into `level`. A pointer is different: `p = &jobLevel;` changes what `p` holds, so it now points somewhere else.

```diagram
{ "type": "grid", "title": "Step 4: lv = jobLevel; jobLevel = 99; p = &jobLevel;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level, lv", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "2", "sub": "copied, not linked", "row": 1, "col": 2 },
  { "id": "b0", "label": "p", "row": 2, "col": 0 },
  { "id": "b1", "label": "0x1008", "row": 2, "col": 1 },
  { "id": "b2", "label": "0x1010", "sub": "re-pointed", "row": 2, "col": 2 },
  { "id": "c0", "label": "jobLevel", "row": 3, "col": 0 },
  { "id": "c1", "label": "0x1010", "row": 3, "col": 1 },
  { "id": "c2", "label": "99", "row": 3, "col": 2 }
], "hi": ["a2", "b2"], "caption": "Assigning to a reference changes the referent's value. Assigning to a pointer changes where it points." }
```

For a pointer to an object, `->` reaches a member through the pointer: `target->name` is shorthand for `(*target).name`. The parentheses matter, because `.` binds tighter than `*`.

Check the four pictures against a real run.

```cpp run pin boxes.cpp
// predict: Write the six lines printed (the last line prints the word "same" or "different", not an address).
#include <iostream>
#include <string>
using namespace std;

struct Mob
{
    int id;
    string name;
};

int main()
{
    int level = 1;
    int* p = &level;              // p holds level's address
    *p = 10;                      // write through p: level is now 10
    cout << level << endl;

    int& lv = level;              // lv is a second name for level
    lv = 30;                      // writes level
    cout << level << endl;

    int jobLevel = 2;
    lv = jobLevel;                // copies 2 into level; lv still names level
    jobLevel = 99;                // level does not follow jobLevel
    cout << level << " " << jobLevel << endl;

    p = &jobLevel;                // a pointer can be re-pointed
    cout << *p << endl;

    Mob slime{7, "Slime"};
    Mob* target = &slime;
    cout << target->name << " " << (*target).id << endl;

    cout << (&lv == &level ? "same" : "different") << endl;
    return 0;
}
```

1. `*p = 10;` writes into the box at `level`'s address, so `cout << level << endl;` prints `10`.
2. `lv = 30;` writes the same box under its second name: `30`.
3. `lv = jobLevel;` copies 2 into `level`; `jobLevel = 99;` touches only `jobLevel`: `2 99`.
4. `p = &jobLevel;` re-points `p`, so `*p` now reads `jobLevel`: `99`.
5. `target->name` and `(*target).id` are the same access written two ways: `Slime 7`.
6. A reference has no address of its own; `&lv` gives the address of `level`: `same`.

Step through the same moves with arrows drawn for you:

```widget
pointer-viz
{ "program": "int main()\n{\n    int level = 1;\n    int* p = &level;\n    *p = 10;\n    int& lv = level;\n    lv = 30;\n    int jobLevel = 2;\n    lv = jobLevel;\n    jobLevel = 99;\n    p = &jobLevel;\n    return 0;\n}", "watch": ["level", "jobLevel"], "presets": false, "title": "level, p, lv and jobLevel" }
```

## Swap three ways (Q3)

The slides ask whether a function can swap two `int`s. One program holds all three versions; the last call swaps them back.

```cpp run pin swapThree.cpp
// predict: Three lines, two numbers each.
#include <iostream>
using namespace std;

void swapValue(int arg1, int arg2)        // copies
{
    int temp{arg1};
    arg1 = arg2;
    arg2 = temp;
}

void swapPointer(int* arg1, int* arg2)    // copies of two addresses
{
    int temp{*arg1};
    *arg1 = *arg2;
    *arg2 = temp;
}

void swapReference(int& arg1, int& arg2)  // new names for the originals
{
    int temp{arg1};
    arg1 = arg2;
    arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};

    swapValue(first, second);
    cout << first << " " << second << endl;

    swapPointer(&first, &second);
    cout << first << " " << second << endl;

    swapReference(first, second);
    cout << first << " " << second << endl;
    return 0;
}
```

1. `swapValue(first, second);` gives the function two new boxes holding copies. It swaps the copies, which die at the closing brace: `3522 2526`, unchanged.
2. `swapPointer(&first, &second);` copies two addresses. `*arg1 = *arg2;` follows them into `main`'s boxes: `2526 3522`.
3. `swapReference(first, second);` makes `arg1` and `arg2` second names for `first` and `second`, so the body writes the originals and swaps them back: `3522 2526`.

```diagram
{ "type": "grid", "title": "What the function receives", "nodes": [
  { "id": "h0", "label": "style", "row": 0, "col": 0 },
  { "id": "h1", "label": "parameter gets", "row": 0, "col": 1 },
  { "id": "h2", "label": "caller changes?", "row": 0, "col": 2 },
  { "id": "h3", "label": "choose it for", "row": 0, "col": 3 },
  { "id": "a0", "label": "by value", "sub": "int x", "row": 1, "col": 0 },
  { "id": "a1", "label": "a copy", "row": 1, "col": 1 },
  { "id": "a2", "label": "no", "row": 1, "col": 2 },
  { "id": "a3", "label": "small types it must not change", "row": 1, "col": 3 },
  { "id": "b0", "label": "by pointer", "sub": "int* x", "row": 2, "col": 0 },
  { "id": "b1", "label": "a copy of an address", "row": 2, "col": 1 },
  { "id": "b2", "label": "yes, via *x", "row": 2, "col": 2 },
  { "id": "b3", "label": "nullptr = no object, arrays, C", "row": 2, "col": 3 },
  { "id": "c0", "label": "by reference", "sub": "int& x", "row": 3, "col": 0 },
  { "id": "c1", "label": "the caller's box", "row": 3, "col": 1 },
  { "id": "c2", "label": "yes, directly", "row": 3, "col": 2 },
  { "id": "c3", "label": "change it, or const T& for no copy", "row": 3, "col": 3 }
], "hi": ["c3"], "caption": "The slides: references are used for efficiency (no copy). Pointers and references compile to the same machine code; references are for the programmer." }
```

The same choice shows up in a quester's engine. `void tick(Engine& e)` lets each 30 ms tick update the one engine; `void tick(Engine e)` would update a copy that dies when the tick returns.

## Q4: `*success` and `&success` (if time)

Q4 says "we have a pointer to a string called success". Draw it first: a string box, and a pointer box holding the string's address.

```diagram
{ "type": "grid", "title": "string* success = &step;", "nodes": [
  { "id": "h0", "label": "expression", "row": 0, "col": 0 },
  { "id": "h1", "label": "type", "row": 0, "col": 1 },
  { "id": "h2", "label": "what it is", "row": 0, "col": 2 },
  { "id": "a0", "label": "success", "row": 1, "col": 0 },
  { "id": "a1", "label": "string*", "row": 1, "col": 1 },
  { "id": "a2", "label": "0x2000, step's address", "row": 1, "col": 2 },
  { "id": "b0", "label": "*success", "row": 2, "col": 0 },
  { "id": "b1", "label": "string", "row": 2, "col": 1 },
  { "id": "b2", "label": "the string itself", "row": 2, "col": 2 },
  { "id": "c0", "label": "&success", "row": 3, "col": 0 },
  { "id": "c1", "label": "string**", "row": 3, "col": 1 },
  { "id": "c2", "label": "0x2040, where the pointer lives", "row": 3, "col": 2 }
], "hi": ["b0", "c0"], "caption": "One star goes down to the string; one ampersand goes up to the pointer's own box." }
```

```cpp run pin success.cpp
// predict: Five lines (the fourth prints the word "same" or "different", not an address).
#include <iostream>
#include <string>
using namespace std;

void reset(string** pp, string& target)   // gets the pointer's address, so it can re-point it
{
    *pp = &target;
}

int main()
{
    string step = "talk to Grendel";
    string next = "hunt Slime";
    string* success = &step;              // a pointer to a string called success

    cout << *success << endl;             // *success: the string it points to
    cout << success->length() << endl;    // a member through the pointer
    *success = "done";                    // writes step
    cout << step << endl;

    string** pp = &success;               // &success: the pointer's own address
    cout << (*pp == &step ? "same" : "different") << endl;

    reset(&success, next);                // success now points at next
    cout << *success << endl;
    return 0;
}
```

1. `cout << *success << endl;` reads the string: `talk to Grendel`.
2. `success->length()` is a member of that string: `15` characters.
3. `*success = "done";` writes `step` through the pointer, so `cout << step << endl;` prints `done`.
4. `string** pp = &success;` holds the pointer's address; `*pp` is `success` again, which holds `&step`: `same`.
5. `reset(&success, next);` hands over the pointer's address, so `*pp = &target;` changes where `success` points: `hunt Slime`.

## The stack and the heap (Q5)

A local variable lives on the **stack**. The slides call this automatic allocation: the box is made at its declaration, its size is fixed when the program is compiled, and it is destroyed when its scope ends. The exam's word for it is static allocation.

`new` allocates on the **heap** at run time and returns a pointer. The slides: "dynamic = manual". The box survives the end of the function and lives until `delete`. The size can be chosen while the program runs: `new int[n]`. C++ has no garbage collector.

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
2. `new Mob(7, "heap Slime")` runs it on the heap: `spawn heap Slime`.
3. `return m;` copies the address out; then `spawn` ends and `local` is destroyed: `gone stack Slime`.
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

## Leaks, dangling pointers and nullptr (Q6)

That last caption is the whole story of a leak. When the only pointer to a heap box dies or is re-pointed, the box is still allocated and nothing can reach it. The lecture's rule: every `new` needs a `delete`. Pair `new` with `delete` and `new[]` with `delete[]`.

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
2. `huntLeaks` returns. The stack box `pack` is gone; the three heap Mobs are not, and no pointer reaches them: `after huntLeaks, alive 3`.
3. `huntFixed` makes three more: `hunting, alive 6`.
4. `delete[] pack;` runs three destructors and frees the array: `after huntFixed, alive 3`. The leaked three stay until the program exits.

The slides' other leak re-points before deleting: `i = a;` then `delete i;` frees the second block and loses the first. Their fix: `delete i;` first, then `i = a;`.

After `delete p;` the pointer still holds the old address. It is now a **dangling pointer**: reading `*p` is undefined behaviour, and a second `delete p;` is too. Write `p = nullptr;` straight after the `delete`. A null pointer can be tested with `if (p != nullptr)`, and deleting `nullptr` does nothing.

## The five answers in three moves

Each answer below is marked on its points. Write yours in the box before you reveal the model: the slide's term, the contrast, one line of code.

```quiz
[
  {
    "type": "free",
    "q": "Q2 (3 marks). What is a reference? How is it different from a pointer?",
    "model": "A reference is an **alias**: another name for an existing variable, `int& ref = n;`. It must be initialized when it is declared, can never be re-seated (`ref = m;` copies m's value into n), and is used exactly like the variable itself. A pointer is a separate variable that holds an address, `int* p = &n;`: it may be null (`nullptr`), may be re-pointed (`p = &m;`), and needs `*p` or `->` to reach the variable.",
    "points": [
      "Reference: an alias, another name for an existing variable",
      "Must be initialized when declared",
      "Never re-seated: assigning to it changes the referent",
      "Pointer: a separate variable holding an address, may be nullptr",
      "Pointer can be re-pointed and needs * or -> to reach the variable",
      "A line of code: int& ref = n; and int* p = &n;"
    ],
    "rows": 5,
    "explain": "Move 1, the term: **alias** is the slides' word. Move 2, the contrast: a pointer is its own box with its own address, so it can hold `nullptr` and can be re-pointed; a reference is no box at all, so it must name something from the start and cannot switch. Move 3, the code: `int& ref = n;` beside `int* p = &n;`. The trap to name: `ref = m;` does not re-seat, it writes m's value into n."
  },
  {
    "type": "free",
    "q": "Q3 (4 marks). In C++, we may pass arguments to functions by value, by pointer, or by reference. What is the difference? Why would we choose one over the other?",
    "model": "By value (`void f(int x)`) copies the argument; the function works on its copy and cannot change the caller's variable. Choose it for small types the function must not change. By pointer (`void f(int* x)`, called `f(&n)`) copies an address; `*x` reaches and can change the caller's variable. Choose it when \"no object\" must be expressible with `nullptr`, for arrays, or for C-style code. By reference (`void f(int& x)`, called `f(n)`) passes the caller's variable under a new name: no copy, no `*`, and the function can change it. Choose it to modify the caller's variable or to avoid copying a large object; `const Big& x` gives no copy and no modification.",
    "points": [
      "By value: a copy, the caller's variable cannot change",
      "By pointer: an address is passed, *x changes the caller's variable",
      "By reference: the caller's variable under a new name, no copy",
      "Why pointer: nullptr for no object, arrays, C code",
      "Why reference: modify the caller or avoid a copy; const T& for safety",
      "Code: swap(int a, int b) fails; swap(int* a, int* b) and swap(int& a, int& b) work"
    ],
    "rows": 6,
    "explain": "Move 1: name what each parameter receives: a copy, an address, the variable itself. Move 2: the contrast is who can change the caller's variable (value: no; pointer: yes, through `*`; reference: yes, directly) and what each costs (a copy for value, nothing for the other two). Move 3: the three swap headers, with `swap(&first, &second)` for the pointer call and `swap(first, second)` for the other two. The question also asks why you would choose each, so give a reason per style: `nullptr` for the pointer, efficiency and `const T&` for the reference."
  },
  {
    "type": "free",
    "q": "Q4 (4 marks). Suppose we have a pointer to a string called success. What is the difference between &success and *success? When would we use each of these?",
    "model": "With `string* success = &s;`, `*success` dereferences the pointer: it is the `string` object the pointer points to. Use it to read or change the string: `cout << *success;`, `*success = \"done\";` (and `success->length()` for a member). `&success` is the address of the pointer variable itself, of type `string**`. Use it to pass the pointer to a function that must change where it points, `void reset(string** pp)` doing `*pp = &other;`, or to see where the pointer lives.",
    "points": [
      "*success is the string the pointer points to (dereference)",
      "Use *success to read or change the string (or -> for members)",
      "&success is the address of the pointer itself",
      "&success has type string**",
      "Use &success so a function can re-point success (string** parameter)"
    ],
    "rows": 5,
    "explain": "Move 1: `*` is dereference, `&` is address-of. Move 2: they go in opposite directions from the pointer box: `*success` goes down to the string, `&success` goes up to the pointer's own box, so the types differ (`string` vs `string**`). Move 3: `cout << *success;` for the first and `reset(&success, other);` with a `string**` parameter for the second. Do not write that `&success` is the string's address: that is the value stored in `success`, not `&success`."
  },
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
  }
]
```

## New variants (if time)

Each program is new; write the output on paper, then check.

```quiz
[
  {
    "q": "What prints? (The Week 2 practice sheet's test(int& x, int y, int* z) in new names.)",
    "code": "void tick(int& mp, int hp, int* level)\n{\n    mp -= 5;\n    hp -= 5;\n    (*level)++;\n}\n\nint main()\n{\n    int mp = 50;\n    int hp = 80;\n    int lv = 9;\n    int* p = &lv;\n    tick(mp, hp, p);\n    cout << mp << \" \" << hp << \" \" << *p << endl;\n    return 0;\n}",
    "options": ["45 80 10", "45 75 10", "50 80 9", "45 80 9"],
    "answer": 0,
    "explain": "1. `mp` is a reference parameter, so `mp -= 5;` writes `main`'s `mp`: 45.\n2. `hp` is by value, so `hp -= 5;` changes a copy that dies on return: `main`'s `hp` stays 80.\n3. `level` is a copy of `p`, which holds the address of `lv`; `(*level)++;` follows it and makes `lv` 10.\n4. `*p` reads `lv`: the line is `45 80 10`."
  },
  {
    "q": "What prints?",
    "code": "int channel = 3;\nint other = 7;\nint& ch = channel;\nch = other;\nother = 12;\ncout << channel << \" \" << other << \" \" << ch << endl;",
    "options": ["7 12 7", "7 12 12", "3 12 12", "12 12 12"],
    "answer": 0,
    "explain": "1. `int& ch = channel;` binds `ch` to `channel` for good.\n2. `ch = other;` is `channel = other;`: `channel` becomes 7. It does not re-seat `ch`.\n3. `other = 12;` changes only `other`.\n4. `ch` is still `channel`, so the line is `7 12 7`."
  },
  {
    "q": "What prints?",
    "code": "int a = 1;\nint b = 2;\nint* p = &a;\nint* q = p;\n*q = 5;\nq = &b;\n*q = 9;\ncout << a << \" \" << b << \" \" << *p << endl;",
    "options": ["5 9 5", "5 9 9", "1 9 1", "9 9 9"],
    "answer": 0,
    "explain": "1. `int* q = p;` copies the address of `a` into `q`: two pointers, one target.\n2. `*q = 5;` writes `a`: 5.\n3. `q = &b;` re-points only `q`; `p` still holds `a`'s address.\n4. `*q = 9;` writes `b`: 9.\n5. `*p` reads `a`, so the line is `5 9 5`."
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
    "q": "What prints? (A pointer passed by value, set against Q4's string** version.)",
    "code": "void retarget(string* s, string& other)\n{\n    s = &other;\n    *s = \"hunt Slime\";\n}\n\nint main()\n{\n    string step = \"talk to Grendel\";\n    string next = \"rest\";\n    string* success = &step;\n    retarget(success, next);\n    cout << *success << \" | \" << next << endl;\n    return 0;\n}",
    "options": ["talk to Grendel | hunt Slime", "hunt Slime | hunt Slime", "hunt Slime | rest", "talk to Grendel | rest"],
    "answer": 0,
    "explain": "1. `retarget(success, next);` copies the address in `success` into `s`. The pointer itself is passed by value.\n2. `s = &other;` re-points the copy `s` at `next`; `main`'s `success` still points at `step`.\n3. `*s = \"hunt Slime\";` writes through `s`, so `next` becomes `hunt Slime`.\n4. `*success` is still `step`: the line is `talk to Grendel | hunt Slime`. To re-point `success` itself, the function needs `string**` (called with `&success`) or `string*&`."
  },
  {
    "q": "True or false: after `int* hp = new int(80); delete hp;`, the pointer `hp` holds `nullptr`.",
    "type": "tf",
    "answer": false,
    "explain": "1. `delete hp;` frees the heap int and runs nothing else on the pointer.\n2. `hp` keeps the old address: it is a dangling pointer, and reading `*hp` or deleting it again is undefined behaviour.\n3. So assign `nullptr` yourself, as the slides do for any empty pointer: `delete hp; hp = nullptr;`. Deleting a null pointer is safe and does nothing."
  }
]
```
