---
title: var is function-scoped and hoisted; let and const are block-scoped
minutes: 18
---

The same `console.log(a)` can print 10, print `undefined`, or stop the script with a ReferenceError, depending only on whether `a` was declared with `var`, `let` or `const` and where. The output questions in this course are built on that difference.

<!-- facts: slides 115-117, 124, 126-130, 132-134, 138; Quiz 6 shapes -->

## var is function-scoped, let and const are block-scoped (slides 115, 117, 127)

- *var: Declares a function-scoped variable.*
- *let: Declares a block-scoped, variable.*
- *const: Declares a block-scoped const. Will make only primitive variables constant*

*a block means lines of codes within {}* (slide 127). Slide 117 puts a declaration inside a bare block and logs it outside.

```js run pin block-var-let
// predict: Write both lines.
{
  var stock = 10;
}
console.log(stock);
{
  let shelf = 10;
}
console.log(shelf);
```

```output
10
Uncaught ReferenceError: shelf is not defined
```

`var stock = 10` ignores the block, so `console.log(stock)` prints 10. `let shelf = 10` lives only inside its braces; the error stops the script.

```diagram
{ "type": "grid", "title": "Three columns (slide 117)", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "var", "row": 0, "col": 1 }, { "id": "h2", "label": "let", "row": 0, "col": 2 }, { "id": "h3", "label": "const", "row": 0, "col": 3 }, { "id": "a0", "label": "code", "row": 1, "col": 0 }, { "id": "a1", "label": "{ var a = 10; }", "row": 1, "col": 1 }, { "id": "a2", "label": "{ let a = 10; }", "row": 1, "col": 2 }, { "id": "a3", "label": "{ const a = 10; }", "row": 1, "col": 3 }, { "id": "b0", "label": "prints", "row": 2, "col": 0 }, { "id": "b1", "label": "10", "row": 2, "col": 1 }, { "id": "b2", "label": "ReferenceError: a is not defined", "row": 2, "col": 2 }, { "id": "b3", "label": "ReferenceError: a is not defined", "row": 2, "col": 3 }, { "id": "c0", "label": "scope", "row": 3, "col": 0 }, { "id": "c1", "label": "Function scoped", "row": 3, "col": 1 }, { "id": "c2", "label": "Block Scoped", "row": 3, "col": 2 }, { "id": "c3", "label": "Block Scoped", "row": 3, "col": 3 } ], "hi": ["b1"], "caption": "What does console.log(a) print on console?" }
```

### Switching var to let in the slide 117 program

```widget
scope-hoist
{ "preset": "three-columns", "kind": "var" }
```

Change the kind to `let` or `const` and watch `a` leave memory at the closing brace.

## A function holds a var, a block holds a let (slides 126, 127)

```js run pin example-function
// predict:
function example() {
  // I just created a block
  {
    var n1 = 10;
    let n2 = 20;
  }
  console.log(n1);
  console.log(n2);
}
example();
```

```output
10
Uncaught ReferenceError: n2 is not defined
```

Run it: `console.log(n1)` prints 10, then `console.log(n2)` throws. The slide's callouts: *n1 is accusable in entire function*, *n2 is accusable only in this block*.

```diagram
{ "type": "layers", "title": "function example(): two scopes", "nodes": [ { "id": "f", "label": "function example()", "sub": "n1 lives here (var)" }, { "id": "b", "label": "{ block }", "sub": "n2 lives here (let)", "parent": "f" } ], "hi": ["b"], "caption": "n1 is accusable in entire function; n2 is accusable only in this block." }
```

## const blocks reassignment, not changes inside an object (slides 115, 116, 128, 129, 138)

`const Pi = 3.14; Pi = 90;` gives *Uncaught TypeError: Assignment to constant variable.* Slide 129 asks which of two edits to a const object fails.

```js run pin const-object
// predict:
const book = { title: "Atlas", price: 30 };
book.title = "Road Atlas";
book.price = 25;
console.log(book.title, book.price);
book = { title: "City Map", price: 5 };
console.log("not reached");
```

```output
Road Atlas 25
Uncaught TypeError: Assignment to constant variable.
```

Changing `book.title` works; `book = { title: "City Map", price: 5 };` reassigns the variable and throws, so `console.log("not reached")` never runs. So the answer to slide 116 is the primitive reassignment, or any reassignment. The slide's "only primitive variables" means object contents stay changeable. Slide 128 asks why the error is a "Type" error; the engine reports writing to a constant binding as a TypeError. Slide 138 adds a const with no value, an error before any line runs:

```js
const a;   // Uncaught SyntaxError: Missing initializer in const declaration
```

## var declarations are hoisted (slides 124, 132)

*The JavaScript engine treats all variable declarations using "var" as if they are declared at the top of a functional scope*, or of the script outside a function.

```js run pin hoist-var
// predict:
console.log(myVar);
var myVar;
myVar = 140;
console.log(myVar);
let num;
console.log(num);
```

```output
undefined
140
undefined
```

The first `console.log(myVar)` *will simply print undefined*: the declaration moved up, the value did not. Slide 124's `let num;` with no value is also `undefined`.

```js run pin hoist-let
// predict:
console.log(myLet);
let myLet;
myLet = 140;
```

```output
Uncaught ReferenceError: Cannot access 'myLet' before initialization
```

`console.log(myLet)` runs before `let myLet;`. The slide: *Will issue error and terminate execution. JS engine will NOT hoist variables declared by "let"*. In fact `let` is hoisted too but unusable until its line runs, hence `Cannot access 'myLet' before initialization`.

```diagram
{ "type": "flow", "title": "Hoisting moves the declaration", "nodes": [ { "id": "w", "label": "as written", "sub": "log(myVar); var myVar; myVar = 140;" }, { "id": "e", "label": "as the engine treats it", "sub": "var myVar; log(myVar); myVar = 140;" }, { "id": "l", "label": "log(myLet) first", "sub": "ReferenceError, script stops", "kind": "note" } ], "edges": [ { "from": "w", "to": "e", "label": "var to top" } ], "hi": ["e"], "caption": "JS engine moves declarations using var to top." }
```

### Moving the console.log above the declaration

```widget
scope-hoist
{ "preset": "hoisting", "kind": "var" }
```

## Globals and the window object (slides 130, 133, 134)

*If a variable is declared outside function, it becomes global*.

```js run pin area
// predict:
let test = 123;
function area(r) {
  var result = 0;
  if (r === 0) {
    result = 0;
  } else {
    let pi = 3.14;
    result = pi * r * r;
  }
  return result;
}
var myArea = 0;
console.log(area(1));
```

```output
3.14
```

`let test = 123` and `var myArea = 0` are global; `pi` lives in the else block and `result` in `area`.

```js run pin window-a
// predict:
var a = 10;
console.log(window.a);
let b = 10;
console.log(window.b);
```

Slide 133: *var attaches global variables to global window*, so `console.log(window.a)` prints 10; `let b` is not added, so `window.b` prints `undefined`. Re-declaring is the other difference:

```js
'use strict';
var me = 'foo';
var me = 'bar';      // No problem, me is replaced.
let myLet = 'foo';
let myLet = 'bar';   // SyntaxError: Identifier 'myLet' has already been declared
```

The slide's comment names `me`, and says strict mode; the error names `myLet` and happens without strict mode too, before any line runs.

```diagram
{ "type": "grid", "title": "let vs var (slide 134)", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "var", "row": 0, "col": 1 }, { "id": "h2", "label": "let", "row": 0, "col": 2 }, { "id": "a0", "label": "Scope", "row": 1, "col": 0 }, { "id": "a1", "label": "Function scope", "row": 1, "col": 1 }, { "id": "a2", "label": "Block scope", "row": 1, "col": 2 }, { "id": "b0", "label": "Hoisting", "row": 2, "col": 0 }, { "id": "b1", "label": "hoists declaration to top of function", "row": 2, "col": 1 }, { "id": "b2", "label": "(blank)", "row": 2, "col": 2 }, { "id": "c0", "label": "Global object (window)", "row": 3, "col": 0 }, { "id": "c1", "label": "adds to window", "row": 3, "col": 1 }, { "id": "c2", "label": "does not add to window", "row": 3, "col": 2 }, { "id": "d0", "label": "strict mode", "row": 4, "col": 0 }, { "id": "d1", "label": "Re-Declaration is ok", "row": 4, "col": 1 }, { "id": "d2", "label": "No re-declaration", "row": 4, "col": 2 } ], "caption": "let vs var summary." }
```

### var a on window, let b off it

```widget
scope-hoist
{ "preset": "window", "kind": "var" }
```

## Assignment inside a condition (a shape from the course quizzes)

```js run pin assign-in-if
// predict:
if (note = []) {
  console.log("saved");
} else {
  console.log("empty");
}
var note = "draft";
```

```output
saved
```

`var note` is hoisted, so `note = []` assigns rather than throws. An assignment gives the assigned value, and an empty array is not falsy.

## Trace four more scope programs

For each line, ask which scope holds the name and whether its declaration has run yet.

```quiz
[
  {
    "q": "What does this print?",
    "code": "function show() {\n  console.log(n);\n  var n = 2;\n  console.log(n);\n}\nshow();",
    "options": ["undefined / 2", "2 / 2", "Uncaught ReferenceError: n is not defined", "undefined / undefined"],
    "answer": 0,
    "explain": "Inside a function, `var n` is hoisted to the top of the function. The first log sees the declared but unassigned `n`: `undefined`. After `n = 2`, the second prints 2."
  },
  {
    "q": "What does this print?",
    "code": "function pack() {\n  for (var i = 0; i < 3; i++) {}\n  console.log(i);\n}\npack();",
    "options": ["3", "2", "Uncaught ReferenceError: i is not defined", "undefined"],
    "answer": 0,
    "explain": "`var i` is function-scoped, so it outlives the loop. The loop stops when `i < 3` fails, at `i = 3`."
  },
  {
    "q": "What does this print?",
    "code": "console.log(city);\nlet city = \"Delta\";",
    "options": ["Uncaught ReferenceError: Cannot access 'city' before initialization", "undefined", "Delta", "null"],
    "answer": 0,
    "explain": "A `let` cannot be read before its line runs. The slide's rule: *JS engine will NOT hoist variables declared by \"let\"*; the browser's message is *Cannot access 'city' before initialization*."
  },
  {
    "q": "What does this print?",
    "code": "if (count = 0) {\n  console.log(\"full\");\n} else {\n  console.log(\"none\");\n}\nvar count = 5;\nconsole.log(count);",
    "options": ["none / 5", "full / 5", "none / 0", "Uncaught ReferenceError: count is not defined"],
    "answer": 0,
    "explain": "`var count` is hoisted, so `count = 0` assigns 0, and 0 is falsy: `none`. Then `var count = 5` runs and the last line prints 5."
  }
]
```

```quiz
[
  {
    "q": "What does this print?",
    "code": "const price = 12;\nif (price > 10) {\n  let discount = 2;\n  discount++;\n}\nconsole.log(discount);",
    "options": ["Uncaught ReferenceError: discount is not defined", "3", "2", "undefined"],
    "answer": 0,
    "explain": "`let discount` is block-scoped: it exists only inside the `if` braces. Outside, the name was never declared."
  },
  {
    "q": "What is logged?",
    "code": "function refill() {\n  const stock = 5;\n  console.log(stock);\n  stock = stock + 1;\n}",
    "options": ["nothing", "5", "5 / Uncaught TypeError: Assignment to constant variable.", "Uncaught TypeError: Assignment to constant variable."],
    "answer": 0,
    "explain": "`refill` is declared but never called, so none of its lines run. Called, it would print 5 and then throw the TypeError."
  },
  {
    "q": "What does this print?",
    "code": "console.log(level);\nlet t = 0;\nfor (let k = 1; k < 5; k++) {\n  t += k;\n}\nvar level = 3;",
    "options": ["undefined", "3", "10", "Uncaught ReferenceError: level is not defined"],
    "answer": 0,
    "explain": "`var level` is hoisted to the top of the script with no value yet, so the first line prints `undefined`. The loop is unrelated."
  },
  {
    "q": "var: Declares a function-scoped variable.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 115, word for word. `let` and `const` are block-scoped."
  },
  {
    "q": "const will make only primitive variables constant.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 115's sentence. Truth: `const` blocks reassignment for every type (`book = {…}` throws), but an object's properties can still change (`book.title = …` works), which is what the slide means."
  },
  {
    "q": "A global variable declared with `let` is added as a property of `window`.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 134: *let does not add property to global window*. A global `var` is added: `window.a` is 10."
  },
  {
    "q": "Name the error type thrown by reading a `let` variable before its declaration line.",
    "type": "text",
    "answer": ["ReferenceError", "Reference Error"],
    "explain": "The browser prints `Uncaught ReferenceError: Cannot access '…' before initialization`. Assigning to a const is a TypeError; `const a;` with no value is a SyntaxError."
  },
  {
    "q": "Which line stops the script before anything runs?",
    "options": ["`const rate;`", "`var rate; var rate;`", "`let rate; rate = 2;`", "`const rate = 2; console.log(rate);`"],
    "answer": 0,
    "explain": "Slide 138: `const` needs a value on its own line: *Uncaught SyntaxError: Missing initializer in const declaration*. Re-declaring with `var` is fine (slide 133)."
  },
  {
    "type": "free",
    "q": "Compare `var` and `let` in three ways: scope, hoisting, and the global object.",
    "model": "`var` declares a function-scoped variable; `let` a block-scoped one (a block is the code within `{}`). `var` declarations are hoisted to the top of the function or script, so reading one early gives `undefined`; reading a `let` early throws a ReferenceError and stops the script. A global `var` becomes a property of `window`; a global `let` does not.",
    "points": ["var is function-scoped", "let is block-scoped", "var is hoisted: early read gives undefined", "let read early throws a ReferenceError", "global var is added to window, let is not"],
    "rows": 5,
    "explain": "Slides 115, 132, 133 and 134."
  }
]
```
