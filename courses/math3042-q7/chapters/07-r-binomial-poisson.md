---
title: "dbinom, pbinom, dpois, ppois, and the simulated check"
minutes: 10
---
<!-- facts: none; the examples are the lab's die, chips, cables and transformers, with no game context -->
Part 2 can ask for a binomial or Poisson probability by code, then a simulation that checks it. The first letter of the function and the order of its slots are the whole skill.

## The first letter says which probability

Every distribution in R has a family of functions with one stem and a letter in front. The stem names the distribution: `binom` or `pois`.

The letter d gives the chance of exactly one value. The letter p gives the chance of that value or anything below it. The letter r draws random values, for a simulation.

```r
dbinom(x, size, prob)
pbinom(q, size, prob)
rbinom(n, size, prob)
dpois(x, lambda)
ppois(q, lambda)
rpois(n, lambda)
```

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(x, size, prob)` | P(X = x): `x` the count of successes, `size` the number of trials n, `prob` the success chance p. |
| `pbinom(q, size, prob)` | P(X ≤ q): `q` the largest count included. |
| `rbinom(n, size, prob)` | Draws random counts. This `n` is how many values to draw, not the number of trials; that is `size`. |
| `dpois(x, lambda)` | P(X = x) for a Poisson count with mean `lambda` for the interval. |
| `ppois(q, lambda)` | P(X ≤ q) for the same count. |
| `rpois(n, lambda)` | Draws `n` random Poisson counts. |

**Left to right**

- `dbinom(x, size, prob)`: "The binomial chance of exactly (`dbinom`) x successes (`x`) in size trials (`size`) with success chance prob (`prob`)."
- `pbinom(q, size, prob)`: "The binomial chance of at most (`pbinom`) q successes (`q`) in size trials (`size`) with chance prob (`prob`)."
- `rbinom(n, size, prob)`: "Draw at random (`rbinom`) n values (`n`), each a count of successes in size trials (`size`) with chance prob (`prob`)."
- `dpois(x, lambda)`: "The Poisson chance of exactly (`dpois`) x events (`x`) when the mean is lambda (`lambda`)."
- `ppois(q, lambda)`: "The Poisson chance of at most (`ppois`) q events (`q`) when the mean is lambda (`lambda`)."
- `rpois(n, lambda)`: "Draw at random (`rpois`) n Poisson counts (`n`) with mean lambda (`lambda`)."

**Right to left**, the order R runs it

- `dbinom(x, size, prob)`: "Take p, the number of trials and x, then compute the one probability P(X = x) (`dbinom`)."
- `pbinom(q, size, prob)`: "Take p, the number of trials and q, then add P(0) through P(q) (`pbinom`)."
- `rbinom(n, size, prob)`: "Take p and the number of trials, then simulate that experiment n times and return the n counts (`rbinom`)."
- `dpois(x, lambda)`: "Take lambda and x, then compute P(X = x) (`dpois`)."
- `ppois(q, lambda)`: "Take lambda and q, then add P(0) through P(q) (`ppois`)."
- `rpois(n, lambda)`: "Take lambda, then draw n counts (`rpois`)."
:::

There is no letter for "at least". Every other wording is built from p by a complement or a difference.

## Thirty rolls of a 12-sided die

Lab 6 rolls a 12-sided die 30 times and counts the 8s, so $n = 30$ and $p = 1/12$. "At least 6" means 6, 7, 8, and so on up to 30.

```diagram
{"type": "grid", "title": "At least 6 eights in 30 rolls", "nodes": [{"id": "h", "label": "X", "row": 0, "col": 0}, {"id": "v0", "label": "0", "row": 0, "col": 1}, {"id": "v1", "label": "1", "row": 0, "col": 2}, {"id": "v2", "label": "2", "row": 0, "col": 3}, {"id": "v3", "label": "3", "row": 0, "col": 4}, {"id": "v4", "label": "4", "row": 0, "col": 5}, {"id": "v5", "label": "5", "row": 0, "col": 6}, {"id": "v6", "label": "6", "row": 0, "col": 7}, {"id": "v7", "label": "7", "row": 0, "col": 8}, {"id": "v8", "label": "8", "row": 0, "col": 9}, {"id": "vd", "label": "…", "row": 0, "col": 10}, {"id": "v30", "label": "30", "row": 0, "col": 11}], "hi": ["v6", "v7", "v8", "vd", "v30"], "caption": "The lit values are the event. The unlit ones, 0 to 5, are exactly what pbinom(5, 30, 1/12) adds up."}
```

R's p function adds the unlit cells, so the event is one minus that sum:

$$P(X \ge 6) = 1 - P(X \le 5)$$

With the lab's numbers, where 0.96513 is computed as one minus the lab's printed answer:

$$P(X \ge 6) = 1 - \text{pbinom}(5, 30, 1/12) = 1 - 0.96513 = \mathbf{0.03487}$$

The rule: "at least k" is `pbinom` at k − 1, subtracted from 1. The words become values of X exactly as in [At least, at most, more than](#/math3042-q7/at-least-at-most).

## Lab 6 Task 2: one wording, one line

The lab's five parts on the same die:

```r
n <- 30
p <- 1/12
dbinom(6, n, p)
pbinom(6, n, p)
1 - pbinom(5, n, p)
1 - pbinom(6, n, p)
pbinom(6, n, p) - pbinom(1, n, p)
```

```text
[1] 0.02464
[1] 0.9898
[1] 0.03487
[1] 0.01023
[1] 0.7158
```

:::info R syntax
| Code | What it does |
|---|---|
| `n <- 30`, `p <- 1/12` | `<-` stores the number of rolls and the chance of an 8, so the lines below use the names. |
| `dbinom(6, n, p)` | x = 6, size = n, prob = p: exactly 6. |
| `pbinom(6, n, p)` | q = 6: at most 6. |
| `1 - pbinom(5, n, p)` | One minus at most 5: at least 6. |
| `1 - pbinom(6, n, p)` | One minus at most 6: more than 6. |
| `pbinom(6, n, p) - pbinom(1, n, p)` | At most 6 minus at most 1: from 2 to 6, inclusive. |
| `[1]` | In the output: the position of the first value on the printed line. |

**Left to right**

- `n <- 30`, `p <- 1/12`: "Store 30 under n (`n <-`) and one twelfth under p (`p <-`)."
- `dbinom(6, n, p)`: "The chance of exactly (`dbinom`) 6 in n trials with chance p."
- `pbinom(6, n, p)`: "The chance of at most (`pbinom`) 6 in n trials with chance p."
- `1 - pbinom(5, n, p)`: "One minus (`1 -`) the chance of at most 5 (`pbinom(5, n, p)`)."
- `1 - pbinom(6, n, p)`: "One minus (`1 -`) the chance of at most 6 (`pbinom(6, n, p)`)."
- `pbinom(6, n, p) - pbinom(1, n, p)`: "The chance of at most 6 (`pbinom(6, …)`) minus (`-`) the chance of at most 1 (`pbinom(1, …)`)."

**Right to left**, the order R runs it

- `n <- 30`, `p <- 1/12`: "Compute 1/12, then store each value under its name (`<-`)."
- `dbinom(6, n, p)`: "Look up n and p, compute P(X = 6) (`dbinom`), print it."
- `pbinom(6, n, p)`: "Look up n and p, add P(0) to P(6) (`pbinom`), print it."
- `1 - pbinom(5, n, p)`: "Add P(0) to P(5) (`pbinom`), subtract it from 1 (`1 -`), print it."
- `1 - pbinom(6, n, p)`: "Add P(0) to P(6) (`pbinom`), subtract it from 1 (`1 -`), print it."
- `pbinom(6, n, p) - pbinom(1, n, p)`: "Compute both cumulative chances (`pbinom`), subtract the second from the first (`-`), print it."
:::

Task 3 asks the same shapes with 100 chips and a 20 % chance of a thin coating, `n <- 100` and `p <- 0.20`. Its lines and printed values:

```diagram
{"type": "grid", "title": "Lab 6 Task 3: n = 100, p = 0.20", "nodes": [{"id": "h0", "label": "Words", "row": 0, "col": 0}, {"id": "h1", "label": "R line", "row": 0, "col": 1}, {"id": "h2", "label": "Printed", "row": 0, "col": 2}, {"id": "a0", "label": "X = 25", "row": 1, "col": 0}, {"id": "a1", "label": "dbinom(25, n, p)", "row": 1, "col": 1}, {"id": "a2", "label": "0.04388", "row": 1, "col": 2}, {"id": "b0", "label": "X ≤ 25", "row": 2, "col": 0}, {"id": "b1", "label": "pbinom(25, n, p)", "row": 2, "col": 1}, {"id": "b2", "label": "0.9125", "row": 2, "col": 2}, {"id": "c0", "label": "X < 25", "row": 3, "col": 0}, {"id": "c1", "label": "pbinom(24, n, p)", "row": 3, "col": 1}, {"id": "c2", "label": "0.8686", "row": 3, "col": 2}, {"id": "d0", "label": "X ≥ 25", "row": 4, "col": 0}, {"id": "d1", "label": "1 - pbinom(24, n, p)", "row": 4, "col": 1}, {"id": "d2", "label": "0.1314", "row": 4, "col": 2}, {"id": "e0", "label": "20 ≤ X ≤ 30", "row": 5, "col": 0}, {"id": "e1", "label": "pbinom(30, n, p) - pbinom(19, n, p)", "row": 5, "col": 1}, {"id": "e2", "label": "0.5338", "row": 5, "col": 2}], "hi": ["c1", "d1", "e1"], "caption": "The lit lines are the ones that step down by one: fewer than 25 stops at 24, at least 25 removes up to 24, from 20 removes up to 19."}
```

## Poisson uses the same letters

A Poisson count has no number of trials, so the slots are only the count and `lambda`. Lab 7 Task 10 has 34 transformer failures a year on average:

```r
lambda <- 34
dpois(34, lambda)
ppois(30, lambda)
ppois(30-1, lambda)
1 - ppois(38, lambda)
1 - ppois(37, lambda)
ppois(40,lambda) - ppois(29, lambda)
ppois(34, lambda)^2
ppois(68, lambda*2)
```

```text
[1] 0.06825
[1] 0.2804
[1] 0.2235
[1] 0.2166
[1] 0.2681
[1] 0.6429
[1] 0.2975
[1] 0.5322
```

:::info R syntax
| Code | What it does |
|---|---|
| `lambda <- 34` | Stores the mean count for one year. |
| `dpois(34, lambda)` | x = 34: exactly 34 failures. |
| `ppois(30, lambda)`, `ppois(30-1, lambda)` | At most 30, then fewer than 30: `30-1` is worked out first, so q = 29. |
| `1 - ppois(38, lambda)`, `1 - ppois(37, lambda)` | More than 38, then at least 38. |
| `ppois(40,lambda) - ppois(29, lambda)` | From 30 to 40, inclusive. |
| `ppois(34, lambda)^2` | `^2` squares: at most 34 in each of two separate years. |
| `ppois(68, lambda*2)` | `lambda*2` is the mean for one two-year interval, 68. |

**Left to right**

- `lambda <- 34`: "Store 34 under lambda (`lambda <-`)."
- `dpois(34, lambda)`: "The chance of exactly (`dpois`) 34 with mean lambda."
- `ppois(30, lambda)`, `ppois(30-1, lambda)`: "The chance of at most (`ppois`) 30, then of at most 30 minus 1 (`30-1`)."
- `1 - ppois(38, …)`, `1 - ppois(37, …)`: "One minus (`1 -`) at most 38, then one minus at most 37 (`ppois`)."
- `ppois(40,lambda) - ppois(29, lambda)`: "At most 40 (`ppois(40, …)`) minus (`-`) at most 29 (`ppois(29, …)`)."
- `ppois(34, lambda)^2`: "At most 34 (`ppois`), squared (`^2`)."
- `ppois(68, lambda*2)`: "At most 68 (`ppois`) with mean lambda times two (`lambda*2`)."

**Right to left**, the order R runs it

- `lambda <- 34`: "Store 34 (`lambda <-`)."
- `dpois(34, lambda)`: "Look up lambda, compute P(X = 34) (`dpois`)."
- `ppois(30, lambda)`, `ppois(30-1, lambda)`: "Add P(0) to P(30) (`ppois`); then compute 29 (`30-1`) and add P(0) to P(29)."
- `1 - ppois(38, …)`, `1 - ppois(37, …)`: "Add up to 38 (`ppois`) and subtract from 1 (`1 -`); then the same with 37."
- `ppois(40,lambda) - ppois(29, lambda)`: "Compute both sums (`ppois`), subtract (`-`)."
- `ppois(34, lambda)^2`: "Add P(0) to P(34) (`ppois`), then square it (`^2`)."
- `ppois(68, lambda*2)`: "Compute 68 (`lambda*2`), then add P(0) to P(68) with that mean (`ppois`)."
:::

The last two differ because squaring needs each year at 34 or fewer on its own. The two-year total also counts 40 then 28, which fails the first event. The paper version is in [Poisson on paper](#/math3042-q7/poisson-on-paper).

## The whole distribution at once

Give `dbinom` a vector of x values and it returns a vector of probabilities, one per value. Lab 6 Task 4 does this for 20 chips with $p = 1/4$:

```r
n <- 20
p <- 1/4
X.vals <- 0:n
P.vals <- dbinom(X.vals, n, p)
names(P.vals) <- X.vals

barplot(P.vals[P.vals >= 0.00005],
            space=0,
            col="pink",
            xlab="X (defective coatings)",
            ylab="P(X)",
            main=paste0("Number of Defective Coatings (n = ", n,")"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- 0:n` | `a:b` is the whole numbers from a to b: 0 to 20, 21 values. |
| `P.vals <- dbinom(X.vals, n, p)` | x is a whole vector, so R returns 21 probabilities, P(0) to P(20). |
| `names(P.vals) <- X.vals` | Attaches 0 to 20 as labels; `barplot` then prints them under the bars. |
| `P.vals[P.vals >= 0.00005]` | `[ ]` with a test keeps only the probabilities of at least 0.00005, dropping the bars too small to see. |
| `space=0` | No gap between bars. |
| `col="pink"` | The bar colour. |
| `xlab=`, `ylab=` | The axis labels. |
| `main=paste0("…(n = ", n,")")` | The title; `paste0()` joins the text and the value of `n` with nothing between. |

**Left to right**

- `n <- 20`, `p <- 1/4`: "Store 20 under n and a quarter under p (`<-`)."
- `X.vals <- 0:n`: "Store under X.vals (`X.vals <-`) the numbers 0 to n (`0:n`)."
- `P.vals <- dbinom(X.vals, n, p)`: "Store under P.vals (`P.vals <-`) the exact chances (`dbinom`) of each value in X.vals."
- `names(P.vals) <- X.vals`: "Set the labels (`names(P.vals) <-`) to the X values."
- `barplot(…)`: "Draw bars (`barplot`) of the probabilities kept where (`[ ]`) they are at least 0.00005 (`>=`), touching (`space=0`), pink (`col=`), with axis labels (`xlab=`, `ylab=`) and a title joined (`paste0`) around n."

**Right to left**, the order R runs it

- `n <- 20`, `p <- 1/4`: "Compute 1/4 and store both (`<-`)."
- `X.vals <- 0:n`: "Make 0 to 20 (`0:n`) and store it (`X.vals <-`)."
- `P.vals <- dbinom(X.vals, n, p)`: "Compute P(x) for each of the 21 values (`dbinom`), store them (`P.vals <-`)."
- `names(P.vals) <- X.vals`: "Take X.vals and attach them as labels to P.vals (`names<-`)."
- `barplot(…)`: "Build the title (`paste0`), keep the visible probabilities (`[P.vals >= 0.00005]`), then draw the bars (`barplot`)."
:::

The title is built from `n`, so the lab's plot reads "Number of Defective Coatings (n = 20)" without the 20 being typed. The lab's other way labels the bars with the `names.arg` argument of `barplot()`.

## The simulated check

A simulation draws many random counts and tallies them. If the model is right, the share of each count is close to its exact probability, the mean is close to $np$ and the standard deviation is close to $\sqrt{npq}$.

Lab 6 takes 50 BCIT students with a 13 % chance of being left-handed. Here $n = 50$ is the number of students, $p = 0.13$ and $q = 0.87$. Computed:

$$\mu = np = 50 \times 0.13 = \mathbf{6.50} \qquad \sigma = \sqrt{npq} = \sqrt{50 \times 0.13 \times 0.87} = \sqrt{5.655} = \mathbf{2.38}$$

The lab's simulation of 100 000 samples:

```r
n <- 50
p <- 0.13
X.vals <- rbinom(10^5, n, p)
cbind( prop.table( table(X.vals)))
```

```text
      [,1]
0  0.00095
1  0.00687
2  0.02479
3  0.06208
4  0.10950
5  0.14816
6  0.16890
7  0.15743
8  0.12549
9  0.08993
10 0.05379
11 0.02846
12 0.01395
13 0.00618
14 0.00239
15 0.00082
16 0.00022
17 0.00007
18 0.00001
19 0.00001
```

:::info R syntax
| Code | What it does |
|---|---|
| `rbinom(10^5, n, p)` | n = 10^5 values to draw (R's slot named `n`), size = the variable `n`, 50 students, prob = p. |
| `10^5` | `^` raises to a power: 100 000. |
| `table(X.vals)` | Counts how often each value appears. |
| `prop.table( … )` | Turns the counts into shares of 100 000. |
| `cbind( … )` | Prints the result as one column, a value per line. |

**Left to right**

- `n <- 50`, `p <- 0.13`: "Store 50 under n and 0.13 under p (`<-`)."
- `X.vals <- rbinom(10^5, n, p)`: "Store under X.vals (`X.vals <-`) 100 000 (`10^5`) random binomial counts (`rbinom`), each from n students with chance p."
- `cbind( prop.table( table(X.vals)))`: "As a column (`cbind`), the shares (`prop.table`) of the counts (`table`) of each simulated value (`X.vals`)."

**Right to left**, the order R runs it

- `n <- 50`, `p <- 0.13`: "Store both values (`<-`)."
- `X.vals <- rbinom(10^5, n, p)`: "Compute 100 000 (`10^5`), simulate that many samples of 50 (`rbinom`), store the counts (`X.vals <-`)."
- `cbind( prop.table( table(X.vals)))`: "Count each value (`table`), divide by the total (`prop.table`), print as a column (`cbind`)."
:::

The highest share, 0.16890 at 6, sits next to $\mu = 6.50$. Two more lines compare the simulation with the computed $\mu$ and $\sigma$:

```r
mean(X.vals)
sd(X.vals)
```

:::info R syntax
| Code | What it does |
|---|---|
| `mean(X.vals)` | The average of the 100 000 simulated counts. |
| `sd(X.vals)` | Their standard deviation. |

**Left to right**

- `mean(X.vals)`: "The average (`mean`) of the simulated counts (`X.vals`)."
- `sd(X.vals)`: "The standard deviation (`sd`) of the simulated counts (`X.vals`)."

**Right to left**, the order R runs it

- `mean(X.vals)`: "Take the counts (`X.vals`) and average them (`mean`)."
- `sd(X.vals)`: "Take the counts (`X.vals`) and compute their standard deviation (`sd`)."
:::

A simulation gives new numbers on every run, so the lab prints no value for these two. They land close to 6.50 and 2.38.

Lab 7 Task 9 does the same for the cables with 0.75 flaws per metre over five metres, using `rpois`:

```r
Simulate.Cables <- function(m, lambda){

    X.vals <- rpois(m, lambda)

    P.tab <- prop.table(table(X.vals))
    P.tab <- P.tab[P.tab > 0.0005]
    P.tab <- P.tab[sort(as.numeric(names(P.tab)))]

    print(cbind(P.tab))

    barplot(P.tab, space=0, col="lightyellow",
             xlab="x = Flaws in Five Meter of Cable",
             ylab="P(x)",
             main=paste0("Simulated Poisson Distribution, lambda = ", lambda))

}

Simulate.Cables(10^5, 0.75*5)
```

```text
     P.tab
0  0.02393
1  0.08877
2  0.16448
3  0.20331
4  0.19434
5  0.14590
6  0.09153
7  0.04828
8  0.02381
9  0.00990
10 0.00376
```

:::info R syntax
| Code | What it does |
|---|---|
| `Simulate.Cables <- function(m, lambda){ … }` | Stores a function with two inputs: `m` cables to simulate and the mean `lambda`. |
| `rpois(m, lambda)` | n = m values to draw, each a Poisson count with mean `lambda`. |
| `prop.table(table(X.vals))` | The share of each simulated count. |
| `P.tab[P.tab > 0.0005]` | Keeps the shares above 0.0005. |
| `P.tab[sort(as.numeric(names(P.tab)))]` | Picks entries by position using the labels turned into numbers. Position 0 picks nothing, so this also drops the last entry: the print stops at 10. |
| `print(cbind(P.tab))` | Inside a function a result only shows when printed; `cbind` makes it one column. |
| `barplot(P.tab, …)` | Bars of the shares, touching, with labels and a title joined by `paste0()` around `lambda`. |
| `Simulate.Cables(10^5, 0.75*5)` | Runs it with m = 100 000 and lambda = 3.75, the five-metre mean. |

**Left to right**

- `Simulate.Cables <- function(m, lambda){ … }`: "Store under Simulate.Cables (`<-`) a function (`function`) of m and lambda that draws m Poisson counts (`rpois`), tabulates their shares (`prop.table(table())`), keeps those above 0.0005 (`[ ]`), reorders them by label (`sort`, `as.numeric`, `names`), prints them as a column (`print`, `cbind`) and draws them (`barplot`)."
- `Simulate.Cables(10^5, 0.75*5)`: "Run the function (`Simulate.Cables`) with 100 000 cables (`10^5`) and mean 0.75 times 5 (`0.75*5`)."

**Right to left**, the order R runs it

- `Simulate.Cables <- function(m, lambda){ … }`: "Build the function from its body (`function`) and store it (`<-`); nothing runs yet."
- `Simulate.Cables(10^5, 0.75*5)`: "Compute 100 000 and 3.75, then run the body: draw (`rpois`), count (`table`), share (`prop.table`), filter (`[ ]`), print (`print`), draw the bars (`barplot`)."
:::

The exact Task 8 table starts at 0.023518 and 0.088192; the simulation gives 0.02393 and 0.08877. Close shares are the check that the model and the code agree.

The long versions are in [Review: R for the distributions](#/math3042-midterm/review-r-distributions), [R on paper](#/math3042-midterm/r-on-paper) and [Choosing the distribution](#/math3042-u4/choosing-distribution).

## A SkyTrain fare gate and a help desk

A fare gate rejects 5 % of taps; take 40 taps, so X is binomial with size 40 and prob 0.05. A help desk gets 4 tickets an hour; over 2 hours the count is Poisson with lambda 8.

```quiz
[
  {"type": "fill", "q": "P(exactly 3 of the 40 taps are rejected).", "code": "___(3, 40, 0.05)", "answer": ["dbinom"], "explain": "Exactly one value, so the d function: `dbinom(3, 40, 0.05)`, x = 3, size = 40, prob = 0.05. Computed: $$C(40,3)\\,0.05^3\\,0.95^{37} = \\mathbf{0.1851}$$"},
  {"type": "fill", "q": "P(at least 3 of the 40 taps are rejected).", "code": "1 - pbinom(___, 40, 0.05)", "answer": ["2"], "explain": "At least 3 is everything except 0, 1 and 2, so subtract at most 2: `1 - pbinom(2, 40, 0.05)`. Computed: $$1 - 0.6767 = \\mathbf{0.3233}$$ Writing 3 in the slot would also remove X = 3."},
  {"type": "fill", "q": "P(fewer than 3 of the 40 taps are rejected).", "code": "pbinom(___, 40, 0.05)", "answer": ["2"], "explain": "Fewer than 3 is 0, 1 or 2, so q = 2: `pbinom(2, 40, 0.05)`. Computed: $$P(0) + P(1) + P(2) = \\mathbf{0.6767}$$"},
  {"type": "fill", "q": "P(at most 5 tickets in the 2 hours).", "code": "ppois(5, ___)", "answer": ["8", "4*2", "2*4"], "explain": "lambda is the mean for the interval asked: $$\\lambda = 4 \\times 2 = 8$$ So `ppois(5, 8)`. Computed: $$\\mathbf{0.1912}$$ Using 4 answers a question about one hour."},
  {"type": "fill", "q": "P(from 2 to 6 tickets, inclusive, in the 2 hours).", "code": "ppois(6, 8) - ppois(___, 8)", "answer": ["1"], "explain": "At most 6 minus at most 1 leaves 2 to 6: `ppois(6, 8) - ppois(1, 8)`. Computed: $$\\mathbf{0.3104}$$ Subtracting `ppois(2, 8)` would drop X = 2."},
  {"type": "fill", "q": "Simulate 1000 days of 40 taps each, one count of rejected taps per day.", "code": "X.vals <- rbinom(___, 40, 0.05)", "answer": ["1000", "10^3", "1e3", "1e+03"], "explain": "The first slot of `rbinom` is R's `n`: how many values to draw. The 40 taps go in `size`. So `X.vals <- rbinom(1000, 40, 0.05)`, and `prop.table(table(X.vals))` gives the shares to compare with `dbinom`."},
  {"type": "text", "q": "Write the full line on paper for P(more than 10 tickets in the 2 hours), then type the name of the function you used.", "answer": ["ppois", "ppois()"], "explain": "More than 10 is one minus at most 10: `1 - ppois(10, 8)`. Computed: $$1 - 0.8159 = \\mathbf{0.1841}$$ The labs write every upper tail as this complement."}
]
```

## Remember

- d is exactly, p is at most, r draws random values.
- The binomial slots are x or q, then `size`, then `prob`; the Poisson slots are x or q, then `lambda`.
- At least k: one minus `pbinom` at k − 1. Fewer than k: `pbinom` at k − 1.
- In `rbinom` and `rpois` the first slot is how many values to draw, not the number of trials.
- `lambda` is the mean for the interval in the question; separate intervals multiply.
- A simulation checks the model: `prop.table()` of `table()` against the d values, and the mean and sd against $np$ and $\sqrt{npq}$.
