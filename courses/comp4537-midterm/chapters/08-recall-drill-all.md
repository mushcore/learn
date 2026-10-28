---
title: "Recall drill: every fixed list in lectures 1 to 7 (closed book)"
minutes: 25
---

Closed book: answer every block from memory first, with no slides, notes or cheat sheet open, then check yourself against the explanations and the reference table at the end. The lists are short and the exam asks them in the slide's words and order, so a miss here is cheap to fix; run the drill again in exam week until every block comes back clean.

## Lecture 1: primitives, falsy values, let vs var, hosting kinds, the box model, position and combinators

```quiz
[
  {
    "type": "fill",
    "q": "Slide 113: the six primitive data types of ECMA6 in the slide's order, then the one type that is not primitive. Type each name in lower case.",
    "code": "1. ___        true and false\n2. ___        an intentionally empty value\n3. ___        basically means uninitialized\n4. ___        42 or 3.14159\n5. ___        text such as a greeting\n6. ___        new in ECMAScript 2015; unique and immutable\n// plus one non-primitive type (arrays are this type too)\n___",
    "answer": ["boolean", "null", "undefined", "number", "string", "symbol", "object"],
    "explain": "*There are six primitive data types and one object type in Javascript ECMA6*: Boolean, null, undefined, Number, String, Symbol, then Objects; *Arrays are also of type objects*, so `typeof []` is `\"object\"`. Modern JavaScript adds a seventh primitive, BigInt (ES2020); the slide's count is the ES6 one and the exam keys six. [Six primitives](#/comp4537-l1/js-values-and-types)"
  },
  {
    "type": "fill",
    "q": "Slide 114's tip: the six falsy values, in the slide's order, written as JavaScript writes them.",
    "code": "// each one means false in the condition of an if statement\n___     uninitialized\n___     empty on purpose\n___     a number\n___     a boolean\n___     not a number\n___     an empty string (two single quotes)",
    "answer": ["undefined", "null", "0", "false", "NaN", "''"],
    "explain": "*undefined, null, 0, false, NaN, '' (empty string) are all falsy*, which *means in the condition part of if statement all of them mean false*. `NaN` is case-sensitive: `nan` is just an undeclared name. [== vs === and falsy values](#/comp4537-l1/js-values-and-types)"
  },
  {
    "type": "match",
    "q": "Slides 22–23: match each kind of hosting plan to its description.",
    "pairs": [
      ["Shared", "your site sits on one server with hundreds of other sites, all sharing memory, disk, CPU and the database server; cheapest, maybe slowest"],
      ["VPS", "still a shared server, but you get your own virtual private server with fewer sites on it, likely faster"],
      ["Dedicated server", "a single physical machine dedicated to your website; you control all the CPU, RAM and hard disk"],
      ["Cloud hosting", "multiple machines act as one system, so servers work together to handle high traffic or spikes"]
    ],
    "explain": "Slide 21 names the order: *Shared vs VPS vs Dedicated vs Cloud Hosting*. VPS is a Virtual Private Server (the slide's \"prove\" is a typo). For this course *a right shared plan would suffice*, provided it gives a relational database server, several Node apps at once and an SSL certificate. [The four kinds of hosting](#/comp4537-l1/devtools-and-hosting)"
  },
  {
    "type": "match",
    "q": "Slide 134's let vs var table: match each row to what the `var` column says.",
    "pairs": [
      ["Scope", "Function scope"],
      ["Hoisting", "Will hoist declaration to top of function"],
      ["Adding to global object (window)", "Global variable declared by var add to window"],
      ["strict mode", "Re-Declaration is ok"]
    ],
    "explain": "The `let` column: Block scope; the hoisting cell is blank (slide 132: *JS engine will NOT hoist variables declared by \"let\"*); *let does not add property to global window*; strict mode: *No declaration*, meaning no re-declaration. Strictly, `let` is hoisted into the temporal dead zone, which is why reading it early throws a ReferenceError. [var vs let](#/comp4537-l1/scope-and-hoisting)"
  },
  {
    "type": "reorder",
    "q": "Slide 177: put the four parts of the CSS box model in order from the inside out.",
    "lang": "text",
    "lines": [
      "Content: where text and images appear",
      "Padding: clears an area around the content; transparent",
      "Border: goes around the padding and content",
      "Margin: clears an area outside the border; transparent"
    ],
    "explain": "Content, padding, border, margin. Slide 178's `#div2` uses width 300px, padding 20px, border 10px, margin 30px; slide 179 draws the same boxes nested with Margin outermost. [The box model](#/comp4537-l1/css-box-model-display-position)"
  },
  {
    "type": "match",
    "q": "Slide 184: match each value of the `position` property to how the element is placed.",
    "pairs": [
      ["static", "Default value. Elements render in order, as they appear in the document flow"],
      ["fixed", "positioned relative to the browser window"],
      ["absolute", "positioned relative to its nearest positioned ancestor"],
      ["relative", "offset from where it would sit in the normal flow"],
      ["sticky", "scrolls with the page until it reaches an offset, then stays put"]
    ],
    "explain": "Slide 184 lists *static, relative, absolute, fixed, or sticky* but defines only `static` and `fixed`; the other three descriptions are worked out, not on the slide. Its example `style=\"left:20px ; position: absolute;\"` uses `absolute` without defining it. [display, position and units](#/comp4537-l1/css-box-model-display-position)"
  },
  {
    "type": "match",
    "q": "Slide 185: match each combinator to its name.",
    "pairs": [
      ["div p  (a space)", "descendant selector"],
      [">", "child selector"],
      ["+", "adjacent sibling selector"],
      ["~", "general sibling selector"]
    ],
    "explain": "The slide's example `div p { background-color: yellow; }` *selects all <p> elements inside <div> elements*; then *There are more Combinators such as child selector (>), adjacent sibling selector (+), general sibling selector (~)*. [Combinators and specificity](#/comp4537-l1/css-selectors-and-specificity)"
  }
]
```

## Lecture 2: three architectures, the monolith's three steps, the n-tier layers, reliability vs robustness vs resilience, the localStorage API

```quiz
[
  {
    "type": "reorder",
    "q": "Slide 9: the three architectures that matter, in the slide's order.",
    "lang": "text",
    "lines": ["Monolithic", "Layered", "Microservices"],
    "explain": "*Monolithic → Layered → Microservices*: one deployable unit, then separated layers, then *a collection of loosely coupled, independently deployable services*. [Three architectures](#/comp4537-l2/architecture-and-its-patterns)"
  },
  {
    "type": "reorder",
    "q": "Slide 11: put the monolith's steps to add a new feature in order.",
    "lang": "text",
    "lines": ["shut down entire application", "add the new feature", "(may need to) recompile everything before deployment"],
    "explain": "1- shut down, 2- add, 3- (may need to) recompile everything. That is why a monolith is *Best for: prototyping, MVPs, apps that won't need frequent independent updates*. [Monolithic architecture](#/comp4537-l2/architecture-and-its-patterns)"
  },
  {
    "type": "reorder",
    "q": "Slide 13: put the four layers of the layered (n-tier) architecture in the slide's order, starting from the user.",
    "lang": "text",
    "lines": ["Presentation layer (UI layer)", "Business layer (business logic)", "Application layer", "Data access layer"],
    "explain": "Presentation, Business, Application, Data access: *Layers = functional elements*. Slide 12's question is how to change the database without rewriting the UI; separating the layers is the answer. [Layered architecture](#/comp4537-l2/architecture-and-its-patterns)"
  },
  {
    "type": "match",
    "q": "Slide 13: match each layer to the slide's example.",
    "pairs": [
      ["Presentation layer", "form page"],
      ["Business layer", "decision making, routing requests"],
      ["Application layer", "libraries"],
      ["Data access layer", "databases"]
    ],
    "explain": "Presentation: *interaction with the end-user is handled*; Business: *controls the application's logic*; Application: *where the core functions of the app are implemented*; Data access: *where access and retrieval of data are handled*. [Layered architecture](#/comp4537-l2/architecture-and-its-patterns)"
  },
  {
    "type": "match",
    "q": "Slide 16: match each word to its definition.",
    "pairs": [
      ["Reliability", "works correctly and consistently under normal conditions"],
      ["Robustness", "handles bad input or unexpected conditions safely"],
      ["Resilience", "continues essential service or recovers after disruption"]
    ],
    "explain": "The slide's short forms: *Reliable = works normally*, *Robust = handles bad conditions*, *Resilient = survives and recovers from failure*. Its robustness example: invalid JSON returns 400 Bad Request. [Reliability, robustness, resilience](#/comp4537-l2/architecture-and-its-patterns)"
  },
  {
    "type": "match",
    "q": "Slide 34: match each `localStorage` method to what it does.",
    "pairs": [
      ["setItem(key, value)", "store a name/value pair"],
      ["getItem(key)", "retrieve the value, as a string"],
      ["removeItem(key)", "remove a single item"],
      ["clear()", "clear everything for this origin"]
    ],
    "explain": "*Name/value pairs are always stored as strings*, so an object goes in through `JSON.stringify` and comes out through `JSON.parse`; `getItem` on a missing key returns `null`. [Web storage](#/comp4537-l2/web-storage)"
  }
]
```

## Lecture 3: REST's five constraints, the GET vs POST table, the four parts of a web API, method and action

```quiz
[
  {
    "type": "reorder",
    "q": "Slide 49: put REST's five constraints in the slide's order.",
    "lang": "text",
    "lines": ["Client–Server", "Stateless", "Cacheable", "Uniform Interface", "Layered System"],
    "explain": "1. Client–Server, 2. Stateless, 3. Cacheable, 4. Uniform Interface (core constraint), 5. Layered System. Code-on-Demand appears only on slide 53's benefits list; it is REST's optional sixth constraint, not one of the five. [REST's five constraints](#/comp4537-l3/rest-principles)"
  },
  {
    "type": "text",
    "q": "Which of REST's five constraints does slide 49 mark as the core constraint?",
    "answer": ["Uniform Interface", "uniform interface", "the uniform interface"],
    "explain": "*4. Uniform Interface (core constraint)*: each resource has a unique URL, *Nouns (resources) are always in the URL*, *Verbs (actions) are always HTTP methods*. [REST's five constraints](#/comp4537-l3/rest-principles)"
  },
  {
    "type": "match",
    "q": "Slide 39: match each row of the GET vs POST table to what the GET column says.",
    "pairs": [
      ["BACK button / Reload", "Harmless"],
      ["Bookmarked", "Can be bookmarked"],
      ["Cached", "Can be cached"],
      ["History", "Parameters remain in browser history"],
      ["Restrictions on data length", "Yes: the data goes in the URL, and the maximum URL length is 2048 characters"],
      ["Restrictions on data type", "Only ASCII characters allowed"],
      ["Security", "less safe than POST because the data is part of the URL; never use it for passwords"],
      ["Visibility", "Data is visible to everyone in the URL"]
    ],
    "explain": "The slide's security row is headed *none are secure!*: neither method encrypts; that is what https is for. HTTP itself sets no URL limit (2048 was an old browser limit) and non-ASCII characters are percent-encoded, but the exam keys the slide's 2048 and ASCII. [GET vs POST](#/comp4537-l3/get-vs-post)"
  },
  {
    "type": "match",
    "q": "Slide 39 again: match each row to what the POST column says.",
    "pairs": [
      ["BACK button / Reload", "Data will be re-submitted (the browser should alert the user)"],
      ["Bookmarked", "Cannot be bookmarked"],
      ["Cached", "Not cached"],
      ["History", "Parameters are not saved in browser history"],
      ["Restrictions on data length", "No restrictions"],
      ["Restrictions on data type", "No restrictions. Binary data is also allowed"],
      ["Security", "a little safer than GET: parameters are not stored in browser history or web server logs"],
      ["Visibility", "Data is not displayed in the URL"]
    ],
    "explain": "POST's data sits in the request body, not the URL, which drives every POST cell. *POST is a little safer*, not secure: slide 38's answer to which method is secure is *none!*. [GET vs POST](#/comp4537-l3/get-vs-post)"
  },
  {
    "type": "reorder",
    "q": "Slides 31–32: put the four parts of a web API in the slide's numbering.",
    "lang": "text",
    "lines": [
      "Headers: the additional details for communication between client and server",
      "Data: also called body or message; the info you send to the server",
      "Endpoint: the URL where the API server is listening",
      "HTTP Methods: the method of communication between client and server"
    ],
    "explain": "1- Headers (request: API-key, count, pageNo; response: status, content-type), 2- Data, 3- Endpoint, 4- HTTP Methods. [Anatomy of a web API](#/comp4537-l3/anatomy-of-a-web-api)"
  },
  {
    "type": "match",
    "q": "Slide 32: match each HTTP method to its action.",
    "pairs": [
      ["GET", "Get resource from the server"],
      ["POST", "Create resource to the server"],
      ["PUT", "Update existing resource on the server"],
      ["DELETE", "Delete existing resource from the server"]
    ],
    "explain": "Get, Create, Update, Delete; the callout adds *The two most common HTTP methods are: GET and POST*. Lecture 6 splits update into PUT (replace the whole object) and PATCH (one property). [Anatomy of a web API](#/comp4537-l3/anatomy-of-a-web-api)"
  }
]
```

## Lecture 4: PHP's four steps vs Node's three, the restaurant examples, the url.parse fields

```quiz
[
  {
    "type": "reorder",
    "q": "Slide 12: how PHP or ASP handles a file request. Put the steps in order.",
    "lang": "text",
    "lines": [
      "Sends the task to the computer's file system.",
      "Waits while the file system opens and reads the file.",
      "Returns the content to the client.",
      "Ready to handle the next request."
    ],
    "explain": "Four steps, with a wait in the middle: the server is blocked until the file is read. [Node handles a file request in three steps](#/comp4537-l4/servers-and-server-side-scripting)"
  },
  {
    "type": "reorder",
    "q": "Slide 12: how Node.js handles a file request. Put the steps in order.",
    "lang": "text",
    "lines": [
      "Sends the task to the computer's file system.",
      "Ready to handle the next request.",
      "When the file system has opened and read the file, the server returns the content to the client."
    ],
    "explain": "*Node.js eliminates the waiting, and simply continues with the next request.* The slide calls Node *single-threaded, non-blocking*; in fact the JavaScript runs on one thread while libuv reads the file on a background thread pool. [Node handles a file request in three steps](#/comp4537-l4/servers-and-server-side-scripting)"
  },
  {
    "type": "match",
    "q": "Slides 15–18: match each restaurant example to slide 18's label.",
    "pairs": [
      ["Example 1: the same waiter serves multiple tables", "single threaded non-blocking (asynchronous)"],
      ["Example 2: the same waiter waits for the meal before taking another order", "single threaded blocking (synchronous)"],
      ["Example 3: multiple waiters, each dedicated to a single table", "multi-threaded"]
    ],
    "explain": "Slide 19: Node is *just like the restaurant in Example 1 ( one waiter serves everyone)*. Slide 23: a synchronous system with 100 concurrent requests *has to create 100 threads! ( 100 waiters!!)*. [The restaurant analogy](#/comp4537-l4/node-and-the-restaurant)"
  },
  {
    "type": "match",
    "q": "Slide 38 parses `http://localhost:8888/default.htm?name=John&age=23` with `url.parse(adr, true)`. Match each property of `q` to what it returns.",
    "pairs": [
      ["q.host", "'localhost:8888'"],
      ["q.pathname", "'/default.htm'"],
      ["q.search", "'?name=John&age=23'"],
      ["q.query", "an object: { name: John, age: 23 }"],
      ["q.query.name", "'John'"]
    ],
    "explain": "`host` keeps the port, `pathname` starts with the slash, `search` keeps the `?`, and the `true` argument turns `query` into an object. Query values are strings, so `age` is really `'23'`. [url.parse and the query string](#/comp4537-l4/url-and-query-strings)"
  }
]
```

## Lecture 5: the four XHR steps, readyState 0 to 4, the status codes, the origin's parts and default ports

```quiz
[
  {
    "type": "reorder",
    "q": "Slides 7–9: put the four client-side steps of an AJAX call in order.",
    "lang": "text",
    "lines": [
      "Create an XMLHttpRequest object: new XMLHttpRequest()",
      "Specify the function that handles the response: onreadystatechange",
      "Open the AJAX request: open(method, url, async)",
      "Send it: send()"
    ],
    "explain": "1- create, 2- the handler, 3- `open`, 4- `send`. With the async argument true, *we just send it and carry on (we don't wait)*. The handler is set before `send` so it is in place when the response arrives. [XMLHttpRequest in four steps](#/comp4537-l5/xmlhttprequest-four-steps)"
  },
  {
    "type": "fill",
    "q": "Slide 8: name each value of `readyState`, in capitals with underscores as the slide writes them.",
    "code": "0  ___\n1  ___\n2  ___\n3  ___     // can repeat while a large response arrives in chunks\n4  ___",
    "answer": ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"],
    "explain": "0 UNSENT: created, `open()` not called yet; 1 OPENED: `open()` called; 2 HEADERS_RECEIVED: `send()` called, response headers available; 3 LOADING: `responseText` filling in; 4 DONE: success (2xx) or an error. Lecture 6 slide 55 replaces the w3schools wording (\"request received\", \"processing request\") with these names. [readyState 0 to 4](#/comp4537-l5/xmlhttprequest-four-steps)"
  },
  {
    "type": "match",
    "q": "Slide 8: match each status code or group to its meaning.",
    "pairs": [
      ["200", "OK"],
      ["3xx", "generally used for redirection"],
      ["4xx", "client error: something wrong with your request"],
      ["403", "Forbidden"],
      ["404", "Not Found"],
      ["5xx", "server error: something wrong with the server"]
    ],
    "explain": "The handler's test is `this.readyState == 4 && this.status == 200`. Lecture 4 slide 42 says the same of 4xx: *client request was not valid*, for example a file which did not exist, answered with 404. [The status codes](#/comp4537-l5/xmlhttprequest-four-steps)"
  },
  {
    "type": "fill",
    "q": "Slide 18, footnote 3: what makes an origin, in the footnote's order (singular, lower case), and the two default ports.",
    "code": "origin = ___ + ___ + ___\ndefault port for HTTP:  ___\ndefault port for HTTPS: ___",
    "answer": ["domain", "protocol", "port", "80", "443"],
    "explain": "*An origin is ( supposed to be) defined by the combination of domain, protocols and ports ( 80 is the default for HTTP, 443 for HTTPS)*. Change any one of the three and the request is cross-origin, so the browser blocks it unless the server sends `Access-Control-Allow-Origin`. [CORS and the Same-Origin Policy](#/comp4537-l5/cors-and-the-same-origin-policy)"
  }
]
```

## Lecture 6: promise states, then / catch / finally, PUT vs PATCH vs POST

```quiz
[
  {
    "type": "fill",
    "q": "Slides 13–14: the three states of a promise, in the slide's order. Type each in lower case, using slide 14's word for the second.",
    "code": "1. ___      you don't know yet if you will get the raise\n2. ___      the boss is happy; resolve() was called\n3. ___      the boss is unhappy; reject() was called",
    "answer": ["pending", "fulfilled", "rejected"],
    "explain": "Slide 13 writes the second as *Resolved (Fulfilled)*; slide 14 stacks *Pending*, *Fulfilled*, *Rejected*. Old Chrome DevTools showed `[[PromiseStatus]]: \"resolved\"` for a fulfilled promise. [Promise states](#/comp4537-l6/promise-states-and-the-executor)"
  },
  {
    "type": "text",
    "q": "Slide 14 loops two of the states together and joins them to one word: fulfilled + rejected = ___ .",
    "answer": ["settled"],
    "explain": "A promise that is no longer pending is settled, and it settles once: after a `reject`, a later `resolve` is ignored. [Promise states](#/comp4537-l6/promise-states-and-the-executor)"
  },
  {
    "type": "match",
    "q": "Slides 41–48: match each of the three methods to its meaning.",
    "pairs": [
      [".then(s, f)", "s runs on resolve with the result, f on reject with the error; returns a promise"],
      [".catch(f)", "the same as .then(null, f)"],
      [".finally(f)", "similar to .then(f, f): runs either way, once the promise is settled"]
    ],
    "explain": "*3 main methods of the Promise object are .then .catch .finally* (slide 41). `.finally` takes no argument, passes the value through and does not handle a rejection: slides 50–51 still show `Uncaught (in promise)`. [then, catch and finally](#/comp4537-l6/chaining-then-catch-finally)"
  },
  {
    "type": "match",
    "q": "Slide 3: match each HTTP verb to what slide 3 says about it.",
    "pairs": [
      ["PUT", "replacing an object entirely with something new"],
      ["PATCH", "updating only a property of an object"],
      ["POST", "successive identical requests may have additional effects, e.g. placing an order several times"]
    ],
    "explain": "*PUT is idempotent, POST is not*: calling PUT once or several times has the same effect. The resource in slide 3's figure is `myDomain.com/api/customers`. [PUT, PATCH, POST](#/comp4537-l6/idempotency-put-patch-post)"
  }
]
```

## Lecture 7 (with lecture 5, slides 32 and 44): CRUD, SQL statements, HTTP methods and the three steps from Node to MySQL

```quiz
[
  {
    "type": "fill",
    "q": "Lecture 5, slide 32: expand the four letters of CRUD, each with a capital first letter.",
    "code": "C  ___    a table or DB\nR  ___    from a DB\nU  ___    records on a DB\nD  ___    a record, or Drop a table",
    "answer": ["Create", "Read", "Update", "Delete"],
    "explain": "*All of this operation with DB all referred as CRUD in brief*. Lecture 2 slide 24 lists the same four as a course outcome, done on a database via API requests. [CRUD from Node](#/comp4537-l7/crud-from-node)"
  },
  {
    "type": "match",
    "q": "Match each CRUD operation to the SQL statement that does it.",
    "pairs": [
      ["Create", "INSERT (or CREATE TABLE)"],
      ["Read", "SELECT"],
      ["Update", "UPDATE"],
      ["Delete", "DELETE (or DROP TABLE)"]
    ],
    "explain": "Worked out, not a table on any slide: lecture 5 slide 32 pairs CRUD with SQL only in words (*Create a table or DB*, *Delete a record or Drop a table*), and these are the standard SQL statement names. Writing SQL itself is outside the midterm. [CRUD from Node](#/comp4537-l7/crud-from-node)"
  },
  {
    "type": "match",
    "q": "Match each CRUD operation to the HTTP method an API uses for it.",
    "pairs": [
      ["Create", "POST"],
      ["Read", "GET"],
      ["Update", "PUT"],
      ["Delete", "DELETE"]
    ],
    "explain": "From lecture 3 slide 32: *POST: Create*, *GET: Get*, *PUT: Update*, *DELETE: Delete*; PATCH updates one property (lecture 6 slide 3). Lab 5 follows this pattern: a page sends the INSERT by POST and the SELECT by GET. [CRUD from Node](#/comp4537-l7/crud-from-node)"
  },
  {
    "type": "reorder",
    "q": "Lecture 5, slide 44: put the three steps from Node to MySQL in order (after `npm install mysql`).",
    "lang": "text",
    "lines": [
      "Create a mysql object: mysql.createConnection({ ... })",
      "Connect: con.connect(function (err) { ... })",
      "Run a SQL statement: con.query(sql, function (err, result) { ... })"
    ],
    "explain": "*First create a myslq object / Then connect / And run a SQL statement*. The query runs inside the `connect` callback, after `Connected!`; slide 44's INSERT logs `1 record inserted`. Without the install, Node throws `Cannot find module 'mysql'`. [Node to MySQL](#/comp4537-l5/node-to-mysql)"
  }
]
```

## Ten names from their definitions

```quiz
[
  { "type": "text", "q": "Lecture 1, slide 132: the JavaScript engine treats all variable declarations using `var` as if they were declared at the top of a functional scope. Name the behaviour.", "answer": ["hoisting", "variable hoisting", "hoist"], "explain": "*variable hoisting ( only for variables declared by \"var\")*: reading a `var` before its declaration prints `undefined`; reading a `let` first throws and stops the script. [Hoisting](#/comp4537-l1/scope-and-hoisting)" },
  { "type": "text", "q": "Lecture 2, slide 27: a JavaScript object cannot travel over a network, so you must turn it into a string format any machine can read. Name the verb.", "answer": ["serialize", "serialise", "serialization", "serialisation", "flatten"], "explain": "*You must serialize (flatten) it into a string format*: `JSON.stringify` serializes (object to string), `JSON.parse` deserializes (string to object). [JSON](#/comp4537-l2/json-stringify-and-parse)" },
  { "type": "text", "q": "Lecture 3, slide 32: the URL where the API server is listening.", "answer": ["endpoint", "end point", "an endpoint", "the endpoint"], "explain": "Part 3 of the four parts of a web API: *Endpoint: it is the URL where the API Server is listening to*. [Anatomy of a web API](#/comp4537-l3/anatomy-of-a-web-api)" },
  { "type": "text", "q": "Lecture 3, slide 50: each request contains all the info needed and the server does not store session state. Name the constraint.", "answer": ["stateless", "statelessness"], "explain": "REST's second constraint. The slide's book example: after page 50 the client must ask for page 51, never for \"the next page\". [REST's five constraints](#/comp4537-l3/rest-principles)" },
  { "type": "text", "q": "The request a browser sends first, with method OPTIONS, to ask a cross-origin server whether the real request is allowed.", "answer": ["preflight", "preflight request", "pre-flight", "pre-flight request"], "explain": "Lecture 5 slides 20 and 29 ask what a preflight request is and how it relates to OPTIONS; the answer is not on the slide. Worked out: a request with `Content-Type: application/json` triggers one, a form-urlencoded or `text/plain` body does not. [CORS and the preflight request](#/comp4537-l5/cors-and-the-same-origin-policy)" },
  { "type": "text", "q": "Lecture 6, slide 3: can be applied multiple times without changing the result.", "answer": ["idempotent", "idempotence", "idempotency"], "explain": "*PUT is idempotent, POST is not*: repeating a POST may place an order several times. [Idempotency](#/comp4537-l6/idempotency-put-patch-post)" },
  { "type": "text", "q": "Lecture 6, slide 17: resolve and reject change the promise's status synchronously, which puts the handlers in this queue, to run only after the current call stack finishes.", "answer": ["microtask", "microtasks", "microtask queue", "micro task", "micro-task"], "explain": "Handlers *wait only for the current call stack to unwind*, and they run before any `setTimeout` callback, even one set to 0 ms: sync, then microtasks, then timers. [Microtasks before timers](#/comp4537-l6/ordering-part-2)" },
  { "type": "text", "q": "Lecture 6, slides 16–17: the function passed to the Promise constructor, executed the moment the promise object is created.", "answer": ["executor", "executer", "executor function", "executer function"], "explain": "The slide spells it *executer*: it *gets executed immediately upon creation of the promise object* and receives references to `resolve` and `reject`. Promises are eager (slide 19). [The executor](#/comp4537-l6/promise-states-and-the-executor)" },
  { "type": "text", "q": "Nesting each next asynchronous call inside the previous call's callback, as slide 40 does with two AJAX calls. Name the problem promises avoid.", "answer": ["callback hell", "callback-hell", "pyramid of doom"], "explain": "Lecture 6 slide 40 only asks *Have you heard about callback hell?*; the definition is worked out, not on the slide. Each level of nesting waits for the one before it, which is why chained `.then` calls replace it. [Callbacks](#/comp4537-l6/callbacks-and-first-class-functions)" },
  { "type": "text", "q": "Lecture 7, slide 20: a primary key of another table present in this table, as Patient_ID is in the Visit table.", "answer": ["foreign key", "fk", "a foreign key", "foreign keys"], "explain": "Visit's primary key is Visit_ID; Patient_ID links each visit to one patient, giving the 1:M relationship. [Tables and keys](#/comp4537-l7/databases-tables-and-keys)" }
]
```

## Reference

Every list above, in the slide's words and order.

| Lecture | List (slide) | Items |
|---|---|---|
| 1 | Six primitives + object (s113) | Boolean, null, undefined, Number, String, Symbol; Objects (arrays too) |
| 1 | Falsy values (s114) | `undefined`, `null`, `0`, `false`, `NaN`, `''` |
| 1 | Hosting kinds (s21–23) | Shared (cheapest, slowest); VPS (fewer sites, own virtual server); Dedicated (one machine, all yours); Cloud (many machines act as one) |
| 1 | let vs var, the var column (s134) | Function scope; hoists declaration to top of function; adds to `window`; strict-mode re-declaration ok |
| 1 | let vs var, the let column (s134) | Block scope; (blank); not added to `window`; no re-declaration |
| 1 | Box model, inside out (s177) | content, padding, border, margin |
| 1 | `position` (s184) | static (default, document flow), relative, absolute, fixed (browser window), sticky |
| 1 | Combinators (s185) | space descendant, `>` child, `+` adjacent sibling, `~` general sibling |
| 2 | Three architectures (s9) | Monolithic → Layered → Microservices |
| 2 | Monolith, add a feature (s11) | shut down entire application; add the feature; (may need to) recompile everything |
| 2 | n-tier layers (s13) | Presentation (form page); Business (decision making, routing requests); Application (libraries); Data access (databases) |
| 2 | Three R words (s16) | Reliable = works normally; Robust = handles bad conditions; Resilient = survives and recovers |
| 2 | localStorage API (s34) | `setItem`, `getItem` (string or `null`), `removeItem`, `clear` |
| 3 | REST constraints (s49) | Client–Server, Stateless, Cacheable, Uniform Interface (core), Layered System |
| 3 | GET vs POST (s39) | Back/Reload harmless vs re-submitted; bookmark yes vs no; cached yes vs no; history yes vs no; length 2048 vs none; ASCII only vs binary too; less safe vs a little safer (none are secure); visible in URL vs not |
| 3 | Web API parts (s31–32) | 1- Headers, 2- Data (body), 3- Endpoint, 4- HTTP Methods |
| 3 | Method → action (s32) | GET get, POST create, PUT update, DELETE delete |
| 4 | PHP file request (s12) | send to file system; wait; return content; next request |
| 4 | Node file request (s12) | send to file system; next request; return content when the file is read |
| 4 | Restaurant (s18) | Ex. 1 single threaded non-blocking; Ex. 2 single threaded blocking; Ex. 3 multi-threaded |
| 4 | `url.parse(adr, true)` (s38) | host `localhost:8888`; pathname `/default.htm`; search `?name=John&age=23`; query `{ name, age }` |
| 5 | XHR steps (s7–9) | create object; `onreadystatechange`; `open(method, url, async)`; `send()` |
| 5 | readyState (s8) | 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING (repeats), 4 DONE |
| 5 | Status (s8) | 200 OK; 3xx redirection; 4xx client error (403 Forbidden, 404 Not Found); 5xx server error |
| 5 | Origin (s18 fn 3) | domain + protocol + port; HTTP 80, HTTPS 443 |
| 6 | Promise states (s13–14) | pending, fulfilled, rejected; fulfilled + rejected = settled |
| 6 | Three methods (s41–48) | `.then(s, f)`; `.catch(f)` = `.then(null, f)`; `.finally(f)` ≈ `.then(f, f)` |
| 6 | Verbs (s3) | PUT replaces; PATCH one property; PUT idempotent, POST not |
| 7 | CRUD (L5 s32) | Create, Read, Update, Delete |
| 7 | CRUD ↔ SQL ↔ HTTP | Create INSERT POST; Read SELECT GET; Update UPDATE PUT; Delete DELETE DELETE |
| 7 | Node to MySQL (L5 s44) | `createConnection`; `connect`; `query` |

```diagram
{ "type": "grid", "title": "The ordered lists on one screen", "nodes": [
  { "id": "h0", "label": "List", "row": 0, "col": 0 }, { "id": "h1", "label": "1st", "row": 0, "col": 1 }, { "id": "h2", "label": "2nd", "row": 0, "col": 2 }, { "id": "h3", "label": "3rd", "row": 0, "col": 3 }, { "id": "h4", "label": "4th", "row": 0, "col": 4 }, { "id": "h5", "label": "5th", "row": 0, "col": 5 },
  { "id": "r1", "label": "REST (L3 s49)", "row": 1, "col": 0 }, { "id": "r1a", "label": "Client–Server", "row": 1, "col": 1 }, { "id": "r1b", "label": "Stateless", "row": 1, "col": 2 }, { "id": "r1c", "label": "Cacheable", "row": 1, "col": 3 }, { "id": "r1d", "label": "Uniform Interface", "row": 1, "col": 4 }, { "id": "r1e", "label": "Layered System", "row": 1, "col": 5 },
  { "id": "r2", "label": "readyState (L5 s8)", "row": 2, "col": 0 }, { "id": "r2a", "label": "0 UNSENT", "row": 2, "col": 1 }, { "id": "r2b", "label": "1 OPENED", "row": 2, "col": 2 }, { "id": "r2c", "label": "2 HEADERS_RECEIVED", "row": 2, "col": 3 }, { "id": "r2d", "label": "3 LOADING", "row": 2, "col": 4 }, { "id": "r2e", "label": "4 DONE", "row": 2, "col": 5 },
  { "id": "r3", "label": "XHR (L5 s7–9)", "row": 3, "col": 0 }, { "id": "r3a", "label": "create object", "row": 3, "col": 1 }, { "id": "r3b", "label": "set handler", "row": 3, "col": 2 }, { "id": "r3c", "label": "open", "row": 3, "col": 3 }, { "id": "r3d", "label": "send", "row": 3, "col": 4 },
  { "id": "r4", "label": "n-tier (L2 s13)", "row": 4, "col": 0 }, { "id": "r4a", "label": "Presentation", "row": 4, "col": 1 }, { "id": "r4b", "label": "Business", "row": 4, "col": 2 }, { "id": "r4c", "label": "Application", "row": 4, "col": 3 }, { "id": "r4d", "label": "Data access", "row": 4, "col": 4 },
  { "id": "r5", "label": "Box model (L1 s177)", "row": 5, "col": 0 }, { "id": "r5a", "label": "content", "row": 5, "col": 1 }, { "id": "r5b", "label": "padding", "row": 5, "col": 2 }, { "id": "r5c", "label": "border", "row": 5, "col": 3 }, { "id": "r5d", "label": "margin", "row": 5, "col": 4 },
  { "id": "r6", "label": "Node to MySQL (L5 s44)", "row": 6, "col": 0 }, { "id": "r6a", "label": "createConnection", "row": 6, "col": 1 }, { "id": "r6b", "label": "connect", "row": 6, "col": 2 }, { "id": "r6c", "label": "query", "row": 6, "col": 3 }
], "caption": "Each row is a list the slides give in a fixed order, first item on the left." }
```

The four lists below are not in the table.

```quiz
[
  {
    "type": "match",
    "q": "Lecture 3, slide 53: match each REST constraint to the benefit the slide gives it.",
    "pairs": [
      ["Client–Server", "separation & evolvability (GitHub)"],
      ["Stateless", "scalability & reliability (Netflix)"],
      ["Cacheable", "performance & efficiency (Twitter)"],
      ["Uniform Interface", "simplicity & predictability (GitHub API)"],
      ["Layered System", "flexibility & security (AWS API Gateway)"]
    ],
    "explain": "Slide 53 adds a sixth line, *Code-on-Demand → extensibility (Web apps delivering JavaScript)*, which is not one of slide 49's five. [REST's five constraints](#/comp4537-l3/rest-principles)"
  },
  {
    "type": "fill",
    "q": "Lecture 5, slide 44: name the four keys of the object passed to `mysql.createConnection`, in the slide's order.",
    "code": "const con = mysql.createConnection({\n  ___: \"localhost\",\n  ___: \"root\",\n  ___: \"\",\n  ___: \"webdev\"\n});",
    "answer": ["host", "user", "password", "database"],
    "explain": "The local XAMPP values: host `\"localhost\"`, user `\"root\"`, an empty password, database `\"webdev\"`. These credentials stay in the Node server, never in the page's JavaScript. [Node to MySQL](#/comp4537-l5/node-to-mysql)"
  },
  {
    "type": "match",
    "q": "Lecture 2, slide 33: match each web storage object to how long it keeps its data.",
    "pairs": [
      ["window.localStorage", "stores data with no expiration date"],
      ["window.sessionStorage", "stores data for one session; the data is lost when the browser tab is closed"]
    ],
    "explain": "Both are per origin, hold strings only and are client-side: they live in the browser's local data, not on the server. [Web storage](#/comp4537-l2/web-storage)"
  },
  {
    "type": "fill",
    "q": "Lecture 3, slide 47, remark 3: what the API gateway is responsible for, in the slide's order, in lower case.",
    "code": "Gateway is responsible for ___, ___, ___ etc",
    "answer": ["routing", "authentication", "auditing"],
    "explain": "The same slide: *Every request goes through API gateway*, the *Single Entry point*; the gateway box shows Security, Routing, Audit and Localization. [The microservice gateway](#/comp4537-l3/rest-principles)"
  }
]
```
