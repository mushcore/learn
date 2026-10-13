---
title: set, multiset and strict weak ordering
minutes: 20
---

A `set` keeps its elements sorted and unique, which only works if it can ask "is a less than b?" about your type. That question has to be answered by a comparison with three mathematical properties, or the container misbehaves.

## set: sorted, unique, const once inserted

`std::set`, from `<set>`, is an associative container containing a *sorted set of unique objects of type Key*. The value of an element also identifies it (the element **is** the key). Elements **cannot be edited after being added (are const)**, because changing one could put it out of order. Sorting is performed using the key comparison function; search, insertion and removal are logarithmic; it is typically implemented as a **binary search tree**.

A `multiset` is the same tree with duplicates allowed.

```cpp run pin multiset.cpp
// predict: Write the one line printed.
#include <iostream>
#include <set>
#include <iterator>
#include <map>

using namespace std;
int main()
{
    multiset<int> mymultiset;
    multiset<int>::iterator it;

    // insert some values:
    mymultiset.insert (40);                           // 40
    for (int i=1; i<7; i++)
    {
        mymultiset.insert(i*10);                      // 10 20 30 40 40 50 60
    }

    it=mymultiset.begin();                            // point iterator to beginning
    it++;                                             // increment iterator to point to beginning + 1. point at value 20

    mymultiset.erase (it);                            // 10 30 40 40 50 60

    mymultiset.erase (40);                            // 10 30 50 60  //erased all 40s!

    it=mymultiset.find (50);                          // points it at 50

    mymultiset.erase ( it, mymultiset.end() );        // erases starting at it till end
                                                      // 10 30

    cout << "mymultiset contains:";
    for (it=mymultiset.begin(); it!=mymultiset.end(); ++it)
        cout << ' ' << *it;
    cout << '\n';

    return 0;

}
```

After `mymultiset.insert (40);` and the loop, the multiset holds `10 20 30 40 40 50 60`: the second 40 was kept, and the order is sorted whatever order you insert. Three `erase` overloads follow:

| Call | Removes | Result |
|---|---|---|
| `mymultiset.erase (it);` | the one element the iterator points at (the 20) | 10 30 40 40 50 60 |
| `mymultiset.erase (40);` | **every** element equal to the key | 10 30 50 60 |
| `mymultiset.erase ( it, mymultiset.end() );` | the half-open range [it, end), from the 50 on | 10 30 |

`it=mymultiset.find (50);` returns an iterator to the first 50 (or `end()` if absent); a set's iterators are bidirectional, so `it++` works but `it + 1` would not.

## The Compare concept: a binary predicate with a strict weak ordering

A type satisfies the C++ *Compare* concept if it 1. satisfies *BinaryPredicate* (evaluates to true/false) and 2. induces a *strict weak ordering*. Suppose a struct `myPair` stores two ints `x` and `y`; to use it in a set we need to write a `<` operator:

```cpp run pin ex_mypair_set.cpp
// predict: Four pairs are inserted. Write the lines printed, including the size.
#include <iostream>
#include <set>
using namespace std;

struct myPair { int x; int y; };

bool operator<(const myPair& lhs, const myPair& rhs) {
    return lhs.x + lhs.y < rhs.x + rhs.y;
} // Sorts myPairs by sum of components

int main() {
    set<myPair> s;
    s.insert({5, 5});   // sum 10
    s.insert({1, 2});   // sum 3
    s.insert({4, 0});   // sum 4
    s.insert({2, 1});   // sum 3 again: equivalent to {1,2}, NOT inserted
    for (const myPair& p : s) cout << "(" << p.x << "," << p.y << ") sum " << p.x + p.y << endl;
    cout << "size " << s.size() << endl;
    return 0;
}
```

`return lhs.x + lhs.y < rhs.x + rhs.y;` is the slide's comparison: it sorts myPairs by the sum of the components, so the set prints `(1,2)`, `(4,0)`, `(5,5)`. The set never calls `==`. Two elements are **equivalent** when neither is less than the other, and `s.insert({2, 1});` has the same sum as {1,2}, so the set treats it as a duplicate and refuses it: `size 3`. Choose the comparison with that in mind; comparing by sum says that {1,2} and {2,1} are the same element.

## The three rules of a strict weak ordering

Almost all C++ STL functions and containers require the ordering to satisfy the standard mathematical definition of a *strict weak ordering*. Let `lessThan(left, right)` be a comparison function. It is a strict weak ordering iff:

1. **IRREFLEXIVITY**: `lessThan(x, x) == false`. If x is passed into both parameters the expected output is false: *x can not be less than itself*.
2. **ANTISYMMETRY**: if `lessThan(x, y)` then `!lessThan(y, x)`.
3. **TRANSITIVITY**: if `lessThan(x, y)` and `lessThan(y, z)` then `lessThan(x, z)`.

`<=` breaks rule 1: `x <= x` is true, so a set built on it cannot tell equal elements apart and may insert duplicates or loop. `!=` breaks rule 2: `x != y` and `y != x` are both true. The checker runs the three tests on a small sample for each comparator and shows what a `std::set` built with it would keep:

```widget
swo-checker
{ "comparator": "sum" }
```

## Three ways to give the container its ordering

1. Define `operator<(const Obj& lhs, const Obj& rhs)` for the class (the `myPair` program above; Week 4's friendly non-member canon).
2. Define a custom comparison function that is a *binary predicate*: takes two elements and returns a boolean.
3. Implement `operator()` as a comparison function in a separate struct: a **functor**, an *object that behaves like a function*.

```cpp
bool compare(const Date& lhs, const Date& rhs) { return lhs < rhs; }   // 2. binary predicate

struct cmp {                                                             // 3. functor
    bool operator()(const Date& lhs, const Date& rhs) { return lhs < rhs; }
};

std::priority_queue<Date> dates1;                                                     // 1. uses operator<
std::priority_queue<Date, std::vector<Date>, std::function<bool(Date, Date)>> dates2{compare};
std::priority_queue<Date, std::vector<Date>, cmp> dates3;
```

These are DateTester.cpp's three queues, worked in lesson 09. A `set` takes the comparator the same way: `set<myPair, cmp>` for a functor type, or a function pointer passed to the constructor for a plain function. Whichever spelling you pick, the function inside must obey the three rules.

```challenge
{ "prompt": "Give <code>struct Student { string name; int grade; }</code> an <code>operator&lt;</code> that orders by <b>grade</b>, and by <b>name</b> when the grades tie. Insert Sam 85, Ali 92, Kim 85 and Sam 85 again into a <code>set&lt;Student&gt;</code>, print each as <code>grade name</code>, then <code>size N</code>.", "starter": "#include <iostream>\n#include <set>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int grade;\n};\n\n// bool operator<(const Student& lhs, const Student& rhs) { ... }\n\nint main() {\n    set<Student> roster;\n    roster.insert({\"Sam\", 85});\n    roster.insert({\"Ali\", 92});\n    roster.insert({\"Kim\", 85});\n    roster.insert({\"Sam\", 85});\n    for (const Student& s : roster) {\n        cout << s.grade << \" \" << s.name << endl;\n    }\n    cout << \"size \" << roster.size() << endl;\n    return 0;\n}\n", "expected": "85 Kim\n85 Sam\n92 Ali\nsize 3", "hints": ["Compare grades first: <code>if (lhs.grade != rhs.grade) return lhs.grade &lt; rhs.grade;</code>", "Only when the grades are equal fall through to <code>return lhs.name &lt; rhs.name;</code>. The second Sam 85 is equivalent to the first and is refused, so the size is 3."], "solution": "#include <iostream>\n#include <set>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int grade;\n};\n\nbool operator<(const Student& lhs, const Student& rhs) {\n    if (lhs.grade != rhs.grade) return lhs.grade < rhs.grade;\n    return lhs.name < rhs.name;\n}\n\nint main() {\n    set<Student> roster;\n    roster.insert({\"Sam\", 85});\n    roster.insert({\"Ali\", 92});\n    roster.insert({\"Kim\", 85});\n    roster.insert({\"Sam\", 85});\n    for (const Student& s : roster) {\n        cout << s.grade << \" \" << s.name << endl;\n    }\n    cout << \"size \" << roster.size() << endl;\n    return 0;\n}\n" }
```

## Order words by length and numbers by remainder

Two new orderings that make different elements equivalent, a multiset erased two ways, and four comparators to test against the three rules.

```quiz
[
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <set>\n#include <string>\nusing namespace std;\n\nstruct Word { string text; };\n\nbool operator<(const Word& lhs, const Word& rhs) {\n    return lhs.text.size() < rhs.text.size();      // shorter first\n}\n\nint main() {\n    set<Word> s;\n    for (string w : {\"pear\", \"fig\", \"plum\", \"kiwi\", \"banana\"})\n        s.insert({w});\n    for (const Word& w : s) cout << w.text << \" \";\n    cout << \"size \" << s.size() << endl;\n    return 0;\n}",
    "options": [
      "`fig pear banana size 3`",
      "`fig kiwi pear plum banana size 5`",
      "`fig plum banana size 3`",
      "`banana fig kiwi pear plum size 5`"
    ],
    "answer": 0,
    "explain": "The set orders by length only, so two words of the same length are equivalent (neither is less than the other) and the later one is refused. pear (4) goes in; fig (3) goes in; plum and kiwi (both 4) are equivalent to pear and refused; banana (6) goes in. Sorted shortest first: fig, pear, banana. Size 3."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    multiset<int> ms = {5, 1, 5, 3, 9, 5};\n    ms.erase(ms.find(5));\n    cout << ms.count(5) << \" |\";\n    ms.erase(5);\n    for (int x : ms) cout << \" \" << x;\n    cout << endl;\n    return 0;\n}",
    "answer": [
      "2 | 1 3 9"
    ],
    "explain": "The multiset holds 1 3 5 5 5 9. `erase(ms.find(5))` erases the one element the iterator points at: two 5s remain, count 2. `erase(5)` by key erases every 5: 1 3 9."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\n#include <set>\nusing namespace std;\n\nstruct ByRemainder {\n    bool operator()(int a, int b) const { return a % 3 < b % 3; }\n};\n\nint main() {\n    set<int, ByRemainder> s;\n    for (int x : {4, 7, 2, 9, 5})\n        s.insert(x);\n    for (int x : s) cout << x << \" \";\n    cout << endl;\n    return 0;\n}",
    "options": [
      "`9 4 2`",
      "`2 4 5 7 9`",
      "`4 7 2 9 5`",
      "`9 7 5`"
    ],
    "answer": 0,
    "explain": "The functor compares remainders mod 3, which is a valid strict weak ordering whose equivalent elements share a remainder. 4 (remainder 1) is kept, 7 (1) is refused, 2 (2) is kept, 9 (0) is kept, 5 (2) is refused. Sorted by remainder 0, 1, 2: 9 4 2."
  },
  {
    "q": "Which of these comparisons on ints is a strict weak ordering?",
    "options": [
      "`a > b`",
      "`a <= b`",
      "`a != b`",
      "`a % 2 <= b % 2`"
    ],
    "answer": 0,
    "explain": "`a > b` is just descending order: never true for x with itself, never both ways, and transitive. `a <= b` fails irreflexivity (x <= x). `a != b` fails antisymmetry (1 != 2 and 2 != 1). `a % 2 <= b % 2` fails irreflexivity too (x with itself gives true). A brute-force check of the three rules over 1 to 4 agrees: only `a > b` passes."
  }
]
```

```challenge
{"prompt": "Write the functor <code>CaseInsensitive</code>: its <code>operator()</code> compares two strings character by character after <code>tolower</code>, and when one is a prefix of the other the shorter comes first. Strings that differ only in case are then equivalent, so the set keeps the first spelling inserted.", "starter": "#include <cctype>\n#include <iostream>\n#include <set>\n#include <string>\nusing namespace std;\n\n// write the functor CaseInsensitive: operator() compares the two strings\n// character by character after tolower; a shorter prefix comes first\n\nint main() {\n    set<string, CaseInsensitive> fruit;\n    for (string f : {\"Apple\", \"apple\", \"Banana\", \"cherry\", \"BANANA\"})\n        fruit.insert(f);\n    for (const string& f : fruit) cout << f << \" \";\n    cout << \"size \" << fruit.size() << endl;\n    return 0;\n}\n", "expected": "Apple Banana cherry size 3", "hints": ["<code>struct CaseInsensitive { bool operator()(const string&amp; a, const string&amp; b) const { ... } };</code>", "Return at the first position where the lower-case characters differ; if none differs, return <code>a.size() &lt; b.size()</code>.", "Never return true for two equal strings: irreflexivity."], "solution": "#include <cctype>\n#include <iostream>\n#include <set>\n#include <string>\nusing namespace std;\n\nstruct CaseInsensitive {\n    bool operator()(const string& a, const string& b) const {\n        size_t n = a.size() < b.size() ? a.size() : b.size();\n        for (size_t i = 0; i < n; ++i) {\n            char x = tolower(a[i]), y = tolower(b[i]);\n            if (x != y) return x < y;\n        }\n        return a.size() < b.size();\n    }\n};\n\nint main() {\n    set<string, CaseInsensitive> fruit;\n    for (string f : {\"Apple\", \"apple\", \"Banana\", \"cherry\", \"BANANA\"})\n        fruit.insert(f);\n    for (const string& f : fruit) cout << f << \" \";\n    cout << \"size \" << fruit.size() << endl;\n    return 0;\n}\n"}
```
```quiz
[
  {
    "q": "Which statements about `std::set` are true? (select all)",
    "options": ["Elements are kept sorted", "Elements are unique", "Elements can be modified in place through an iterator", "It is typically implemented as a binary search tree"],
    "answer": [0, 1, 3],
    "explain": "Elements cannot be edited after being added (they are const): editing one could break the sorted order. Search, insertion and removal are logarithmic."
  },
  {
    "q": "What does this print?",
    "code": "multiset<int> ms = {10, 40, 20, 40, 30};\nms.erase(40);\nfor (int x : ms) cout << x << ' ';",
    "options": ["10 20 30 40", "10 20 30", "10 40 20 30", "40 30 20 10"],
    "answer": 1,
    "explain": "erase(key) removes every element equal to the key (both 40s); the multiset is always in sorted order regardless of the initializer's order."
  },
  {
    "q": "`mymultiset.erase(it, mymultiset.end())` where `it` points at 50 in {10 30 50 60} leaves...",
    "options": ["10 30 50", "50 60", "10 30", "10 30 60"],
    "answer": 2,
    "explain": "The range form erases the half-open range [it, end): the 50 and everything after it."
  },
  {
    "q": "A type satisfies the C++ Compare concept if it...",
    "options": ["returns an int like strcmp", "is a binary predicate (returns true or false) and induces a strict weak ordering", "defines both `<` and `==`", "is a member function of the class"],
    "answer": 1,
    "explain": "Two requirements, both from the slide: BinaryPredicate and strict weak ordering."
  },
  {
    "q": "Which rule does `lessThan(x, y) = (x <= y)` violate?",
    "options": ["Transitivity", "Antisymmetry only", "Irreflexivity: lessThan(x, x) must be false, but x <= x is true", "None; `<=` is a valid strict weak ordering"],
    "answer": 2,
    "explain": "x can not be less than itself. With <= every element is 'less than' itself, so the set can no longer detect equivalent elements. (It also breaks antisymmetry for equal values.)"
  },
  {
    "q": "Antisymmetry says that if `lessThan(x, y)` is true then...",
    "options": ["`lessThan(y, x)` is also true", "`lessThan(y, x)` is false", "`lessThan(x, x)` is true", "x and y are equivalent"],
    "answer": 1,
    "explain": "If x is less than y, y cannot be less than x. Transitivity is the third rule: x < y and y < z imply x < z."
  },
  {
    "q": "With `operator<` comparing myPairs by the sum of their components, how many elements does the set hold after inserting {5,5}, {1,2}, {4,0}, {2,1}?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "{2,1} has sum 3, the same as {1,2}: neither is less than the other, so they are equivalent and the second is not inserted."
  },
  {
    "q": "Which is NOT one of the slide's three ways to define the comparison for a container?",
    "options": ["`operator<` for the class", "a custom comparison function that is a binary predicate", "a functor: a struct with `operator()`", "overriding the container's `compare()` virtual method"],
    "answer": 3,
    "explain": "operator<, a binary predicate function, or a functor (an object that behaves like a function). DateTester.cpp builds a priority_queue each way."
  },
  {
    "q": "A functor is...",
    "type": "text",
    "answer": ["an object that behaves like a function", "object that behaves like a function", "a struct with operator()", "an object with operator()"],
    "explain": "The slide's definition: implement operator() in a separate struct and the object can be called like a function."
  }
]
```
