---
title: "Microtasks before timers: Examples 7 to 11 and the harder shapes"
minutes: 18
---

Lesson 04 had two places where code waits: the call stack and the microtask queue. Slides 28 to 34 add a third, the timer queue, and chains whose values travel from one `.then` to the next.

## A timer waits behind every microtask (Example 7, slide 28)

```js run pin Example 7
// predict: In what order will the numbers be logged?
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(0).then(() => console.log(2));
Promise.resolve().then(() => console.log(3)).then(() => console.log(1));
console.log(4);
```

```output
4
3
1
2
```

The slide asks *In what order the numbers will be logged?* and prints no answer; running it gives 4, 3, 1, 2. `wait(0)` wraps `setTimeout` in a promise, so its `resolve` runs only when the timer fires. `console.log(4)` is synchronous and goes first. The handler that logs 3 is a microtask; when it returns, its `.then` queues the handler that logs 1, which is also a microtask and still runs before any timer. A timer callback waits for an empty call stack and an empty microtask queue, even with 0 ms, so 2 comes last.

```diagram
{ "type": "sequence", "title": "Example 7 on slide 28", "nodes": [ { "id": "s", "label": "script", "kind": "lane" }, { "id": "m", "label": "microtask queue", "kind": "lane" }, { "id": "t", "label": "timer queue", "kind": "lane" }, { "id": "c", "label": "console", "kind": "lane" } ], "edges": [ { "from": "s", "to": "t", "label": "wait(0) sets a timer" }, { "from": "s", "to": "m", "label": "queue the 3 handler" }, { "from": "s", "to": "c", "label": "4" }, { "from": "m", "to": "c", "label": "3, queues the 1 handler" }, { "from": "m", "to": "c", "label": "1" }, { "from": "t", "to": "m", "label": "timer fires: resolve()" }, { "from": "m", "to": "c", "label": "2" } ], "hi": ["6", "7"], "caption": "Run it: 4, 3, 1, 2. The timer's resolve happens only after the microtasks have drained." }
```

### The event loop stepping through Example 7

Watch the timer column: the callback is ready from the start, but it moves only once the microtask column is empty.

```widget
event-loop-play
{ "preset": "l6-ex7", "predict": true }
```

## Where each kind of callback waits

```diagram
{ "type": "grid", "title": "Microtask or timer?", "nodes": [ { "id": "h0", "label": "code", "row": 0, "col": 0 }, { "id": "h1", "label": "runs", "row": 0, "col": 1 }, { "id": "h2", "label": "when", "row": 0, "col": 2 }, { "id": "a0", "label": "console.log, executor body", "row": 1, "col": 0 }, { "id": "a1", "label": "on the call stack", "row": 1, "col": 1 }, { "id": "a2", "label": "now", "row": 1, "col": 2 }, { "id": "b0", "label": ".then handler", "row": 2, "col": 0 }, { "id": "b1", "label": "microtask", "row": 2, "col": 1 }, { "id": "b2", "label": "once the stack is empty", "row": 2, "col": 2 }, { "id": "c0", "label": "Promise.resolve().then", "row": 3, "col": 0 }, { "id": "c1", "label": "microtask", "row": 3, "col": 1 }, { "id": "c2", "label": "once the stack is empty", "row": 3, "col": 2 }, { "id": "d0", "label": "setTimeout(f, 0)", "row": 4, "col": 0 }, { "id": "d1", "label": "timer", "row": 4, "col": 1 }, { "id": "d2", "label": "after every microtask", "row": 4, "col": 2 }, { "id": "e0", "label": "setTimeout inside a .then", "row": 5, "col": 0 }, { "id": "e1", "label": "timer", "row": 5, "col": 1 }, { "id": "e2", "label": "queued when the handler runs", "row": 5, "col": 2 }, { "id": "f0", "label": ".then inside a setTimeout", "row": 6, "col": 0 }, { "id": "f1", "label": "microtask", "row": 6, "col": 1 }, { "id": "f2", "label": "before the next timer", "row": 6, "col": 2 } ], "hi": ["d1", "d2"], "caption": "Synchronous code, then every microtask, then one timer, then the microtasks that timer queued." }
```

## catch handles the rejection (Example 8, slide 29)

```js run pin Example 8
// predict: 1. What will be logged?
const p = new Promise((resolve, reject) => {
  const success = false;
  if (success) {
    resolve("Everything worked!");
  } else {
    reject("Something went wrong");
  }
});

p.then(result => {
  console.log("SUCCESS:", result);
})
  .catch(error => {
    console.log("ERROR:", error);
  });
```

```output
ERROR: Something went wrong
```

`success` is false, so the executor calls `reject("Something went wrong")`. The `.then` was given only a success handler, so the rejection passes through the promise it returns and reaches the `.catch`, which logs `ERROR: Something went wrong` (worked out by running it; the slide shows no output).

Question 2 asks *What happens if we don't handle reject and remove catch()?* The slide's faint answer: *Unhandled reject error*. With the `.catch` removed, the console prints the red line:

```js run
const p = new Promise((resolve, reject) => {
  reject("Something went wrong");
});
p.then(result => {
  console.log("SUCCESS:", result);
});
```

```output
Uncaught (in promise) Something went wrong
```

### The rejection skipping the success handler

```widget
promise-chain-play
{ "mode": "chain", "preset": "l6-ex8" }
```

## Returning a value resolves the next promise (Example 9 on slide 30)

```js run pin Example 9 on slide 30
// predict: 1. What will be logged?
new Promise(resolve => {
  resolve(1);
})
  .then(num => {
    console.log("First:", num);
    return num * 2;
  })
  .then(num => {
    console.log("Second:", num);
    return num * 3;
  })
  .then(finalValue => {
    console.log("Final:", finalValue);
  });
```

```output
First: 1
Second: 2
Final: 6
```

This is Example 6 on slide 27 with the parameters renamed, and running it gives the same three lines: `resolve(1)` hands 1 to the first handler, and its `return num * 2;` becomes the next `num`. Slide 31 explains the arrows: *Then() returns another promise and passes* `num * 3` *to the resolve of that new promise.* Its question, *why it does not pass the* `num*3` *to the reject of the new promise?*, has this answer: *The value returned from .then() is passed to the internal resolve function of the NEW promise created by .then().* The core rule:

- *Returning a value is defined as success ( passing to resolve of new promise)*
- *Throwing an error is defined as failure ( passing to reject of new promise)*

```diagram
{ "type": "flow", "title": "Example 9 on slide 30: the red arrows", "nodes": [ { "id": "r", "label": "resolve(1)" }, { "id": "a", "label": "num", "sub": "first .then" }, { "id": "b", "label": "num", "sub": "second .then" }, { "id": "c", "label": "finalValue", "sub": "third .then" } ], "edges": [ { "from": "r", "to": "a", "label": "1" }, { "from": "a", "to": "b", "label": "num * 2" }, { "from": "b", "to": "c", "label": "num * 3" } ], "caption": "The value returned from .then() is passed to the internal resolve function of the NEW promise." }
```

## A timer can start a chain (Example 10 on slide 32)

```js run pin Example 10 on slide 32
// predict: 1. What will be logged?
new Promise(resolve => {
  setTimeout(() => resolve(2), 500);
})
  .then(num => {
    console.log("First:", num);
    return num * 3;
  })
  .then(num => {
    console.log("Second:", num);
    return num + 1;
  })
  .then(finalValue => {
    console.log("Final:", finalValue);
  });
```

```output
First: 2
Second: 6
Final: 7
```

The promise stays pending for about 500 ms. Nothing in the chain runs until `resolve(2)` is called inside the `setTimeout` callback; then the three handlers run one after another as microtasks: 2, then `num * 3` is 6, then `num + 1` is 7.

## Three random timers give any order (Example 11, slide 34)

```js run
// validator: skip
f1 = () =>{console.log(1)};
f2 = () =>{console.log(2)};
f3 = () =>{console.log(3)};

// async() does things asynchronously for us
function async(callMeBack) {
    setTimeout(() => {
        callMeBack();
    }, Math.floor(Math.random() * 1000)
    );
}
//we want f1,f2 and f3 execute in f1,f2, f3
// asynchronously How can we guarantee ?
// would below work? if not what to do?
async(f1);
async(f2);
async(f3);
```

The slide asks *we want f1,f2 and f3 execute in f1,f2, f3 asynchronously How can we guarantee ? would below work? if not what to do?* It prints no answer. Run the block three times: the order changes, because each call gets its own delay between 0 and 999 ms, and the shortest timer fires first. So no, it does not work.

```diagram
{ "type": "flow", "title": "Example 11: three random timers", "nodes": [ { "id": "a1", "label": "async(f1)" }, { "id": "a2", "label": "async(f2)" }, { "id": "a3", "label": "async(f3)" }, { "id": "t", "label": "three timers", "sub": "random 0–999 ms each" }, { "id": "c", "label": "console", "sub": "any order", "kind": "note" } ], "edges": [ { "from": "a1", "to": "t" }, { "from": "a2", "to": "t" }, { "from": "a3", "to": "t" }, { "from": "t", "to": "c" } ], "caption": "The slide's steps drawn: the timer with the shortest delay fires first." }
```

```js run pin Example 11 fixed
// predict: In what order are 1, 2 and 3 logged now?
const f1 = () => { console.log(1) };
const f2 = () => { console.log(2) };
const f3 = () => { console.log(3) };

function async(callMeBack) {
    setTimeout(() => {
        callMeBack();
    }, Math.floor(Math.random() * 1000)
    );
}

// start the next call only when the previous one has run
async(() => {
    f1();
    async(() => {
        f2();
        async(f3);
    });
});
```

```output
1
2
3
```

The fix starts each call inside the previous callback: `async(f3)` is not even scheduled until `f2()` has run. The delays are still random, but the order is now always 1, 2, 3. Nesting one callback in another is the shape slide 40 calls callback hell; lesson 07 replaces it with a chain. `async` works as a function name in a classic script, but it is a keyword in `async function`, so avoid it as a name.

## A timer inside a handler, a handler inside a timer

The slides stop at Example 11; these two shapes follow from the same rule.

```js run pin timers and handlers
// predict: Write the five lines in order.
Promise.resolve().then(() => {
  console.log("forecast parsed");
  setTimeout(() => console.log("map redrawn"), 0);
});
setTimeout(() => {
  console.log("alert timer");
  Promise.resolve().then(() => console.log("alert badge"));
}, 0);
console.log("page ready");
```

```output
page ready
forecast parsed
alert timer
alert badge
map redrawn
```

The `setTimeout` inside the `.then` is registered only when that handler runs, so it joins the timer queue behind `"alert timer"`. The `.then` inside the timer callback is a microtask, and microtasks drain before the next timer, so `"alert badge"` beats `"map redrawn"`.

## A promise created inside an executor

```js run pin nested promise
// predict: Write all seven lines in order.
const outer = new Promise((resolve) => {
  console.log("check-in");
  const inner = new Promise((resolve) => {
    console.log("triage");
    setTimeout(() => {
      resolve("room 2");
      console.log("timer");
      console.log(inner);
    }, 0);
    resolve("room 5");
  });
  inner.then((room) => console.log(room));
  resolve("doctor");
});
outer.then((who) => console.log(who));
console.log("waiting room");
```

```output
check-in
triage
waiting room
room 5
doctor
timer
Promise {<fulfilled>: "room 5"}
```

Both executors run at once, so `"check-in"` and `"triage"` come before `"waiting room"`. `inner.then` was attached first, so `"room 5"` logs before `"doctor"`. When the timer fires, `resolve("room 2")` is ignored because `inner` is already settled, and logging it shows the value it kept.

## Order a weather service's readings

Each program comes from a weather page. Write the full output before choosing.

```quiz
[
  {
    "q": "What prints?",
    "code": "setTimeout(() => console.log(\"hourly update\"), 0);\nPromise.resolve(\"12°C\")\n  .then((t) => { console.log(t); return \"14°C\"; })\n  .then((t) => console.log(t));\nconsole.log(\"station on\");",
    "options": ["station on / 12°C / 14°C / hourly update", "station on / hourly update / 12°C / 14°C", "12°C / 14°C / station on / hourly update", "station on / 12°C / hourly update / 14°C"],
    "answer": 0,
    "explain": "Stack: `station on`. Microtasks: the first handler logs `12°C` and returns `14°C`, which fulfils the next promise and queues the second handler, which logs `14°C`. Only then, with the microtask queue empty, does the 0 ms timer log `hourly update`."
  },
  {
    "q": "What prints?",
    "code": "console.log(\"fetch start\");\nPromise.resolve().then(() => {\n  console.log(\"parse\");\n  setTimeout(() => console.log(\"redraw map\"), 0);\n});\nsetTimeout(() => console.log(\"refresh icon\"), 0);\nconsole.log(\"fetch sent\");",
    "options": ["fetch start / fetch sent / parse / refresh icon / redraw map", "fetch start / fetch sent / parse / redraw map / refresh icon", "fetch start / parse / fetch sent / refresh icon / redraw map", "fetch start / fetch sent / refresh icon / parse / redraw map"],
    "answer": 0,
    "explain": "Stack: `fetch start`, `fetch sent`; the `refresh icon` timer is registered during the script. Microtask: `parse`, which only now registers the `redraw map` timer, behind `refresh icon`. Timers in order: `refresh icon`, `redraw map`."
  },
  {
    "q": "What prints?",
    "code": "setTimeout(() => {\n  console.log(\"rain alert\");\n  Promise.resolve().then(() => console.log(\"badge\"));\n}, 0);\nsetTimeout(() => console.log(\"wind alert\"), 0);\nconsole.log(\"listening\");",
    "options": ["listening / rain alert / badge / wind alert", "listening / rain alert / wind alert / badge", "rain alert / badge / wind alert / listening", "listening / badge / rain alert / wind alert"],
    "answer": 0,
    "explain": "Stack: `listening`. First timer: `rain alert`, and it queues a microtask. Microtasks drain before the next timer, so `badge` comes next, then the second timer's `wind alert`."
  },
  {
    "q": "What prints?",
    "code": "new Promise((resolve) => setTimeout(() => resolve(10), 300))\n  .then((mm) => { console.log(\"rain:\", mm); return mm / 2; })\n  .then((mm) => console.log(\"per hour:\", mm));\nconsole.log(\"requesting\");",
    "options": ["requesting / rain: 10 / per hour: 5", "rain: 10 / per hour: 5 / requesting", "requesting / rain: 10 / per hour: 10", "requesting / per hour: 5 / rain: 10"],
    "answer": 0,
    "explain": "The promise is pending for 300 ms, so `requesting` logs first. When the timer calls `resolve(10)`, the first handler logs `rain: 10` and returns 5, which fulfils the next promise: `per hour: 5`."
  },
  {
    "q": "In the third program, how many lines are printed before `wind alert`?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "`listening` (stack), `rain alert` (first timer) and `badge` (the microtask that timer queued, drained before the second timer): three lines."
  }
]
```

```quiz
[
  {
    "q": "Returning a value from a `.then` handler is defined as failure, passing to the reject of the new promise.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 31: *Returning a value is defined as success ( passing to resolve of new promise)*. *Throwing an error is defined as failure.*"
  },
  {
    "q": "Which of these schedule their callback to run later, not right away? Select all.",
    "options": ["`setTimeout(f, 0)`", "`setInterval(f, 100)`", "`[1, 2].map(f)`", "`JSON.parse(text)`"],
    "answer": [0, 1],
    "explain": "`setTimeout` and `setInterval` are the native asynchronous built-ins: their callbacks go to the timer queue. `map` calls its callback synchronously, once per element, before the next line; `JSON.parse` takes no callback and returns at once."
  },
  {
    "q": "What prints?",
    "code": "setTimeout(() => console.log(\"d\"), 1);\nnew Promise((r) => { console.log(\"a\"); r(); }).then(() => console.log(\"c\"));\nconsole.log(\"b\");",
    "options": ["a / b / c / d", "d / a / b / c", "a / c / b / d", "b / a / c / d"],
    "answer": 0,
    "explain": "The executor logs `a` at once; `b` is the next synchronous line; the handler `c` is a microtask; the timer `d` runs last even though it was registered first."
  },
  {
    "q": "Promise handlers wait for the current call stack in the ___ queue, which drains before any timer callback runs.",
    "type": "text",
    "answer": ["microtask", "micro-task", "microtask queue"],
    "explain": "Slide 17's grey note: resolve and reject *lead to put handlers in microtask and run only after the current call stack finishes*. Timer callbacks wait in the timer (macrotask) queue."
  },
  {
    "q": "What prints?",
    "code": "const save = new Promise((resolve, reject) => {\n  const ok = true;\n  if (ok) resolve(\"saved\");\n  else reject(\"disk full\");\n});\nsave.then((r) => console.log(\"OK:\", r)).catch((e) => console.log(\"FAIL:\", e));",
    "options": ["OK: saved", "FAIL: disk full", "OK: saved / FAIL: disk full", "nothing"],
    "answer": 0,
    "explain": "`ok` is true, so the promise is fulfilled with `saved` and the success handler runs. The `.catch` is skipped: its promise was fulfilled, so it only passes the value on."
  },
  {
    "q": "What prints?",
    "code": "new Promise((r) => setTimeout(() => r(4), 200))\n  .then((n) => n + 1)\n  .then((n) => { console.log(\"got\", n); return n * 10; })\n  .then((n) => console.log(\"end\", n));\nconsole.log(\"first\");",
    "options": ["first / got 5 / end 50", "first / got 4 / end 40", "got 5 / end 50 / first", "first / got 5 / end 5"],
    "answer": 0,
    "explain": "`first` is synchronous. After 200 ms `r(4)` fulfils the promise; the first handler returns 5 without logging, the second logs `got 5` and returns 50, the third logs `end 50`."
  },
  {
    "q": "Example 11 on slide 34 calls `async(f1); async(f2); async(f3);` where each call uses `setTimeout` with `Math.floor(Math.random() * 1000)` ms. Does this guarantee the order 1, 2, 3?",
    "options": ["No: each callback has its own random delay, so the shortest delay logs first", "Yes: timers always fire in the order they were set", "Yes: setTimeout callbacks are microtasks", "No: the three callbacks run at the same time on different threads"],
    "answer": 0,
    "explain": "Timers with different delays fire in delay order, not call order. To guarantee 1, 2, 3, start each call inside the previous callback, or chain promises with `.then`. JavaScript runs one callback at a time, so nothing runs in parallel."
  },
  {
    "q": "Removing the `.catch()` from Example 8 on slide 29 leaves the rejection unhandled, and the console reports an error.",
    "type": "tf",
    "answer": true,
    "explain": "The slide's answer is *Unhandled reject error*; Chrome prints `Uncaught (in promise) Something went wrong` in red."
  },
  {
    "type": "free",
    "q": "In Example 7 on slide 28, the timer is set with 0 ms before the `Promise.resolve().then(...)` line. Explain why 2 still logs last.",
    "model": "`wait(0)` only resolves when its `setTimeout` callback runs, and a timer callback runs only after the call stack is empty and every microtask has run. `console.log(4)` is synchronous; the handlers for 3 and then 1 are microtasks (the second is queued by the first and still drains before any timer). So the order is 4, 3, 1, 2.",
    "points": ["4 is synchronous and logs first", "promise handlers are microtasks that run once the stack is empty", "a handler queued by a handler (1) still runs before any timer", "the 0 ms timer runs only after the microtask queue is empty, so 2 is last"],
    "explain": "The rule: synchronous code, then every microtask, then one timer."
  }
]
```
