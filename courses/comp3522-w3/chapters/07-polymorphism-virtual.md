---
title: Polymorphism and virtual functions
minutes: 25
---

Polymorphism, from the Greek for many forms, means one call to a member function runs different functions depending on the type of the object. The slide promises it is easy, and the whole mechanism is one sentence: **a pointer to a derived class is type-compatible with a pointer to its base class.** In Java everything is a pointer, so you never noticed.

## A base pointer to a derived object

```cpp run pin polymorphism.cpp
// predict: Write the two lines printed. Then uncomment the counter line and read the error.
#include <iostream>
using namespace std;

class Shape
{
  private:
    int counter;
  protected:
    int width, height;
  public:
    void set_values (int a, int b) { width = a; height = b; }
};

class Rectangle: public Shape
{
  public:
    int area() { return width * height; }
};

class Triangle: public Shape
{
  public:
    int area() { return width * height / 2; }
};

int main () {
  Rectangle rect;
  Triangle trgl;
  Shape * shape1 = &rect;
  Shape * shape2 = &trgl;

  shape1->set_values (4,5);
  shape2->set_values (4,5);

  //cout << shape1->counter; // WILL THIS WORK?
  cout << "Rectangle area: "<< rect.area() << '\n';
  cout << "Triangle area: "<< trgl.area() << '\n';
  return 0;
}
```

`Shape * shape1 = &rect;` stores the address of a Rectangle in a pointer to Shape, which is legal because a Rectangle **is a** Shape. Through it, `shape1->set_values (4,5);` reaches the member Shape declares. `//cout << shape1->counter; // WILL THIS WORK?` would not: `counter` is private in Shape. And `shape1->area()` would not compile either: Shape has no `area`, so the areas are printed through `rect` and `trgl` directly. That is the limitation the next section fixes.

## Virtual member functions

A **virtual** member function is a base class member that can be redefined (Java: overridden) in a derived class, and a call through a base pointer or reference then runs the derived version. Add `virtual` to the declaration in the base class:

```cpp run pin virtual.cpp
// predict: Write the two lines printed. Then delete the word virtual, run again, and explain the new numbers.
#include <iostream>
using namespace std;

class Polygon
{
  protected:
    int width, height;
  public:
    void set_values (int a, int b) { width = a; height = b; }
    virtual int area () { return 0; } // THIS IS A BAD EXAMPLE, BUT OK UNTIL LATER THIS WEEK
};

class Rectangle: public Polygon
{
  public:
    int area () { return width * height; }
};

class Triangle: public Polygon
{
  public:
    int area () { return (width * height / 2); }
};

int main () {
  Rectangle rect;
  Triangle trgl;

  //polymorphism only works with pointers or references
  Polygon* poly = &rect;
  poly->set_values (4,5);
  cout << "Rectangle area: "<< poly->area() << endl;

  poly = &trgl;
  poly->set_values (4,5);
  cout << "Triangle area: " << poly->area() << endl;

  //polymorphism fails without pointers or references
  Polygon poly2 = rect;
  cout << "Copied into a Polygon: " << poly2.area() << endl;
  return 0;
}
```

`virtual int area () { return 0; }` gives Polygon an `area` that the derived classes redefine, so `poly->area()` prints 20 while `poly` points at the rectangle and 10 after `poly = &trgl;`. The comment `//polymorphism only works with pointers or references` is the rule: `Polygon poly2 = rect;` copies only the Polygon part of `rect` into a new Polygon object (the derived part is **sliced** off), so `poly2.area()` runs Polygon's version and prints 0. Remove the word `virtual` and every call through `poly` prints 0 too, because a non-virtual call is bound to the pointer's type at compile time.

The slide calls the `return 0` body a bad example: a base `area` that returns a fake number should be a pure virtual function instead, which is Week 4.

## Static type, dynamic type, and the qualified call

Vocabulary from the slides: `virtual` specifies that a non-static member function supports **dynamic binding**, also called late binding or polymorphic method dispatch; a class that declares or inherits a virtual function is a **polymorphic class**; virtual is used with pointers and references; a call to an overridden virtual function invokes the derived behaviour; the original can still be invoked by qualified name lookup, `var.Base::function()`.

```cpp run pin virtual2.cpp
// predict: Ten lines (three blank). Write each one before you run: base or derived?
#include <iostream>

class Base
{
public:
   virtual void print() { std::cout << "base\n"; }
};

class Derived : public Base
{
public:
    void print() override { std::cout << "derived\n"; }
};

int main()
{
    Base b;
    Derived d;

    // virtual function call through reference
    Base& br = b; // the type of br is Base&
    Base& dr = d; // the type of dr is Base& as well
    br.print(); // prints "base"
    dr.print(); // prints "derived"

    std::cout << std::endl;

    // virtual function call through pointer
    Base* bp = &b; // the type of bp is Base*
    Base* dp = &d; // the type of dp is Base* as well
    bp->print(); // prints "base"
    dp->print(); // prints "derived"

    std::cout << std::endl;

    // non-virtual function call
    br.Base::print(); // prints "base"
    dr.Base::print(); // prints "base"

    std::cout << std::endl;

    Base baseDerived = d; //d is a derived type
    baseDerived.print(); //prints what? base? or derived?
}
```

Four cases, one object each time. `Base& dr = d;` has static type `Base&` and dynamic type Derived, so `dr.print(); // prints "derived"`: the reference is enough, no pointer needed. `dr.Base::print(); // prints "base"` names the base function explicitly, which switches dynamic binding off for that call; this is how an override calls the version it replaced. `Base baseDerived = d;` is the slicing case again: a new Base object holding a copy of d's Base part, so the last line prints `base`. The `override` keyword on `Derived::print` is not required, but it makes the compiler check that a virtual function with that exact signature exists in the base; misspell the name and you get an error instead of a silent new function.

```widget
dispatch-viz
```

:::quiz Non-virtual members through a base handle
"Remember: non-virtual members of the derived class cannot be accessed through a reference of the base class." If Derived adds `void extra()`, `dr.extra()` does not compile even though dr refers to a Derived: the compiler only knows dr as a Base. Same for `shape1->area()` in the first program.
:::

```quiz
[
  {
    "q": "Why does `Shape * shape1 = &rect;` compile when rect is a Rectangle?",
    "options": ["Because pointers ignore types", "A pointer to a derived class is type-compatible with a pointer to its base class: a Rectangle is a Shape", "Because Shape is a struct", "It does not compile"],
    "answer": 1,
    "explain": "The slide's one-line explanation of polymorphism. The reverse, Rectangle* r = &shape, is not allowed."
  },
  {
    "q": "In the first program Shape has no `area()`. What happens to `shape1->area()`?",
    "options": ["It calls Rectangle::area because shape1 points at a rectangle", "A compile error: Shape has no member named area", "It returns 0", "It calls Triangle::area"],
    "answer": 1,
    "explain": "Through a Shape pointer you can only call what Shape declares. Non-virtual members of the derived class cannot be accessed through a base pointer or reference. That is what virtual members solve."
  },
  {
    "q": "What does this print?",
    "code": "class Polygon { protected: int w=4, h=5; public: virtual int area() { return 0; } };\nclass Rectangle : public Polygon { public: int area() { return w * h; } };\nint main() {\n    Rectangle rect;\n    Polygon* poly = &rect;\n    cout << poly->area();\n}",
    "options": ["0", "20", "a compile error", "garbage"],
    "answer": 1,
    "explain": "area is virtual, so the call through the base pointer is resolved at run time from the object's real type (Rectangle): 20. Without virtual it would print 0."
  },
  {
    "q": "Same classes, but `Polygon poly2 = rect; cout << poly2.area();`. What prints?",
    "options": ["20", "0", "a compile error", "10"],
    "answer": 1,
    "explain": "Copying a Rectangle into a Polygon object slices off the Rectangle part; poly2 IS a Polygon, so Polygon::area runs. Polymorphism only works with pointers or references."
  },
  {
    "q": "A class that declares or inherits a virtual function is called...",
    "type": "text",
    "answer": ["polymorphic", "a polymorphic class", "polymorphic class"],
    "explain": "The slide's term: a polymorphic class. Its objects can be used through base pointers and references with dynamic binding."
  },
  {
    "q": "Which name from the slides does NOT describe what `virtual` enables?",
    "options": ["dynamic binding", "late binding", "polymorphic method dispatch", "static binding"],
    "answer": 3,
    "explain": "Virtual functions are bound late, at run time. Static (compile-time) binding is what a non-virtual call gets."
  },
  {
    "q": "`Base& dr = d;` where d is a Derived and print is virtual. What do `dr.print()` and `dr.Base::print()` print?",
    "options": ["derived, derived", "base, base", "derived, base", "base, derived"],
    "answer": 2,
    "explain": "The plain call dispatches on the object's dynamic type: derived. The qualified call names Base::print explicitly (qualified name lookup), switching dynamic binding off: base."
  },
  {
    "q": "`Base baseDerived = d;` then `baseDerived.print();` with a virtual print. Prints?",
    "options": ["derived", "base", "nothing", "a compile error"],
    "answer": 1,
    "explain": "baseDerived is a Base object (not a reference or pointer), built from d's Base part. Virtual or not, a Base object prints base. This is the last line of virtual2.cpp."
  },
  {
    "q": "What does the `override` keyword on `void print() override` do?",
    "options": ["Makes the function virtual for the first time", "Asks the compiler to verify that a base class has a virtual function with this exact signature, so a typo becomes an error instead of a silent new function", "Prevents further overriding", "Calls the base version automatically"],
    "answer": 1,
    "explain": "override is a check, not a mechanism: the function overrides because Base::print is virtual. The keyword catches a misspelled name or a wrong parameter list."
  },
  {
    "q": "Polymorphism in C++ works through objects copied by value as well as through pointers and references.",
    "type": "tf",
    "answer": false,
    "explain": "Only pointers and references keep the dynamic type. A copy into a base object slices: the shipped comment says polymorphism fails without pointers or references."
  }
]
```
