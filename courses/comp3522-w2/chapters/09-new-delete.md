---
title: new, delete and memory leaks
minutes: 20
---

Everything you have declared so far, `int x`, `string s`, `int arr[10]`, was created for you when the function started and destroyed for you when it returned. This lesson is about the other kind of memory: the kind **you** ask for with `new`, and the kind you must give back with `delete`. The slides call it **dynamic memory management**, and the instructor's first warning is about the name: *"dynamic to me means automatic, but what dynamic memory management actually refers to is manual memory management."* It is up to you, the coder.

## Why manual memory exists

Manual management lets you obtain more memory when you need it and release it when you do not. Java has a garbage collector cleaning up in the background, which is convenient but unpredictable: you never know when it will run. In C++ nothing runs in the background. You decide exactly when memory comes and goes, which is more efficient and more dangerous.

The slides recap what you did in C, where there was no language support at all, only four library functions from `stdlib.h`:

| C function | Does |
|---|---|
| `malloc()` | allocates the requested number of bytes and returns a pointer to the first byte |
| `calloc()` | allocates space for an array of elements, initializes it to zero, returns a pointer |
| `realloc()` | changes the size of previously allocated space |
| `free()` | deallocates previously allocated space |

In C++ it is much easier. There are two **operators** for allocating memory: `new` and `new[]`. Both **return a pointer** to the memory that was just allocated. This is why the pointer lessons came first: you cannot use dynamic memory without pointers.

## The `new` operator, three ways

```cpp run pin newForms.cpp
// predict: Write the three values printed.
#include <iostream>
using namespace std;

int main()
{
    int * my_pointer = nullptr;
    my_pointer = new int { 3522 };
    cout << *my_pointer << endl;

    int * second = new int;
    *second = 3522;
    cout << *second << endl;

    int * third = new int{3522};
    cout << *third << endl;

    delete my_pointer;
    delete second;
    delete third;
    return 0;
}
```

The three spellings from the slides all end up in the same place:

1. `int * my_pointer = nullptr;` followed by `my_pointer = new int { 3522 };`. Declare the pointer safely as `nullptr` first, then point it at a freshly allocated `int` holding 3522. The slides say `my_pointer` **refers to a data object**: not an instance of a class, just a nameless box of data on the heap.
2. `int * second = new int;` allocates an uninitialized `int`, and `*second = 3522;` writes into it through the pointer.
3. `int * third = new int{3522};` does both in one line.

Notice that the box has **no name**. The only way to reach it is through the pointer, which is why losing the pointer is the disaster in the leak section below. The three `delete` lines at the end are not optional; we get to them shortly.

Step through the same statements and watch the boxes appear on the heap:

```widget
pointer-viz
{ "preset": "new / delete / new[]" }
```

## `new[]` for arrays

```cpp run pin newArray.cpp
// predict: What does the loop print?
#include <iostream>
using namespace std;

int main()
{
    int * my_pointer;
    my_pointer = new int [5];
    for (int i = 0; i < 5; ++i) {
        my_pointer[i] = i;
    }
    for (int i = 0; i < 5; ++i) {
        cout << my_pointer[i] << " ";
    }
    cout << endl;
    delete[] my_pointer;
    return 0;
}
```

`my_pointer = new int [5];` allocates room for five ints in one block and returns a pointer to the first one. Because array and pointer notation are the same, `my_pointer[i] = i;` indexes the block exactly as if `my_pointer` were an array. The block is freed with `delete[] my_pointer;`, the square-bracket form, because it was allocated with the square-bracket form. Mixing them (`delete` on a `new[]` block, or `delete[]` on a `new` block) is undefined behaviour.

## Stack versus heap: what is the difference?

The slide puts the two side by side:

```cpp
int i;
int iArray[10];
```

- Memory is **automatically** allocated and deallocated.
- Memory is deallocated when the function returns/completes.

```cpp
int * i = new int;
int * iArray = new int[10];
```

- It is the **programmer's responsibility** to deallocate the memory when it is no longer needed.
- **Memory leaks** occur if memory is not deallocated. The memory exists even after the function returns/completes.

That second bullet is both the feature and the danger. A `new` block survives the function that created it, which is how you build data structures that outlive a call. But nothing ever cleans it up for you: *"there is no garbage collector in C++."*

## `delete` and `delete[]`

```cpp
int *i = new int;
int *iArray = new int[10];

...//some code

delete i;        //free allocated memory
delete[] iArray; // freed block of allocated memory
```

Two things the video stresses:

- `delete i;` **does not delete the pointer `i`.** It frees the data object that `i` points at. `i` still exists, still holds the old address, and is now **dangling**: using `*i` after the delete is undefined behaviour. Many programmers write `i = nullptr;` right after a delete so that a later mistake fails loudly instead of quietly.
- The instructor's bookkeeping trick: *"whenever you have the `new` keyword written somewhere, remember you always need a corresponding `delete` somewhere else."* If the count of `new`s and `delete`s in your program does not balance, there is a leak or a double free somewhere.

```cpp run pin deleteBasics.cpp
// predict: Write the two lines printed.
#include <iostream>
using namespace std;

int main()
{
    int *i = new int{11};
    cout << "*i is " << *i << endl;
    delete i;          // frees the 11, not the pointer
    i = nullptr;       // make the dangling pointer safe to test
    if (i == nullptr) {
        cout << "i no longer points at anything" << endl;
    }
    delete i;          // deleting nullptr is allowed and does nothing
    return 0;
}
```

`delete i;          // frees the 11, not the pointer` gives the block back. The line `i = nullptr;` is the safety habit: a null pointer can be tested, and the last line shows that `delete` on `nullptr` is explicitly allowed and does nothing, so you can never double-free through a pointer you reset.

## Anatomy of a memory leak

The slides walk this through in five pictures. Step through the same program; the heap addresses `0xffff000a` and `0xffff000b` are the slide's.

```widget
pointer-viz
{ "preset": "memory leak" }
```

```cpp run pin leak.cpp
// predict: Write the one line printed (two numbers). While you trace it, work out which heap box can never be freed.
#include <iostream>
using namespace std;

int main()
{
    int *i = new int{11};
    int *a = new int{99};
    i = a;      // creates a memory leak
    cout << *i << " " << *a << endl;
    delete i;   // frees the 99 block (the one both pointers point at)
    // THIS PROGRAM LEAKS ON PURPOSE: the 11 block is never freed
    return 0;
}
```

1. `int *i = new int{11};` allocates a box at `0xffff000a` holding 11; `i` points at it.
2. `int *a = new int{99};` allocates a second box at `0xffff000b` holding 99; `a` points at it.
3. `i = a;      // creates a memory leak` copies the **address** in `a` into `i`. Both pointers now point at the 99 box. Nothing points at the 11 box any more. The instructor: *"that chunk of memory is now just floating around in your RAM, and there's no way for us to get a reference or pointer back to it to delete it."*
4. `delete i;   // frees the 99 block (the one both pointers point at)` releases the box that `i` currently points at, the 99. Now `a` is dangling, and the 11 box is still allocated with no way to reach it. **That is the memory leak.** The program prints `99 99` and ends with one `int`, the 11, lost forever (until the OS reclaims everything at exit).

In a program that does this once, you will never notice. In a loop, or a server that runs for weeks, the lost blocks add up until the process runs out of memory.

## The fix: delete before you re-point

```widget
pointer-viz
{ "preset": "leak fixed" }
```

```cpp run pin leakFixed.cpp
// predict: Write the one line printed. Then count: how many blocks are freed, and by which lines?
#include <iostream>
using namespace std;

int main()
{
    int *i = new int{11};
    int *a = new int{99};
    delete i;   // deletes memory i is pointing at (the 11)
    i = a;      // i can now safely point to something else
    delete i;   // deletes the 99; a is now dangling
    a = nullptr;
    cout << "both blocks freed" << endl;
    return 0;
}
```

The order is everything. `delete i;   // deletes memory i is pointing at (the 11)` runs **before** `i` is moved, so the 11 box is freed while there is still a pointer to it. Then `i = a;      // i can now safely point to something else` makes both pointers point at the 99, and the second `delete i;` frees that. Two `new`s, two `delete`s: the tally balances and the diagram ends with an empty heap.

:::quiz "delete i deletes the pointer i"
False, and it is a favourite true/false. `delete` frees the **data object the pointer points at**. The pointer variable itself lives on the stack, keeps its old address (dangling), and is destroyed only when the function returns.
:::

## What if there is not enough memory?

From the lecture video: if the system cannot give you the memory, `new` **throws an exception** (`std::bad_alloc`). If you would rather test for failure than handle an exception, ask for the `nothrow` version, which returns `nullptr` instead:

```cpp run pin nothrow.cpp
// predict: Does the allocation succeed here? Write the line printed.
#include <iostream>
#include <new>
using namespace std;

int main()
{
    int * my_pointer = new (nothrow) int[100];
    if (my_pointer == nullptr) {
        cout << "out of memory" << endl;
        return 1;
    }
    my_pointer[0] = 42;
    cout << "got the block, first element " << my_pointer[0] << endl;
    delete[] my_pointer;
    return 0;
}
```

`int * my_pointer = new (nothrow) int[100];` passes the `nothrow` object (from the `<new>` header) to `new`, and the `if (my_pointer == nullptr)` check is the whole point: a failed allocation now shows up as a null pointer you can test, rather than an exception. For 100 ints the allocation succeeds and the program prints the first element. Exceptions in general come later in the course; for now, know that this option exists and why.

## Summary table

| | Stack (`int i;`) | Heap (`int * i = new int;`) |
|---|---|---|
| Created by | the declaration | `new` / `new[]` |
| Destroyed by | the function returning | `delete` / `delete[]` (you) |
| Name | has one | none; reachable only through a pointer |
| Survives the function? | no | yes, until deleted |
| Forgetting to free | impossible | **memory leak**, no garbage collector |

```quiz
[
  {
    "q": "\"Dynamic memory management\" in C++ means...",
    "options": ["memory is cleaned up automatically by a garbage collector", "manual memory management: the programmer allocates with new and must release with delete", "memory is allocated at compile time", "only arrays can be resized"],
    "answer": 1,
    "explain": "The instructor's warning: dynamic sounds automatic, but it means MANUAL. There is no garbage collector in C++."
  },
  {
    "q": "What does the `new` operator return?",
    "options": ["the allocated object by value", "a reference to the allocated object", "a pointer to the memory that was just allocated", "the number of bytes allocated"],
    "answer": 2,
    "explain": "new (and new[]) return a pointer to the freshly allocated memory; that pointer is your only handle on the nameless data object."
  },
  {
    "q": "Which of these correctly create an `int` on the heap holding 3522? (select all)",
    "options": ["`int * p = new int{3522};`", "`int * p = new int; *p = 3522;`", "`int * p = nullptr; p = new int { 3522 };`", "`int p = new int{3522};`"],
    "answer": [0, 1, 2],
    "explain": "The first three are the slide's three forms. The last does not compile: new returns an int*, which cannot be stored in a plain int."
  },
  {
    "q": "Which C library functions handled dynamic memory before C++? (select all)",
    "options": ["`malloc()`", "`calloc()`", "`realloc()`", "`free()`"],
    "answer": [0, 1, 2, 3],
    "explain": "All four, from stdlib.h: malloc allocates bytes, calloc allocates a zeroed array, realloc resizes, free deallocates. C++ replaces them with new/new[] and delete/delete[]."
  },
  {
    "q": "`int iArray[10];` declared inside a function is deallocated when the function returns.",
    "type": "tf",
    "answer": true,
    "explain": "Stack memory is automatically allocated and deallocated; it goes away when the function completes. Only new'd memory survives, and only the programmer can free it."
  },
  {
    "q": "`delete i;` deletes the pointer variable `i`.",
    "type": "tf",
    "answer": false,
    "explain": "delete frees the data object that i points at. i itself stays on the stack with a now-dangling address; that is why people set it to nullptr afterwards."
  },
  {
    "q": "Which operator must free memory that was allocated with `new int[10]`?",
    "options": ["`delete`", "`delete[]`", "`free()`", "either delete or delete[]"],
    "answer": 1,
    "explain": "new[] pairs with delete[]. Using plain delete on an array block is undefined behaviour, and free() is the C function for malloc'd memory."
  },
  {
    "q": "After these three lines, which statement is true?",
    "code": "int *i = new int{11};\nint *a = new int{99};\ni = a; // creates a memory leak",
    "options": ["the 99 block is leaked", "the 11 block is leaked: nothing points at it any more, so it can never be deleted", "both blocks are freed", "i still points at the 11"],
    "answer": 1,
    "explain": "i = a copies a's address into i; both pointers now point at the 99 box and the 11 box has no pointer left. With no way to reach it, it can never be deleted: MEMORY LEAK."
  },
  {
    "q": "Put the statements in the order that frees both blocks with no leak and no double free.",
    "type": "reorder",
    "lines": [
      "int *i = new int{11};",
      "int *a = new int{99};",
      "delete i;   // free the 11 first",
      "i = a;      // now safe to re-point",
      "delete i;   // frees the 99"
    ],
    "explain": "Delete what i points at BEFORE moving i; then i = a; then delete once more to free the 99. Two news, two deletes."
  },
  {
    "q": "Why does the instructor suggest counting your `new`s and `delete`s?",
    "options": ["the compiler requires equal counts", "every new needs a corresponding delete; an imbalance means a leak or a double free", "delete is only legal once per program", "new is slower than delete"],
    "answer": 1,
    "explain": "It is a bookkeeping habit: keep a tally, and if the numbers do not match there is a memory mismatch somewhere."
  },
  {
    "q": "What happens when `new` cannot get the memory it asks for, by default?",
    "options": ["it returns nullptr", "it returns 0", "it throws an exception", "the program silently continues with garbage"],
    "answer": 2,
    "explain": "By default new throws (std::bad_alloc). new (nothrow) from <new> is the variant that returns nullptr so you can test for failure with an if."
  },
  {
    "type": "spotbug",
    "q": "Click the line that turns this program into a memory leak.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    int *i = new int{11};\n    int *a = new int{99};\n    i = a;\n    delete i;\n    return 0;\n}",
    "answer": 7,
    "explain": "Line 7: i = a; overwrites the only pointer to the 11 block. The delete on line 8 frees the 99 (what i now points at); the 11 is lost. Deleting i before line 7 would fix it."
  }
]
```
