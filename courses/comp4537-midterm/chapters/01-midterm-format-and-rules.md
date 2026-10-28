---
title: Two hours, one letter sheet, four kinds of question
minutes: 10
---

Seven lectures, four kinds of question, at most two hours: the rules, the scope and a way into each kind.

## Exam week, in person, two hours

Exam week, Oct 26–30 2026 (see the Learning Hub for the day); in person, on the Learning Hub, on your own laptop, at most two hours. Lecture 6, slide 2: *Midterm exam administrated on Learning Hub* and *Closed book, one sheet of letter-sized paper both sides allowed*.

- **The sheet**: one letter-sized sheet, both sides, written or typed, figures allowed, your name top-left. It may be collected.
- **One browser tab** (the Learning Hub) and **no developer tools**.
- **Weights**: midterm 30 %, final 30 %, quizzes 15 %, assignments 10 %, group project 10 %, participation 5 %.

## Lectures 1 to 6 in full, the Node part of lecture 7

From lecture 7: the Node.js database connection, sending queries from Node, and CRUD fundamentals. That deck has no Node code; the code is in lecture 5, slides 42–45, and Lab 5. Excluded: complicated SQL beyond the labs, deploying and hosting tools (cPanel, XAMPP, Heroku), and VS Code.

| Lecture | Slides | In scope | Out of scope | Learning Hub quizzes |
|---|---|---|---|---|
| [1 HTML/CSS/JS review, OOP, style, hosting](#/comp4537-l1/web-vs-desktop) | 188 | all, including the four hosting kinds and a host's three requirements (s21–23) | cPanel and registrar how-to (s24–27) | 1, 2, 3, 4, 6 |
| [2 Architecture, JSON, Web Storage](#/comp4537-l2/architecture-and-its-patterns) | 45 | all | — | 5, part of 6 |
| [3 Web API anatomy, GET vs POST, REST](#/comp4537-l3/review-predicts) | 54 | all; Postman only as "Postman ignores CORS" | Postman as a tool (s40–43) | 6, 7 |
| [4 Servers and Node.js](#/comp4537-l4/servers-and-server-side-scripting) | 48 | s6–42 and s47 | VS Code (s25–27), cPanel, XAMPP (s43–46) | 7 |
| [5 AJAX, CORS, Node to MySQL](#/comp4537-l5/xmlhttprequest-four-steps) | 50 | s4–33 and s42–45 | XAMPP, phpMyAdmin (s34–41), hosting (s46–50) | 10 |
| [6 Promises](#/comp4537-l6/idempotency-put-patch-post) | 56 | all; the heaviest topic | — | 8, 9 |
| [7 Databases](#/comp4537-l7/databases-tables-and-keys) | 74 | s4–30 and reading the labs' SQL | writing SQL (s31–73) | 11, without its SQL items |

### Scope by lecture at a glance

```diagram
{ "type": "grid", "title": "Scope by lecture", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "In scope", "row": 0, "col": 1 }, { "id": "h2", "label": "Out of scope", "row": 0, "col": 2 }, { "id": "h3", "label": "Quizzes", "row": 0, "col": 3 }, { "id": "a0", "label": "L1", "row": 1, "col": 0 }, { "id": "a1", "label": "all 188 slides", "row": 1, "col": 1 }, { "id": "a2", "label": "cPanel how-to", "row": 1, "col": 2 }, { "id": "a3", "label": "1, 2, 3, 4, 6", "row": 1, "col": 3 }, { "id": "b0", "label": "L2", "row": 2, "col": 0 }, { "id": "b1", "label": "all 45 slides", "row": 2, "col": 1 }, { "id": "b2", "label": "none", "row": 2, "col": 2 }, { "id": "b3", "label": "5, part of 6", "row": 2, "col": 3 }, { "id": "c0", "label": "L3", "row": 3, "col": 0 }, { "id": "c1", "label": "all 54 slides", "row": 3, "col": 1 }, { "id": "c2", "label": "Postman as a tool", "row": 3, "col": 2 }, { "id": "c3", "label": "6, 7", "row": 3, "col": 3 }, { "id": "d0", "label": "L4", "row": 4, "col": 0 }, { "id": "d1", "label": "s6–42, s47", "row": 4, "col": 1 }, { "id": "d2", "label": "VS Code, cPanel, XAMPP", "row": 4, "col": 2 }, { "id": "d3", "label": "7", "row": 4, "col": 3 }, { "id": "e0", "label": "L5", "row": 5, "col": 0 }, { "id": "e1", "label": "s4–33, s42–45", "row": 5, "col": 1 }, { "id": "e2", "label": "XAMPP, hosting", "row": 5, "col": 2 }, { "id": "e3", "label": "10", "row": 5, "col": 3 }, { "id": "f0", "label": "L6", "row": 6, "col": 0 }, { "id": "f1", "label": "all 56 slides", "row": 6, "col": 1 }, { "id": "f2", "label": "none", "row": 6, "col": 2 }, { "id": "f3", "label": "8, 9", "row": 6, "col": 3 }, { "id": "g0", "label": "L7", "row": 7, "col": 0 }, { "id": "g1", "label": "s4–30", "row": 7, "col": 1 }, { "id": "g2", "label": "writing SQL", "row": 7, "col": 2 }, { "id": "g3", "label": "11 (no SQL)", "row": 7, "col": 3 } ], "hi": ["f0", "f1", "f2", "f3"], "caption": "Lectures 1 to 6 in full; from lecture 7, the database basics and the Node connection." }
```

Where a slide and the browser disagree, multiple-choice items follow the slide and what-prints items follow the real output; the lessons teach both.

## A suggested split of the two hours

The slides give no timing; a suggestion for a forty-item paper:

| Kind | Minutes each |
|---|---|
| Multiple choice, true/false | about 1 |
| What prints | 2–3 |
| Short answer | 3 |
| Medium answer | 6 |
| Long coding answer | 15 |

About 100 minutes; 10 left to check.

## Multiple choice and true/false follow the slide's words

Most stems are one slide sentence; distractors are other facts from that lecture. Two slide rules that decide answers: lecture 3, slide 38 answers "which method is secure, GET or POST?" with *none!*, and lecture 5, slide 18 says *CORS is a security feature* ***implemented in web browsers*** *and is* ***configured by the contacted server*** *in the response's header*. A true/false item is often such a sentence with one word changed: "configured by the browser" is false. For "which is false", strike each option the slide confirms.

## What prints, in three passes

One value per line, in three passes:

1. Run the synchronous lines top to bottom, including every promise executor body.
2. Drain the microtasks (`.then`, `.catch`, `.finally`, code after `await`) in queue order, including any queued while draining.
3. Run one timer callback, shortest delay first, and drain the microtasks again before the next.

```js run pin Next customer
// predict:
Promise.resolve("paid").then((s) => console.log("receipt: " + s));
console.log("next customer");
```

```output
next customer
receipt: paid
```

`Promise.resolve("paid")` is already settled, yet its handler waits for pass 2, so `console.log("next customer")` comes first (lecture 6, slide 25). The [output-order drill](#/comp4537-midterm/output-order-drill) has twenty more.

```diagram
{ "type": "flow", "title": "How to answer a what-prints question", "nodes": [ { "id": "sync", "label": "Run synchronous lines", "sub": "executor bodies too" }, { "id": "micro", "label": "Drain microtasks", "sub": "then / catch / finally / after await" }, { "id": "timer", "label": "Run one timer callback", "sub": "shortest delay first" }, { "id": "done", "label": "Output" } ], "edges": [ { "from": "sync", "to": "micro", "label": "stack empty" }, { "from": "micro", "to": "timer", "label": "repeat", "both": true }, { "from": "timer", "to": "done", "label": "none left" } ], "hi": ["micro"], "caption": "Promise handlers do NOT wait for \"all code in the program\" to finish. They wait only for the current call stack to unwind (L6 slide 17)." }
```

### Lecture 1's 1, 3, 2 script one event at a time

The timer callback waits in its queue until the stack is empty, with 1000 ms or 0 ms.

```widget
event-loop-play
{ "preset": "1-3-2", "predict": true }
```

## Short and medium answers lead with the definition

Open with the slide's definition in its words, then the comparison as two short lists, then one example from the slide. A short answer is three or more checkable points; a medium one adds the example and its consequence. For GET vs POST: where the data travels, caching, bookmarks, length, data types, *none are secure!* The [short-answer drill](#/comp4537-midterm/short-answer-drill) lists each answer's key points.

## Long coding answers start from the skeleton

Skeleton first, detail second: for a Node server `require`, `createServer`, `writeHead`, `end`, `listen`; for an AJAX call, the four XHR steps. Number the steps in comments. Trace it by hand: no developer tools. The [coding questions](#/comp4537-midterm/coding-questions) give a model answer and rubric for each.

```quiz
[
  {
    "q": "True or false: the one sheet you bring may be typed and printed.",
    "type": "tf",
    "answer": true,
    "explain": "The sheet may be written or typed, both sides of one letter-sized page, with figures, and your name top-left. It may be collected."
  },
  {
    "q": "True or false: during the midterm you may open the browser console to test a program.",
    "type": "tf",
    "answer": false,
    "explain": "One browser tab, the Learning Hub, and no developer tools. Every what-prints answer is traced by hand."
  },
  {
    "q": "Which of these is out of scope for the midterm?",
    "options": ["Writing a SELECT with GROUP BY and HAVING", "Running `con.query` from Node", "XHR readyState values", "REST's five constraints"],
    "answer": 0,
    "explain": "Writing SQL beyond the labs (lecture 7, slides 31–73) is excluded. Node's `con.query` (lecture 5, slides 42–45), readyState (lecture 5) and REST (lecture 3) are all in scope."
  },
  {
    "q": "What share of the course grade does the midterm carry?",
    "options": ["30 %", "15 %", "10 %", "50 %"],
    "answer": 0,
    "explain": "Midterm 30 %, final 30 %, quizzes 15 %, assignments 10 %, group project 10 %, participation 5 %."
  },
  {
    "q": "In which lecture is only part of the content in scope: the database basics, the Node connection and CRUD, with writing SQL excluded?",
    "options": ["Lecture 7", "Lecture 6", "Lecture 2", "Lecture 3"],
    "answer": 0,
    "explain": "Lecture 7: slides 4–30 and reading the labs' SQL are in scope; slides 31–73 teach writing SQL, which is excluded. Lectures 2, 3 and 6 are in scope in full (lecture 3 except Postman as a tool)."
  },
  {
    "q": "The Learning Hub quizzes in scope cover lectures 1 to ___ in full.",
    "type": "text",
    "answer": ["6", "six"],
    "explain": "Lectures 1 to 6 in full; from lecture 7 only the Node connection, queries from Node and CRUD fundamentals."
  }
]
```
