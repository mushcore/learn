---
title: "Core 4: references, and swap by value, by pointer, by reference (Q2, Q3)"
minutes: 15
---
This lesson shows a second name for a box, and what a function can change depending on what it receives. It prepares Q2, reference versus pointer, and Q3, the three ways to pass an argument.

## What a reference is, in plain words

A reference is a second name for a box that already exists. No new box is made: the old box simply gets another label.

The slides call it an **alias**: "anything done to the reference is done to the referent". The referent is the box the reference names.

Think of a character with a nickname. Hitting "Slimey" hurts the same Slime, because there is only one Slime.

```diagram
{ "type": "grid", "title": "int& lv = level; then lv = 30;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level, lv", "sub": "two names", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "30", "row": 1, "col": 2 }
], "hi": ["a0"], "caption": "A reference is a second name on an existing box, not a new box." }
```

Because a reference is only a name, it must name something from the moment it is declared. It also keeps that one box for its whole life.

## A tiny program you can run in your head

The `&` after a type, as in `string&`, declares a reference. Here `q` becomes a second name for `quest`.

```cpp run pin questAlias.cpp
// predict: Three lines (the last prints the word "same" or "different").
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string quest = "hunt Slime";
    string& q = quest;            // q is a second name for quest
    q = "talk to Grendel";        // writes quest's box
    cout << quest << endl;

    string reward = "50 mesos";
    q = reward;                   // copies reward into quest; q still names quest
    reward = "nothing";
    cout << quest << " | " << reward << endl;

    cout << (&q == &quest ? "same" : "different") << endl;
    return 0;
}
```

1. `q = "talk to Grendel";` writes the only box there is, so `cout << quest << endl;` prints `talk to Grendel`.
2. `q = reward;` copies the text of `reward` into `quest`. Then `reward = "nothing";` changes only `reward`: `50 mesos | nothing`.
3. A reference has no address of its own. `&q` is the address of `quest`: `same`.

The second line is the surprise. Assigning to a reference never makes it name another box, it copies a value into the box it already names.

## The rule, in the slide's words

- A reference is "an alias": anything done to the reference is done to the referent.
- It "must be initialized when created". `int& ref;` does not compile.
- It is never re-seated. The slide's comment on `ref = m;` is "same as n = m".
- References are "used for efficiency": no copy is made.

A pointer is the other way to reach a box from somewhere else. It is a separate box holding an address, so it can be empty with `nullptr` and can be pointed somewhere new.

## A reference and a pointer side by side

The picture after both kinds of assignment. The reference row did not move; the pointer row did.

```diagram
{ "type": "grid", "title": "lv = jobLevel; jobLevel = 99; p = &jobLevel;", "nodes": [
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
3. `lv = jobLevel;` copies 2 into `level`. Then `jobLevel = 99;` touches only `jobLevel`: `2 99`.
4. `p = &jobLevel;` re-points `p`, so `*p` now reads `jobLevel`: `99`.
5. `target->name` and `(*target).id` are the same trip written two ways: `Slime 7`.
6. `&lv` gives the address of `level`, because a reference has none of its own: `same`.

Step through the same moves with the arrows drawn for you.

```widget
pointer-viz
{ "program": "int main()\n{\n    int level = 1;\n    int* p = &level;\n    *p = 10;\n    int& lv = level;\n    lv = 30;\n    int jobLevel = 2;\n    lv = jobLevel;\n    jobLevel = 99;\n    p = &jobLevel;\n    return 0;\n}", "watch": ["level", "jobLevel"], "presets": false, "title": "level, p, lv and jobLevel" }
```

## The paper's question, worked: swap three ways

A parameter is the function's own box, filled in at the call. What goes into it decides what the function can change back in the caller.

By value, the parameter gets a copy. By pointer, it gets a copy of an address. By reference, it becomes a second name for the caller's own box.

A `const` reference, such as `const Quest& q`, is the fourth choice. The function sees the caller's object with no copy made, and the compiler refuses any change to it.

The slides ask whether a function can swap two `int`s. One program holds all three versions, and the last call swaps them back.

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

1. `swapValue(first, second);` gives the function two new boxes holding copies. It swaps the copies, which die at its closing brace: `3522 2526`, unchanged.
2. `swapPointer(&first, &second);` copies two addresses. `*arg1 = *arg2;` follows them into `main`'s boxes: `2526 3522`.
3. `swapReference(first, second);` makes `arg1` and `arg2` second names for `first` and `second`. The body writes the originals and swaps them back: `3522 2526`.

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
], "hi": ["c3"], "caption": "What the parameter receives decides whether the caller's variable can change, and what the call copies." }
```

The same choice shows up in a quester's engine. `void tick(Engine& e)` lets each 30 ms tick update the one engine, while `void tick(Engine e)` would update a copy that dies when the tick returns.

## Try it

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
    "q": "What prints?",
    "code": "int channel = 3;\nint other = 7;\nint& ch = channel;\nch = other;\nother = 12;\ncout << channel << \" \" << other << \" \" << ch << endl;",
    "options": ["7 12 7", "7 12 12", "3 12 12", "12 12 12"],
    "answer": 0,
    "explain": "1. `int& ch = channel;` binds `ch` to `channel` for good.\n2. `ch = other;` is `channel = other;`: `channel` becomes 7. It does not re-seat `ch`.\n3. `other = 12;` changes only `other`.\n4. `ch` is still `channel`, so the line is `7 12 7`."
  },
  {
    "q": "What prints? (The Week 2 practice sheet's test(int& x, int y, int* z) in new names.)",
    "code": "void tick(int& mp, int hp, int* level)\n{\n    mp -= 5;\n    hp -= 5;\n    (*level)++;\n}\n\nint main()\n{\n    int mp = 50;\n    int hp = 80;\n    int lv = 9;\n    int* p = &lv;\n    tick(mp, hp, p);\n    cout << mp << \" \" << hp << \" \" << *p << endl;\n    return 0;\n}",
    "options": ["45 80 10", "45 75 10", "50 80 9", "45 80 9"],
    "answer": 0,
    "explain": "1. `mp` is a reference parameter, so `mp -= 5;` writes `main`'s `mp`: 45.\n2. `hp` is by value, so `hp -= 5;` changes a copy that dies on return: `main`'s `hp` stays 80.\n3. `level` is a copy of `p`, which holds the address of `lv`; `(*level)++;` follows it and makes `lv` 10.\n4. `*p` reads `lv`: the line is `45 80 10`."
  },
  {
    "q": "What prints? (A pointer passed by value.)",
    "code": "void retarget(string* s, string& other)\n{\n    s = &other;\n    *s = \"hunt Slime\";\n}\n\nint main()\n{\n    string step = \"talk to Grendel\";\n    string next = \"rest\";\n    string* success = &step;\n    retarget(success, next);\n    cout << *success << \" | \" << next << endl;\n    return 0;\n}",
    "options": ["talk to Grendel | hunt Slime", "hunt Slime | hunt Slime", "hunt Slime | rest", "talk to Grendel | rest"],
    "answer": 0,
    "explain": "1. `retarget(success, next);` copies the address in `success` into `s`. The pointer itself is passed by value.\n2. `s = &other;` re-points the copy `s` at `next`; `main`'s `success` still points at `step`.\n3. `*s = \"hunt Slime\";` writes through `s`, so `next` becomes `hunt Slime`.\n4. `*success` is still `step`: the line is `talk to Grendel | hunt Slime`. To re-point `success` itself, the function needs `string**` (called with `&success`) or `string*&`."
  },
  {
    "q": "True or false: `void show(const Quest& q)` copies the Quest it is given.",
    "type": "tf",
    "answer": false,
    "explain": "1. The `&` makes `q` a reference: a second name for the caller's Quest, so no copy is made.\n2. The `const` only forbids changes through `q`.\n3. That pair is why the slides use `const T&` for efficiency: no copy and no modification."
  }
]
```

## Remember

- A reference is a second name for one box. `r = m;` copies a value, it never re-seats `r`.
- A pointer is its own box: it can be `nullptr` and can be re-pointed.
- By value the function gets a copy; by pointer or by reference it can change the caller's variable.
- *On the sheet:* side 1 bottom and side 2, band 2 "What is X? How is it different from Y? When is it used?", for the Q2 and Q3 wording.
