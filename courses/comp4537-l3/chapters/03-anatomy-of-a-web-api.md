---
title: Headers, data, endpoint and HTTP method
minutes: 14
---

A program that calls an API server has to say who it is, what it wants, where to send it and what to do. Slides 30 to 32 split every web API request into those four parts.

<!-- facts: slide 30 section; slide 31 headers (API-key, count, pageNo; status, content-type), data also called body or message; slide 32 endpoint, HTTP methods GET POST PUT DELETE, two most common GET and POST -->

## A web API has four parts (slides 31 and 32)

The slides number them:

1. *Headers: The additional details provided for communication between client and server.*
2. *Data: (also called body or message) contains info you want to send to the server.*
3. *Endpoint: it is the URL where the API Server is listening to.*
4. *HTTP Methods: determines the method of communication between client and server*

```diagram
{ "type": "layers", "title": "One request, the slide's four parts", "nodes": [ { "id": "r", "label": "request" }, { "id": "m", "label": "HTTP method + endpoint", "sub": "GET /api/echo?title=Dune", "parent": "r" }, { "id": "h", "label": "Headers", "sub": "content-type, …", "parent": "m" }, { "id": "d", "label": "Data (body or message)", "sub": "empty for GET", "parent": "h" } ], "hi": ["m"], "caption": "The slide's four parts drawn: a GET puts everything in the method line and headers, and sends no data." }
```

## Headers travel both ways (slide 31)

The request headers the slide lists:

- *API-key: the subscription key the client. This way the server knows who is making the request.*
- *count: the number of objects you want the*; the slide's sentence stops there.
- *pageNo: the page number*

The response headers:

- *status: the status of request or HTTP code.*
- *content-type: type of resource sent by server ( e.g. html/img/...*

The slide's list is the exam's. In practice APIs take `count` and `pageNo` as query parameters, the status code travels in the response's first line rather than in a header named status, and content-type values are types such as `application/json`.

## Endpoint and method (slide 32)

*Web API servers implements multiple 'methods' for different types of request*:

- *GET: Get resource from the server.*
- *POST: Create resource to the server.*
- *PUT: Update existing resource on the server.*
- *DELETE: Delete existing resource from the server.*

```diagram
{ "type": "grid", "title": "Methods and what they do", "nodes": [ { "id": "h0", "label": "method", "row": 0, "col": 0 }, { "id": "h1", "label": "slide's verb", "row": 0, "col": 1 }, { "id": "h2", "label": "this lesson's bookstore example", "row": 0, "col": 2 }, { "id": "g0", "label": "GET", "row": 1, "col": 0 }, { "id": "g1", "label": "Get", "row": 1, "col": 1 }, { "id": "g2", "label": "GET /books/12", "row": 1, "col": 2 }, { "id": "p0", "label": "POST", "row": 2, "col": 0 }, { "id": "p1", "label": "Create", "row": 2, "col": 1 }, { "id": "p2", "label": "POST /books", "row": 2, "col": 2 }, { "id": "u0", "label": "PUT", "row": 3, "col": 0 }, { "id": "u1", "label": "Update", "row": 3, "col": 1 }, { "id": "u2", "label": "PUT /books/12", "row": 3, "col": 2 }, { "id": "d0", "label": "DELETE", "row": 4, "col": 0 }, { "id": "d1", "label": "Delete", "row": 4, "col": 1 }, { "id": "d2", "label": "DELETE /books/12", "row": 4, "col": 2 } ], "hi": ["g0", "p0"], "caption": "The two most common HTTP methods are: GET and POST." }
```

The endpoint names the resource; the method says what to do with it. A new book has no number yet, so POST goes to the collection `/books`.

### A request is built from method, endpoint, parameters and headers

The URL bar colours each part of the endpoint. Send calls this app's echo server and shows the JSON it returns.

```widget
http-anatomy
{ "method": "GET", "path": "/api/echo", "params": { "title": "Dune" } }
```

## A live GET names every part

This request goes to the app's echo server, which answers with what it received. This API takes its key as a query parameter, as slide 43's news API does. How the request code works is lecture 5's subject; here, read the parts.

```js run
fetch(SERVER + "/api/echo?title=Dune&apiKey=demo123")
  .then(function (res) {
    console.log("status: " + res.status);
    console.log("content-type: " + res.headers.get("content-type"));
    return res.json();
  })
  .then(function (data) {
    console.log("method: " + data.method);
    console.log("path: " + data.path);
    console.log("query: " + JSON.stringify(data.query));
  });
```

It prints:

```text
status: 200
content-type: application/json; charset=utf-8
method: GET
path: /api/echo
query: {"title":"Dune","apiKey":"demo123"}
```

`path` is the endpoint, `method` is the HTTP method, and the key and title arrived as query parameters. The first two lines are slide 31's response headers. The status comes from `res.status`, the status line, not from a header.

```diagram
{ "type": "sequence", "title": "Request and response", "nodes": [ { "id": "c", "label": "client", "kind": "lane" }, { "id": "s", "label": "API server", "sub": "endpoint /api/echo", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "GET /api/echo?title=Dune&apiKey=…" }, { "from": "s", "to": "c", "label": "status 200, content-type, JSON body" } ], "hi": ["2"], "caption": "Message 1 carries the method, the endpoint and the key; message 2 carries slide 31's response headers, status and content-type." }
```

## A POST carries data in the body

```diagram
{ "type": "layers", "title": "The same four parts for a POST", "nodes": [ { "id": "r", "label": "request" }, { "id": "m", "label": "HTTP method + endpoint", "sub": "POST /api/echo", "parent": "r" }, { "id": "h", "label": "Headers", "sub": "Content-Type: application/json", "parent": "m" }, { "id": "d", "label": "Data (body or message)", "sub": "{\"title\":\"Dune\",\"qty\":2}", "parent": "h" } ], "hi": ["d"], "caption": "Data: (also called body or message) contains info you want to send to the server." }
```

```js run
fetch(SERVER + "/api/echo", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Dune", qty: 2 })
})
  .then(function (res) { return res.json(); })
  .then(function (data) {
    console.log("method: " + data.method);
    console.log("query: " + JSON.stringify(data.query));
    console.log("body: " + data.body);
    console.log("content-type: " + data.headers["content-type"]);
  });
```

It prints:

```text
method: POST
query: {}
body: {"title":"Dune","qty":2}
content-type: application/json
```

The query is empty: the order travelled as Data, the body. The client chose the `Content-Type` request header so the server knows the body is JSON.


### The parameters move from the URL into the body

The same title, now as a POST. Switch the method back to GET to see it return to the query string.

```widget
http-anatomy
{ "method": "POST", "path": "/api/echo", "params": { "title": "Dune" } }
```

```quiz
[
  { "q": "Match each part of a web API to its definition on slides 31 and 32.", "type": "match", "pairs": [["Headers", "The additional details provided for communication between client and server"], ["Data", "Contains info you want to send to the server"], ["Endpoint", "The URL where the API Server is listening"], ["HTTP Methods", "Determines the method of communication between client and server"]], "explain": "Slide 31 defines Headers and Data; slide 32 defines Endpoint and HTTP Methods." },
  { "q": "Put the four parts of a web API in the order the slides number them.", "type": "reorder", "lines": ["Headers", "Data", "Endpoint", "HTTP Methods"], "explain": "Slide 31: *1- Headers*, *2- Data*. Slide 32: *3- Endpoint*, *4- HTTP Methods*." },
  { "q": "Name the part defined as the URL where the API server is listening.", "type": "text", "answer": ["endpoint", "an endpoint", "the endpoint"], "explain": "Slide 32: *3- Endpoint: it is the URL where the API Server is listening to.*" },
  { "q": "According to slide 31, Data is also called what?", "options": ["body or message", "header or payload", "query or parameter", "endpoint or route"], "answer": 0, "explain": "*2- Data: (also called body or message) contains info you want to send to the server.*" },
  { "q": "Slide 32: *POST: Update resource to the server.*", "type": "tf", "answer": false, "explain": "Slide 32 says *POST: Create resource to the server.* Update is PUT: *PUT: Update existing resource on the server.*" },
  { "q": "Which response header on slide 31 tells the client the type of resource the server sent?", "options": ["content-type", "status", "API-key", "pageNo"], "answer": 0, "explain": "*content-type: type of resource sent by server ( e.g. html/img/...*. status is the HTTP code; API-key and pageNo are request headers on the slide." },
  { "q": "A clinic's API: a patient has booked an appointment and now moves it from 10:00 to 14:00. Which method fits?", "options": ["PUT", "POST", "GET", "DELETE"], "answer": 0, "explain": "Changing a booking that already exists is *PUT: Update existing resource on the server.* Booking it in the first place would be POST (create); viewing it GET; cancelling it DELETE." },
  { "q": "On the same clinic API, which method books a new appointment?", "options": ["POST", "PUT", "GET", "DELETE"], "answer": 0, "explain": "A new appointment is a new resource: *POST: Create resource to the server.*" },
  { "q": "According to slide 31, which request header lets the server know who is making the request?", "options": ["API-key", "content-type", "status", "count"], "answer": 0, "explain": "*API-key: the subscription key the client. This way the server knows who is making the request.*" }
]
```
