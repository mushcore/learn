---
title: "Extra 13: the right-left rule: reading a declaration"
minutes: 20
---
This lesson teaches one fixed way to read any declaration aloud, however many stars and brackets it has. It prepares the deck's four-option questions that ask what a declaration means.

## Why a declaration is read from the name outwards, in plain words

A declaration wraps a name in layers. Each symbol next to the name says one thing about it, and the type word on the far left comes last.

The symbols closest to the name describe it first. So the reading starts at the name and works outwards, a little to the right and then a little to the left.

Parentheses act like a wall. You read inside them first, then step out and carry on one level further out.

Think of opening nested boxes in the cash shop: the outer label only makes sense once you know what is in the inner box.

```diagram
{ "type": "layers", "title": "Layers around pf in int (*pf)();", "nodes": [
  { "id": "t", "label": "int: returning an int" },
  { "id": "f", "label": "(): a function", "parent": "t" },
  { "id": "p", "label": "*: a pointer to", "parent": "f" },
  { "id": "n", "label": "pf: the name", "parent": "p" }
], "hi": ["n"], "caption": "Read from the innermost layer out: pf is a pointer to a function returning an int." }
```

## A tiny program you can run in your head

A function pointer holds the address of a function, so the function can be called through it. An array pointer holds the address of a whole array.

```cpp run pin rl_tiny.cpp
// predict: Write the two printed lines.
#include <iostream>

int seven() {
    return 7;
}

int main() {
    int (*pf)() = seven;
    int (**ppf)() = &pf;
    std::cout << pf() << ' ' << (**ppf)() << '\n';
    int levels[3] = {10, 30, 70};
    int (*pa)[3] = &levels;
    std::cout << (*pa)[1] << '\n';
    return 0;
}
```

1. `int (*pf)() = seven;` reads "pf is a pointer to a function returning an int". It stores the address of `seven`.
2. `int (**ppf)() = &pf;` adds one more star inside the parentheses: a pointer to that pointer. `pf()` and `(**ppf)()` both call `seven`: `7 7`.
3. `int (*pa)[3] = &levels;` reads "pa is a pointer to an array of 3 ints". `(*pa)[1]` goes to the array, then to its second element: `30`.

Every name here was read the same way: name, inside the parentheses, then out.

```widget
rl-rule-step
{ "decl": "int (**ppf)();" }
```

## The rule, in the slide's words

The five steps, in the slide's words:

1. "Start from variable name".
2. "Keep going right. Read what we see until we see right parentheses )".
3. "Then go left ... Read what we see until we see left parentheses (".
4. "Exit bracket and go right. Read what we see until we see right parentheses or semicolon".
5. "Go left of where we exited bracket. Read what we see until left parentheses or finish", and "Repeat steps as needed".

The words for the symbols: `*` is "pointer to", `[]` is "array of", `()` is "function returning", and `&` is "reference to".

:::tip The parentheses trap
Without the parentheses the stars join the element type. `int *x[3]` is an array of 3 int pointers, while `int (*x)[3]` is a pointer to an array of 3 ints.
:::

## One declaration walked token by token

The slides build the rule on `int (**var[])();`, one step per slide.

```diagram
{ "type": "flow", "title": "Reading int (**var[])();", "nodes": [
  { "id": "s1", "label": "var", "sub": "start at the name" },
  { "id": "s2", "label": "[ ]", "sub": "right: an array of" },
  { "id": "s3", "label": "* *", "sub": "left: pointers to pointers to" },
  { "id": "s4", "label": "( )", "sub": "exit, right: a function" },
  { "id": "s5", "label": "int", "sub": "left: that returns int" }
], "edges": [ { "from": "s1", "to": "s2" }, { "from": "s2", "to": "s3", "label": "hit )" }, { "from": "s3", "to": "s4", "label": "hit (" }, { "from": "s4", "to": "s5", "label": "hit ;" } ], "hi": ["s1"], "caption": "Right until a right parenthesis, left until a left one, step out, and repeat until the type word." }
```

Going right from `var` finds `[]`, an array, and stops at `)`. Going left finds the two stars and stops at `(`.

Stepping out and going right finds `()`, a function, and stops at `;`. Going left finds `int`.

In the slide's words, "var is an array of pointers to pointers to a function that returns int".

## Try it: the six slide declarations

The deck asks the six slide declarations as four-option questions, with the slide's own options. Each reading starts at the name.

```quiz
[
  {
    "q": "Slide 36: `int ***ppp;`",
    "options": ["Ppp is an int pointer to a pointer to a pointer", "Ppp is a pointer to a pointer to an int pointer", "Ppp is a pointer an int pointer to a pointer", "Ppp is a pointer to a pointer to a pointer returning an int"],
    "answer": 1,
    "explain": "1. Start at `ppp`; nothing on the right.\n2. Go left: `*` a pointer to, `*` a pointer to, `*` with `int`: an int pointer.\n3. The slide reads the last star and `int` together: \"a pointer to a pointer to an int pointer\". Nothing here is a function, so \"returning\" is wrong."
  },
  {
    "q": "Slide 37: `int (**ppa)[];`",
    "options": ["Ppa is an array of pointer to a pointer returning ints", "Ppa is an int pointer to a pointer to an array", "Ppa is an array of pointers to int pointers", "Ppa is a pointer to a pointer to an array of ints"],
    "answer": 3,
    "explain": "1. Start at `ppa`; right is `)`, so go left: `*` a pointer to, `*` a pointer to.\n2. Exit the parentheses, go right: `[]` an array.\n3. Go left: `int`, of ints. The parentheses make `ppa` the pointer; without them, `int **ppa[]` would be an array."
  },
  {
    "q": "Slide 38: `int (**ppf)();`",
    "options": ["Ppf is a pointer to a pointer to a function returning an int", "Ppf is a pointer to a function returning integer pointers", "Ppf is a function pointing to an integer pointer", "Ppf is a int pointer to a pointer to a function"],
    "answer": 0,
    "explain": "1. Start at `ppf`; right is `)`, so go left: two `*`, a pointer to a pointer.\n2. Exit, go right: `()` a function.\n3. Go left: `int`, returning an int."
  },
  {
    "q": "Slide 39: `int *(*pap)[];`",
    "options": ["Pap is a pointer to an integer to a pointer to an array", "Pap is an integer array of pointers to pointers", "Pap is an array of pointers to pointers to ints", "Pap is a pointer to an array of int pointers"],
    "answer": 3,
    "explain": "1. Start at `pap`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array.\n3. Go left: `*` and `int`, of int pointers. The star outside the parentheses belongs to the element type."
  },
  {
    "q": "Slide 40: `int (*paa)[][];`",
    "options": ["Paa is an array of arrays to pointers to ints", "Paa is a pointer to an array of arrays of ints", "Paa is an integer pointer to an array of arrays", "Paa is an array of pointers to an array of ints"],
    "answer": 1,
    "explain": "1. Start at `paa`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array, `[]` of arrays.\n3. Go left: `int`, of ints. The reading is the keyed answer, but the line does not compile: only the first array bound may be left out (g++: \"multidimensional array must have bounds for all dimensions except the first\")."
  },
  {
    "q": "Slide 41: `int (*paf)[]();`",
    "options": ["Paf is a function to an array of int pointers", "Paf is a int pointer to an array of functions", "Paf is a pointer to an int array of functions", "Paf is a pointer to an array of functions returning an int"],
    "answer": 3,
    "explain": "1. Start at `paf`; right is `)`, so go left: `*` a pointer to.\n2. Exit, go right: `[]` an array, then `()` of functions.\n3. Go left: `int`, returning an int. As with `paa`, it is a reading exercise only: C++ has no arrays of functions (g++: \"declaration of 'paf' as array of functions\")."
  }
]
```

## The six readings side by side

Two of the six are reading exercises only. The compiler refuses them, so the slide's readings are still the keyed answers.

```cpp pin two_bad.cpp
int (*paa)[][];
int (*paf)[]();

int main() {
    return 0;
}
```

- `int (*paa)[][];` fails because only the first array bound may be left out. g++ says "multidimensional array must have bounds for all dimensions except the first".
- `int (*paf)[]();` fails because C++ has no arrays of functions. g++ says "declaration of 'paf' as array of functions".

```diagram
{ "type": "grid", "title": "The six slide declarations", "nodes": [
  { "id": "h0", "label": "declaration", "row": 0, "col": 0 },
  { "id": "h1", "label": "reading", "row": 0, "col": 1 },
  { "id": "h2", "label": "compiles", "row": 0, "col": 2 },
  { "id": "a0", "label": "int ***ppp;", "row": 1, "col": 0 },
  { "id": "a1", "label": "ptr to ptr to an int pointer", "row": 1, "col": 1 },
  { "id": "a2", "label": "yes", "row": 1, "col": 2 },
  { "id": "b0", "label": "int (**ppa)[];", "row": 2, "col": 0 },
  { "id": "b1", "label": "ptr to ptr to array of ints", "row": 2, "col": 1 },
  { "id": "b2", "label": "yes", "row": 2, "col": 2 },
  { "id": "c0", "label": "int (**ppf)();", "row": 3, "col": 0 },
  { "id": "c1", "label": "ptr to ptr to function returning int", "row": 3, "col": 1 },
  { "id": "c2", "label": "yes", "row": 3, "col": 2 },
  { "id": "d0", "label": "int *(*pap)[];", "row": 4, "col": 0 },
  { "id": "d1", "label": "ptr to array of int pointers", "row": 4, "col": 1 },
  { "id": "d2", "label": "yes", "row": 4, "col": 2 },
  { "id": "e0", "label": "int (*paa)[][];", "row": 5, "col": 0 },
  { "id": "e1", "label": "ptr to array of arrays of ints", "row": 5, "col": 1 },
  { "id": "e2", "label": "no", "row": 5, "col": 2 },
  { "id": "f0", "label": "int (*paf)[]();", "row": 6, "col": 0 },
  { "id": "f1", "label": "ptr to array of functions returning int", "row": 6, "col": 1 },
  { "id": "f2", "label": "no", "row": 6, "col": 2 }
], "hi": ["e2", "f2"], "caption": "Every reading starts at the name; ptr means pointer to. Only paa and paf are refused by the compiler." }
```

## Remember

- Start at the name, go right until `)`, go left until `(`, step out and repeat.
- The parentheses decide whether the name is a pointer or an array.
- *On the sheet:* Sheet side 2, band 4 "True/false and multiple choice traps", Right-left rule.
