---
title: Random experiments, sample spaces, events
minutes: 18
---

Units 1 and 2 described samples. From here on the sample is treated as the outcome of a random process, because a sample statistic like $\bar{X}$ is itself a random variable, and inferential statistics will need to say how close $\bar{X}$ is, with a certain probability, to the population mean $\mu$. Unit 3 builds the vocabulary of probability that makes that sentence meaningful.

## What "64% chance of rain" means

The probability of an event is a measure of how likely that event is. The forecast's 64% is a relative frequency: of all the days whose conditions looked like Thursday's, rain fell on about 64 in every 100. It does not mean 64% of Thursday will be wet, or that rain is "expected". Probability is a number between 0 and 1 (0% and 100%) attached to an event before the event is resolved.

## Random experiment, sample space, random variable

- A **random experiment** is any procedure whose specific outcome we cannot predict.
- The set of possible outcomes is the **sample space**, $S$. Rolling a six-sided die: $S = \{1, 2, 3, 4, 5, 6\}$.
- A **random variable** is a numerical value $X$ that depends on the outcome. Flip three coins and let $X$ be the number of heads: the outcome is a string like HTH, and $X$ turns it into the number 2.

The notes' first question is a trap. Flip three coins: which is more likely, $X = 1$ or $X = 2$? Assuming heads and tails are equally likely, list the outcomes:

$$S = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$$

Eight outcomes, all equally likely. Exactly one head: HTT, THT, TTH, three outcomes, so $P(1 \text{ head}) = 3/8$. Exactly two heads: HHT, HTH, THH, also three, so $P(2 \text{ heads}) = 3/8$. **Neither is more likely.** Two heads feels rarer because "two heads" sounds like one specific thing, but it is three different outcomes, exactly as many as one head.

```widget
sample-space
{ "mode": "coins", "n": 3, "k": 2, "event": "exactly", "title": "Three coins: click outcomes, or use the presets, and read P(A) = |A| / |S|" }
```

Move the slider to five coins and press "all the same" and "at least k heads" with $k = 2$: those are the next two examples.

## Events and the classical definition

An **event** $A$ is any subset of the sample space $S$: "exactly one head" is the subset {HTT, THT, TTH}. If the outcomes in $S$ are **equally likely**, the probability of $A$ is

$$P(A) = \frac{|A|}{|S|}$$

the number of outcomes in $A$ divided by the number in $S$. Three consequences follow at once: $P(A) = 0$ if $A$ is impossible (empty), $P(A) = 1$ if $A$ is certain (all of $S$), and $0 \le P(A) \le 1$ for any event.

**Five coins, all the same.** $|S| = 2^5 = 32$ (each coin doubles the count). $A = \{HHHHH, TTTTT\}$, so $P(A) = 2/32 = 1/16 = 0.0625$.

**Five coins, at least two heads.** Counting the outcomes with 2, 3, 4 or 5 heads directly is tedious; count the ones that fail instead. Zero heads: 1 outcome (TTTTT). One head: 5 outcomes (the head can be any of the five coins). So 6 outcomes have fewer than two heads and $32 - 6 = 26$ have at least two: $P = 26/32 = 13/16 = 0.8125$. This "count the opposite" move is the complement rule of lesson 4.

:::quiz Equally likely is the condition
The classical formula only applies when every outcome in $S$ has the same chance. Three coins with $S = \{0, 1, 2, 3 \text{ heads}\}$ is a legal sample space, but its four outcomes are **not** equally likely (one way to get 0 heads, three ways to get 1), so $|A|/|S|$ on it gives wrong answers. List the outcomes at the level where they are equally likely: the eight strings.
:::

```quiz
[
  {
    "q": "A random experiment is...",
    "options": ["an experiment done without a hypothesis", "any procedure whose specific outcome we cannot predict", "an experiment repeated at random times", "a sample chosen by a computer"],
    "answer": 1,
    "explain": "The notes' definition. Its set of possible outcomes is the sample space."
  },
  {
    "q": "The sample space for rolling one six-sided die is...",
    "options": ["$\\{1, 2, 3, 4, 5, 6\\}$", "$\\{6\\}$", "$\\{1, 6\\}$", "the number 6"],
    "answer": 0,
    "explain": "S lists every possible outcome; the die shows one of six faces."
  },
  {
    "q": "Three fair coins are flipped. Which is more likely, exactly one head or exactly two heads?",
    "options": ["exactly one head", "exactly two heads", "they are equally likely, 3/8 each", "cannot be determined"],
    "answer": 2,
    "explain": "HTT, THT, TTH give one head; HHT, HTH, THH give two. Three outcomes each out of eight."
  },
  {
    "q": "How many outcomes are in the sample space for flipping five coins?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "explain": "Each coin has 2 outcomes and there are 5 coins: 2^5 = 32."
  },
  {
    "q": "Five coins: P(all five the same)?",
    "type": "numeric",
    "answer": 0.0625,
    "tolerance": 0.0005,
    "explain": "Two outcomes (HHHHH, TTTTT) out of 32: 2/32 = 1/16 = 0.0625."
  },
  {
    "q": "Five coins: P(at least two heads)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8125,
    "tolerance": 0.0005,
    "explain": "Fewer than two heads: 1 (no heads) + 5 (one head) = 6 outcomes. 32 - 6 = 26 outcomes have at least two: 26/32 = 0.8125."
  },
  {
    "q": "A random variable is...",
    "options": ["a variable whose value is chosen by the experimenter", "a numerical value X that depends on the outcome of a random experiment", "any letter used in a formula", "the sample space"],
    "answer": 1,
    "explain": "X = number of heads turns the outcome HTH into the number 2."
  },
  {
    "q": "The classical formula $P(A) = |A|/|S|$ requires that...",
    "options": ["A is small", "the outcomes in S are equally likely", "S is infinite", "A is a single outcome"],
    "answer": 1,
    "explain": "Without equally likely outcomes, counting outcomes does not measure probability; list the outcomes at the level where they are equally likely."
  },
  {
    "q": "Which statements about any event A are true? (select all)",
    "options": ["$P(A) = 0$ if A is impossible", "$P(A) = 1$ if A is certain", "$0 \\le P(A) \\le 1$", "$P(A)$ can be 1.2 for a very likely event"],
    "answer": [0, 1, 2],
    "explain": "|A| runs from 0 (empty) to |S| (everything), so the ratio runs from 0 to 1 and never beyond."
  }
]
```
