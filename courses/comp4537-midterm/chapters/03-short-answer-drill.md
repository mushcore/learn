---
title: Short and medium answers, the definitions and comparisons the exam asks for
minutes: 35
---

Twenty written questions in the shape of the exam's short and medium answers, grouped by lecture. Write each answer before revealing the model, then tick only the key points your answer actually states; items marked (medium) want an example as well.

## Lecture 1: the event queue and declarations

From lecture 1, slides 161–162: the timer script that prints 1, 3, 2.

```quiz
[
  {
    "type": "free",
    "q": "A script logs `\"a\"`, then calls `setTimeout(f, 0)` where `f` logs `\"b\"`, then logs `\"c\"`. Why does `\"b\"` print last, although the delay is 0?",
    "model": "`setTimeout(function, t)` *executes the function after the time t (in millisecond) is elapsed*, but the callback does not run on the spot: it waits in the event queue. It runs only when the call stack is empty, after the synchronous lines that follow it. Slide 162's script prints 1, 3, 2 with 1000 ms, and still 1, 3, 2 when 1000 is replaced with 0.",
    "points": ["the callback waits in the event (callback) queue", "it runs only when the call stack is empty", "the synchronous lines after `setTimeout` run first", "0 ms does not make it run early: slide 162 prints 1, 3, 2 for both delays"],
    "rows": 5,
    "explain": "In the restaurant terms of lecture 4, the waiter finishes the current table before picking up the ready order. The [output-order drill](#/comp4537-midterm/output-order-drill) runs this shape in programs 1, 2 and 7."
  }
]
```

From lecture 1, slides 115–117 and 132–134: `var`, `let` and `const`.

```quiz
[
  {
    "type": "free",
    "q": "Compare `var`, `let` and `const`: scope, hoisting, the global object, and reassignment.",
    "model": "- Scope: *var: Declares a function-scoped variable*; *let: Declares a block-scoped, variable*; `const` is block-scoped too.\n- Hoisting: a `var` read before its declaration prints `undefined`; reading a `let` first *will issue error and terminate execution* (slide 132).\n- Global object: *Global variable declared by var add to window*; *let does not add property to global window* (slide 134).\n- `const` cannot be reassigned: `Pi = 90` gives *Uncaught TypeError: Assignment to constant variable.* An object declared with `const` can still have its properties changed (slide 129).\n- Course rule: *Chose let and const, over var. In fact you do not need var* (slide 164).",
    "points": ["`var` function-scoped; `let` and `const` block-scoped", "`var` hoisted, reads `undefined`; `let` read early throws and stops the script", "a global `var` becomes `window.a`; `let` does not", "`const` cannot be reassigned (TypeError) but an object's properties can change", "use `const` first, then `let`, never `var`"],
    "rows": 7,
    "explain": "Slide 132's *will NOT hoist* is the exam's wording. Strictly, a `let` is hoisted but stays in the temporal dead zone until its line runs, which is why reading it throws."
  }
]
```

## Lecture 2: storage, architecture and JSON

From lecture 2, slides 31–34, 37 and 43–44: the two web storage objects.

```quiz
[
  {
    "type": "free",
    "q": "Compare `localStorage` and `sessionStorage`. Include what `getItem` returns and how an object is stored.",
    "model": "*window.localStorage - stores data with no expiration date*; *window.sessionStorage - stores data for one session (data is lost when the browser tab is closed)*. Both live in the browser, not the server, and *web storage is per origin*: reader.html reads what writer.html wrote only with *same origin, same browser, same machine*. Both hold about 5 MB. *Name/value pairs are always stored as strings*: `getItem` returns a string, or `null` for a missing key, so an object goes in with `JSON.stringify` and comes out with `JSON.parse`. Never store a password there: *a single XSS vulnerability exposes the password*.",
    "points": ["localStorage has no expiration date; sessionStorage is lost when the tab is closed", "both are per origin: same origin, same browser, same machine", "values are strings; `getItem` returns a string or `null`", "objects need `JSON.stringify` before `setItem` and `JSON.parse` after `getItem`", "no passwords: any script on the page can read it (XSS)"],
    "rows": 6,
    "explain": "Slide 32 calls web storage *more secure than cookies*; slide 44 adds that *HttpOnly and Secure cookies are often safer* for a login token, because JavaScript cannot read them. Give the slide-32 wording on a true/false item and slide 44's point in a written answer about tokens."
  }
]
```

From lecture 2, slides 10–20: three architectures that matter.

```quiz
[
  {
    "type": "free",
    "q": "(medium) Compare monolithic, layered and microservice architecture. Give one advantage and one drawback of microservices.",
    "model": "- **Monolithic**: *All application logic is bundled together in one deployable unit*, typically on one machine in one backend stack. To add a feature: 1- shut down the entire application, 2- add the feature, 3- *(may need to) recompile everything*. *Best for: prototyping, MVPs*.\n- **Layered (n-tier)**: *Layers = functional elements*: Presentation (e.g. form page), Business (e.g. decision making, routing requests), Application (e.g. libraries), Data access (e.g. databases).\n- **Microservices**: *A collection of loosely coupled, independently deployable services*. Pros: update or fix one service without shutting everything down; one function per service, so separate teams; each service on its own machine and stack. Cons: *many API calls → complexity increases*; *Requires orchestration, monitoring, and careful API design*.\n- Example: *If Facebook shuts down, Messenger can keep running*.",
    "points": ["monolith: one deployable unit; a fix means shutting down, changing and possibly recompiling everything", "layered: Presentation, Business, Application, Data access, in that order", "microservices: loosely coupled, independently deployable services", "a microservice advantage: fix one service without stopping the rest (or separate teams, different stacks)", "a microservice drawback: many API calls add complexity; needs orchestration and monitoring", "an example such as Messenger surviving when Facebook is down"],
    "rows": 9,
    "explain": "The course itself uses *a simplified Microservice Architecture (MSA)* with RESTful API calls, client and servers on different origins, and JSON responses (slide 21)."
  }
]
```

### The n-tier layers in slide order

Each layer's example from slide 13 is under its name.

```diagram
{ "type": "layers", "title": "Layered (n-tier) architecture", "nodes": [ { "id": "p", "label": "Presentation layer (UI layer)", "sub": "e.g. form page" }, { "id": "b", "label": "Business layer (business logic)", "sub": "e.g. decision making, routing requests" }, { "id": "a", "label": "Application layer", "sub": "e.g. libraries" }, { "id": "d", "label": "Data access layer", "sub": "e.g. databases" } ], "hi": ["b"], "caption": "Layers = functional elements (lecture 2, slide 13)." }
```

From lecture 2, slides 27–28: sending an object to a server.

```quiz
[
  {
    "type": "free",
    "q": "What do `JSON.stringify` and `JSON.parse` do, and why does a JavaScript object need one of them before it is sent to a server?",
    "model": "*A JavaScript object lives in memory — it has methods, prototypes, references. You cannot transmit it over a network.* You must serialize it into a string. `JSON.stringify(myObj)` turns the object into a JSON string (serialize; `typeof myJSON` is `\"string\"`). `JSON.parse(jsonStr)` turns a JSON string back into an object (deserialize), after which `parsed.name` works again.",
    "points": ["an object in memory cannot travel as is (methods, prototypes, references)", "`JSON.stringify`: object to string, called serializing", "`JSON.parse`: string to object, called deserializing", "the result of `stringify` is of type string"],
    "rows": 4,
    "explain": "Slide 28 adds *Name/value pairs are always stored as strings*. That is true of web storage; after `JSON.parse`, a JSON number such as `22` comes back as a number."
  }
]
```

## Lecture 3: APIs, GET and POST, REST

From lecture 3, slides 49–53: the RESTful API server principles.

```quiz
[
  {
    "type": "free",
    "q": "(medium) Name REST's five constraints and give one example or benefit of each.",
    "model": "REST is *an architectural style or set of constraints for API communication*, not an architectural pattern (slide 48).\n1. **Client–Server**: *Separation of concerns*: the client handles the UI, the server data and business logic; GitHub's web, mobile and CLI clients use the same APIs.\n2. **Stateless**: *Each request contains all the info needed; server doesn't store session state*: ask for page 51, never \"give me the next page\".\n3. **Cacheable**: the server defines whether a response is cacheable *via HTTP headers like Cache-Control, ETag, Expires*.\n4. **Uniform Interface (core constraint)**: each resource has a unique URL; *Nouns (resources) are always in the URL*, *Verbs (actions) are always HTTP methods*.\n5. **Layered System**: clients don't know whether they talk to the origin server or an intermediary, e.g. AWS API Gateway.",
    "points": ["Client–Server: separation of concerns (UI vs data and logic)", "Stateless: each request carries all the info; no session state on the server", "Cacheable: the server marks responses cacheable via headers such as Cache-Control", "Uniform Interface, the core constraint: URIs name resources, nouns in the URL, verbs as HTTP methods", "Layered System: the client cannot tell the origin server from an intermediary", "one example per constraint (GitHub, page 51, AWS API Gateway, …)"],
    "rows": 10,
    "explain": "Slide 53 pairs each with a benefit: separation and evolvability, scalability and reliability, performance, simplicity and predictability, flexibility and security. It also lists Code-on-Demand, REST's optional sixth constraint, which slide 49's five leave out."
  }
]
```

### Five constraints, top to bottom

Uniform Interface is the one the slide marks *core constraint*.

```diagram
{ "type": "layers", "title": "REST's five constraints (slide 49)", "nodes": [ { "id": "c1", "label": "1. Client–Server", "sub": "separation of concerns" }, { "id": "c2", "label": "2. Stateless", "sub": "each request contains all the info needed" }, { "id": "c3", "label": "3. Cacheable", "sub": "Cache-Control, ETag, Expires" }, { "id": "c4", "label": "4. Uniform Interface (core constraint)", "sub": "nouns in the URL, verbs are HTTP methods" }, { "id": "c5", "label": "5. Layered System", "sub": "origin server or intermediary?" } ], "hi": ["c4"], "caption": "REST is not an architectural pattern like Microservices or MVC (slide 48)." }
```

From lecture 3, slides 34–39: the two most common HTTP methods.

```quiz
[
  {
    "type": "free",
    "q": "Compare GET and POST. Which one is secure?",
    "model": "- GET: *the query string (name/value pairs) is sent in the URL*; it *can be cached*, *remain[s] in the browser history* and *can be bookmarked*; it has length restrictions (*maximum URL length is 2048 characters*); *Only ASCII characters allowed*; *should only be used to request data*.\n- POST: the data *is stored in the request body of the HTTP request (not part of the URL)*; *never cached*, *cannot be bookmarked*, not in history; *no restrictions* on length; binary data allowed.\n- Security: *none!* *The data is not encrypted by default when sent over GET or POST* (slide 38). POST is only *a little safer*; never send passwords with GET.",
    "points": ["GET sends the query string in the URL; POST sends data in the request body", "GET can be cached, bookmarked and stays in history; POST cannot", "GET has a length limit (2048 characters on the slide); POST has none", "GET only ASCII; POST allows binary", "neither is secure; use encryption (https); POST is only a little safer"],
    "rows": 7,
    "explain": "The 2048-character and ASCII-only rows are the slide's answers. In practice the 2048 limit was an old browser limit (modern ones allow far longer URLs), and non-ASCII characters are percent-encoded rather than forbidden."
  }
]
```

From lecture 3, slides 31–32: the anatomy of web APIs.

```quiz
[
  {
    "type": "free",
    "q": "Name the four parts of a web API, with one detail for each.",
    "model": "1. **Headers**: additional details for the communication; request headers such as *API-key*, response headers such as *status* and *content-type*.\n2. **Data**: *(also called body or message) contains info you want to send to the server*.\n3. **Endpoint**: *the URL where the API Server is listening to*.\n4. **HTTP methods**: GET gets, POST creates, PUT updates, DELETE deletes a resource.",
    "points": ["Headers, with a request example (API-key) or a response example (status, content-type)", "Data, also called body or message", "Endpoint: the URL where the API server listens", "HTTP methods: GET get, POST create, PUT update, DELETE delete"],
    "rows": 5,
    "explain": "Keep the slide's order: headers, data, endpoint, methods."
  }
]
```

## Lecture 4: Node.js and the restaurant

From lecture 4, slides 12–23: the restaurant analogy.

```quiz
[
  {
    "type": "free",
    "q": "Explain blocking and non-blocking with the restaurant analogy. Which example is Node.js, and what goes wrong in a synchronous system with 100 concurrent requests?",
    "model": "- *Example 1: single threaded non-blocking (asynchronous)*: *Same waiter can serve multiple tables*; he takes table 2's order while table 1's meal cooks.\n- *Example 2: single threaded blocking (synchronous)*: the waiter *waits for the chief to prepare the meal then (and only then) takes another order*. The problem: *We are not utilizing our resources (the waiter) efficiently*.\n- *Example 3: multi-threaded*: *Multiple waiters*, *Each dedicated to a single table only*.\n- Node.js is Example 1: *Single threaded, Asynchronous(non blocking) ... ( one waiter serves everyone)*.\n- With 100 concurrent requests, a synchronous system *has to create 100 threads! ( 100 waiters!!)*.",
    "points": ["Example 1: one waiter, non-blocking: serves other tables while the kitchen cooks", "Example 2: one waiter, blocking: waits at the kitchen; the waiter is not used efficiently", "Example 3: one waiter (thread) per table", "Node.js is Example 1, single threaded and non-blocking", "100 concurrent requests need 100 threads in a synchronous system"],
    "rows": 7,
    "explain": "*Single threaded* describes Node's JavaScript event loop; Node also runs file-system work on a background thread pool, which is what frees the main thread. The exam keeps the slide's wording."
  }
]
```

### The three restaurants side by side

```diagram
{ "type": "grid", "title": "Restaurant examples (slides 15–18)", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "Waiters", "row": 0, "col": 1 }, { "id": "h2", "label": "Waits at kitchen?", "row": 0, "col": 2 }, { "id": "h3", "label": "Name on slide 18", "row": 0, "col": 3 }, { "id": "r1", "label": "Example 1", "row": 1, "col": 0 }, { "id": "r1a", "label": "one", "row": 1, "col": 1 }, { "id": "r1b", "label": "no", "row": 1, "col": 2 }, { "id": "r1c", "label": "single threaded non-blocking", "row": 1, "col": 3 }, { "id": "r2", "label": "Example 2", "row": 2, "col": 0 }, { "id": "r2a", "label": "one", "row": 2, "col": 1 }, { "id": "r2b", "label": "yes", "row": 2, "col": 2 }, { "id": "r2c", "label": "single threaded blocking", "row": 2, "col": 3 }, { "id": "r3", "label": "Example 3", "row": 3, "col": 0 }, { "id": "r3a", "label": "one per table", "row": 3, "col": 1 }, { "id": "r3b", "label": "yes, each", "row": 3, "col": 2 }, { "id": "r3c", "label": "multi-threaded", "row": 3, "col": 3 } ], "hi": ["r1", "r1a", "r1b", "r1c"], "caption": "JavaScript(nodejs) is Single threaded Asynchronous(non blocking) just like the restaurant in Example 1 (slide 19)." }
```

### The blocking waiter in motion

Example 2: the waiter stands at the kitchen until table 1's meal is ready, and table 2 waits. With predict on, name the next table served.

```widget
node-server-play
{ "mode": "restaurant", "example": 2, "predict": true }
```

From lecture 4, slide 12: why Node.js.

```quiz
[
  {
    "type": "free",
    "q": "List the steps PHP or ASP takes to handle a file request, then the steps Node.js takes.",
    "model": "PHP or ASP: 1. Sends the task to the computer's file system. 2. Waits while the file system opens and reads the file. 3. Returns the content to the client. 4. Ready to handle the next request.\nNode.js: 1. Sends the task to the computer's file system. 2. Ready to handle the next request. 3. When the file system has opened and read the file, the server returns the content to the client.\n*Node.js eliminates the waiting, and simply continues with the next request.* *Node.js runs single-threaded, non-blocking, asynchronously programming, which is very memory efficient.*",
    "points": ["PHP: send, wait while the file is read, return, then ready for the next request (four steps)", "Node: send, ready for the next request, return the content when the file has been read (three steps)", "Node eliminates the waiting step", "single-threaded, non-blocking, memory efficient"],
    "rows": 6,
    "explain": "The difference is where \"ready for the next request\" sits: last for PHP, second for Node."
  }
]
```

## Lecture 5: AJAX, CORS and the database connection

From lecture 5, slides 7–9: AJAX on the client side.

```quiz
[
  {
    "type": "free",
    "q": "Name, in order, the four client-side steps of an AJAX call with `XMLHttpRequest`.",
    "model": "1. Create an XMLHttpRequest object, *just like the way we created Date object*: `let xhttp = new XMLHttpRequest();`\n2. Specify the function that handles the response: `xhttp.onreadystatechange = function () { if (this.readyState == 4 && this.status == 200) { … } };`\n3. Open the request: `xhttp.open(method, url, Async or sync);`\n4. Send it: `xhttp.send();` *We just send it and carry on (we don't wait if we sent it asynchronously)*.",
    "points": ["1 create the object with `new XMLHttpRequest()`", "2 assign the handler to `onreadystatechange`", "3 `open(method, url, async)`", "4 `send()`; with async true the script does not wait"],
    "rows": 5,
    "explain": "Slide 12's client calls `send()` before assigning the handler. That still works for an asynchronous request because the state changes fire later, but the slide's numbered order is the one to write."
  }
]
```

From lecture 5, slide 8 and lecture 6, slide 55: the readyState values.

```quiz
[
  {
    "type": "free",
    "q": "List the XHR readyState values 0 to 4 with their meanings. Why does the handler test `status == 200` as well as `readyState == 4`?",
    "model": "- **0 (UNSENT)**: *The XHR object has been created, but open() has not been called yet.*\n- **1 (OPENED)**: *open() has been called.*\n- **2 (HEADERS_RECEIVED)**: *send() has been called, and the headers of the response are available.*\n- **3 (LOADING)**: *The response is being received.* It can repeat *if the server is sending a large size of response in multiple chunks*.\n- **4 (DONE)**: *The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred.*\nDONE also covers failures, so the handler checks `this.readyState == 4 && this.status == 200` before using `responseText`.",
    "points": ["0 UNSENT and 1 OPENED", "2 HEADERS_RECEIVED: send() called, headers available", "3 LOADING, possibly several times for a large chunked response", "4 DONE: complete, success or error", "status 200 is tested because DONE is reached on errors too"],
    "rows": 7,
    "explain": "Lecture 6, slide 55 marks the w3schools table (*2: request received*, *3: processing request*) as *not accurate*; the instructor's names match the XHR constants in the browser."
  }
]
```

### readyState step by step

The handler box lights on every change; its `readyState === 4 && status === 200` test passes only on the last one. Predict each readyState before it appears.

```widget
xhr-play
{ "method": "GET", "async": true, "status": 200, "predict": true }
```

From lecture 5, slides 16–21: CORS, the Same-Origin Policy and the preflight question.

```quiz
[
  {
    "type": "free",
    "q": "(medium) What is CORS, what is the Same-Origin Policy, and what is a preflight request? Say how a Node server allows another origin.",
    "model": "*CORS is a security feature implemented in web browsers and is configured by the contacted server in the response's header to the AJAX requests made via the browser.* *By default, web browsers enforce a security policy called \"Same-Origin Policy\" (SOP)*: the HTML page sending the AJAX request must be hosted in the same origin as the server scripts answering it. *An origin is ( supposed to be) defined by the combination of domain, protocols and ports ( 80 is the default for HTTP, 443 for HTTPS)*. *browsers will block the Cross-Origin Requests unless the server being contacted explicitly allows it*: the server adds `\"Access-Control-Allow-Origin\": \"*\"` (`*` = everyone) to `writeHead`. A preflight is an `OPTIONS` request the browser sends first, for example before a POST with `Content-Type: application/json`, to ask whether the method and headers are allowed; the server answers with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`. A form-urlencoded or plain-text POST needs no preflight. Postman is not a browser, so CORS does not apply to it.",
    "points": ["CORS: implemented in browsers, configured by the contacted server in the response header", "SOP: by default page and server scripts must share one origin (domain, protocol, port)", "the server allows origins with `Access-Control-Allow-Origin` (`*` = everyone)", "preflight: an OPTIONS request first, asking whether the method and headers are allowed (`Allow-Methods`, `Allow-Headers`)", "triggered by e.g. `Content-Type: application/json`, not by form-urlencoded or text/plain", "Postman ignores CORS: it is not a browser"],
    "rows": 9,
    "explain": "Slide 21 strikes through a ChatGPT sentence saying CORS *allows for secure communication*: CORS encrypts nothing and authenticates no one; it is a browser rule the server relaxes. Slide 18's footnote also mentions forms and the address bar; those are not blocked by CORS, so that footnote is not a key point."
  }
]
```

### A preflight before a JSON POST

Messages 2 and 3 are the preflight; the real POST, message 4, is sent only if they allow it.

```diagram
{ "type": "sequence", "title": "Preflight", "nodes": [ { "id": "page", "label": "Page (origin A)", "kind": "lane" }, { "id": "browser", "label": "Browser", "kind": "lane" }, { "id": "api", "label": "API server (origin B)", "kind": "lane" } ], "edges": [ { "from": "page", "to": "browser", "label": "POST, application/json" }, { "from": "browser", "to": "api", "label": "OPTIONS (preflight)" }, { "from": "api", "to": "browser", "label": "Allow-Origin / -Methods / -Headers" }, { "from": "browser", "to": "api", "label": "POST" }, { "from": "api", "to": "browser", "label": "response + Allow-Origin" }, { "from": "browser", "to": "page", "label": "responseText" } ], "hi": ["2", "3"], "caption": "CORS is a security feature implemented in web browsers and is configured by the contacted server in the response's header (lecture 5, slide 18)." }
```

### The same request, allowed or blocked

Change `Access-Control-Allow-Origin` or the content type and predict whether a preflight goes out and whether the script gets the response.

```widget
cors-play
{ "contentType": "application/json", "method": "POST", "allowOrigin": "*", "predict": true }
```

From lecture 5, slides 24 and 28: the POST server.

```quiz
[
  {
    "type": "free",
    "q": "How does a Node server read the body of a POST request?",
    "model": "The body is *extracted from the POST request in chunks*. `req.on(\"data\", function (chunk) { body += chunk; })` appends each chunk as it arrives; `req.on(\"end\", function () { … })` runs once *all data from client has arrived to server*. Inside the end handler the server parses the body (for form-urlencoded data, `new URLSearchParams(body).get(\"name\")`) and only then sends the reply with `res.end()`.",
    "points": ["the body arrives in chunks", "`req.on(\"data\", …)` appends each chunk to a string", "`req.on(\"end\", …)` runs when all data has arrived", "parse the body, e.g. with `URLSearchParams`, and reply inside the end handler"],
    "rows": 5,
    "explain": "For POST, *the query string sits in the body of the request* (slide 23), so it is not in `req.url` at all."
  }
]
```

From lecture 5, slides 43–44 and Lab 5: connecting to MySQL.

```quiz
[
  {
    "type": "free",
    "q": "Why must the database credentials and the `mysql` code stay on the server, never in the page's JavaScript?",
    "model": "*mysql is an external module and needs to be installed* (`npm install mysql`); it runs in Node, not in a browser. Code sent to the browser is visible to every visitor, so a password in it would leak. The page calls an API endpoint instead, and the server runs `con.query(sql, callback)` with credentials only it knows. The server's DB user gets only the privileges it needs: Lab 5 asks for a read-only, SELECT-only user so that DELETE, DROP, CREATE or UPDATE cannot run.",
    "points": ["`mysql` is an external Node module (`npm install mysql`), not a browser feature", "client-side code is visible to every user, so credentials would leak", "the browser calls the API; the server runs `con.query`", "least privilege: a DB user limited to what it must do, e.g. SELECT only"],
    "rows": 5,
    "explain": "The `mysql` package is no longer maintained; `mysql2` is the usual replacement with the same `createConnection`, `connect` and `query` calls."
  }
]
```

## Lecture 6: idempotency and promises

From lecture 6, slide 3: PUT, PATCH and POST.

```quiz
[
  {
    "type": "free",
    "q": "What does idempotent mean? Which of PUT, POST and PATCH is idempotent, and which method fits saving an edited clinic contact record as a whole?",
    "model": "*Idempotent: can be applied multiple times without changing the result.* *PUT is idempotent, POST is not*: *calling PUT once or several times successively has the same effect (that is no side effect), whereas successive identical POST requests may have additional effects, e.g. leading to placing an order several times.* *PUT: replacing an object entirely with something new*; *PATCH: updating only a property of an object*. Saving the whole edited record replaces it, so it is a PUT.",
    "points": ["idempotent: applying it several times gives the same result as once", "PUT is idempotent; POST is not", "repeated POSTs can repeat a side effect, e.g. place an order twice", "PUT replaces the whole object; PATCH updates one property", "saving the whole edited record is PUT"],
    "rows": 5,
    "explain": "PATCH can be written either way; the slide pairs only PUT (yes) and POST (no)."
  }
]
```

From lecture 6, slides 13–17: the states of a promise.

```quiz
[
  {
    "type": "free",
    "q": "What are a promise's three states, and what does \"settled\" mean? When does the executor run?",
    "model": "*A promise has 3 states*: **Pending** (*You don't know*), **Resolved (Fulfilled)**, **Rejected**. Fulfilled and rejected together are **settled** (slide 14); once settled, the state does not change. The executor *Gets executed immediately upon creation of the promise object*. *resolve and reject invoke handlers asynchronously and mutually exclusive And run only once*, and *The then() method itself returns a promise*.",
    "points": ["pending, fulfilled (resolved), rejected", "settled = fulfilled or rejected; it never changes after that", "the executor runs immediately when the promise is created", "handlers run asynchronously, only one of them, only once", "`.then()` returns a promise"],
    "rows": 5,
    "explain": "Slide 37's DevTools shows `[[PromiseStatus]]: \"resolved\"`; current Chrome calls it `[[PromiseState]]: \"fulfilled\"`."
  }
]
```

From lecture 6, slides 31, 43, 46, 48 and 50–51: the three methods.

```quiz
[
  {
    "type": "free",
    "q": "(medium) Explain `.then`, `.catch` and `.finally`. What happens to the next promise when a handler returns a value, and when it throws? Give a short example.",
    "model": "- `.then(success, failure)`: *The first argument of .then is a function that: runs when the Promise is resolved, and receives the result*; the second runs when it is rejected and receives the error.\n- Slide 31's core rule: *Returning a value is defined as success ( passing to resolve of new promise)*; *Throwing an error is defined as failure ( passing to reject of new promise)*.\n- `.then(null, errorHandlingFunction)` *Is the same as* `.catch(errorHandlingFunction)`.\n- `.finally(f)` *is similar to* `.then(f, f)`: *it always runs when the promise is settled*. It does not handle a rejection: slide 51 shows *Promise setteled* on the page and still `Uncaught (in promise) Error` in the console.\n- Example: `Promise.resolve(2).then(n => n * 5).then(n => { throw new Error(\"too big\"); }).catch(e => console.log(e.message)).finally(() => console.log(\"done\"))` prints `too big` then `done`.",
    "points": ["`.then` takes a success handler and an optional failure handler", "returning a value fulfils the next promise; throwing rejects it", "`.catch(f)` is the same as `.then(null, f)`", "`.finally(f)` runs on either outcome but does not handle the rejection", "an unhandled rejection shows `Uncaught (in promise)` in the console", "a correct short example"],
    "rows": 9,
    "explain": "Slide 50 says the default would *terminate the script*. A browser only reports the unhandled rejection in the console and keeps running; Node.js 15 and later does stop the process."
  }
]
```

From lecture 6, slide 52: async and await.

```quiz
[
  {
    "type": "free",
    "q": "What do `async` and `await` do?",
    "model": "They are *built on top of promises, allowing you to write asynchronous code that looks more like synchronous code.* *async: When a function is declared as async, it automatically returns a promise.* *await: This is used inside async functions to wait for a promise to resolve or reject.* A rejected `await` throws inside the function, so errors are caught with `try`/`catch`.",
    "points": ["built on top of promises; code reads like synchronous code", "an `async` function always returns a promise", "`await` (inside an async function) waits for a promise to resolve or reject", "errors from `await` are caught with `try`/`catch`"],
    "rows": 4,
    "explain": "Only the async function pauses at `await`; the code after the call keeps running (output-order drill, program 20)."
  }
]
```

## Lecture 7: tables and keys

From lecture 7, slides 19–23 and 66–68: the clinic's patient and visit tables.

```quiz
[
  {
    "type": "free",
    "q": "In a clinic database with `Patient` and `Visit` tables, explain primary key, foreign key and the 1:M, 1:1 and M:M relationships. What does CRUD stand for?",
    "model": "*Patient_ID in the Patient table is unique and is called Primary key*; Visit_ID is the Visit table's. *Patient_ID in the Visit table is called Foreign key. A primary key of another table presents in this table.* *One patient can visit multiple times*: a 1:M relationship from Patient to Visit. 1:1 would mean a patient could visit *only* once, which a UNIQUE foreign key column enforces. M:M (authors and books) needs an *associative entity* table holding both foreign keys, so it becomes two 1:M relationships. CRUD: **C**reate, **R**ead, **U**pdate, **D**elete.",
    "points": ["primary key: unique for each row (Patient_ID in Patient)", "foreign key: a primary key of another table, present in this table (Patient_ID in Visit)", "1:M: one patient row relates to many visit rows", "1:1 when the foreign key is UNIQUE; M:M through an associative table", "CRUD = Create, Read, Update, Delete"],
    "rows": 6,
    "explain": "Lecture 7's SQL is out of scope for writing; reading a `CREATE TABLE` with `PRIMARY KEY` and `FOREIGN KEY` lines is in scope."
  }
]
```
