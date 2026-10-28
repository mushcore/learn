---
title: CORS, the Same-Origin Policy and the preflight request
minutes: 18
---

Demo 3 sends the same AJAX call to a server on another site, and the browser refuses to hand over the reply. Who blocks it, and which header lets it through?

## The CORS error names the page's origin (slides 15 and 16)

Slide 16 asks *"Who has seen a similar message?"* over this DevTools console error, cut off on the right:

```text
Access to XMLHttpRequest at 'http://localhost:8888/?name=John' from origin
'null' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' he[cut off]
the invalid value
```

The origin is `'null'` because the page was opened from a `file://` path. The app's sandboxed runners send `Origin: null` too.

## Same-Origin Policy is the default and CORS relaxes it (slide 18)

Slide 17's server on sisterstech.com sent no CORS header. Typed into the address bar, `sisterstech.com/app1/?name=John` showed "Hello John"; the AJAX call from another origin was blocked. Slide 18:

- *"CORS is a security feature implemented in web browsers and is configured by the contacted server in the response's header to the AJAX requests made via the browser"*
- *"CORS (Cross-Origin Resource Sharing)"*
- *"By default, web browsers enforce a security policy called "Same-Origin Policy " (SOP) means the html files containing the AJAX requests have to be hosted in the same origin that also hosts the server side scripts, responding to those requests."*
- *"browsers will block the Cross-Origin Requests unless the server being contacted explicitly allows it"*

Its footnotes, in order:

1. *requests made mainly via AJAX, ( also in most browsers via forms the url address bar)*
2. *expected behaviour for most browsers*
3. *An origin is ( supposed to be) defined by the combination of domain, protocols and ports ( 80 is the default for HTTP, 443 for HTTPS)*
4. *When a web page hosted in originA needs to cross and send requests to a server in another origin, originB*

Footnote 1 overreaches: CORS applies to script requests such as XHR; the address bar and plain form submissions are not blocked, as slide 17's screenshot shows.

```diagram
{ "type": "flow", "title": "No Access-Control-Allow-Origin: blocked", "nodes": [ { "id": "page", "label": "html page", "sub": "origin A" }, { "id": "browser", "label": "browser", "sub": "enforces SOP" }, { "id": "api", "label": "server script", "sub": "origin B" } ], "edges": [ { "from": "page", "to": "browser", "label": "AJAX request" }, { "from": "browser", "to": "api", "label": "request" }, { "from": "api", "to": "browser", "label": "no ACAO header" }, { "from": "browser", "to": "page", "label": "blocked", "dashed": true } ], "hi": ["browser"], "caption": "browsers will block the Cross-Origin Requests unless the server being contacted explicitly allows it" }
```

The request still reaches origin B; the browser refuses to hand the answer to the script.

```diagram
{ "type": "grid", "title": "Same origin as http://localhost:3000 ?", "nodes": [ { "id": "h0", "label": "URL", "row": 0, "col": 0 }, { "id": "h1", "label": "differs in", "row": 0, "col": 1 }, { "id": "h2", "label": "same origin?", "row": 0, "col": 2 }, { "id": "a0", "label": "http://localhost:3000/notes.html", "row": 1, "col": 0 }, { "id": "a1", "label": "path only", "row": 1, "col": 1 }, { "id": "a2", "label": "yes", "row": 1, "col": 2 }, { "id": "b0", "label": "http://localhost:8000", "row": 2, "col": 0 }, { "id": "b1", "label": "port", "row": 2, "col": 1 }, { "id": "b2", "label": "no", "row": 2, "col": 2 }, { "id": "c0", "label": "https://localhost:3000", "row": 3, "col": 0 }, { "id": "c1", "label": "protocol", "row": 3, "col": 1 }, { "id": "c2", "label": "no", "row": 3, "col": 2 }, { "id": "d0", "label": "http://127.0.0.1:3000", "row": 4, "col": 0 }, { "id": "d1", "label": "domain", "row": 4, "col": 1 }, { "id": "d2", "label": "no", "row": 4, "col": 2 } ], "hi": ["a2"], "caption": "An origin is defined by the combination of domain, protocols and ports; the path is not part of it." }
```

`http://clinic.ca` and `http://clinic.ca:80` are one origin: 80 is HTTP's default.

## Access-Control-Allow-Origin tells the browser who may read the reply (slide 19)

*"We now pass one more argument to the writehead () method"*. *"The "Access-Control-Allow-Origin" tells the browser what origins can send requests to this server"*, and *"In our case we chose "*" which means everyone! all origins around the world Can Send request to this server"*.

```js pin app.js (sisterstech, after)
const http = require('http');
const url = require('url');
const server = http.createServer(function(req, res) {
  const q = url.parse(req.url, true);
  console.log(q.query); //returns the object form of '?name=John'
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.end('Hello '+q.query["name"]);
});
server.listen();
```

What does the `file://` page show now? The circled line `"Access-Control-Allow-Origin": "*"` is the only change from slide 17's `writeHead`. `server.listen()` has no port because the cPanel host supplies one.

```text
The XMLHttpRequest Object
Hello John
```

### The browser compares origins and reads one header

Page at port 3000, API at port 8000: different origins. The second widget leaves the header out.

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": "*", "method": "GET", "contentType": "text/plain", "client": "browser", "predict": true }
```

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": null, "method": "GET", "contentType": "text/plain", "client": "browser", "predict": true }
```

## One request allowed, one blocked

The first runner's server sends `Access-Control-Allow-Origin: *`; the second's, `/api/echo-nocors`, does not.

```js run pin allowed.js
// predict: What two lines print?
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4) {
    console.log(this.status);
    console.log(JSON.parse(this.responseText).headers.origin);
  }
};
xhttp.open("GET", SERVER + "/api/echo?name=John", true);
xhttp.send();
```

`this.status` is 200, and the echoed `headers.origin` is `null`, the same `'null'` slide 16 names.

```js run pin blocked.js
// predict: Which lines print, and does the if body run?
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  console.log(this.readyState + " " + this.status);
  if (this.readyState == 4 && this.status == 200) {
    console.log(this.responseText);
  }
};
xhttp.onerror = function () { console.log("blocked"); };
xhttp.open("GET", SERVER + "/api/echo-nocors?name=John", true);
xhttp.send();
```

DONE arrives with `status` 0, so the slide's `if` never passes and `onerror` fires. The red message goes to the real DevTools console, not this pane.

## Allow-Methods, Allow-Headers and the preflight (slides 20 and 29)

Slide 20, worked out:

- `Access-Control-Allow-Methods` lists the methods the server accepts from other origins; `Access-Control-Allow-Headers` lists the request headers it accepts, such as `Content-Type`.
- A **preflight** is an `OPTIONS` request the browser sends by itself before a cross-origin request that is not "simple", carrying `Access-Control-Request-Method`.
- The server answers `OPTIONS` with a 2xx, typically 204, the `Access-Control-Allow-*` headers and no body; then the real request goes.

A JSON POST, PUT and DELETE need one; a plain GET and an `application/x-www-form-urlencoded` or `text/plain` POST do not.

```diagram
{ "type": "sequence", "nodes": [ { "id": "s", "label": "Script", "kind": "lane" }, { "id": "b", "label": "Browser", "kind": "lane" }, { "id": "srv", "label": "Server (origin B)", "kind": "lane" } ], "edges": [ { "from": "s", "to": "b", "label": "send(json), application/json" }, { "from": "b", "to": "srv", "label": "OPTIONS + Request-Method: POST" }, { "from": "srv", "to": "b", "label": "204 + Allow-Origin, -Methods" }, { "from": "b", "to": "srv", "label": "the real POST" }, { "from": "srv", "to": "b", "label": "200 + Allow-Origin: *" }, { "from": "b", "to": "s", "label": "responseText" } ], "hi": ["2", "3"], "caption": "The preflight the slide asks about, drawn: OPTIONS first, the real POST only if allowed." }
```

### A JSON POST sends OPTIONS first

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": "*", "method": "POST", "contentType": "application/json", "client": "browser", "predict": true }
```

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": "*", "method": "POST", "contentType": "application/x-www-form-urlencoded", "client": "browser", "predict": true }
```

## A JSON POST passes one preflight and fails the other

The same JSON note goes to the echo server, then to `/api/echo-nocors`, whose `OPTIONS` answer has no CORS header.

```js run pin preflight.js
// predict: What does each request log?
function post(path, done) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", SERVER + path, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onloadend = function () {
    console.log(path + " status " + xhr.status);
    if (xhr.status == 200) console.log(JSON.parse(xhr.responseText).method);
    if (done) done();
  };
  xhr.send(JSON.stringify({ note: "buy milk" }));
}
post("/api/echo", function () { post("/api/echo-nocors"); });
```

The first preflight is allowed, so the echo reports `POST`. The second fails, so the browser never sends the POST and `xhr.status` is 0.

## Answering the preflight in Node

Going beyond the slide: slide 19's server with an `OPTIONS` branch.

```js pin server.js (CORS headers)
const http = require('http');
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
http.createServer(function (req, res) {
  if (req.method === "OPTIONS") {      // the preflight
    res.writeHead(204, cors);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html", ...cors });
  res.end("Hello from origin B");
}).listen(8000);
```

What does a JSON POST from another origin get? `res.writeHead(204, cors);` answers the `OPTIONS`, `res.end();` sends no body, then the real POST gets the second `writeHead`.

```text
OPTIONS /  ->  204, Access-Control-Allow-Origin: *, -Methods, -Headers
POST /     ->  200, Hello from origin B
```

## Postman skips CORS, and the ChatGPT sentence is wrong (slide 21)

Can Postman call any URL regardless of CORS? Worked out: yes. CORS is *implemented in web browsers*; Postman is not one.

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": null, "method": "GET", "contentType": "text/plain", "client": "postman" }
```

The slide quotes ChatGPT 3.5: *"CORS allows for secure communication between web applications hosted on different domains while still maintaining control over which domains have access."* Worked out: CORS adds no encryption or authentication (HTTPS does); it is a server relaxing the SOP; it concerns origins, not domains; and non-browser clients ignore it.

```quiz
[
  { "q": "What is a preflight request?", "options": ["An OPTIONS request the browser sends first to ask whether the server permits the cross-origin request", "A GET the server sends to the browser before its response", "The first chunk of a POST body", "A request typed into the address bar before an AJAX call"], "answer": 0, "explain": "Worked out for slides 20 and 29: the browser sends `OPTIONS` with `Access-Control-Request-Method`; only an allowing answer lets the real request go." },
  { "q": "Which cross-origin request makes the browser send a preflight?", "options": ["PUT with a JSON body", "GET with no custom headers", "POST with Content-Type text/plain", "POST with Content-Type application/x-www-form-urlencoded"], "answer": 0, "explain": "PUT is not a simple method, and `application/json` is not a simple content type, so either triggers `OPTIONS`. Plain GETs and form-urlencoded or text/plain POSTs are simple requests." },
  { "q": "Which response header names the origins allowed to read the reply?", "options": ["Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers", "Content-Type"], "answer": 0, "explain": "Slide 19: *The \"Access-Control-Allow-Origin\" tells the browser what origins can send requests to this server*. Allow-Methods lists methods and Allow-Headers lists request headers." },
  { "q": "CORS is enforced by the server and configured by the browser.", "type": "tf", "answer": false, "explain": "Reversed. Slide 18: CORS is *implemented in web browsers* and *configured by the contacted server in the response's header*." },
  { "q": "Which pair of URLs has the same origin?", "options": ["`http://clinic.ca/a.html` and `http://clinic.ca:80/b.html`", "`http://clinic.ca` and `https://clinic.ca`", "`http://clinic.ca:3000` and `http://clinic.ca:8000`", "`http://clinic.ca` and `http://api.clinic.ca`"], "answer": 0, "explain": "Origin = protocol + domain + port (slide 18, footnote 3), and *80 is the default for HTTP*, so the first pair matches; the path does not count. The others differ in protocol, port and domain." },
  { "q": "A server leaves out Access-Control-Allow-Origin. A request from Postman to it is blocked.", "type": "tf", "answer": false, "explain": "Worked out for slide 21: CORS is implemented in web browsers; Postman does no origin check, so it gets the response." },
  { "q": "The ChatGPT 3.5 sentence on slide 21 says CORS provides secure communication between domains. True or false?", "type": "tf", "answer": false, "explain": "CORS adds no encryption or authentication (that is HTTPS); it is the server allowing other origins past the browser's SOP, and it is about origins, not just domains." },
  { "q": "A blocked XHR reaches readyState 4. What is its `status`?", "type": "numeric", "answer": 0, "tolerance": 0, "explain": "In the blocked run the handler logged readyState 4 with status 0 and `onerror` fired, so `readyState == 4 && status == 200` never passed." },
  { "type": "free", "q": "Explain CORS and the preflight request.", "model": "Browsers enforce the Same-Origin Policy by default: a page's AJAX requests may only read replies from its own origin, where an origin is protocol + domain + port. CORS (Cross-Origin Resource Sharing) is implemented in the browser and configured by the contacted server, which allows other origins with response headers such as `Access-Control-Allow-Origin`. For a request that is not simple (a JSON POST, PUT, DELETE, custom headers) the browser first sends an `OPTIONS` preflight; the server answers with the allowed origin, methods and headers, and only then is the real request sent. Non-browser clients such as Postman are not affected.", "points": ["SOP is the browser's default", "origin = protocol + domain + port", "browser enforces, server configures via response headers", "preflight = OPTIONS before a non-simple request (e.g. JSON POST)", "Postman and other non-browser clients ignore CORS"], "rows": 6, "explain": "Slide 18's sentences plus the worked-out answers to slides 20 and 21." }
]
```
