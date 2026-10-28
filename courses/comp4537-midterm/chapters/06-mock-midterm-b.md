---
title: Mock midterm B, forty more items with new programs
minutes: 100
---

A second full paper in the midterm's four kinds, with programs and facts that mock A did not use. Take it cold and timed, the same way: about 100 minutes, no notes and no running code until you have answered everything. Then review every miss through the lesson its explanation links.

```diagram
{ "type": "grid", "title": "This paper by lecture and kind", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "MCQ, T/F", "row": 0, "col": 1 }, { "id": "h2", "label": "What prints", "row": 0, "col": 2 }, { "id": "h3", "label": "Written", "row": 0, "col": 3 }, { "id": "h4", "label": "Coding", "row": 0, "col": 4 }, { "id": "a0", "label": "L1 (14)", "row": 1, "col": 0 }, { "id": "a1", "label": "8", "row": 1, "col": 1 }, { "id": "a2", "label": "4", "row": 1, "col": 2 }, { "id": "a3", "label": "1 short, 1 medium", "row": 1, "col": 3 }, { "id": "a4", "label": "—", "row": 1, "col": 4 }, { "id": "b0", "label": "L2 (3)", "row": 2, "col": 0 }, { "id": "b1", "label": "1", "row": 2, "col": 1 }, { "id": "b2", "label": "—", "row": 2, "col": 2 }, { "id": "b3", "label": "1 short, 1 medium", "row": 2, "col": 3 }, { "id": "b4", "label": "—", "row": 2, "col": 4 }, { "id": "c0", "label": "L3 (4)", "row": 3, "col": 0 }, { "id": "c1", "label": "2", "row": 3, "col": 1 }, { "id": "c2", "label": "—", "row": 3, "col": 2 }, { "id": "c3", "label": "2 short", "row": 3, "col": 3 }, { "id": "c4", "label": "—", "row": 3, "col": 4 }, { "id": "d0", "label": "L4 (4)", "row": 4, "col": 0 }, { "id": "d1", "label": "2", "row": 4, "col": 1 }, { "id": "d2", "label": "—", "row": 4, "col": 2 }, { "id": "d3", "label": "1 short", "row": 4, "col": 3 }, { "id": "d4", "label": "1 long", "row": 4, "col": 4 }, { "id": "e0", "label": "L5 (4)", "row": 5, "col": 0 }, { "id": "e1", "label": "3", "row": 5, "col": 1 }, { "id": "e2", "label": "—", "row": 5, "col": 2 }, { "id": "e3", "label": "1 short", "row": 5, "col": 3 }, { "id": "e4", "label": "—", "row": 5, "col": 4 }, { "id": "f0", "label": "L6 (9)", "row": 6, "col": 0 }, { "id": "f1", "label": "2", "row": 6, "col": 1 }, { "id": "f2", "label": "6", "row": 6, "col": 2 }, { "id": "f3", "label": "—", "row": 6, "col": 3 }, { "id": "f4", "label": "1 challenge", "row": 6, "col": 4 }, { "id": "g0", "label": "L7 (2)", "row": 7, "col": 0 }, { "id": "g1", "label": "2", "row": 7, "col": 1 }, { "id": "g2", "label": "—", "row": 7, "col": 2 }, { "id": "g3", "label": "—", "row": 7, "col": 3 }, { "id": "g4", "label": "—", "row": 7, "col": 4 } ], "hi": ["f0", "f1", "f2", "f3", "f4"], "caption": "The same lecture weights as mock A, with lecture 6 (promises) doubled; this time the coding challenge is a promise chain." }
```

Use the same split as mock A: about a minute per multiple-choice item, two or three per what-prints item, three per short answer, six per medium answer and fifteen for the long coding answer.

## Multiple choice and true or false, items 1 to 20

```quiz
[
  {
    "q": "Lecture 1 splits a web address such as `https://www.citylibrary.example/branches/hours.html` into four parts. Which list names them in order?",
    "options": ["transfer protocol, domain name, pathname of the folder, file name", "domain name, transfer protocol, file name, pathname of the folder", "transfer protocol, port, domain name, query string", "server name, domain name, file name, file type"],
    "answer": 0,
    "explain": "Slide 45 labels the four parts of a URL: the transfer protocol (`https`), the domain name (`www.citylibrary.example`), the pathname of the folder (`/branches/`) and the file name (`hours.html`). See [HTML elements, attributes and the DOM tree](#/comp4537-l1/html-structure)."
  },
  {
    "q": "True or false: `<b>` and `<strong>` both show bold text, but only `<strong>` also tells the browser that the text is important.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 54: `<strong>` and `<em>` are semantic tags; they carry meaning (important, emphasised) that screen readers and search engines use, while `<b>` and `<i>` only change the look. See [HTML elements, attributes and the DOM tree](#/comp4537-l1/html-structure)."
  },
  {
    "q": "A stylesheet has these three rules, in this order: `p { color: blue; }`, `#total { color: red; }`, `.price { color: green; }`. What colour is `<p id=\"total\" class=\"price\">$18.50</p>`?",
    "options": ["red", "green", "blue", "black, because the rules conflict"],
    "answer": 0,
    "explain": "Slide 186: when rules conflict, the more specific selector wins, and an id selector is more specific than a class selector, which beats an element selector. Order only breaks a tie between equally specific rules, so the later `.price` rule does not win. See [Inline, internal and external styles, selectors and specificity](#/comp4537-l1/css-selectors-and-specificity)."
  },
  {
    "q": "A help button must stay in the bottom-right corner of the browser window while the page scrolls under it. Which `position` value does that?",
    "options": ["`fixed`", "`static`", "`relative`", "`absolute`"],
    "answer": 0,
    "explain": "Slide 184: `static` is the default and follows the normal flow; a `fixed` element is positioned *relative to the browser window* and stays put when the page scrolls. `relative` offsets from its normal spot and `absolute` from its nearest positioned ancestor, both of which scroll away. See [Content, padding, border, margin; display, position and units](#/comp4537-l1/css-box-model-display-position)."
  },
  {
    "q": "Which value is NOT falsy?",
    "options": ["`\"0\"`", "`0`", "`\"\"`", "`NaN`"],
    "answer": 0,
    "explain": "Slide 114's falsy list is `undefined`, `null`, `0`, `false`, `NaN` and the empty string `''`. `\"0\"` is a non-empty string, so it is truthy even though it holds a zero. See [Four ways to output, six primitives, == vs ===](#/comp4537-l1/js-values-and-types)."
  },
  {
    "q": "What does `typeof [\"milk\", \"eggs\"]` give?",
    "options": ["`\"object\"`", "`\"array\"`", "`\"list\"`", "`\"string\"`"],
    "answer": 0,
    "explain": "Slide 113: *Arrays are also of type objects in JavaScript*, so `typeof` reports `\"object\"`. Use `Array.isArray(x)` to test for an array. See [Four ways to output, six primitives, == vs ===](#/comp4537-l1/js-values-and-types)."
  },
  {
    "q": "A page runs this code once, and then the user clicks the button three times. What is `visits` afterwards?",
    "code": "let visits = 0;\nfunction countVisit() {\n  visits++;\n}\ndocument.getElementById(\"btn\").onclick = countVisit();",
    "options": ["1", "0", "3", "4"],
    "answer": 0,
    "explain": "Slide 137: assign the function, `onclick = countVisit`, not its result. `countVisit()` runs once on the assignment line, so `visits` becomes 1, and `onclick` receives its return value, `undefined`; the clicks then do nothing. See [Objects, constructors and building the DOM from JavaScript](#/comp4537-l1/objects-and-the-dom)."
  },
  {
    "q": "Lecture 1 lists what the course's hosting must provide. Which of these is NOT on that list?",
    "options": ["a registered domain name", "a relational database server", "hosting several Node.js projects at the same time", "an SSL certificate"],
    "answer": 0,
    "explain": "Slides 21–23: the host must give a relational DB server, the ability to host multiple Node.js projects at the same time, and an SSL certificate for https. A domain name is not required; the host's own address is enough. See [DevTools, the four kinds of hosting, and index.html](#/comp4537-l1/devtools-and-hosting)."
  },
  {
    "q": "A page at `https://notes.example.com/index.html` saves a draft with `localStorage.setItem`. Which page, in the same browser on the same machine, can read it?",
    "options": ["`https://notes.example.com/archive/list.html`", "`http://notes.example.com/index.html`", "`https://drafts.notes.example.com/index.html`", "`https://notes.example.com/index.html` opened in a different browser"],
    "answer": 0,
    "explain": "Lecture 2, slide 32: *web storage is per origin! That means per domain and protocol*; slide 37 adds same browser, same machine. A different folder on the same origin shares the data. `http` is a different protocol, `drafts.` is a different domain, and another browser keeps its own storage. See [localStorage and sessionStorage, per origin, strings only](#/comp4537-l2/web-storage)."
  },
  {
    "q": "Of the four parts of a web API request, which one is *also called body or message*?",
    "options": ["Data", "Headers", "Endpoint", "HTTP method"],
    "answer": 0,
    "explain": "Lecture 3, slides 31–32: 1 Headers, 2 Data *(also called body or message)*, 3 Endpoint, *the URL where the API Server is listening to*, 4 HTTP Methods. See [Headers, data, endpoint and HTTP method](#/comp4537-l3/anatomy-of-a-web-api)."
  },
  {
    "q": "True or false: an API where the client sends \"give me the next page\" and the server remembers which page that client saw last follows REST's Stateless constraint.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 51: under Stateless, *each request contains all the info needed; server doesn't store session state*. The client must ask for the page by number, for example `?page=4`. See [REST's five constraints and the microservice gateway](#/comp4537-l3/rest-principles)."
  },
  {
    "q": "`main.js` sits in a project folder that also has `helpers/tax.js`, which ends with `module.exports = { gst };`. Which lines in `main.js` load it? Select all that apply.",
    "options": ["`const tax = require('./helpers/tax');`", "`const tax = require('./helpers/tax.js');`", "`const tax = require('helpers/tax');`", "`const tax = require('/helpers/tax');`"],
    "answer": [0, 1],
    "explain": "Lecture 4, slide 31: `./` means *the same folder* as the file calling `require`, and the `.js` extension is optional. Without `./`, Node looks for a package in `node_modules`; a leading `/` means the root of the drive. See [Modules with require and exports](#/comp4537-l4/node-modules)."
  },
  {
    "q": "A Node script must delete the old file `scan-2019.png`. Which `fs` call does that?",
    "options": ["`fs.unlink`", "`fs.writeFile`", "`fs.appendFile`", "`fs.rename`"],
    "answer": 0,
    "explain": "`fs.unlink(path, callback)` deletes a file. `writeFile` replaces a file's content, `appendFile` adds to its end and `rename` moves or renames it; all three leave a file on disk. See [The fs module and a file server that answers 404](#/comp4537-l4/fs-and-the-file-server)."
  },
  {
    "q": "In the Same-Origin Policy, which parts together make an origin?",
    "options": ["domain, protocol and port", "domain and path", "domain only", "domain, protocol, port and path"],
    "answer": 0,
    "explain": "Lecture 5, slide 18: *An origin is ( supposed to be) defined by the combination of domain, protocols and ports (80 HTTP, 443 HTTPS)*. The path is not part of it. See [CORS, the Same-Origin Policy and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy)."
  },
  {
    "q": "True or false: when an AJAX request uses POST, its query string is added to the end of the URL, just as with GET.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 23: *For POST, the query string sits in the body of the request*, passed to `send(params)`; the server reads it in chunks with `req.on('data', …)` and `req.on('end', …)` (slides 24 and 28). See [POST with AJAX: the body, the Content-type header and data in chunks](#/comp4537-l5/post-with-ajax)."
  },
  {
    "q": "A page at `http://localhost:5500` fetches from a weather API at `http://localhost:9000`, and the browser blocks the response. Which header must the API add to its response?",
    "options": ["`Access-Control-Allow-Origin`", "`Content-Type: application/json`", "`Access-Control-Request-Method`", "`Cache-Control`"],
    "answer": 0,
    "explain": "Slide 19: the `Access-Control-Allow-Origin` header tells the browser which origins may read the response; `\"*\"` allows everyone. `Access-Control-Request-Method` is a header the browser sends in a preflight, not one the server answers with. See [CORS, the Same-Origin Policy and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy)."
  },
  {
    "q": "True or false: `async function price() { return 5; }` returns a promise, not the number 5.",
    "type": "tf",
    "answer": true,
    "explain": "Lecture 6, slide 52: an `async` function *automatically returns a promise*; a returned value fulfils it, so `price().then(console.log)` logs 5. See [async functions return promises, await waits for one](#/comp4537-l6/async-await)."
  },
  {
    "q": "When does the executor function passed to `new Promise(executor)` run?",
    "options": ["immediately, when the promise object is created", "when `.then` is first called on the promise", "after the current call stack is empty", "when `resolve` is called"],
    "answer": 0,
    "explain": "Slide 17: the executor *Gets executed immediately upon creation of the promise object*. Only the handlers given to `.then` and `.catch` wait for the call stack. See [Pending, fulfilled, rejected, and the executor that runs immediately](#/comp4537-l6/promise-states-and-the-executor)."
  },
  {
    "q": "In lecture 7's clinic database, what would a one-to-one relationship between a patient and visits mean?",
    "options": ["each patient could visit the office only once", "each patient could visit the office many times", "many patients share one visit record", "a visit has no patient"],
    "answer": 0,
    "explain": "Slide 23: the clinic's relationship is one-to-many, one patient to many visits, and *one to one relationship means a patient could visit the office \"only\" once*. See [Tables related by primary and foreign keys](#/comp4537-l7/databases-tables-and-keys)."
  },
  {
    "q": "True or false: a database and a database management system (DBMS) are the same thing.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: *What we just saw was a database, not Database Management System!* The database is the organised data in tables; the DBMS, such as MySQL, is the software that stores, queries and manages it. See [Tables related by primary and foreign keys](#/comp4537-l7/databases-tables-and-keys)."
  }
]
```

## What prints, items 21 to 30

Write the console output of each program before you look at the options. Every program here was run; the keys are the real console output.

```quiz
[
  {
    "q": "What does the console show?",
    "code": "const cart = { item: \"lamp\", qty: 1 };\ncart.qty = 3;\nconsole.log(cart.qty);\ntry {\n  cart = { item: \"desk\", qty: 1 };\n} catch (e) {\n  console.log(e.name);\n}\nconsole.log(cart.item);",
    "options": ["3 / TypeError / lamp", "Uncaught TypeError: Assignment to constant variable.", "3 / TypeError / desk", "1 / TypeError / lamp"],
    "answer": 0,
    "explain": "Slides 115 and 129: `const` stops the name from being re-assigned, which throws a `TypeError`, but the object it points to can still change, so `cart.qty = 3` works. The catch logs the error's name and the object is unchanged. See [var is function-scoped and hoisted; let and const are block-scoped](#/comp4537-l1/scope-and-hoisting)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "function makeTicketMachine(start) {\n  let next = start;\n  return function () {\n    next = next + 1;\n    return \"ticket \" + next;\n  };\n}\nconst deli = makeTicketMachine(40);\nconst bakery = makeTicketMachine(7);\nconsole.log(deli());\nconsole.log(deli());\nconsole.log(bakery());\nconsole.log(deli());",
    "model": "ticket 41\nticket 42\nticket 8\nticket 43",
    "points": ["each call of `makeTicketMachine` makes its own `next`", "the returned function keeps its `next` between calls: 41, then 42", "`bakery` has its own counter starting at 7: `ticket 8`", "`deli` carries on from 42: `ticket 43`"],
    "rows": 5,
    "explain": "A function returned from another function still sees the variables of the call that made it (a closure); functions are values that can be returned like any other. See [Every function returns something, at least undefined](#/comp4537-l1/functions-and-arrows)."
  },
  {
    "q": "What does the console show?",
    "code": "console.log([] == 0);\nconsole.log([] === 0);\nconsole.log([3] == 3);\nconsole.log(\"\" == false);\nconsole.log(true == \"yes\");",
    "options": ["true / false / true / true / false", "false / false / false / true / false", "true / false / true / true / true", "false / false / true / false / false"],
    "answer": 0,
    "explain": "Slide 114: `==` converts types, `===` never does. `[]` becomes `\"\"` and then 0; `[3]` becomes `\"3\"` and then 3; `\"\"` and `false` both become 0. `true` becomes 1 but `\"yes\"` becomes `NaN`, so the last is false. See [Four ways to output, six primitives, == vs ===](#/comp4537-l1/js-values-and-types)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "let rounds = 0;\nconsole.log(\"start washer\");\nconst id = setInterval(() => {\n  rounds++;\n  console.log(\"rinse \" + rounds);\n  if (rounds === 2) {\n    clearInterval(id);\n    console.log(\"spin\");\n  }\n}, 150);\nconsole.log(\"fold towels\");",
    "model": "start washer\nfold towels\nrinse 1\nrinse 2\nspin",
    "points": ["both synchronous lines first: `start washer`, `fold towels`", "`setInterval` repeats its callback every 150 ms: `rinse 1`, `rinse 2`", "`clearInterval(id)` on the second round stops it, then `spin` still logs", "nothing after `spin`: there is no third rinse"],
    "rows": 5,
    "explain": "A timer callback, repeating or not, waits in the event queue until the script has finished (slides 161–162). `clearInterval` stops later rounds; the rest of the current callback still runs. See [setTimeout runs after the script, even with 0 ms](#/comp4537-l1/timers-and-the-event-queue)."
  },
  {
    "q": "What does the console show?",
    "code": "const breakfast = Promise.resolve(\"toast\");\nconsole.log(\"alarm rings\");\nbreakfast.then((food) => console.log(\"eat \" + food));\nconsole.log(\"make bed\");",
    "options": ["alarm rings / make bed / eat toast", "alarm rings / eat toast / make bed", "eat toast / alarm rings / make bed", "alarm rings / make bed"],
    "answer": 0,
    "explain": "The promise is already fulfilled, yet its handler still waits: handlers *run only after the current call stack finishes* (slide 17). Both synchronous logs come first. See [Synchronous code first, then the handlers: Examples 1 to 6](#/comp4537-l6/ordering-part-1)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "setTimeout(() => console.log(\"timer: lock up\"), 0);\nPromise.resolve()\n  .then(() => {\n    console.log(\"micro: count cash\");\n    Promise.resolve().then(() => console.log(\"micro: bag coins\"));\n  })\n  .then(() => console.log(\"micro: print report\"));\nconsole.log(\"sync: last sale\");",
    "model": "sync: last sale\nmicro: count cash\nmicro: bag coins\nmicro: print report\ntimer: lock up",
    "points": ["`sync: last sale` first", "`count cash` queues `bag coins` before its own `.then` promise fulfils", "so `bag coins` runs before `print report`", "the 0 ms timer runs last, after every microtask"],
    "rows": 6,
    "explain": "Microtasks run in the order they are queued. The inner `.then` is queued while `count cash` runs; the outer chain's next handler is queued only when that handler returns. All of them run before any timer. See [Microtasks before timers: Examples 7 to 11 and the harder shapes](#/comp4537-l6/ordering-part-2)."
  },
  {
    "q": "What does the console show?",
    "code": "Promise.resolve()\n  .then(() => {\n    console.log(\"order placed\");\n    setTimeout(() => console.log(\"courier picks up\"), 0);\n  })\n  .then(() => console.log(\"receipt emailed\"));\nsetTimeout(() => console.log(\"warehouse opens\"), 0);\nconsole.log(\"site loads\");",
    "options": ["site loads / order placed / receipt emailed / warehouse opens / courier picks up", "site loads / order placed / courier picks up / receipt emailed / warehouse opens", "site loads / warehouse opens / order placed / receipt emailed / courier picks up", "site loads / order placed / receipt emailed / courier picks up / warehouse opens"],
    "answer": 0,
    "explain": "Both microtasks run before any timer. `warehouse opens` was queued by the synchronous script; `courier picks up` is queued later, from inside the first handler, so it runs after it even though both are 0 ms. See [Microtasks before timers: Examples 7 to 11 and the harder shapes](#/comp4537-l6/ordering-part-2)."
  },
  {
    "q": "What does the console show?",
    "code": "Promise.resolve()\n  .then(() => new Error(\"scanner offline\"))\n  .then(\n    (v) => console.log(\"success handler: \" + v.message),\n    (e) => console.log(\"failure handler: \" + e.message)\n  )\n  .catch((e) => console.log(\"catch: \" + e.message));\nconsole.log(\"shift starts\");",
    "options": ["shift starts / success handler: scanner offline", "shift starts / failure handler: scanner offline", "shift starts / catch: scanner offline", "shift starts / failure handler: scanner offline / catch: scanner offline"],
    "answer": 0,
    "explain": "Slide 31: *Returning a value is defined as success*; *Throwing an error is defined as failure*. The first handler returns an `Error` object without throwing it, so the next promise is fulfilled with it and the success handler (the first argument to `.then`, slide 43) runs. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  },
  {
    "type": "free",
    "q": "Write the console output of this program.",
    "code": "Promise.resolve(25)\n  .then(\"not a function\")\n  .then((n) => n * 2)\n  .then(Promise.resolve(99))\n  .then((n) => console.log(\"total \" + n));",
    "model": "total 50",
    "points": ["a `.then` argument that is not a function is ignored and the value passes through", "25 reaches `n * 2`, giving 50", "`Promise.resolve(99)` is a promise, not a function, so it is ignored too", "one line: `total 50`"],
    "rows": 3,
    "explain": "`.then` expects functions (slide 43). When it gets something else, the chain behaves as if that `.then` were not there. See [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally)."
  },
  {
    "q": "What does the console show?",
    "code": "async function checkIn(name) {\n  console.log(\"scan \" + name);\n  const room = await Promise.resolve(118);\n  console.log(name + \" gets room \" + room);\n  return room;\n}\nconsole.log(\"lobby open\");\ncheckIn(\"Lee\").then((r) => console.log(\"key for \" + r));\nconsole.log(\"next guest\");",
    "options": ["lobby open / scan Lee / next guest / Lee gets room 118 / key for 118", "lobby open / next guest / scan Lee / Lee gets room 118 / key for 118", "lobby open / scan Lee / Lee gets room 118 / key for 118 / next guest", "lobby open / scan Lee / Lee gets room 118 / next guest / key for 118"],
    "answer": 0,
    "explain": "An `async` function runs synchronously up to its first `await`, so `scan Lee` prints at once. `await` pauses only the function and hands control back, so `next guest` prints; the rest of the function and the `.then` handler run afterwards (slide 52). See [async functions return promises, await waits for one](#/comp4537-l6/async-await)."
  }
]
```

## Coding challenge, item 31

```challenge
{ "lang": "js", "prompt": "A library system has two callback functions. <code>findMember(cardNo, done)</code> calls <code>done</code> with a member object after 100 ms, and <code>findLoans(member, done)</code> calls <code>done</code> with that member's array of borrowed titles after 100 ms. Write <code>findMemberP(cardNo)</code> and <code>findLoansP(member)</code> that return promises instead, then chain them for card 5521 to print <code>member Omar</code> and then <code>3 books out</code>.", "starter": "function findMember(cardNo, done) {\n  setTimeout(() => done({ cardNo: cardNo, name: \"Omar\" }), 100);\n}\nfunction findLoans(member, done) {\n  setTimeout(() => done([\"Dune\", \"Emma\", \"Ulysses\"]), 100);\n}\n\nfunction findMemberP(cardNo) {\n  // return a promise\n}\nfunction findLoansP(member) {\n  // return a promise\n}\n\n// chain them for card 5521\n", "expected": "member Omar\n3 books out", "hints": ["Inside <code>new Promise((resolve) => …)</code>, call the callback function and pass <code>resolve</code> as its <code>done</code>.", "Return <code>findLoansP(member)</code> from the first <code>.then</code> so the next <code>.then</code> waits for it.", "The count is <code>loans.length</code>."], "solution": "function findMember(cardNo, done) {\n  setTimeout(() => done({ cardNo: cardNo, name: \"Omar\" }), 100);\n}\nfunction findLoans(member, done) {\n  setTimeout(() => done([\"Dune\", \"Emma\", \"Ulysses\"]), 100);\n}\n\nfunction findMemberP(cardNo) {\n  return new Promise((resolve) => findMember(cardNo, resolve));\n}\nfunction findLoansP(member) {\n  return new Promise((resolve) => findLoans(member, resolve));\n}\n\nfindMemberP(5521)\n  .then((member) => {\n    console.log(\"member \" + member.name);\n    return findLoansP(member);\n  })\n  .then((loans) => console.log(loans.length + \" books out\"));\n" }
```

Returning the inner promise from a `.then` handler is what lets the chain wait for the second lookup instead of nesting a callback inside a callback. See [Functions as values, callbacks, and why a function returns only one thing](#/comp4537-l6/callbacks-and-first-class-functions) and [then, catch and finally: return fulfils, throw rejects](#/comp4537-l6/chaining-then-catch-finally).

## Long coding answer, item 32

```quiz
[
  {
    "type": "free",
    "q": "A bookstore wants a Node server on port 8080. `GET /order?item=Dune&qty=2` must answer with JSON holding the item, the quantity as a number, and `ok`, which is true when the quantity is 5 or fewer. A page served from another origin must be able to read the answer, including after a preflight. Any other path answers with status 404. Write the whole server.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`require('http')` and `require('url')`; `.listen(8080)`", "an `OPTIONS` branch that answers 204 with the CORS headers and ends", "`url.parse(req.url, true)`, a test on `q.pathname === \"/order\"`, and the values from `q.query`", "`Number(q.query.qty)`: query values arrive as strings", "`writeHead(200, …)` with `Access-Control-Allow-Origin` and a JSON content type, then `end(JSON.stringify(…))`", "a 404 branch with its own `writeHead` and `end`"],
    "rows": 12,
    "explain": "`JSON.stringify` serializes the object for `res.end`, which sends only strings or buffers. CORS headers go in every response the page must read. Lecture 4, slides 33–42; lecture 5, slides 18–20. See [The http module: createServer, writeHead, end, listen](#/comp4537-l4/the-http-module) and [CORS, the Same-Origin Policy and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy)."
  }
]
```

### Model answer

```js pin order-check.js
const http = require('http');
const url = require('url');

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

http.createServer(function (req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, cors);
    return res.end();
  }
  const q = url.parse(req.url, true);
  if (req.method === "GET" && q.pathname === "/order") {
    const item = q.query.item;
    const qty = Number(q.query.qty);
    res.writeHead(200, { "Content-Type": "application/json", ...cors });
    res.end(JSON.stringify({ item: item, qty: qty, ok: qty <= 5 }));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain", ...cors });
    res.end(q.pathname + " 404 Not Found!");
  }
}).listen(8080);
```

The `cors` object holds the three headers once, and `...cors` spreads them into each `writeHead`. The `OPTIONS` branch answers a preflight with no body. `Number(q.query.qty)` turns the string `"2"` into the number 2, so `qty <= 5` compares numbers. Opening `http://localhost:8080/order?item=Dune&qty=2` gives:

```text
{"item":"Dune","qty":2,"ok":true}
```

and `qty=9` gives `"ok":false`.

## Short and medium answers, items 33 to 40

Write each answer in full before you reveal the model, then tick only the points your answer states. Items marked (medium) want an example as well.

```quiz
[
  {
    "type": "free",
    "q": "Explain what happens when a script reads a variable on a line above its declaration, first when it is declared with `var` and then with `let`. Why does the course say to use `const` first, then `let`, and never `var`?",
    "model": "*The JavaScript engine treats all variable declarations using \"var\" as if they are declared at the top of a functional scope*: the declaration is hoisted but the assignment stays on its line, so an early read gives `undefined` and the script goes on, which hides the bug. Reading a `let` early *will issue error and terminate execution* (a ReferenceError). Slide 16 says to use `const` first, `let` when the value must change, and never `var`, because `var` ignores blocks, is hoisted silently and adds globals to `window`.",
    "points": ["`var`: the declaration is hoisted, the assignment is not", "so an early read of a `var` gives `undefined` and the script carries on", "an early read of a `let` throws a ReferenceError and stops the script", "`const` first, `let` only when re-assigning, never `var`, because `var` hides such bugs"],
    "rows": 5,
    "explain": "Slides 16 and 132. The slide says `let` is not hoisted; strictly it is hoisted but sits in the temporal dead zone until its line, so the read throws. See [var is function-scoped and hoisted; let and const are block-scoped](#/comp4537-l1/scope-and-hoisting) and [const first, never var, and no hard-coded user-facing strings](#/comp4537-l1/coding-style)."
  },
  {
    "type": "free",
    "q": "A weather page receives the forecast from a server as text and must also send the user's saved cities back. Explain what serializing and deserializing mean here, name the function for each, and say what `typeof` gives for each result.",
    "model": "A JavaScript object *has methods, prototypes, references*, which cannot travel over the network as they are. Serializing turns the object into a JSON string: `JSON.stringify(cities)`, and `typeof` of the result is `\"string\"`. Deserializing turns a received JSON string back into an object: `JSON.parse(text)`, and `typeof` of that result is `\"object\"`. The page parses the forecast it receives and stringifies the cities it sends.",
    "points": ["serialize: object to JSON string, with `JSON.stringify`", "deserialize: JSON string to object, with `JSON.parse`", "`typeof` gives `\"string\"` after stringify and `\"object\"` after parse", "the forecast arrives as text and is parsed; the cities are stringified before sending"],
    "rows": 5,
    "explain": "Lecture 2, slides 27–28. See [JSON.stringify serializes, JSON.parse deserializes](#/comp4537-l2/json-stringify-and-parse)."
  },
  {
    "type": "free",
    "q": "For the request `GET https://api.weather.example/v1/forecast?city=Burnaby`, sent with the header `Accept: application/json`, name the four parts of a web API request and point to each one.",
    "model": "1. Headers: metadata about the request, here `Accept: application/json`.\n2. Data, *also called body or message*: empty for this GET; the city travels in the query string instead.\n3. Endpoint, *the URL where the API Server is listening to*: `https://api.weather.example/v1/forecast`.\n4. HTTP method: `GET`, which reads data (POST creates, PUT updates, DELETE deletes).",
    "points": ["Headers: `Accept: application/json`", "Data (body or message): empty here; the city is in the query string", "Endpoint: the URL the API server listens on", "HTTP method: `GET`, for reading"],
    "rows": 5,
    "explain": "Lecture 3, slides 31–32. See [Headers, data, endpoint and HTTP method](#/comp4537-l3/anatomy-of-a-web-api)."
  },
  {
    "type": "free",
    "q": "A login form sends the password with GET. Explain why that is wrong, and whether switching to POST makes the password safe.",
    "model": "*Never use GET when sending passwords or other sensitive information*: with GET the password sits in the URL, so it stays in the browser history, can be bookmarked or cached, and is written to server logs. POST puts it in the request body, which is *a little safer* because it is not kept in the history or logs. But to the question of which is secure, the slide's answer is *none!*: the body is still plain text on the wire, so the form must use https.",
    "points": ["GET puts the password in the URL", "so it lands in the history, bookmarks, cache and server logs", "POST moves it into the body: only a little safer", "neither is secure; https is what protects it"],
    "rows": 5,
    "explain": "Lecture 3, slides 36–39. See [GET vs POST, and trying an API with Postman](#/comp4537-l3/get-vs-post)."
  },
  {
    "type": "free",
    "q": "A client asks a server for `prices.txt`. Compare the steps PHP takes with the steps Node takes, and say what Node gains.",
    "model": "PHP: 1. sends the task to the computer's file system; 2. waits while the file system opens and reads the file; 3. returns the content to the client; 4. is ready for the next request. Node: 1. sends the task to the file system; 2. is ready for the next request at once; 3. when the file system has read the file, returns the content to the client. *Node.js eliminates the waiting, and simply continues with the next request*: it runs *single-threaded, non-blocking, asynchronously programming, which is very memory efficient*.",
    "points": ["PHP's four steps, with a wait while the file is read", "Node's three steps: ready for the next request straight after sending the task", "Node returns the content when the file is ready", "the gain: no waiting, single-threaded and non-blocking, memory efficient"],
    "rows": 6,
    "explain": "Lecture 4, slide 12. Node's own JavaScript runs on one thread, while the file reading itself happens in a small background thread pool. See [A server runs 24/7, and Node handles a file request in three steps](#/comp4537-l4/servers-and-server-side-scripting)."
  },
  {
    "type": "free",
    "q": "Name the four steps of an AJAX request with `XMLHttpRequest`, and explain why the handler tests `this.status == 200` as well as `this.readyState == 4`.",
    "model": "1. Create the object: `const xhttp = new XMLHttpRequest();`, *just like the way we created Date object*.\n2. Set `xhttp.onreadystatechange` to a function that handles the response.\n3. `xhttp.open(\"GET\", url, true)`: method, URL, and `true` for asynchronous.\n4. `xhttp.send()`: send it and carry on without waiting.\nreadyState 4 is DONE, which means *either the request has been successfully completed (status code 2xx) or an error occurred*, so the handler also checks status 200 (OK); a 404 also reaches readyState 4.",
    "points": ["create: `new XMLHttpRequest()`", "set `onreadystatechange` to the handler", "`open(method, url, async)`", "`send()`, and the script carries on", "readyState 4 also covers errors such as 404, so status 200 is checked too"],
    "rows": 6,
    "explain": "Lecture 5, slides 7–9. See [XMLHttpRequest in four steps, readyState 0 to 4 and the status codes](#/comp4537-l5/xmlhttprequest-four-steps)."
  },
  {
    "type": "free",
    "q": "(medium) A map page runs `setTimeout(showMap, 0)`, then logs `loading`, then runs a loop that takes about a second, then logs `ready`. In what order do the three things happen, and why? What changes if the delay is 2000 ms?",
    "model": "The order is `loading`, `ready`, then `showMap`. `setTimeout` hands `showMap` to the browser's timer and returns at once. When the delay is up, the callback goes into the event queue, and the event loop moves a callback from the queue onto the call stack only when the stack is empty, which is after the whole script, loop included, has finished. So even 0 ms runs after `ready`. With 2000 ms the order is the same; `showMap` runs about one second after `ready`, since the delay is a minimum, counted from when `setTimeout` was called, not an exact time.",
    "points": ["the order: `loading`, `ready`, `showMap`", "`setTimeout` returns at once; the browser times the delay", "when the delay is up, the callback joins the event queue", "the event loop runs it only once the call stack is empty", "0 ms still waits for the whole script", "2000 ms: same order; the delay is a minimum, not exact"],
    "rows": 9,
    "explain": "Lecture 1, slides 161–162. See [setTimeout runs after the script, even with 0 ms](#/comp4537-l1/timers-and-the-event-queue)."
  },
  {
    "type": "free",
    "q": "(medium) An online bookstore could be built as a monolith, as a layered (n-tier) application or as microservices. Describe each for this store and give one advantage and one drawback of microservices.",
    "model": "Monolithic: *All application logic is bundled together in one deployable unit*: catalogue, cart and payment in one program, simple to start, but a small change means redeploying the whole store and everything scales together. Layered: the same store split into Presentation (the pages and forms), Business (*decision making, routing requests*), Application (libraries) and Data access (the database), each layer talking only to its neighbour. Microservices: *A collection of loosely coupled, independently deployable services*: a catalogue service, a cart service and a payment service, each with its own API. Advantage: each service can be deployed and scaled on its own, so a busy catalogue does not need a bigger payment service. Drawback: more moving parts, network calls between services and harder testing and monitoring.",
    "points": ["monolithic: one deployable unit; a change redeploys everything", "layered: presentation, business, application and data access layers", "microservices: loosely coupled, independently deployable services", "a bookstore example of the services", "an advantage of microservices, such as independent deployment or scaling", "a drawback of microservices, such as complexity or network calls"],
    "rows": 10,
    "explain": "Lecture 2, slides 11–20. See [Monolithic, layered and microservice architectures](#/comp4537-l2/architecture-and-its-patterns)."
  }
]
```
