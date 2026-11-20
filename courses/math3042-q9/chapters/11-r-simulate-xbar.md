---
title: "Simulate X-bar in R: one sample, then ten thousand"
minutes: 10
---
<!-- facts: none; the NormalMeans code and its results table are Lab 9's, quoted exactly; the theory column and the practice numbers are computed in the writer's check script -->
On paper the pile is something you imagine: take a sample, boil it down to its average, drop the dot, repeat. In R you can build it for real, ten thousand dots in one line.

## One sample gives one dot

Start with the smallest thing: one sample, boiled down to one number.

The population is IQ scores, a bell with a known centre and spread. This is the notes' IQ example.

- $\mu = 100$, the population mean: the pink line, the truth.
- $\sigma = 15$, the population standard deviation.
- $n = 25$, the number of people in one sample.

```r
mean(rnorm(25, 100, 15))
```

:::info R syntax
| Code | What it does |
|---|---|
| `rnorm(25, 100, 15)` | Draws random values from a bell: `n` = 25 values, `mean` = 100, `sd` = 15. This `n` is R's name for how many values; here it is also the sample size. |
| `mean(…)` | Averages the 25 values into one number. |

**Left to right**

- `mean(rnorm(25, 100, 15))`: "The average (`mean`) of 25 random values (`rnorm`, `25`) from a bell with mean 100 (`100`) and standard deviation 15 (`15`)."

**Right to left**, the order R runs it

- `mean(rnorm(25, 100, 15))`: "Draw 25 values from the bell (`rnorm`), then average them (`mean`) and print the result."
:::

It prints one number near 100. **Your number will differ from anyone else's, and from your own next run: every run draws 25 new people.**

That number has a name: $\bar{X}$ (say "X-bar"), the sample mean. Here X is one person's score, and $\bar{X}$ is the average of 25 of them. **On the picture, one run of this line is one blue dot.**

## One sample from a data column

In Part 2 the population is often a column of a file, not a formula. Then you draw the sample from the column itself.

A commuter logs SkyTrain trip times in the file `trips.csv`. The column `minutes` holds every trip.

- `trips`, the data frame read from the file.
- `minutes`, the column of trip times.
- $100$, the sample size.

```r
trips <- read.csv("trips.csv")
mean(sample(trips$minutes, 100))
```

:::info R syntax
| Code | What it does |
|---|---|
| `trips <- read.csv("trips.csv")` | Loads the file into a data frame named `trips`. |
| `trips$minutes` | `$` picks the column named `minutes`. |
| `sample(trips$minutes, 100)` | Picks `size` = 100 values at random from the column `x`. With no `replace=TRUE`, no row is picked twice. |
| `mean(…)` | Averages the 100 picked values. |

**Left to right**

- `trips <- read.csv("trips.csv")`: "Store under trips (`trips <-`) the data frame read (`read.csv`) from trips.csv."
- `mean(sample(trips$minutes, 100))`: "The average (`mean`) of a random sample (`sample`) of 100 values (`100`) from the minutes column (`$minutes`) of trips (`trips`)."

**Right to left**, the order R runs it

- `trips <- read.csv("trips.csv")`: "Read the file (`read.csv`), then store it (`<-`)."
- `mean(sample(trips$minutes, 100))`: "Pull out the minutes column (`$`), pick 100 of its values at random (`sample`), average them (`mean`)."
:::

**`sample` draws without replacement: each value in the column can be picked once.** Just like drawing names from a hat without putting them back.

## Ten thousand samples make the pile

**`replicate` runs the same line m times and returns the m results as one vector.** Just like pressing the same button ten thousand times and writing down each result in a list.

Put the one-dot line inside it, and you get the pile:

```r
Xbar.vals <- replicate(10^4, mean(rnorm(25, 100, 15)))
mean(Xbar.vals)
sd(Xbar.vals)
```

:::info R syntax
| Code | What it does |
|---|---|
| `10^4` | `^` raises to a power: 10 000. |
| `replicate(10^4, …)` | Runs the second argument 10 000 times and collects the 10 000 results in one vector. |
| `mean(rnorm(25, 100, 15))` | The one-dot line from above: one sample mean. |
| `Xbar.vals <- …` | Stores the vector of 10 000 sample means. The dot is just part of the name. |
| `mean(Xbar.vals)` | The average of all the sample means: the centre of the pile. |
| `sd(Xbar.vals)` | Their standard deviation, dividing by n − 1: the width of the pile. |

**Left to right**

- `Xbar.vals <- replicate(10^4, mean(rnorm(25, 100, 15)))`: "Store under Xbar.vals (`Xbar.vals <-`) ten thousand (`10^4`) repeats (`replicate`) of the average (`mean`) of 25 random bell values (`rnorm(25, 100, 15)`)."
- `mean(Xbar.vals)`: "The average (`mean`) of the sample means (`Xbar.vals`)."
- `sd(Xbar.vals)`: "The standard deviation (`sd`) of the sample means (`Xbar.vals`)."

**Right to left**, the order R runs it

- `Xbar.vals <- replicate(10^4, mean(rnorm(25, 100, 15)))`: "Compute 10 000 (`10^4`); then 10 000 times draw 25 values (`rnorm`) and average them (`mean`); collect the averages (`replicate`); store them (`<-`)."
- `mean(Xbar.vals)`: "Take the 10 000 means, average them (`mean`)."
- `sd(Xbar.vals)`: "Take the 10 000 means, find their standard deviation (`sd`)."
:::

```diagram
{"type": "flow", "title": "From one line to the pile", "nodes": [{"id": "s", "label": "rnorm(25, 100, 15)", "sub": "one sample"}, {"id": "m", "label": "mean(...)", "sub": "one dot"}, {"id": "r", "label": "replicate(10^4, ...)", "sub": "10 000 dots"}, {"id": "v", "label": "Xbar.vals", "sub": "the pile"}, {"id": "c", "label": "mean and sd", "sub": "centre and width"}], "edges": [{"from": "s", "to": "m"}, {"from": "m", "to": "r"}, {"from": "r", "to": "v"}, {"from": "v", "to": "c"}], "hi": ["v"], "caption": "The inner line makes one dot; replicate makes the pile; mean and sd measure it."}
```

Your two printed numbers will differ from run to run. They land close to what the pile's two formulas say.

The centre lands near the pink line:

$$\mu_{\bar{X}} = \underbrace{100}_{\mu,\ \text{population mean}} = \mathbf{100}$$

The width lands near the green arrow, the standard error:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{15}_{\sigma,\ \text{population sd}}}{\underbrace{\sqrt{25}}_{\sqrt{n},\ \text{root of sample size}}} = \mathbf{3}$$

**The `mean` of the pile estimates $\mu$, and its `sd` estimates $\sigma/\sqrt{n}$.** For example, a centre a few hundredths away from 100 and a width a few hundredths away from 3 both agree with the theory: the gaps are random wobble.

That second number answers the one question: if I took another sample, how far could my number move? About 3 points, one standard error.

## The same pile with a for loop

The lab builds the pile a second way. It makes a row of empty slots first, then fills one slot per sample.

```r
m <- 10^4
Xbar.vals <- numeric(m)
for (i in 1:m){
  Xbar.vals[i] <- mean(rnorm(25, 100, 15))
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `m <- 10^4` | Stores 10 000, the number of samples. |
| `numeric(m)` | Makes a vector of `m` zeros: 10 000 empty slots to fill. |
| `1:m` | `:` makes the whole numbers 1, 2, …, 10 000. |
| `for (i in 1:m){ … }` | Runs the lines inside the braces once for each `i` from 1 to 10 000. |
| `Xbar.vals[i] <- …` | `[ ]` picks slot number `i`; R counts slots from 1. The new sample mean goes in that slot. |

**Left to right**

- `m <- 10^4`: "Store under m (`m <-`) ten thousand (`10^4`)."
- `Xbar.vals <- numeric(m)`: "Store under Xbar.vals (`Xbar.vals <-`) a vector of m zeros (`numeric(m)`)."
- `for (i in 1:m){ … }`: "For each i from 1 to m (`for (i in 1:m)`), put in slot i (`Xbar.vals[i] <-`) the average (`mean`) of 25 random bell values (`rnorm`)."

**Right to left**, the order R runs it

- `m <- 10^4`: "Compute 10 000, store it."
- `Xbar.vals <- numeric(m)`: "Make m zeros (`numeric`), store them."
- `for (i in 1:m){ … }`: "Each time round, draw 25 values (`rnorm`), average them (`mean`), write the result into slot i (`[i] <-`)."
:::

**`replicate` and the `for` loop build the same pile.** The loop spells out each step; `replicate` does them in one line. Either one is fine in Part 2.

## The lab's function: one call per sample size

The lab asks one question: what happens to the pile as the sample size grows? The population is the IQ bell again, $\mu = 100$ and $\sigma = 15$. The lab builds the pile for $n$ = 1, 2, 10, 50 and 100, with 100 000 samples each.

To avoid typing the loop five times, it wraps the loop in a function, `NormalMeans`. It draws with `histogram`, so the `mosaic` package must be loaded first, as the lab's setup chunk does:

```r
NormalMeans <- function(m.trials, n.sample){
  Xbar.vals <- numeric(m.trials)
  for (i in 1:m.trials){
    Xbar.vals[i] <- mean(rnorm(n.sample, 100, 15))
  }
  h <- histogram(Xbar.vals, col="pink",
                 xlim=c(60, 140),
                 type="density", fit="normal",
                 xlab="Xbar",
                 ylab="Probability Density",
                 main=paste0("Sampling Distribution of Xbar (n = ", n.sample,")"))
  return(list(mean(Xbar.vals), sd(Xbar.vals), h))
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `NormalMeans <- function(m.trials, n.sample){ … }` | Makes a function with two inputs: how many samples, and how big each one is. The lines in the braces run on each call. |
| `numeric(m.trials)`, `for (i in 1:m.trials){ … }` | The loop from above, with `m.trials` samples. |
| `rnorm(n.sample, 100, 15)` | One sample of size `n.sample` from the IQ bell. |
| `histogram(Xbar.vals, …)` | From the `mosaic` package: a histogram of the sample means, stored as `h` instead of drawn. |
| `col="pink"` | The bar fill colour. |
| `xlim=c(60, 140)` | The x-axis runs from 60 to 140 for every n, so the five pictures compare. `c()` joins two numbers into a vector. |
| `type="density", fit="normal"` | Bars scaled so their areas add to 1, with a normal curve drawn over them. |
| `xlab=`, `ylab=` | The axis labels. |
| `main=paste0("Sampling Distribution of Xbar (n = ", n.sample,")")` | `paste0` joins the text and the value of `n.sample` with nothing between: the title states the sample size. |
| `return(list(mean(Xbar.vals), sd(Xbar.vals), h))` | `list` packs three results in order: the centre, the width, the picture. `return` hands the list back. |

**Left to right**

- `NormalMeans <- function(m.trials, n.sample){ … }`: "Store under NormalMeans (`NormalMeans <-`) a function (`function`) of m.trials and n.sample that runs the lines below."
- `Xbar.vals <- numeric(m.trials)`: "Store under Xbar.vals m.trials zeros (`numeric`)."
- `for (i in 1:m.trials){ … }`: "For each i (`for`), put in slot i (`Xbar.vals[i] <-`) the average (`mean`) of n.sample bell values (`rnorm(n.sample, 100, 15)`)."
- `h <- histogram(…)`: "Store under h (`h <-`) a density histogram (`histogram`, `type="density"`) of the means with a fitted normal curve (`fit="normal"`), an axis from 60 to 140 (`xlim=c(60, 140)`), labels and a title joined (`paste0`) around n.sample."
- `return(list(…))`: "Hand back (`return`) a list (`list`) of the mean (`mean`), the standard deviation (`sd`) and the histogram (`h`)."

**Right to left**, the order R runs it

- `NormalMeans <- function(m.trials, n.sample){ … }`: "Build the function (`function`), store it (`<-`). Nothing inside runs until it is called."
- `Xbar.vals <- numeric(m.trials)`: "Make the zeros (`numeric`), store them."
- `for (i in 1:m.trials){ … }`: "Each time round, draw (`rnorm`), average (`mean`), write into slot i (`[i] <-`)."
- `h <- histogram(…)`: "Join the title (`paste0`), build the histogram (`histogram`), store it (`<-`)."
- `return(list(…))`: "Compute the mean (`mean`) and the sd (`sd`), pack them with h (`list`), hand the list back (`return`)."
:::

One call gives back all three results. **`res[[1]]` unpacks the first item of the list, `res[[2]]` the second, `res[[3]]` the third.** Just like a parcel with three boxes in a fixed order: the first is always the mean.

These are the lab's lines for $n = 50$:

```r
m.trials <- 10^5
res <- NormalMeans(m.trials, 50)
mu50 <- res[[1]]
sig50 <- res[[2]]
h50 <- res[[3]]
print(h50)
```

:::info R syntax
| Code | What it does |
|---|---|
| `m.trials <- 10^5` | 100 000 samples. |
| `NormalMeans(m.trials, 50)` | Calls the function: `m.trials` = 100 000 samples, `n.sample` = 50 per sample. |
| `res <- …` | Stores the returned list. |
| `res[[1]]`, `res[[2]]`, `res[[3]]` | `[[ ]]` takes one item out of a list by position: the mean, the sd, the histogram. |
| `print(h50)` | Draws the stored histogram. |

**Left to right**

- `m.trials <- 10^5`: "Store under m.trials (`<-`) a hundred thousand (`10^5`)."
- `res <- NormalMeans(m.trials, 50)`: "Store under res (`res <-`) what the function (`NormalMeans`) gives back for m.trials samples of size 50."
- `mu50 <- res[[1]]`, `sig50 <- res[[2]]`, `h50 <- res[[3]]`: "Store item 1, 2 and 3 of res (`[[1]]`, `[[2]]`, `[[3]]`) under mu50, sig50 and h50."
- `print(h50)`: "Draw (`print`) the histogram h50."

**Right to left**, the order R runs it

- `m.trials <- 10^5`: "Compute 100 000, store it."
- `res <- NormalMeans(m.trials, 50)`: "Run the function with these inputs, then store its list (`<-`)."
- `mu50 <- res[[1]]`, `sig50 <- res[[2]]`, `h50 <- res[[3]]`: "Pull out each item (`[[ ]]`), store it."
- `print(h50)`: "Take h50, draw it (`print`)."
:::

The calls for 1, 2, 10 and 100 are the same with that number swapped in.

## The pile narrows as n grows

Each step below draws the population on top and the pile of sample means underneath, on the same axis. Watch the centre stay put on 100 while the pile squeezes in.

```widget
xbar-n-play
{"pop": "normal", "mu": 100, "sigma": 15, "ns": [1, 2, 10, 50, 100], "title": "The pile of X-bar from the IQ bell: the centre stays at 100, the width shrinks as 15 over root n"}
```

Every pile is a bell, because the population is a bell. Only the width changes.

The lab's printed results, with the theory beside them:

```diagram
{"type": "grid", "title": "Lab 9: 100 000 sample means for each n", "nodes": [{"id": "h0", "label": "n", "row": 0, "col": 0}, {"id": "h1", "label": "mean of X-bar", "row": 0, "col": 1}, {"id": "h2", "label": "sd of X-bar", "row": 0, "col": 2}, {"id": "h3", "label": "theory 15/√n", "row": 0, "col": 3}, {"id": "a0", "label": "1", "row": 1, "col": 0}, {"id": "a1", "label": "100.0444662", "row": 1, "col": 1}, {"id": "a2", "label": "15.0230341", "row": 1, "col": 2}, {"id": "a3", "label": "15", "row": 1, "col": 3}, {"id": "b0", "label": "2", "row": 2, "col": 0}, {"id": "b1", "label": "100.0175452", "row": 2, "col": 1}, {"id": "b2", "label": "10.606204", "row": 2, "col": 2}, {"id": "b3", "label": "10.6066", "row": 2, "col": 3}, {"id": "c0", "label": "10", "row": 3, "col": 0}, {"id": "c1", "label": "100.0095187", "row": 3, "col": 1}, {"id": "c2", "label": "4.7457495", "row": 3, "col": 2}, {"id": "c3", "label": "4.7434", "row": 3, "col": 3}, {"id": "d0", "label": "50", "row": 4, "col": 0}, {"id": "d1", "label": "100.0074379", "row": 4, "col": 1}, {"id": "d2", "label": "2.114541", "row": 4, "col": 2}, {"id": "d3", "label": "2.1213", "row": 4, "col": 3}, {"id": "e0", "label": "100", "row": 5, "col": 0}, {"id": "e1", "label": "100.0079167", "row": 5, "col": 1}, {"id": "e2", "label": "1.5041702", "row": 5, "col": 2}, {"id": "e3", "label": "1.5", "row": 5, "col": 3}], "hi": ["d2", "d3"], "caption": "The middle two columns are what the instructor's run printed; yours will differ in the later decimals. The last column is the formula."}
```

For example, the highlighted row is $n = 50$:

$$\sigma_{\bar{X}} = \dfrac{\underbrace{15}_{\sigma}}{\underbrace{\sqrt{50}}_{\sqrt{n}}} = \mathbf{2.1213}$$

The simulation printed 2.114541, within 0.007 of it.

The lab's answers, word for word: *The mean* $\mu_{\bar{X}}$ *does not change significantly, however* $\sigma_{\bar{X}}$ *decreases as n becomes larger.* And: *All the distributions have the "bell shape" of a normal distribution. They simply become narrower and taller as n increases.*

**The simulated mean and sd are estimates: close to $\mu$ and $\sigma/\sqrt{n}$, never exactly equal.** Reading the histogram itself is [the next lesson](#/math3042-q9/r-histogram-normal-fit). The paper version of this pile is [the X-bar lesson](#/math3042-q9/xbar-sampling-distribution).

## A bag-filling line, and a commute log

A factory line fills bags of rice. Bag weights follow a bell.

- $\mu = 500$ g, the mean bag weight.
- $\sigma = 12$ g, the standard deviation.
- $n = 36$, the bags in one sample.
- $10^4$, the number of samples to simulate.

The SkyTrain commute log is the `trips` data frame from above, with the column `minutes`.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- For the sampling distribution of $\overline{X}$ for samples of size n: $\mu_{\overline{X}} = \mu$, $\sigma_{\overline{X}} = \sigma/\sqrt{n}$.
- $\overline{X}$ is normally distributed as long as: X is normally distributed, or $n > 30$.

**Not on the sheet, so know it:**

- The simulated centre and width of the pile land near these two values, never exactly on them.
- Every R function name, argument and operator: nothing in RStudio is on the sheet.
:::

```quiz
[
  {"type": "fill", "q": "One sample mean of 36 bags. Type the function that boils the sample down to one number.", "code": "one.mean <- ___(rnorm(36, 500, 12))", "answer": ["mean"], "explain": "`mean(rnorm(36, 500, 12))` is one sample of 36 bag weights, averaged: one dot on the pile."},
  {"type": "fill", "q": "Simulate 10 000 sample means of the rice bags. Type the function that repeats the inner line.", "code": "Xbar.vals <- ___(10^4, mean(rnorm(36, 500, 12)))", "answer": ["replicate"], "explain": "`replicate(m, expr)` runs `expr` m times and returns the results as a vector: here 10 000 sample means."},
  {"q": "After that line, `mean(Xbar.vals)` should print a number near what, in grams?", "type": "numeric", "answer": 500, "tolerance": 0.01, "unit": "g", "explain": "The pile is centred on the truth: $$\\mu_{\\bar{X}} = \\underbrace{500}_{\\mu,\\ \\text{mean bag weight}} = \\mathbf{500}$$ The printed value lands near 500 and differs a little from run to run."},
  {"q": "And `sd(Xbar.vals)` should print a number near what, in grams?", "type": "numeric", "answer": 2, "tolerance": 0.01, "unit": "g", "explain": "The width of the pile is the standard error: $$\\sigma_{\\bar{X}} = \\dfrac{\\underbrace{12}_{\\sigma,\\ \\text{sd of one bag}}}{\\underbrace{\\sqrt{36}}_{\\sqrt{n},\\ 36 \\text{ bags}}} = \\mathbf{2}$$ Not 12: that is the spread of single bags, not of averages."},
  {"q": "The sample size changes from 36 bags to 144 bags. What happens to `sd(Xbar.vals)`?", "options": ["It lands near 1 g, half of before", "It lands near 0.5 g, a quarter of before", "It stays near 2 g, because the population did not change", "It lands near 4 g, twice as before"], "answer": 0, "explain": "Four times the sample size divides the width by $\\sqrt{4} = 2$: $$\\dfrac{\\underbrace{12}_{\\sigma}}{\\underbrace{\\sqrt{144}}_{\\sqrt{n}}} = \\mathbf{1}$$ The centre stays at 500."},
  {"type": "fill", "q": "The for-loop version. Type the function that makes m empty slots (zeros) before the loop.", "code": "Xbar.vals <- ___(m)\nfor (i in 1:m){\n  Xbar.vals[i] <- mean(rnorm(36, 500, 12))\n}", "answer": ["numeric"], "explain": "`numeric(m)` makes a vector of m zeros; the loop writes one sample mean into slot `i` each time round."},
  {"type": "fill", "q": "A function returns `list(mean(Xbar.vals), sd(Xbar.vals), h)`. Type the number that unpacks the standard deviation.", "code": "res <- BagMeans(10^4, 36)\nsig36 <- res[[___]]", "answer": ["2"], "explain": "The list holds the mean first, the sd second, the histogram third. `res[[2]]` is the sd."},
  {"type": "text", "q": "One sample mean of 100 trip times from the `minutes` column of `trips`. Write the full line on paper, then type the name of the function that picks the 100 values at random.", "answer": ["sample", "sample()"], "explain": "The full line: `mean(sample(trips$minutes, 100))`. `sample(x, size)` picks `size` values from `x` without replacement; `mean` averages them into one dot."}
]
```

## Remember

- One dot: `mean` of one `rnorm` sample, or of one `sample` from a data column.
- The pile: `replicate`, or `numeric` and a `for` loop.
- The `mean` of the pile lands near $\mu$; its `sd` lands near $\sigma/\sqrt{n}$.
- Your numbers differ on every run. Close to the theory is the right answer.
- A function can return a `list` of three things; `res[[1]]` unpacks the first item.
- Bigger n: same centre, narrower pile.
