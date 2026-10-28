---
title: POST with AJAX, the body, the Content-type header and data in chunks
minutes: 16
---

A GET carries its arguments in the URL. A POST carries them in the body of the request, which changes both the client's `send()` call and the way the server reads the data.

## For POST, the query string sits in the body (slides 22 and 23)

Demo 4's client (slide 23) reads a name from a text box and posts it to the server on port 3000: `xhr.open("POST", "http://localhost:3000")`, then `xhr.send("name=" + name)`, and the reply is read in `xhr.onload` and written into `#result`. The yellow note on `send`: *"For POST, the query string sits in the body of the request"*. `onload` fires once, when the response has fully arrived, so it needs no readyState test.

This runner does the same with no extra header and shows what the server receives.

```js run pin noHeader.js
// predict: What content type and body does the server see?
const xhr = new XMLHttpRequest();
xhr.open("POST", SERVER + "/api/echo");
xhr.send("name=" + "John");
xhr.onload = function () {
  const echo = JSON.parse(xhr.responseText);
  console.log(echo.headers["content-type"]);
  console.log(echo.body);
};
```

After `xhr.send("name=" + "John");` with no header, `echo.headers["content-type"]` is `text/plain;charset=UTF-8` and `echo.body` is the string as sent. That is a simple request, so no preflight is sent, which is why slide 24's server works with this client.

## The server collects the body in chunks (slide 24)

*"See how data is extracted from the POST request in chunks"*:

```js pin server.js (POST, port 3000)
const http = require("http");
const server = http.createServer(function(req, res) {
  // check if the request method is POST
  if (req.method === "POST") {
    if (req.headers["access-control-request-method"]) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.end();
    } else {
      let query = "";
      req.on("data", function(chunk) {
        query += chunk;
      });
      req.on("end", function() {
        let params = new URLSearchParams(query);
        let name = params.get("name");
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.write("Hello " + name);
        res.end();
      });
    }
  }
});
// listen on port 3000
server.listen(3000, function() {
  console.log("Server is running on port 3000");
});
```

What appear in the terminal and on the page when John is posted? The body arrives in pieces: each `query += chunk;` appends one, and only inside `req.on("end", …)` is `query` complete, so `new URLSearchParams(query)` and `res.write("Hello " + name);` wait for it.

```text
Terminal:  Server is running on port 3000
Page:      Hello John
```

The inner `access-control-request-method` branch never runs: a real preflight arrives as `OPTIONS`, not POST, and this server answers nothing to `OPTIONS` or GET.

```diagram
{ "type": "sequence", "nodes": [ { "id": "c", "label": "Client", "kind": "lane" }, { "id": "r", "label": "req stream", "kind": "lane" }, { "id": "s", "label": "Server callback", "kind": "lane" } ], "edges": [ { "from": "c", "to": "r", "label": "send(name=John&age=23)" }, { "from": "r", "to": "s", "label": "data: chunk 1, body += chunk" }, { "from": "r", "to": "s", "label": "data: chunk 2, body += chunk" }, { "from": "r", "to": "s", "label": "end: parse the whole body" }, { "from": "s", "to": "c", "label": "res.end(Hello: John ...)" } ], "hi": ["4"], "caption": "See how data is extracted from the POST request in chunks" }
```

## A header describes the body (slides 26 and 27)

Slide 26's `ajaxPostGet.html` starts with *"Some variable initializations"*: `endPointRoot = "http://localhost:8888/API/v1/"`, `params = "?name=John&age=23";// or a json string` and `resource = "patients/"`. Slide 27 adds:

- *"The 'application/x-www-form-urlencoded' content type describes form data that is sent in a single block in the HTTP message body."*
- *"A header is a piece of information about the data sent via HTTP request. It tells the server receiving the request what type of data is enclosed, its formatting, the language used."*
- *"More than one header can be put on a HTTP request; each in a 'name' and a 'value' pair"*

The code comment: `send()` *accepts an optional parameter which lets you specify the request's body; this is primarily used for requests such as POST, PUT. If the request method is GET or HEAD, the body parameter is ignored and the request body is set to null.*

The preview is slides 26 and 27 with `endPointRoot` pointed at the echo server.

```html run pin ajaxPostGet.html
<h1>The XMLHttpRequest Object</h1>
<button type="button" onclick="post()">POST</button>
<button type="button" onclick="getAll()">GET</button>
<div id="demo">no response yet!</div>
<script>
    const xhttp = new XMLHttpRequest();
    const endPointRoot = SERVER + "/api/echo/API/v1/";
    let params = "?name=John&age=23";// or a json string
    let resource = "patients/";
    function post() {
        xhttp.open("POST", endPointRoot + resource, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML = this.responseText;
            }
        };
    }
    function getAll() {
        const url = endPointRoot + resource + params;
        xhttp.open("GET", url, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML = this.responseText;
            }
        };
    }
</script>
```

POST shows the echo's `query` empty and `body` holding `?name=John&age=23`; GET shows the reverse. `xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");` adds one name/value pair. The body keeps its leading `?`, which a strict form parser would read as part of the key `?name`; slide 28's server copes only because it runs the body through `url.parse`.

```diagram
{ "type": "grid", "title": "GET and POST in ajaxPostGet.html", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "GET", "row": 0, "col": 1 }, { "id": "h2", "label": "POST", "row": 0, "col": 2 }, { "id": "a0", "label": "parameters go", "row": 1, "col": 0 }, { "id": "a1", "label": "in the URL after ?", "row": 1, "col": 1 }, { "id": "a2", "label": "in the body", "row": 1, "col": 2 }, { "id": "b0", "label": "send() argument", "row": 2, "col": 0 }, { "id": "b1", "label": "none (ignored, null)", "row": 2, "col": 1 }, { "id": "b2", "label": "params", "row": 2, "col": 2 }, { "id": "c0", "label": "Content-type", "row": 3, "col": 0 }, { "id": "c1", "label": "none needed", "row": 3, "col": 1 }, { "id": "c2", "label": "x-www-form-urlencoded", "row": 3, "col": 2 }, { "id": "d0", "label": "server reads it", "row": 4, "col": 0 }, { "id": "d1", "label": "url.parse(req.url, true)", "row": 4, "col": 1 }, { "id": "d2", "label": "chunks joined on end", "row": 4, "col": 2 } ], "hi": ["a2"], "caption": "For POST, the query sits in the body of the request" }
```

## The form-urlencoded body, echoed

```js run pin postBody.js
// predict: Write the three lines the console prints.
const xhr = new XMLHttpRequest();
xhr.open("POST", SERVER + "/api/echo", true);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.onload = function () {
  const echo = JSON.parse(xhr.responseText);
  console.log(echo.method);
  console.log(echo.headers["content-type"]);
  console.log(echo.body);
};
xhr.send("name=John&age=23");
```

The header from `xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");` arrives as written, and `echo.body` is the single block `name=John&age=23`.

```js run pin getBody.js
// predict: What does the server report as the body?
const xhr = new XMLHttpRequest();
xhr.open("GET", SERVER + "/api/echo?name=John", true);
xhr.onload = function () {
  console.log(JSON.stringify(JSON.parse(xhr.responseText).body));
};
xhr.send("name=John");
```

`""`: the `xhr.send("name=John");` body is dropped because the request was opened with `xhr.open("GET", SERVER + "/api/echo?name=John", true);`, as the slide's comment says.

## GET and POST take different paths through serverPostGet.js (slide 28)

*"Note the differences between handling a GET request and a POST request"*:

```js pin serverPostGet.js
const http = require('http'); const url = require('url');
const GET = 'GET'; const POST = 'POST';
const endPointRoot = "/API/v1/";
http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
        //all origions can send request to this server
        // is this really a good practice?
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    });
    console.log(req.headers);
    if (req.method === GET) {
        const q = url.parse(req.url, true);
        // here you fetch some data from DB
        res.end(`Hello  ${q.query["name"]}.
        GET all request is recvied!`);
    }
    if (req.method === POST && req.url === endPointRoot + 'patients/') {
        let body = "";
        /* req.on('data' gets called when something has been read
        from the stream */
        req.on('data', function (chunk) {
            if (chunk != null) {// you need to check this if
                body += chunk;// data may come in multiple chunks
            }
        });
        /*req.on('end' gets called when stream has ended
        ( all data from cleint has arrived to server)*/
        req.on('end', function () {
            let q = url.parse(body, true);
            res.end(`Hello: ${q.query.name}, we got your POST request`);
        });
    }
}
).listen(8888);
```

What does each button print? `req.method` picks the branch. A GET parses `req.url`; a POST to `/API/v1/patients/` collects chunks in `req.on('data', …)` and parses the body only in `req.on('end', …)`.

```text
GET button:   Hello  John.
              GET all request is recvied!
POST button:  Hello: John, we got your POST request
```

The spellings are the slide's. `Access-Control-Allow-Methods` only matters in a preflight answer, and this server never ends an `OPTIONS` request, so a client that triggered one would hang. Slide 29 asks what a preflight is: see [the CORS lesson](#/comp4537-l5/cors-and-the-same-origin-policy). Slide 30: *"Disclaimer: It's the students' responsibility to write their own code."*

```diagram
{ "type": "flow", "dir": "tb", "title": "serverPostGet.js routing", "nodes": [ { "id": "req", "label": "req", "sub": "writeHead(200, ACAO *, ACAM *)" }, { "id": "get", "label": "GET", "sub": "url.parse(req.url, true)" }, { "id": "post", "label": "POST /API/v1/patients/", "sub": "collect chunks; on end url.parse(body, true)" }, { "id": "r1", "label": "Hello  John.", "sub": "GET all request is recvied!" }, { "id": "r2", "label": "Hello: John,", "sub": "we got your POST request" } ], "edges": [ { "from": "req", "to": "get" }, { "from": "req", "to": "post" }, { "from": "get", "to": "r1" }, { "from": "post", "to": "r2" } ], "hi": ["post"], "caption": "Note the differences between handling a GET request and a POST request" }
```

## Post a clinic appointment

A clinic page books an appointment by posting `patient=Ana&day=Tue` to the echo endpoint as form data.

```quiz
[
  { "q": "Which three lines post the appointment as form data?", "options": ["`x.open(\"POST\", SERVER + \"/api/echo\", true);` `x.setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\");` `x.send(\"patient=Ana&day=Tue\");`", "`x.open(\"POST\", SERVER + \"/api/echo?patient=Ana&day=Tue\", true);` `x.send();`", "`x.open(\"GET\", SERVER + \"/api/echo\", true);` `x.setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\");` `x.send(\"patient=Ana&day=Tue\");`", "`x.send(\"patient=Ana&day=Tue\");` `x.open(\"POST\", SERVER + \"/api/echo\", true);`"], "answer": 0, "explain": "Slide 27's `post()`: `open` with POST, `setRequestHeader` between `open` and `send`, and the parameters as the argument of `send`. Putting them in the URL is the GET way; a GET drops the body; `send` before `open` throws." },
  { "q": "Order the clinic server's lines for reading the body.", "type": "reorder", "lang": "js", "lines": ["let booking = \"\";", "req.on(\"data\", function (piece) { booking += piece; });", "req.on(\"end\", function () {", "  const p = new URLSearchParams(booking); res.end(\"Booked \" + p.get(\"patient\")); });"], "explain": "Start with an empty string, append every `data` chunk, and parse only in the `end` handler, when *all data from cleint has arrived to server* (slide 28)." },
  { "q": "The page instead sends a GET to `SERVER + \"/api/echo?patient=Ana\"` and calls `send(\"day=Tue\")`. What body does the server see?", "options": ["An empty body", "day=Tue", "patient=Ana&day=Tue", "?patient=Ana"], "answer": 0, "explain": "Slide 27's comment: for GET or HEAD *the body parameter is ignored and the request body is set to null*; the GET runner's echo reported `\"\"`." },
  { "q": "Click the line that makes this clinic server reply before the whole body has arrived.", "type": "spotbug", "lang": "js", "code": "let booking = \"\";\nreq.on(\"data\", function (piece) {\n  booking += piece;\n  res.end(\"Booked \" + new URLSearchParams(booking).get(\"patient\"));\n});\nreq.on(\"end\", function () {\n  console.log(\"body complete\");\n});", "answer": 4, "explain": "Replying inside the `data` handler uses only the first chunk; a second chunk would try to answer again. The parse and reply belong in the `end` handler." }
]
```

```quiz
[
  { "q": "Where does an AJAX POST put its parameters?", "options": ["In the request body, as the argument of `send()`", "In the URL after `?`", "In the response headers", "In the status line"], "answer": 0, "explain": "Slides 23 and 27: *For POST, the query string sits in the body of the request*. GET appends them to the URL." },
  { "q": "What does `Content-type: application/x-www-form-urlencoded` say about a POST body?", "options": ["It holds form fields as name=value pairs joined with &, in a single block", "It holds a JSON object", "It holds binary image data", "It must be empty"], "answer": 0, "explain": "Slide 27: it *describes form data that is sent in a single block in the HTTP message body*, the same `name=John&age=23` shape as a query string." },
  { "q": "A single HTTP request can carry several headers, each a name and a value.", "type": "tf", "answer": true, "explain": "Slide 27: *More than one header can be put on a HTTP request; each in a 'name' and a 'value' pair*." },
  { "q": "Which is the right way for a Node server to read a POST body?", "options": ["Append each `data` chunk and use the body in the `end` handler", "Read it from `req.url`", "Use the first `data` chunk; it always holds everything", "Read it from `res.statusCode`"], "answer": 0, "explain": "Slide 28: `req.on('data')` *gets called when something has been read from the stream*, data *may come in multiple chunks*, and `req.on('end')` fires when all of it has arrived." },
  { "q": "`xhr.send(\"a=1\")` on a request opened with GET sends `a=1` as the body.", "type": "tf", "answer": false, "explain": "Slide 27's comment: for GET or HEAD the body parameter is ignored and set to null; the GET runner's echo reported an empty body." },
  { "q": "Slide 23 sends `xhr.send(\"name=\" + name)` with no header. Which content type does the browser give the body?", "options": ["text/plain;charset=UTF-8", "application/json", "application/x-www-form-urlencoded", "text/html"], "answer": 0, "explain": "The no-header runner's echo printed `text/plain;charset=UTF-8`. That is a simple request, so no preflight is sent." },
  { "q": "What HTTP method does a real preflight use, which slide 24's inner branch never sees?", "type": "text", "answer": ["OPTIONS"], "explain": "The preflight is an `OPTIONS` request; slide 24 only looks inside `req.method === \"POST\"`, so its `access-control-request-method` test never matches." },
  { "type": "free", "q": "Compare how a GET and a POST send `name=John` with XMLHttpRequest, and how the Node server reads each.", "model": "GET appends the query string to the URL (`open(\"GET\", url + \"?name=John\", true)`, `send()` with no body) and the server reads it with `url.parse(req.url, true).query`. POST puts it in the body (`setRequestHeader(\"Content-type\", \"application/x-www-form-urlencoded\")`, `send(\"name=John\")`); the server appends `data` chunks and parses the body in the `end` handler.", "points": ["GET: parameters in the URL query string", "GET: send() with no body (a body would be ignored)", "POST: parameters in the body passed to send()", "POST: Content-type application/x-www-form-urlencoded", "server collects data chunks, parses on end"], "rows": 5, "explain": "Slides 23, 27 and 28." }
]
```
