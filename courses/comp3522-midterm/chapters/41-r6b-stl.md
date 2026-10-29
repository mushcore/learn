---
title: "Extra 11: the STL: containers, map insert versus square brackets, iterators and sort"
minutes: 25
---
This lesson teaches the standard library's boxes of values and the markers that walk through them. It prepares the what-prints and true-or-false questions on loops, maps and sorting.

## What a container and an iterator are, in plain words

A container is one object that holds many values of the same type. A list of quest levels, or a bag of item counts, each live in one container.

An iterator is a marker that points at one element of a container. You can read the element it points at, then move the marker on to the next one.

Every container gives two markers. The begin marker points at the first element, and the end marker points one place past the last.

The end marker points at nothing real, so it is never read. A loop stops when its marker reaches the end.

```diagram
{ "type": "grid", "title": "A vector of three levels", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "[0]", "row": 0, "col": 1 },
  { "id": "h2", "label": "[1]", "row": 0, "col": 2 },
  { "id": "h3", "label": "[2]", "row": 0, "col": 3 },
  { "id": "h4", "label": "past the end", "row": 0, "col": 4 },
  { "id": "v0", "label": "value", "row": 1, "col": 0 },
  { "id": "v1", "label": "10", "row": 1, "col": 1 },
  { "id": "v2", "label": "30", "row": 1, "col": 2 },
  { "id": "v3", "label": "70", "row": 1, "col": 3 },
  { "id": "v4", "label": "nothing", "row": 1, "col": 4 },
  { "id": "m0", "label": "marker", "row": 2, "col": 0 },
  { "id": "m1", "label": "begin()", "row": 2, "col": 1 },
  { "id": "m4", "label": "end()", "row": 2, "col": 4 }
], "hi": ["m4"], "caption": "begin() points at the first element and end() one past the last, so a range is [begin, end): the end is never read." }
```

## A tiny program you can run in your head

The word `auto` lets the compiler work out a variable's type from its first value. The ranged for, `for (auto x : v)`, visits every element of `v` in turn.

```cpp run pin levels.cpp
// predict: Write the four printed lines. Which loop changes the vector?
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> levels = {10, 30, 70};
    for (auto lv : levels) {
        lv = 0;
    }
    cout << levels[0] << '\n';
    for (auto& lv : levels) {
        lv += 1;
    }
    cout << levels[0] << ' ' << levels[2] << '\n';
    auto it = levels.begin();
    cout << *it << ' ' << *(it + 2) << '\n';
    cout << levels.end() - levels.begin() << '\n';
    return 0;
}
```

1. `for (auto lv : levels)` gives `lv` a copy of each element, so `lv = 0;` changes only copies: `10`.
2. `for (auto& lv : levels)` makes `lv` a reference, a second name for the real element. `lv += 1;` changes the vector: `11 71`.
3. `auto it = levels.begin();` points at the first element. `*it` reads it, and `*(it + 2)` jumps two places: `11 71`.
4. `levels.end() - levels.begin()` counts the steps from begin to end, the size: `3`.

The copy loop left the vector alone, and the reference loop changed it.

## The rule, in the slide's words

- `auto` "requires initializer": `auto a;` is an error.
- `for (auto s : v)` copies each element. `for (auto& s : v)` names the real one.
- `end()` is "one past the end of the container". "Don't dereference end", and an empty container has `begin() == end()`.

The containers the questions use, one sentence each:

| Container | What it is |
|---|---|
| `vector` | a growing array, any element reachable at once by index |
| `list` | a doubly linked list, walked one step at a time |
| `set` | sorted keys, each key at most once |
| `map` | sorted unique keys, each with a value, stored as a `pair` |
| `stack`, `queue` | last in first out, first in first out |
| `priority_queue` | `top()` is always the largest element |

## Try it: loops and containers

```quiz
[
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

## A map, in plain words

A map is a sorted table of keys, each with one value. A bag of items maps the item name to how many you hold.

There are two ways to put a value in, and they behave differently. Asking politely with `insert` adds the key only if it is not there yet.

Writing `bag[key] = value` always stores the value, overwriting the old one. Reading `bag[key]` for a missing key quietly creates that key with a zero value.

The slide's words: `insert` "fails if an element with the same key is already in the map". It returns a pair whose second part is `true` when the key was added and `false` when it was refused.

## Iterator kinds and sort, in plain words

Not every marker can move the same way. A list marker can only step forward or back one element, while a vector marker can jump any distance at once.

The slide: "only random-access iterators permit an integer value to be added to or subtracted from an iterator". So `it + n` works on a vector and fails on a list.

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

`*it++` reads the element first and then moves the marker, the slide's "value_type x = *i; ++i; return x;".

`sort(first, last)` puts a range in order. It jumps around inside the range, so it needs random-access markers, and a list has its own `lst.sort()` instead.

`sort` compares with `operator<`. A third argument, a comparator, replaces it: it returns true when its first argument should come first.

`partition` moves the elements that pass a test to the front, but the slide says the "relative ordering of the elements is not maintained". `stable_partition` makes the same split and keeps the order inside each group.

## The worked program: a bag and a route

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

1. `bag.insert(make_pair("potion", 5))` adds the key, so `first.second` is `true`. The second `insert` finds `"potion"` already there and is refused, so the value stays 5. `cout` prints a `bool` as a digit: `1 0 5`.
2. `bag["potion"] = 9;` overwrites, and `bag["scroll"];` creates `scroll` with 0. A map visits keys in sorted order: `potion=9 scroll=0 `, trailing space included.
3. `sort(route.begin(), route.end());` uses the `operator<` on `level`, giving island, job leg, 2nd-job leg. `for (auto s : route)` changes copies only: `island 1`.
4. `for (auto& s : route)` changes the real elements: `2 11 31`.

```widget
map-insert
{ "preset": "map.cpp" }
```

## Try it: maps, iterators and sort

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
  }
]
```

## Remember

- A ranged for copies each element unless the loop variable is a reference.
- `insert` refuses a key that is already there, `[]` overwrites, and reading `[]` on a missing key creates it.
- *On the sheet:* Sheet side 2, band 4 "True/false and multiple choice traps", STL.
