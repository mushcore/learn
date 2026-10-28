---
title: Functions as values, callbacks, and why a function returns only one thing
minutes: 14
---

A function that fetches data over the network has to report two things: the data, and whether the fetch worked. JavaScript functions return one value, so the lecture first reviews functions passed as values, then shows where that runs out.

<!-- facts: slide 4 first-class functions bar(foo); slide 5 callback myCalculator 10; slide 6 math() returns object, math().add(2,3); slide 7 divider; slide 8 net is asynchronous; slide 9 single value; slide 10 value and how it was returned, failures, one thing, resolve() and reject() -->

## A function can receive a function (slide 4)

Slide 4 asks: *Remember in JS can a function receive another function as parameter?* and answers *first-class functions*. A function is a value like a number or a string, so it can be stored in a variable, passed in, and called later by whoever received it.

```js run pin firstClass.js
// predict:
function foo(x) {
     alert(x);
}
function bar(func) {
     func("Hello World!");
}

//alerts "Hello World!"
bar(foo);
```

`bar(foo)` passes `foo` itself, with no parentheses, so nothing runs yet. Inside `bar` the parameter `func` now refers to `foo`, and `func("Hello World!")` calls it. The runner shows the alert as the console line `[alert] Hello World!`.

## A callback is the function to call once you are done (slide 5)

The slide reads the call `myCalculator(5, 5, myDisplayer)` as two messages: *"here are arguments to do sth with them in this function"* and *"here is the function to call once you are done"*. The second argument is the callback. The page below adds a `<p id="demo">` so the script has somewhere to write.

```html run pin callbacks.html
<p id="demo"></p>
<script>
function myDisplayer(some) {
  document.getElementById("demo").innerHTML = some;
}
function myCalculator(num1, num2, myCallback) {
  let sum = num1 + num2;
  myCallback(sum);
}
myCalculator(5, 5, myDisplayer);
</script>
```

`myCalculator` does not know what will happen to the sum. It computes `let sum = num1 + num2`, then hands the result to `myCallback(sum)`, which here is `myDisplayer`, and the page shows 10.

```diagram
{ "type": "flow", "title": "A callback is called when the work is done", "nodes": [ { "id": "call", "label": "myCalculator(5, 5, myDisplayer)" }, { "id": "sum", "label": "sum = 10" }, { "id": "cb", "label": "myCallback(sum)" }, { "id": "disp", "label": "myDisplayer(10)" }, { "id": "demo", "label": "#demo", "sub": "shows 10", "kind": "note" } ], "edges": [ { "from": "call", "to": "sum" }, { "from": "sum", "to": "cb" }, { "from": "cb", "to": "disp" }, { "from": "disp", "to": "demo" } ], "hi": ["cb"], "caption": "Here is the function to call once you are done." }
```

## A function can return an object of functions (slide 6)

Slide 6 asks *What does this function return? ( what data type?)*. The slide gives no answer. Worked out from the code: an object, whose two properties `add` and `multiply` hold functions. Its second question, *how would you add two numbers*, has the slide's answer `math().add(2,3)`. The two `console.log` lines at the end are added to show both answers.

```js run pin mathObject.js
// predict: Write the two lines the added logs print.
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
console.log(typeof math());     // added
console.log(math().add(2, 3));  // added
```

```output
object
5
```

`math()` runs the function and gives back the object; `.add` reads one property of it; `(2, 3)` calls that function.

```diagram
{ "type": "tree", "title": "What math() returns", "nodes": [ { "id": "m", "label": "math()" }, { "id": "o", "label": "{ }", "sub": "an object", "parent": "m" }, { "id": "a", "label": "add", "sub": "function(x, y)", "parent": "o" }, { "id": "mu", "label": "multiply", "sub": "function(x, y)", "parent": "o" } ], "hi": ["a"], "caption": "One return value: an object whose properties are functions." }
```

## Any communication via the net is asynchronous (slides 7 to 9)

Slide 7 opens the section *Asyc operations and callback hell!* (sic). Slide 8 gives the reason it matters for this course: *Microservices communicate via the net using API calls* / *and any communication via net is asynchronous*.

Slide 9 states the constraint: *In js Functions can only return a single value, whether of primitive data type (number, string etc) or a non- primitive data type such as an object.*

```js
function add (a, b) {
  return a + b;
}

function person (name, age) {
  return {
    name: name,
    age: age
  };
}
```

Both return one thing: a number, or one object. We call the function and act on the value. Slide 9 then asks *why functions doing asynchronous operations are more complicated?* and leaves it open; slide 10 is the answer.

## A value and how it was returned (slide 10)

*Dealing with functions doing asynchronous stuff, we are not only interested in the returned value, but also in how it was returned*: was the operation successful or did it fail, *timed-out, DB is down, authentication error*. The caller needs two plans:

1. *Do something with the success*
2. *Or deal with the failure gracefully*

*But functions return only one thing!* The slide's way out: *Lets simply return an object that has two callback methods, resolve() and reject()!* That object is the Promise of the next lesson.

```diagram
{ "type": "tree", "title": "An asynchronous call has two outcomes", "nodes": [ { "id": "call", "label": "API call over the net" }, { "id": "ok", "label": "success", "parent": "call" }, { "id": "bad", "label": "failure", "sub": "timed-out, DB is down, authentication error", "parent": "call" }, { "id": "res", "label": "resolve(value)", "sub": "do something with the success", "parent": "ok" }, { "id": "rej", "label": "reject(reason)", "sub": "deal with the failure gracefully", "parent": "bad" } ], "hi": ["res", "rej"], "caption": "The slide's steps drawn: functions return only one thing, so return an object that carries both outcomes." }
```

```quiz
[
  {
    "q": "What data type does `math()` from slide 6 return?",
    "options": ["object", "function", "number", "undefined"],
    "answer": 0,
    "explain": "`math()` returns one object literal. Its properties `add` and `multiply` are functions, but the value returned is the object: `typeof math()` is `\"object\"`."
  },
  {
    "q": "What does this print?",
    "code": "function formatPrice(price, qty, done) {\n  const total = price * qty;\n  done(\"$\" + total.toFixed(2));\n}\nfunction show(text) {\n  console.log(\"Total: \" + text);\n}\nformatPrice(19.5, 2, show);\nconsole.log(\"done\");",
    "options": ["Total: $39.00 / done", "done / Total: $39.00", "Total: 39 / done", "Total: $19.50 / done"],
    "answer": 0,
    "explain": "`show` is the callback: *the function to call once you are done*. `formatPrice` computes 19.5 × 2 = 39, calls `done(\"$39.00\")` straight away, which is `show`, and only then does the last line log `done`. Nothing here is asynchronous."
  },
  {
    "q": "What does this print?",
    "code": "function greet(name) {\n  const msg = \"Hi \" + name;\n}\nconsole.log(greet(\"Lee\"));",
    "options": ["undefined", "Hi Lee", "null", "an empty line"],
    "answer": 0,
    "explain": "`greet` has no `return`, so calling it gives `undefined`. Building `msg` inside does not hand it back."
  },
  {
    "q": "Any communication via the net is asynchronous.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 8: *Microservices communicate via the net using API calls* / *and any communication via net is asynchronous*."
  },
  {
    "q": "In JavaScript a function can return two separate values, one for the result and one for the outcome.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 9: *In js Functions can only return a single value*, primitive or object. That is the problem slide 10 solves by returning one object with `resolve()` and `reject()`."
  },
  {
    "q": "Which of these does slide 10 list as ways an asynchronous operation can fail?",
    "options": ["timed-out, DB is down, authentication error", "syntax error, type error, range error", "404, 500, 301", "stack overflow, out of memory, infinite loop"],
    "answer": 0,
    "explain": "Slide 10: *was the operation successful or failed ( timed-out, DB is down, authentication error etc)*."
  },
  {
    "q": "In `bar(foo)` from slide 4, what is passed to `bar`?",
    "options": ["the function foo itself", "the value foo returns", "the string \"Hello World!\"", "nothing until foo finishes"],
    "answer": 0,
    "explain": "No parentheses after `foo`, so `foo` is not called; the function itself is passed. That a function can be a parameter is what the slide calls *first-class functions*."
  },
  {
    "type": "free",
    "q": "Why is a function that does asynchronous work harder to use than a function like `add(a, b)`? What does the lecture propose?",
    "model": "With `add` we only want the returned value. With an asynchronous operation we are *not only interested in the returned value, but also in how it was returned*: did it succeed, or did it fail (timed out, DB is down, authentication error)? We need to do something with the success or deal with the failure gracefully, *but functions return only one thing*. The solution: return an object that has two callback methods, `resolve()` and `reject()`: a promise.",
    "points": [
      "we need the value and whether the operation succeeded",
      "failures such as timed-out, DB is down, authentication error",
      "a function returns only one thing",
      "return an object with resolve() and reject() (a promise)"
    ],
    "rows": 5,
    "explain": "Slides 9 and 10."
  }
]
```
