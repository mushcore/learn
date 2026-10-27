# COMP 3522 Week 6 — facts, programs and outputs transcribed from the instructor's material

Source files: `D:\BCIT\COMP3522\Lectures\Week 6\3522 Week 61.pdf` (104 slides; agenda 1: auto keyword, ranged for, intro to the STL, STL containers; agenda 2 on slide 54: STL iterators, algorithms) and the sample repo `comp-3522-fall-2026-course-sample-code-mushcore-main\Week6\`: pair.cpp, map.cpp, multimap.cpp, multiset.cpp, deque.cpp, priorityqueue/main.cpp, typedefs/main.cpp, iterator.cpp, randomAccessIterator/main.cpp, partitionOdd.cpp, partition.cpp, date/Date.hpp + Date.cpp + DateTester.cpp. Every program compiled with g++ -std=c++20 -Wall -Wextra -pedantic (GCC 13.1.0 mingw) and its output recorded. Also in the same folder: `3522 Midterm Info6.pdf` and `COMP 3522 Practice Midterm.pdf` (see `comp3522-midterm/_SOURCE-NOTES.md`). Links on the slides: cppreference auto (slide 9), geeksforgeeks STL (16), cplusplus.com vector (22), pair (27), map (28), Wikipedia strict weak ordering (32), cs.smu.ca container typedefs (47), geeksforgeeks iterators (64, 77), cplusplus.com algorithm (80, 104), cplusplus.com and cppreference partition (85, 89).

## auto (slides 3–9)
- Slide 4: as a variable type, `auto` specifies that the type of the variable will be **deduced automatically from its initializer**; as a function return type, the return type will be deduced from the return statements.
- Slide 5: `double sum = 5.0; auto a; //ERROR, auto requires initializer  auto d = 5.0; auto i = 1 + 2;` and `int add(int x, int y) { return x + y; } int main() { auto sum = add(5, 6); }` (d is double, i is int, sum is int).
- Slide 6: "auto can't be used with function parameters": `void add_and_print(auto x, auto y) { std::cout << x + y; }` "This won't work because the compiler can't infer types for function parameters x and y at compile time." (Teach the slide's rule. Footnote only: C++20 actually accepts `auto` parameters as an abbreviated function template, and g++ -std=c++20 compiles it; the quiz follows the slide.)
- Slide 7: "auto can be used with function return types": `auto add(int x, int y) { return x + y; }`. "I would like to discourage this: using auto for variables is fine because the object is right there; using auto for functions means we have to dig into the function to find out what it's supposed to be returning."
- Slides 8–9, trailing return type: instead of `int add(int x, int y);` some write `auto add(int x, int y) -> int;`. "In this case, auto does not perform type inference, it is just part of the syntax to use a trailing return type." Why: alignment, "so easy to read": `auto add(int x, int y) -> int; auto divide(double x, double y) -> double; auto print_something() -> void; auto calculate_that(int x, double d) -> string;`.
- Verified (`$S\build\ex_auto_for.cpp`): `5 5 3 11 3.5` then `true true` (typeid checks that `auto d = 5.0` is double and `auto i = 1 + 2` is int).

## Ranged for (slides 10–14)
- "The ranged for" aka for-each loop: identical to Java; formally it executes a for loop over a specified range.
- Slide 11: `std::vector<int> v = {0, 1, 2, 3, 4, 5}; for (int i=0; i<v.size(); i++) std::cout << v[i] << ' ';` versus `for (const int i : v) //i is a copy of element in v`. Slide 12: `for (const int& i : v) // const reference`. Slide 13: `for (auto i : v) // access by value, i is int`; "the initializer may be a braced-init-list": `for (int n : {0, 1, 2, 3, 4, 5})`. Slide 14: "the initializer may be an array": `int a[] = {0, 1, 2, 3, 4, 5}; for (int n : a)`; "the loop variable doesn't have to be used": `for (int n : a) std::cout << something_unrelated << ' ';`.
- Verified: all forms print `0 1 2 3 4 5`; `for (int& k : v) k *= 10;` changes the vector (`0 10 20 30 40 50`), a by-value loop variable does not. Note `i < v.size()` compares int with an unsigned `size_type` (-Wsign-compare warning); slide 51 fixes it with `vector<int>::size_type`.

## Intro to the STL (slides 15–22)
- Slide 16: C++ STL is "like the Java Collections Framework SUPERPOWERED"; "one of the most fun and interesting reasons to work with C++"; composed of: 1. **Containers**: classes that store objects and data; 2. **Iterators**: used for working on a sequence of values; 3. **Algorithms**: functions specially designed to be used on a range of elements.
- Slide 17, about the STL: uses **value semantics**: containers get a **copy** of the object we are putting in it; this means our element class must have a copy constructor, an assignment operator, a destructor. STL performs almost no checking: the programmer is responsible for meeting preconditions. STL uses **half-open ranges [included, not included)**: "Imagine array size 5. array[0,5). When iterating through include 0th index, exclude 5th index."
- Slide 18, containers: 1. **Sequence containers** (we specify the order): array, vector, deque, list, forward_list. 2. **Associative containers** (objects are automatically sorted; can be searched with O(log n) complexity): set, multiset, map, multimap. 3. **Unordered associative containers** (stored using hash; can be searched O(1) to O(n) worst case): unordered_set, unordered_multiset, unordered_map, unordered_multimap.
- Slide 19, "Suppose we have a container object c...": `c.insert(x); // Inserts a copy of x into an associative container`; `c.insert(position, x); // Inserts a copy of x into a sequence container`; `c.begin(); // Returns an iterator pointing to the first element in the container if it exists`; `c.end(); // Returns an iterator one past the end of the container`; `for (auto it = c.begin(); it != c.end(); ++it) { // process! }`.
- Slide 20, vectors again: "A vector is a dynamic array that offers random access and insertion/deletion": `#include <vector> vector<int> v; v.push_back(2); for (vector<int>::iterator it = v.begin(); it != v.end(); ++it) { cout << *it << endl; }` → `2`.
- Slide 21: `vector<int> v2 {2, 4, 6, 8, 10}; v2.insert(v2.begin(), 6); // 6, 2, 4, 6, 8, 10  v2.insert(v2.begin() + 3, -4); // 6, 2, 4, -4, 6, 8, 10  v2.erase(v2.begin() + 1); //6, 4, -4, 6, 8, 10  int a [] = { 3, 6, 9, 12, 15 }; vector<int> v3 {a, a + 5 }; // copies in the range [first, last)`. All verified (`ex_vector21.cpp`): `6 2 4 6 8 10` / `6 2 4 -4 6 8 10` / `6 4 -4 6 8 10` / `3 6 9 12 15`, size 5, front 3, back 15.
- Slide 22, (re-)familiarize yourself with the vector: `empty()`, `size()`, `capacity()`, `clear()`, `insert()`, `push_back()` and `pop_back()`, `front()` and `back()`.

## STL containers (slides 23–29)
- Slide 24: "I'm so tired of vectors": Java has the Java Collections Framework, C++ has the Standard Template Library; Java has collections, C++ has containers.
- Slide 25, container classes. **First-class containers**: Vector, List, Deque, Map and Multimap, Set and Multiset. **Container adaptors** (modify and restrict a first-class container): Stack (default implementation is the deque), Queue (default implementation is also the deque), Priority_queue (default implementation is the vector).
- Slide 27, side-note pair: `<utility>`; object that can hold two values of different types; has member functions (accessors) called `first` and `second`; see pair.cpp; built-in function `make_pair` simplifies creation.
- Slide 28, map: `<map>`, `std::map`; sorted associative container; a collection of 1-to-1 mappings, i.e. a collection of key/value pair objects; **`value_type` is a pair type** that combines key and value; **keys must be unique**; keys are sorted using a comparison function (like the Java Comparator); logarithmic speed for search, insertion, and removal (fast!).
- Slide 29: the value_type of a map is a Pair. Adding to a phonebook mapping strings to strings: `phonebook.insert(map<string, string>::value_type("Sam", "6045551212"));` "This fails if an element with the same key is already in the map: `phonebook.insert(make_pair("Sam", "2505551212"));`" (Map.cpp).

## Set and strict weak ordering (slides 30–36)
- Slide 31, set: `<set>`, `std::set`; associative container containing a sorted set of **unique** objects of type Key; the value of an element also identifies it; **elements cannot be edited after being added (are const)**; sorting performed using key comparison function; logarithmic speed for search, insertion, and remove; typically implemented as a **binary search tree**.
- Slide 32, comparing set elements: the C++ compare concept: type T satisfies Compare if it 1. satisfies BinaryPredicate (evaluates to true/false) and 2. induces a strict weak ordering. Suppose a struct myPair stores 2 ints x and y; we need to write a `<` operator to use it in a set: `bool operator<(const myPair& lhs, const myPair& rhs) { return lhs.x + lhs.y < rhs.x + rhs.y; } // Sorts myPairs by sum of components`. Verified (`ex_mypair_set.cpp`): inserting {5,5}, {1,2}, {4,0}, {2,1} gives `(1,2) sum 3 / (4,0) sum 4 / (5,5) sum 10`, size 3: {2,1} is **equivalent** to {1,2} under this ordering and is not inserted.
- Slides 34–35, strict weak ordering: almost all STL functions/containers require the ordering to satisfy the mathematical definition. Let lessThan(left, right) be a comparison function; it is a strict weak ordering iff: 1. **IRREFLEXIVITY**: lessThan(x, x) == false ("x can not be less than itself"); 2. **ANTISYMMETRY**: if lessThan(x, y) then !lessThan(y, x); 3. **TRANSITIVITY**: if lessThan(x, y) and lessThan(y, z) then lessThan(x, z).
- Slide 36, defining it, three ways: 1. define `operator<(const Obj& lhs, const Obj& rhs)` inside the class; 2. define a custom comparison function that is a binary predicate (takes two elements and returns a boolean); 3. implement `operator()` as a comparison function in a separate struct: a **functor**, "object that behaves like a function". (DateTester.cpp shows all three.)

## typedefs and the restaurant analogy (slides 37–53)
- Slide 38: "The typedef keyword creates an alias that can be used anywhere instead of a (possibly) complex type name": `typedef int int_t; // declares int_t to be an alias for the type int  int_t myT;` and `typedef int arr_t[3]; // arr_t is array of 3 int  arr_t myArr; myArr[0] = 999; myArr[1] = 1; myArr[2] = 5;`.
- Slide 39: `pair <map<string, string>::iterator, map<string, string>::iterator> pairMapIters;` compared to `typedef map<string, string>::iterator mapIterator; pair <mapIterator, mapIterator> pairMapIters;` ("mapIterator is a new type. Alias for map<string, string>::iterator"; the slide's text has stray `it` tokens).
- Slides 40–46, restaurant analogy: Fast Food has an LCDMenu, Fancy Restaurant a PaperMenu, Food Truck a BoardMenu. "Me: Can I get a menu?" → each asks "What's a menu?"; "Can I get an LCDMenu?" → only Fast Food says OK. Fix: every restaurant implements `typedef LCDMenu menu` / `typedef PaperMenu menu` / `typedef BoardMenu menu`, "so that 'menu' is a common name/alias for their internal implementation of menu"; now "Can I get a menu?" works everywhere. Mapped to the STL (*pseudocode): Vector has a RandomAccessIterator with `typedef RandomAccessIterator iterator`; Map and Set have a BiDirectionalIterator with `typedef BiDirectionalIterator iterator`. "Can I get an iterator?" → `vector<int>::iterator myIter;` gets a RandomAccessIterator; `map<string, int>::iterator myIter;` gets a BiDirectionalIterator (typedefs.cpp).
- Slide 47, containers and typedefs: STL containers have standard typedefs: `size_type`, `value_type`, `iterator`, `pointer`, `reference` and `const_reference`, `difference_type`, etc. "This makes it possible to write generic functions that work on containers. If we create a container, we should implement these standard typedefs."
- Slide 48, why? consistency: the same name for the same conceptual entity across different container classes: `vector<int>::iterator` gives a random access iterator for a vector of integers; `list<string>::iterator` gives a bidirectional iterator for a list of strings.
- Slide 49, `size_type`: unsigned integer type; sufficiently large to hold the size of any object of that class; appears in all first-class containers and in the container adaptors. Slides 50–51: `for (int i = 0; i < vec.size(); ++i)` versus `for (vector<int>::size_type i = 0; i < vec.size(); ++i)`.
- Slide 52: `iterator`: an iterator of the default type for a (first-class) container type: `vector<int> myVec = {1,2,3}; vector<int>::iterator vecIter = myVec.begin();`. `const_iterator`: prevents modification to elements during iteration. Slide 53: `reverse_iterator`: iterates backwards starting from the last element with `rbegin()`; incrementing moves the iterator towards the beginning of the container: `vector<int>::reverse_iterator = myVec.rbegin();` (slide omits the variable name). `const_reverse_iterator`: a const reverse iterator.

## Iterators (slides 54–77)
- Slide 57, reminder: an iterator is an object; points to some element in a range of elements; can iterate (loop) through the range; has operators like increment (`++`) and dereference (`*`). Why important: iterate through containers generically; extensively used when calling STL algorithms: `some_algorithm(iterBegin, iterEnd, func)`.
- Slides 58–63, begin and end with `vector<int> intVec = {9}; itBegin = intVec.begin(); itEnd = intVec.end(); for(itBegin; itBegin != itEnd; itBegin++) { cout << *itBegin << endl; }`. First picture: both arrows point at 9: "That doesn't look right..." Correction: `end()` returns an iterator pointing to a theoretical **one element past the last element** in the range of values; "itEnd does not point to element. Don't dereference end". 1st pass: itBegin != itEnd, do loop code, output 9; 2nd pass: itBegin == itEnd, leave loop. With `{9, 10, 11}` itEnd is one past 11. With `{}` (empty): itBegin == itEnd immediately, no iterations.
- Slide 64: five kinds of iterators: Input, Output, Forward, Bidirectional, Random Access. Slide 65: each kind is defined by the operations that can be performed on it: 1. read, 2. write, 3. increment (with or without multiple passes), 4. decrement, 5. random access.
- Slide 67, 1. **Input iterator**: single pass forward direction sequential input operations: `==`, `!=`, `++`, `*it`; only reading; incrementing. "There is not a single type of input iterator. Each container defines its own specific iterator type."
- Slide 68 table (i and j are iterators): `i != j` → bool, equivalent `!(i == j)`; `*i` → value_type; `i->m` → m, equivalent `(*i).m`; `++i` → It, equivalent "++i; return It temp = i;"; `i++` → It, equivalent `It temp = i; ++i; return temp;`; `*i++` → value_type, equivalent `value_type x = *i; ++i; return x;`.
- Slide 69, 2. **Output iterator**: single pass forward direction sequential output operations: `*it`, `++`, `*it = value`; only writing; incrementing. Slide 70 table: `*i = some value`; `++i` → It; `i++` → It (`It temp = i; ++i; return temp;`); `*i++ = some value` equivalent `*i = some value; ++i;`.
- Slide 72, 3. **Forward iterator**: multi-pass forward direction sequential output operations: `==`, `!=`, `++`, `*it`, `*it = value`; reading AND writing, incrementing; we can make a copy of the iterator and dereference the same iterant: `iterSaved = iter; iter++; cout << "Previous element is " << (*iterSaved) << endl; cout << "Current element is " << (*iter) << endl;`.
- Slide 73, 4. **Bidirectional iterator**: multi-pass bidirectional sequential output operations: `==`, `!=`, `++`, `--`, `*it`, `*it = value`; reading AND writing; incrementing, decrementing (iterator.cpp). Slide 74 table, additional expressions: `--i` → It; `i--` → It (`It temp = i; --i; return temp;`); `*i--` → value_type.
- Slide 75, 5. **Random access iterator**: multi-pass random access output operations: `==`, `!=`, `++`, `--`, `*it`, `*it = value`, `it + n` or `it - n` where n is an int, `<`, `<=`, ...; reading AND writing; incrementing and decrementing; random access ("HOORAY!"). Slide 76 table, additional expressions: `i += n`, `i -= n` (where i = It&) → It; `i + n`, `i - n` → It (`It temp = i; return temp += n;`); `i - j` → difference_type ("return difference"); `i[n]` → value_type, equivalent `*(i + n)`; `i < j, i <= j, i > j, i >= j` → bool. (RandomAccessIterator.cpp)
- Slide 77, some notes: **only random-access iterators permit an integer value to be added to or subtracted from an iterator** (`iter1 - 5`); **only random access iterators permit one iterator to be subtracted from another** (results in a difference_type) (`iter1 - iter2`).
- Container → iterator category (needed for the widget; standard facts, not on a slide except vector/map/set/list): vector, deque, array: random access; list, set, multiset, map, multimap: bidirectional; forward_list: forward; istream_iterator: input; ostream_iterator: output.

## Algorithms (slides 78–101)
- Slide 79: "I cannot possibly do justice to what you will learn in your algorithms course. So... we will explore some of the common algorithms in C++ and identify some patterns (parameters, what they do, etc.)".
- Slide 80, the STL algorithm: used on an array or an STL container; a function that can be used on a range of elements; **always in the range [first, last)**; **does not change the size of the container**; used with iterators or pointers; use www.cplusplus.com/reference/algorithm.
- Slides 81–82, types of algorithms: 1. sequential, non-modifying (`find()`, `for_each()`); 2. sequential, modifying (`copy()`, `remove_if()`); 3. partitioning (`partition()`, `is_partitioned()`); 4. sorting (`sort()`, `is_sorted()`); 5. binary search (`binary_search()`); 6. merge (`merge()`, `inplace_merge()`); 7. heap (`make_heap()`, `push_heap()`); 8. min/max (`min()`, `max()`); 9. generalized numeric operations. Slide 83, where: 1. `<algorithm>` (most of them); 2. `<numeric>` (a few generalized numeric operations).
- Slide 85, std::partition in `<algorithm>`: "Reorders the elements in [first, last). The elements for which a predicate p is true all precede elements for which the predicate p returns false." Translation: sorts the elements using a function; the function evaluates each element and returns true or false; all the "true" elements come before the "false" elements.
- Slide 86, partitions: **relative ordering of the elements is not maintained**; three parameters: 1. an iterator or pointer to the first element in the range; 2. an iterator or pointer to one past the final element; 3. a pointer to a function that accepts a single parameter of the type being iterated over and returns a boolean. **Returns an iterator pointing to the first element in the second group (the "false" group), or the end of the container if there are no members of this group.**
- Slides 87–88, 100–101, odd number example: vector with 10 numbers, function IsOdd, `std::partition(vector.begin(), vector.end(), IsOdd)` → vector re-ordered and iterator returned (iterBound) pointing to the first even number. Before: {1,2,3,4,5,6,7,8,9,10} (first, last). After: **{1,9,3,7,5,6,4,8,2,10}**, IterBound points to 6 (partitionOdd.cpp).
- Slide 89, "possible" implementation (cppreference):
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
- Slides 90–99, trace on {1,2,3,4,5} with IsOdd: find_if_not moves `first` to 2 (the first even); `i` starts at 3; isOdd(3) TRUE → iter_swap(i, first) → {1,3,2,4,5}, ++first (now at 2 in position 3); ++i → 4: isOdd(4) FALSE; ++i → 5: isOdd(5) TRUE → iter_swap → **{1,3,5,4,2}**, ++first (now at 4); ++i == last → leave loop; return first (pointing at 4). Verified (`ex_partition_trace.cpp`): `after swap: 1 3 2 4 5 first -> 2`, `after swap: 1 3 5 4 2 first -> 4`, `result: 1 3 5 4 2 bound -> 4`; std::partition on 1..10 gives `1 9 3 7 5 6 4 8 2 10`, bound → 6, is_partitioned true; with no odd numbers the bound is `begin()` (the whole range is the false group); with no even numbers it is `end()`; `stable_partition` keeps relative order: `1 3 5 7 9 2 4 6 8 10`.

## Activities (slides 102–104)
1. Examine partition.cpp: generates cities in 2D space and partitions them based on distance; examine how it uses the partition algorithm and the for_each algorithm.
2. "I made a simple Date class. Examine Date.hpp, Date.cpp, DateTester.cpp. Implement operator< in Date so that it has a strict weak ordering. What is happening in the main method? Comment the code."
3. Select TWO data structures from the STL; open http://www.cplusplus.com/reference/algorithm/; select TWO algorithms; write TWO little programs, each using ONE data structure to demonstrate how ONE of the algorithms works.

## Sample programs (full source, real output)

### pair.cpp
```cpp
#include <utility>
#include <iostream>

using namespace std;
int main()
{
	pair<string, int> myPair;
	myPair.first = "hi";
	myPair.second = 7;

	pair<int, double> p(1, 3.14);

	pair<char, char> p2 = make_pair('a', 'b');

	cout << p.first << ' ' << p.second << std::endl;
	cout << p2.first << ' ' << p2.second << std::endl;

	p2.first = 'z';
	p2.second = 'h';

    cout << p2.first << ' ' << p2.second << std::endl;
}
```
Output: `1 3.14` / `a b` / `z h`. (`myPair` is never printed; `<string>` comes in through `<iostream>` on this compiler.)

### map.cpp
```cpp
#include <utility>
#include <iostream>
#include <map>
#include <iterator>
#include <vector>

using namespace std;

int main()
{
    map<string, string> nameAndNumbers;

    //approach 1, make a pair first, then insert
    nameAndNumbers.insert(pair<string, string>("Tom","604-123-4567"));

    //approach 2, the super long version using the value_type typedef. value_type is of type pair behind the scenes
    //nameAndNumbers.insert(map<string, string>::value_type("Tom", "604-123-4567"));

    //approach 3, insert pair using built-in make_pair function
    //nameAndNumbers.insert(make_pair("Tom", "604-123-4567"));

    //add Harry and attempt to add duplicate Tom key/value pairs
    nameAndNumbers.insert(make_pair("Harry", "604-999-9999"));
    nameAndNumbers.insert(make_pair("Tom", "604-888-8888"));
    nameAndNumbers.insert(make_pair("Tom", "604-888-8228"));
    nameAndNumbers.insert(make_pair("Tom", "604-8888"));
    nameAndNumbers.insert(make_pair("Tom", "604-818888"));

    cout << endl << "Phone numbers of people Named Tom" << endl;

    //get iterator pointing to Tom and print
    map<string, string>::iterator oneNumber = nameAndNumbers.find("Tom");
    cout << oneNumber->first << " - " << oneNumber->second;

//    //print out everything in map
//    for(auto it = nameAndNumbers.begin(); it != nameAndNumbers.end(); ++it)
//    {
//        cout << it->first << " - " << it->second << endl;
//    }

    return 0;

}
```
Output: an empty line, `Phone numbers of people Named Tom`, `Tom - 604-123-4567` (no trailing newline). The four later inserts for "Tom" are refused: the first value stays. With the commented loop enabled it prints `Harry - 604-999-9999` then `Tom - 604-123-4567` (sorted by key). Verified elsewhere (`ex_adaptors.cpp`): `insert` returns a `pair<iterator, bool>` whose `.second` is `false` for a duplicate; `m["a"] = 100` through `operator[]` **would** overwrite.

### multimap.cpp
```cpp
#include <iostream>
#include <map>
#include <iterator>

using namespace std;
//annoying to type out entire iterator, use typedef to shorten it
int main()
{
    multimap<string, string> nameAndNumber;

    nameAndNumber.insert(make_pair("Tom", "604-123-4567"));
    nameAndNumber.insert(make_pair("Harry", "604-999-9999"));
    nameAndNumber.insert(make_pair("Tom", "604-888-8883"));
    nameAndNumber.insert(make_pair("Tom", "604-888-8882"));
    nameAndNumber.insert(make_pair("Chris", "***-*******"));
    nameAndNumber.insert(make_pair("Tom", "604-887-8881"));

    //notice pairs are sorted based on keys (Person's name in this case)
    for (auto pairs = nameAndNumber.begin();
         pairs != nameAndNumber.end(); ++pairs)
    {
        cout << pairs->first << " phone number is " << pairs->second << endl;
    }

//    cout << endl << "Phone numbers of Tom" << endl;

//    //Method 1 - find duplicates using 1 iterator and size
//    multimap<string, string>::iterator PhoneValues = nameAndNumber.find("Tom");
//    int count = nameAndNumber.count("Tom");
//    for (int i = 0; i < count; i++)
//    {
//        cout << PhoneValues->first << " " << PhoneValues->second << endl;
//        ++PhoneValues;
//    }

////    Method 2 - find duplicates using 2 iterators
////     pairIters.first = iterator pointing to first appearance of Tom
////     pairIters.second = iterator pointing to one past last appearance of Tom
//
//    pair <multimap<string, string>::iterator, multimap<string, string>::iterator> pairIters = nameAndNumber.equal_range("Tom");
//
////    typedef multimap<string, string>::iterator mapIterator;
////    pair <mapIterator, mapIterator> pairIters = nameAndNumber.equal_range("Tom");
//
//    //ret is a pair containing iteratorBeginning, iteratorEnd>
//    for (auto it=pairIters.first; it!=pairIters.second; ++it)
//        std::cout << it->first << " "<< it->second << endl;
//    std::cout << '\n';

    return 0;
}
```
Output:
```
Chris phone number is ***-*******
Harry phone number is 604-999-9999
Tom phone number is 604-123-4567
Tom phone number is 604-888-8883
Tom phone number is 604-888-8882
Tom phone number is 604-887-8881
```
Keys sorted (Chris, Harry, Tom); equal keys keep **insertion order**. Method 1 (`find` + `count`) and Method 2 (`equal_range` returning a pair of iterators) both list the four Toms; the typedef `mapIterator` shortens the pair type (slide 39).

### multiset.cpp
```cpp
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
Output: `mymultiset contains: 10 30`. Three erase overloads: by iterator (one element), by key (**all** equal elements), by range [it, end).

### deque.cpp
```cpp
#include <iostream>
#include <deque>
#include <vector>
//https://www.geeksforgeeks.org/deque-cpp-stl/

using namespace std;

void printDeque(deque <int> g)
{
    deque <int> :: iterator it;
    for (it = g.begin(); it != g.end(); ++it)
        cout << '\t' << *it;
    cout << '\n';
}

int main()
{
    deque <int> gquiz;

    gquiz.push_back(10);
    gquiz.push_front(20);
    gquiz.push_back(30);
    gquiz.push_front(15);

    cout << "The deque gquiz is : ";
    printDeque(gquiz);

    cout << "\ngquiz.size() : " << gquiz.size(); //current number of elements
    cout << "\ngquiz.max_size() : " << gquiz.max_size(); //number of elements deque_can hold

    cout << "\ngquiz.at(2) : " << gquiz.at(2);
    cout << "\ngquiz.front() : " << gquiz.front();
    cout << "\ngquiz.back() : " << gquiz.back();

    cout << "\ngquiz.pop_front() : ";
    gquiz.pop_front();
    printDeque(gquiz);

    cout << "\ngquiz.pop_back() : ";
    gquiz.pop_back();
    printDeque(gquiz);

    return 0;
}
```
Output (tabs between elements):
```
The deque gquiz is : 	15	20	10	30

gquiz.size() : 4
gquiz.max_size() : 4611686018427387903
gquiz.at(2) : 10
gquiz.front() : 15
gquiz.back() : 30
gquiz.pop_front() : 	20	10	30

gquiz.pop_back() : 	20	10
```
`max_size()` is platform dependent: never predict it; the lesson copy should drop that line.

### priorityqueue/main.cpp
```cpp
//code from https://www.geeksforgeeks.org/priority-queue-in-cpp-stl/
#include <iostream>
#include <queue>

using namespace std;

void showpq(priority_queue <int> gq)
{
    priority_queue <int> g = gq;
    while (!g.empty())
    {
        cout << '\t' << g.top();
        g.pop();
    }
    cout << '\n';
}

int main ()
{
    priority_queue <int> gquiz;

    gquiz.push(10);
    gquiz.push(30);
    gquiz.push(20);
    gquiz.push(1);
    gquiz.push(5);

    cout << "The priority queue gquiz is : ";
    showpq(gquiz);

    cout << "\ngquiz.size() : " << gquiz.size();
    cout << "\ngquiz.top() : " << gquiz.top();

    cout << "\ngquiz.pop() : ";
    gquiz.pop();
    showpq(gquiz);

    return 0;
}
```
Output: `The priority queue gquiz is : 	30	20	10	5	1` / blank / `gquiz.size() : 5` / `gquiz.top() : 30` / `gquiz.pop() : 	20	10	5	1`. Largest first (max-heap by `operator<`); `showpq` takes a copy so popping it does not empty the original.

### typedefs/main.cpp
```cpp
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
Output: `change int_t through int_ref reference: ` / `99` / `100` / `Foo x val: 99` / `vector contents: ` / `1` / `2` / `3` / `4` / `5`. Warnings: `for (myIter; …)` "statement has no effect", unused `intPtr` and `arrT`.

### iterator.cpp
```cpp
#include <iostream>
#include <list> //bidirectional iterator
#include <forward_list>
#include <vector>

using namespace std;
int main() {
//    forward_list <int> forward = {1,2,3,4,5};
//    forward_list <int>::iterator fi = forward.begin(); //forward iterator
//
//    fi++; //points at 2
//    cout << *fi << endl;
//    //fi--; //can't decrement forward iterator

    list <int> container = {1,2,3,4,5};
    list <int>::iterator itBegin = container.begin(); //birectional iterator
    list <int>::iterator itEnd = container.end(); //bidirectional iterator

    *itBegin = 999; //assign using iterator
    cout << "first: " << *itBegin << endl;

    for(auto i = container.begin(); i != container.end(); ++i)
    {
        cout << *i << " ";
    }
    cout << endl;

//    itBegin is pointing to first element
//    it is pointing at 999
//    after assignment, itBegin++ happens
//    itBegin points at next element, which is 2
    list <int>::iterator it = itBegin++; //makes a copy of current iterator then moves to next position

//    list <int>::iterator it = itBegin;
//    itBegin++;

    //it is pointing to first element
    //itBegin is pointing to second element
    cout << "*it: " << *it << endl;
    cout << "*itBegin: " << *itBegin << endl;
    return 0;
}
```
Output: `first: 999` / `999 2 3 4 5 ` / `*it: 999` / `*itBegin: 2`. Points: `*it = value` writes through the iterator; `it = itBegin++` is the slide-68 postfix row (copy, then advance); the commented forward_list shows `fi--` does not compile on a forward iterator (and `itBegin - 1` or `itBegin + 2` would not compile on a list's bidirectional iterator).

### randomAccessIterator/main.cpp
```cpp
#include <iostream>
#include <vector>

using namespace std;

void print(vector<string> v)
{
    for(auto i : v)
    {
        cout << i << " ";
    }
    cout << endl;
}

int main() {
    vector<string> v ={"a","b","c","d","e","f"};
    print(v);
    //vector<string>::iterator
    auto nearEndIt = (v.end() - 1); //get new iterator from iterator subtraction

    cout << "v.begin(): " << *(v.begin()) << endl;
    cout << "++v.begin(): " <<  *(++v.begin()) << endl; //pre-increment iterator
    cout << "v.begin() + 3: " <<  *(v.begin() + 3) << endl; //move iterator with +
    cout << "v.end() - 1: " << *nearEndIt << endl;
    cout << "v.end() - nearEndIt: " << v.end() - nearEndIt << endl; //subtract iterators to get difference_type

    cout << ((nearEndIt < v.end()) ? "TRUE" : "FALSE") << endl;

    vector<string>::iterator midIt = v.begin()+3;
    *midIt = "z"; //same as v[3] = "z";
    print(v);

    //show iterators are not pointers, can't print out iterator directly
    string *ptr = new string{"a"};

    cout << "deference ptr: " << *ptr << endl;
    cout << "address of ptr:  " << &ptr << endl;
    cout << "value of ptr: " << ptr << endl;

    cout << endl;
    cout << "address of iterator: " << &midIt << endl;
    cout << "dereference iterator: " << *midIt << endl;
    //cout << midIt << endl; //error can't print out iterator

    return 0;
}
```
Output (addresses vary per run):
```
a b c d e f 
v.begin(): a
++v.begin(): b
v.begin() + 3: d
v.end() - 1: f
v.end() - nearEndIt: 1
TRUE
a b c z e f 
deference ptr: a
address of ptr:  0xd2791ff698
value of ptr: 0x1e2914226a0

address of iterator: 0xd2791ff6a0
dereference iterator: z
```
For a predict prompt use only the first eight lines (drop the pointer section or print without addresses). The `new string` is never deleted (leak).

### partitionOdd.cpp
```cpp
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
Output: `odd elements: 1 9 3 7 5` / `even elements: 6 4 8 2 10` (matches slide 101 exactly).

### partition.cpp (cities)
```cpp
#include <algorithm>
#include <cmath>
#include <ctime>
#include <functional>
#include <iostream>
#include <list>
#include <random>
#include <string>
#include <utility>
/*
 * partition re-orders cities so cities that have a distance
 * less than DISTANCE appear first
*/

using namespace std;

constexpr int POPULATION = 10;
constexpr double DISTANCE = 50;

struct city
{
	static int counter;
	int number;
	std::pair<double, double> coordinates;
	city(std::pair<double, double> coordinates) :
	    number{++counter}, coordinates{ coordinates } { }
	city(double x, double y) :
	    number{++counter} , coordinates{ std::make_pair(x, y) } { }
	friend std::ostream& operator<<(std::ostream& out, const struct city& s);
};

int city::counter = 0;

std::ostream& operator<<(std::ostream& out, const struct city& s) {
	out << s.number << " (" << s.coordinates.first << ", " << s.coordinates.second << ")";
	return out;
}

typedef struct city city;

double distance(city candidate) {
	return std::sqrt( pow(candidate.coordinates.first, 2)
		+ pow(candidate.coordinates.second, 2));
}

bool close_to_origin(city candidate)
{
	if (DISTANCE > distance(candidate)) {
		return true;
	}
	return false;
}

void print(city candidate)
{
	std::cout << candidate << " " << distance(candidate) << std::endl;
}

int main()
{
    //setup random number generator
	double lower = 0.0;
	double upper = 100.0;
	std::default_random_engine generator(time(0));
	std::uniform_real_distribution<double> distribution(lower, upper);

	//create cities with random coordinates and push to cities list
	std::list<city> cities;
	for (int i = 0; i < POPULATION; ++i) {
		city newcity(distribution(generator), distribution(generator));
		cities.push_back(newcity);
	}

	//print cities, partition them, and print again
	for_each(cities.begin(), cities.end(), print);
	cout << "\n\n";
	auto firstFalseCityItr = partition(cities.begin(), cities.end(), close_to_origin); //cities where DISTANCE > actual distance appear first
	cout << "First false city: " << firstFalseCityItr->number << endl;
	cout << "Cities before false city have distance " << DISTANCE << endl;
	for_each(cities.begin(), cities.end(), print);
}
```
One recorded run (random each time): ten cities numbered 1–10 with coordinates and distances; after partition the two cities within 50 of the origin (1 at 12.78 and 3 at 34.68) came first, `First false city: 2`. Teaching points: `std::list` has only bidirectional iterators, and partition still works (it needs ForwardIt); `for_each(begin, end, print)` applies a function to every element; `static int counter` numbers the cities; `std::pair<double,double>` holds coordinates; the `DISTANCE > distance(candidate)` predicate is the unary predicate. For the lesson, seed with a constant (`generator(42)`) or hand-pick coordinates so the output is predictable, and say so.

### date/Date.hpp, Date.cpp, DateTester.cpp (activity 2)
Date.hpp: `class Date { public: Date(int year = 2018, int month = 1, int day = 1); // Use compiler-generated copy constructor, destructor, and assignment operator because we are just storing three primitive data members  int get_year() const { return year; } // implicitly inline  get_month, get_day; Date set_date(int year, int month, int day); // returns previous date  bool is_leap_year() const { return is_leap_year(year); } // define statics in the class implementation file  static bool is_leap_year(int year); static bool is_valid_date(int year, int month, int date); static Date today(); // no *this pointer  friend std::ostream& operator<<(std::ostream&, const Date&); friend std::istream& operator>>(std::istream&, Date&); Date& operator++(); //prefix  Date operator++(int); // postfix  Date& operator--(); Date operator--(int); friend bool operator==, !=, <, >, >=, <=(const Date& lhs, const Date& rhs); //friend bool compare(const Date lhs, const Date rhs); private: int year, month, day; static const int days_in_regular_year[]; static const int days_in_leap_year[]; };` (the header lacks `#include <iostream>`; it compiles because Date.cpp and DateTester.cpp include `<iostream>` first).

Date.cpp (key parts): `const int Date::days_in_regular_year[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31}; const int Date::days_in_leap_year[] = { 0, 31, 29, …};` constructor `: year{year}, month{month}, day{day} { if (!is_valid_date(year, month, day)) { throw std::invalid_argument("Date::Date(int, int, int): invalid argument"); } }`; prefix `operator++` rolls day → month → year using the right days table and returns `*this`; postfix `operator++(int)` does `Date copy(*this); ++*this; return copy;`; `operator--` symmetric; `set_date` validates (throws `invalid_argument("Date::set_date(int, int, int): invalid date")`), saves a copy, assigns, returns the copy; `is_leap_year(int year)`: `if (year % 400 == 0) return true; if (year % 100 == 0) return true; if (year % 4 == 0) return true; return false;` (**bug**: a century year not divisible by 400 should return false); `is_valid_date`: `1 <= month && month <= 12 && 1 <= day && day <= days[month]`; `today()` from `localtime`; `operator<<` prints `year/MM/DD` with `setfill('0')` and `setw(2)` through an `ostringstream`; `operator>>` reads a token `y/m/d`, validates, else sets `failbit`; `operator==` compares the three members; `operator!=` is `!operator==(lhs, rhs)`; **`operator<` is the stub `// INSERT YOUR CODE HERE  return false;`**; `operator>` is `operator<(rhs, lhs)`; `operator>=` is `!operator<(lhs, rhs)`; `operator<=` is `!operator>(lhs, rhs)` (the Week 4 canon).

DateTester.cpp:
```cpp
#include <functional>
#include <iostream>
#include <queue>
#include "Date.hpp"

// custom comparison function that is a
// binary predicate
bool compare(const Date& lhs, const Date& rhs)
{
	return lhs < rhs;
}

// a functor
struct cmp
{
	bool operator()(const Date& lhs, const Date& rhs) {
		return lhs < rhs;
	}
};

template<typename T> void print_queue(T& q) {
    while(!q.empty()) {
        std::cout << q.top() << " ";
        q.pop();
    }
    std::cout << '\n';
}

int main() {

	try{
		Date d(-1, -1, -1);
	}
	catch( std::invalid_argument& e) {
		std::cout << e.what() << std::endl;
	}

	Date today = Date::today();
	std::cout << today << std::endl;

	// Using operator<() defined in class
	std::priority_queue<Date> dates1;

	// Using custom binary predicate
	std::priority_queue<Date, std::vector<Date>, std::function<bool(Date, Date)> > dates2{compare};

	// Using functor
	std::priority_queue<Date, std::vector<Date>, cmp> dates3;


	Date a{2018, 1, 1};
	Date b{2017, 1, 1};
	Date c{2016, 6, 30};

	dates1.push(a);
	dates1.push(b);
	dates1.push(c);
	print_queue(dates1);

	dates2.push(a);
	dates2.push(b);
	dates2.push(c);
	print_queue(dates2);

	dates3.push(a);
	dates3.push(b);
	dates3.push(c);
	print_queue(dates3);

	return 0;
}
```
Output as shipped (stub `operator<`), run on 2026-10-12: `Date::Date(int, int, int): invalid argument` / `2026/10/12` / `2018/01/01 2017/01/01 2016/06/30 ` (three times). Because a, b, c are pushed newest-first, the stub and a correct `operator<` print the same thing. Model answer for the activity: `bool operator<(const Date& lhs, const Date& rhs) { if (lhs.year != rhs.year) return lhs.year < rhs.year; if (lhs.month != rhs.month) return lhs.month < rhs.month; return lhs.day < rhs.day; }` (irreflexive, antisymmetric, transitive). Verified with `ex_date_fixed.cpp`, pushing c, a, b: correct operator → `2018/01/01 2017/01/01 2016/06/30` for all three queues (max-heap: largest, i.e. latest, date on top); the always-false stub → `2016/06/30 2018/01/01 2017/01/01`. What main does: constructs an invalid date to show the throw; prints today; builds three priority queues that order Dates in the three slide-36 ways (member/friend `operator<`, a binary predicate passed through `std::function`, a functor type `cmp`); pushes three dates into each and drains them largest-first.

### Extra verified programs (`$S\build\`)
- `ex_auto_for.cpp`, `ex_vector21.cpp`, `ex_mypair_set.cpp`, `ex_partition_trace.cpp`, `ex_date_fixed.cpp`: above.
- `ex_adaptors.cpp`: `stack top 3 size 3` (LIFO), `queue front 1 back 3` (FIFO), `priority_queue top 30`, `set: 1 3 5 size 3` (sorted, unique), `multiset: 1 1 3 5 count(1)=2`, `map: a=1 b=20` (`m["b"] = 20` overwrote 2), `insert a again -> false, a=1`, `list: 0 1 2 3 4` (push_front/push_back).

## 3522 Week 62.pdf
Source: `D:\BCIT\COMP3522\Lectures\Week 6\3522 Week 62.pdf` (text in `Lectures\txt\3522 Week 62.txt`), the re-posted Week 6 deck, diffed against Week 61. Nine changes:
1. `auto` slide reflowed only: "Pair, map" became "pair, Map", "value_type of a map is a Pair" became "...a pair". No edit.
2. Typedef code fixed: the stray `it` tokens are gone. The slide now reads `pair <map<string, string>::iterator, map<string, string>::iterator> pairMapIters;` and `typedef map<string, string>::iterator mapIterator;`, the corrected form the lessons (05, 03, cheat sheet) already use, and adds a reference to `*multi_map.cpp` (already covered in lesson 03). No edit.
3. Restaurant slide: "name/alias for their internal implementation" became "...their specific internal implementation". No edit.
4. The "5 kinds of iterators" slide now says where to access each kind: "1. Input: istream_iterator; 2. Output: ostream_iterator; 3. Forward: forward_list, unordered_map; 4. Bidirectional: list, map, set etc; 5. Random Access: vector, deque, array etc". Lesson 07 (slide-wording paragraph and the "Which container gives which kind" table) and the cheat-sheet iterator table now include `unordered_map` as forward.
5. Forward-iterator slide gained "there is not a single type of forward iterator, either. Each container defines its own specific iterator type...". Already implied; no edit.
6. Bidirectional slide: "Multi-pass bidirectional direction sequential output" became "Multi-pass bidirectional sequential output". Lesson 07 already uses the new wording.
7. Types of algorithms: new sub-bullets "Won't modify element order" under "1. Sequential, non-modifying (find(), for_each())" and "Will modify element order" under "2. Sequential, modifying (copy(), remove_if())". Added to the family tables in lesson 08 and the cheat sheet.
8. Partition slide: new signature line `iter = partition(container.begin(), container.end(), compareFunc)`; parameter 3 ends "returns a Boolean. (Predicate)"; the IsOdd slides add "(Predicate)" twice; "p is our function IsOdd()" became "p is our IsOdd() function". Lessons already agree.
9. Partition walkthrough: the `{1,2,3,4,5}` annotations moved and the swap comment was reworded. No edit.
