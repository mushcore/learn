---
title: XMLHttpRequest in four steps, readyState 0 to 4 and the status codes
minutes: 16
---

Until now every request went out through the address bar. This lesson sends one from inside a page, with four statements, and reads the two numbers that say when the answer has arrived and whether it is good.

## Requests from inside the page go by form or by AJAX call (slides 2 to 6)

Slide 2's outline splits the lecture at the line *"self study for next week"*: AJAX calls, the demos and the call to a remote server come before it; CRUD, XAMPP, connecting to MySQL from Node and remote hosting come after. Slide 3 reviews weeks 1 to 4, with one reminder from [Lecture 4](#/comp4537-l4/node-modules): *"math.js Works too"*, so `require('./modules/math.js')` loads the same module as `'./modules/math'`.

Slide 5 states the gap: *"So far we sent our requests to the server via the browsers' address bar!"* To send something when a button is pressed, *"You could do that either via forms / or / AJAX calls"*. Slide 6: *"AJAX allows sending request to server"*.

```diagram
{ "type": "flow", "title": "How AJAX Works", "nodes": [ { "id": "b1", "label": "Browser", "sub": "An event occurs; create an XMLHttpRequest object; send HttpRequest" }, { "id": "net1", "label": "Internet", "kind": "pill" }, { "id": "srv", "label": "Server", "sub": "Process HTTPRequest; create a response and send data back" }, { "id": "net2", "label": "Internet", "kind": "pill" }, { "id": "b2", "label": "Browser", "sub": "Process the returned data using JavaScript; update page content" } ], "edges": [ { "from": "b1", "to": "net1" }, { "from": "net1", "to": "srv" }, { "from": "srv", "to": "net2" }, { "from": "net2", "to": "b2" } ], "caption": "AJAX allows sending request to server (slide 6, from w3schools)." }
```

## Step 1 creates an XMLHttpRequest object (slide 7)

*"1- Create an XMLHttpRequest Object"*, *"( just like the way we created Date object)"*:

```js
let xhttp = new XMLHttpRequest();
```

## Step 2 names the function that handles the response (slide 8)

```js
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML =
        this.responseText;
     }
};
```

The browser calls this function every time `readyState` changes. Slide 8's callout calls `readyState` the *"status of the XMLHttpRequest"*:

| readyState | Slide 8's meaning |
|---|---|
| 0 (UNSENT) | *The XHR object has been created, but open() has not been called yet.* |
| 1 (OPENED) | *open() has been called.* |
| 2 (HEADERS_RECEIVED) | *send() has been called, and the headers of the response are available.* |
| 3 (LOADING) | *The response is being received. As data comes in, the responseText property is updated.* |
| 4 (DONE) | *The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred.* |

The sticky note adds that state 3 can be reached *multiple times* when the server sends a large response in chunks.

`status` is the *"http response type your server script returns"*:

| status | Slide 8's meaning |
|---|---|
| 200 | "OK" |
| 3xx | *generally used for redirection purposes* |
| 4xx | *client error*: 403 "Forbidden", 404 "Not Found" |
| 5xx | *server error ( something wrong with the server)* |

Slide 8 asks who determines the status code and leaves it open. Worked out: the server script, as the callout's own label says; in Lecture 4 it is the first argument of `writeHead(200, …)`. Because DONE also covers *an error occurred*, the handler tests both numbers.

:::quiz The w3schools table is the wrong one
Lecture 6 slide 55 stamps the w3schools wording *"not accurate!"*: 0 request not initialized, 1 server connection established, 2 request received, 3 processing request, 4 request finished and response is ready. The same slide confirms slide 8's list *"is accurate"*: typing `XMLHttpRequest.DONE` in the DevTools console gives 4, and the constants are named UNSENT, OPENED, HEADERS_RECEIVED, LOADING and DONE.
:::

## Steps 3 and 4 open the request and send it (slide 9)

*"3- Open AJAX request"*: `xhttp.open(method, url, Async or sync);`. *"Method type could be GET or POST etc"* and *"url is the url of the file we want to handle our request"*. Then: *"Everything is in place! We just send it and carry on (we don't wait if we sent it asynchronously )"*. Step 4 is `xhttp.send();`.

### The four statements as messages

The slide's steps drawn: statements 1 to 4 are the script's; the browser sets every state after that.

```diagram
{ "type": "sequence", "nodes": [ { "id": "s", "label": "Script", "kind": "lane" }, { "id": "x", "label": "XMLHttpRequest", "kind": "lane" }, { "id": "srv", "label": "Server", "kind": "lane" } ], "edges": [ { "from": "s", "to": "x", "label": "new XMLHttpRequest() (0)" }, { "from": "s", "to": "x", "label": "onreadystatechange = f" }, { "from": "s", "to": "x", "label": "open(GET, url, true) (1)" }, { "from": "x", "to": "srv", "label": "send(): request" }, { "from": "srv", "to": "x", "label": "headers (2)" }, { "from": "srv", "to": "x", "label": "body arriving (3)" }, { "from": "x", "to": "s", "label": "complete (4), status 200" } ], "hi": ["1", "2", "3", "4"], "caption": "The slide's steps drawn: the four statements the script writes." }
```

## The four steps against the echo server

The program assigns the handler before `open`, so state 1 is logged too, and logs `"sent"` right after `send()`.

```js run pin fourSteps.js
// predict: Write every line the console prints, in order.
let xhttp = new XMLHttpRequest();            // step 1
xhttp.onreadystatechange = function () {     // step 2
  console.log(this.readyState);
  if (this.readyState == 4 && this.status == 200) {
    console.log("DONE " + this.status);
  }
};
xhttp.open("GET", SERVER + "/api/echo?name=John", true); // step 3
xhttp.send();                                // step 4
console.log("sent");
```

`1` prints before `"sent"`: `open` changes the state while the script is still running. `send()` returns at once, so `"sent"` comes next, and 2, 3 and 4 arrive later as the response does. Only at 4 does `this.status == 200` get checked as true. A large reply could repeat 3, as the sticky note says.

### The states the browser sets

```diagram
{ "type": "sequence", "nodes": [ { "id": "s", "label": "Script", "kind": "lane" }, { "id": "x", "label": "XMLHttpRequest", "kind": "lane" }, { "id": "srv", "label": "Server", "kind": "lane" } ], "edges": [ { "from": "s", "to": "x", "label": "new XMLHttpRequest() (0)" }, { "from": "s", "to": "x", "label": "onreadystatechange = f" }, { "from": "s", "to": "x", "label": "open(GET, url, true) (1)" }, { "from": "x", "to": "srv", "label": "send(): request" }, { "from": "srv", "to": "x", "label": "headers (2)" }, { "from": "srv", "to": "x", "label": "body arriving (3)" }, { "from": "x", "to": "s", "label": "complete (4), status 200" } ], "hi": ["5", "6", "7"], "caption": "The slide's steps drawn: states 2, 3 and 4 come from the response, not from the script." }
```

### readyState ticks from 0 to 4 and the if passes once

Each step is one statement or one change of state; the handler's `if` is evaluated on every change. With predict on, name the readyState before it changes.

```widget
xhr-play
{ "method": "GET", "url": "http://localhost:8888/?name=John", "async": true, "status": 200, "predict": true }
```

### With async false the script waits; with 404 the request is DONE but the if fails

A server that answers 404 still completes the request: readyState reaches 4, `status` is 404, and the `if` body never runs.

```widget
xhr-play
{ "async": false, "status": 404 }
```

## Order the steps for a weather service

A weather page asks the echo endpoint for `?city=Burnaby`. Use slide 8's names and slide 9's order.

```quiz
[
  { "q": "Put the weather page's statements in slide 7 to 9's step order.", "type": "reorder", "lang": "js", "lines": ["let req = new XMLHttpRequest();", "req.onreadystatechange = function () { if (this.readyState == 4 && this.status == 200) show(this.responseText); };", "req.open(\"GET\", SERVER + \"/api/echo?city=Burnaby\", true);", "req.send();"], "explain": "Step 1 creates the object, step 2 names the function that handles the response, step 3 opens the request with method, url and async, step 4 sends it. The handler must exist before the response arrives; assigning it before `open` also catches state 1." },
  { "q": "Right after `req.open(\"GET\", url, true)` returns, and before `send()`, what is `req.readyState`?", "options": ["1 (OPENED)", "0 (UNSENT)", "2 (HEADERS_RECEIVED)", "4 (DONE)"], "answer": 0, "explain": "Slide 8: 1 (OPENED) means *open() has been called*. 0 is before `open`; 2 needs `send()` and the response headers; 4 needs the whole response." },
  { "q": "The weather server has no forecast for the city and answers 404. Does the body of `if (this.readyState == 4 && this.status == 200)` run?", "type": "tf", "answer": false, "explain": "The request still completes, so readyState reaches 4 (DONE covers *an error occurred*), but `status` is 404, so the second half of the test is false and the body is skipped." },
  { "q": "The forecast reply is several megabytes and arrives in many chunks. Which readyState can the handler see more than once?", "options": ["3 (LOADING)", "2 (HEADERS_RECEIVED)", "4 (DONE)", "1 (OPENED)"], "answer": 0, "explain": "Slide 8's sticky note: 3 (LOADING) can be reached multiple times when the server sends a large response in multiple chunks; `responseText` grows each time." },
  { "q": "Which open() call sends the weather request without making the script wait for the reply?", "options": ["`req.open(\"GET\", SERVER + \"/api/echo?city=Burnaby\", true);`", "`req.open(\"GET\", SERVER + \"/api/echo?city=Burnaby\", false);`", "`req.open(SERVER + \"/api/echo?city=Burnaby\", \"GET\", true);`", "`req.send(\"GET\", SERVER + \"/api/echo?city=Burnaby\");`"], "answer": 0, "explain": "Slide 9: `open(method, url, Async or sync)`. Method first, then url, then `true` for asynchronous (*we don't wait*). `false` makes it synchronous; the swapped order and `send` with a method are not the slide's signature." }
]
```

```quiz
[
  { "q": "Fill in slide 8's names for the readyState values.", "type": "fill", "code": "0 ___\n1 ___\n2 ___\n3 ___\n4 ___", "answer": ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"], "explain": "Slide 8, confirmed by Lecture 6 slide 55 from the `XMLHttpRequest` constants: 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING, 4 DONE." },
  { "q": "readyState 3 means \"processing request\".", "type": "tf", "answer": false, "explain": "That is the w3schools wording, which Lecture 6 slide 55 marks *not accurate!*. Slide 8: 3 (LOADING) means *The response is being received. As data comes in, the responseText property is updated.*" },
  { "q": "What does passing `false` as the third argument of `open()` do?", "options": ["The script stops at `send()` until the response has arrived", "The request is sent but the response is discarded", "The request goes out without the script waiting for it", "The browser skips the CORS check"], "answer": 0, "explain": "The third argument is *Async or sync* (slide 9). `true` means *we don't wait*; `false` makes the request synchronous, so `send()` blocks the script until DONE." },
  { "q": "Which readyState and status together mean the response is complete and the server answered OK?", "options": ["readyState 4 and status 200", "readyState 4 and status 404", "readyState 2 and status 200", "readyState 3 and status 304"], "answer": 0, "explain": "4 is DONE and 200 is \"OK\". 4 with 404 is complete but *Not Found*; 2 only has the headers; 3 is still loading, and 3xx codes are for redirection." },
  { "q": "A server answers 403. Which group does slide 8 put that code in?", "options": ["4xx, client error", "5xx, server error", "3xx, redirection", "2xx, success"], "answer": 0, "explain": "Slide 8: *4xx: client error*, with 403 \"Forbidden\" and 404 \"Not Found\" as its examples. 5xx means *something wrong with the server*." },
  { "q": "Which statement is step 2 of slide 7 to 9's procedure?", "options": ["`xhttp.onreadystatechange = function () { … };`", "`let xhttp = new XMLHttpRequest();`", "`xhttp.open(\"GET\", url, true);`", "`xhttp.send();`"], "answer": 0, "explain": "Step 2 is *specify the function that handles response*. Creating the object is step 1, `open` is step 3, `send` is step 4." },
  { "q": "Who decides which status code a response carries?", "type": "text", "answer": ["the server", "server", "the server script", "server script", "the server-side script"], "explain": "Worked out (slide 8 leaves the question open): the server script, as the callout's label *http response type your server script returns* says; in Node it is the first argument of `writeHead`." },
  { "type": "free", "q": "Explain readyState 0 to 4 and why the handler also checks `status`.", "model": "readyState is the status of the XMLHttpRequest: 0 UNSENT (object created, `open()` not called), 1 OPENED (`open()` called), 2 HEADERS_RECEIVED (`send()` called, response headers available), 3 LOADING (response being received, `responseText` updated; can repeat for a large chunked response), 4 DONE (complete, either success 2xx or an error). Because DONE also covers an error, the handler checks `status == 200` as well.", "points": ["0 UNSENT and 1 OPENED tied to open()", "2 HEADERS_RECEIVED after send(), headers available", "3 LOADING, responseText growing, may repeat", "4 DONE covers success or error", "status 200 must also be checked"], "rows": 5, "explain": "Slide 8's list, verbatim names; the w3schools names (request received, processing request) are the inaccurate version." }
]
```
