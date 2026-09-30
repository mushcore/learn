---
title: Destructors and object lifetime
minutes: 18
---

A constructor acquires; a destructor gives back. The slides call it the complementary operation of the default constructor and spell it with the complement sign, `~`. It runs by itself at the end of an object's life, which is what lets a class that calls `new` in its constructor clean up without the user of the class remembering to.

## When a destructor runs

The destructor is a member function that is automatically called before the object is destroyed. Its purpose is to free the resources the object acquired during its lifetime, typically to `delete` the dynamic memory of member pointers. It is invoked when the lifetime ends:

- at program termination, for static objects;
- at the **end of the scope** that declared the object;
- on an explicit `delete` or `delete[]` of a heap object.

```cpp run pin destroyed.cpp
// predict: Write every line printed, in order.
#include <iostream>
using namespace std;

class Complex
{
    double r, i;
public:
    Complex(double r = 0, double i = 0) : r(r), i(i) { cout << "Constructed " << r << endl; }
    ~Complex() { cout << "Destroyed! " << r << endl; }
};

int main()
{
    Complex a(1);
    {
        Complex b(2);
        cout << "end of the block" << endl;
    }
    Complex* p = new Complex(3);
    cout << "before delete" << endl;
    delete p;
    cout << "end of main" << endl;
    return 0;
}
```

`~Complex() { cout << "Destroyed! " << r << endl; }` takes no parameters and has no return type; a class has exactly one. `Complex b(2);` lives only inside the braces, so its message appears right after `end of the block`. `delete p;` runs the destructor of the heap object immediately; a heap object with no `delete` would never be destroyed at all. `a` is destroyed last, after `end of main`, when main's scope ends. Objects in one scope are destroyed in the **reverse** order of their construction.

```widget
lifetime-trace
{ "preset": "Block scope" }
```

## MyVector gets a destructor

```cpp run pin myVectorFull.cpp
// predict: Write the lines printed. How many times does the destructor run, and is any array freed twice?
#include <iostream>
using namespace std;

class MyVector
{
    unsigned vector_size;
    double * data;   // will point at dynamic memory
public:
    MyVector(unsigned n) : vector_size(n), data(new double[n])
    {
        for (unsigned i = 0; i < n; ++i) data[i] = i * 1.5;
    }
    MyVector(const MyVector& v) : vector_size(v.vector_size), data(new double[v.vector_size])
    {
        for (unsigned i = 0; i < vector_size; ++i) data[i] = v.data[i];
    }
    ~MyVector() { cout << "freeing " << vector_size << " doubles" << endl; delete[] data; }
    double at(unsigned i) const { return data[i]; }
};

int main()
{
    MyVector v(3);
    MyVector w = v;
    cout << v.at(2) << " " << w.at(2) << endl;
    return 0;
}
```

`~MyVector() { cout << "freeing " << vector_size << " doubles" << endl; delete[] data; }` releases exactly what the constructor allocated with `new double[n]`, with the matching `delete[]`. Because the copy constructor `MyVector(const MyVector& v)` gave `w` its own array, the two destructors free two different arrays: `freeing 3 doubles` prints twice and nothing is double-freed. Delete the copy constructor and the compiler's shallow copy returns, the second `delete[]` hits an already-freed address, and the program is undefined. Constructor, copy constructor and destructor travel together.

```widget
copy-viz
{ "title": "Why the destructor makes the shallow copy fatal: step to the last frame" }
```

## Two rules to remember now, explained later

1. **Never throw an exception from a destructor.** Exceptions are a later week; the reason will make sense then.
2. **If a class contains a virtual function, the destructor should be virtual too.** Virtual is lesson 7; the reason appears in Week 4, where an object is deleted through a pointer to its base class.

## Pass by value creates and destroys

A function parameter taken by value is a new object: copy constructed on the call and destroyed on return. A reference parameter is neither.

```widget
lifetime-trace
{ "preset": "Pass by value vs by reference", "presets": false }
```

This is the efficiency argument for references from Week 2 restated in terms of constructors: passing a large object by value costs a copy constructor and a destructor per call.

```quiz
[
  {
    "q": "How is the destructor of class `Complex` declared?",
    "options": ["`void ~Complex();`", "`~Complex();`", "`Complex~();`", "`delete Complex();`"],
    "answer": 1,
    "explain": "Tilde, class name, empty parameter list, no return type: the complement of the default constructor."
  },
  {
    "q": "Which of these end an object's lifetime and therefore run its destructor? (select all)",
    "options": ["The end of the scope in which a local object was declared", "`delete p;` for a heap object", "Program termination, for static objects", "Calling a member function"],
    "answer": [0, 1, 2],
    "explain": "The three from the slide: program termination (statics), end of scope, explicit delete / delete[]. Member functions do not end a lifetime."
  },
  {
    "q": "What does this print?",
    "code": "class T { public: ~T() { cout << \"D\"; } };\nint main() {\n    T a;\n    { T b; cout << \"x\"; }\n    cout << \"y\";\n}",
    "options": ["xyDD", "xDyD", "DDxy", "xy"],
    "answer": 1,
    "explain": "b is destroyed when its block closes (D after x), then y prints, then a is destroyed at the end of main."
  },
  {
    "q": "Two local objects are constructed in the order a, then b. In what order are they destroyed at the end of the scope?",
    "options": ["a then b", "b then a", "Both at once", "Whichever is larger first"],
    "answer": 1,
    "explain": "Destruction is the reverse of construction: the last object built is the first destroyed."
  },
  {
    "q": "The slides give two destructor rules to remember. Which are they? (select all)",
    "options": ["Never throw exceptions from a destructor", "If a class contains a virtual function, the destructor should be virtual too", "A destructor must delete every pointer in the program", "A destructor must be public and take one int"],
    "answer": [0, 1],
    "explain": "Both are flagged as 'remind me to tell you why' in the slides: exceptions and inheritance come later. A destructor frees only what its own object acquired."
  },
  {
    "q": "`MyVector` allocates `data = new double[n]` in its constructor. What must its destructor contain?",
    "options": ["`delete data;`", "`delete[] data;`", "`free(data);`", "Nothing: C++ frees it automatically"],
    "answer": 1,
    "explain": "new[] pairs with delete[]. Plain delete on an array is undefined behaviour, free is C, and nothing at all is a memory leak (Week 2)."
  },
  {
    "q": "A class has a destructor with `delete[] data` and relies on the compiler-generated copy constructor. `MyVector w = v;` runs, then both go out of scope. What happens?",
    "options": ["Both arrays are freed correctly", "The same array is freed twice: undefined behaviour, typically a crash", "Nothing is freed", "A compile error"],
    "answer": 1,
    "explain": "The shallow copy shares one array between v and w; each destructor calls delete[] on the same address. A class that owns a pointer needs its own copy constructor."
  },
  {
    "q": "`void f(Big x)` is called as `f(b)`. Which special member functions run because of the call?",
    "options": ["None", "The copy constructor when the call is made and the destructor when f returns", "Only the destructor", "The default constructor"],
    "answer": 1,
    "explain": "By-value parameters are new objects: copy constructed from the argument and destroyed when the function ends. void f(Big& x) creates nothing."
  }
]
```
