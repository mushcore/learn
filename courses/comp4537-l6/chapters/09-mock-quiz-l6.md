---
title: "Mock quiz: Lecture 6"
minutes: 25
---

Thirty items on lecture 6, in the mix of the two promise quizzes: mostly output order, then states, return types, the slide facts and three written answers. Every program's key is the output the program really prints. Write each output on paper before you look at the options.

```quiz
[
  {
    "q": "What prints?",
    "code": "const order = new Promise((resolve) => {\n  console.log(\"menu\");\n  resolve(\"soup\");\n});\norder.then((dish) => console.log(dish));\nconsole.log(\"drinks\");",
    "options": ["menu / drinks / soup", "drinks / menu / soup", "menu / soup / drinks", "drinks / soup"],
    "answer": 0,
    "explain": "The executor runs the moment the promise is created (slide 16), so `menu` comes first; `drinks` is the next synchronous line; the handler `soup` waits for the call stack."
  },
  {
    "q": "What prints?",
    "code": "const pending = new Promise(() => {\n  console.log(\"x\");\n});\npending.then(() => console.log(\"y\")).then(() => console.log(\"z\"));\nconsole.log(\"w\");",
    "options": ["x / w", "x / w / y / z", "w / x", "x / y / z / w"],
    "answer": 0,
    "explain": "The executor never calls `resolve` or `reject`, so the promise stays pending forever and neither handler ever runs. Only the two synchronous logs print."
  },
  {
    "q": "What prints?",
    "code": "new Promise((resolve) => {\n  console.log(\"load\");\n  resolve();\n})\n  .then(() => console.log(\"parse\"))\n  .then(() => console.log(\"render\"));\nconsole.log(\"idle\");",
    "options": ["load / idle / parse / render", "idle / load / parse / render", "load / parse / render / idle", "idle / load"],
    "answer": 0,
    "explain": "`load` runs inside the executor, `idle` is synchronous, then the two handlers run in chain order once the stack is empty."
  },
  {
    "q": "What prints?",
    "code": "const ticket = new Promise((resolve, reject) => {\n  resolve(\"seat 7\");\n  resolve(\"seat 8\");\n  reject(\"sold out\");\n});\nticket.then((s) => console.log(s), (e) => console.log(e));",
    "options": ["seat 7", "seat 8", "seat 7 / seat 8 / sold out", "sold out"],
    "answer": 0,
    "explain": "The first `resolve` settles the promise; the later `resolve` and `reject` are ignored (slide 24: once settled, the state does not change)."
  },
  {
    "q": "What prints?",
    "code": "const ticket = new Promise((resolve, reject) => {\n  reject(\"sold out\");\n  resolve(\"seat 9\");\n});\nticket.then((s) => console.log(\"got\", s)).catch((e) => console.log(\"no:\", e));",
    "options": ["no: sold out", "got seat 9", "got seat 9 / no: sold out", "no: sold out / got seat 9"],
    "answer": 0,
    "explain": "`reject` runs first and wins. The `.then` has no rejection handler, so the rejection passes to the `.catch`."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(\"cached\").then((v) => console.log(v));\nconsole.log(\"fresh\");",
    "options": ["fresh / cached", "cached / fresh", "cached", "fresh"],
    "answer": 0,
    "explain": "Slide 25: handlers passed to `then()` *will never be called synchronously, even with an already-resolved promise.*"
  },
  {
    "q": "What prints?",
    "code": "console.log(\"1\");\nsetTimeout(() => console.log(\"2\"), 0);\nnew Promise((resolve) => {\n  console.log(\"3\");\n  resolve();\n  console.log(\"4\");\n}).then(() => console.log(\"5\"));\nconsole.log(\"6\");",
    "options": ["1 / 3 / 4 / 6 / 5 / 2", "1 / 6 / 3 / 4 / 5 / 2", "1 / 3 / 5 / 4 / 6 / 2", "1 / 3 / 4 / 6 / 2 / 5"],
    "answer": 0,
    "explain": "Synchronous: 1, the executor's 3 and 4 (the code after `resolve` still runs), 6. Microtask: 5. Timer last: 2."
  },
  {
    "q": "What prints?",
    "code": "setTimeout(() => {\n  console.log(\"t1\");\n  Promise.resolve().then(() => console.log(\"m2\"));\n}, 0);\nPromise.resolve().then(() => {\n  console.log(\"m1\");\n  setTimeout(() => console.log(\"t2\"), 0);\n});",
    "options": ["m1 / t1 / m2 / t2", "t1 / m2 / m1 / t2", "m1 / t1 / t2 / m2", "m1 / t2 / t1 / m2"],
    "answer": 0,
    "explain": "The microtask `m1` runs first and only then sets the `t2` timer, behind `t1`. After `t1` runs, its microtask `m2` drains before `t2`."
  },
  {
    "q": "What prints?",
    "code": "setTimeout(() => console.log(\"c\"), 20);\nsetTimeout(() => console.log(\"b\"), 0);\nPromise.resolve().then(() => console.log(\"a\"));",
    "options": ["a / b / c", "c / b / a", "b / c / a", "a / c / b"],
    "answer": 0,
    "explain": "The microtask `a` runs before any timer; the timers then fire in delay order, 0 ms before 20 ms, whatever order they were set in."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(2)\n  .then((n) => n + 3)\n  .then((n) => n * n)\n  .then((n) => console.log(n));",
    "options": ["25", "5", "7", "10"],
    "answer": 0,
    "explain": "Each returned value fulfils the next promise (slide 31): 2 + 3 = 5, then 5 × 5 = 25."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(\"draft\")\n  .then((d) => { console.log(d); })\n  .then((d) => console.log(d));",
    "options": ["draft / undefined", "draft / draft", "draft", "undefined / draft"],
    "answer": 0,
    "explain": "The first handler has no `return`, so it returns `undefined`, and that is the value the next promise is fulfilled with."
  },
  {
    "q": "What prints?",
    "code": "Promise.reject(\"expired\")\n  .then((v) => console.log(\"use\", v), (e) => console.log(\"renew\", e))\n  .catch((e) => console.log(\"catch\", e));",
    "options": ["renew expired", "catch expired", "renew expired / catch expired", "use expired"],
    "answer": 0,
    "explain": "The rejection is handled by the `.then`'s second function. It returns normally, so the next promise is fulfilled and the `.catch` does nothing."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(\"ok\")\n  .then(\n    () => { throw new Error(\"parse failed\"); },\n    (e) => console.log(\"handler 2:\", e.message)\n  )\n  .catch((e) => console.log(\"catch:\", e.message));",
    "options": ["catch: parse failed", "handler 2: parse failed", "handler 2: parse failed / catch: parse failed", "nothing"],
    "answer": 0,
    "explain": "The throw rejects the promise this `.then` returns. Its own second function watches the earlier promise, which was fulfilled, so it never runs; the `.catch` handles the error."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve()\n  .then(() => console.log(\"step 1\"))\n  .then(() => { throw new Error(\"stop\"); })\n  .then(() => console.log(\"step 3\"))\n  .catch(() => console.log(\"recovered\"))\n  .then(null, () => console.log(\"second catch\"));",
    "options": ["step 1 / recovered", "step 1 / recovered / second catch", "step 1 / step 3 / recovered", "step 1 / second catch"],
    "answer": 0,
    "explain": "The throw skips `step 3`. The `.catch` recovers, so its promise is fulfilled and `.then(null, …)` has nothing to handle."
  },
  {
    "q": "What prints?",
    "code": "Promise.reject(new Error(\"jam\"))\n  .catch((e) => { console.log(\"fix\", e.message); return \"fixed\"; })\n  .finally(() => console.log(\"log\"))\n  .then((v) => console.log(v));",
    "options": ["fix jam / log / fixed", "fix jam / fixed / log", "log / fix jam / fixed", "fix jam / log / undefined"],
    "answer": 0,
    "explain": "The `.catch` handles the error and returns `fixed`. `.finally` runs when that promise settles and passes `fixed` through, so the last handler logs it."
  },
  {
    "q": "What is the state of `p` after this code runs?",
    "code": "const p = new Promise((resolve, reject) => {\n  reject(\"no stock\");\n  resolve(\"in stock\");\n});",
    "options": ["rejected", "fulfilled", "pending", "undefined"],
    "answer": 0,
    "explain": "`reject` is called first and settles the promise; the later `resolve` is ignored. (With no rejection handler, the console also reports `Uncaught (in promise) no stock`.)"
  },
  {
    "q": "What is the state of `p` right after this code runs?",
    "code": "const p = new Promise((resolve) => {\n  setTimeout(() => resolve(\"ready\"), 1000);\n});",
    "options": ["pending", "fulfilled", "rejected", "undefined"],
    "answer": 0,
    "explain": "`resolve` will be called only after 1 second, so for now the promise is pending, like the before view on slide 37."
  },
  {
    "q": "Which function does not return a promise when called?",
    "options": ["`function load() { Promise.resolve(1); }`", "`async function load() {}`", "`function load() { return Promise.reject(new Error(\"x\")); }`", "`function load() { return new Promise((res) => res(1)); }`"],
    "answer": 0,
    "explain": "The first creates a promise but has no `return`, so it returns `undefined`. An `async` function returns a promise even with an empty body (fulfilled with `undefined`)."
  },
  {
    "q": "What type does this function return upon invocation?",
    "code": "function greet(name) {\n  const msg = \"Hi \" + name;\n  console.log(msg);\n}",
    "options": ["undefined", "string", "object", "another function"],
    "answer": 0,
    "explain": "It logs a string but returns nothing, so the call's value is `undefined`; `typeof greet(\"Ana\")` is `\"undefined\"`."
  },
  {
    "q": "Which of these are asynchronous: their callback or result comes later? Select all.",
    "options": ["`setInterval(f, 500)`", "`fetch(url)`", "`[3, 4].map(f)`", "`JSON.parse(text)`"],
    "answer": [0, 1],
    "explain": "`setInterval` queues its callback as a timer and `fetch` returns a promise that settles when the response arrives. `map` runs its callback synchronously, and `JSON.parse` returns at once."
  },
  {
    "q": "Which states are called settled? Select all.",
    "options": ["fulfilled", "rejected", "pending", "resolving"],
    "answer": [0, 1],
    "explain": "Slide 14 circles Fulfilled and Rejected and labels them Settled. Pending is the state before either."
  },
  {
    "q": "The executor function passed to the Promise constructor runs only when `.then` is called.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 17, callout 3: the executer *gets executed immediately upon creation of the promise object*. Slide 19: *Promises are eager.*"
  },
  {
    "q": "`.catch(errorHandlingFunction)` is the same as:",
    "options": ["`.then(null, errorHandlingFunction)`", "`.then(errorHandlingFunction)`", "`.then(errorHandlingFunction, null)`", "`.finally(errorHandlingFunction)`"],
    "answer": 0,
    "explain": "Slide 46: *If we're interested only in errors, then we can use null as the first argument.* A single function passed to `.then` is the success handler."
  },
  {
    "q": "Updating only the phone number field of a patient record, leaving the rest unchanged, matches which verb on slide 3?",
    "options": ["PATCH", "PUT", "POST", "GET"],
    "answer": 0,
    "explain": "Slide 3: *PATCH: updating only a property of an object*; *PUT: replacing an object entirely with something new.* PUT is idempotent, POST is not."
  },
  {
    "q": "Which statement about promises is incorrect?",
    "options": ["Once fulfilled, a promise becomes rejected if `reject` is called later", "A promise represents a single asynchronous operation that hasn't completed yet", "The executor runs the moment the promise object is created", "Fulfilled and rejected together are the settled states"],
    "answer": 0,
    "explain": "A settled promise never changes state: a later `reject` is ignored (slides 17 and 24). The other three are slides 16, 17 and 14."
  },
  {
    "q": "Name the property: an operation that can be applied multiple times without changing the result.",
    "type": "text",
    "answer": ["idempotent", "idempotency", "idempotence"],
    "explain": "Slide 3's box. PUT is idempotent; repeated identical POSTs *may have additional effects, e.g. leading to placing an order several times.*"
  },
  {
    "q": "Fill in the readyState names.",
    "type": "fill",
    "code": "0 ___\n1 ___\n2 ___\n3 ___\n4 ___",
    "answer": ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"],
    "explain": "Slide 55's accurate table. The w3schools version (request not initialized, server connection established, request received, processing request, request finished) is stamped not accurate."
  },
  {
    "type": "free",
    "q": "Explain what idempotent means, using PUT and POST as the examples.",
    "model": "Idempotent: can be applied multiple times without changing the result. PUT replaces an object entirely with something new, so calling it once or several times successively has the same effect. Successive identical POST requests may have additional effects, for example placing an order several times, so POST is not idempotent.",
    "points": ["same result whether applied once or many times", "PUT replaces the whole object, so repeating it leaves the same state", "repeating a POST can add effects each time", "example: an order placed several times"],
    "explain": "Slide 3, nearly word for word."
  },
  {
    "type": "free",
    "q": "Why does a function doing asynchronous work need something like a promise instead of a plain return value?",
    "model": "With an asynchronous call (any call over the net) we need not only the returned value but also how it came back: success, or a failure such as timed-out, DB is down or authentication error. A function returns only one thing, and the result is not ready when it returns. A promise is one object that is pending now and later settles: resolve passes the value to the success handler, reject passes the reason to the failure handler. Chaining `.then` also avoids nesting callbacks inside callbacks (callback hell).",
    "points": ["the result arrives later; the function has already returned", "we need the outcome (success or failure) as well as the value", "a function returns only one thing", "a promise carries both: resolve for success, reject for failure", "chains avoid callback hell"],
    "explain": "Slides 8 to 10 and 40."
  },
  {
    "type": "free",
    "q": "Compare `async`/`await` with `.then`/`.catch`.",
    "model": "Async/await is built on top of promises and lets asynchronous code look like synchronous code (slide 52). An `async` function automatically returns a promise; `await`, used inside it, waits for a promise to resolve or reject, pausing only that function while the rest of the program keeps running. A rejection becomes an exception caught by `try`/`catch`, which plays the role of `.catch`, just as promises were designed to behave like async try/catch blocks (slide 33).",
    "points": ["async/await is built on promises", "an async function always returns a promise", "await waits for a promise inside an async function and pauses only that function", "try/catch around await does what .catch does", "same behaviour, code that reads like synchronous code"],
    "explain": "Slides 33 and 52; the try/catch pairing is shown in lesson 07."
  }
]
```
