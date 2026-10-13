---
title: The STL: containers, iterators, algorithms, and the vector again
minutes: 18
---

Week 2 used `std::vector` without saying where it came from. It is one piece of the Standard Template Library, and the rules the STL follows (copies in, half-open ranges, no checking) apply to every container you meet this week.

## The STL is containers, iterators and algorithms

The C++ STL is "like the *Java Collections Framework SUPERPOWERED*", and, per the slide, one of the most fun and interesting reasons to work with C++. It is composed of three things:

| Part | Slide wording | Examples |
|---|---|---|
| 1. **Containers** | classes that store objects and data | `vector`, `map`, `set` |
| 2. **Iterators** | used for working on a sequence of values | `v.begin()`, `v.end()` |
| 3. **Algorithms** | functions specially designed to be used on a range of elements | `partition`, `sort`, `find` |

## Value semantics: the container gets a copy

The STL uses *value semantics*: containers get a **copy** of the object we are putting in it. This means our element class must have a **copy constructor**, an **assignment operator** and a **destructor** that work. Week 3's `MyVector` with a `double* data` member shows why: a shallow copy shares the array, and the container's copy and your original would both delete it.

```widget
copy-viz
{ "deep": true }
```

Two more rules from the same slide. The STL performs **almost no checking**: the programmer is responsible for meeting preconditions (`v[5]` on a two-element vector is your problem, not an exception). And the STL uses *half-open ranges [included, not included)*: "Imagine array size 5. array[0,5). When iterating through include 0th index, exclude 5th index."

## Three categories of container

| Category | Slide wording | Members | Search |
|---|---|---|---|
| 1. **Sequence** containers | we specify the order | `array`, `vector`, `deque`, `list`, `forward_list` | walk the sequence |
| 2. **Associative** containers | objects are automatically sorted | `set`, `multiset`, `map`, `multimap` | O(log n) |
| 3. **Unordered associative** containers | stored using hash | `unordered_set`, `unordered_multiset`, `unordered_map`, `unordered_multimap` | O(1) to O(n) worst case |

The picker turns a requirement (keeps insertion order, sorted automatically, key to value, fast at both ends) into the container, its header and its category:

```widget
container-picker
{ "preset": "sorted unique" }
```

## What every container c can do

Suppose we have a container object `c`. The slide lists the operations that look the same on all of them:

```cpp
c.insert(x);            // Inserts a copy of x into an associative container
c.insert(position, x);  // Inserts a copy of x into a sequence container
c.begin();              // Returns an iterator pointing to the first element in the container if it exists
c.end();                // Returns an iterator one past the end of the container
for (auto it = c.begin(); it != c.end(); ++it) { /* process! */ }
```

An associative container decides where `x` goes (it sorts), so `insert` takes only the value. A sequence container needs to be told the `position`. `begin()` and `end()` are the two ends of a half-open range: `end()` is one past the last element, so the loop runs while `it != c.end()` and never dereferences `end()` (lesson 06 draws this).

## The vector again, with iterators

A vector is a dynamic array that offers random access and insertion/deletion.

```cpp run pin ex_vector21.cpp
// predict: Write the six lines printed (the first is 2).
#include <iostream>
#include <vector>
using namespace std;

void print(const vector<int>& v) {
    for (auto it = v.begin(); it != v.end(); ++it) cout << *it << ' ';
    cout << endl;
}

int main() {
    vector<int> v;
    v.push_back(2);
    for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) cout << *it << endl;

    vector<int> v2 {2, 4, 6, 8, 10};
    v2.insert(v2.begin(), 6);      print(v2);  // 6, 2, 4, 6, 8, 10
    v2.insert(v2.begin() + 3, -4); print(v2);  // 6, 2, 4, -4, 6, 8, 10
    v2.erase(v2.begin() + 1);      print(v2);  // 6, 4, -4, 6, 8, 10
    int a[] = { 3, 6, 9, 12, 15 };
    vector<int> v3 {a, a + 5};     print(v3);  // copies the range [first, last)
    cout << "size " << v3.size() << " front " << v3.front() << " back " << v3.back() << endl;
    return 0;
}
```

`for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) cout << *it << endl;` is slide 20's loop: `vector<int>::iterator` is the iterator type the vector provides, and `*it` is the element it points at.

The three edits on `v2` take an iterator, not an index. `v2.insert(v2.begin(), 6);` puts 6 **before** the first element. `v2.insert(v2.begin() + 3, -4);` puts -4 before whatever is at position 3, so the new element lands at index 3, never index 4, and `insert` returns an iterator to it. `v2.erase(v2.begin() + 1);` removes the 2 and shifts everything after it one place left. `vector<int> v3 {a, a + 5};` builds a vector from the range `[a, a + 5)`: five elements.

```widget
vector-viz
{ "values": [2, 4, 6, 8, 10] }
```

The slide asks you to (re-)familiarize yourself with the vector's members: `empty()`, `size()`, `capacity()`, `clear()`, `insert()`, `push_back()` and `pop_back()`, `front()` and `back()`.

## Edit a new vector with iterators and watch value semantics copy a `Box`

Inserts and erases at iterator positions on `{5, 10, 15, 20}`, a vector built from part of an array, and a struct pushed in twice.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 10, 15, 20};\n    v.insert(v.begin() + 2, 99);\n    v.erase(v.begin());\n    v.insert(v.end(), 1);\n    v.pop_back();\n    for (int x : v) cout << x << \" \";\n    cout << \"| \" << v.size() << \" \" << v.front() << \" \" << v.back() << endl;\n    return 0;\n}",
    "options": [
      "`10 99 15 20 | 4 10 20`",
      "`5 10 99 15 20 | 5 5 20`",
      "`10 15 99 20 | 4 10 20`",
      "`10 99 15 20 1 | 5 10 1`"
    ],
    "answer": 0,
    "explain": "insert before index 2: 5 10 99 15 20. erase(begin()) removes the 5: 10 99 15 20. insert(end(), 1) appends: 10 99 15 20 1. pop_back removes the 1. Size 4, front 10, back 20."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a[] = {2, 4, 6, 8, 10, 12};\n    vector<int> v(a + 1, a + 4);\n    for (int x : v) cout << x << \" \";\n    cout << v.size() << endl;\n    return 0;\n}",
    "answer": [
      "4 6 8 3"
    ],
    "explain": "The constructor copies the half-open range [a + 1, a + 4): a[1], a[2], a[3] = 4, 6, 8, and a + 4 (the 10) is excluded. Three elements."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct Box { int n; };\n\nint main() {\n    vector<Box> v;\n    Box b{1};\n    v.push_back(b);\n    b.n = 2;\n    v.push_back(b);\n    v[0].n += 10;\n    cout << b.n << \" \" << v[0].n << \" \" << v[1].n << endl;\n    return 0;\n}",
    "options": [
      "`2 11 2`",
      "`2 12 2`",
      "`2 11 12`",
      "`12 12 12`"
    ],
    "answer": 0,
    "explain": "Value semantics: each push_back stores a copy. The first copy holds 1; changing b to 2 does not touch it; the second copy holds 2. `v[0].n += 10` changes the first copy only: 11. b itself is 2."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <stdexcept>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {1, 2, 3};\n    try {\n        cout << v.at(1) << \" \";\n        cout << v.at(3) << \" \";\n    } catch (out_of_range&) {\n        cout << \"out of range\";\n    }\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`2 out of range`",
      "`2 0`",
      "`out of range`",
      "`2 3`"
    ],
    "answer": 0,
    "explain": "`at(1)` is the second element, 2. `at(3)` is one past the end, and at() is the member that checks: it throws std::out_of_range before anything is printed for it. `v[3]` would not check at all; reading it is undefined behaviour."
  }
]
```

```challenge
{"prompt": "Write <code>insert_sorted</code> with an iterator: advance from <code>v.begin()</code> while the element is not greater than <code>x</code> (and you have not reached <code>v.end()</code>), then call <code>v.insert(it, x)</code>. The vector must stay sorted.", "starter": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// insert x before the first element greater than x (at the end if there is none)\nvoid insert_sorted(vector<int>& v, int x) {\n    // walk an iterator from v.begin(); stop at v.end() or at the first element > x,\n    // then call v.insert(it, x)\n}\n\nint main() {\n    vector<int> v = {3, 5, 9};\n    insert_sorted(v, 7);\n    insert_sorted(v, 1);\n    insert_sorted(v, 12);\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n    return 0;\n}\n", "expected": "1 3 5 7 9 12 ", "hints": ["<code>vector&lt;int&gt;::iterator it = v.begin();</code>", "Test <code>it != v.end()</code> first, then <code>*it &lt;= x</code>: never dereference end().", "<code>insert</code> puts the new value before the iterator's element."], "solution": "#include <iostream>\n#include <vector>\nusing namespace std;\n\n// insert x before the first element greater than x (at the end if there is none)\nvoid insert_sorted(vector<int>& v, int x) {\n    vector<int>::iterator it = v.begin();\n    while (it != v.end() && *it <= x) {\n        ++it;\n    }\n    v.insert(it, x);\n}\n\nint main() {\n    vector<int> v = {3, 5, 9};\n    insert_sorted(v, 7);\n    insert_sorted(v, 1);\n    insert_sorted(v, 12);\n    for (int x : v) cout << x << \" \";\n    cout << endl;\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "The three components of the STL are...",
    "options": ["classes, objects, templates", "vectors, maps, sets", "arrays, pointers, references", "containers, iterators, algorithms"],
    "answer": 3,
    "explain": "Containers store objects and data; iterators work on a sequence of values; algorithms are functions designed for a range of elements."
  },
  {
    "q": "The STL uses value semantics. What does that mean for an object you put into a container?",
    "options": ["The container stores a pointer to your object", "The container stores a copy of your object, so the element class needs a working copy constructor, assignment operator and destructor", "The container takes ownership and deletes your object", "The object must be allocated with new"],
    "answer": 1,
    "explain": "Containers get a copy; a class with a raw pointer member therefore needs the deep copy of Week 3 or the copy and the original share memory."
  },
  {
    "q": "The STL checks every precondition and throws on a bad index.",
    "type": "tf",
    "answer": false,
    "explain": "The slide: STL performs almost no checking; the programmer is responsible for meeting preconditions. Only `at()` checks; `[]` and iterators do not."
  },
  {
    "q": "What does the half-open range array[0,5) include?",
    "options": ["indexes 0 to 5", "indexes 1 to 5", "indexes 0 to 4", "indexes 1 to 4"],
    "answer": 2,
    "explain": "[included, not included): the 0th index is in, the 5th is out. Five elements, like an array of size 5."
  },
  {
    "q": "Which containers are associative (sorted automatically, searched in O(log n))?",
    "options": ["set, multiset, map, multimap", "array, vector, deque, list, forward_list", "unordered_set, unordered_multiset, unordered_map, unordered_multimap", "stack, queue, priority_queue"],
    "answer": 0,
    "explain": "Sequence containers keep the order we specify; unordered associative containers use a hash and search in O(1) to O(n) worst case; the fourth group are adaptors (lesson 03)."
  },
  {
    "q": "`c.insert(x)` with a single argument is the insert of...",
    "options": ["a sequence container, which appends x", "an associative container, which puts the copy of x where the sorting says", "any container", "only a vector"],
    "answer": 1,
    "explain": "An associative container decides the position itself. A sequence container needs c.insert(position, x)."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v2 {2, 4, 6, 8, 10};\nv2.insert(v2.begin() + 3, -4);\nv2.erase(v2.begin() + 1);\nfor (int x : v2) cout << x << ' ';",
    "options": ["2 6 -4 8 10", "2 6 8 -4 10", "2 4 6 -4 8 10", "2 6 -4 10"],
    "answer": 0,
    "explain": "insert before index 3 gives 2 4 6 -4 8 10; erase at index 1 removes the 4 and shifts the rest left: 2 6 -4 8 10."
  },
  {
    "q": "`int a[] = {3, 6, 9, 12, 15}; vector<int> v3 {a, a + 5};` gives v3 how many elements?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "The constructor copies the half-open range [a, a + 5): a[0] through a[4], five elements; a + 5 itself is excluded."
  },
  {
    "q": "`c.end()` returns an iterator pointing to...",
    "options": ["the last element", "the first element", "one past the end of the container", "null"],
    "answer": 2,
    "explain": "end() is the excluded end of the half-open range, so a loop runs while it != c.end() and never dereferences end()."
  },
  {
    "q": "Which of these are true of the STL? (select all)",
    "options": ["It is described as the Java Collections Framework superpowered", "Its ranges are half-open: [first, last)", "It stores references to your objects, never copies", "Unordered associative containers are stored using a hash"],
    "answer": [0, 1, 3],
    "explain": "Value semantics means copies, so 'stores references, never copies' is the false one; the other three are slide wording."
  }
]
```
