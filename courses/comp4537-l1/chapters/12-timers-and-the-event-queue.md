---
title: setTimeout runs after the script, even with 0 ms
minutes: 14
---

Given a script with timers, write its console lines in order. The rule that settles every case: a timer's callback waits until the rest of the script has finished, however short the delay.

<!-- facts: s161 setTimeout, setInterval, t in ms, Tim.. uppercase; s162 1 3 2 with 1000 and with 0, MDN event loop -->

## setTimeout runs a function once after t milliseconds (slide 161)

Slide 161: `setTimeout (function, t)`, *"setTimeout executes the function after the time t (in millisecond ) is elapsed"*, and a reminder that the T in `setTimeout` is uppercase. Its example alerts Hello after 3000 ms; the copy below waits 2000 ms so the run stays under the app's cap.

```js run pin hello-later.js
// predict:
console.log("waiting");
setTimeout(function(){ alert("Hello"); }, 2000);
```

The console shows `waiting` at once and `[alert] Hello` two seconds later: `alert` inside the callback runs only when the timer fires.

`setInterval (function, t)` *"Does the same thing at setTimeout but repeats it"*. The slide's interval never stops. `clearInterval`, beyond the slide, stops it; here after three readings:

```js run pin interval-three-times.js
// predict:
let ticks = 0;
const id = setInterval(function () {
  ticks++;
  console.log("reading " + ticks);
  if (ticks === 3) {
    clearInterval(id);
  }
}, 400);
console.log("started");
```

```output
started
reading 1
reading 2
reading 3
```

`console.log("started")` is the last line of the script, yet it prints first: the first tick comes 400 ms later. `clearInterval(id)` uses the number `setInterval` returned. Lab 1 uses the same two calls for its timing: a pause of n seconds, then n steps two seconds apart.

## The script finishes first, so it prints 1 3 2 (slide 162)

Slide 162 asks for the output of three lines:

```js run pin one-three-two.js
// predict:
console.log(1);
setTimeout(function () {
    console.log(2);
}, 1000);
console.log(3);
```

```output
1
3
2
```

The slide's answer is 1 3 2. `console.log(1)` runs; `setTimeout` hands the function to a timer and returns at once; `console.log(3)` runs; a second later the callback prints 2.

```diagram
{ "type": "sequence", "title": "Why 1 3 2 (slide 162)", "nodes": [ { "id": "s", "label": "script (call stack)", "kind": "lane" }, { "id": "t", "label": "timer", "kind": "lane" }, { "id": "q", "label": "event queue", "kind": "lane" }, { "id": "c", "label": "console", "kind": "lane" } ], "edges": [ { "from": "s", "to": "c", "label": "log(1): 1" }, { "from": "s", "to": "t", "label": "setTimeout registers callback" }, { "from": "s", "to": "c", "label": "log(3): 3" }, { "from": "t", "to": "q", "label": "t elapsed: callback queued" }, { "from": "q", "to": "c", "label": "stack empty: 2" } ], "hi": ["3", "5"], "caption": "The slide's steps drawn: 3 is printed while the callback is still waiting." }
```

### 1 3 2, one event at a time

Click the line that prints next; the callback moves from the timer to the queue and runs only once the stack is empty.

```widget
event-loop-play
{ "preset": "1-3-2", "predict": true }
```

## Replacing 1000 with 0 still prints 1 3 2

*"What if we replace 1000 with 0 ?"* The slide's answer is again 1 3 2.

```js run pin zero-delay.js
// predict:
console.log(1);
setTimeout(function () {
    console.log(2);
}, 0);
console.log(3);
```

```output
1
3
2
```

The only change is `}, 0);`. A delay of 0 means the callback is ready at once, not that it runs at once. It waits in the event queue, and the queue is served only when the call stack is empty, after `console.log(3)`. The slide points to MDN's event loop page for the details.

```diagram
{ "type": "flow", "title": "Call stack, timer, queue", "nodes": [ { "id": "s", "label": "call stack", "sub": "the script" }, { "id": "t", "label": "timer" }, { "id": "q", "label": "event queue" }, { "id": "r", "label": "call stack", "sub": "runs the callback" } ], "edges": [ { "from": "s", "to": "t", "label": "setTimeout(fn, t)" }, { "from": "t", "to": "q", "label": "after t ms" }, { "from": "q", "to": "r", "label": "stack empty" } ], "hi": ["q"], "caption": "The prose's reading of slide 162: the callback waits in the queue until the call stack is empty, even with 0 ms." }
```

## A timer set inside a timer waits its own turn

Beyond the slides, in a shape from the course quizzes: a callback that sets a second, 0 ms timer.

```js run pin nested-timers.js
// predict:
setTimeout(function () {
  console.log("fetch forecast");
  setTimeout(function () {
    console.log("draw map");
  }, 0);
  console.log("show temperature");
}, 600);
console.log("page loaded");
```

```output
page loaded
fetch forecast
show temperature
draw map
```

`console.log("page loaded")` is synchronous, so it is first. At 600 ms the outer callback runs from top to bottom: the inner `setTimeout` only queues `draw map`, so `show temperature` prints before it. The same rule, one level down.

### A 0 ms timer inside a timer

```widget
event-loop-play
{ "preset": "timer-in-timer", "predict": true }
```

## An uncaught error stops the script, not the timers already set

Also from the course quizzes: when the main script throws, the lines after the error never run, but a timer set before it still fires.

```js run pin error-then-timer.js
// predict:
setTimeout(function () {
  let note = "saved";
  console.log("autosave ran");
}, 800);
console.log("editor open");
console.log(note);
console.log("never printed");
```

```output
editor open
Uncaught ReferenceError: note is not defined
autosave ran
```

`note` is declared with `let` inside the callback, so the top-level `console.log(note)` throws a ReferenceError and the script stops: `console.log("never printed")` never runs. The timer was registered before the error, so `autosave ran` still prints 800 ms later.

### The error, then the timers

```widget
event-loop-play
{ "preset": "error-then-timers" }
```

## Order a weather app's timers

New programs. Mark each line "now" or "queued" before you choose.

```quiz
[
  {
    "q": "What does this print?",
    "code": "console.log(\"open\");\nsetTimeout(function () { console.log(\"rain\"); }, 200);\nsetTimeout(function () { console.log(\"sun\"); }, 100);\nconsole.log(\"close\");",
    "options": ["open / close / sun / rain", "open / close / rain / sun", "open / rain / sun / close", "open / sun / rain / close"],
    "answer": 0,
    "explain": "Both synchronous lines first: `open`, `close`. Then the timers by when they elapse: `sun` at 100 ms, `rain` at 200 ms."
  },
  {
    "q": "What does this print?",
    "code": "setTimeout(function () {\n  console.log(\"x\");\n  setTimeout(function () { console.log(\"y\"); }, 0);\n  console.log(\"w\");\n}, 100);\nsetTimeout(function () { console.log(\"z\"); }, 500);\nconsole.log(\"v\");",
    "options": ["v / x / w / y / z", "v / x / y / w / z", "x / w / y / z / v", "v / x / w / z / y"],
    "answer": 0,
    "explain": "`v` is synchronous. At 100 ms the first callback logs `x`, queues `y`, logs `w`. `y` runs right after (about 100 ms); `z` waits until 500 ms."
  },
  {
    "q": "What does this print?",
    "code": "setTimeout(function () { console.log(\"timer\"); }, 0);\nconsole.log(total);\nconsole.log(\"after\");",
    "options": ["Uncaught ReferenceError: total is not defined / timer", "Uncaught ReferenceError: total is not defined / after / timer", "undefined / after / timer", "timer / Uncaught ReferenceError: total is not defined"],
    "answer": 0,
    "explain": "`total` was never declared, so reading it throws and the script stops before `after`. The timer was set before the error and still fires."
  },
  {
    "q": "What does this print?",
    "code": "let n = 0;\nconst id = setInterval(function () {\n  n += 2;\n  console.log(n);\n  if (n >= 6) clearInterval(id);\n}, 100);",
    "options": ["2 / 4 / 6", "2", "2 / 4 / 6 / 8", "0 / 2 / 4"],
    "answer": 0,
    "explain": "Each tick adds 2 and logs: 2, 4, 6. At 6 the condition `n >= 6` is true and `clearInterval` stops the repeats."
  }
]
```

```quiz
[
  {
    "q": "setTimeout executes the function after the time t (in seconds) is elapsed.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 161: *after the time t (in millisecond ) is elapsed*. `setTimeout(f, 3000)` waits three seconds."
  },
  {
    "q": "What does this print?",
    "code": "console.log(\"a\");\nsetTimeout(function () { console.log(\"b\"); }, 0);\nconsole.log(\"c\");",
    "options": ["a / c / b", "a / b / c", "b / a / c", "a / c"],
    "answer": 0,
    "explain": "Slide 162 with letters: even with 0 ms the callback waits in the event queue until the script has finished."
  },
  {
    "q": "What does setInterval do?",
    "options": ["the same thing as setTimeout, but repeats it", "runs the function once, immediately", "runs the function once after t milliseconds", "pauses the script for t milliseconds"],
    "answer": 0,
    "explain": "Slide 161: setInterval *Does the same thing at setTimeout but repeats it*. Neither one pauses the script."
  },
  {
    "q": "Name the place where a setTimeout callback waits after its time is up, until the script has finished.",
    "type": "text",
    "answer": ["event queue", "the event queue", "queue", "task queue", "callback queue"],
    "explain": "Slide 162's title: *Order of execution … Event Queue*. The callback is served from the queue only when the call stack is empty."
  },
  {
    "q": "What does this print?",
    "code": "setTimeout(function () {\n  let level = 3;\n  console.log(\"p\");\n  setTimeout(function () { console.log(\"q\"); }, 200);\n  console.log(\"r\");\n}, 400);\nif (level === 3) {\n  console.log(\"s\");\n}",
    "options": ["Uncaught ReferenceError: level is not defined / p / r / q", "p / r / q / s", "s / p / r / q", "p / r / q / Uncaught ReferenceError: level is not defined"],
    "answer": 0,
    "explain": "`level` exists only inside the callback, so the top-level `if` throws at once; `s` never prints. The timer set before the error still runs at 400 ms: `p`, then `r`, then `q` 200 ms later."
  },
  {
    "q": "Put the events of slide 162's script in order.",
    "type": "reorder",
    "lines": ["console.log(1) prints 1", "setTimeout hands the callback to a timer", "console.log(3) prints 3", "the time elapses and the callback joins the event queue", "the call stack is empty, so the callback prints 2"],
    "explain": "The script runs to the end before the queue is served, which is why the answer is 1 3 2."
  },
  {
    "q": "Which call is spelled correctly?",
    "options": ["`setTimeout(f, 100)`", "`settimeout(f, 100)`", "`setTimeOut(f, 100)`", "`SetTimeout(f, 100)`"],
    "answer": 0,
    "explain": "Slide 161: *remember Tim.. is uppercase*. JavaScript is case-sensitive; the others are not defined and throw a ReferenceError."
  },
  {
    "type": "free",
    "q": "Slide 162's script logs 1, sets a timer that logs 2, then logs 3. Why does it print 1 3 2 even when the delay is 0?",
    "model": "setTimeout does not run the function; it hands it to a timer and returns at once, so console.log(3) runs next. When the time is up (immediately, for 0 ms) the callback is put in the event queue. The queue is served only when the call stack is empty, that is, after the whole script has finished. So 2 prints last whatever the delay.",
    "points": ["setTimeout returns at once without running the callback", "console.log(3) runs before the callback", "the callback waits in the event queue", "the queue runs only when the call stack is empty", "a delay of 0 does not change the order"],
    "rows": 5,
    "explain": "Slide 162 and the event-queue diagram above."
  }
]
```
