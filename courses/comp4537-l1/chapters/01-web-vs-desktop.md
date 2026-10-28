---
title: A web app runs on networks, browsers and devices you do not control
minutes: 12
---

A program on your own computer has one user, one machine and no network to lose. A web application has none of those guarantees, and the course's architecture questions start from that difference.

<!-- facts: slide 2 outline and "assumed you know"; slide 3 four bullets; slide 4 nine-row web vs desktop table; slide 5 devices, scenarios, M.1 / i.3 notation, "12 scenarios", six factors; slide 17 term project; slide 29 topics list -->

## The lecture's eight parts (slide 2)

Slide 2 lists the lecture in order: *A question on application design*, *OOP review*, *Chrome debugging/developer tool*, *Coding style rules in this class for this week's lab onward*, *HTML review*, *CSS review*, *JavaScript review* and *Hosting tips*. The review parts come from prerequisite courses: *it will be assumed you know these materials*.

## Real-world constraints come first (slide 3)

Slide 3 is titled *Internet software architecture starts with real-world constraints*. It asks why a web application is harder to design than a program that runs only on your own computer, and answers in four bullets:

- *Web applications run across unreliable networks, different browsers, devices, and servers.*
- *Users may close a page, lose connectivity, use limited hardware, or send unexpected input.*
- *Good architecture separates concerns so that the user interface, server-side logic, and data can evolve and fail independently.*
- *Before choosing a tool or pattern, identify the device, network, performance, security, and privacy constraints.*

The third bullet is the one later lectures build on. A weather site whose database is down can still show its page and say the forecast is unavailable; a desktop program with everything in one process usually just stops.

```diagram
{ "type": "layers", "title": "The slide's three concerns drawn", "nodes": [ { "id": "ui", "label": "user interface", "sub": "the page in the browser" }, { "id": "srv", "label": "server-side logic", "sub": "the API server" }, { "id": "data", "label": "data", "sub": "the database" } ], "hi": ["srv"], "caption": "Slide 3's sentence drawn: the user interface, server-side logic, and data can evolve and fail independently." }
```

## Nine ways a web app differs from a desktop app (slide 4)

Slide 4, *Why web is so challenging ?*, compares a web app with a Java desktop application row by row.

```diagram
{ "type": "grid", "title": "Web app vs Java desktop app", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "Web app", "row": 0, "col": 1 }, { "id": "h2", "label": "Java Desktop app", "row": 0, "col": 2 }, { "id": "r1", "label": "1", "row": 1, "col": 0 }, { "id": "w1", "label": "User can close the page unannounced", "row": 1, "col": 1 }, { "id": "d1", "label": "The OS signals the Java app before closure", "row": 1, "col": 2 }, { "id": "r2", "label": "2", "row": 2, "col": 0 }, { "id": "w2", "label": "Any browser (even IE or Edge)", "row": 2, "col": 1 }, { "id": "d2", "label": "Windows, Mac or Linux, that's it", "row": 2, "col": 2 }, { "id": "r3", "label": "3", "row": 3, "col": 0 }, { "id": "w3", "label": "Browser has limited resources", "sub": "memory, CPU, GPU", "row": 3, "col": 1 }, { "id": "d3", "label": "Entire resources at hand", "row": 3, "col": 2 }, { "id": "r4", "label": "4", "row": 4, "col": 0 }, { "id": "w4", "label": "Any device", "sub": "phone, tablet, desktop", "row": 4, "col": 1 }, { "id": "d4", "label": "Desktop computer or thin client", "row": 4, "col": 2 }, { "id": "r5", "label": "5", "row": 5, "col": 0 }, { "id": "w5", "label": "Zillions of frameworks to learn", "row": 5, "col": 1 }, { "id": "d5", "label": "Just Java and maybe JavaFX", "row": 5, "col": 2 }, { "id": "r6", "label": "6", "row": 6, "col": 0 }, { "id": "w6", "label": "Anyone around the world can access", "row": 6, "col": 1 }, { "id": "d6", "label": "Only for you", "row": 6, "col": 2 }, { "id": "r7", "label": "7", "row": 7, "col": 0 }, { "id": "w7", "label": "DoF service attach, injection", "row": 7, "col": 1 }, { "id": "d7", "label": "No one else has access", "row": 7, "col": 2 }, { "id": "r8", "label": "8", "row": 8, "col": 0 }, { "id": "w8", "label": "Server or network might go down", "row": 8, "col": 1 }, { "id": "d8", "label": "It's your PC", "row": 8, "col": 2 }, { "id": "r9", "label": "9", "row": 9, "col": 0 }, { "id": "w9", "label": "Remote!", "row": 9, "col": 1 }, { "id": "d9", "label": "Right in front of you", "row": 9, "col": 2 } ], "hi": ["w1", "w8", "w9"], "caption": "Compare the challenges of a web app vs a desktop Java/python application development." }
```

Row 7 is printed *DoF service attach*: it means a denial-of-service (DoS) attack, where a flood of requests keeps real users out. Rows 6 and 7 are the security problem: anyone can reach the app, and some send hostile input. The last row sums up the rest. The web app is *Remote!*; the desktop app is *Right in front of you*.

## Five devices in three network scenarios (slide 5)

Slide 5 asks what the general challenges are when one application targets five devices: a smartphone, a tablet, a browser, a PC, and *IoT nodes ( many of which have no screen or a keyboard)*. Each device is then placed in three scenarios: 1, not connected to any network; 2, connected to a local network; 3, connected to the internet.

A device letter and a scenario number name each case: *M.1 refers to mobile not connected to net*, and *i.3 refers to an IoT node connected to the internet*.

```diagram
{ "type": "grid", "title": "Five devices × three scenarios", "nodes": [ { "id": "c00", "label": "", "row": 0, "col": 0 }, { "id": "c01", "label": "1 no network", "row": 0, "col": 1 }, { "id": "c02", "label": "2 local network", "row": 0, "col": 2 }, { "id": "c03", "label": "3 internet", "row": 0, "col": 3 }, { "id": "m0", "label": "M mobile", "row": 1, "col": 0 }, { "id": "m1", "label": "M.1", "row": 1, "col": 1 }, { "id": "m2", "label": "M.2", "row": 1, "col": 2 }, { "id": "m3", "label": "M.3", "row": 1, "col": 3 }, { "id": "t0", "label": "T tablet", "row": 2, "col": 0 }, { "id": "t1", "label": "T.1", "row": 2, "col": 1 }, { "id": "t2", "label": "T.2", "row": 2, "col": 2 }, { "id": "t3", "label": "T.3", "row": 2, "col": 3 }, { "id": "b0", "label": "B browser", "row": 3, "col": 0 }, { "id": "b1", "label": "B.1", "row": 3, "col": 1 }, { "id": "b2", "label": "B.2", "row": 3, "col": 2 }, { "id": "b3", "label": "B.3", "row": 3, "col": 3 }, { "id": "p0", "label": "P PC", "row": 4, "col": 0 }, { "id": "p1", "label": "P.1", "row": 4, "col": 1 }, { "id": "p2", "label": "P.2", "row": 4, "col": 2 }, { "id": "p3", "label": "P.3", "row": 4, "col": 3 }, { "id": "i0", "label": "i IoT node", "row": 5, "col": 0 }, { "id": "i1", "label": "i.1", "row": 5, "col": 1 }, { "id": "i2", "label": "i.2", "row": 5, "col": 2 }, { "id": "i3", "label": "i.3", "row": 5, "col": 3 } ], "hi": ["m1", "i3"], "caption": "The slide says: So there are a total of 12 scenarios. Its own lists give 5 × 3 = 15 cells." }
```

The count of 12 does not match the lists, which make 15; the notation is what matters.

For each cell the slide's tip asks what factors to weigh, and lists six: *Security*, *Amount of Memory that could be available to the app*, *Multitasking*, *CPU speed*, *GPU speed*, and *Taking adv of the device Sensors ( GEO, Vibration, Camera*. A notes app in case i.3 has no screen to show an error on; the same app in M.1 has a screen but no server to save to.

## The term project is an API server built from services (slide 17)

The term project is done in a group of max 4. It is *an API server based on microservice architecture, with multiple endpoints powered by pre-trained AI models from Hugging Face*. *Your API server, serves API consumers (client apps that consume your APIs).* A client app proves it works, *with simple user management and authentication*. The slide's example services are AI services, API gateway, Authentication services, Database services and User management.

```diagram
{ "type": "flow", "dir": "tb", "title": "The term project", "nodes": [ { "id": "client", "label": "client app", "sub": "API consumer" }, { "id": "gw", "label": "API gateway" }, { "id": "ai", "label": "AI services" }, { "id": "auth", "label": "Authentication services" }, { "id": "db", "label": "Database services", "kind": "cylinder" }, { "id": "um", "label": "User management" }, { "id": "hf", "label": "pre-trained models", "sub": "Hugging Face", "kind": "note" } ], "edges": [ { "from": "client", "to": "gw", "label": "API request" }, { "from": "gw", "to": "ai" }, { "from": "gw", "to": "auth" }, { "from": "gw", "to": "db" }, { "from": "gw", "to": "um" }, { "from": "ai", "to": "hf" } ], "hi": ["gw"], "caption": "Your API server, serves API consumers (client apps that consume your APIs)." }
```

## What the architect decides (slide 29)

Slide 29, *Topics we cover ( if time allowed)*, lists 89 terms in one paragraph. Grouped, in the slide's order, they map the decisions an internet software architect makes:

| Group | Terms (slide order, abridged) |
|---|---|
| Service design | API Gateway, BFF, microservice, modular monolith, service contract, message broker, synchronous and asynchronous communication |
| Failure handling | idempotency, timeout, retry, exponential backoff, circuit breaker, rate limiting, load balancing, caching |
| Watching it run | observability, logging, metrics, distributed tracing, health check, chaos engineering |
| API change | API versioning, backward compatibility, deprecation, OpenAPI, Swagger |
| Security | API key, least privilege, zero trust, OAuth 2.0, JWT, CSRF, CORS, XSS, SQL injection, TLS |
| AI | AI gateway, prompt injection, RAG, embedding, vector database, tool calling, agent |

Several return before exam week: idempotency in lecture 6, CORS in lecture 5.

```quiz
[
  {
    "q": "Slide 3: *Web applications run across reliable networks, different browsers, devices, and servers.*",
    "type": "tf",
    "answer": false,
    "explain": "The slide says *unreliable* networks. That is the first reason a web app is harder to design than a program on your own computer."
  },
  {
    "q": "In slide 4's table, which entry belongs to the **Java desktop app** column?",
    "options": [
      "The OS signals the app before closure",
      "User can close the page unannounced",
      "Browser has limited resources (memory, cpu power, GPU power)",
      "Zillions of frameworks and technologies to learn"
    ],
    "answer": 0,
    "explain": "The desktop app is warned by the operating system before it closes. The other three are web-app rows: the user closes the page without warning, the browser's resources are limited, and there are zillions of frameworks."
  },
  {
    "q": "Slide 4 says a Java desktop app has *entire resources at hand*, while a browser has limited resources.",
    "type": "tf",
    "answer": true,
    "explain": "Row 3 of the table: the browser is limited in memory, CPU power and GPU power; the Java app has the whole machine."
  },
  {
    "q": "Using slide 5's notation, write the name of the case *a tablet connected to a local network*.",
    "type": "text",
    "answer": ["T.2", "T2"],
    "explain": "Device letter, a dot, then the scenario number: T for tablet, 2 for a local network. The slide's own examples are M.1 (mobile, no network) and i.3 (IoT node, internet)."
  },
  {
    "q": "Which slide 3 bullet says the user interface, server-side logic and data should be able to fail independently?",
    "options": [
      "Good architecture separates concerns",
      "Users may close a page or lose connectivity",
      "Identify the device, network, performance, security, and privacy constraints",
      "Web applications run across unreliable networks"
    ],
    "answer": 0,
    "explain": "*Good architecture separates concerns so that the user interface, server-side logic, and data can evolve and fail independently.* The other bullets name the problems and what to identify before choosing a tool."
  },
  {
    "q": "Which of these is **not** one of the factors slide 5 lists for each device and scenario?",
    "options": ["Screen resolution", "Multitasking", "GPU speed", "Device sensors such as GEO, vibration, camera"],
    "answer": 0,
    "explain": "The six factors are security, amount of memory, multitasking, CPU speed, GPU speed and the device's sensors. Screen resolution is not on the list, though the slide does note many IoT nodes have no screen at all."
  },
  {
    "q": "According to slide 17, what does the term project's API server serve?",
    "options": [
      "API consumers: client apps that consume its APIs",
      "Static HTML pages to a single desktop user",
      "Only the Hugging Face models",
      "A Java desktop application"
    ],
    "answer": 0,
    "explain": "*Your API server, serves API consumers (client apps that consume your APIs).* Its endpoints are powered by pre-trained models from Hugging Face, and a client app with simple user management and authentication consumes them."
  },
  {
    "type": "free",
    "q": "Why is a web application harder to design than a program that runs only on your own computer? Give four constraints.",
    "model": "Web applications run across unreliable networks, different browsers, devices and servers. Users may close a page unannounced, lose connectivity, use limited hardware or send unexpected input. The browser has limited memory, CPU and GPU, while a desktop app has the whole machine. Anyone in the world can reach the app, so security (denial of service, injection) matters, and the server or the network can go down.",
    "points": [
      "unreliable networks; the server or network can go down",
      "many browsers and devices, not one OS",
      "the user can close the page unannounced or lose connectivity",
      "limited browser resources (memory, CPU, GPU)",
      "security: anyone can access it; denial of service, injection"
    ],
    "rows": 5,
    "explain": "Slide 3's four bullets and slide 4's table. Any four of the five points answer the question."
  }
]
```
