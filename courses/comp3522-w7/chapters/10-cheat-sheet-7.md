---
title: Week 7 on one page
minutes: 10
---

The Week 7 deck in tables, in the slide's words where a quiz could quote them. Read it after the mock quiz, then copy the rows you got wrong onto your hand-written midterm sheet (Thursday October 29, 2026, 3:30 pm, SW03-1710, Weeks 1 to 7).

## Static data members (slides 4 to 8)

Only one copy per class exists, shared between instances, with independent static storage for life of program. The **static keyword is used with the declaration, not the definition**: `class X { static int n; };` then `int X::n = 1;` outside. Statics exist even if no objects have been defined.

| Case | In the class | Slide verdict |
|---|---|---|
| plain static | `static int n;` defined `int X::n = 5;` | can't be initialized inside the class definition (`static int m = 5; //ERROR`) |
| `const static`, integral or enumeration | `const static int m = 9;` | can be initialized inside (or outside: `const int X::k = 3;`) |
| `constexpr static` | `constexpr static int arr[] = { 1, 2, 3 };` | must be initialized inside (`constexpr static int k; // ERROR`) |

`static const double * pointer;` cannot be initialized inside: defined `const double * X::pointer = new double[3];` (a pointer to const doubles, not an integral constant). C++17: `inline static int m = 5;` is legal in the class; the exam follows the slide.

| Two ways to access | Example |
|---|---|
| 1. qualified name `Class::member` | `X::n`, `Calculator::add(num1, num2)` |
| 2. member access expression | on an object or a pointer: `obj.n`, `ptr->n` (the slide writes "Class.member"; `X.n` does not compile) |

## Static member functions (slides 9 and 10)

| Restriction | Why |
|---|---|
| 1. can only access static data and invoke static member functions | no object; it can still use an object it is given (`staticFunctionParam(A a)`) |
| 2. there is no `*this` pointer | called without an object |
| 3. cannot be virtual or const | `virtual static void staticFunction() //ERROR`, `static void staticFunction() const //ERROR` |

Applications: classes that don't need to be instantiated to be used. `Calculator c; c.add(num1, num2);` is available only within scope of c; `Calculator::add(num1, num2)` is available globally.

## Copy elision and RVO (slides 12 to 23, 95)

Copy elision: a compiler optimization technique that avoids unnecessary copying of objects. **RVO is a subset of copy elision**, for objects returned from a function; it requires the returned object to be constructed on a return statement and constructs it directly into the memory space of n.

| Case | Code | Copies on g++ | C++17 rule |
|---|---|---|---|
| RVO: return a prvalue | `return Number(num);` into `Number n = createNumber(5);` | none: one Number | guaranteed |
| temporary into a new object | `Number n (Number(2));` | none: only the 1-param constructor | guaranteed |
| NRVO: return a named local | `Number tempN(num); return tempN;` | none (g++ applies it) | optional: "no guarantee that all compilers use" it |
| return a parameter | `return mcCopy;` | one copy for the parameter, one for the return | never elided |

Slide 18, "Based on code": the copy constructor runs after `Number(2)`. Slide 19, "With copy elision": it does not.

The copy constructor is called: 1. when invoking it directly (`MyClass c(otherC); MyClass c1 = c;`), 2. when passing an object by value, 3. when returning an object by value. "HOWEVER!" elision and RVO may remove the return copy. basic.cpp: B is `b(a)`, C the by-value parameter, D the local that NRVO makes into `d`.

## The right-left rule (slides 25 to 42)

1. Start from variable name (var)
2. Keep going right. Read what we see until we see right parentheses `)`
3. Then go left of var. Read what we see until we see left parentheses `(`
4. Exit parentheses and go right. Read what we see until right parentheses or semicolon
5. Go left of where we exited bracket. Read what we see until left parentheses or finish

Repeat steps as needed.

`int (**var[])();` var is an array of pointers to pointers to a function that returns int. `int * (* (*fp1) (int) ) [10];` (is a pointer) (to a function that takes an int parameter) (and returns a pointer) (to an array of 10) (pointers to) (ints). `int *( *( *arr[5])())();` (is an array of 5) (pointers) (to functions) (that return pointers) (to functions) (that return pointers) (to ints).

The eight patterns (the deck's slide 35 shows six; slides 25 and 26 add the two reference forms):

| Declaration | Reading |
|---|---|
| `int ***ppp;` | pointer to a pointer to an int pointer |
| `int (**ppa)[];` | pointer to a pointer to an array of ints |
| `int (**ppf)();` | pointer to a pointer to a function returning an int |
| `int *(*pap)[];` | pointer to an array of int pointers |
| `int (*paa)[][];` | pointer to an array of arrays of ints (does not compile: inner bound missing) |
| `int (*paf)[]();` | pointer to an array of functions returning an int (does not compile: no arrays of functions) |
| `int (&ref) [100] = a;` | reference to an array of 100 ints |
| `void swap(int*&p, int *&q)` | p and q are references to pointers to int: swap exchanges the pointers |

## The review, one line each (slides 45 to 98)

- **References**: a reference is an alias or nickname for an existing variable. Use one to change the original (`add(int &x)` prints 5, `add(int xCopy)` prints 0), to avoid copies (`const MyClass& mc`), and for polymorphic behavior (`animalSpeak(Animal &a)`).
- **Pointers versus references**: `int *numPtr; //OK` but `int &numRef; //ERROR`; a pointer can be `nullptr`, a reference can't; `numPtr = &num2;` reseats, `numRef = num2;` can NOT change numRef to refer to num2, it sets num's value.
- **Operators**: unary (`++x x++ --x x-- !x`): implement as member functions. Binary operands that modify the left operand (`+=`, `-=`): member functions. `+, -, ==, !=` produce a new value: implement as friendly non-member functions.
- **Virtual, three places**: virtual functions (without them, classes are not polymorphic: `animalPtr->speak()` prints `???`; write virtual once in the base, no need to write it again); virtual destructors (child's destructor, then parent's; without one `delete a;` runs only `~Animal` (undefined behaviour; what g++ prints); base classes should always have a virtual destructor); virtual inheritance (`class B : virtual public A`; one A, and the most derived class D is responsible for calling A's constructor).
- **Functions**: regular functions don't belong to a class; member functions defined outside are scoped `void MyClass::myFunction() {}`; a friend function is a non-member with access to private and protected members: don't scope friend function definitions. Slide 92's by-value friend prints 1 and leaves main's x at 0.
- **Copy constructor**: the built-in one makes shallow copies, which don't copy dynamic memory (slide 97: both point at one int). Deep copy: `MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {}` (slide 98: each has its own int).

```quiz
[
  {
    "q": "The static keyword is written on the out-of-class definition: `static int X::n = 1;`.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Slide 4: static keyword used with declaration not definition, so the definition is `int X::n = 1;`; repeating `static` there is a compile error."
  },
  {
    "q": "`const static int m = 9;` can be initialized inside the class definition.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. Slide 7: constant integral or enumeration types can be initialized inside the class definition; a plain static cannot (slide 6), and a constexpr static must be (slide 8)."
  },
  {
    "q": "Slide 6: a plain `static int m = 5;` inside the class definition is an ERROR.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true, by the slide's rule, and g++ still rejects it. C++17 truth: adding `inline` (`inline static int m = 5;`) makes the in-class initializer legal."
  },
  {
    "q": "A static member function can be marked `const`.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Slide 9: cannot be virtual or const. A const member function promises not to change `*this`, and a static function has no this pointer."
  },
  {
    "q": "Slide 16: there's no guarantee that all compilers use RVO and NRVO.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true for the slide. C++17 truth: initializing from a prvalue (`return Number(num);`, `Number n(Number(2));`) is guaranteed to elide; only NRVO stays optional."
  },
  {
    "q": "Returning a by-value parameter (`return mcCopy;`) can be elided by NRVO.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. NRVO only applies to a local object created in the function; a returned parameter is never elided (copied, or moved if it can be), so slide 95 prints two copy constructor lines after the 1-param one."
  },
  {
    "q": "`int (**ppf)();` reads: ppf is a pointer to a pointer to a function returning an int.",
    "type": "tf",
    "answer": true,
    "explain": "Key: true. Start at ppf, nothing to the right but `)`, go left: `**`, pointer to a pointer. Exit and go right: `()`, a function. Go left: returning an int."
  },
  {
    "q": "`int (*paa)[][];` compiles.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. It reads as a pointer to an array of arrays of ints, but an array's element type must be complete, so only the first bound may be left out; g++ rejects it."
  },
  {
    "q": "After `int& numRef = num;`, the line `numRef = num2;` makes numRef refer to num2.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Slide 56: a reference can NOT be changed to refer to num2; the line copies num2's value into num. A pointer is reseated with `numPtr = &num2;`."
  },
  {
    "q": "`x + y` should be implemented as a member function because it is a binary operator.",
    "type": "tf",
    "answer": false,
    "explain": "Key: false. Slide 66: `+, -, ==, !=` modify neither operand and produce a new value, so implement them as friendly non-member functions. Only binary operators that modify the left operand (`+=`, `-=`) are members."
  }
]
```
