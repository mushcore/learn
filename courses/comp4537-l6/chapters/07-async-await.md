---
title: async functions return promises, await waits for one
minutes: 16
---

Slide 40 asks how to make a second AJAX call wait for the first, and answers by nesting callbacks. Slides 33 and 52 show what promises and `async`/`await` do instead, and slide 55 corrects the readyState table those calls depend on.

## Promises behave like async try/catch (slide 33)

Slide 33 asks *What is the difference between try catch error and promise resolve reject?* and answers: *Promises were designed to behave like async try/catch blocks.*

```js
// Synchronous code

try {
  const x = work();
  return x;   // success path
} catch (e) {
  throw e;    // failure path
}
```

```js
//Promise .then() handler

.then(x => {
  return x;  // resolve
})
  .catch(e => {
    throw e;  // reject
  })
```

Returning is the success path and resolves the next promise; throwing is the failure path and rejects it, the rule from slide 31.

```diagram
{ "type": "grid", "title": "try/catch and then/catch", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "try / catch", "row": 0, "col": 1 }, { "id": "h2", "label": ".then / .catch", "row": 0, "col": 2 }, { "id": "h3", "label": "async / await", "sub": "beyond slide 33", "row": 0, "col": 3 }, { "id": "s0", "label": "success path", "row": 1, "col": 0 }, { "id": "s1", "label": "return x", "row": 1, "col": 1 }, { "id": "s2", "label": "return x (resolve)", "row": 1, "col": 2 }, { "id": "s3", "label": "x = await p", "row": 1, "col": 3 }, { "id": "f0", "label": "failure path", "row": 2, "col": 0 }, { "id": "f1", "label": "throw e", "row": 2, "col": 1 }, { "id": "f2", "label": "throw e (reject)", "row": 2, "col": 2 }, { "id": "f3", "label": "catch (e) around await", "row": 2, "col": 3 } ], "caption": "Promises were designed to behave like async try/catch blocks." }
```

## Two successive AJAX calls (slide 40)

*Suppose we wish to make an Ajax call to server A to get something And then making another AJAX call to server B based on what you got from server A.* *Q: How can you guarantee the right order?* The slide's answer: *calling myFunc2 inside myFunc1, line 65*, which is the `score = parseInt(this.responseText);` line below.

```js
const xhttp = new XMLHttpRequest();
let score = 0;
function myFunc1() {
    xhttp.open("GET", "http://localhost:8888/getscore/?name=john", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
                score = parseInt(this.responseText);
        }
    };
}

function myFunc2() {
    xhttp.open("PATCH", "http://localhost:7777/updatescore/" + str, true);
    xhttp.send("name=john;score=" + score);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
    };
}
```

As printed, `str` is never defined and both functions share one `xhttp`; the slide's point is only the order. Then it asks: *Have you heard about callback hell?* A third call would go inside `myFunc2`'s callback, a fourth inside that, and the code drifts right.

```diagram
{ "type": "sequence", "title": "Two successive AJAX calls", "nodes": [ { "id": "b", "label": "browser", "kind": "lane" }, { "id": "a", "label": "server A", "sub": "localhost:8888", "kind": "lane" }, { "id": "s", "label": "server B", "sub": "localhost:7777", "kind": "lane" } ], "edges": [ { "from": "b", "to": "a", "label": "GET /getscore/?name=john" }, { "from": "a", "to": "b", "label": "score (readyState 4, 200)" }, { "from": "b", "to": "s", "label": "PATCH /updatescore/" }, { "from": "s", "to": "b", "label": "response" } ], "hi": ["3"], "caption": "The slide's steps drawn: the PATCH is sent only from inside the first call's readyState 4 branch." }
```

```diagram
{ "type": "tree", "title": "Callback hell", "nodes": [ { "id": "f1", "label": "myFunc1()" }, { "id": "o1", "label": "onreadystatechange", "parent": "f1" }, { "id": "f2", "label": "myFunc2()", "parent": "o1" }, { "id": "o2", "label": "onreadystatechange", "parent": "f2" }, { "id": "f3", "label": "myFunc3()", "parent": "o2" } ], "caption": "Each next call nests inside the previous callback." }
```

## The same two calls as a promise chain

The lesson's own rewrite, beyond the slide, against the app's echo endpoint. `request` wraps one `XMLHttpRequest` in a promise: `resolve` in the readyState 4 and 200 branch, `reject` otherwise.

```js run pin two calls chained
// predict: Write the order of the four numbered lines (the echoed values may differ).
function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open(method, url, true);
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) resolve(JSON.parse(this.responseText));
        else reject(new Error("status " + this.status));
      }
    };
    xhttp.send(body);
  });
}

console.log("1 sending the GET");
request("GET", SERVER + "/api/echo?name=john")
  .then((a) => {
    console.log("2 server A answered for", a.query.name);
    return request("PUT", SERVER + "/api/echo", "name=john;score=10");
  })
  .then((b) => console.log("3 server B got a", b.method))
  .catch((err) => console.log("failed:", err.message));
console.log("4 script finished");
```

The echo endpoint accepts PUT but not PATCH from a page, so the update is sent as PUT. The order is 1, 4, 2, 3. The first handler returns the second call's promise, so the next `.then` waits until the update has answered. One `.catch` at the end handles a failure of either call, and the code stays flat.

## Timing a GET (slide 53)

The in-class activity: *Q1: For the given API server, measure the time diff from the time you sent a GET request, to the time you receive the response* and *Q2: Measure the time diff from the time you receive the response header, to the time you receive the response*. The slide gives no answer. Worked out with XHR: Q2 is the gap from readyState 2 to readyState 4.

```js run pin timing a GET
// predict: Which gap is larger, Q1 or Q2?
const xhttp = new XMLHttpRequest();
let sent = 0, headers = 0;
xhttp.onreadystatechange = function () {
  if (this.readyState == 2) headers = performance.now();
  if (this.readyState == 4) {
    const done = performance.now();
    console.log("Q1 send to response:", Math.round(done - sent), "ms");
    console.log("Q2 header to response:", Math.round(done - headers), "ms");
  }
};
xhttp.open("GET", SERVER + "/api/slow?ms=1500", true);
sent = performance.now();
xhttp.send();
```

Q1 comes out near 1500 ms, the server's wait. Q2 is a few milliseconds: `/api/slow` sends its headers only when the body is ready, and the body is small. The time stamps come from `this.readyState == 2` and `this.readyState == 4`.

## readyState, accurate and not (slide 55)

*W3schools is inaccurate about onreadystatechanged.* *The one we covered in lecture is accurate*:

| value | name | meaning |
|---|---|---|
| 0 | UNSENT | *The XHR object has been created, but open() has not been called yet.* |
| 1 | OPENED | *open() has been called.* |
| 2 | HEADERS_RECEIVED | *send() has been called, and the headers of the response are available.* |
| 3 | LOADING | *The response is being received. As data comes in, the responseText property is updated.* |
| 4 | DONE | *The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred.* |

The slide checked them in Chrome DevTools: typing `XMLHttpRequest.` lists DONE, HEADERS_RECEIVED, LOADING, OPENED and UNSENT, and `XMLHttpRequest.DONE` is 4. DONE is also reached for a 404 or 500 and for a network error (status 0), which is why code tests the status as well.

```diagram
{ "type": "grid", "title": "readyState, accurate and not", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "lecture (accurate)", "row": 0, "col": 1 }, { "id": "h2", "label": "w3schools (not accurate!)", "row": 0, "col": 2 }, { "id": "r0", "label": "0", "row": 1, "col": 0 }, { "id": "a0", "label": "UNSENT", "row": 1, "col": 1 }, { "id": "w0", "label": "request not initialized", "row": 1, "col": 2 }, { "id": "r1", "label": "1", "row": 2, "col": 0 }, { "id": "a1", "label": "OPENED", "row": 2, "col": 1 }, { "id": "w1", "label": "server connection established", "row": 2, "col": 2 }, { "id": "r2", "label": "2", "row": 3, "col": 0 }, { "id": "a2", "label": "HEADERS_RECEIVED", "row": 3, "col": 1 }, { "id": "w2", "label": "request received", "row": 3, "col": 2 }, { "id": "r3", "label": "3", "row": 4, "col": 0 }, { "id": "a3", "label": "LOADING", "row": 4, "col": 1 }, { "id": "w3", "label": "processing request", "row": 4, "col": 2 }, { "id": "r4", "label": "4", "row": 5, "col": 0 }, { "id": "a4", "label": "DONE", "row": 5, "col": 1 }, { "id": "w4", "label": "request finished and response is ready", "row": 5, "col": 2 } ], "hi": ["a2", "w2"], "caption": "Slide 55: the w3schools column is stamped not accurate!" }
```

### One request stepping through readyState 0 to 4

```widget
xhr-play
{ "method": "GET", "url": "http://localhost:8888/getscore/?name=john", "async": true, "status": 200, "predict": true }
```

## async functions return a promise (slide 52)

Async/Await is *built on top of promises, allowing you to write asynchronous code that looks more like synchronous code.* *async: When a function is declared as async, it automatically returns a promise.* *await: This is used inside async functions to wait for a promise to resolve or reject.* The slide points to w3schools for examples (`https://www.w3schools.com/js/js_async.asp`).

```js run pin async returns a promise
// predict: Write the three lines.
async function openingHours() {
  return "9 to 5";
}
console.log(openingHours());
openingHours().then((hours) => console.log(hours));
console.log("after");
```

```output
Promise {<fulfilled>: "9 to 5"}
after
9 to 5
```

`return "9 to 5";` fulfils the promise the call returns, so `console.log(openingHours());` prints a promise, not the string. The string arrives through `.then`, after the synchronous `"after"`.

## await pauses the function, not the page

The lesson's own example: code after the call keeps running while the function waits.

```js run pin await
// predict: Write the four lines.
async function loadNote() {
  console.log("2 inside, before await");
  const text = await Promise.resolve("buy milk");
  console.log("4 after await:", text);
}
console.log("1 before the call");
loadNote();
console.log("3 after the call");
```

```output
1 before the call
2 inside, before await
3 after the call
4 after await: buy milk
```

The body runs synchronously up to `await`. The rest of the function is then queued like a `.then` handler, so `"3 after the call"` prints first, even though the awaited promise is already fulfilled.

### The await desugared into a .then

```widget
event-loop-play
{ "preset": "l6-async-await" }
```

## Which functions return a promise

```js run pin which return a promise
// predict: Write the four lines.
async function a() { return "open"; }
function b() { return Promise.resolve("open"); }
function c() { return new Promise((resolve) => resolve("open")); }
function d() { new Promise((resolve) => resolve("open")); }
console.log(a());
console.log(b());
console.log(c());
console.log(d());
```

```output
Promise {<fulfilled>: "open"}
Promise {<fulfilled>: "open"}
Promise {<fulfilled>: "open"}
undefined
```

`d` creates a promise but has no `return`, so its call gives `undefined`, like any function without a return. `async function a()` returns a promise even though its body returns a plain string.

```quiz
[
  {
    "q": "When a function is declared as `async`, what does calling it return?",
    "options": ["a promise", "the value after its return, directly", "undefined until the await finishes", "a callback function"],
    "answer": 0,
    "explain": "Slide 52: *When a function is declared as async, it automatically returns a promise.* Its `return` value becomes the promise's value."
  },
  {
    "q": "What prints?",
    "code": "async function price() {\n  console.log(\"b\");\n  const p = await Promise.resolve(12);\n  console.log(\"d\", p);\n  return p * 2;\n}\nconsole.log(\"a\");\nprice().then((v) => console.log(\"e\", v));\nconsole.log(\"c\");",
    "options": ["a / b / c / d 12 / e 24", "a / b / d 12 / e 24 / c", "a / c / b / d 12 / e 24", "a / b / c / e 24 / d 12"],
    "answer": 0,
    "explain": "`a` is synchronous; the call runs the body up to the `await`, logging `b`; the function pauses and `c` prints. The rest runs as a microtask: `d 12`; returning 24 fulfils the function's promise, so the `.then` logs `e 24`."
  },
  {
    "q": "What prints?",
    "code": "async function check() {\n  try {\n    await Promise.reject(new Error(\"offline\"));\n    console.log(\"saved\");\n  } catch (e) {\n    console.log(\"caught\", e.message);\n  }\n}\ncheck();\nconsole.log(\"sync\");",
    "options": ["sync / caught offline", "caught offline / sync", "saved / sync", "sync / saved"],
    "answer": 0,
    "explain": "The `await` pauses `check`, so `sync` prints first. The awaited promise is rejected, so `await` throws inside the function: the `saved` line is skipped and the `catch` logs `caught offline`."
  },
  {
    "q": "Which function does not return a promise?",
    "options": ["`function e() { const p = Promise.resolve(1); }`", "`async function f() { return 1; }`", "`function g() { return Promise.reject(1); }`", "`function h() { return new Promise((res) => res(1)); }`"],
    "answer": 0,
    "explain": "`e` creates a promise but never returns it, so calling it gives `undefined`. An async function always returns a promise, and the other two return the promise they create."
  },
  {
    "q": "Fill in the readyState names from slide 55.",
    "type": "fill",
    "code": "0 ___\n1 ___\n2 ___\n3 ___\n4 ___",
    "answer": ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"],
    "explain": "The accurate table on slide 55, the same names DevTools lists under `XMLHttpRequest.`."
  },
  {
    "q": "readyState 2 means the request was received by the server.",
    "type": "tf",
    "answer": false,
    "explain": "That is the w3schools wording slide 55 stamps *not accurate!*. 2 is HEADERS_RECEIVED: *send() has been called, and the headers of the response are available.*"
  },
  {
    "q": "Promises were designed to behave like async try/catch blocks.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 33. Returning in a handler is the success path (resolve), throwing is the failure path (reject)."
  },
  {
    "q": "Slide 40 makes an AJAX call to server A, then one to server B that needs A's result. How does the slide guarantee the order?",
    "options": ["call myFunc2 inside myFunc1's readyState 4 and status 200 branch", "call myFunc1() and then myFunc2() on the next line", "open both requests with async set to true", "call myFunc2 first, since PATCH is faster than GET"],
    "answer": 0,
    "explain": "*A: calling myFunc2 inside myFunc1, line 65.* Calling them one after the other only starts both requests; the second could finish first. Nesting each call in the previous callback is what leads to callback hell."
  },
  {
    "type": "free",
    "q": "Slide 40 nests the second AJAX call inside the first call's callback. Describe how to write the same two calls as a promise chain.",
    "model": "Wrap each XHR in a function that returns `new Promise((resolve, reject) => …)`; call `resolve` with the response in the `readyState == 4 && status == 200` branch and `reject` otherwise. Then `getScore().then(score => updateScore(score)).then(result => …).catch(err => …)`: the first handler returns the second call's promise, so the next `.then` waits for it, and one `.catch` at the end handles a failure of either call.",
    "points": ["wrap each request in new Promise", "resolve in the readyState 4 and status 200 branch", "reject on failure", "start the second call in the first .then and return its promise", "one .catch at the end of the chain"],
    "explain": "The chain stays flat however many calls follow, instead of nesting deeper (callback hell). With `async`/`await` the same steps read top to bottom inside try/catch."
  }
]
```
