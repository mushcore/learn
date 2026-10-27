---
title: Mock Quiz 7
minutes: 45
---

44 questions on the whole Week 7 deck, in the lab quiz format: true/false on the static rules, two counting questions and several what-prints on real programs, three right-left readings, a bug hunt and one short program to write. Answer everything before you check. Every program is the slide's own code (with a print added where the slide shows none), run on the app's server, so the key is what really printed. Where an option lists several output lines they are separated by ` / `.

:::quiz How the keys work
True/false and multiple choice follow the slide's rule; where C++17 says something different, the explanation says so in one sentence. A what-prints key is the server's real output. Aim for 90% before you move on to the one-page sheet.
:::

## Static members

```quiz
[
  {
    "q": "Slide 4: only one copy of a static member variable exists per class, shared by every instance.",
    "type": "tf",
    "answer": true,
    "explain": "A static member belongs to the class, not to an object: it has independent static storage for the life of the program, which is how it lets a single resource be shared between instances (the Singleton pattern builds on this)."
  },
  {
    "q": "A static data member is written `static int X::n = 1;` where it is defined outside the class.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 4: the static keyword is used with the declaration, not the definition. Inside the class you write `static int n;`; outside you write `int X::n = 1;`. Repeating `static` on the out-of-class definition is a compile error."
  },
  {
    "q": "Slide 5: a static member exists even if no objects of the class have been defined.",
    "type": "tf",
    "answer": true,
    "explain": "Its storage is set up before main runs, so `X::n` can be read and written before any X is constructed. That is why static.cpp prints `A() created` before main's first object."
  },
  {
    "q": "Class `X` has a public `static int n;`, `X obj;` and `X* p = &obj;` exist. Which access does NOT compile?",
    "options": [
      "`X::n`",
      "`obj.n`",
      "`p->n`",
      "`X.n`"
    ],
    "answer": 3,
    "explain": "A static is reached by its qualified name `Class::member`, or by member access on an object or a pointer. Slide 5 writes the second form as `Class.member`, a wording slip: the dot needs an object, so `X.n` fails with 'expected primary-expression before . token'."
  },
  {
    "type": "spotbug",
    "q": "Click the line that does not compile.",
    "code": "class X {\n    static int n;\n    const static int m = 9;\n    static int k = 5;\n};\nint X::n = 1;\n\nint main() { return 0; }",
    "answer": 4,
    "explain": "`static int k = 5;` initializes a plain static inside the class (slide 6: ERROR; g++: 'ISO C++ forbids in-class initialization of non-const static member X::k'). The other two members are legal; why the `const` one may be initialized inside comes up next. Fix: `static int k;` in the class and `int X::k = 5;` outside."
  },
  {
    "q": "Slide 6: `static int m = 5;` written inside the class definition is an ERROR.",
    "type": "tf",
    "answer": true,
    "explain": "A plain (non-const) static can't be initialized inside the class definition; it is defined once outside with `int X::m = 5;`. C++17 truth: `inline static int m = 5;` is legal in the class, but without `inline` g++ still says 'ISO C++ forbids in-class initialization of non-const static member'."
  },
  {
    "q": "Slide 7: `const static int m = 9;` can be initialized inside the class definition.",
    "type": "tf",
    "answer": true,
    "explain": "Constant integral or enumeration types are the exception to slide 6: they can be initialized inside. `const static int k;` may still be defined outside instead, as `const int X::k = 3;`."
  },
  {
    "q": "Slide 7: `static const double * pointer;` can be initialized inside the class because it is declared const.",
    "type": "tf",
    "answer": false,
    "explain": "The slide marks it 'cannot be initialized inside' and defines it outside as `const double * X::pointer = new double[3];`. The const applies to the doubles, not to the pointer, and a double pointer is not an integral type, so the plain-static rule applies."
  },
  {
    "q": "Slide 8: `constexpr static int k;` is fine as long as `k` is given a value outside the class.",
    "type": "tf",
    "answer": false,
    "explain": "A constexpr static must be initialized inside the class definition (the slide marks `constexpr static int k;` ERROR; g++: 'constexpr static data member k must have an initializer'). Strictly the initializer must be a constant expression, not only a literal, and since C++17 the member is implicitly inline."
  },
  {
    "type": "match",
    "q": "Match each kind of static data member to where the slides say it is initialized.",
    "pairs": [
      [
        "`static int n;`",
        "outside the class only: `int X::n = 5;`"
      ],
      [
        "`const static int m = 9;` (integral or enum)",
        "inside allowed, or outside as `const int X::k = 3;`"
      ],
      [
        "`constexpr static int arr[] = {1, 2, 3};`",
        "inside required, with a constant initializer"
      ]
    ],
    "explain": "Slides 6 to 8 give three cases: a plain static can't be initialized inside the class, a const integral or enum static can be, and a constexpr static must be. The C++17 escape hatch `inline static` is not on the slides."
  },
  {
    "q": "A static member function has a `this` pointer.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: there is no `*this` pointer. A static function is called without an object (`Calculator::add(num1, num2)`), so there is no object for `this` to point to."
  },
  {
    "q": "Slide 9: a static member function can only access static data and invoke static member functions.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's rule, and it follows from having no `this`. More precisely, a static function can still reach non-static members through an object it is given: static_functions.cpp's `staticFunctionParam(A a)` calls `a.nonStaticFunction()`."
  },
  {
    "q": "A static member function can be declared `virtual` so a derived class can override it.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: static functions cannot be virtual. Virtual dispatch needs an object to look up at run time and a static call has none; g++: 'cannot be declared both virtual and static'."
  },
  {
    "q": "`static void staticFunction() const` is a legal static member function.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: static functions cannot be const. A trailing const promises not to change `*this`, and a static function has no `this`; g++: 'static member function cannot have cv-qualifier'."
  }
]
```

## Write it: a static counter

```challenge
{"prompt": "Finish <code>Ticket</code> so the program prints <code>0</code>, <code>2</code>, <code>3</code>: a <b>private static</b> <code>int count</code> declared in the class and defined once outside it starting at 0, a constructor that adds 1 to it, and a <b>static</b> <code>getCount()</code> that returns it. Do not change <code>main</code>.", "starter": "#include <iostream>\n\nclass Ticket {\n    // 1. declare a static int count (declaration only)\npublic:\n    // 2. a constructor that adds 1 to count\n    // 3. a static function getCount() that returns count\n};\n\n// 4. define count outside the class, starting at 0\n\nint main() {\n    std::cout << Ticket::getCount() << std::endl;\n    Ticket a;\n    Ticket b;\n    std::cout << Ticket::getCount() << std::endl;\n    Ticket c;\n    std::cout << a.getCount() << std::endl;\n    return 0;\n}\n", "expected": "0\n2\n3", "hints": ["In the class: <code>static int count;</code>. Outside: <code>int Ticket::count = 0;</code> (no <code>static</code> on the definition).", "<code>Ticket() { count++; }</code> and <code>static int getCount() { return count; }</code>. The first print works before any Ticket exists: statics exist even if no objects have been defined."], "solution": "#include <iostream>\n\nclass Ticket {\n    static int count;\npublic:\n    Ticket() { count++; }\n    static int getCount() { return count; }\n};\n\nint Ticket::count = 0;\n\nint main() {\n    std::cout << Ticket::getCount() << std::endl;\n    Ticket a;\n    Ticket b;\n    std::cout << Ticket::getCount() << std::endl;\n    Ticket c;\n    std::cout << a.getCount() << std::endl;\n    return 0;\n}\n"}
```

## Copy elision, the right-left rule and the review

```quiz
[
  {
    "q": "Slide 12: return value optimization is a subset of copy elision.",
    "type": "tf",
    "answer": true,
    "explain": "Copy elision avoids unnecessary copying of objects in general; RVO is the case where the object avoided is one returned from a function. The slide draws RVO as a box inside the copy elision box."
  },
  {
    "q": "Slide 14 asks: how many objects of type Number are created? This is the slide-13 program with a print in each constructor. Type the number of Number objects the server's run creates.",
    "type": "numeric",
    "code": "#include <iostream>\n\n//Number.hpp\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\n//main.cpp\nNumber createNumber(int num)\n{\n        return Number(num);\n}\n\n//main function\nint main() {\n        Number n = createNumber(5);\n        return 0;\n}",
    "answer": 1,
    "tolerance": 0,
    "explain": "One: the server prints `1-param constructor` once and no `copy constructor`. Slide 15: RVO 'directly constructs the object initialized inside the createNumber function into the memory space of n'. Read strictly from the code, `Number(num)` is a temporary that would be copied out, so a compiler that never elided could make up to three. Since C++17 this case is guaranteed: initializing n from a prvalue of the same type never copies."
  },
  {
    "q": "Slide 15 says RVO happens automatically, but requires...",
    "options": [
      "the returned object to be constructed on a return statement",
      "the returned object to be a named local variable",
      "the copy constructor to be declared private",
      "the function to be declared static"
    ],
    "answer": 0,
    "explain": "`return Number(num);` builds the object on the return statement, so the compiler can build it straight into n. A named local (`Number tempN(num); return tempN;`) is the NRVO case of slide 16 instead."
  },
  {
    "q": "Slide 16 (NRVO). What prints?",
    "code": "#include <iostream>\n\n//Number.hpp\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\n//main.cpp\nNumber createNumber(int num)\n{\n        Number tempN(num);\n        return tempN;\n}\n\n//main function\nint main() {\n        Number n = createNumber(5);\n        return 0;\n}",
    "options": [
      "1-param constructor",
      "1-param constructor / copy constructor",
      "1-param constructor / copy constructor / copy constructor",
      "copy constructor"
    ],
    "answer": 0,
    "explain": "g++ applies named return value optimization: tempN is built directly in n, so the copy constructor never runs. The returned object has a name here, which is what makes this NRVO rather than the RVO of slide 15."
  },
  {
    "q": "Slide 17: `Number n (Number(2));`. Which constructor is called after the Number(2) object is created? Type how many times the copy constructor runs in the server's run of this program.",
    "type": "numeric",
    "code": "#include <iostream>\n\n//Number.cpp\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\n//main function\nint main() {\n        Number n (Number(2));\n        return 0;\n}",
    "answer": 0,
    "tolerance": 0,
    "explain": "Zero. Slide 18, 'Based on code': after Number(2) the copy constructor would be called to copy the temporary into n. Slide 19, 'With copy elision': no constructor runs after it; slide 20, 'the compiler optimized our call by avoiding the call to copy constructor and directly called 1 parameter constructor'. Since C++17 that elision is guaranteed."
  },
  {
    "q": "Slide 16: there's no guarantee that all compilers use RVO and NRVO.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's note. C++17 truth: elision from a prvalue of the same type (`return Number(num);` into n) is now guaranteed; only NRVO, returning a named local, is still optional."
  },
  {
    "q": "Slide 23: when is the copy constructor called? Select all that apply.",
    "options": [
      "when invoking it directly: `MyClass c(otherC); MyClass c1 = c;`",
      "when passing an object by value: `void myFunc(MyClass c) {}`",
      "when returning an object by value: `MyClass myFunc() { MyClass c; return c; }`",
      "when passing by const reference: `void print(const MyClass& mc)`",
      "when assigning to an existing object: `c1 = c;`"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explain": "A copy constructor builds a NEW object from an existing one, which is what those three cases do, with the slide's 'HOWEVER!': copy elision and RVO may remove the return-value copy. A reference parameter copies nothing (slide 53 uses it to avoid copies), and `c1 = c;` on an existing object calls the copy assignment operator."
  },
  {
    "q": "Slide 95: return a parameter by value. What prints?",
    "code": "#include <iostream>\n\n//Number.hpp (the slide-13 class), used for slide 95's return-a-parameter case\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\nNumber myFunction(Number mcCopy)\n{\n        return mcCopy; //return value is also copied\n}\n\n//main function\nint main() {\n        Number mc(5);\n        Number mc2 = myFunction(mc);\n        return 0;\n}",
    "options": [
      "1-param constructor / copy constructor",
      "1-param constructor / copy constructor / copy constructor",
      "1-param constructor",
      "1-param constructor / copy constructor / copy constructor / copy constructor"
    ],
    "answer": 1,
    "explain": "`Number mc(5)` prints the 1-param line. Passing mc by value copies it into mcCopy, and `return mcCopy;` copies again into mc2 ('return value is also copied'). Elision can never apply to a function parameter, unlike slide 16's local tempN."
  },
  {
    "type": "reorder",
    "q": "Put the right-left rule's steps in the slide's order (slides 27 to 31).",
    "lines": [
      "Start from variable name (var)",
      "Keep going right. Read what we see until we see right parentheses )",
      "Then go left of var. Read what we see until we see left parentheses (",
      "Exit parentheses and go right. Read what we see until right parentheses or semicolon",
      "Go left of where we exited bracket. Read what we see until left parentheses or finish"
    ],
    "explain": "Name first, then right before left inside each pair of parentheses, then step out and repeat steps as needed. On `int (**var[])();` that gives: var is an array of pointers to pointers to a function that returns int."
  },
  {
    "q": "Read `char *(*pf[3])(double);` with the right-left rule.",
    "options": [
      "pf is an array of 3 pointers to functions that take a double and return a pointer to char",
      "pf is a pointer to an array of 3 functions that take a double and return a pointer to char",
      "pf is an array of 3 functions that take a double and return pointers to pointers to char",
      "pf is a pointer to a function that takes a double and returns an array of 3 char pointers"
    ],
    "answer": 0,
    "explain": "Start from pf: 'pf is'. Go right until `)`: `[3]`, 'an array of 3'. Go left until `(`: `*`, 'pointers'. Exit and go right until `)` or `;`: `(double)`, 'to functions that take a double'. Go left: `*`, 'that return a pointer', then `char`, 'to char'. The server compiles it with three function pointers in it."
  },
  {
    "q": "Read `int (*(*q)())[5];` with the right-left rule.",
    "options": [
      "q is an array of 5 pointers to functions returning int pointers",
      "q is a pointer to an array of 5 pointers to functions returning int",
      "q is a pointer to a function that returns a pointer to an array of 5 ints",
      "q is a function that returns a pointer to a pointer to an array of 5 ints"
    ],
    "answer": 2,
    "explain": "Start from q. Nothing to the right but `)`, so go left: `*`, 'q is a pointer'. Exit, go right: `()`, 'to a function'. Go left: `*`, 'that returns a pointer'. Exit again, go right: `[5]`, 'to an array of 5'. Go left to the end: `int`, 'ints'."
  },
  {
    "q": "Read `int *(&ra)[10] = arr;` with the right-left rule (`arr` is `int *arr[10]`).",
    "options": [
      "ra is an array of 10 references to int pointers",
      "ra is a reference to an array of 10 int pointers",
      "ra is a pointer to a reference to an array of 10 ints",
      "ra is a reference to a pointer to an array of 10 ints"
    ],
    "answer": 1,
    "explain": "Start from ra. Nothing to the right but `)`, so go left: `&`, 'ra is a reference'. Exit, go right: `[10]`, 'to an array of 10'. Go left: `*`, then `int`, 'int pointers'. It is slide 25's `int (&ref)[100]` with int* elements; C++ has no arrays of references."
  },
  {
    "q": "Slide 26: `swap` takes references to pointers. What prints?",
    "code": "#include <iostream>\nvoid swap(int*&p, int *&q)\n{\n       int* temp = p;\n       p = q;\n       q = temp;\n}\nint main() {\n  int x = 1, y = 2;\n  int *px = &x, *py = &y;\n  swap(px, py);\n  std::cout << *px << \" \" << *py << \" \" << x << \" \" << y << std::endl;\n}",
    "options": [
      "2 1 1 2",
      "2 1 2 1",
      "1 2 1 2",
      "1 2 2 1"
    ],
    "answer": 0,
    "explain": "`int*&p` reads 'p is a reference to a pointer to int', so swap exchanges main's pointers themselves: px now points at y and py at x, giving 2 1. The ints were never touched, so x and y still print 1 2."
  },
  {
    "q": "Slide 52 (the two `add` functions renamed so both fit one program). What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\n//Pass by value\nvoid addByValue(int xCopy)\n{\n      xCopy += 5;\n}\n\n//Pass by reference\nvoid addByReference(int &x)\n{\n      x += 5;\n}\n\nint main() {\n      int x = 0;\n      addByValue(x);\n      cout << x << endl;\n\n      int y = 0;\n      addByReference(y);\n      cout << y << endl;\n      return 0;\n}",
    "options": [
      "0 / 5",
      "5 / 5",
      "0 / 0",
      "5 / 0"
    ],
    "answer": 0,
    "explain": "Pass by value hands the function a copy, xCopy, so x stays 0. Pass by reference makes the parameter a nickname for the caller's variable, so the original changes to 5: this is the slide's first reason to use references."
  },
  {
    "q": "Slide 54: polymorphism through a reference. What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n      virtual void speak() = 0;\n};\n\nclass Dog : public Animal {\npublic:\n      void speak() { cout << \"woof\" << endl;}\n};\n\nclass Bird : public Animal {\npublic:\n      void speak() { cout << \"chirp\" << endl;}\n};\n\nvoid animalSpeak(Animal &a)\n{\n      a.speak(); //calls polymorphic speak function\n}\n\nint main() {\n      Dog d;\n      animalSpeak(d);\n\n      Bird b;\n      animalSpeak(b);\n      return 0;\n}",
    "options": [
      "woof / chirp",
      "chirp / woof",
      "compile error: Animal is abstract and cannot be a parameter",
      "woof / woof"
    ],
    "answer": 0,
    "explain": "`animalSpeak(Animal &a)` takes a reference, so no Animal is ever copied or created: a refers to the Dog, then to the Bird, and the virtual `speak` dispatches to each. An abstract class can be the type of a reference or a pointer, just not of an object."
  },
  {
    "q": "Slide 70: no virtual. What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Animal {\n  void speak(){cout << \"???\" << endl;}\n};\n\nstruct Bird : public Animal {\n  void speak() { cout << \"Chirp\" << endl;}\n};\n\nint main() {\n  Bird bird;\n  Animal *animalPtr = new Bird;\n  bird.speak();\n  animalPtr->speak();\n}",
    "options": [
      "Chirp / Chirp",
      "Chirp / ???",
      "??? / ???",
      "??? / Chirp"
    ],
    "answer": 1,
    "explain": "`bird.speak()` calls Bird's version. Without virtual functions, classes are not polymorphic: `animalPtr->speak()` is chosen by the pointer's type, Animal, at compile time, so it prints ???. (The new Bird is never deleted, as on the slide.)"
  },
  {
    "q": "Slide 71: `virtual void speak()` in Animal. What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Animal {\n  virtual void speak(){cout << \"???\" << endl;}\n};\n\nstruct Bird : public Animal {\n  void speak() { cout << \"Chirp\" << endl;}\n};\n\nint main() {\n  Bird bird;\n  Animal *animalPtr = new Bird;\n  bird.speak();\n  animalPtr->speak();\n}",
    "options": [
      "Chirp / Chirp",
      "Chirp / ???",
      "??? / Chirp",
      "??? / ???"
    ],
    "answer": 0,
    "explain": "With virtual the classes become polymorphic: the call through `Animal *animalPtr` looks up the object's real type at run time, a Bird."
  },
  {
    "q": "Slide 72: every child class must write `virtual` again on its own `speak()` for the call to stay polymorphic.",
    "type": "tf",
    "answer": false,
    "explain": "Write virtual the first time the function appears in a base class; children inherit it, so there is no need to write the virtual keyword again. Modern code marks the child's version `override` (C++11), which the deck does not mention."
  },
  {
    "q": "Slide 74: `Dog d;` goes out of scope. What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n      ~Animal(){ cout << \"Animal destroyed\" << endl;}\n};\n\nclass Dog : public Animal {\npublic:\n      ~Dog(){ cout << \"Dog destroyed\" << endl;}\n};\n\nint main() {\n      Dog d;\n      return 0;\n}",
    "options": [
      "Dog destroyed / Animal destroyed",
      "Animal destroyed / Dog destroyed",
      "Dog destroyed",
      "Animal destroyed"
    ],
    "answer": 0,
    "explain": "When a child object is destroyed it executes its own destruction code first, then calls its parent's destructor: the reverse of construction, where Animal is built before Dog."
  },
  {
    "q": "Slide 75: `delete` through an `Animal*` with no virtual destructor. What does the server print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n      ~Animal(){ cout << \"Animal destroyed\" << endl;}\n};\n\nclass Dog : public Animal {\npublic:\n      ~Dog(){ cout << \"Dog destroyed\" << endl;}\n};\n\nint main() {\n      Animal *a = new Dog;\n      delete a;\n      return 0;\n}",
    "options": [
      "Dog destroyed / Animal destroyed",
      "Animal destroyed / Dog destroyed",
      "Animal destroyed",
      "Dog destroyed"
    ],
    "answer": 2,
    "explain": "The pointer's type is Animal and ~Animal is not virtual, so only Animal's destructor is chosen and Dog's never runs (slide 76: not polymorphic, 'BAD'). Formally deleting a derived object through a base pointer without a virtual destructor is undefined behaviour; this is what GCC prints."
  },
  {
    "q": "Slide 77: `virtual ~Animal()`. What prints?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n      virtual ~Animal(){ cout << \"Animal destroyed\" << endl;}\n};\n\nclass Dog : public Animal {\npublic:\n      ~Dog(){ cout << \"Dog destroyed\" << endl;}\n};\n\nint main() {\n      Animal *a = new Dog;\n      delete a;\n      return 0;\n}",
    "options": [
      "Animal destroyed",
      "Dog destroyed / Animal destroyed",
      "Animal destroyed / Dog destroyed",
      "Dog destroyed"
    ],
    "answer": 1,
    "explain": "A virtual destructor makes `delete a;` polymorphic: the proper child type's destructor runs first, then the parent's. Slide 77: base classes should always have a virtual destructor (the Core Guidelines say it for polymorphic bases)."
  },
  {
    "q": "Under virtual inheritance (`class B : virtual public A`, `class C : virtual public A`, `class D : public B, public C`), which class is responsible for calling A's constructor when a D is created?",
    "options": [
      "B, because it is listed first",
      "both B and C, so A is built twice",
      "D, the most derived class",
      "nobody: A is never constructed"
    ],
    "answer": 2,
    "explain": "Slides 85 and 86: the most derived class D is responsible for calling A's constructor during its own construction. B and C share one A; their own `ClassA(name)` calls are ignored, and if D names none, A's default constructor runs (oop_multi3 then prints an empty name)."
  },
  {
    "type": "match",
    "q": "Slide 68: virtual appears in three places. Match each to its effect.",
    "pairs": [
      [
        "virtual function",
        "a call through a base pointer or reference runs the object's own version"
      ],
      [
        "virtual destructor",
        "`delete` through a base pointer runs the child's destructor, then the parent's"
      ],
      [
        "virtual inheritance",
        "one shared base object in a diamond, built by the most derived class"
      ]
    ],
    "explain": "The effects of adding virtual differ even though the same keyword is used: dispatch for functions, the full destructor chain for destructors, and a single shared A for `virtual public` bases."
  },
  {
    "q": "Slides 62 to 66: which operator should be implemented as a friendly non-member function?",
    "options": [
      "`x += y`",
      "`++x`",
      "`x + y`",
      "`!x`"
    ],
    "answer": 2,
    "explain": "`x + y` modifies neither operand and produces a new value, so the slides make it a friend non-member (as are -, ==, !=). Unary operators are members, and binary operators that modify the left operand (`+=`, `-=`) are members too. The split is the course's convention; the language itself requires `=`, `[]`, `()` and `->` to be members."
  },
  {
    "q": "Slide 56: after `int& numRef = num;`, the line `numRef = num2;` makes numRef refer to num2.",
    "type": "tf",
    "answer": false,
    "explain": "A reference can NOT be reseated. `numRef = num2;` assigns: it sets num's value to num2's value (10 on the slide). Only a pointer can be pointed somewhere else, with `numPtr = &num2;`."
  },
  {
    "q": "Slide 55: `int &numRef;` with no initializer is OK, just like `int *numPtr;`.",
    "type": "tf",
    "answer": false,
    "explain": "A pointer can be declared uninitialized, but a reference must be bound when it is created: `int &numRef;` is an ERROR except for class data members, function parameters and `extern` declarations, which are bound elsewhere. It can't be null either (`int &numRef = NULL` is an ERROR)."
  },
  {
    "q": "Slide 92: a friend that takes the object by value. What prints?",
    "code": "#include <iostream>\n\n//MyClass.hpp\nclass MyClass {\nprivate:\n      int x = 0;\n      friend void friendFunc(MyClass mc);\n};\n\n//main.cpp\nvoid friendFunc(MyClass mc) {\n      mc.x++;\n      std::cout << mc.x;\n}\n\nint main() {\n      MyClass mc;\n      friendFunc(mc);\n      return 0;\n}",
    "options": [
      "1",
      "0",
      "compile error: x is private",
      "10"
    ],
    "answer": 0,
    "explain": "friendFunc is declared a friend inside MyClass, so it may read and change the private x. It receives a copy of mc, increments the copy's x from 0 to 1 and prints 1; main's mc.x stays 0."
  },
  {
    "q": "Slide 97: no copy constructor written. What prints?",
    "code": "#include <iostream>\n\nstruct MyClass {\n      int *ptr; //pointer to dynamic memory int\n\npublic:\n      MyClass() { ptr = new int(5);}\n\n};\n\nint main() {\n      MyClass mc;\n      MyClass mc2(mc);\n      *mc2.ptr = 7;\n      std::cout << *mc.ptr << \" \" << *mc2.ptr << std::endl;\n      return 0;\n}",
    "options": [
      "5 7",
      "7 7",
      "5 5",
      "7 5"
    ],
    "answer": 1,
    "explain": "The default copy constructor copied the address mc is pointing to into mc2, a shallow copy, so both point at the same int. Writing 7 through mc2 changes what mc sees too."
  },
  {
    "q": "Slide 98: the deep-copy constructor `ptr(new int(*other.ptr))`. What prints?",
    "code": "#include <iostream>\n\nstruct MyClass {\n      int *ptr; //pointer to dynamic memory int\n\npublic:\n      MyClass() { ptr = new int(5);}\n      MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {} //deep copy of other int\n\n};\n\nint main() {\n      MyClass mc;\n      MyClass mc2(mc);\n      *mc2.ptr = 7;\n      std::cout << *mc.ptr << \" \" << *mc2.ptr << std::endl;\n      return 0;\n}",
    "options": [
      "7 7",
      "5 5",
      "5 7",
      "7 5"
    ],
    "answer": 2,
    "explain": "The copy constructor allocates new dynamic memory, copies the value 5 from the other ptr, and points mc2's ptr at it, so mc and mc2 have their own ints: only mc2's becomes 7. (The class still leaks and has no copy assignment; Week 4's rule of three.)"
  }
]
```
