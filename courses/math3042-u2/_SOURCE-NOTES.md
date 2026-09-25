# MATH 3042 Unit 2 — instructor's notes and Lab 2, transcribed (source of every number in this module)

Source files (Learning Hub export, 2026-09-24): `MATH_3042_Lecture_Unit_02.pdf` (13 pages, printed pp. 26–38), `MATH_3042_Lecture_Unit_02 (filled).pdf` (the same pages with the instructor's handwritten answers, posted 2026-09-24; transcribed below), `demo_notebook_Unit_02.Rmd`, `Lab 2.zip` (`Lab_02_Notebook.Rmd`, ogive image), `Lab_02_Notebook_Solutions.pdf` (16 pages), `BCIT.students.csv`. Unit 3 (probability and counting) and Lab 3 (charts in R) are in the same export but are out of scope for Quiz 2.

## p.26 — 2.1 Charts for non-numerical data
- `BCIT.students <- read.csv("Data\BCIT.students.txt", row.names = 1, sep="")` (handwritten: the file is a **csv**); n = 302; columns Eye.Colour, Age, Wr.Hnd, Height.CM (first rows: Brown 24 R 163; Black 23 R 187; Brown 23 R 169; Black 23 R 168; Black 21 R 170).
- `freq.tab <- table( BCIT.students$Eye.Colour )` → Black 95, Blue 52, Brown 130, Green 10, Other 15 (handwritten: `names(freq.tab)` gives the names).
- "This table is an example of a **named vector**. Index by number or by name; double square brackets exclude the name": `freq.tab[3]` → Brown 130; `freq.tab["Brown"]` → Brown 130; `freq.tab[[3]]` → `[1] 130`.

## p.27 — Pie charts and bar charts
- "A pie chart is better at showing what fraction a sample forms out of the whole sample. A bar chart is better at showing how two categories compare to each other."
- `pie(freq.tab, radius=1.0, main="Eye Colour in BCIT Students (n = 302)")`; `barplot(freq.tab, col="lightgreen", xlab="Eye Colour", ylab="Frequency", main="Eye Colour in BCIT Students (n = 302)")`.
- Handwritten: pie "shows relative frequency"; bar "shows absolute frequency, better for comparisons"; the y axis of the bar chart labelled "absolute freq."; a red arrow comparing the Black and Brown bars; "Interpretation: Brown is the 'modal' colour (i.e. mode)".

## p.28 — 2.2 Graphs for numerical data; stem-and-leaf
- Chart list with handwritten notes: stem-and-leaf "simple"; bar plots (for integer data) "can be a bad choice"; histograms "most common and important"; box plots; ogives; scatter plots.
- "A stem-and-leaf plot is a frequency distribution of X." Example X = Height (cm) for the first 20 students ("raw data"): 163 187 169 168 170 154 167 175 153 170 / 159 187 163 178 158 170 169 183 170 146.
- Leaf = usually the last digit; stem = everything before it: 16 | 3 ("stem" | "leaf"). Record stems left of a vertical line, leaves right, sorted.
- Handwritten plot: 14 | 6; 15 | 3 4 8 9; 16 | 3 3 7 8 9 9; 17 | 0 0 0 0 5 8; 18 | 3 7 7. "Interpretation: The center is around 170 cm. (The mode is 170 cm)".

## p.29 — R's stem()
- `stem(BCIT.students$Height.CM)` → "The decimal point is 1 digit(s) to the right of the |" then split stems 14 | 123444, 14 | 6677888, 15 | 1111223333333444, 15 | 5555555666778888888888899999999, 16 | 000000001111111222222233333333333333333344444444, 16 | 55555555555666666666667777777777888888888888888888999999999, 17 | 000000000000111112222222222233333444, 17 | 5555556666666666677777778888888888888999999, 18 | 000000000111111222333333444444, 18 | 5666777777777899, 19 | 00002334, 19 | 779. Handwritten: "therefore 14 | 1 represents 141 cm".
- Notes: R split each stem into two (leaves 0–4 and 5–9); "typical student height is around 165 to 170 cm".
- Four digits of precision → round first: 2.283 → "round → 2.28 → stem 22, leaf 8" (handwritten).

## p.30 — Old Faithful stem plot; bar plots for numerical data
- `stem(faithful$eruptions)` → "The decimal point is 1 digit(s) to the left of the |", stems 16, 18, 20, ..., 50 (two stems per line): 16 | 070355555588, 18 | 000022233333335577777777888822335777888, 20 | 00002223378000035778, 22 | 0002335578023578, 24 | 00228, 26 | 23, 28 | 080, 30 | 7, 32 | 2337, 34 | 250077, 36 | 0000823577, 38 | 2333335582225577, 40 | 00000033577888880022335555777778, 42 | 03335555778800233333555777778, 44 | 02222335557780000000023333357778888, 46 | 0000233357700000023578, 48 | 00000022335800333, 50 | 0370.
- Handwritten conclusion: "Most eruptions are around 1.8 sec or 4.4 sec." (the notes say seconds; the data are minutes).
- Bar plots for integer X: `barplot( table(BCIT.students$Age), xlab="Age", ylab="Frequency" )` "Don't forget the table step!" Handwritten, plot crossed out: "Not recommended. → potentially too many rectangles → can be missing X values along horizontal axis" (axis shows 18…26, 28, 29, 30, 35, 39, 42). "There is one serious problem: the X axis might be missing values!"

## p.31 — Histograms
- "A histogram looks similar to a bar chart, but it is much better for visualizing numerical data." Steps: 1. divide the range of X into classes of equal width; 2. count the X values in each class (frequency); 3. plot a rectangle per class (frequency or relative frequency).
- `hist( BCIT.students$Age, col="lightblue")` (R chooses classes: 18–20, 20–22, ...).
- How to define classes: 1. √n = √302 = 17.4 initial number of classes; 2. class width = R/√n = (42 − 18)/17.4 = 1.38 (handwritten: "this is the 'ideal' class width"); 3. round (up or down) to match the precision of X: 1.38 → 2 (handwritten: "actual class width").

## p.32 — Age classes and histogram
- 4. first lower class limit = minimum X (can round down) = 18 (circled). 5. all class limits (handwritten "+2" arrows): lower 18 20 22 24 26 28 30 32 34 36 38 40 42; upper 19 21 23 25 27 29 31 33 35 37 39 41 43; frequency 35 94 104 53 10 2 1 0 1 0 1 0 1 (sum 302). 6. count → the **frequency distribution**. 7. plot a rectangle per class.
- `hist(BCIT.students$Age, breaks=seq(18, 44, by=2), right = FALSE, xlab="Age", ylab="Frequency", xaxp=c(15,45, 15), main="Age of BCIT Students (n = 302)")`.
- Handwritten under the first rectangle: "this rectangle represents students with 18 ≤ X < 20. Not including 20."

## p.33 — Features of a histogram; Old Faithful classes
- Features: X along the horizontal axis; the axis divided into classes; frequency = height; classes have equal width; no gaps; each X value in exactly one class.
- Handwritten: √n = √272 = 16.5; range of X = max − min = 5.1 − 1.6 = 3.5; ideal class width = range/√n = 3.5/16.5 = 0.21212. "The class width must have the same number of decimal places as the X data (3 digits). We also should round down to a 'nice' number → actual class width = 0.200". Arrows "+0.200" between lower limits; upper limit 1.799 = "last possible X value before the next lower limit".
- Table: lower/upper/frequency 1.600–1.799 12; 1.800–1.999 39; 2.000–2.199 20; 2.200–2.399 18; 2.400–2.599 3; 2.600–2.799 3; 2.800–2.999 2; 3.000–3.199 1; 3.200–3.399 4; 3.400–3.599 6; 3.600–3.799 10; 3.800–3.999 16; 4.000–4.199 31; 4.200–4.399 29; 4.400–4.599 35; 4.600–4.799 28; 4.800–4.999 11; 5.000–5.199 4.

## p.34 — Old Faithful histogram; pitfalls
- `hist( faithful$eruptions, breaks=seq(1.6, 5.2, by=0.2), right=FALSE, xlab="Eruptions (sec)", main="Eruption duration of Old Faithful (n = 272)", col="pink")`; handwritten under the first bar "1.600 ≤ X < 1.800". "Eruption durations cluster around two different values, 2.0 seconds and 4.5 seconds."
- Pitfall: width 0.020 instead of 0.200 → handwritten "Shows a jagged shape & lots of empty classes".

## p.35 — Too few classes; cumulative distributions
- Width 2.000 → handwritten "Doesn't show enough detail about the shape of the distribution." "Using √n avoids these problems."
- Cumulative frequency = number of individuals in any class up to and including that class; cumulative relative frequency = the fraction. Handwritten: "Oh-jive". Table filled: 12; 12+39 = 51; 51+20 = 71; ...; 272, and 12/272 = 0.044; 51/272 = 0.1875; 71/272 = 0.2610; ...; 272/272 = 1.000; "last cumulative frequency = n".

## p.36 — Full cumulative table
- Extra first row: upper 1.599, cumul freq 0, cumul rel freq 0.000 (highlighted; handwritten "X-axis" over the upper limits and "Y-axis" over the cumulative relative frequencies).
- Cumul freq: 12, 51, 71, 89, 92, 95, 97, 98, 102, 108, 118, 134 (circled), 165, 194, 229, 257, 268, 272. Cumul rel freq: 0.044, 0.188, 0.261, 0.327, 0.338, 0.349, 0.357, 0.360, 0.375, 0.397, 0.434, 0.493, 0.607, 0.713, 0.842, 0.945, 0.985, 1.000. Total = 272.
- "How many eruptions had a duration of less than 4.0 minutes?" → **134** "(total # up to 3.999)". "Estimate the median" → "Q2 is somewhere between 4.0 and 4.199".

## p.37 — Ogive
- "An ogive shows the cumulative relative frequencies plotted against the upper class limits. (We insert one additional point at the beginning of the curve to indicate the 0.0 point.)" Handwritten on the plot: "Shows all percentiles at once"; X axis "[upper class limits]".
- Readings (handwritten): below 3.0 minutes → "Approx 35% → P35 = 3.0"; below 4.1 → "Approx 55% → P55 = 4.1"; 30% below / 70% above → "About 30% of eruptions had X < 2.35, 70% had X ≥ 2.35; P30 = 2.35".

## p.38 — Scatter plot
- Two or more numerical variables per individual → one point (X, Y) each. mtcars: Y = mpg (fuel efficiency), X = wt (weight). "The points trend downwards, consistent with the linear correlation coefficient being negative." `cor(mtcars$wt, mtcars$mpg)` → −0.8676594.
- Handwritten: "mpg = −5.344·wt + 37.285", "line of best fit, 'regression line'"; R commands `library(lattice)`, `xyplot(mpg~wt, data=mtcars)`, or `xyplot(mpg~wt, data=mtcars, xlab="Weight (tons)", ylab="Fuel Efficiency (mpg)", main=paste0("Fuel Efficiency versus Weight for n = ", nrow(mtcars), " cars"), pch=19, cex=1, col="lightgreen", type=c("p","r"))` — "do data points ('p') and a regression line ('r')".

## demo_notebook_Unit_02.Rmd
- `library(mosaic); library(dplyr); library(MASS)`; `BCIT.students <- read.csv(file.path(Sys.getenv("MATH_3042_ROOT"), "Data", "BCIT.students.csv"))`.
- `freq.tab <- table(...)`; `pie(freq.tab, radius=1.0, main=..., border="darkgrey")`; `barplot(freq.tab, col="lightgreen", ...)`; fancier barplot with `col=c("black","lightblue","brown","lightgreen","white"), border="black", main=paste("Eye Colour of Students ( n = ", nrow(BCIT.students), ")"), space=0.1, density=30, angle=30`.
- `stem(BCIT.students$Height.CM)`; `stem(BCIT.students$Height.CM, scale=0.5)` ("all leaves 0–9 under the same stem"); `stem(faithful$eruptions)`; `barplot(table(BCIT.students$Age), ...)`; `hist(BCIT.students$Age, col="lightblue")`; `hist(BCIT.students$Age, breaks=seq(18, 44, by=2), right = FALSE, ..., xaxp=c(15,45, 15))`; `hist(faithful$eruptions, breaks=seq(1.6, 5.2, by=0.2), right=FALSE, ..., xaxp=c(1.6, 5.2, 18), col="pink")`.
- Cumulative: `freq.distribution <- table(cut(faithful$eruptions, breaks=seq(1.6, 5.2, 0.2), right=FALSE, include.lowest=TRUE))`; `cumul.freq.dist <- cumsum(freq.distribution)`; `n.total <- nrow(faithful)`; `cumul.rel.freq.dist <- round(cumul.freq.dist / n.total, 3)`; `cbind(cumul.rel.freq.dist)`.
- Ogive: `upper.class.limits <- seq(1.599, 5.199, 0.2)`; `ogive.values <- c(0, cumul.rel.freq.dist)`; `plot(upper.class.limits, ogive.values, type="b", lwd=3, ylab="Cumulative Relative Frequency", xlab="Eruption Duration (min)", main="Ogive for Eruption Duration", xaxp=c(1.6, 5.2, 36), yaxp=c(0, 1, 20)); grid(); abline(v = 4.1, lty=3); abline(h = 0.55, lty=3); abline(h = 0.357, lty=3)`.
- Scatter: `plot(mtcars$wt, mtcars$mpg, type="p", main="Fuel Efficiency versus Weight for n = 32 cars", ylab=..., xlab=..., col="#66BD63", pch=19, lwd=1)`; `model <- lm(mtcars$mpg ~ mtcars$wt); abline(model, lty=3)`.

## Lab 2 (Lab_02_Notebook.Rmd, Sept 14 2026) with the solution outputs
- Not collected; "complete this lab to help prepare for upcoming quizzes and exams"; packages MASS, mosaic, dplyr; data `quine` (each row one child in Walgett, NSW; Days = days absent; Sex F/M; Eth A/N; Age F0–F3; Lrn AL/SL).
- `summary(X.vals)` for 9, 10, 8, 10, 11, 12, 11, 11 → Min. 8.00, 1st Qu. 9.75, Median 10.50, Mean 10.25, 3rd Qu. 11.00, Max. 12.00.
- Task 2: `summary(quine$Days)` → 0.00, 5.00, 11.00, 16.46, 22.75, 81.00; `sd(quine$Days)` → 16.25322. Table: X̄ 16.5, s 16.3, min 0.0, Q1 5.0, Q2 11.0, Q3 22.8, max 81.0.
- `favstats(~Days, data=quine)` → min 0, Q1 5, median 11, Q3 22.75, max 81, mean 16.4589, sd 16.25322, n 146, missing 0. `~Days` is a **model formula**. `favstats(Days~Lrn, data=quine)` → AL: 0, 5, 12, 22.5, 69, 15.81928, 13.91012, 83; SL: 0, 5, 10, 22.5, 81, 17.30159, 18.99035, 63 ("slow learners had a greater mean days absent (17.3) than average learners (15.8)").
- mosaic overrides: `mean(~X, data=)`, `median`, `sd`, `var`, `min`, `max`, `sum`, `IQR`, `quantile`, `favstats`, `histogram`, `bwplot`.
- Task 3: `round(mean(Days~Sex, data=quine), 1)` → F 15.2, M 18.0.
- Task 4: `Sk.all <- 3*(mean(~Days, data=quine) - median(~Days, data=quine))/sd(~Days, data=quine)` → 1.007598; grouped by Sex → F 0.9839306, M 0.7132158 (table: all 1.01, F 0.98, M 0.71).
- Histograms: Lab 1's `hist(TenMileRace$net, breaks=seq(2800, 10600, by=200), right=FALSE, col="pink", xlab="net (seconds)", main=paste0("Cherry Blossom Race (n = ", nrow(TenMileRace), ")"))` and the mosaic equivalent `histogram(~net, data=TenMileRace, type="count", ...)`. Task 5: `histogram(~Days, data=quine, type="count", col="#FF7256", breaks=seq(0, 85, by=5))`; "The long right tail is consistent with the high skewness (Sk = 1.01)".
- Box plots: `boxplot(TenMileRace$net, horizontal = TRUE, xlab="net time (sec)", main="Cherry Blossom Race times")`. Task 6: `bwplot(~Days, data=quine, horizontal=TRUE, xlab="Days Absent", main=paste0("Box plot of Days Absent (n =", nrow(quine), ")"))` (8 circles beyond the upper whisker).
- Task 7: `Q1 <- quantile(~Days, data=quine, prob=0.25); Q3 <- quantile(~Days, data=quine, prob=0.75); lower.fence <- Q1 - 1.5*(Q3 - Q1); upper.fence <- Q3 + 1.5*(Q3 - Q1); is.outlier <- (quine$Days > upper.fence) | (quine$Days < lower.fence); sum(is.outlier)` → 8 (fences −21.625 and 49.375; outliers 53, 53, 54, 57, 60, 67, 69, 81).
- `favstats(Days~Sex, data=quine)` → F: 0, 5.00, 10, 20.25, 81, 15.22500, 15.93100, 80; M: 0, 5.25, 14, 27.00, 69, 17.95455, 16.63401, 66. Observations: perfect attendance in both; boys more at each quartile; the max was female.
- Task 8: `bwplot(Days~Eth, data=quine)`; `favstats(Days~Eth, data=quine)` → A: 0, 6, 15, 32, 81, 21.23188, 17.71851, 69; N: 0, 4, 7, 16, 69, 12.18182, 13.56051, 77. "1. Aboriginal students tended to have more days absent (median and mean). 2. Aboriginal students had greater variability."
- `mean(Days~Eth+Sex, data=quine)` → A.F 20.92105, N.F 10.07143, A.M 21.61290, N.M 14.71429.
- Task 9 (solution groups by Eth+Sex although the task says Age and Sex): `CV.grouped <- sd(Days~Eth+Sex, data=quine) / mean(Days~Eth+Sex, data=quine)`; `names(which.min(CV.grouped))` → A.M most consistent; `which.max` → N.M least consistent (CVs A.F 0.942, A.M 0.705, N.F 0.895, N.M 1.179).
- Percentiles: `quantile(~Days, data=quine)` → 0, 5, 11, 22.75, 81; `probs=0.9` → 40; `probs=c(0.1, 0.9)` → 2, 40; `probs=seq(0.1,0.9, by=0.1)` → 2 5 5 7 11 14 20 27 40.
- Task 10: `quantile(Days~Lrn, data=quine, prob=c(0.2, 0.4, 0.6, 0.8))` → AL 5 8.8 16.0 27; SL 5 6.0 13.2 28 ("fairly small difference; 5 and 5 identical"); by Sex → F 5 6.6 13 23.2; M 5 10.0 16 30.0; by Eth → A 6 13 20.0 36.8; N 3 5 10.6 19.6. "Eth is associated with about twice as many days absence at each percentile level."
- Percentile rank: `head(percent_rank(quine$Days))` → 0.08965517 0.47586207 0.55862069 0.17931034 0.17931034 0.53793103; `head(round(100*percent_rank(quine$Days)))` → 9 48 56 18 18 54 ("the first student was absent more often than 9% of all students").
- Task 11: `is.F0.Male <- (quine$Sex=="M") & (quine$Age=="F0"); cbind(round(100*percent_rank(quine$Days)[is.F0.Male]))` → 9 48 56 18 18 54 70 72 31 66 99 0 0 9 37 48 52.
- `subset(quine, percent_rank(Days) > 0.75)` → 37 rows (Days 23 to 81).
- Task 12: `P25.students <- subset(quine, percent_rank(Days) < 0.25); round(prop.table(table(P25.students$Sex)), 3)` → F 0.622, M 0.378. "Female students are by far the larger fraction among the 25% with the fewest absences."
- Z-scores: `head(scale(quine$Days))` → −0.8896023 −0.3358659 −0.1512872 −0.7050235 −0.7050235 −0.2128134 ("0.89 standard deviations below the mean").
- Task 13: `Z.scores <- scale(quine$Days); sum(abs(Z.scores) > 1)` → 32; `> 2` → 8; `> 3` → 3.
- Task 14: `p1 <- sum(abs(Z.scores) <= 1)/n.students` → 0.7808219 ("too large"); p2 → 0.9452055 ("pretty close"); p3 → 0.9794521 ("too low"); Chebyshev checks `p1 >= 1 - 1/1^2`, `p2 >= 1 - 1/2^2`, `p3 >= 1 - 1/3^2` all TRUE. "The Empirical rule does not hold for Days, since it is not normally distributed; it is significantly skewed, as shown by Sk."

## Lab 2 pencil problems (answers from the solutions)
1. Plywood n = 18: `ideal.width <- (max-min)/sqrt(n)` → 0.005 (0.0052 rounded); min 0.732, max 0.754; `lower.limits <- seq(0.730, 0.750, by=0.005)`; `upper.limits <- lower.limits + 0.005 - 0.001`; `freqs <- cbind(table(cut(X.vals, breaks=seq(0.730, 0.755, by=0.005), right=FALSE)))` → classes 0.730–0.734: 1 (0.056); 0.735–0.739: 1 (0.056); 0.740–0.744: 5 (0.278); 0.745–0.749: 4 (0.222); 0.750–0.754: 7 (0.389).
2. IQ μ = 100, σ = 15: P2.5 = μ − 2σ = 70; P16 = μ − σ = 85; P50 = μ = 100; "P66 = μ + σ = 115" (by the 68–95–99.7 rule μ + σ is P84 = 50 + 34; the P66 label in the key looks like a typo); P97.5 = μ + 2σ = 130.
3. Gold (6195.20 6377.58 6374.78 6448.51 6439.12 6343.34 6231.64 6244.87 6023.88 6127.91): R = 424.63; `IQR(X.gold)` = 172.57 (R's `quantile()`: Q1 = 6204.31, Q3 = 6376.88); fences 5945.455 and 6635.735; `sum(is.outlier)` = 0. Hand method (medians of halves): Q1 = 6195.20, Q3 = 6377.58, IQR = 182.38, fences 5921.63 and 6651.15, still no outliers.
4. Ogive of 2287 Grade 8 language test scores (image `clipboard-4015313640.png`, points read: 5→0, 10→0, 15→0, 20→1.5, 25→5, 30→13, 35→24, 40→39, 45→60, 50→80, 55→97, 60→100 percent): (a) below 50 ≈ 80%; (b) between 30 and 40 ≈ 40% − 15% = 25%; (c) top 25% ≈ 48 to 60.

## Datasets exported for the widgets (`app/data-stats.js`)
Downloaded from the Rdatasets mirror (R is not installed on this machine) and checked against every number above: `faithful$eruptions` (272; mean 3.4878; quantile type 7: 2.16275, 4.0, 4.45425), `MASS::quine` (146 rows; all favstats, grouped quantiles, percent ranks, Z counts and fences reproduce the lab exactly), `BCIT.students.csv` (302; eye counts 95/52/130/10/15; Age classes 35, 94, 104, 53, 10, 2, 1, 0, 1, 0, 1, 0, 1; first 20 heights as on p.28), `mtcars` (32; r = −0.8676594, slope −5.3445, intercept 37.2851), `precip` (70), `MASS::cats` Bwt (144), the gold and plywood vectors, and the Netherlands ogive points.

## Discrepancies found while checking
- **Old Faithful frequency table.** An exact count of `[lower, upper)` classes gives 16, 5, 2, 3 for 2.2–2.399, 2.4–2.599, 2.6–2.799, 2.8–2.999 and 22, 17 for 4.6–4.799, 4.8–4.999, where the notes show 18, 3, 3, 2 and 28, 11 (both sum to 272; cumulative counts agree again from 3.0 on and at 4.0). The notes' numbers are what R's `hist(breaks=seq(1.6, 5.2, by=0.2))` prints, because `seq()` produces floating-point breaks such as 2.4000000000000004, 2.8000000000000003 and 4.800000000000001, so the data values exactly equal to 2.400, 2.800 and 4.800 fall into the class below. The lessons teach the notes' table (the quiz uses it) and flag this as a computer artifact.
- **IQ percentiles (pencil problem 2d).** The key labels μ + σ = 115 as P66; the 68–95–99.7 rule puts 84% below μ + σ, so 115 is P84. Taught as P84 with the key's label noted.
- **Task 9.** The task asks for grouping by Age and Sex; the solution groups by Eth and Sex (A.M most consistent, N.M least). The lesson reproduces the solution and says so.
- **Units.** The notes label Old Faithful eruptions as seconds in two places (axis label "Eruptions (sec)", "around 1.8 sec or 4.4 sec"); the variable is in minutes.
