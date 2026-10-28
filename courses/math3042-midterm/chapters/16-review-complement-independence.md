---
title: "Review 5: complement and independence"
minutes: 30
---
<!-- facts: classic.scroll.tiers, gms.starforce.rates-0-14, gms.starforce.star-catch, poe1.fusing.six-link-measured, poe1.vaal.gem-outcomes, poe1.ladder.hc-dead-by-rank -->

Every "will at least one of my scrolls pass" question is a complement and a product of independent tries. This review fixes the two moves on the practice paper's lottery, then drills them on scrolls, Star Force taps and Fusings.

:::quiz What the paper asks and what earns the marks
The practice paper's Q3a and Q3b (1 mark each) ask: a ticket wins with probability 2.1 %; out of 8 tickets, what is P(none win) and P(at least one wins)?

Each mark is one line of working plus the number to 4 decimals: name the events, say "independent, so multiply" or "complement", substitute, round.

The same two moves appear inside bigger questions (Q11b uses both), so this is about 4 marks of the paper.
:::

## Write this on the paper

For any "n separate tries, each succeeds with probability p" question:

1. "Let S = a success on one try; P(S) = p, P(not S) = 1 − p."
2. "The tries are independent, so multiply."
3. All succeed: $P(\text{all}) = p^n$.
4. None succeed: $P(\text{none}) = (1 - p)^n$.
5. At least one: "complement rule": $P(\text{at least one}) = 1 - P(\text{none}) = 1 - (1 - p)^n$.
6. Substitute the numbers, then round to 4 decimals.

Do the sample question and the first three variants below; the rest are "if time".

## The ideas, from zero

### A probability is favourable over total

A **probability** is a number from 0 to 1 that says how likely an event is. An **event** is a set of outcomes you care about, such as "the gem becomes its Vaal version".

When every outcome is equally likely:

$$P(\text{event}) = \dfrac{\text{favourable outcomes}}{\text{total outcomes}}$$

A Vaal Orb, the PoE1 currency that corrupts an item, has four effects on a skill gem that the wiki gives equal weight: level change, quality change, becomes the Vaal version, no effect. Event "becomes the Vaal version": $P = \dfrac{1}{4} = 0.2500$.

### The complement: "not A"

The **complement** of A, written "not A", is every outcome where A does not happen. A and not A together cover everything, so their probabilities add to 1:

$$P(\text{not } A) = 1 - P(A)$$

Vaal Orb, "not the Vaal version": $1 - \dfrac{1}{4} = \dfrac{3}{4} = 0.7500$.

The sheet's "Probability Rules" block prints this one too, as the last line: $P(A') = 1 - P(A)$ "for any event $A$". Find it there rather than recalling it.

```widget
prob-rules
{"preset": "heart or Ace", "title": "The complement is the region outside the circles: P(neither) = 1 − P(A ∪ B)"}
```

### Independent events multiply

Two events are **independent** when one happening does not change the chance of the other. In MapleStory Classic a scroll, the item that tries to add a stat to gear, passes 60 % at the Intermediate tier and 10 % at the Greater tier by meowdb's copy of the in-game item text. Each scroll is its own roll with the same printed rate, so the first passing does nothing to the second.

For independent events, the chance that both happen is the product. **On the sheet**, under Probability Rules: $P(A \cap B) = P(A)\,P(B)$ "if events A and B are independent" ($\cap$ means "and").

Two Intermediate scrolls, both pass: $0.6 \times 0.6 = 0.3600$.

```diagram
{"type": "grid", "title": "Two Intermediate scrolls: the sample space", "nodes": [{"id": "r0c0", "label": "1st \\ 2nd", "row": 0, "col": 0}, {"id": "r0c1", "label": "Pass 0.6", "row": 0, "col": 1}, {"id": "r0c2", "label": "Fail 0.4", "row": 0, "col": 2}, {"id": "r1c0", "label": "Pass 0.6", "row": 1, "col": 0}, {"id": "r1c1", "label": "0.6 × 0.6", "row": 1, "col": 1}, {"id": "r1c2", "label": "0.6 × 0.4", "row": 1, "col": 2}, {"id": "r2c0", "label": "Fail 0.4", "row": 2, "col": 0}, {"id": "r2c1", "label": "0.4 × 0.6", "row": 2, "col": 1}, {"id": "r2c2", "label": "0.4 × 0.4", "row": 2, "col": 2}], "hi": ["r1c1"], "caption": "Rows are the first scroll, columns the second. Each cell multiplies its row and column; the lit cell is both pass, 0.3600."}
```

The same rule works for any number of independent events: multiply them all. Three Greater scrolls all pass: $0.1^3 = 0.0010$.

### "All n" and "none of n"

With n independent tries, each a success with probability p:

- all n succeed: $p \times p \times \dots \times p = p^n$
- none succeed means every try fails, and each fails with probability $1 - p$: $(1 - p)^n$

Neither formula is printed; both are the multiplication rule written n times.

### "At least one" is 1 − P(none)

"At least one" means 1, 2, 3, ... or n successes: many cases. Its complement is a single case: zero successes. So:

$$P(\text{at least one}) = 1 - P(\text{none}) = 1 - (1 - p)^n$$

Three Greater scrolls at p = 0.1, at least one passes: $1 - 0.9^3 = 1 - 0.729 = 0.2710$.

```diagram
{"type": "tree", "title": "Three Intermediate scrolls: none pass, and everything else", "nodes": [{"id": "r", "label": "Scroll 1"}, {"id": "p1", "label": "Pass 0.6", "sub": "at least one", "parent": "r"}, {"id": "f1", "label": "Fail 0.4", "sub": "Scroll 2", "parent": "r"}, {"id": "p2", "label": "Pass 0.6", "sub": "at least one", "parent": "f1"}, {"id": "f2", "label": "Fail 0.4", "sub": "Scroll 3", "parent": "f1"}, {"id": "p3", "label": "Pass 0.6", "sub": "at least one", "parent": "f2"}, {"id": "f3", "label": "Fail 0.4", "sub": "none pass", "parent": "f2"}], "hi": ["f1", "f2", "f3"], "caption": "The lit path is the only way to get none: 0.4 × 0.4 × 0.4 = 0.0640. Every branch off it is \"at least one\" (what follows a pass does not matter), so P(at least one) = 1 − 0.0640."}
```

:::warn Two traps
**Adding is wrong.** "At least one of 8 tickets at 2.1 %" is not $8 \times 0.021 = 0.168$: that counts the outcomes with two or more wins more than once. Use $1 - 0.979^8$.

**Without replacement from a fixed list is not independent.** On the PoE1 Hardcore Allflame ladder, 69 of the 200 characters ranked 1–200 were dead. Pick 2 different characters from those 200: once the first is dead, only 68 dead are left in 199, so the second chance changes from $\frac{69}{200}$ to $\frac{68}{199}$. Multiply the *changing* fractions, $\frac{69}{200} \times \frac{68}{199} = 0.1179$, not $0.345 \times 0.345 = 0.1190$.
:::

```widget
deal-play
{"preset": "one deck (N = 52)", "title": "Without replacement the denominator shrinks: each card changes the next card's chance"}
```

### When independence is a fair assumption

- Separate lottery tickets, separate scroll uses, separate taps of Star Force (the GMS enhancement that adds stars to gear) below 15 stars: yes, each is its own roll at the same published rate.
- Separate days, separate flights, separate machines, when the question says "independently": yes.
- Sampling **with replacement** (put it back before the next pick): yes, the group is the same every time.
- Sampling **without replacement** from a fixed list (cards from a deck, 2 characters from the 200 top Hardcore ranks): no; the fractions change after each pick, and you multiply the changed fractions instead.

Exam rule for every answer: "Let X = ..." or name the events in words; name the rule; formula; substitute; round a probability to 4 decimals.

## Sample midterm question: Q3a and Q3b

> **Question 3 [4 marks].** Each ticket purchased in the "Math Rules" scratch and win lottery has a 2.1% chance of winning a prize of \$100.
>
> a. [1] A student buys 8 tickets. What is the probability that none of them win a prize?
>
> b. [1] A student buys 8 tickets. What is the probability that he wins at least one prize?

Work both on paper first, then check. Part c, the expected profit, is in [Review 3](#/math3042-midterm/review-prob-tables).

```quiz
[
  {
    "q": "**Q3a.** P(none of the 8 tickets wins)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8438,
    "tolerance": 0.0001,
    "explain": "Denote a win by W and a loss by L; we want P(LLLLLLLL). A loss has probability $1 - 0.021 = 0.979$. **Since tickets are independent**, multiply: $$P(LLLLLLLL) = P(L)^8 = (1 - 0.021)^8 = 0.979^8 = 0.843843 \\to \\mathbf{0.8438} \\text{ or } \\mathbf{84.38\\%}$$"
  },
  {
    "q": "**Q3b.** P(at least one prize in 8 tickets)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1562,
    "tolerance": 0.0001,
    "explain": "**Complement rule**: \"at least one\" is everything except \"none\": $$P(\\text{at least one prize}) = 1 - P(\\text{zero prizes}) = 1 - 0.979^8 = 1 - 0.843843 = \\mathbf{0.1562}$$ The key stops at \"1 − 0.8438 (from part a)\"; finish the subtraction. Adding $8 \\times 0.021 = 0.168$ is wrong: it counts the outcomes with two or more wins more than once."
  }
]
```

The full worked paper is in [Q3 to Q6](#/math3042-midterm/practice-probability).

## Lab 4: simulated probabilities match the exact ones

Lab 4 estimates a probability by repeating an experiment m times and counting: estimate = (times the event happened) / m. Its dice and coins are drawn **with replacement**, which is what makes each roll independent.

```r
sample.int(6, 2, replace=TRUE)
```

:::info R syntax
| Code | What it does |
|---|---|
| `sample.int(` | draw random whole numbers from 1 up to a limit |
| `6` | the limit: the faces 1 to 6 of a die |
| `2` | how many draws: two dice |
| `replace=TRUE` | put each value back, so a face can repeat; the two rolls are independent |
| `)` | closes the call |

**Left to right**

- "Sample (`sample.int`) from 1 to 6 (`6`), two values (`2`), with replacement (`replace=TRUE`)."

**Right to left**, the order R runs it

- "Allow repeats (`replace=TRUE`), take two draws (`2`) from the faces 1 to 6 (`6`), and return them (`sample.int`)."
:::

**Task 6** asks for a function that estimates the probability of heads for a fair coin. The lab's run, `Prob.Heads(10^5)`, printed `0.50213`; the exact answer is $\frac{1}{2} = 0.5$.

**Task 7**: "Suppose we roll two fair dice. Let X = the sum of the two die. The event E we are interested in is defined by the result: X = 7." The lab's run, `Prob.E(10^5)`, printed `0.16789`.

The pencil part is exact: 6 of the 36 equally likely pairs, (1,6), (2,5), (3,4), (4,3), (5,2), (6,1), sum to 7:

$$P(X = 7) = \dfrac{6}{36} = 0.1667$$

The complement of the estimate matches the complement rule: $1 - 0.16789 = 0.83211$ against the exact $1 - \frac{1}{6} = 0.8333$.

```widget
sim-lab
{"experiment": "dice2", "m": 10000, "target": 7, "title": "Prob.E: as m grows, the share of sums equal to 7 settles near 6/36, so the rest settles near 1 − 1/6"}
```

**Task 12** draws cards with `replace=TRUE` and `replace=FALSE`. The lab's answer: "using replace=FALSE tends to make the distribution somewhat narrower (less variability) but does not change the center". The two settings give different answers because only the first is independent.

## Unit 3 practice problems: complement and independence

```quiz
[
  {
    "q": "**PP11.** A fire detection device uses three temperature-sensitive cells acting independently; any one or more can activate the alarm. Each cell activates with probability 0.8 at 45°C. P(the alarm functions)? (4 decimals)",
    "type": "numeric",
    "answer": 0.992,
    "tolerance": 0.0006,
    "explain": "The alarm works if **at least one** cell activates. Complement: no cell activates. Each cell fails with $1 - 0.8 = 0.2$; independent, so multiply: $$P(\\text{none}) = 0.2^3 = 0.008$$ $$P(\\text{alarm works}) = 1 - 0.008 = \\mathbf{0.9920}$$"
  },
  {
    "q": "**PP16.** Commercial aircraft have two independent radios; each fails with probability 0.002 on a flight. P(both fail)? (6 decimals)",
    "type": "numeric",
    "answer": 0.000004,
    "tolerance": 0.0000002,
    "explain": "**Both** = and; independent, so multiply: $$0.002 \\times 0.002 = \\mathbf{0.000004}$$"
  },
  {
    "q": "**PP15a.** Four machines run independently with utilizations Drill 52 %, Lathe 60 %, Miller 68 %, Grinder 85 %. P(all four idle)? (6 decimals)",
    "type": "numeric",
    "answer": 0.009216,
    "tolerance": 0.000005,
    "explain": "Idle is the complement of utilized: $1 - 0.52 = 0.48$, $1 - 0.60 = 0.40$, $1 - 0.68 = 0.32$, $1 - 0.85 = 0.15$. Independent, so multiply: $$0.48 \\times 0.40 \\times 0.32 \\times 0.15 = \\mathbf{0.009216}$$"
  },
  {
    "q": "**PP15b.** Same machines: P(the Drill or the Lathe, or both, is utilized)? (4 decimals)",
    "type": "numeric",
    "answer": 0.808,
    "tolerance": 0.0006,
    "explain": "\"Drill or Lathe or both\" is \"at least one of the two\". Complement: both idle, $0.48 \\times 0.40 = 0.192$. $$1 - 0.192 = \\mathbf{0.8080}$$"
  },
  {
    "q": "**PP25a.** A ten-question multiple-choice test, four choices each, every answer a guess (1/4 chance). P(none correct)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0563,
    "tolerance": 0.0006,
    "explain": "Each guess is wrong with $1 - 0.25 = 0.75$; guesses are independent: $$0.75^{10} = 0.056314 \\to \\mathbf{0.0563}$$"
  },
  {
    "q": "**PP25b.** Same test: P(all ten correct)? (scientific notation is fine; 3 significant digits)",
    "type": "numeric",
    "answer": 0.000000954,
    "tolerance": 0.000000005,
    "explain": "All ten right: $$0.25^{10} = 9.54 \\times 10^{-7} = \\mathbf{0.000000954}$$ about 1 in a million."
  }
]
```

These and the rest of the Unit 3 set are worked in [Unit 3 practice problems](#/math3042-u3/practice-problems).

## New variants: scrolls, Star Force taps below 15 and Fusings

Star Force success below 15 stars comes from the wiki's table, without the Star Catch bonus that v.271 builds in: 50 % at 10→11, 40 % at 12→13, 35 % at 13→14, 30 % at 14→15, and a failure keeps the star, nothing is destroyed. Each tap is its own roll with the same published rate, so taps on different items are independent. An Orb of Fusing, the PoE1 currency that rerolls an item's socket links, six-links about 1 in 1000 times, measured in a 2017 test of n = 100 000 Fusings on a 20 %-quality item.

The first three are mandatory; the rest are "if time".

```quiz
[
  {
    "q": "You tap Star Force once at 13→14 on each of 4 different non-Superior items (35 % each). P(at least one tap succeeds)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8215,
    "tolerance": 0.0006,
    "explain": "Let S = a tap succeeds; P(S) = 0.35, P(not S) = 0.65. Each tap is its own roll at the same rate, so the taps are independent. **Complement rule**: at least one success = 1 − P(no success). **Independent, so multiply**: $$P(\\text{no success}) = 0.65^4 = 0.178506$$ $$P(\\text{at least one}) = 1 - 0.178506 = 0.821494 \\to \\mathbf{0.8215}$$"
  },
  {
    "q": "Same 4 taps: P(no tap succeeds)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1785,
    "tolerance": 0.0006,
    "explain": "None succeed means every tap fails, each with probability $1 - 0.35 = 0.65$. Independent, so multiply: $$P(\\text{none}) = 0.65 \\times 0.65 \\times 0.65 \\times 0.65 = 0.65^4 = 0.178506 \\to \\mathbf{0.1785}$$"
  },
  {
    "q": "Same 4 taps: P(all four succeed)? (4 decimals)",
    "type": "numeric",
    "answer": 0.015,
    "tolerance": 0.0006,
    "explain": "All four succeed; independent, so multiply: $$P(\\text{all}) = 0.35^4 = 0.35 \\times 0.35 \\times 0.35 \\times 0.35 = 0.015006 \\to \\mathbf{0.0150}$$"
  },
  {
    "q": "*If time.* You use 3 Intermediate scrolls (60 % each) on one item. P(none of the 3 passes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.064,
    "tolerance": 0.0006,
    "explain": "Let A = a scroll passes; P(not A) = 1 − 0.6 = 0.4. Each scroll is its own roll at the printed 60 %, so the uses are independent: $$P(\\text{none pass}) = 0.4^3 = \\mathbf{0.0640}$$"
  },
  {
    "q": "*If time.* Using the measured rate of about 1 in 1000 per Fusing, P(at least one six-link in 1500 Fusings)? (4 decimals)",
    "type": "numeric",
    "answer": 0.777,
    "tolerance": 0.0006,
    "explain": "Each Fusing is its own reroll at the same rate p = 0.001, so the Fusings are independent. A Fusing misses with $1 - 0.001 = 0.999$. **Complement rule**: $$P(\\text{at least one}) = 1 - P(\\text{no six-link}) = 1 - 0.999^{1500} = 1 - 0.222963 = 0.777037 \\to \\mathbf{0.7770}$$ The wiki's \"about 77 % within 1500 fusings\" is this number."
  },
  {
    "q": "*If time.* You use one Intermediate scroll (60 %) and then one Greater scroll (10 %) on an item. P(both pass)? (4 decimals)",
    "type": "numeric",
    "answer": 0.06,
    "tolerance": 0.0006,
    "explain": "**Both** = and; each scroll is its own roll at its printed rate, so the two are independent and you multiply: $$P(\\text{both}) = 0.6 \\times 0.1 = \\mathbf{0.0600}$$"
  },
  {
    "q": "*If time.* You tap Star Force once on three different non-Superior items: one at 10→11 (50 %), one at 12→13 (40 %), one at 14→15 (30 %). P(at least one succeeds)? (4 decimals)",
    "type": "numeric",
    "answer": 0.79,
    "tolerance": 0.0006,
    "explain": "Each tap fails with $1 - 0.5 = 0.5$, $1 - 0.4 = 0.6$, $1 - 0.3 = 0.7$. Each tap is its own roll, so they are independent; multiply the failures: $$P(\\text{all fail}) = 0.5 \\times 0.6 \\times 0.7 = 0.21$$ **Complement**: $$1 - 0.21 = \\mathbf{0.7900}$$ Different p values are fine; you multiply each one."
  },
  {
    "q": "*If time.* Of the 200 Hardcore Allflame characters ranked 1–200, 69 were dead. Two different characters are chosen at random from those 200 **without replacement**. True or false: P(both dead) = 0.345 × 0.345 = 0.1190, because the two picks are independent.",
    "type": "tf",
    "answer": false,
    "explain": "Without replacement from a fixed list, the picks are **not** independent. After a dead character is picked, 68 dead remain among 199, so the second chance is $\\frac{68}{199}$, not $\\frac{69}{200}$: $$P(\\text{both}) = \\dfrac{69}{200} \\times \\dfrac{68}{199} = \\dfrac{4692}{39800} = 0.117889 \\to \\mathbf{0.1179}$$ 0.1190 would be right only with replacement."
  }
]
```
