# MATH 3042 Unit 1 — instructor's worked answers (transcribed from the "filled" lecture PDF)

Source files: `D:/BCIT/MATH3042/MATH_3042_Lecture_Unit_01.pdf` (readable text), `MATH_3042_Lecture_Unit_01 (filled).pdf` (handwritten answers, transcribed below), `demo_notebook_Unit_01.Rmd` (R code), `Lab_01_Notebook.Solutions.pdf` (lab tasks + pencil problems with answers).

## p.4 Categorical
- p̂ = x/n (x = # individuals in category in sample, n = sample size); p = X/N for population.
- Eye colour: Black 95, Brown 130, Blue 52, Green 10, Other 15 → n = 302. p̂(Brown) = 130/302 = **0.4305 = 43.05%**. Mode = **Brown** ("the modal value is Brown").

## p.5 Mean
- X̄ = ΣX/n (statistic), μ = ΣX/N (parameter). Instructor wrote "average" beside Mean.
- Ages 22, 19, 20, 22, 35, 19, 21, 23 → ΣX = 181, X̄ = **22.625**. R: `mean(c(...))`.

## p.6 Grouped mean
- X̄ = Σ[fᵢXᵢ] / Σfᵢ, fᵢ = frequency, Xᵢ = class mark (midpoint).
- faithful$eruptions raw mean = **3.488** (min). Grouped: Xᵢ 1.75 2.25 2.75 3.25 3.75 4.25 4.75 5.25; fᵢ 51 41 5 7 30 73 61 4 → Σfᵢ = 272, Σ fᵢXᵢ = 951.5 → **3.498**.

## p.7 Median & mode
- Median denoted X̃ or Q₂. Odd n: exact middle. Even n: mean of two middle values.
- Examples written: 19,19,20,(22),23,25,50 → Q₂=22. 19,20,(23,27),29,30 → Q₂=(23+27)/2=25.
- First 10 faithful eruptions sorted: 1.800 1.950 2.283 2.883 3.333 3.600 3.600 4.350 4.533 4.700 → Q₂ = (3.333+3.600)/2 = **3.4665**.
- Mode of survey$Pulse = **80** (frequency 18). R: `as.double(names(which.max(table(survey$Pulse))))`.

## p.8–9 Variation
- R = max − min. Class ages: R = 35 − 18 = 17 years.
- s = √[Σ(X−X̄)²/(n−1)] (statistic); σ = √[Σ(X−μ)²/N] (parameter). "typical distance from the mean".
- 5.0 4.5 6.0 7.0 5.2 → X̄ = 5.54; Σ(x−x̄)² = 3.832; s = √(3.832/4) = **0.9788**.
- Notes: s uses n−1 so that s is a better approximation of σ (instructor: "s² is an unbiased estimator of σ²"); s uses X̄, σ uses μ; units of s, σ = units of X; sd depends on ALL data values (unlike R and IQR).
- CV = s/X̄ × 100% or σ/μ × 100%. Height: 5.2/165 × 100% = **3.15%**. Age: 3.5/20.2 × 100% = **17.3%** → "much higher relative variation in age".

## p.10–13 Empirical rule, Z
- Normal: μ±σ → 68%, μ±2σ → 95%, μ±3σ → 99.7% (figure: 68.27, 95.45, 99.73).
- IQ μ=100 σ=15: 68% in **85–115**, 95% in **70–130**, 99.7% in **55–145**.
- Z = (X−μ)/σ (population) or (X−X̄)/s (sample). "Z = how many standard deviations something is from the mean."
- Women μ=164.7, σ=7.1: X=175 → Z = **1.45**. X=178.9 → Z = **2.0** → % below = 95% + 2.5% = **97.5%** (left tail 2.5%).
- Z = 3.2 IQ → X = 100 + 3.2×15 = **148**. General: X = μ + Z·σ, X = X̄ + Z·s.
- Unusual if Z < −2 or Z > +2 → about 5% of individuals are unusual. Instructor note: "Outlier ≠ Unusual".
- Men μ=178.4, σ=7.6, LeBron 203 cm → Z = 24.6/7.6 = **3.24 > 2 → yes, unusual**. Unusual male heights: below **163.2 cm** or above **193.6 cm** (μ±2σ).

## p.14 Chebyshev
- For ANY variable, fraction with Z between −k and +k is at least 1 − 1/k².
- k=3: 1 − 1/9 = 0.8889 ≈ **89%** ("if normal it would be 99.7%"). k=1: 1 − 1 = **0%**; example attaining 0%: half the data at −10, half at +10, μ=0, σ=10 → no value has −1<Z<1.

## p.15–16 Quartiles, IQR, boxplot
- Q₁ = 1st quartile, Q₂ = median, Q₃ = 3rd quartile. faithful n=272, 25% of 272 = 68. Q₁ separates lower 68 / upper 204 → hand: (68th+69th)/2 = (2.150+2.167)/2 = 2.1585 (R gives 2.16275). Q₂ = (136th+137th)/2 = **4.000**. Q₃ = (204th+205th)/2 = **4.4585** (R: 4.45425). Instructor: "There are about 10 different ways to define quartiles. Slight disagreement is OK."
- IQR = Q₃ − Q₁ = range of the middle 50%. Advantage over R: ignores extreme values. Disadvantage over R: ignores extreme values (same fact, two sides).
- `quantile(faithful$eruptions)` → 0% 1.6, 25% 2.16275, 50% 4.0, 75% 4.45425, 100% 5.1 = five-number summary. Boxplot = visualization of it; box = middle 50%, whiskers to min/max (if no outliers).

## p.17 Sleep boxplots
- `boxplot(extra~group, data=sleep)`; `extra~group` is a "model formula". Conclusion: "Generally, the drug for group 2 was more effective than the drug for group 1 (not for all individuals)."

## p.18–19 Outliers
- Lower fence = Q₁ − 1.5×IQR, Upper fence = Q₃ + 1.5×IQR. Beyond a fence = outlier (drawn as circle/star); whiskers extend only to min/max inside fences.
- precip (70 US cities): Q₁ = 29.375, Q₃ = 42.775, IQR = 13.4 → lower fence **9.275**, upper fence **62.875**. Outliers: Mobile 67.0 (above); Phoenix 7.0, Reno 7.2, Albuquerque 7.8, El Paso 7.8 (below).

## p.20 Percentiles
- P_k separates lower k% from upper (100−k)%. Q₁ = P₂₅, Q₂ = P₅₀, Q₃ = P₇₅. R: `quantile(data$X, k/100)` ("specify the percentage as a decimal"). P₃₃ of faithful eruptions = **2.417** min → 33% below, 67% above.

## p.21–22 Skewness
- Pearson: Sk = 3(X̄ − Q₂)/s (or 3(μ − Q₂)/σ). Symmetric → mean = median → Sk = 0. Skewed left → mean < median → Sk < 0. Skewed right → mean > median → Sk > 0. Highly skewed if Sk < −1 or Sk > +1.
- cats$Bwt (n=144): Sk = 3(2.724 − 2.7)/0.4853 = **0.146 → skew right**. The moments-package formula: "ignore this".

## p.23–25 Correlation
- r = [nΣxy − ΣxΣy] / [√(nΣx² − (Σx)²) · √(nΣy² − (Σy)²)]; R: `cor(X, Y)`.
- Circuit data (n=12): x = 43 29 44 33 33 47 34 31 48 34 46 37; y = 32 20 45 35 22 46 28 26 37 33 47 30. Σx = 459, Σy = 401, Σxy = 15907, Σx² = 18075, Σy² = 14301 → r = **0.8324** (positive linear correlation).
- Properties: −1 ≤ r ≤ 1; unchanged by units; swapping X,Y no effect; only measures LINEAR relationships; r = sample, ρ = population. r=1 perfect positive, close to 1 strong positive, 0 none, close to −1 strong negative, −1 perfect negative. Correlation ≠ causation (ice cream vs boating accidents).

## Lab 1 pencil problems (answers)
1. Plywood n=18: mean 0.7457222, median 0.7475, range 0.022, s = 0.006560179.
2. Steel rods grouped (10.00:40, 10.01:75, 10.02:100, 10.03:90, 10.04:45): X̄ = 10.02071, s = 0.01200781.
3. Gold (10 days): mean 6280.683, median 6294.105, s = 139.7298; ±3s → 5861.493 to 6699.873; 0.3% chance outside.
4. Hank 62 ± 4.2, Pete 59 ± 4.1: CV Hank 6.774%, CV Pete 6.949% → Hank more consistent (smaller CV).
5. Moisture μ=18, σ=0.5: (a) Chebyshev 17–19 (k=2) ≥ 75%; (b) Empirical 95%; (c) > 19.5 (3σ) → 0.15%; (d) 18–18.5 → 34%; (e) < 19 → 97.5%.
6. Body temp μ=98.20, σ=0.62: 101.00 unusual, 96.90 unusual, 96.98 usual (usual range 96.96–99.44).
7. Sites: A mean 4.39, sd 2.5836, CV 58.85%; B mean 4.078, CV 77.04% → Site A higher & more consistent. B: mean±3s = −5.35 to 13.50; max 13.6 is beyond +3s → could be discounted. Removing min from A: mean 4.39→4.888 (increases), sd 2.5836→2.5463 (decreases).
