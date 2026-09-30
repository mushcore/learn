---
title: One-page cheat sheet (Week 4)
minutes: 10
---

Everything Quiz 4 can ask, in tables. Read this last, on the way to the lab.

## Abstract classes and interfaces

```cpp
class creature {                          // abstract: one or more pure virtual functions
public:
    virtual ~creature() {}                // virtual destructor
    virtual void all_info() const = 0;    // = 0 is the PURE SPECIFIER
};
class person : public creature {          // concrete once every pure virtual is overridden
public:
    void all_info() const override { ... }
};
creature* hulk = new person("Dr Bruce Banner");   // pointer to the abstract base: OK
```

| | Interface | Abstract class | Concrete class |
|---|---|---|---|
| functions | only pure virtual | at least 1 pure virtual, plus any others | no pure virtual |
| destructor | virtual | virtual | virtual if it has children |
| data | none | yes | yes |
| `X x;` | no | no | yes |

- `virtual void g() { } = 0;` is an error (no body and pure specifier together).
- Abstract `A`: `A a;`, `A f();`, `void h(A a);` **no**; `A* p;`, `A& f(A&);` **yes**.
- A derived class stays abstract until it overrides **every** pure virtual function. An abstract class may derive from a concrete one. Calling a pure virtual function from the abstract constructor is undefined.
- Virtual destructor: `delete basePtr;` runs the derived destructor only if the base destructor is virtual; otherwise the derived part leaks (undefined behaviour).

## Multiple inheritance

```cpp
class math_student : public student, public mathematician {
    math_student(const string& name, const string& passed, const string& proved)
      : student(name, passed), mathematician(name, proved) {}
};
```

- Members of the derived class = union of all bases. Same name in two bases → **ambiguous**; resolve with `c.B::x`, `bob.mathematician::all_info()`, or override in the derived class.
- `using person::person;` inherits person's constructors into a derived class.

## The diamond

| | no `virtual` (oop_multi1) | `virtual` bases, middle classes call `person(name)` (oop_multi2) | `virtual` bases, most derived calls `person(name)` (oop_multi3) |
|---|---|---|---|
| person subobjects | 2 | 1 | 1 |
| person constructor output | `1-param` twice | `default` once (name lost) | `1-param` once |
| `person::all_info()` in math_student | ambiguous | fine | fine |

- Declare in **both** middle classes: `class student : public virtual person`.
- With a virtual base, the **most derived class** constructs it: `: person(name), student(passed), mathematician(proved)`. The `person(name)` written in the middle classes is ignored when they are part of a more derived object, but works when a student is constructed directly.
- Construction order: virtual bases first, then direct bases left to right, then members, then the body; destruction reverses it. diamond.cpp: `A B C D allocated`, `D C B A deallocated` (without virtual: `A B A C D`, `D C A B A`).
- diamondmethods: a call through the virtual base reaches the most derived override (`child.foo`); ambiguous if the child does not override.

## Friends

```cpp
class Dollar {
    int num;
    friend Dollar sum(const Dollar& d1, const Dollar& d2);   // declaration inside
public:
    Dollar(int d) : num(d) {}
};
Dollar sum(const Dollar& d1, const Dollar& d2) { return Dollar(d1.num + d2.num); }   // definition anywhere, not a member
class Boss { friend class Spy; int pin; ... };   // every Spy member may read pin
```

Not mutual · **not transitive** · **not inherited** · access specifier irrelevant.

## Operator overloading

| Operator | Member or non-member | Canonical signature | Body |
|---|---|---|---|
| `<<` | friend non-member | `friend ostream& operator<<(ostream& os, const T& obj)` | `os << obj.x; return os;` |
| `>>` | friend non-member | `friend istream& operator>>(istream& is, T& obj)` | `is >> obj.x; return is;` |
| `==`, `<` | friend non-member | `friend bool operator==(const X& lhs, const X& rhs)` | actual comparison |
| `!=` | friend non-member | | `return !operator==(lhs, rhs);` |
| `>` | friend non-member | | `return operator<(rhs, lhs);` |
| `<=` | friend non-member | | `return !operator>(lhs, rhs);` |
| `>=` | friend non-member | | `return !operator<(lhs, rhs);` |
| prefix `++` | member | `Counter& operator++()` | increment; `return *this;` |
| postfix `++` | member | `Counter operator++(int)` (dummy int) | `Counter tmp(*this); operator++(); return tmp;` |
| `+=` | member | `Fraction& operator+=(const Fraction& rhs)` | add; `return *this;` |
| `+` | friend non-member | `friend Fraction operator+(Fraction lhs, const Fraction& rhs)` | `lhs += rhs; return lhs;` |
| `=` | member | `MyClass& operator=(MyClass rhs)` | `mySwap(*this, rhs); return *this;` |

- Rules: keep the usual meaning; provide the whole set (`+` with `+=`, prefix with postfix); unary → member; binary treating both operands equally (`+ - < >`) → non-member; binary modifying the left (`+= -=`) → member of the left operand's type.
- Postfix copies, so it is slightly slower: `for (...; ++i)`.
- A non-member `operator+` lets `5 + a` work (5 converts through the one-argument constructor).

## Copy-and-swap (the copy assignment operator)

1. `operator=(Example other)` takes the right side **by value**: the copy constructor builds `other`.
2. `mySwap(*this, other)` swaps every member (`std::swap` on each; never on the whole object).
3. `return *this;` so `C = B = A` chains.
4. `other` is destroyed leaving the function, freeing the old data.

Needs a working copy constructor, a working destructor and a non-throwing swap of all members. Assignment = replacing the object's old state with a copy of another's. The compiler's `operator=` copies the pointer: leak plus double free.

:::quiz Fifteen true or false (answers at the bottom)
1. C++ has an `abstract` keyword.
2. A class with one pure virtual function cannot be instantiated.
3. `A& f(A& a);` is allowed for abstract A.
4. An interface may have data members.
5. Deleting a derived object through a base pointer needs a virtual base destructor.
6. A C++ class may have three base classes.
7. `bob.all_info()` with two inherited definitions calls the first one.
8. Virtual bases are constructed before non-virtual bases.
9. In oop_multi2 the name is lost because the middle classes' `person(name)` calls are ignored.
10. Friendship is inherited.
11. A friend declaration must be in the public section.
12. `operator<<` for your class should be a member.
13. Postfix `++` takes a dummy int.
14. `operator+` returns by reference.
15. The copy-and-swap `operator=` takes its parameter by value.

Answers, in order: F T T F T · T F T T F · F F T F T
:::

```quiz
[
  {
    "q": "Rapid fire: `virtual void f() = 0;` makes the class...",
    "options": ["an interface automatically", "abstract", "concrete", "a friend"],
    "answer": 1,
    "explain": "One pure virtual function is enough to make a class abstract; it is an interface only if every function is pure virtual and there is no data."
  },
  {
    "q": "One shared grandparent needs `virtual` on...",
    "options": ["the grandparent", "both middle classes' base lists", "the most derived class", "main"],
    "answer": 1,
    "explain": "class student : public virtual person and class mathematician : public virtual person."
  },
  {
    "q": "`operator>=` in terms of `<` is...",
    "options": ["`rhs < lhs`", "`!(lhs < rhs)`", "`!(rhs < lhs)`", "`lhs < rhs`"],
    "answer": 1,
    "explain": "greater than or equal = not less than."
  },
  {
    "q": "Which is a member function?",
    "options": ["`operator<<`", "`operator==`", "`operator+=`", "`operator+`"],
    "answer": 2,
    "explain": "+= modifies the left operand, so it belongs to the left operand's type. The other three are friendly non-members."
  },
  {
    "q": "In copy-and-swap, who frees the old data of the assigned-to object?",
    "options": ["operator= explicitly with delete[]", "the destructor of the by-value parameter when the function ends", "the copy constructor", "main"],
    "answer": 1,
    "explain": "After the swap the temporary holds the old data; its destructor runs on leaving the function."
  }
]
```
