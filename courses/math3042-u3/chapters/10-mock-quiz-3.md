---
title: Mock Quiz 3
minutes: 40
---

One long quiz covering Unit 3 (probability and counting), Lab 3 (charts of `survey` in R) and Lab 4 (simulations). Do it in one sitting with your calculator and no notes. Every explanation shows the arithmetic; a miss points back to its lesson and returns in the review queue.

:::quiz What the real quiz looks like
Part 1, paper and pencil: sample spaces, the counting formulas, complement and addition, a two-way table, a Bayes tree. Part 2, RStudio: reproduce a chart from `survey` with a computed title, write a `sample()` or `replicate()` simulation, report a relative-frequency estimate. Unit 1 and 2 tools may appear inside the R questions.
:::

```quiz
[
  {"q": "The set of all possible outcomes of a random experiment is called the...", "options": ["event", "sample space", "random variable", "population"], "answer": 1, "explain": "S, the sample space. An event is a subset of it; a random variable is a number computed from an outcome."},
  {"q": "Three coins: which is more likely, exactly one head or exactly three heads?", "options": ["exactly one head (3/8 vs 1/8)", "exactly three heads", "equally likely", "neither can happen"], "answer": 0, "explain": "One head: HTT, THT, TTH (3 of 8). Three heads: HHH only (1 of 8)."},
  {"q": "Five coins: P(all the same)? (4 decimals)", "type": "numeric", "answer": 0.0625, "tolerance": 0.0005, "explain": "2 outcomes of 32."},
  {"q": "Which statement can NOT be true for an event A?", "options": ["P(A) = 0", "P(A) = 1", "P(A) = 0.999", "P(A) = 1.05"], "answer": 3, "explain": "0 ≤ P(A) ≤ 1 for every event: |A| cannot exceed |S|."},
  {"q": "You roll two dice 2000 times and get boxcars 61 times. The relative-frequency estimate of P(boxcars) is... (4 decimals)", "type": "numeric", "answer": 0.0305, "tolerance": 0.0002, "explain": "x/n = 61/2000 = 0.0305, near the exact 1/36 = 0.0278; the law of large numbers says the gap shrinks with n."},
  {"q": "The law of large numbers says that as n grows, x/n...", "options": ["approaches the classical probability P(A)", "approaches 0.5", "stays constant", "becomes exactly 0 or 1"], "answer": 0, "explain": "Relative frequency must approach the exact classical probability if the experiment is performed enough times."},
  {"q": "A die is rolled three times and a coin flipped twice. How many outcomes?", "type": "numeric", "answer": 864, "tolerance": 0, "explain": "6 × 6 × 6 × 2 × 2 = 864 by the counting rule."},
  {"q": "Four cards with replacement: P(all four red)? (4 decimals)", "type": "numeric", "answer": 0.0625, "tolerance": 0.0005, "explain": "(26/52)^4 = (1/2)^4 = 1/16."},
  {"q": "Four cards without replacement: P(all four red)? (4 decimals)", "type": "numeric", "answer": 0.0552, "tolerance": 0.0003, "explain": "(26/52)(25/51)(24/50)(23/49) = 358800/6497400 = 0.0552."},
  {"q": "$P(n, r)$ counts...", "options": ["unordered groups of r from n", "ordered sequences of r items from n with no repeats", "sequences with repeats allowed", "the number of subsets"], "answer": 1, "explain": "n!/(n − r)!: fill r positions in turn from a shrinking set. C(n, r) = P(n, r)/r! removes the order."},
  {"q": "How many ways can the four Aces be arranged in a row?", "type": "numeric", "answer": 24, "tolerance": 0, "explain": "4! = 24."},
  {"q": "$P(52, 4)$ = ?", "type": "numeric", "answer": 6497400, "tolerance": 0, "explain": "52 · 51 · 50 · 49."},
  {"q": "$C(52, 4)$ = ?", "type": "numeric", "answer": 270725, "tolerance": 0, "explain": "P(52, 4)/4! = 6 497 400/24."},
  {"q": "The calculator keys for C(52, 4) on the Sharp are...", "options": ["52 nPr 4", "52 2ndF nCr 4", "52 ! 4", "4 nCr 52"], "answer": 1, "explain": "nCr for combinations, nPr for permutations; n first, then r."},
  {"q": "A committee of 5 from 20 instructors: how many committees?", "type": "numeric", "answer": 15504, "tolerance": 0, "explain": "C(20, 5) = 15 504: a committee has no order."},
  {"q": "How many sequences of 3 cards drawn without replacement are all diamonds?", "type": "numeric", "answer": 1716, "tolerance": 0, "explain": "P(13, 3) = 13 · 12 · 11."},
  {"q": "P(spade flush in five cards)? (6 decimals)", "type": "numeric", "answer": 0.000495, "tolerance": 0.000003, "explain": "C(13, 5)/C(52, 5) = 1287/2 598 960."},
  {"q": "Which formula for 'a row of 9 seats filled by 9 of 90 students'?", "options": ["$C(90, 9)$", "$P(90, 9)$", "$90^9$", "$9!$"], "answer": 1, "explain": "Distinct seats: order matters, no student sits twice."},
  {"q": "In R, which expression computes $P(52, 4)$?", "options": ["`choose(52, 4)`", "`choose(52, 4) * factorial(4)`", "`factorial(52) / 4`", "`52^4`"], "answer": 1, "explain": "The demo notebook: choose gives C; multiply by r! for P."},
  {"q": "Two dice: P(sum is less than 12)? (4 decimals)", "type": "numeric", "answer": 0.9722, "tolerance": 0.0003, "explain": "Complement: 1 − P(sum = 12) = 1 − 1/36 = 35/36."},
  {"q": "The complement rule: $P(\\bar{A})$ = ...", "options": ["$1 - P(A)$", "$P(A) - 1$", "$1/P(A)$", "$P(S) - P(A) - 1$"], "answer": 0, "explain": "A and its complement partition S."},
  {"q": "Birthday problem, 23 people: P(at least two share)? (3 decimals)", "type": "numeric", "answer": 0.507, "tolerance": 0.002, "explain": "1 − P(365, 23)/365^23 = 1 − 0.4927."},
  {"q": "Which simulation estimates the birthday probability, as in the demo notebook?", "options": ["`sample(1:365, 23)` with `length(unique(...)) < 23`", "`sample(1:365, 23, replace=TRUE)` and count trials where `length(unique(sample.bdays)) < 23`", "`replicate(23, 365)`", "`choose(365, 23)`"], "answer": 1, "explain": "replace=TRUE lets birthdays repeat; fewer than 23 unique values means a match."},
  {"q": "Top card: P(a 7 or an Ace)?", "options": ["8/52", "16/52", "4/52", "1/52"], "answer": 0, "explain": "Mutually exclusive: 4/52 + 4/52."},
  {"q": "Top card: P(a heart or a face card)? (4 decimals)", "type": "numeric", "answer": 0.4231, "tolerance": 0.0003, "explain": "13/52 + 12/52 − 3/52 (J, Q, K of hearts counted twice) = 22/52 = 0.4231."},
  {"q": "Mutually exclusive events are events that...", "options": ["have the same probability", "cannot both occur in one trial", "are independent", "together make up S"], "answer": 1, "explain": "A black card and a heart. Then P(A ∩ B) = 0."},
  {"q": "$P(B \\mid A)$ is...", "options": ["$|A \\cap B| / |A|$", "$|A \\cap B| / |S|$", "$|A| / |B|$", "$|B| / |A|$"], "answer": 0, "explain": "Restrict the sample space to A."},
  {"q": "Table (71 students): Right-handed 61, iPhone 58, Right and iPhone 52. P(iPhone | Right)? (3 decimals)", "type": "numeric", "answer": 0.852, "tolerance": 0.002, "explain": "52/61."},
  {"q": "Same table: P(Right | iPhone)? (3 decimals)", "type": "numeric", "answer": 0.897, "tolerance": 0.002, "explain": "52/58."},
  {"q": "Same table: are Right and iPhone independent?", "options": ["yes: 0.732 = 0.702", "no: P(Right ∩ iPhone) = 0.732 differs from P(Right)·P(iPhone) = 0.702", "yes, because both are common", "cannot tell"], "answer": 1, "explain": "Equivalently P(iPhone | Right) = 0.852 ≠ P(iPhone) = 0.817."},
  {"q": "A and B are independent exactly when...", "options": ["$P(A \\cap B) = 0$", "$P(A \\cap B) = P(A)P(B)$", "$P(A) = P(B)$", "$A = \\bar{B}$"], "answer": 1, "explain": "Or equivalently P(B | A) = P(B)."},
  {"q": "Two Aces without replacement? (5 decimals)", "type": "numeric", "answer": 0.00452, "tolerance": 0.00003, "explain": "(4/52)(3/51) = 1/221."},
  {"q": "Two Aces with replacement? (5 decimals)", "type": "numeric", "answer": 0.00592, "tolerance": 0.00003, "explain": "(4/52)^2 = 1/169."},
  {"q": "60% female, 5% of women and 15% of men left-handed. P(left-handed)? (2 decimals)", "type": "numeric", "answer": 0.09, "tolerance": 0.001, "explain": "0.03 + 0.06."},
  {"q": "Same: P(female | left-handed)? (3 decimals)", "type": "numeric", "answer": 0.333, "tolerance": 0.002, "explain": "0.03/0.09 = 1/3."},
  {"q": "CPUs: Intel 85%/1%, AMD 10%/3%, Other 5%/2%. P(defective)? (4 decimals)", "type": "numeric", "answer": 0.0125, "tolerance": 0.0001, "explain": "0.0085 + 0.0030 + 0.0010."},
  {"q": "P(Other | defective)? (2 decimals)", "type": "numeric", "answer": 0.08, "tolerance": 0.005, "explain": "0.0010/0.0125 = 0.08."},
  {"q": "In Bayes' theorem the denominator $\\sum_i P(A_i)P(B \\mid A_i)$ is...", "options": ["P(B), by the law of total probability", "P(A_i)", "1", "P(B | A_i)"], "answer": 0, "explain": "Every path that ends in B, added."},
  {"q": "In Lab 3, `freq.tab <- table(survey$W.Hnd)`. What does `sum(freq.tab)` return and why does the title use it?", "options": ["237; it is nrow(survey)", "236; the number of students with a recorded writing hand, so the title's n is computed rather than typed", "2; the number of levels", "18"], "answer": 1, "explain": "One writing hand is missing, so the table sums to 236. paste0('... (n = ', sum(freq.tab), ')') keeps the title honest."},
  {"q": "Which line makes pie labels that read `Left\\n(18 students)`?", "options": ["`paste0(names(freq.tab), \"\\n(\", freq.tab, \" students)\")`", "`names(freq.tab) + freq.tab`", "`labels(freq.tab)`", "`cat(names(freq.tab))`"], "answer": 0, "explain": "paste0 concatenates element-wise with no separator; \\n breaks the line."},
  {"q": "`cut(numerical.heights, seq(150, 200, by=5), right=FALSE)` followed by `table()` gives...", "options": ["a histogram", "the frequency distribution with classes [150,155), [155,160), …", "the cumulative frequencies", "the mean height"], "answer": 1, "explain": "cut assigns classes (closed on the left), table counts. cumsum() of that table gives the cumulative frequencies."},
  {"q": "Lab 3's ogive plots...", "options": ["cumulative counts against the lower class limits, with a 0 inserted at the first lower limit", "relative frequency against class marks", "frequency against upper limits", "heights against pulse"], "answer": 0, "explain": "plot(lower.limits, c(0, cumsum(heights.freq)), type='b'). Unit 2's version used upper limits and relative frequencies."},
  {"q": "Which call simulates 5 rolls of a fair die?", "options": ["`sample.int(6, 5)`", "`sample.int(6, 5, replace=TRUE)`", "`sample(5, 6)`", "`rnorm(5)`"], "answer": 1, "explain": "Without replace=TRUE the values are all different."},
  {"q": "`X <- sum(sample(c(\"H\",\"T\"), 1000, replace=TRUE, prob=c(0.55, 0.45)) == \"H\")` computes...", "options": ["the probability of heads", "the number of heads in 1000 flips of a 55% coin", "1000", "0.55"], "answer": 1, "explain": "The comparison is a logical vector; sum counts TRUEs (537 in the lab's run)."},
  {"q": "`replicate(m, sum(sample.int(6, 2, replace=TRUE)))`...", "options": ["returns one sum", "returns m simulated sums of two dice, replacing a for loop", "rolls m dice once", "is an error"], "answer": 1, "explain": "replicate runs the expression m times and collects the results; sum(X.vals == 7)/m then estimates P(sum = 7) ≈ 0.1667."},
  {"q": "`Prob.Heads(m)` was run 100 times for each m. The sd of the estimates was 0.051 for m = 100 and 0.0056 for m = 10 000. Which is the conclusion?", "options": ["the estimate does not depend on m", "variability shrinks as m grows, by about √10 per tenfold increase", "the coin is biased", "10 000 trials is too few"], "answer": 1, "explain": "Task 9's table: 0.143, 0.051, 0.017, 0.0056, 0.0019."},
  {"q": "In `Roll.Some.Dice(10000, n)` with X = number of 3s, as n grows the distribution of X...", "options": ["becomes closer to a normal distribution with its peak near n/6", "becomes uniform", "peaks at n/2", "does not change"], "answer": 0, "explain": "The lab's answer: n = 100 peaks at X ≈ 16."},
  {"q": "`Draw.Cards` with `replace=FALSE` versus `replace=TRUE`...", "options": ["shifts the centre away from n/2", "narrows the distribution without moving the centre n/2", "widens it", "makes no difference"], "answer": 1, "explain": "Sampling without replacement reduces variability; the mean stays at n/2."},
  {"type": "match", "q": "Match each R idiom from the labs to what it does.", "pairs": [["`sample(x, n, replace=TRUE)`", "n independent draws from x, values may repeat"], ["`sum(v == \"H\")`", "count how many elements equal H"], ["`replicate(m, expr)`", "run expr m times, collect the results"], ["`prop.table(table(x))`", "relative frequency of each value"], ["`paste0(\"n = \", sum(freq.tab))`", "a title built from the data"], ["`cut(x, breaks, right=FALSE)`", "assign each value to a [lower, upper) class"]], "explain": "The vocabulary of Labs 3 and 4."},
  {"type": "match", "q": "Match the situation to the count.", "pairs": [["five dice at once", "$6^5$"], ["four cards in order", "$P(52, 4)$"], ["a hand of four", "$C(52, 4)$"], ["at least one match among 23 birthdays", "$1 - P(365, 23)/365^{23}$"]], "explain": "Repeats allowed: power. Order: P. No order: C. 'At least': complement."}
]
```
