---
title: A server runs 24/7, and Node handles a file request in three steps
minutes: 14
---

Lectures 1 to 3 lived in the browser. This lecture moves to the other end of the request: what a server is, what code running on it can do, and why the course picks Node.js to write it.

<!-- facts: slide 2 outline seven sections; slide 3 review list; slides 4-5 code of conduct; slide 7 server 24/7, protocols http ftp, http methods GET POST; slide 8 figure API consumer, web server Node.js, DB server MySQL, file server, mail server, front-end, backend; slide 9 server-side script can do four things, wordpress index.php; slide 12 PHP four steps, Node three steps, eliminates the waiting, single-threaded memory efficient -->

## The deck's map and the review (slides 2 to 5)

Slide 2's outline has seven sections: the server, Node.js, the restaurant analogy, installation and debugging, modules, the built-in modules `http`, `url` and `fs`, and shared hosting. Slide 3 reviews lectures 1 and 3: hoisting, *Functions with no return statement, return undefined !*, *JS is asynchronous, single threaded, non-blocking!*, GET against POST, and *In JS a function can return a function*. Slide 5's team rule: *Every team member should have a comprehensive understanding of the entire project, including the work done by their fellow teammates.*

## A server is a computer running 24/7 (slide 7)

*A server is a computer ( or computers) running 24/7 and accessible via the internet.* A client, such as a browser or a mobile app, sends a request over a protocol *such as http, ftp etc*; the server *looks for the application responsible to deal with that request, and returns the response using those protocols*. In this course every request travels *using http methods such as GET, POST etc.*

Slide 8 draws the whole picture. On the left sits the **API consumer**, the client, built from JavaScript, CSS and HTML. *Browser communicates with server via http requests/methods such as GET, POST, PUT .. methods*, sent *Via forms, AJAX calls*. On the right, inside one dashed backend box, the **Web Server** written in Node.js *understands http requests*; it talks both ways with a **DB Server** running MySQL, which is *in the same machine with web server (local host) or in a different machine*. A file server and a mail server sit beside it.

```diagram
{ "type": "flow", "title": "What is a server?", "nodes": [ { "id": "consumer", "label": "API consumer", "sub": "client: JS / CSS / HTML" }, { "id": "web", "label": "Web Server", "sub": "Node.js" }, { "id": "db", "label": "DB Server", "sub": "MySQL", "kind": "cylinder" }, { "id": "file", "label": "file server" }, { "id": "mail", "label": "mail server" } ], "edges": [ { "from": "consumer", "to": "web", "label": "Requests" }, { "from": "web", "to": "consumer", "label": "Response" }, { "from": "web", "to": "db", "label": "query" }, { "from": "db", "to": "web", "label": "data" } ], "hi": ["consumer"], "caption": "Browser communicates with server via http requests/methods such as GET, POST, PUT .. methods" }
```

The two arrows under the figure split it in half. **Front-end** is the client side; **Backend** is everything in the dashed box.

```diagram
{ "type": "layers", "title": "Front-end and Backend", "nodes": [ { "id": "fe", "label": "Front-end", "sub": "API consumer: HTML, CSS, JavaScript in the browser" }, { "id": "be", "label": "Backend" }, { "id": "w", "label": "Web Server (Node.js)", "parent": "be" }, { "id": "d", "label": "DB Server (MySQL)", "parent": "be" }, { "id": "f", "label": "file server, mail server", "parent": "be" } ], "hi": ["be"], "caption": "The web server, the DB server, the file server and the mail server are all backend." }
```

The database login belongs to the backend. Anyone can read a page's JavaScript, so the MySQL user name and password stay on the server; lecture 5 writes that connection.

## What a server-side script can do (slide 9)

Slide 9 lists four jobs, in this order:

1. *It can create a webserver to generate dynamic page content.*
2. *Server side script can create, open, read, write, delete, and close files on the server.*
3. *Server side script can collect form data.*
4. *Server side script can add, delete, modify data in your database.*

The first job has an example. Opening `wordpress.com/index.php` in the browser *sends a request to the server*; *The server looks for an app to run php files*; *If the php server is installed it runs that file and returns the result in the form of html*. The browser sees only the HTML, built for this request: dynamic content.

```diagram
{ "type": "flow", "title": "Opening wordpress.com/index.php", "nodes": [ { "id": "b", "label": "browser" }, { "id": "s", "label": "server" }, { "id": "p", "label": "app to run php files" }, { "id": "b2", "label": "browser shows html" } ], "edges": [ { "from": "b", "to": "s", "label": "GET /index.php" }, { "from": "s", "to": "p", "label": "runs the file" }, { "from": "p", "to": "b2", "label": "html" } ], "hi": ["p"], "caption": "The slide's steps drawn: if the php server is installed it runs that file and returns the result in the form of html." }
```

## PHP waits for the file; Node.js does not (slide 12)

Slide 12 answers *Why nodeJS?* with one line: *Node.js is non blocking!* It then compares how each server handles a request for a file.

| step | PHP or ASP | Node.js |
|---|---|---|
| 1 | Sends the task to the computer's file system. | Sends the task to the computer's file system. |
| 2 | Waits while the file system opens and reads the file. | Ready to handle the next request. |
| 3 | Returns the content to the client. | When the file system has opened and read the file, the server returns the content to the client. |
| 4 | Ready to handle the next request. | |

The difference is step 2: PHP waits and is free only at step 4; Node.js is free before the file is read. *Node.js eliminates the waiting, and simply continues with the next request.*

### PHP or ASP: request B waits for file A

The highlighted arrow is request B, accepted only after file A has gone back.

```diagram
{ "type": "sequence", "title": "How PHP or ASP handles a file request", "nodes": [ { "id": "c", "label": "Client", "kind": "lane" }, { "id": "s", "label": "Server (PHP/ASP)", "kind": "lane" }, { "id": "fs", "label": "File system", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "request file A" }, { "from": "s", "to": "fs", "label": "1 send the task" }, { "from": "fs", "to": "s", "label": "2 read done (server waited)" }, { "from": "s", "to": "c", "label": "3 content of A" }, { "from": "c", "to": "s", "label": "4 request B accepted" } ], "hi": ["5"], "caption": "The slide's steps drawn: the server waits while the file system opens and reads the file." }
```

### Node.js: request B is accepted while file A is read

Same three lanes; request B now moves up to the second message.

```diagram
{ "type": "sequence", "title": "How Node.js handles a file request", "nodes": [ { "id": "c", "label": "Client", "kind": "lane" }, { "id": "s", "label": "Server (Node.js)", "kind": "lane" }, { "id": "fs", "label": "File system", "kind": "lane" } ], "edges": [ { "from": "c", "to": "s", "label": "request file A" }, { "from": "s", "to": "fs", "label": "1 send the task" }, { "from": "c", "to": "s", "label": "2 request B accepted" }, { "from": "fs", "to": "s", "label": "file A read" }, { "from": "s", "to": "c", "label": "3 content of A" } ], "hi": ["3"], "caption": "Node.js eliminates the waiting, and simply continues with the next request." }
```

The slide ends with *Node.js runs single-threaded, non-blocking, asynchronously programming, which is very memory efficient.* No worker sits waiting per request, so fewer are held in memory. The next lesson's restaurant analogy shows what "single-threaded" means and where the file reading really happens.

```quiz
[
  { "q": "Put PHP's handling of a file request in the slide's order.", "type": "reorder", "lines": ["Sends the task to the computer's file system.", "Waits while the file system opens and reads the file.", "Returns the content to the client.", "Ready to handle the next request."], "explain": "Slide 12: PHP or ASP waits at step 2 and is ready for the next request only at step 4." },
  { "q": "Put Node.js's handling of a file request in the slide's order.", "type": "reorder", "lines": ["Sends the task to the computer's file system.", "Ready to handle the next request.", "When the file system has opened and read the file, the server returns the content to the client."], "explain": "Slide 12: Node.js is ready for the next request at step 2, before the file is read, and returns the content at step 3." },
  { "q": "Node.js is ready to handle the next request only after the file system has read the file.", "type": "tf", "answer": false, "explain": "That is PHP's order. Node.js is *Ready to handle the next request* at step 2; *Node.js eliminates the waiting, and simply continues with the next request.*" },
  { "q": "Which of these is NOT on slide 9's list of what a server-side script can do?", "options": ["Change the colour of a button in the visitor's browser without contacting the server", "Generate dynamic page content", "Collect form data", "Add, delete, modify data in your database"], "answer": 0, "explain": "Slide 9 lists a webserver generating dynamic page content, working with files on the server, collecting form data, and changing database data. Changing the page in the browser is front-end JavaScript." },
  { "q": "A server is a computer (or computers) running ___ and accessible via the internet.", "type": "text", "answer": ["24/7", "24 / 7", "24-7"], "explain": "Slide 7: *A server is a computer ( or computers) running 24/7 and accessible via the internet*." },
  { "q": "On slide 8, where may the DB Server run?", "options": ["In the same machine with the web server (local host) or in a different machine", "Only inside the browser, next to the API consumer", "Only on the same machine as the web server", "Only on the mail server"], "answer": 0, "explain": "Slide 8's bubble: *in the same machine with web server (local host) or in a different machine*." },
  { "q": "A bookstore page's own script holds the MySQL user name and password and connects to the database from the browser. This is good practice.", "type": "tf", "answer": false, "explain": "The database belongs to the backend of slide 8. Anyone can read a page's script, so the credentials and the connection live on the Node server, which the page calls with an http request." },
  { "q": "Sending a clinic login's password in the query string of a GET request is safe. (Lecture 3 review, slide 3.)", "type": "tf", "answer": false, "explain": "GET puts the data in the URL, which stays in the browser history and server logs. Credentials go in the body of a POST over https." },
  { "type": "free", "q": "Compare how PHP and Node.js handle a request for a file.", "model": "Both start by sending the task to the computer's file system. PHP (or ASP) then waits while the file system opens and reads the file, returns the content, and only then is ready for the next request (four steps). Node.js is ready to handle the next request straight after sending the task, and returns the content when the file system has read the file (three steps). Node.js eliminates the waiting, which makes it non-blocking and memory efficient.", "points": ["both first send the task to the file system", "PHP waits while the file is opened and read", "Node is ready for the next request at step 2", "Node returns the content once the file system has read the file", "Node eliminates the waiting: non-blocking, memory efficient"], "rows": 6, "explain": "Slide 12's two lists side by side; the difference is where 'ready to handle the next request' falls." }
]
```
