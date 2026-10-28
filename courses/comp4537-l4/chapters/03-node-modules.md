---
title: Modules with require and exports
minutes: 15
---

A server file grows quickly. Node.js lets you move functions into a separate file, a module, and load it by path, which is how every later example in the deck is built.

<!-- facts: slide 25 install and debug PDF, develop a web server at your pc; slide 26 hello.js Hello Wold, console.log like System.out.println, Run menu shortcuts, DEBUG CONSOLE; slide 27 File Preferences Color Theme; slide 28 test.js PI 3.14 r 10 breakpoint line 2 314.0000 bad function name; slide 30 module = JavaScript library, set of functions; slide 31 modules/math.js, ./ same folder, .js optional, PI 3.1416, exports.area r*PI*2 -->

## A Node.js file runs from VS Code (slides 25 to 27)

Slide 25 points to the course's install-and-debug PDF: *Using Nodejs you can easily develop a web server at your pc. Then you send requests from your browser or the html files stored in your machine to the nodejs server you have developed.* VS Code itself is not on the midterm; the debugging steps are here because every later example uses them.

### Example 1, Hello world (slide 26)

```js pin hello.js
console.log("Hello Wold");
```

*Here console.log acts like System.out.println() in Java*: `console.log` writes one line to the output. Started with Run › Start Debugging, the output appears in VS Code's DEBUG CONSOLE, with `"Hello Wold"` exactly as typed (the slide's spelling):

```text
C:\Program Files\nodejs\node.exe .\hello.js
Hello Wold
```

The first line is the command VS Code ran: Node's program with the file name. The Run menu holds the debugger's keys:

| command | key |
|---|---|
| Start Debugging | F5 |
| Run Without Debugging | Ctrl+F5 |
| Stop Debugging | Shift+F5 |
| Restart Debugging | Ctrl+Shift+F5 |
| Step Over | F10 |
| Step Into | F11 |
| Step Out | Shift+F11 |

Slide 27 adds that File › Preferences › Color Theme changes the editor's look.

### Example 2, area calculation (slide 28)

```js pin test.js
const PI=3.14
let r = 10;
let area = r*PI*PI

console.log('area:');
console.log(area);

```

*Note the break point on the line 2*: a red dot in the gutter beside `let r = 10;` pauses the program there under F5, before `let area = r*PI*PI` runs. The slide's DEBUG CONSOLE shows:

```text
C:\Program Files\nodejs\node.exe .\test.js
area:
314.0000
```

```diagram
{ "type": "flow", "title": "Debugging test.js", "nodes": [ { "id": "bp", "label": "set breakpoint on line 2" }, { "id": "f5", "label": "Run › Start Debugging", "sub": "F5" }, { "id": "pause", "label": "execution pauses" }, { "id": "out", "label": "DEBUG CONSOLE shows output" } ], "edges": [ { "from": "bp", "to": "f5" }, { "from": "f5", "to": "pause" }, { "from": "pause", "to": "out", "label": "continue" } ], "caption": "The slide's steps drawn: note the break point on the line 2." }
```

### The printed 314 does not come from this code

The slide itself objects: *Bad function identifier/name !Do we really calculate the area of circle like this? Or is it just circumference*. The program has no Node API, so it runs here unchanged.

```js run pin area check
// predict: What does the second line print?
const PI=3.14
let r = 10;
let area = r*PI*PI

console.log('area:');
console.log(area);
```

```output
area:
98.596
```

`r*PI*PI` is 10 × 3.14 × 3.14 = 98.596, and `console.log(area)` prints exactly that. The area of a circle is `PI*r*r` = 3.14 × 100 = 314, the number on the slide, and Node prints it as `314`, not `314.0000`.

## A module is a set of functions (slides 30 and 31)

*Consider modules to be the same as JavaScript libraries.* *A set of functions you want to include in your application.* Slide 31's project:

```diagram
{ "type": "tree", "title": "INTRO", "nodes": [ { "id": "root", "label": "INTRO" }, { "id": "mods", "label": "modules", "parent": "root" }, { "id": "math", "label": "math.js", "parent": "mods" }, { "id": "hello", "label": "hello.js", "parent": "root" }, { "id": "test", "label": "test.js", "parent": "root" }, { "id": "twm", "label": "testWithModule.js", "parent": "root" } ], "hi": ["math", "twm"], "caption": "Notice that we use ./ to locate the folder of our module." }
```

### The module adds its function to exports

```js pin modules/math.js
const PI = 3.1416;
exports.area =
function (r) {
    return r*PI*2;
};
```

*Our module math.js is located at modules/math.js.* Whatever the file attaches to `exports` is what a caller receives; here `exports.area` is a function. `PI` is not exported, so it stays private to the module. Note `r*PI*2`: that is the circumference again.

### The caller loads it with require

```js pin testWithModule.js
const mo = require('./modules/math');
console.log(mo.area(2));

```

`require('./modules/math')` returns the module's `exports` object, stored in `mo`. Slide 31's two red numbers:

1. *Notice that we use ./ to locate the folder of our module. That means that the folder is located in the same folder as the main Node.js file.*
2. *Notice we don't need to include the .js when we import the module (its optional)*.

The slide shows no output. Worked out, not on the slide: `mo.area(2)` is 2 × 3.1416 × 2.

```text
12.5664
```

With r = 2 the circumference 2πr and the area πr² happen to be the same number, so this call hides the bug; `mo.area(3)` gives 18.8496 against a true area of 28.2744.

```diagram
{ "type": "flow", "title": "require and exports", "nodes": [ { "id": "caller", "label": "testWithModule.js" }, { "id": "mod", "label": "modules/math.js" } ], "edges": [ { "from": "caller", "to": "mod", "label": "require('./modules/math')" }, { "from": "mod", "to": "caller", "label": "exports.area" } ], "hi": ["mod"], "caption": "The .js is optional; ./ means the same folder as the main Node.js file." }
```

## Built-in modules need no path

Not on these slides, from the later lectures: `http`, `url` and `fs` ship with Node.js, so they load by name, as in `require('http')` (slide 33 calls it a *build-in module*). `os` and `path` are built in too. `mysql` is not: lecture 5 installs it with `npm install mysql` first. A name without `./` asks for a built-in or installed module; a path starting with `./` asks for your own file.

## Write a converter module for a weather service

A weather service stores Celsius readings and wants Fahrenheit; write the first item before reading the pin, its model answer.

```js pin modules/temperature.js
exports.toF = function (c) {
    return c * 9 / 5 + 32;
};
```

`exports.toF` is what the caller's `require` returns, and `return c * 9 / 5 + 32;` is the conversion.

```quiz
[
  { "type": "free", "q": "Write `modules/temperature.js` exporting `toF(c)`, and a main file in the parent folder that loads it and prints `toF(100)`.", "model": "Module: `exports.toF = function (c) { return c * 9 / 5 + 32; };` Main file: `const t = require('./modules/temperature'); console.log(t.toF(100));` prints `212`.", "points": ["the function is attached to `exports` as `toF`", "the formula is c * 9 / 5 + 32", "the main file calls `require('./modules/temperature')` with ./ and no .js needed", "it calls the function through the returned object: `t.toF(100)`", "it prints 212"], "rows": 6, "explain": "Slide 31's shape with a new module: what the module puts on `exports` is what `require` returns." },
  { "q": "A bookstore's `index.js` loads `lib/tax.js`, which exports `addGST`. Fill in the blanks.", "type": "fill", "code": "const tax = require('___');\nconsole.log(tax.___(20));", "answer": ["./lib/tax", "addGST"], "explain": "`./` because `lib` sits in the same folder as `index.js`; the `.js` is optional. The function is reached through the object `require` returns." },
  { "q": "What prints?", "code": "function toF(c) {\n  return c * 9 / 5 + 32;\n}\nconsole.log(toF(37));\nconsole.log(toF(-40));", "options": ["98.6 and -40", "98.6 and 8", "66.6 and -40", "98.60 and -40.00"], "answer": 0, "explain": "37 × 9 / 5 = 66.6, plus 32 is 98.6; −40 × 9 / 5 = −72, plus 32 is −40. JavaScript prints numbers without trailing zeros." },
  { "q": "`modules/math.js` defines `const PI = 3.1416;` and `exports.area = ...`. In the caller, what is `mo.PI`?", "options": ["undefined", "3.1416", "a ReferenceError", "3.14"], "answer": 0, "explain": "Only what is attached to `exports` leaves the module. `PI` is a local constant, so the returned object has no `PI` property and reading it gives `undefined`." }
]
```

```quiz
[
  { "q": "When importing your own module with `require`, the `.js` at the end of the file name may be left out.", "type": "tf", "answer": true, "explain": "Slide 31: *Notice we don't need to include the .js when we import the module (its optional)*." },
  { "q": "In `require('./modules/math')`, the `./` means the `modules` folder is in the parent folder of the main Node.js file.", "type": "tf", "answer": false, "explain": "Slide 31: `./` means *the folder is located in the same folder as the main Node.js file*." },
  { "q": "With slide 31's `math.js`, what does `console.log(mo.area(5))` print?", "options": ["31.416", "78.54", "15.708", "31.4160"], "answer": 0, "explain": "`r*PI*2` = 5 × 3.1416 × 2 = 31.416, the circumference. The true area would be 3.1416 × 25 = 78.54; the name `area` is the bad identifier slide 28 warns about." },
  { "q": "Which key starts debugging in VS Code's Run menu?", "options": ["F5", "Ctrl+F5", "F10", "F11"], "answer": 0, "explain": "Slide 26: Start Debugging F5. Ctrl+F5 runs without debugging, F10 steps over, F11 steps into." },
  { "q": "Slide 26 says console.log acts like ___ in Java.", "type": "text", "answer": ["System.out.println()", "System.out.println"], "explain": "*Here console.log acts like System.out.println() in Java*." },
  { "q": "Which module is not built into Node.js?", "options": ["mysql", "path", "fs", "http"], "answer": 0, "explain": "`http`, `fs` and `path` ship with Node. `mysql` is installed with `npm install mysql` (lecture 5)." },
  { "q": "A project has `index.js` at the top and `lib/tax.js` below it. Which lines load the module into `index.js`? Select all.", "options": ["`require('./lib/tax')`", "`require('./lib/tax.js')`", "`require('tax.js')`", "`require('./tax')`"], "answer": [0, 1], "explain": "The path needs `./` and the `lib` folder; the `.js` is optional. A bare `'tax.js'` asks for a built-in or installed module, and `'./tax'` looks next to `index.js`, not in `lib`." },
  { "q": "Slide 28's `test.js` (PI = 3.14, r = 10, `area = r*PI*PI`) runs in Node. What does the second line print?", "options": ["98.596", "314.0000", "314", "62.8"], "answer": 0, "explain": "10 × 3.14 × 3.14 = 98.596. The slide's `314.0000` is the area formula PI·r·r = 314, which this code does not compute." }
]
```
