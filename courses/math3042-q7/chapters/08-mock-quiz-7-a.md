---
title: "Mock Quiz 7 A: Part 1 on paper (10 marks), Part 2 in RStudio (10 marks)"
minutes: 50
---
<!-- facts: none; a timed mock in the real two-part format, with new local contexts and the survey data -->
A full Quiz 7 in its real shape: three paper questions worth 10 marks, then an RStudio script on `survey` worth 10 marks.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator: write X in words, the distribution and its parameters, the formula, the substituted line, and the boxed number. Then 25 minutes for Part 2: write the code on paper, or in RStudio if you have it open. The items below check one slot at a time; a probability to 4 decimals, μ, σ and Z to 2.
:::

## Part 1 on paper: three questions, 10 marks

> **Q1 [4 marks].** A BCIT computer lab has 14 workstations. On a given morning each workstation needs a reboot with probability 0.2, independently of the others.
>
> a. [2] What is the probability that exactly 3 workstations need a reboot?
>
> b. [2] What is the probability that at least 2 workstations need a reboot?
>
> **Q2 [3 marks].** During the evening peak, planes land on one of YVR's runways at an average of 0.5 per minute.
>
> a. [2] What is the probability that exactly 4 planes land in a 10-minute window?
>
> b. [1] What is the probability that at least one plane lands in each of two separate 3-minute windows?
>
> **Q3 [3 marks].** A player wins a hand of a card game with probability 0.3, and hands are independent. Over 80 hands the player wins 32.
>
> a. [1] Find the mean number of wins in 80 hands.
>
> b. [1] Find the standard deviation.
>
> c. [1] Is 32 wins unusual? Justify with a Z-score.

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
    "q": "**Q1a (2 marks).** 14 workstations, each needs a reboot with probability 0.2. P(exactly 3 need a reboot)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2501,
    "tolerance": 0.0001,
    "explain": "Let X = the number of the 14 workstations that need a reboot. X is binomial with $n = 14$ workstations, $x = 3$ the number that need a reboot, $p = 0.2$ the chance one needs a reboot, and $q = 0.8$ the chance it does not: a fixed 14 machines, reboot or not, the same 0.2 each, independent. $$P(x) = C(n, x)\\, p^x\\, q^{n-x}$$ $$P(3) = \\underbrace{C(14, 3)}_{\\text{14 machines, 3 reboots}} \\times \\underbrace{(0.2)^3}_{\\text{3 reboots, 0.2 each}} \\times \\underbrace{(0.8)^{11}}_{\\text{11 fine, 0.8 each}} = 364 \\times 0.008 \\times 0.085899 = \\mathbf{0.2501}$$ In R, `dbinom(3, 14, 0.2)`."
  },
  {
    "q": "**Q1b (2 marks).** Same lab. P(at least 2 workstations need a reboot)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8021,
    "tolerance": 0.0001,
    "explain": "At least 2 is everything except 0 and 1, so use the complement. $$P(X \\ge 2) = 1 - P(0) - P(1)$$ $$P(0) = \\underbrace{(0.8)^{14}}_{\\text{all 14 fine, 0.8 each}} = 0.043980, \\quad P(1) = \\underbrace{C(14, 1)}_{\\text{14 choices of 1}} \\times \\underbrace{(0.2)}_{\\text{1 reboot}} \\times \\underbrace{(0.8)^{13}}_{\\text{13 fine}} = 14 \\times 0.2 \\times 0.054976 = 0.153932$$ $$P(X \\ge 2) = 1 - \\underbrace{0.043980}_{\\text{P(0), from above}} - \\underbrace{0.153932}_{\\text{P(1), from above}} = \\mathbf{0.8021}$$ In R, `1 - pbinom(1, 14, 0.2)`: the cumulative stops at 1, one below the 2."
  },
  {
    "q": "**Q2a (2 marks).** Landings at 0.5 per minute. P(exactly 4 planes land in a 10-minute window)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1755,
    "tolerance": 0.0001,
    "explain": "Let X = the number of planes landing in a 10-minute window. X is Poisson; rescale the rate to the window first: $$\\lambda = \\underbrace{0.5}_{\\text{landings per minute}} \\times \\underbrace{10}_{\\text{minutes in window}} = 5$$ So $\\lambda = 5$ is the average number of landings in 10 minutes, and $x = 4$ is the number of landings asked about. $$P(x) = \\dfrac{\\lambda^x e^{-\\lambda}}{x!}$$ $$P(4) = \\dfrac{\\underbrace{5^4}_{\\text{mean 5, 4 landings}} \\, \\underbrace{e^{-5}}_{\\text{e to minus mean}}}{\\underbrace{4!}_{\\text{4 landings}}} = \\dfrac{625 \\times 0.006738}{24} = \\mathbf{0.1755}$$ In R, `dpois(4, 5)`. Using λ = 0.5 answers a one-minute question."
  },
  {
    "q": "**Q2b (1 mark).** Same runway. P(at least one plane lands in each of two separate 3-minute windows)? (4 decimals)",
    "type": "numeric",
    "answer": 0.6035,
    "tolerance": 0.0001,
    "explain": "Each window has its own λ, the average number of landings in 3 minutes at 0.5 landings per minute: $$\\lambda = \\underbrace{0.5}_{\\text{landings per minute}} \\times \\underbrace{3}_{\\text{minutes in window}} = 1.5$$ At least one is the complement of none: $$P(X \\ge 1) = 1 - \\underbrace{e^{-1.5}}_{\\text{P(none), mean 1.5}} = 1 - 0.223130 = 0.776870$$ The windows do not overlap, so they are independent; multiply: $$\\underbrace{0.776870^2}_{\\text{one window's chance, twice}} = \\mathbf{0.6035}$$ In R, `(1 - dpois(0, 1.5))^2`. One 6-minute window with λ = 3 would answer a different question: it allows both landings in the same 3 minutes."
  },
  {
    "q": "**Q3a (1 mark).** 80 hands, each won with probability 0.3. The mean number of wins, $\\mu$ = ? (2 decimals)",
    "type": "numeric",
    "answer": 24,
    "tolerance": 0.05,
    "explain": "Let X = the number of hands won out of 80; binomial with $n = 80$ hands and $p = 0.3$ the chance of winning one hand. $$\\mu = np = \\underbrace{80}_{\\text{hands}} \\times \\underbrace{0.3}_{\\text{chance of a win}} = \\mathbf{24.00}$$"
  },
  {
    "q": "**Q3b (1 mark).** Same player. The standard deviation, $\\sigma$ = ? (2 decimals)",
    "type": "numeric",
    "answer": 4.10,
    "tolerance": 0.05,
    "explain": "With $n = 80$ hands, $p = 0.3$ the chance of winning a hand, and $q = 0.7$ the chance of losing it: $$npq = \\underbrace{80}_{\\text{hands}} \\times \\underbrace{0.3}_{\\text{chance of a win}} \\times \\underbrace{0.7}_{\\text{chance of a loss}} = 16.8$$ $$\\sigma = \\sqrt{npq} = \\sqrt{16.8} = \\mathbf{4.10}$$ The square root is the step most often left off: 16.8 is the variance."
  },
  {
    "q": "**Q3c (1 mark), the Z-score.** Same player, 32 wins. $Z$ = ? (2 decimals, keep the sign)",
    "type": "numeric",
    "answer": 1.95,
    "tolerance": 0.01,
    "explain": "With $x = 32$ the wins observed, $\\mu = 24$ the mean number of wins, and $\\sigma = 4.10$ the standard deviation: $$Z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{\\underbrace{32}_{\\text{wins seen}} - \\underbrace{24}_{\\text{mean wins}}}{\\underbrace{4.10}_{\\text{SD of wins}}} = \\mathbf{1.95}$$"
  },
  {
    "q": "**Q3c (1 mark), the verdict.** Is 32 wins in 80 hands unusual? Type Yes or No.",
    "type": "text",
    "answer": ["No", "no", "NO"],
    "explain": "$$Z = \\dfrac{\\underbrace{32}_{\\text{wins seen}} - \\underbrace{24}_{\\text{mean wins}}}{\\underbrace{4.10}_{\\text{SD of wins}}} = 1.95$$ A value is unusual when $|Z| > 2$. 1.95 is inside $\\pm 2$, so **No**: 32 wins is high but not unusual. Above the mean is not the test; beyond two standard deviations is."
  }
]
```

## Part 2 in RStudio: the survey data, 10 marks

The template below is the notebook's code chunk. Every `Something` is yours to write; the marks for each part sit in its comment.

```r
library(MASS); library(dplyr)
# (a) keep the students who answered both Sex and W.Hnd               [1 mark]
svy <- filter(survey, Something)
# (b) two logical columns                                              [1 mark]
svy$is.Female <- (svy$Sex == "Female")
svy$is.Left <- Something
# (c) P(Female)                                                        [1 mark]
p.F <- Something
# (d) P(Female or Left-handed)                                         [2 marks]
p.F.or.L <- Something
# (e) P(Left-handed | Female)                                          [2 marks]
p.L.given.F <- Something
# (f) mutually exclusive? independent? print each conclusion           [2 marks]
Something
# (g) X = left-handers among 30 students: pmf table and barplot         [1 mark]
n <- 30
p <- sum(svy$is.Left)/nrow(svy)
X.vals <- 0:n
P.vals <- Something
names(P.vals) <- X.vals
cbind(P = round(P.vals, 4))
barplot(P.vals, space=0, xlab="X = # left-handed students", ylab="P(X)",
        main=Something)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(MASS); library(dplyr)` | `library()` loads a package: `MASS` holds the `survey` data, `dplyr` holds `filter()`. `;` separates two commands on one line. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `svy <- filter(survey, Something)` | `<-` stores a result under a name. `filter(data, cond)` keeps the rows where your condition is TRUE. |
| `svy$is.Female <- (svy$Sex == "Female")` | `$` picks a column, and a new name after `$` adds one. `==` compares every row with "Female", giving TRUE or FALSE. |
| `svy$is.Left <- Something` | Adds a second logical column, built by your expression. |
| `p.F <- Something` and the next two | Store your three probabilities under the names `p.F`, `p.F.or.L` and `p.L.given.F`. |
| `n <- 30` | Stores the number of students, the binomial n. |
| `p <- sum(svy$is.Left)/nrow(svy)` | `sum()` of a logical column counts the TRUEs; `nrow()` counts the rows; `/` divides: the share of left-handers. |
| `X.vals <- 0:n` | `a:b` is the whole numbers from a to b, here 0 to 30. |
| `P.vals <- Something` | Your vector of 31 probabilities, one for each value in `X.vals`. |
| `names(P.vals) <- X.vals` | Attaches the labels 0 to 30 to the probabilities, so the table and the bars are labelled. |
| `cbind(P = round(P.vals, 4))` | `round(x, digits)` keeps 4 decimals; `cbind()` prints them as one column named P, one row per value. |
| `barplot(P.vals, …)` | Draws one bar per probability; the first argument, `height`, is the bar heights. |
| `space=0` | No gap between the bars. |
| `xlab=`, `ylab=`, `main=` | The x-axis label, the y-axis label and the title; `main=Something` is your computed title. |

**Left to right**

- `library(MASS); library(dplyr)`: "Load the package (`library`) MASS, then (`;`) load (`library`) dplyr."
- `svy <- filter(survey, Something)`: "Store under the name svy (`svy <-`) the rows kept (`filter`) from the survey data (`survey`) where your condition (`Something`) holds."
- `svy$is.Female <- (svy$Sex == "Female")`: "Store in a new column is.Female (`svy$is.Female <-`) whether each student's Sex (`svy$Sex`) equals (`==`) Female (`"Female"`)."
- `svy$is.Left <- Something`: "Store in a new column is.Left (`svy$is.Left <-`) your expression (`Something`)."
- `p.F`, `p.F.or.L`, `p.L.given.F` lines: "Store under each name (`<-`) your expression (`Something`)."
- `Something` in (f): "Your lines that test and print (`Something`)."
- `n <- 30`: "Store under the name n (`n <-`) the number 30."
- `p <- sum(svy$is.Left)/nrow(svy)`: "Store under the name p (`p <-`) the count of TRUEs (`sum`) in is.Left (`svy$is.Left`) divided by (`/`) the number of rows (`nrow`) of svy."
- `X.vals <- 0:n`: "Store under the name X.vals (`X.vals <-`) the whole numbers from 0 to n (`0:n`)."
- `P.vals <- Something`: "Store under the name P.vals (`P.vals <-`) your expression (`Something`)."
- `names(P.vals) <- X.vals`: "Set the labels (`names(P.vals) <-`) of P.vals to the values in X.vals (`X.vals`)."
- `cbind(P = round(P.vals, 4))`: "Print as one column named P (`cbind(P = …)`) the probabilities (`P.vals`) rounded (`round`) to 4 decimals (`4`)."
- `barplot(…)`: "Draw bars (`barplot`) of P.vals (`P.vals`) with no gaps (`space=0`), an x label (`xlab=`), a y label (`ylab=`) and your title (`main=Something`)."

**Right to left**, the order R runs it

- `library(MASS); library(dplyr)`: "Load MASS (`library`), then load dplyr (`library`)."
- `svy <- filter(survey, Something)`: "Evaluate your condition on every row of survey (`Something`), keep the TRUE rows (`filter`), and store them as svy (`svy <-`)."
- `svy$is.Female <- (svy$Sex == "Female")`: "Pull out the Sex column (`svy$Sex`), compare each value with Female (`==`), and store the TRUE/FALSE results as is.Female (`svy$is.Female <-`)."
- `svy$is.Left <- Something`: "Evaluate your expression (`Something`) and store it as is.Left (`svy$is.Left <-`)."
- `p.F`, `p.F.or.L`, `p.L.given.F` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `Something` in (f): "Run your test, then print the conclusion (`Something`)."
- `n <- 30`: "Take 30 and store it as n (`n <-`)."
- `p <- sum(svy$is.Left)/nrow(svy)`: "Count the TRUEs in is.Left (`sum`), count the rows of svy (`nrow`), divide (`/`), and store the share as p (`p <-`)."
- `X.vals <- 0:n`: "Build 0, 1, …, 30 (`0:n`) and store it as X.vals (`X.vals <-`)."
- `P.vals <- Something`: "Evaluate your expression (`Something`) and store it as P.vals (`P.vals <-`)."
- `names(P.vals) <- X.vals`: "Take the values 0 to 30 (`X.vals`) and attach them as the labels of P.vals (`names(P.vals) <-`)."
- `cbind(P = round(P.vals, 4))`: "Round each probability to 4 decimals (`round`), then print them as a column named P (`cbind`)."
- `barplot(…)`: "Build your title (`main=Something`), then draw the bars of P.vals (`barplot`) with no gaps and the axis labels (`space=0`, `xlab=`, `ylab=`)."
:::

Check the script one slot at a time. The `survey` numbers themselves are left to RStudio: every item asks for code.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Either event: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- Both events: $P(A \cap B) = P(A) \cdot P(B \mid A)$
- Independent events: $P(A \cap B) = P(A) \cdot P(B)$
- Binomial: $P(x) = C(n,x)\,p^x q^{n-x}$

**Not on the sheet, so know it:**

- $P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}$: the sheet\'s "both events" rule, divided by $P(A)$.
- Every R function name and its argument order: nothing in RStudio is on the sheet.
:::

```quiz
[
  {
    "type": "fill",
    "q": "**Part 2 (a) (1 mark).** Keep only the students who answered both the Sex and the writing-hand questions.",
    "code": "svy <- filter(survey, !is.na(Sex), ___(W.Hnd))",
    "answer": ["!is.na"],
    "explain": "The full line: `svy <- filter(survey, !is.na(Sex), !is.na(W.Hnd))`. `is.na()` is TRUE on a missing answer and `!` flips it, so a row stays only when both answers are present; `filter` treats the comma as and. Base R does the same with `svy <- subset(survey, !is.na(Sex) & !is.na(W.Hnd))`. Dropping the NA rows once means no later line needs `na.rm=TRUE`."
  },
  {
    "type": "fill",
    "q": "**Part 2 (b) (1 mark).** The column `is.Left` is TRUE for a student who writes with the left hand.",
    "code": "svy$is.Left <- (svy$W.Hnd ___ \"Left\")",
    "answer": ["=="],
    "explain": "The full line: `svy$is.Left <- (svy$W.Hnd == \"Left\")`. `==` compares every row with the level Left and gives one TRUE or FALSE per student. A single `=` assigns; it does not compare. The level names are case-sensitive: `\"left\"` matches no row."
  },
  {
    "type": "fill",
    "q": "**Part 2 (c) (1 mark).** P(Female), a randomly chosen student in `svy` is female.",
    "code": "p.F <- ___(svy$is.Female)",
    "answer": ["mean"],
    "explain": "The full line: `p.F <- mean(svy$is.Female)`. R counts TRUE as 1 and FALSE as 0, so the mean of a logical column is the share of TRUEs. The same value: `p.F <- sum(svy$is.Female)/nrow(svy)`."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (2 marks).** P(Female or Left-handed).",
    "code": "p.F.or.L <- mean(svy$is.Female ___ svy$is.Left)",
    "answer": ["|"],
    "explain": "The full line: `p.F.or.L <- mean(svy$is.Female | svy$is.Left)`. `|` is or, row by row: TRUE when the student is female, left-handed, or both. Adding `mean(svy$is.Female) + mean(svy$is.Left)` counts the left-handed women twice; the addition rule takes them off once: `p.F + mean(svy$is.Left) - mean(svy$is.Female & svy$is.Left)` gives the same value as the `|` line. `||` is for one TRUE or FALSE, not a whole column."
  },
  {
    "q": "**Part 2 (e) (2 marks).** Which line is P(Left-handed | Female)?",
    "options": [
      "`p.L.given.F <- sum(svy$is.Left & svy$is.Female)/sum(svy$is.Female)`",
      "`p.L.given.F <- sum(svy$is.Left & svy$is.Female)/sum(svy$is.Left)`",
      "`p.L.given.F <- mean(svy$is.Left & svy$is.Female)`",
      "`p.L.given.F <- mean(svy$is.Left)/mean(svy$is.Female)`"
    ],
    "answer": 0,
    "explain": "Given Female means the female students are the whole group: count the left-handed women and divide by the number of women, `sum(svy$is.Left & svy$is.Female)/sum(svy$is.Female)`. The same value by restricting first: `mean(svy$is.Left[svy$is.Female])`. Dividing by the left-handers gives P(Female | Left-handed); `mean(A & B)` is P(Left-handed and Female), divided by every student instead of the women."
  },
  {
    "type": "text",
    "q": "**Part 2 (f) (1 of 2 marks).** Write the full lines on paper that print whether being female and being left-handed are mutually exclusive, then type the name of the function you used to count the students who are both.",
    "answer": ["sum", "mean"],
    "explain": "Mutually exclusive means no student is both, so the count of both must be 0:\n\n`both <- sum(svy$is.Female & svy$is.Left)`\n\n`if (both == 0) { print(\"Mutually exclusive: no student is both\") } else { print(\"Not mutually exclusive: some students are both\") }`\n\n`sum()` counts the TRUEs in `svy$is.Female & svy$is.Left`; `mean(...) == 0` tests the same thing. R prints whichever sentence the data supports."
  },
  {
    "type": "text",
    "q": "**Part 2 (f) (1 of 2 marks).** Write the full lines on paper that compare P(Left-handed | Female) with P(Left-handed) and print a conclusion, then type the name of the function that takes the size of the gap between the two.",
    "answer": ["abs"],
    "explain": "Independent means knowing the student is female does not change the chance of left-handedness:\n\n`p.L <- mean(svy$is.Left)`\n\n`if (abs(p.L.given.F - p.L) < 0.01) { print(\"Independent: P(L|F) is close to P(L)\") } else { print(\"Not independent: P(L|F) differs from P(L)\") }`\n\n`abs()` drops the sign so a gap either way counts. The 0.01 tolerance is a judgement you state. To print the numbers in the sentence: `print(paste0(\"P(L|F) = \", round(p.L.given.F, 4), \", P(L) = \", round(p.L, 4)))`."
  },
  {
    "type": "fill",
    "q": "**Part 2 (g) (1 mark), the probabilities.** X = the number of left-handers among 30 students, binomial with `n` and `p` from the template. Fill the function.",
    "code": "P.vals <- ___(X.vals, n, p)",
    "answer": ["dbinom"],
    "explain": "The full line: `P.vals <- dbinom(X.vals, n, p)`. `dbinom(x, size, prob)` gives P(X = x); handed the whole vector 0:30 in the x slot it returns all 31 probabilities at once. `pbinom` would give the running totals P(X ≤ x) instead."
  },
  {
    "type": "fill",
    "q": "**Part 2 (g) (1 mark), the title.** The n in the title must be computed, not typed.",
    "code": "main=paste0(\"Left-handed students in a group of 30 (n = \", ___, \")\")",
    "answer": ["n"],
    "explain": "The full argument: `main=paste0(\"Left-handed students in a group of 30 (n = \", n, \")\")`. `paste0()` joins its pieces with nothing between them, so the title reads n = 30 from the variable. Change `n <- 30` and the title follows."
  }
]
```

The paper-side tables for all of this are on [the know-cold sheet](#/math3042-q7/know-cold-q7); the R moves are taught in [probabilities from a data frame](#/math3042-q7/r-probabilities-from-data).
