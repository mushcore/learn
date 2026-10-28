---
title: Node.js on V8 and the restaurant analogy
minutes: 15
---

Slide 12 claimed Node.js is ready for the next request while a file is still being read. The restaurant analogy shows how one worker can do that, and what goes wrong when it cannot.

<!-- facts: slide 10 node.js for server side backend; slide 11 open source free server environment, open-source cross-platform runtime on Chrome V8 outside a web browser; slide 13 asynchronous single threaded nonblocking; slides 15-17 Examples 1-3; slide 18 mapping; slide 19 Example 1 one waiter serves everyone; slide 20 single thread; slide 21 ASP.Net blocking, not utilizing resources; slides 22-23 100 requests 100 threads -->

## Node.js runs JavaScript outside a web browser (slides 10 and 11)

*In this course, we are going to use node.js for server side (backend) scripting.* Slide 11 gives two definitions. The short one: *Node.js is an open source, free, server environment that uses JavaScript on the server side.* The long one, from Wikipedia: *Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the Chrome V8 engine and executes JavaScript code outside a web browser.*

So the language is the same JavaScript as lectures 1 to 3; only the place it runs changes. V8 is the engine inside Chrome; Node.js wraps it with modules for files and networking instead of a page and a DOM.

## Three restaurants, two tables, one kitchen (slides 13 to 17)

Slide 13 repeats the claim to be explained: *JS is asynchronous, single threaded, nonblocking*. Each restaurant has a kitchen, Table 1 and Table 2. A table is a request, the kitchen is the slow work (reading a file, querying a database), and the waiter is the thread that runs the code.

- **Example 1** (slide 15): *Same waiter can serve multiple tables*.
- **Example 2** (slide 16): *Same waiter can serve multiple tables, but every time waits for the chief to prepare the meal then (and only then) takes another order.*
- **Example 3** (slide 17): *Multiple waiters*, *Each dedicated to a single table only!*

### Example 1: the waiter takes order 2 while meal 1 cooks

Watch the waiter leave the kitchen as soon as order 1 is handed in. With predict on, pick the table the waiter goes to next.

```widget
node-server-play
{ "mode": "restaurant", "example": 1, "predict": true }
```

### Example 2: the waiter stands at the kitchen

The same two tables, but the idle-time counter climbs while the waiter waits for meal 1 before Table 2 is even asked.

```widget
node-server-play
{ "mode": "restaurant", "example": 2 }
```

### Example 3: one waiter per table

Nobody waits for a waiter here, but every table costs a waiter of its own.

```widget
node-server-play
{ "mode": "restaurant", "example": 3 }
```

## Example 1 is Node.js (slides 18 to 20)

Slide 18 names the three architectures, in this order:

```diagram
{ "type": "grid", "title": "The restaurant analogy", "nodes": [ { "id": "h0", "label": "Example", "row": 0, "col": 0 }, { "id": "h1", "label": "the waiter", "row": 0, "col": 1 }, { "id": "h2", "label": "architecture", "row": 0, "col": 2 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "one waiter serves every table", "row": 1, "col": 1 }, { "id": "a2", "label": "single threaded non-blocking (asynchronous)", "row": 1, "col": 2 }, { "id": "b0", "label": "2", "row": 2, "col": 0 }, { "id": "b1", "label": "one waiter waits at the kitchen", "row": 2, "col": 1 }, { "id": "b2", "label": "single threaded blocking (synchronous)", "row": 2, "col": 2 }, { "id": "c0", "label": "3", "row": 3, "col": 0 }, { "id": "c1", "label": "one waiter per table", "row": 3, "col": 1 }, { "id": "c2", "label": "multi-threaded", "row": 3, "col": 2 } ], "hi": ["a0", "a1", "a2"], "caption": "JavaScript(nodejs) is Single threaded Asynchronous(non blocking) just like the restaurant in Example 1 ( one waiter serves everyone)" }
```

Example 2 also has one waiter, so it is single threaded too; what makes it blocking is the waiting. Only Example 3 is multi-threaded. Slide 20 redraws Example 1 with the waiter labelled "Single Thread": *Same waiter can server multiple tables (don't not get blocked by one table)*.

```diagram
{ "type": "flow", "title": "Non-blocking", "nodes": [ { "id": "thread", "label": "Single Thread", "sub": "the waiter" }, { "id": "t1", "label": "Table 1" }, { "id": "t2", "label": "Table 2" } ], "edges": [ { "from": "thread", "to": "t1" }, { "from": "thread", "to": "t2" } ], "hi": ["thread"], "caption": "JavaScript(nodejs) is single threaded Asynchronous(non blocking) architecture" }
```

Plain JavaScript in the browser behaves like this waiter. This runner is not on the slide: `setTimeout` hands meal 1 to the "kitchen", and the code goes on to the next order.

```js run pin waiter.js
// predict: Write the three lines in the order they print.
console.log("order 1");
setTimeout(() => console.log("meal 1 ready"), 500);
console.log("order 2");
```

```output
order 1
order 2
meal 1 ready
```

`"order 2"` prints before `"meal 1 ready"`: the `setTimeout` call returns at once, and its callback runs only when the 500 ms are up and the thread is free.

The slides key Node.js as *single-threaded*. Strictly, your JavaScript runs on one thread, while Node's library underneath (libuv) reads files on a small pool of background threads. That pool is the kitchen, which is why the one waiter is free.

## The blocking waiter wastes the resource (slides 21 to 23)

Slide 21 is titled *Blocking or synchronous (ASP. Net by nature )*. The waiter *Is not doing anything else but waiting!* and the slide asks *What's the problem here?* Its answer: *We are not utilizing our resources (the waiter) efficiently*. Classic ASP.NET request handling ties up one thread per request; modern ASP.NET can also run asynchronously with async/await.

```diagram
{ "type": "flow", "title": "Blocking or synchronous", "nodes": [ { "id": "waiter", "label": "Waiter", "sub": "Waiting for table 1 meal" }, { "id": "kitchen", "label": "Kitchen" }, { "id": "note", "label": "Is not doing anything else but waiting!", "kind": "note" }, { "id": "t1", "label": "Table 1" }, { "id": "t2", "label": "Table 2" } ], "edges": [ { "from": "waiter", "to": "kitchen" } ], "hi": ["waiter"], "caption": "We are not utilizing our resources (the waiter) efficiently" }
```

A blocking system that wants to serve several tables at once has to add waiters. Slide 22 asks *What if there are multiple requests for synchronous systems?* and pairs each request with its own thread (the slide spells it "Tread"). Slide 23: *Imaging 100 concurrent requests for a synchronous system. Then the system has to create 100 threads! ( 100 waiters!!)* The deck points to a YouTube talk on JavaScript being asynchronous for more.

```diagram
{ "type": "grid", "title": "One request, one thread", "nodes": [ { "id": "c00", "label": "", "row": 0, "col": 0 }, { "id": "c01", "label": "1", "row": 0, "col": 1 }, { "id": "c02", "label": "2", "row": 0, "col": 2 }, { "id": "c03", "label": "3", "row": 0, "col": 3 }, { "id": "c04", "label": "• •", "row": 0, "col": 4 }, { "id": "c05", "label": "100", "row": 0, "col": 5 }, { "id": "c10", "label": "Request", "row": 1, "col": 0 }, { "id": "c11", "label": "Request", "row": 1, "col": 1 }, { "id": "c12", "label": "Request", "row": 1, "col": 2 }, { "id": "c13", "label": "Request", "row": 1, "col": 3 }, { "id": "c14", "label": "• •", "row": 1, "col": 4 }, { "id": "c15", "label": "Request", "row": 1, "col": 5 }, { "id": "c20", "label": "Thread", "row": 2, "col": 0 }, { "id": "c21", "label": "Thread", "row": 2, "col": 1 }, { "id": "c22", "label": "Thread", "row": 2, "col": 2 }, { "id": "c23", "label": "Thread", "row": 2, "col": 3 }, { "id": "c24", "label": "• •", "row": 2, "col": 4 }, { "id": "c25", "label": "Thread", "row": 2, "col": 5 } ], "hi": ["c25"], "caption": "Then the system has to create 100 threads! ( 100 waiters!!)" }
```

Each extra thread costs memory, which is the slide 12 point: one non-blocking thread serving everyone is *very memory efficient*.

```quiz
[
  { "q": "Match each restaurant to its architecture.", "type": "match", "pairs": [["Example 1: one waiter serves every table", "single threaded non-blocking (asynchronous)"], ["Example 2: one waiter waits at the kitchen each time", "single threaded blocking (synchronous)"], ["Example 3: one waiter dedicated to each table", "multi-threaded"]], "explain": "Slide 18, in order: Example 1 single threaded non-blocking, Example 2 single threaded blocking, Example 3 multi-threaded." },
  { "q": "Which restaurant does slide 19 say JavaScript (Node.js) is like?", "options": ["Example 1", "Example 2", "Example 3", "None: Node.js gives every request its own waiter"], "answer": 0, "explain": "Slide 19: *just like the restaurant in Example 1 ( one waiter serves everyone)*. One waiter per table is Example 3, the multi-threaded one." },
  { "q": "Slide 21 asks what the problem is with the waiter who waits at the kitchen. Its answer:", "options": ["We are not utilizing our resources (the waiter) efficiently", "The system has to create 100 threads", "The waiter is multi-threaded", "Node.js runs on the Chrome V8 engine"], "answer": 0, "explain": "Slide 21: *We are not utilizing our resources (the waiter) efficiently*. The waiter *Is not doing anything else but waiting!*" },
  { "q": "A synchronous system receives 40 concurrent requests. How many threads does slide 23's rule say it must create?", "type": "numeric", "answer": 40, "tolerance": 0, "explain": "One request, one thread: slide 23's 100 concurrent requests need 100 threads (100 waiters), so 40 need 40." },
  { "q": "Node.js executes JavaScript code inside a web browser.", "type": "tf", "answer": false, "explain": "Slide 11: Node.js *executes JavaScript code outside a web browser*." },
  { "q": "Which engine does slide 11 say Node.js runs on?", "options": ["Chrome V8", "SpiderMonkey", "Apache", "MySQL"], "answer": 0, "explain": "Slide 11: *runs on the Chrome V8 engine*. SpiderMonkey is Firefox's engine; Apache is a web server and MySQL a database (slide 46)." },
  { "q": "Restaurant Example 2 is multi-threaded, because the waiter handles more than one table.", "type": "tf", "answer": false, "explain": "Example 2 has one waiter, so it is *single threaded blocking (synchronous)*. Only Example 3, with a waiter per table, is multi-threaded." },
  { "q": "What prints?", "code": "console.log(\"ticket A\");\nsetTimeout(() => console.log(\"report A ready\"), 300);\nconsole.log(\"ticket B\");", "options": ["ticket A, ticket B, report A ready", "ticket A, report A ready, ticket B", "report A ready, ticket A, ticket B", "ticket A, ticket B"], "answer": 0, "explain": "Like the Example 1 waiter: `setTimeout` hands the job off and returns at once, so `ticket B` prints, and the callback prints after 300 ms when the thread is free." },
  { "type": "free", "q": "Explain single-threaded non-blocking with the restaurant analogy, and contrast it with the other two examples.", "model": "The waiter is the thread and the kitchen is the slow work. In Example 1 one waiter takes order 1, hands it to the kitchen and takes order 2 while it cooks, serving each table when its meal is ready: single threaded, non-blocking (asynchronous), like Node.js. In Example 2 one waiter waits at the kitchen until each meal is ready before taking another order: single threaded but blocking (synchronous), which wastes the waiter. Example 3 gives each table its own waiter: multi-threaded, so 100 concurrent requests need 100 threads.", "points": ["one waiter = one thread", "Example 1 hands the order to the kitchen and takes the next order", "serves a table when its meal is ready (asynchronous)", "Example 2 waits at the kitchen: blocking, resource not used efficiently", "Example 3 needs one waiter per table: 100 requests, 100 threads"], "rows": 7, "explain": "Slides 15 to 23." }
]
```
