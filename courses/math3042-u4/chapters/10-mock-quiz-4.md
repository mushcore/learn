---
title: Mock Quiz 4
minutes: 45
---

One long quiz covering Unit 4 (discrete distributions) and Lab 5 (conditional probability in R). Do it in one sitting with your calculator and no notes; 4 decimals for a probability, 2 for $\mu$, $\sigma$ and $Z$. Every explanation shows the arithmetic; a miss points back to its lesson and returns in the review queue.

:::quiz The quiz format
Part 1, paper and pencil, 10 marks: a probability table's $\mu$ and $\sigma$; one binomial, hypergeometric, geometric or Poisson probability with the conditions checked and the formula written out with the numbers in it; $\mu$ and $\sigma$ from the shortcut formulas; "is this value unusual?" by $Z$. Part 2, RStudio, 10 marks: the previous lab's skills on a new question. Quiz 4 Part 2 was Lab 4 (simulate a binomial match, `hist` with `breaks=seq(-0.5, n+0.5, by=1)`, `mean`, `sd`, decide unusual by $Z$ or by the tail), so Quiz 5 Part 2 is expected to be Lab 5.
:::

:::quiz A Lab 5 practice script for Quiz 5 Part 2
Import `SFU.Weather.with.Precip.csv`, drop the rows with a missing temperature or precipitation, segment the days, and answer with conditional probabilities. Replace every `Something`; the title's $n$ must be computed, not typed.
:::

```r
library(dplyr); library(mosaic)
SFU.Weather <- read.csv("SFU.Weather.with.Precip.csv", header=TRUE, na="NA",
                        colClasses=c("Date","integer","character","integer","numeric","numeric","numeric"))
# (a) keep only rows with both measurements          [2 marks]
SFU.Weather <- filter(SFU.Weather, Something)
nrow(SFU.Weather)
# (b) a wet day has any precipitation; a Weekend is Saturday or Sunday   [2 marks]
SFU.Weather$has.Precip <- Something
SFU.Weather$DoW <- weekdays(SFU.Weather$Date)
SFU.Weather$Weekend <- ifelse(SFU.Weather$DoW %in% c("Saturday","Sunday"), "Weekend", "Weekday")
# (c) two-way table and P(wet | Weekend) vs P(wet)     [3 marks]
tab <- table(SFU.Weather[c("Weekend","has.Precip")])
p.wet          <- Something
p.wet.weekend  <- Something
# (d) Bayes: P(Weekend | wet) from the row probabilities, then check it from the table   [2 marks]
p.weekend.wet  <- Something
# (e) pie of wet vs dry days with a computed n in the title   [1 mark]
pie(table(SFU.Weather$has.Precip), labels=c("Dry","Wet"),
    main=paste0("Days at SFU (n = ", Something, ")"))
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(dplyr); library(mosaic)` | `library()` loads a package; `;` separates two commands on one line. |
| `SFU.Weather <- read.csv(…)` | `<-` stores the data frame read from the CSV file. |
| `header=TRUE` | The file's first line holds the column names. |
| `na="NA"` | Reaches `read.table`'s `na.strings` argument by a unique abbreviation of its name: the text NA marks a missing value. |
| `colClasses=c("Date", …)` | `c()` combines one type name per column, in order. |
| `#` | Starts a comment: R ignores the rest of the line, including the marks in brackets. |
| `Something` | A placeholder for code you write; R would stop with an error if it ran as is. |
| `filter(SFU.Weather, Something)` | dplyr's `filter()` keeps the rows where the condition you write is TRUE. |
| `nrow(SFU.Weather)` | The number of rows. |
| `SFU.Weather$has.Precip <- Something` | `$` with a new name adds a column, filled by your expression. |
| `weekdays(SFU.Weather$Date)` | The day name of each date. |
| `SFU.Weather$DoW %in% c("Saturday","Sunday")` | `%in%` is TRUE for each row whose day is one of the two listed. |
| `ifelse(…, "Weekend", "Weekday")` | `ifelse(test, yes, no)`: "Weekend" where the test is TRUE, "Weekday" otherwise. |
| `table(SFU.Weather[c("Weekend","has.Precip")])` | A two-way table of counts: rows by Weekend, columns by has.Precip. |
| `p.wet          <- Something` | Stores your answer; the extra spaces only line the code up. |
| `pie(table(SFU.Weather$has.Precip), …)` | `pie()` draws one slice per count in the table. |
| `labels=c("Dry","Wet")` | The slice labels, in the table's order: FALSE comes before TRUE. |
| `main=paste0("Days at SFU (n = ", Something, ")")` | The title: `paste0()` joins the pieces with nothing between them, with your computed n in the middle. |

**Left to right**

- `library(dplyr); library(mosaic)`: "Load the package (`library`) dplyr, then (`;`) load (`library`) mosaic."
- `SFU.Weather <- read.csv(…)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the table read from the CSV file (`read.csv`) with a header line (`header=TRUE`), NA as missing (`na="NA"`) and the seven column types (`colClasses=c(…)`)."
- `SFU.Weather <- filter(SFU.Weather, Something)`: "Store under the name SFU.Weather (`SFU.Weather <-`) the rows kept (`filter`) where your condition (`Something`) holds."
- `nrow(SFU.Weather)`: "The number of rows (`nrow`) of SFU.Weather."
- `SFU.Weather$has.Precip <- Something`: "Store in a new column has.Precip (`SFU.Weather$has.Precip <-`) your expression (`Something`)."
- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Store in a new column DoW (`SFU.Weather$DoW <-`) the day name (`weekdays`) of each date (`SFU.Weather$Date`)."
- `SFU.Weather$Weekend <- ifelse(…)`: "Store in a new column Weekend (`SFU.Weather$Weekend <-`) Weekend if (`ifelse`) the day (`SFU.Weather$DoW`) is in (`%in%`) Saturday or Sunday (`c(…)`), otherwise Weekday."
- `tab <- table(…)`: "Store under the name tab (`tab <-`) the count table (`table`) of the Weekend and has.Precip columns (`SFU.Weather[c(…)]`)."
- `p.wet`, `p.wet.weekend`, `p.weekend.wet` lines: "Store under each name (`<-`) your expression (`Something`)."
- `pie(…)`: "Draw a pie (`pie`) of the tally (`table`) of has.Precip (`SFU.Weather$has.Precip`), labelled Dry and Wet (`labels=c(…)`), titled (`main=`) by joining (`paste0`) the text, your n (`Something`) and a closing bracket."

**Right to left**, the order R runs it

- `library(dplyr); library(mosaic)`: "Load dplyr (`library`), then load mosaic (`library`)."
- `SFU.Weather <- read.csv(…)`: "Combine the type names (`c`), read the file with them (`read.csv`, `header=TRUE`, `na="NA"`, `colClasses=`), and store the data frame (`SFU.Weather <-`)."
- `SFU.Weather <- filter(SFU.Weather, Something)`: "Evaluate your condition for each row (`Something`), keep the TRUE rows (`filter`), and store the result back (`SFU.Weather <-`)."
- `nrow(SFU.Weather)`: "Count the rows (`nrow`) and print."
- `SFU.Weather$has.Precip <- Something`: "Evaluate your expression (`Something`) and store it as the column has.Precip (`SFU.Weather$has.Precip <-`)."
- `SFU.Weather$DoW <- weekdays(SFU.Weather$Date)`: "Pull out the dates (`$Date`), name each day (`weekdays`), and store them as DoW (`SFU.Weather$DoW <-`)."
- `SFU.Weather$Weekend <- ifelse(…)`: "Combine the two day names (`c`), test each row's day against them (`%in%`), choose Weekend or Weekday (`ifelse`), and store the labels as Weekend (`SFU.Weather$Weekend <-`)."
- `tab <- table(…)`: "Keep the two columns (`[c(…)]`), count every combination (`table`), and store as tab (`tab <-`)."
- `p.wet`, `p.wet.weekend`, `p.weekend.wet` lines: "Evaluate your expression (`Something`), then store it under the name (`<-`)."
- `pie(…)`: "Compute your n (`Something`), join it into the title (`paste0`), count the dry and wet days (`table`), and draw the pie with the labels and title (`pie`, `labels=`, `main=`)."
:::

```quiz
[
  {"q": "A discrete random variable is one that has...", "options": ["any value in an interval", "only two values", "a finite or countable number of values", "a mean of zero"], "answer": 2, "explain": "Finite (number of 3s in 5 rolls) or countable (number of children: 0, 1, 2, …, a countable infinity). Values on a continuum are Unit 5."},
  {"q": "The two requirements for a discrete probability distribution are...", "options": ["$\\sum P(x) = 1$ and $0 \\le P(x) \\le 1$ for each $x$", "$\\mu = 0$ and $\\sigma = 1$", "$P(x)$ decreasing and $\\sum P(x) \\le 1$", "$P(x) > 0$ and $x \\ge 0$"], "answer": 0, "explain": "Every probability between 0 and 1, and the whole table adding to 1. A P(x) of 0 is allowed."},
  {"q": "Which table is a valid probability distribution for $x = 0, 1, 2, 3$?", "options": ["0.2, 0.3, 0.4, 0.2", "0.5, 0.3, 0.1, 0.1", "0.6, 0.5, −0.1, 0.0", "0.25, 0.25, 0.25, 0.15"], "answer": 1, "explain": "Only 0.5 + 0.3 + 0.1 + 0.1 = 1 with every entry in [0, 1]. The others sum to 1.1, contain −0.1, or sum to 0.9."},
  {"q": "The mean and standard deviation of a random variable are called the distribution's...", "options": ["statistics", "moments", "estimates", "parameters"], "answer": 3, "explain": "Parameters describe the population distribution; a sample's mean and sd are statistics that estimate them (the demo's sd(X.vals) of simulated values)."},
  {"q": "$x = 0, 1, 2, 3, 4$ with $P(x) = 0.10, 0.25, 0.35, 0.20, 0.10$. $\\mu$ = ? (2 decimals)", "type": "numeric", "answer": 1.95, "tolerance": 0.01, "explain": "0(0.10) + 1(0.25) + 2(0.35) + 3(0.20) + 4(0.10) = 0.25 + 0.70 + 0.60 + 0.40 = 1.95."},
  {"q": "Same table, $P(x) = 0.10, 0.25, 0.35, 0.20, 0.10$. $\\sigma$ = ? (2 decimals)", "type": "numeric", "answer": 1.12, "tolerance": 0.01, "explain": "σ² = (1.95)²(0.10) + (0.95)²(0.25) + (0.05)²(0.35) + (1.05)²(0.20) + (2.05)²(0.10) = 0.3803 + 0.2256 + 0.0009 + 0.2205 + 0.4203 = 1.2475; σ = 1.12."},
  {"q": "The expected value $E[X]$ must be one of the possible values of $X$.", "type": "tf", "answer": false, "explain": "The mean number of children is 0.94 and the mean die roll is 3.5; neither can occur. E[X] is the long-run average, not a typical outcome."},
  {"q": "The variance of a discrete random variable is...", "options": ["$\\sum x^2 P(x)$", "$\\sum (x - \\mu) P(x)$", "$\\sqrt{\\sum (x - \\mu)^2 P(x)}$", "$\\sum (x - \\mu)^2 P(x)$"], "answer": 3, "explain": "Squared deviations weighted by probability; σ is its square root. Σ (x − μ) P(x) is always 0."},
  {"q": "Select every condition a binomial experiment needs.", "options": ["a fixed number of trials $n$", "each trial has two outcomes, success or failure", "the trials continue until the first success", "the same probability $p$ on every trial", "the trials are independent", "a known rate $\\lambda$ per interval"], "answer": [0, 1, 3, 4], "explain": "Fixed n, Success/Failure, Equal p, Independence, in the notes' words. 'Until the first success' is geometric; a rate λ is Poisson."},
  {"q": "Which scenario is NOT binomial?", "options": ["50 website visitors, each buys with probability 0.25", "a die rolled 5 times, counting 3s", "5 cards drawn with replacement, counting Jacks", "5 cards drawn without replacement, counting Jacks"], "answer": 3, "explain": "Without replacement the probability of a Jack changes after each draw and the draws are dependent: that is the hypergeometric case."},
  {"q": "A shop's 12 customers each buy with probability 0.35. $P(X = 5)$ for the 12 customers = ? (4 decimals)", "type": "numeric", "answer": 0.2039, "tolerance": 0.0001, "explain": "C(12, 5) 0.35^5 0.65^7 = 792 × 0.005252 × 0.04902 = 0.2039; dbinom(5, 12, 0.35)."},
  {"q": "Write $P(X = 5)$ for the 12 customers ($p = 0.35$) as the binomial formula with the numbers substituted. Use C(n,x), ^ for powers, * between factors, no spaces.", "type": "text", "answer": ["C(12,5)*0.35^5*0.65^7", "C(12,5)*(0.35)^5*(0.65)^7", "12C5*0.35^5*0.65^7", "12C5*(0.35)^5*(0.65)^7", "choose(12,5)*0.35^5*0.65^7", "C(12,5)*0.35^5*(1-0.35)^7"], "explain": "nCx · p^x · q^(n−x) with n = 12, x = 5, q = 0.65: C(12,5)·0.35⁵·0.65⁷ = 0.2039. Seven failures, so q has exponent 7."},
  {"q": "The binomial formula for $P(x)$ is...", "options": ["$nCx \\cdot p^{n-x} \\cdot q^x$", "$nCx \\cdot p^x \\cdot q^{n-x}$", "$p^x \\cdot q^{n-x}$", "$nPx \\cdot p^x \\cdot q^{n-x}$"], "answer": 1, "explain": "x successes (p^x), n − x failures (q^(n−x)), and nCx = n!/((n−x)! x!) orders of them. Without nCx you have one particular sequence."},
  {"q": "A batch of 20 chips, each defective with probability 0.1 independently. P(at least one defective) among the 20 chips = ? (4 decimals)", "type": "numeric", "answer": 0.8784, "tolerance": 0.0001, "explain": "1 − P(0) = 1 − 0.9^20 = 1 − 0.1216 = 0.8784. 'At least one' is the complement of none."},
  {"q": "Printers: 10 % need repair in a year. Among 300 modified printers, 24 needed repair. $Z$ = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -1.15, "tolerance": 0.01, "explain": "μ = 300(0.1) = 30, σ = √(300 × 0.1 × 0.9) = √27 = 5.20; Z = (24 − 30)/5.20 = −1.15."},
  {"q": "Is 24 repairs out of 300 unusually low?", "options": ["No: $Z = -1.15$ is within $\\pm 2$, so the sample gives no good evidence the modifications helped", "Yes: 24 is below the mean of 30", "Yes: $Z$ is negative", "Cannot tell without the histogram"], "answer": 0, "explain": "Below the mean is not unusual; beyond two standard deviations is. A result consistent with chance is insufficient evidence of an effect."},
  {"q": "A count $x$ is called unusual when...", "options": ["$x \\ne \\mu$", "$x$ is below the median", "$P(X = x) < 0.5$", "$|Z| > 2$, equivalently a tail probability below 0.025"], "answer": 3, "explain": "Z = (x − μ)/σ beyond ±2, the Unit 1 rule. Quiz 4 Part 2 also accepted a tail of 0.0080 < 0.0250 as the justification; the two agree for a bell-shaped X."},
  {"q": "Which row of the binomial-versus-hypergeometric comparison is WRONG?", "options": ["binomial: trials independent; hypergeometric: trials dependent", "binomial: sampling with replacement; hypergeometric: the same probability $p$ on every trial", "binomial: with replacement or an infinite population; hypergeometric: without replacement from a finite population", "binomial: same $p$ each trial; hypergeometric: $p$ changes for subsequent trials"], "answer": 1, "explain": "Under the hypergeometric the probability of success changes after every draw; equal p belongs to the binomial column."},
  {"q": "A shipment of 60 laptops has 15 defective; 8 are sampled without replacement. $P(X = 2)$ defective among the 60 laptops' sample = ? (4 decimals)", "type": "numeric", "answer": 0.3343, "tolerance": 0.0001, "explain": "C(15, 2) C(45, 6)/C(60, 8) = 105 × 8 145 060/2 558 620 845 = 0.3343; dhyper(2, 15, 45, 8). n/N = 13 %, so the binomial 0.3115 would be off."},
  {"type": "fill", "q": "Fill in the counts for $P(X = 2)$ defective in a sample of 8 from 60 laptops, 15 of them defective.", "code": "C(___, 2) · C(___, 6) / C(60, 8)", "answer": ["15", "45"], "explain": "C(K, x) picks the 2 defectives from the 15; C(N − K, n − x) picks the other 6 from the 45 good laptops."},
  {"q": "$\\mu$ for the 60 laptops sample ($N = 60$, $K = 15$, $n = 8$) = ? (2 decimals)", "type": "numeric", "answer": 2, "tolerance": 0.01, "explain": "nK/N = 8 × 15/60 = 2.00. The same np form as the binomial, with p = K/N."},
  {"q": "The 5 % rule says the binomial may stand in for the hypergeometric when...", "options": ["$p \\le 0.05$", "$N \\le 5n$", "$n \\le 0.05\\,N$: 20 from 500 (4 %) yes, 10 from 90 (11 %) no", "$x \\le 5$"], "answer": 2, "explain": "If the sample is 5 % or less of the population the two give practically the same probabilities (superdeck: 0.0460 vs 0.0465). The Mac example at 11 % needs the hypergeometric."},
  {"q": "200 castings, 5 defective; 3 are drawn without replacement. P(none defective) among the 200 castings = ? (4 decimals)", "type": "numeric", "answer": 0.9265, "tolerance": 0.0001, "explain": "C(5, 0) C(195, 3)/C(200, 3) = 1 × 1 216 865/1 313 400 = 0.9265, the same as (195/200)(194/199)(193/198). n/N = 1.5 %, so the binomial 0.975³ = 0.9269 is close."},
  {"q": "For the same $n$ and $p = K/N$, the hypergeometric $\\sigma$ compared with the binomial $\\sigma$ is...", "options": ["always smaller, by the factor $\\sqrt{(N - n)/(N - 1)} < 1$", "always larger", "the same", "smaller only when $n > N/2$"], "answer": 0, "explain": "Mac users: 1.49 against 1.57. Sampling without replacement removes variability; the factor approaches 1 as N grows."},
  {"q": "In a geometric distribution, $X$ is...", "options": ["the number of successes in $n$ trials", "the number of events in an interval", "the number of failures in $n$ trials", "the number of trials it takes to obtain the first success: 1, 2, 3, …"], "answer": 3, "explain": "No fixed n; the trials stop at the first success. The smallest value is 1, not 0 (R's dgeom counts the failures before it, so it starts at 0)."},
  {"q": "A fair die: P(the first 6 on the fourth roll) = ? (4 decimals)", "type": "numeric", "answer": 0.0965, "tolerance": 0.0001, "explain": "q^(x−1) p = (5/6)³(1/6) = 0.5787 × 0.1667 = 0.0965."},
  {"q": "The expected number of rolls to get the first 6 = ? (integer)", "type": "numeric", "answer": 6, "tolerance": 0.01, "explain": "μ = 1/p = 6; σ = √(q/p²) = √30 = 5.48. The mode is still 1."},
  {"q": "Help line busy 75 % of the time, $X$ = calls until access. $P(X = 3)$ is...", "options": ["$0.75^3 \\cdot 0.25 = 0.1055$", "$0.75^2 \\cdot 0.25 = 0.1406$", "$0.25^2 \\cdot 0.75 = 0.0469$", "$3 \\cdot 0.75^2 \\cdot 0.25 = 0.4219$"], "answer": 1, "explain": "Two failures then the success: the exponent on q is x − 1 = 2. 0.75³ · 0.25 is P(X = 4); the 3· version is a binomial count, which does not apply because the success must come last."},
  {"q": "An expert hits 95 % of shots. P(the first miss on the 15th shot) = ? (4 decimals)", "type": "numeric", "answer": 0.0244, "tolerance": 0.0001, "explain": "Geometric with 'miss' as the success, p = 0.05: 0.95^14 × 0.05 = 0.4877 × 0.05 = 0.0244 (Practice Problem 23)."},
  {"q": "A login succeeds with probability 0.3 per attempt. P(a user needs at least 3 attempts) = ? (4 decimals)", "type": "numeric", "answer": 0.49, "tolerance": 0.0001, "explain": "P(X ≥ 3) = q^(x−1) = 0.7² = 0.4900: the first two attempts both fail. Equivalently 1 − 0.3 − 0.21."},
  {"q": "Which R call gives the lecture's $P(X = 3)$ for the help line, $p = 0.25$?", "options": ["`dgeom(3, 0.25)`", "`pgeom(3, 0.25)`", "`dgeom(2, 0.25)`", "`dbinom(3, 3, 0.25)`"], "answer": 2, "explain": "R's geometric counts failures before the first success, so the lecture's x = 3 is R's 2: dgeom(2, 0.25) = 0.140625. dgeom(3, 0.25) would be P(X = 4) = 0.1055."},
  {"q": "Calls arrive at 3 per hour. $\\lambda$ for a 20-minute interval = ?", "type": "numeric", "answer": 1, "tolerance": 0.001, "explain": "3 per 60 min × 20 min = 1. Rescale λ to the interval in the question first; the rate's own interval would give 3."},
  {"q": "A CPU receives 4 jobs per second on average. P(exactly 5 jobs in a 2-second interval) = ? (4 decimals)", "type": "numeric", "answer": 0.0916, "tolerance": 0.0001, "explain": "λ = 4 × 2 = 8; 8^5 e^(−8)/5! = 32 768 × 0.000335/120 = 0.0916; dpois(5, 8)."},
  {"q": "Write that CPU probability, $P(X = 5)$ with $\\lambda = 8$, as the Poisson formula with the numbers substituted. Use ^ for powers, ! for factorial, e^(-8) for the exponential, no spaces.", "type": "text", "answer": ["8^5/5!*e^(-8)", "8^5*e^(-8)/5!", "(8^5/5!)*e^(-8)", "e^(-8)*8^5/5!", "8^5/5!*e^-8", "8^5*e^-8/5!", "(8^5*e^(-8))/5!", "e^-8*8^5/5!"], "explain": "λ^x/x! · e^(−λ) with λ = 8 for the 2-second interval and x = 5: 8⁵/5! · e^(−8) = 0.0916."},
  {"q": "Bits arrive in error at a node at 16 per minute. P(10 or fewer errors in a minute), using 16 errors per minute = ? (4 decimals)", "type": "numeric", "answer": 0.0774, "tolerance": 0.0001, "explain": "ppois(10, 16) = 0.0774: the eleven terms P(0) … P(10) added. Z = (10 − 16)/4 = −1.50, so 10 is low but not unusual."},
  {"q": "For a Poisson random variable the mean and the variance are equal.", "type": "tf", "answer": true, "explain": "μ = λ and σ² = λ, so σ = √λ: for the web server λ = 30 gives σ = 5.48, not 30."},
  {"q": "Web server, $\\lambda = 30$ per minute. $\\sigma$ = ?", "options": ["$\\sqrt{30} = 5.48$", "30", "$30/2 = 15$", "$\\sqrt{30 \\times 0.5} = 3.87$"], "answer": 0, "explain": "σ² = λ, so σ = √λ. There is no q in the Poisson; npq belongs to the binomial."},
  {"type": "match", "q": "Match each scenario to its distribution.", "pairs": [["number of sales among 50 visitors, each buying with $p = 0.25$", "binomial: fixed $n$, independent trials, $nCx\\,p^x q^{n-x}$"], ["number of Mac users in 10 students drawn from a class of 90 with 40", "hypergeometric: without replacement, $n/N = 11\\%$, $C(K,x)C(N-K,n-x)/C(N,n)$"], ["number of calls until the help line answers", "geometric: trials to the first success, $q^{x-1} p$"], ["number of requests reaching a server in one minute", "Poisson: events in an interval, $\\lambda^x e^{-\\lambda}/x!$"], ["the minimum of two dice", "none of the four: $\\mu = \\sum x P(x)$ from the table"]], "explain": "Fixed n with replacement or a huge population: binomial. Fixed n without replacement from a small population: hypergeometric. Counting trials, not successes: geometric. Counting events over time: Poisson. Otherwise the definitions."},
  {"type": "match", "q": "Match the R call to what it computes.", "pairs": [["`dbinom(6, 50, 0.25)`", "$P(X = 6)$ sales among 50 visitors"], ["`1 - pbinom(1, 5, 4/52)`", "$P(X \\ge 2)$ Jacks with replacement"], ["`dhyper(4, 40, 50, 10)`", "$P(X = 4)$ Mac users: successes, failures, draws"], ["`pgeom(2, 0.25)`", "$P(X \\le 3)$ calls to get access"], ["`ppois(20, 30)`", "$P(X \\le 20)$ requests in a minute"], ["`choose(50, 6) * 0.25^6 * 0.75^44`", "the binomial formula written out by hand"]], "explain": "d* gives P(X = x), p* gives P(X ≤ x). dhyper takes K, N − K, n (not N); dgeom and pgeom take x − 1."},
  {"type": "fill", "q": "Complete the call for $P(X = 4)$ Mac users in a sample of 10 from 90 students, 40 of them Mac users.", "code": "dhyper(4, ___, ___, 10)", "answer": ["40", "50"], "explain": "dhyper(x, K, N − K, n): 40 successes and 50 failures in the population, 10 draws. N = 90 in the third slot would describe a population of 130."},
  {"q": "`pgeom(2, 0.25)` returns the lecture's...", "options": ["$P(X = 2)$", "$P(X \\le 3)$, the chance of access within three calls", "$P(X \\ge 2)$", "$P(X = 3)$"], "answer": 1, "explain": "p* is cumulative and R's 2 failures means the lecture's third trial: 0.25 + 0.1875 + 0.1406 = 0.5781; so 1 − pgeom(2, 0.25) = 0.4219 = P(X ≥ 4)."},
  {"q": "Quiz 4 Part 2: Alice beats Bob with probability 0.6 per game; they play 13 games. The exact binomial P(Alice wins at least 7) = ? (4 decimals)", "type": "numeric", "answer": 0.7712, "tolerance": 0.0001, "explain": "1 − pbinom(6, 13, 0.6) = 0.7712; the simulation `sum(X.vals >= 7)/m.trials` printed 0.77156, as close as 10⁵ trials get."},
  {"q": "Same match: the $Z$-score for 3 wins = ? (2 decimals, keep the sign)", "type": "numeric", "answer": -2.72, "tolerance": 0.01, "explain": "μ = 13(0.6) = 7.8, σ = √(13 × 0.6 × 0.4) = 1.77; Z = (3 − 7.8)/1.77 = −2.72 (the simulation's mean 7.80 and sd 1.77 agree)."},
  {"q": "The solutions marked 3 wins 'unusual'. Which justification was accepted?", "options": ["only $Z = -2.7$", "only the left tail $0.0080 < 0.0250$", "either: $Z$ beyond $-2$, or the left tail `sum(X.vals <= 3)/m.trials` = 0.0080 below 0.025", "neither; 3 wins is possible so it is not unusual"], "answer": 2, "explain": "Both were full marks. Possible is not the same as usual: the rule is two standard deviations or a 2.5 % tail."},
  {"q": "Lab 5, Task 1: which `filter` keeps only the rows with both a temperature and a precipitation value?", "options": ["`filter(SFU.Weather, !is.na(Temp.deg.C) & !is.na(Total.Precip.mm))`", "`filter(SFU.Weather, is.na(Temp.deg.C) & is.na(Total.Precip.mm))`", "`filter(SFU.Weather, Temp.deg.C != NA)`", "`filter(SFU.Weather, !is.na(Temp.deg.C) | !is.na(Total.Precip.mm))`"], "answer": 0, "explain": "Both must be present, so AND of two !is.na(). Comparing with != NA is always NA, and | would keep rows missing one of the two. 21 184 rows become 17 582."},
  {"q": "`mean(Temp.deg.C ~ Month, data=SFU.Weather)` returns...", "options": ["one number, the overall mean", "a data frame with 17 582 rows", "a named vector of 12 monthly means, so `Monthly.Mean.Temp[\"Jul\"]` and `Monthly.Mean.Temp[Month]` look values up by name", "an error: mean takes a vector"], "answer": 2, "explain": "mosaic's formula version groups by Month. Indexing the named vector by the Month column is the vectorised lookup that builds the per-month Z anomaly."},
  {"q": "Why does Task 3 plot `barplot(Monthly.Mean.Temp[months])` rather than `barplot(Monthly.Mean.Temp)`?", "options": ["to drop the NA months", "to force January to December order; the named vector comes back alphabetical (Apr, Aug, Dec, …)", "to convert to Fahrenheit", "to compute the means"], "answer": 1, "explain": "months <- c(\"Jan\", …, \"Dec\") indexes the vector in calendar order. The plot then shows Aug and Jul warmest, Dec and Jan coldest."},
  {"q": "With `ifelse(Z < -0.4307, \"Cold\", ifelse(Z <= 0.4307, \"Mid\", \"Warm\"))`, a day with $Z = 0.2$ is labelled...", "options": ["Cold", "Warm", "NA", "Mid"], "answer": 3, "explain": "Not below −0.4307, so the inner ifelse runs; 0.2 ≤ 0.4307 gives Mid. The cut points are the normal tertiles, so the three segments are each about a third (0.3439, 0.3388, 0.3174)."},
  {"q": "Lab 5, Task 8 table: Cold 2591 dry / 3455 wet, Mid 3050 / 2906, Warm 3364 / 2216. $P(\\text{Precip} > 0 \\mid \\text{Cold})$ = ? (4 decimals)", "type": "numeric", "answer": 0.5715, "tolerance": 0.0001, "explain": "Cell over its row total: 3455/(2591 + 3455) = 3455/6046 = 0.5715; `tab2[\"Cold\",\"TRUE\"]/sum(tab2[\"Cold\",])`. Warm gives 0.3971: colder days are wetter."},
  {"q": "Same table, by Bayes from $P(\\text{seg})$ = 0.3439, 0.3388, 0.3174 and the three conditionals 0.5715, 0.4879, 0.3971: $P(\\text{Warm} \\mid \\text{Precip} > 0)$ = ? (4 decimals)", "type": "numeric", "answer": 0.2584, "tolerance": 0.0002, "explain": "0.3174 × 0.3971/(0.3439 × 0.5715 + 0.3388 × 0.4879 + 0.3174 × 0.3971) = 0.1260/(0.1965 + 0.1653 + 0.1260) = 0.2584. Check from the table: 2216/(3455 + 2906 + 2216) = 0.2584; the two must agree."},
  {"q": "`tab1[\"Monday\",\"TRUE\"]/sum(tab1[\"Monday\",])` computes...", "options": ["$P(\\text{Precip} > 0 \\mid \\text{Monday})$, which came out 0.4876 against the overall 0.4878", "$P(\\text{Monday} \\mid \\text{Precip} > 0)$", "the number of wet Mondays", "$P(\\text{Monday})$"], "answer": 0, "explain": "The wet Mondays over all Mondays. The column name must be the string \"TRUE\"; a bare TRUE would be a logical index."},
  {"q": "Lab 5's conclusion: precipitation is more likely on Mondays than on other days.", "type": "tf", "answer": false, "explain": "P(Precip | Monday) = 0.4876 and P(Precip) = 0.4878 are the same to three decimals, so precipitation is independent of the day being Monday."},
  {"q": "With the three-way `tab2 <- table(SFU.Weather[c(\"has.Precip\",\"Temp.Seg\",\"Season\")])`, $P(\\text{Precip} > 0 \\mid \\text{Warm and Summer})$ is...", "options": ["`tab2[\"TRUE\",\"Warm\",\"Summer\"]/sum(tab2)`", "`sum(tab2[,\"Warm\",\"Summer\"])/tab2[\"TRUE\",\"Warm\",\"Summer\"]`", "`tab2[\"TRUE\",\"Warm\",\"Summer\"]/sum(tab2[,\"Warm\",\"Summer\"])`, which is 125/1437 = 0.0870", "`tab2[\"Warm\",\"Summer\",\"TRUE\"]`"], "answer": 2, "explain": "The wet warm summer days over all warm summer days (the first index is has.Precip). Winter gives 0.7213, so winter is the season a warm day is most likely wet."}
]
```
