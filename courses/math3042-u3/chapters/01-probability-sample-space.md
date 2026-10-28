---
title: Random experiments, sample spaces, events
minutes: 20
---
<!-- facts: poe1.vaal.gem-outcomes, classic.scroll.chaos-outcomes, poe2.corruption.outcomes-gems -->

A Vaal Orb on a gem and a Chaos scroll on an item are random experiments: you know the list of outcomes, not which one you get.

This lesson names that list and says when counting it gives a probability.

## What "64% chance of rain" means

The probability of an event is a measure of how likely that event is. The instructor's answer in the filled notes: *64% of model simulation runs produced rain.*

The forecaster runs the weather model many times from slightly different starting conditions, and the fraction of runs that rained is the number on the screen: a relative frequency over simulated days, not over past Thursdays.

It does not mean 64% of Thursday will be wet, or that rain is "expected".

Probability runs *from 0 to 1 (0% to 100%)* and is attached to an event before the event is resolved.

## Random experiment, sample space, random variable

- A **random experiment** is any procedure whose specific outcome we cannot predict.
- The set of possible outcomes is the **sample space**, $S$. Rolling a six-sided die: $S = \{1, 2, 3, 4, 5, 6\}$.
- A **random variable** is a numerical value $X$ that depends on the outcome. Flip three coins and let $X$ be the number of heads: the outcome is a string like HTH, and $X$ turns it into the number 2.
- Why this matters later: Units 1 and 2 described samples. A sample mean $\bar{X}$ is itself a random variable, so Units 4–6 can say how close it is likely to land to $\mu$.

The notes' first question is a trap. Flip three coins: which is more likely, $X = 1$ or $X = 2$? Assuming heads and tails are equally likely, list the outcomes:

$$S = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}$$

Eight outcomes, all equally likely.

Exactly one head: HTT, THT, TTH, three outcomes, so

$$P(1 \text{ head}) = \dfrac{3}{8}$$

Exactly two heads: HHT, HTH, THH, also three, so

$$P(2 \text{ heads}) = \dfrac{3}{8}$$

**Neither is more likely.**

Two heads feels rarer because "two heads" sounds like one specific thing, but it is three different outcomes, exactly as many as one head.

```widget
sample-space
{ "mode": "coins", "n": 3, "k": 2, "event": "exactly", "title": "Three coins: the outcomes in A and P(A) = |A| / |S|" }
```

Five coins with "all the same" and "at least k heads" ($k = 2$) are the next two examples; the widget's presets build both.

## Events and the classical definition

An **event** $A$ is any subset of the sample space $S$: "exactly one head" is the subset {HTT, THT, TTH}. The filled notes add that an event *can contain 0 or more outcomes*, so the empty set and all of $S$ are events too. If the outcomes in $S$ are **equally likely**, the probability of $A$ is

$$P(A) = \frac{|A|}{|S|}$$

the number of outcomes in $A$ divided by the number in $S$.

Three consequences follow at once: $P(A) = 0$ if $A$ is impossible (empty), $P(A) = 1$ if $A$ is certain (all of $S$), and $0 \le P(A) \le 1$ for any event.

**Five coins, all the same.** Each coin doubles the count:

$$|S| = 2^5 = 32$$

$A = \{HHHHH, TTTTT\}$, so

$$P(A) = \dfrac{2}{32} = \dfrac{1}{16} = \mathbf{0.0625}$$

**Five coins, at least two heads.** Counting the outcomes with 2, 3, 4 or 5 heads directly is tedious; count the ones that fail instead.

Here is how the 32 outcomes split by number of heads:

| heads | 0 | 1 | 2 | 3 | 4 | 5 | total |
|---|---|---|---|---|---|---|---|
| outcomes | 1 | 5 | 10 | 10 | 5 | 1 | 32 |

The complement is the first two cells. Zero heads: 1 outcome (TTTTT). One head: 5 outcomes (the head can be any of the five coins).

1. Fewer than two heads:
   $$1 + 5 = 6 \text{ outcomes}$$
2. At least two heads:
   $$32 - 6 = 26 \text{ outcomes}$$
3. Probability:
   $$P = \dfrac{26}{32} = \dfrac{13}{16} = \mathbf{0.8125}$$

This "count the opposite" move is the complement rule of lesson 4.

:::quiz Equally likely is the condition
The classical formula only applies when every outcome in $S$ has the same chance.

Three coins with $S = \{0, 1, 2, 3 \text{ heads}\}$ is a legal sample space, but its four outcomes are **not** equally likely (one way to get 0 heads, three ways to get 1), so $|A|/|S|$ on it gives wrong answers.

List the outcomes at the level where they are equally likely: the eight strings.
:::

## A Vaal Orb on a PoE1 gem: four equal effects, six unequal outcomes

A Vaal Orb, the currency that corrupts an item, applies one of four effects to a skill gem, each of equal weight 1/4: level by one, quality by 1 to 10, the Vaal version, or nothing. Level and quality go up or down with chance 1/2.

Because the wiki states the four effects are equally likely, $|A|/|S|$ works on $S = \{\text{level}, \text{quality}, \text{Vaal}, \text{none}\}$ and not on the finer list {+1 level, −1 level, +quality, −quality, Vaal, none}.

The tree shows why: level and quality each split their 1/4 in two, while Vaal and none keep theirs whole.

```diagram
{ "type": "tree", "nodes": [
  { "id": "r", "label": "Vaal Orb" },
  { "id": "lv", "label": "Level", "sub": "1/4", "parent": "r" },
  { "id": "q", "label": "Quality", "sub": "1/4", "parent": "r" },
  { "id": "v", "label": "Vaal", "sub": "1/4", "parent": "r" },
  { "id": "n", "label": "None", "sub": "1/4", "parent": "r" },
  { "id": "lu", "label": "+1 level", "sub": "1/4 × 1/2 = 1/8", "parent": "lv" },
  { "id": "ld", "label": "−1 level", "sub": "1/8", "parent": "lv" },
  { "id": "qu", "label": "up", "sub": "1/8", "parent": "q" },
  { "id": "qd", "label": "down", "sub": "1/8", "parent": "q" }
], "hi": ["lu", "ld", "qu", "qd", "v", "n"], "caption": "Six leaves, two sizes: four of 1/8 and two of 1/4. Not equally likely, so |A|/|S| on the six does not work." }
```

```quiz
[
  {"q": "Counting the finer six-outcome list as $S$ gives $P(-1 \\text{ level or no effect}) = 2/6$. What is the true probability? (4 decimals)", "type": "numeric", "answer": 0.375, "tolerance": 6e-05, "explain": "Read the two leaves off the tree. Down a level is half of the level effect: $$\\frac{1}{4} \\times \\frac{1}{2} = \\frac{1}{8}$$ No effect is a whole effect, $\\frac{1}{4}$. One gem gets one result, so add: $$\\frac{1}{8} + \\frac{1}{4} = \\frac{3}{8} = \\mathbf{0.3750}$$ The six-list count $2/6 = 0.3333$ treats a $1/8$ leaf and a $1/4$ leaf as the same size."}
]
```

On the four effects, $A$ = "the gem changes" = {level, quality, Vaal} has

$$P(A) = \dfrac{3}{4} = \mathbf{0.7500}$$

A MapleStory Classic Chaos scroll, which adds a stat to an item on success, has three outcomes: success, fail and kept, fail and destroyed.

meowdb's copy of the item text gives success 10 %, and a failure destroys the item 50 % of the time.

So $P(\text{success}) = 0.10$, not 1/3: the three outcomes are not equally likely.

The same two-stage tree returns in lessons 5 and 8.

```diagram
{ "type": "tree", "nodes": [
  { "id": "r", "label": "One use" },
  { "id": "s", "label": "Success", "sub": "0.10", "parent": "r" },
  { "id": "f", "label": "Fail", "sub": "0.90", "parent": "r" },
  { "id": "k", "label": "Kept", "sub": "0.90 × 0.50 = 0.45", "parent": "f" },
  { "id": "d", "label": "Destroyed", "sub": "0.90 × 0.50 = 0.45", "parent": "f" }
], "hi": ["s", "k", "d"], "caption": "Three outcomes: 0.10, 0.45, 0.45. They sum to 1 but are not equal." }
```

## A Vaal Orb's quality roll, a Chaos scroll's destroy chance, two PoE2 gems

In PoE2 a Vaal Orb on a skill gem gives one of 4 outcomes: no change, one level up or down, a socket added or removed, or a quality change. The poe2wiki says they "seem to be all equally likely": an assumption, not a published rate.

```quiz
[
  {"q": "PoE1 Vaal Orb on a skill gem: $P(\\text{the gem's quality changes, up or down})$? (4 decimals)", "type": "numeric", "answer": 0.25, "tolerance": 6e-05, "explain": "Quality is one of the four equal-weight effects: $$|A|/|S| = 1/4 = \\mathbf{0.2500}$$ Up and down are halves of that one effect: $$1/8 + 1/8 = 1/4$$"},
  {"q": "PoE1 Vaal Orb on a skill gem: $P(\\text{the level or the quality changes})$? (4 decimals)", "type": "numeric", "answer": 0.5, "tolerance": 6e-05, "explain": "$A$ = {level, quality} on the four-effect $S$: $$|A|/|S| = 2/4 = \\mathbf{0.5000}$$"},
  {"q": "Classic Chaos scroll, one use: $P(\\text{the item survives})$? (4 decimals)", "type": "numeric", "answer": 0.55, "tolerance": 6e-05, "explain": "Computed from the item text. The item survives on two leaves of the tree: success, $0.10$, and fail and kept: $$0.90 \\times 0.50 = 0.45$$ One use ends on one leaf, so add: $$0.10 + 0.45 = \\mathbf{0.5500}$$ Check: the only other leaf is destroyed, $0.45$, and $$1 - 0.45 = 0.55$$"},
  {"q": "The Classic Chaos scroll has $|S| = 3$ outcomes, so $P(\\text{success}) = 1/3$.", "type": "tf", "answer": false, "explain": "$|A|/|S|$ needs equally likely outcomes. The item text gives success 0.10, and each failure branch is 0.45: three outcomes, three different chances."},
  {"q": "Two PoE2 skill gems each take one Vaal Orb. How many outcomes, as (first gem, second gem) pairs, are in $S$?", "type": "numeric", "answer": 16, "tolerance": 0, "explain": "Each gem has 4 outcomes, so $$4 \\times 4 = \\mathbf{16} \\text{ ordered pairs}$$ from (no change, no change) to (quality, quality). Listing $S$ needs no probabilities at all."},
  {"q": "The poe2wiki publishes $1/4$ as the probability of each PoE2 gem corruption outcome.", "type": "tf", "answer": false, "explain": "It says the four outcomes seem to be all equally likely. That is the wiki's assumption, not a published rate, so $1/4$ there is a model, unlike the PoE1 wiki's stated equal weights."}
]
```

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
    "explain": "Each coin has 2 outcomes and there are 5 coins: $$2^5 = \\mathbf{32}$$"
  },
  {
    "q": "Five coins: P(all five the same)?",
    "type": "numeric",
    "answer": 0.0625,
    "tolerance": 0.0005,
    "explain": "Two outcomes (HHHHH, TTTTT) out of 32: $$2/32 = 1/16 = \\mathbf{0.0625}$$"
  },
  {
    "q": "Five coins: P(at least two heads)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8125,
    "tolerance": 0.0005,
    "explain": "Fewer than two heads: 1 (no heads) + 5 (one head) = 6 outcomes. So $32 - 6 = 26$ outcomes have at least two: $$26/32 = \\mathbf{0.8125}$$"
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
