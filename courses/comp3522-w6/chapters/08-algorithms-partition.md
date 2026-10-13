---
title: STL algorithms and std::partition
minutes: 25
---

An STL algorithm is a free function that works on any range you hand it as two iterators, so one piece of code serves every container. `std::partition` is the deck's worked example.

## An algorithm works on [first, last) and never resizes

The instructor's framing: "I cannot possibly do justice to what you will learn in your algorithms course", so the goal is to recognize the patterns in parameters and behaviour. Slide wording for the STL algorithm: *used on an array or an STL container*; *a function that can be used on a range of elements*; *always in the range [first, last)*; *does not change the size of the container*; *used with iterators or pointers*. The reference is www.cplusplus.com/reference/algorithm.

Two of those are quiz traps. The range is half-open, so `last` is never visited. And no algorithm can grow or shrink a container, because it holds iterators, not the container: even `remove_if` only moves elements and leaves the size unchanged (the erase step is the container's job and beyond these slides).

## The nine families and the two headers

| Family | Examples on the slide |
|---|---|
| 1. sequential, non-modifying | `find()`, `for_each()` |
| 2. sequential, modifying | `copy()`, `remove_if()` |
| 3. partitioning | `partition()`, `is_partitioned()` |
| 4. sorting | `sort()`, `is_sorted()` |
| 5. binary search | `binary_search()` |
| 6. merge | `merge()`, `inplace_merge()` |
| 7. heap | `make_heap()`, `push_heap()` |
| 8. min/max | `min()`, `max()` |
| 9. generalized numeric operations | `accumulate()` and friends |

Where they live: 1. `<algorithm>` (most of them); 2. `<numeric>` (a few generalized numeric operations). `for_each` is filed under non-modifying because the algorithm itself does not change the sequence, even though the function you pass may.

## std::partition: all the true elements first

Slide wording from `<algorithm>`: *reorders the elements in [first, last). The elements for which a predicate p is true all precede elements for which the predicate p returns false.* The instructor's translation: sorts the elements using a function; the function evaluates each element and returns true or false; all the "true" elements come before the "false" elements.

Three facts from the next slide:

- *Relative ordering of the elements is not maintained.* The odd numbers end up first, not necessarily in their original order (`stable_partition` is the variant that keeps it).
- Three parameters: 1. an iterator or pointer to the first element in the range; 2. an iterator or pointer to one past the final element; 3. a pointer to a function that accepts a single parameter of the type being iterated over and returns a boolean (a unary predicate).
- *Returns an iterator pointing to the first element in the second group (the "false" group), or the end of the container if there are no members of this group.*

```cpp run pin partitionOdd.cpp
// predict: Write the two lines printed. Which number does iterBound point at?
// partition algorithm example
#include <iostream>     // std::cout
#include <algorithm>    // std::partition
#include <vector>       // std::vector

bool IsOdd (int i)
{
    return (i%2)==1;
}

using namespace std;
int main () {
    vector<int> myvector;

    // set some values:
    for (int i=1; i<11; ++i) myvector.push_back(i); // 1 2 3 4 5 6 7 8 9 10

    vector<int>::iterator iterBound;
    iterBound = partition (myvector.begin(), myvector.end(), IsOdd); //call partition algorithm

    // print out content:
    cout << "odd elements:";
    for (auto it=myvector.begin(); it!=iterBound; ++it)
        cout << ' ' << *it;
    cout << '\n';

    cout << "even elements:";
    for (auto it=iterBound; it!=myvector.end(); ++it)
        cout << ' ' << *it;
    cout << '\n';

    return 0;
}
```

`IsOdd` is the predicate: one parameter of the element type, returns bool. The returned `iterBound` is the boundary: the first print loop stops at it and the second starts at it.

## A possible implementation, traced on {1,2,3,4,5}

The slide shows cppreference's possible implementation:

```cpp
template<class ForwardIt, class UnaryPredicate>
ForwardIt partition(ForwardIt first, ForwardIt last, UnaryPredicate p)
{
    first = std::find_if_not(first, last, p); //find first false
    if (first == last) return first;
    for (ForwardIt i = std::next(first); i != last; ++i)
    {
        if (p(*i)) {
            std::iter_swap(i, first);
            ++first;
        }
    }
    return first;
}
```

`first` always marks the first false element found so far; `i` scans ahead looking for true elements to swap back into that slot.

### first and i moving across {1,2,3,4,5}

```widget
partition-stepper
{ "values": [1, 2, 3, 4, 5], "pred": "odd", "predict": true }
```

Each step is one value of `i`: a true element is swapped into `first`'s slot and `first` moves on; a false one is skipped. Watch what happens to the 2, which starts first among the evens.

The swap is what breaks relative order. The function needs only a `ForwardIt`, so the same code partitions a `list`, whose iterators cannot do `+ n`; `std::next` and `++` are enough.

```cpp run pin partitionTrace.cpp
// predict: Write the three lines before "std::partition 1..10", then the answers to the two == questions.
// The slide's "possible implementation" of partition traced on {1,2,3,4,5} and run on {1..10}.
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

bool IsOdd(int i) { return (i % 2) == 1; }

template<class ForwardIt, class UnaryPredicate>
ForwardIt my_partition(ForwardIt first, ForwardIt last, UnaryPredicate p, const vector<int>& v) {
    first = find_if_not(first, last, p);          // find first false
    if (first == last) return first;
    for (ForwardIt i = next(first); i != last; ++i) {
        if (p(*i)) {
            iter_swap(i, first);
            ++first;
            cout << "  after swap:"; for (int x : v) cout << ' ' << x; cout << "  first -> " << *first << endl;
        }
    }
    return first;
}

int main() {
    vector<int> v = {1, 2, 3, 4, 5};
    auto bound = my_partition(v.begin(), v.end(), IsOdd, v);
    cout << "result:"; for (int x : v) cout << ' ' << x; cout << "  bound -> " << *bound << endl;

    vector<int> w; for (int i = 1; i < 11; ++i) w.push_back(i);
    auto b2 = std::partition(w.begin(), w.end(), IsOdd);
    cout << "std::partition 1..10:"; for (int x : w) cout << ' ' << x; cout << "  bound -> " << *b2
         << "  is_partitioned " << boolalpha << is_partitioned(w.begin(), w.end(), IsOdd) << endl;

    vector<int> z = {2, 4, 6};
    auto b3 = std::partition(z.begin(), z.end(), IsOdd);
    cout << "no odd numbers: bound == begin? " << (b3 == z.begin()) << endl;

    vector<int> o = {1, 3, 5};
    auto b4 = std::partition(o.begin(), o.end(), IsOdd);
    cout << "no even numbers: bound == end? " << (b4 == o.end()) << endl;

    vector<int> ss = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    stable_partition(ss.begin(), ss.end(), IsOdd);
    cout << "stable_partition keeps order:"; for (int x : ss) cout << ' ' << x; cout << endl;
    return 0;
}
```

`my_partition` is the slide's code with one print after each `iter_swap(i, first);`. The last four lines run the library versions: `std::partition`, the two edge cases of the return value, and `stable_partition`.

```challenge
{ "prompt": "Partition <code>v = {3, 8, 1, 9, 5, 6, 2, 7}</code> so the values greater than 5 come first, using a named predicate function <code>GreaterThanFive</code>. Print the true group after <code>greater than 5:</code> and the false group after <code>the rest:</code>, one space before each value, then <code>size still 8</code>. The expected order is what g++'s <code>std::partition</code> produces.", "starter": "#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\n// TODO: the unary predicate\n\nint main() {\n    vector<int> v = {3, 8, 1, 9, 5, 6, 2, 7};\n    // TODO: partition and keep the returned bound\n\n    cout << \"greater than 5:\";\n    // TODO: print [begin, bound)\n    cout << '\\n';\n\n    cout << \"the rest:\";\n    // TODO: print [bound, end)\n    cout << '\\n';\n\n    cout << \"size still \" << v.size() << '\\n';\n    return 0;\n}\n", "expected": "greater than 5: 7 8 6 9\nthe rest: 5 1 2 3\nsize still 8", "hints": ["The predicate takes one <code>int</code> and returns <code>i &gt; 5</code>.", "<code>vector&lt;int&gt;::iterator bound = partition(v.begin(), v.end(), GreaterThanFive);</code>", "First loop: <code>for (auto it = v.begin(); it != bound; ++it)</code>; second loop starts at <code>bound</code> and stops at <code>v.end()</code>."], "solution": "#include <iostream>\n#include <algorithm>\n#include <vector>\nusing namespace std;\n\nbool GreaterThanFive(int i)\n{\n    return i > 5;\n}\n\nint main() {\n    vector<int> v = {3, 8, 1, 9, 5, 6, 2, 7};\n    vector<int>::iterator bound = partition(v.begin(), v.end(), GreaterThanFive);\n\n    cout << \"greater than 5:\";\n    for (auto it = v.begin(); it != bound; ++it)\n        cout << ' ' << *it;\n    cout << '\\n';\n\n    cout << \"the rest:\";\n    for (auto it = bound; it != v.end(); ++it)\n        cout << ' ' << *it;\n    cout << '\\n';\n\n    cout << \"size still \" << v.size() << '\\n';\n    return 0;\n}\n" }
```

```quiz
[
  {
    "q": "What does `std::partition(first, last, p)` return?",
    "options": ["An iterator to the last true element", "The number of true elements", "An iterator to the first element of the false group, or `end` if there is no false group", "A new vector"],
    "answer": 2,
    "explain": "The returned iterator is the boundary between the groups. In partitionOdd it points at 6; with no false elements it equals end(); with no true elements it equals begin()."
  },
  {
    "q": "True or false: `std::partition` keeps the relative order of the elements within each group.",
    "type": "tf",
    "answer": false,
    "explain": "The slide: relative ordering is not maintained. 1..10 becomes 1 9 3 7 5 6 4 8 2 10. stable_partition is the variant that keeps order (1 3 5 7 9 2 4 6 8 10)."
  },
  {
    "q": "After `partition` with `IsOdd` on `{1,2,3,4,5}` using the slide's implementation, the vector is...",
    "options": ["`{1,3,5,2,4}`", "`{1,3,5,4,2}`", "`{1,2,3,4,5}`", "`{5,3,1,2,4}`"],
    "answer": 1,
    "explain": "find_if_not puts first at 2; 3 swaps with 2 giving {1,3,2,4,5}; 4 is skipped; 5 swaps with 2 giving {1,3,5,4,2}; first ends on 4."
  },
  {
    "q": "Which statements about an STL algorithm are on the slide? (select all)",
    "options": ["It always works in the range [first, last)", "It does not change the size of the container", "It is used with iterators or pointers", "It can only be used on vectors"],
    "answer": [0, 1, 2],
    "explain": "Algorithms see a range, not a container, so they work on arrays and any container with suitable iterators and can never resize anything."
  },
  {
    "q": "Which family does `for_each()` belong to on the slide?",
    "options": ["sequential, modifying", "sequential, non-modifying", "partitioning", "generalized numeric operations"],
    "answer": 1,
    "explain": "for_each is listed with find() as non-modifying: the algorithm itself does not reorder or overwrite the sequence, whatever the function it calls may do."
  },
  {
    "q": "In the slide's implementation, what is the first statement of `partition`?",
    "type": "fill",
    "code": "first = std::___(first, last, p); //find first false",
    "answer": "find_if_not",
    "explain": "find_if_not returns the first element for which p is false; everything before it is already in the true group, so the swapping loop starts from there."
  },
  {
    "q": "Which header holds `partition`, `sort` and `find`, and which holds `accumulate`?",
    "options": ["`<algorithm>` and `<numeric>`", "`<numeric>` and `<algorithm>`", "`<vector>` and `<cmath>`", "`<iterator>` and `<functional>`"],
    "answer": 0,
    "explain": "Most algorithms are in <algorithm>; a few generalized numeric operations are in <numeric>."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v = {2, 4, 6};\nauto b = partition(v.begin(), v.end(), IsOdd);   // IsOdd: i % 2 == 1\ncout << (b == v.begin()) << (b == v.end());",
    "options": ["10", "01", "00", "11"],
    "answer": 0,
    "explain": "No element is odd, so the false group is the whole range and its first element is begin(). The bound equals begin(), not end()."
  },
  {
    "q": "The third argument of `partition` must be...",
    "options": ["a comparison taking two elements and returning bool", "an integer count", "the container", "a function taking one element of the iterated type and returning bool"],
    "answer": 3,
    "explain": "A unary predicate: one parameter of the element type, returning true or false. A two-argument comparison is what sort and set use, not partition."
  }
]
```
