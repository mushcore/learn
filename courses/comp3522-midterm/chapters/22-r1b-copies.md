---
title: "Core 11: when a copy is made: copy-initialization, pass by value, return by value, and Q20"
minutes: 20
---
This lesson teaches the moments when a second object appears as a copy of the first. It prepares you for Q20, the seven-mark "What is printed?" question.

## What a copy constructor is, in plain words

A copy constructor is the constructor that builds a new object from an existing object of the same class. In the exam programs it prints its own line, so every copy shows up in the output.

A copy is a full second object. It has its own life, so it also prints its own death line later.

A reference is a second name for an object that already exists. Handing over a reference makes no new object, so nothing prints.

Think of a mob and its clone. The clone fights and dies on its own. Calling the first mob by a nickname creates nothing.

```diagram
{ "type": "grid", "title": "A copy versus a second name", "nodes": [
  { "id": "h0", "label": "name", "row": 0, "col": 0 },
  { "id": "h1", "label": "what it is", "row": 0, "col": 1 },
  { "id": "h2", "label": "prints", "row": 0, "col": 2 },
  { "id": "a0", "label": "slime", "row": 1, "col": 0 },
  { "id": "a1", "label": "the original", "row": 1, "col": 1 },
  { "id": "a2", "label": "birth, death", "row": 1, "col": 2 },
  { "id": "b0", "label": "twin", "row": 2, "col": 0 },
  { "id": "b1", "label": "a second box", "row": 2, "col": 1 },
  { "id": "b2", "label": "copy, death", "row": 2, "col": 2 },
  { "id": "c0", "label": "target&", "row": 3, "col": 0 },
  { "id": "c1", "label": "slime's box", "row": 3, "col": 1 },
  { "id": "c2", "label": "nothing", "row": 3, "col": 2 }
], "hi": ["b1", "b2"], "caption": "A copy is a second box with its own birth and death lines; a reference is one more label on a box that already exists." }
```

## A tiny program you can run in your head

The question for every statement is the same: does it declare a new object? Watch the two lines with an `=` in them.

```cpp run pin twin.cpp
// predict: Write all 5 lines. Which statement prints nothing?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    string name;
public:
    Mob(const string& name) : name(name) { cout << "spawn " << name << endl; }
    Mob(const Mob& other) : name(other.name) { cout << "copy " << name << endl; }
    ~Mob() { cout << "despawn " << name << endl; }
};

int main()
{
    Mob slime("Slime");
    Mob twin = slime;
    twin = slime;
    cout << "end of main" << endl;
}
```

1. `Mob slime("Slime");` is a new object: `spawn Slime`.
2. `Mob twin = slime;` declares a new object from an existing one, so the copy constructor runs: `copy Slime`.
3. `twin = slime;` changes an object that already exists. That is the assignment operator, and it prints nothing here.
4. `cout << "end of main" << endl;` prints `end of main`.
5. The closing brace destroys `twin`, then `slime`: `despawn Slime` twice.

The `=` in a declaration builds a new object. The `=` between two existing objects only changes one of them. g++ warns here about the implicit assignment operator, and the warning does not change the output.

## A parameter by value versus by reference

A parameter passed by value is a new object inside the function, copied from the argument. A parameter passed by reference is the caller's object under another name.

```cpp run pin params.cpp
// predict: Write all 7 lines. Which call makes a copy?
#include <iostream>
#include <string>
using namespace std;

class Mob
{
    string name;
public:
    Mob(const string& name) : name(name) { cout << "spawn " << name << endl; }
    Mob(const Mob& other) : name(other.name) { cout << "copy " << name << endl; }
    ~Mob() { cout << "despawn " << name << endl; }
    const string& getName() const { return name; }
};

void fight(Mob target)
{
    cout << "fight " << target.getName() << endl;
}

void look(const Mob& target)
{
    cout << "look " << target.getName() << endl;
}

int main()
{
    Mob slime("Slime");
    fight(slime);
    look(slime);
    cout << "end of main" << endl;
}
```

1. `Mob slime("Slime");` prints `spawn Slime`.
2. `fight(slime);` passes by value, so `Mob target` is copy constructed: `copy Slime`.
3. The body prints `fight Slime`.
4. `fight` returns and its parameter dies: `despawn Slime`.
5. `look(slime);` takes `const Mob& target`, so no object is made. The body prints `look Slime`.
6. `cout << "end of main" << endl;` prints `end of main`.
7. The closing brace destroys `slime`: `despawn Slime`.

The by-value call added one birth and one death. The reference call added neither.

## Returning by value

A function that returns by value hands back an object. When it returns its own parameter, that parameter is copied into the result.

When the result starts a new variable, like `Mob kept = respawn(slime);`, the returned copy simply is `kept`. No second copy is made.

```cpp run pin kept.cpp
// predict: Write all 8 lines. How many copy lines?
#include <iostream>
using namespace std;

class Mob
{
public:
    Mob() { cout << "Mob()" << endl; }
    Mob(const Mob&) { cout << "Mob(copy)" << endl; }
    ~Mob() { cout << "~Mob" << endl; }
};

Mob respawn(Mob m)
{
    cout << "respawn" << endl;
    return m;
}

int main()
{
    Mob slime;
    Mob kept = respawn(slime);
    cout << "next" << endl;
}
```

1. `Mob slime;` prints `Mob()`.
2. `Mob kept = respawn(slime);` first copies the argument into `Mob m`: `Mob(copy)`.
3. The body prints `respawn`.
4. `return m;` copies the parameter into the result: `Mob(copy)`. This result is `kept`.
5. The statement ends and the parameter `m` dies: `~Mob`.
6. `cout << "next" << endl;` prints `next`.
7. The closing brace destroys `kept`: `~Mob`.
8. Then `slime`: `~Mob`.

Three objects were born, three died. If the result is not kept, the returned copy is a temporary, and it dies at the end of the statement.

## The rule, in the slide's words

The Week 7 slide lists three moments the copy constructor is called:

- "When invoking the copy constructor directly": `A b(a);` and `A b = a;`.
- "When passing an object by value to a function".
- "When returning an object by value from a function".

It adds: "Copy Elision and Return Value Optimization may be used by some compilers to eliminate a temporary object created to hold a function's return value." Copy elision means the compiler builds the object straight in its final place and skips a copy.

The truth in C++17 is sharper than the slide. `A y = f(a);` always builds the result straight into `y`, and a returned parameter is never elided.

A returned local, like `return r;` for a `Route r;` declared inside the function, may also be built straight into the caller's variable. g++ does this, so no copy line prints for it.

```diagram
{ "type": "grid", "title": "One row per statement", "nodes": [
  { "id": "h0", "label": "you write", "row": 0, "col": 0 },
  { "id": "h1", "label": "birth lines", "row": 0, "col": 1 },
  { "id": "h2", "label": "death lines", "row": 0, "col": 2 },
  { "id": "r10", "label": "A b = a;", "row": 1, "col": 0 },
  { "id": "r11", "label": "one copy", "row": 1, "col": 1 },
  { "id": "r12", "label": "at b's scope end", "row": 1, "col": 2 },
  { "id": "r20", "label": "b = a;", "row": 2, "col": 0 },
  { "id": "r21", "label": "none", "row": 2, "col": 1 },
  { "id": "r22", "label": "none", "row": 2, "col": 2 },
  { "id": "r30", "label": "f(a), A x", "row": 3, "col": 0 },
  { "id": "r31", "label": "one copy", "row": 3, "col": 1 },
  { "id": "r32", "label": "when f returns", "row": 3, "col": 2 },
  { "id": "r40", "label": "f(a), A& x", "row": 4, "col": 0 },
  { "id": "r41", "label": "none", "row": 4, "col": 1 },
  { "id": "r42", "label": "none", "row": 4, "col": 2 },
  { "id": "r50", "label": "return input;", "row": 5, "col": 0 },
  { "id": "r51", "label": "one copy", "row": 5, "col": 1 },
  { "id": "r52", "label": "see next rows", "row": 5, "col": 2 },
  { "id": "r60", "label": "A y = f(a);", "row": 6, "col": 0 },
  { "id": "r61", "label": "none extra", "row": 6, "col": 1 },
  { "id": "r62", "label": "y at scope end", "row": 6, "col": 2 },
  { "id": "r70", "label": "f(a); unused", "row": 7, "col": 0 },
  { "id": "r71", "label": "the return copy", "row": 7, "col": 1 },
  { "id": "r72", "label": "temp at ;, then x", "row": 7, "col": 2 }
], "hi": ["r51", "r61", "r72"], "caption": "Apply one row per statement in main; the highlighted rows are the three that Q20 turns on." }
```

:::warn The = sign is not always assignment
`A b = a;` declares `b`, so it runs the copy constructor. Only `b = a;` on an existing `b` is assignment, and it builds nothing.
:::

## The paper's question, worked: Q20

Q20 (7). "What is printed to standard output by this code? HINT: this prints 14 lines."

```cpp run pin q20.cpp
// predict: Write all 14 lines in order. Count the copies: by-value parameter, by-value return, two declarations.
#include <iostream>

using namespace std;

class A
{
public:
    A() { cout << "Default constructor!" << endl; }
    ~A() { cout << "Destructor!" << endl; }
    A(const A&) { cout << "Copy constructor!" << endl;}
};

A foo(A input)
{
    cout << "Look ma, I'm fooing!" << endl;
    return input;
}

int main()
{
    A littleA;
    foo(littleA);
    A anotherA = littleA;
    A yetAnotherA = foo(littleA);
}
```

1. `A littleA;` runs the default constructor: `Default constructor!`.
2. `foo(littleA);` copies the argument into the by-value parameter of `A foo(A input)`: `Copy constructor!`.
3. The body prints `Look ma, I'm fooing!`.
4. `return input;` copies the parameter into the returned temporary: `Copy constructor!`. A parameter is never elided into the return value.
5. Nobody kept the result, so the temporary dies at the `;`: `Destructor!`.
6. Then `input` dies: `Destructor!`. Both lines read the same, so their order cannot show.
7. `A anotherA = littleA;` is a new object from an existing one: `Copy constructor!`.
8. `A yetAnotherA = foo(littleA);` first copies into `input`: `Copy constructor!`.
9. The body: `Look ma, I'm fooing!`.
10. `return input;` copies again: `Copy constructor!`. This copy is `yetAnotherA`, with no further copy into it.
11. `input` dies when the statement ends: `Destructor!`.
12. The closing brace of `main` destroys `yetAnotherA`: `Destructor!`.
13. Then `anotherA`: `Destructor!`.
14. Then `littleA`: `Destructor!`.

Tally: 1 default, 5 copies, 2 fooing lines and 6 destructors make 14. Six objects were born and six died.

The review lecture's copy of this program adds a `cout << endl;` after each statement in `main`. It prints the same 14 lines with four blank lines between the groups.

```widget
lifetime-trace
{"program": "#include <iostream>\n\nusing namespace std;\n\nclass A\n{\npublic:\n    A() { cout << \"Default constructor!\" << endl; }\n    ~A() { cout << \"Destructor!\" << endl; }\n    A(const A&) { cout << \"Copy constructor!\" << endl;}\n};\n\nA foo(A input)\n{\n    cout << \"Look ma, I'm fooing!\" << endl;\n    return input;\n}\n\nint main()\n{\n    A littleA;\n    foo(littleA);\n    A anotherA = littleA;\n    A yetAnotherA = foo(littleA);\n}", "presets": false}
```

Step the widget through `main` and watch the list of live objects grow and shrink. The count of live objects is zero again after the last line.

## Try it

```quiz
[
  {
    "q": "A returned parameter nobody keeps. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Mob\n{\npublic:\n    Mob() { cout << \"Mob()\" << endl; }\n    Mob(const Mob&) { cout << \"Mob(copy)\" << endl; }\n    ~Mob() { cout << \"~Mob\" << endl; }\n};\n\nMob respawn(Mob m)\n{\n    cout << \"respawn\" << endl;\n    return m;\n}\n\nint main()\n{\n    Mob slime;\n    respawn(slime);\n    cout << \"next\" << endl;\n}",
    "options": [
      "Mob()\nMob(copy)\nrespawn\nMob(copy)\n~Mob\n~Mob\nnext\n~Mob",
      "Mob()\nMob(copy)\nrespawn\n~Mob\nnext\n~Mob",
      "Mob()\nMob(copy)\nrespawn\nMob(copy)\n~Mob\nnext\n~Mob\n~Mob",
      "Mob()\nrespawn\nMob(copy)\n~Mob\nnext\n~Mob"
    ],
    "answer": 0,
    "explain": "The first half of Q20 with new names. 1. `Mob slime;`: `Mob()`. 2. `respawn(slime);` copies into `Mob m`: `Mob(copy)`. 3. `respawn`. 4. `return m;` copies the parameter into the returned temporary: `Mob(copy)`. 5. The result is unused, so at the `;` the temporary dies (`~Mob`) and then `m` (`~Mob`). 6. `next`. 7. `slime` dies at the end of `main`: `~Mob`."
  },
  {
    "q": "The engine ticks by reference and snapshots by value. What is printed?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Engine\n{\npublic:\n    Engine() { cout << \"Engine()\" << endl; }\n    Engine(const Engine&) { cout << \"Engine(copy)\" << endl; }\n    ~Engine() { cout << \"~Engine\" << endl; }\n};\n\nvoid tick(Engine&)\n{\n    cout << \"tick\" << endl;\n}\n\nvoid snapshot(Engine)\n{\n    cout << \"snapshot\" << endl;\n}\n\nint main()\n{\n    Engine engine;\n    for (int i = 0; i < 2; i++)\n        tick(engine);\n    snapshot(engine);\n    cout << \"unload\" << endl;\n}",
    "options": [
      "Engine()\ntick\ntick\nEngine(copy)\nsnapshot\n~Engine\nunload\n~Engine",
      "Engine()\nEngine(copy)\ntick\n~Engine\nEngine(copy)\ntick\n~Engine\nEngine(copy)\nsnapshot\n~Engine\nunload\n~Engine",
      "Engine()\ntick\ntick\nsnapshot\nunload\n~Engine",
      "Engine()\ntick\ntick\nEngine(copy)\nsnapshot\nunload\n~Engine\n~Engine"
    ],
    "answer": 0,
    "explain": "1. `Engine engine;`: `Engine()`. 2. The loop calls `tick(engine)` twice. `Engine&` makes no object, so just `tick`, `tick`. 3. `snapshot(engine)` takes `Engine` by value: `Engine(copy)`, then `snapshot`. 4. The parameter dies when `snapshot` returns, before the next statement: `~Engine`. 5. `unload`. 6. `engine` dies at the end of `main`: `~Engine`. Two objects, two destructors."
  },
  {
    "q": "A function that returns a local. What does g++ print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Route\n{\npublic:\n    Route() { cout << \"Route()\" << endl; }\n    Route(const Route&) { cout << \"Route(copy)\" << endl; }\n    ~Route() { cout << \"~Route\" << endl; }\n};\n\nRoute buildRoute()\n{\n    Route r;\n    cout << \"route generated\" << endl;\n    return r;\n}\n\nint main()\n{\n    Route route = buildRoute();\n    cout << \"questing\" << endl;\n}",
    "options": [
      "Route()\nroute generated\nquesting\n~Route",
      "Route()\nroute generated\nRoute(copy)\n~Route\nquesting\n~Route",
      "Route()\nroute generated\nRoute(copy)\nquesting\n~Route\n~Route",
      "route generated\nRoute()\nquesting\n~Route"
    ],
    "answer": 0,
    "explain": "Real output, four lines. 1. `Route r;` inside `buildRoute`: `Route()`. 2. `route generated`. 3. `return r;` returns a named local, and g++ builds `r` directly in `route` (named return value optimization), so no copy and no early destructor. 4. `questing`. 5. `route` dies at the end of `main`: `~Route`. The slide says returning by value calls the copy constructor and that some compilers may eliminate it. This optional elimination is what g++ does here. Contrast Q20, where the returned object is a parameter and is always copied."
  },
  {
    "q": "Per the Week 7 slide, when is the copy constructor called? (select all)",
    "options": [
      "When invoking the copy constructor directly",
      "When passing an object by value to a function",
      "When returning an object by value from a function",
      "When passing an object by reference to a function",
      "When assigning one existing object to another, as in `c1 = c;` after both exist"
    ],
    "answer": [0, 1, 2],
    "explain": "The slide's three cases. A reference parameter is another name, so nothing is copied. Assigning to an object that already exists calls the assignment operator, not the copy constructor."
  },
  {
    "type": "tf",
    "q": "In Q20, `A yetAnotherA = foo(littleA);` prints three `Copy constructor!` lines: into `input`, into the return value, and into `yetAnotherA`.",
    "answer": false,
    "explain": "It prints two. The returned copy of `input` is `yetAnotherA` itself, so there is no third copy. C++17 guarantees this for a function's result that starts a new variable."
  }
]
```

## Remember

- Ask of each statement: does it make a new object? `A b = a;`, a by-value parameter and `return input;` do. `b = a;` and a reference parameter do not.
- In `A y = f(a);` the returned copy is `y`. An unused result dies at the `;`, before the parameter.
- Count births and deaths: they must be equal.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for the rule table and the Q20 lines, and side 2, band 4 "True/false and multiple choice traps", static and elision.
