---
title: Review: kinds of functions, and the copy constructor
minutes: 20
---

Slides 87 to 98 close the review: the three kinds of functions, then why a class that owns a pointer needs a copy constructor of its own.

## Regular, member and friend functions

Slide 88, a "regular" function: *groups code to perform a specific task*; the difference is that these are *functions that don't belong to a class* (think of a function in main.cpp).

```cpp
void myFunction() {}
```

Slides 89 and 90, a member function: *Functions that belong to a class*, used to *get/set data of class* or *perform operation on class' data members to produce a result*. It can be declared and defined in the class, or declared in the class and defined outside it, and then *must scope the function with "MyClass::" if defining outside the class*.

```cpp
class MyClass {
public:
     void inside() {}  //declare and define in class
     void outside();   //declare function prototype
};

void MyClass::outside() {} //define function outside of class
```

Slide 91, a friend function: *A non member function that has access to private/protected data members of the class that declared it.* *Friend functions are NOT member functions of a class even though they're declared in a class*, *visibility specifiers (private/protected/public) don't affect friend functions*, and they *can be implemented in the class or outside the class*.

```cpp
class MyClass {
      int x = 0;
      friend void show(MyClass mc); //declared in the class, still not a member
};

void show(MyClass mc) {} //defined outside, with no MyClass::
```

## Slide 92: a friend function

```cpp run pin slide92-friend.cpp
// predict: Write what prints (the program prints no newline).
#include <iostream>

//MyClass.hpp
class MyClass {
private:
      int x = 0;
      friend void friendFunc(MyClass mc);
};

//main.cpp
void friendFunc(MyClass mc) {
      mc.x++;
      std::cout << mc.x;
}

int main() {
      MyClass mc;
      friendFunc(mc);
      return 0;
}
```

Slide wording: *mc.x is private, which is normally not accessible. But because friendFunc is a friend function declared within MyClass, it has access to all MyClass' data members.* Look at the parameter, though: `friendFunc(MyClass mc)` takes the object by value, so `mc.x++;` raises the copy's x, and the object in main still holds 0. To change main's object, the friend would take `MyClass &mc`. Slide 93 on when to use friends: *Overloading operators* and *Get access to private data of a class*, but you *shouldn't abuse ability to access private data by making all classes friends*; *create accessors (getters) and mutators (setters) instead.* And: *Don't scope friend function definitions because friend functions don't belong to a class.* Full lesson: [friends](#/comp3522-w4/friends).

## Shallow versus deep copy

Slide 94: use the copy constructor *when we want to copy an existing object into a new object*, as in `MyClass mc2(mc);`, and C++ calls it for you when you pass by value, and when you return by value unless the copy is elided ([when the copy constructor runs](#/comp3522-w7/copy-constructor-calls)). Slide 96, why write one: *If we don't write a working copy constructor, C++ uses a built-in copy constructor that performs shallow copies*, and *shallow copies do NOT properly create new copies of dynamic memory*. A class with no data members created using dynamic memory, and no pointers to memory that needs a deep copy, does not need one.

The next two programs are slides 97 and 98 with three lines added after `MyClass mc2(mc);`: one writes 7 through `mc2`, one prints both ints, and one compares the two pointers and prints whether they hold the same address. The slides draw those addresses as boxes; printing the raw addresses would give different numbers on every run, so the program prints the comparison instead.

### Slide 97: MyClass with no copy constructor

```cpp run pin slide97-shallow-same.cpp
// predict: Write the two lines printed.
#include <iostream>

struct MyClass {
      int *ptr; //pointer to dynamic memory int

public:
      MyClass() { ptr = new int(5);}

};

int main() {
      MyClass mc;
      MyClass mc2(mc);
      *mc2.ptr = 7;
      std::cout << *mc.ptr << " " << *mc2.ptr << std::endl;
      std::cout << "same int: " << (mc.ptr == mc2.ptr ? "yes" : "no") << std::endl;
      return 0;
}
```

Slide wording: *Did NOT write a copy constructor, so default copy constructor copied the address mc is pointing to, to mc2. This means both mc and mc2 are pointing to the same object.* The built-in copy constructor copies `ptr`, an address, member by member, and never calls `new`, so `*mc2.ptr = 7;` writes the one int that both objects share.

### Slide 98: MyClass with a copy constructor

```cpp run pin slide98-deep-same.cpp
// predict: Write the two lines printed.
#include <iostream>

struct MyClass {
      int *ptr; //pointer to dynamic memory int

public:
      MyClass() { ptr = new int(5);}
      MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {} //deep copy of other int

};

int main() {
      MyClass mc;
      MyClass mc2(mc);
      *mc2.ptr = 7;
      std::cout << *mc.ptr << " " << *mc2.ptr << std::endl;
      std::cout << "same int: " << (mc.ptr == mc2.ptr ? "yes" : "no") << std::endl;
      return 0;
}
```

`MyClass(const MyClass& other) : ptr(new int(*other.ptr)) {}` does what the slide says: *Allocate new dynamic memory for int, copy value from the other ptr, make ptr point to it*, so `mc` and `mc2` (the slide writes `mc & mc2`) *now point to their own copies of int*. Writing through `mc2` leaves the 5 in mc alone. The copy constructor is not the whole job: this class never deletes its int (it leaks), and `mc2 = mc;` would still copy the address, so it also needs a destructor and a copy assignment operator, the rule of three from Week 4. Full lessons: [the copy constructor](#/comp3522-w3/copy-constructor) and [copy assignment](#/comp3522-w4/copy-assignment).

```quiz
[
  {
    "q": "Click the line the compiler rejects.",
    "type": "spotbug",
    "code": "#include <iostream>\n\nclass MyClass {\nprivate:\n    int x = 0;\n    friend void friendFunc(MyClass mc);\n};\n\nvoid MyClass::friendFunc(MyClass mc) {\n    mc.x++;\n    std::cout << mc.x;\n}\n\nint main() {\n    MyClass mc;\n    friendFunc(mc);\n    return 0;\n}",
    "answer": [9],
    "explain": "friendFunc is a friend, not a member, so its definition is not scoped: write `void friendFunc(MyClass mc) {`. g++: no declaration matches 'void MyClass::friendFunc(MyClass)'."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nclass MyClass {\nprivate:\n    int x = 0;\n    friend void byValue(MyClass mc);\n    friend void byRef(MyClass &mc);\npublic:\n    int getX() const { return x; }\n};\n\nvoid byValue(MyClass mc) { mc.x++; cout << mc.x << \" \"; }\nvoid byRef(MyClass &mc) { mc.x++; cout << mc.x << \" \"; }\n\nint main() {\n    MyClass mc;\n    byValue(mc);\n    byRef(mc);\n    byRef(mc);\n    byValue(mc);\n    cout << mc.getX() << endl;\n    return 0;\n}",
    "answer": ["1 1 2 3 2"],
    "explain": "byValue works on a copy: it prints the copy's x after ++ and main's x does not change. byRef changes main's object. x starts 0: byValue prints 1 (main still 0), byRef makes it 1, byRef makes it 2, byValue copies the 2 and prints 3 (main still 2), then getX prints 2."
  },
  {
    "q": "Type the line this prints.",
    "type": "text",
    "code": "#include <iostream>\nusing namespace std;\n\nstruct Deep {\n    int *ptr;\n    Deep() { ptr = new int(5); }\n    Deep(const Deep& other) : ptr(new int(*other.ptr)) {}\n};\n\nstruct Shallow {\n    int *ptr;\n    Shallow() { ptr = new int(5); }\n};\n\nint main() {\n    Deep a;\n    *a.ptr = 3;\n    Deep b(a);\n    *a.ptr = 9;\n\n    Shallow s;\n    Shallow t(s);\n    *s.ptr = 9;\n\n    cout << *a.ptr << *b.ptr << *s.ptr << *t.ptr << endl;\n    delete a.ptr;\n    delete b.ptr;\n    delete s.ptr; // t.ptr is the same int: deleting it too would free it twice\n    return 0;\n}",
    "answer": ["9399"],
    "explain": "Deep's copy constructor gives b its own int holding a copy of 3, so setting a to 9 leaves b at 3. Shallow uses the built-in copy, so t.ptr is the same address as s.ptr: setting s's int to 9 shows through t. Prints 9, 3, 9, 9."
  },
  {
    "q": "True or false: a friend function is a member function of the class that declares it.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 91: friend functions are NOT member functions even though they are declared in the class. They are called like regular functions, `friendFunc(mc)`, and have no this pointer."
  },
  {
    "q": "Which statements about friend functions are on slides 91 to 93? (select all)",
    "options": ["They can access the private and protected members of the class that declares them", "Visibility specifiers (private/protected/public) don't affect them", "They can be implemented in the class or outside it", "Their definition outside the class is scoped with `MyClass::`", "They are called as `mc.friendFunc()`"],
    "answer": [0, 1, 2],
    "explain": "A friend is a non-member with access to private data. Because it does not belong to the class, its definition is never scoped with MyClass:: and it is not called through an object."
  },
  {
    "q": "Why write your own copy constructor for a class with an `int *ptr` to dynamic memory?",
    "options": ["The built-in copy constructor makes shallow copies, which do not create new copies of dynamic memory", "There is no built-in copy constructor for classes with pointers", "The built-in copy constructor copies the int but not the pointer", "So that the object can be passed by reference"],
    "answer": 0,
    "explain": "Slide 96. The built-in one copies the address, so both objects point at one int (slide 97). A deep copy allocates a new int and copies the value (slide 98)."
  },
  {
    "q": "True or false: a class whose only data members are an `int` and a `std::string` needs a hand-written copy constructor.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 96: you don't need one when the class has no members created using dynamic memory and no pointers to memory that needs a deep copy. string copies itself correctly."
  },
  {
    "type": "match",
    "q": "Match each line to the kind of function it shows.",
    "pairs": [
      ["`void myFunction() {}` in main.cpp", "regular function"],
      ["`class MyClass { void myFunction() {} };`", "member, declared and defined in the class"],
      ["`void MyClass::myFunction() {}`", "member, defined outside the class"],
      ["`friend void myFunction(MyClass mc);` inside MyClass", "non-member with access to private data"]
    ],
    "explain": "Regular: belongs to no class. Member: belongs to the class, scoped with MyClass:: when defined outside. Friend: declared in the class but not a member."
  },
  {
    "q": "For `MyClass mc;` already built, which lines call MyClass's copy constructor? (select all)",
    "options": ["`MyClass mc2(mc);`", "`MyClass mc3 = mc;`", "`f(mc);` where `void f(MyClass c)`", "`g(mc);` where `void g(const MyClass& c)`", "`MyClass* p = &mc;`"],
    "answer": [0, 1, 2],
    "explain": "Copying into a new object, with either syntax, and passing by value both call it (slides 23 and 94). A reference parameter and a pointer refer to mc itself: no new object, no copy."
  }
]
```
