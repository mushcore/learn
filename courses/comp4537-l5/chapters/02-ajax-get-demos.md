---
title: Demo 1 and Demo 2, a GET with and without a query string
minutes: 14
---

The four steps need a server on the other end. Slides 10 to 14 run two demos against a Node server on port 8888: a GET with nothing attached, then a GET that carries a name.

## Demo 1 sends a GET without any arguments (slides 11 and 12)

Slide 11: *"sending AJAX call without any arguments !"*. The client `ajax.html` has a button with `onclick="myFunc()"`; `myFunc` runs the four steps against `http://localhost:8888/`, and its handler only logs "hello". The callout on the URL: *"You can also type this url in the browser address bar. Since it's a Get request"*.

The server is slide 12's `app.js`:

```js pin app.js (Demo 1)
const http = require('http');
http.createServer(function (req, res) {
  console.log("The server recived a request ");
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.end("server's response!");
}).listen(8888);
```

Before reading on, say what the server's terminal shows per click and what the address bar shows for that URL. `createServer` runs its callback once per request, so each click logs one line; `writeHead` sets status 200 and two headers; `res.end()` sends the body; `listen(8888)` picks the port.

```text
Terminal, once per request:
The server recived a request 

Browser at http://localhost:8888/ :
server's response!
```

The spelling *recived* is the slide's. The second header, `Access-Control-Allow-Origin`, is what lets a page from another origin read this reply; [the CORS lesson](#/comp4537-l5/cors-and-the-same-origin-policy) explains why.

```diagram
{ "type": "sequence", "nodes": [ { "id": "p", "label": "Page (button)", "kind": "lane" }, { "id": "x", "label": "XMLHttpRequest", "kind": "lane" }, { "id": "a", "label": "app.js :8888", "kind": "lane" } ], "edges": [ { "from": "p", "to": "x", "label": "click: myFunc()" }, { "from": "p", "to": "x", "label": "open(GET, :8888/, true)" }, { "from": "x", "to": "a", "label": "send(): GET /" }, { "from": "a", "to": "x", "label": "writeHead(200, {...})" }, { "from": "a", "to": "x", "label": "end(server's response!)" }, { "from": "x", "to": "p", "label": "\"hello\" on each change" } ], "hi": ["3", "5"], "caption": "Demo 1, sending AJAX call without any arguments !" }
```

## How many times the Demo 1 handler says hello

Slide 12 assigns `onreadystatechange` after `send()`, and the handler has no `if`. Here is the same client pointed at the app's echo server.

```js run pin demo1.js
// predict: How many lines print, and what are they?
const xhttp = new XMLHttpRequest();
xhttp.open("GET", SERVER + "/api/echo", true);
xhttp.send();
xhttp.onreadystatechange = function () {
  console.log("hello");
};
```

Three `hello` lines print, one each for states 2, 3 and 4. State 1 happened inside `open`, before any handler existed. Assigning the handler after `send()` still works because the request is asynchronous: the events fire after `myFunc` has returned. Slide 8's order, step 2 before step 3, is the one to write.

## Demo 2 passes arguments in the query string (slides 13 and 14)

Slide 13: *"sending AJAX call with passing arguments !"*. The client builds the URL as `"http://localhost:8888/?name=" + str` with `const str = "John";//"John&age=23"; for multiple parameters`: one argument is `name=John`, several are joined with `&`. Its handler writes `responseText` into `#demo` at 4 and 200. The preview below is slide 14's page with one change: the echo server answers JSON, so the handler reads the name out of it.

```html run pin ajax.html (Demo 2)
<h1>The XMLHttpRequest Object</h1>
<div id="demo">
    <button type="button" onclick="myFunc()">Change Content</button>
</div>
<script>
    function myFunc() {
        const xhttp = new XMLHttpRequest();
        const str = "John";//"John&age=23"; for multiple parameters
        xhttp.open("GET", SERVER + "/api/echo?name=" + str, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML =
                    "Hello " + JSON.parse(this.responseText).query.name;
            }
        };
    }
</script>
```

The click replaces the button with "Hello John", the slide's second browser state. `this.responseText` is the raw reply; `JSON.parse` turns the echo's JSON into an object.

Slide 14's server reads the parameter:

```js pin app.js (Demo 2)
let http = require('http');
let url = require('url');
http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  console.log(q.query); //returns '?name=John'
  res.writeHead(200, {"Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*"});
  res.end('Hello '+q.query["name"]);
}).listen(8888);
```

What does the terminal print for `/?name=John`, and what does the page show? `let q = url.parse(req.url, true);` turns the query string into an object, `console.log(q.query);` prints that object, and `res.end('Hello '+q.query["name"]);` sends `Hello John`.

```text
Terminal (current Node):
[Object: null prototype] { name: 'John' }

Page after the click:
The XMLHttpRequest Object
Hello John
```

The comment `//returns '?name=John'` is loose: `q.query` is the object, not the string; slide 17's copy says *the object form of '?name=John'*.

```diagram
{ "type": "flow", "title": "Demo 2's query string", "nodes": [ { "id": "u", "label": "http://localhost:8888/?name=John" }, { "id": "parse", "label": "url.parse(req.url, true)" }, { "id": "q", "label": "q.query", "sub": "{ name: 'John' }" }, { "id": "resp", "label": "res.end('Hello ' + q.query[\"name\"])" }, { "id": "page", "label": "#demo", "sub": "Hello John" } ], "edges": [ { "from": "u", "to": "parse", "label": "GET" }, { "from": "parse", "to": "q", "label": "query object" }, { "from": "q", "to": "resp" }, { "from": "resp", "to": "page", "label": "responseText" } ], "hi": ["q"], "caption": "Demo 2, sending AJAX call with passing arguments !" }
```

## Two parameters arrive as two strings

The slide's comment suggests `"John&age=23"` for multiple parameters. The echo sends back the query it parsed.

```js run pin demo2-two-params.js
// predict: What does the console show for the query object?
const xhttp = new XMLHttpRequest();
const str = "John&age=23";
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log(JSON.parse(this.responseText).query);
  }
};
xhttp.open("GET", SERVER + "/api/echo?name=" + str, true);
xhttp.send();
```

With `const str = "John&age=23";` the URL carries two pairs, so `JSON.parse(this.responseText).query` has two keys, and `age` is the string `"23"`: everything in a query string is text until the server converts it.

## Build the requests for a bookstore search

A bookstore page searches by title and author against the echo endpoint, built the way Demo 2 builds its URL.

```quiz
[
  { "q": "Which URL asks for the title Dune by the author Herbert in one GET?", "options": ["`SERVER + \"/api/echo?title=Dune&author=Herbert\"`", "`SERVER + \"/api/echo?title=Dune?author=Herbert\"`", "`SERVER + \"/api/echo&title=Dune&author=Herbert\"`", "`SERVER + \"/api/echo?title=Dune,author=Herbert\"`"], "answer": 0, "explain": "One `?` starts the query string and `&` separates the pairs, as in slide 14's `\"John&age=23\"`. A second `?`, a leading `&` or a comma would not give two parameters." },
  { "q": "The bookstore page sends `?title=Dune&pages=412` to the echo endpoint. What type is the echoed value of `pages`?", "options": ["a string, \"412\"", "a number, 412", "an array, [\"412\"]", "undefined, because only one parameter is read"], "answer": 0, "explain": "A query string is text, so each value arrives as a string, as `age` did in the two-parameter run (`age: \"23\"`). The server would have to convert it." },
  { "q": "A bookstore handler is written as `if (this.readyState == 3 && this.status == 200) show(this.responseText);`. What goes wrong?", "options": ["It may show a partial reply, or show it more than once", "Nothing; 3 means the response is complete", "It never runs, because status is 0 during state 3", "It runs before `open` is called"], "answer": 0, "explain": "3 is LOADING: the response is still being received and `responseText` grows each time (slide 8). Only 4 (DONE) means the operation is complete." },
  { "q": "In slide 14's server, which expression reads the name the page sent?", "type": "text", "answer": ["q.query[\"name\"]", "q.query['name']", "q.query.name"], "explain": "`url.parse(req.url, true)` turns the query string into the object `q.query`, and the reply is `'Hello ' + q.query[\"name\"]`." },
  { "q": "Demo 1's URL `http://localhost:8888/` can also be typed into the address bar. Why?", "options": ["It is a GET request, which is what the address bar sends", "The server sends Access-Control-Allow-Origin", "The handler has no if statement", "Port 8888 is reserved for browsers"], "answer": 0, "explain": "Slide 12's callout: *You can also type this url in the browser address bar. Since it's a Get request*." }
]
```

```challenge
{ "lang": "js", "prompt": "Send a GET to the echo endpoint with the query string <code>title=Dune</code> and, when the request is done and OK, log <code>\"Found \"</code> followed by the echoed title.", "starter": "const xhttp = new XMLHttpRequest();\n// your code\n", "expected": "Found Dune", "hints": ["The URL is <code>SERVER + \"/api/echo?title=Dune\"</code>.", "The echo's JSON has a <code>query</code> object."], "solution": "const xhttp = new XMLHttpRequest();\nxhttp.onreadystatechange = function () {\n  if (this.readyState == 4 && this.status == 200) {\n    console.log(\"Found \" + JSON.parse(this.responseText).query.title);\n  }\n};\nxhttp.open(\"GET\", SERVER + \"/api/echo?title=Dune\", true);\nxhttp.send();\n" }
```

```quiz
[
  { "q": "How does an AJAX GET carry its arguments to the server?", "options": ["Appended to the URL as a query string after `?`", "In the body passed to `send()`", "In the response headers", "In the status code"], "answer": 0, "explain": "Slide 14: `open(\"GET\", \"http://localhost:8888/?name=\" + str, true)`; the arguments are part of the URL, and `send()` gets nothing." },
  { "q": "Slide 12's handler, assigned after `send()`, logs \"hello\" exactly once.", "type": "tf", "answer": false, "explain": "It has no `if`, so it logs on every readyState change after it was assigned: 2, 3 and 4, three lines in the live run. State 1 had already happened inside `open`." },
  { "q": "What does `url.parse(req.url, true)` give the Demo 2 server in `q.query` for `/?name=John`?", "options": ["The object `{ name: 'John' }`", "The string `'?name=John'`", "The string `'John'`", "The whole URL as a string"], "answer": 0, "explain": "With `true`, the query string is parsed into an object; the slide comment's `'?name=John'` is loose, and slide 17 calls it *the object form of '?name=John'*." },
  { "q": "Demo 1's server logs a line in its terminal. When?", "options": ["Once for every request it receives", "Once, when listen(8888) starts", "Only when the client's readyState is 4", "Never; console.log in a server prints in the browser"], "answer": 0, "explain": "The `createServer` callback runs per request, and its first line is `console.log(\"The server recived a request \")`; that output goes to the server's terminal." },
  { "q": "Two arguments in a GET query string are joined with which character?", "options": ["&", "?", ",", "/"], "answer": 0, "explain": "Slide 14's comment: `\"John&age=23\"` for multiple parameters. `?` starts the query string; it does not separate pairs." },
  { "q": "Which port do both demo servers listen on?", "options": ["8888", "3000", "80", "3306"], "answer": 0, "explain": "Both slide 12 and slide 14 end with `.listen(8888)`. 3000 is Demo 4's POST server, 80 the default HTTP port, 3306 MySQL." },
  { "type": "free", "q": "Write an XHR GET that sends `name=Ana` to `SERVER + \"/api/echo\"` and writes the response text into the element with id `out`.", "model": "`const x = new XMLHttpRequest();` `x.onreadystatechange = function () { if (this.readyState == 4 && this.status == 200) { document.getElementById(\"out\").innerHTML = this.responseText; } };` `x.open(\"GET\", SERVER + \"/api/echo?name=Ana\", true);` `x.send();`", "points": ["new XMLHttpRequest()", "handler checks readyState == 4 && status == 200", "open(\"GET\", url with ?name=Ana, true)", "send() with no body", "responseText written into #out"], "rows": 6, "explain": "Slide 14's client with new values: the argument goes in the URL, the handler waits for DONE and OK." }
]
```
