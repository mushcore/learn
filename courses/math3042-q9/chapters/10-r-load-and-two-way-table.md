---
title: "Load a CSV and count two columns at once: read.csv and table"
minutes: 6
---
<!-- facts: none; the orders data and the help desk counts are made up for this lesson, and every printed count was tallied by hand and rechecked with Python -->
Part 2 opens before any pile exists. You load a file of raw values and count them. These are the grey dots: the raw data that every later sample is drawn from.

## What you do with it: type two lines, read one table

**This part is all typing in RStudio. Nothing to calculate, and only two function names to remember: `read.csv` and `table`.** Just like opening a spreadsheet and asking for a count: the computer does the counting, and you read the answer off the screen.

| Your question | The answer |
|---|---|
| Do I calculate something? | No. R counts. You read one cell, or add a row in your head. |
| Do I memorize it? | Two names: `read.csv` loads the file, `table` counts. Plus `$`, which picks a column. |
| Is it on paper? | No. This is Part 2 only. |

The recipe has four steps, and each one is one line of R:

```diagram
{"type": "flow", "title": "From a file to a two-way table", "nodes": [{"id": "f", "label": "orders.csv", "sub": "a file of rows"}, {"id": "d", "label": "read.csv", "sub": "a data frame"}, {"id": "h", "label": "head", "sub": "look at 6 rows"}, {"id": "c", "label": "$", "sub": "pick one column"}, {"id": "t", "label": "table(a, b)", "sub": "count pairs"}], "edges": [{"from": "f", "to": "d"}, {"from": "d", "to": "h"}, {"from": "h", "to": "c"}, {"from": "c", "to": "t"}], "hi": ["t"], "caption": "Load, look, pick, count."}
```

## A coffee cart's twelve orders

A coffee cart on campus writes down each order. Each order has a drink and a size. The file `orders.csv` holds twelve orders, one per row:

| row | drink | size |
|---|---|---|
| 1 | latte | small |
| 2 | tea | medium |
| 3 | latte | large |
| 4 | mocha | medium |
| 5 | tea | small |
| 6 | latte | medium |
| 7 | mocha | large |
| 8 | latte | small |
| 9 | tea | large |
| 10 | latte | medium |
| 11 | mocha | small |
| 12 | tea | medium |

- `drink`, the first column: latte, mocha or tea.
- `size`, the second column: small, medium or large.
- 12 rows, one per order.

**Both columns are categorical: each value is a word, not a measurement.** For example, "tea" is a category, while a height in cm is a number.

## read.csv loads the file

**`read.csv` reads a file of comma-separated values and returns a data frame: a table with named columns, one row per line of the file.** Just like opening a spreadsheet: the rows and the column names come in as they were saved.

The file must sit in the working directory, the folder RStudio reads from. Otherwise, give its path inside the quotes.

```r
orders <- read.csv("orders.csv")
head(orders)
```

```text
  drink   size
1 latte  small
2   tea medium
3 latte  large
4 mocha medium
5   tea  small
6 latte medium
```

:::info R syntax
| Code | What it does |
|---|---|
| `orders <- …` | `<-` is assignment: it stores the result under the name `orders`. |
| `read.csv("orders.csv")` | Reads the file named in quotes and returns a data frame. The first line of the file gives the column names. |
| `head(orders)` | Prints the first six rows, so you can check the load worked. |
| `1`, `2`, … in the output | The row numbers R gives each row. They are not part of the data. |

**Left to right**

- `orders <- read.csv("orders.csv")`: "Store under the name orders (`orders <-`) the data frame read (`read.csv`) from the file orders.csv (`"orders.csv"`)."
- `head(orders)`: "Show the first six rows (`head`) of the orders data frame (`orders`)."

**Right to left**, the order R runs it

- `orders <- read.csv("orders.csv")`: "Open the file (`"orders.csv"`), read its rows into a data frame (`read.csv`), then store it under orders (`<-`)."
- `head(orders)`: "Take the data frame (`orders`), cut it to its first six rows (`head`), print them."
:::

**Always run `head` after `read.csv`.** For example, if the column names print as `drink` and `size`, you know the exact names to type next.

## $ picks one column

**`$` pulls one column out of a data frame, by its name.** Just like asking a spreadsheet for the column headed "drink": you get the twelve drinks, in row order.

```r
orders$drink
orders$size
```

:::info R syntax
| Code | What it does |
|---|---|
| `orders$drink` | `$` takes the column named `drink` from the data frame `orders`: a vector of twelve words. |
| `orders$size` | The same for the column named `size`. |

**Left to right**

- `orders$drink`: "From the orders data frame (`orders`), take the column (`$`) named drink (`drink`)."
- `orders$size`: "From orders (`orders`), take the column (`$`) named size (`size`)."

**Right to left**, the order R runs it

- `orders$drink`: "Find the data frame orders, then pull out its drink column (`$drink`)."
- `orders$size`: "Find orders, then pull out its size column (`$size`)."
:::

:::warn The name after $ must match exactly
R is case-sensitive. `orders$Drink` finds no column, because the file says `drink`. Copy the name from the `head` output.
:::

## table(a, b) counts every pair

**`table` with two columns gives a two-way table: one row for each value of the first column, one column for each value of the second, and in each cell the number of rows that have that pair.** Just like a tally sheet with drinks down the side and sizes across the top: each order adds one mark to one box.

```r
table(orders$drink, orders$size)
```

```text
       
        large medium small
  latte     1      2     2
  mocha     1      1     1
  tea       1      2     1
```

:::info R syntax
| Code | What it does |
|---|---|
| `table(orders$drink, orders$size)` | Counts each drink and size pair. The first column given makes the rows, the second makes the columns. |
| `orders$drink`, `orders$size` | The two columns, picked with `$` as above. |

**Left to right**

- `table(orders$drink, orders$size)`: "Count the pairs (`table`) of the drink column (`orders$drink`) down the side and the size column (`orders$size`) across the top."

**Right to left**, the order R runs it

- `table(orders$drink, orders$size)`: "Pull out the drink column (`$drink`) and the size column (`$size`), pair them row by row, count each pair (`table`), print the grid."
:::

The first printed line is blank. It is the space R keeps for the names of the two variables, and these were left unnamed.

The sizes come out as large, medium, small. **R sorts the values alphabetically, not in the order you think of them.** For example, "large" comes before "small" because l comes before s.

## Reading the table: one cell, a row, a column

Here is the same table with its totals added in the margins:

```diagram
{"type": "grid", "title": "Twelve orders, drink by size", "nodes": [{"id": "c00", "label": "", "row": 0, "col": 0}, {"id": "c01", "label": "large", "row": 0, "col": 1}, {"id": "c02", "label": "medium", "row": 0, "col": 2}, {"id": "c03", "label": "small", "row": 0, "col": 3}, {"id": "c04", "label": "row total", "row": 0, "col": 4}, {"id": "c10", "label": "latte", "row": 1, "col": 0}, {"id": "c11", "label": "1", "row": 1, "col": 1}, {"id": "c12", "label": "2", "row": 1, "col": 2}, {"id": "c13", "label": "2", "row": 1, "col": 3}, {"id": "c14", "label": "5", "row": 1, "col": 4}, {"id": "c20", "label": "mocha", "row": 2, "col": 0}, {"id": "c21", "label": "1", "row": 2, "col": 1}, {"id": "c22", "label": "1", "row": 2, "col": 2}, {"id": "c23", "label": "1", "row": 2, "col": 3}, {"id": "c24", "label": "3", "row": 2, "col": 4}, {"id": "c30", "label": "tea", "row": 3, "col": 0}, {"id": "c31", "label": "1", "row": 3, "col": 1}, {"id": "c32", "label": "2", "row": 3, "col": 2}, {"id": "c33", "label": "1", "row": 3, "col": 3}, {"id": "c34", "label": "4", "row": 3, "col": 4}, {"id": "c40", "label": "column total", "row": 4, "col": 0}, {"id": "c41", "label": "3", "row": 4, "col": 1}, {"id": "c42", "label": "5", "row": 4, "col": 2}, {"id": "c43", "label": "4", "row": 4, "col": 3}, {"id": "c44", "label": "12", "row": 4, "col": 4}], "hi": ["c32"], "caption": "The highlighted cell: 2 orders were a medium tea. R prints the inner 3 by 3 block; the totals are added by hand."}
```

**A cell is where a row meets a column.** For example, the latte row meets the small column at 2: two orders were a small latte.

**A row total adds across one row: how many rows of the data have that first value.** For example, the latte row is 1, 2 and 2.

$$\underbrace{1}_{\text{large latte}} + \underbrace{2}_{\text{medium latte}} + \underbrace{2}_{\text{small latte}} = \mathbf{5}$$

Five of the twelve orders were lattes.

**A column total adds down one column.** For example, the medium column is 2, 1 and 2.

$$\underbrace{2}_{\text{medium latte}} + \underbrace{1}_{\text{medium mocha}} + \underbrace{2}_{\text{medium tea}} = \mathbf{5}$$

**All the cells together add to the number of rows in the file.** Here that is 12, one for each order. It is the quickest check that nothing was dropped.

**Swap the two columns and the table turns on its side.** Every count stays the same; only the layout changes.

```r
table(orders$size, orders$drink)
```

:::info R syntax
| Code | What it does |
|---|---|
| `table(orders$size, orders$drink)` | The size column comes first now, so the sizes make the rows and the drinks make the columns. |

**Left to right**

- `table(orders$size, orders$drink)`: "Count the pairs (`table`) of the size column (`orders$size`) down the side and the drink column (`orders$drink`) across the top."

**Right to left**, the order R runs it

- `table(orders$size, orders$drink)`: "Pull out the size column (`$size`) and the drink column (`$drink`), pair them row by row, count each pair (`table`), print the grid."
:::

For example, the small latte count is still 2. It now sits where the small row meets the latte column.

In Part 2 the same two lines run on the quiz's own file. [The Part 2 walkthrough](#/math3042-q9/part2-walkthrough) runs them on the posted data.

## A help desk's tickets

A campus help desk logs each ticket with how it came in and its priority. The data frame is `tickets`, with columns `channel` (email, phone, walk-in) and `priority` (high, low). R counts the pairs and prints this:

```text
         
          high low
  email      4   7
  phone      6   3
  walk-in    2   5
```

```quiz
[
  {"type": "fill", "q": "Load the coffee cart's file into a data frame. Type the function name.", "code": "orders <- ___(\"orders.csv\")", "answer": ["read.csv"], "explain": "`read.csv` reads a comma-separated file and returns a data frame: `orders <- read.csv(\"orders.csv\")`."},
  {"type": "fill", "q": "Print the first six rows to check the load. Type the function name.", "code": "___(orders)", "answer": ["head"], "explain": "`head(orders)` prints the first six rows, so you see the exact column names before you type them."},
  {"type": "fill", "q": "Pick the size column. Type the one symbol that goes in the blank.", "code": "orders___size", "answer": ["$"], "explain": "`$` takes a column out of a data frame by its name: `orders$size`."},
  {"type": "fill", "q": "Count channel by priority for the help desk. Type the function name.", "code": "___(tickets$channel, tickets$priority)", "answer": ["table"], "explain": "`table(a, b)` with two columns gives the two-way table: channels down the side, priorities across the top."},
  {"q": "Which line puts the priorities down the side and the channels across the top?", "options": ["table(tickets$priority, tickets$channel)", "table(tickets$channel, tickets$priority)", "table(tickets$priority)", "head(tickets$priority, tickets$channel)"], "answer": 0, "explain": "The first column given to `table` makes the rows. So `priority` must come first. One column alone gives a one-way count, and `head` does not count at all."},
  {"q": "In the help desk table, how many tickets came in by phone?", "type": "numeric", "answer": 9, "tolerance": 0, "explain": "Add across the phone row: $$\\underbrace{6}_{\\text{phone, high}} + \\underbrace{3}_{\\text{phone, low}} = \\mathbf{9}$$"},
  {"q": "How many tickets were high priority?", "type": "numeric", "answer": 12, "tolerance": 0, "explain": "Add down the high column: $$\\underbrace{4}_{\\text{email}} + \\underbrace{6}_{\\text{phone}} + \\underbrace{2}_{\\text{walk-in}} = \\mathbf{12}$$"},
  {"q": "How many rows does the `tickets` data frame have?", "type": "numeric", "answer": 27, "tolerance": 0, "explain": "Every row adds one to exactly one cell, so the cells add to the number of rows: $$\\underbrace{4 + 7}_{\\text{email}} + \\underbrace{6 + 3}_{\\text{phone}} + \\underbrace{2 + 5}_{\\text{walk-in}} = \\mathbf{27}$$"},
  {"q": "In the help desk table, what does the 7 mean?", "options": ["7 tickets came in by email and were low priority", "7 tickets came in by email", "7 tickets were low priority", "7 is the row number of the first low-priority ticket"], "answer": 0, "explain": "A cell counts one pair: the email row meets the low column. All email tickets is the row total, 4 + 7 = 11. All low tickets is the column total, 7 + 3 + 5 = 15."}
]
```

## Remember

- `read.csv` loads the file into a data frame. The file sits in the working directory.
- `head` shows six rows: check the column names there.
- `df$col` picks one column. The name is case-sensitive.
- `table` with two columns: rows are the values of the first, columns the values of the second, cells count the pairs.
- R sorts the values alphabetically.
- Row totals add across, column totals add down, all cells add to the number of rows.
