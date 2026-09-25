---
title: std::vector
minutes: 10
---

A C-style array has a size fixed at compile time. `std::vector`, from `<vector>`, is an array that grows as you add to it: **think Java's `ArrayList`**.

## What a vector is

From the slides:

- It lives in `<vector>`.
- It is a **sequence container that can change size** (like Java's `ArrayList`).
- It is part of the **STL** (Standard Template Library), covered in a few weeks; it is useful now without knowing its iterators.

The element type goes in angle brackets: `vector<int>`, `vector<string>`.

## The member functions you need

| Member function | What it does |
|---|---|
| `push_back(const T& value)` | appends the given value to the end |
| `size()` | returns the number of elements in the vector |
| `operator[](size_type pos)` | returns a reference to the element at `pos` (no bounds check) |
| `at(size_type pos)` | returns a reference to the element at `pos`; differs from `[ ]` by **doing a bounds check and throwing an exception** |
| `erase(iterator pos)` | removes the element at the iterator position |
| `clear()` | removes all elements |

The widget runs each operation and shows `size()` and what `at` does with a bad index compared with `[ ]`:

```widget
vector-viz
{ "values": [5, 10, 15] }
```

## The slide program: push_back, erase, two loops

```cpp run pin vector.cpp
// predict: Write the output of the two loops.
#include <iostream>
#include <vector>
using namespace std;

int main()
{
    vector <int> intVector;
    intVector.push_back(5);
    intVector.push_back(10);
    intVector.push_back(15);
    intVector.erase(intVector.begin()+1); //erases 10 at index 1

    //classic for loop
    for (size_t i = 0; i < intVector.size(); i++)
    {
        cout << intVector[i] << " ";
    }
    cout << endl;

    //for each loop
    for (int value: intVector)
    {
        cout << value << " ";
    }
    cout << endl;
    return 0;
}
```

- `vector <int> intVector;` declares an empty vector; the three `push_back` calls make it `[5, 10, 15]` with `size()` 3.
- `intVector.erase(intVector.begin()+1); //erases 10 at index 1` takes an **iterator**, not an index: `begin()` points at the first element and `+1` moves to the second. Everything after shifts left: `[5, 15]`.
- `for (int value: intVector)` is the **ranged-for** (C++'s for-each). Each pass copies the next element into `value`: the **element itself, not the index**, so the loop prints `5 15`, not `0 1`.

Both loops print `5 15`.

:::warn size() is unsigned
The slide writes `for(int i=0; i<intVector.size(); i++)`. That compiles, but `size()` returns an unsigned `size_t`, and comparing it with a signed `int` warns under `-Wall` ("comparison of integer expressions of different signedness"); the program above uses `size_t i`. On a quiz either spelling is a correct loop.
:::

## `at` versus `[ ]`

`at` does a bounds check and throws an exception; `[ ]` does not check at all.

```cpp run pin atVsBrackets.cpp
// predict: Write all four lines printed.
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;

int main()
{
    vector<int> v;
    v.push_back(5);
    v.push_back(15);
    cout << v[1] << " " << v.at(1) << endl;   // both fine: 15 15
    v.at(0) = 7;                              // at returns a reference, so this assigns
    cout << v[0] << endl;
    try {
        cout << v.at(5) << endl;              // index 5 in a vector of size 2
    } catch (const out_of_range& e) {
        cout << "at(5) threw out_of_range" << endl;
    }
    cout << "size is still " << v.size() << endl;
    return 0;
}
```

For a valid index the two are interchangeable, and `v.at(0) = 7;` shows that `at` returns a reference you can assign through. With two elements, `cout << v.at(5) << endl;` is past the end, so `at` throws `std::out_of_range` and the `catch` prints the message. `v[5]` would throw nothing: **undefined behaviour**, reading memory that is not the vector's. Prefer `at` while learning; use `[ ]` in loops whose bounds you have already checked.

## size versus capacity

In the video the instructor adds `capacity()` to show what happens as a vector grows:

```cpp run pin capacity.cpp
// predict: Write the five "size capacity" lines.
#include <iostream>
#include <vector>
using namespace std;

int main()
{
    vector<int> v;
    v.push_back(5);
    cout << v.size() << " " << v.capacity() << endl;
    v.push_back(5);
    v.push_back(5);
    cout << v.size() << " " << v.capacity() << endl;
    v.push_back(5);
    cout << v.size() << " " << v.capacity() << endl;
    v.push_back(5);
    cout << v.size() << " " << v.capacity() << endl;
    v.clear();
    cout << v.size() << " " << v.capacity() << endl;
    for (int value : v)
    {
        cout << value << " ";          // runs zero times: the vector is empty
    }
    return 0;
}
```

- After one `push_back`, `cout << v.size() << " " << v.capacity() << endl;` prints `1 1`.
- Two more pushes: `3 4`. Size is how many elements are in the vector; capacity is how much memory is allocated behind it.
- A fourth push fills the allocation: `4 4`.
- The fifth does not fit, so the vector allocates a bigger block and copies the elements over: `5 8`. With g++ the capacity doubles: 1, 2, 4, 8, 16, ...
- `v.clear();` removes the elements but keeps the storage: `0 8`. The ranged-for runs zero times.

You never manage this yourself, but it explains why `push_back` is occasionally slower (a reallocation) and why `capacity()` is at least `size()`.

```quiz
[
  {
    "q": "A `std::vector` is best described as...",
    "options": ["a fixed-size array with bounds checking", "a sequence container that can change size, like Java's ArrayList", "a linked list", "a hash map from index to value"],
    "answer": 1,
    "explain": "The slide's own words: a sequence container that can change size (think Java ArrayList), declared in <vector> and part of the STL."
  },
  {
    "q": "Which member function appends a value to the end of a vector?",
    "options": ["`add(value)`", "`append(value)`", "`push_back(value)`", "`insert(value)`"],
    "answer": 2,
    "explain": "push_back(const T& value) appends the given value to the end. add/append are Java/Python names."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v;\nv.push_back(5);\nv.push_back(10);\nv.push_back(15);\nv.erase(v.begin()+1);\nfor (int value : v) cout << value << \" \";",
    "options": ["5 10 15", "5 15", "0 1", "10 15"],
    "answer": 1,
    "explain": "erase(begin()+1) removes the element at index 1 (the 10); the ranged-for then prints the remaining elements 5 and 15, not their indices."
  },
  {
    "q": "In `for (int value : intVector)`, `value` is...",
    "options": ["the index of the current element", "a copy of the current element's value", "an iterator", "the size of the vector"],
    "answer": 1,
    "explain": "The ranged-for (C++'s for-each) walks the elements themselves, from beginning to end, copying each into value."
  },
  {
    "q": "`erase` takes an index, e.g. `intVector.erase(1)`.",
    "type": "tf",
    "answer": false,
    "explain": "erase takes an iterator position: intVector.erase(intVector.begin()+1). Passing a plain int does not compile."
  },
  {
    "q": "What is the difference between `v[i]` and `v.at(i)`?",
    "options": ["`at` is faster", "`at` does a bounds check and throws an exception for a bad index; `[ ]` does not check", "`[ ]` returns a copy, `at` returns a reference", "there is no difference"],
    "answer": 1,
    "explain": "Both return a reference to the element at pos; at differs by doing a bounds check and throwing std::out_of_range. A bad index with [ ] is undefined behaviour."
  },
  {
    "q": "`v.size()` returns the number of elements; `v.capacity()` returns...",
    "options": ["the same number", "the maximum size a vector can ever have", "how many elements the currently allocated storage can hold before the vector must reallocate", "the number of bytes used"],
    "answer": 2,
    "explain": "Capacity is the allocated room. In the video, 3 elements sat in a capacity of 4, and the 5th push doubled the capacity to 8."
  },
  {
    "q": "After `v.clear();` on a vector that held 8 elements, `v.size()` is...",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "clear() removes all elements, so size() is 0 (the capacity is typically kept)."
  },
  {
    "q": "Which of these are true about `std::vector`? (select all)",
    "options": ["it is declared in `<vector>`", "it is part of the STL", "you must know how to use iterators before you can use it at all", "the element type is written in angle brackets, e.g. `vector<int>`"],
    "answer": [0, 1, 3],
    "explain": "The slide says it is very useful even without knowing its iterators; the STL and iterators are covered in a few weeks."
  },
  {
    "type": "fill",
    "q": "Fill in the blank so the loop prints every element using the classic index loop.",
    "code": "for (size_t i = 0; i < intVector.___; i++)\n{\n    cout << intVector[i];\n}",
    "answer": ["size()", "size ()"],
    "explain": "size() returns the number of elements, so i runs from 0 to size()-1."
  }
]
```
