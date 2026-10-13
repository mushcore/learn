---
title: Lab 4: simulating probabilities with sample() and replicate()
minutes: 28
---

Lab 4 is the relative-frequency definition made executable: simulate a random experiment $m$ times with `sample()`, count how often the event occurred, and estimate $P(E) \approx k/m$. Package: `mosaic`.

## sample(): one call, three arguments that matter

```r
sample( c(1,2,3,4,5,6), 1)        # one fair die
sample.int(6, 1)                  # the same, for the integers 1..6
sample.int(6, 5, replace=TRUE)    # five dice: 6 6 3 4 5
sample.int(6, 5)                  # WITHOUT replacement: always five distinct values
sample.int(6, 100, replace=TRUE, prob = c(0.1, 0.1, 0.1, 0.1, 0.1, 0.5))   # a loaded die
```

The first argument is the sample space, the second how many draws. `replace=TRUE` puts each value back, which is how independent dice behave; without it the values are always distinct, which is how cards behave. `prob=` gives unequal probabilities.

Counting an event is a comparison inside `sum()`: `X <- sum(die.outcomes == 6)` counts the sixes in 100 rolls (12 in the lab's run). Coins are strings: `sample(c("H","T"), 1)`; Task 2's 1000 flips with a 55% coin are `sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45))` and `X <- sum(coin.outcomes == "H")` (537 in the lab's run).

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

To keep a loop's results, allocate a vector first (`numeric(100)`, `character(n)`) and fill `res.coins[i]`.

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

Same estimates (0.50364, 0.16849), less code, and much faster, which Task 9 needs.

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

Task 11, `Roll.Some.Dice(m, n)`, rolls $n$ dice per trial with $X$ = the number of 3s. For $n$ = 1, 2, 5, 10, 100 the shape moves from two bars to a bell: **as $n$ increases the distribution of $X$ becomes closer and closer to a normal distribution, with its peak near $n/6$** ($X \approx 1$ for 10 dice, $X \approx 16$ for 100).

```widget
sim-lab
{ "experiment": "dice3", "n": 10, "m": 10000, "title": "Roll.Some.Dice(m, n): the number of 3s, with a bell forming around n/6 as n grows" }
```

Task 12, `Draw.Cards(m, n, replace)`, models the deck as `deck <- c(rep("R", 26), rep("B", 26))` and plots a mosaic `histogram(X.vals, type="d", breaks=seq(-0.5, n+0.5, by=1), ...)`. Runs for n = 1, 5, 10, 20, 50, with and without replacement, give the lab's two conclusions: the shape again approaches normal as $n$ grows, and **`replace=FALSE` makes the distribution narrower (less variability) without moving its centre, which is always $n/2$**.

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

`list(mean=, sig=)` returns two numbers, read back as `Chad.params$mean`; two cards score 2 to 20, hence breaks 1.5 to 20.5. Typed answer: *No, Chad's score X = 5 is not unusual since it is less than two standard deviations away from its mean.* Q2 lets Chad hit on 18 or less (bust above 21 scores 0): 51.73%, lower.

:::quiz Two accepted ways to say "unusual"
Either $|Z| > 2$ (Alice: $Z = -2.72$, unusual; Chad: $Z = -1.82$, not unusual) or a tail probability below 0.025 (Alice: $P(X \le 3) = 0.0081 < 0.0250$). State the number and the cut-off with the verdict.
:::

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
