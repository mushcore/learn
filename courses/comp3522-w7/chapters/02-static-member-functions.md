---
title: Static member functions and the class you never instantiate
minutes: 16
---

Adding two numbers needs no object, yet a plain member function forces the caller to build one first. A static member function belongs to the class, so `X::f()` calls it with no object at all.

## A static member function has no this

Slide 9: a static member function *can only access static data and invoke static member functions*, and *there is no* `*this` *pointer*. Every non-static member is reached through `this`, so with no `this` the function cannot name one.

```cpp run pin static_functions.cpp
// predict: Write every line printed (nine lines, one of them blank).
#include <iostream>
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

`A::staticFunction1();` runs with no object in existence. Inside it, `staticNum` is static data and `staticFunction2();` is another static function, so both are allowed. The two commented-out lines are the slide's rule in action. Uncomment `nonStaticFunction();` and g++ says "cannot call member function 'void A::nonStaticFunction()' without object"; uncomment the `nonStaticName` line and it says "invalid use of member 'A::nonStaticName' in static member function". The static number is defined outside the class, `int A::staticNum = 5;`, by the previous lesson's rule.

## Reaching non-static members through an object

`static void staticFunctionParam(A a)` receives an object as a parameter, and `a.nonStaticFunction();` calls the non-static function on that object. Inside `nonStaticFunction`, `this` points at the parameter, so `this->nonStaticName` prints "My name is class A". The slide's "only static data" therefore means directly: a static function given an object reaches that object's members like any other code. `A aInstance;` is the object main hands over, copied into `a` because the parameter is by value.

The other direction always works: a non-static member function may call static ones, which is what the sample's last comment, `//staticFunction2(); //CAN call static function in non-static function`, says.

## No this, never virtual, never const

| Restriction | The `//ERROR` line | g++ says |
|---|---|---|
| no `this` | `//cout << nonStaticName << endl; //ERROR: can't call non static data members in static function` | invalid use of member in static member function; `this->` gives "'this' is unavailable for static member functions" |
| not virtual | `virtual static void staticFunction() //ERROR` | member 'staticFunction' cannot be declared both 'virtual' and 'static' |
| not const | `static void staticFunction() const //ERROR` | static member function cannot have cv-qualifier |

The second and third follow from the first. A trailing `const` promises not to change `*this`, and there is no `*this` to protect. A `virtual` call picks the function from the object's dynamic type, and a static call has no object to look at.

## Calculator versus StaticCalculator

Slide 10's application: *Classes that don't need to be instantiated to be used*, such as a static calculator, *a class that contains a series of common math operations*. The two sample folders differ only in the keyword. Without it, every caller builds a `Calculator`:

```cpp
struct Calculator {
    int add(int num1, int num2) { return num1 + num2; }
    int subtract(int num1, int num2) { return num1 - num2; }
};

void function() {
    Calculator c; //need to instantiate Calculator to use it
    int x = 100;
    int y = 50;
    cout << c.add(x,y) << endl;
    cout << c.subtract(x,y) << endl;
}
```

With `static` on both functions, no caller does:

```cpp
struct Calculator {
    static int add(int num1, int num2) { return num1 + num2; }
    static int subtract(int num1, int num2) { return num1 - num2; }
};

void function() {
    int x = 100;
    int y = 50;
    cout << Calculator::add(x,y) << endl; //no need to instantiate calculator
    cout << Calculator::subtract(x,y) << endl;
}
```

Each `main` makes the same calls with 10 and 5, so both programs print 15, 5, 150 and 50, one per line. The slide's comments name the difference: `c.add(num1, num2)` is *available only within scope of c variable*, while `Calculator::add(num1, num2)` is *available globally*. A static function can still be called through an object, so `c.add(2, 3)` compiles against the static version too; it simply ignores `c`.

## Trace and fix three classes with static member functions

One program to trace and two that do not compile, then a class to write. Type the line printed or click the rejected line.

```quiz
[
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Light {\n    bool on = false;\n    static int switches;\npublic:\n    static void flip(Light& l) {\n        l.on = !l.on;\n        switches++;\n    }\n    static int total() { return switches; }\n    bool isOn() const { return on; }\n};\n\nint Light::switches = 0;\n\nint main() {\n    Light hall;\n    Light porch;\n    Light::flip(hall);\n    Light::flip(porch);\n    Light::flip(hall);\n    cout << hall.isOn() << porch.isOn() << \" \" << Light::total() << endl;\n    return 0;\n}",
    "answer": ["01 3"],
    "explain": "`flip` is static, so it has no `this`, but it is handed a Light by reference and may change that object's private `on`. hall is flipped twice (false to true to false, printed 0), porch once (printed 1). `switches` is shared and counts all three flips: 3."
  },
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Meter {\n    int reading = 7;\n    static int scale;\npublic:\n    static int scaled() {\n        return reading * scale;\n    }\n};\n\nint Meter::scale = 3;\n\nint main() {\n    cout << Meter::scaled() << endl;\n    return 0;\n}",
    "answer": [9],
    "explain": "`scaled` is static, so it has no object and cannot name the non-static `reading`: g++ says 'invalid use of member Meter::reading in static member function'. `scale` on the same line is static and would be fine alone."
  },
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Shelf {\n    static int books;\npublic:\n    static void add() { books++; }\n    static int count() const { return books; }\n};\n\nint Shelf::books = 0;\n\nint main() {\n    Shelf::add();\n    cout << Shelf::count() << endl;\n    return 0;\n}",
    "answer": [8],
    "explain": "A static member function cannot be const: const would protect `*this`, and there is none. g++: 'static member function static int Shelf::count() cannot have cv-qualifier'. Drop the const."
  }
]
```

```challenge
{"prompt": "Finish <code>Robot</code>: a private static <code>int</code> named <code>built</code>, defined outside the class as 0; a constructor that adds one to it; and a static getter <code>count()</code> that returns it. <code>main</code> is given. Expected output: <code>0</code>, <code>2</code>, <code>3</code>, <code>3</code>, one per line.", "starter": "#include <iostream>\nusing namespace std;\n\nclass Robot {\n    // 1. declare a private static int named built\npublic:\n    // 2. constructor: add one to built\n    // 3. a static getter count() that returns built\n};\n\n// 4. define built outside the class, starting at 0\n\nint main() {\n    cout << Robot::count() << endl;\n    Robot r1;\n    Robot r2;\n    cout << Robot::count() << endl;\n    {\n        Robot r3;\n        cout << Robot::count() << endl;\n    }\n    cout << Robot::count() << endl;\n    return 0;\n}", "expected": "0\n2\n3\n3", "hints": ["Inside the class: <code>static int built;</code> under no access label, so it is private.", "Outside the class: <code>int Robot::built = 0;</code> with no <code>static</code> on the definition.", "<code>static int count() { return built; }</code> under <code>public:</code>. The last line is still 3: r3 is destroyed at the closing brace, but nothing subtracts from <code>built</code>."], "solution": "#include <iostream>\nusing namespace std;\n\nclass Robot {\n    static int built;\npublic:\n    Robot() { built++; }\n    static int count() { return built; }\n};\n\nint Robot::built = 0;\n\nint main() {\n    cout << Robot::count() << endl;\n    Robot r1;\n    Robot r2;\n    cout << Robot::count() << endl;\n    {\n        Robot r3;\n        cout << Robot::count() << endl;\n    }\n    cout << Robot::count() << endl;\n    return 0;\n}"}
```

```quiz
[
  {
    "q": "A static member function has a `this` pointer.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: there is no *this pointer. Writing `this->` inside one gives the g++ error ''this' is unavailable for static member functions'."
  },
  {
    "q": "Which member function declaration compiles?",
    "options": ["`static void staticFunction();`", "`virtual static void staticFunction();`", "`static void staticFunction() const;`", "`virtual static void staticFunction() const;`"],
    "answer": 0,
    "explain": "Static member functions cannot be virtual or const (slide 9). g++: 'cannot be declared both virtual and static' and 'static member function cannot have cv-qualifier'."
  },
  {
    "q": "A static member function can only access static data and invoke static member functions.",
    "type": "tf",
    "answer": true,
    "explain": "That is slide 9's rule, and it holds for members named directly. Given an object, a static function reaches its non-static members too, as `staticFunctionParam(A a)` does with `a.nonStaticFunction();`."
  },
  {
    "q": "Why can a static member function not be declared `const`?",
    "options": ["a trailing const promises not to change `*this`, and a static function has no `*this`", "static data members are always const already", "const functions must be virtual", "a static function cannot return a value"],
    "answer": 0,
    "explain": "const qualifies the object the function is called on. With no object there is nothing to qualify, so g++ reports that a static member function cannot have a cv-qualifier."
  },
  {
    "q": "In static_functions.cpp, how does `staticFunctionParam` manage to run `nonStaticFunction`?",
    "options": ["it calls it on its parameter: `a.nonStaticFunction();`", "it calls `nonStaticFunction();` directly", "it calls `this->nonStaticFunction();`", "it cannot: that line is commented out"],
    "answer": 0,
    "explain": "A non-static function needs an object. The direct call is commented out as an error; through the parameter `a` it works, and inside nonStaticFunction `this` is &a."
  },
  {
    "q": "With StaticCalculator's `static int add(int num1, int num2)`, which call needs no Calculator object?",
    "options": ["`Calculator::add(num1, num2)`", "`c.add(num1, num2)` after `Calculator c;`", "`Calculator.add(num1, num2)`", "`this->add(num1, num2)` in main"],
    "answer": 0,
    "explain": "Slide 10: `Calculator::add(num1, num2)` is available globally, while `c.add` is available only within scope of the c variable. `Calculator.add` does not compile on a class name, and main has no `this`."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Counter {\n    static int n;\n    static int next() { return ++n; }\n};\n\nint Counter::n = 10;\n\nint main() {\n    Counter c;\n    cout << Counter::next() << \" \" << c.next() << \" \" << Counter::n << endl;\n    return 0;\n}",
    "answer": ["11 12 12"],
    "explain": "There is one `n`, starting at 10. `Counter::next()` makes it 11; `c.next()` calls the same static function through an object, making it 12; then `Counter::n` reads 12. Since C++17 the operands of << are evaluated left to right."
  }
]
```
