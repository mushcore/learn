---
title: The copy assignment operator and copy-and-swap
minutes: 22
---

`B = A;` replaces B's contents with a copy of A's. Both objects already exist, so no constructor runs; the **copy assignment operator**, `operator=`, does the work, and the compiler's version copies member by member. That is the shallow-copy problem of Week 3 again, and the canonical fix reuses the copy constructor and the destructor you already wrote: the **copy-and-swap idiom**.

## The canonical form

```cpp
MyClass& MyClass::operator=(MyClass rhs)   // a member function; rhs BY VALUE
{
    mySwap(*this, rhs);
    return *this;
}
```

Three things to notice. It is a member (assignment modifies the left-hand object). Its parameter is taken **by value**, so the copy constructor builds a local copy of the right-hand side before the body runs. And it returns `*this` by reference so that `C = B = A` chains. Then copy-and-swap in three steps:

1. Use the copy constructor to create a local copy of the original object (that is the by-value parameter).
2. Acquire the copied data with a swap function, swapping the old data with the new.
3. The temporary local copy is destroyed as the function ends, taking the old data with it and leaving the new data in the destination.

```widget
copy-swap
```

Step through it, then switch to the compiler-generated version to see the leak and the double free that the idiom prevents.

## What you need: a copy constructor, a destructor, a swap

```cpp run pin Example.cpp
// predict: Write everything printed. Which array is freed by the temporary `other`?
#include <iostream>
#include <utility>
using namespace std;

class Example {
private:
    size_t list_size;
    int* my_list;
public:
    Example(size_t size = 0)                     // default ctr
        : list_size{size}, my_list{size ? new int[size] : nullptr}
    {
        for (size_t i = 0; i < size; ++i) my_list[i] = 10 * (int)size + (int)i;
    }
    Example(const Example& other)                // copy ctr (deep)
        : list_size{other.list_size}, my_list{other.list_size ? new int[other.list_size] : nullptr}
    {
        for (size_t i = 0; i < list_size; ++i) my_list[i] = other.my_list[i];
        cout << "copy constructed a list of " << list_size << endl;
    }
    ~Example()                                   // destructor
    {
        cout << "destroying a list of " << list_size << endl;
        delete[] my_list;
    }
    void mySwap(Example& first, Example& second)
    {
        using std::swap;
        swap(first.list_size, second.list_size);   // use std::swap on each member
        swap(first.my_list, second.my_list);
    }
    Example& operator=(Example other)            // copy-and-swap
    {
        mySwap(*this, other);
        return *this;
    }
    void print() const
    {
        cout << "size " << list_size << ":";
        for (size_t i = 0; i < list_size; ++i) cout << " " << my_list[i];
        cout << endl;
    }
};

int main()
{
    Example A(3);
    Example B(2);
    B = A;
    A.print();
    B.print();
    return 0;
}
```

`Example& operator=(Example other)` receives `other` by value, and the message `copy constructed a list of 3` is the copy constructor building it from A. `mySwap(*this, other);` exchanges the two sizes and the two pointers with `std::swap` on each member, so B now owns the fresh copy of A's data and `other` holds B's old array of 2. When the function returns, `other` is destroyed: `destroying a list of 2` is B's old array being freed by the temporary. Then main ends and the two remaining lists of 3 are destroyed. Every array is freed exactly once, and no line of copying code was written twice.

The swap function must not throw and must swap **all** data members. Do not call `std::swap` on the entire object: it is implemented with the copy constructor and the copy assignment operator, which would call `mySwap`, which would call `std::swap`, another recursive compiler spiral.

:::quiz Copy constructor versus assignment operator
`Example C = A;` is the copy constructor (a new object). `B = A;` is the assignment operator (B already exists). Same result, different member function, and the copy-and-swap operator= uses the copy constructor internally.
:::

## The rule of three

A class that owns a resource through a pointer needs all three written by hand, because the compiler's versions copy the pointer:

| Special member | Compiler default | Your version |
|---|---|---|
| copy constructor | copies `my_list` (shared array) | `new int[size]` and copy the elements |
| destructor | does nothing | `delete[] my_list` |
| copy assignment | copies `my_list` (leaks the old array, shares the new one) | copy-and-swap |

Think of assignment as replacing the object's old state with a copy of some other object's state.

```quiz
[
  {
    "q": "Which statement calls the copy assignment operator?",
    "options": ["`Example B = A;`", "`Example B(A);`", "`B = A;` where B already exists", "`Example B;`"],
    "answer": 2,
    "explain": "Assignment needs an existing left-hand object. The first two create a new object: copy constructor."
  },
  {
    "q": "In the canonical `MyClass& operator=(MyClass rhs)`, why is `rhs` taken by value?",
    "options": ["References are not allowed in operators", "So the copy constructor makes the local copy for us: step 1 of copy-and-swap with no extra code", "To make it faster", "Because rhs is modified and returned"],
    "answer": 1,
    "explain": "Pass by value uses your copy constructor to create a copy named other. The body then only swaps."
  },
  {
    "q": "Put the copy-and-swap steps in order.",
    "type": "reorder",
    "lines": [
      "1. the by-value parameter is copy constructed from the right-hand side",
      "2. mySwap exchanges the old data with the copy's data",
      "3. return *this so assignments chain",
      "4. the temporary copy is destroyed, freeing the old data"
    ],
    "explain": "Copy (by the parameter), swap, return, and the destructor of the temporary cleans up the old state as the function ends."
  },
  {
    "q": "Copy-and-swap needs which three things? (select all)",
    "options": ["a working copy constructor", "a working destructor", "a swap function that swaps all data members and does not throw", "a virtual destructor"],
    "answer": [0, 1, 2],
    "explain": "The slide's list. A virtual destructor is an inheritance concern, unrelated to assignment."
  },
  {
    "q": "Why must you not use `std::swap` on the ENTIRE object inside `operator=`?",
    "options": ["std::swap is slow", "std::swap uses the copy constructor and the copy assignment operator, so it would call operator= again: a recursive spiral", "std::swap only works on ints", "It is not a member"],
    "answer": 1,
    "explain": "Swap the members individually (size, pointer) with std::swap; never the whole object."
  },
  {
    "q": "After `B = A;` with copy-and-swap, whose destructor frees B's OLD array?",
    "options": ["A's", "B's, at the end of main", "The temporary parameter `other`, when operator= returns", "Nobody: it leaks"],
    "answer": 2,
    "explain": "The swap put B's old data into other; other is destroyed when leaving function scope, taking the old data with it."
  },
  {
    "q": "The compiler-generated `operator=` on a class with an owned pointer member...",
    "options": ["deep copies the array", "copies the pointer: the left object's old array leaks and both objects then share one array (double free later)", "refuses to compile", "calls the destructor first"],
    "answer": 1,
    "explain": "Member-wise assignment. The old array has no pointer left to it, and the two destructors will delete the shared one twice."
  },
  {
    "q": "What does `return *this;` in operator= allow?",
    "options": ["Returning a copy", "Chained assignment: `C = B = A`", "Calling the destructor", "Nothing; it is required syntax"],
    "answer": 1,
    "explain": "B = A returns a reference to B, which becomes the right-hand side of C = ..."
  }
]
```
