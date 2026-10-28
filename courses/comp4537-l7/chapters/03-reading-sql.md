---
title: Reading the lecture's SQL
minutes: 18
---

:::exam Writing SQL is not on the midterm
Reading the CREATE TABLE, INSERT and SELECT statements the labs used is; the rest of this page is a reading reference for Quiz 11.
:::

The queries run on the w3schools Northwind database or lesson 1's patient and visit tables; comments say what each returns.

## Slide 8's queries on Northwind

```sql
SELECT * FROM [Customers]                -- every row, every column
SELECT country FROM [Customers]          -- one column, repeats kept
SELECT distinct country FROM [Customers] -- each country once
SELECT * FROM Products, OrderDetails WHERE
Products.ProductID=OrderDetails.ProductID AND Quantity>10   -- order lines over 10, with their product
SELECT country, count(CustomerID)
FROM [Customers]
group by country                         -- one row per country with its customer count
SELECT * FROM Customers WHERE Country='Mexico';
```

Slide 8 asks how many tables the database holds. Worked out: 8 (Categories, Customers, Employees, OrderDetails, Orders, Products, Shippers, Suppliers).

## Cross product against the join (slides 25 and 26)

```text
a) SELECT * FROM patient, visit                      9 rows
patientid  name        visitid  patientid  visitDate
1          Sara Brown  1        1          2002-01-01
2          John Smith  1        1          2002-01-01
3          Jack Ma     1        1          2002-01-01
1          Sara Brown  2        2          2018-08-08
2          John Smith  2        2          2018-08-08
3          Jack Ma     2        2          2018-08-08
1          Sara Brown  3        2          2019-09-09
2          John Smith  3        2          2019-09-09
3          Jack Ma     3        2          2019-09-09

b) SELECT * FROM patient, visit WHERE patient.patientid = visit.patientid    3 rows
1          Sara Brown  1        1          2002-01-01
2          John Smith  2        2          2018-08-08
2          John Smith  3        2          2019-09-09
```

`FROM patient, visit` pairs every patient with every visit: the cross product, 3 × 3 = 9 rows. The WHERE keeps the pairs that belong together. *Note: Jack Ma is not there, why?* Because the condition *Does not meet for Jack ma*: he has no visit. The slide writes `patient.patient_ID = visit. patient_ID`; the screenshot ran `patientid`, and the slide's spelling fails with "Unknown column".

```diagram
{ "type": "grid", "title": "Cross product against the join", "nodes": [ { "id": "h0", "label": "patient row", "row": 0, "col": 0 }, { "id": "h1", "label": "visit row", "row": 0, "col": 1 }, { "id": "a0", "label": "1 Sara Brown", "row": 1, "col": 0 }, { "id": "a1", "label": "visit 1, patient 1", "row": 1, "col": 1 }, { "id": "b0", "label": "2 John Smith", "row": 2, "col": 0 }, { "id": "b1", "label": "visit 1, patient 1", "row": 2, "col": 1 }, { "id": "c0", "label": "3 Jack Ma", "row": 3, "col": 0 }, { "id": "c1", "label": "visit 1, patient 1", "row": 3, "col": 1 }, { "id": "d0", "label": "1 Sara Brown", "row": 4, "col": 0 }, { "id": "d1", "label": "visit 2, patient 2", "row": 4, "col": 1 }, { "id": "e0", "label": "2 John Smith", "row": 5, "col": 0 }, { "id": "e1", "label": "visit 2, patient 2", "row": 5, "col": 1 }, { "id": "f0", "label": "3 Jack Ma", "row": 6, "col": 0 }, { "id": "f1", "label": "visit 2, patient 2", "row": 6, "col": 1 }, { "id": "g0", "label": "1 Sara Brown", "row": 7, "col": 0 }, { "id": "g1", "label": "visit 3, patient 2", "row": 7, "col": 1 }, { "id": "i0", "label": "2 John Smith", "row": 8, "col": 0 }, { "id": "i1", "label": "visit 3, patient 2", "row": 8, "col": 1 }, { "id": "j0", "label": "3 Jack Ma", "row": 9, "col": 0 }, { "id": "j1", "label": "visit 3, patient 2", "row": 9, "col": 1 } ], "hi": ["a0", "a1", "e0", "e1", "i0", "i1"], "caption": "b would generate patients and their visits." }
```

Worked out for slide 25's Q3, removing patient 1: (a) gives 6 rows, (b) John Smith's 2, though `fk_has_patient` refuses that delete. For Q2, (b) lists only patients with visits; Jack Ma needs a LEFT JOIN, not in the deck.

## SELECT, WHERE and DISTINCT (slide 32)

```sql
SELECT * FROM Customers;                                -- all the records (all rows, all tuples)
SELECT * FROM Customers WHERE Country='Mexico';
SELECT * FROM Customers WHERE CustomerID=1;
SELECT CustomerName FROM Customers;
SELECT CustomerName FrOM Customers WHERE City="London"
SELECT Country FROM Customers;
SELECT DISTINCT Country FROM Customers;                 -- keep unique rows
```

*SQL keywords(such as SELECT) are NOT case sensitive: selEct is the same as SELECT.* The semicolon ends a statement; one statement sent alone runs without it.

## WHERE operators (slides 34 and 35)

```diagram
{ "type": "grid", "title": "Operators in The WHERE Clause", "nodes": [ { "id": "h0", "label": "Operator", "row": 0, "col": 0 }, { "id": "h1", "label": "Description", "row": 0, "col": 1 }, { "id": "a0", "label": "= > < >= <=", "row": 1, "col": 0 }, { "id": "a1", "label": "Equal, Greater than, Less than, or equal", "row": 1, "col": 1 }, { "id": "b0", "label": "<>", "row": 2, "col": 0 }, { "id": "b1", "label": "Not equal (!= in some versions of SQL)", "row": 2, "col": 1 }, { "id": "c0", "label": "BETWEEN", "row": 3, "col": 0 }, { "id": "c1", "label": "Between a certain range", "row": 3, "col": 1 }, { "id": "d0", "label": "LIKE", "row": 4, "col": 0 }, { "id": "d1", "label": "Search for a pattern", "row": 4, "col": 1 }, { "id": "e0", "label": "IN", "row": 5, "col": 0 }, { "id": "e1", "label": "To specify multiple possible values for a column", "row": 5, "col": 1 } ], "hi": ["b0", "b1"], "caption": "Not equal. Note: In some versions of SQL this operator may be written as !=" }
```

```sql
SELECT * FROM OrderDetails where Quantity>80           -- worked out: order lines above 80
SELECT * FROM Customers WHERE Country='Germany' AND City='Berlin';
SELECT * FROM Products,OrderDetails
WHERE Products.ProductID = OrderDetails.ProductID AND OrderDetails.Quantity>80
```

On the last query: *Equal signs makes sure we talk about same product in both tables*.

## LIKE, IN and BETWEEN (slides 36 to 39)

*The LIKE operator is used in a WHERE clause to search for a specified pattern in a column.* `%` *represents zero, one, or multiple characters*; `_` *represents a single character*. *bl% finds bl, black, blue, and blob*; *h_t finds hot, hat, and hit*. MS Access writes `*` and `?` instead.

```sql
SELECT * FROM Customers WHERE CustomerName LIKE 'a%'    -- starts with "a"
SELECT * FROM Customers WHERE CustomerName LIKE '%st%'  -- "st" in any position
SELECT * FROM Customers WHERE CustomerName LIKE '%a'    -- worked out: ends with "a"
SELECT * FROM Customers WHERE Country IN ('Germany', 'France', 'UK');
SELECT * FROM customers where country in
  (select country from customers where country like '__')  -- worked out: two-letter countries, so UK
SELECT * FROM Products WHERE Price BETWEEN 10 AND 20;
SELECT * FROM customers where country BETWEEN 'UA' AND 'UZ'
```

IN *is a shorthand for multiple OR conditions*. *The BETWEEN operator is inclusive: begin and end values are included*, for numbers, text or dates.

```diagram
{ "type": "flow", "dir": "tb", "title": "ASCII order", "nodes": [ { "id": "a", "label": "'AAA'", "sub": "'A' = 65" }, { "id": "b", "label": "'AB'" }, { "id": "c", "label": "'B'" }, { "id": "d", "label": "…" }, { "id": "e", "label": "'ZA'" }, { "id": "f", "label": "'Z…Z'" }, { "id": "g", "label": "'a'", "sub": "'a' = 97" }, { "id": "h", "label": "'b'" } ], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" }, { "from": "d", "to": "e" }, { "from": "e", "to": "f" }, { "from": "f", "to": "g" }, { "from": "g", "to": "h" } ], "hi": ["g"], "caption": "If we sort the strings alphabetically in ascending order, the uppercase ones appear before the lower case ones." }
```

ASCII is American Standard Code for Information Interchange. This holds for binary comparison, as in SQLite; MySQL's default collation ignores case.

## ORDER BY, arithmetic and AS (slides 41 and 42)

```sql
SELECT * FROM [Customers] ORDER BY City                 -- worked out: ascending is the default
SELECT * FROM Products,OrderDetails where Products.ProductID =
OrderDetails.ProductID AND OrderDetails.Quantity>50 ORDER BY OrderDetails.Quantity DESC
SELECT Quantity, Quantity*10 FROM OrderDetails;
SELECT *, Quantity*Price AS Total FROM Products, OrderDetails WHERE Products.ProductID =
OrderDetails.ProductID;
```

DESC puts the highest first. *In AS Total, Total is an alias that can be used to name the new column*.

## Two tips (slides 44 and 45)

```text
Error 1: could not prepare statement (1 near "SELECTÂ CountryÂ FROMÂ Customers": syntax error)
```

The text *contains invisible white spaces which are not valid blank spaces*: "Â" is a non-breaking space read as Latin-1. Worked out for slide 45: a bare `ProductID` is ambiguous, being in both tables; write `Products.ProductID`. Dropping the WHERE, or `SELECT * FROM Shippers, employees;`, gives a cross product.

## Aggregates and GROUP BY (slides 46 to 52)

```sql
SELECT MAX(price) FROM products                         -- the most expensive price
SELECT SUM(Quantity) FROM OrderDetails;                 -- total quantity ordered
SELECT count( distinct country) FROM [Customers]        -- how many different countries
SELECT COUNT(CustomerID), Country FROM Customers GROUP BY Country;
SELECT City,COUNT(orderID) FROM [Orders], customers where
Orders.CustomerID=customers.CustomerID GROUP BY city    -- orders per city
SELECT COUNT(City) as nofCities, Country FROM Customers
GROUP BY Country ORDER BY nofCities DESC;
```

*SUM(): returns the total sum of a numeric column*; *COUNT(), counts the number of rows*. `COUNT(column)` skips NULLs; `COUNT(*)` counts rows. *The GROUP BY statement groups rows that have the same values into summary rows*: *We count number of customerIDs that are in the group of same country*. Worked out: one row per country with its count; without GROUP BY, one count for the table. Slide 52's *Did we need Distinct?*, worked out: yes, `COUNT(DISTINCT City)`.

## WHERE before GROUP BY, HAVING after (slides 53 to 60)

*The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions*; *HAVING is like "WHERE" when we use GROUP BY*.

```diagram
{ "type": "flow", "title": "The clause order", "nodes": [ { "id": "s", "label": "Select", "sub": "columns, aggregates" }, { "id": "f", "label": "From", "sub": "tables" }, { "id": "w", "label": "Where", "sub": "row filter, no aggregates" }, { "id": "g", "label": "Group by", "sub": "summary rows" }, { "id": "h", "label": "Having", "sub": "group filter, aggregates allowed" } ], "edges": [ { "from": "s", "to": "f" }, { "from": "f", "to": "w" }, { "from": "w", "to": "g" }, { "from": "g", "to": "h" } ], "hi": ["w", "h"], "caption": "Select A1,A2,A3 / From T1,T2,T3 / Where condition / Group bY columns / Having conditions." }
```

```diagram
{ "type": "flow", "title": "The clause order with ORDER BY", "nodes": [ { "id": "s", "label": "Select" }, { "id": "f", "label": "From" }, { "id": "w", "label": "Where" }, { "id": "g", "label": "Group by" }, { "id": "h", "label": "Having" }, { "id": "o", "label": "Order by", "sub": "last in the slides' examples" } ], "edges": [ { "from": "s", "to": "f" }, { "from": "f", "to": "w" }, { "from": "w", "to": "g" }, { "from": "g", "to": "h" }, { "from": "h", "to": "o" } ], "hi": ["o"], "caption": "Slides 41 and 51 write ORDER BY at the end." }
```

`HAVING COUNT(CustomerID) > 10` keeps countries with more than 10 customers. `where country like "A%"` before GROUP BY: *Its ok!* A WHERE on `count(CustomerID)` fails:

```text
Error 1: could not prepare statement (1 misuse of aggregate: count())
```

```diagram
{ "type": "grid", "title": "The four cases", "nodes": [ { "id": "h0", "label": "case", "row": 0, "col": 0 }, { "id": "h1", "label": "clause", "row": 0, "col": 1 }, { "id": "h2", "label": "verdict", "row": 0, "col": 2 }, { "id": "a0", "label": "1", "row": 1, "col": 0 }, { "id": "a1", "label": "where COUNT(CustomerID) >2, then GROUP BY", "row": 1, "col": 1 }, { "id": "a2", "label": "Not ok", "row": 1, "col": 2 }, { "id": "b0", "label": "2", "row": 2, "col": 0 }, { "id": "b1", "label": "where c>2, then GROUP BY", "row": 2, "col": 1 }, { "id": "b2", "label": "Not ok", "row": 2, "col": 2 }, { "id": "c0", "label": "3", "row": 3, "col": 0 }, { "id": "c1", "label": "having c>2, then GROUP BY", "row": 3, "col": 1 }, { "id": "c2", "label": "Not ok", "row": 3, "col": 2 }, { "id": "d0", "label": "4", "row": 4, "col": 0 }, { "id": "d1", "label": "GROUP BY Country, then having c>2", "row": 4, "col": 1 }, { "id": "d2", "label": "Its ok", "row": 4, "col": 2 } ], "hi": ["d0", "d1", "d2"], "caption": "Its ok! Having is used after we have grouped the rows!" }
```

Slide 60's rules: *1) The "where" has to go before the "having" and the group by 2) "where" cannot be used on aggregate functions 3) "having" has to be used only after we used "group by"*. MySQL accepts HAVING with no GROUP BY (one group); HAVING written before GROUP BY never runs.

### What each clause does to a small table

Each preset is one of the slides' queries; the table after each clause shows where an aggregate in WHERE fails.

```widget
sql-order
{}
```

## Subqueries (slides 62 to 64)

*The result of each SQL query is again another table*, so a query can read another's result. MySQL needs an alias on it: `FROM (SELECT * FROM Products) AS p`.

```sql
SELECT * FROM (SELECT * FROM Products where price > 10)
SELECT * FROM [Products] where price >
(Select avg(price) from products)                       -- avg is 28.86
SELECT * FROM [Products]
where price = ( select max (price) from products)       -- every tie at the top
SELECT name FROM patient WHERE patientid NOT IN
(SELECT patientid FROM visit)                           -- worked out: patients with no visit: Jack Ma
```

```diagram
{ "type": "flow", "title": "A subquery replaces the number", "nodes": [ { "id": "q", "label": "Select avg(price) from products" }, { "id": "n", "label": "28.86", "sub": "a table with only one cell" }, { "id": "w", "label": "where price > 28.86" } ], "edges": [ { "from": "q", "to": "n" }, { "from": "n", "to": "w", "label": "put it in brackets" } ], "hi": ["q"], "caption": "Replace 28.86 with the query from Step 1, but put it in brackets." }
```

Slide 64: with Milk 2, Jeans 10, Shirt 10, two products tie for the top price, so the query compares with `max`.

## Case and names (slide 74)

*SQL statements or clauses are NOT case sensitive*; *Table names are NOT case sensitive*: `SeleCT ciTy frOm cuStoMErs;` equals `SELECT City FROM Customers;`. On Linux, MySQL table names are case sensitive. Keywords are SQL reserved words (`ORDER BY`), identifiers names we choose, constants fixed values, clauses a portion of a statement (`WHERE`). *Operators are used in clauses*; functions include `min()`, `max()`.

```quiz
[
  { "q": "Which clause keeps only the rows that meet a condition, before any grouping?", "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "answer": 0, "explain": "WHERE filters rows. HAVING filters groups after GROUP BY; ORDER BY only sorts." },
  { "q": "Members has m rows and Loans has n rows. How many rows does `SELECT * FROM Members, Loans` return?", "options": ["Always m × n", "m + n", "m, if Loans is empty", "Fewer than m × n when both have a column named memberid"], "answer": 0, "explain": "With no condition every member row is paired with every loan row: m × n. An empty Loans gives 0 rows; shared column names do not filter anything." },
  { "q": "Which statement is a syntax error?", "options": ["`SELECT FROM Books;`", "`SeLeCt * FROM Books;`", "`select title from BOOKS where 2=2;`", "`SELECT * FrOm books`"], "answer": 0, "explain": "SELECT needs a column list before FROM. Keywords in any case are fine (slide 74), and `2=2` is a WHERE that is always true." },
  { "q": "Select every query that returns the loans whose status is late.", "options": ["`select * from LoAns where status = \"late\"`", "`select * from loans where status like \"late\"`", "`select * from loans where 'status' = late`", "`select all from loans where status = \"late\"`"], "answer": [0, 1], "explain": "`=` and a LIKE with no wildcard match the same rows. `'status'` in quotes is a string, not the column, and `late` unquoted is read as a column name. `select all from` has no column list." },
  { "q": "By slide 39's ASCII rule, what does `SELECT * FROM Books WHERE \"b\" <= \"C\";` return?", "options": ["No rows", "Every row", "Books whose title starts with b or C", "Only the primary key"], "answer": 0, "explain": "The WHERE compares two constants: 'b' is 98, 'C' is 67, so the condition is false for every row and nothing returns. Under MySQL's default case-insensitive collation 'b' sorts before 'c' and every row would return." },
  { "q": "Select every query that lists the members who have never borrowed a book.", "options": ["`SELECT name FROM member WHERE memberid NOT IN (SELECT memberid FROM loan)`", "`SELECT name FROM member WHERE memberid IN (SELECT memberid FROM loan)`", "`SELECT name FROM member WHERE memberid IN (SELECT memberid FROM loan GROUP BY memberid HAVING COUNT(*) = 0)`", "`SELECT name FROM member WHERE memberid NOT IN (SELECT memberid FROM loan GROUP BY memberid HAVING COUNT(*) > 0)`"], "answer": [0, 3], "explain": "Both NOT IN forms exclude every member who appears in loan; the GROUP BY version lists the same ids, since every group has at least one row. A group with COUNT(*) = 0 cannot exist, so that IN list is empty." },
  { "q": "Which query returns all columns of the books whose genre is History?", "options": ["`select * from books where genre = 'History'`", "`select * from books where genre is 'History'`", "`select * from books where genre != 'History'`", "`select *.* from books where genre is 'History'`"], "answer": 0, "explain": "`=` compares values. `IS` is for NULL tests (`IS NULL`), `!=` is not equal, and `*.*` is not a column list." },
  { "q": "Per slide 60, \"having\" has to be used only after we used \"group by\".", "type": "tf", "answer": true, "explain": "Rule 3 on slide 60. In fact MySQL accepts HAVING without GROUP BY (the whole result is one group); HAVING written before GROUP BY is what never runs." },
  { "q": "`Price BETWEEN 10 AND 20` leaves out a product priced exactly 20.", "type": "tf", "answer": false, "explain": "Slide 39: *The BETWEEN operator is inclusive: begin and end values are included.*" },
  { "q": "Which of slide 59's four shapes runs?", "options": ["GROUP BY Country, then having c>2", "where c>2, then GROUP BY Country", "having c>2, then GROUP BY Country", "where COUNT(CustomerID) >2, then GROUP BY Country"], "answer": 0, "explain": "Case 4: *Having is used after we have grouped the rows!* WHERE cannot use an aggregate or its alias, and HAVING cannot come before GROUP BY." }
]
```
