---
title: "Extra 10: the constructor rules the multiple choice tests"
minutes: 20
---
Five short rules about object creation show up as multiple choice traps. Each one is a line that looks right and does something else.

## What happens when an object is born, in plain words

A constructor is the function that runs when an object is born. It has the class's name, no return type, and it sets up the new object's data.

A default constructor is one that takes no arguments. It runs for a line that makes an object and passes nothing.

The body is not the first thing to run. Before it, the object's parts are built: a base class part first, then each member.

A base class is the class another class is built on. A derived object holds a whole base object inside it, so that inner part must exist before anything else.

```diagram
{ "type": "flow", "title": "The order inside every constructor", "nodes": [
  { "id": "b", "label": "base part", "sub": "built first" },
  { "id": "m", "label": "members", "sub": "in declaration order" },
  { "id": "y", "label": "body", "sub": "runs last" }
], "edges": [ { "from": "b", "to": "m" }, { "from": "m", "to": "y" } ], "hi": ["m"], "caption": "Every constructor builds the base first, then the members in the order the class declares them, then runs its body." }
```

## Empty brackets after an object's name

C++ reads anything that can be a function declaration as one. A line with a type, a name and empty round brackets fits that shape.

```cpp run pin vexing.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

class Mob {
public:
    Mob() { cout << "Mob()" << endl; }
};

int main()
{
    Mob a;
    Mob b{};
    Mob c();
    cout << "end" << endl;
    return 0;
}
```

1. `Mob()`: `Mob a;` makes an object with the default constructor.
2. `Mob()`: `Mob b{};` does the same with braces.
3. `end`: `Mob c();` printed nothing. It declared a function named `c` that takes nothing and returns a `Mob`.

g++ warns that the "empty parentheses were disambiguated as a function declaration". The program still compiles, but no object `c` exists.

The slide calls `Circle my_circle();` "a function prototype. MOST VEXING PARSE". Write `Circle my_circle;` or `Circle my_circle{};` to call the default constructor.

## The order members are built in

A member initializer list is the part after the colon in a constructor. It gives each member its first value.

The list says which value, not when. The class body fixes the order: the member declared first is built first.

```diagram
{ "type": "grid", "title": "Talk: declared first, built first", "nodes": [
  { "id": "h0", "label": "member", "row": 0, "col": 0 },
  { "id": "h1", "label": "declared", "row": 0, "col": 1 },
  { "id": "h2", "label": "in the list", "row": 0, "col": 2 },
  { "id": "h3", "label": "built", "row": 0, "col": 3 },
  { "id": "f0", "label": "first", "row": 1, "col": 0 },
  { "id": "f1", "label": "1st", "row": 1, "col": 1 },
  { "id": "f2", "label": "2nd", "row": 1, "col": 2 },
  { "id": "f3", "label": "1st", "row": 1, "col": 3 },
  { "id": "s0", "label": "second", "row": 2, "col": 0 },
  { "id": "s1", "label": "2nd", "row": 2, "col": 1 },
  { "id": "s2", "label": "1st", "row": 2, "col": 2 },
  { "id": "s3", "label": "2nd", "row": 2, "col": 3 }
], "hi": ["f1", "f3"], "caption": "The built column always matches the declared column, whatever the list says." }
```

```cpp run pin member_order.cpp
// predict: Write the three lines printed, in order.
#include <iostream>
#include <string>
using namespace std;

class Step {
public:
    Step(const string& s) { cout << "Step " << s << endl; }
};

class Talk {
    Step first;
    Step second;
public:
    Talk() : second("second"), first("first") { cout << "Talk" << endl; }
};

int main()
{
    Talk t;
    return 0;
}
```

1. `Step first`: `Step first;` is declared first, so it is built first. The list names `second("second")` first, and that changes nothing.
2. `Step second`: the next member in the class body.
3. `Talk`: the body runs after all members.

The compile also prints a `-Wreorder` warning: the list disagrees with the class. The slide's rule is that members are initialized "by the order of member declaration and not by the order of their appearance in member initialization list".

## When the compiler writes a default constructor

A class with no constructor at all gets a default one written by the compiler. The moment you write any constructor yourself, the compiler stops.

```cpp run pin no_default.cpp
// predict: Write the line printed.
#include <iostream>
#include <string>
using namespace std;

class Olaf {
public:
    Olaf(const string& town) { cout << "Olaf in " << town << endl; }
};

int main()
{
    Olaf o("Lith Harbor");
    // Olaf none;   // error: no matching function for call to 'Olaf::Olaf()'
    return 0;
}
```

1. `Olaf in Lith Harbor`: `Olaf o("Lith Harbor");` passes a town, which matches the one constructor.

Uncomment `Olaf none;` and g++ stops with the error in the comment. `Olaf` wrote a constructor, so it has no default one. To get it back, write a constructor with no parameters yourself.

## Which base constructor runs

A derived constructor chooses which base constructor runs by naming it after the colon. If it names none, the base's default constructor runs.

```cpp run pin base_pick.cpp
// predict: Write the four lines printed, in order.
#include <iostream>
#include <string>
using namespace std;

class Npc {
public:
    Npc() { cout << "Npc()" << endl; }
    Npc(int id) { cout << "Npc(" << id << ")" << endl; }
};

class Grendel : public Npc {
public:
    Grendel(int id) : Npc(id) { cout << "Grendel" << endl; }
};

class Olaf : public Npc {
public:
    Olaf(const string& town) { cout << "Olaf in " << town << endl; }
};

int main()
{
    Grendel g(313);
    Olaf o("Lith Harbor");
    return 0;
}
```

1. `Npc(313)`: `Grendel(int id) : Npc(id)` picks the base constructor that takes an `int`. The base runs first.
2. `Grendel`: then the derived body.
3. `Npc()`: `Olaf(const string& town)` names no base constructor, so `Npc()` runs.
4. `Olaf in Lith Harbor`: then the body.

The rule: `Derived(int a) : Base(a)` picks `Base(int)`. Without it, `Base()` runs, and a base with no default constructor is a compile error.

## The initializer list versus assignment in the body

A member is always built before the constructor's body starts. If the list gives it no value, it is built with its own default constructor.

An assignment in the body then changes it a second time. The list builds it once, with the right value.

```cpp run pin list_or_body.cpp
// predict: Write the five lines printed, in order.
#include <iostream>
using namespace std;

class Tag {
public:
    Tag() { cout << "Tag()" << endl; }
    Tag(char c) { cout << "Tag(" << c << ")" << endl; }
    Tag& operator=(const Tag&) { cout << "assign" << endl; return *this; }
};

class InBody {
    Tag tag;
public:
    InBody() { tag = Tag('x'); }
};

class InList {
    Tag tag;
public:
    InList() : tag('x') {}
};

int main()
{
    InBody a;
    cout << "--" << endl;
    InList b;
    return 0;
}
```

1. `Tag()`: `InBody a;` builds the member `tag` with its default constructor, before the body.
2. `Tag(x)`: the body's `Tag('x')` makes a temporary object.
3. `assign`: `tag = Tag('x');` copies the temporary into the member. That is a second step.
4. `--`: the marker line.
5. `Tag(x)`: `InList() : tag('x')` builds the member once, with the right value.

The slide's rule: always use the member initialization list. A `const` member or a reference member can only get its value there, because neither can be assigned later.

:::warn The body is too late
By the time the body runs, every member already exists. The body can only change a member, never choose how it is built.
:::

## Try it

```quiz
[
  {
    "q": "Inside `main`, what does the line `Mob slime();` do?",
    "options": [
      "Declares a function named `slime` that takes no arguments and returns a `Mob`",
      "Creates a `Mob` named `slime` with the default constructor",
      "Creates a `Mob` named `slime` with every member set to zero",
      "Does not compile"
    ],
    "answer": 0,
    "explain": "1. Anything that can be read as a function declaration is read as one.\n2. `Mob slime();` fits the shape `ReturnType name(parameters);`, so it declares a function: the slide's MOST VEXING PARSE.\n3. It compiles, with a g++ warning, but no object exists, so any later use of `slime` as a `Mob` fails.\n4. Write `Mob slime;` or `Mob slime{};` for the default constructor."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Tag {\npublic:\n    Tag(char c) { cout << c; }\n};\n\nclass Pair {\n    Tag b;\n    Tag a;\npublic:\n    Pair() : a('A'), b('B') { cout << endl; }\n};\n\nint main() {\n    Pair p;\n    return 0;\n}",
    "options": ["BA", "AB", "A", "B"],
    "answer": 0,
    "explain": "1. The class declares `Tag b;` before `Tag a;`.\n2. Members are built in declaration order, so `b('B')` runs first and prints `B`.\n3. Then `a('A')` prints `A`.\n4. The list order `a('A'), b('B')` does not matter; g++ only warns with `-Wreorder`.\n5. Output: `BA`."
  },
  {
    "q": "What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Npc {\npublic:\n    Npc() { cout << \"Npc()\" << endl; }\n    Npc(int id) { cout << \"Npc \" << id << endl; }\n};\n\nclass Grendel : public Npc {\npublic:\n    Grendel(int id) { cout << \"Grendel \" << id << endl; }\n};\n\nint main() {\n    Grendel g(313);\n    return 0;\n}",
    "options": ["Npc()\nGrendel 313", "Npc 313\nGrendel 313", "Grendel 313", "Grendel 313\nNpc()"],
    "answer": 0,
    "explain": "1. The base is always built before the derived body.\n2. `Grendel(int id)` has no initializer list, so it does not name `Npc(id)`, and `Npc()` runs: `Npc()`.\n3. Then the body: `Grendel 313`.\n4. To get `Npc 313`, write `Grendel(int id) : Npc(id)`."
  },
  {
    "q": "True or false: a class whose only constructor is `Olaf(const string& town)` can still be created with `Olaf o;`.",
    "type": "tf",
    "answer": false,
    "explain": "1. The compiler writes a default constructor only for a class that declares no constructor at all.\n2. `Olaf` declares one, so there is no `Olaf()`.\n3. `Olaf o;` fails: `no matching function for call to 'Olaf::Olaf()'`.\n4. Writing `Olaf() {}` yourself brings it back."
  },
  {
    "q": "Class `Box` has a member `Tag tag;`, and `Tag` has a default constructor and `Tag(char)`. Which `Box` constructor builds `tag` exactly once?",
    "options": [
      "`Box() : tag('x') {}`",
      "`Box() { tag = Tag('x'); }`",
      "`Box() { Tag tag('x'); }`",
      "`Box() { tag.Tag('x'); }`"
    ],
    "answer": 0,
    "explain": "1. Every member is built before the body runs.\n2. `Box() : tag('x') {}` builds `tag` with `Tag(char)` once, in the list.\n3. `Box() { tag = Tag('x'); }` builds `tag` with `Tag()`, then makes a temporary and assigns it: two steps.\n4. `Box() { Tag tag('x'); }` makes a new local variable that hides the member, and the member is still built with `Tag()`.\n5. `tag.Tag('x')` is not a way to call a constructor and does not compile."
  }
]
```

## Remember

- `C c();` declares a function. Use `C c;` or `C c{};` for an object.
- Members are built in declaration order, before the body. The base part comes before them, and it is `Base()` unless the list names another.
- Write any constructor and the free default one is gone.
- *On the sheet:* Sheet side 1, band 1 "What is printed by this code?" for construction order. Sheet side 2, band 4 "True/false and multiple choice traps" for the vexing parse.
