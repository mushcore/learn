---
title: "Mock midterm B: what the practice paper skipped"
minutes: 90
---

Twelve questions, 46 marks, on the Unit 1 to 4 topics the practice paper did not test: grouped data and skewness, CV and Z, Chebyshev, fences, counting, a two-way table, the binomial, hypergeometric, geometric and Poisson by hand, and the R commands for each. Write every answer on paper first with the formula sheet and a calculator, then type the number or the key word here.

:::quiz Timing: about two minutes per mark
| Q | Marks | Topic | Minutes |
|---|---|---|---|
| 1 | 4 | Grouped mean, median class, Pearson's Sk | 8 |
| 2 | 3 | CV of two datasets; a Z-score | 6 |
| 3 | 3 | Chebyshev at k = 2.5 versus the empirical rule | 6 |
| 4 | 4 | Five-number summary, IQR, fences, the outlier | 8 |
| 5 | 4 | Counting: a code, a committee, a hand of cards | 8 |
| 6 | 4 | A two-way table: P(A), P(A \| B), independence, P(A ∪ B) | 8 |
| 7 | 5 | Binomial by hand: conditions, P(X = 3), P(X ≥ 2), μ, σ, Z | 10 |
| 8 | 4 | Hypergeometric by hand; the 5 % rule | 8 |
| 9 | 3 | Geometric: P(X = 4), P(X ≥ 4), μ | 6 |
| 10 | 4 | Poisson: a daily λ from a yearly count; two days | 8 |
| 11 | 4 | R: `dbinom`, `pbinom`, `ppois`, `pgeom`, `favstats`, `histogram` | 8 |
| 12 | 4 | σ by the shortcut formula; an insurance plan | 8 |

Rounding as on the cover: a probability to four decimal places, anything else to three significant digits, money to the cent. Define the variable in words, name the rule, write the formula, substitute, then give the number.
:::

| Q | Taught in |
|---|---|
| 1 | [Mean](#/math3042/mean), [median and mode](#/math3042/median-mode), [skewness](#/math3042/skewness), [frequency tables](#/math3042-u2/frequency-tables) |
| 2 | [CV](#/math3042/cv), [Z-scores](#/math3042/z-scores) |
| 3 | [Chebyshev](#/math3042/chebyshev), [the empirical rule](#/math3042/empirical-rule) |
| 4 | [Quartiles and percentiles](#/math3042/quartiles-percentiles), [IQR, boxplots, outliers](#/math3042/iqr-boxplot-outliers) |
| 5 | [Counting](#/math3042-u3/counting) |
| 6 | [Complement and addition](#/math3042-u3/complement-addition), [conditional probability and independence](#/math3042-u3/conditional-independence) |
| 7 | [Binomial](#/math3042-u4/binomial), [binomial mean and variance](#/math3042-u4/binomial-mean-variance) |
| 8 | [Hypergeometric](#/math3042-u4/hypergeometric) |
| 9 | [Geometric](#/math3042-u4/geometric) |
| 10 | [Poisson](#/math3042-u4/poisson), [Poisson across separate intervals](#/math3042-midterm/expected-dollars-shortcuts) |
| 11 | [R on paper](#/math3042-midterm/r-on-paper), [Lab 2 grouped statistics](#/math3042-u2/lab2-grouped) |
| 12 | [Discrete distributions](#/math3042-u4/discrete-distributions), [the variance shortcut and expected dollars](#/math3042-midterm/expected-dollars-shortcuts) |

## Q1 (4 marks). Length of 60 office-hour sessions

The lengths (in minutes) of 60 online office-hour sessions for COMP 3522 were grouped into classes of width 4 (each class includes its lower limit, not its upper):

| Length (min) | 0–4 | 4–8 | 8–12 | 12–16 | 16–20 | 20–24 |
|---|---|---|---|---|---|---|
| Frequency | 9 | 17 | 14 | 10 | 6 | 4 |

```quiz
[
  {
    "q": "**Q1a (1 mark).** Estimate the mean session length from the frequency table. (minutes, 3 significant digits)",
    "type": "numeric",
    "answer": 9.93,
    "tolerance": 0.05,
    "unit": "min",
    "explain": "Use the class midpoints x = 2, 6, 10, 14, 18, 22 and the grouped-mean formula X̄ = Σ[f·x]/Σf.\n\nΣ f·x = 9(2) + 17(6) + 14(10) + 10(14) + 6(18) + 4(22) = 18 + 102 + 140 + 140 + 108 + 88 = 596; Σf = 60.\n\nX̄ = 596/60 = **9.93 minutes**. Averaging the six midpoints without the frequencies gives 12.0."
  },
  {
    "q": "**Q1b (1 mark).** Which class contains the median? Type it as lower–upper, for example 0-4.",
    "type": "text",
    "answer": ["8-12", "8–12", "8 - 12", "8 to 12", "8-12 min"],
    "explain": "Put the 60 sessions in order from shortest to longest. 60 is even, so there are two middle values, at positions 60/2 = 30 and 31. Keep a running total of the frequencies to see which positions each class fills: 0–4 fills 1 to 9, 4–8 fills 10 to 26 (9 + 17), and 8–12 fills 27 to 40 (26 + 14). Positions 30 and 31 both fall in 27 to 40, so the median is in the **8–12 minute** class."
  },
  {
    "q": "**Q1c (1 mark).** From the raw data, R reports X̄ = 9.87, Q2 = 8.90 and s = 5.62. Compute Pearson's coefficient of skewness. (3 significant digits)",
    "type": "numeric",
    "answer": 0.518,
    "tolerance": 0.005,
    "explain": "Sk = 3(X̄ − Q2)/s = 3(9.87 − 8.90)/5.62 = 3(0.97)/5.62 = 2.91/5.62 = **0.518**. Leaving out the 3 gives 0.173."
  },
  {
    "q": "**Q1d (1 mark).** What shape does Sk = 0.518, together with the table, indicate? Type the direction of the skew (left or right).",
    "type": "text",
    "answer": ["right", "right-skewed", "right skewed", "skewed right", "positive", "positively skewed"],
    "explain": "**Right-skewed** (positively skewed). Sk is positive because the mean 9.87 is above the median 8.90, and the table shows the same thing: the largest class is 4–8 minutes and the frequencies tail off slowly toward 20–24 minutes."
  }
]
```

## Q2 (3 marks). Expo Line versus the 99 B-Line trip times

Over 40 trips each, an Expo Line ride from Waterfront to King George took a mean of 39.0 minutes with s = 2.4 minutes, and a 99 B-Line bus ride from Commercial–Broadway to UBC took a mean of 31.5 minutes with s = 4.1 minutes.

```quiz
[
  {
    "q": "**Q2a (1 of 2 marks).** The coefficient of variation of the Expo Line trip times? (percent, 3 significant digits)",
    "type": "numeric",
    "answer": 6.15,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "CV = s/X̄ × 100 % = 2.4/39.0 × 100 % = **6.15 %**. Dividing the other way, 39.0/2.4, gives 16.25, which is not a CV."
  },
  {
    "q": "**Q2a (2 of 2 marks).** The coefficient of variation of the 99 B-Line trip times? (percent, 3 significant digits)",
    "type": "numeric",
    "answer": 13.0,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "CV = s/X̄ × 100 % = 4.1/31.5 × 100 % = **13.0 %**. The bus trip times are about twice as variable relative to their mean as the train's (13.0 % against 6.15 %), so the **bus** trip is the more variable one."
  },
  {
    "q": "**Q2b (1 mark).** One Expo Line trip took 45.6 minutes. Compute its Z-score. (2 decimals)",
    "type": "numeric",
    "answer": 2.75,
    "tolerance": 0.05,
    "explain": "Z = (X − X̄)/s = (45.6 − 39.0)/2.4 = 6.6/2.4 = **2.75**. Use the Expo Line's own mean and s; dividing by the bus's 4.1 gives 1.61."
  },
  {
    "q": "Q2b: the 45.6-minute Expo Line trip is unusual.",
    "type": "tf",
    "answer": true,
    "explain": "**TRUE.** Z = 2.75 is beyond 2, so the trip is more than two standard deviations above the mean: unusual by the |Z| > 2 rule."
  }
]
```

## Q3 (3 marks). CPU temperatures under load

The CPU temperatures of 400 laptops in a COMP lab, measured under a full load, have mean 72 °C and standard deviation 6 °C.

```quiz
[
  {
    "q": "**Q3a (1 mark).** Without assuming any shape, at least what percentage of the laptops have a temperature between 57 °C and 87 °C? (percent)",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0.5,
    "unit": "%",
    "explain": "57 and 87 are 15 °C from the mean, so k = 15/6 = 2.5 standard deviations. Chebyshev's theorem: at least (1 − 1/k²) × 100 % = (1 − 1/2.5²) × 100 % = (1 − 1/6.25) × 100 % = (1 − 0.16) × 100 % = **84 %**."
  },
  {
    "q": "**Q3b (1 mark).** So at least how many of the 400 laptops are between 57 °C and 87 °C?",
    "type": "numeric",
    "answer": 336,
    "tolerance": 0.5,
    "unit": "laptops",
    "explain": "0.84 × 400 = **336 laptops** at least. Chebyshev gives a minimum for any distribution; the true count may be higher."
  },
  {
    "q": "**Q3c (1 mark).** If the temperatures are bell-shaped, about how many of the 400 laptops are between 60 °C and 84 °C?",
    "type": "numeric",
    "answer": 380,
    "tolerance": 0.5,
    "unit": "laptops",
    "explain": "60 and 84 are 72 ∓ 12, two standard deviations from the mean. Empirical rule: about 95 % of a bell-shaped distribution is within two standard deviations, so 0.95 × 400 = **380 laptops**. Chebyshev at k = 2 only promises 75 % (300 laptops); the extra 20 percentage points come from assuming the bell shape."
  }
]
```

## Q4 (4 marks). Response times of 11 API calls

The response times (ms) of 11 calls to a COMP 4537 web API, sorted:

42, 45, 47, 48, 50, 52, 53, 55, 57, 60, 91

```quiz
[
  {
    "q": "**Q4a (1 mark, part 1).** Five-number summary by the hand method: Q1 = ? (ms)",
    "type": "numeric",
    "answer": 47,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "n = 11 is odd, so the median is the 6th value, 52, and it is left out of both halves. Lower half 42, 45, 47, 48, 50: its middle value is **Q1 = 47**. Five-number summary: min 42, Q1 47, median 52, Q3 57, max 91. R's `quantile()` interpolates and prints 47.5 here; both are valid definitions, and the hand method is the one to show on paper."
  },
  {
    "q": "**Q4a (1 mark, part 2).** Q3 by the hand method? (ms)",
    "type": "numeric",
    "answer": 57,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "Upper half, with the median 52 left out: 53, 55, 57, 60, 91. Its middle value is **Q3 = 57**. (R's `quantile()` gives 56.)"
  },
  {
    "q": "**Q4b (1 mark).** IQR = ? (ms)",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "IQR = Q3 − Q1 = 57 − 47 = **10 ms**, the width of the box. The range, 91 − 42 = 49, is a different measure."
  },
  {
    "q": "**Q4c (1 mark, part 1).** Upper fence = ? (ms)",
    "type": "numeric",
    "answer": 72,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "Upper fence = Q3 + 1.5 × IQR = 57 + 1.5(10) = 57 + 15 = **72 ms**."
  },
  {
    "q": "**Q4c (1 mark, part 2).** Lower fence = ? (ms)",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "Lower fence = Q1 − 1.5 × IQR = 47 − 15 = **32 ms**."
  },
  {
    "q": "**Q4d (1 mark).** Which value, if any, is an outlier? Type the value, or none.",
    "type": "text",
    "answer": ["91", "91 ms"],
    "explain": "**91 ms** is above the upper fence of 72 ms, so it is an outlier. Every other value lies between the fences 32 and 72. On a boxplot the upper whisker would stop at 60 and 91 would be drawn as a separate point."
  }
]
```

## Q5 (4 marks). Codes, committees and hands

```quiz
[
  {
    "q": "**Q5a (1 mark).** The door of a BCIT lab uses a 4-digit code (digits 0 to 9) in which no digit is repeated. How many codes are possible?",
    "type": "numeric",
    "answer": 5040,
    "tolerance": 0.5,
    "unit": "codes",
    "explain": "Order matters (1234 and 4321 are different codes) and there is no repetition, so this is a permutation: P(10, 4) = 10!/(10 − 4)! = 10 × 9 × 8 × 7 = **5040 codes**. Allowing repeats would give 10⁴ = 10 000."
  },
  {
    "q": "**Q5b (1 mark).** A 3-person organizing committee is chosen from 9 CST student representatives. How many committees are possible?",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0.5,
    "unit": "committees",
    "explain": "A committee has no order, so this is a combination: C(9, 3) = 9!/((9 − 3)! 3!) = (9 × 8 × 7)/(3 × 2 × 1) = 504/6 = **84 committees**. P(9, 3) = 504 counts each committee 3! = 6 times."
  },
  {
    "q": "**Q5c (2 marks).** A 5-card hand is dealt from a standard deck. What is the probability that it contains **exactly 2 hearts**? (4 decimals)",
    "type": "numeric",
    "answer": 0.2743,
    "tolerance": 0.0001,
    "explain": "Hands with exactly 2 hearts over all hands: choose the 2 hearts from 13 and the other 3 cards from the 39 non-hearts.\n\nP = C(13, 2) · C(39, 3) / C(52, 5) = 78 × 9139 / 2 598 960 = 712 842 / 2 598 960 = **0.2743**.\n\nThis is the hypergeometric three-C formula. The with-replacement binomial C(5,2)(0.25)²(0.75)³ = 0.2637 is a different experiment."
  }
]
```

## Q6 (4 marks). Linux users by term

A survey of 200 CST students recorded their term and whether Linux is their main operating system:

| | Linux | Not Linux | Total |
|---|---|---|---|
| Term 1 | 18 | 62 | 80 |
| Term 2 | 24 | 46 | 70 |
| Term 3 | 22 | 28 | 50 |
| Total | 64 | 136 | 200 |

One student is chosen at random. Let L: Linux is their main OS; T: they are in Term 3.

```quiz
[
  {
    "q": "**Q6a (1 mark).** P(L) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.32,
    "tolerance": 0.0001,
    "explain": "P(L) = 64/200 = **0.3200**, the Linux column total over the grand total."
  },
  {
    "q": "**Q6b (1 mark).** P(L | T), the probability that a Term 3 student uses Linux? (4 decimals)",
    "type": "numeric",
    "answer": 0.44,
    "tolerance": 0.0001,
    "explain": "Given T, restrict to the Term 3 row: P(L | T) = P(L ∩ T)/P(T) = (22/200)/(50/200) = 22/50 = **0.4400**. Dividing by the Linux total instead, 22/64 = 0.3438, is P(T | L)."
  },
  {
    "q": "**Q6c (1 mark).** Are L and T independent? Justify on paper, then type Yes or No.",
    "type": "text",
    "answer": ["No", "no"],
    "explain": "**No.** L and T are independent only if P(L | T) = P(L). Here P(L | T) = 0.44 but P(L) = 0.32, so knowing a student is in Term 3 changes the probability they use Linux. Equivalently P(L ∩ T) = 22/200 = 0.11 is not P(L)P(T) = 0.32 × 0.25 = 0.08."
  },
  {
    "q": "**Q6d (1 mark).** P(L ∪ T), the probability that the student uses Linux or is in Term 3? (4 decimals)",
    "type": "numeric",
    "answer": 0.46,
    "tolerance": 0.0001,
    "explain": "L and T are not mutually exclusive (22 students are both), so use the general addition rule: P(L ∪ T) = P(L) + P(T) − P(L ∩ T) = 64/200 + 50/200 − 22/200 = 92/200 = **0.4600**. Leaving out the overlap gives 114/200 = 0.57."
  }
]
```

## Q7 (5 marks). Retransmitted packets

On a congested Wi-Fi link, each packet independently needs to be retransmitted with probability 0.18. A device sends 12 packets. Let X = the number of the 12 packets that need retransmission.

```quiz
[
  {
    "q": "**Q7a (1 mark).** Select every condition that makes X binomial here.",
    "options": ["a fixed number of trials: n = 12 packets", "each packet either needs retransmission or does not", "the same probability, 0.18, for every packet", "packets need retransmission independently of each other", "the packets are drawn without replacement from a small batch", "the count stops at the first retransmitted packet"],
    "answer": [0, 1, 2, 3],
    "explain": "The four binomial conditions: fixed n, success or failure on each trial, equal p, independent trials. Drawing without replacement from a small batch is the hypergeometric setting, and stopping at the first success is the geometric one."
  },
  {
    "q": "**Q7b (1 mark).** P(X = 3) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.2151,
    "tolerance": 0.0001,
    "explain": "Binomial with n = 12, p = 0.18, q = 0.82: P(x) = C(n, x) p^x q^(n−x).\n\nP(X = 3) = C(12, 3)(0.18)³(0.82)⁹ = 220 × 0.005832 × 0.167620 = **0.2151**.\n\nWithout C(12, 3) you get one particular order of the 3 retransmissions, 0.0010."
  },
  {
    "q": "**Q7c (1 mark).** P(X ≥ 2) by the complement rule? (4 decimals)",
    "type": "numeric",
    "answer": 0.6641,
    "tolerance": 0.0001,
    "explain": "P(X ≥ 2) = 1 − P(X ≤ 1) = 1 − [P(0) + P(1)].\n\nP(0) = 0.82¹² = 0.0924201; P(1) = C(12, 1)(0.18)(0.82)¹¹ = 0.243448.\n\nP(X ≥ 2) = 1 − (0.0924201 + 0.243448) = **0.6641**. Subtracting only P(0) gives 0.9076, which is P(X ≥ 1)."
  },
  {
    "q": "**Q7d (1 mark, part 1).** μ = ? (expected number of retransmissions)",
    "type": "numeric",
    "answer": 2.16,
    "tolerance": 0.01,
    "explain": "μ = np = 12 × 0.18 = **2.16** packets."
  },
  {
    "q": "**Q7d (1 mark, part 2).** σ = ? (2 decimals)",
    "type": "numeric",
    "answer": 1.33,
    "tolerance": 0.05,
    "explain": "σ = √(npq) = √(12 × 0.18 × 0.82) = √1.7712 = **1.33** packets. Stopping at npq gives the variance, 1.77."
  },
  {
    "q": "**Q7e (1 mark).** On one burst, 7 of the 12 packets needed retransmission. Compute Z. (2 decimals)",
    "type": "numeric",
    "answer": 3.64,
    "tolerance": 0.05,
    "explain": "Z = (x − μ)/σ = (7 − 2.16)/1.33086 = 4.84/1.33086 = **3.64**. Dividing by the variance 1.77 instead of σ gives 2.73."
  },
  {
    "q": "Q7e: 7 retransmissions out of 12 is unusual if the link's rate is really 0.18.",
    "type": "tf",
    "answer": true,
    "explain": "**TRUE.** Z = 3.64 is beyond 2, so 7 retransmissions is unusual; it suggests the link was worse than 18 % during that burst."
  }
]
```

## Q8 (4 marks). Faulty USB drives

A box of 40 USB drives from a surplus sale contains 6 faulty drives. A COMP 2721 lab takes 5 drives at random, without replacement. Let X = the number of faulty drives among the 5.

```quiz
[
  {
    "q": "**Q8a (1 mark).** P(X = 1) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.4229,
    "tolerance": 0.0001,
    "explain": "Hypergeometric (without replacement from a finite population) with N = 40, K = 6, n = 5: P(x) = C(K, x) C(N − K, n − x)/C(N, n).\n\nP(X = 1) = C(6, 1) C(34, 4)/C(40, 5) = 6 × 46 376 / 658 008 = 278 256 / 658 008 = **0.4229**.\n\nIn R: `dhyper(1, 6, 34, 5)`."
  },
  {
    "q": "**Q8b (1 mark).** μ, the expected number of faulty drives among the 5? (3 significant digits)",
    "type": "numeric",
    "answer": 0.75,
    "tolerance": 0.01,
    "explain": "μ = n·K/N = 5 × 6/40 = **0.750** drives."
  },
  {
    "q": "**Q8c (1 mark).** True or false: the binomial with p = 6/40 is a good approximation for this box.",
    "type": "tf",
    "answer": false,
    "explain": "**FALSE.** The 5 % rule allows the binomial only when n ≤ 5 % of N. Here n/N = 5/40 = 12.5 %, so each draw changes the probability noticeably and the hypergeometric is needed. (The binomial gives 0.3915 against the exact 0.4229.)"
  },
  {
    "q": "**Q8d (1 mark).** The department's warehouse holds 2000 drives, 300 of them faulty, and 5 are taken at random. Use the binomial approximation for P(X = 1). (4 decimals)",
    "type": "numeric",
    "answer": 0.3915,
    "tolerance": 0.0001,
    "explain": "n/N = 5/2000 = 0.25 % ≤ 5 %, so the binomial with p = K/N = 300/2000 = 0.15 applies.\n\nP(X = 1) = C(5, 1)(0.15)(0.85)⁴ = 5 × 0.15 × 0.522006 = **0.3915**.\n\nThe exact hypergeometric, `dhyper(1, 300, 1700, 5)`, is 0.3921: close, as the 5 % rule promises."
  }
]
```

## Q9 (3 marks). Booking a library study room

Each attempt to book a study room online at the busiest time succeeds with probability 0.35, independently of other attempts. Let X = the number of attempts up to and including the first success.

```quiz
[
  {
    "q": "**Q9a (1 mark).** P(X = 4), the first success on the fourth attempt? (4 decimals)",
    "type": "numeric",
    "answer": 0.0961,
    "tolerance": 0.0001,
    "explain": "Geometric: trials up to the first success, P(x) = q^(x−1) p with p = 0.35, q = 0.65.\n\nP(X = 4) = 0.65³ × 0.35 = 0.274625 × 0.35 = **0.0961**: three failures, then the success. The exponent is x − 1 = 3; using 0.65⁴ gives 0.0625, which is P(X = 5)."
  },
  {
    "q": "**Q9b (1 mark).** P(X ≥ 4), needing at least four attempts? (4 decimals)",
    "type": "numeric",
    "answer": 0.2746,
    "tolerance": 0.0001,
    "explain": "Complement rule: P(X ≥ 4) = 1 − [P(1) + P(2) + P(3)] = 1 − [0.35 + 0.65(0.35) + 0.65²(0.35)] = 1 − (0.35 + 0.2275 + 0.147875) = 1 − 0.725375 = **0.2746**.\n\nShortcut: X ≥ 4 means the first three attempts all failed, 0.65³ = 0.274625."
  },
  {
    "q": "**Q9c (1 mark).** μ, the expected number of attempts? (3 significant digits)",
    "type": "numeric",
    "answer": 2.86,
    "tolerance": 0.05,
    "unit": "attempts",
    "explain": "μ = 1/p = 1/0.35 = **2.86 attempts**. q/p = 1.86 is the mean number of failures before the success, R's convention, not the course's."
  }
]
```

## Q10 (4 marks). Lost-laptop reports

BCIT Lost and Found receives on average 292 lost-laptop reports per year (365 days). Assume reports arrive independently and with equal likelihood on any day.

```quiz
[
  {
    "q": "**Q10a (1 mark).** λ, the mean number of reports per day?",
    "type": "numeric",
    "answer": 0.8,
    "tolerance": 0.001,
    "unit": "per day",
    "explain": "Let X = the number of lost-laptop reports in one day. X is Poisson with λ = 292/365 = **0.8** reports per day."
  },
  {
    "q": "**Q10b (1 mark).** P(X = 0), no reports on a given day? (4 decimals)",
    "type": "numeric",
    "answer": 0.4493,
    "tolerance": 0.0001,
    "explain": "P(X = x) = e^(−λ) λ^x / x!, so P(0) = e^(−0.8)(0.8)⁰/0! = e^(−0.8) = **0.4493**."
  },
  {
    "q": "**Q10c (1 mark).** P(X ≥ 2), at least two reports on a given day? (4 decimals)",
    "type": "numeric",
    "answer": 0.1912,
    "tolerance": 0.0001,
    "explain": "P(X ≥ 2) = 1 − [P(0) + P(1)] = 1 − [e^(−0.8) + 0.8e^(−0.8)] = 1 − 1.8(0.449329) = 1 − 0.808792 = **0.1912**."
  },
  {
    "q": "**Q10d (1 mark).** P(exactly 1 report on Monday and exactly 1 on Tuesday)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1292,
    "tolerance": 0.0001,
    "explain": "The two days are independent intervals, so multiply: P(1) = 0.8e^(−0.8) = 0.359463, and P(1 on Monday) · P(1 on Tuesday) = 0.359463² = **0.1292**.\n\nP(exactly 2 over the two days), with λ = 1.6, is 0.2584; it also counts 2 on Monday and 0 on Tuesday."
  }
]
```

## Q11 (4 marks). R commands for Q7, Q9, Q10 and a data frame

Write a single R command for each part. The data frame in part d is `ChickWeight` (built into R): `weight` (body weight in grams), `Time` (days since birth), `Chick` (the chick's id) and `Diet` (which of four diets, 1 to 4).

```quiz
[
  {
    "q": "**Q11a (1 mark, part 1).** For Q7 (n = 12, p = 0.18), a command that computes P(X = 3). Write it on paper, then type the function name.",
    "type": "text",
    "answer": ["dbinom"],
    "explain": "`dbinom(3, 12, 0.18)` returns 0.215063, the 0.2151 of Q7b. The slots are x, size n, prob p."
  },
  {
    "q": "**Q11a (1 mark, part 2).** For Q7, a command that computes P(X ≥ 2). Fill the blank.",
    "type": "fill",
    "code": "1 - pbinom(___, 12, 0.18)",
    "answer": ["1"],
    "explain": "At least 2 is the complement of at most 1: `1 - pbinom(1, 12, 0.18)` = 0.664132, the 0.6641 of Q7c. OR `pbinom(1, 12, 0.18, lower.tail = FALSE)`."
  },
  {
    "q": "**Q11b (1 mark).** For Q10 (0.8 reports per day), a command that computes the probability of **at most 3 reports over two consecutive days**. Fill the λ slot.",
    "type": "fill",
    "code": "ppois(3, ___)",
    "answer": ["2*0.8", "1.6", "0.8*2", "2 * 0.8"],
    "explain": "Over two days λ = 2 × 0.8 = 1.6: `ppois(3, 2*0.8)`. At most 3 in total is one interval of two days; `ppois(3, 0.8)^2` would be at most 3 on each day, a different event."
  },
  {
    "q": "Q11b: the value `ppois(3, 2*0.8)` returns. (4 decimals)",
    "type": "numeric",
    "answer": 0.9212,
    "tolerance": 0.0001,
    "explain": "P(X ≤ 3) with λ = 1.6 = e^(−1.6)(1 + 1.6 + 1.6²/2 + 1.6³/6) = 0.201897 × 4.562667 = **0.9212**. The each-day version `ppois(3, 0.8)^2` is 0.9819."
  },
  {
    "q": "**Q11c (1 mark).** For Q9 (p = 0.35), a command that computes the probability the room is booked **within the first 5 attempts**. Fill the blank.",
    "type": "fill",
    "code": "pgeom(___, 0.35)",
    "answer": ["5-1", "4", "5 - 1"],
    "explain": "The course counts trials; R's `pgeom` counts failures before the first success. Within 5 attempts means at most 4 failures: `pgeom(5-1, 0.35)` = 1 − 0.65⁵ = 0.8840. `pgeom(5, 0.35)` = 0.9246 is within 6 attempts."
  },
  {
    "q": "**Q11d (1 mark, part 1).** A command that prints the summary statistics (min, Q1, median, Q3, max, mean, sd, n) of `weight` for each `Diet`. Write it on paper, then type the function name.",
    "type": "text",
    "answer": ["favstats"],
    "explain": "`library(mosaic)`\n`favstats(weight ~ Diet, data = ChickWeight)`\nThe measured variable goes on the left of `~`, the grouping variable on the right, and `data =` names the frame."
  },
  {
    "q": "**Q11d (1 mark, part 2).** A command that draws a histogram of all the chick weights. Type the function name.",
    "type": "text",
    "answer": ["histogram", "hist"],
    "explain": "`library(mosaic)`\n`histogram(~ weight, data = ChickWeight)`\nOR base R `hist(ChickWeight$weight)`. A one-variable formula has nothing on the left of `~`."
  }
]
```

## Q12 (4 marks). Failed nightly builds and a laptop-protection plan

The number of failed nightly builds per week for a team's project has this distribution:

| x | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| P(x) | 0.30 | 0.35 | 0.20 | 0.10 | 0.05 |

```quiz
[
  {
    "q": "**Q12a (2 marks, part 1).** μ, the expected number of failed builds per week?",
    "type": "numeric",
    "answer": 1.25,
    "tolerance": 0.01,
    "explain": "μ = Σ[x P(x)] = 0(0.30) + 1(0.35) + 2(0.20) + 3(0.10) + 4(0.05) = 0.35 + 0.40 + 0.30 + 0.20 = **1.25** failed builds per week."
  },
  {
    "q": "**Q12a (2 marks, part 2).** σ by the shortcut formula σ² = Σ[x² P(x)] − μ². (3 significant digits)",
    "type": "numeric",
    "answer": 1.13,
    "tolerance": 0.05,
    "explain": "Σ[x² P(x)] = 0(0.30) + 1(0.35) + 4(0.20) + 9(0.10) + 16(0.05) = 0.35 + 0.80 + 0.90 + 0.80 = 2.85.\n\nσ² = 2.85 − 1.25² = 2.85 − 1.5625 = 1.2875; σ = √1.2875 = **1.13**.\n\nThe long form Σ(x − μ)²P(x) gives the same 1.2875. Forgetting to subtract μ² gives √2.85 = 1.69."
  },
  {
    "q": "**Q12b (1 mark).** A laptop-protection plan charges a $95 annual premium and pays 1200 dollars if the laptop is lost or destroyed; the probability of a claim in a year is 0.045. What is the plan's expected profit per policy per year? (dollars)",
    "type": "numeric",
    "answer": 41.00,
    "tolerance": 0.01,
    "unit": "$",
    "explain": "Let X = the plan's net gain on one policy. With no claim it keeps the premium, 95 (probability 0.955); with a claim it nets 95 − 1200 = −1105 (probability 0.045).\n\nE(X) = 95(0.955) + (−1105)(0.045) = 90.725 − 49.725 = 41.00, the same as premium − payout × P(claim) = 95 − 1200(0.045) = 95 − 54. **The plan expects to gain $41.00 per policy**, which is an expected cost of −41.00 to the plan."
  },
  {
    "q": "**Q12c (1 mark).** What premium would give the plan an expected profit of exactly $25 per policy? (dollars)",
    "type": "numeric",
    "answer": 79.00,
    "tolerance": 0.01,
    "unit": "$",
    "explain": "Expected profit = premium − 1200(0.045) = premium − 54. Setting premium − 54 = 25 gives a **premium of $79.00**. Check: 79 − 54 = 25."
  }
]
```
