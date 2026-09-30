---
title: Constructors, member initialization, default arguments
minutes: 25
---

A constructor runs when an object is created, so the object never exists in a half-built state. The Circle from lesson 1 had none, which means its `radius` held garbage until `set_radius` was called. This lesson adds constructors and shows the two traps the quiz likes: the most vexing parse and the order of member initialization.

## A constructor, then a missing default constructor

```cpp run pin circleCtor.cpp
// predict: Write the two areas printed.
#include <iostream>
using namespace std;

class Circle
{
        double radius;
    public:
        Circle();            // No return type
        Circle(int);         // No return type
        void set_radius(int);
        double area();
};

Circle::Circle()
{
    radius = 10;    // Magic numbers are bad, but this is a lecture
}

Circle::Circle(int r) : radius(r)
{
    // Empty if there's nothing else to do
}

void Circle::set_radius(int new_radius) { radius = new_radius; }
double Circle::area() { return 3.14 * radius * radius; }

int main()
{
    Circle my_circle;       // Calls the default ctr
    Circle other{2};        // Calls Circle(int)
    cout << my_circle.area() << endl;
    cout << other.area() << endl;
    return 0;
}
```

A constructor has the class's name and **no return type**, not even `void`: `Circle();            // No return type`. Declaring `Circle(int)` alone would have removed the compiler-generated default constructor, so `Circle my_circle;` would no longer compile ("no matching function for call to Circle::Circle()"); the slide overloads with a second constructor `Circle::Circle()` to get it back. `Circle::Circle(int r) : radius(r)` uses the member initialization list, explained below; the first constructor assigns in the body instead, which works for a `double` but is the style the slides tell you to drop.

:::quiz The most vexing parse
`Circle my_circle;` calls the default constructor. `Circle my_circle();` does **not** create an object: it declares a function named `my_circle` that takes nothing and returns a Circle. `Circle my_circle{};` calls the default constructor and cannot be misread. Type each into the picker below.
:::

```widget
ctor-picker
{ "class": "circle", "decl": "Circle c();" }
```

## Member initialization lists

The first pass at a Complex number constructor assigns in the body:

```cpp
Complex(double rnew, double inew)
{
    r = rnew;
    i = inew;
}
```

The compiler wants every member initialized before the body runs, so it silently generates a call to each member's default constructor first: `Complex(double rnew, double inew) : r(), i() { r = rnew; i = inew; }`. For fundamental types that costs nothing and changes nothing (a `double` not in the list simply stays uninitialized). For a **class-type member** it means the member is default-constructed and then assigned: two operations, and an error if the member's class has no default constructor. The rule from the slides: always use the special syntax called the **member initialization list**.

```cpp run pin complexInit.cpp
// predict: Write the three lines printed, in order.
#include <iostream>
using namespace std;

class A {
public:
    A() {}
    A(const A &) { cout << "A copy constructed\n"; }
};

class B {
public:
    B() {}
    B(const B &) { cout << "B copy constructed\n"; }
};

class Complex
{
private:
    int r, i;
    A a;
    B b;
public:
    Complex(const A &a, const B &b, int r = 0, int i = 0) : a(a), b(b), r(r), i(i)
    {
        cout << "constructor of complex" << endl;
    }
    int get_r() { return r; }
    int get_i() { return i; }
};

int main()
{
    A a;
    B b;
    Complex c{a, b, 5, 0};
    cout << c.get_r() << " " << c.get_i() << endl;
}
```

This is the shipped Complex project. `Complex(const A &a, const B &b, int r = 0, int i = 0) : a(a), b(b), r(r), i(i)` initializes all four members in the list, so the members `a` and `b` are **copy constructed** straight from the arguments and their messages print before `constructor of complex`, the body. Names in the list outside the parentheses are members; inside the parentheses the parameters hide the members, so `a(a)` means "member a, from parameter a".

The program also demonstrates the ordering rule. The list is written `a, b, r, i`, but the class declares `r, i, a, b`, and g++ warns `'Complex::b' will be initialized after 'int Complex::r' [-Wreorder]`. **Data members are initialized in the order they are declared in the class, not the order they appear in the list.** Write the list in declaration order and the warning goes away.

```widget
lifetime-trace
{ "preset": "Members before the body (Complex)", "presets": false, "title": "Members are constructed before the constructor body runs" }
```

## Default arguments instead of three constructors

Three constructors, `Complex(double r, double i)`, `Complex(double r)`, `Complex()`, collapse into one:

```cpp run pin defaultArgs.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

class Complex
{
    double r, i;
public:
    Complex(double r = 0, double i = 0) : r(r), i(i) { }
    void print() const { cout << r << " + " << i << "i" << endl; }
};

int main()
{
    Complex c;
    Complex c1(5);
    Complex c2(5, 6);
    c.print();
    c1.print();
    c2.print();
    return 0;
}
```

`Complex(double r = 0, double i = 0) : r(r), i(i) { }` handles all three declarations: `Complex c;` uses both defaults, `Complex c1(5);` supplies r and defaults i, `Complex c2(5, 6);` supplies both. A constructor whose every parameter has a default value counts as a default constructor.

Default values may be given for **trailing** parameters only:

```cpp
int f(int, int = 0, char * = nullptr);    // OK
int g(int = 0, int = 0, char *);          // ERROR: a later parameter has no default
int h(int = 0, int, char * = nullptr);    // ERROR: gap in the middle
int creates_error(char *= nullptr);       // ERROR: *= is an operator; the space matters
```

They go in the **prototype in the header**, never repeated in the source: header `void f(int x = 1, int y = 2);`, source `void f(int x, int y) { ... }`.

## Default member values and const member functions

Members can carry a default in the class itself, `double r = 0.0, i = 0.0;`, so a constructor only sets what differs; the benefit grows with the size of the class. And `void print() const` above carries a `const` after the parameter list: a promise that the function will not change the object's members, which the compiler enforces. Use it on every getter.

:::tip Why a default constructor is worth defining
Containers of a type without one (lists, trees, matrices of Circles) are cumbersome; a default constructor eliminates uninitialized variables of the type; a variable declared in an outer scope for algorithmic reasons must already hold a meaningful value. Ask: does this type have a natural default state? Circle chose radius 10, Complex chose 0 + 0i.
:::

```quiz
[
  {
    "q": "Which is true of a constructor's return type?",
    "options": ["It is `void`", "It is the class type", "It has no return type at all", "It is `int` like main"],
    "answer": 2,
    "explain": "The slide comment on both declarations: Circle(int); // No return type. Writing void Circle() declares an ordinary member function named Circle, not a constructor."
  },
  {
    "q": "What does `Circle my_circle();` declare?",
    "options": ["A Circle built with the default constructor", "A Circle built with radius 0", "A function named my_circle that takes no arguments and returns a Circle", "A compile error"],
    "answer": 2,
    "explain": "The most vexing parse: it is a valid function prototype, so the compiler accepts it and you get no object. Use Circle my_circle; or Circle my_circle{};."
  },
  {
    "q": "A class declares only `Circle(int);`. Does `Circle c;` compile?",
    "options": ["Yes, radius is left uninitialized", "No: once any constructor is declared the compiler stops generating the default one, and Circle(int) needs an argument", "Yes, the int defaults to 0", "Only if radius is public"],
    "answer": 1,
    "explain": "The slide: now that we have a constructor we can't do this anymore; the compiler complains that we don't have a default constructor. Fix: overload with Circle(), or give the parameter a default value."
  },
  {
    "q": "What does this print?",
    "code": "class A { public: A() {} A(const A&) { cout << \"A copy\\n\"; } };\nclass X {\n    int n;\n    A a;\npublic:\n    X(const A& a, int n) : a(a), n(n) { cout << \"body\\n\"; }\n};\nint main() { A a; X x{a, 5}; }",
    "options": ["body then A copy", "A copy then body", "body only", "A copy only"],
    "answer": 1,
    "explain": "Members are initialized before the constructor body runs, so the member a is copy constructed from the argument (printing A copy) first, then the body prints. The warning about n and a being listed out of declaration order does not change that members come first."
  },
  {
    "q": "The class declares `int r, i; A a; B b;` and the constructor's list reads `: a(a), b(b), r(r), i(i)`. In what order are the members initialized?",
    "options": ["a, b, r, i (list order)", "r, i, a, b (declaration order)", "Alphabetical", "It is undefined"],
    "answer": 1,
    "explain": "The order of member initialization is determined by the order of member declaration, not by the initialization list; g++ emits the -Wreorder warning to tell you the list disagrees."
  },
  {
    "q": "Which declarations are legal? (select all)",
    "options": ["`int f(int, int = 0, char * = nullptr);`", "`int g(int = 0, int = 0, char *);`", "`int h(int = 0, int, char * = nullptr);`", "`int k(char *= nullptr);`"],
    "answer": [0],
    "explain": "Defaults are allowed for trailing parameters only, so g and h fail (a parameter without a default follows one with a default). k fails because *= is read as the compound-assignment operator; a space is needed: char * = nullptr."
  },
  {
    "q": "Where do default argument values belong?",
    "options": ["In the function prototype in the header file", "In the definition in the source file", "In both places, identically", "In main"],
    "answer": 0,
    "explain": "Header: void f(int x = 1, int y = 2); source: void f(int x, int y) { ... }. Repeating them in the source is an error (redefinition of default argument)."
  },
  {
    "q": "`Complex(double r = 0, double i = 0)` is a default constructor.",
    "type": "tf",
    "answer": true,
    "explain": "A default constructor takes no arguments OR has default values for every argument, so Complex c; is allowed."
  },
  {
    "type": "fill",
    "q": "Complete the member initialization list so that member `radius` is set from parameter `r`.",
    "code": "Circle::Circle(int r) : ___ { }",
    "answer": ["radius(r)", "radius{r}"],
    "explain": "member(parameter): the name outside the parentheses is the member, the name inside follows ordinary scoping (the parameter)."
  },
  {
    "q": "What does the `const` in `double Cat::get_weight_grams() const` promise?",
    "options": ["The return value cannot be changed", "The function will not modify the object's member variables, and the compiler checks it", "The function can only be called once", "The parameter list is empty"],
    "answer": 1,
    "explain": "The slide's caption: I promise this function's code will NOT change this object's member variables. Always use it on getters."
  }
]
```
