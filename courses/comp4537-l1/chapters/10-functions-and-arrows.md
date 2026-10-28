---
title: Every function returns something, at least undefined
minutes: 14
---

Given a function and a call, say what the console shows: the value a call hands back, the lines the function logs itself, and the `undefined` that appears when there is no `return`.

<!-- facts: s123 mul and add; s163 parameter vs argument; s166 implicit global, return undefined; s168 regular vs arrow -->

## A parameter is the name, an argument is the actual value (slide 163)

Slide 163 labels one small program. In `function greet(name)`, `name` is the *parameter*. In `greet('John')`, `'John'` is the *argument (actual value)*. When the call runs, the argument is bound to the parameter, so inside the body `name` holds `'John'` and the function logs `Hello John`.

```diagram
{ "type": "flow", "title": "Parameter and argument (slide 163)", "nodes": [ { "id": "call", "label": "greet('John')", "sub": "argument (actual value)" }, { "id": "def", "label": "function greet(name)", "sub": "parameter" }, { "id": "out", "label": "Hello John", "kind": "note" } ], "edges": [ { "from": "call", "to": "def", "label": "'John' bound to name" }, { "from": "def", "to": "out", "label": "console.log" } ], "hi": ["call", "def"], "caption": "The parameter is the name in the definition; the argument is the value in the call." }
```

## Calls nest and are worked out from the inside (slide 123)

Slide 123 asks what each of five statements prints and gives no answer. A call used as an argument runs first, and its return value takes its place.

```js run pin mul-add.js
// predict:
function mul(a, b) {
    return (a * b);
}

function add(a, b) {
    return (a + b);
}

console.log(mul(2, add(2, 3)));
console.log(add(2, mul(2, 3)));
console.log(mul(2, mul(2, 3)));
console.log(add(2, add(2, 3)));
console.log(mul(2, 3), add(2, 3));
```

```output
10
8
12
7
6 5
```

Worked out by running it: `mul(2, add(2, 3))` is `mul(2, 5)`, so 10; `add(2, mul(2, 3))` is `add(2, 6)`, so 8. The last line passes two values to one `console.log`, which prints them on one line with a space: `6 5`.

```diagram
{ "type": "tree", "title": "mul(2, add(2, 3)) from the inside out", "nodes": [ { "id": "m", "label": "mul(2, ·)", "sub": "returns 10" }, { "id": "two", "label": "2", "parent": "m" }, { "id": "a", "label": "add(2, 3)", "sub": "returns 5", "parent": "m" }, { "id": "a1", "label": "2", "parent": "a" }, { "id": "a2", "label": "3", "parent": "a" } ], "hi": ["a"], "caption": "The inner call runs first; its value 5 becomes the second argument of mul." }
```

## A function with no return gives back undefined (slide 166)

Slide 166, *Things to remember*: *"If a function does not use a return statement or an empty return statement with no value, JavaScript automatically returns undefined."* So *in JavaScript every function returns something*, at least `undefined`. The slide's three snippets, with the second function renamed so all three fit in one script:

```js run pin returns-undefined.js
// predict:
function foo() {
  k = 100;
}
console.log(foo());

function foo2() {
  k = 100;
  return;
}
console.log(foo2());

console.log(console.log('Hi!'));
console.log(window.k);
```

`console.log(foo())` prints `undefined` because `foo` ends without a `return`; `foo2` has an empty `return;`, same result. In the third, the inner call prints `Hi!` and returns `undefined`, which the outer call prints.

The last line shows the slide's other rule: *"Declaring a variable without use of var or let or const will make it global, regardless where it is defined."* `k = 100` inside the function created a global, so `window.k` is 100. That holds in the browser's normal mode; in strict mode the same assignment throws a ReferenceError. The course style (slide 164) forbids it either way.

A loop inside the function does not change this. This one adds up pages and never hands the sum back:

```js run pin no-return.js
// predict:
function countPages(chapters) {
  let pages = 0;
  for (let i = 0; i < chapters; i++) {
    pages += 12;
  }
}
console.log(countPages(3));
```

```output
undefined
```

`pages` reaches 36, but there is no `return pages;`, so `countPages(3)` is `undefined`.

## Arrow functions are a shorter way to write a function (slide 168)

Slide 168 sets regular functions beside their arrow versions: `function() {…}` becomes `() => {…}`. With one parameter the parentheses are optional, `hello = val => "Hello " + val`; *two or more parameters* need them, `sum = (a,b) => a+b`. A body without braces returns its expression.

```diagram
{ "type": "grid", "title": "Regular vs arrow (slide 168)", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "regular function", "row": 0, "col": 1 }, { "id": "h2", "label": "arrow function", "row": 0, "col": 2 }, { "id": "r1", "label": "timer callback", "row": 1, "col": 0 }, { "id": "r1a", "label": "setTimeout(function() {…}, timeout)", "row": 1, "col": 1 }, { "id": "r1b", "label": "setTimeout(() => {…}, timeout)", "row": 1, "col": 2 }, { "id": "r2", "label": "no parameter", "row": 2, "col": 0 }, { "id": "r2a", "label": "date = function() { return new Date(); }", "row": 2, "col": 1 }, { "id": "r2b", "label": "date = () => { return new Date(); }", "row": 2, "col": 2 }, { "id": "r3", "label": "one parameter", "row": 3, "col": 0 }, { "id": "r3a", "label": "", "row": 3, "col": 1 }, { "id": "r3b", "label": "hello = val => \"Hello \" + val", "row": 3, "col": 2 }, { "id": "r4", "label": "two or more", "row": 4, "col": 0 }, { "id": "r4a", "label": "", "row": 4, "col": 1 }, { "id": "r4b", "label": "sum = (a,b) => a+b", "row": 4, "col": 2 } ], "hi": ["r4b"], "caption": "Slide 168: one parameter may drop the parentheses; two or more need them." }
```

The slide assigns `date = …` and `hello = …` with no keyword, which makes implicit globals. The runnable copy declares them with `const`:

```js run pin arrows.js
// predict:
const hello = val => "Hello " + val;
const sum = (a, b) => a + b;
const date = () => {
  return new Date();
};
console.log(hello("clinic"));
console.log(sum(4, 9));
console.log(typeof date());
setTimeout(() => {
  console.log("arrow callback ran");
}, 500);
```

```output
Hello clinic
13
object
arrow callback ran
```

`typeof date()` is `object` because a `Date` is an object. The callback passed to `setTimeout` runs half a second later.

## A function can return a function

Beyond the slides, in a shape from the course quizzes: a function that returns another function. Calling the result runs the inner one.

```js run pin returns-a-function.js
// predict:
function makeReminder(patient) {
  return function () {
    console.log("Reminder for " + patient);
  };
}
const remindAna = makeReminder("Ana");
remindAna();
console.log(makeReminder("Ben")());
```

```output
Reminder for Ana
Reminder for Ben
undefined
```

`makeReminder("Ben")()` calls the returned function, which logs `Reminder for Ben` and has no `return`, so the outer `console.log` adds `undefined`. The inner function still sees `patient` after `makeReminder` has finished.

## Trace four calls at a clinic's front desk

New programs. Write each output on paper first.

```quiz
[
  {
    "q": "What does this print?",
    "code": "function fee(visits, rate) {\n  return visits * rate;\n}\nlet owed = fee(3, 20) - fee(2, 15);\nconsole.log(owed);",
    "options": ["30", "60", "90", "-30"],
    "answer": 0,
    "explain": "Each call is replaced by its return value: `fee(3, 20)` is 60, `fee(2, 15)` is 30, and 60 - 30 = 30."
  },
  {
    "q": "What does this print?",
    "code": "function triage(level) {\n  if (level === 1) {\n    return \"now\";\n  } else if (level === 2) {\n    return \"soon\";\n  } else {\n    return \"wait\";\n  }\n}\nconsole.log(triage(\"1\"));",
    "options": ["wait", "now", "soon", "undefined"],
    "answer": 0,
    "explain": "The argument is the string `\"1\"`. `===` does no type conversion, so `\"1\" === 1` is false, and so is the second test; the `else` branch returns `wait`."
  },
  {
    "q": "What does this print?",
    "code": "function label(first, second) {\n  console.log(first + \", \" + second);\n}\nlet a = 4;\nlet b = 9;\nlabel(b, a);",
    "options": ["9, 4", "4, 9", "13", "first, second"],
    "answer": 0,
    "explain": "Arguments bind to parameters by position, not by name: `first` gets `b` (9) and `second` gets `a` (4)."
  },
  {
    "q": "What does this print?",
    "code": "function isLate(minutes) {\n  return minutes > 15;\n}\nisLate(20);",
    "options": ["nothing", "true", "false", "undefined"],
    "answer": 0,
    "explain": "`isLate(20)` returns `true`, but nothing logs it. A return value is handed back to the caller; only `console.log` prints."
  }
]
```

```challenge
{ "lang": "js", "prompt": "Write an arrow function <code>totalFee</code> with two parameters, <code>visits</code> and <code>rate</code>, that returns their product. Write a regular function <code>show(d)</code> that logs <code>\"Fee: \"</code> followed by <code>d</code>. Then make the program print the fee for 3 visits at 25.", "starter": "// totalFee: an arrow function\n\n// show: a regular function\n\n// one line that prints the fee\n", "expected": "Fee: 75", "hints": ["Two parameters need parentheses: <code>(visits, rate) => visits * rate</code>.", "Pass the call as the argument: <code>show(totalFee(3, 25))</code>."], "solution": "const totalFee = (visits, rate) => visits * rate;\nfunction show(d) {\n  console.log(\"Fee: \" + d);\n}\nshow(totalFee(3, 25));\n" }
```

```quiz
[
  {
    "q": "In `function lend(title) { … }` called as `lend(\"Emma\")`, what are `title` and `\"Emma\"`?",
    "options": ["title is the parameter, \"Emma\" is the argument", "title is the argument, \"Emma\" is the parameter", "both are parameters", "title is a property, \"Emma\" is its value"],
    "answer": 0,
    "explain": "Slide 163: the parameter is the name in the definition; the argument is the *actual value* passed in the call."
  },
  {
    "q": "What does this print?",
    "code": "function area(w, h) {\n  return w * h;\n}\nfunction half(n) {\n  return n / 2;\n}\nconsole.log(half(area(4, 5)), area(2, half(6)));",
    "options": ["10 6", "10 12", "20 6", "10, 6"],
    "answer": 0,
    "explain": "Inside out: `area(4, 5)` is 20, half of it 10. `half(6)` is 3, `area(2, 3)` is 6. Two values in one `console.log` print on one line separated by a space."
  },
  {
    "q": "What does this print?",
    "code": "function canBook(seats) {\n  return seats >= 3;\n}\nconsole.log(canBook(7));",
    "options": ["true", "7", "false", "seats >= 3"],
    "answer": 0,
    "explain": "The function returns the result of the comparison, `7 >= 3`, which is the boolean `true`."
  },
  {
    "q": "What does this print?",
    "code": "function greet(name) {\n  console.log(\"Welcome \" + name);\n}\nlet r = greet(\"Mo\");\nconsole.log(r);",
    "options": ["Welcome Mo / undefined", "Welcome Mo", "undefined / Welcome Mo", "Welcome Mo / Welcome Mo"],
    "answer": 0,
    "explain": "The call logs `Welcome Mo` itself. It has no `return`, so `r` is `undefined` and the second line prints it (slide 166)."
  },
  {
    "q": "If a function does not use a return statement, JavaScript automatically returns null.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 166: it *automatically returns undefined*, not `null`. The same goes for an empty `return;`."
  },
  {
    "q": "Declaring a variable without var, let or const inside a function keeps it local to that function.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 166: it *will make it global, regardless where it is defined*. That is the browser's normal mode; strict mode throws a ReferenceError instead."
  },
  {
    "q": "According to slide 168, when must an arrow function's parameters be in parentheses?",
    "options": ["when there are two or more parameters", "when there is exactly one parameter", "only when the body has curly braces", "never; they are always optional"],
    "answer": 0,
    "explain": "Slide 168: one parameter may be written `val =>` or `(val) =>`; two or more need them, `(a,b) => a+b`."
  },
  {
    "q": "What does this print?",
    "code": "function roomCaller(room) {\n  return function () {\n    console.log(\"Room \" + room + \" is ready\");\n  };\n}\nconsole.log(roomCaller(4)());",
    "options": ["Room 4 is ready / undefined", "Room 4 is ready", "undefined", "an error: roomCaller(4) is not a function"],
    "answer": 0,
    "explain": "`roomCaller(4)` returns the inner function; the second `()` calls it, which logs `Room 4 is ready`. The inner function has no `return`, so the outer `console.log` prints `undefined`."
  },
  {
    "type": "free",
    "q": "Explain the difference between a parameter and an argument, and say what this prints: `function note(t) { console.log(t); }` then `console.log(note(\"milk\"));`",
    "model": "A parameter is the name in the function definition (`t`); an argument is the actual value passed in the call (`\"milk\"`), which is bound to the parameter when the call runs. The program prints `milk` (logged inside the function) and then `undefined`, because `note` has no return statement and every function returns at least undefined.",
    "points": ["parameter: the name in the definition", "argument: the actual value in the call", "the argument is bound to the parameter when the function runs", "prints milk first", "then undefined, because there is no return"],
    "rows": 5,
    "explain": "Slide 163 for the two terms, slide 166 for the `undefined`."
  }
]
```
