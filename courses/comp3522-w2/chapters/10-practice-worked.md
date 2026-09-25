---
title: Pointers & references practice, worked
minutes: 15
---

The Learning Hub has a two-page "Pointer and Reference Activity" (14 points: 7 blanks, then 3 + 1 + 1 + 2 for the second program). The video ends by saying it is not marked, but "pointers and references will come back over and over for this entire course", and Quiz 2 draws from it. Do each part on paper first, then check here.

## Part 1: fill in x and y after every line (7 points)

The sheet's program, with a print after each statement so you can run it. Write down `x` and `y` after every line before you run anything:

```widget
pointer-viz
{ "preset": "Practice activity (fill in x and y)", "presets": false, "title": "The activity program, one line at a time (watch x and y)" }
```

```cpp run pin practice.cpp
// predict: Six lines, each "x y".
#include <iostream>
using namespace std;

int main()
{
    int x = 5;
    int y = 15;
    int * p1;
    int * p2;
    p1 = &x;        cout << x << " " << y << endl;   // x = ____; y = ____
    p2 = &y;        cout << x << " " << y << endl;   // x = ____; y = ____
    *p1 = 5;        cout << x << " " << y << endl;   // x = ____; y = ____
    *p1 = *p2;      cout << x << " " << y << endl;   // x = ____; y = ____
    p2 = p1;        cout << x << " " << y << endl;   // x = ____; y = ____
    *p1 = *p2 + 10; cout << x << " " << y << endl;   // x = ____; y = ____
    return 0;
}
```

The answers, with the reason for each:

| Line | x | y | Why |
|---|---|---|---|
| `p1 = &x;` | 5 | 15 | only the pointer changed: p1 now holds the address of x |
| `p2 = &y;` | 5 | 15 | p2 now holds the address of y; nothing was written to x or y |
| `*p1 = 5;` | 5 | 15 | writes 5 into the box p1 points at, which is x; x was already 5 |
| `*p1 = *p2;` | 15 | 15 | reads y through p2 (15), writes it into x through p1 |
| `p2 = p1;` | 15 | 15 | copies the address in p1 into p2: both point at x now; values untouched |
| `*p1 = *p2 + 10;` | 25 | 15 | *p2 is x (15), plus 10 is 25, written into x; y is never touched again |

Two habits from the videos make this mechanical. First, ask of every line "is the pointer changing, or is the box it points at changing?" Lines with `p1 = ...` or `p2 = ...` move arrows; lines starting with `*p1 = ...` write into a box. Second, before `p2 = p1;`, draw the arrows: after it, both arrows land on `x`, which is why `*p2` on the last line reads `x`, not `y`.

## Part 2: test(int& x, int y, int* z)

The second program mixes all three parameter kinds. Predict the output before you run it:

```widget
pointer-viz
{ "preset": "test(int& x, int y, int* z)", "presets": false, "title": "Reference, copy, pointer: which ones reach main?" }
```

```cpp run pin test.cpp
// predict: One line with three numbers separated by spaces.
#include <iostream>
using namespace std;

void test( int& x, int y, int* z )
{
    x++;
    y++;
    (*z)++;
}

int main(){
    int a = 7;
    int b = 6;
    int* c = &b;
    test(a,b,c);
    cout << a << " " << b << " " << *c << endl;
    return 0;
}
```

The output is `8 7 7`. Here is the trace:

- `x++;` increments through the reference. `x` is a nickname for `a`, so `a` becomes 8.
- `y++;` increments a copy. `y` received the value 6 from `b`; the copy becomes 7 and is thrown away when `test` returns. `b` is still 6 at this moment.
- `(*z)++;` dereferences first (parentheses), then increments. `z` holds the address of `b` (because `int* c = &b;` and `c` was passed), so `b` becomes 7.
- Back in `main`: `a` is 8, `b` is 7, and `*c` reads `b` again, so 7.

The common wrong answer is `8 6 7`: it forgets that `z` points at `b`, so the pointer line changes `b` as surely as the reference line changes `a`. The by-value parameter is the only one that leaves its argument alone.

## What changes if you flip the parameters? (3 points)

The sheet asks you to try changing arguments from pass-by-reference to pass-by-value and back. Every variant below is the same body with a different parameter list:

```cpp run pin testVariants.cpp
// predict: Four lines of three numbers.
#include <iostream>
using namespace std;

void original(int& x, int y, int* z)    { x++; y++; (*z)++; }
void xByValue(int x, int y, int* z)     { x++; y++; (*z)++; }
void yByRef(int& x, int& y, int* z)     { x++; y++; (*z)++; }
void bothFlipped(int x, int& y, int* z) { x++; y++; (*z)++; }

int main()
{
    int a = 7;
    int b = 6;
    int* c = &b;

    original(a, b, c);     cout << a << " " << b << " " << *c << endl;
    a = 7; b = 6;
    xByValue(a, b, c);     cout << a << " " << b << " " << *c << endl;
    a = 7; b = 6;
    yByRef(a, b, c);       cout << a << " " << b << " " << *c << endl;
    a = 7; b = 6;
    bothFlipped(a, b, c);  cout << a << " " << b << " " << *c << endl;
    return 0;
}
```

| Variant | Parameter list | Output | What happened |
|---|---|---|---|
| original | `int& x, int y, int* z` | `8 7 7` | a through the reference, b through the pointer |
| `xByValue` | `int x, int y, int* z` | `7 7 7` | x is now a copy: a stays 7; b still changes through z |
| `yByRef` | `int& x, int& y, int* z` | `8 8 8` | y is now b itself: `y++` and `(*z)++` both hit b, so b goes 6, 7, 8 |
| `bothFlipped` | `int x, int& y, int* z` | `7 8 8` | a untouched, b incremented twice |

Notice the call site never changes: `original(a, b, c)` and `yByRef(a, b, c)` look identical. Whether `b` is copied or aliased is decided entirely by the parameter list, which is why you must read the function signature before predicting anything.

## What if you make b a pointer? (1 point)

Change `int b = 6;` to a pointer, say `int* b = &something;`. Then `int* c = &b;` no longer compiles as written: `&b` is the address of a pointer, an `int**`, which cannot be stored in an `int*`. And `test(a, b, c)` fails too, because `b` is now an `int*` being passed to the plain `int y`. g++ reports invalid conversions for both. To make it work you have to dereference: `test(a, *b, b)` passes the value `b` points at for `y` and the pointer itself for `z`. The lesson: a pointer and the thing it points at are different types, and the compiler will not convert between them for you.

## What if you make y a pointer? (1 point)

Change the parameter to `int* y`. Two things follow:

- The call must pass an address: `test(a, &b, c)`. Passing `b` itself is a compile error (int to int*).
- `y++;` now increments the *pointer*, not the value. It moves `y` to the next int-sized slot in memory and never touches `b`. Nothing is dereferenced, so nothing crashes, but nothing useful happens either. To add one to `b` you would write `(*y)++`, and then `b` would be incremented twice (once by `y`, once by `z`), giving `8 8 8`.

This is the same distinction as `*numPtrCopy++` versus `(*numPtrCopy)++` in the pointers lesson: the parentheses decide whether you move the arrow or change the box.

## The two ampersands in the underlined code (2 points)

The sheet underlines `int& x` in the signature and `&b` in `int* c = &b;`.

- In `void test( int& x, ... )`, the `&` follows a type. It declares `x` as a **reference**: a nickname for whatever variable is passed in (here `a`). No copy is made and no address is stored; `x` simply *is* `a` for the duration of the call.
- In `int* c = &b;`, the `&` stands in front of a variable in an expression. It is the **address-of operator**: it produces the memory address of `b`, and that address is what the pointer `c` stores.

Same symbol, two jobs: "if there's a type to the left of your & symbol, then that's a reference; if there's nothing, then that's the address-of operator."

```quiz
[
  {
    "q": "Activity, after `*p1 = *p2;` (with p1 pointing at x and p2 at y): what is x?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "*p2 reads y (15); *p1 = writes that into x. So x = 15, y = 15."
  },
  {
    "q": "Activity, after `p2 = p1;`: what is y?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "Assigning one pointer to another only moves an arrow. Neither x nor y changes; y stays 15."
  },
  {
    "q": "Activity, after the last line `*p1 = *p2 + 10;`: what is x?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0,
    "explain": "By now both pointers point at x, so *p2 is 15; 15 + 10 = 25 is written into x. y remains 15."
  },
  {
    "q": "Activity: how many of the six statements change the value of y?",
    "options": ["0", "1", "2", "3"],
    "answer": 0,
    "explain": "y is only ever read (through p2, before p2 is re-pointed at x). No statement writes to y, so it stays 15 throughout."
  },
  {
    "q": "What does the activity's second program print?",
    "code": "void test( int& x, int y, int* z ) { x++; y++; (*z)++; }\nint main(){\n    int a = 7; int b = 6; int* c = &b;\n    test(a,b,c);\n    cout << a << \" \" << b << \" \" << *c << endl;\n}",
    "options": ["8 6 7", "8 7 7", "7 7 7", "8 8 8"],
    "answer": 1,
    "explain": "x++ changes a through the reference (8). y++ changes a copy (b still 6 so far). (*z)++ changes b through the pointer (7). *c reads b: 7."
  },
  {
    "q": "Change the first parameter to pass by value (`int x`). Now the program prints...",
    "options": ["8 7 7", "7 7 7", "7 6 6", "8 6 6"],
    "answer": 1,
    "explain": "x is a copy, so a stays 7. The pointer parameter still increments b to 7, and *c is b."
  },
  {
    "q": "Change the second parameter to a reference (`int& y`), keeping the rest. Now the program prints...",
    "options": ["8 7 7", "8 8 8", "8 8 7", "8 7 8"],
    "answer": 1,
    "explain": "y is now another name for b, so y++ makes b 7 and (*z)++ makes it 8. Both b and *c print 8."
  },
  {
    "q": "In `void test( int& x, int y, int* z )`, the `&` means address-of.",
    "type": "tf",
    "answer": false,
    "explain": "There is a type to its left, so it declares a reference parameter. Address-of is the `&` in `int* c = &b;`."
  },
  {
    "q": "If the parameter is `int* y` and the body still says `y++;`, what happens to b?",
    "options": ["b is incremented", "b is decremented", "Nothing: the pointer y is moved to the next int slot, b is untouched", "The program does not compile"],
    "answer": 2,
    "explain": "Incrementing a pointer moves the pointer. To change the pointed-at box you need (*y)++. The call would also have to pass &b."
  },
  {
    "q": "If you declare `b` as a pointer but leave `int* c = &b;` and `test(a,b,c);` unchanged, the program still compiles.",
    "type": "tf",
    "answer": false,
    "explain": "&b would be an int**, which cannot initialize an int*, and passing an int* to the plain int parameter y is also an invalid conversion. You would need `test(a, *b, b)`."
  },
  {
    "type": "fill",
    "q": "Complete the parameter list so that `a` is changed through an alias, `b` is passed as a copy, and `c` (an `int*`) is accepted.",
    "code": "void test( int___ x, int y, int___ z )",
    "answer": ["&", "*"],
    "explain": "int& x is a reference parameter (alias for a); int* z is a pointer parameter that accepts the address stored in c."
  },
  {
    "type": "match",
    "q": "Match each parameter kind to its effect on the caller's variable.",
    "pairs": [
      ["`int& x` with `x++`", "the caller's variable is incremented"],
      ["`int y` with `y++`", "a copy is incremented; the caller's variable is unchanged"],
      ["`int* z` with `(*z)++`", "the variable whose address was passed is incremented"],
      ["`int* z` with `z++`", "the pointer moves; no variable's value changes"]
    ],
    "explain": "Reference: alias. Value: copy. Pointer: reaches the original only when you dereference it."
  }
]
```
