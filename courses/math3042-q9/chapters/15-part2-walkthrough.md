---
title: "The Part 2 template, worked on the practice file heights.csv"
minutes: 15
---
<!-- facts: none; counts, mean and sd recomputed from heights.csv in writer-f/heights_check.py; simulated values are described, never printed -->
The Part 2 template was posted with a practice data file, `heights.csv`. This lesson works the template heading by heading on that file: the R, what appears on screen, and a model answer with its reason.

**Expect a different file on the quiz. The code carries over with the names swapped, but the answers do not.** For example, the heights have two humps, so the answer to Q2 here is "not normal, two humps". A file of battery lives could be a bell, and then the Q2 answer is "normal".

So use this page to learn the code and the reason behind each answer. Then [Part 2 on a file you have never seen](#/math3042-q9/part2-new-data) gives the same code with blanks, the sentence to write for every shape, and three new files to practise on.

## The data: 3000 people, three columns

`heights.csv` has 3000 rows, one per person, and three columns:

- `height_cm`, the person's height in centimetres, a number.
- `age`, "Adult" or "Child".
- `sex`, "M" or "F".

Here X is one value of the variable: the height of one person. The population is all 3000 heights.

The template's first chunk loads `mosaic`, which holds `histogram`. Run it before anything else.

```r
library(mosaic)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | Loads the `mosaic` package, which supplies `histogram`. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) called mosaic (`mosaic`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Find mosaic and attach its functions (`library`)."
:::

That chunk is marked `include=FALSE`, so it is hidden in the knitted file. Every chunk you write keeps the default, which shows the code, as the template asks.

## Q1: load the data and make a two-way table

```r
heights <- read.csv("heights.csv")
head(heights)
table(heights$age, heights$sex)
```

:::info R syntax
| Code | What it does |
|---|---|
| `heights <- read.csv("heights.csv")` | Reads the file into a data frame and stores it under `heights`. The file must sit in the working directory. |
| `head(heights)` | Prints the first six rows, so you can see the column names. |
| `table(heights$age, heights$sex)` | Counts every pair of values: rows are the values of the first vector, columns the second. |
| `heights$age` | `$` picks the column `age` from the data frame. |

**Left to right**

- `heights <- read.csv("heights.csv")`: "Store under heights (`heights <-`) the data read from the CSV file (`read.csv`) named heights.csv (`"heights.csv"`)."
- `head(heights)`: "Show the first rows (`head`) of the data (`heights`)."
- `table(heights$age, heights$sex)`: "Count (`table`) each age (`heights$age`) and sex (`heights$sex`) pair."

**Right to left**, the order R runs it

- `heights <- read.csv("heights.csv")`: "Open the file, read it into a data frame (`read.csv`), store it (`<-`)."
- `head(heights)`: "Take the data, keep its first six rows, print them (`head`)."
- `table(heights$age, heights$sex)`: "Pull both columns (`$`), count each pair, print the table (`table`)."
:::

On screen, `head` prints six rows under the three column names. The table has rows Adult and Child, columns F and M, and these counts:

```diagram
{"type": "grid", "title": "table(heights$age, heights$sex), with totals added", "nodes": [{"id": "c00", "label": "", "row": 0, "col": 0}, {"id": "c01", "label": "F", "row": 0, "col": 1}, {"id": "c02", "label": "M", "row": 0, "col": 2}, {"id": "c03", "label": "total", "row": 0, "col": 3}, {"id": "c10", "label": "Adult", "row": 1, "col": 0}, {"id": "c11", "label": "827", "row": 1, "col": 1}, {"id": "c12", "label": "823", "row": 1, "col": 2}, {"id": "c13", "label": "1650", "row": 1, "col": 3}, {"id": "c20", "label": "Child", "row": 2, "col": 0}, {"id": "c21", "label": "683", "row": 2, "col": 1}, {"id": "c22", "label": "667", "row": 2, "col": 2}, {"id": "c23", "label": "1350", "row": 2, "col": 3}, {"id": "c30", "label": "total", "row": 3, "col": 0}, {"id": "c31", "label": "1510", "row": 3, "col": 1}, {"id": "c32", "label": "1490", "row": 3, "col": 2}, {"id": "c33", "label": "3000", "row": 3, "col": 3}], "hi": ["c11", "c12", "c21", "c22"], "caption": "R prints the four highlighted counts. The totals are added by hand."}
```

For example, 683 of the 3000 people are girls: Child and F. There are 1650 adults and 1350 children. Keep that split in mind for Q2.

## Q2: histogram. Does X follow a normal distribution?

```r
histogram(heights$height_cm, type="density", fit="normal",
          xlab="Height (cm)", ylab="Probability Density",
          main="Heights")
```

:::info R syntax
| Code | What it does |
|---|---|
| `histogram(heights$height_cm, …)` | From `mosaic`: bars of the 3000 heights. The first slot is the data. |
| `type="density"` | Scales the bars so their areas add to 1. |
| `fit="normal"` | Draws the best-fitting bell over the bars, to compare against. |
| `xlab=`, `ylab=`, `main=` | The x-axis label, the y-axis label and the title, each a string in quotes. |

**Left to right**

- `histogram(heights$height_cm, type="density", fit="normal", …)`: "Draw a histogram (`histogram`) of the height column (`heights$height_cm`) as a density (`type="density"`) with a fitted bell (`fit="normal"`), labelled axes (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `histogram(heights$height_cm, type="density", fit="normal", …)`: "Pull the column (`$`), sort the heights into classes, scale the bars, fit a bell to them, draw it all (`histogram`)."
:::

On screen: **two humps**. One hump sits near 125 cm: the children. The other sits near 170 cm: the adults. Between them is a dip near 145 to 150 cm. The fitted bell has one hump, so it misses both.

```diagram
{"type": "curve", "title": "Heights have two humps; the pile of means is one narrow bell", "panels": [{"title": "Population: 3000 heights", "x": [90, 210], "xlabel": "X = height (cm)", "curves": [{"dist": "mix", "parts": [[0.45, 125.05, 10.83], [0.55, 170.36, 9.27]], "tone": "ink"}], "ticks": [125, 150, 170]}, {"title": "Pile of sample means, n = 100", "x": [90, 210], "xlabel": "X-bar (cm)", "curves": [{"dist": "normal", "mu": 149.97, "sigma": 2.47, "tone": "hl"}], "ticks": [125, 150, 170]}]}
```

The second panel is the answer to Q4b, drawn on the same axis to show how narrow the pile is.

**Model answer:**

> No. The histogram has two humps, near 125 cm (children) and 170 cm (adults), so it does not follow the single bell of a normal distribution.

## Q3a: simulate X-bar for one sample of size n = 100

```r
X.sample <- sample(heights$height_cm, 100)
mean(X.sample)
```

:::info R syntax
| Code | What it does |
|---|---|
| `sample(heights$height_cm, 100)` | Draws 100 heights at random from the column: `x` is the column, `size` = 100. No row is picked twice. |
| `X.sample <- …` | Stores the 100 heights. The dot is part of the name. |
| `mean(X.sample)` | The average of the 100 heights: one value of X-bar. |

**Left to right**

- `X.sample <- sample(heights$height_cm, 100)`: "Store under X.sample (`X.sample <-`) a random sample (`sample`) of 100 (`100`) heights from the column (`heights$height_cm`)."
- `mean(X.sample)`: "The average (`mean`) of the sample (`X.sample`)."

**Right to left**, the order R runs it

- `X.sample <- sample(heights$height_cm, 100)`: "Pull the column (`$`), pick 100 of its values at random (`sample`), store them (`<-`)."
- `mean(X.sample)`: "Take the 100 heights, average them (`mean`)."
:::

On screen: one number, usually somewhere near 150. It is random, so your number will differ from anyone else's. That one number is one blue dot.

### One sample of heights, one blue dot, then the pile

The pink line is the truth, the mean of all 3000 heights. Each blue dot is one sample's average. Watch the dots: no one tells them to make a bell, and they do, although the heights have two humps.

```widget
sample-pile-play
{ "stat": "xbar", "pop": "bimodal", "n": 100, "what": "height", "unit": "cm", "title": "Two-hump heights, n = 100: the pile of sample means is a bell" }
```

## Q3b: QQ plot of the sample

```r
qqnorm(X.sample, pch=20, main="QQ Plot of a Sample (n=100)")
qqline(X.sample, col="red", lty="dashed")
```

:::info R syntax
| Code | What it does |
|---|---|
| `qqnorm(X.sample, …)` | Draws the QQ plot: the sorted 100 heights up, the ideal Z across. |
| `pch=20` | A small filled dot for each point. |
| `main="QQ Plot of a Sample (n=100)"` | The title. |
| `qqline(X.sample, …)` | Adds the reference line through the first and third quartiles. It must come after `qqnorm`, in the same chunk. |
| `col="red"`, `lty="dashed"` | The line's colour and type. |

**Left to right**

- `qqnorm(X.sample, pch=20, main=…)`: "Draw the QQ plot (`qqnorm`) of the sample (`X.sample`) with small dots (`pch=20`) and a title (`main=`)."
- `qqline(X.sample, col="red", lty="dashed")`: "Add the reference line (`qqline`) for the sample, red (`col="red"`) and dashed (`lty="dashed"`)."

**Right to left**, the order R runs it

- `qqnorm(X.sample, pch=20, main=…)`: "Sort the 100 heights, pair each with its ideal Z, plot the dots (`qqnorm`)."
- `qqline(X.sample, col="red", lty="dashed")`: "Find the sample's quartiles, draw the dashed line through them (`qqline`)."
:::

On screen, the dots do not follow the line. At the left end they flatten out above it. At the right end they flatten out below it. In the middle they climb steeply across it: few heights fall in the dip between the humps. The exact dots are random; that bend is not.

### Building the QQ plot of 100 heights

Watch the middle. The dots sit in two flat runs with a jump between them: the two humps, seen from the side.

```widget
qq-build-play
{ "shape": "bimodal", "n": 100, "title": "100 heights from two humps: the QQ plot bends across the line" }
```

## Q3c: does the sample come from a normal population?

**A sample looks like its population, however large it is.** So 100 heights show the same two humps as the 3000.

**Model answer:**

> No. The points of the QQ plot do not follow the line: both ends flatten away from it and the middle jumps across it, so the sample does not come from a normal population.

## Q4a: the mean and standard deviation of X-bar

These two numbers are the centre and the width of the pile. There are two ways to get them, and the template's chunk can show both.

### The theory: centre $\mu$, width $\sigma/\sqrt{n}$

```r
mu <- mean(heights$height_cm)
sigma <- sd(heights$height_cm)
mu
sigma/sqrt(100)
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- mean(heights$height_cm)` | The mean of all 3000 heights, stored under `mu`. |
| `sigma <- sd(heights$height_cm)` | Their standard deviation, stored under `sigma`. `sd` divides by n − 1. |
| `mu` | A name alone on a line prints its value. |
| `sigma/sqrt(100)` | `sqrt` is the square root and `/` divides: the width of the pile. |

**Left to right**

- `mu <- mean(heights$height_cm)`: "Store under mu (`mu <-`) the average (`mean`) of the height column (`heights$height_cm`)."
- `sigma <- sd(heights$height_cm)`: "Store under sigma (`sigma <-`) the standard deviation (`sd`) of the height column."
- `mu`: "Print mu (`mu`)."
- `sigma/sqrt(100)`: "Sigma (`sigma`) divided by (`/`) the square root (`sqrt`) of 100."

**Right to left**, the order R runs it

- `mu <- mean(heights$height_cm)`: "Pull the column, average it (`mean`), store it (`<-`)."
- `sigma <- sd(heights$height_cm)`: "Pull the column, find its spread (`sd`), store it (`<-`)."
- `mu`: "Look up mu, print it."
- `sigma/sqrt(100)`: "Take the root of 100 (`sqrt`), divide sigma by it (`/`), print the result."
:::

The file fixes these numbers, so everyone gets the same ones.

- $\mu = 149.97$ cm, the mean of all 3000 heights.
- $\sigma = 24.66$ cm, their standard deviation.
- $n = 100$, the heights in each sample.

The centre of the pile, the pink line:

$$\mu_{\bar{X}} = \underbrace{\mu}_{\text{mean of all heights}} = \mathbf{149.97}$$

The width of the pile, the green arrow:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{24.66}_{\sigma,\ \text{sd of all heights}}}{\underbrace{\sqrt{100}}_{n = 100\ \text{per sample}}} = \mathbf{2.47}$$

### The simulation: 10 000 sample means

```r
Xbar.vals <- replicate(10^4, mean(sample(heights$height_cm, 100)))
mean(Xbar.vals)
sd(Xbar.vals)
```

:::info R syntax
| Code | What it does |
|---|---|
| `replicate(10^4, …)` | Runs the expression 10 000 times and returns the results as one vector. `^` is a power. |
| `mean(sample(heights$height_cm, 100))` | One sample of 100 heights, boiled down to its average. |
| `Xbar.vals <- …` | Stores the 10 000 averages: the pile. |
| `mean(Xbar.vals)`, `sd(Xbar.vals)` | The centre and the width of the simulated pile. |

**Left to right**

- `Xbar.vals <- replicate(10^4, mean(sample(heights$height_cm, 100)))`: "Store under Xbar.vals (`Xbar.vals <-`) ten thousand (`10^4`) repeats (`replicate`) of the average (`mean`) of 100 random heights (`sample`)."
- `mean(Xbar.vals)`: "The average (`mean`) of the 10 000 averages."
- `sd(Xbar.vals)`: "The standard deviation (`sd`) of the 10 000 averages."

**Right to left**, the order R runs it

- `Xbar.vals <- replicate(10^4, mean(sample(heights$height_cm, 100)))`: "Pick 100 heights (`sample`), average them (`mean`), repeat 10 000 times (`replicate`), store the list (`<-`)."
- `mean(Xbar.vals)`: "Take the averages, average them (`mean`)."
- `sd(Xbar.vals)`: "Take the averages, find their spread (`sd`)."
:::

On screen: a mean very close to 150 and a standard deviation close to 2.5. Both are random, so your numbers will differ a little. The simulated width often lands a touch under 2.47, near 2.43, because `sample` never picks the same person twice in one sample. Either way it reads as about 2.5.

**The theory and the simulation agree closely: centre about 150, width about 2.5.** That is the point of the question.

**Model answer:**

> $\mu_{\bar{X}} = 149.97$ cm, the mean of all heights. $\sigma_{\bar{X}} = 24.66/\sqrt{100} = 2.47$ cm, and the mean and standard deviation of the 10 000 simulated sample means agree closely with these.

## Q4b: histogram of X-bar. Is it normal?

```r
histogram(Xbar.vals, type="density", fit="normal",
          xlab="Xbar", ylab="Probability Density",
          main="Sampling Distribution of Xbar (n = 100)")
```

:::info R syntax
| Code | What it does |
|---|---|
| `histogram(Xbar.vals, …)` | Bars of the 10 000 sample means. |
| `type="density"`, `fit="normal"` | As in Q2: bar areas add to 1, and the fitted bell is drawn over them. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title. |

**Left to right**

- `histogram(Xbar.vals, type="density", fit="normal", …)`: "Draw a histogram (`histogram`) of the sample means (`Xbar.vals`) as a density (`type="density"`) with a fitted bell (`fit="normal"`), labels (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `histogram(Xbar.vals, type="density", fit="normal", …)`: "Sort the 10 000 means into classes, scale the bars, fit a bell, draw it all (`histogram`)."
:::

On screen: one symmetric hump centred near 150, with the bars following the fitted bell. Almost all of it sits between about 143 and 157, three widths of 2.47 each side of the centre.

**Model answer:**

> Yes. The histogram of the 10 000 sample means is one symmetric hump that follows the fitted normal curve, because n = 100 is 30 or more.

## Q4c: does this contradict the Central Limit Theorem?

The heights have two humps. One sample of 100 has two humps. The pile of means is a bell. That looks like a clash. It is not: these are three different objects, and the theorem speaks about only one of them. The long version is [the three objects lesson](#/math3042-q9/population-sample-pile).

**Model answer:**

> No. The Central Limit Theorem is about the distribution of the sample mean X-bar, not about X or the values in one sample, and the 10 000 sample means do form a bell because n = 100 is 30 or more, exactly as it predicts.

:::tip If the quiz's X turns out to be a bell
Then Q2 and Q3c become "yes", with the same reasons turned round: one hump that follows the fitted curve, points that follow the line. Q4b stays "yes", and Q4c stays "no".
:::

:::warn If the quiz's file or its n is different
The shape you name in Q2 and Q3c comes from the pictures on your screen, not from this page. And if n is below 30 while X is not a bell, the histogram of X-bar can stay skewed, so Q4b becomes "not normal". Q4c is still "no": the theorem only promises a bell for n of 30 or more. [Part 2 on a file you have never seen](#/math3042-q9/part2-new-data) has the sentence for each case.
:::

## Knit to Word, with your name in it

- Type your name in the `author` field at the top of the template.
- Knit to Word: open the drop-down next to "Preview" and choose Word. The header's `output` field then lists `word_document`.
- Knit re-runs every chunk from the top in a fresh session, so the `library` line for `mosaic` must stay in the first chunk.
- Knit once at the start with the template as it is, then again after each question, so an error shows up early.

## Before you hand it in

- Q1: the data loads and the two-way table shows four counts.
- Q2: a histogram with the fitted curve, and a one-sentence answer with the shape as the reason.
- Q3a: one sample of 100 and its mean.
- Q3b: `qqnorm`, then `qqline`, in one chunk.
- Q3c: a verdict that names what the dots do against the line.
- Q4a: both numbers, by theory and by simulation, and the sentence that they agree.
- Q4b: the histogram of the 10 000 means and "yes, because n = 100 is 30 or more".
- Q4c: "no", naming X-bar as what the theorem is about.
- Your name is in the `author` field, and the Word file knits without errors.
