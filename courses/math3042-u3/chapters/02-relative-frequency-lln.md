---
title: Relative frequency and the law of large numbers
minutes: 18
---

Counting outcomes gives a probability only when the outcomes are equally likely and you can list them. The other route is to run the experiment many times and count how often the event happens. The two routes agree in the limit, and that agreement is the law of large numbers.

## The relative frequency definition

Perform $n$ trials of a random experiment and find that event $A$ occurs $x$ times. Then

$$P(A) \approx \frac{x}{n}$$

The filled notes label the fraction *x (# success)* over *n (# trials)* and call it the *relative freq definition*.

**The law of large numbers**: if you perform the random experiment enough times, $x/n$ must approach the exact classical probability $P(A)$. For a small $n$ the fraction wanders; as $n$ grows it settles.

## Boxcars, both ways

In the casino game Craps two dice are rolled; "boxcars" is both sixes. **Classically**: there are $6 \times 6 = 36$ equally likely outcomes (the grid below), and exactly one of them is (6, 6), so $P(B) = 1/36 = 0.0278$.

```widget
sample-space
{ "mode": "dice", "event": "boxcars", "title": "Two dice: 36 equally likely outcomes; boxcars is one of them" }
```

**By relative frequency**: simulate. The notes' R uses a for-loop:

```r
n.trials <- 10^5
n.dice <- 2
X.success <- 0

for (i.trial in 1:n.trials){
    dice <- sample(c(1,2,3,4,5,6), n.dice, replace=TRUE)
    success <- (dice[1] == 6) & (dice[2] == 6)
    X.success <- X.success + success
}

prob.B <- X.success / n.trials
prob.B
```
```text
[1] 0.02799
```

`sample(c(1,2,3,4,5,6), n.dice, replace=TRUE)` rolls two dice (`replace=TRUE` lets both show the same number, lesson 8). `success` is `TRUE` or `FALSE`, and adding it to `X.success` counts the TRUEs. The run in the filled notes gave $P(B) \approx x/n = 0.0281$, against the exact $1/36 = 0.0278$; the demo notebook's `prob.B.classical <- 1/(6^2)` prints 0.02777778. Every run lands on a slightly different third decimal.

### x/n settling as n grows

Each step adds a batch of trials on a log schedule (1, 2, 5, 10 … 100 000). Early points swing between 0 and large fractions; by $n = 10^4$ the trace sits within a few thousandths of 1/36.

```widget
lln-sim
{ "experiment": "Boxcars (two sixes)" }
```

The notes' phrase is exact: the relative frequency **must** approach $P(A)$, but only as $n$ becomes large; ten trials of boxcars will usually show zero successes.

:::tip Two definitions, one number
Classical: count outcomes, exact, needs equally likely outcomes you can list. Relative frequency: run trials, approximate, works for any experiment you can repeat. Lab 4 lives entirely in the second world; the pencil part of the quiz in the first.
:::

## A sum of 10 from two dice, two ways

A simulation rolled two dice 2000 times and saw a sum of 10 on 171 of them.

```quiz
[
  {"q": "Relative-frequency estimate of $P(\\text{sum} = 10)$? (4 decimals)", "type": "numeric", "answer": 0.0855, "tolerance": 6e-05, "explain": "$P(A) \\approx x/n = 171/2000 = 0.0855$."},
  {"q": "Classical $P(\\text{sum} = 10)$? (4 decimals)", "type": "numeric", "answer": 0.0833, "tolerance": 6e-05, "explain": "(4, 6), (5, 5), (6, 4): 3 of the 36 equally likely outcomes, $3/36 = 0.0833$."},
  {"q": "How many sums of 10 would the classical probability predict in 2000 rolls? (1 decimal)", "type": "numeric", "answer": 166.7, "tolerance": 0.06, "explain": "$2000 \\times 3/36 = 166.7$. The 171 observed is close, as the law of large numbers says it should be for large $n$."},
  {"q": "A second run of only 20 rolls would give a relative frequency closer to 0.0833 than this run did.", "type": "tf", "answer": false, "explain": "Fewer trials means more wander: 20 rolls can only give 0, 0.05, 0.10, …, so it will usually miss by more. $x/n$ settles only as $n$ grows."},
  {"type": "fill", "q": "Edit the notes' boxcars loop to count sums of 10.", "code": "n.trials <- 2000\nX.success <- 0\nfor (i.trial in 1:n.trials){\n    dice <- sample(c(1,2,3,4,5,6), 2, replace=TRUE)\n    success <- (dice[1] + dice[2]) == ___\n    X.success <- X.success + success\n}\nprob.A <- X.success / ___", "answer": ["10", "n.trials"], "explain": "The event is a sum of 10, so compare the sum with 10; the estimate is successes over trials, `X.success / n.trials`, about 0.0855 in the run above."}
]
```

```quiz
[
  {
    "q": "The relative frequency definition of probability says $P(A) \\approx$ ...",
    "options": ["$|A| / |S|$", "$x / n$, where A occurred x times in n trials", "$n / x$", "$1 - x$"],
    "answer": 1,
    "explain": "Successes over trials. It is an approximation that improves with n."
  },
  {
    "q": "The law of large numbers says that as the number of trials grows, x/n...",
    "options": ["becomes exactly 0.5", "must approach the exact classical probability P(A)", "becomes 0", "stays random forever with no pattern"],
    "answer": 1,
    "explain": "The notes' wording: perform the experiment enough times and x/n must approach P(A)."
  },
  {
    "q": "P(boxcars) for two fair dice, classically? (4 decimals)",
    "type": "numeric",
    "answer": 0.0278,
    "tolerance": 0.0003,
    "explain": "One outcome, (6, 6), out of 36 equally likely: 1/36 = 0.02778."
  },
  {
    "q": "How many equally likely outcomes does rolling two dice have?",
    "type": "numeric",
    "answer": 36,
    "tolerance": 0,
    "explain": "6 × 6: the notes' grid of dice pairs. (1, 2) and (2, 1) are different outcomes."
  },
  {
    "q": "In the simulation, what does `X.success <- X.success + success` do when `success` is a logical?",
    "options": ["Causes an error", "Adds 1 for TRUE and 0 for FALSE, so X.success counts the successes", "Concatenates the values", "Replaces X.success with TRUE"],
    "answer": 1,
    "explain": "R treats TRUE as 1 and FALSE as 0 in arithmetic, so the loop tallies boxcars."
  },
  {
    "q": "After 10 trials of boxcars the simulation reports x/n = 0. This means...",
    "options": ["P(boxcars) is 0", "the classical answer is wrong", "n is too small; ten trials of an event with probability 1/36 usually contain no success", "the dice are loaded"],
    "answer": 2,
    "explain": "The law of large numbers needs a large n. Expect about 3 boxcars per 100 trials and 2 778 per 100 000."
  },
  {
    "q": "Which experiments can be handled by the relative-frequency approach but not the classical one?",
    "options": ["only coin flips", "any experiment you can repeat, even when the outcomes are not equally likely or cannot be listed", "none; the two are identical", "only experiments with 36 outcomes"],
    "answer": 1,
    "explain": "Simulation needs only a way to run trials; the classical formula needs a listable, equally likely sample space."
  }
]
```
