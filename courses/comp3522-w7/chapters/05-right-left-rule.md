---
title: The right-left rule for reading declarations
minutes: 25
---

A C++ declaration is read from the name outward: right first, then left, one pair of parentheses at a time. With that habit, `int (**var[])();` stops being noise.

## References to arrays and to pointers

The slides open with two "What's this monstrosity?" examples. The first is a reference to an array:

```cpp
int a [100];
int (&ref) [100] = a;
```

Start at `ref`. To its right is `)`, so look left: `&`, a reference. Leave the parentheses and go right: `[100]`, to an array of 100. Go left: `int`. So `ref` is a reference to an array of 100 ints. The parentheses matter: `int &ref[100]` reads "an array of 100 references", and the server refuses it with `error: declaration of 'ref' as array of references`.

The second is a reference to a pointer:

```cpp run pin slide26-swap.cpp
// predict: Write the one line printed.
#include <iostream>
void swap(int*&p, int *&q)
{
       int* temp = p;
       p = q;
       q = temp;
}
int main() {
  int x = 1, y = 2;
  int *px = &x, *py = &y;
  swap(px, py);
  std::cout << *px << " " << *py << " " << x << " " << y << std::endl;
}
```

Read `int*&p` from the name leftward: `p` is a reference (`&`) to a pointer (`*`) to `int`. So `swap` gets the caller's pointers themselves, not copies. `int* temp = p;` saves the first pointer, and `p = q;` and `q = temp;` cross them over. After `swap(px, py);`, `px` points at `y` and `py` points at `x`, but `x` and `y` were never touched: the line prints `2 1 1 2`. With plain `int*` parameters, `swap` would only exchange local copies.

## The five steps

The slides build the rule on `int (**var[])();`, one step per slide (slides 27 to 31):

1. *Start from variable name (var)*
2. *Keep going right. Read what we see until we see right parentheses )*
3. *Then go left of var. Read what we see until we see left parentheses (*
4. *Exit bracket and go right. Read what we see until we see right parentheses or semicolon*
5. *Go left of where we exited bracket. Read what we see until left parentheses or finish*

Then *Repeat steps as needed*: each time you leave one pair of parentheses, steps 4 and 5 run again one level out ("bracket" means those parentheses). Slide 32's "go left of ppf" is a typo for `var`.

On `var`: going right finds `[]`, an array, and stops at `)`. Going left finds `**`, pointers to pointers, and stops at `(`. Leaving the parentheses and going right finds `()`, a function, and stops at `;`. Going left finds `int`. In the slide's words, *var is an array of pointers to pointers to a function that returns int*.

Written alone, with no bound and no initializer, `int (**var[])();` does not compile (the server says `storage size of 'var' isn't known`); with `[3]` or an initializer it is fine, and the reading is the same.

### Step through a declaration

The stepper applies one step per click and shows the reading so far.

```widget
rl-rule-step
{}
```

## Two longer walks

Slide 33, `int * (* (*fp1) (int) ) [10];`:

| Slide step | You see | Adds to the reading |
|---|---|---|
| *Start from the variable name* | `fp1` | fp1 is |
| *Nothing to right but* `)` *so go left to find* | `*` | a pointer |
| *Jump out of parentheses and encounter* | `(int)` | to a function that takes an int parameter |
| *Go left, find* | `*` | and returns a pointer |
| *Jump out of parentheses, go right and hit* | `[10]` | to an array of 10 |
| *Go left find* | `*` | pointers to |
| *Go left again, find* | `int` | ints |

Slide 34, `int *( *( *arr[5])())();`:

| Slide step | You see | Adds to the reading |
|---|---|---|
| *Start from the variable name* | `arr` | arr is |
| *Go right, find array subscript* | `[5]` | an array of 5 |
| *Go left, find* | `*` | pointers |
| *Jump out of parentheses, go right to find* | `()` | to functions |
| *Go left, encounter* | `*` | that return pointers |
| *Jump out, go right, find* | `()` | to functions |
| *Go left, find* | `*` | that return pointers |
| *Continue left, find* | `int` | to ints |

Each "jump out" repeats steps 4 and 5, one level out.

## Names that explain themselves

Slide 42, "Even more!", names each variable after its own reading:

```cpp
int *ptr_to_int;
int *func_returning_ptr_to_int();
int (*ptr_to_func_returning_int)();
int (*array_of_ptr_to_func_returning_int[])();

// CRAZINESS:
int (*(*ptr_to_an_array_of_ptr_to_func_returning_int)[])();
```

The deck's closing advice: *Final note: if possible, please don't write messy declarations like this*. A `typedef` ([Week 6](#/comp3522-w6/typedefs-restaurant)) helps: after `typedef int fn_t();`, `fn_t **var[3];` is the same type as `int (**var[3])();`.

## Read the six slide declarations

Slides 35 to 41 give six declarations, each with four readings in the slide's numbering. `paa` and `paf` are reading exercises only, since neither compiles: the server says `declaration of 'paa' as multidimensional array must have bounds for all dimensions except the first` and `declaration of 'paf' as array of functions`.

```quiz
[
  {
    "q": "Slide 36: `int ***ppp;`",
    "options": [
      "Ppp is an int pointer to a pointer to a pointer",
      "Ppp is a pointer to a pointer to an int pointer",
      "Ppp is a pointer an int pointer to a pointer",
      "Ppp is a pointer to a pointer to a pointer returning an int"
    ],
    "answer": 1,
    "shuffle": false,
    "explain": "Start from ppp. Going right there is only the semicolon. Going left: `*` (a pointer), `*` (to a pointer), `*` (to a pointer), then `int`. So ppp is a pointer to a pointer to a pointer to int, which the slide words as a pointer to a pointer to an int pointer. A reading that starts with int has put the type first, and nothing here is a function, so nothing is returning."
  },
  {
    "q": "Slide 37: `int (**ppa)[];`",
    "options": [
      "Ppa is an array of pointer to a pointer returning ints",
      "Ppa is an int pointer to a pointer to an array",
      "Ppa is an array of pointers to int pointers",
      "Ppa is a pointer to a pointer to an array of ints"
    ],
    "answer": 3,
    "shuffle": false,
    "explain": "Start from ppa. Going right hits `)` at once. Going left: `**`, a pointer to a pointer, stopping at `(`. Exit the parentheses and go right: `[]`, to an array, stopping at `;`. Go left: `int`, of ints. So ppa is a pointer to a pointer to an array of ints; ppa itself is a pointer, not an array, because the `[]` sits outside its parentheses."
  },
  {
    "q": "Slide 38: `int (**ppf)();`",
    "options": [
      "Ppf is a pointer to a pointer to a function returning an int",
      "Ppf is a pointer to a function returning integer pointers",
      "Ppf is a function pointing to an integer pointer",
      "Ppf is a int pointer to a pointer to a function"
    ],
    "answer": 0,
    "shuffle": false,
    "explain": "Start from ppf. Going right hits `)`. Going left: `**`, a pointer to a pointer, stopping at `(`. Exit and go right: `()`, to a function, stopping at `;`. Go left: `int`, returning an int. So ppf is a pointer to a pointer to a function returning an int. There are two stars inside the parentheses, so a reading with only one pointer has dropped a step."
  },
  {
    "q": "Slide 39: `int *(*pap)[];`",
    "options": [
      "Pap is a pointer to an integer to a pointer to an array",
      "Pap is an integer array of pointers to pointers",
      "Pap is an array of pointers to pointers to ints",
      "Pap is a pointer to an array of int pointers"
    ],
    "answer": 3,
    "shuffle": false,
    "explain": "Start from pap. Going right hits `)`. Going left: one `*`, a pointer, stopping at `(`. Exit and go right: `[]`, to an array, stopping at `;`. Go left: `*`, of pointers, then `int`, to ints. So pap is a pointer to an array of int pointers. The star outside the parentheses belongs to the array's elements, not to pap."
  },
  {
    "q": "Slide 40: `int (*paa)[][];`",
    "options": [
      "Paa is an array of arrays to pointers to ints",
      "Paa is a pointer to an array of arrays of ints",
      "Paa is an integer pointer to an array of arrays",
      "Paa is an array of pointers to an array of ints"
    ],
    "answer": 1,
    "shuffle": false,
    "explain": "Start from paa. Going right hits `)`. Going left: `*`, a pointer, stopping at `(`. Exit and go right: `[][]`, to an array of arrays, stopping at `;`. Go left: `int`, of ints. So paa is a pointer to an array of arrays of ints. In real C++ the declaration is ill-formed: in a multidimensional array only the first bound may be left out, so `int (*paa)[][4];` would compile."
  },
  {
    "q": "Slide 41: `int (*paf)[]();`",
    "options": [
      "Paf is a function to an array of int pointers",
      "Paf is a int pointer to an array of functions",
      "Paf is a pointer to an int array of functions",
      "Paf is a pointer to an array of functions returning an int"
    ],
    "answer": 3,
    "shuffle": false,
    "explain": "Start from paf. Going right hits `)`. Going left: `*`, a pointer, stopping at `(`. Exit and go right: `[]`, to an array, then `()`, of functions, stopping at `;`. Go left: `int`, returning an int. So paf is a pointer to an array of functions returning an int. In real C++ the declaration is ill-formed: there are no arrays of functions, only arrays of pointers to functions."
  }
]
```

```quiz
[
  {
    "q": "Read `char *(*pf)(double);`",
    "options": [
      "pf is a pointer to a function that takes a double and returns a pointer to char",
      "pf is a function that takes a double and returns a pointer to a pointer to char",
      "pf is a pointer to a char that points to a function taking a double",
      "pf is a pointer to a function that takes a pointer to double and returns char"
    ],
    "answer": 0,
    "explain": "Start from pf. Right: `)`. Left: `*`, a pointer. Exit and go right: `(double)`, to a function that takes a double. Go left: `*`, and returns a pointer, then `char`, to char."
  },
  {
    "q": "Read `int *(*apf[3])(int);`",
    "options": [
      "apf is a pointer to an array of 3 functions that take an int and return int pointers",
      "apf is an array of 3 pointers to functions that take an int and return int pointers",
      "apf is an array of 3 int pointers to functions that take an int",
      "apf is a function that takes an int and returns an array of 3 int pointers"
    ],
    "answer": 1,
    "explain": "Start from apf. Right: `[3]`, an array of 3, stopping at `)`. Left: `*`, pointers, stopping at `(`. Exit and go right: `(int)`, to functions that take an int. Go left: `*` and `int`, that return int pointers."
  },
  {
    "q": "Read `double (*(*pfa)())[4];`",
    "options": [
      "pfa is an array of 4 pointers to functions that return pointers to double",
      "pfa is a pointer to an array of 4 pointers to functions that return double",
      "pfa is a pointer to a function that returns a pointer to an array of 4 doubles",
      "pfa is a function that returns a pointer to a pointer to an array of 4 doubles"
    ],
    "answer": 2,
    "explain": "Start from pfa. Right: `)`. Left: `*`, a pointer. Exit and go right: `()`, to a function, stopping at `)`. Go left: `*`, that returns a pointer, stopping at `(`. Exit again and go right: `[4]`, to an array of 4. Go left: `double`, doubles."
  },
  {
    "q": "Write the declaration for: fp is a pointer to a function taking an int and returning an `int*`.",
    "options": [
      "`int *fp(int);`",
      "`int (*fp)(int *);`",
      "`int *(*fp)(int);`",
      "`int (*fp)(int);`"
    ],
    "answer": 2,
    "explain": "Build from the name outward: `*fp` makes fp a pointer, and the parentheses `(*fp)` keep that star on fp; `(*fp)(int)` makes it a pointer to a function taking an int; the `int *` in front is what the function returns. Without the parentheses, `int *fp(int);` declares a function that returns `int*`, not a pointer."
  },
  {
    "q": "Write the declaration for: pc is a pointer to an array of 8 chars.",
    "options": [
      "`char *pc[8];`",
      "`char (*pc)[8];`",
      "`char *(pc[8]);`",
      "`char (&pc)[8];`"
    ],
    "answer": 1,
    "explain": "The pointer has to be read first, so the star goes in parentheses with the name: `(*pc)` is a pointer, `[8]` to its right makes it a pointer to an array of 8, and `char` on the left gives the elements. Without the parentheses (or with them around `pc[8]`), `[8]` is read first and pc is an array of 8 char pointers; `&` instead of `*` makes a reference to an array, like slide 25's `ref`."
  }
]
```
