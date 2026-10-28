---
title: "CRUD from Node.js: connect, create, insert, select"
minutes: 16
---

Lecture 7's deck has no Node.js code. The code here follows lecture 5 slides 43 to 45 and Lab 5's shape, written for a bookstore's `books` table; slide 44's own listing is in [Connecting Node to MySQL](#/comp4537-l5/node-to-mysql).

## Slide 5 reviews lectures 1 to 6

| Slide 5 bullet | Taught in |
|---|---|
| setTimeout order: `1`, `setTimeout(…2…, 0)`, `3` logs 1, 3, 2 (worked out) | [Timers](#/comp4537-l1/timers-and-the-event-queue) |
| architectures | [Architectures](#/comp4537-l2/architecture-and-its-patterns) |
| single or multiple threaded, non-blocking | [The restaurant](#/comp4537-l4/node-and-the-restaurant) |
| AJAX; readyState 0 UNSENT to 4 DONE, *3(LOADING) could be updated multiple times* for a chunked response, DONE also on an error | [XHR](#/comp4537-l5/xmlhttprequest-four-steps) |
| GET vs POST | [GET vs POST](#/comp4537-l3/get-vs-post) |
| modules, http and fs, `npm install` | [Node modules](#/comp4537-l4/node-modules) |
| *how to create DB user in a cPannel shared hosting accounts*, *giving various privileges to DB user*, *How node js connects to DB* | this lesson |
| hosting, nodemon, installing MySQL, phpMyAdmin | not examined |

## Three steps: create, connect, query (lecture 5, slides 43 and 44)

*mysql is an external module and needs to be installed*: `npm install mysql` (mysql@2.18.1). Without it, `require("mysql")` stops the script:

```text
Error: Cannot find module 'mysql'
```

Slide 44's steps: *First create a myslq object*, *Then connect*, *And run a SQL statement*.

```diagram
{ "type": "sequence", "title": "The three steps", "nodes": [ { "id": "app", "label": "app.js", "kind": "lane" }, { "id": "mod", "label": "mysql module", "kind": "lane" }, { "id": "srv", "label": "MySQL server", "kind": "lane" } ], "edges": [ { "from": "app", "to": "mod", "label": "createConnection({...})" }, { "from": "app", "to": "mod", "label": "connect(callback)" }, { "from": "mod", "to": "srv", "label": "handshake" }, { "from": "mod", "to": "app", "label": "callback(err)" }, { "from": "app", "to": "mod", "label": "query(sql, callback)" }, { "from": "srv", "to": "mod", "label": "rows or OK packet" }, { "from": "mod", "to": "app", "label": "callback(err, result)" } ], "hi": ["5", "7"], "caption": "First create a myslq object, then connect, and run a SQL statement." }
```

The `mysql` package is unmaintained and cannot log in to MySQL 8 with its default settings; `mysql2` has the same three calls.

```js pin db_books.js
const mysql = require("mysql");

const CREATE_SQL = "CREATE TABLE IF NOT EXISTS books (" +
  " bookid INT(11) NOT NULL AUTO_INCREMENT," +
  " title VARCHAR(100)," +
  " year INT," +
  " PRIMARY KEY (bookid)" +
  ") ENGINE=InnoDB";
const INSERT_SQL = "INSERT INTO books (title, year) VALUES " +
  "('The Moon', 1999), ('The Earth', 2004), ('The Sun', 2011)";

const con = mysql.createConnection({
  host: "localhost",
  user: "books_writer",
  password: "w-secret",
  database: "bookstore"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(CREATE_SQL, function (err) {
    if (err) throw err;
    con.query(INSERT_SQL, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) inserted");
      con.end();
    });
  });
});
```

What does the terminal print on the first run?

```text
Connected!
3 record(s) inserted
```

`createConnection` only builds the object. `connect` opens the link and calls back with `err`, null on success. Each `query` takes the SQL and a callback `(err, result)`: for an INSERT, `result.affectedRows` is the number of rows added; for a SELECT, `result` is the array of rows. `IF NOT EXISTS` makes the CREATE safe on every run. Nesting puts the INSERT after the CREATE. `con.end()` closes the connection so the script exits.

## CRUD maps to SQL and HTTP methods

Lecture 5 slide 32 names the four operations; the method column is the usual REST mapping.

| CRUD | SQL | HTTP method |
|---|---|---|
| Create | `INSERT` | POST |
| Read | `SELECT` | GET |
| Update | `UPDATE` | PUT or PATCH ([which](#/comp4537-l6/idempotency-put-patch-post)) |
| Delete | `DELETE` | DELETE |

Lab 5 does Create and Read only.

## Two origins, one database (Lab 5)

A static page on origin 1 sends requests; the Node API on origin 2 holds the database login.

```diagram
{ "type": "flow", "title": "Two origins, one database", "nodes": [ { "id": "page", "label": "index.html", "sub": "origin 1 (static page)" }, { "id": "api", "label": "Node API server", "sub": "origin 2, http + mysql" }, { "id": "db", "label": "MySQL", "sub": "bookstore.books", "kind": "cylinder" } ], "edges": [ { "from": "page", "to": "api", "label": "POST /api/v1/books" }, { "from": "api", "to": "db", "label": "INSERT (books_writer)" }, { "from": "db", "to": "api", "label": "(err, result)" }, { "from": "api", "to": "page", "label": "JSON + Allow-Origin" } ], "hi": ["page>api", "api>db"], "caption": "The insert path: POST, then INSERT as books_writer." }
```

```diagram
{ "type": "flow", "title": "Two origins, one database", "nodes": [ { "id": "page", "label": "index.html", "sub": "origin 1 (static page)" }, { "id": "api", "label": "Node API server", "sub": "origin 2, http + mysql" }, { "id": "db", "label": "MySQL", "sub": "bookstore.books", "kind": "cylinder" } ], "edges": [ { "from": "page", "to": "api", "label": "GET /api/v1/sql/SELECT…" }, { "from": "api", "to": "db", "label": "SELECT (books_reader)" }, { "from": "db", "to": "api", "label": "(err, result)" }, { "from": "api", "to": "page", "label": "JSON + Allow-Origin" } ], "hi": ["page>api", "api>db"], "caption": "The read path: GET, then SELECT as books_reader." }
```

### The page and the API are two origins

The ports differ, so the browser applies [CORS](#/comp4537-l5/cors-and-the-same-origin-policy). A POST with `Content-Type: application/json` sends an OPTIONS preflight first; `text/plain` or form-urlencoded does not.

```widget
cors-play
{ "pageOrigin": "http://localhost:3000", "apiOrigin": "http://localhost:8000", "allowOrigin": "*", "method": "POST", "contentType": "application/json" }
```

The page's side, sent here to the app's echo endpoint instead of the bookstore:

```js run pin insertButton.js
// predict: Write the three lines the echo prints.
const xhr = new XMLHttpRequest();
xhr.open("POST", SERVER + "/api/echo/api/v1/books", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onload = function () {
  const echo = JSON.parse(xhr.responseText);
  console.log(echo.method + " " + echo.path);
  console.log(echo.headers["content-type"]);
  console.log("origin " + echo.headers.origin);
};
xhr.send(JSON.stringify({ action: "insert" }));
```

`setRequestHeader` with JSON triggers the preflight, which the echo server answers with 204 before the POST goes. `JSON.parse` reads the reply. The sandbox's origin is `null`.

## The API server (Lab 5's server 2)

```js pin server2/app.js
const http = require("http");
const mysql = require("mysql");

const CREATE_SQL = "CREATE TABLE IF NOT EXISTS books (bookid INT(11) NOT NULL AUTO_INCREMENT, " +
  "title VARCHAR(100), year INT, PRIMARY KEY (bookid)) ENGINE=InnoDB";
const INSERT_SQL = "INSERT INTO books (title, year) VALUES " +
  "('The Moon', 1999), ('The Earth', 2004), ('The Sun', 2011)";
const SQL_PREFIX = "/api/v1/sql/";

// one DB user per job, each connected once at startup
const writer = mysql.createConnection({ host: "localhost", user: "books_writer", password: "w-secret", database: "bookstore" });
const reader = mysql.createConnection({ host: "localhost", user: "books_reader", password: "r-secret", database: "bookstore" });
writer.connect(function (err) { if (err) throw err; });
reader.connect(function (err) { if (err) throw err; });

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function send(res, status, body) {
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

http.createServer(function (req, res) {
  if (req.method === "OPTIONS") {            // the preflight
    res.writeHead(204, headers);
    res.end();
  } else if (req.method === "POST" && req.url === "/api/v1/books") {
    writer.query(CREATE_SQL, function (err) {
      if (err) return send(res, 500, { error: err.message });
      writer.query(INSERT_SQL, function (err, result) {
        if (err) return send(res, 500, { error: err.message });
        send(res, 200, { inserted: result.affectedRows });
      });
    });
  } else if (req.method === "GET" && req.url.startsWith(SQL_PREFIX)) {
    const sql = decodeURIComponent(req.url.slice(SQL_PREFIX.length));
    reader.query(sql, function (err, rows) {
      if (err) return send(res, 400, { error: err.message });
      send(res, 200, rows);
    });
  } else {
    send(res, 404, { error: "not found" });
  }
}).listen(8000);
```

Write the reply to a first POST, then to a GET of `SELECT * FROM books`.

```text
POST /api/v1/books
{"inserted":3}

GET /api/v1/sql/SELECT%20*%20FROM%20books
[{"bookid":1,"title":"The Moon","year":1999},{"bookid":2,"title":"The Earth","year":2004},{"bookid":3,"title":"The Sun","year":2011}]
```

Every reply's `writeHead` carries `Access-Control-Allow-Origin`, and OPTIONS gets 204 with the allowed methods and headers. `writer.query` runs the CREATE, then the INSERT; a second POST grows the table to six rows (ids 1 to 6). `decodeURIComponent` turns `%20` back into spaces, and `reader.query` hands the rows to `JSON.stringify`. No Express: Lab 5 allows DB modules only. This POST ignores its body; one that read it would collect `data` chunks and parse on `end` ([POST with AJAX](#/comp4537-l5/post-with-ajax)).

The `connect` calls sit at startup. Lecture 5 slide 49 calls `connect` inside the request handler, so the second request fails with "Cannot enqueue Handshake after already enqueuing a Handshake".

## Least privilege: a SELECT-only reader (Lab 5, slide 13)

Lab 5 requires that DELETE, DROP, CREATE and UPDATE be impossible through the text area, enforced *on the server side* by the DB user's privileges, not by string checks. The principle of least privilege: give each DB user only the privileges its job needs. Slide 13's cPanel list (ALL PRIVILEGES, ALTER, ALTER ROUTINE, CREATE, CREATE ROUTINE, CREATE TEMPORARY TABLES, CREATE VIEW, DELETE, DROP, EVENT, EXECUTE, INDEX, INSERT, LOCK TABLES, REFERENCES, SELECT, SHOW VIEW) is all ticked, the opposite of what a reader needs. The same grants in SQL, for reading only:

```sql
CREATE USER 'books_writer'@'localhost' IDENTIFIED BY 'w-secret';
GRANT CREATE, INSERT ON bookstore.* TO 'books_writer'@'localhost';
CREATE USER 'books_reader'@'localhost' IDENTIFIED BY 'r-secret';
GRANT SELECT ON bookstore.* TO 'books_reader'@'localhost';
```

```diagram
{ "type": "grid", "title": "Privileges per DB user", "nodes": [ { "id": "h0", "label": "privilege", "row": 0, "col": 0 }, { "id": "h1", "label": "books_writer", "row": 0, "col": 1 }, { "id": "h2", "label": "books_reader", "row": 0, "col": 2 }, { "id": "a0", "label": "CREATE", "row": 1, "col": 0 }, { "id": "a1", "label": "yes", "row": 1, "col": 1 }, { "id": "a2", "label": "no", "row": 1, "col": 2 }, { "id": "b0", "label": "INSERT", "row": 2, "col": 0 }, { "id": "b1", "label": "yes", "row": 2, "col": 1 }, { "id": "b2", "label": "no", "row": 2, "col": 2 }, { "id": "c0", "label": "SELECT", "row": 3, "col": 0 }, { "id": "c1", "label": "no", "row": 3, "col": 1 }, { "id": "c2", "label": "yes", "row": 3, "col": 2 }, { "id": "d0", "label": "UPDATE", "row": 4, "col": 0 }, { "id": "d1", "label": "no", "row": 4, "col": 1 }, { "id": "d2", "label": "no", "row": 4, "col": 2 }, { "id": "e0", "label": "DELETE", "row": 5, "col": 0 }, { "id": "e1", "label": "no", "row": 5, "col": 1 }, { "id": "e2", "label": "no", "row": 5, "col": 2 }, { "id": "f0", "label": "DROP", "row": 6, "col": 0 }, { "id": "f1", "label": "no", "row": 6, "col": 1 }, { "id": "f2", "label": "no", "row": 6, "col": 2 } ], "hi": ["c2"], "caption": "The principle of least privilege: each DB user gets only what its job needs." }
```

```diagram
{ "type": "flow", "title": "A DROP on the read path", "nodes": [ { "id": "g", "label": "GET …/DROP TABLE books" }, { "id": "q", "label": "reader.query" }, { "id": "m", "label": "MySQL: DROP command denied" }, { "id": "r", "label": "400 + error JSON" } ], "edges": [ { "from": "g", "to": "q" }, { "from": "q", "to": "m" }, { "from": "m", "to": "r" } ], "hi": ["m"], "caption": "The database server itself refuses the statement." }
```

```text
GET /api/v1/sql/DROP%20TABLE%20books
{"error":"ER_TABLEACCESS_DENIED_ERROR: DROP command denied to user 'books_reader'@'localhost' for table 'books'"}
```

The passwords stay in the API server's code. The page holds no `mysql` code, only HTTP requests; anyone can read a page's JavaScript.

## Route a clinic's appointments API

A clinic's API has `appt_writer` (INSERT, UPDATE, DELETE on `clinic.appointment`) and `appt_reader` (SELECT only). Decide what each request does.

```quiz
[
  { "q": "A \"cancel appointment\" button removes one booking. Which CRUD operation and HTTP method fit?", "options": ["Delete, sent with DELETE", "Update, sent with PUT", "Read, sent with GET", "Create, sent with POST"], "answer": 0, "explain": "Removing a row is Delete: SQL `DELETE`, HTTP DELETE. Changing a booking's time would be Update (PUT or PATCH)." },
  { "q": "The writer runs `INSERT INTO appointment (patient, day) VALUES ('Ana', 'Tue'), ('Raj', 'Wed')`. What is `result.affectedRows` in the callback?", "type": "numeric", "answer": 2, "tolerance": 0, "explain": "One INSERT with two value lists adds two rows, so `affectedRows` is 2." },
  { "q": "Someone types `UPDATE appointment SET day = 'Fri'` into the read endpoint, which runs it as `appt_reader`. What happens?", "options": ["MySQL refuses it (UPDATE command denied), and the callback gets err", "Every appointment moves to Friday", "Node refuses to send it", "The browser blocks it with CORS"], "answer": 0, "explain": "`appt_reader` has SELECT only. The database server checks privileges and denies the UPDATE; the `(err, rows)` callback gets the error and the API answers 400." },
  { "q": "Which DB user should the GET that lists today's appointments use?", "options": ["appt_reader", "appt_writer", "root", "a new user with ALL PRIVILEGES"], "answer": 0, "explain": "Reading needs SELECT only. Least privilege: the read path runs as the user that can do nothing else." },
  { "q": "Click the line that breaks on the second request.", "type": "spotbug", "code": "const http = require(\"http\");\nconst mysql = require(\"mysql\");\nconst con = mysql.createConnection({ host: \"localhost\", user: \"appt_reader\", password: \"r-secret\", database: \"clinic\" });\nhttp.createServer(function (req, res) {\n  con.connect(function (err) {\n    if (err) throw err;\n    con.query(\"SELECT * FROM appointment\", function (err, rows) {\n      res.writeHead(200, { \"Content-Type\": \"application/json\" });\n      res.end(JSON.stringify(rows));\n    });\n  });\n}).listen(8000);", "answer": 5, "explain": "`con.connect` runs on every request. The second call on an already-connected connection fails (\"Cannot enqueue Handshake after already enqueuing a Handshake\"). Connect once, before `createServer`." }
]
```

```quiz
[
  { "q": "Which module has to be installed with npm before Node can load it?", "options": ["mysql", "path", "os", "events"], "answer": 0, "explain": "Lecture 5 slide 43: *mysql is an external module and needs to be installed*. `path`, `os` and `events` ship with Node." },
  { "q": "A bookstore page reads its stock with this in a `<script>` tag. Is that sound practice?", "code": "const mysql = require(\"mysql\");\nconst db = mysql.createConnection({ host: \"shop.example\", user: \"admin\", password: \"pa55\" });\ndb.connect(function (err) { if (err) throw err; });", "type": "tf", "answer": false, "explain": "Anyone can read the page's source, password included, and a browser has no `require` or MySQL driver. The page sends HTTP requests; the Node server holds the login and runs the queries." },
  { "q": "How does a Node `http` server get a POST body that arrives in pieces?", "options": ["Add each `data` chunk to a string and use the whole body in the `end` handler", "Read `req.url`", "Use the first `data` chunk only", "Read the status code"], "answer": 0, "explain": "The body is a stream: `req.on(\"data\", …)` may fire several times, and `req.on(\"end\", …)` fires once all of it has arrived." },
  { "q": "A page on port 3000 sends POSTs to an API on port 8000. Which one makes the browser send an OPTIONS preflight first?", "options": ["Content-Type: application/json", "Content-Type: text/plain", "Content-Type: application/x-www-form-urlencoded", "Content-Type: multipart/form-data"], "answer": 0, "explain": "`application/json` is not one of the three simple content types, so the browser asks first with OPTIONS. The other three skip the preflight." },
  { "q": "Which response header names the origins whose scripts may read the reply?", "options": ["Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Content-Type", "Content-Length"], "answer": 0, "explain": "`Access-Control-Allow-Origin` (`*` = every origin). Allow-Methods lists the methods a preflight may approve." },
  { "q": "The read endpoint runs whatever SQL the text area sends. Which statement does it exist for?", "options": ["SELECT", "INSERT", "UPDATE", "DELETE"], "answer": 0, "explain": "SELECT reads rows; INSERT, UPDATE and DELETE change them, and the SELECT-only user cannot run them." },
  { "q": "Put the Node steps in order.", "type": "reorder", "lang": "js", "lines": ["const mysql = require(\"mysql\");", "const con = mysql.createConnection({ host, user, password, database });", "con.connect(function (err) { if (err) throw err; });", "con.query(sql, function (err, result) { if (err) throw err; });"], "explain": "Load the module, create the mysql object, connect, then run the SQL statement." },
  { "q": "Match each CRUD operation with its SQL and method.", "type": "match", "pairs": [["Create", "INSERT, sent by POST"], ["Read", "SELECT, sent by GET"], ["Update", "UPDATE, sent by PUT or PATCH"], ["Delete", "DELETE, sent by DELETE"]], "explain": "The standard mapping. Lab 5 uses the first two: POST inserts the rows, GET carries a SELECT." },
  { "type": "free", "q": "An API has an insert endpoint and a read endpoint that runs SQL typed by visitors. Explain how the principle of least privilege protects the table.", "model": "Give each DB user only the privileges its job needs. The insert path connects as a user with CREATE and INSERT; the read path connects as a user with SELECT only. If a visitor sends DROP or DELETE to the read endpoint, MySQL itself refuses it (command denied), whatever the JavaScript does. The login details stay in the Node server, never in the page.", "points": ["one DB user per job", "the read user has SELECT only", "enforced by the database server's privileges, not string filtering", "a DROP, DELETE or UPDATE is refused", "credentials stay on the server"], "rows": 6, "explain": "Lab 5's rule: protection *on the server side* through a read-only user." },
  { "type": "free", "q": "Write the Node statements that connect to a database `bookstore` as `books_writer` and insert one book.", "model": "`const mysql = require(\"mysql\");` `const con = mysql.createConnection({ host: \"localhost\", user: \"books_writer\", password: \"w-secret\", database: \"bookstore\" });` `con.connect(function (err) { if (err) throw err; con.query(\"INSERT INTO books (title, year) VALUES ('The Moon', 1999)\", function (err, result) { if (err) throw err; console.log(result.affectedRows + \" record(s) inserted\"); }); });`", "points": ["require(\"mysql\")", "createConnection with host, user, password, database", "connect with an err check", "query(sql, callback) inside the connect callback", "callback reads (err, result)"], "rows": 7, "explain": "The three steps of `db_books.js` with one row." }
]
```
