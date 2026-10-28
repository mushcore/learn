---
title: The course's API-centric microservice architecture
minutes: 12
---

Of the three patterns, the course builds one for the whole term. Where does a page's request go in it, and what comes back?

## A simplified, API-centric microservice architecture (slide 21)

Slide 21, *The Architecture We Use in This Course*:

- *We practice a simplified Microservice Architecture (MSA)*
- *We design an API-centric MSA*
- API: *API calls follow RESTful architecture*
- Different origin: *Client and servers are not hosted on the same machine (HTML files and Node.js files are not in the same machine). Even services might not be hosted in the same machine.*
- Response: *Responses coming back from services are often in JSON format*

API-centric is the condition slide 7 set for the Django example: a service in another stack can be hooked up later only if the application was built around API calls from the start.

## Clients talk to the gateway, never to a service (slide 22)

Slide 22 repeats the five bullets beside a figure of two clouds: clients on the left, services on the right.

```diagram
{ "type": "layers", "title": "The slide 22 figure: two clouds", "nodes": [ { "id": "clients", "label": "Clients" }, { "id": "c1", "label": "Client scripts (HTML, AJAX)", "parent": "clients" }, { "id": "c2", "label": "Client scripts (HTML, AJAX)", "sub": "UAE", "parent": "clients" }, { "id": "services", "label": "services" }, { "id": "gw", "label": "API gateway", "parent": "services" }, { "id": "profile", "label": "user profile service", "sub": "USA · a pale file service behind it", "parent": "services" }, { "id": "inv", "label": "inventory service", "sub": "Korea · a pale \"...\" box behind it, Japan", "parent": "services" } ], "hi": ["gw"], "caption": "Client and servers are not hosted on the same machine; each service sits in its own cloud (slide 22's figure, its parts listed)." }
```

The arrows tell the story. A thick arrow labelled *AJAX API calls* runs from the client scripts to the API gateway, and one labelled *JSON* runs back. Orange double-headed arrows join the gateway to the user profile service and to the inventory service. No arrow joins a client to a service, and none joins two services.

```diagram
{ "type": "tree", "title": "Who calls whom", "nodes": [ { "id": "client", "label": "Client scripts (HTML, AJAX)", "sub": "AJAX API calls down, JSON back up" }, { "id": "gw", "label": "API gateway", "parent": "client" }, { "id": "profile", "label": "user profile service", "sub": "USA", "parent": "gw" }, { "id": "inv", "label": "inventory service", "sub": "Korea", "parent": "gw" } ], "caption": "All AJAX calls go to the API gateway, which talks to the services and returns JSON (the slide's figure, links only)." }
```

The gateway is the component slide 8 described under security: *the only portal being in touch with the outside world*, so *That gateway is the only place I need to secure*. The services behind it can move machines or change stacks without the client noticing.

```diagram
{ "type": "tree", "title": "One door to secure", "nodes": [ { "id": "client", "label": "Client scripts (HTML, AJAX)", "sub": "the outside world" }, { "id": "gw", "label": "API gateway", "sub": "the only place I need to secure", "parent": "client" }, { "id": "profile", "label": "user profile service", "sub": "USA", "parent": "gw" }, { "id": "inv", "label": "inventory service", "sub": "Korea", "parent": "gw" } ], "hi": ["gw"], "caption": "Slide 8: a single gateway to secure, not thousands of endpoints." }
```

### One request through the gateway

A clinic page asks for stock levels. Watch where the JSON is produced and who carries it back.

```diagram
{ "type": "sequence", "nodes": [ { "id": "c", "label": "Client script", "kind": "lane" }, { "id": "g", "label": "API gateway", "kind": "lane" }, { "id": "s", "label": "inventory service", "kind": "lane" } ], "edges": [ { "from": "c", "to": "g", "label": "AJAX API call (GET)" }, { "from": "g", "to": "s", "label": "API request" }, { "from": "s", "to": "g", "label": "result" }, { "from": "g", "to": "c", "label": "JSON" } ], "hi": ["1", "4"], "caption": "The slide's reading drawn: the client only ever sees the gateway." }
```

The microservices view of the comparison widget draws the same gateway figure with its pros and cons:

```widget
arch-compare
{ "pattern": "microservices" }
```

## What the course builds on this architecture (slides 23 and 24)

Slide 23:

1. Design and develop programs using REST, JSON and HTTP: the RESTful API architecture, HTTP methods (GET, POST, PUT etc), JSON *as a format to pass data back and forth*.
2. Design a simple web service: one that returns results to AJAX requests like `mydomain.com/API/Patients/1`.
3. Design and develop a RESTful API by applying the best practices and REST constraints, in a lab and the term project.
4. Document and write specifications, using swagger.

Slide 24:

1. Practice implementation of CRUD operations: a review of RDBMS, and **C**reate, **R**ead, **U**pdate and **D**elete operations on a database via API requests.
2. Implement error handling, HTTP status codes, secure API: *404, 303, 200, 505*, with messages such as Bad request, Unauthorized, Not found.
3. Apply change management and versioning of designed APIs.
4. Secure a backend API server: a simple token based approach, hashing using promises.

The slide's code list is loose. As standard HTTP: 404 is Not Found, 303 See Other (a redirect), 200 OK, 505 HTTP Version Not Supported; the three messages belong to 400, 401 and 404.

```diagram
{ "type": "grid", "title": "Versioning puts the version in the URL", "nodes": [ { "id": "h0", "label": "version", "row": 0, "col": 0 }, { "id": "h1", "label": "URL", "row": 0, "col": 1 }, { "id": "a0", "label": "none", "row": 1, "col": 0 }, { "id": "a1", "label": "mydomain.com/API/Patients/1", "row": 1, "col": 1 }, { "id": "b0", "label": "V1", "row": 2, "col": 0 }, { "id": "b1", "label": "mydomain.com/V1/API/Patients/1", "row": 2, "col": 1 }, { "id": "c0", "label": "V1.1", "row": 3, "col": 0 }, { "id": "c1", "label": "mydomain.com/V1.1/API/Patients/1", "row": 3, "col": 1 } ], "hi": ["b1", "c1"], "caption": "Slides 23 and 24: the same patient resource, unversioned and in two versions." }
```

## The rest of the term (slide 25)

Slide 25 adds, in order: working with web storage; private key/public key; asynchronous programming; practicing denial of service attack; how to design scalable applications; how oAuth works; installing SSL, which depends on the host provider.

Lab 3 Part 2, not the slides, applies this lecture: a short report on one company that moved from a monolith to microservices, with its gateway-and-services picture redrawn by hand, at least three of its services named, and its pros and cons. Companies such as those on slide 20 fit.

```quiz
[
  { "q": "In the course's architecture, where do client scripts send their AJAX API calls?", "options": ["To the API gateway", "Directly to the inventory service", "To every service at once", "To the user profile service, which forwards them"], "answer": 0, "explain": "Slide 22: the *AJAX API calls* arrow runs from the client scripts to the API gateway only. No arrow joins a client to a service." },
  { "q": "In what format do responses from the services usually come back (slide 21)?", "options": ["JSON", "HTML", "XML", "plain text"], "answer": 0, "explain": "*Responses coming back from services are often in JSON format*, and the figure's return arrow is labelled JSON." },
  { "q": "In the course's architecture, the HTML files and the Node.js files are hosted on the same machine.", "type": "tf", "answer": false, "explain": "Slide 21, different origin: *Client and servers are not hosted on the same machine (HTML files and Node.js files are not in the same machine).*" },
  { "q": "Slide 21: even the services might not be hosted in the same machine.", "type": "tf", "answer": true, "explain": "*Even services might not be hosted in the same machine.* The figure puts them in the USA, Korea and Japan." },
  { "q": "Which URL change on slide 24 shows API versioning?", "options": ["`mydomain.com/API/Patients/1` becoming `mydomain.com/V1.1/API/Patients/1`", "`mydomain.com/API/Patients/1` becoming `mydomain.com/API/Patients/2`", "`http://mydomain.com` becoming `https://mydomain.com`", "`mydomain.com/API/Patients/1` becoming `api.mydomain.com/Patients/1`"], "answer": 0, "explain": "Slide 24 puts the version in the path: `/V1/` and `/V1.1/` before `/API/`. Changing the id asks for another patient; the others change protocol or host." },
  { "q": "Fill in CRUD as slide 24 expands it.", "type": "fill", "code": "C = ___\nR = ___\nU = ___\nD = ___", "answer": ["Create", "Read", "Update", "Delete"], "explain": "Slide 24: Create, Read, Update and Delete operations on a database via API requests." },
  { "q": "Which tool does slide 23 name for documenting and writing specifications of an API?", "type": "text", "answer": ["swagger"], "explain": "Slide 23: *Document and write specifications*, using swagger." },
  { "q": "Why is the API gateway the component slide 8 says to secure?", "options": ["It is the only portal in touch with the outside world", "It stores the database", "It runs the client scripts", "It is the fastest service"], "answer": 0, "explain": "Slide 8: a gateway that is *the only portal being in touch with the outside world* is *the only place I need to secure*." },
  { "q": "Slide 21 says the course's API calls follow which architecture?", "options": ["RESTful", "monolithic", "n-tier", "event-driven"], "answer": 0, "explain": "*API calls follow RESTful architecture.* Monolithic and n-tier are the other patterns of the lecture; event-driven is only named on slide 15." }
]
```
