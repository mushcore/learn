# COMP 4537 Lecture 5 — "AJAX Calls" (AJAX, Web API calls, CORS, intro to DB / MySQL): transcribed from the instructor's deck

Source file: `D:/BCIT/COMP4537/raw/COMP4537-Lecture5-AJAX-WebAPICalls-CORS-intro to DB-MySQL.pdf` (50 pages; text layer `D:/BCIT/COMP4537/txt/COMP4537-Lecture5-AJAX-WebAPICalls-CORS-intro to DB-MySQL.txt`; rendered pages `D:/BCIT/COMP4537/png/L5/p001.png` … `p050.png`). Transcribed 2026-10-27. Code screenshots were also re-rendered from the PDF at 4–6× zoom to read small text.
Deck title on slide 1: "Adv Web Dev Arch / Lecture 5", "Amir Amintabar, PhD", subtitle "AJAX Calls".
Slide numbers are PDF pages. Slides 21, 47, 49 carry no printed page number; the others print the page number bottom right.

**Summary.** The deck reviews weeks 1–4, then shows how a page sends requests to a server from JavaScript instead of the address bar: AJAX with `XMLHttpRequest` in four steps (create the object, set `onreadystatechange`, `open(method, url, async)`, `send()`), the readyState values 0–4 and the HTTP status code groups. Four demos follow: (1) a GET with no arguments to a Node `http` server on port 8888; (2) a GET with a `?name=` query string parsed with `url.parse`; (3) an AJAX call to a remote server (sisterstech.com) that fails with a CORS error until the server adds `"Access-Control-Allow-Origin": "*"` to `writeHead`, with the CORS / Same-Origin Policy slide and its four footnotes, and open questions on `Access-Control-Allow-Methods`/`-Headers`, preflight requests and `OPTIONS`, Postman, and a ChatGPT 3.5 statement about CORS; (4) POST from the client (query string in the body) and a server that reads the body in chunks, then a combined GET/POST client (`ajaxPostGet.html`) and server (`serverPostGet.js`) with an explanation of request headers and `application/x-www-form-urlencoded`. The last part is marked for self-study: CRUD, installing XAMPP (MySQL/MariaDB + phpMyAdmin), creating a DB and a `score` table in phpMyAdmin, `npm install mysql`, connecting from Node with `mysql.createConnection` / `connect` / `query` to insert "elon musk" with 2900, and a video on hosting Node.js + MySQL on a cPanel shared host.

## Title, outline, review (slides 1–3)

- **Slide 1 (title).** "Adv Web Dev Arch" / "Lecture 5" (in a white box on a blue background); "Amir Amintabar, PhD"; "AJAX Calls".
- **Slide 2, "Outline (Building a Typical Web API, AJAX, intro to DB)".** Bullets, in order:
  - Review
  - - AJAX calls
    - Browser uses http methods to send request to server
  - - AJAX calls demos
  - - AJAX call to remote server
  - --- self study for next week
  - - Working with a Relational Database (CRUD)
  - - Using XAMPP package installer
  - - Connecting to mySQL DB using nodejs
  - - Hosting Node js, MySQL on remote server
- **Slide 3, "review".**
  - "Week 1: **general challenges when developing web app for various devices.** review material ( over 120 slides) provided to review HTML, CSS, JS ) create objects etc"
  - "Week 2: we defined the term web app architecture, then group-discussed various architecture types in web development, learned about local storage"
  - "Week 3: more intro to JS, timedout, order of execution, event loop, hoisting, var vs let, Anatomy of WebAPIs, intro to RESTful APIs, Microservices, GET vs POST"
  - "Week 4: [covered by a callout] ery function returns something nodejs modules". The callout hides a few words; the text layer reads "Week 4: minathjs.jsevery function returns something nodejs modules", which is the callout text "math.js" interleaved with the hidden words, so the bullet most likely reads "Week 4: in js every function returns something nodejs modules" [reconstructed from the text layer, not visible on the slide].
  - Callout (blue box, pointing at `'./modules/math'` in the code): "math**.js** Works too" (i.e. writing `require('./modules/math.js')` also works).
  - [figure: two VS Code editor panes side by side.] Left pane tab "testWithModule.js" (breadcrumb "testWithModule.js > ..."), cut off on the right:

```js
const mo = require('./modules/math');
let r = 10;
console.log(`Hello YOURNAME. The area i[cut off at the pane edge]
```

  Right pane tab "math.js" (breadcrumb "modules > math.js > area > area"):

```js
const PI = 3.1416;
exports.area = function (r)
    return r*r*PI;
};
```

  [note: as printed, line 2 of math.js has no opening `{` after `function (r)` (it may be hidden by the pane edge); the module as shown would not parse. The intended code is `exports.area = function (r) { return r*r*PI; };`.]

## AJAX calls with XMLHttpRequest (slides 4–9)

- **Slide 4 (section divider).** Circle "1", "AJAX calls".
- **Slide 5 (no title).**
  - "**So far** we sent our requests to the server via the **browsers' address bar**!"
  - "What if we wanted send requests to servers from within our HMTL (sic) pages and not browser address bar? e.g. to press a button and send something to the server?"
  - "You could do that either via forms / or / AJAX calls"
- **Slide 6.** "AJAX allows sending request to server". Figure titled "How AJAX Works" (from w3schools). URL: https://www.w3schools.com/xml/ajax_xmlhttprequest_create.asp
  - [figure: top row: box "Browser" containing "An event occurs... • Create an XMLHttpRequest object • Send HttpRequest" → arrow → orange oval "Internet" → arrow → box "Server" containing "• Process HTTPRequest • Create a response and send data back to the browser". A line runs down from the Server box and back left → orange oval "Internet" → arrow → bottom-left box "Browser" containing "• Process the returned data using JavaScript • Update page content".]
- **Slide 7.**
  - "Here is how we do it at the **client side** :"
  - "**1- Create an XMLHttpRequest Object:**"
    - "( just like the way we created Date object)"
    - `let xhttp = new XMLHttpRequest();`
- **Slide 8.** "**2- specify the function that handles response :**"

```js
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML =
        this.responseText;
     }
};
```

  - Blue callout pointing at `this.readyState`: "status of the XMLHttpRequest :"
    - "**0** (UNSENT): The XHR object has been created, but open() has not been called yet."
    - "**1** (OPENED): open() has been called."
    - "**2** (HEADERS_RECEIVED): send() has been called, and the headers of the response are available."
    - "**3** (LOADING): The response is being received. As data comes in, the responseText property is updated."
    - "**4** (DONE): The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred."
  - Yellow sticky note on the blue callout: "3(LOADING) code (sic) be updated multiple times to this status if the server is sending a large size of response in multiple chunks"
  - Green callout pointing at `this.status`: "http response type your server script returns:"
    - "200: "OK""
    - "3xx: generally used for redirection purposes"
    - "4xx: client error (something wrong with your request"
      - "403: "Forbidden""
      - "404: "Not Found" etc)"
    - "5xx: server error ( something wrong with the server)"
  - Q: Who determines what status code to return?
    A: (not on the slide)
- **Slide 9.**
  - "**3- Open AJAX request**"
  - `xhttp.open(method, url, Async or sync);` ("method" in red, "Async or sync" in blue)
    - "Method type could be GET or POST etc"
    - "url is the url of the file we want to handle our request"
  - "So what else is left?"
  - "Everything is in place! We just send it and carry on (we don't wait if we sent it asynchronously )"
  - ".4-xhttp.send();" (the step number is written as ".4-" in front of the call):

```js
xhttp.send();
```

## AJAX call demos: Demo 1 and Demo 2 (slides 10–14)

- **Slide 10 (section divider).** Circle "2", "AJAX call demos".
- **Slide 11.** Oval "Demo 1"; "sending AJAX call without any arguments !"
- **Slide 12.** Two screenshots.
  - Label "Client: ajax.html":

```html
<div id="demo">
    <h1>The XMLHttpRequest Object</h1>
    <button type="button" onclick="myFunc()">
        Change Content</button>
</div>
<script>
    function myFunc() {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:8888/",
            true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            console.log("hello")
        };
    }
</script>
```

  - Callout pointing at the `new XMLHttpRequest()` / URL line: "You can also type this url in the browser address bar. Since it's a Get request"
  - Label "Server: app.js":

```js
const http = require('http');
http.createServer(function (req, res) {
  console.log("The server recived a request ");
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.end("server's response!");
}).listen(8888);
```

  (sic "recived" in the log string.)
  [note: in this client, `onreadystatechange` is assigned after `send()`; that works for an async request because the state-change events fire later, but the usual order is to assign the handler before `send()`. This handler logs "hello" on every state change (several times), not only on readyState 4.]
- **Slide 13.** Oval "Demo 2"; "sending AJAX call with passing arguments !"
- **Slide 14.** Two screenshots plus two browser screenshots.
  - Label "Client: ajax.html":

```html
<h1>The XMLHttpRequest Object</h1>
<div id="demo">
    <button type="button" onclick="myFunc()">Change Content</button>
</div>
<script>
    function myFunc() {
        const xhttp = new XMLHttpRequest();
        const str = "John";//"John&age=23"; for multiple parameters
        xhttp.open("GET", "http://localhost:8888/?name=" + str, true);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("demo").innerHTML =
                    this.responseText;
            }
        };
    }
</script>
```

  - Label "Server: app.js":

```js
let http = require('http');
let url = require('url');
http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  console.log(q.query); //returns '?name=John'
  res.writeHead(200, {"Content-Type": "text/html",
  "Access-Control-Allow-Origin": "*"});
  res.end('Hello '+q.query["name"]);
}).listen(8888);
```

  - Browser output, two states (hand-drawn red "1" and "2"):

```text
(1)
The XMLHttpRequest Object
[Change Content]

(2)
The XMLHttpRequest Object
Hello John
```

  [note: the comment `//returns '?name=John'` is loose: with `url.parse(req.url, true)`, `q.query` is the object `{ name: 'John' }` (slide 17's version of the comment says "the object form of '?name=John'"). `url.parse` is a legacy API; current Node recommends `new URL(req.url, base)` and `searchParams`.]

## Demo 3: AJAX call to a remote server and CORS (slides 15–21)

- **Slide 15.** Oval "Demo 3"; "AJAX call to remote server"; "Configuring CORS".
- **Slide 16.** "Who has seen a similar message?" [figure: Chrome DevTools, Console tab selected (tabs Elements, Console, Sources, Network, Performance, >>; red error badge "2"; toolbar "top", "Filter", "Default levels", "2 Iss[ues]"). One red error, cut off on the right:]

```text
Access to XMLHttpRequest at 'http://localhost:8888/?name=John' from origin
'null' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' he[cut off]
the invalid value
```

- **Slide 17, "Demo 3".** "Last time we tested this:" [figure: cPanel file editor, "Editing: /home/sisterst/app1/app.j[s]", "Encoding: utf-8", "Re-open", "Keyboard shortcuts". A red arrow points up at the end of line 6 (the writeHead headers, which have no Access-Control-Allow-Origin).]

```js
const http = require('http');
const url = require('url');
const server = http.createServer(function(req, res) {
  const q = url.parse(req.url, true);
  console.log(q.query); //returns the object form of '?name=John'
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Hello '+q.query["name"]);
});
server.listen();
```

  Browser screenshot beside it: address bar "sisterstech.com/app1/?name=John"; page:

```text
Hello John
```

  [note: `server.listen()` with no port is how the cPanel/Passenger host runs the app (it supplies the port); on a plain Node install it would bind a random free port.]
- **Slide 18, "CORS – when a browser sends a req to a server".**
  - "CORS is a security feature **implemented in web browsers** and is **configured by the contacted server** in the response's header to the AJAX requests made via the browser¹"
  - "CORS (Cross-Origin Resource Sharing)"
  - "By default² , web browsers enforce a security policy called "Same-Origin Policy " (SOP) means the html files containing the AJAX requests have to be hosted in the same origin³ that also hosts the server side scripts, responding to those requests."
  - "browsers will block² the **Cross-Origin Requests** unless **the server** being contacted **explicitly allows** it" (the last line overlaps footnote 1 on the slide)
  - Footnotes:
    - "1: requests made mainly via AJAX, ( also in most browsers via forms the url address bar)."
    - "2: expected behaviour for most browsers"
    - "3: An origin is ( supposed to be) defined by the combination of domain, protocols and ports ( 80 is the default for HTTP, 443 for HTTPS)"
    - "4: When a web page hosted in originA needs to cross and send requests to a server in another origin, originB"
  - Big blue arrow: "Let's see how a server script configures/dictates CORS for browsers making the requests"
  - [note: footnote 1 is wrong in part: CORS applies to script-initiated requests (XMLHttpRequest/fetch, and some resource loads such as fonts); navigating via the address bar or submitting an HTML form is not blocked by CORS. Footnote 4 has no marker in the slide text; it describes what a "cross-origin" request is.]
- **Slide 19, "Configure the browser CORS in your server side script!"**
  - "We now pass one more argument to the writehead () method which creates connection back to the client."
  - "The **"Access-Control-Allow-Origin" tells the browser** what origins can send requests to this server"
  - "In our case we chose "*" which means everyone! all origins around the world Can Send request to this server"
  - "Since we said "Access-Control-Allow-Origin": "*"" [the rest of this bullet is hidden behind the screenshot]
  - Label "server side (node js)": cPanel editor "Editing: /home/sisterst/app1/app.j[s]", "Encoding: utf-8", "Re-open". Lines 7–8 circled in red:

```js
const http = require('http');
const url = require('url');
const server = http.createServer(function(req, res) {
  const q = url.parse(req.url, true);
  console.log(q.query); //returns the object form of '?[cut off]
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*"
  });
  res.end('Hello '+q.query["name"]);
});
server.listen();
```

  - Label "Client side (HTML Javascript)": Chrome window, address "file:///C://code/nodejs/7Ajax-remote-with-parameters...". The page shows "The XMLHttpRequest Object" and "Hello John" with a red check mark. DevTools Sources tab shows ajax.html (tree: top > file:// > C:/User[s…] > ajax.h[tml]), horizontally scrolled so the start of some lines is hidden, and cut off on the right:

```text
1
2
3
4
5 The XMLHttpRequest Object</h1>
6  id="demo">
7 <button type="button" onclick="myFunc()">Change Con[cut off]
8 v>
9 ipt>
10 function myFunc() {
11     const xhttp = new XMLHttpRequest();
12     const str = "John";//"John&age=23"; for multipl[cut off]
13     xhttp.open("GET", "https://sisterstech.com/app1[cut off]
14     xhttp.send();
15     xhttp.onreadystatechange = function () {
16         if (this.readyState == 4 && this.status == [cut off]
17             document.getElementById("demo").innerHT[cut off]
18                 this.responseText;
19         }
20     };
21 }
22 ript>
23
24
```

  Status bar: "Line 1, Column 1".
- **Slide 20 (no title).**
  - Q: What do these two do? Access-Control-Allow-Methods / Access-Control-Allow-Headers
    A: (not on the slide)
  - Q: What is a **Preflight Request** and how is it relevant to the http method OPTIONS
    A: (not on the slide)
  - Q: How the http method OPTIONS should be implemented at the server side ( what should the server return upon an OPTIONS request?
    A: (not on the slide)
- **Slide 21 (no title).**
  - Q: Can we send requests to any url and expect respond using Postman regardless of the CORST (sic) setting ?
    A: (not on the slide)
  - "This statement has been generated by chatGPT 3.5. "CORS allows for secure communication between web applications hosted on different domains while still maintaining control over which domains have access. "" (A red squiggle is drawn through the quoted statement.)
  - Q: what seems to be wrong with the above statement?
    A: (not on the slide)
  - [note, for writers, not on the slide: the slide 18 framing implies the answers. CORS does not make communication "secure" (no encryption or authentication; that is HTTPS); it is a browser-enforced relaxation of the Same-Origin Policy that the server opts into; it is about origins (scheme + host + port), not just domains; and it does not control which clients have access, since non-browser clients such as Postman or curl ignore it entirely.]

## Demo 4: POST, client and server (slides 22–24)

- **Slide 22.** Oval "Demo 4"; circle "3".
- **Slide 23, "POST client side".** VS Code, lines 3–22 shown (lines 1–2 not shown). Yellow note with a line to the `xhr.send("name=" + name)` call: "For POST, the query string sits in the body of the request".

```html
    <head>
        <script>
            function sendRequest() {
                const name = document.getElementById("name").value;
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:3000");
                xhr.send("name=" + name);
                xhr.onload = function () {
                    let response = xhr.responseText;
                    document.getElementById("result").innerHTML = response;
                };
            }
        </script>
    </head>

    <body>
        <input type="text" id="name" placeholder="Enter your name">
        <button onclick="sendRequest()">Send Request</button>
        <div id="result"></div>
    </body>
```

- **Slide 24, "POST server side".** "See how data is / extracted from the / POST request ***in chunks***"

```js
const http = require("http");
const server = http.createServer(function(req, res) {
  // check if the request method is POST
  if (req.method === "POST") {
    if (req.headers["access-control-request-method"]) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST");
      res.end();
    } else {
      let query = "";
      req.on("data", function(chunk) {
        query += chunk;
      });
      req.on("end", function() {
        let params = new URLSearchParams(query);
        let name = params.get("name");
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.write("Hello " + name);
        res.end();
      });
    }
  }
});
// listen on port 3000
server.listen(3000, function() {
  console.log("Server is running on port 3000");
});
```

  [note: a real preflight arrives with method OPTIONS (carrying the `Access-Control-Request-Method` header), not POST, so the inner `if` never sees one; this server answers nothing for OPTIONS (or GET) and the request hangs. It still works with the slide 23 client because `xhr.send(string)` without a custom header is a "simple" request (Content-Type `text/plain;charset=UTF-8`) and triggers no preflight.]

## Demo 4: ajaxPostGet.html and serverPostGet.js (slides 25–30)

- **Slide 25.** Oval "Demo 4".
- **Slide 26, "Client side: POST and GET (ajaxPostGet.html)".** "Some variable initializations". Breadcrumb "ajaxPostGet.html > html > body > script".

```html
<html>
<head>
</head>
<body>
    <h1>The XMLHttpRequest Object</h1>
    <button type="button" onclick="post()">POST</button>
    <button type="button" onclick="getAll()">GET</button>

    <div id="demo">
        no response yet!
    </div>
    <script>
        const xhttp = new XMLHttpRequest();
        const endPointRoot = "http://localhost:8888/API/v1/";
        let params = "?name=John&age=23";// or a json string
        let resource = "patients/";
```

  Browser rendering at left:

```text
The XMLHttpRequest Object
[POST] [GET]
no response yet!
```

- **Slide 27, "Client side: POST and GET (ajaxPostGet.html)"** (continues, lines 17–42).
  - "The 'application/x-www-form-urlencoded'"
  - "content type describes form data that is"
  - "sent in a single block in the HTTP message body."
  - "A header is a piece of information about the data sent via HTTP request. It tells the server receiving the request what type of data is enclosed, its formatting, the language used. (If you remember, The server also puts something similar in the head part of the response)"
  - "More than one header can be put on a HTTP request; each in a 'name' and a 'value' pair"
  - Yellow note with a line under `xhttp.send(params);`: "For POST, the query sits in the body of the request"

```js
    /** send() accepts an optional parameter which lets you specify the request's body;
   this is primarily used for requests such as POST, PUT. If the request method is GET
    or HEAD, the body parameter is ignored and the request body is set to null.
    **/
        function post() {
            xhttp.open("POST", endPointRoot + resource, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("demo").innerHTML =
                        this.responseText;
                }
            };
        }
        function getAll() {
            const url = endPointRoot + resource + params;
            xhttp.open("GET", url, true);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("demo").innerHTML =
                        this.responseText;
                }
            };
        }
```

  [note: the POST body sent is "?name=John&age=23" with a leading "?"; a strict form-urlencoded parser would read the first key as "?name". It works on slide 28 only because the server runs the body through `url.parse`, which treats the "?" as the start of a query string.]
- **Slide 28, "Server side: POST and GET".**
  - "Note the differences between handling a GET request and a POST request"
  - "See how data is extracted from the POST request ***in chunks***"
  - VS Code, breadcrumb "serverPostGet.js > http.createServer() callback". On lines 16 and 31 the editor shows small grey dots between tokens (`res.• end(`, `= • url.• parse(`); these are editor markers, not code characters, and are dropped below.

```js
const http = require('http'); const url = require('url');
const GET = 'GET'; const POST = 'POST';
const endPointRoot = "/API/v1/";
http.createServer(function (req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html",
        //all origions can send request to this server
        // is this really a good practice?
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
    });
    console.log(req.headers);
    if (req.method === GET) {
        const q = url.parse(req.url, true);
        // here you fetch some data from DB
        res.end(`Hello  ${q.query["name"]}.
        GET all request is recvied!`);
    }
    if (req.method === POST && req.url === endPointRoot + 'patients/') {
        let body = "";
        /* req.on('data' gets called when something has been read
        from the stream */
        req.on('data', function (chunk) {
            if (chunk != null) {// you need to check this if
                body += chunk;// data may come in multiple chunks
            }
        });
        /*req.on('end' gets called when stream has ended
        ( all data from cleint has arrived to server)*/
        req.on('end', function () {
            let q = url.parse(body, true);
            res.end(`Hello: ${q.query.name}, we got your POST request`);
        });
    }
}
).listen(8888);
```

  (sic: "origions", "recvied", "cleint"; two spaces after "Hello" on line 16.)
  [note: `Access-Control-Allow-Methods` only matters in the response to a preflight (OPTIONS) request; this server never ends the response for an OPTIONS request or a POST to another path, so those requests hang. Because the POST client sets only `Content-type: application/x-www-form-urlencoded` (a CORS-safelisted value), no preflight is sent here.]
- **Slide 29.** Oval "Question!". "In the context of HTTP methods and Cross-Origin Resource Sharing (CORS), what is a "preflight request,"?"
  - Q: In the context of HTTP methods and Cross-Origin Resource Sharing (CORS), what is a "preflight request,"?
    A: (not on the slide)
- **Slide 30.**
  - "Disclaimer: It's the students' responsibility to write their own code."
  - "Codes provided in lecture notes are just samples to get students a head start ."

## Working with a relational database: CRUD and XAMPP (slides 31–35)

- **Slide 31 (section divider).** "Working with a Relational Database", circle "4". "**Content from this point onward are to be self studied for the next week . . .**"
- **Slide 32, "CRUD".**
  - "This week we will discuss how to connect node js to a relational DB such as MySQL server ( the free open source version is called MarinaDB)"
  - "We will learn how to run SQL queries which can be used to"
  - "**C**reate a table or DB"
  - "**R**ead from a DB"
  - "**U**pdate records on a DB"
  - "**D**elete a record or Drop a table"
  - "All of this operation with DB all referred as CRUD in brief"
  - "In this lecture we focus on the node js part mostly assuming writing SQL statement is covered in your term 2 DB course"
  - [note: "MarinaDB" is a typo for MariaDB (slide 34 spells it correctly). MariaDB is a community fork of MySQL, not "the free open source version" of it; MySQL Community Server is itself open source (GPL).]
- **Slide 33 (section divider).** "Introduction to Connecting to DB using node js on your **PC**".
- **Slide 34, "Using XAMPP package installer".**
  - "You need a DB engine that runs SQL statements for you"
  - "And a DB administrative tool like an editor on which you could write your SQL statements and see result visually"
  - "1- XAMPP installs both"
  - "2- The DB engine (mySQL)"
  - "3- And DB admin tool (phpMyAdmin)"
  - Circle "5".
  - [figure: the word "install" above the "XAMPP" logo (orange square icon), circled "1"; "MariaDB (MySQL)" circled "2"; "phpMyAdmin" circled "3".]
- **Slide 35, "Setting up DB server on your PC".**
  - "We need to install mySQL DB server. It's a relational DB engine which runs our SQL queries"
  - "As well we need phpMyAdmin which is a web based database administrative tool. It is web based therefore you can use it remotely or share a datable (sic) with your partner"
  - "phpMyAdmin needs PHP engine to run"
  - "XAMPP is an application package installer that installs all of those for us"
  - [figure: Google search for "xampp": "About 7,860,000 results (0.55 seconds)"; result "www.apachefriends.org", "XAMPP Installers and Downloads for Apache Friends", "XAMPP is an easy to install Apache distribution containing MariaDB, PHP and Perl."; sub-links "Download — Download XAMPP for Windows, Linux, and OS X. Older ..." (orange arrow points to it) and "New XAMPP release 7. — New XAMPP release 7.2.33 , 7.3.22 , 7.4.10. Hi Apache ..."]

## phpMyAdmin: create a DB and a table, run SQL (slides 36–41)

- **Slide 36 (no title).**
  - "1: clicking on admin will take you to phpMyAdmin"
  - "2- Clicking on shell will take you to the mySQL command line"
  - [figure: "XAMPP Control Panel v3.2.4 [ Compiled: Jun 5th 2019 ]". Module table (Service, Module, PID(s), Port(s), Actions): Apache (green) PIDs 6340, 23280, ports 80, 443, buttons Stop/Admin/Config/Logs; MySQL (green) PID 20544, port 3306, Stop/Admin/Config/Logs; FileZilla, Mercury, Tomcat not running (Start). Right column buttons: Config, Netstat, Shell, Explorer, Services, Help, Quit. Hand annotations: "running" pointing at the Stop buttons; "1" with a line to MySQL's "Admin" button (circled); "2" circled pointing at "Shell".] Log pane:

```text
12:03:16 PM  [mysql]  Checking default ports...
12:03:16 PM  [mysql]  Portblocker Detected: mysqld.exe
12:03:16 PM  [mysql]  Checking for App: c:\xampp\mysql\bin\mysqld.exe
12:03:16 PM  [mysql]  Portblocker Path: C:\xampp\mysql\bin\mysqld.exe
12:03:16 PM  [mysql]  Portblocker Service Path:
12:03:16 PM  [mysql]  XAMPP MySQL is already running on port 3306
12:03:16 PM  [main]   The FileZilla module is disabled
```

- **Slide 37, "2- goto phpMyAdmin and to create a DB and a table".**
  - "Clicking on that link Loads"
  - "http://localhost/phpmyadmin/"
  - "( Make sure MySQL is running on XAMPP)"
  - [figure: XAMPP Control Panel v3.2.4 again; Apache PIDs 6348, 14020, ports 80, 443; MySQL PID 12244, port 3306 (MySQL underlined in red); hand-written "click" with a red arrow to MySQL's "Admin" button.] Log pane:

```text
8:59:21 AM  [Tomcat]  Checking for module existence...
8:59:21 AM  [Tomcat]  Checking for required tools...
8:59:21 AM  [Tomcat]  Checking for service (name="Tomcat7"): Service not installed
8:59:21 AM  [Tomcat]  Service Path: Service Not Installed
8:59:21 AM  [Tomcat]  Checking default ports...
8:59:21 AM  [main]    Enabling autostart for module "Apache"
8:59:21 AM  [main]    Enabling autostart for module "MySQL"
8:59:21 AM  [main]    Starting Check-Timer
8:59:21 AM  [main]    Control Panel Ready
8:59:22 AM  [Apache]  Autostart active: starting...
8:59:22 AM  [Apache]  Checking default ports...
8:59:22 AM  [Apache]  Attempting to start Apache app...
8:59:22 AM  [Apache]  Executing "c:\xampp\apache\bin\httpd.exe"
8:59:22 AM  [Apache]  Return code: 0
8:59:22 AM  [mysql]   Autostart active: starting...
8:59:22 AM  [mysql]   Checking default ports...
8:59:22 AM  [mysql]   Attempting to start MySQL app...
8:59:22 AM  [mysql]   Executing ""c:\xampp\mysql\bin\mysqld.exe" --defaults-file="c:\xampp\mysql\bin\my.ini" --standalone"
8:59:22 AM  [mysql]   Return code: 0
8:59:22 AM  [Apache]  Status change detected: running
8:59:22 AM  [mysql]   Status change detected: running
```

- **Slide 38, "3- create a DB in phpmyadmin".** [figure: browser at "localhost/phpmyadmin/server_databases.php?lang=en"; phpMyAdmin, "Server: 127.0.0.1", tabs Databases, SQL, Status, User accounts, Export, Impor[t]. Left tree: "Recent", "Favorites", "New" (red arrow labelled "1" points at it), other DB names blurred out, "northwind2". Main pane "Databases" → "Create database" (red arrow labelled "2"), name field "webDev" (underlined in red), collation "utf8mb4_general_ci", button "Create". "Filters: Containing the word:". Table Database / Collation / Action: "100sql utf8mb4_general_ci Check privileges", "amir1 utf8mb4_general_ci Check privileges".]
- **Slide 39, "4- create a table in that DB to store scores".**

```sql
CREATE TABLE score (
 scoreID INT AUTO_INCREMENT,
 name VARCHAR (100),
 score INT,
 PRIMARY KEY(scoreID)
);
```

  - "Note: It is ok to have column names with the same name as the table name, both are score"
  - "the Now our DB is ready!" (sic)
  - [figure: browser at "localhost/phpmyadmin/db_sql.php?db=webdb" (underlined in blue); "Server: 127.0.0 …"; tabs Structure, SQL, Search, Query, Export. Orange annotations: "1 click" with an arrow to "webdb" in the left tree; "2 click" with an arrow to the "SQL" tab; panel "Run SQL query/queries on database webdev :" (webdev underlined in blue) holding the same CREATE TABLE statement, labelled "3 Query"; buttons Clear, Format, Get auto-saved query; "Bind parameters"; "[ Delimiter ; ]", checkbox "Show this query here again"; "4" with an arrow to "Go".]
  - [note: the screenshot mixes names: the URL and tree say "webdb", the SQL panel says "webdev", slide 38 typed "webDev", and slides 40, 41, 44, 45 use "webdev".]
- **Slide 40, "5- notice the confirmation message on creation of table".** [figure: "localhost/phpmyadmin/db_sql.php?db="; breadcrumb "Server: 127.0.0.1 » Database: comp4537"; tabs Structure, SQL, Search, Query, Export, Import, Opera[tions]; "Show query box". Left tree: New, 100sql, amir1, amir_peer, bus464, chimigan, classicmodels, webdev > New, score. An orange arrow runs from the green message to "score" (boxed) in the tree.]

```text
✔ MySQL returned an empty result set (i.e. zero rows). (Query took 0.0331 seconds.)
CREATE TABLE score ( scoreID INT AUTO_INCREMENT, name VARCHAR (100), score INT, PRIMARY KEY(scoreID) )
```

- **Slide 41, "6- run few SQL statements on table you have created".** "0- make sure you have selected the DB you have created to run the SQL query on that". [figure: URL ".../phpmyadmin/tbl_sql.php?db=webdev&table=score" ("table=score" underlined); breadcrumb "Server: 127.0.0.1 » Database: webdev » Table: score"; tabs Browse, Structure, SQL, Search, Insert, Export, Imp[ort] (SQL tab and the tab row underlined in red). Red "1" next to the query; red "2" next to the result row.]

```text
✔ Showing rows 0 - 0 (1 total, Query took 0.0004 seconds.)
SELECT * FROM `score`

Show all | Number of rows: 25 | Filter rows: Search this table
scoreID  name  score
1        John  100
```

## Connecting to MySQL from Node.js (slides 42–45)

- **Slide 42 (section divider).** Circle "6", "Connecting to mySQL DB using nodejs".
- **Slide 43, "7. Connect with DB using node js".**
  - "Turns out, mysql is an external module and needs to be installed"
  - "Here is how to"
  - "1 at command prompt switch to the current directory of this file"
  - "2 enter >npm install mysql"
  - [figure: VS Code file "db_simple.js", lines 3–8 visible (line 2 is a faded comment "//enter>npm install mysql", partly scrolled off); a breakpoint dot on line 7. A red double-headed arrow links `require("mysql")` to the Debug Console below.]

```js

const mysql = require("mysql");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
```

  Debug Console (tabs TERMINAL, PROBLEMS, OUTPUT, DEBUG CONSOLE):

```text
C:\Program Files\nodejs\node.exe .\db_simple.js
> Uncaught Error: Cannot find module 'mysql'
Debugger listening on ws://127.0.0.1:61995/a7d40b89-307e-4c54-a91b-931dad04061[cut off]
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.
internal/modules/cjs/loader.js:638
    throw err;
    ^

Error: Cannot find module 'mysql'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:636:15[cut off]
    at Function.Module._load (internal/modules/cjs/loader.js:562:25)
    at Module.require (internal/modules/cjs/loader.js:692:17)
```

  Terminal output of the install (black box, bottom left):

```text
+ mysql@2.18.1
added 11 packages from 15 contributors and audited 11 packages in 1.094s
found 0 vulnerabilities
```

  [note: the `mysql` package (2.18.1 is its last release) is no longer maintained and does not support MySQL 8's default `caching_sha2_password` authentication; `mysql2` is the usual replacement with the same `createConnection`/`connect`/`query` API.]
- **Slide 44 (no title).**
  - "First create a myslq (sic) object"
  - "Then connect"
  - "And run a SQL statement"

```js
// at command prompt switch to the current directory of this file
//enter>npm install mysql
const mysql = require("mysql");
// Create connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "webdev"
});
// Connect to MySQL to run SQL query
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "INSERT INTO score(name, score) values ('elon musk', 2900)[cut off at the slide edge]
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
```

  (The `let sql = …` line runs past the slide edge after `2900)`; the closing `"` and `;` are not visible. `result` is greyed out in the editor because it is unused. The final `});` is indented two spaces as shown.)
- **Slide 45, "Check your table to verify the SQL ran successfully on node".**
  - "As you can see"
  - "The score of"
  - "elon musk was entered in our table"
  - "Successfully!"
  - [figure: browser at "localhost/phpmyadmin/tbl_sql.php?db=webdev&table=score"; breadcrumb "Server: 127.0.0.1 » Database: webdev » Table: score"; tabs Browse, Structure, SQL, Search, Insert, Export. Left tree shows qa_userlogins, qa_usermetas, qa_usernotices, qa_userpoints, qa_userprofile, qa_users, qa_uservotes, qa_widgets, qa_words, qajul2020, qa_of_teamrate, sakila, sisters, teamrate_dec4, webdev > New, score.]

```text
✔ Showing rows 0 - 1 (2 total, Query took 0.0004 seconds.)
SELECT * FROM `score`

Profiling [Edit inline] [ Edit ] [ Explain SQL ] [ Create PH[P code]
Show all | Number of rows: 25 | Filter rows: Search this table
scoreID  name       score
1        John       100
3        elon musk  2900
```

  (scoreID jumps from 1 to 3: AUTO_INCREMENT does not reuse IDs, so a row 2 was inserted and deleted earlier, or an insert failed.)

## Hosting Node.js + MySQL on a remote server (slides 46–50)

- **Slide 46 (section divider).** "Hosting Node js, MySQL on remote server", circle "7". Blue arrow pointing down at: "Please watch this video" / "**Hosting nodejs MySql remotely CPanel Shared Hosting.mp4**"
- **Slide 47 (video title card, orange background).** "Node js + MySQL", "cPanel"; rotated text in the top-left corner "Beginner' sguid" (sic, a broken "Beginner's guide"); bottom-left "remote" / "server".
- **Slide 48, "How to host nodejs MySQL in share hosting accounts".** [figure: cPanel home, three sections. SOFTWARE: "WordPress Manager by Softaculous Apps Installer", "PHP PEAR Packages", "Perl Modules", "Setup Node.js App" (circled in red), "Select PHP Version", "Setup Python App". DATABASES: "phpMyAdmin", "MySQL® Databases" (circled in red), "MySQL® Database W[izard]" (cut off). ADVANCED: "Terminal" (circled in red), "Cron Jobs", "Track DNS", "Apache Handlers", "MIME Types", "Virus Scanner".]
- **Slide 49 (no title).** [figure: browser tabs "cPanel - MySQL® Databases", "cPanel File Manager v3", "app.js - cPanel File Manager v3" (active), "sisterstech.com/nodemysql"; address bar (blurry) "https://quebec.gendns.com:2083/cpsess8251677349/frontend/paper_lantern/filemanager/edit…"; "Editing: [si]sterst/nodemysql/app.js", "Encoding: utf-8", "Re-open", "Keyboard shortcuts".]

```js
var http = require('http');
const mysql = require("mysql");
// Create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "sisterst_nodemysql",
    password: "nodemysql123",
    database: "sisterst_nodemysql"
});

var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    db.connect(function (err) {
        if (err) {
            throw err;
        }
        var message = 'Connected! It works!\n',
            version = 'NodeJS ' + process.versions.node + '\n',
            response = [message, version].join('\n');
        res.end(response);
    });

});
server.listen();
```

  [note: calling `db.connect()` inside the request handler works for the first request only; a second request calls `connect()` on an already-connected connection and the `mysql` module raises an error ("Cannot enqueue Handshake after already enqueuing a Handshake"). Connect once at startup or use a pool.]
- **Slide 50, "source".** "chatGPT 3.5 used to generate partial code for this set"

## Facts and numbers index

- Slide 2: outline has 9 bullets plus 1 sub-bullet; "--- self study for next week" splits AJAX (in class) from the DB part (self-study).
- Slide 3: week 1 review material is "over 120 slides".
- Slide 6: How AJAX Works: Browser (event occurs, create XMLHttpRequest object, send HttpRequest) → Internet → Server (process HTTPRequest, create response, send data back) → Internet → Browser (process returned data using JavaScript, update page content).
- Slides 7–9: the 4 client-side steps: 1- create an XMLHttpRequest object (`let xhttp = new XMLHttpRequest();`, "just like the way we created Date object"); 2- specify the function that handles the response (`onreadystatechange`); 3- open the request (`xhttp.open(method, url, Async or sync)`); 4- `xhttp.send()`.
- Slide 8: readyState values: 0 UNSENT (created, open() not called), 1 OPENED (open() called), 2 HEADERS_RECEIVED (send() called, response headers available), 3 LOADING (response being received, responseText updated), 4 DONE (complete, success 2xx or error).
- Slide 8: readyState 3 can be reached multiple times when the server sends a large response in multiple chunks.
- Slide 8: success test is `this.readyState == 4 && this.status == 200`.
- Slide 8: status groups: 200 "OK"; 3xx redirection; 4xx client error (403 "Forbidden", 404 "Not Found"); 5xx server error.
- Slide 9: `open()` method could be GET or POST etc.; url is the url of the file we want to handle our request; third argument async or sync; with async "we don't wait".
- Slide 5: two ways to send requests from within a page: forms or AJAX calls.
- Slide 12: Demo 1 server listens on port 8888; GET to `http://localhost:8888/`; a GET URL can also be typed in the address bar.
- Slide 14: Demo 2 query string `?name=` + "John"; multiple parameters joined with `&` ("John&age=23"); server reads `q.query["name"]` after `url.parse(req.url, true)`; response "Hello John".
- Slide 16: CORS error text: "Access to XMLHttpRequest at 'http://localhost:8888/?name=John' from origin 'null' has been blocked by CORS policy" (origin 'null' = page opened from file://).
- Slide 17: remote server URL `sisterstech.com/app1/?name=John` → "Hello John"; that server's writeHead had only "Content-Type".
- Slide 18: CORS = Cross-Origin Resource Sharing; implemented in web browsers, configured by the contacted server in the response's header.
- Slide 18: SOP = Same-Origin Policy, enforced by default: the HTML containing the AJAX requests must be hosted in the same origin as the server-side scripts answering them.
- Slide 18: browsers block cross-origin requests unless the contacted server explicitly allows it.
- Slide 18 fn 3: origin = domain + protocol + port; default port 80 for HTTP, 443 for HTTPS.
- Slide 18 fn 4: cross-origin = page hosted in originA sends requests to a server in originB.
- Slide 19: `"Access-Control-Allow-Origin"` tells the browser what origins can send requests to this server; `"*"` means everyone (all origins); passed as an extra entry in `writeHead`'s header object.
- Slide 20: headers asked about: Access-Control-Allow-Methods, Access-Control-Allow-Headers; preflight request ↔ HTTP method OPTIONS.
- Slide 21: the quoted CORS statement was generated by chatGPT 3.5.
- Slide 23: POST demo client posts to `http://localhost:3000`, body `"name=" + name`, response handled in `xhr.onload`; "For POST, the query string sits in the body of the request".
- Slide 24: POST server on port 3000 collects the body with `req.on("data", …)` (`query += chunk`) and finishes in `req.on("end", …)`, parses with `new URLSearchParams(query)`, replies "Hello " + name as text/plain.
- Slide 26: ajaxPostGet.html: `endPointRoot = "http://localhost:8888/API/v1/"`, `params = "?name=John&age=23"`, `resource = "patients/"`.
- Slide 27: POST sends `params` in the body with header `Content-type: application/x-www-form-urlencoded`; GET appends params to the URL and sends nothing in the body.
- Slide 27: `send()` body is used for POST, PUT; for GET or HEAD the body is ignored and set to null.
- Slide 27: 'application/x-www-form-urlencoded' describes form data sent in a single block in the HTTP message body.
- Slide 27: a header is information about the data sent (type of data enclosed, formatting, language); more than one header per request, each a 'name' and 'value' pair.
- Slide 28: serverPostGet.js listens on 8888, `endPointRoot = "/API/v1/"`; writeHead sets `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Methods: *`; GET → "Hello  John. GET all request is recvied!"; POST to `/API/v1/patients/` → "Hello: John, we got your POST request".
- Slide 28: `req.on('data')` is called when something has been read from the stream; `req.on('end')` when the stream has ended (all data from client has arrived); data may come in multiple chunks.
- Slide 31: everything from slide 31 onward is self-study for the next week.
- Slide 32: CRUD = Create (a table or DB), Read (from a DB), Update (records), Delete (a record, or Drop a table).
- Slide 32: writing SQL is assumed from the term 2 DB course.
- Slide 34: XAMPP installs (1) itself as the package installer, (2) the DB engine (mySQL / MariaDB), (3) the DB admin tool (phpMyAdmin).
- Slide 35: phpMyAdmin is web based (usable remotely, shareable) and needs the PHP engine to run.
- Slide 36: XAMPP Control Panel v3.2.4; Apache ports 80, 443; MySQL port 3306; "Admin" → phpMyAdmin, "Shell" → MySQL command line.
- Slide 37: phpMyAdmin URL `http://localhost/phpmyadmin/`; MySQL must be running in XAMPP.
- Slide 38: DB created "webDev", collation utf8mb4_general_ci.
- Slide 39: table `score(scoreID INT AUTO_INCREMENT, name VARCHAR (100), score INT, PRIMARY KEY(scoreID))`; a column may share the table's name.
- Slide 40: CREATE TABLE returns "an empty result set (i.e. zero rows)" (0.0331 seconds).
- Slide 41: first row: scoreID 1, John, 100.
- Slide 43: `mysql` is an external module: `npm install mysql` (installed mysql@2.18.1, 11 packages, 1.094s, 0 vulnerabilities); without it Node throws "Error: Cannot find module 'mysql'".
- Slide 44: 3 steps: create a mysql object (`mysql.createConnection({host, user, password, database})`), connect (`con.connect`), run a SQL statement (`con.query(sql, callback)`); local XAMPP credentials host "localhost", user "root", password "" (empty), database "webdev".
- Slide 44: inserted row: name 'elon musk', score 2900; success log "1 record inserted".
- Slide 45: table afterwards: (1, John, 100), (3, elon musk, 2900); "Showing rows 0 - 1 (2 total…)".
- Slide 46: hosting video: "Hosting nodejs MySql remotely CPanel Shared Hosting.mp4".
- Slide 48: cPanel tools used: Setup Node.js App, MySQL® Databases, Terminal.
- Slide 49: remote app.js connects with user/database "sisterst_nodemysql", host "localhost"; response "Connected! It works!" plus "NodeJS " + `process.versions.node`; `server.listen()` with no port.
- Slide 50: chatGPT 3.5 generated part of the code in the deck.

## Likely quiz traps

- CORS is **implemented in (enforced by) the browser** but **configured by the contacted server** in its response headers; it is not a server-side firewall (slide 18).
- The Same-Origin Policy is the default; CORS is how a server **relaxes** it for other origins. Browsers block cross-origin requests unless the server explicitly allows them (slide 18).
- An origin is domain + protocol + port, not just the domain; 80 is the default port for HTTP, 443 for HTTPS (slide 18 fn 3). Same domain on a different port is a different origin.
- `"Access-Control-Allow-Origin": "*"` means every origin may send requests; the server code itself asks "is this really a good practice?" (slides 19, 28).
- readyState order 0 UNSENT → 1 OPENED → 2 HEADERS_RECEIVED → 3 LOADING → 4 DONE; 3 can repeat for a chunked response; 4 (DONE) covers both success and error, which is why the check also needs `status == 200` (slide 8).
- Status groups: 3xx = redirection, 4xx = client error (403 Forbidden, 404 Not Found), 5xx = server error (slide 8). The status code is returned by your server script (green box label, slide 8).
- The four AJAX steps in order: create the XMLHttpRequest, set the handler, `open(method, url, async)`, `send()`; with async = true the code does not wait (slides 7–9).
- For POST the query string sits in the **body** of the request (passed to `send()`); for GET it is in the URL and `send()` gets no body (slides 23, 27). For GET or HEAD a body passed to `send()` is ignored (slide 27).
- A POST body arrives **in chunks**: collect in `req.on('data')`, use it only in `req.on('end')` (slides 24, 28).
- 'application/x-www-form-urlencoded' sends form data in a single block in the message body; a request can carry several headers, each a name/value pair (slide 27).
- Postman (a non-browser client) is not subject to CORS, since CORS is enforced by browsers (slide 21 question, answered by slide 18's definition).
- The ChatGPT 3.5 statement is the deck's example of a flawed claim: CORS does not provide "secure communication" (slide 21).
- `mysql` is an external module and must be installed with `npm install mysql`, unlike the built-in `http` and `url` modules (slide 43).
- CRUD: Delete covers both deleting a record and dropping a table; Create covers a table or a DB (slide 32).
- A column may have the same name as its table (`score.score`) (slide 39).
