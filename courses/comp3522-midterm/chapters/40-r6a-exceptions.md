---
title: "Extra 4: exceptions: throw, try, catch, and unwinding"
minutes: 25
---
This lesson teaches how an error travels out of a function and who gets to handle it. It prepares the true-or-false and what-prints questions on handler order and unwinding.

## What an exception is, in plain words

Sometimes a function meets a problem it cannot fix where it is. A map loader is given an id that does not exist, and it has no sensible value to return.

An exception is a message object that the function sends upward instead of returning. The function stops at once, and the message travels back to whoever called it.

Some caller further up has said "I can deal with this kind of problem". That caller's handler runs, and the program carries on after it.

Think of a quest step that fails: the runner raises a flag and walks back along the route until someone who knows what to do takes the flag.

```diagram
{ "type": "flow", "title": "The life of one exception", "nodes": [
  { "id": "t", "label": "throw", "sub": "make the message" },
  { "id": "l", "label": "leave the block", "sub": "the rest is skipped" },
  { "id": "f", "label": "find a catch", "sub": "first one that fits" },
  { "id": "h", "label": "handler runs" },
  { "id": "c", "label": "carry on", "sub": "after the try" }
], "edges": [ { "from": "t", "to": "l" }, { "from": "l", "to": "f" }, { "from": "f", "to": "h" }, { "from": "h", "to": "c" } ], "hi": ["f"], "caption": "A throw skips the rest of the block, the first matching handler runs, and the program continues after the whole try." }
```

## A tiny program you can run in your head

The word `throw` sends the message. A `try` block marks the code being watched, and each `catch` after it is a handler for one type of message.

```cpp run pin loadMap.cpp
// predict: Write every line printed. Which line never runs?
#include <iostream>
#include <stdexcept>
using namespace std;

int loadMap(int id) {
    if (id < 0) {
        throw invalid_argument("bad map id");
    }
    return id * 10;
}

int main() {
    try {
        cout << loadMap(5) << '\n';
        cout << loadMap(-1) << '\n';
        cout << "not reached\n";
    } catch (invalid_argument& e) {
        cout << "caught: " << e.what() << '\n';
    }
    cout << "done\n";
    return 0;
}
```

1. `cout << loadMap(5) << '\n';` gets a normal return value: `50`.
2. `cout << loadMap(-1) << '\n';` reaches `throw invalid_argument("bad map id");`. Nothing more of that line prints, and `"not reached"` is skipped.
3. `catch (invalid_argument& e)` matches the thrown type, and `e.what()` gives back the text: `caught: bad map id`.
4. The try is over, so the program carries on: `done`.

The thrown object carried its own message, and only the handler that matched its type ran.

## The rule, in the slide's words

The slides give six guidelines for handlers:

- "Catch exceptions by reference": a handler for a parent type then also takes every child type.
- "The first catch-block with a matching type is executed".
- "Further catch-blocks of the same type or child-types are ignored", so the child type goes first.
- "A catch-block with an ellipsis, i.e., three dots, catches all exceptions": "Obviously this should be the last one".
- Print an informative message and terminate, or rescue and rethrow with a bare `throw;`.

Catching by value copies only the parent part of the object. That loss is called slicing, and the copy's `what()` gives the parent's text.

If no handler anywhere matches, the special function `std::terminate` is called. It calls `abort`, and the slide calls this "CRASH AND BURN".

:::warn The order trap
A parent handler written above a child handler takes the child too. The child handler below it never runs, and g++ only warns.
:::

## Try it: handler order

```quiz
[
  {
    "q": "`MapNotFound` derives from `runtime_error`. What does this print?",
    "code": "class MapNotFound : public runtime_error {\npublic:\n    MapNotFound() : runtime_error(\"no map\") {}\n};\nint main() {\n    try { throw MapNotFound(); }\n    catch (exception& e) { cout << \"general: \" << e.what() << '\\n'; }\n    catch (MapNotFound& e) { cout << \"map: \" << e.what() << '\\n'; }\n}",
    "options": ["general: no map", "map: no map", "general: std::exception", "a compile error: the second handler can never run"],
    "answer": 0,
    "explain": "1. The first handler with a matching type runs, top to bottom.\n2. `MapNotFound` is an `exception`, so `catch (exception& e)` matches first.\n3. It is caught by reference, so `what()` still dispatches to the real object and prints `no map`.\n4. The `MapNotFound` handler is ignored. g++ only warns (\"will be caught by earlier handler\"); it still compiles. The fix is child type first."
  },
  {
    "q": "A `catch (...)` block should be written first, so that no exception slips past the specific handlers.",
    "type": "tf",
    "answer": false,
    "explain": "The slide: \"Obviously this should be the last one.\" Handlers are tried in order, so a catch-all at the top would take every exception and the specific handlers below it would never run."
  },
  {
    "q": "The same `MapNotFound` is caught by value. What prints?",
    "code": "class MapNotFound : public runtime_error {\npublic:\n    MapNotFound() : runtime_error(\"no map\") {}\n};\nint main() {\n    try { throw MapNotFound(); }\n    catch (exception e) { cout << \"caught: \" << e.what() << '\\n'; }\n}",
    "options": ["caught: std::exception", "caught: no map", "nothing: a by-value handler does not match a derived type", "caught: MapNotFound"],
    "answer": 0,
    "explain": "1. The handler matches: a derived object can initialize a base.\n2. By value, `e` is a fresh `std::exception` copied from the base part only. That is slicing.\n3. `e.what()` now runs `std::exception`'s own version, which in g++ returns `std::exception`.\n4. This is why the first guideline is \"Catch exceptions by reference\": the reference keeps the real object and its message."
  },
  {
    "q": "Nothing catches the `MapNotFound` thrown in `travel` (same class as above). What does this program print?",
    "code": "class MapNotFound : public runtime_error {\npublic:\n    MapNotFound() : runtime_error(\"no map\") {}\n};\nvoid travel() {\n    cout << \"travel\\n\";\n    throw MapNotFound();\n}\nint main() {\n    cout << \"start\\n\";\n    try { travel(); }\n    catch (invalid_argument& e) { cout << \"bad argument\\n\"; }\n    cout << \"after\\n\";\n}",
    "options": ["start\ntravel", "start\ntravel\nafter", "start\ntravel\nbad argument\nafter", "start"],
    "answer": 0,
    "explain": "1. `start` and `travel` print.\n2. The throw looks for a handler: `invalid_argument` is a `logic_error`, not a `runtime_error`, so it does not match.\n3. No handler matches anywhere, so `std::terminate` is called: it calls `abort` and the program ends (exit code 3 on the server).\n4. `after` never prints. Slide 29: \"CRASH AND BURN\"."
  }
]
```

## Unwinding, in plain words

Each function call gets its own frame on the stack. The stack is the memory where a function's local variables live while it runs.

When an exception leaves a function, that frame is thrown away. Every local object in it is destroyed on the way out, newest first, so each destructor still runs.

A frame with no matching handler is simply passed through. The search goes on in its caller, then the caller's caller.

```diagram
{ "type": "grid", "title": "Frames on the stack while travel throws", "nodes": [
  { "id": "h0", "label": "frame", "row": 0, "col": 0 },
  { "id": "h1", "label": "local", "row": 0, "col": 1 },
  { "id": "h2", "label": "as it is left", "row": 0, "col": 2 },
  { "id": "a0", "label": "travel (newest)", "row": 1, "col": 0 },
  { "id": "a1", "label": "Step t", "row": 1, "col": 1 },
  { "id": "a2", "label": "destroyed first", "row": 1, "col": 2 },
  { "id": "b0", "label": "walk", "row": 2, "col": 0 },
  { "id": "b1", "label": "Step w", "row": 2, "col": 1 },
  { "id": "b2", "label": "destroyed next", "row": 2, "col": 2 },
  { "id": "c0", "label": "main (oldest)", "row": 3, "col": 0 },
  { "id": "c1", "label": "Step r", "row": 3, "col": 1 },
  { "id": "c2", "label": "holds the handler", "row": 3, "col": 2 }
], "hi": ["a2"], "caption": "The exception leaves the newest frame first, and each frame's locals are destroyed as it is left." }
```

## The slide's three-frame program, worked

The slide's unwinding example has three nested calls, each with a local that prints when it is born and when it dies. Here it is with game names.

```cpp run pin r6_unwind.cpp
// predict: Write every line in order. Mark where the throw happens, then list the destructor lines in the order the frames are left.
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class MapNotFound : public runtime_error {
public:
    MapNotFound(const string& id) : runtime_error("no map " + id) {}
};

class Step {
    string name;
public:
    Step(const string& n) : name(n) { cout << name << " start\n"; }
    ~Step() { cout << name << " end\n"; }
};

void travel(int portal) {
    Step t("travel");
    if (portal == 0) {
        throw MapNotFound("10002003");
    }
    cout << "arrived\n";
}

void walk() {
    Step w("walk");
    try {
        travel(0);
    } catch (MapNotFound& e) {
        cout << "walk caught: " << e.what() << '\n';
        throw;
    }
}

int main() {
    Step r("route");
    try {
        walk();
    } catch (exception& e) {
        cout << "main caught: " << e.what() << '\n';
    }
    cout << "parked\n";
    return 0;
}
```

1. `Step r("route");` builds main's local: `route start`.
2. `walk();` enters walk, and `Step w("walk");` prints `walk start`.
3. `travel(0);` enters travel, and `Step t("travel");` prints `travel start`.
4. `throw MapNotFound("10002003");` leaves travel, which has no handler. Its local dies on the way out: `travel end`. `arrived` never prints.
5. walk's `catch (MapNotFound& e)` matches: `walk caught: no map 10002003`. The text comes from `what()`, which `runtime_error` stored from the constructor argument.
6. `throw;` sends the same object on. walk is left, so `w` dies: `walk end`.
7. main's `catch (exception& e)` matches, because a `MapNotFound` is a `runtime_error`, which is an `exception`: `main caught: no map 10002003`.
8. The try is finished, so main carries on: `parked`.
9. main ends and `r` dies: `route end`.

```diagram
{ "type": "flow", "title": "Where the exception goes", "nodes": [
  { "id": "t", "label": "travel", "sub": "throws; travel end" },
  { "id": "w", "label": "walk", "sub": "catches, rethrows; walk end" },
  { "id": "m", "label": "main", "sub": "catches; parked" }
], "edges": [ { "from": "t", "to": "w", "label": "unwind" }, { "from": "w", "to": "m", "label": "throw;" } ], "hi": ["w"], "caption": "Each frame's locals die as the exception leaves it. A handler can rethrow, and the search starts again from its caller." }
```

```widget
unwind-stepper
{ "preset": "caught in main (rethrow in level2)", "presets": true }
```

## noexcept, a constructor that throws, and the family of exceptions

A function can promise that no exception will ever leave it. The promise is the word `noexcept` after its parameter list.

If an exception tries to leave anyway, the slide says "the program ends". `std::terminate` runs, and no outer handler is ever searched.

Destructors carry this promise without being told. The slide's rule: "NEVER throw an exception from a destructor".

A constructor that throws never finishes, so no object exists. Its destructor never runs, but objects built before it are still destroyed during unwinding.

The standard exceptions form a family under `std::exception`. Its `what()` is a virtual function, which means a derived class's own version runs through a parent reference.

- `logic_error` has the children `invalid_argument`, `length_error` and `out_of_range`.
- `runtime_error` has the children `range_error` and `overflow_error`.
- They live in the header `<stdexcept>`.

## The paper's question, worked: Q21's constructor

Q21 asks for a Fraction constructor that throws when the denominator is 0. Here is the model answer inside a small test.

```cpp run pin q21_throw.cpp
// predict: Write every line printed. Does bad ever exist?
#include <iostream>
#include <stdexcept>
using namespace std;

class Fraction {
    int numerator;
    int denominator;
public:
    Fraction(int numerator, int denominator) : numerator(numerator), denominator(denominator) {
        if (denominator == 0) {
            throw std::invalid_argument("Denominator cannot be zero");
        }
    }
};

int main() {
    try {
        Fraction half(1, 2);
        cout << "half built\n";
        Fraction bad(3, 0);
        cout << "bad built\n";
    } catch (std::invalid_argument& e) {
        cout << e.what() << '\n';
    }
    return 0;
}
```

1. `Fraction half(1, 2);` finishes normally, so `cout << "half built\n";` prints `half built`.
2. `Fraction bad(3, 0);` throws inside its constructor, so `bad` never exists and `"bad built"` is skipped.
3. Leaving the try destroys `half`. Then `catch (std::invalid_argument& e)` prints `Denominator cannot be zero`.

## Try it: noexcept, constructors and the family

```quiz
[
  {
    "q": "`double square_root(double x) noexcept` throws anyway, inside a `try` in main whose handler is `catch (...)`. What happens?",
    "options": ["the program ends through std::terminate; the catch (...) never runs", "the catch (...) handler runs because it catches everything", "the compiler rejects the throw statement", "the exception is silently ignored and square_root returns 0"],
    "answer": 0,
    "explain": "The slide's second benefit of `noexcept`: \"if an exception is somehow thrown despite the qualification, the program ends\". The exception may not leave the function, so no outer handler is ever searched. g++ compiles it with a warning (\"'throw' will always call 'terminate'\")."
  },
  {
    "q": "Destructors are implicitly declared `noexcept`.",
    "type": "tf",
    "answer": true,
    "explain": "The slide's rule, with its two consequences: \"NEVER throw an exception from a destructor\", and if you do, it is treated as a run-time error and execution ends."
  },
  {
    "q": "What does this print?",
    "code": "class Mob {\npublic:\n    Mob(int id) {\n        cout << \"build \" << id << '\\n';\n        if (id == 0) throw invalid_argument(\"bad id\");\n    }\n    ~Mob() { cout << \"destroy\\n\"; }\n};\nint main() {\n    try {\n        Mob slime(7);\n        Mob ghost(0);\n        cout << \"both built\\n\";\n    }\n    catch (invalid_argument& e) { cout << e.what() << '\\n'; }\n}",
    "options": ["build 7\nbuild 0\ndestroy\nbad id", "build 7\nbuild 0\ndestroy\ndestroy\nbad id", "build 7\nbuild 0\nbad id\ndestroy", "build 7\nbuild 0\nbad id"],
    "answer": 0,
    "explain": "1. `Mob slime(7);` prints `build 7` and finishes: one object exists.\n2. `Mob ghost(0);` prints `build 0`, then throws before its constructor finishes, so `ghost` never exists and its destructor never runs.\n3. Leaving the `try` block unwinds it: `slime` is destroyed, `destroy` (one line only).\n4. Only then does the handler run: `bad id`. `both built` never prints."
  },
  {
    "q": "On the slide, which two exception types are listed under `runtime_error` in `<stdexcept>`?",
    "options": ["range_error and overflow_error", "invalid_argument and out_of_range", "length_error and invalid_argument", "bad_alloc and bad_cast"],
    "answer": 0,
    "explain": "Slide 27: `logic_error` has `invalid_argument`, `length_error`, `out_of_range`; `runtime_error` has `range_error`, `overflow_error`. `bad_alloc` and `bad_cast` derive straight from `std::exception` (slide 26). Q21's Fraction constructor throws `invalid_argument`, a logic error."
  },
  {
    "q": "What is `what()` in `std::exception`?",
    "options": ["a virtual member function returning a null-terminated `const char*` message", "a static function returning the exception's type name", "a data member holding a `std::string`", "a non-virtual function, so a derived class cannot change its message"],
    "answer": 0,
    "explain": "Slide 25: a virtual member function called `what` that returns a null-terminated char sequence. Because it is virtual, overriding it in a derived class (`const char* what() const noexcept override`) changes the message seen through an `exception&`."
  }
]
```

## Remember

- A throw leaves frames newest first, and every local in a frame it leaves is destroyed on the way out.
- The first matching handler wins, so write the child type first and `catch (...)` last.
- *On the sheet:* Sheet side 2, band 4 "True/false and multiple choice traps", Exceptions.
