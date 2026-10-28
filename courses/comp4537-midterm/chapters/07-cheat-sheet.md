---
title: The cheat sheet, both sides of one letter page
minutes: 15
---

The midterm allows **one letter-sized sheet, both sides, written or typed, figures allowed, with your name top-left**, and it may be collected. This lesson carries the whole sheet as text; the print page lays the same content out on exactly two letter pages with the figures (box model, event-loop queues, n-tier layers, course architecture, readyState 0 to 4, CORS preflight, promise states). Print it single sheet, double-sided, write your name in the box, and add in pen whatever the mock midterms show you still miss. Where a slide differs from what JavaScript really does, the sheet keeps the slide's wording and adds the truth in a bracket such as *[real: fulfilled]*. [Print page](/courses/comp4537-midterm/sheet/index.html) (also saved as [sheet.pdf](/courses/comp4537-midterm/sheet/sheet.pdf)).

## Side 1

### HTML (L1)

- `<!DOCTYPE html>` = HTML5; `<html>` root, `<head>` meta information, `<body>` visible content. HTML creates elements; the **DOM** (a tree) says how they attach; CSS says where and how they look; JS adds interactivity.
- Single (empty) tags: `<img>`, `<br>`, `<hr>`. Global attributes `style`, `id`, `class`: `id` is unique per page, `class` need not be.
- **Block** by default: `div`, `h1`–`h6`, `p`, `form`, `header`, `footer`, `section`. **Inline**: `span`, `a`, `img`. `<strong>`/`<em>` add semantic importance; `<b>`/`<i>` do not.
- Radio buttons with the same `name` form one group. **A URL has four parts**: protocol, domain name, folder path, file name; with no file name the server returns `index.html`.

### CSS (L1)

- **Inline** (the `style` attribute), **internal** (`<style>` in the head), **external** (`<link rel="stylesheet" href="my.css">`). A rule-set = selector + declaration block `{ name: value; }`.
- Selectors `p`, `#firstId`, `.firstClass`, `p.myClass` (only `<p>` elements with that class), `h1, h2` (grouping). **Combinators**: `div p` (space) descendant, `>` child, `+` adjacent sibling, `~` general sibling. Specificity: id > class > element.
- Box model, inside out: **content → padding → border → margin** (slide example: width 300px, padding 20px, border 10px, margin 30px; padding and margin are transparent).
- `display:none` frees the space; `visibility:hidden` keeps it; both stay in the DOM. **position**: static (default, document flow), relative, absolute, fixed (browser window), sticky.
- pt = 1/72 inch; **em** = the element's font-size; **%** = the parent. RGB 0–255; alpha 0 transparent to 1 opaque.

### JS values (L1)

- **Six primitives**: Boolean, null, undefined, Number, String, Symbol; plus Object. Arrays are objects: `typeof []` is `"object"`.
- `==` converts types; `===` does not (type first, then value).

| `==` | `===` |
|---|---|
| `[10] == 10` true | `[10] === 10` false |
| `'10' == 10` true | `'10' === 10` false |
| `[] == 0` true | `[] === 0` false |
| `'' == false` true | `'' === false` false |
| `true == "a"` false | |

- **Falsy (6)**: `undefined`, `null`, `0`, `false`, `NaN`, `''`. `"0"`, `[]` and `{}` are truthy.
- `undefined` = declared but uninitialized; `null` = cleared on purpose; an undeclared name throws ReferenceError "x is not defined".
- An identifier starts with a letter, `_` or `$` (`2a` is a SyntaxError). Four outputs: `document.write()`, `console.log()`, `window.alert()` (bad user experience), `innerHTML`.
- `typeof`: `42` "number", `'a'` "string", `true` "boolean", `let x;` then `x` "undefined", `{}` "object".
- `push` adds to the end, `pop` removes the last; `length` is a property; `a[4] = "x"` on a 2-item array gives length 5. `obj.name` is the same as `obj["name"]`.
- Parameter = the name in the definition; argument = the value passed. Every function returns at least `undefined`: `console.log(console.log('Hi!'))` prints `Hi!` then `undefined`.
- Arrow forms: `() => {}`, `val => "Hi " + val` (one parameter, parentheses optional), `(a, b) => a + b`.

### Scope and hoisting (L1 s115–134)

**Hoisting** (s132): the engine treats every `var` declaration as if it were at the top of its function scope.

| | `var` | `let` (and `const`) |
|---|---|---|
| Scope | function scope | block scope |
| Hoisting | declaration hoisted to the top: reads `undefined` | "not hoisted": error, script stops *[real: temporal dead zone, ReferenceError: Cannot access … before initialization]* |
| window | a global `var` adds `window.a` | not added (`window.b` is `undefined`) |
| strict mode | re-declaration ok | re-declaration is a SyntaxError |

```js
{ var a = 10; }  console.log(a);  // 10
{ let b = 10; }  console.log(b);  // ReferenceError: b is not defined
console.log(v);  var v = 140;     // undefined
console.log(m);  let m = 140;     // error, stops [TDZ]
const Pi = 3.14;  Pi = 90;  // TypeError: Assignment to constant variable.
const c;                    // SyntaxError: Missing initializer in const declaration
const x = {n: 1};  x.n = 2; // ok: properties still change
function f() { k = 100; }   // no var/let/const: k is global
```

Course style: **const first, then let, never var**.

### Events and DOM (L1)

- Inline `<button onclick="...">`, or in a script block `btn.onclick = clickHandler;` (writing `clickHandler()` calls it once right away and assigns `undefined`).
- `document.createElement("BUTTON")` then `document.body.appendChild(b)`; `getElementsByTagName` returns an array; `prompt()` returns the input, or `null` on Cancel.

### Event queue (L1 s161–162, L6 s17)

- `setTimeout(f, t)` runs `f` once after `t` ms; `setInterval(f, t)` repeats.
- The callback waits in the **event (callback) queue** and runs only when the **call stack is empty**, so the synchronous lines after `setTimeout` run first; 0 ms does not make it earlier.
- Promise handlers (**microtasks**) "do NOT wait for all code in the program. They wait only for the current call stack to unwind."
- Order: **1 call stack** (all synchronous code, executor bodies) → **2 microtasks** (every `.then`/`.catch`/`.finally` handler) → **3 timers** (one at a time, even at 0 ms; microtasks run again after each).

```js
console.log(1);
setTimeout(function () { console.log(2); }, 1000);
console.log(3);           // 1 3 2   (same with 0 ms)

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(0).then(() => console.log(2));
Promise.resolve().then(() => console.log(3))
                 .then(() => console.log(1));
console.log(4);           // 4 3 1 2
```

### OOP, style, hosting (L1)

- **Inheritance**: `class Car extends Vehicle { constructor(b) { super(b); } }` is **is-a**; the subclass inherits properties and methods. **Composition** is **has-a** and more flexible: a Car is given an Engine, so the Engine can be swapped without changing Car. Template string: `` `Hi ${name}` ``.
- One task per function, no needless globals, no hard-coded user-facing strings (keep `"Your score is %1 for today"` in a separate file).
- **Hosting**: **Shared** (hundreds of sites share; cheapest, maybe slowest; enough for the course), **VPS** (fewer sites, your own virtual server), **Dedicated** (one physical machine, all yours), **Cloud** (many machines act as one). The host must give a relational DB server, several Node.js apps at once, and an SSL certificate.

### JSON (L2 s26–29)

An object has methods, prototypes and references, so it cannot travel over a network: serialize (flatten) it into a string. `JSON.stringify(obj)` turns an object into a string (**serialize**); `JSON.parse(str)` turns a string into an object (**deserialize**). `JSON.stringify({name: "John", age: 22})` gives `'{"name":"John","age":22}'`, whose `typeof` is `"string"`.

### Web Storage (L2 s30–44, L3 s7)

| `localStorage` | `sessionStorage` |
|---|---|
| no expiration date | one session: lost when the browser **tab** closes |

- Both live in the browser, not on the server. **Per origin** (protocol + domain + port; the path does not matter; a subdomain is another origin): "same origin, same browser, same machine". About 5 MB.
- **Strings only**: `getItem` returns a string or `null`. API: `setItem(k, v)`, `getItem(k)`, `removeItem(k)`, `clear()`.
- F12 → Application → Local Storage. Password: "No. Never." (any script on the page can read it: XSS). Auth token: "it can", with an XSS risk. A cart that follows you to every device lives on the server.

```js
localStorage.setItem("list", JSON.stringify(books));  // page 1
const s = localStorage.getItem("list");   // page 2: string or null
const list = s ? JSON.parse(s) : [];      // handle the empty store
```

### Architecture (L2 s4–22)

- "Architecture is not code. It is the decisions you make before you write code." Order: **Monolithic → Layered → Microservices**.
- **Monolithic**: all logic in one deployable unit, one machine, one stack. To add a feature: 1 shut down the entire application, 2 add the feature, 3 (may need to) recompile everything. Best for prototyping, MVPs; hard to scale.
- **Layered (n-tier)**, top to bottom: **Presentation** (UI, e.g. form page), **Business** (e.g. decision making, routing requests), **Application** (core functions, e.g. libraries), **Data access** (e.g. databases).
- **Microservices**: "a collection of loosely coupled, independently deployable services". Pros: fix one service (billing) and redeploy it alone while the rest keep running (Messenger stays up when Facebook is down); one function each, so separate teams; each on its own machine and stack. Cons: many API calls raise complexity; orchestration, monitoring and careful API design needed.
- **Reliability** = works correctly under normal conditions. **Robustness** = handles bad input safely (invalid JSON → 400 Bad Request). **Resilience** = survives and recovers (the store still sells when recommendations fail).
- SOA ≈ MSA "in this course". The course uses a simplified, API-centric MSA: client scripts send "AJAX API calls" to the API gateway (single entry point), which talks to the services and returns "JSON"; API calls follow REST; client and servers sit on different origins. Others: Event-Driven, Serverless, MVC, MVVM.

### REST (L3 s44–53)

Representational State Transfer: an architectural **style, a set of constraints**, not a pattern like Microservices or MVC.

| Constraint, in order | Meaning · benefit (example) |
|---|---|
| 1 Client–Server | separation of concerns: UI on the client, data and logic on the server · evolvability (GitHub web, mobile, CLI) |
| 2 Stateless | each request carries all the info, no session state: ask for page 51, not "the next page" · scalability |
| 3 Cacheable | the server marks responses with Cache-Control, ETag, Expires · performance |
| 4 Uniform Interface **(core)** | `/users/123`; nouns in the URL, verbs are HTTP methods · predictability |
| 5 Layered System | the client can't tell the origin server from a proxy or gateway · flexibility, security (AWS API Gateway) |

Code-on-Demand is the optional sixth, on s53 only. The gateway is the single entry point; it does routing, authentication, auditing.

## Side 2

### Web API anatomy, GET vs POST (L3 s25–39)

Four parts: 1 **Headers** (request: API-key; response: status, content-type), 2 **Data** (body, message), 3 **Endpoint** (the URL where the API server listens), 4 **HTTP Methods**: GET get, POST create, PUT update, DELETE delete. Query string: `?name1=value1&name2=value2`. A web server returns HTML (which can change any time); an API server returns JSON/XML (which does not). Map search → GET; online banking login → POST.

| | GET | POST |
|---|---|---|
| Where | query string in the URL | request body |
| Back / reload | harmless | data re-submitted (browser warns) |
| Bookmark · cache · history | can · can · parameters remain | cannot · never · not saved |
| Data length | max URL length 2048 characters | no restrictions |
| Data type | only ASCII | binary also allowed |
| Security / visibility | less safe; visible in the URL | "a little safer"; not in the URL |

Which is secure? "**none!**" Data is not encrypted by default; use https. There is no standard limit on response size for either (L6 s54). **PUT** replaces the whole object; **PATCH** updates one property. **Idempotent** = applied many times, same result: PUT is, POST is not (a repeated POST can place an order twice). Saving a whole edited record is a PUT.

### Node.js (L4)

- Open-source JavaScript runtime on Chrome V8 that runs JS **outside** the browser. "Single-threaded, non-blocking, asynchronous", memory efficient *[real: the event loop is single-threaded; a thread pool reads files]*.
- **PHP/ASP, 4 steps**: send the task to the file system → wait while the file is read → return the content → ready for the next request. **Node, 3 steps**: send the task → ready for the next request → return the content when the file is read. Node eliminates the waiting.
- **Restaurant**: Example 1, one waiter serves all tables = single-threaded **non-blocking** (Node); Example 2, the waiter waits at the kitchen = single-threaded **blocking** (the waiter is not used efficiently); Example 3, one waiter per table = **multi-threaded** (100 requests → 100 threads).
- Modules: `exports.area = function (r) {…};` then `const mo = require('./modules/math');` (`./` = same folder, `.js` optional; the exported and the called names must match). Built-in `http`, `url`, `fs`; `mysql` needs `npm install mysql`.

```js
const http = require('http');
const url = require('url');
const fs = require('fs');
const CORS = { "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type" };
http.createServer(function (req, res) {    // res.writeHead, not req
  if (req.method === "OPTIONS") {          // answer the preflight
    res.writeHead(204, CORS);  return res.end(); }
  const q = url.parse(req.url, true);  // true → q.query is an object
  if (q.pathname === "/time") {
    res.writeHead(200, {"Content-Type": "text/html"}); // status, not port
    res.end('<p style="color:blue">' + new Date() + '</p>');
  } else if (q.pathname === "/greet") {    // /greet?name=Ana&city=Burnaby
    res.writeHead(200, {"Content-Type": "text/plain", ...CORS});
    res.end("Hello " + q.query.name + " from " + q.query.city);
  } else fs.readFile("." + q.pathname, function (err, data) {
    if (err) { res.writeHead(404, {'Content-Type': 'text/html'});
               return res.end(q.pathname + " 404 Not Found!"); }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);  return res.end();
  });
}).listen(8888);             // http://localhost:8888/file.txt
```

`url.parse('http://localhost:8888/default.htm?name=John&age=23', true)`: `host` 'localhost:8888', `pathname` '/default.htm', `search` '?name=John&age=23', `query` {name: 'John', age: '23'} (strings). Without `true`, `query` is the string, so `q.query.name` is `undefined`. **Status**: 200 OK, 3xx redirection, 4xx client error (403 Forbidden, 404 Not Found), 5xx server error.

### AJAX with XMLHttpRequest (L5 s4–9, L6 s55)

```js
let xhttp = new XMLHttpRequest();            // 1 create
xhttp.onreadystatechange = function () {     // 2 handler
  if (this.readyState == 4 && this.status == 200) {
    document.getElementById("demo").innerHTML = this.responseText;
  }
};
xhttp.open("GET", "/api/echo?city=" + city, true);  // 3 (method, url, async)
xhttp.send();                     // 4 send (async true: don't wait)
```

| readyState | name | meaning |
|---|---|---|
| 0 | UNSENT | object created, `open()` not called |
| 1 | OPENED | `open()` called |
| 2 | HEADERS_RECEIVED | `send()` called, response headers available |
| 3 | LOADING | response arriving; repeats for a large, chunked response |
| 4 | DONE | complete: success (2xx) or an error, so check `status` too |

L6 s55: the w3schools list ("2 request received, 3 processing request") is **not accurate**.

```js
// POST: data in the body (GET: in the URL; a send() body is ignored)
xhttp.open("POST", endPointRoot + "patients/", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("name=John&age=23");
let body = "";      // server, req.method === "POST": body in chunks
req.on('data', function (chunk) { body += chunk; });
req.on('end', function () {                 // all data arrived
  const name = new URLSearchParams(body).get("name");  // string
  res.writeHead(200, {"Access-Control-Allow-Origin": "*"});
  res.end("Saved " + name); });             // reply inside 'end'
```

### CORS (L5 s15–21)

- "CORS is a security feature **implemented in web browsers** and is **configured by the contacted server** in the response's header." The default is the **Same-Origin Policy** (page and server scripts on one origin): browsers block cross-origin requests unless the server explicitly allows it.
- **Origin = domain + protocol + port** (80 is the default for HTTP, 443 for HTTPS). `"Access-Control-Allow-Origin": "*"` (or the exact origin) in `writeHead`; also `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.
- **Preflight** = a request with method **OPTIONS** that the browser sends first to ask whether the method and headers are allowed (for example `application/json`; not form-urlencoded or `text/plain`). Postman ignores CORS (it is not a browser); CORS is not encryption.

```text
Page script → Browser: send() JSON
Browser → Server:      1 OPTIONS (preflight) + Origin
Server → Browser:      2 Allow-Origin / Allow-Methods / Allow-Headers
Browser → Server:      3 the real POST
Server → Browser:      4 response + Allow-Origin  → script can read it
```

### Promises (L6)

States: **Pending** → **Fulfilled** (Resolved) via `resolve(v)`, or **Rejected** via `reject(e)`. Fulfilled + Rejected = **Settled**; a settled promise never changes again.

**Why promises**: asynchronous work finishes later, after the function has returned, and a function returns one thing; a promise carries success (resolve) or failure (reject). **Callback hell** = nesting each call in the previous callback; a `.then` chain avoids it.

1. **Order**: all synchronous code (executors included) → every **microtask** (handlers, in the order queued, including ones that microtasks queue) → **one timer**, then its microtasks, then the next timer.
2. The **executor** (the slide spells it "executer") runs **immediately** on `new Promise(...)` (promises are eager).
3. **Settle once**: the first resolve/reject wins; later calls are ignored. Handlers run asynchronously, mutually exclusive, only once.
4. Handlers **never run synchronously**, even on an already settled promise: `Promise.resolve().then(f); console.log(2)` logs 2 first.
5. `.then(s, f)` returns a **new promise**. **Returning a value** fulfils the next one (`return new Error()` fulfils too; a returned promise is waited for). **Throwing** rejects the next one.
6. A rejection skips success handlers until the next `f` or `.catch`; a `.then`'s `f` watches the promise before it, not its own `s`.
7. `.catch(f)` = `.then(null, f)`; the chain is fulfilled again with `f`'s return value.
8. `.finally(f)` ≈ `.then(f, f)`: it runs either way, gets **no argument**, **passes the value or error through**, and does **not** handle the rejection.
9. A non-function, `.then(42)` or `.then(g())`, is ignored: the value passes through.
10. No handler → `Uncaught (in promise) …` in the console (slide: terminates the script *[real: the browser keeps running]*). Old Chrome shows the status "resolved" *[real: "fulfilled"]*.
11. An **async** function always returns a promise. **await** (inside an async function) waits for a promise to resolve or reject and **pauses that function only**: the code after the call runs first. `try`/`catch` around `await` does what `.catch` does.

```js
console.log("7");
let p = new Promise(function (resolve, reject) {
  resolve("4"); console.log("2"); reject("3"); console.log("5");
});
console.log("1");
p.then(m => console.log(m), e => console.log(e));
console.log("8");                  // 7 2 5 1 8 4   ("3" never)

const checkStock = qty => new Promise((resolve, reject) => {
  if (qty <= 5) resolve("reserved " + qty);
  else reject(new Error("only 5 left")); });
const findPatientP = id => new Promise(resolve => findPatient(id, resolve));
findPatientP(7)          // chain, no nesting (findVisitsP made the same way)
  .then(p => { console.log(p.name); return findVisitsP(p); })
  .then(v => console.log(v.length + " visits"))
  .catch(e => console.log(e.message))
  .finally(() => console.log("done"));
async function show(id) {          // same with async/await
  try { const p = await findPatientP(id);   // pauses show() only
        console.log(p.name);
        const v = await findVisitsP(p);  console.log(v.length + " visits");
  } catch (e) { console.log(e.message); }
}
show(7);  console.log("after");    // "after" prints before p.name
```

### Node to MySQL and CRUD (L5 s31–45, L7)

```js
const mysql = require("mysql");      // npm install mysql
const con = mysql.createConnection({ host: "localhost",   // 1 create
  user: "root", password: "", database: "webdev" });
con.connect(function (err) {                               // 2 connect
  if (err) throw err;
  let sql = "INSERT INTO score(name, score) " +
            "values ('elon musk', 2900)";
  con.query(sql, function (err, result) {                  // 3 query
    if (err) throw err;
    console.log("1 record inserted");
  });
});
```

| CRUD | SQL | HTTP |
|---|---|---|
| Create (a table or DB) | INSERT (CREATE TABLE) | POST |
| Read | SELECT | GET |
| Update (records) | UPDATE | PUT (PATCH) |
| Delete (a record, or Drop a table) | DELETE (DROP TABLE) | DELETE |

- `mysql` runs in Node, not in the browser: credentials stay on the server, because page code is visible to every visitor; the page calls the API and the server runs `con.query`. **Least privilege**: one DB user per job, the read user has SELECT only (DROP or DELETE is refused). A database is **not** a DBMS.
- **Primary key**: unique per row (Patient_ID in Patient). **Foreign key**: "a primary key of another table presents in this table" (Patient_ID in Visit). 1:M patient → visits; 1:1 = a UNIQUE foreign key; M:M through an associative table. **Referential integrity**: deleting a patient orphans its visits.

## Self-test

```quiz
[
  {
    "type": "fill",
    "q": "Name the five XMLHttpRequest readyState values in order, as the lecture gives them (capitals and underscores as in the constants).",
    "code": "0 ___\n1 ___\n2 ___\n3 ___\n4 ___",
    "answer": ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"],
    "shuffle": false,
    "explain": "0 UNSENT (created, open() not called), 1 OPENED (open() called), 2 HEADERS_RECEIVED (send() called, headers available), 3 LOADING (response arriving, can repeat), 4 DONE (success or error). The w3schools wording such as 'request received' is the version L6 s55 marks as not accurate."
  },
  {
    "type": "reorder",
    "q": "Put the parts of the CSS box model in order from the inside out.",
    "lines": ["content", "padding", "border", "margin"],
    "explain": "Content sits in the middle, wrapped by padding (transparent), then the border, then the margin (transparent) that separates the box from its neighbours."
  },
  {
    "q": "What does this chain print?",
    "code": "Promise.resolve(\"room 4\")\n  .finally((arg) => console.log(\"finally got\", arg))\n  .then((room) => console.log(\"then got\", room));",
    "options": [
      "finally got undefined, then then got room 4",
      "finally got room 4, then then got room 4",
      "finally got room 4, then then got undefined",
      "finally got undefined, then then got undefined"
    ],
    "answer": 0,
    "explain": "Rule 8 on side 2: `.finally(f)` runs on either outcome but its callback gets no argument, so `arg` is `undefined`; it passes the value through, so the next `.then` still receives \"room 4\"."
  },
  {
    "type": "text",
    "q": "Before some cross-origin requests (for example a POST with a JSON body), the browser first sends a request with the method OPTIONS to ask the server what it allows. What is that first request called?",
    "answer": ["preflight", "preflight request", "a preflight request", "pre-flight"],
    "explain": "It is the preflight request. The server answers it with Access-Control-Allow-Origin, -Methods and -Headers; only if those allow the real request does the browser send it."
  },
  {
    "q": "Which statement about GET and POST matches the lecture's comparison table?",
    "options": [
      "GET parameters remain in the browser history; POST parameters are not saved there",
      "POST requests can be bookmarked; GET requests cannot",
      "GET allows binary data; POST allows only ASCII characters",
      "POST is secure because its data is encrypted by default"
    ],
    "answer": 0,
    "explain": "GET parameters stay in history and in the URL; POST parameters are not saved in history. GET can be bookmarked and POST cannot; GET is ASCII only while POST also allows binary; and neither is secure by default (\"none!\"), so encryption needs https."
  },
  {
    "type": "reorder",
    "q": "Put the five RESTful API server principles in the order the lecture lists them.",
    "lines": ["Client–Server", "Stateless", "Cacheable", "Uniform Interface", "Layered System"],
    "explain": "L3 s49: 1 Client–Server, 2 Stateless, 3 Cacheable, 4 Uniform Interface (the core constraint), 5 Layered System. Code-on-Demand appears only on the benefits slide."
  },
  {
    "q": "What does this program print, line by line?",
    "code": "setTimeout(() => console.log(\"A\"), 0);\nPromise.resolve(\"B\").then(v => console.log(v));\nconsole.log(\"C\");\nnew Promise(r => { console.log(\"D\"); r(\"E\"); }).then(v => console.log(v));",
    "options": ["C D B E A", "D C B E A", "C D A B E", "A B C D E"],
    "answer": 0,
    "explain": "Synchronous code first: C, then the executor runs immediately and prints D. The stack is now empty, so the two promise handlers (microtasks) run in the order they were queued: B, then E. The 0 ms timer comes last: A."
  },
  {
    "q": "Which combination defines an origin, the unit the Same-Origin Policy and Web Storage both use?",
    "options": [
      "domain + protocol + port",
      "domain + path",
      "domain only",
      "protocol + file name"
    ],
    "answer": 0,
    "explain": "L5 s18: an origin is the combination of domain, protocol and port (80 is the default for HTTP, 443 for HTTPS). The path does not matter, so two pages in different folders of the same site share one origin."
  },
  {
    "type": "fill",
    "q": "Complete Node.js's three steps for a file request (L4 s12).",
    "code": "1. Sends the task to the computer's file system.\n2. Ready to handle the ___ request.\n3. When the file system has opened and read the file, the server returns the ___ to the client.",
    "answer": ["next", "content"],
    "explain": "Node does not wait: it is ready for the next request at step 2, and returns the content when the file has been read. PHP or ASP waits while the file is read and is ready for the next request only at step 4."
  },
  {
    "type": "text",
    "q": "PUT can be applied many times without changing the result; repeating a POST can place an order twice. What one word describes PUT here?",
    "answer": ["idempotent", "Idempotent"],
    "explain": "Idempotent: applying the request many times has the same result as applying it once. PUT replaces the object, so repeating it changes nothing more; POST creates something new each time."
  }
]
```
