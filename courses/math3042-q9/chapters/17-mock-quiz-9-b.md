---
title: "Mock Quiz 9 B: new contexts, the same shapes"
minutes: 50
---
<!-- facts: none; a second timed mock: a factory line, a 99% interval, a skewed population and a sample size on paper, a new left-skewed lab-scores data set in RStudio -->
A second full Quiz 9: four paper questions with a 99% interval and a skewed population, then the posted RStudio template on a new data set of lab scores.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator and the Z table, 25 for Part 2 on paper or in RStudio. For a pile, give its centre, its width and its shape with the reason; for an interval, write the six lines; p-hat, a standard error of p-hat, E and interval limits to 4 decimals; a sample size as a whole number.
:::

## Part 1 on paper: four questions, 10 marks

> **Q1 [3 marks].** A factory line in Delta makes phone cases. 6% of all cases come off the line with a flaw. An inspector takes a random sample of 120 cases. Let $\hat{p}$ = the share of flawed cases in the sample.
>
> a. [½] Find the mean of the sampling distribution of $\hat{p}$.
>
> b. [1] Find the standard deviation of the sampling distribution of $\hat{p}$.
>
> c. [1] Is the sampling distribution of $\hat{p}$ approximately normal? Show the check.
>
> d. [½] A second inspector samples only 50 cases. Is the sampling distribution of $\hat{p}$ approximately normal for that sample size?
>
> **Q2 [4 marks].** At a SkyTrain station, a random sample of 400 riders is asked whether they would use a covered bike rack if one were built. 148 say yes. Construct a 99% confidence interval for p, the proportion of all riders at the station who would use it. Include the six lines: conditions, confidence level, critical value, margin of error, limits, and a one-sentence conclusion.
>
> **Q3 [2 marks].** The length X of a student's visit to the BCIT library is right skewed: most visits are short, a few last many hours. The mean visit is 52 minutes and the standard deviation 27 minutes. A study records a random sample of 36 visits and takes their mean $\bar{X}$.
>
> a. [½] Find the mean of the sampling distribution of $\bar{X}$.
>
> b. [½] Find the standard deviation of the sampling distribution of $\bar{X}$.
>
> c. [½] What is the shape of the sampling distribution of $\bar{X}$? Give the reason.
>
> d. [½] A second study uses samples of only 12 visits. Is the sampling distribution of $\bar{X}$ normal for that sample size?
>
> **Q4 [1 mark].** Before next year's survey, the station wants a 95% confidence interval for p with a margin of error of at most 0.025. There is no earlier estimate of p. How many riders must it sample?

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Sampling distribution of $\hat{p}$: $\mu_{\hat{p}} = p$, $\sigma_{\hat{p}} = \sqrt{\dfrac{pq}{n}}$; $\hat{p}$ is normally distributed as long as $np \ge 5$ and $nq \ge 5$.
- Confidence interval for p: $\hat{p} - E < p < \hat{p} + E$, $E = z_{\alpha/2}\sqrt{\dfrac{\hat{p}\hat{q}}{n}}$, conditions $n\hat{p} \ge 5$, $n\hat{q} \ge 5$.
- Sampling distribution of $\bar{X}$: $\mu_{\bar{X}} = \mu$, $\sigma_{\bar{X}} = \dfrac{\sigma}{\sqrt{n}}$; $\bar{X}$ is normally distributed as long as X is normally distributed, or $n > 30$.
- Sample size for a confidence interval for p: $n = \dfrac{1}{4}[z_{\alpha/2} \cdot \dfrac{1}{E}]^2$; with p and q known, $n = pq[z_{\alpha/2} \cdot \dfrac{1}{E}]^2$.

**Not on the sheet, so know it:**

- $q = 1 - p$; $\hat{p} = X/n$; $\hat{q} = 1 - \hat{p}$.
- $\alpha = 1 -$ the confidence level. The critical value $z_{\alpha/2}$ has area $1 - \alpha/2$ to its left: read it from the inside of the Z table, or `qnorm(1 - alpha/2)`.
- The six lines of an interval answer, and the conclusion pattern: "We are 99% confident that the proportion of … is between … and …".
- A sample size is a whole number of people, always rounded UP.
- The notes write the size rule as $n \ge 30$, 30 or more.
:::

```quiz
[
  {
    "q": "**Q1a (½ mark).** 6% of all cases are flawed; samples of 120. $\\mu_{\\hat{p}}$ = ? (as a decimal)",
    "type": "numeric",
    "answer": 0.06,
    "tolerance": 0.0002,
    "explain": "Here $p = 0.06$ is the share of ALL cases that are flawed, the truth about the line, and $n = 120$ is the sample size. The pile of sample shares is centred on the truth: $$\\mu_{\\hat{p}} = p = \\underbrace{0.06}_{\\text{share of all cases flawed}}$$ Writing 6 is the percent, and 7.2 is the mean count of flawed cases, $np$; the question asks for the mean share."
  },
  {
    "q": "**Q1b (1 mark).** Same line. $\\sigma_{\\hat{p}}$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0217,
    "tolerance": 0.0002,
    "explain": "With $p = 0.06$ the share flawed, $q = 1 - 0.06 = 0.94$ the share without a flaw, and $n = 120$ cases. The fraction under the root first: $$\\dfrac{pq}{n} = \\dfrac{\\underbrace{0.06}_{p\\text{, flawed}} \\times \\underbrace{0.94}_{q\\text{, fine}}}{\\underbrace{120}_{\\text{sample size}}} = 0.00047$$ Then the root of the whole fraction: $$\\sigma_{\\hat{p}} = \\underbrace{\\sqrt{0.00047}}_{\\text{root of the whole fraction}} = \\mathbf{0.0217}$$ The exact value is 0.021679. Leaving off the root gives 0.00047, the variance, not the standard deviation."
  },
  {
    "q": "**Q1c (½ mark), the check.** Same line, samples of 120. $np$ = ? (1 decimal)",
    "type": "numeric",
    "answer": 7.2,
    "tolerance": 0.01,
    "explain": "p is known, so the check uses p and q: $$np = \\underbrace{120}_{\\text{sample size}} \\times \\underbrace{0.06}_{\\text{share flawed}} = \\mathbf{7.2}$$ $$nq = \\underbrace{120}_{\\text{sample size}} \\times \\underbrace{0.94}_{\\text{share fine}} = \\mathbf{112.8}$$ The counts do not have to be whole numbers: they are expected counts."
  },
  {
    "q": "**Q1c (½ mark), the verdict.** Samples of 120. Is the sampling distribution of $\\hat{p}$ approximately normal? Type YES or NO.",
    "type": "text",
    "answer": ["YES", "Yes", "yes"],
    "explain": "**YES**: $np = 7.2 \\ge 5$ and $nq = 112.8 \\ge 5$, so both conditions pass. It passes, though not by much: a rare event needs a big sample before the pile becomes a bell."
  },
  {
    "q": "**Q1d (½ mark).** Samples of only 50 cases. Is the sampling distribution of $\\hat{p}$ approximately normal? Type YES or NO.",
    "type": "text",
    "answer": ["NO", "No", "no"],
    "explain": "$$np = \\underbrace{50}_{\\text{sample size}} \\times \\underbrace{0.06}_{\\text{share flawed}} = 3$$ $$nq = \\underbrace{50}_{\\text{sample size}} \\times \\underbrace{0.94}_{\\text{share fine}} = 47$$ **NO**: $np = 3$ is below 5. A sample of 50 holds about 3 flawed cases, so $\\hat{p}$ can only take a few values near 0 (0, 0.02, 0.04, …), piled against the left wall: skewed right, not a bell. One failed condition is enough."
  },
  {
    "q": "**Q2 conditions (½ mark).** 148 yes in 400 riders. $\\hat{p}$ = ? (as a decimal)",
    "type": "numeric",
    "answer": 0.37,
    "tolerance": 0.0001,
    "explain": "X = 148 is the number of successes, the riders who say yes, and $n = 400$ is the number asked. $$\\hat{p} = \\dfrac{X}{n} = \\dfrac{\\underbrace{148}_{\\text{yes}}}{\\underbrace{400}_{\\text{riders asked}}} = \\mathbf{0.37}$$ $$\\hat{q} = 1 - \\underbrace{0.37}_{\\hat{p}} = \\mathbf{0.63}$$ p is unknown, so the conditions use $\\hat{p}$ and $\\hat{q}$."
  },
  {
    "q": "**Q2 conditions (½ mark).** Same sample. $n\\hat{q}$ = ?",
    "type": "numeric",
    "answer": 252,
    "tolerance": 0.01,
    "explain": "$$n\\hat{p} = \\underbrace{400}_{\\text{riders}} \\times \\underbrace{0.37}_{\\hat{p}} = 148 \\ge 5$$ $$n\\hat{q} = \\underbrace{400}_{\\text{riders}} \\times \\underbrace{0.63}_{\\hat{q}} = \\mathbf{252} \\ge 5$$ The 148 yes answers and the 252 others. Both pass, so the procedure is valid."
  },
  {
    "q": "**Q2 level and critical value (½ mark).** 99% confidence. $z_{\\alpha/2}$ = ? (3 decimals)",
    "type": "numeric",
    "answer": 2.576,
    "tolerance": 0.007,
    "explain": "Confidence level $1 - \\alpha = 0.99$, so $\\alpha = 0.01$ and $\\alpha/2 = 0.005$ sits in each tail. The critical z has $1 - 0.005 = 0.995$ to its left. In the Z table, 0.9950 sits exactly between the cells 0.9949 at $z = 2.57$ and 0.9951 at $z = 2.58$. The course uses the value R gives: $$z_{\\alpha/2} = \\underbrace{z_{0.005}}_{0.005 \\text{ to the right}} = \\mathbf{2.576}$$ In R, `qnorm(1 - 0.01/2)` gives 2.575829. Readings 2.57, 2.575 and 2.58 are accepted. Using 2.33 puts all of $\\alpha$ in one tail; that is the 98% value."
  },
  {
    "q": "**Q2 margin of error (1 mark).** Same sample, 99%. E = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.0622,
    "tolerance": 0.0006,
    "explain": "With $\\hat{p} = 0.37$ the share who say yes, $\\hat{q} = 0.63$ the share who do not, $n = 400$ riders and $z_{0.005} = 2.576$. The fraction under the root first: $$\\dfrac{\\hat{p}\\hat{q}}{n} = \\dfrac{\\underbrace{0.37}_{\\hat{p}} \\times \\underbrace{0.63}_{\\hat{q}}}{\\underbrace{400}_{\\text{riders}}} = 0.00058275$$ $$\\sqrt{\\dfrac{\\hat{p}\\hat{q}}{n}} = \\underbrace{\\sqrt{0.00058275}}_{\\text{standard error}} = 0.024140$$ $$E = \\underbrace{2.576}_{z_{0.005}} \\times \\underbrace{0.024140}_{\\text{standard error}} = \\mathbf{0.0622}$$ With 2.58 you get 0.0623, with 2.57 you get 0.0620; all are accepted. At 95% the same sample would give $1.96 \\times 0.024140 = 0.0473$: more confidence costs a longer arm."
  },
  {
    "q": "**Q2 limits (½ mark), the lower limit.** $\\hat{p} - E$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.3078,
    "tolerance": 0.0006,
    "explain": "$$\\hat{p} - E = \\underbrace{0.37}_{\\hat{p}} - \\underbrace{0.0622}_{E} = \\mathbf{0.3078}$$"
  },
  {
    "q": "**Q2 limits (½ mark), the upper limit.** $\\hat{p} + E$ = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.4322,
    "tolerance": 0.0006,
    "explain": "$$\\hat{p} + E = \\underbrace{0.37}_{\\hat{p}} + \\underbrace{0.0622}_{E} = \\mathbf{0.4322}$$ The interval is $0.3078 < p < 0.4322$."
  },
  {
    "q": "**Q2 conclusion (½ mark).** Which sentence is the conclusion line?",
    "options": [
      "We are 99% confident that the proportion of all riders at the station who would use a covered bike rack is between 30.78% and 43.22%.",
      "There is a 99% probability that $\\hat{p}$ is between 30.78% and 43.22%.",
      "99% of the riders at the station would use a covered bike rack.",
      "We are 99% confident that 37% of all riders at the station would use a covered bike rack."
    ],
    "answer": 0,
    "explain": "The conclusion names the level, the population proportion in the story's words (all riders at the station), and both limits. $\\hat{p} = 0.37$ is known exactly, so no probability statement about it is needed. The last option drops the interval: 37% is only the sample's share, the centre of the arm."
  },
  {
    "q": "**Q3a (½ mark).** Library visits: right skewed, mean 52 minutes, standard deviation 27 minutes; samples of 36. $\\mu_{\\bar{X}}$ = ? (in minutes)",
    "type": "numeric",
    "answer": 52,
    "tolerance": 0.01,
    "explain": "Here X is the length of one visit, $\\mu = 52$ minutes the mean of all visits and $\\sigma = 27$ minutes their standard deviation; $n = 36$ visits per sample. $$\\mu_{\\bar{X}} = \\mu = \\underbrace{52}_{\\text{mean of all visits}} \\text{ minutes}$$ The skew does not move the centre of the pile."
  },
  {
    "q": "**Q3b (½ mark).** Same visits. $\\sigma_{\\bar{X}}$ = ? (in minutes)",
    "type": "numeric",
    "answer": 4.5,
    "tolerance": 0.01,
    "explain": "$$\\sigma_{\\bar{X}} = \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{\\underbrace{27}_{\\text{sd of one visit}}}{\\underbrace{\\sqrt{36}}_{\\text{root of 36 visits}}} = \\dfrac{27}{6} = \\mathbf{4.5 \\text{ minutes}}$$ One visit typically lands about 27 minutes from 52; the mean of 36 visits typically lands about 4.5 minutes from 52. Dividing by 36 instead of by its root gives 0.75, far too narrow."
  },
  {
    "q": "**Q3c (½ mark).** Samples of 36 visits. Which is the shape of the sampling distribution of $\\bar{X}$, with the right reason?",
    "options": [
      "Approximately normal: X is not normal, but $n = 36 \\ge 30$, so the Central Limit Theorem applies.",
      "Right skewed, because the visit lengths are right skewed.",
      "Normal, because X is normally distributed.",
      "Approximately normal, because $n\\hat{p} \\ge 5$ and $n\\hat{q} \\ge 5$."
    ],
    "answer": 0,
    "explain": "The rule has two doors. Door one, X normal, is shut: the story says the visits are right skewed. Door two opens: $n = 36$ is 30 or more. So the pile of $\\bar{X}$ is approximately a bell, centred at 52 with width 4.5, even though the visits themselves are skewed. The $n\\hat{p}$ checks belong to proportions, not to means."
  },
  {
    "q": "**Q3d (½ mark).** Samples of only 12 visits. Is the sampling distribution of $\\bar{X}$ normal?",
    "options": [
      "We cannot say it is normal: X is right skewed and $n = 12$ is below 30, so neither door opens. The pile of means is less skewed than X, but may still be skewed.",
      "Yes: 12 is more than 5, so the means are normal.",
      "Yes: the mean of any sample is normal by the Central Limit Theorem.",
      "No: with $n = 12$ the mean of $\\bar{X}$ is no longer 52."
    ],
    "answer": 0,
    "explain": "Door one needs X normal: it is not. Door two needs $n \\ge 30$: 12 is not. So the rule gives no guarantee, and the answer is that the shape cannot be called normal. The centre is still 52 at any n; only the width changes, to $27/\\sqrt{12} = 7.79$ minutes. A highly skewed X needs a larger n before the pile becomes a bell."
  },
  {
    "q": "**Q4 (1 mark).** 95% confidence, margin of error at most 0.025, no earlier estimate of p. The smallest sample size n = ?",
    "type": "numeric",
    "answer": 1537,
    "tolerance": 0.5,
    "explain": "With no estimate of p, use the sheet's first line, which sets $p = q = 1/2$, the worst case, so $pq = 1/4$. Here $z_{0.025} = 1.96$ for 95% and $E = 0.025$. Work the bracket first: $$\\dfrac{\\underbrace{1.96}_{z_{0.025}}}{\\underbrace{0.025}_{E}} = 78.4$$ $$n = \\underbrace{\\dfrac{1}{4}}_{pq \\text{ at worst}} \\times \\underbrace{78.4^2}_{6146.56} = 1536.64$$ A sample size is a whole number of people and must reach the target, so **round UP**: $$n = \\underbrace{1537}_{1536.64 \\text{ rounded up}}$$ 1536 riders would give a margin a little above 0.025. Rounding down is the trap."
  }
]
```

## Part 2 in RStudio: lab scores, 10 marks

> **Premise.** A COMP course shares a file `labscores.csv` with 1800 rows, one per lab submission. Its columns are `score` (out of 100), `section` ("Day" or "Evening") and `campus` ("Burnaby" or "Downtown"). Let X = the score of one submission. In the file, the mean of `score` is 78.3, its standard deviation (R's `sd`) is 13.6, its median is 82.5, the lowest score is 12 and the highest is 100. Most scores sit between 80 and 95; a few are very low.

The template below is the notebook's code chunk, in the shape of the posted Quiz 9 template. Every `Something` is yours to write; the marks for each part sit in its comment.

```r
library(mosaic)
# Q1 Load the data; two-way table of section by campus              [1 mark]
labs <- Something
Something
# Q2 Histogram of score. Does X follow a normal distribution?       [2 marks]
Something
# Q3a One sample of size n = 64, and its mean                        [1 mark]
X.sample <- Something
mean(X.sample)
# Q3b QQ plot of the sample, with its reference line                  [1 mark]
Something
Something
# Q3c Does the sample come from a normal population?   Answer:       [1 mark]
# Q4a Mean and standard deviation of X-bar for n = 64                 [2 marks]
mu <- Something
sigma <- Something
sigma/sqrt(64)
Xbar.vals <- replicate(10^4, mean(sample(labs$score, 64)))
mean(Xbar.vals)
sd(Xbar.vals)
# Q4b Histogram of Xbar.vals. Is it normal?   Answer:                [1 mark]
Something
# Q4c Does this contradict the Central Limit Theorem?   Answer:      [1 mark]
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(mosaic)` | `library()` loads a package; `mosaic` holds `histogram()`. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `labs <- Something` | `<-` stores a value under a name: your data frame, stored as `labs`. |
| `X.sample <- Something` | Your one sample of 64 scores. The dot is part of the name. |
| `mean(X.sample)` | `mean()` adds the values and divides by how many there are: the sample's x-bar. |
| `mu <- Something` and `sigma <- Something` | Store your population mean and standard deviation under these names. |
| `sigma/sqrt(64)` | `sqrt()` is the square root and `/` divides: the theory value of the standard error. |
| `replicate(10^4, …)` | `replicate(m, expr)` runs the expression m times and keeps every result; `^` raises to a power, so `10^4` is 10 000. |
| `mean(sample(labs$score, 64))` | `$` picks the `score` column; `sample(x, size)` draws 64 of its values without replacement; `mean()` boils them to one number. |
| `Xbar.vals <- …` | Stores the 10 000 sample means as `Xbar.vals`. |
| `mean(Xbar.vals)` and `sd(Xbar.vals)` | The centre and the width of the simulated pile; `sd()` divides by n − 1. |

**Left to right**

- `library(mosaic)`: "Load the package (`library`) mosaic (`mosaic`)."
- `labs <- Something`: "Store under the name labs (`labs <-`) your expression (`Something`)."
- `Something` in Q1, Q2, Q3b, Q4b: "Your line (`Something`)."
- `X.sample <- Something`: "Store under the name X.sample (`X.sample <-`) your expression (`Something`)."
- `mean(X.sample)`: "The mean (`mean`) of X.sample (`X.sample`)."
- `mu <- Something` and `sigma <- Something`: "Store under each name (`<-`) your expression (`Something`)."
- `sigma/sqrt(64)`: "sigma (`sigma`) divided by (`/`) the square root (`sqrt`) of 64 (`64`)."
- `Xbar.vals <- replicate(10^4, mean(sample(labs$score, 64)))`: "Store under the name Xbar.vals (`Xbar.vals <-`) the results of repeating (`replicate`) 10 to the power 4 times (`10^4`) the mean (`mean`) of a random sample (`sample`) of 64 (`64`) values from the score column (`$score`) of labs (`labs`)."
- `mean(Xbar.vals)` and `sd(Xbar.vals)`: "The mean (`mean`) and the standard deviation (`sd`) of Xbar.vals (`Xbar.vals`)."

**Right to left**, the order R runs it

- `library(mosaic)`: "Load mosaic (`library`)."
- `labs <- Something`: "Evaluate your expression (`Something`) and store it as labs (`labs <-`)."
- `Something` in Q1, Q2, Q3b, Q4b: "Run your line (`Something`)."
- `X.sample <- Something`: "Evaluate your expression (`Something`) and store it as X.sample (`X.sample <-`)."
- `mean(X.sample)`: "Take X.sample (`X.sample`) and average it (`mean`)."
- `mu <- Something` and `sigma <- Something`: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `sigma/sqrt(64)`: "Take the square root of 64 (`sqrt(64)`), then divide sigma by it (`sigma/`)."
- `Xbar.vals <- replicate(10^4, mean(sample(labs$score, 64)))`: "Work out 10 000 (`10^4`); then, 10 000 times (`replicate`), take labs (`labs`), pull out its score column (`$score`), draw 64 values (`sample`) and average them (`mean`); store all 10 000 means as Xbar.vals (`Xbar.vals <-`)."
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
    "q": "**Q1 (½ mark).** Load the file into a data frame. Fill the file name as a string, quotes included.",
    "code": "labs <- read.csv(___)",
    "answer": ["\"labscores.csv\"", "'labscores.csv'"],
    "explain": "The full line: `labs <- read.csv(\"labscores.csv\")`. The file name is a string, so it needs quotes; without them R looks for an object called labscores and stops with an error. The file must sit in the working directory, or the string must give its path."
  },
  {
    "type": "fill",
    "q": "**Q1 (½ mark).** A two-way table with the sections as rows and the campuses as columns. Fill the function name.",
    "code": "___(labs$section, labs$campus)",
    "answer": ["table"],
    "explain": "The full line: `table(labs$section, labs$campus)`. With two vectors, `table()` counts every pair: rows are the values of the first (Day, Evening) and columns the values of the second (Burnaby, Downtown). Each cell is the number of submissions in that section at that campus, and the four cells add to 1800. Swapping the two arguments swaps rows and columns."
  },
  {
    "type": "fill",
    "q": "**Q2 (½ mark).** A histogram of the scores. Fill the column name.",
    "code": "histogram(labs$___, type=\"density\", fit=\"normal\", xlab=\"Score\", ylab=\"Probability Density\", main=\"Lab scores\")",
    "answer": ["score"],
    "explain": "The full line: `histogram(labs$score, type=\"density\", fit=\"normal\", xlab=\"Score\", ylab=\"Probability Density\", main=\"Lab scores\")`. `$` picks one column of the data frame by its exact name; `Score` with a capital S would give an error."
  },
  {
    "type": "fill",
    "q": "**Q2 (½ mark).** Bars whose areas add to 1, so the fitted curve sits on them. Fill the string, quotes included.",
    "code": "histogram(labs$score, type=___, fit=\"normal\")",
    "answer": ["\"density\"", "'density'"],
    "explain": "The full argument: `type=\"density\"`. Density bars have total area 1, the same as the area under the fitted bell, so the two can be compared by eye. Count bars would sit far above the curve."
  },
  {
    "q": "**Q2 (1 mark).** The histogram shows a tall hump at about 85 to 95, cut off at 100, and bars that thin out slowly to the left, down to 12. Does X follow a normal distribution?",
    "options": [
      "No. The histogram is left skewed: the hump sits near the top and a long tail runs to the left, so the bars do not follow the fitted bell. The mean 78.3 below the median 82.5 says the same.",
      "Yes. There is one hump, so the scores are normal.",
      "No. The mean 78.3 is below the median 82.5, so X is right skewed.",
      "Yes. With 1800 submissions, the Central Limit Theorem makes the scores normal."
    ],
    "answer": 0,
    "explain": "A bell has one hump and is symmetric. Here the scores pile up against the top at 100 and stretch down to 12: a long tail to the left, left skewed. A few very low scores pull the mean below the median. The tail is named for the side it stretches toward. The Central Limit Theorem is about sample means, never about X itself."
  },
  {
    "type": "fill",
    "q": "**Q3a (½ mark).** One random sample of 64 scores. Fill the sample size.",
    "code": "X.sample <- sample(labs$score, ___)",
    "answer": ["64"],
    "explain": "The full line: `X.sample <- sample(labs$score, 64)`. `sample(x, size)` draws `size` values from `x` at random, without replacement: 64 scores, one sample."
  },
  {
    "q": "**Q3a (½ mark).** True or false: `mean(X.sample)` prints exactly 78.3.",
    "type": "tf",
    "answer": false,
    "explain": "**False.** It prints this one sample's x-bar: a number near 78.3, typically within about 1.7 of it, and different on every run because the sample is random. Only the average of the averages is 78.3. One sample gives one dot, not the centre of the pile."
  },
  {
    "type": "fill",
    "q": "**Q3b (½ mark).** Draw the QQ plot of the sample. Fill the function name.",
    "code": "___(X.sample, pch=20, main=\"QQ Plot of a Sample (n=64)\")",
    "answer": ["qqnorm"],
    "explain": "The full line: `qqnorm(X.sample, pch=20, main=\"QQ Plot of a Sample (n=64)\")`. It sorts the 64 scores and plots each against where a perfect normal sample of 64 would put it: Theoretical Quantiles across, Sample Quantiles up."
  },
  {
    "type": "fill",
    "q": "**Q3b (½ mark).** Add the reference line for the same data. Fill the variable name.",
    "code": "qqline(___, col=\"red\", lty=\"dashed\")",
    "answer": ["X.sample"],
    "explain": "The full line: `qqline(X.sample, col=\"red\", lty=\"dashed\")`. `qqline()` needs the same data as `qqnorm()`, and it goes after `qqnorm()` in the same chunk, because it draws onto the plot `qqnorm()` made. `labs$score` would draw a line for the whole file, not for this sample."
  },
  {
    "q": "**Q3c (1 mark).** Suppose the QQ plot shows the lowest points far below the dashed line, the points rising steeply at the left, then bending over and running almost flat along the top, ending below the line at the right. Does the sample come from a normal population?",
    "options": [
      "No. The points form an arch that bends away from the line at both ends: low values far lower than a bell would put them and high values squeezed together. The sample is left skewed, so it does not come from a normal population.",
      "Yes. The points cross the line in the middle, and the ends are allowed to wobble.",
      "Yes. A sample of 64 is at least 30, so it comes from a normal population.",
      "No. The pattern shows a right-skewed sample."
    ],
    "answer": 0,
    "explain": "A normal sample gives points that roughly follow the line, wobbling a little only at the very ends. Here the whole pattern is a curve, an arch. A long left tail puts the lowest scores far below where a bell would place them. The cap at 100 squeezes the top scores into a flat run. That is the left-skewed pattern, matching Q2: **a sample looks like its population**. A right-skewed sample bends the other way, curving up at the right."
  },
  {
    "type": "fill",
    "q": "**Q4a (½ mark).** The population standard deviation of the scores. Fill the function name.",
    "code": "sigma <- ___(labs$score)",
    "answer": ["sd"],
    "explain": "The full lines: `mu <- mean(labs$score)` and `sigma <- sd(labs$score)`. `sd()` is the sample standard deviation, dividing by n − 1; with 1800 rows that is the 13.6 in the premise. `var()` would give its square."
  },
  {
    "q": "**Q4a (½ mark).** $\\mu_{\\bar{X}}$ for samples of 64 = ?",
    "type": "numeric",
    "answer": 78.3,
    "tolerance": 0.01,
    "explain": "X is one score, with $\\mu = 78.3$ the mean of the whole file. $$\\mu_{\\bar{X}} = \\mu = \\underbrace{78.3}_{\\text{mean of all 1800 scores}}$$ `mean(Xbar.vals)` prints a number very close to 78.3, a little different each run."
  },
  {
    "q": "**Q4a (1 mark).** $\\sigma_{\\bar{X}}$ for samples of 64 = ?",
    "type": "numeric",
    "answer": 1.7,
    "tolerance": 0.01,
    "explain": "With $\\sigma = 13.6$, the standard deviation of all scores, and $n = 64$ scores per sample: $$\\sigma_{\\bar{X}} = \\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{\\underbrace{13.6}_{\\text{sd of one score}}}{\\underbrace{\\sqrt{64}}_{\\text{root of 64}}} = \\dfrac{13.6}{8} = \\mathbf{1.7}$$ This is what `sigma/sqrt(64)` prints. `sd(Xbar.vals)` prints a number close to 1.7, a little different each run. Dividing by 64 instead of by its root gives 0.2125, far too narrow."
  },
  {
    "q": "**Q4b (1 mark).** `histogram(Xbar.vals, type=\"density\", fit=\"normal\")`. Is the distribution of $\\bar{X}$ normal, and why?",
    "options": [
      "Yes, approximately: $n = 64$ is at least 30, so by the Central Limit Theorem the sample means pile up into a bell centred at 78.3 with width 1.7, even though the scores are left skewed.",
      "No: the scores are left skewed, so their means are left skewed too.",
      "No: the means can never reach 100, so they cannot be normal.",
      "Yes: the scores are normal, so their means are normal."
    ],
    "answer": 0,
    "explain": "Door one is shut (X is left skewed, Q2); door two opens ($n = 64 \\ge 30$). On screen the bars form one symmetric hump that follows the fitted curve, centred near 78.3 and far narrower than the histogram in Q2: almost all the means land between about 73 and 83. The cap at 100 no longer matters, because a mean of 64 scores almost never comes near it."
  },
  {
    "q": "**Q4c (1 mark).** The scores are skewed (Q2), one sample is skewed (Q3), and the sample means are normal (Q4b). Does this contradict the Central Limit Theorem? Type YES or NO.",
    "type": "text",
    "answer": ["NO", "No", "no"],
    "explain": "**NO.** A model answer in three sentences: The Central Limit Theorem makes no claim about the population or about one sample, and both look skewed because a sample looks like its population. It says that the means of samples of size 30 or more are approximately normal, whatever the shape of X. With $n = 64 \\ge 30$, the bell in Q4b is exactly what the theorem predicts."
  }
]
```

The paper-side summary is on [the know-cold sheet](#/math3042-q9/know-cold-q9); the moves are taught in [the margin of error](#/math3042-q9/margin-of-error), [90%, 95%, 99%](#/math3042-q9/ci-confidence-level), [sample size and overlap](#/math3042-q9/ci-sample-size-and-overlap), [the Central Limit Theorem](#/math3042-q9/clt-shape-rule), [the QQ plot](#/math3042-q9/qq-plot) and [three different objects](#/math3042-q9/population-sample-pile).
