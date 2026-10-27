---
title: Part A: the sixteen theory questions
minutes: 35
---

Part A of the practice midterm is sixteen short written questions worth 66 marks. Each section gives the question as printed and the lesson that teaches it. Under each question is a one-line check: write your full answer on paper, type the key term, and the model answer, written at the length the marks justify, appears with the result.

## Q1 (4). What is a copy constructor? When is it used? Be specific. Code snippets may be used as (an) example(s).

```quiz
[
  {
    "q": "Q1 model answer. Write yours on paper first, then type the parameter type of `Fraction`'s copy constructor.",
    "type": "text",
    "answer": [
      "const Fraction&",
      "const Fraction &",
      "const Fraction& other",
      "const Fraction &other"
    ],
    "explain": "A copy constructor is the constructor that builds a **new object as a copy of an existing object** of the same class: `Fraction(const Fraction& other)`. The parameter is a `const` reference: `&` so the argument is not itself copied (that would call the copy constructor again, forever), `const` so const objects can be copied too. It is used whenever a new object is initialized from another: `Fraction b(a);`, `Fraction b = a;`, passing a Fraction to a function **by value**, and returning a Fraction by value. It is not used by `b = a;` when `b` already exists; that is the copy assignment operator. The compiler generates a member-wise (shallow) copy; a class that owns a pointer writes its own deep copy."
  }
]
```

```widget
ctor-picker
{ "class": "circle", "decl": "Circle d = c;" }
```

Taught in [Week 3: the copy constructor](#/comp3522-w3/copy-constructor).

## Q2 (3). What is a reference? How is it different from a pointer?

```quiz
[
  {
    "q": "Q2 model answer. Write yours on paper first, then type the one word the slides use for a reference.",
    "type": "text",
    "answer": [
      "alias",
      "an alias"
    ],
    "explain": "A reference is an **alias**, another name for an existing variable: `int n = 5; int& ref = n;` makes `ref` and `n` the same box. A reference must be initialized when it is declared, can never be re-seated to another variable, and is used exactly like the variable itself. A pointer is a separate variable that holds an address: `int* p = &n;`. It may be null, may be re-pointed (`p = &m;`), and needs `*p` to reach the variable it points to."
  }
]
```

Taught in [Week 2: pointers](#/comp3522-w2/pointers) and [references](#/comp3522-w2/references).

## Q3 (4). In C++, we may pass arguments to functions by value, by pointer, or by reference. What is the difference? Why would we choose one over the other?

```quiz
[
  {
    "q": "Q3 model answer. Write yours on paper first, then type the passing style that changes the caller's variable with no copy and no `*`.",
    "type": "text",
    "answer": [
      "by reference",
      "reference",
      "pass by reference"
    ],
    "explain": "By value (`void f(int x)`) copies the argument, so the function works on its own copy and cannot change the caller's variable; choose it for small types the function should not change. By pointer (`void f(int* x)`) passes an address, so `*x` reaches and can change the caller's variable; choose it when \"no object\" must be expressible with `nullptr`, for arrays, or for C-style code. By reference (`void f(int& x)`) passes the variable itself under a new name, with no copy and no `*`; choose it to let the function modify the caller's variable or to avoid copying a large object, and write `const Big& x` for no-copy plus a guarantee of no modification."
  }
]
```

Taught in [Week 4: midterm practice questions](#/comp3522-w4/midterm-practice), question 3, with the runnable `passing.cpp`.

## Q4 (4). Suppose we have a pointer to a string called success. What is the difference between &success and *success? When would we use each of these?

```cpp run pin success.cpp
// predict: Write the four lines printed (the comparison line prints the word "same" or "different", not an address).
#include <iostream>
#include <string>
using namespace std;

void reset(string** pp, string& target)   // needs the pointer's address to re-point it
{
    *pp = &target;
}

int main()
{
    string s = "ok";
    string other = "done";
    string* success = &s;               // a pointer to a string called success

    cout << *success << endl;           // *success: the string it points to
    cout << success->length() << endl;  // same object, member access through the pointer

    string** pp = &success;
    cout << (*pp == &s ? "same" : "different") << endl;

    reset(&success, other);             // pass &success so reset can change where it points
    cout << *success << endl;
    return 0;
}
```

```quiz
[
  {
    "q": "Q4 model answer. Write yours on paper first. Then a new case: with `int n = 7; int* count = &n;`, type the type of `&count`.",
    "type": "text",
    "answer": [
      "int**",
      "int **",
      "int * *"
    ],
    "explain": "With `string* success = &s;`, `*success` is the dereference: the `string` object the pointer points to, so `cout << *success` prints the text and `*success = \"done\"` changes the string (`success->length()` is the same access for a member). `&success` is the address-of operator applied to the pointer variable itself, so its type is `string**`, a pointer to a pointer; in the same way `&count` on an `int*` is an `int**`. Use `*success` whenever you want to read or change the string; use `&success` when a function must change **where the pointer points**, as in `reset(&success, other);` with `void reset(string** pp, ...)` doing `*pp = &target;`.\n\nThe program prints `ok`, `2`, `same`, `done`: the first two lines go through the pointer to the string, `string** pp = &success;` holds the pointer's own address, and after `reset` the same name `success` prints the other string."
  }
]
```

`string** pp = &success;` takes the address of the pointer itself, and `reset(&success, other);` hands that address to a function.

Taught in [Week 2: pointers](#/comp3522-w2/pointers).

## Q5 (4). What is the difference between static allocation and dynamic allocation? You may provide code snippets to help illustrate the difference.

```quiz
[
  {
    "q": "Q5 model answer. Write yours on paper first, then type the keyword that allocates dynamically.",
    "type": "text",
    "answer": [
      "new"
    ],
    "explain": "Static (automatic) allocation happens at the declaration: `int x = 5; Fraction f(1, 2); int arr[10];` live on the stack, their size is fixed at compile time, and they are destroyed automatically when their scope ends. Dynamic allocation happens at run time with `new`: `int* p = new int(5); Fraction* f = new Fraction(1, 2); int* arr = new int[n];` live on the heap, are reached through a pointer, can have a size chosen at run time, and survive the end of the function until the programmer frees them with `delete p; delete f; delete[] arr;`. Dynamic means manual: C++ has no garbage collector."
  }
]
```

Taught in [Week 4: midterm practice questions](#/comp3522-w4/midterm-practice), question 4, and [Week 2: new and delete](#/comp3522-w2/new-delete).

## Q6 (4). What is a memory leak? How do we prevent memory leaks in C++? Write a short function to demonstrate code that generates a memory leak, and then 'insert' and underline some code that 'plugs' the leak.

```quiz
[
  {
    "q": "Q6 model answer. Write yours on paper first, then type the statement that plugs the leak of `int* p = new int[100];`.",
    "type": "text",
    "answer": [
      "delete[] p;",
      "delete[] p",
      "delete [] p;",
      "delete [] p"
    ],
    "explain": "A memory leak is heap memory obtained with `new` that is never released with `delete`, so no pointer to it remains and it stays allocated until the program exits. Prevent it by pairing every `new` with exactly one `delete` (`new[]` with `delete[]`), deleting before re-pointing an owning pointer, freeing owned memory in the class's destructor, and setting deleted pointers to `nullptr`. The function below leaks the 100 ints once `p` goes out of scope; the inserted `delete[] p;` (underline it on paper) plugs the leak."
  }
]
```

```cpp
void leak()
{
    int* p = new int[100];
    p[0] = 1;              // use the array
    delete[] p;            // <-- inserted and underlined: plugs the leak
}
```

Taught in [Week 2: new and delete](#/comp3522-w2/new-delete) and worked with the two-block version in [Week 4: midterm practice questions](#/comp3522-w4/midterm-practice), question 5.

## Q7 (6). With respect to the const keyword: a. What is the purpose of making an argument to a function const? b. What is the purpose of adding the const keyword to a function header?

### a. A const argument and b. a const member function

```cpp run pin const.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

class Fraction {
private:
    int numerator;
    int denominator;
public:
    Fraction(int n, int d) : numerator(n), denominator(d) {}
    int get_numerator() const { return numerator; }      // const member function: cannot change members
    void set_numerator(int n) { numerator = n; }          // not const: may change members
};

void print(const Fraction& f)             // const reference parameter: no copy, no modification
{
    cout << f.get_numerator() << endl;    // allowed: get_numerator is const
}

int main()
{
    Fraction half(1, 2);
    const Fraction third(1, 3);
    print(half);
    print(third);                         // a const object can be passed
    half.set_numerator(3);
    cout << half.get_numerator() << endl;
    return 0;
}
```

`void print(const Fraction& f)` receives both `half` and the const object `third`.

```quiz
[
  {
    "q": "Q7 model answer. Write yours on paper first. Can `print(const Fraction& f)` call the non-const `f.set_numerator(9)`? Type yes or no.",
    "type": "text",
    "answer": [
      "no"
    ],
    "explain": "a. A `const` parameter such as `void print(const Fraction& f)` promises that the function will not modify the argument, and the compiler rejects any statement that tries (`f.set_numerator(9)` does not compile). Combined with a reference it gives the efficiency of no copy with the safety of pass by value, and it lets callers pass const objects and temporaries.\n\nb. `const` after the parameter list, `int get_numerator() const`, makes a **const member function**: it promises not to change any data member (inside it, `this` is a pointer to const), the compiler enforces the promise, and only const member functions can be called on a const object or through a const reference. Every getter should be const; `set_numerator` cannot be.\n\nThe program prints `1`, `1`, `3`: both `print(half);` and `print(third);` read through the const reference, and `half.set_numerator(3);` is legal because `half` itself is not const."
  }
]
```

### What the compiler says when the const is forgotten

```cpp pin const_forgotten.cpp
#include <iostream>
using namespace std;

class Fraction {
private:
    int numerator;
    int denominator;
public:
    Fraction(int n, int d) : numerator(n), denominator(d) {}
    int get_numerator() { return numerator; }             // const forgotten
};

void print(const Fraction& f)
{
    cout << f.get_numerator() << endl;    // error: f is const, get_numerator is not
}

int main()
{
    Fraction half(1, 2);
    print(half);
    return 0;
}
```

With `int get_numerator() { return numerator; }` declared without `const`, the call `cout << f.get_numerator() << endl;` inside `void print(const Fraction& f)` fails with g++'s message `error: passing 'const Fraction' as 'this' argument discards qualifiers`. The getter would receive a non-const `this` for a const object, and the compiler refuses. That one message is the whole reason getters are const.

Taught in [Week 3: constructors](#/comp3522-w3/constructors) (const member functions) and [Week 2: references](#/comp3522-w2/references) (const references).

## Q8 (3). We rarely invoke an object's destructor directly. When is an object's destructor invoked for us (automatically)?

```cpp run pin destructor_timing.cpp
// predict: Write every line printed, in order. Which destructor runs during the throw?
#include <iostream>
#include <stdexcept>
#include <string>
using namespace std;

class Noisy {
    string name;
public:
    Noisy(const string& n) : name(n) { cout << "construct " << name << endl; }
    ~Noisy() { cout << "destroy " << name << endl; }
};

void risky()
{
    Noisy local("local");
    throw runtime_error("boom");
}

int main()
{
    Noisy outer("outer");
    {
        Noisy block("block");
    }                                     // end of block: block destroyed
    Noisy* heap = new Noisy("heap");
    delete heap;
    try {
        risky();
    } catch (const runtime_error& e) {
        cout << "caught " << e.what() << endl;
    }
    cout << "end of main" << endl;
    return 0;
}                                         // end of main: outer destroyed
```

Four objects to track: `Noisy outer("outer");`, `Noisy block("block");`, `Noisy* heap = new Noisy("heap");` and `Noisy local("local");`.

```quiz
[
  {
    "q": "Q8 model answer. Write yours on paper first, then type the line the program prints right after `destroy local`.",
    "type": "text",
    "answer": [
      "caught boom"
    ],
    "explain": "The destructor runs automatically when the object goes out of scope: at the end of the block or function it was declared in, including when an exception unwinds the stack through that scope. For a dynamically allocated object it runs when `delete` (or `delete[]` for an array) is applied to the pointer. It also runs for a temporary at the end of the full expression that created it, for members and base subobjects after the enclosing object's destructor body, and for static and global objects when the program ends. Objects in one scope are destroyed in the reverse order of their construction.\n\nTen lines: `destroy block` prints at the closing brace of the inner block, `destroy heap` prints at `delete heap;`, and `destroy local` prints **before** `caught boom` because the stack unwinds from `risky()` before the handler runs. `destroy outer` is last, after `end of main`."
  }
]
```

Taught in [Week 3: the destructor](#/comp3522-w3/destructor).

## Q9 (4). There are three ways to initialize variables in C++. What are they, and which method do we prefer to use? Why?

```quiz
[
  {
    "q": "Q9 model answer. Write yours on paper first, then type the initialization we prefer: copy, direct or brace.",
    "type": "text",
    "answer": [
      "brace",
      "braces",
      "uniform",
      "list",
      "brace initialization",
      "uniform initialization",
      "{}"
    ],
    "explain": "Copy initialization `int x = 0;`, direct initialization with parentheses `int x(0);`, and uniform (brace, list) initialization `int x{0};` from C++11. We prefer braces: they refuse implicit narrowing conversions (`int y{3.7};` is a compile error while the other two silently store 3), they work for every kind of object (built-in types, arrays, classes, containers), and `Circle c{};` cannot be misread as a function declaration the way `Circle c();` can."
  }
]
```

Taught in [Week 1: initialization](#/comp3522/initialization).

## Q10 (2). When do we use the scope operator :: and when do we use the dot operator . in C++?

```quiz
[
  {
    "q": "Q10 model answer. Write yours on paper first, then type the operator that names a member of a class or namespace.",
    "type": "text",
    "answer": [
      "::"
    ],
    "explain": "`::` is the scope resolution operator: it names something inside a namespace or a class, not inside an object. `std::cout`, `Fraction::Fraction(int, int)` when defining a member outside the class, `Base::f()` to call a base version explicitly, and static members such as `Date::today()`. `.` accesses a member of a particular object instance: `f.numerator`, `obj.method()`; `->` does the same through a pointer."
  }
]
```

Taught in [Week 1: hello world](#/comp3522/hello-world) and [preprocessor and namespaces](#/comp3522/preprocessor-namespaces).

## Q11 (2). What is the difference between the class and the struct in C++?

```quiz
[
  {
    "q": "Q11 model answer. Write yours on paper first, then type the default member access of a `struct`.",
    "type": "text",
    "answer": [
      "public"
    ],
    "explain": "Only the default access: members of a `struct` are public by default and members of a `class` are private by default, and the same applies to the default kind of inheritance (`struct D : B` is public inheritance, `class D : B` is private). Everything else is identical: both can have constructors, member functions, access specifiers and inheritance."
  }
]
```

Taught in [Week 3: structs and classes](#/comp3522-w3/structs-classes).

## Q12 (3). What is forward declaration and what is its purpose?

```quiz
[
  {
    "q": "Q12 model answer. Write yours on paper first, then type the forward declaration of a class named Spy.",
    "type": "text",
    "answer": [
      "class Spy;",
      "class Spy"
    ],
    "explain": "A forward declaration introduces a name before its full definition, `class Spy;`, so the compiler knows that `Spy` is a class without yet knowing its members or size. It lets code refer to the type by pointer or reference before the definition (two classes that refer to each other, `friend class Spy;`), breaks circular `#include`s, and reduces header dependencies and compile time. You cannot create an object of an incomplete type or access its members until the full definition has been seen."
  }
]
```

Taught in [Week 3: forward declaration](#/comp3522-w3/forward-declaration).

## Q13 (3). How do we make a class abstract in C++?

```quiz
[
  {
    "q": "Q13 model answer. Write yours on paper first, then type what follows `virtual void f()` to make it pure.",
    "type": "text",
    "answer": [
      "= 0",
      "=0",
      "= 0;",
      "=0;"
    ],
    "explain": "Give it at least one **pure virtual function**: `virtual void f() = 0;`, where `= 0` is the pure specifier. C++ has no `abstract` keyword. An abstract class cannot be instantiated (`A a;` is an error, but `A* p` and `A&` are fine), and a derived class stays abstract until it overrides every pure virtual function it inherits."
  }
]
```

```widget
abstract-check
{ "f": "pure", "g": "virtual", "bf": true, "bg": false, "cf": false, "cg": false }
```

Taught in [Week 4: abstract classes](#/comp3522-w4/abstract-classes).

## Q14 (2). Does C++ have interfaces? Explain.

```quiz
[
  {
    "q": "Q14 model answer. Write yours on paper first. Does C++ have an `interface` keyword? Type yes or no.",
    "type": "text",
    "answer": [
      "no"
    ],
    "explain": "Not as a keyword. An interface in C++ is written as a pure abstract class: a class whose member functions are all pure virtual, with no data members and a virtual destructor. A class \"implements\" the interface by inheriting from it (several at once, since C++ has multiple inheritance) and overriding every pure virtual function."
  }
]
```

Taught in [Week 4: interfaces](#/comp3522-w4/interfaces).

## Q15 (6). In C++, multiple inheritance may result in a class diamond-shaped inheritance pattern. a. How does this happen? b. Does this cause any ambiguities with respect to member functions? How can the ambiguities be solved? c. What is the key responsibility of the most-derived class at the bottom of the diamond?

```quiz
[
  {
    "q": "Q15 model answer. Write yours on paper first, then type the class that must construct the virtual base `person`.",
    "type": "text",
    "answer": [
      "math_student",
      "math_student's"
    ],
    "explain": "a. Two classes (student and mathematician) each inherit from the same base (person), and a fourth class (math_student) inherits from both of them. Unless the middle classes inherit `virtual`ly, the bottom class contains the base twice, one copy through each side.\n\nb. Yes. A member function inherited through both sides (`all_info`, or `get_name`) is ambiguous: `bob.all_info()` fails to compile because the compiler cannot tell which copy to use. Solve it by qualifying the call (`bob.mathematician::all_info()`), by overriding the function in the most-derived class and calling the base versions from there, or by making the base a virtual base class (`class student : public virtual person`) so there is only one copy.\n\nc. With virtual base classes the most-derived class must construct the shared base itself in its initializer list: `math_student(...) : person(name), student(passed), mathematician(proved)`. The middle classes' calls to the virtual base's constructor are ignored, so if math_student forgets, person is default-constructed and the name is lost."
  }
]
```

```widget
diamond-viz
{ "virtualStudent": true, "virtualMath": true, "init": "most" }
```

Taught in [Week 4: multiple inheritance](#/comp3522-w4/multiple-inheritance) and [the diamond and virtual base classes](#/comp3522-w4/diamond-virtual-base).

## Q16 (3). When we implement the assignment operator, we use the "copy and swap" algorithm. How does the "copy and swap" algorithm work? Can you identify an easy way to introduce an error into a "copy and swap" function?

```quiz
[
  {
    "q": "Q16 model answer. Write yours on paper first, then type the name of the function that exchanges every data member between `*this` and the copy.",
    "type": "text",
    "answer": [
      "mySwap",
      "mySwap()",
      "swap"
    ],
    "explain": "1. The parameter is taken by value, so the copy constructor builds `other` as a local copy of the right-hand side. 2. `mySwap` exchanges every data member between `*this` and the copy, so the left-hand object now owns the new data and `other` holds the old data. 3. `other` is destroyed when the function returns, and its destructor frees the old resources. It needs a working copy constructor, destructor and a swap that does not throw.\n\nEasy errors: take the parameter by **reference** (`MyClass& other`), so no copy is made and the swap hands the caller's object your old data; call `std::swap` on the **whole object**, which is implemented with the copy constructor and `operator=` and so recurses forever; or forget one member in `mySwap`, so the objects end up with mixed state and the old copy of that member leaks."
  }
]
```

In code, the copy-and-swap assignment operator is one swap and a return:

```cpp
MyClass& MyClass::operator=(MyClass other)   // other BY VALUE
{
    mySwap(*this, other);
    return *this;
}
```

### B = A through copy-and-swap

The copy constructor builds `other` before the body runs; after the swap, `other` holds B's old array, and its destructor frees it on the way out.

```widget
copy-swap
{ "mode": "swap" }
```

Taught in [Week 4: the copy assignment operator and copy-and-swap](#/comp3522-w4/copy-assignment).

## Static members (Week 7)

The midterm covers "all the topics up to and including Week 7" (Midterm Info deck), so the mock paper's Q17 asks about static members, which the Week 7 sample code introduces. A **static data member** belongs to the class, not to any object: there is one copy shared by every instance. It is declared `static` inside the class and defined once, outside it, in the implementation file. A **static member function** is called through the class name, `A::staticFunction1()`, with no object, and can touch only static members directly.

The Week 6 `Date` class uses both kinds:

```cpp
class Date {
public:
    static bool is_leap_year(int year);
    static bool is_valid_date(int year, int month, int date);
    static Date today();
private:
    int year, month, day;
    static const int days_in_regular_year[];
    static const int days_in_leap_year[];
};

// Date.cpp: define static members
const int Date::days_in_regular_year[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
```

`static_functions/main.cpp` from the Week 7 sample code shows what a static function may and may not reach. The commented-out lines are the compile errors.

```cpp run pin static_functions.cpp
// predict: Write the lines printed, in order (one blank line between the two sections). Which function prints the non-static name?
#include <iostream>
#include <string>
using namespace std;

class A {
    string nonStaticName = "My name is class A";
    static int staticNum;

public:
    static void staticFunction1() {
        cout << "staticFunction1" << endl;

        //nonStaticFunction(); //ERROR: can't call non static without instance
        //cout << nonStaticName << endl; //ERROR: can't call non static data members in static function
        cout << "Printing static number: " << staticNum << endl; //CAN call static data members in static function
        staticFunction2(); //CAN call other static functions in static function
    }

    static void staticFunction2() {
        cout << "staticFunction2" << endl;
    }

    static void staticFunctionParam(A a) {
        cout << "staticFunctionParam" << endl;
        //nonStaticFunction(); //CAN'T call non-static function directly
        a.nonStaticFunction(); //CAN call non-static function through parameter a
    }

    void nonStaticFunction() {
        cout << "nonStaticFunction" << endl;
        cout << "Printing non static name: " << this->nonStaticName << endl; //CAN access non-static data member in non-static function
        //staticFunction2(); //CAN call static function in non-static function
    }
};

int A::staticNum = 5; //initialize static variable outside class

int main() {
    cout << "---Calling static function that calls another static function---" << endl;
    A::staticFunction1();
    cout << endl;

    cout << "---Calling static function that accepts a parameter to call a non static function---" << endl;
    A aInstance;
    A::staticFunctionParam(aInstance);

    return 0;
}
```

`A::staticFunction1();` and `A::staticFunctionParam(aInstance);` are called through the class name with no object, and `int A::staticNum = 5;` is the one definition of the static data member.

```quiz
[
  {
    "q": "Inside `static void staticFunction1()`, why does `cout << nonStaticName;` fail to compile? Type the pointer a static member function does not have.",
    "type": "text",
    "answer": ["this", "this pointer", "the this pointer", "*this"],
    "explain": "A static member function is called as `A::staticFunction1()` with no object, so there is no `this` and no object whose `nonStaticName` it could read. It can use static data (`staticNum` prints 5) and call other static functions. `staticFunctionParam(A a)` reaches the non-static members only through its parameter: `a.nonStaticFunction()` prints `nonStaticFunction` and then `Printing non static name: My name is class A`. `int A::staticNum = 5;` is the one definition, outside the class."
  },
  {
    "q": "True or false: `static int m = 5;` written inside the class definition is a valid way to initialize a static data member.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 6: a static data member *Can't be initialized inside the class definition*, so declare `static int m;` inside and define `int X::m = 5;` outside; since C++17, `inline static int m = 5;` is the one way to initialize a non-const static inside the class."
  },
  {
    "q": "True or false: `static void f() const` declares a valid static member function.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: static member functions *Cannot be virtual or const*; a `const` member function promises not to change the object `this` points to, and a static function has no `this`, so g++ rejects the declaration."
  }
]
```

### Initializing and reaching static members

- **Plain `static`:** *Can't be initialized inside the class definition*. `static int m = 5; //ERROR`, so declare `static int n;` inside and define `int X::n = 5;` outside (since C++17, `inline static int m = 5;` is allowed inside).
- **`const static` integral or enum:** *constant integral or enumeration types can be initialized inside the class definition*, as `const static int m = 9;`, or declared `const static int k;` and defined outside as `const int X::k = 3;`.
- **`constexpr static`:** *must be initialized with a literal inside the class definition*. `constexpr static int arr[] = { 1, 2, 3 };` is OK and `constexpr static int k;` is an ERROR (C++ accepts any constant expression, not only a literal).
- **Two access forms:** the *Qualified name* `X::n`, or a *Member access expression* on an object or pointer, `obj.n` or `ptr->n`. Slide 5 writes *Class->member or Class.member*, but on the class name neither `X.n` nor `X->n` compiles. Statics *Exist even if no objects have been defined*.
- **Static member functions:** *Cannot be virtual or const* and have no `this` pointer, so `virtual static void staticFunction()` and `static void staticFunction() const` are both errors. The slide's *Can only access static data* means directly: through an object, as `a.nonStaticFunction()` shows, a static function reaches non-static members.

Taught in [Week 7](#/comp3522-w7/static-data-members).

## Answer Part A questions from five new snippets

Each item is a short Part A question asked about code you have not seen: passing styles, destructor timing, initialization, const members and forward declarations.

```quiz
[
  {
    "q": "Q3 style (4). What does this print? Then, on paper, say which parameter could change the caller's variable without a `*`.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nvoid bump(int* p, int& r, int v) {\n    *p += 1;\n    r += 10;\n    v += 100;\n    p = nullptr;\n}\n\nint main() {\n    int a = 1, b = 2, c = 3;\n    int* ptr = &a;\n    bump(ptr, b, c);\n    cout << a << \" \" << b << \" \" << c << \" \" << (ptr == &a) << endl;\n    return 0;\n}",
    "answer": [
      "2 12 3 1"
    ],
    "explain": "By pointer: `*p += 1` reaches a through its address, so a becomes 2; `p = nullptr` only changes bump's own copy of the pointer, so main's ptr still points at a (prints 1). By reference: r is b under another name, so b becomes 12, with no `*`. By value: v is a copy of c, so c stays 3."
  },
  {
    "q": "Q8 style (3). What does this print?",
    "code": "#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Tag {\n    string n;\n    Tag(string n) : n(n) { cout << \"+\" << n << \" \"; }\n    ~Tag() { cout << \"-\" << n << \" \"; }\n};\n\nTag make(string n) { return Tag(n); }\n\nint main() {\n    Tag a(\"a\");\n    make(\"t\");\n    Tag* h = new Tag(\"h\");\n    {\n        Tag b(\"b\");\n    }\n    delete h;\n    cout << \"| \";\n    return 0;\n}",
    "options": [
      "`+a +t -t +h +b -b -h | -a`",
      "`+a +t +h +b -b -h | -t -a`",
      "`+a +t -t +h +b -b | -h -a`",
      "`+a +h +b -b -h | -a`"
    ],
    "answer": 0,
    "explain": "a is built. `make(\"t\")` returns a temporary nobody keeps, so it is destroyed at the end of that statement: `+t -t`. h is on the heap: `+h`, and it dies only at `delete h`. b dies at its block's closing brace: `+b -b`. Then `delete h`: `-h`. `| ` prints, and a dies at the end of main: `-a`. Scope end, delete, end of a temporary's full expression: three of the automatic cases."
  },
  {
    "q": "Q9 style (4). Click the initialization the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int guests = 7;\n    int slices(8.5);\n    int crusts = 2.9;\n    int toppings{3.5};\n    cout << guests << slices << crusts << toppings << endl;\n    return 0;\n}",
    "answer": [
      8
    ],
    "explain": "Brace initialization refuses narrowing: `int toppings{3.5};` is an error, narrowing conversion of '3.5' from 'double' to 'int'. Direct `int slices(8.5);` and copy `int crusts = 2.9;` compile and silently store 8 and 2 (g++ may warn). That refusal is why braces are preferred."
  },
  {
    "q": "Q7 style (6). Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Counter {\n    int hits = 0;\npublic:\n    int get() const { return hits; }\n    void reset() const { hits = 0; }\n    void add() { ++hits; }\n};\n\nint main() {\n    Counter c;\n    c.add();\n    cout << c.get() << endl;\n    return 0;\n}",
    "answer": [
      8
    ],
    "explain": "`const` after the parameter list promises the member function changes no data member; inside it `this` points to const. `reset() const` assigns to `hits`, so g++ refuses: assignment of member 'Counter::hits' in read-only object. `get() const` only reads, which is what a const member function is for; `add()` is not const and may change hits."
  },
  {
    "q": "Q12 style (3). Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Engine;\n\nclass Car {\n    Engine* spare;\n    Engine motor;\npublic:\n    Car() : spare(nullptr) {}\n};\n\nclass Engine { };\n\nint main() {\n    Car c;\n    return 0;\n}",
    "answer": [
      8
    ],
    "explain": "`class Engine;` is a forward declaration: the name exists, the size does not yet. A pointer to it is fine (`Engine* spare;`), but an object member needs the full definition: field 'motor' has incomplete type 'Engine'. Move Engine's definition above Car, or hold it by pointer."
  }
]
```
```quiz
[
  {
    "q": "Q1. Which of these call the copy constructor? (select all)",
    "options": ["`Fraction b(a);`", "`b = a;` where b already exists", "passing a Fraction to `void f(Fraction x)`", "`Fraction b = a;`"],
    "answer": [0, 2, 3],
    "explain": "A new object built from an existing one: either declaration spelling, a by-value parameter, or a by-value return. Assignment to an existing object is operator=."
  },
  {
    "q": "Q2. A reference is best described as...",
    "options": ["a variable that stores an address", "an alias: another name for an existing variable, fixed at declaration", "a pointer that cannot be null", "a copy of a variable"],
    "answer": 1,
    "explain": "Alias is the slide's word. Must be initialized when declared, never re-seated, used like the variable itself. A pointer stores an address and can be re-pointed."
  },
  {
    "q": "Q3. A function must modify the caller's `Fraction` and must also accept 'no Fraction'. Which parameter kind?",
    "options": ["`Fraction f`", "`const Fraction& f`", "`Fraction& f`", "`Fraction* f`"],
    "answer": 3,
    "explain": "Only a pointer can be nullptr. A reference modifies but cannot be absent; const& cannot modify; by value modifies a copy."
  },
  {
    "q": "Q4. With `string* success = &s;`, what is the type of `&success`?",
    "options": ["`string`", "`string*`", "`string**`", "`string&`"],
    "answer": 2,
    "explain": "The address of a `string*` variable is a pointer to a pointer. `*success` is the string itself; `success` is its address."
  },
  {
    "q": "Q5. `Fraction* f = new Fraction(1, 2);` inside a function. When is the Fraction destroyed?",
    "options": ["when the function returns", "only when `delete f;` runs", "at the next `new`", "at the end of main automatically"],
    "answer": 1,
    "explain": "Dynamic allocation is manual: the heap object outlives the function and is released only by delete. The pointer variable f itself dies at the function's end, which leaks the object if delete has not run."
  },
  {
    "type": "spotbug",
    "q": "Q6. Click the allocation that is never freed.",
    "code": "void work(int n)\n{\n    int sum = 0;\n    int* data = new int[n];\n    for (int i = 0; i < n; i++) sum += data[i] = i;\n    cout << sum << endl;\n}",
    "answer": 4,
    "explain": "Line 4 allocates with new[] and nothing releases it; when the function ends the pointer `data` is gone and the array leaks. Plug it by inserting `delete[] data;` after the last use (after line 6, before the closing brace) and underlining it."
  },
  {
    "q": "Q7. `int get_numerator() const;` The `const` after the parameter list means...",
    "options": ["the function cannot change any data member and can be called on a const object", "the return value cannot be modified", "the function can only be called once", "the parameters are const"],
    "answer": 0,
    "explain": "A const member function: this is a pointer to const inside it. Only const member functions can be called through a const object or const reference, which is why getters are const."
  },
  {
    "q": "Q8. Which of these invoke a destructor automatically? (select all)",
    "options": ["the object's scope ends", "`delete p;` on a pointer to the object", "an exception unwinds through the object's scope", "calling a const member function"],
    "answer": [0, 1, 2],
    "explain": "Scope end (normal or by unwinding), delete, end of a temporary's full expression, program end for statics. Reverse order of construction."
  },
  {
    "q": "Q9. Which initialization refuses to compile?",
    "code": "int a = 3.7;\nint b(3.7);\nint c{3.7};",
    "options": ["`int a = 3.7;`", "`int b(3.7);`", "`int c{3.7};`", "all three compile"],
    "answer": 2,
    "explain": "Brace initialization prohibits narrowing conversions, which is why it is preferred. The other two silently store 3."
  },
  {
    "q": "Q10. Which uses the scope operator correctly? (select all)",
    "options": ["`std::cout`", "`Fraction::Fraction(int n, int d) : ...` defining the constructor outside the class", "`obj::method()` on an object", "`Base::f()` to call the base version"],
    "answer": [0, 1, 3],
    "explain": ":: names a member of a namespace or class; an object instance uses . (or -> through a pointer)."
  },
  {
    "q": "Q11. The only difference between struct and class in C++ is the default access (public for struct, private for class).",
    "type": "tf",
    "answer": true,
    "explain": "Default member access and default inheritance kind. Both support constructors, methods, inheritance and access specifiers."
  },
  {
    "q": "Q12. After `class Spy;` and before Spy's definition, which is allowed?",
    "options": ["`Spy s;`", "`Spy* p;`", "`s.report();`", "`sizeof(Spy)`"],
    "answer": 1,
    "explain": "An incomplete type can be named by pointer or reference only. Objects, member access and sizeof need the full definition."
  },
  {
    "q": "Q13. The `= 0` in `virtual void f() = 0;` is called the...",
    "type": "text",
    "answer": ["pure specifier", "the pure specifier", "pure virtual specifier"],
    "explain": "The pure specifier makes f pure virtual and the class abstract. There is no abstract keyword."
  },
  {
    "q": "Q14. Does C++ have interfaces?",
    "options": ["Yes, with the `interface` keyword", "No, and nothing equivalent exists", "Not as a keyword: an interface is a pure abstract class with only pure virtual functions and a virtual destructor", "Yes, any class with virtual functions"],
    "answer": 2,
    "explain": "Written as a pure abstract class and implemented by inheriting and overriding every function; multiple interfaces via multiple inheritance."
  },
  {
    "q": "Q15. With `student` and `mathematician` inheriting `virtual public person`, whose initializer list constructs `person`?",
    "options": ["student's", "mathematician's", "whichever comes first in math_student's base list", "math_student's, the most-derived class"],
    "answer": 3,
    "explain": "The most-derived class constructs the virtual base; the middle classes' calls are ignored. Forget it and person is default-constructed: the lost name."
  },
  {
    "type": "spotbug",
    "q": "Q16. Click the line that breaks copy-and-swap.",
    "code": "MyClass& MyClass::operator=(MyClass& other)\n{\n    mySwap(*this, other);\n    return *this;\n}",
    "answer": 1,
    "explain": "The parameter is a reference, so no copy is made: the swap gives the caller's object your old data. Take it by value so the copy constructor builds the copy."
  },
  {
    "type": "spotbug",
    "q": "Q16 again. Click the line that makes this operator= recurse forever.",
    "code": "MyClass& MyClass::operator=(MyClass other)\n{\n    std::swap(*this, other);\n    return *this;\n}",
    "answer": 3,
    "explain": "std::swap on the whole object is implemented with the copy constructor and operator=, which calls std::swap again. Swap the members one by one."
  },
  {
    "type": "spotbug",
    "q": "Q16 once more. Click the line with the mistake.",
    "code": "MyClass MyClass::operator=(MyClass other)\n{\n    mySwap(*this, other);\n    return *this;\n}",
    "answer": 1,
    "explain": "Returning MyClass by value copies *this on every assignment instead of returning a reference; chained assignment then works on temporaries. The canonical form returns MyClass&."
  }
]
```
