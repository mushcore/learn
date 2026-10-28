---
title: What prints, twenty programs on timers, scope, hoisting and promises
minutes: 40
---

The exam shows a short program and asks for its console output, one value per line. Each of the twenty programs below has new values on a shape from lecture 1 or lecture 6; write the whole output in the predict box before Run unlocks, then answer the two questions under it.

## Three queues decide every order

Lecture 1 shows the event queue with a timer (slide 162); lecture 6 adds the queue that promise handlers wait in (slide 17). Three places hold code, and they are emptied in a fixed order:

1. The **call stack** runs the synchronous lines top to bottom, including every promise executor body, which *gets executed* ***immediately*** *upon creation of the promise object* (slide 17).
2. When the stack is empty, the **microtask queue** drains completely: `.then`, `.catch`, `.finally` handlers and the code after an `await`, in the order they were queued, including any queued while draining.
3. Then **one** timer callback runs (shortest delay first, ties in the order they were set), and the microtask queue drains again before the next timer.

```diagram
{ "type": "flow", "dir": "tb", "title": "Three queues", "nodes": [ { "id": "stack", "label": "Call stack", "sub": "synchronous code, executor bodies" }, { "id": "micro", "label": "Microtask queue", "sub": ".then / .catch / .finally / after await" }, { "id": "timers", "label": "Timer queue", "sub": "setTimeout, setInterval; each callback runs on the stack" } ], "edges": [ { "from": "stack", "to": "micro", "label": "stack empty" }, { "from": "micro", "to": "timers", "label": "microtasks empty" } ], "hi": ["micro"], "caption": "Promise handlers do NOT wait for \"all code in the program\" to finish. They wait only for the current call stack to unwind (slide 17)." }
```

A `setTimeout` with 0 ms is not run early: the slide's script prints `1 3 2` for 1000 ms and for 0 ms alike (L1 slide 162).

## Program 1: the clinic front desk (timers, L1 slide 162)

A receptionist logs two steps around a 0 ms timer.

```js run
// predict:
console.log("check in");
setTimeout(() => console.log("called by nurse"), 0);
console.log("take a seat");
```

```output
check in
take a seat
called by nurse
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "console.log(\"check in\");\nsetTimeout(() => console.log(\"called by nurse\"), 0);\nconsole.log(\"take a seat\");",
    "options": ["check in / take a seat / called by nurse", "check in / called by nurse / take a seat", "called by nurse / check in / take a seat", "check in / take a seat"],
    "answer": 0,
    "explain": "The two `console.log` lines are synchronous and run first. The timer callback waits in the event queue until the call stack is empty, so `called by nurse` comes last even with 0 ms. The callback is not lost: it runs once the stack is empty."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "console.log(\"check in\");\nsetTimeout(() => console.log(\"called by nurse\"), 0);\nconsole.log(\"take a seat\");",
    "model": "check in\ntake a seat\ncalled by nurse",
    "points": ["`check in` first and `take a seat` second: both synchronous", "`called by nurse` last: the timer callback waits for the empty stack", "Exactly three lines; the 0 ms delay does not move the callback forward"],
    "rows": 4,
    "explain": "Slide 162's rule: the output stays 1, 3, 2 when 1000 is replaced with 0. Here 1 = `check in`, 3 = `take a seat`, 2 = `called by nurse`."
  }
]
```

## Program 2: the kettle and the guests (a timer inside a timer)

An outer timer at 400 ms sets an inner timer at 0 ms between two logs.

```js run
// predict:
setTimeout(() => {
  console.log("kettle on");
  setTimeout(() => console.log("tea ready"), 0);
  console.log("cups out");
}, 400);
console.log("guests arrive");
```

```output
guests arrive
kettle on
cups out
tea ready
```

```quiz
[
  {
    "q": "Which line prints last?",
    "code": "setTimeout(() => {\n  console.log(\"kettle on\");\n  setTimeout(() => console.log(\"tea ready\"), 0);\n  console.log(\"cups out\");\n}, 400);\nconsole.log(\"guests arrive\");",
    "options": ["tea ready", "cups out", "guests arrive", "kettle on"],
    "answer": 0,
    "explain": "`guests arrive` is synchronous and prints first. At 400 ms the outer callback runs from top to bottom: `kettle on`, it schedules the inner timer, `cups out`. The inner 0 ms callback can run only after the outer callback has finished, so `tea ready` is last."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "setTimeout(() => {\n  console.log(\"kettle on\");\n  setTimeout(() => console.log(\"tea ready\"), 0);\n  console.log(\"cups out\");\n}, 400);\nconsole.log(\"guests arrive\");",
    "model": "guests arrive\nkettle on\ncups out\ntea ready",
    "points": ["`guests arrive` first: the only synchronous line", "`kettle on` then `cups out`: the outer callback runs to its end", "`tea ready` last: the inner timer waits for the outer callback to finish"],
    "rows": 5,
    "explain": "A callback is one stack frame: nothing else runs until it returns. The inner timer was queued during the outer callback, so it runs after it."
  }
]
```

## Program 3: books on a shelf (var vs let in a block, L1 slides 117 and 127)

A function declares one `var` and one `let` inside an `if` block, then reads both after the block.

```js run
// predict:
function shelf() {
  if (true) {
    var books = 12;
    let label = "new arrivals";
  }
  console.log(books);
  console.log(typeof label);
}
shelf();
```

```output
12
undefined
```

```quiz
[
  {
    "q": "What does `console.log(typeof label)` print?",
    "code": "function shelf() {\n  if (true) {\n    var books = 12;\n    let label = \"new arrivals\";\n  }\n  console.log(books);\n  console.log(typeof label);\n}\nshelf();",
    "options": ["undefined", "new arrivals", "string", "Uncaught ReferenceError: label is not defined"],
    "answer": 0,
    "explain": "`let` is *block-scoped*: `label` does not exist after the closing brace of the `if`. `typeof` on a name that does not exist gives the string `\"undefined\"` instead of throwing. Writing `console.log(label)` there would throw `ReferenceError: label is not defined`, as slide 117's let column shows."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "function shelf() {\n  if (true) {\n    var books = 12;\n    let label = \"new arrivals\";\n  }\n  console.log(books);\n  console.log(typeof label);\n}\nshelf();",
    "model": "12\nundefined",
    "points": ["`12`: `var` is function-scoped, so `books` is visible in the whole function", "`undefined`: `let` is block-scoped, so `label` is gone after the block", "`typeof` on a missing name gives \"undefined\" and does not throw"],
    "rows": 3,
    "explain": "Slide 127: *var num = 10; declares a variable which can be accusable within the function it was declared*; *let num = 10; declares a variable which is only accusable within the block it was declared*, where *a block means lines of codes within {}*."
  }
]
```

## Program 4: tomorrow's rainfall (hoisting, L1 slide 132)

Two `var` names are read before their declaration lines.

```js run
// predict:
console.log(rainfall);
var rainfall = 18;
console.log(rainfall);
console.log(typeof forecast);
var forecast = "showers";
```

```output
undefined
18
undefined
```

```quiz
[
  {
    "q": "What does the first line print?",
    "code": "console.log(rainfall);\nvar rainfall = 18;\nconsole.log(rainfall);\nconsole.log(typeof forecast);\nvar forecast = \"showers\";",
    "options": ["undefined", "18", "Uncaught ReferenceError: rainfall is not defined", "null"],
    "answer": 0,
    "explain": "Slide 132: *The JavaScript engine treats all variable declarations using \"var\" as if they are declared at the top*. Only the declaration moves, not the `= 18`, so the variable exists but holds `undefined` until its line runs."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "console.log(rainfall);\nvar rainfall = 18;\nconsole.log(rainfall);\nconsole.log(typeof forecast);\nvar forecast = \"showers\";",
    "model": "undefined\n18\nundefined",
    "points": ["first `undefined`: the declaration is hoisted, the value is not", "`18` after the assignment line has run", "last `undefined`: `forecast` is hoisted too but not yet assigned, so its type is \"undefined\""],
    "rows": 4,
    "explain": "With `let` in place of `var`, the first line would stop the script: slide 132 says *Will issue error and terminate execution. JS engine will NOT hoist variables declared by \"let\"*. Strictly, a `let` is hoisted but sits in the temporal dead zone until its line runs, so reading it throws `ReferenceError: Cannot access 'rainfall' before initialization`; the observable result is the slide's."
  }
]
```

### Hoisting with var, let and const side by side

Swap the declaration kind and watch what the first read finds: `undefined` for `var`, an error for `let` and `const`.

```widget
scope-hoist
{ "preset": "hoisting", "kind": "var" }
```

## Program 5: an empty cart (falsy values, L1 slide 114)

The condition assigns instead of comparing, and the variable is declared below.

```js run
// predict:
if (order = "") {
  console.log("shipping");
} else {
  console.log("cart empty");
}
var order = 3;
console.log(order);
```

```output
cart empty
3
```

```quiz
[
  {
    "q": "Which branch runs, and what is printed after it?",
    "code": "if (order = \"\") {\n  console.log(\"shipping\");\n} else {\n  console.log(\"cart empty\");\n}\nvar order = 3;\nconsole.log(order);",
    "options": ["cart empty / 3", "shipping / 3", "Uncaught ReferenceError: order is not defined", "cart empty / (empty line)"],
    "answer": 0,
    "explain": "`order = \"\"` is an assignment; its value is the empty string. Slide 114: *undefined, null, 0, false, NaN, '' (empty string) are all falsy*, so the `else` branch runs. `var order` is hoisted, so assigning before the declaration line is fine, and `var order = 3` then sets 3. With `order = []` the `if` branch would run: an empty array is an object and is truthy."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "if (order = \"\") {\n  console.log(\"shipping\");\n} else {\n  console.log(\"cart empty\");\n}\nvar order = 3;\nconsole.log(order);",
    "model": "cart empty\n3",
    "points": ["`=` assigns; the condition's value is the empty string", "`''` is on the falsy list, so the else branch prints `cart empty`", "`3`: the later `var order = 3` overwrites the empty string"],
    "rows": 3,
    "explain": "No error: the hoisted `var order` already exists when the condition assigns to it."
  }
]
```

## Program 6: a bus announcer (functions returning functions, L1 slide 166)

A function returns an inner function, which is called at once inside `console.log`.

```js run
// predict:
function makeAnnouncer(stop) {
  return function () {
    console.log("Next stop: " + stop);
  };
}
console.log(makeAnnouncer("Main Street")());
```

```output
Next stop: Main Street
undefined
```

```quiz
[
  {
    "q": "How many lines print, and what is the second?",
    "code": "function makeAnnouncer(stop) {\n  return function () {\n    console.log(\"Next stop: \" + stop);\n  };\n}\nconsole.log(makeAnnouncer(\"Main Street\")());",
    "options": ["Two lines; the second is undefined", "One line: Next stop: Main Street", "Two lines; the second is the inner function's source", "One line: undefined"],
    "answer": 0,
    "explain": "`makeAnnouncer(\"Main Street\")` returns the inner function; the second `()` calls it, which logs `Next stop: Main Street`. The inner function has no `return`, so it returns `undefined`, and the outer `console.log` prints that. Slide 166: *in JavaScript every function returns something, at least undefined*."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "function makeAnnouncer(stop) {\n  return function () {\n    console.log(\"Next stop: \" + stop);\n  };\n}\nconsole.log(makeAnnouncer(\"Main Street\")());",
    "model": "Next stop: Main Street\nundefined",
    "points": ["the inner function still sees `stop` after `makeAnnouncer` has returned", "`Next stop: Main Street` prints while the inner function runs", "`undefined` is the inner function's return value, printed by the outer `console.log`"],
    "rows": 3,
    "explain": "The order follows evaluation: the argument of the outer `console.log` (the call) is evaluated first, and it prints; then the outer call prints its value."
  }
]
```

## Program 7: seats and rows (function vs block scope with timers)

This program combines two slide rules, block scope (L1 slide 127) and `setTimeout` (L1 slide 161); the slide does not show it.

```js run
// predict:
for (var seat = 1; seat <= 3; seat++) {
  setTimeout(() => console.log("var seat " + seat), 0);
}
for (let row = 1; row <= 3; row++) {
  setTimeout(() => console.log("let row " + row), 0);
}
```

```output
var seat 4
var seat 4
var seat 4
let row 1
let row 2
let row 3
```

```quiz
[
  {
    "q": "What do the first three lines say?",
    "code": "for (var seat = 1; seat <= 3; seat++) {\n  setTimeout(() => console.log(\"var seat \" + seat), 0);\n}\nfor (let row = 1; row <= 3; row++) {\n  setTimeout(() => console.log(\"let row \" + row), 0);\n}",
    "options": ["var seat 4 three times", "var seat 1 / var seat 2 / var seat 3", "var seat 3 three times", "let row 1 / let row 2 / let row 3"],
    "answer": 0,
    "explain": "`var seat` is function-scoped: there is one `seat` for the whole loop. The callbacks run only after both loops have finished, when `seat` has been incremented to 4 (the value that ended the loop). `let row` is block-scoped: each iteration gets its own `row`, so those callbacks see 1, 2 and 3."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "for (var seat = 1; seat <= 3; seat++) {\n  setTimeout(() => console.log(\"var seat \" + seat), 0);\n}\nfor (let row = 1; row <= 3; row++) {\n  setTimeout(() => console.log(\"let row \" + row), 0);\n}",
    "model": "var seat 4\nvar seat 4\nvar seat 4\nlet row 1\nlet row 2\nlet row 3",
    "points": ["all six callbacks run after both loops end, in the order they were set", "the `var` loop shares one variable, which ends at 4", "the `let` loop gives each callback its own copy: 1, 2, 3"],
    "rows": 7,
    "explain": "Six 0 ms timers, queued in order. By the time the first runs, the synchronous loops are done."
  }
]
```

## Program 8: opening the shop (the executor runs at once, L6 slides 21 and 22)

The executor logs before and after its `resolve` call, and the main script logs around the promise.

```js run
// predict:
console.log("open shop");
const sale = new Promise((resolve) => {
  console.log("count stock");
  resolve("sold 3");
  console.log("lock till");
});
sale.then((m) => console.log(m));
console.log("close shop");
```

```output
open shop
count stock
lock till
close shop
sold 3
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "console.log(\"open shop\");\nconst sale = new Promise((resolve) => {\n  console.log(\"count stock\");\n  resolve(\"sold 3\");\n  console.log(\"lock till\");\n});\nsale.then((m) => console.log(m));\nconsole.log(\"close shop\");",
    "options": ["open shop / count stock / lock till / close shop / sold 3", "open shop / close shop / count stock / lock till / sold 3", "open shop / count stock / sold 3 / lock till / close shop", "open shop / count stock / lock till / sold 3 / close shop"],
    "answer": 0,
    "explain": "The executor runs immediately, inside `new Promise`, so `count stock` and `lock till` print in place. `resolve` does not stop the executor. The `.then` handler is queued as a microtask and runs only after the current call stack finishes, which is after `close shop`."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "console.log(\"open shop\");\nconst sale = new Promise((resolve) => {\n  console.log(\"count stock\");\n  resolve(\"sold 3\");\n  console.log(\"lock till\");\n});\nsale.then((m) => console.log(m));\nconsole.log(\"close shop\");",
    "model": "open shop\ncount stock\nlock till\nclose shop\nsold 3",
    "points": ["the executor body runs synchronously: `count stock` and `lock till` right after `open shop`", "`resolve` does not end the executor", "the handler prints `sold 3` after the last synchronous line"],
    "rows": 6,
    "explain": "Slide 21's code comments say resolve and reject are *called asynchronously*, but its thought cloud is right: *Resolve and reject are called synchronously to change the state of Promise immediately which in turn invokes the corresponding handlers asynchronously*."
  }
]
```

## Program 9: a hotel booking (settle once, L6 slide 23)

The executor rejects, then resolves, then rejects again.

```js run
// predict:
const booking = new Promise((resolve, reject) => {
  reject("room taken");
  resolve("room 204");
  reject("late reply");
});
booking.then((r) => console.log("booked " + r), (e) => console.log("failed: " + e));
console.log("waiting for hotel");
```

```output
waiting for hotel
failed: room taken
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "const booking = new Promise((resolve, reject) => {\n  reject(\"room taken\");\n  resolve(\"room 204\");\n  reject(\"late reply\");\n});\nbooking.then((r) => console.log(\"booked \" + r), (e) => console.log(\"failed: \" + e));\nconsole.log(\"waiting for hotel\");",
    "options": ["waiting for hotel / failed: room taken", "failed: room taken / waiting for hotel", "waiting for hotel / failed: room taken / booked room 204 / failed: late reply", "waiting for hotel / failed: late reply"],
    "answer": 0,
    "explain": "The first call, `reject(\"room taken\")`, settles the promise as rejected. The later `resolve` and `reject` do nothing: slide 17's handlers are *mutually exclusive And run only once*. Only the rejection handler runs, and only after the synchronous `waiting for hotel`."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "const booking = new Promise((resolve, reject) => {\n  reject(\"room taken\");\n  resolve(\"room 204\");\n  reject(\"late reply\");\n});\nbooking.then((r) => console.log(\"booked \" + r), (e) => console.log(\"failed: \" + e));\nconsole.log(\"waiting for hotel\");",
    "model": "waiting for hotel\nfailed: room taken",
    "points": ["the first settle call wins: rejected with \"room taken\"", "the later `resolve` and `reject` are ignored", "the handler runs after the synchronous `waiting for hotel`"],
    "rows": 3,
    "explain": "Slide 17's grey note: *when reject handlers invokes, the resolve will be ignored because the promise is already settled*."
  }
]
```

## Program 10: the weather service (already-settled promises, L6 slide 25)

Two promises are created already settled, and a synchronous line follows.

```js run
// predict:
Promise.reject("no signal").catch((e) => console.log("radio: " + e));
Promise.resolve("sunny").then((w) => console.log("forecast: " + w));
console.log("weather service started");
```

```output
weather service started
radio: no signal
forecast: sunny
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "Promise.reject(\"no signal\").catch((e) => console.log(\"radio: \" + e));\nPromise.resolve(\"sunny\").then((w) => console.log(\"forecast: \" + w));\nconsole.log(\"weather service started\");",
    "options": ["weather service started / radio: no signal / forecast: sunny", "radio: no signal / forecast: sunny / weather service started", "weather service started / forecast: sunny / radio: no signal", "weather service started / forecast: sunny"],
    "answer": 0,
    "explain": "Both promises are already settled, but slide 25 says handlers *will never be called synchronously, even with an already-resolved promise*. The synchronous line prints first. Both handlers were queued in source order, so the `.catch` handler runs before the `.then` handler."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.reject(\"no signal\").catch((e) => console.log(\"radio: \" + e));\nPromise.resolve(\"sunny\").then((w) => console.log(\"forecast: \" + w));\nconsole.log(\"weather service started\");",
    "model": "weather service started\nradio: no signal\nforecast: sunny",
    "points": ["the synchronous line prints first", "already-settled promises still run their handlers later, as microtasks", "the two handlers run in the order they were attached"],
    "rows": 4,
    "explain": "*Promise.resolve() and Promise.reject() are shortcuts to manually create an already resolved or rejected promise respectively* (slide 25)."
  }
]
```

## Program 11: a ticking clock (resolve inside an interval, L6 slide 24)

An interval calls `resolve` on every tick and stops itself after the third.

```js run
// predict:
let ticks = 0;
const firstTick = new Promise((resolve) => {
  const id = setInterval(() => {
    ticks++;
    console.log("tick " + ticks);
    resolve("resolved at tick " + ticks);
    if (ticks === 3) clearInterval(id);
  }, 100);
});
firstTick.then((m) => console.log(m));
```

```output
tick 1
resolved at tick 1
tick 2
tick 3
```

```quiz
[
  {
    "q": "How many times does the `.then` handler print?",
    "code": "let ticks = 0;\nconst firstTick = new Promise((resolve) => {\n  const id = setInterval(() => {\n    ticks++;\n    console.log(\"tick \" + ticks);\n    resolve(\"resolved at tick \" + ticks);\n    if (ticks === 3) clearInterval(id);\n  }, 100);\n});\nfirstTick.then((m) => console.log(m));",
    "options": ["Once, with \"resolved at tick 1\"", "Three times, ticks 1 to 3", "Once, with \"resolved at tick 3\"", "Never: the interval keeps the promise pending"],
    "answer": 0,
    "explain": "Slide 24's tip: *Once they are settled, their state will not change*. The first tick resolves the promise; the second and third `resolve` calls do nothing. The handler runs right after the first interval callback returns, before the next tick."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "let ticks = 0;\nconst firstTick = new Promise((resolve) => {\n  const id = setInterval(() => {\n    ticks++;\n    console.log(\"tick \" + ticks);\n    resolve(\"resolved at tick \" + ticks);\n    if (ticks === 3) clearInterval(id);\n  }, 100);\n});\nfirstTick.then((m) => console.log(m));",
    "model": "tick 1\nresolved at tick 1\ntick 2\ntick 3",
    "points": ["the interval logs three ticks, then is cleared", "only the first `resolve` counts: the value is \"resolved at tick 1\"", "the handler prints between tick 1 and tick 2: microtasks drain after each timer callback"],
    "rows": 5,
    "explain": "Slide 24's answer is *Hi will be logged only once*; here the interval is also cleared, so the program ends after tick 3."
  }
]
```

## Program 12: the checkout (microtasks before a timer, L6 slide 28)

A 0 ms timer, a two-step promise chain and a synchronous line.

```js run
// predict:
setTimeout(() => console.log("timer: print receipt"), 0);
Promise.resolve()
  .then(() => console.log("micro: charge card"))
  .then(() => console.log("micro: email receipt"));
console.log("sync: scan items");
```

```output
sync: scan items
micro: charge card
micro: email receipt
timer: print receipt
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "setTimeout(() => console.log(\"timer: print receipt\"), 0);\nPromise.resolve()\n  .then(() => console.log(\"micro: charge card\"))\n  .then(() => console.log(\"micro: email receipt\"));\nconsole.log(\"sync: scan items\");",
    "options": ["sync: scan items / micro: charge card / micro: email receipt / timer: print receipt", "timer: print receipt / sync: scan items / micro: charge card / micro: email receipt", "sync: scan items / micro: charge card / timer: print receipt / micro: email receipt", "sync: scan items / timer: print receipt / micro: charge card / micro: email receipt"],
    "answer": 0,
    "explain": "The synchronous line runs first. Then the microtask queue drains completely: `charge card`, which queues `email receipt`, which runs in the same drain. Only then does the timer callback run, even though it was set first with 0 ms."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "setTimeout(() => console.log(\"timer: print receipt\"), 0);\nPromise.resolve()\n  .then(() => console.log(\"micro: charge card\"))\n  .then(() => console.log(\"micro: email receipt\"));\nconsole.log(\"sync: scan items\");",
    "model": "sync: scan items\nmicro: charge card\nmicro: email receipt\ntimer: print receipt",
    "points": ["synchronous code first", "both `.then` handlers before the timer: the second one is queued while the queue is draining", "the 0 ms timer last, although it was set first"],
    "rows": 5,
    "explain": "Same order as slide 28's Example 7 (4, 3, 1, 2): synchronous, then the chained microtasks, then the timer."
  }
]
```

### Program 12 step by step

Each step is one event: watch the second handler join the microtask queue while the first is running, and the timer wait in its own column until the queue is empty.

```widget
event-loop-play
{ "code": "setTimeout(() => console.log(\"timer: print receipt\"), 0);\nPromise.resolve()\n  .then(() => console.log(\"micro: charge card\"))\n  .then(() => console.log(\"micro: email receipt\"));\nconsole.log(\"sync: scan items\");", "predict": true, "stepMs": 1200 }
```

## Program 13: letters in a nest (nested microtasks)

A handler starts a second chain while the microtask queue is draining; a timer waits throughout.

```js run
// predict:
setTimeout(() => console.log("T"));
new Promise((resolve) => {
  resolve();
  console.log("A");
}).then(() => {
  console.log("B");
  Promise.resolve()
    .then(() => console.log("C"))
    .then(() => console.log("D"));
});
console.log("E");
```

```output
A
E
B
C
D
T
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "setTimeout(() => console.log(\"T\"));\nnew Promise((resolve) => {\n  resolve();\n  console.log(\"A\");\n}).then(() => {\n  console.log(\"B\");\n  Promise.resolve()\n    .then(() => console.log(\"C\"))\n    .then(() => console.log(\"D\"));\n});\nconsole.log(\"E\");",
    "options": ["A / E / B / C / D / T", "E / A / B / C / D / T", "A / E / B / T / C / D", "A / B / C / D / E / T"],
    "answer": 0,
    "explain": "`A` prints inside the executor, which runs at once; `resolve()` before it does not stop it. `E` is the last synchronous line. The stack is empty, so the handler runs: `B`, and it queues `C`. The queue is not empty yet, so `C` runs and queues `D`, which runs too. Only when no microtask is left does the timer print `T`."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "setTimeout(() => console.log(\"T\"));\nnew Promise((resolve) => {\n  resolve();\n  console.log(\"A\");\n}).then(() => {\n  console.log(\"B\");\n  Promise.resolve()\n    .then(() => console.log(\"C\"))\n    .then(() => console.log(\"D\"));\n});\nconsole.log(\"E\");",
    "model": "A\nE\nB\nC\nD\nT",
    "points": ["`A` then `E`: the executor and the last line are both synchronous", "`B`, `C`, `D` in one drain: microtasks queued while draining run before any timer", "`T` last: a `setTimeout` with no delay is still a timer"],
    "rows": 7,
    "explain": "A `setTimeout` with no delay argument uses 0 ms. It still waits for the microtask queue to be empty."
  }
]
```

### Program 13 as messages between the queues

The microtask messages, 5 to 7, all happen before the timer gets its turn.

```diagram
{ "type": "sequence", "title": "Program 13, one event per message", "nodes": [ { "id": "st", "label": "stack", "kind": "lane" }, { "id": "mt", "label": "microtasks", "kind": "lane" }, { "id": "tm", "label": "timers", "kind": "lane" }, { "id": "co", "label": "console", "kind": "lane" } ], "edges": [ { "from": "st", "to": "tm", "label": "queue T" }, { "from": "st", "to": "co", "label": "A (executor)" }, { "from": "st", "to": "mt", "label": "queue B" }, { "from": "st", "to": "co", "label": "E" }, { "from": "mt", "to": "co", "label": "B, queue C" }, { "from": "mt", "to": "co", "label": "C, queue D" }, { "from": "mt", "to": "co", "label": "D" }, { "from": "tm", "to": "co", "label": "T" } ], "hi": ["5", "6", "7"], "caption": "Resolve, reject change promise status synchronously which lead to put handlers in microtask and run only after the current call stack finishes (slide 17)." }
```

## Program 14: the text editor (timers queued from microtasks and back)

A handler sets a timer, and a timer queues a handler.

```js run
// predict:
Promise.resolve().then(() => {
  console.log("p: open file");
  setTimeout(() => console.log("t: from p"), 0);
});
setTimeout(() => {
  console.log("t: autosave");
  Promise.resolve().then(() => console.log("p: from autosave"));
}, 0);
console.log("main: editor ready");
```

```output
main: editor ready
p: open file
t: autosave
p: from autosave
t: from p
```

```quiz
[
  {
    "q": "Which line prints last?",
    "code": "Promise.resolve().then(() => {\n  console.log(\"p: open file\");\n  setTimeout(() => console.log(\"t: from p\"), 0);\n});\nsetTimeout(() => {\n  console.log(\"t: autosave\");\n  Promise.resolve().then(() => console.log(\"p: from autosave\"));\n}, 0);\nconsole.log(\"main: editor ready\");",
    "options": ["t: from p", "p: from autosave", "t: autosave", "p: open file"],
    "answer": 0,
    "explain": "The autosave timer is queued during the synchronous run. The `t: from p` timer is queued later, while the first handler runs, so it stands behind autosave. After `t: autosave` runs, its microtask `p: from autosave` drains before the next timer. `t: from p` is last."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.resolve().then(() => {\n  console.log(\"p: open file\");\n  setTimeout(() => console.log(\"t: from p\"), 0);\n});\nsetTimeout(() => {\n  console.log(\"t: autosave\");\n  Promise.resolve().then(() => console.log(\"p: from autosave\"));\n}, 0);\nconsole.log(\"main: editor ready\");",
    "model": "main: editor ready\np: open file\nt: autosave\np: from autosave\nt: from p",
    "points": ["the synchronous line, then the one queued microtask", "timers with equal delay run in the order they were set: autosave before `t: from p`", "the microtask queued by the autosave timer runs before the next timer"],
    "rows": 6,
    "explain": "One timer at a time, with a full microtask drain after each one."
  }
]
```

### Program 14 step by step

Watch the timer column: autosave is already waiting when the handler adds `t: from p` behind it.

```widget
event-loop-play
{ "code": "Promise.resolve().then(() => {\n  console.log(\"p: open file\");\n  setTimeout(() => console.log(\"t: from p\"), 0);\n});\nsetTimeout(() => {\n  console.log(\"t: autosave\");\n  Promise.resolve().then(() => console.log(\"p: from autosave\"));\n}, 0);\nconsole.log(\"main: editor ready\");", "predict": true }
```

## Program 15: stocking shelves (values down a chain, L6 slides 27 and 31)

Each handler logs a value and returns a new one.

```js run
// predict:
new Promise((resolve) => resolve(4))
  .then((n) => {
    console.log("boxes:", n);
    return n * 6;
  })
  .then((n) => {
    console.log("books:", n);
    return n - 4;
  })
  .then((n) => console.log("shelved:", n));
```

```output
boxes: 4
books: 24
shelved: 20
```

```quiz
[
  {
    "q": "What does the third handler print?",
    "code": "new Promise((resolve) => resolve(4))\n  .then((n) => {\n    console.log(\"boxes:\", n);\n    return n * 6;\n  })\n  .then((n) => {\n    console.log(\"books:\", n);\n    return n - 4;\n  })\n  .then((n) => console.log(\"shelved:\", n));",
    "options": ["shelved: 20", "shelved: 0", "shelved: 24", "shelved: undefined"],
    "answer": 0,
    "explain": "4 goes to the first handler, which returns 4 × 6 = 24. The second handler gets 24 and returns 24 − 4 = 20. Slide 31: *The value returned from .then() is passed to the internal resolve function of the NEW promise created by .then()*."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "new Promise((resolve) => resolve(4))\n  .then((n) => {\n    console.log(\"boxes:\", n);\n    return n * 6;\n  })\n  .then((n) => {\n    console.log(\"books:\", n);\n    return n - 4;\n  })\n  .then((n) => console.log(\"shelved:\", n));",
    "model": "boxes: 4\nbooks: 24\nshelved: 20",
    "points": ["the resolved 4 reaches the first handler", "each returned value becomes the next handler's argument: 24, then 20", "`console.log(\"a:\", n)` prints the two values separated by a space"],
    "rows": 4,
    "explain": "*Returning a value is defined as success ( passing to resolve of new promise)* (slide 31)."
  }
]
```

## Program 16: a walk (a chain that starts after a delay, L6 slide 32)

The promise resolves inside a 300 ms timer.

```js run
// predict:
new Promise((resolve) => setTimeout(() => resolve(10), 300))
  .then((km) => {
    console.log("walked", km);
    return km + 5;
  })
  .then((km) => console.log("total", km));
console.log("start walking");
```

```output
start walking
walked 10
total 15
```

```quiz
[
  {
    "q": "What does the console show, and when?",
    "code": "new Promise((resolve) => setTimeout(() => resolve(10), 300))\n  .then((km) => {\n    console.log(\"walked\", km);\n    return km + 5;\n  })\n  .then((km) => console.log(\"total\", km));\nconsole.log(\"start walking\");",
    "options": ["start walking at once; walked 10 and total 15 after about 300 ms", "walked 10 / total 15 / start walking, all after 300 ms", "start walking / walked 10 at once; total 15 after 300 ms", "start walking / walked undefined / total NaN"],
    "answer": 0,
    "explain": "The promise stays pending for 300 ms, so neither handler can run before then. The synchronous line prints first. When the timer calls `resolve(10)`, the first handler prints `walked 10` and returns 15, which the second handler prints."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "new Promise((resolve) => setTimeout(() => resolve(10), 300))\n  .then((km) => {\n    console.log(\"walked\", km);\n    return km + 5;\n  })\n  .then((km) => console.log(\"total\", km));\nconsole.log(\"start walking\");",
    "model": "start walking\nwalked 10\ntotal 15",
    "points": ["`start walking` first: the promise is still pending", "handlers wait until the timer calls `resolve(10)`", "the returned 15 flows to the second handler"],
    "rows": 4,
    "explain": "Same shape as slide 32's Example 10 (`First: 2`, `Second: 6`, `Final: 7` after 500 ms)."
  }
]
```

## Program 17: the office printer (return an Error vs throw one, L6 slide 31)

Two chains: one handler returns an `Error`, the other throws one.

```js run
// predict:
Promise.resolve()
  .then(() => new Error("printer jam"))
  .then((v) => console.log("fulfilled: " + v.message), (e) => console.log("rejected: " + e.message));
Promise.resolve()
  .then(() => {
    throw new Error("paper out");
  })
  .then((v) => console.log("fulfilled: " + v.message), (e) => console.log("rejected: " + e.message));
```

```output
fulfilled: printer jam
rejected: paper out
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "Promise.resolve()\n  .then(() => new Error(\"printer jam\"))\n  .then((v) => console.log(\"fulfilled: \" + v.message), (e) => console.log(\"rejected: \" + e.message));\nPromise.resolve()\n  .then(() => {\n    throw new Error(\"paper out\");\n  })\n  .then((v) => console.log(\"fulfilled: \" + v.message), (e) => console.log(\"rejected: \" + e.message));",
    "options": ["fulfilled: printer jam / rejected: paper out", "rejected: printer jam / rejected: paper out", "rejected: paper out / fulfilled: printer jam", "fulfilled: printer jam / fulfilled: paper out"],
    "answer": 0,
    "explain": "Slide 31's core rule: *Returning a value is defined as success*, *Throwing an error is defined as failure*. An `Error` object that is returned is just a value, so the first chain is fulfilled. The thrown one rejects the second chain. The two chains take turns in the microtask queue: both first handlers run, then both second handlers, so the first chain prints first."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.resolve()\n  .then(() => new Error(\"printer jam\"))\n  .then((v) => console.log(\"fulfilled: \" + v.message), (e) => console.log(\"rejected: \" + e.message));\nPromise.resolve()\n  .then(() => {\n    throw new Error(\"paper out\");\n  })\n  .then((v) => console.log(\"fulfilled: \" + v.message), (e) => console.log(\"rejected: \" + e.message));",
    "model": "fulfilled: printer jam\nrejected: paper out",
    "points": ["a returned `Error` fulfils the next promise: the success handler runs", "a thrown `Error` rejects it: the failure handler runs", "the chains interleave by microtask, so the first chain's line prints first"],
    "rows": 3,
    "explain": "The exam likes this trap because the returned object *looks* like an error. Only `throw` (or a rejected promise) makes the next promise rejected."
  }
]
```

### The printer chain, box by box

Each `.then` returns a new promise box; watch which box turns fulfilled and which turns rejected.

```widget
promise-chain-play
{ "mode": "chain", "code": "Promise.resolve()\n  .then(() => new Error(\"printer jam\"))\n  .then((v) => console.log(\"fulfilled: \" + v.message), (e) => console.log(\"rejected: \" + e.message));", "predict": true }
```

## Program 18: a lost parcel (throw, catch, recover, L6 slides 43 and 46)

The first handler throws; a `.catch` recovers, and two more handlers follow.

```js run
// predict:
Promise.resolve("order 17")
  .then((o) => {
    throw new Error(o + " lost");
  }, () => console.log("handler A"))
  .catch((e) => {
    console.log("caught: " + e.message);
    return "order 17 resent";
  })
  .then((o) => console.log("then: " + o))
  .then(null, () => console.log("handler B"));
```

```output
caught: order 17 lost
then: order 17 resent
```

```quiz
[
  {
    "q": "Which handlers print?",
    "code": "Promise.resolve(\"order 17\")\n  .then((o) => {\n    throw new Error(o + \" lost\");\n  }, () => console.log(\"handler A\"))\n  .catch((e) => {\n    console.log(\"caught: \" + e.message);\n    return \"order 17 resent\";\n  })\n  .then((o) => console.log(\"then: \" + o))\n  .then(null, () => console.log(\"handler B\"));",
    "options": ["the catch and the next then, not handler A or handler B", "handler A, then the catch", "the catch only", "handler A, the catch, the next then and handler B"],
    "answer": 0,
    "explain": "A `.then(f, g)` whose `f` throws does not run its own `g`: `g` only handles a rejection of the promise *before* it, and that one was fulfilled. The throw rejects the new promise, so `.catch` runs and returns a value, which fulfils the next promise. `.then(null, f)` *is the same as* `.catch(f)` (slide 46), and nothing is rejected any more, so handler B never runs."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.resolve(\"order 17\")\n  .then((o) => {\n    throw new Error(o + \" lost\");\n  }, () => console.log(\"handler A\"))\n  .catch((e) => {\n    console.log(\"caught: \" + e.message);\n    return \"order 17 resent\";\n  })\n  .then((o) => console.log(\"then: \" + o))\n  .then(null, () => console.log(\"handler B\"));",
    "model": "caught: order 17 lost\nthen: order 17 resent",
    "points": ["handler A never runs: a handler does not catch its own sibling's throw", "`.catch` receives the thrown error and returns a value, which recovers the chain", "handler B never runs: `.then(null, f)` only runs on a rejection"],
    "rows": 3,
    "explain": "Promises were designed to behave like *async try/catch blocks* (slide 33): after a catch that returns normally, the chain is back on the success path."
  }
]
```

## Program 19: a receipt (finally and a non-function then, L6 slides 48 and 49)

`.then` gets a string instead of a function, then `.finally` and one more `.then` follow.

```js run
// predict:
Promise.resolve("receipt 88")
  .then("not a function")
  .finally((x) => console.log("finally got " + x))
  .then((v) => console.log("then got " + v));
```

```output
finally got undefined
then got receipt 88
```

```quiz
[
  {
    "q": "What does the console show?",
    "code": "Promise.resolve(\"receipt 88\")\n  .then(\"not a function\")\n  .finally((x) => console.log(\"finally got \" + x))\n  .then((v) => console.log(\"then got \" + v));",
    "options": ["finally got undefined / then got receipt 88", "finally got receipt 88 / then got receipt 88", "finally got not a function / then got not a function", "Uncaught TypeError"],
    "answer": 0,
    "explain": "A `.then` whose argument is not a function is skipped: the value \"receipt 88\" passes through unchanged. The `.finally` handler is called with no argument, so `x` is `undefined`, and it passes the incoming value through to the next `.then`. Slide 48 says `.finally(f)` *is similar to* `.then(f, f)`; the difference shows here, because `.then(f, f)` would hand `f` the value."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "Promise.resolve(\"receipt 88\")\n  .then(\"not a function\")\n  .finally((x) => console.log(\"finally got \" + x))\n  .then((v) => console.log(\"then got \" + v));",
    "model": "finally got undefined\nthen got receipt 88",
    "points": ["a non-function `.then` argument is ignored; the value passes through", "the `.finally` handler receives no argument: `undefined`", "`.finally` passes \"receipt 88\" on to the next `.then`"],
    "rows": 3,
    "explain": "Slide 48 notes *there are more into .finally method that is outside the scope of this class*; the no-argument rule is one of them, and the run shows it."
  }
]
```

## Program 20: the café (async and await, L6 slide 52)

An `async` function awaits a fulfilled promise, a second one awaits a rejected promise inside `try`/`catch`, and the main script logs around the calls.

```js run
// predict:
async function loadMenu() {
  console.log("load start");
  const dish = await Promise.resolve("soup");
  console.log("loaded " + dish);
  return "menu ready";
}
async function pay() {
  try {
    await Promise.reject(new Error("card declined"));
    console.log("paid");
  } catch (e) {
    console.log("caught " + e.message);
  }
}
console.log("before");
loadMenu().then((m) => console.log(m));
console.log("after");
pay();
```

```output
before
load start
after
loaded soup
caught card declined
menu ready
```

```quiz
[
  {
    "q": "Where does `load start` print?",
    "code": "async function loadMenu() {\n  console.log(\"load start\");\n  const dish = await Promise.resolve(\"soup\");\n  console.log(\"loaded \" + dish);\n  return \"menu ready\";\n}\nasync function pay() {\n  try {\n    await Promise.reject(new Error(\"card declined\"));\n    console.log(\"paid\");\n  } catch (e) {\n    console.log(\"caught \" + e.message);\n  }\n}\nconsole.log(\"before\");\nloadMenu().then((m) => console.log(m));\nconsole.log(\"after\");\npay();",
    "options": ["Second, between before and after", "Third, after after", "First, before before", "Fourth, after loaded soup"],
    "answer": 0,
    "explain": "An `async` function runs synchronously up to its first `await`, so `load start` prints inside the call, before `after`. The code after each `await` waits in the microtask queue: `loaded soup`, then the `catch` in `pay` prints `caught card declined`. `menu ready` comes last because the returned value fulfils the function's promise only when `loadMenu` finishes, which queues the `.then` handler behind `pay`'s continuation. `paid` never prints."
  },
  {
    "type": "free",
    "q": "Write the console output of this program, one value per line.",
    "code": "async function loadMenu() {\n  console.log(\"load start\");\n  const dish = await Promise.resolve(\"soup\");\n  console.log(\"loaded \" + dish);\n  return \"menu ready\";\n}\nasync function pay() {\n  try {\n    await Promise.reject(new Error(\"card declined\"));\n    console.log(\"paid\");\n  } catch (e) {\n    console.log(\"caught \" + e.message);\n  }\n}\nconsole.log(\"before\");\nloadMenu().then((m) => console.log(m));\nconsole.log(\"after\");\npay();",
    "model": "before\nload start\nafter\nloaded soup\ncaught card declined\nmenu ready",
    "points": ["an async function runs synchronously until its first `await`: `load start` before `after`", "code after `await` runs as a microtask, in queue order: `loaded soup`, then the catch", "a rejected `await` jumps to `catch`; `paid` never prints", "*When a function is declared as async, it automatically returns a promise*: `menu ready` arrives through `.then`, last"],
    "rows": 7,
    "explain": "Slide 52: *await: This is used inside async functions to wait for a promise to resolve or reject*. Waiting pauses only the async function, never the main script."
  }
]
```

## The rules behind the twenty orders

```quiz
[
  {
    "q": "True or false: promise handlers wait for all the code in the program, timers included, to finish before they run.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 17: *Promise handlers do NOT wait for \"all code in the program\" to finish. They wait only for the current call stack to unwind.* A pending timer runs after them."
  },
  {
    "q": "True or false: the promise executor gets executed immediately upon creation of the promise object.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 17, callout 3: *Promise executer function. Gets executed immediately upon creation of the promise object*. That is why executor logs print in place (programs 8 and 13)."
  },
  {
    "q": "Name the queue that `.then` handlers wait in (one word, or two).",
    "type": "text",
    "answer": ["microtask", "microtask queue", "microtasks", "micro task", "job queue"],
    "explain": "Slide 17: resolve and reject *lead to put handlers in microtask*. Timer callbacks wait in a separate queue that is served only when no microtask is left."
  },
  {
    "q": "Which of these lines runs before a `.then` handler of an already-resolved promise created earlier in the same script?",
    "options": ["a `console.log` written after it", "a `setTimeout(f, 0)` callback set before it", "a `.then` handler of a promise resolved later by a timer", "none: the handler runs at once"],
    "answer": 0,
    "explain": "Slide 25: handlers *will never be called synchronously, even with an already-resolved promise*. Every later synchronous line comes first; timer callbacks come after."
  },
  {
    "q": "Put the three steps for a what-prints question in order.",
    "type": "reorder",
    "lines": ["Run the synchronous lines top to bottom, executor bodies included", "Drain the microtask queue, including handlers queued while draining", "Run one timer callback, shortest delay first", "Drain the microtask queue again, then the next timer"],
    "explain": "The stack, then all microtasks, then one timer at a time with a drain after each (programs 12 to 14)."
  }
]
```
