---
title: "Extra 12: static members and copy elision"
minutes: 25
---
This lesson teaches the one value a whole class shares, and when the compiler skips a copy you wrote. It prepares the true-or-false items on static members and the "how many objects" questions.

## What a static member is, in plain words

Every object normally carries its own copy of each data member. Two mobs each have their own name and their own hit points.

Sometimes the class needs one value for all its objects together, such as how many mobs are alive right now. That shared value is a static data member.

Think of one scoreboard on the wall of the map. Every mob updates the same board, and the board is there before the first mob spawns.

```diagram
{ "type": "flow", "title": "Two objects, one shared counter", "nodes": [
  { "id": "s", "label": "slime", "sub": "own name, own hp" },
  { "id": "a", "label": "Mob::alive", "sub": "one copy, value 2" },
  { "id": "g", "label": "ghost", "sub": "own name, own hp" }
], "edges": [ { "from": "s", "to": "a", "label": "reads" }, { "from": "g", "to": "a", "label": "reads" } ], "hi": ["a"], "caption": "A static data member has one copy per class, shared by every object, and it exists even when no object does." }
```

## A tiny program you can run in your head

The word `static` in front of a member makes it shared. The member is then reached through the class name, `Mob::alive`, or through any object.

```cpp run pin alive_tiny.cpp
// predict: Write the three printed lines.
#include <iostream>
using namespace std;

class Mob {
public:
    static int alive;
    Mob() { ++alive; }
    ~Mob() { --alive; }
};

int Mob::alive = 0;

int main() {
    cout << Mob::alive << '\n';
    Mob slime;
    {
        Mob ghost;
        cout << Mob::alive << ' ' << slime.alive << '\n';
    }
    cout << Mob::alive << '\n';
    return 0;
}
```

1. `int Mob::alive = 0;` creates the counter before any object, so `cout << Mob::alive << '\n';` prints `0`.
2. `Mob slime;` and `Mob ghost;` each run `++alive;`. Both names read the same counter: `2 2`.
3. The inner closing brace destroys `ghost`, whose `--alive;` brings it down: `1`.

The two objects never had a counter of their own, so both saw the same number.

## The rule, in the slide's words

- A static data member has "only one copy per class".
- A plain static "can't be initialized inside" the class: it is defined outside, `int X::n = 0;`.
- A `const static` member of an integral type may be initialized inside. A `constexpr static` member must be.

A static member function belongs to the class, not to one object. It has no `this` pointer, the hidden pointer to the object a function was called on.

The slide: a static function "can only access static data and invoke static member functions", and it "cannot be virtual or const". The full truth is that it can still use the members of an object it is handed as a parameter.

## Try it: static members

```quiz
[
  {
    "q": "By the slide's rules, which line may appear inside `class X { ... };` with its initializer?",
    "options": ["`const static int m = 9;`", "`static int m = 5;`", "`constexpr static int k;`", "`static const double* pointer = nullptr;`"],
    "answer": 0,
    "explain": "Slide 7: \"constant integral or enumeration types can be initialized inside the class definition\". A plain static \"can't be initialized inside\" (slide 6); define it outside as `int X::m = 5;`. `constexpr static` must have its initializer inside (slide 8), so `k` with none is an error. A `const double*` is not integral. Since C++17, `inline static int m = 5;` is also legal inside; the exam follows the slide."
  },
  {
    "q": "A static member function can only access static data and invoke static member functions.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 9's wording, so it is keyed true. The reason is that there is no `this` pointer, so the function has no object of its own. The full truth: it can still reach non-static members through an object it is given, as the sample's `staticFunctionParam(A a)` does with `a.nonStaticFunction()`."
  },
  {
    "q": "Which member function declaration compiles?",
    "options": ["`static int count();`", "`virtual static int count();`", "`static int count() const;`", "`static int count() { return this->alive; }`"],
    "answer": 0,
    "explain": "Slide 9: static functions \"cannot be virtual or const\", and \"there is no *this pointer\". `virtual` needs an object to dispatch on, and `const` describes `*this`, so both make no sense without an object."
  }
]
```

## What copy elision is, in plain words

A copy constructor is the function that builds a new object as a copy of an existing one. Code often asks for a temporary object that is then copied into its final place.

Copy elision means the compiler skips that copy. It builds the object straight in its final place, so only one object is ever made.

Think of a crafted item. Instead of crafting it on the bench and then moving it into your bag, the game crafts it straight into the bag.

```diagram
{ "type": "grid", "title": "Number n = createNumber(5);", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "objects made", "row": 0, "col": 1 },
  { "id": "h2", "label": "lines printed", "row": 0, "col": 2 },
  { "id": "w0", "label": "as written", "row": 1, "col": 0 },
  { "id": "w1", "label": "temporary, n", "row": 1, "col": 1 },
  { "id": "w2", "label": "1-param, copy", "row": 1, "col": 2 },
  { "id": "e0", "label": "elided", "row": 2, "col": 0 },
  { "id": "e1", "label": "n only", "row": 2, "col": 1 },
  { "id": "e2", "label": "1-param", "row": 2, "col": 2 }
], "hi": ["e1", "e2"], "caption": "With elision the returned object is constructed straight into the memory of n, and no copy constructor runs." }
```

## A tiny program on elision

```cpp run pin number_temp.cpp
// predict: Write the four printed lines. How many Number objects are made?
#include <iostream>

class Number {
    int num;
public:
    Number(int n) : num(n) { std::cout << "1-param constructor\n"; }
    Number(const Number& n2) : num(n2.num) { std::cout << "copy constructor\n"; }
};

void show(Number) {
    std::cout << "show\n";
}

int main() {
    Number n(Number(2));
    std::cout << "---\n";
    show(n);
    return 0;
}
```

1. `Number n(Number(2));` asks for a temporary and a copy. The temporary is built straight into `n`, so only `1-param constructor` prints.
2. `std::cout << "---\n";` prints `---`.
3. `show(n);` passes by value, so the parameter is a real copy of `n`: `copy constructor`.
4. The body prints `show`.

Building from a temporary was elided, but copying an existing named object into a parameter was not.

## The rule, in the slide's words

Slide 23 says the copy constructor is called in three moments:

- a direct copy, `MyClass c1 = c;`
- passing an object by value to a function
- returning an object by value from a function

Assigning to an object that already exists is not one of them. There `operator=`, the assignment operator, runs instead.

The slides call elision "a compiler optimization technique", and "there's no guarantee that all compilers use RVO and NRVO". RVO is returning a temporary, and NRVO is returning a named local.

:::warn Keyed to the slide
True-or-false items key to the slide's words. Since C++17, building from a temporary of the same type is always elided, while NRVO stays optional and a returned parameter is never elided.
:::

## The worked program: counting mobs

```cpp run pin r6_alive.cpp
// predict: Write every line. Count the Mob objects: does spawn() cost a copy, and does fight() cost one?
#include <iostream>
#include <string>
using namespace std;

class Mob {
    string name;
public:
    static int alive;
    Mob(const string& n) : name(n) { ++alive; cout << "spawn " << name << '\n'; }
    Mob(const Mob& other) : name(other.name) { ++alive; cout << "copy " << name << '\n'; }
    ~Mob() { --alive; cout << "gone " << name << '\n'; }
    static int count() { return alive; }
};

int Mob::alive = 0;

Mob spawn(const string& n) {
    return Mob(n);
}

void fight(Mob m) {
    cout << "fight, alive " << m.count() << '\n';
}

int main() {
    cout << "alive " << Mob::alive << '\n';
    Mob slime = spawn("Slime");
    cout << "alive " << Mob::count() << '\n';
    fight(slime);
    cout << "alive " << Mob::count() << '\n';
    return 0;
}
```

1. `int Mob::alive = 0;` exists before any Mob, so `Mob::alive` is readable at once: `alive 0`.
2. `Mob slime = spawn("Slime");` runs one constructor: `spawn Slime`. `return Mob(n);` returns a temporary of the same type, so it is built straight into `slime`.
3. `Mob::count()` is called on the class: `alive 1`.
4. `fight(slime);` copies the argument into the by-value parameter `m`: `copy Slime`.
5. Inside, `m.count()` calls the static function through an object: `fight, alive 2`.
6. `fight` returns and `m` is destroyed: `gone Slime`.
7. Back in main: `alive 1`.
8. main ends and `slime` is destroyed: `gone Slime`.

```widget
elision-trace
{ "case": "rvo" }
```

## Try it: copies and elision

```quiz
[
  {
    "q": "How many `Number` objects does this slide-13 program create? What does it print?",
    "code": "class Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\nNumber createNumber(int num)\n{\n        return Number(num);\n}\nint main() {\n        Number n = createNumber(5);\n        return 0;\n}",
    "options": ["1-param constructor", "1-param constructor\ncopy constructor", "1-param constructor\ncopy constructor\ncopy constructor", "copy constructor"],
    "answer": 0,
    "explain": "1. `return Number(num);` builds a temporary of the same type as the return value.\n2. Slide 15: RVO \"directly constructs the object initialized inside the createNumber function into the memory space of n\".\n3. One object, one line. Since C++17 this case is guaranteed, not just a compiler choice."
  },
  {
    "q": "Slide 95's case: the function returns its by-value parameter. What prints?",
    "code": "class Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\nNumber myFunction(Number mcCopy)\n{\n        return mcCopy; //return value is also copied\n}\nint main() {\n        Number mc(5);\n        Number mc2 = myFunction(mc);\n        return 0;\n}",
    "options": ["1-param constructor\ncopy constructor\ncopy constructor", "1-param constructor\ncopy constructor", "1-param constructor", "1-param constructor\ncopy constructor\ncopy constructor\ncopy constructor"],
    "answer": 0,
    "explain": "1. `Number mc(5);` prints `1-param constructor`.\n2. Passing by value copies `mc` into `mcCopy`: `copy constructor`.\n3. `return mcCopy;` copies the parameter into `mc2`: `copy constructor`. A parameter is never elided, so this copy is real on every compiler."
  },
  {
    "q": "On slide 23, when is the copy constructor called? (select all)",
    "options": ["`MyClass c1 = c;`", "passing an object by value to a function", "returning an object by value from a function", "`c2 = c;` where `c2` already exists"],
    "answer": [0, 1, 2],
    "explain": "The slide's three moments: invoking it directly, passing by value, returning by value. Keyed to the slide: the truth is that the return copy may be elided (always, since C++17, for a returned temporary). `c2 = c;` on an existing object is assignment: `operator=` runs, not the copy constructor."
  },
  {
    "q": "Copy elision is an optimization that not every compiler uses.",
    "type": "tf",
    "answer": true,
    "explain": "Keyed to slides 12 and 16 (\"a compiler optimization technique\", \"there's no guarantee that all compilers use RVO and NRVO\"). The truth since C++17: elision is guaranteed when initializing from a temporary of the same type (`return Number(num);`, `Number n(Number(2));`); only NRVO, returning a named local, is still optional."
  }
]
```

## Remember

- One static data member is shared by every object and exists before any object does.
- A returned temporary is built straight into its target, but a by-value parameter is always a real copy.
- *On the sheet:* Sheet side 2, band 4 "True/false and multiple choice traps", Static and elision.
