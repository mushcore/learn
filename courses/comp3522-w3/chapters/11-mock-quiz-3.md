---
title: Mock Quiz 3
minutes: 45
---

55 questions in the real format: multiple choice, true/false, select-all, what-does-this-print, fill-in-the-code, matching and bug hunts. Answer everything before you check. Every explanation says *why*, so a miss is still a lesson, and the ones you miss come back in the review queue until you get them right twice.

:::quiz Real quiz conditions
Written at the start of lab on the Learning Hub. It covers both Week 3 decks, the Week 3 sample projects, and the Testing and UML review decks. The programs in the questions are the instructor's own (Circle, Complex, Spy, whichconstructor, virtual2), so if a line looks familiar, trust what you ran. Aim for 90% here before you stop studying.
:::

```quiz
[
  {
    "q": "In C++, the only difference between `struct` and `class` is...",
    "options": ["structs cannot contain functions", "struct members are public by default, class members private by default", "structs cannot be inherited", "classes cannot be declared with objects after the brace"],
    "answer": 1,
    "explain": "Everything else is identical: both can hold data, functions, type definitions and nested classes, and both may declare objects between the closing brace and the semicolon."
  },
  {
    "q": "What does this print?",
    "code": "struct product { int weight; double price; } apple;\nint main() {\n    apple.weight = 2;\n    apple.price = 1.5;\n    cout << apple.weight * apple.price;\n}",
    "options": ["3", "a compile error: weight is private", "2", "1.5"],
    "answer": 0,
    "explain": "struct members are public, apple is declared right after the closing brace, and 2 × 1.5 = 3."
  },
  {
    "q": "Which of the four OOP concepts is described by 'combining data members and functions into a single unit called a class, with private data and public getters/setters'?",
    "options": ["Abstraction", "Encapsulation", "Inheritance", "Polymorphism"],
    "answer": 1,
    "explain": "Encapsulation. Abstraction is showing only relevant details (access specifiers, header files such as pow() in math.h)."
  },
  {
    "type": "match",
    "q": "Match each access level to who can use such a member.",
    "pairs": [
      ["public", "accessible anywhere"],
      ["protected", "accessible in the class and its derived classes"],
      ["private", "accessible only from within the class"]
    ],
    "explain": "The slide's table: derived classes see public and protected; non-members see only public."
  },
  {
    "q": "A class can contain which of the following? (select all)",
    "options": ["data members (member variables)", "member functions", "type definitions", "contained classes"],
    "answer": [0, 1, 2, 3],
    "explain": "All four are on the slide's list of what a class defines as a new data type."
  },
  {
    "q": "In Circle.cpp the function is written `double Circle::area()`. What does `Circle::` do?",
    "options": ["Returns a Circle", "Tells the compiler this definition belongs to the class Circle declared in the header", "Makes the function static", "Calls the constructor"],
    "answer": 1,
    "explain": "The scope operator attaches the definition to the class. Without it, area would be a free function with no access to radius."
  },
  {
    "q": "The slide's Circle sets radius 2 and returns `3.14 * radius * radius`. What does `cout << my_first_circle.area()` print?",
    "type": "numeric",
    "answer": 12.56,
    "tolerance": 0.001,
    "explain": "3.14 × 4 = 12.56."
  },
  {
    "type": "spotbug",
    "q": "Click the line with the error.",
    "code": "class Circle\n{\n    private:\n        double radius;\n    public:\n        void Circle(int r);\n        double area();\n};",
    "answer": 6,
    "explain": "Line 6: a constructor has no return type, not even void. void Circle(int r) declares an ordinary member function named Circle, which is an error."
  },
  {
    "q": "`Circle my_circle();` ...",
    "options": ["calls the default constructor", "calls Circle(int) with 0", "declares a function named my_circle returning a Circle (the most vexing parse)", "does not compile"],
    "answer": 2,
    "explain": "It is a valid function prototype, so no object is created. Use Circle my_circle; or Circle my_circle{};."
  },
  {
    "q": "Which declarations call Circle's default constructor? (select all)",
    "options": ["`Circle a;`", "`Circle b();`", "`Circle c{};`", "`Circle d = Circle();`"],
    "answer": [0, 2, 3],
    "explain": "a and c are the slide's two correct spellings; d explicitly constructs a temporary with the default constructor. b is the most vexing parse."
  },
  {
    "q": "A class declares `Circle(int);` and nothing else. `Circle c;` gives...",
    "options": ["a Circle with radius 0", "a Circle with an uninitialized radius", "a compile error: no default constructor", "a Circle with radius 10"],
    "answer": 2,
    "explain": "Declaring any constructor suppresses the compiler-generated default one. The slide fixes it by overloading with Circle()."
  },
  {
    "q": "Which is the member initialization list form of `Circle::Circle(int r) { radius = r; }`?",
    "options": ["`Circle::Circle(int r) : radius(r) { }`", "`Circle::Circle(int r) { radius(r); }`", "`Circle::Circle(int r) = radius(r);`", "`Circle::Circle(int r) : r(radius) { }`"],
    "answer": 0,
    "explain": "Colon, then member(value) pairs before the body. Outside the parentheses is the member; inside follows normal scoping."
  },
  {
    "q": "What does this print?",
    "code": "class A { public: A() {} A(const A&) { cout << \"A copy\\n\"; } };\nclass B { public: B() {} B(const B&) { cout << \"B copy\\n\"; } };\nclass Complex {\n    int r, i;\n    A a;\n    B b;\npublic:\n    Complex(const A& a, const B& b, int r = 0, int i = 0) : a(a), b(b), r(r), i(i)\n    { cout << \"constructor of complex\\n\"; }\n};\nint main() { A a; B b; Complex c{a, b, 5, 0}; }",
    "options": ["constructor of complex, A copy, B copy", "A copy, B copy, constructor of complex", "B copy, A copy, constructor of complex", "constructor of complex only"],
    "answer": 1,
    "explain": "Members are initialized (here copy constructed) before the body runs, in declaration order: r, i (silent), then a, then b. Then the body prints. This is the shipped Complex project."
  },
  {
    "q": "The class declares `int r, i; A a; B b;` but the list is written `: a(a), b(b), r(r), i(i)`. g++ says...",
    "options": ["error: initializer list out of order", "warning: 'Complex::b' will be initialized after 'int Complex::r' (-Wreorder); members are still initialized in declaration order", "nothing; the list order is used", "error: r used before a"],
    "answer": 1,
    "explain": "Initialization order is fixed by the declaration order in the class; the compiler warns that your list disagrees so you fix the list."
  },
  {
    "q": "A data member of a class type that is NOT in the initialization list is...",
    "options": ["left uninitialized", "implicitly default-constructed before the body runs", "a compile error always", "initialized to zero"],
    "answer": 1,
    "explain": "The slide: a member of class type is implicitly default-constructed if it is not contained in the initialization list. Fundamental types are simply left uninitialized."
  },
  {
    "q": "Why can the constructor be written `Complex(double r, double i) : r(r), i(i) { }` with the same names for members and parameters?",
    "options": ["It cannot; that is an error", "Names outside the parentheses in the list refer to members; inside, parameters hide members", "Because r and i are global", "Because the compiler renames the parameters"],
    "answer": 1,
    "explain": "The slide's rule for the initialization list. Inside the constructor body, however, r would mean the parameter, so use this->r there."
  },
  {
    "q": "`Complex(double r = 0, double i = 0)` replaces which three constructors?",
    "options": ["Complex(double, double), Complex(double), Complex()", "Complex(int), Complex(float), Complex(double)", "Complex(), ~Complex(), Complex(const Complex&)", "None; default arguments do not apply to constructors"],
    "answer": 0,
    "explain": "With defaults on both parameters, Complex c; Complex c1(5); Complex c2(5,6); all match the one constructor. Too much code became one line."
  },
  {
    "q": "Which prototype is an ERROR?",
    "options": ["`int f(int, int = 0, char * = nullptr);`", "`int g(int = 0, int = 0, char *);`", "`void h(int x = 1, int y = 2);`", "`int k(char * = nullptr);`"],
    "answer": 1,
    "explain": "Defaults must be trailing: g has a parameter without a default after two with defaults. k is fine because of the space between * and =."
  },
  {
    "q": "`int creates_error(char *= nullptr);` fails to compile because...",
    "options": ["char pointers cannot have defaults", "`*=` is read as the compound assignment operator; a space is needed between * and =", "nullptr is not a char", "the function has no name"],
    "answer": 1,
    "explain": "The slide's note: space between * and = is needed."
  },
  {
    "q": "Default argument values are written...",
    "options": ["in the header prototype only", "in the source definition only", "in both", "wherever the function is first called"],
    "answer": 0,
    "explain": "Header: void f(int x = 1, int y = 2); source: void f(int x, int y) { … }."
  },
  {
    "q": "A `const` member function such as `double get_weight_grams() const`...",
    "options": ["returns a constant", "promises not to modify the object's member variables, and the compiler enforces it", "can only be called on const objects", "cannot return anything"],
    "answer": 1,
    "explain": "The slide's caption: I promise this function's code will NOT change this object's member variables. Use it on every getter."
  },
  {
    "q": "The canonical copy constructor for Complex is...",
    "options": ["`Complex(Complex c)`", "`Complex(const Complex& c)`", "`Complex(Complex& c) const`", "`Complex copy(Complex c)`"],
    "answer": 1,
    "explain": "const so mutable and immutable objects can be copied; & so the parameter is not itself a copy (infinite internal copy loops)."
  },
  {
    "q": "Which statement calls the copy assignment operator rather than the copy constructor?",
    "code": "Complex c;\nComplex copyC(c);\nComplex anotherCopyC = c;\nanotherCopyC = c;",
    "options": ["`Complex copyC(c);`", "`Complex anotherCopyC = c;`", "`anotherCopyC = c;`", "`Complex c;`"],
    "answer": 2,
    "explain": "Both objects already exist, so it is an assignment. The slide comment: NO COPY CONSTRUCTOR CALL! Calls assignment operator."
  },
  {
    "q": "The compiler-generated copy constructor copies...",
    "options": ["nothing", "every member, in declaration order, by calling each member's copy constructor", "only public members", "only pointers"],
    "answer": 1,
    "explain": "Member-wise copy. For a pointer member that means the address is copied and the pointed-to data is shared: a shallow copy."
  },
  {
    "q": "MyVector has `unsigned size; double *data;` and no copy constructor. After `MyVector vCopy = v;`...",
    "options": ["vCopy has a new array with the same values", "vCopy.data holds the same address as v.data: one array shared by two objects", "vCopy.data is nullptr", "the program will not compile"],
    "answer": 1,
    "explain": "The shipped myVec main prints identical addresses for v and vCopy. Change one and the other changes; add a delete[] in a destructor and the array is freed twice."
  },
  {
    "type": "fill",
    "q": "Complete the deep copy constructor so vCopy gets its own array.",
    "code": "MyVector(const MyVector& v) : size(v.size), data(___)\n{\n    for (unsigned i = 0; i < size; ++i)\n        data[i] = v.data[i];\n}",
    "answer": ["new double[size]", "new double[v.size]", "new double [size]"],
    "explain": "Allocate fresh storage with new double[size]; the loop then copies the values. size must be initialized before data, which the declaration order guarantees."
  },
  {
    "q": "How is the destructor of class MyVector declared?",
    "options": ["`~MyVector();`", "`void ~MyVector();`", "`MyVector::delete();`", "`~MyVector(int);`"],
    "answer": 0,
    "explain": "Tilde plus the class name, no parameters, no return type: the complement of the default constructor."
  },
  {
    "q": "Which events invoke a destructor? (select all)",
    "options": ["the end of the scope of a local object", "`delete p;`", "`delete[] arr;`", "program termination for static objects", "calling a member function"],
    "answer": [0, 1, 2, 3],
    "explain": "The slide's list: program termination (statics), end of scope, explicit delete / delete[]."
  },
  {
    "q": "What does this print?",
    "code": "class T { int n; public: T(int n) : n(n) {} ~T() { cout << n; } };\nint main() {\n    T a(1);\n    { T b(2); }\n    T c(3);\n}",
    "options": ["123", "231", "213", "321"],
    "answer": 1,
    "explain": "b dies at its block's end (2), then at the end of main c and a are destroyed in reverse order of construction (3, then 1)."
  },
  {
    "q": "The two destructor rules the slides ask you to remember are: never throw exceptions from a destructor, and...",
    "options": ["always call delete in it", "if a class contains a virtual function, the destructor should be virtual too", "declare it private", "return 0 from it"],
    "answer": 1,
    "explain": "Both rules are explained in later weeks (exceptions; deleting through a base pointer)."
  },
  {
    "q": "`MyVector` allocates `data = new double[n]`. Its destructor must contain...",
    "options": ["`delete data;`", "`delete[] data;`", "`free(data);`", "nothing"],
    "answer": 1,
    "explain": "new[] pairs with delete[]. The slide: ~MyVector() { delete[] data; }"
  },
  {
    "q": "A Car has Wheels and a Wheel holds a pointer to its Car. Car.hpp includes Wheel.hpp and Wheel.hpp includes Car.hpp. The solution is...",
    "options": ["put both classes in main.cpp", "a forward declaration `class Car;` in Wheel.hpp, with `Car * owner;` as a pointer", "remove the include guards", "make Wheel inherit from Car"],
    "answer": 1,
    "explain": "Forward declaration (so simple!): the name is introduced without the definition, which is enough for a pointer or reference."
  },
  {
    "q": "With only a forward declaration `class Car;`, `Car owner;` as a member gives...",
    "options": ["a working member", "`field 'owner' has incomplete type`: the compiler cannot allocate an object it has not seen defined", "a warning only", "a linker error"],
    "answer": 1,
    "explain": "Only a pointer or reference to a forward-declared type is allowed; the compiler does not know the object's size."
  },
  {
    "q": "Which file contains the definitions (bodies) of a class's member functions?",
    "options": ["the header (.hpp)", "the source (.cpp)", "main.cpp", "CMakeLists.txt"],
    "answer": 1,
    "explain": "Declarations in the header tell the compiler the code exists somewhere; the source holds the implementations."
  },
  {
    "q": "The C++ form of Java's `class Bus extends Vehicle` is `class Bus : public Vehicle`.",
    "type": "tf",
    "answer": true,
    "explain": "The slide: ':' is equivalent to Java extends (with an access keyword after it)."
  },
  {
    "q": "After `class ProtectedSpy : protected Spy`, Spy's public member `publicPrint()` is, inside ProtectedSpy, ...",
    "options": ["public", "protected", "private", "inaccessible"],
    "answer": 1,
    "explain": "The inheritance keyword sets the most accessible level: public becomes protected."
  },
  {
    "q": "After `class PrivateSpy : private Spy`, which of Spy's members can PrivateSpy's own member functions call? (select all)",
    "options": ["publicPrint (now private in PrivateSpy)", "protectedPrint (now private in PrivateSpy)", "privatePrint"],
    "answer": [0, 1],
    "explain": "Inside PrivateSpy both inherited functions are usable (as private members); privatePrint is private in Spy and never accessible from a derived class. A class derived from PrivateSpy gets nothing."
  },
  {
    "q": "`class PrivateSpy2 : private PrivateSpy` where PrivateSpy derived privately from Spy. Can PrivateSpy2::print call `publicPrint()`?",
    "type": "tf",
    "answer": false,
    "explain": "publicPrint became private in PrivateSpy, so PrivateSpy2 cannot access it: the shipped file comments all three calls out."
  },
  {
    "q": "`class X : Spy { };` is which kind of inheritance?",
    "options": ["public", "protected", "private", "invalid"],
    "answer": 2,
    "explain": "Classes inherit privately by default (the shipped comment). Structs default to public."
  },
  {
    "q": "A publicly derived class inherits access to everything except... (select all)",
    "options": ["constructors", "the destructor", "friends", "private members", "protected members"],
    "answer": [0, 1, 2, 3],
    "explain": "The slide's four exceptions. Constructors and destructor are not inherited as such but are called automatically by the derived class's own. Protected members are inherited."
  },
  {
    "q": "What does `Derived_One first_child(0);` print?",
    "code": "class Base {\npublic:\n    Base() { cout << \"Base: no parameters\\n\"; }\n    Base(int a) { cout << \"Base: int parameter\\n\"; }\n};\nclass Derived_One : public Base {\npublic:\n    Derived_One(int a) { cout << \"Derived_One: int parameter\\n\"; }\n};",
    "options": ["Base: int parameter / Derived_One: int parameter", "Base: no parameters / Derived_One: int parameter", "Derived_One: int parameter", "Derived_One: int parameter / Base: no parameters"],
    "answer": 1,
    "explain": "No base initializer, so the base's default constructor is called (just like Java), and it runs before the derived body."
  },
  {
    "type": "fill",
    "q": "Make Derived_Two call `Base(int)` with its own argument.",
    "code": "Derived_Two(int a) : ___\n{ cout << \"Derived_Two: int parameter\\n\"; }",
    "answer": ["Base(a)", "Base (a)", "Base{a}"],
    "explain": "In C++ the call to super looks like a member initialization list entry: Base(a)."
  },
  {
    "q": "`class B : public A` where A keeps `int x` private with constructors `A()` and `A(int)`. Which B constructor is the correct way to set x to the argument?",
    "options": ["`B(int x) : x{x} { }`", "`B(int x) { set_x(x); }`", "`B(int x) : A{x} { }`", "`B(int x) : A::x{x} { }`"],
    "answer": 2,
    "explain": "A derived class initializes its base by calling the base constructor in its list. x{x} fails (member initializer does not name a member or base of B); set_x in the body works but default-constructs A first, the slide's NO DON'T DO THIS."
  },
  {
    "q": "\"A pointer to a derived class is type-compatible with a pointer to its base class.\" Which line uses that?",
    "options": ["`Rectangle * r = &shape;`", "`Shape * shape1 = &rect;`", "`Shape shape = rect;`", "`Rectangle rect = shape;`"],
    "answer": 1,
    "explain": "A Rectangle is a Shape, so its address fits in a Shape*. The reverse assignment is rejected."
  },
  {
    "q": "In polymorphism.cpp, Shape has `set_values` but no `area`; Rectangle adds `area()`. `Shape* shape1 = &rect; shape1->area();` ...",
    "options": ["prints the rectangle's area", "does not compile: Shape has no member area", "prints 0", "crashes"],
    "answer": 1,
    "explain": "Non-virtual members of the derived class cannot be accessed through a base pointer. The fix is a virtual area in the base."
  },
  {
    "q": "What does this print?",
    "code": "class Polygon { protected: int w = 4, h = 5; public: virtual int area() { return 0; } };\nclass Triangle : public Polygon { public: int area() { return w * h / 2; } };\nint main() {\n    Triangle t;\n    Polygon* p = &t;\n    Polygon copy = t;\n    cout << p->area() << \" \" << copy.area();\n}",
    "options": ["10 10", "10 0", "0 0", "0 10"],
    "answer": 1,
    "explain": "Through the pointer the virtual call dispatches to Triangle::area (10). copy is a Polygon object built from t's Polygon part (sliced), so Polygon::area runs (0). Polymorphism only works with pointers or references."
  },
  {
    "q": "Remove `virtual` from `Polygon::area`. Now `p->area()` with p pointing at a Triangle prints...",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "Without virtual the call binds at compile time to the pointer's static type Polygon, whose area returns 0."
  },
  {
    "q": "Which terms name what `virtual` enables? (select all)",
    "options": ["dynamic binding", "late binding", "polymorphic method dispatch", "the most vexing parse"],
    "answer": [0, 1, 2],
    "explain": "Three names for one thing on the slide. The most vexing parse is the Circle c(); trap."
  },
  {
    "q": "What does this print (three lines)?",
    "code": "class Base { public: virtual void print() { cout << \"base\\n\"; } };\nclass Derived : public Base { public: void print() override { cout << \"derived\\n\"; } };\nint main() {\n    Derived d;\n    Base& dr = d;\n    dr.print();\n    dr.Base::print();\n    Base baseDerived = d;\n    baseDerived.print();\n}",
    "options": ["derived / base / base", "derived / derived / derived", "base / base / base", "derived / base / derived"],
    "answer": 0,
    "explain": "Reference to a Derived: virtual dispatch gives derived. Qualified Base::print names the base function explicitly: base. baseDerived is a sliced Base object: base. The last three lines of virtual2.cpp."
  },
  {
    "q": "A class that declares or inherits a virtual function is called a...",
    "options": ["abstract class", "polymorphic class", "friend class", "virtual class"],
    "answer": 1,
    "explain": "The slide's definition. Abstract classes (pure virtual functions) are Week 4."
  },
  {
    "q": "Testing reveals the ______ of a problem; debugging pinpoints its ______.",
    "options": ["source, existence", "existence, source", "cost, fix", "cause, symptom"],
    "answer": 1,
    "explain": "Testing != Debugging. The manifestation may occur some distance from the source."
  },
  {
    "q": "A function accepts 100 to 999. Which set of tests covers every equivalence partition and both boundaries?",
    "options": ["100, 101, 102, 103, 104", "50, 100, 500, 999, 1500", "0, 500, 1000", "999, 1000, 1001"],
    "answer": 1,
    "explain": "One test below (50), the two boundaries (100, 999), one inside (500), one above (1500): each exercises one and only one partition."
  },
  {
    "q": "`#define NDEBUG` placed before `#include <cassert>`...",
    "options": ["makes assert print more detail", "turns assertions off", "is required for assert to work", "aborts the program"],
    "answer": 1,
    "explain": "assert evaluates an expression and terminates the program if it is false; NDEBUG compiles every assert away."
  },
  {
    "q": "The three kinds of testing COMP 3522 uses are assertions, unit tests and...",
    "options": ["beta testing", "regression testing", "usability testing", "load testing"],
    "answer": 1,
    "explain": "Regression testing re-runs the whole suite whenever a bug is fixed, because fixing new bugs can reintroduce old ones."
  },
  {
    "q": "What must the first two lines of `unit_tests.cpp` be for Catch?",
    "options": ["`#include <catch.hpp>` and `using namespace Catch;`", "`#define CATCH_CONFIG_MAIN` and `#include \"catch.hpp\"`", "`#include \"myStack.hpp\"` and `int main()`", "`TEST_CASE` and `REQUIRE`"],
    "answer": 1,
    "explain": "The define makes Catch supply main (in one cpp file only), then the header is included; your own main is commented out."
  },
  {
    "q": "In Lab 3, `top()` on an empty MyStack returns...",
    "options": ["0", "-1", "10", "the last pushed value"],
    "answer": 1,
    "explain": "The FAQ: return -1 (kept in a global const). The stack stores positive ints only, so negatives are free to mean errors."
  },
  {
    "type": "match",
    "q": "Match each UML relationship to its arrow.",
    "pairs": [
      ["Generalization", "solid line with a hollow triangle at the base class"],
      ["Realization", "dashed line with a hollow triangle at the interface"],
      ["Composition", "solid line with a filled diamond at the whole"],
      ["Aggregation", "solid line with a hollow diamond at the whole"],
      ["Dependency", "dashed arrow, no diamond"]
    ],
    "explain": "Triangles are 'is a' (solid: inherits, dashed: implements); diamonds are 'has a' (filled: parts die with the whole; hollow: parts live on); dashed arrow: uses without owning."
  },
  {
    "q": "A sequence diagram differs from a collaboration diagram in that it...",
    "options": ["shows classes instead of objects", "takes a time-based perspective, ordering messages top to bottom on lifelines", "has no actors", "cannot show return messages"],
    "answer": 1,
    "explain": "Collaboration: structural, numbered messages on links. Sequence: time-based, with lifelines, activations and call/return/self/create messages."
  }
]
```
