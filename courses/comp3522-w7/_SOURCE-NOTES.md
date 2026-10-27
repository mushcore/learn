# COMP 3522 Week 7: facts, programs and outputs transcribed from the instructor's material

Source files: `D:\BCIT\COMP3522\Lectures\Week 7\3522 Week 72.pdf` (98 slides; text copy `D:\BCIT\COMP3522\Lectures\txt\3522 Week 72.txt`; agenda on slide 2: 1. Static 2. Copy Elision & Return value optimization 3. Right left rule; review agenda on slide 44: 1. References 2. Overloaded operators 3. Virtual 4. Functions 5. Copy constructor) and the sample repo `comp-3522-fall-2026-course-sample-code-mushcore-main\Week7\`: static/static.cpp, static_functions/main.cpp, Calculator, StaticCalculator, basic/basic.cpp, copy_elision/copy_elision.cpp, Inheritance/main.cpp, Inheritance2/main.cpp, oop_multi3/oop_multi3.cpp, operators, operatorsBasic (the top-level folders duplicate `Day1/` and `Day2Review/`; the only differences are `static.cpp`, where Day1 has the slide-7 `static const double * pointer` form, and `operators/Character.hpp`, where Day2Review lacks the string overloads). Recon: `spec/comp3522-w7/RECON-WEEK7-DECK.md`. Slide numbers are PDF page numbers. Diagrams lost in the text: the constructor-call arrows on slides 13 to 21, the memory boxes on 46 to 51 and 97 to 98, the diamonds on 79 to 86. Links on the slides: geeksforgeeks copy-elision-in-c (12, 20), fluentcpp 2016/11/28 return-value-optimizations (16), YouTube https://youtu.be/fSB57PiXpRw (21).

Every output below is what the app's server returned (`POST http://localhost:4321/api/run`, GCC 13.1.0 mingw, `__cplusplus` 202002, flags `-std=c++20 -Wall -Wextra -pedantic`), captured 2026-10-26. The exact program text for each output is kept at the scratch path given (`docs/superpowers/tools/tmp/w7/`, gitignored); the slide-typed programs are also reproduced in full here, since the scratch folder is not committed. Regenerate: `make_samples.py`, `mkchecks.py`, `make_variants.py`, then `runall.py` in that folder.

## 1. static-data-members (slides 2 to 8)

- Slide 4, "Static declarator": in C++, member variables can be static: **only one copy per class exists**; permit a single resource to be shared between instances; independent static storage for life of program; useful for the Singleton design pattern ("we'll look at it later, but the name is a hint"); **static keyword used with declaration not definition**. `class X { static int n; }; // incomplete declaration` / `int X::n = 1; // definition outside class`.
- Slide 5, "Accessing statics": two forms: 1. qualified name `Class::member`; 2. member access expression "`Class->member or Class.member`". Statics **exist even if no objects have been defined**. Correction (see Deck errors): the member access form works on an object or a pointer (`obj.n`, `ptr->n`), never on the class name; `X.n` does not compile (verified below).
- Slide 6, "Initializing static": "Can't be initialized inside the class definition": `class X { static int m = 5; //ERROR  static int n; //OK }; int X::n = 5; //OK`.
- Slide 7, "Static constants: const": "constant integral or enumeration types can be initialized inside the class definition": `const static int m = 9; //can be initialized inside`, `const static int k;` defined `const int X::k = 3; //initialized outside`, `static const double * pointer; //cannot be initialized inside` defined `const double * X::pointer = new double[3]; //initialize outside`.
- Slide 8, "Static constants: constexpr": "constant expression must be initialized with a literal inside the class definition": `constexpr static int arr[] = { 1, 2, 3 }; // OK`, `constexpr static std::complex<double> n = {1,2}; // OK`, `constexpr static int k; // ERROR`.
- The lesson states the three cases: plain static: initialize outside only; `const static` integral or enum: inside allowed; `constexpr static`: inside required. One sentence: C++17 `inline static int m = 5;` is legal in the class (verified below); the exam follows the slide's rule.
- Program: `static/static.cpp` (outputs below). Slide 22 also uses `basic::counter` (lesson 4).

## 2. static-member-functions (slides 9 to 10)

- Slide 9: "Can only access static data and invoke static member functions"; "There is no *this pointer"; "Cannot be virtual or const": `virtual static void staticFunction() //ERROR`, `static void staticFunction() const //ERROR`. Files: static.cpp, static_functions.cpp. Correction: a static function reaches non-static members through an object (`staticFunctionParam(A a)` calls `a.nonStaticFunction()`).
- Slide 10, "Applications?": "Classes that don't need to be instantiated to be used"; "Static calculator": "A class that contains a series of common math operations", "Add, subtract, multiply, divide", "Instead of instantiating a Calculator class, just call it statically": `//available only within scope of c variable  Calculator c; c.add(num1, num2);` versus `//available globally  Calculator::add(num1, num2)`. Files: calculator.cpp & staticCalculator.cpp.
- Programs: `static_functions/main.cpp`, `Calculator` and `StaticCalculator` side by side (both print `15 5 150 50`).

## 3. copy-elision-rvo (slides 11 to 21)

- Slide 12: "Copy Elision (or copy omission) is a compiler optimization technique that avoids unnecessary copying of objects"; "Return value optimization is a subset of copy elision. Avoids unnecessary copying of objects returned from a function" (nested-boxes diagram: RVO inside copy elision).
- Slides 13 and 14: the `Number` class (`int num`, `Number(int n) : num (n) {}`, `Number(const Number &n2) {num = n2.num;}`) and `Number createNumber(int num) { return Number(num); }` with `Number n = createNumber(5);`. Slide 14 asks: "How many objects of type Number are created?" The slide's code is missing `;` after `int num` and after the class's `}`.
- Slide 15, RVO: "Return value optimization lets the compiler remove the temporaries by directly initializing n"; "Directly constructs the object initialized inside the createNumber function into the memory space of n"; "Happens automatically, but requires returned object to be constructed on a return statement".
- Slide 16, NRVO: "Named return value optimization can remove the temporaries by directly initializing n even if the returned object is named": `Number tempN(num); return tempN;`. "Note, there's no guarantee that all compilers use RVO and NRVO".
- Slides 17 to 19: `Number n (Number(2));` "Which constructor is called after Number(2) object created?" Slide 18 "Based on code" (copy constructor), slide 19 "With copy elision" (none).
- Slide 20: "In our example, the compiler optimized our call by avoiding the call to copy constructor and directly called 1 parameter constructor".
- Slide 21: `Number n = createNumber(5);` again with the YouTube link.
- The correction the lesson states: since C++17, elision from a prvalue of the same type is guaranteed (`return Number(num);` into `n`, and `Number n(Number(2));`); NRVO is still optional; returning a parameter is never elided. Server: all three of slide 13, 16, 17 print only `1-param constructor`; the parameter case prints two copies (programs below).
- Slide-question answers for the quizzes: slide 14 with RVO: one `Number` object, built directly in `n`. Slide 17: after `Number(2)` no further constructor runs (the copy constructor call is elided).

## 4. copy-constructor-calls (slides 22 to 23, plus 95)

- Slide 22, ACTIVITY: "The compiler will often elide copies when we are creating an object and returning it by value from a function." "Take a peek at copy_elision.cpp and basic.cpp". Note: 1. use of a static member variable inside the basic class; 2. initialization of the static member outside the class ("it's a global!"); 3. function use_basic accepts an object by value, copies it, then returns a copy of the copy. "Examine the output. Does it make sense? When is a copy constructor invoked?"
- Slide 23, "When is the copy constructor called?": 1. "When invoking the copy constructor directly." `MyClass c(otherC); MyClass c1 = c;` 2. "When passing an object by value to a function" `void myFunc(MyClass c) {}` 3. "When returning an object by value from a function." `MyClass myFunc() { MyClass c; return c; }` "HOWEVER! Copy Elision and Return Value Optimization may be used by some compilers to eliminate a temporary object created to hold a function's return value."
- Slide 95: `MyClass mc; MyClass mc2(mc);`; "Implicitly calling copy constructor whenever we pass by value, return by value": `MyClass mc2 = myFunction(mc);` with `MyClass myFunction(MyClass mcCopy) { //local mcCopy is a copy of the mc that was passed in. This copy is created using your copy constructor  return mcCopy; //return value is also copied }`.
- Programs: `basic.cpp` and `copy_elision.cpp` (outputs and letter assignments below); `basic.cpp` is where `static char counter` and `char basic::counter = 'A';` are seen in use.

## 5. right-left-rule (slides 24 to 42)

- Slide 25: `int a [100]; int (&ref) [100] = a;` (a reference to an array of 100 ints). Slide 26: `void swap(int*&p, int *&q) { int* temp = p; p = q; q = temp; }` (references to pointers; server run below prints `2 1 1 2`).
- Slides 27 to 31, `int (**var[])();` in the slide's words: "Start from variable name (var)" → "var is ..."; "Keep going right. Read what we see until we see right parentheses )" → "var is an array..."; "Then go left of var. Read what we see until we see left parentheses (" → "var is an array of pointers to pointers ..."; "Exit parentheses and go right. Read what we see until right parentheses or semicolon" (slide 31: "Exit bracket and go right ... until we see right parentheses or semicolon") → "var is an array of pointers to pointers to a function ..."; "Go left of where we exited bracket. Read what we see until left parentheses or finish"; "Repeat steps as needed" → "var is an array of pointers to pointers to a function that returns int". Slide 32 repeats 31 with the typo "go left of ppf".
- Slide 33, `int * (* (*fp1) (int) ) [10];`: "Start from the variable name (fp1)"; "Nothing to right but ) so go left to find * (is a pointer)"; "Jump out of parentheses and encounter (int) (to a function that takes an int parameter)"; "Go left, find *(and returns a pointer)"; "Jump put of parentheses, go right and hit [10] (to an array of 10)" (typo "put"); "Go left find * (pointers to)"; "Go left again, find int (ints)".
- Slide 34, `int *( *( *arr[5])())();`: "Start from the variable name (arr)"; "Go right, find array subscript (is an array of 5)"; "Go left, find * (pointers)"; "Jump out of parentheses, go right to find () (to functions)"; "Go left, encounter * (that return pointers)"; "Jump out, go right, find () (to functions)"; "Go left, find * (that return pointers)"; "Continue left, find int (to ints)."
- Slide 35: the six declarations `int ***ppp; int (**ppa)[]; int (**ppf)(); int *(*pap)[]; int (*paa)[][]; int (*paf)[]();`. Slides 36 to 41, the options verbatim (the slide capitalizes the names) and the keyed answer from the recon report:
  - 36 `int ***ppp;` 1. Ppp is an int pointer to a pointer to a pointer 2. **Ppp is a pointer to a pointer to an int pointer** 3. Ppp is a pointer an int pointer to a pointer 4. Ppp is a pointer to a pointer to a pointer returning an int. Answer 2.
  - 37 `int (**ppa)[];` 1. Ppa is an array of pointer to a pointer returning ints 2. Ppa is an int pointer to a pointer to an array 3. Ppa is an array of pointers to int pointers 4. **Ppa is a pointer to a pointer to an array of ints**. Answer 4.
  - 38 `int (**ppf)();` 1. **Ppf is a pointer to a pointer to a function returning an int** 2. Ppf is a pointer to a function returning integer pointers 3. Ppf is a function pointing to an integer pointer 4. Ppf is a int pointer to a pointer to a function. Answer 1.
  - 39 `int *(*pap)[];` 1. Pap is a pointer to an integer to a pointer to an array 2. Pap is an integer array of pointers to pointers 3. Pap is an array of pointers to pointers to ints 4. **Pap is a pointer to an array of int pointers**. Answer 4.
  - 40 `int (*paa)[][];` 1. Paa is an array of arrays to pointers to ints 2. **Paa is a pointer to an array of arrays of ints** 3. Paa is an integer pointer to an array of arrays 4. Paa is an array of pointers to an array of ints. Answer 2 (does not compile: see below).
  - 41 `int (*paf)[]();` 1. Paf is a function to an array of int pointers 2. Paf is a int pointer to an array of functions 3. Paf is a pointer to an int array of functions 4. **Paf is a pointer to an array of functions returning an int**. Answer 4 (does not compile: see below).
- Slide 42, "Even more!": `int *ptr_to_int; int *func_returning_ptr_to_int(); int (*ptr_to_func_returning_int)(); int (*array_of_ptr_to_func_returning_int[])();` "CRAZINESS: `int (*(*ptr_to_an_array_of_ptr_to_func_returning_int)[])();`" "Final note: if possible, please don't write messy declarations like this".
- Server checks: `int (*paa)[][];` → `error: declaration of 'paa' as multidimensional array must have bounds for all dimensions except the first`; `int (*paf)[]();` → `error: declaration of 'paf' as array of functions`; `int (**var[])();` as a standalone definition → `error: storage size of 'var' isn't known` (fine with a bound or initializer). `int (&ref)[100]`, `int (**ppf)()`, `int (**var[1])()`, `fp1`, `arr[5]`, `ppp`, `ppa`, `pap` all compile and work (`chk-rl-declarations.cpp` prints `1 7 7 3 1 111`).

## 6. review-references-operators (slides 45 to 66)

- Slide 46: "A reference is an alias or nickname for an existing variable" and can change the value. Slides 46 to 48: `int x = 0; int &xRef = x; //xRef is a nickname for x  xRef += 5; //x changes to 5  cout << x` prints 5. Slides 49 to 51, dereferencing ("more associated with pointers than references"): `int *xPtr = &x; *xPtr += 5;` prints 5 (xPtr at 0xaaaa holding 0xffff).
- Slide 52, "When we need to change the original value of a variable when passed into a function": pass by value `void add(int xCopy) { xCopy += 5; //local xCopy changes to 5 }` prints 0; pass by reference `void add(int &x) { x += 5; //original x changes to 5 }` prints 5.
- Slide 53: to avoid copies: `void print(const MyClass& mc) { cout << mc.getX(); }`.
- Slide 54, "To allow polymorphic behavior (also works with pointers)": `virtual void speak() = 0;`, Dog "woof", Bird "chirp", `void animalSpeak(Animal &a) { a.speak(); //calls polymorphic speak function }`.
- Slides 55 and 56, pointers versus references (one table in the lesson): pointers hold addresses, a reference is a nickname; `int *numPtr; //OK` versus `int &numRef; //ERROR` ("outside of class data members"); `int *numPtr = nullptr; //OK` versus `int &numRef = NULL //ERROR`; `*numPtr = 5;` versus `numRef = 5;`; `numPtr++` moves to the next element versus `int (&numRef)[3] = arr; numRef[0]++;`; `numPtr = &num2;` reseats versus `numRef = num2;` "can NOT change numRef to refer to num2. Sets num's value to 10".
- Slides 58 to 60: why overload: `cout << ms.getString();` versus `cout << ms;`; `ms.append(s);` versus `ms += s;`; "Assignment 1 could have been written to use no overloaded operators" (Matrix `m.add(2)` versus `m += 2`).
- Slides 62 to 66: member or friend non-member? Factors: 1. unary or binary? 2. does the binary operator modify an operand? Unary `++x x++ --x x-- !x`: "implement as member functions". Binary `x += y, x -= y, x+y, x-y, x == y, x != y`: only `+=` and `-=` change x; "Binary operands that modify the left operand should be implemented as member functions"; `+, -, ==, !=` produce a new value: "Implement as friendly non-member functions". Files: operatorsBasic.cpp, operators.cpp.
- Links: Week 2 `comp3522-w2/chapters/04-pointers.md`, `05-references.md`; Week 4 `comp3522-w4/chapters/06-operator-overloading.md`.

## 7. review-virtual (slides 67 to 86)

- Slide 68 (titled "Overloaded operators", a title error): `virtual` appears in three places: virtual functions, virtual destructors, virtual inheritance. "The effects of adding virtual differ even though the same keyword is used."
- Slide 70: "Without virtual functions, classes are not polymorphic." "Pointers and references can NOT dynamically determine the correct function to call at runtime"; `bird.speak(); //Chirp`, `animalPtr->speak(); //???`. Slide 71: with `virtual void speak()` "classes become polymorphic", both print Chirp. Slide 72: write `virtual` the first time the function appears in a base class; children inherit it, "no need to write virtual keyword again".
- Slide 74: "When a destructor of a child type is destroyed, it will execute its own destruction code, then call its parent's destructor"; `Dog d;` prints `Dog destroyed` / `Animal destroyed`. Slide 75: "Problem happens when we destroy a pointer/reference of a base type, assigned to a child type object"; `Animal *a = new Dog; delete a;` prints `Animal destroyed`; "BAD". Slide 76: the pointer's type is Animal, so Animal's destructor is called; not polymorphic. Slide 77: "Need to add virtual in front of the base class' destructor to polymorphically call the proper child type's destructor first"; "Base classes should always have a virtual destructor"; prints `Dog destroyed` / `Animal destroyed`. Files: Inheritance.cpp, Inheritance2.cpp. The lesson adds one sentence: deleting through a base pointer without a virtual destructor is undefined behaviour, and "Animal destroyed" is what GCC happens to print.
- Slides 79 to 82 (titled "Virtual destructor", a title error): multiple inheritance can form a diamond and A's constructor is called more than once: "Instantiating class D calls the constructors of B and C. Therefore both B and C call the constructors of each of their A parents". Slide 83: `class B : virtual public A {...}`, `class C : virtual public A {...}` gives a true diamond. Slide 84: a derived class is responsible for calling its base constructor (otherwise the compiler inserts the default); only one A (the slide says "person") because B and C both mark A virtual; B and C refer to a common A object that is part of the most derived class D. Slides 85 and 86: the most derived class D is responsible for calling A's constructor during its own construction; D implicitly calls A's default constructor, but D's constructor can call any constructor of A. File: oop_multi3.cpp.
- Links: Week 3 lesson 7 `comp3522-w3/chapters/07-polymorphism-virtual.md`; Week 4 lesson 4 `comp3522-w4/chapters/04-diamond-virtual-base.md`.

## 8. review-functions-copy-ctor (slides 87 to 98)

- Slide 88, "Regular" functions: group code for a task, don't belong to a class: `void myFunction() {}`. Slide 89, member functions: belong to a class (get/set, operate on data members), declared and defined in the class: `class MyClass { void myFunction() { //code; } }`. Slide 90: declared in the class, defined outside: `void MyClass::myFunction() {}`, scoped with `MyClass::`.
- Slide 91, friend functions: a non-member function with access to the private/protected members of the class that declares it; not a member even though declared in the class; visibility specifiers don't affect it; defined inside or outside the class.
- Slide 92: `class MyClass { private: int x = 0; friend void friendFunc(MyClass mc); };` `void friendFunc(MyClass mc) { mc.x++; std::cout << mc.x; }`, called from main. "mc.x is private, which is normally not accessible. But because friendFunc is a friend function declared within MyClass, it has access to all MyClass' data members". Trace: prints `1`; main's `mc.x` stays 0 (the parameter is a copy).
- Slide 93: when to use friends: overloading operators, access to private data; "Shouldn't abuse ability to access private data by making all classes friends", create accessors and mutators instead; "Don't scope friend function definitions because friend functions don't belong to a class": `void MyClass::friendFunc(MyClass mc) {...}` is the wrong form.
- Slides 94 to 96: copy constructor used to copy an existing object into a new one (slide 95 above); why: the built-in copy constructor makes shallow copies, which don't copy dynamic memory; not needed when there are no dynamic-memory members and no pointers to memory that needs a deep copy.
- Slide 97: "Did NOT write a copy constructor, so default copy constructor copied the address mc is pointing to, to mc2"; "both mc and mc2 are pointing to the same object". Slide 98: "Wrote our own copy constructor"; "Allocate new dynamic memory for int, copy value from the other ptr, make ptr point to it"; `MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {} //deep copy of other int`; "mc & mc2 now point to their own copies of int".
- Links: Week 3 lesson 3 `comp3522-w3/chapters/03-copy-constructor.md`; Week 4 lessons 5 and 7 `comp3522-w4/chapters/05-friends.md`, `07-copy-assignment.md`.

## 9. mock-quiz-7

Lab-quiz format: static rules as true/false; the two `Number` questions as what-prints with a real program (slide13-rvo, slide17-temp); three right-left readings; review what-prints items from slides 52, 54, 70 to 77, 92 (outputs below); one `challenge`: a class with a static counter and a static getter.

## 10. cheat-sheet-7

One page of Week 7 facts in slide wording: static initialization three cases, static-function restrictions, elision three cases (prvalue guaranteed, NRVO optional, parameter never), the three copy-constructor calls, the right-left five steps, references versus pointers, member versus friend operators, the three meanings of virtual.

## Deck errors and C++17 corrections

(From `RECON-WEEK7-DECK.md` section 5, with server checks added.)

**Static members**
- **Slide 5:** "`Class->member or Class.member`". Member access works on an object or pointer (`obj.member`, `ptr->member`), not on the class name. It is a wording slip, but a quiz could trip on it. Server: `X.n` → `error: expected primary-expression before '.' token`; `X::n`, `obj.n`, `p->n` all work (`chk-slide5-class-dot.cpp` prints `111`).
- **Slide 6:** "Can't be initialized inside the class definition". This was true before C++17. Since C++17, `inline static int m = 5;` is legal in the class (server: `chk-slide6-inline-static.cpp` prints `5`). Without `inline` (and without const integral or constexpr), the slide's ERROR is still correct (server: `error: ISO C++ forbids in-class initialization of non-const static member 'X::m'`).
- **Slide 8:** "must be initialized with a literal". Strictly, it must be initialized with a constant expression, and the type must be a literal type (as `std::complex<double>` shows). Not just a literal. Since C++17, constexpr static data members are implicitly inline, so they need no out-of-class definition. Server: the two OK lines compile and run (`3 2`); `constexpr static int k;` → `error: 'constexpr' static data member 'k' must have an initializer`.
- **Slide 7:** `static const double * pointer` is a non-const pointer to const double, so the rule that applies is the plain-static rule, not a "static constants" rule. The example is fine, but the reason given is muddled. `new double[3]` gives uninitialized, read-only doubles, which is a pointless allocation. Server: the slide's class compiles (`9 3`); `static const double * pointer = nullptr;` inside → `error: 'constexpr' needed for in-class initialization of static data member 'const double* X::pointer' of non-integral type`.
- **Slide 9:** "Can only access static data". More precisely, a static function can reach non-static members through an object (the sample's `staticFunctionParam(A a)` calls `a.nonStaticFunction()`). "Cannot be virtual or const" is correct. Server: `error: member 'staticFunction' cannot be declared both 'virtual' and 'static'`; `error: static member function 'static void X::staticFunction()' cannot have cv-qualifier`.

**Copy elision and RVO**
- **Slides 15, 16, 20, 23** (and 12, which calls elision an "optimization"): **outdated for C++17.**
  - Since C++17, elision is **guaranteed**, not optional, when initializing from a prvalue of the same type. That covers `return Number(num);` with `Number n = createNumber(5);`, and `Number n(Number(2));`. It is no longer an optimization "some compilers" may do. It works even when the copy and move constructors are deleted, and `-fno-elide-constructors` doesn't disable it.
  - Only **NRVO** (slide 16, the `return tempN;` case) is still optional. The "no guarantee all compilers use" warning is correct only for NRVO.
  - Under `-std=c++17` or later, the three alternative outputs listed in copy_elision.cpp's comments collapse to the fully elided one for the prvalue cases.
- **Slides 23 and 95:** "returning by value calls the copy constructor". Since C++11, `return local;` first tries the **move** constructor. `Number`/`MyClass` have a user-declared copy constructor and no move constructor, so the copy is used here, but the general statement is outdated.
- **Slide 95:** `return mcCopy;` where `mcCopy` is a function **parameter**. NRVO can never apply to a parameter, so that copy (or move) really happens. The slide is right here, and this contrasts usefully with slide 16. Server: `slide95-param.cpp` prints two `copy constructor` lines.
- **Slides 13–21:** the `Number` class lacks `;` after `int num` and after the closing `}`. As printed, the code does not compile.

**Right-left rule**
- **Slide 40:** `int (*paa)[][];` is **ill-formed**. An array's element type must be complete, so only the first bound may be omitted.
- **Slide 41:** `int (*paf)[]();` is **ill-formed**. C++ has no arrays of functions.
- Both work as RL-rule reading exercises, but neither compiles. Tell students so. (Server errors quoted in section 5.)
- **Slide 27:** `int (**var[])();` as a standalone definition with no bound and no initializer is also ill-formed (incomplete array type). It is fine as `extern` or with an initializer. Minor.
- Typos: slide 32 "go left of ppf" should be "var"; slide 33 "Jump put of" should be "out of".

**Review section**
- **Slides 75–76** treat `delete a;` through a base pointer with a non-virtual destructor as printing "Animal destroyed". That is **undefined behaviour**. It commonly prints that, but the output isn't guaranteed. (The server prints `Animal destroyed`; GCC gives no warning here because Animal has no virtual functions. Inheritance2.cpp, whose Animal does have a virtual function, draws `-Wdelete-non-virtual-dtor`.)
- **Slide 75** also says students expect "animal destroyed, dog destroyed", which is the reverse of the correct order shown on slides 74 and 77 (Dog first). This is a deck inconsistency.
- **Slide 77:** "Base classes should always have a virtual destructor". The modern guideline (C++ Core Guidelines C.35) applies this to polymorphic bases: make the destructor public and virtual, or protected and non-virtual.
- **Slide 72:** "No need to write virtual keyword again" is correct. Modern practice is to mark overrides with `override` (C++11), which the deck never mentions.
- **Slides 70–72:** `new Bird` is never deleted.
- **Slides 64–66:** the member versus friend guidance is a convention, not a rule. Some operators must be members (`=`, `[]`, `()`, `->`), and `operator<<` with `ostream` must be a non-member. In C++20, `==` can be defaulted, `!=` is rewritten from `==`, and `<=>` exists. None of this is mentioned. Fine for the course, but worth a footnote.
- **Slides 96–98:** they present the copy constructor alone. The deep-copy `MyClass` has no destructor (it leaks) and no copy assignment, so it violates the rule of three. Week 4's copy-assignment lesson covers this.
- **Title errors:** slide 68 is titled "Overloaded operators" but covers virtual. Slides 79–82 are titled "Virtual destructor" but cover virtual inheritance. Slide 84 says "person base class" for A.
- **Slide 92's** friend takes `MyClass` by value, so `mc.x++` changes only the copy. That is not wrong, but it is a nice trace question: it prints 1, and main's object is unchanged.

## Program outputs (server, g++ -std=c++20)

Scratch folder: `D:/BCIT/learn/docs/superpowers/tools/tmp/w7/`. "Warnings" are the `-Wall -Wextra -pedantic` diagnostics in `compile.stderr` (run-cpp.py discards them on success; `runall.py` prints them). A `cpp run pin` copy must be byte-for-byte the scratch file unless the lesson says what it changed.

### Sample programs

#### static/static.cpp → `tmp/w7/static.cpp` (Day1 variant `tmp/w7/static-day1.cpp`)
No warnings (either version). Output:
```
A() created
B() created
B() created
7.07242e-312 7.07243e-312 1.44031e-13
b - 1 2 3
b2 - 1 2 3
B:: - 1 2 3
b private a: 2
b2 private a: 2
B() destroyed
B() destroyed
A() destroyed
```
- **Line 4 is indeterminate**: `new double[3]` leaves the doubles uninitialized, and the values differ between runs (the Day1 run printed `1.15199e-311 1.15198e-311 1.44031e-13`). A `// predict:` must not quote that line; teach it as "garbage, never initialized", or change the definition to `new double[3]{}` and say so (prints `0 0 0`; not run).
- `A() created` prints before `B() created` because the static `A B::my_a = A{};` is built before `main` starts; `A() destroyed` prints after main's objects are gone. One A for two Bs: `b.increment(); b2.increment();` both reach the same `my_a`, so both print 2. `b.pointer`, `b2.pointer` and `B::pointer` are one pointer.
- `delete b.pointer;` on memory from `new double[3]` is undefined behaviour (needs `delete[]`); GCC gave no warning. The Day1 version (the slide-7 `static const double * pointer` form) writes through `const_cast<double *>` and has no delete; same output.

#### static_functions/main.cpp → `tmp/w7/static_functions.cpp`
No warnings. Output:
```
---Calling static function that calls another static function---
staticFunction1
Printing static number: 5
staticFunction2

---Calling static function that accepts a parameter to call a non static function---
staticFunctionParam
nonStaticFunction
Printing non static name: My name is class A
```

#### Calculator (Calculator.hpp + Calculator.cpp + main.cpp merged) → `tmp/w7/Calculator.cpp`
No warnings. Output: `15` / `5` / `150` / `50` (one per line).

#### StaticCalculator (merged the same way) → `tmp/w7/StaticCalculator.cpp`
No warnings. Output: `15` / `5` / `150` / `50`, identical to Calculator: the only difference is `static` on `add` and `subtract` and the calls `Calculator::add(x,y)` with no `Calculator c;`.

#### basic/basic.cpp → `tmp/w7/basic.cpp`
No warnings. Output:
```
Constructing basic a using default constructor
basic A Default constructor
Creating basic b using copy constructor and basic A
basic B Copy constructor
Passing basic a by value to a function
basic C Copy constructor
Entered use_basic
Instantiating a local basic using the cc and the basic passed as a param
basic D Copy constructor
Returning a basic that was created locally (returning it by VALUE so it works)
basic C Destructor
Creating an array of 5 basics
basic E Default constructor
basic F Default constructor
basic G Default constructor
basic H Default constructor
basic I Default constructor
basic I Destructor
basic H Destructor
basic G Destructor
basic F Destructor
basic E Destructor
basic D Destructor
basic B Destructor
basic A Destructor
```
- Letters: **A** = `a`; **B** = `b` (`basic b(a)`); **C** = the parameter `c` (pass by value copies `a`); **D** = `local` (`basic local(c)`), and because GCC applied **NRVO** to `return local;`, D *is* `d` in main: no copy for the return, and no "D Destructor" inside `use_basic`. **E to I** = `array[0]` to `array[4]`.
- `basic C Destructor` prints right after the return, before "Creating an array": GCC destroys the by-value parameter when `use_basic` returns (when a parameter is destroyed is implementation-defined; GCC does it at the end of the call).
- Destruction at the end of main is reverse order of construction: I H G F E (the array, last element first), then D (`d`), B, A.
- What a non-eliding compiler would print instead (reasoned, not run: the server takes no extra flags): with NRVO off (`-fno-elide-constructors` under C++17/20) `return local;` copies `local` into `d`, so a `basic E Copy constructor` line appears after "Returning ...", then `basic D Destructor` (the local) and `basic C Destructor`; the array becomes F to J, and the final destructors are J I H G F, E, B, A.

#### copy_elision/copy_elision.cpp → `tmp/w7/copy_elision.cpp` (as shipped)
Warning: `variable 'obj3' set but not used [-Wunused-but-set-variable]`. Output:
```
Hello World!
Default constructor.
A copy was made.
```
`C c;` is the default constructor and `C obj3 = c;` copies an lvalue, a real copy that is never elided. The text matches the file comment's **second** prediction, but only because the two elision lines are commented out.

#### copy_elision with the two commented lines uncommented → `tmp/w7/copy_elision-uncommented.cpp`
Changes: `//C obj = C{};` → `C obj = C{};` and `//C obj2 = f();` → `C obj2 = f();`. Warnings: `variable 'obj'`, `'obj2'`, `'obj3' set but not used [-Wunused-but-set-variable]`. Output:
```
Hello World!
Default constructor.
Default constructor.
Default constructor.
A copy was made.
```
`C obj = C{};` → `Default constructor.` only (guaranteed elision from a prvalue). `C obj2 = f();` → `Default constructor.` only: `return C{};` is a prvalue, so the object is built straight into `obj2`. The file comment's three predictions describe `C obj2 = f();` with two copies (no elision), one copy, or none: the server matches the **third** (fully elided, `Hello World!` / `Default constructor.` for that statement). Then `C c; C obj3 = c;` add `Default constructor.` and `A copy was made.`
- What a non-eliding compiler would print instead (reasoned, not run: the server takes no extra flags): under C++17 or later, nothing changes. Both statements initialize from a prvalue, and that elision is guaranteed even with `-fno-elide-constructors`. Only under `-std=c++14 -fno-elide-constructors` does `C obj = C{};` add one `A copy was made.` (the temporary copied into `obj`) and `C obj2 = f();` add two (`C{}` into the return value, the return value into `obj2`): the file comment's first prediction. Its middle prediction, one copy, is a pre-C++17 compiler that elides only one of the two. `C obj3 = c;` copies in every mode.

#### Inheritance/main.cpp → `tmp/w7/Inheritance.cpp`
Warnings: `unused parameter 'a'` / `'b'` / `'c' [-Wunused-parameter]` on the three copy constructors; `base class 'class Animal' should be explicitly initialized in the copy constructor [-Wextra]` on Bird's and Canine's. Output:
```
Push canine
Copy Animal
Push bird 1
Copy Animal
Copy Animal
Push bird 2
Copy Animal
Copy Animal
Copy Animal
Finish pushing animals
Animal speak?
Animal speak?
Animal speak?
```
- `vector<Animal>` stores Animals: each `push_back` copies (slices) the Canine or Bird into an `Animal` ("Copy Animal"; `Animal` has a user-declared copy constructor, so no move constructor). The vector's capacity grows 1, 2, 4, so "Push bird 1" also copies the 1 existing element and "Push bird 2" the 2 existing ones: 1, 2, 3 copies. `createCanine()` and `createBird()` return prvalues, so no "Copy Canine" or "Copy Bird" ever prints. All three speak `Animal speak?`: sliced objects are Animals, so `virtual` cannot help.

#### Inheritance2/main.cpp → `tmp/w7/Inheritance2.cpp`
Warnings: the same five as Inheritance, plus `deleting object of polymorphic class type 'Animal' which has non-virtual destructor might cause undefined behavior [-Wdelete-non-virtual-dtor]` on `delete a;`. Output:
```
Push canine
Push bird 1
Push bird 2
Finish pushing animals
Woof
Chirp
Chirp
```
`vector<Animal*>`: no copies, and the virtual `speak` dispatches. The destructors are commented out, so `delete a;` prints nothing (and is formally undefined behaviour, which is the warning).

#### oop_multi3/oop_multi3.cpp → `tmp/w7/oop_multi3.cpp`
No warnings. Output:
```
ClassA 1-param constructor
ClassB one-param constructor
ClassC one-param constructor
ClassD 3-param constructor
```
One A, built first, by D's `ClassA(name)`.
- Variant `tmp/w7/oop_multi3-all_info.cpp` (only `//d.all_info();` uncommented) adds:
```
[ClassA name=Derek]
Derek has Class B's data: Algebra
Derek has Class C's extra_data: Fermat's Last Theorem
```
- Variant `tmp/w7/oop_multi3-no-A-call.cpp` (D's initializer list swapped for the commented-out `: ClassB(name, data), ClassC(name, extra_data)`, and `d.all_info();` uncommented). No warnings. Output:
```
ClassA default constructor
ClassB two-param constructor
ClassC two-param constructor
ClassD 3-param constructor
[ClassA name=]
 has Class B's data: Algebra
 has Class C's extra_data: Fermat's Last Theorem
```
B's and C's `ClassA(name)` calls are ignored under virtual inheritance: the most derived class D calls A's default constructor, so `name` is empty.

#### operators (Character.hpp + Character.cpp + main.cpp merged; top-level version with the string overloads) → `tmp/w7/operators.cpp`
No warnings. Output (the `�` is one byte, see below):
```
constructing char: A
Character: A

Adding Character object with a string on left and right operands
After adding string to character object: Character: C

Adding two Character objects together
constructing char: B
constructing char: C
After adding 2 character objects: Character: �

```
- `operator<<` ends with `endl` and every caller adds `<< endl`, hence the blank lines. `char1 + "1"` → 'B', `"1" + char1` → 'C'. No "constructing char" for copies: the copy constructor is defaulted and `explicit Character(char)` is the only printing one.
- **The last character is garbage**: `'B' + 'C'` is 66 + 67 = 133, which overflows `char`; the program writes the byte 0x85, which is not valid UTF-8, and the server decodes output as UTF-8, so `/api/run` returns U+FFFD (�) in its place. A `// predict:` must not quote that line.

#### operatorsBasic (merged the same way) → `tmp/w7/operatorsBasic.cpp`
No warnings. Output:
```
constructing char: A
constructing char: B
Character: A

Character: B

Adding Character objects
char1: Character: �

```
Same problem: `'A' + 'B'` is 131; the program writes the byte 0x83 and `/api/run` returns U+FFFD (�). Do not pin a predict that quotes the `char1:` line.

### Slide-typed programs

Each was typed from the deck text. Changes from the slide are listed; everything else is the slide's text.

#### Slide 13 (RVO) → `tmp/w7/slide13-rvo.cpp`
Changes: `#include <iostream>`; `;` added after `int num` and after the class's `}`; a print added to each constructor (`std::cout << "1-param constructor\n";`, `std::cout << "copy constructor\n";`); the main-function line wrapped in `int main() { ... return 0; }`. Warning: `variable 'n' set but not used [-Wunused-but-set-variable]`. Output: `1-param constructor` (one line: one Number object).
```cpp
#include <iostream>

//Number.hpp
class Number {
private:
        int num;
public:
        Number(int n) : num (n) { std::cout << "1-param constructor\n"; }
        Number(const Number &n2)
        {num = n2.num; std::cout << "copy constructor\n"; }
};

//main.cpp
Number createNumber(int num)
{
        return Number(num);
}

//main function
int main() {
        Number n = createNumber(5);
        return 0;
}
```

#### Slide 16 (NRVO) → `tmp/w7/slide16-nrvo.cpp`
The slide-13 class with the same changes; `createNumber` body is the slide-16 `Number tempN(num); return tempN;`. Warning: `variable 'n' set but not used`. Output: `1-param constructor` (GCC applies the optional NRVO).

#### Slide 17 (temporary) → `tmp/w7/slide17-temp.cpp`
The slide-13 class with the same changes (createNumber omitted, unused); main is `Number n (Number(2));`. No warnings. Output: `1-param constructor` (no copy constructor after `Number(2)`).

#### Slide 95 (return a parameter) → `tmp/w7/slide95-param.cpp`
The slide-13 class (changes as above) standing in for slide 95's `MyClass`; `Number myFunction(Number mcCopy) { return mcCopy; //return value is also copied }`; main `Number mc(5); Number mc2 = myFunction(mc);`. Warning: `variable 'mc2' set but not used`. Output:
```
1-param constructor
copy constructor
copy constructor
```
The first copy builds the parameter, the second builds `mc2` from the parameter: a parameter is never elided.

#### Slide 26 (swap pointers) → `tmp/w7/slide26-swap.cpp`
Changes: `#include <iostream>`/`<complex>` (shared check header) and a main: `int x = 1, y = 2; int *px = &x, *py = &y; swap(px, py); std::cout << *px << " " << *py << " " << x << " " << y << std::endl;`. No warnings. Output: `2 1 1 2` (the pointers swapped, x and y did not).

#### Slide 52 (pass by value versus by reference) → `tmp/w7/slide52-references.cpp`
Changes: `#include <iostream>`, `using namespace std;`; the two `add` functions renamed `addByValue` and `addByReference` (`add(int)` and `add(int&)` in one program make `add(x)` ambiguous); the two mains merged into one, the second using `int y`. No warnings. Output: `0` / `5`.
```cpp
#include <iostream>
using namespace std;

//Pass by value
void addByValue(int xCopy)
{
      xCopy += 5; //local xCopy changes to 5
}

//Pass by reference
void addByReference(int &x)
{
      x += 5; //original x changes to 5
}

int main() {
      int x = 0;
      addByValue(x);
      cout << x << endl; //prints 0

      int y = 0;
      addByReference(y);
      cout << y << endl; //prints 5
      return 0;
}
```

#### Slide 54 (polymorphism through a reference) → `tmp/w7/slide54-polymorphism.cpp`
Changes: `#include <iostream>`, `using namespace std;`; the wrapped `endl;}` lines joined. No warnings (GCC does not warn about the missing virtual destructor since nothing is deleted). Output: `woof` / `chirp`.
```cpp
#include <iostream>
using namespace std;

class Animal {
public:
      virtual void speak() = 0;
};

class Dog : public Animal {
public:
      void speak() { cout << "woof" << endl;}
};

class Bird : public Animal {
public:
      void speak() { cout << "chirp" << endl;}
};

void animalSpeak(Animal &a)
{
      a.speak(); //calls polymorphic speak function
}

int main() {
      Dog d;
      animalSpeak(d); //woof

      Bird b;
      animalSpeak(b); //chirp
      return 0;
}
```

#### Slide 70 (no virtual) → `tmp/w7/slide70-nonvirtual.cpp`
Changes: `#include <iostream>`, `using namespace std;`. The `new Bird` is never deleted (as on the slide). No warnings. Output: `Chirp` / `???`.
```cpp
#include <iostream>
using namespace std;

struct Animal {
  void speak(){cout << "???" << endl;}
};

struct Bird : public Animal {
  void speak() { cout << "Chirp" << endl;}
};

int main() {
  Bird bird;
  Animal *animalPtr = new Bird;
  bird.speak(); //Chirp
  animalPtr->speak(); //???
}
```

#### Slide 71 (virtual) → `tmp/w7/slide71-virtual.cpp`
Slide 70's program with `virtual void speak(){cout << "???" << endl;}` in Animal and the comment `//Chirp` on the last call. No warnings. Output: `Chirp` / `Chirp`.

#### Slide 74 (destructor order) → `tmp/w7/slide74-dtor-order.cpp`
Changes: `#include <iostream>`, `using namespace std;`. No warnings. Output: `Dog destroyed` / `Animal destroyed`.
```cpp
#include <iostream>
using namespace std;

class Animal {
public:
      ~Animal(){ cout << "Animal destroyed" << endl;}
};

class Dog : public Animal {
public:
      ~Dog(){ cout << "Dog destroyed" << endl;}
};

int main() {
      Dog d;
      return 0;
}
```

#### Slide 75 (delete through a base pointer, no virtual destructor) → `tmp/w7/slide75-nonvirtual-dtor.cpp`
Slide 74's classes; main `Animal *a = new Dog; delete a; return 0;`. No warnings (Animal has no virtual function, so `-Wdelete-non-virtual-dtor` is silent). Output: `Animal destroyed` (undefined behaviour; this is what GCC prints).

#### Slide 77 (virtual destructor) → `tmp/w7/slide77-virtual-dtor.cpp`
Slide 75's program with `virtual ~Animal(){ cout << "Animal destroyed" << endl;}` (the slide's line wrap joined). No warnings. Output: `Dog destroyed` / `Animal destroyed`.

#### Slide 92 (friend taking the object by value) → `tmp/w7/slide92-friend.cpp`
Changes: `#include <iostream>` only. No warnings. Output: `1` with no newline (main's `mc.x` stays 0; it is private, so the program cannot print it without adding a getter).
```cpp
#include <iostream>

//MyClass.hpp
class MyClass {
private:
      int x = 0;
      friend void friendFunc(MyClass mc);
};

//main.cpp
void friendFunc(MyClass mc) {
      mc.x++;
      std::cout << mc.x;
}

int main() {
      MyClass mc;
      friendFunc(mc);
      return 0;
}
```

#### Slide 97 (shallow copy) → `tmp/w7/slide97-shallow.cpp`
Changes: `#include <iostream>`; two lines added after `MyClass mc2(mc);` to show the sharing: `*mc2.ptr = 7;` and `std::cout << *mc.ptr << " " << *mc2.ptr << std::endl;`. Leaks the int, as on the slide. No warnings. Output: `7 7` (one shared int).
```cpp
#include <iostream>

struct MyClass {
      int *ptr; //pointer to dynamic memory int

public:
      MyClass() { ptr = new int(5);}

};

int main() {
      MyClass mc;
      MyClass mc2(mc);
      *mc2.ptr = 7;
      std::cout << *mc.ptr << " " << *mc2.ptr << std::endl;
      return 0;
}
```

#### Slide 98 (deep copy) → `tmp/w7/slide98-deep.cpp`
Slide 97's program plus the slide-98 line `MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {} //deep copy of other int`, with the same two added lines. No warnings. Output: `5 7` (each object has its own int).

### Compile checks (slide claims)

Each is `#include <iostream>` and `#include <complex>` plus the lines shown, in `tmp/w7/chk-*.cpp`.

| File | Code | Server |
|---|---|---|
| `chk-slide5-class-dot.cpp` | `X::n`, `obj.n`, `p->n` | compiles, prints `111` |
| `chk-slide5-classname-dot.cpp` | `X.n` | `error: expected primary-expression before '.' token` |
| `chk-slide6-static-init-inside.cpp` | `static int m = 5;` in class | `error: ISO C++ forbids in-class initialization of non-const static member 'X::m'` |
| `chk-slide6-inline-static.cpp` | `inline static int m = 5;` in class | compiles, prints `5` |
| `chk-slide7-const-static.cpp` | the slide-7 class and definitions | compiles, prints `9 3` |
| `chk-slide7-pointer-inside.cpp` | `static const double * pointer = nullptr;` in class | `error: 'constexpr' needed for in-class initialization of static data member 'const double* X::pointer' of non-integral type [-fpermissive]` |
| `chk-slide8-constexpr-ok.cpp` | the two slide-8 OK lines | compiles, prints `3 2` |
| `chk-slide8-constexpr-k.cpp` | `constexpr static int k;` | `error: 'constexpr' static data member 'k' must have an initializer` |
| `chk-slide9-virtual-static.cpp` | `virtual static void staticFunction() {}` | `error: member 'staticFunction' cannot be declared both 'virtual' and 'static'` |
| `chk-slide9-static-const.cpp` | `static void staticFunction() const {}` | `error: static member function 'static void X::staticFunction()' cannot have cv-qualifier` |
| `chk-slide27-var-nobound.cpp` | `int (**var[])();` at namespace scope | `error: storage size of 'var' isn't known` |
| `chk-slide40-paa.cpp` | `int (*paa)[][];` | `error: declaration of 'paa' as multidimensional array must have bounds for all dimensions except the first` |
| `chk-slide41-paf.cpp` | `int (*paf)[]();` | `error: declaration of 'paf' as array of functions` |
| `chk-rl-declarations.cpp` | `int (&ref)[100]`, `int (**ppf)()`, `int (**var[1])()`, `fp1`, `arr[5]`, `ppp`, `ppa`, `pap`, each initialized and used | compiles, prints `1 7 7 3 1 111` |
