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

:::info The review copy of Q20
The instructor re-posted this program for the review lecture as `ReviewQuestion20`, with a `cout << endl;` after each of the four statements, so that copy prints these 14 lines plus four blank lines between the statements. Compiling it with `-fno-elide-constructors` changes nothing, because `A yetAnotherA = foo(littleA);` is guaranteed elision since C++17 and a returned parameter is never elided, so every copy above is one the language requires. In the first call the returned temporary and `input` both die at the semicolon; g++ destroys the temporary first and then `input` (the instructor's annotation lists `input` first), but both print the same `Destructor!`, so the output cannot show the order.
:::

## Parent and Child

The review code also holds `ParentChild`: a `struct Parent` with a virtual destructor, a `struct Child : public Parent`, and two functions that take a `Parent` by value and by reference. Every constructor and destructor prints. As shipped only `Parent p;` runs; main carries three experiments as comments. Run it, then predict each experiment.

```cpp run pin ParentChild.cpp
// predict: As shipped, only `Parent p;` runs in main. Write every line printed.
#include <iostream>
using namespace std;
struct Parent
{
    Parent() { cout << "Parent default constructor.\n"; }
    Parent(const Parent&) { cout << "A Parent copy was made.\n"; }
    virtual ~Parent() {cout << "Parent destructor.\n"; }
};

struct Child : public Parent
{
    Child() { cout << "Child default constructor.\n"; }
    Child(const Child&) { cout << "A Child copy was made.\n"; }
    ~Child() {cout << "Child destructor.\n"; }
};

void passByValue(Parent p) {
    cout << "in passByValue" << endl;
}

void passByReference(Parent &p) {
    cout << "in passByReference" << endl;
}

int main()
{
    //examine constructor/destructor calls for parent and child separately
    Parent p;
//    Child c;

//    //examine constructor/destructor calls if parent does NOT have virtual destructor
//    Parent *pPtr = new Child;
//    delete pPtr;

//    //examine constructor/destructor calls when passing by value or reference in functions
//    Child c;
//    passByValue(c);
//    passByReference(c);

    return 0;
}
```

g++ prints three warnings for this file (Child's copy constructor does not name its Parent base, and both `p` parameters are unused); they do not stop it running.

```quiz
[
  {
    "q": "Experiment 1: main's only statement is `Child c;`. What prints?",
    "code": "int main()\n{\n    Child c;\n    return 0;\n}",
    "options": [
      "`Parent default constructor.` / `Child default constructor.` / `Child destructor.` / `Parent destructor.`",
      "`Child default constructor.` / `Parent default constructor.` / `Parent destructor.` / `Child destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `Parent destructor.` / `Child destructor.`",
      "`Child default constructor.` / `Child destructor.`"
    ],
    "answer": 0,
    "explain": "Real output, four lines. A Child is built base first, so Parent's constructor runs before Child's body, and it is destroyed in reverse: the child destructor runs before the parent's."
  },
  {
    "q": "Experiment 2, with Parent's destructor still `virtual`: what prints?",
    "code": "int main()\n{\n    Parent *pPtr = new Child;\n    delete pPtr;\n    return 0;\n}",
    "options": [
      "`Parent default constructor.` / `Child default constructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `Child destructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `Parent destructor.` / `Child destructor.`"
    ],
    "answer": 1,
    "explain": "Real output, the same four lines as `Child c;`. `new Child` builds Parent then Child; because the destructor is virtual, `delete pPtr` dispatches to the dynamic type's destructor, so the child destructor runs, then the parent's."
  },
  {
    "q": "Experiment 2 again, with `virtual` removed from Parent's destructor. What does g++ print?",
    "code": "// in struct Parent:\n~Parent() {cout << \"Parent destructor.\\n\"; }   // no virtual\n\nint main()\n{\n    Parent *pPtr = new Child;\n    delete pPtr;\n    return 0;\n}",
    "options": [
      "`Parent default constructor.` / `Child default constructor.` / `Child destructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Parent destructor.`",
      "`Child default constructor.` / `Parent destructor.`"
    ],
    "answer": 1,
    "explain": "Deleting a Child through a `Parent*` whose destructor is not virtual is undefined behaviour; this is what g++ prints. The call binds statically to `~Parent`, so the child's destructor is skipped and `Child destructor.` never appears."
  },
  {
    "q": "Experiment 3, virtual destructor restored: what prints?",
    "code": "int main()\n{\n    Child c;\n    passByValue(c);\n    passByReference(c);\n    return 0;\n}",
    "options": [
      "`Parent default constructor.` / `Child default constructor.` / `A Parent copy was made.` / `in passByValue` / `Parent destructor.` / `in passByReference` / `Child destructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `A Child copy was made.` / `in passByValue` / `Child destructor.` / `Parent destructor.` / `in passByReference` / `Child destructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `in passByValue` / `in passByReference` / `Child destructor.` / `Parent destructor.`",
      "`Parent default constructor.` / `Child default constructor.` / `A Parent copy was made.` / `in passByValue` / `Parent destructor.` / `A Parent copy was made.` / `in passByReference` / `Parent destructor.` / `Child destructor.` / `Parent destructor.`"
    ],
    "answer": 0,
    "explain": "Real output, eight lines. The parameter `Parent p` is a Parent, so passing a Child by value runs Parent's copy constructor on c's Parent part (slicing), and that copy's destructor prints only `Parent destructor.`. The reference parameter makes no object at all."
  }
]
```

### What each experiment shows

- **Construction and destruction order.** `Child c;` builds the Parent part first and destroys it last: four lines, the child destructor before the parent's.
- **Virtual destructor.** `delete pPtr;` through a `Parent*` reaches `~Child` only because `~Parent` is virtual; the output then matches the stack object exactly.
- **Without `virtual`.** The same `delete` is undefined behaviour. g++ calls `~Parent` alone, so anything Child owned would leak. It gives no warning here: `-Wdelete-non-virtual-dtor` fires only for a class with some other virtual function, and this Parent has none. A base class you delete through a base pointer needs a virtual destructor.
- **Slicing.** `passByValue(c)` constructs a brand-new Parent from c with `Parent(const Parent&)`, never Child's copy constructor. The parameter dies at the end of the call with one `Parent destructor.`. `passByReference(c)` binds to c itself, so it prints only its message. In none of the three experiments does `A Child copy was made.` print.

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

## Write the output of a copying `B` and two new four-class hierarchies

Part B hands you the program and a line count. These three are new: a function that returns a local, one that takes by value, one that returns a reference parameter, then a hierarchy with a member object, with and without `virtual`.

```quiz
[
  {
    "q": "What is printed to standard output? HINT: this prints 8 lines.",
    "code": "#include <iostream>\nusing namespace std;\n\nclass B\n{\npublic:\n    B() { cout << \"B()\" << endl; }\n    B(const B&) { cout << \"B(copy)\" << endl; }\n    ~B() { cout << \"~B\" << endl; }\n};\n\nB make()\n{\n    B local;\n    return local;\n}\n\nvoid take(B)\n{\n    cout << \"take\" << endl;\n}\n\nB pass(const B& b)\n{\n    return b;\n}\n\nint main()\n{\n    B x = make();\n    take(x);\n    B y = pass(x);\n    cout << \"end\" << endl;\n}",
    "options": [
      "`B()`\n`B(copy)`\n`take`\n`~B`\n`B(copy)`\n`end`\n`~B`\n`~B`",
      "`B()`\n`B(copy)`\n`~B`\n`B(copy)`\n`take`\n`~B`\n`B(copy)`\n`end`\n`~B`\n`~B`",
      "`B()`\n`take`\n`end`\n`~B`\n`~B`",
      "`B()`\n`B(copy)`\n`take`\n`~B`\n`end`\n`~B`"
    ],
    "answer": 0,
    "explain": "`B x = make();`: make returns its local, and g++ builds that local directly in x (named return value optimization): only `B()`. `take(x);`: the by-value parameter is copy constructed (`B(copy)`), the body prints `take`, and the parameter dies at the end of the statement (`~B`). `B y = pass(x);`: no copy on the way in (a const reference), but `return b;` must copy the referenced object into y: `B(copy)`. `end`, then y and x die in reverse order: `~B`, `~B`. 1 + 2 copies + take + end + 3 destructors = 8."
  },
  {
    "q": "In the same program, how many times does `B(copy)` print?",
    "type": "numeric",
    "code": "#include <iostream>\nusing namespace std;\n\nclass B\n{\npublic:\n    B() { cout << \"B()\" << endl; }\n    B(const B&) { cout << \"B(copy)\" << endl; }\n    ~B() { cout << \"~B\" << endl; }\n};\n\nB make()\n{\n    B local;\n    return local;\n}\n\nvoid take(B)\n{\n    cout << \"take\" << endl;\n}\n\nB pass(const B& b)\n{\n    return b;\n}\n\nint main()\n{\n    B x = make();\n    take(x);\n    B y = pass(x);\n    cout << \"end\" << endl;\n}",
    "answer": 2,
    "tolerance": 0,
    "explain": "Two copies: take's by-value parameter, and pass's return of the referenced object. make's `return local;` is elided, and `pass(const B& b)` takes no copy. Check the balance: 3 constructions (1 default, 2 copies), 3 destructions."
  },
  {
    "q": "What is printed? HINT: this prints 12 lines. Give them in order.",
    "code": "#include <iostream>\nusing namespace std;\n\nclass P { public: P() { cout << \"P\" << endl; } ~P() { cout << \"~P\" << endl; } };\nclass Q : public P { public: Q() { cout << \"Q\" << endl; } ~Q() { cout << \"~Q\" << endl; } };\nclass R : public P { public: R() { cout << \"R\" << endl; } ~R() { cout << \"~R\" << endl; } };\nclass M { public: M() { cout << \"M\" << endl; } ~M() { cout << \"~M\" << endl; } };\n\nclass S : public R, public Q\n{\n    M m;\npublic:\n    S() { cout << \"S\" << endl; }\n    ~S() { cout << \"~S\" << endl; }\n};\n\nint main()\n{\n    S s;\n}",
    "options": [
      "`P R P Q M S ~S ~M ~Q ~P ~R ~P` (one per line)",
      "`P Q P R M S ~S ~M ~R ~P ~Q ~P` (one per line)",
      "`M P R P Q S ~S ~Q ~P ~R ~P ~M` (one per line)",
      "`P R P Q S M ~M ~S ~Q ~P ~R ~P` (one per line)"
    ],
    "answer": 0,
    "explain": "No inheritance is virtual, so S holds two Ps. Order of construction: the bases in the order listed after the colon, `public R, public Q`, each base-first (P then R, then P then Q); then the members (`M m;`); then S's body. Destruction is the exact reverse: ~S, ~M, then the Q chain (~Q ~P), then the R chain (~R ~P)."
  },
  {
    "q": "The same program with `class Q : virtual public P` and `class R : virtual public P`. How many lines print?",
    "type": "numeric",
    "code": "#include <iostream>\nusing namespace std;\n\nclass P { public: P() { cout << \"P\" << endl; } ~P() { cout << \"~P\" << endl; } };\nclass Q : virtual public P { public: Q() { cout << \"Q\" << endl; } ~Q() { cout << \"~Q\" << endl; } };\nclass R : virtual public P { public: R() { cout << \"R\" << endl; } ~R() { cout << \"~R\" << endl; } };\nclass M { public: M() { cout << \"M\" << endl; } ~M() { cout << \"~M\" << endl; } };\n\nclass S : public R, public Q\n{\n    M m;\npublic:\n    S() { cout << \"S\" << endl; }\n    ~S() { cout << \"~S\" << endl; }\n};\n\nint main()\n{\n    S s;\n}",
    "answer": 10,
    "tolerance": 0,
    "explain": "Both middle classes share one virtual P, built first by the most derived class S: P, R, Q, M, S, then ~S, ~M, ~Q, ~R, ~P. One P constructed and destroyed instead of two: 12 - 2 = 10 lines."
  },
  {
    "q": "In the virtual version, type line 3 of the output.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass P { public: P() { cout << \"P\" << endl; } ~P() { cout << \"~P\" << endl; } };\nclass Q : virtual public P { public: Q() { cout << \"Q\" << endl; } ~Q() { cout << \"~Q\" << endl; } };\nclass R : virtual public P { public: R() { cout << \"R\" << endl; } ~R() { cout << \"~R\" << endl; } };\nclass M { public: M() { cout << \"M\" << endl; } ~M() { cout << \"~M\" << endl; } };\n\nclass S : public R, public Q\n{\n    M m;\npublic:\n    S() { cout << \"S\" << endl; }\n    ~S() { cout << \"~S\" << endl; }\n};\n\nint main()\n{\n    S s;\n}",
    "answer": [
      "Q"
    ],
    "explain": "Line 1 is the shared virtual P (virtual bases first), line 2 is R (listed first after the colon), line 3 is Q. R no longer builds its own P, because the most derived class already did."
  }
]
```

## One Number, how many objects

The Week 7 deck asks the same kind of question with a smaller class. Slides 13 to 21 show a `Number` class and `Number createNumber(int num) { return Number(num); }`, then ask: *How many objects of type Number are created?* The slide's class is missing two semicolons; the copy below compiles, and every constructor and the destructor print, so the run counts the objects for you.

```cpp run pin Number.cpp
// predict: Write every line printed. How many Number objects does this program create?
#include <iostream>
using namespace std;

class Number {
private:
    int num;
public:
    Number(int n) : num(n) { cout << "Number(int) " << num << endl; }
    Number(const Number &n2) { num = n2.num; cout << "Number(const Number&) " << num << endl; }
    ~Number() { cout << "~Number " << num << endl; }
};

Number createNumber(int num)
{
    return Number(num);
}

int main()
{
    Number n = createNumber(5);
}
```

```quiz
[
  {
    "q": "In the program above, `Number n = createNumber(5);`: how many objects of type Number are created?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "Real output: `Number(int) 5` / `~Number 5`, so one object. The slide's \"based on code\" picture shows a temporary copied into n by the copy constructor, but since C++17 the elision is guaranteed: `Number(num)` is built directly in n."
  },
  {
    "q": "Same class, main changed to `Number n (Number(2));`. Which constructor is called after the `Number(2)` object is created?",
    "code": "int main()\n{\n    Number n (Number(2));\n}",
    "options": [
      "none: only the one-parameter constructor runs, building `n` directly",
      "the copy constructor, copying the `Number(2)` temporary into `n`",
      "the copy constructor, then the destructor of the `Number(2)` temporary",
      "the one-parameter constructor a second time, with the value 2"
    ],
    "answer": 0,
    "explain": "Real output: `Number(int) 2` / `~Number 2`. The slide's \"based on code\" picture shows a copy constructor after `Number(2)`, but since C++17 the elision is guaranteed: the temporary is never made, and the one-parameter constructor builds n itself."
  }
]
```

Both programs print one constructor line and one destructor line: one object. The deck draws the "based on code" picture first, where `return Number(num);` (or `Number(2)`) makes a temporary and the copy constructor `Number(const Number &n2)` copies it into `n`. Then slide 20 gives the rule. Slide wording: *the compiler optimized our call by avoiding the call to copy constructor and directly called 1 parameter constructor*.

The slides call this an optimization that some compilers may skip. Since C++17 it is guaranteed: an unnamed temporary of the same type that initializes an object is built directly in that object. No temporary exists, so no copy runs, even with `-fno-elide-constructors`. Only slide 16's named version, `Number tempN(num); return tempN;` (NRVO), is still optional; g++ performs it, so that version also prints one object. The full treatment is in [Week 7: copy elision and RVO](#/comp3522-w7/copy-elision-rvo).

## Variations on Q20, Q27 and Q28

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
