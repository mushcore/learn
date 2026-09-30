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
- `courses/math3042/` — MATH 3042 Unit 1 (descriptive statistics) + pencil problems + mock quiz + formula sheet.
- `courses/comp3522-w2/` — COMP 3522 Week 2 (file streams and seeking, arrays, random numbers, pointers and references with a memory stepper, strings and getline, istringstream, vectors, new/delete) + the practice sheet worked + mock quiz + cheat sheet.
- `courses/math3042-u2/` — MATH 3042 Unit 2 (frequency tables, pie/bar, stem-and-leaf, the histogram class recipe, cumulative frequencies and ogives, scatter plots) + Lab 2 grouped statistics in R + pencil problems + mock quiz + formula sheet.
- `courses/comp3721-w1/` — COMP 3721 Week 1 (data communications, networks, topologies, Internet, protocol layering, TCP/IP, connecting devices, math review) + E01 and sample quiz worked + Mock Quiz 1 + study note.
- `courses/comp3721-w2/` — COMP 3721 Week 2 (physical layer: analog/digital signals, sine waves, phase, wavelength, composite signals, bandwidth, bit rate, levels) + E02 worked + Mock Quiz 2 + study note.
- `courses/comp3721-w3/` — COMP 3721 Week 3 (physical layer: baseband and broadband transmission, attenuation and decibels, distortion, noise and SNR, Nyquist bit rate, Shannon capacity, bandwidth-delay product, parallel and serial transmission) + E03 worked + Mock Quiz 3 + study note.
- `courses/comp3522-w3/` — COMP 3522 Week 3 (structs and classes, constructors and the most vexing parse, member initialization lists and default arguments, the copy constructor and shallow versus deep copies, destructors and object lifetime, forward declarations, inheritance and access levels, polymorphism and virtual functions, the testing and debugging deck, Lab 3's stack with Catch-style tests, UML review) + mock quiz + cheat sheet. Widgets: constructor picker, object-lifetime stepper, copy visualizer, virtual-dispatch explorer, equivalence partitions, UML relations.
- `courses/comp3522-w4/` — COMP 3522 Week 4 (abstract classes and interfaces, the virtual destructor, multiple inheritance and ambiguity, the diamond and virtual base classes, friends, operator overloading canonical forms, the copy-and-swap assignment operator) + the midterm practice questions worked + mock quiz + cheat sheet. Widgets: abstract-class checker, diamond builder, friendship checker, operator-call rewriter, copy-and-swap stepper.
- `courses/math3042-u3/` — MATH 3042 Unit 3 (sample spaces and events, classical and relative-frequency probability, the law of large numbers, the counting rule with permutations and combinations, complement and addition rules, conditional probability and independence on a two-way table, the multiplication rule, Bayes' rule on a tree) + Lab 3 charts of the survey data in R + Lab 4 sample()/replicate() simulations + every lecture example worked + mock quiz + formula sheet. Widgets: clickable sample spaces, law-of-large-numbers simulator, counting calculator, Venn rules, birthday problem, two-way table, Bayes tree, simulation lab.
- `courses/comp3760-l1/` — COMP 3760 Lecture 1 (what an algorithm is, find and fib, counting statements and basic operations with the tie-breakers, sums, best/worst case, orders of growth, Big-O / Ω / Θ) + the lecture's practice problems worked + Mock Quiz 1 + study sheet. Every slide and quiz-style algorithm runs in a per-line execution counter (`op-counter`).

Navigation is course → module → lesson. A course (e.g. COMP 3721) is an entry in `courses/index.json` with a list of modules; a module is one week (or unit) with its own folder and id (`<course>-w<N>`), so a course grows week by week without one giant module. The home page lists courses, a course page (`#/course/<id>`) lists its modules, and a module page lists its lessons.

## Add a course

1. Create `courses/<id>/course.json` (see an existing one): `lang` (`cpp`, `r` or `pseudo`; colours inline `code` in the prose, omit for none), title, subtitle, description, optional `intro` markdown, `chapters[]` each with `lessons[] = { id, title, file }`.
2. Write lessons in `courses/<id>/chapters/*.md` following `AUTHORING.md` (front matter, fenced block types, widget catalogue).
3. Register it as a module under its course in `courses/index.json` (`courses[].modules[] = { id, title, subtitle, description }`; add the course entry with `id`, `code`, `title`, `description` if it is the first module).
4. Validate: `bun validate.js courses/<id>` (server must be running; it compiles every C++ block and checks quiz JSON).

## Layout

```
server.js            static server + POST /api/run (compile & run C++, 5 s limit, stdin supported)
validate.js          lesson validator
index.html, app/     SPA: main.js (router/sidebar/progress), markdown.js (renderer + math),
                     quiz.js, challenge.js, runner.js, editor.js, highlight.js,
                     widgets-cpp.js, widgets-cpp2.js, widgets-stats.js, widgets-viz.js, widgets-net.js,
                     widgets-net2.js, widgets-algo.js, widgets-oop.js, widgets-prob.js, widgets.js (registry), styles.css
courses/             index.json + one folder per course
```
