---
title: Tracing for and while loops over arrays
minutes: 18
---

Given a loop over an array, write what it prints and how many times. The deck has one loop, on slide 110, but the course's loop quiz tests loops and arrays in depth, so this lesson goes beyond slide 110 with standard JavaScript.

<!-- facts: s110 Example 11 for loop 0..9; beyond the slide: for parts, while, < vs <=, countdown, break/continue, nested, i += 2, length - 1, length -= 2, undefined reads, NaN, fills -->

## Each iteration picks the next value of i (slide 110)

Slide 110, Example 11: *"In JavaScript we can create a loop. Each iteration picks the next value of i."* *"i++ means, increment i by one on every iteration"*. Everything between `{}` runs *"first executed for i being 0"*, *"Then goes back to for"* for 1, *"and lastly for i being 9"*. The slide writes `var i;`; course style uses `let`, and the output is the same.

```js run pin example-11.js
// predict:
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

```output
0
1
2
3
4
5
6
7
8
9
```

Ten lines. When `i++` makes `i` 10, the test `i < 10` is false and the loop ends; 10 is never printed.

```diagram
{ "type": "flow", "title": "How a for loop runs (slide 110's sentences drawn)", "nodes": [ { "id": "init", "label": "let i = 0", "sub": "once" }, { "id": "cond", "label": "i < 10 ?" }, { "id": "body", "label": "console.log(i)", "sub": "true: body" }, { "id": "upd", "label": "i++" }, { "id": "cond2", "label": "i < 10 ?", "sub": "test again" }, { "id": "end", "label": "after the loop", "sub": "at i = 10", "kind": "pill" } ], "edges": [ { "from": "init", "to": "cond" }, { "from": "cond", "to": "body", "label": "true" }, { "from": "body", "to": "upd" }, { "from": "upd", "to": "cond2" }, { "from": "cond2", "to": "end", "label": "false", "dashed": true } ], "hi": ["cond", "cond2"], "caption": "Initialise once; then test, body, update, test again, until the test is false." }
```

## A trace table settles the count

The header has three parts: initialise, condition, update. Trace a loop by writing one row per pass. With `<=` the last index is included, so `i <= 2` runs three times:

```js run pin weekly-total.js
// predict:
let temps = [12, 15, 9];
let total = 0;
for (let i = 0; i <= 2; i++) {
  total += temps[i];
}
console.log(total);
```

```output
36
```

```diagram
{ "type": "grid", "title": "Trace table", "nodes": [ { "id": "h0", "label": "pass", "row": 0, "col": 0 }, { "id": "h1", "label": "i", "row": 0, "col": 1 }, { "id": "h2", "label": "i <= 2", "row": 0, "col": 2 }, { "id": "h3", "label": "temps[i]", "row": 0, "col": 3 }, { "id": "h4", "label": "total after", "row": 0, "col": 4 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "0", "row": 1, "col": 1 }, { "id": "a2", "label": "true", "row": 1, "col": 2 }, { "id": "a3", "label": "12", "row": 1, "col": 3 }, { "id": "a4", "label": "12", "row": 1, "col": 4 }, { "id": "b0", "label": "2", "row": 2, "col": 0 }, { "id": "b1", "label": "1", "row": 2, "col": 1 }, { "id": "b2", "label": "true", "row": 2, "col": 2 }, { "id": "b3", "label": "15", "row": 2, "col": 3 }, { "id": "b4", "label": "27", "row": 2, "col": 4 }, { "id": "c0", "label": "3", "row": 3, "col": 0 }, { "id": "c1", "label": "2", "row": 3, "col": 1 }, { "id": "c2", "label": "true", "row": 3, "col": 2 }, { "id": "c3", "label": "9", "row": 3, "col": 3 }, { "id": "c4", "label": "36", "row": 3, "col": 4 }, { "id": "d0", "label": "end", "row": 4, "col": 0 }, { "id": "d1", "label": "3", "row": 4, "col": 1 }, { "id": "d2", "label": "false", "row": 4, "col": 2 }, { "id": "d3", "label": "", "row": 4, "col": 3 }, { "id": "d4", "label": "36", "row": 4, "col": 4 } ], "hi": ["d2"], "caption": "Three passes; the fourth test fails and total stays 36." }
```

Each row is one run of `total += temps[i]`, and `console.log(total)` runs once, after the loop. Write `i <= temps.length` instead and a fourth pass reads `temps[3]`, which is `undefined`; `36 + undefined` is `NaN`. To visit every element, the test is `i < temps.length`.

## Counting down, and a body that never runs

```js run pin countdown.js
// predict:
for (let i = 3; i > 0; i--) {
  console.log(i);
}
for (let i = 5; i < 5; i++) {
  console.log("never");
}
let n = 2;
while (n >= 0) {
  n--;
}
console.log(n);
```

```output
3
2
1
-1
```

`i > 0` excludes zero, so the countdown stops at 1; `i >= 0` would print 0 too. The second loop tests `5 < 5` first, which is false, so its body never runs. A `while` loop is only a test and a body: `n--` takes `n` to 1, 0, -1, and at -1 the test fails, so the loop ends one step past its stop value.

## break leaves the loop, continue skips one pass

```js run pin break-continue.js
// predict:
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    break;
  }
  console.log("break run " + i);
}
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;
  }
  console.log("continue run " + i);
}
```

```output
break run 1
break run 2
continue run 1
continue run 2
continue run 4
continue run 5
```

At `i === 3`, `break;` ends the first loop before its log. In the second, `continue;` jumps straight to `i++`, so only 3 is missing.

## Nested loops multiply

```js run pin nested.js
// predict:
let count = 0;
for (let day = 0; day < 3; day++) {
  for (let slot = 0; slot < 4; slot++) {
    count++;
  }
}
console.log(count);
```

```output
12
```

The inner loop, `slot < 4`, runs all four passes for each of the three outer passes, `day < 3`: 3 × 4 = 12 runs of `count++`.

## Indexes run from 0 to arr.length - 1

```diagram
{ "type": "grid", "title": "Indices of a five-item shelf", "nodes": [ { "id": "h0", "label": "index", "row": 0, "col": 0 }, { "id": "i0", "label": "0", "row": 0, "col": 1 }, { "id": "i1", "label": "1", "row": 0, "col": 2 }, { "id": "i2", "label": "2", "row": 0, "col": 3 }, { "id": "i3", "label": "3", "row": 0, "col": 4 }, { "id": "i4", "label": "4", "row": 0, "col": 5 }, { "id": "v0", "label": "value", "row": 1, "col": 0 }, { "id": "a", "label": "A12", "row": 1, "col": 1 }, { "id": "b", "label": "B07", "row": 1, "col": 2 }, { "id": "c", "label": "C33", "row": 1, "col": 3 }, { "id": "d", "label": "D19", "row": 1, "col": 4 }, { "id": "e", "label": "E02", "row": 1, "col": 5 }, { "id": "n0", "label": "name", "row": 2, "col": 0 }, { "id": "n1", "label": "first", "row": 2, "col": 1 }, { "id": "n2", "label": "", "row": 2, "col": 2 }, { "id": "n3", "label": "middle", "row": 2, "col": 3 }, { "id": "n4", "label": "length - 2", "row": 2, "col": 4 }, { "id": "n5", "label": "length - 1", "row": 2, "col": 5 } ], "hi": ["e", "d"], "caption": "Length 5: the last index is 4, the second-to-last 3." }
```

```js run pin indexes.js
// predict:
let shelf = ["A12", "B07", "C33", "D19", "E02"];
console.log(shelf[shelf.length - 1]);
console.log(shelf[shelf.length - 2]);
console.log(shelf[Math.floor(shelf.length / 2)]);
console.log(shelf[5]);
let empty = [];
empty[2] = "F44";
console.log(empty[0], empty.length);
```

```output
E02
D19
C33
undefined
undefined 3
```

Reading past the end, `shelf[5]`, gives `undefined`, not an error. Assigning `empty[2]` makes the length 3 and leaves `empty[0]` a hole that reads `undefined`.

## Step by two, and shrink with length

```js run pin step-and-shrink.js
// predict:
let shelf = ["A12", "B07", "C33", "D19", "E02", "F44"];
for (let i = 0; i < shelf.length; i += 2) {
  console.log(shelf[i]);
}
function wrongDrop(list) {
  list = list.length - 2;
}
function dropTwo(list) {
  list.length -= 2;
}
wrongDrop(shelf);
console.log(shelf);
dropTwo(shelf);
console.log(shelf);
```

```output
A12
C33
E02
["A12", "B07", "C33", "D19", "E02", "F44"]
["A12", "B07", "C33", "D19"]
```

`i += 2` visits indexes 0, 2, 4; `i++` would visit all six, and `i *= 2` would stay at 0 forever. `list = list.length - 2` only points the parameter at the number 4; the array outside is untouched. `list.length -= 2` changes the array itself and drops its last two elements.

## undefined plus a number is NaN

```js run pin nan-total.js
// predict:
let total;
for (let i = 1; i <= 3; i++) {
  total += i;
}
console.log(total);
```

```output
NaN
```

`let total;` leaves `total` undefined, and `undefined + 1` is `NaN`; every later addition stays `NaN`. Start accumulators at 0.

## Filling an array from earlier elements

```js run pin fills.js
// predict:
let fill = [];
for (let i = 1; i <= 4; i++) {
  fill[i - 1] = i * 10;
}
console.log(fill);
let product = [1, 2, 3, 4, 5];
for (let i = 1; i < product.length; i++) {
  product[i] = product[i] * product[i - 1];
}
console.log(product);
let fib = [0, 1];
for (let i = 2; i < 8; i++) {
  fib[i] = fib[i - 1] + fib[i - 2];
}
console.log(fib);
```

```output
[10, 20, 30, 40]
[1, 2, 6, 24, 120]
[0, 1, 1, 2, 3, 5, 8, 13]
```

`fill[i - 1]` shifts `i` from 1 to 4 onto indexes 0 to 3. `product[i - 1]` already holds the running product, so each element becomes a factorial. `fib[i - 1] + fib[i - 2]` adds the two before.

```diagram
{ "type": "flow", "title": "Fibonacci fill", "nodes": [ { "id": "i2", "label": "i = 2", "sub": "fib[1] + fib[0] = 1" }, { "id": "i3", "label": "i = 3", "sub": "fib[2] + fib[1] = 2" }, { "id": "i4", "label": "i = 4", "sub": "fib[3] + fib[2] = 3" }, { "id": "i5", "label": "i = 5", "sub": "fib[4] + fib[3] = 5" } ], "edges": [ { "from": "i2", "to": "i3" }, { "from": "i3", "to": "i4" }, { "from": "i4", "to": "i5" } ], "hi": ["i3"], "caption": "Each new element reads the two written just before it." }
```

## Trace a week of temperatures

New loops. Write a trace table for each before you choose.

```quiz
[
  {
    "q": "What does this print?",
    "code": "let base = 20;\nfor (let i = 1; i <= 3; i++) {\n  console.log(base + i);\n}",
    "options": ["21 / 22 / 23", "20 / 21 / 22", "20 / 40 / 60", "21 / 22 / 23 / 24"],
    "answer": 0,
    "explain": "i = 1, 2, 3 (the test is `<=`), so 20 + 1, 20 + 2, 20 + 3. Multiplying would give 20, 40, 60."
  },
  {
    "q": "What does this print?",
    "code": "let temps = [8, 11, 14, 9];\nfor (let i = 0; i < temps.length; i++) {\n  console.log(temps[0]);\n}",
    "options": ["8 / 8 / 8 / 8", "8 / 11 / 14 / 9", "9 / 9 / 9 / 9", "8"],
    "answer": 0,
    "explain": "The loop runs four times, but the body reads index 0 every time, not `temps[i]`."
  },
  {
    "q": "What does this print?",
    "code": "let d = 7;\nwhile (d < 9) {\n  console.log(d);\n  d++;\n}",
    "options": ["7 / 8", "7 / 8 / 9", "8 / 9", "the loop never ends"],
    "answer": 0,
    "explain": "d = 7: true, log 7, d = 8. d = 8: true, log 8, d = 9. d = 9: `9 < 9` is false, stop."
  },
  {
    "q": "What is logged after the loop?",
    "code": "let stock = 6;\nwhile (stock > 0) {\n  stock -= 2;\n}\nconsole.log(stock);",
    "options": ["0", "-2", "2", "the loop never ends"],
    "answer": 0,
    "explain": "6, 4, 2, 0: at 0 the test `0 > 0` is false, so the loop stops with stock exactly 0."
  },
  {
    "q": "`let days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\"];` Which header prints only Tue, Wed, Thu with `console.log(days[i])`?",
    "options": ["`for (let i = 1; i < days.length - 1; i++)`", "`for (let i = 0; i < 3; i++)`", "`for (let i = 1; i <= days.length - 1; i++)`", "`for (let i = 1; i < days.length; i++)`"],
    "answer": 0,
    "explain": "Start at index 1 (Tue) and stop before index 4 (Fri): `i < days.length - 1` is `i < 4`. Starting at 0 prints Mon; `<= days.length - 1` and `< days.length` both include Fri."
  },
  {
    "q": "What does this print?",
    "code": "function double(n) {\n  return n * 2;\n}\nlet out = [];\nfor (let i = 0; i < 4; i++) {\n  out[i] = double(3 + i);\n}\nconsole.log(out);",
    "options": ["[6, 8, 10, 12]", "[0, 2, 4, 6]", "[3, 4, 5, 6]", "[6, 6, 6, 6]"],
    "answer": 0,
    "explain": "i = 0 to 3 gives double(3), double(4), double(5), double(6): 6, 8, 10, 12."
  }
]
```

```challenge
{ "lang": "js", "prompt": "The week's temperatures are <code>[12, 15, 9, 18, 7, 14, 11]</code>. Log every second day's temperature starting with the first (one per line), then log the sum of all seven.", "starter": "let temps = [12, 15, 9, 18, 7, 14, 11];\n", "expected": "12\n9\n7\n11\n86", "hints": ["Step with <code>i += 2</code> and test <code>i < temps.length</code>.", "Start the sum at 0, not undefined, or it becomes NaN."], "solution": "let temps = [12, 15, 9, 18, 7, 14, 11];\nlet sum = 0;\nfor (let i = 0; i < temps.length; i += 2) {\n  console.log(temps[i]);\n}\nfor (let i = 0; i < temps.length; i++) {\n  sum += temps[i];\n}\nconsole.log(sum);\n" }
```

```quiz
[
  {
    "q": "How many times does `calls++` run?",
    "code": "let calls = 0;\nfor (let i = 0; i < 2; i++) {\n  for (let j = 0; j < 5; j++) {\n    calls++;\n  }\n}\nconsole.log(calls);",
    "options": ["10", "7", "5", "12"],
    "answer": 0,
    "explain": "Five inner passes for each of two outer passes: 2 × 5 = 10."
  },
  {
    "q": "What does this print?",
    "code": "let s = 0;\nfor (let i = 0; i <= 3; i++) {\n  s += 3;\n}\nconsole.log(s);",
    "options": ["12", "9", "3", "6"],
    "answer": 0,
    "explain": "`<=` includes 3: i = 0, 1, 2, 3 is four passes, 4 × 3 = 12."
  },
  {
    "q": "How many times is `row` logged?",
    "code": "for (let i = 0; i < 6; i++) {\n  if (i === 4) {\n    break;\n  }\n  console.log(\"row\");\n}",
    "options": ["4", "5", "6", "3"],
    "answer": 0,
    "explain": "i = 0, 1, 2, 3 log. At i = 4, `break` ends the loop before the log."
  },
  {
    "q": "Which header counts down from 4 to 0, both included?",
    "options": ["`for (let i = 4; i >= 0; i--)`", "`for (let i = 4; i > 0; i--)`", "`for (let i = 4; i <= 0; i--)`", "`for (let i = 0; i <= 4; i++)`"],
    "answer": 0,
    "explain": "Start at 4, step down, and keep going while `i >= 0`. `> 0` stops at 1; `<= 0` is false at the start; the last one counts up."
  },
  {
    "q": "`codes` has nine items. Which update completes `for (let i = 0; i < codes.length; ___)` so that it logs items 0, 3 and 6?",
    "options": ["`i += 3`", "`i++`", "`i *= 3`", "`i + 3`"],
    "answer": 0,
    "explain": "`i += 3` gives 0, 3, 6, then 9 fails the test. `i *= 3` stays at 0 forever; `i + 3` computes a value but never changes `i`."
  },
  {
    "q": "What does this print?",
    "code": "let codes = [\"A12\", \"B07\", \"C33\", \"D19\", \"E02\"];\ncodes.length -= 2;\nconsole.log(codes);\nconsole.log(codes[codes.length - 2]);",
    "options": ["[\"A12\", \"B07\", \"C33\"] / B07", "[\"A12\", \"B07\", \"C33\"] / C33", "[\"A12\", \"B07\", \"C33\", \"D19\", \"E02\"] / D19", "3 / B07"],
    "answer": 0,
    "explain": "Lowering `length` by 2 drops the last two elements. The new length is 3, so `codes[1]` is the second-to-last: B07."
  },
  {
    "q": "What does this print?",
    "code": "for (let i = 10; i < 3; i++) {\n  console.log(i);\n}\nconsole.log(\"done\");",
    "options": ["done", "10 / done", "nothing", "the loop never ends"],
    "answer": 0,
    "explain": "The first test, `10 < 3`, is false, so the body never runs; only the line after the loop prints."
  },
  {
    "q": "`let arr = [2, 2];` then `for (let i = 2; i < 6; i++) { arr[i] = ___; }` gives `[2, 2, 4, 6, 10, 16]`. Fill the blank.",
    "options": ["`arr[i - 1] + arr[i - 2]`", "`arr[i] + arr[i - 1]`", "`arr[i - 1] * 2`", "`arr[i + 1] + arr[i + 2]`"],
    "answer": 0,
    "explain": "Each new element is the sum of the two before it: 2 + 2 = 4, 2 + 4 = 6, 4 + 6 = 10, 6 + 10 = 16. `arr[i]` is still empty when read, which gives NaN."
  },
  {
    "type": "free",
    "q": "Trace this loop and write each line it prints: `let t = [5, 3, 8]; for (let i = t.length - 1; i >= 0; i--) { console.log(i + \": \" + t[i]); }`",
    "model": "`t.length - 1` is 2, so i takes 2, 1, 0 and stops when it becomes -1. It prints `2: 8`, then `1: 3`, then `0: 5`.",
    "points": ["i starts at t.length - 1, which is 2", "i goes down by 1 and stops when i is -1", "first line 2: 8", "second line 1: 3", "third line 0: 5"],
    "rows": 4,
    "explain": "Run it: the three lines are `2: 8`, `1: 3`, `0: 5`."
  }
]
```
