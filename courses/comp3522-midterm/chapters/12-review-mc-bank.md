---
title: "Review 6: the multiple-choice and true-or-false bank for Weeks 1, 5, 6 and 7"
minutes: 35
---
:::quiz What the paper asks and what earns the marks
The Midterm Info slide lists "multiple choice and true/false" as the first question shape. The practice paper prints none, so their number and marks are unknown. The statements come from slide wording: a sentence that is almost the slide's rule is the trap. Weeks 1, 5, 6 and 7 are covered here because the practice paper's written questions barely touch them, so this is where they appear. Each item below tests one rule.
:::

**Understand before the exam (cannot be looked up):**

- How a thrown exception travels: it leaves each frame without a matching handler, and that frame's locals are destroyed on the way out, newest first.
- Handler matching is first match from the top, so a parent handler above a child handler steals the child.
- `map::insert` with an existing key does nothing, while `m[key] = v` overwrites, and `m[key]` alone creates the key.
- A ranged for copies each element unless the loop variable is a reference.
- One static data member is shared by every object of the class and exists before any object does.
- The right-left rule as a procedure: name, go right, go left, step out, repeat.

**On the sheet (look up, do not memorise):**

- The four `<stdexcept>` names the paper uses (`logic_error`, `invalid_argument`, `out_of_range`, `runtime_error`), the catch order and the `noexcept` rules: *Sheet side 2, "G. Exceptions"*.
- Iterator kinds per container and the `sort` comparator form: *Sheet side 2, "H. STL"*.
- The three static data member forms (plain, `const static`, `constexpr static`) and the elision cases (RVO, NRVO, a by-value parameter): *Sheet side 2, "I. Static, copy elision"*.
- The six slide declarations with their readings: *Sheet side 1, "D. Right-left rule"*.
- `iomanip` manipulators and the `cin` recovery lines: *Sheet side 2, "J. Week 1 syntax"*.

Do if time is short: Week 7 (the right-left questions are the deck's own) and Week 5. Week 6 and Week 1 are "if time".

## Week 5: exceptions

A `throw` creates an exception object and leaves the current block at once. C++ looks for the nearest enclosing `try` whose handlers match the thrown type. Every frame it leaves on the way is unwound: its local objects are destroyed in reverse order of construction. A frame with no matching handler is passed straight through. If no handler anywhere matches, `std::terminate` is called and the program ends. Whether the locals are destroyed first is left to the compiler; g++ does not destroy them.

The slide's six guidelines, in its words: "Catch exceptions by reference"; "the first catch-block with a matching type is executed"; "Further catch-blocks of the same type or child-types are ignored", so the child type goes first; "A catch-block with an ellipsis ... catches all exceptions", and "Obviously this should be the last one"; print a message and terminate; or rethrow with a bare `throw;`. Catch by value and the handler gets a sliced copy: `catch (exception e)` holds only the `std::exception` part, so `e.what()` runs the base version, not the derived class's message.

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
3. `travel(0);` enters travel: `Step t("travel");` prints `travel start`.
4. `throw MapNotFound("10002003");` leaves travel. travel has no handler, so its local is destroyed on the way out: `travel end`. `arrived` never prints.
5. walk's `catch (MapNotFound& e)` matches: `walk caught: no map 10002003`. The message comes from `what()`, which `runtime_error` stores from the constructor argument.
6. `throw;` rethrows the same object. walk is left, so `w` is destroyed: `walk end`.
7. main's `catch (exception& e)` matches, because `MapNotFound` is a `runtime_error`, which is an `exception`: `main caught: no map 10002003`.
8. The `try` is finished, so main carries on: `parked`.
9. main ends and `r` is destroyed: `route end`.

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

The rest of the week in one pass:

- `noexcept` promises no exception leaves the function. If one does, "the program ends": `std::terminate`, and an outer `catch` never runs.
- Destructors are implicitly `noexcept`, so never throw from a destructor.
- A constructor that throws creates no object, so its destructor never runs. Members and objects built before it are still destroyed.
- `std::exception` has a virtual `what()` returning `const char*`. `<stdexcept>` gives `logic_error` (`invalid_argument`, `length_error`, `out_of_range`) and `runtime_error` (`range_error`, `overflow_error`).

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
  },
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

## Week 6: the STL

The containers to tell apart: `vector` is a dynamic array with random access; `list` is a doubly linked list; `set` keeps sorted, unique keys; `map` keeps sorted, unique keys, each with a value, and its `value_type` is a `pair`. The adaptors restrict a container: `stack` (LIFO), `queue` (FIFO), and `priority_queue`, whose `top()` is the largest element.

`auto` deduces the type from the initializer, so `auto x;` is an error. In a ranged for, `for (auto s : v)` copies each element; `for (auto& s : v)` names the real one.

`end()` is "one past the end of the container": never dereference it. Ranges are half-open, `[first, last)`.

```diagram
{ "type": "grid", "title": "Iterator kind per container", "nodes": [
  { "id": "h0", "label": "kind", "row": 0, "col": 0 },
  { "id": "h1", "label": "where", "row": 0, "col": 1 },
  { "id": "h2", "label": "adds", "row": 0, "col": 2 },
  { "id": "a0", "label": "input", "row": 1, "col": 0 },
  { "id": "a1", "label": "istream_iterator", "row": 1, "col": 1 },
  { "id": "a2", "label": "read, ++, one pass", "row": 1, "col": 2 },
  { "id": "b0", "label": "output", "row": 2, "col": 0 },
  { "id": "b1", "label": "ostream_iterator", "row": 2, "col": 1 },
  { "id": "b2", "label": "write, ++, one pass", "row": 2, "col": 2 },
  { "id": "c0", "label": "forward", "row": 3, "col": 0 },
  { "id": "c1", "label": "forward_list", "row": 3, "col": 1 },
  { "id": "c2", "label": "read, write, many passes", "row": 3, "col": 2 },
  { "id": "d0", "label": "bidirectional", "row": 4, "col": 0 },
  { "id": "d1", "label": "list, map, set", "row": 4, "col": 1 },
  { "id": "d2", "label": "-- as well", "row": 4, "col": 2 },
  { "id": "e0", "label": "random access", "row": 5, "col": 0 },
  { "id": "e1", "label": "vector, deque, array", "row": 5, "col": 1 },
  { "id": "e2", "label": "it + n, it1 - it2, <", "row": 5, "col": 2 }
], "hi": ["e2"], "caption": "Each row can do everything the row above it can. Only random access allows it + n, so std::sort, which needs it, works on a vector but not on a list." }
```

`sort(first, last)` uses `operator<`, or a comparator passed as a third argument that returns true when its first argument should come first. `partition` puts the elements where the predicate is true first but does not keep their relative order; `stable_partition` does.

```cpp run pin r6_bag.cpp
// predict: Write the four printed lines. Watch which insert is refused, what [] does, and whether each ranged for changes the vector.
#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

struct Step {
    string leg;
    int level;
};

bool operator<(const Step& a, const Step& b) {
    return a.level < b.level;
}

int main() {
    map<string, int> bag;
    auto first = bag.insert(make_pair("potion", 5));
    auto second = bag.insert(make_pair("potion", 9));
    cout << first.second << ' ' << second.second << ' ' << bag["potion"] << '\n';

    bag["potion"] = 9;
    bag["scroll"];
    for (const auto& p : bag) {
        cout << p.first << '=' << p.second << ' ';
    }
    cout << '\n';

    vector<Step> route = {{"job leg", 10}, {"island", 1}, {"2nd-job leg", 30}};
    sort(route.begin(), route.end());
    for (auto s : route) {
        s.level = 99;
    }
    cout << route[0].leg << ' ' << route[0].level << '\n';
    for (auto& s : route) {
        s.level += 1;
    }
    cout << route[0].level << ' ' << route[1].level << ' ' << route[2].level << '\n';
    return 0;
}
```

1. `bag.insert(make_pair("potion", 5))` adds the key, so the returned pair's `.second` is `true`; the second `insert` finds `"potion"` already there and is refused (`false`). The value stays 5. `cout` prints a `bool` as a digit: `1 0 5`.
2. `bag["potion"] = 9;` overwrites. `bag["scroll"];` creates `scroll` with the default `int`, 0. A `map` iterates in key order: `potion=9 scroll=0 ` (the trailing space is printed too).
3. `sort(route.begin(), route.end());` uses the `operator<` on `level`: island 1, job leg 10, 2nd-job leg 30. `for (auto s : route)` changes copies only, so the first element is unchanged: `island 1`.
4. `for (auto& s : route)` changes the real elements: `2 11 31`.

```widget
map-insert
{ "preset": "map.cpp" }
```

```quiz
[
  {
    "q": "What does this print?",
    "code": "int main() {\n    map<string, int> bag;\n    bag.insert(make_pair(\"arrow\", 100));\n    bag.insert(make_pair(\"arrow\", 50));\n    bag[\"potion\"] = 3;\n    bag[\"potion\"] = 8;\n    cout << bag[\"arrow\"] << ' ' << bag[\"potion\"] << '\\n';\n    cout << bag.count(\"scroll\") << ' ';\n    cout << bag[\"scroll\"] << ' ';\n    cout << bag.size() << '\\n';\n}",
    "options": ["100 8\n0 0 3", "50 8\n0 0 3", "100 3\n0 0 2", "100 8\n0 0 2"],
    "answer": 0,
    "explain": "1. The second `insert` of `\"arrow\"` is refused (slide 29: it \"fails if an element with the same key is already in the map\"), so arrow stays 100.\n2. `[]` assigns and overwrites: potion is 8. Line one: `100 8`.\n3. `count(\"scroll\")` only looks: 0.\n4. `bag[\"scroll\"]` creates the key with value 0 and prints 0.\n5. Now there are three keys: `3`."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    vector<int> levels = {1, 10, 30};\n    for (int lv : levels) lv = lv * 2;\n    for (int& lv : levels) lv = lv + 1;\n    for (const auto& lv : levels) cout << lv << ' ';\n}",
    "options": ["2 11 31", "3 21 61", "2 20 60", "1 10 30"],
    "answer": 0,
    "explain": "1. `int lv` is a copy of each element, so doubling it changes nothing in the vector.\n2. `int& lv` is the element itself, so each one gains 1: 2, 11, 31.\n3. `const auto&` reads without copying and prints `2 11 31 `."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    priority_queue<int> legs;\n    legs.push(10);\n    legs.push(1);\n    legs.push(30);\n    cout << legs.top() << ' ';\n    legs.pop();\n    cout << legs.top() << ' ' << legs.size();\n}",
    "options": ["30 10 2", "10 1 2", "1 10 2", "30 1 2"],
    "answer": 0,
    "explain": "1. A `priority_queue` keeps the largest element on top (a max-heap by default, over a vector).\n2. `top()` is 30.\n3. `pop()` removes 30; the next largest, 10, is on top.\n4. Two elements remain: `30 10 2`. Insertion order does not matter."
  },
  {
    "q": "What does this print?",
    "code": "struct Step { string leg; int level; };\nbool higherFirst(const Step& a, const Step& b) { return a.level > b.level; }\nint main() {\n    vector<Step> route = {{\"island\", 1}, {\"2nd-job leg\", 30}, {\"job leg\", 10}};\n    sort(route.begin(), route.end(), higherFirst);\n    for (const Step& s : route) cout << s.level << ' ';\n}",
    "options": ["30 10 1", "1 10 30", "1 30 10", "a compile error: Step has no operator<"],
    "answer": 0,
    "explain": "1. With a third argument, `sort` asks the comparator, not `operator<`, so `Step` needs no `operator<`.\n2. `higherFirst(a, b)` is true when `a` should come before `b`: the higher level first.\n3. Result: `30 10 1 `."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    vector<int> ids = {313, 7, 10002003};\n    auto it = ids.begin();\n    cout << *it++ << ' ';\n    cout << *it << ' ';\n    cout << *(it + 1);\n}",
    "options": ["313 7 10002003", "7 7 10002003", "313 313 7", "a compile error: it + 1 needs a random-access iterator"],
    "answer": 0,
    "explain": "1. `*it++` is \"value_type x = *i; ++i; return x;\" (slide 68): it prints 313, then moves `it` to 7.\n2. `*it` is now 7.\n3. A vector's iterator is random access, so `it + 1` is legal and points at 10002003."
  },
  {
    "q": "What does this print?",
    "code": "bool isOdd(int n) { return n % 2 == 1; }\nint main() {\n    vector<int> v = {1, 2, 3, 4, 5, 6};\n    stable_partition(v.begin(), v.end(), isOdd);\n    for (int n : v) cout << n << ' ';\n}",
    "options": ["1 3 5 2 4 6", "1 5 3 4 2 6", "2 4 6 1 3 5", "1 2 3 4 5 6"],
    "answer": 0,
    "explain": "1. The true group (odd) comes first, the false group (even) after.\n2. `stable_partition` keeps the original order inside each group: 1 3 5, then 2 4 6.\n3. Plain `partition` makes the same split but, as slide 86 says, the \"relative ordering of the elements is not maintained\" (the slide's 1 to 10 run gives 1 9 3 7 5 6 4 8 2 10)."
  },
  {
    "q": "Which containers give an iterator that allows `it + 3`? (select all)",
    "options": ["vector", "deque", "list", "map", "set"],
    "answer": [0, 1],
    "explain": "Slide 77: \"only random-access iterators permit an integer value to be added to or subtracted from an iterator\". `vector` and `deque` (and `array`) are random access. `list`, `map` and `set` are bidirectional: `++` and `--` only."
  },
  {
    "q": "`sort(lst.begin(), lst.end());` where `lst` is a `list<int>`:",
    "options": ["does not compile: sort needs random-access iterators and a list's are bidirectional", "sorts the list in ascending order", "sorts the list in descending order", "compiles but throws at run time"],
    "answer": 0,
    "explain": "`std::sort` jumps around with `it + n` and `it1 - it2`, which only random access allows. A list has its own member `lst.sort()` instead."
  },
  {
    "q": "`v.end()` returns an iterator to the last element of `v`.",
    "type": "tf",
    "answer": false,
    "explain": "It points one past the last element (slide 19). \"Don't dereference end\": the loop `it != v.end()` stops exactly when `it` reaches it. For an empty container `begin() == end()`."
  },
  {
    "q": "`auto level;` compiles, and the type is fixed by the first value assigned later.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 5: `auto a; //ERROR, auto requires initializer`. The type is deduced from the initializer in the same declaration, so `auto level = 30;` is an `int`."
  }
]
```

## Week 7: static, copy elision, the right-left rule

**Static data members.** A static data member has "only one copy per class", shared by every object, and it exists even when no object does. The `static` keyword goes on the declaration inside the class, and a plain static is defined outside: `int X::n = 0;`. Two exceptions: a `const static` integral member may be initialized inside, and a `constexpr static` member must be.

**Static member functions.** A static function has no `this` pointer. The slide: it "can only access static data and invoke static member functions", and it "cannot be virtual or const". You call it as `X::f()` or through an object.

**When the copy constructor runs** (slide 23): a direct copy (`MyClass c1 = c;`), passing by value, and returning by value. The slide adds that copy elision "may be used by some compilers" to remove the return copy.

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
2. `Mob slime = spawn("Slime");` runs one constructor: `spawn Slime`. `return Mob(n);` returns a temporary of the same type, so it is built straight into `slime`. No copy line.
3. `Mob::count()` is called on the class: `alive 1`.
4. `fight(slime);` copies the argument into the by-value parameter `m`: `copy Slime`.
5. Inside, `m.count()` calls the static function through an object: `fight, alive 2`.
6. `fight` returns and `m` is destroyed: `gone Slime`.
7. Back in main: `alive 1`.
8. main ends and `slime` is destroyed: `gone Slime`.

The slide calls elision "a compiler optimization", and "there's no guarantee that all compilers use RVO and NRVO". Since C++17, step 2's case (a returned temporary of the same type) is guaranteed. Only a returned named local (NRVO) is optional, and a returned parameter is never elided. Quiz items key to the slide's wording; what-prints items key to the real output.

```widget
elision-trace
{ "case": "rvo" }
```

**The right-left rule** reads any declaration in five steps, in the slide's words:

1. "Start from variable name".
2. "Keep going right. Read what we see until we see right parentheses )".
3. "Then go left ... Read what we see until we see left parentheses (".
4. "Exit parentheses and go right ... until right parentheses or semicolon".
5. "Go left of where we exited bracket ... until left parentheses or finish", and "Repeat steps as needed".

Words for the tokens: `*` is "pointer to", `[]` is "array of", `()` is "function returning", `&` is "reference to".

Tiny case: `int (**ppf)();`. Start at `ppf`. Right is `)`, so go left: `*` "a pointer to", `*` "a pointer to". Step out of the parentheses and go right: `()` "a function". Go left: `int` "returning an int". Together: "ppf is a pointer to a pointer to a function returning an int".

```widget
rl-rule-step
{ "decl": "int (**ppf)();" }
```

The deck asks the six slide-35 declarations as four-option questions. They are below with the slide's own options. Two of them, `paa` and `paf`, do not compile: an array's element type must be complete, and C++ has no arrays of functions. They are still reading exercises.

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
  },
  {
    "q": "Slide 36: `int ***ppp;`",
    "options": ["Ppp is an int pointer to a pointer to a pointer", "Ppp is a pointer to a pointer to an int pointer", "Ppp is a pointer an int pointer to a pointer", "Ppp is a pointer to a pointer to a pointer returning an int"],
    "answer": 1,
    "explain": "1. Start at `ppp`; nothing on the right.\n2. Go left: `*` a pointer to, `*` a pointer to, `*` with `int`: an int pointer.\n3. The slide reads the last star and `int` together: \"a pointer to a pointer to an int pointer\". Nothing here is a function, so \"returning\" is wrong."
  },
  {
    "q": "Slide 37: `int (**ppa)[];`",
    "options": ["Ppa is an array of pointer to a pointer returning ints", "Ppa is an int pointer to a pointer to an array", "Ppa is an array of pointers to int pointers", "Ppa is a pointer to a pointer to an array of ints"],
    "answer": 3,
    "explain": "1. Start at `ppa`; right is `)`, so go left: `*` a pointer to, `*` a pointer to.\n2. Exit the parentheses, go right: `[]` an array.\n3. Go left: `int`, of ints. The parentheses make `ppa` the pointer; without them, `int **ppa[]` would be an array."
  },
  {
    "q": "Slide 38: `int (**ppf)();`",
    "options": ["Ppf is a pointer to a pointer to a function returning an int", "Ppf is a pointer to a function returning integer pointers", "Ppf is a function pointing to an integer pointer", "Ppf is a int pointer to a pointer to a function"],
    "answer": 0,
    "explain": "1. Start at `ppf`; right is `)`, so go left: two `*`, a pointer to a pointer.\n2. Exit, go right: `()` a function.\n3. Go left: `int`, returning an int."
  },
  {
    "q": "Slide 39: `int *(*pap)[];`",
    "options": ["Pap is a pointer to an integer to a pointer to an array", "Pap is an integer array of pointers to pointers", "Pap is an array of pointers to pointers to ints", "Pap is a pointer to an array of int pointers"],
    "answer": 3,
    "explain": "1. Start at `pap`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array.\n3. Go left: `*` and `int`, of int pointers. The star outside the parentheses belongs to the element type."
  },
  {
    "q": "Slide 40: `int (*paa)[][];`",
    "options": ["Paa is an array of arrays to pointers to ints", "Paa is a pointer to an array of arrays of ints", "Paa is an integer pointer to an array of arrays", "Paa is an array of pointers to an array of ints"],
    "answer": 1,
    "explain": "1. Start at `paa`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array, `[]` of arrays.\n3. Go left: `int`, of ints. The reading is the keyed answer, but the line does not compile: only the first array bound may be left out (g++: \"multidimensional array must have bounds for all dimensions except the first\")."
  },
  {
    "q": "Slide 41: `int (*paf)[]();`",
    "options": ["Paf is a function to an array of int pointers", "Paf is a int pointer to an array of functions", "Paf is a pointer to an int array of functions", "Paf is a pointer to an array of functions returning an int"],
    "answer": 3,
    "explain": "1. Start at `paf`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array, then `()` of functions.\n3. Go left: `int`, returning an int. As with `paa`, it is a reading exercise only: C++ has no arrays of functions (g++: \"declaration of 'paf' as array of functions\")."
  }
]
```

## Week 1: syntax the multiple choice loves

**Initialization.** `int x = 0;`, `int x(0);` and `int x{0};` all make an int. Braces forbid narrowing: `int y = 3.7;` and `int y(3.7);` silently truncate to 3, but `int y{3.7};` is a compile error.

**Arithmetic.** `int / int` truncates toward zero: `7 / 2` is 3. `%` takes the sign of the left operand: `-7 % 2` is -1. `x++` gives the old value, then adds one; `++x` adds first.

**Constants.** `const` cannot change after it is initialized, but the value may come at run time (`const int c = input;`). `constexpr` "must be assigned a value by compile time".

**Output.** `setw(n)` sets the width of the next field only. `fixed` with `setprecision(2)` prints exactly two decimals, and both stay set.

**Input.** `while (cin >> n)` stops at the first input that is not a number, and the failbit stays set until `cin.clear()`. The bad text is still waiting, so `cin.ignore(numeric_limits<streamsize>::max(), '\n')` throws the line away. The slide's input table says a failed read into an `int` leaves it with "No change"; since C++11 g++ stores 0 in it.

```cpp run pin r6_week1.cpp
// stdin: 12 x 30\n40
// predict: Input is "12 x 30" then "40" on the next line. Write every line printed.
#include <iostream>
#include <iomanip>
#include <limits>
using namespace std;

int main() {
    int level = 7;
    cout << level / 2 << ' ' << level % 2 << ' ' << -level % 2 << '\n';

    int a = level++;
    int b = ++level;
    cout << a << ' ' << b << ' ' << level << '\n';

    cout << '|' << setw(5) << 42 << '|' << 42 << "|\n";
    double share = 2.0 / 3;
    cout << fixed << setprecision(2) << share << ' ' << 5.0 << '\n';

    int n;
    while (cin >> n) {
        cout << "read " << n << '\n';
    }
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cin >> n;
    cout << "after recovery " << n << '\n';
    return 0;
}
```

1. `level / 2` truncates to 3, `level % 2` is 1, and `-level % 2` keeps the left operand's sign: `3 1 -1`.
2. `int a = level++;` stores 7, then `level` becomes 8. `int b = ++level;` makes it 9 first and stores 9: `7 9 9`.
3. `setw(5)` pads only the first 42 to five characters; the second 42 is printed at its natural width: `|   42|42|`.
4. `2.0 / 3` is a double division. `fixed << setprecision(2)` rounds it to `0.67`, and stays on for `5.0`: `0.67 5.00`.
5. `while (cin >> n)` reads 12 (`read 12`), then fails on `x` and the loop ends. 30 is never read.
6. `cin.clear();` resets the failbit, and the `ignore` call drops the rest of the line, `x 30`. `cin >> n;` reads 40 from the next line: `after recovery 40`.

**`::` versus `.`.** `::` reaches into a namespace or a class (`std::cout`, `Mob::count()`); `.` reaches into an object (`slime.count()`), and `->` into an object through a pointer.

```quiz
[
  {
    "q": "Which declaration does NOT compile?",
    "options": ["`int y{3.7};`", "`int y = 3.7;`", "`int y(3.7);`", "`double y{3};`"],
    "answer": 0,
    "explain": "Slide 54: uniform initialization \"prohibits implicit narrowing conversion\". 3.7 to int loses the fraction, so the braces reject it. The `=` and `( )` forms compile and truncate to 3. `int` to `double` with the constant 3 is not narrowing, so `double y{3};` is fine."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    cout << 7 / 2 << ' ' << -7 % 3 << ' ' << 7 % -3 << ' ' << 7.0 / 2;\n}",
    "options": ["3 -1 1 3.5", "3.5 -1 1 3.5", "3 2 -2 3.5", "4 -1 1 3.5"],
    "answer": 0,
    "explain": "1. `7 / 2`: both ints, truncated toward zero: 3.\n2. `-7 % 3`: the result takes the sign of the left operand: -1.\n3. `7 % -3`: left operand positive, so 1.\n4. `7.0 / 2`: one double makes it a double division: 3.5."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    int x = 5;\n    int a = x++;\n    int b = ++x;\n    cout << a << ' ' << b << ' ' << x;\n}",
    "options": ["5 7 7", "6 7 7", "5 6 7", "6 6 7"],
    "answer": 0,
    "explain": "1. `x++` yields the old value 5 for `a`, then `x` becomes 6.\n2. `++x` makes `x` 7 first and yields 7 for `b`.\n3. `x` is 7: `5 7 7`."
  },
  {
    "q": "`const int c = input;` compiles when `input` was read with `cin`, but `constexpr int c = input;` does not.",
    "type": "tf",
    "answer": true,
    "explain": "A `const` \"can be assigned a value after compile time\" and never changes afterwards. A `constexpr` \"must be assigned a value by compile time\", and a value typed at run time is not known then."
  },
  {
    "q": "What does this print?",
    "code": "int main() {\n    cout << setw(4) << 30 << 2 << '|' << '\\n';\n    cout << fixed << setprecision(2) << 3.14159 << ' ' << 30.0;\n}",
    "options": ["  302|\n3.14 30.00", "  30   2|\n3.14 30.00", "  302|\n3.14 30", "302|\n3.1 30"],
    "answer": 0,
    "explain": "1. `setw(4)` pads only the next field: `30` becomes two spaces then 30.\n2. The `2` gets no width and follows at once: `  302|`.\n3. `fixed` with `setprecision(2)` means two digits after the point, and both stay set for later values: `3.14 30.00`."
  },
  {
    "q": "The stream reads the text `hello` into an int. What does this print?",
    "code": "int main() {\n    istringstream in(\"hello\");\n    int n = 7;\n    in >> n;\n    cout << n << ' ' << in.fail();\n}",
    "options": ["0 1", "7 1", "7 0", "0 0"],
    "answer": 0,
    "explain": "1. `hello` is not a number, so the extraction fails and sets the failbit: `fail()` is 1.\n2. Since C++11 a failed numeric extraction stores 0, so `n` is 0. (The slide's table says \"No change\" for `hello`; what g++ prints is 0.)\n3. Every later `>>` on this stream fails until `clear()` is called."
  },
  {
    "q": "`while (cin >> n)` has just ended on the input `x`. Which two calls, in this order, let the next `cin >> n` read the following line?",
    "options": ["`cin.clear();` then `cin.ignore(numeric_limits<streamsize>::max(), '\\n');`", "`cin.ignore(numeric_limits<streamsize>::max(), '\\n');` then `cin.clear();`", "`cin.clear();` alone", "`cin.ignore();` alone"],
    "answer": 0,
    "explain": "1. While the failbit is set, every operation on `cin` fails, `ignore` included. So `clear()` comes first (\"Hint: call cin.clear() after an input failure!\").\n2. `clear()` alone leaves `x` in the buffer, and the next `>>` fails on it again.\n3. `ignore(max, '\\n')` then throws away everything up to and including the newline."
  },
  {
    "q": "Which line uses the operators correctly?",
    "options": ["`std::cout << Mob::count() << slime.count();`", "`std.cout << Mob.count();`", "`std::cout << slime::count();`", "`std->cout << Mob::count();`"],
    "answer": 0,
    "explain": "`::` reaches a member of a namespace (`std::cout`) or of a class (`Mob::count()`, a static function). `.` reaches a member of an object (`slime.count()`). A namespace or class name never takes `.` or `->`, and an object never takes `::`."
  }
]
```
