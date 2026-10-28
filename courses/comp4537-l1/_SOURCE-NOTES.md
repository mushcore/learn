# Lecture 1, part A: slides 1–110

Deck: **"Adv Web Dev and Architecture — Lecture 1 — review"**, Amir Amintabar, PhD (COMP 4537, Fall 2026).
Source file: `D:\BCIT\COMP4537\raw\COMP4537-Lecture1-review-OOP-Codying-Style-Chrome-Dev-tool-review-HTML-CSS-JS-Hosting-AI-architecture.pdf` (188 pages; this file covers PDF pages 1–110; part B covers 111–188). Text layer: `D:\BCIT\COMP4537\txt\COMP4537-Lecture1-…-AI-architecture.txt`; rendered pages `D:\BCIT\COMP4537\png\L1\p001.png` … `p110.png`.
Date transcribed: 2026-10-27.
Slide numbers are PDF page numbers; the printed slide number in the corner matches the PDF page wherever one is printed (slides 4–8, 18–29, 106–110 carry no printed number).
Code screenshots from VS Code show small colour-swatch squares before colour values (e.g. `color: ■blue;`); these are editor decorations, not characters, and are omitted from the code blocks below.

**Summary.** The first part of the Week 1 deck opens with an architecture question (why a web app is harder to design than a desktop program, a web-vs-Java-desktop challenge table, and a 5-device × 3-network "12 scenarios" exercise), then reviews OOP in modern JavaScript (a `Vehicle`/`Car` inheritance example with `super`, a `Car`/`Engine` composition example, template strings, "favor composition over inheritance", and a `Car`/`ElectricCar`/`SportsCar`/`Engine` exercise with the Tesla and Ferrari answers). It shows the Chrome DevTools debugger with seven numbered regions, two OOP/DevTools questions, the course coding-style rules (const/let never var, short single-purpose functions, no hard-coded user-facing strings), the term project (microservice API server with Hugging Face models, group of max 4), and a hosting section (what hosting is, the three hosting requirements: relational DB, multiple Node.js apps, SSL; shared vs VPS vs dedicated vs cloud; domain names; folder conventions; `index.html` is special), followed by a long list of architecture topics for the term. The rest is review of prerequisites: HTML (DOCTYPE, page skeleton, DOM tree, elements/tags/attributes, unknown tags, HTTP/HTTPS/FTP, URL parts, end-tag tips, lists, input buttons, radio buttons, text-formatting and semantic quotation elements), styling HTML (the global `style` attribute, colours by name/RGB/HEX/RGBA, font size, alignment, borders, the three ways to style: inline, internal, external), tables, `div`, the global `id` and `class` attributes, CSS rule-sets and selectors (element, id, class, `p.myClass`, multiple classes, grouping, comments), and an "Introduction to JavaScript" run of examples (document.write, console.log, alert, innerHTML, setting `src`, `let`/`var`, strings, comments, `if`, a `for` loop) with three in-class activities.

---

## Title and outline (slides 1–2)

- **Slide 1** (title): "Adv Web Dev and Architecture" / "Lecture 1" / "review" / "Amir Amintabar, PhD".
- **Slide 2, "Outline"**:
  - A question on application design
  - OOP review
  - Chrome debugging/developer tool
  - Coding style rules in this class for this week's lab onward
  - HTML review*
  - CSS review
  - JavaScript  review
  - Hosting tips
  - "*The review content in week 1 lecture note is from the pre-requisite courses. It is your responsibility to brush up your knowledge from previous courses. Even if we do not cover all of these slides today, it will be assumed you know these materials."

## Why web applications are hard to design (slides 3–5)

- **Slide 3, "Internet software architecture starts with real-world constraints"**
  - Q: "Why is a web application harder to design than a program that runs only on your own computer?"
  - A (printed as bullets under the question):
    - "Web applications run across unreliable networks, different browsers, devices, and servers."
    - "Users may close a page, lose connectivity, use limited hardware, or send unexpected input."
    - "Good architecture separates concerns so that the user interface, server-side logic, and data can evolve and fail independently."
    - "Before choosing a tool or pattern, identify the device, network, performance, security, and privacy constraints."
- **Slide 4, "Why web is so challenging ?"** — "Compare the challenges of a web app vs a desktop Java/python application development". Table (two columns, 9 rows, verbatim):

| Web app | Java Desktop app |
|---|---|
| User can close the page unannounced | The OS signals the Java app before clousure (sic) |
| User can use any browser ( even IE or Edge) | Windows, or Mac or Linux that's it |
| Browser has limited resources (memory, cpu power, GPU power) | Java app has entire resources at hand |
| User can use any device ( phone, tablet, desktop) | Just a desktop computer or thin client |
| Zillions of frameworks and technologies to learn | Just java and may be Java fx |
| Security ( anyone around the world can access your app) | Its only for you, no one else has access to your computer |
| DoF service attach, injection, | No one else has access to your computer |
| Server might go down, network goes down | Its your pc |
| Remote! | Right in front of you |

  - [note: "DoF service attach" means a denial-of-service (DoS) attack; the slide's spelling is kept.]
- **Slide 5** (no title):
  - Q: "Suppose you want to develop an application for the following devices, what are the general challenges/ considerations ?"
  - Devices: "Mobile device (smartphone)", "Tablet", "Browser", "PC ( e.g. Laptop or Desktop)", "IoT nodes ( many of which have no screen or a keyboard)"
  - "**In the following scenarios**": "1- when not connected to any network", "2. Connected to a local network", "3. Connected to a global network ( internet)"
  - "**Pick a combination of device + scenario and provide your answer in the following fashion**": "M.1 refers to mobile not connected to net", "i.3 refers to an IoT node connected to the internet", "So there are a total of 12 scenarios"
  - [note: 5 devices × 3 scenarios is 15 combinations, not 12; the slide says 12 (it would be 12 only with 4 devices). Transcribed as written.]
  - "Tip: What factors would you consider?"
  - A (printed): "Security", "Amount of Memory that could be available to the app", "Multitasking", "CPU speed", "GPU speed", "Taking adv of the device Sensors ( GEO, Vibration, Camera," (the list ends there, unclosed, on the slide).

## OOP in modern JS (slides 6–12)

- **Slide 6** (section divider): "review" (top left) / "OOP in modern JS".
- **Slide 7, "Inheritance"** — "Create a general vehicle class in JavaScript called ***vehicle*** and then extend it to create a specific type of vehicle, a ***car***. This shows the "**is-a**" relationship where a car "is a" ty[pe…]" (the end of the sentence is hidden behind the yellow callout; the text layer does not recover it).
  - Code screenshot 1 (top left):

```js
// Base class Vehicle
class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }

    start() {
        console.log('Starting the vehicle...');
    }
}
```

  - Code screenshot 2 (middle):

```js
// Car class inherits from Vehicle
class Car extends Vehicle {
    constructor(brand, engineType) {
        super(brand);
        this.engineType = engineType;
    }

    displayDetails() {
        console.log(`This is a ${this.brand} car with a ${this.engineType} engine.`);
    }
}
```

  - Code screenshot 3 (bottom right):

```js
let myCar = new Car('BCITMadeCar', 'V1');
myCar.start(); // Starting the vehicle...
myCar.displayDetails(); // This is a BCITMadeCar car with a V1 engine.
```

  - [figure: orange arrow labelled "Extend to" from the `Vehicle` class box down to the `Car` class box; blue arrow labelled "is a" from the `Car` box up to the `Vehicle` box; blue arrow labelled "Instantiate from" from the `let myCar = new Car(...)` box up to the `Car` class box; a yellow callout "What does 'super' do?" with a thin line pointing to `super(brand);`.]
  - Q: "What does 'super' do?" A: (not on the slide)
- **Slide 8, "Composition"** — "Create separate classes for **Car** and **Engine**, and then compose a car with an engine. This shows the "has-a" relationship where a car "has an" engine."
  - Code screenshot 1 (left):

```js
// Engine class
class Engine {
    constructor(type) {
        this.type = type;
    }

    start() {
        console.log(`Starting the ${this.type} engine...`);
    }
}
```

  - Code screenshot 2 (right):

```js
// Car class has an Engine
class Car {
    constructor(brand, engine) {
        this.brand = brand;
        this.engine = engine;
    }

    start() {
        this.engine.start();
        console.log(`The ${this.brand} car is now running.`);
    [illegible: the closing braces are cut off by the screenshot edge; slide 13 shows the same code ending "    }" / "}"]
```

  - Code screenshot 3 (bottom right):

```js
let myEngine = new Engine('V1');
let myCar = new Car('BCITmadeCar', myEngine);
myCar.start();
// Starting the V1 engine...
// The BCITmadeCar car is now running.
```

  - [figure: blue arrow labelled "has a" from the `Car` class box to the `Engine` class box; blue arrow labelled "Instantiate from" from the instantiation box up to the `Car` class box.]
  - Blue speech bubble (its tail points at the template string in `console.log(`The ${this.brand} car is now running.`)`): "Template Strings allow variables in strings"

```js
let firstName = "John";
let lastName = "Doe";
let text = `Welcome ${firstName},
${lastName}!`;
```

    (the line break after `,` is as shown in the bubble; it may be a wrap of the bubble width) — "Automatic replacing of variables with real values is called string interpolation." "we do that using **backtick** ( ` ) characters instead of double or single quotes". Source: https://www.w3schools.com/js/js_es6.asp
- **Slide 9, "Inheritance vs composition"**
  - "Key Differences"
  - "In the inheritance example, Car **is a** type of Vehicle, **inheriting its properties and methods**."
  - "In the composition example, Car **has an** Engine as a component."
  - "The composition approach allows more flexibility."
  - "For instance, you can easily swap out the Engine for another type without needing to change the Car class. This flexibility is a key advantage of composition over inheritance."
- **Slide 10** (no title):
  - Q: "Can we Create Classes in JS?" A: (not on the slide)
  - Q: "Somewhere I read, in coding, favor composition over inheritance. What are they? What does this mean?" A: (not on the slide)
- **Slide 11** (no title), two code screenshots:
  - Left:

```js
// This code was assisted by ChatGPT, OpenAI.
// Base class
class Car {
    constructor(make) {
        this.make = make;
    }
    drive() {
        return `${this.make} is driving.`;
    }
}
// Inheritance: ElectricCar extends Car
class ElectricCar extends Car {
    constructor(make, batteryLife) {
        super(make);
        this.batteryLife = batteryLife;
    }
    charge() {
        return `${this.make} is charging with
        ${this.batteryLife}% battery remaining.`;
    }
}
```

  - Right:

```js
// Composition: Car with an Engine class
class Engine {
    constructor(type) {
        this.type = type;
    }
    startEngine() {
        return `The ${this.type} engine is starting.`;
    }
}
class SportsCar extends Car {
    constructor(make, engine) {
        super(make);
        this.engine = engine;
    }
    accelerate() {
        return `${this.make} is accelerating with a
        ${this.engine.startEngine()}`;
    }
}
```

  - (In both screenshots the template strings in `charge()` and `accelerate()` are split over two lines as shown; the expected output on slide 12 prints them on one line, so these are editor word-wraps.)
  - Q1: "Now instantiate a Tesla with 80% battery life" — A: on slide 12.
  - Q2: "Create a Ferrari SportsCar with V8 engine" — A: on slide 12.
  - [note: `SportsCar` "is a" `Car` (inheritance) and "has an" `Engine` (composition), so this one class uses both relationships.]
- **Slide 12** (no title; the answer to slide 11):

```js
const tesla = new ElectricCar('Tesla', 80);
console.log(tesla.drive()); // Tesla is driving.
console.log(tesla.charge()); // Tesla is charging with 80%
battery remaining.
const v8Engine = new Engine('V8');
const ferrari = new SportsCar('Ferrari', v8Engine);
console.log(ferrari.drive()); // Ferrari is driving.
console.log(ferrari.accelerate()); // Ferrari is
accelerating with a The V8 engine is starting.
```

  - (The comment text "battery remaining." and "accelerating with a The V8 engine is starting." wraps onto the next line in the screenshot; they are continuations of the `//` comments, not code.)
  - Expected output, from the comments:

```text
Tesla is driving.
Tesla is charging with 80% battery remaining.
Ferrari is driving.
Ferrari is accelerating with a The V8 engine is starting.
```

## Chrome developer tool and two exercises (slides 13–15)

- **Slide 13, "Chrome developer tool"** — "What does 1, 2, ..., 7 do?" A: (not on the slide)
  - [figure, left: Chrome's main menu (items "Print...", "Search this page with…", "Translate...", "Find and edit", "Save and share", "More tools" (highlighted), "Help", "Settings", "Exit", "Managed by your or[ganization]") with the "More tools" submenu open ("Name window...", "Performance", "Task manager  Shift+Esc", "Developer tools  Ctrl+Shift+I"); a red box (unnumbered) around "Developer tools Ctrl+Shift+I".]
  - [figure, right: a DevTools window, docked. Top tab bar: "Application", "Elements", "Console", "Sources" (active), "Network", "Performance", "»", then settings gear, ⋮, ×. Red numbered boxes:
    - **1**: the "Sources" tab.
    - **2**: the left file navigator ("Page" / "Workspace" tabs; tree "top" → "file://" → "G:/My Drive/Teachin[g…]" → folder "js" and file "vehicle.html").
    - **3**: the "Console" tab.
    - **4**: the line-number gutter of the code editor around lines 13–18; line numbers 8 and 16 carry blue breakpoint markers; execution is paused at line 16 (`this.engine = engine;`, highlighted yellow) with inline value hint `brand = "BCITmadeCar", engi[ne…]` after `constructor(brand, engine) {`.
    - **5**: the debugger toolbar (resume/pause, step over, step into, step out, step, deactivate breakpoints icons) above the "Breakpoints" section, which lists "Pause on uncaught exceptions", "Pause on caught exceptions", and "script.js" with a checked breakpoint `console.log(`Starting the ${this.t…` at line 8.
    - **6**: the right-hand "Scope" / "Watch" pane, "Watch" selected, with "+" and refresh icons and two watch entries: `userMessages: <not available>` and `▶ this.engine = engine: Engine`.
    - **7**: the "Network" tab.
    - Status bar: "Line 16, Column 9", "Coverage: n/a".]
  - Code shown in the Sources editor (file tab "s…js", which the Breakpoints list names `script.js`), lines 1–30:

```js
// Engine class
class Engine {
    constructor(type) {
        this.type = type;
    }

    start() {
        console.log(`Starting the ${this.type} engine...`);
    }
}

// Car class has an Engine
class Car {
    constructor(brand, engine) {
        this.brand = brand;
        this.engine = engine;
    }

    start() {
        this.engine.start();
        console.log(`The ${this.brand} car is now running.`);
    }
}

let myEngine = new Engine('V1');
let myCar = new Car('BCITmadeCar', myEngine);
myCar.start();
// Starting the V1 engine...
// The BCITmadeCar car is now running.
```

- **Slide 14, "Q — Inspect before changing code"**
  - Q: "A webpage has three buttons, but one button has the wrong colour and is in the wrong position. Before changing the JavaScript code, explain how you would use Chrome DevTools to find the button's HTML element and the CSS rule that is causing the problem. Identify the first thing you would inspect and why" A: (not on the slide)
- **Slide 15, "Q"**
  - "A. Using OOP create a class of buttons and display n buttons on screen each with its own color. ( define n at the top of your code and give it a value between 3 to 10)"
  - "B. Now add a new method to your class which moves buttons to a random place within the browser window"
  - A: (not on the slide)

## Coding style rules (slide 16)

- **Slide 16, "Coding style to follow in this course (recommended)"**
  - **Variable Declaration:**
    - "Use `const` first and `let` for variable declarations to ensure block-level scoping, with `const` being the default choice for variables that don't change. And never use var"
    - "Choose clear and descriptive names for variables."
    - "If a variable is not meant to be global, it should not be declared as such."
  - **Object-Oriented Practices:**
    - "Use classes and constructor functions to encapsulate and manage related data and behaviors."
  - **Function Length:**
    - "A function focuses on a single task. Avoid side effects in functions; a function should ideally perform one action or calculate and return a value based on its inputs."
    - "Has to be short; a good rule of thumb is that a function should fit on a screen without scrolling."
  - "String and **User Message** Management:"
    - "Store user-facing strings, like error messages and UI labels, in separate files (e.g., JS or JSON) for easy management and localization."
    - *"Absolutely no hard coded user facing string messages anywhere in your assignment code or you will lose mark"* (italic; the last letter is hidden by the screenshot, recovered from the text layer)
    - "Consider implementing a centralized message displaying mechanism."
  - Code screenshot (crossed out with a large yellow X), overlaid in red: "No hard coded user facing string messages anywhere in your assigment (sic) code or you will lose mark":

```js
// Engine class
class Engine {
    constructor(type) {
        this.type = type;
    }

    start() {
        displayMessage(`Starting the ${this.type} engine...`);
    }
}

// Car class has an Engine
class Car {
    [illegible: the constructor line is cut off at the bottom of the screenshot]
```

  - Orange box: Q: "How can we store dynamic strings which are formed by joining (concatenating) multiple substrings and value of variables? E.g. / Your score is ... for today"
  - Grey box: A: "Tip: Store it like "Your score is %1 for today""

## Term project (slide 17)

- **Slide 17, "Term project  ( group size of max 4)"**
  - "For your term project, you developed an API server based on microservice architecture, with multiple endpoints powered by pre-trained AI models from [Hugging Face](link). You will need to host LLM models on your hosting services." ("Hugging Face" is a hyperlink; its target URL is not printed.)
  - "Your API server, serves API consumers (client apps that consume your APIs). As a proof of concept, you will also need to create a client app to consume those API endpoints with simple user management and authentication. This app will fulfill services by sending API requests to your API server."
  - "Examples of those microservices/services could include:" "AI services", "API gateway", "Authentication services", "Database services", "User management"

## Hosting (slides 18–28)

- **Slide 18** (section divider): blue banner "Hosting"; "Tips on how to choose the right web hosting provider"; a tilted green box listing "HTML, JavaScript, CSS", "nodejs files", "MySQL databases", "SSL".
- **Slide 19, "Hosting"**
  - "In order to make your website available on the net to visit by anyone around the world, you need to (remotely) host your website."
  - "That means there is a computer, referred as server (web server, DB server, data server ..), on which you store your HTML, CSS, JS, image, video files, databases, etc"
  - "That computer is kept switched on, 24/7"
  - "That computer is connected to the internet"
  - "That computer has a unique address"
  - "So when you type. e.g. https://myDomain.com, the server side script runs in that computer and generates ( renders) HTML files to return to your browser."
  - "The HTML files from that web server are fetched and made available to your browser. They actually store in your browser's storage ( yes the HTML files, images and CSS files are copied to your local machine to be used by your browser. The video files or other streaming content don't entirely store in your browser's local storge (sic)"
  - "There are various types of remote servers, webservers, database servers, file servers etc"
- **Slide 20, "Hosting provider"**
  - "There are companies that maintain such computers, or datacenters. Those companies are called Hosting providers."
  - "Every **website** you've ever visited **is hosted** on **a server** ( or on a bunch of servers such as cloud services)."
- **Slide 21, "Choosing the right hosting plan!"**
  - "For your term projects/ assignments you need a web hosting account that provides"
  - "1) **relational** database server" — "For your assignment, you may need to use **relational** databases such as mySQL, Postgres, Marina DB, MariaDB"
  - "2) Hosting multiple nodejs projects at the same time" — "You will need to use NodeJS runtime environment to create the backend of your project" / "No all web hosting plans allow you to host nodejs applications"
  - "3) SSL certificate" — "So that you can host http**s**:// instead of only http://" / "Many third party APIs require you to use https when you access them" / "Your web hosting provider can install SSL certificate for you or you may have to do it yourself depending on the service you obtain for hosting your assignments. Making sure the SSL certificate is installed is part of your assignments." / "From former students we heard that some free web hosting services also offer SSL certificate as well."
  - "Hosting plans"
  - "There are various types of hosting plans,"
  - "Shared vs VPS vs Dedicated vs Cloud Hosting. ***It is your responsibility to find the right hosting service provider***"
  - [note: "Marina DB" is not a database product; MariaDB is listed separately. Transcribed as written.]
- **Slide 22, "Choosing the right hosting plan! Part 1"**
  - "There are various types of hosting plans:"
  - "**Shared**"
  - "When you choose a shared hosting, the hosting company will put your website on a server along with hundreds of other websites ( or may be thousand other websites) . All of those websites are sharing resources such as memory, disk space, CPU, Database server, mail serve etc"
  - "Shared plans are the cheapest but, depending on number of websites hosted in same machine, might be the slowest. For your projects in this course a right shared plan would suffice"
  - "**Shared VPS ( Virtual prove server)**"
  - "is similar to shared hosting in that your website shares a server with other sites, you get your own virtual private server,  but there are fewer sites sharing space and resources and the server is likely fasted."
  - [note: VPS stands for Virtual **Private** Server ("prove" and "fasted" are slide typos, the body text itself says "virtual private server").]
- **Slide 23, "Choosing the right hosting plan! Part 2"**
  - "**Dedicated server.**"
  - "Your website is stored on a single physical machine dedicated to your website. All the resources, CPU, RAM, Hard disk are being controlled by you."
  - "**Cloud Hosting**"
  - "It is based on the concept of cloud computing technologies that allow multiple machines to act as one system. This allows multiple servers to work together to handle high traffic levels or spikes for any particular" (sentence ends there on the slide)
  - "Shared hosting services are generally ran by two types of operating systems, Linux and Windows."
  - "Generally Linux servers are cheaper. However you need to make sure they offer what you need for your assigments."
- **Slide 24, "Choosing the right hosting provider and a disclaimer"**
  - "There are many companies that provide web hosting services"
  - "you can also host your web applications on **free services**, **however you need to make sure their service is up and running during the entire semester, and meet the assignment requirements such as offering SSL when needed, mySQl hosting, and hosting multiple nodejs apps at the same time.**"
  - "You can choose, free or paid cloud, dedicated, VPS or shared hosting services, its up to you but you need to remember its your responsibility to manage your server as every company offers different services. If you have any issues with your web hosting provider you need to contact their customer service."
  - "Managing shared hosting servers is easier as they are already set up and ready for you to use via some panels such as cPanel."
  - "Note: It is your responsibility to chose the hosting provider to meet the assignment requirements. Even if you see in my videos or class that I am using a web hosting service from a particular company for my own projects, it does not mean that would be the best option and you don't need to do your due diligence and research."
  - "Finding the right hosting web service provider to host multiple app and all of your assignment at the same time is what you need to practice and learn as part of your assignment"
- **Slide 25, "In case you wanted to obtain a domain name"**
  - "If the web hosting you are using is providing you with a unique folder address such as"
  - https://myAdvWebDev.herokuapp.com
  - https://juetwkl43532f2a2.herokuapp.com
  - "You would probably be fine, and you would not need a domain name to point to your home page for this course, however if you want to look more professional to the recruiters you can get your own domain name and link it to your webhosting account"
  - "You can get your domain name from any domain name registrars such as."
  - "GoDaddy, Register.com,  networksolutions.com, … and link them to your web hosting provider ( they have special steps that their customer service has to provide to you)"
- **Slide 26** (no title)
  - "For assignments which need hosting, you will need to follow some conventions and best practices as to where to store files for that particular assignment."
  - "E.g."
  - https://myAdvWebDev.herokuapp.com/comp4537/labs/1/...
  - "or"
  - https://juetwkl43532f2a2.herokuapp.com/comp4537/labs/1/...
  - "Depending on the host provider you obtain your service from, you will need to figure out how to host your assignments in various folders."
  - "I only show you how it is done in a cPanel environment as an example"
- **Slide 27, "Tip 1"**
  - "Is it possible to get the web hosting service from a company and the domain name from another company ?"
  - "Again, you don't need a domain name but Yes its possible."
  - "For example you can get the web hosting account from glowhost.com  and the buy the domain name from goDaddy.ca"
  - "Note:"
  - "It is **your responsibility** to make sure your assignments and projects are properly hosted. If you have any issues you need to contact the costumer (sic) service of the web hosting or your domain registrar"
- **Slide 28, "Tip 2 index.html is special!"**
  - "By default all web browsers will automatically 'look' for an index.html page located in the url directory"
  - "That means, if the html server does not find the html file in the url, it returns the index.html page (if exists)"
  - "Example"
  - "Suppose the in the root of your domain there is a folder named project2 with the following files:"

```text
MyDomain.com/project2/
                        /index.html
                        /course.html
```

  - "Opening the url  http://myDomain.com/project2 ( note that HTML file name is not provided) will open index.html by default as no file names is included"
  - [note: it is the web server, not the browser, that serves `index.html` as the default document for a directory URL; the slide's second sentence ("if the html server does not find the html file in the url, it returns the index.html") states it correctly.]

## Topics we cover and references (slides 29–30)

- **Slide 29, "Topics we cover ( if time allowed)"** — one paragraph, verbatim, in order:
  "API Gateway, Backend for Frontend (BFF), microservice, modular monolith, service boundary, service contract, orchestration, choreography, service discovery, message broker, event-driven architecture, synchronous communication, asynchronous communication, idempotency, timeout, retry, exponential backoff, fallback, circuit breaker, bulkhead, rate limiting, load balancing, caching, cache invalidation, observability, logging, metrics, tracing, distributed tracing, health check, fault injection, chaos engineering, Chaos Monkey, API versioning, backward compatibility, deprecation, OpenAPI, Swagger, API key, secret management, least privilege, zero trust, authentication, authorization, OAuth 2.0, OpenID Connect, JWT, bearer token, token expiry, token refresh, HttpOnly cookie, SameSite cookie, CSRF, CORS, XSS, SQL injection, input validation, output encoding, TLS, public key, private key, encryption in transit, encryption at rest, AI service, AI gateway, AI orchestration, prompt, system prompt, model provider, model routing, model fallback, prompt injection, indirect prompt injection, retrieval-augmented generation (RAG), embedding, vector database, tool calling, agent, human approval step, AI output validation, AI data leakage, AI cost monitoring, AI observability"
  (89 terms.)
- **Slide 30, "References"**
  - "Note: There are more tips for you posted on the course learning hub"
  - https://medium.com/@agavitalis/how-to-deploy-a-simple-static-html-website-on-heroku-492697238e48
  - "chatGPT was used for preparation of the previous contents for proofreading and content generation of this lecture note and may be future ones"

## Prerequisites (slides 31–32)

- **Slide 31** (section divider): "HTML, CSS, JavaScript Review* from previous courses" — "* This week's lecture notes include review material from prerequisite courses. You are responsible for refreshing your understanding of this prior knowledge. Regardless of whether we cover all the slides in today's session, you are expected to be familiar with this content."
- **Slide 32, "What you are expected to know before this class:"** — "You should have a basic understanding of SQL-based database, JavaScript, HTML and CSS *based on your prior coursework*:"
  - "1- Web Development 1" — "COMP1537:  https://www.bcit.ca/outlines/20211087560/" — screenshot of outline outcomes (right edge cut off; red underlines shown in brackets):
    - "Create [JavaScript classes and objects]."
    - "Create JavaScript code that handles various types of events on th[…]"
    - "Apply the standard three-tiered web architecture (data, applicatio[…] app with that architecture."
    - "Utilize various storage mechanisms on both the client-side and se[…] requirements."
    - "Design and implement a Progressive Web Application (PWA)."
    - "Apply core JavaScript concepts such [as functions as objects], vario[…] control constructs, and [how JSON is utilized]."
  - "3- Web Development 2 *" — "COMP2537: https://www.bcit.ca/outlines/20211087580/" — screenshot:
    - "Utilize techniques to dynamically [serve web content] such as image[…]"
    - "Perform DOM manipulation via jQuery on the server-side."
    - "Utilize a [routing framework] on the server-side."
    - "Use [asynchronous programming] on the client and server"
  - "2- Relational Database Design and SQL" — "COMP1630: https://www.bcit.ca/outlines/20211086178/" — screenshot:
    - "Use SQL - DDL to [implement a] relational database."
    - "Use SQL for data manipulation such as the [basic Select statement]."
    - "Use SQL for advanced manipulation such as [Group BY, Having, Correlated subqueries]."
    - "Create stored procedures and triggers."
    - "Discuss techniques for transaction management and concurrency control."
    - (heading fragment "[L]earning Resources" at the bottom of the screenshot)
  - "* A few of you might not have taken web dev 2 due to taking co-up (sic)"

## HTML review: documents, DOM, elements, attributes (slides 33–42)

- **Slide 33** (section divider): "HTML review".
- **Slide 34, "HTML Basics"**
  - "HTML is a language that browsers ( Chrome, Internet Explorer, Microsoft Edge, Safari, Opera) understand."
  - "HTML is used to form components of a web page"
  - Code screenshot (VS Code, lines 1–11):

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

</body>
</html>
```

  - (This skeleton has no `<!DOCTYPE html>` line; slide 35 says every document must start with one.)
- **Slide 35, "HTML Documents (pages)"**
  - "All HTML documents must start with a document type declaration:"
  - "<!DOCTYPE html>."
  - "( to follow standard convention)"
  - "The HTML document itself begins with"
  - "<html> and ends with </html>."
- **Slide 36, "HTML vs CSS vs JavaScript vs DOM"** (repeated verbatim on slide 90)
  - "HTML is used to **create** the **element** of a webpage"
  - "**How** those elements are **logically attached** to each other is determined by a tree graph called **DOM**!"
  - "CSS is used to tell the browser **where** every element is placed and **how it looks**"
  - "JavaScript is used to add **interactivity** to elements of a webpage, engage with users by handling events and how to add a new element to the page **dynamically**"
  - "CSS: Cascading Style Sheets"
  - "HTML: Hyper Text Markup Language"
- **Slide 37** (no title): "Example of an html page:" / "In this example there is only pure HTML, no css, no JavaScript"
  - Code screenshot (lines 1–15):

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Page Title</title>
    </head>

    <body>

        <h1>This is a Heading</h1>
        <p>This is a paragraph.</p>

    </body>

</html>
```

  - Grey box:
    - "The `<!DOCTYPE html>` declaration defines this document to be HTML5"
    - "The `<html>` element is the root element of an HTML page"
    - "The `<head>` element contains meta information about the document"
    - "The `<title>` element specifies a title for the document"
    - "The `<body>` element contains the visible page content"
    - "The `<h1>` element defines a large heading"
    - "The `<p>` element defines a paragraph"
- **Slide 38, "HTML Document Object Model ( like a tree)"**
  - "Notice the tree-like structure of DOM model. Nested tags. We will later use JavaScript to manipulate the DOM model"
  - [figure (from Wikipedia): vertical label "DOM" / "Document Object Model" on the left; a tree drawn with connector lines: box "document" → box "Root element: <html>"; `<html>` has two children "Element: <head>" and "Element: <body>"; `<head>` → "Element: <title>" → "Text: "My title""; `<body>` → "Element: <h1>" → "Text: "A heading""; `<body>` → "Element: <a>", which has a side box "Attribut: href" (sic) and a child "Text: "Link text"".]
  - https://en.wikipedia.org/wiki/Document_Object_Model
- **Slide 39, "HTML Basics"**
  - "HTML – HyperText Markup Language"
  - "HTML is a 'markup' language. It consists of tags:  <b>This is bold</b>"
  - "An HTML script is consist of HTML elements:"

```html
<p>Hello world!</p>
```

  - [figure: blue box "open/closing Tags" with two arrows, one to `<p>` and one to `</p>`; a double-headed blue arrow under the whole line labelled "HTML Element".]
  - "Tags generally 'open' and 'close' – except for single-element tags like <img>, <br> and <hr>."
  - "HTML elements are the building blocks of HTML pages"
  - "HTML tags label pieces of content such as "paragraph", "image", and so on"
- **Slide 40, "HTML elements and their attributes"**
  - "HTML Links <a></a>"

```html
<a href="https://www.bcit.ca">This is a link</a>
```

  - "The link's destination is specified in the href **attribute**." (a thin line joins the word "attribute" to `href`)
  - "Attributes are used to provide additional information about HTML elements."
- **Slide 41, "HTML elements and their attributes"**
  - "HTML Images <img  … >"

```html
<img src="bcit.jpg" alt="bcit.ca" width="104" height="142">
```

  - "The source file (src), alternative text (alt), width, and height are provided as **attributes**.( pair:value attributes )" (thin lines join "attributes" to `src`, `alt`, `width` and `height`)
  - Q: "what does the attribute "alt" do?" A: (not on the slide)
  - Q: "Why do you think we need the attribute "alt"?" A: (not on the slide)
- **Slide 42, "What if we invent an HTML tag the browsers don't know"**
  - "Browsers do not display the HTML tags themselves, but use them to render the content between or inside them on the page."
  - "E.g. when the browser sees <p> hello </p> it does not show the <p> or </p>"
  - "Everything is inside a tag!" Q: "What does this one mean? What happens if some text is NOT inside a tag?" A: (not on the slide)
  - Q: "what if we invent new tag?" A: (not on the slide)
  - Q: "What happens if the browser does not understand a tag? Say <HelloWorld>Some text </ HelloWorld >" A: (not on the slide)
  - [note: browsers ignore an unknown tag's markup but still render its text content (it becomes an unknown inline element), and text outside any tag inside `<body>` is still displayed.]

## Internet technical terms: HTTP and URLs (slides 43–46)

- **Slide 43** (section divider): "Internet technical terms".
- **Slide 44, "HTTP Hypertext Transfer Protocol"** (the letters T, P of HTTP and "H", "T", "P" of the expansion are underlined/red to show the acronym)
  - "The transfer protocol is the set of rules that the computers use to move files from one computer to another on the Internet."
  - "The most common transfer protocol used on the Internet is the Hypertext Transfer Protocol (HTTP)."
  - "HTTPS stands for Hypertext Transfer Protocol Secure (it uses separate protocols called SSL)"
  - "Two other protocols that you can use on the Internet are the File Transfer Protocol (FTP) and the Telnet Protocol (TP)"
  - [note: HTTPS today runs over TLS, the successor of SSL (SSL itself is deprecated); and Telnet is not usually abbreviated "TP".]
- **Slide 45, "Uniform Resource Locators"**
  - "The IP address and the domain name each identify a particular computer on the Internet."
  - "However, they do not indicate where a Web page's HTML document resides on that computer."
  - "To identify a Web pages exact location, Web browsers rely on Uniform Resource Locator (URL)."
  - "URL  is a four-part addressing scheme that tells the  Web browser:"
    1. "What transfer protocol to use for transporting the file"
    2. "The domain name of the computer on which the file resides"
    3. "The pathname of the folder or directory on the computer on which the file resides"
    4. "The name of the file"
- **Slide 46, "Structure of URL (Uniform Resource Locators)"**
  - URL: `http://www.example.com/category/subcategory/index.html` ("http" in red, "www." black, the rest blue)
  - [figure: three callouts point at parts of the URL: blue callout "Internet Application Protocol" → `http`; black callout "Sub-domain" → `www`; blue callout "Top Level Domain (TLD)" → the `example.com` part (its tip lands near `.com`).]

## HTML tips and lists (slides 47–49)

- **Slide 47, "Tip1: Do not forget the end tag"**
  - "Sometimes entire page can go wrong,"
  - "However some HTML elements will display correctly, even if you forget the end tag:"
  - "Example:"

```html
<p>This is a paragraph
<p>This is another paragraph
```

  - [figure: hand-drawn red "</p>" with two red arrows pointing to the end of each line, where the missing `</p>` belongs.]
- **Slide 48, "Tips …"**
  - "Tip 2: Remember most of HTML tags are paired tags ( open and close tags), and there are few single tags like <br/>. It's a good practice to close single tags in the opening tags:" — large `<br/>`
  - "Tip3: Single tags are also referred as empty tags as there is nothing between open and close tags)"
  - "Tip 4: HTML tags are not case sensitive: <P> means the same as <p>. ( we use lower case only)"
  - [note: in HTML5 the trailing slash on void elements (`<br/>`) is optional and ignored; it is a style choice, not required.]
- **Slide 49, "HTML Lists"**
  - "HTML lists are defined with the <ul> (unordered/bullet list) or the <ol> (ordered/ numbered list) tag, followed by <li> tags (list items):"

```html
<h2>An Unordered HTML List</h2>
<ul>
  <li>Alpha</li>
  <li>theta</li>
  <li>Delta</li>
</ul>

<h2>An Ordered HTML List</h2>
<ol>
  <li>Alpha</li>
  <li>theta</li>
  <li>Delta</li>
</ol>
```

```text
An Unordered HTML List
  • Alpha
  • theta
  • Delta
An Ordered HTML List
  1. Alpha
  2. theta
  3. Delta
```

  - [figure: big blue arrow from the code to the rendered output; red hand-drawn boxes around the three `<li>` of the `<ul>` with an arrow to the bullets; red arrows at the three `<li>` of the `<ol>` with an arrow to the numbered items; red bracket around "1. 2. 3.".]

## HTML input elements (slides 50–52)

- **Slide 50** (section divider): "HTML input elements".
- **Slide 51, "Input buttons"**

```html
<input type="button" value="Try it">
```

  - [rendered: a grey button captioned "Try it".]
  - Q: "How many attributes are these (sic) in the code snipped (sic) above?" A: (not on the slide)
  - Q: "Now change the "Try it" caption to "Click me"" A: (not on the slide)
  - Q: "Now make the button linked to this image "https://media.giphy.com/media/Wsx8SB3gOyWZ2/giphy.gif"" A: (not on the slide)
- **Slide 52, "Radio buttons"**

```html
<input type="radio" name="color" value="red"> red      <br>
<input type="radio" name="color" value="green"> green  <br>
<input type="radio" name="color" value="blue"> blue
```

  - [rendered: three radio buttons "red", "green" (selected), "blue", stacked.]
  - Blue callout pointing at `name="color"`: "The browser rendered them in same group as all had the name"

## Text formatting and semantic elements (slides 53–55)

- **Slide 53, "Text formatting elements"**
  - Blue box: "Elements like <b> and <i> make text **bold** or *italic* ."
    - "<b> - Bold text"
    - "<strong> - Important text"
    - "<i> - Italic text"
    - "<em> - Emphasized text"
    - "<mark> - Marked text"
    - "<small> - Small text"
    - "<del> - Deleted text"
    - "<ins> - Inserted text"
    - "<sub> - Subscript text"
    - "<sup> - Superscript text"
  - Orange box (activity): "[--] Try all of these tags and see the results"

```html
<p>This text is normal.</p>
<p><b>This text is bold.</b></p>
<p><i>This text is italic.</i></p>
…
```

- **Slide 54, "<b> vs <strong>,   <i> vs <em>"**
  - "Both looks just the same however:"
  - "The HTML <b> element defines bold text, without any extra importance."
  - "<strong> adds *semantic* "strong" importance too." Q: "where is this helpful?" A: (not on the slide)
  - "The HTML <i> element defines italic text, without any extra importance. However <em> added semantic importance."
- **Slide 55, "Quotation and Citation semantic Elements"**

| Tag | Description |
|---|---|
| `<abbr>` | Defines an abbreviation or acronym |
| `<address>` | Defines contact information for the author/owner of a document |
| `<bdo>` | Defines the text direction |
| `<blockquote>` | Defines a section that is quoted from another source |
| `<cite>` | Defines the title of a work |
| `<q>` | Defines a short inline quotation |

  - (The text layer misaligns this table by one row; the image is authoritative and gives the pairing above.)
  - Q: "Give one example where these semantic elements are important" A: (not on the slide)

## Styling HTML with the style attribute and colours (slides 56–67)

- **Slide 56** (section divider): "HTML".
- **Slide 57** (section divider): "1- Styling HTML elements".
- **Slide 58, "Remember what the attributes of an HTML element were"**

```html
<a href="https://bcit.ca">Visit bcit!</a>
```

```html
<img src="life.gif" alt="life is good!" height="42">
```

```html
<tagname style="property:value;">
```

  - [figure: blue callout "Attribute" with arrows to `href`, `src`, `alt` and `height`; the `<tagname style="property:value;">` snippet is shown tilted in a white frame.]
  - Q: "Did you notice any difference when comparing "style" with other attributes ?" A: on slide 59.
- **Slide 59** (no title)
  - "Setting The HTML style attribute follows the same syntax as other attributes However there are two differences:"
  - "1- "style" is the default attribute of all elements versus "src" which is  only the attribute of few elements such as img and video."
  - "So **style** is a **global** attribute."
  - "2- The value of the style attribute is not a single scalar number, its an object with various property-value pairs)"
  - (the `<tagname style="property:value;">` snippet again)
  - "List of all html attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes"
- **Slide 60, "Background color"**
  - "Example: changing the background of the body."
  - "Tip: remember all HTML elements, including body, has a an attribute named style"

```html
<body style="background-color:powderblue;">

    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>

</body>
```

  - "[--] Now try it on your laptop!"
- **Slide 61, "Text color, Font type"**

```html
<h1 style="color:blue;">This is a heading</h1>
<p style="color:red;">This is a paragraph.</p>
```

```html
<h1 style="font-family:verdana;">This is a heading</h1>
<p style="font-family:courier;">This is a paragraph.</p>
```

  - Yellow box: Q: "can we set both the color and the font of an element all at once in same line?"
  - A (shown as the third snippet, with two red hand-drawn arrows pointing up at the two semicolons):

```html
<h1 style="color:blue;font-family:verdana;">This is a heading</h1
```

    (the screenshot is cut at the right edge after `</h1`)
- **Slide 62** (section divider): "Specifying colors in HTML".
- **Slide 63, "1- using a predefined color names such as"**
  - [figure: four colour swatches labelled "Orange", "Tomato", "DodgerBlue", "Gray", then "…".]
  - Q: "Guess how many predefined color names are there in HTML?" A: (not on the slide) — "check: https://www.w3schools.com/colors/colors_names.asp"
  - [note: the w3schools page lists 140 standard colour names (148 named keywords in CSS Color Level 4 counting synonyms such as grey/gray).]
- **Slide 64, "2- RGB, HEX, HSL, RGBA, HSLA values"**
  - Code screenshot (parts are covered by the "What's this?" callout):

```html
<p>Same as color name "Tomato":</p>
<h1 style="background-color:rgb(255, 99, 71);">Hello</h1>

<p>Same color but described in Hexadecimal:</p>
<h1 [illegible: covered by the "What's this?" callout]nd-color:#ff6347;">Hello</h1>

<p[illegible: covered]me "Tomato", but 50% transparent:</p>
<h[illegible: covered]nd-color:rgba(255, 99, 71, 0.5);">Hello</h1>
```

  - Rendered output (top right):

```text
Same as color name "Tomato":
Hello            (tomato background)
Same color but described in Hexadecimal:
Hello            (tomato background)
Same as color name "Tomato", but 50% transparent:
Hello            (paler tomato background)
```

  - [figure: grey callouts "Red 0 to 255" → 255, "Green 0 to 255" → 99, "Blue 0 to 255" → 71 in `rgb(255, 99, 71)`; yellow callout "What's this?" → `#ff6347`, containing the link https://www.w3schools.com/html/html_colors.asp; grey callout "Alpha value / 0 to 1 / 1:    Opaque / 0.5:  50% Opaque / 0:    Transparent" → the `0.5` in `rgba(255, 99, 71, 0.5)`.]
  - Q: "What's this?" (pointing at `#ff6347`) A: (not on the slide) [note: it is the hexadecimal form of the same colour: ff = 255 red, 63 = 99 green, 47 = 71 blue.]
- **Slide 65** (no title)
  - Q: "Which way would you prefer to refer to a color in your page?" "A) Using color names" / "B) using RGB" / "C) using hexadecimal representation" A: (not on the slide)
  - Sub-heading "Font size, Text Alignment"
  - `style="font-size:300%;“` (sic: the closing quote is a curly “ on the slide)
  - `style="text-align:center;"`
  - "center , Left, right, justify"
- **Slide 66, "Border Color"**

```html
<h1 style="border:2px solid DodgerBlue;">Hello World</h1>
<h1 style="border:2px solid Violet;">Hello World</h1>
```

  - [rendered: two "Hello World" headings, the first in a blue (DodgerBlue) 2px box, the second in a violet 2px box.]
- **Slide 67** (no title)
  - Q: "What if we wanna style a group of elements?" A: (not on the slide)
  - Q: "What if we wanna style a all the hyperlinked texts ( the ones in <a> tag in the page ?" A: (not on the slide)

## The three ways of styling (slides 68–70)

- **Slide 68, "There are 3 ways of styling HTML elements"**
  - "1- Styling HTML elements using the style attribute" — "This method is called **Inline** styling which we just learned today."
  - "2- Using <style> tags in the <head> section of same HTML file" — "This method is called **Internal** styling"
  - "3- Using an external CSS file" — "This method is called **External** styling"
  - Box: "**CSS** stands for **C**ascading **S**tyle **S**heets." / "CSS describes **where** every element is placed and **how** it looks on screen, paper, or in other media ( remember this from last week)."
- **Slide 69** (no title): "1- Styling HTML elements (inline method) using the style **attribute**" (red ellipse around "style attribute") — big blue arrow labelled "Compare with" pointing down to — "2- Styling HTML elements (internal method) using the <style> **elements** in <head>" (red ellipse around "<style> elements in <head>").
- **Slide 70, "Styling (internal method) using the <style> tags in <head>"**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        h1 {
            color: blue;
        }
    </style>
</head>

<body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
    <h1>This is also a heading</h1>
</body>

</html>
```

  - Q: "Compare with same inline method: What are the differences ( in terms of usage and scope)"

```html
<h1 style="color:blue;">This is a heading</h1>

<h1 style="color:blue;">This is another heading</h1>
```

  - A (printed): "1- In internal method, Style acts as a tag ( an element)" / "2- In internal methods all the h1 elements get affected vs in the inline method we need to set the style attribute for every single element separately"

## More HTML elements: table, div, id, class (slides 71–76)

- **Slide 71** (section divider): "More HTML elements".
- **Slide 72, "The Table Element <table>"**
  - "Key elements in forming a table:"
  - "<table> Element" — "Contains the table"
  - "<**tr**> Element" — "Contains a table **row**"
  - "<**td**> Element" — "Contains a table **data** cell"
  - "<**th**> Element" — "Contains a table **header** cell"
- **Slide 73, "HTML <div> Tag"**
  - "It creates a  section in an HTML document"
  - "Try this"

```html
<div style="background-color:lightgreen">
   <h3>This is a heading</h3>
   <p>This is a nice short paragraph.</p>
 </div>
```

  - Q: "Add another div tag to same page and place two images inside that div tag" A: (not on the slide)
  - Q: "Now by using only one a tag ( anchor tag) link both images to BCIT" A: (not on the slide)
- **Slide 74** (section divider): "Two more global attributes:".
- **Slide 75, "id, a global attribute"**
  - "Remember what was an element"
  - "Remember what was an attribute . Attribute like src of an image element. Or href of an a element"
  - "Some attributes where (sic) global like "style"."
  - "When we say "style" is a global attribute that means we can set the value of style attribute for every single HTML element"
  - "There is another attribute which is global too. It is called "id"."
  - "**Its value has to be unique**. Just like your student id, there is only one students in this class with your student id. We can give any value to the id." (the end, "any value to the id.", is hidden behind the screenshot; recovered from the text layer)
  - "There has to be only one element in that page with same id" (end hidden; text layer)
  - "Example" / `<h1 id="myHeader">Hello World!</h1>` (mostly hidden behind the callout; recovered from the text layer)
  - Code screenshot (hand-drawn red "id" label and a red bracket around the three `id` attributes):

```html
<h1 id="myHeader">Hello World!</h1>
<p id="id1">Hello World!</p>
<p id="id2">Hello World!</p>
```

  - Blue callout pointing at the bracket: "As seen all of these elements have different id  values"
- **Slide 76, "class, a global attribute"**
  - "There is also another attribute which is global too. It is called "class"."
  - "**Its value dose not have to be unique**. That means, multiple elements in the page can have same class value"
  - "There has to be only one element in that page with same id"
  - "Example"

```html
<h1 class= "greenPeople" id="myHeader">Hello World!</h1>
```

  - Code screenshot:

```html
<h1 class = "bb" id = myHeader"> Welcome to BCIT </h1>
<p  class = "bb" id = id1"> BCIT is good </p>
<p  class = "green" id = id2"> Welcome to Vancouver </p>
<p  class = "green" id = myVancouver"> Vancouver is rainy! </p>
```

  - [note: every `id` value in this screenshot is missing its opening quote, so the browser reads unquoted values such as `myHeader"` (the stray `"` becomes part of the id). Transcribed as shown.]
  - Green callout pointing at `class = "green"`: "Its ok to give same class value to multiple elements"

## CSS: rule-sets and selectors (slides 77–87)

- **Slide 77** (section divider, rotated text): "CSS language for styling".
- **Slide 78, "Selectors in CSS"**
  - "CSS is used to define styles, design, layout and variations in display for different devices and screen sizes."
  - "A CSS **rule-set** consists of a **selector** and a **declaration block**:"

```css
h1 {
color: red;
font-size: 12pc;
}
```

  - Green callout pointing at `color: red`: "Property **name**: Property **value**"
  - "The **selector** points to the HTML element you want to style." (blue arrow from "selector" to `h1`)
  - "The declaration block contains one or more declarations separated by **semicolons**." (two blue arrows from "semicolons" to the two `;`)
  - "Each declaration includes a CSS property **name : value** pair."
  - "A CSS declaration always ends with a semicolon, and declaration blocks are surrounded by curly braces."
  - [note: in real CSS the semicolon after the last declaration in a block is optional; "always ends with a semicolon" is the w3schools convention. Also, `12pc` is 12 picas (= 192px), not 12 points.]
- **Slide 79** (section divider): "CSS **selectors**".
- **Slide 80, "Selectors"**
  - "A CSS **rule-set** consists of a selector and a declaration block:"

```css
h1 {
color: red;
font-size: 12pc;
}
```

  - [figure: coloured circles mark the anatomy: light-blue circle around `h1` (selector); green circles around `{` and `}` (braces); red circles around the two `:` (name/value separators); dark-blue and black circles around the two `;` (declaration terminators).]
  - "CSS **selectors** are used to "find" (or select) HTML elements based on their" — "element name," / "id," / "class," / "attribute," / "and more."
- **Slide 81, "element  selector"** — "The element selector selects elements based on the element name."

```html
<head>
  <style>
    p {
      text-align: center;
      color: blue;
    }
  </style>
</head>

<body>
  <h3>This is a text</h3>
  <p>This is a text</p>
  <p>This is a text</p>
</body>
```

```text
This is a text            (h3: bold, left, black)
        This is a text    (p: centred, blue)
        This is a text    (p: centred, blue)
```

  - (red hand-drawn marks on the `p` selector and on both `<p>` tags)
- **Slide 82, "id  selector"** — "The id selector uses the id **attribute** of an HTML **element** to select a specific element."

```html
<head>
  <style>
    #firstId {
      text-align: center;
      color: blue;
    }
  </style>
</head>

<body>
  <p id="firstId">This is a text</p>
  <p>This is a text</p>
</body>
```

```text
        This is a text    (centred, blue)
This is a text            (left, black)
```

  - (red underlines on `#firstId` and `"firstId"`)
  - Blue box: "Note: The **id** of an element should be **unique** within a page, so the id selector is used to select one unique element!"
  - Q: "what would happen if we set the id attribute of the  second p element to firstId too?" A: "bad practice"
  - [note: in practice browsers still apply the `#firstId` rule to both elements; the page is invalid HTML and `getElementById` returns only the first.]
- **Slide 83, "class selector"**
  - "Remember "class" was also one of the global attributes of all HTML elements"
  - "The class selector selects elements with a **specific class attribute**."
  - Q: "Now style the previous example using the class attribute" — answered by the code below.

```html
  <style>
    .firstClass {
      text-align: center;
      color: blue;
    }
  </style>
</head>

<body>
  <p class="firstClass">This is a text</p>
  <p>This is a text</p>
</body>
```

    (the opening `<head>` is hidden behind the question text)

```text
        This is a text    (centred, blue)
This is a text            (left, black)
```

  - (red marks on the `.` of `.firstClass` and under `class="firstClass"`)
  - Q: "what would happen if we set the class attribute of the  second p element to firstClass too?" A: (not on the slide)
- **Slide 84, "mix and match selectors"**
  - Q: "In the HTML code below, there are three elements of type p and h3. Two of the elements have both the same class attribute "myClass". Without using id attribute and without using inline styling how can you change the color of first p tag tag (sic) to blue?"
  - Question code (left, cut off at the right by the answer panel):

```html
<body>
  <h3 class="myClass">Th[…]
  <p class="myClass">Thi[…]
  <p>This is text 3</p>
</body>
```

  - A (right panel):

```html
<head>
  <style>
    p.myClass {
      color: blue;
    }
  </style>
</head>

<body>
  <h3 class="myClass">This is text 1</h3>
  <p class="myClass">This is text 2</p>
  <p>This is text 3</p>
</body>
```

```text
This is text 1    (h3: bold, black)
This is text 2    (blue)
This is text 3    (black)
```

  - [figure: two green hand-drawn arrows: one from `<p` of the second element up to `p` in `p.myClass`, one from `"myClass"` of the same element up to `.myClass`.]
- **Slide 85, "More than one class for an element"**
  - "HTML elements can refer to more than one class"
  - "Here the <p> element will be styled according to class="center" and to class="large""

```html
<head>
  <style>
    .center {
      text-align: center;
    }

    .large {
      font-size: 200%;
    }
  </style>
</head>
<body>
  <p class="center">Center-aligned.</p>
  <p class="center large">Center-aligned and large</p>
</body>
```

```text
        Center-aligned.               (centred, normal size)
  Center-aligned and large            (centred, 200% size)
```

  - (green marks on `.center`, `.large`, and under `center` and `large` in `class="center large"`; a cut-off `</html>` at the bottom)
- **Slide 86, "Grouping selectors"** "(separate each selector with a comma)"
  - Left (before):

```css
<style>
  h1 {
    text-align: center;
    color: green;
  }

  h2 {
    text-align: center;
    color: green;
  }

  p {
    text-align: center;
    color: green;
  }
</style>
```

  - A blue curly brace groups the three rules and points to (after):

```css
<style>
  h1, h2, p {
    text-align: center;
    color: green;
  }
</style>
```

    (the two commas are circled)
  - A curved arrow leads to the preferred layout, with the blue box "Better practice to place selectors underneath each other":

```css
<style>
  h1,
  h2,
  p {
    text-align: center;
    color: green;
  }
</style>
```

- **Slide 87, "CSS comments"**

```css
<style>
  p {
    color: yellow;
    /* This is a single-line comment */
  }
  /* This is
    a multi-line
    comment */
</style>
```

  - Q: "complete these three sections of exercises here : https://www.w3schools.com/css/exercise.asp?filename=exercise_syntax1" (the middle of the URL is covered by a menu screenshot; full URL from the text layer). The menu screenshot lists the three sections: "CSS Syntax", "CSS How To...", "CSS Background". A: (not on the slide)

## Introduction to JavaScript (slides 88–110)

- **Slide 88** (section divider): "Introduction to" (the rest of the title, presumably a logo image, is not rendered).
- **Slide 89** (section divider): "Let's see few example what **JavaScript** can do"
- **Slide 90, "HTML vs CSS vs JavaScript vs DOM"** — identical to slide 36 (see above).
- **Slide 91, "Example 1 Document write"**
  - "Document write to write some HTML contents on screen (browser's screen)"

```html
<!DOCTYPE html>
<html>

<body>

    <script>
        document.write("Hello World!");
    </script>

</body>

</html>
```

  - (red underline under `<body>`, red arrows at `<script>` and `</script>`)
  - "Note 1: to place JavaScript in our HTML page we use the element <script> </script>"
  - "Note2: we can place JavaScript code in <head> or in the <body>"
  - Blue oval (activity): "Try document.wirte(“Hello **<b>**world**</b>**!”)" (sic: "wirte")
  - [note: `document.wirte` is a typo for `document.write`; typed as shown it throws `TypeError: document.wirte is not a function`. The curly quotes would also be a syntax error if pasted.]
- **Slide 92, "Note! JavaScript runs in the browser (not outside it)"**
  - "**Note**: When we say document.write write on screen; by screen we always mean **browser's screen** as JavaScript only runs within the browser; it cannot do anything outside browser."
  - "JS cannot delete your files for example. ( you cannot write a JavaScript code to delete a file from your local hard-drive or server hard-drive! )"
  - [note: this holds for JavaScript in the browser sandbox only. JavaScript run by Node.js (used later in this course for the backend) runs outside the browser and can delete files, e.g. with `fs.unlink`.]
- **Slide 93, "Example 2 Console log"** — "Writing on console"

```html
<!DOCTYPE html>
<html>

<body>

    <script>
        console.log("Hello World!");
    </script>

</body>

</html>
```

```text
Hello World!
```

  - [figure: Chrome tab "test.html", address "temp/test.html", DevTools open on the "Console" tab (tabs: Elements, Console, Sources, Network, Performance, Memory, Applicatio[n]; filter bar "top", "Filter", "Default levels ▾", "Group similar"); the console line "Hello World!" is circled in red; red underline under `console.log` in the code; lower drawer shows "Console" / "What's New ×", "Highlights from the Chrome 68 update", "Eager evaluation".]
- **Slide 94, "Here is how to open console window in Chrome"** — "Note the debugging tools in there"
  - [figure: browser menu screenshot with red hand-written numbers: **1** circled on the ⋮ (three-dot) menu button at the top right; **2** circled on "More Tools"; **3** circled on "Developer tools  Ctrl+Shift+I" in the More Tools submenu; **4** circled on the "Console" tab of the DevTools panel (tabs "Elements", "Console"; console shows "11"). Main menu items: "New Tab Ctrl+T", "New Window Ctrl+N", "New Stealth Mode Window Ctrl+Shift+N", "History", "Downloads Ctrl+J", "Bookmarks", "Zoom − 100% +", "Print... Ctrl+P", "Cast...", "Find... Ctrl+F", "More Tools", "Edit  Cut  Copy  Paste", "Security & Privacy Center", "Settings", "Help and About AVG Secure Browser", "Exit Ctrl+Shift+Q". Submenu: "Save Page As... Ctrl+S", "Create shortcut...", "Privacy Cleaner... Ctrl+Shift+Del", "Extensions", "Task manager Shift+Esc", "Developer tools Ctrl+Shift+I".] (The screenshot is of AVG Secure Browser, a Chromium browser, not Chrome itself.)
- **Slide 95, "Example 3 pop up alert message"**

```html
<body>

    <script>
        window.alert("Hello World!");
    </script>

</body>
```

```text
This page says
Hello World!
[OK]
```

  - [figure: browser tab "test.html" with a modal dialog "This page says / Hello World! / OK"; a red arrow points up at the greyed back/forward buttons with a red "?".]
  - "Note: use of alert is not recommended."
  - Q: "why?" A: "due to bad user experience"
  - Blue oval (activity): "Try alert(“Hello **<b>**world**</b>**!”)"
  - [note: `alert` shows plain text, so the `<b>` tags appear literally; unlike `document.write`, it does not render HTML.]
- **Slide 96, "Example 4. Modifying HTML contents of an element"**
  - "This one is very interesting!"
  - "Remember the attribute "id" we mentioned today?"
  - Code (editor lines 6–15; lines 9–11 partly hidden by a callout):

```html
<h2>My First Web Page</h2>
<p>My First Paragraph.</p>
<b>a Paragraph with bold contents.</b>

<p id="demo"> result will appear here</p>

<script>
    document.getElementById("demo").innerHTML = 5 + 6;
</script>
```

```text
My First Web Pa[ge]      (heading, partly hidden by the callout)
My First Paragraph.
a Paragraph with bold contents.     (bold)
11
```

  - Callout pointing at `result will appear here`: Q: "Why this test message never appeared?"
  - A (callout): "It did appear but was immediately replaced by what our js code generated"
- **Slide 97, "Summary of examples so far"**
  - "Writing into the HTML output using **document.write()**."
  - "Writing into the browser console, using **console.log()**."
  - "Writing into an alert box, using **window.alert()**."
  - "Writing into an HTML element, using **innerHTML**."
- **Slide 98, "In class activity 1"**
  - "Correct the displayed message ( whatever day today is)."
  - "You are only allowed to change the content of the <script> element"

```html
<body>
    <h2>Display correct statement</h2>
    <b id="blabla"> Topday is Monday!</b>

    <script>

    </script>

</body>
```

  - ("Topday" is as typed in the screenshot.) A: (not on the slide)
- **Slide 99, "Example 5"** — "With JavaScript we can set the src attribute of an img element"

```html
<body>

    <b> This img tag(element) had nothing a millisecond ago!!!</b>
    <img id="wazzapp" />
    <script>
        document.getElementById("wazzapp").src = "./images/elf.png";
    </script>
</body>
```

  - [figure: red hand-written numbers underline the four parts of the statement: **1** under `document.getElementById`, **2** under `("wazzapp")`, **3** under `.src`, **4** under `"./images/elf.png"`.]
- **Slide 100, "In class activity 2"**
  - "Fill up the following empty img tags with 3 different images"
  - "Note 1! You are only allowed to change the content of the <script> element"
  - "Note 2! Store images in a separate folder named "imgs""

```html
<body>
    <img id="img1" />
    <img id="img2" />
    <img id="img3" />
    <script>
        // something goes here to fill up images
    </script>
</body>
```

  - Orange callout pointing at the `//` comment: "BTW it's a comment! Means it is for us, developers. Browser does not execute it"
  - A: (not on the slide)
- **Slide 101, "Variables in JavaScript"**
  - "With the keyword "let" we declare variables in Javascript."
  - "We can apply arithmetic operations like +,* … on variables"
  - "Test it for yourself"

```html
<body>
    <script>
        let x = 5;
        let y = 6;
        console.log(x + y)
    </script>
</body>
```

  - (red underlines under `<script>`, both `let`, and `</script>`)
  - "We can also use "var" to declare variables in JavaScript"
  - "There are differences that we discuss later"

```js
var age = 32;
var myName = "John";
```

  - [note: slide 16's course style rule says never use `var`; it appears here only as review.]
- **Slide 102, "Example 6"** — "We can update variables in JavaScript"

```html
<script>
    let x = 5;
    let y = 6;
    y = y + 9;
    console.log(y)
</script>
```

  - (No output printed on the slide; it logs 15.)
- **Slide 103, "Example 7 String variables"** — "We can store text in variables. They are called "string " variable by comp sci community"

```html
<script>

    let name = "John McDonalds";
    console.log(name);
</script>
```

- **Slide 104, "Example 8 String variables cont."**
  - "We can do strange stuff with JavaScript strings. Try to see what happens if we do this :"

```js
Console.log(“John is” + “attending  school”);
```

  - (Shown as plain slide text with curly quotes and a capital `C`.) A: (not on the slide)
  - [note: as typed it fails: the curly quotes are a SyntaxError, and `Console` (capital C) is not defined. Written as `console.log("John is" + "attending  school");` it prints `John isattending  school`: `+` concatenates the strings with no space added.]
- **Slide 105, "Example 9  comments in JavaScript"** "( vs comments in HTML, CSS" (sic, unclosed parenthesis)

```html
    <style>
        h1 {
            color: blue;
            /* This is a comment in CSS */
        }
    </style>
</head>
<body>
    <h1 id = "someId" > Welcome! </h1>
    <!-- this is a comment in HTML -->
    <script>
            let myVar = 900;
            // This line will not be executed.
            var age = 32;
            /* this is a multiple
            line comment */
            var myName = "John";
```

  - (the last line is half cut off at the bottom of the screenshot; the left edge cuts the `<` of `</head>` and `<body>`)
  - [figure: four unlabelled blue arrows from the right point at the four comments: the CSS `/* … */`, the HTML `<!-- … -->`, the JS `//` line, and the JS multi-line `/* … */`.]
- **Slide 106, "Decision Making: Equality and Relational Operators"**
  - "Decision based on the truth or falsity of a condition"
  - "Equality operators"
  - "Relational operators"
  - [illegible: the operator table that these headings introduce is not present in the rendered page or the text layer]
- **Slide 107, "Decision Making: Equality and Relational Operators"**
  - [illegible: the slide shows only an empty rounded rectangle and two stray glyphs "≥" and "≤"; the operator table did not render in the PDF and the text layer has no content for it]
- **Slide 108, "Example 10 decision making"**

```text
Syntax:
if (condition) {
block of code to be executed if the condition is true
}
```

```html
<script>
    let age = 23;
    if (age > 18) {
        document.write = "you are an adult!";
    }
</script>
```

  - (editor lines 5–10)
  - [note: `document.write = "…"` assigns a string over the `write` method instead of calling it, so nothing is displayed; the intended line is `document.write("you are an adult!");`.]
- **Slide 109, "In class activity"**
  - "Modify this script to show "you are an adult " in green if your age is >18."

```html
<p>Hello there!</p>
<p id="message"></p>
<script>
    let age = 3;
    if (age > 18) {
        //print "you are an adult" in green
    }
</script>
```

  - Blue box: "Tip: you need to do it in two lines" / "First line to change the innerHTML" / "Second line to change style of tag p" / "You are not allowed to touch anything outside script tag"
  - A: (not on the slide)
  - [note: with `let age = 3;` the condition is false, so nothing shows until the age is changed.]
- **Slide 110, "Example 11 loop through variables"**
  - "In JavaScript we can create a loop. Each iteration picks the next value of i."
  - "i++ means, increment i by one on every iteration"
  - "That means everything between {} will be first executed for i being 0"
  - "Then goes back to for and executes everything between {} for i being 1"
  - "…"
  - "and lastly for i being 9"

```js
var i;
for (i = 0; i < 10; i++) {
    console.log(i);
}
```

  - (Output not printed on the slide: 0 through 9, one per line.)

---

## Facts and numbers index

- Total deck: 188 PDF pages; this file covers 1–110 (part A).
- Outline: 8 items (slide 2): application design question, OOP review, Chrome debugging/developer tool, coding style rules, HTML review, CSS review, JavaScript review, Hosting tips.
- Why web apps are harder: 4 bullets (slide 3): unreliable networks/browsers/devices/servers; users close page, lose connectivity, limited hardware, unexpected input; separate concerns so UI, server-side logic and data evolve and fail independently; identify device, network, performance, security and privacy constraints first.
- Web vs Java desktop challenges table: 9 rows (slide 4).
- Device/scenario exercise: 5 devices (mobile, tablet, browser, PC, IoT nodes) × 3 scenarios (not connected, local network, internet); notation M.1 = mobile not connected, i.3 = IoT node on internet; slide claims "a total of 12 scenarios" (slide 5).
- Factors to consider: 6 listed (security, memory available, multitasking, CPU speed, GPU speed, device sensors: GEO, vibration, camera) (slide 5).
- Inheritance = "is-a" relationship; `class Car extends Vehicle`, `super(brand)` (slide 7).
- Composition = "has-a" relationship; Car has an Engine passed into its constructor (slide 8).
- String interpolation: automatic replacing of variables with real values, using backtick characters (slide 8).
- Key advantage of composition over inheritance: you can swap out the Engine for another type without changing the Car class (slide 9).
- Tesla: `new ElectricCar('Tesla', 80)`; Ferrari: `new SportsCar('Ferrari', new Engine('V8'))`; outputs on slide 12.
- DevTools figure: 7 numbered regions: 1 Sources tab, 2 file navigator, 3 Console tab, 4 line-number gutter/breakpoints (lines 8 and 16), 5 debugger step controls + Breakpoints list, 6 Scope/Watch pane, 7 Network tab; opened via More tools → Developer tools, Ctrl+Shift+I (slide 13).
- Button exercise: n between 3 and 10, defined at top of code (slide 15).
- Coding style rules (slide 16): const first, let otherwise, never var; descriptive names; no needless globals; classes/constructors to encapsulate; one task per function, avoid side effects; function fits on one screen without scrolling; user-facing strings in separate JS/JSON files; no hard-coded user-facing strings or lose marks; centralized message display; placeholder format "Your score is %1 for today".
- Term project: group size max 4; microservice API server; endpoints powered by pre-trained AI models from Hugging Face; host LLM models; client app with simple user management and authentication; 5 example services: AI services, API gateway, Authentication services, Database services, User management (slide 17).
- Server: kept on 24/7, connected to the internet, has a unique address (slide 19).
- Hosting account must provide 3 things: 1) relational database server, 2) hosting multiple Node.js projects at the same time, 3) SSL certificate (slide 21).
- Relational DBs named: mySQL, Postgres, "Marina DB", MariaDB (slide 21).
- 4 hosting plan types: Shared, VPS, Dedicated, Cloud (slides 21–23).
- Shared: hundreds (or thousand) of sites share memory, disk, CPU, DB server, mail server; cheapest, may be slowest; a right shared plan suffices for this course (slide 22).
- VPS: shares a server but you get your own virtual private server, fewer sites, likely faster (slide 22).
- Dedicated: single physical machine; you control CPU, RAM, hard disk (slide 23).
- Cloud: multiple machines act as one system to handle high traffic or spikes (slide 23).
- Shared hosting OS: 2 types, Linux and Windows; Linux generally cheaper (slide 23).
- Shared hosting is easier to manage via panels such as cPanel (slide 24).
- Domain registrars named: GoDaddy, Register.com, networksolutions.com (slide 25); example split: hosting from glowhost.com, domain from goDaddy.ca (slide 27).
- Folder convention example: `…/comp4537/labs/1/…` (slide 26).
- `index.html` is returned by default when the URL names a directory with no file name (slide 28).
- "Topics we cover": 89 comma-separated terms (slide 29).
- ChatGPT used for proofreading and content generation of the lecture notes (slide 30); slide 11 code "assisted by ChatGPT, OpenAI".
- Prerequisites: COMP1537 Web Development 1, COMP1630 Relational Database Design and SQL, COMP2537 Web Development 2 (slide 32).
- All HTML documents must start with `<!DOCTYPE html>`; the document begins with `<html>` and ends with `</html>` (slide 35).
- `<!DOCTYPE html>` defines the document to be HTML5; `<html>` is the root element; `<head>` holds meta information; `<title>` the document title; `<body>` the visible content; `<h1>` a large heading; `<p>` a paragraph (slide 37).
- HTML = Hyper Text Markup Language; CSS = Cascading Style Sheets (slides 36, 68, 90).
- HTML creates elements; DOM (tree graph) says how they are logically attached; CSS says where each element is placed and how it looks; JavaScript adds interactivity, handles events, adds elements dynamically (slides 36, 90).
- Single-element tags: `<img>`, `<br>`, `<hr>` (slide 39).
- Attributes provide additional information about elements; `href` gives a link's destination (slide 40).
- `<img>` attributes on the slide: src, alt, width="104", height="142"; "pair:value attributes" (slide 41).
- HTTP = Hypertext Transfer Protocol; HTTPS = Hypertext Transfer Protocol Secure, "uses separate protocols called SSL"; other protocols FTP and Telnet ("TP") (slide 44).
- URL is a four-part scheme: transfer protocol, domain name, folder/directory pathname, file name (slide 45).
- URL figure labels: "Internet Application Protocol" = http, "Sub-domain" = www, "Top Level Domain (TLD)" (slide 46).
- Tips: 1 don't forget end tag; 2 most tags paired, close single tags like `<br/>`; 3 single tags = empty tags; 4 tags not case sensitive, use lower case (slides 47–48).
- Lists: `<ul>` unordered/bullet, `<ol>` ordered/numbered, `<li>` list items (slide 49).
- Radio buttons with the same `name` are rendered in the same group (slide 52).
- 10 text formatting elements: b, strong, i, em, mark, small, del, ins, sub, sup (slide 53).
- `<b>`/`<i>`: no extra importance; `<strong>`/`<em>`: semantic importance (slide 54).
- 6 quotation/citation elements: abbr, address, bdo, blockquote, cite, q (slide 55).
- `style` vs other attributes: 2 differences: style is global (vs `src` only on few elements like img, video); its value is property-value pairs, not a single scalar (slide 59).
- RGB components each 0 to 255; alpha 0 to 1 (1 opaque, 0.5 50% opaque, 0 transparent); Tomato = rgb(255, 99, 71) = #ff6347 (slide 64).
- 5 colour value forms in the title: RGB, HEX, HSL, RGBA, HSLA (slide 64).
- `font-size:300%`; text-align values: center, left, right, justify (slide 65).
- Border example: `border:2px solid DodgerBlue` (slide 66).
- 3 ways of styling: Inline (style attribute), Internal (`<style>` in `<head>`), External (CSS file) (slide 68).
- Internal vs inline: style acts as an element; internal affects all h1 elements vs inline set per element (slide 70).
- Table: 4 key elements: `<table>`, `<tr>` row, `<td>` data cell, `<th>` header cell (slide 72).
- `<div>` creates a section in an HTML document (slide 73).
- Global attributes: style, id, class ("Two more global attributes") (slides 59, 74–76).
- `id` value must be unique; only one element per page with the same id (slide 75); `class` value need not be unique (slide 76).
- CSS rule-set = selector + declaration block; declarations separated by semicolons; each declaration is a name : value pair; always ends with a semicolon; block surrounded by curly braces (slide 78).
- Selectors find elements by: element name, id, class, attribute, and more (slide 80).
- Element selector `p`; id selector `#firstId`; class selector `.firstClass`; combined `p.myClass`; multiple classes `class="center large"`; `.large { font-size: 200%; }` (slides 81–85).
- Duplicate id: "bad practice" (slide 82).
- Grouping selectors: separate with commas; better practice to place selectors underneath each other (slide 86).
- CSS comments `/* … */`, single- and multi-line (slide 87); HTML comment `<!-- … -->`; JS `//` and `/* … */` (slide 105).
- 3 w3schools exercise sections: CSS Syntax, CSS How To..., CSS Background (slide 87).
- JavaScript goes in `<script> </script>`, in `<head>` or `<body>` (slide 91).
- JavaScript only runs within the browser; cannot delete files from local or server hard-drive (slide 92).
- Open the console: ⋮ menu (1) → More Tools (2) → Developer tools Ctrl+Shift+I (3) → Console tab (4) (slide 94).
- alert not recommended: bad user experience (slide 95).
- `document.getElementById("demo").innerHTML = 5 + 6;` displays 11 (slide 96).
- 4 ways to output (slide 97): document.write(), console.log(), window.alert(), innerHTML.
- Example 5: set `src` with `document.getElementById("wazzapp").src = "./images/elf.png";` (4 numbered parts) (slide 99).
- Activity 2: 3 images, folder named "imgs" (slide 100).
- `let` declares variables; `var` also works, differences discussed later (slide 101).
- Example 6: y = 6 + 9 → 15 (slide 102).
- Example 10: `let age = 23; if (age > 18)` (slide 108); activity: `let age = 3;` (slide 109).
- Example 11: `for (i = 0; i < 10; i++)` runs for i = 0 … 9 (10 iterations); `i++` increments by one (slide 110).

## Likely quiz traps

- Inheritance is "is-a", composition is "has-a"; the slide's stated key advantage of composition is swapping the Engine without changing the Car class (slides 7–9).
- In `SportsCar`, inheritance and composition are combined: `SportsCar extends Car` (is-a) and holds an `Engine` (has-a); `ferrari.accelerate()` returns "Ferrari is accelerating with a The V8 engine is starting." with the odd "a The" (slides 11–12).
- Course style rule: use `const` by default, `let` otherwise, and **never** `var`, even though slides 101, 105 and 110 use `var` in review examples (slides 16, 101, 110).
- Hard-coded user-facing strings in assignment code lose marks; dynamic strings use a placeholder such as "Your score is %1 for today" (slide 16).
- Term project group size is max 4 (slide 17).
- The hosting account must provide exactly three things: relational DB server, multiple Node.js apps at once, SSL certificate (slide 21).
- Shared hosting is the cheapest and "might be the slowest", yet "a right shared plan would suffice" for this course (slide 22).
- A domain name is **not** required for the course (slides 25, 27); hosting and domain can come from different companies (slide 27).
- `index.html` is opened by default when no file name is given in the URL (slide 28).
- URL is a **four**-part scheme: protocol, domain name, directory pathname, file name (slide 45); in the figure, `www` is the Sub-domain (slide 46).
- `<b>` and `<strong>` look the same but only `<strong>` adds semantic importance; likewise `<i>` vs `<em>` (slide 54).
- `style` is a global attribute and its value holds property-value pairs, unlike `src`, which only a few elements have (slide 59).
- RGB values range 0 to 255; alpha ranges 0 to 1 where 0 is transparent and 1 opaque (slide 64).
- `id` must be unique; `class` need not be. Duplicate ids are "bad practice" (slides 75, 76, 82).
- `p.myClass` selects only `<p>` elements with class `myClass`, not the `<h3>` with the same class (slide 84).
- `alert` is not recommended because of bad user experience (slide 95); in Example 4 the placeholder text did appear but was immediately replaced by the JS-generated value 11 (slide 96).
- Slide 5 says 12 scenarios although its own lists give 5 × 3 = 15 combinations: a likely trick if keyed to the slide.

---

<!-- Part B -->

# Lecture 1, part B: slides 111–188

Deck: COMP 4537 Lecture 1, "review OOP, Codying (sic) Style, Chrome Dev tool, review HTML CSS JS, Hosting, AI architecture" (instructor Amir Amintabar, Fall 2026).
File: `D:\BCIT\COMP4537\txt\COMP4537-Lecture1-review-OOP-Codying-Style-Chrome-Dev-tool-review-HTML-CSS-JS-Hosting-AI-architecture.txt`; rendered pages `D:\BCIT\COMP4537\png\L1\p001.png` … `p188.png` (188 pages in the deck). This file covers **slides 111–188 only** (78 slides); slides 1–110 are in part A.
Transcribed 2026-10-27.

Summary: this half of the deck is a JavaScript-then-CSS review. It opens with a second outline, then covers the six primitive data types plus objects, `===` vs `==` and the falsy values, `var`/`let`/`const` scope (block vs function), `const` with primitives vs objects, `null` vs `undefined`, arrays (`push`/`pop`, sparse indices), identifier naming rules, a `mul`/`add` practice, a deeper `var` vs `let` section (hoisting, `window` properties, strict-mode redeclaration, summary table), event handling (inline vs in a script block), JavaScript objects (literals, constructors, `Date`, `typeof`, nested objects, a constructor with a method), the DOM (tree figure, `createElement`/`appendChild`, `getElementsByTagName`), user input (`<input>`, `prompt`), `setTimeout`/`setInterval` and the event queue ("1 3 2"), argument vs parameter, coding style rules for assignments (no `var`, no hard-coded strings, separation of concerns), "every function returns undefined", arrow functions, and CSS review part 2 (inline/internal/external styling, box model, `display`, `visibility`, `position`, combinators, specificity, absolute and relative units).

Slide numbers are PDF pages (they match the printed slide numbers). Red/blue/green freehand marks on some slides are the instructor's live ink; they are described where they carry meaning.

---

## Section divider and second outline (slides 111–112)

- **review** (slide 111): section divider; the single word "review".
- **Outline** (slide 112). The list, in order:
  - Review
  - JavaScript Object
  - Handling events
  - var vs let vs const
  - Variable hoisting in var
  - setTimeout and order of executions ( due to being asynchronous event loop)
  - CSS review part 2
  - HTML Web Storage
  - Json: JavaScript Object Notation
  - Using same event handler for multiple buttons
  - Object constructor with methods

  [note: HTML Web Storage, JSON and "same event handler for multiple buttons" do not appear anywhere in slides 113–188; they are listed in the outline only.]

## Data types in JavaScript (slide 113)

- **Datatypes in JavaScript** (slide 113):
  - "Tip: There are six primitive data types and one object type in Javascript ECMA6"
  - "•Six primitive datatypes"
    1. "Boolean. `true` and `false`."
    2. "null. denoting a null value. Because JavaScript is case-sensitive, `null` is not the same as `Null`, `NULL`."
    3. "undefined. Basically means uninitialized."
    4. "Number. `42` or `3.14159`."
    5. "String. "Hello BCIT""
    6. "Symbol (new in ECMAScript 2015). A data type whose instances are unique and immutable."
  - "• Objects"

    ```js
    let x = { firstName: "John", lastName: "Doe" };
    Note: Arrays are also of type objects in JavaScript.
    ```
  [note: modern JavaScript (ES2020+) has seven primitives: BigInt was added. The "six primitives" count is correct for ES6/ES2015, which is what the slide names.]

## === vs == and falsy values (slide 114)

- **JavaScript === vs ==** (slide 114):
  - "The == (or !=) operator performs an automatic type conversion if needed."
  - "The === (or !==) operator will not perform any type conversion. It first compares if both sides have the same type, then compares the values"
  - "QB : which of the following statements is true ?"
  - Code screenshot (the comments are the slide's own answers):

    ```js
    [10] === 10    // is false
    [10]  == 10    // is true
    '10' == 10     // is true
    '10' === 10    // is false
     []   == 0     // is true
     [] ===  0     // is false
     '' == false   // is true but true == "a" is false
     '' ===   false // is false
    ```
  - Blue box: "Tip: undefined, null, 0, false, NaN, '' (empty string) are all *falsy*." (one item per line, "falsy" in yellow italics).
  - Beside it: "Means in the condition part of if statement all of them mean false"

## var / let / const scope (slides 115–117)

- **Variable Declarations and variable Scopes** (slide 115):
  - "**var**: Declares a **function-scoped** variable."
  - "**let**: Declares a **block-scoped**, variable."
  - "**const**: Declares a **block-scoped** const. Will make only **primitive** variables constant ( cannot be changed later once declared);"
  - Orange box:

    ```js
    const Pi = 3.14;
    Pi = 90;    // Uncaught TypeError: Assignment to constant variable.
    ```
  - Orange box: "variable Pi was once initialized at the time of declaration using const and cannot be initialized/ modified again."
  [note: `const` stops reassignment of the binding for every type, objects included; what it does not do is freeze an object's properties. "Only primitive variables" is the slide's way of saying object contents stay mutable (see slide 129).]
- **Declaration using const …** (slide 116):
  - "Q: which one issues an error message?"
  - "Declaring  a constant object and modifying it"
  - "Declaring a constant primitive variable and then modifying it"
  - A: (not on the slide)
- **Scope of Declarations by var, let, const:** (slide 117). Three code columns side by side:

  Column 1:
  ```js
  {
   var a = 10;
  }
  console.log(a);
  ```
  Column 2:
  ```js
  {
   let a = 10;
  }
  console.log(a);
  ```
  Column 3:
  ```js
  {
   const a = 10;
  }
  console.log(a);
  ```
  - "What does console.log(a) print on console ?"
  - Answer table under the columns:

    | | var | let | const |
    |---|---|---|---|
    | prints | **10** | **Uncaught ReferenceError: a is not defined** | **Uncaught ReferenceError: a is not defined** |
    | scope | Function scoped | Block Scoped | Block Scoped |

## null vs undefined (slide 118)

- **JavaScript Null vs Undefined** (slide 118):
  - "JavaScript is a dynamic language"
  - "If we don't initialize it by default its value is **undefined** ( because its type is undefined)"
  - "We use **null** in the situation when *we explicitly want to clear the value of the variable.*"
  - "For example you wanna present the list of color to the user to select from, but the user has not selected any color yet,"
  - "you can set that variable selectedColor = null. Or  user has selected the color but we wanna clear the selection of color"
  - "remember in MVC a variable might be bound to view so if you wanna clear that view null is a good idea"

## Arrays (slides 119–121)

- **Arrays** (slide 119):
  - Syntax screenshot:

    ```js
    var name = []; // empty array
    var name = [value, value, ..., value]; // pre-filled
    name[index] = value; // store element
    ```
  - Editor screenshot (lines 14–19):

    ```js
    var ducks = ["Huey", "Dewey", "Louie"];
    var stooges = []; // stooges.length is 0
    stooges[0] = "Larry"; // stooges.length is 1
    stooges[1] = "Moe"; // stooges.length is 2
    stooges[4] = "Curly"; // stooges.length is 5
    stooges[4] = "Shemp"; // stooges.length is 5
    ```
  - [ink: green circles around `[4]` and the `5` on the "Curly" line; red circles around `[4]` and the `5` on the "Shemp" line; "1 2 3" handwritten over `"Dewey"`; ", true" handwritten after the ducks array; a sketch top right of three adjacent boxes labelled "10", "10", "1?" with an arrow under them.]
  - "• stooges.length() returns the size (length) of the array" (underlined in red ink)
  - "**Q:** Write a JavaScript program to display all elements of the array stooges on console"
  - A: (not on the slide)
  [note: `length` is a property, not a method: `stooges.length` returns the size; `stooges.length()` throws "TypeError: stooges.length is not a function".]
- **Arrays cont..** (slide 120):
  - "We can add to the end of an array, or we can remove the last element of an array"
  - Editor screenshot (lines 14–26):

    ```js
    var ducks = ["Huey", "Dewey", "Louie"];
    var stooges = []; // stooges.length is 0
    stooges[0] = "Larry"; // stooges.length is 1
    stooges[1] = "Moe"; // stooges.length is 2
    stooges[4] = "Curly"; // stooges.length is 5
    stooges[4] = "Shemp"; // stooges.length is 5
    // adding Terry to list of stooges
    // observe it in google chrome development tool
    stooges.push("Terry");
    /* removing last element
     observe it in google chrome development tool
    */
    stooges.pop();
    ```
  - [ink: red circles around `push` and `.pop();`.]
  - Side note: "Correction: The indices have to be [0] [1] [2] [3]" (one index per line).
  [note: as written the code is valid JavaScript: assigning index 4 on a length-2 array leaves holes at 2 and 3 and makes length 5, and the comments are correct. The "correction" means the intended example uses consecutive indices 0, 1, 2, 3 (so the four stooges fill the array with no holes and length ends at 4).]
- **Accessing Array Elements** (slide 121):
  - "Array elements are accessed using the [ ] operator"
  - "Example:"

    ```js
    let colors = [“red”, “green”, “blue”];
    colors[0]  will return red
    colors[1] will return green
    ```
    (curly quotes as on the slide)

## Identifier rules (slide 122)

- **Variable identifier rules** (slide 122):
  - "A JavaScript variable (identifier) must start with a letter, underscore (_), or dollar sign ($); subsequent characters can also be digits (0-9) (*but a variable name cannot start with digits*)"
  - "Q: which one of these can be a valid variable name?"
    1. `$$ = 140;`
    2. `#name = “life!”;`
    3. `_$ = “Hellow World”;` (sic)
    4. `2a = 25;`
    5. `$ = 39;`
    6. `$name = 45;`
  - Blue box: "Now you can tell what is Jquery. Jquery is just an object named $"
  - Chrome console screenshot (the slide's answer):

    ```text
    > $$ = 140
    < 140
    > #name = "[illegible: first letter under ink]ife!"
    x Uncaught SyntaxError: Invalid or unexpected token
    > _$ = "Hellow World"
    < "Hellow World"
    > 2a = 25
    x Uncaught SyntaxError: Invalid or unexpected token
    > $ = 39
    < 39
    > $name = 45
    < 45
    > $$ = 'Jack ma!'
    < "Jack ma!"
    ```
  - A (from the console): 1, 3, 5, 6 are valid; 2 (`#name`) and 4 (`2a`) give "Uncaught SyntaxError: Invalid or unexpected token".
  - [ink: red circles around items 1, 2, 3, 5; red ticks and crosses over the console lines.]

## Practice: mul and add (slide 123)

- **Practice:** (slide 123):
  - "• Considering the two functions below, what will be printed on console by each of the statements below?"

    ```js
    function mul(a, b) {
        return (a * b);
    }

    function add(a, b) {
        return (a + b);
    }
    ```

    ```js
    console.log(mul(2, add(2, 3)));
    console.log(add(2, mul(2, 3)));
    console.log(mul(2, mul(2, 3)));
    console.log(add(2, add(2, 3)));
    console.log(mul(2, 3), add(2, 3));
    ```
  - A: (not on the slide)

## Remarks: uninitialized var and let (slide 124)

- **remarks** (slide 124):

  ```js
  var number;
  console.log(number); // what will be logged on console?


  let num;
  console.log(num); // what will be logged on console?
  ```
  - A: (not on the slide)

## var vs let vs const, more depth (slides 125–130)

- **var vs let vs const, more depth** (slide 125): section divider.
- Slide 126 (no title):
  - "Execute the function below and see what happens"

    ```js
    function example() {
        // I just created a block
        {
            var n1 = 10;
            let n2 = 20;
        }
        console.log(n1);
        console.log(n2);
    }
    ```
  - "• Why n2 is not accessible outside the block ( outside curly brackets) ?"
  - A: (not on the slide) (slide 127 answers it.)
- **Variable Declarations and variable Scopes** (slide 127):
  - "**var** num = 10;"
  - "declares a variable which can be accusable (sic) within the **function** it was declared."
  - "**let** num = 10;"
  - "declares a variable which is only accusable (sic) within the **block** it was declared."
  - "a ***block*** means lines of codes within {}"
  - "**var**  Declares a **function-scoped** variable."
  - "**let**  Declares a **block-scoped**, variable." (partly covered by callouts)
  - The same `function example()` code as slide 126, with two callouts:
    [figure: blue callout "n1 is accusable in entire function" with two blue arrows, one to the `function example() {` line and one to the function's closing `}`; green callout "n2 is accusable only in this block" with two green arrows, to the inner block's `{` and its `}`.]
- **Variable Declarations and variable Scopes** (slide 128): same text and code box as slide 115:
  - "**var**: Declares a **function-scoped** variable."
  - "**let**: Declares a **block-scoped**, variable."
  - "**const**: Declares a **block-scoped** const. Will make only **primitive** variables constant ( cannot be changed later once declared);"

    ```js
    const Pi = 3.14;
    Pi = 90;    // Uncaught TypeError: Assignment to constant variable.
    ```
  - Orange box: "variable Pi was once initialized at the time of declaration using const and cannot be initialized/modified again."
  - Blue callout pointing at the error comment: "Why do you think it says "Type" error? What does it have to do with type?"
  - A: (not on the slide)
- **What if we declare an object using const?** (slide 129):
  - "Can we still modify properties that object after we initialized it?"
  - "Can we reassign that object ( that variable )"
  - "Remember we could declare an object literal like this:"

    ```js
    const  x = { firstName: "John", lastName: "Doe" };
    ```
  - "Q: which one issues an error message ( and terminates the script) ?"

    ```js
    1- const  x = { firstName: "John", lastName: "Doe" };
    x = { firstName: “Tom", lastName: " Hanks" };

    2- const  x = { firstName: "John", lastName: "Doe" };
    x.firstName = "Tom ";
    x.lastName = " Hanks" ;
    ```
    (option 1 has a curly opening quote before `Tom` on the slide)
  - A: (not on the slide)
  [note: option 1 (reassigning the const binding) throws "TypeError: Assignment to constant variable."; option 2 runs, because const does not freeze the object's properties. As typed, option 1 would also fail to parse because of the curly quote `“`.]
- **Tips** (slide 130):
  - "If a variable is declared outside function, it becomes global"
  - "That means anything after variable declaration will have access to it. Example:"
  - Editor screenshot (lines 10–28):

    ```html
    <script>
        let test = 123;
        function area(r) {
            var result = 0;
            if (r === 0) {
                result = 0;
            } else {
                let pi = 3.14;
                result = pi * r * r;
            }
            // this line has no access to variable pi cuz it is outside the block pi was declared at line 17
            return result;
        }
        // this line has no access to variable result which was defined in function area at line 13

        var myArea = 0;
        console.log(area(1));
    // varibles test and myArea are accessable everywhere, Q: why?
    </script>
    ```
  - [ink: "var" written above the title; green loops around `let test = 123;` (line 11) and `var myArea = 0;` (line 25), both joined to a large handwritten "global"; red down-arrow beside lines 11–15; red sketches on the right ("a=10", "func(){ i=10; }") with an arrow pointing at line 17.]
  - Q: "varibles test and myArea are accessable everywhere, Q: why?" A: (not on the slide) (the slide's first sentence, "If a variable is declared outside function, it becomes global", is the answer it is building to.)

## Variable hoisting (slides 131–132)

- **variable hoisting** (slide 131): section divider.
- **variable hoisting ( only for variables declared by "var")** (slide 132):
  - "The JavaScript engine treats all variable declarations using "var" as if they are declared at the top of a functional scope (if declared inside a function, if not as if they are declared at top of the script)"
  - Left code:

    ```html
    <script>

        console.log(myVar);// will not issue error
        var myVar;
        myVar = 140;
    </script>
    ```
  - [ink: "var myVar" handwritten in red at the top of the script, with a red line from the circled `var myVar;` up to it.]
  - Orange callout: "JS engine moves declarations using **var** to top"
  - Blue callout (on `console.log(myVar)`): "Will not issue error, even though myVar was declared next line It will simply print undefined"
  - Lower code:

    ```html
    <script>

        console.log(myLet);// will issue error
        let myLet;
        myLet = 140;
    </script>
    ```
  - Salmon callout (on `console.log(myLet)`): "Will issue error and terminate execution. JS engine will NOT hoist variables declared by "let""
  - [ink: blue and red horizontal strokes on the right sketching lines of code being moved to the top; "var a = 10;" scrawled over the salmon callout.]
  [note: technically `let` declarations are hoisted too, but they sit in the "temporal dead zone" until the declaration line runs, so reading `myLet` first throws "ReferenceError: Cannot access 'myLet' before initialization". The observable behaviour (error, script stops) matches the slide.]

## var and window, strict mode, summary (slides 133–134)

- **var  attaches global variables to global window** (slide 133):

  ```js
  var a = 10;
  console.log (window.a); // prints 10 as a is attached to global window object
  let b = 10;
  console.log (window.b); // will not print 10, as b is not added as property of window
  ```
  - Heading: "let does not allow re-declaration of variables in strict mode"

    ```js
    'use strict';
    var me = 'foo';
    var me = 'bar'; // No problem, `me` is replaced.
    ```

    ```js
    'use strict';
    let myLet = 'foo';
    let myLet = 'bar'; // SyntaxError: Identifier 'me' has already been declared
    ```
  [note: the error message would name `myLet`, not `me` (the comment was copied from a `me` example). Also, `let` re-declaration in the same scope is a SyntaxError in sloppy mode too, not only in strict mode. `console.log(window.b)` prints `undefined`.]
- **let vs var summary** (slide 134):

  | | var | let |
  |---|---|---|
  | Scope | Function scope | Block scope |
  | Hoisting | Will hoist declaration to top of function | (blank) |
  | Adding to global object (window) | Global variable declared by var add to window | let does not add property to global window |
  | strict mode* | Re-Declaration is ok | No declaration |

  - "* Likely not enough time in this course to cover strict mode, but your are encouraged to develop in strict mode to prevent annoying silent errors"
  [note: "No declaration" in the strict-mode row means "no re-declaration allowed".]

## Handling events (slides 135–138)

- **Handling events** (slide 135): section divider. "like when user click on an element !"
- **Events in JavaScript** (slide 136):
  - "HTML events are "things" that happen to HTML elements."
  - "Examples:"
    - "An HTML web page has finished loading"
    - "An HTML input field was changed"
    - "An HTML button was clicked"
  - "you may want to do something when events happened. For example display of a message when a button is clicked!"
  - "JavaScript lets you execute code or a function when events are detected."
  - "HTML allows event handler attributes, **with JavaScript code**, to be added to HTML elements."
  - "Q: what were attributes? Give us some example .."
  - A: (not on the slide)
  - "Source: https://www.w3schools.com"
- Slide 137 (no title):
  - "HTML allows event handler attributes, **with JavaScript code**, to be added to HTML elements."
  - Inline handler (one line):

    ```html
    <button id = 'me' onclick="document.getElementById('me').innerHTML = 'Clicked me!' ">click here :-) </button>
    ```
  - Blue callout pointing at `onclick`: "Did u notice? Value of the attribute "onclick" could be JavaScript code"
  - Yellow box: "So there are two methods to handle events: Method 1- inline (inside HTML element) , Metod (sic) 2- in JavaScript block"
  - "A better way to handle events it to use a function!"
  - Script-block handler:

    ```html
    <body>

        <button id='me'> click here :-) </button>

        <script>

            function clickHandler() {
                document.getElementById('me').innerHTML = 'Clicked me!';
            }

            document.getElementById('me').onclick = clickHandler;
    [cut off at the bottom of the slide]
    ```
  - [ink: blue bracket around the `clickHandler` function; handwritten "undef-" above it; green "1", "2", "3" with arrows near the last line; blue box around `clickHandler;` with "( )" drawn after it, i.e. the instructor is contrasting `clickHandler` with `clickHandler()`.]
  [note: assigning `clickHandler` (no parentheses) registers the function; writing `clickHandler()` would call it immediately and assign its return value, `undefined`, to `onclick`.]
- **In class activity** (slide 138):
  - "**Q1:** why const a;"
  - "Will throw error messages"
  - "(Uncaught SyntaxError: Missing initializer in const declaration)"
  - "**Q2:**create a textarea using textarea tag and place a button underneath it. Clicking the button has to clear the content of the text area"
  - A: (not on the slide)

## JavaScript objects (slides 139–150)

- **JavaScript Objects** (slide 139): section divider.
- **Review :JavaScript variable type Number, String, …,Objects** (slide 140):
  - "You learned JavaScript variables are of **7** different types"
  - "There are **six** primitive data types and **one** object type in Javascript ECMA6"
    1. "Number.  `let length = 16;`"
    2. "Boolean.  `let condition = true;`"
    3. "String. `let lastName = "John";`"
    4. "undefined. Basically means the **type of variable** is **undefined** to browser."

       ```js
       let x
       console.log(x); // x is undefined!
       ```
       "Variable x has been defined, but its **type** has **not been defined.**"
       "JavaScript determines the type of a variable by looking at its current value, that is why JavaScript is called ***dynamically typed***"
    5. "null. denoting a null value. *Because JavaScript is case-sensitive,* `null` *is not the same as* `Null`*,* `NULL`."
    6. "Symbol (new in ECMAScript 2015). We will not use in this course"
    7. "Objects"
- **JavaScript Objects** (slide 141):
  - "Example:"

    ```js
    let x = { firstName: "John", lastName: "Doe" }; // Object
    ```
  - "As you see Objects are variables too but can contain different values"
  - Blue callout with arrows to `firstName` and `lastName`: "These two are **properties** of the object x, firstName and lastName are property names ( or property keys)"
  - "• Accessing properties of an object. Two ways:"
    - "*objectName.propertyName* or"
    - "*objectName["propertyName"]*"
  - Examples:

    ```js
    Console.log(x.firstName); // "John" will be printed
    Console.log(x["firstName"]); // "John" will be printed
    ```
  [note: `Console` with a capital C is not defined; it must be `console.log`.]
- **Object constructor** (slide 142):
  - "Object contractor (sic) is the same at (sic) function declaration:"

    ```js
    function Person(firstName, lastName){
        this.firstName =  firstName;
        this.lastName = lastName;
    }
    let person = new Person("Elon", "Musk");
    ```
  - "Of course you could also declare it in form of object literals but obviously cannot be instantiated:"

    ```js
    let person = { firstName: 'Elon', lastName: "musk" }
    ```
- **Using JavaScript built in objects** (slide 143):
  - "**Example: Date contractor**" (sic)

    ```js
    let date1 = new Date('January 15, 2018 09:00:00');
            let date2 = new Date(); // gets you current date

            let timeDiff = date2 - date1; //QQ what does it do?
            console.log(timeDiff);// milliseconds passed
    ```
  - [ink: red box around `let date1 =`, red circle around `new`, blue circle on "Date" in the heading.]
  - QQ "what does it do?" A (in the code's own comment): milliseconds passed.
- **Built-in ( means existing) JavaScript objects** (slide 144):
  - "Date is a built-in JavaScript object"
  - "Here is how we create a new Date object:"

    ```js
    let d = new Date();
    Console.log(d.getTime());
    ```
  - [ink: red circle around `getTime()`.]
- **Typeof** (slide 145):
  - "typeof is a JavaScript built-in function that receives a single parameter input and returns the type of that input. Try these:"

    ```js
    console.log(typeof (42));
    // expected output: "number"

      console.log(typeof ('blubber') );
    // expected output: "string"

      console.log(typeof (true));
    // expected output: "boolean"

      let x
    console.log(typeof x);
    // expected output: "undefined";
    ```
  [note: `typeof` is an operator, not a function; the parentheses are optional (as the last example, `typeof x`, shows).]
- **Typeof …** (slide 146):

  ```js
  Let myObj = { firstName: "John", lastName: "Doe" };
  onsole.log(typeof (myObj));
  // expected output: "object"

    Let myObj = { firstName: "John", lastName: "Doe" };
  console.log(typeof (myObj));
  // expected output: "object"
      let person = {
      firstName: "John",
      lastName: "Brown",
      age: 50,
      eyeColor: "green"
      };
  onsole.log(typeof (person));
  Q: onsole.log(typeof (person.age));
  Q: onsole.log(typeof (person.eyeColor));
  ```
  - (sic throughout: `Let` with capital L and `onsole` missing its c; both are slide typos.)
  - A: (not on the slide)
- **Typeof …** (slide 147):
  - "Q: Same way declare an array and see its type by using typeof"
  - A: (not on the slide) (slide 113 states "Arrays are also of type objects in JavaScript".)
- **Objects and functions inside Object** (slide 148):

  ```js
  let MainObj = {

      prop1: "prop1MainObj",

      Obj1: {
          prop1: "prop1Obj1",
          prop2: "prop2Obj1",
          Obj2: {
              prop1: "hey you",
              prop2: "prop2Obj2"
          }
      },

      Obj3: {
          prop1: true,
          prop2: "prop2Obj3"
      }
  };
  ```
  - "**Q**: How can we access the prop2Obj3 property?"
  - "**Q**: plot the tree structure of this object"
  - A: (not on the slide)
  [note: "prop2Obj3" is the value of `MainObj.Obj3.prop2` (also `MainObj["Obj3"]["prop2"]`); the slide's question calls the value a property. Tree: MainObj → prop1, Obj1, Obj3; Obj1 → prop1, prop2, Obj2; Obj2 → prop1, prop2; Obj3 → prop1, prop2.]
- **Object Contractor (sic) with a method** (slide 149):

  ```js
  function Person(first, last, age, eyecolor) {
     this.firstName = first;
     this.lastName = last;
     this.age = age;
     this.eyeColor = eyecolor;
     this.name = function() {return this.firstName + "
   " + this.lastName;};
   }
  ```
  (The `" "` string literal is broken across two lines on the slide by text wrapping; the intent is `this.firstName + " " + this.lastName`.)
- **In class activity: Review** (slide 150):
  - "Q: Do you remember what was the difference between undefined and not defined error?"

    ```js
    let x
     console.log(x); // x is undefined will be printed!
     (means the variable is defined but its type is undefined) it
     happens when the variable has not ben initialized
     console.log(y); // y is not defined reference error!
     (means the variable y is not defined yet)
    ```
    (the two parenthesised lines are green comment-style text on the slide; "ben" sic)
  - A (on the slide): `undefined` = the variable is declared but not initialized; "not defined" = a ReferenceError because the variable was never declared.

## The HTML DOM (slides 151–157)

- **The HTML DOM (Document Object Model)** (slide 151): section divider.
- **The HTML DOM (Document Object Model) 1** (slide 152):
  - "Review: When a browser renders a web page, it forms the **D**ocument **O**bject **M**odel of that page in memory." (the end of the sentence is hidden behind the figure; the text layer has it.)
  - [figure: a vertical grey bar labelled "DOM / Document Object Model" on the left; a tree: "document" → "Root element: <html>"; <html> → "Element: <head>" and "Element: <body>"; <head> → "Element: <title>" → "Text: "My title""; <body> → "Element: <h1>" → "Text: "A heading""; <body> → "Element: <a>" → "Text: "Link text""; "Element: <a>" also has a side box "Attribut: href".]
  - "Source: https://www.w3schools.com/js/js_htmldom.asp" (truncated on the slide image to "https://www.w3schools.com/js/js_htm"), "wikipedia"
- **The HTML DOM (Document Object Model) 2** (slide 153):
  - "Here is an example: for this html page, the browser creates this object"

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>page title</title>
    </head>
    <body>
        <h1>hello page</h1>
        <p>Welcome home.</p>
        <h2>Our team </h2>
        <ul>
            <li>Jeff Brown</li>
            <li>Jack Ma</li>
            <li>Amy Alam</li>
        </ul>
        <p>Contact us</p>
    </body>
    </html>
    ```
  - (No tree is drawn for this page on the slide.)
- **Tree model of objects** (slide 154): the same `MainObj` code as slide 148 (transcribed there).
  - "**Q**: You have seen this object in previous slides. plot the tree model of this object"
  - A: (not on the slide)
- **Dynamically changing DOM using JavaScript 1** (slide 155):
  - "Imagine in an empty html page, we want to add a new *element* (e.g. a button) dynamically using JavaScript."
  - "You need to do two things"
  - "1: create that element in memory"

    ```js
    let btn = document.createElement("BUTTON");
    ```
  - "2:place that element in DOM tree"

    ```js
    document.body.appendChild(btn);
    ```
  - "3: do something to make that button visible ! (e.g. give it a value)"
  - (The slide says "two things" and then lists three steps.)
- **Dynamically changing DOM using JavaScript 2** (slide 156), an exercise:
  - "Add two buttons dynamically to your DOM model"
  - "Clicking on first button shall display a message using alert, e.g. button 1 was clicked"
  - "Clicking on second button to print something on console (button 2 was clicked)"
- **getElementsByTagName** (slide 157):
  - "getElementsByTagName returns an **array** of elements of the given type"

    ```html
    <body>
    <p>Hello ...... World!</p>
    <p>Hello World!</p>
    <p>Hello ...... World!</p>
    <script>
    let pElements = document.getElementsByTagName("p");
    pElements[1].innerHTML = "just Hello!";
    </script>
    </body>
    ```
  - [ink: red circles on each `<p>`, a box around the second paragraph "Hello World!" with an arrow, `[1]` marked; side scribble `<input type='butt...`.]
  [note: it returns an HTMLCollection, an array-like live list (indexable with `[ ]` and has `.length`, but is not a true Array). With index 1, the second paragraph "Hello World!" becomes "just Hello!".]

## Getting input from the user (slides 158–160)

- **Using input box to get input from user** (slide 158):
  - "What does this code snippet do?"

    ```html
    What is 2+3? <input type="text" id="myText" value="">
    <p>Click the button to change the value of the text field.</p>
    <input type="button" onclick="myFunction()" value="Try it"></input>
    <script>
        function myFunction() {
            alert("You said 2+3 is:"
            + parseInt(document.getElementById("myText").value));
        }
    </script>
    ```
  - A: (not on the slide)
- **Getting input from user** (slide 159):
  - "**Q:** Write a JavaScript program to request user's name and then display that name onto console."
  - "Tip: you can use prompt:"
  - "var myName = prompt(*textMessage, defaultText*)"
  - Editor (lines 9–12):

    ```html
    <script>
        var myName = prompt("Hello Hello! Please enter your name", "Mark");
        console.log(myName);
    </script>
    ```
  - [ink: red labels "value" (arrow to `myName`), "message" (arrow to the first string), "default value" (arrow to `"Mark"`).]
- Slide 160 (no title):
  - The same script, followed by `</body>` and `</html>`.
  - [figure: Chrome screenshot, tab "amir..html", address bar "file:///C:/AMIR/OneDrive/BCIT/1536/HTML-basic/amir..html"; a dialog "This page says" with the message "Hello Hello! Please enter your name", a text box pre-filled with "Mark", and buttons "OK" and "Cancel". Red ink arrows: from the first prompt argument to the dialog's message, from `"Mark"` to the text box; OK and Cancel underlined.]
  - "The prompt() method returns the input value if the user clicks "OK". If the user clicks "cancel" the method returns null."

## setTimeout, setInterval, event queue (slides 161–162)

- **setTimeout vs setInteral** (sic) (slide 161):
  - "setTimeout (function, t) // ( remember Tim.. is uppercase)"
  - "setTimeout executes the function after the time t (in millisecond ) is elapsed"
  - "Example:"

    ```js
    setTimeout(function(){ alert("Hello"); }, 3000);
    ```
  - "setInterval (function, t)"
  - "Does the same thing at setTimeout but repeats it"

    ```js
    setInterval(function(){ alert("Hello"); }, 3000);
    ```
- **Order of execution … Event Queue** (slide 162):
  - "What would be the output of this script?"

    ```html
    <script>
        console.log(1);
        setTimeout(function () {
            console.log(2);
        }, 1000);
        console.log(3);
    </script>
    ```
  - A (blue box):

    ```text
    1
    3
    2
    ```
  - "• What if we replace 1000 with 0 ?"
  - A (blue box):

    ```text
    1
    3
    2
    ```
  - "Study: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop"

## Argument vs parameter (slide 163)

- **Argument vs Parameter** (slide 163):

  ```js
  function greet(name) {
    console.log('Hello ' + name);
  }

  greet('John');
  ```
  - [figure: arrow labelled "parameter" pointing at `name` in `function greet(name)`; arrow labelled "argument (actual value)" pointing at `'John'` in `greet('John');`.]

## Coding style (slides 164–166)

- **Coding style tips for your assignments (part one)** (slide 164):
  - "Chose (sic) **let and const**, **over var**. In fact you do not need var, so your code has to be "var" free!"
  - "Avoid use of global variables when you don't have to"
  - "Do not use hard coded strings in your code. Move them all in a separate file and define const string variables and use those variables in your code"
  - "Separation of concerns: each function is responsible to deliver one single simple task, not more. ( more in next page)"
- **Separation of concerns: Each function has to do one thing only** (slide 165):
  - Left: "The function calcSum can be Brocken (sic) into two smaller functions è"

    ```js
    //this function does two things:
    // 1- calculates the sum
    // 2- displays the sum
    function calcSum(k) {
        sum = 0;
        for (let i = 1; i <= k; i++) {
            sum = sum + i;
        }
        console.log(sum);
    }

    calcSum(k); // invocation
    ```
  - Right: "Mode modular, more rideability" (sic: "More modular, more readability")

    ```js
    //this function does one thing:
    // calculates the sum
    function calcSum(k) {
        sum = 0;
        for (let i = 1; i <= k; i++) {
            sum = sum + i;
        }
        return (sum);
    }
    // this function does one thing
    // display of the parameter d on concole
    function display(d) {
        console.log("result is: " + d);
    }
    // invocations
    let result = calcSum(k); // invocation
    display(result);
    ```
  - [figure: green arrow from `sum = 0;` (left) to the right-hand `calcSum` body; green arrow from `console.log(sum);` (left) to the right-hand `display` function; blue circles around `return` and `result`.]
  [note: both versions assign `sum = 0;` without `let`, which makes `sum` an implicit global (slide 166's first rule) and contradicts the "avoid global variables" tip; `k` is also never defined before `calcSum(k)` is invoked.]
- **Things to remember** (slide 166):
  - "Declaring a variable without use of var or let or const will make it global, regardless where it is defined."
  - "JavaScript is a dynamic language; meaning the type (string, boolean …) of a function return value is not pre-defined. If a function does not use a return statement or an empty return statement with no value, JavaScript automatically returns undefined."
  - "That means that ***in JavaScript every function returns something***, at least undefined. ( all of these code snippets will display "undefined" at the end)"
  - Three snippets:

    ```js
    function foo (){
      k = 100;
    }

    console.log(foo());
    ```

    ```js
    function foo (){
      k = 100;
      return ;
    }

    console.log(foo());
    ```

    ```js
    console.log(console.log('Hi!'));
    ```
  - Output of each, per the slide: ends with `undefined` (the third prints `Hi!` and then `undefined`).
  [note: "regardless where it is defined" is true only in sloppy mode; in strict mode, assigning to an undeclared variable throws a ReferenceError.]

## ES6 arrow functions (slides 167–168)

- **ECMA6 (ESC6 javascript) tips** (slide 167): section divider. ("ESC6" sic for ES6.)
- **ESC6 tips of the week/ Arrow functions to replace old ones** (slide 168). Two columns, "• regular functions" → "arrow functions":

  | regular functions | arrow functions |
  |---|---|
  | `setTimeout(function() {` ⏎ ⏎ `}, timeout);` | `setTimeout(() => {` ⏎ ⏎ `}, timeout);` |
  | `date = function() {` ⏎ `  return new Date();` ⏎ `}` | `date = () => {` ⏎ `  return new Date();` ⏎ `}` |

  Exact code, regular:
  ```js
  setTimeout(function() {

  }, timeout);
  ```
  ```js
  date = function() {
    return new Date();
  }
  ```
  Exact code, arrow:
  ```js
  setTimeout(() => {

  }, timeout);
  ```
  ```js
  date = () => {
    return new Date();
  }
  ```
  Third box (arrow forms only):
  ```js
  // one parameter
  hello = (val) => "Hello " + val;

  hello = val => "Hello " + val;

  // two or more parameters
  sum = (a,b) => a+b;
  ```

## CSS review part 2: three ways to style (slides 169–175)

- **CSS review** (slide 169): section divider (title text clipped at the bottom on the slide).
- **(remember) There are 3 ways of styling HTML elements** (slide 170):
  - "1- Styling HTML elements using the style attribute" / "This method is called **Inline** styling which we just learned today."
  - "2- Using <style> tags in the <head> section of same HTML file" / "This method is called **Internal** styling"
  - "3- Using an external CSS file" / "This method is called **External** styling"
  - Salmon box:
    - "**CSS** stands for **C**ascading **S**tyle **S**heets."
    - "CSS describes **where** every element is placed and **how** it looks on screen, paper, or in other media ( remember this from last week)."
- **inline vs internal** (slide 171):
  - Left (inline):

    ```html
    <head>
    </head>

    <body style="background-color: gray;">
        <h1 style="color: maroon;">heading 1</h1>
        <p style="color: yellow;">paragraph 1</p>
        <p style="font-style: italic;">paragraph 2</p>
    </body>
    ```
    (the editor shows colour swatches before gray, maroon and yellow)
  - Rendered output: [figure: grey page, "heading 1" in large maroon serif, "paragraph 1" in yellow, "paragraph 2" in black italic.]
  - Blue arrow → right (internal):

    ```html
    <head>
        <style>
            body {
                background-color: gray;
            }
            h1 {
                color: maroon;
            }
            .pClass {
                color: yellow;
            }
            #pId {
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <h1>heading 1</h1>
        <p class="pClass">paragraph 1</p>
        <p id="pId">paragraph 2</p>
    </body>
    ```
  - [figure: red dashed ellipses around `<style>` and `</style>`; one rounded box around the four CSS rules and another around the `<body>` block.]
- **internal** (slide 172): divider slide with the single word "internal".
- **External Style sheet** (slide 173):
  - "An external style sheet can be written in any text editor. The file should not contain any html tags. The style sheet file must be saved with a .css extension."

    ```html
    <html>
    <head>
        <link rel="stylesheet"
            type="text/css"
            href="myStyle.css" />
    </head>
    <body>
        <h1>This is a heading</h1>
        <p>This is a paragraph.</p>
    </body>
    </html>
    ```
  - Blue callout pointing at the href: "myStyle.cc (sic) file contains the CSS rules"
- **Internal vs External** (slide 174):
  - Left: the same internal `<head><style>…</style></head><body>…</body>` code as slide 171.
  - Blue arrow from the CSS rules → right top, file labelled **myStyle.css**:

    ```css
    body {
      background-color: gray;
    }
    h1 {
      color: maroon;
    }
    .pClass {
      color: yellow;
    }
    #pId {
      font-style: italic;
    }
    ```
  - Blue arrow from the `<body>` block → right bottom, file labelled **my.html**:

    ```html
    <head>
      <link rel="stylesheet"
          type="text/css"
          href="myStyle.css" />
    </head>
    <body>
      <h1>heading 1</h1>
      <p class="pClass">paragraph 1</p>
      <p id="pId">paragraph 2</p>
    </body>
    ```
- Slide 175 (no title):
  - "You have noticed that with internal and external methods you used CSS language to apply styling on multiple HTML elements at the same type. This is more efficient."
  - "You have noticed that the only difference between internal and external is that in external we need a separate file for CSS contents"
  - "For internal and external styling we need to know the CSS language. You have noticed so far that the terms are exactly the same as used in inline styling."

## Box model (slides 176–179)

- **CSS layout padding …** (slide 176): section divider.
- **The CSS Box Model** (slide 177):
  - "All HTML elements can be considered as boxes."
  - "In CSS, the term "box model" is used when talking about design and layout."
  - "A box that wraps around HTML element"
    - "**Content** - The content of the box, where text and images appear"
    - "**Padding** - Clears an area around the content. The padding is transparent"
    - "**Border** - A border that goes around the padding and content"
    - "**Margin** - Clears an area outside the border. The margin is transparent"
- Slide 178 (no title):

  ```html
    <style>
      #div2 {
        background-color: lightgrey;
        width: 300px;
        margin: 30px;
        border: 10px solid blue;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div>
      BCIT is the largest provincial provider
      of computing graduates. It has
      some of the largest and most extensive
      programs of their kind in BC and  beyond.
    </div>

    <div id="div2">
      BCIT is the largest provincial provider
      of computing graduates. It has
      some of the largest and most extensive
      programs of their kind in BC and  beyond.
    </div>
  </body>
  ```
  - [figure: browser render (cropped): first div as plain text "BCIT is the lar… of the largest a…"; second div as a light-grey box with a thick blue border. Arrows: blue line from `margin` to a double arrow between the window edge and the blue border (margin); orange line from `border` to a yellow double arrow across the blue border; dark navy line from `padding` to a double arrow between the inside of the border and the text (padding).]
- Slide 179 (no title):
  - [figure: nested boxes, outermost to innermost: dashed outer box "Margin" (light grey), green band "Border", light grey "Padding", dashed inner white box "Content".]
  - "Source https://www.w3schools.com/css/css_boxmodel.asp"

## display, visibility, position (slides 180–184)

- **CSS layout , display property** (slide 180):
  - "Every HTML element has a default display value depending on what type of element it is. The default display value for most elements is block, inline, none"
  - "**Block**"
  - "A block-level element always starts on a new line and takes up the full width available (stretches out to the left and right as far as it can)."
  - "Default display value of the following elements is block"
  - "<div>  <h1> - <h6>  <p>  <form>  <header>  <footer>  <section>"
  - "**Inline**"
  - "An inline element does not start on a new line and only takes up as much width as necessary."
  - "Display property of span> (sic) <a> <img> is inline by default"
  - [figure: a full-width green-outlined box containing "The <div> element is a block-level element."; below, the sentence "This is an inline <span> element inside a paragraph." with only "an inline <span> element inside" outlined in green.]
  [note: `<img>` is technically a "replaced inline" element (it is inline but accepts width/height). The default display of most elements is `block` or `inline`; `none` is the default only for elements like `<head>`, `<script>`, `<style>`.]
- **CSS layout , display property cont.** (slide 181):
  - "**none**"
  - ""display: none" is used to remove elements from screen without deleting them."
- **CSS layout visibility property** (slide 182):
  - "Specifies whether or not an element should be visible"
  - "visibility:hidden or visibility:show"
  - "Note:"
  - "We can also hide an element using visibility property:"
  - "visibility:hidden"
  - "display: none vs visibility:hidden"
  - "visibility:hidden; also hides an element. However, the element will still take up the same space as before."
  - "In both cases the element will **not** be removed from DOM tree"
  - "**Q:**Try https://www.w3schools.com/css/tryit.asp?filename=trycss_display"
  [note: there is no `visibility: show` value in CSS; the opposite of `hidden` is `visibility: visible` (other values: `collapse`).]
- **CSS layout properties cont.** (slide 183):
  - "The following CSS layout properties will be tried during the lab as part of your lab assignment"
    - "width and max-width"
    - "position"
    - "overflow"
    - "float and clear"
    - "Horizontal & Vertical Align"
  - "**Note**: due to use of external css styling we can change the feel and look of entire website by just changing one line of code. Can you guess how?"
  - A: (not on the slide)
  - "Check out this link https://www.w3schools.com/css/css_intro.asp"
- **Position property of Style attribute** (slide 184):
  - "The position property of Style attribute specifies the type of positioning method used for an element (static, relative, absolute, fixed, or sticky)."
  - "static: Default value. Elements render in order, as they appear in the document flow"
  - "**fixed**: The element is positioned relative to the browser window"

    ```html
    style="left:20px ; position: absolute;"
    ```
  - "There are other possible values for the property position such as relative, sticky, initial, inherit."
  - "Refer to https://www.w3schools.com/cssref/pr_class_position.asp"
  - "and https://www.w3schools.com/cssref/playit.asp?filename=playcss_position&preval=fixed for more"
  [note: the example uses `absolute`, which the slide does not define: an absolutely positioned element is placed relative to its nearest positioned ancestor (or the initial containing block), not the browser window; `fixed` is the one tied to the viewport.]

## Combinators, specificity, units (slides 185–188)

- **CSS Combinators** (slide 185):
  - "Descendant Selector"
  - "Example: selects all <p> elements inside <div> elements:"

    ```css
    div p {
         background-color: yellow;
    }
    ```
  - [figure: two thin arrows from the words "Descendant Selector" to `div` and to `p`.]
  - "There are more Combinators such as child selector (>), adjacent sibling selector (+), general sibling selector (~)"
- **CSS Specificity** (slide 186):
  - "If there are two or more conflicting CSS rules that point to the same element, the browser follows some rules to determine which one is most specific and therefore wins out."
  - "Example: all the three sets or rules apply to the div, but which one wins?"

    ```html
    <head>
        <style>
            #myId {background-color: blueviolet;}
            div#myId {background-color: pink;}
            div[id=myId] {background-color: greenyellow;}
        </style>
    </head>
    <body>
        <div id="myId">This is a div</div>
    </body>
    ```
    (the editor shows colour swatches before blueviolet, pink and greenyellow)
  - A: (not on the slide)
- **CSS Units (Absolute)** (slide 187):
  - "Absolute Lengths"
  - "Absolute length units are not recommended for use on screen, because screen sizes vary so much. They are mostly used for print layouts"
  - "cm( centimeter) used for printer devices"
  - "px (pixels) Pixels are fixed-size units that are used in screen media (i.e. to be read on the computer screen).*  For low-dpi devices such as monitors, 1px is one device pixel (dot) of the display. For printers and high resolution screens 1px implies multiple device pixels."
  - "pt (points)"
  - "Points are traditionally used in print media (anything that is to be printed on paper, etc.). One point is equal to 1/72 of an inch. Points are much like pixels, in that they are fixed-size units and cannot scale in size*"
  - "Good Source to visit (https://kyleschaeffer.com/development/css-font-size-em-vs-px-vs-pt-vs/ )"
  [note: in CSS, `px` is itself an absolute unit (1px = 1/96 inch), so it belongs in this list; the slide's warning about absolute units is aimed at cm/mm/in/pt.]
- Slide 188 (no title), **Relative Lengths**:
  - "em Relative to the font-size of the element (2em means 2 times the size of the current font)"
  - "em" is the width of the capital letter M for a given font, which is also the size of the font in points. (https://www.quora.com/What-does-the-em-stands-for-with-respect-to-CSS )"
  - "% relative to parent element"
  [note: in CSS, 1em equals the element's computed font-size; the "width of capital M" is the typographic origin of the name, not how CSS measures it.]

---

## Facts and numbers index

- 6 primitive data types + 1 object type in ES6 = 7 types (113, 140). The six on slide 113, in order: Boolean, null, undefined, Number, String, Symbol. The order on slide 140: Number, Boolean, String, undefined, null, Symbol, then 7. Objects.
- Symbol: "new in ECMAScript 2015"; "A data type whose instances are unique and immutable" (113); "We will not use in this course" (140).
- `null` is not the same as `Null`, `NULL` because JavaScript is case-sensitive (113, 140).
- Arrays are of type object (113).
- `==`/`!=` performs automatic type conversion; `===`/`!==` performs none: compares type first, then value (114).
- `[10] === 10` false; `[10] == 10` true; `'10' == 10` true; `'10' === 10` false; `[] == 0` true; `[] === 0` false; `'' == false` true; `true == "a"` false; `'' === false` false (114).
- Six falsy values: undefined, null, 0, false, NaN, '' (empty string) (114).
- var = function-scoped; let = block-scoped; const = block-scoped (115, 127, 128).
- `const Pi = 3.14; Pi = 90;` gives "Uncaught TypeError: Assignment to constant variable." (115, 128).
- `{ var a = 10; } console.log(a);` prints 10; with let or const: "Uncaught ReferenceError: a is not defined" (117).
- Uninitialized variable's value is `undefined`; use `null` to explicitly clear a value (118).
- `stooges[4] = "Curly"` on a 2-element array makes length 5 (119, 120); correction: indices should be [0] [1] [2] [3] (120).
- `push` adds to the end; `pop` removes the last element (120).
- `colors[0]` returns red, `colors[1]` returns green (121).
- Identifier rule: must start with a letter, `_` or `$`; later characters may be digits 0–9; cannot start with a digit (122). Valid: `$$`, `_$`, `$`, `$name`; invalid: `#name`, `2a` ("Uncaught SyntaxError: Invalid or unexpected token") (122).
- jQuery "is just an object named $" (122).
- A block = lines of code within `{}` (127).
- A variable declared outside a function becomes global (130).
- Hoisting: var declarations are treated as declared at the top of the function (or the script); `console.log(myVar)` before `var myVar;` prints undefined; the `let` version issues an error and terminates execution (132).
- `var a = 10;` → `window.a` is 10; `let b = 10;` → `window.b` is not 10 (133).
- Strict mode: `var` redeclaration OK; `let` redeclaration → SyntaxError "Identifier … has already been declared" (133).
- let vs var table, 4 rows: Scope, Hoisting, Adding to global object (window), strict mode (134).
- 3 example HTML events: page finished loading, input field changed, button clicked (136).
- 2 methods to handle events: Method 1 inline (inside HTML element), Method 2 in JavaScript block (137).
- `const a;` → "Uncaught SyntaxError: Missing initializer in const declaration" (138).
- JavaScript is "dynamically typed": the type is determined from the current value (140).
- 2 ways to access a property: `objectName.propertyName`, `objectName["propertyName"]` (141).
- Object constructor = a function declaration called with `new` (142); an object literal "cannot be instantiated" (142).
- `date2 - date1` = milliseconds passed (143); `new Date()` gets the current date (143); `d.getTime()` (144).
- typeof outputs: 42 → "number"; 'blubber' → "string"; true → "boolean"; uninitialized `let x` → "undefined"; object → "object" (145, 146).
- DOM tree figure: document → <html> → <head> (→ <title> → "My title") and <body> (→ <h1> → "A heading", → <a> with attribute href → "Link text") (152).
- Adding an element: 1 `document.createElement("BUTTON")`, 2 `document.body.appendChild(btn)`, 3 make it visible (e.g. give it a value) (155).
- `getElementsByTagName` returns an array of elements of the given type (157).
- `prompt(textMessage, defaultText)` returns the input on OK, `null` on Cancel (159, 160).
- `setTimeout(function, t)`: runs once after t milliseconds; `setInterval(function, t)`: repeats (161). Examples use 3000.
- Event queue script output: 1, 3, 2, for a delay of 1000 and also for 0 (162).
- Parameter = the name in the function definition (`name`); argument = the actual value passed (`'John'`) (163).
- 4 coding style tips: let/const over var ("var" free), avoid globals, no hard-coded strings (const strings in a separate file), separation of concerns (164).
- Separation of concerns: calcSum split into `calcSum` (returns sum) and `display(d)` (165).
- A variable assigned without var/let/const becomes global (166).
- A function with no return, or an empty `return;`, returns undefined; "every function returns something, at least undefined" (166).
- Arrow forms: `() => {}`, `(val) => "Hello " + val`, `val => "Hello " + val` (one parameter, parentheses optional), `(a,b) => a+b` (two or more parameters) (168).
- 3 ways of styling: Inline (style attribute), Internal (<style> in <head>), External (separate .css file) (170).
- CSS = Cascading Style Sheets (170).
- External style sheet: no HTML tags, must be saved with .css extension; linked with `<link rel="stylesheet" type="text/css" href="myStyle.css" />` (173, 174).
- Only difference between internal and external: external needs a separate file (175).
- Box model, 4 parts, inside out: Content, Padding (transparent), Border, Margin (transparent) (177, 179).
- Box model example: width 300px, margin 30px, border 10px solid blue, padding 20px (178).
- Block elements by default: <div>, <h1>–<h6>, <p>, <form>, <header>, <footer>, <section> (180). Inline by default: <span>, <a>, <img> (180).
- `display: none` removes from screen without deleting; `visibility:hidden` hides but keeps the space; neither removes the element from the DOM tree (181, 182).
- 5 lab layout properties: width and max-width, position, overflow, float and clear, Horizontal & Vertical Align (183).
- position values: static, relative, absolute, fixed, sticky (also initial, inherit); static is the default; fixed = relative to the browser window (184).
- Combinators: descendant (space, `div p`), child (>), adjacent sibling (+), general sibling (~) (185).
- Specificity example selectors: `#myId`, `div#myId`, `div[id=myId]` (186).
- Absolute units: cm (printers), px (screen; 1px = one device pixel on low-dpi, several on high-res), pt (print; 1pt = 1/72 inch) (187).
- Relative units: em (relative to the element's font-size; 2em = 2× current font), % (relative to parent element) (188).

## Likely quiz traps

- Arrays: slide 119 writes `stooges.length()` as a method call; `length` is a property (`stooges.length`). Also, setting `stooges[4]` on a 2-element array gives length 5, not 3 (119, 120).
- `[] == 0` is true but `[] === 0` is false; `'' == false` is true but `true == "a"` is false (114).
- The six falsy values: `undefined`, `null`, `0`, `false`, `NaN`, `''`. Items like `"0"`, `[]` or `{}` are not on the list (114).
- `var` inside a bare block `{ }` is still visible after the block (prints 10); `let`/`const` give "ReferenceError: a is not defined" (117, 126–127).
- `const` stops reassignment but does not freeze an object's properties: `x.firstName = "Tom "` works, `x = {…}` throws a TypeError (115, 129).
- `const a;` with no initializer is a SyntaxError ("Missing initializer in const declaration") (138).
- Hoisting: `console.log(myVar)` before `var myVar;` prints `undefined` (no error); the same with `let` throws and stops the script (132).
- A global `var` becomes a property of `window`; a global `let` does not (133, 134).
- Undefined vs not defined: a declared but uninitialized variable is `undefined`; an undeclared one throws a ReferenceError "is not defined" (150).
- `setTimeout(…, 0)` still runs after the following synchronous code: the output is 1, 3, 2 for delay 0 and for delay 1000 (162).
- Parameter vs argument: `name` in `function greet(name)` is the parameter; `'John'` in `greet('John')` is the argument (163).
- Every function returns something: no `return`, or a bare `return;`, gives `undefined`; `console.log(console.log('Hi!'))` prints `Hi!` and then `undefined` (166).
- One-parameter arrow functions may drop the parentheses (`val => …`); two or more need them (`(a,b) => a+b`) (168).
- `display:none` frees the element's space; `visibility:hidden` keeps it; neither removes the element from the DOM tree (181, 182).
- position: `static` is the default; `fixed` is relative to the browser window (184).
- 1pt = 1/72 inch; `em` is relative to the element's font-size, `%` to the parent element (187, 188).
- The slide says "Declaring a variable without use of var or let or const will make it global, regardless where it is defined" (166): an assignment like `k = 100;` inside a function creates a global (sloppy mode only).
