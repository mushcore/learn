---
title: "Q3 to Q6: independent tickets, same flight without replacement, Bayes, a probability table"
minutes: 25
---
Four of the practice paper's questions, 13 marks, are probability calculations. Each is marked on the working in the instructor's order: name the events, name the rule, write the formula, substitute, give the number to four decimal places.

## Q3 (4 marks). Each ticket purchased in the "Math Rules" scratch and win lottery has a 2.1% chance of winning a prize of $100.

**a. [1]** A student buys 8 tickets. What is the probability that none of them win a prize?

**b. [1]** A student buys 8 tickets. What is the probability that he wins at least one prize?

**c. [2]** If tickets cost $2.50 each, what is the expected profit or loss per ticket to students who play?

```quiz
[
  {
    "q": "**Q3a.** P(none of the 8 tickets wins)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8438,
    "tolerance": 0.0001,
    "explain": "Denote a win by W and a loss by L; we want P(LLLLLLLL). **Since tickets are independent**, multiply: P(LLLLLLLL) = P(L)⁸ = (1 − 0.021)⁸ = 0.979⁸ = 0.843843 → **0.8438 or 84.38 %**."
  },
  {
    "q": "**Q3b.** P(at least one prize in 8 tickets)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1562,
    "tolerance": 0.0001,
    "explain": "**Complement rule**: \"at least one\" is everything except \"none\". P(at least one prize) = 1 − P(zero prizes) = 1 − 0.979⁸ = 1 − 0.843843 = **0.1562**. The key stops at \"1 − 0.8438 (from part a)\"; finish the subtraction. Adding 8 × 0.021 = 0.168 is wrong: it counts the outcomes with two or more wins more than once."
  },
  {
    "q": "**Q3c.** Expected profit per ticket? (dollars; a loss is negative)",
    "type": "numeric",
    "answer": -0.40,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "Let X = the net profit on one ticket. A losing ticket is − $2.50; a winning ticket is the prize minus the cost, $100 − $2.50 = $97.50. The table: X = − $2.50 with P(X) = 0.979; X = $97.50 with P(X) = 0.021.\n\nE(X) = Σ x P(x) = − $2.50(0.979) + $97.50(0.021) = −2.4475 + 2.0475 = **− $0.40**. \"There is an expected loss of $0.40 per ticket.\""
  }
]
```

The table is part of the 2 marks on 3c. Its values are *net*: the $2.50 is paid whether the ticket wins or not, so the win row is $97.50, not $100. Writing $100 with probability 0.021 and then subtracting $2.50 once gives the same − $0.40; the instructor's table is the safer layout because the probabilities line up with the outcomes. State the sign in words, "an expected loss of $0.40 per ticket", as the key does.

Taught in [complements and addition](#/math3042-u3/complement-addition), [conditional probability and independence](#/math3042-u3/conditional-independence) and [discrete distributions](#/math3042-u4/discrete-distributions). Expected value with money is drilled in [expected value in dollars](#/math3042-midterm/expected-dollars-shortcuts).

## Q4 (3 marks). Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area.

> The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. If two of these passengers are chosen at random, without replacement, what is the probability that they were on the same flight?

```quiz
[
  {
    "q": "**Q4.** P(both passengers were on the same flight)? (4 decimals)",
    "type": "numeric",
    "answer": 0.3981,
    "tolerance": 0.0001,
    "explain": "Total passengers = 42 + 116 + 154 = 312. P(same flight) = P(both 311) + P(both 811) + P(both 911), **and these are mutually exclusive**, so they add. Without replacement the second fraction loses one from the top and one from the bottom:\n\nP(same flight) = (42/312)(41/311) + (116/312)(115/311) + (154/312)(153/311) = 0.017747 + 0.137480 + 0.242827 = **0.3981 or 39.81 %**.\n\nAs one fraction: (1722 + 13340 + 23562)/97032 = 38624/97032."
  }
]
```

Two rules make the 3 marks. Within one flight the draws are dependent, so the second factor is a conditional probability: after one 311 passenger leaves the pool, 41 of the remaining 311 are from flight 311. Across flights the three cases cannot happen together, so the addition rule needs no overlap term. Leave the fractions unsimplified on paper; the marker reads the 41 and the 311 as evidence that you removed the first passenger.

```diagram
{ "type": "tree", "title": "Q4: multiply along a flight, add across flights", "nodes": [ { "id": "r", "label": "Pick 2 of 312" }, { "id": "a", "label": "1st: 311", "sub": "42/312", "parent": "r" }, { "id": "b", "label": "1st: 811", "sub": "116/312", "parent": "r" }, { "id": "c", "label": "1st: 911", "sub": "154/312", "parent": "r" }, { "id": "a2", "label": "2nd same flight", "sub": "41/311 → 0.0177", "parent": "a" }, { "id": "b2", "label": "2nd same flight", "sub": "115/311 → 0.1375", "parent": "b" }, { "id": "c2", "label": "2nd same flight", "sub": "153/311 → 0.2428", "parent": "c" } ], "hi": ["a2", "b2", "c2"], "caption": "Each leaf is first × second; mutually exclusive leaves add: 0.0177 + 0.1375 + 0.2428 = 0.3981." }
```

Taught in [complements and addition](#/math3042-u3/complement-addition) and [conditional probability and independence](#/math3042-u3/conditional-independence). The same three flights return in Q8 as an R hypergeometric question, worked in [Q7 to Q9](#/math3042-midterm/practice-r).

## Q5 (3 marks). A room is full of term 3 CST students. In this room, 85% of people are right-handed, and the other 15% are left-handed.

> The probability that a right-handed person says they enjoyed COMP 2121 is 30%. The probability that a left-handed person says they enjoyed COMP 2121 is 60%. You asked someone in the room if they enjoyed COMP 2121 and they answered yes. What is the probability that they are left-handed?

```quiz
[
  {
    "q": "**Q5.** P(left-handed | said yes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2609,
    "tolerance": 0.0001,
    "explain": "Let R: right-handed, P(R) = 0.85; L: left-handed, P(L) = 0.15; H: enjoyed COMP 2121, P(H | R) = 0.3, P(H | L) = 0.6.\n\n**Using Bayes' Rule**: P(L | H) = P(H | L)P(L) / [P(H | L)P(L) + P(H | R)P(R)] = 0.6(0.15) / [0.6(0.15) + 0.3(0.85)] = 0.09 / (0.09 + 0.255) = 0.09 / 0.345 = **0.2609**.\n\n\"So there is a 26.09 % chance they are left-handed.\""
  }
]
```

The question gives P(yes | left-handed) and asks for P(left-handed | yes): the condition is reversed, which is what names Bayes' rule. The denominator is P(H) by the law of total probability, every way of saying yes: 0.09 from left-handers and 0.255 from right-handers. Left-handers are twice as likely to say yes, but there are so few of them that a yes still most likely came from a right-hander. In 1000 students: 150 are left-handed and 60 % of them, 90, say yes; 850 are right-handed and 30 % of them, 255, say yes. Of the 345 yeses, 90 come from left-handers: 90/345 = 0.2609.

### Q5's four numbers on a tree

```diagram
{ "type": "tree", "nodes": [ { "id": "s", "label": "Student" }, { "id": "r", "label": "Right-handed", "sub": "0.85", "parent": "s" }, { "id": "l", "label": "Left-handed", "sub": "0.15", "parent": "s" }, { "id": "ry", "label": "Yes 0.3", "sub": "0.85 × 0.3 = 0.255", "parent": "r" }, { "id": "rn", "label": "No 0.7", "sub": "0.595", "parent": "r" }, { "id": "ly", "label": "Yes 0.6", "sub": "0.15 × 0.6 = 0.09", "parent": "l" }, { "id": "ln", "label": "No 0.4", "sub": "0.06", "parent": "l" } ], "hi": ["ry", "ly"], "caption": "P(yes) adds the two lit leaves; P(L | Yes) = 0.09 / (0.09 + 0.255) = 0.2609." }
```

The same tree as an interactive widget: it has no preset for Q5, so type Q5's values into the "COVID serology" preset, reading Sick as left-handed and Tests positive as said yes: P(Sick) = 0.15 with P(Tests positive | Sick) = 0.6, and P(Not sick) = 0.85 with P(Tests positive | Not sick) = 0.3. The last line then gives P(L | H).

```widget
bayes-tree
{ "preset": "COVID serology", "title": "Bayes on a tree: for Q5, set the first branch to 0.15 and 0.6, the second to 0.85 and 0.3" }
```

Taught in [Bayes' rule](#/math3042-u3/bayes).

## Q6 (3 marks). The probability distribution for the number of spam phone calls that Abdullah receives per day is given in the following table:

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P(x) | 0.02 | 0.23 | 0.41 | 0.17 | 0.11 | 0.06 |

**a. [1]** What is the probability that Abdullah receives at least 3 spam calls today?

**b. [1]** What is Abdullah's expected number of spam calls per day?

**c. [1]** If we assume that days are independent of each other, what is the probability that Abdullah receives exactly 2 spam calls today and no spam calls tomorrow?

```quiz
[
  {
    "q": "**Q6a.** P(at least 3 spam calls today)? (4 decimals)",
    "type": "numeric",
    "answer": 0.34,
    "tolerance": 0.0001,
    "explain": "\"At least 3\" includes 3. The values 3, 4, 5 are mutually exclusive, so add: P(3) + P(4) + P(5) = 0.17 + 0.11 + 0.06 = **0.34 or 34 %**. The complement gives the same: 1 − (0.02 + 0.23 + 0.41) = 0.34."
  },
  {
    "q": "**Q6b.** Expected number of spam calls per day?",
    "type": "numeric",
    "answer": 2.3,
    "tolerance": 0.01,
    "unit": "calls",
    "explain": "E(X) = Σ[x P(x)] = 0(0.02) + 1(0.23) + 2(0.41) + 3(0.17) + 4(0.11) + 5(0.06) = 0 + 0.23 + 0.82 + 0.51 + 0.44 + 0.30 = **2.3**. \"Expected value is 2.3 spam calls per day.\" An expected value need not be a value X can take."
  },
  {
    "q": "**Q6c.** P(exactly 2 today and none tomorrow)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0082,
    "tolerance": 0.0001,
    "explain": "**Since days are independent**, multiply: P(2) · P(0) = 0.41(0.02) = **0.0082 or 0.82 %**."
  }
]
```

Each part is one mark and one rule: addition for 6a, the expected-value formula for 6b, the multiplication rule for independent events for 6c. Before using any table, check that it is a distribution: every P(x) is between 0 and 1 and they add to 1 (0.02 + 0.23 + 0.41 + 0.17 + 0.11 + 0.06 = 1.00).

### The spam table as a distribution

The table with the x · P(x) column that adds to μ = 2.3, the (x − μ)² · P(x) column for σ, and the bar chart.

```widget
pmf-table
{ "rows": [[0, "0.02"], [1, "0.23"], [2, "0.41"], [3, "0.17"], [4, "0.11"], [5, "0.06"]], "xlab": "X = spam calls per day", "presets": false, "title": "Abdullah's spam calls: μ = Σ x P(x)" }
```

Taught in [discrete distributions](#/math3042-u4/discrete-distributions) and [conditional probability and independence](#/math3042-u3/conditional-independence). The table's σ by the formula sheet's shortcut is in [the variance shortcut](#/math3042-midterm/expected-dollars-shortcuts).

```quiz
[
  {
    "q": "A raffle ticket has a 5 % chance of winning. You buy 4 tickets, independently. P(none wins)? (4 decimals)",
    "type": "numeric",
    "answer": 0.8145,
    "tolerance": 0.0001,
    "explain": "Since tickets are independent, P(LLLL) = (1 − 0.05)⁴ = 0.95⁴ = 0.814506 → 0.8145."
  },
  {
    "q": "The raffle ticket costs $5 and the prize is $50, with P(win) = 0.05. Expected profit per ticket? (dollars; a loss is negative)",
    "type": "numeric",
    "answer": -2.50,
    "tolerance": 0.005,
    "unit": "$",
    "explain": "X = net profit: a win is $50 − $5 = $45 with probability 0.05; a loss is − $5 with probability 0.95. E(X) = 45(0.05) + (−5)(0.95) = 2.25 − 4.75 = − $2.50, an expected loss of $2.50 per ticket. Using $50 in the win row and forgetting the cost gives + $2.50."
  },
  {
    "q": "In Q5, P(right-handed | said yes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.7391,
    "tolerance": 0.0001,
    "explain": "Same denominator: P(R | H) = 0.3(0.85) / [0.6(0.15) + 0.3(0.85)] = 0.255/0.345 = 0.7391. The two posteriors add to 1: 0.2609 + 0.7391."
  },
  {
    "q": "From Abdullah's table, P(at most 1 spam call today)? (4 decimals)",
    "type": "numeric",
    "answer": 0.25,
    "tolerance": 0.0001,
    "explain": "At most 1 means 0 or 1: P(0) + P(1) = 0.02 + 0.23 = 0.25."
  },
  {
    "q": "Days independent: P(no spam calls on both of the next two days)? (4 decimals)",
    "type": "numeric",
    "answer": 0.0004,
    "tolerance": 0.00005,
    "explain": "P(0) · P(0) = 0.02 × 0.02 = 0.0004."
  },
  {
    "q": "If Q4's two passengers were chosen **with** replacement, the answer would round to 0.4000 instead of 0.3981.",
    "type": "tf",
    "answer": true,
    "explain": "With replacement the second fraction keeps its denominator: (42² + 116² + 154²)/312² = 38936/97344 = 0.399984 → 0.4000. The difference is small because 312 is large, but the question says without replacement, and the marker looks for 41/311, 115/311 and 153/311."
  }
]
```
