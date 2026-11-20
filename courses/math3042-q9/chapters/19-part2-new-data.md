---
title: "Part 2 on a file you have never seen"
minutes: 15
---
<!-- facts: none; counts, means, sds and sd/sqrt(n) recomputed from practice/commute.csv, battery.csv, wait.csv in writer-j/check.py; simulated values are described as "about", never printed as exact -->
The template's headings stay the same on quiz day. Only the data file changes. A new file changes exactly four things: the file name, the name of the number column (that is X), the names of the two word columns (for the table), and possibly n. Everything else is the same code.

**What you do with this page: memorize the skeleton below, then practise it on the three files further down.**

## Three practice files

Download the three files here:

- [commute.csv](courses/math3042-q9/practice/commute.csv): travel times to campus.
- [battery.csv](courses/math3042-q9/practice/battery.csv): phone battery life.
- [wait.csv](courses/math3042-q9/practice/wait.csv): waiting times at a support desk.

The folder `D:\BCIT\MATH3042\quiz9-practice` already holds them. Next to them sit three blank notebooks in the template's shape: `Practice_commute.Rmd`, `Practice_battery.Rmd` and `Practice_wait.Rmd`. Open one, fill it in, then check it against the model answers below.

## The first minute with a new file

Before any question, look at the file. Four lines do it.

```r
d <- read.csv("FILE.csv")
head(d)
str(d)
nrow(d)
```

`read.csv` and `head` work exactly as in [the template, worked on heights.csv](#/math3042-q9/part2-walkthrough). The short name `d` stands for "data". Any name works, as long as you use the same one everywhere.

Two functions are new here.

:::info R syntax
| Code | What it does |
|---|---|
| `str(d)` | Shows the structure: one line per column, with its name, its type and its first few values. |
| `nrow(d)` | The number of rows: how many values the population holds. |

**Left to right**

- `str(d)`: "Show the structure (`str`) of the data (`d`)."
- `nrow(d)`: "Count the rows (`nrow`) of the data (`d`)."

**Right to left**, the order R runs it

- `str(d)`: "Take the data, list each column with its type and first values (`str`)."
- `nrow(d)`: "Take the data, count its rows, print the count (`nrow`)."
:::

`str` sorts the columns into two kinds for you.

- **A number column** shows `num` or `int`, and values like `24 60.9 64`. That column is **X**. It goes in the histogram, in `sample`, in `mean` and in `sd`.
- **A word column** shows `chr`, and values like `"Bus" "Car"`. It goes in `table`. For example, a column of campus names is a word column, just like the labels on mailboxes: you count them, you never average them.

:::warn Column names are case-sensitive
`d$Minutes` is not `d$minutes`. R returns `NULL` for a name it cannot find, and every line that uses it then fails or prints `NA`. Copy every name from the `head` output, letter for letter.
:::

:::tip R cannot open the file?
Use Session > Set Working Directory > To Source File Location. The `.Rmd` and the `.csv` must sit in the same folder.
:::

## The skeleton: four blanks

Here is the whole of Part 2 once. The capital words are the blanks. The letter `n` is the sample size; type the number in its place.

```r
library(mosaic)

# Q1
d <- read.csv("FILE.csv")
head(d)
table(d$WORD1, d$WORD2)

# Q2
histogram(d$NUM, type="density", fit="normal",
          xlab="X", ylab="Probability Density",
          main="Histogram of X")

# Q3a
X.sample <- sample(d$NUM, n)
mean(X.sample)

# Q3b
qqnorm(X.sample, pch=20, main="QQ Plot of a Sample")
qqline(X.sample, col="red", lty="dashed")

# Q4a
mu <- mean(d$NUM)
sigma <- sd(d$NUM)
mu
sigma/sqrt(n)
Xbar.vals <- replicate(10^4, mean(sample(d$NUM, n)))
mean(Xbar.vals)
sd(Xbar.vals)

# Q4b
histogram(Xbar.vals, type="density", fit="normal",
          xlab="Xbar", ylab="Probability Density",
          main="Sampling Distribution of Xbar")
```

The R is the same as in [the template, worked on heights.csv](#/math3042-q9/part2-walkthrough), with the names swapped. The token-by-token reading of every line is there.

The text inside `xlab`, `main` and the other labels is only a label. Type any sensible words.

| Blank | Where you find it |
|---|---|
| `FILE` | The file name in the quiz folder, without `.csv` (the skeleton adds it). |
| `NUM` | The column `str` marks `num` or `int`. |
| `WORD1`, `WORD2` | The two columns `str` marks `chr`. The first gives the rows. If the quiz names no order, either works. |
| `n` | The number in the heading of Q3a: "one Sample of Size n = …". Use it in Q3a and in Q4a. |

**Use the same n in Q3a, in `sigma/sqrt(n)` and in `replicate`.** The template asks for one sample size throughout.

## What to write: the answer bank

The R draws a picture. Your answer is one sentence about it. These sentences carry over to any file.

### Q2 and Q3c: what shape is X?

Q2 reads the histogram of every value of X. Q3c reads the QQ plot of one sample. **A sample looks like its population**, so both give the same verdict.

| What you see | Histogram (Q2) | QQ plot (Q3c) | Write |
|---|---|---|---|
| Bell | One symmetric hump; the bars follow the fitted curve. | The dots follow the line, with a little wobble at the ends. | Normal: one symmetric hump / dots on the line. |
| Right skewed | Tall bars at the left, a long tail to the right. | The left end lies almost flat, just above the line. The right end curves up steeply, far above it. | Not normal: right skewed, long tail to the right. |
| Left skewed | Tall bars at the right, a long tail to the left. | The right end lies almost flat, just below the line. The left end curves down steeply, far below it. | Not normal: left skewed, long tail to the left. |
| Two humps | Two peaks with a dip between them. | Flattens above the line at the left, a steep jump across the middle, flattens below at the right. | Not normal: two humps, not one bell. |
| Flat, no tails | Bars of about the same height, then a sudden stop at both sides. | An S that flattens at both ends. | Not normal: flat, no tails. |
| Heavy tails | One hump, but far more extreme values than the fitted curve allows. | On the line through the middle. The left end drops below it and the right end climbs above it. | Not normal: heavy tails on both sides. |

:::tip Judge the middle, forgive the ends
One or two dots off the line at the ends is wobble. A steady bend, where the dots leave the line and keep moving away, is a shape.
:::

### Building the QQ plot of a right-skewed sample

Watch the right end. The biggest values run far past where a bell would put them.

```widget
qq-build-play
{ "shape": "right", "n": 100, "title": "Right skewed: the right end curves up far above the line" }
```

### Q4b and Q4c: the decision

First read the shape of X from Q2. Then look at n. Those two facts decide both answers.

| Case | Q4b: is the histogram of X-bar normal? | Q4c: contradiction? |
|---|---|---|
| (a) X normal, any n | Yes. X-bar is normal because X is normal. | No. The theorem is not even needed: averages of bell values are a bell for every n. |
| (b) X not normal, n ≥ 30 | Yes, approximately normal, by the Central Limit Theorem. | No. The theorem is about the averages, not about X or about one sample. |
| (c) X not normal, n < 30 | Not necessarily: the histogram of X-bar may still be skewed. | No. The theorem only promises a bell for n ≥ 30, so a skewed pile at small n does not go against it. |

**Q4c is always "no". The reason changes with the case.** For example, a bakery's skewed loaf weights with n = 50 is case (b); the same loaves with n = 4 is case (c).

The formula sheet prints the condition as $n > 30$; the notes teach it as $n \ge 30$.

### The pile of means, from n = 1 to n = 100

The population on top is right skewed. Watch the pile below. At n = 5 it still leans right: that is case (c). By n = 30 and n = 100 it is close to a bell: that is case (b).

```widget
xbar-n-play
{ "pop": "skew", "mu": 40.2, "sigma": 39.18, "ns": [1, 5, 30, 100], "title": "Skewed waits: the pile of means still leans at n = 5 and is close to a bell by n = 30" }
```

### Q4a: the two numbers

- $\mu_{\bar{X}}$ (say "mu of X-bar") is the mean of the number column: `mean(d$NUM)`.
- $\sigma_{\bar{X}}$ (say "sigma of X-bar") is the sd of the number column divided by the root of n: `sigma/sqrt(n)`.

`mean(Xbar.vals)` and `sd(Xbar.vals)` should land close to these two. `sample` draws without replacement, so in a small file `sd(Xbar.vals)` comes out a little under $\sigma/\sqrt{n}$. **Report the formula's value.**

## Worked on a new file: commute.csv

The file holds 1500 students. X is the travel time of one student, in minutes. The quiz's n is 100.

The four blanks:

- `FILE` = `commute`
- `NUM` = `minutes`
- `WORD1` = `mode` ("Bus", "Car", "SkyTrain"), `WORD2` = `campus` ("Burnaby", "Downtown")
- `n` = 100

```r
d <- read.csv("commute.csv")
table(d$mode, d$campus)
histogram(d$minutes, type="density", fit="normal",
          xlab="Minutes", ylab="Probability Density", main="Commute times")
X.sample <- sample(d$minutes, 100)
Xbar.vals <- replicate(10^4, mean(sample(d$minutes, 100)))
```

The other lines change the same way. The table R prints:

| | Burnaby | Downtown |
|---|---|---|
| Bus | 454 | 187 |
| Car | 236 | 118 |
| SkyTrain | 362 | 143 |

**Q2.** On screen: one peak near 15 to 25 minutes, and a long tail to the right, out past 100 minutes.

> No. The histogram has one peak near 15 to 25 minutes and a long tail to the right, so X is right skewed, not normal.

**Q3c.** On screen: the left end lies flat, just above the line; the right end curves up steeply, far above it.

> No. The QQ plot's right end curves up far above the line, the pattern of a right skew, so the sample does not come from a normal population.

**Q4a.** The file fixes these numbers.

- $\mu = 31.86$ minutes, the mean of all 1500 travel times.
- $\sigma = 18.26$ minutes, their standard deviation.
- $n = 100$, the students in each sample.

$$\sigma_{\bar{X}} = \dfrac{\underbrace{18.26}_{\sigma,\ \text{sd of all times}}}{\underbrace{\sqrt{100}}_{n = 100}} = \dfrac{18.26}{10} = \mathbf{1.83}$$

> $\mu_{\bar{X}} = 31.86$ minutes and $\sigma_{\bar{X}} = 18.26/\sqrt{100} = 1.83$ minutes. The simulated means have a mean near 31.9 and a standard deviation of about 1.8, close to these.

**Q4b.** On screen: one symmetric hump centred near 31.9, following the fitted curve. This is case (b).

> Yes. The histogram of the 10 000 sample means is one symmetric hump that follows the fitted normal curve, because n = 100 is 30 or more.

**Q4c.**

> No. The Central Limit Theorem is about the distribution of X-bar, not about X or one sample. X is right skewed, but n = 100 is 30 or more, so the sample means form a bell, as the theorem predicts.

## Two more files, where the answer changes

**On these two files, a memorized heights answer would be wrong.**

### battery.csv: X is a bell, n = 10

800 phones. X is the battery life of one phone, in hours.

- `FILE` = `battery`, `NUM` = `hours`, `WORD1` = `os` ("Android", "iOS"), `WORD2` = `size` ("Compact", "Large"), `n` = 10.
- The table: Android 176 Compact, 270 Large; iOS 113 Compact, 241 Large.

$$\sigma_{\bar{X}} = \dfrac{\underbrace{1.80}_{\sigma,\ \text{sd of all hours}}}{\underbrace{\sqrt{10}}_{n = 10}} = \dfrac{1.80}{3.162} = \mathbf{0.57}$$

**Q2.**

> Yes. The histogram is one symmetric hump that follows the fitted normal curve, so X follows a normal distribution.

**Q3c.** On screen: ten dots close to the line, with a little wobble.

> Yes. The points of the QQ plot lie close to the line, and the histogram of X in Q2 is a bell, so the sample comes from a normal population.

:::warn Ten dots is a thin check
[The QQ plot lesson](#/math3042-q9/qq-plot) asks for about 15 points at least. With 10, lean on Q2: the histogram of all 800 values shows the shape clearly.
:::

**Q4a.**

> $\mu_{\bar{X}} = 11.38$ hours and $\sigma_{\bar{X}} = 1.80/\sqrt{10} = 0.57$ hours. The simulated means have a mean near 11.4 and a standard deviation of about 0.57.

**Q4b.** Case (a).

> Yes. The histogram of the sample means follows the fitted normal curve. X is normal, so X-bar is normal for any n, even n = 10.

**Q4c.**

> No. X is normal, so X-bar is normal for every n. The theorem's n ≥ 30 condition is not needed here.

### wait.csv: X strongly right skewed, n = 5

2000 support requests. X is the waiting time of one request, in seconds.

- `FILE` = `wait`, `NUM` = `seconds`, `WORD1` = `queue` ("Chat", "Phone"), `WORD2` = `tier` ("Free", "Paid"), `n` = 5.
- The table: Chat 923 Free, 306 Paid; Phone 556 Free, 215 Paid.

$$\sigma_{\bar{X}} = \dfrac{\underbrace{39.18}_{\sigma,\ \text{sd of all waits}}}{\underbrace{\sqrt{5}}_{n = 5}} = \dfrac{39.18}{2.236} = \mathbf{17.52}$$

**Q2.** On screen: the tallest bar at the far left, and a long tail to the right.

> No. The tallest bar is at the far left and a long tail runs to the right, so X is strongly right skewed, not normal.

**Q3c.** Five dots cannot show a shape well; they may even sit near the line by chance.

> No. Five points are too few to judge from the QQ plot alone, and the histogram of X in Q2 is strongly right skewed, so the sample comes from a population that is not normal.

**Q4a.**

> $\mu_{\bar{X}} = 40.20$ seconds and $\sigma_{\bar{X}} = 39.18/\sqrt{5} = 17.52$ seconds. The simulated means have a mean near 40 and a standard deviation of about 17.5.

**Q4b.** On screen: the pile still leans, with a longer tail to the right. Case (c).

> No. The histogram of the sample means is still right skewed, with a longer tail on the right, because X is skewed and n = 5 is far below 30.

**Q4c.**

> No. The theorem promises a bell only when X is normal or n ≥ 30. Here X is skewed and n = 5, so the theorem promises nothing, and a skewed pile does not go against it.

## Check yourself on new files

```quiz
[
  {"q": "A file `parking.csv` opens with `head(d)` showing three columns: `lot` (\"North\", \"South\"), `hours` (2.5, 0.75, 6, 1.25, …) and `permit` (\"Daily\", \"Monthly\"). Which column is X, the one for the histogram and `sample`?", "options": ["`d$lot`", "`d$hours`", "`d$permit`", "`d$parking`"], "answer": 1, "explain": "X must be a number: `hours` holds numbers, the time one car stays parked. `lot` and `permit` are word columns: they go in `table`. `parking` is the file name, not a column."},
  {"q": "In the same file, Q1 asks for a two-way table with the lots as rows and the permit types as columns. Which line makes it?", "options": ["`table(d$hours, d$lot)`", "`table(d$permit, d$lot)`", "`table(d$lot, d$permit)`", "`table(lot, permit)`"], "answer": 2, "explain": "`table` puts the first vector in the rows and the second in the columns. Rows = lot, so `d$lot` goes first; columns = permit, so `d$permit` goes second. `$` is needed to pull each column out of `d`."},
  {"type": "numeric", "q": "A file of coffee-shop order times prints `sd(d$seconds)` = 8.35 seconds. The quiz's n is 25. Find $\\sigma_{\\bar{X}}$ to 2 decimals.", "answer": 1.67, "tolerance": 0.006, "explain": "$\\sigma = 8.35$ is the sd of all order times, $n = 25$ the orders in each sample. $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{8.35}_{\\sigma}}{\\underbrace{\\sqrt{25}}_{n = 25}} = \\dfrac{8.35}{5} = \\mathbf{1.67}$$"},
  {"q": "The histogram of X, download times, is right skewed. The quiz's n is 8. Which pair of answers fits Q4b and Q4c?", "options": ["Q4b yes, by the Central Limit Theorem; Q4c no", "Q4b yes, because X-bar is always normal; Q4c no", "Q4b no; Q4c yes, the theorem has failed", "Q4b not necessarily: the pile may still be skewed; Q4c no, the theorem only promises a bell for n ≥ 30"], "answer": 3, "explain": "X = one download time, right skewed, so the first door (X normal) is shut. $n = 8 < 30$, so the second door is shut too. The pile may still lean right, and the theorem promised nothing, so there is no contradiction."},
  {"q": "The histogram of X, the fill weight of one cereal box, is one symmetric hump that follows the fitted curve. The quiz's n is 6. Which pair of answers fits Q4b and Q4c?", "options": ["Q4b yes: X is normal, so X-bar is normal for any n; Q4c no", "Q4b no: n = 6 is under 30; Q4c no", "Q4b no: n = 6 is under 30; Q4c yes", "Q4b yes, by the Central Limit Theorem because n ≥ 30; Q4c no"], "answer": 0, "explain": "X = one box's fill weight, a bell. Averages of bell values are a bell for every n, so $n = 6$ does not matter. The theorem's $n \\ge 30$ is not needed, and nothing is contradicted."},
  {"q": "A QQ plot of 100 exam scores: the right end lies almost flat, just below the line. The left end curves down steeply, far below it. What do you write for Q3c?", "options": ["Yes: the middle is on the line", "No: left skewed, a long tail of low scores", "No: right skewed, a long tail of high scores", "No: two humps"], "answer": 1, "explain": "An end steeper than the line means a long tail on that side. Here the steep end is the left one, so a few very low scores stretch the left tail: left skewed, not normal."},
  {"type": "tf", "q": "X, a SkyTrain platform's crowd size, has two humps. One sample of n = 200 is drawn. Because 200 is 30 or more, the answer to Q3c is yes.", "answer": false, "explain": "The 30 rule is about the pile of sample means, not one sample. A sample looks like its population: 200 crowd sizes show the same two humps, so the QQ plot bends and the answer is no."},
  {"type": "numeric", "q": "A COMP lab file prints `mean(d$minutes)` = 52.3 for the time one student spends on a lab, and the quiz's n is 40. What is $\\mu_{\\bar{X}}$?", "answer": 52.3, "tolerance": 0.01, "explain": "$\\mu = 52.3$ is the mean of all lab times. The pile of sample means is centred on the truth for every n, so $$\\mu_{\\bar{X}} = \\underbrace{\\mu}_{\\text{mean of all times}} = \\mathbf{52.3}$$ The $n = 40$ changes only the width, $\\sigma/\\sqrt{40}$."}
]
```
