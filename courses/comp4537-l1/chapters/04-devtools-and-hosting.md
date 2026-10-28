---
title: DevTools, the four kinds of hosting, and index.html
minutes: 14
---

Code that runs in a browser is debugged in the browser, and code meant for anyone in the world has to live on a machine that is always on. This lesson covers the tool for the first and the choices for the second.

<!-- facts: slide 13 menu path, Ctrl+Shift+I, seven numbered regions; slide 14 inspect question; slide 94 four steps; slide 18 needs box; slide 19 hosting, 24/7, connected, unique address, renders HTML, files copied; slide 20 hosting providers; slide 21 three requirements; slides 22-23 shared, VPS, dedicated, cloud, Linux cheaper; slide 24 free services, cPanel; slide 25 domain not needed, registrars; slide 26 folder convention; slide 27 different companies; slide 28 index.html; slide 30 references -->

## Seven regions of Chrome's developer tool (slide 13)

Slide 13 opens the tool from Chrome's menu: *More tools* → *Developer tools*, shortcut *Ctrl+Shift+I*. The screenshot is paused inside the composition example from lesson 2 and numbers seven regions. The slide asks *What does 1, 2, ..., 7 do?* without answering; the third column below is worked out from the screenshot.

```diagram
{ "type": "grid", "title": "The seven DevTools regions", "nodes": [ { "id": "h0", "label": "#", "row": 0, "col": 0 }, { "id": "h1", "label": "region", "row": 0, "col": 1 }, { "id": "h2", "label": "what it does", "row": 0, "col": 2 }, { "id": "n1", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "Sources tab", "row": 1, "col": 1 }, { "id": "b1", "label": "shows the page's files to debug", "row": 1, "col": 2 }, { "id": "n2", "label": "2", "row": 2, "col": 0 }, { "id": "a2", "label": "file navigator", "sub": "Page / Workspace", "row": 2, "col": 1 }, { "id": "b2", "label": "picks the file to open", "row": 2, "col": 2 }, { "id": "n3", "label": "3", "row": 3, "col": 0 }, { "id": "a3", "label": "Console tab", "row": 3, "col": 1 }, { "id": "b3", "label": "console.log output and errors", "row": 3, "col": 2 }, { "id": "n4", "label": "4", "row": 4, "col": 0 }, { "id": "a4", "label": "line-number gutter", "row": 4, "col": 1 }, { "id": "b4", "label": "click to set a breakpoint", "sub": "paused at line 16", "row": 4, "col": 2 }, { "id": "n5", "label": "5", "row": 5, "col": 0 }, { "id": "a5", "label": "debugger toolbar", "sub": "and Breakpoints list", "row": 5, "col": 1 }, { "id": "b5", "label": "resume, step over, into, out", "row": 5, "col": 2 }, { "id": "n6", "label": "6", "row": 6, "col": 0 }, { "id": "a6", "label": "Scope / Watch pane", "row": 6, "col": 1 }, { "id": "b6", "label": "values of variables while paused", "row": 6, "col": 2 }, { "id": "n7", "label": "7", "row": 7, "col": 0 }, { "id": "a7", "label": "Network tab", "row": 7, "col": 1 }, { "id": "b7", "label": "every request the page sends", "row": 7, "col": 2 } ], "hi": ["a1", "a4", "a5"], "caption": "Slide 13's numbered regions, paused at line 16 with breakpoints on lines 8 and 16." }
```

The breakpoint workflow uses regions 4, 5 and 6 together. A click on a line number sets a breakpoint, a blue marker. When the code reaches it, execution pauses: the screenshot is stopped at line 16, `this.engine = engine;`, highlighted in yellow. The toolbar then steps one line at a time, and the Watch pane shows `this.engine` as an `Engine` object. The Breakpoints list also offers *Pause on uncaught exceptions* and *Pause on caught exceptions*.

Slide 94 gives the route to the console in four numbered clicks.

```diagram
{ "type": "flow", "title": "Opening the console", "nodes": [ { "id": "s1", "label": "1 ⋮ menu" }, { "id": "s2", "label": "2 More Tools" }, { "id": "s3", "label": "3 Developer tools", "sub": "Ctrl+Shift+I" }, { "id": "s4", "label": "4 Console tab" } ], "edges": [ { "from": "s1", "to": "s2" }, { "from": "s2", "to": "s3" }, { "from": "s3", "to": "s4" } ], "hi": ["s4"], "caption": "Here is how to open console window in Chrome. Note the debugging tools in there." }
```

## Inspect before changing code (slide 14)

Slide 14 describes a page with three buttons, one in the wrong colour and the wrong position, and asks what to inspect first, before touching the JavaScript. The slide gives no answer. Worked out: right-click the wrong button and choose Inspect. The Elements panel opens on that button's HTML element, and its Styles pane lists every CSS rule that applies, with the winning one on top, crossed-out losers below, and the file and line each rule came from. Colour and position are CSS, so the cause is usually a rule, not the script; looking first avoids editing code that was never wrong.

## What hosting is (slides 18 to 20)

:::info Not on the midterm
Deploying and hosting tools are excluded from the midterm. The labs need them, so the slides are summarized briefly.
:::

To make a website reachable by anyone, it is hosted on a server, a computer that *is kept switched on, 24/7*, *is connected to the internet* and *has a unique address*. When you type a URL, *the server side script runs in that computer and generates ( renders) HTML files to return to your browser*. The HTML, images and CSS are copied to your machine for the browser to use; streaming video is not entirely stored. Companies that run such machines *are called Hosting providers*.

```diagram
{ "type": "flow", "title": "What hosting does", "nodes": [ { "id": "b", "label": "browser", "sub": "types https://myDomain.com" }, { "id": "s", "label": "server", "sub": "on 24/7, connected, unique address" }, { "id": "c", "label": "browser storage", "sub": "HTML, CSS, images copied", "kind": "cylinder" } ], "edges": [ { "from": "b", "to": "s", "label": "request" }, { "from": "s", "to": "c", "label": "rendered HTML" } ], "hi": ["s"], "caption": "The server side script runs in that computer and generates ( renders) HTML files to return to your browser." }
```

## Three requirements, four kinds of plan (slides 21 to 27)

A hosting account for this course must provide three things (slide 21):

1. a *relational database server*: mySQL, Postgres, MariaDB;
2. *Hosting multiple nodejs projects at the same time*;
3. an *SSL certificate*, *So that you can host https:// instead of only http://*, because *Many third party APIs require you to use https*. Installing it is part of the assignments.

```diagram
{ "type": "grid", "title": "Shared, VPS, dedicated, cloud", "nodes": [ { "id": "h0", "label": "plan", "row": 0, "col": 0 }, { "id": "h1", "label": "the machine", "row": 0, "col": 1 }, { "id": "h2", "label": "note on the slide", "row": 0, "col": 2 }, { "id": "k1", "label": "Shared", "row": 1, "col": 0 }, { "id": "m1", "label": "hundreds of sites share memory, disk, CPU", "row": 1, "col": 1 }, { "id": "t1", "label": "cheapest, might be the slowest", "row": 1, "col": 2 }, { "id": "k2", "label": "VPS", "sub": "virtual private server", "row": 2, "col": 0 }, { "id": "m2", "label": "shared server, your own virtual server", "row": 2, "col": 1 }, { "id": "t2", "label": "fewer sites, likely faster", "row": 2, "col": 2 }, { "id": "k3", "label": "Dedicated", "row": 3, "col": 0 }, { "id": "m3", "label": "a single physical machine for your site", "row": 3, "col": 1 }, { "id": "t3", "label": "you control CPU, RAM, disk", "row": 3, "col": 2 }, { "id": "k4", "label": "Cloud", "row": 4, "col": 0 }, { "id": "m4", "label": "multiple machines act as one system", "row": 4, "col": 1 }, { "id": "t4", "label": "handles high traffic or spikes", "row": 4, "col": 2 } ], "hi": ["k1"], "caption": "Shared plans are the cheapest … For your projects in this course a right shared plan would suffice." }
```

Slide 22 spells VPS *Virtual prove server*; its own text says *virtual private server*. Shared hosting runs on Linux or Windows, and *Generally Linux servers are cheaper*. Free services are allowed if they stay up all semester and offer SSL, MySQL and several Node apps at once; managing the server is your responsibility, and panels such as cPanel make shared hosting easier.

A domain name is not needed when the host gives a unique address such as `https://myAdvWebDev.herokuapp.com`; registrars such as GoDaddy sell one, and hosting and domain may come from different companies. Labs go in folders like `…/comp4537/labs/1/`. Slide 30 lists the references, including a guide to hosting a static site on Heroku.

## index.html is special (slide 28)

*By default all web browsers will automatically 'look' for an index.html page located in the url directory*, and *if the html server does not find the html file in the url, it returns the index.html page (if exists)*. Opening `http://myDomain.com/project2` with no file name shows `index.html`; `course.html` must be named in the URL. Strictly it is the web server that picks `index.html`, as the second sentence says.

```diagram
{ "type": "tree", "title": "index.html is the default document", "nodes": [ { "id": "dom", "label": "MyDomain.com" }, { "id": "p2", "label": "project2/", "parent": "dom" }, { "id": "idx", "label": "index.html", "sub": "served for /project2", "parent": "p2" }, { "id": "crs", "label": "course.html", "sub": "only if named", "parent": "p2" }, { "id": "lab", "label": "comp4537/labs/1/", "parent": "dom" }, { "id": "idx2", "label": "index.html", "sub": "served for /labs/1", "parent": "lab" } ], "hi": ["idx", "idx2"], "caption": "If the html server does not find the html file in the url, it returns the index.html page (if exists)." }
```

```quiz
[
  {
    "q": "Which DevTools tab holds the line-number gutter where you set breakpoints?",
    "options": ["Sources", "Console", "Network", "Elements"],
    "answer": 0,
    "explain": "Region 1 on slide 13 is the Sources tab; its editor gutter (region 4) carries the breakpoints on lines 8 and 16. The Console shows output and errors, Network shows requests, Elements shows the HTML and CSS."
  },
  {
    "q": "A page's weather data never arrives. Which DevTools tab lists every request the page sent and its response?",
    "options": ["Network", "Sources", "Console", "Scope / Watch"],
    "answer": 0,
    "explain": "Region 7, the Network tab. The Console may show an error message, but the request itself, its status and its response are in Network."
  },
  {
    "q": "Type the keyboard shortcut slide 13 gives for Developer tools.",
    "type": "text",
    "answer": ["Ctrl+Shift+I", "Ctrl Shift I", "Ctrl-Shift-I", "Control+Shift+I"],
    "explain": "Chrome menu → More tools → Developer tools, *Ctrl+Shift+I*. Slide 94 reaches the Console the same way in four steps."
  },
  {
    "q": "A notes app must be hosted for the term. Which list matches the course's hosting requirements?",
    "options": [
      "All of these: a relational database server, several Node.js apps running at once, an SSL certificate for https, and the service up for the whole semester",
      "Only a domain name and an SSL certificate",
      "Only a relational database server",
      "A dedicated server and a domain name from the same company"
    ],
    "answer": 0,
    "shuffle": false,
    "explain": "Slide 21's three requirements are the relational database, multiple Node.js projects at the same time, and SSL; slide 24 adds that a free service must stay up the entire semester. A domain name is not needed (slide 25), and hosting and domain can come from different companies (slide 27)."
  },
  {
    "q": "Slide 22: *Shared plans are the cheapest but, depending on number of websites hosted in same machine, might be the slowest.*",
    "type": "tf",
    "answer": true,
    "explain": "Word for word from slide 22, which adds that for this course *a right shared plan would suffice*."
  },
  {
    "q": "Slide 22: *For your projects in this course a right dedicated plan would suffice.*",
    "type": "tf",
    "answer": false,
    "explain": "The slide says a right **shared** plan would suffice. A dedicated server is a single physical machine for one site, which the course does not require."
  },
  {
    "q": "Which kind of hosting uses technologies *that allow multiple machines to act as one system*?",
    "options": ["Cloud hosting", "Dedicated server", "VPS", "Shared hosting"],
    "answer": 0,
    "explain": "Slide 23: cloud hosting lets multiple servers work together to handle high traffic or spikes. Dedicated is one physical machine; VPS and shared put your site on a machine shared with others."
  },
  {
    "q": "A folder `recipes/` on a site holds `index.html` and `soup.html`. What does `http://example.com/recipes/` serve?",
    "options": ["index.html", "soup.html", "a list of the folder's files", "an error, because no file name was given"],
    "answer": 0,
    "explain": "Slide 28: *if the html server does not find the html file in the url, it returns the index.html page (if exists)*. `soup.html` is served only when its name is in the URL."
  },
  {
    "type": "free",
    "q": "One button on a clinic's booking page has the wrong colour. Before changing any code, how would you use Chrome DevTools to find the cause?",
    "model": "Open DevTools (Ctrl+Shift+I) or right-click the button and choose Inspect. The Elements panel selects the button's HTML element. Its Styles pane shows every CSS rule that applies to it, with the winning rule on top, overridden rules crossed out, and the file and line of each rule. Colour is CSS, so the cause is the winning rule, which can be edited live to test a fix before changing the file.",
    "points": [
      "Inspect the element (right-click → Inspect, or Ctrl+Shift+I and the Elements panel)",
      "find the button's HTML element first",
      "read the Styles pane: the rules that apply and which one wins",
      "the file and line of the rule show where to fix it"
    ],
    "rows": 5,
    "explain": "Slide 14 asks this without an answer; the model is worked out from how DevTools behaves."
  }
]
```
