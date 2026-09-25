---
title: References: the alias
minutes: 22
---

C has pointers. C++ adds a second tool that uses the same `&` symbol and, in the instructor's words, is "an entirely different concept": the **reference**. This lesson covers what a reference is, the one rule that catches everyone (it can never be re-seated), how to tell the two meanings of `&` apart, references to constants, and how references flow in and out of functions.

## A reference is a nickname

The slide definition, in four lines:

- **An alias**: anything done to the reference is done to the referent. The video's word is "nickname".
- **Must be initialized when created**. `int& ref;` does not compile.
- **Makes pass by reference effortless**: no `&` at the call site, no `*` inside the function.
- **Used for efficiency**: no copy of the argument is made.

```widget
pointer-viz
{ "preset": "reference = alias", "presets": false, "title": "int& ref = n: one box, two names" }
```

```cpp run pin referenceAlias.cpp
// predict: Three numbers, one per line.
#include <iostream>
using namespace std;

int main()
{
    int n{123};
    int& ref = n;     // ref is another name for n: NO new box is created

    int m{345};
    ref = m;          // same as n = m
    cout << n << endl;    // 345
    cout << ref << endl;  // 345

    m = 999;              // ref does not follow m
    cout << ref << endl;  // still 345
    return 0;
}
```

Step the widget while you read. `int& ref = n;` does not create a box: the stack shows the same cell with two names, `n` and `ref`, at one address. Then `ref = m;` looks like it might make `ref` refer to `m`. It does not. The slide comment says it: "same as n = m". The value 345 is copied into the box that `n` and `ref` share, so both `cout << n << endl;` and `cout << ref << endl;` print `345`. Changing `m` afterwards changes nothing about `n` or `ref`.

:::quiz Assignment to a reference
"Assignment to a reference changes the value of the object referred to, not the reference itself." The reference is bound once, at initialization, and stays bound to that one variable for its whole life.
:::

## Reading the ampersand

The same character does two jobs, and the quiz will test whether you can tell them apart. The instructor's rule from the code video:

| You see | Meaning | How to tell |
|---|---|---|
| `int& b = a;` | **reference**: `b` is a nickname for `a` | there is a type immediately to the left of the `&`, and it is being initialized right away |
| `cout << &a;` | **address-of**: the address of `a` | nothing to the left of the `&`; it sits in an expression |

Here is `references.cpp` from the video, with the address printing replaced by comparisons so the output is fixed (the video prints raw addresses and they all come out identical, `cc8`):

```cpp run pin references.cpp
// predict: Five lines. Booleans print as words because of boolalpha.
#include <iostream>
using namespace std;

int main()
{
    int a = 10;
    int& b = a;       // b is a nickname for a
    b = 8;            // exactly the same as a = 8
    cout << a << endl;

    int& c = b;       // a nickname for a nickname: c is a
    c = 4;
    cout << a << endl;

    cout << boolalpha << (&a == &b) << " " << (&b == &c) << endl;  // one box, three names

    int d = 999;      // a new, separate variable
    c = d;            // copies d's VALUE into a; c still names a
    cout << c << " " << a << endl;
    cout << (&a == &c) << endl;
    return 0;
}
```

Walk it line by line. `b = 8;` is "exactly the same as saying a = 8", so the first line printed is `8`. `int& c = b;` makes a nickname for a nickname; "if you trace this all the way down", `c` is `a`, so `c = 4;` prints `4`. The comparison `(&a == &b)` uses the *other* ampersand, address-of, and it is `true` for both pairs: three names, one address. Finally `c = d;` copies 999 into the shared box, so `c` and `a` both print `999`, and the addresses are still equal.

## A reference cannot be re-seated

This is the trap. The slide example uses `numRef`:

```widget
pointer-viz
{ "preset": "numRef = num2", "presets": false, "title": "numRef = num2 changes num, not where numRef points" }
```

```cpp run pin numRef.cpp
// predict: One line with three numbers.
#include <iostream>
using namespace std;

int main()
{
    int num = 100;
    int num2 = 200;
    int& numRef = num;   // numRef refers to num
    numRef = num2;       // num becomes 200; numRef STILL refers to num
    num2 = 300;          // numRef does not follow num2
    cout << num << " " << num2 << " " << numRef << endl;
    return 0;
}
```

`int& numRef = num;` binds the reference once, to `num`. The slide's own comment for `numRef = num2;` is "numRef still referring to num, but changed num's value to 200". Compare that with a pointer: `p = &num2` would re-point `p`. With a reference there is no such operation at all; every assignment goes through to the referent. So `num2 = 300;` on the next line changes only `num2`, and the output is `200 300 200`.

## Swap with references

Now the swap from the previous lesson, third version. The slides put the pointer and reference versions side by side and ask you to notice how much cleaner the reference one reads:

```widget
pointer-viz
{ "preset": "swap with references", "presets": false, "title": "Reference parameters: the frame holds names, not copies" }
```

```cpp run pin swapReferences.cpp
// predict: What does the program print?
#include <iostream>
using namespace std;

void swap(int& arg1, int& arg2)
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
    cout << first << " " << second << endl;
    return 0;
}
```

In the widget, the `swap` frame gets no new boxes for `arg1` and `arg2`; instead `first` and `second` in `main` each grow a second name. The body `int temp{arg1};` reads `first`, `arg1 = arg2;` writes into `first`, and `arg2 = temp;` writes into `second`, with no stars anywhere. The call `swap(first, second);` looks identical to the by-value call that failed; the difference is entirely in the parameter list. Output: `2526 3522`.

| Version | Parameters | Call | Inside the body | Works? |
|---|---|---|---|---|
| by value | `int arg1, int arg2` | `swap(first, second)` | `arg1 = arg2` (copies) | no |
| pointers | `int* arg1, int* arg2` | `swap(&first, &second)` | `*arg1 = *arg2` | yes |
| references | `int& arg1, int& arg2` | `swap(first, second)` | `arg1 = arg2` | yes |

## Pointers versus references

"Does our processor know about references? NO." Pointers and references produce the same assembly instructions; references are converted to pointers when the code is compiled. "References are for programmers." So the difference is entirely about what the language lets you write:

| | Pointer | Reference |
|---|---|---|
| Must be initialized at declaration | no (`int* p;` is legal, if unwise) | yes |
| Can point at nothing | yes, `nullptr` | no |
| Can be re-pointed later | yes, `p = &other` | never |
| Reaching the value | `*p`, `p[i]` | just the name |
| Address arithmetic | `p++`, `p + 3` | none |
| Call site | `f(&x)` | `f(x)` |

## References to constants

You cannot bind a plain reference to a temporary value, because a reference must name an existing variable:

```cpp
int& reference{1};    // will not compile: 1 is not a variable
const int& r{1};      // OK: a const reference may bind to a temporary

int n{12};
long& ref = n;        // will not compile either: n is an int, not a long
const long& ref = n;  // OK, but read the note below
```

Why does `long& ref = n` fail when `n` is a real variable? Because the types do not match. To make a `long` out of an `int`, the compiler would have to create a temporary `long` holding a copy, and a non-const reference cannot bind to a temporary. Adding `const` allows exactly that: the reference binds to the hidden copy, not to `n`. Watch the widget's last preset to see the copy appear:

```widget
pointer-viz
{ "preset": "references to constants", "presets": false, "title": "const references: which ones bind to a temporary?" }
```

```cpp run
#include <iostream>
using namespace std;

int main()
{
    const int& r{1};        // OK: a const reference may bind to a temporary
    int n{12};
    const long& ref = n;    // OK, but it binds to a temporary long COPY of n
    n = 20;                 // does ref change?
    cout << r << " " << n << " " << ref << endl;   // 1 20 12
    return 0;
}
```

The instructor says he rarely uses this in practice, but the two compile errors are exactly the kind of true/false pair the quiz likes.

## Functions and references

The "Functions and references" video adds the rules for references crossing a function boundary. First the danger: **a function cannot return a reference to a local object.**

```cpp
int& f()          // compiles, but dangerous
{
    int n = 1;    // n lives only until f returns
    return n;     // a reference to a box that is about to disappear
}

int* g()          // same problem with a pointer
{
    int a[10];
    a[0] = 1;
    return a;     // the array is destroyed when g returns
}
```

Local variables disappear when the function exits, so whoever uses the returned reference is looking at memory that "at some point will disappear and I don't know when". Both compile; both are wrong. The video's four combinations of in and out:

| Signature | Coming in | Going out | Verdict |
|---|---|---|---|
| `int f1(int n)` | copy | copy | fine, two copies |
| `int f2(int& n)` | original | copy | fine, one copy |
| `int& f3(int n)` | copy | reference to the local copy | dangerous, never do this |
| `int& f4(int& n)` | original | the same original | the way to get the original in and out |

```cpp run pin functionsReferences.cpp
// predict: Three numbers, one per line.
#include <iostream>
using namespace std;

int f1(int n) { return n; }            // copy in, copy out
int f2(int& n) { return n; }           // original in, copy out
int& f4(int& n) { n = n * 2; return n; }   // original in, original out

int main()
{
    int x = 21;
    f4(x);                     // doubles x through the reference
    cout << x << endl;         // 42

    f4(x) = 7;                 // the returned reference IS x, so we can assign to it
    cout << x << endl;         // 7

    cout << f1(x) + f2(x) << endl;   // 14
    return 0;
}
```

`f4(x) = 7;` is the line to think about. Because `int& f4(int& n)` returns a reference to the original, the call expression *is* `x`, and assigning to it assigns to `x` (after the doubling inside the call has already happened). `f1(x) + f2(x)` just reads the value twice. Could you use a global variable instead of references? "We can, but we shouldn't."

## The two meanings of & in one program

The practice sheet ends with a function that uses both ampersands; the full worked answers are in the lesson "Pointers & references practice, worked". Step it now to see a reference parameter, a by-value parameter and a pointer parameter side by side:

```widget
pointer-viz
{ "preset": "test(int& x, int y, int* z)", "presets": false, "title": "One frame, three parameter kinds" }
```

```quiz
[
  {
    "q": "A C++ reference is best described as...",
    "options": ["A pointer that cannot be dereferenced", "An alias: another name for an existing variable", "A copy of a variable that stays in sync", "A constant pointer to heap memory"],
    "answer": 1,
    "explain": "The slide says alias, the video says nickname. Anything done to the reference is done to the referent because they are the same box."
  },
  {
    "q": "A reference must be initialized when it is created.",
    "type": "tf",
    "answer": true,
    "explain": "`int& ref;` does not compile. A reference has to name an existing variable from the moment it exists."
  },
  {
    "q": "What does this print?",
    "code": "int n{123};\nint& ref = n;\nint m{345};\nref = m;\ncout << n;",
    "options": ["123", "345", "the address of m", "it does not compile"],
    "answer": 1,
    "explain": "`ref = m` is the same as `n = m` because ref is a nickname for n. The slide prints 345 for both n and ref."
  },
  {
    "q": "After `int& ref = n; ref = m;`, `ref` now refers to `m`.",
    "type": "tf",
    "answer": false,
    "explain": "A reference cannot be re-seated. The assignment copied m's value into n's box; ref still names n."
  },
  {
    "q": "What does this print?",
    "code": "int num = 100;\nint num2 = 200;\nint& numRef = num;\nnumRef = num2;\nnum2 = 300;\ncout << num << \" \" << numRef;",
    "options": ["100 200", "200 200", "200 300", "300 300"],
    "answer": 1,
    "explain": "numRef = num2 wrote 200 into num. Changing num2 afterwards does not affect num, and numRef is just num, so both print 200."
  },
  {
    "type": "match",
    "q": "Match each use of `&` to its meaning.",
    "pairs": [
      ["`int& x = a;`", "declares x as a reference (alias) to a"],
      ["`int* c = &b;`", "address-of: the address of b"],
      ["`void f(int& n)`", "n is a reference parameter: the original comes in"],
      ["`cout << &a;`", "prints the address of a"]
    ],
    "explain": "Type to the left of & means reference; & alone in an expression means address-of."
  },
  {
    "type": "spotbug",
    "q": "Click the line that fails to compile.",
    "code": "#include <iostream>\nusing namespace std;\nint main()\n{\n    int n{12};\n    int& r{1};\n    const int& c{1};\n    cout << n << r << c << endl;\n    return 0;\n}",
    "answer": 6,
    "explain": "Line 6 binds a non-const reference to the temporary value 1, which is not a variable. Line 7 is fine because a const reference may bind to a temporary."
  },
  {
    "q": "With `int n{12};`, the declaration `const long& ref = n;` compiles.",
    "type": "tf",
    "answer": true,
    "explain": "It compiles, but ref binds to a temporary long copy of n, not to n itself. The non-const `long& ref = n;` fails because the types differ."
  },
  {
    "q": "Which statement about pointers and references is true?",
    "options": ["References produce slower code than pointers", "The processor has a special instruction for references", "Pointers and references produce the same assembly; references exist for programmers", "References are stored on the heap"],
    "answer": 2,
    "explain": "Straight from the slide: the processor does not know about references. They are converted to pointers when the code is compiled."
  },
  {
    "q": "Which of these are true of references? (select all)",
    "options": ["Cannot be null", "Cannot be re-seated to another variable", "Must be initialized at declaration", "Need `*` to reach the value"],
    "answer": [0, 1, 2],
    "explain": "A reference always names a real variable, is bound once, and is used exactly like the variable itself, with no star."
  },
  {
    "q": "Returning a reference to a local variable from a function is...",
    "options": ["A compile error", "The recommended way to return large objects", "Legal but dangerous: the local is destroyed when the function returns", "Only allowed for int"],
    "answer": 2,
    "explain": "It compiles, but the box disappears with the function's frame. Anyone using the returned reference is looking at dead memory."
  },
  {
    "q": "Which signature passes the original object in AND hands the original back out?",
    "options": ["`int f(int n)`", "`int f(int& n)`", "`int& f(int n)`", "`int& f(int& n)`"],
    "answer": 3,
    "explain": "Reference in, reference out. `int f(int& n)` copies on the way out; `int& f(int n)` returns a reference to a local copy, which is the dangerous case."
  },
  {
    "type": "fill",
    "q": "Make this swap actually swap the caller's variables without pointers.",
    "code": "void swap(int___ arg1, int___ arg2)\n{\n    int temp{arg1};\n    arg1 = arg2;\n    arg2 = temp;\n}",
    "answer": ["&", "&"],
    "explain": "Reference parameters make arg1 and arg2 nicknames for the caller's variables, so the body changes the originals with no stars needed."
  }
]
```
