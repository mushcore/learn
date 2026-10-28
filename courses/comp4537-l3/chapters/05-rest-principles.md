---
title: REST's five constraints and the microservice gateway
minutes: 18
---

Slide 44 asks *What is RESTful API?* and answers *It's service follows RESTful Architectural style*. That style is a list of rules an API server keeps, and microservices are one way to build the server behind it.

<!-- facts: slide 44 RESTful API; slide 45 REST, style, stateless scale, data preparation and consumption, microservices; slide 46 small single functionality, different languages; slide 47 diagram and five remarks; slide 48 not a pattern, set of constraints, API calls; slide 49 five principles; slides 50-52 principle, benefit, example each; slide 53 six benefits with Code-on-Demand; slide 54 resources -->

## REST is a style, not a pattern (slides 45 and 48)

*REST: Representational State Transfer architectural design*. It *Is an architectural style*: the slide promises to show *how this stateless model helps applications to scale easily* and *how it separates data preparation and data consumption.*

Slide 48 draws the line: *REST is not an architectural pattern like Microservices or MVC.* *Instead, it's an architectural style or set of constraints for API communication between systems.* Inside a pattern, components *usually happen via API calls* to talk. The slide asks how else; worked out: direct function calls in one program, a shared database, or message queues.

## Microservices each do one task (slides 45 and 46)

Microservices are *a way of implementing the backend of RESTful API servers*: *splitting the core components into small and independent pieces called Microservice that simply do a single task.* *The Microservices communicate via RESTful API calls*. Because the components *aren't directly dependent on each other*, *they don't necessitate to be built using the same programming language*, and developers *are free to pick up a technology stack of choice*.

## Every request goes through the API gateway (slide 47)

```diagram
{ "type": "flow", "title": "Example: Micro-service architecture diagram", "nodes": [ { "id": "c", "label": "Client Apps", "sub": "Main Web App, Online Tests, Online Forum, Mobile App, Paper-based tests, Event management, …" }, { "id": "g", "label": "API Gateway", "sub": "Single Entry point: Security · Routing · Audit · Localization · …" }, { "id": "s", "label": "RESTful Micro Services", "sub": "Authentication, Payment processing, Profile, Scheduling, User Calendar, Reporting, Recommendation, Prerequisites, Notification, …" } ], "edges": [ { "from": "c", "to": "g", "label": "Client Specific APIs" }, { "from": "g", "to": "s", "label": "Protocol Translation" } ], "hi": ["g"], "caption": "Every request goes through API gateway; arrows show the request direction (the slide's are double-headed)." }
```

The slide's remarks:

1. *Services communicate via API calls*
2. *Every request goes through API gateway*
3. *Gateway is responsible for routing, authentication, Auditing etc*
4. *Client specific APIs are the one published to developers*
5. *Each microservice could be developed in a different technology stack and could be hosted in a server geographically separated from other services.*

```diagram
{ "type": "flow", "title": "Example: Micro-service architecture diagram", "nodes": [ { "id": "c", "label": "Client Apps", "sub": "Main Web App, Online Tests, Online Forum, Mobile App, Paper-based tests, Event management, …" }, { "id": "g", "label": "API Gateway", "sub": "Single Entry point: Security · Routing · Audit · Localization · …" }, { "id": "s", "label": "RESTful Micro Services", "sub": "Authentication, Payment processing, Profile, Scheduling, User Calendar, Reporting, Recommendation, Prerequisites, Notification, …" } ], "edges": [ { "from": "c", "to": "g", "label": "published APIs" }, { "from": "g", "to": "s", "label": "Protocol Translation" } ], "hi": ["c>g"], "caption": "Remark 4: the Client Specific APIs, labelled published on the slide, are the ones developers see." }
```

The slide asks which application this is, an online store or a CRM. Worked out: Online Tests, Paper-based tests, Prerequisites and Scheduling point to the educational application slide 2 names.

## The five constraints (slide 49)

1. *Client–Server*
2. *Stateless*
3. *Cacheable*
4. *Uniform Interface (core constraint)*
5. *Layered System*

**Client–Server** (slide 50): *Separation of concerns — the client handles the user interface/experience, and the server manages data and business logic.* It improves portability and scalability. Example: GitHub's web app, mobile app and CLI clients *all consume the same server APIs.*

**Stateless**: *Each request contains all the info needed; server doesn't store session state.* A book API that has just served page 50 cannot answer *"give me the next page."*

```diagram
{ "type": "sequence", "title": "Stateless: name the page", "nodes": [ { "id": "c", "label": "client", "kind": "lane" }, { "id": "s", "label": "API server", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "give me page 50" }, { "from": "s", "to": "c", "label": "page 50" }, { "from": "c", "to": "s", "label": "give me the next page" }, { "from": "s", "to": "c", "label": "I don't keep track of previous requests" }, { "from": "c", "to": "s", "label": "give me page 51" }, { "from": "s", "to": "c", "label": "page 51" } ], "hi": ["3", "4"], "caption": "The server should respond: I don't keep track of previous requests — you must tell me which page you want." }
```

The echo server keeps nothing between requests either, so each request names its page:

```js run
function getPage(n) {
  return fetch(SERVER + "/api/echo?page=" + n)
    .then(function (res) { return res.json(); })
    .then(function (data) { console.log("server got page " + data.query.page); });
}
getPage(50).then(function () { return getPage(51); });
```

It prints `server got page 50`, then `server got page 51`.

**Cacheable**: the server *must define if a response is cacheable or not (via HTTP headers like Cache-Control, ETag, Expires)*; then *the client or intermediaries (like browsers, CDNs, reverse proxies) can cache the response and reuse it.*

## Uniform Interface is the core constraint (slide 51)

- *Resource Identification via URIs → Each resource has a unique URL (e.g., /users/123).*
- *Manipulation through Representations → Resources are manipulated via JSON/XML representations.*
- *Self-Descriptive Messages → Requests and responses include metadata (e.g., HTTP verbs, headers).*
- *HATEOAS (Hypermedia as the Engine of Application State) → Responses include links for discoverability.*

Its benefit: *Simplifies interactions and makes APIs predictable.* *Nouns (resources) are always in the URL.* *Verbs (actions) are always HTTP methods (GET, POST, PUT, DELETE)*.

```diagram
{ "type": "tree", "title": "Uniform Interface: nouns in the URL", "nodes": [ { "id": "r", "label": "/" }, { "id": "u", "label": "/users/octocat", "sub": "GET: a user", "parent": "r" }, { "id": "ur", "label": "/users/octocat/repos", "sub": "GET: that user's repos", "parent": "u" }, { "id": "p", "label": "/repos/octocat/hello-world", "sub": "GET: a specific repo", "parent": "r" }, { "id": "i", "label": "/repos/{owner}/{repo}/issues", "sub": "links: close, comment, assign", "parent": "p" } ], "hi": ["i"], "caption": "Nouns (resources) are always in the URL." }
```

HATEOAS means a response carries links to the related resources and the next allowed actions, so a client follows links instead of hard-coding URLs. An illustration written for this lesson, not from the slide:

```json
{
  "id": 7,
  "status": "open",
  "links": [
    { "rel": "self", "href": "/orders/7", "method": "GET" },
    { "rel": "cancel", "href": "/orders/7/cancel", "method": "POST" }
  ]
}
```

## Layered System (slide 52)

*The system can be composed of multiple layers (e.g., client, proxy, gateway, server). Clients don't know if they are talking to the origin server or an intermediary.* Benefit: *flexibility, scalability, and security. Enables CDNs, load balancers, and gateways without changing the client.*

```diagram
{ "type": "layers", "title": "Layered System", "nodes": [ { "id": "c", "label": "client" }, { "id": "p", "label": "proxy", "parent": "c" }, { "id": "g", "label": "gateway", "sub": "AWS API Gateway: routing, throttling, security", "parent": "p" }, { "id": "s", "label": "server", "parent": "g" } ], "hi": ["g"], "caption": "Clients don't know if they are talking to the origin server or an intermediary." }
```

## Six benefits (slide 53)

```diagram
{ "type": "grid", "title": "Benefits to making our API server RESTful", "nodes": [ { "id": "h0", "label": "constraint", "row": 0, "col": 0 }, { "id": "h1", "label": "benefit", "row": 0, "col": 1 }, { "id": "h2", "label": "example", "row": 0, "col": 2 }, { "id": "a0", "label": "Client–Server", "row": 1, "col": 0 }, { "id": "a1", "label": "separation & evolvability", "row": 1, "col": 1 }, { "id": "a2", "label": "GitHub", "row": 1, "col": 2 }, { "id": "b0", "label": "Stateless", "row": 2, "col": 0 }, { "id": "b1", "label": "scalability & reliability", "row": 2, "col": 1 }, { "id": "b2", "label": "Netflix", "row": 2, "col": 2 }, { "id": "c0", "label": "Cacheable", "row": 3, "col": 0 }, { "id": "c1", "label": "performance & efficiency", "row": 3, "col": 1 }, { "id": "c2", "label": "Twitter", "row": 3, "col": 2 }, { "id": "d0", "label": "Uniform Interface", "row": 4, "col": 0 }, { "id": "d1", "label": "simplicity & predictability", "row": 4, "col": 1 }, { "id": "d2", "label": "GitHub API", "row": 4, "col": 2 }, { "id": "e0", "label": "Layered System", "row": 5, "col": 0 }, { "id": "e1", "label": "flexibility & security", "row": 5, "col": 1 }, { "id": "e2", "label": "AWS API Gateway", "row": 5, "col": 2 }, { "id": "f0", "label": "Code-on-Demand (sixth, optional)", "row": 6, "col": 0 }, { "id": "f1", "label": "extensibility", "row": 6, "col": 1 }, { "id": "f2", "label": "Web apps delivering JavaScript", "row": 6, "col": 2 } ], "hi": ["f0"], "caption": "Slide 53 answers slide 49's question and adds Code-on-Demand." }
```

Code-on-Demand: the server sends JavaScript for the browser to run, as every page of this app does. Fielding's REST has six constraints, and Code-on-Demand is the only optional one; slide 49 lists five.

```quiz
[
  { "q": "Put REST's constraints in slide 49's order.", "type": "reorder", "lines": ["Client–Server", "Stateless", "Cacheable", "Uniform Interface", "Layered System"], "explain": "Slide 49: *1. Client–Server*, *2. Stateless*, *3. Cacheable*, *4. Uniform Interface (core constraint)*, *5. Layered System*." },
  { "q": "Slide 48: REST is an architectural pattern like Microservices or MVC.", "type": "tf", "answer": false, "explain": "*REST is not an architectural pattern like Microservices or MVC.* It is *an architectural style or set of constraints for API communication between systems.*" },
  { "q": "Which constraint does slide 49 call the core constraint?", "options": ["Uniform Interface", "Stateless", "Client–Server", "Layered System"], "answer": 0, "explain": "*4. Uniform Interface (core constraint)*." },
  { "q": "A recipe API answers `GET /recipes?page=3` and then accepts a request that just says \"next\". Which constraint does that break?", "options": ["Stateless", "Cacheable", "Layered System", "Client–Server"], "answer": 0, "explain": "To answer \"next\" the server must remember the last page, which is session state. Slide 50: *Each request contains all the info needed; server doesn't store session state.*" },
  { "q": "Which headers does slide 50 name for marking a response cacheable?", "options": ["Cache-Control, ETag, Expires", "Content-Type, Content-Length, Host", "Origin, Referer, Cookie", "Access-Control-Allow-Origin, Accept, Connection"], "answer": 0, "explain": "Cacheable: *via HTTP headers like Cache-Control, ETag, Expires*." },
  { "q": "Match each constraint to its benefit on slide 53.", "type": "match", "pairs": [["Client–Server", "separation & evolvability"], ["Stateless", "scalability & reliability"], ["Cacheable", "performance & efficiency"], ["Uniform Interface", "simplicity & predictability"], ["Layered System", "flexibility & security"]], "explain": "Slide 53's mapping, with the examples GitHub, Netflix, Twitter, GitHub API and AWS API Gateway. Code-on-Demand gives extensibility." },
  { "q": "In slide 47's microservice diagram, every request goes through the what?", "options": ["API gateway", "client app", "database server", "authentication microservice"], "answer": 0, "explain": "Remark 2: *Every request goes through API gateway*, the *Single Entry point*; remark 3 makes it *responsible for routing, authentication, Auditing etc*." },
  { "q": "Write out what REST stands for.", "type": "text", "answer": ["Representational State Transfer"], "explain": "Slide 45: *REST: Representational State Transfer architectural design*." },
  { "q": "Which item appears on slide 53's benefits list but not among slide 49's five?", "options": ["Code-on-Demand", "Layered System", "Cacheable", "Uniform Interface"], "answer": 0, "explain": "*Code-on-Demand → extensibility (Web apps delivering JavaScript)*. In Fielding's REST it is the sixth and only optional constraint." },
  { "type": "free", "q": "Name REST's five constraints and give one example of each.", "model": "1. Client–Server: the client handles the UI and the server the data and logic, e.g. GitHub's web, mobile and CLI clients use the same server APIs. 2. Stateless: each request carries all the info, e.g. the client asks for page 51, not the next page. 3. Cacheable: the server marks responses cacheable with Cache-Control, ETag or Expires so browsers and CDNs reuse them. 4. Uniform Interface: each resource has a unique URL with nouns in the URL and HTTP methods as the verbs, e.g. GET /users/octocat. 5. Layered System: clients cannot tell a gateway or CDN from the origin server, e.g. AWS API Gateway.", "points": ["Client–Server with an example such as GitHub's web/mobile/CLI clients", "Stateless with the page number in every request", "Cacheable with Cache-Control/ETag/Expires", "Uniform Interface: resource URLs, nouns in the URL, HTTP verbs", "Layered System with a gateway or CDN the client does not see"], "rows": 8, "explain": "Slides 49 to 52: each constraint's principle and example." }
]
```
