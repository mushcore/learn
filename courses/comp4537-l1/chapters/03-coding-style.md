---
title: const first, never var, and no hard-coded user-facing strings
minutes: 12
---

Every lab in the course is marked against the same coding style, from Lab 1 on. The rules fit on two slides; this lesson states them and shows code that follows them.

<!-- facts: slide 16 rules in order, crossed-out displayMessage, %1 tip; slide 164 four tips; slide 165 calcSum split, "Mode modular, more rideability"; Lab 1 CODING STYLE for the ENTIRE COURSE and its -1 deductions -->

## The rules on slide 16

Slide 16 is titled *Coding style to follow in this course (recommended)*. Its rules, in order:

- **Variable declaration.** *Use `const` first and `let` for variable declarations to ensure block-level scoping, with `const` being the default choice for variables that don't change. And never use var.* Choose clear and descriptive names. *If a variable is not meant to be global, it should not be declared as such.*
- **Object-oriented practices.** Use classes and constructor functions to encapsulate and manage related data and behaviours.
- **Function length.** *A function focuses on a single task. Avoid side effects in functions*; it should perform one action or calculate and return a value from its inputs. It has to be short: *a function should fit on a screen without scrolling*.
- **String and user message management.** Store user-facing strings, like error messages and UI labels, in separate files (JS or JSON) *for easy management and localization*. *Absolutely no hard coded user facing string messages anywhere in your assignment code or you will lose mark.* *Consider implementing a centralized message displaying mechanism.*

The slide crosses out a screenshot of the composition example in which `Engine`'s `start()` calls `displayMessage(`Starting the ${this.type} engine...`)`. The text the user reads sits inside the class, which is exactly what the last rule forbids.

The orange box asks how to store a dynamic string, one built from text and a variable, such as a message that ends *for today*. The tip: *Store it like "Your score is %1 for today"*. The string file holds the sentence with a placeholder, and the code fills in the value when it displays it.

## Slide 164 says it again as four tips

1. *Chose let and const, over var. In fact you do not need var, so your code has to be "var" free!*
2. Avoid global variables when you don't have to.
3. *Do not use hard coded strings in your code. Move them all in a separate file and define const string variables* and use those variables in the code.
4. *Separation of concerns: each function is responsible to deliver one single simple task, not more.*

The Lab 1 marking sheet puts a number on three of them: −1 for using `var`, −1 for a variable declared global that need not be, −1 for hard-coded strings.

## One function, one task (slide 165)

Slide 165 takes a `calcSum(k)` that both sums 1 to k and logs the sum, and breaks it in two: *Mode modular, more rideability* (more modular, more readability). Below is the split version, written in the course style.

```js run pin calc-sum-split.js
// predict: What does this print?
const k = 4;

// this function does one thing: calculates the sum
function calcSum(k) {
  let sum = 0;
  for (let i = 1; i <= k; i++) {
    sum = sum + i;
  }
  return sum;
}

// this function does one thing: displays d on the console
function display(d) {
  console.log("result is: " + d);
}

const result = calcSum(k);
display(result);
```

```output
result is: 10
```

`calcSum` only computes and `return sum` hands the value back; `display(d)` only prints. 1 + 2 + 3 + 4 = 10. The sum can now go to a page, a log or a test without touching the arithmetic.

The slide's own code differs in two places:

```js
function calcSum(k) {
    sum = 0;               // no let: sum becomes a global
    for (let i = 1; i <= k; i++) {
        sum = sum + i;
    }
    return (sum);
}
let result = calcSum(k);   // k was never defined
display(result);
```

`sum = 0;` has no `let`, so it creates a global variable, which breaks tip 2. And `calcSum(k)` is called with a `k` that was never declared, so the slide's version stops with a ReferenceError.

```diagram
{ "type": "flow", "title": "calcSum split in two", "nodes": [ { "id": "old", "label": "calcSum(k)", "sub": "sums and logs" }, { "id": "calc", "label": "calcSum(k)", "sub": "returns sum" }, { "id": "disp", "label": "display(d)", "sub": "logs result is: d" }, { "id": "call", "label": "calcSum(k), then display(result)", "kind": "note" } ], "edges": [ { "from": "old", "to": "calc", "label": "sum loop" }, { "from": "calc", "to": "disp", "label": "console.log" }, { "from": "call", "to": "disp", "dashed": true } ], "hi": ["calc", "disp"], "caption": "Each function is responsible to deliver one single simple task, not more." }
```

## Strings live in one file

Lab 1's *CODING STYLE for the ENTIRE COURSE* turns the rules into a structure: write everything in classes with minimal code outside them, at least three classes each with a constructor, properties and methods, one responsibility per class, and every user-facing string (button labels, error messages, titles, prompts, UI text) in a separate file such as `strings.js` that the classes reference. No globals except those strings.

The program below follows that shape for a clinic check-in desk. In a real lab the two parts are two files; here they share one block. The slide gives the `%1` storage tip; the `replace` call that fills it in is worked out.

```js run pin message-template.js
// predict: Write the four lines this prints.
// strings.js: every user-facing message in one place
const MESSAGES = {
  WELCOME: "Welcome to the clinic",
  WAIT: "Your wait time is %1 minutes",
  ERROR_EMPTY: "Please enter your name",
};

// CheckInDesk.js: one responsibility, no text of its own
class CheckInDesk {
  constructor(messages) {
    this.messages = messages;
    this.queue = [];
  }

  format(msg, value) {
    return msg.replace("%1", value);
  }

  checkIn(name) {
    if (!name) {
      return this.messages.ERROR_EMPTY;
    }
    this.queue.push(name);
    return this.format(this.messages.WAIT, this.queue.length * 15);
  }
}

const desk = new CheckInDesk(MESSAGES);
console.log(MESSAGES.WELCOME);
console.log(desk.checkIn("Ana"));
console.log(desk.checkIn(""));
console.log(desk.checkIn("Ben"));
```

```output
Welcome to the clinic
Your wait time is 15 minutes
Please enter your name
Your wait time is 30 minutes
```

`CheckInDesk` holds no sentence of its own. The empty name returns `this.messages.ERROR_EMPTY` and leaves the queue alone, so Ben is second: 2 × 15 = 30. Translating the page means editing `MESSAGES` only.

```diagram
{ "type": "flow", "title": "Strings live in one file", "nodes": [ { "id": "str", "label": "strings.js", "sub": "MESSAGES", "kind": "note" }, { "id": "desk", "label": "CheckInDesk", "sub": "queue, checkIn()" }, { "id": "ui", "label": "UserInterface", "sub": "shows a message" }, { "id": "page", "label": "page", "kind": "pill" } ], "edges": [ { "from": "str", "to": "desk", "label": "reads" }, { "from": "desk", "to": "ui", "label": "message" }, { "from": "ui", "to": "page" } ], "hi": ["str"], "caption": "Store user-facing strings, like error messages and UI labels, in separate files." }
```

## Bring three functions up to the course style

Each item is a new function. Decide what the style rules say, and for the program, what it really prints.

```quiz
[
  {
    "q": "This runs as a classic browser script. What does it print?",
    "code": "function addFee(price) {\n  total = price + 5;\n  return total;\n}\naddFee(20);\nconsole.log(total);\nconsole.log(addFee(1) + total);",
    "options": ["25\n12", "25\n31", "Uncaught ReferenceError: total is not defined", "undefined\n6"],
    "answer": 0,
    "explain": "`total = price + 5;` has no `let` or `const`, so it creates a global `total`, readable outside the function: 25. In the last line `addFee(1)` runs first, sets the global to 6 and returns 6, then `total` is read as 6: 6 + 6 = 12. This is the hidden global that slide 164's tip 2 and Lab 1's −1 deduction are about. In a module or `'use strict'` the first call would throw instead."
  },
  {
    "q": "Click every line that breaks the course style.",
    "type": "spotbug",
    "code": "class Recipe {\n  constructor(title) {\n    this.title = title;\n  }\n  show() {\n    var servings = 4;\n    alert(\"Recipe saved!\");\n    return this.title + \" serves \" + servings;\n  }\n}",
    "answer": [6, 7],
    "explain": "Line 6 uses `var`; the rule is `const` first, then `let`, never `var` (here `const servings = 4;`). Line 7 shows a hard-coded user-facing string; it belongs in the strings file, e.g. `alert(MESSAGES.SAVED)`. Line 8 builds text from the object's own data, which is not a stored message."
  },
  {
    "q": "A notes page has `function saveNote(text) { notes.push(text); console.log(\"Saved \" + notes.length + \" notes\"); }`. Which rewrite follows slide 165?",
    "options": [
      "`saveNote(text)` pushes and returns `notes.length`; a separate `display(n)` shows the message from the strings file",
      "Keep one function but rename it `saveAndShowNote`",
      "Move `console.log` to the first line of `saveNote`",
      "Declare `notes` with `var` inside `saveNote`"
    ],
    "answer": 0,
    "explain": "Separation of concerns: one function stores and returns a value, another displays it, as `calcSum` and `display` do. Renaming or reordering keeps two tasks in one function, and `var` is never allowed (inside the function it would also empty the list on every call)."
  },
  {
    "q": "A bookstore page must show *You have 3 books in your cart*, with the number changing. Following slide 16's tip, what goes in the strings file?",
    "options": [
      "\"You have %1 books in your cart\"",
      "\"You have 3 books in your cart\"",
      "Nothing; build the sentence in the class with a template string",
      "One string per possible number of books"
    ],
    "answer": 0,
    "explain": "*Store it like \"Your score is %1 for today\"*: the stored sentence keeps a placeholder and the code fills in the value. A template string inside the class is a hard-coded user-facing string, which loses marks."
  }
]
```

```quiz
[
  {
    "q": "Slide 16: *Use `const` first and `let` for variable declarations … with `let` being the default choice for variables that don't change.*",
    "type": "tf",
    "answer": false,
    "explain": "`const` is the default choice for variables that don't change. `let` is for values that will be reassigned, and `var` is never used."
  },
  {
    "q": "Which declaration keyword must never appear in code for this course?",
    "type": "text",
    "answer": ["var"],
    "explain": "Slide 164: *you do not need var, so your code has to be \"var\" free!* Lab 1 takes a mark off for it."
  },
  {
    "q": "Where does slide 16 say user-facing strings such as error messages and UI labels belong?",
    "options": [
      "In separate files (e.g. JS or JSON), for easy management and localization",
      "Inside the class that displays them, as template strings",
      "In the HTML file, inside each button",
      "In global `var` variables at the top of each function"
    ],
    "answer": 0,
    "explain": "*Store user-facing strings, like error messages and UI labels, in separate files (e.g., JS or JSON) for easy management and localization.* Lab 1 names the file `strings.js`."
  },
  {
    "q": "Slide 16 gives a rule of thumb for how long a function may be. Which is it?",
    "options": [
      "It should fit on a screen without scrolling",
      "At most ten lines",
      "One function per class",
      "It should not contain a loop"
    ],
    "answer": 0,
    "explain": "*Has to be short; a good rule of thumb is that a function should fit on a screen without scrolling.* The companion rule: a function focuses on a single task."
  },
  {
    "q": "Which statement about slide 165's own `calcSum` code is true?",
    "options": [
      "`sum = 0;` without `let` makes `sum` a global variable",
      "It uses `var` for the loop counter",
      "`display` returns the sum",
      "It follows every tip on slide 164"
    ],
    "answer": 0,
    "explain": "An assignment with no declaration creates a global, against tip 2, and `k` is never defined before `calcSum(k)`. The loop counter is `let i`, and `display` only logs."
  },
  {
    "q": "*Separation of concerns: each function is responsible to deliver one single simple task, not more.*",
    "type": "tf",
    "answer": true,
    "explain": "Slide 164's fourth tip, worked on slide 165: `calcSum` computes, `display` shows."
  },
  {
    "type": "free",
    "q": "Rewrite this weather function so it follows the course style, and say what you changed: `function showTemp(c) { var f = c * 9 / 5 + 32; console.log(\"Temperature: \" + f + \" F\"); }`",
    "model": "Split it in two and move the text out. `const MESSAGES = { TEMP: \"Temperature: %1 F\" };` `function toFahrenheit(c) { const f = c * 9 / 5 + 32; return f; }` `function display(msg, value) { console.log(msg.replace(\"%1\", value)); }` and call `display(MESSAGES.TEMP, toFahrenheit(20));`. The converter only calculates and returns; the display function only shows; `var` became `const`; the user-facing sentence lives in the strings object with a `%1` placeholder.",
    "points": [
      "the calculation returns the value instead of logging it",
      "a separate function displays the result",
      "`var` replaced by `const` (or `let`)",
      "the user-facing text moved to a strings file or object, with a placeholder for the value",
      "no new global variables"
    ],
    "rows": 6,
    "explain": "Slide 165's split applied to a new function, plus slide 16's string rule and slide 164's `var`-free rule."
  }
]
```
