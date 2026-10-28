---
title: GET vs POST, and trying an API with Postman
minutes: 18
---

*The two most common HTTP methods are: GET and POST.* Where each puts its data decides caching, bookmarks, history, size and safety.

<!-- facts: slide 33 two most common; slide 34 GET query string in URL; slide 35 GET cached, history, bookmarked, not sensitive, length, request only; slide 36 POST body, never cached, no bookmark, no history, no length limit, resubmission warning; slide 37 map search GET, banking login POST; slide 38 none secure; slide 39 table; slides 40-43 Postman, httpbin, currentsapi apiKey -->

## GET sends its query string in the URL (slides 34 and 35)

*GET is used to request data from a specified resource.* *the query string (name/value pairs) is sent in the URL of a GET request*:

```diagram
{ "type": "tree", "title": "A GET URL and its query string", "nodes": [ { "id": "u", "label": "/test/demo_form.php?name1=value1&name2=value2" }, { "id": "p", "label": "path", "sub": "/test/demo_form.php", "parent": "u" }, { "id": "q", "label": "query string", "sub": "Query string (Key/value ) pair", "parent": "u" }, { "id": "a", "label": "name1=value1", "parent": "q" }, { "id": "b", "label": "name2=value2", "parent": "q" } ], "hi": ["a", "b"], "caption": "Everything after the ? is name/value pairs joined by &." }
```

Slide 35's GET facts:

- *GET requests can be cached*: they *are re-executed but may not be re-submitted to server if the HTML response is already stored in the browser cache.*
- *GET requests remain in the browser history*
- *GET requests can be bookmarked*
- *GET requests should never be used when dealing with sensitive data*. The slide asks why; worked out: the data sits in the URL, so it lands in history, bookmarks and server logs.
- *GET requests have length restrictions on data size*
- *GET requests should only be used to request data (not modify)*

### Where GET puts the parameters

Switch the method to POST: the parameters leave the URL for the body.

```widget
http-anatomy
{ "method": "GET", "path": "/search", "params": { "city": "Vancouver", "zoom": "12" } }
```

## POST sends its data in the request body (slide 36)

- *POST is used to send data to a server to create/update a resource*
- *The data sent to the server with POST is stored in the request body of the HTTP request ( not part of the URL)*
- *POST requests are never cached*, *cannot be bookmarked*, *do not remain in the browser history*
- *POST requests have no restrictions on data length*
- *If refreshing leads to resending a post request ( using form), the browser warns the user*

```diagram
{ "type": "sequence", "title": "Refreshing after a POST", "nodes": [ { "id": "u", "label": "user", "kind": "lane" }, { "id": "b", "label": "browser", "kind": "lane" }, { "id": "s", "label": "server", "kind": "lane" } ], "edges": [ { "from": "b", "to": "s", "label": "POST /API/v1/patient/ (body)" }, { "from": "s", "to": "b", "label": "page" }, { "from": "u", "to": "b", "label": "Reload" }, { "from": "b", "to": "u", "label": "Confirm Form Resubmission" }, { "from": "u", "to": "b", "label": "Continue" }, { "from": "b", "to": "s", "label": "POST again, same body" } ], "hi": ["6"], "caption": "If refreshing leads to resending a post request ( using form), the browser warns the user." }
```

## The same data by GET and by POST

```js run
const params = "city=Vancouver&zoom=12";
fetch(SERVER + "/api/echo?" + params)
  .then(function (res) { return res.json(); })
  .then(function (data) {
    console.log("GET query: " + JSON.stringify(data.query));
    console.log("GET body: " + JSON.stringify(data.body));
    return fetch(SERVER + "/api/echo", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });
  })
  .then(function (res) { return res.json(); })
  .then(function (data) {
    console.log("POST query: " + JSON.stringify(data.query));
    console.log("POST body: " + JSON.stringify(data.body));
  });
```

It prints:

```text
GET query: {"city":"Vancouver","zoom":"12"}
GET body: ""
POST query: {}
POST body: "city=Vancouver&zoom=12"
```

## A map search is GET, a bank login is POST (slides 37 and 38)

```diagram
{ "type": "grid", "title": "In class activity", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "Google map search", "row": 0, "col": 1 }, { "id": "h2", "label": "Login to your online banking", "row": 0, "col": 2 }, { "id": "m0", "label": "Method", "row": 1, "col": 0 }, { "id": "m1", "label": "GET", "row": 1, "col": 1 }, { "id": "m2", "label": "POST", "row": 1, "col": 2 }, { "id": "w0", "label": "Data goes", "row": 2, "col": 0 }, { "id": "w1", "label": "in the URL", "row": 2, "col": 1 }, { "id": "w2", "label": "not in the URL", "row": 2, "col": 2 }, { "id": "c0", "label": "Callout", "row": 3, "col": 0 }, { "id": "c1", "label": "Move your mouse and notice the changes at URL", "row": 3, "col": 1 }, { "id": "c2", "label": "Your login data will not be sent to server over the URL", "row": 3, "col": 2 } ], "hi": ["m1", "m2"], "caption": "Slide 37's answers, from its two screenshots." }
```

Slide 38: *which method is secure, GET or POST?* *A: none! The data is not encrypted by default when sent over GET or POST, you need to encrypt data ( or use secure protocols such as https etc)*.

## The full comparison (slide 39)

Ref: w3school.

| | GET | POST |
|---|---|---|
| BACK button/Reload | Harmless | Data will be re-submitted (the browser should alert the user) |
| Bookmarked | Can be bookmarked | Cannot be bookmarked |
| Cached | Can be cached | Not cached |
| History | Parameters remain in browser history | Parameters are not saved in browser history |
| Restrictions on data length | Yes; the length of a URL is limited (*maximum URL length is 2048 characters*) | No restrictions |
| Restrictions on data type | *Only ASCII characters allowed* | *No restrictions. Binary data is also allowed* |
| Security (*none are secure!*) | *GET is less safe compared to POST because data sent is part of the URL Never use GET when sending passwords* | *POST is a little safer than GET because the parameters are not stored in browser history or in web server logs* |
| Visibility | *Data is visible to everyone in the URL* | *Data is not displayed in the URL* |

Four rows are practical rules, keyed as the slide words them. HTTP sets no URL limit; 2048 was old Internet Explorer's cap. A POST response may be cached with freshness headers, though browsers almost never do it. Servers cap POST bodies; this app's echo stops at 64 KB. And "only ASCII" means other characters are percent-encoded:

```js run pin percent-encoding
// predict: Write the two lines printed.
console.log(encodeURI("/api/echo?city=Montréal"));
console.log(encodeURIComponent("a b&c"));
```

```output
/api/echo?city=Montr%C3%A9al
a%20b%26c
```

`encodeURI` turns the é into its UTF-8 bytes `%C3%A9`. `encodeURIComponent` also encodes the space and `&`, so a value cannot break the query string.

PUT and DELETE work as slide 32 says: *PUT: Update existing resource*, *DELETE: Delete existing resource* (see [Headers, data, endpoint and HTTP method](#/comp4537-l3/anatomy-of-a-web-api)).

## Postman sends a request without a page (slides 40 to 43)

*How to test and try an API?* *We can use postman*, from `https://www.getpostman.com/`. Slide 41's activity: *use postman to try https://httpbin.org/get API*, then the public-apis list on GitHub.

```diagram
{ "type": "layers", "title": "The Postman screen", "nodes": [ { "id": "r", "label": "Request bar", "sub": "GET · https://httpbin.org/get · Send" }, { "id": "t", "label": "Request tabs", "sub": "Authorization · Headers · Body", "parent": "r" }, { "id": "s", "label": "Response bar", "sub": "Status: 200 OK · Time: 384 ms", "parent": "t" }, { "id": "b", "label": "Response body", "sub": "JSON", "parent": "s" } ], "hi": ["r", "s"], "caption": "Slide 42 underlines the method, the URL, the Headers tab and the status." }
```

httpbin answers with `args` (empty), the request's `headers` (Accept, Host, User-Agent, a Postman-Token), the caller's `origin` and the `url`. Slide 43's news API takes its key as the query parameter `apiKey` on a GET and returns Status 200 OK with items holding id, title, description, url, author, image, language, category and published.

## Pick the method for a weather service and a clinic

Each scenario turns on one row of slide 39.

```quiz
[
  { "q": "A weather site lets users save tomorrow's forecast for Kamloops as a browser bookmark. Which method should the forecast request use?", "options": ["GET", "POST", "either"], "answer": 0, "explain": "Bookmarked row: GET *Can be bookmarked*, POST *Cannot be bookmarked*. The city travels in the URL, so the bookmark keeps it." },
  { "q": "A clinic uploads a 50 MB X-ray image to a patient's file. Which method?", "options": ["POST", "GET", "either"], "answer": 0, "explain": "Two rows decide it: data length (GET is limited by the URL, 2048 characters on the slide; POST *No restrictions*) and data type (GET *Only ASCII characters allowed*; POST *Binary data is also allowed*)." },
  { "q": "A clinic's form submits a patient's health card number. Which is right?", "options": ["POST, sent over https", "GET, because it is faster", "POST, which makes it secure on its own", "GET over https"], "answer": 0, "explain": "Security row: never put sensitive data in a GET URL. But POST alone is only *a little safer*; slide 38 says *none!* is secure, so encrypt with https." },
  { "q": "A user wants to share a link to a weather search result with a friend. Which method made that link possible?", "options": ["GET", "POST"], "answer": 0, "explain": "Visibility row: GET's *Data is visible to everyone in the URL*, so the URL alone repeats the search. A POST's data is not in the URL." },
  { "q": "After signing up for a clinic's newsletter, a user presses Reload and the browser shows Confirm Form Resubmission. Which method did the form use?", "options": ["POST", "GET"], "answer": 0, "explain": "BACK/Reload row: for POST *Data will be re-submitted (the browser should alert the user)*; for GET reloading is *Harmless*." }
]
```

```quiz
[
  { "q": "Which statement about GET and POST is false?", "options": ["Neither GET nor POST has any limit on data length", "GET requests can be cached, POST requests are never cached", "GET parameters remain in the browser history, POST parameters do not", "GET should only be used to request data, not modify it"], "answer": 0, "explain": "Slide 35: *GET requests have length restrictions on data size*; only POST has *no restrictions on data length*. The other three are slide 35 and 36 facts." },
  { "q": "A search page sends 3 000 characters of text in one request. According to slide 39, which method can carry it?", "options": ["POST only", "GET only", "GET and POST"], "answer": 0, "explain": "The slide's *maximum URL length is 2048 characters* rules GET out; POST has *No restrictions*. In reality HTTP sets no URL limit and most servers accept about 8 KB, but the exam keys the slide." },
  { "q": "Sending a username and password as GET query parameters is acceptable if the site is small.", "type": "tf", "answer": false, "explain": "Slide 39: *Never use GET when sending passwords*; the data is part of the URL, so it lands in history and server logs." },
  { "q": "Slide 39 heads its security row *none are secure!*", "type": "tf", "answer": true, "explain": "Neither method encrypts anything by default (slide 38: *you need to encrypt data ( or use secure protocols such as https etc)*). POST is only *a little safer*." },
  { "q": "Which method's request can carry binary data such as a 20 MB video?", "options": ["POST", "GET", "both", "neither"], "answer": 0, "explain": "Restrictions on data type: GET *Only ASCII characters allowed*; POST *No restrictions. Binary data is also allowed*. Size points the same way." },
  { "q": "What maximum URL length does slide 39 give for GET?", "options": ["2048 characters", "1024 characters", "8 KB", "64 KB"], "answer": 0, "explain": "*maximum URL length is 2048 characters*. That was old Internet Explorer's cap; 8 KB is a common server limit today, and 64 KB is this app's POST body cap." },
  { "q": "Match each slide-39 row to GET's answer.", "type": "match", "pairs": [["Bookmarked", "Can be bookmarked"], ["Cached", "Can be cached"], ["History", "Parameters remain in browser history"], ["BACK button/Reload", "Harmless"], ["Visibility", "Data is visible to everyone in the URL"]], "explain": "The GET column of slide 39. POST's column is the opposite on every one of these rows." },
  { "type": "free", "q": "Compare GET and POST on four properties.", "model": "GET sends its query string in the URL; POST puts its data in the request body. GET requests can be cached, bookmarked and remain in history; POST requests are never cached, cannot be bookmarked and are not kept in history. GET is limited by the URL length (2048 characters on the slide) and allows only ASCII; POST has no length restriction and allows binary data. Neither is secure: data must be encrypted, for example with https.", "points": ["GET data in the URL, POST data in the body", "GET cached, bookmarkable, in history; POST none of these", "GET length-limited (2048), POST no restriction", "GET ASCII only, POST binary allowed", "neither is secure without encryption such as https"], "rows": 6, "explain": "Slides 34 to 39: the GET and POST lists and the comparison table." }
]
```
