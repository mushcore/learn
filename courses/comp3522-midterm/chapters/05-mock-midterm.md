---
title: Mock midterm (90 minutes)
minutes: 90
---

A 105-mark paper in the real format: Part A is theory (66 marks: ten multiple choice and true/false, eight definitions), Part B is code (39 marks: seven write-the-output programs, one short coding question, one guided long question). Every week from 1 to 7 is in at least two questions. The questions are new; the shapes are the practice paper's. Take it on paper first, closed book, then enter your answers here.

:::quiz Timing: 105 marks in 90 minutes, a little under a minute a mark
| Section | Marks | Minutes |
|---|---|---|
| Q1 to Q10, multiple choice and true/false | 30 | 15 |
| Q11 to Q18, definitions | 36 | 25 |
| Q19 to Q25, write the output | 19 | 18 |
| Q26, short coding | 5 | 7 |
| Q27, long coding in four parts | 15 | 20 |
| checking: count output lines, reread every `const` and `&` | | 5 |

Write-the-output questions carry the line count in the hint, as the real paper does. Number your output lines on paper and stop when you reach the count.
:::

## Part A: multiple choice and true or false (Q1 to Q10, 30 marks)

```quiz
[
  {
    "q": "**Q1 (3 marks).** `vector<Fraction> v; v.push_back(f);` stores in the vector...",
    "week": "W6",
    "options": ["a reference to `f`", "a copy of `f`, made by Fraction's copy constructor", "a pointer to `f`", "nothing until `v.size()` is called"],
    "answer": 1,
    "explain": "The STL uses value semantics: containers get a copy of the object put in them, which is why an element class needs a copy constructor, an assignment operator and a destructor."
  },
  {
    "q": "**Q2 (3 marks).** `Base* p = new Derived; delete p;` runs `~Derived` even when `~Base` is not virtual.",
    "week": "W4",
    "type": "tf",
    "answer": false,
    "explain": "Without a virtual destructor the delete binds to `~Base` at compile time: only the base part is destroyed, the derived part leaks, and the behaviour is undefined. Declare `virtual ~Base()` in any class with a virtual function."
  },
  {
    "q": "**Q3 (3 marks).** `Boss` contains `friend class Spy;`. Which statement is true?",
    "week": "W4",
    "options": ["Boss's member functions may read Spy's private members", "A class derived from Spy may read Boss's private members", "The friend declaration works the same whether it sits in Boss's private or public section", "A friend of Spy may read Boss's private members"],
    "answer": 2,
    "explain": "Access specifiers have no effect on friend declarations. Friendship is not mutual (Boss cannot read Spy), not inherited (Spy's children get nothing) and not transitive (Spy's friends get nothing)."
  },
  {
    "q": "**Q4 (3 marks).** An exception is thrown and no `catch` on the call stack matches its type. What happens?",
    "week": "W5",
    "options": ["`std::terminate` is called; it runs the termination handler, which calls `abort`", "The exception is discarded and execution continues after the `throw`", "`main` returns 1", "The nearest `catch (...)` anywhere in the program runs, even in a function that was never called"],
    "answer": 0,
    "explain": "Uncaught means terminate, in `<exception>`: the termination handler calls `abort` and the program crashes. A `catch (...)` only helps if it is on the active call stack."
  },
  {
    "q": "**Q5 (3 marks).** Destructors are implicitly `noexcept`, so an exception that escapes a destructor ends the program.",
    "week": "W5",
    "type": "tf",
    "answer": true,
    "explain": "The Week 5 rule: NEVER throw from a destructor; if you do it is treated as a run-time error and execution ends. The same holds for any function marked `noexcept` that throws anyway."
  },
  {
    "q": "**Q6 (3 marks).** `int n; cin >> n;` meets the input `hello`, so `failbit` is set. Calling `cin.clear();` alone removes `hello` from the buffer, so the next `cin >> n` reads a fresh number.",
    "week": "W1",
    "type": "tf",
    "answer": false,
    "explain": "`clear()` only unsets the state bits (`failbit`, `badbit`, `eofbit`); it does not remove the bad characters, so `hello` is still the next thing `cin` sees and the next read fails again. Recovery takes two steps: `cin.clear();` to reset the state, then `cin.ignore(LLONG_MAX, '\\n');` to throw the bad line away."
  },
  {
    "q": "**Q7 (3 marks).** Apply the right-left rule to `int (**ppa)[];`",
    "week": "W7",
    "options": ["Ppa is an array of pointer to a pointer returning ints", "Ppa is an int pointer to a pointer to an array", "Ppa is an array of pointers to int pointers", "Ppa is a pointer to a pointer to an array of ints"],
    "answer": 3,
    "explain": "Start at the name and go right: a `)` stops you at once. Go left until `(`: `**`, a pointer to a pointer. Exit the parentheses and go right: `[]`, to an array. Go left to the end: `int`, of ints. g++ accepts the declaration as written: `decltype(ppa)` is `int (**)[]`."
  },
  {
    "q": "**Q8 (3 marks).** `bool operator<(const T& a, const T& b) { return a.x <= b.x; }` gives `std::set<T>` a valid strict weak ordering.",
    "week": "W6",
    "type": "tf",
    "answer": false,
    "explain": "Irreflexivity requires `lessThan(x, x) == false`; with `<=` an element is less than itself, antisymmetry fails too (a <= b and b <= a can both be true), and the set's binary search tree misbehaves. Compare with `<` only."
  },
  {
    "q": "**Q9 (3 marks).** Apply the right-left rule to `int *(*pap)[];`",
    "week": "W7",
    "options": ["Pap is a pointer to an integer to a pointer to an array", "Pap is an integer array of pointers to pointers", "Pap is an array of pointers to pointers to ints", "Pap is a pointer to an array of int pointers"],
    "answer": 3,
    "explain": "Start at the name and go right: a `)` stops you. Go left until `(`: `*`, pap is a pointer. Exit the parentheses and go right: `[]`, to an array. Go left to the end: `int *`, of int pointers. The `*` outside the parentheses belongs to the element type, not to `pap`. g++ accepts the declaration as written: `decltype(pap)` is `int* (*)[]`."
  },
  {
    "q": "**Q10 (3 marks).** `class X { static int m = 5; };` compiles: a static data member can be initialized inside the class definition.",
    "week": "W7",
    "type": "tf",
    "answer": false,
    "explain": "The Week 7 slide: a static member \"can't be initialized inside the class definition\". Declare it in the class (`static int n;`) and define it once outside (`int X::n = 5;`); the slides' exceptions are a `const static` integral member and a `constexpr static` member. Since C++17 `inline static int m = 5;` is also legal in the class, but without `inline` this line is still an error."
  }
]
```

## Part A: definitions (Q11 to Q18, 36 marks)

On paper a definition earns full marks with three moves: define it in the slide's words, contrast it with the thing it is confused with, and give a two-line example. Write that first. Then type the one word the marker underlines; the explanation shows the whole model answer.

```quiz
[
  {
    "q": "**Q11 (3 marks).** What is a reference? Write the definition and the two rules that make it different from a pointer, then type the word that completes the key sentence: a reference is another ___ for an existing variable.",
    "week": "W2",
    "type": "text",
    "answer": ["name", "alias", "nickname", "another name"],
    "explain": "A reference is an alias, another name for an existing variable: `int& ref = n;`. It must be initialized when declared and can never be re-seated; afterwards it is used exactly like the variable. A pointer is a separate variable holding an address (`int* p = &n;`), may be null, may be re-pointed, and needs `*` to reach the pointee."
  },
  {
    "q": "**Q12 (4 marks).** What is a pure virtual function, and what does one do to the class that declares it? Type the one-word effect on the class.",
    "week": "W4",
    "type": "text",
    "answer": ["abstract", "abstract class"],
    "explain": "`virtual void f() = 0;` declares a pure virtual function; `= 0` is the pure specifier and there is no body. A class with at least one pure virtual function is abstract: it cannot be instantiated (`A a;`, `A f();`, `void h(A a);` all fail; `A*` and `A&` are fine), and a derived class stays abstract until it overrides every pure virtual function. C++ has no `abstract` keyword."
  },
  {
    "q": "**Q13 (4 marks).** What is the copy-and-swap idiom? Write the canonical `operator=` and its steps, and say what it needs from the class. Then type how the operator takes its right-hand side.",
    "week": "W4",
    "type": "text",
    "answer": ["by value", "value", "pass by value", "passed by value", "a copy", "by copy"],
    "explain": "Copy-and-swap is the canonical way to write the copy assignment operator from the copy constructor and the destructor: `MyClass& operator=(MyClass rhs) { mySwap(*this, rhs); return *this; }`. (1) The parameter is taken by value, so the copy constructor makes the local copy; (2) a swap function swaps every member of `*this` with the copy, so the destination acquires the new data; (3) `return *this;` lets `C = B = A` chain; (4) the local copy is destroyed as the function ends, taking the old data with it. It needs a working copy constructor, a working destructor and a non-throwing swap of all members, and it handles `a = a;` without a self-assignment test."
  },
  {
    "q": "**Q14 (6 marks).** What is the most-derived class, and what responsibility does it carry in a diamond? Type the kind of base class it must construct itself.",
    "week": "W4",
    "type": "text",
    "answer": ["virtual", "virtual base", "virtual base class", "the virtual base", "virtual bases"],
    "explain": "The most-derived class is the class of the complete object being constructed (`math_student` when you write `math_student bob(...)`). With virtual inheritance it is responsible for constructing the shared virtual base: its initializer list must call `person(name)` itself (`: person(name), student(passed), mathematician(proved)`), because the middle classes' `person(name)` calls are ignored when they are part of a more derived object. Forget it and `person()` runs: the name is lost."
  },
  {
    "q": "**Q15 (6 marks).** Define a strict weak ordering by its three properties and say where the STL needs one. Type the property that says `lessThan(x, x) == false`.",
    "week": "W6",
    "type": "text",
    "answer": ["irreflexivity", "irreflexive"],
    "explain": "A comparison `lessThan(left, right)` is a strict weak ordering iff it is irreflexive (`lessThan(x, x) == false`), antisymmetric (if `lessThan(x, y)` then `!lessThan(y, x)`) and transitive (if `lessThan(x, y)` and `lessThan(y, z)` then `lessThan(x, z)`). `set`, `map`, `priority_queue` and `sort` require it. Supply it as `operator<`, as a binary predicate function, or as a functor with `operator()`."
  },
  {
    "q": "**Q16 (4 marks).** What does `noexcept` on a function promise, and what happens if the promise is broken? Type the name of the function that is called when it is broken.",
    "week": "W5",
    "type": "text",
    "answer": ["terminate", "std::terminate", "terminates", "std::terminate()", "terminate()"],
    "explain": "`double square_root(double x) noexcept` promises that no exception leaves the function, so callers never need to check. If one is thrown anyway, `std::terminate` is called and the program ends, which is what should happen. Destructors are implicitly `noexcept`. C++03's throw lists (`throw(T)`) were deprecated: do not use them."
  },
  {
    "q": "**Q17 (4 marks).** What is a static member? Give one data and one function example and say what a static member function lacks. Type that missing thing.",
    "week": "W7",
    "type": "text",
    "answer": ["this", "this pointer", "the this pointer", "a this pointer", "*this"],
    "explain": "A static data member belongs to the class, not to any object: one copy shared by all instances, defined once in the implementation file (`int city::counter = 0;`, `const int Date::days_in_regular_year[] = {...};`). A static member function (`static Date today();`, `static bool is_leap_year(int year);`) is called as `Date::today()` without an object and therefore has no `this` pointer: it can touch only static members."
  },
  {
    "q": "**Q18 (5 marks).** What is object slicing, when does it happen, and how is it avoided? Type the one word for the part of the object that survives the copy.",
    "week": "W3",
    "type": "text",
    "answer": ["base", "base part", "base class", "base-class part", "the base part", "base class part"],
    "explain": "`Polygon p2 = rect;` or `void show(Shape s)` copies a derived object into a base-class object: only the base part is copied, the derived members are sliced off, and a virtual call on the copy runs the base version. It happens whenever an object is passed, returned or assigned by value as its base type. Avoid it by handling objects through `Base&` or `Base*`, which is the only way virtual dispatch works."
  }
]
```

## Part B: write the output (Q19 to Q25, 19 marks)

Each program compiles warning-free with `g++ -std=c++20 -Wall -Wextra -pedantic`; the outputs below are the compiler's, not a reading of the code. Trace on paper, number the lines, then pick.

```quiz
[
  {
    "q": "**Q19 (4 marks).** What is printed? Hint: 10 lines.",
    "week": "W3 W4",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual void draw() const { cout << \"Shape::draw\" << endl; }\n    void info() const { cout << \"Shape::info\" << endl; }\n    virtual ~Shape() { cout << \"~Shape\" << endl; }\n};\n\nclass Circle : public Shape {\npublic:\n    void draw() const override { cout << \"Circle::draw\" << endl; }\n    void info() const { cout << \"Circle::info\" << endl; }\n    ~Circle() { cout << \"~Circle\" << endl; }\n};\n\nvoid show(Shape s) { s.draw(); }\n\nint main() {\n    Circle c;\n    Shape* p = &c;\n    p->draw();\n    p->info();\n    p->Shape::draw();\n    show(c);\n    Shape* h = new Circle;\n    delete h;\n    cout << \"end\" << endl;\n}",
    "options": [
      "Circle::draw / Circle::info / Shape::draw / Shape::draw / ~Shape / ~Circle / ~Shape / end / ~Circle / ~Shape",
      "Circle::draw / Shape::info / Shape::draw / Circle::draw / ~Circle / ~Shape / ~Shape / end / ~Circle / ~Shape",
      "Circle::draw / Shape::info / Shape::draw / Shape::draw / ~Shape / ~Circle / ~Shape / end / ~Circle / ~Shape",
      "Circle::draw / Shape::info / Circle::draw / Shape::draw / ~Shape / ~Circle / ~Shape / end / ~Circle / ~Shape"
    ],
    "answer": 2,
    "explain": "`p->draw()` is virtual through a base pointer: Circle::draw. `p->info()` is not virtual, so the pointer's static type decides: Shape::info. `p->Shape::draw()` is a qualified call that bypasses dispatch: Shape::draw. `show(c)` copies the Circle into a `Shape` parameter (slicing), so `s.draw()` prints Shape::draw and the copy's destructor prints ~Shape when show returns. `delete h` through a base pointer with a virtual destructor runs ~Circle then ~Shape. Then end, and `c` dies at the end of main: ~Circle, ~Shape. Ten lines."
  },
  {
    "q": "**Q20 (3 marks).** What is printed? Hint: 7 lines.",
    "week": "W4",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Device {\nprotected:\n    string name;\npublic:\n    Device() : name(\"unnamed\") { cout << \"Device()\" << endl; }\n    Device(const string& n) : name(n) { cout << \"Device(\" << n << \")\" << endl; }\n};\n\nclass Phone : virtual public Device {\npublic:\n    Phone(const string& n) : Device(n) { cout << \"Phone\" << endl; }\n};\n\nclass Camera : virtual public Device {\npublic:\n    Camera(const string& n) : Device(n) { cout << \"Camera\" << endl; }\n};\n\nclass SmartPhone : public Phone, public Camera {\npublic:\n    SmartPhone(const string& n) : Phone(n), Camera(n) { cout << \"SmartPhone\" << endl; }\n    void describe() const { cout << \"I am \" << name << endl; }\n};\n\nint main() {\n    SmartPhone s(\"Pixel\");\n    s.describe();\n    Phone p(\"Nokia\");\n}",
    "options": [
      "Device() / Phone / Camera / SmartPhone / I am unnamed / Device(Nokia) / Phone",
      "Device(Pixel) / Phone / Camera / SmartPhone / I am Pixel / Device(Nokia) / Phone",
      "Device(Pixel) / Phone / Device(Pixel) / Camera / SmartPhone / I am Pixel / Device(Nokia) / Phone",
      "Device() / Phone / Camera / SmartPhone / I am unnamed / Device() / Phone"
    ],
    "answer": 0,
    "explain": "Device is a virtual base of both middle classes, so `SmartPhone s` holds one Device and the most-derived class must construct it. SmartPhone's initializer list does not name Device, so the default constructor runs first (`Device()`, name becomes unnamed) and the `Device(n)` calls written in Phone and Camera are ignored. Then Phone, Camera (declaration order), SmartPhone, and `describe()` prints the lost name. `Phone p(\"Nokia\")` is a different story: Phone is now the most-derived class, so its own `Device(n)` call counts: Device(Nokia), Phone. Seven lines; `name` is unambiguous in SmartPhone because there is only one Device. The fix is `SmartPhone(const string& n) : Device(n), Phone(n), Camera(n)`: the most-derived class calls the shared base's constructor itself, and the first line becomes Device(Pixel), the fifth I am Pixel."
  },
  {
    "q": "**Q21 (3 marks).** What is printed? Hint: 8 lines.",
    "week": "W5",
    "code": "#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nstruct Guard {\n    const char* tag;\n    Guard(const char* t) : tag(t) { cout << \"open \" << tag << endl; }\n    ~Guard() { cout << \"close \" << tag << endl; }\n};\n\nvoid inner() {\n    Guard g(\"inner\");\n    throw runtime_error(\"disk full\");\n    cout << \"after throw\" << endl;\n}\n\nvoid middle() {\n    Guard g(\"middle\");\n    try {\n        inner();\n    } catch (const logic_error& e) {\n        cout << \"middle caught \" << e.what() << endl;\n    }\n    cout << \"middle done\" << endl;\n}\n\nint main() {\n    Guard g(\"main\");\n    try {\n        middle();\n        cout << \"no error\" << endl;\n    } catch (const exception& e) {\n        cout << \"main caught \" << e.what() << endl;\n    }\n    cout << \"end\" << endl;\n}",
    "options": [
      "open main / open middle / open inner / close inner / middle caught disk full / middle done / close middle / no error / end / close main",
      "open main / open middle / open inner / main caught disk full / end / close inner / close middle / close main",
      "open main / open middle / open inner / after throw / close inner / close middle / main caught disk full / end / close main",
      "open main / open middle / open inner / close inner / close middle / main caught disk full / end / close main"
    ],
    "answer": 3,
    "explain": "Three guards open going down. The throw leaves `inner` at once (after throw never prints) and destroys its local: close inner. `middle`'s handler is for `logic_error`; `runtime_error` is a sibling under `std::exception`, not a child of `logic_error`, so it does not match: the frame is unwound (close middle) and middle done never prints. `main`'s `catch (const exception&)` matches by reference: main caught disk full. no error is skipped because the try block was abandoned, end prints, and main's guard closes last. Eight lines. Had `middle` caught `const exception&`, the first matching handler up the stack would be `middle`'s: it would print middle caught disk full and middle done, and `main`'s handler would never run."
  },
  {
    "q": "**Q22 (2 marks).** What is printed? Hint: 2 lines.",
    "week": "W1",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 7;\n    int b = 2;\n    double half = a / b;\n    double real = (double)a / b;\n    double late = (double)(a / b);\n    float f = -2.75f;\n    int g = (int)f;\n    int h(a / b * b);\n    cout << half << \" \" << real << \" \" << late << endl;\n    cout << g << \" \" << h << \" \" << a % b << endl;\n}",
    "options": [
      "3 3.5 3 / -2 6 1",
      "3.5 3.5 3.5 / -3 7 1",
      "3 3.5 3.5 / -3 6 1",
      "3.5 3.5 3 / -2 7 1"
    ],
    "answer": 0,
    "explain": "`a / b` is integer division, 3, done before the result is stored in a double, so `half` prints 3 (`cout` drops the .0). `(double)a / b` casts first and divides as doubles: 3.5. `(double)(a / b)` casts the already truncated 3. A C-style cast to `int` truncates toward zero, so -2.75 becomes -2, not -3. `int h(a / b * b)` is the `()` form of initialization: 7 / 2 * 2 is 3 * 2, which is 6, and `7 % 2` is 1."
  },
  {
    "q": "**Q23 (2 marks).** What is printed? Hint: 3 lines.",
    "week": "W1",
    "code": "#include <iomanip>\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int qty = 42;\n    double price = 3.14159;\n    cout << setfill('.');\n    cout << setw(6) << qty << \"|\" << qty << \"|\" << endl;\n    cout << setw(6) << left << qty << \"|\" << endl;\n    cout << setprecision(3) << price << \" \" << fixed << price << endl;\n}",
    "options": [
      "....42|42| / 42....| / 3.14 3.142",
      "....42|....42| / 42....| / 3.14 3.142",
      "....42|42| / ....42| / 3.14 3.142",
      "....42|42| / 42....| / 3.142 3.142"
    ],
    "answer": 0,
    "explain": "`setfill('.')` stays in force, so every padded field pads with dots. `setw(6)` applies to the next insertion only: the first 42 is padded to six characters, the second prints at its natural width. `left` stays in force and puts the padding after the value. `setprecision(3)` with neither `fixed` nor `scientific` on means 3 significant digits, 3.14; after `fixed` it means 3 digits after the decimal point, 3.142."
  },
  {
    "q": "**Q24 (3 marks).** What is printed? Hint: 8 lines.",
    "week": "W3 W7",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Parent {\n    Parent() { cout << \"Parent()\" << endl; }\n    Parent(const Parent&) { cout << \"Parent copy\" << endl; }\n    virtual ~Parent() { cout << \"~Parent\" << endl; }\n    virtual void who() const { cout << \"Parent::who\" << endl; }\n};\n\nstruct Child : public Parent {\n    Child() { cout << \"Child()\" << endl; }\n    Child(const Child& other) : Parent(other) { cout << \"Child copy\" << endl; }\n    ~Child() { cout << \"~Child\" << endl; }\n    void who() const override { cout << \"Child::who\" << endl; }\n};\n\nvoid passByValue(Parent p) { p.who(); }\n\nvoid passByReference(const Parent& p) { p.who(); }\n\nint main() {\n    Child c;\n    passByValue(c);\n    passByReference(c);\n}",
    "options": [
      "Parent() / Child() / Parent copy / Parent::who / ~Parent / Child::who / ~Child / ~Parent",
      "Parent() / Child() / Parent copy / Child copy / Child::who / ~Child / ~Parent / Child::who / ~Child / ~Parent",
      "Parent() / Child() / Parent copy / Parent::who / ~Parent / Parent::who / ~Child / ~Parent",
      "Parent() / Child() / Child copy / Parent::who / ~Parent / Child::who / ~Child / ~Parent"
    ],
    "answer": 0,
    "explain": "`Child c;` runs Parent() then Child(). `passByValue(c)` copies the Child into a `Parent` parameter, and that copy is built by Parent's copy constructor, not Child's: only the base part is copied (slicing). The copy is a real `Parent`, so the virtual call prints Parent::who, and the copy dies when the function returns: ~Parent. `passByReference(c)` makes no copy, and the reference reaches the Child: Child::who. At the end of main `c` is destroyed: ~Child, ~Parent. Eight lines."
  },
  {
    "q": "**Q25 (2 marks).** What is printed? Hint: 5 lines.",
    "week": "W7",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Number {\nprivate:\n    int num;\npublic:\n    Number(int n) : num(n) { cout << \"Number(int) \" << num << endl; }\n    Number(const Number& n2) : num(n2.num) { cout << \"Number(const Number&) \" << num << endl; }\n    ~Number() { cout << \"~Number \" << num << endl; }\n};\n\nNumber createNumber(int num) {\n    return Number(num);\n}\n\nint main() {\n    Number n = createNumber(5);\n    Number m(Number(2));\n    cout << \"end\" << endl;\n}",
    "options": [
      "Number(int) 5 / Number(int) 2 / end / ~Number 2 / ~Number 5",
      "Number(int) 5 / Number(const Number&) 5 / ~Number 5 / Number(int) 2 / Number(const Number&) 2 / ~Number 2 / end / ~Number 2 / ~Number 5",
      "Number(int) 5 / Number(const Number&) 5 / ~Number 5 / Number(int) 2 / end / ~Number 2 / ~Number 5",
      "Number(int) 5 / Number(int) 2 / end / ~Number 5 / ~Number 2"
    ],
    "answer": 0,
    "explain": "Each line of main creates exactly one Number, built by the one-parameter constructor; the copy constructor never runs. `createNumber` returns `Number(num)`, a temporary of the same type, so it is constructed straight into `n` (RVO), and `Number m(Number(2));` initializes `m` directly from `Number(2)` (copy elision). The slides call this an optimization some compilers may skip; since C++17 it is guaranteed for both lines, even with `-fno-elide-constructors`. Only NRVO (`Number tempN(num); return tempN;`) is still optional. Objects die in reverse order: ~Number 2, then ~Number 5."
  }
]
```

## Part B: short coding (Q26, 5 marks)

```challenge
{
  "week": "W4 W6",
  "prompt": "<b>Q26 (5 marks).</b> <code>Student</code> is a struct with a <code>name</code> and a <code>grade</code>. Write a non-member <code>operator&lt;</code> so that <code>std::sort</code> orders a <code>vector&lt;Student&gt;</code> by grade ascending, with equal grades in alphabetical order of name. The comparison must be a strict weak ordering. <code>main</code> is given and must not change.",
  "starter": "#include <algorithm>\n#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int grade;\n};\n\n// YOUR CODE: bool operator<(const Student& lhs, const Student& rhs)\n\nint main() {\n    vector<Student> roster = { {\"Mia\", 88}, {\"Ben\", 72}, {\"Zed\", 88}, {\"Ada\", 95} };\n    sort(roster.begin(), roster.end());\n    for (const Student& s : roster) {\n        cout << s.name << \" \" << s.grade << endl;\n    }\n}\n",
  "expected": "Ben 72\nMia 88\nZed 88\nAda 95",
  "hints": [
    "Both parameters are <code>const Student&amp;</code>: no copy, no modification. Return <code>bool</code>.",
    "Compare the first key with <code>&lt;</code> only when the grades differ; fall through to the second key when they are equal. Never use <code>&lt;=</code>: <code>lessThan(x, x)</code> must be false.",
    "<code>if (lhs.grade != rhs.grade) return lhs.grade &lt; rhs.grade; return lhs.name &lt; rhs.name;</code>. <code>std::string</code> already compares lexicographically."
  ],
  "solution": "#include <algorithm>\n#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nstruct Student {\n    string name;\n    int grade;\n};\n\nbool operator<(const Student& lhs, const Student& rhs) {\n    if (lhs.grade != rhs.grade) {\n        return lhs.grade < rhs.grade;\n    }\n    return lhs.name < rhs.name;\n}\n\nint main() {\n    vector<Student> roster = { {\"Mia\", 88}, {\"Ben\", 72}, {\"Zed\", 88}, {\"Ada\", 95} };\n    sort(roster.begin(), roster.end());\n    for (const Student& s : roster) {\n        cout << s.name << \" \" << s.grade << endl;\n    }\n}\n"
}
```

Marking: 1 for the signature (`const Student&` twice, returns `bool`, not a member), 2 for the two-key comparison, 1 for a strict weak ordering (`<`, never `<=`), 1 for the right output order. A one-key version that ignores names earns 3.

## Part B: long coding question (Q27, 15 marks)

An `Inventory` belongs to an `owner` and keeps `slots` integer counts in an array on the heap: `string owner; int slots; int* counts;`. On paper the four parts build one class; here each part is its own program with the earlier parts already filled in, so every part compiles on its own. The destructor `~Inventory() { delete[] counts; }`, `add(slot, n)` and `get(slot)` are given.

```challenge
{
  "week": "W2 W3 W5",
  "prompt": "<b>Q27a (3 marks).</b> Write the constructor <code>Inventory(const string&amp; owner, int slots)</code>. It stores both arguments, allocates <code>counts</code> with <code>new int[slots]</code>, sets every slot to 0, and throws <code>std::invalid_argument(\"slots must be positive\")</code> when <code>slots &lt;= 0</code>. Expected output:<pre>3 slots: 2 0 7\ncaught: slots must be positive</pre>",
  "starter": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;   // slots integers on the heap, all 0 at first\npublic:\n    // (a) YOUR CODE: Inventory(const string& owner, int slots)\n\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    int get(int slot) const { return counts[slot]; }\n    int size() const { return slots; }\n};\n\nint main() {\n    Inventory bag(\"Ada\", 3);\n    bag.add(0, 2);\n    bag.add(2, 7);\n    cout << bag.size() << \" slots: \" << bag.get(0) << \" \" << bag.get(1) << \" \" << bag.get(2) << endl;\n    try {\n        Inventory bad(\"Ben\", 0);\n        cout << \"built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n}\n",
  "expected": "3 slots: 2 0 7\ncaught: slots must be positive",
  "hints": [
    "Initializer list first: <code>: owner(owner), slots(slots), counts(nullptr)</code> (same names are allowed; outside the parentheses means the member). Check the argument in the body before allocating.",
    "<code>throw invalid_argument(\"slots must be positive\");</code> needs <code>&lt;stdexcept&gt;</code>. A constructor that throws creates no object, so <code>built</code> never prints and nothing is leaked if you throw before <code>new</code>.",
    "<code>counts = new int[slots]; for (int i = 0; i &lt; slots; ++i) counts[i] = 0;</code>"
  ],
  "solution": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;   // slots integers on the heap, all 0 at first\npublic:\n    // (a) YOUR CODE: constructor\n    Inventory(const string& owner, int slots) : owner(owner), slots(slots), counts(nullptr) {\n        if (slots <= 0) {\n            throw invalid_argument(\"slots must be positive\");\n        }\n        counts = new int[slots];\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = 0;\n        }\n    }\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    int get(int slot) const { return counts[slot]; }\n    int size() const { return slots; }\n};\n\nint main() {\n    Inventory bag(\"Ada\", 3);\n    bag.add(0, 2);\n    bag.add(2, 7);\n    cout << bag.size() << \" slots: \" << bag.get(0) << \" \" << bag.get(1) << \" \" << bag.get(2) << endl;\n    try {\n        Inventory bad(\"Ben\", 0);\n        cout << \"built\" << endl;\n    } catch (const invalid_argument& e) {\n        cout << \"caught: \" << e.what() << endl;\n    }\n}\n"
}
```

```challenge
{
  "week": "W3",
  "prompt": "<b>Q27b (3 marks).</b> Write the copy constructor. The compiler's version would copy the pointer, so <code>a</code> and <code>b</code> would share one array and <code>delete[]</code> it twice. Yours must give the copy its own array with the same contents. Expected output:<pre>a: 5 b: 6</pre>",
  "starter": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;\npublic:\n    Inventory(const string& owner, int slots) : owner(owner), slots(slots), counts(nullptr) {\n        if (slots <= 0) {\n            throw invalid_argument(\"slots must be positive\");\n        }\n        counts = new int[slots];\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = 0;\n        }\n    }\n    // (b) YOUR CODE: copy constructor\n\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    int get(int slot) const { return counts[slot]; }\n    int size() const { return slots; }\n};\n\nint main() {\n    Inventory a(\"Ada\", 3);\n    a.add(1, 5);\n    Inventory b = a;\n    b.add(1, 1);\n    cout << \"a: \" << a.get(1) << \" b: \" << b.get(1) << endl;\n}\n",
  "expected": "a: 5 b: 6",
  "hints": [
    "Signature: <code>Inventory(const Inventory&amp; other)</code>. <code>const</code> so immutable objects can be copied, <code>&amp;</code> so the parameter is not itself a copy (infinite recursion otherwise).",
    "Deep copy: <code>: owner(other.owner), slots(other.slots), counts(new int[other.slots])</code>, then a loop copying <code>other.counts[i]</code> into <code>counts[i]</code>.",
    "If your output is <code>a: 6 b: 6</code> you copied the pointer, not the array (and the program double-frees at the end of main)."
  ],
  "solution": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;\npublic:\n    Inventory(const string& owner, int slots) : owner(owner), slots(slots), counts(nullptr) {\n        if (slots <= 0) {\n            throw invalid_argument(\"slots must be positive\");\n        }\n        counts = new int[slots];\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = 0;\n        }\n    }\n    // (b) YOUR CODE: copy constructor (deep copy)\n    Inventory(const Inventory& other) : owner(other.owner), slots(other.slots), counts(new int[other.slots]) {\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = other.counts[i];\n        }\n    }\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    int get(int slot) const { return counts[slot]; }\n    int size() const { return slots; }\n};\n\nint main() {\n    Inventory a(\"Ada\", 3);\n    a.add(1, 5);\n    Inventory b = a;\n    b.add(1, 1);\n    cout << \"a: \" << a.get(1) << \" b: \" << b.get(1) << endl;\n}\n"
}
```

```challenge
{
  "week": "W4",
  "prompt": "<b>Q27c (3 marks).</b> Overload <code>operator&lt;&lt;</code> as a friend so that <code>cout &lt;&lt; a</code> prints the owner, a colon, and every count preceded by a space, and so that it chains with <code>&lt;&lt; endl</code>. Declare it inside the class and define it outside. Expected output:<pre>Ada: 0 5 0\nAda: 0 6 0</pre>",
  "starter": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;\npublic:\n    Inventory(const string& owner, int slots) : owner(owner), slots(slots), counts(nullptr) {\n        if (slots <= 0) {\n            throw invalid_argument(\"slots must be positive\");\n        }\n        counts = new int[slots];\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = 0;\n        }\n    }\n    Inventory(const Inventory& other) : owner(other.owner), slots(other.slots), counts(new int[other.slots]) {\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = other.counts[i];\n        }\n    }\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    // (c) YOUR CODE: friend declaration of operator<<\n\n};\n\n// (c) YOUR CODE: definition of operator<<\n\nint main() {\n    Inventory a(\"Ada\", 3);\n    a.add(1, 5);\n    Inventory b = a;\n    b.add(1, 1);\n    cout << a << endl << b << endl;\n}\n",
  "expected": "Ada: 0 5 0\nAda: 0 6 0",
  "hints": [
    "The left operand is an <code>ostream</code>, so this cannot be a member: <code>friend ostream&amp; operator&lt;&lt;(ostream&amp; os, const Inventory&amp; inv);</code> inside the class.",
    "Write to <code>os</code>, not to <code>cout</code>, and finish with <code>return os;</code> so the call chains.",
    "<code>os &lt;&lt; inv.owner &lt;&lt; \":\"; for (int i = 0; i &lt; inv.slots; ++i) os &lt;&lt; \" \" &lt;&lt; inv.counts[i]; return os;</code>"
  ],
  "solution": "#include <iostream>\n#include <stdexcept>\n#include <string>\nusing namespace std;\n\nclass Inventory {\nprivate:\n    string owner;\n    int slots;\n    int* counts;\npublic:\n    Inventory(const string& owner, int slots) : owner(owner), slots(slots), counts(nullptr) {\n        if (slots <= 0) {\n            throw invalid_argument(\"slots must be positive\");\n        }\n        counts = new int[slots];\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = 0;\n        }\n    }\n    Inventory(const Inventory& other) : owner(other.owner), slots(other.slots), counts(new int[other.slots]) {\n        for (int i = 0; i < slots; ++i) {\n            counts[i] = other.counts[i];\n        }\n    }\n    ~Inventory() { delete[] counts; }\n    void add(int slot, int n) { counts[slot] += n; }\n    // (c) YOUR CODE: friend operator<<\n    friend ostream& operator<<(ostream& os, const Inventory& inv);\n};\n\nostream& operator<<(ostream& os, const Inventory& inv) {\n    os << inv.owner << \":\";\n    for (int i = 0; i < inv.slots; ++i) {\n        os << \" \" << inv.counts[i];\n    }\n    return os;\n}\n\nint main() {\n    Inventory a(\"Ada\", 3);\n    a.add(1, 5);\n    Inventory b = a;\n    b.add(1, 1);\n    cout << a << endl << b << endl;\n}\n"
}
```

```challenge
{
  "week": "W2 W6",
  "prompt": "<b>Q27d (6 marks).</b> The file <code>items.txt</code> holds one item per line, a name and a quantity separated by whitespace; a name may appear on several lines. Write <code>map&lt;string, int&gt; read_counts(istream&amp; in)</code> that reads every line until the end of input and returns a map from each name to its total quantity. On paper you would open <code>ifstream in(\"items.txt\")</code>; here <code>main</code> passes <code>cin</code> and the input box holds the file. Expected output:<pre>apple 5\nrope 3\nsword 3</pre>",
  "starter": "#include <iostream>\n#include <map>\n#include <sstream>\n#include <string>\nusing namespace std;\n\n// (d) YOUR CODE: map<string, int> read_counts(istream& in)\n\nint main() {\n    map<string, int> totals = read_counts(cin);   // on paper: ifstream in(\"items.txt\"); read_counts(in)\n    for (const auto& entry : totals) {\n        cout << entry.first << \" \" << entry.second << endl;\n    }\n}\n",
  "stdin": "sword 2\napple 5\nsword 1\nrope 3\n",
  "expected": "apple 5\nrope 3\nsword 3",
  "hints": [
    "Line by line: <code>string line; while (getline(in, line)) { ... }</code>. The loop ends when <code>getline</code> fails at end of input.",
    "Split each line with a string stream: <code>istringstream iss(line); string name; int qty; if (iss &gt;&gt; name &gt;&gt; qty) ...</code>",
    "<code>totals[name] += qty;</code> creates the key with value 0 on first sight and adds to it afterwards. <code>insert</code> would refuse the second <code>sword</code>, which is why the map's keys stay unique. Return the map by value; the map prints sorted by key."
  ],
  "solution": "#include <iostream>\n#include <map>\n#include <sstream>\n#include <string>\nusing namespace std;\n\n// (d) YOUR CODE: read \"name quantity\" lines until end of input;\n// return a map from name to the total quantity for that name\nmap<string, int> read_counts(istream& in) {\n    map<string, int> totals;\n    string line;\n    while (getline(in, line)) {\n        istringstream iss(line);\n        string name;\n        int qty;\n        if (iss >> name >> qty) {\n            totals[name] += qty;\n        }\n    }\n    return totals;\n}\n\nint main() {\n    map<string, int> totals = read_counts(cin);   // on paper: ifstream in(\"items.txt\"); read_counts(in)\n    for (const auto& entry : totals) {\n        cout << entry.first << \" \" << entry.second << endl;\n    }\n}\n"
}
```

Marking for Q27: (a) 1 initializer list, 1 allocate and zero, 1 throw before anything leaks; (b) 1 signature `const Inventory&`, 2 new array plus element copy; (c) 1 friend non-member taking `ostream&` and `const Inventory&`, 1 writes to `os`, 1 `return os;`; (d) 1 `ifstream` or `istream&` parameter and an open check on paper, 2 `getline` loop to end of input, 1 `istringstream` split, 1 `map<string, int>` with `[]` or `insert`, 1 return. Score the paper out of 105; retake until Part A is 60 or better and Part B is 35 or better.
