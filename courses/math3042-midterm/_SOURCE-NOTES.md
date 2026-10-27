# MATH 3042 midterm prep: source notes (course copy; Quiz 5 transcription omitted)

Single source of numbers for the lesson writers of the MATH 3042 midterm-prep module. Writers do not open the PDFs; everything they need is here. Text in quotation marks or in blockquotes is verbatim from the source. Every number was recomputed by a standard-library Python checker (`check.py`, output in section 12). "Check:" lines cite the recomputed value. Disagreements beyond rounding are in **bold** where they occur and are collected in section 11.

Sources (all under `D:\BCIT\MATH3042\`): practice midterm (blank and solutions PDFs, page images, text extracts), `MATH_3042_Formulas.pdf`, `base-r-cheat-sheet.pdf`, Unit 4 and Unit 5 filled lecture notes, Unit 4 practice problems, Quiz 5 solutions, Labs 5 to 7, the four R tutorial scripts, Labs 1 to 4.

Unit map: U1 numerical descriptive statistics + intro R; U2 visualizing data; U3 probability and counting; U4 discrete probability distributions; U5 continuous (not on the midterm).

---

## 1. Exam logistics

### 1.1 The Oct 20 announcement

| Item | Value |
|---|---|
| Date and time | Wednesday Oct 28 2026, 3:00 pm |
| Room | SW5-1840 |
| Length | 90 minutes |
| Allowed | Paper and pencil + calculator only, no computer |
| Coverage | Units 1 to 4, everything up to Poisson |
| R | "R programming and language is on the exam (write an R command that does XYZ...)" |
| Weight | 30 % of the course grade |
| Aids | Formula sheet + R sheet provided; you can't bring your own |

### 1.2 Practice paper cover page

- Title: "MATH 3042 – Practice Midterm."
- Program: Computer Systems Technology
- Course Name: Applied Probability and Statistics for CST
- Course Number: Math 3042
- Time Allotted: 90 min
- Exam Pages: 12 (including this page)
- Total Marks: 46 (30% weight for the course)

Instructions (verbatim):

1. Do not open the exam or write anything on these pages before you are told to begin.
2. You may use a scientific calculator with statistics functions. No other devices are allowed.
3. If your answer is a probability, round it to four digits after the decimal point. Otherwise, round to three significant digits.
4. A formula sheet is provided separately. No other notes or written materials are allowed.
5. No communication of any sort is allowed with other students or any other person besides your instructor or other exam invigilator.
6. All answers are to be written clearly in this examination booklet.

### 1.3 Marks table (12 questions, 46 marks)

| Q | Marks | Type | Unit |
|---|---|---|---|
| 1 | 5 (1+2+2) | Read a histogram; estimate mean and median; justify whether the empirical rule applies | U1/U2 |
| 2 | 4 | Written recommendation comparing two summary-statistics tables | U1 |
| 3 | 4 (1+1+2) | Independent events, complement, expected value of profit | U3/U4 |
| 4 | 3 | Probability without replacement, sum of mutually exclusive cases | U3 |
| 5 | 3 | Bayes' rule | U3 |
| 6 | 3 (1+1+1) | Discrete distribution table: P(X≥k), E(X), independent days | U4 |
| 7 | 4 (1+1+2) | R: quantile, dplyr filter, mosaic bwplot on a described dataframe | U1/U2 R |
| 8 | 3 (1+1+1) | R: hypergeometric rhyper/dhyper/phyper | U4 R |
| 9 | 3 (2+1) | R: write a simulation function (rbinom or sample), then use it | U3/U4 R |
| 10 | 4 (2+2) | TRUE/FALSE with explanation, reading side-by-side boxplots | U2 |
| 11 | 5 (2+3) | Poisson with rate scaling; "next event between 10 and 20 years" | U4 |
| 12 | 5 (1+2+2) | Cards without replacement, expected winnings, two independent games | U3/U4 |

- R command/function writing: 10 marks (Q7, Q8, Q9).
- Written interpretation: about 13 marks (Q1c, Q2, Q10, part of Q1b).
- No multiple choice; T/F only as "TRUE or FALSE and briefly explain".
- About 2 minutes per mark.

### 1.4 Style of the paper (for writing mock questions)

- Headings "Question N [k marks]" (Q2 is printed "Question 2: [4 marks]"). Sub-parts a., b., c. with marks in brackets "a. [1]". Marks 3 to 5 per question, 1 to 3 per sub-part.
- Bold key words (approximate, reliable battery life, single, Simulates, probability, proportion, simulate, birth weight, gestation, race). Italics for emphasis (two major floods, the next major flood).
- Contexts: BCIT Math department, YVR flights 311/811/911, SkyTrain $3.50 fare and $173 fine, Fraser Valley floods, COMP 2121, "term 3 CST students", "Math Rules" lottery, iris data, Gestation (mosaicData), gold prices. Contexts are reused (the Q4 flights reappear in Q8).
- Interpretation answers: verdict first, then evidence with numbers.
- Work shown: events defined ("Let R: right-handed ..."), rule named, formula symbolic, substitution, answer.
- Probabilities to 4 dp, often also as a percentage; fractions left unsimplified in the work; intermediate values to 6 significant digits (0.002353, 0.828235); non-probabilities to 3 significant figures or cents; losses stated in words.
- Expected value: X / P(X) table first, then E(X) = Σ x P(x).
- Distribution identification is justified. Multi-step combinations appear (Q11b Poisson P(0)(1−P(0)); Q12c inclusion-exclusion). Alternatives given in brackets.
- R answers: full runnable commands, often prefixed with ">"; `library()` calls included when a package is needed; columns via `$` (`Gestation$wt`); functions written `name=function(n){ ... return(...) }`; both `=` and `<-` appear; multiple valid answers accepted with "OR"; positional arguments except `lower.tail=FALSE`, `replace=TRUE`, `prob=c(...)`, `data=`, `main=`, `xlab=`, `ylab=`. Simulation explicitly required (r* functions or `sample`). Phrasings: "Give an R command (or commands) that would ..."; "Write a single R command that ..."; "Write an R function that takes as input ... and returns ..."; "Write a command or series of commands that uses your function from part a. to ...". Data context given as a pasted help-file excerpt.
- Gaps a mock exam could fill (not tested on the practice paper): binomial by hand, geometric by hand, nCr, Chebyshev, z-scores, outlier fences, CV, variance of a discrete distribution, dbinom/dpois/ppois R commands.

---

## 2. The practice midterm, question by question

The solutions are typed (red text on the solution page images), not handwritten.

### Question 1 [5 marks]

> The following histogram summarizes the length (in cm) of flower petals from 150 different iris flowers.

Figure: "Histogram of Flower Petal Lengths". x-axis "Petal Length (cm)", ticks 3 to 8; y-axis "Frequency", 0 to 40. Bins 0.5 cm wide. Bimodal.

| Bin (cm) | Frequency | Cumulative |
|---|---|---|
| 2.5–3.0 | 37 | 37 |
| 3.0–3.5 | 13 | 50 |
| 3.5–4.0 | 0 | 50 |
| 4.0–4.5 | 1 | 51 |
| 4.5–5.0 | 4 | 55 |
| 5.0–5.5 | 11 | 66 |
| 5.5–6.0 | 21 | 87 |
| 6.0–6.5 | 21 | 108 |
| 6.5–7.0 | 17 | 125 |
| 7.0–7.5 | 16 | 141 |
| 7.5–8.0 | 5 | 146 |
| 8.0–8.5 | 4 | 150 |
| Total | 150 | |

**a. [1]** "Approximately, what percentage of the flower petals were at least 4 cm long?"

Solution (verbatim): "There are 37+13=50 that are less than 4cm long, so 100/150 = 0.6667 or 66.67% are at least 4cm long."

Check: 100/150 = 0.666667 → 0.6667. Agrees.

**b. [2]** "Based on the histogram, approximate the mean and median values of the petal lengths. You are not required to show any calculations, but you must fill in the following: The mean petal length is approximately: / The median petal length is approximately:"

Solution (verbatim): Mean "5.25cm (must be below the median)"; Median "5.75cm"; "(The median is between the 75th and 76th values, so must be in the 5.5 - 6.0cm class.)"

Check: mean and median are estimates, so the checker skips them. It confirms the bin counts sum to 150, cumulative through 5.5 = 66, through 6.0 = 87, so the 75th and 76th values lie in the 5.5–6.0 class.

**c. [2]** "Is it reasonable to use the empirical rule on this dataset? Justify your answer with reference to specific features of the histogram."

Solution (verbatim): "No. We can see from the histogram that the distribution is bimodal, with a second frequency peak on the left, making the distribution asymmetric and left-skewed. The empirical rule requires an approximately normal (bell-shaped) distribution."

Check: no number.

### Question 2 [4 marks]

> Suppose you are researching tablet computers to provide a recommendation to the BCIT Mathematics department. One of the most important requirements of the instructors is that the battery must last at least 2 hours under full utilization. You have narrowed the best options down to two tablets, called here tablet X and tablet Y. Their prices and functionalities are similar. The decision as to which one to purchase comes down to which one has the most reliable battery life. You find published statistics from an experiment testing the battery life (in minutes) for each of these tablets. A summary of the data is provided below:

| Statistic | Tablet X (n=65) | Tablet Y (n=72) |
|---|---|---|
| Mean | 135.5 | 133.2 |
| Median | 130.2 | 135.7 |
| Standard deviation | 34.7 | 10.8 |
| Variance | 1204.1 | 116.6 |
| Range | 80.7 | 37.0 |
| Minimum | 91.9 | 108.2 |
| Maximum | 172.6 | 145.2 |

> Write a brief recommendation, being sure to cite relevant statistics in your explanation. You must comment on at least 2 measures of central tendency and at least 2 measures of spread in your recommendation.

Solution (corrected version, verbatim): "I recommend tablet Y. Although the mean battery life is about 3 minutes higher for Tablet Y, the median for Tablet X is about 6 minutes higher. So, I would say the two tablets have comparable "average" battery life, both of which are well above 120 minutes. Tablet Y's battery life, however, is much less variable than Tablet X, as can be seen by its lower values for the range, standard deviation, and variance. This means that a larger proportion of batteries would last longer than 120 minutes for Tablet Y. Thus, Tablet Y is more reliable in terms of lasting at least 2 hours."

Check: **The key's mean/median sentence is reversed.** From the table, X has the higher mean (135.5 vs 133.2, about 2.3 min higher) and Y has the higher median (135.7 vs 130.2, about 5.5 min higher). The recommendation (Tablet Y) and the spread argument are correct. The minimum for X (91.9) is below 120, for Y (108.2) also below 120, so the argument rests on spread, not on minimum alone. See section 11 for the older wrong version in the blank PDF.

### Question 3 [4 marks]

> Each ticket purchased in the "Math Rules" scratch and win lottery has a 2.1% chance of winning a prize of $100.

**a. [1]** "A student buys 8 tickets. What is the probability that none of them win a prize?"

Solution (verbatim): "If we denote a win by W and a loss by L, we want P(LLLLLLLL). Since tickets are independent: P(LLLLLLLL) = P(L)^8 = (1 − 0.021)^8 = 0.8438 or 84.38%"

Check: 0.979^8 = 0.843843 → 0.8438. Agrees.

**b. [1]** "A student buys 8 tickets. What is the probability that he wins at least one prize?"

Solution (verbatim): "P(at least one prize) = 1-P(zero prizes) = 1 − 0.8438 (from part a)"

Check: the key leaves this unevaluated; 1 − 0.979^8 = 0.156157 → 0.1562.

**c. [2]** "If tickets cost $2.50 each, what is the expected profit or loss per ticket to students who play?"

Solution (verbatim): table

| X | P(X) |
|---|---|
| −$2.50 | 0.979 |
| $97.50 | 0.021 |

"E(X) = −$2.50(0.979) + $97.50(0.021) = −$0.40" "There is an expected loss of $0.40 per ticket"

Check: −2.4475 + 2.0475 = −0.40. Agrees.

### Question 4 [3 marks]

> Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area. The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. If two of these passengers are chosen at random, without replacement, what is the probability that they were on the same flight?

Solution (verbatim): "Total passengers = 42 + 116 + 154 = 312" "P(same flight) = P(both 311) + P(both 811) + P(both 911) and these are mutually exclusive, so P(same flight) = (42/312)(41/311) + (116/312)(115/311) + (154/312)(153/311) = 0.3981 or 39.81%"

Check: (1722 + 13340 + 23562)/97032 = 38624/97032 = 0.398054 → 0.3981. Agrees.

### Question 5 [3 marks]

> A room is full of term 3 CST students. In this room, 85% of people are right-handed, and the other 15% are left-handed. The probability that a right-handed person says they enjoyed COMP 2121 is 30%. The probability that a left-handed person says they enjoyed COMP 2121 is 60%. You asked someone in the room if they enjoyed COMP 2121 and they answered yes. What is the probability that they are left-handed?

Solution (verbatim): "Let R: right-handed, P(R) = 0.85; L: left-handed, P(L) = 0.15; H: enjoyed COMP 2121, P(H|R) = 0.3, P(H|L) = 0.6" "Using Bayes' Rule: P(L|H) = P(H|L)P(L) / [P(H|L)P(L) + P(H|R)P(R)] = 0.6(0.15) / [0.6(0.15) + 0.3(0.85)] = 0.2609" "So there is a 26.09% chance they are left-handed."

Check: 0.09/(0.09 + 0.255) = 0.26087 → 0.2609. Agrees.

### Question 6 [3 marks]

> The probability distribution for the number of spam phone calls that Abdullah receives per day is given in the following table:

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P(x) | 0.02 | 0.23 | 0.41 | 0.17 | 0.11 | 0.06 |

**a. [1]** "What is the probability that Abdullah receives at least 3 spam calls today?"

Solution (verbatim): "P(3) + P(4) + P(5) = 0.17 + 0.11 + 0.06 = 0.34 or 34%"

Check: 0.34. Agrees (table sums to 1.0000).

**b. [1]** "What is Abdullah's expected number of spam calls per day?"

Solution (verbatim): "E(X) = Σ[xP(x)] = 0(0.02) + 1(0.23) + 2(0.41) + 3(0.17) + 4(0.11) + 5(0.06) = 2.3. Expected value is 2.3 spam calls per day."

Check: 2.3. Agrees.

**c. [1]** "If we assume that days are independent of each other, what is the probability that Abdullah receives exactly 2 spam calls today and no spam calls tomorrow?"

Solution (verbatim): "P(2)·P(0) = 0.41(0.02) = 0.0082 or 0.82%"

Check: 0.0082. Agrees.

### Question 7 [4 marks]

> This question uses the data from the Gestation dataframe, which is part of the library mosaicData. Below is an excerpt of the help file for this data set.

Help-file excerpt:

```text
Data from the Child Health and Development Studies

Description
Birth weight, date, and gestational period collected as part of the Child Health and
Development Studies in 1961 and 1962. Information about the baby's parents — age,
education, height, weight, and whether the mother smoked is also recorded.

Usage
data(Gestation)

Format
A data frame with 1236 observations on the following variables.
id         identification number
date       birth date where 1096=January 1, 1961
gestation  length of gestation (in days)
wt         birth weight (in ounces)
parity     total number of previous pregnancies (including fetal deaths and still births)
sex        "male"
race       mother's race: "asian", "black", "mex", "mixed", or "white"
…
```

**a. [1]** "Give an R command (or commands) that would output the 20th percentile birth weight."

```r
>quantile(Gestation$wt, 0.20)
```

**b. [1]** "We define premature births as those born before 250 days of gestation. Give an R command (or commands) that would create a dataset consisting of all of the data for only those babies with a gestation period of less than 250 days."

```r
>library(dplyr)
>premature_babies <- filter(Gestation, gestation<250)
```

**c. [2]** "Give an R command (or commands) that would create side-by-side boxplots of the birth weights, grouped by race of the mother."

```r
>library(mosaic)
>bwplot(wt~race, data=Gestation, main="Boxplots of Birth Weights by Race", xlab="Mother's Race", ylab="Baby's Birth Weight (ounces)")
```

Check: no numbers. Note the R sheet lists `quantile` but not `filter` or `bwplot` (section 4).

### Question 8 [3 marks]

> Three international flights, flights 311, 811 and 911, arrived at YVR and the passengers are now all mixed together in the immigration area. The flights had 42 passengers, 116 passengers, and 154 passengers, respectively. Twenty passengers are randomly selected, without replacement. Write a single R command that

**a. [1]** "Simulates this scenario and determines the number of passengers in the group of 20 that were on flight 911."

```r
> rhyper(1, 154, 42+116, 20)
```

**b. [1]** "Computes the probability that exactly 9 of the 20 passengers were on flight 311."

```r
> dhyper(9,42, 116+154, 20)
```

**c. [1]** "Computes the probability that at least 12 of the 20 passengers were on flight 311."

```r
> 1-phyper(11, 42, 116+154, 20)
OR
> phyper(11, 42, 116+154, 20, lower.tail=FALSE)
```

Check: the question asks only for commands. For reference, dhyper(9, 42, 270, 20) = 0.000299663 and 1 − phyper(11, 42, 270, 20) = 4.44528e-07. Argument order is (x, K, N−K, n).

### Question 9 [3 marks]

> Rather than paying the $3.50 fare to take the SkyTrain, a student may decide to sneak on and risk paying the $173 fine if caught. Suppose that each time they sneak on there is a 4.5% chance of getting caught and having to pay the fine.

**a. [2]** "Write an R function that takes as input an integer n that represents the number of times the student sneaks on the SkyTrain and returns the proportion of times they get caught. Your function should simulate this random process, not simply compute the average outcome."

Solution 1:

```r
skytrain_sneaking=function(n){
  times_caught <- rbinom(1,n,0.045)
  return(times_caught/n)
}
```

Solution 2:

```r
skytrain_sneaking2=function(n){
  caught <- sample(0:1,n, replace=TRUE, prob=c(0.955, 0.045))
  #0 is successfully snuck on, 1 is caught
  return(sum(caught)/n)
}
```

**b. [1]** "Write a command or series of commands that uses your function from part a. to compute the total number of dollars saved by a single student who attempts to sneak on the SkyTrain 20 times."

```r
> 20*3.50-skytrain_sneaking(20)*20*173
```

Check: random output, nothing to recompute. Expected value for reference: 70 − 20(0.045)(173) = 70 − 155.70 = −85.70 (an expected loss).

### Question 10 [4 marks]

> The chart below shows the inflation-adjusted price of gold ($ per oz) since 2019, grouped by year (2019 to 2025).

Figure: horizontal side-by-side boxplots, title "Price of Gold Since 2019"; x-axis "Price ($ per oz.)" 1000 to 4000; y-axis "Year" (2019, 2022, 2025 labelled). Approximate readings:

| Year | Box (Q1–Q3) | Median | Note |
|---|---|---|---|
| 2019 | ~1300–1500 | ~1420 | |
| 2020 | ~1680–1890 | ~1770 | |
| 2021 | very narrow box | ~1780 | |
| 2022 | ~1750–1880 | ~1800 | |
| 2023 | ~1930–1990 | ~1960 | narrow |
| 2024 | ~2250–2630 | ~2390 | largest IQR |
| 2025 | ~3120–3380 | ~3280 | whiskers ~2790–4090 |

> For each statement below, write TRUE or FALSE and briefly explain your answer.

**a. [2]** "The median price of gold has more than doubled from 2019 to 2025."

Solution (verbatim): "TRUE. The median price in 2019 was below 1500 $ per oz while the median price in 2025 was approximately 3300 $ per oz, which is more than double."

**b. [2]** "The variability (or "volatility" in finance terms) of the price of gold has steadily increased from 2019 to 2025."

Solution (verbatim): "FALSE. Variability in this context is best represented by the interquartile range (IQR), which is the width of the box in the box plots. There is not clear trend in the IQR. For instance, 2024 has the largest IQR while 2020 and 2025 are approximately the same."

Check: from the readings, 2 × 1420 = 2840 < 3280 (TRUE); IQRs approx 200, 210, narrow, 130, 60, 380, 260 (no steady increase, FALSE). Readings are approximate, not checked by script.

### Question 11 [5 marks]

> On average, a major flood in the Fraser Valley occurs once every 20 years. Assume that floods occur independently and with equal likelihood at any time of the year.

**a. [2]** "What is the probability that *two major floods* occur in the Fraser Valley in the next 10 years?"

Solution (verbatim): "Let X = the number of major floods in the Fraser Valley in the next 10 years. Under the given assumptions, this is a Poisson variable with mean value λ = (1/20 yr) × 10 yr = 0.5. Therefore P(X = 2) = e^{−λ}·λ^x/x! = e^{−0.5}·0.5²/2! = 0.0758"

Check: dpois(2, 0.5) = 0.0758163 → 0.0758. Agrees.

**b. [3]** "What is the probability *the next major flood* in the Fraser Valley will occur between 10 and 20 years from now?"

Solution (verbatim): "This event is equivalent to saying X = 0 for the next 10 years and then X ≠ 0 for the following ten years after that (which is independent of the first 10 years). Therefore P(next flood is 10 to 20 years from now) = P(X = 0)·(1 − P(X = 0)) = e^{−0.5}·0.5⁰/0! · (1 − e^{−0.5}·0.5⁰/0!) = 0.2387" "[Note: this is equivalent also to a geometric variable problem with p = 1 − e^{−0.05}.]"

Check: e^−0.5 = 0.606531, 1 − e^−0.5 = 0.393469, product 0.238651 → 0.2387. Agrees.

### Question 12 [5 marks]

> The rules of a gambling game are as follows:
> • You draw 3 cards, without replacement, from a standard deck of cards.
> • If all three cards are the same rank (e.g., 3 Kings), then you win $200.
> • If all three cards are different ranks (e.g., Seven, King, Ace), then you win $2.
> • Otherwise, you win nothing.
> After each game the 3 cards drawn are replaced in the deck and the deck is reshuffled.

(Picture of a 52-card deck.)

**a. [1]** "If you play this game once, what is the probability that you win exactly $2?"

Solution (verbatim): "P(win $2) = 52/52 × 48/51 × 44/50 = 0.8282"

Check: 0.828235 → 0.8282. Agrees.

**b. [2]** "If you play this game repeatedly, how much do you win per game on average?"

Solution (verbatim): "P(win $200) = 52/52 × 3/51 × 2/50 = 0.002353. E[Winning] = $200·P($200) + $2·P($2) + $0·P($0) = $200·0.002353 + $2·0.828235 + $0 = $2.13"

Check: P($200) = 0.00235294; E = 2.12706 → $2.13. Agrees.

**c. [2]** "If you play this game twice, what is the probability that you win at least $5 in total?"

Solution (verbatim): "The only way to win at least $5 is to win $200 on one or both games. The probability of winning $200 in one game is P($200) = 52/52 × 3/51 × 2/50 = 0.002353. The outcomes of the games are independent, so the probability we want is P(win ≥ $5) = P($200 game 1) + P($200 game 2) − P($200 game 1 and game 2) = 0.002353 + 0.002353 − 0.002353² = 0.0047"

Check: 0.00470035 → 0.0047. Agrees.

---

## 3. The formula sheet (`MATH_3042_Formulas.pdf`, 6 pages, header "MATH 3042 · Formulas · Fall 2026")

No R functions appear on the formula sheet.

### 3.1 Page 1

Descriptive Statistics

| Quantity | Formula |
|---|---|
| Sample mean | X̄ = Σx / n |
| Grouped mean | X̄ = Σ[f·x] / Σf |
| Population mean | μ = Σx / N |
| Sample SD | s = sqrt( Σ(x − X̄)² / (n − 1) ) |
| Population SD | σ = sqrt( Σ(x − μ)² / N ) |
| Skewness (Pearson) | Sk = 3(X̄ − Q2) / s |
| z-score (sample) | Z = (X − X̄) / s |
| z-score (population) | Z = (X − μ) / σ |
| CV (sample) | CV = s / X̄ × 100% |
| CV (population) | CV = σ / μ × 100% |

Outliers: Upper Fence = Q3 + 1.5×IQR; Lower Fence = Q1 − 1.5×IQR.

Empirical Rule: "If a variable X follows a bell-shaped distribution, then: 68% of data values of X are within one standard deviation of the mean; 95% ... within two standard deviations; 99.7% ... within three standard deviations".

Chebyshev's Theorem: "For any random variable X, the percentage of values lying within k standard deviations of the mean is at least: (1 − 1/k²) × 100%".

Probability Rules:

- P(A∪B) = P(A) + P(B), if A and B are mutually exclusive
- P(A∪B) = P(A) + P(B) − P(A∩B), for any events A and B
- P(A∩B) = P(A)·P(B), if A and B are independent
- P(A∩B) = P(A)·P(B|A), for any events A and B
- P(Ā) = 1 − P(A), for any event A

### 3.2 Page 2

Permutations and Combinations: P(n,r) = n!/(n−r)!; C(n,r) = P(n,r)/r! = n!/((n−r)! r!).

Bayes' Rule: "If events A_1, A_2, ..., A_k are mutually exclusive and exhaustive, then for any event B: P(B) = Σ_{j=1}^k P(A_j)·P(B|A_j); P(A_i|B) = P(A_i)·P(B|A_i) / Σ_{j=1}^k P(A_j)·P(B|A_j) (where A_i is any one of the events A_1,...,A_k)".

Discrete Probability Distributions: "For any discrete random variable X, μ = Σ[x·P(x)]; σ² = Σ[(x−μ)²·P(x)] or σ² = Σ[x²·P(x)] − μ²".

| Distribution | P(x) | μ | σ² |
|---|---|---|---|
| Binomial | C(n,x) p^x q^(n−x) | np | npq |
| Geometric | q^(x−1)·p | 1/p | (1−p)/p² |
| Hypergeometric | C(K,x)·C(N−K, n−x) / C(N,n) | n·K/N | n·(K/N)·((N−K)/N)·((N−n)/(N−1)) |
| Poisson | e^(−λ)·λ^x / x! | λ | λ |

### 3.3 Pages 3–6 (not on the midterm)

Pages 3 to 6 are not on the midterm. Sections: Continuous distributions in general (μ = ∫xf, σ²), Uniform, Exponential, Normal, Sampling distributions and the CLT; Confidence intervals and sample sizes (mean, proportion, difference of means with pooled S_p², paired, difference of proportions; n formulas); Hypothesis testing (test statistics for one mean σ known/unknown, one proportion, two means known/pooled, matched pairs; conclusion wording); Regression and correlation (r, t for ρ, ŷ = a + bx, b, a, S_e, prediction interval, CIs for α and β). The sheet prints n² where n_2 is meant in two places (see section 11).

### 3.4 Given for free (midterm)

- Mean, s, σ, grouped mean, Z, CV, Sk, outlier fences, empirical rule, Chebyshev.
- Addition rule (both forms), multiplication rule (both forms), complement.
- P(n,r), C(n,r).
- Bayes with the total-probability denominator.
- Discrete E(X) and both variance forms.
- Binomial, geometric, hypergeometric, Poisson pmfs with their means and variances.

### 3.5 Must know from memory

- Conditional probability P(A|B) = P(A∩B)/P(B) (only implied by the multiplication rule).
- Testing independence: P(A|B) = P(A).
- "At least one" = 1 − P(none).
- Without replacement: sequential fractions.
- The fundamental counting principle and n!.
- Median and quartiles from data or a histogram; median position (n+1)/2; IQR = Q3 − Q1.
- Reading skew and bimodality; mean vs median under skew.
- Boxplot anatomy.
- Net payoff = prize − cost.
- λ = rate × interval.
- Choosing the distribution.
- Geometric convention: the sheet's q^(x−1)p counts trials; R's dgeom counts failures, so pass x−1.
- Cumulative sums.
- All R syntax: d/p/q/r signatures, lower.tail, sample with replace and prob, quantile, mean, sd, var, sum, filter, bwplot/boxplot/hist, writing a function, `$` indexing.

---

## 4. The R sheet (`base-r-cheat-sheet.pdf`)

The generic RStudio "Base R Cheat Sheet", CC BY Mhairi McNeill, updated 3/15.

### 4.1 Sections and functions it lists

| Section | Contents |
|---|---|
| Getting Help | `?mean`, `help.search`, `help(package=)` |
| More about an object | `str`, `class` |
| Using Libraries | `install.packages`, `library(dplyr)`, `dplyr::select`, `data(iris)` |
| Working Directory | `getwd`, `setwd` |
| Vectors: creating | `c(2,4,6)`, `2:6`, `seq(2,3,by=0.5)`, `rep(1:2,times=3)`, `rep(1:2,each=3)` |
| Vector functions | `sort`, `rev`, `table`, `unique` |
| Selecting vector elements | `x[4]`, `x[-4]`, `x[2:4]`, `x[-(2:4)]`, `x[c(1,5)]`, `x[x==10]`, `x[x<0]`, `x[x %in% c(1,2,5)]`, `x['apple']` |
| Programming | for and while loops, if/else; Functions: `function_name <- function(var){ Do something; return(new_variable) }`, example `square <- function(x){ squared <- x*x; return(squared) }` |
| Reading and writing data | `read.table`/`write.table`, `read.csv`/`write.csv`, `load`/`save` |
| Conditions | `==`, `!=`, `>`, `<`, `>=`, `<=`, `is.na`, `is.null` |
| Types | `as.logical`, `as.numeric`, `as.character`, `as.factor` |
| Maths functions | `log`, `exp`, `max`, `min`, `round(x,n)`, `signif(x,n)`, `cor`, `sum`, `mean`, `median`, `quantile`, `rank`, `var`, `sd` |
| Variable assignment | `a <- 'apple'` |
| Environment | `ls`, `rm(x)`, `rm(list=ls())` |
| Matrices | `matrix(x, nrow=3, ncol=3)`, `m[2,]`, `m[,1]`, `m[2,3]`, `t(m)`, `m %*% n`, `solve(m,n)` |
| Lists | `list(x=1:5, y=c('a','b'))`, `l[[2]]`, `l[1]`, `l$x`, `l['y']` |
| Data Frames | `data.frame(...)`, `df$x`, `df[[2]]`, `df[,2]`, `df[2,]`, `df[2,2]`, `View`, `head`, `nrow`, `ncol`, `dim`, `cbind`, `rbind` |
| Strings | `paste`, `paste(collapse)`, `grep`, `gsub`, `toupper`, `tolower`, `nchar` |
| Factors | `factor`, `cut(x, breaks=4)` |
| Statistics | `lm`, `glm`, `summary`, `t.test`, `prop.test`, `pairwise.t.test`, `aov` |
| Plotting | `plot(x)`, `plot(x,y)`, `hist(x)` |
| Dates | see lubridate |

Distributions table:

| Distribution | Random variates | Density | Cumulative | Quantile |
|---|---|---|---|---|
| Normal | `rnorm` | `dnorm` | `pnorm` | `qnorm` |
| Poisson | `rpois` | `dpois` | `ppois` | `qpois` |
| Binomial | `rbinom` | `dbinom` | `pbinom` | `qbinom` |
| Uniform | `runif` | `dunif` | `punif` | `qunif` |

### 4.2 What it lacks

- Argument signatures for the distribution functions (students must remember `dbinom(x, size, prob)`, `dpois(x, lambda)`, etc.).
- Hypergeometric (`dhyper`/`phyper`/`rhyper`) and geometric (`dgeom` etc.).
- `lower.tail`.
- `sample()`.
- `filter`, `bwplot`/`boxplot`, mosaic functions.

---

## 5. Unit 4 filled notes, worked examples (pp. 55–73)

Headed "Unit 4 - Discrete Probability Distributions", dated Oct 4, 2026, fully hand-filled. Sections: 4.1 Mean/SD → 4.2 Binomial → 4.3 Hypergeometric → 4.4 Geometric → 4.5 Poisson. Poisson (4.5, pp. 71–73) is the last section of Unit 4 and the last midterm topic.

**The existing module `math3042-u4` already computed the same numbers:** 0.0123, 0.0465, 0.0506, 12.5/3.1, 20/4.2, 0.0399, 0.2539, 0.5189, 4.4/1.5, 0.1406, 4/3.5, 0.4219, λ=30, 0.0134, 0.0353. The checker agrees with all of them (section 12).

### p. 55 Intro

X = number of children; values 0, 1, 2, 3, 4, 5, … ("countable infinity"). Probability histogram "Canadian Family Size in 2023":

| x | 0 | 1 | 2 | 3 | Total |
|---|---|---|---|---|---|
| P(x) | 0.4499 | 0.2504 | 0.2048 | 0.0949 | 1.000 |

P(0) = 0.4499. Requirements: ΣP(x) = 1 and 0 ≤ P(x) ≤ 1. Check: sum = 1.0000.

### p. 56 §4.1 Mean and SD

```r
X.vals <- sample(1:6, 100, replace=TRUE)
sum(X.vals)/100
```

```text
3.38
```

Exact μ = (1/6)(1) + … + (1/6)(6) = 21/6 = 3.5. E[X] = μ = Σx·P(x); σ² = Σ(x−μ)²P(x); σ = √σ². Check: 3.5.

### p. 57 Children; minimum of dice

- Children: μ = 0(0.4499) + 1(0.2504) + 2(0.2048) + 3(0.0949) = 0.94. Check: 0.9447 → 0.94.
- σ² = (0−0.94)²(0.4499) + (1−0.94)²(0.2504) + (2−0.94)²(0.2048) + (3−0.94)²(0.0949) = 1.03. Check: 1.03124 (1.031264 with μ rounded to 0.94).
- σ = 1.016 ≈ 1.02. Check: 1.0155.
- Minimum of two dice (36-cell grid): μ = 1(11/36) + 2(9/36) + 3(7/36) + 4(5/36) + 5(3/36) + 6(1/36) = 2.53; σ² = 1.97; σ = 1.40. Check: 2.52778, 1.97145, 1.40408.
- Minimum of three dice by simulation: μ = 2.04, σ = 1.15; "μ gets smaller for more dice." Check (exact, for reference): μ = 2.0417, σ = 1.1439.

### p. 58 §4.2 Binomial

Binomial/Geometric/Hypergeometric are "based on trials"; Poisson "Pwah-son". X = number of successes in n trials, 0..n. "Success is not necessarily 'good'." Online shopping example n = 50, p = 0.25. Four conditions: fixed n, success/failure, equal p, independence.

### p. 59 P(X=6), online shopping

Peak at μ = np = 12.5. P(X=6) = 50C6 (0.25)^6 (0.75)^44 = 0.0123 = 1.23%. "Check: dbinom(x, n, p)":

```r
dbinom(6, 50, 0.25)
```

```text
0.0123
```

Check: 0.0123446 → 0.0123.

### p. 60 Fair die 5 times, X = number of 3s

n = 5, p = 1/6, independent. P(x) = nCx p^x q^(n−x).

| x | Work | P(x) | Check |
|---|---|---|---|
| 0 | (5/6)^5 | 0.4019 | 0.401878 |
| 1 | 5(1/6)(5/6)^4 | 0.4019 | 0.401878 |
| 2 | C(5,2)(1/6)²(5/6)³ | 0.1608 | 0.160751 |
| 3 | | 0.0322 | 0.0321502 |
| 4 | | 0.0032 | 0.00321502 |
| 5 | | 0.0001 | 0.000128601 |

### p. 61 Five cards with replacement, X = jacks

p = 4/52. P(X=2) = 5C2 (4/52)²(48/52)³ = 0.0465; `dbinom(2,5,4/52)`. Check: 0.0465401.

At least 2 jacks ("Complement Rule"): P(X≥2) = 1 − P(X≤1) = 1 − [5C0(4/52)^0(48/52)^5 + 5C1(4/52)(48/52)^4] = 0.0506. Check: 0.0505827 → 0.0506.

### p. 62 Binomial μ and σ

μ = np, σ² = npq, σ = √(npq). Website: μ = 12.5; σ = √(50×0.25×0.75) = 3.1. "σ = middle to inflection point". Check: 12.5, 3.06186 → 3.1.

### p. 63 Laser printer ("Null Hypothesis")

p = 0.10, n = 200. μ = 20; σ = √(200×0.1×0.9) = 4.2. 14 needed repair: Z = (14−20)/4.2 = −1.4, not unusual. "No. 14 out of 200 could easily happen through random variability (Z between −2 and +2). X=14 is not 'statistically significant'." Check: μ = 20, σ = 4.24264, Z = −1.41421 → −1.4.

### p. 64 §4.3 Hypergeometric

Binomial = independent trials, with replacement or infinite population, same p. Hypergeometric = dependent trials, without replacement, finite population, p changes. P(x) = C(K,x)·C(N−K,n−x)/C(N,n) ("three C formula"). μ = n·K/N; σ² = n(K/N)((N−K)/N)((N−n)/(N−1)).

### p. 65 Five cards from 52, X = jacks (0..4)

- Hypergeometric: C(4,2)C(48,3)/C(52,5) = 6×17296/2598960 = 0.0399.

```r
dhyper(2, 4, 48, 5)
```

```text
0.03992982
```

Argument order (x, K, N−K, n). Glossary: x successes; n trials; K available successes; N population.

- Binomial: C(5,2)(4/52)²(48/52)³ = 0.0465.

```r
dbinom(2,5,4/52)
```

```text
0.04654006
```

- Superdeck (10 decks): hypergeometric C(40,2)C(480,3)/C(520,5) ≈ 0.0460; binomial 0.0465; "almost the same".

Check: 0.0399298, 0.0465401, superdeck 0.0459715 → 0.0460.

### p. 66 5% rule; Mac example

5% rule: if n ≤ 5% of N, hypergeometric ≈ binomial. Mac example N = 90, K = 40, n = 10.

- a) P(X=4) = C(40,4)C(50,6)/C(90,10) = 0.2539. Check: 0.253861.
- b) P(X≤4) = `phyper(4, 40, 50, 10)` = 0.5189. Check: 0.518886.

### p. 67 Mac continued

- c) μ = 10×40/90 = 4.4; σ² = 10×(40/90)×(50/90)×(80/89) = 2.219, σ = 1.5 (labelled p, q, "finite pop. correction"). Check: 4.44444, 2.21945, 1.48978.
- d) histogram.
- e) X = 8: Z = (8−4.4)/1.5 = 2.4, "Yes, would be unusual." Check: 2.4 (2.3866 with unrounded μ, σ).

### p. 68 §4.4 Geometric

X = trials to first success (fail, fail, fail, fail, pass → X = 5). Help line busy 75%: P(3) = 0.75×0.75×0.25 = 0.1406. P(X=x) = q^(x−1)p; μ = 1/p; σ² = (1−p)/p². "Why geometric?" x: 1, 2, 3, 4 → p, qp, q²p, q³p; Σ = p/(1−q) = 1. Check: 0.140625 → 0.1406.

### p. 69 Geometric mean and SD

Derivation of μ ("You can ignore this derivation"). Help line E[X] = 1/0.25 = 4; σ = √((1−0.25)/0.25²) = 3.5. Check: 4, 3.4641 → 3.5.

### p. 70 P(X≥4) three ways = 0.4219

- Series: 0.75³·0.25/(1−0.75).
- Complement: 1 − (0.25 + 0.75×0.25 + 0.75²×0.25).
- R: 1 − P(X≤3) = `1 - pgeom(2, 0.25)` ("failures before success").

Check: all three = 0.421875 → 0.4219.

Histogram code:

```r
X.vals <- 1:10
p.vals <- q^(X.vals - 1)*p
barplot(p.vals, names.arg=X.vals, col="pink", space=0, xlab="X", ylab="P(x)", main="Number of Calls to Get Access")
```

### p. 71 §4.5 Poisson

"no trials"; "events can occur at any time". Assumptions: X = occurrences in an interval; uniform probability; independence; known mean λ. P(X=x) = λ^x e^(−λ)/x!, e = 2.71828. μ = λ, σ² = λ, σ = √λ.

### p. 72 Web server

One request per 2 s: λ = (1/2 s)×60 s = 30.

- P(X=20) = e^−30·30^20/20! = 0.0134. Check: 0.0134112.
- P(X≤20) = `ppois(20, 30)` = 0.0353. Check: 0.0352846.
- Unusual? μ = 30, σ = √30 = 5.48. Check: 5.47723.
- Method 1: μ − 2σ = 19.04, so 20 is not unusual. Check: 30 − 2(5.48) = 19.04 with the rounded σ; with exact σ it is 19.0455 (19.05). Same conclusion.
- Method 2: Z = (20−30)/5.48 = −1.8, NOT unusual. Check: −1.82574 → −1.8.

### p. 73 Histogram for λ = 30

P(0) = 9.358×10^−14 ≈ 0+; P(1) ≈ 0+. Check: 9.35762e-14.

**Instructor slip:** the table shows "20 | 0.0353", which is P(X≤20). P(X=20) = 0.0134 (checker: 0.0134112).

```r
X.vals <- 0:80
p.vals <- dpois(X.vals, lambda)
names(p.vals) <- X.vals
barplot(p.vals[p.vals > 0.0001], space=0, col="pink", xlab="x", ylab="P(x)", main="Requests to a Web Server in One Minute")
```

### 5.1 The 27 worked-example types in the Unit 4 notes

1. Reading/validating a discrete table (ΣP = 1)
2. Simulated vs theoretical mean (3.38 vs 3.5)
3. E of a table (0.94)
4. Variance/SD of a table (1.03 → 1.02)
5. Distribution from a sample space, then μ, σ (min of two dice 2.53, 1.40)
6. Mean by simulation of a derived variable (min of three dice 2.04, 1.15)
7. Checking the four binomial conditions
8. Single binomial P with dbinom check (0.0123)
9. Full binomial table by hand (0.4019, 0.4019, 0.1608, 0.0322, 0.0032, 0.0001)
10. Cards with replacement as binomial (0.0465)
11. Binomial "at least k" by complement (0.0506)
12. Binomial μ, σ (12.5, 3.1; 20, 4.2)
13. Unusual? Z-score rule (Z = −1.4)
14. Hypergeometric single P with three-C and dhyper (0.0399; 0.2539)
15. Hypergeometric vs binomial and the 5% rule (0.0399 vs 0.0465; 0.0460 vs 0.0465)
16. Hypergeometric cumulative with phyper (0.5189)
17. Hypergeometric μ, σ with finite-population correction (4.4, 2.219, 1.5)
18. Hypergeometric unusual? (Z = 2.4)
19. Geometric P(X=x) (0.1406)
20. Geometric μ, σ (4, 3.5)
21. Geometric P(X≥k) three ways incl. `1-pgeom(k-2,p)` (0.4219)
22. Geometric histogram in R
23. Poisson rate conversion (λ = 30)
24. Poisson P(X=x) with dpois (0.0134)
25. Poisson cumulative ppois (0.0353)
26. Poisson unusual? (19.04; Z = −1.8)
27. Poisson histogram in R

Additional types from the practice problems and labs: expected value of money/insurance (PP2); Poisson for independent separate intervals (PP13c, PP16c, Lab 7 T10g); Poisson rate from yearly counts (PP7, PP10, PP12); lotto as hypergeometric (PP11); binomial between a and b inclusive (Lab 6 T2e/T3e); geometric pgeom off-by-one for "by trial k" / "at least k" (Lab 7 T7).

### 5.2 Unit 5 (not on the midterm)

Unit 5 notes (pp. 74–85, dated Oct 20) are only partly filled: p. 74 (discrete vs continuous, P(X=85.000) = 0, P(84≤X≤86) = 0.05; Normal "Bell Curve"; Exponential "waiting time for Poisson events") and p. 75 (§5.1 Uniform, bus every 20 min, density 1/20 = 0.05: P(8≤X≤11) = 0.15; P(X≥12) = 0.40 with `punif(20,0,20) - punif(12,0,20)`; P(X=4) = 0). pp. 76–85 are unfilled except a typed `pnorm(120,100,15)` → 0.9087888 on p. 80. None of Unit 5 is examinable on the midterm.

---

## 6. Unit 4 practice problems (16, with the sheet's answers)

Stems are as given in the recon report. Each "Check:" names the distribution and parameters used.

### PP1. Ore samples

Stem: 70% undersized; 4 selected. P(a) all 4 undersized, (b) none, (c) three or fewer.

Sheet: a) 0.2401, b) 0.0081, c) 0.7599.

Check: binomial n = 4, p = 0.7. a) dbinom(4) = 0.2401; b) dbinom(0) = 0.0081; c) pbinom(3) = 1 − 0.2401 = 0.7599. Agrees.

### PP2. Life insurance

Stem: survival probability 0.9989 (30-year-old male), 0.9971 (50-year-old female). a) Male charged $180 for a $100,000 payout; expected cost to the company? b) What premium for the female's $75,000 policy gives the same expected cost?

Sheet: a) −$70 (company gains $70); b) $287.50.

Check: expected cost to the company = payout × P(death) − premium.
- a) 100,000 × (1 − 0.9989) − 180 = 110 − 180 = −70. Agrees.
- b) 75,000 × (1 − 0.9971) − P = −70 → 217.50 − P = −70 → P = 287.50. Confirmed: 75,000 × 0.0029 − 287.50 = −70.00. Agrees.

### PP3. Guessing on a test

Stem: 10 questions, 4 choices each, p = 1/4. a) none correct; b) 8/10 or better.

Sheet: a) 0.05631; b) 4.158E-4.

Check: binomial n = 10, p = 0.25. a) 0.75^10 = 0.0563135; b) 1 − pbinom(7) = 436/4^10 = 0.000415802. Agrees.

### PP4. Overbooking

Stem: X = 0, 1, 2, 3, 4 with P = 0.067, 0.141, 0.274, 0.331, 0.187. Expected number not boarded?

Sheet: 2.43.

Check: discrete table (sums to 1.0000); E(X) = 0.141 + 0.548 + 0.993 + 0.748 = 2.43. Agrees.

### PP5. Two 12-sided dice

Stem: a) X = sum: μ, σ. b) X = minimum: μ, σ ("challenging to do by hand!").

Sheet: a) μ = 13, σ = √(143/6) = 4.9; b) μ = 650/144 = 4.51, σ = 2.82.

Check: enumeration of the 144 equally likely outcomes.
- a) μ = 13; σ = √(143/6) = 4.88194 → 4.9. Agrees.
- b) P(X=k) = (2(12−k)+1)/144:

| k | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| count/144 | 23 | 21 | 19 | 17 | 15 | 13 | 11 | 9 | 7 | 5 | 3 | 1 |
| P(X=k) | 0.1597 | 0.1458 | 0.1319 | 0.1181 | 0.1042 | 0.0903 | 0.0764 | 0.0625 | 0.0486 | 0.0347 | 0.0208 | 0.0069 |

μ = Σk·P(k) = 650/144 = 4.51389; E[X²] = 4082/144 = 28.3472; σ² = 28.3472 − 4.51389² = 7.9721; σ = 2.82348 → 2.82. Agrees.

### PP6. Job applications

Stem: p = 0.15. a) expected number of applications; b) fifth application is the first interview; c) three or more applications needed.

Sheet: a) 6.667; b) 0.0783; c) 0.7225.

Check: geometric (trials) p = 0.15. a) 1/p = 6.66667; b) 0.85^4 × 0.15 = 0.0783009; c) P(X≥3) = 0.85² = 0.7225. Agrees.

### PP7. Richmond homicides

Stem: 116 per year; probability of 0, 1, 2, 3, 4 on a given day. Actual data: 268 days (73.4%) had 0; 79 days (21.6%) had 1; 1 day (0.294%) had 3; none more than 3.

Sheet: 0.728, 0.231, 0.0368, 0.00389, 0.000309.

Check: Poisson λ = 116/365 = 0.317808 per day. P(0) = 0.727742, P(1) = 0.231282, P(2) = 0.0367517, P(3) = 0.00389333, P(4) = 0.000309333. Agrees. (Of the actual-data counts, 268/365 = 0.7342 and 79/365 = 0.2164 match the stated percentages; 268 + 79 + 1 = 348, so the remaining 17 days presumably had 2. The stated "1 day (0.294%)" does not equal 1/365 = 0.274%; this is as transcribed, not checked further.)

### PP8. Wood lots

Stem: lot of 20, 5 examined, 4 below strength. a) exactly 1 found; b) at most 1; c) at least 1.

Sheet: a) 0.4696; b) 0.7513; c) 0.7183.

Check: hypergeometric N = 20, K = 4, n = 5. a) 0.469556; b) 0.75129; c) 0.718266. Agrees.

### PP9. Batteries

Stem: sample 3 from a lot of 24 with 6 defective. a) none; b) exactly 1; c) at least 2.

Sheet: a) 0.4032; b) 0.4536; c) 0.1432.

Check: hypergeometric N = 24, K = 6, n = 3. a) 0.403162; b) 0.453557; c) **exact value 0.143281 → 0.1433, sheet 0.1432**. The sheet subtracted rounded parts (1 − 0.4032 − 0.4536 = 0.1432). Last-digit difference only.

### PP10. Low birth weight

Stem: mean 210 per year. a) more than 1 in a day; b) is 2 in a day unusual?

Sheet: a) 0.113; b) No (|z| < 2).

Check: Poisson λ = 210/365 = 0.575342 per day, σ = 0.758513. a) **1 − ppois(1) = 0.113851, which rounds to 0.114; the sheet's 0.113 is truncated.** b) z = (2 − 0.5753)/0.7585 = 1.8782 < 2, not unusual. Agrees.

### PP11. Lotto 6/49

Stem: match 3 of 6.

Sheet: 0.01765, about 1 in 56.6.

Check: hypergeometric N = 49, K = 6, n = 6, x = 3: C(6,3)C(43,3)/C(49,6) = 246820/13983816 = 0.0176504. Agrees. **1/0.0176504 = 56.656, which rounds to 56.7; the sheet's 56.6 is truncated.**

### PP12. Cesium-137

Stem: 1,000,000 atoms fall to 977,287 over 365 days. P(50 decay on a given day).

Sheet: 0.0155.

Check: Poisson λ = (1,000,000 − 977,287)/365 = 22,713/365 = 62.227397 per day; P(X=50) = 0.0155236. Agrees.

### PP13. Cafeteria

Stem: 0.3 customers per minute. a) exactly 2 in 10 minutes; b) 2 or more in 10 minutes; c) exactly 1 in a 5-minute span and 1 in the next 5 minutes.

Sheet: a) 0.2240; b) 0.8009; c) 0.1120.

Check: Poisson. a) λ = 3: 0.224042; b) 1 − ppois(1, 3) = 0.800852; c) λ = 1.5 per 5 min, [dpois(1, 1.5)]² = 0.112021. Agrees.

### PP14. Lot of 50

Stem: lot of 50 with 6 defective, sample 5. a) none; b) not more than 1; c) more than 2.

Sheet: a) 0.5126; b) 0.8970; c) 0.0093.

Check: hypergeometric N = 50, K = 6, n = 5. a) 0.512568; b) 0.896994; pieces P(2) = 0.093762, P(3) = 0.008930. c) **1 − phyper(2) = 0.00924409 → 0.0092; sheet 0.0093.** Even from rounded parts 1 − 0.8970 − 0.0938 = 0.0092, so the sheet's last digit is off.

### PP15. Gas detectors

Stem: 15 detectors, 2 defective, sample 3. P(no defectives).

Sheet: 0.6286.

Check: hypergeometric N = 15, K = 2, n = 3: C(13,3)/C(15,3) = 286/455 = 0.628571. Agrees.

### PP16. 100-year flood

Stem: a) at least 1 in 50 years; b) exactly 1 in 50 years; c) exactly 1 in the next 50 years and 1 in the 50 after; d) exactly 2 in 100 years.

Sheet: a) 0.3935; b) 0.3033; c) 0.0920; d) 0.1839.

Check: Poisson λ = 0.5 per 50 years (λ = 1 per 100 years). a) 1 − e^−0.5 = 0.393469; b) 0.5e^−0.5 = 0.303265; c) 0.303265² = 0.0919699; d) dpois(2, 1) = 0.18394. Agrees.

---

## 7. Lab 6 (Binomial, Sample Proportions, Sample Means, Oct 12)

### 7.1 Intro: 12-sided die rolled 30 times, X = number of 8s

μ = 30/12 = 2.5.

```r
choose(30,3)*(1/12)^3*(11/12)^27
```

```text
0.2242
```

T1: sum of `choose(30,k)*(1/12)^k*(11/12)^(30-k)` for k = 0..2 → 0.5383.

The d/p/q/r family: `dbinom(x,size,prob)`, `pbinom(q,size,prob)`, `qbinom(p,size,prob)`, `rbinom(n,size,prob)`; "size means n, prob means p."

```r
dbinom(3,30,1/12)   # 0.2242
pbinom(2,30,1/12)   # 0.5383
```

Check: 0.224229, 0.538259. Agree.

### 7.2 T2 (n = 30, p = 1/12)

| Part | Event | R | Output | Check |
|---|---|---|---|---|
| a | exactly 6 | `dbinom(6,n,p)` | 0.02464 | 0.0246382 |
| b | at most 6 | `pbinom(6,n,p)` | 0.9898 | 0.989766 |
| c | at least 6 | `1-pbinom(5,n,p)` | 0.03487 | 0.0348723 |
| d | more than 6 | `1-pbinom(6,n,p)` | 0.01023 | 0.0102341 |
| e | 2 to 6 inclusive | `pbinom(6,n,p)-pbinom(1,n,p)` | 0.7158 | 0.715776 |

All agree.

### 7.3 T3 (chip coatings, n = 100, p = 0.20)

| Part | Event | R | Output | Check |
|---|---|---|---|---|
| a | X = 25 | `dbinom(25,n,p)` | 0.04388 | 0.0438778 |
| b | X ≤ 25 | `pbinom(25,n,p)` | 0.9125 | 0.912525 |
| c | X < 25 | `pbinom(24,n,p)` | 0.8686 | 0.868647 |
| d | X ≥ 25 | `1-pbinom(24,n,p)` | 0.1314 | 0.131353 |
| e | 20 ≤ X ≤ 30 | `pbinom(30,n,p)-pbinom(19,n,p)` | 0.5338 | 0.533779 |

All agree.

### 7.4 Plotting

```r
X.vals <- 0:n
P.vals <- dbinom(X.vals,n,p)
barplot(P.vals)
barplot(P.vals, names.arg=X.vals)   # or names(P.vals) <- X.vals
barplot(P.vals[P.vals >= 0.00005], space=0, col="pink", xlab=..., ylab="P(X)", main=paste0(...))
cbind(X=X.vals, P=round(dbinom(X.vals,n,p),4))
```

The cbind table shows P(20) = 0.0993 (n = 100, p = 0.2). Check: 0.0993002.

### 7.5 T4 (n = 20, p = 1/4) table

| x | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P(x) | .0032 | .0211 | .0669 | .1339 | .1897 | .2023 | .1686 | .1124 | .0609 | .0271 | .0099 | .0030 | .0008 | .0002 |

Check: all 14 values agree (section 12).

### 7.6 T5: is X = 0 unusual?

```r
Z <- (0-n*p)/sqrt(n*p*(1-p))
```

```text
-2.582
```

Also:

```r
mu <- sum(X.vals*P.vals)
sig <- sqrt(sum((X.vals-mu)^2*P.vals))
```

gives Z = −2.582. Yes, unusual. Check: (0 − 5)/√3.75 = −2.58199.

### 7.7 Simulation (left-handed, n = 50, p = 0.13, E[X] = 6.5)

```r
rbinom(1,50,0.13)          # 7
X.vals <- rbinom(10^5,n,p)
head(X.vals,100)
cbind(table(X.vals))
cbind(prop.table(table(X.vals)))   # 6 -> 0.16890
hist(X.vals, freq=FALSE, breaks=seq(-0.5,max(X.vals)+0.5,by=1), xaxp=...)
```

Check: E[X] = 6.5; theoretical dbinom(6, 50, 0.13) = 0.16736 (simulated 0.16890).

### 7.8 T6 Number.of.6s(m, n)

A for loop with `sum(6 == sample(1:6, n, replace=TRUE))` and `numeric(m)`; V2 uses `rbinom(m, n, 1/6)`; `cbind(X=0:n, rel.freq=prop.table(table(...)))`:

| X | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| rel.freq (simulated) | .403 | .401 | .160 | .032 | .003 | .0001 |
| theory dbinom(x,5,1/6) | .4019 | .4019 | .1608 | .0322 | .0032 | .0001 |

### 7.9 T7–T9 sample proportion

```r
Left.Prop <- function(n,p){X <- rbinom(1,n,p); X/n}   # 0.08
```

T8: `replicate(m, Left.Prop(n,p))`, `hist(freq=FALSE)`, returns `list(mu=mean(), sig=sd())`; theory μ_p̂ = p, σ_p̂ = √(pq/n).

T9: Z = (0.21 − mu)/sig = 1.688, not unusual. The lab code has a typo `res$mu0` (see section 11).

### 7.10 T10 Dice.Means

`replicate(m, mean(sample(1:6,n,replace=TRUE)))`; `barplot(prop.table(table(...)))`; loop over `ns <- c(1,2,10,50,100)`; `cbind(n=, mu=, sig=)`:

| n | mu | sig | theory σ/√n |
|---|---|---|---|
| 1 | 3.509 | 1.7080 | 1.7078 |
| 2 | 3.502 | 1.2117 | 1.2076 |
| 10 | 3.499 | 0.5392 | 0.5401 |
| 50 | 3.501 | 0.2418 | 0.2415 |
| 100 | 3.500 | 0.1708 | 0.1708 |

---

## 8. Lab 7 (Hypergeometric, Geometric, Poisson, Oct 17)

> **Geometric off-by-one (read this first).** R's `dgeom(x, p) = (1−p)^x p` counts **failures before the first success**. The course formula P(x) = (1−p)^(x−1) p counts **trials** to the first success. So for the course's X (trials): P(X = x) = `dgeom(x-1, p)`, P(X ≤ k) = `pgeom(k-1, p)`, P(X ≥ k) = `1 - pgeom(k-2, p)`, and a simulated trial count is `rgeom(m, p) + 1`. Lab 7 T7 writes this as `pgeom(10-1, ...)`, `1-pgeom(1199-1, ...)`, `pgeom(2000-1, ...) - pgeom(999-1, ...)`.

### 8.1 Hypergeometric

```r
dhyper(0,3,5,2)    # urn 3 white, 5 black, draw 2: 0.3571  (= C(3,0)C(5,2)/C(8,2) = 10/28)
dhyper(2,4,48,5)   # jacks: 0.03993 (= 103776/2598960)
phyper(2,4,48,5)   # 0.9982
```

Check: 0.357143, 0.0399298, 0.998245. Agree.

T1 aces in 8 cards:

```r
p.vals <- dhyper(X.vals, K, N-K, n)
names(p.vals) <- X.vals
p.vals[p.vals>0]
cbind(p.vals)
barplot(..., space=0, col="salmon", ...)
```

| X | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| P | .5014350 | .3913639 | .0978410 | .0091015 | .0002586 |

Check: all agree.

T2 `Draw.Cards(m,n)` loops `sum(sample(1:52, n, replace=FALSE) <= 4)`; `print(cbind(prop.table(table())))` → .49982, .39400, .09726, .00864, .00028.

T3 `rhyper(m, K, N-K, n)` → .50378, .38992, .09696, .00913, .00021.

T4 (N = 999, K = 333, n = 300):

| Part | Event | R | Output | Check |
|---|---|---|---|---|
| a | exactly 100 | `dhyper(100,K,N-K,n)` | 0.05835 | 0.0583476 |
| b | 100 or fewer | `phyper(100,K,N-K,n)` | 0.5305 | 0.530462 |
| c | fewer than 100 | `phyper(99,K,N-K,n)` | 0.4721 | 0.472115 |
| d | at least 110 | `1-phyper(109,K,N-K,n)` | 0.08254 | 0.0825363 |
| e | 90 to 110 inclusive | `phyper(110,K,N-K,n)-phyper(89,K,N-K,n)` | 0.8759 | 0.87591 |

All agree.

### 8.2 Geometric

T5 parking ticket p = 1/10: while loop with `do.next`, `p.x <- (1-p)^(x-1)*p` until `p.x < 0.0005`:

| x | 1 | 2 | 3 | 4 | … | 51 |
|---|---|---|---|---|---|---|
| P | .1 | .09 | .081 | .0729 | … | .0005154 |

`barplot(col="darkcyan")`. Check: P(4) = 0.0729, P(51) = 0.000515378; P(52) = 0.0004638 < 0.0005 so the loop stops after 51.

T6a `Park.Until.Ticket(p)`: `while(sample(c("Ticket","None"),1,prob=c(p,1-p))=="None") x <- x+1`.
T6b `X.Days.Dist(m,p)`: `prop.table(table())`, filter `> 0.0005`, `P.tab[sort(as.numeric(names(P.tab)))]`.
T6c `rgeom(m,p) + 1`.

T7:

| Event | R | Output | Check |
|---|---|---|---|
| a 6 by the 10th roll | `pgeom(10-1, 1/6)` | 0.8385 | 0.838494 |
| b switch (p = 0.001) fails by 500 | `pgeom(500-1, 0.001)` | 0.3936 | 0.393621 |
| c not fail until at least 1200 | `1-pgeom(1199-1, 0.001)` | 0.3013 | 0.301315 |
| d fails between 1000 and 2000 | `pgeom(2000-1,0.001)-pgeom(999-1,0.001)` | 0.2329 | 0.232864 |

All agree once R's failures convention is applied (`pgeom(q)` = P(trials ≤ q+1)).

### 8.3 Poisson

T8 fibre cable λ = 0.75 × 5 = 3.75: while loop with `dpois(x,lambda)`:

| x | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| P | .023518 | .088192 | .165359 | .206699 | .193780 | .145335 |

| x | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|
| P | .090834 | .048661 | .022810 | .009504 | .003564 | .001215 |

`barplot(..., main=paste0("Poisson Distribution, lambda = ", lambda))`. Check: all 12 agree.

T9 `Simulate.Cables(m,lambda)` with `rpois(m,lambda)` → 0: .02393, 1: .08877, 2: .16448, 3: .20331.

T10 (transformers, λ = 34):

| Part | Event | R | Output | Check |
|---|---|---|---|---|
| a | exactly 34 | `dpois(34,lambda)` | 0.06825 | 0.0682506 |
| b | 30 or fewer | `ppois(30,lambda)` | 0.2804 | 0.28035 |
| c | fewer than 30 | `ppois(30-1,lambda)` | 0.2235 | 0.223505 |
| d | more than 38 | `1-ppois(38,lambda)` | 0.2166 | 0.216618 |
| e | at least 38 | `1-ppois(37,lambda)` | 0.2681 | 0.268101 |
| f | 30 to 40 inclusive | `ppois(40,lambda)-ppois(29,lambda)` | 0.6429 | 0.642911 |
| g | ≤ 34 in each of two years | `ppois(34,lambda)^2` | 0.2975 | 0.297506 |
| h | ≤ 68 over two years | `ppois(68, lambda*2)` | 0.5322 | 0.532192 |

All agree. Note g ≠ h (section 11).

---

## 9. Lab 5 and Quiz 5

### 9.1 Lab 5 (Conditional Probability, Oct 5, Unit 3; SFU weather csv; dplyr, mosaic)

Already covered in the u4 module; inventory with outputs:

```r
SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na.strings="NA",
  colClasses=c("Date","integer","character","integer","numeric","numeric","numeric"))
months <- c("Jan", ..., "Dec")
# T1
filter(SFU.Weather, !is.na(Temp.deg.C), !is.na(Total.Precip.mm))
# T2
mean(Temp.deg.C~Month, data=SFU.Weather)
sd(Temp.deg.C~Month, data=SFU.Weather)
# T3
barplot(Monthly.Mean.Temp[months], names.arg=months, col="pink", ...,
  main=paste0("... (n = ", nrow(SFU.Weather), " days)"))        # n = 17582
with(SFU.Weather, max(Temp.deg.C)-min(Temp.deg.C))              # 51.8
with(SFU.Weather, (Temp.deg.C - Monthly.Mean.Temp[Month])/Monthly.SD.Temp[Month])   # Z anomaly
# T4
histogram(~Z.Temp.anomaly, data=..., breaks=seq(-7,7,by=0.25), type="density", fit="normal")
ifelse(Z < -0.4307,"Cold", ifelse(Z <= 0.4307,"Mid","Warm"))
# T5
sum(SFU.Weather$Temp.Seg=="Cold")/nrow(SFU.Weather)
round(c(...),4)                                                  # 0.3439 0.3388 0.3174
# T6
pie(table(SFU.Weather$Temp.Seg), main=..., radius=1.0)
# T7
ifelse(Month %in% c("Jun","Jul","Aug"),"Summer", ...)            # nested
mean(Total.Precip.mm~Season, data=...)
weekdays(SFU.Weather$Date)
has.Precip <- (Total.Precip.mm > 0)
tab1 <- table(SFU.Weather[c("DoW","has.Precip")])
p.Precip <- sum(tab1[,"TRUE"])/sum(tab1)                         # 0.4878285
tab1["Monday","TRUE"]/sum(tab1["Monday",])                       # 0.4876297 (independent)
# T8
tab2 <- table(SFU.Weather[c("Temp.Seg","has.Precip")])
tab2["Cold","TRUE"]/sum(tab2["Cold",])   # etc.                  # 0.5714522 0.4879113 0.3971326
# T9
p.Warm*p.Precip.Warm/(p.Warm*p.Precip.Warm + p.Mid*p.Precip.Mid + p.Cold*p.Precip.Cold)   # 0.2583654
# T10
table(SFU.Weather[c("has.Precip","Temp.Seg","Season")])
tab2["TRUE","Warm","Summer"]/sum(tab2[,"Warm","Summer"])
# T11
tab3[,"Warm","TRUE"]/tab4[,"Warm"]       # by month; barplot x100, ylim=c(0,100)
```

Outputs:

| Item | Value |
|---|---|
| T7 mean precip by season | Autumn 6.735878, Spring 4.852254, Summer 2.276720, Winter 8.034669 |
| tab1 rows (FALSE/TRUE) | Monday 1284/1222; Friday 1277/1235 |
| tab2 rows (FALSE/TRUE) | Cold 2591/3455; Mid 3050/2906; Warm 3364/2216 |
| T10 P(precip \| Warm, season) | Summer 0.0870, Autumn 0.4298, Winter 0.7213, Spring 0.3493 |
| T11 by month | Jan .75, Feb .62, Mar .52, Apr .32, May .20, Jun .15, Jul .06, Aug .06, Sep .12, Oct .40, Nov .75, Dec .78 |

(The tab2 Mid/TRUE cell is 2906; one rendering shows "290", see section 11.)

### 9.2 Quiz 5 (covers Unit 3)

Quiz 5 is a graded quiz, so its questions are not transcribed in this public copy (the full transcription stays in the gitignored `spec/math3042/midterm/_SOURCE-NOTES.md`). Its shape: Part 1 on paper, about 12 marks, three Unit 3 items (a sequential-draw probability without replacement, an independent-events union by the addition rule or by 1 minus the complement, and a two-way table asking P(A), P(A | B) and whether A and B are independent); Part 2 in RStudio on the MASS `survey` data (add a logical column, compute marginal, union and conditional probabilities with R code, test mutual exclusivity and independence and print a conclusion). It adds no technique beyond Units 3 and 4 and Lab 5.

---

## 10. R functions by unit

### Units 1–2

- Vectors and indexing: `c`, `seq`, `:`, `rep`, `length`, `typeof`/`class`, `$`, `[ , ]`, `[[ ]]`, logical indexing, `%in%`, `is.na`, `which`/`which.max`/`which.min`, `sort`/`order`, `names`/`setNames`.
- Data frames: `data.frame`, `cbind`/`rbind`, `head`, `summary`, `nrow`/`dim`, `subset`, `filter` (dplyr), `with`, `attach`, `read.csv`, `data()`, `library`.
- Statistics: `mean`, `median`, `sd`, `var`, `IQR`, `quantile`, `min`/`max`/`range`, `sum`, `sqrt`, `scale`, `percent_rank`, `rank`, `cor`, `lm`/`abline`, `skewness`.
- mosaic formula forms: `favstats(y~g, data=)`, `mean(y~g, data=)`, `sd(y~g, data=)`, `quantile(~y, probs=, data=)`.
- Plots: `hist`, `histogram(~x, type="density", fit="normal", breaks=)`, `bwplot`/`boxplot`, `barplot(names.arg=, space=0, col=, xlab=, ylab=, main=)`, `pie`, `stem`, `cumsum` ogive, `plot`, `xyplot`.
- Tables and text: `table`, `prop.table`, `cut`, `paste`/`paste0`/`sprintf`, `round`.

### Unit 3

`sample(x, size, replace=TRUE/FALSE, prob=)`, `sample.int`, `replicate`, for loops, `function(){…; return()}`, `numeric(m)`; `factorial`, `choose`, `unique`/`length`; `sum(cond)/nrow(df)`, two- and three-way `table(df[c("A","B")])`, `tab["Monday","TRUE"]`, `sum(tab["Monday",])`; Bayes from tables; nested `ifelse`, logical columns, `weekdays()`.

### Unit 4

- By hand in R: `choose(n, x)*p^x*(1-p)^(n-x)`; `lambda^x/factorial(x)*exp(-lambda)`; `q^(x-1)*p`.
- Binomial: `dbinom(x,n,p)`, `pbinom(q,n,p)`, `qbinom`, `rbinom(m,n,p)`.
- Hypergeometric: `dhyper(x,K,N-K,n)`, `phyper`, `rhyper(m,K,N-K,n)`.
- Geometric: `dgeom(x-1,p)`, `pgeom(x-1,p)`, `rgeom(m,p)+1`.
- Poisson: `dpois(x,lambda)`, `ppois(x,lambda)`, `rpois(m,lambda)`.
- Inequality table: P(X≤k) = p(k), P(X<k) = p(k−1), P(X≥k) = 1 − p(k−1), P(X>k) = 1 − p(k), P(a≤X≤b) = p(b) − p(a−1).
- Two periods `p(k)^2`; rescaled `ppois(68, 2*λ)`.
- Moments from a table: `mu <- sum(X.vals*p.vals)`; `sig <- sqrt(sum((X.vals-mu)^2*p.vals))`.
- Moments by formula: `n*p`, `sqrt(n*p*(1-p))`, `n*K/N`, `sqrt(n*p*(1-p)*(N-n)/(N-1))`, `1/p`, `sqrt((1-p)/p^2)`, `sqrt(lambda)`.
- Z = `(X-mu)/sig`, unusual if |Z| > 2.
- Probability histogram pattern; `prop.table(table(sim))`; `hist(freq=FALSE, breaks=seq(-0.5,…,1))`; while loops until p < 0.0005; `min(sample(1:6,3,replace=TRUE))`.

### Unit 5 (not on the midterm)

`punif`, `dunif`, `dnorm`, `pnorm(x,mu,sigma[,lower.tail=FALSE])`, `qnorm`, `dexp`, `pexp(x, rate=1/beta)`, `qexp`, `exp`, `log`, `plot(type="l")`, `polygon`. (From `demo_notebook_Unit_05.Rmd`, Oct 18: `punif`, `dunif` with "# WRONG!!!" for P(T=4), `dnorm`, `plot(type="l")`, `pnorm`, `qnorm`, `polygon`, `dexp`, `pexp(x, rate=1/beta)`, `qexp`, `exp`, `log`.)

### Labs 1–4 functions

- Lab 1: `install.packages`, `library`/`require`, `help`, `data`, `head`, `nrow`, `levels`, `droplevels`, `table`, `mean`, `median`, `sd`, `min`, `max`, `sum`, `sqrt`, `seq`, `hist`, `rank`, `which.max`, `nchar`, `as.character`, `subset`, `filter(TenMileRace, sex=="F", state=="VA", net<4000)`, `%in%`, `$`.
- Lab 2 (MASS quine, mosaic/dplyr): `favstats(~Days)`, `favstats(Days~Lrn, data=)`, `quantile(~Days, probs=…)`, `quantile(Days~Sex)`, `IQR`, `var`, `sd`, `summary`, `scale`, `percent_rank`, `abs`, `round`, `cut`, `prop.table`, `histogram(~net)`, `bwplot(Days~Eth)`, `boxplot`, `hist`, `cbind`, `paste0`, `sprintf`, `which.min`/`which.max`, `View`.
- Lab 3 (MASS survey): `pie`, `barplot`, `table`, `cut`, `stem(survey$Height, scale=2)`, `hist`, `cumsum` (ogive), `plot`, `xyplot(Wr.Hnd~Height, data=survey)`, `range`, `ceiling`, `is.na`, `paste0`, `cbind`, `names`, `levels`, `sprintf`.
- Lab 4 (simulation): `sample()`, `sample.int`, `replicate`, `function`/`return`, for loops, `numeric()`, `character()`, `rep`, `sum`, `table`, `prop.table`, `barplot`, `histogram`, `list`, `cat`/`print`; user functions `Flip.Once`, `Flip.Coins`, `Roll.Dice`, `Roll.Some.Dice`, `Draw.Cards`, `Prob.Heads`, `Prob.E`.

### The four R tutorial scripts

- **"R - datatypes.R"**: `typeof`, `is.atomic`, `is.vector`, `12L`, complex `12+5i`, `intToBits`, `c()`, `list()`, `[ ]` vs `[[ ]]`, `paste`, `print`, `data.frame()`, `$`, `df[4,2]`, `df[df$is.female==TRUE, 2]`, `rbind`, `cbind`.
- **"R - lists matrices and dataframes.R"**: vectors with `[ ]`, nested/named lists, `[ ]` vs `[[ ]]`, `seq`, `matrix(x, nrow=5, byrow=, ncol, dimnames=list())`, `m3["r4",9]`, negative indices, `nrow`, `ncol`, `dim`, `cbind`, `rbind`, `rownames`, `colnames`, `letters`, `paste0`, `attributes`; data frames `names`, `dim`, `head`, `summary`, `$`, `["temp"]`, `[ ,"temp"]`, `attach`/`detach`, `boxplot`, `data(ChickWeight)`, `hist`, `order` (`order(-x)`), `subset(df, cond, select=c(...))`.
- **"R - types and operators.R"**: six atomic types (`charToRaw`); `+ * ^ /`; `& | !`; comparisons; vector indexing, `a[2] <- 7`, `a[a > 8L]`, `d[d != "Carl"]`, the error from `b[2,3]`; `1:20`, `seq(from,to,by)`, vectorised arithmetic, `is.na`, `<-` and `->`.
- **"R - vectors.R"**: `class` vs `typeof`, coercion, named vectors, `setNames`, `sort(decreasing=TRUE)`, `vector(mode="numeric", length=100L)`, `%in%`, `all`, `any`, `seq(length.out=9)`, `seq(by=0.25)`, `rep`, `sample(1:10, size=5, replace=FALSE/TRUE)`, `letters`, `which(v=="h")`, `v[-5]`.

---

## 11. Discrepancies and traps

1. **Q2 reversed sentence in the key.** The corrected solution says "the mean battery life is about 3 minutes higher for Tablet Y, the median for Tablet X is about 6 minutes higher". The table says the opposite: X has the higher mean (135.5 vs 133.2) and Y the higher median (135.7 vs 130.2). The recommendation (Tablet Y) is right. Lesson writers should state the comparison correctly.
2. **Old wrong Q2 in the blank PDF's hidden text.** `text\2026F_MATH_3042_Midterm_Practice.txt` (the "blank" paper) carries the full solutions as hidden text, and its Q2 answer is an older, wrong version: it recommends Tablet X and calls Y "more variable". The solutions image and the (Solutions).txt give the corrected answer (Tablet Y). Use the corrected one.
3. **Q3b left unevaluated.** The key stops at "1 − 0.8438 (from part a)". The value is 0.1562 (checker: 0.156157).
4. **Page count.** The cover says "Exam Pages: 12 (including this page)" but only 10 pages were rendered; blank pages leave large answer spaces.
5. **p. 73 slip.** The Unit 4 notes' histogram table shows "20 | 0.0353". 0.0353 is P(X≤20) = ppois(20, 30); P(X=20) = dpois(20, 30) = 0.0134. The checker flags this row as a DIFF (computed 0.0134112 vs 0.0353), as expected.
6. **Geometric trials vs failures.** The course and formula sheet use X = trials, P(x) = q^(x−1)p. R's `dgeom`/`pgeom`/`rgeom` count failures before the first success. Pass x−1 (`dgeom(x-1,p)`, `pgeom(k-1,p)` for P(X≤k), `1-pgeom(k-2,p)` for P(X≥k)) and add 1 to `rgeom`. The checker initially mislabelled Lab 7 T7c/T7d by forgetting this, which shows how easy the trap is; with R's convention applied, T7c = 0.301315 and T7d = 0.232864, both matching the lab.
7. **`ppois(34,34)^2` vs `ppois(68,68)`.** Lab 7 T10g (≤ 34 in each of two years) = 0.2975 is not the same event as T10h (≤ 68 over two years) = 0.5322. Different questions, different answers.
8. **Lab 6 T9 `res$mu0` typo.** The lab code refers to `res$mu0`; the list returned by T8 has `mu` and `sig`, so it should be `res$mu`.
9. **Lab 5 tab2 "290" vs 2906.** The tab2 Mid/TRUE cell is 2906; one rendering shows "290".
10. **Formula sheet n² typo.** On pages 3–6 (not midterm) the sheet prints n² in two places where n_2 (second sample size) is meant.
11. **R sheet gaps.** The R sheet lacks `dhyper`/`phyper`/`rhyper`, `dgeom`/`pgeom`/`rgeom`, `sample`, `filter`, `bwplot`, `lower.tail`, and any argument signatures. Students must remember these, though Q7, Q8 and Q9 of the practice paper use them.
12. **Practice-problem sheet answers that disagree with the checker beyond rounding** (all last-digit; none changes a conclusion):
    - **PP9c:** exact 0.143281 → 0.1433; sheet 0.1432 (from subtracting rounded parts 1 − 0.4032 − 0.4536).
    - **PP10a:** exact 0.113851 → 0.114 (3 s.f.); sheet 0.113 (truncated).
    - **PP11:** 1/0.0176504 = 56.656 → 56.7; sheet "1 in 56.6" (truncated).
    - **PP14c:** exact 0.00924409 → 0.0092; sheet 0.0093 (wrong in the last digit even from rounded parts: 1 − 0.8970 − 0.0938 = 0.0092).
13. **Unit 4 p. 72 μ − 2σ.** Notes write 19.04 using σ rounded to 5.48 (30 − 10.96). With exact σ = √30 it is 19.0455 (→ 19.05). Rounding chain only; the conclusion (20 is not unusual) stands.
14. **PP7 actual-data percentage.** The stem gives "1 day (0.294%)" but 1/365 = 0.274%. Not part of any answer; as transcribed.

---

## 12. Checker output

Checker: `C:\Users\klian\AppData\Local\Temp\claude\D--BCIT\bcc5dae8-f3b0-426b-abc6-a552f3e0765f\scratchpad\check.py`, run with `python check.py` (standard library only). "OK" means the computed value rounds to the source value at the source's precision; "DIFF" means it does not. The six DIFF lines are discussed in section 11 (items 5, 12 and 13).

```text
=== Practice midterm ===
OK   Q1a P(petal >= 4 cm) = 100/150                             computed 0.666667   source 0.6667
     Q1 bin counts sum = 150; cumulative through 5.5 = 66, through 6.0 = 87
OK   Q3a P(no win in 8) = 0.979^8                               computed 0.843843   source 0.8438
OK   Q3b P(at least one) = 1 - 0.979^8                          computed 0.156157   source 0.1562
OK   Q3c E(profit) = -2.50(0.979) + 97.50(0.021)                computed -0.4   source -0.40
OK   Q4 P(same flight)                                          computed 0.398054   source 0.3981
OK   Q5 P(L|H) Bayes                                            computed 0.26087   source 0.2609
     Q6 sum P = 1.0000
OK   Q6a P(X>=3)                                                computed 0.34   source 0.34
OK   Q6b E(X)                                                   computed 2.3   source 2.3
OK   Q6c P(2)P(0)                                               computed 0.0082   source 0.0082
     Q8 (not asked numerically) dhyper(9,42,270,20) = 0.000299663; 1-phyper(11,42,270,20) = 4.44528e-07
OK   Q11a Poisson lam=0.5 P(X=2)                                computed 0.0758163   source 0.0758
OK   Q11b P(0)(1-P(0)), lam=0.5                                 computed 0.238651   source 0.2387
     Q11b pieces: e^-0.5 = 0.606531, 1 - e^-0.5 = 0.393469
OK   Q12a P(win $2) = 48/51 x 44/50                             computed 0.828235   source 0.8282
OK   Q12 P(win $200) = 3/51 x 2/50                              computed 0.00235294   source 0.002353
OK   Q12b E(winnings)                                           computed 2.12706   source 2.13
OK   Q12c P(>= $5 in two games)                                 computed 0.00470035   source 0.0047

=== Unit 4 practice problems ===
OK   PP1a binom n=4 p=0.7 P(4)                                  computed 0.2401   source 0.2401
OK   PP1b P(0)                                                  computed 0.0081   source 0.0081
OK   PP1c P(X<=3)                                               computed 0.7599   source 0.7599
OK   PP2a male expected cost 100000(1-0.9989) - 180             computed -70   source -70
OK   PP2b female premium P: 75000(1-0.9971) - P = -70           computed 287.5   source 287.50
     PP2b confirm: 75000*(1-0.9971) - 287.50 = -70.00
OK   PP3a binom n=10 p=1/4 P(0)                                 computed 0.0563135   source 0.05631
OK   PP3b P(X>=8)                                               computed 0.000415802   source 4.158e-4
     PP4 sum P = 1.0000
OK   PP4 E(X)                                                   computed 2.43   source 2.43
OK   PP5a sum of two d12: mean                                  computed 13   source 13
OK   PP5a sum of two d12: sd = sqrt(143/6)                      computed 4.88194   source 4.9
     sqrt(143/6) = 4.881940
     PP5b min of two d12: k, count, P(X=k) = (2(12-k)+1)/144
        1  23/144  0.1597
        2  21/144  0.1458
        3  19/144  0.1319
        4  17/144  0.1181
        5  15/144  0.1042
        6  13/144  0.0903
        7  11/144  0.0764
        8   9/144  0.0625
        9   7/144  0.0486
       10   5/144  0.0347
       11   3/144  0.0208
       12   1/144  0.0069
OK   PP5b min mean = 650/144                                    computed 4.51389   source 4.51
     650/144 = 4.513889; E[X^2] = 4082/144
OK   PP5b min sd                                                computed 2.82348   source 2.82
OK   PP6a geometric p=0.15 mean 1/p                             computed 6.66667   source 6.667
OK   PP6b P(X=5) trials                                         computed 0.0783009   source 0.0783
OK   PP6c P(X>=3) = 0.85^2                                      computed 0.7225   source 0.7225
     PP7 lambda/day = 116/365 = 0.317808
OK   PP7 Poisson P(X=0)                                         computed 0.727742   source 0.728
OK   PP7 Poisson P(X=1)                                         computed 0.231282   source 0.231
OK   PP7 Poisson P(X=2)                                         computed 0.0367517   source 0.0368
OK   PP7 Poisson P(X=3)                                         computed 0.00389333   source 0.00389
OK   PP7 Poisson P(X=4)                                         computed 0.000309333   source 0.000309
     PP7 actual: 268+79+1 = 348 days; 268/365 = 0.7342, 79/365 = 0.2164, 1/365 = 0.00274
OK   PP8a hyper N=20 K=4 n=5 P(1)                               computed 0.469556   source 0.4696
OK   PP8b P(X<=1)                                               computed 0.75129   source 0.7513
OK   PP8c P(X>=1)                                               computed 0.718266   source 0.7183
OK   PP9a hyper N=24 K=6 n=3 P(0)                               computed 0.403162   source 0.4032
OK   PP9b P(1)                                                  computed 0.453557   source 0.4536
DIFF PP9c P(X>=2)                                               computed 0.143281   source 0.1432
     PP9c from rounded parts 1 - 0.4032 - 0.4536 = 0.1432
     PP10 lambda/day = 210/365 = 0.575342, sd = 0.758513
DIFF PP10a P(X>1)                                               computed 0.113851   source 0.113
     PP10b z for X=2: 1.8782  (|z| < 2 -> not unusual)
OK   PP11 hyper N=49 K=6 n=6 P(3)                               computed 0.0176504   source 0.01765
DIFF PP11 1 in ...                                              computed 56.6559   source 56.6
     PP12 lambda/day = 22713/365 = 62.227397
OK   PP12 P(X=50)                                               computed 0.0155236   source 0.0155
OK   PP13a lam=3 P(2)                                           computed 0.224042   source 0.2240
OK   PP13b P(X>=2)                                              computed 0.800852   source 0.8009
OK   PP13c [P(1), lam=1.5]^2                                    computed 0.112021   source 0.1120
OK   PP14a hyper N=50 K=6 n=5 P(0)                              computed 0.512568   source 0.5126
OK   PP14b P(X<=1)                                              computed 0.896994   source 0.8970
DIFF PP14c P(X>2)                                               computed 0.00924409   source 0.0093
     PP14c from rounded parts 1 - 0.8970 - 0.0938 = 0.0092
     PP14 pieces: P(0)=0.512568 P(1)=0.384426 P(2)=0.093762 P(3)=0.008930
OK   PP15 hyper N=15 K=2 n=3 P(0)                               computed 0.628571   source 0.6286
OK   PP16a lam=0.5 P(X>=1)                                      computed 0.393469   source 0.3935
OK   PP16b P(1)                                                 computed 0.303265   source 0.3033
OK   PP16c P(1)^2                                               computed 0.0919699   source 0.0920
OK   PP16d lam=1 P(2)                                           computed 0.18394   source 0.1839

=== Lab 6 ===
OK   Lab6 choose(30,3)(1/12)^3(11/12)^27                        computed 0.224229   source 0.2242
OK   Lab6 T1 P(X<=2)                                            computed 0.538259   source 0.5383
OK   Lab6 T2a dbinom(6,30,1/12)                                 computed 0.0246382   source 0.02464
OK   Lab6 T2b pbinom(6)                                         computed 0.989766   source 0.9898
OK   Lab6 T2c 1-pbinom(5)                                       computed 0.0348723   source 0.03487
OK   Lab6 T2d 1-pbinom(6)                                       computed 0.0102341   source 0.01023
OK   Lab6 T2e pbinom(6)-pbinom(1)                               computed 0.715776   source 0.7158
OK   Lab6 T3a dbinom(25,100,0.2)                                computed 0.0438778   source 0.04388
OK   Lab6 T3b pbinom(25)                                        computed 0.912525   source 0.9125
OK   Lab6 T3c pbinom(24)                                        computed 0.868647   source 0.8686
OK   Lab6 T3d 1-pbinom(24)                                      computed 0.131353   source 0.1314
OK   Lab6 T3e pbinom(30)-pbinom(19)                             computed 0.533779   source 0.5338
OK   Lab6 cbind P(20), n=100 p=0.2                              computed 0.0993002   source 0.0993
OK   Lab6 T4 dbinom(0,20,1/4)                                   computed 0.00317121   source 0.0032
OK   Lab6 T4 dbinom(1,20,1/4)                                   computed 0.0211414   source 0.0211
OK   Lab6 T4 dbinom(2,20,1/4)                                   computed 0.0669478   source 0.0669
OK   Lab6 T4 dbinom(3,20,1/4)                                   computed 0.133896   source 0.1339
OK   Lab6 T4 dbinom(4,20,1/4)                                   computed 0.189685   source 0.1897
OK   Lab6 T4 dbinom(5,20,1/4)                                   computed 0.202331   source 0.2023
OK   Lab6 T4 dbinom(6,20,1/4)                                   computed 0.168609   source 0.1686
OK   Lab6 T4 dbinom(7,20,1/4)                                   computed 0.112406   source 0.1124
OK   Lab6 T4 dbinom(8,20,1/4)                                   computed 0.0608867   source 0.0609
OK   Lab6 T4 dbinom(9,20,1/4)                                   computed 0.0270608   source 0.0271
OK   Lab6 T4 dbinom(10,20,1/4)                                  computed 0.00992228   source 0.0099
OK   Lab6 T4 dbinom(11,20,1/4)                                  computed 0.00300675   source 0.0030
OK   Lab6 T4 dbinom(12,20,1/4)                                  computed 0.000751688   source 0.0008
OK   Lab6 T4 dbinom(13,20,1/4)                                  computed 0.000154192   source 0.0002
OK   Lab6 T5 Z = (0 - 5)/sqrt(3.75)                             computed -2.58199   source -2.582
OK   Lab6 left-handed E[X] = 50(0.13)                           computed 6.5   source 6.5
     Lab6 left-handed theoretical dbinom(6,50,0.13) = 0.16736 (simulated 0.16890)
     Lab6 T6 theory dbinom(0,5,1/6) = 0.4019 (simulated 0.403)
     Lab6 T6 theory dbinom(1,5,1/6) = 0.4019 (simulated 0.401)
     Lab6 T6 theory dbinom(2,5,1/6) = 0.1608 (simulated 0.160)
     Lab6 T6 theory dbinom(3,5,1/6) = 0.0322 (simulated 0.032)
     Lab6 T6 theory dbinom(4,5,1/6) = 0.0032 (simulated 0.003)
     Lab6 T10 theory: die sd = 1.7078; sd/sqrt(n) for n=2,10,50,100: 1.2076, 0.5401, 0.2415, 0.1708

=== Lab 7 ===
OK   Lab7 urn dhyper(0,3,5,2) = 10/28                           computed 0.357143   source 0.3571
OK   Lab7 jacks dhyper(2,4,48,5)                                computed 0.0399298   source 0.03993
OK   Lab7 jacks phyper(2,4,48,5)                                computed 0.998245   source 0.9982
OK   Lab7 T1 aces dhyper(0,4,48,8)                              computed 0.501435   source 0.5014350
OK   Lab7 T1 aces dhyper(1,4,48,8)                              computed 0.391364   source 0.3913639
OK   Lab7 T1 aces dhyper(2,4,48,8)                              computed 0.097841   source 0.0978410
OK   Lab7 T1 aces dhyper(3,4,48,8)                              computed 0.00910149   source 0.0091015
OK   Lab7 T1 aces dhyper(4,4,48,8)                              computed 0.000258565   source 0.0002586
OK   Lab7 T4a dhyper(100,333,666,300)                           computed 0.0583476   source 0.05835
OK   Lab7 T4b phyper(100)                                       computed 0.530462   source 0.5305
OK   Lab7 T4c phyper(99)                                        computed 0.472115   source 0.4721
OK   Lab7 T4d 1-phyper(109)                                     computed 0.0825363   source 0.08254
OK   Lab7 T4e phyper(110)-phyper(89)                            computed 0.87591   source 0.8759
OK   Lab7 T5 geometric p=0.1 P(X=4)                             computed 0.0729   source 0.0729
OK   Lab7 T5 P(X=51)                                            computed 0.000515378   source 0.0005154
     Lab7 T5 P(X=52) = 0.0004638 (< 0.0005, so loop stops after 51)
OK   Lab7 T7a 6 by 10th roll, P(X<=10)                          computed 0.838494   source 0.8385
OK   Lab7 T7b fails by 500, P(X<=500)                           computed 0.393621   source 0.3936
OK   Lab7 T7a check R form pgeom(10-1,1/6)                      computed 0.838494   source 0.8385
OK   Lab7 T7c R 1-pgeom(1199-1,0.001) = P(trials>=1200)         computed 0.301315   source 0.3013
OK   Lab7 T7d R pgeom(1999)-pgeom(998) = P(1000<=X<=2000)       computed 0.232864   source 0.2329
OK   Lab7 T8 dpois(0,3.75)                                      computed 0.0235177   source 0.023518
OK   Lab7 T8 dpois(1,3.75)                                      computed 0.0881915   source 0.088192
OK   Lab7 T8 dpois(2,3.75)                                      computed 0.165359   source 0.165359
OK   Lab7 T8 dpois(3,3.75)                                      computed 0.206699   source 0.206699
OK   Lab7 T8 dpois(4,3.75)                                      computed 0.19378   source 0.193780
OK   Lab7 T8 dpois(5,3.75)                                      computed 0.145335   source 0.145335
OK   Lab7 T8 dpois(6,3.75)                                      computed 0.0908345   source 0.090834
OK   Lab7 T8 dpois(7,3.75)                                      computed 0.0486613   source 0.048661
OK   Lab7 T8 dpois(8,3.75)                                      computed 0.02281   source 0.022810
OK   Lab7 T8 dpois(9,3.75)                                      computed 0.00950417   source 0.009504
OK   Lab7 T8 dpois(10,3.75)                                     computed 0.00356406   source 0.003564
OK   Lab7 T8 dpois(11,3.75)                                     computed 0.00121502   source 0.001215
OK   Lab7 T10a dpois(34,34)                                     computed 0.0682506   source 0.06825
OK   Lab7 T10b ppois(30,34)                                     computed 0.28035   source 0.2804
OK   Lab7 T10c ppois(29,34)                                     computed 0.223505   source 0.2235
OK   Lab7 T10d 1-ppois(38,34)                                   computed 0.216618   source 0.2166
OK   Lab7 T10e 1-ppois(37,34)                                   computed 0.268101   source 0.2681
OK   Lab7 T10f ppois(40)-ppois(29)                              computed 0.642911   source 0.6429
OK   Lab7 T10g ppois(34,34)^2                                   computed 0.297506   source 0.2975
OK   Lab7 T10h ppois(68,68)                                     computed 0.532192   source 0.5322

=== Unit 4 filled notes ===
     p.55 sum P = 1.0000
OK   p.57 children mu                                           computed 0.9447   source 0.94
OK   p.57 children var (exact mu)                               computed 1.03124   source 1.03
     p.57 var using rounded mu 0.94 = 1.031264, sd = 1.015512
OK   p.57 children sd                                           computed 1.0155   source 1.02
OK   p.56 fair die mean 21/6                                    computed 3.5   source 3.5
OK   p.57 min two dice mu                                       computed 2.52778   source 2.53
OK   p.57 min two dice var                                      computed 1.97145   source 1.97
OK   p.57 min two dice sd                                       computed 1.40408   source 1.40
     p.57 min three dice exact mu = 2.0417, sd = 1.1439 (notes simulate 2.04, 1.15)
OK   p.59 dbinom(6,50,0.25)                                     computed 0.0123446   source 0.0123
OK   p.60 dbinom(0,5,1/6)                                       computed 0.401878   source 0.4019
OK   p.60 dbinom(1,5,1/6)                                       computed 0.401878   source 0.4019
OK   p.60 dbinom(2,5,1/6)                                       computed 0.160751   source 0.1608
OK   p.60 dbinom(3,5,1/6)                                       computed 0.0321502   source 0.0322
OK   p.60 dbinom(4,5,1/6)                                       computed 0.00321502   source 0.0032
OK   p.60 dbinom(5,5,1/6)                                       computed 0.000128601   source 0.0001
OK   p.61 dbinom(2,5,4/52)                                      computed 0.0465401   source 0.0465
OK   p.61 1 - pbinom(1,5,4/52)                                  computed 0.0505827   source 0.0506
OK   p.62 mu = 50(0.25)                                         computed 12.5   source 12.5
OK   p.62 sigma = sqrt(50 x 0.25 x 0.75)                        computed 3.06186   source 3.1
OK   p.63 mu = 200(0.1)                                         computed 20   source 20
OK   p.63 sigma = sqrt(200 x 0.1 x 0.9)                         computed 4.24264   source 4.2
OK   p.63 Z = (14-20)/sigma                                     computed -1.41421   source -1.4
OK   p.65 dhyper(2,4,48,5)                                      computed 0.0399298   source 0.03992982
OK   p.65 dbinom(2,5,4/52)                                      computed 0.0465401   source 0.04654006
OK   p.65 superdeck dhyper(2,40,480,5)                          computed 0.0459715   source 0.0460
OK   p.66 Mac dhyper(4,40,50,10)                                computed 0.253861   source 0.2539
OK   p.66 Mac phyper(4,40,50,10)                                computed 0.518886   source 0.5189
OK   p.67 Mac mu = 10 x 40/90                                   computed 4.44444   source 4.4
OK   p.67 Mac var                                               computed 2.21945   source 2.219
OK   p.67 Mac sigma                                             computed 1.48978   source 1.5
OK   p.67 Z for X=8 (with 4.4 and 1.5)                          computed 2.4   source 2.4
     p.67 Z with exact mu, sigma = 2.3866
OK   p.68 geometric P(3) = 0.75^2 x 0.25                        computed 0.140625   source 0.1406
OK   p.69 mean 1/0.25                                           computed 4   source 4
OK   p.69 sigma sqrt(0.75/0.0625)                               computed 3.4641   source 3.5
OK   p.70 P(X>=4) = 1 - P(X<=3)                                 computed 0.421875   source 0.4219
OK   p.70 R form 1 - pgeom(2, 0.25)                             computed 0.421875   source 0.4219
     p.70 series 0.75^3 x 0.25/(1-0.75) = 0.421875
OK   p.72 lambda = (1/2) x 60                                   computed 30   source 30
OK   p.72 dpois(20,30)                                          computed 0.0134112   source 0.0134
OK   p.72 ppois(20,30)                                          computed 0.0352846   source 0.0353
OK   p.72 sigma = sqrt(30)                                      computed 5.47723   source 5.48
DIFF p.72 mu - 2 sigma (exact sigma)                            computed 19.0455   source 19.04
OK   p.72 mu - 2 sigma (rounded sigma 5.48)                     computed 19.04   source 19.04
OK   p.72 Z = (20-30)/sqrt(30)                                  computed -1.82574   source -1.8
OK   p.73 dpois(0,30)                                           computed 9.35762e-14   source 9.358e-14
DIFF p.73 table row '20 | 0.0353' read as P(X=20)               computed 0.0134112   source 0.0353

=== Summary ===
6 disagreement(s) beyond rounding:
  - PP9c P(X>=2)
  - PP10a P(X>1)
  - PP11 1 in ...
  - PP14c P(X>2)
  - p.72 mu - 2 sigma (exact sigma)
  - p.73 table row '20 | 0.0353' read as P(X=20)
```


## Mock A answers (verified)

Checker: `C:\Users\klian\AppData\Local\Temp\claude\D--BCIT\dae803c1-64fb-432b-9c27-967e85023da3\scratchpad\writer-d\check_mocks.py`, run with `python check_mocks.py` (standard library only). Each line gives the computed value, the answer set in `09-mock-midterm-a.md`, the `numeric` tolerance, and a plausible wrong value that the tolerance rejects. "OK" means the answer is within tolerance of the computed value and the wrong value is not. Summary line of the run: FAILURES: none

```text
     Q1 n = 200; cumulative [8, 30, 71, 108, 137, 158, 173, 184, 191, 196, 199, 200]
OK   A Q1a % at least 60 min = 42/200                     computed 21   quiz 21  tol 1  rejects 31.5
     Q1 sum f*mid = 8450
OK   A Q1b mean estimate (grouped)                        computed 42.25   quiz 42.25  tol 4  rejects 35
     Q1b 100th and 101st values: cumulative 71 through 30 min, 108 through 40 min -> 30-40 class
OK   A Q1b median estimate (class midpoint)               computed 35   quiz 35  tol 5  rejects 42.25
     Q2 router P: sd^2 = 92.16 (table 92.16); max - min = 41.3 (table 41.3)
     Q2 router Q: sd^2 = 778.41 (table 778.41); max - min = 118.6 (table 118.6)
     Q2 mean Q - mean P = 4.3; median P - median Q = 4.7
     Q2 CV P = 10.86 %, CV Q = 30.10 %
OK   A Q3a P(no win in 6) = 0.96^6                        computed 0.782758   quiz 0.7828  tol 0.0001  rejects 0.2172
OK   A Q3b P(at least one) = 1 - 0.96^6                   computed 0.217242   quiz 0.2172  tol 0.0001  rejects 0.24
OK   A Q3c E(profit) per card                             computed -2   quiz -2.0  tol 0.01  rejects -1.8
     Q3c pieces -5.00(0.96) = -4.80, 70.00(0.04) = 2.80; same as 75(0.04) - 5 = -2.00
     Q4 N = 104; numerator 756+1190+1640 = 3586; denominator 10712
OK   A Q4 P(same set) without replacement                 computed 0.334765   quiz 0.3348  tol 0.0001  rejects 0.3412
OK   A Q5 P(Java | passed)                                computed 0.384   quiz 0.384  tol 0.0001  rejects 0.24
     Q5 numerator 0.2400, denominator 0.6250
     Q6 sum P = 1.0000
OK   A Q6a P(X >= 2)                                      computed 0.54   quiz 0.54  tol 0.0001  rejects 0.3
OK   A Q6b E(X)                                           computed 1.88   quiz 1.88  tol 0.01  rejects 2.5
OK   A Q6c P(0)P(X>=4)                                    computed 0.021   quiz 0.021  tol 0.0001  rejects 0.0135
     Q8b dhyper(5, 28, 35+41, 15) = 0.19663
     Q8c 1 - phyper(6, 35, 28+41, 15) = 0.193998
     Q8a mean of rhyper(1, 41, 28+35, 15) = 15(41/104) = 5.91346
OK   A Q9 expected dollars saved, 50 pushes               computed -80   quiz -80.0  tol 0.01  rejects 40.0
OK   A Q11a lambda = 2, P(X = 3)                          computed 0.180447   quiz 0.1804  tol 0.0001  rejects 0.1954
OK   A Q11b P(0 in 3 mo)(1 - P(0 in next 6 mo))           computed 0.318092   quiz 0.3181  tol 0.0001  rejects 0.3496
     Q11b pieces e^-1 = 0.367879, 1 - e^-2 = 0.864665; wrong (9-month window) 1 - e^-3 = 0.950213
     Q12 P($30) = 132/2652 = 0.0497738; P($3) = 960/2652 = 0.361991; P($0) = 1560/2652 = 0.588235; sum = 1.0000
OK   A Q12a P(win exactly $3)                             computed 0.361991   quiz 0.362  tol 0.0001  rejects 0.181
OK   A Q12b E(winnings)                                   computed 2.57919   quiz 2.58  tol 0.01  rejects 2.04
OK   A Q12c P(total >= $33 in two games)                  computed 0.0385127   quiz 0.0385  tol 0.0001  rejects 0.0971
     Q12c pieces 2(P30)(P3) = 0.0360353, P30^2 = 0.00247743
```

## Mock B answers (verified)

Same checker and run; answers as set in `10-mock-midterm-b.md`.

```text
     Q1 n = 60; sum f*x = 596; cumulative [9, 26, 40, 50, 56, 60]
OK   B Q1a grouped mean                                   computed 9.93333   quiz 9.93  tol 0.05  rejects 12.0
     Q1b 30th and 31st values: cumulative 26 through 8, 40 through 12 -> 8 to 12 class
OK   B Q1c Sk = 3(9.87 - 8.90)/5.62                       computed 0.517794   quiz 0.518  tol 0.005  rejects 0.173
OK   B Q2a CV Expo trip (%)                               computed 6.15385   quiz 6.15  tol 0.05  rejects 16.25
OK   B Q2a CV bus trip (%)                                computed 13.0159   quiz 13.0  tol 0.05  rejects 10.51
OK   B Q2b Z for a 45.6-minute Expo trip                  computed 2.75   quiz 2.75  tol 0.05  rejects 1.61
     Q3 k = 2.5
OK   B Q3a Chebyshev minimum % within 57 to 87            computed 84   quiz 84  tol 0.5  rejects 98.8
OK   B Q3b Chebyshev minimum count of 400                 computed 336   quiz 336  tol 0.5  rejects 380
OK   B Q3c empirical rule count within 60 to 84           computed 380   quiz 380  tol 0.5  rejects 272
     Q4 min 42, Q1 47, median 52, Q3 57, max 91
OK   B Q4a Q1 (hand method)                               computed 47   quiz 47  tol 0.01  rejects 47.5
OK   B Q4a Q3 (hand method)                               computed 57   quiz 57  tol 0.01  rejects 56
OK   B Q4b IQR                                            computed 10   quiz 10  tol 0.01  rejects 49
OK   B Q4c upper fence                                    computed 72   quiz 72  tol 0.01  rejects 67
OK   B Q4c lower fence                                    computed 32   quiz 32  tol 0.01  rejects 37
     Q4 outliers above 72.0 or below 32.0: [91]
     Q4 R quantile (type 7) gives Q1 = 47.5, Q3 = 56.0
OK   B Q5a 4-digit code, no repeats P(10,4)               computed 5040   quiz 5040  tol 0.5  rejects 10000
OK   B Q5b committee C(9,3)                               computed 84   quiz 84  tol 0.5  rejects 504
     Q5c C(13,2) = 78, C(39,3) = 9139, C(52,5) = 2598960, product 712842
OK   B Q5c P(exactly 2 hearts in 5)                       computed 0.27428   quiz 0.2743  tol 0.0001  rejects 0.2637
     Q6 total 200, Linux 64, Term 3 50
OK   B Q6a P(Linux)                                       computed 0.32   quiz 0.32  tol 0.0001  rejects 0.44
OK   B Q6b P(Linux | Term 3)                              computed 0.44   quiz 0.44  tol 0.0001  rejects 0.3438
     Q6c P(A)P(B) = 0.0800 vs P(A and B) = 0.1100: not independent
OK   B Q6d P(Linux or Term 3)                             computed 0.46   quiz 0.46  tol 0.0001  rejects 0.57
OK   B Q7b P(X = 3)                                       computed 0.215063   quiz 0.2151  tol 0.0001  rejects 0.001
     Q7b pieces C(12,3) = 220, 0.18^3 = 0.005832, 0.82^9 = 0.16762
     Q7c P(0) = 0.0924201, P(1) = 0.243448
OK   B Q7c P(X >= 2) = 1 - P(0) - P(1)                    computed 0.664132   quiz 0.6641  tol 0.0001  rejects 0.9076
OK   B Q7d mu = np                                        computed 2.16   quiz 2.16  tol 0.01  rejects 1.77
OK   B Q7d sigma = sqrt(npq)                              computed 1.33086   quiz 1.33  tol 0.05  rejects 1.77
OK   B Q7e Z for 7 retransmissions                        computed 3.63673   quiz 3.64  tol 0.05  rejects 2.73
     Q8a C(6,1) = 6, C(34,4) = 46376, C(40,5) = 658008
OK   B Q8a P(X = 1), N=40 K=6 n=5                         computed 0.422876   quiz 0.4229  tol 0.0001  rejects 0.3915
OK   B Q8b mu = nK/N                                      computed 0.75   quiz 0.75  tol 0.01  rejects 1.2
     Q8c n/N = 0.125 (12.5 % > 5 %); big lot n/N = 0.0025
OK   B Q8d binomial approx P(X = 1), p = 0.15             computed 0.391505   quiz 0.3915  tol 0.0001  rejects 0.0783
     Q8d exact hypergeometric dhyper(1, 300, 1700, 5) = 0.392081
OK   B Q9a P(X = 4) = 0.65^3(0.35)                        computed 0.0961188   quiz 0.0961  tol 0.0001  rejects 0.0625
OK   B Q9b P(X >= 4) = 0.65^3                             computed 0.274625   quiz 0.2746  tol 0.0001  rejects 0.1785
     Q9b by complement 1 - (0.35 + 0.65(0.35) + 0.65^2(0.35)) = 0.274625
OK   B Q9c mu = 1/p                                       computed 2.85714   quiz 2.86  tol 0.05  rejects 1.86
OK   B Q10a lambda per day                                computed 0.8   quiz 0.8  tol 0.001  rejects 0.4
OK   B Q10b P(X = 0)                                      computed 0.449329   quiz 0.4493  tol 0.0001  rejects 0.3595
OK   B Q10c P(X >= 2)                                     computed 0.191208   quiz 0.1912  tol 0.0001  rejects 0.0474
OK   B Q10d P(1)^2 over two days                          computed 0.129214   quiz 0.1292  tol 0.0001  rejects 0.2584
     Q10d P(1) = 0.359463; wrong 'exactly 2 in 2 days' dpois(2, 1.6) = 0.258428
     Q11a dbinom(3, 12, 0.18) = 0.215063; 1 - pbinom(1, 12, 0.18) = 0.664132
OK   B Q11b ppois(3, 2*0.8)                               computed 0.921187   quiz 0.9212  tol 0.0001  rejects 0.9819
     Q11b wrong 'each day' ppois(3,0.8)^2 = 0.981923
OK   B Q11c pgeom(5-1, 0.35) = 1 - 0.65^5                 computed 0.883971   quiz 0.884  tol 0.0001  rejects 0.9246
     Q11c wrong pgeom(5, 0.35) = 1 - 0.65^6 = 0.924581
     Q12 sum P = 1.0000
     Q12 mu = 1.25, sum x^2 P = 2.85, var (shortcut) = 1.2875, var (long form) = 1.2875
OK   B Q12a mu                                            computed 1.25   quiz 1.25  tol 0.01  rejects 2.0
OK   B Q12a sigma by shortcut                             computed 1.13468   quiz 1.13  tol 0.05  rejects 1.69
OK   B Q12b insurer expected profit per policy            computed 41   quiz 41.0  tol 0.01  rejects -41.0
OK   B Q12c premium for $25 expected profit               computed 79   quiz 79.0  tol 0.01  rejects 70.0
```
