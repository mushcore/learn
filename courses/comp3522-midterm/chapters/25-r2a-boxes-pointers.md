---
title: "Core 3: a variable is a box: addresses, pointers and the star (Q4)"
minutes: 15
---
This lesson draws memory as boxes and shows how one box can hold the location of another. It prepares Q4 on the paper, the difference between a pointer's star and its ampersand.

## What a variable and a pointer are, in plain words

A variable is a named box in memory. The box holds a value, and it sits at a numbered place called its address.

The computer picks the address when the program runs. You never choose it, but you can ask for it.

Draw every variable the same way: its name, its address, and what is inside. The addresses in these pictures are made up to keep them short.

```diagram
{ "type": "grid", "title": "Step 1: int level = 1;", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "address", "row": 0, "col": 1 },
  { "id": "h2", "label": "contents", "row": 0, "col": 2 },
  { "id": "a0", "label": "level", "row": 1, "col": 0 },
  { "id": "a1", "label": "0x1000", "row": 1, "col": 1 },
  { "id": "a2", "label": "1", "row": 1, "col": 2 }
], "hi": ["a2"], "caption": "A variable is one box: a name, an address, and the value inside." }
```

A pointer is a second box whose contents are an address. It is like a slip of paper with a house number on it: the slip is not the house, it tells you where the house is.

Following the slip to the house is called dereferencing. Once you are there you can read what is inside or put something new in.

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
], "hi": ["a2", "b2"], "caption": "A pointer is its own box with its own address; its contents are the address of another box." }
```

## A tiny program you can run in your head

Three symbols do all the work here. The ampersand in `&level` asks for the address of `level`, and the star in `*p` goes to the box whose address `p` holds.

```cpp run pin pointerBox.cpp
// predict: Four numbers, one per line.
#include <iostream>
using namespace std;

int main()
{
    int level = 1;
    int* p = &level;          // p holds level's address
    cout << *p << endl;       // read through p
    *p = 10;                  // write through p
    cout << level << endl;

    int jobLevel = 2;
    p = &jobLevel;            // p now holds jobLevel's address
    cout << *p << endl;
    cout << level << endl;
    return 0;
}
```

1. `int* p = &level;` stores the address of `level` in `p`. Then `cout << *p << endl;` follows that address and reads the box: `1`.
2. `*p = 10;` writes into the box at the end of the address, which is `level`. So `cout << level << endl;` prints `10`.
3. `p = &jobLevel;` puts a new address in `p`. Now `*p` reads `jobLevel`: `2`.
4. Nothing wrote to `level` after that, so the last `cout << level << endl;` prints `10` again.

The output makes sense once you see `p` as a separate box. Changing `p` moves the arrow; changing `*p` changes the box the arrow points at.

Step through the same moves with the arrows drawn for you.

```widget
pointer-viz
{ "program": "int main()\n{\n    int level = 1;\n    int* p = &level;\n    *p = 10;\n    int jobLevel = 2;\n    p = &jobLevel;\n    return 0;\n}", "watch": ["level", "jobLevel"], "presets": false, "title": "level, p and jobLevel" }
```

## Reaching a member through a pointer

A struct is a box with smaller named boxes inside, called members. A pointer can hold the address of the whole struct.

The arrow `->` goes through the pointer and then picks a member. It is shorthand for a star and a dot together.

```cpp run pin mobArrow.cpp
// predict: Three lines.
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
    Mob slime{7, "Slime"};
    Mob* target = &slime;         // target holds slime's address
    cout << target->name << endl;
    cout << (*target).id << endl;
    target->id = 8;               // writes slime.id through the pointer
    cout << slime.id << endl;
    return 0;
}
```

1. `cout << target->name << endl;` goes through `target` to `slime` and reads its name: `Slime`.
2. `cout << (*target).id << endl;` is the same trip written the long way: `7`.
3. `target->id = 8;` writes the member inside `slime`. So `cout << slime.id << endl;` prints `8`.

## The rule, in the slide's words

- `*` after a type, in a declaration such as `int* p`: "p is a pointer to an int".
- `&` before a variable, in an expression such as `&num`: "the address of num".
- `*` before a pointer, in an expression such as `*p`: dereference, "go to where I'm pointing at and look at the value in the box".

:::warn One star, two jobs
If a type sits just left of the star, it declares a pointer. Otherwise the star follows a pointer to its box.
:::

## The paper's question, worked

Q4 says "suppose we have a pointer to a string called success". Draw it first: a string box, and a pointer box holding that string's address.

From the pointer box, a star goes down to the string. An ampersand goes up to the place where the pointer box itself lives.

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

A `string**` is a pointer to a pointer to a string. Its box holds the address of a `string*` box.

```cpp run pin success.cpp
// predict: Five lines (the fourth prints the word "same" or "different", not an address).
#include <iostream>
#include <string>
using namespace std;

void reset(string** pp, string* target)   // gets the pointer's address, so it can re-point it
{
    *pp = target;
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

    reset(&success, &next);               // success now points at next
    cout << *success << endl;
    return 0;
}
```

1. `cout << *success << endl;` goes down to the string: `talk to Grendel`.
2. `success->length()` calls a member of that string. It has `15` characters.
3. `*success = "done";` writes `step` through the pointer, so `cout << step << endl;` prints `done`.
4. `string** pp = &success;` holds the pointer's own address. One star on `pp` gives back `success`, which holds `&step`: `same`.
5. `reset(&success, &next);` hands over the pointer's address. Inside, `*pp = target;` changes where `success` points: `hunt Slime`.

## Try it

```quiz
[
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
    "explain": "Move 1: `*` is dereference, `&` is address-of. Move 2: they go in opposite directions from the pointer box: `*success` goes down to the string, `&success` goes up to the pointer's own box, so the types differ (`string` vs `string**`). Move 3: `cout << *success;` for the first and `reset(&success, &other);` with a `string**` parameter for the second. Do not write that `&success` is the string's address: that is the value stored in `success`, not `&success`."
  },
  {
    "q": "What prints?",
    "code": "int a = 1;\nint b = 2;\nint* p = &a;\nint* q = p;\n*q = 5;\nq = &b;\n*q = 9;\ncout << a << \" \" << b << \" \" << *p << endl;",
    "options": ["5 9 5", "5 9 9", "1 9 1", "9 9 9"],
    "answer": 0,
    "explain": "1. `int* q = p;` copies the address of `a` into `q`: two pointers, one target.\n2. `*q = 5;` writes `a`: 5.\n3. `q = &b;` re-points only `q`; `p` still holds `a`'s address.\n4. `*q = 9;` writes `b`: 9.\n5. `*p` reads `a`, so the line is `5 9 5`."
  },
  {
    "q": "What prints?",
    "code": "int hp = 50;\nint mp = 20;\nint* a = &hp;\nint* b = &mp;\n*a = *b;\n*b = 5;\ncout << hp << \" \" << mp << \" \" << *a << endl;",
    "options": ["20 5 20", "20 5 5", "50 5 50", "5 5 5"],
    "answer": 0,
    "explain": "1. `a` holds the address of `hp`, `b` holds the address of `mp`.\n2. `*a = *b;` copies the value 20 from `mp`'s box into `hp`'s box. It does not make `a` point at `mp`.\n3. `*b = 5;` writes `mp`: 5. `hp` keeps its copy, 20.\n4. `*a` still reads `hp`, so the line is `20 5 20`."
  },
  {
    "q": "True or false: in `int* p = &n;` the star dereferences `p`.",
    "type": "tf",
    "answer": false,
    "explain": "1. The star sits just right of the type `int`, so it belongs to the declaration.\n2. There it means \"p is a pointer to an int\".\n3. The star dereferences only in an expression with no type to its left, such as `*p = 10;`."
  }
]
```

## Remember

- A pointer is its own box. Changing `p` moves the arrow, and changing `*p` changes the box at the end of it.
- `*success` goes down to the string. `&success` goes up to the pointer's own box, type `string**`.
- `target->name` is `(*target).name`.
- *On the sheet:* side 1, band 0 "Reading C++: the words every question uses" for the symbols, and band 2 "What is X? How is it different from Y? When is it used?" for the Q4 answer.
