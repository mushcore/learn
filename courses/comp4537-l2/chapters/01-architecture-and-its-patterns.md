---
title: Monolithic, layered and microservice architectures
minutes: 18
---

A web app grows from 1,000 to 1,000,000 users, crashes daily and takes weeks to change. Lecture 2 blames the structure chosen before any code was written, and names three ways to choose it.

## Architecture is the decisions made before code (slides 4 and 5)

Slide 4's answer: nobody thought about architecture, *the structure that determines how components interact, scale, and evolve.* *Architecture is not code. It is the decisions you make before you write code.*

Slide 5 defines it: *Architecture refers to interaction/relation among components.* The same idea in three domains:

```diagram
{ "type": "grid", "title": "Interaction/relation among components", "nodes": [ { "id": "h0", "label": "domain", "row": 0, "col": 0 }, { "id": "h1", "label": "components", "row": 0, "col": 1 }, { "id": "h2", "label": "focus", "row": 0, "col": 2 }, { "id": "a0", "label": "building construction", "row": 1, "col": 0 }, { "id": "a1", "label": "walls, floors, stairs", "row": 1, "col": 1 }, { "id": "a2", "label": "space usage, flow, beauty, cost, style", "row": 1, "col": 2 }, { "id": "b0", "label": "computer architecture", "row": 2, "col": 0 }, { "id": "b1", "label": "CPU, Memory, Storage, I/O", "row": 2, "col": 1 }, { "id": "b2", "label": "speed, power usage, efficiency, computational power", "row": 2, "col": 2 }, { "id": "c0", "label": "web application", "row": 3, "col": 0 }, { "id": "c1", "label": "UI, Database, logic, etc", "row": 3, "col": 1 }, { "id": "c2", "label": "reliability, scalability, security, ease of implementation, modularity", "row": 3, "col": 2 } ], "hi": ["c2"], "caption": "Slide 5: in web application, focus is on reliability, scalability, security, ease of implementation, modularity." }
```

## Patterns let you weigh trade-offs before committing (slides 6 to 8)

Slide 6: patterns *help us evaluate trade-offs before committing to a design:*

1. Efficiency: which backend technology fits my constraints?
2. Cost of maintenance: how many developers and skill sets do I need?
3. Scalability: *can I handle 100x the users without a rewrite?*
4. Security: *is there a single gateway to secure, or thousands of endpoints?*
5. Modularity: can I update one feature without touching everything else?

Slide 7 widens the list to eight qualities: efficiency, robustness, security, performance, modularity, cost of maintenance, development and extension, cost of deployment. Slides 7 and 8 give an example for seven of them:

| quality | example |
|---|---|
| Efficiency | which backend technology gives a lightweight server? |
| Cost of maintenance | JavaScript and ASP .net need two developers; switching to nodejs needs one |
| Development and extension | a nodejs developer adds a service to a Django app via API, *only if my Django application is originally developed as an API-centric application* |
| Robustness | a single point of failure? how is the load distributed? what if the DB fails? |
| Security | a gateway that is *the only portal being in touch with the outside world*, so it is *the only place I need to secure* |
| Modularity | *each module/service must carry one main functionality* |
| Cost of deployment | Ruby on Rails may need a dedicated server; do we need docker? |

Slide 9 names the three architectures that matter, in order: Monolithic → Layered → Microservices.

## Monolithic: one deployable unit (slides 10, 11 and 19)

Slide 10: a one-server app has a critical bug in the payment module. The fix: *Shut down the entire application, fix the bug, potentially recompile everything, then redeploy.* Slide 11: *All application logic is bundled together in one deployable unit*, typically on one machine in one backend stack; slide 19's example is Java on one machine.

```diagram
{ "type": "layers", "title": "Monolithic", "nodes": [ { "id": "unit", "label": "one deployable unit", "sub": "one machine · one backend stack" }, { "id": "ui", "label": "UI", "parent": "unit" }, { "id": "biz", "label": "business rules", "parent": "unit" }, { "id": "data", "label": "data access", "parent": "unit" } ], "hi": ["unit"], "caption": "All application logic is bundled together in one deployable unit (slide 11; the slide's description drawn)." }
```

Adding a feature takes the steps of slides 11 and 19:

```diagram
{ "type": "flow", "dir": "tb", "title": "To add a new feature", "nodes": [ { "id": "s1", "label": "1- shut down entire application" }, { "id": "s2", "label": "2- add the new feature" }, { "id": "s3", "label": "3- (may need to) recompile everything" }, { "id": "s4", "label": "deploy" } ], "edges": [ { "from": "s1", "to": "s2" }, { "from": "s2", "to": "s3" }, { "from": "s3", "to": "s4" } ], "hi": ["s1"], "caption": "Even a one-module fix starts by shutting the whole application down (the slide's steps drawn)." }
```

Step 3 says *(may need to)*: recompiling is not always required. Slide 11's verdict: *Best for: prototyping, MVPs, apps that won't need frequent independent updates*. Slide 19's: *Simple to build and deploy but hard to scale and maintain as complexity grows.*

## Layered (n-tier): one responsibility per layer (slides 12 and 13)

Slide 12: to change the database without rewriting the UI, separate concerns into layers. Slide 13: *Layers = functional elements*, four of them, in this order:

```diagram
{ "type": "layers", "title": "Layered (n-Tier) Architecture", "nodes": [ { "id": "p", "label": "Presentation layer (UI layer)", "sub": "interaction with the end-user · e.g. form page" }, { "id": "b", "label": "Business layer (business logic)", "sub": "controls the application's logic · e.g. decision making, routing requests" }, { "id": "a", "label": "Application layer", "sub": "core functions of the app · e.g. libraries" }, { "id": "d", "label": "Data access layer", "sub": "access and retrieval of data · e.g. databases" } ], "hi": ["b"], "caption": "Layers = functional elements: presentation, business, application, data access (slide 13)." }
```

Routing requests is the business layer's example; libraries are the application layer's.

## Microservices: loosely coupled, independently deployable (slides 14, 18 and 20)

Slide 14, for teams that deploy independently: *Split the system into small, independent services. Each handles one function and communicates via API.* Its example: *If Facebook shuts down, Messenger can keep running*, because Messenger is a separate service.

Slide 18 calls the result *a collection of loosely coupled (almost independent) services*. A service that grows can become a stand-alone app, and *Each service can reside in a separate machine*, in its own stack. SOA (Service-Oriented Architecture) and MSA (Microservice Architecture) are *slightly different but refer the same thing in this course*. Slide 19: *Opposite to microservices is monolithic architecture*.

```diagram
{ "type": "tree", "title": "A bookstore as microservices", "nodes": [ { "id": "c", "label": "Client", "sub": "API calls" }, { "id": "pay", "label": "payments", "sub": "machine 1 · Node", "parent": "c" }, { "id": "search", "label": "search", "sub": "machine 2 · Python", "parent": "c" }, { "id": "acct", "label": "accounts", "sub": "machine 3 · Java", "parent": "c" } ], "caption": "Each service handles one function and communicates via API (slide 14; the slide's description drawn)." }
```

Slide 20: *A collection of loosely coupled, independently deployable services*.

| Pros | Cons |
|---|---|
| Update or fix one service without shutting everything down | Communication between services = many API calls → complexity increases |
| Each service = one function → assign separate teams, speed up development | Requires orchestration, monitoring, and careful API design |
| Each service can reside in a separate machine, use a different tech stack | |

Used by Uber, Netflix, Amazon, eBay, SoundCloud and Groupon.

```diagram
{ "type": "tree", "title": "One service down for a fix", "nodes": [ { "id": "c", "label": "Client", "sub": "API calls" }, { "id": "pay", "label": "payments", "sub": "down for a fix", "parent": "c" }, { "id": "search", "label": "search", "sub": "still running", "parent": "c" }, { "id": "acct", "label": "accounts", "sub": "still running", "parent": "c" } ], "hi": ["pay"], "caption": "Update or fix one service without shutting everything down (slide 20)." }
```

### One picture, three architectures

Switch the pattern; the pros and cons under the picture change with it.

```widget
arch-compare
{ "pattern": "monolithic" }
```

## Real products mix patterns (slide 15)

*Most large systems evolve and mix patterns*: Netflix went Monolithic → Microservices → Event-driven + CQRS; Uber went Monolithic Rails → Microservices for maps, payments, ride matching. Other patterns are only named: Event-Driven, Serverless, MVC, MVVM, Hexagonal, CQRS.

## Reliable, robust, resilient (slide 16)

```diagram
{ "type": "grid", "title": "Three words that sound alike", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "definition", "row": 0, "col": 1 }, { "id": "h2", "label": "slide example", "row": 0, "col": 2 }, { "id": "h3", "label": "memory aid", "row": 0, "col": 3 }, { "id": "a0", "label": "Reliability", "row": 1, "col": 0 }, { "id": "a1", "label": "works correctly and consistently under normal conditions", "row": 1, "col": 1 }, { "id": "a2", "label": "a banking API returns balances for almost every valid request", "row": 1, "col": 2 }, { "id": "a3", "label": "works normally", "row": 1, "col": 3 }, { "id": "b0", "label": "Robustness", "row": 2, "col": 0 }, { "id": "b1", "label": "handles bad input or unexpected conditions safely", "row": 2, "col": 1 }, { "id": "b2", "label": "invalid JSON returns 400 Bad Request; the API does not crash", "row": 2, "col": 2 }, { "id": "b3", "label": "handles bad conditions", "row": 2, "col": 3 }, { "id": "c0", "label": "Resilience", "row": 3, "col": 0 }, { "id": "c1", "label": "continues essential service or recovers after disruption", "row": 3, "col": 1 }, { "id": "c2", "label": "recommendations fail; the store still lets users search, add to cart and pay", "row": 3, "col": 2 }, { "id": "c3", "label": "survives and recovers from failure", "row": 3, "col": 3 } ], "hi": ["b2", "c2"], "caption": "Slide 16: Reliable = works normally; Robust = handles bad conditions; Resilient = survives and recovers from failure." }
```

```quiz
[
  { "q": "In a web application, what does architecture focus on (slide 5)?", "options": ["reliability, scalability, security, ease of implementation, modularity", "speed, power usage, efficiency, computational power", "space usage, flow, beauty, cost, style", "HTML, CSS, JavaScript, Node.js"], "answer": 0, "explain": "Slide 5's emphasised line. Speed and power usage are the focus of computer architecture; space usage, flow and beauty of building construction." },
  { "q": "Slide 4: architecture is the code you write first, before any decisions are made.", "type": "tf", "answer": false, "explain": "Reversed. *Architecture is not code. It is the decisions you make before you write code.*" },
  { "q": "Put the layers of the n-tier architecture in the slide's order, top to bottom.", "type": "reorder", "lines": ["Presentation layer (UI layer)", "Business layer (business logic)", "Application layer", "Data access layer"], "explain": "Slide 13: presentation (form page), business (decision making, routing requests), application (libraries), data access (databases)." },
  { "q": "Which layer's example on slide 13 is routing requests?", "options": ["Business layer", "Presentation layer", "Application layer", "Data access layer"], "answer": 0, "explain": "The business layer *controls the application's logic (e.g. decision making, routing requests)*. Libraries are the application layer's example, a form page the presentation layer's, databases the data access layer's." },
  { "q": "Which is a con of microservices on slide 20?", "options": ["Requires orchestration, monitoring, and careful API design", "Update or fix one service without shutting everything down", "Each service can reside in a separate machine, use a different tech stack", "Each service = one function, so separate teams can speed up development"], "answer": 0, "explain": "Slide 20 has two cons: many API calls increase complexity, and the need for orchestration, monitoring and careful API design. The other three options are its pros." },
  { "q": "An API receives a malformed JSON body and answers 400 Bad Request without crashing. Which quality does slide 16 call this?", "options": ["Robustness", "Reliability", "Resilience", "Modularity"], "answer": 0, "explain": "Robustness *handles bad input or unexpected conditions safely*; this is the slide's own example. Resilience is about surviving a failed part; reliability about normal conditions." },
  { "q": "To add a feature to a monolith, step 3 always recompiles everything.", "type": "tf", "answer": false, "explain": "Slides 11 and 19: *(may need to)* recompile everything before deployment. Shutting the entire application down (step 1) is the unconditional step." },
  { "q": "What does the course say about SOA and MSA (slide 18)?", "options": ["Slightly different, but they refer to the same thing in this course", "SOA is the monolithic pattern and MSA the layered one", "They are opposites", "MSA is the course's name for the n-tier architecture"], "answer": 0, "explain": "Slide 18: SOA = Service-Oriented Architecture, MSA = Microservice Architecture, *slightly different but refer the same thing in this course*. The opposite of microservices is monolithic (slide 19)." },
  { "q": "A small team needs a prototype MVP that will rarely get independent updates. Which architecture does slide 11 recommend?", "options": ["Monolithic", "Microservices", "Layered with four separate machines", "Event-driven + CQRS"], "answer": 0, "explain": "Slide 11: monolithic is *Best for: prototyping, MVPs, apps that won't need frequent independent updates*." },
  { "type": "free", "q": "Compare monolithic and microservice architecture.", "model": "A monolith bundles all application logic (UI, business logic, data access) in one deployable unit, usually on one machine in one backend stack; fixing or adding anything means shutting down the entire application, changing it, possibly recompiling everything and redeploying. It is simple to build and deploy and best for prototypes and MVPs, but hard to scale and maintain as it grows. Microservices are a collection of loosely coupled, independently deployable services, each with one function, communicating via API; one service can be updated or fixed without shutting everything down, and each can live on its own machine in its own tech stack with its own team. The cost is many API calls (more complexity) and the need for orchestration, monitoring and careful API design.", "points": ["monolith = one deployable unit; microservices = loosely coupled, independently deployable services", "monolith fix needs the whole app shut down; a microservice is updated alone", "monolith on one machine and stack; services on separate machines and stacks", "microservices cost many API calls, orchestration and monitoring", "monolith is simple and best for prototypes/MVPs but hard to scale"], "rows": 6, "explain": "Slides 11, 19 and 20. Name the definition of each, the update story, the machines and stacks, and one con of each." }
]
```
