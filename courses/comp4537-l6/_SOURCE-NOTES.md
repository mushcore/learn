# COMP 4537 Lecture 6 — "how to implement Microservices communication asynchronously (intro to promises in JS)": transcription of the instructor's deck

Source file: `COMP4537-Lecture6-Promises, structured way to manage results and errors of asynchronous operations  2026` (56 pages; text layer in `D:\BCIT\COMP4537\txt\COMP4537-Lecture6-Promises, structured way to manage results and errors of asynchronous operations  2026.txt`, rendered pages in `D:\BCIT\COMP4537\png\L6\p001.png` … `p056.png`). Instructor: Amir Amintabar, PhD. Transcribed 2026-10-27.

Summary: the deck opens with a review of HTTP verbs (PUT vs PATCH, PUT idempotent vs POST not), first-class functions, callbacks and a function that returns an object with methods. It then argues that asynchronous operations (all network communication between microservices) need both a value and a success/failure outcome, while "functions return only one thing", and introduces the JavaScript Promise: the boss/raise analogy, the three states (pending, fulfilled, rejected; fulfilled + rejected = settled), the Promise object, the heavily annotated constructor slide (executor runs immediately; resolve/reject change state synchronously; handlers run asynchronously as microtasks, mutually exclusive, once; then() returns a promise), and "promises are eager". Examples 1–12 drill the log order of executor code vs main stack vs handlers, settle-once behaviour, Promise.resolve(), chaining with return values, catch, and setTimeout vs microtasks. It compares try/catch with then/catch, poses the async(callMeBack) ordering activity, shows Chrome DevTools views of [[PromiseStatus]]/[[PromiseValue]] before and after 5 s, default resolve/reject with "Uncaught (in promise)" errors, nested AJAX calls (callback hell), then the three methods .then/.catch/.finally with examples, async/await, an in-class timing activity, GET vs POST response size, and a correction of the w3schools readyState table.

Conventions: slide numbers are PDF pages. `[note: …]` lines are the transcriber's notes, not slide text. Where the slide prints no answer, the line `A: (not on the slide)` appears; for code-order examples a separately labelled `[note: computed …]` gives the output a modern engine produces, so writers can key items, but it is not the instructor's text.

Numbering trap: the deck uses "Example 9" and "Example 10" twice (slides 30/32 for chaining activities, slides 38/39 for default resolve/reject). Always cite these by slide number.

## Title and outline (slides 1–2)
- **Slide 1 (title)**: "Adv Web Dev Arch" / "Lecture 6 (updated 2026)" / "how to implement" / "Microservices communication asynchronously" / "(intro to promises in JS)" / "Amir Amintabar, PhD".
- **Slide 2, "Outline"**:
  - 1 Review
  - 2 Asynch operations
  - 3 Promises in JS
  - 4 Promise status
  - 5 .catch() and .finally()
  - 6. In class activity
  - 7. remarks on **response size** of GET vs POST requests
  - 8. W3Schools website seems inaccurate
  - Then, separated: "Quizzes on promise during labs, this week"; "No new labs this week. Next lab will be assigned after the midterm"; "Midterm exam administrated on Learning Hub"; sub-bullet "Closed book, one sheet of letter-sized paper both sides allowed".
  - [note: the green section circles in the deck are numbered 1–8 and match this outline: 1 on slide 3, 2 on slide 7, 3 on slide 11, 4 on slide 20, 5 on slide 35, 6 on slide 41 (".finally") and again on slide 53 ("In class activity"), 7 on slide 54, 8 on slide 55.]

## 1. Review: HTTP verbs, PUT vs PATCH vs POST, idempotency (slide 3)
- **Slide 3, "review"** (green circle "1"):
  - "myDomain.com/api/customers" [figure: a blue speech-bubble callout labelled "resource" points at the URL `myDomain.com/api/customers`.]
  - "Every http request has a verb or method that determines its intention"
  - "GET,PUT,DELETE,POST"
  - "PUT: replacing an object entirely with something new"
  - "PATCH: updating only a property of an object"
  - "PUT vs POST"
  - "PUT is idempotent, POST is not"
  - "calling PUT once or several times successively has the same effect (that is no side effect), whereas successive identical POST requests may have additional effects, e.g. leading to placing an order several times."
  - Blue side box: "Idempotent: can be applied multiple times without changing the result"

## Review: first-class functions, callbacks, function returning an object (slides 4–6)
- **Slide 4, "Remember in JS can a function receive another function as parameter? first-class functions"**
  - "Example:"

```js
function foo(x) {
     alert(x);
}
function bar(func) {
     func("Hello World!");
}

//alerts "Hello World!"
bar(foo);
```

- **Slide 5, "Remember Call backs"**

```js
function myDisplayer(some) {
  document.getElementById("demo").innerHTML = some;
}
function myCalculator(num1, num2, myCallback) {
  let sum = num1 + num2;
  myCallback(sum);
}
myCalculator(5, 5, myDisplayer);
```

  - "Example above says"
  - "\"here are arguments to do sth with them in this function\""
  - "\"here is the function to call once you are done\""
- **Slide 6, "Function returning an object which has methods"**
  - Q: "What does this function return? ( what data type?)"
  - A: (not on the slide) [note: it returns an object (data type `object`) whose two properties `add` and `multiply` are functions (methods).]
  - Code (dark editor screenshot):

```js
function math() {
  return {
    add: function(x, y) {
      return x + y;
    },
    multiply: function(x, y) {
      return x * y;
    }
  };
}
```

  - Q: "how would you add two numbers using the code snipped above?" (sic, "snipped")
  - A (grey, revealed text): "math().add(2,3)"

## 2. Async operations and callback hell (slides 7–10)
- **Slide 7** (section divider, green circle "2"): "Asyc operations and callback hell!" (sic, "Asyc")
- **Slide 8, "What if a function does asynchronous operations ?"**
  - "Microservices communicate via the net using API calls"
  - "and any communication via net is asynchronous"
- **Slide 9, "problem"**
  - "In js Functions can only return a single value, whether of primitive data type (number, string etc) or a non- primitive data type such as an object."
  - Two code screenshots (light background):

```js
function add (a, b) {
  return a + b;
}
```

```js
function person (name, age) {
  return {
    name: name,
    age: age
  };
}
```

  - "Usually, we call the function in our code, and do stuff based on the retuned value. But what if the operation performed by a function is *asynchronous?*" (sic, "retuned") [a worried-face emoji beside it]
  - Q: "why functions doing asynchronous operations are more complicated?"
  - A: (not on the slide) [note: slide 10 continues the argument: we need both the value and whether the operation succeeded or failed.]
- **Slide 10** (untitled, continues):
  - "Dealing with functions doing asynchronous stuff, we are not only interested in the returned value, but **also in how it was returned**, was the operation successful or failed ( timed-out, DB is down, authentication error etc)"
  - "1- Do something with the success"
  - "2- Or deal with the failure gracefully"
  - "But functions return only one thing! (read with scream)"
  - Q: "Whats your solution ?"
  - A (next bullet): "Lets  simply return an object that has two callback methods, resolve() and reject()! We simply override them based on what we want ☺"

## 3. Promises in JavaScript: analogy, states, Promise object (slides 11–19)
- **Slide 11** (section divider, green circle "3"): "Promise in JavaScript"
- **Slide 12** (divider): "Understanding promises"
- **Slide 13, "Understanding Promises"**
  - "\"Imagine yourself working in a company. Your boss **promises** you a raise someday."
  - "You don't know if you will get that raise until next quarter, you just wait(*pending*). Your boss can either really get you the raise(*fulfilled*), or stand you up and withhold (*reject*)it if she/he is not happy :(."
  - "That is a **promise**. A promise has 3 states:"
  - "**1.Pending**: You *don't know* if you will get the raise"
  - "**2. Resolved (Fulfilled)**: Boss is happy, gets you the raise. describe what you would do in a function called resolve()" (green)
  - "**3.Rejected**: Your boss is unhappy, withholds the raise. Lets describe what you would do in a function called reject()" (red)
- **Slide 14, "Remember the three possible status of a JS promise"**
  - Three words stacked: **Pending** (black), **Fulfilled** (green), **Rejected** (red).
  - [figure: a hand-drawn loop encircles "Fulfilled" and "Rejected" (not "Pending"); a hand-drawn line runs from the loop to a blue rectangle labelled "Settled". Meaning: fulfilled and rejected together are the "settled" states.]
- **Slide 15** (untitled):
  - "Js runs asynchronously. That means you never exactly know when things happen. Remember the restaurant with single waiter analogy. When you ask the waiter for sth, you never know when he is going to get back to you."
  - "You only get a promise. (he might get back to you , he might forget)"
  - "When you make an AJAX call you never know when you are going to get back the result. Imagine other part of your code is pending for the result of this AJAX."
- **Slide 16, "Promise() is an object in JavaScript"** (numbered list):
  1. "The Promise object is used for asynchronous computations."
  2. "A Promise represents a single asynchronous operation that hasn't completed yet, but is expected in the future."
  3. "You pass a function to the constructor which gets executed the moment the promise object gets created"
  4. "The executer function gets **reference of** two functions ( **resolve** and **reject**) as input" (sic, "executer")
  5. "The Promise object has a method  called then()"
  - Code line:

```js
let promise = new Promise( myExecuter( res(),rej() ) );
```

  - [figure: on `res()` and `rej()` the parentheses `()` are struck through in red, signalling that the functions are passed by reference, not called. Thin connector lines: from "constructor" (item 3) to `Promise(`; from "function" in item 4 ("executer function") to `myExecuter(`; from bold "resolve" (item 4) to `res`; from bold "reject" (item 4) to `rej`.]
  - [note: the line is pseudo-code, not valid JS: you pass the executor function itself, e.g. `new Promise(myExecuter)` where `function myExecuter(res, rej) {…}`.]
- **Slide 17, "Promise object constructor"** (grey background; this is "the gray slide" that later slides refer to):

```js
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

  - [figure: a grey dotted box surrounds the executor arrow function `(resolve, reject)=> { … }`. A cyan solid box surrounds the parameter `resolve` and a cyan solid box surrounds the first handler `(resolveMes)=> { console.log(resolveMes); }`; a cyan arrow runs from the first handler up to the `resolve` parameter. A red dashed box surrounds the parameter `reject` and a red dashed box surrounds the second handler `(rejectMes)=> { console.log(rejectMes) }`; a red dashed arrow runs from the second handler up to the `reject` parameter. Callout 1 has a cyan arrow to `resolve` and a red arrow to the `Promise(` line. Callout 3 points to a blue bar beside the `reject(…)`/`resolve(…)` lines. Callout 4 points at the same lines. Callout 5 has a blue arrow to `.then(`.]
  - Numbered callouts, verbatim:
    1. "1. Promise constructor to which we can pass a function called executer. This function itself gets two functions first one points to resolve, the second one points to reject"
    2. "2. Definition of the two handlers (functions) resolve and promise are given here, or could be given elsewhere but passed by reference" (sic, "resolve and promise"; means resolve and reject; "handlers" in yellow)
    3. "3. Promise executer function. Gets executed **immediately** upon creation of the promise object" ("immediately" bold yellow)
    4. "4. resolve and reject invoke handlers asynchronously and mutually exclusive And run only once" ("asynchronously" and "mutually exclusive" in yellow; monospace)
    5. "5. The then() method itself returns a promise"
  - Grey (dark-blue) notes, verbatim:
    - "Resolve, reject change promise status synchronously which lead to put handlers in microtask and run only after the current call stack finishes"
    - "Promise handlers do **NOT** wait for "all code in the program" to finish."
    - "They wait only for the **current call stack** to unwind."
    - "In this example, when reject handlers invokes, the resolve will be ignored because the promise is already settled."
  - Footer: "Note: blue color indicates resolve contents, Red indicates reject ones"
  - [note: running this code logs only `Rejected!`: `reject` is called first, the promise settles as rejected, and the later `resolve("Resolved!")` is a no-op.]
- **Slide 18** (untitled):
  - "resolve / reject do not invoke handlers directly; they change the promise's state , JavaScript then queues the handlers ( as you know queuing ➔ asynch )"
  - "In fact resolve(),reject() **create** the promise's value; .then()handlers **receives** the promise's value"
  - (empty bullet) then: "resolve is one specific function created by js internally, the first callback passed to .then(callback1(), callback(2) ) is a different function they exist at different times they play different roles"
  - [note: this slide is accurate and corrects the looser wording on slides 10, 44 and 39 ("override"/"replaces the default definition of resolve"): the handlers passed to `.then()` are separate functions, not redefinitions of resolve/reject.]
- **Slide 19, "Eager vs lazy"**
  - "Promises are eager. This means that **when a new Promise is constructed, it immediately starts executing, attempting to resolve the** asynchronous value ( meaning the resolve, reject methods are called asynchronously by a synchronous executer method  )"
  - [note: the parenthesis is inaccurate. The executor runs synchronously and `resolve`/`reject` are called synchronously inside it (as slide 17's grey note and slide 21's cloud say); it is the `.then`/`.catch` handlers that run asynchronously.]

## 4. Promise examples 1–11 (slides 20–34)
- **Slide 20** (section divider, green circle "4"): "Promise Examples"
- **Slide 21, "Example 1:"**
  - "In what order the strings below will be logged?"
  - Code (dark editor, line numbers dropped):

```js
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

  - Thought cloud (bubbles rising from the `//pending ..` comment): "Resolve and reject are called synchronously to change  the state of Promise immediately which in turn invokes the corresponding handlers asynchronously and mutually exclusive"
  - Answer box (blue, right), verbatim:
    - "A:"
    - "**2** ( we said the executor will invoke the moment the promise constructor is called."
    - "**5** ( 2 and 5) execute synchronously"
    - "**1** then this like executes synchronously as it is in the same execution stack" (sic, "like" = line)
    - "**4** invokes asynchronously and mutually exclusive which means the main execution stack finishes first, then one of these two the invokes first, will block the other one from execution ."
  - Logged order (from the answer):

```text
2 called immediately 
5 called immediately 
1 Main execution stack
4 Resolved!
```

  - [note: the code comments say resolve/reject are "called asynchronously"; the cloud says they are "called synchronously". The cloud is right: the calls are synchronous; the handler runs asynchronously. "3 Rejected!" is never logged because the promise was already resolved.]
- **Slide 22, "Example 2: in what order the numbers will be logged?"**

```js
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

  - Answer (dark output box on the right):

```text
7
2
5
1
8
4
```

  - [note: "3" never logs: reject after resolve is ignored. "8" logs before "4" because the handler waits for the current call stack to finish.]
- **Slide 23, "Example 3"**

```js
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

  - Q (blue box): "In what order the console logs the numbers?"
  - A (red box):

```text
2
5
1
3
```

  - Q (black box): "what happened to 4?"
  - A: (not on the slide) [note: per slide 17's grey note and slide 24's tip: the promise was already settled (rejected) by `reject(" 3 ")`, so `resolve(" 4 ")` does nothing.]
- **Slide 24, "Example 4: How many times 'Hi' will be logged?"**

```js
// How many times "Hi" will be logged?
let promise = new Promise((res) => {
    setInterval(() => {
        res("Hi");
    }, 100);
});
promise.then((mes)=>{console.log(mes)});
```

  - "**Tip**: Remember we said promises are either pending or settled (settled: resolved or rejected). Once they are settled, their state will not change"
  - "If the promise has already been resolved to a value to a rejection or to another promise, then the res method does nothing ."
  - "**A**: Hi will be logged only once."
  - [note: the interval keeps firing every 100 ms forever (it is never cleared), but each later `res("Hi")` is a no-op.]
- **Slide 25, "Example 5:"**
  - "Promise.resolve() and Promise.reject() are shortcuts to manually create an already resolved or rejected promise respectively."
  - "In what order the numbers will be logged?"

```js
Promise.resolve().then(() => console.log(1));
console.log(2);
```

  - "Remember the note in the gray slide about functions passed to then(), which means resolve and reject, will never be called synchronously, even with an already-resolved promise"
  - "Therefore the order is:"

```text
2
1
```

  - [note: precisely, it is the handler functions passed to `then()` that are never called synchronously; the slide's "which means resolve and reject" refers to those handlers, not to the executor's `resolve`/`reject` functions.]
- **Slide 26, "Chaining promises"**
  - "If you remember the note 5 of the gray slide, The then() method returns a Promise. That's why we can chain promises ."
  - "The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise"
  - Pseudo-code lines (as printed, mixed fonts; red parentheses in the original):

```text
function return (new Promise) ).then(()=>{return (new Promise)}).then
promise.then()
```

- **Slide 27, "Example 6 ( in-class activity)"**
  - "1. What will be logged ?"

```js
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

  - A: (not on the slide)
  - [note: computed, not on slide: logs `First: 1`, `Second: 2`, `Final: 6`.]
- **Slide 28, "Example 7"**
  - "In what order the numbers will be logged?"

```js
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
wait(0).then(() => console.log(2));
Promise.resolve().then(() => console.log(3)).then(() => console.log(1));
console.log(4);
```

  - A: (not on the slide)
  - [note: computed, not on slide: `4`, `3`, `1`, `2`. 4 is synchronous; 3 and then 1 are microtasks (promise handlers) that run as soon as the stack empties; 2 waits for the setTimeout (a macrotask/timer) even with 0 ms, so it comes last.]
- **Slide 29, "Example 8 ( in-class activity)"**
  - "1. What will be logged ?"
  - "2. What happens if we don't handle reject and remove catch() ?"

```js
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

  - Q1 A: (not on the slide) [note: computed, not on slide: `ERROR: Something went wrong`.]
  - Q2 A (very faint grey text on the slide): "A: Unhandled reject error"
  - [note: in Chrome the console shows `Uncaught (in promise) Something went wrong`, as on slide 39.]
- **Slide 30, "Example 9 ( in-class activity)"** (first of two "Example 9"s)
  - "1. What will be logged ?"

```js
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

  - A: (not on the slide)
  - [note: computed, not on slide: `First: 1`, `Second: 2`, `Final: 6` (same as Example 6 with renamed parameters).]
- **Slide 31** (untitled, explains Example 9):
  - "Then() returns another promise and passes num*3 to the resolve of that new promise"
  - Q: "why it does not pass the num*3 to the reject of the new promise?"
  - A (following bullets): "The value returned from .then() **is passed to the internal resolve function of the NEW promise created by .then()**."
  - "The core rule (from the Promise spec, simplified)"
  - "Returning a value is defined as success ( passing to resolve of new promise)"
  - "Throwing an error is defined as failure ( passing to reject of new promise)"
  - (one empty bullet)
  - Screenshot (cropped copy of the Example 9 code):

```js
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
```

  - [figure: red hand-drawn arrows show the value flow: from the `1` in `resolve(1)` down to `num` of the first `.then`; from `num * 2` (underlined) down to `num` of the second `.then`; from `num * 3` down to `finalValue` of the third `.then`.]
- **Slide 32, "Example 10 ( in-class activity)"** (first of two "Example 10"s)
  - "1. What will be logged ?"

```js
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

  - A: (not on the slide)
  - [note: computed, not on slide: after about 500 ms, `First: 2`, `Second: 6`, `Final: 7`.]
- **Slide 33** (untitled, try/catch vs promise):
  - "What is the difference between try catch error and promise resolve reject?"
  - "Promises were designed to behave like **async try/catch blocks**."
  - Left code box:

```js
// Synchronous code

try {
  const x = work();
  return x;   // success path
} catch (e) {
  throw e;    // failure path
}
```

  - Right code box:

```js
//Promise .then() handler

.then(x => {
  return x;  // resolve
})
  .catch(e => {
    throw e;  // reject
  })
```

- **Slide 34, "Example 11 ( in-class activity)"**

```js
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

  - Side text (blue monospace): "we want f1,f2 and f3 execute in f1,f2, f3 asynchronously How can we guarantee ? would below work? if not what to do?"
  - A: (not on the slide)
  - [note: no, it would not work: each call schedules its callback after a random 0–999 ms delay, so 1, 2, 3 can log in any order. To guarantee order, start the next call only when the previous one finishes, e.g. nest the callbacks (`async(() => { f1(); async(() => { f2(); async(f3); }); });`, the "callback hell" shape of slide 40) or wrap `async` in a Promise and chain `.then`. Also note `async` is a contextual keyword in JS; it works here as a function name in non-module code but is confusing.]

## 5. Observing promise status and value (slides 35–40)
- **Slide 35** (section divider, green circle "5"): small text "Lets observe how"
  - Text block: "In JavaScript, **"promise states"** and **"promise status"** refer to the same concept: the internal, unchangeable condition of a `Promise` object at any given time. There are three possible states (or statuses): **`pending`**, **`fulfilled`**, and **`rejected`**."
  - [note: "unchangeable" means not changeable from outside the promise; the state does change once, from pending to fulfilled or rejected, and then is fixed.]
- **Slide 36, "Try this code example 12"**
  - "and observe the changes in the property values of the instantiated promse object over time" (sic, "promse")

```js
const prom = new Promise( (res, rej)=>{
    setTimeout(() => {
        res('status changed now!');
    }, 5000);
})
```

- **Slide 37, "Example: observe how status and value change after 5 sec"**
  - Code (top of a DevTools console screenshot):

```js
let promise = new Promise(function (resolve, reject) {
    setTimeout(() => resolve("status changed now!"), 5000);
});
promise.then(alert);
```

  - Console output: first right after running, then after typing `promise` again ~5 s later:

```text
< ▼Promise {<pending>}
    ► __proto__: Promise
    [[PromiseStatus]]: "pending"
    [[PromiseValue]]: undefined
> promise
< ▼Promise {<resolved>: "status changed now!"}
    ► __proto__: Promise
    [[PromiseStatus]]: "resolved"
    [[PromiseValue]]: "status changed now!"
```

  - [figure: two red hand-drawn arrows: one from `"pending"` (first [[PromiseStatus]]) curving down to `"resolved"` (second [[PromiseStatus]]); one from `undefined` (first [[PromiseValue]]) curving down to `"status changed now!"` (second [[PromiseValue]]).]
  - Blue callout: "After around a 5 second gap, the status changes from pending to resolved"
  - DevTools view summary: before 5 s, status "pending" and value undefined; after 5 s, status "resolved" and value "status changed now!" (and the alert shows "status changed now!").
  - [note: this is an older Chrome. Current Chrome labels the internal slots `[[PromiseState]]: "fulfilled"` and `[[PromiseResult]]`, and shows `Promise {<fulfilled>: "status changed now!"}`. The spec name of the state is "fulfilled"; "resolved" is the old display label.]
- **Slide 38, "Example 9: using default definition of resolve method"** (second "Example 9")
  - "what will be the status and value of the object promise after execution of this code?" (big red "?")

```js
let promise = new Promise(function(resolve, reject) {
  resolve ("nicely done!");
});
```

  - DevTools console screenshot:

```text
> //1 using default definition of resolve
  let promise = new Promise(function(resolve, reject) {
    resolve ("nicely done!");
  });
< undefined
> promise
< ▼Promise {<resolved>: "nicely done!"}
    ► __proto__: Promise
    [[PromiseStatus]]: "resolved"
    [[PromiseValue]]: "nicely done!"
```

  - [figure: `PromiseStatus`, `"resolved"` and `PromiseValue` are underlined in red.]
  - Answer (from the screenshot): status "resolved", value "nicely done!".
- **Slide 39, "Example 10: using default definition of reject method"** (second "Example 10")
  - "what will be the status and value of the object promise after execution of this code?"

```js
let promise = new Promise(function(resolve, reject) {
  console.log("Doing something before rejection");
  reject ("Whoops!");
});
```

  - [figure: `reject` underlined in red.] DevTools console screenshot:

```text
> let promise = new Promise(function(resolve, reject) {
    console.log("Doing something before rejection");
    reject ("Whoops!");
  });
  Doing something before rejection
< undefined
⊗ ►Uncaught (in promise) Whoops!
```

  - [figure: a red hand-drawn "!" and a red arrow point at the red error line `Uncaught (in promise) Whoops!`.]
  - Yellow box: "Why?" / "Because we did not catch the error ( we did not define the reject method)!" / "The js engine throws the error using default definition of reject! In fact rejection naturally means something went wrong"
  - [note: the status here would be rejected with value "Whoops!". Technically nothing "redefines reject": the error is reported because the rejected promise has no rejection handler (no second `.then` argument and no `.catch`).]
- **Slide 40, "Q: How to execute two successive AJAX calls (second one only after first one is guaranteed finished)?"**
  - "Suppose we wish to"
  - "make an Ajax call to server A to get something"
  - "And **then**"
  - "making another AJAX call to server B based on what you got from server A."
  - "**Q:** How can you **guarantee** the **right order**?"
  - "**A**: calling myFunc2 inside myFunc1, line 65"
  - Blue box: "Have you heard about callback hell?"
  - Code screenshot (editor lines 57–79, numbers dropped; line 65 is `score = parseInt(this.responseText);`):

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

  - URLs in code: `http://localhost:8888/getscore/?name=john`, `http://localhost:7777/updatescore/`
  - [note: `str` is never defined in the shown code, and both functions reuse the same `xhttp` object; the point of the slide is only the ordering: call `myFunc2()` inside myFunc1's `readyState == 4 && status == 200` branch, after line 65. Nesting each next call inside the previous callback is what leads to "callback hell", which promises avoid.]

## 6. The three methods: .then, .catch, .finally (slides 41–51)
- **Slide 41** (section divider, green circle "6"): big title ".finally" (wrapped as ".finall" / "y"); bottom text "3 main methods of the Promise object are" / ".then   .catch   .finally"
- **Slide 42, "What are these methods?"** DevTools console screenshot:

```text
> let promise = new Promise(function(resolve, reject) {
    resolve ("nicely done!");
  });
< undefined
> promise
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

  - [figure: `catch()` and `finally()` underlined in red: they live on the Promise prototype next to `then()`.]
- **Slide 43, ".then method ( we already know)"**

```js
promise.then(
    function (result) { /* handle a successful result */ },
    function (error) { /* handle an error */ }
);
```

  - [figure: the comma between the two functions is circled in red.]
  - "The first argument of .then is a function that:" / "runs when the Promise is resolved, and" / "receives the result."
  - "The second argument of .then is a function that:" / "runs when the Promise is rejected, and" / "receives the error."
- **Slide 44, "Example: What's the output of the code below?"**

```js
function foo(st) {
    document.write(st)
}
let promise = new Promise(function (resolveFunc, rejectFunc) {
    resolveFunc("<h1>H</h1>ello ");
})
promise.then(foo);
[illegible: one more line cut off at the bottom of the screenshot]
```

  - "A: When we pass only one function to .then method, that function replaces the default definition of resolve method"
  - "So the code above will display 1 on the browser window"
  - [note: the printed answer does not match this code. The code writes `<h1>H</h1>ello ` to the page: a large heading "H" followed by "ello" on the next line in normal text. "display 1" seems carried over from the next example (slide 45). Also, the single function passed to `.then` does not "replace" resolve; it is the fulfillment handler that receives the value passed to `resolveFunc`.]
- **Slide 45, "Example: What's the output of the code below?"**

```js
let promise = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(2), 1000);
    resolve(1);
});
promise.then(alert);
```

  - Answer: "it will alert "1" on the browser window and ignore the second resolve"
  - [note: `resolve(1)` runs synchronously first; the `resolve(2)` that fires 1 s later is a no-op because the promise is already settled.]
- **Slide 46, ".catch method"**
  - "If we're interested only in errors, then we can use null as the first argument:"
  - ".then(**null**, **errorHandlingFunction**)" (null in red)
  - "Is the same as"
  - ".catch(**errorHandlingFunction**)"
- **Slide 47** (".catch example" label on the right) DevTools console screenshot:

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 5000);
});

// .catch(f) is the same as promise.then(null, f)
promise.catch(alert); // shows "Error: Whoops!" after 5 second
```

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

  - [figure: `promise.catch(alert)` underlined in red with `.catch` boxed in red; a red curved arrow labelled "5sec" runs from the first `"pending"` to `"rejected"`.]
  - DevTools view summary: before 5 s, status "pending", value undefined; after 5 s, status "rejected", value `Error: Whoops! at setTimeout (<anonymous>:2:27)`; alert shows "Error: Whoops!".
  - [note: the `Promise {<pending>}` shown is the promise returned by `promise.catch(alert)`, not `promise` itself; the second inspection (`> promise`) is the original promise.]
- **Slide 48, ".finally"**
  - "Just like there's a finally clause in a regular try {...} catch {...}, there's finally in promises."
  - "The call **.finally(f)**"
  - "is similar to"
  - ".then(f, f)"
  - "in the sense that it always runs when the promise is settled: be it resolve or reject. (src: javascript.info)"
  - "Note: there are more into .finally method that is outside the scope of this class."
  - [note: one of those differences: the `.finally` handler receives no argument and normally passes the original value or error through to the next handler, while `.then(f, f)` replaces it with f's return value.]
- **Slide 49, ".finally method example"**
  - "Remember if resolve function executes, reject function will be ignore and vice versa. However regardless of how the promise settles the finally method will be called" (sic, "ignore")

```js
let pr = new Promise((resolve, reject) => {
    setTimeout(() => resolve("result of resolve "), 5000)
})

    .then(result => alert(result))// <-- .then handles the result
    .finally(() => alert("Promise ready"));
```

  - Output: (not on the slide) [note: computed, not on slide: after 5 s, alert "result of resolve " then alert "Promise ready". Here `pr` holds the promise returned by `.finally`, not the original.]
- **Slide 50, ".finally method example 2"**
  - "Remember if resolve function executes, reject function will be ignore and vice versa. However regardless of how the promise settles the finally method will be called ."
  - "In example below we did not catch error nor we defined reject function."
  - "Remember the default function would terminate the script"

```js
let pr = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(" Error!..")), 5000)
}).finally(() => document.write("Promise setteled"));
```

  - [figure: `reject` and `.finally` underlined in red.] (sic, "setteled" in the code string)
- **Slide 51, ".finally method example 2 cont..."**
  - [figure: browser screenshot: page area on the left shows the text "Promise setteled", circled in red and marked with a red hand-written "1"; Chrome DevTools Console on the right (tabs Elements, Console, Sources; error badge "1"), with a red hand-written "2" and an arrow pointing at the red error line.]
  - Console contents:

```text
> let pr = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error(" Error!..")),
  5000)
      }).finally(() => document.write("Promise setteled"));
< undefined
⊗ ►Uncaught (in promise) Error:  Error!..                VM1102:2
      at setTimeout (<anonymous>:2:33)
```

  - Order shown: 1 = "Promise setteled" written to the page (finally runs although the promise rejected); 2 = "Uncaught (in promise) Error:  Error!.." in the console (the rejection is still unhandled, because `.finally` passes the rejection on).
  - [note: slide 50's "the default function would terminate the script" is not what a browser does: an unhandled rejection is only reported in the console and other code keeps running. In Node.js 15+ an unhandled rejection does terminate the process by default.]

## Async/Await (slide 52)
- **Slide 52, "Async/Await"**
  - "built on top of promises, allowing you to write asynchronous code that looks more like synchronous code."
  - "async: When a function is declared as async, it automatically returns a promise."
  - "await: This is used inside async functions to wait for a promise to resolve or reject."
  - "Good exapls at https://www.w3schools.com/js/js_async.as" (sic, "exapls"; URL as printed, truncated; the real page is `https://www.w3schools.com/js/js_async.asp`)

## 6. In-class activity: timing a GET request (slide 53)
- **Slide 53, "In class activity"** (green circle "6"), full text:
  - "Q1: For the given API server, measure the time diff from the time you sent a GET request, to the time you receive the response"
  - "Q2: Measure the time diff from the time you receive  the response header,  to the time you receive the response"
  - A: (not on the slide) [note: in XHR terms, Q2 is the gap between `readyState` 2 (HEADERS_RECEIVED) and 4 (DONE), see slide 55.]

## 7. GET vs POST response size (slide 54)
- **Slide 54, "GET vs POST"** (green circle "7")
  - "So we stated that there is a limitation on data size being sent over a single GET **request**. However, there is no such limitation on POST request"
  - Q: "what about the **responses** of GET vs POST? Is there such limit for their responses too?"
  - A (grey, revealed): "A:  no! There are no standardized limitations on the size of responses for GET or POST requests specified by the HTTP protocol. Needless to mention practical limitations can be influenced by server configurations, network constraints, or browser limitations."
  - [note: HTTP itself does not set a GET request size limit either; the limit on GET comes from practical URL length limits in browsers and servers.]

## 8. W3Schools readyState correction (slide 55)
- **Slide 55, "W3schools is inaccurate about onreadystatechanged"** (green circle "8")
  - "Turns out https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp is not accurate on ready states status values ! The one we covered in lecture is accurate"
  - "Accurate one:"
    - "0 (UNSENT): The XHR object has been created, but open() has not been called yet."
    - "1 (OPENED): open() has been called."
    - "2 (HEADERS_RECEIVED): send() has been called, and the headers of the response are available."
    - "3 (LOADING): The response is being received. As data comes in, the responseText property is updated."
    - "4 (DONE): The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred."
  - "So verified that by looking into the XMLHttpRequest class properties manually in Chrome Dev tool" (the last words are hidden behind the screenshot; wording from the text layer)
  - [figure, left: Chrome DevTools Console (tabs Application, Elements, Console, Source…), input `XMLHttpRequest.` with output `4` and an autocomplete list: DONE, HEADERS_RECEIVED, LOADING, OPENED, UNSENT.]
  - [figure, right: the w3schools table, stamped with large red text "not accurate!"; a thin line connects the circle "8"/URL to it. Contents:]

```text
readyState    Holds the status of the XMLHttpRequest.
              0: request not initialized
              1: server connection established
              2: request received
              3: processing request
              4: request finished and response is ready
```

  - [note: the instructor's version matches the XHR spec / MDN constants. One nuance: DONE (4) is reached for any completed response, including 404 or 500, and for network errors (then status is 0), not only for 2xx; that is why code checks `this.status == 200` as well.]

## References (slide 56)
- **Slide 56, "References and resources"**
  - https://scotch.io/tutorials/javascript-promises-for-dummies#toc-chaining-promises
  - Spring.io
  - MDN mozlla (sic)
  - https://medium.com/front-end-weekly/ajax-async-callback-promise-e98f8074ebd7
  - https://zapier.com/learn/apis/chapter-6-api-design/
  - https://restfulapi.net/versioning/
  - RESTful Web API Design with Node.js 10 - Third Edition
  - https://phil.tech/2016/http-rest-api-file-uploads/ ( for your term project)
  - chatGPT

## Facts and numbers index
- Outline has 8 items: Review; Asynch operations; Promises in JS; Promise status; .catch() and .finally(); In class activity; response size of GET vs POST; W3Schools inaccurate (slide 2).
- Quizzes on promise during labs this week; no new labs this week; next lab after the midterm (slide 2).
- Midterm on Learning Hub, closed book, one letter-sized sheet both sides allowed (slide 2).
- `myDomain.com/api/customers` = a resource (slide 3).
- 4 verbs listed: GET, PUT, DELETE, POST (slide 3).
- PUT = replace an object entirely; PATCH = update only a property (slide 3).
- PUT is idempotent, POST is not; idempotent = "can be applied multiple times without changing the result"; repeated POST may e.g. place an order several times (slide 3).
- First-class functions: a function can receive another function as parameter; `bar(foo)` alerts "Hello World!" (slide 4).
- Callback: `myCalculator(5, 5, myDisplayer)` puts 10 into #demo (slide 5).
- `math()` returns an object with methods add and multiply; add two numbers with `math().add(2,3)` (slide 6).
- Microservices communicate via the net using API calls; any communication via net is asynchronous (slide 8).
- JS functions can return only a single value (primitive or object) (slide 9).
- Async failure examples: timed-out, DB is down, authentication error (slide 10).
- Two things to do: 1- do something with the success, 2- deal with the failure gracefully (slide 10).
- Solution: return an object with two callback methods, resolve() and reject() (slide 10).
- A promise has 3 states: 1. Pending, 2. Resolved (Fulfilled), 3. Rejected (slide 13); Fulfilled + Rejected = Settled (slide 14).
- Promise object: 5 numbered facts (asynchronous computations; single operation not yet completed; executor runs the moment the object is created; executor gets references of resolve and reject; Promise has then()) (slide 16).
- Constructor slide: 5 numbered callouts (1 constructor takes executer with resolve, reject; 2 handler definitions; 3 executer runs immediately; 4 handlers invoked asynchronously, mutually exclusive, only once; 5 then() returns a promise) plus grey notes (state changes synchronously, handlers go to the microtask queue and run after the current call stack finishes, not after "all code in the program"; resolve after reject is ignored) (slide 17).
- resolve/reject create the promise's value; .then() handlers receive it; resolve and the first .then callback are different functions (slide 18).
- Promises are eager: a new Promise immediately starts executing (slide 19).
- Example 1 order: 2, 5, 1, 4 (slide 21).
- Example 2 order: 7, 2, 5, 1, 8, 4 (slide 22).
- Example 3 order: 2, 5, 1, 3; 4 is ignored (slide 23).
- Example 4: setInterval every 100 ms; "Hi" logged only once (slide 24).
- Example 5: `Promise.resolve()`/`Promise.reject()` create already-settled promises; order 2, 1 (slide 25).
- then() takes up to two arguments (success, failure callbacks) and returns a Promise, which enables chaining (slide 26).
- Example 6 / first Example 9: First: 1, Second: 2, Final: 6 [computed] (slides 27, 30).
- Example 7: 4, 3, 1, 2 [computed] (slide 28).
- Example 8: ERROR: Something went wrong [computed]; without catch: "Unhandled reject error" (slide 29).
- Core rule: returning a value = success (resolve of the new promise); throwing an error = failure (reject of the new promise) (slide 31).
- First Example 10: after 500 ms, First: 2, Second: 6, Final: 7 [computed] (slide 32).
- Promises were designed to behave like async try/catch blocks (slide 33).
- Example 11: random delay `Math.floor(Math.random() * 1000)` ms; order of 1, 2, 3 not guaranteed [computed] (slide 34).
- Promise "states" and "status" are the same concept; 3 values: pending, fulfilled, rejected (slide 35).
- Example 12 / slide 37: 5000 ms timeout; before: [[PromiseStatus]] "pending", [[PromiseValue]] undefined; after ~5 s: "resolved", "status changed now!" (slides 36–37).
- Second Example 9: status "resolved", value "nicely done!" (slide 38).
- Second Example 10: logs "Doing something before rejection", then `Uncaught (in promise) Whoops!` (slide 39).
- Two successive AJAX calls: call myFunc2 inside myFunc1 at line 65; GET to localhost:8888/getscore/?name=john, PATCH to localhost:7777/updatescore/ (slide 40).
- 3 main methods of the Promise object: .then, .catch, .finally (slide 41).
- .then first argument runs on resolve and receives the result; second runs on reject and receives the error (slide 43).
- Slide 45: resolve(1) now, resolve(2) after 1000 ms: alert "1", second resolve ignored (slide 45).
- `.then(null, errorHandlingFunction)` is the same as `.catch(errorHandlingFunction)` (slide 46).
- .catch example: reject after 5000 ms; status pending → rejected; alert "Error: Whoops!" (slide 47).
- `.finally(f)` is similar to `.then(f, f)`: always runs when the promise is settled (src: javascript.info) (slide 48).
- .finally example: resolve after 5000 ms → alert result, then "Promise ready" [order computed] (slide 49).
- .finally example 2: reject after 5000 ms → (1) page shows "Promise setteled", (2) console `Uncaught (in promise) Error:  Error!..` (slides 50–51).
- async function automatically returns a promise; await waits inside async functions for a promise to resolve or reject (slide 52).
- In-class activity: Q1 time from sending GET to receiving the response; Q2 time from receiving the response header to receiving the response (slide 53).
- No standardized HTTP limit on response size for GET or POST; practical limits from server config, network, browser (slide 54).
- readyState values: 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING, 4 DONE (slide 55).
- w3schools (wrong) readyState: 0 request not initialized, 1 server connection established, 2 request received, 3 processing request, 4 request finished and response is ready (slide 55).

## Likely quiz traps
- PUT is idempotent and POST is not; repeated identical POSTs can e.g. place an order several times (slide 3). PATCH updates only a property, PUT replaces the whole object.
- The executor runs synchronously, immediately on `new Promise(...)`; its `console.log`s come before any code after the constructor (Examples 1–3, slides 21–23).
- Handlers run after the current call stack, not before later synchronous lines: in Example 2 "8" (the last line) logs before "4" (slide 22).
- Settle once: the first of resolve/reject wins; later calls are ignored (Example 3: 4 never logs; slide 45: alert "1" not "2"; Example 4: "Hi" only once even with setInterval) (slides 23, 24, 45).
- `Promise.resolve().then(...)` still runs its handler asynchronously: order 2 then 1 (slide 25).
- Promise handlers (microtasks) beat `setTimeout(…, 0)`: Example 7 logs 4, 3, 1, 2 [computed; slide gives no answer] (slide 28).
- Returning a value from `.then` resolves the next promise; only throwing rejects it (slide 31). Chains: 1 → 2 → 6 (slides 27/30); 2 → 6 → 7 after 500 ms (slide 32).
- `.catch(f)` equals `.then(null, f)` (slides 46, 47); `.finally(f)` is similar to `.then(f, f)` and runs on both outcomes (slide 48).
- `.finally` does not handle a rejection: the page still shows "Promise setteled" and the console still shows `Uncaught (in promise)` (slides 50–51).
- A rejection with no handler gives `Uncaught (in promise) …` in the console (slides 29, 39, 51).
- Fulfilled and Rejected are the "settled" states; Pending is not (slide 14).
- `.then()` returns a promise (note 5 on slide 17), which is why chaining works (slide 26).
- Promise handlers wait only for the current call stack to unwind, not for "all code in the program" (slide 17).
- No standardized HTTP limit on response size for GET or POST (slide 54).
- readyState 2 is HEADERS_RECEIVED, not "request received" as w3schools says; 0 UNSENT, 1 OPENED, 3 LOADING, 4 DONE (slide 55).
- Numbering trap: "Example 9" and "Example 10" each appear twice (slides 30 and 38; 32 and 39).
