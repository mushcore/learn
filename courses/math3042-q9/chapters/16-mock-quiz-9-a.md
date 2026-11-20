---
title: "Mock Quiz 9 A: Part 1 on paper (10 marks), Part 2 in RStudio (10 marks)"
minutes: 50
---
<!-- facts: none; a timed mock in the real two-part format: new campus, help-desk and coffee-shop numbers on paper, a new delivery-times data set in RStudio -->
A full Quiz 9 in its real shape: four questions on paper worth 10 marks, then the posted RStudio template on a new data set of delivery times worth 10 marks.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator and the Z table: for a pile, give its centre, its width and its shape with the reason; for an interval, write the six lines. Then 25 minutes for Part 2: write the code on paper, or in RStudio if you have it open. The items below check one line at a time; p-hat, a standard error of p-hat, E and interval limits to 4 decimals.
:::

## Part 1 on paper: four questions, 10 marks

> **Q1 [3 marks].** A campus transport survey reports that 24% of all BCIT Burnaby students bike to campus. A student club will ask a random sample of 150 students whether they bike. Let $\hat{p}$ = the share of bikers in the sample.
>
> a. [1] Find the mean of the sampling distribution of $\hat{p}$.
>
> b. [1] Find the standard deviation of the sampling distribution of $\hat{p}$.
>
> c. [1] Is the sampling distribution of $\hat{p}$ approximately normal? Show the check.
>
> **Q2 [4 marks].** The BCIT IT help desk draws a random sample of 300 tickets from this term. 87 of them are password resets. Construct a 95% confidence interval for p, the proportion of all this term's tickets that are password resets. Include the six lines: conditions, confidence level, critical value, margin of error, limits, and a one-sentence conclusion.
>
> **Q3 [2 marks].** A coffee roaster in Burnaby fills bags of beans. The weight X of a bag is normally distributed with mean 340 g and standard deviation 6 g. Quality control weighs a random sample of 16 bags and takes their mean weight $\bar{X}$.
>
> a. [½] Find the mean of the sampling distribution of $\bar{X}$.
>
> b. [1] Find the standard deviation of the sampling distribution of $\bar{X}$.
>
> c. [½] What is the shape of the sampling distribution of $\bar{X}$? Give the reason.
>
> **Q4 [1 mark].** Back to the help desk in Q2. Next term the desk samples 1200 tickets, four times as many, and again finds $\hat{p} = 0.29$. Find the new margin of error at 95%, and say what happened to it.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Sampling distribution of $\hat{p}$: $\mu_{\hat{p}} = p$, $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$; $\hat{p}$ is normally distributed as long as $np \ge 5$ and $nq \ge 5$.
- Confidence interval for p: $\hat{p} - E < p < \hat{p} + E$, $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$.
- Sampling distribution of $\bar{X}$: $\mu_{\bar{X}} = \mu$, $\sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$; $\bar{X}$ is normally distributed as long as X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- $q = 1 - p$; $\hat{p} = X/n$; $\hat{q} = 1 - \hat{p}$.
- $\alpha = 1 -$ the confidence level. The critical value $z_{\alpha/2}$ has area $1 - \alpha/2$ to its left: read it from the inside of the Z table, or `qnorm(1 - alpha/2)`.
- The six lines of an interval answer, and the conclusion pattern: "We are 95% confident that the proportion of … is between … and …".
- The notes write the size rule as $n \ge 30$, 30 or more.
:::

```quiz
[
  {
    "q": "**Q1a (1 mark).** 24% of all students bike; samples of 150. The mean of the sampling distribution of $\\hat{p}$, $\\mu_{\\hat{p}}$ = ? (as a decimal)",
    "type": "numeric",
    "answer": 0.24,
    "tolerance": 0.0002,
    "explain": "Here $p = 0.24$ is the share of ALL students who bike, the truth about the population, and $n = 150$ is the sample size. The pile of sample shares is centred on the truth: $$\\mu_{\\hat{p}} = p = \\underbrace{0.24}_{\\text{share of all students who bike}}$$ The sample size does not move the centre; it only changes the width. Answering $np = 36$ gives the mean count of bikers, not the mean share."
  },
  {
    "q": "**Q1b (1 mark).** Same survey. The standard deviation of the sampling distribution of $\\hat{p}$, $\\sigma_{\\hat{p}}$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0349,
    "tolerance": 0.0002,
    "explain": "With $p = 0.24$ the share who bike, $q = 1 - 0.24 = 0.76$ the share who do not, and $n = 150$ students. Work the fraction under the root first: $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.24}_{p\\text{, bike}} \\times \\underbrace{0.76}_{q\\text{, do not}}}{\\underbrace{150}_{\\text{sample size}}} = 0.001216$$ Then take the root of the whole fraction: $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.001216}}_{\\text{root of the whole fraction}} = \\mathbf{0.0349}$$ The exact value is 0.034871. Rooting only the top and then dividing by 150 gives 0.0028, which is far too narrow."
  },
  {
    "q": "**Q1c (½ mark), the check.** Same survey. $np$ = ?",
    "type": "numeric",
    "answer": 36,
    "tolerance": 0.01,
    "explain": "The bell check uses the truth p, because p is known here: $$np = \\underbrace{150}_{\\text{sample size}} \\times \\underbrace{0.24}_{\\text{share who bike}} = \\mathbf{36}$$ $$nq = \\underbrace{150}_{\\text{sample size}} \\times \\underbrace{0.76}_{\\text{share who do not}} = \\mathbf{114}$$ Both counts go on the page."
  },
  {
    "q": "**Q1c (½ mark), the verdict.** Is the sampling distribution of $\\hat{p}$ approximately normal? Type YES or NO.",
    "type": "text",
    "answer": ["YES", "Yes", "yes"],
    "explain": "**YES**: $np = 36 \\ge 5$ and $nq = 114 \\ge 5$, so both conditions pass and the pile of $\\hat{p}$ is approximately a bell, centred at 0.24 with standard deviation 0.0349. Write both numbers and both comparisons; the verdict alone earns nothing."
  },
  {
    "q": "**Q2 conditions (½ mark).** 87 password resets in 300 tickets. $\\hat{p}$ = ? (as a decimal)",
    "type": "numeric",
    "answer": 0.29,
    "tolerance": 0.0001,
    "explain": "X = 87 is the number of successes, the password resets, and $n = 300$ is the number of tickets sampled. $$\\hat{p} = \\dfrac{X}{n} = \\dfrac{\\underbrace{87}_{\\text{resets}}}{\\underbrace{300}_{\\text{tickets}}} = \\mathbf{0.29}$$ $$\\hat{q} = 1 - \\underbrace{0.29}_{\\hat{p}} = \\mathbf{0.71}$$ Here p is unknown: it is what the interval estimates. So the conditions use $\\hat{p}$ and $\\hat{q}$."
  },
  {
    "q": "**Q2 conditions (½ mark).** Same sample. $n\\hat{q}$ = ?",
    "type": "numeric",
    "answer": 213,
    "tolerance": 0.01,
    "explain": "The first line of the answer checks both counts: $$n\\hat{p} = \\underbrace{300}_{\\text{tickets}} \\times \\underbrace{0.29}_{\\hat{p}} = 87 \\ge 5$$ $$n\\hat{q} = \\underbrace{300}_{\\text{tickets}} \\times \\underbrace{0.71}_{\\hat{q}} = \\mathbf{213} \\ge 5$$ These are just the 87 resets and the 213 other tickets. Both pass, so the procedure is valid. If either were below 5, the rest of the procedure would be invalid."
  },
  {
    "q": "**Q2 level and critical value (½ mark).** 95% confidence. $z_{\\alpha/2}$ = ?",
    "type": "numeric",
    "answer": 1.96,
    "tolerance": 0.001,
    "explain": "Confidence level $1 - \\alpha = 0.95$, so $\\alpha = 0.05$ and $\\alpha/2 = 0.025$ sits in each tail. The critical z has 0.025 to its right, so $1 - 0.025 = 0.975$ to its left. Find 0.9750 inside the Z table: row 1.9, column .06. $$z_{\\alpha/2} = \\underbrace{z_{0.025}}_{0.025 \\text{ to the right}} = \\mathbf{1.96}$$ In R, `qnorm(1 - 0.05/2)` gives 1.959964. Using 1.645 is the 90% value: it comes from putting all of $\\alpha$ in one tail."
  },
  {
    "q": "**Q2 margin of error (1 mark).** Same sample, 95%. E = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0513,
    "tolerance": 0.0006,
    "explain": "With $\\hat{p} = 0.29$ the share of resets, $\\hat{q} = 0.71$ the share of other tickets, $n = 300$ tickets and $z_{0.025} = 1.96$. The fraction under the root first: $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.29}_{\\hat{p}} \\times \\underbrace{0.71}_{\\hat{q}}}{\\underbrace{300}_{\\text{tickets}}} = 0.00068633$$ $$\\sqrt{\\dfrac{\\hat{p}\\hat{q}}{n}} = \\underbrace{\\sqrt{0.00068633}}_{\\text{standard error}} = 0.026198$$ $$E = \\underbrace{1.96}_{z_{0.025}} \\times \\underbrace{0.026198}_{\\text{standard error}} = \\mathbf{0.0513}$$ Rounding the standard error to 0.0262 first gives 0.0514; both are accepted."
  },
  {
    "q": "**Q2 limits (½ mark), the lower limit.** $\\hat{p} - E$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.2387,
    "tolerance": 0.0006,
    "explain": "$$\\hat{p} - E = \\underbrace{0.29}_{\\hat{p}} - \\underbrace{0.0513}_{E} = \\mathbf{0.2387}$$ With E = 0.0514 the lower limit is 0.2386, also accepted."
  },
  {
    "q": "**Q2 limits (½ mark), the upper limit.** $\\hat{p} + E$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.3413,
    "tolerance": 0.0006,
    "explain": "$$\\hat{p} + E = \\underbrace{0.29}_{\\hat{p}} + \\underbrace{0.0513}_{E} = \\mathbf{0.3413}$$ The interval is $0.2387 < p < 0.3413$, centred on the sample's 0.29."
  },
  {
    "q": "**Q2 conclusion (½ mark).** Which sentence is the conclusion line?",
    "options": [
      "We are 95% confident that the proportion of all this term's help-desk tickets that are password resets is between 23.87% and 34.13%.",
      "There is a 95% probability that the sample proportion of password resets is between 23.87% and 34.13%.",
      "95% of this term's help-desk tickets are password resets.",
      "We are 95% confident that between 23.87% and 34.13% of the 300 sampled tickets are password resets."
    ],
    "answer": 0,
    "explain": "The conclusion names the confidence level, the population proportion p in the story's words (all this term's tickets), and the two limits. The sample proportion is known exactly, 0.29, so there is nothing uncertain about it. The 300 sampled tickets hold exactly 29% resets. The interval is a statement about all tickets, the share nobody has counted."
  },
  {
    "q": "**Q3a (½ mark).** Bag weight X normal with mean 340 g and standard deviation 6 g; samples of 16 bags. $\\mu_{\\bar{X}}$ = ? (in g)",
    "type": "numeric",
    "answer": 340,
    "tolerance": 0.01,
    "explain": "Here X is the weight of one bag, $\\mu = 340$ g the mean weight of all bags and $\\sigma = 6$ g their standard deviation; $n = 16$ bags per sample. The average of the averages is the population mean: $$\\mu_{\\bar{X}} = \\mu = \\underbrace{340}_{\\text{mean of all bags}} \\text{ g}$$"
  },
  {
    "q": "**Q3b (1 mark).** Same bags. $\\sigma_{\\bar{X}}$ = ? (in g)",
    "type": "numeric",
    "answer": 1.5,
    "tolerance": 0.01,
    "explain": "The standard error of the mean divides the spread of one bag by the root of the sample size: $$\\sigma_{\\bar{X}} = \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{\\underbrace{6}_{\\text{sd of one bag}}}{\\underbrace{\\sqrt{16}}_{\\text{root of 16 bags}}} = \\dfrac{6}{4} = \\mathbf{1.5 \\text{ g}}$$ A mean of 16 bags typically lands within about 1.5 g of 340, while one bag typically lands within about 6 g. Dividing by 16 instead of by its root gives 0.375, which is too narrow."
  },
  {
    "q": "**Q3c (½ mark).** Same bags. Which is the shape of the sampling distribution of $\\bar{X}$, with the right reason?",
    "options": [
      "Normal, because X itself is normally distributed, so the mean of any sample size is normal.",
      "Normal, because $n = 16 \\ge 5$.",
      "Not normal, because $n = 16$ is less than 30.",
      "Cannot say, because the population mean is unknown."
    ],
    "answer": 0,
    "explain": "The rule has two doors. Door one: X is normal, and then $\\bar{X}$ is normal for any n. Door two: X is not normal but $n \\ge 30$. Here the story says the bag weight is normally distributed, so door one opens and the size of 16 does not matter. The $\\ge 5$ checks belong to $\\hat{p}$, not to $\\bar{X}$."
  },
  {
    "q": "**Q4 (1 mark).** The desk samples 1200 tickets and again finds $\\hat{p} = 0.29$. The new E at 95% = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0257,
    "tolerance": 0.0006,
    "explain": "Same $\\hat{p} = 0.29$ and $\\hat{q} = 0.71$, now with $n = 1200$ tickets. $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.29}_{\\hat{p}} \\times \\underbrace{0.71}_{\\hat{q}}}{\\underbrace{1200}_{\\text{tickets}}} = 0.00017158$$ $$\\sqrt{\\dfrac{\\hat{p}\\hat{q}}{n}} = \\underbrace{\\sqrt{0.00017158}}_{\\text{standard error}} = 0.013099$$ $$E = \\underbrace{1.96}_{z_{0.025}} \\times \\underbrace{0.013099}_{\\text{standard error}} = \\mathbf{0.0257}$$ **E is cut in half**: n sits under a square root, and $\\sqrt{4} = 2$. The shortcut: $0.0513 / 2 = 0.0257$. Four times the work buys only twice the precision."
  }
]
```

## Part 2 in RStudio: delivery times, 10 marks

> **Premise.** A food-delivery app near BCIT Burnaby shares a file `deliveries.csv` with 2400 rows, one per delivery. Its columns are `minutes` (the delivery time, a number), `zone` ("North" or "South") and `vehicle` ("Bike" or "Car"). Let X = the delivery time of one delivery, in minutes. In the file, the mean of `minutes` is 28.4, its standard deviation (R's `sd`) is 12.6, its median is 25.1, the shortest delivery is 6.2 minutes and the longest is 96.5. Most deliveries take 18 to 30 minutes; a few take over an hour.

The template below is the notebook's code chunk, in the shape of the posted Quiz 9 template. Every `Something` is yours to write; the marks for each part sit in its comment.

```r
library(mosaic)
# Q1 Load the data; two-way table of zone by vehicle               [1 mark]
deliveries <- Something
Something
# Q2 Histogram of minutes. Does X follow a normal distribution?    [2 marks]
Something
# Q3a One sample of size n = 49, and its mean                      [1 mark]
X.sample <- Something
mean(X.sample)
# Q3b QQ plot of the sample, with its reference line                [1 mark]
Something
Something
# Q3c Does the sample come from a normal population?   Answer:     [1 mark]
# Q4a Mean and standard deviation of X-bar for n = 49               [2 marks]
mu <- mean(deliveries$minutes)
sigma <- sd(deliveries$minutes)
sigma/sqrt(49)
Xbar.vals <- Something
mean(Xbar.vals)
sd(Xbar.vals)
# Q4b Histogram of Xbar.vals. Is it normal?   Answer:              [1 mark]
Something
# Q4c Does this contradict the Central Limit Theorem?   Answer:    [1 mark]
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | `library()` loads a package; `mosaic` holds `histogram()`. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `deliveries <- Something` | `<-` stores a value under a name: your data frame, stored as `deliveries`. |
| `X.sample <- Something` | Your one sample of 49 delivery times. The dot is part of the name. |
| `mean(X.sample)` | `mean()` adds the values and divides by how many there are: the sample's x-bar. |
| `mu <- mean(deliveries$minutes)` | `$` picks one column of a data frame by name, here `minutes`; its mean is stored as `mu`. |
| `sigma <- sd(deliveries$minutes)` | `sd()` is the sample standard deviation, dividing by n − 1; stored as `sigma`. |
| `sigma/sqrt(49)` | `sqrt()` is the square root and `/` divides: the theory value of the standard error. |
| `Xbar.vals <- Something` | Your vector of 10 000 sample means. |
| `mean(Xbar.vals)` and `sd(Xbar.vals)` | The centre and the width of the simulated pile of sample means. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) mosaic (`mosaic`)."
- `deliveries <- Something`: "Store under the name deliveries (`deliveries <-`) your expression (`Something`)."
- `Something` in Q1, Q2, Q3b, Q4b: "Your line (`Something`)."
- `X.sample <- Something`: "Store under the name X.sample (`X.sample <-`) your expression (`Something`)."
- `mean(X.sample)`: "The mean (`mean`) of X.sample (`X.sample`)."
- `mu <- mean(deliveries$minutes)`: "Store under the name mu (`mu <-`) the mean (`mean`) of the minutes column (`$minutes`) of deliveries (`deliveries`)."
- `sigma <- sd(deliveries$minutes)`: "Store under the name sigma (`sigma <-`) the standard deviation (`sd`) of the minutes column (`$minutes`) of deliveries (`deliveries`)."
- `sigma/sqrt(49)`: "sigma (`sigma`) divided by (`/`) the square root (`sqrt`) of 49 (`49`)."
- `Xbar.vals <- Something`: "Store under the name Xbar.vals (`Xbar.vals <-`) your expression (`Something`)."
- `mean(Xbar.vals)` and `sd(Xbar.vals)`: "The mean (`mean`) and the standard deviation (`sd`) of Xbar.vals (`Xbar.vals`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Load mosaic (`library`)."
- `deliveries <- Something`: "Evaluate your expression (`Something`) and store it as deliveries (`deliveries <-`)."
- `Something` in Q1, Q2, Q3b, Q4b: "Run your line (`Something`)."
- `X.sample <- Something`: "Evaluate your expression (`Something`) and store it as X.sample (`X.sample <-`)."
- `mean(X.sample)`: "Take X.sample (`X.sample`) and average it (`mean`)."
- `mu <- mean(deliveries$minutes)`: "Take deliveries (`deliveries`), pull out its minutes column (`$minutes`), average it (`mean`) and store it as mu (`mu <-`)."
- `sigma <- sd(deliveries$minutes)`: "Take deliveries (`deliveries`), pull out its minutes column (`$minutes`), find its standard deviation (`sd`) and store it as sigma (`sigma <-`)."
- `sigma/sqrt(49)`: "Take the square root of 49 (`sqrt(49)`), then divide sigma by it (`sigma/`)."
- `Xbar.vals <- Something`: "Evaluate your expression (`Something`) and store it as Xbar.vals (`Xbar.vals <-`)."
- `mean(Xbar.vals)` and `sd(Xbar.vals)`: "Take Xbar.vals (`Xbar.vals`), then average it (`mean`) or find its standard deviation (`sd`)."
:::

Check the template one slot at a time. Each explain gives the full line and what appears on screen. Simulated numbers change a little on every run.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Sampling distribution of $\bar{X}$: $\mu_{\bar{X}} = \mu$, $\sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$; $\bar{X}$ is normally distributed as long as X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- A sample looks like its population: one sample of a skewed variable is skewed too.
- A QQ plot close to a straight line means normal; a curve away from the line means not normal. A little wobble at the two ends is typical.
- The notes write the size rule as $n \ge 30$, 30 or more.
:::

```quiz
[
  {
    "type": "fill",
    "q": "**Q1 (½ mark).** Load the file into a data frame. Fill the function name.",
    "code": "deliveries <- ___(\"deliveries.csv\")",
    "answer": ["read.csv"],
    "explain": "The full line: `deliveries <- read.csv(\"deliveries.csv\")`. `read.csv()` reads a comma-separated file into a data frame, one row per delivery. The file must sit in the working directory, or the string must give its path. `head(deliveries)` then shows the first six rows."
  },
  {
    "type": "fill",
    "q": "**Q1 (½ mark).** A two-way table with the zones as rows and the vehicles as columns. Fill the column name.",
    "code": "table(deliveries$zone, deliveries$___)",
    "answer": ["vehicle"],
    "explain": "The full line: `table(deliveries$zone, deliveries$vehicle)`. With two vectors, `table()` counts every pair: rows are the values of the first (North, South) and columns the values of the second (Bike, Car). Each cell is the number of deliveries in that zone by that vehicle, and the four cells add to 2400. Column names are case-sensitive: `Vehicle` would give an error."
  },
  {
    "type": "fill",
    "q": "**Q2 (½ mark).** A histogram of the delivery times. Fill the function name (the `mosaic` one).",
    "code": "___(deliveries$minutes, type=\"density\", fit=\"normal\", xlab=\"Minutes\", ylab=\"Probability Density\", main=\"Delivery times\")",
    "answer": ["histogram"],
    "explain": "The full line: `histogram(deliveries$minutes, type=\"density\", fit=\"normal\", xlab=\"Minutes\", ylab=\"Probability Density\", main=\"Delivery times\")`. `histogram()` comes from `mosaic`, loaded on the first line. `type=\"density\"` makes the bar areas add to 1 so a curve can sit on them."
  },
  {
    "type": "fill",
    "q": "**Q2 (½ mark).** Draw the fitted normal curve over the bars. Fill the string, quotes included.",
    "code": "histogram(deliveries$minutes, type=\"density\", fit=___)",
    "answer": ["\"normal\"", "'normal'"],
    "explain": "The full argument: `fit=\"normal\"`. It draws the bell with the data's own mean and standard deviation, here 28.4 and 12.6, over the bars. The question is then whether the bars follow that bell."
  },
  {
    "q": "**Q2 (1 mark).** The histogram shows one hump at about 20 to 25 minutes and bars that thin out slowly to the right, out to 96.5 minutes. Does X follow a normal distribution?",
    "options": [
      "No. The histogram is right skewed: one hump with a long tail to the right, so the bars do not follow the fitted bell. The mean 28.4 above the median 25.1 says the same.",
      "Yes. There is only one hump, so the delivery times are normal.",
      "Yes. With 2400 deliveries, the Central Limit Theorem makes X normal.",
      "No. The mean 28.4 is above the median 25.1, so X is left skewed."
    ],
    "answer": 0,
    "explain": "A bell has one hump AND is symmetric, with the bars following the curve on both sides. Here the right side stretches out to 96.5 minutes while the left stops at 6.2: right skewed. A few long deliveries pull the mean above the median. The Central Limit Theorem is about the pile of sample means, never about X itself: 2400 rows of a skewed variable are still skewed."
  },
  {
    "type": "fill",
    "q": "**Q3a (½ mark).** One random sample of 49 delivery times. Fill the sample size.",
    "code": "X.sample <- sample(deliveries$minutes, ___)",
    "answer": ["49"],
    "explain": "The full line: `X.sample <- sample(deliveries$minutes, 49)`. `sample(x, size)` draws `size` values from `x` at random, without replacement. The result is 49 numbers, one sample."
  },
  {
    "type": "fill",
    "q": "**Q3a (½ mark).** The mean of that one sample. Fill the function name.",
    "code": "___(X.sample)",
    "answer": ["mean"],
    "explain": "The full line: `mean(X.sample)`. It prints one number, this sample's x-bar, somewhere near 28.4. A second run of the sample line gives a different sample and a different x-bar: that is the dot moving."
  },
  {
    "type": "fill",
    "q": "**Q3b (½ mark).** Draw the QQ plot of the sample. Fill the function name.",
    "code": "___(X.sample, pch=20, main=\"QQ Plot of a Sample (n=49)\")",
    "answer": ["qqnorm"],
    "explain": "The full line: `qqnorm(X.sample, pch=20, main=\"QQ Plot of a Sample (n=49)\")`. `qqnorm()` sorts the 49 values and plots each against where a perfect normal sample of 49 would put it: Theoretical Quantiles across, Sample Quantiles up. `pch=20` draws small filled dots."
  },
  {
    "type": "fill",
    "q": "**Q3b (½ mark).** Add the reference line, red and dashed. Fill the function name.",
    "code": "___(X.sample, col=\"red\", lty=\"dashed\")",
    "answer": ["qqline"],
    "explain": "The full line: `qqline(X.sample, col=\"red\", lty=\"dashed\")`. `qqline()` adds the straight line through the first and third quartiles to the plot `qqnorm()` just drew, so it goes after `qqnorm()` in the same chunk. `qqnorm` again would draw a second plot instead."
  },
  {
    "q": "**Q3c (1 mark).** Suppose the QQ plot shows the lowest points above the dashed line and almost flat, the middle points just below it, and the highest points climbing steeply to end far above it. Does the sample come from a normal population?",
    "options": [
      "No. The points bend away from the line in a curve that turns up at the right: the sample is right skewed, so it does not come from a normal population.",
      "Yes. Points that wander off the line at the two ends are typical, so this is normal.",
      "Yes. A sample of 49 is at least 30, so it comes from a normal population.",
      "No. The points follow the line, but 49 values are too few to judge."
    ],
    "answer": 0,
    "explain": "A normal sample gives points that roughly follow the line, with small wobbles only at the very ends. Here the whole pattern is a curve: short left tail (low values bunched and flat), long right tail (high values far above where a bell would put them). That is the right-skewed pattern, and it matches the histogram in Q2: **a sample looks like its population**. The 30 rule is about the pile of sample means, not about one sample. 49 points are plenty: a QQ plot needs about 15."
  },
  {
    "type": "fill",
    "q": "**Q4a (½ mark).** Simulate 10 000 sample means, each from a sample of 49 delivery times. Fill the function name.",
    "code": "Xbar.vals <- ___(10^4, mean(sample(deliveries$minutes, 49)))",
    "answer": ["replicate"],
    "explain": "The full line: `Xbar.vals <- replicate(10^4, mean(sample(deliveries$minutes, 49)))`. `replicate(m, expr)` runs the expression m times and collects the results: 10 000 fresh samples of 49, each boiled down to its mean. `Xbar.vals` holds 10 000 numbers, the pile."
  },
  {
    "q": "**Q4a (½ mark).** $\\mu_{\\bar{X}}$ for samples of 49 = ? (in minutes)",
    "type": "numeric",
    "answer": 28.4,
    "tolerance": 0.01,
    "explain": "X is one delivery time with $\\mu = 28.4$ minutes, the mean of the whole file. The average of the averages is the population mean: $$\\mu_{\\bar{X}} = \\mu = \\underbrace{28.4}_{\\text{mean of all 2400 deliveries}} \\text{ minutes}$$ `mu` prints 28.4; `mean(Xbar.vals)` prints a number very close to it, a little different each run."
  },
  {
    "q": "**Q4a (1 mark).** $\\sigma_{\\bar{X}}$ for samples of 49 = ? (in minutes)",
    "type": "numeric",
    "answer": 1.8,
    "tolerance": 0.01,
    "explain": "With $\\sigma = 12.6$ minutes, the standard deviation of all deliveries, and $n = 49$ deliveries per sample: $$\\sigma_{\\bar{X}} = \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{\\underbrace{12.6}_{\\text{sd of one delivery}}}{\\underbrace{\\sqrt{49}}_{\\text{root of 49}}} = \\dfrac{12.6}{7} = \\mathbf{1.8 \\text{ minutes}}$$ This is what `sigma/sqrt(49)` prints. `sd(Xbar.vals)` prints a number close to 1.8, a little different each run. 12.6 is the width of one delivery, not of the pile."
  },
  {
    "q": "**Q4b (1 mark).** `histogram(Xbar.vals, type=\"density\", fit=\"normal\")`. Is the distribution of $\\bar{X}$ normal, and why?",
    "options": [
      "Yes, approximately: $n = 49$ is at least 30, so by the Central Limit Theorem the sample means pile up into a bell centred at 28.4 with width 1.8, even though X is skewed.",
      "No: X is right skewed, so its sample means are right skewed too.",
      "No: the one sample in Q3 was right skewed, so the pile of means is too.",
      "Yes: X is normally distributed, so the means are normal for any n."
    ],
    "answer": 0,
    "explain": "Door two of the rule: X is not normal, but $n = 49 \\ge 30$, so $\\bar{X}$ is approximately normal. On screen the bars form one symmetric hump that follows the fitted curve, centred near 28.4 and much narrower than the histogram in Q2. In each sample of 49, the few long deliveries are averaged with many ordinary ones, so the long tail washes out."
  },
  {
    "q": "**Q4c (1 mark).** X is skewed (Q2), one sample is skewed (Q3), and the sample means are normal (Q4b). Does this contradict the Central Limit Theorem?",
    "options": [
      "No. The theorem says nothing about X or about one sample; it says the means of samples of size 30 or more pile up into a bell, and that is what Q4b shows.",
      "Yes. The theorem says a sample of 49 must be normal, and Q3 was not.",
      "Yes. The theorem says that with 2400 rows the population must be normal.",
      "No. The theorem only applies when X is normal, so it does not cover this file."
    ],
    "answer": 0,
    "explain": "Three different objects, three different shapes. The population, X, is skewed: the theorem never claims otherwise. One sample of 49 looks like its population, so it is skewed too. The pile of 10 000 sample means is a bell, because $n = 49 \\ge 30$: **that is exactly what the Central Limit Theorem predicts**, so there is no contradiction. The last option is wrong because the theorem's whole point is the non-normal case."
  }
]
```

The paper-side summary is on [the know-cold sheet](#/math3042-q9/know-cold-q9); the moves are taught in [the pile of p-hat](#/math3042-q9/phat-sampling-distribution), [a confidence interval for p](#/math3042-q9/ci-for-p), [the Central Limit Theorem](#/math3042-q9/clt-shape-rule), [the QQ plot](#/math3042-q9/qq-plot) and [the Part 2 template worked](#/math3042-q9/part2-walkthrough).
