---
title: Midterm practice questions, worked
minutes: 25
---

The Week 4 deck ends with five practice questions for the midterm. They are short-answer questions, so write each answer on paper first, then compare with the model answers and run the code.

## 1. What is a copy constructor? When is it used? How can it be invoked in code?

A copy constructor is the constructor that builds a **new object as a copy of an existing object** of the same class, with the canonical signature `Complex(const Complex& c)`: `const` so both mutable and immutable objects can be copied, `&` so the parameter is not itself a copy. It is used whenever a new object is initialized from another: a declaration such as `Complex copyC(c);` or `Complex anotherCopyC = c;`, passing an object to a function **by value**, and returning an object by value. It is **not** used by `anotherCopyC = c;`, which calls the copy assignment operator. The compiler generates a member-wise (shallow) copy constructor; a class that owns a pointer writes its own deep copy.

## 2. What is a reference? How is it different from a pointer?

A reference is an **alias**, another name for an existing variable: `int n{123}; int& ref = n;` makes `ref` and `n` the same box, and `ref = m` assigns into `n`. A pointer is a separate variable that **holds an address**: `int* p = &n;` and `*p` reaches the box. Differences: a reference must be initialized when created and can never be re-seated; a pointer may be left null, assigned `nullptr`, and re-pointed with `p = &y`. A reference is used like the variable itself; a pointer needs `*` to dereference. The processor does not know about references: the compiler turns them into pointers, so they produce the same assembly.

## 3. Pass by value, by pointer, by reference: what is the difference, and why choose one?

```cpp run pin passing.cpp
// predict: Write the three lines printed.
#include <iostream>
using namespace std;

void byValue(int x)      { x++; }        // works on a copy
void byPointer(int* x)   { (*x)++; }     // works on the caller's box through its address
void byReference(int& x) { x++; }        // works on the caller's box by another name

int main()
{
    int a = 1, b = 1, c = 1;
    byValue(a);
    byPointer(&b);
    byReference(c);
    cout << "a = " << a << " b = " << b << " c = " << c << endl;
    return 0;
}
```

`byValue(a);` copies `a` into `x`, so the increment changes the copy and `a` stays 1. `byPointer(&b);` passes the address, and `(*x)++` changes `b`. `byReference(c);` passes the variable itself under a new name, and `c` changes. Choose by value for small things the function should not change (safe, and a copy of an `int` is free); by reference to avoid copying a large object or to let the function modify the caller's variable; by pointer when "no object" (`nullptr`) must be expressible, when working with arrays or C code, or when the pointee may need to change. `const Big& x` gives the efficiency of a reference with the safety of a value.

## 4. Static versus dynamic allocation

```cpp
int i;               // automatic (stack): allocated at the declaration,
int iArray[10];      // deallocated when the function returns

int* j = new int;            // dynamic (heap): allocated by you,
int* jArray = new int[10];   // exists after the function returns,
delete j;                    // deallocated only when you delete it
delete[] jArray;
```

Automatic memory is allocated and freed for you when the scope ends; its size is fixed at compile time. Dynamic memory is obtained with `new` and `new[]`, which return a pointer, and it lives until `delete` or `delete[]`: the programmer's responsibility, with no garbage collector. "Dynamic" means manual.

## 5. What is a memory leak? Prevent it; show a leak and the fix

A memory leak is heap memory that can never be freed because no pointer to it remains, and it stays allocated until the program exits. Prevention: every `new` has exactly one matching `delete` (keep a tally), delete before re-pointing a pointer, use `delete[]` for `new[]`, set deleted pointers to `nullptr`, and give owning classes a destructor that deletes their pointers.

```cpp run pin leak.cpp
// predict: Which block is never freed? Write the line printed.
#include <iostream>
using namespace std;

void leaky()
{
    int* i = new int{11};   // block A
    int* a = new int{99};   // block B
    i = a;                  // block A has no pointer left: LEAK
    delete i;               // frees block B
    cout << "leaky done" << endl;
}

int main()
{
    leaky();
    return 0;
}
```

```cpp diff leak.cpp, fixed (the underlined line in the exam answer is the added delete)
#include <iostream>
using namespace std;

void fixed()
{
    int* i = new int{11};   // block A
    int* a = new int{99};   // block B
    delete i;               // free block A first     <-- the fix
    i = a;                  // now safe to re-point
    delete i;               // frees block B
    a = nullptr;
    cout << "fixed done" << endl;
}

int main()
{
    fixed();
    return 0;
}
```

:::before Before: the leak
`i = a;` overwrites the only pointer to block A. `delete i;` then frees block B, the block both pointers now name. The 11 stays allocated with nothing pointing at it: a memory leak. In a function called in a loop, the leaked blocks accumulate.
:::

:::after After: the fix
The added `delete i;` runs while `i` still points at block A, so the 11 is freed. Then `i = a;` and the second `delete i;` free block B. Two `new`s, two `delete`s. In the written answer, underline the added `delete i;`.
:::

```quiz
[
  {
    "q": "Which of these invoke the copy constructor? (select all)",
    "options": ["`Complex copyC(c);`", "`Complex anotherCopyC = c;`", "passing a Complex to `void f(Complex x)`", "`anotherCopyC = c;`"],
    "answer": [0, 1, 2],
    "explain": "A new object built from an existing one: a declaration in either spelling, or a by-value parameter. Assignment to an existing object uses operator=."
  },
  {
    "q": "A reference must be initialized when created and cannot be re-seated; a pointer can be null and re-pointed.",
    "type": "tf",
    "answer": true,
    "explain": "The core difference. Both compile to the same instructions; references are a convenience for programmers."
  },
  {
    "q": "What does this print?",
    "code": "void byValue(int x) { x++; }\nvoid byPointer(int* x) { (*x)++; }\nvoid byReference(int& x) { x++; }\nint main() {\n    int a = 1, b = 1, c = 1;\n    byValue(a); byPointer(&b); byReference(c);\n    cout << a << b << c;\n}",
    "options": ["111", "122", "222", "112"],
    "answer": 1,
    "explain": "By value changes a copy (a stays 1); the pointer and the reference both reach the caller's variables (b and c become 2)."
  },
  {
    "q": "Why pass a large object as `const Big& x` rather than `Big x`?",
    "options": ["Because references are required for classes", "To avoid the copy constructor and destructor of a by-value parameter while still forbidding modification", "const makes it faster to read", "So it can be nullptr"],
    "answer": 1,
    "explain": "A reference avoids the copy; const keeps the by-value safety. A pointer is the choice when 'no object' must be expressible."
  },
  {
    "q": "`int arr[10];` inside a function versus `int* arr = new int[10];`. Which is true?",
    "options": ["Both are freed when the function returns", "The first is freed automatically at the end of the function; the second lives until `delete[] arr`", "The second is freed automatically; the first must be deleted", "Neither is ever freed"],
    "answer": 1,
    "explain": "Automatic (stack) versus dynamic (heap). Dynamic memory exists after the function returns and is the programmer's responsibility."
  },
  {
    "type": "spotbug",
    "q": "Click the line that causes the memory leak.",
    "code": "void leaky()\n{\n    int* i = new int{11};\n    int* a = new int{99};\n    i = a;\n    delete i;\n}",
    "answer": 5,
    "explain": "Line 5 overwrites the only pointer to the 11 block. The delete on line 6 frees the 99. Fix: delete i before line 5."
  },
  {
    "q": "Which set of habits prevents leaks? (select all)",
    "options": ["one delete for every new (keep a tally)", "delete before re-pointing a pointer that owns memory", "`delete[]` for memory from `new[]`", "rely on the garbage collector"],
    "answer": [0, 1, 2],
    "explain": "C++ has no garbage collector; the other three are the slide's advice, plus destructors in owning classes."
  }
]
```
