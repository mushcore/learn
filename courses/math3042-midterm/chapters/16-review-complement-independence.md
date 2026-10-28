---
title: "Review 5: complement and independence"
minutes: 30
---
<!-- facts: none; midterm review uses the instructor's and the labs' own examples -->

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

A **probability** is a number from 0 to 1 that says how likely an event is. An **event** is a set of outcomes you care about, such as "the die shows 6".

When every outcome is equally likely:

$$P(\text{event}) = \dfrac{\text{favourable outcomes}}{\text{total outcomes}}$$

One fair die, event "shows 6": $P = \dfrac{1}{6} = 0.1667$.

### The complement: "not A"

The **complement** of A, written "not A", is every outcome where A does not happen. A and not A together cover everything, so their probabilities add to 1:

$$P(\text{not } A) = 1 - P(A)$$

Die, "not a 6": $1 - \dfrac{1}{6} = \dfrac{5}{6} = 0.8333$.

The sheet's "Probability Rules" block prints this one too, as the last line: $P(A') = 1 - P(A)$ "for any event $A$". Find it there rather than recalling it.

### Independent events multiply

Two events are **independent** when one happening does not change the chance of the other. Two separate coin flips are independent: the first landing heads does nothing to the second.

For independent events, the chance that both happen is the product. **On the sheet**, under Probability Rules: $P(A \cap B) = P(A)\,P(B)$ "if events A and B are independent" ($\cap$ means "and").

Two coins, both heads: $0.5 \times 0.5 = 0.25$.

The same rule works for any number of independent events: multiply them all. Three dice all showing 6: $\left(\dfrac{1}{6}\right)^3 = 0.0046$.

### "All n" and "none of n"

With n independent tries, each a success with probability p:

- all n succeed: $p \times p \times \dots \times p = p^n$
- none succeed means every try fails, and each fails with probability $1 - p$: $(1 - p)^n$

Neither formula is printed; both are the multiplication rule written n times.

### "At least one" is 1 − P(none)

"At least one" means 1, 2, 3, ... or n successes: many cases. Its complement is a single case: zero successes. So:

$$P(\text{at least one}) = 1 - P(\text{none}) = 1 - (1 - p)^n$$

Three tries at p = 0.1: $1 - 0.9^3 = 1 - 0.729 = 0.2710$.

:::warn Two traps
**Adding is wrong.** "At least one of 8 tickets at 2.1 %" is not $8 \times 0.021 = 0.168$: that counts the outcomes with two or more wins more than once. Use $1 - 0.979^8$.

**Without replacement from a small group is not independent.** Picking 2 people from 5, of whom 2 smoke: once the first pick is a smoker, only 1 smoker is left in 4, so the second chance changes from $\frac{2}{5}$ to $\frac{1}{4}$. Multiply the *changing* fractions, $\frac{2}{5} \times \frac{1}{4} = 0.1$, not $0.4 \times 0.4$.
:::

### When independence is a fair assumption

- Separate lottery tickets, separate coin flips, separate dice: yes.
- Separate days, separate flights, separate machines, when the question says "independently": yes.
- Sampling **with replacement** (put it back before the next pick): yes, the group is the same every time.
- Sampling **without replacement** from a small group (cards from a deck, 2 passengers from a crowd, 3 castings from 200 with 5 bad): no; the fractions change after each pick, and you multiply the changed fractions instead.

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

## New variants

The first three are mandatory; the rest are "if time".

```quiz
[
  {
    "q": "A commuter passes 4 traffic lights that work independently; each is red on arrival with probability 0.3. P(at least one red light)? (4 decimals)",
    "type": "numeric",
    "answer": 0.7599,
    "tolerance": 0.0006,
    "explain": "Let R = a light is red; P(R) = 0.3, P(not R) = 0.7. **Complement rule**: at least one red = 1 − P(no red). The lights are **independent, so multiply**: $$P(\\text{no red}) = 0.7^4 = 0.2401$$ $$P(\\text{at least one red}) = 1 - 0.2401 = \\mathbf{0.7599}$$"
  },
  {
    "q": "Same 4 lights: P(no red light at all)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2401,
    "tolerance": 0.0006,
    "explain": "None red means every light is not red, each with probability $1 - 0.3 = 0.7$. Independent, so multiply: $$P(\\text{none}) = 0.7 \\times 0.7 \\times 0.7 \\times 0.7 = 0.7^4 = \\mathbf{0.2401}$$"
  },
  {
    "q": "Same 4 lights: P(all four red)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0081,
    "tolerance": 0.0006,
    "explain": "All four red; independent, so multiply: $$P(\\text{all}) = 0.3^4 = 0.3 \\times 0.3 \\times 0.3 \\times 0.3 = \\mathbf{0.0081}$$"
  },
  {
    "q": "*If time.* Each of 3 independent flights is late with probability 0.18. P(none of the 3 flights is late)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5514,
    "tolerance": 0.0006,
    "explain": "Let L = a flight is late; P(not L) = 1 − 0.18 = 0.82. The flights are independent: $$P(\\text{none late}) = 0.82^3 = 0.551368 \\to \\mathbf{0.5514}$$"
  },
  {
    "q": "*If time.* A machine makes 2 % defective parts. An inspector samples 5 parts with replacement. P(at least one defective in the sample)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0961,
    "tolerance": 0.0006,
    "explain": "With replacement, every pick has the same 2 % chance, so the picks are independent. A good part has $1 - 0.02 = 0.98$. **Complement rule**: $$P(\\text{at least one defective}) = 1 - P(\\text{no defective}) = 1 - 0.98^5 = 1 - 0.903921 = 0.096079 \\to \\mathbf{0.0961}$$"
  },
  {
    "q": "*If time.* The chance of rain is 35 % on Saturday and 60 % on Sunday; assume the days are independent. P(it rains on both days)? (4 decimals)",
    "type": "numeric",
    "answer": 0.21,
    "tolerance": 0.0006,
    "explain": "**Both** = and; the days are independent, so multiply: $$P(\\text{Sat and Sun}) = 0.35 \\times 0.60 = \\mathbf{0.2100}$$"
  },
  {
    "q": "*If time.* Three independent sensors detect a leak with probabilities 0.8, 0.9 and 0.7. P(at least one detects it)? (4 decimals)",
    "type": "numeric",
    "answer": 0.994,
    "tolerance": 0.0006,
    "explain": "Each misses with $1 - 0.8 = 0.2$, $1 - 0.9 = 0.1$, $1 - 0.7 = 0.3$. Independent, so multiply the misses: $$P(\\text{all miss}) = 0.2 \\times 0.1 \\times 0.3 = 0.006$$ **Complement**: $$1 - 0.006 = \\mathbf{0.9940}$$ Different p values are fine; you multiply each one."
  },
  {
    "q": "*If time.* A committee of 5 has 2 smokers. Two members are chosen at random **without replacement**. True or false: P(both smokers) = 0.4 × 0.4 = 0.16, because the two picks are independent.",
    "type": "tf",
    "answer": false,
    "explain": "Without replacement from a small group, the picks are **not** independent. After a smoker is picked, 1 smoker remains among 4 people, so the second chance is $\\frac{1}{4}$, not $\\frac{2}{5}$: $$P(\\text{both}) = \\dfrac{2}{5} \\times \\dfrac{1}{4} = \\dfrac{2}{20} = \\mathbf{0.1}$$ 0.16 would be right only with replacement."
  }
]
```
