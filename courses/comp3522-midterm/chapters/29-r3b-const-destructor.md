---
title: "Core 7: const in two places, and when the destructor runs (Q7, Q8)"
minutes: 20
---
This lesson teaches two short written answers. Q7 asks what a promise not to change means in two places, and Q8 asks when an object's clean-up function runs for you.

## What a promise not to change is, in plain words

A promise in code is a rule the compiler checks for you. The word `const` makes one: this thing will not be changed here.

It can sit in two places, and each place promises something different. On a parameter, it promises the function will not change the caller's argument.

After a member function's parameter list, it promises the function will not change the object it runs on. A member function belongs to a class and runs on one object, as in `slime.hit(20)`.

```diagram
{ "type": "grid", "title": "One word, two promises", "nodes": [
  { "id": "h0", "label": "where", "row": 0, "col": 0 },
  { "id": "h1", "label": "written as", "row": 0, "col": 1 },
  { "id": "h2", "label": "promise", "row": 0, "col": 2 },
  { "id": "p0", "label": "on a parameter", "row": 1, "col": 0 },
  { "id": "p1", "label": "const Mob& m", "row": 1, "col": 1 },
  { "id": "p2", "label": "argument unchanged", "row": 1, "col": 2 },
  { "id": "f0", "label": "after the ( )", "row": 2, "col": 0 },
  { "id": "f1", "label": "int getHp() const", "row": 2, "col": 1 },
  { "id": "f2", "label": "object unchanged", "row": 2, "col": 2 }
], "hi": ["p2", "f2"], "caption": "On a parameter the promise is about the argument; after the parameter list it is about the object the function runs on." }
```

## A tiny program you can run in your head

A reference is a second name for the caller's variable, so passing one copies nothing. A `const` reference is a second name that may only read.

```cpp run pin const_param.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

void showHp(const int& hp)
{
    cout << "hp " << hp << endl;
    // hp += 10;   // error: assignment of read-only reference 'hp'
}

int main()
{
    int slimeHp = 40;
    showHp(slimeHp);
    showHp(75);
    return 0;
}
```

1. `hp 40`: `showHp(slimeHp);` makes `hp` a second name for `slimeHp`. The function reads it and prints it.
2. `hp 75`: `showHp(75);` passes a plain number. A `const int&` accepts it, where a reference without `const` would refuse.

Uncomment `hp += 10;` and g++ stops with the error in the comment. The promise is checked before the program ever runs.

## The rule, in the slide's words

- A `const` parameter: the function cannot modify the argument, and the compiler rejects any statement that tries.
- A `const` member function, in the slide's words: "I promise this function's code will NOT change this object's member variables".
- Where the two meet: through a `const Mob&` you may call **only** const member functions.

The trap: a getter written without `const` cannot be called through a const reference.

## The two promises in one program

Inside a member function, `this` is the hidden pointer to the object it runs on. In a const member function, `this` points to a const object, so every write to a member is refused.

```cpp run pin const_member.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

class Mob {
    int hp;
public:
    Mob(int h) : hp(h) {}
    int getHp() const { return hp; }
    void hit(int damage) { hp -= damage; }
};

void report(const Mob& m)
{
    cout << "hp " << m.getHp() << endl;
    // m.hit(5);    // error: passing 'const Mob' as 'this' argument discards qualifiers
}

int main()
{
    Mob slime(50);
    const Mob target(80);
    report(slime);
    report(target);
    slime.hit(20);
    report(slime);
    return 0;
}
```

1. `hp 50`: `report(slime);` binds `m` to `slime`. `m.getHp()` is legal because `getHp` is const.
2. `hp 80`: `report(target);` passes a const object, which `const Mob& m` accepts.
3. `hp 30`: `slime.hit(20);` is legal because `slime` itself is not const.

Uncomment `m.hit(5);` and g++ stops with the error in the comment. `hit` is not const, so it cannot run on a const object.

## Try it: Q7

```quiz
[
  {
    "q": "Click the line g++ rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Walk {\n    int steps;\npublic:\n    Walk(int s) : steps(s) {}\n    int getSteps() { return steps; }\n    void add(int n) { steps += n; }\n};\n\nvoid show(const Walk& w)\n{\n    cout << w.getSteps() << endl;\n}\n\nint main()\n{\n    Walk walk(3);\n    walk.add(2);\n    show(walk);\n    return 0;\n}",
    "answer": [14],
    "explain": "1. `show` takes `const Walk& w`, so `w` is const inside it.\n2. `getSteps()` has no `const` after its parameter list, so it might change a member.\n3. Calling it on `w` is refused at that call: `error: passing 'const Walk' as 'this' argument discards qualifiers`.\n4. The fix is one word on the getter: `int getSteps() const { return steps; }`.\n5. `walk.add(2);` in main is fine: `walk` is not const."
  },
  {
    "q": "A function takes `const Mob& m` and its body calls `m.hit(5)`, where `hit` has no `const` after its parameter list. What happens?",
    "options": [
      "The program does not compile",
      "It compiles and the caller's object loses 5 hp",
      "It compiles and changes a temporary copy of the object",
      "It compiles but crashes when the line runs"
    ],
    "answer": 0,
    "explain": "1. Through a `const Mob&`, the object counts as const.\n2. Only const member functions may run on a const object.\n3. `hit` is not const, so g++ refuses the call: `passing 'const Mob' as 'this' argument discards qualifiers`.\n4. The check happens at compile time, so nothing runs at all."
  },
  {
    "type": "free",
    "q": "Q7 (6). With respect to the const keyword: a. What is the purpose of making an argument to a function const? b. What is the purpose of adding the const keyword to a function header?",
    "model": "a. A `const` parameter, `void report(const Mob& m)`, promises the function will not modify the argument; the compiler rejects any statement that tries. With a reference it gives no copy plus the safety of pass by value, and lets callers pass const objects and temporaries.\n\nb. `const` after the parameter list, `int getHp() const`, makes a const member function: it promises not to change any data member of the object (`this` points to const), the compiler enforces it, and only const member functions can be called on a const object or through a const reference. Every getter should be const.",
    "points": [
      "a. const parameter: the function cannot modify the argument; compiler-enforced",
      "a. const reference: no copy, and const objects and temporaries can be passed",
      "b. const member function: promises not to change data members",
      "b. inside it `this` is a pointer to const; the compiler rejects writes",
      "b. only const member functions can be called on a const object or const reference",
      "A line of code for each, such as `void report(const Mob& m)` and `int getHp() const`"
    ],
    "rows": 7,
    "explain": "Six marks, three per part. Part b earns its third mark with the consequence: a getter without `const` cannot be called through `const Mob&`, which is exactly the error in the program above."
  }
]
```

## When a destructor runs, in plain words

A destructor is the function that runs when an object dies. It has the class's name with a tilde in front, `~Mob()`, and it cleans up what the object owned.

You rarely call it yourself. The compiler inserts the call at the moment the object's life ends.

An ordinary local object dies at the closing brace of the block that declared it. An object made with `new` lives on the heap, the memory a program asks for while it runs, and dies only at `delete`.

Objects in one block die in the reverse order of their birth. The last one built is the first one destroyed, like a stack of plates.

```diagram
{ "type": "grid", "title": "When each kind of object dies", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "dies at", "row": 0, "col": 1 },
  { "id": "l0", "label": "local object", "row": 1, "col": 0 },
  { "id": "l1", "label": "its closing brace", "row": 1, "col": 1 },
  { "id": "n0", "label": "made with new", "row": 2, "col": 0 },
  { "id": "n1", "label": "delete p;", "row": 2, "col": 1 },
  { "id": "t0", "label": "temporary", "row": 3, "col": 0 },
  { "id": "t1", "label": "the ; of its line", "row": 3, "col": 1 },
  { "id": "m0", "label": "member or base", "row": 4, "col": 0 },
  { "id": "m1", "label": "after the body", "row": 4, "col": 1 },
  { "id": "s0", "label": "static object", "row": 5, "col": 0 },
  { "id": "s1", "label": "after main ends", "row": 5, "col": 1 }
], "hi": ["l1", "n1"], "caption": "An object dies when its life ends. In one scope, the last object built is the first destroyed." }
```

## A tiny destructor program

```cpp run pin scope_end.cpp
// predict: Write every line printed, in order (7 lines).
#include <iostream>
#include <string>
using namespace std;

class Mob {
    string name;
public:
    Mob(const string& n) : name(n) { cout << "spawn " << name << endl; }
    ~Mob() { cout << "drop " << name << endl; }
};

int main()
{
    Mob a("A");
    {
        Mob b("B");
    }
    Mob* p = new Mob("C");
    delete p;
    cout << "end" << endl;
    return 0;
}
```

1. `spawn A`: `Mob a("A");` is born first.
2. `spawn B`: `Mob b("B");` is born inside the inner block.
3. `drop B`: the inner block's closing brace ends `b`'s life.
4. `spawn C`: `Mob* p = new Mob("C");` makes an object on the heap.
5. `drop C`: `delete p;` ends it. Without that line, C would never be dropped.
6. `end`: the next statement.
7. `drop A`: `return 0;` leaves `main`, and its closing brace ends `a`.

Find each object's closing brace or its `delete`, and the order of the drop lines follows.

## The destructor rule, in the slide's words

The slide lists three moments: program termination for static objects, the end of scope, and an explicit `delete` or `delete[]`. Objects in one scope die in the reverse order of their construction.

Two more moments follow from the same rule. A temporary dies at the end of its full statement, and members die after the enclosing destructor's body.

The trap: forget `delete` and a heap object never dies, so its destructor never prints.

## Every moment in one program

A temporary is an unnamed object made for one statement, like `Mob("T")` below. A `static` local is built once, the first time control reaches it, and lives until the program ends.

```cpp run pin destructor_timing.cpp
// predict: Write every line printed, in order (16 lines).
#include <iostream>
#include <string>
using namespace std;

class Mob {
    string name;
public:
    Mob(const string& n) : name(n) { cout << "spawn " << name << endl; }
    ~Mob() { cout << "drop " << name << endl; }
};

class Fight {
    Mob target;
public:
    Fight() : target("Slime") { cout << "fight starts" << endl; }
    ~Fight() { cout << "fight ends" << endl; }
};

string look(const Mob&)
{
    return "seen";
}

int main()
{
    static Mob s("S");
    {
        Mob a("A");
    }
    Mob* p = new Mob("B");
    delete p;
    cout << look(Mob("T")) << endl;
    Mob w("W");
    Fight f;
    cout << "end of main" << endl;
    return 0;
}
```

1. `spawn S`: `static Mob s("S");` is built the first time control reaches it.
2. `spawn A`: `Mob a("A");` inside the inner block.
3. `drop A`: the block's closing brace. Scope end.
4. `spawn B`: `Mob* p = new Mob("B");` on the heap.
5. `drop B`: `delete p;`.
6. `spawn T`: the temporary `Mob("T")` is built for the call.
7. `seen`: `look` returns, and the line prints.
8. `drop T`: the temporary dies at the `;` of that statement.
9. `spawn W`: `Mob w("W");`.
10. `spawn Slime`: `Fight f;` builds its member `target` first.
11. `fight starts`: then the `Fight` body runs.
12. `end of main`.
13. `fight ends`: at `return 0;` the locals die in reverse, `f` first. Its body runs before its member dies.
14. `drop Slime`: the member `target`, after the body.
15. `drop W`: built before `f`, so dropped after it.
16. `drop S`: statics die after `main` returns.

```diagram
{ "type": "flow", "title": "Fight f: built inside out, destroyed outside in", "nodes": [
  { "id": "m1", "label": "spawn Slime", "sub": "member first" },
  { "id": "b1", "label": "fight starts", "sub": "then the body" },
  { "id": "b2", "label": "fight ends", "sub": "body first" },
  { "id": "m2", "label": "drop Slime", "sub": "then the member" }
], "edges": [ { "from": "m1", "to": "b1" }, { "from": "b1", "to": "b2", "label": "scope ends" }, { "from": "b2", "to": "m2" } ], "hi": ["b2"], "caption": "The destructor is the exact reverse of the constructor. A base class sits outside the members: built before them, destroyed after them." }
```

## Try it: Q8

```quiz
[
  {
    "type": "free",
    "q": "Q8 (3). We rarely invoke an object's destructor directly. When is an object's destructor invoked for us (automatically)?",
    "model": "When the object's lifetime ends: when it goes out of scope (the end of the block or function it was declared in, also when an exception unwinds the stack through it); when `delete` (or `delete[]`) is applied to a pointer to a dynamically allocated object; for a temporary, at the end of the full expression that created it; for members and base subobjects, after the enclosing object's destructor body; for static and global objects, when the program ends. Objects in one scope are destroyed in the reverse order of their construction.",
    "points": [
      "Out of scope: end of the block or function",
      "delete or delete[] on a dynamically allocated object",
      "A temporary at the end of its full expression",
      "Members and bases after the enclosing destructor body; statics at program end",
      "Reverse order of construction"
    ],
    "rows": 5,
    "explain": "Three marks: scope end, `delete`, and one more case with the reverse-order rule cover it. The program above shows every case in turn: `drop A` at a brace, `drop B` at `delete p;`, `drop T` at the end of its statement, `drop Slime` after `fight ends`, `drop S` last."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\n    char tag;\npublic:\n    Mob(char t) : tag(t) { cout << \"+\" << tag; }\n    ~Mob() { cout << \"-\" << tag; }\n};\n\nint main() {\n    Mob a('a');\n    {\n        Mob b('b');\n        Mob c('c');\n    }\n    Mob d('d');\n    cout << \"|\";\n    return 0;\n}",
    "options": ["+a+b+c-c-b+d|-d-a", "+a+b+c-b-c+d|-a-d", "+a+b+c+d|-d-c-b-a", "+a+b+c-c-b+d-d|-a"],
    "answer": 0,
    "explain": "1. `+a`, then `+b +c` in the inner block.\n2. The inner closing brace destroys its objects in reverse: `-c -b`.\n3. `+d`, then `|`.\n4. The end of `main` destroys the rest in reverse: `d` was built after `a`, so `-d -a`.\n5. All on one line: `+a+b+c-c-b+d|-d-a`."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob {\n    char tag;\npublic:\n    Mob(char t) : tag(t) { cout << \"+\" << tag; }\n    ~Mob() { cout << \"-\" << tag; }\n};\n\nint main() {\n    Mob a('a');\n    Mob* p = new Mob('p');\n    cout << \"|\";\n    return 0;\n}",
    "options": ["+a+p|-a", "+a+p|-p-a", "+a+p|-a-p", "+a+p-p|-a"],
    "answer": 0,
    "explain": "1. `Mob a('a');` prints `+a`.\n2. `new Mob('p')` builds an object on the heap: `+p`.\n3. `|` prints.\n4. At the end of `main`, the local `a` dies: `-a`.\n5. Nothing ever runs `delete p;`, so the heap object never dies and `-p` never prints. That is a memory leak."
  }
]
```

## Remember

- A `const` parameter promises not to change the argument. A `const` after the parameter list promises not to change the object, and only those functions run through a const reference.
- A destructor runs when the object's life ends: closing brace, `delete`, the `;` of a temporary's line, after the body for members, after `main` for statics.
- In one scope, the last object built is the first destroyed.
- *On the sheet:* Sheet sides 1 and 2, band 2 "What is X? How is it different from Y? When is it used?" for Q7 and Q8. Sheet side 1, band 1 "What is printed by this code?" for the destruction order.
