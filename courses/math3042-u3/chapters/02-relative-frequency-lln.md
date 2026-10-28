---
title: Relative frequency and the law of large numbers
minutes: 20
---
<!-- facts: poe1.fusing.six-link-measured -->

Nobody can list equally likely outcomes for a six-link, yet players quote its chance: someone ran the experiment many times and counted. That is the second route to a probability, and the law of large numbers says it agrees with counting outcomes in the limit.

## The relative frequency definition

Perform $n$ trials of a random experiment and find that event $A$ occurs $x$ times. Then

$$P(A) \approx \frac{x}{n}$$

The filled notes label the fraction *x (# success)* over *n (# trials)* and call it the *relative freq definition*.

**The law of large numbers**: if you perform the random experiment enough times, $x/n$ must approach the exact classical probability $P(A)$. For a small $n$ the fraction wanders; as $n$ grows it settles.

## The PoE1 six-link chance is a relative frequency

An Orb of Fusing, the currency that rerolls the links between an item's sockets, has no published six-link probability. A 2017 test used n = 100 000 Fusings on a six-socket item of 20 % quality and found the chance about 0.1 %, 1 in 1000 [PoE1, 3.0-era test still cited at 3.29 (poewiki), checked 2026-10-27]. GGG's own figure, "very close to 1/1500", predates the change that made each 1 % of quality improve the result by 1 %, so the usable number is this measured one. The test's count of six-links is not reported, only the rate and n.

```quiz
[
  {"q": "From the test, the relative-frequency estimate of $P(\\text{six-link})$ for one Fusing on that item? (4 decimals)", "type": "numeric", "answer": 0.001, "tolerance": 6e-05, "explain": "$P(A) \\approx x/n$, and the test reports $x/n$ as about 1 in 1000: $0.0010$."}
]
```

$P(\text{six-link}) \approx x/n \approx 1/1000 = 0.0010$. There is no list of equally likely link outcomes to count, so the classical definition has nothing to work on; repetition is the only route, and n = 100 000 is large enough for $x/n$ to have settled. The figure is from 2017 on a 20 %-quality item, and 3.29 reworked sockets, so today's rate may differ.

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

:::info R syntax
| Code | What it does |
|---|---|
| `n.trials <- 10^5` | `<-` is assignment: it stores 100 000 under the name `n.trials`. `^` raises to a power. The dot is just part of the name. |
| `n.dice <- 2` | Stores the number of dice per trial. |
| `X.success <- 0` | Starts the success counter at 0. |
| `for (i.trial in 1:n.trials){ … }` | `1:n.trials` is the whole numbers 1 to 100 000; the loop runs the lines inside the braces once for each value of `i.trial`. |
| `sample(c(1,2,3,4,5,6), n.dice, replace=TRUE)` | `c()` combines values into a vector. `sample` fills x = the vector of faces, size = `n.dice` draws. |
| `replace=TRUE` | Puts each drawn value back, so both dice can show the same face. |
| `dice <- …` | Stores the two rolled faces in the vector `dice`. |
| `dice[1] == 6` | `[ ]` picks an element by position, counting from 1, so `dice[1]` is the first die. `==` tests equality and gives `TRUE` or `FALSE`. |
| `(…) & (…)` | `&` is AND: `TRUE` only when both comparisons are `TRUE`. |
| `X.success <- X.success + success` | Adds the logical to the counter; in arithmetic R counts `TRUE` as 1 and `FALSE` as 0. |
| `prob.B <- X.success / n.trials` | `/` divides: successes over trials, x/n. |
| `prob.B` | A name on its own line prints its value. `[1]` in the output is the position of the first value on that printed line. |

**Left to right**

- `n.trials <- 10^5`: "Store under the name n.trials (`n.trials <-`) ten to the power (`^`) five (`10^5`)."
- `n.dice <- 2`: "Store under the name n.dice (`n.dice <-`) the number 2 (`2`)."
- `X.success <- 0`: "Store under the name X.success (`X.success <-`) the number 0 (`0`)."
- `for (i.trial in 1:n.trials){ … }`: "For (`for`) each i.trial (`i.trial`) in 1 to n.trials (`1:n.trials`): store under dice (`dice <-`) a sample (`sample`) from the faces (`c(1,2,3,4,5,6)`) of size n.dice (`n.dice`) with replacement (`replace=TRUE`); store under success (`success <-`) whether the first die (`dice[1]`) equals (`==`) 6 and (`&`) the second die (`dice[2]`) equals 6; and store under X.success (`X.success <-`) the old count plus (`+`) success."
- `prob.B <- X.success / n.trials`: "Store under the name prob.B (`prob.B <-`) X.success (`X.success`) divided by (`/`) n.trials (`n.trials`)."
- `prob.B`: "Print prob.B (`prob.B`)."

**Right to left**, the order R runs it

- `n.trials <- 10^5`: "Raise 10 to the power 5 (`10^5`), then store it as n.trials (`n.trials <-`)."
- `n.dice <- 2`: "Take 2 (`2`) and store it as n.dice (`n.dice <-`)."
- `X.success <- 0`: "Take 0 (`0`) and store it as X.success (`X.success <-`)."
- `for (i.trial in 1:n.trials){ … }`: "Build the sequence 1 to n.trials (`1:n.trials`); each time round, combine the faces (`c(1,2,3,4,5,6)`), draw n.dice of them with replacement (`sample`, `replace=TRUE`) and store them (`dice <-`); pick each die (`dice[1]`, `dice[2]`), compare it with 6 (`==`), join the two answers (`&`) and store that (`success <-`); add it to the count (`X.success + success`) and store the total (`X.success <-`)."
- `prob.B <- X.success / n.trials`: "Divide X.success by n.trials (`X.success / n.trials`), then store it as prob.B (`prob.B <-`)."
- `prob.B`: "Look up prob.B (`prob.B`) and print it."
:::

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

## Reading the six-link test as x/n

The test's 1 in 1000 over n = 100 000 Fusings, and GGG's older 1/1500, are the two numbers to judge.

```quiz
[
  {"q": "GGG's older figure, 1/1500, as a probability? (4 decimals)", "type": "numeric", "answer": 0.0007, "tolerance": 6e-05, "explain": "$1/1500 = 0.000667$, which rounds to $0.0007$, against the test's $0.0010$."},
  {"q": "Why does the lesson use the test's 1 in 1000 rather than GGG's 1/1500?", "options": ["GGG's figure predates the change that made item quality improve the result", "1/1500 is a classical probability and 1 in 1000 is not", "the test counted every Fusing ever used", "larger probabilities are always more accurate"], "answer": 0, "explain": "Each 1 % of quality now improves the result by 1 %, and the test used a 20 %-quality item; GGG's statement came before that change. Neither figure is classical: no one listed equally likely outcomes."},
  {"q": "With n = 100 000 Fusings, the test's 1 in 1000 is the classical probability of a six-link.", "type": "tf", "answer": false, "explain": "However large $n$ is, $x/n$ is a relative frequency, an estimate of $P(A)$. The classical definition needs a list of equally likely outcomes, which nobody has for links."},
  {"q": "A player Fuses 10 times with no six-link, so for them $x/n = 0/10 = 0$. This shows the six-link chance is 0.", "type": "tf", "answer": false, "explain": "Ten trials of an event near $0.001$ will almost always show no success, the same as ten trials of boxcars. The law of large numbers needs a large $n$."},
  {"q": "Which definition of probability does the six-link figure use?", "type": "text", "answer": ["relative frequency", "relative-frequency", "the relative frequency definition", "relative freq"], "explain": "Successes over trials, $x/n$, from repeating the experiment: the relative frequency definition."}
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
