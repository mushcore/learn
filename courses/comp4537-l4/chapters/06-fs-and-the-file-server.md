---
title: The fs module and a file server that answers 404
minutes: 16
---

Slide 12's file request now gets real code. The built-in `fs` module reads a file without blocking, and the server answers with its content, or with 404 when the file is not there.

<!-- facts: slide 40 fs built-in module works with the file system on our computer or the server; slide 41 open the requested file, 404 if missing; slide 42 file server "." + q.pathname, readFile, 404 Not Found!, 4xx client error, 404 not found; slide 43 cPanel Setup Node.js App; slide 44 tips for future; slide 45 phpMyAdmin browser based, patient and visit; slide 46 XAMPP in two weeks, ports 80 443 3306; slide 47 arrow functions, one parameter drops parentheses -->

## fs works with the file system (slides 40 and 41)

*We are going to be using another built-in module, 'fs', file system*, which *allows us to work with the file system on our computer or the server.* Slide 41 sets the task: *Create a Node.js file that opens the requested file and returns the content of the file to the client. If the file does not exists, throw a 404 error!*

## The file server maps the path to a file (slide 42)

```js pin fileserver.js
const http = require('http');
const url = require('url');
const fs = require('fs');
http.createServer(function (req, res) {
    const q = url.parse(req.url, true);
    const filename = "." + q.pathname;
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end(q.pathname + " 404 Not Found!");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}).listen(8888);
// at your browser address bar, try
//http://localhost:8888/file.txt
```

What does the browser show for `/file.txt`, and for `/nofile.txt`? `const filename = "." + q.pathname;` turns `/file.txt` into `./file.txt`, a file in the folder the server runs from. `fs.readFile` hands the reading to the file system and returns at once; its callback runs later with either `err` or `data`. A missing file sets `err`, so the server sends `writeHead(404, ...)` and the path plus " 404 Not Found!". Otherwise `res.write(data)` sends the contents. Each `return` stops the callback, so a response is never finished twice.

Worked out, not on the slide, with `file.txt` holding one line:

```text
http://localhost:8888/file.txt     ->  Clinic hours: 9 to 5
http://localhost:8888/nofile.txt   ->  /nofile.txt 404 Not Found!
```

The slide's side note: *4xx are status message codes meaning client error. That means client request was not valid, either due to authentication or the client asked for a file which did not exist*, and *404: not found*. Building the path from the URL also lets a request such as `/../secret.txt` reach outside the folder; real servers clean the path first.

```diagram
{ "type": "tree", "title": "Example 6: one request", "nodes": [ { "id": "req", "label": "GET /file.txt" }, { "id": "name", "label": "./file.txt", "sub": "\".\" + q.pathname", "parent": "req" }, { "id": "read", "label": "fs.readFile", "parent": "name" }, { "id": "ok", "label": "found: 200", "sub": "res.write(data)", "parent": "read" }, { "id": "nf", "label": "err: 404", "sub": "/file.txt 404 Not Found!", "parent": "read" } ], "hi": ["ok"], "caption": "The slide's steps drawn: the server opens the requested file and returns its content." }
```

```diagram
{ "type": "tree", "title": "Example 6: a missing file", "nodes": [ { "id": "req", "label": "GET /nofile.txt" }, { "id": "name", "label": "./nofile.txt", "sub": "\".\" + q.pathname", "parent": "req" }, { "id": "read", "label": "fs.readFile", "parent": "name" }, { "id": "ok", "label": "found: 200", "sub": "res.write(data)", "parent": "read" }, { "id": "nf", "label": "err: 404", "sub": "/nofile.txt 404 Not Found!", "parent": "read" } ], "hi": ["nf"], "caption": "If the file does not exists, throw a 404 error!" }
```

### The readFile hop, found and missing

`fs.readFile` is the kitchen of lesson 2: the callback waits while the server is free. The second widget asks for a file that is not there.

```widget
node-server-play
{ "mode": "request", "preset": "file", "predict": true }
```

```widget
node-server-play
{ "mode": "request", "preset": "file", "fileExists": false }
```

## fs also appends and deletes

Not on the slides, from Lab 4 and the quizzes: `fs.appendFile` adds text to the end of a file and creates the file if it is missing; `fs.unlink` deletes a file. There is no `fs.remove` or `fs.delete`.

```js pin notes.js
const fs = require('fs');
fs.appendFile('notes.txt', 'BCIT\n', (err) => {
  if (err) throw err;
  console.log('line added to notes.txt');
  fs.unlink('old.txt', (err) => {
    if (err) throw err;
    console.log('old.txt was deleted');
  });
});
```

`fs.unlink('old.txt', ...)` runs inside the `appendFile` callback, so the order is fixed. Run in Node with `old.txt` present:

```text
line added to notes.txt
old.txt was deleted
```

## Hosting and the database tools (slides 43 to 46)

Not examined. Slide 43 sets up a Node.js app on shared hosting with cPanel (*Refer to the lecture videos*): "Setup Node.js App" sits under SOFTWARE, phpMyAdmin and MySQL Databases under DATABASES, Terminal under ADVANCED. Slide 44 opens section 8, tips for the future. Slide 45: *We will use the free and open source relational DB administration tool Called phpMyAdmin which is browser based ( thus working on all operating systems)*. Its designer shows two tables joined by `patientid`. Slide 46: XAMPP installs phpMyAdmin *( in two weeks)*, with Apache on ports 80 and 443 and MySQL on 3306.

```diagram
{ "type": "flow", "title": "Database server we use in this course", "nodes": [ { "id": "p", "label": "patient", "sub": "patientid (key), name", "kind": "cylinder" }, { "id": "v", "label": "visit", "sub": "visitid (key), patientid, visitDate", "kind": "cylinder" } ], "edges": [ { "from": "p", "to": "v", "label": "patientid" } ], "caption": "phpMyAdmin's designer: patient.patientid joined to visit.patientid." }
```

## Arrow functions replace function expressions (slide 47)

*ESC6 tips of the week/ Arrow functions to replace old ones*:

```diagram
{ "type": "grid", "title": "ESC6 tips of the week", "nodes": [ { "id": "h0", "label": "regular functions", "row": 0, "col": 0 }, { "id": "h1", "label": "arrow functions", "row": 0, "col": 1 }, { "id": "a0", "label": "setTimeout(function() {…}, timeout);", "row": 1, "col": 0 }, { "id": "a1", "label": "setTimeout(() => {…}, timeout);", "row": 1, "col": 1 }, { "id": "b0", "label": "date = function() { return new Date(); }", "row": 2, "col": 0 }, { "id": "b1", "label": "date = () => { return new Date(); }", "row": 2, "col": 1 }, { "id": "c0", "label": "one parameter", "row": 3, "col": 0 }, { "id": "c1", "label": "hello = val => \"Hello \" + val;", "row": 3, "col": 1 }, { "id": "d0", "label": "two or more parameters", "row": 4, "col": 0 }, { "id": "d1", "label": "sum = (a,b) => a+b;", "row": 4, "col": 1 } ], "caption": "Arrow functions to replace old ones" }
```

One parameter may keep or drop its parentheses, `(val) =>` or `val =>`; two or more need them. The file server's callback could be written `fs.readFile(filename, (err, data) => {...})`. The slide's snippets assign to undeclared names, which fails in strict mode, so the runner adds `const`. Arrows are not a drop-in swap everywhere: they have no own `this` and cannot be used with `new`.

```js run pin arrows.js
// predict: Write the two lines.
const hello = val => "Hello " + val;
const sum = (a, b) => a + b;
console.log(hello("Burnaby"));
console.log(sum(2, 3));
```

```output
Hello Burnaby
5
```

`hello("Burnaby")` returns `"Hello " + val` with no `return` keyword: an arrow with an expression body returns it.

## Serve a bookstore's files from a public folder

A bookstore keeps its pages in `./public` and wants `/catalog.html` to serve `./public/catalog.html`. Write the first item before reading the model:

```js pin bookstore.js
const http = require('http');
const url = require('url');
const fs = require('fs');
http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  fs.readFile("./public" + q.pathname, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end(q.pathname + " was not found");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}).listen(8080);
```

`"./public" + q.pathname` is the only change to the path, and `res.end(data)` sends the file and finishes in one call.

```quiz
[
  { "type": "free", "q": "Write a Node file server on port 8080 that serves files from `./public` and answers a missing file with 404 and its path.", "model": "`const http = require('http'); const url = require('url'); const fs = require('fs'); http.createServer(function (req, res) { const q = url.parse(req.url, true); fs.readFile('./public' + q.pathname, (err, data) => { if (err) { res.writeHead(404, {'Content-Type': 'text/html'}); return res.end(q.pathname + ' was not found'); } res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); }); }).listen(8080);`", "points": ["requires `http`, `url` and `fs`", "builds the file name from `q.pathname`", "`fs.readFile` with an `(err, data)` callback", "on `err`: `writeHead(404, ...)` and `return res.end(...)` with the path", "otherwise 200 and the data; `.listen(8080)`"], "rows": 8, "explain": "Slide 42's server with a different folder and message." },
  { "q": "In slide 42's server, the browser asks for `/docs/guide.txt`. Which file does `fs.readFile` try to open?", "options": ["./docs/guide.txt", "/docs/guide.txt at the root of the disk", "./guide.txt", "./file.txt"], "answer": 0, "explain": "`\".\" + q.pathname` puts a `.` in front of the path, so it is looked up relative to the folder the server runs from." },
  { "q": "Slide 42's server gets `/menu.txt`, which does not exist. What is the body of the response?", "options": ["/menu.txt 404 Not Found!", "404 Not Found!", "menu.txt 404 Not Found!", "An empty body with status 200"], "answer": 0, "explain": "`res.end(q.pathname + \" 404 Not Found!\")`: the pathname keeps its leading slash." },
  { "q": "Which status code should a file server send for a file that does not exist?", "options": ["404", "200", "500", "301"], "answer": 0, "explain": "Slide 42: *404: not found*, one of the 4xx client errors." }
]
```

```quiz
[
  { "q": "4xx are status message codes meaning server error.", "type": "tf", "answer": false, "explain": "Slide 42: *4xx are status message codes meaning client error*, for example a request for a file which did not exist." },
  { "q": "For a request to `/report.txt`, what is `\".\" + q.pathname`?", "options": ["./report.txt", ".report.txt", "/report.txt", "report.txt"], "answer": 0, "explain": "`q.pathname` is `/report.txt`; the `.` in front makes `./report.txt`, a file in the server's folder." },
  { "q": "Name the `fs` method that deletes a file.", "type": "text", "answer": ["unlink", "fs.unlink"], "explain": "`fs.unlink(file, callback)` deletes it. `fs` has no `remove`, `delete` or `removeFile`." },
  { "q": "Which call adds a line to `visits.log`, creating the file if it is missing?", "options": ["`fs.appendFile('visits.log', 'Ana\\n', (err) => { if (err) throw err; });`", "`fs.readFile('visits.log', 'Ana\\n', (err) => { if (err) throw err; });`", "`fs.unlink('visits.log', 'Ana\\n', (err) => { if (err) throw err; });`", "`fs.add('visits.log', 'Ana\\n', (err) => { if (err) throw err; });`"], "answer": 0, "explain": "`appendFile` adds to the end and creates a missing file. `readFile` reads, `unlink` deletes, and `fs.add` does not exist." },
  { "q": "Which line does NOT define a two-parameter arrow function?", "options": ["`total = a, b => a + b;`", "`total = (a, b) => a + b;`", "`greet = name => \"Hi \" + name;`", "`greet = (name) => \"Hi \" + name;`"], "answer": 0, "explain": "Slide 47: one parameter may drop the parentheses; two or more need them. `a, b => a + b` is read as `a`, then a one-parameter arrow." },
  { "q": "phpMyAdmin works on all operating systems because it is browser based.", "type": "tf", "answer": true, "explain": "Slide 45: *phpMyAdmin which is browser based ( thus working on all operating systems)*." },
  { "q": "In slide 42, why does `if (err)` use `return res.end(...)`?", "options": ["So the code below, which writes a 200 response, does not also run", "Because `res.end` must always be returned to Node", "To send the error to the debug console", "To close the file"], "answer": 0, "explain": "`return` leaves the callback; without it the server would go on to `writeHead(200, ...)` after already finishing a 404 response." },
  { "q": "What prints?", "code": "const area = (w, h) => w * h;\nconst half = n => n / 2;\nconsole.log(half(area(6, 3)));", "options": ["9", "18", "4.5", "NaN"], "answer": 0, "explain": "`area(6, 3)` is 18 and `half(18)` is 9; both arrows return their expression bodies." }
]
```
