---
title: "then, catch and finally: return fulfils, throw rejects"
minutes: 18
---

Every `.then` returns a new promise, so handlers line up in a chain. Slides 41 to 51 name the three methods a promise carries and show what each one hands to the next promise.

## Three methods on every promise (slides 41, 42)

Slide 41: *3 main methods of the Promise object are* `.then`, `.catch` and `.finally`. Slide 42 opens a fulfilled promise in DevTools (an older Chrome) and finds them on its prototype:

```text
< ▼Promise {<resolved>: "nicely done!"}
    ▼__proto__: Promise
      ►catch: ƒ catch()
      ►constructor: ƒ Promise()
      ►finally: ƒ finally()
      ►then: ƒ then()
       Symbol(Symbol.toStringTag): "Promise"
      ►__proto__: Object
    [[PromiseStatus]]: "resolved"
    [[PromiseValue]]: "nicely done!"
```

```diagram
{ "type": "tree", "title": "What a promise object carries", "nodes": [ { "id": "p", "label": "Promise" }, { "id": "proto", "label": "__proto__: Promise", "parent": "p" }, { "id": "c", "label": "catch()", "parent": "proto" }, { "id": "k", "label": "constructor", "parent": "proto" }, { "id": "f", "label": "finally()", "parent": "proto" }, { "id": "t", "label": "then()", "parent": "proto" } ], "hi": ["c", "f"], "caption": "Slide 42 underlines catch() and finally(): they live on the prototype beside then()." }
```

## .then takes a success function and an error function (slide 43)

```js
promise.then(
    function (result) { /* handle a successful result */ },
    function (error) { /* handle an error */ }
);
```

*The first argument of .then is a function that: runs when the Promise is resolved, and receives the result.* *The second argument of .then is a function that: runs when the Promise is rejected, and receives the error.* The slide circles the comma: two functions, one call.

## What the page shows (slide 44)

```js run pin slide 44
// predict: What's the output of the code below? Describe what the page shows.
function foo(st) {
    document.write(st)
}
let promise = new Promise(function (resolveFunc, rejectFunc) {
    resolveFunc("<h1>H</h1>ello ");
})
promise.then(foo);
```

`resolveFunc("<h1>H</h1>ello ");` fulfils the promise with an HTML string, and `promise.then(foo);` passes it to `foo`, which writes it: a large heading "H" with "ello" below it. The slide's printed answer, *So the code above will display 1 on the browser window*, does not match this code; it belongs to slide 45's. One more line at the bottom of the slide's screenshot is cut off and is left out here.

## The second resolve is ignored (slide 45)

```js run pin slide 45
// predict: What does the alert show?
let promise = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
    resolve(1);
});
promise.then(alert);
```

The slide's answer: *it will alert "1" on the browser window and ignore the second resolve*. `resolve(1)` runs synchronously and settles the promise; the `resolve(2)` that fires a second later does nothing.

## .catch(f) is .then(null, f) (slides 46, 47)

*If we're interested only in errors, then we can use null as the first argument:* `.then(null, errorHandlingFunction)` *Is the same as* `.catch(errorHandlingFunction)`.

```js run pin slide 47
// predict: What does the alert show, and when?
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 2000);
});

// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // shows "Error: Whoops!" after 2 seconds (5 on the slide)
```

The slide waits 5 seconds; this copy waits 2. `promise.catch(alert)` shows *"Error: Whoops!"*. The slide's DevTools view, with the 5 sec arrow from pending to rejected:

```text
< ▼Promise {<pending>}
    ► __proto__: Promise
    [[PromiseStatus]]: "pending"
    [[PromiseValue]]: undefined
> promise
< ▼Promise {<rejected>: Error: Whoops!
      at setTimeout (<anonymous>:2:27)}
    ► __proto__: Promise
    [[PromiseStatus]]: "rejected"
  ► [[PromiseValue]]: Error: Whoops! at setTimeout (<anonymous>:2:27)
```

The first `Promise {<pending>}` is the new promise that `.catch(alert)` returned; the second inspection is `promise` itself.

## Returning fulfils, throwing rejects

Slide 31's rule, applied to a clinic's booking chain: returning anything, even an `Error` object, is success.

```js run pin return or throw
// predict: Write both lines.
const booked = Promise.resolve("slot 9am");
booked
  .then((slot) => { return new Error("double booked"); })
  .then((v) => console.log("A fulfilled:", v), (e) => console.log("A rejected:", e));
booked
  .then((slot) => { throw new Error("double booked"); })
  .then((v) => console.log("B fulfilled:", v), (e) => console.log("B rejected:", e));
```

```output
A fulfilled: Error: double booked
B rejected: Error: double booked
```

`return new Error("double booked");` hands over a value that happens to be an error, so chain A's next promise is fulfilled and its first function runs. `throw new Error("double booked");` is a failure, so chain B's next promise is rejected and its second function runs.

## A throw skips its own .then's error handler

This shape goes beyond the slides. A `.then`'s second function watches the promise before it, not its own first function.

```js run pin skip and recover
// predict: Write the two lines.
Promise.resolve("form received")
  .then(
    (msg) => { throw new Error("no insurance number"); },
    (err) => console.log("same then:", err.message)
  )
  .catch((err) => {
    console.log("catch:", err.message);
    return "booked as self-pay";
  })
  .then((msg) => console.log("next then:", msg));
```

```output
catch: no insurance number
next then: booked as self-pay
```

The throw rejects the promise that this `.then` returns, so `"same then:"` never prints; the next rejection handler is the `.catch`. The `.catch` recovers: it returns `"booked as self-pay"`, which fulfils its promise, so the last `.then` runs.

```diagram
{ "type": "flow", "title": "A chain is a row of new promises", "nodes": [ { "id": "p0", "label": "p0" }, { "id": "p1", "label": "p1", "sub": ".then(f, g)" }, { "id": "p2", "label": "p2", "sub": ".catch(h)" }, { "id": "p3", "label": "p3", "sub": ".then(k)" } ], "edges": [ { "from": "p0", "to": "p1", "label": "value" }, { "from": "p1", "to": "p2", "label": "f throws: rejects" }, { "from": "p2", "to": "p3", "label": "h returns: fulfils" } ], "hi": ["p2"], "caption": "Each handler settles the next promise: return fulfils it, throw rejects it." }
```

### The rejection travelling to the next handler

```widget
promise-chain-play
{ "mode": "chain", "preset": "throw-skips-own-handler", "predict": true }
```

## .finally runs on both outcomes (slides 48, 49)

*Just like there's a finally clause in a regular try {...} catch {...}, there's finally in promises.* *The call .finally(f) is similar to .then(f, f) in the sense that it always runs when the promise is settled: be it resolve or reject.* The slide adds that *there are more into .finally method that is outside the scope of this class*.

```js run pin slide 49
// predict: Which two alerts appear, in what order?
let pr = new Promise((resolve, reject) => {
    setTimeout(() => resolve("result of resolve "), 2000)
})

    .then(result => alert(result))// <-- .then handles the result
    .finally(() => alert("Promise ready"));
```

The slide prints no output; running it shows `result of resolve` first, then `Promise ready`. The `.finally` waits for the promise that `.then(result => alert(result))` returns. `pr` holds the promise from `.finally`, not the original.

## finally does not handle a rejection (slides 50, 51)

```js run pin slide 50
// predict: Write both console lines.
let pr = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(" Error!..")), 2000)
}).finally(() => console.log("Promise setteled"));
```

```output
Promise setteled
Uncaught (in promise) Error:  Error!..
```

The slide's `.finally` calls `document.write("Promise setteled")`; this copy logs the same text, so both results land in one console. *In example below we did not catch error nor we defined reject function.* Slide 51 numbers what happens: 1, the page shows "Promise setteled", because `.finally` runs on a rejection too; 2, the console shows the rejection, which `.finally` passed on and nothing handled:

```text
Uncaught (in promise) Error:  Error!..
    at setTimeout (<anonymous>:2:33)
```

Slide 50 says *Remember the default function would terminate the script*. A browser only reports the unhandled rejection; other code keeps running. Node.js 15 and later does exit.

```diagram
{ "type": "sequence", "title": "Slides 50 and 51", "nodes": [ { "id": "p", "label": "promise", "kind": "lane" }, { "id": "f", "label": "finally handler", "kind": "lane" }, { "id": "pg", "label": "page", "kind": "lane" }, { "id": "c", "label": "console", "kind": "lane" } ], "edges": [ { "from": "p", "to": "f", "label": "timer: reject(Error)" }, { "from": "f", "to": "pg", "label": "1: Promise setteled" }, { "from": "p", "to": "c", "label": "2: Uncaught (in promise)" } ], "hi": ["3"], "caption": "finally runs, and the rejection is still unhandled." }
```

## What .finally and a non-function pass on

Also beyond the slides: `.finally` gets no argument and passes the value through, and a `.then` given something that is not a function does the same.

```js run pin pass-through
// predict: Write both lines.
Promise.resolve("room 4")
  .then(42)
  .finally((arg) => console.log("finally got", arg))
  .then((room) => console.log("then got", room));
```

```output
finally got undefined
then got room 4
```

`.then(42)` is ignored as a handler, so `"room 4"` flows on. The `.finally` callback's `arg` is `undefined`, and the last `.then` still receives `"room 4"`.

```diagram
{ "type": "grid", "title": "then, catch, finally", "nodes": [ { "id": "h0", "label": "call", "row": 0, "col": 0 }, { "id": "h1", "label": "runs on fulfil", "row": 0, "col": 1 }, { "id": "h2", "label": "runs on reject", "row": 0, "col": 2 }, { "id": "h3", "label": "next promise gets", "row": 0, "col": 3 }, { "id": "a0", "label": ".then(f)", "row": 1, "col": 0 }, { "id": "a1", "label": "f", "row": 1, "col": 1 }, { "id": "a2", "label": "nothing", "row": 1, "col": 2 }, { "id": "a3", "label": "f's return, or the reason", "row": 1, "col": 3 }, { "id": "b0", "label": ".then(f, g)", "row": 2, "col": 0 }, { "id": "b1", "label": "f", "row": 2, "col": 1 }, { "id": "b2", "label": "g", "row": 2, "col": 2 }, { "id": "b3", "label": "the return of f or g", "row": 2, "col": 3 }, { "id": "c0", "label": ".catch(g)", "row": 3, "col": 0 }, { "id": "c1", "label": "nothing", "row": 3, "col": 1 }, { "id": "c2", "label": "g", "row": 3, "col": 2 }, { "id": "c3", "label": "the value, or g's return", "row": 3, "col": 3 }, { "id": "d0", "label": ".finally(f)", "row": 4, "col": 0 }, { "id": "d1", "label": "f, no argument", "row": 4, "col": 1 }, { "id": "d2", "label": "f, no argument", "row": 4, "col": 2 }, { "id": "d3", "label": "the same value or reason", "row": 4, "col": 3 } ], "hi": ["d3"], "caption": ".catch(g) is .then(null, g); .finally(f) is similar to .then(f, f) but passes the outcome through." }
```

## Route a clinic's booking chain

Four chains from a clinic's booking page. Decide which handler runs at each step, then pick the output.

```quiz
[
  {
    "q": "What prints?",
    "code": "Promise.reject(\"no doctor\")\n  .then((v) => console.log(\"A\", v), (e) => console.log(\"B\", e))\n  .catch((e) => console.log(\"C\", e));",
    "options": ["B no doctor", "C no doctor", "B no doctor / C no doctor", "A no doctor"],
    "answer": 0,
    "explain": "The first promise is rejected, so the `.then`'s second function runs and logs `B no doctor`. It returns `undefined` without throwing, which fulfils the next promise, so the `.catch` has nothing to handle."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(3)\n  .then((n) => { if (n > 2) throw new Error(\"too many visits\"); return n; })\n  .then((n) => console.log(\"ok\", n))\n  .catch((e) => console.log(\"caught\", e.message))\n  .then(() => console.log(\"reminder sent\"));",
    "options": ["caught too many visits / reminder sent", "ok 3 / reminder sent", "caught too many visits", "ok 3 / caught too many visits / reminder sent"],
    "answer": 0,
    "explain": "3 > 2, so the first handler throws and its promise is rejected. The `ok` handler is skipped (no second function), the `.catch` logs `caught too many visits` and returns `undefined`, which fulfils its promise, so `reminder sent` prints."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve(\"Dr. Lee\").then(\"Dr. Kim\").then((d) => console.log(d));",
    "options": ["Dr. Lee", "Dr. Kim", "undefined", "nothing"],
    "answer": 0,
    "explain": "`\"Dr. Kim\"` is a string, not a function, so that `.then` passes the value through unchanged. The last handler receives `Dr. Lee`."
  },
  {
    "q": "What prints?",
    "code": "Promise.reject(new Error(\"closed\"))\n  .finally(() => console.log(\"log visit\"))\n  .catch((e) => console.log(\"handled:\", e.message));",
    "options": ["log visit / handled: closed", "handled: closed / log visit", "log visit", "log visit / Uncaught (in promise) Error: closed"],
    "answer": 0,
    "explain": "`.finally` runs on a rejection too and logs `log visit`, then passes the rejection on. The `.catch` receives the same error: `handled: closed`. Because it is handled, no Uncaught line appears."
  }
]
```

```quiz
[
  {
    "q": "`.then(null, errorHandlingFunction)` is the same as `.catch(errorHandlingFunction)`.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 46, word for word: *If we're interested only in errors, then we can use null as the first argument.*"
  },
  {
    "q": "Slide 41 lists the 3 main methods of the Promise object. Which of these is not one of them?",
    "options": ["`.resolve`", "`.then`", "`.catch`", "`.finally`"],
    "answer": 0,
    "explain": "*3 main methods of the Promise object are .then .catch .finally* (slide 41); slide 42 finds them on the prototype. `resolve` is a function the executor receives (and `Promise.resolve` is a shortcut on the constructor), not a method of a promise object."
  },
  {
    "q": "The call `.finally(f)` runs f only when the promise is fulfilled.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 48: it *always runs when the promise is settled: be it resolve or reject*. Slide 50's rejected promise still writes \"Promise setteled\"."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve()\n  .then(() => new Error(\"late fee\"))\n  .then((x) => console.log(\"ok:\", x.message), (e) => console.log(\"bad:\", e.message));",
    "options": ["ok: late fee", "bad: late fee", "ok: undefined", "Uncaught (in promise) Error: late fee"],
    "answer": 0,
    "explain": "The arrow function returns an Error object; returning is success (slide 31), so the next promise is fulfilled with that object and the first function logs its message."
  },
  {
    "q": "What prints?",
    "code": "const visit = new Promise((resolve) => {\n  setTimeout(() => resolve(\"second\"), 500);\n  resolve(\"first\");\n});\nvisit.then((v) => console.log(v));",
    "options": ["first", "second", "first / second", "second / first"],
    "answer": 0,
    "explain": "As on slide 45: `resolve(\"first\")` runs synchronously and settles the promise; the timer's `resolve(\"second\")` is ignored."
  },
  {
    "q": "What prints?",
    "code": "Promise.resolve()\n  .then(() => { throw new Error(\"x\"); })\n  .catch(() => console.log(\"handled\"))\n  .then(null, () => console.log(\"handled again\"))\n  .then(() => console.log(\"done\"));",
    "options": ["handled / done", "handled / handled again / done", "handled again / done", "handled"],
    "answer": 0,
    "explain": "The throw rejects; the `.catch` logs `handled` and returns normally, so its promise is fulfilled. `.then(null, …)` has no success function, so it passes the fulfilment on, and `done` prints."
  },
  {
    "q": "Slide 50 rejects a promise that has only a `.finally`. In what order does slide 51 number the two results?",
    "options": ["1: the page shows \"Promise setteled\"; 2: the console shows Uncaught (in promise) Error", "1: the console error; 2: the page text", "only the page text appears", "only the console error appears"],
    "answer": 0,
    "explain": "`.finally` runs first and writes to the page; the rejection then passes on with no handler and the console reports it."
  },
  {
    "q": "According to slide 50, when a rejection is not caught, the default function would terminate the script.",
    "type": "tf",
    "answer": true,
    "explain": "That is the slide's sentence. In a browser the unhandled rejection is only reported as `Uncaught (in promise) …` and other code keeps running; Node.js 15 and later does exit the process."
  },
  {
    "type": "free",
    "q": "Explain what `.finally(f)` does and one way it differs from `.then(f, f)`.",
    "model": "`.finally(f)` runs f when the promise is settled, be it resolve or reject, like the finally clause of try/catch (slide 48). Unlike `.then(f, f)`, f receives no argument and the value or rejection passes through to the next handler unchanged, so a rejection after `.finally` still needs a `.catch` (slides 50 and 51).",
    "points": ["runs whether the promise is fulfilled or rejected", "similar to the finally clause of try/catch", "its callback gets no argument (undefined)", "passes the original value or rejection on to the next handler", "does not handle a rejection: Uncaught (in promise) still appears without a catch"],
    "explain": "Slide 48 gives the first two points; the pass-through behaviour is beyond the slide and shown by the pass-through program above."
  }
]
```
