---
title: Connecting Node to MySQL with createConnection, connect and query
minutes: 16
---

A server that only echoes is not much use; it needs somewhere to keep data. The last part of the deck connects a Node script to a MySQL database and inserts one row from code.

## CRUD names what a program does with a database (slides 31 and 32)

Slide 31 marks *"Content from this point onward are to be self studied for the next week"*; the Node-to-database part is still in the midterm scope. Slide 32: *"This week we will discuss how to connect node js to a relational DB such as MySQL server"*, to run SQL queries that:

- ***C**reate a table or DB*
- ***R**ead from a DB*
- ***U**pdate records on a DB*
- ***D**elete a record or Drop a table*

*"All of this operation with DB all referred as CRUD in brief"*. *"In this lecture we focus on the node js part mostly assuming writing SQL statement is covered in your term 2 DB course"*. The slide calls the free version "MarinaDB"; the name is MariaDB, a fork of MySQL.

## XAMPP installs the engine and the admin tool (slides 34 to 41)

The local setup is not examined. You need *a DB engine that runs SQL statements* and *a DB administrative tool*; *"XAMPP installs both"*. phpMyAdmin is web based and *"needs PHP engine to run"*, so Apache comes along.

```diagram
{ "type": "flow", "title": "Using XAMPP package installer", "nodes": [ { "id": "mysql", "label": "MySQL / MariaDB", "sub": "DB engine, port 3306", "kind": "cylinder" }, { "id": "xampp", "label": "XAMPP", "sub": "package installer" }, { "id": "apache", "label": "Apache", "sub": "ports 80, 443" }, { "id": "pma", "label": "phpMyAdmin", "sub": "web-based admin tool" } ], "edges": [ { "from": "xampp", "to": "mysql", "label": "installs" }, { "from": "xampp", "to": "apache", "label": "installs" }, { "from": "apache", "to": "pma", "label": "serves" } ], "caption": "XAMPP installs both: the DB engine (mySQL) and the DB admin tool (phpMyAdmin)." }
```

In the XAMPP Control Panel, Admin opens `http://localhost/phpmyadmin/`. Slides 38 and 39 create the database `webdev` and a table:

```sql
CREATE TABLE score (
 scoreID INT AUTO_INCREMENT,
 name VARCHAR (100),
 score INT,
 PRIMARY KEY(scoreID)
);
```

*"It is ok to have column names with the same name as the table name, both are score"*. CREATE TABLE answers *"MySQL returned an empty result set (i.e. zero rows)"*, and slide 41's first SELECT shows one row, `1 John 100`.

## mysql is an external module (slide 43)

*"Turns out, mysql is an external module and needs to be installed"*. Unlike `http`, `url` and `fs`, Node does not ship it. Without it the script stops at its first line:

```text
Error: Cannot find module 'mysql'
```

The fix: *"1 at command prompt switch to the current directory of this file"*, *"2 enter >npm install mysql"*.

```text
> npm install mysql
+ mysql@2.18.1
added 11 packages from 15 contributors and audited 11 packages in 1.094s
found 0 vulnerabilities
```

The `mysql` package is no longer maintained and cannot log in to a MySQL 8 server with its default settings; `mysql2` keeps the same three calls.

## Create a mysql object, connect, run a SQL statement (slide 44)

*"First create a myslq object"*, *"Then connect"*, *"And run a SQL statement"*:

```js pin db_simple.js
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
    let sql = "INSERT INTO score(name, score) values ('elon musk', 2900)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
```

What does the terminal show? `mysql.createConnection` only builds the object from four settings: XAMPP's MySQL is on `host: "localhost"`, user `root` with an empty password, database `webdev`. `con.connect` opens the link and calls back with `err`; `if (err) throw err;` stops the script on a failure. Only inside that callback does `con.query(sql, function (err, result)` send the INSERT. `result` is unused, greyed out on the slide. The `let sql` line runs off the slide after `2900)`; its closing quote and semicolon are filled in.

```text
Connected!
1 record inserted
```

```diagram
{ "type": "flow", "title": "db_simple.js in three steps", "nodes": [ { "id": "req", "label": "require(\"mysql\")" }, { "id": "cc", "label": "mysql.createConnection", "sub": "host, user, password, database" }, { "id": "cn", "label": "con.connect(function (err) ...)" }, { "id": "q", "label": "con.query(sql, function (err, result) ...)" }, { "id": "db", "label": "webdev.score", "kind": "cylinder" } ], "edges": [ { "from": "req", "to": "cc" }, { "from": "cc", "to": "cn" }, { "from": "cn", "to": "q", "label": "Connected!" }, { "from": "q", "to": "db", "label": "INSERT" } ], "hi": ["cc", "cn", "q"], "caption": "First create a myslq object, then connect, and run a SQL statement." }
```

## elon musk was entered with scoreID 3 (slide 45)

*"elon musk was entered in our table Successfully!"*

```diagram
{ "type": "grid", "title": "score after db_simple.js", "nodes": [ { "id": "h0", "label": "scoreID", "row": 0, "col": 0 }, { "id": "h1", "label": "name", "row": 0, "col": 1 }, { "id": "h2", "label": "score", "row": 0, "col": 2 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "John", "row": 1, "col": 1 }, { "id": "a2", "label": "100", "row": 1, "col": 2 }, { "id": "b0", "label": "3", "row": 2, "col": 0 }, { "id": "b1", "label": "elon musk", "row": 2, "col": 1 }, { "id": "b2", "label": "2900", "row": 2, "col": 2 } ], "hi": ["b0", "b1", "b2"], "caption": "The score of elon musk was entered in our table Successfully!" }
```

The ids skip 2: `AUTO_INCREMENT` never reuses a number, so a row 2 was inserted and deleted, or an insert failed.

## The login secret stays on the server

The connection code holds the login secret, so it runs in Node on the server, never in the page. Anyone can read a page's JavaScript, and a browser has no `require` and no MySQL driver anyway.

```diagram
{ "type": "flow", "title": "Who talks to whom", "nodes": [ { "id": "browser", "label": "page in the browser", "sub": "no DB secret" }, { "id": "node", "label": "Node server", "sub": "holds the login" }, { "id": "mysql", "label": "MySQL :3306", "kind": "cylinder" } ], "edges": [ { "from": "browser", "to": "node", "label": "HTTP" }, { "from": "node", "to": "mysql", "label": "SQL" } ], "hi": ["node"], "caption": "how to connect node js to a relational DB such as MySQL server" }
```

Slides 46 to 49 put the same pair on a cPanel shared account (Setup Node.js App, MySQL Databases, Terminal) and are not examined. [Lecture 7](#/comp4537-l7/crud-from-node) sends INSERT and SELECT from a page through such a server.

## Wire a clinic's appointment table to Node

A clinic keeps an `appointment` table in a local MySQL schema named `clinic`. Write its Node side with slide 44's three steps.

```quiz
[
  { "q": "Fill in the keys of the connection settings.", "type": "fill", "code": "const con = mysql.createConnection({\n  ___: \"localhost\",\n  ___: \"root\",\n  ___: \"\",\n  ___: \"clinic\"\n});", "answer": ["host", "user", "password", "database"], "explain": "Slide 44's object has four keys in this order: host, user, password, database." },
  { "q": "Order the clinic script's statements.", "type": "reorder", "lang": "js", "lines": ["const mysql = require(\"mysql\");", "const con = mysql.createConnection({ host: \"localhost\", user: \"root\", password: \"\", database: \"clinic\" });", "con.connect(function (err) { if (err) throw err;", "  con.query(\"INSERT INTO appointment(patient, day) values ('Ana', 'Tue')\", function (err, result) { if (err) throw err; }); });"], "explain": "Load the module, create the mysql object, connect, and run the SQL inside the connect callback, once the connection exists." },
  { "q": "The clinic's password is wrong. What does the terminal show?", "options": ["An error thrown from the connect callback, and no \"Connected!\"", "\"Connected!\" and then an error from the query", "\"1 record inserted\" with no row added", "Nothing at all; the script waits forever"], "answer": 0, "explain": "`connect` calls back with `err` set; `if (err) throw err;` throws before the `console.log(\"Connected!\")` line runs, so the query is never sent." },
  { "q": "A new clinic laptop runs the script without `npm install mysql`. What happens?", "options": ["Error: Cannot find module 'mysql' at the require line", "It connects, because mysql is built in", "It connects but the query fails", "Node installs mysql automatically"], "answer": 0, "explain": "Slide 43: *mysql is an external module and needs to be installed*; without it `require(\"mysql\")` throws `Cannot find module 'mysql'`." },
  { "q": "Which of the three steps takes the SQL string?", "options": ["`con.query`", "`mysql.createConnection`", "`con.connect`", "`require`"], "answer": 0, "explain": "Step 3, *run a SQL statement*: `con.query(sql, function (err, result) {…})`. The other calls set up and open the connection." }
]
```

```quiz
[
  { "q": "Which module must be installed with npm before Node can load it?", "options": ["mysql", "http", "path", "events"], "answer": 0, "explain": "Slide 43: mysql is an external module. `http`, `path` and `events` are built into Node." },
  { "q": "Fill in slide 44's three steps.", "type": "fill", "code": "1. create a mysql ___\n2. ___\n3. run a SQL ___", "answer": ["object", "connect", "statement"], "explain": "Slide 44: *First create a myslq object*, *Then connect*, *And run a SQL statement*." },
  { "q": "Putting `mysql.createConnection({ user: \"admin\", password: \"s3cret\" })` inside a page's script tag is a sound way to read the database from the browser.", "type": "tf", "answer": false, "explain": "Anyone can read the page's source, password included, and a browser has no `require` or MySQL driver. Connection code belongs on the Node server." },
  { "q": "What does CRUD's D cover on slide 32?", "options": ["Delete a record or Drop a table", "Delete a record only", "Drop a database only", "Download a table"], "answer": 0, "explain": "Slide 32: *Delete a record or Drop a table*. C is likewise *Create a table or DB*." },
  { "q": "In db_simple.js, where is `con.query` called?", "options": ["Inside the callback passed to `con.connect`", "Before `createConnection`", "Inside `require`", "After the script exits"], "answer": 0, "explain": "The INSERT is sent only after `connect` calls back without an error, so `Connected!` prints before `1 record inserted`." },
  { "q": "After slide 44 runs, the table holds scoreIDs 1 and 3. Why not 2?", "options": ["AUTO_INCREMENT does not reuse an id after a row is deleted or an insert fails", "scoreID counts in steps of 2", "elon musk's score set the id", "PRIMARY KEY skips even numbers"], "answer": 0, "explain": "`AUTO_INCREMENT` hands out the next number every time; a row 2 that was deleted, or a failed insert, leaves a gap." },
  { "q": "`mysql.createConnection({...})` sends the SQL statement to the database.", "type": "tf", "answer": false, "explain": "It only creates the mysql object from the settings (step 1). `con.connect` opens the connection (step 2) and `con.query(sql, …)` sends the statement (step 3)." },
  { "type": "free", "q": "Write the Node code that connects to a local MySQL database `clinic` and inserts one row into `appointment`.", "model": "`const mysql = require(\"mysql\");` `const con = mysql.createConnection({ host: \"localhost\", user: \"root\", password: \"\", database: \"clinic\" });` `con.connect(function (err) { if (err) throw err; con.query(\"INSERT INTO appointment(patient, day) values ('Ana', 'Tue')\", function (err, result) { if (err) throw err; console.log(\"1 record inserted\"); }); });`", "points": ["require(\"mysql\") after npm install mysql", "createConnection with host, user, password, database", "connect with an err check", "query(sql, callback) with (err, result) inside connect", "runs on the Node server, not in the page"], "rows": 7, "explain": "Slide 44's `db_simple.js` with new values." }
]
```
