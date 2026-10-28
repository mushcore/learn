---
title: Mock midterm A, forty items in the exam's mix
minutes: 100
---

Forty new items in the midterm's four kinds, weighted by lecture with promises counted double. Take it cold and timed: about 100 minutes, no notes, no cheat sheet and no running code until you have answered everything. Then review every miss through the lesson its explanation links, and retake the misses a day later.

```diagram
{ "type": "grid", "title": "This paper by lecture and kind", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "MCQ, T/F", "row": 0, "col": 1 }, { "id": "h2", "label": "What prints", "row": 0, "col": 2 }, { "id": "h3", "label": "Written", "row": 0, "col": 3 }, { "id": "h4", "label": "Coding", "row": 0, "col": 4 }, { "id": "a0", "label": "L1 (14)", "row": 1, "col": 0 }, { "id": "a1", "label": "7", "row": 1, "col": 1 }, { "id": "a2", "label": "5", "row": 1, "col": 2 }, { "id": "a3", "label": "1 short", "row": 1, "col": 3 }, { "id": "a4", "label": "1 challenge", "row": 1, "col": 4 }, { "id": "b0", "label": "L2 (3)", "row": 2, "col": 0 }, { "id": "b1", "label": "2", "row": 2, "col": 1 }, { "id": "b2", "label": "—", "row": 2, "col": 2 }, { "id": "b3", "label": "1 short", "row": 2, "col": 3 }, { "id": "b4", "label": "—", "row": 2, "col": 4 }, { "id": "c0", "label": "L3 (4)", "row": 3, "col": 0 }, { "id": "c1", "label": "2", "row": 3, "col": 1 }, { "id": "c2", "label": "—", "row": 3, "col": 2 }, { "id": "c3", "label": "1 short, 1 medium", "row": 3, "col": 3 }, { "id": "c4", "label": "—", "row": 3, "col": 4 }, { "id": "d0", "label": "L4 (3)", "row": 4, "col": 0 }, { "id": "d1", "label": "1", "row": 4, "col": 1 }, { "id": "d2", "label": "—", "row": 4, "col": 2 }, { "id": "d3", "label": "1 short", "row": 4, "col": 3 }, { "id": "d4", "label": "1 long", "row": 4, "col": 4 }, { "id": "e0", "label": "L5 (5)", "row": 5, "col": 0 }, { "id": "e1", "label": "4", "row": 5, "col": 1 }, { "id": "e2", "label": "—", "row": 5, "col": 2 }, { "id": "e3", "label": "1 short", "row": 5, "col": 3 }, { "id": "e4", "label": "—", "row": 5, "col": 4 }, { "id": "f0", "label": "L6 (9)", "row": 6, "col": 0 }, { "id": "f1", "label": "2", "row": 6, "col": 1 }, { "id": "f2", "label": "5", "row": 6, "col": 2 }, { "id": "f3", "label": "1 short, 1 medium", "row": 6, "col": 3 }, { "id": "f4", "label": "—", "row": 6, "col": 4 }, { "id": "g0", "label": "L7 (2)", "row": 7, "col": 0 }, { "id": "g1", "label": "2", "row": 7, "col": 1 }, { "id": "g2", "label": "—", "row": 7, "col": 2 }, { "id": "g3", "label": "—", "row": 7, "col": 3 }, { "id": "g4", "label": "—", "row": 7, "col": 4 } ], "hi": ["f0", "f1", "f2", "f3", "f4"], "caption": "Items per lecture follow the slide counts, with lecture 6 (promises) doubled; lecture 7 is the database basics only." }
```

A suggested split: about a minute per multiple-choice item, two or three per what-prints item, three per short answer, six per medium answer and fifteen for the long coding answer, leaving ten minutes to check.

## Multiple choice and true or false, items 1 to 20

```quiz
[
  {
    "q": "Which group lists only tags that are written as a single tag, with no closing tag?",
    "options": ["`<img>`, `<br>`, `<hr>`", "`<img>`, `<p>`, `<hr>`", "`<br>`, `<li>`, `<td>`", "`<div>`, `<span>`, `<br>`"],
    "answer": 0,
    "explain": "Lecture 1, slide 39: *Tags generally 'open' and 'close' – except for single-element tags like <img>, <br> and <hr>.* `<p>`, `<li>`, `<td>`, `<div>` and `<span>` all wrap content and take a closing tag. See [HTML elements, attributes and the DOM tree](#/comp4537-l1/html-structure)."
  },
  {
    "q": "A bookstore page has five price labels that share one style, and one checkout button that a script looks up by name. Which attributes fit?",
    "options": ["the same `class` on the five labels; an `id` on the button", "the same `id` on the five labels; a `class` on the button", "the same `id` on all six elements", "a different `class` on each label; no attribute on the button"],
    "answer": 0,
    "explain": "Slides 75–76: an `id` value must be unique, only one element per page may carry it, so it fits the one button `getElementById` finds; a `class` value need not be unique, so one class styles all five labels. A duplicate id is *bad practice* (slide 82). See [HTML elements, attributes and the DOM tree](#/comp4537-l1/html-structure)."
  },
  {
    "q": "In the CSS box model, which part sits directly outside the padding?",
    "options": ["the border", "the margin", "the content", "another padding layer"],
    "answer": 0,
    "explain": "Slide 177 lists the parts from the inside out: Content, Padding (*clears an area around the content*), Border (*goes around the padding and content*), Margin (*clears an area outside the border*). See [Content, padding, border, margin; display, position and units](#/comp4537-l1/css-box-model-display-position)."
  },
  {
    "q": "True or false: an element styled `visibility:hidden` disappears and the elements below it move up into its space, exactly as with `display: none`.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 182: *visibility:hidden; also hides an element. However, the element will still take up the same space as before.* `display: none` frees the space. In both cases the element stays in the DOM tree. See [Content, padding, border, margin; display, position and units](#/comp4537-l1/css-box-model-display-position)."
  },
  {
    "q": "Which comparison is `true`?",
    "options": ["`'5' == 5`", "`'5' === 5`", "`[7] === 7`", "`true == \"yes\"`"],
    "answer": 0,
    "explain": "Slide 114: *The == (or !=) operator performs an automatic type conversion if needed*, so the string `'5'` becomes the number 5. `===` *will not perform any type conversion*: a string is never `===` a number and an array is never `===` a number. `true == \"yes\"` is false, as the slide's `true == \"a\"` is. See [Four ways to output, six primitives, == vs ===](#/comp4537-l1/js-values-and-types)."
  },
  {
    "q": "Which of these is NOT one of the six primitive data types on lecture 1's data-types slide?",
    "options": ["Array", "Symbol", "undefined", "null"],
    "answer": 0,
    "explain": "Slide 113 lists six primitives: Boolean, null, undefined, Number, String and Symbol, plus objects, and adds *Arrays are also of type objects in JavaScript*. The slide follows ES6; current JavaScript has a seventh primitive, BigInt. See [Four ways to output, six primitives, == vs ===](#/comp4537-l1/js-values-and-types)."
  },
  {
    "q": "An assignment must show the message \"Your total is 42 for today\", where 42 is computed. Which approach follows the course's coding style?",
    "options": ["Keep `\"Your total is %1 for today\"` in a separate strings file and replace `%1` with the total when the message is shown", "Build the sentence with a template string inside the function that computes the total", "Declare the sentence with `var` at the top of the script so every function can reach it", "Show the sentence with `alert` so the user cannot miss it"],
    "answer": 0,
    "explain": "Slide 16: *Absolutely no hard coded user facing string messages anywhere in your assignment code*; user-facing strings go in separate JS or JSON files, and a dynamic one is stored *like \"Your score is %1 for today\"*. The same slide says never use `var`, and slide 95 calls `alert` a bad user experience. See [const first, never var, and no hard-coded user-facing strings](#/comp4537-l1/coding-style)."
  },
  {
    "q": "In the layered (n-tier) architecture, which layer handles decision making and routing requests?",
    "options": ["Business layer", "Presentation layer", "Application layer", "Data access layer"],
    "answer": 0,
    "explain": "Lecture 2, slide 13: the Business layer *controls the application's logic (e.g. decision making, routing requests)*. Presentation handles the end user (a form page), Application holds the core functions (libraries), Data access handles the databases. See [Monolithic, layered and microservice architectures](#/comp4537-l2/architecture-and-its-patterns)."
  },
  {
    "q": "True or false: `typeof JSON.stringify({ city: \"Burnaby\" })` is `\"object\"`.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 28: `JSON.stringify` turns an object into a JSON string (serialize), and `typeof` of the result is `\"string\"`. `JSON.parse` goes the other way. See [JSON.stringify serializes, JSON.parse deserializes](#/comp4537-l2/json-stringify-and-parse)."
  },
  {
    "q": "A travel site wants a flight search for Calgary to be saved as a browser bookmark and found again in the history. Which method must the search form use?",
    "options": ["GET", "POST", "either one; both can be bookmarked", "neither; searches cannot be bookmarked"],
    "answer": 0,
    "explain": "Lecture 3, slides 35–36: *GET requests can be bookmarked* and *remain in the browser history*, because the query string sits in the URL. *POST requests cannot be bookmarked* and *do not remain in the browser history*. See [GET vs POST, and trying an API with Postman](#/comp4537-l3/get-vs-post)."
  },
  {
    "q": "True or false: REST is an architectural pattern, in the same category as Microservices and MVC.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 48: *REST is not an architectural pattern like Microservices or MVC. Instead, it's an architectural style or set of constraints for API communication between systems.* See [REST's five constraints and the microservice gateway](#/comp4537-l3/rest-principles)."
  },
  {
    "q": "A new Node project runs and stops with `Error: Cannot find module` on one of these lines until a package is installed with npm. Which line?",
    "options": ["`const mysql = require('mysql');`", "`const http = require('http');`", "`const fs = require('fs');`", "`const path = require('path');`"],
    "answer": 0,
    "explain": "Lecture 5, slide 43: *Turns out, mysql is an external module and needs to be installed* with `npm install mysql`; without it Node throws `Error: Cannot find module 'mysql'`. `http`, `fs` and `path` ship with Node. See [Connecting Node to MySQL: createConnection, connect, query](#/comp4537-l5/node-to-mysql)."
  },
  {
    "q": "After this code, what does `q.search` hold?",
    "code": "const url = require('url');\nconst q = url.parse(\"http://localhost:8080/rates.html?from=CAD&to=EUR\", true);",
    "options": ["`'?from=CAD&to=EUR'`", "`'from=CAD&to=EUR'`", "`'/rates.html'`", "`{ from: 'CAD', to: 'EUR' }`"],
    "answer": 0,
    "explain": "Lecture 4, slide 38: `q.search` *returns '?name=John&age=23'*, the query string with its question mark. `q.pathname` is the path and `q.query` is the object of name/value pairs. `url.parse` is legacy in current Node; `new URL()` replaces it. See [url.parse and the query string](#/comp4537-l4/url-and-query-strings)."
  },
  {
    "q": "An XHR handler should show the response only when the request has finished and the server answered OK. Which condition does it test?",
    "options": ["`this.readyState == 4 && this.status == 200`", "`this.readyState == 2 && this.status == 200`", "`this.readyState == 4`", "`this.status == 4`"],
    "answer": 0,
    "explain": "Lecture 5, slide 8: readyState 4 is DONE, *either the request has been successfully completed (status code 2xx) or an error occurred*, so the handler also checks `status == 200` (OK). Testing readyState alone would also show a 404 page. See [XMLHttpRequest in four steps, readyState 0 to 4 and the status codes](#/comp4537-l5/xmlhttprequest-four-steps)."
  },
  {
    "q": "A clinic page at `https://clinic.example` sends patient data to `https://api.clinic.example`. Which version of the request makes the browser send an OPTIONS request first?",
    "options": ["A POST with body `JSON.stringify(patient)` and `Content-Type: application/json`", "A POST with body `name=Rosa&age=40` and `Content-Type: application/x-www-form-urlencoded`", "A POST with a plain string body and no Content-Type set by the script", "A GET with the patient id in the query string"],
    "answer": 0,
    "explain": "A JSON body is not one of the simple content types, so the browser first sends a preflight: an OPTIONS request asking whether the server allows the method and headers. Form-urlencoded, `text/plain` and a GET without custom headers go straight through. The lecture 5 slide only asks the question (slide 20); the rule is in the [CORS, the Same-Origin Policy and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy) lesson."
  },
  {
    "q": "True or false: with `xhttp.open(\"GET\", url, true)`, the script stops at `xhttp.send()` and waits until the response arrives.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: *We just send it and carry on (we don't wait if we sent it asynchronously)*. `true` is the async argument; the handler runs later when readyState changes. See [XMLHttpRequest in four steps, readyState 0 to 4 and the status codes](#/comp4537-l5/xmlhttprequest-four-steps)."
  },
  {
    "q": "Which states of a promise are together called *settled*?",
    "options": ["fulfilled and rejected", "pending and fulfilled", "pending and rejected", "pending only"],
    "answer": 0,
    "explain": "Lecture 6, slide 14 circles Fulfilled and Rejected and labels them Settled; Pending is the state before either. See [Pending, fulfilled, rejected, and the executor that runs immediately](#/comp4537-l6/promise-states-and-the-executor)."
  },
  {
    "q": "True or false: `order.catch(showError)` does the same as `order.then(null, showError)`.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 46: *.then(null, errorHandlingFunction)* *Is the same as* *.catch(errorHandlingFunction)*. Both register only a rejection handler. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  },
  {
    "q": "A bookstore database has `Author(Author_ID, name)` and `Book(Book_ID, title, Author_ID)`. What is `Author_ID` in the `Book` table?",
    "options": ["a foreign key", "the primary key of `Book`", "a record", "a cell"],
    "answer": 0,
    "explain": "Lecture 7, slide 20: Patient_ID in the Visit table *is called Foreign key. A primary key of another table presents in this table*. Here `Author_ID` is `Author`'s primary key appearing in `Book`; `Book_ID` is `Book`'s primary key. See [Tables related by primary and foreign keys](#/comp4537-l7/databases-tables-and-keys)."
  },
  {
    "q": "What does CRUD stand for?",
    "options": ["Create, Read, Update, Delete", "Connect, Request, Upload, Download", "Create, Retrieve, Unlink, Drop", "Copy, Read, Update, Deploy"],
    "answer": 0,
    "explain": "Lecture 2, slide 24 and lecture 5, slide 32: *Doing Create, Read, Update and Delete operations on a database via API requests*. On slide 32, Delete covers a record or dropping a table. See [CRUD from Node.js: connect, create, insert, select](#/comp4537-l7/crud-from-node)."
  }
]
```

## What prints, items 21 to 30

Write the console output of each program before you look at the options. Every program here was run; the keys are the real console output.

```quiz
[
  {
    "q": "What does the console show?",
    "code": "function packOrder() {\n  for (let i = 0; i < 2; i++) {\n    var boxes = i + 1;\n  }\n  console.log(boxes);\n  console.log(typeof i);\n}\npackOrder();",
    "options": ["2 / undefined", "1 / undefined", "2 / number", "Uncaught ReferenceError: boxes is not defined"],
    "answer": 0,
    "explain": "`var boxes` is function-scoped, so it is still visible after the loop and holds its last value, 2. `let i` is block-scoped to the loop; after it, `i` does not exist, and `typeof` on a missing name gives `\"undefined\"` instead of throwing. Lecture 1, slides 115 and 117. See [var is function-scoped and hoisted; let and const are block-scoped](#/comp4537-l1/scope-and-hoisting)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "console.log(total);\nvar total = 40;\nfunction addTip() {\n  console.log(total);\n  var total = 45;\n  return total;\n}\nconsole.log(addTip());\nconsole.log(total);",
    "model": "undefined\nundefined\n45\n40",
    "points": ["first line `undefined`: the global `var total` is hoisted, its value is not", "second line `undefined`: the local `var total` is hoisted to the top of `addTip` and hides the global 40", "third line `45`: the value `addTip` returns", "fourth line `40`: the global was never changed"],
    "rows": 5,
    "explain": "Slide 132: *The JavaScript engine treats all variable declarations using \"var\" as if they are declared at the top of a functional scope (if declared inside a function, if not as if they are declared at top of the script)*. Only the declaration moves; the assignment stays on its line. See [var is function-scoped and hoisted; let and const are block-scoped](#/comp4537-l1/scope-and-hoisting)."
  },
  {
    "q": "What does the console show?",
    "code": "function roomFloor(n) {\n  if (n > 300) {\n    return;\n  }\n  return \"floor \" + Math.floor(n / 100);\n}\nfunction saveNote() {\n  let text = \"saved\";\n}\nconsole.log(roomFloor(214));\nconsole.log(roomFloor(512));\nconsole.log(saveNote());",
    "options": ["floor 2 / undefined / undefined", "floor 2 / floor 5 / saved", "floor 2 / null / undefined", "floor 2 / undefined / saved"],
    "answer": 0,
    "explain": "Slide 166: *If a function does not use a return statement or an empty return statement with no value, JavaScript automatically returns undefined*, so *in JavaScript every function returns something*, at least undefined. 512 takes the empty `return;`; `saveNote` has no `return` at all. See [Every function returns something, at least undefined](#/comp4537-l1/functions-and-arrows)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "const queue = [\"Ana\", \"Ben\", \"Chen\", \"Dev\", \"Eli\"];\nqueue.length -= 2;\nconsole.log(queue.length);\nconsole.log(queue[3]);\nconsole.log(queue[queue.length - 1]);",
    "model": "3\nundefined\nChen",
    "points": ["`length -= 2` cuts the array to 3 elements, dropping `Dev` and `Eli`", "`queue[3]` is past the end: `undefined`, not an error", "the last element is at `length - 1`, index 2: `Chen`"],
    "rows": 4,
    "explain": "`length` is a property you can assign (slide 119 writes it as `length()`, but it is not a method). Shrinking it removes elements from the end. See [Tracing for and while loops over arrays](#/comp4537-l1/loops-and-arrays)."
  },
  {
    "q": "What does the console show?",
    "code": "console.log(\"doors open\");\nsetTimeout(() => {\n  console.log(\"first song\");\n  setTimeout(() => console.log(\"encore\"), 0);\n  console.log(\"second song\");\n}, 200);\nsetTimeout(() => console.log(\"sound check\"), 100);\nconsole.log(\"lights down\");",
    "options": ["doors open / lights down / sound check / first song / second song / encore", "doors open / lights down / sound check / first song / encore / second song", "doors open / lights down / first song / second song / encore / sound check", "doors open / first song / second song / encore / sound check / lights down"],
    "answer": 0,
    "explain": "Both synchronous lines run first. Timers then fire by delay, so the 100 ms `sound check` beats the 200 ms callback. That callback runs to its end before anything else, so `second song` comes before the 0 ms `encore`, which only joins the queue then. Slides 161–162. See [setTimeout runs after the script, even with 0 ms](#/comp4537-l1/timers-and-the-event-queue)."
  },
  {
    "q": "What does the console show?",
    "code": "function brew(cups) {\n  return new Promise((resolve) => {\n    console.log(\"grinding beans\");\n    resolve(cups * 2);\n  });\n}\nconsole.log(\"cafe open\");\nbrew(3).then((n) => console.log(\"poured \" + n));\nconsole.log(\"next in line\");",
    "options": ["cafe open / grinding beans / next in line / poured 6", "cafe open / next in line / grinding beans / poured 6", "cafe open / grinding beans / poured 6 / next in line", "grinding beans / cafe open / next in line / poured 6"],
    "answer": 0,
    "explain": "The executor *Gets executed immediately upon creation of the promise object* (lecture 6, slide 17), so `grinding beans` prints when `brew(3)` is called. The `.then` handler is queued as a microtask and runs only after the current call stack, which still has `next in line` to log. See [Synchronous code first, then the handlers: Examples 1 to 6](#/comp4537-l6/ordering-part-1)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "const refund = new Promise((resolve, reject) => {\n  resolve(\"refund approved\");\n  reject(\"refund denied\");\n  console.log(\"form filed\");\n  resolve(\"refund doubled\");\n});\nrefund\n  .then((msg) => console.log(msg))\n  .catch((err) => console.log(\"error: \" + err));\nconsole.log(\"next customer\");",
    "model": "form filed\nnext customer\nrefund approved",
    "points": ["`form filed` first: the executor runs to its end immediately", "the first `resolve` settles the promise; the `reject` and the second `resolve` are ignored", "`next customer` before the handler: handlers wait for the call stack", "the `.catch` handler never runs"],
    "rows": 4,
    "explain": "Slide 17, callout 4: *resolve and reject invoke handlers asynchronously and mutually exclusive And run only once*. Calling `resolve` does not stop the executor, so the log after it still runs. See [Pending, fulfilled, rejected, and the executor that runs immediately](#/comp4537-l6/promise-states-and-the-executor)."
  },
  {
    "q": "What does the console show?",
    "code": "setTimeout(() => console.log(\"timer: water plants\"), 0);\nPromise.resolve(\"sweep\").then((job) => console.log(\"micro: \" + job));\nconsole.log(\"sync: unlock shed\");\nPromise.resolve().then(() => console.log(\"micro: rake\"));",
    "options": ["sync: unlock shed / micro: sweep / micro: rake / timer: water plants", "sync: unlock shed / timer: water plants / micro: sweep / micro: rake", "timer: water plants / micro: sweep / sync: unlock shed / micro: rake", "sync: unlock shed / micro: rake / micro: sweep / timer: water plants"],
    "answer": 0,
    "explain": "The synchronous line runs first. Then every microtask runs in the order queued, before any timer, even a 0 ms one: handlers *run only after the current call stack finishes* (slide 17), while the timer waits for the event loop's next turn. See [Microtasks before timers: Examples 7 to 11 and the harder shapes](#/comp4537-l6/ordering-part-2)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.resolve(3)\n  .then((n) => {\n    console.log(\"tickets: \" + n);\n    if (n < 5) throw new Error(\"not enough seats\");\n    return n;\n  })\n  .then((n) => console.log(\"booked \" + n))\n  .catch((e) => {\n    console.log(\"caught: \" + e.message);\n    return 5;\n  })\n  .then((n) => console.log(\"rebooked \" + n));",
    "model": "tickets: 3\ncaught: not enough seats\nrebooked 5",
    "points": ["the `throw` rejects the promise that `.then` returned", "the `booked` handler is skipped: it has no rejection handler", "`.catch` receives the error and logs its message", "`.catch` returns 5, which fulfils the next promise: `rebooked 5`"],
    "rows": 4,
    "explain": "Slide 31's core rule: *Returning a value is defined as success ( passing to resolve of new promise)*; *Throwing an error is defined as failure ( passing to reject of new promise)*. A `.catch` that returns recovers the chain. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  },
  {
    "q": "What does the console show?",
    "code": "Promise.resolve(\"invoice 42\")\n  .finally((x) => console.log(\"printer warmed up, got \" + x))\n  .then((v) => console.log(\"printed \" + v))\n  .finally(() => console.log(\"printer off\"));\nconsole.log(\"queue job\");",
    "options": ["queue job / printer warmed up, got undefined / printed invoice 42 / printer off", "queue job / printer warmed up, got invoice 42 / printed invoice 42 / printer off", "queue job / printer warmed up, got undefined / printed undefined / printer off", "printer warmed up, got undefined / printed invoice 42 / printer off / queue job"],
    "answer": 0,
    "explain": "Slide 48: *.finally(f)* *is similar to* *.then(f, f)* in that it always runs once the promise is settled. Beyond the slide, which says there is more to `.finally` *outside the scope of this class*: its handler receives no argument, and it passes the original value on, so the next `.then` still gets `invoice 42`. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  }
]
```

## Coding challenge, item 31

```challenge
{ "lang": "js", "prompt": "A plant nursery counts new shoots each week. Week 1 had 2 and week 2 had 5; every later week has the sum of the two weeks before it. Use a <code>for</code> loop to fill an array with the first eight weeks, then print the array on one line with its values separated by single spaces.", "starter": "const shoots = [2, 5];\n// fill shoots up to eight values with a for loop\n\n// print them on one line, separated by spaces\n", "expected": "2 5 7 12 19 31 50 81", "hints": ["Start the loop at index 2 and stop before index 8.", "Each new value is <code>shoots[i - 1] + shoots[i - 2]</code>.", "<code>shoots.join(\" \")</code> builds the line."], "solution": "const shoots = [2, 5];\nfor (let i = 2; i < 8; i++) {\n  shoots[i] = shoots[i - 1] + shoots[i - 2];\n}\nconsole.log(shoots.join(\" \"));\n" }
```

Assigning to `shoots[i]` one past the end grows the array by one each time; `i < 8` stops at eight values. This is the loop-and-index tracing of lecture 1's array slides (119–121); see [Tracing for and while loops over arrays](#/comp4537-l1/loops-and-arrays).

## Long coding answer, item 32

```quiz
[
  {
    "type": "free",
    "q": "A weather station wants a Node server on port 3000. `GET /today` must answer with the server's current date and time shown in blue; any other path must answer with status 404 and a short message. Write the whole server.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`require('http')` and `require('url')`", "`http.createServer(function (req, res) { … })` with the request first and the response second", "`url.parse(req.url, true)` and a test on `q.pathname === \"/today\"`", "`res.writeHead(200, { \"Content-Type\": \"text/html\" })` then `res.end(…)` with `style=\"color:blue\"` and `new Date()`", "a 404 branch with its own `writeHead(404, …)` and `end`", "`.listen(3000)`"],
    "rows": 12,
    "explain": "The first argument of `writeHead` is the status code (200 or 404), never the port; the port goes to `listen`. `writeHead` and `end` belong to `res`, not `req`. Lecture 4, slides 33–42. See [The http module: createServer, writeHead, end, listen](#/comp4537-l4/the-http-module) and [url.parse and the query string](#/comp4537-l4/url-and-query-strings)."
  }
]
```

### Model answer

```js pin weather-today.js
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  if (q.pathname === "/today") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<p style="color:blue">Today at the weather station: ' + new Date() + '</p>');
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(q.pathname + " 404 Not Found!");
  }
}).listen(3000);
```

`url.parse(req.url, true)` splits the request; `q.pathname` drops any query string, so `/today?units=metric` still matches. Each branch calls `res.writeHead` before `res.end`, and `new Date()` runs on the server, so the page shows the server's clock. Opening `http://localhost:3000/today` shows one blue line (your date will differ):

```text
Today at the weather station: Tue Oct 27 2026 22:37:01 GMT-0700 (Pacific Daylight Time)
```

and `http://localhost:3000/forecast` shows `/forecast 404 Not Found!`, the same message shape as lecture 4's file server on slide 42.

## Short and medium answers, items 33 to 40

Write each answer in full before you reveal the model, then tick only the points your answer states. Items marked (medium) want an example as well.

```quiz
[
  {
    "type": "free",
    "q": "A teammate's code declares everything with `var`. Using the four rows of lecture 1's let vs var summary, explain how `let` differs.",
    "model": "- Scope: `var` has *Function scope*, `let` has *Block scope*.\n- Hoisting: `var` *Will hoist declaration to top of function*, so reading it early gives `undefined`; reading a `let` first *will issue error and terminate execution* (slide 132: *JS engine will NOT hoist variables declared by \"let\"*).\n- Global object: *Global variable declared by var add to window*; *let does not add property to global window*.\n- Strict mode: re-declaring a `var` is OK; re-declaring a `let` is a SyntaxError.",
    "points": ["scope: `var` function scope, `let` block scope", "hoisting: `var` reads `undefined` before its line; `let` read early throws and stops the script", "global object: a global `var` becomes a `window` property, a `let` does not", "strict mode: `var` may be re-declared, `let` may not"],
    "rows": 6,
    "explain": "Slide 134's table has exactly these four rows. Strictly, a `let` is hoisted too but sits in the temporal dead zone until its line runs, which is why reading it throws. See [var is function-scoped and hoisted; let and const are block-scoped](#/comp4537-l1/scope-and-hoisting)."
  },
  {
    "type": "free",
    "q": "A note-taking page must keep an unsent draft even after the browser is closed, and must show a one-time tip only until the user closes the tab. Which web storage object fits each? What does `getItem` return, and how is an object stored?",
    "model": "The draft goes in `localStorage`, which *stores data with no expiration date*. The tip flag goes in `sessionStorage`, which *stores data for one session (data is lost when the browser tab is closed)*. Both are *per origin*: only pages of the same origin, in the same browser on the same machine, see the data. *Name/value pairs are always stored as strings*: `getItem` returns a string, or `null` for a missing key, so an object is saved with `JSON.stringify` and read back with `JSON.parse`.",
    "points": ["draft in `localStorage`: no expiration date", "tip flag in `sessionStorage`: lost when the tab is closed", "both per origin: same origin, same browser, same machine", "`getItem` returns a string, or `null` for a missing key", "objects go in with `JSON.stringify` and come out with `JSON.parse`"],
    "rows": 6,
    "explain": "Lecture 2, slides 32–35. Slide 32 calls web storage *more secure than cookies*; slide 44 adds that HttpOnly cookies are often safer for login tokens, since any script on the page can read web storage. See [localStorage and sessionStorage, per origin, strings only](#/comp4537-l2/web-storage)."
  },
  {
    "type": "free",
    "q": "A library's search form is changed from GET to POST. Name four things that change for the request, and say whether the form is now secure.",
    "model": "With GET the query string (name/value pairs) is in the URL; with POST the data is *stored in the request body*. GET *can be cached*, *can be bookmarked* and stays in the browser history; POST is *never cached*, *cannot be bookmarked* and *do not remain* in history. GET is length-limited (*maximum URL length is 2048 characters*) and allows *only ASCII characters*; POST has *no restrictions* and allows binary data. Refreshing a POST re-submits the data and the browser warns. Neither is secure: *none!* POST is only *a little safer*, because its parameters are not stored in the history or the server logs; encrypt with https.",
    "points": ["data moves from the URL's query string to the request body", "no longer cached, bookmarkable or kept in history", "no 2048-character length limit; binary allowed, not only ASCII", "refresh now re-submits, with a browser warning", "still not secure: *none are secure*; POST is only a little safer, use https"],
    "rows": 6,
    "explain": "Lecture 3, slides 34–39, keyed to the slide's table. In practice 2048 characters was an old browser limit and non-ASCII characters are percent-encoded rather than forbidden. See [GET vs POST, and trying an API with Postman](#/comp4537-l3/get-vs-post)."
  },
  {
    "type": "free",
    "q": "Using lecture 4's restaurant analogy, explain what is wrong with a blocking server and why a Node server needs fewer threads.",
    "model": "In Example 2, *single threaded blocking (synchronous)*, the waiter takes an order and waits at the kitchen until it is ready, so the other tables wait too: *We are not utilizing our resources (the waiter) efficiently*. Example 3, *multi-threaded*, gives each table its own waiter; a synchronous system with 100 concurrent requests needs *100 threads*. Node is Example 1, *single threaded non-blocking (asynchronous)*: *one waiter serves everyone*, passing orders to the kitchen and serving whichever dish is ready.",
    "points": ["Example 2, blocking: the waiter waits at the kitchen, the other tables wait", "the problem: the waiter (the resource) is not used efficiently", "Example 3: one waiter (thread) per table; 100 concurrent requests need 100 threads", "Node is Example 1: single threaded, non-blocking, one waiter serves everyone"],
    "rows": 6,
    "explain": "Slides 13–23. The slide calls Node single-threaded; that is true of the event loop running your JavaScript, while Node hands file and some other work to a small background thread pool. See [Node.js on V8 and the restaurant analogy](#/comp4537-l4/node-and-the-restaurant)."
  },
  {
    "type": "free",
    "q": "A page served from `http://localhost:5500` calls an API at `http://localhost:8888`, and the console reports that the request was blocked by CORS policy. Explain why, what the server must change, and when the browser sends a preflight first.",
    "model": "By default the browser enforces the Same-Origin Policy: the page and the server scripts it calls must share one origin, and *An origin is ( supposed to be) defined by the combination of domain, protocols and ports*. Ports 5500 and 8888 differ, so this is a cross-origin request. *CORS is a security feature implemented in web browsers and is configured by the contacted server in the response's header*: the API adds `\"Access-Control-Allow-Origin\": \"*\"` (or the page's exact origin) to its `writeHead`. For a request such as a POST with `Content-Type: application/json`, the browser first sends a preflight, an OPTIONS request, and the server must answer it with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.",
    "points": ["origin = domain + protocol + port; the ports differ, so the Same-Origin Policy blocks it", "CORS is enforced by the browser and configured by the server's response headers", "the server adds `Access-Control-Allow-Origin` (`*` or the page's origin) in `writeHead`", "a preflight is an OPTIONS request sent first, for example for a JSON body; the server answers with Allow-Methods and Allow-Headers"],
    "rows": 6,
    "explain": "Lecture 5, slides 18–20; the preflight questions on slide 20 have no answer on the slide, and the rule here is the one the lesson and Quiz 10 teach. Postman is not a browser, so CORS never blocks it. See [CORS, the Same-Origin Policy and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy)."
  },
  {
    "type": "free",
    "q": "A checkout page retries a request three times after a network timeout. Explain what idempotent means and whether the retries are harmless with PUT and with POST.",
    "model": "*Idempotent: can be applied multiple times without changing the result*. *PUT is idempotent, POST is not*: *calling PUT once or several times successively has the same effect*, whereas *successive identical POST requests may have additional effects, e.g. leading to placing an order several times*. So three PUTs that replace the cart leave one cart, but three POSTs may place three orders. PUT replaces an object entirely; PATCH updates only one property.",
    "points": ["idempotent: applying it several times gives the same result as once", "PUT is idempotent: the retries are harmless", "POST is not: the retries may place the order several times", "PUT replaces the whole object; PATCH updates only a property"],
    "rows": 5,
    "explain": "Lecture 6, slide 3. See [PUT replaces, PATCH updates, and only PUT is idempotent](#/comp4537-l6/idempotency-put-patch-post)."
  },
  {
    "type": "free",
    "q": "(medium) You are designing the REST API for a clinic's appointment service. Name REST's five constraints in the slide's order and, for each, say what it means for your API.",
    "model": "1. **Client–Server**: separation of concerns; the web page and the phone app handle the user interface, the server keeps the appointment data and logic.\n2. **Stateless**: *Each request contains all the info needed; server doesn't store session state*: the client asks for `GET /appointments?page=3`, never \"the next page\".\n3. **Cacheable**: the server marks each response cacheable or not *via HTTP headers like Cache-Control, ETag, Expires*, for example the clinic's opening hours.\n4. **Uniform Interface (core constraint)**: each resource has its own URL and the methods are the verbs: `GET /appointments/42`, `POST /appointments`, `DELETE /appointments/42`; nouns in the URL, verbs are HTTP methods.\n5. **Layered System**: clients don't know whether they talk to the origin server or an intermediary such as an API gateway or a cache.\nREST is *an architectural style or set of constraints*, not a pattern.",
    "points": ["Client–Server: the UI on the client, data and logic on the server", "Stateless: every request carries everything; the server keeps no session state (no \"next page\")", "Cacheable: the server marks responses with Cache-Control, ETag or Expires", "Uniform Interface, the core constraint: resources by URL (nouns), actions by HTTP method (verbs)", "Layered System: a gateway, proxy or cache can sit between client and server unseen", "the five in the slide's order"],
    "rows": 10,
    "explain": "Lecture 3, slides 49–53. Slide 53 adds Code-on-Demand on its benefits list; it is REST's optional sixth constraint and not one of the five on slide 49. See [REST's five constraints and the microservice gateway](#/comp4537-l3/rest-principles)."
  },
  {
    "type": "free",
    "q": "(medium) A promise chain loads a bookstore order. Explain what `.then(success, failure)`, `.catch(f)` and `.finally(f)` each do, and what happens to the next promise when a handler returns a value and when it throws. Give a short example chain.",
    "model": "`.then(success, failure)`: the first function *runs when the Promise is resolved, and receives the result*; the second *runs when the Promise is rejected, and receives the error*. `.then` itself returns a new promise, which is why calls chain. *Returning a value is defined as success* (the new promise is fulfilled with it); *Throwing an error is defined as failure* (the new promise is rejected). `.catch(f)` *is the same as* `.then(null, f)`. `.finally(f)` *is similar to* `.then(f, f)`: it *always runs when the promise is settled*, but it does not handle a rejection, so an uncaught one is still reported. Example:\n\n`loadOrder(17).then((o) => { if (!o.paid) throw new Error(\"unpaid\"); return o.total; }).then((t) => console.log(\"total \" + t)).catch((e) => console.log(e.message)).finally(() => console.log(\"done\"));`",
    "points": ["`.then` takes a success and a failure handler and returns a new promise", "returning a value fulfils the next promise", "throwing rejects the next promise; the chain skips to the next failure handler", "`.catch(f)` is `.then(null, f)`", "`.finally(f)` runs on either outcome but does not handle the rejection", "a correct example chain"],
    "rows": 10,
    "explain": "Lecture 6, slides 31, 43, 46 and 48; slides 50–51 show a `.finally` with no catch still ending in `Uncaught (in promise)`. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  }
]
```
