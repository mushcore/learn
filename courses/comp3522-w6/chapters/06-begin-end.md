---
title: Iterators: begin, end and one past the last
minutes: 15
---

Every loop over an STL container, and every algorithm call, is written in terms of two iterators: where to start and where to stop. The second one is the surprise: `end()` points to nothing.

## An iterator is an object that points at an element

Slide wording: an iterator *is an object*, *points to some element in a range of elements*, *can iterate (loop) through the range*, and *has operators like increment (`++`) and dereference (`*`)*. It behaves like a pointer into the container, whatever the container is: a vector's iterator walks an array, a list's iterator follows links, and the loop you write looks the same for both.

That sameness is why iterators matter. They let you *iterate through containers generically*, and they are *extensively used when calling STL algorithms*: every algorithm has the shape `some_algorithm(iterBegin, iterEnd, func)`. The container is never passed; the pair of iterators describes the range.

## end() is one past the last element

The slide draws `vector<int> intVec = {9};` with both `itBegin` and `itEnd` pointing at the 9 and asks: "That doesn't look right..." It is not right. Slide wording: `end()` *returns an iterator pointing to a theoretical one element past the last element in the range of values*. `itEnd` *does not point to an element*, so *don't dereference end*.

With `{9, 10, 11}` the only change is that `end()` sits one past the 11, so there are three passes. With `{}` (empty) `begin()` and `end()` are the same position, `itBegin == itEnd` holds before the first test, and the body never runs. This is the half-open range `[begin, end)` from the STL overview: the first position is included, the one-past position is not. Dereferencing `end()` is undefined behaviour, not an exception: the program may print garbage or crash rather than tell you.

### The loop test, pass by pass

```widget
iter-walk
{ "values": [9], "predict": true }
```

Each pass starts with the test `itBegin != itEnd`; the pass that finds them equal leaves without running the body, so a vector of n elements takes n + 1 tests.

## The three walks in one program

```cpp run pin beginEnd.cpp
// predict: Write every line printed, including the three "passes:" lines.
#include <iostream>
#include <vector>
using namespace std;

int walk(vector<int> intVec)
{
    vector<int>::iterator itBegin = intVec.begin();
    vector<int>::iterator itEnd = intVec.end();
    int passes = 0;
    for (itBegin; itBegin != itEnd; itBegin++)
    {
        cout << *itBegin << endl;
        ++passes;
    }
    return passes;
}

int main()
{
    cout << "passes: " << walk({9}) << endl;
    cout << "passes: " << walk({9, 10, 11}) << endl;
    cout << "passes: " << walk({}) << endl;
    return 0;
}
```

`iterator` is the typedef every container provides. The first clause of `for (itBegin; itBegin != itEnd; itBegin++)` is copied from the slide: `itBegin` on its own is a legal expression that does nothing (g++ warns "statement has no effect"), because the iterator was initialized on the line above. The test is `!=`, never `<`: `<` exists only for random access iterators, `!=` for every kind.

The order of the output follows the C++17 rule for `E1 << E2`: the left operand is evaluated first. So `cout << "passes: "` has already printed before `walk` runs and prints the elements, and the returned count comes after them on the same chain. Before C++17 the order was unspecified.

```quiz
[
  {
    "q": "Per the slide, what does `end()` return?",
    "options": ["An iterator to the last element", "An iterator pointing to a theoretical one element past the last element", "A null iterator", "The size of the container"],
    "answer": 1,
    "explain": "end() is one past the last element. It marks where the range stops and does not point to an element, which is why the loop test is itBegin != itEnd."
  },
  {
    "q": "`vector<int> v = {9}; auto it = v.end(); cout << *it;` What happens?",
    "options": ["Prints 9", "Prints 0", "Undefined behaviour: end() does not point to an element", "Throws std::out_of_range"],
    "answer": 2,
    "explain": "Dereferencing end() reads past the last element. The STL performs almost no checking, so nothing throws; the result is undefined."
  },
  {
    "q": "How many times does the body run for `vector<int> v = {};` with `for (auto it = v.begin(); it != v.end(); ++it)`?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "For an empty container begin() == end() immediately, so the test it != v.end() is false before the first pass."
  },
  {
    "q": "Which four facts does the slide list for an iterator? (select all)",
    "options": ["It is an object", "It points to some element in a range of elements", "It can iterate (loop) through the range", "It has operators like increment (++) and dereference (*)", "It stores a copy of the whole container"],
    "answer": [0, 1, 2, 3],
    "explain": "An iterator is a small object that refers to one element and knows how to move; it never owns or copies the container."
  },
  {
    "q": "What is the general shape of an STL algorithm call, per the slide?",
    "options": ["`some_algorithm(container, func)`", "`some_algorithm(iterBegin, iterEnd, func)`", "`container.some_algorithm(func)`", "`some_algorithm(iterBegin, size, func)`"],
    "answer": 1,
    "explain": "Algorithms take a range as two iterators plus whatever function they need. The container itself is never passed, so the same algorithm works on a vector, a list or a plain array."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v = {9, 10, 11};\nint passes = 0;\nfor (auto it = v.begin(); it != v.end(); it++) {\n    cout << *it << ' ';\n    ++passes;\n}\ncout << passes;",
    "options": ["9 10 11 3", "9 10 11 2", "9 10 3", "10 11 2"],
    "answer": 0,
    "explain": "begin() is at 9 and end() is one past 11, so the body runs for 9, 10 and 11: three passes."
  },
  {
    "q": "True or false: `for (itBegin; itBegin != itEnd; itBegin++)` is a compile error because the first clause is not an assignment.",
    "type": "tf",
    "answer": false,
    "explain": "The first clause of a for is any expression or declaration, including the lone name itBegin, which does nothing. g++ only warns that the statement has no effect."
  },
  {
    "q": "Why is the loop test written `it != v.end()` rather than `it < v.end()`?",
    "options": ["`<` is slower", "`!=` is supported by every iterator kind; `<` exists only for random access iterators", "`<` compares the elements, not the positions", "There is no difference"],
    "answer": 1,
    "explain": "A list or map iterator has no operator<. Writing != works for every container, so it is the habit the slides use everywhere."
  }
]
```
