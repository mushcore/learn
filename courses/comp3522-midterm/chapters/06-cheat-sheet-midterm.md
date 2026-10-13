---
title: Double-sided cheat sheet (Weeks 1 to 6, Week 7 pending)
minutes: 25
---

One page, double sided, handwritten or printed in Arial 10 or larger. Side 1 is Weeks 1 to 3, Side 2 is Weeks 4 to 6 with a space for Week 7. Every line is a fact from the weekly lessons; copy what you still get wrong and skip what you know.

## Side 1: Weeks 1 to 3

### Week 1: syntax, types, streams

| Fact | Detail |
|---|---|
| `::` vs `.` | `::` scope resolution: namespace or class member (`std::cout`, `Circle::area`, `Base::f()`); `.` member of an object (`c.area()`); `->` through a pointer |
| header / source | `.hpp` declarations (`int add(int, int);`, `#pragma once`); `.cpp` definitions; never `#include` a `.cpp`; declared but not defined = linker error |
| `using` | `using namespace std;` all names from that line; `using std::cout;` one name; inside a function: that function only |
| `main` | returns `int`; omitting `return` still compiles (implicit 0); directives end at the newline, no `;` |
| sizes | `bool` 1, `char` 1 (an integer type, `'A'` is 65), `short` 2, `int` 4, `long` 4 on Windows, `long long` 8, `float` 4, `double` 8, `long double` 16 |
| initialization | `int x = 0;` (C-like), `int x(0);` (constructor), `int x{0};` (uniform, C++11, **preferred: narrowing is a compile error**; `int y{3.7}` fails, the other two truncate) |
| integer maths | `int / int` truncates toward zero (`7/2` is 3, `-7/2` is -3); `%` takes the sign of the left operand; one `double` operand promotes: `(double)a / b`, not `(double)(a / b)` |
| `++` | `x++` yields the old value then increments; `++x` increments first; `&&` and `\|\|` short-circuit |
| casting | `(int)2.25` is 2: truncates, never rounds |
| constants | `#define PI 3.14` preprocessor, no `;`; `const int n = f();` must be initialized, may come from run time; `constexpr` must be known at compile time |
| manipulators | `setw` next field only, everything else sticky; `setw`, `setfill`, `setprecision` need `<iomanip>`; default precision 6 significant digits; `fixed` then `setprecision(2)` gives decimals; `boolalpha` prints `true`; `hex`/`oct`/`dec`, `showbase`, `showpos`, `left`/`right`/`internal` |
| stream state | `fail()` failbit or badbit; `eof()`; `good()` no bits; `while (cin >> n)` stops on bad input or EOF; a failed `int` read stores 0 since C++11 (older slides say the variable is unchanged); `if (cin)` is false only for failbit or badbit, eofbit alone keeps it true |
| recovery | `cin.clear(); cin.ignore(numeric_limits<streamsize>::max(), '\n');` (`<limits>`) |

### Week 2: files, pointers, memory

| Fact | Detail |
|---|---|
| file streams | `<fstream>`: `ifstream` (fails if missing), `ofstream` (creates or **truncates**), `fstream`; `if (!f.is_open()) { cerr << "Unable to open file"; exit(1); }`; `close()` also runs in the destructor |
| open modes | `in`, `out` (alone truncates), `app` (to the end before every write), `trunc`, `ate` (to the end once on opening), `binary`; combine with `\|` |
| seeking | `tellg`/`seekg` input, `tellp`/`seekp` output (wrong one = compile error); `seekp(pos)` or `seekp(offset, ios::beg\|cur\|end)`; on `Hello World` (11 chars): `seekp(6)` 6, `seekp(4, ios::beg)` 4, `seekp(-4, ios::end)` 7, then `seekp(-6, ios::cur)` 1; `ofstream` without `app` opens at 0 because it truncated |
| pointer vs reference | pointer holds an address, may be null, may be re-pointed, `*p` to reach the value; reference is another name, must be initialized, never re-seated, `ref = m` writes into the referent |
| `&` and `*` | type on the left (`int& r`, `int* p`) declares; `&x` address-of; `*p` dereference; `&p` on a `string* p` is a `string**` (the address of the pointer itself), `*p` is the string |
| passing | by value copies (callee cannot change the caller's variable); by pointer `swap(&a, &b)` with `int*`; by reference `swap(a, b)` with `int&`; `const T&` = no copy and no change; never return a reference to a local |
| `getline` | `getline(cin, s)` reads a line, tosses the newline, returns the stream; after `cin >> n` the newline is still in the buffer, so the next `getline` is empty (fix: `cin.ignore(...)`); `while (getline(in, line))` idiom |
| `istringstream` | `<sstream>`: `istringstream iss(line); iss >> n >> word;` splits a line; a fresh stream per line needs no `clear()` |
| `vector` | `<vector>`: `push_back`, `size()`, `v[i]` unchecked, `at(i)` throws `out_of_range`, `erase(v.begin() + 1)`, `clear()`, `for (int x : v)`; capacity doubles 1, 2, 4, 8 |
| `new`/`delete` | heap, manual: `int* p = new int{5}; delete p;` and `int* a = new int[n]; delete[] a;`; forgetting = leak (no garbage collector); after `delete` the pointer dangles (set `nullptr`) |
| leak pattern | `i = new int{11}; a = new int{99}; i = a;` loses the 11 block; order: `delete i; i = a;` |
| `rand` | `srand(time(NULL))` once; `rand() % 100 + 1` is 1 to 100; `<random>`: `uniform_int_distribution<> d(a, b)` inclusive |

### Week 3: classes, constructors, inheritance

| Fact | Detail |
|---|---|
| `struct` vs `class` | identical except the default: struct members public, class members private (same for default inheritance) |
| access | public anywhere; protected the class and derived classes; private the class only (and friends) |
| constructor | no return type, not even `void`; declaring any constructor removes the compiler's default one; `Circle c();` is a function prototype (most vexing parse), `Circle c{};` is safe |
| initializer list | `Circle(int r) : radius(r) { }`; members initialize in **declaration order**, whatever the list says; class-type members not listed are default-constructed before the body; same names allowed `: r(r), i(i)` |
| default args | trailing parameters only, written in the header prototype; `Complex(double r = 0, double i = 0)` is also a default constructor |
| `const` member | `int get() const;` promises not to change the object; only const members may be called on a const object or through a `const T&`; use it on every getter |
| copy constructor | `T(const T& other)`: `const` to copy immutable objects, `&` to avoid infinite recursion; runs on `T b(a);`, `T b = a;`, pass by value, return by value; **not** on `b = a;` (assignment operator) |
| shallow vs deep | the compiler's copy copies each member: a pointer is shared, its array is not; with a destructor that means double free; deep copy allocates `new double[size]` and copies the elements |
| destructor | `~T()`: no parameters, no return type, one per class; runs at end of scope, on `delete`/`delete[]`, for temporaries at the end of the full expression, for statics at program end; by-value parameters are copied on the call and destroyed on return |
| order | construction: base, then members in declaration order, then the body; destruction exactly reversed; locals die in reverse order of declaration |
| forward declaration | `class Car;` introduces the name: `Car*` and `Car&` allowed, `Car owner;` is an incomplete type; breaks the include cycle, speeds compiles |
| inheritance | `class Bus : public Vehicle`; `Derived(int a) : Base(a) { }` chooses the base constructor, otherwise `Base()` runs; a derived initializer list may name only its own members and direct bases |
| access table | public inheritance keeps public/protected; protected makes both protected; private (the default for `class`) makes both private; private base members are never accessible |
| not inherited | constructors (unless `using Base::Base;`), destructor, friends, private members |
| virtual | `virtual` in the base lets a call through `Base*` or `Base&` run the override: dynamic binding, late binding; `override` makes the compiler check; `d.Base::print()` forces the base version |
| slicing | `Base b = derived;` copies the base part only: calls on `b` run the base version; polymorphism needs pointers or references |
| testing | testing shows a problem exists, debugging finds its source; boundaries 100 to 999 are tested with 50, 100, 500, 999, 1500; `assert` from `<cassert>`, off with `#define NDEBUG` before the include |
| UML | association solid line; generalization solid line with hollow triangle; realization dashed with hollow triangle; dependency dashed arrow; composition filled diamond (parts die with the whole); aggregation hollow diamond |

## Side 2: Weeks 4 to 6

### Week 4: abstract classes, diamonds, friends, operators

| | Interface | Abstract class | Concrete class |
|---|---|---|---|
| functions | only pure virtual | at least one pure virtual (`= 0`, the pure specifier) | none pure virtual |
| destructor | virtual | virtual | virtual if it has children |
| data | none | allowed | allowed |
| `X x;` | no | no | yes |

- No `abstract` keyword. `virtual void g() { } = 0;` is an error. Abstract `A`: `A a;`, `A f();`, `void h(A a);` fail; `A*`, `A&` fine. A derived class stays abstract until it overrides every pure virtual function. Calling a pure virtual function from the abstract constructor is undefined.
- Virtual destructor: `delete basePtr;` runs the derived destructor only if the base destructor is virtual.
- Multiple inheritance: members are the union of all bases; the same name in two bases is ambiguous (`c.A::x`, `bob.mathematician::all_info()`, or override it).

| Diamond | no `virtual` | `virtual` bases, middle classes call `person(name)` | `virtual` bases, most derived calls `person(name)` |
|---|---|---|---|
| person subobjects | 2 | 1 | 1 |
| person constructor | 1-param twice | default once: **name lost** | 1-param once |
| `person::all_info()` in the grandchild | ambiguous | fine | fine |

- Declare `class student : public virtual person` in **both** middle classes. The most-derived class constructs the virtual base: `: person(name), student(passed), mathematician(proved)`; the middle classes' `person(name)` is ignored inside a bigger object but works when a student is built directly.
- Construction: virtual bases first, then direct bases left to right, then members, then the body; destruction reverses it. diamond.cpp: `A B C D allocated`, `D C B A deallocated`; without virtual `A B A C D`, `D C A B A`.
- Friends: declared inside the class (`friend Dollar sum(const Dollar&, const Dollar&);`, `friend class Spy;`), defined anywhere, not a member. Not mutual, not transitive, not inherited; access specifier irrelevant.

| Operator | Member or friend | Signature | Body |
|---|---|---|---|
| `<<` | friend | `ostream& operator<<(ostream& os, const T& o)` | `os << o.x; return os;` |
| `>>` | friend | `istream& operator>>(istream& is, T& o)` | `is >> o.x; return is;` |
| `==`, `<` | friend | `bool operator==(const T& lhs, const T& rhs)` | the real comparison |
| `!=`, `>`, `<=`, `>=` | friend | same shape | `!(lhs == rhs)`, `rhs < lhs`, `!(rhs < lhs)`, `!(lhs < rhs)` |
| prefix `++` | member | `T& operator++()` | increment; `return *this;` |
| postfix `++` | member | `T operator++(int)` (dummy int) | `T tmp(*this); operator++(); return tmp;` |
| `+=` | member | `T& operator+=(const T& rhs)` | add; `return *this;` |
| `+` | friend | `T operator+(T lhs, const T& rhs)` | `lhs += rhs; return lhs;` |
| `=` | member | `T& operator=(T other)` | `mySwap(*this, other); return *this;` |

- Rules: keep the usual meaning; provide the whole set (`+` with `+=`, prefix with postfix); unary and left-modifying operators are members; symmetric binary operators and anything with a stream or a non-class left operand are friendly non-members (`5 + a` works through the one-argument constructor).
- Copy-and-swap: 1. the by-value parameter is built by the copy constructor; 2. swap every member with `std::swap` (never the whole object: infinite recursion); 3. `return *this;`; 4. the parameter dies, freeing the old data. Needs a working copy constructor, destructor and non-throwing swap. Easy errors: parameter by reference, `std::swap` on the whole object, a member missed in the swap. Assignment = replacing the old state with a copy of another object's state; the compiler's `operator=` copies the pointer: leak plus double free.

### Week 5: exceptions and design

| Fact | Detail |
|---|---|
| two tools | assertions detect programming errors; exceptions handle situations that prevent proper continuation and cannot be handled locally |
| error codes | C returned codes (`return 1;` error, `return 0;` success): can be ignored, steal the return value, force out-parameters |
| throw | anything: strings (`throw "msg"` is a `const char*`, not a `string`), numbers, user types, standard exceptions; prefer a type |
| catch | `try { } catch (T& e) { }`; **catch by reference** (a base reference catches derived types; by value slices); the **first matching** handler runs; later handlers of the same or a child type are ignored, so child types first; `catch (...)` catches everything and goes last |
| after catching | print and `exit(EXIT_FAILURE)` (`<cstdlib>`), or rethrow with a bare `throw;` |
| unwinding | leaving a frame destroys its locals in reverse order before the next frame is tried; code after the `throw` and after the failed call never runs |
| uncaught | `std::terminate` (`<exception>`) calls the termination handler, which calls `abort` |
| `noexcept` | `double f(double x) noexcept`: no exception may leave; if one does, the program ends; destructors are implicitly noexcept: never throw from one; C++03 throw lists are deprecated |
| `std::exception` | `<exception>`, base designed to be derived, virtual `what()` returns `const char*`; override: `const char* what() const noexcept override { return "..."; }` |
| hierarchy | `<stdexcept>`: `logic_error` (`invalid_argument`, `length_error`, `out_of_range`), `runtime_error` (`range_error`, `overflow_error`); also `bad_alloc` (new), `bad_cast` (dynamic_cast), `bad_typeid`, `bad_function_call`, `bad_weak_ptr` |
| constructors | a constructor that throws creates no object: no destructor for it, but already-built bases and members are destroyed; `Fraction(int n, int d) : numerator(n), denominator(d) { if (d == 0) throw invalid_argument("Denominator cannot be zero"); }` |
| function-try-block | `C(int x) try : A(), my_b(x) { } catch (...) { throw; }` sees an exception from an initializer; its handler always rethrows |
| coupling | the strength of the connection between modules; aim for loose coupling (understand and change one class alone); tight coupling = cascading changes, hard to test alone |
| cohesion | the glue that holds a module together: one unit, one task; high cohesion = clear names, reuse; applies to functions, classes, modules |
| decoupling | inheritance and interfaces/abstract classes are the most common way (`Filling` under `Sushi`; `DataSource` under `UI`); dependencies remain, keep them weak |
| S | Single Responsibility: each class is responsible for only one thing; one reason to change (`User` stops creating the database and posting) |
| O | Open/Closed: open for extension, closed for modification (`UIWidget::draw() = 0` with `UIButton` overriding instead of an if-chain on `type`) |
| L | Liskov Substitution: objects of type T may be replaced with objects of a subtype S (`vector<UIWidget*>` drawn in one loop) |
| I | Interface Segregation: many client-specific interfaces beat one general-purpose one; no client depends on functions it does not use (`Walkable`, `Swimmable`, `Flyable` instead of one `Animal` with all three); SRP for interfaces |
| D | Dependency Inversion: high-level and low-level modules both depend on abstractions; abstractions do not depend on details (`UI` and `TextFile` both depend on `DataSource`) |
| Demeter | each unit talks only to its friends: no `obj.getX().getY().doSomething()` trainwrecks; `customer.getMoney(amount)` instead of `customer.getWallet().getMoney(amount)` |

### Week 6: auto, STL, iterators, algorithms

| Fact | Detail |
|---|---|
| `auto` | type deduced from the initializer (`auto d = 5.0;` double, `auto i = 1 + 2;` int); `auto a;` is an error; not for parameters (slide rule); allowed as a return type but discouraged; trailing return `auto add(int x, int y) -> int;` is syntax only |
| ranged for | `for (const int& x : v)`, `for (auto x : v)` copies, `for (int& x : v)` modifies; works on braced lists and arrays |
| STL | containers, iterators, algorithms; **value semantics** (containers store copies: element needs copy constructor, assignment, destructor); almost no checking; **half-open ranges** `[first, last)` |
| container kinds | sequence: `array`, `vector`, `deque`, `list`, `forward_list`; associative (sorted, O(log n) search): `set`, `multiset`, `map`, `multimap`; unordered (hash, O(1) to O(n)): `unordered_*` |
| adaptors | `stack` (deque), `queue` (deque), `priority_queue` (vector, largest first by `operator<`); they restrict a first-class container |
| `vector` | `insert(v.begin() + 3, -4)`, `erase(v.begin() + 1)`, `vector<int> v3{a, a + 5}` copies `[a, a+5)`, `front()`, `back()`, `empty()`, `capacity()`, `pop_back()` |
| `pair`, `map` | `<utility>` `pair` with `first`/`second`, `make_pair`; `<map>` sorted key/value pairs, `value_type` is a pair, **keys unique**: a second `insert` with the same key is refused (`m["k"] = v` overwrites); `find(key)` returns an iterator; `multimap` keeps equal keys in insertion order, `count`, `equal_range` |
| `set` | sorted unique elements, const once inserted, binary search tree; elements equivalent under `<` are not inserted; `multiset::erase(key)` removes **all** equal elements, `erase(it)` one, `erase(it, end())` a range |
| strict weak ordering | irreflexive (`!less(x, x)`), antisymmetric (`less(x, y)` means `!less(y, x)`), transitive; three ways to supply it: `operator<`, a binary predicate function, a functor struct with `operator()` |
| typedefs | `typedef int arr_t[3];`, `typedef map<string, string>::iterator mapIterator;`; standard container typedefs `size_type` (unsigned), `value_type`, `iterator`, `const_iterator`, `reverse_iterator` (`rbegin()`), `pointer`, `reference`, `difference_type` |
| `begin`/`end` | `end()` is one past the last element, never dereference it; empty container: `begin() == end()`; `for (auto it = c.begin(); it != c.end(); ++it)` |
| iterator kinds | input (read, `++`, single pass), output (write, `++`), forward (read and write, multi-pass), bidirectional (adds `--`: `list`, `set`, `map`), random access (adds `it + n`, `it - n`, `it - jt`, `it[n]`, `<`: `vector`, `deque`, `array`); only random access allows arithmetic and iterator subtraction |
| `*it++` | copy the iterator, advance, use the copy: `it = itBegin++;` leaves `it` on the old element |
| algorithms | `<algorithm>` (`<numeric>` for numeric ones); work on `[first, last)`; **never change the container's size**; kinds: non-modifying (`find`, `for_each`), modifying (`copy`, `remove_if`), partitioning, sorting (`sort`, `is_sorted`), binary search, merge, heap, min/max |
| `partition` | `partition(first, last, pred)` moves the true elements before the false ones, **relative order not kept**, returns an iterator to the first false element (or `end()`); `{1..10}` with `IsOdd` gives `1 9 3 7 5 6 4 8 2 10`, bound at 6; `stable_partition` keeps order |

### Week 7 (partly added)

| Topic | Fact |
|---|---|
| static data member | one copy per class, shared by every object; declared `static` in the class, defined once outside it: `int city::counter = 0;`, `const int Date::days_in_regular_year[] = {...};` |
| static member function | called through the class, `A::staticFunction1()`, `Date::today()`; **no `this` pointer**, so it reaches non-static members only through an object (`a.nonStaticFunction()`); a non-static function may call a static one |

Space for the rest of the Week 7 deck once it is posted: copy elision, lvalues and rvalues, and the review-week topics.

:::quiz Twenty true or false across the six weeks (answers at the bottom)
1. `int x{2.5};` compiles.
2. `%` takes the sign of the right operand.
3. `ofstream` opened without flags keeps the old contents.
4. A reference can be re-seated with `=`.
5. `delete` on a dangling pointer is safe.
6. `Circle c();` creates a Circle.
7. Members are initialized in declaration order, not list order.
8. `b = a;` on two existing objects calls the copy constructor.
9. `class X : Spy` is private inheritance.
10. `Base b = derived;` keeps the derived override.
11. C++ has an `abstract` keyword.
12. With virtual bases the most-derived class constructs the shared base.
13. Friendship is transitive.
14. `operator<<` for your class should be a member.
15. Catching by value can slice the exception.
16. `catch (...)` should be the first handler.
17. Destructors are implicitly `noexcept`.
18. `map::insert` with an existing key overwrites the value.
19. `list` iterators support `it + 2`.
20. `partition` keeps the relative order of elements.

Answers, in order: F F F F F · F T F T F · F T F F T · F T F F F
:::

```quiz
[
  {
    "q": "Rapid fire: which header holds `invalid_argument`?",
    "options": ["`<exception>`", "`<stdexcept>`", "`<cstdlib>`", "`<cassert>`"],
    "answer": 1,
    "explain": "`<exception>` has the base `std::exception` and `terminate`; `<stdexcept>` has the useful children: `logic_error` with `invalid_argument`, `length_error`, `out_of_range`, and `runtime_error` with `range_error`, `overflow_error`."
  },
  {
    "q": "`priority_queue<int> q; q.push(10); q.push(30); q.push(20); cout << q.top();` prints...",
    "options": ["10", "20", "30", "the last pushed, 20"],
    "answer": 2,
    "explain": "A priority queue is a max-heap by `operator<`: the largest element is on top, and popping drains 30, 20, 10. Its default underlying container is a vector."
  },
  {
    "q": "Which declaration gives one shared `person` in the diamond?",
    "options": ["`class math_student : virtual student, virtual mathematician`", "`virtual class person`", "`class student : public virtual person` and the same for `mathematician`", "`class person : virtual`"],
    "answer": 2,
    "explain": "The `virtual` keyword goes on the middle classes' base lists, both of them. The most-derived class then calls `person(name)` itself."
  },
  {
    "q": "`Hello World` is in the file. `ofstream f(\"h.txt\", ios::app); f.seekp(-4, ios::end); cout << f.tellp();` prints...",
    "options": ["7", "4", "11", "0"],
    "answer": 0,
    "explain": "`app` keeps the contents (no truncation), the end is position 11, and 11 - 4 = 7, the `o` of World. Without `app` the file would be truncated and the end would be 0."
  },
  {
    "q": "Which SOLID principle does `vector<UIWidget*>` drawn in one loop illustrate?",
    "options": ["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation"],
    "answer": 2,
    "explain": "Every derived widget can stand in for its base type `UIWidget`, so the canvas needs no explicit reference to each subtype. Open/Closed is the `draw() = 0` override instead of the if-chain; Interface Segregation is the Walkable/Swimmable/Flyable split."
  },
  {
    "q": "`list<int> c = {1, 2, 3}; auto it = c.begin(); auto j = it++; cout << *j << *it;` prints...",
    "options": ["11", "12", "22", "21"],
    "answer": 1,
    "explain": "Postfix `++` on an iterator copies it, then advances: `j` stays on 1 and `it` moves to 2. A list iterator is bidirectional, so `++` and `--` work but `it + 1` does not compile."
  },
  {
    "q": "A class with a `double* data` member and the compiler's copy constructor: `MyVector b = a;` then both go out of scope. What happens?",
    "options": ["Nothing wrong: each has its own array", "Both share one array, which is deleted twice", "A compile error", "`b` is empty"],
    "answer": 1,
    "explain": "The member-wise copy copies the pointer, not the array: a shallow copy. Two destructors then `delete[]` the same block. The fix is a deep-copy constructor (and in Week 4 a copy-and-swap `operator=`)."
  }
]
```
