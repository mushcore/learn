# MATH 3042 Unit 3 — notes, demo notebook, Lab 3 and Lab 4 transcribed (source of every number in this module)

Source files (Learning Hub export, 2026-09-30, 2:38 PM): `MATH_3042_Lecture_Unit_03.pdf` (16 pages, printed pp. 39–54; **no filled version was posted**, so every example's arithmetic below is worked here and checked by computation), `demo_notebook_Unit_03.Rmd`, `Lab Assignment 3.zip` (`Lab_03_Notebook.Rmd`, Sept 21: charts and tables in R) with `Lab_03_Notebook_Solutions.pdf` (30 pages), `Lab Assignment 4.zip` (`Lab_04_Notebook.Rmd`, Sept 28: probability simulations) with `Lab_04_Notebook_Solutions.pdf` (28 pages; its pencil problems are "posted separately as a pdf" and were not in the export), `MATH_3042_Quiz_02_V1 (Solutions).pdf` (scanned; Part 1 paper and pencil, Part 2 RStudio on `SFU.Weather.xlsx`), `SFU.Weather.xlsx`, `BCIT.students.csv`.

## Unit 3 notes, p.39 — 3.1 Probability
- Motivation: sample statistics like $\bar{X}$ are random variables; inferential statistics needs how close $\bar{X}$ is, with a certain probability, to $\mu$.
- Definition: the probability of an event is a measure of how likely that event is. Example: "64% chance of rain on Thursday" — what is it saying exactly? (Relative-frequency reading: of all days with a forecast like this one, about 64% had rain.)
- Definition: a **random experiment** is any procedure whose specific outcome we cannot predict; the set of possible outcomes is the **sample space**. Rolling a 6-sided die: $S = \{1, 2, 3, 4, 5, 6\}$.
- Definition: a **random variable** is a numerical value $X$ that depends on the outcome of a random experiment. Three coins, $X$ = number of heads: $S$ = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT} (8 equally likely outcomes); $P(1\text{ head}) = 3/8$ (HTT, THT, TTH); $P(2\text{ heads}) = 3/8$ (HHT, HTH, THH): equally likely.

## p.40 — events and classical probability
- An **event** $A$ is any subset of the sample space $S$.
- Classical definition: if the outcomes in $S$ are equally likely, $P(A) = |A| / |S|$. Consequently $P(A) = 0$ if impossible (empty), $P(A) = 1$ if certain (all outcomes), $0 \le P(A) \le 1$.
- Five coins, all five the same: $|S| = 2^5 = 32$, $A$ = {HHHHH, TTTTT}, $P = 2/32 = 1/16 = 0.0625$.
- Five coins, at least two heads: complement is 0 or 1 heads = 1 + 5 = 6 outcomes, so $P = 1 - 6/32 = 26/32 = 13/16 = 0.8125$.

## p.41 — relative frequency, law of large numbers, boxcars
- Relative frequency definition: perform $n$ trials, event $A$ occurs $x$ times, $P(A) \approx x/n$.
- **Law of Large Numbers**: perform the experiment enough times and $x/n$ must approach the exact classical probability $P(A)$.
- Craps "boxcars" (both sixes): 36 equally likely outcomes (grid of dice pairs), $P(B) = 1/36 = 0.02778$.
- Simulation (R for-loop): `n.trials <- 10^5; n.dice <- 2; X.success <- 0; for (i.trial in 1:n.trials){ dice <- sample(c(1,2,3,4,5,6), n.dice, replace=TRUE); success <- (dice[1] == 6) & (dice[2] == 6); X.success <- X.success + success }; prob.B <- X.success / n.trials` → about 0.0278.
- demo notebook: `prob.B.classical <- 1/(6^2)` → 0.02777778; `dice <- sample(c(1,2,3,4,5,6), 2, replace=TRUE)`; the loop above; `factorial(4)` → 24; `choose(52, 4) * factorial(4)` → 6497400 ($P(52,4)$); `choose(52, 4)` → 270725; birthday simulation: `b.days = 1:365; n.people = 23; n.trials = 1E5; x.success <- 0; for (...) { sample.bdays <- sample(1:365, n.people, replace=TRUE); if (length(unique(sample.bdays)) < n.people) x.success <- x.success + 1 }; x.success / n.trials` → about 0.507.

## p.42 — 3.2 Counting
- **Fundamental Counting Rule**: sets $S_1, \ldots, S_k$ with $n_1, \ldots, n_k$ elements give $n_1 \times n_2 \times \cdots \times n_k$ ways to choose one element from each.
- Roll a die five times: $|S| = 6^5 = 7776$.
- Five cards **with replacement**, first three red and last two Kings: $P = (26/52)^3 (4/52)^2 = (1/2)^3 (1/13)^2 = 1/1352 = 0.000740$.
- Playing cards: 52 cards, half red (hearts, diamonds) half black (spades, clubs); 4 suits of 13 (A, 2–10, J, Q, K); 12 face cards (J, Q, K per suit); 4 of each rank (4 Aces, 4 Kings).

## p.43 — without replacement; factorials, permutations, combinations
- Five cards without replacement, all red: $\dfrac{26}{52} \cdot \dfrac{25}{51} \cdot \dfrac{24}{50} \cdot \dfrac{23}{49} \cdot \dfrac{22}{48} = \dfrac{7893600}{311875200} = 0.02531$ (also $C(26,5)/C(52,5) = 65780/2598960$).
- $n! = n(n-1)\cdots 3 \cdot 2 \cdot 1$; $P(n, r) = \dfrac{n!}{(n-r)!}$ (ordered sequences of $r$ from $n$); $C(n, r) = \dfrac{P(n,r)}{r!} = \dfrac{n!}{r!(n-r)!}$ (unordered hands of $r$ from $n$).
- Arrange the four Aces into a sequence: $4! = 24$.
- Select four cards from a deck and arrange them in sequence: $P(52, 4) = 52 \cdot 51 \cdot 50 \cdot 49 = 6{,}497{,}400$.

## p.44 — hands, calculator, front row
- A "hand" of four cards (no sequence): $C(52, 4) = 6497400 / 24 = 270{,}725$.
- Calculator: $C(52,4)$ = `52  2nd F  nCr (5 key)  4` on the Sharp; `nPr` for permutations, `n!` for factorials.
- 90 students, front row of 9 seats: ordered, $P(90, 9) = 90 \cdot 89 \cdot 88 \cdot 87 \cdot 86 \cdot 85 \cdot 84 \cdot 83 \cdot 82 = 256{,}284{,}917{,}589{,}254{,}400 \approx 2.563 \times 10^{17}$.

## p.45 — diamonds, committee, spade flush
- Sequence of 3 cards without replacement, all diamonds: $P(13, 3) = 13 \cdot 12 \cdot 11 = 1716$ sequences (out of $P(52,3) = 132600$; probability $1716/132600 = 0.01294$).
- Committee of 5 from 20 instructors: $C(20, 5) = 15{,}504$.
- Spade flush (5 cards all spades): $C(13, 5) / C(52, 5) = 1287 / 2{,}598{,}960 = 0.000495$ (about 1 in 2020).

## p.46 — 3.3 Probability rules: complement
- Recall: event = subset of $S$; $P(A) = |A|/|S|$.
- **Complement rule**: $\bar{A} = S - A$; $P(\bar{A}) = 1 - P(A)$.
- Two dice, sum less than 12: only (6,6) fails, $P = 1 - 1/36 = 35/36 = 0.9722$.
- **Birthday problem**, 23 people, at least two share a birthday (ignore Feb 29, dates equally likely): $P(\text{no match}) = \dfrac{365 \cdot 364 \cdots 343}{365^{23}} = \dfrac{P(365, 23)}{365^{23}} = 0.4927$, so $P(\text{match}) = 1 - 0.4927 = 0.5073$. (Matches the demo simulation ≈ 0.507.)

## p.47 — addition rule, mutually exclusive
- **Addition rule** (one trial, events $A$, $B$): $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.
- **Mutually exclusive**: cannot both occur in one trial; e.g. $A$ = draw a black card, $B$ = draw a heart. Then $P(A \cap B) = 0$ and $P(A \cup B) = P(A) + P(B)$.
- Top card is a 7 or an Ace: mutually exclusive, $4/52 + 4/52 = 8/52 = 2/13 = 0.1538$. (Not mutually exclusive example for contrast: heart or Ace $= 13/52 + 4/52 - 1/52 = 16/52$.)

## p.48 — conditional probability; two-way table
- **Conditional probability** of $B$ given $A$: $P(B \mid A) = \dfrac{|A \cap B|}{|A|}$ — "the probability of $B$ if we restrict the sample space to be $A$."
- Two-way table of MATH 3042 students (rows Handedness, columns Phone Type): Left: iPhone 5, Android 2, Other 1, total 8; Right: 52, 5, 4, total 61; Ambidextrous: 1, 0, 1, total 2; column totals 58, 7, 6; grand total 71.
- $P(\text{Right}) = 61/71 = 0.859$; $P(\text{iPhone} \mid \text{Right}) = 52/61 = 0.852$; $P(\text{Right} \mid \text{iPhone}) = 52/58 = 0.897$.

## p.49 — independence
- Events $A$, $B$ are **independent** if $P(A \cap B) = P(A) \cdot P(B)$; otherwise dependent.
- Right and iPhone: $P(R \cap iP) = 52/71 = 0.7324$; $P(R) \cdot P(iP) = (61/71)(58/71) = 3538/5041 = 0.7018$; not equal → **dependent** (equivalently $P(iP \mid R) = 0.852 \ne P(iP) = 58/71 = 0.817$).
- Fact: independent ⇔ $P(B \mid A) = P(B)$. Proof in the notes: $|A \cap B|/|S| = (|A|/|S|)(|B|/|S|)$ ⇒ $|A \cap B|/|A| = |B|/|S|$.

## p.50 — multiplication rule; conditional probability formula
- **Multiplication rule**: $P(A \cap B) = P(A) \cdot P(B)$ if independent; $P(A \cap B) = P(A) \cdot P(B \mid A)$ if dependent (general form).
- Two Aces: (a) with replacement $(4/52)(4/52) = 1/169 = 0.005917$; (b) without replacement $(4/52)(3/51) = 12/2652 = 1/221 = 0.004525$.
- Conditional probability formula (from the multiplication rule): $P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}$. Thomas Bayes (1702–1761).

## p.51 — Bayes' rule: sex and handedness
- 60% Female (5% left-handed, 95% right-handed); 40% Male (15% left, 85% right).
- (a) $P(L) = 0.60 \cdot 0.05 + 0.40 \cdot 0.15 = 0.03 + 0.06 = 0.09$.
- (b) $P(F \mid L) = \dfrac{P(F \cap L)}{P(L)} = \dfrac{0.03}{0.09} = 1/3 = 0.333$ (and $P(M \mid L) = 0.06/0.09 = 2/3$).

## p.52 — Bayes' theorem
- Two exhaustive, mutually exclusive events $A_1$, $A_2$ ($S = A_1 \cup A_2$): $P(A_1 \mid B) = \dfrac{P(A_1 \cap B)}{P(B)} = \dfrac{P(A_1) P(B \mid A_1)}{P(A_1) P(B \mid A_1) + P(A_2) P(B \mid A_2)}$.
- Definition: $A_1, \ldots, A_k$ are **exhaustive and mutually exclusive** if together they cover the entire sample space and do not overlap.
- Bayes' Theorem: for exhaustive, mutually exclusive $A_1, \ldots, A_k$ and any $B$: $B = (A_1 \cap B) \cup \cdots \cup (A_k \cap B)$ (picture: $B$ cut into slices by the $A_i$), $P(B) = \sum P(A_i) P(B \mid A_i)$ (law of total probability), and $P(A_i \mid B) = \dfrac{P(A_i) P(B \mid A_i)}{\sum_j P(A_j) P(B \mid A_j)}$.

## p.53–54 — defective CPUs
- Table: Intel market share 85.0%, 1.0% defective; AMD 10.0%, 3.0%; Other 5.0%, 2.0%. Tree diagram: $A_1$ 0.85 → Defective 0.01 / Non-Defective 0.99; $A_2$ 0.10 → 0.03 / 0.97; $A_3$ 0.05 → 0.02 / 0.98.
- (a) $P(D) = 0.85(0.01) + 0.10(0.03) + 0.05(0.02) = 0.0085 + 0.0030 + 0.0010 = 0.0125$.
- (b) $P(\text{Intel} \mid D) = 0.0085 / 0.0125 = 0.68$ (AMD $0.0030/0.0125 = 0.24$, Other $0.0010/0.0125 = 0.08$).

## Lab 3 (Sept 21): charts and tables in R, with the solutions' outputs
- Packages MASS, lattice, dplyr. Pie chart of living arrangements: `percents <- c(10,30,5,35,20); home.type <- c("On Campus","Parents","Alone", "Roommates", "Spouse"); pie(percents, home.type)`. Task 1: `pie(percents, home.type, main="Living Arrangments of Students", col=c("pink", "snow","turquoise", "orange", "skyblue"))`.
- `data(survey)` (MASS): columns Sex, Wr.Hnd, NW.Hnd, W.Hnd, Fold, Pulse, Clap, Exer, Smoke, Height, M.I, Age; `head(survey)`; `help(survey)`. `levels(survey$W.Hnd)` → "Left" "Right"; `freq.tab <- table(survey$W.Hnd)` → Left 18, Right 218 (n = 236 non-missing); `names(freq.tab)`; `freq.tab[1]`, `freq.tab["Left"]` → `Left 18`; `freq.tab[["Left"]]` → `[1] 18`. `pie(freq.tab)` uses the names as labels. `new.labels <- paste0(names(freq.tab), "\n(", freq.tab,")")` → "Left\n(18)" "Right\n(218)"; `pie(freq.tab, new.labels)`.
- Task 2: `new.labels <- paste0(names(freq.tab), "\n(", freq.tab, " students)"); pie(freq.tab, new.labels, radius=1.0, main=paste0("Writing Hand of Students (n = ", sum(freq.tab),")"), col=c("grey","pink"))` → title "Writing Hand of Students (n = 236)".
- `barplot(freq.tab)`; Task 3: `barplot(freq.tab, horiz = TRUE, main=paste0("Writing hands of Students (n =", sum(freq.tab),")"))`.
- Stem plots: `head(survey$Height)` → 173.00 177.80 NA 160.00 165.00 172.72; `head(cbind(survey$Height))` prints as a column; `stem(survey$Height)` → "The decimal point is 1 digit(s) to the right of the |", split stems 15 | 0224, 15 | 555566777777899, 16 | 00000000333333334444, 16 | 5555…, …, 20 | 0 (first row 150–154 cm, second 155–159). Task 4: `stem(survey$Height, scale=2)` → "The decimal point is at the |", stems 150, 152, …, 200 (e.g. 152 | 045; 154 | 9900).
- Frequency distributions: `range(survey$Height)` → NA NA (missing values); `numerical.heights <- survey$Height[ !is.na(survey$Height) ]`; `range(numerical.heights)` → 150 200; `lower.limits <- seq(150, 200, by=5)`; `heights.classes = cut(numerical.heights, lower.limits, right=FALSE)` (levels [150,155) … [195,200)); `heights.freq = table(heights.classes); cbind(heights.freq)` → 6, 13, 20, 45, 42, 27, 28, 17, 8, 2 (n = 208; the 200 cm value is outside the last class).
- Task 5: male vs female height tables with common limits: `male.Height <- subset(survey, Sex == "Male")$Height` (drop NAs), `overall.min`, `overall.max`, `table(cut(male.Height, breaks=seq(overall.min, overall.max+5, by=5), right=FALSE))`, barplots; "Female heights are noticeably smaller than male heights. The standard deviation appears to be similar."
- `hist(numerical.heights)` (bins of width 5, poor labels). Task 6: `hist(numerical.Heights, breaks=seq(150, 200, by=2.5), right=FALSE, col="pink", xlab="Heights (cm)", ylab="Frequency", main=paste0("Heights of Students (n = ", length(numerical.Heights),")"))` → n = 209.
- Cumulative: `cumul.freq <- cumsum(heights.freq); cbind(cumul.freq)` → 6, 19, 39, 84, 126, 153, 181, 198, 206, 208; "126 students are < 175 cm".
- Ogive: `plot(x.vals, y.vals, col="blue")` sine demo; ogive = lower class limits as x, cumulative frequency as y with a 0 inserted first: `cumul.freq <- c(0, cumul.freq); plot(lower.limits, cumul.freq, col="red")`. Task 7: `plot(lower.limits, cumul.freq, col="black", type="b", pch=19, cex=0.75, lty = 2, lwd=2, xlab="student heights (cm)", ylab="number of students", main=paste("Ogive of", sum(heights.freq),"student heights"))` → "Ogive of 208 student heights". (This lab plots cumulative counts against the lower limits with the 0 at the first lower limit; Unit 2 plotted cumulative relative frequency against upper limits.)
- Scatter: `xyplot(Wr.Hnd ~ Height, data=survey, col="black")` — "very spread out cloud, not much correlation". Task 8: `xyplot(Pulse~Height, data=survey, xlab="Height (cm)", ylab="Pulse (bpm)", main=paste0("Pulse and Height (n = ", nrow(survey), ")"), pch=19, col="#5050F0", size=3)` (n = 237) and `xyplot(Wr.Hnd~NW.Hnd, …, col="#F06070")`; writing hand vs non-writing hand is the stronger linear correlation (r ≈ 0.95 vs ≈ −0.07 for pulse vs height, `cor(..., use="complete.obs")`).
- Lab 3 pencil problems repeat Lab 2's (class width for n = 250, min 51.3, max 135.4: √250 = 15.8, ideal width 5.32 → 5.3 (16 classes) or 5 (17 classes); plywood five classes; ogive readings 80%, 25%, 48–60; Old Faithful waiting-time stem plot: range 43–96 min, bimodal, most in 75–85; boxplot: "75% of female students are shorter than the shortest 25% of male students" / "50% of the male students are taller than the tallest female student").

## Lab 4 (Sept 28): probability simulations, with the solutions' outputs
- Objectives: use `sample()` to simulate random experiments; relative-frequency probabilities from simulated data; graphs of the distribution of $X$. Package mosaic.
- `sample(c(1,2,3,4,5,6), 1)`; `sample.int(6, 1)`; five dice need `replace=TRUE`: `sample.int(6, 5, replace=TRUE)` → e.g. 6 6 3 4 5; without replacement the five values are always distinct (1 6 2 4 3). Loaded die: `sample.int(6, 100, replace=TRUE, prob = c(0.1, 0.1, 0.1, 0.1, 0.1, 0.5))`. $X$ = number of 6s in 100 rolls: `die.outcomes <- sample.int(6, 100, replace=TRUE); X <- sum(die.outcomes == 6)` → e.g. 12.
- Coins: `sample(c("H","T"), 1)`. Task 1: `sample(c("H","T"), 10, replace=TRUE)`. Task 2: `coin.outcomes <- sample(c("H","T"), 1000, replace=TRUE, prob=c(0.55, 0.45)); X <- sum(coin.outcomes=="H")` → e.g. 537.
- Functions: `myfunc <- function(x) { return(x^2) }`; `myfunc(4)` → 16. Task 3: `pick.a.number <- function(n) { return(sample.int(n, 1)) }`. Task 4: `Flip.Once <- function(){ return(sample(c("H","T"), 1)) }`.
- for loops: `for (i in 1:10){ print(i) }`; loop over a list; store results: `die.results <- numeric(100); for (i in 1:100){ die.results[i] <- sample.int(6, 1) }`. Task 5: `Flip.Coins <- function(n){ res.coins <- character(n); for (i in 1:n){ res.coins[i] <- Flip.Once() }; return(res.coins) }`.
- Simulating probabilities: $m$ trials, event $E$ occurs $k$ times, $P(E) \approx k/m$. Task 6: `Prob.Heads <- function(m){ coins <- character(m); for (i in 1:m){ coins[i] <- Flip.Once() }; k <- sum(coins == "H"); return(k/m) }`; `Prob.Heads(10^5)` → 0.50213. Task 7: $X$ = sum of two dice, $E$: $X = 7$: `Prob.E <- function(m){ k.success <- 0; for (i in 1:m){ X <- sum(sample.int(6, 2, replace=TRUE)); if (X == 7){ k.success <- k.success + 1 } }; return(k.success/m) }`; `Prob.E(10^5)` → 0.16789 (exact $6/36 = 0.1667$).
- `replicate()`: `res <- replicate(10, sample.int(100, 1))` replaces a for loop whose body ignores `i`. Task 8: `Prob.Heads <- function(m){ coins <- replicate(m, Flip.Once()); k <- sum(coins == "H"); return(k/m) }`; `Prob.E <- function(m){ X.vals <- replicate(m, sum(sample.int(6, 2, replace=TRUE))); k <- sum(X.vals==7); return(k/m) }` → 0.50364, 0.16849.
- Task 9: variability of the estimate vs $m$: `ms <- c(10^{1:5}); s <- numeric(length(ms)); r.reps <- 100; for (i in 1:length(ms)){ m <- ms[i]; Prob.E.ests <- replicate(r.reps, Prob.Heads(m)); s[i] <- sd(Prob.E.ests); cat(...) }` → m = 10: s = 0.155; 100: 0.056; 1000: 0.0166; 10000: 0.0050; 100000: 0.00155. Table in the lab: 0.1431, 0.0509, 0.0167, 0.0056, 0.0019. The variability shrinks by about $\sqrt{10} \approx 3.2$ for every ×10 in $m$ (theory: $\sqrt{0.25/m}$ = 0.158, 0.050, 0.0158, 0.0050, 0.0016).
- Dice rolling: 20 rolls 6, 1, 4, 2, 2, 2, 4, 4, 1, 4, 2, 3, 3, 3, 3, 2, 6, 2, 4, 5: `table(die.vals)` → 1:2, 2:6, 3:4, 4:5, 5:1, 6:2; `prop.table(table(die.vals))` → 0.10 0.30 0.20 0.25 0.05 0.10; `barplot(prop.table(table(die.vals)), col="lightgreen", xlab="X = die value", ylab="rel. freq.")`. Task 10: `Roll.Dice <- function(m){ die.vals <- sample.int(6, m, replace=TRUE); barplot(prop.table(table(die.vals)), col="lightblue", xlab="X = die value", ylab="rel. frequency", main=paste0("Simulated Die Rolls (",m," Trials)")) }` for m = 100, 1000, 10000: "The relative frequency distribution becomes flatter as m increases. This reflects the fact that the true probability of each X is equal to 1/6."
- Rolling $n$ dice: $6^n$ outcomes; $X$ = number of 3s. Task 11: `Roll.Some.Dice <- function(m, n){ X.vals <- replicate(m, sum(sample.int(6, n, replace=TRUE)==3)); X.tab <- table(X.vals); X.tab; barplot(X.tab, col="pink", xlab="X = # 3s", ylab="Frequency", main=paste0("Number of 3s Out of ",n, " Dice (Based on ", m, " Trials)")) }` for m = 10 000 and n = 1, 2, 5, 10, 100: "as n increases, the shape of the distribution of X becomes closer and closer to a normal distribution. The peak always occurs near $n/6$" (n = 10 → X ≈ 1; n = 100 → X ≈ 16).
- Drawing cards: 52 = 13 hearts + 13 diamonds (red) + 13 clubs + 13 spades (black); sampling without replacement; $X$ = number of red cards. Task 12: `Draw.Cards <- function(m, n, replace, col){ deck <- c(rep("R", 26), rep("B", 26)); X.vals <- replicate(m, sum(sample(deck, n, replace) == "R")); histogram(X.vals, col=col, type="d", breaks=seq(-0.5, n+0.5, by=1), xlab="X = # red cards", ylab="Prob. Density", main=paste0("Number of Red Cards Out of ",n, " Cards (", m, " Trials)")) }` for m = 10 000, n = 1, 5, 10, 20, 50, replace TRUE and FALSE: "As n increases, the shape becomes closer to a normal distribution. Also, replace=FALSE tends to make the distribution somewhat narrower (less variability) but does not change the center (mean), which is always at $\mu = n/2$."

## Quiz 2 (for the format of Quiz 3)
- Part 1 paper and pencil (Q1, 10 marks: Z-score unusual? fences outlier? Sk from a histogram, estimate r from a scatterplot). Part 2 RStudio (Q2–Q5, 10 marks) on `SFU.Weather.xlsx` imported with the Import Dataset button: `subset(SFU_Weather, Month == "Sep")`, `$Total.Rain.mm`, `[!is.na(...)]`, mean 3.55 mm and sd 8.52 mm, `mean(Total.Rain.mm ~ Month, data=SFU_Weather, na.rm=TRUE)` (November wettest), `scale()` and `sum(is.unusual)/length(...)` → 5.42%.
- Expected Quiz 3 shape: pencil part on Unit 3 (counting, rules, a two-way table, a Bayes tree) and an RStudio part in the style of Lab 3/Lab 4 (charts of `survey`, a `sample()`/`replicate()` simulation).

## Checks made while writing
- Every fraction above was recomputed (e.g. $P(365,23)/365^{23} = 0.492703$; $C(52,5) = 2598960$; $(61 \cdot 58)/71^2 = 0.70184$; $P(90,9) = 2.563 \times 10^{17}$).
- The notes' three-coin question is a trap: $P(1) = P(2) = 3/8$, neither is more likely.
- Lab 3's ogive uses lower limits and counts; Unit 2's uses upper limits and cumulative relative frequency. Both are taught; the lessons say which is which.
