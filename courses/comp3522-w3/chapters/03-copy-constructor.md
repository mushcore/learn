---
title: The copy constructor: shallow versus deep
minutes: 20
---

`Complex copy = c;` builds a new object from an existing one. The constructor that does it is the **copy constructor**, a concept with no equivalent in Java or C, and the compiler writes one for you whether you want it or not. That free version is right until a class owns a pointer.

## The canonical signature

```cpp run pin copyCtor.cpp
// predict: Which lines print "copy"? Write the full output.
#include <iostream>
using namespace std;

class Complex
{
    double r, i;
public:
    Complex(double r = 0, double i = 0) : r(r), i(i) { }
    Complex(const Complex& c) : r(c.r), i(c.i) { cout << "copy" << endl; }
    void print() const { cout << r << " + " << i << "i" << endl; }
};

int main()
{
    Complex c(1, 2);
    Complex copyC(c);           // COPY c to copyC
    Complex anotherCopyC = c;   // COPY c to anotherCopyC
    anotherCopyC = c;           // NO COPY CONSTRUCTOR CALL: assignment operator
    copyC.print();
    anotherCopyC.print();
    return 0;
}
```

`Complex(const Complex& c) : r(c.r), i(c.i)` is the shape to memorize. Stick with `const` and `&`: **const** lets you copy mutable and immutable objects alike; **&** prevents an infinite loop, because a parameter taken by value would itself need to be copied, which would call the copy constructor, which would copy its parameter... The list `r(c.r), i(c.i)` reads the members of the source object directly, private or not, because the source is the same class.

Two of the three lines in main call it. `Complex copyC(c);` and `Complex anotherCopyC = c;` both create a **new** object from `c`. `anotherCopyC = c;` does not: both objects already exist, so it calls the **copy assignment operator** (Week 4). The picker shows all three forms:

```widget
ctor-picker
{ "class": "complex", "decl": "Complex d = c;" }
```

## What the compiler writes for you

If you declare no copy constructor, the compiler generates one that calls the copy constructors of all members, in declaration order. The slide's advice is to use it whenever copying every member is what you want: less verbose, less error-prone, other developers know what it does without reading it, and the compiler may optimize it.

The problem is what "copy every member" means when a member is a **pointer**: the pointer is copied, not the thing it points at. That is a **shallow copy**.

```cpp run pin myVec.cpp
// predict: Are the three addresses printed for vCopy the same as the three for v, or different?
#include <iostream>
using namespace std;

class MyVec {
public:
    unsigned size;
    double *data;   // will point to an array of doubles
    // no copy constructor written: the compiler's shallow copy is used
};

int main()
{
    double vArray[] = {3, 6, 7};
    MyVec v;
    v.size = 3;
    v.data = vArray;
    MyVec vCopy = v;
    vCopy.data[0] = 99;   // write through the copy

    for (int i = 0; i < 3; ++i)
        cout << "v: " << v.data[i] << " at " << &v.data[i] << endl;
    for (int i = 0; i < 3; ++i)
        cout << "vCopy: " << vCopy.data[i] << " at " << &vCopy.data[i] << endl;
    return 0;
}
```

```cpp diff myVec.cpp with a deep copy constructor
#include <iostream>
using namespace std;

class MyVec {
public:
    unsigned size;
    double *data;   // will point to an array of doubles
    MyVec() : size(0), data(nullptr) {}
    MyVec(const MyVec &v) : size(v.size), data(new double[size]) {
        for (unsigned i = 0; i < size; ++i) {
            data[i] = v.data[i];
        }
    }
};

int main()
{
    double vArray[] = {3, 6, 7};
    MyVec v;
    v.size = 3;
    v.data = vArray;
    MyVec vCopy = v;
    vCopy.data[0] = 99;   // write through the copy

    for (int i = 0; i < 3; ++i)
        cout << "v: " << v.data[i] << " at " << &v.data[i] << endl;
    for (int i = 0; i < 3; ++i)
        cout << "vCopy: " << vCopy.data[i] << " at " << &vCopy.data[i] << endl;
    delete[] vCopy.data;  // only the copy owns heap memory here
    return 0;
}
```

:::before Before: the shipped myVec project
`MyVec vCopy = v;` copies `size` and copies the pointer `data`. Both objects now point at the same three doubles, so the addresses printed for `v` and `vCopy` are **identical**, and `vCopy.data[0] = 99;` changed `v.data[0]` too: `v: 99` on the first line. One array, two owners.
:::

:::after After: the slide's deep copy constructor
`MyVec(const MyVec &v) : size(v.size), data(new double[size])` allocates a fresh array and the loop copies the values across. Now the addresses differ, `v: 3` survives, and only `vCopy` reads 99. Two arrays, one owner each. The default constructor was added so `MyVec v;` still compiles once a constructor exists.
:::

The widget steps the same story and adds the part the program cannot show safely, the end of scope:

```widget
copy-viz
```

With a destructor that does `delete[] data` (next lesson), the shallow copy is not just a surprise but a crash: two destructors free the same array. The rule this sets up: a class that owns a pointer needs its own copy constructor, its own destructor, and, in Week 4, its own assignment operator.

```quiz
[
  {
    "q": "Which is the canonical copy constructor signature for a class `Complex`?",
    "options": ["`Complex(Complex c)`", "`Complex(const Complex& c)`", "`Complex(Complex* c)`", "`Complex(const Complex c)`"],
    "answer": 1,
    "explain": "const so that mutable and immutable objects can be copied, and & so that the parameter is not itself a copy (which would call the copy constructor again, forever)."
  },
  {
    "q": "Why must the copy constructor take its parameter by reference?",
    "options": ["References are faster to type", "Taking it by value would require copying the argument, which calls the copy constructor, which needs a copy of its argument: an infinite loop", "So that it can modify the original", "Because const parameters cannot be passed by value"],
    "answer": 1,
    "explain": "The slide's phrase: & prevents infinite internal copy loops."
  },
  {
    "q": "Which lines call the copy constructor? (select all)",
    "code": "Complex c;\nComplex copyC(c);\nComplex anotherCopyC = c;\nanotherCopyC = c;",
    "options": ["`Complex copyC(c);`", "`Complex anotherCopyC = c;`", "`anotherCopyC = c;`", "`Complex c;`"],
    "answer": [0, 1],
    "explain": "A copy constructor runs when a NEW object is created from an existing one, in either spelling. anotherCopyC = c assigns to an object that already exists: the copy assignment operator. Complex c uses the default constructor."
  },
  {
    "q": "The compiler-generated copy constructor...",
    "options": ["copies only the first member", "calls the copy constructors of all members, in the order of definition", "does a deep copy of every pointer member", "does not exist unless you write it"],
    "answer": 1,
    "explain": "Member-wise copying in declaration order. For a pointer member that copies the address, not the pointed-to data: a shallow copy."
  },
  {
    "q": "In the shipped myVec program, `MyVec vCopy = v;` is executed with the compiler's copy constructor. What is true afterwards?",
    "options": ["vCopy has its own array holding 3, 6, 7", "v.data and vCopy.data hold the same address, so both objects share one array", "vCopy.data is nullptr", "It does not compile"],
    "answer": 1,
    "explain": "The program prints identical addresses for v and vCopy: the pointer was copied, the array was not. Writing vCopy.data[0] = 99 changes v.data[0]."
  },
  {
    "q": "What does the slide's deep copy constructor do differently?",
    "code": "MyVector(const MyVector& v) : size(v.size), data(new double[size])\n{\n    for (unsigned i = 0; i < size; ++i)\n        data[i] = v.data[i];\n}",
    "options": ["It copies the pointer twice", "It allocates a new array with new and copies each element into it, so the two objects own separate arrays", "It shares the array but remembers who owns it", "It only copies size"],
    "answer": 1,
    "explain": "new double[size] in the initializer list gives the copy its own storage; the loop fills it. The initializer size(v.size) must come first because data's initializer uses size, and the class declares size before data."
  },
  {
    "q": "When should you rely on the compiler-generated copy constructor?",
    "options": ["Never", "When copying every member as-is is the right behaviour (no owned pointers): it is less verbose, less error-prone and easier for others to trust", "Only for structs", "Only when the class has no members"],
    "answer": 1,
    "explain": "The slide lists the benefits of the default: less verbose, less error-prone, other developers know what it does, compiler optimizations. The exception is the shallow-copy problem."
  },
  {
    "type": "spotbug",
    "q": "This deep copy constructor compiles but allocates an array of garbage length. Click the line whose initializer reads a member that has not been initialized yet.",
    "code": "class MyVector {\n    double *data;\n    unsigned size;\npublic:\n    MyVector(const MyVector& v) : size(v.size), data(new double[size])\n    {\n        for (unsigned i = 0; i < size; ++i)\n            data[i] = v.data[i];\n    }\n};",
    "answer": 5,
    "explain": "Line 5: the class declares data BEFORE size, so data's initializer runs first, whatever order the list is written in, and new double[size] reads size before size(v.size) has happened. Fix: declare size before data (as the slide does), or write new double[v.size]."
  }
]
```
