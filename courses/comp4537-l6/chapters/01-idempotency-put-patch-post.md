---
title: PUT replaces, PATCH updates, and only PUT is idempotent
minutes: 12
---

Two requests can carry the same data and still do different things to a server: one replaces a record, one changes a field, one creates something new every time it arrives. Lecture 6 opens with that review before it turns to promises.

<!-- facts: slide 2 outline; slide 3 resource, verbs, PUT vs PATCH, PUT idempotent POST not, idempotent box; slide 54 GET vs POST request and response size -->

## The lecture's eight parts (slide 2)

Slide 2 lists the lecture in order: *Review*, *Asynch operations*, *Promises in JS*, *Promise status*, *.catch() and .finally()*, *In class activity*, *remarks on response size of GET vs POST requests*, and *W3Schools website seems inaccurate*. The chapters of this module follow the same path, with the output-order examples split over two lessons.

## Every request has a verb (slide 3)

The slide points at `myDomain.com/api/customers` and labels it a *resource*. The URL names the thing; the method says what to do with it: *Every http request has a verb or method that determines its intention*. The four the slide lists are *GET,PUT,DELETE,POST*.

```diagram
{ "type": "flow", "title": "One resource, four verbs", "nodes": [ { "id": "c", "label": "client" }, { "id": "v", "label": "GET, PUT, DELETE or POST", "sub": "the intention" }, { "id": "r", "label": "myDomain.com/api/customers", "sub": "resource", "kind": "pill" } ], "edges": [ { "from": "c", "to": "v" }, { "from": "v", "to": "r" } ], "hi": ["r"], "caption": "Every http request has a verb or method that determines its intention." }
```

Two of the verbs both change a stored object, and the slide separates them:

- *PUT: replacing an object entirely with something new*
- *PATCH: updating only a property of an object*

A PUT carries the whole record and the server stores exactly that, so any field the request leaves out is gone. A PATCH carries only the field that changes; every other field stays as it was.

## PUT is idempotent, POST is not (slide 3)

The blue box on the slide defines the word: *Idempotent: can be applied multiple times without changing the result*. Then the rule:

*PUT is idempotent, POST is not*: *calling PUT once or several times successively has the same effect (that is no side effect), whereas successive identical POST requests may have additional effects, e.g. leading to placing an order several times.*

The lesson's own example is a clinic. A PUT of patient 7's whole record, sent twice because the first reply was slow, leaves one record holding the same data. A POST that books an appointment, sent twice, books two.

```diagram
{ "type": "sequence", "title": "The same request twice", "nodes": [ { "id": "c", "label": "client", "kind": "lane" }, { "id": "s", "label": "server", "kind": "lane" }, { "id": "d", "label": "record store", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "PUT /patients/7" }, { "from": "s", "to": "d", "label": "store record 7" }, { "from": "c", "to": "s", "label": "PUT /patients/7" }, { "from": "s", "to": "d", "label": "same record 7" }, { "from": "c", "to": "s", "label": "POST /appointments" }, { "from": "s", "to": "d", "label": "appointment 1" }, { "from": "c", "to": "s", "label": "POST /appointments" }, { "from": "s", "to": "d", "label": "appointment 2" } ], "hi": ["3", "4"], "caption": "Calling PUT once or several times successively has the same effect." }
```

```diagram
{ "type": "sequence", "title": "The same request twice", "nodes": [ { "id": "c", "label": "client", "kind": "lane" }, { "id": "s", "label": "server", "kind": "lane" }, { "id": "d", "label": "record store", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "PUT /patients/7" }, { "from": "s", "to": "d", "label": "store record 7" }, { "from": "c", "to": "s", "label": "PUT /patients/7" }, { "from": "s", "to": "d", "label": "same record 7" }, { "from": "c", "to": "s", "label": "POST /appointments" }, { "from": "s", "to": "d", "label": "appointment 1" }, { "from": "c", "to": "s", "label": "POST /appointments" }, { "from": "s", "to": "d", "label": "appointment 2" } ], "hi": ["7", "8"], "caption": "Successive identical POST requests may have additional effects." }
```

### A clinic's records handled three ways

The program below is a model of a server, not a real one: an object of patients and an array of appointments, with one function per verb. Each request is sent twice.

```js run pin clinicVerbs.js
// predict: Write the three lines this prints.
const patients = { 7: { name: "Ana Diaz", phone: "604-555-0101", clinic: "Burnaby" } };
const appointments = [];

function put(id, record) { patients[id] = record; }               // replace entirely
function patch(id, field, value) { patients[id][field] = value; } // one property
function post(appt) { appointments.push(appt); }                  // create a new one

patch(7, "phone", "604-555-0123");
patch(7, "phone", "604-555-0123");
console.log(JSON.stringify(patients[7]));

put(7, { name: "Ana Diaz", phone: "604-555-0199" });
put(7, { name: "Ana Diaz", phone: "604-555-0199" });
console.log(JSON.stringify(patients[7]));

post({ patient: 7, time: "10:30" });
post({ patient: 7, time: "10:30" });
console.log(appointments.length);
```

```output
{"name":"Ana Diaz","phone":"604-555-0123","clinic":"Burnaby"}
{"name":"Ana Diaz","phone":"604-555-0199"}
2
```

`patients[id][field] = value` touches one property, so the clinic survives the PATCH. `patients[id] = record` swaps the whole object, so the PUT's record has no clinic and the field is gone; sending it a second time changes nothing. `appointments.push(appt)` adds an entry on every call, so two identical POSTs leave two appointments.

Slide 3 does not classify PATCH. Setting a field to a value, as here, gives the same result twice; a PATCH that adds 1 to a visit count would not.

## No standard limit on response size (slide 54)

Slide 54 recalls lecture 3: *there is a limitation on data size being sent over a single GET request. However, there is no such limitation on POST request*. Its question is about the other direction, the responses. The answer: *There are no standardized limitations on the size of responses for GET or POST requests specified by the HTTP protocol.* What does limit them in practice is *server configurations, network constraints, or browser limitations*.

```diagram
{ "type": "grid", "title": "Request and response size", "nodes": [ { "id": "h0", "label": "", "row": 0, "col": 0 }, { "id": "h1", "label": "request size", "row": 0, "col": 1 }, { "id": "h2", "label": "response size", "row": 0, "col": 2 }, { "id": "g0", "label": "GET", "row": 1, "col": 0 }, { "id": "g1", "label": "limited", "row": 1, "col": 1 }, { "id": "g2", "label": "no standardized limit", "row": 1, "col": 2 }, { "id": "p0", "label": "POST", "row": 2, "col": 0 }, { "id": "p1", "label": "no such limitation", "row": 2, "col": 1 }, { "id": "p2", "label": "no standardized limit", "row": 2, "col": 2 } ], "hi": ["g2", "p2"], "caption": "Slide 54: only the GET request is limited; neither response is." }
```

The GET request limit is itself practical rather than part of HTTP: a GET puts its data in the URL, and browsers and servers cap URL length.

```quiz
[
  {
    "q": "POST is idempotent, PUT is not.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 3 says the reverse: *PUT is idempotent, POST is not*. Repeating a PUT stores the same object again; repeating a POST may have additional effects, such as placing an order several times."
  },
  {
    "q": "Which method does slide 3 describe as *updating only a property of an object*?",
    "options": ["PATCH", "PUT", "POST", "DELETE"],
    "answer": 0,
    "explain": "PATCH updates only a property. PUT is *replacing an object entirely with something new*; POST is the verb that is not idempotent; DELETE removes the resource."
  },
  {
    "q": "Name the property the slide defines as *can be applied multiple times without changing the result*.",
    "type": "text",
    "answer": ["idempotent", "idempotency", "idempotence"],
    "explain": "The blue box on slide 3: *Idempotent: can be applied multiple times without changing the result*. PUT has it; POST does not."
  },
  {
    "q": "A bookstore's admin page sends the complete, edited record for book 31 to `/api/books/31` so that it replaces the stored one. Which method fits?",
    "options": ["PUT", "PATCH", "POST", "GET"],
    "answer": 0,
    "explain": "Sending the whole object to replace the stored one is *replacing an object entirely with something new*: PUT. PATCH would send only the changed field; POST creates a new resource; GET only reads."
  },
  {
    "q": "A customer double-clicks the Place order button and the browser sends the same request twice. Two orders appear. Which method was the request most likely using?",
    "options": ["POST", "PUT", "GET", "PATCH setting the quantity"],
    "answer": 0,
    "explain": "Slide 3: *successive identical POST requests may have additional effects, e.g. leading to placing an order several times.* A repeated PUT or GET leaves the same result, and a PATCH that sets a field to a value does too."
  },
  {
    "q": "According to slide 54, what limits the size of a response to a GET or a POST request?",
    "options": [
      "No standardized limit in HTTP; only practical limits such as server configuration, network and browser",
      "The same URL-length limit as a GET request",
      "GET responses are limited, POST responses are not",
      "Both are limited to the size of the request that asked for them"
    ],
    "answer": 0,
    "explain": "*There are no standardized limitations on the size of responses for GET or POST requests specified by the HTTP protocol.* Practical limits come from *server configurations, network constraints, or browser limitations*. The request-size difference is a GET request thing only."
  },
  {
    "q": "Slide 54 states that there is a limitation on data size being sent over a single GET request, but no such limitation on a POST request.",
    "type": "tf",
    "answer": true,
    "explain": "True as the slide puts it. The cause is practical: a GET carries its data in the URL, and browsers and servers cap URL length. HTTP itself sets no number."
  },
  {
    "q": "On slide 3, what is `myDomain.com/api/customers` labelled?",
    "options": ["a resource", "a verb", "a method", "an endpoint handler"],
    "answer": 0,
    "explain": "The blue callout labels the URL a *resource*. The verb or method (GET, PUT, DELETE, POST) is what *determines its intention*."
  },
  {
    "type": "free",
    "q": "Explain what idempotent means, using PUT and POST as the examples.",
    "model": "Idempotent: *can be applied multiple times without changing the result*. PUT replaces an object entirely, so calling it once or several times successively has the same effect. POST is not idempotent: successive identical POST requests may have additional effects, for example placing an order several times.",
    "points": [
      "idempotent = applied many times, same result as once",
      "PUT replaces the whole object, so repeating it stores the same thing",
      "repeated identical POSTs can add effects",
      "an example such as an order placed twice"
    ],
    "rows": 4,
    "explain": "Slide 3's definition and its PUT vs POST sentence."
  }
]
```
