---
title: "Mock Quiz 7 B: new contexts, the same shapes"
minutes: 50
---
<!-- facts: none; a second timed mock with new local contexts and the SFU weather frame from Lab 5 -->
A second full Quiz 7: the same three paper shapes with new numbers, then an RStudio script on the SFU weather data from Lab 5.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator, 25 for Part 2 on paper or in RStudio. Write X in words, the distribution and its parameters, the formula, the substituted line, and the boxed number; a probability to 4 decimals, μ, σ and Z to 2.
:::

## Part 1 on paper: three questions, 10 marks

> **Q1 [4 marks].** A BC lottery scratch ticket wins a prize with probability 0.12, independently from ticket to ticket. You buy 10 tickets.
>
> a. [2] What is the probability that exactly 2 tickets win?
>
> b. [2] What is the probability that at least 3 tickets win?
>
> **Q2 [3 marks].** The BCIT IT service desk text line receives messages at an average of 0.15 per minute.
>
> a. [2] What is the probability of exactly 3 messages in a 30-minute span?
>
> b. [1] What is the probability of at most 1 message in each of two separate 10-minute spans?
>
> **Q3 [3 marks].** Lost-bag reports at a YVR baggage office follow a Poisson distribution with an average of 9 per day. One day brings 16 reports.
>
> a. [1] Find the mean number of reports per day.
>
> b. [1] Find the standard deviation.
>
> c. [1] Is 16 reports in a day unusual? Justify with a Z-score.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Binomial: $P(x) = C(n,x)\,p^x q^{n-x}$
- Binomial: $\mu = np$ and $\sigma^2 = npq$
- Combinations: $C(n,r) = \dfrac{n!}{(n-r)!\,r!}$, the nCr key
- Poisson: $P(x) = e^{-\lambda} \cdot \dfrac{\lambda^x}{x!}$
- Poisson: $\mu = \lambda$ and $\sigma^2 = \lambda$
- $Z = \dfrac{X - \mu}{\sigma}$
- Complement: $P(\bar{A}) = 1 - P(A)$
- Independent events: $P(A \cap B) = P(A) \cdot P(B)$

**Not on the sheet, so know it:**

- $q = 1 - p$, the chance of a fail. The sheet uses q without defining it.
- $\sigma = \sqrt{\sigma^2}$. **The sheet gives the variance; take the square root for σ.**
- A count is unusual when $|Z| > 2$.
- $\lambda = \text{rate} \times \text{interval}$, in the units the question asks about.
- At least k is $1 - P(\text{at most } k - 1)$; at least one is $1 - P(0)$.
:::

```quiz
[
  {
    "q": "**Q1a (2 marks).** 10 tickets, each wins with probability 0.12. P(exactly 2 win)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2330,
    "tolerance": 0.0001,
    "explain": "Let X = the number of winning tickets among the 10. X is binomial with $n = 10$ tickets, $x = 2$ the number that win, $p = 0.12$ the chance one ticket wins, and $q = 0.88$ the chance it does not: a fixed 10 tickets, win or not, the same 0.12 each, independent. $$P(x) = C(n, x)\\, p^x\\, q^{n-x}$$ $$P(2) = \\underbrace{C(10, 2)}_{\\text{10 tickets, 2 win}} \\times \\underbrace{(0.12)^2}_{\\text{2 wins, 0.12 each}} \\times \\underbrace{(0.88)^8}_{\\text{8 losers, 0.88 each}} = 45 \\times 0.0144 \\times 0.359635 = \\mathbf{0.2330}$$ In R, `dbinom(2, 10, 0.12)`."
  },
  {
    "q": "**Q1b (2 marks).** Same tickets. P(at least 3 win)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1087,
    "tolerance": 0.0001,
    "explain": "At least 3 is everything except 0, 1 and 2: $$P(X \\ge 3) = 1 - [P(0) + P(1) + P(2)]$$ $$P(0) = \\underbrace{(0.88)^{10}}_{\\text{all 10 lose, 0.88 each}} = 0.278501, \\quad P(1) = \\underbrace{C(10, 1)}_{\\text{10 choices of 1}} \\times \\underbrace{(0.12)}_{\\text{1 win}} \\times \\underbrace{(0.88)^9}_{\\text{9 losers}} = 10 \\times 0.12 \\times 0.316478 = 0.379774, \\quad P(2) = \\underbrace{0.233043}_{\\text{from Q1a}}$$ $$P(X \\ge 3) = 1 - (\\underbrace{0.278501}_{\\text{P(0)}} + \\underbrace{0.379774}_{\\text{P(1)}} + \\underbrace{0.233043}_{\\text{P(2)}}) = 1 - 0.891318 = \\mathbf{0.1087}$$ In R, `1 - pbinom(2, 10, 0.12)`: the cumulative stops at 2, one below the 3."
  },
  {
    "q": "**Q2a (2 marks).** Messages at 0.15 per minute. P(exactly 3 messages in a 30-minute span)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1687,
    "tolerance": 0.0001,
    "explain": "Let X = the number of messages in 30 minutes. X is Poisson; rescale the rate to the span first: $$\\lambda = \\underbrace{0.15}_{\\text{messages per minute}} \\times \\underbrace{30}_{\\text{minutes in span}} = 4.5$$ So $\\lambda = 4.5$ is the average number of messages in 30 minutes, and $x = 3$ is the number of messages asked about. $$P(x) = \\dfrac{\\lambda^x e^{-\\lambda}}{x!}$$ $$P(3) = \\dfrac{\\underbrace{4.5^3}_{\\text{mean 4.5, 3 messages}} \\, \\underbrace{e^{-4.5}}_{\\text{e to minus mean}}}{\\underbrace{3!}_{\\text{3 messages}}} = \\dfrac{91.125 \\times 0.011109}{6} = \\mathbf{0.1687}$$ In R, `dpois(3, 4.5)`."
  },
  {
    "q": "**Q2b (1 mark).** Same text line. P(at most 1 message in each of two separate 10-minute spans)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3112,
    "tolerance": 0.0001,
    "explain": "Each span has its own λ, the average number of messages in 10 minutes at 0.15 messages per minute: $$\\lambda = \\underbrace{0.15}_{\\text{messages per minute}} \\times \\underbrace{10}_{\\text{minutes in span}} = 1.5$$ At most 1 is 0 or 1: $$P(0) = \\underbrace{e^{-1.5}}_{\\text{no messages, mean 1.5}} = 0.223130 \\qquad P(1) = \\dfrac{\\underbrace{1.5^1}_{\\text{mean 1.5, 1 message}} \\, e^{-1.5}}{\\underbrace{1!}_{\\text{1 message}}} = 0.334695$$ $$P(X \\le 1) = P(0) + P(1) = \\underbrace{0.223130}_{\\text{P(0)}} + \\underbrace{0.334695}_{\\text{P(1)}} = 0.557825$$ The spans do not overlap, so they are independent; multiply: $$\\underbrace{0.557825^2}_{\\text{one span's chance, twice}} = \\mathbf{0.3112}$$ In R, `ppois(1, 1.5)^2`. One 20-minute span with λ = 3 would allow both messages in the same 10 minutes, a different question."
  },
  {
    "q": "**Q3a (1 mark).** Lost-bag reports average 9 per day. The mean, $\\mu$ = ? (2 decimals)",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0.05,
    "explain": "Let X = the number of lost-bag reports in a day; Poisson with $\\lambda = 9$ the average number of reports per day. For a Poisson variable the mean is λ: $$\\mu = \\lambda = \\underbrace{9}_{\\text{reports per day}} = \\mathbf{9.00}$$"
  },
  {
    "q": "**Q3b (1 mark).** Same office. The standard deviation, $\\sigma$ = ? (2 decimals)",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.05,
    "explain": "For a Poisson variable the variance is also λ: $$\\sigma^2 = \\lambda = \\underbrace{9}_{\\text{reports per day}}$$ $$\\sigma = \\sqrt{\\lambda} = \\sqrt{9} = \\mathbf{3.00}$$ There is no q in the Poisson; $\\sqrt{npq}$ belongs to the binomial."
  },
  {
    "q": "**Q3c (1 mark), the Z-score.** Same office, 16 reports. $Z$ = ? (2 decimals, keep the sign)",
    "type": "numeric",
    "answer": 2.33,
    "tolerance": 0.01,
    "explain": "With $x = 16$ the reports on that day, $\\mu = 9$ the mean number of reports per day, and $\\sigma = 3$ the standard deviation: $$Z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{\\underbrace{16}_{\\text{reports that day}} - \\underbrace{9}_{\\text{mean reports}}}{\\underbrace{3}_{\\text{SD of reports}}} = \\mathbf{2.33}$$"
  },
  {
    "q": "**Q3c (1 mark), the verdict.** Is 16 reports in a day unusual? Type Yes or No.",
    "type": "text",
    "answer": ["Yes", "yes", "YES"],
    "explain": "$$Z = \\dfrac{\\underbrace{16}_{\\text{reports that day}} - \\underbrace{9}_{\\text{mean reports}}}{\\underbrace{3}_{\\text{SD of reports}}} = 2.33$$ A value is unusual when $|Z| > 2$. 2.33 is beyond 2, so **Yes**: 16 reports is unusually high for a day."
  }
]
```

## Part 2 in RStudio: the SFU weather data, 10 marks

The template below is the notebook's code chunk, with `SFU.Weather.with.Precip.csv` saved beside it. Every `Something` is yours to write; the marks for each part sit in its comment.

```r
library(dplyr)
# (a) import with the seven column types                               [1 mark]
SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na.strings="NA",
                        Something=c("Date","integer","character","integer",
                                    "numeric","numeric","numeric"))
# (b) drop the rows missing a temperature or a precipitation value     [1 mark]
SFU.Weather <- subset(SFU.Weather, Something)
nrow(SFU.Weather)
# (c) a wet day has any precipitation                                  [1 mark]
SFU.Weather$has.Precip <- Something
# (d) label each day by its half of the year                           [2 marks]
SFU.Weather$Half <- Something
# (e) two-way table of Half by has.Precip                              [1 mark]
tab <- Something
# (f) P(wet), P(wet | Oct-Mar), and the printed conclusion             [2 marks]
p.wet <- Something
p.wet.OctMar <- Something
Something
# (g) heavy-rain days at 0.8 per week: one week, then four weeks      [2 marks]
Something
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr)` | `library()` loads a package; `dplyr` is the tidy toolkit Lab 5 loads. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `SFU.Weather <- read.csv(…)` | `<-` stores the data frame that `read.csv()` reads from the file named in quotes. |
| `header=TRUE` | The file's first line holds the column names. |
| `na.strings="NA"` | The text NA in the file marks a missing value. |
| `Something=c("Date", …)` | The argument you name takes one type per column; `c()` combines the seven type names, in column order. |
| `SFU.Weather <- subset(SFU.Weather, Something)` | `subset(data, cond)` keeps the rows where your condition is TRUE; the result replaces the old frame. |
| `nrow(SFU.Weather)` | The number of rows left. |
| `SFU.Weather$has.Precip <- Something` | `$` with a new name adds a column, filled by your expression. |
| `SFU.Weather$Half <- Something` | Adds a column of labels, built by your expression. |
| `tab <- Something` | Stores your table under the name `tab`. |
| `p.wet <- Something`, `p.wet.OctMar <- Something` | Store your two probabilities. |
| `Something` in (f) and (g) | Your lines that print the conclusion and the two Poisson values. |

**Left to right**

- `library(dplyr)`: "Load the package (`library`) dplyr."
- `SFU.Weather <- read.csv(…)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the table read from the CSV file (`read.csv`) with a header line (`header=TRUE`), NA as missing (`na.strings="NA"`) and the seven column types (`Something=c(…)`)."
- `SFU.Weather <- subset(SFU.Weather, Something)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the rows kept (`subset`) where your condition (`Something`) holds."
- `nrow(SFU.Weather)`: "The number of rows (`nrow`) of SFU.Weather."
- `SFU.Weather$has.Precip <- Something`: "Store in a new column has.Precip (`SFU.Weather$has.Precip <-`) your expression (`Something`)."
- `SFU.Weather$Half <- Something`: "Store in a new column Half (`SFU.Weather$Half <-`) your expression (`Something`)."
- `tab <- Something`: "Store under the name tab (`tab <-`) your table (`Something`)."
- `p.wet`, `p.wet.OctMar` lines: "Store under each name (`<-`) your expression (`Something`)."
- `Something` in (f) and (g): "Your lines that test, compute and print (`Something`)."

**Right to left**, the order R runs it

- `library(dplyr)`: "Load dplyr (`library`)."
- `SFU.Weather <- read.csv(…)`: "Combine the type names (`c`), read the file with them (`read.csv`, `header=TRUE`, `na.strings=`), and store the data frame (`SFU.Weather <-`)."
- `SFU.Weather <- subset(SFU.Weather, Something)`: "Evaluate your condition on every row (`Something`), keep the TRUE rows (`subset`), and store the result back (`SFU.Weather <-`)."
- `nrow(SFU.Weather)`: "Count the rows (`nrow`) and print."
- `SFU.Weather$has.Precip <- Something`: "Evaluate your expression (`Something`) and store it as the column has.Precip (`SFU.Weather$has.Precip <-`)."
- `SFU.Weather$Half <- Something`: "Evaluate your expression (`Something`) and store it as the column Half (`SFU.Weather$Half <-`)."
- `tab <- Something`: "Build your table (`Something`) and store it as tab (`tab <-`)."
- `p.wet`, `p.wet.OctMar` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `Something` in (f) and (g): "Run your lines; each printed value appears below the chunk (`Something`)."
:::

Check the script one slot at a time. Apart from the row count, the weather numbers are left to RStudio: every item asks for code.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Either event: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- Both events: $P(A \cap B) = P(A) \cdot P(B \mid A)$
- Poisson: $P(x) = e^{-\lambda} \cdot \dfrac{\lambda^x}{x!}$
- Complement: $P(\bar{A}) = 1 - P(A)$

**Not on the sheet, so know it:**

- $P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}$: the sheet\'s "both events" rule, divided by $P(A)$.
- $\lambda = \text{rate} \times \text{interval}$, in the units the question asks about.
- Every R function name and its argument order: nothing in RStudio is on the sheet.
:::

```quiz
[
  {
    "type": "fill",
    "q": "**Part 2 (a) (1 mark).** The argument that reads Date as a date and the numbers as numbers.",
    "code": "read.csv(\"SFU.Weather.with.Precip.csv\", header=TRUE, na.strings=\"NA\", ___=c(\"Date\",\"integer\",\"character\",\"integer\",\"numeric\",\"numeric\",\"numeric\"))",
    "answer": ["colClasses"],
    "explain": "The full line: `SFU.Weather <- read.csv(\"SFU.Weather.with.Precip.csv\", header=TRUE, na.strings=\"NA\", colClasses=c(\"Date\",\"integer\",\"character\",\"integer\",\"numeric\",\"numeric\",\"numeric\"))`. Without `colClasses`, `read.csv` reads the Date column as text, and `weekdays()` or a date comparison then fails. One type per column, in the file's order."
  },
  {
    "type": "fill",
    "q": "**Part 2 (b) (1 mark).** Keep a row only when both the temperature and the precipitation are present.",
    "code": "SFU.Weather <- subset(SFU.Weather, !is.na(Temp.deg.C) ___ !is.na(Total.Precip.mm))",
    "answer": ["&"],
    "explain": "The full line: `SFU.Weather <- subset(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))`. Both must be present, so and (`&`); or (`|`) would keep a row missing one of the two. The dplyr form is Lab 5's `filter(SFU.Weather, !is.na(Temp.deg.C), !is.na(Total.Precip.mm))`, where the comma means and. `nrow(SFU.Weather)` then prints 17582, the row count Lab 5 prints."
  },
  {
    "type": "fill",
    "q": "**Part 2 (c) (1 mark).** `has.Precip` is TRUE on a day with any rain or snow at all.",
    "code": "SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm ___ 0)",
    "answer": [">"],
    "explain": "The full line, as in Lab 5: `SFU.Weather$has.Precip <- (SFU.Weather$Total.Precip.mm > 0)`. A dry day records 0 mm, so `> 0` is any precipitation. `>= 0` would mark every day wet."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** Label October to March days \"Oct-Mar\" and the rest \"Apr-Sep\". The operator that asks whether a month is one of six.",
    "code": "ifelse(Month ___ c(\"Oct\",\"Nov\",\"Dec\",\"Jan\",\"Feb\",\"Mar\"), \"Oct-Mar\", \"Apr-Sep\")",
    "answer": ["%in%"],
    "explain": "`Month %in% c(\"Oct\", …, \"Mar\")` is TRUE for each day whose month is any of the six. `==` would compare day by day with one month at a time, recycling the six, which is wrong. `ifelse(test, yes, no)` then picks \"Oct-Mar\" where the test is TRUE and \"Apr-Sep\" otherwise."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** The function that lets `Month` be written without `SFU.Weather$` in front.",
    "code": "SFU.Weather$Half <- ___(SFU.Weather, ifelse(Month %in% c(\"Oct\",\"Nov\",\"Dec\",\"Jan\",\"Feb\",\"Mar\"), \"Oct-Mar\", \"Apr-Sep\"))",
    "answer": ["with"],
    "explain": "The full line: `SFU.Weather$Half <- with(SFU.Weather, ifelse(Month %in% c(\"Oct\",\"Nov\",\"Dec\",\"Jan\",\"Feb\",\"Mar\"), \"Oct-Mar\", \"Apr-Sep\"))`. `with(data, expr)` looks up the column names inside the frame, the way Lab 5 builds `Season`. Without it, write `SFU.Weather$Month` in the test."
  },
  {
    "type": "fill",
    "q": "**Part 2 (e) (1 mark).** The two-way table of Half by has.Precip.",
    "code": "tab <- ___(SFU.Weather[c(\"Half\", \"has.Precip\")])",
    "answer": ["table"],
    "explain": "The full line: `tab <- table(SFU.Weather[c(\"Half\", \"has.Precip\")])`. Two columns in give a two-way table of counts: rows Apr-Sep and Oct-Mar, columns FALSE and TRUE. The row and column names are the strings you index with next."
  },
  {
    "q": "**Part 2 (f) (1 of 2 marks).** Which line is P(wet), the share of all days with precipitation?",
    "options": [
      "`p.wet <- sum(tab[ ,\"TRUE\"])/sum(tab)`",
      "`p.wet <- tab[ ,\"TRUE\"]/sum(tab)`",
      "`p.wet <- sum(tab[\"TRUE\", ])/sum(tab)`",
      "`p.wet <- sum(tab[ ,\"TRUE\"])/nrow(tab)`"
    ],
    "answer": 0,
    "explain": "The TRUE column holds the wet days of both halves; add them and divide by the grand total: `sum(tab[ ,\"TRUE\"])/sum(tab)`. Without the outer `sum` you get two numbers, one per half. `\"TRUE\"` is a column, not a row, of this table. `nrow(tab)` is 2, the number of halves, not the number of days."
  },
  {
    "type": "fill",
    "q": "**Part 2 (f) (1 of 2 marks).** P(wet | Oct-Mar): divide by the right total.",
    "code": "p.wet.OctMar <- tab[\"Oct-Mar\",\"TRUE\"]/sum(tab[___, ])",
    "answer": ["\"Oct-Mar\"", "'Oct-Mar'"],
    "explain": "Given Oct-Mar means the October to March days are the whole group, so divide by that row's total: `p.wet.OctMar <- tab[\"Oct-Mar\",\"TRUE\"]/sum(tab[\"Oct-Mar\", ])`. Then the printed conclusion:\n\n`if (abs(p.wet.OctMar - p.wet) < 0.01) { print(\"Independent: P(wet | Oct-Mar) is close to P(wet)\") } else { print(\"Not independent: P(wet | Oct-Mar) differs from P(wet)\") }`\n\nThe 0.01 tolerance is a judgement you state; R prints whichever sentence the data supports."
  },
  {
    "type": "fill",
    "q": "**Part 2 (g) (1 of 2 marks).** Assume heavy-rain days arrive at 0.8 per week in winter. P(exactly 2 heavy-rain days in one week).",
    "code": "dpois(2, ___)",
    "answer": ["0.8"],
    "explain": "`dpois(x, lambda)`: x = 2, the number of heavy-rain days asked about, and λ = 0.8, the average number of heavy-rain days in one week, the rate as given. Computed by the formula: $$P(2) = \\dfrac{\\underbrace{0.8^2}_{\\text{mean 0.8, 2 days}} \\, \\underbrace{e^{-0.8}}_{\\text{e to minus mean}}}{\\underbrace{2!}_{\\text{2 days}}} = \\dfrac{0.64 \\times 0.449329}{2} = \\mathbf{0.1438}$$"
  },
  {
    "type": "fill",
    "q": "**Part 2 (g) (1 of 2 marks).** Same rate, 0.8 per week. P(at least 3 heavy-rain days in four weeks).",
    "code": "1 - ppois(___, 3.2)",
    "answer": ["2"],
    "explain": "Four weeks is one longer interval, so rescale to λ, the average number of heavy-rain days in four weeks at 0.8 per week: $$\\lambda = \\underbrace{0.8}_{\\text{heavy days per week}} \\times \\underbrace{4}_{\\text{weeks}} = 3.2$$ At least 3 is the complement of at most 2, so the cumulative stops at 2: `1 - ppois(2, 3.2)`. Computed by the formula: $$P(0) = \\underbrace{e^{-3.2}}_{\\text{no days, mean 3.2}} = 0.040762 \\qquad P(1) = \\dfrac{\\underbrace{3.2^1}_{\\text{mean 3.2, 1 day}} \\, e^{-3.2}}{\\underbrace{1!}_{\\text{1 day}}} = 0.130439 \\qquad P(2) = \\dfrac{\\underbrace{3.2^2}_{\\text{mean 3.2, 2 days}} \\, e^{-3.2}}{\\underbrace{2!}_{\\text{2 days}}} = 0.208702$$ $$P(X \\le 2) = \\underbrace{0.040762}_{\\text{P(0)}} + \\underbrace{0.130439}_{\\text{P(1)}} + \\underbrace{0.208702}_{\\text{P(2)}} = 0.379904$$ $$1 - \\underbrace{0.379904}_{\\text{P(at most 2)}} = \\mathbf{0.6201}$$"
  }
]
```

The tables for all of this are on [the know-cold sheet](#/math3042-q7/know-cold-q7); the import, filter and `ifelse` moves are taught in [working with data in RStudio](#/math3042-q7/r-data-moves).
