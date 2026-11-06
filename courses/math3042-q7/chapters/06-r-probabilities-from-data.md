---
title: "Probabilities from a data frame: P(A), P(A or B), P(A given B), and the printed conclusion"
minutes: 12
---
<!-- facts: none; the examples are a made-up table, the survey data and Lab 5's weather table, with no game context -->
Part 2 asks for a probability by code and then a verdict: are two events mutually exclusive, are they independent? Every one of these is a count of rows divided by a count of rows.

## Count the rows where it is true

An event is a yes-or-no question asked of every row. "Does this student exercise often?" is one event. "Has this student never smoked?" is another.

The chance of an event is the share of rows that answer yes. The chance of "one or the other" is the share of rows that answer yes to at least one. The chance of "this, given that" first throws away every row where "that" is no, then takes the share of the rows left.

## A made-up table of ten students

This table is invented, small enough to see every row. A is "exercises often" and B is "never smoked".

```diagram
{"type": "grid", "title": "Ten students, made up", "nodes": [{"id": "c00", "label": "", "row": 0, "col": 0}, {"id": "c01", "label": "A: exercises often", "row": 0, "col": 1}, {"id": "c02", "label": "not A", "row": 0, "col": 2}, {"id": "c03", "label": "Total", "row": 0, "col": 3}, {"id": "c10", "label": "B: never smoked", "row": 1, "col": 0}, {"id": "c11", "label": "3", "row": 1, "col": 1}, {"id": "c12", "label": "4", "row": 1, "col": 2}, {"id": "c13", "label": "7", "row": 1, "col": 3}, {"id": "c20", "label": "not B", "row": 2, "col": 0}, {"id": "c21", "label": "1", "row": 2, "col": 1}, {"id": "c22", "label": "2", "row": 2, "col": 2}, {"id": "c23", "label": "3", "row": 2, "col": 3}, {"id": "c30", "label": "Total", "row": 3, "col": 0}, {"id": "c31", "label": "4", "row": 3, "col": 1}, {"id": "c32", "label": "6", "row": 3, "col": 2}, {"id": "c33", "label": "10", "row": 3, "col": 3}], "hi": ["c10", "c11", "c12", "c13"], "caption": "For P(A | B) only the lit row counts: 3 of its 7 students exercise often."}
```

Read the three answers off it before any formula. A is true in 4 rows. A or B is true in every row except the 2 in the bottom-right cell, so 8 rows. Inside the B row, A is true in 3 of 7.

## The three formulas with the table's numbers

P(A) is the A rows over all rows:

$$P(A) = \dfrac{4}{10} = \mathbf{0.4000}$$

P(A or B) adds the two events and subtracts the overlap, because the 3 students in both were counted twice:

$$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B) = 0.4 + 0.7 - 0.3 = \mathbf{0.8000}$$

P(A | B) divides the overlap by the B rows only:

$$P(A \mid B) = \dfrac{P(A \text{ and } B)}{P(B)} = \dfrac{3}{7} = \mathbf{0.4286}$$

The trap is P(A or B) = P(A) + P(B). Here that gives 1.1, more than certain.

## The same three fractions on survey

```r
library(MASS)
A <- survey$Exer == "Freq"
B <- survey$Smoke == "Never"
mean(A, na.rm=TRUE)
sum(A, na.rm=TRUE)/sum(!is.na(A))
mean(A | B, na.rm=TRUE)
sum(A & B, na.rm=TRUE)/sum(B, na.rm=TRUE)
mean(survey$Exer[survey$Smoke == "Never"] == "Freq", na.rm=TRUE)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(MASS)` | Loads the package that holds `survey`. |
| `A <- survey$Exer == "Freq"` | `<-` stores a TRUE/FALSE vector, one value per student: TRUE where Exer equals (`==`) Freq. |
| `B <- survey$Smoke == "Never"` | The same for never smoked. NA stays NA. |
| `mean(A, na.rm=TRUE)` | `mean(x, na.rm=TRUE)`: TRUE counts 1, so the mean is the share of TRUE; `na.rm=TRUE` drops the NA values first. |
| `sum(A, na.rm=TRUE)/sum(!is.na(A))` | The same share written as count over count: the TRUEs over the values that are not missing (`!is.na`). |
| `A \| B` | `\|` is OR: TRUE when either is TRUE. |
| `A & B` | `&` is AND: TRUE only when both are TRUE. |
| `sum(A & B, na.rm=TRUE)/sum(B, na.rm=TRUE)` | The students with both, over the students with B. |
| `survey$Exer[survey$Smoke == "Never"]` | `[ ]` with a TRUE/FALSE vector keeps only the rows where it is TRUE: the never-smokers' Exer values. |
| `… == "Freq", na.rm=TRUE)` | Among those rows, the share whose Exer is Freq. |

**Left to right**

- `library(MASS)`: "Load the package (`library`) MASS."
- `A <- …`: "Store under the name A (`A <-`) whether each student's Exer (`survey$Exer`) equals (`==`) Freq."
- `B <- …`: "Store under the name B (`B <-`) whether each student's Smoke (`survey$Smoke`) equals (`==`) Never."
- `mean(A, na.rm=TRUE)`: "The average (`mean`) of A, skipping missing values (`na.rm=TRUE`)."
- `sum(A, na.rm=TRUE)/sum(!is.na(A))`: "The count of TRUE in A (`sum`), skipping NA (`na.rm=TRUE`), divided by (`/`) the count (`sum`) of values that are not (`!`) missing (`is.na`)."
- `mean(A | B, na.rm=TRUE)`: "The average (`mean`) of A or B (`A | B`), skipping NA (`na.rm=TRUE`)."
- `sum(A & B, …)/sum(B, …)`: "The count (`sum`) of A and B (`A & B`) divided by (`/`) the count (`sum`) of B, both skipping NA (`na.rm=TRUE`)."
- `mean(survey$Exer[…] == "Freq", na.rm=TRUE)`: "The average (`mean`) of whether Exer (`survey$Exer`), kept only where (`[ ]`) Smoke equals Never, equals (`==`) Freq, skipping NA (`na.rm=TRUE`)."

**Right to left**, the order R runs it

- `library(MASS)`: "Find MASS and load it (`library`)."
- `A <- …`: "Pull out Exer (`$Exer`), test each value for Freq (`==`), store the result as A (`A <-`)."
- `B <- …`: "Pull out Smoke (`$Smoke`), test each value for Never (`==`), store the result as B (`B <-`)."
- `mean(A, na.rm=TRUE)`: "Drop the NA values in A (`na.rm=TRUE`), then average the rest (`mean`)."
- `sum(A, na.rm=TRUE)/sum(!is.na(A))`: "Count the TRUEs in A (`sum`), count the non-missing values (`is.na`, `!`, `sum`), divide (`/`)."
- `mean(A | B, na.rm=TRUE)`: "Combine A and B row by row with OR (`|`), drop NA (`na.rm=TRUE`), average (`mean`)."
- `sum(A & B, …)/sum(B, …)`: "Combine A and B with AND (`&`), count the TRUEs (`sum`), count the TRUEs in B (`sum`), divide (`/`)."
- `mean(survey$Exer[…] == "Freq", na.rm=TRUE)`: "Test Smoke for Never (`==`), keep Exer on those rows (`[ ]`), test each for Freq (`==`), drop NA (`na.rm=TRUE`), average (`mean`)."
:::

`survey` has NA in several columns. Without `na.rm=TRUE` a single NA makes `mean` and `sum` return NA.

The other way is to filter the NA rows out first, as in [the data moves](#/math3042-q7/r-data-moves), and then every count uses the same rows.

```diagram
{"type": "flow", "title": "P(A | B) in two steps", "nodes": [{"id": "all", "label": "All rows", "sub": "every student"}, {"id": "b", "label": "Keep the B rows", "sub": "B is TRUE"}, {"id": "a", "label": "Share of A in them", "sub": "count of A and B / count of B"}], "edges": [{"from": "all", "to": "b", "label": "restrict"}, {"from": "b", "to": "a", "label": "divide"}], "hi": ["a"], "caption": "Made-up table: 10 rows, then the 7 B rows, then 3 of 7 = 0.4286."}
```

The last two lines are the same idea written twice. One divides the both-rows by the B rows; the other keeps the B rows and takes the share of A inside them.

## Exclusive means no shared rows; independent means B changes nothing

Mutually exclusive means A and B never happen in the same row, so the count of A and B is 0. The made-up table has 3 such rows, so its events are not exclusive.

Independent means knowing B does not change the chance of A:

$$P(A \mid B) = P(A) \quad \text{made-up table: } 0.4286 \text{ against } 0.4000$$

Those differ, so in the made-up table A and B are not independent. The other test gives the same verdict: $P(A)P(B) = 0.4 \times 0.7 = 0.28$, not $0.3$.

Lab 5 first builds a two-way table of weekday by `has.Precip`:

```r
SFU.Weather$DoW <- weekdays(SFU.Weather$Date)
tab1 <- table(SFU.Weather[c("DoW", "has.Precip")])
```

:::info R syntax
| Code | What it does |
|---|---|
| `weekdays(SFU.Weather$Date)` | Gives each row's day name ("Monday", …) from the Date column. It works because `colClasses` read that column as a date. |
| `SFU.Weather$DoW <-` | Stores the day names as a new column, `DoW`. |
| `SFU.Weather[c("DoW", "has.Precip")]` | Single brackets with a vector of names keep just those two columns. |
| `table(…)` | Counts every pair: one row per weekday, one column each for FALSE and TRUE. |
| `tab1 <-` | Stores the table under the name `tab1`. |

**Left to right**

- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Store as the new column DoW (`SFU.Weather$DoW <-`) the day name (`weekdays`) of each date (`SFU.Weather$Date`)."
- `tab1 <- table(SFU.Weather[c("DoW", "has.Precip")])`: "Store as tab1 (`tab1 <-`) the counts (`table`) of the columns DoW and has.Precip (`SFU.Weather[c(…)]`)."

**Right to left**, the order R runs it

- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Take the Date column, turn each date into its day name (`weekdays`), then store the result as DoW (`<-`)."
- `tab1 <- table(SFU.Weather[c("DoW", "has.Precip")])`: "Keep the two columns (`[c(…)]`), count each weekday-and-wet pair (`table`), then store the table as tab1 (`<-`)."
:::

That table is `tab1`, with a row per weekday and a column per value of `has.Precip`.

Lab 5 then asked whether precipitation is more likely on a Monday:

```r
p.Precip <- sum( tab1[ ,"TRUE"] )/ sum(tab1)
p.Precip
p.Precip.Cond.Monday <- tab1["Monday","TRUE"]/sum(tab1["Monday",])
p.Precip.Cond.Monday
```

```text
[1] 0.4878285
[1] 0.4876297
```

:::info R syntax
| Code | What it does |
|---|---|
| `tab1[ ,"TRUE"]` | `[row, column]` on a table; an empty row slot means every row. This is the TRUE column: the wet days of each weekday. |
| `sum( tab1[ ,"TRUE"] )/ sum(tab1)` | All wet days over all days. |
| `tab1["Monday","TRUE"]` | One cell: the wet Mondays. The names are strings, in quotes. |
| `sum(tab1["Monday",])` | The Monday row total: all Mondays. |
| `p.Precip` alone on a line | Prints the stored value. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `p.Precip <- …`: "Store under the name p.Precip (`p.Precip <-`) the total (`sum`) of the TRUE column (`tab1[ ,"TRUE"]`) divided by (`/`) the total of the table (`sum(tab1)`)."
- `p.Precip`: "Print p.Precip."
- `p.Precip.Cond.Monday <- …`: "Store under the name p.Precip.Cond.Monday (`<-`) the wet-Monday cell (`tab1["Monday","TRUE"]`) divided by (`/`) the total (`sum`) of the Monday row (`tab1["Monday",]`)."
- `p.Precip.Cond.Monday`: "Print p.Precip.Cond.Monday."

**Right to left**, the order R runs it

- `p.Precip <- …`: "Pick the TRUE column (`[ ,"TRUE"]`), add it (`sum`), add the whole table (`sum`), divide (`/`), store (`p.Precip <-`)."
- `p.Precip`: "Look up the value and print it."
- `p.Precip.Cond.Monday <- …`: "Pick the Monday row (`["Monday",]`), add it (`sum`), divide the wet-Monday cell by it (`/`), store (`<-`)."
- `p.Precip.Cond.Monday`: "Look up the value and print it."
:::

The two agree to three decimals, so the lab concludes that precipitation is independent of the day being a Monday. Part 2 wants that verdict printed by the code, with the numbers in it:

```r
p.A <- mean(A, na.rm=TRUE)
p.A.given.B <- sum(A & B, na.rm=TRUE)/sum(B, na.rm=TRUE)
if (sum(A & B, na.rm=TRUE) == 0) {
  print("Mutually exclusive")
} else {
  print("Not mutually exclusive")
}
if (abs(p.A.given.B - p.A) < 0.01) {
  print("Independent: P(A|B) is close to P(A)")
} else {
  print("Not independent")
}
print(paste0("P(A) = ", round(p.A, 4), ", P(A|B) = ", round(p.A.given.B, 4)))
```

:::info R syntax
| Code | What it does |
|---|---|
| `p.A <- mean(A, na.rm=TRUE)` | Stores P(A), as above. |
| `p.A.given.B <- …` | Stores P(A \| B), as above. |
| `if (…) { … } else { … }` | Runs the first braces when the test in brackets is TRUE, the `else` braces when it is FALSE. |
| `sum(A & B, na.rm=TRUE) == 0` | TRUE when no row has both: the exclusive test. |
| `abs(p.A.given.B - p.A) < 0.01` | `abs()` drops the sign of the difference; TRUE when the two are within 0.01. |
| `print("…")` | Prints the string in the knitted output. |
| `paste0(…)` | Joins its pieces into one string with nothing between them. |
| `round(p.A, 4)` | `round(x, digits)`: rounds to 4 decimals for the sentence. |

**Left to right**

- `p.A <- …`: "Store under p.A (`p.A <-`) the share of TRUE (`mean`) in A, skipping NA (`na.rm=TRUE`)."
- `p.A.given.B <- …`: "Store under p.A.given.B (`<-`) the count of A and B (`sum(A & B)`) over the count of B (`sum(B)`)."
- first `if`: "If (`if`) the count of A and B (`sum(A & B)`) equals zero (`== 0`), print (`print`) Mutually exclusive, otherwise (`else`) print Not mutually exclusive."
- second `if`: "If (`if`) the size (`abs`) of the gap between P(A|B) and P(A) is under 0.01 (`< 0.01`), print (`print`) Independent, otherwise (`else`) print Not independent."
- last line: "Print (`print`) the joined text (`paste0`) of the label, P(A) rounded (`round`) to 4, the second label, and P(A|B) rounded to 4."

**Right to left**, the order R runs it

- `p.A <- …`: "Drop NA (`na.rm=TRUE`), average A (`mean`), store (`p.A <-`)."
- `p.A.given.B <- …`: "AND the two vectors (`&`), count (`sum`), count B (`sum`), divide (`/`), store (`<-`)."
- first `if`: "Count the rows with both (`sum(A & B)`), compare with 0 (`==`), then run one of the two `print` lines."
- second `if`: "Subtract (`-`), drop the sign (`abs`), compare with 0.01 (`<`), then run one of the two `print` lines."
- last line: "Round both numbers (`round`), join them with the labels (`paste0`), print the sentence (`print`)."
:::

The 0.01 is a judgement, not a rule from the course; say so in a comment if you use it. Lab 5's own gap was 0.0002.

The long version is [Lab 5: conditional probability in R](#/math3042-u4/lab5-conditional-r).

## Left-handers and women on survey

The two logical vectors are `L <- survey$W.Hnd == "Left"` and `Fem <- survey$Sex == "Female"`. The name `F` is avoided because R already uses it for FALSE.

```quiz
[
  {"type": "fill", "q": "P(L), the share of left-handed writers, skipping NA.", "code": "p.L <- ___(L, na.rm=TRUE)", "answer": ["mean"], "explain": "The full line is `p.L <- mean(L, na.rm=TRUE)`. TRUE counts 1 and FALSE 0, so the mean of a logical vector is the share of TRUE. `sum(L, na.rm=TRUE)/sum(!is.na(L))` gives the same number."},
  {"type": "fill", "q": "P(female or left-handed).", "code": "p.Fem.or.L <- mean(Fem ___ L, na.rm=TRUE)", "answer": ["|"], "explain": "The full line is `p.Fem.or.L <- mean(Fem | L, na.rm=TRUE)`. `|` is OR, row by row. Adding `mean(Fem)` and `mean(L)` would count the left-handed women twice."},
  {"type": "fill", "q": "P(female | left-handed): among the left-handed writers, the share who are female.", "code": "p.Fem.given.L <- sum(Fem & L, na.rm=TRUE)/sum(___, na.rm=TRUE)", "answer": ["L"], "explain": "The full line is `p.Fem.given.L <- sum(Fem & L, na.rm=TRUE)/sum(L, na.rm=TRUE)`. Given L means only the L rows count, so the denominator is the number of left-handed writers."},
  {"q": "Which line computes P(left-handed | female), the share of the women who write left-handed?", "options": ["`sum(Fem & L, na.rm=TRUE)/sum(Fem, na.rm=TRUE)`", "`sum(Fem & L, na.rm=TRUE)/sum(L, na.rm=TRUE)`", "`mean(Fem & L, na.rm=TRUE)`", "`mean(Fem, na.rm=TRUE)*mean(L, na.rm=TRUE)`"], "answer": 0, "explain": "Given female, so divide the both-rows by the Fem rows: `sum(Fem & L, na.rm=TRUE)/sum(Fem, na.rm=TRUE)`. Dividing by the L rows gives P(female | left-handed) instead. `mean(Fem & L)` is P(female and left-handed) over all students. The product of the two means is what P(female and left-handed) would be if the events were independent."},
  {"type": "fill", "q": "The mutually exclusive test: TRUE when no student is both female and left-handed.", "code": "sum(Fem & L, na.rm=TRUE) ___ 0", "answer": ["=="], "explain": "The full test is `sum(Fem & L, na.rm=TRUE) == 0`. `==` compares; a single `=` would try to assign. Put it inside `if ( ) { print(\"Mutually exclusive\") } else { print(\"Not mutually exclusive\") }` to print the verdict."},
  {"type": "text", "q": "Write the full line on paper that prints one sentence holding P(female | left-handed) rounded to 4 decimals, then type the name of the function that joins the text and the number.", "answer": ["paste0", "paste0()", "paste", "paste()"], "explain": "A model line: `print(paste0(\"P(female | left-handed) = \", round(p.Fem.given.L, 4)))`. `round(x, 4)` rounds, `paste0()` joins the label and the number with nothing between, and `print()` shows the sentence in the knitted file. `paste()` also works but puts a space between the pieces."}
]
```

## Remember

- P(A) is the share of rows where A is TRUE: `mean()` of the logical vector with `na.rm=TRUE`.
- P(A or B) uses `|`; it is not P(A) + P(B) when the events overlap.
- P(A | B) divides the A-and-B count by the B count, never by all rows.
- Exclusive: the A-and-B count is 0. Independent: P(A | B) is close to P(A).
- `survey` has NA; use `na.rm=TRUE` or filter the NA rows first.
- Print the verdict with `if` and `else`, and put the rounded numbers in the sentence with `paste0()` and `round()`.
