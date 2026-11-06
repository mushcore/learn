# math3042-q7 — sources

Scoped and built 2026-11-04 for Quiz 7 (this week's lab quiz). The design is `spec/math3042/q7/OUTLINE.md`; the writer brief is `spec/math3042/q7/WRITER-BRIEF.md` (both gitignored).

## The announcement (instructor email, verbatim)

> Yes, there will be a quiz this week (Nov 3, Nov 6).
> The topics will be a combination of past topics:
> Working with data in RStudio
> Poisson distribution
> Binomial distribution
> -Carl

## Format

- Grade book: Quiz 7 Part 1 out of 10, Part 2 out of 10.
- Course outline: lab quizzes are weekly, 50 minutes, in the lab session; "a paper-and-pencil part (no computer) and a part based on R programming (students may use lab computers running RStudio only)"; no makeups; exemption by email with a reason.
- Past quizzes (`D:\BCIT\MATH3042\MATH_3042_Quiz_0N_*.pdf`, pages rendered in `pages/`): Part 1 has 2 or 3 questions with marks in brackets and a boxed final number; Part 2 knits an R notebook (`Quiz_N_Part_2_V1.Rmd` from Learning Hub) to a Word file. Part 2 data so far: `SFU.Weather.xlsx` (Quiz 3), a `sample`/`replicate` simulation (Quiz 4), `survey` from `MASS` (Quiz 5). Graded stems are not reproduced in this module.

## Numbers

Every printed R value in the lessons is from the instructor's lab solutions in `D:\BCIT\MATH3042\text\`:

- `Lab_05_Notebook_Solutions.txt`: `read.csv(... colClasses=...)`, `filter(SFU.Weather, !is.na(Temp.deg.C), !is.na(Total.Precip.mm))`, 17582 rows after the filter, `mean(Temp.deg.C~Month, data=)`, `with()`, the `Temp.Seg` and `Season` `ifelse` segments, Task 5 `0.3439 0.3388 0.3174`, `has.Precip <- (Total.Precip.mm > 0)`, `weekdays()`.
- `Lab_06_Notebook_Solutions.txt`: 12-sided die, n = 30, p = 1/12: `choose(30,3)*(1/12)^3*(11/12)^27` → 0.2242; P(X ≤ 2) → 0.5383; Task 2: 0.02464, 0.9898, 0.03487, 0.01023, 0.7158; Task 3 (n = 100, p = 0.2): 0.04388, 0.9125, 0.8686, 0.1314, 0.5338; `X.vals <- 0:n; P.vals <- dbinom(X.vals, n, p); names(P.vals) <- X.vals; barplot(P.vals)`; `rbinom(1, 50, 0.13)`, `rbinom(10^5, n, p)`, `cbind(prop.table(table(...)))`.
- `Lab_07_Notebook_Solutions.txt`: Task 8 λ = 0.75 × 5 = 3.75; Task 9 `rpois(m, lambda)`; Task 10 (λ = 34): 0.06825, 0.2804, 0.2235, 0.2166, 0.2681, 0.6429, `ppois(34, lambda)^2` → 0.2975, `ppois(68, lambda*2)` → 0.5322.

Everything else (the tiny cases, the mock quizzes' numbers, μ and σ for the die) is computed with plain Python by the writers and labelled computed in the lesson; the checker scripts' outputs are in the writers' reports (session scratchpad, not kept).

## Game facts used

- `00-pre-reading.md`: `classic.scroll.tiers` (Intermediate scroll, 60 %).
- `02-binomial-on-paper.md`: `classic.scroll.tiers` (Intermediate scroll 60 %), `poe1.vaal.gem-outcomes` (+1 gem level 1/8), `poe1.price.currency-snapshot` (Vaal Orb 0.3195 chaos), `poe2.items.unid-rare-mod-count` (6 modifiers 1/12), `poe2.items.affix-limits` (three prefixes, three suffixes; gloss only).
- `03-at-least-at-most.md`: `gms.starforce.rates-0-14` (12 to 13 stars 40 %), `gms.starforce.star-catch` (v.271 caveat), `classic.scroll.tiers` (Greater scroll 10 %), `poe1.fusing.six-link-measured` (six-link about 1 in 1000 per orb, measured), `gms.scroll.chaos-outcomes` (+5 at 0.99 %).
- `06-r-probabilities-from-data.md`: `poe1.craft.evasion-boots-prefix-weights` (item level 83 evasion boots: 37 prefix tiers at weight 1000, 5 of them movement speed).
- `07-r-binomial-poisson.md`: `poe1.vaal.gem-outcomes` (+1 level 1/8), `gms.starforce.rates-0-14` (14 to 15 stars 30 %), `gms.starforce.star-catch` (v.271 caveat).
- every other lesson: `none`.
