---
title: Unit 3 practice problems (all 28, worked)
minutes: 60
---

Lab 4 said its pencil problems were "posted separately"; this is that sheet, 28 problems with an answer key, in the sheet's own wording. Each answer's explanation holds the worked solution with the rule named: NOT (complement), OR (addition), AND (multiplication), counting with $P$ and $C$, a conditional read off a table, or Bayes. Answers are the key's, to the key's decimals.

## 1. Two dice

You roll two six-sided fair dice. Determine the probability that the total is: (a) equal to 12, (b) equal to 1, (c) at least 10, (d) an even number.

```quiz
[
  { "q": "(a) P(total = 12)? (4 decimals)", "type": "numeric", "answer": 0.0278, "tolerance": 0.0003, "explain": "One outcome, (6, 6), of 36: 1/36 = 0.0278." },
  { "q": "(b) P(total = 1)?", "type": "numeric", "answer": 0, "tolerance": 0, "explain": "The smallest total is 2. An impossible event is the empty set, so P = 0/36 = 0.0000." },
  { "q": "(c) P(total at least 10)? (4 decimals)", "type": "numeric", "answer": 0.1667, "tolerance": 0.0003, "explain": "Total 10: (4,6), (5,5), (6,4); 11: (5,6), (6,5); 12: (6,6). Six outcomes: 6/36 = 0.1667." },
  { "q": "(d) P(total is even)? (4 decimals)", "type": "numeric", "answer": 0.5, "tolerance": 0.0003, "explain": "Each row of the 6 × 6 grid alternates odd and even totals, three of each: 18/36 = 0.5000." }
]
```

```widget
sample-space
{ "mode": "dice", "event": "boxcars", "title": "Problem 1: the 36 outcomes with (a)'s (6, 6) selected; totals 10 to 12 are the six cells where both dice are high" }
```

## 2. Four cards

You randomly select four cards from a standard deck of cards (without replacement). What is the probability that: (a) all four cards are red, (b) all four cards are Aces, (c) all four cards are the same suit (all hearts, all diamonds, all clubs, all spades).

```quiz
[
  { "q": "(a) P(all four red)? (4 decimals)", "type": "numeric", "answer": 0.0552, "tolerance": 0.0003, "explain": "C(26, 4)/C(52, 4) = 14 950/270 725 = 0.0552, or the shrinking product (26/52)(25/51)(24/50)(23/49)." },
  { "q": "(b) P(all four Aces)? (give it in scientific form, e.g. 0.00000369)", "type": "numeric", "answer": 0.00000369, "tolerance": 0.00000005, "explain": "Only one hand of four Aces: 1/C(52, 4) = 1/270 725 = 3.69 × 10^-6. The key writes 0.0000+ (positive, but 0 to four decimals)." },
  { "q": "(c) P(all four the same suit)? (4 decimals)", "type": "numeric", "answer": 0.0106, "tolerance": 0.0003, "explain": "Any of 4 suits, then 4 of its 13 cards: 4 × C(13, 4)/C(52, 4) = 4 × 715/270 725 = 0.0106." }
]
```


## 3. Ten coins

You flip a fair coin ten times. What is the probability that: (a) all ten flips come up "Heads", (b) the first five coins are "Heads", (c) the first five coins are all the same, and the second five coins are all the same, (d) the ten coins alternate between "Heads" and "Tails".

```quiz
[
  { "q": "(a) P(all ten Heads)? (4 decimals)", "type": "numeric", "answer": 0.001, "tolerance": 0.0001, "explain": "|S| = 2^10 = 1024; one outcome: 1/1024 = 0.00098 = 0.0010." },
  { "q": "(b) P(first five are Heads)? (4 decimals)", "type": "numeric", "answer": 0.0313, "tolerance": 0.0003, "explain": "The last five are free (2^5 = 32 outcomes): 32/1024 = (1/2)^5 = 0.0313." },
  { "q": "(c) P(first five all the same and second five all the same)? (4 decimals)", "type": "numeric", "answer": 0.0039, "tolerance": 0.0002, "explain": "Two choices for the first block (HHHHH or TTTTT) and two for the second: 2 × 2/1024 = 0.0039." },
  { "q": "(d) P(the ten coins alternate)? (4 decimals)", "type": "numeric", "answer": 0.002, "tolerance": 0.0002, "explain": "HTHTHTHTHT or THTHTHTHTH: 2/1024 = 0.0020." }
]
```


## 4. Grades

In an engineering statistics course, the instructor awarded 30 As, 40 Bs, 35 Cs, 15 Ds and 5 Fs. (a) What is the probability of getting an A? (b) What is the probability of getting a C or better?

```quiz
[
  { "q": "(a) P(A)? (4 decimals)", "type": "numeric", "answer": 0.24, "tolerance": 0.0003, "explain": "n = 30 + 40 + 35 + 15 + 5 = 125; 30/125 = 0.2400." },
  { "q": "(b) P(C or better)? (4 decimals)", "type": "numeric", "answer": 0.84, "tolerance": 0.0003, "explain": "OR rule for mutually exclusive grades: (30 + 40 + 35)/125 = 105/125 = 0.8400." }
]
```


## 5. The reckless driver

The probability that a reckless driver will be fined, get his license revoked or both are, respectively 0.88, 0.60 and 0.55. What is the probability that this driver will be fined or get his license revoked?

```quiz
[
  { "q": "P(fined or revoked)? (4 decimals)", "type": "numeric", "answer": 0.93, "tolerance": 0.0003, "explain": "OR rule: 0.88 + 0.60 − 0.55 = 0.9300. The 0.55 is P(both), the overlap counted twice. The sum 1.48 alone exceeds 1, the sign that an overlap must be subtracted." }
]
```


## 6. Light bulbs

A carton of 24 light bulbs includes 3 that are defective. If two of the bulbs are chosen at random, what are the probabilities that (a) neither bulb is defective, (b) exactly one of the bulbs is defective, (c) both bulbs are defective.

```quiz
[
  { "q": "(a) P(neither defective)? (4 decimals)", "type": "numeric", "answer": 0.7609, "tolerance": 0.0003, "explain": "C(21, 2)/C(24, 2) = 210/276 = 0.7609, or (21/24)(20/23)." },
  { "q": "(b) P(exactly one defective)? (4 decimals)", "type": "numeric", "answer": 0.2283, "tolerance": 0.0003, "explain": "3 × 21 pairs with one of each: 63/276 = 0.2283." },
  { "q": "(c) P(both defective)? (4 decimals)", "type": "numeric", "answer": 0.0109, "tolerance": 0.0003, "explain": "C(3, 2)/C(24, 2) = 3/276 = 0.0109. The three parts sum to 1." }
]
```


## 7. Glass blocks

In the quality control of the production of glass blocks, we find the probability that a glass block is cracked is 0.004, that it has air bubbles is 0.006, and that it is discoloured is 0.009. We also know the appearance of cracks, air bubbles and discolouration are independent. What is the probability that an inspector will find a block that: (a) is both cracked and has air bubbles? (b) is either cracked or has air bubbles? (c) is cracked, has air bubbles, and is discoloured? (d) is cracked or has air bubbles or is discoloured ("or" being "exclusive or")?

```quiz
[
  { "q": "(a) P(cracked and bubbles)? (6 decimals)", "type": "numeric", "answer": 0.000024, "tolerance": 0.0000005, "explain": "AND rule, independent: 0.004 × 0.006 = 0.000024." },
  { "q": "(b) P(cracked or bubbles)? (6 decimals)", "type": "numeric", "answer": 0.009976, "tolerance": 0.000005, "explain": "OR rule: 0.004 + 0.006 − 0.000024 = 0.009976." },
  { "q": "(c) P(cracked and bubbles and discoloured)? (as a decimal, e.g. 0.000000216)", "type": "numeric", "answer": 0.000000216, "tolerance": 0.000000002, "explain": "AND rule for three independent events: 0.004 × 0.006 × 0.009 = 2.16 × 10^-7." },
  { "q": "(d) P(exactly one of the three defects)? (4 decimals)", "type": "numeric", "answer": 0.0188, "tolerance": 0.0002, "explain": "Exclusive or = exactly one: 0.004(0.994)(0.991) + 0.006(0.996)(0.991) + 0.009(0.996)(0.994) = 0.003940 + 0.005922 + 0.008910 = 0.0188. The inclusive or, 1 − (0.996)(0.994)(0.991) = 0.018886, rounds to 0.0189; the key's 0.0188 is the exclusive reading." }
]
```


## 8. The machine

A machine produces components for cellular phones. At any given time, the machine is in exactly one of three states: Operational, Out of control, Down. Experience shows that the probability that the machine will be out of control at any moment is 0.02 and that probability that the machine is down is 0.015. (a) The machine can be used to produce a single item unless the machine is down. What is the probability that the machine can produce a single item? (b) A repair person is called when the machine is not operational. What is the probability that a repair person is called?

```quiz
[
  { "q": "(a) P(can produce an item)? (3 decimals)", "type": "numeric", "answer": 0.985, "tolerance": 0.0005, "explain": "NOT rule: 1 − P(down) = 1 − 0.015 = 0.985." },
  { "q": "(b) P(repair person called)? (3 decimals)", "type": "numeric", "answer": 0.035, "tolerance": 0.0005, "explain": "Not operational = out of control OR down, mutually exclusive states: 0.02 + 0.015 = 0.035." }
]
```


## 9. Smoke detectors

A smoke detector system uses two devices, A and B. If smoke is present, the probability that it will be detected by device A is 0.95; by device B, 0.98; and by both devices, 0.94. If smoke is present, find the probability that the smoke will be detected by device A or device B.

```quiz
[
  { "q": "P(detected by A or B)? (4 decimals)", "type": "numeric", "answer": 0.99, "tolerance": 0.0003, "explain": "OR rule: 0.95 + 0.98 − 0.94 = 0.9900. P(both) is given, so no independence is assumed. Note 0.95 × 0.98 = 0.931 ≠ 0.94: the two devices are not independent." }
]
```


## 10. The electronic component

The probability that a certain electronic component fails when first used is 0.10. If it does not fail immediately, the probability that it lasts for 1 year is 0.99. What is the probability that a new component will last 1 year? (i.e., The component must first not fail immediately and then last the year.)

```quiz
[
  { "q": "P(lasts one year)? (4 decimals)", "type": "numeric", "answer": 0.891, "tolerance": 0.0003, "explain": "AND rule with a condition: P(survives start) × P(lasts | survived) = 0.90 × 0.99 = 0.8910." }
]
```


## 11. Fire detection

A fire detection device uses three temperature-sensitive cells acting independently of one another in such a manner that any one or more can activate the alarm. Each cell has a probability of 0.8 of activating the alarm when the temperature reaches 45C. Find the probability that the alarm will function when the temperature reaches 45C.

```quiz
[
  { "q": "P(alarm functions)? (4 decimals)", "type": "numeric", "answer": 0.992, "tolerance": 0.0003, "explain": "NOT rule on 'no cell activates': 1 − 0.2^3 = 1 − 0.008 = 0.9920." }
]
```


## 12. Castings

Assume that a certain batch of 200 castings contains 5 defectives. Calculate the probability that (a) a single randomly selected casting will be defective, (b) of three castings selected, all will be defective, (c) of three castings selected, exactly one will be defective, (d) of two castings selected, at least one will be defective.

```quiz
[
  { "q": "(a) P(one casting defective)? (3 decimals)", "type": "numeric", "answer": 0.025, "tolerance": 0.0003, "explain": "5/200 = 0.025." },
  { "q": "(b) P(three selected, all defective)? (as a decimal, e.g. 0.00000761)", "type": "numeric", "answer": 0.00000761, "tolerance": 0.00000005, "explain": "AND rule without replacement: (5/200)(4/199)(3/198) = 60/7 880 400 = 7.61 × 10^-6." },
  { "q": "(c) P(three selected, exactly one defective)? (4 decimals)", "type": "numeric", "answer": 0.072, "tolerance": 0.0003, "explain": "The defective can be the 1st, 2nd or 3rd pick: 3 × (5/200)(195/199)(194/198) = 7.20 × 10^-2. The same as C(5, 1) C(195, 2)/C(200, 3) = 0.0720." },
  { "q": "(d) P(two selected, at least one defective)? (4 decimals)", "type": "numeric", "answer": 0.0495, "tolerance": 0.0003, "explain": "NOT rule: 1 − P(neither) = 1 − (195/200)(194/199) = 1 − 0.9505 = 0.0495." }
]
```


## 13. Displaced workers

A labour management organization wants to study the problem of workers displaced by automation within the industrial engineering field. Case reports for 100 workers whose loss of job is directly attributable to technological advances are selected within the industry. For each worker selected, it is determined whether he or she was given another job within the same company, found a job with another company in industrial engineering, found a job in a new field, or has been unemployed for longer than 6 months. In addition, the union status (union or non-union) of each worker is recorded, with the results shown in the table.

| Union status | Same Company | New Company (same field) | New Field | Unemployed | total |
|---|---|---|---|---|---|
| Union | 41 | 12 | 4 | 1 | 58 |
| Non-Union | 16 | 9 | 11 | 6 | 42 |
| total | 57 | 21 | 15 | 7 | 100 |

Suppose a worker is randomly selected from those surveyed. (a) What is the probability that a selected worker is a union member? (b) What is the probability that a selected worker is a union member and was given a job with the same company? What is the probability that a selected worker is a non-union member and was given a job in the same company? (c) If the selected worker found a job with a new company in the same field, what is the probability that the worker is a union member? (d) If the worker is not a union member, what is the probability that the worker has been unemployed for longer than 6 months?

```quiz
[
  { "q": "(a) P(union)? (2 decimals)", "type": "numeric", "answer": 0.58, "tolerance": 0.003, "explain": "Row total over grand total: 58/100 = 0.58. The sheet's text layout drifts the last column; this table is the PDF's, and the key's answers only work with it." },
  { "q": "(b) P(union and same company)? (2 decimals)", "type": "numeric", "answer": 0.41, "tolerance": 0.003, "explain": "A joint probability is one cell over the grand total: 41/100 = 0.41. Non-union and same company is 16/100 = 0.16." },
  { "q": "(c) P(union | new company)? (4 decimals)", "type": "numeric", "answer": 0.5714, "tolerance": 0.0003, "explain": "Restrict to the New Company column (21 workers): 12/21 = 0.5714." },
  { "q": "(d) P(unemployed | non-union)? (4 decimals)", "type": "numeric", "answer": 0.1429, "tolerance": 0.0003, "explain": "Restrict to the Non-Union row (42 workers): 6/42 = 0.1429." }
]
```

```widget
two-way
{ "rows": ["Union", "Non-Union"], "cols": ["Same Company", "New Company", "New Field", "Unemployed"], "data": [[41, 12, 4, 1], [16, 9, 11, 6]], "select": "col", "r": 0, "c": 1, "title": "Problem 13: the New Company column, the sample space for (c)" }
```

## 14. Injection moulded parts

A storage bin contains 200 injection molded parts from 4 cavities. One of the 4 cavities has a problem which causes all the parts it produces to be defective. If two of the 200 parts are randomly selected from the bin, what is the probability that: (a) both are from the faulty cavity (i.e. both defective), (b) only one is from the faulty cavity.

```quiz
[
  { "q": "(a) P(both defective)? (5 decimals)", "type": "numeric", "answer": 0.06156, "tolerance": 0.00005, "explain": "50 of the 200 parts are from the faulty cavity: (50/200)(49/199) = 0.06156." },
  { "q": "(b) P(only one defective)? (4 decimals)", "type": "numeric", "answer": 0.3769, "tolerance": 0.0003, "explain": "Defective first or second: 2 × (50/200)(150/199) = 0.3769." }
]
```


## 15. Four machines

Four machines, a drill, a lathe, a grinder and a miller operate independently of each other. Their utilizations currently are: Drill 52 %, Lathe 60 %, Miller 68 %, Grinder 85 %. (a) What is the chance of all of the machines being idle? (i.e. not in use) (b) What is the probability of either the Drill or the Lathe (or both) being utilized? (c) What is the probability that at least two of the machines will be utilized?

```quiz
[
  { "q": "(a) P(all four idle)? (6 decimals)", "type": "numeric", "answer": 0.009216, "tolerance": 0.000005, "explain": "NOT each utilization, then the AND rule: 0.48 × 0.40 × 0.32 × 0.15 = 0.009216." },
  { "q": "(b) P(drill or lathe utilized)? (3 decimals)", "type": "numeric", "answer": 0.808, "tolerance": 0.0005, "explain": "NOT rule on 'both idle': 1 − 0.48 × 0.40 = 0.808; or the OR rule 0.52 + 0.60 − 0.52 × 0.60 = 0.808." },
  { "q": "(c) P(at least two utilized)? (6 decimals)", "type": "numeric", "answer": 0.895168, "tolerance": 0.000005, "explain": "1 − P(none) − P(exactly one) = 1 − 0.009216 − 0.095616 = 0.895168. P(exactly one) = 0.52(0.40)(0.32)(0.15) + 0.48(0.60)(0.32)(0.15) + 0.48(0.40)(0.68)(0.15) + 0.48(0.40)(0.32)(0.85) = 0.009984 + 0.013824 + 0.019584 + 0.052224 = 0.095616." }
]
```


## 16. Two radios

It is required that commercial aircraft have two independent radios. Assume that for a typical flight, the probability of radio failure is 0.002. What is the probability that both radios will fail on a particular flight?

```quiz
[
  { "q": "P(both radios fail)? (6 decimals)", "type": "numeric", "answer": 0.000004, "tolerance": 0.0000002, "explain": "AND rule, independent: 0.002 × 0.002 = 0.000004. That is why two radios are required." }
]
```


## 17. Five wires

When testing for current in a cable with five colour-coded wires, an electrician used a meter to test two wires at a time. How many different tests are required for every possible pairing of two wires?

```quiz
[
  { "q": "Number of pairings?", "type": "numeric", "answer": 10, "tolerance": 0, "explain": "A pair has no order: C(5, 2) = 10. P(5, 2) = 20 would count red-blue and blue-red as two tests." }
]
```


## 18. Defective articles

A lot consists of 10 articles. 6 of the articles have defects and the rest are good. Two articles are selected at random. Determine the probability that both have defects.

```quiz
[
  { "q": "P(both defective)? (4 decimals)", "type": "numeric", "answer": 0.3333, "tolerance": 0.0003, "explain": "C(6, 2)/C(10, 2) = 15/45 = 0.3333, or (6/10)(5/9)." }
]
```


## 19. Surge protectors

Two surge protectors p and q are used to protect an expensive television. If there is a surge in the voltage, the surge protector reduces it to a safe level. Assume that each surge protector has a 99% chance of working properly when a voltage surge occurs. (a) If two surge protectors are arranged in series, what is the probability that a voltage surge will not damage the television? (b) If two surge protectors are arranged in parallel, what is the probability that a voltage surge will not damage the television?

```quiz
[
  { "q": "(a) In series, P(television not damaged)? (4 decimals)", "type": "numeric", "answer": 0.9999, "tolerance": 0.00005, "explain": "The surge must get past both: damage needs both to fail, 0.01 × 0.01; NOT rule gives 1 − 0.0001 = 0.9999." },
  { "q": "(b) In parallel, P(television not damaged)? (4 decimals)", "type": "numeric", "answer": 0.9801, "tolerance": 0.0003, "explain": "The key's reading: the surge travels both paths, so both protectors must work: 0.99 × 0.99 = 0.9801. Series is the better arrangement here." }
]
```


## 20. Gas detectors

A manufacturer of mining safety equipment plans to ship 15 gas detectors to a customer, and as a precaution, orders that a sample of 3 of the detectors be inspected and checked. All 3 were found to be satisfactory and so the entire 15 detectors were shipped to the customer. The customer immediately put all 15 detectors to use and discovered that 2 of them were actually defective. What is the probability that the 3 detectors checked will include no defective units, when in fact 2 of the 15 detectors are defective?

```quiz
[
  { "q": "P(3 checked, none defective)? (4 decimals)", "type": "numeric", "answer": 0.6286, "tolerance": 0.0003, "explain": "C(13, 3)/C(15, 3) = 286/455 = 0.6286, or (13/15)(12/14)(11/13). A sample of 3 misses both defectives almost two times in three." }
]
```


## 21. Eight-letter passwords

An online service randomly generates 8-letter passwords. What is the probability that such a password consists of 8 different letters (assume 26 letters in alphabet)?

```quiz
[
  { "q": "P(8 different letters)? (4 decimals)", "type": "numeric", "answer": 0.3016, "tolerance": 0.0003, "explain": "Ordered, no repeats, over ordered with repeats: P(26, 8)/26^8 = 0.3016. 62 990 928 000 / 208 827 064 576: the same shape as the birthday problem's P(365, 23)/365^23." }
]
```

```widget
counting-calc
{ "n": 26, "r": 8, "kind": "perm", "presets": false, "title": "Problem 21: P(26, 8) against 26^8" }
```

## 22. Car batteries

A quality control engineer inspects a random sample of 3 batteries from each lot of 24 car batteries ready to be shipped. If such a lot contains 6 batteries with slight defects, what are the probabilities that the inspector's sample will contain none of the batteries with defects?

```quiz
[
  { "q": "P(none of the 3 defective)? (4 decimals)", "type": "numeric", "answer": 0.4032, "tolerance": 0.0003, "explain": "C(18, 3)/C(24, 3) = 816/2024 = 0.4032, or (18/24)(17/23)(16/22)." }
]
```


## 23. The expert shot

An expert shot hits a target 95% of the time. What is the probability that the expert will miss the target for the first time on the 15th shot?

```quiz
[
  { "q": "P(first miss on the 15th shot)? (5 decimals)", "type": "numeric", "answer": 0.02438, "tolerance": 0.00005, "explain": "14 hits then a miss, independent shots: 0.95^14 × 0.05 = 0.02438. This is Unit 4's geometric distribution, q^(x−1) p with p = 0.05 and x = 15." }
]
```


## 24. Ten horses

Ten horses are in a race. If you randomly guess the first, second, and third place finishers, what is the probability you were correct?

```quiz
[
  { "q": "P(all three places guessed correctly)? (6 decimals)", "type": "numeric", "answer": 0.001389, "tolerance": 0.00001, "explain": "Order matters: one correct sequence of P(10, 3) = 720: 1/720 = 0.001389." }
]
```


## 25. Guessing a test

Suppose you have not attended classes or done any homework for a course in which you are to write a ten-question multiple choice test where each question has four choices. Therefore, you have to guess on every question and have a 1/4 chance of getting each question correct. (a) What is the probability you get none of the answers correct? (b) What is the probability you get all of the questions correct?

```quiz
[
  { "q": "(a) P(none correct)? (5 decimals)", "type": "numeric", "answer": 0.05631, "tolerance": 0.00005, "explain": "Ten independent wrong guesses: 0.75^10 = 0.05631. This and the next are the X = 0 and X = 10 terms of Unit 4's binomial distribution with n = 10, p = 0.25." },
  { "q": "(b) P(all correct)? (as a decimal, e.g. 0.0000009536)", "type": "numeric", "answer": 0.0000009536, "tolerance": 0.000000002, "explain": "0.25^10 = 9.536 × 10^-7, about one in a million." }
]
```


## 26. Pooled HIV samples

When testing blood samples for HIV, the procedure can be made more efficient and less expensive by combining samples. If samples from three people are combined and test negative, no further testing is needed. If the combined sample tests positive, three individual tests are done. The probability of an at-risk person being HIV-positive is 0.1. What is the probability that a combined sample from three at-risk people tests positive?

```quiz
[
  { "q": "P(combined sample positive)? (3 decimals)", "type": "numeric", "answer": 0.271, "tolerance": 0.0005, "explain": "Positive if at least one of the three is positive: NOT rule, 1 − 0.9^3 = 0.271." }
]
```


## 27. Binomial Bikes

In Mathtown, there are two brands of bicycles: Binomial Bikes and Calculus Cycles. 80% the town's cyclists ride Binomial Bikes and 20% ride Calculus Cycles. Furthermore, 5% of people who ride Binomial Bikes and 8% of people who ride Calculus Cycles bring their bikes into the local shop for service. What is the probability that a randomly-chosen bike that has been brought in for service is a Binomial Bike?

```quiz
[
  { "q": "P(Binomial Bike | brought in for service)? (4 decimals)", "type": "numeric", "answer": 0.7143, "tolerance": 0.0003, "explain": "Bayes: 0.80 × 0.05 / (0.80 × 0.05 + 0.20 × 0.08) = 0.040/0.056 = 0.7143. 71% of the bikes in the shop are Binomial Bikes, below the brand's 80% share because its riders need service less often." }
]
```


## 28. COVID-19 serology

If a person has recently been sick with COVID-19, their blood contains antibodies that make the person immune to contracting the virus again. Serology testing can be used to determine the presence of antibodies. The testing method, of course, is not perfect. A particular serology test has a sensitivity of 90%; that is, 90% of people who have recently been sick with COVID-19 "test positive" (i.e., the test detects the presence of antibodies). The specificity of the test is 92%; that is, 92% of people who have not recently been sick with COVID-19 "test negative" (i.e., the test does not detect the presence of antibodies). It is known that 5% of people have been sick with COVID-19. (a) Suppose a person tests positive for COVID-19 antibodies. What is the probability the person has recently been sick with COVID-19? (b) Suppose a person tests negative for COVID-19 antibodies. What is the probability that the person has not recently been sick with COVID-19?

```quiz
[
  { "q": "(a) P(recently sick | tests positive)? (4 decimals)", "type": "numeric", "answer": 0.3719, "tolerance": 0.0003, "explain": "Bayes: 0.05 × 0.90 / (0.05 × 0.90 + 0.95 × 0.08) = 0.045/0.121 = 0.3719. Sensitivity P(+ | sick) = 0.90; specificity P(− | not sick) = 0.92, so P(+ | not sick) = 0.08 by the NOT rule. Of 10 000 people, 450 true positives against 760 false ones: a positive is right only 37% of the time because the disease is rare." },
  { "q": "(b) P(not sick | tests negative)? (4 decimals)", "type": "numeric", "answer": 0.9943, "tolerance": 0.0003, "explain": "Bayes: 0.95 × 0.92 / (0.95 × 0.92 + 0.05 × 0.10) = 0.874/0.879 = 0.9943. P(− | sick) = 1 − 0.90 = 0.10 by the NOT rule." }
]
```

```widget
bayes-tree
{ "preset": "COVID serology" }
```

:::quiz Which rule
"Not", "at least one", "fewer than": NOT rule on the complement. "Or", "either": OR rule, subtract the overlap unless mutually exclusive. "And", "both", "then", "all": AND rule, with the second factor conditional unless the problem says independent or draws with replacement. "How many ways", "a hand", "in order": $C$ or $P$. "If the worker ..." or "given": restrict the table. "What fraction of the defective / positive / serviced ones": Bayes, one path over the sum of paths.
:::
