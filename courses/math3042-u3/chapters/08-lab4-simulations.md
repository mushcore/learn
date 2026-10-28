---
title: Lab 4: simulating probabilities with sample() and replicate()
minutes: 32
---
<!-- facts: gms.starforce.rates-15-plus, gms.starforce.star-catch, classic.scroll.chaos-outcomes -->

How often does a Star Force tap at 15 stars destroy the item (Star Force, the GMS enhancement that adds stars to gear)? Lab 4 answers such questions by simulation: run the experiment $m$ times with `sample()`, count the event, and estimate $P(E) \approx k/m$. Package: `mosaic`.

## sample(): one call, three arguments that matter

```r
sample( c(1,2,3,4,5,6), 1)        # one fair die
sample.int(6, 1)                  # the same, for the integers 1..6
sample.int(6, 5, replace=TRUE)    # five dice: 6 6 3 4 5
sample.int(6, 5)                  # WITHOUT replacement: always five distinct values
sample.int(6, 100, replace=TRUE, prob = c(0.1, 0.1, 0.1, 0.1, 0.1, 0.5))   # a loaded die
```

:::info R syntax
| Code | What it does |
|---|---|
| `# one fair die` | `#` starts a comment: R ignores everything after it on the line. |
| `sample( c(1,2,3,4,5,6), 1)` | `c()` combines the faces into a vector. `sample` fills x = that vector, size = 1 draw. |
| `sample.int(6, 1)` | `sample.int` draws from the integers 1 to its first argument: n = 6 (the largest value, not a count of draws), size = 1. |
| `sample.int(6, 5, replace=TRUE)` | size = 5 draws; `replace=TRUE` puts each value back, so values can repeat. |
| `sample.int(6, 5)` | Without `replace=TRUE` the default is no replacement, so the five values are all different. |
| `prob = c(0.1, 0.1, 0.1, 0.1, 0.1, 0.5)` | One weight per value 1 to 6, in order: here 6 comes up half the time. |

**Left to right**

- `sample( c(1,2,3,4,5,6), 1)`: "A random sample (`sample`) from the combined faces (`c(1,2,3,4,5,6)`) of size 1 (`1`)."
- `sample.int(6, 1)`: "A random sample of whole numbers (`sample.int`) from 1 to 6 (`6`) of size 1 (`1`)."
- `sample.int(6, 5, replace=TRUE)`: "A random sample of whole numbers (`sample.int`) from 1 to 6 (`6`) of size 5 (`5`) with replacement (`replace=TRUE`)."
- `sample.int(6, 5)`: "A random sample of whole numbers (`sample.int`) from 1 to 6 (`6`) of size 5 (`5`), without replacement."
- `sample.int(6, 100, replace=TRUE, prob = c(…))`: "A random sample (`sample.int`) from 1 to 6 (`6`) of size 100 (`100`) with replacement (`replace=TRUE`) and weights (`prob =`) combined (`c()`) as 0.1 five times and 0.5."

**Right to left**, the order R runs it

- `sample( c(1,2,3,4,5,6), 1)`: "Combine the six faces into a vector (`c()`), then draw one of them (`sample`, `1`)."
- `sample.int(6, 1)`: "Take the integers 1 to 6 (`6`) and draw one (`sample.int`, `1`)."
- `sample.int(6, 5, replace=TRUE)`: "Take 1 to 6 (`6`), allow repeats (`replace=TRUE`), and draw five (`sample.int`, `5`)."
- `sample.int(6, 5)`: "Take 1 to 6 (`6`) and draw five, each removed once drawn (`sample.int`, `5`)."
- `sample.int(6, 100, replace=TRUE, prob = c(…))`: "Combine the six weights (`c()`), pass them as the weights (`prob =`), allow repeats (`replace=TRUE`), then draw 100 values from 1 to 6 (`sample.int`)."
:::

The first argument is the sample space, the second how many draws. `replace=TRUE` puts each value back, which is how independent dice behave; without it the values are always distinct, which is how cards behave. `prob=` gives unequal probabilities.

Counting an event is a comparison inside `sum()`: `X <- sum(die.outcomes == 6)` counts the sixes in 100 rolls (12 in the lab's run). Coins are strings: `sample(c("H","T"), 1)`; Task 2's 1000 flips with a 55% coin are `sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45))` and `X <- sum(coin.outcomes == "H")` (537 in the lab's run).

:::info R syntax
| Code | What it does |
|---|---|
| `X <- sum(die.outcomes == 6)` | `==` compares every roll with 6, giving `TRUE`/`FALSE`; `sum` counts the `TRUE`s; `<-` stores the count as `X`. |
| `sample(c("H","T"), 1)` | x = the two strings, size = 1: one coin flip. |
| `sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45))` | size = 1000 flips, with replacement, "H" weighted 0.55 and "T" 0.45. |
| `X <- sum(coin.outcomes == "H")` | Counts the flips equal to `"H"` and stores the count as `X`. |

**Left to right**

- `X <- sum(die.outcomes == 6)`: "Store under the name X (`X <-`) the count (`sum`) of die.outcomes (`die.outcomes`) equal to (`==`) 6 (`6`)."
- `sample(c("H","T"), 1)`: "A random sample (`sample`) from H and T (`c("H","T")`) of size 1 (`1`)."
- `sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45))`: "A random sample (`sample`) from H and T (`c("H","T")`) of size 1000 (`1000`) with replacement (`replace=TRUE`) and weights (`prob=`) 0.55 and 0.45 (`c(0.55, 0.45)`)."
- `X <- sum(coin.outcomes == "H")`: "Store under the name X (`X <-`) the count (`sum`) of coin.outcomes (`coin.outcomes`) equal to (`==`) H (`"H"`)."

**Right to left**, the order R runs it

- `X <- sum(die.outcomes == 6)`: "Compare each roll with 6 (`die.outcomes == 6`), count the TRUEs (`sum`), then store the count as X (`X <-`)."
- `sample(c("H","T"), 1)`: "Combine H and T (`c("H","T")`), then draw one (`sample`)."
- `sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45))`: "Combine the outcomes and the weights (`c()`), allow repeats (`replace=TRUE`), then draw 1000 weighted flips (`sample`, `prob=`)."
- `X <- sum(coin.outcomes == "H")`: "Compare each flip with H (`coin.outcomes == "H"`), count the TRUEs (`sum`), then store the count as X (`X <-`)."
:::

## Functions and for loops

```r
myfunc <- function(x) {
  return(x^2)
}
myfunc(4)                                            # 16

pick.a.number <- function(n) { return( sample.int(n, 1) ) }        # Task 3
Flip.Once <- function(){ return( sample(c("H","T"), 1) ) }         # Task 4

Flip.Coins <- function(n){                                          # Task 5
  res.coins <- character(n)
  for (i in 1:n){
    res.coins[i] <- Flip.Once()
  }
  return(res.coins)
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `myfunc <- function(x) { … }` | `<-` is assignment. `function(x)` makes a function with one argument `x`; the braces hold its body. |
| `return(x^2)` | Hands back the result to the caller. `^` raises to a power. |
| `myfunc(4)` | Calls the function with `x` = 4. |
| `pick.a.number <- function(n) { return( sample.int(n, 1) ) }` | The function's own `n` is passed on as `sample.int`'s n (the largest integer); size = 1 draw. Dots are just part of names. |
| `Flip.Once <- function(){ … }` | Empty brackets: the function takes no arguments. It returns one draw from `c("H","T")`. |
| `res.coins <- character(n)` | Makes a vector of `n` empty strings for the loop to fill. |
| `for (i in 1:n){ … }` | `1:n` is the whole numbers 1 to n; the body runs once for each `i`. |
| `res.coins[i] <- Flip.Once()` | `[ ]` picks a slot by position, counting from 1; slot `i` gets one flip. |

**Left to right**

- `myfunc <- function(x) { return(x^2) }`: "Store under the name myfunc (`myfunc <-`) a function of x (`function(x)`) that returns (`return`) x to the power 2 (`x^2`)."
- `myfunc(4)`: "Call myfunc (`myfunc`) on 4 (`4`)."
- `pick.a.number <- function(n) { … }`: "Store under the name pick.a.number (`pick.a.number <-`) a function of n (`function(n)`) that returns (`return`) one (`1`) random whole number (`sample.int`) from 1 to n (`n`)."
- `Flip.Once <- function(){ … }`: "Store under the name Flip.Once (`Flip.Once <-`) a function with no arguments (`function()`) that returns (`return`) one (`1`) random draw (`sample`) from H and T (`c("H","T")`)."
- `Flip.Coins <- function(n){ … }`: "Store under the name Flip.Coins (`Flip.Coins <-`) a function of n (`function(n)`) that stores under res.coins (`res.coins <-`) n empty strings (`character(n)`), then for (`for`) each i in 1 to n (`1:n`) stores in slot i (`res.coins[i] <-`) one flip (`Flip.Once()`), and returns (`return`) res.coins."

**Right to left**, the order R runs it

- `myfunc <- function(x) { return(x^2) }`: "Build a function that squares its x (`x^2`) and hands it back (`return`), then store it as myfunc (`myfunc <-`)."
- `myfunc(4)`: "Take 4 (`4`), pass it to myfunc as x (`myfunc`), square it inside, and print the result."
- `pick.a.number <- function(n) { … }`: "Build a function that takes n, draws one integer from 1 to n (`sample.int(n, 1)`) and returns it (`return`), then store it as pick.a.number (`pick.a.number <-`)."
- `Flip.Once <- function(){ … }`: "Build a function that combines H and T (`c("H","T")`), draws one (`sample`) and returns it (`return`), then store it as Flip.Once (`Flip.Once <-`)."
- `Flip.Coins <- function(n){ … }`: "Build a function that makes n empty slots (`character(n)`) and stores them (`res.coins <-`), runs Flip.Once for each i from 1 to n (`for`, `1:n`) and puts each flip in slot i (`res.coins[i] <-`), then returns the filled vector (`return`); store the function as Flip.Coins (`Flip.Coins <-`)."
:::

To keep a loop's results, allocate a vector first (`numeric(100)`, `character(n)`) and fill `res.coins[i]`.

:::info R syntax
| Code | What it does |
|---|---|
| `numeric(100)` | A vector of 100 zeros, ready to be filled with numbers. |

**Left to right**

- `numeric(100)`: "A numeric vector (`numeric`) of length 100 (`100`)."

**Right to left**, the order R runs it

- `numeric(100)`: "Take the length 100 (`100`) and make that many zeros (`numeric`)."
:::

## Estimating a probability

If $E$ occurs $k$ times in $m$ simulated trials, $P(E) \approx k/m$. Task 6 estimates P(heads):

```r
Prob.Heads <- function(m){
  coins <- character(m)
  for (i in 1:m){ coins[i] <- Flip.Once() }
  k <- sum(coins == "H")
  return(k/m)
}
Prob.Heads(10^5)                                     # 0.50213
```

:::info R syntax
| Code | What it does |
|---|---|
| `coins <- character(m)` | An empty string vector with `m` slots. |
| `for (i in 1:m){ coins[i] <- Flip.Once() }` | Fills slot `i` with one flip, for `i` = 1 to m; a loop body can sit on one line. |
| `k <- sum(coins == "H")` | `==` compares every element with `"H"`, giving `TRUE`/`FALSE`; `sum` counts the `TRUE`s, as TRUE is 1 and FALSE 0. |
| `return(k/m)` | `/` divides: the estimate k/m. |
| `Prob.Heads(10^5)` | Calls it with m = 100 000; the comment shows one run's result. |

**Left to right**

- `Prob.Heads <- function(m){ … }`: "Store under the name Prob.Heads (`Prob.Heads <-`) a function of m (`function(m)`) that stores under coins (`coins <-`) m empty strings (`character(m)`), for (`for`) each i in 1 to m (`1:m`) stores in slot i (`coins[i] <-`) one flip (`Flip.Once()`), stores under k (`k <-`) the count (`sum`) of coins equal to (`==`) H (`"H"`), and returns (`return`) k divided by (`/`) m."
- `Prob.Heads(10^5)`: "Call Prob.Heads (`Prob.Heads`) on ten to the power (`^`) five (`10^5`)."

**Right to left**, the order R runs it

- `Prob.Heads <- function(m){ … }`: "Build a function that makes m empty slots (`character(m)`), fills each with a flip in a loop (`for`, `Flip.Once()`), compares every flip with H (`coins == "H"`), counts the TRUEs (`sum`) into k (`k <-`), divides by m (`k/m`) and returns it (`return`); store it as Prob.Heads (`Prob.Heads <-`)."
- `Prob.Heads(10^5)`: "Compute 10 to the power 5 (`10^5`), pass it as m (`Prob.Heads`), run the function and print the estimate."
:::

Task 7 rolls two dice and asks for P(sum = 7):

```r
Prob.E <- function(m){
  k.success <- 0
  for (i in 1:m){
    X <- sum( sample.int(6, 2, replace=TRUE) )
    if (X == 7){ k.success <- k.success + 1 }
  }
  return (k.success/m)
}
Prob.E(10^5)                                         # 0.16789
```

:::info R syntax
| Code | What it does |
|---|---|
| `k.success <- 0` | Starts a counter at 0. |
| `sample.int(6, 2, replace=TRUE)` | n = 6, size = 2 draws with replacement: two dice. |
| `X <- sum( … )` | Adds the two faces. |
| `if (X == 7){ k.success <- k.success + 1 }` | Runs the braces only when the condition is `TRUE`: adds 1 to the counter when the sum is 7. |
| `return (k.success/m)` | Returns successes over trials; the space before the bracket makes no difference. |
| `Prob.E(10^5)` | Calls it with m = 100 000. |

**Left to right**

- `Prob.E <- function(m){ … }`: "Store under the name Prob.E (`Prob.E <-`) a function of m (`function(m)`) that starts the counter k.success at 0 (`k.success <- 0`), then for (`for`) each i in 1 to m (`1:m`) stores under X (`X <-`) the sum (`sum`) of two dice (`sample.int(6, 2, replace=TRUE)`) and, if (`if`) X equals (`==`) 7, adds 1 to the counter (`k.success <- k.success + 1`); finally it returns (`return`) k.success divided by (`/`) m."
- `Prob.E(10^5)`: "Call Prob.E (`Prob.E`) on ten to the power five (`10^5`)."

**Right to left**, the order R runs it

- `Prob.E <- function(m){ … }`: "Build a function that sets the counter to 0 (`k.success <- 0`), and each time round the loop (`for`, `1:m`) rolls two dice (`sample.int(6, 2, replace=TRUE)`), adds them (`sum`), stores the total (`X <-`), tests it against 7 (`X == 7`) and, when TRUE, adds 1 to the counter (`if`); at the end it divides by m (`k.success/m`) and returns it (`return`); store it as Prob.E (`Prob.E <-`)."
- `Prob.E(10^5)`: "Compute 10 to the power 5 (`10^5`), pass it as m (`Prob.E`) and print the estimate."
:::

The exact answer is the pencil problem: six of the 36 outcomes sum to 7 ((1,6), (2,5), (3,4), (4,3), (5,2), (6,1)), so $6/36 = 0.1667$.

```widget
sim-lab
{ "experiment": "dice2", "m": 1000, "target": 7, "title": "Prob.E: the sum of two dice, m trials, with the bar for X = 7 highlighted" }
```

## replicate(): the loop without the loop

When a loop's body never uses `i` except to store the result, `replicate(m, expression)` runs the expression $m$ times and returns the results as a vector. Task 8 rewrites both functions:

```r
Prob.Heads <- function(m){
  coins <- replicate(m, Flip.Once())
  k <- sum(coins == "H")
  return(k/m)
}
Prob.E <- function(m){
  X.vals <- replicate(m, sum( sample.int(6, 2, replace=TRUE) ))
  k <- sum(X.vals == 7)
  return (k/m)
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `coins <- replicate(m, Flip.Once())` | `replicate(n, expr)` evaluates the expression `m` times and collects the results in a vector; here n is the number of repeats. |
| `k <- sum(coins == "H")` | Counts the heads, as above. |
| `X.vals <- replicate(m, sum( sample.int(6, 2, replace=TRUE) ))` | `m` sums of two dice, one per repeat. |
| `k <- sum(X.vals == 7)` | Counts the sums equal to 7. |
| `return(k/m)`, `return (k/m)` | Returns the estimate k/m. |

**Left to right**

- `Prob.Heads <- function(m){ … }`: "Store under the name Prob.Heads (`Prob.Heads <-`) a function of m (`function(m)`) that stores under coins (`coins <-`) m repeats (`replicate`) of one flip (`Flip.Once()`), stores under k (`k <-`) the count (`sum`) of coins equal to (`==`) H (`"H"`), and returns (`return`) k divided by (`/`) m."
- `Prob.E <- function(m){ … }`: "Store under the name Prob.E (`Prob.E <-`) a function of m (`function(m)`) that stores under X.vals (`X.vals <-`) m repeats (`replicate`) of the sum (`sum`) of two dice (`sample.int(6, 2, replace=TRUE)`), stores under k (`k <-`) the count (`sum`) of X.vals equal to (`==`) 7, and returns (`return`) k divided by (`/`) m."

**Right to left**, the order R runs it

- `Prob.Heads <- function(m){ … }`: "Build a function that flips a coin (`Flip.Once()`) m times (`replicate`) and stores the flips (`coins <-`), compares each with H (`coins == "H"`), counts the TRUEs (`sum`) into k (`k <-`), divides by m (`k/m`) and returns it (`return`); store it as Prob.Heads (`Prob.Heads <-`)."
- `Prob.E <- function(m){ … }`: "Build a function that rolls two dice (`sample.int(6, 2, replace=TRUE)`), adds them (`sum`), repeats that m times (`replicate`) and stores the sums (`X.vals <-`), compares each with 7 (`X.vals == 7`), counts the TRUEs (`sum`) into k (`k <-`), divides by m and returns it (`return`); store it as Prob.E (`Prob.E <-`)."
:::

Same estimates (0.50364, 0.16849), less code, and much faster, which Task 9 needs.

## Star Force at 15 stars: three outcomes in one sample() call

A tap from 15 stars succeeds 30.00 %, keeps the star 67.90 % and destroys the item 2.10 % [GMS, v.264 Star Force 15→16, checked 2026-10-27]: Nexon's v.264 published rates, without the Star Catch bonus that v.271 builds in. Three outcomes with published weights summing to 1 is exactly what `sample(..., prob =)` draws.

```r
Tap.Once <- function(){
  return( sample(c("success","maintain","destroy"), 1, prob = c(0.30, 0.679, 0.021)) )
}
m <- 10^5
taps <- replicate(m, Tap.Once())
sum(taps == "destroy")/m
```

:::info R syntax
| Code | What it does |
|---|---|
| `Tap.Once <- function(){ … }` | A function with no arguments that returns one tap's outcome. |
| `sample(c("success","maintain","destroy"), 1, prob = c(0.30, 0.679, 0.021))` | x = the three outcome strings, size = 1 draw, and `prob` gives each outcome's weight in the same order. |
| `m <- 10^5` | Stores the number of trials. |
| `taps <- replicate(m, Tap.Once())` | A vector of `m` tap outcomes. |
| `sum(taps == "destroy")/m` | Counts the `"destroy"` entries and divides by m; on its own line, the result prints. |

**Left to right**

- `Tap.Once <- function(){ … }`: "Store under the name Tap.Once (`Tap.Once <-`) a function with no arguments (`function()`) that returns (`return`) one (`1`) random draw (`sample`) from the three outcomes (`c("success","maintain","destroy")`) with weights (`prob =`) 0.30, 0.679 and 0.021 (`c(0.30, 0.679, 0.021)`)."
- `m <- 10^5`: "Store under the name m (`m <-`) ten to the power five (`10^5`)."
- `taps <- replicate(m, Tap.Once())`: "Store under the name taps (`taps <-`) m (`m`) repeats (`replicate`) of one tap (`Tap.Once()`)."
- `sum(taps == "destroy")/m`: "The count (`sum`) of taps (`taps`) equal to (`==`) destroy (`"destroy"`), divided by (`/`) m (`m`)."

**Right to left**, the order R runs it

- `Tap.Once <- function(){ … }`: "Build a function that combines the outcomes and the weights (`c()`), draws one outcome with those weights (`sample`, `prob =`) and returns it (`return`); store it as Tap.Once (`Tap.Once <-`)."
- `m <- 10^5`: "Compute 10 to the power 5 (`10^5`), then store it as m (`m <-`)."
- `taps <- replicate(m, Tap.Once())`: "Run Tap.Once (`Tap.Once()`) m times (`replicate`), then store the outcomes as taps (`taps <-`)."
- `sum(taps == "destroy")/m`: "Compare each tap with destroy (`taps == "destroy"`), count the TRUEs (`sum`), then divide by m (`/m`) and print."
:::

```quiz
[
  {"q": "As $m$ grows, what exact proportion does `sum(taps == \"destroy\")/m` settle to? (4 decimals)", "type": "numeric", "answer": 0.021, "tolerance": 0.0001, "explain": "The estimate $k/m$ settles to the weight given to \"destroy\" in `prob =`: $0.0210$."},
  {"q": "How many destroys do you expect in $m = 10^5$ taps?", "type": "numeric", "answer": 2100, "tolerance": 0, "explain": "$10^5 \\times 0.021 = 2100$, beside 30 000 successes and 67 900 maintains."}
]
```

No run is printed: each run is one random draw near the exact 0.0210.

### One tap, m times: the success bar settles at 0.30

Maintain and destroy both count as X = 0.

```widget
sim-lab
{ "experiment": "coins", "n": 1, "p": 0.3, "m": 10000, "title": "One Star Force tap at 15 stars, m times: X = 1 is a success (0.30)" }
```

## How the estimate's variability shrinks with m

Task 9 runs `Prob.Heads(m)` 100 times for each $m$ and takes the standard deviation of the 100 estimates:

```r
ms <- c(10^{1:5})
s <- numeric(length(ms))
for (i in 1:length(ms)){
  Prob.E.ests <- replicate(100, Prob.Heads(ms[i]))
  s[i] <- sd(Prob.E.ests)
}
```

:::info R syntax
| Code | What it does |
|---|---|
| `ms <- c(10^{1:5})` | `1:5` is 1 to 5, and `^` works on each element: 10, 100, …, 100 000. The braces and `c()` just group. |
| `s <- numeric(length(ms))` | `length(ms)` is 5; `numeric(5)` is five zeros to fill. |
| `for (i in 1:length(ms)){ … }` | Runs once for each position in `ms`. |
| `Prob.E.ests <- replicate(100, Prob.Heads(ms[i]))` | `ms[i]` is the i-th trial count; `replicate` gives 100 estimates at that m. |
| `s[i] <- sd(Prob.E.ests)` | `sd()` is the standard deviation of the 100 estimates, stored in slot `i`. |

**Left to right**

- `ms <- c(10^{1:5})`: "Store under the name ms (`ms <-`) the combined (`c()`) values ten to the power (`^`) of each of 1 to 5 (`{1:5}`)."
- `s <- numeric(length(ms))`: "Store under the name s (`s <-`) a vector of zeros (`numeric`) as long as (`length`) ms (`ms`)."
- `for (i in 1:length(ms)){ … }`: "For (`for`) each i in 1 to the length of ms (`1:length(ms)`): store under Prob.E.ests (`Prob.E.ests <-`) 100 (`100`) repeats (`replicate`) of Prob.Heads (`Prob.Heads`) at the i-th trial count (`ms[i]`), then store in slot i of s (`s[i] <-`) their standard deviation (`sd`)."

**Right to left**, the order R runs it

- `ms <- c(10^{1:5})`: "Build 1 to 5 (`1:5`), raise 10 to each (`10^`), combine them (`c()`), then store the vector as ms (`ms <-`)."
- `s <- numeric(length(ms))`: "Find how long ms is (`length(ms)`), make that many zeros (`numeric`), then store them as s (`s <-`)."
- `for (i in 1:length(ms)){ … }`: "Build the positions 1 to 5 (`1:length(ms)`); each time round, pick the trial count (`ms[i]`), run Prob.Heads on it 100 times (`replicate`), store the estimates (`Prob.E.ests <-`), find their standard deviation (`sd`) and store it in slot i (`s[i] <-`)."
:::

| $m$ (trials) | $s$ of 100 estimates of P(H) |
|---|---|
| 10 | 0.143 |
| 100 | 0.051 |
| 1 000 | 0.017 |
| 10 000 | 0.0056 |
| 100 000 | 0.0019 |

Each tenfold increase in $m$ divides the spread by about $\sqrt{10} \approx 3.2$: the law of large numbers with a rate attached.

## The distribution of X

Task 10, `Roll.Dice(m)`, draws `barplot(prop.table(table(die.vals)), ...)` for $m$ = 100, 1000, 10 000: the bars flatten towards $1/6$ each as $m$ grows. `prop.table()` turns counts into relative frequencies.

:::info R syntax
| Code | What it does |
|---|---|
| `Roll.Dice(m)` | The lab's function, called with `m` = the number of rolls. |
| `table(die.vals)` | Counts how many times each die value appears. |
| `prop.table(…)` | Divides each count by the total, giving relative frequencies. |
| `barplot(…, ...)` | One bar per die value with those heights; `...` stands for the labelling arguments. |

**Left to right**

- `Roll.Dice(m)`: "Call Roll.Dice (`Roll.Dice`) with m rolls (`m`)."
- `barplot(prop.table(table(die.vals)), ...)`: "Draw bars (`barplot`) of the proportions (`prop.table`) of the counts (`table`) of die.vals (`die.vals`), with the other arguments (`...`)."

**Right to left**, the order R runs it

- `Roll.Dice(m)`: "Take m (`m`) and run Roll.Dice on it (`Roll.Dice`)."
- `barplot(prop.table(table(die.vals)), ...)`: "Take die.vals (`die.vals`), count each value (`table`), turn the counts into proportions (`prop.table`), then draw them as bars (`barplot`)."
:::

Task 11, `Roll.Some.Dice(m, n)`, rolls $n$ dice per trial with $X$ = the number of 3s. For $n$ = 1, 2, 5, 10, 100 the shape moves from two bars to a bell: **as $n$ increases the distribution of $X$ becomes closer and closer to a normal distribution, with its peak near $n/6$** ($X \approx 1$ for 10 dice, $X \approx 16$ for 100).

:::info R syntax
| Code | What it does |
|---|---|
| `Roll.Some.Dice(m, n)` | The lab's function with two arguments, matched in order: `m` trials, `n` dice per trial. |

**Left to right**

- `Roll.Some.Dice(m, n)`: "Call Roll.Some.Dice (`Roll.Some.Dice`) with m trials (`m`) of n dice each (`n`)."

**Right to left**, the order R runs it

- `Roll.Some.Dice(m, n)`: "Take m and n (`m, n`), then run Roll.Some.Dice on them (`Roll.Some.Dice`)."
:::

```widget
sim-lab
{ "experiment": "dice3", "n": 10, "m": 10000, "title": "Roll.Some.Dice(m, n): the number of 3s, with a bell forming around n/6 as n grows" }
```

Task 12, `Draw.Cards(m, n, replace)`, models the deck as `deck <- c(rep("R", 26), rep("B", 26))` and plots a mosaic `histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1), ...)`. Runs for n = 1, 5, 10, 20, 50, with and without replacement, give the lab's two conclusions: the shape again approaches normal as $n$ grows, and **`replace=FALSE` makes the distribution narrower (less variability) without moving its centre, which is always $n/2$**.

:::info R syntax
| Code | What it does |
|---|---|
| `Draw.Cards(m, n, replace)` | The lab's function: `m` trials, `n` cards per trial, and `replace` as `TRUE` or `FALSE`. |
| `rep("R", 26)`, `rep("B", 26)` | `rep(x, times)`: x = the string, times = 26. |
| `deck <- c(…, …)` | `c()` joins the two runs into a 52-card deck; `<-` stores it as `deck`. |
| `histogram(X.vals, type="d", …)` | lattice's histogram of `X.vals`; `type="d"` puts density on the y-axis. |
| `breaks=seq(-0.5, n+0.5, by=1)` | Edges on the half-integers from -0.5 to n + 0.5, so each whole number gets its own bar. |
| `replace=FALSE` | Draw without putting cards back. |

**Left to right**

- `Draw.Cards(m, n, replace)`: "Call Draw.Cards (`Draw.Cards`) with m trials (`m`), n cards (`n`) and the replace setting (`replace`)."
- `deck <- c(rep("R", 26), rep("B", 26))`: "Store under the name deck (`deck <-`) the combination (`c()`) of R (`"R"`) repeated (`rep`) 26 times and B (`"B"`) repeated (`rep`) 26 times."
- `histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1), ...)`: "A histogram (`histogram`) of X.vals (`X.vals`) as densities (`type="d"`) with edges (`breaks=`) from -0.5 to n plus 0.5 (`n+0.5`) in steps of 1 (`seq`, `by=1`), with the other arguments (`...`)."

**Right to left**, the order R runs it

- `Draw.Cards(m, n, replace)`: "Take m, n and replace (`m, n, replace`), then run Draw.Cards on them (`Draw.Cards`)."
- `deck <- c(rep("R", 26), rep("B", 26))`: "Make 26 Rs (`rep("R", 26)`) and 26 Bs (`rep("B", 26)`), join them (`c()`), then store the deck (`deck <-`)."
- `histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1), ...)`: "Add 0.5 to n (`n+0.5`), build the edges (`seq`), then draw the density histogram of X.vals with them (`histogram`, `type="d"`)."
:::

```widget
sim-lab
{ "experiment": "cards", "n": 20, "m": 10000, "replace": false, "title": "Draw.Cards: with and without replacement, the centre stays at n/2" }
```

## Quiz 4 Part 2 as given: a match simulated, then "is X unusual?"

The RStudio half of Quiz 4 was this lab applied to a game. Both posted versions follow one pattern: simulate one game with `sample()`, wrap the match in a function, repeat it $m$ times, count the event, draw the distribution of $X$ with half-integer breaks, and judge an observed $X$ with a Z-score or a tail probability.

**V1: Alice and Bob play checkers.** Alice wins a game with probability 0.6; a match is 13 games.

```r
# (a) one match: 13 games, each "A" with probability 0.6
sample( c("A","B"), 13, replace=TRUE, prob = c(0.6,0.4))
## [1] "A" "A" "A" "B" "B" "A" "A" "A" "A" "A" "B" "B" "A"

# (b) many matches: X = number of games Alice wins
Simulate.Trials <- function(m){
  X.vals <- numeric(m)
  for (i in 1:m) {
    games <- sample( c("A","B"), 13, replace=TRUE, prob = c(0.6,0.4))
    X.vals[i] <- sum(games == "A")
  }
  return(X.vals)
}

# (c) P(Alice wins the match) = P(X >= 7)
m.trials <- 10^5
X.vals <- Simulate.Trials(m.trials)
p.Alice <- sum(X.vals >= 7)/(m.trials)
paste0("The probability Alice wins the match is ", p.Alice)
## [1] "The probability Alice wins the match is 0.77156"

# (d) the distribution of X: one bar per integer, so breaks sit on the half-integers
hist(X.vals, breaks=seq(-0.5, 13.5, by=1), freq = FALSE, col="lightgreen",
     xlab="X = Alice Wins", ylab="Probability Density",
     main=paste0("Number of Games Alice Wins (m = ", m.trials, " trials)"))

# (e) mean, sd, and the Z-score of 3 wins
mu.X <- mean(X.vals); sig.X <- sd(X.vals)
c(mu.X, sig.X)                   ## 7.799920 1.765219
Z <- (3 - mu.X)/sig.X; Z         ## -2.719164
sum(X.vals <= 3)/m.trials        ## 0.0081
```

:::info R syntax
| Code | What it does |
|---|---|
| `## [1] …` | Lines starting `##` are comments holding what R printed. `[1]` is the position of the first value on the printed line. |
| `sample( c("A","B"), 13, replace=TRUE, prob = c(0.6,0.4))` | x = the two outcomes, size = 13 games, with replacement, "A" weighted 0.6 and "B" 0.4. |
| `Simulate.Trials <- function(m){ … }` | A function of the number of matches `m`. |
| `X.vals <- numeric(m)` | `m` zeros to fill, one per match. |
| `X.vals[i] <- sum(games == "A")` | Counts Alice's wins in match `i` and stores the count in slot `i`. |
| `return(X.vals)` | Returns the whole vector of win counts. |
| `p.Alice <- sum(X.vals >= 7)/(m.trials)` | `>=` is greater than or equal; `sum` counts matches with at least 7 wins, divided by the trials. |
| `paste0("The probability Alice wins the match is ", p.Alice)` | Glues the text and the number into one string with no separator; on its own line it prints. |
| `hist(X.vals, …)` | Draws a histogram of x = `X.vals`. |
| `breaks=seq(-0.5, 13.5, by=1)` | `seq` with from = -0.5, to = 13.5, by = 1: bin edges -0.5, 0.5, …, 13.5. |
| `freq = FALSE` | Bar heights are densities, not counts; with width-1 bins they equal relative frequencies. |
| `col="lightgreen"` | The bar fill colour. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title; `main` is built with `paste0` around `m.trials`. |
| `mu.X <- mean(X.vals); sig.X <- sd(X.vals)` | `;` separates two commands on one line. `mean` and `sd` are the mean and standard deviation. |
| `c(mu.X, sig.X)` | Combines the two into a vector so both print together. |
| `Z <- (3 - mu.X)/sig.X; Z` | Stores the Z-score, then prints it. |
| `sum(X.vals <= 3)/m.trials` | `<=` is less than or equal: the share of matches with 3 or fewer wins. |

**Left to right**

- `sample( c("A","B"), 13, replace=TRUE, prob = c(0.6,0.4))`: "A random sample (`sample`) from A and B (`c("A","B")`) of size 13 (`13`) with replacement (`replace=TRUE`) and weights (`prob =`) 0.6 and 0.4 (`c(0.6,0.4)`)."
- `Simulate.Trials <- function(m){ … }`: "Store under the name Simulate.Trials (`Simulate.Trials <-`) a function of m (`function(m)`) that stores under X.vals (`X.vals <-`) m zeros (`numeric(m)`), then for (`for`) each i in 1 to m (`1:m`) stores under games (`games <-`) one 13-game match (`sample(…)`) and in slot i (`X.vals[i] <-`) the count (`sum`) of games equal to (`==`) A, and returns (`return`) X.vals."
- `m.trials <- 10^5`: "Store under the name m.trials (`m.trials <-`) ten to the power five (`10^5`)."
- `X.vals <- Simulate.Trials(m.trials)`: "Store under the name X.vals (`X.vals <-`) the result of Simulate.Trials (`Simulate.Trials`) on m.trials (`m.trials`)."
- `p.Alice <- sum(X.vals >= 7)/(m.trials)`: "Store under the name p.Alice (`p.Alice <-`) the count (`sum`) of X.vals at least (`>=`) 7, divided by (`/`) m.trials (`(m.trials)`)."
- `paste0("The probability Alice wins the match is ", p.Alice)`: "Glue together (`paste0`) the sentence text and p.Alice (`p.Alice`)."
- `hist(X.vals, …)`: "Draw a histogram (`hist`) of X.vals (`X.vals`) with bin edges (`breaks=`) from -0.5 to 13.5 in steps of 1 (`seq(-0.5, 13.5, by=1)`), as densities (`freq = FALSE`), in light green (`col="lightgreen"`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`) glued (`paste0`) around m.trials."
- `mu.X <- mean(X.vals); sig.X <- sd(X.vals)`: "Store under the name mu.X (`mu.X <-`) the mean (`mean`) of X.vals, then (`;`) store under sig.X (`sig.X <-`) its standard deviation (`sd`)."
- `c(mu.X, sig.X)`: "Combine (`c()`) mu.X (`mu.X`) and sig.X (`sig.X`)."
- `Z <- (3 - mu.X)/sig.X; Z`: "Store under the name Z (`Z <-`) 3 minus mu.X (`3 - mu.X`) divided by (`/`) sig.X (`sig.X`), then (`;`) print Z (`Z`)."
- `sum(X.vals <= 3)/m.trials`: "The count (`sum`) of X.vals at most (`<=`) 3, divided by (`/`) m.trials (`m.trials`)."

**Right to left**, the order R runs it

- `sample( c("A","B"), 13, replace=TRUE, prob = c(0.6,0.4))`: "Combine the outcomes and the weights (`c()`), then draw 13 outcomes with repeats and those weights (`sample`)."
- `Simulate.Trials <- function(m){ … }`: "Build a function that makes m zeros (`numeric(m)`), and each time round the loop (`for`, `1:m`) plays a 13-game match (`sample(…)`), stores it (`games <-`), compares each game with A (`games == "A"`), counts the TRUEs (`sum`) and stores the count in slot i (`X.vals[i] <-`); then returns the vector (`return`); store it as Simulate.Trials (`Simulate.Trials <-`)."
- `m.trials <- 10^5`: "Compute 10 to the power 5 (`10^5`), then store it as m.trials (`m.trials <-`)."
- `X.vals <- Simulate.Trials(m.trials)`: "Look up m.trials (`m.trials`), run Simulate.Trials on it (`Simulate.Trials`), then store the win counts as X.vals (`X.vals <-`)."
- `p.Alice <- sum(X.vals >= 7)/(m.trials)`: "Compare each count with 7 (`X.vals >= 7`), count the TRUEs (`sum`), divide by m.trials (`/`), then store it as p.Alice (`p.Alice <-`)."
- `paste0("The probability Alice wins the match is ", p.Alice)`: "Look up p.Alice (`p.Alice`), glue it after the sentence text (`paste0`) and print."
- `hist(X.vals, …)`: "Build the bin edges (`seq(-0.5, 13.5, by=1)`) and the title string (`paste0`), then draw the density histogram of X.vals with those settings (`hist`)."
- `mu.X <- mean(X.vals); sig.X <- sd(X.vals)`: "Average X.vals (`mean`) and store it (`mu.X <-`); then (`;`) find its standard deviation (`sd`) and store it (`sig.X <-`)."
- `c(mu.X, sig.X)`: "Look up mu.X and sig.X, combine them (`c()`) and print."
- `Z <- (3 - mu.X)/sig.X; Z`: "Subtract mu.X from 3 in the brackets (`3 - mu.X`), divide by sig.X (`/sig.X`), store it as Z (`Z <-`); then (`;`) print Z (`Z`)."
- `sum(X.vals <= 3)/m.trials`: "Compare each count with 3 (`X.vals <= 3`), count the TRUEs (`sum`), then divide by m.trials (`/`) and print."
:::

`breaks=seq(-0.5, n+0.5, by=1)` (Task 12) gives each integer value of $X$ its own bar and `freq = FALSE` makes the heights relative frequencies. The 0.77156 estimates a number Unit 4 computes exactly (binomial: 0.7712). The verdict on $X = 3$, in the solution's words: *unusual*, justified *in terms of the Z-score, which is −2.7*, or because *the left-tail from X = 3 and below has probability 0.0080, which is smaller than 0.0250*. With the rounded 7.80 and 1.77, $Z = -2.71$.

### Alice's 13-game match, simulated

The same match in the simulator: 13 games, Alice wins each with probability 0.6. The bars centre near $13 \times 0.6 = 7.8$; the bars for $X = 7$ to 13 add to about 0.77, against the exact 0.7712.

```widget
sim-lab
{ "experiment": "coins", "n": 13, "p": 0.6, "m": 10000, "title": "13 games, P(Alice wins a game) = 0.6: X = games Alice wins" }
```

**V1, Q2: Alice takes pity.** Before each game a die is rolled; a 6 means Alice throws the game. One game is a function, a match is `replicate()` of it, the trials are `replicate()` of the match:

```r
Simulate.Game <- function() {
  die.roll <- sample(1:6, 1)
  if (die.roll == 6){
    return("B")
  }else{
    return( sample(c("A", "B"), 1, prob=c(0.6, 0.4)) )
  }
}
Simulate.Match <- function(n.games){
  return( replicate(n.games, Simulate.Game()) )
}
Simulate.Trials <- function(m.trials){
  return( sum(replicate(m.trials, sum(Simulate.Match(13) == "A") >= 7)) )
}
m.trials <- 10^5
p.Alice <- Simulate.Trials(m.trials)/m.trials
p.Alice                          ## 0.49895
```

:::info R syntax
| Code | What it does |
|---|---|
| `die.roll <- sample(1:6, 1)` | x = the integers 1 to 6, size = 1: one die roll. |
| `if (die.roll == 6){ return("B") }else{ … }` | `if` runs the first braces when the roll is 6; `else` runs the second braces otherwise. |
| `sample(c("A", "B"), 1, prob=c(0.6, 0.4))` | One game: x = the outcomes, size = 1, weights 0.6 and 0.4. |
| `Simulate.Match <- function(n.games){ return( replicate(n.games, Simulate.Game()) ) }` | Plays `n.games` games and returns their outcomes as a vector. |
| `sum(Simulate.Match(13) == "A") >= 7` | Counts Alice's wins in one 13-game match, then tests whether she won the match: `TRUE` or `FALSE`. |
| `sum(replicate(m.trials, …))` | Repeats the match test `m.trials` times and counts the `TRUE`s. |
| `p.Alice <- Simulate.Trials(m.trials)/m.trials` | Turns the count into a proportion; the next line prints it. |

**Left to right**

- `Simulate.Game <- function() { … }`: "Store under the name Simulate.Game (`Simulate.Game <-`) a function with no arguments (`function()`) that stores under die.roll (`die.roll <-`) one (`1`) random draw (`sample`) from 1 to 6 (`1:6`); if (`if`) die.roll equals (`==`) 6 it returns (`return`) B, otherwise (`else`) it returns one draw (`sample`) from A and B (`c("A", "B")`) with weights (`prob=`) 0.6 and 0.4."
- `Simulate.Match <- function(n.games){ … }`: "Store under the name Simulate.Match (`Simulate.Match <-`) a function of n.games (`function(n.games)`) that returns (`return`) n.games (`n.games`) repeats (`replicate`) of one game (`Simulate.Game()`)."
- `Simulate.Trials <- function(m.trials){ … }`: "Store under the name Simulate.Trials (`Simulate.Trials <-`) a function of m.trials (`function(m.trials)`) that returns (`return`) the count (`sum`) over m.trials repeats (`replicate`) of whether the count (`sum`) of A wins (`== "A"`) in a 13-game match (`Simulate.Match(13)`) is at least (`>=`) 7."
- `m.trials <- 10^5`: "Store under the name m.trials (`m.trials <-`) ten to the power five (`10^5`)."
- `p.Alice <- Simulate.Trials(m.trials)/m.trials`: "Store under the name p.Alice (`p.Alice <-`) Simulate.Trials (`Simulate.Trials`) of m.trials, divided by (`/`) m.trials (`m.trials`)."
- `p.Alice`: "Print p.Alice (`p.Alice`)."

**Right to left**, the order R runs it

- `Simulate.Game <- function() { … }`: "Build a function that rolls a die (`sample(1:6, 1)`) and stores it (`die.roll <-`), tests it against 6 (`die.roll == 6`), and returns B when TRUE (`if`, `return("B")`) or else draws one weighted game (`sample(c("A", "B"), 1, prob=c(0.6, 0.4))`) and returns that (`else`, `return`); store it as Simulate.Game (`Simulate.Game <-`)."
- `Simulate.Match <- function(n.games){ … }`: "Build a function that plays one game (`Simulate.Game()`) n.games times (`replicate`) and returns the outcomes (`return`); store it as Simulate.Match (`Simulate.Match <-`)."
- `Simulate.Trials <- function(m.trials){ … }`: "Build a function that plays a 13-game match (`Simulate.Match(13)`), compares each game with A (`== "A"`), counts the wins (`sum`), tests the count against 7 (`>= 7`), repeats all that m.trials times (`replicate`), counts the TRUEs (`sum`) and returns the count (`return`); store it as Simulate.Trials (`Simulate.Trials <-`)."
- `m.trials <- 10^5`: "Compute 10 to the power 5 (`10^5`), then store it as m.trials (`m.trials <-`)."
- `p.Alice <- Simulate.Trials(m.trials)/m.trials`: "Run Simulate.Trials on m.trials (`Simulate.Trials(m.trials)`), divide by m.trials (`/`), then store it as p.Alice (`p.Alice <-`)."
- `p.Alice`: "Look up p.Alice (`p.Alice`) and print it."
:::

Alice now wins a game with probability $(5/6)(0.6) = 0.5$ (AND rule): a fair coin.

**V3: Chad and Deb play blackjack.** Ace to 10 four times each, plus twelve face cards worth 10.

```r
cards <- c(rep(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 4), rep(10, 12))

Chad.score <- function(){ return(sum(sample(cards, 2, replace=TRUE))) }
Deb.score <- function(){
  score <- sum(sample(cards, 3, replace=TRUE))
  if(score > 21){ score <- 0 }       # bust
  return(score)
}

p.Chad.Wins <- function(m){
  k.Chad <- sum(replicate(m, Chad.score() > Deb.score()))
  return( k.Chad/m )
}
print(paste0("The probability that Chad wins is ", round(p.Chad.Wins(10^5),4)*100, "%"))
## [1] "The probability that Chad wins is 54.62%"

# a function that returns two numbers: a list
Chad.score.distribution <- function(m){
  scores <- replicate(m, Chad.score())
  res <- list(mean=mean(scores), sig=sd(scores))
  hist(scores, freq=FALSE, breaks=seq(1.5, 20.5, by=1), col="lightblue",
       xlab="X (Chad score)", ylab="Prob Density", main="Distribution of Chad's Blackjack Score")
  return(res)
}
Chad.params <- Chad.score.distribution(10^5)     ## mean 13.10392, sig 4.460993
Z <- (5 - Chad.params$mean)/Chad.params$sig; Z   ## -1.816618
```

:::info R syntax
| Code | What it does |
|---|---|
| `rep(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 4)` | `rep(x, times)`: x = the values 1 to 10, times = 4, so the whole run repeats four times. |
| `rep(10, 12)` | x = 10, times = 12: twelve 10s for the face cards. |
| `cards <- c(…, …)` | `c()` joins the two vectors into one 52-card deck. |
| `sum(sample(cards, 2, replace=TRUE))` | Draws size = 2 cards from x = `cards` with replacement and adds them. |
| `if(score > 21){ score <- 0 }` | `>` is greater than: a score over 21 is reset to 0. |
| `Chad.score() > Deb.score()` | One hand each; `TRUE` when Chad scores higher. |
| `sum(replicate(m, …))` | Counts Chad's wins over `m` hands. |
| `round(p.Chad.Wins(10^5),4)*100` | `round(x, digits)`: x = the estimate, digits = 4; times 100 makes it a percentage. |
| `print(paste0(…, "%"))` | Builds the sentence string and prints it explicitly. |
| `res <- list(mean=mean(scores), sig=sd(scores))` | `list()` holds several values under names, here `mean` and `sig`. |
| `hist(scores, freq=FALSE, breaks=seq(1.5, 20.5, by=1), col="lightblue", …)` | Draws a density histogram with one bar per score 2 to 20; `xlab`, `ylab`, `main` set the labels and title. |
| `Chad.params$mean`, `Chad.params$sig` | `$` reads a named element back out of the list. |
| `Z <- (5 - Chad.params$mean)/Chad.params$sig; Z` | Stores the Z-score of 5, then prints it. |

**Left to right**

- `cards <- c(rep(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 4), rep(10, 12))`: "Store under the name cards (`cards <-`) the combination (`c()`) of the values 1 to 10 (`c(1, …, 10)`) repeated (`rep`) 4 times (`4`) and the value 10 (`10`) repeated (`rep`) 12 times (`12`)."
- `Chad.score <- function(){ … }`: "Store under the name Chad.score (`Chad.score <-`) a function with no arguments (`function()`) that returns (`return`) the sum (`sum`) of a sample (`sample`) of 2 (`2`) cards (`cards`) with replacement (`replace=TRUE`)."
- `Deb.score <- function(){ … }`: "Store under the name Deb.score (`Deb.score <-`) a function that stores under score (`score <-`) the sum (`sum`) of 3 sampled cards (`sample(cards, 3, replace=TRUE)`), sets score to 0 (`score <- 0`) if (`if`) score is greater than (`>`) 21, and returns (`return`) score."
- `p.Chad.Wins <- function(m){ … }`: "Store under the name p.Chad.Wins (`p.Chad.Wins <-`) a function of m (`function(m)`) that stores under k.Chad (`k.Chad <-`) the count (`sum`) over m repeats (`replicate`) of whether Chad's score (`Chad.score()`) is greater than (`>`) Deb's (`Deb.score()`), and returns (`return`) k.Chad divided by (`/`) m."
- `print(paste0(…, round(p.Chad.Wins(10^5),4)*100, "%"))`: "Print (`print`) the glued string (`paste0`) of the sentence text, the estimate (`p.Chad.Wins(10^5)`) rounded (`round`) to 4 places (`4`) times (`*`) 100, and a percent sign (`"%"`)."
- `Chad.score.distribution <- function(m){ … }`: "Store under the name Chad.score.distribution (`Chad.score.distribution <-`) a function of m that stores under scores (`scores <-`) m repeats (`replicate`) of Chad's score, stores under res (`res <-`) a list (`list`) of their mean (`mean=mean(scores)`) and sd (`sig=sd(scores)`), draws a density histogram (`hist`, `freq=FALSE`) with breaks 1.5 to 20.5 (`breaks=seq(1.5, 20.5, by=1)`) in light blue (`col="lightblue"`) with labels and title, and returns (`return`) res."
- `Chad.params <- Chad.score.distribution(10^5)`: "Store under the name Chad.params (`Chad.params <-`) the result of Chad.score.distribution (`Chad.score.distribution`) on ten to the power five (`10^5`)."
- `Z <- (5 - Chad.params$mean)/Chad.params$sig; Z`: "Store under the name Z (`Z <-`) 5 minus the mean element of Chad.params (`Chad.params$mean`), divided by (`/`) its sig element (`Chad.params$sig`), then (`;`) print Z (`Z`)."

**Right to left**, the order R runs it

- `cards <- c(rep(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 4), rep(10, 12))`: "Combine 1 to 10 (`c(1, …, 10)`) and repeat that run four times (`rep(…, 4)`), make twelve 10s (`rep(10, 12)`), join the two (`c()`), then store the deck as cards (`cards <-`)."
- `Chad.score <- function(){ … }`: "Build a function that draws 2 cards with replacement (`sample(cards, 2, replace=TRUE)`), adds them (`sum`) and returns the total (`return`); store it as Chad.score (`Chad.score <-`)."
- `Deb.score <- function(){ … }`: "Build a function that draws 3 cards (`sample(cards, 3, replace=TRUE)`), adds them (`sum`) and stores the total (`score <-`), tests it against 21 (`score > 21`) and resets it to 0 when TRUE (`if`), then returns it (`return`); store it as Deb.score (`Deb.score <-`)."
- `p.Chad.Wins <- function(m){ … }`: "Build a function that scores one hand each (`Chad.score()`, `Deb.score()`), compares them (`>`), repeats that m times (`replicate`), counts the TRUEs (`sum`) into k.Chad (`k.Chad <-`), divides by m (`k.Chad/m`) and returns it (`return`); store it as p.Chad.Wins (`p.Chad.Wins <-`)."
- `print(paste0(…, round(p.Chad.Wins(10^5),4)*100, "%"))`: "Compute 10 to the power 5 (`10^5`), run p.Chad.Wins on it, round to 4 places (`round(…, 4)`), multiply by 100 (`*100`), glue it between the text and the percent sign (`paste0`), then print the string (`print`)."
- `Chad.score.distribution <- function(m){ … }`: "Build a function that scores m hands for Chad (`replicate(m, Chad.score())`) and stores them (`scores <-`), finds their mean and sd (`mean`, `sd`), packs both into a named list (`list`) stored as res (`res <-`), draws the histogram (`hist`) and returns the list (`return`); store it as Chad.score.distribution (`Chad.score.distribution <-`)."
- `Chad.params <- Chad.score.distribution(10^5)`: "Compute 10 to the power 5 (`10^5`), run Chad.score.distribution on it (it draws the histogram), then store the returned list as Chad.params (`Chad.params <-`)."
- `Z <- (5 - Chad.params$mean)/Chad.params$sig; Z`: "Read the mean out of the list (`Chad.params$mean`), subtract it from 5 (`5 -`), read sig (`Chad.params$sig`), divide (`/`), store it as Z (`Z <-`); then (`;`) print Z (`Z`)."
:::

`list(mean=, sig=)` returns two numbers, read back as `Chad.params$mean`; two cards score 2 to 20, hence breaks 1.5 to 20.5. Typed answer: *No, Chad's score X = 5 is not unusual since it is less than two standard deviations away from its mean.* Q2 lets Chad hit on 18 or less (bust above 21 scores 0): 51.73%, lower.

:::quiz Two accepted ways to say "unusual"
Either $|Z| > 2$ (Alice: $Z = -2.72$, unusual; Chad: $Z = -1.82$, not unusual) or a tail probability below 0.025 (Alice: $P(X \le 3) = 0.0081 < 0.0250$). State the number and the cut-off with the verdict.
:::

## Simulate a Classic Chaos scroll on 20 items

A Classic Chaos scroll (the 10 % tier whose failures can destroy the item) succeeds 10 % of the time, and a failure destroys the item 50 % of the time [Classic, meowdb's copy of the in-game item text, unchanged since Closed Online Test 2, checked 2026-10-27]. One use is success, fail with the item kept, or fail with it destroyed; $X$ counts the destroyed items when 20 items get one use each.

```quiz
[
  {"type": "fill", "q": "Fill the missing weight.", "code": "Chaos.Once <- function(){\n  return( sample(c(\"success\",\"kept\",\"destroyed\"), 1, prob = c(0.10, ___, 0.45)) )\n}", "answer": ["0.45"], "explain": "AND rule: $P(\\text{fail} \\cap \\text{kept}) = 0.90 \\times 0.50 = 0.45$, and the three weights $0.10 + 0.45 + 0.45$ sum to 1."},
  {"q": "What exact proportion does `sum(replicate(m, Chaos.Once()) == \"destroyed\")/m` settle to? (4 decimals)", "type": "numeric", "answer": 0.45, "tolerance": 0.0001, "explain": "The \"destroyed\" weight, $0.90 \\times 0.50 = 0.4500$; one run with $m = 10^5$ is one draw near 45 000 destroyed."},
  {"type": "fill", "q": "Fill the upper break so every value of $X$ from 0 to 20 gets its own bar.", "code": "X.vals <- replicate(10^5, sum(replicate(20, Chaos.Once()) == \"destroyed\"))\nhist(X.vals, breaks=seq(-0.5, ___, by=1), freq=FALSE)", "answer": ["20.5"], "explain": "Half-integer breaks from −0.5 to $n + 0.5 = 20.5$ centre a bar on each integer; `freq=FALSE` makes the heights relative frequencies."},
  {"q": "`mean(X.vals)` and `sd(X.vals)` settle near 9 and 2.22 (computed: $np = 20 \\times 0.45$ and $\\sqrt{np(1-p)} = \\sqrt{20 \\times 0.45 \\times 0.55}$). Compute $Z$ for 15 destroyed items. (2 decimals)", "type": "numeric", "answer": 2.7, "tolerance": 0.006, "explain": "$Z = (15 - 9)/2.2249 = 2.6968$, or $6/2.22 = 2.7027$; both round to 2.70."},
  {"q": "Is $X = 15$ destroyed items out of 20 unusual?", "type": "text", "answer": ["unusual", "yes", "Yes", "yes, unusual", "it is unusual"], "explain": "$|Z| = 2.70 > 2$, so yes, unusual. The other accepted test is a tail probability below 0.025."}
]
```

```quiz
[
  {
    "q": "Which call simulates rolling five fair dice?",
    "options": ["`sample.int(6, 5)`", "`sample.int(6, 5, replace=TRUE)`", "`sample(5, 6)`", "`replicate(6, 5)`"],
    "answer": 1,
    "explain": "Without replace=TRUE the five values are always distinct, which dice are not."
  },
  {
    "q": "What does `sum(die.outcomes == 6)` compute?",
    "options": ["the sum of the dice", "the number of rolls that showed a 6", "6 times the number of rolls", "TRUE or FALSE"],
    "answer": 1,
    "explain": "The comparison gives a logical vector; sum() counts the TRUEs."
  },
  {
    "q": "Simulate 1000 flips of a coin that lands heads 55% of the time.",
    "options": ["`sample(c(\"H\",\"T\"), 1000, replace=TRUE, prob=c(0.55, 0.45))`", "`sample(c(\"H\",\"T\"), 1000)`", "`replicate(0.55, 1000)`", "`sample.int(2, 1000, prob=0.55)`"],
    "answer": 0,
    "explain": "Task 2: replace=TRUE for repeated flips and prob= for the unequal probabilities."
  },
  {
    "q": "In `Prob.Heads`, the estimate returned is...",
    "options": ["the number of heads k", "k/m, the relative frequency of heads in m trials", "m/k", "0.5"],
    "answer": 1,
    "explain": "P(E) ≈ k/m: successes over trials, close to 0.5 for a fair coin and 10^5 trials."
  },
  {
    "q": "What is the exact P(sum of two dice = 7) that `Prob.E(10^5)` (0.16789) estimates? (4 decimals)",
    "type": "numeric",
    "answer": 0.1667,
    "tolerance": 0.0003,
    "explain": "Six of 36 outcomes sum to 7: 6/36 = 0.1667."
  },
  {
    "q": "`replicate(m, sum(sample.int(6, 2, replace=TRUE)))` returns...",
    "options": ["one number", "a vector of m simulated sums of two dice", "a table", "TRUE"],
    "answer": 1,
    "explain": "replicate runs the expression m times and collects the results, replacing a for loop whose body ignores i."
  },
  {
    "q": "Task 9 found s = 0.051 for m = 100 and s = 0.017 for m = 1000. What happens to the variability of the estimate as m grows tenfold?",
    "options": ["it stays the same", "it shrinks by about a factor of 3 (√10)", "it shrinks by a factor of 10", "it grows"],
    "answer": 1,
    "explain": "0.143, 0.051, 0.017, 0.0056, 0.0019: each step divides by roughly 3.2 = √10."
  },
  {
    "q": "`prop.table(table(die.vals))` gives...",
    "options": ["the counts of each die value", "the relative frequency of each die value", "the probability 1/6", "the mean die value"],
    "answer": 1,
    "explain": "table counts; prop.table divides by the total. Roll.Dice bar-plots these and they flatten towards 1/6 as m grows."
  },
  {
    "q": "In `Roll.Some.Dice(10000, n)` with X = number of 3s, what happens to the distribution of X as n increases from 1 to 100?",
    "options": ["it becomes flat", "it becomes closer to a normal distribution, peaking near n/6", "it stays at two bars", "it peaks at n/2"],
    "answer": 1,
    "explain": "The lab's answer: bell-shaped as n grows, with the peak at about n/6 (X ≈ 16 for 100 dice)."
  },
  {
    "q": "In `Draw.Cards`, drawing without replacement compared with drawing with replacement...",
    "options": ["moves the centre of the distribution", "makes the distribution narrower (less variability) without changing the centre n/2", "makes it wider", "has no effect"],
    "answer": 1,
    "explain": "The lab's second conclusion. Removing cards makes the remaining draws lean back towards balance, tightening the spread; the mean stays at n/2 = 26/52 × n."
  },
  {
    "type": "fill",
    "q": "Complete the deck of 26 red and 26 black cards for the simulation.",
    "code": "deck <- c(rep(\"R\", 26), rep(\"B\", ___))",
    "answer": ["26"],
    "explain": "rep(value, times) repeats a value; the deck is 26 R and 26 B, and sample(deck, n, replace) draws from it."
  }
]
```
