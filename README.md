# learn

A self-hosted, boot.dev-style interactive study app. Lessons are markdown with runnable C++ blocks, graded challenges, quizzes (MCQ / multi / true-false / numeric / text), and interactive visual widgets. Progress is saved per course in the browser.

## Run

```
cd D:\BCIT\learn
bun server.js        # or: node server.js
```

Open http://localhost:4321. Keep the terminal open while studying.

The top bar shows a unique-visitor count. A browser registers once (an id in localStorage); the server counts each new id once at hits.sh under the key `github.com/mushcore/learn/unique-visitors` (override with the `VISITOR_KEY` environment variable), and mirrors the number in `data/visitors.json` so the badge still works offline.

C++ blocks compile with the first `g++`/`clang++` found on PATH or in CLion's bundled MinGW (`C:/Program Files/JetBrains/CLion */bin/mingw/bin/g++.exe`). Override with `LEARN_CXX=path\to\g++.exe`. With no local compiler the server proxies to wandbox.org (needs internet).

## Courses

- `courses/comp3522/` — COMP 3522 Week 1 (C++ program structure, types, operators, casting, constants, console IO) + mock quiz + cheat sheet.
- `courses/math3042/` — MATH 3042 Unit 1 (descriptive statistics) + pencil problems + mock quiz + formula sheet.
- `courses/comp3522-w2/` — COMP 3522 Week 2 (file streams and seeking, arrays, random numbers, pointers and references with a memory stepper, strings and getline, istringstream, vectors, new/delete) + the practice sheet worked + mock quiz + cheat sheet.
- `courses/math3042-u2/` — MATH 3042 Unit 2 (frequency tables, pie/bar, stem-and-leaf, the histogram class recipe, cumulative frequencies and ogives, scatter plots) + Lab 2 grouped statistics in R + pencil problems + mock quiz + formula sheet.
- `courses/comp3721-w1/` — COMP 3721 Week 1 (data communications, networks, topologies, Internet, protocol layering, TCP/IP, connecting devices, math review) + E01 and sample quiz worked + Mock Quiz 1 + study note.
- `courses/comp3721-w2/` — COMP 3721 Week 2 (physical layer: analog/digital signals, sine waves, phase, wavelength, composite signals, bandwidth, bit rate, levels) + E02 worked + Mock Quiz 2 + study note.

Navigation is course → module → lesson. A course (e.g. COMP 3721) is an entry in `courses/index.json` with a list of modules; a module is one week (or unit) with its own folder and id (`<course>-w<N>`), so a course grows week by week without one giant module. The home page lists courses, a course page (`#/course/<id>`) lists its modules, and a module page lists its lessons.

## Add a course

1. Create `courses/<id>/course.json` (see an existing one): title, subtitle, description, optional `intro` markdown, `chapters[]` each with `lessons[] = { id, title, file }`.
2. Write lessons in `courses/<id>/chapters/*.md` following `AUTHORING.md` (front matter, fenced block types, widget catalogue).
3. Register it as a module under its course in `courses/index.json` (`courses[].modules[] = { id, title, subtitle, description }`; add the course entry with `id`, `code`, `title`, `description` if it is the first module).
4. Validate: `bun validate.js courses/<id>` (server must be running; it compiles every C++ block and checks quiz JSON).

## Layout

```
server.js            static server + POST /api/run (compile & run C++, 5 s limit, stdin supported)
validate.js          lesson validator
index.html, app/     SPA: main.js (router/sidebar/progress), markdown.js (renderer + math),
                     quiz.js, challenge.js, runner.js, editor.js, highlight.js,
                     widgets-cpp.js, widgets-stats.js, widgets.js (registry), styles.css
courses/             index.json + one folder per course
```
