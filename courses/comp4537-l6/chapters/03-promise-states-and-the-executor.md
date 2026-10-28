---
title: Pending, fulfilled, rejected, and the executor that runs immediately
minutes: 18
---

A promise is the object slide 10 asked for: it carries the eventual value and whether the work succeeded, and it moves between three states.

<!-- facts: s13 states; s14 settled; s15; s16 five facts; s17 callouts, grey notes; s18; s19 eager; s35; s36-37 Ex12; s38; s39 -->

## A promise has three states (slides 13 and 14)

Slide 13's analogy: *Your boss promises you a raise someday.* You wait (*pending*); she gives it (*fulfilled*) or withholds it (*reject*). *A promise has 3 states:*

1. *Pending: You don't know if you will get the raise*
2. *Resolved (Fulfilled): Boss is happy, gets you the raise. describe what you would do in a function called resolve()*
3. *Rejected: Your boss is unhappy, withholds the raise. Lets describe what you would do in a function called reject()*

Slide 14 circles **Fulfilled** and **Rejected** together and labels the pair **Settled**. A settled promise never goes back to pending.

```diagram
{ "type": "flow", "title": "Pending settles once", "nodes": [ { "id": "f", "label": "Fulfilled" }, { "id": "p", "label": "Pending" }, { "id": "r", "label": "Rejected" } ], "edges": [ { "from": "p", "to": "f", "label": "resolve(value)" }, { "from": "p", "to": "r", "label": "reject(reason)" } ], "hi": ["p"], "caption": "Two ways out of Pending, none back in." }
```

```diagram
{ "type": "tree", "title": "The three possible status of a JS promise", "nodes": [ { "id": "s", "label": "promise state" }, { "id": "p", "label": "Pending", "parent": "s" }, { "id": "st", "label": "Settled", "parent": "s" }, { "id": "f", "label": "Fulfilled", "parent": "st" }, { "id": "r", "label": "Rejected", "parent": "st" } ], "hi": ["st", "f", "r"], "caption": "Slide 14: fulfilled and rejected together are the settled states." }
```

Slide 15 recalls lecture 4's single waiter: *You only get a promise. (he might get back to you , he might forget)*. An AJAX call is the same.

## The executor runs the moment the promise is created (slide 16)

*Promise() is an object in JavaScript*:

1. *The Promise object is used for asynchronous computations.*
2. *A Promise represents a single asynchronous operation that hasn't completed yet, but is expected in the future.*
3. *You pass a function to the constructor which gets executed the moment the promise object gets created*
4. *The executer function gets reference of two functions ( resolve and reject) as input*
5. *The Promise object has a method called then()*

The slide's line is pseudo-code; the red strokes through the `()` mean the functions are passed by reference, not called:

```text
let promise = new Promise( myExecuter( res(),rej() ) );
```

The runnable form passes the executor itself:

```js run pin myExecuter.js
// predict:
function myExecuter(res, rej) {
  res("done");
}
let promise = new Promise(myExecuter);
promise.then(console.log);
```

```output
done
```

`new Promise(myExecuter)` calls `myExecuter` at once; `res("done")` fulfils the promise.

## The gray slide (slide 17)

```js run pin graySlide.js
// predict:
let promise = new Promise(
    (resolve, reject)=> {
      // some condition to decide outcome of promise (reject or resolve)
      reject("Rejected!");
      resolve("Resolved!");
    }
);
promise.then(
    (resolveMes)=> {
      console.log(resolveMes);
    }
    ,
    (rejectMes)=> {
      console.log(rejectMes)
    }
);
```

```output
Rejected!
```

The five callouts:

1. *Promise constructor to which we can pass a function called executer. This function itself gets two functions first one points to resolve, the second one points to reject*
2. *Definition of the two handlers (functions) resolve and promise are given here, or could be given elsewhere but passed by reference* (sic: resolve and reject)
3. *Promise executer function. Gets executed immediately upon creation of the promise object*
4. *resolve and reject invoke handlers asynchronously and mutually exclusive And run only once*
5. *The then() method itself returns a promise*

The grey notes: *Resolve, reject change promise status synchronously which lead to put handlers in microtask and run only after the current call stack finishes*. *Promise handlers do NOT wait for "all code in the program" to finish. They wait only for the current call stack to unwind.* *When reject handlers invokes, the resolve will be ignored because the promise is already settled.* So `reject("Rejected!")` settles it, `resolve("Resolved!")` does nothing, and only `(rejectMes)=>` runs.

```diagram
{ "type": "flow", "title": "The gray slide's arrows", "nodes": [ { "id": "h1", "label": "handler 1", "sub": "resolveMes" }, { "id": "res", "label": "resolve" }, { "id": "ex", "label": "executor", "sub": "runs immediately" }, { "id": "rej", "label": "reject" }, { "id": "h2", "label": "handler 2", "sub": "rejectMes" } ], "edges": [ { "from": "h1", "to": "res", "label": "points to" }, { "from": "ex", "to": "res" }, { "from": "ex", "to": "rej" }, { "from": "h2", "to": "rej", "label": "points to" } ], "hi": ["h1", "res"], "caption": "Blue color indicates resolve contents: the first handler pairs with resolve." }
```

```diagram
{ "type": "flow", "title": "The gray slide's arrows", "nodes": [ { "id": "h1", "label": "handler 1", "sub": "resolveMes" }, { "id": "res", "label": "resolve" }, { "id": "ex", "label": "executor", "sub": "runs immediately" }, { "id": "rej", "label": "reject" }, { "id": "h2", "label": "handler 2", "sub": "rejectMes" } ], "edges": [ { "from": "h1", "to": "res", "label": "points to" }, { "from": "ex", "to": "res" }, { "from": "ex", "to": "rej" }, { "from": "h2", "to": "rej", "label": "points to" } ], "hi": ["h2", "rej"], "caption": "Red indicates reject ones: reject is called first here, so handler 2 runs." }
```

Slide 18: *resolve / reject do not invoke handlers directly; they change the promise's state, JavaScript then queues the handlers*. *resolve(),reject() create the promise's value; .then()handlers receives the promise's value.* They are different functions.

Slide 19: *Promises are eager. This means that when a new Promise is constructed, it immediately starts executing*. Its parenthesis calls resolve and reject asynchronous; the grey note above is the accurate one.

### One promise's state as the executor steps

Watch the state flip on `reject` and the later `resolve` flash as ignored.

```widget
promise-chain-play
{ "mode": "state", "preset": "l6-s17", "predict": true }
```

## Settled is final: a restaurant's table

The lesson's own program, slide 17's shape with three resolves first:

```js run pin tableBooking.js
// predict: Write both lines.
const booking = new Promise((resolve, reject) => {
  resolve("table for 2");
  resolve("table for 4");
  resolve("table for 6");
  reject("closed");
});
booking.then((msg) => console.log(msg), (err) => console.log(err));
console.log(booking);
```

```output
Promise {<fulfilled>: "table for 2"}
table for 2
```

`resolve("table for 2")` settles the promise as fulfilled; the next three calls are ignored. `console.log(booking)` prints first because the handler waits for the stack to unwind.

## Status and value over time (slides 35 to 37)

Slide 35: *"promise states" and "promise status" refer to the same concept*: *pending*, *fulfilled* or *rejected*. Example 12 on slide 36 resolves after 5000 ms; this copy waits 2000 ms.

```js run pin beforeAndAfter.js
// predict: Write both lines.
const prom = new Promise( (res, rej)=>{
    setTimeout(() => {
        res('status changed now!');
    }, 2000);
});
console.log(prom);
setTimeout(() => console.log(prom), 2100);
```

```output
Promise {<pending>}
Promise {<fulfilled>: "status changed now!"}
```

The first `console.log(prom)` runs before the timer; by 2100 ms `res('status changed now!')` has fulfilled it. Slide 37's older Chrome, with `promise.then(alert)` attached:

```text
Promise {<pending>}
    [[PromiseStatus]]: "pending"
    [[PromiseValue]]: undefined
Promise {<resolved>: "status changed now!"}
    [[PromiseStatus]]: "resolved"
    [[PromiseValue]]: "status changed now!"
```

*After around a 5 second gap, the status changes from pending to resolved.* Today's Chrome says fulfilled.

```diagram
{ "type": "grid", "title": "DevTools before and after 5 seconds", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "before", "row": 0, "col": 1 }, { "id": "h2", "label": "after about 5 s", "row": 0, "col": 2 }, { "id": "a0", "label": "[[PromiseStatus]]", "row": 1, "col": 0 }, { "id": "a1", "label": "\"pending\"", "row": 1, "col": 1 }, { "id": "a2", "label": "\"resolved\"", "row": 1, "col": 2 }, { "id": "b0", "label": "[[PromiseValue]]", "row": 2, "col": 0 }, { "id": "b1", "label": "undefined", "row": 2, "col": 1 }, { "id": "b2", "label": "\"status changed now!\"", "row": 2, "col": 2 }, { "id": "c0", "label": "today's Chrome", "row": 3, "col": 0 }, { "id": "c1", "label": "[[PromiseState]]: \"pending\"", "row": 3, "col": 1 }, { "id": "c2", "label": "[[PromiseState]]: \"fulfilled\", [[PromiseResult]]", "row": 3, "col": 2 } ], "hi": ["a2", "b2"], "caption": "Slide 37's two views; the last row is how current Chrome labels the same slots." }
```

### A delayed resolve stays pending

```widget
promise-chain-play
{ "mode": "state", "preset": "l6-ex12" }
```

## Resolve with nothing waiting (slide 38)

The second "Example 9", on slide 38, asks for the status and value; its DevTools shows "resolved" and "nicely done!". The log line is added:

```js run pin defaultResolve.js
// predict:
let promise = new Promise(function(resolve, reject) {
  resolve ("nicely done!");
});
console.log(promise); // added
```

```output
Promise {<fulfilled>: "nicely done!"}
```

`resolve ("nicely done!")` runs inside the executor, so `console.log(promise)` already sees it fulfilled.

## Reject with no handler (slide 39)

The second "Example 10", on slide 39:

```js run pin defaultReject.js
// predict:
let promise = new Promise(function(resolve, reject) {
  console.log("Doing something before rejection");
  reject ("Whoops!");
});
```

```output
Doing something before rejection
Uncaught (in promise) Whoops!
```

`console.log("Doing something before rejection")` runs in the executor. The slide's reason for the red line: *Because we did not catch the error ( we did not define the reject method)!* Precisely, nothing handles the rejection `reject ("Whoops!")` makes.

```quiz
[
  {
    "q": "Promises are eager: when a new Promise is constructed, it immediately starts executing.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 19. The executor runs during `new Promise(...)`, before the next line of the script (slide 16 fact 3, slide 17 callout 3)."
  },
  {
    "q": "Match each state to its meaning.",
    "type": "match",
    "pairs": [
      ["Pending", "not known yet whether it will succeed"],
      ["Fulfilled", "resolve was called first"],
      ["Rejected", "reject was called first"],
      ["Settled", "fulfilled or rejected"]
    ],
    "explain": "Slides 13 and 14. Settled is not a fourth state; it names the two states a promise cannot leave."
  },
  {
    "q": "Which states does slide 14 group as settled?",
    "options": ["Fulfilled and Rejected", "Pending and Fulfilled", "Pending and Rejected", "Pending, Fulfilled and Rejected"],
    "answer": 0,
    "explain": "The loop on slide 14 encircles Fulfilled and Rejected and joins them to the box Settled. Pending is not settled."
  },
  {
    "q": "What does this print?",
    "code": "const pickup = new Promise((resolve, reject) => {\n  reject(\"pharmacy closed\");\n  resolve(\"order ready\");\n  reject(\"try tomorrow\");\n});\npickup.then(\n  (m) => console.log(\"ok: \" + m),\n  (e) => console.log(\"no: \" + e)\n);",
    "options": ["no: pharmacy closed", "ok: order ready", "no: pharmacy closed / ok: order ready / no: try tomorrow", "no: try tomorrow"],
    "answer": 0,
    "explain": "The first call, `reject(\"pharmacy closed\")`, settles the promise as rejected; the later `resolve` and `reject` are ignored (slide 17: *the resolve will be ignored because the promise is already settled*). Handlers are *mutually exclusive*, so only the second runs, once."
  },
  {
    "q": "What is the state of `pickup` after the code in the previous question runs?",
    "options": ["rejected", "fulfilled", "pending", "undefined"],
    "answer": 0,
    "explain": "`reject` was called first. The state changes once, from pending to rejected, and stays there."
  },
  {
    "q": "Slide 17 callout 3: the executer function gets executed ___ upon creation of the promise object. Fill the word.",
    "type": "text",
    "answer": ["immediately"],
    "explain": "*Promise executer function. Gets executed immediately upon creation of the promise object.*"
  },
  {
    "q": "Promise handlers wait for all code in the program to finish before they run.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 17's grey note: *Promise handlers do NOT wait for \"all code in the program\" to finish. They wait only for the current call stack to unwind.*"
  },
  {
    "q": "Which statement about promises is incorrect?",
    "options": [
      "A pending promise can never become fulfilled or rejected",
      "A promise represents a single asynchronous operation that hasn't completed yet, but is expected in the future",
      "A promise is in one of three states: pending, fulfilled or rejected",
      "The then() method itself returns a promise"
    ],
    "answer": 0,
    "explain": "Pending is exactly the state that does become fulfilled or rejected, once. The other three are slide 16 fact 2, slide 35, and slide 17 callout 5."
  },
  {
    "q": "Slide 39: a promise that is rejected with no rejection handler gives an error in the console.",
    "type": "tf",
    "answer": true,
    "explain": "The console shows `Uncaught (in promise) Whoops!`. The slide's reason is *we did not catch the error*; the precise cause is a rejected promise with no second `.then` argument and no `.catch`."
  },
  {
    "q": "Slide 37 shows `[[PromiseStatus]]: \"resolved\"`. What does current Chrome show for the same promise?",
    "options": ["[[PromiseState]]: \"fulfilled\"", "[[PromiseState]]: \"settled\"", "[[PromiseStatus]]: \"done\"", "[[PromiseState]]: \"resolved\""],
    "answer": 0,
    "explain": "The slide is an older Chrome. The state's name is fulfilled (slides 14 and 35); current Chrome labels the slots `[[PromiseState]]` and `[[PromiseResult]]`."
  }
]
```
