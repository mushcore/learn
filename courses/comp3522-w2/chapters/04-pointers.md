---
title: Pointers, & and *, nullptr
minutes: 25
---

You already met pointers in C. C++ keeps them unchanged, and Week 2 uses them to explain the two things the quiz cares about most: why a function cannot change its arguments unless you hand it an address, and what a reference (next lesson) really is. This lesson rebuilds pointers from the instructor's "box with a nickname" picture, then works through every program from the slides and the videos.

## A variable is a box with a nickname

When you write `int num = 5;` you are saying two things: reserve some space in memory that can hold an integer, and give that space a name so you can find it again. The instructor draws it as a box labelled `num` containing `5`.

The box also has a real location, a **memory address**, written in hexadecimal, for example `0xffffcc10`. If C++ made you use that number every time, programming would be miserable, so `num` is just a nickname for the address. Two facts to keep in mind from the videos:

- The address is decided when the program runs. Run the same program twice and `num` may sit at `0xffffcc14` one time and `0xffffcc1c` the next. That is normal.
- The box can only hold what its type allows: an `int` box holds integers, nothing else.

## A pointer is a box that holds an address

A **pointer** is another box, but the only thing it can store is a memory address. The instructor's phrase: "pointers can only store memory addresses. Not strings, not chars, not numbers." Two symbols do all the work:

| Symbol | Where | Meaning |
|---|---|---|
| `*` after a type | in a declaration, `int* numPtr` | "numPtr is a pointer to an int" |
| `&` before a variable | in an expression, `&num` | "the address of num" |

The pointer's type must match the box it will point at: an `int*` points at `int` boxes. Here is the first video's program, runnable:

```cpp run pin pointerBasics.cpp
#include <iostream>
using namespace std;

int main()
{
    int num = 5;          // a box named num, holding 5
    int* numPtr = &num;   // a box that can hold only an ADDRESS; it gets the address of num

    cout << "num     = " << num << endl;
    cout << "numPtr  = " << numPtr << endl;   // the address stored inside numPtr
    cout << "&num    = " << &num << endl;     // the address of num: the same value
    cout << "&numPtr = " << &numPtr << endl;  // the pointer's own address (it is a box too)
    cout << "*numPtr = " << *numPtr << endl;  // follow the arrow: 5
    return 0;
}
```

Run it. The exact hex numbers will differ from the video and from your neighbour's laptop, but the pattern is always the same:

- `int* numPtr = &num;` creates a second box named `numPtr` and stores the address of `num` in it. In the diagram, that is an arrow from `numPtr` to `num`.
- `cout << "numPtr  = " << numPtr << endl;` prints what is *inside* the pointer box: an address such as `0x7ffcc14`. The next line, `&num`, prints the address *of* `num`, and the two values match. That match is what "numPtr points at num" means.
- `&numPtr` is different: the pointer is itself a box with its own address (in the video, `cc10` for the pointer versus `cc14` for `num`).
- `*numPtr` uses the star in an expression, which is the next idea.

:::quiz Two jobs for one star
In a declaration (`int* p`) the star means "p is a pointer". In an expression (`*p`) it means "the thing p points at". The quiz likes to ask which is which. A quick test: if there is a type immediately to the left of the star, it is declaring a pointer; otherwise it is dereferencing one.
:::

## Dereferencing: go where the arrow points and look in the box

The star in front of a pointer in an expression is called **dereferencing**. The instructor's words: "let's go to where I'm pointing at and then look at the value in the box." So `*c` reads the box `c` points at, and `*c = -4` *writes* into that box. This is the `pointers.cpp` program from the video, with `sizeof` added exactly as he did:

```widget
pointer-viz
{ "presets": false, "watch": ["a", "b", "c"], "title": "pointers.cpp, one statement at a time", "program": "#include <iostream>\nusing namespace std;\n\nint main()\n{\n    int a = 10;\n    int b = 7;\n    int* c = nullptr;   // an empty pointer\n\n    c = &a;             // c now holds the address of a\n    cout << *c << endl; // dereference: the value in a\n\n    *c = -4;            // write THROUGH the pointer: a changes\n    cout << a << endl;\n\n    c = &b;             // re-point c at b; a is untouched\n    cout << *c << endl;\n    cout << a << endl;\n    return 0;\n}" }
```

```cpp run pin pointers.cpp
// predict: Write every line printed. sizeof(int*) is 8 on the lab machines.
#include <iostream>
using namespace std;

int main()
{
    cout << "sizeof(int)  = " << sizeof(int) << endl;
    cout << "sizeof(int*) = " << sizeof(int*) << endl;

    int a = 10;
    int b = 7;
    int* c = nullptr;   // an empty pointer: points at nothing yet

    c = &a;             // c now holds the address of a
    cout << "*c = " << *c << endl;          // dereference: the value in a
    cout << boolalpha << (c == &a) << endl; // true: c points at a

    *c = -4;            // write THROUGH the pointer: this changes a
    cout << "a = " << a << endl;

    c = &b;             // re-point c at b; a is untouched
    cout << "*c = " << *c << endl;
    cout << (c == &a) << " " << (c == &b) << endl;
    cout << "a = " << a << endl;
    return 0;
}
```

Predict the output, then run it and step the widget above at the same time.

1. `sizeof(int)` is 4 bytes and `sizeof(int*)` is 8 bytes on a 64-bit machine. The video makes this point on purpose: a pointer is a different type from an int, and every pointer, whatever it points at, is 8 bytes.
2. `c = &a;` puts the address of `a` into `c`. Printing `*c` follows the arrow and shows `10`. The pointer's own address never changes when you do this; only its contents do.
3. `*c = -4;` is, in the instructor's words, "equivalent to me just saying a = -4". The pointer is unchanged; the box it points at now holds -4.
4. `c = &b;` re-points `c`. The video shows the value inside `c` changing from `cc1c` to `cc18` while `&c` stays `cc10`. Now `*c` is `7`, and `a` is still `-4` because nothing wrote to it.

## nullptr: a pointer that points at nothing

A pointer you have not assigned holds garbage, and dereferencing garbage is a crash waiting to happen. The slides say it plainly: "Beware of null pointers (assign empty pointers to `nullptr` as much as possible!)." A null pointer can be *tested*; a garbage pointer cannot.

```cpp run
#include <iostream>
using namespace std;

int main()
{
    int* p = nullptr;            // points at nothing, on purpose
    if (p == nullptr) {          // the same test as: if (!p)
        cout << "p points at nothing yet" << endl;
    }

    int x = 42;
    p = &x;
    if (p) {                     // a non-null pointer counts as true
        cout << "p now points at " << *p << endl;
    }
    // cout << *nullptr_pointer;  // dereferencing a null pointer = crash (segmentation fault)
    return 0;
}
```

:::danger Never dereference nullptr
`*p` when `p` is `nullptr` is undefined behaviour; in practice the program dies with a segmentation fault. Test first, dereference second. The check `if (p)` works because a null pointer converts to `false` and every other pointer converts to `true`.
:::

## The four ways a pointer gets a value

From the slides, "to create a pointer, we need to assign to nullptr, an existing pointer, use & (address of) or new (memory allocation)":

```cpp
int num = 99;
int* numPtr = nullptr;        // 1. nullptr: points at nothing (safe to test)
numPtr = &num;                // 2. & address-of: numPtr points at num

int* numPtr2 = numPtr;        // 3. copy another pointer: numPtr2 ALSO points at num
int* numPtr3 = &num;          //    (address-of again)
int* numPtr4 = new int(123);  // 4. new: a fresh box on the heap (lesson 9)
```

Assignment to a pointer changes *where it points*, never the value in the box it pointed at before. Copying a pointer (`numPtr2 = numPtr`) makes two arrows to the same box; after that, `*numPtr2 = 7` also changes what `*numPtr` reads.

## Pass by value: the swap that does not swap

The slides open the pointer section with a question. Will this function swap `first` and `second`?

```widget
pointer-viz
{ "preset": "swap by value (does it work?)", "presets": false, "title": "Call by value: watch the copies" }
```

```cpp run pin swapByValue.cpp
// predict: What does the program print?
#include <iostream>
using namespace std;

void swap(int arg1, int arg2)
{
    int temp{arg1};
    arg1 = arg2;
    arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};

    swap(first, second);
    // does first = 2526 and second = 3522?
    cout << first << " " << second << endl;
    return 0;
}
```

It does not. Step the widget and watch the frame for `swap` appear: `arg1` and `arg2` are brand-new boxes holding *copies* of 3522 and 2526. That is what **call by value** means, and it is the default for every function call in C++. The three lines `int temp{arg1};`, `arg1 = arg2;` and `arg2 = temp;` swap the two copies perfectly, and then the frame is destroyed. Back in `main`, `first` and `second` were never touched, so the program prints `3522 2526`.

:::quiz Call by value is the default
Quiz phrasing to expect: "By default, C++ passes function arguments by value." True. The callee works on copies; changes to a parameter do not reach the caller.
:::

## Pass a pointer: the swap that works

If the function needs to reach the originals, hand it their addresses:

```widget
pointer-viz
{ "preset": "swap with pointers", "presets": false, "title": "Pointer parameters: copies of addresses, arrows to the originals" }
```

```cpp run pin swapPointers.cpp
// predict: What does the program print?
#include <iostream>
using namespace std;

void swap(int* arg1, int* arg2)
{
    int temp{*arg1};
    *arg1 = *arg2;
    *arg2 = temp;
}

int main()
{
    int first{3522};
    int second{2526};

    swap(&first, &second);
    cout << first << " " << second << endl;
    return 0;
}
```

Call by value still happens: `arg1` receives a copy of `&first`. But a copy of an address still points at the same box, so the arrows from the `swap` frame land on `first` and `second` in `main`. Inside the function every access goes through the star: `int temp{*arg1};` reads `first` (3522), `*arg1 = *arg2;` writes 2526 into `first`, and `*arg2 = temp;` writes 3522 into `second`. The call site has to pass addresses because "pointers can only be assigned memory addresses; they can't be assigned regular values", so `swap(first, second)` would not even compile against this version.

The output is `2526 3522`.

## Why pointers: changing the original through a function

The Pointer Basics videos make the same point with a smaller program. `addToNum(num)` receives a copy, increments the copy, and `num` stays 5. Pass a pointer instead and `(*numPtrCopy)++` reaches the original:

```widget
pointer-viz
{ "presets": false, "watch": ["num"], "title": "Pointer Basics 3: copy versus pointer", "program": "#include <iostream>\nusing namespace std;\n\nvoid addToNumByValue(int numCopy)\n{\n    numCopy++;              // changes the copy only\n    cout << numCopy << endl;\n}\n\nvoid addToNumByPointer(int* numPtrCopy)\n{\n    (*numPtrCopy)++;        // go where it points, add one there\n}\n\nint main()\n{\n    int num = 5;\n    addToNumByValue(num);\n    cout << num << endl;    // still 5\n\n    int* numPtr = &num;\n    addToNumByPointer(numPtr);\n    cout << num << endl;    // 6\n    return 0;\n}" }
```

```cpp run pin addToNum.cpp
// predict: Three numbers are printed, one per line.
#include <iostream>
using namespace std;

void addToNumByValue(int numCopy)
{
    numCopy++;                     // changes the copy only
    cout << numCopy << endl;       // 6, inside the function
}

void addToNumByPointer(int* numPtrCopy)
{
    (*numPtrCopy)++;               // go where it points, add one there
}

int main()
{
    int num = 5;
    addToNumByValue(num);
    cout << num << endl;           // still 5

    int* numPtr = &num;
    addToNumByPointer(numPtr);
    cout << num << endl;           // 6
    return 0;
}
```

Read `(*numPtrCopy)++;` carefully: the parentheses force the dereference first, then the increment, so it adds one to the box `numPtrCopy` points at, which is `num`. Without the parentheses, `*numPtrCopy++` would increment the pointer (move it to the next int in memory) and then dereference, which is not what anyone wants. The video overloads both functions under the name `addToNum`; they are named separately here so the widget can tell them apart.

The output is `6`, `5`, `6`: the copy became 6 inside the first function, `num` was still 5 afterwards, and the pointer version changed it to 6.

## Arrays are pointers in disguise

One more example from the "4 - Pointers" video. Passing an array to a function looks like passing by value, but the array "gets converted into a pointer" to the original. The instructor proves it with `sizeof`: 16 bytes in `main` (four ints), 8 bytes inside the function (one pointer).

```cpp run pin arraySwap.cpp
// predict: Three lines. The last line is the array after swapping elements 0 and 3.
#include <iostream>
using namespace std;

void swapElements(int* array, int i, int j)   // an array argument arrives as a pointer
{
    int temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

int main()
{
    int numbers[] = {1, 2, 3, 4};
    cout << "sizeof(numbers) = " << sizeof(numbers) << " bytes" << endl;  // 16: four ints
    cout << "sizeof(int*)    = " << sizeof(int*) << " bytes" << endl;     // 8: what the function sees

    swapElements(numbers, 0, 3);
    for (int i = 0; i < 4; i++) {
        cout << numbers[i] << (i < 3 ? " " : "\n");
    }
    return 0;
}
```

`swapElements(numbers, 0, 3);` passes the array name, which decays to the address of its first element, so inside the function `array[i] = array[j];` writes into the caller's array. Square brackets on a pointer are a second way to dereference (`array[i]` is `*(array + i)`). The slides list both: "to access something pointed to by a pointer (dereference), we use `*` or `[]`."

The output ends with `4 2 3 1`.

## Rules to remember

| Rule | Slide wording |
|---|---|
| A pointer stores only addresses | assign `nullptr`, an existing pointer, `&variable`, or `new` |
| Assignment to a pointer | "makes the pointer point to a new address" |
| Dereference | `*ptr` or `ptr[i]` |
| Empty pointers | set them to `nullptr` so you can test them |
| Function arguments | passed by value (copies) unless you pass an address |

```quiz
[
  {
    "q": "What is the only kind of value an `int*` variable can hold?",
    "options": ["Any integer", "A memory address (of an int)", "A character string", "A floating-point number"],
    "answer": 1,
    "explain": "The instructor's rule: pointers can only store memory addresses. `int* p = 5;` is a type error; `int* p = &x;` is correct."
  },
  {
    "q": "`int x = 5;  int* p = x;` compiles.",
    "type": "tf",
    "answer": false,
    "explain": "`x` is an int, not an address. g++ reports an invalid conversion from int to int*. You need `&x`."
  },
  {
    "type": "fill",
    "q": "Fill in the operator that makes `p` point at `x`.",
    "code": "int x = 5;\nint* p = ___x;",
    "answer": ["&"],
    "explain": "`&x` is the address-of operator: it produces the address of `x`, which is the only thing a pointer can store."
  },
  {
    "q": "What does this print?",
    "code": "int a = 10;\nint* c = &a;\n*c = -4;\ncout << a;",
    "options": ["10", "-4", "the address of a", "it does not compile"],
    "answer": 1,
    "explain": "`*c = -4` writes through the pointer into the box c points at, which is `a`. The video's phrase: equivalent to `a = -4`."
  },
  {
    "q": "What does this print?",
    "code": "int x = 5;\nint* p = &x;\nint* q = p;\n*q = 9;\ncout << x << \" \" << *p;",
    "options": ["5 5", "9 9", "5 9", "9 5"],
    "answer": 1,
    "explain": "`q = p` copies the address, so both pointers point at `x`. Writing through `q` changes `x`, and `*p` reads that same box: 9 9."
  },
  {
    "q": "On the lab machines (64-bit), which statement about sizes is correct?",
    "options": ["`sizeof(int*)` is 4, the same as `sizeof(int)`", "`sizeof(int*)` is 8 and `sizeof(int)` is 4", "`sizeof(int*)` depends on the value stored in the pointer", "`sizeof(int*)` is 16"],
    "answer": 1,
    "explain": "Every pointer is 8 bytes on a 64-bit machine, whatever it points at; an int is 4. The video prints both to show a pointer is a different type."
  },
  {
    "q": "`void swap(int arg1, int arg2)` fails to swap the caller's variables because...",
    "options": ["the temporary variable is declared with braces", "C++ passes arguments by value, so arg1 and arg2 are copies", "int cannot be swapped without a library function", "the function has no return value"],
    "answer": 1,
    "explain": "Call by value: the function receives copies in its own stack frame, swaps the copies, and the frame is destroyed. `first` and `second` in main never change."
  },
  {
    "q": "Which calls change `first` and `second` in the caller? (select all)",
    "options": ["`swap(first, second)` with `void swap(int, int)`", "`swap(&first, &second)` with `void swap(int*, int*)`", "`swap(first, second)` with `void swap(int&, int&)`", "`swap(*first, *second)` with `void swap(int, int)`"],
    "answer": [1, 2],
    "explain": "Passing addresses to pointer parameters, or passing variables to reference parameters, gives the function a way to reach the originals. The by-value version works on copies, and `*first` on a plain int does not even compile."
  },
  {
    "q": "What happens when you dereference a pointer whose value is `nullptr`?",
    "options": ["You get 0", "You get the address 0 printed", "Undefined behaviour, in practice a crash (segmentation fault)", "The pointer is automatically re-pointed at a new int"],
    "answer": 2,
    "explain": "There is no box at address 0 to look in. Always test (`if (p)`) before dereferencing a pointer that might be null."
  },
  {
    "q": "An array passed to a function is copied element by element into the parameter.",
    "type": "tf",
    "answer": false,
    "explain": "The array is converted to a pointer to its first element. Inside the function `sizeof` reports 8 (a pointer), and changes through `array[i]` reach the caller's array."
  },
  {
    "type": "spotbug",
    "q": "Click the line that fails to compile.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    int x = 5;\n    int* p = x;\n    cout << *p << endl;\n    return 0;\n}",
    "answer": 6,
    "explain": "Line 6 tries to store the int value 5 in a pointer. A pointer holds only addresses, so it must be `int* p = &x;`."
  },
  {
    "type": "match",
    "q": "Match each piece of code to what it means.",
    "pairs": [
      ["`int* p`", "declare p as a pointer to an int"],
      ["`&x`", "the address of x"],
      ["`*p`", "the value in the box p points at"],
      ["`p = &y`", "make p point at y instead"],
      ["`p = nullptr`", "make p point at nothing"],
      ["`(*p)++`", "add one to the box p points at"]
    ],
    "explain": "Declaration star = pointer; expression star = dereference; ampersand in an expression = address-of. Assigning to the pointer changes where it points; assigning through `*p` changes the pointed-at box."
  }
]
```
