---
title: url.parse and the query string
minutes: 15
---

A GET request carries its arguments after the `?` in the URL. Node's built-in `url` module splits that address into parts, so a server can read `?name=John` and answer with the name.

<!-- facts: slide 37 Example 5 url built-in module extracts query strings; slide 38 url.parse(adr, true) host localhost:8888, pathname /default.htm, search ?name=John&age=23, query object { name: John, age: 23 }, qdata.name John; slide 39 server with parameters, q.query, Hello + name, http://localhost:8888/?name=John, {name: 'John'}, did not need Access-Control-Allow-Origin -->

## url.parse splits an address into host, pathname, search and query (slides 37 and 38)

*Example 5, using 'url' built-in module to extract the query strings in the url.*

```js pin parse.js
let url = require('url');
let adr = 'http://localhost:8888/default.htm?name=John&age=23';
let q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8888'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?name=John&age=23'

let qdata = q.query; //returns an object: { name: John, age: 23 }
console.log(qdata.name); //returns 'John'
```

What do the four `console.log` lines print? `url.parse(adr, true)` returns an object with one property per part of the address; the second argument `true` makes `q.query` an object instead of a string. From the slide's comments:

```text
localhost:8888
/default.htm
?name=John&age=23
John
```

The query string has its own grammar: `?` starts it, `&` separates the pairs, and `=` joins each name to its value, so `name=John&age=23` holds two parameters. With `true`, `url.parse` does that splitting for you; without it, `q.query` is the raw string `name=John&age=23`.

Three details carry the marks. `q.host` keeps the port. `q.pathname` stops before the `?`. `q.search` starts with the `?`. And `qdata.name` reads one value out of the object.

```diagram
{ "type": "flow", "title": "http://localhost:8888/default.htm?name=John&age=23", "nodes": [ { "id": "s", "label": "http://" }, { "id": "h", "label": "localhost:8888", "sub": "host" }, { "id": "p", "label": "/default.htm", "sub": "pathname" }, { "id": "q", "label": "?name=John&age=23", "sub": "search" }, { "id": "o", "label": "{ name, age }", "sub": "query (with true)" } ], "edges": [ { "from": "s", "to": "h" }, { "from": "h", "to": "p" }, { "from": "p", "to": "q" }, { "from": "q", "to": "o", "label": "parsed" } ], "hi": ["p"], "caption": "The slide's steps drawn: one address cut into the parts url.parse names." }
```

```diagram
{ "type": "grid", "title": "url.parse(adr, true)", "nodes": [ { "id": "h0", "label": "field", "row": 0, "col": 0 }, { "id": "h1", "label": "value", "row": 0, "col": 1 }, { "id": "a0", "label": "q.host", "row": 1, "col": 0 }, { "id": "a1", "label": "'localhost:8888'", "row": 1, "col": 1 }, { "id": "b0", "label": "q.pathname", "row": 2, "col": 0 }, { "id": "b1", "label": "'/default.htm'", "row": 2, "col": 1 }, { "id": "c0", "label": "q.search", "row": 3, "col": 0 }, { "id": "c1", "label": "'?name=John&age=23'", "row": 3, "col": 1 }, { "id": "d0", "label": "q.query", "row": 4, "col": 0 }, { "id": "d1", "label": "{ name: 'John', age: '23' }", "row": 4, "col": 1 }, { "id": "e0", "label": "q.path", "sub": "not on the slide", "row": 5, "col": 0 }, { "id": "e1", "label": "'/default.htm?name=John&age=23'", "row": 5, "col": 1 } ], "hi": ["b0", "b1"], "caption": "Using url built-in module to pars parameters in a string" }
```

Two corrections to the slide, checked in Node. The comment *{ name: John, age: 23 }* drops the quotes: every query value is a string, so `qdata.age` is `'23'`, not the number 23. And `q.path`, not on the slide, keeps the query (`/default.htm?name=John&age=23`) where `q.pathname` does not. Current Node also prints a deprecation warning for `url.parse`; the slides' form is what the course uses.

### The same split with the browser's URL object

This runner is a browser stand-in, not on the slide: `new URL(...)` is the modern form, and it runs here.

```js run pin modernURL.js
// predict: Write the five lines.
const u = new URL("http://localhost:8888/default.htm?name=John&age=23");
console.log(u.host);
console.log(u.pathname);
console.log(u.search);
console.log(u.searchParams.get("age"));
console.log(typeof u.searchParams.get("age"));
```

```output
localhost:8888
/default.htm
?name=John&age=23
23
string
```

`u.host`, `u.pathname` and `u.search` match the slide's three fields; `u.searchParams.get("age")` reads one value, and `typeof` confirms it is a string.

## Example 5 greets the name from the query string (slide 39)

```js pin server.js (query)

let http = require('http');
let url = require('url');
http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  console.log(q.query); //returns the object form of '?name=John'
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Hello '+q.query["name"]);
}).listen(8888);

// at your browser address bar, try
//http://localhost:8888/?name=John

```

What appears in the debug console and the browser for `http://localhost:8888/?name=John`? `req.url` holds only the path and query, `/?name=John`. `url.parse(req.url, true)` turns it into an object, and `q.query["name"]` is `'John'`. The slide's debug console:

```text
> {name: 'John'}
```

The browser shows `Hello John` (worked out, not on the slide). Lab 4 builds the same kind of server: a name from the address bar, a greeting back.

*Note! I did not need "Access-Control-Allow-Origin": "\*"*, and the slide asks *Why?* without answering. Worked out: the URL was typed into the address bar, a top-level request, not an AJAX call from a page on another origin, so the browser's CORS check never applies.

```diagram
{ "type": "sequence", "title": "Example 5", "nodes": [ { "id": "b", "label": "Browser address bar", "kind": "lane" }, { "id": "s", "label": "Node server", "kind": "lane" }, { "id": "c", "label": "Debug console", "kind": "lane" } ], "edges": [ { "from": "b", "to": "s", "label": "GET /?name=John" }, { "from": "s", "to": "s", "label": "url.parse(req.url, true)" }, { "from": "s", "to": "c", "label": "{name: 'John'}" }, { "from": "s", "to": "b", "label": "Hello John" } ], "hi": ["2"], "caption": "Example 5: http server with parameters" }
```

### What the server does with a query

Change the path to another name and step through: `req.url` has no host, so `host` is null on the server.

```widget
node-server-play
{ "mode": "request", "preset": "query", "predict": true }
```

## Read a weather service's query string

A weather service answers `http://localhost:8888/forecast?city=Burnaby` with `Forecast for Burnaby: rain`. The pin is the model answer to the last item; write yours first.

```js pin weather.js
const http = require('http');
const url = require('url');
http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Forecast for ' + q.query.city + ': rain');
}).listen(8888);
```

`q.query.city` reads the value after `city=`, and `res.end` sends the sentence.

```quiz
[
  { "q": "For `url.parse('http://localhost:3000/books.html?id=42&lang=en', true)`, match each field to its value.", "type": "match", "pairs": [["host", "'localhost:3000'"], ["pathname", "'/books.html'"], ["search", "'?id=42&lang=en'"], ["query", "{ id: '42', lang: 'en' }"]], "explain": "`host` keeps the port, `pathname` stops before the `?`, `search` keeps the `?`, and `query` is an object of strings because of `true`." },
  { "q": "Fill in the two fields for the bookstore URL above.", "type": "fill", "code": "console.log(q.___); // '/books.html'\nconsole.log(q.___); // '?id=42&lang=en'", "answer": ["pathname", "search"], "explain": "Slide 38: `pathname` is the path without the query; `search` is the query with its `?`." },
  { "q": "A request arrives as `/forecast?city=Victoria&days=3`. With `q = url.parse(req.url, true)`, what is `q.query.days + 1`?", "options": ["\"31\"", "4", "NaN", "undefined"], "answer": 0, "explain": "Query values are strings: `q.query.days` is `'3'`, and `'3' + 1` joins them into `'31'`." },
  { "type": "free", "q": "Write a Node server on port 8888 that answers `/forecast?city=Burnaby` with `Forecast for Burnaby: rain` for any city.", "model": "`const http = require('http'); const url = require('url'); http.createServer(function (req, res) { const q = url.parse(req.url, true); res.writeHead(200, {'Content-Type': 'text/html'}); res.end('Forecast for ' + q.query.city + ': rain'); }).listen(8888);`", "points": ["requires `http` and `url`", "`url.parse(req.url, true)` inside the callback", "reads `q.query.city` (or `q.query[\"city\"]`)", "`writeHead(200, ...)` then `end` with the sentence", "`.listen(8888)`"], "rows": 7, "explain": "Slide 39's server with a new parameter." }
]
```

```quiz
[
  { "q": "`q.search` does not include the `?`.", "type": "tf", "answer": false, "explain": "Slide 38: `q.search` returns `'?name=John&age=23'`, with the `?`." },
  { "q": "For `http://localhost:8888/default.htm?name=John&age=23`, what does `q.host` return?", "options": ["'localhost:8888'", "'localhost'", "'http://localhost:8888'", "'/default.htm'"], "answer": 0, "explain": "Slide 38: `q.host` returns `'localhost:8888'`, the host with its port." },
  { "q": "Which second argument to `url.parse` makes `q.query` an object?", "options": ["true", "false", "'object'", "8888"], "answer": 0, "explain": "`url.parse(adr, true)`. Without `true`, `q.query` is the string `name=John&age=23`." },
  { "q": "Given `url.parse('http://localhost:5000/admin/users.html?page=2', true)`, which line prints `/admin/users.html`?", "options": ["`console.log(q.pathname)`", "`console.log(q.path)`", "`console.log(q.search)`", "`console.log(q.host)`"], "answer": 0, "explain": "`pathname` stops before the `?`. `path` would print `/admin/users.html?page=2`, `search` `?page=2`, `host` `localhost:5000`." },
  { "q": "Why did Example 5 not need `Access-Control-Allow-Origin`?", "options": ["The URL was typed into the address bar, not requested by a script from a page on another origin", "Because `url.parse` adds the header automatically", "Because the status code was 200", "Because the body was plain text"], "answer": 0, "explain": "CORS is the browser's check on cross-origin script requests. A top-level address-bar request is not one." },
  { "q": "With slide 38's address, what is `typeof q.query.age`?", "options": ["\"string\"", "\"number\"", "\"object\"", "\"undefined\""], "answer": 0, "explain": "Query values are strings: Node gives `{ name: 'John', age: '23' }`. The slide's comment *{ name: John, age: 23 }* drops the quotes." },
  { "q": "In Example 5's server, `req.url` for `http://localhost:8888/?name=Ana` is `'/?name=Ana'`, without the host.", "type": "tf", "answer": true, "explain": "The browser sends only the path and query in the request line; the host travels in the `Host` header. So `url.parse(req.url, true).query.name` is `'Ana'`." },
  { "q": "Slide 38's comment says `q.query` returns ___.", "options": ["an object", "a string", "an array", "a number"], "answer": 0, "explain": "*returns an object: { name: John, age: 23 }*, because of the `true` argument." }
]
```
