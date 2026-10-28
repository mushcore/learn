---
title: "The http module: createServer, writeHead, end, listen"
minutes: 18
---

A web server is a program that waits on a port, and for every request writes back a status, headers and a body. Node's built-in `http` module does this in about five lines, and the midterm's coding question asks for exactly those lines.

<!-- facts: slide 33 build-in module http, server receives a request from the client, four callouts, Server is running and listening, Hello World! bold; slide 34 recived a request, writeHead 200 text/html Access-Control-Allow-Origin *, end, listen 8888, four exercise bullets; slide 35 current date in a module, compare require('http') require('./myModule'), res.write Now:; slide 36 in-class replace text/html with text, Hi -->

## Example 4 answers every request with Hello World! (slides 33 and 34)

*We are using the nodejs build-in module 'http'*. *The server receives a request from the client ( the browser)*. Slide 33's listing is cut off at the screenshot's edge; slide 34 has the complete one.

```js pin server.js
const http = require('http');

http.createServer(function (req, res) {
  console.log("The server recived a request ");
  res.writeHead(200, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" });
  res.end('Hello <b>World!</b>');
}).listen(8888);
```

What shows in the terminal and in the browser at `http://localhost:8888/`? `require('http')` loads the built-in module. `http.createServer` takes one function, the callback, and Node calls it once for every request with two objects: `req`, the request that arrived, and `res`, the response you write. Then:

- `res.writeHead(200, {...})` sets the status code 200 (OK) and the headers. `"Content-Type": "text/html"` tells the browser the body is HTML.
- `res.end('Hello <b>World!</b>')` sends the body and finishes the response.
- `.listen(8888)` starts waiting for requests on port 8888.

Each visit logs one line (the slide's spelling), and the browser renders the HTML, so World! is bold:

```text
Terminal:  The server recived a request
Browser:   Hello World!
```

Not on the slide: `res.write(...)` may be called several times before `end`, each call adding a piece of the body; `end` may carry the last piece, as here. The first argument of `writeHead` is the status, never the port; the port belongs to `listen`.

```diagram
{ "type": "sequence", "title": "One request to Example 4", "nodes": [ { "id": "b", "label": "Browser", "sub": "localhost:8888", "kind": "lane" }, { "id": "n", "label": "Node server", "sub": "createServer callback", "kind": "lane" } ], "edges": [ { "from": "b", "to": "n", "label": "GET /" }, { "from": "n", "to": "n", "label": "console.log" }, { "from": "n", "to": "b", "label": "writeHead(200, text/html)" }, { "from": "n", "to": "b", "label": "end('Hello <b>World!</b>')" } ], "hi": ["4"], "caption": "The server receives a request from the client ( the browser)" }
```

### What reaches the client at each step

Step through one request. The status line and headers leave with the first body bytes; nothing is complete until `end`.

```widget
node-server-play
{ "mode": "request", "preset": "hello", "predict": true }
```

Slide 33 runs it under the debugger with four callouts:

```diagram
{ "type": "flow", "title": "Example 4 under the debugger", "nodes": [ { "id": "a", "label": "1 run the server from Run menu" }, { "id": "b", "label": "2 enter the url" }, { "id": "c", "label": "3 the breakpoint hits", "sub": "press > to continue" }, { "id": "d", "label": "4 see the server's response" } ], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" } ], "caption": "The slide's steps drawn: the four numbered callouts of slide 33." }
```

Slide 34's exercises: type `http://localhost:8888/` and observe; replace `'text/html'` with just `'text'`; return a random number between 0 and 10; and *what does "Access-Control-Allow-Origin" do? do we need it now?* Answered in lecture 5: it is a response header telling the browser which other origins' scripts may read this response, `*` meaning any. It matters only for AJAX calls from a page on another origin, so a URL typed into the address bar does not need it.

## The in-class activity changes the Content-Type (slide 36)

```js pin server.js (in-class)

const http = require('http');

http.createServer(function (req, res) {
  console.log("Hi");
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello <b>World!</b>');
}).listen(8888);

console.log('Server is running and listening ...');

```

`console.log('Server is running and listening ...')` runs once, when the file starts; `console.log("Hi")` sits inside the callback, so it runs once per request. Worked out from the code, after two visits:

```text
Server is running and listening ...
Hi
Hi
```

The activity: *Replace the 'text/ html' with just 'text' and observe the response that the client receives*. Worked out, not on the slide: `text` is not a valid type (a type needs `type/subtype`), so the browser no longer renders HTML. It shows `Hello <b>World!</b>` with the tags visible, or offers the response as a download.

## Example 4 loads a function from a module (slide 35)

```js pin server.js (date)
let http = require('http’);


let dt = require('./myModule');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("Now: " + dt.myDateTime());
  res.end();
}).listen(8888);
```

The slide's "compare" arrow sets `require('http’)` against `require('./myModule')`: a built-in module by name, your own by path. The closing `’` is a typographic quote as printed; typed that way it is a syntax error, and it must be a straight `'`. The body is built with `res.write("Now: " + dt.myDateTime())` and closed with `res.end()`.

```js pin myModule.js
exports.area =
function () {
    return Date();
};
```

The two files do not match. The module puts `exports.area` on the object, but the server calls `dt.myDateTime()`, so the first request throws `TypeError: dt.myDateTime is not a function` and the server stops. The fix names the export after the call:

```js pin myModule.js (fixed)
exports.myDateTime = function () {
    return Date();
};
```

With `exports.myDateTime`, the browser shows `Now: ` followed by the server's date string from `Date()` (worked out, not on the slide).

```diagram
{ "type": "flow", "title": "compare", "nodes": [ { "id": "http", "label": "http", "sub": "built-in" }, { "id": "main", "label": "server.js" }, { "id": "my", "label": "myModule.js", "sub": "your own file" } ], "edges": [ { "from": "main", "to": "http", "label": "require('http')" }, { "from": "main", "to": "my", "label": "require('./myModule')" } ], "hi": ["my"], "caption": "A built-in module is required by name, your own module by path." }
```

## Write a clinic's opening-hours server

A clinic wants `http://localhost:3000` to answer "Clinic open until 6 pm" in blue. Write the first item, then compare with the pin.

```js pin clinic.js
const http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<p style="color:blue">Clinic open until 6 pm</p>');
}).listen(3000);
```

The blue comes from the inline `style="color:blue"` in the body, which renders only because `'Content-Type': 'text/html'` is set; `listen(3000)` gives the port.

```quiz
[
  { "type": "free", "q": "Write a Node server on port 3000 that answers every request with \"Clinic open until 6 pm\" in blue.", "model": "`const http = require('http');` `http.createServer(function (req, res) { res.writeHead(200, {'Content-Type': 'text/html'}); res.end('<p style=\"color:blue\">Clinic open until 6 pm</p>'); }).listen(3000);`", "points": ["`require('http')`", "`http.createServer` with a `(req, res)` callback", "`res.writeHead(200, {'Content-Type': 'text/html'})`", "the blue comes from inline styling in the body sent by `res.end` (or `write` then `end`)", "`.listen(3000)`"], "rows": 7, "explain": "Slide 34's server with a new body and port." },
  { "q": "Put a working server's lines in order.", "type": "reorder", "lang": "js", "lines": ["const http = require('http');", "http.createServer(function (req, res) {", "  res.writeHead(200, {'Content-Type': 'text/html'});", "  res.write('Library hours: 9 to 9');", "  res.end();", "}).listen(4000);"], "explain": "Load the module, create the server with its callback, write the head before the body, finish with `end`, and listen on the port." },
  { "q": "A server's callback reads `req.writeHead(200, {'Content-Type': 'text/html'}); req.end('Open');`. What goes wrong?", "options": ["`req` is the incoming request; the head and body must be written on `res`, so the call throws a TypeError", "Nothing; `req` and `res` are the same object", "The browser shows Open in plain text", "The port is missing from `writeHead`"], "answer": 0, "explain": "`writeHead`, `write` and `end` belong to the response object `res`. The request object has no `writeHead`, so `req.writeHead(...)` throws `TypeError: req.writeHead is not a function`." },
  { "q": "Which call sets status 404 and an HTML body type?", "options": ["`res.writeHead(404, {'Content-Type': 'text/html'})`", "`res.writeHead({'Content-Type': 'text/html'}, 404)`", "`res.listen(404)`", "`res.end(404, 'text/html')`"], "answer": 0, "explain": "`writeHead(status, headers)`: the status code first, then the header object." }
]
```

```quiz
[
  {"q": "Nothing answers at http://localhost:5000. Which change fixes this server?", "code": "const http = require('http');\nhttp.createServer(function (req, res) {\n  res.writeHead(200, {'Content-Type': 'text/html'});\n  res.end('Pharmacy open');\n}).listen(200);", "options": ["Change `.listen(200)` to `.listen(5000)`", "Change `writeHead(200, ...)` to `writeHead(5000, ...)`", "Call `res.write('Pharmacy open')` before `res.end()`", "Change `'text/html'` to `'text/plain'`"], "answer": 0, "explain": "The 200 in `writeHead` is the status code, and the port is the argument of `listen`. This server listens on port 200, so a browser at port 5000 finds nothing."},
  { "q": "`res.writeHead(8888, {...})` makes the server listen on port 8888.", "type": "tf", "answer": false, "explain": "The first argument of `writeHead` is the status code. The port is the argument of `listen(8888)`." },
  { "q": "Name the response method that adds a piece of the body without finishing the response; it may be called several times.", "type": "text", "answer": ["write", "res.write", "res.write()", "write()"], "explain": "`res.write(\"Now: \" + dt.myDateTime())` adds a piece; `res.end()` finishes the response and may carry the last piece itself." },
  { "q": "Fill in the method that sends the status code and the headers.", "type": "fill", "code": "res.___(200, {'Content-Type': 'text/html'});", "answer": ["writeHead"], "explain": "`writeHead(status, headers)`, called before the body." },
  { "q": "Slide 34's server answers `'Hello <b>World!</b>'` with `Content-Type: text/html`. What does the browser show?", "options": ["Hello World! with World! in bold", "Hello <b>World!</b> with the tags visible", "A download dialog", "Nothing until the page is refreshed"], "answer": 0, "explain": "`text/html` tells the browser to render the body as HTML, so `<b>` makes World! bold. With an invalid type such as `text` the tags show or the browser downloads it." },
  { "q": "With slide 35's two files as printed (the module exports `area`), what happens on the first request?", "options": ["`TypeError: dt.myDateTime is not a function`", "The browser shows Now: and the date", "The browser shows Now: undefined", "Node refuses to start: Cannot find module './myModule'"], "answer": 0, "explain": "`dt` has only `area`, so `dt.myDateTime` is `undefined` and calling it throws a TypeError. The fix is `exports.myDateTime = function () { return Date(); };`." },
  { "q": "In slide 36's server, `console.log(\"Hi\")` prints once, when the server starts.", "type": "tf", "answer": false, "explain": "It is inside the `createServer` callback, so it prints once per request. `Server is running and listening ...` is the line that prints once at start." },
  { "type": "free", "q": "What does the header `Access-Control-Allow-Origin` do, and why was it not needed when slide 34's URL was typed into the address bar?", "model": "It is a response header in which the server names the origins whose scripts may read the response; `*` allows any origin. The browser checks it only for cross-origin AJAX requests made by a page on another origin. Typing the URL into the address bar is a top-level request, not a cross-origin script call, so the header is not needed.", "points": ["a response header set by the server", "names which other origins may read the response", "`*` allows any origin", "checked by the browser for cross-origin AJAX calls", "not needed for an address-bar request"], "rows": 5, "explain": "Slide 34 asks; lecture 5 answers. Slide 39 notes the same: *I did not need \"Access-Control-Allow-Origin\": \"*\"*." }
]
```
