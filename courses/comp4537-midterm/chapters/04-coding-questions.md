---
title: Eleven coding questions, Node servers, XHR, promises and storage
minutes: 45
---

Eleven questions in the shape of the exam's coding answers. The browser-runnable ones are challenges checked against the console; the Node ones are written answers with a model listing and a rubric to tick. Write the skeleton first, then fill in the detail.

## C1: a Node server that answers GET /time

```quiz
[
  {
    "type": "free",
    "q": "Write a Node server on port 8080 that answers `GET /time` with the server's current date and time in blue, and `404` for any other path.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`require('http')` and `require('url')`", "`http.createServer(function (req, res) { … })`", "`url.parse(req.url, true)` and a test on `q.pathname === \"/time\"`", "`res.writeHead(200, {\"Content-Type\": \"text/html\"})` then `res.end(…)` with `style=\"color:blue\"` and `new Date()`", "a `404` branch with its own `writeHead` and `end`", "`.listen(8080)`"],
    "rows": 12,
    "explain": "The first argument of `writeHead` is the status code (200 or 404), never the port; the port goes to `listen`. The date comes from `new Date()` on the server, so it shows the server's clock."
  }
]
```

### Model answer

```js pin clinic-time.js
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  if (q.pathname === "/time") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end('<p style="color:blue">Clinic server time: ' + new Date() + '</p>');
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end(q.pathname + " 404 Not Found!");
  }
}).listen(8080);
```

`url.parse(req.url, true)` splits the request line; `q.pathname` is the path without the query string, so `/time?x=1` still matches. Each branch calls `res.writeHead` before `res.end`, and `new Date()` runs on the server. Opening `http://localhost:8080/time` shows one blue line (your date will differ):

```text
Clinic server time: Tue Oct 27 2026 10:15:42 GMT-0700 (Pacific Daylight Time)
```

and `http://localhost:8080/hours` shows `/hours 404 Not Found!`. `url.parse` is the slide's method (lecture 4, slide 38) and is legacy in current Node; `new URL(req.url, "http://localhost:8080")` is its replacement.

### The request through the server

```diagram
{ "type": "tree", "title": "Request to response in a Node server", "nodes": [ { "id": "browser", "label": "Browser", "sub": "GET /time" }, { "id": "server", "label": "createServer callback", "sub": "(req, res)", "parent": "browser" }, { "id": "parse", "label": "url.parse(req.url, true)", "parent": "server" }, { "id": "branch", "label": "q.pathname === \"/time\"?", "parent": "parse" }, { "id": "ok", "label": "yes: writeHead(200)", "sub": "end(blue date)", "parent": "branch" }, { "id": "nf", "label": "no: writeHead(404)", "sub": "end(404 Not Found!)", "parent": "branch" } ], "hi": ["branch"], "caption": "One callback runs per request; the branch decides the status code." }
```

```widget
node-server-play
{ "mode": "request", "predict": true }
```

## C2: an XHR GET with a city parameter

```quiz
[
  {
    "type": "free",
    "q": "Write the client code that sends an asynchronous XHR GET with a `city` parameter to `/api/echo` and logs the response.",
    "model": "The runnable listing under *Model answer* below is one full answer.",
    "points": ["`new XMLHttpRequest()`", "`onreadystatechange` testing `this.readyState == 4 && this.status == 200`", "the city in the query string: `\"/api/echo?city=\" + city`", "`open(\"GET\", url, true)`", "`send()` with no body", "the response read from `this.responseText`"],
    "rows": 10,
    "explain": "Lecture 5's four steps, in order: create, assign the handler, open, send. Testing only `readyState == 4` would also log a 404 page."
  }
]
```

### Model answer

```js run pin XHR GET
const city = "Vancouver";
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this.responseText);
  }
};
xhttp.open("GET", SERVER + "/api/echo?city=" + city, true);
xhttp.send();
```

`xhttp.open("GET", SERVER + "/api/echo?city=" + city, true)` puts the parameter in the URL, and `xhttp.send()` sends no body. The handler logs `this.responseText` only on `this.readyState == 4 && this.status == 200`; on a page, the slide writes it into an element instead: `document.getElementById("demo").innerHTML = this.responseText`. Run prints the echo server's JSON:

```text
{"method":"GET","path":"/api/echo","query":{"city":"Vancouver"},"headers":{"origin":"null","accept":"*/*"},"body":""}
```

### readyState 1 to 4 across the request

```diagram
{ "type": "sequence", "title": "XHR GET", "nodes": [ { "id": "script", "label": "script", "kind": "lane" }, { "id": "xhr", "label": "XMLHttpRequest", "kind": "lane" }, { "id": "server", "label": "server", "kind": "lane" } ], "edges": [ { "from": "script", "to": "xhr", "label": "new XMLHttpRequest()" }, { "from": "script", "to": "xhr", "label": "onreadystatechange = …" }, { "from": "script", "to": "xhr", "label": "open('GET', url, true) → 1" }, { "from": "script", "to": "xhr", "label": "send()" }, { "from": "xhr", "to": "server", "label": "GET ?city=Vancouver" }, { "from": "server", "to": "xhr", "label": "headers → 2" }, { "from": "server", "to": "xhr", "label": "body → 3" }, { "from": "server", "to": "xhr", "label": "done → 4, status 200" }, { "from": "xhr", "to": "script", "label": "handler logs responseText" } ], "hi": ["8", "9"], "caption": "The handler runs on every change; its test passes only at readyState 4 with status 200." }
```

```widget
xhr-play
{ "method": "GET", "url": "/api/echo?city=Vancouver", "async": true, "status": 200 }
```

## C3: callbacks turned into a promise chain

The two functions below take a callback. Write `findPatientP` and `findVisitsP`, which return promises, and chain them to print the patient's name, then the number of visits.

```challenge
{ "lang": "js", "prompt": "Wrap <code>findPatient</code> and <code>findVisits</code> in functions that return promises, then chain them (no nesting) to print the name and then <code>2 visits</code>.", "starter": "function findPatient(id, done) {\n  setTimeout(() => done({ id, name: \"Rosa\" }), 100);\n}\nfunction findVisits(patient, done) {\n  setTimeout(() => done([\"2026-09-02\", \"2026-10-14\"]), 100);\n}\n\n// The nested version:\n// findPatient(7, (p) => {\n//   console.log(p.name);\n//   findVisits(p, (v) => console.log(v.length + \" visits\"));\n// });\n\n// Write findPatientP and findVisitsP, then the chain.\n", "expected": "Rosa\n2 visits", "hints": ["Each wrapper returns <code>new Promise((resolve) => …)</code> and passes <code>resolve</code> as the callback.", "Return <code>findVisitsP(p)</code> from the first <code>.then</code> so the next <code>.then</code> waits for it."], "solution": "function findPatient(id, done) {\n  setTimeout(() => done({ id, name: \"Rosa\" }), 100);\n}\nfunction findVisits(patient, done) {\n  setTimeout(() => done([\"2026-09-02\", \"2026-10-14\"]), 100);\n}\n\nconst findPatientP = (id) => new Promise((resolve) => findPatient(id, resolve));\nconst findVisitsP = (patient) => new Promise((resolve) => findVisits(patient, resolve));\n\nfindPatientP(7)\n  .then((p) => {\n    console.log(p.name);\n    return findVisitsP(p);\n  })\n  .then((v) => console.log(v.length + \" visits\"));\n" }
```

The first `.then` returns the next promise, so the second `.then` waits for the visits: lecture 6, slide 31's rule that a returned value (here a promise) fulfils the next promise. The nested version is the start of the callback hell on slide 40. Rubric: each wrapper returns `new Promise`; `resolve` is the callback; the first handler returns `findVisitsP(p)`; no nesting.

```widget
promise-chain-play
{ "mode": "chain", "predict": false }
```

## C4: CORS headers and the preflight

```quiz
[
  {
    "type": "free",
    "q": "Write a Node server on port 8080 that lets a page on another origin GET and POST JSON. It must answer the browser's preflight.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`Access-Control-Allow-Origin` set to `*` or the page's exact origin", "`Access-Control-Allow-Methods` listing GET, POST, OPTIONS", "`Access-Control-Allow-Headers: Content-Type`, because `application/json` triggers a preflight", "an `OPTIONS` branch answered before the normal route", "the headers go in the server's response; the browser enforces them"],
    "rows": 12,
    "explain": "Lecture 5, slide 24's server checks for the preflight inside its POST branch. That only worked because its request was form-urlencoded, which needs no preflight; a JSON POST sends `OPTIONS` first, and a server with no `OPTIONS` branch gets the request blocked."
  }
]
```

### Model answer

```js pin cors-server.js
const http = require('http');

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

http.createServer(function (req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }
  let body = "";
  req.on("data", function (chunk) { body += chunk; });
  req.on("end", function () {
    res.writeHead(200, { ...CORS, "Content-Type": "text/plain" });
    res.end(req.method + " received " + body);
  });
}).listen(8080);
```

The `req.method === "OPTIONS"` branch answers the preflight with `204` and the `CORS` headers and no body. Every other request gets the same headers plus `"Content-Type": "text/plain"`. A JSON POST of `{"title":"Dune"}` from another origin then reads:

```text
POST received {"title":"Dune"}
```

```widget
cors-play
{ "contentType": "application/json", "allowOrigin": "*", "method": "POST" }
```

## C5: reading a query string in Node

```quiz
[
  {
    "type": "free",
    "q": "Write a Node server on port 8080 where `GET /greet?name=Ana&city=Burnaby` returns `Hello Ana from Burnaby`.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`require('url')`", "`url.parse(req.url, true)`: the `true` makes `query` an object", "`q.query.name` and `q.query.city` (values are strings)", "`writeHead` before `end`"],
    "rows": 8,
    "explain": "Without `true`, `q.query` is the string `name=Ana&city=Burnaby` and `q.query.name` is `undefined`. `q.pathname` is `/greet` and `q.search` is `?name=Ana&city=Burnaby`, with the `?` (lecture 4, slide 38)."
  }
]
```

### Model answer

```js pin greet.js
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello " + q.query.name + " from " + q.query["city"]);
}).listen(8080);
```

`q.query.name` and `q.query["city"]` are two ways to read the same object. `http://localhost:8080/greet?name=Ana&city=Burnaby` shows:

```text
Hello Ana from Burnaby
```

## C6: URLSearchParams in the browser

```challenge
{ "lang": "js", "prompt": "Given <code>s</code>, print the title, the copies and the branch, each on its own line, then the number of copies plus 1.", "starter": "const s = \"title=Dune&copies=3&branch=Central\";\n", "expected": "Dune\n3\nCentral\n4", "hints": ["<code>new URLSearchParams(s)</code> and its <code>get</code> method.", "<code>get</code> returns a string: <code>\"3\" + 1</code> is <code>\"31\"</code>."], "solution": "const s = \"title=Dune&copies=3&branch=Central\";\nconst p = new URLSearchParams(s);\nconsole.log(p.get(\"title\"));\nconsole.log(p.get(\"copies\"));\nconsole.log(p.get(\"branch\"));\nconsole.log(Number(p.get(\"copies\")) + 1);\n" }
```

`URLSearchParams` is what lecture 5, slide 24's server uses on a POST body. Rubric: `new URLSearchParams(s)`; `get` for each name; `Number` before adding.

## C7: a rejection, .catch and .finally

```challenge
{ "lang": "js", "prompt": "Write <code>checkStock(qty)</code>, which returns a promise: it resolves <code>\"reserved \" + qty</code> when <code>qty &lt;= 5</code>, otherwise it rejects with <code>new Error(\"only 5 left\")</code>. Call it with 8, print the result or the error message, and print <code>done</code> in <code>.finally</code>.", "starter": "function checkStock(qty) {\n  // return a promise\n}\n\n// call it with 8\n", "expected": "only 5 left\ndone", "hints": ["<code>new Promise((resolve, reject) => …)</code>", "<code>.catch((e) => console.log(e.message))</code>, then <code>.finally(() => console.log(\"done\"))</code>"], "solution": "function checkStock(qty) {\n  return new Promise((resolve, reject) => {\n    if (qty <= 5) resolve(\"reserved \" + qty);\n    else reject(new Error(\"only 5 left\"));\n  });\n}\n\ncheckStock(8)\n  .then((msg) => console.log(msg))\n  .catch((e) => console.log(e.message))\n  .finally(() => console.log(\"done\"));\n" }
```

The `.then` handler is skipped, `.catch` receives the `Error`, and `.finally` runs either way with no argument. With `checkStock(3)` the output is `reserved 3` then `done`. Rubric: `reject` with an `Error`; `.catch` reads `e.message`; `.finally` last.

## C8: C3 with async and await

```challenge
{ "lang": "js", "prompt": "Rewrite C3's chain as an <code>async</code> function <code>show(id)</code> that uses <code>await</code> and <code>try</code>/<code>catch</code>, then call <code>show(7)</code>.", "starter": "function findPatient(id, done) {\n  setTimeout(() => done({ id, name: \"Rosa\" }), 100);\n}\nfunction findVisits(patient, done) {\n  setTimeout(() => done([\"2026-09-02\", \"2026-10-14\"]), 100);\n}\nconst findPatientP = (id) => new Promise((resolve) => findPatient(id, resolve));\nconst findVisitsP = (patient) => new Promise((resolve) => findVisits(patient, resolve));\n\n// write show(id), then call show(7)\n", "expected": "Rosa\n2 visits", "hints": ["<code>const p = await findPatientP(id);</code>", "Wrap the awaits in <code>try { … } catch (e) { console.log(e.message); }</code>"], "solution": "function findPatient(id, done) {\n  setTimeout(() => done({ id, name: \"Rosa\" }), 100);\n}\nfunction findVisits(patient, done) {\n  setTimeout(() => done([\"2026-09-02\", \"2026-10-14\"]), 100);\n}\nconst findPatientP = (id) => new Promise((resolve) => findPatient(id, resolve));\nconst findVisitsP = (patient) => new Promise((resolve) => findVisits(patient, resolve));\n\nasync function show(id) {\n  try {\n    const p = await findPatientP(id);\n    console.log(p.name);\n    const v = await findVisitsP(p);\n    console.log(v.length + \" visits\");\n  } catch (e) {\n    console.log(e.message);\n  }\n}\nshow(7);\n" }
```

Each `await` pauses only `show`; the output matches C3. Rubric: `async` on the function; `await` on each promise; `try`/`catch` in place of `.catch` (lecture 6, slide 52).

## C9: a POST handler that collects the body

```quiz
[
  {
    "type": "free",
    "q": "Write a Node server on port 8080 whose POST handler collects a form-urlencoded body `title=…` and replies `Saved <title>` to a page on another origin.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["checks `req.method === \"POST\"`", "`req.on(\"data\", …)` appends each chunk", "replies only inside `req.on(\"end\", …)`", "parses the body, e.g. `new URLSearchParams(body).get(\"title\")`", "`Access-Control-Allow-Origin` in the reply"],
    "rows": 12,
    "explain": "A form-urlencoded POST needs no preflight, so `Access-Control-Allow-Origin` alone lets the other page read the reply. Replying outside the `end` handler would answer before the body has arrived."
  }
]
```

### Model answer

```js pin save-book.js
const http = require('http');

http.createServer(function (req, res) {
  if (req.method === "POST") {
    let body = "";
    req.on("data", function (chunk) { body += chunk; });
    req.on("end", function () {
      const title = new URLSearchParams(body).get("title");
      res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
      res.end("Saved " + title);
    });
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("POST only");
  }
}).listen(8080);
```

The body arrives in chunks: `body += chunk` builds it, and the `req.on("end", function () {` handler runs once all of it is in, so `res.end("Saved " + title)` waits for the whole body. Sending `title=Dune` gives:

```text
Saved Dune
```

## C10: Node inserts one row into MySQL

```quiz
[
  {
    "type": "free",
    "q": "Write Node code that connects to a MySQL database `bookstore` and inserts one row into `books(title, price)`.",
    "model": "The listing under *Model answer* below is one full answer.",
    "points": ["`require(\"mysql\")`, an external module installed with `npm install mysql`", "`mysql.createConnection({ host, user, password, database })`", "`con.connect(callback)` with an `err` check", "`con.query(sql, (err, result) => …)`", "credentials stay on the server; the DB user has only the privileges it needs"],
    "rows": 12,
    "explain": "The `mysql` package is the slide's (lecture 5, slide 43); `mysql2` is the maintained replacement with the same `createConnection`, `connect` and `query` calls."
  }
]
```

### Model answer

```js pin add-book.js
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "bookstore_writer",
  password: "change-me",
  database: "bookstore"
});

con.connect(function (err) {
  if (err) throw err;
  const sql = "INSERT INTO books (title, price) VALUES ('Dune', 19.99)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
```

`mysql.createConnection` only describes the connection; `con.connect` opens it, and `con.query` runs inside its callback so the insert waits for the connection. The user `bookstore_writer` gets INSERT on `books` and nothing more. Node's terminal shows:

```text
1 record inserted
```

### The browser never talks to the database

```diagram
{ "type": "flow", "title": "Client → API server → database", "nodes": [ { "id": "client", "label": "Browser page", "sub": "origin A" }, { "id": "api", "label": "Node API server", "sub": "origin B" }, { "id": "db", "label": "MySQL", "kind": "cylinder" } ], "edges": [ { "from": "client", "to": "api", "label": "POST /books (CORS)", "both": true }, { "from": "api", "to": "db", "label": "con.query(INSERT)", "both": true } ], "hi": ["api"], "caption": "The credentials live on the API server; the page only sends the request and reads the response." }
```

## C11: a reading list in localStorage

```quiz
[
  {
    "type": "free",
    "q": "Write a page that stores a reading-list object in `localStorage`, and a second page that reads it back and prints it. The second page must cope with an empty store.",
    "model": "The two listings under *Model answer* below are one full answer.",
    "points": ["`JSON.stringify` before `setItem`", "`JSON.parse` after `getItem`", "`getItem` returns a string, or `null` for a missing key, and the reader handles `null`", "both pages on the same origin, in the same browser"],
    "rows": 10,
    "explain": "Web storage holds strings only: storing the object directly saves `[object Object]`. The reader sees the data only with the same origin, same browser and same machine (lecture 2, slide 37)."
  }
]
```

### Model answer: the writer page

```html run pin writer.html
<!DOCTYPE html>
<html>
<body>
  <p id="msg"></p>
  <script>
    const list = { owner: "Sam", books: ["Dune", "Emma"] };
    localStorage.setItem("readingList", JSON.stringify(list));
    document.getElementById("msg").innerHTML = "Saved " + list.books.length + " books";
  </script>
</body>
</html>
```

`localStorage.setItem("readingList", JSON.stringify(list))` stores the object as the string `{"owner":"Sam","books":["Dune","Emma"]}`, and `list.books.length` gives the page its message: Saved 2 books.

### Model answer: the reader page

```html run pin reader.html
<!DOCTYPE html>
<html>
<body>
  <p id="out"></p>
  <script>
    const raw = localStorage.getItem("readingList");
    const out = document.getElementById("out");
    if (raw === null) {
      out.innerHTML = "No reading list yet";
    } else {
      const list = JSON.parse(raw);
      out.innerHTML = list.owner + ": " + list.books.join(", ");
    }
  </script>
</body>
</html>
```

`localStorage.getItem("readingList")` returns the string or `null`; the `raw === null` test covers a first visit, and `JSON.parse(raw)` turns the string back into an object. Run the writer first and the reader shows `Sam: Dune, Emma`; reset and run the reader alone and it shows `No reading list yet`.

```quiz
[
  {
    "q": "Click the line with the bug: the server never answers.",
    "type": "spotbug",
    "code": "const http = require(\"http\");\nhttp.createServer(function (req, res) {\n  req.writeHead(200, { \"Content-Type\": \"text/plain\" });\n  res.end(\"Clinic open 8 to 6\");\n}).listen(8080);",
    "answer": [3],
    "explain": "`writeHead` belongs to the response, `res`, not the request, `req`. `req.writeHead` is not a function, so the callback throws before `res.end` runs."
  },
  {
    "q": "Click the line with the bug: the forecast server should answer with status OK.",
    "type": "spotbug",
    "code": "const http = require(\"http\");\nhttp.createServer(function (req, res) {\n  res.writeHead(3000, { \"Content-Type\": \"text/plain\" });\n  res.end(\"Forecast: rain\");\n}).listen(3000);",
    "answer": [3],
    "explain": "The first argument of `writeHead` is the status code, `200`; the port belongs only in `listen(3000)`."
  },
  {
    "q": "Click the line with the bug: `/note?owner=Lee` answers `Note for undefined`.",
    "type": "spotbug",
    "code": "const http = require(\"http\");\nconst url = require(\"url\");\nhttp.createServer(function (req, res) {\n  const q = url.parse(req.url);\n  res.writeHead(200, { \"Content-Type\": \"text/plain\" });\n  res.end(\"Note for \" + q.query.owner);\n}).listen(8080);",
    "answer": [4],
    "explain": "Without the second argument `true`, `url.parse` leaves `q.query` as the string `owner=Lee`, so `q.query.owner` is `undefined`. `url.parse(req.url, true)` makes `query` an object."
  },
  {
    "q": "Click the line with the bug: when the server answers 404, the page still logs the error page as the stock level.",
    "type": "spotbug",
    "code": "const xhttp = new XMLHttpRequest();\nxhttp.onreadystatechange = function () {\n  if (this.readyState == 4) {\n    console.log(\"Stock: \" + this.responseText);\n  }\n};\nxhttp.open(\"GET\", \"/api/stock?isbn=9780441013593\", true);\nxhttp.send();",
    "answer": [3],
    "explain": "readyState 4 (DONE) is reached on success and on error alike. The test must be `this.readyState == 4 && this.status == 200`."
  },
  {
    "q": "Click the line with the bug: this prints `Rosa`, then `undefined visits`.",
    "type": "spotbug",
    "code": "findPatientP(7)\n  .then((p) => {\n    console.log(p.name);\n    return p;\n  })\n  .then(findVisitsP())\n  .then((v) => console.log(v.length + \" visits\"));",
    "answer": [6],
    "explain": "`findVisitsP()` is called at once, with no patient, and its promise is passed to `.then`. A `.then` given something that is not a function ignores it and passes the patient through, so `v` is the patient object and `v.length` is `undefined`. Pass the function itself: `.then(findVisitsP)`."
  },
  {
    "q": "Two files: a module and the server that loads it. Click every line involved in the `TypeError: clock.currentTime is not a function`.",
    "type": "spotbug",
    "code": "// clinicClock.js\nexports.openTime = function () {\n  return Date();\n};\n\n// server.js\nconst http = require(\"http\");\nconst clock = require(\"./clinicClock\");\nhttp.createServer(function (req, res) {\n  res.writeHead(200, { \"Content-Type\": \"text/html\" });\n  res.end(\"Now: \" + clock.currentTime());\n}).listen(8888);",
    "answer": [2, 11],
    "explain": "The module exports `openTime` but the server calls `clock.currentTime()`. The two names must match: export `currentTime`, or call `clock.openTime()`. Lecture 4, slide 35 has the same mismatch."
  }
]
```
