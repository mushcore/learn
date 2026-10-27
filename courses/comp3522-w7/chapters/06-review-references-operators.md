---
title: Review: references, and member versus friend operators
minutes: 20
---

The instructor's midterm review list opens with references and overloaded operators (slides 45 to 66). Each section here is the short version; the link at its end goes to the lesson that teaches it in full.

## A reference is a nickname

Slide wording: *References are an alias or nickname for an existing variable*, and you *can change the value in variable using the reference*. The slides then contrast dereferencing: *accessing or manipulating the value that a pointer is pointing at. This is a term more associated with pointers, than references.* The program runs both slide sequences on the same `x`.

```cpp run pin slides46-51-nickname.cpp
// predict: Write the two lines printed. Both changes land on the same x.
#include <iostream>
using namespace std;

int main() {
    int x = 0;
    int &xRef = x; //xRef is a nickname for x
    xRef += 5;
    cout << x << endl;

    int *xPtr = &x; //xPtr points at x memory address
    *xPtr += 5; //Dereference xPtr to modify x's value
    cout << x << endl;
    return 0;
}
```

`int &xRef = x;` gives `x` a second name, so `xRef += 5;` is the same statement as `x += 5;`: no `*`, no address. `int *xPtr = &x;` stores the address of x in a separate variable, and `*xPtr += 5;` follows that address to reach x. On the slides' memory boxes, `xRef` is written in x's own box (0xffff), while `xPtr` has a box of its own (0xaaaa) holding 0xffff. Full lessons: [references](#/comp3522-w2/references) and [pointers](#/comp3522-w2/pointers).

## Three reasons to pass by reference

Slides 52 to 54 give three uses, in the slide's words:

1. *When we need to change the original value of a variable when passed into a function.*
2. *When we don't want to make unnecessary copies when passing argument into a function.*
3. *To allow polymorphic behavior (also works with pointers).*

### Slide 52: by value and by reference

```cpp run pin slide52-references.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

//Pass by value
void addByValue(int xCopy)
{
      xCopy += 5; //local xCopy changes to 5
}

//Pass by reference
void addByReference(int &x)
{
      x += 5; //original x changes to 5
}

int main() {
      int x = 0;
      addByValue(x);
      cout << x << endl;

      int y = 0;
      addByReference(y);
      cout << y << endl;
      return 0;
}
```

`addByValue` receives `xCopy`, a copy, so `xCopy += 5;` changes only the copy. `addByReference` receives `int &x`, a nickname for main's `y`, so `x += 5;` changes `y` itself. The slide names both functions `add`; they are renamed here because `add(int)` and `add(int&)` in one program make the call ambiguous.

### Skip the copy

```cpp
void print(const MyClass& mc)
{
      cout << mc.getX();
}
```

The `&` means no copy of `mc` is made, and `const` promises the function will not change it: the usual way to pass a class object you only read. It works because the slide declares `getX` as a `const` member function.

### Slide 54: an Animal reference parameter

```cpp run pin slide54-polymorphism.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

class Animal {
public:
      virtual void speak() = 0;
};

class Dog : public Animal {
public:
      void speak() { cout << "woof" << endl;}
};

class Bird : public Animal {
public:
      void speak() { cout << "chirp" << endl;}
};

void animalSpeak(Animal &a)
{
      a.speak(); //calls polymorphic speak function
}

int main() {
      Dog d;
      animalSpeak(d);

      Bird b;
      animalSpeak(b);
      return 0;
}
```

`animalSpeak(Animal &a)` accepts any Animal by reference, and `a.speak();` runs the `speak` of the object actually passed in, because `speak` is virtual. A by-value parameter (`Animal a`) would slice a Dog down to an Animal; here it would not even compile, since `virtual void speak() = 0;` makes Animal abstract. Full lesson: [polymorphism and virtual](#/comp3522-w3/polymorphism-virtual).

## Pointers versus references

Slides 55 and 56 as one table (`num` is 5, `num2` is 10, `arr` is `{0,1,2}`):

| | Pointer | Reference |
|---|---|---|
| What it is | *Holds memory addresses*: `int *numPtr = &num;` | *A nickname for an existing variable*: `int &numRef = num;` |
| Declared with no initializer | `int *numPtr; //OK` | `int &numRef; //ERROR` (only a class data member may be declared this way) |
| Null | `int *numPtr = nullptr; //OK` | `int &numRef = NULL //ERROR` |
| Reach the value | by dereferencing: `*numPtr = 5;` | directly: `numRef = 5;` |
| Next element | `numPtr++;` moves to the next element | cannot move; `int (&numRef)[3] = arr; numRef[0]++;` changes element 0 |
| After initialization | `numPtr = &num2;` now points at num2 | `numRef = num2;` *can NOT change numRef to refer to num2. Sets num's value to 10* |

The last row is the one exams test: assigning to a reference assigns to the variable it names. Full lesson: [pointers](#/comp3522-w2/pointers).

## Member or friendly non-member operator

Slides 58 to 60: overloaded operators *allow us to use shorthand notation*, so `cout << ms;` replaces `cout << ms.getString();` and `ms += s;` replaces `ms.append(s);`. To decide where an operator goes, slide 62 asks: *1. Unary or Binary operator? 2. Does the result of the binary operator modify an operand?*

| Kind of operator | Slide's examples | Implement as |
|---|---|---|
| Unary: operates on one operand | `++x`, `x++`, `--x`, `x--`, `!x` | member functions |
| Binary, modifies the left operand | `x += y`, `x -= y` | member functions |
| Binary, produces a new value and modifies neither operand | `x+y`, `x-y`, `x == y`, `x != y` | friendly non-member functions |

```cpp
class Money {
public:
    Money& operator+=(const Money& rhs);                         // member: changes *this
    friend Money operator+(const Money& lhs, const Money& rhs);  // friend: builds a new Money
    friend bool operator==(const Money& lhs, const Money& rhs);
};
```

This is the course's convention, and the sample files `operatorsBasic.cpp` and `operators.cpp` follow it. The language itself adds two fixed cases: `=`, `[]`, `()` and `->` must be members, and `operator<<` with an `ostream` on the left must be a non-member. Full lesson: [operator overloading](#/comp3522-w4/operator-overloading).

```quiz
[
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int num = 5;\n    int num2 = 10;\n    int& numRef = num;\n    numRef = num2;\n    numRef++;\n    cout << num << \" \" << num2 << endl;\n    return 0;\n}",
    "answer": ["11 10"],
    "explain": "numRef is a nickname for num for its whole life. `numRef = num2;` copies 10 into num; it does not make numRef refer to num2. `numRef++` then makes num 11. num2 is never touched: 10."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[3] = {0, 1, 2};\n    int* numPtr = arr;\n    numPtr++;\n    *numPtr += 10;\n    int (&numRef)[3] = arr;\n    numRef[0]++;\n    cout << arr[0] << \" \" << arr[1] << \" \" << arr[2] << endl;\n    return 0;\n}",
    "answer": ["1 11 2"],
    "explain": "`numPtr++` moves the pointer from arr[0] to arr[1], so `*numPtr += 10` makes arr[1] 11. The reference to the array cannot move: `numRef[0]++` changes element 0 from 0 to 1. arr[2] stays 2."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nvoid update(int a, int &b) {\n    a += 1;\n    b += a;\n}\n\nint main() {\n    int x = 1;\n    int y = 1;\n    update(x, y);\n    update(x, y);\n    cout << x << \" \" << y << endl;\n    return 0;\n}",
    "answer": ["1 5"],
    "explain": "a is a copy of x, so `a += 1` makes the copy 2 and x stays 1. b is a nickname for y: the first call makes y 1 + 2 = 3, the second (a again a fresh copy of 1, then 2) makes y 3 + 2 = 5."
  },
  {
    "q": "What does this print?",
    "code": "#include <iostream>\nusing namespace std;\n\nclass Animal {\npublic:\n    virtual void speak() { cout << \"...\" << endl; }\n};\n\nclass Dog : public Animal {\npublic:\n    void speak() { cout << \"woof\" << endl; }\n};\n\nvoid speakCopy(Animal a) { a.speak(); }\nvoid speakRef(Animal &a) { a.speak(); }\n\nint main() {\n    Dog d;\n    speakCopy(d);\n    speakRef(d);\n    return 0;\n}",
    "options": ["`...` then `woof`", "`woof` then `woof`", "`...` then `...`", "It does not compile"],
    "answer": 0,
    "explain": "speakCopy takes an Animal by value: the Dog is sliced into a new Animal, so the virtual call finds Animal's speak and prints `...`. speakRef takes a reference to the real Dog, so the virtual call reaches Dog's speak: woof. Polymorphism needs a reference or a pointer."
  },
  {
    "q": "Given `int num = 5;` inside main, which lines compile? (select all)",
    "options": ["`int *numPtr;`", "`int &numRef;`", "`int *numPtr = nullptr;`", "`int &numRef = num;`", "`int &numRef = NULL;`"],
    "answer": [0, 2, 3],
    "explain": "A pointer may start uninitialized or null. A reference must be bound to an existing variable when it is declared (outside class data members) and can never refer to NULL or nothing."
  },
  {
    "q": "Which operators do the slides say to implement as member functions? (select all)",
    "options": ["`++x`", "`x += y`", "`x + y`", "`!x`", "`x != y`"],
    "answer": [0, 1, 3],
    "explain": "Unary operators (++x, !x) are members, and so are binary operators that modify the left operand (+=, -=). x + y and x != y produce a new value and change neither operand, so the slides make them friendly non-member functions."
  },
  {
    "q": "Per the slides, `operator==` for a `Fraction` class should be written as...",
    "options": ["a friendly non-member function", "a member function, because it is binary", "a static member function", "a member function, because it changes the left operand"],
    "answer": 0,
    "explain": "== is binary and modifies neither operand; it produces a new value (a bool), so slide 66 says friendly non-member. In C++20 a member or defaulted == also works and != is rewritten from it, but the course keys the slide's rule."
  },
  {
    "q": "True or false: after `int& numRef = num;`, the statement `numRef = num2;` makes numRef refer to num2.",
    "type": "tf",
    "answer": false,
    "explain": "A reference cannot be reseated. `numRef = num2;` assigns num2's value to num (slide 56: sets num's value to 10). Only a pointer can be pointed somewhere else after initialization."
  },
  {
    "q": "Which are the slides' three reasons to use a reference parameter? (select all)",
    "options": ["To change the original value of the variable passed in", "To avoid making an unnecessary copy of the argument", "To allow polymorphic behavior", "So the parameter can be nullptr when there is no object", "So the function can make the parameter refer to a different variable"],
    "answer": [0, 1, 2],
    "explain": "Slides 52 to 54: change the original, skip the copy (usually `const MyClass&`), and allow polymorphism. A reference can never be null and can never be reseated; those are pointer abilities."
  },
  {
    "q": "Complete the slide's definition: dereferencing is accessing or manipulating the value that a ____ is pointing at.",
    "type": "text",
    "answer": ["pointer", "a pointer"],
    "explain": "Slide 49: dereferencing is a term more associated with pointers than references. `*xPtr += 5` dereferences; a reference reaches the value directly, with no *."
  }
]
```
