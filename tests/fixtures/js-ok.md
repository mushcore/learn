---
title: JS fixture that validates
---
A fixture lesson for tests/validate-js.test.js: every JavaScript block here is valid, so the validator prints OK for this file. It covers a DOM-free run block with its output, a DOM-bound run block, a pin with two references and a quiz.

## Adding

```js run
console.log(1 + 1);
```

```output
2
```

## The page title

```js run
console.log(document.title);
```

## A small server

```js pin server.js
const http = require("http");
http.createServer((req, res) => res.end("hi")).listen(8888);
```

`require("http")` loads the module, and `.listen(8888)` starts the server on port 8888.

```quiz
[
  { "q": "What does `1 + 1` print?", "options": ["2", "11"], "answer": 0, "explain": "Both are numbers, so `+` adds them." }
]
```
