# COMP 4537 Lecture 7: "CRUD and Database manipulation": slide text, SQL, tables and figures transcribed from the instructor's deck

Source file: `COMP4537-Lecture7-CRUD and Database manipulation for API development` (74 pages; text layer `D:/BCIT/COMP4537/txt/COMP4537-Lecture7-CRUD and Database manipulation for API development.txt`, rendered pages `D:/BCIT/COMP4537/png/L7/p001.png` … `p074.png`). Transcribed 2026-10-27.
Instructor: Amir Amintabar, PhD. Slide numbers below are PDF pages; the printed slide number in the corner (where one exists) matches the PDF page.

Summary: the deck is a SQL / relational-database primer for building API servers. It opens with a review list of earlier topics (setTimeout order, XHR readyState, Node modules, hosting, DB users and privileges, how Node connects to a DB), defines a database and a DBMS and lists DBMS properties (massive, persistent, safe, user management, multi-user, convenient, efficient, reliable), separates relational (SQL) from NoSQL DBMSs, then designs a patient/visit database by walking from a spreadsheet to two related tables (primary key, foreign key, 1:M). It gives the `CREATE TABLE` / `INSERT` SQL for patient/visit, contrasts a cross product with a join, defines schema vs data, lists popular MySQL data types and the referential integrity constraint. The "Learn SQL by examples" part uses the w3schools-hosted Northwind DB: SELECT, WHERE and its operators, LIKE and wildcards, IN, BETWEEN (with ASCII ordering), ORDER BY, arithmetic and `AS` aliases, two tips (invisible whitespace, ambiguous column names), aggregate functions, GROUP BY, HAVING vs WHERE (four ok/not-ok cases and a three-rule summary), and subqueries. It ends with an M:M authors/books design (associative entity, composite primary key), AUTO_INCREMENT, CHECK constraints with a phpMyAdmin error screenshot, and remarks on case sensitivity.
**There are no slides in this deck on Node.js code connecting to MySQL, sending queries from Node, CRUD via an API, or the principle of least privilege.** The only touch points are the review list on slide 5 ("how to create DB user in a cPannel shared hosting accounts", "giving various privileges to DB user", "How node js connects to DB") and the cPanel "Manage User Privileges" screenshot on slide 13. No Node.js code appears anywhere in the deck except the setTimeout snippet on slide 5.

## Title and outline (slides 1-3)
- **Slide 1** (title, blue background): "Adv Web Dev Arch" / "Lecture 7" / "CRUD and Database manipulation" / "Amir Amintabar, PhD" / "AJAX Calls". [note: "AJAX Calls" is a leftover subtitle from an earlier deck; this lecture is not about AJAX.]
- **Slide 2**, title "**CRUD and Database Manipulation**", subtitle "for APIs development". Body: "SQL Database related knowledge needed for the development of API servers"
- **Slide 3**, "**Outline (Using Relational DB for Building an API server)**":
  - 0- Review
  - Review of SQL stametments (sic)
  - 1- What is a Database?
  - 2- Few definitions
  - 3- Design a DB by example
  - 4- Creating 1:M by example
  - 5- Referential integrity **constraint**
  - **6-** Learn SQL by Example!
    - Query practice examples using the online hosted NorthWind DB
    - https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
    - Where clauses, like operator
  - 7- Sub-queries
  - 8- Creating M:M by example

## 0 Review (slides 4-5)
- **Slide 4**: section divider, green oval "0", "Review".
- **Slide 5**, "**Review**". Bullets, verbatim:
  - setTimeout and order of execution (in what order numbers log?)
  - Various web application architectures, …, their goal …
  - Single or multiple threaded, asynchronous, none-blocking (sic) ..
  - AJAX calls (Asynchronous JavaScript And XML),
  - XMLHttpRequest readyState (0, 1, 2, 3, 4)
  - GET, POST, the difference (data size, url, …)
  - Modules in Nodejs,
  - built in modules such as http, fs ..,
  - installing new modules using NPM install,
  - How to host a node js app,
  - how to create DB user in a cPannel (sic) shared hosting accounts,
    - giving various privileges to DB user,
  - restarting a node js app every time we make changes ( you can install node-mon module on your local PC that automatically restarts the app every time you save changes).
  - How node js connects to DB,
  - how to install mySQL engine locally,
  - how to use DB admin tools such as phpMyAdmin to create DB/ tables and where to run SQL statements, how to backup and restore,
  - Code screenshot (dark editor, top right), with a line from the first bullet pointing to it:
    ```js
    console.log(1);
    setTimeout(function () {
        console.log(2);
    }, 0);
    console.log(3);
    ```
    Q (implied by the bullet): in what order do the numbers log? A: (not on the slide) [note: logs 1, 3, 2.]
  - Callout (from the "GET, POST" / readyState bullets), verbatim:
    "status of the XMLHttpRequest :
    **0** (UNSENT): The XHR object has been created, but open() has not been called yet.
    **1** (OPENED): open() has been called.
    **2** (HEADERS_RECEIVED): send() has been called, and the headers of the response are available.
    **3** (LOADING): The response is being received. As data comes in, the responseText property is updated. **(3(LOADING) code be updated multiple times to this status if the server is sending a large size of response in multiple chunks )** (sic, "code" for "could")
    **4** (DONE): The operation is complete, and either the request has been successfully completed (status code 2xx) or an error occurred."
  - [note: the npm package is spelled `nodemon`.]

## 1 What is a database? (slides 6-8)
- **Slide 6**: section divider, green oval "1", "What is a database?"
- **Slide 7**, "**What is a database?**":
  - Q: So what do you think it is?
  - A: A database is an organized collection of data, stored electronically in a server
  - Typically a computer
  - or computers distributed
  - Or on RAID (redundant array of independent disks to improve robustness or speed etc)
- **Slide 8**, "**Database example**":
  - Lets see one in action ( hosted northWind DB)
  - https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
  - How many tables are there in that DB? A: (not on the slide)
  - Run a couple of queries such as
    ```sql
    SELECT * FROM [Customers]
    SELECT country FROM [Customers]
    SELECT distinct country FROM [Customers]
    SELECT * FROM Products, OrderDetails WHERE
    Products.ProductID=OrderDetails.ProductID AND Quantity>10
    SELECT country, count(CustomerID)
    FROM [Customers]
    group by country
    SELECT * FROM Customers WHERE Country='Mexico';
    ```
    (On the slide each query is its own bullet; the multi-line ones wrap as shown.)

## 2 DBMS (slides 9-14)
- **Slide 9**, "**Database Management System (DBMS)**": "What we just saw was a database, not Database Management System!"
- **Slide 10**: section divider, blue box "DBMS" / "DataBase Management System", green oval "2".
- **Slide 11**, "**What are DBMS?**":
  - "The DBMS manages incoming, outgoing data, organizes it, and provides ways for the data to be modified or extracted by users or other programs"
  - [figure: one rounded blue box listing four lines top to bottom: "Users", "DB engine (MySQL, SQLite, …)", "Database", "Data". No arrows.]
- **Slide 12** (no title, continues DBMS properties):
  - **Massive:**
    - massive data in size! Q: Guess how many terra bytes (sic) of data we need to store entire students data? A: (not on the slide)
  - **Persistent:**
    - data in the database outlives the programs that execute on that data. Program will finish but the data remains on disk
  - **Safe** (data has to stay in consistent state despite hardware failure, malicious attacks, (sic, unclosed parenthesis)
    - run critical applications such as telecommunications and banking systems, have to have guarantees that the data managed by the system
    - will stay in a consistent state, it won't be lost or overwritten when there are failures, and there can be hardware failures.
    - There can be software failures.
    - Even simple power outages. You don't want your bank balance to change because the power went out at your bank branch.
    - And of course there are the problem of malicious users that may try to corrupt data.
- **Slide 13**, "**DBMSs are also**":
  - **User management**
    - You can create DB users and give them privileges
    - [figure: cPanel screenshot "MySQL® Databases" / "Manage User Privileges", "User:" and "Database:" values scribbled out in red. Checked boxes, two columns: "ALL PRIVILEGES"; then ALTER | ALTER ROUTINE; CREATE | CREATE ROUTIN[E] (cut off); CREATE TEMPORARY TABLES | CREATE VIEW; DELETE | DROP; EVENT | EXECUTE; INDEX | INSERT; LOCK TABLES | REFERENCES; SELECT | SHOW VIEW. The screenshot is cropped below SELECT. Every box shown is checked.]
  - **Multi-user**
    - Concurrency control (e.g. at the same time one person can write)
  - **Convenient**
    - High level query languages, declarative language ( you will see why)
  - **Efficient**
    - Performance, No duplication, fast access
  - **Reliable**
    - 99.999 uptime! ( even missing a single bank transaction could create an issue)
- **Slide 14**, "**Relational DBMS could be categorized as**":
  - Relational DBMs (RDBM) using SQL language
  - Non-relational DBMs ( also called NoSQL DBMS)
  - For our APIs, we only focus on Relational DBMs, in this course
  - RDBMS language: SQL
    - SQL: Structured Query Language
  - Examples of RDBMS:
    - MySQL ( focus on this course for our CRUD on APIs)
    - Sqlite (file base, light weigh and runs in browsers such as https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
    - Other examples: Oracle, PostgreSQL, SQL server,

## 3 Design a DB by example: patients and visits (slides 15-22)
- **Slide 15**: section divider "Design a DB by example", green oval "3".
- **Slide 16**, "**How would you keep records of patients' visits to a clinic?**":
  - Try to keep them in sticky notes? Notebooks or Spreadsheet ?
  - For two patients for their clinic visits, create a spreadsheet to keep their records

    | Patient name | Age | Clinic Visit |
    |---|---|---|
    | Sarah Brown | 97 | 01/01/2001 |
    | John Smith | 56 | 08/08/2018 |

  - Now, what if John visited the clinic on another date, 08/01/2019 ? Which one do you keep in the sheet. Or would you add the new one just next to previous one?

    | Patient name | Age | Clinic Visit |
    |---|---|---|
    | Sarah Brown | 97 | 01/01/2001 |
    | John Smith | 56 | 08/08/2018, 09/09/2019, … |

    ("09/09/2019, …" is in red; the cell is outlined in two boxes with lines to a grey callout.)
    [note: the bullet says John's new visit is 08/01/2019, but the table (and every later table) shows 09/09/2019.]
  - Callout: "Storing multiple values in same column is not a good practice! Can you guess why? Aside from reasons you listed, it also violates **1st Normal Form**"
  - What if there were no more room in that Column to add new visit dates?
- **Slide 17**, "**Exercise 2 cont.**":
  - … what if there were no more room in that Column to add new visit dates?
  - What if we add multiple new columns to record additional visits

    | Patient name | Age | Clinic Visit 1 | Clinic Visit 2 | Clinic Visit 3 |
    |---|---|---|---|---|
    | Sarah Brown | 97 | 01/01/2001 | | |
    | John Smith | 56 | 08/08/2018 | 09/09/2019 | 02/02/2020 |

    (The text layer scrambles this table; the image is authoritative.)
  - Sarah is already 97, what if Sarah will never visit the clinic again?
- **Slide 18**, "**Exercise 2 cont.**":
  - Top table, crossed out with a big red hand-drawn X:

    | Patient name | Age | Clinic Visit 1 | Clinic Visit 2 |
    |---|---|---|---|
    | Sarah Brown | 97 | 01/01/2001 | |
    | John Smith | 56 | 08/08/2018 | 09/09/2019 |

  - [figure: a red arrow from the crossed-out table down to the second table, pointing at John Smith's 08/08/2018 row.]
  - Second table:

    | Patient name | Age | Clinic Visit |
    |---|---|---|
    | Sarah Brown | 97 | 01/01/2001 |
    | John Smith | 56 | 08/08/2018 |
    | John Smith | 56 | 09/09/2019 |

    A red ellipse circles the two "John Smith / 56" name-and-age cells.
  - Does this work ? Can it be implemented in an spreadsheet?
  - Do you notice anything wrong with this approach?
    - Exactly! We have to repeat the name and age of patients everytime!
  - Can you suggest a better format for our spreadsheet?
- **Slide 19**, "**Patients visits record-keeping problem with better answer (RDB)**":
  - Or we can simply move to relational databases
  - Have multiple tables that in some way relate to one another
  - Table **Patient**:

    | Patient_ID | Patient name | Age |
    |---|---|---|
    | 1 | Sarah Brown | 97 |
    | 2 | John Smith | 56 |

    Table **Visit**:

    | Patient_ID | Clinic Visit |
    |---|---|
    | 1 | 01/01/2001 |
    | 2 | 08/08/2018 |
    | 2 | 09/09/2019 |

    [figure: red ellipses around the "Patient_ID" header in both tables; a blue callout "Unique to each patient" points at Patient row 1's Patient_ID.]
  - Patient table: one row for each patient
  - Visit table: one row for each visit. A patient might visit multiple times, thus multiple rows in the visit table would be related to that patient
  - Q: We said tables in same relation DB are in some ways related. How these two are related?
  - (A:) Because we have the column Pationt_ID (sic) in both tables, we can relate them based on that value. This is the relational part
- **Slide 20**, "**Patients visits record-keeping Relational DB**":
  - Now lets give each visit in the Visit table a unique number too
  - Table **Patient** (same as slide 19: 1 Sarah Brown 97; 2 John Smith 56). Table **Visit**:

    | Visit_ID | Patient_ID | Clinic Visit |
    |---|---|---|
    | 1 | 1 | 01/01/2001 |
    | 2 | 2 | 08/08/2018 |
    | 3 | 2 | 09/09/2019 |

    [figure: blue callout "Unique to each visit" pointing at the Visit_ID column (dark-shaded).]
  - This setup allows me to answer questions like: Who visited the office yesterday
  - I can simply match the visit record with the patient names with the help of Patient_ID which exists in both tables.
  - Patient_ID in the Patient table is unique and is called Primary key
  - Q: identify primary key in the Visit table?
  - A: Visit_ID
  - Patient_ID in the Visit table is called Foreign key. A primary key of another table presents in this table
  - Q: Did you notice another issue with our database schema? Are you happy with the way we store the Age? Any potential problem you foresee? (the last line is partly cut off at the bottom of the slide) A: (not on the slide) [note: the intended point is that a stored age goes stale; store date of birth instead (slide 72 says the same: "it should be dateOfBirh").]
- **Slide 21**, "**Remarks … DB Terminologies**":
  - [figure: a table

    | CustomerID | CustomerName | Address |
    |---|---|---|
    | 2 | Alexa Alino | 123 Burnaby |
    | 5 | Bob Brown | 256 Surrey |
    | 6 | Clara Cook | 345 Vancouver |
    | 13 | David Dail | 467 RIchmond (sic) |

    Labels: a big dark arrow pointing down into the CustomerName column (column outlined with a dashed blue ellipse) labelled "Field = Attribute = Column = variable"; a dark box top right "Table = Entity = Relation = database object"; a dark arrow from the left pointing at the outlined row "6 Clara Cook 345 Vancouver" labelled "Record = Row = tuple = instance"; a dark callout "A cell" pointing at the red-dashed cell "123 Burnaby".]
  - A table has rows and columns, where rows represents records and columns represent the attributes.
  - Every table is broken up into smaller entities called fields. The fields in the Customers table consist of CustomerID, CustomerName and Address
- **Slide 22**, "**Remarks …**":
  - A field is a column in a table that is designed to maintain specific information about every record in the table.
  - A record, also called a row or tuple, is each individual entry that exists in a table
  - Data values are stored in a Cell
  - "Table Name" is unique ( in a database). You cannot have two tables both named "Patient"

## One to Many relationship (slide 23)
- **Slide 23**, "**One to Many relationship**":
  - One patient can visit multiple times.
  - i.e A single patient ( single row) in the Patient table can relate to multiple rows of the Visit table
  - That means there is a one to Many (1:M) Relationship from Patient to Visit table
  - [figure: Patient table (Patient_ID / Patient name / Age: 1 Sarah Brown 97; 2 John Smith 56) and Visit table (Visit_ID / Patient_ID / Clinic Visit: 1 1 01/01/2001; 2 2 08/08/2018; 3 2 09/09/2019). A purple line from the Patient table ends in a crow's foot touching Visit rows 1 and 2 (the "many" side is Visit).]
  - Similarly one to one relationship means a patient could visit the office "only" once!

## 4 Creating 1:M in SQL (slides 24-27)
- **Slide 24**: section divider "Creating 1:M", oval "4".
- **Slide 25**, "**Try this at phpMyAdmin**". SQL (left side of slide), exactly:
  ```sql
  CREATE TABLE `patient` (
    `patientid` int(11) NOT NULL,
    `name` varchar(100) DEFAULT NULL,
    PRIMARY KEY(patientid)
  );

  CREATE TABLE `visit` (
    `visitid` int(11) NOT NULL,
    `patientid` int(11) NOT NULL,
    `visitDate` date NOT NULL,
    PRIMARY KEY(visitid),
    CONSTRAINT fk_has_patient FOREIGN KEY(patientid)
          REFERENCES patient(patientid)
  );


  INSERT INTO patient VALUES
  (1, 'Sara Brown'),
  (2, 'John Smith'),
  (3, 'Jack Ma');

  INSERT INTO visit VALUES
  (1, 1, '2002-01-01'),
  (2, 2, '2018-08-08'),
  (3, 2, '2019-09-09');
  ```
  [note: this SQL spells the patient "Sara Brown" and has her visit on 2002-01-01, while the spreadsheet tables use "Sarah Brown" and 01/01/2001; the patient table here has no Age column.]
  - [figure: phpMyAdmin designer view: box "patientvisit.patient" with fields "patientid : int(11)" (key icon) and "name : varchar(100)"; box "patientvisit.visit" with fields "visitid : int(11)" (key icon), "# patientid : int(11)", "visitDate : date". A green line joins patient.patientid to visit.patientid.]
  - Screenshot 1 (phpMyAdmin, top right), marked with a red hand-written "a":
    ```text
    Showing rows 0 - 8 (9 total, Query took 0.0005 seconds.
    SELECT * FROM patient, visit

    patientid  name         visitid  patientid  visitDate
    1          Sara Brown   1        1          2002-01-01
    2          John Smith   1        1          2002-01-01
    3          Jack Ma      1        1          2002-01-01
    1          Sara Brown   2        2          2018-08-08
    2          John Smith   2        2          2018-08-08
    3          Jack Ma      2        2          2018-08-08
    1          Sara Brown   3        2          2019-09-09
    2          John Smith   3        2          2019-09-09
    3          Jack Ma      3        2          2019-09-09
    ```
  - Screenshot 2 (phpMyAdmin, bottom right), the WHERE clause underlined in red and a red check mark beside it (labelled "b" on slide 26):
    ```text
    Showing rows 0 - 2 (3 total, Query took 0.0005 seconds.)
    SELECT * FROM patient, visit WHERE patient.patientid = visit.patientid

    patientid  name         visitid  patientid  visitDate
    1          Sara Brown   1        1          2002-01-01
    2          John Smith   2        2          2018-08-08
    2          John Smith   3        2          2019-09-09
    ```
  - Q3: Assume we remove row 1 of Patient table; what would each query generate? A: (not on the slide)
- **Slide 26** (no title):
  - Q1)What's the difference between
  - a)
    ```sql
    SELECT * FROM patient, visit
    ```
  - b)
    ```sql
    SELECT * FROM patient, visit
    where patient.patient_ID = visit. patient_ID
    ```
  - b would generate =>
    patients and their visits
    Note:Jack Ma is not there, why?
    because
    `patient.patient_ID = visit. patient_ID`
    Does not meet for Jack ma
  - Q2: Which one lists patients and each of their visits ( if any)? A: (not stated in words; the slide repeats the two phpMyAdmin screenshots from slide 25, with the red "a" on the 9-row cross product and the red check mark on the 3-row result of b.)
  - [figure: small tables top: Patient (Patient_ID / Patient name: 1 Sarah Brown; 2 John Smith; 3 Jack Ma) and Visit (Visit_ID / Patient_ID / Clinic Visit: 1 1 01/01/2001; 2 2 08/08/2018; 3 2 09/09/2019), purple crow's-foot line Patient → Visit.]
  - [note: the slide's text writes the column as `patient_ID` (and `visit. patient_ID` with a space), but the table created on slide 25 names it `patientid`; the screenshot ran `patient.patientid = visit.patientid`. Query (a) is a cross product (3 × 3 = 9 rows); (b) is an inner join and drops Jack Ma, who has no visits. Listing every patient "with their visits (if any)", including Jack Ma, needs a LEFT JOIN, which this deck does not show.]
- **Slide 27**, "**Schema vs data**":
  - Schema versus data
    - Schema: data model, data types of columns,
      Note: all data entered in rows of the same column must all have same data type
    - data: values stored in columns
  - [figure: a line from "Schema" to this SQL:]
    ```sql
    CREATE TABLE `patient` (
      `patientid` int(11) NOT NULL,
      `name` varchar(100) DEFAULT NULL,
      PRIMARY KEY(patientid)
    );

    ...
    ```
  - [figure: a line from "data" to this SQL:]
    ```sql
    INSERT INTO patient VALUES
    (1, 'Sara Brown'),
    (2, 'John Smith'),
    (3, 'Jack Ma');
    ```

## Popular MySQL data types (slide 28)
- **Slide 28**, "**Popular Datatypes (MySQL)**":

  | Type | Description |
  |---|---|
  | VARCHAR(size) | A VARIABLE length string (can contain letters, numbers, and special characters). The *size* parameter specifies the maximum column length in characters - can be from 0 to 65535 |
  | LONGTEXT | Holds a string with a maximum length of 4,294,967,295 characters |
  | INT(*size*) | Integer number . The *size* parameter specifies the maximum display width (which is 255) |
  | DECIMAL(*size*, *d*) | An exact fixed-point number. The total number of digits is specified in *size*. The number of digits after the decimal point is specified in the *d* parameter. The maximum number for *size* is 65. |
  | DATE | A date. Format: YYYY-MM-DD. The supported range is from '1000-01-01' to '9999-12-31' |

  - There are many more data types. Please refer to the source: https://www.w3schools.com/sql/sql_datatypes.asp
  - [note: the display width in `INT(size)` / `int(11)` does not limit the stored range (INT is always 4 bytes, −2,147,483,648 to 2,147,483,647), and MySQL 8.0.17+ deprecates the display width for integer types. VARCHAR's 65,535 is also shared with the whole row's byte limit, so the real maximum length is lower.]

## 5 Referential integrity constraint (slides 29-30)
- **Slide 29**: section divider "Referential integrity constraint", oval "5".
- **Slide 30**, "**Referential integrity constraint**":
  - Q: What if we delete the second row of patient table?
    ```sql
    DELETE FROM patient
    WHERE patient_ID=2;
    ```
  - A: the 2^nd and 3^rd rows of Visit table would not make sense!
  - Lets try it at phpMyAdmin!
  - [figure: Patient (Patient_ID / Patient name: 1 Sarah Brown; 2 John Smith; 3 Jack Ma) → purple crow's-foot line → Visit (Visit_ID / Patient_ID / Clinic Visit: 1 1 01/01/2001; 2 2 08/08/2018; 3 2 09/09/2019).]
  - [note: with the `fk_has_patient` foreign key from slide 25 (default `ON DELETE RESTRICT`/`NO ACTION`), MySQL refuses this DELETE with error 1451 "Cannot delete or update a parent row: a foreign key constraint fails"; that refusal is what the constraint is for. The column there is `patientid`, not `patient_ID`.]

## 6 Learn SQL by examples (slides 31-32)
- **Slide 31**: section divider "Learn SQL by Examples!", oval "6".
- **Slide 32**, "**SQL Statements(queries)**":
  - open:https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
  - `SELECT * FROM Customers;`
  - This statement selects all the records(all rows, all tuples) in the customers table
    SQL keywords(such as SELECT) are NOT case sensitive (underlined): selEct is the same as SELECT.
    ; is not needed by good practice
  - ```sql
    SELECT * FROM Customers
    WHERE Country='Mexico';
    ```
  - Example 3:
    ```sql
    SELECT * FROM Customers
    WHERE CustomerID=1;
    ```
  - Example:
    `SELECT CustomerName FROM Customers;`
  - Example:
    `SELECT CustomerName FrOM Customers WHERE City="London"`
  - Example:
    `SELECT Country FROM Customers;`
  - Example:
  - `SELECT DISTINCT Country FROM Customers;` ( keep unique rows)
  - [note: "; is not needed by good practice" is garbled; the semicolon is the standard statement terminator and is required to separate several statements in one batch (e.g. in the MySQL console or a phpMyAdmin SQL box). A single statement sent from a client library usually works without it.]

## WHERE clause operators (slides 33-35)
- **Slide 33**: divider "WHERE clause operators" / "BETWEEN" / "LIKE" / "IN".
- **Slide 34**, "**WHERE Clause: Operators in The WHERE Clause**":
  - Q: what does this one do?
    ```sql
    SELECT *
    FROM OrderDetails
    where Quantity>80
    ```
    A: (not on the slide)
  - Q: list the customers who live in the city of Berlin in Germany
    ```sql
    SELECT * FROM Customers
    WHERE Country='Germany'
    AND City='Berlin';
    ```
  - Operator table (the `<>` cell is circled in red):

    | Operator | Description |
    |---|---|
    | = | Equal |
    | > | Greater than |
    | < | Less than |
    | >= | Greater than or equal |
    | <= | Less than or equal |
    | <> | Not equal. **Note:** In some versions of SQL this operator may be written as != |
    | BETWEEN | Between a certain range |
    | LIKE | Search for a pattern |
    | IN | To specify multiple possible values for a column |

- **Slide 35**, "**WHERE Clause: AND, OR and NOT Operators**":
  - Q: What products were ordered for quantity of more than 80?
    ```sql
    SELECT * FROM Products,OrderDetails
    WHERE Products.ProductID = OrderDetails.ProductID
    AND
    OrderDetails.Quantity>80
    ```
  - [figure: `Products.ProductID` and `OrderDetails.ProductID` are each boxed, with two lines to a callout:] "Equal signs makes sure we talk about same product in both tables. ( remember how PationtID (sic) relates two tables in week 1)"

## LIKE, wildcards, IN, BETWEEN (slides 36-39)
- **Slide 36**, "**SQL LIKE Operator**":
  - The LIKE operator is used in a WHERE clause to search for a specified pattern in a column.
  - There are two wildcards often used in conjunction with the LIKE operator:
  - % - The percent sign represents zero, one, or multiple characters
  - _ - The underscore represents a single character
  - Examples:
  - `SELECT * FROM Customers WHERE CustomerName LIKE 'a%'`
  - Finds any CustomerName that start with "a"
  - `SELECT * FROM Customers WHERE CustomerName LIKE '%st%'`
  - Finds any values that has "st" in any position
  - Q: selects all customers with a CustomerName ending with "a" A: (not on the slide) [note: `SELECT * FROM Customers WHERE CustomerName LIKE '%a'`.]
  - Footnote: "**Note:** You learned MS Access in your previous course. MS Access uses an asterisk (*) instead of the percent sign (%), and a question mark (?) instead of the underscore (_). We do not cover MS Access in this course"
- **Slide 37**, "**SQL Wildcard Characters**":
  - A wildcard character is used to substitute one or more characters in a string.
  - Wildcard characters are used with the SQL LIKE operator.
  - The LIKE operator itself is used in a WHERE clause to search for a specified pattern in a column.

    | Symbol | Description | Example |
    |---|---|---|
    | % | Represents zero or more characters | bl% finds bl, black, blue, and blob |
    | _ | Represents a single character | h_t finds hot, hat, and hit |

- **Slide 38**, "**SQL IN (NOT IN) Operator**":
  - allows you to specify multiple values in a WHERE clause.
  - is a shorthand for multiple OR conditions.
  - `SELECT * FROM Customers WHERE Country IN ('Germany', 'France', 'UK');`
  - Boxed (teal):
    ```sql
    Q: what does this query return?
    SELECT * FROM customers
    where country
     in
       (select country from customers
        where country like '__')
    ```
    A: (not on the slide) [note: `'__'` is two underscores, so it matches country names exactly two characters long; in Northwind that is "UK" (and not "USA"), so the query returns the customers whose country is UK.]
- **Slide 39**, "**SQL BETWEEN Operator and sorting alphabetically ( ASCII code)**":
  - The BETWEEN operator selects values within a given range. The values can be numbers, text, or dates.
  - The BETWEEN operator is inclusive: begin and end values are included.
  - Example:
    ```sql
    SELECT * FROM Products
    WHERE Price BETWEEN 10 AND 20;
    ```
  - Example
    ```sql
    SELECT * FROM customers
    where country BETWEEN 'UA' AND 'UZ'
    ```
  - [figure: blue box listing strings in order, top to bottom: 'AAA', 'AB', 'B', .., 'ZA', 'Z…Z', 'a', 'b'.]
  - "Note: if we sort the strings above alphabetically in ascending order , the uppercase ones appear before the lower case ones.
    The reason is their ASCII codes.
    E.g. ASCII code of 'A' is 65
    But ASCII code of 'a' is 97
    ASCII stands for American Standard Code for Information Interchange."
  - [note: uppercase-before-lowercase holds for binary (ASCII/code-point) comparison, as in SQLite (which the w3schools tryit uses) by default. MySQL's default collations (e.g. utf8mb4_0900_ai_ci) are case-insensitive, so there 'a' and 'A' compare equal and 'b' sorts before 'Z'.]

## ORDER BY (slides 40-41)
- **Slide 40**: divider "Order by [column name]".
- **Slide 41**, "**"ORDER BY column" and "ORDER BY column ASC|DESC" Keywords**":
  - Q: What does this query return? `SELECT * FROM [Customers] ORDER BY City` A: (not on the slide) [note: all customers sorted by City ascending; ASC is the default.]
  - Q: What products were ordered for quantity of more than 50? (sort the result in descending order so that the highest ordered product appears at top of result)
  - A:
    ```sql
    SELECT * FROM Products,OrderDetails where Products.ProductID =
    OrderDetails.ProductID AND OrderDetails.Quantity>50 ORDER BY OrderDetails.Quantity
    DESC
    ```

## Arithmetic and AS (slide 42)
- **Slide 42**, "**Arithmetic within SQL clauses**":
  - We can use arithmetic within SQL clauses.
  - Example:
    `SELECT Quantity, Quantity*10 FROM OrderDetails;`
  - Example:
    ```sql
    SELECT *, Quantity*Price FROM Products, OrderDetails WHERE Products.ProductID =
    OrderDetails.ProductID;
    ```
  - Try this one too:
    ```sql
    SELECT *, Quantity*Price AS Total FROM Products, OrderDetails WHERE Products.ProductID =
    OrderDetails.ProductID;
    ```
  - In AS Total, Total is an alias that can be used to name the new column our set result generate

## Tips: whitespace and column names (slides 43-45)
- **Slide 43**: divider "Tips".
- **Slide 44**, "**Tip: beware of whitespaces**":
  - Try this statement (copy it as is and paste it at https://www.w3schools.com/sql/trysql.asp?filename=trysql_op_in )
  - and run it
  - `SELECT Country FROM Customers;`
  - What seems to be wrong here?
  - [figure: browser screenshot at "w3schools.com/sql/trysql.asp?filename=trysql_select_all"; SQL Statement box contains `SELECT Country FROM Customers;`; an alert dialog with red hand-drawn arrows from the dialog text down to each gap between the words:]
    ```text
    www.w3schools.com says
    Error 1: could not prepare statement (1 near
    "SELECTÂ CountryÂ FROMÂ Customers": syntax error)
    OK
    ```
  - The problem is that the above text contains invisible white spaces which are not valid blank spaces. You need to replace them with blank space
  - You can use this link to remove white spaces: https://www.textfixer.com/tools/remove-white-spaces.php
  - [note: the "Â" characters are how a non-breaking space (U+00A0, UTF-8 bytes C2 A0) shows when the bytes are read as Latin-1.]
- **Slide 45**, "**Tip: confusing column names!**":
  - Q1: Try to run this query. What is the problem? How can you fix it?
    ```sql
    SELECT ProductID FROM Products,OrderDetails
    WHERE Products.ProductID = OrderDetails.ProductID
    AND
    OrderDetails.Quantity>80
    ```
    A: (not on the slide) [note: `ProductID` exists in both tables, so the bare name in SELECT is ambiguous; qualify it (`Products.ProductID`).]
  - Q2: Now remove the WHERE clause and again run the query. What do you get? Why? How can you fix it? A: (not on the slide)
  - Q3: what will this query return?
    `SELECT * FROM Shippers, employees;` A: (not on the slide) [note: the cross product: every Shippers row paired with every Employees row.]

## Aggregate functions (slides 46-47)
- **Slide 46**: divider "SQL functions" / "AVG, SUM, MIN, COUNT, …".
- **Slide 47**, "**SQL MIN(), MAX(), SUM, COUNT() Functions**":
  - Q: How much is the most expensive product ?
    A: `SELECT MAX(price) FROM products`
  - *SUM*(): returns the total sum of a numeric column
  - **Q:** what is the total quantity of all products ordered combined?
  - **A**: `SELECT SUM(Quantity) FROM OrderDetails;`
  - Q: What is the total quantity of all goods shipped in all orders (use OrderDetails table)
  - A: `SELECT SUM(Quantity) FROM [OrderDetails]`
  - COUNT(), counts the number of rows in a table
  - Try `SELECT country FROM [Customers]`
  - Observe `SELECT count( country) FROM [Customers]`
  - **Q:** How many different countries are there in the table Customers ?
  - A: use count on `SELECT distinct country FROM [Customers]`
  - `SELECT count( distinct country) FROM [Customers]`
  - [note: `COUNT(column)` counts the non-NULL values in that column; `COUNT(*)` counts rows.]

## GROUP BY (slides 48-52)
- **Slide 48**: divider "Grouping on the result set …".
- **Slide 49**, "**GROUP BY Statement**":
  - The GROUP BY statement groups rows that have the same values into summary rows, like "find the number of customers in each country".
  - The GROUP BY statement is often used with aggregate functions (COUNT, MAX, MIN, SUM, AVG) to group the result-set by one or more columns.
  - Example:
    ```sql
    SELECT COUNT(CustomerID), Country
    FROM Customers
    GROUP BY Country;
    ```
  - [figure: callout "We count number of customerIDs that are in the group of same country" with lines to `COUNT(CustomerID)` and to `Country;`.]
  - Q: What does the above query return? A: (not on the slide)
  - Q: What if you remove " GROUP BY Country "? A: (not on the slide)
  - Source: w3school.com
- **Slide 50**, "**GROUP BY examples 1**":
  - Q: Write a query to return number of orders by each city
  - A:
    ```sql
    SELECT City,COUNT(orderID)  FROM [Orders], customers where
    Orders.CustomerID=customers.CustomerID GROUP BY city
    ```
  - Q: How can we verify the answer? A: (not on the slide)
- **Slide 51**, "**GROUP BY examples 2**":
  - Q: Write a query statement to list the number of customers in each country, sorted high to low
    ```sql
    SELECT COUNT(CustomerID), Country
    FROM Customers
    GROUP BY Country
    ORDER BY COUNT(CustomerID) DESC;
    ```
  - Q: Write the same query about for only the countries whose name starts with A:
    ```sql
    SELECT  Country,COUNT(CustomerID)
    FROM Customers
    GROUP BY Country
    where country like "A%"
    ```
    "Wait! "Where" does not work here!" (in red)
- **Slide 52**, "**GROUP BY examples 3**":
  - Q: Write a query statement to count the cities of each country in the northWind DB at https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all
    ```sql
    SELECT Country, COUNT(City)
    FROM Customers
    GROUP BY Country
    ORDER BY COUNT(City) DESC;
    ```
  - [figure: `COUNT(City)` in the SELECT line and `COUNT(City) DESC` in ORDER BY are each circled; a callout "Did we need Distinct?" points at the first; thin lines run from both circles down to `nofCities` in the second query and from `GROUP BY Country` to it.] Q: Did we need Distinct? A: (not on the slide) [note: yes, to count distinct cities. `COUNT(City)` counts customers that have a city, so two customers in the same city count twice; `COUNT(DISTINCT City)` counts the cities.]
  - Q: Can we make that query about a bit shorter and nicer?
  - ( yes we can use alias)
    ```sql
    SELECT COUNT(City) as nofCities, Country
    FROM Customers
    GROUP BY Country
    ORDER BY  nofCities  DESC;
    ```

## HAVING vs WHERE (slides 53-60)
- **Slide 53**: divider "The Having clause" / "Made for use with aggerate (sic) functions and after "Group by"".
- **Slide 54**, "**WHERE does not work everyWHERE!**":
  - Why this query does not run (throwes (sic) errors! )
    ```sql
    SELECT  Country,COUNT(CustomerID)
    FROM Customers
    GROUP BY Country
    where country like "A%"
    ```
  - Wait! "Where" does not work here!!! (in red)
  - [figure: two blue callouts, read together: "Where does" (pointer to `where`) + "Not work with aggregate functions or aggregate parameters!" (pointer to `country`).]
- **Slide 55**, "**The SQL HAVING Clause**":
  - Statement skeleton:
    ```text
    Select A1,A2,A3
    From T1,T2, T3
    Where condition
    Group bY columns
    Having conditions
    ```
  - [figure: a line from "A1,A2,A3" to a blue box: "**Aggregation functions** over values in multiple rows: min, max, sum, avg, count".]
  - Note: The GROUP BY statement is often used with aggregate functions (COUNT, MAX, MIN, SUM, AVG) to group the result-set by one "or more columns".
  - The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.
    So HAVING is like "WHERE" when we use GROUP BY(aggregated functions)!
- **Slide 56**, "**The SQL HAVING Clause**":
  - The HAVING clause was added to SQL because the WHERE clause could not be used with aggregate functions or after group by was performed.
  - Example
  - Write a query that lists the number of customers in each country.
    ```sql
    SELECT COUNT(CustomerID), Country
    FROM Customers
    GROUP BY Country
    ```
  - Now  Only include countries with more than 10 customers:
  - (add this to last line)
  - `HAVING COUNT(CustomerID) > 10;`
  - ```sql
    SELECT Country,COUNT(CustomerID)
    FROM Customers
    where country like "A%"
    GROUP BY Country
    ```
  - Its ok! "Where" is used before "Group by" and is not used on aggregate functions
  - [figure: w3schools screenshot: alert "www.w3schools.com says" / "Error 1: could not prepare statement (1 misuse of aggregate: count())" (underlined in red); a red arrow points at the `where` line of the SQL Statement box:]
    ```sql
    SELECT Country,COUNT(CustomerID)
    FROM Customers
    where count(CustomerID )
    GROUP BY Country
    ```
    ```text
    Error 1: could not prepare statement (1 misuse of aggregate: count())
    ```
- **Slide 57**, "**"WHERE" does not work everyWHERE! (part 2)**":
  - Left code, where `where` is struck through in red and "HAVING" hand-written over it in blue:
    ```sql
    SELECT Country,COUNT(CustomerID)
    FROM Customers
    GROUP BY Country
    where country like "A%"
    ```
    (corrected by hand to `HAVING country like "A%"`)
  - [figure: blue arrow pointing right, labelled "Or place Where before Group by", to:]
    ```sql
    SELECT Country,COUNT(CustomerID)
    FROM Customers
    where country like "A%"
    GROUP BY Country
    ```
  - Q:List countries with more than 2 customers
    ```sql
    SELECT Country,COUNT(CustomerID) as c
    FROM Customers
    GROUP BY Country
    where c>2
    ```
    (`where` struck through in red, "HAVING" hand-written in blue: `HAVING c>2`)
  - Note box: "Note! 1) The "where" has to go before the "having" and the group by 2) "where" cannot be used on aggregate functions"
- **Slide 58**, "**"WHERE" does not work everyWHERE!**":
  - ```sql
    SELECT  Country, COUNT(CustomerID)
    FROM Customers
    GROUP BY Country
    where CustomerName like "A%"
    ```
    Not ok! Where cannot be used after we grouped rows (red)
  - ```sql
    SELECT  Country, COUNT(CustomerID)
    FROM Customers
    where CustomerName like "A%"
    GROUP BY Country
    ```
    Is ok! Where is used before we group rows (green "Is ok!")
- **Slide 59**, "**"WHERE" does not work everyWHERE!**" (the four numbered cases):
  1. ```sql
     SELECT  Country, COUNT(CustomerID)
     FROM Customers
     where COUNT(CustomerID) >2
     GROUP BY Country
     ```
     (the `where` line is struck through) "Not ok! Where cannot be used on aggerate (sic) functions"
  2. ```sql
     SELECT Country,COUNT(CustomerID) as c
     FROM Customers
     where c>2
     GROUP BY Country
     ```
     (the `where` line is struck through) "Not ok! Where cannot be used on aggerate functions (place having c>2 after "group by "" (sic, unclosed)
  3. ```sql
     SELECT Country,COUNT(CustomerID) as c
     FROM Customers
     having c>2
     GROUP BY Country
     ```
     (the `having` line is struck through) "Not ok! Having cannot be used before we have grouped the rows!"
  4. ```sql
     SELECT Country,COUNT(CustomerID) as c
     FROM Customers
     GROUP BY Country
     having c>2
     ```
     "Its ok! Having is used after we have grouped the rows!" (green)
- **Slide 60**, "**Summary of rules of using "having" and "where"**":
  - "*Note*!
    1) The "where" has to go before the "having" and the group by
    2) "where" cannot be used on aggregate functions
    3) "having" has to be used only after we used "group by" (having does not make sense if we have not grouped rows yet."
  - [note: rule 3 is the course's rule. Standard SQL and MySQL do accept HAVING without GROUP BY (the whole result is then one group, e.g. `SELECT COUNT(*) FROM Customers HAVING COUNT(*) > 10`); what is never allowed is writing HAVING before GROUP BY, as in case 3.]

## 7 Subqueries (slides 61-64)
- **Slide 61**: divider "Sub-queries", oval "7".
- **Slide 62**, "**Subquery**":
  - Remember what we said about the closure of SQL where the result of each SQL query is again another table.
  - That means we can run a query on table A and B which results in generating table T and run another query on Table T and C
  - Example
    `SELECT * FROM (SELECT * FROM Products)`
  - Or
    `SELECT * FROM (SELECT * FROM Products where price > 10)`
  - [note: these run in SQLite (w3schools). MySQL requires every derived table in FROM to have an alias, e.g. `SELECT * FROM (SELECT * FROM Products) AS p`; without one it raises error 1248 "Every derived table must have its own alias".]
- **Slide 63**, "**Subqueries, Example 1**":
  - Q: Write a query to return products whose price is more than the average price of all products
  - Step 1: get the average price
    `Select avg(price) from products`
  - The result will be a number, 28.86, ( which is actually table with only one cell)
  - Step 2: Now we want to see which one of those products has price greater than 28.86:
    `SELECT * FROM [Products] where price > 28.86`
  - Step 3: putting all together
  - Replace 28.86 with the query from Step 1, but put it in brackets:
    ```sql
    SELECT * FROM [Products] where price >
    (Select avg(price) from products)
    ```
  - [figure: dotted box around `(Select avg(price) from products)` with a blue arrow up to `28.86` in the Step 2 query.]
- **Slide 64**, "**Subqueries Example 3:**" (there is no Example 2 in the deck):
  - Q: List the most expensive product(s).
  - A: We need the products' names and the prices. The table Products has both we need.
  - Note: it is very important to know that we cannot assume there is only one product with the highest price. The products may be like this

    | Product name | | Price |
    |---|---|---|
    | Milk | … | 2 |
    | Jeans | … | 10 |
    | Shirt | … | 10 |

  - Therefore the answer is
    ```sql
    SELECT * FROM [Products]
    where price = ( select max (price) from products)
    ```

## 8 Creating M:M (slides 65-70)
- **Slide 65**: divider "Creating M:M" / "by example", oval "8".
- **Slide 66**, "**Q: Design an RDBM to model the relationship between books and their authors:**":
  - Sarah Brown authored "The Moon"
  - Sarah Brown and John Smith co-authored "The Earth"
  - John Smith authored "The Sun"
  - Table **Author**:

    | Author_ID | Author name |
    |---|---|
    | 1 | Sarah Brown |
    | 2 | John Smith |

    Table **AuthorBook**:

    | Author_ID | Book_ID |
    |---|---|
    | 1 | 1 |
    | 1 | 2 |
    | 2 | 2 |
    | 2 | 3 |

    (an empty fifth row is drawn at the bottom)

    Table **Book**:

    | Book_ID | Title |
    |---|---|
    | 1 | The Moon |
    | 2 | The Earth |
    | 3 | The sun |

  - [figure: blue lines from Author row 1 (Sarah Brown) to AuthorBook rows (1,1) and (1,2). Red lines from Book rows to AuthorBook rows: Book 1 → (1,1); Book 2 → (1,2) and (2,2); Book 3 → (2,3).]
  - Q: What type of relationship between Autor (sic) and AuthorBook?
    Q: What type of relationship between Book and AuthorBook?
  - A: 1:M and 1:M
- **Slide 67**, "**M:M sample in SQL**", exactly:
  ```sql
  CREATE TABLE author (
   authorID INTEGER,
   name VARCHAR( 50),
   PRIMARY KEY(authorID)
  );
  CREATE TABLE book (
   bookID INTEGER,
   title VARCHAR( 30) NOT NULL,
   PRIMARY KEY(bookID)
  );
  CREATE TABLE authorBook (
   authorID INTEGER,
   bookID INTEGER,
   PRIMARY KEY( authorID, bookID),
   CONSTRAINT fk_has_author FOREIGN KEY( authorID) REFERENCES author( authorID),
   CONSTRAINT fk_has_book FOREIGN KEY( bookID) REFERENCES book( bookID)
   );
  ```
  - [figure: callout "What kind of primary key is this?! $!!#%" points at `PRIMARY KEY( authorID, bookID),`; second callout below it: "Its **composite** primary key / **Q**: why there are two foreign keys here?" A: (not on the slide) [note: one foreign key per parent table: authorID points to author, bookID points to book.]]
- **Slide 68**, "**associative entity**":
  - The table authorBook which links the other two tables is referred as *associative entity* or *associative table*
  - [figure: phpMyAdmin designer: box "authorbooksimple.book" (bookID : int(11) key icon; title : varchar(30)); box "authorbooksimple.authorbook" (authorID : int(11) key icon; bookID : int(11) key icon); box "authorbooksimple.author" (authorID : int(11) key icon; name : varchar(50)). A pink line joins book.bookID to authorbook.bookID; a yellow line joins authorbook.authorID to author.authorID.]
  - Q: Now write SQL queries to insert these data into our database
  - Sarah Brown authored "The Moon"
  - Sarah Brown and John Smith co-authored "The Earth"
  - John Smith authored "The Sun"
  - A: (not on the slide) [note: one possible answer:]
    ```sql
    -- writer's note, not on the slide
    INSERT INTO author VALUES (1, 'Sarah Brown'), (2, 'John Smith');
    INSERT INTO book VALUES (1, 'The Moon'), (2, 'The Earth'), (3, 'The Sun');
    INSERT INTO authorBook VALUES (1, 1), (1, 2), (2, 2), (2, 3);
    ```
- **Slide 69**, "**Same M:M relation, a bit different implementation of associative entity**", exactly:
  ```sql
  CREATE TABLE author (
   authorID INTEGER,
   name VARCHAR( 50),
   PRIMARY KEY(authorID)
  );
  CREATE TABLE book (
   bookID INTEGER,
   title VARCHAR( 30) NOT NULL,
   PRIMARY KEY(bookID)
  );
  CREATE TABLE authorBook (
   authorBookID INTEGER,
   authorID INTEGER,
   bookID INTEGER,
   PRIMARY KEY( authorBookID, authorID),
   CONSTRAINT fk_has_author FOREIGN KEY( authorID) REFERENCES author( authorID),
   CONSTRAINT fk_has_book FOREIGN KEY( bookID) REFERENCES book( bookID)
   );
  ```
  - `authorBookID INTEGER,` and `KEY( authorBookID,` are underlined in blue; a callout "Do we need this?" points at `authorBookID INTEGER,`. A: (not on the slide) [note: not needed: the composite key (authorID, bookID) of slide 67 already identifies each link. With this version's key (authorBookID, authorID), the same author–book pair can be inserted twice under different authorBookIDs.]
  - (The text layer places the slide 70 sentences and the Wikipedia link here too; they are not visible on this page's image.)
- **Slide 70** (no title):
  - The table authorBook which links the other two tables is referred as *associative entity* or *associative table*
  - [figure: phpMyAdmin designer: box "author_book.author" (authorID : int(11) key icon; name : varchar(50)); box "author_book.authorbook" (authorBookID : int(11) key icon; authorID : int(11) key icon; # bookID : int(11)); box "author_book.book" (bookID : int(11) key icon; title : varchar(30)). A green line joins author.authorID to authorbook.authorID; a blue line joins authorbook.bookID to book.bookID.]
  - For more you can also check https://en.wikipedia.org/wiki/Associative_entity

## AUTO_INCREMENT and CHECK (slides 71-73)
- **Slide 71**, "**AUTO INCREMENT Field**":
  - allows a unique number to be generated automatically when a new record is inserted into a table.
  - Often this is the primary key field that we would like to be created automatically every time a new record is inserted.
  - MySQL
    ```sql
    CREATE TABLE Persons (
        Personid int AUTO_INCREMENT,
        LastName varchar(255) NOT NULL,
        PRIMARY KEY (Personid)
    );
    ```
  - Q: Try it in your db using workbench or phpMyAdmin or in console
  - `Insert into Persons (LastName) values ("McDonnald")`
  - Note that we did not have to insert personID, why? A: (not on the slide) [note: because Personid is AUTO_INCREMENT; MySQL assigns the next value (1, 2, 3 …).]
  - Q: can we AUTO_INCREAMENT (sic) non integer fields? A: (not on the slide) [note: in MySQL AUTO_INCREMENT is meant for integer columns; it is also accepted on FLOAT/DOUBLE but that use is deprecated since 8.0.17, and it is not allowed on string or date columns.]
- **Slide 72**, "**CHECK - Ensures that all values in a column satisfies a specific condition**":
  - SQL Server
    ```sql
    CREATE TABLE Persons (
        ID int ,
        LastName varchar(255) NOT NULL,
        Age int CHECK (Age>=18) );
    ```
  - MySQL
    ```sql
    CREATE TABLE Persons (
        ID int ,
        LastName varchar(255) NOT NULL,
        Age int,
        CONSTRAINT age_18 CHECK (Age>=18) );
    ```
  - [figure: callout "What's this? Do we need it?" points at `CONSTRAINT age_18`.] A: (not on the slide) [note: it names the constraint `age_18`, so error messages and `ALTER TABLE … DROP CHECK age_18` can refer to it; without a name MySQL generates one. The unnamed column-level form also works in MySQL 8.0.16+.]
  - Q:Try it in your DB with Workbench or phpMyAdmin
  - Q1: try entering a person with age 5 and see what happens
  - `INSERT INTO Persons (ID, Age) values( 1,5);`
  - Q2: do you see any potential issue with the column Age (aside from the fact that it should be dateOfBirh (sic), what else do you see? (sic, unclosed parenthesis)
  - Tip: has something to do with null
  - Q3: What if we wanted to also ensure the Age<150?
  - A (Q2, Q3): (not on the slide) [note: Q2: Age allows NULL, and a CHECK passes when its condition is NULL (unknown), so a person with no age slips through; add `NOT NULL`. Q3: e.g. `CHECK (Age>=18 AND Age<150)`.]
  - [note: MySQL enforces CHECK only from 8.0.16; earlier versions parsed CHECK and silently ignored it.]
- **Slide 73**, "**CHECK example error**":
  - `INSERT INTO Persons (ID, Age) values( 1,5);`
  - Will result in the error below:
  - [figure: phpMyAdmin screenshot: SQL editor line "1 INSERT INTO Persons (ID, Age) values( 1,5);", buttons "Clear", "Format", "Get auto-saved query", checkbox "Bind parameters", "[ Delimiter ;  ]", checked "Show this query here again"; pink Error panel; an orange hand-drawn arrow points at the error line.]
    ```text
    Error
    SQL query:

    INSERT INTO Persons (ID, Age) values( 1,5)

    MySQL said:
    #4025 - CONSTRAINT `age_18` failed for `amir1`.`persons`
    ```

## Remarks on case sensitivity (slide 74)
- **Slide 74**, "**Remarks**":
  - SQL statements or clauses are NOT case sensitive
  - Table names are NOT case sensitive
  - `SELECT City FROM Customers;` (the E and the t are bold)
  - `SeleCT ciTy frOm cuStoMErs;` (the e and the T are bold)
  - **Keywords** e.g. "ORDER BY"
  - **Operators** e.g. =, <>, OR
  - **Clauses** e.g. WHERE
  - **Statements** e.g. select * from …
  - **Functions** like: min(), max()
  - Operators are used in clauses
  - **Keyword**: SQL reserved words
  - **Identifiers**: Names we choose
  - Constants: Fixed values
  - **Clauses**: Portion of SQL statement
  - [note: "Table names are NOT case sensitive" is true in SQLite (the w3schools tryit) and on MySQL for Windows/macOS, but on MySQL running on Linux (the usual hosting setup) table names map to files and **are** case sensitive by default (`lower_case_table_names=0`). Column names are case-insensitive in MySQL.]

## Facts and numbers index
- Review list, 15 top-level bullets plus 1 sub-bullet (slide 5).
- XHR readyState values 0 UNSENT, 1 OPENED, 2 HEADERS_RECEIVED, 3 LOADING, 4 DONE; 3 can repeat for a chunked large response; DONE covers success (status code 2xx) or an error (slide 5).
- setTimeout snippet logs 1, 2 (after 0 ms) and 3: output order 1, 3, 2 (slide 5; order is my note).
- Database definition: "an organized collection of data, stored electronically in a server"; typically a computer, or computers distributed, or on RAID (slide 7).
- RAID = "redundant array of independent disks to improve robustness or speed etc" (slide 7).
- Northwind DB hosted at https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all (slides 3, 8, 14, 32, 52).
- A DB is not a DBMS (slide 9).
- DBMS definition: manages incoming, outgoing data, organizes it, provides ways for the data to be modified or extracted by users or other programs (slide 11).
- DBMS figure layers: Users, DB engine (MySQL, SQLite, …), Database, Data (slide 11).
- DBMS properties, 8 in slide order: Massive, Persistent, Safe (slide 12); User management, Multi-user, Convenient, Efficient, Reliable (slide 13).
- Persistent: data outlives the programs that execute on it (slide 12).
- Safe: consistent state despite hardware failure, software failure, power outage, malicious users (slide 12).
- Multi-user = concurrency control (slide 13). Convenient = high level, declarative query language (slide 13). Efficient = performance, no duplication, fast access (slide 13).
- Reliable: "99.999 uptime!" (slide 13).
- cPanel privilege list shown: ALL PRIVILEGES, ALTER, ALTER ROUTINE, CREATE, CREATE ROUTINE, CREATE TEMPORARY TABLES, CREATE VIEW, DELETE, DROP, EVENT, EXECUTE, INDEX, INSERT, LOCK TABLES, REFERENCES, SELECT, SHOW VIEW (slide 13).
- Two DBMS categories: Relational (SQL) and Non-relational (NoSQL); the course uses only relational (slide 14).
- SQL = Structured Query Language (slide 14).
- RDBMS examples: MySQL (course focus), Sqlite (file base, runs in browsers), Oracle, PostgreSQL, SQL server (slide 14).
- Storing multiple values in one column violates 1st Normal Form (slide 16).
- Patient spreadsheet rows: Sarah Brown 97 01/01/2001; John Smith 56 08/08/2018, 09/09/2019, (02/02/2020 on slide 17) (slides 16-18).
- Primary key: Patient_ID in Patient (unique); Visit_ID in Visit (slide 20).
- Foreign key: "A primary key of another table presents in this table" (Patient_ID in Visit) (slide 20).
- Terminology equalities: Field = Attribute = Column = variable; Table = Entity = Relation = database object; Record = Row = tuple = instance; data values are stored in a Cell (slides 21-22).
- Table name is unique in a database (slide 22).
- 1:M from Patient to Visit; 1:1 would mean a patient visits only once (slide 23).
- Foreign key constraint name `fk_has_patient`; types `int(11)`, `varchar(100)`, `date` (slide 25).
- Cross product `SELECT * FROM patient, visit` gives 9 rows (3 × 3); with the WHERE join gives 3 rows (slide 25).
- Jack Ma missing from the join because the join condition does not hold for him (slide 26).
- Schema = data model, data types of columns; data = values stored in columns; all rows of one column share one data type (slide 27).
- VARCHAR(size) 0 to 65535; LONGTEXT max 4,294,967,295 characters; INT(size) display width max 255; DECIMAL(size, d) size max 65; DATE format YYYY-MM-DD, range '1000-01-01' to '9999-12-31' (slide 28).
- Referential integrity example: deleting patient 2 leaves Visit rows 2 and 3 meaningless (slide 30).
- SQL keywords are NOT case sensitive (slides 32, 74).
- `DISTINCT` keeps unique rows (slide 32).
- WHERE operators, 9: =, >, <, >=, <=, <> (also != in some versions), BETWEEN, LIKE, IN (slide 34).
- LIKE wildcards, 2: `%` zero, one, or multiple characters; `_` a single character (slides 36-37). Examples: bl% → bl, black, blue, blob; h_t → hot, hat, hit (slide 37).
- MS Access uses `*` for `%` and `?` for `_` (slide 36).
- IN is a shorthand for multiple OR conditions (slide 38).
- BETWEEN is inclusive; values can be numbers, text, or dates (slide 39).
- ASCII 'A' = 65, 'a' = 97; uppercase sorts before lowercase; ASCII = American Standard Code for Information Interchange (slide 39).
- ORDER BY … DESC puts the highest first (slide 41).
- `AS Total`: alias naming a computed column (slide 42).
- Invisible whitespace error: "Error 1: could not prepare statement (1 near "SELECTÂ CountryÂ FROMÂ Customers": syntax error)" (slide 44).
- Aggregate functions named: AVG, SUM, MIN, COUNT (slide 46); MIN, MAX, SUM, COUNT (slide 47); COUNT, MAX, MIN, SUM, AVG (slides 49, 55).
- SUM returns the total of a numeric column; COUNT counts the rows (slide 47).
- Distinct countries: `SELECT count( distinct country) FROM [Customers]` (slide 47).
- GROUP BY groups rows with the same values into summary rows (slide 49).
- HAVING exists because WHERE could not be used with aggregate functions (or after group by) (slides 55-56).
- Clause order skeleton: Select, From, Where, Group bY, Having (slide 55).
- HAVING example threshold: `HAVING COUNT(CustomerID) > 10` (slide 56).
- SQLite error for WHERE on an aggregate: "misuse of aggregate: count()" (slide 56).
- Three rules (slide 60): 1) where before having and group by; 2) where not on aggregate functions; 3) having only after group by.
- Four cases (slide 59): 1 where COUNT() not ok; 2 where on alias c not ok; 3 having before group by not ok; 4 group by then having c>2 ok.
- Subquery closure: the result of each SQL query is again a table (slide 62).
- Average Northwind product price 28.86 (slide 63).
- Most-expensive products: `where price = ( select max (price) from products)` because there can be ties (Jeans 10, Shirt 10) (slide 64).
- M:M is built from two 1:M relationships through AuthorBook (slide 66).
- AuthorBook rows: (1,1), (1,2), (2,2), (2,3) (slide 66).
- Composite primary key `PRIMARY KEY( authorID, bookID)`; constraints `fk_has_author`, `fk_has_book` (slide 67).
- Associative entity = associative table = the linking table (slides 68, 70).
- AUTO_INCREMENT generates a unique number on insert, usually for the primary key (slide 71).
- CHECK: ensures all values in a column satisfy a condition; SQL Server column form vs MySQL named `CONSTRAINT age_18 CHECK (Age>=18)` (slide 72).
- MySQL CHECK failure: "#4025 - CONSTRAINT `age_18` failed for `amir1`.`persons`" (slide 73).
- Remarks: Keyword = SQL reserved words; Identifiers = names we choose; Constants = fixed values; Clauses = portion of SQL statement; operators are used in clauses (slide 74).

## Likely quiz traps
- WHERE must come before GROUP BY; putting `where` after `GROUP BY` fails (slides 51, 54, 58).
- WHERE cannot filter on an aggregate (`where COUNT(CustomerID) >2`) or on an aggregate alias (`where c>2`); use HAVING after GROUP BY (slide 59, cases 1-2).
- HAVING placed before GROUP BY is "Not ok" (slide 59, case 3); only case 4 is ok.
- A WHERE on a plain column before GROUP BY (`where country like "A%"`) is fine (slides 56-58); the problem is position and aggregates, not WHERE itself.
- BETWEEN is inclusive of both ends (slide 39).
- `%` matches zero or more characters (so `bl%` matches "bl" itself); `_` matches exactly one (slides 36-37).
- `<>` is the slide's not-equal; `!=` is the alternative "in some versions of SQL" (slide 34).
- Uppercase strings sort before lowercase ones because 'A' = 65 and 'a' = 97 (slide 39).
- "Most expensive product(s)": `MAX` alone returns only the price; ties mean you must use `price = (select max(price) …)` (slide 64).
- `SELECT * FROM patient, visit` without WHERE returns every combination (9 rows), not patients with their visits (slides 25-26).
- The join drops Jack Ma because he has no visits (slide 26).
- M:M is implemented as two 1:M relationships to an associative table (slide 66: "A: 1:M and 1:M").
- The authorBook key `(authorID, bookID)` is a composite primary key, and the table has two foreign keys (slide 67).
- Primary key of Visit is Visit_ID; Patient_ID in Visit is a foreign key (slide 20).
- Terminology: record = row = tuple = instance; field = attribute = column (slide 21).
- SQL keywords and (per the slide) table names are not case sensitive (slide 74); see the note there about MySQL on Linux.
- A database is not a DBMS (slide 9); the DBMS (e.g. MySQL) is the engine that manages the database.
