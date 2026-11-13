---
title: "Mock Quiz 8 B: new contexts, the same shapes"
minutes: 50
---
<!-- facts: none; a second timed mock: an exponential story from a rate on paper, a new normal product in RStudio -->
A second full Quiz 8: one paper story that starts from a rate, then an RStudio template on a normal measurement in the shape of Lab 8's battery voltages.

:::quiz Timing
25 minutes for Part 1 on paper with a calculator, 25 for Part 2 on paper or in RStudio. Name X in words, give its distribution and parameters, sketch and shade, write the formula, the substituted line, and the boxed number; a probability to 4 decimals, μ, σ, Z and a time to 2.
:::

## Part 1 on paper: one story, three questions, 10 marks

> **Premise.** Students arrive at random at the BCIT library's research help desk, at an average of 8 per hour. Let X = the waiting time between one arrival and the next, in minutes. Model X as an exponential random variable.
>
> **Q1 [4 marks].**
>
> a. [1] Find the mean waiting time β between arrivals, in minutes.
>
> b. [2] What is the probability that the next student arrives within 6 minutes?
>
> c. [1] What is the probability that the wait for the next student is longer than 10 minutes?
>
> **Q2 [3 marks].**
>
> a. [2] Find the 90th percentile of the waiting time.
>
> b. [1] Find the standard deviation of the waiting time.
>
> **Q3 [3 marks].**
>
> a. [2] The librarian has already waited 4 minutes with no student arriving. What is the probability that the total wait is between 9 and 14 minutes?
>
> b. [1] A staff member walks the floor once every 25 minutes. A student looks up at a random moment, so the time W until the next walk-through is uniform on 0 to 25 minutes. What is the probability that W is more than 18 minutes?

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Exponential: $f(x) = \dfrac{1}{\beta}e^{-x/\beta},\ x \ge 0$; $F(x) = 1 - e^{-x/\beta}$; $\mu = \beta$; $\sigma^2 = \beta^2$
- Uniform: $f(x) = \dfrac{1}{b-a},\ a \le x \le b$; $F(x) = \dfrac{x-a}{b-a},\ x \ge a$
- Both events: $P(A \cap B) = P(A)\cdot P(B \mid A)$

**Not on the sheet, so know it:**

- $\beta = 1/\text{rate}$, in the question's time unit: a rate per hour gives β in hours until you convert.
- $P(X > x) = 1 - F(x) = e^{-x/\beta}$; $P(a \le X \le b) = F(b) - F(a)$.
- An exponential percentile: $x = -\beta\ln(1-p)$.
- $\sigma$ is the square root of the sheet's $\sigma^2$, so $\sigma = \beta$.
- **Memoryless:** time already waited does not count. Subtract it from every bound and answer as if starting fresh.
:::

```quiz
[
  {
    "q": "**Q1a (1 mark).** Arrivals at an average of 8 per hour. The mean wait between arrivals, β, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 7.5,
    "tolerance": 0.01,
    "explain": "Let X = the waiting time between one arrival and the next, in minutes. X is exponential, and its mean β is the average time per arrival. The question wants minutes, so turn the hour into 60 minutes first. $$\\beta = \\dfrac{\\underbrace{60}_{\\text{minutes in an hour}}}{\\underbrace{8}_{\\text{arrivals per hour}}} = \\mathbf{7.50 \\text{ minutes}}$$ $\\beta = 1/8$ is also right, but in hours; every later formula would then need x in hours."
  },
  {
    "q": "**Q1b (2 marks).** Same desk. P(the next student arrives within 6 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.5507,
    "tolerance": 0.0001,
    "explain": "X is exponential with $\\beta = 7.5$ minutes, the mean wait, and $x = 6$ minutes, the wait asked about. Sketch a curve that starts high at 0 and falls, and shade from 0 to 6. Within 6 minutes is the area to the left, the cdf: $$F(x) = 1 - e^{-x/\\beta}$$ $$P(X \\le 6) = 1 - e^{-\\underbrace{6}_{\\text{wait asked}}/\\underbrace{7.5}_{\\text{mean wait}}} = 1 - \\underbrace{e^{-0.8}}_{\\text{wait longer than 6}} = 1 - 0.449329 = \\mathbf{0.5507}$$ In R, `pexp(6, rate=1/7.5)`."
  },
  {
    "q": "**Q1c (1 mark).** Same desk. P(the wait is longer than 10 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2636,
    "tolerance": 0.0001,
    "explain": "Longer than 10 is the right tail: the whole area 1 minus $F(10)$, which leaves $e^{-x/\\beta}$. $$P(X > 10) = 1 - F(10) = e^{-\\underbrace{10}_{\\text{wait asked}}/\\underbrace{7.5}_{\\text{mean wait}}} = e^{-1.333333} = \\mathbf{0.2636}$$ In R, `1 - pexp(10, rate=1/7.5)`."
  },
  {
    "q": "**Q2a (2 marks).** Same desk. The 90th percentile of the waiting time, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 17.27,
    "tolerance": 0.01,
    "explain": "The 90th percentile is the wait with 0.90 of the area to its left: solve $F(x) = 0.90$ for x. $$1 - e^{-x/\\underbrace{7.5}_{\\text{mean wait}}} = \\underbrace{0.90}_{\\text{area to the left}}$$ Move the 1 across: $e^{-x/7.5} = 1 - 0.90 = 0.10$. Take ln, the key that undoes $e^x$: $-x/7.5 = \\ln(0.10)$. Multiply by −7.5: $$x = -\\beta\\ln(1 - p) = -\\underbrace{7.5}_{\\text{mean wait}} \\times \\ln(1 - \\underbrace{0.90}_{\\text{area to the left}}) = -7.5 \\times (-2.302585) = \\mathbf{17.27 \\text{ minutes}}$$ 90 % of waits are shorter than 17.27 minutes. In R, `qexp(0.90, rate=1/7.5)`."
  },
  {
    "q": "**Q2b (1 mark).** Same desk. The standard deviation of the waiting time, in minutes? (2 decimals)",
    "type": "numeric",
    "answer": 7.5,
    "tolerance": 0.01,
    "explain": "The sheet gives the variance $\\sigma^2 = \\beta^2$. Take the root: $$\\sigma = \\sqrt{\\beta^2} = \\beta = \\underbrace{7.5}_{\\text{mean wait}} = \\mathbf{7.50 \\text{ minutes}}$$ For an exponential the standard deviation equals the mean. Answering 56.25 gives the variance."
  },
  {
    "q": "**Q3a (2 marks).** Same desk. The librarian has already waited 4 minutes with no arrival. P(the total wait is between 9 and 14 minutes)? (4 decimals)",
    "type": "numeric",
    "answer": 0.2498,
    "tolerance": 0.0001,
    "explain": "This is a conditional probability: P(9 ≤ X ≤ 14 given X ≥ 4). Every wait between 9 and 14 is also at least 4, so the and-event is just 9 to 14: $$P(A \\mid B) = \\dfrac{P(A \\cap B)}{P(B)} = \\dfrac{\\underbrace{P(9 \\le X \\le 14)}_{\\text{total wait 9 to 14}}}{\\underbrace{P(X \\ge 4)}_{\\text{already waited 4}}}$$ Between is $e^{-a/\\beta} - e^{-b/\\beta}$ and at least is $e^{-x/\\beta}$: $$\\dfrac{\\underbrace{e^{-9/7.5}}_{\\text{longer than 9}} - \\underbrace{e^{-14/7.5}}_{\\text{longer than 14}}}{\\underbrace{e^{-4/7.5}}_{\\text{longer than 4}}} = \\dfrac{0.301194 - 0.154638}{0.586646} = \\dfrac{0.146556}{0.586646} = \\mathbf{0.2498}$$ The memoryless shortcut gives the same: subtract the 4 minutes already waited from both bounds and start fresh, 5 to 10 minutes: $$P(5 \\le X \\le 10) = \\underbrace{e^{-5/7.5}}_{\\text{longer than 5}} - \\underbrace{e^{-10/7.5}}_{\\text{longer than 10}} = 0.513417 - 0.263597 = \\mathbf{0.2498}$$ In R, `(pexp(14, rate=1/7.5) - pexp(9, rate=1/7.5))/(1 - pexp(4, rate=1/7.5))`."
  },
  {
    "q": "**Q3b (1 mark).** W is uniform on 0 to 25 minutes. P(W > 18)? (4 decimals)",
    "type": "numeric",
    "answer": 0.28,
    "tolerance": 0.0001,
    "explain": "Let W = the time until the next walk-through, uniform with $a = 0$ minutes, the shortest wait, and $b = 25$ minutes, the longest. Sketch a flat rectangle from 0 to 25 with height $1/25 = 0.04$ and shade the strip from 18 to 25. Probability is the strip's width times the height: $$P(W > 18) = (\\underbrace{25}_{\\text{longest wait}} - \\underbrace{18}_{\\text{wait asked}}) \\times \\underbrace{\\dfrac{1}{25}}_{\\text{height } 1/(b-a)} = \\mathbf{0.2800}$$ In R, `1 - punif(18, 0, 25)`."
  }
]
```

## Part 2 in RStudio: filament diameters, 10 marks

The template below is the notebook's code chunk, in the shape of Lab 8's normal task. A BCIT maker lab buys 3D-printer filament whose diameter D is normal with mean 1.75 mm and standard deviation 0.02 mm. Every `Something` is yours to write; the marks for each part sit in its comment.

```r
# D = the diameter of the filament at a random point, in mm
mu <- 1.75
sig <- 0.02
# (a) P(D < 1.78)                                                      [1 mark]
Something
# (b) P(D > 1.73)                                                      [1 mark]
Something
# (c) P(1.71 < D < 1.80)                                               [2 marks]
Something
# (d) the diameter larger than 90% of filament,
#     and the diameter smaller than 90% of filament                    [2 marks]
D.big <- Something
D.small <- Something
# (e) simulate 10^5 diameters; the share between 1.71 and 1.80        [2 marks]
m.trials <- 10^5
D.vals <- Something
p.sim <- Something
# (f) the Z-scores of 1.71 and 1.80                                    [1 mark]
Z1 <- Something
Z2 <- Something
# (g) one sentence: compare p.sim with your answer to (c)              [1 mark]
```

:::info R syntax
| Code | What it does |
|---|---|
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `mu <- 1.75` | `<-` stores a value under a name: the mean diameter. |
| `sig <- 0.02` | Stores the standard deviation. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `D.big <- Something` and `D.small <- Something` | Store your two diameters for (d) under these names. The dot is part of the name. |
| `m.trials <- 10^5` | `^` raises to a power: 100 000, the number of values to simulate. |
| `D.vals <- Something` | Your vector of simulated diameters. |
| `p.sim <- Something` | Your simulated share for (e). |
| `Z1 <- Something` and `Z2 <- Something` | Store your two Z-scores under these names. |

**Left to right**

- `mu <- 1.75`: "Store under the name mu (`mu <-`) the number 1.75."
- `sig <- 0.02`: "Store under the name sig (`sig <-`) the number 0.02."
- `Something` in (a), (b), (c): "Your line (`Something`)."
- `D.big` and `D.small` lines: "Store under each name (`<-`) your expression (`Something`)."
- `m.trials <- 10^5`: "Store under the name m.trials (`m.trials <-`) 10 to the power (`^`) 5."
- `D.vals` and `p.sim` lines: "Store under each name (`<-`) your expression (`Something`)."
- `Z1` and `Z2` lines: "Store under each name (`<-`) your expression (`Something`)."

**Right to left**, the order R runs it

- `mu <- 1.75`: "Take 1.75 and store it as mu (`mu <-`)."
- `sig <- 0.02`: "Take 0.02 and store it as sig (`sig <-`)."
- `Something` in (a), (b), (c): "Run your line (`Something`) and print its value."
- `D.big` and `D.small` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `m.trials <- 10^5`: "Work out 10 to the 5th (`10^5`) and store it as m.trials (`m.trials <-`)."
- `D.vals` and `p.sim` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `Z1` and `Z2` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
:::

Check the template one slot at a time. Every Z in this task is exact to two decimals, so the table and R agree to 4 decimals.

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- `pnorm` and the Z table both give the area to the left; right tail is 1 minus it; between is big minus small.
- A percentile goes backwards: the area to the left of the value comes first, then the value.
- Every R function name and its argument order: nothing in RStudio is on the sheet.
:::

```quiz
[
  {
    "type": "fill",
    "q": "**Part 2 (a) (1 mark).** P(D < 1.78), with `mu` and `sig` defined in the template. Fill the variable name.",
    "code": "pnorm(1.78, mean=mu, sd=___)",
    "answer": ["sig"],
    "explain": "The full line: `pnorm(1.78, mean=mu, sd=sig)`. `pnorm(q, mean, sd)` takes the standard deviation, so the variance 0.0004 would be wrong. R prints 0.9332. By table: $$Z = \\dfrac{\\underbrace{1.78}_{\\text{diameter asked}} - \\underbrace{1.75}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = 1.50 \\qquad P(Z < 1.50) = \\underbrace{0.9332}_{\\text{row 1.5, column .00}}$$"
  },
  {
    "type": "fill",
    "q": "**Part 2 (b) (1 mark).** P(D > 1.73), without writing `1 -`. Fill the logical value.",
    "code": "pnorm(1.73, mean=mu, sd=sig, lower.tail=___)",
    "answer": ["FALSE", "F"],
    "explain": "The full line: `pnorm(1.73, mean=mu, sd=sig, lower.tail=FALSE)`, the same value as `1 - pnorm(1.73, mean=mu, sd=sig)`. `lower.tail=FALSE` returns the area to the right. R prints 0.8413. By table: $$Z = \\dfrac{\\underbrace{1.73}_{\\text{diameter asked}} - \\underbrace{1.75}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = -1.00 \\qquad P(Z > -1.00) = 1 - \\underbrace{0.1587}_{\\text{table at } -1.00} = \\mathbf{0.8413}$$"
  },
  {
    "type": "fill",
    "q": "**Part 2 (c) (1 of 2 marks), the line.** P(1.71 < D < 1.80). Fill the bound in the first call.",
    "code": "pnorm(___, mu, sig) - pnorm(1.71, mu, sig)",
    "answer": ["1.80", "1.8"],
    "explain": "The full line: `pnorm(1.80, mu, sig) - pnorm(1.71, mu, sig)`. Between is everything left of the upper bound minus everything left of the lower bound, so the bigger value goes first. The positional slots are q, mean, sd in that order."
  },
  {
    "q": "**Part 2 (c) (1 of 2 marks), the value.** What does the line in (c) print? Work it by table. (4 decimals)",
    "type": "numeric",
    "answer": 0.971,
    "tolerance": 0.0001,
    "explain": "D is normal with $\\mu = 1.75$ mm the mean and $\\sigma = 0.02$ mm the standard deviation. One Z per bound: $$Z_1 = \\dfrac{\\underbrace{1.71}_{\\text{lower bound}} - \\underbrace{1.75}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = -2.00 \\qquad Z_2 = \\dfrac{\\underbrace{1.80}_{\\text{upper bound}} - \\underbrace{1.75}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = 2.50$$ $$P(1.71 < D < 1.80) = \\underbrace{0.9938}_{\\text{table at } 2.50} - \\underbrace{0.0228}_{\\text{table at } -2.00} = \\mathbf{0.9710}$$ Both Z values have exactly two decimals, so R prints the same 0.9710."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** The diameter larger than 90 % of filament. Fill the area, as a decimal.",
    "code": "D.big <- qnorm(___, mu, sig)",
    "answer": ["0.90", "0.9", ".9", ".90"],
    "explain": "The full line: `D.big <- qnorm(0.90, mu, sig)`. Larger than 90 % of filament means 90 % lies below it, so 0.90 is the area to the left. By table: $z = 1.28$, and $$x = \\underbrace{1.75}_{\\text{mean}} + \\underbrace{1.28}_{\\text{z for 0.90}} \\times \\underbrace{0.02}_{\\text{standard deviation}} = \\mathbf{1.7756 \\text{ mm}}$$ R prints 1.775631 (computed)."
  },
  {
    "type": "fill",
    "q": "**Part 2 (d) (1 of 2 marks).** The diameter smaller than 90 % of filament. Fill the area, as a decimal.",
    "code": "D.small <- qnorm(___, mu, sig)",
    "answer": ["0.10", "0.1", ".1", ".10"],
    "explain": "The full line: `D.small <- qnorm(0.10, mu, sig)`. Smaller than 90 % of filament means 90 % lies above it and only 10 % below, so the area to the left is 0.10: this is the 10th percentile, not the 90th. By table: $z = -1.28$, and $$x = \\underbrace{1.75}_{\\text{mean}} + \\underbrace{(-1.28)}_{\\text{z for 0.10}} \\times \\underbrace{0.02}_{\\text{standard deviation}} = \\mathbf{1.7244 \\text{ mm}}$$ R prints 1.724369 (computed)."
  },
  {
    "type": "fill",
    "q": "**Part 2 (e) (1 of 2 marks).** Simulate `m.trials` diameters. Fill the function name.",
    "code": "D.vals <- ___(m.trials, mean=mu, sd=sig)",
    "answer": ["rnorm"],
    "explain": "The full line: `D.vals <- rnorm(m.trials, mean=mu, sd=sig)`. `rnorm(n, mean, sd)` makes n random values from the bell; the first slot is how many values, 100 000 here."
  },
  {
    "type": "fill",
    "q": "**Part 2 (e) (1 of 2 marks).** The share of simulated diameters between 1.71 and 1.80. Fill the operator that joins the two conditions.",
    "code": "p.sim <- sum(D.vals > 1.71 ___ D.vals < 1.80)/m.trials",
    "answer": ["&"],
    "explain": "The full line: `p.sim <- sum(D.vals > 1.71 & D.vals < 1.80)/m.trials`. `&` is and, value by value: TRUE only when a diameter is above 1.71 and below 1.80. `sum()` counts the TRUEs and dividing by `m.trials` turns the count into a share. `|` would count values outside the band too: every value is above 1.71 or below 1.80."
  },
  {
    "q": "**Part 2 (f) (1 mark).** `Z2 <- (1.80 - mu)/sig`. What does R print for `Z2`? (2 decimals)",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.01,
    "explain": "The full lines: `Z1 <- (1.71 - mu)/sig` and `Z2 <- (1.80 - mu)/sig`. The brackets matter: without them R divides `mu` by `sig` first. $$Z_2 = \\dfrac{\\underbrace{1.80}_{\\text{upper bound}} - \\underbrace{1.75}_{\\text{mean}}}{\\underbrace{0.02}_{\\text{standard deviation}}} = \\mathbf{2.50}$$ Z1 is −2.00 the same way."
  },
  {
    "q": "**Part 2 (g) (1 mark).** Suppose `p.sim` prints 0.9712. The value changes a little on every run, because the simulated diameters are random. Which sentence is the right conclusion?",
    "options": [
      "The simulated share 0.9712 is very close to the theoretical 0.9710 from `pnorm`; with 100 000 values the two differ only in the fourth decimal, so the normal model and the simulation agree.",
      "The simulated share 0.9712 differs from 0.9710, so the diameters are not normal.",
      "The simulated share must equal 0.9710 exactly; a different value means the code has an error.",
      "The simulated share is larger, so 97.12 % of real spools are inside the band."
    ],
    "answer": 0,
    "explain": "`rnorm` makes new random values each run, so `p.sim` wanders a little around the true area 0.9710, and with 100 000 values it wanders only in the third or fourth decimal. A small gap is expected and says nothing against the model. The simulation is drawn from the model itself, so it says nothing about real spools either."
  }
]
```

The paper-side tables for all of this are on [the know-cold sheet](#/math3042-q8/know-cold-q8); the moves are taught in [any normal on paper](#/math3042-q8/normal-on-paper), [the table read backwards](#/math3042-q8/normal-backwards) and [exponential backwards and memoryless](#/math3042-q8/exponential-percentile-memoryless).
