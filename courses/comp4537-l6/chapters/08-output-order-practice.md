---
title: "Output-order practice: twelve new programs"
minutes: 25
---

Twelve short programs in the shapes of Examples 1 to 12 and the harder shapes from lesson 05. For each one, write the full output on paper first, then type it into the prediction box and run.

## Synchronous code, then microtasks, then one timer

1. All synchronous code runs first, executors included.
2. Then every microtask, including ones that microtasks queue.
3. Then one timer callback, then the microtasks it queued, then the next timer.

```diagram
{ "type": "layers", "title": "Three places code waits", "nodes": [ { "id": "stack", "label": "call stack", "sub": "synchronous code, the executor" }, { "id": "micro", "label": "microtask queue", "sub": ".then, .catch, .finally handlers, code after await", "parent": "stack" }, { "id": "timer", "label": "timer queue", "sub": "setTimeout, setInterval", "parent": "micro" } ], "hi": ["micro"], "caption": "They wait only for the current call stack to unwind; a timer waits for the microtasks as well." }
```

## 1. A bookstore sale

```js run pin program 1
// predict: Write all five lines in order.
console.log("open till");
const sale = new Promise((resolve, reject) => {
  console.log("scan books");
  resolve("receipt 41");
  reject("card declined");
  console.log("bag books");
});
sale.then((r) => console.log(r), (e) => console.log(e));
console.log("next customer");
```

```output
open till
scan books
bag books
next customer
receipt 41
```

Decide where each of `resolve("receipt 41");` and `reject("card declined");` leaves the promise, and when `sale.then` can run its handler.

```quiz
[
  {
    "type": "free",
    "q": "Program 1: write the full output, one line per log.",
    "model": "open till / scan books / bag books / next customer / receipt 41",
    "points": ["the executor's two logs run immediately, before next customer", "resolve settles the promise, so reject is ignored and card declined never prints", "the handler is a microtask, so receipt 41 comes after next customer"],
    "explain": "Slides 21 and 22: the executor is synchronous; the first of resolve or reject wins; handlers wait for the call stack to finish."
  },
  {
    "q": "Program 1: which output is right?",
    "options": ["open till / scan books / bag books / next customer / receipt 41", "open till / next customer / scan books / bag books / receipt 41", "open till / scan books / receipt 41 / bag books / next customer", "open till / scan books / bag books / next customer / receipt 41 / card declined"],
    "answer": 0,
    "explain": "The executor runs during `new Promise`, so its logs come before `next customer`. The handler waits for the stack: `receipt 41` last. `reject` after `resolve` does nothing."
  }
]
```

## 2. A clinic slot refused

```js run pin program 2
// predict: Write all three lines in order.
const slot = new Promise((resolve, reject) => {
  console.log("check-in");
  reject("no slot");
  resolve("slot 3pm");
});
slot.then((s) => console.log("booked:", s), (e) => console.log("refused:", e));
console.log("waiting room");
```

```output
check-in
waiting room
refused: no slot
```

Here `reject("no slot");` comes before `resolve("slot 3pm");`, and `slot.then` gets both handlers.

```quiz
[
  {
    "type": "free",
    "q": "Program 2: write the full output, and name the promise's state after the script.",
    "model": "check-in / waiting room / refused: no slot. The promise is rejected.",
    "points": ["check-in prints first, from the executor", "reject is called first, so the promise is rejected and resolve is ignored", "the second handler runs, after waiting room"],
    "explain": "Slide 17's grey note: *when reject handlers invokes, the resolve will be ignored because the promise is already settled.*"
  },
  {
    "q": "Program 2: which output is right?",
    "options": ["check-in / waiting room / refused: no slot", "check-in / waiting room / booked: slot 3pm", "check-in / refused: no slot / waiting room", "check-in / waiting room / refused: no slot / booked: slot 3pm"],
    "answer": 0,
    "explain": "`reject` runs first and settles the promise as rejected; `resolve` is ignored. The rejection handler waits for the stack, so `waiting room` comes before `refused: no slot`."
  }
]
```

## 3. A weather station on an interval

```js run pin program 3
// predict: Write all three lines in order.
const reading = new Promise((resolve) => {
  const id = setInterval(() => {
    resolve("reading 18°C");
  }, 80);
  setTimeout(() => {
    clearInterval(id);
    console.log("station stopped");
  }, 370);
});
reading.then((r) => console.log(r));
console.log("station started");
```

```output
station started
reading 18°C
station stopped
```

The interval calls `resolve("reading 18°C");` every 80 ms, four times, until `clearInterval(id);` at 370 ms.

```quiz
[
  {
    "type": "free",
    "q": "Program 3: write the full output and say how many times the reading is logged.",
    "model": "station started / reading 18°C / station stopped. The reading is logged once.",
    "points": ["station started is synchronous and prints first", "the first tick at 80 ms fulfils the promise and the handler logs the reading", "the later resolve calls do nothing: once settled, the state does not change", "station stopped prints when the 370 ms timer clears the interval"],
    "explain": "Slide 24: *If the promise has already been resolved … then the res method does nothing.*"
  },
  {
    "q": "Program 3: which output is right?",
    "options": ["station started / reading 18°C / station stopped", "station started / reading 18°C / reading 18°C / reading 18°C / reading 18°C / station stopped", "reading 18°C / station started / station stopped", "station started / station stopped / reading 18°C"],
    "answer": 0,
    "explain": "The promise settles on the first tick, so the handler runs once although `resolve` is called four times. The timer at 370 ms stops the interval."
  }
]
```

## 4. Already settled promises

```js run pin program 4
// predict: Write all four lines in order.
Promise.resolve().then(() => console.log("late A"));
Promise.reject().catch(() => console.log("late B"));
console.log("A");
console.log("B");
```

```output
A
B
late A
late B
```

`Promise.resolve()` and `Promise.reject()` make promises that are settled before the next line runs.

```quiz
[
  {
    "type": "free",
    "q": "Program 4: write the full output.",
    "model": "A / B / late A / late B",
    "points": ["both promises are already settled, but their handlers still run asynchronously", "A and B are synchronous and print first", "the two handlers run in the order they were attached"],
    "explain": "Slide 25: functions passed to `then()` *will never be called synchronously, even with an already-resolved promise.* The same holds for `.catch`."
  },
  {
    "q": "Program 4: which output is right?",
    "options": ["A / B / late A / late B", "late A / late B / A / B", "late A / A / late B / B", "A / B / late A"],
    "answer": 0,
    "explain": "Both handlers are microtasks, so the synchronous `A` and `B` come first; then `late A` and `late B` in attach order. A rejected promise with a `.catch` is handled, so nothing is lost."
  }
]
```

## 5. A zero-delay timer against a chain

```js run pin program 5
// predict: Write all four lines in order.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
wait(0).then(() => console.log("timer"));
Promise.resolve()
  .then(() => console.log("first"))
  .then(() => console.log("second"));
console.log("sync");
```

```output
sync
first
second
timer
```

`wait(0)` is set before the `Promise.resolve()` chain, and its delay is 0 ms.

```quiz
[
  {
    "type": "free",
    "q": "Program 5: write the full output.",
    "model": "sync / first / second / timer",
    "points": ["sync is the only synchronous log", "first and second are microtasks; second is queued by first and still runs before any timer", "the promise from wait(0) resolves only when its timer fires, after all microtasks"],
    "explain": "The shape of Example 7 on slide 28."
  },
  {
    "q": "Program 5: which output is right?",
    "options": ["sync / first / second / timer", "timer / sync / first / second", "sync / timer / first / second", "sync / first / timer / second"],
    "answer": 0,
    "explain": "A 0 ms timer still waits for an empty stack and an empty microtask queue. `second` is queued by `first`'s handler, and it drains before the timer too."
  }
]
```

### Program 5 on the event loop

```widget
event-loop-play
{ "code": "const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));\nwait(0).then(() => console.log(\"timer\"));\nPromise.resolve()\n  .then(() => console.log(\"first\"))\n  .then(() => console.log(\"second\"));\nconsole.log(\"sync\");", "predict": true }
```

## 6. Arithmetic with a non-function in the chain

```js run pin program 6
// predict: What number is logged?
Promise.resolve(3)
  .then((n) => n * 4)
  .then(7)
  .then((n) => n - 2)
  .then((n) => console.log(n));
```

```output
10
```

Track the value through `.then((n) => n * 4)`, then `.then(7)`, then `.then((n) => n - 2)`.

```quiz
[
  {
    "type": "free",
    "q": "Program 6: what is logged, and why?",
    "model": "10. 3 × 4 = 12; .then(7) is not a function, so 12 passes through; 12 − 2 = 10.",
    "points": ["the first handler returns 12, which fulfils the next promise", ".then(7) gets a number, not a function, so the value passes through unchanged", "the next handler gets 12 and returns 10"],
    "explain": "Returning a value is success (slide 31); a non-function argument to `.then` is ignored."
  },
  {
    "q": "Program 6: what is logged?",
    "options": ["10", "5", "7", "12"],
    "answer": 0,
    "explain": "12 flows past `.then(7)` untouched, so the last step computes 12 − 2. Reading `.then(7)` as \"the value becomes 7\" gives 5."
  }
]
```

## 7. A chain that starts with a timer

```js run pin program 7
// predict: Write all three lines in order.
new Promise((resolve) => setTimeout(() => resolve(5), 300))
  .then((n) => n + 1)
  .then((n) => {
    console.log("plus one:", n);
    return n * 2;
  })
  .then((n) => console.log("doubled:", n));
console.log("waiting");
```

```output
waiting
plus one: 6
doubled: 12
```

Nothing in the chain can run before `resolve(5)` is called inside the timer; `console.log("waiting");` is the script's last line.

```quiz
[
  {
    "type": "free",
    "q": "Program 7: write the full output.",
    "model": "waiting / plus one: 6 / doubled: 12",
    "points": ["the promise is pending for 300 ms, so waiting prints first", "the first handler returns 6 without logging", "the second logs plus one: 6 and returns 12", "the third logs doubled: 12"],
    "explain": "The shape of Example 10 on slide 32."
  },
  {
    "q": "Program 7: which output is right?",
    "options": ["waiting / plus one: 6 / doubled: 12", "plus one: 6 / doubled: 12 / waiting", "waiting / plus one: 5 / doubled: 10", "waiting / plus one: 6 / doubled: 6"],
    "answer": 0,
    "explain": "The first handler returns 5 + 1 = 6 without logging; the logging handler receives 6 and returns 12."
  }
]
```

## 8. Saving a note

```js run pin program 8
// predict: Write all five lines in order.
setTimeout(() => {
  console.log("autosave timer");
  Promise.resolve().then(() => console.log("badge updated"));
}, 0);
Promise.resolve().then(() => {
  console.log("note saved");
  setTimeout(() => console.log("cloud copy"), 0);
});
console.log("sync done");
```

```output
sync done
note saved
autosave timer
badge updated
cloud copy
```

The first timer queues a microtask with `Promise.resolve().then(() => console.log("badge updated"));` and one microtask queues a timer with `setTimeout(() => console.log("cloud copy"), 0);`. Note when each is called, not where it is written.

```quiz
[
  {
    "type": "free",
    "q": "Program 8: write the full output.",
    "model": "sync done / note saved / autosave timer / badge updated / cloud copy",
    "points": ["sync done is synchronous", "note saved is a microtask and runs before any timer", "the cloud copy timer is set only when that handler runs, behind the autosave timer", "badge updated is a microtask queued by the autosave timer and runs before the next timer"],
    "explain": "Microtasks drain completely after each timer callback, before the next timer."
  },
  {
    "q": "Program 8: which output is right?",
    "options": ["sync done / note saved / autosave timer / badge updated / cloud copy", "sync done / note saved / cloud copy / autosave timer / badge updated", "sync done / autosave timer / badge updated / note saved / cloud copy", "sync done / note saved / autosave timer / cloud copy / badge updated"],
    "answer": 0,
    "explain": "The autosave timer was registered during the script; the cloud copy timer only when `note saved` ran, so it is second in the timer queue. `badge updated` runs right after the autosave timer, before the next timer."
  }
]
```

## 9. Microtasks queued by microtasks

```js run pin program 9
// predict: Write the six numbers in order.
new Promise((resolve) => {
  console.log(11);
  resolve(12);
}).then((v) => {
  console.log(v);
  Promise.resolve(13)
    .then((w) => {
      console.log(w);
      return 14;
    })
    .then((x) => {
      Promise.resolve(x).then((y) => console.log(y));
    });
});
setTimeout(() => console.log(10), 0);
console.log(15);
```

```output
11
15
12
13
14
10
```

The handler that logs `console.log(v)` starts another chain, and that chain starts a third. The timer is set before `console.log(15)`.

```quiz
[
  {
    "type": "free",
    "q": "Program 9: write the six numbers in order.",
    "model": "11 / 15 / 12 / 13 / 14 / 10",
    "points": ["11 is logged by the executor, 15 by the last line: both synchronous", "12, 13 and 14 are microtasks, each queued by the one before", "every microtask, however deeply nested, runs before the timer", "10 is the timer and comes last"],
    "explain": "Slide 17: handlers *run only after the current call stack finishes*; a timer waits for the whole microtask queue."
  },
  {
    "q": "Program 9: which output is right?",
    "options": ["11 / 15 / 12 / 13 / 14 / 10", "11 / 15 / 12 / 10 / 13 / 14", "15 / 11 / 12 / 13 / 14 / 10", "11 / 12 / 15 / 13 / 14 / 10"],
    "answer": 0,
    "explain": "The nested chains add microtasks while the queue is draining, and the loop keeps draining until it is empty, so 13 and 14 come before the timer's 10."
  }
]
```

### Program 9 on the event loop

```widget
event-loop-play
{ "code": "new Promise((resolve) => {\n  console.log(11);\n  resolve(12);\n}).then((v) => {\n  console.log(v);\n  Promise.resolve(13)\n    .then((w) => {\n      console.log(w);\n      return 14;\n    })\n    .then((x) => {\n      Promise.resolve(x).then((y) => console.log(y));\n    });\n});\nsetTimeout(() => console.log(10), 0);\nconsole.log(15);", "predict": true }
```

## 10. Checking a postcode two ways

```js run pin program 10
// predict: Write both lines in order.
const check = (code) => Promise.resolve(code);
check("V5K")
  .then(() => new Error("bad postcode"))
  .then((v) => console.log("A ok:", v.message), (e) => console.log("A fail:", e.message))
  .catch((e) => console.log("A catch:", e.message));
check("V5K")
  .then(
    () => { throw new Error("bad postcode"); },
    (e) => console.log("B fail:", e.message)
  )
  .catch((e) => console.log("B catch:", e.message));
```

```output
A ok: bad postcode
B catch: bad postcode
```

Chain A returns an error with `() => new Error("bad postcode")`; chain B throws one with `throw new Error("bad postcode");`.

```quiz
[
  {
    "type": "free",
    "q": "Program 10: write both lines and say which handler printed each.",
    "model": "A ok: bad postcode (A's success function) / B catch: bad postcode (B's .catch)",
    "points": ["returning an Error object is a return, so A's next promise is fulfilled and its success function runs", "B's throw rejects the promise its .then returns", "the second function of that same .then does not see its own first function's throw", "B's .catch handles it"],
    "explain": "Slide 31: *Returning a value is defined as success*, *Throwing an error is defined as failure.* A `.then`'s error handler watches the promise before it."
  },
  {
    "q": "Program 10: which output is right?",
    "options": ["A ok: bad postcode / B catch: bad postcode", "A fail: bad postcode / B fail: bad postcode", "A catch: bad postcode / B catch: bad postcode", "A ok: bad postcode / B fail: bad postcode"],
    "answer": 0,
    "explain": "A returned the error, which fulfils. B threw inside the success function, so B's own second function is skipped and the `.catch` runs. The two chains take turns, so A's line comes first."
  }
]
```

## 11. A library hold that fails

```js run pin program 11
// predict: Write all four lines in order.
Promise.resolve("hold placed")
  .then((msg) => {
    console.log(msg);
    throw new Error("card expired");
  })
  .then(() => console.log("pickup scheduled"))
  .catch((e) => {
    console.log("caught:", e.message);
    return "fallback: email sent";
  })
  .then((msg) => console.log(msg))
  .finally((arg) => console.log("finally:", arg));
```

```output
hold placed
caught: card expired
fallback: email sent
finally: undefined
```

Follow the chain past `throw new Error("card expired");` to the `.catch`, and note what `.finally((arg) => …)` receives as `arg`.

```quiz
[
  {
    "type": "free",
    "q": "Program 11: write the full output.",
    "model": "hold placed / caught: card expired / fallback: email sent / finally: undefined",
    "points": ["the throw rejects the next promise, so pickup scheduled is skipped", "the .catch logs the message and its return value recovers the chain", "the next .then receives fallback: email sent", "the .finally callback gets no argument, so arg is undefined"],
    "explain": "Slides 46 and 48, plus the pass-through rule from lesson 06."
  },
  {
    "q": "Program 11: which output is right?",
    "options": ["hold placed / caught: card expired / fallback: email sent / finally: undefined", "hold placed / pickup scheduled / caught: card expired / finally: undefined", "hold placed / caught: card expired / finally: fallback: email sent", "hold placed / caught: card expired / fallback: email sent / finally: fallback: email sent"],
    "answer": 0,
    "explain": "The rejection skips the success-only `.then`. The `.catch` returns a string, so the next `.then` logs it. `.finally` is called with no argument."
  }
]
```

### Program 11 as a chain of promises

```widget
promise-chain-play
{ "mode": "chain", "code": "Promise.resolve(\"hold placed\")\n  .then((msg) => {\n    console.log(msg);\n    throw new Error(\"card expired\");\n  })\n  .then(() => console.log(\"pickup scheduled\"))\n  .catch((e) => {\n    console.log(\"caught:\", e.message);\n    return \"fallback: email sent\";\n  })\n  .then((msg) => console.log(msg))\n  .finally((arg) => console.log(\"finally:\", arg));", "predict": true }
```

## 12. An async request

```js run pin program 12
// predict: Write all four lines in order.
async function send() {
  console.log("before await");
  const reply = await Promise.resolve("200 OK");
  console.log("after await:", reply);
}
console.log("request");
send();
console.log("page keeps going");
```

```output
request
before await
page keeps going
after await: 200 OK
```

The call `send();` runs the body until `await Promise.resolve("200 OK")`.

```quiz
[
  {
    "type": "free",
    "q": "Program 12: write the full output.",
    "model": "request / before await / page keeps going / after await: 200 OK",
    "points": ["request prints first", "calling send runs its body synchronously up to the await, so before await is second", "await pauses only the function; page keeps going prints next", "the rest of the function runs as a microtask: after await: 200 OK"],
    "explain": "Slide 52: *await* waits inside the async function; the code after the call keeps running."
  },
  {
    "q": "Program 12: which output is right?",
    "options": ["request / before await / page keeps going / after await: 200 OK", "request / before await / after await: 200 OK / page keeps going", "request / page keeps going / before await / after await: 200 OK", "before await / request / page keeps going / after await: 200 OK"],
    "answer": 0,
    "explain": "The body runs at once up to `await`; the rest waits even for an already fulfilled promise, so `page keeps going` comes before `after await`."
  }
]
```
