---
title: Part B: write the output (Q20, Q27, Q28)
minutes: 30
---

Three of the Part B questions hand you a program and ask for its exact output, with the line count as a hint. Every line is a constructor or destructor message, so the whole skill is knowing which special member runs for each statement and in what order. Write your fourteen, fourteen and twelve lines on paper first.

## Q20 (7). What is printed to standard output by this code? HINT: this prints 14 lines.

```cpp run pin q20.cpp
// predict: Write all 14 lines in order. Count the copies: by-value parameter, by-value return, two declarations.
#include <iostream>

using namespace std;

class A
{
public:
    A() { cout << "Default constructor!" << endl; }
    ~A() { cout << "Destructor!" << endl; }
    A(const A&) { cout << "Copy constructor!" << endl;}
};

A foo(A input)
{
    cout << "Look ma, I'm fooing!" << endl;
    return input;
}

int main()
{
    A littleA;
    foo(littleA);
    A anotherA = littleA;
    A yetAnotherA = foo(littleA);
}
```

```quiz
[
  {
    "q": "Q20: how many times does `Copy constructor!` print?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "explain": "Five copies: the by-value parameter `input` twice (one per call), the return value of the first call (a temporary, since a parameter can never be elided into the return value), the return value of the second call (which is `yetAnotherA` itself), and `A anotherA = littleA;`. The trace below lists all fourteen lines."
  }
]
```

### Q20 stepped: each copy and each destructor

Watch `return input;`: it copies the parameter, and in the first call the copy is a temporary that dies at the semicolon, while in the second it is `yetAnotherA`.

```widget
lifetime-trace
{"program": "#include <iostream>\n\nusing namespace std;\n\nclass A\n{\npublic:\n    A() { cout << \"Default constructor!\" << endl; }\n    ~A() { cout << \"Destructor!\" << endl; }\n    A(const A&) { cout << \"Copy constructor!\" << endl;}\n};\n\nA foo(A input)\n{\n    cout << \"Look ma, I'm fooing!\" << endl;\n    return input;\n}\n\nint main()\n{\n    A littleA;\n    foo(littleA);\n    A anotherA = littleA;\n    A yetAnotherA = foo(littleA);\n}", "presets": false}
```

### The fourteen lines, statement by statement

1. `A littleA;` runs the default constructor: `Default constructor!`.
2. `foo(littleA);` copies the argument into the by-value parameter `A foo(A input)`: `Copy constructor!`. The body prints `Look ma, I'm fooing!`. `return input;` copies the parameter into the returned temporary: `Copy constructor!` (a parameter can never be elided into the return value). The statement ends, so the unused temporary and then `input` are destroyed: `Destructor!` twice.
3. `A anotherA = littleA;` is copy initialization of a new object: `Copy constructor!`.
4. `A yetAnotherA = foo(littleA);` repeats the call: `Copy constructor!` for `input`, the fooing line, `Copy constructor!` for the return value, which **is** `yetAnotherA` thanks to copy elision, so no further copy, then `Destructor!` for `input` only.
5. The closing brace of main destroys `yetAnotherA`, `anotherA`, `littleA` in reverse order of construction: `Destructor!` three times.

Tally: 1 default, 5 copies, 2 fooing lines, 6 destructors = 14. Every constructor message must be matched by a destructor message eventually: 1 + 5 constructions, 6 destructions.

## Q27 (4). What is printed to standard output by this code? HINT: this prints 14 lines.

```cpp run pin q27.cpp
// predict: Write all 14 lines. How many times is A constructed?
#include <iostream>
class A
{
public:
    A() { std::cout << "A allocated" << std::endl; }
    ~A() { std::cout << "A deallocated" << std::endl; } };

class B : public A
{
public:
    B() { std::cout << "B allocated" << std::endl; }
    ~B() { std::cout << "B deallocated" << std::endl; } };

class C : public B
{
public:
    C() { std::cout << "C allocated" << std::endl; }
    ~C() { std::cout << "C deallocated" << std::endl; } };

class D : public B
{
public:
    D() { std::cout << "D allocated" << std::endl; }
    ~D() { std::cout << "D deallocated" << std::endl; } };

class E : public C, public D
{
public:
    E() { std::cout << "E allocated" << std::endl; }
    ~E() { std::cout << "E deallocated" << std::endl; } };

int main()
{
    E e;
}
```

```quiz
[
  {
    "q": "Q27: how many times does `A allocated` print?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "Twice. No inheritance is virtual, so E holds one A-B chain inside C and another inside D. The table below gives all fourteen lines."
  }
]
```

No inheritance here is virtual, so `class E : public C, public D` contains two complete A-B chains: one inside its C part and one inside its D part. Bases are constructed in the order they are listed, each one base-first:

| Phase | Lines |
|---|---|
| C part (`class C : public B`, and B's A first) | `A allocated`, `B allocated`, `C allocated` |
| D part (`class D : public B`, its own A and B) | `A allocated`, `B allocated`, `D allocated` |
| E's body | `E allocated` |
| destruction, exact reverse | `E deallocated`, `D deallocated`, `B deallocated`, `A deallocated`, `C deallocated`, `B deallocated`, `A deallocated` |

Seven constructions, seven destructions, fourteen lines. The reverse order means the D chain is torn down before the C chain, and within each chain the derived part goes first.

```widget
diamond-viz
{ "virtualStudent": false, "virtualMath": false, "init": "middle" }
```

The diamond widget is the same shape with names: with neither middle class virtual, math_student holds two persons the way `E e;` holds two A-B chains.

## Q28 (4). What is printed to standard output by this code? Hint: this prints 12 lines. Explain in 1 sentence why the output is different from the output in question 27.

```cpp run pin q28.cpp
// predict: Write all 12 lines. Which two lines of Q27 disappear?
#include <iostream>
class A
{
public:
    A() { std::cout << "A allocated" << std::endl; }
    ~A() { std::cout << "A deallocated" << std::endl; } };

class B : virtual public A
{
public:
    B() { std::cout << "B allocated" << std::endl; }
    ~B() { std::cout << "B deallocated" << std::endl; } };

class C : virtual public B
{
public:
    C() { std::cout << "C allocated" << std::endl; }
    ~C() { std::cout << "C deallocated" << std::endl; } };

class D : public B
{
public:
    D() { std::cout << "D allocated" << std::endl; }
    ~D() { std::cout << "D deallocated" << std::endl; } };

class E : public C, public D
{
public:
    E() { std::cout << "E allocated" << std::endl; }
    ~E() { std::cout << "E deallocated" << std::endl; } };

int main()
{
    E e;
}
```

```quiz
[
  {
    "q": "Q28: which two lines of Q27's output disappear?",
    "options": [
      "one `A allocated` and one `A deallocated`",
      "one `B allocated` and one `B deallocated`",
      "`C allocated` and `C deallocated`",
      "both `A allocated` lines"
    ],
    "answer": 0,
    "explain": "`class B : virtual public A` makes A a virtual base: one shared A, built once by the most-derived class E. D's B is not virtual, so B still appears twice. The table below gives all twelve lines."
  }
]
```

Two bases are now virtual. `class B : virtual public A` makes A a virtual base, so there is only one A in the whole object, and the most-derived class E constructs it first. `class C : virtual public B` makes C's B virtual too, so E constructs that B next, before any non-virtual base. `class D : public B` is unchanged: D still carries its own ordinary B, constructed inside D.

| Phase | Lines |
|---|---|
| virtual bases, by E, in order | `A allocated`, `B allocated` |
| non-virtual bases in order: C (its B is already built), then D with its own B | `C allocated`, `B allocated`, `D allocated` |
| E's body | `E allocated` |
| destruction, exact reverse | `E deallocated`, `D deallocated`, `B deallocated`, `C deallocated`, `B deallocated`, `A deallocated` |

Six constructions, six destructions, twelve lines: the second A and its destruction are the two lines that vanish. D's B is not virtual, so B still appears twice; only A was shared.

:::tip Why Q28 prints two fewer lines than Q27
The output differs because `A` is a virtual base, so the single shared `A` is constructed once by the most-derived class `E` instead of once per `B`, removing one `A allocated` and one `A deallocated` (14 lines become 12).
:::

:::warn The warning g++ prints for Q28
`warning: virtual base 'B' inaccessible in 'E' due to ambiguity [-Winaccessible-base]`. E has two Bs, the virtual one under C and the ordinary one under D, so the name `B` is still ambiguous inside E. It is a warning, not an error: the program compiles and prints the twelve lines. If the exam asks whether `e.B::something()` would compile, the answer is no, for the same reason.
:::

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": false, "init": "most" }
```

One side virtual and the other not, as in Q28: the widget shows the shared person built by the most-derived class plus a second, ordinary person inside the non-virtual side. Two copies of the middle base remain, exactly like the two Bs.

```quiz
[
  {
    "q": "Q20 with the parameter copy removed: `A foo(const A& input)` still returning `input`. How many lines print?",
    "code": "A foo(const A& input)\n{\n    cout << \"Look ma, I'm fooing!\" << endl;\n    return input;\n}\n// main unchanged",
    "options": ["14", "12", "10", "8"],
    "answer": 2,
    "explain": "Verified: 10 lines. Each call loses the parameter copy and its destructor (2 lines per call, 2 calls). The return still copies: Default, fooing, Copy, Destructor, Copy, fooing, Copy, Destructor, Destructor, Destructor."
  },
  {
    "q": "Q20 with `void foo(const A& input)` and no return, main calling `foo(littleA);` twice around `A anotherA = littleA;`. What prints?",
    "code": "void foo(const A& input)\n{\n    cout << \"Look ma, I'm fooing!\" << endl;\n}\n\nint main()\n{\n    A littleA;\n    foo(littleA);\n    A anotherA = littleA;\n    foo(littleA);\n}",
    "options": ["Default, fooing, Copy, fooing, Destructor, Destructor (6 lines)", "Default, Copy, fooing, Copy, Destructor, Destructor (6 lines)", "Default, fooing, Copy, fooing, Destructor (5 lines)", "Default, fooing, fooing, Destructor (4 lines)"],
    "answer": 0,
    "explain": "A const reference makes no copy, so each call prints only the fooing line. The one copy is anotherA; two objects die at the end of main."
  },
  {
    "q": "Q20 with statement 3 changed to `A anotherA;` followed by `anotherA = littleA;`. Which is true?",
    "options": ["Still 14 lines; line 7 becomes `Default constructor!` and the assignment prints nothing", "15 lines: one extra `Copy constructor!` for the assignment", "13 lines: the assignment replaces the copy and prints nothing", "It does not compile: no operator= was written"],
    "answer": 0,
    "explain": "Verified: 14 lines. `A anotherA;` is the default constructor; `anotherA = littleA;` is the compiler-generated copy assignment operator, which has no print statement. Object count is unchanged, so the destructor count is too."
  },
  {
    "q": "Q20 with main reduced to `A littleA; foo(littleA);`. How many lines?",
    "type": "numeric",
    "answer": 7,
    "explain": "Default, Copy (parameter), fooing, Copy (return), Destructor (temporary), Destructor (parameter), Destructor (littleA at the end of main) = 7."
  },
  {
    "q": "Q27 with the base list swapped: `class E : public D, public C`. Which are the first three lines?",
    "options": ["`A allocated`, `B allocated`, `C allocated`", "`D allocated`, `A allocated`, `B allocated`", "`E allocated`, `D allocated`, `C allocated`", "`A allocated`, `B allocated`, `D allocated`"],
    "answer": 3,
    "explain": "Bases construct in the order listed, each base-first: the D chain (A, B, D) now comes before the C chain (A, B, C), and destruction reverses to E, C, B, A, D, B, A."
  },
  {
    "q": "Q28 with D also virtual: `class D : virtual public B`. What prints?",
    "options": ["the same 12 lines", "14 lines, as in Q27", "10 lines: `A B C D E allocated`, then `E D C B A deallocated`", "8 lines: B and A appear once each and C is skipped"],
    "answer": 2,
    "explain": "Verified: 10 lines. Now both Bs are virtual, so E constructs one A and one B, then C, then D, then itself. One of everything: 5 up, 5 down."
  },
  {
    "q": "Q28 with the base list swapped: `class E : public D, public C`. What are lines 1 to 5?",
    "options": ["`A`, `B`, `B`, `D`, `C` allocated", "`A`, `B`, `D`, `B`, `C` allocated", "`A`, `B`, `C`, `B`, `D` allocated", "`B`, `A`, `D`, `B`, `C` allocated"],
    "answer": 0,
    "explain": "Verified. Virtual bases first (A, then C's virtual B), then the non-virtual bases in order: D builds its own B then D, then C. 12 lines; destruction is E, C, D, B, B, A."
  },
  {
    "q": "Q27 with only `class B : virtual public A` changed (C stays `public B`). How many lines, and how do they compare with Q28's?",
    "options": ["14 lines, identical to Q27", "12 lines, identical to Q28's output", "12 lines, but B appears once", "10 lines"],
    "answer": 1,
    "explain": "Verified: the twelve lines are the same text as Q28. Sharing A removes one A; whether C's B is virtual changes when that B is built (by E before C, or inside C) but not what prints, since both happen before `C allocated`."
  },
  {
    "q": "In Q28, `class C : virtual public B` means E has only one B subobject.",
    "type": "tf",
    "answer": false,
    "explain": "D inherits B non-virtually, so D carries its own B: two Bs, one A. That is why g++ warns that virtual base B is inaccessible in E due to ambiguity."
  },
  {
    "q": "A general rule from all three traces: destructors run...",
    "options": ["in the order the constructors ran", "bases first, then the derived part", "in an order the compiler chooses", "in reverse order of construction, derived part before its bases"],
    "answer": 3,
    "explain": "Reverse construction, always. Within one object the body of the derived destructor runs first, then the bases in reverse of their construction order."
  }
]
```
