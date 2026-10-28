# COMP 4537 midterm: source notes

Compiled from the course outline, the midterm announcement and the lecture decks. The Learning Hub quiz questions themselves are not reproduced here; only their topics are listed.

## The exam

- When: the Oct 26–30 2026 exam week (the day is announced in class).
- Where and how: in person, on Learning Hub, on your own laptop; two hours at most.
- Closed book except one letter-sized sheet, both sides, written or typed, figures allowed, name top-left; it may be collected.
- One browser tab (Learning Hub). No developer tools.
- Scope: lectures 1 to 6 in full; from lecture 7 only the Node-to-MySQL connection, queries from Node and CRUD fundamentals.
- Excluded: writing SQL, hosting and deployment tools, VS Code.
- Question kinds: multiple choice and true/false, what-prints (console output of short programs), short and medium written answers, long coding answers.
- Weights (course outline): midterm 30 %, final 30 %, quizzes 15 %, assignments 10 %, group project 10 %, participation 5 %.
- L6 slide 2: *Midterm exam administrated on Learning Hub*; *Closed book, one sheet*.

## Scope per lecture


| Lecture | Slides | In scope | Out of scope | Learning Hub quizzes |
|---|---|---|---|---|
| 1 Review HTML/CSS/JS, OOP, style, hosting | 188 | everything, including the four hosting kinds and the three things a host must provide (L1 s21–23) | cPanel and registrar how-to (s24–27) as procedure | 1, 2, 3, 4, 6 |
| 2 Architecture, JSON, Web Storage | 45 | everything | — | 5, part of 6 |
| 3 Web API anatomy, GET vs POST, REST | 54 | everything; Postman only as "Postman ignores CORS" | Postman as a tool (s40–43) | 6 Q5 Q14, 7 Q6–Q8 |
| 4 Servers and Node.js | 48 | s6–42 and s47 | VS Code debugging and shortcuts (s25–27), cPanel, phpMyAdmin, XAMPP (s43–46) | 7 |
| 5 AJAX, CORS, Node to MySQL | 50 | s4–33 and s42–45 (connect, query, INSERT) | XAMPP and phpMyAdmin setup (s34–41), remote hosting (s46–50) | 10 |
| 6 Promises | 56 | everything; the heaviest topic | — | 8, 9 |
| 7 Databases | 74 | s4–30 (database, DBMS, tables, keys, 1:M, referential integrity, CRUD) and reading the labs' `CREATE TABLE IF NOT EXISTS`, `INSERT`, `SELECT` | writing SQL beyond the labs (s31–73) | 11 (the SQL items are out of scope) |

## Learning Hub quiz topics (questions not reproduced)

- Quiz 1: review HTML CSS (20)
- Quiz 2: review Loop/Array (30)
- Quiz 3: review older js function declaration (15)
- Quiz 4: review basic JS Objects Hosting (11)
- Quiz 5: Local Storage and JSON (12)
- Quiz 6: review JavaScript misc (17)
- Quiz 7: NodeJS, http methods, fs, DB connect (10)
- Quiz 8: Promises Basic (11)
- Quiz 9: Promises finally catch (10)
- Quiz 10: Lecture 5 - AJAX GET POST and CORS Quiz (10)
- Quiz 11: Brush up your API related DB skills (12)

## Lecture → lesson coverage

Which slides each midterm lesson draws on. "fmt" = `midterm-format-and-rules`, "out" = `output-order-drill`, "sa" = `short-answer-drill`, "code" = `coding-questions`, "mA"/"mB" = the mocks, "sheet" = `cheat-sheet`, "rec" = `recall-drill-all`. Slides not listed for a lecture are covered only by the mocks and the sheet at the topic level, or are out of scope (last column).

| Lecture | Slides | Drawn on by | Out of scope for the midterm |
|---|---|---|---|
| L1 | s3–12 (web vs desktop, OOP) | sheet, mA, mB | — |
| L1 | s13–17 (DevTools, style rules, term project) | sheet (style rules), mA (s16), rec | DevTools use in the exam (forbidden anyway) |
| L1 | s18–28 (hosting) | sheet (kinds, three requirements, `index.html`), mB, rec R10 | cPanel and registrar procedure (s24–27) |
| L1 | s33–87, s169–188 (HTML and CSS) | sheet, mA, mB, rec R4 R25 | — |
| L1 | s88–110, s113–122 (JS values, outputs, arrays, identifiers) | out 5, sa S12, sheet, mA, mB, rec R8 R9 | — |
| L1 | s115–134 (scope, hoisting, window, strict) | out 3 4 7, sa S12, sheet, mA, mB, rec R17 | — |
| L1 | s135–160 (events, objects, DOM, prompt) | sheet, mB | — |
| L1 | s161–162 (timers, event queue) | fmt, out 1 2 7 11, sa S11, sheet, mA, mB | — |
| L1 | s163–168 (parameters, style, return, arrows) | out 6, sheet, mA | — |
| L2 | s3–22 (architecture) | sa S9, sheet, mA, mB, rec R11 R18 R19 | — |
| L2 | s23–25 (course outcomes) | sheet (CRUD), rec R23 | — |
| L2 | s26–29 (JSON) | sa S19, code C11, sheet, mA, mB | — |
| L2 | s30–44 (Web Storage) | sa S6, code C11, sheet, mA, mB, rec R15 | — |
| L3 | s3–16 (review) | out (shapes), sa S11 S12 | — |
| L3 | s18–29 (why APIs) | sheet | — |
| L3 | s30–39 (anatomy, GET vs POST) | sa S2 S16, sheet, mA, mB, rec R3 R13 R14 | — |
| L3 | s40–43 (Postman) | sa S3 (Postman ignores CORS) | Postman as a tool |
| L3 | s44–53 (REST, microservices, principles) | sa S1, sheet, mA, mB, rec R1 | — |
| L4 | s6–23 (servers, Node, restaurant) | sa S4 S5, sheet, mA, mB, rec R12 R16 | — |
| L4 | s24–28 (install, debug) | — | VS Code, debugging, shortcuts (s25–28) |
| L4 | s29–31 (modules) | code (spot the bug), sheet, mB | — |
| L4 | s32–39 (http, url) | code C1 C5, sheet, mA, mB, rec R24 | — |
| L4 | s40–42 (fs, file server) | code C1 (404 branch), sheet, mB | — |
| L4 | s43–47 (cPanel, phpMyAdmin, XAMPP, arrows) | sheet (arrow forms) | cPanel, phpMyAdmin, XAMPP (s43–46) |
| L5 | s4–9 (XHR steps, readyState, status) | sa S8 S10, code C2, sheet, mA, mB, rec R2 R5 R7 | — |
| L5 | s10–14 (Demos 1, 2) | code C2, sheet | — |
| L5 | s15–21 (CORS) | sa S3, code C4, sheet, mA, mB, rec R20 | remote hosting of the demo |
| L5 | s22–30 (POST demos) | sa S17, code C9, sheet, mB | — |
| L5 | s31–33 (CRUD, relational DB) | sheet, rec R23 | — |
| L5 | s34–41 (XAMPP, phpMyAdmin) | — | all |
| L5 | s42–45 (Node to MySQL) | sa S18, code C10, sheet, rec R22 | — |
| L5 | s46–50 (remote hosting) | — | all |
| L6 | s3 (verbs, idempotency) | sa S7, sheet, mA, rec R14 | — |
| L6 | s4–10 (first-class functions, callbacks, async problem) | code C3, sheet | — |
| L6 | s11–19 (states, executor, eager) | sa S13, sheet, mA, mB, rec R6 | — |
| L6 | s20–34 (Examples 1–11) | out 8–17, sa S14, code C3 C7, sheet, mA, mB | — |
| L6 | s35–40 (status and value, default resolve/reject, two AJAX calls) | sa S13, code C3 (callback hell) | — |
| L6 | s41–51 (.then, .catch, .finally) | out 18 19, sa S14, code C7, sheet, mA, mB, rec R21 | — |
| L6 | s52 (async/await) | out 20, sa S15, code C8, sheet, mB | — |
| L6 | s53–55 (timing activity, response size, readyState correction) | sa S8, sheet | — |
| L7 | s4–30 (review, database, DBMS, tables, keys, 1:M, referential integrity) | sa S20, sheet, mA, mB | — |
| L7 | s31–73 (SQL by example, M:M, AUTO_INCREMENT, CHECK) | sheet (reading `CREATE TABLE IF NOT EXISTS`, `INSERT`, `SELECT` only) | writing SQL (the midterm note excludes it) |
