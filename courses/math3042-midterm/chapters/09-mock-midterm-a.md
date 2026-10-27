---
title: "Mock midterm A: the practice paper's twelve shapes"
minutes: 90
---

Twelve questions, 46 marks, in the order and shape of the practice paper, with new contexts and new numbers. Write every answer on paper first with the formula sheet and a calculator, then type the number or the key word here; the model answer opens with the result.

:::quiz Timing: about two minutes per mark
| Q | Marks | Shape | Minutes |
|---|---|---|---|
| 1 | 5 | Read a histogram: a percentage, mean and median, the empirical rule | 10 |
| 2 | 4 | Recommend from two summary tables | 8 |
| 3 | 4 | Independent cards: none, at least one, expected profit | 8 |
| 4 | 3 | Two people from the same group, without replacement | 6 |
| 5 | 3 | Bayes' rule | 6 |
| 6 | 3 | A probability table | 6 |
| 7 | 4 | R on a data frame: a percentile, a filter, boxplots | 8 |
| 8 | 3 | R: `rhyper`, `dhyper`, `phyper` | 6 |
| 9 | 3 | R: a simulation function and a line that uses it | 6 |
| 10 | 4 | TRUE or FALSE from side-by-side boxplots | 8 |
| 11 | 5 | Poisson with a rescaled λ; the next event between two times | 10 |
| 12 | 5 | A card game: winnings, expected value, two games | 8 |

Rounding as on the cover: a probability to four decimal places, anything else to three significant digits, money to the cent. An R answer is a full runnable line; type the function name you used and the model command appears.
:::

| Q | Taught in |
|---|---|
| 1 | [Histograms](#/math3042-u2/histograms), [the empirical rule](#/math3042/empirical-rule), [skewness](#/math3042/skewness) |
| 2 | [Range and standard deviation](#/math3042/range-sd), [CV](#/math3042/cv) |
| 3, 6, 12 | [Complement and addition](#/math3042-u3/complement-addition), [discrete distributions](#/math3042-u4/discrete-distributions), [expected value in dollars](#/math3042-midterm/expected-dollars-shortcuts) |
| 4 | [Conditional probability and independence](#/math3042-u3/conditional-independence) |
| 5 | [Bayes](#/math3042-u3/bayes) |
| 7 | [Lab 2 grouped statistics](#/math3042-u2/lab2-grouped), [R on paper](#/math3042-midterm/r-on-paper) |
| 8 | [Hypergeometric](#/math3042-u4/hypergeometric), [R on paper](#/math3042-midterm/r-on-paper) |
| 9 | [Lab 4 simulations](#/math3042-u3/lab4-simulations) |
| 10 | [IQR, boxplots, outliers](#/math3042/iqr-boxplot-outliers) |
| 11 | [Poisson](#/math3042-u4/poisson) |

## Q1 (5 marks). Commute times of 200 CST students

The histogram of one-way commute times (in minutes) to the Burnaby campus for 200 CST students has 12 bars, each 10 minutes wide. Its bar heights:

| Commute (min) | 0–10 | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 | 60–70 | 70–80 | 80–90 | 90–100 | 100–110 | 110–120 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Frequency | 8 | 22 | 41 | 37 | 29 | 21 | 15 | 11 | 7 | 5 | 3 | 1 |

```quiz
[
  {
    "q": "**Q1a (1 mark).** Approximately what percentage of the students commute **at least 60 minutes**? (percent)",
    "type": "numeric",
    "answer": 21,
    "tolerance": 1,
    "unit": "%",
    "explain": "Add the bars from 60 minutes up: 15 + 11 + 7 + 5 + 3 + 1 = 42, so 42/200 = 0.21 or **21 %** commute at least 60 minutes. Equivalently 200 − 158 = 42, where 158 is the cumulative count through 60 minutes. Starting at the 50–60 bar (63 students, 31.5 %) counts students who commute less than an hour."
  },
  {
    "q": "**Q1b (1 of 2 marks).** Based on the histogram, the **median** commute is approximately how many minutes?",
    "type": "numeric",
    "answer": 35,
    "tolerance": 5,
    "unit": "min",
    "explain": "The median sits between the 100th and 101st values. Cumulative counts: 8, 30, 71 through 30 minutes, then 108 through 40 minutes. The 100th and 101st values are in the **30–40 minute class**, so the median is about **35 minutes** (any value in 30 to 40 is accepted)."
  },
  {
    "q": "**Q1b (2 of 2 marks).** Based on the histogram, the **mean** commute is approximately how many minutes?",
    "type": "numeric",
    "answer": 42.25,
    "tolerance": 4,
    "unit": "min",
    "explain": "The long right tail (bars out to 120 minutes) pulls the mean **above** the median, so the mean is somewhere in the low 40s. A grouped-mean check with class midpoints: Σ f·x = 8(5) + 22(15) + 41(25) + 37(35) + 29(45) + 21(55) + 15(65) + 11(75) + 7(85) + 5(95) + 3(105) + 1(115) = 8450, and 8450/200 = **42.25 minutes** (about 42; 38 to 46 accepted). An answer equal to the median misses the skew."
  },
  {
    "q": "**Q1c (2 marks).** Is it reasonable to use the empirical rule on this dataset? Justify your answer with reference to specific features of the histogram. Write the paragraph on paper, then type your verdict (Yes or No).",
    "type": "text",
    "answer": ["No", "no"],
    "explain": "**No.** The histogram is **right-skewed**: a single peak at 20–30 minutes (41 students) and a long tail stretching to 110–120 minutes, with the right side much longer than the left (nothing below 0). It is not symmetric, so the mean (about 42 minutes) sits above the median (about 35 minutes). The empirical rule requires an approximately normal (bell-shaped, symmetric) distribution, so the 68–95–99.7 percentages would not hold here."
  }
]
```

## Q2 (4 marks). Choosing a Wi-Fi router for the library study rooms

You are recommending one of two Wi-Fi routers for the BCIT library's study rooms. The requirement is that download speed stays **at least 50 Mbps** for students on video calls; price and features are similar. Published tests of download speed (Mbps) give:

| Statistic | Router P (n = 48) | Router Q (n = 52) |
|---|---|---|
| Mean | 88.4 | 92.7 |
| Median | 91.2 | 86.5 |
| Standard deviation | 9.6 | 27.9 |
| Variance | 92.16 | 778.41 |
| Range | 41.3 | 118.6 |
| Minimum | 66.0 | 38.2 |
| Maximum | 107.3 | 156.8 |

```quiz
[
  {
    "q": "**Q2 (4 marks).** Write a brief recommendation, citing relevant statistics. Comment on at least 2 measures of central tendency and at least 2 measures of spread. Write it on paper, then type the router you recommend (P or Q).",
    "type": "text",
    "answer": ["P", "Router P"],
    "explain": "**I recommend Router P.** Its centre is comparable to Q's: Q's mean is about 4.3 Mbps higher (92.7 vs 88.4), but P's median is about 4.7 Mbps higher (91.2 vs 86.5), and both are well above 50 Mbps. Router P is far less variable: its standard deviation is 9.6 Mbps against 27.9, its variance 92.16 against 778.41, and its range 41.3 against 118.6 Mbps. P's slowest test, 66.0 Mbps, is still above the 50 Mbps requirement, while Q dropped to 38.2 Mbps. Q's mean above its median also suggests a right skew from a few very fast tests. So Router P is the more reliable choice for staying above 50 Mbps."
  }
]
```

## Q3 (4 marks). Instant Win cards at a campus fundraiser

Each Instant Win card sold at a BCIT Student Association fundraiser has a 4 % chance of winning a $75 transit credit, independently of every other card.

```quiz
[
  {
    "q": "**Q3a (1 mark).** A student buys 6 cards. What is the probability that **none** of them wins? (4 decimals)",
    "type": "numeric",
    "answer": 0.7828,
    "tolerance": 0.0001,
    "explain": "Denote a win by W and a loss by L; we want P(LLLLLL). Since cards are independent, P(LLLLLL) = P(L)⁶ = (1 − 0.04)⁶ = 0.96⁶ = **0.7828** or 78.28 %."
  },
  {
    "q": "**Q3b (1 mark).** A student buys 6 cards. What is the probability that she wins **at least one** prize? (4 decimals)",
    "type": "numeric",
    "answer": 0.2172,
    "tolerance": 0.0001,
    "explain": "Complement rule: P(at least one win) = 1 − P(no wins) = 1 − 0.7828 = **0.2172** or 21.72 %. Multiplying 6 × 0.04 = 0.24 double-counts the ways to win twice."
  },
  {
    "q": "**Q3c (2 marks).** Cards cost $5.00 each. What is the expected profit or loss per card for a student who plays? (dollars; a loss is negative)",
    "type": "numeric",
    "answer": -2.00,
    "tolerance": 0.01,
    "unit": "$",
    "explain": "Let X = net profit on one card (prize − cost). A win nets 75.00 − 5.00 = 70.00 dollars with probability 0.04; a loss nets −5.00 dollars with probability 0.96.\n\nX = −5.00 with P(X) = 0.96\nX = 70.00 with P(X) = 0.04\n\nE(X) = Σ x P(x) = −5.00(0.96) + 70.00(0.04) = −4.80 + 2.80 = −2.00. **There is an expected loss of $2.00 per card.** Putting the gross prize 75.00 in the win row gives −1.80: it forgets that a winner also paid 5.00 for the card."
  }
]
```

## Q4 (3 marks). Two students from the same lab set

Three COMP 3760 lab sets, A, B and C, are combined for a guest lecture. The sets have 28, 35 and 41 students. Two students are chosen at random, without replacement, to ask the first questions.

```quiz
[
  {
    "q": "**Q4 (3 marks).** What is the probability that both students are from the **same** set? (4 decimals)",
    "type": "numeric",
    "answer": 0.3348,
    "tolerance": 0.0001,
    "explain": "Total students = 28 + 35 + 41 = 104. P(same set) = P(both A) + P(both B) + P(both C), and these are mutually exclusive, so\n\nP(same set) = (28/104)(27/103) + (35/104)(34/103) + (41/104)(40/103) = (756 + 1190 + 1640)/10712 = 3586/10712 = **0.3348** or 33.48 %.\n\nThe second fraction loses one from both the top (one student of that set is gone) and the bottom (one student is gone). With replacement, (28² + 35² + 41²)/104² = 0.3412, which is a different question."
  }
]
```

## Q5 (3 marks). Which language passed the tests

At a BCIT hackathon, 70 % of the submissions are written in Python and 30 % in Java. A Python submission passes every automated test with probability 0.55; a Java submission passes with probability 0.80. A submission is picked at random and it passed every test.

```quiz
[
  {
    "q": "**Q5 (3 marks).** What is the probability that it is written in Java? (4 decimals)",
    "type": "numeric",
    "answer": 0.3840,
    "tolerance": 0.0001,
    "explain": "Let Y: Python, P(Y) = 0.70; J: Java, P(J) = 0.30; T: passed every test, P(T | Y) = 0.55, P(T | J) = 0.80.\n\nUsing Bayes' Rule: P(J | T) = P(T | J)P(J) / [P(T | J)P(J) + P(T | Y)P(Y)] = 0.80(0.30) / [0.80(0.30) + 0.55(0.70)] = 0.24 / (0.24 + 0.385) = 0.24/0.625 = **0.3840**.\n\nSo there is a 38.40 % chance it is a Java submission. Answering 0.24 stops at the numerator, P(J and T)."
  }
]
```

## Q6 (3 marks). Bug reports per day

The number of bug reports a COMP 2800 project team receives per day has this distribution:

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P(x) | 0.15 | 0.31 | 0.24 | 0.16 | 0.09 | 0.05 |

```quiz
[
  {
    "q": "**Q6a (1 mark).** What is the probability that the team receives **at least 2** bug reports today? (4 decimals)",
    "type": "numeric",
    "answer": 0.54,
    "tolerance": 0.0001,
    "explain": "P(X ≥ 2) = P(2) + P(3) + P(4) + P(5) = 0.24 + 0.16 + 0.09 + 0.05 = **0.5400** or 54 %. Equivalently 1 − P(0) − P(1) = 1 − 0.15 − 0.31 = 0.54."
  },
  {
    "q": "**Q6b (1 mark).** What is the expected number of bug reports per day?",
    "type": "numeric",
    "answer": 1.88,
    "tolerance": 0.01,
    "explain": "E(X) = Σ[x P(x)] = 0(0.15) + 1(0.31) + 2(0.24) + 3(0.16) + 4(0.09) + 5(0.05) = 0.31 + 0.48 + 0.48 + 0.36 + 0.25 = **1.88** bug reports per day. The average of the values 0 to 5, 2.5, ignores the probabilities."
  },
  {
    "q": "**Q6c (1 mark).** Assuming days are independent, what is the probability of **no** bug reports on Monday and **at least 4** on Tuesday? (4 decimals)",
    "type": "numeric",
    "answer": 0.0210,
    "tolerance": 0.0001,
    "explain": "Since days are independent, P(0 on Monday and X ≥ 4 on Tuesday) = P(0) · [P(4) + P(5)] = 0.15 × (0.09 + 0.05) = 0.15 × 0.14 = **0.0210** or 2.10 %. Using only P(4) gives 0.0135, which is exactly 4 reports."
  }
]
```

## Q7 (4 marks). R on the survey data frame

This question uses the `survey` data frame from the library MASS. An excerpt of its help file:

| Variable | Description |
|---|---|
| (whole frame) | Responses of 237 Statistics I students at the University of Adelaide |
| `Sex` | The sex of the student: "Female" or "Male" |
| `Pulse` | Pulse rate of the student (beats per minute) |
| `Exer` | How often the student exercises: "Freq", "Some", "None" |
| `Smoke` | How much the student smokes: "Heavy", "Regul", "Occas", "Never" |
| `Height` | Height of the student in centimetres |
| `Age` | Age of the student in years |
| … | |

```quiz
[
  {
    "q": "**Q7a (1 mark).** Give an R command that would output the **75th percentile** age. Write the full command on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["quantile"],
    "explain": "`library(MASS)`\n`quantile(survey$Age, 0.75)`\nThe column is reached with `$`, and the percentile goes in as a decimal, 0.75. `quantile(~Age, probs = 0.75, data = survey)` (mosaic) is the same answer."
  },
  {
    "q": "Q7a: complete the call for the 75th percentile age.",
    "type": "fill",
    "code": "quantile(survey$Age, ___)",
    "answer": ["0.75", ".75"],
    "explain": "The second argument is a proportion, not a percent: `quantile(survey$Age, 0.75)`. Typing 75 is an error (probabilities must be between 0 and 1)."
  },
  {
    "q": "**Q7b (1 mark).** Give an R command (or commands) that would create a dataset `tall_students` consisting of all of the data for only the students **taller than 180 cm**. Write it on paper, then type the name of the function you used.",
    "type": "text",
    "answer": ["filter", "subset"],
    "explain": "`library(dplyr)`\n`tall_students <- filter(survey, Height > 180)`\nOR `tall_students <- subset(survey, Height > 180)` in base R. Inside `filter` and `subset` the column name is written bare, without `survey$`. Both drop the students whose height is missing."
  },
  {
    "q": "Q7b: complete the filter that keeps the students taller than 180 cm.",
    "type": "fill",
    "code": "tall_students <- filter(survey, Height ___ 180)",
    "answer": [">"],
    "explain": "\"Taller than 180\" is strictly greater: `Height > 180`. `>=` would also keep students exactly 180 cm tall."
  },
  {
    "q": "**Q7c (2 marks).** Give an R command (or commands) that would create side-by-side boxplots of the **pulse rates**, grouped by **how often the student exercises**, with a title and axis labels. Write it on paper, then type the name of the plotting function you used.",
    "type": "text",
    "answer": ["bwplot", "boxplot"],
    "explain": "`library(mosaic)`\n`bwplot(Pulse ~ Exer, data = survey, main = \"Pulse Rate by Exercise Frequency\", xlab = \"Exercise\", ylab = \"Pulse (beats per minute)\")`\nOR base R `boxplot(Pulse ~ Exer, data = survey, main = \"...\", xlab = \"...\", ylab = \"...\")`. The formula is `y ~ group`: the measured variable on the left, the grouping factor on the right, and `data =` names the frame. The second mark is the title and the axis labels."
  },
  {
    "q": "Q7c: which variable goes in the blank?",
    "type": "fill",
    "code": "bwplot(___ ~ Exer, data = survey)",
    "answer": ["Pulse"],
    "explain": "The response, the numeric variable whose distribution each box shows, goes on the left of `~`: `Pulse ~ Exer` draws one pulse box per exercise level. `Exer ~ Pulse` would put the factor on the wrong side."
  }
]
```

## Q8 (3 marks). R for the lab sets of Q4

The three lab sets of Q4 (A 28 students, B 35, C 41) are mixed together, and 15 students are randomly selected, without replacement, for a usability study. Write a single R command that:

```quiz
[
  {
    "q": "**Q8a (1 mark).** Simulates this scenario and determines the number of the 15 students who are from **set C**. Write it on paper, then type the function name.",
    "type": "text",
    "answer": ["rhyper"],
    "explain": "`rhyper(1, 41, 28+35, 15)`\nThe slots are: how many simulations (1), successes in the population (41 from set C), failures in the population (28 + 35, left as a sum), sample size (15). On average it returns about 15(41/104) = 5.91 students."
  },
  {
    "q": "**Q8b (1 mark).** Computes the probability that **exactly 5** of the 15 students are from **set A**. Type the function name.",
    "type": "text",
    "answer": ["dhyper"],
    "explain": "`dhyper(5, 28, 35+41, 15)`\nx = 5, successes in the population = 28 (set A), failures in the population = 35 + 41, sample size = 15. It returns 0.19663, so about 0.1966."
  },
  {
    "q": "Q8b: fill the failures-in-the-population slot.",
    "type": "fill",
    "code": "dhyper(5, 28, ___, 15)",
    "answer": ["35+41", "76", "35 + 41", "41+35"],
    "explain": "The third slot is the number of failures in the population, everyone not in set A: 35 + 41 = 76. Writing the population total 104 there describes a population of 132 students."
  },
  {
    "q": "**Q8c (1 mark).** Computes the probability that **at least 7** of the 15 students are from **set B**. Type the function name.",
    "type": "text",
    "answer": ["phyper"],
    "explain": "`1 - phyper(6, 35, 28+41, 15)`\nOR `phyper(6, 35, 28+41, 15, lower.tail = FALSE)`. At least 7 is the complement of at most 6, so the cut is 6, not 7. It returns 0.193998, so about 0.1940."
  },
  {
    "q": "Q8c: the alternative to `1 -`. Fill the blank.",
    "type": "fill",
    "code": "phyper(6, 35, 28+41, 15, lower.tail = ___)",
    "answer": ["FALSE", "F"],
    "explain": "`lower.tail = FALSE` returns P(X > 6) = P(X ≥ 7) directly, the same number as `1 - phyper(6, 35, 28+41, 15)`."
  }
]
```

## Q9 (3 marks). Skipping the CI pipeline

Running a team's continuous-integration tests costs $0.80 of cloud time per push. A developer who skips the tests risks breaking the main branch; each untested push has a 6 % chance of breaking it, which costs $40 of team time to repair.

```quiz
[
  {
    "q": "**Q9a (2 marks).** Write an R function that takes as input an integer n, the number of untested pushes, and returns the **proportion** of them that break the main branch. Your function should simulate this random process, not simply compute the average outcome. Write it on paper, then type the r-function or the sampling function you used.",
    "type": "text",
    "answer": ["rbinom", "sample"],
    "explain": "`broken_builds <- function(n) {`\n`  times_broken <- rbinom(1, n, 0.06)`\n`  return(times_broken/n)`\n`}`\nOR\n`broken_builds2 <- function(n) {`\n`  broken <- sample(0:1, n, replace = TRUE, prob = c(0.94, 0.06))`\n`  # 0 is a safe push, 1 is a broken build`\n`  return(sum(broken)/n)`\n`}`\n`mean(broken)` in place of `sum(broken)/n` is also correct. A body that returns `n*0.06/n` computes the average outcome and scores zero."
  },
  {
    "q": "Q9a: the `rbinom` version. Fill the probability slot.",
    "type": "fill",
    "code": "times_broken <- rbinom(1, n, ___)",
    "answer": ["0.06", ".06"],
    "explain": "`rbinom(m, n, p)`: one simulated count from n untested pushes, each breaking the build with p = 0.06."
  },
  {
    "q": "Q9a: the `sample` version. Fill the first probability, the one for 0 (a safe push).",
    "type": "fill",
    "code": "broken <- sample(0:1, n, replace = TRUE, prob = c(___, 0.06))",
    "answer": ["0.94", ".94"],
    "explain": "`prob` lists the probabilities in the same order as the values `0:1`: a safe push (0) has 1 − 0.06 = 0.94, a broken build (1) has 0.06. `replace = TRUE` lets the same value come up on every push."
  },
  {
    "q": "**Q9b (1 mark).** Use your function to compute the total dollars saved by a developer who skips the tests on 50 pushes. Fill the blank.",
    "type": "fill",
    "code": "50*0.80 - broken_builds(50)*50*___",
    "answer": ["40"],
    "explain": "`50*0.80 - broken_builds(50)*50*40`: the fees skipped, 50 × 0.80 = 40 dollars, minus the number of broken builds (proportion × 50) times the 40-dollar repair. The output is random."
  },
  {
    "q": "Q9b, expected value for reference: on average, how many dollars does skipping the tests on 50 pushes save? (dollars; a loss is negative)",
    "type": "numeric",
    "answer": -80.00,
    "tolerance": 0.01,
    "unit": "$",
    "explain": "Expected broken builds = 50(0.06) = 3, costing 3 × 40 = 120 dollars; fees skipped = 50 × 0.80 = 40 dollars. Expected saving = 40 − 120 = −80: **an expected loss of $80.00** over 50 pushes. A single simulation can come out positive (no broken builds) or far worse."
  }
]
```

## Q10 (4 marks). Daily passengers at YVR, 2019 to 2025

A chart shows side-by-side boxplots of the daily passenger count at YVR (thousands of passengers per day) for each year from 2019 to 2025. Approximate readings from the chart:

| Year | Lower whisker | Q1 | Median | Q3 | Upper whisker |
|---|---|---|---|---|---|
| 2019 | 58 | 64 | 69 | 73 | 78 |
| 2020 | 4 | 9 | 14 | 22 | 70 |
| 2021 | 5 | 9 | 13 | 24 | 36 |
| 2022 | 25 | 38 | 47 | 54 | 64 |
| 2023 | 45 | 55 | 61 | 67 | 74 |
| 2024 | 52 | 59 | 65 | 71 | 79 |
| 2025 | 54 | 61 | 67 | 74 | 81 |

For each statement, write TRUE or FALSE and briefly explain your answer.

```quiz
[
  {
    "q": "**Q10a (2 marks).** \"The median daily passenger count more than quadrupled from 2021 to 2023.\"",
    "type": "tf",
    "answer": true,
    "explain": "**TRUE.** The median in 2021 was about 13 thousand passengers per day and in 2023 about 61 thousand. Four times 13 is 52, and 61 is above 52 (61/13 ≈ 4.7), so the median more than quadrupled."
  },
  {
    "q": "**Q10b (2 marks).** \"2020 had the most variable daily passenger counts of any year, as measured by the interquartile range.\"",
    "type": "tf",
    "answer": false,
    "explain": "**FALSE.** The IQR is the width of the box, Q3 − Q1. In 2020 it is about 22 − 9 = 13 thousand, while 2022 has the widest box, about 54 − 38 = 16 thousand, and 2021 is also wider (24 − 9 = 15). 2020 has by far the longest **whiskers** (a range of about 66 thousand, from the busy months before the pandemic), but that is the range, not the IQR."
  }
]
```

## Q11 (5 marks). Expo Line service disruptions

On average, the SkyTrain Expo Line has a major service disruption (over 30 minutes) 4 times per year. Assume disruptions occur independently and with equal likelihood at any time of the year.

```quiz
[
  {
    "q": "**Q11a (2 marks).** What is the probability that there are **exactly three** major disruptions in the next 6 months? (4 decimals)",
    "type": "numeric",
    "answer": 0.1804,
    "tolerance": 0.0001,
    "explain": "Let X = the number of major disruptions in the next 6 months. Under the given assumptions this is a Poisson variable with mean λ = (4 per year) × 0.5 year = 2. Therefore\n\nP(X = 3) = e^(−λ) λ^x / x! = e^(−2) · 2³/3! = 0.135335 × 8/6 = **0.1804**.\n\nWith the yearly λ = 4 left unscaled the answer would be 0.1954, the probability for a whole year."
  },
  {
    "q": "**Q11b (3 marks).** What is the probability that **the next** major disruption happens between 3 and 9 months from now? (4 decimals)",
    "type": "numeric",
    "answer": 0.3181,
    "tolerance": 0.0001,
    "explain": "The event means no disruption in the next 3 months (λ = 4 × 3/12 = 1), and then at least one in the 6 months after that (λ = 4 × 6/12 = 2), which is independent of the first 3 months. Therefore\n\nP(next disruption in 3 to 9 months) = P(X = 0 in 3 months) · (1 − P(X = 0 in the next 6 months)) = e^(−1) · (1 − e^(−2)) = 0.367879 × 0.864665 = **0.3181**.\n\nThe second window is 9 − 3 = 6 months long. Using 9 months there (1 − e^(−3)) gives 0.3496, which counts the first 3 months twice."
  }
]
```

## Q12 (5 marks). The two-card face game

The rules of a game:

- You draw 2 cards, without replacement, from a standard deck.
- If both cards are face cards (J, Q or K), you win $30.
- If exactly one card is a face card, you win $3.
- Otherwise, you win nothing.

After each game the cards are replaced and the deck is reshuffled.

```quiz
[
  {
    "q": "**Q12a (1 mark).** If you play once, what is the probability that you win exactly $3? (4 decimals)",
    "type": "numeric",
    "answer": 0.3620,
    "tolerance": 0.0001,
    "explain": "There are 12 face cards and 40 others. Exactly one face card happens as face-then-other or other-then-face, two mutually exclusive orders:\n\nP(win 3) = (12/52)(40/51) + (40/52)(12/51) = 2 × 480/2652 = 960/2652 = **0.3620**.\n\nCounting only one order gives 0.1810. As hands: C(12,1)C(40,1)/C(52,2) = 480/1326, the same 0.3620."
  },
  {
    "q": "**Q12b (2 marks).** If you play repeatedly, how much do you win per game on average? (dollars)",
    "type": "numeric",
    "answer": 2.58,
    "tolerance": 0.01,
    "unit": "$",
    "explain": "P(win 30) = (12/52)(11/51) = 132/2652 = 0.0497738. E[winnings] = 30 · P(30) + 3 · P(3) + 0 · P(0) = 30(0.0497738) + 3(0.361991) + 0 = 1.49321 + 1.08597 = **$2.58** per game. The question says \"win\", so these are gross winnings; there is no cost to subtract."
  },
  {
    "q": "**Q12c (2 marks).** If you play twice, what is the probability that you win **at least $33** in total? (4 decimals)",
    "type": "numeric",
    "answer": 0.0385,
    "tolerance": 0.0001,
    "explain": "Each game pays 0, 3 or 30. A total of at least 33 needs a 30 in one game and at least 3 in the other: (30, 3), (3, 30) or (30, 30). The games are independent and these cases are mutually exclusive, so\n\nP(total ≥ 33) = 2 · P(30) · P(3) + P(30)² = 2(0.0497738)(0.361991) + 0.0497738² = 0.0360353 + 0.0024774 = **0.0385**.\n\nP(at least one 30 in two games) = 2(0.0497738) − 0.0497738² = 0.0971 also counts (30, 0), which totals only 30."
  }
]
```
