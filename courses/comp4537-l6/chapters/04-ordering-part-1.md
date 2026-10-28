---
title: "Synchronous code first, then the handlers: Examples 1 to 6"
minutes: 18
---

Given a short program with promises, write its console output in order. Slides 20 to 27 drill the first half of the rule: the synchronous code, executors included, finishes before any `.then` handler runs.

<!-- facts: s21 Ex1; s22 Ex2; s23 Ex3; s24 Ex4; s25 Ex5; s26 then returns a promise; s27 Ex6 -->

## Synchronous code, then microtasks, then timers

Slide 17's grey note gives the rule: resolve and reject change the state at once, *which lead to put handlers in microtask and run only after the current call stack finishes*. The examples below have no timers yet; lesson 05 adds the third band.

```diagram
{ "type": "layers", "title": "Three places code waits", "nodes": [ { "id": "s", "label": "call stack: synchronous code, the executor" }, { "id": "m", "label": "microtask queue: .then handlers" }, { "id": "t", "label": "timer queue: setTimeout, setInterval" } ], "hi": ["s", "m"], "caption": "The slide's steps drawn: they wait only for the current call stack to unwind." }
```

## The executor runs at once, the handler after the stack (slides 21 and 22)

### Example 1 on slide 21

```js run pin example1.js
// predict:
let promise = new Promise(
    function (resolve, reject) {
        // do some stuff
        console.log("2 called immediately ");
        resolve("4 Resolved!");// called asynchronously & mutually exclusive
        reject("3 Rejected!");// called asynchronously & mutually exclusive
        console.log("5 called immediately ");//pending ..
    }
);
console.log("1 Main execution stack");
promise.then(
    function (resMessage) {
        console.log(resMessage);
    },
    function (rejMessage) {
        console.log(rejMessage)
    }
);
```

```output
2 called immediately
5 called immediately
1 Main execution stack
4 Resolved!
```

The slide's answer box: 2 because *the executor will invoke the moment the promise constructor is called*; 5 because 2 and 5 *execute synchronously*; `console.log("1 Main execution stack")` because it *executes synchronously as it is in the same execution stack*; 4 *invokes asynchronously and mutually exclusive*, so `reject("3 Rejected!")` never logs. The cloud on the slide: *Resolve and reject are called synchronously to change the state of Promise immediately which in turn invokes the corresponding handlers asynchronously and mutually exclusive.* The code comments say "called asynchronously"; the cloud is the accurate one.

### Example 1 stepping through the queues

```widget
event-loop-play
{ "preset": "l6-ex1", "predict": true }
```

### Example 2 on slide 22

```js run pin example2.js
// predict:
console.log("7");
let promise = new Promise(
    function (resolve, reject) {
        resolve("4");
        console.log("2");
        reject("3");
        console.log("5");
    }
);
console.log("1");
promise.then(
    function (resMessage) {
        console.log(resMessage);
    },
    function (rejMessage) {
        console.log(rejMessage)
    }
);
console.log("8");
```

```output
7
2
5
1
8
4
```

The slide's answer is 7 2 5 1 8 4. `resolve("4")` settles the promise, so `reject("3")` is ignored. `console.log("8")` is the last line of the script, yet it beats 4: the handler waits for the stack, not for its position in the file.

```diagram
{ "type": "sequence", "title": "Example 2 on slide 22", "nodes": [ { "id": "s", "label": "script", "kind": "lane" }, { "id": "p", "label": "promise", "kind": "lane" }, { "id": "q", "label": "microtask queue", "kind": "lane" }, { "id": "c", "label": "console", "kind": "lane" } ], "edges": [ { "from": "s", "to": "c", "label": "7" }, { "from": "s", "to": "p", "label": "run executor" }, { "from": "p", "to": "p", "label": "resolve: fulfilled" }, { "from": "p", "to": "c", "label": "2" }, { "from": "p", "to": "p", "label": "reject ignored" }, { "from": "p", "to": "c", "label": "5" }, { "from": "s", "to": "c", "label": "1" }, { "from": "s", "to": "q", "label": "then: queue handler" }, { "from": "s", "to": "c", "label": "8" }, { "from": "q", "to": "c", "label": "stack empty: 4" } ], "hi": ["9", "10"], "caption": "8 is synchronous, so it logs before the queued handler." }
```

## A settled promise does not change (slides 23 and 24)

### Example 3 on slide 23

```js run pin example3.js
// predict:
let promise = new Promise(
    function (resolve, reject) {
        console.log(" 2 ");
        reject(" 3 ");
        resolve(" 4 ");
        console.log(" 5 ");
    }
);
promise.then(
    function (st) {
        console.log(st);
    },
    function (st) {
        console.log(st)
    }
);
console.log(" 1 ");
```

```output
 2
 5
 1
 3
```

The slide's answer is 2 5 1 3, and it asks *what happened to 4?* It gives no answer; worked out from slide 17's grey note: `reject(" 3 ")` already settled the promise, so `resolve(" 4 ")` is ignored.

### Example 4 on slide 24

*How many times "Hi" will be logged?* The slide's code:

```js
let promise = new Promise((res) => {
    setInterval(() => {
        res("Hi");
    }, 100);
});
promise.then((mes)=>{console.log(mes)});
```

That interval is never cleared, so the copy below adds two lines to let the run end:

```js run pin example4.js
// predict:
let promise = new Promise((res) => {
    const id = setInterval(() => {   // id added
        res("Hi");
    }, 100);
    setTimeout(() => clearInterval(id), 1000); // added so the run ends
});
promise.then((mes)=>{console.log(mes)});
```

```output
Hi
```

*Hi will be logged only once.* The tip: *Once they are settled, their state will not change. If the promise has already been resolved to a value to a rejection or to another promise, then the res method does nothing.* `res("Hi")` runs ten times; only the first changes anything, and `(mes)=>{console.log(mes)}` runs once.

### Example 4: ten calls, one state change

```widget
event-loop-play
{ "preset": "l6-ex4" }
```

## Promise.resolve still waits for the stack (slide 25)

*Promise.resolve() and Promise.reject() are shortcuts to manually create an already resolved or rejected promise respectively.*

```js run pin example5.js
// predict:
Promise.resolve().then(() => console.log(1));
console.log(2);
```

```output
2
1
```

The promise from `Promise.resolve()` is fulfilled before `.then` is even called, yet `console.log(2)` wins: functions passed to `then()` *will never be called synchronously, even with an already-resolved promise*. The slide's "which means resolve and reject" refers to those handlers.

## then returns a promise, so calls chain (slides 26 and 27)

Slide 26: *The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.* The returned promise is why a second `.then` can follow the first. The slide's pseudo-code:

```text
function return (new Promise) ).then(()=>{return (new Promise)}).then
promise.then()
```

### Example 6 on slide 27

```js run pin example6.js
// predict:
new Promise(resolve => {
  resolve(1);
})
  .then(a => {
    console.log("First:", a);
    return a * 2;
  })
  .then(b => {
    console.log("Second:", b);
    return b * 3;
  })
  .then(c => {
    console.log("Final:", c);
  });
```

```output
First: 1
Second: 2
Final: 6
```

The slide prints no answer; running it gives the three lines above. Each `return` becomes the value the next handler receives: `return a * 2` hands on 2, `return b * 3` hands on 6.

```diagram
{ "type": "flow", "title": "Example 6 on slide 27, value flow", "nodes": [ { "id": "r", "label": "resolve(1)" }, { "id": "a", "label": "a = 1", "sub": "return a * 2" }, { "id": "b", "label": "b = 2", "sub": "return b * 3" }, { "id": "c", "label": "c = 6" }, { "id": "f", "label": "Final: 6", "kind": "note" } ], "edges": [ { "from": "r", "to": "a", "label": "1" }, { "from": "a", "to": "b", "label": "2" }, { "from": "b", "to": "c", "label": "6" }, { "from": "c", "to": "f" } ], "hi": ["a", "b", "c"], "caption": "The then() method returns a Promise, and each return value fulfils it." }
```

## Order a bookstore's promises

Four new programs. Mark each line stack or microtask before you choose.

```quiz
[
  {
    "q": "Put the lines this program prints in order.",
    "type": "reorder",
    "code": "console.log(\"till open\");\nconst order = new Promise((resolve, reject) => {\n  console.log(\"picking books\");\n  resolve(\"order 12 packed\");\n  reject(\"out of stock\");\n  console.log(\"label printed\");\n});\nconsole.log(\"next customer\");\norder.then((m) => console.log(m), (e) => console.log(e));\nconsole.log(\"till closed\");",
    "lines": ["till open", "picking books", "label printed", "next customer", "till closed", "order 12 packed"],
    "explain": "Stack: `till open`; the executor runs at once, `picking books`, `resolve` fulfils, `reject` is ignored, `label printed`; then `next customer`; `.then` queues the handler; `till closed`. Stack empty: the microtask logs `order 12 packed`. `out of stock` never prints."
  },
  {
    "q": "What does this print?",
    "code": "let count = 0;\nconst reading = new Promise((res) => {\n  const id = setInterval(() => {\n    count++;\n    res(\"reading \" + count);\n    if (count === 3) clearInterval(id);\n  }, 50);\n});\nreading.then((r) => console.log(r));\nsetTimeout(() => console.log(\"count is \" + count), 400);",
    "options": ["reading 1 / count is 3", "reading 1 / reading 2 / reading 3 / count is 3", "reading 3 / count is 3", "reading 1 / count is 1"],
    "answer": 0,
    "explain": "The interval fires three times, so `count` reaches 3, but only the first `res(\"reading 1\")` settles the promise; the next two do nothing (slide 24). The handler logs `reading 1` once; at 400 ms the timer logs `count is 3`."
  },
  {
    "q": "What does this print?",
    "code": "Promise.reject(\"no stock\").then(\n  (v) => console.log(\"got \" + v),\n  (e) => console.log(\"caught \" + e)\n);\nconsole.log(\"browsing\");",
    "options": ["browsing / caught no stock", "caught no stock / browsing", "browsing / got no stock", "caught no stock"],
    "answer": 0,
    "explain": "`Promise.reject` makes an already rejected promise (slide 25), so the second handler is the one that runs, but still as a microtask: the synchronous `browsing` logs first."
  },
  {
    "q": "What does this print?",
    "code": "new Promise((resolve) => resolve(5))\n  .then((n) => { console.log(\"books:\", n); return n + 3; })\n  .then((n) => { console.log(\"after delivery:\", n); return n * 2; })\n  .then((n) => console.log(\"on shelf:\", n));\nconsole.log(\"store open\");",
    "options": ["store open / books: 5 / after delivery: 8 / on shelf: 16", "books: 5 / after delivery: 8 / on shelf: 16 / store open", "store open / books: 5 / after delivery: 10 / on shelf: 16", "store open / books: 5 / after delivery: 8 / on shelf: 13"],
    "answer": 0,
    "explain": "`store open` is synchronous. Then the chain: 5 is logged and 5 + 3 = 8 is returned; 8 is logged and 8 × 2 = 16 is returned; 16 is logged. Each return fulfils the promise the `.then` returned (slide 26)."
  }
]
```

```quiz
[
  {
    "q": "Resolve and reject are called synchronously to change the state of the promise immediately, and the corresponding handlers are invoked asynchronously.",
    "type": "tf",
    "answer": true,
    "explain": "The cloud on slide 21. The comments in that slide's code say \"called asynchronously\", but the calls are synchronous; only the handlers wait."
  },
  {
    "q": "What does this print?",
    "code": "const loadNotes = () => new Promise((resolve) => {\n  console.log(\"reading file\");\n  resolve(\"3 notes\");\n});\nloadNotes().then((n) => console.log(n));\nconsole.log(\"page drawn\");",
    "options": ["reading file / page drawn / 3 notes", "page drawn / reading file / 3 notes", "reading file / 3 notes / page drawn", "page drawn / 3 notes"],
    "answer": 0,
    "explain": "Calling `loadNotes()` constructs the promise, so its executor logs `reading file` at once. The handler is queued; `page drawn` is still on the stack, so it logs before `3 notes`."
  },
  {
    "q": "What does this print?",
    "code": "const reply = new Promise((resolve, reject) => {\n  console.log(\"waiting for clinic\");\n});\nreply.then(() => console.log(\"confirmed\")).then(() => console.log(\"reminder set\"));\nconsole.log(\"form sent\");",
    "options": ["waiting for clinic / form sent", "waiting for clinic / form sent / confirmed / reminder set", "form sent / waiting for clinic", "waiting for clinic / confirmed / reminder set / form sent"],
    "answer": 0,
    "explain": "The executor never calls `resolve` or `reject`, so the promise stays pending forever and neither handler runs. Only the executor's line and the synchronous `form sent` print."
  },
  {
    "q": "What does this print?",
    "code": "new Promise((resolve) => {\n  console.log(\"forecast requested\");\n  resolve();\n})\n  .then(() => console.log(\"rain at 3pm\"))\n  .then(() => console.log(\"umbrella alert\"));\nconsole.log(\"app ready\");",
    "options": ["forecast requested / app ready / rain at 3pm / umbrella alert", "app ready / forecast requested / rain at 3pm / umbrella alert", "forecast requested / rain at 3pm / umbrella alert / app ready", "forecast requested / app ready / umbrella alert / rain at 3pm"],
    "answer": 0,
    "explain": "Executor first, synchronously; then the last line `app ready`; then the handlers in chain order, each after the one before it has fulfilled its promise."
  },
  {
    "q": "A promise has already been resolved. Calling its `res` method again with a new value changes its value.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 24: *If the promise has already been resolved to a value to a rejection or to another promise, then the res method does nothing.*"
  },
  {
    "q": "Functions passed to `then()` run synchronously when the promise is already resolved.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 25: they *will never be called synchronously, even with an already-resolved promise*. That is why `Promise.resolve().then(() => console.log(1)); console.log(2);` prints 2 then 1."
  },
  {
    "q": "What does `Promise.resolve()` create?",
    "options": ["an already resolved promise", "a pending promise that resolves after 0 ms", "the value undefined", "a function that resolves a promise"],
    "answer": 0,
    "explain": "Slide 25: *Promise.resolve() and Promise.reject() are shortcuts to manually create an already resolved or rejected promise respectively.*"
  },
  {
    "q": "Name the queue where `.then` handlers wait until the current call stack finishes.",
    "type": "text",
    "answer": ["microtask", "microtask queue", "the microtask queue", "microtasks"],
    "explain": "Slide 17's grey note: resolve and reject *put handlers in microtask and run only after the current call stack finishes*."
  },
  {
    "q": "Why can a second `.then` be called on the result of the first?",
    "options": ["then() returns a Promise", "then() returns the handler's value directly", "then() returns the original promise unchanged", "then() returns undefined, which any method can be called on"],
    "answer": 0,
    "explain": "Slide 26 and note 5 of the gray slide: *The then() method returns a Promise. That's why we can chain promises.*"
  }
]
```
