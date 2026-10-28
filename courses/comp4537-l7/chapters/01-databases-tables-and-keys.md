---
title: Tables related by primary and foreign keys
minutes: 18
---

An API server needs somewhere to keep its data, find it again and protect it. Slide 2: *SQL Database related knowledge needed for the development of API servers*.

## A database is not a DBMS (slides 3, 7, 9, 11)

Slide 3 runs from definitions, through a database designed by example, to SQL and M:M. *A database is an organized collection of data, stored electronically in a server*: a computer, computers distributed, or RAID (*redundant array of independent disks*). Slide 9: *What we just saw was a database, not Database Management System!*

```diagram
{ "type": "layers", "title": "What a DBMS is", "nodes": [ { "id": "u", "label": "Users" }, { "id": "e", "label": "DB engine (MySQL, SQLite, …)", "parent": "u" }, { "id": "d", "label": "Database", "parent": "e" }, { "id": "x", "label": "Data", "parent": "d" } ], "hi": ["e"], "caption": "The DBMS manages incoming, outgoing data, organizes it, and provides ways for the data to be modified or extracted by users or other programs." }
```

## Eight properties of a DBMS (slides 12 and 13)

1. **Massive**: massive data in size.
2. **Persistent**: *data in the database outlives the programs that execute on that data*.
3. **Safe**: consistent despite failures, power outages and malicious users.
4. **User management**: *You can create DB users and give them privileges* ([the API server uses this](#/comp4537-l7/crud-from-node)).
5. **Multi-user**: concurrency control.
6. **Convenient**: high level, declarative query languages.
7. **Efficient**: performance, no duplication, fast access.
8. **Reliable**: *99.999 uptime!*

## Relational DBMSs speak SQL (slide 14)

DBMSs are relational, using SQL (Structured Query Language), or non-relational, *also called NoSQL*. *For our APIs, we only focus on Relational DBMs*: MySQL for *our CRUD on APIs*, SQLite (file based, runs in browsers), Oracle, PostgreSQL, SQL Server. CRUD is Create, Read, Update, Delete (lecture 5, slide 32).

## A clinic spreadsheet becomes two tables (slides 16 to 19)

```diagram
{ "type": "grid", "title": "Slide 16: John comes back", "nodes": [ { "id": "h0", "label": "Patient name", "row": 0, "col": 0 }, { "id": "h1", "label": "Age", "row": 0, "col": 1 }, { "id": "h2", "label": "Clinic Visit", "row": 0, "col": 2 }, { "id": "a0", "label": "Sarah Brown", "row": 1, "col": 0 }, { "id": "a1", "label": "97", "row": 1, "col": 1 }, { "id": "a2", "label": "01/01/2001", "row": 1, "col": 2 }, { "id": "b0", "label": "John Smith", "row": 2, "col": 0 }, { "id": "b1", "label": "56", "row": 2, "col": 1 }, { "id": "b2", "label": "08/08/2018, 09/09/2019, …", "row": 2, "col": 2 } ], "hi": ["b2"], "caption": "Storing multiple values in same column is not a good practice! … it also violates 1st Normal Form." }
```

Slide 17 adds columns Clinic Visit 1 to 3 (John: 08/08/2018, 09/09/2019, 02/02/2020): *what if Sarah will never visit the clinic again?* Her cells stay empty. Slide 18 tries one row per visit: *We have to repeat the name and age of patients everytime!*

```diagram
{ "type": "flow", "dir": "tb", "title": "From spreadsheet to related tables", "nodes": [ { "id": "a", "label": "one cell, many dates", "sub": "violates 1st Normal Form" }, { "id": "b", "label": "a column per visit", "sub": "empty cells if Sarah never returns" }, { "id": "c", "label": "a row per visit", "sub": "name and age repeated" }, { "id": "d", "label": "Patient + Visit", "sub": "related by Patient_ID" } ], "edges": [ { "from": "a", "to": "b", "label": "no more room" }, { "from": "b", "to": "c", "label": "repeat name and age" }, { "from": "c", "to": "d", "label": "move to a relational DB" } ], "hi": ["d"], "caption": "Have multiple tables that in some way relate to one another." }
```

## Primary key and foreign key (slides 19 and 20)

```diagram
{ "type": "grid", "title": "Patient: one row for each patient", "nodes": [ { "id": "h0", "label": "Patient_ID", "row": 0, "col": 0 }, { "id": "h1", "label": "Patient name", "row": 0, "col": 1 }, { "id": "h2", "label": "Age", "row": 0, "col": 2 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "Sarah Brown", "row": 1, "col": 1 }, { "id": "a2", "label": "97", "row": 1, "col": 2 }, { "id": "b0", "label": "2", "row": 2, "col": 0 }, { "id": "b1", "label": "John Smith", "row": 2, "col": 1 }, { "id": "b2", "label": "56", "row": 2, "col": 2 } ], "hi": ["h0"], "caption": "Unique to each patient: the primary key." }
```

```diagram
{ "type": "grid", "title": "Visit: one row for each visit", "nodes": [ { "id": "h0", "label": "Visit_ID", "row": 0, "col": 0 }, { "id": "h1", "label": "Patient_ID", "row": 0, "col": 1 }, { "id": "h2", "label": "Clinic Visit", "row": 0, "col": 2 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "1", "row": 1, "col": 1 }, { "id": "a2", "label": "01/01/2001", "row": 1, "col": 2 }, { "id": "b0", "label": "2", "row": 2, "col": 0 }, { "id": "b1", "label": "2", "row": 2, "col": 1 }, { "id": "b2", "label": "08/08/2018", "row": 2, "col": 2 }, { "id": "c0", "label": "3", "row": 3, "col": 0 }, { "id": "c1", "label": "2", "row": 3, "col": 1 }, { "id": "c2", "label": "09/09/2019", "row": 3, "col": 2 } ], "hi": ["h1"], "caption": "Patient_ID in the Visit table is called Foreign key." }
```

*Because we have the column Pationt_ID in both tables, we can relate them based on that value. This is the relational part.* *Patient_ID in the Patient table is unique and is called Primary key*; Visit's is Visit_ID. *Patient_ID in the Visit table is called Foreign key. A primary key of another table presents in this table.* Beyond the slide: primary key values are unique and never NULL.

Slide 20 questions storing Age. Worked out: it goes stale; store the date of birth.

## Field, record, table, cell (slides 21 and 22)

```diagram
{ "type": "grid", "title": "Table = Entity = Relation = database object", "nodes": [ { "id": "h0", "label": "CustomerID", "row": 0, "col": 0 }, { "id": "h1", "label": "CustomerName", "row": 0, "col": 1 }, { "id": "h2", "label": "Address", "row": 0, "col": 2 }, { "id": "h3", "label": "", "row": 0, "col": 3 }, { "id": "r10", "label": "2", "row": 1, "col": 0 }, { "id": "r11", "label": "Alexa Alino", "row": 1, "col": 1 }, { "id": "r12", "label": "123 Burnaby", "row": 1, "col": 2 }, { "id": "r13", "label": "← A cell", "row": 1, "col": 3 }, { "id": "r20", "label": "5", "row": 2, "col": 0 }, { "id": "r21", "label": "Bob Brown", "row": 2, "col": 1 }, { "id": "r22", "label": "256 Surrey", "row": 2, "col": 2 }, { "id": "r23", "label": "", "row": 2, "col": 3 }, { "id": "r30", "label": "6", "row": 3, "col": 0 }, { "id": "r31", "label": "Clara Cook", "row": 3, "col": 1 }, { "id": "r32", "label": "345 Vancouver", "row": 3, "col": 2 }, { "id": "r33", "label": "← Record = Row = tuple = instance", "row": 3, "col": 3 }, { "id": "r40", "label": "13", "row": 4, "col": 0 }, { "id": "r41", "label": "David Dail", "row": 4, "col": 1 }, { "id": "r42", "label": "467 Richmond", "row": 4, "col": 2 }, { "id": "r43", "label": "", "row": 4, "col": 3 }, { "id": "r50", "label": "", "row": 5, "col": 0 }, { "id": "r51", "label": "↑ Field = Attribute = Column = variable", "row": 5, "col": 1 }, { "id": "r52", "label": "", "row": 5, "col": 2 }, { "id": "r53", "label": "", "row": 5, "col": 3 } ], "hi": ["h1", "r11", "r21", "r31", "r41"], "caption": "A table has rows and columns, where rows represents records and columns represent the attributes." }
```

Data values are stored in a cell. *"Table Name" is unique ( in a database). You cannot have two tables both named "Patient"*.

## One patient, many visits (slide 23)

One patient row relates to many Visit rows: one to many (1:M). *Similarly one to one relationship means a patient could visit the office "only" once!*

```diagram
{ "type": "flow", "title": "One patient, many visits", "nodes": [ { "id": "patient", "label": "Patient", "sub": "Patient_ID (primary key), name, age" }, { "id": "visit", "label": "Visit", "sub": "Visit_ID (primary key), Patient_ID (foreign key), Clinic Visit" } ], "edges": [ { "from": "patient", "to": "visit", "label": "1 : M through Patient_ID" } ], "hi": ["patient>visit"], "caption": "A single patient in the Patient table can relate to multiple rows of the Visit table." }
```

### Clicking a patient lights its visits

John Smith lights two visits; 1:1 makes his second one invalid. Beyond the slide: `UNIQUE` on the foreign-key column makes the relationship 1:1. On the child's own primary key it changes nothing.

```widget
db-relate
{ "relation": "1:M" }
```

## The 1:M in SQL: schema and data (slides 25 and 27)

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

```diagram
{ "type": "flow", "title": "Slide 25's designer view", "nodes": [ { "id": "patient", "label": "patientvisit.patient", "sub": "patientid, name" }, { "id": "visit", "label": "patientvisit.visit", "sub": "visitid, # patientid, visitDate" } ], "edges": [ { "from": "patient", "to": "visit", "label": "patientid" } ], "hi": ["visit"], "caption": "fk_has_patient joins patient.patientid to visit.patientid." }
```

Slide 27: *Schema: data model, data types of columns* (one type per column); *data: values stored in columns*. CREATE TABLE is schema, INSERT is data. Slide 25's two queries are read in [Reading the lecture's SQL](#/comp4537-l7/reading-sql).

## Popular MySQL data types (slide 28)

```diagram
{ "type": "grid", "title": "Popular Datatypes (MySQL)", "nodes": [ { "id": "h0", "label": "Type", "row": 0, "col": 0 }, { "id": "h1", "label": "Slide 28", "row": 0, "col": 1 }, { "id": "a0", "label": "VARCHAR(size)", "row": 1, "col": 0 }, { "id": "a1", "label": "variable-length string, size 0 to 65535", "row": 1, "col": 1 }, { "id": "b0", "label": "LONGTEXT", "row": 2, "col": 0 }, { "id": "b1", "label": "up to 4,294,967,295 characters", "row": 2, "col": 1 }, { "id": "c0", "label": "INT(size)", "row": 3, "col": 0 }, { "id": "c1", "label": "integer; size = maximum display width (which is 255)", "row": 3, "col": 1 }, { "id": "d0", "label": "DECIMAL(size, d)", "row": 4, "col": 0 }, { "id": "d1", "label": "exact fixed-point; d digits after the point; size max 65", "row": 4, "col": 1 }, { "id": "e0", "label": "DATE", "row": 5, "col": 0 }, { "id": "e1", "label": "YYYY-MM-DD, '1000-01-01' to '9999-12-31'", "row": 5, "col": 1 } ], "caption": "There are many more data types." }
```

The display width does not limit INT's range (always 4 bytes); MySQL 8.0.17 deprecates it.

## Deleting a parent row breaks its children (slide 30)

```sql
DELETE FROM patient
WHERE patient_ID=2;
```

*A: the 2nd and 3rd rows of Visit table would not make sense!* That is the referential integrity constraint. Against slide 25's table the column is `patientid`, and `fk_has_patient` makes MySQL refuse the delete (error 1451).

```diagram
{ "type": "flow", "title": "Deleting patient 2", "nodes": [ { "id": "del", "label": "DELETE patient 2" }, { "id": "p", "label": "Patient row 2", "sub": "John Smith" }, { "id": "v", "label": "Visit rows 2 and 3", "sub": "would not make sense" }, { "id": "n", "label": "with fk_has_patient, MySQL refuses the delete (error 1451)", "kind": "note" } ], "edges": [ { "from": "del", "to": "p" }, { "from": "p", "to": "v", "label": "Patient_ID 2" } ], "hi": ["v"], "caption": "What if we delete the second row of patient table?" }
```

## M:M through an associative table (slides 66 to 70)

Sarah Brown wrote "The Moon", John Smith "The Sun", and both "The Earth". AuthorBook rows (1,1), (1,2), (2,2), (2,3) link Author to Book: *A: 1:M and 1:M*.

```sql
CREATE TABLE authorBook (
 authorID INTEGER,
 bookID INTEGER,
 PRIMARY KEY( authorID, bookID),
 CONSTRAINT fk_has_author FOREIGN KEY( authorID) REFERENCES author( authorID),
 CONSTRAINT fk_has_book FOREIGN KEY( bookID) REFERENCES book( bookID)
 );
```

*Its composite primary key*: two columns together name a row. Worked out: one foreign key per parent table, and the links go in as `INSERT INTO authorBook VALUES (1, 1), (1, 2), (2, 2), (2, 3);`.

```diagram
{ "type": "flow", "title": "M:M through an associative table", "nodes": [ { "id": "a", "label": "Author" }, { "id": "ab", "label": "AuthorBook (authorID, bookID)", "sub": "composite primary key" }, { "id": "b", "label": "Book" } ], "edges": [ { "from": "a", "to": "ab", "label": "1 : M" }, { "from": "b", "to": "ab", "label": "1 : M" } ], "hi": ["ab"], "caption": "The table authorBook which links the other two tables is referred as associative entity or associative table." }
```

```widget
db-relate
{ "relation": "M:M" }
```

Slide 69 keys the table on `PRIMARY KEY( authorBookID, authorID)` and asks *Do we need this?* Worked out: no; with that key the same author and book can be linked twice.

## AUTO_INCREMENT and CHECK (slides 71 to 73)

AUTO_INCREMENT *allows a unique number to be generated automatically when a new record is inserted into a table*; *Often this is the primary key field*.

```sql
CREATE TABLE Persons (
    Personid int AUTO_INCREMENT,
    LastName varchar(255) NOT NULL,
    PRIMARY KEY (Personid)
);
Insert into Persons (LastName) values ("McDonnald")
```

Worked out: MySQL assigns Personid itself; only integer columns take it.

CHECK *Ensures that all values in a column satisfies a specific condition*. SQL Server writes `Age int CHECK (Age>=18)`; MySQL names it:

```sql
CREATE TABLE Persons (
    ID int ,
    LastName varchar(255) NOT NULL,
    Age int,
    CONSTRAINT age_18 CHECK (Age>=18) );
INSERT INTO Persons (ID, Age) values( 1,5);
```

```text
#4025 - CONSTRAINT `age_18` failed for `amir1`.`persons`
```

```diagram
{ "type": "flow", "title": "CHECK rejects a row", "nodes": [ { "id": "i", "label": "INSERT (ID 1, Age 5)" }, { "id": "c", "label": "CHECK (Age>=18)" }, { "id": "e", "label": "#4025 CONSTRAINT age_18 failed" } ], "edges": [ { "from": "i", "to": "c" }, { "from": "c", "to": "e", "label": "5 < 18" } ], "hi": ["e"], "caption": "CHECK ensures that all values in a column satisfies a specific condition." }
```

Worked out: `CONSTRAINT age_18` names the rule; a NULL age passes, so add `NOT NULL`; the upper bound is `CHECK (Age>=18 AND Age<150)`.

```quiz
[
  { "q": "A column declared PRIMARY KEY may hold the same value in two rows as long as neither value is NULL.", "type": "tf", "answer": false, "explain": "A PRIMARY KEY's values are unique and never NULL: no two rows share a key, and no row lacks one." },
  { "q": "What relationship do these two tables have?", "code": "CREATE TABLE Customer (\n  CustomerID int NOT NULL,\n  name varchar(100),\n  PRIMARY KEY (CustomerID)\n);\nCREATE TABLE LoyaltyCard (\n  CardID int NOT NULL,\n  CustomerID int NOT NULL,\n  PRIMARY KEY (CardID),\n  FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),\n  UNIQUE (CardID)\n);", "options": ["1:M from Customer to LoyaltyCard", "1:1", "M:M", "No relationship"], "answer": 0, "explain": "`UNIQUE` sits on `CardID`, the card's own primary key, which is unique already. `CustomerID` in LoyaltyCard can repeat, so one customer can hold many cards: 1:M. `UNIQUE (CustomerID)` would make it 1:1." },
  { "q": "Match each term with its slide 21 equivalents.", "type": "match", "pairs": [["Field", "Attribute = Column = variable"], ["Record", "Row = tuple = instance"], ["Table", "Entity = Relation = database object"], ["Cell", "where a data value is stored"]], "explain": "Slides 21 and 22: Field = Attribute = Column = variable; Record = Row = tuple = instance; Table = Entity = Relation = database object; data values are stored in a Cell." },
  { "q": "In slide 20's Visit table, which column is the primary key?", "options": ["Visit_ID", "Patient_ID", "Clinic Visit", "Patient name"], "answer": 0, "explain": "Slide 20: *Q: identify primary key in the Visit table? A: Visit_ID*. Patient_ID in Visit repeats (John has two visits), so it is the foreign key." },
  { "q": "Patient_ID in the Visit table is a foreign key: a primary key of another table present in this table.", "type": "tf", "answer": true, "explain": "Slide 20: *Patient_ID in the Visit table is called Foreign key. A primary key of another table presents in this table.*" },
  { "q": "How is a many-to-many relationship between authors and books built?", "options": ["Two 1:M relationships to an associative table", "A foreign key in Author pointing to Book", "A foreign key in Book pointing to Author", "Several book IDs stored in one Author cell"], "answer": 0, "explain": "Slide 66: Author to AuthorBook is 1:M and Book to AuthorBook is 1:M. One foreign key in either parent would allow only one partner, and a list in one cell violates 1st Normal Form." },
  { "q": "A table such as authorBook, which links two other tables, is called an ___ entity.", "type": "text", "answer": ["associative", "associative entity"], "explain": "Slides 68 and 70: *associative entity* or *associative table*." },
  { "q": "Which DBMS property does slide 13 gloss as \"99.999 uptime!\"?", "options": ["Reliable", "Persistent", "Safe", "Efficient"], "answer": 0, "explain": "Reliable: *99.999 uptime!* Persistent means the data outlives the programs; Safe means a consistent state despite failures; Efficient means performance, no duplication, fast access." },
  { "q": "A bookstore keeps one row per customer and writes all of a customer's order dates in one cell, separated by commas. What does slide 16 say this violates?", "options": ["1st Normal Form", "The primary key", "The CHECK constraint", "AUTO_INCREMENT"], "answer": 0, "explain": "Slide 16: *Storing multiple values in same column is not a good practice! … it also violates 1st Normal Form*." },
  { "q": "Per slide 30, deleting patient 2 from the Patient table leaves which rows meaningless?", "options": ["Visit rows 2 and 3", "Visit row 1", "Patient rows 1 and 3", "None"], "answer": 0, "explain": "Slide 30: *the 2nd and 3rd rows of Visit table would not make sense!* Both point at Patient_ID 2. With slide 25's `fk_has_patient` in place, MySQL refuses the delete (error 1451)." }
]
```
