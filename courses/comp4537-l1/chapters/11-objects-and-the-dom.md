---
title: Objects, constructors and building the DOM from JavaScript
minutes: 18
---

Read a value out of an object or a nested object, make objects with a constructor, and change a page from JavaScript: add an element, find elements by tag, react to a click and ask the user for input.

<!-- facts: s135-137 events, inline vs script handler; s141 object literal, two access forms; s142 constructor; s143-144 Date; s148/154 MainObj; s149 method; s152-153 DOM; s155-156 createElement, appendChild; s157 getElementsByTagName; s158-160 input, prompt -->

## An object holds properties, read with a dot or with brackets (slide 141)

*"Objects are variables too but can contain different values"*. In `{ firstName: "John", lastName: "Doe" }`, `firstName` and `lastName` are *property names ( or property keys)*. Two ways to read one: *objectName.propertyName* or *objectName["propertyName"]*.

```js run pin object-access.js
// predict:
let book = { title: "Dune", author: "Herbert", pages: 412 };
console.log(book.title);
console.log(book["author"]);
console.log(book.price);
```

```output
Dune
Herbert
undefined
```

`book["author"]` puts the key in quotes inside the brackets. `book.price` names a key the object does not have, which gives `undefined`, not an error.

## A constructor is a function called with new (slides 142 and 149)

Slide 142: an *Object contractor* (constructor) *is the same at function declaration*: it sets properties on `this`, and `new` makes one object per call. An object literal *obviously cannot be instantiated*. Slide 149 adds a method, a property whose value is a function.

```js run pin constructor-with-method.js
// predict:
function Patient(first, last, age) {
  this.firstName = first;
  this.lastName = last;
  this.age = age;
  this.fullName = function () {
    return this.firstName + " " + this.lastName;
  };
}
let p1 = new Patient("Mina", "Park", 34);
let p2 = new Patient("Omar", "Haddad", 61);
console.log(p1.fullName());
console.log(p2.age);
console.log(typeof p1);
```

```output
Mina Park
61
object
```

`p1.fullName()` needs the parentheses to call the method. Inside it, `this` is `p1`.

## Objects nest, and the access path follows the tree (slides 148 and 154)

Slide 148 asks how to reach the value `"prop2Obj3"` in its `MainObj` and to plot the object's tree. Worked out: `MainObj.Obj3.prop2`, or `MainObj["Obj3"]["prop2"]`.

```diagram
{ "type": "tree", "title": "MainObj (slides 148 and 154)", "nodes": [ { "id": "m", "label": "MainObj" }, { "id": "mp1", "label": "prop1", "parent": "m" }, { "id": "o1", "label": "Obj1", "parent": "m" }, { "id": "o3", "label": "Obj3", "parent": "m" }, { "id": "o1p1", "label": "prop1", "parent": "o1" }, { "id": "o1p2", "label": "prop2", "parent": "o1" }, { "id": "o2", "label": "Obj2", "parent": "o1" }, { "id": "o2p1", "label": "prop1", "sub": "\"hey you\"", "parent": "o2" }, { "id": "o2p2", "label": "prop2", "parent": "o2" }, { "id": "o3p1", "label": "prop1", "sub": "true", "parent": "o3" }, { "id": "o3p2", "label": "prop2", "sub": "\"prop2Obj3\"", "parent": "o3" } ], "hi": ["o3", "o3p2"], "caption": "Worked out: MainObj.Obj3.prop2 walks from the root to the lit leaf." }
```

```js run pin nested-object.js
// predict:
let report = {
  city: "Burnaby",
  today: {
    high: 14,
    low: 6,
    wind: { speed: 20, dir: "NW" }
  },
  tomorrow: {
    high: 11,
    sky: "rain"
  }
};
console.log(report.tomorrow.sky);
console.log(report["today"]["wind"].dir);
console.log(report.today.wind["speed"]);
```

```output
rain
NW
20
```

Dots and brackets mix freely in one path: `report.tomorrow.sky` and `report["today"]["wind"].dir` walk the tree the same way. A form like `report.[today]` is not valid syntax.

## Date is a built-in object (slides 143 and 144)

*"Date is a built-in JavaScript object"*. `new Date()` *gets you current date*; subtracting two dates gives the milliseconds between them, and `getTime()` gives a date's milliseconds since 1970.

```js run pin date-diff.js
// validator: skip
let date1 = new Date('January 15, 2018 09:00:00');
let date2 = new Date(); // gets you current date
let timeDiff = date2 - date1;
console.log(timeDiff); // milliseconds passed
console.log(date2.getTime());
```

The first number grows every time the block runs, because `date2` is the moment of the run. The slides' `Console.log` with a capital C is a slip for `console.log`.

## The browser builds the DOM tree in memory (slides 152 and 153)

*"When a browser renders a web page, it forms the Document Object Model of that page in memory."* Slide 153 shows a team page and says *the browser creates this object* without drawing it. Drawn:

```diagram
{ "type": "tree", "title": "The team page's DOM (slide 153)", "nodes": [ { "id": "d", "label": "document" }, { "id": "html", "label": "html", "parent": "d" }, { "id": "head", "label": "head", "parent": "html" }, { "id": "body", "label": "body", "parent": "html" }, { "id": "title", "label": "title", "sub": "page title", "parent": "head" }, { "id": "h1", "label": "h1", "parent": "body" }, { "id": "p1", "label": "p", "parent": "body" }, { "id": "h2", "label": "h2", "parent": "body" }, { "id": "ul", "label": "ul", "parent": "body" }, { "id": "p2", "label": "p", "parent": "body" }, { "id": "li", "label": "li × 3", "sub": "the three names", "parent": "ul" } ], "hi": ["ul"], "caption": "The slide's page drawn as its tree: three li children under one ul." }
```

## createElement, then appendChild, then give it a value (slides 155 and 156)

Slide 155 says *"You need to do two things"* and lists three: *"1: create that element in memory"*, *"2:place that element in DOM tree"*, *"3: do something to make that button visible ! (e.g. give it a value)"*.

```diagram
{ "type": "flow", "title": "Adding a button (slide 155)", "nodes": [ { "id": "c", "label": "createElement(\"BUTTON\")", "sub": "1: in memory" }, { "id": "a", "label": "appendChild(btn)", "sub": "2: in the DOM tree" }, { "id": "v", "label": "btn.innerHTML = …", "sub": "3: give it a value" }, { "id": "p", "label": "visible on the page", "kind": "pill" } ], "edges": [ { "from": "c", "to": "a" }, { "from": "a", "to": "v" }, { "from": "v", "to": "p" } ], "hi": ["a"], "caption": "Nothing shows until the element is placed in the DOM tree." }
```

```html run pin create-button.html
<body>
<script>
let btn = document.createElement("BUTTON");
document.body.appendChild(btn);
btn.innerHTML = "Save";
let btn2 = document.createElement("BUTTON");
btn2.innerHTML = "Print";
btn2.onclick = function () { console.log("button 2 was clicked"); };
document.body.appendChild(btn2);
console.log(document.getElementsByTagName("button").length);
</script>
</body>
```

The preview shows Save and Print; the console prints 2. `btn2` gets its text while still only in memory, which is allowed; it appears only after `document.body.appendChild(btn2)`. Clicking Print logs `button 2 was clicked`, half of slide 156's exercise.

### The three steps against the tree

Step through slide 155 and slide 156's second button; watch the detached box empty when `appendChild` runs.

```widget
dom-build-play
{ "preset": "button", "predict": true }
```

## getElementsByTagName returns an array of elements (slide 157)

*"getElementsByTagName returns an array of elements of the given type"*, in page order, from index 0. Strictly it returns an HTMLCollection: indexable and with a `length`, but not a true Array.

```html run pin by-tag-name.html
<p>Open 9 to 5</p>
<p>Closed Sunday</p>
<p>Call ahead</p>
<script>
let pElements = document.getElementsByTagName("p");
pElements[1].innerHTML = "Open Sunday 10 to 2";
console.log(pElements.length);
</script>
```

`getElementsByTagName("p")` finds all three paragraphs. `pElements[1]` is the second, so "Closed Sunday" changes; the console prints 3.

### Slide 157's page, one call at a time

```widget
dom-build-play
{ "preset": "byTag" }
```

## Two ways to handle a click (slides 135 to 137)

*"HTML events are "things" that happen to HTML elements"*: a page finished loading, an input field changed, a button clicked. *"there are two methods to handle events: Method 1- inline (inside HTML element), Method 2- in JavaScript block"*. In Method 1 the *value of the attribute "onclick" could be JavaScript code*. Slide 137: *"A better way to handle events it to use a function!"*, assigned as `onclick = clickHandler`, with no parentheses.

```diagram
{ "type": "flow", "title": "Two ways to handle a click (slide 137)", "nodes": [ { "id": "b", "label": "button" }, { "id": "m1", "label": "onclick=\"…code…\"", "sub": "Method 1: inline" }, { "id": "m2", "label": "onclick = clickHandler", "sub": "Method 2: script" }, { "id": "bad", "label": "onclick = clickHandler()", "sub": "runs now, assigns undefined" } ], "edges": [ { "from": "b", "to": "m1" }, { "from": "b", "to": "m2" }, { "from": "b", "to": "bad", "dashed": true } ], "hi": ["bad"], "caption": "With parentheses the function runs once at load and onclick gets its return value." }
```

```html run pin click-handlers.html
<button id="me" onclick="document.getElementById('me').innerHTML = 'Clicked me!'">inline</button>
<button id="save">function</button>
<button id="trap">trap</button>
<p id="count">clicks: 0</p>
<script>
let counter = 0;
function clickHandler() {
  document.getElementById('save').innerHTML = 'Saved!';
}
function countClick() {
  counter++;
  document.getElementById('count').innerHTML = "clicks: " + counter;
}
document.getElementById('save').onclick = clickHandler;
document.getElementById('trap').onclick = countClick();
console.log(counter);
</script>
```

The console prints 1 before any click: `countClick()` ran once at load and assigned `undefined`, so clicking trap does nothing more. The function button works because `clickHandler` is assigned, not called. That trap is beyond the slides, from the course quizzes. Slide 138 suggests one more: a button that clears a textarea.

## prompt returns the input, or null on Cancel (slides 158 to 160)

Slide 158 reads a text box with `parseInt(document.getElementById("myText").value)` and shows the number in an `alert`. Slide 159 uses `prompt(textMessage, defaultText)`: *"The prompt() method returns the input value if the user clicks "OK". If the user clicks "cancel" the method returns null."*

```diagram
{ "type": "flow", "title": "prompt (slide 160)", "nodes": [ { "id": "c", "label": "prompt(message, default)" }, { "id": "d", "label": "dialog", "sub": "text box holds the default" }, { "id": "ok", "label": "OK", "sub": "returns the input value" }, { "id": "x", "label": "Cancel", "sub": "returns null" } ], "edges": [ { "from": "c", "to": "d" }, { "from": "d", "to": "ok" }, { "from": "d", "to": "x" } ], "hi": ["x"], "caption": "Slide 160's two outcomes." }
```

```js run pin prompt-name.js
// predict: The first dialog gets OK with Mark typed in; the second gets Cancel. What prints?
// prompt: Mark
let myName = prompt("Hello! Please enter your name", "Mark");
console.log(myName);
let city = prompt("Your city?", "Victoria");
console.log(city);
```

The console shows `Mark`, then `null`: the second `prompt` was cancelled, so `city` is `null`, not the default `"Victoria"`.

## Reach into a clinic's records

New objects. Write the path or the output before you choose.

```quiz
[
  {
    "q": "Given `let visits = [ { name: \"Lee\", room: 3 }, { name: \"Ruiz\", room: 7 } ];`, select every line that logs 7.",
    "options": ["`console.log(visits[1].room);`", "`console.log(visits[1][\"room\"]);`", "`console.log(visits[1][room]);`", "`console.log(visits.room[1]);`"],
    "answer": [0, 1],
    "explain": "`visits[1]` is Ruiz's object; `.room` and `[\"room\"]` both read its key. `[room]` without quotes looks for a variable named `room` and throws `ReferenceError: room is not defined`; `visits.room` is `undefined`, so `[1]` on it throws a TypeError."
  },
  {
    "q": "What does this print?",
    "code": "let clinic = { name: \"Eastside\", 2: \"Dr. Ng\" };\nconsole.log(clinic[2]);\nconsole.log(clinic.phone);",
    "options": ["Dr. Ng / undefined", "Eastside / undefined", "Dr. Ng / an error", "undefined / undefined"],
    "answer": 0,
    "explain": "`clinic[2]` reads the key `2`, whose value is `\"Dr. Ng\"`. There is no `phone` key, so `clinic.phone` is `undefined`, not an error."
  },
  {
    "q": "What does this print?",
    "code": "function Room(num, beds) {\n  this.num = num;\n  this.beds = beds;\n  this.describe = function () {\n    return \"Room \" + this.num + \": \" + this.beds + \" beds\";\n  };\n}\nlet r = new Room(12, 2);\nconsole.log(r.describe());",
    "options": ["Room 12: 2 beds", "Room num: beds beds", "undefined", "Room 2: 12 beds"],
    "answer": 0,
    "explain": "`new Room(12, 2)` sets `this.num` to 12 and `this.beds` to 2 on the new object; `describe` reads them through `this`."
  },
  {
    "q": "`let rec = { patient: { visit: { fee: 40 } } };` Which expression does NOT reach 40?",
    "options": ["`rec.[patient].visit.[fee]`", "`rec.patient.visit.fee`", "`rec[\"patient\"][\"visit\"][\"fee\"]`", "`rec[\"patient\"].visit[\"fee\"]`"],
    "answer": 0,
    "explain": "A dot must be followed by a name, and brackets follow the object directly; `.[` is a syntax error. The other three mix the two valid forms of slide 141."
  },
  {
    "q": "A page has `<button id=\"go\">`. After loading it and clicking the button three times, what is `taps`?",
    "code": "let taps = 10;\nfunction tap() {\n  taps += 5;\n}\ndocument.getElementById(\"go\").onclick = tap();",
    "options": ["15", "10", "25", "30"],
    "answer": 0,
    "explain": "`tap()` runs once while the script loads (10 + 5 = 15) and its return value, `undefined`, is assigned to `onclick`. The clicks run nothing. `onclick = tap` would have given 30."
  }
]
```

```quiz
[
  {
    "q": "Which line creates a button element in memory?",
    "options": ["`let b = document.createElement(\"BUTTON\");`", "`let b = document.body.appendChild(\"BUTTON\");`", "`let b = document.getElementsByTagName(\"BUTTON\");`", "`let b = new Button();`"],
    "answer": 0,
    "explain": "Slide 155, step 1: `createElement` creates the element in memory. `appendChild` is step 2 and takes an element, not a tag name; `getElementsByTagName` finds existing elements."
  },
  {
    "q": "getElementsByTagName returns an array of elements of the given type.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 157's sentence. Strictly it returns an HTMLCollection, which is indexable and has `length` but is not a true Array."
  },
  {
    "q": "The user clicks Cancel on `let city = prompt(\"Your city?\", \"Victoria\");`. What is `city`?",
    "options": ["null", "\"Victoria\"", "undefined", "\"\" (an empty string)"],
    "answer": 0,
    "explain": "Slide 160: *If the user clicks \"cancel\" the method returns null.* The default text is returned only if the user clicks OK without changing it."
  },
  {
    "q": "Which is proper object syntax?",
    "options": ["`let room = { num: 4, beds: 2 };`", "`let room = { num = 4, beds = 2 };`", "`let room = { num: 4; beds: 2 };`", "`let room = ( num: 4, beds: 2 );`"],
    "answer": 0,
    "explain": "An object literal is curly braces holding `key: value` pairs separated by commas (slide 141)."
  },
  {
    "q": "In `let recipe = { name: \"Soup\", serves: 4 };`, what is `recipe`?",
    "options": ["an object literal", "an object constructor", "an object method", "a Document Object Model"],
    "answer": 0,
    "explain": "It is written out directly with braces, so it is an object literal (slide 142); a constructor is a function called with `new`."
  },
  {
    "q": "Put slide 155's steps for adding a button in order.",
    "type": "reorder",
    "lines": ["let btn = document.createElement(\"BUTTON\");", "document.body.appendChild(btn);", "btn.innerHTML = \"Save\";"],
    "explain": "1: create that element in memory; 2: place that element in DOM tree; 3: make it visible, e.g. give it a value. Step 3 may also come before step 2; it shows only once the button is in the tree."
  },
  {
    "q": "What does this print?",
    "code": "let order = { id: 7, items: { first: \"tea\", second: { name: \"scone\", qty: 2 } } };\nconsole.log(order.items.second.qty + order.id);",
    "options": ["9", "27", "scone7", "undefined"],
    "answer": 0,
    "explain": "`order.items.second.qty` is the number 2 and `order.id` is the number 7; 2 + 7 = 9."
  },
  {
    "q": "What does this print?",
    "code": "let d1 = new Date('March 1, 2024 10:00:00');\nlet d2 = new Date('March 1, 2024 10:00:05');\nconsole.log(d2 - d1);",
    "options": ["5000", "5", "0.005", "NaN"],
    "answer": 0,
    "explain": "Subtracting two dates gives the milliseconds between them (slide 143): five seconds is 5000 ms."
  },
  {
    "q": "Writing `document.getElementById('me').onclick = clickHandler();` makes clickHandler run on every click.",
    "type": "tf",
    "answer": false,
    "explain": "The parentheses call `clickHandler` once, at load, and assign its return value (`undefined`) to `onclick`. Slide 137 assigns `clickHandler` without them."
  },
  {
    "type": "free",
    "q": "Name the two methods of handling events on slide 137 and write one line of each for a button with id `save`.",
    "model": "Method 1, inline, inside the HTML element: `<button id=\"save\" onclick=\"console.log('saved')\">`; the value of the onclick attribute is JavaScript code. Method 2, in a JavaScript block: define `function saveHandler() { … }` and assign `document.getElementById('save').onclick = saveHandler;` with no parentheses, so the function runs on each click. The slide calls the function the better way.",
    "points": ["Method 1: inline, JavaScript code in the onclick attribute", "Method 2: in a script block, assign a function to onclick", "the function is assigned without parentheses", "with parentheses it would run once at load and assign undefined"],
    "rows": 5,
    "explain": "Slide 137."
  }
]
```
