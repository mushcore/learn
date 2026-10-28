# COMP 4537 Lecture 4 — "Adv Web Dev Architecture, Lecture 4" (Node.js, modules, examples): slide text, code and figures transcribed from the instructor's deck

Source file: `COMP4537-Lecture4-NodeJS_Modules_Examples` (48 pages; text layer `D:\BCIT\COMP4537\txt\COMP4537-Lecture4-NodeJS_Modules_Examples.txt`, rendered pages `D:\BCIT\COMP4537\png\L4\p001.png` … `p048.png`). Transcribed 2026-10-27.
Instructor: Amir Amintabar, PhD. Slide numbers below are PDF pages (the printed slide number matches the PDF page on every numbered slide; slides 1, 13, 47, 48 carry no visible number).

Summary: the deck opens with a review list and a team "code of conduct" rule, then defines a server (a computer running 24/7 reachable over the internet) with a client / web server / DB server / file server / mail server figure, and lists what a server-side scripting language can do. It introduces Node.js (open-source, cross-platform JavaScript runtime on Chrome V8, runs JS outside the browser) and contrasts how PHP/ASP and Node.js handle a file request. The "restaurant analogy" (one waiter who never waits, one waiter who waits at the kitchen, one waiter per table) maps to single-threaded non-blocking, single-threaded blocking, and multi-threaded servers, followed by the 100-requests/100-threads figure. The practical half covers installation and debugging in Visual Studio Code, then six code examples: Hello World, an area calculation with a breakpoint, a `math.js` module loaded with `require`, a simple `http` server (several versions, including one with `Access-Control-Allow-Origin` and one that loads `myModule.js`), the `url` module parsing a query string and an http server that reads `?name=`, and an `fs` file server returning 404 for missing files. It ends with cPanel Node.js hosting, phpMyAdmin/XAMPP tips, an ES6 arrow-function comparison, and resources.

## Title, outline, review (slides 1–5)
- **Slide 1** (title): "Adv Web Dev Architecture" / "Lecture 4" / "Amir Amintabar, PhD".
- **Slide 2, "Outline"**:
  - Review
  - 1- Server and server scripting
  - 2- Node js
  - 3- JS is asynchronous, single threaded, restaurant analogy
  - 4- Node.js installation
    - Node.js debugging in VSC ( Visual Studio Code)
    - Node.js examples
      - Hello World!
  - 5- Module (put your functions in module, just like including js external files), examples
  - 6- using built in modules, examples
    - http
    - url
    - fs
  - 7- Hosting Node js in shared hosting services, example
  - [note: the deck also has a section "8" (Tips for future, slide 44) that the outline does not list.]
- **Slide 3, "Review"**:
  - Hoisting
  - Functions with no return statement, return undefined !
  - JS is asynchronous, single threaded, non-blocking!
  - Difference between GET and POST
  - In JS a function can return a function
- **Slide 4** (no title): "every team member should have a comprehensive understanding of the entire project, including the work done by their fellow teammates,"
- **Slide 5, "Code of conduct"**: "Every team member should have a comprehensive understanding of the entire project, including the work done by their fellow teammates."

## 1 — Server and server scripting (slides 6–9)
- **Slide 6** (section divider): orange oval "1"; "Server and server scripting".
- **Slide 7, "What is a server?"**:
  - "A server is a computer ( or computers) running 24/7 and accessible via the internet"
  - "When a client such as a browser or mobile app sends a requests via protocol such as http, ftp etc, the server looks for the application responsible to deal with that request, and returns the response using those protocols" (sic, "a requests")
  - "In this course, the request from clint to server are carried using http methods such as GET, POST etc." (sic, "clint")
- **Slide 8, "What is a server?"** (figure):
  [figure: on the left, a blue box "API consumer" with a grey speech bubble "client" pointing at it and an orange speech bubble above it listing "JavaScript / CSS / HTML". A line labelled **"Requests"** runs left → right from "API consumer" to a blue box "Web Server"; a second arrow labelled **"Response"** runs right → left from "Web Server" back to "API consumer". An orange bubble "AJAX" points at the Requests line. A dark-blue bubble on the request/response lines reads "Browser communicates with server via **http** requests/**methods** such as GET, POST, PUT .. methods"; a smaller dark-blue bubble under it reads "Via forms, AJAX calls". On the right, a dashed rounded rectangle (the backend machine) contains: heading "**Web server**" over the "Web Server" box with an orange bubble "Node.js"; heading "**DB server**" over a blue box "DB Server" with an orange bubble "MySQL"; arrow "Web Server" → "DB Server" and arrow "DB Server" → "Web Server"; two pale-blue boxes "file server" and "mail server" beside the DB Server. A grey bubble from "Web Server" reads "understands http requests". A grey bubble from "DB Server" reads "in the same machine with web server (local host) or in a different machine". Along the bottom, an orange double-headed arrow "Front-end" under the client side and a longer orange double-headed arrow "Backend" under the server side.]
- **Slide 9, "What a server side scripting language can do?"**:
  - "It can create a webserver to"
  - "generate dynamic page content"
  - "E.g. opening wordpress.com/index.php at borwser" (sic, "borwser")
    - "sends a request to the server,"
    - "The server looks for an app to run php files"
    - "If the php server is installed it runs that file and returns the result in the form of html"
  - "Server side script can create, open, read, write, delete, and close **files** on the server"
  - "Server side script can collect form data"
  - "Server side script can add, delete, modify data in your **database**"

## 2 — Node.js (slides 10–12)
- **Slide 10** (section divider): orange oval "2"; "In this course, we are going to use" / large "node.js" / "for server side (backend) scripting".
- **Slide 11, "What is Node.js?"**:
  - "Node.js is an open source, free, server environment that uses JavaScript on the server side"
  - "Node.js is an **open-source**, **cross-platform**, back-end JavaScript **runtime environment** that runs on the"
  - "**Chrome V8** engine"
  - "and executes JavaScript code **outside a web browser**"
  - URL (footnote): https://en.wikipedia.org/wiki/Node.js
- **Slide 12, "Why nodeJS?"**:
  - "**Node.js is non blocking!**"
  - "Here is how PHP or ASP handles a file request:"
    1. Sends the task to the computer's file system.
    2. Waits while the file system opens and reads the file.
    3. Returns the content to the client.
    4. Ready to handle the next request.
  - "Here is how Node.js handles a file request:"
    1. Sends the task to the computer's file system.
    2. Ready to handle the next request.
    3. When the file system has opened and read the file, the server returns the content to the client.
  - "Node.js eliminates the waiting, and simply continues with the next request."
  - "Node.js runs single-threaded, non-blocking, asynchronously programming, which is very memory efficient."
  - [note: "single-threaded" describes the JavaScript event loop; Node.js itself (libuv) runs file-system work on a background thread pool, which is why the main thread is free to take the next request.]

## 3 — JS is asynchronous, single threaded, nonblocking: the restaurant analogy (slides 13–23)
- **Slide 13** (section divider): "JS is / asynchronous / single threaded / nonblocking"; orange oval "3".
- **Slide 14**: "The restaurant analogy!"
- **Slide 15, "Example 1"**:
  - "Same waiter can serve multiple tables"
  - [figure: a green rounded rectangle "Kitchen" at top right; below it a grey oval "Waiter" standing next to a blue circle "Table 1"; a yellow circle "Table 2" further right. No arrows. The waiter is at a table, not at the kitchen.]
- **Slide 16, "Example 2"**:
  - "Same waiter can serve multiple tables, but every time waits for the chief to prepare the meal then (and only then) takes another order." (sic, "chief" for chef)
  - [figure: same layout; the grey waiter oval now sits against the "Kitchen" box and reads "Waiter / Waiting for table 1 meal"; "Table 1" (blue) and "Table 2" (yellow) below, unattended. No arrows.]
- **Slide 17, "Example 3"**:
  - "Multiple waiters"
  - "Each dedicated to a single table only!"
  - [figure: grey oval "Waiter 1 / Waiting for table 1 meal" against the "Kitchen" box; a second grey oval "Waiter 2 / Taking order for table 2l" (sic, "2l") sitting on top of the yellow "Table 2"; blue "Table 1" below. No arrows.]
- **Slide 18**:
  - "Example 1: single threaded non-blocking ( asynchronous)"
  - "Example 2: single threaded blocking (synchronous)"
  - "Example 3: multi-threaded"
- **Slide 19**: "JavaScript(nodejs) is / Single threaded / Asynchronous(non blocking) just like the restaurant in Example 1 ( one waiter serves everyone)"
- **Slide 20, "Non-blocking"**:
  - "Same waiter can server multiple tables (don't not get blocked by one table)" (sic, "server", "don't not")
  - [figure: a grey oval labelled in yellow text "Single Thread" (the waiter) above blue "Table 1" and yellow "Table 2"; no kitchen, no arrows.]
  - Caption: "JavaScript(nodejs) is single threaded Asynchronous(non blocking) architecture / Example 1"
- **Slide 21, "Blocking or synchronous (ASP. Net by nature )"**:
  - "Same waiter can server multiple tables, but every time waits for chief to prepare the meal then takes another order." (sic, "server", "chief")
  - [figure: grey oval "Waiter / Waiting for table 1 meal" against the green "Kitchen" box; a green callout pointing at the waiter: "Is not doing anything else but waiting!"; blue "Table 1" and yellow "Table 2" below.]
  - Q: What's the problem here?
  - A: We are not utilizing our resources (the waiter) efficiently
  - [note: "ASP. Net by nature" is the slide's claim; modern ASP.NET supports asynchronous request handling (async/await), though classic request handling ties one thread to each request.]
- **Slide 22, "What if there are multiple requests for synchronous systems?"**:
  - [figure: two pairs side by side. Each pair is a blue rounded box "Request 1" next to a tall yellow bar "Tread 1" (sic, "Tread" for Thread). Both boxes say "Request 1" and both bars say "Tread 1". No arrows.]
- **Slide 23, "Imaging 100 concurrent requests for a synchronous system."** (sic, "Imaging"):
  - "Then the system has to create 100 threads! ( 100 waiters!!)"
  - [figure: a row of blue boxes "Request", "Request", "Request", then two dots "• •" (ellipsis), then a fourth "Request"; directly under each is a yellow box "Tread" (sic). One thread per request.]
  - "Check this good reference: https://youtu.be/6oP-c30s7co?t=6m8s"

## 4 — Installation and example code (slides 24–28)
- **Slide 24** (section divider): "Lets get started with" / large "node.js" / "Installation and Example code"; orange oval "4".
- **Slide 25, "Getting started"**:
  - "Follow the instructions at …"
  - "…**NodeJs-Install-and-Debug.pdf**"
  - "To install nodejs on your machine locally and to use Visual Studio Code to debug" ("install" in blue, "debug" in green)
  - "Using Nodejs you can easily develop a web server at your pc"
  - "Then you send requests from your browser or the html files stored in your machine to the nodejs server you have developed"
- **Slide 26, "Example 1 : Hello world!"**:
  - "Just like any desktop programing language. Here console.log acts like System.out.println() in Java" (sic, "programing")
  - [figure: VS Code window titled "hello.js - intro - Visual Studio Code" with the **Run** menu open (Run circled in red, "Start Debugging" underlined in red). Menu items: "Start Debugging F5", "Run Without Debugging Ctrl+F5", "Stop Debugging Shift+F5" (greyed), "Restart Debugging Ctrl+Shift+F5" (greyed), "Open Configurations", "Add Configuration...", "Step Over F10", "Step Into F11", "Step Out Shift+F11" (last three greyed). A second panel shows the `hello.js` tab with line 1 and the DEBUG CONSOLE tab (circled in red); a red arrow points at the output line "Hello Wold".]
  - Code (`hello.js`):
    ```js
    console.log("Hello Wold");
    ```
  - Debug console output:
    ```text
    C:\Program Files\nodejs\node.exe .\hello.js
    Hello Wold
    ```
  - (sic, "Wold" in both the code and the output.)
- **Slide 27, "You can change the look and feel of your VSC (Visual Studio Code)"**:
  - [figure: VS Code **File** menu open (items: New File Ctrl+N, New Window Ctrl+Shift+N, Open File... Ctrl+O, Open Folder... Ctrl+K Ctrl+O, Open Workspace..., Open Recent >, Add Folder to Workspace..., Save Workspace As..., Save Ctrl+S, Save As... Ctrl+Shift+S, Save All Ctrl+K S, Auto Save, **Preferences >** highlighted, Revert File). The Preferences submenu is open: Settings, Online Services Settings, Extensions, Keyboard Shortcuts, Keymaps, User Snippets, **Color Theme** (circled in blue), File Icon Theme, Turn on Settings Sync.... Editor tabs "test.js" and "hello.js" visible behind.]
  - Path shown: File → Preferences → Color Theme.
- **Slide 28, "Example 2 : area calculation"**:
  - "Just like any desktop programing language. Here console.log acts like System.out.println() in Java"
  - "Note the break point on the line 2" (this bullet is partly hidden behind the screenshot on the rendered page; wording from the text layer)
  - "Bad function identifier/name !Do we really calculate the area of circle like this? Or is it just circumference" (the second sentence is in small type)
  - Side note: "Follow the steps on "…-NodeJs-Install-and-Debug.pdf" to learn how to debug your server side nodejs code in VSC"
  - [figure: VS Code dark theme, tabs "test.js" and "all.html"; a red breakpoint dot in the gutter at line 2. A red hand-drawn arrow runs from `area` in line 6 down to the output "314.0000" in the DEBUG CONSOLE (DEBUG CONSOLE tab circled in red; PROBLEMS badge "3"). A second screenshot shows the Run menu with a pale-blue arrow pointing at "Start Debugging F5" (other items: Start Without Debugging Ctrl+F5, Stop Debugging Shift+F5, Restart Debugging Ctrl+Shift+F5, Open Configurations, Add Configuration...).]
  - Code (`test.js`, breakpoint on line 2):
    ```js
    const PI=3.14
    let r = 10;
    let area = r*PI*PI

    console.log('area:');
    console.log(area);

    ```
  - Debug console output:
    ```text
    C:\Program Files\nodejs\node.exe .\test.js
    area:
    314.0000
    ```
  - [note: the output shown does not match the code. `r*PI*PI` with r = 10 and PI = 3.14 is 98.596, not 314. The area of a circle is PI*r*r = 3.14 × 100 = 314, which is the printed value; Node also prints `314`, not `314.0000`. The slide's own bullet flags the formula as wrong.]

## 5 — Put your functions in Modules (slides 29–31)
- **Slide 29** (section divider): orange oval "5"; "Put your functions in **Modules**".
- **Slide 30, "What is a Module in Node.js?"**:
  - "Consider modules to be the same as JavaScript libraries."
  - "A set of functions you want to include in your application."
- **Slide 31, "Example 3, area calculation, using module"**:
  - "1. Our module math.js is located at modules/math.js"
  - "Notice that we use ./ to locate the folder of our module"
  - "That means that the folder is located in the same folder as the main Node.js file."
  - "2. Notice we don't need to include the .js when we import the module (its optional)" (sic, "its")
  - [figure: two VS Code screenshots. Explorer tree in both: INTRO › modules › math.js; hello.js; test.js; testWithModule.js ("OPEN EDITORS 1 UNSAVED"). Top screenshot: tab `testWithModule.js` (unsaved dot). Red hand-drawn "1" with an arrow pointing at `./` in the require path; red "2" with an arrow pointing at the end of `math` (no `.js`). Bottom screenshot: tab `math.js`, breadcrumb "modules > math.js".]
  - Caller (`testWithModule.js`):
    ```js
    const mo = require('./modules/math');
    console.log(mo.area(2));

    ```
  - Module (`modules/math.js`):
    ```js
    const PI = 3.1416;
    exports.area =
    function (r) {
        return r*PI*2;
    };
    ```
  - No output is shown on this slide.
  - [note: `r*PI*2` is the circumference (2πr), not the area; `mo.area(2)` would print 12.5664. Same "bad name" point as slide 28.]

## 6 — More examples using built-in modules: http (slides 32–36)
- **Slide 32** (section divider): orange oval "6"; "More examples using".
- **Slide 33, "Example 4 : a simple http server"**:
  - "We are using the nodejs build-in module 'http'" (sic, "build-in")
  - "The server receives a request from the client ( the browser)" (the end of this sentence is covered by the callout "2 enter the url")
  - Numbered blue callouts: "1 run the server from Run menu" (on the editor's debug toolbar); "2 enter the url" (pointing at the browser address bar); "3 the breakpoint hits. Press > to continue" (pointing at the highlighted line 6); "4 see the server's response" (under the browser window).
  - [figure: VS Code window "server.js - Ajax-1-node - Visual Stu…", tabs `server.js` and `ajax.html`, breadcrumb "server.js > http.createServer()". Line 6 is highlighted yellow with the paused-breakpoint marker. A red arrow runs from the `console.log` line down to the debug console output. Bottom left, a browser window with address "localhost:8888" (red arrow pointing at it) showing "Hello **World!**".]
  - Code (`server.js`; the right side of lines 5, 9 and 13 is cut off by the edge of the screenshot, and line 8 is covered by callout 3):
    ```js

    const http = require('http');

    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'tex[illegible: cut off at screenshot edge]
      res.end('Hello <b>World!</b>');
    }).listen(8888);
    [illegible: line 8 hidden behind callout]
    console.log('Server is running and listeni[illegible: cut off at screenshot edge]


    /*
    1 replace 'text/html' with just 'text' and[illegible: cut off at screenshot edge]
    ```
  - Debug console output:
    ```text
    C:\Program Files\nodejs\node.exe .\server.js
    Server is running and listening ...
    ```
    (right-aligned source link "server.js:9")
  - Browser output at `localhost:8888`:
    ```text
    Hello World!
    ```
    ("World!" rendered in bold, because the response is HTML.)
- **Slide 34, "Example 4 : a simple http server …"**:
  - Code:
    ```js
    const http = require('http');

    http.createServer(function (req, res) {
      console.log("The server recived a request ");
      res.writeHead(200, { "Content-Type": "text/html", "Access-Control-Allow-Origin": "*" });
      res.end('Hello <b>World!</b>');
    }).listen(8888);
    ```
    (sic, "recived")
  - Bullets (in monospace on the slide):
    - "1 at your local browser type http://localhost:8888/ and observe the result"
    - "2 replace 'text/html' with just 'text' and see what happens"
    - "3 now change this code to return a random number between 0 to 10"
    - "to clinet every time" (sic, "clinet")
    - "4 what does "Access-Control-Allow-Origin" do? do we need it now?"
  - Q: what does "Access-Control-Allow-Origin" do? do we need it now?
  - A: (not on the slide)
  - URL: http://localhost:8888/
- **Slide 35, "Example 4, returning server's current date (put functions in module)"**:
  - [figure: the main file in a white box; a grey box tabbed "myModule.js" at top right; a blue arrow from `'./myModule'` up to the myModule.js box; a vertical double-headed arrow labelled "compare" between `require('http')` and `require('./myModule')`; dashed circles around `dt` in `let dt` and in `dt.myDateTime()`.]
  - Main file:
    ```js
    let http = require('http’);


    let dt = require('./myModule');

    http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("Now: " + dt.myDateTime());
      res.end();
    }).listen(8888);
    ```
    (The opening quote before `http` is hidden by the "compare" arrow; the closing quote is a typographic `’`, as printed.)
  - `myModule.js`:
    ```js
    exports.area =
    function () {
        return Date();
    };
    ```
  - No output is shown on this slide.
  - [note: the two files do not match. The module exports `area`, but the caller calls `dt.myDateTime()`, which would throw "TypeError: dt.myDateTime is not a function". The module should read `exports.myDateTime = function () { return Date(); };`. Also the typographic `’` in `require('http’)` is a syntax error if typed as shown.]
- **Slide 36, "In-class activity"**:
  - In-class activity: "Replace the 'text/ html' with just 'text' and observe the response that the client receives"
  - [figure: VS Code, tabs `server.js` and `ajax.html`; `'text/html'` on line 6 underlined in red.]
  - Code (`server.js`):
    ```js

    const http = require('http');

    http.createServer(function (req, res) {
      console.log("Hi");
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('Hello <b>World!</b>');
    }).listen(8888);

    console.log('Server is running and listening ...');

    ```
  - No output is shown.
  - [note: `text` alone is not a valid MIME type (a type needs `type/subtype`). Browsers typically treat the response as unknown and either show the raw text `Hello <b>World!</b>` with the tags visible or offer it as a download, instead of rendering bold "World!".]

## 6 (cont.) — the url module (slides 37–39)
- **Slide 37** (section divider): "Example 5, using 'url' built-in module to extract the query strings in the url"
- **Slide 38, "Using url built-in module to pars parameters in a string"** (sic, "pars"):
  ```js
  let url = require('url');
  let adr = 'http://localhost:8888/default.htm?name=John&age=23';
  let q = url.parse(adr, true);

  console.log(q.host); //returns 'localhost:8888'
  console.log(q.pathname); //returns '/default.htm'
  console.log(q.search); //returns '?name=John&age=23'

  let qdata = q.query; //returns an object: { name: John, age: 23 }
  console.log(qdata.name); //returns 'John'
  ```
  (On the slide the `adr` string and the `qdata` comment wrap onto a second line; they are one line each.)
  - [note: `url.parse()` is a legacy API in current Node.js; the WHATWG `new URL(adr)` with `searchParams.get('name')` is the recommended form. Query values are strings, so `q.query` is `{ name: 'John', age: '23' }`, not the number 23.]
  - URL in code: http://localhost:8888/default.htm?name=John&age=23
- **Slide 39, "Example 5: http server with parameters"**:
  - [figure: VS Code, tab `server.js` (unsaved dot), breadcrumb "server.js > http.createServer() callback"; line 8 highlighted yellow with the paused-breakpoint marker.]
  - Code (`server.js`; line 1 is blank):
    ```js

    let http = require('http');
    let url = require('url');
    http.createServer(function (req, res) {
      let q = url.parse(req.url, true);
      console.log(q.query); //returns the object form of '?name=John'
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end('Hello '+q.query["name"]);
    }).listen(8888);

    // at your browser address bar, try
    //http://localhost:8888/?name=John

    ```
  - Debug console output:
    ```text
    C:\Program Files\nodejs\node.exe .\server.js
    > {name: 'John'}
    ```
  - "Note! I did not need "Access-Control-Allow-Origin": "*"" (the header text is in orange monospace)
  - Q: Why?
  - A: (not on the slide)
  - [note: the request here is made by typing the URL in the browser's address bar, a top-level navigation, not a cross-origin AJAX/fetch call from a page on another origin, so CORS does not apply and the header is not needed.]
  - URL in code: http://localhost:8888/?name=John

## 6 (cont.) — the fs module and a file server (slides 40–42)
- **Slide 40, "'fs', the file system built-in module"**:
  - "We are going to be using another built-in module, 'fs', file system"
  - "allows us to work with the file system on our computer or the server."
  - (a third, empty bullet)
- **Slide 41, "Example 6: Creating a file server in node js"**:
  - "Create a Node.js file that opens the requested file and returns the content of the file to the client. If the file does not exists, throw a 404 error!" (sic, "does not exists")
- **Slide 42, "Example 6: Creating a file server in node js"**:
  ```js
  const http = require('http');
  const url = require('url');
  const fs = require('fs');
  http.createServer(function (req, res) {
      const q = url.parse(req.url, true);
      const filename = "." + q.pathname;
      fs.readFile(filename, function (err, data) {
          if (err) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              return res.end(q.pathname + " 404 Not Found!");
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
      });
  }).listen(8888);
  // at your browser address bar, try
  //http://localhost:8888/file.txt
  ```
  - Side note: "**4xx** are status message codes meaning client error. That means client request was not valid, either due to authentication or the client asked for a file which did not exist" / "**404**: not found" ("4xx" and "404" in red)
  - "HTTP Status Messages: https://www.w3schools.com/tags/ref_httpmessages.asp"
  - No output is shown.
  - URL in code: http://localhost:8888/file.txt
  - [note: the 404 body for a request to `/nofile.txt` would be `/nofile.txt 404 Not Found!`. Building the path as `"." + q.pathname` lets a request such as `/../secret` read files outside the folder (path traversal); real servers normalise and restrict the path.]

## 7 — Hosting on shared hosting with cPanel (slide 43)
- **Slide 43, "Setting up node js app on shared hosting with cPanel"**:
  - "Refer to the lecture videos"
  - Orange oval "7".
  - [figure: cPanel home screen. Top bar: home icon, "Addon Domains", "File Manager", "Email", "Submit a Ticket". Search box "Find functions quickly by typing here.". **SOFTWARE** section: "WordPress Manager by Softaculous Apps Installer", "PHP PEAR Packages", "Perl Modules", "Optimize We[bsite]" (cut off), **"Setup Node.js App"** (circled in red), "Select PHP Version", "Setup Python App", "Setup Ruby A[pp]" (cut off). **DATABASES** section: "phpMyAdmin", "MySQL® Databases", "MySQL® Database Wizard", "Remote MyS[QL]" (cut off). **ADVANCED** section: "Terminal", "Cron Jobs", "Track DNS", "Indexes".]

## 8 — Tips for future: database server, XAMPP, arrow functions (slides 44–47)
- **Slide 44** (section divider): orange oval "8"; "Tips for future".
- **Slide 45, "Database server we use in this course"**:
  - "We will use the free and open source relational DB administration tool"
  - "Called phpMyAdmin which is browser based ( thus working on all operating systems)"
  - [figure: browser tab "localhost / 127.0.0.1 / d…", address "localhost/phpmyadmin/db_designer.php?db=d100". phpMyAdmin with header "Server: 127.0.0.1 » Database: d100" and tabs Structure, SQL, Search, Query, Export, Import, Ope[rations]. The left tree is blurred except database "d…" with children "New", "patient", "visit". Designer side menu: Show/Hide tables list, View in fullscreen, Add tables from other databases (highlighted, tooltip "Add tables from other databases"), Open page, Save page, Save page as, Delete pages, Create table, Create relationship, Choose column to display, Reload. Two table cards: "d100 patient" with `patientid : int(11)` (key icon) and `name : varchar(100)`; "d100 visit" with `visitid : int(11)` (key icon), `patientid : int(11)` (`#` icon), `visitDate : date`. A green line connects `patient.patientid` → `visit.patientid` (foreign-key relationship).]
  - URL: localhost/phpmyadmin/db_designer.php?db=d100
- **Slide 46** (no title):
  - "You will learn how to use XAMPP to install phpMyAdmin on your machine"
  - "( in two weeks)"
  - [figure: "XAMPP Control Panel v3.2.4 [ Compiled: Jun 5th 2019 ]". Table columns: Service, Module, PID(s), Port(s), Actions. Rows: **Apache** (green) PID(s) 3212, 5092, Port(s) 80, 443, buttons Stop / Admin / Config / Logs; **MySQL** (green) PID 25796, Port 3306, Stop / Admin / Config / Logs; FileZilla, Mercury (Start/Admin/Config/Logs greyed); Tomcat (Start / Admin greyed / Config / Logs). Right-side buttons: Config, Netstat, Shell, Explorer, Services, Help, Quit.]
  - Control-panel log:
    ```text
    11:28:51 AM  [Tomcat]  Checking for required tools...
    11:28:51 AM  [Tomcat]  Checking for service (name="Tomcat7"): Service not installed
    11:28:51 AM  [Tomcat]  Service Path: Service Not Installed
    11:28:51 AM  [Tomcat]  Checking default ports...
    11:28:51 AM  [main]    Enabling autostart for module "Apache"
    11:28:51 AM  [main]    Enabling autostart for module "MySQL"
    11:28:51 AM  [main]    Starting Check-Timer
    11:28:51 AM  [main]    Control Panel Ready
    11:28:51 AM  [Apache]  Autostart active: starting...
    ```
- **Slide 47, "ESC6 tips of the week/ Arrow functions to replace old ones"** (sic, "ESC6" for ES6):
  - Two column headings: "regular functions" (left) and "arrow functions" (right); blue arrows → from each left snippet to its right counterpart.

  | regular functions | arrow functions |
  |---|---|
  | `setTimeout(function() {` ⏎ ⏎ `}, timeout);` | `setTimeout(() => {` ⏎ ⏎ `}, timeout);` |
  | `date = function() {` ⏎ `  return new Date();` ⏎ `}` | `date = () => {` ⏎ `  return new Date();` ⏎ `}` |

  - Regular, row 1:
    ```js
    setTimeout(function() {

    }, timeout);
    ```
  - Arrow, row 1:
    ```js
    setTimeout(() => {

    }, timeout);
    ```
  - Regular, row 2:
    ```js
    date = function() {
      return new Date();
    }
    ```
  - Arrow, row 2:
    ```js
    date = () => {
      return new Date();
    }
    ```
  - Third panel (under the arrow column):
    ```js
    // one parameter
    hello = (val) => "Hello " + val;

    hello = val => "Hello " + val;

    // two or more parameters
    sum = (a,b) => a+b;
    ```
  - [note: arrow functions are not a drop-in replacement in every case: they have no own `this`, `arguments` or `prototype` and cannot be used with `new`. The snippets also assign to undeclared names (`date`, `hello`, `sum`), which creates globals in sloppy mode and throws a ReferenceError in strict mode/ES modules.]

## Resources (slide 48)
- **Slide 48, "Resources"**:
  - https://www.w3schools.com/nodejs/nodejs_intro.asp
  - https://en.wikipedia.org/wiki/Node.js
  - "On JS being asynchronous: https://youtu.be/6oP-c30s7co?t=6m8s"

## Facts and numbers index
- Server = "a computer ( or computers) running 24/7 and accessible via the internet" (slide 7).
- Protocols named for client requests: http, ftp (slide 7); in this course requests use http methods "such as GET, POST etc." (slide 7); figure adds PUT (slide 8).
- Figure components: API consumer (client; JavaScript/CSS/HTML), Web Server (Node.js; "understands http requests"), DB Server (MySQL; same machine "(local host) or in a different machine"), file server, mail server; Front-end vs Backend (slide 8). Requests sent "Via forms, AJAX calls" (slide 8).
- Server-side script can: create a webserver, generate dynamic page content, create/open/read/write/delete/close files, collect form data, add/delete/modify database data (slide 9).
- Node.js definition: open source, free, server environment using JavaScript on the server side; open-source, cross-platform, back-end JavaScript runtime environment; runs on Chrome V8 engine; executes JS outside a web browser (slide 11).
- PHP/ASP file request: 4 steps (send task → wait while file opened/read → return content → ready for next) (slide 12).
- Node.js file request: 3 steps (send task → ready for next → return content when file read) (slide 12).
- Node.js: "single-threaded, non-blocking, asynchronously programming, which is very memory efficient" (slide 12).
- Restaurant mapping: Example 1 = single threaded non-blocking (asynchronous); Example 2 = single threaded blocking (synchronous); Example 3 = multi-threaded (slide 18).
- JavaScript (nodejs) = single threaded, asynchronous (non blocking), like Example 1, "one waiter serves everyone" (slides 19, 20).
- Blocking/synchronous = "ASP. Net by nature" (slide 21); problem: "We are not utilizing our resources (the waiter) efficiently" (slide 21).
- 100 concurrent requests in a synchronous system → 100 threads ("100 waiters!!") (slide 23).
- Install/debug guide: "NodeJs-Install-and-Debug.pdf" (slides 25, 28).
- console.log acts like System.out.println() in Java (slides 26, 28).
- VS Code shortcuts: Start Debugging F5; Run Without Debugging Ctrl+F5; Stop Debugging Shift+F5; Restart Debugging Ctrl+Shift+F5; Step Over F10; Step Into F11; Step Out Shift+F11 (slide 26).
- Color theme: File → Preferences → Color Theme (slide 27).
- Example 2: PI = 3.14, r = 10, breakpoint on line 2, printed output 314.0000 (slide 28).
- Module = "the same as JavaScript libraries"; "A set of functions you want to include in your application" (slide 30).
- `./` = module folder is in the same folder as the main Node.js file; `.js` extension optional in `require` (slide 31).
- math.js: PI = 3.1416, `exports.area = function (r) { return r*PI*2; }`, called as `mo.area(2)` (slide 31).
- http server: built-in module 'http'; `http.createServer(...)`; `res.writeHead(200, {...})`; `.listen(8888)`; URL http://localhost:8888/ (slides 33–36).
- Status 200 used for success responses (slides 33–36, 39, 42).
- Header `"Access-Control-Allow-Origin": "*"` appears in slide 34; slide 39 says it was not needed.
- In-class/exercise tasks: replace 'text/html' with 'text'; return a random number between 0 to 10; explain Access-Control-Allow-Origin (slides 34, 36).
- `url.parse(adr, true)`: q.host → 'localhost:8888'; q.pathname → '/default.htm'; q.search → '?name=John&age=23'; q.query → object { name: John, age: 23 }; qdata.name → 'John' (slide 38).
- Example 5 server reads `q.query["name"]`; test URL http://localhost:8888/?name=John; console shows {name: 'John'} (slide 39).
- 'fs' = file system built-in module; works with the file system on our computer or the server (slide 40).
- File server: filename = "." + q.pathname; `fs.readFile`; on error `res.writeHead(404, ...)` and body `q.pathname + " 404 Not Found!"`; test URL http://localhost:8888/file.txt (slide 42).
- 4xx = client error ("either due to authentication or the client asked for a file which did not exist"); 404 = not found (slide 42).
- cPanel: "Setup Node.js App" under SOFTWARE; phpMyAdmin under DATABASES (slide 43).
- phpMyAdmin: free, open source, relational DB administration tool, browser based, works on all operating systems (slide 45).
- XAMPP installs phpMyAdmin; covered "in two weeks" (slide 46). XAMPP Control Panel v3.2.4; Apache ports 80, 443; MySQL port 3306 (slide 46).
- Arrow functions: one parameter may drop the parentheses (`val => ...`); two or more need them (`(a,b) => a+b`) (slide 47).

## Likely quiz traps
- Node.js handles a file request in 3 steps and is "Ready to handle the next request" at step 2, before the file is read; PHP/ASP is ready only at step 4 (slide 12).
- Example 2 of the restaurant (waiter waits at the kitchen) is single threaded **blocking**, not multi-threaded; multi-threaded is Example 3 (slide 18).
- JavaScript/Node.js matches restaurant Example 1, not Example 3: one waiter serves everyone (slides 19, 20).
- The problem with the blocking waiter is resource utilisation ("not utilizing our resources (the waiter) efficiently"), not that orders get lost (slide 21).
- A synchronous system with 100 concurrent requests needs 100 threads (slide 23).
- Node.js runs on Chrome V8 and executes JavaScript **outside** a web browser (slide 11).
- In `require('./modules/math')` the `.js` extension is optional, and `./` means "same folder as the main Node.js file" (slide 31).
- The slide's "area" functions are wrong: `r*PI*PI` (slide 28) and `r*PI*2` (circumference, slide 31); the slide itself asks "Or is it just circumference" (slide 28).
- Slide 35's module exports `area` but the server calls `dt.myDateTime()`; a "spot the bug" item (slide 35).
- `url.parse(adr, true)`: `q.search` includes the `?` ('?name=John&age=23'); `q.pathname` is '/default.htm'; `q.host` includes the port ('localhost:8888') (slide 38).
- "Access-Control-Allow-Origin" was not needed in Example 5 (slide 39) though it was in the Example 4 code (slide 34).
- 4xx codes mean **client** error; 404 = not found (slide 42).
- The file server builds the path with `"." + q.pathname`, so `/file.txt` maps to `./file.txt` (slide 42).
- phpMyAdmin works on all operating systems because it is browser based (slide 45).
- An arrow function with exactly one parameter may omit the parentheses; with two or more it may not (slide 47).
