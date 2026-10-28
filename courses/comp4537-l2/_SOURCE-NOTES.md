# COMP 4537 Lecture 2 — "Adv Web Dev Architecture, Lecture 2": web architectural patterns, JSON, localStorage

Source file: `D:/BCIT/COMP4537/raw/COMP4537-Lecture2 Web Architectural Pattern JSON LocalStorage 15sept2026.pdf` (45 pages; text layer in `D:/BCIT/COMP4537/txt/COMP4537-Lecture2 Web Architectural Pattern JSON LocalStorage 15sept2026.txt`, rendered pages in `D:/BCIT/COMP4537/png/L2/p001.png` … `p045.png`). Transcribed 2026-10-27.
Instructor: Amir Amintabar, PhD. Deck marked "(updated Sep 15 2026)".

Summary: the deck defines internet software architecture as the interaction/relation among components and argues for studying architectural patterns before coding (efficiency, maintenance cost, development and extension, robustness, security, modularity, deployment cost). It contrasts three architectures — Monolithic, Layered (n-Tier, four layers) and Microservices — with pros, cons, and a reliability/robustness/resilience Q&A, then presents the course's own architecture: a simplified, API-centric Microservice Architecture (MSA) in which client scripts make AJAX API calls to an API gateway that fronts services hosted in different places (Korea, USA, Japan; a second client in UAE), with RESTful calls and JSON responses. It lists the course outcomes (REST/JSON/HTTP, CRUD via API, status codes, versioning, token security, swagger, web storage, OAuth, DoS, SSL). Section 3 covers JSON serialize/deserialize (`JSON.stringify` / `JSON.parse`). Section 4 covers HTML Web Storage: localStorage vs sessionStorage, the localStorage API, storing objects via JSON, a writer.html / reader.html pair sharing data by origin, the Chrome DevTools Application tab, and six Q&A slides on where data should live (cart across devices, refresh ≠ proof of localStorage, dark-mode preference, passwords, auth tokens).

Conventions: slide numbers are PDF pages. Each section divider and most content slides carry an orange circle with the section number (1–4); it is not repeated below. "Q:" slides have a green "Q:" label and a blue "A:" label; the answer text is printed on the slide in every case in this deck. Slide 17 is a blank white page. Slides 35 and 39 are identical.

## Title and outline (slides 1–2)
- **Slide 1** (title): "Adv Web Dev Architecture" / "Lecture 2 (updated Sep 15 2026)" / "Amir Amintabar, PhD".
- **Slide 2, "Outline"**:
  - **What is internet software architecture?** (bold)
    - Three architectures that matter: Monolithic, Layered, Microservices
    - The architecture we focus on: API-centric, service-based
  - **JSON as a data payload in API communications** (bold)
  - **HTML Web Storage (localStorage)** (bold)
    - Connecting it all: storing objects in the browser using JSON + localStorage

## Section 1: What is Internet Software Architecture? (slides 3–8)
- **Slide 3** (section divider, circle "1"): "What is Internet Software Architecture?"
- **Slide 4** (Q&A):
  - Q: "Your startup built a web app. Users went from 1,000 to 1,000,000. The app crashes daily. Features take weeks to add. What went wrong?"
  - A: "Nobody thought about architecture — the structure that determines how components interact, scale, and evolve."
    "Architecture is not code. It is the decisions you make before you write code."
- **Slide 5, "What is Internet Software Architecture?"**
  - **Architecture refers to interaction/relation among components.** (bold)
  - In building construction: interaction/relation among walls, floors, stairs
    - Focus is on space usage, flow, beauty, cost, style
  - In computer architecture: interaction/relation among CPU, Memory, Storage, I/O
    - Focus is on speed, power usage, efficiency, computational power
  - In web application: interaction/relation among UI, Database, logic, etc
    - **Focus is on reliability, scalability, security, ease of implementation, modularity** (bold, blue — the emphasised line)
- **Slide 6** (Q&A):
  - Q: "Why should we study architectural patterns before writing code?"
  - A: "They help us evaluate trade-offs before committing to a design:"
    - Efficiency — which backend technology fits my constraints?
    - Cost of maintenance — how many developers and skill sets do I need?
    - Scalability — can I handle 100x the users without a rewrite?
    - Security — is there a single gateway to secure, or thousands of endpoints?
    - Modularity — can I update one feature without touching everything else?
- **Slide 7** (no title; bullets, key words bold):
  - "Architectural patterns help us better evaluate the efficiency , robustness, security, performance, modularity, cost of maintenance, development and extension, cost of deployment  our designed application:" (sic — "deployment  our", a word such as "of" is missing)
  - "**Efficiency** (e.g. I am looking for a lightweight server, what backend technology works for me),"
  - "Cost of **maintenance** (e.g. my application is written in JavaScript and ASP .net, I need two developers. If I switch to nodejs I only need one developer good at JavaScript)"
  - "**Development and extension** (e.g. my client wants me to add this new module to Django , but my Python developer left my company. Can I ask my nodejs guy to create a service and hook it up to Django via API? The answer is yes only if my Django application is originally developed as an API-centric application)"
- **Slide 8** (no title, continued):
  - "**Robustness** ( e.g. is there a single point of failure in my design? How the requests' load is distributed among modules. What if the DB fails)"
  - "**Security** ( e.g. how easy I can improve the security? Should I look into every single line of my code, or there is a gateway component I originally designed which is the only portal being in touch with the outside world. That gateway is the only place I need to secure)"
  - "**Modularity** ( e.g. each module/service must carry one main functionality)"
  - "Cost of deployment ( e.g. do we need a dedicated server? If we use Ruby on Rails, perhaps we need a dedicated sever. Do we need docker?)" (sic, "sever")

## Section 2: Three Architectures That Matter (slides 9–25)
- **Slide 9** (section divider, circle "2"): "Three Architectures That Matter" / subtitle "Monolithic → Layered → Microservices".

### Monolithic (slides 10–11)
- **Slide 10** (Q&A):
  - Q: "You built an app — one server, one codebase, one deploy. A critical bug is found in the payment module. What do you have to do?"
  - A: "Shut down the entire application, fix the bug, potentially recompile everything, then redeploy."
    "This is Monolithic Architecture: all logic (UI, business rules, data access) bundled in a single deployable unit. Simple to build, hard to scale and maintain."
- **Slide 11, "Monolithic Architecture"**
  - **All application logic is bundled together in one deployable unit** (bold)
  - Entire software typically resides on one machine, written in one backend stack
  - To add a new feature:
    - 1- shut down entire application
    - 2- add the new feature
    - 3- (may need to) recompile everything before deployment
  - **Best for: prototyping, MVPs, apps that won't need frequent independent updates** (bold, blue)

### Layered (slides 12–13)
- **Slide 12** (Q&A):
  - Q: "How could you organize your code so that changing the database doesn't require rewriting the UI?"
  - A: "Separate concerns into layers. Each layer handles one responsibility:"
    - Presentation layer — UI and user interaction
    - Business layer — application logic and decision-making
    - Application layer — core functions and libraries
    - Data access layer — database queries and storage
    "This is Layered (n-Tier) Architecture."
- **Slide 13, "Layered (n-Tier) Architecture"** (layer names bold)
  - **Layers = functional elements**
  - **Presentation layer (UI layer)**
    - interaction with the end-user is handled (e.g. form page)
  - **Business layer (business logic)**
    - controls the application's logic (e.g. decision making, routing requests)
  - **Application layer**
    - where the core functions of the app are implemented (e.g. libraries)
  - **Data access layer**
    - where access and retrieval of data are handled (e.g. databases)

### Microservices, mixing patterns, reliability vs robustness vs resilience (slides 14–20)
- **Slide 14** (Q&A):
  - Q: "What if different teams need to deploy independently, use different tech stacks, and scale different parts separately?"
  - A: "Split the system into small, independent services. Each handles one function and communicates via API. This is Microservices Architecture."
    "If Facebook shuts down, Messenger can keep running — because Messenger is a separate service."
- **Slide 15** (Q&A):
  - Q: "Can a real product use more than one architectural pattern at the same time?"
  - A: "Yes. Most large systems evolve and mix patterns:"
    - Netflix: Monolithic → Microservices → Event-driven + CQRS
    - Uber: Monolithic Rails → Microservices for maps, payments, ride matching
    "Other patterns exist (Event-Driven, Serverless, MVC, MVVM, Hexagonal, CQRS) — research them as needed."
- **Slide 16** (Q&A):
  - Q: "What's the difference between reliability, robustness and resilience ?"
  - A:
    - "Reliability: works correctly and consistently under normal conditions."
    - "Example: A banking API successfully returns balances for almost every valid request."
    - "Robustness: handles bad input or unexpected conditions safely."
    - "Example: Invalid JSON returns 400 Bad Request; the API does not crash or corrupt data."
    - "Resilience: continues essential service or recovers after disruption."
    - "Example: If recommendations fail, an online store still lets users search, add items to carts, and pay."
    - "Memory aid:"
    - "Reliable = works normally"
    - "Robust = handles bad conditions"
    - "Resilient = survives and recovers from failure"
- **Slide 17**: blank white page (no content, no slide number).
- **Slide 18** (no title):
  - "The components could be each providing a separate. All forming a collection of loosely coupled (almost independent) services. When a service reaches a specific level, it could be created in the form of a separate, stand alone app." (sic — "providing a separate." is missing a noun, presumably "service"; "a collection of loosely coupled (almost independent) services" is in a lighter grey highlight)
  - "We could as well split the services into smaller pieces so that each service executes a single functionality called microservice."
  - "Each service can reside in a separate machine. Be written in a different technology stack and can be up and running separately. For example the messenger app is a service to the facebook app. If facebook shuts down, it does not necessarily cause the messenger app to shut down too"
  - Below, as two lines with a side note: "SOA: Service-Oriented Architecture" / "MSA: Microservice Architecture" — "slightly different but refer the same thing in this course"
- **Slide 19** (no title):
  - "Opposite to microservices is monolithic architecture where in this context, means composed all in one piece."
  - "A monolithic architecture is the traditional unified model for the design of a software program. Often entire software resides in one machine, entire software is written in one backend technology stack."
  - "For example in a monolithic web application entire application is usually written in one backend technology, say Java and hosted in one machine. If you want to add something new to it you"
  - "1- shut down entire application"
  - "2- add the new feature"
  - "3- ( may need to ) recompile *everything* before deployment" ("everything" in italics)
    - "All application logic (UI, business logic, data access) is bundled together in a single deployable unit. Simple to build and deploy but hard to scale and maintain as complexity grows."
- **Slide 20, "Microservice Architecture"**
  - **A collection of loosely coupled, independently deployable services** (bold)
  - **Pros:**
    - Update or fix one service without shutting everything down
    - Each service = one function → assign separate teams, speed up development
    - Each service can reside in a separate machine, use a different tech stack
  - **Cons:**
    - Communication between services = many API calls → complexity increases
    - Requires orchestration, monitoring, and careful API design
  - **Used by: Uber, Netflix, Amazon, eBay, SoundCloud, Groupon** (bold, blue)

### The architecture used in this course (slides 21–22)
- **Slide 21, "The Architecture We Use in This Course"**
  - **We practice a simplified Microservice Architecture (MSA)** (bold)
  - We design an API-centric MSA
  - **API:**
    - API calls follow RESTful architecture
  - **Different origin:**
    - Client and servers are not hosted on the same machine (HTML files and Node.js files are not in the same machine). Even services might not be hosted in the same machine.
  - **Response:**
    - Responses coming back from services are often in JSON format
- **Slide 22** (no title; text on the left, figure on the right). Left text, verbatim (headings "API:", "Different origin:", "Response:" in green; "RESTful" and "JSON" bold blue):
  - "We practice a simplified version of Microservice architecture (MSA)"
  - "We design an API centric MSA"
  - "API:"
  - "API calls follow **RESTful** architecture"
  - "Different origin:"
  - "Clint and servers are not hosted on the same machine" (sic, "Clint")
  - "( HTML files and nodejs files are not in the same machine)."
  - "Even services might not be hosted in the same machine."
  - "Response:"
  - "Responses coming back from services are often in **JSON** format"
  - [figure: the course's API-centric MSA. Two regions, each a dash-dot cloud outline.
    - **Left region (client side):** green header label box "Clients" above a grey dash-dot cloud. Inside the cloud: a solid green box "Client scrips (HTML, AJAX)" (sic, "scrips"); overlapping it, offset down-right, a second paler/faded green box with the same text "Client scrips (HTML, AJAX)", labelled "UAE" just to its right (a second client located in the UAE).
    - **Right region (server side):** blue header label box "services" above a blue dash-dot cloud. Inside the cloud: a large orange box "API gateway" at the top; below it, two solid blue boxes: "user profile service" (left, labelled "USA" at its lower-left) and "inventor y service" (right; text wraps as "inventor / y service", i.e. inventory service; labelled "Korea" above its top-right). Behind/overlapping each blue box is a paler blue dash-outlined box: behind "user profile service" a pale box "file service"; behind "inventor y service" a pale box containing "..." labelled "Japan" to its right. Each service sits in its own small dash-dot cloud bump, suggesting separate machines/locations.
    - **Arrows:** a thick blue arrow from "Client scrips (HTML, AJAX)" → "API gateway", labelled above "AJAX API calls"; a thick blue arrow from "API gateway" → back to "Client scrips (HTML, AJAX)", labelled below "JSON". An orange double-headed arrow "API gateway" ↔ "user profile service"; an orange double-headed arrow "API gateway" ↔ "inventor y service". No arrows are drawn to "file service" or the "..." (Japan) box, and none between services.
    - Reading: clients never call services directly; all AJAX calls go to the API gateway, which talks to the services (in USA, Korea, Japan …) and returns JSON to the client.]

### Course outcomes (slides 23–25)
- **Slide 23** (no title):
  - Design and develop programs using REST, JSON and HTTP.
    - Learning the RESTful API architecture
    - Working with **HTTP methods** (GET, POST, PUT etc)
    - Working with **JSON** as a format to pass data back and forth
  - Design a simple web service.
    - A simple web service that returns result to AJAX requests like mydomain.com/API/Patients/1
  - Design and develop a RESTful API by applying the best practices and REST constraints.
    - You practice this in one of your labs and in your term project
  - Document and write specifications.
    - using swagger
- **Slide 24** (no title):
  - Practice implementation of CRUD operations.
    - Review of RDBM (sic — RDBMS)
    - Doing **C**reate, **R**ead, **U**pdate and **D**elete operations on a database via API requests (initial letters bold)
  - Implement error handling, HTTP status codes, secure API.
    - 404, 303, 200, 505, …with messages such as
    - Bad request
    - Unauthorized
    - Not found
  - [note: transcriber's note — as standard HTTP codes, 404 = Not Found, 303 = See Other (a redirect), 200 = OK, 505 = HTTP Version Not Supported; the messages listed correspond to 400 Bad Request, 401 Unauthorized, 404 Not Found. 505 is probably meant as 500 Internal Server Error but the slide says 505.]
  - Apply change management and versioning of designed APIs.
    - mydomain.com/**V1**/API/Patients/1
    - mydomain.com/**V1.1**/API/Patients/1
  - Secure a backend API server.
    - simple token based approach
    - Hashing using promises
- **Slide 25** (no title):
  - Also
    - Working with web storage
    - Private key/ public key
    - Asynchronous programming
    - Practicing denial of service attack
    - How to design scalable applications
    - How oAuth works
    - You may need to install SSL ( depends on your host provider how to do it)

## Section 3: JSON (slides 26–29)
- **Slide 26** (section divider, circle "3"): "JSON" / subtitle "JavaScript Object Notation".
- **Slide 27** (Q&A):
  - Q: "You have a JavaScript object in your browser. You need to send it to a server in Korea. Can you just send the object as-is?"
  - A: "No. A JavaScript object lives in memory — it has methods, prototypes, references. You cannot transmit it over a network."
    "You must serialize (flatten) it into a string format any machine can read."
    "JSON (JavaScript Object Notation) is the standard format for this."
- **Slide 28, "JSON: Serialize and Deserialize"** — code on a grey panel (monospace):

```js
// 1. Object → JSON string (serialize)
let myObj = { name: "John", age: 22, city: "Vancouver" };
let myJSON = JSON.stringify(myObj);
console.log(myJSON);  // '{"name":"John","age":22,"city":"Vancouver"}'
console.log(typeof myJSON);  // "string"

// 2. JSON string → Object (deserialize)
let jsonStr = '{"name":"Ali","courses":["COMP4537","COMP3522"]}';
let parsed = JSON.parse(jsonStr);
console.log(parsed.name);       // "Ali"
console.log(parsed.courses[0]); // "COMP4537"
```

  - Below the panel, bold: "Note: Name/value pairs are always stored as strings. Remember to convert them to another format when needed!"
  - [note: transcriber's note — on a JSON slide this is misleading. The JSON *text* is one string, but JSON values keep their types: after `JSON.parse`, `age` would be the number `22`, and arrays/booleans/null survive the round trip. The "always stored as strings" rule is true of localStorage/sessionStorage values (where the same note reappears on slide 34), not of JSON values.]
- **Slide 29** (Q&A):
  - Q: "An API returns this JSON string:"

```text
'{"status":200, "data":{"user":"Amir", "courses":
["COMP4537"]}}'
```

    "How do you access the first course name?"
  - A:

```js
let response = JSON.parse(jsonString);
response.data.courses[0]  →  "COMP4537"
```

    "Parse the string back into an object, then navigate using dot notation and array indices."

## Section 4: HTML Web Storage (slides 30–44)
- **Slide 30** (section divider, circle "4"): "HTML Web Storage" / subtitle "localStorage and sessionStorage".
- **Slide 31** (Q&A):
  - Q: "A user fills out a long form but accidentally closes the browser tab. When they reopen it, everything is gone. How could you prevent this without a server?"
  - A: "Store the data in the browser itself using localStorage."
    "It persists even after the browser is closed — available the next day, week, or year."
    "No server round-trip needed. Data stays on the client machine."
- **Slide 32, "Web Storage (inside your browser, not server)"**
  - We want to store data locally within the user's browser.
  - Web storage is more secure than cookies, and large amounts of data can be stored locally (generally 5MB or more).
  - [note: transcriber's note — "more secure than cookies" is a common w3schools-style claim and is contestable: localStorage is readable by any script on the page (XSS), whereas HttpOnly cookies are not; the deck itself says on slide 44 that HttpOnly/Secure cookies are often safer for auth tokens. The true advantages are size (~5 MB vs ~4 KB per cookie) and that web storage is not sent to the server with every request.]
  - **Note that web storage is per origin! That means per domain and protocol.** (bold)
  - [note: transcriber's note — an origin is scheme (protocol) + host (domain) + **port**; the slide omits the port. `http://a.com` and `http://a.com:8080` are different origins with separate storage.]
  - All pages, from same origin, can store and access the same data within same browser on your computer.
  - It is a client thing (in your browser's local data)
    - Web storage is client-side storage, which means it resides in the local data storage of your browser
- **Slide 33, "localStorage vs sessionStorage"**
  - "There are two HTML web storage objects for storing data on the client:"
  - **window.localStorage - stores data with no expiration date**
  - **window.sessionStorage - stores data for one session (data is lost when the browser tab is closed)**
- **Slide 34, "The localStorage Object"** — code on a grey panel (the method names `localStorage.setItem`, `localStorage.getItem`, `localStorage.removeItem` are bold):

```js
// Store
localStorage.setItem("myKey", "Monday and Friday");

// Retrieve
let val = localStorage.getItem("myKey");
console.log(val);  // "Monday and Friday"

// Remove a single item
localStorage.removeItem("myKey");

// Clear everything for this origin
localStorage.clear();
```

  - Below the panel, bold: "Note: Name/value pairs are always stored as strings. Remember to convert them to another format when needed!"
- **Slide 35** (Q&A):
  - Q: "How can I store an entire JavaScript object into localStorage?"
  - A: "Use JSON as the bridge between objects and strings:"

```js
// Store: serialize the object to a JSON string
localStorage.setItem("user", JSON.stringify({name: "Amir", role: "prof"}));

// Retrieve: parse the JSON string back to an object
let user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);  // "Amir"
```

- **Slide 36, "Example: writer.html"** — code on a grey panel (`localStorage.setItem` bold):

```html
<html lang="en">
<body>
  <h2>Writer</h2>
  <input id="dataInput" placeholder="Enter a value" />
  <button id="saveBtn">Save to localStorage</button>
  <p id="status"></p>
  <script>
    document.getElementById("saveBtn").addEventListener("click", () => {
      const val = document.getElementById("dataInput").value;
      localStorage.setItem("shared_data", val);
      document.getElementById("status").textContent = "Saved: " + val;
    });
  </script>
</body>
</html>
```

  - Below, bold: "This code snippet writes something onto local storage"
- **Slide 37, "Example: reader.html"** — code on a grey panel (`localStorage.getItem` bold):

```html
<html lang="en">
<body>
  <h2>Reader</h2>
  <button id="readBtn">Read from localStorage</button>
  <p id="output"></p>
  <script>
    document.getElementById("readBtn").addEventListener("click", () => {
      const val = localStorage.getItem("shared_data");
      document.getElementById("output").textContent = val
        ? "Found: " + val
        : "Nothing stored yet.";
    });
  </script>
</body>
</html>
```

  - Below, bold: "reader.html reads the same data written by writer.html (same origin, same browser, same machine)"
  - (Both files omit `<!DOCTYPE html>` and `<head>`; the key `"shared_data"` is shared between them. If nothing is stored, `getItem` returns `null`, which is falsy, so the ternary shows "Nothing stored yet.")
- **Slide 38** (Q&A):
  - Q: "You stored data using localStorage in your code. How can you inspect, edit, or delete what's actually stored in the browser without writing any JavaScript?"
  - A: "Open Chrome DevTools (F12) → Application tab → Storage → Local Storage."
    "You can see all key-value pairs for the current origin, edit values in place, delete individual entries, or clear all storage."
    "This is essential for debugging."
- **Slide 39** (Q&A; identical duplicate of slide 35):
  - Q: "How can I store an entire JavaScript object into localStorage?"
  - A: "Use JSON as the bridge between objects and strings:"

```js
// Store: serialize the object to a JSON string
localStorage.setItem("user", JSON.stringify({name: "Amir", role: "prof"}));

// Retrieve: parse the JSON string back to an object
let user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);  // "Amir"
```

### Storage Q&A (slides 40–44)
- **Slide 40** (Q&A):
  - Q: "You add items to a shopping cart on your laptop, then sign in on your phone. Should the same cart appear on the phone?"
  - A: "Yes, when the store associates the cart with the user account and keeps it on the server."
    "Data kept only in the laptop browser (localStorage) does not automatically appear on the phone."
- **Slide 41** (Q&A):
  - Q: "A user refreshes a page and the cart remains. Does that prove the application uses localStorage?"
  - A: "No. The cart may come from localStorage, a persistent cookie, or server-side storage retrieved through an API request."
    "Never assume the storage mechanism from observed behavior alone."
- **Slide 42** (Q&A):
  - Q: "Where should an application keep a dark-mode preference that applies only on one device?"
  - A: "localStorage is often suitable. It persists in that browser and avoids a server request for a device-specific preference."
    "If the user expects the preference to follow their account across devices, keep it in the server-side database instead."
- **Slide 43** (Q&A):
  - Q: "Should a website store a user's password in localStorage?"
  - A: "No. Never. The server should verify the password against a securely hashed value in the database."
    "localStorage is readable by any JavaScript on the page — a single XSS vulnerability exposes the password."
- **Slide 44** (Q&A):
  - Q: "Should an application store an authentication token in localStorage?"
  - A: "It can, but this creates XSS risk because any JavaScript on the page can read localStorage."
    "HttpOnly and Secure cookies are often safer because JavaScript cannot access them. We will examine this later in the course."

## References (slide 45)
- **Slide 45, "References"**
  - https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/
  - https://en.wikipedia.org/wiki/Software_architecture
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  - https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
  - https://www.json.org/
  - https://microservices.io/
  - (grey) ChatGPT was used for proofreading and content generation too

## Facts and numbers index
- Users growth scenario: 1,000 → 1,000,000; app crashes daily; features take weeks (slide 4).
- "Architecture is not code. It is the decisions you make before you write code." (slide 4)
- Definition: "Architecture refers to interaction/relation among components." (slide 5)
- Three domains of architecture and their focus (slide 5): building construction (walls, floors, stairs → space usage, flow, beauty, cost, style); computer architecture (CPU, Memory, Storage, I/O → speed, power usage, efficiency, computational power); web application (UI, Database, logic → reliability, scalability, security, ease of implementation, modularity).
- Five trade-offs on slide 6: Efficiency, Cost of maintenance, Scalability ("100x the users without a rewrite"), Security ("single gateway … or thousands of endpoints"), Modularity.
- Eight qualities on slide 7: efficiency, robustness, security, performance, modularity, cost of maintenance, development and extension, cost of deployment; slides 7–8 give examples for Efficiency, Cost of maintenance, Development and extension, Robustness, Security, Modularity, Cost of deployment (7 examples).
- Maintenance example: JavaScript + ASP .net needs two developers; switching to nodejs needs one (slide 7).
- Django + nodejs extension works "only if my Django application is originally developed as an API-centric application" (slide 7).
- Security: a gateway component that is "the only portal being in touch with the outside world" is "the only place I need to secure" (slide 8).
- Modularity: "each module/service must carry one main functionality" (slide 8).
- Cost of deployment: Ruby on Rails "perhaps we need a dedicated sever"; "Do we need docker?" (slide 8).
- Three architectures, in order: Monolithic → Layered → Microservices (slide 9).
- Monolithic definition: all application logic bundled in one deployable unit; one machine, one backend stack (slides 10, 11, 19).
- Monolithic: 3 steps to add a feature — 1- shut down entire application, 2- add the new feature, 3- (may need to) recompile everything before deployment (slides 11, 19).
- Monolithic best for: prototyping, MVPs, apps that won't need frequent independent updates (slide 11).
- Monolithic example backend: "say Java and hosted in one machine" (slide 19); "Simple to build and deploy but hard to scale and maintain as complexity grows" (slide 19).
- Layered (n-Tier): 4 layers in order — Presentation (UI; e.g. form page), Business (business logic; e.g. decision making, routing requests), Application (core functions; e.g. libraries), Data access (e.g. databases) (slides 12, 13). "Layers = functional elements" (slide 13).
- Microservices definition: "A collection of loosely coupled, independently deployable services" (slide 20).
- Microservices: 3 pros, 2 cons (slide 20). Used by 6 companies: Uber, Netflix, Amazon, eBay, SoundCloud, Groupon (slide 20).
- Facebook/Messenger example of independent services (slides 14, 18).
- Netflix evolution: Monolithic → Microservices → Event-driven + CQRS; Uber: Monolithic Rails → Microservices for maps, payments, ride matching (slide 15).
- Other patterns named (6): Event-Driven, Serverless, MVC, MVVM, Hexagonal, CQRS (slide 15).
- Reliability = works correctly and consistently under normal conditions; Robustness = handles bad input or unexpected conditions safely; Resilience = continues essential service or recovers after disruption (slide 16).
- Robustness example: Invalid JSON returns 400 Bad Request (slide 16).
- SOA = Service-Oriented Architecture; MSA = Microservice Architecture; "slightly different but refer the same thing in this course" (slide 18).
- Course architecture: simplified, API-centric MSA; API calls follow RESTful architecture; different origin (client and servers not on the same machine; HTML files and Node.js files not on the same machine); responses often JSON (slides 21, 22).
- Figure (slide 22): client → API gateway labelled "AJAX API calls"; API gateway → client labelled "JSON"; API gateway ↔ user profile service (USA); API gateway ↔ inventory service (Korea); file service and "..." (Japan) in the background; second client in UAE.
- Example endpoint: mydomain.com/API/Patients/1 (slide 23); versioned: mydomain.com/V1/API/Patients/1 and mydomain.com/V1.1/API/Patients/1 (slide 24).
- HTTP methods named: GET, POST, PUT (slide 23). Documentation tool: swagger (slide 23).
- CRUD = Create, Read, Update, Delete (slide 24).
- Status codes listed: 404, 303, 200, 505; messages: Bad request, Unauthorized, Not found (slide 24).
- Security approaches: simple token based approach; hashing using promises (slide 24).
- "Also" list, 7 items: web storage; private key/public key; asynchronous programming; practicing denial of service attack; scalable applications; how oAuth works; install SSL (slide 25).
- JSON = JavaScript Object Notation (slides 26, 27).
- A JS object "has methods, prototypes, references" and cannot be transmitted over a network; must be serialized (flattened) (slide 27).
- `JSON.stringify` = object → JSON string (serialize); `JSON.parse` = JSON string → object (deserialize) (slide 28).
- `typeof JSON.stringify(myObj)` is "string" (slide 28).
- `JSON.stringify({ name: "John", age: 22, city: "Vancouver" })` → `'{"name":"John","age":22,"city":"Vancouver"}'` (slide 28).
- `parsed.courses[0]` → "COMP4537"; `response.data.courses[0]` → "COMP4537" (slides 28, 29).
- Rule: "Name/value pairs are always stored as strings. Remember to convert them to another format when needed!" (slides 28, 34).
- localStorage persists after the browser is closed — "next day, week, or year" (slide 31).
- Web storage size: "generally 5MB or more" (slide 32).
- Web storage is per origin = "per domain and protocol" (slide 32).
- Two web storage objects: window.localStorage (no expiration date) and window.sessionStorage (one session; lost when the browser tab is closed) (slide 33).
- localStorage API, 4 calls: `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, `clear()` ("Clear everything for this origin") (slide 34).
- Store an object: `localStorage.setItem("user", JSON.stringify(obj))`; retrieve: `JSON.parse(localStorage.getItem("user"))` (slides 35, 39).
- writer.html and reader.html share key `"shared_data"`; reader shows "Found: " + val or "Nothing stored yet." (slides 36, 37). Condition for sharing: "same origin, same browser, same machine" (slide 37).
- DevTools path: Chrome DevTools (F12) → Application tab → Storage → Local Storage (slide 38).
- Cart across devices: only if kept on the server tied to the user account (slide 40).
- Cart surviving refresh could be localStorage, a persistent cookie, or server-side storage via API (3 possibilities) (slide 41).
- Device-only dark-mode preference → localStorage; account-wide → server-side database (slide 42).
- Password in localStorage: "No. Never." — verify against a securely hashed value on the server; XSS exposes it (slide 43).
- Auth token in localStorage: "It can" but XSS risk; HttpOnly and Secure cookies often safer (slide 44).
- References: 6 URLs + ChatGPT note (slide 45).

## Likely quiz traps
- "Architecture is not code" — it is the decisions made before writing code (slide 4).
- For a web application the focus is reliability, scalability, security, ease of implementation, modularity — not "speed, power usage" (that is computer architecture) nor "space usage, flow, beauty" (building construction) (slide 5).
- Layered architecture has four layers in a fixed order: Presentation, Business, Application, Data access; "routing requests" belongs to the Business layer and "libraries" to the Application layer (slides 12, 13).
- In a monolith, a fix in one module (e.g. payment) still requires shutting down the entire application; step 3 recompilation is "(may need to)", not always (slides 10, 11).
- Reliability vs robustness vs resilience: invalid JSON → 400 Bad Request is the *robustness* example; store still working when recommendations fail is the *resilience* example (slide 16).
- SOA and MSA are "slightly different but refer the same thing in this course" (slide 18).
- A real product can mix several architectural patterns (Netflix, Uber) (slide 15).
- In the course architecture, the client sends AJAX API calls to the API gateway (not directly to services) and receives JSON; client and server are on different origins/machines (slides 21, 22).
- Microservice cons: many API calls increase complexity; requires orchestration, monitoring, careful API design (slide 20).
- `JSON.stringify` returns a string (`typeof` → "string"); `stringify` serializes, `parse` deserializes — easy to swap (slide 28).
- localStorage has no expiration; sessionStorage is lost when the browser *tab* is closed (slide 33).
- Web storage is per origin; data written by writer.html is readable by reader.html only on the same origin, same browser, same machine (slides 32, 37).
- A cart that survives a refresh does not prove localStorage is used (slide 41); a cart that follows you to your phone must be server-side (slide 40).
- Passwords: never in localStorage (slide 43); auth tokens: "It can" be stored there, but with XSS risk — HttpOnly/Secure cookies are often safer (slide 44). Note the tension with slide 32's "Web storage is more secure than cookies".
- Values in localStorage are always strings; store objects with `JSON.stringify` and read back with `JSON.parse` (slides 34, 35).
