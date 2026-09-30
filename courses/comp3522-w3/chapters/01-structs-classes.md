---
title: Structs, classes and the four OOP words
minutes: 15
---

Weeks 1 and 2 used types the language gave you. This week you define your own: a `struct` or a `class` bundles data and the functions that work on it into one type, and the slides review the four OOP concepts that make that bundle worth having.

## C++ has structs too

```cpp run pin product.cpp
// predict: Write the one line printed.
#include <iostream>
using namespace std;

struct product {
    int weight;
    double price;
} apple, banana;

int main()
{
    product melon;
    melon.weight = 3;
    melon.price = 4.5;
    apple.weight = 1;
    apple.price = 0.75;
    cout << melon.weight * melon.price + apple.price << endl;
    return 0;
}
```

`struct product {` opens a user-defined type with two members; the name after the closing brace, `} apple, banana;`, is the optional list of objects declared on the spot. `product melon;` declares another later, and `.` reaches a member. Every member of a `struct` is **public by default**, which is why `main` can write `melon.weight` directly.

## The class

A class is defined with `class` or `struct` and can contain four kinds of thing: data (member variables, data members), functions (member functions; rarely called methods), type definitions, and contained classes. The one difference between the two keywords: with `class`, members are **private by default**.

```cpp run pin encapsulation.cpp
// predict: Write the one line printed. Then guess what happens if main writes obj.x = 5 directly.
#include <iostream>
using namespace std;

class Encapsulation
{
    private:
        int x;
    public:
        void set(int a)
        {
            x = a;
        }
        int get()
        {
            return x;
        }
}; //end classes with semicolon

int main()
{
    Encapsulation obj;
    obj.set(5);
    cout << obj.get();
    return 0;
}
```

- **Encapsulation**: combining data members and functions into a single unit called a class; make the data `private:` and give `public:` getters and setters. `x = a;` inside `set` is allowed because `set` is a member; `obj.x = 5` in main is a compile error.
- **Abstraction**: only show relevant details and hide the rest. Access specifiers do it inside a class; header files do it across files (you call `pow(7, 3)` from `<cmath>` without knowing how it is implemented).
- **Inheritance**: a class derives properties from another (base class, derived class), lesson 6.
- **Polymorphism**: one call, different functions depending on the type of object, lesson 7.

The closing `}; //end classes with semicolon` is the mistake every C++ beginner makes once: a class definition ends with a semicolon because objects may be declared between the brace and the semicolon, exactly as `apple, banana` were.

## Accessibility

| Access | Members of the same class | Members of a derived class | Not members |
|---|---|---|---|
| `public` | yes | yes | yes |
| `protected` | yes | yes | no |
| `private` | yes | no | no |

Public members are accessible anywhere. Protected members are accessible in the class and its derived classes (C++ says derived where Java says subclass). Private members are accessible only from within the class.

## Circle: header, source, main

The slides split a class across two files. `Circle.hpp` holds the declaration; `Circle.cpp` holds the definitions, each prefixed with `Circle::`, the scope operator, so the compiler knows which class the function belongs to.

```cpp run pin Circle.cpp
// predict: Write the number printed.
#include <iostream>
using namespace std;

// ---- Circle.hpp ----
class Circle
{
    private:
        double radius;
    public:
        void set_radius(int);
        double area();
};

// ---- Circle.cpp ----
void Circle::set_radius (int new_radius)
{
    radius = new_radius;
}

double Circle::area()
{
    return 3.14 * radius * radius;
}

// ---- main.cpp ----
int main()
{
    Circle my_first_circle; //instantiate Circle
    my_first_circle.set_radius(2);
    cout << my_first_circle.area() << endl;
    return 0;
}
```

In the header `void set_radius(int);` is a prototype: the parameter has a type and no name, and nothing says what the function does. `double Circle::area()` in the source supplies the body; without the `Circle::` prefix it would be an unrelated free function called `area`, and `radius` inside it would be undeclared. `Circle my_first_circle; //instantiate Circle` creates the object; `set_radius(2)` stores 2 in its private `radius`, and the area is $3.14 \times 2 \times 2 = 12.56$.

The slide's alternative keeps the body in the header: `double area() { return 3.14 * radius * radius; }` written inside the class. Both spellings define the same member; the two-file split is the convention for anything bigger than a lecture example.

:::warn Three files, one program
When the class lives in `Circle.hpp` and `Circle.cpp`, `main.cpp` must `#include "Circle.hpp"` and the project must compile **both** source files. The header is pasted in by the preprocessor (Week 1); the definitions in `Circle.cpp` are linked in. Forgetting the second file gives an undefined-reference linker error, not a compile error.
:::

```challenge
{ "prompt": "Write a class <code>Rectangle</code> with private <code>int width, height;</code>, a public <code>void set_values(int a, int b)</code> that stores them, and a public <code>int area()</code> that returns their product. main is written for you and must print <code>20</code>.", "starter": "#include <iostream>\nusing namespace std;\n\n// your class here\n\nint main()\n{\n    Rectangle rect;\n    rect.set_values(4, 5);\n    cout << rect.area() << endl;\n    return 0;\n}\n", "expected": "20", "hints": ["Remember the semicolon after the class's closing brace.", "Members are private by default: put <code>public:</code> before the two functions.", "<code>int area() { return width * height; }</code>"], "solution": "#include <iostream>\nusing namespace std;\n\nclass Rectangle\n{\n    private:\n        int width, height;\n    public:\n        void set_values(int a, int b) { width = a; height = b; }\n        int area() { return width * height; }\n};\n\nint main()\n{\n    Rectangle rect;\n    rect.set_values(4, 5);\n    cout << rect.area() << endl;\n    return 0;\n}\n" }
```

```quiz
[
  {
    "q": "What is the only difference between `struct` and `class` in C++?",
    "options": ["A struct cannot have member functions", "Members of a struct are public by default; members of a class are private by default", "A struct cannot be inherited from", "A class must be split into a .hpp and a .cpp"],
    "answer": 1,
    "explain": "The slide: a struct and a class are the same thing in C++, except that with the keyword struct members get public access by default. Both can hold data, functions, type definitions and nested classes."
  },
  {
    "q": "What does this print?",
    "code": "class Encapsulation {\n    private: int x;\n    public:\n        void set(int a) { x = a; }\n        int get() { return x; }\n};\nint main() {\n    Encapsulation obj;\n    obj.set(5);\n    cout << obj.get();\n}",
    "options": ["5", "0", "a compile error: x is private", "garbage"],
    "answer": 0,
    "explain": "set stores 5 in the private x through a member function, which is allowed; get reads it back. Only a direct obj.x from main would be rejected."
  },
  {
    "q": "Making data members private and providing public getters and setters is called...",
    "type": "text",
    "answer": ["encapsulation"],
    "explain": "Encapsulation: combining data members and functions into a single unit (the class) and hiding the data behind public functions."
  },
  {
    "q": "Which statement about `protected` members is correct?",
    "options": ["Accessible anywhere", "Accessible in the class and in classes derived from it, but not from outside", "Accessible only inside the class itself", "Accessible from main but not from derived classes"],
    "answer": 1,
    "explain": "The access table: same class yes, derived class yes, not members no. Private differs from protected only in the middle column."
  },
  {
    "q": "In `Circle.cpp`, why is the definition written `double Circle::area()` and not `double area()`?",
    "options": ["`::` makes the function faster", "`Circle::` tells the compiler this is the member function declared inside class Circle, so it may use `radius`", "It is optional style", "Because the function returns a double"],
    "answer": 1,
    "explain": "The scope operator attaches the definition to the class. Without it you would define a free function named area with no access to the private member radius."
  },
  {
    "q": "The slide's Circle has `set_radius(2)` and `area()` returning `3.14 * radius * radius`. What prints?",
    "type": "numeric",
    "answer": 12.56,
    "tolerance": 0.001,
    "explain": "3.14 × 2 × 2 = 12.56."
  },
  {
    "type": "spotbug",
    "q": "Click the line that stops this from compiling.",
    "code": "class Circle\n{\n    private:\n        double radius;\n    public:\n        void set_radius(int);\n        double area();\n}\n\nint main() { return 0; }",
    "answer": 8,
    "explain": "Line 8: a class definition must end with a semicolon after the closing brace (objects may be declared there). Without it the compiler reads `int main` as part of the class declaration."
  },
  {
    "q": "Abstraction through header files means that...",
    "options": ["every function must be declared twice", "you use a function such as `pow()` through its declaration without knowing how it is implemented", "headers hide the class from main", "headers are compiled separately"],
    "answer": 1,
    "explain": "The slide's example: cout << pow(7,3) prints 343; we do not know how pow is implemented in the math header, we just use it. Only the relevant details are shown."
  }
]
```
