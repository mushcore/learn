---
title: typedefs: the restaurant analogy and the standard container typedefs
minutes: 20
---

`vector<int>::iterator` and `map<string, int>::iterator` are different types with the same name, and that is on purpose. The mechanism is `typedef`, and the reason is that generic code needs one name for the same idea in every container.

## typedef creates an alias

*The typedef keyword creates an alias that can be used anywhere instead of a (possibly) complex type name.* `typedef int int_t;` declares `int_t` to be an alias for the type `int`, so `int_t myT;` is an `int`. The alias can even be an array type: `typedef int arr_t[3];` makes `arr_t` an array of 3 `int`, and `arr_t myArr;` gives three slots, `myArr[0] = 999;`.

The payoff is slide 39's pair of map iterators. Without an alias the declaration is `pair <map<string, string>::iterator, map<string, string>::iterator> pairMapIters;`. With `typedef map<string, string>::iterator mapIterator;` it becomes `pair <mapIterator, mapIterator> pairMapIters;`: `mapIterator` is a new type name, an alias for `map<string, string>::iterator`.

```cpp run pin typedefs.cpp
// predict: Write every line printed (ten lines).
#include <iostream>
#include <vector>
#include <iterator>
#include <deque>

using namespace std;

// declares int_t to be an alias for the type int
typedef int int_t;

// arr_t is array of 3 int
typedef int arr_t[3];

// reference is a reference to an int
typedef int& reference;
typedef int* pointer;

// struct Foo and Foo are the same thing
struct Foo
{
   int x;
};

typedef struct Foo Foo; //this is what we did in C, unnecessary in C++

void printFoo(Foo foo) {
    cout << "Foo x val: "<< foo.x << endl;
}

int main() {
    int_t intT = 99;
    reference intRef = intT;
    pointer intPtr = &intT;
    arr_t arrT = {0,1,2}; //int arr_T[3];

    cout << "change int_t through int_ref reference: " << endl;
    cout << intT << endl;
    intRef++;
    cout << intT << endl;

    //structs
    Foo f;
    f.x = 99;
    printFoo(f);

    cout << "vector contents: " << endl;
    vector<int> myVec = {1,2,3,4,5};
    vector<int>::iterator myIter = myVec.begin(); //gets random access iterator
    for (myIter; myIter != myVec.end(); myIter++) {
        cout << *myIter << endl;
    }

    return 0;
}
```

`typedef int& reference;` and `typedef int* pointer;` alias a reference and a pointer type, the names the containers use. `reference intRef = intT;` is an `int&` bound to `intT`, so `intRef++;` changes `intT` from 99 to 100. `typedef struct Foo Foo;` is what C needed to drop the `struct` keyword; in C++ `Foo` is already a type name and the line is unnecessary. `vector<int>::iterator myIter = myVec.begin();` gets a random access iterator; the loop prints the five elements one per line. `intPtr` and `arrT` are never used, which g++ warns about.

## The restaurant analogy

Three restaurants each have their own kind of menu:

| Restaurant | Its menu type | "Can I get an LCDMenu?" | After `typedef ... menu` | "Can I get a menu?" |
|---|---|---|---|---|
| Fast Food | LCDMenu | OK! | `typedef LCDMenu menu` | OK! |
| Fancy Restaurant | PaperMenu | What's an LCDMenu? | `typedef PaperMenu menu` | OK! |
| Food Truck | BoardMenu | What's an LCDMenu? | `typedef BoardMenu menu` | OK! |

"Can I get a menu?" fails at first ("What's a menu?"): no restaurant has a type by that name, and asking for an LCDMenu only works at Fast Food. The fix is for every restaurant to implement its own typedef, *so that "menu" is a common name/alias for their internal implementation of menu*. Now the same question works everywhere.

The STL does exactly this (the slide marks it pseudocode):

| Container | Its iterator type | Its typedef | What `::iterator` gives you |
|---|---|---|---|
| Vector | RandomAccessIterator | `typedef RandomAccessIterator iterator` | `vector<int>::iterator myIter;` gets a RandomAccessIterator |
| Map | BiDirectionalIterator | `typedef BiDirectionalIterator iterator` | `map<string, int>::iterator myIter;` gets a BiDirectionalIterator |
| Set | BiDirectionalIterator | `typedef BiDirectionalIterator iterator` | `set<int>::iterator` gets a BiDirectionalIterator |

"Can I get an iterator?" works on every container; what comes back differs (lesson 07). Switch the grid from `vector` to `map` and `it + 3` stops compiling, because a BiDirectionalIterator has no `+`:

```widget
iterator-ops
{ "container": "vector", "expr": "it + 3" }
```

## The standard container typedefs

STL containers have standard typedefs. *This makes it possible to write generic functions that work on containers. If we create a container, we should implement these standard typedefs.*

| typedef | What it names |
|---|---|
| `size_type` | an unsigned integer type for sizes and indexes |
| `value_type` | the element type (for a map, the key/value pair) |
| `iterator` | an iterator of the default type for the container |
| `pointer` | pointer to an element |
| `reference` and `const_reference` | reference to an element, read-write or read-only |
| `difference_type` | the signed type of the distance between two iterators |

The reason is consistency: the same name for the same conceptual entity across different container classes. `vector<int>::iterator` gives a random access iterator for a vector of integers; `list<string>::iterator` gives a bidirectional iterator for a list of strings.

## size_type is unsigned

`size_type` is an **unsigned integer type**, sufficiently large to hold the size of any object of that class. It appears in all first-class containers and in the container adaptors. The slides contrast two loops:

```cpp
for (int i = 0; i < vec.size(); ++i) { }                      // int vs unsigned: -Wsign-compare warning
for (vector<int>::size_type i = 0; i < vec.size(); ++i) { }   // the container's own type: clean
```

`vec.size()` returns a `size_type`, so the counter should be one too.

## iterator, const_iterator, reverse_iterator

`iterator` is an iterator of the default type for a first-class container: `vector<int>::iterator vecIter = myVec.begin();`. `const_iterator` prevents modification to elements during iteration. `reverse_iterator` iterates backwards starting from the last element with `rbegin()`; incrementing moves the iterator towards the beginning of the container. `const_reverse_iterator` is a const reverse iterator.

```cpp run pin reverse.cpp
// predict: Write the three lines printed.
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> myVec = {1, 2, 3, 4, 5};

    for (vector<int>::const_iterator it = myVec.begin(); it != myVec.end(); ++it)
        cout << *it << ' ';                          // const_iterator: read only
    cout << endl;

    for (vector<int>::reverse_iterator rit = myVec.rbegin(); rit != myVec.rend(); ++rit)
        cout << *rit << ' ';                         // starts at the last element; ++ moves toward the beginning
    cout << endl;

    vector<int>::iterator vecIter = myVec.begin();
    *vecIter = 10;                                   // iterator: may write
    vector<int>::const_reverse_iterator crit = myVec.rbegin();
    cout << "front " << myVec.front() << " last " << *crit << endl;
    return 0;
}
```

`vector<int>::reverse_iterator rit = myVec.rbegin();` starts at the 5 and `++rit` moves left, so the second line is `5 4 3 2 1`; `rend()` is the reverse one-past-the-end, before the 1. `*vecIter = 10;` is allowed through a plain `iterator` and changes the front to 10. A `const_reverse_iterator` from `rbegin()` still points at the last element, 5.

The read-only pin shows what `const_iterator` forbids:

```cpp pin constIter.cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> myVec = {1, 2, 3};
    vector<int>::const_iterator it = myVec.begin();
    *it = 0;      // error: the element is read-only through a const_iterator
    ++it;         // fine: the iterator itself is not const
    cout << *it << endl;
    return 0;
}
```

g++ rejects `*it = 0;` with "assignment of read-only location". The const applies to the **element**, not to the iterator: `++it;` still moves it.

```quiz
[
  {
    "q": "What does `typedef int arr_t[3];` declare?",
    "options": ["an alias `arr_t` for the type 'array of 3 int'", "an array named `arr_t` of three ints", "a pointer to three ints", "nothing: typedef cannot alias arrays"],
    "answer": 0,
    "explain": "typedef creates a type alias, not a variable. arr_t myArr; then declares a real array of three ints."
  },
  {
    "q": "`typedef struct Foo Foo;` in C++ is...",
    "options": ["required before `Foo f;` compiles", "an error: a typedef cannot repeat a name", "what makes `printFoo(Foo)` work", "a C habit; in C++ `Foo` is already a type name so the line is unnecessary"],
    "answer": 3,
    "explain": "C needed the typedef to drop the struct keyword; C++ does not. The sample keeps the line only to make that point."
  },
  {
    "q": "In the restaurant analogy, what does `typedef LCDMenu menu` inside Fast Food correspond to in the STL?",
    "options": ["`#include <vector>`", "`using namespace std;`", "`typedef RandomAccessIterator iterator` inside vector, so `vector<int>::iterator` is a common name for its own iterator type", "a virtual function `menu()`"],
    "answer": 2,
    "explain": "Each container aliases its own iterator type as iterator, so 'Can I get an iterator?' works on every container even though vector hands back a RandomAccessIterator and map a BiDirectionalIterator."
  },
  {
    "q": "`map<string, int>::iterator myIter;` gives you which kind of iterator?",
    "options": ["BiDirectionalIterator", "RandomAccessIterator", "ForwardIterator", "InputIterator"],
    "answer": 0,
    "explain": "Map and Set typedef a BiDirectionalIterator as iterator; Vector typedefs a RandomAccessIterator."
  },
  {
    "q": "Which of these are standard container typedefs named on the slide? (select all)",
    "options": ["`size_type`", "`value_type`", "`iterator`", "`length_type`", "`difference_type`"],
    "answer": [0, 1, 2, 4],
    "explain": "size_type, value_type, iterator, pointer, reference and const_reference, difference_type. There is no length_type."
  },
  {
    "q": "`size_type` is...",
    "options": ["a signed int", "always `long`", "only defined for vector", "an unsigned integer type sufficiently large to hold the size of any object of that class"],
    "answer": 3,
    "explain": "Unsigned, and present in all first-class containers and the adaptors. Comparing it with an int counter gives the -Wsign-compare warning; use vector<int>::size_type i."
  },
  {
    "q": "Why do the STL containers all use the same typedef names?",
    "options": ["consistency: the same name for the same conceptual entity across containers, so generic functions can work on any of them", "to save memory", "because the compiler requires it", "so that all iterators are the same type"],
    "answer": 0,
    "explain": "vector<int>::iterator and list<string>::iterator are different types with the same role; code written against the name works for both. The slide: if we create a container, we should implement these standard typedefs."
  },
  {
    "q": "What does this print?",
    "code": "vector<int> v = {1, 2, 3};\nfor (vector<int>::reverse_iterator r = v.rbegin(); r != v.rend(); ++r)\n    cout << *r;",
    "options": ["123", "321", "32", "nothing: ++ on a reverse_iterator does not compile"],
    "answer": 1,
    "explain": "rbegin() starts at the last element and incrementing moves toward the beginning, so the elements print in reverse."
  },
  {
    "q": "A `const_iterator` prevents the iterator itself from being incremented.",
    "type": "tf",
    "answer": false,
    "explain": "It prevents modification of the elements during iteration: *it = 0 is an error, ++it is fine."
  },
  {
    "type": "fill",
    "q": "Complete the alias so the pair declaration below it compiles.",
    "code": "typedef map<string, string>::___ mapIterator;\npair<mapIterator, mapIterator> pairMapIters = phonebook.equal_range(\"Sam\");",
    "answer": ["iterator"],
    "explain": "map<string, string>::iterator is the container's iterator typedef; the alias mapIterator shortens the pair type returned by equal_range."
  }
]
```
