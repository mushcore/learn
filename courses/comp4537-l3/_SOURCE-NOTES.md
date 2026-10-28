# COMP 4537 Lecture 3: "Adv Web Dev Arch - Lecture 3" (Anatomy of Web API, RESTful, GET/POST, Postman), transcribed from the instructor's deck

Source file: `D:\BCIT\COMP4537\txt\COMP4537-Lecture3-AnatomyOf_WebAPI-RESTful-GET-POST-PostMan 2026.txt` (text layer); rendered pages `D:\BCIT\COMP4537\png\L3\p001.png` … `p054.png`. **54 pages.** Instructor: Amir Amintabar, PhD. Transcribed 2026-10-27.
Slide numbers are PDF pages (they match the printed slide numbers where those appear).

**Summary.** The deck opens with a review of the first two weeks: JSON (`JSON.stringify` / `JSON.parse`), web storage (localStorage vs sessionStorage, strings only), `var` / `let` / `const` scope (a three-column figure), the A/B/C hoisting quiz, variable hoisting, `===` vs `==`, and the event-queue order of a `setTimeout` script. Part 2 asks why API servers are needed: a monolithic small web app returns rendered HTML pages, and the "online Movie store" story shows the two challenges of scraping IMDb's HTML (screen scraping; the page UI changing) and the solution, a separate API server (OMDb) that returns JSON. It then defines API, shows partner APIs (Canada Post, Facebook) as microservices. Part 3 is the anatomy of web APIs (headers, data, endpoint, HTTP methods), GET vs POST in detail with two in-class activities and the w3schools comparison table. Part 4 is Postman (httpbin.org/get, currentsapi). Part 5 introduces REST: RESTful architecture, microservices, a microservice architecture diagram with five remarks, "RESTful is not an architectural pattern", the five RESTful constraints with principles, benefits and examples, and a benefits summary that adds Code-on-Demand.

Hidden answers: slides 7, 8 and 14 print their answers in very faint (near-white) text, revealed in class; they are transcribed below as the slide's answers and marked "(faint text)".

## Title and outline (slides 1-2)
- **Slide 1** (title slide): "**Adv Web Dev Arch - Lecture 3**" / "Amir Amintabar, PhD".
- **Slide 2, "Outline"**:
  - 1- Review
  - 2-Why we need Web APIs
    - Example:
    - Challenges of launching an online movie store
  - 3- Anatomy of Web APIs
  - 4- Postman
  - 5- Intro to RESTful **architecture** style
    - The five key principles of RESTful service-enabled applications
    - Microservices
    - Example of an educational application with Microservice Architecture
  - [figure: a blue oval labelled "Part 1" at the right]

## Review: labs and prior courses (slides 3-5)
- **Slide 3, "Review: Labs"**:
  - "Lab0: The four review quizzes were based on week1 content: COMP4537-1- review HTML CSS JS Hosting.pptx"
  - "Lab1: Were based on the week 2 of lecture material: COMP4537-2 Architecture  JSON LocalStorage.pptx"
  - (The .pptx names are blue link text.)
- **Slide 4, "Review: Labs"**:
  - "You should have a basic understanding of SQL-based database, JavaScript, HTML and CSS *based on your prior coursework*:"
  - [figure: three cropped screenshots of BCIT course-outline learning outcomes, with red hand-drawn underlines]
    - Caption "Web Development 1 / COMP1537:  https://www.bcit.ca/outlines/20211087560/". Outcomes (right edge cropped):
      - "Create JavaScript classes and objects." (underlined "JavaScript classes and objects")
      - "Create JavaScript code that handles various types of events on th[cropped]"
      - "Apply the standard three-tiered web architecture (data, applicati[cropped] app with that architecture."
      - "Utilize various storage mechanisms on both the client-side and se[cropped] requirements."
      - "Design and implement a Progressive Web Application (PWA)."
      - "Apply core JavaScript concepts such as functions as objects, vari[cropped] control constructs, and how JSON is utilized." (underlined "as functions as objects" and "how JSON is utilized")
    - Caption "Web Development 2 / COMP2537: https://www.bcit.ca/outlines/20211087580/". Outcomes:
      - "Utilize techniques to dynamically serve web content such as image[cropped]" (underlined "serve web content")
      - "Perform DOM manipulation via jQuery on the server-side."
      - "Utilize a routing framework on the server-side." (underlined "routing framework")
      - "Use asynchronous programming on the client and server" (underlined "asynchronous programming")
    - Caption "Relational Database Design and SQL / COMP1630: https://www.bcit.ca/outlines/20211086178/". Outcomes:
      - "Use SQL - DDL to implement a relational database." (underlined "implement a")
      - "Use SQL for data manipulation such as the basic Select statement." (underlined "basic Select statement.")
      - "Use SQL for advanced manipulation such as Group BY, Having, Correlated subqueries." (underlined "Group BY, Having, Correlated subqueries.")
      - "Create stored procedures and triggers."
      - "Discuss techniques for transaction management and concurrency control."
      - (heading below, cropped) "[L]earning Resources"
  - URLs: https://www.bcit.ca/outlines/20211087560/ , https://www.bcit.ca/outlines/20211087580/ , https://www.bcit.ca/outlines/20211086178/
- **Slide 5, "Review:"**:
  - "We face a choice: do we pause and potentially bore those who are already familiar with the content from previous courses, or do we move forward and assume that students without the background will catch up? How can we find a compromise here?"
  - Q: "How can we find a compromise here?" A: (not on the slide)
  - Footer: "2021 COMP1537, https://www.bcit.ca/outlines/20211087560/"

## Review: JSON and web storage (slides 6-8)
- **Slide 6, "Review: JSON"**:
  - "Last we learned JSON is a way of **converting an object into a string**, so that we can serially store it or send it to other machines on the net. Then to pars it back to the same object" (sic, "pars")
  - Code (two bullets, comments in green):
    ```js
    // Object to String
    let myJSON = JSON.stringify(myObj);

    // String to Object
    let myObj = JSON.parse(myJSON);
    ```
  - Q1: "what are the JavaScript data types?" A: (not on the slide)
  - Q2: "what would be the result of typeof (null) ?" A: (not on the slide)
    - [note: `typeof null` returns `"object"` (a long-standing JavaScript quirk). JavaScript's types are the seven primitives string, number, bigint, boolean, undefined, symbol, null, plus object.]
- **Slide 7, "Review: Web Storage"**:
  - "We also learned about web storages"
  - "LocalStorage and sessionStorage"
  - "They are more **secure** compared* to cookies" (underlined "secure compared* to")
  - "local storage is **permanent**, but session storage **expires**"
  - "All pages, from same origin, can store and access the same data **within same browser** on your computer of course"
  - "Web storage only handles string key/value pairs."
  - "**Q:** what could be the variable value in the code snippet below?"
    ```js
    let value = sessionStorage.getItem("key");
    ```
  - A (faint text): "it returns string…. or null"
  - "* secure compared to cookie, not fully secure."
  - [note: "more secure than cookies" is contested: any script on the page (including injected XSS code) can read web storage, whereas a cookie can be marked HttpOnly so scripts cannot read it. Web storage's advantages are that it is not sent with every request and holds more data. "Permanent" means localStorage persists until cleared by script or user; sessionStorage is cleared when the tab/window session ends.]
- **Slide 8** (no title):
  - "**Q:** Now that we can only store strings in localStorage, is there a way to store an object in localStorage?"
  - A (faint text): "yes, via JSON"

## Review: JavaScript var/let/const, hoisting, ===, event queue (slides 9-16)
- **Slide 9, "Review: JavaScript (from COMP4537-1- review HTML CSS JS Hosting.pptx)"**:
  - Let
  - const
  - var
  - Hoisting
  - Set time out
- **Slide 10, "Review: JavaScript (from COMP4537-1- review HTML CSS JS Hosting.pptx)"**:
  - "Q: what does `typeof []` return?" (the slide sets it on three lines: "Q: what does" / "typeof []" / "return?") A: (not on the slide)
    - [note: `typeof []` returns `"object"`; use `Array.isArray([])` to test for an array.]
  - "**var**: Declares a **function-scoped** variable."
  - "**let**: Declares a **block-scoped**, variable."
  - "**const**: Declares a **block-scoped** const. const variables cannot be *re-assigned* after assigned once."
- **Slide 11, "Scope of Declarations by var, let, const:"** (the three-column scope figure):
  - [figure: three dark-theme code screenshots side by side, each with a two-row answer table underneath; the question "What does console.log(a) print on console ?" sits between the code and the tables]
  - Column 1 code:
    ```js
    {
     var a = 10;
    }
    console.log(a);
    ```
  - Column 2 code:
    ```js
    {
     let a = 10;
    }
    console.log(a);
    ```
  - Column 3 code:
    ```js
    {
     const a = 10;
    }
    console.log(a);
    ```
  - "**What does console.log(a) print on console ?**"
  - Answer table (on the slide):

| | `var` column | `let` column | `const` column |
|---|---|---|---|
| Prints | **10** | **Uncaught ReferenceError: a is not defined** ("is not defined" in red) | **Uncaught ReferenceError: a is not defined** ("is not defined" in red) |
| Scope | Function scoped | Block Scoped | Block Scoped |

  - Console output as on the slide:
    ```text
    10
    ```
    ```text
    Uncaught ReferenceError: a is not defined
    ```
    ```text
    Uncaught ReferenceError: a is not defined
    ```
- **Slide 12** (the A/B/C figure; no title):
  - "Q: What will console print in each of these scenarios ?"
  - [figure: three dark-theme code screenshots labelled A, B, C, stacked vertically]
  - A:
    ```js
    console.log (n)
    var n = 150
    ```
  - B:
    ```js
    var n = 150
    console.log (n)
    ```
  - C:
    ```js
    console.log (n)
    let n = 150
    ```
  - A: (not on the slide)
  - [note: the next slide (13) gives the rule. A prints `undefined` (var hoisted), B prints `150`, C throws `Uncaught ReferenceError: Cannot access 'n' before initialization` (let in its temporal dead zone).]
- **Slide 13, "variable hoisting ( only for variables declared by "var")"**:
  - "The JavaScript engine treats all variable declarations using "var" as if they are declared at the top of a functional scope (if declared inside a function, if not as if they are declared at top of the script)"
  - Code screenshot 1:
    ```html
    <script>

        console.log(myVar);// will not issue error
        var myVar;
        myVar = 140;
    </script>
    ```
  - [figure: `var myVar;` is circled in red, with a thin red arrow curving from it up to the empty line just under `<script>`; an orange callout points to that spot: "JS engine moves declarations using **var** to top". A blue callout points to `myVar` in `console.log(myVar)`: "Will not issue error, even though myVar was declared next line / It will simply print undefined"]
  - Code screenshot 2:
    ```html
    <script>

        console.log(myLet);// will issue error
        let myLet;
        myLet = 140;
    </script>
    ```
    (The comment "// will issue error" is partly covered by the callout's pointer; the text layer and the visible fragments read "will issue error".)
  - [figure: a salmon callout points to `console.log(myLet)`: "Will issue error and terminate execution. / JS engine will NOT hoist variables declared by "let""]
  - [note: strictly, `let` and `const` declarations are hoisted too, but they stay uninitialised in the "temporal dead zone" until their line runs, so reading them first throws `ReferenceError: Cannot access 'myLet' before initialization`. The slide's practical point (var reads as undefined, let throws) is correct.]
- **Slide 14** (no title):
  - "Q: When declaring a variable which one you should choose first? const, let or var?"
    - A (faint text): "first const, then let and never var."
  - "Q: What if you use a variable without declaring it in JavaScript? (btw worst practice)"
    - A (faint text): "becomes global scope"
    - [note: this is true only in sloppy (non-strict) mode; in strict mode (`"use strict"`, ES modules, classes) assigning to an undeclared variable throws a ReferenceError.]
- **Slide 15, "=== vs =="**:
  - "Q1: Whats the diff between the two?"
  - "The == (or !=) operator performs an automatic type conversion if needed."
  - "The === (or !==) operator will not perform any type conversion. It first compares if both sides have the same type, then compares the values"
  - "Q2: Can a function return another function in js?" A: (not on the slide)
  - "Q3: Can a function accept another function as arguments in js?" A: (not on the slide)
  - [note: Q1 is answered by the two bullets. Q2 and Q3: yes to both; functions are first-class values in JavaScript (higher-order functions, callbacks).]
- **Slide 16, "Order of execution … Event Queue"**:
  - "What would be the output of this script?"
  - Code (dark-theme screenshot):
    ```html
    <script>
        console.log(1);
        setTimeout(function () {
            console.log(2);
        }, 1000);
        console.log(3);
    </script>
    ```
  - A (blue box at left):
    ```text
    1
    3
    2
    ```
  - "What if we replace 1000 with 0 ?" (in a blue box)
  - A (blue box at bottom right):
    ```text
    1
    3
    2
    ```
  - "Study: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop"

## Code of conduct reminder (slide 17)
- **Slide 17, "Code of conduct reminder"**:
  - "Students' work will not be checked before assignment submission if the request is very general."
  - "Statements such as "I did not read the lecture notes or lab description etc." are not accepted as valid excuses for exemption from meeting lab requirements"
  - [third bullet: a course-policy statement with the link https://www.bcit.ca/outlines/20233046882/ ; not transcribed, per the brief's rule]

## Part 2: Why do we need API servers? (slides 18-29)
- **Slide 18**: [blue oval "Part 2"] "Why do we need API servers?"
- **Slide 19** (no title):
  - "Let's start by asking a question: Q: What does a web server return when browsers send a request like these?"
  - "Examples:"
  - "www.who.int/index.**html**" (link)
  - "https://wordpress.com/index.**php**" (link)
  - A: "they return **HTML pages** and their JavaScript and CSS" ("HTML pages" large and red; "and their JavaScript and CSS" small)
  - "Press ctrl+u to see it for yourself"
- **Slide 20, "The architecture of small web applications (monolithic )"** (the monolithic small-web-app figure):
  - [figure: a blue box "browser" on the left. A yellow box with a blue border, labelled above "Web server", containing "Node js files / HTML pages / etc". Arrow browser → Web server labelled "Browser sends request to server". Arrow Web server → browser labelled "Server returns results back as rendered **HTML pages**" ("HTML pages" in red). Below the web server, a double-headed vertical arrow to a box "File server". A bent double-headed arrow from the web server's right side down to a box "DB server". A blue callout pointing at the web server: "runs server side (Node/PHP/Python/ASP) script to access data/files etc". An orange callout pointing at "rendered HTML pages": "..and that is exactly the problem. They returned result in HTML pages. … I will tell you why…"]
- **Slide 21** (centered): "Imagine" / "You want to launch an online Movie store"
- **Slide 22, "What are the main challenges?"**:
  - "You need a database of all existing movies."
  - "You have two choices:"
  - "1- Create your own database which takes years!"
  - "2- or getting from websites like IMDB.com which already contain what you need."
  - "… 100,000 move titles" (sic, "move")
  - [figure: a grey rounded box "Online movie store" with a stack-of-database-cylinders icon below it]
- **Slide 23, "challenge 1, HTML scraping"**:
  - "… so you chose using IMDb's data."
  - "however"
  - "IMDB does not offer you any data format other than HTML which contains CSS, Tags etc."
  - "But"
  - "you don't need all of that.. So you need to extract what you need (**Screen Scraping**!!!) you need to search for the Actor names, Date was published etc inside the HTML!..."
  - [figure: a screenshot of IMDb page source on the right; the `content="Star Wars: The Force Awakens (2015)"` value of the `og:title` meta tag is boxed in red; a blue callout points to it: "Imagine that you need to extract movie titles by HTML scaping of IMDB web pages!" (sic, "scaping")]
  - Screenshot code (right edge cropped; parts covered by the callout pointer):
    ```html
    <script>
        if (typeof uex == 'function') {
          uex("ld", "LoadIcons", {wb: 1});
        }
    </script>

            <meta property="pageId" content="tt2488496" />
            <meta property="pageType" content="title" />
            <meta property="subpageType" content="main" />


            <link rel='image_src' href="https://images-na.ssl-images-amazon.com/images/[cropped]
            <meta property='og:image' content="https://images-na.ssl-images-amazon.com/[cropped]

            <meta property='og:type' content="video.movie" />
        <meta property='fb:app_id' content='115109575169727' />

        <meta property='og:title' content="Star Wars: The Force Awakens (2015)" />
        <meta property='og:site_name' content='IMDb' />
        <meta name="title" content="Star Wars: The Force Awakens (2015) - IMDb" />
            <meta name="description" content="Directed by J.J. Abrams.  With Daisy Ridl[cropped]
    threat arises in the militant First Order. Stormtrooper defector Finn and spare par[cropped]
            <meta property="og:description" content="Directed by J.J. Abrams.  With Dai[cropped]
    new threat arises in the militant First Order. Stormtrooper defector Finn and spare[cropped]
            <meta name="keywords" content="Reviews, Showtimes, DVDs, Photos, Message Bo[cropped]
            <meta name="request_id" content="1WZ0HAN3CMHMGBP4DX2C" />

    <script>
        if (typeof uet == 'function') {
          uet("bb", "LoadCSS", {wb: 1});
        }
    </script>
      <script>(function(t){ (t.events = t.events || {})["csm_head_pre_css"] = new Date([cropped]
    <!-- h=ics-1a-c4-2xl-af24f25e.us-east-1 -->

            <link rel="stylesheet" type="text/css" href="http://ia.media-imdb.com/[cropped]
            <noscript>
                <link rel="stylesheet" type="text/css" href="http://ia.media-imdb.com/i[cropped]
            </noscript>
    ```
    (On this slide several lines in the middle are partly covered by the callout pointer; the text is completed from the same screenshot on slide 26.)
- **Slide 24, "challenge 2, what if UI of IMDB pages change?!"**:
  - "IMDb **decided to change** the look of their pages! Thus the HTML pages change."
  - "As a result your code which was written for that particular HTML will no longer work!"
  - [figure: a light-blue rounded box "Online movie streaming store" on the left and the IMDb logo on the right. Arrow store → IMDb labelled "URL of that page". Return arrow IMDb → store crossed out with a large X, labelled "HTML of that page: <Tags>, CSS, <Script>,<Meta> ….". A blue callout pointing at the crossed-out arrow: "What if they change the design of their pages and your HTML scraper can no longer find movie title in same location at the HTML file!"]
- **Slide 25, "Solution"**:
  - "IMDb provides two services ( two URLs)"
  - "1- For **browsers and users**."
    - "**Returns HTML pages**"
    - "Returning result can change any time IMDb developer update the website"
  - "2- For **data concumer applications** (e.g. by omdbApi.com)" (sic, "concumer")
    - "**Returns Json/XML**"
    - "The rule of thumb is OMDb does not change what this url return"
  - [figure: a blue callout "Web server" pointing at item 1; an orange callout "API server" pointing at item 2]
  - [note: OMDb (omdbapi.com) is in fact an independent third-party service, not run by IMDb; the slide presents it as IMDb's API-side service.]
- **Slide 26** (side-by-side comparison, no title):
  - Left, green label "Calling API", then the URL (wrapped in its box):
    - `http://www.omdbapi.com/?t=star+wars&y=2015&apikey=1668f32d`
  - JSON returned (right edge cropped; a collapse icon "⊟" follows the opening brace):
    ```text
    {
      "Title":"Star Wars: The Force Awakens",
      "Year":"2015",
      "Rated":"PG-13",
      "Released":"18 Dec 2015",
      "Runtime":"136 min",
      "Genre":"Action, Adventure, Fantasy",
      "Director":"J.J. Abrams",
      "Writer":"Lawrence Kasdan, J.J. Abrams, Michael Arndt, C[cropped]
      "Actors":"Harrison Ford, Mark Hamill, Carrie Fisher, Ada[cropped]
      "Plot":"Three decades after the Empire's defeat, a new t[cropped]
      "Language":"English",
    ```
  - Green label below: "What API server returns (JSON)"
  - [figure: a double-headed grey arrow labelled "VS" between the left and right halves]
  - Right, orange labels "Browsers: Rendering HTML pages" and "https://www.imdb.com/title/tt2488496", then the same IMDb page-source screenshot as slide 23 (here the line `<meta name="title" content="Star Wars: The Force Awakens (2015) - IMDb" />` is circled in red), and the orange label "What web server returns ( HTML page)".
  - URLs: http://www.omdbapi.com/?t=star+wars&y=2015&apikey=1668f32d , https://www.imdb.com/title/tt2488496
- **Slide 27** (no title):
  - "Now with the help of  API you can even let your users to track their orders inside your website by partnering with Fedex or Canada post using their APIs."
  - [figure: a blue box "Online Movie Store". A double-headed arrow labelled "API" to the IMDb logo. A second double-headed arrow labelled "API" to the Canada Post / Postes Canada logo, captioned "In case someone needed physical DVD".]
- **Slide 28, "API" / "Application Programming Interface"**:
  - "A user interface to access partners' data and services"
  - "In web development, Web API often refers to the way by which we retrieve information from an online service."
  - "API documentation :"
    - "list of URLs, query parameters etc on how to make a request from the web API server,"
    - "It also inform us what sort of response will be received for each query ( json, text file, xml etc)"
- **Slide 29, "API and Microservices"** (small title):
  - "You can even let your visitors buy Movie using their facebook account by integrating your online Movie store to facebook"
  - [figure: a blue box "Online Movie Store" in the centre. Double-headed arrows labelled "API" to: the Facebook logo (left, orange callout "Authentication service"), the IMDb logo (right, orange callout "Storage service"), the Canada Post logo (lower right, orange callout "Shipment tracking service"). An orange callout pointing at the Online Movie Store box itself: "Multiple microservices: UI, user management".]

## Part 3: Anatomy of web APIs (slides 30-32)
- **Slide 30**: [blue oval "Part 3"] "**Anatomy of web APIs**"
- **Slide 31, "Anatomy of Web APIs"**:
  - "**1- Headers**: The additional details provided for communication between client and server. Some of the common headers are:"
    - "**Request:**"
      - "- *API-key*: the subscription key the client. This way the server knows who is making the request."
      - "- *count*: the number of objects you want the" (sic, sentence ends there)
      - "- pageNo: the page number etc"
    - "**Response**:"
      - "- *status*: the status of request or HTTP code."
      - "- *content-type*: type of resource sent by server ( e.g. html/img/..." (sic, no closing parenthesis)
  - "**2- Data**: (also called body or message) contains info you want to send to the server."
  - "Reference: https://www.freecodecamp.org/news/rest-api-tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/"
  - [note: `count` and `pageNo` are not standard HTTP headers; APIs usually take them as query parameters. The status code is carried in the response status line rather than a header named "status", and content-type values are MIME types such as `text/html`, `image/png`, `application/json`.]
- **Slide 32, "Anatomy of Web APIs"**:
  - "**3- Endpoint:** it is the URL where the API Server is listening to."
  - "**4- HTTP Methods**: determines the method of communication between client and server? Web API servers implements multiple 'methods' for different types of request, the following are most popular:"
    - "**GET**: **Get** resource from the server."
    - "**POST**: **Create** resource to the server."
    - "**PUT**: **Update** existing resource on the server."
    - "**DELETE**: **Delete** existing resource from the server." (the end of this line is hidden behind the callout; text layer gives "server")
  - [figure: a blue callout pointing at the POST line: "The two most common HTTP methods are: GET and POST."]
  - "Reference: https://www.freecodecamp.org/news/rest-api-tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/"

## GET vs POST (slides 33-39)
- **Slide 33, "GET vs POST method"**: "The two most common HTTP methods are: GET and POST."
- **Slide 34, "GET"**:
  - "GET is used to request data from a specified resource."
  - "the query string (name/value pairs) is sent in the URL of a GET request"
  - Example:
    ```text
    /test/demo_form.php?name1=value1&name2=value2
    ```
  - [figure: `name1=value1` and `name2=value2` each boxed; a blue callout from the first box: "Query string (Key/value ) pair"]
- **Slide 35, "GET"**:
  - "GET requests can be **cached**"
    - "GET requests are re-executed but may not be re-submitted to server if the HTML response is already stored in the browser cache."
  - "GET requests **remain** in the browser **history**"
  - "GET requests can be **bookmarked**"
  - "GET requests should never be used when dealing with sensitive data"
    - "**Q**: Why?" A: (not on the slide)
  - "GET requests have **length restrictions** on data size"
  - "GET requests **should** only be used **to request data** (not modify)"
- **Slide 36, "POST"**:
  - "POST is used to send data to a server to create/update a resource"
  - "The data sent to the server with POST is stored in the request body of the HTTP request ( not part of the URL)"
  - "POST requests are **never cached**"
  - "POST requests **cannot be bookmarked**"
  - "POST requests **do not remain** in the browser **history**"
  - "POST requests have **no restrictions** on data length"
  - "If refreshing leads to resending a post request ( using form), the browser warns the user"
  - [figure: a Chrome screenshot, address bar "localhost:8888/API/v1/patient/", showing the dialog:]
    ```text
    Confirm Form Resubmission
    The page that you're looking for used information that you entered.
    Returning to that page might cause any action you took to be repeated.
    Do you want to continue?
    [Continue]  [Cancel]
    ```
  - [note: "never cached" is the practical rule; HTTP does allow a POST response to be cached when it carries explicit freshness headers, but browsers and CDNs almost never do so.]
- **Slide 37, "In class activity"**:
  - "Which of the following web API request should be handled by GET which one should be handled by POST?"
  - "1- Google map search"
  - "2- Login to your online banking system"
  - [figure: left, a Scotiabank login screenshot (address bar "auth.scotiaonline.scotiabank.com/onli…", "Welcome to Scotiabank", username field "Amir", a masked password field, "Remember my username or card"), with a red hand-drawn arrow pointing up to the address bar; blue callout "**POST** / Your login data will not be sent to server over the URL". Right, a Google Maps screenshot (address bar "google.com/maps/place/Downtown+Vancouver,+Vancouver,+BC/@49.2812158,-1…", search box "Downtown Vancouver, Vancouv…", map with "Vancouver Seawall", "St. Paul's Hospital", "Mostly cloudy · 2°C"), with a red arrow pointing to the URL; blue callout "**GET** / Move your mouse and notice the changes at URL ( the data sends over the URL)"]
  - A (from the callouts): 1- Google map search → GET; 2- Login to online banking → POST.
- **Slide 38, "In class activity"**:
  - "Q: which method is secure, GET or POST?"
  - "A: none! The data is not encrypted by default when sent over GET or POST, you need to encrypt data ( or use secure protocols such as https etc)"
- **Slide 39** (the full comparison table, no title; "Ref:w3school" at the right edge; the first row is highlighted yellow):

| | GET | POST |
|---|---|---|
| Pressing BACK button or browser/Reload (refreshing page) | Harmless | Data will be re-submitted (the browser should alert the user that the data are about to be re-submitted) |
| Bookmarked | Can be bookmarked | Cannot be bookmarked |
| Cached | Can be cached | Not cached |
| History | Parameters remain in browser history | Parameters are not saved in browser history |
| Restrictions on data length | Yes, when sending data, the GET method adds the data to the URL; and the length of a URL is limited (maximum URL length is 2048 characters) | No restrictions |
| Restrictions on data type | Only ASCII characters allowed | No restrictions. Binary data is also allowed |
| Security (none are secure! ) | GET is less safe compared to POST because data sent is part of the URL Never use GET when sending passwords | POST is a **little** safer than GET because the parameters are not stored in browser history or in web server logs |
| Visibility | Data is visible to everyone in the URL | Data is not displayed in the URL |

  - [note: HTTP sets no maximum URL length; 2048 characters was the old Internet Explorer limit, and modern browsers and servers allow much longer URLs (servers commonly cap around 8 KB). "Only ASCII" means non-ASCII characters must be percent-encoded in the URL, not that they cannot be sent. "No restrictions" on POST length is also practical, not absolute: servers impose body-size limits.]

## Part 4: Postman (slides 40-43)
- **Slide 40**: [blue oval "Part 4"] "How to test and try an API?"
  - "We can use postman" [Postman logo]
  - "Download: https://www.getpostman.com/"
- **Slide 41** (small text at top left):
  - "In class activity"
  - "Now use postman to try https://httpbin.org/get API"
  - "try these"
  - "https://github.com/public-apis/public-apis"
- **Slide 42** (Postman screenshot, no title):
  - [figure: Postman request bar: method "GET", URL "https://httpbin.org/get" (underlined in blue), buttons "Params", "Send", "Save"; environment "No Environment". Request tabs "Authorization", "Headers" (underlined in blue), "Body", "Pre-request Script", "Tests"; header table columns "Key", "Value", "Description" with an empty "New key" row. Response tabs "Body", "Cookies", "Headers (10)", "Test Results"; "Status: 200 OK" (underlined in blue), "Time: 384 ms". View "Pretty / Raw / Preview", format "JSON".]
  - Response body (line numbers 1-15 dropped):
    ```text
    {
        "args": {},
        "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "close",
            "Host": "httpbin.org",
            "Postman-Token": "f6155548-2474-1b91-29a1-f999b94a1f7c",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0
                .3239.84 Safari/537.36"
        },
        "origin": "75.157.46.180",
        "url": "https://httpbin.org/get"
    }
    ```
- **Slide 43, "Example 2: https://currentsapi.services/en/docs/"**:
  - [figure: dark-theme Postman screenshot. Method "GET" circled in red. URL "https://api.currentsapi.services/v1/latest-news?apiKey=zXmZ6O2[redacted with black scribble]". Tabs "Params ●", "Authorization", "Headers (7)", "Body", "Pre-request Script", "Tests", "Settings". "Query Params" table: KEY "apiKey" (checked, underlined in red), VALUE "zXmZ6O2HQrDAxpJMeoc[redacted]…" (underlined in red). Response: "Status: 200 OK", "Time: 686 ms"; tabs "Body", "Cookies", "Headers (10)", "Test Results"; view "Pretty / Raw / Preview / Visualize", "JSON".]
  - Response body excerpt (lines 4-16 visible; right edge cropped):
    ```text
        {
            "id": "ca62e62d-ec95-4059-b71c-e0d01493ed9e",
            "title": "Accused Capitol rioter from NY identified thanks to varsity jacket",
            "description": "An upstate New York man was charged Monday in connection with the US Capitol riot — after[cropped]
                his high school varsity jacket. Brian Gundersen, 26, was spotted in footage broadcast on CNN wearing[cropped]
                High School in Armonk as he breached the Capitol on Jan....",
            "url": "https://nypost.com/2021/01/26/accused-capitol-rioter-from-ny-idd-thanks-to-varsity-jacket/",
            "author": "@nypost",
            "image": "https://nypost.com/wp-content/uploads/sites/2/2021/01/brian-gundersen-1.jpg?quality=90&strip=al[cropped]
            "language": "en",
            "category": [
                "general"
            ],
            "published": "2021-01-26 05:01:18 +0000"
        },
    ```
  - Point of the example: the API key is passed as a query parameter (`apiKey`) of a GET request.

## Part 5: RESTful architecture and microservices (slides 44-48)
- **Slide 44**: [blue oval "Part 5"] "What is RESTful API?"
  - "It's service follows RESTful Architectural style"
- **Slide 45, "RESTful Architecture"**:
  - "**REST: Representational** State **Transfer** architectural design"
  - "Is an architectural style; we will see"
  - "how this **stateless** model helps **applications to scale easily** and"
  - "how it separates data preparation and data consumption."
  - "Microservices ( as a way of implementing the backend of RESTful API servers)"
  - "Architects have started introducing the concept of microservices, aiming to reduce the complexity in designing by improving modularity"
  - "systems by splitting the core components into small and independent pieces called Microservice that simply do a single task." ("small", "independent", "single task" in blue)
  - "Relation between Microservices and RESTful API:"
    - "The Microservices communicate via RESTful API calls"
- **Slide 46** (no title):
  - "Microservices – These are small and lightweight services that execute a single functionality. The Microservices Architecture framework has a number of advantages that allows developers to not only enhance productivity but also speed up the entire deployment process."
  - "The components making up an application build using the Microservices Architecture aren't directly dependent on each other. As such, they don't necessitate to be built using the same programming language."
  - "Therefore, developers working with the Microservices Architecture are free to pick up a technology stack of choice. It makes developing the application simpler and quicker."
- **Slide 47, "Example: Micro-service architecture diagram"**:
  - "**Q**: Guess  application this diagram represent? Online store? CRM?" A: (not on the slide)
  - [figure: a yellow speech bubble "RESTful API" pointing down at the remarks]
  - "Remarks:"
    1. "Services communicate via API calls"
    2. "Every request goes through API gateway"
    3. "Gateway is responsible for routing, authentication, Auditing etc"
    4. "Client specific APIs are the one published to developers"
    5. "Each microservice could be developed in a different technology stack and could be hosted in a server geographically separated from other services."
  - [figure: three columns.
    - Left column headed "Client Apps", blue boxes top to bottom: "Main Web App", "Online Tests", "Online Forum", "Mobile App", "Paper-based tests", "Event management", "…".
    - Middle column headed "API Gateway": one light-green box containing orange boxes "Security", "Routing", "Audit", "Localization", "…".
    - Right column headed "RESTful Micro Services", green boxes top to bottom: "Authentication", "Payment processing", "Profile", "Scheduling", "User Calendar", "Reporting", "Recommendation", "Prerequisites", "Notification", "…".
    - Double-headed arrows from Main Web App, Online Tests, Online Forum and Mobile App to the API Gateway box; double-headed arrows from the API Gateway box to every microservice box.
    - Yellow callouts: "Client Specific APIs" pointing at the arrows between the client apps and the gateway, with an orange label "published" on it; "Single Entry point" pointing at the API Gateway box; "Protocol Translation" pointing at the arrows between the gateway and the microservices.]
- **Slide 48, "RESTful is not an architectural pattern!"**:
  - "REST is not an architectural pattern like Microservices or MVC."
  - "Instead, it's an architectural style or set of constraints for API communication between systems."
  - "The communication between components in an architectural patterns usually happen via **API** calls ( Q: How else the communication can happen?)"
  - Q: "How else the communication can happen?" A: (not on the slide)

## RESTful API server principles (slides 49-53)
- **Slide 49, "RESTful API Servers development principals"** (sic, "principals"; the word "development" is greyed):
  - **1. Client–Server**
  - **2. Stateless**
  - **3. Cacheable**
  - **4. Uniform Interface (core constraint)**
  - **5. Layered System**
  - "**Q:** what's the benefit to follow these principles when  implementing ( coding) our API server?" A: (not on the slide)
- **Slide 50, "RESTful API Servers development principals"**:
  - **1. Client–Server**
    - "**Principle:** Separation of concerns — the client handles the user interface/experience, and the server manages data and business logic."
    - "**Benefit:** Improves portability (UI can change without backend changes) and scalability (servers optimized for logic, clients optimizes for UI)."
    - "**Example: GitHub** — Web app, mobile app, and CLI clients all consume the same server APIs."
  - **2. Stateless**
    - "Each request contains all the info needed; server doesn't store session state."
    - "Example: If your API server returns pages of a book, then to keep it *stateless* (and RESTful), the client must always specify the exact page. For instance, if you has just asked for page 50, to get content of page 51 , you cannot serve such request from client like **"give me the next page."** The server should respond **"I don't keep track of previous requests — you must tell me which page you want."**" (sic, "you has")
  - **3. Cacheable**
    - "The API server you implement must define if a response is cacheable or not (via HTTP headers like Cache-Control, ETag, Expires)."
    - "the **client or intermediaries** (like browsers, CDNs, reverse proxies) can cache the response and reuse it."
- **Slide 51** (continuation, no title):
  - **4. Uniform Interface (core constraint)**
    - "Resource Identification via URIs → Each resource has a unique URL (e.g., /users/123)."
    - "Manipulation through Representations → Resources are manipulated via JSON/XML representations."
    - "Self-Descriptive Messages → Requests and responses include metadata (e.g., HTTP verbs, headers)."
    - "HATEOAS (Hypermedia as the Engine of Application State) → Responses include links for discoverability.( Q? I don't know what is means!!!)" (sic)
    - "**Example**: GitHub REST API — /repos/{owner}/{repo}/issues returns issues plus links to related actions (close, comment, assign)."
    - "**Benefit**: Simplifies interactions and makes APIs predictable."
    - "**Example**: GitHub REST API"
      - "To get a user: GET /users/octocat" (grey text)
      - "To get that user's repos: GET /users/octocat/repos" (grey text)
      - "To get a specific repo: GET /repos/octocat/hello-world" (grey text)
    - "👉 You don't need to read special documentation for every endpoint — the pattern is consistent and predictable."
    - "Nouns (resources) are always in the URL."
    - "Verbs (actions) are always HTTP methods (GET, POST, PUT, DELETE)"
  - [note: HATEOAS means a response carries hyperlinks to the related resources and the actions available next (for example a `links` or `_links` field, or a `Link` header), so a client can navigate the API from the responses instead of hard-coding every URL.]
- **Slide 52** (continuation, no title):
  - **5. Layered System**
    - "**Principle:** The system can be composed of multiple layers (e.g., client, proxy, gateway, server). Clients don't know if they are talking to the origin server or an intermediary."
    - "**Benefit:** Adds flexibility, scalability, and security. Enables CDNs, load balancers, and gateways without changing the client."
    - "**Example: Amazon Web Services (AWS API Gateway)** — sits between clients and microservices, handling routing, throttling, and security."
- **Slide 53, "Benefits to making our API server RESTful?"**:
  - "Client–Server → separation & evolvability (GitHub)"
  - "Stateless → scalability & reliability (Netflix)"
  - "Cacheable → performance & efficiency (Twitter)"
  - "Uniform Interface → simplicity & predictability (GitHub API)"
  - "Layered System → flexibility & security (AWS API Gateway)"
  - "Code-on-Demand → extensibility (Web apps delivering JavaScript)"
  - [note: Code-on-Demand is REST's sixth constraint, the only optional one (Fielding); it is not among the five listed on slide 49.]

## Resources (slide 54)
- **Slide 54, "Resources"**:
  - https://www.w3schools.com/
  - "RESTful Web API Design with Node.js 10, Third Edition, Valentin Bojinov"
  - "chatGPT"

## Facts and numbers index
- Deck: 54 slides; five parts (1 Review, 2 Why Web APIs, 3 Anatomy, 4 Postman, 5 RESTful) (slide 2).
- Lab0 = four review quizzes on week 1 content; Lab1 = week 2 material (slide 3).
- Prior courses: COMP1537 Web Development 1, COMP2537 Web Development 2, COMP1630 Relational Database Design and SQL (slide 4).
- JSON = converting an object into a string; `JSON.stringify(myObj)` object → string; `JSON.parse(myJSON)` string → object (slide 6).
- Web storage: localStorage and sessionStorage; "more secure compared* to cookies" (*not fully secure); local storage permanent, session storage expires; same origin, same browser; string key/value pairs only (slide 7).
- `sessionStorage.getItem("key")` returns a string or null (slide 7).
- Store an object in localStorage: yes, via JSON (slide 8).
- var = function-scoped; let = block-scoped; const = block-scoped, cannot be re-assigned (slide 10).
- `{ var a = 10; } console.log(a);` prints 10; let/const versions give "Uncaught ReferenceError: a is not defined" (slide 11).
- Hoisting applies "only for variables declared by var"; a var read before its declaration prints undefined; a let read before declaration issues an error and terminates execution (slide 13).
- Declaration preference: first const, then let, never var (slide 14).
- Undeclared variable becomes global scope (slide 14).
- `==` / `!=` perform automatic type conversion; `===` / `!==` perform none, compare type then value (slide 15).
- setTimeout script prints 1, 3, 2, with 1000 ms and also with 0 ms (slide 16).
- Web servers return HTML pages (plus their JS and CSS); ctrl+u shows the page source (slide 19).
- Monolithic small web app: browser → web server (Node js files, HTML pages) ↔ file server, DB server; returns rendered HTML pages (slide 20).
- Movie store: two choices, build own database (years) or take from IMDB.com; 100,000 titles (slide 22).
- Challenge 1: HTML (screen) scraping (slide 23). Challenge 2: IMDb changes its UI and the scraper breaks (slide 24).
- Solution: two services / two URLs: web server for browsers and users (HTML, can change any time); API server for data consumer applications (JSON/XML, does not change) (slide 25).
- OMDb call `http://www.omdbapi.com/?t=star+wars&y=2015&apikey=1668f32d` returns JSON: Title "Star Wars: The Force Awakens", Year "2015", Rated "PG-13", Released "18 Dec 2015", Runtime "136 min", Director "J.J. Abrams"; IMDb page `https://www.imdb.com/title/tt2488496` (slide 26).
- Partner APIs: Fedex or Canada Post for order tracking (slide 27); Facebook = authentication service, IMDb = storage service, Canada Post = shipment tracking service (slide 29).
- API = Application Programming Interface; API documentation lists URLs, query parameters, and the response type (json, text file, xml) (slide 28).
- Four parts of a web API: 1 Headers, 2 Data (body/message), 3 Endpoint (URL where the API server listens), 4 HTTP Methods (slides 31-32).
- Request headers listed: API-key, count, pageNo; response headers: status, content-type (slide 31).
- Methods: GET get, POST create, PUT update, DELETE delete; the two most common are GET and POST (slides 32-33).
- GET query string = name/value (key/value) pairs in the URL: `/test/demo_form.php?name1=value1&name2=value2` (slide 34).
- GET: cached, in history, bookmarkable, never for sensitive data, length-restricted, only to request data (slide 35).
- POST: data in request body; never cached; not bookmarkable; not in history; no length restriction; browser warns on resubmission ("Confirm Form Resubmission") (slide 36).
- Google map search → GET; online banking login → POST (slide 37).
- Neither GET nor POST is secure; encrypt or use https (slide 38).
- Table: maximum URL length 2048 characters; GET only ASCII; POST allows binary; POST "a little safer"; "none are secure!"; Ref: w3school (slide 39).
- Postman download https://www.getpostman.com/; activity URL https://httpbin.org/get returns Status 200 OK (slides 40-42).
- currentsapi: GET with query parameter apiKey; Status 200 OK (slide 43).
- REST = Representational State Transfer; an architectural style; stateless model helps scaling; separates data preparation and consumption (slide 45).
- Microservices: small, independent, single task; communicate via RESTful API calls; can use different languages/technology stacks (slides 45-46).
- Microservice diagram remarks: 5 items (API calls; every request through API gateway; gateway does routing, authentication, auditing; client-specific APIs are published; each service can use a different stack and be hosted separately); gateway = "Single Entry point", gateway ↔ services = "Protocol Translation" (slide 47).
- REST is not an architectural pattern (like Microservices or MVC); it is a style / set of constraints (slide 48).
- Five RESTful principles in order: 1 Client–Server, 2 Stateless, 3 Cacheable, 4 Uniform Interface (core constraint), 5 Layered System (slide 49).
- Stateless example: page 50 then page 51, not "give me the next page" (slide 50).
- Cacheable headers: Cache-Control, ETag, Expires (slide 50).
- Uniform Interface: four parts (resource identification via URIs, manipulation through representations, self-descriptive messages, HATEOAS); nouns in the URL, verbs are HTTP methods (slide 51).
- Layered System example: AWS API Gateway (routing, throttling, security) (slide 52).
- Benefits mapping (slide 53): Client–Server → separation & evolvability (GitHub); Stateless → scalability & reliability (Netflix); Cacheable → performance & efficiency (Twitter); Uniform Interface → simplicity & predictability (GitHub API); Layered System → flexibility & security (AWS API Gateway); Code-on-Demand → extensibility (web apps delivering JavaScript).

## Likely quiz traps
- `var` is function-scoped, `let` and `const` are block-scoped: the `var` block prints 10, the others throw "a is not defined" (slides 10-11).
- The A/B/C items: A (`console.log` before `var`) prints undefined, not an error; C (before `let`) throws (slides 12-13).
- The slide says hoisting is "only for variables declared by var" and that the engine "will NOT hoist" let (slide 13); a quiz keyed to the slide will expect that wording.
- Replacing 1000 with 0 in `setTimeout` does not change the order: still 1, 3, 2 (slide 16).
- Web storage is "more secure compared to cookies" but "not fully secure", and stores strings only, so `getItem` returns a string or null (slide 7).
- Which method is secure, GET or POST? "none!" (slide 38); the table says POST is only "a **little** safer" (slide 39).
- POST requests are "never cached", "cannot be bookmarked", "do not remain" in history; GET is the opposite on all three (slides 35-36, 39).
- The GET URL length limit on the slide is 2048 characters; GET allows only ASCII, POST allows binary (slide 39).
- POST is described as "Create" and PUT as "Update" (slide 32), though slide 36 says POST sends data "to create/update a resource".
- The five RESTful principles in order, with Uniform Interface as the "core constraint" (slide 49); Code-on-Demand appears only on the benefits slide as a sixth item (slide 53).
- REST is "not an architectural pattern like Microservices or MVC"; it is an architectural style or set of constraints (slide 48).
- Stateless means the client must name the exact page; "give me the next page" breaks statelessness (slide 50).
- In the microservice diagram every request goes through the API gateway (the single entry point), and it is the client-specific APIs that are published to developers (slide 47).
- OMDb is the API server that returns JSON/XML and "does not change what this url return"; IMDb's web pages return HTML that can change any time (slide 25).
- The four anatomy items in order: Headers, Data, Endpoint, HTTP Methods; Data is "also called body or message" (slides 31-32).
