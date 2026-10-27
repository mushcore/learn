---
title: One-page cheat sheet (Week 6)
minutes: 10
---

Everything Quiz 6 can ask, in tables. Read this last, on the way to the lab; it is also the Week 6 block of your midterm sheet.

## auto

| Form | What auto does | Slide verdict |
|---|---|---|
| `auto d = 5.0;` `auto i = 1 + 2;` `auto sum = add(5, 6);` | deduced from the initializer: double, int, int | fine: the object is right there |
| `auto a;` | nothing to deduce from | ERROR, auto requires initializer |
| `void add_and_print(auto x, auto y)` | can't infer parameter types | can't be used with function parameters (C++20 g++ accepts it as a template; the quiz follows the slide) |
| `auto add(int x, int y) { return x + y; }` | deduced from the return statements | works, but discouraged: you have to dig into the function |
| `auto add(int x, int y) -> int;` | **no type inference**: syntax for a trailing return type | used so a column of declarations lines up |

## The ranged for (Java's for-each)

| Loop variable | Element is | Can modify the container? |
|---|---|---|
| `for (const int i : v)` / `for (auto i : v)` | a copy | no |
| `for (const int& i : v)` | a const reference (no copy) | no |
| `for (int& i : v)` | a reference | yes: `k *= 10` changes v |

The initializer may be a braced-init-list `for (int n : {0, 1, 2})` or an array `int a[] = {...}; for (int n : a)`; the loop variable doesn't have to be used. `for (int i = 0; i < v.size(); i++)` compares int with an unsigned `size_type` (warning); write `vector<int>::size_type i`.

## The STL in three parts

| Part | Slide definition | Examples |
|---|---|---|
| Containers | classes that store objects and data | vector, map, set |
| Iterators | used for working on a sequence of values | `vector<int>::iterator` |
| Algorithms | functions specially designed to be used on a range of elements | `partition`, `find`, `sort` |

- **Value semantics**: containers get a **copy** of the object, so the element class needs a copy constructor, an assignment operator and a destructor.
- The STL performs **almost no checking**: the programmer meets the preconditions (`*end()` is undefined behaviour, not an exception).
- **Half-open ranges** [included, not included): array size 5 is `array[0,5)`; `[begin(), end())`.
- `c.insert(x)` for an associative container, `c.insert(position, x)` for a sequence container, `c.begin()` first element, `c.end()` one past the end.

## Container categories

| Category | Members | Header | Order | Search |
|---|---|---|---|---|
| Sequence | array, vector, deque, list, forward_list | `<array>` `<vector>` `<deque>` `<list>` `<forward_list>` | we specify the order | linear (vector/deque/array index in O(1)) |
| Associative | set, multiset, map, multimap | `<set>` `<map>` | automatically sorted by a comparison function (BST) | O(log n) |
| Unordered associative | unordered_set, unordered_multiset, unordered_map, unordered_multimap | `<unordered_set>` `<unordered_map>` | stored using a hash | O(1), O(n) worst case |

`vector`: `v.insert(v.begin() + 3, -4)` inserts **before** position 3; `v.erase(v.begin() + 1)` shifts the rest left; `vector<int> v3 {a, a + 5}` copies [a, a+5); members `empty size capacity clear insert push_back pop_back front back`. `deque` adds `push_front`, `pop_front`, `at`.

## First-class containers and adaptors

| First-class | Adaptor | Default implementation | Order out |
|---|---|---|---|
| vector, list, deque, map/multimap, set/multiset | `stack` | deque | LIFO: `top`, `push`, `pop` |
| | `queue` | deque | FIFO: `front`, `back`, `push`, `pop` |
| | `priority_queue` | vector | **largest first** (max-heap by `operator<`): `top`, `push`, `pop` |

## pair, map, multimap, set, multiset

```cpp
pair<int, double> p(1, 3.14);  p.first; p.second;        // <utility>
pair<char, char> p2 = make_pair('a', 'b');
map<string, string> m;                                     // <map>: sorted, 1-to-1, unique keys, O(log n)
m.insert(pair<string, string>("Tom", "604-123-4567"));     // 1. a pair
m.insert(map<string, string>::value_type("Tom", "..."));   // 2. value_type IS a pair
m.insert(make_pair("Tom", "..."));                         // 3. make_pair; returns {it, false}: key exists, nothing changes
m["Tom"] = "...";                                          // [] inserts a default or OVERWRITES
auto it = m.find("Tom");  it->first;  it->second;          // find returns end() if missing
multimap<string, string> mm;                               // duplicate keys kept, sorted by key, insertion order within a key; no []
mm.count("Tom");  mm.find("Tom");                          // method 1: find + count
pair<mapIterator, mapIterator> r = mm.equal_range("Tom");  // method 2: [first Tom, one past last Tom)
set<int> s = {5, 1, 3, 1};                                 // <set>: 1 3 5, unique, sorted, elements are const
multiset<int> ms;  ms.erase(it);  ms.erase(40);  ms.erase(it, ms.end());   // one element / ALL 40s / a range
```

## Strict weak ordering (the Compare concept)

A type satisfies Compare if it is a **BinaryPredicate** (returns true/false) and induces a **strict weak ordering**:

| Rule | Slide wording |
|---|---|
| Irreflexivity | `lessThan(x, x) == false` (x can not be less than itself) |
| Antisymmetry | if `lessThan(x, y)` then `!lessThan(y, x)` |
| Transitivity | if `lessThan(x, y)` and `lessThan(y, z)` then `lessThan(x, z)` |

`<=` breaks irreflexivity. Elements that are neither less nor greater are **equivalent**: with `operator<` by sum, `{2,1}` is not inserted after `{1,2}`.

| Three ways to define it | DateTester.cpp |
|---|---|
| 1. `operator<(const Obj& lhs, const Obj& rhs)` | `std::priority_queue<Date> dates1;` |
| 2. a custom comparison function that is a binary predicate | `priority_queue<Date, vector<Date>, function<bool(Date, Date)>> dates2{compare};` |
| 3. `operator()` in a separate struct: a **functor** (object that behaves like a function) | `struct cmp { bool operator()(const Date& l, const Date& r) {...} };` `priority_queue<Date, vector<Date>, cmp> dates3;` |

## typedefs and the standard container typedefs

```cpp
typedef int int_t;                 // int_t is an alias for int
typedef int arr_t[3];              // arr_t is array of 3 int
typedef int& reference;  typedef int* pointer;
typedef struct Foo Foo;            // C habit, unnecessary in C++
typedef map<string, string>::iterator mapIterator;  pair<mapIterator, mapIterator> pairIters;
```

Restaurant analogy: every restaurant `typedef`s its own menu as `menu`; every container typedefs its own iterator as `iterator` (vector: `typedef RandomAccessIterator iterator`; map and set: `typedef BiDirectionalIterator iterator`). If we create a container we should implement these:

| typedef | Meaning |
|---|---|
| `size_type` | **unsigned** integer, large enough for the size of any object of that class; in all first-class containers and adaptors |
| `value_type` | element type (a map's is a pair) |
| `iterator` | the default iterator for the container |
| `const_iterator` | prevents modification of the **elements** during iteration |
| `reverse_iterator` | starts at the last element with `rbegin()`; `++` moves towards the beginning; ends at `rend()` |
| `const_reverse_iterator` | a const reverse iterator |
| `pointer`, `reference`, `const_reference` | pointer / reference to an element |
| `difference_type` | the result of `it1 - it2` |

## Iterators: begin and end

An iterator is an object that points to some element in a range, can iterate through the range, and has `++` and `*`. `end()` is **one past the last element**: never dereference it. `{9}`: pass 1 prints 9, pass 2 `itBegin == itEnd`, leave. `{}`: `begin() == end()` at once, zero passes. Algorithms are called as `some_algorithm(iterBegin, iterEnd, func)`.

## The five kinds of iterator

| Kind | Passes | Read | Write | `++` | `--` | `+ n`, `- n`, `+=`, `i - j`, `i[n]`, `<` | Containers |
|---|---|---|---|---|---|---|---|
| Input | single | yes | no | yes | no | no | istream_iterator |
| Output | single | no | yes | yes | no | no | ostream_iterator |
| Forward | multi | yes | yes | yes | no | no | forward_list, unordered_map |
| Bidirectional | multi | yes | yes | yes | yes | no | list, set, multiset, map, multimap |
| Random access | multi | yes | yes | yes | yes | yes | vector, deque, array |

| Expression | Returns | Equivalent |
|---|---|---|
| `i != j` | bool | `!(i == j)` |
| `i->m` | m | `(*i).m` |
| `i++` | It | `It temp = i; ++i; return temp;` |
| `*i++` | value_type | `value_type x = *i; ++i; return x;` |
| `i--`, `*i--` | It, value_type | bidirectional and above |
| `i + n`, `i - n` | It | `It temp = i; return temp += n;` (random access only) |
| `i - j` | difference_type | random access only |
| `i[n]` | value_type | `*(i + n)` |

`list<int>::iterator it = l.begin() + 2;` does not compile (no `operator+`); `fi--` on a forward_list does not compile. `it = itBegin++` copies the old position, then advances itBegin.

## Algorithms

A function used on a range of elements, always `[first, last)`, **does not change the size of the container**, works with iterators or pointers. `<algorithm>` for most, `<numeric>` for the generalized numeric operations.

| Family | Examples |
|---|---|
| 1. sequential, non-modifying: won't modify element order | `find()`, `for_each()` |
| 2. sequential, modifying: will modify element order | `copy()`, `remove_if()` |
| 3. partitioning | `partition()`, `is_partitioned()` |
| 4. sorting | `sort()`, `is_sorted()` |
| 5. binary search | `binary_search()` |
| 6. merge | `merge()`, `inplace_merge()` |
| 7. heap | `make_heap()`, `push_heap()` |
| 8. min/max | `min()`, `max()` |
| 9. generalized numeric operations | `<numeric>` |

## std::partition

```cpp
iterBound = partition(v.begin(), v.end(), IsOdd);   // 1. first, 2. one past last, 3. unary predicate -> bool
// before {1,2,3,4,5,6,7,8,9,10}   after {1,9,3,7,5,6,4,8,2,10}   iterBound -> 6
template<class ForwardIt, class UnaryPredicate>
ForwardIt partition(ForwardIt first, ForwardIt last, UnaryPredicate p)
{
    first = std::find_if_not(first, last, p);          // find first false
    if (first == last) return first;
    for (ForwardIt i = std::next(first); i != last; ++i)
        if (p(*i)) { std::iter_swap(i, first); ++first; }
    return first;
}
```

- All "true" elements precede the "false" elements; **relative order is not maintained** (`stable_partition` keeps it: 1 3 5 7 9 2 4 6 8 10).
- Returns an iterator to the **first element of the false group**, or `end()` if there are none. All false: `begin()`. Odd group `[begin, iterBound)`, even group `[iterBound, end)`.
- Trace {1,2,3,4,5}: first → 2; i=3 swap → 1 3 2 4 5, first → 2; i=4 skip; i=5 swap → **1 3 5 4 2**, first → 4. Trace {2,1,4,3}: 2 1 4 3 → 1 2 4 3 → 1 3 4 2, bound → 4.
- partition.cpp: a `std::list<city>` (bidirectional is enough, ForwardIt required), `for_each(begin, end, print)`, predicate `close_to_origin`, `firstFalseCityItr->number`.

## Date's operator< (activity 2)

```cpp
bool operator<(const Date& lhs, const Date& rhs) {
    if (lhs.year != rhs.year)   return lhs.year  < rhs.year;
    if (lhs.month != rhs.month) return lhs.month < rhs.month;
    return lhs.day < rhs.day;
}
bool operator>(const Date& l, const Date& r)  { return operator<(r, l); }
bool operator>=(const Date& l, const Date& r) { return !operator<(l, r); }
bool operator<=(const Date& l, const Date& r) { return !operator>(l, r); }
```

Most significant field first, fall through on ties. `lhs.year < rhs.year || lhs.month < rhs.month || ...` breaks antisymmetry. A `priority_queue<Date>` drains latest first: `2018/01/01 2017/01/01 2016/06/30`; the shipped always-false stub gives `2016/06/30 2018/01/01 2017/01/01` when pushed c, a, b.

:::quiz Fifteen true or false (answers at the bottom)
1. `auto a;` compiles and gets its type from the first assignment.
2. In `auto f() -> int;` auto performs type inference.
3. `for (int k : v) k *= 10;` changes v.
4. Containers store copies of the objects put into them.
5. `[0, 5)` includes index 5.
6. `stack` and `queue` default to a deque; `priority_queue` to a vector.
7. `map::insert` with an existing key overwrites the value.
8. A multimap keeps equal keys in insertion order.
9. Set elements can be edited in place through an iterator.
10. `<=` is a valid strict weak ordering.
11. `size_type` is unsigned.
12. `rbegin()` points to the last element.
13. `list<int>::iterator` supports `it + 2`.
14. `partition` returns an iterator to the first false element.
15. `partition` preserves relative order.

Answers, in order: F F F T F · T F T F F · T T F T F
:::

```quiz
[
  {
    "q": "Rapid fire: which container is searched in O(log n)?",
    "options": ["vector", "unordered_map", "map", "deque"],
    "answer": 2,
    "explain": "Associative containers (set, multiset, map, multimap) are automatically sorted and searched in O(log n); unordered ones hash in O(1), O(n) worst case; sequence containers are searched linearly."
  },
  {
    "q": "`priority_queue<int>` after pushing 10, 30, 20, 1, 5: `top()` is...",
    "options": ["10", "1", "5", "30"],
    "answer": 3,
    "explain": "Largest first. The default container underneath is a vector kept as a max-heap by operator<."
  },
  {
    "q": "Which iterator kind is the first to support `--`?",
    "options": ["forward", "bidirectional", "input", "random access"],
    "answer": 1,
    "explain": "Input, output and forward iterators only go forwards. Bidirectional adds `--`; random access adds `+ n`, `- n`, `i - j`, `[n]` and `<`."
  },
  {
    "q": "A map's `insert` for a key that already exists returns...",
    "options": ["a pair whose `.second` is false, and changes nothing", "an iterator to the new element", "true", "an exception"],
    "answer": 0,
    "explain": "Keys must be unique. The returned pair is {iterator to the existing element, false}; `m[key] = value` is the way to overwrite."
  },
  {
    "q": "In the slide's implementation of partition, after `std::find_if_not(first, last, p)` the iterator `first` points to...",
    "options": ["the last true element", "the end of the range", "the first element for which p is false", "the first element for which p is true"],
    "answer": 2,
    "explain": "Everything before it is already in the true group. The loop then swaps each later true element into position first and advances first, which ends up as the returned bound."
  }
]
```
