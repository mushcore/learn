# learn

A self-hosted interactive study app. Lessons are markdown with runnable C++ blocks, graded challenges, quizzes (MCQ / multi / true-false / numeric / text), and interactive visual widgets. Progress is saved per course in the browser.

## Run

```
cd D:\BCIT\learn
bun server.js        # or: node server.js
```

Open http://localhost:4321.

## Courses

- `courses/comp3522/` — COMP 3522 Week 1 (C++ program structure, types, operators, casting, constants, console IO) + mock quiz + cheat sheet.
- `courses/math3042/` — MATH 3042 Unit 1 (descriptive statistics) + pencil problems + mock quiz + formula sheet. Teaching examples from Path of Exile and MapleStory, sourced in `games/`.
- `courses/comp3522-w2/` — COMP 3522 Week 2 (file streams and seeking, arrays, random numbers, pointers and references with a memory stepper, strings and getline, istringstream, vectors, new/delete) + the practice sheet worked + mock quiz + cheat sheet.
- `courses/math3042-u2/` — MATH 3042 Unit 2 (frequency tables, pie/bar, stem-and-leaf, the histogram class recipe, cumulative frequencies and ogives, scatter plots) + Lab 2 grouped statistics in R + pencil problems + mock quiz + formula sheet. Teaching examples from Path of Exile and MapleStory, sourced in `games/`.
- `courses/comp3721-w1/` — COMP 3721 Week 1 (data communications, networks, topologies, Internet, protocol layering, TCP/IP, connecting devices, math review) + E01 and sample quiz worked + Mock Quiz 1 + study note.
- `courses/comp3721-w2/` — COMP 3721 Week 2 (physical layer: analog/digital signals, sine waves, phase, wavelength, composite signals, bandwidth, bit rate, levels) + E02 worked + Mock Quiz 2 + study note.
- `courses/comp3721-w3/` — COMP 3721 Week 3 (physical layer: baseband and broadband transmission, attenuation and decibels, distortion, noise and SNR, Nyquist bit rate, Shannon capacity, bandwidth-delay product, parallel and serial transmission) + E03 worked + Mock Quiz 3 + study note.
- `courses/comp3522-w3/` — COMP 3522 Week 3 (structs and classes, constructors and the most vexing parse, member initialization lists and default arguments, the copy constructor and shallow versus deep copies, destructors and object lifetime, forward declarations, inheritance and access levels, polymorphism and virtual functions, the testing and debugging deck, Lab 3's stack with Catch-style tests, UML review) + mock quiz + cheat sheet. Widgets: constructor picker, object-lifetime stepper, copy visualizer, virtual-dispatch explorer, equivalence partitions, UML relations.
- `courses/comp3522-w4/` — COMP 3522 Week 4 (abstract classes and interfaces, the virtual destructor, multiple inheritance and ambiguity, the diamond and virtual base classes, friends, operator overloading canonical forms, the copy-and-swap assignment operator) + the midterm practice questions worked + mock quiz + cheat sheet. Widgets: abstract-class checker, diamond builder, friendship checker, operator-call rewriter, copy-and-swap stepper.
- `courses/math3042-u3/` — MATH 3042 Unit 3 (sample spaces and events, classical and relative-frequency probability, the law of large numbers, the counting rule with permutations and combinations, complement and addition rules, conditional probability and independence on a two-way table, the multiplication rule, Bayes' rule on a tree) + Lab 3 charts of the survey data in R + Lab 4 sample()/replicate() simulations + every lecture example worked + mock quiz + formula sheet. Widgets: clickable sample spaces, law-of-large-numbers simulator, counting calculator, Venn rules, birthday problem, two-way table, Bayes tree, simulation lab. Teaching examples from Path of Exile and MapleStory, sourced in `games/`.
- `courses/comp3721-w4/` — COMP 3721 Week 4 (digital-to-digital conversion: data and signal elements, data rate and signal rate, bandwidth of a digital signal, baseline wandering, self-synchronization, DC components, unipolar NRZ, NRZ-L, NRZ-I, Manchester, differential Manchester, AMI) + encoding practice with draw-and-check waveforms + Mock Quiz 4 + study note.
- `courses/comp3760-l1/` — COMP 3760 Lecture 1 (what an algorithm is, find and fib, counting statements and basic operations with the tie-breakers, sums, best/worst case, orders of growth, Big-O / Ω / Θ) + the lecture's practice problems worked + Mock Quiz 1 + study sheet. Every slide and quiz-style algorithm runs in a per-line execution counter (`op-counter`).
- `courses/math3042-u4/` — MATH 3042 Unit 4 (discrete probability distributions: binomial, hypergeometric, geometric, Poisson) + Lab 5 conditional probability in R. Teaching examples from Path of Exile and MapleStory, sourced in `games/`.
- `courses/math3042-u5/` — MATH 3042 Unit 5 (continuous distributions: uniform, normal, exponential). Teaching examples from Path of Exile and MapleStory, sourced in `games/`.
- `courses/math3042-midterm/` — MATH 3042 midterm prep (Units 1 to 4, R written by hand, mocks A and B); lessons 06 and 07 use game examples sourced in `games/`.
- `courses/comp4537-l1/` — COMP 4537 Lecture 1 (web vs desktop, OOP in JavaScript, coding style, DevTools and hosting, HTML structure, CSS selectors and specificity, the box model, display and position, values and types, scope and hoisting, functions and arrows, objects and the DOM, timers and the event queue, loops and arrays) + mock quiz. Runnable `js run` and `html run` pins throughout.
- `courses/comp4537-l2/` — COMP 4537 Lecture 2 (architecture and its patterns: monolithic, n-tier, microservices; the API-centric microservice architecture; JSON.stringify and JSON.parse; Web Storage with writer and reader pages) + mock quiz.
- `courses/comp4537-l3/` — COMP 4537 Lecture 3 (the review predicts, why API servers exist, the anatomy of a web API on live requests, GET vs POST, REST's constraints) + mock quiz.
- `courses/comp4537-l4/` — COMP 4537 Lecture 4 (servers and server-side scripting, PHP's four steps vs Node's three, the restaurant analogy, Node modules, the http module, url and query strings, fs and the file server) + mock quiz.
- `courses/comp4537-l5/` — COMP 4537 Lecture 5 (XMLHttpRequest in four steps, readyState, the AJAX GET demos, CORS and the same-origin policy against live endpoints, POST bodies in chunks, Node to MySQL) + mock quiz.
- `courses/comp4537-l6/` — COMP 4537 Lecture 6 (idempotency, callbacks, promise states and the executor, the event-loop order of the deck's examples, chaining with then, catch and finally, async and await) + output-order practice + mock quiz.
- `courses/comp4537-l7/` — COMP 4537 Lecture 7 (databases, tables, keys and relationships; CRUD from Node with the mysql module, least privilege; reading the lecture's SQL) + mock quiz.
- `courses/comp4537-midterm/` — COMP 4537 midterm (format and rules, twenty output-order programs, a short-answer bank, coding questions, mock midterms A and B, a two-page letter cheat sheet with a print page, a closed-book recall drill of every fixed list). Widgets for the course are in `app/widgets-web.js` and `app/widgets-web2.js`.
- `courses/libs7102-l1/` to `courses/libs7102-l5/` — LIBS 7102 (Ethics for Computing Professionals) Lectures 1 to 5, one module per lecture: foundations of ethical debate (validity, soundness, claim types, the trick questions), conventional morality and Kohlberg, ethical relativism, act utilitarianism I and II. Each carries its listed practice answers as written `free` items and a mock quiz.
- `courses/libs7102-midterm/` — LIBS 7102 midterm (rules, the two-paragraph method, a moral-reasoning drill, all 25 listed answers in one drill, mocks A and B of six questions, answer skeletons with a two-page print sheet).

Navigation is course → module → lesson. A course (e.g. COMP 3721) is an entry in `courses/index.json` with a list of modules; a module is one week (or unit) with its own folder and id (`<course>-w<N>`), so a course grows week by week without one giant module. The home page lists courses, a course page (`#/course/<id>`) lists its modules, and a module page lists its lessons.

## Add a course

1. Create `courses/<id>/course.json` (see an existing one): `lang` (`cpp`, `r`, `pseudo` or `js`; colours inline `code` in the prose, omit for none), title, subtitle, description, optional `intro` markdown, `chapters[]` each with `lessons[] = { id, title, file }`.
2. Write lessons in `courses/<id>/chapters/*.md` following `AUTHORING.md` (front matter, fenced block types, widget catalogue).
3. Register it as a module under its course in `courses/index.json` (`courses[].modules[] = { id, title, subtitle, description }`; add the course entry with `id`, `code`, `title`, `description` if it is the first module).
4. Validate: `bun validate.js courses/<id>` (server must be running; it compiles every C++ block, runs every DOM-free `js run` block and checks quiz and diagram JSON).

## Layout

```
server.js            static server + POST /api/run (compile & run C++, 5 s limit, stdin supported)
                     + /api/echo, /api/echo-nocors, /api/slow (stateless endpoints for JS lessons)
validate.js          lesson validator (runs DOM-free js blocks under tools/js-harness.js)
tools/js-harness.js  Bun runner that prints console output the way the page does
index.html, app/     SPA: main.js (router/sidebar/progress), markdown.js (renderer + math),
                     quiz.js, q-free.js, challenge.js, runner.js, jsrunner.js, jsformat.js,
                     diagram.js, editor.js, highlight.js,
                     widgets-cpp.js, widgets-cpp2.js, widgets-stats.js, widgets-viz.js, widgets-net.js,
                     widgets-net2.js, widgets-net3.js, widgets-algo.js, widgets-oop.js, widgets-prob.js, widgets.js (registry), styles.css
courses/             index.json + one folder per course
```
