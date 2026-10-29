---
title: "Core 2: an object is born and dies: the constructor line and the destructor line"
minutes: 15
---
This lesson teaches you to read a program as a diary of objects being born and dying. Every "What is printed?" question on the paper is built on it.

## What a constructor and a destructor are, in plain words

An object is a box of data that a class describes. Before the box can be used, a special function fills it in. That function is the constructor.

When the box is no longer needed, a second special function cleans it up. That function is the destructor, and its name is the class name with a tilde in front, like `~Mob`.

You never call either one by name in `main`. The compiler writes the calls for you: the constructor where the object is declared, the destructor where its life ends.

In every exam program, both functions print a line. So the output is a diary: one line when an object is born, one line when it dies.

Think of a mob on a map. It spawns when you walk in, and it vanishes when you leave, without anyone pressing a button.

```diagram
{ "type": "flow", "title": "The life of one object", "nodes": [
  { "id": "d", "label": "Declaration line", "sub": "constructor runs" },
  { "id": "u", "label": "Object is used", "sub": "its own lines" },
  { "id": "b", "label": "Closing brace }", "sub": "destructor runs" }
], "edges": [ { "from": "d", "to": "u" }, { "from": "u", "to": "b" } ], "hi": ["d", "b"], "caption": "The declaration prints the birth line and the closing brace of the object's block prints the death line." }
```

## A tiny program you can run in your head

```cpp run pin slime.cpp
// predict: Write every line printed. Which line does the closing brace of the inner block print?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    int id;
    string name;
public:
    Mob(int id, const string& name) : id(id), name(name) { cout << name << " spawned" << endl; }
    ~Mob() { cout << name << " died" << endl; }
};

int main()
{
    cout << "enter map" << endl;
    {
        Mob slime(7, "Slime");
        cout << "fighting" << endl;
    }
    cout << "leave map" << endl;
}
```

1. `cout << "enter map" << endl;` prints `enter map`.
2. `Mob slime(7, "Slime");` creates an object, so the constructor prints `Slime spawned`.
3. `cout << "fighting" << endl;` prints `fighting`.
4. The inner block's closing `}` ends the life of `slime`. Its destructor prints `Slime died`, although no line of code names it.
5. `cout << "leave map" << endl;` prints `leave map`.

The output makes sense because `slime` lives only between the inner braces. So its two lines sit inside the other three.

## Two objects in one block

When two objects share a block, they die at the same brace. The last one born dies first, like a stack of plates where the top plate comes off first.

```diagram
{ "type": "grid", "title": "Two mobs in one block", "nodes": [
  { "id": "h0", "label": "object", "row": 0, "col": 0 },
  { "id": "h1", "label": "born", "row": 0, "col": 1 },
  { "id": "h2", "label": "dies", "row": 0, "col": 2 },
  { "id": "s0", "label": "slime", "row": 1, "col": 0 },
  { "id": "s1", "label": "1st", "row": 1, "col": 1 },
  { "id": "s2", "label": "2nd", "row": 1, "col": 2 },
  { "id": "n0", "label": "snail", "row": 2, "col": 0 },
  { "id": "n1", "label": "2nd", "row": 2, "col": 1 },
  { "id": "n2", "label": "1st", "row": 2, "col": 2 }
], "hi": ["n2"], "caption": "Objects in one scope die in the reverse order of their birth: last born, first to die." }
```

```cpp run pin twomobs.cpp
// predict: Write all 6 lines. Which mob dies first?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    string name;
public:
    Mob(const string& name) : name(name) { cout << name << " spawned" << endl; }
    ~Mob() { cout << name << " died" << endl; }
};

int main()
{
    {
        Mob slime("Slime");
        Mob snail("Snail");
        cout << "fighting" << endl;
    }
    cout << "map cleared" << endl;
}
```

1. `Mob slime("Slime");` prints `Slime spawned`.
2. `Mob snail("Snail");` prints `Snail spawned`.
3. `cout << "fighting" << endl;` prints `fighting`.
4. The inner `}` ends both lives. The last one born goes first: `Snail died`.
5. Then the first one born: `Slime died`.
6. `cout << "map cleared" << endl;` prints `map cleared`.

Two births, two deaths, and the deaths mirror the births.

## The rule, in the slide's words

- The destructor is a "member function automatically called before the object is destroyed".
- It is invoked when the lifetime ends: "program termination (statics), end of scope, explicit `delete` / `delete[]`".
- Objects in one scope are destroyed in the reverse order of their construction.

A static object is one that lives for the whole program, so it dies when the program ends. An object made with `new` lives on the heap, a memory area that is freed only when the code says `delete`.

:::warn The heap object has no brace
An object made with `new` is not killed by any closing brace. Its destructor runs at `delete`, and without `delete` it never runs at all.
:::

## The Week 3 program, worked

The Week 3 destructor lesson uses one program that shows all three endings at once. Predict it before you read the walk.

```cpp run pin destroyed.cpp
// predict: Write all 9 lines. Where does the heap object's destructor line appear?
#include <iostream>
using namespace std;

class Complex
{
    double r, i;
public:
    Complex(double r = 0, double i = 0) : r(r), i(i) { cout << "Constructed " << r << endl; }
    ~Complex() { cout << "Destroyed! " << r << endl; }
};

int main()
{
    Complex a(1);
    {
        Complex b(2);
        cout << "end of the block" << endl;
    }
    Complex* p = new Complex(3);
    cout << "before delete" << endl;
    delete p;
    cout << "end of main" << endl;
    return 0;
}
```

1. `Complex a(1);` prints `Constructed 1`.
2. `Complex b(2);` prints `Constructed 2`.
3. The block prints `end of the block`.
4. The block's `}` ends the life of `b`: `Destroyed! 2`.
5. `Complex* p = new Complex(3);` builds a heap object: `Constructed 3`.
6. `cout << "before delete" << endl;` prints `before delete`.
7. `delete p;` runs the heap object's destructor right now: `Destroyed! 3`.
8. `cout << "end of main" << endl;` prints `end of main`.
9. `main` ends and `a` dies last: `Destroyed! 1`.

Three objects, three endings: the end of a block, a `delete`, and the end of `main`.

## Try it

One item counts objects with `static int alive;`. A static data member is one variable shared by every object of the class. So every constructor and every destructor changes the same count.

```quiz
[
  {
    "q": "A boss made with `new`. What is printed?",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Mob\n{\n    string name;\npublic:\n    Mob(const string& name) : name(name) { cout << name << \" spawned\" << endl; }\n    ~Mob() { cout << name << \" died\" << endl; }\n};\n\nint main()\n{\n    Mob slime(\"Slime\");\n    Mob* boss = new Mob(\"Zakum\");\n    cout << \"boss fight\" << endl;\n    delete boss;\n    cout << \"loot\" << endl;\n}",
    "options": [
      "Slime spawned\nZakum spawned\nboss fight\nZakum died\nloot\nSlime died",
      "Slime spawned\nZakum spawned\nboss fight\nloot\nZakum died\nSlime died",
      "Slime spawned\nZakum spawned\nboss fight\nloot\nSlime died\nZakum died",
      "Slime spawned\nZakum spawned\nboss fight\nloot\nSlime died"
    ],
    "answer": 0,
    "explain": "1. `Mob slime(\"Slime\");`: `Slime spawned`. 2. `new Mob(\"Zakum\")` builds a heap object: `Zakum spawned`. 3. `boss fight`. 4. `delete boss;` runs its destructor at once: `Zakum died`. 5. `loot`. 6. `main` ends and `slime` dies: `Slime died`. A heap object dies at `delete`, never at a brace."
  },
  {
    "q": "A loop that spawns two mobs per wave, with a static counter. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob\n{\npublic:\n    static int alive;\n    Mob() { ++alive; cout << \"spawn \" << alive << endl; }\n    ~Mob() { --alive; cout << \"despawn \" << alive << endl; }\n};\n\nint Mob::alive = 0;\n\nint main()\n{\n    for (int wave = 1; wave <= 2; wave++)\n    {\n        Mob a;\n        Mob b;\n        cout << \"wave \" << wave << endl;\n    }\n}",
    "options": [
      "spawn 1\nspawn 2\nwave 1\ndespawn 1\ndespawn 0\nspawn 1\nspawn 2\nwave 2\ndespawn 1\ndespawn 0",
      "spawn 1\nspawn 2\nwave 1\nspawn 3\nspawn 4\nwave 2\ndespawn 3\ndespawn 2\ndespawn 1\ndespawn 0",
      "spawn 1\nspawn 2\nwave 1\ndespawn 1\ndespawn 0\nwave 2",
      "spawn 1\nspawn 1\nwave 1\ndespawn 0\ndespawn 0\nspawn 1\nspawn 1\nwave 2\ndespawn 0\ndespawn 0"
    ],
    "answer": 0,
    "explain": "`static int alive;` is one counter shared by every Mob. 1. Wave 1: `Mob a;` makes it 1 (`spawn 1`), `Mob b;` makes it 2 (`spawn 2`), then `wave 1`. 2. The loop body's `}` ends the scope: `b` dies first (`despawn 1`), then `a` (`despawn 0`). 3. The next pass declares fresh objects: `spawn 1`, `spawn 2`, `wave 2`, `despawn 1`, `despawn 0`. Each pass of a loop body builds and destroys its locals."
  },
  {
    "q": "Which of these end an object's lifetime and therefore run its destructor? (select all)",
    "options": ["The end of the scope in which a local object was declared", "`delete p;` for a heap object", "Program termination, for static objects", "Calling a member function on the object"],
    "answer": [0, 1, 2],
    "explain": "The slide's three: \"program termination (statics), end of scope, explicit delete / delete[]\". Calling a member function uses the object and ends nothing."
  },
  {
    "q": "Two local objects are constructed in the order `a`, then `b`. In what order are they destroyed at the end of the scope?",
    "options": ["`b`, then `a`", "`a`, then `b`", "Both at once, with one destructor line", "In alphabetical order of their names"],
    "answer": 0,
    "explain": "Destruction is the reverse of construction. The last object built, `b`, is the first destroyed, then `a`."
  },
  {
    "type": "tf",
    "q": "To run the destructor of a local `Mob slime;`, you must write `slime.~Mob();` before the closing brace.",
    "answer": false,
    "explain": "The compiler inserts the call at the closing brace by itself. Calling it by hand as well would destroy the object twice."
  }
]
```

## Remember

- Every declaration prints a birth line. A closing brace, a `delete`, or the end of the program prints the death line.
- Last born, first to die.
- A `new` object dies only at `delete`.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for the method, and side 1, band 0 "Reading C++: the words every question uses" for constructor and destructor.
