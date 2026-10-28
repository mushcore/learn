---
title: Four review programs, block scope, hoisting and the event queue
minutes: 12
---

Four short programs carry most of lecture 3's review: where a variable is visible, what an early read prints, and when a timer's callback runs.

<!-- facts: slide 2 outline; slide 3 labs; slide 4 prior courses; slide 5 question; slide 6 JSON; slides 7-8 web storage; slides 9-10 var let const; slide 11 three columns; slide 12 A B C; slide 13 hoisting; slide 14 const first, undeclared; slide 15 == vs ===; slide 16 event queue -->

## The deck has five parts (slide 2)

```diagram
{ "type": "tree", "title": "Lecture 3 in five parts", "nodes": [ { "id": "l3", "label": "Lecture 3" }, { "id": "p1", "label": "1 Review", "parent": "l3" }, { "id": "p2", "label": "2 Why Web APIs", "sub": "online movie store", "parent": "l3" }, { "id": "p3", "label": "3 Anatomy", "parent": "l3" }, { "id": "p4", "label": "4 Postman", "parent": "l3" }, { "id": "p5", "label": "5 RESTful style", "sub": "principles, microservices", "parent": "l3" } ], "hi": ["p1"], "caption": "The outline: review, why we need Web APIs, their anatomy, Postman, and an intro to RESTful architecture style with its five principles, microservices and an example." }
```

The other review slides:

| Slide | What it says |
|---|---|
| 3 | Lab0 was the four review quizzes on week 1 content; Lab1 was based on the week 2 material. |
| 4 | Prior courses: COMP1537 (JavaScript classes and objects, functions as objects, how JSON is utilized), COMP2537 (serve web content, routing framework, asynchronous programming), COMP1630 (basic Select statement; Group BY, Having, Correlated subqueries). |
| 5 | How to compromise between reviewing and moving on; no answer on the slide. |
| 6 | *JSON is a way of converting an object into a string*: `JSON.stringify(myObj)` turns an object into a string, `JSON.parse(myJSON)` turns it back. Worked out: the types are string, number, bigint, boolean, undefined, symbol, null and object; `typeof (null)` is `"object"`. |
| 7 | localStorage and sessionStorage: *They are more secure compared* to cookies*, footnoted *secure compared to cookie, not fully secure*; *local storage is permanent, but session storage expires*; same origin, same browser; *Web storage only handles string key/value pairs.* `sessionStorage.getItem("key")` returns *string…. or null*. |
| 8 | An object can go into localStorage: *yes, via JSON*. |
| 9 | The topics: let, const, var, Hoisting, Set time out. |
| 10 | Worked out: `typeof []` is `"object"`; `Array.isArray` tests for an array. *var: Declares a function-scoped variable.* *let: Declares a block-scoped, variable.* *const … cannot be re-assigned after assigned once.* |
| 14 | Which to choose: *first const, then let and never var.* A variable used without declaring it *becomes global scope*. |
| 15 | *The == (or !=) operator performs an automatic type conversion if needed.* *The === (or !==) operator will not perform any type conversion. It first compares if both sides have the same type, then compares the values*. Worked out: a function can return a function and accept one as an argument. |

Slide 7's security claim is the slide's: any script on the page can read web storage, while a cookie can be marked HttpOnly. Slide 14's global variable happens only outside strict mode; in strict mode the assignment throws a ReferenceError.

## var leaks out of a block, let and const do not (slide 11)

```js run pin scope of var, let and const
// predict: Write the three lines this prints.
{
  var a = 10;
}
console.log(a);

try {
  {
    let b = 10;
  }
  console.log(b);
} catch (e) {
  console.log(e.name);
}

try {
  {
    const c = 10;
  }
  console.log(c);
} catch (e) {
  console.log(e.name);
}
```

```output
10
ReferenceError
ReferenceError
```

`var a = 10;` belongs to the whole script, so the braces do not hide it and `console.log(a)` prints 10. `let b` and `const c` live only inside their braces, so reading them afterwards fails. The `try` only keeps the script going; on the slide each column stops with Chrome's line:

```text
Uncaught ReferenceError: a is not defined
```

```diagram
{ "type": "grid", "title": "What does console.log(a) print?", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "var", "row": 0, "col": 1 }, { "id": "h2", "label": "let", "row": 0, "col": 2 }, { "id": "h3", "label": "const", "row": 0, "col": 3 }, { "id": "p0", "label": "Prints", "row": 1, "col": 0 }, { "id": "p1", "label": "10", "row": 1, "col": 1 }, { "id": "p2", "label": "Uncaught ReferenceError: a is not defined", "row": 1, "col": 2 }, { "id": "p3", "label": "Uncaught ReferenceError: a is not defined", "row": 1, "col": 3 }, { "id": "s0", "label": "Scope", "row": 2, "col": 0 }, { "id": "s1", "label": "Function scoped", "row": 2, "col": 1 }, { "id": "s2", "label": "Block Scoped", "row": 2, "col": 2 }, { "id": "s3", "label": "Block Scoped", "row": 2, "col": 3 } ], "hi": ["p1", "s1"], "caption": "Slide 11's answer table: only the var column prints." }
```

## Scenarios A, B and C (slide 12)

Slide 13 answers it. One script cannot declare both `var n` and `let n`, so each scenario gets its own name.

```js run pin scenarios A, B and C
// predict: Write what A, B and C print, in order.
// A
console.log(nA);
var nA = 150;

// B
var nB = 150;
console.log(nB);

// C
try {
  console.log(nC);
} catch (e) {
  console.log(e.name);
}
let nC = 150;
```

```output
undefined
150
ReferenceError
```

A reads `nA` before its line and gets `undefined`, not an error. B reads after the assignment and gets 150. C reads `nC` before `let nC = 150;` and throws; in Chrome the line is `Uncaught ReferenceError: Cannot access 'n' before initialization`.

## Only var declarations move to the top (slide 13)

```js run pin myVar and myLet
// predict: Write every line printed.
console.log(myVar); // will not issue error
var myVar;
myVar = 140;
console.log(myVar);

try {
  console.log(myLet); // will issue error
} catch (e) {
  console.log(e.name);
}
let myLet;
myLet = 140;
```

```output
undefined
140
ReferenceError
```

Slide 13's rule: *The JavaScript engine treats all variable declarations using "var" as if they are declared at the top of a functional scope (if declared inside a function, if not as if they are declared at top of the script)*. Only the declaration `var myVar;` moves; the value from `myVar = 140;` arrives on its own line, so the first read is `undefined`.

```diagram
{ "type": "flow", "title": "var declarations move to the top", "nodes": [ { "id": "decl", "label": "var myVar;", "sub": "JS engine moves declarations using var to top" }, { "id": "log", "label": "console.log(myVar)", "sub": "It will simply print undefined" }, { "id": "set", "label": "myVar = 140;" } ], "edges": [ { "from": "decl", "to": "log" }, { "from": "log", "to": "set" } ], "hi": ["decl"], "caption": "The first screenshot as the engine runs it: the declaration first, so the read does not issue an error." }
```

```diagram
{ "type": "flow", "title": "let declarations stay where they are", "nodes": [ { "id": "log", "label": "console.log(myLet)", "sub": "Will issue error and terminate execution" }, { "id": "decl", "label": "let myLet;" }, { "id": "note", "label": "JS engine will NOT hoist variables declared by let", "kind": "note" } ], "edges": [ { "from": "log", "to": "decl" } ], "hi": ["log"], "caption": "The second screenshot: let stays on its own line, so the read above it fails." }
```

The slide's wording is the exam's. In the engine, `let` is hoisted too but stays uninitialised until its line runs, which is why the read throws instead of printing `undefined`.

## The event queue prints 1 3 2 (slide 16)

```js run pin the event queue
// predict: Write the three lines in order.
console.log(1);
setTimeout(function () {
    console.log(2);
}, 1000);
console.log(3);
```

```output
1
3
2
```

`setTimeout` hands its function to the browser and returns at once, so `console.log(3)` runs before the timer's callback. Slide 16 then asks *What if we replace 1000 with 0 ?* Edit `1000` to `0` and run again: still 1, 3, 2.

### A 0 ms timer still waits for the script to finish

Watch the callback wait in the timer queue while the script finishes.

```widget
event-loop-play
{ "preset": "1 3 2", "predict": true }
```

The callback can run only when the call stack is empty, and the script's last `console.log` is still on it.

```quiz
[
  { "q": "What does this print?", "code": "for (let i = 0; i < 2; i++) {\n  const step = i * 5;\n}\nconsole.log(step);", "options": ["Uncaught ReferenceError: step is not defined", "5", "undefined", "0"], "answer": 0, "explain": "`const step` is block-scoped: it exists only inside the loop's braces. Outside, Chrome stops with `Uncaught ReferenceError: step is not defined`, the same failure as slide 11's const column." },
  { "q": "What does this print?", "code": "console.log(total);\nif (true) {\n  var total = 40;\n}\nconsole.log(total);", "options": ["undefined, then 40", "Uncaught ReferenceError: total is not defined", "40, then 40", "undefined, then undefined"], "answer": 0, "explain": "`var` is function-scoped, so the `if` braces do not contain it, and its declaration is hoisted to the top of the script. The first read is `undefined`; after the assignment runs, the second prints 40." },
  { "q": "What does this print, line by line?", "code": "console.log(\"open\");\nsetTimeout(function () {\n  console.log(\"timer\");\n}, 0);\nconsole.log(\"close\");", "options": ["open, close, timer", "open, timer, close", "timer, open, close", "open, close"], "answer": 0, "explain": "A 0 ms timer still puts its callback in the event queue, and the queue is served only after the script finishes. So `close` prints before `timer`, as slide 16 shows with 1, 3, 2." },
  { "q": "Slide 10: *var: Declares a block-scoped variable.*", "type": "tf", "answer": false, "explain": "The slide says *var: Declares a function-scoped variable.* It is `let` and `const` that are block-scoped." },
  { "q": "When declaring a variable, what order of preference does slide 14 give?", "options": ["first const, then let and never var", "first let, then const and never var", "first var, then let, then const", "first const, then var and never let"], "answer": 0, "explain": "Slide 14: *first const, then let and never var.*" },
  { "q": "`let v = sessionStorage.getItem(\"city\");` What can `v` hold afterwards?", "options": ["a string or null", "a string only", "any type that was stored", "undefined when the key is missing"], "answer": 0, "explain": "*Web storage only handles string key/value pairs*, so a stored value comes back as a string, and a missing key gives `null` (slide 7: *string…. or null*)." },
  { "q": "Slide 13: the JS engine will NOT hoist variables declared by let.", "type": "tf", "answer": true, "explain": "True as the slide words it, and the practical effect matches: reading a `let` before its line throws. In the engine, `let` is hoisted but left uninitialised (the temporal dead zone) until its declaration runs." }
]
```
