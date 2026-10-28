---
title: Four ways to output, six primitives, == vs ===
minutes: 18
---

HTML creates the elements, the DOM attaches them, CSS places them, and JavaScript adds interactivity (slide 90). Before any of that, a script has to show a result somewhere and compare values without being surprised by `[] == 0`.

<!-- facts: slides 90-109, 112-114, 118-122, 140, 145-147, 150 -->

## Four ways to output (slides 91 to 97)

*to place JavaScript in our HTML page we use the element <script> </script>*, and *we can place JavaScript code in <head> or in the <body>* (slide 91). *JavaScript only runs within the browser; it cannot do anything outside browser.* *JS cannot delete your files for example.* (slide 92). That holds for the browser; Node.js, later in the course, can delete files.

```js run pin four-outputs
// predict: Write the console lines. An alert shows as [alert] followed by its text.
document.write("<p id='demo'>result will appear here</p>");
console.log("Clinic opens at 9");
window.alert("Clinic opens at 9");
document.getElementById("demo").innerHTML = 7 + 8;
```

`document.write` puts HTML into the page; `console.log` writes to the console; `window.alert` pops a box. *Note: use of alert is not recommended.* *due to bad user experience* (slide 95). The last line replaces the paragraph's text with 15: on slide 96, the placeholder *did appear but was immediately replaced by what our js code generated*.

```diagram
{ "type": "grid", "title": "Four ways to output (slide 97)", "nodes": [ { "id": "h0", "label": "method", "row": 0, "col": 0 }, { "id": "h1", "label": "writes into", "row": 0, "col": 1 }, { "id": "h2", "label": "renders HTML", "row": 0, "col": 2 }, { "id": "a0", "label": "document.write()", "row": 1, "col": 0 }, { "id": "a1", "label": "the HTML output", "row": 1, "col": 1 }, { "id": "a2", "label": "yes", "row": 1, "col": 2 }, { "id": "b0", "label": "console.log()", "row": 2, "col": 0 }, { "id": "b1", "label": "the browser console", "row": 2, "col": 1 }, { "id": "b2", "label": "no", "row": 2, "col": 2 }, { "id": "c0", "label": "window.alert()", "row": 3, "col": 0 }, { "id": "c1", "label": "an alert box", "sub": "not recommended", "row": 3, "col": 1 }, { "id": "c2", "label": "no", "row": 3, "col": 2 }, { "id": "d0", "label": "innerHTML", "row": 4, "col": 0 }, { "id": "d1", "label": "an HTML element", "row": 4, "col": 1 }, { "id": "d2", "label": "yes", "row": 4, "col": 2 } ], "caption": "Summary of examples so far." }
```

Slide 99 sets an image's `src` the same way, and numbers the statement's four parts. Slides 98 and 100 are activities: fix a message, then fill three `<img>` tags, changing only the `<script>`.

```diagram
{ "type": "flow", "title": "Setting src in four parts (slide 99)", "nodes": [ { "id": "a", "label": "document.getElementById", "sub": "1" }, { "id": "b", "label": "(\"wazzapp\")", "sub": "2" }, { "id": "c", "label": ".src", "sub": "3" }, { "id": "d", "label": "\"./images/elf.png\"", "sub": "4" } ], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d", "label": "=" } ], "caption": "With JavaScript we can set the src attribute of an img element." }
```

## Variables, strings and comments (slides 101 to 105)

*With the keyword "let" we declare variables in Javascript.* `var` also declares, with *differences that we discuss later*.

```js run pin variables
// predict:
let x = 5;
let y = 6;
console.log(x + y);
y = y + 9;
console.log(y);
console.log("John is" + "attending  school");
```

```output
11
15
John isattending  school
```

`console.log(x + y)` prints 11, and `y = y + 9` updates `y` to 15. `+` on two strings joins them with no space added. The slide's own line has curly quotes and a capital `Console`, so it fails as typed. Comments are `//` and `/* */` in JavaScript, `<!-- -->` in HTML and `/* */` in CSS (slide 105): *Browser does not execute it* (slide 100).

## Equality and relational operators (slides 106 to 108)

Slides 106 and 107 promise *Decision Making: Equality and Relational Operators*, *Decision based on the truth or falsity of a condition*, but their tables are blank. The table below is standard JavaScript, not the slide's.

```diagram
{ "type": "grid", "title": "Equality and relational operators (standard JavaScript; the slide's table did not render)", "nodes": [ { "id": "h0", "label": "operator", "row": 0, "col": 0 }, { "id": "h1", "label": "meaning", "row": 0, "col": 1 }, { "id": "h2", "label": "example", "row": 0, "col": 2 }, { "id": "h3", "label": "result", "row": 0, "col": 3 }, { "id": "a0", "label": "==", "row": 1, "col": 0 }, { "id": "a1", "label": "equal (converts)", "row": 1, "col": 1 }, { "id": "a2", "label": "5 == \"5\"", "row": 1, "col": 2 }, { "id": "a3", "label": "true", "row": 1, "col": 3 }, { "id": "b0", "label": "!=", "row": 2, "col": 0 }, { "id": "b1", "label": "not equal", "row": 2, "col": 1 }, { "id": "b2", "label": "5 != 6", "row": 2, "col": 2 }, { "id": "b3", "label": "true", "row": 2, "col": 3 }, { "id": "c0", "label": "===", "row": 3, "col": 0 }, { "id": "c1", "label": "same type and value", "row": 3, "col": 1 }, { "id": "c2", "label": "5 === \"5\"", "row": 3, "col": 2 }, { "id": "c3", "label": "false", "row": 3, "col": 3 }, { "id": "d0", "label": "!==", "row": 4, "col": 0 }, { "id": "d1", "label": "not strictly equal", "row": 4, "col": 1 }, { "id": "d2", "label": "5 !== \"5\"", "row": 4, "col": 2 }, { "id": "d3", "label": "true", "row": 4, "col": 3 }, { "id": "e0", "label": "> <", "row": 5, "col": 0 }, { "id": "e1", "label": "greater, less", "row": 5, "col": 1 }, { "id": "e2", "label": "7 > 3", "row": 5, "col": 2 }, { "id": "e3", "label": "true", "row": 5, "col": 3 }, { "id": "f0", "label": ">= <=", "row": 6, "col": 0 }, { "id": "f1", "label": "or equal", "row": 6, "col": 1 }, { "id": "f2", "label": "3 <= 2", "row": 6, "col": 2 }, { "id": "f3", "label": "false", "row": 6, "col": 3 } ], "caption": "Standard JavaScript operators; slides 106 and 107 show only the headings." }
```

```js run pin if-adult
// predict: Write the console line.
let age = 23;
if (age > 18) {
  document.write("you are an adult!");
}
console.log(age > 18);
```

Slide 108 writes `document.write = "you are an adult!";`, which assigns a string over the method and shows nothing; the call `document.write("you are an adult!");` is what it means. Slide 109's activity uses `let age = 3`, so `if (age > 18)` is false and nothing shows.

## == converts, === does not (slide 114)

*The == (or !=) operator performs an automatic type conversion if needed.* *The === (or !==) operator will not perform any type conversion. It first compares if both sides have the same type, then compares the values*

```js run pin equality
// predict: Write the nine lines.
console.log([10] === 10);
console.log([10] == 10);
console.log('10' == 10);
console.log('10' === 10);
console.log([] == 0);
console.log([] === 0);
console.log('' == false);
console.log(true == "a");
console.log('' === false);
```

```output
false
true
true
false
true
false
true
false
false
```

Every `===` line is false: the types differ. `[] == 0` converts the empty array to `''` and then to 0.

```js run pin falsy-check
// predict: Which of the nine are falsy?
const values = [undefined, null, 0, false, NaN, '', "0", [], {}];
const labels = ["undefined", "null", "0", "false", "NaN", "''", '"0"', "[]", "{}"];
for (let i = 0; i < values.length; i++) {
  if (values[i]) {
    console.log(labels[i] + " is truthy");
  } else {
    console.log(labels[i] + " is falsy");
  }
}
```

```output
undefined is falsy
null is falsy
0 is falsy
false is falsy
NaN is falsy
'' is falsy
"0" is truthy
[] is truthy
{} is truthy
```

*Tip: undefined, null, 0, false, NaN, '' (empty string) are all falsy.* *Means in the condition part of if statement all of them mean false*, so `if (values[i])` takes the else branch for them. The string `"0"`, an empty array and an empty object are not on the list.

## Six primitives and one object type (slides 113, 118, 140, 145 to 147, 150)

*There are six primitive data types and one object type in Javascript ECMA6*: Boolean, null (*null is not the same as Null, NULL*), undefined (*Basically means uninitialized.*), Number, String and Symbol (*unique and immutable*). *Arrays are also of type objects in JavaScript.* ES2020 added BigInt as a seventh primitive. Slide 140 calls JavaScript *dynamically typed*: the type comes from the current value. Slide 118: an uninitialized variable is `undefined`; *We use null in the situation when we explicitly want to clear the value of the variable.*

```js run pin typeof-each
// predict:
console.log(typeof 42);
console.log(typeof 'blubber');
console.log(typeof true);
let x;
console.log(typeof x);
const patient = { name: "Ana Diaz", age: 41, bloodType: "O+" };
console.log(typeof patient);
console.log(typeof patient.age);
console.log(typeof patient.bloodType);
console.log(typeof [1, 2, 3]);
console.log(typeof null);
```

```output
number
string
boolean
undefined
object
number
string
object
object
```

`typeof [1, 2, 3]` prints `object`, as slide 113 says. `typeof null` is also `object`, a known quirk of standard JavaScript that the slides do not mention.

```diagram
{ "type": "grid", "title": "Six primitives and one object type", "nodes": [ { "id": "h0", "label": "type", "row": 0, "col": 0 }, { "id": "h1", "label": "example", "row": 0, "col": 1 }, { "id": "h2", "label": "typeof", "row": 0, "col": 2 }, { "id": "a0", "label": "Boolean", "row": 1, "col": 0 }, { "id": "a1", "label": "true", "row": 1, "col": 1 }, { "id": "a2", "label": "\"boolean\"", "row": 1, "col": 2 }, { "id": "b0", "label": "null", "row": 2, "col": 0 }, { "id": "b1", "label": "null", "row": 2, "col": 1 }, { "id": "b2", "label": "\"object\"", "row": 2, "col": 2 }, { "id": "c0", "label": "undefined", "row": 3, "col": 0 }, { "id": "c1", "label": "let x;", "row": 3, "col": 1 }, { "id": "c2", "label": "\"undefined\"", "row": 3, "col": 2 }, { "id": "d0", "label": "Number", "row": 4, "col": 0 }, { "id": "d1", "label": "42", "row": 4, "col": 1 }, { "id": "d2", "label": "\"number\"", "row": 4, "col": 2 }, { "id": "e0", "label": "String", "row": 5, "col": 0 }, { "id": "e1", "label": "\"Hello BCIT\"", "row": 5, "col": 1 }, { "id": "e2", "label": "\"string\"", "row": 5, "col": 2 }, { "id": "f0", "label": "Symbol", "row": 6, "col": 0 }, { "id": "f1", "label": "Symbol()", "row": 6, "col": 1 }, { "id": "f2", "label": "\"symbol\"", "row": 6, "col": 2 }, { "id": "g0", "label": "Object", "row": 7, "col": 0 }, { "id": "g1", "label": "{ }, [ ]", "row": 7, "col": 1 }, { "id": "g2", "label": "\"object\"", "row": 7, "col": 2 } ], "hi": ["g1"], "caption": "Arrays are also of type objects in JavaScript." }
```

Slide 150 separates two messages: a declared but uninitialized `x` logs `undefined`; an undeclared `y` gives *y is not defined reference error!*

## Arrays and identifiers (slides 119 to 122)

```js run pin stooges
// predict:
const stooges = [];
console.log(stooges.length);
stooges[0] = "Larry";
stooges[1] = "Moe";
stooges[4] = "Curly";
console.log(stooges.length);
stooges[4] = "Shemp";
console.log(stooges.length);
console.log(stooges[2]);
stooges.push("Terry");
console.log(stooges.length);
stooges.pop();
console.log(stooges[0], stooges[4]);
```

```output
0
5
5
undefined
6
Larry Shemp
```

Writing index 4 on a two-item array makes the length 5 and leaves holes that read `undefined`. `push` adds to the end, `pop` removes the last; *Array elements are accessed using the [ ] operator* (slide 121). Slide 119 writes `stooges.length()`, a slip: `length` is a property, and the call throws.

```diagram
{ "type": "grid", "title": "stooges after each line (slide 119)", "nodes": [ { "id": "h0", "label": "after", "row": 0, "col": 0 }, { "id": "h1", "label": "[0]", "row": 0, "col": 1 }, { "id": "h2", "label": "[1]", "row": 0, "col": 2 }, { "id": "h3", "label": "[2] [3]", "row": 0, "col": 3 }, { "id": "h4", "label": "[4]", "row": 0, "col": 4 }, { "id": "h5", "label": "length", "row": 0, "col": 5 }, { "id": "a0", "label": "[0] = Larry", "row": 1, "col": 0 }, { "id": "a1", "label": "Larry", "row": 1, "col": 1 }, { "id": "a2", "label": "", "row": 1, "col": 2 }, { "id": "a3", "label": "", "row": 1, "col": 3 }, { "id": "a4", "label": "", "row": 1, "col": 4 }, { "id": "a5", "label": "1", "row": 1, "col": 5 }, { "id": "b0", "label": "[1] = Moe", "row": 2, "col": 0 }, { "id": "b1", "label": "Larry", "row": 2, "col": 1 }, { "id": "b2", "label": "Moe", "row": 2, "col": 2 }, { "id": "b3", "label": "", "row": 2, "col": 3 }, { "id": "b4", "label": "", "row": 2, "col": 4 }, { "id": "b5", "label": "2", "row": 2, "col": 5 }, { "id": "c0", "label": "[4] = Curly", "row": 3, "col": 0 }, { "id": "c1", "label": "Larry", "row": 3, "col": 1 }, { "id": "c2", "label": "Moe", "row": 3, "col": 2 }, { "id": "c3", "label": "empty", "row": 3, "col": 3 }, { "id": "c4", "label": "Curly", "row": 3, "col": 4 }, { "id": "c5", "label": "5", "row": 3, "col": 5 }, { "id": "d0", "label": "[4] = Shemp", "row": 4, "col": 0 }, { "id": "d1", "label": "Larry", "row": 4, "col": 1 }, { "id": "d2", "label": "Moe", "row": 4, "col": 2 }, { "id": "d3", "label": "empty", "row": 4, "col": 3 }, { "id": "d4", "label": "Shemp", "row": 4, "col": 4 }, { "id": "d5", "label": "5", "row": 4, "col": 5 } ], "hi": ["c5"], "caption": "stooges.length is 5 after stooges[4] is set." }
```

Slide 122: *A JavaScript variable (identifier) must start with a letter, underscore (_), or dollar sign ($); subsequent characters can also be digits (0-9) (but a variable name cannot start with digits)*. *Jquery is just an object named $*.

```js
$$ = 140;           // valid
#name = "life!";    // Uncaught SyntaxError: Invalid or unexpected token
_$ = "Hello";       // valid
2a = 25;            // Uncaught SyntaxError: Invalid or unexpected token
$ = 39;             // valid
$name = 45;         // valid
```

Slide 112's outline also lists HTML Web Storage and JSON; those are taught in lecture 2.

## Predict five more comparisons

Decide whether each side is converted before comparing.

```quiz
[
  {
    "q": "What does this print?",
    "code": "console.log(\"7\" == 7);\nconsole.log(\"7\" === 7);",
    "options": ["true / false", "true / true", "false / false", "false / true"],
    "answer": 0,
    "explain": "`==` converts the string to the number 7, so the first is true. `===` compares types first: string vs number, false."
  },
  {
    "q": "What does this print?",
    "code": "console.log([5] == 5);\nconsole.log(0 == \"\");",
    "options": ["true / true", "false / true", "true / false", "false / false"],
    "answer": 0,
    "explain": "`[5]` converts to `\"5\"` and then to 5, so true. The empty string converts to 0, so `0 == \"\"` is true. Both are `==`, so conversion happens."
  },
  {
    "q": "What does this print?",
    "code": "if (\"false\") {\n  console.log(\"yes\");\n} else {\n  console.log(\"no\");\n}",
    "options": ["yes", "no", "false", "nothing"],
    "answer": 0,
    "explain": "`\"false\"` is a non-empty string. Only `''` is a falsy string, so the condition is true."
  },
  {
    "q": "What does this print?",
    "code": "console.log(NaN ? \"a\" : \"b\");",
    "options": ["b", "a", "NaN", "undefined"],
    "answer": 0,
    "explain": "NaN is on slide 114's falsy list, so the condition is false and the expression gives `\"b\"`."
  },
  {
    "q": "What does this print?",
    "code": "console.log(\" 4\" == 4, \"4\" === 4);",
    "options": ["true false", "false false", "true true", "false true"],
    "answer": 0,
    "explain": "`==` converts `\" 4\"` to the number 4 (spaces are ignored), so true. `===` sees a string and a number, so false. `console.log` with two values prints them on one line, separated by a space."
  }
]
```

```quiz
[
  {
    "q": "What does this print?",
    "code": "const shelf = [\"atlas\", \"novel\"];\nconsole.log(typeof shelf);",
    "options": ["object", "array", "string", "undefined"],
    "answer": 0,
    "explain": "Slide 113: *Arrays are also of type objects in JavaScript.* There is no \"array\" result from `typeof`."
  },
  {
    "q": "Which statement replaces the text of `<p id=\"temp\">--</p>` with `18 C`?",
    "options": ["`document.getElementById(\"temp\").innerHTML = \"18 C\";`", "`#temp.innerHTML = \"18 C\";`", "`document.getElement(\"p\").innerHTML = \"18 C\";`", "`document.getElementByName(\"temp\").innerHTML = \"18 C\";`"],
    "answer": 0,
    "explain": "Slide 96: find the element with `document.getElementById` and assign to its `innerHTML`. `#temp` is CSS selector syntax, not JavaScript; the other two methods do not exist."
  },
  {
    "q": "Which line creates an array of three cities?",
    "options": ["`let cities = [\"Burnaby\", \"Surrey\", \"Delta\"];`", "`let cities = (\"Burnaby\", \"Surrey\", \"Delta\");`", "`let cities = {1: \"Burnaby\", 2: \"Surrey\", 3: \"Delta\"};`", "`let cities = \"Burnaby\", \"Surrey\", \"Delta\";`"],
    "answer": 0,
    "explain": "Slide 119: `var name = [value, value, ..., value];`. Square brackets make an array; braces make an object."
  },
  {
    "q": "What does this print?",
    "code": "const days = [];\ndays[0] = \"Mon\";\ndays[3] = \"Thu\";\nconsole.log(days.length);\nconsole.log(days[1]);",
    "options": ["4 / undefined", "2 / undefined", "4 / null", "2 / Thu"],
    "answer": 0,
    "explain": "Setting index 3 makes the length 4, as `stooges[4]` made it 5 on slide 119. Index 1 is a hole, which reads `undefined`."
  },
  {
    "q": "The === operator performs an automatic type conversion.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 114: *The == (or !=) operator performs an automatic type conversion if needed.* *The === (or !==) operator will not perform any type conversion.*"
  },
  {
    "q": "Match each value with what `typeof` returns for it.",
    "type": "match",
    "pairs": [["3.5", "\"number\""], ["\"3.5\"", "\"string\""], ["false", "\"boolean\""], ["a variable declared with `let v;`", "\"undefined\""], ["{ size: 3 }", "\"object\""]],
    "explain": "Slides 145 and 146: 42 gives \"number\", 'blubber' \"string\", true \"boolean\", an uninitialized variable \"undefined\", an object \"object\"."
  },
  {
    "q": "Which value is NOT falsy?",
    "options": ["`\"0\"`", "`0`", "`''`", "`NaN`"],
    "answer": 0,
    "explain": "Slide 114's falsy list: undefined, null, 0, false, NaN, '' (empty string). `\"0\"` is a one-character string, so it is truthy."
  },
  {
    "q": "Which is a valid variable name?",
    "options": ["`$price`", "`9lives`", "`#price`", "`price%`"],
    "answer": 0,
    "explain": "Slide 122: start with a letter, `_` or `$`; later characters may be digits. `9lives` starts with a digit; `#` and `%` are not allowed."
  },
  {
    "q": "What does this print?",
    "code": "let reading;\nconsole.log(reading);\nconsole.log(pressure);",
    "options": ["undefined / Uncaught ReferenceError: pressure is not defined", "undefined / undefined", "Uncaught ReferenceError: reading is not defined", "null / Uncaught ReferenceError: pressure is not defined"],
    "answer": 0,
    "explain": "Slide 150: `reading` is declared but not initialized, so it is `undefined`. `pressure` was never declared, so reading it is a ReferenceError: *y is not defined reference error!*"
  },
  {
    "type": "free",
    "q": "Explain the difference between `==` and `===`, with one example where they disagree.",
    "model": "`==` performs an automatic type conversion if needed, then compares. `===` performs no type conversion: it first checks that both sides have the same type, then compares the values. Example: `'10' == 10` is true, but `'10' === 10` is false.",
    "points": ["== converts types if needed", "=== does no type conversion", "=== compares type first, then value", "an example where == is true and === is false"],
    "rows": 4,
    "explain": "Slide 114."
  }
]
```
