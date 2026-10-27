---
title: Copy elision and return value optimization
minutes: 20
---

A function that returns an object by value looks as if it must build the object and then copy it out to the caller. Copy elision is the rule that removes that copy, and the deck's `Number` class shows when it applies.

## Copy elision and return value optimization

Slide wording: *Copy Elision (or copy omission) is a compiler optimization technique that avoids unnecessary copying of objects*. *Return value optimization is a subset of copy elision. Avoids unnecessary copying of objects returned from a function*. The slide draws RVO as a box inside the copy elision box: every RVO is a copy elision, but copy elision also removes copies that have nothing to do with a return.

## The Number class and createNumber

```cpp run pin number-rvo.cpp
// predict: Write every line printed. Each line is one constructor call.
#include <iostream>

//Number.hpp
class Number {
private:
        int num;
public:
        Number(int n) : num (n) { std::cout << "1-param constructor\n"; }
        Number(const Number &n2)
        {num = n2.num; std::cout << "copy constructor\n"; }
};

//main.cpp
Number createNumber(int num)
{
        return Number(num);
}

//main function
int main() {
        Number n = createNumber(5);
        return 0;
}
```

The class is the deck's with two repairs: the slide's code is missing the `;` after `int num` and after the class's closing brace, and each constructor now prints its name so the run shows every call. `Number(int n) : num (n)` is the one-parameter constructor and `Number(const Number &n2)` is the copy constructor. Inside `createNumber`, `return Number(num);` builds an unnamed `Number` on the return statement, and `Number n = createNumber(5);` initializes `n` from what the call returns.

```quiz
[
  {
    "q": "Slide 14 asks about the program above: how many objects of type Number are created?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "explain": "The real output is one line, `1-param constructor`: one Number object, built directly in `n`. Read from the code alone, `return Number(num);` asks for three objects (the temporary, the function's return value and `n`) and two copy-constructor calls. Since C++17 neither copy happens: a prvalue of the same type initializes `n` directly, so the copy constructor is never called."
  },
  {
    "q": "Slide 17 changes main to `Number n (Number(2));`. Which constructor is called after the `Number(2)` object is created?",
    "code": "#include <iostream>\n\n//Number.cpp\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\n//main function\nint main() {\n        Number n (Number(2));\n        return 0;\n}\n",
    "options": [
      "None: the program prints only `1-param constructor`",
      "The copy constructor `Number(const Number &n2)`, copying the temporary into `n`",
      "The one-parameter constructor a second time, to build `n`",
      "The copy constructor, then the temporary's destructor"
    ],
    "answer": 0,
    "explain": "The real output is the single line `1-param constructor`. The slide's *Based on code* answer is the copy constructor, copying the `Number(2)` temporary into `n`; its *With copy elision* answer is none. Since C++17 the second answer is guaranteed, not an optimization: `Number(2)` is the initializer of `n` and never exists as a separate object."
  }
]
```

## RVO builds the returned object in n

Both programs print one line: one `Number` object, built by the one-parameter constructor, and no copy constructor call. Slide wording: *Return value optimization lets the compiler remove the temporaries by directly initializing n*. The slide goes on: *Directly constructs the object initialized inside the createNumber function into the memory space of n*, and *Happens automatically, but requires returned object to be constructed on a return statement*. That condition is why `return Number(num);` qualifies: the object comes into being on the return line itself.

For `Number n (Number(2));` the deck draws two pictures. *Based on code*, `Number(2)` makes a temporary and the copy constructor copies it into `n`. *With copy elision*, there is no temporary. Slide 20 states the result: *the compiler optimized our call by avoiding the call to copy constructor and directly called 1 parameter constructor*. The midterm practice traces the same class with a destructor added: [One Number, how many objects](#/comp3522-midterm/output-traces).

### Constructor calls for createNumber(5)

```widget
elision-trace
{ "case": "rvo", "predict": true }
```

The calls the code asks for sit beside the calls that happen: the temporary and the return value drop out, with both copy-constructor calls, and the one-parameter constructor writes straight into `n`.

### Constructor calls for Number(2) into n

```widget
elision-trace
{ "case": "temp" }
```

Without elision `Number(2)` would be its own object, copied into `n` and then destroyed; with elision it is only the initializer of `n`.

## NRVO: the returned object has a name

Slide 16 changes the body of `createNumber` to `Number tempN(num); return tempN;`. Slide wording: *Named return value optimization can remove the temporaries by directly initializing n even if the returned object is named*. The compiler builds `tempN` in the memory of `n` from the start, so returning it needs no copy. The slide adds: *Note, there's no guarantee that all compilers use RVO and NRVO*. g++ applies NRVO here, so the slide-16 version also prints a single `1-param constructor`.

NRVO needs one named object that every return statement returns. A function that may return either of two locals cannot build both in the caller's memory, so the one it returns is copied.

## What C++17 guarantees

The slides call all of this an optimization that some compilers may skip. Since C++17 that is true only of NRVO. When an object is initialized from a prvalue of the same type (an unnamed temporary such as `Number(num)` or `Number(2)`, or a call that returns one), the elision is guaranteed: no temporary exists, the copy constructor is never called, and the code compiles even when the copy constructor is deleted. NRVO, returning a named local, is still optional; g++ does it, but the standard allows a copy. Returning a function parameter is never elided: the standard excludes parameters, because a parameter is a separate object built before the function body runs, so it cannot also be the caller's object. It is copied (or moved) into it. The next lesson runs that case.

## Classify three more initializations as elided or not

Each program uses a new class, `Box`, whose two constructors print. Decide whether a copy is made, then pick the output.

```quiz
[
  {
    "q": "Is the copy elided? What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Box {\n    int size;\npublic:\n    Box(int s) : size(s) { cout << \"Box(int) \" << size << endl; }\n    Box(const Box& other) : size(other.size) { cout << \"Box copy \" << size << endl; }\n};\n\nint main() {\n    Box b = Box(Box(4));\n    return 0;\n}\n",
    "options": [
      "Elided, guaranteed: `Box(int) 4`",
      "Not elided: `Box(int) 4` / `Box copy 4`",
      "Not elided: `Box(int) 4` / `Box copy 4` / `Box copy 4`",
      "Elided only by NRVO, so g++ prints `Box(int) 4` but the standard allows a copy"
    ],
    "answer": 0,
    "explain": "Real output: `Box(int) 4`. `Box(4)` is a prvalue, `Box(Box(4))` is a prvalue of the same type initialized from it, and `b` is initialized from that: every step is a prvalue of type `Box`, so C++17 guarantees one object built in `b` and no copy constructor call."
  },
  {
    "q": "Is the copy elided? What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Box {\n    int size;\npublic:\n    Box(int s) : size(s) { cout << \"Box(int) \" << size << endl; }\n    Box(const Box& other) : size(other.size) { cout << \"Box copy \" << size << endl; }\n};\n\nint main() {\n    Box a(6);\n    Box c = a;\n    return 0;\n}\n",
    "options": [
      "Elided, guaranteed: `Box(int) 6`",
      "Not elided: `Box(int) 6` / `Box copy 6`",
      "Elided by NRVO: `Box(int) 6`",
      "Not elided: `Box copy 6` / `Box(int) 6`"
    ],
    "answer": 1,
    "explain": "Real output: `Box(int) 6` / `Box copy 6`. `a` is a named object that keeps living after the line, so `Box c = a;` must make a second object: this is the slide's first case, invoking the copy constructor directly. Elision only removes copies of temporaries and returned objects."
  },
  {
    "q": "`pick` may return either of two locals. Is the copy elided? What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Box {\n    int size;\npublic:\n    Box(int s) : size(s) { cout << \"Box(int) \" << size << endl; }\n    Box(const Box& other) : size(other.size) { cout << \"Box copy \" << size << endl; }\n};\n\nBox pick(bool big) {\n    Box small(1);\n    Box large(9);\n    if (big)\n        return large;\n    return small;\n}\n\nint main() {\n    Box d = pick(true);\n    return 0;\n}\n",
    "options": [
      "Elided by NRVO: `Box(int) 1` / `Box(int) 9`",
      "Not elided: `Box(int) 1` / `Box(int) 9` / `Box copy 9`",
      "Elided, guaranteed: `Box(int) 9`",
      "Not elided: `Box(int) 1` / `Box(int) 9` / `Box copy 1`"
    ],
    "answer": 1,
    "explain": "Real output: `Box(int) 1` / `Box(int) 9` / `Box copy 9`. NRVO builds one named local in the caller's memory, but here two locals exist at once and which one is returned is decided at run time, so g++ cannot place both in `d`. `large` is returned, so it is copied into `d` (the class has no move constructor, so the copy constructor runs)."
  }
]
```

```quiz
[
  {
    "q": "Per the slide, what is copy elision?",
    "options": [
      "A compiler optimization technique that avoids unnecessary copying of objects",
      "A rule that every function must return by reference",
      "A technique that copies objects lazily, on first use",
      "A compiler warning about objects copied more than once"
    ],
    "answer": 0,
    "explain": "Slide 12: *Copy Elision (or copy omission) is a compiler optimization technique that avoids unnecessary copying of objects*. Since C++17 some elision is a language guarantee rather than an optimization, but the slide's definition is the one the quiz uses."
  },
  {
    "q": "Return value optimization is a subset of copy elision.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 12: RVO *avoids unnecessary copying of objects returned from a function*, one kind of copy elision. Copy elision also covers copies with no return, such as `Number n (Number(2));`."
  },
  {
    "q": "Per the slide, there's no guarantee that all compilers use RVO and NRVO.",
    "type": "tf",
    "answer": true,
    "explain": "That is slide 16's note, so true by the slide. In C++17 it holds only for NRVO: RVO from a prvalue, as in `return Number(num);`, is guaranteed by the language."
  },
  {
    "q": "Per slide 15, RVO happens automatically, but requires the returned object to be:",
    "options": [
      "constructed on a return statement",
      "a named local variable",
      "a function parameter",
      "declared `const`"
    ],
    "answer": 0,
    "explain": "Slide wording: *requires returned object to be constructed on a return statement*, as `return Number(num);` is. A named local is slide 16's NRVO; a parameter is never elided."
  },
  {
    "q": "This is slide 16's NRVO version. How many times does the copy constructor run?",
    "type": "numeric",
    "code": "#include <iostream>\n\n//Number.hpp\nclass Number {\nprivate:\n        int num;\npublic:\n        Number(int n) : num (n) { std::cout << \"1-param constructor\\n\"; }\n        Number(const Number &n2)\n        {num = n2.num; std::cout << \"copy constructor\\n\"; }\n};\n\n//main.cpp\nNumber createNumber(int num)\n{\n        Number tempN(num);\n        return tempN;\n}\n\n//main function\nint main() {\n        Number n = createNumber(5);\n        return 0;\n}\n",
    "answer": 0,
    "tolerance": 0,
    "explain": "Real output: the single line `1-param constructor`. g++ applies NRVO, building `tempN` directly in `n`, so `return tempN;` copies nothing. The standard allows this copy to be elided but does not require it."
  },
  {
    "q": "Under C++17, which of these initializations is never elided?",
    "options": [
      "`Number mc2 = f(mc);` where `f(Number p)` does `return p;` (the copy out of the parameter)",
      "`Number n = createNumber(5);` where `createNumber` does `return Number(num);`",
      "`Number n (Number(2));`",
      "`Number n = Number(7);`"
    ],
    "answer": 0,
    "explain": "The standard excludes parameters: a parameter is a separate object built before the function body runs, so it cannot also be the caller's object, and returning it always copies (or moves). The other three initialize from a prvalue of the same type, which C++17 guarantees to elide."
  }
]
```
