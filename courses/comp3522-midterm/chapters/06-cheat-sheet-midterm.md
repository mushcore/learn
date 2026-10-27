---
title: Double-sided cheat sheet, Weeks 1 to 7: copy it by hand
minutes: 25
---

This is the sheet to copy by hand for the midterm (Thursday October 29, 2026, 3:30 pm, SW03-1710, Weeks 1 to 7): one double-sided page, Side 1 then Side 2, each side under 600 words and 45 lines. Rules are in the slide's wording; a short "C++17:" or "C++20:" tag marks a slide rule the standard has since changed. Code is written the way you would write it by hand. Copy it, then take the self-test below without looking.

## Side 1: Weeks 1 to 3 and the right-left rule

### Week 1: syntax, types, streams

- `::` scope resolution (namespace or class member); `.` member of an object; `->` through a pointer. `.hpp` declares, `.cpp` defines.
- `int x{0};` uniform, preferred: narrowing `int y{3.7}` is a compile error; `= 3.7` and `(3.7)` truncate; `(int)2.25` is 2.
- `int / int` truncates toward zero (`-7/2` is -3); `%` takes the sign of the left operand.
- `x++` yields the old value, `++x` the new. `const` may come from run time, `constexpr` must be compile time.
- Sizes: `char` 1, `int` 4, `long` 4, `long long` 8, `float` 4, `double` 8.
- `setw` next field only, others sticky; default precision 6 significant; `fixed` then `setprecision(2)`: 2 decimals.
- `while (cin >> n)` stops on bad input or EOF. Recover: `cin.clear(); cin.ignore(numeric_limits<streamsize>::max(), '\n');`

### Week 2: files, pointers, memory

- `ifstream` fails if missing; `ofstream` creates or truncates; `app` writes at the end every time, `ate` goes to the end once.
- `seekg`/`tellg` input, `seekp`/`tellp` output; on `Hello World` (11): `seekp(-4, ios::end)` is 7 (with `app`).
- Pointer holds an address, may be null, may be re-pointed; reference is another name, must be initialized, never re-seated (`r = m` copies m's value).
- By value copies; by pointer `swap(&a, &b)`; by reference `swap(a, b)`; `const T&` no copy, no change; never return a reference to a local.
- `new`/`delete`, `new[]`/`delete[]`; losing the pointer leaks; after `delete` it dangles. `&p` on `string* p` is `string**`.
- `v[i]` unchecked, `v.at(i)` throws `out_of_range`. After `cin >> n` the newline stays, so the next `getline` is empty.

```cpp
while (getline(in, line)) { istringstream iss(line); iss >> n >> word; }
```

### Week 3: classes, constructors, inheritance

- `struct` members (and inheritance) default public, `class` private. Protected: the class and derived classes.
- Constructor: no return type; any constructor removes the default one; `C c();` is a function prototype, `C c{};` an object.
- Members initialize in declaration order, not list order; unlisted class-type members are default-constructed before the body.
- Default arguments trailing only. Only `const` member functions may be called on a const object or a `const T&`.
- Copy constructor runs on `T b(a);`, `T b = a;`, pass by value, return by value; not on `b = a;`. Compiler's copy is shallow: shared pointer, double free.
- Destructor: no parameters, no return type, one per class; runs at end of scope, on `delete`, at end of full expression (temporaries), at program end (statics).
- **Order**: base, then members in declaration order, then the body; destruction exactly reversed; locals die in reverse order of declaration.
- `class Car;` forward declaration: `Car*`, `Car&` fine, `Car c;` incomplete type. Not inherited: constructors, destructor, friends.
- Public inheritance keeps public/protected; protected makes both protected; private (`class` default) both private; private base members never accessible.
- `virtual` + call through `Base*`/`Base&` = dynamic binding; `override` checks; `Base b = derived;` slices: base version runs.
- UML: generalization solid, realization dashed (hollow triangles); composition filled diamond, aggregation hollow.

```cpp
T(const T& o) : n(o.n), p(new int[o.n]) { for (int i = 0; i < n; ++i) p[i] = o.p[i]; }
Derived(int a) : Base(a), m(a) { }   // else Base() runs
```

### Right-left rule

1. Start from variable name (var)
2. Keep going right. Read what we see until we see right parentheses `)`
3. Then go left of var. Read what we see until we see left parentheses `(`
4. Exit parentheses and go right. Read what we see until right parentheses or semicolon
5. Go left of where we exited bracket. Read what we see until left parentheses or finish

Repeat steps as needed. `int (**ppf)();` pointer to a pointer to a function returning an int. `int *(*pap)[];` pointer to an array of int pointers. `int (*paa)[][];`, `int (*paf)[]();` don't compile.

## Side 2: Weeks 4 to 7

### Week 4: abstract classes, diamonds, friends, operators

- No `abstract` keyword. Abstract: at least one pure virtual (`= 0`); `A a;`, `A f();`, `void h(A a);` fail (C++20: only defining or calling them), `A*`, `A&` fine. Interface: only pure virtual, no data.
- A derived class stays abstract until it overrides every pure virtual function. `delete basePtr;` runs the derived destructor only if the base destructor is virtual.
- Same name in two bases is ambiguous (`c.A::x`). Diamond: `class B : public virtual A` in **both** middle classes; the most-derived class constructs `A`.
- **Order**: virtual bases first, then direct bases left to right, then members, then the body; destruction reverses. diamond: `A B C D`, `D C B A`; no virtual: `A B A C D`.
- Friend: declared inside the class, not a member; not mutual, not transitive, not inherited. Unary and `+=` are members; `+ ==` `<<` `>>` friendly non-members.
- Copy-and-swap: by-value parameter built by the copy constructor; swap every member (never the whole object); `return *this;`; the parameter dies with the old data.

```cpp
virtual void f() = 0;   virtual ~B() { }
friend ostream& operator<<(ostream& os, const T& t) { os << t.x; return os; }
friend istream& operator>>(istream& is, T& t) { is >> t.x; return is; }
friend bool operator<(const T& a, const T& b) { return a.x < b.x; }
friend void mySwap(T& a, T& b) { swap(a.n, b.n); swap(a.p, b.p); }
T& operator=(T o) { mySwap(*this, o); return *this; }
```

### Week 5: exceptions and design

- Assertions detect programming errors; exceptions handle situations that prevent proper continuation. `throw "msg"` throws a `const char*`.
- Catch by reference (by value slices); the first matching handler runs, so child types first, `catch (...)` last; bare `throw;` rethrows.
- Unwinding destroys locals in reverse order; uncaught: `std::terminate` calls `abort`. `noexcept` broken ends the program; destructors are implicitly `noexcept`.
- A constructor that throws creates no object: no destructor for it; already-built bases and members are destroyed.
- `<stdexcept>`: `logic_error` (`invalid_argument`, `out_of_range`, `length_error`), `runtime_error` (`range_error`, `overflow_error`).
- Coupling: strength of connection between modules, aim loose. Cohesion: one unit, one task, aim high. Demeter: talk only to friends, no `a.getB().getC()`.
- SOLID: S one reason to change; O open for extension, closed for modification; L a subtype replaces its base; I many client-specific interfaces; D depend on abstractions.

```cpp
struct E : exception { const char* what() const noexcept override { return "E"; } };
try { throw E(); } catch (const E& e) { cerr << e.what(); } catch (...) { throw; }
```

### Week 6: auto, STL, iterators, algorithms

- `auto a;` is an error; `auto` not for parameters (C++20: allowed). `for (auto x : v)` copies, `for (auto& x : v)` modifies.
- STL value semantics: containers store copies. Half-open `[first, last)`; `end()` one past the last, never dereference it.
- `map` keys unique: second `insert` refused, `m[k] = v` overwrites; `set` skips equal elements; `multiset::erase(key)` removes all equal.
- Strict weak ordering: irreflexive, antisymmetric, transitive; give it by `operator<`, a predicate function, or a functor. `priority_queue` top is the largest.
- Iterators: input `istream_iterator`; output `ostream_iterator`; forward `forward_list`, `unordered_map`; bidirectional `list`, `map`, `set`; random access (`it + n`, `it[n]`, `<`) `vector`, `deque`, `array`.
- Algorithms never change container size; non-modifying won't modify element order, modifying will. `partition` breaks relative order, `stable_partition` keeps it.

```cpp
m.insert({"a", 1});  for (auto it = m.begin(); it != m.end(); ++it) cout << it->first << it->second;
sort(v.begin(), v.end());   sort(v.begin(), v.end(), cmp);
```

### Week 7: static, copy elision, review

- Static data member: one copy per class, shared. The static keyword is used with the declaration, not the definition: `int X::n = 0;`.
- Plain static can't be initialized inside the class (C++17: `inline` can); `const static` integral can; `constexpr static` must.
- Static member function: can only access static data (members of an object it is given are fine); there is no `*this` pointer; cannot be virtual or const. Call `X::f()` or `obj.f()`.
- Elision: RVO `return Number(num);`; temporary `Number n(Number(2));`; NRVO `return tempN;`; no guarantee all compilers use them (C++17: first two guaranteed, NRVO optional). A returned parameter is never elided.
- Copy constructor called: directly, passing by value, returning by value (elision may remove the return copy). Virtual destructor: child's, then parent's.

## Self-test: twenty true or false

Answer from memory first; the key is in each explanation.

```quiz
[
  {
    "q": "`int x{2.5};` compiles.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Brace (uniform) initialization rejects narrowing, so `double` to `int` inside braces is a compile error; `int x = 2.5;` and `int x(2.5);` compile and truncate to 2."
  },
  {
    "q": "`%` takes the sign of the right operand.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. The result takes the sign of the left operand: `-7 % 2` is -1 and `7 % -2` is 1."
  },
  {
    "q": "An `ofstream` opened without flags keeps the old contents of the file.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. `ofstream` opens with `out`, which alone truncates the file; `ios::app` keeps the contents and writes at the end."
  },
  {
    "q": "A reference can be re-seated with `=`.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. A reference is never re-seated: `ref = m;` copies m's value into the variable `ref` already names. A pointer is re-pointed with `p = &m;`."
  },
  {
    "q": "`delete` on a dangling pointer is safe.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Deleting memory that is already freed is a double free, which is undefined behaviour; set the pointer to `nullptr` after `delete`, since `delete nullptr` does nothing."
  },
  {
    "q": "`Circle c();` creates a Circle with the default constructor.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. It declares a function named c that takes nothing and returns a Circle (the most vexing parse); `Circle c;` or `Circle c{};` creates the object."
  },
  {
    "q": "Members are initialized in declaration order, not in initializer-list order.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. The order of the member declarations in the class decides, whatever order the initializer list is written in; g++ warns with `-Wreorder` when they differ."
  },
  {
    "q": "`b = a;` on two existing objects calls the copy constructor.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Both objects already exist, so this is assignment and runs `operator=`; the copy constructor runs only when a new object is made from another (`T b(a);`, `T b = a;`, pass or return by value)."
  },
  {
    "q": "`class X : Spy { };` is private inheritance.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. A `class` defaults to private inheritance (a `struct` defaults to public), so Spy's public and protected members become private in X."
  },
  {
    "q": "`Base b = derived;` keeps the derived override, so `b.print()` runs the derived version.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Copying into a `Base` object slices off the derived part, so calls on `b` run the base version; polymorphism needs a `Base*` or `Base&`."
  },
  {
    "q": "C++ has an `abstract` keyword.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. A class is abstract because it has at least one pure virtual function (`= 0`); there is no `abstract` (or `interface`) keyword."
  },
  {
    "q": "With virtual bases, the most-derived class constructs the shared base.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. In the diamond, `math_student` calls `person(name)` itself; the `person(name)` calls written in `student` and `mathematician` are ignored inside a bigger object."
  },
  {
    "q": "Friendship is transitive: a friend of a friend is a friend.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Friendship is granted only by the class that declares it: not mutual, not transitive, not inherited."
  },
  {
    "q": "`operator<<` for your class should be a member function.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Its left operand is the `ostream`, not your object, so it is a friendly non-member: `friend ostream& operator<<(ostream& os, const T& t)`."
  },
  {
    "q": "Catching an exception by value can slice it.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. A by-value handler for a base type copies only the base part of a derived exception, so `what()` reports the base; catch by reference."
  },
  {
    "q": "`catch (...)` should be the first handler.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. The first matching handler runs and `catch (...)` matches everything, so it goes last; any handler after it would never run."
  },
  {
    "q": "Destructors are implicitly `noexcept`.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. Since C++11 a destructor is `noexcept` unless declared otherwise, so an exception escaping one calls `std::terminate`; never throw from a destructor."
  },
  {
    "q": "`map::insert` with a key already in the map overwrites the value.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Keys are unique and `insert` refuses the second pair, leaving the old value; `m[key] = value` is the form that overwrites."
  },
  {
    "q": "`list` iterators support `it + 2`.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. A list iterator is bidirectional: `++` and `--` only. Arithmetic like `it + 2` needs a random access iterator (vector, deque, array); use `std::next(it, 2)` for a list."
  },
  {
    "q": "`partition` keeps the relative order of the elements.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. `partition` moves the elements that pass the predicate before the others but does not keep their relative order; `stable_partition` does."
  }
]
```

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
