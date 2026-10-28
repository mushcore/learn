---
title: "Mock quiz: Lecture 4"
minutes: 20
---

Twenty items in the shape of the Learning Hub's Node.js quiz: short stems, code options, true/false, one select-all, and two written answers. Take it cold first, then again after the lessons.

```quiz
[
  { "q": "A server is a computer (or computers) running 24/7 and accessible only on the local network.", "type": "tf", "answer": false, "explain": "Slide 7: *A server is a computer ( or computers) running 24/7 and accessible via the internet*." },
  { "q": "Which of these is NOT something slide 9 says a server-side script can do?", "options": ["Read files on the visitor's own laptop without the visitor choosing them", "Create, open, read, write, delete, and close files on the server", "Collect form data", "Add, delete, modify data in your database"], "answer": 0, "explain": "Slide 9's list is about the server: files on the server, form data, the database, dynamic page content. A server cannot reach into the client's disk." },
  { "q": "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the Chrome V8 engine and executes JavaScript code outside a web browser.", "type": "tf", "answer": true, "explain": "Slide 11, word for word." },
  { "type": "free", "q": "List the steps PHP (or ASP) and Node.js each take to handle a file request, and state the difference.", "model": "PHP or ASP: 1 sends the task to the computer's file system; 2 waits while the file system opens and reads the file; 3 returns the content to the client; 4 ready to handle the next request. Node.js: 1 sends the task to the computer's file system; 2 ready to handle the next request; 3 when the file system has opened and read the file, the server returns the content to the client. Node.js eliminates the waiting and simply continues with the next request.", "points": ["PHP's four steps in order", "Node's three steps in order", "PHP waits while the file is read", "Node is ready for the next request at step 2", "Node eliminates the waiting (non-blocking)"], "rows": 7, "explain": "Slide 12." },
  { "q": "Match each restaurant to its architecture.", "type": "match", "pairs": [["one waiter who never waits at the kitchen", "single threaded non-blocking (asynchronous)"], ["one waiter who waits for every meal before the next order", "single threaded blocking (synchronous)"], ["a separate waiter for every table", "multi-threaded"]], "explain": "Slide 18: Example 1, Example 2, Example 3 in that order." },
  { "q": "Which restaurant example matches JavaScript (Node.js) on slide 19?", "options": ["Example 1, one waiter serves everyone", "Example 2, the waiter waits at the kitchen", "Example 3, one waiter per table", "None of the three"], "answer": 0, "explain": "Slide 19: *JavaScript(nodejs) is Single threaded Asynchronous(non blocking) just like the restaurant in Example 1*." },
  { "q": "A synchronous system receives 250 concurrent requests. How many threads must it create?", "type": "numeric", "answer": 250, "tolerance": 0, "explain": "Slide 23: one thread per request, so 100 requests need 100 threads (100 waiters) and 250 need 250." },
  { "q": "Which of these modules does NOT ship with Node.js?", "options": ["mysql", "os", "url", "fs"], "answer": 0, "explain": "`os`, `url` and `fs` are built in. `mysql` is installed with `npm install mysql` (lecture 5)." },
  { "q": "A project has `app.js` at the top and `helpers/format.js` below it. Which lines import the module into `app.js`? Select all.", "options": ["`require('./helpers/format')`", "`require('./helpers/format.js')`", "`require('format')`", "`require('./format.js')`"], "answer": [0, 1], "explain": "Slide 31: `./` means the same folder as the main file and the `.js` is optional. `'format'` asks for a built-in or installed module; `'./format.js'` looks beside `app.js`, not in `helpers`." },
  { "q": "`require('./modules/math')` fails because the `.js` extension is missing.", "type": "tf", "answer": false, "explain": "Slide 31: *Notice we don't need to include the .js when we import the module (its optional)*." },
  { "q": "Which server sends \"Library open\" to a browser at http://localhost:7000?", "options": ["`http.createServer(function (req, res) { res.writeHead(200, {'Content-Type': 'text/html'}); res.write('Library open'); res.end(); }).listen(7000);`", "`http.createServer(function (req, res) { res.writeHead(7000, {'Content-Type': 'text/html'}); res.write('Library open'); res.end(); }).listen();`", "`http.createServer(function (req, res) { req.writeHead(200, {'Content-Type': 'text/html'}); req.write('Library open'); req.end(); }).listen(7000);`", "`http.createServer(function (req, res) { res.writeHead(200, {'Content-Type': 'text/html'}); res.write('Library open'); res.end(); }).listen(200);`"], "answer": 0, "explain": "Status 200 in `writeHead`, port 7000 in `listen`, and every call on `res`, the response." },
  { "q": "`clock.js` contains `exports.getTime = function () { return Date(); };` and the server calls `res.write(clock.now());`. What happens on the first request?", "options": ["`TypeError: clock.now is not a function`", "The browser shows the date", "The browser shows undefined", "Cannot find module './clock'"], "answer": 0, "explain": "The module exports only `getTime`, so `clock.now` is `undefined` and calling it throws: the slide 35 bug with new names." },
  { "q": "A server sends `res.writeHead(200, {'Content-Type': 'text/html'}); res.end('Total: <i>42</i>');`. What does the browser show?", "options": ["Total: 42, with 42 in italics", "Total: <i>42</i> with the tags visible", "A download dialog", "42 only"], "answer": 0, "explain": "`text/html` makes the browser render the body as HTML, as slide 33's bold World!." },
  { "q": "A callback runs `res.write('A'); res.write('B'); res.end('C');`. What does the browser receive?", "options": ["ABC", "C", "A", "AB"], "answer": 0, "explain": "Each `write` adds a piece of the body; `end` adds its last piece and finishes the response." },
  { "q": "Given `const q = url.parse('http://localhost:4000/notes/today.html?user=7', true);`, which line prints `/notes/today.html`?", "options": ["`console.log(q.pathname)`", "`console.log(q.path)`", "`console.log(q.search)`", "`console.log(q.host)`"], "answer": 0, "explain": "`pathname` stops before the `?`. `path` would give `/notes/today.html?user=7`, `search` `?user=7`, `host` `localhost:4000`." },
  { "q": "For the same address, what does `q.search` return?", "options": ["'?user=7'", "'user=7'", "{ user: '7' }", "'/notes/today.html?user=7'"], "answer": 0, "explain": "Slide 38: `search` keeps the `?`. The object is `q.query`." },
  { "q": "Example 5 (slide 39) needed `Access-Control-Allow-Origin` because the name arrived in a query string.", "type": "tf", "answer": false, "explain": "Slide 39: *Note! I did not need \"Access-Control-Allow-Origin\": \"\\*\"*. The URL was typed in the address bar, not requested by a script from another origin, so CORS never applies." },
  { "q": "Which code deletes `draft.txt`, assuming it exists?", "options": ["`fs.unlink('draft.txt', (err) => { if (err) throw err; });`", "`fs.erase('draft.txt', (err) => { if (err) throw err; });`", "`fs.delete('draft.txt', (err) => { if (err) throw err; });`", "`fs.destroy('draft.txt', (err) => { if (err) throw err; });`"], "answer": 0, "explain": "`fs.unlink` deletes a file; `erase`, `delete` and `destroy` do not exist on `fs`." },
  { "q": "Slide 42's file server gets a request for `/prices.txt`, which is missing. What is the body?", "options": ["/prices.txt 404 Not Found!", "prices.txt 404 Not Found!", "404 Not Found!", "./prices.txt 404 Not Found!"], "answer": 0, "explain": "`res.end(q.pathname + \" 404 Not Found!\")`, and the pathname is `/prices.txt`, with its slash." }
]
```

## Write a weather server

The last item is the coding question. Write your server first; the pin is the model answer.

```js pin weather-city.js
const http = require('http');
const url = require('url');

http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Weather for ' + q.query.city);
}).listen(8888);
```

`url.parse(req.url, true)` makes `q.query` an object, `q.query.city` is the value after `city=`, and `listen(8888)` sets the port. For `http://localhost:8888/?city=Richmond` the browser shows `Weather for Richmond`.

```quiz
[
  { "type": "free", "q": "Write a Node server on port 8888 that reads `?city=` from the URL and returns `Weather for <city>` as HTML.", "model": "`const http = require('http'); const url = require('url'); http.createServer(function (req, res) { const q = url.parse(req.url, true); res.writeHead(200, {'Content-Type': 'text/html'}); res.end('Weather for ' + q.query.city); }).listen(8888);`", "points": ["`require('http')` and `require('url')`", "`url.parse(req.url, true)` inside the callback", "`res.writeHead(200, {'Content-Type': 'text/html'})`", "`res.end` (or `write` then `end`) with the city from `q.query.city`", "`.listen(8888)`"], "rows": 8, "explain": "Slides 34 and 39 combined." }
]
```
