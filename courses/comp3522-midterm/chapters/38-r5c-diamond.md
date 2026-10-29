---
title: "Extra 7: the diamond: the ambiguity, `virtual` inheritance and who builds the base (Q15)"
minutes: 20
---
This lesson teaches what happens when a class inherits the same grandparent along two paths. It prepares you for Q15, the six-mark diamond question in three parts, and for constructor-order traces with a shared base.

## What the diamond is, in plain words

A class may have two parents. That is multiple inheritance: a math_student is both a student and a mathematician.

The diamond appears when both parents come from the same grandparent, person. Drawn as a class diagram, person sits on top, the two parents in the middle and math_student at the bottom: the slide's "classic diamond shape".

Each parent object carries a whole person inside it. So by default one math_student holds two persons: two names and two person constructor calls.

Virtual inheritance asks for one shared person instead. Each middle class writes `virtual` before the base name, and the bottom object then keeps a single person that both sides share.

```diagram
{ "type": "layers", "title": "One math_student object, two layouts", "nodes": [
  { "id": "nv", "label": "math_student, plain inheritance" },
  { "id": "nvs", "label": "student", "parent": "nv" },
  { "id": "nvsp", "label": "person (name)", "parent": "nvs" },
  { "id": "nvm", "label": "mathematician", "parent": "nv" },
  { "id": "nvmp", "label": "person (name)", "parent": "nvm" },
  { "id": "v", "label": "math_student, virtual person" },
  { "id": "vs", "label": "student", "parent": "v" },
  { "id": "vm", "label": "mathematician", "parent": "v" },
  { "id": "vp", "label": "person (shared)", "parent": "v" }
], "hi": ["nvsp", "nvmp", "vp"], "caption": "Plain inheritance: two person subobjects, two names, two constructor calls. With class student : public virtual person (and the same for mathematician): one person, owned by the most-derived object and shared by both sides." }
```

## A tiny program you can run in your head

```cpp run pin twopersons.cpp
// predict: Write the five lines printed. How many say person?
#include <iostream>
using namespace std;

class person {
public:
    person() { cout << "person" << endl; }
};

class student : public person {
public:
    student() { cout << "student" << endl; }
};

class mathematician : public person {
public:
    mathematician() { cout << "mathematician" << endl; }
};

class math_student : public student, public mathematician {
public:
    math_student() { cout << "math_student" << endl; }
};

int main()
{
    math_student bob;
    return 0;
}
```

1. Parents are built in the order written after the colon of `class math_student : public student, public mathematician`. The student part comes first, and its own base comes before its body: `person`.
2. Then the body of `student() { cout << "student" << endl; }`: `student`.
3. The mathematician part has its own person inside: `person`, a second time.
4. Then `mathematician`.
5. The bottom class's body runs last: `math_student`.

Two person lines means two person objects. Write `public virtual person` in both middle classes and the output has one person line, printed first.

## The ambiguity, and its three fixes

Suppose both parents have a function with the same name, and the bottom class does not write its own. A call on the bottom object then has two candidates.

The slide says "there is no priority for one or the other". So the call does not compile.

```cpp run pin ambiguous.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

class student {
public:
    void all_info() const { cout << "student info" << endl; }
};

class mathematician {
public:
    void all_info() const { cout << "mathematician info" << endl; }
};

class math_student : public student, public mathematician {
};

int main()
{
    math_student bob;
    // bob.all_info();
    bob.mathematician::all_info();
    bob.student::all_info();
    return 0;
}
```

1. `bob.mathematician::all_info();` names the parent with `::`, so there is one candidate: `mathematician info`.
2. `bob.student::all_info();` picks the other side: `student info`.

Uncomment `// bob.all_info();` and g++ stops with `request for member 'all_info' is ambiguous`. The three fixes:

- **Qualify the call** with the class name, as above.
- **Override the function** in math_student, so the bottom class has its own version to call.
- **Make person a virtual base**, when the function comes from person itself. There is then one person, so one function to call.

## Who builds the shared person: the rule in the slide's words

With a virtual base, the middle classes cannot both build the one shared person. The bottom class does it.

- "It is the responsibility of the most derived class (math_student) to call the shared base constructor."
- "The person constructor calls in mathematician and student are disabled when they are indirectly called from a derived class."
- The virtual base is built first. Then the direct bases in the order written after the colon, then the bottom class's body.

```diagram
{ "type": "flow", "title": "Building bob with a virtual person", "nodes": [
  { "id": "p", "label": "person(name)", "sub": "called by math_student" },
  { "id": "s", "label": "student", "sub": "its person call skipped" },
  { "id": "m", "label": "mathematician", "sub": "its person call skipped" },
  { "id": "b", "label": "math_student body" }
], "edges": [ { "from": "p", "to": "s" }, { "from": "s", "to": "m" }, { "from": "m", "to": "b" } ], "hi": ["p"], "caption": "The most-derived class builds the virtual base first. The middle classes' calls to the person constructor are ignored." }
```

The trap: if math_student does not name `person(name)` in its list, the person default constructor runs. The middle classes passed the name, but their calls were disabled, so the name is empty.

## The paper's question, worked: Q15

The slide's program puts the whole diamond together: virtual inheritance, a bottom class that builds person, and an override that settles the ambiguity.

```cpp run pin diamond.cpp
// predict: Write the eight lines printed.
#include <iostream>
#include <string>
using namespace std;

class person {
public:
    person() { cout << "person default constructor" << endl; }
    person(const string& name) : name(name) { cout << "person 1-param constructor" << endl; }
    virtual void all_info() const { cout << "[person name=" << name << "]" << endl; }
protected:
    string name;
};

class student : public virtual person {
public:
    student(const string& name, const string& passed) : person(name), passed(passed)
    { cout << "student constructor" << endl; }
    void all_info() const override { person::all_info(); cout << "I passed: " << passed << endl; }
protected:
    string passed;
};

class mathematician : public virtual person {
public:
    mathematician(const string& name, const string& proved) : person(name), proved(proved)
    { cout << "mathematician constructor" << endl; }
    void all_info() const override { person::all_info(); cout << "I proved: " << proved << endl; }
protected:
    string proved;
};

class math_student : public student, public mathematician {
public:
    math_student(const string& name, const string& passed, const string& proved)
        : person(name), student(name, passed), mathematician(name, proved)
    { cout << "math_student constructor" << endl; }
    void all_info() const override { student::all_info(); mathematician::all_info(); }
};

int main()
{
    math_student bob("Robert Robson", "Algebra", "Fermat's Last Theorem");
    bob.all_info();
    return 0;
}
```

1. The virtual base is built first, by the most-derived class, from `: person(name), student(name, passed), mathematician(name, proved)`: `person 1-param constructor`.
2. Then the direct bases in the order written after the colon of `class math_student : public student, public mathematician`. The `person(name)` inside student's list is skipped: `student constructor`.
3. Same for mathematician: `mathematician constructor`.
4. The body of the bottom class runs last: `math_student constructor`.
5. `bob.all_info();` runs math_student's override, which calls `student::all_info()`. That calls `person::all_info()` on the one shared person: `[person name=Robert Robson]`.
6. `I passed: Algebra`.
7. `mathematician::all_info()` reads the same person: `[person name=Robert Robson]`.
8. `I proved: Fermat's Last Theorem`.

Delete `person(name), ` from math_student's list and run it again. The first line becomes `person default constructor`, and both `name=` lines print an empty name.

Delete math_student's `all_info` override instead, and g++ refuses the class. The message is `no unique final overrider for 'virtual void person::all_info() const' in 'math_student'`.

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": true, "init": "most" }
```

## Try it

```quiz
[
  {
    "type": "free",
    "q": "Q15 (6). In C++, multiple inheritance may result in a class diamond-shaped inheritance pattern. a. How does this happen? b. Does this cause any ambiguities with respect to member functions? How can the ambiguities be solved? c. What is the key responsibility of the most-derived class at the bottom of the diamond?",
    "model": "a. Two classes (student, mathematician) inherit from the same base (person), and a fourth class (math_student) inherits from both. Without `virtual` inheritance the bottom object holds two person subobjects.\n\nb. Yes. A function inherited from both sides, `all_info()`, has no priority for one or the other, so `bob.all_info()` is ambiguous and does not compile. Fix it by qualifying the call (`bob.mathematician::all_info()`), by overriding the function in math_student, or, for a function that comes from person itself, by making person a virtual base (`class student : public virtual person`) so there is one copy.\n\nc. With a virtual base, math_student must call the shared base's constructor itself: `math_student(...) : person(name), student(name, passed), mathematician(name, proved)`. The middle classes' calls to person's constructor are ignored, so if math_student forgets, person is default-constructed and the name is lost.",
    "points": [
      "Two classes inherit one base; a fourth inherits from both",
      "Without virtual inheritance the base is stored twice",
      "A function from both sides is ambiguous: the call does not compile",
      "Fixes: qualify with `::`, override in the bottom class, or virtual inheritance",
      "The most-derived class calls the virtual base's constructor in its initializer list",
      "The middle classes' calls are ignored; forgetting it default-constructs the base"
    ],
    "rows": 8,
    "explain": "Two marks per part. For a, the shape (two middle classes, one shared base, one bottom class). For b, the yes plus at least two fixes. For c, the constructor call in the bottom class's list plus what goes wrong without it: the default constructor runs and the name is empty."
  },
  {
    "q": "No `virtual` inheritance anywhere. What does `Hunt h;` print, construction and destruction?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Module {\npublic:\n    Module() { cout << \"Module\" << endl; }\n    ~Module() { cout << \"~Module\" << endl; }\n};\n\nclass Walk : public Module {\npublic:\n    Walk() { cout << \"Walk\" << endl; }\n    ~Walk() { cout << \"~Walk\" << endl; }\n};\n\nclass Fight : public Module {\npublic:\n    Fight() { cout << \"Fight\" << endl; }\n    ~Fight() { cout << \"~Fight\" << endl; }\n};\n\nclass Hunt : public Walk, public Fight {\npublic:\n    Hunt() { cout << \"Hunt\" << endl; }\n    ~Hunt() { cout << \"~Hunt\" << endl; }\n};\n\nint main() {\n    Hunt h;\n}",
    "options": [
      "Module\nWalk\nModule\nFight\nHunt\n~Hunt\n~Fight\n~Module\n~Walk\n~Module",
      "Module\nWalk\nFight\nHunt\n~Hunt\n~Fight\n~Walk\n~Module",
      "Module\nWalk\nModule\nFight\nHunt\n~Hunt\n~Walk\n~Module\n~Fight\n~Module",
      "Hunt\nWalk\nModule\nFight\nModule\n~Module\n~Fight\n~Module\n~Walk\n~Hunt"
    ],
    "answer": 0,
    "explain": "1. Bases construct in the order written after the colon of `class Hunt : public Walk, public Fight`, each base before its own derived part. Walk first: `Module`, `Walk`.\n2. Then Fight, with its own second Module: `Module`, `Fight`. Two Module lines because plain inheritance gives one Module per path, as in Q27.\n3. Hunt's body: `Hunt`.\n4. Destruction is the exact reverse of the five construction lines: `~Hunt`, `~Fight`, `~Module`, `~Walk`, `~Module`. Ten lines in total. With `virtual public Module` on both middle classes there would be one Module, built first and destroyed last."
  },
  {
    "q": "Module is a virtual base and Hunt's constructor does not name it. What does this program print?",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Module {\nprotected:\n    string name;\npublic:\n    Module() : name(\"unnamed\") { cout << \"Module()\" << endl; }\n    Module(const string& n) : name(n) { cout << \"Module(\" << n << \")\" << endl; }\n};\n\nclass Walk : virtual public Module {\npublic:\n    Walk(const string& n) : Module(n) { cout << \"Walk\" << endl; }\n    void show() const { cout << \"I am \" << name << endl; }\n};\n\nclass Fight : virtual public Module {\npublic:\n    Fight(const string& n) : Module(n) { cout << \"Fight\" << endl; }\n};\n\nclass Hunt : public Walk, public Fight {\npublic:\n    Hunt(const string& n) : Walk(n), Fight(n) { cout << \"Hunt\" << endl; }\n};\n\nint main() {\n    Hunt h(\"Slime hunt\");\n    h.show();\n    Walk w(\"to Olaf\");\n    w.show();\n}",
    "options": [
      "Module()\nWalk\nFight\nHunt\nI am unnamed\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module(Slime hunt)\nWalk\nFight\nHunt\nI am Slime hunt\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module(Slime hunt)\nWalk\nModule(Slime hunt)\nFight\nHunt\nI am Slime hunt\nModule(to Olaf)\nWalk\nI am to Olaf",
      "Module()\nWalk\nFight\nHunt\nI am unnamed\nModule()\nWalk\nI am unnamed"
    ],
    "answer": 0,
    "explain": "1. Hunt is the most-derived class, so it constructs the virtual base Module first. Its list `: Walk(n), Fight(n)` does not name Module, so Module's default constructor runs: `Module()`.\n2. Walk's `Module(n)` and Fight's `Module(n)` are disabled while a Hunt is being built: `Walk`, `Fight`.\n3. `Hunt`.\n4. `h.show();` reads the one shared Module, whose name is the default: `I am unnamed`.\n5. `Walk w(\"to Olaf\");` makes Walk the most-derived class this time, so its own `Module(n)` call runs: `Module(to Olaf)`, `Walk`.\n6. `w.show();`: `I am to Olaf`. The fix for the hunt is `Hunt(const string& n) : Module(n), Walk(n), Fight(n)`."
  },
  {
    "q": "student and mathematician both inherit `public virtual person`, and both write their own `all_info()`. math_student inherits from both and writes no `all_info()`. Which change makes `bob.all_info();` compile?",
    "options": [
      "Write its own `void all_info() const` in math_student",
      "Remove `virtual` from both middle classes",
      "Add `person(name)` to math_student's initializer list",
      "Make `all_info()` virtual in person"
    ],
    "answer": 0,
    "explain": "The two candidates come from student and mathematician, not from person, so a single shared person does not help. Removing `virtual` gives two persons and still two `all_info` versions. Naming `person(name)` fixes the lost name, not the ambiguity. Only a version in the bottom class, or a qualified call such as `bob.student::all_info()`, gives the compiler one function to pick."
  }
]
```

## Remember

- Plain inheritance along two paths gives the bottom object two copies of the grandparent. `virtual` inheritance gives one shared copy.
- A function inherited from both parents is ambiguous: qualify the call with `::`, or override it in the bottom class.
- With a virtual base, the most-derived class calls its constructor, first. The middle classes' calls are skipped.
- *On the sheet:* Sheet side 2, band 2 "What is X? How is it different from Y? When is it used?" (the Diamond entry), and side 1, band 1 "What is printed by this code?" for virtual-base order.
