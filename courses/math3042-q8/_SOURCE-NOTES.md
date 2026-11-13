# math3042-q8 — sources

Scoped and built 2026-11-13 for Quiz 8. The design is `spec/math3042/q8/OUTLINE.md`; the writer brief is `spec/math3042/q8/WRITER-BRIEF.md`; the number helpers are `spec/math3042/q8/ztab.py` (all gitignored).

## Scope

No announcement text is on file. The scope, "all of Unit 5", is the student's statement. Part 2 is assumed to follow Lab 8 (Continuous Probability Distributions), on the pattern of Quiz 6 (Part 2 on Lab 6) and Quiz 7 (Part 2 on the Lab 7 gopher data). The Z table is assumed to be supplied with the paper: the notes solve every normal example "using the table of standard normal probabilities" and Lab 8 has a "Z-table approach" part.

## Format

- Grade book: Quiz 6 and Quiz 7 were Part 1 out of 10 and Part 2 out of 10.
- Past papers with solutions (`D:\BCIT\MATH3042\MATH_3042_Quiz_06_*`, `MATH_3042_Quiz_07_*`, pages rendered in `pages/`): Part 1 is one premise with chained parts, marks in brackets, the formula, the substituted line and a boxed result to four decimals, and a YES/NO "statistically unusual" part answered with a Z score. Part 2 is a notebook template with lettered parts on the lab's scenario, ending in a written explanation. Graded stems, premises and numbers are not reproduced in this module.

## Numbers

Every instructor number in the lessons is from `D:\BCIT\MATH3042\`:

- `pages/u5-filled-full-01.png` to `-12.png`: the filled Unit 5 notes (pp. 74 to 85). Bus 0.1500, 0.40, 0.0000; Z examples 0.0250, 0.0099, 0.1555; IQ 0.9082 by table and `pnorm(120, 100, 15)` = 0.9087888; radiation 0.4032, 0.0968, 5.17 mrem; bit error 0.0116; web server 0.7981 and 7.49 s; bank teller 0.1859 twice and 2.77 min.
- `text/Lab_08_Notebook_Solutions.txt`: uniform 0.2987 simulated against 0.3000, mean 10, sd 5.7735; exponential β = 10: 0.4512, 0.6321, 0.2231, 0.2387, median 6.931, Q1 2.8768, Q3 13.8629, IQR 10.9861, Sk 0.9206, simulated 0.4529; normal μ = 9.01, σ = 0.05: 0.8849, 9.044, 0.6554, 0.4207, 0.9502, 9.092, 8.928, 8.976, simulated 0.9506, Z1 = −2.2, Z2 = 1.8.
  - A slip in the lab solutions: the hand formula for P(X < 6) is printed as 1 − e^(−6/10) = 0.2591818. That number is 1 − e^(−0.3). The correct value is 0.4512, which `pexp` printed. Lesson 09 says so.
- `demo_notebook_Unit_05.Rmd`: the instructor's R lines for the notes' examples. It is not knitted, so it prints no values; values quoted beside its lines are computed.
- `text/Unit_05_06_Practice_Problems.txt`: ungraded practice problems 1 to 11 with posted answers, reworked by the table method. Posted 1d (0.0652) and 5d (19.12 %) differ from the table method in the third decimal (0.0638, 0.1922); neither is used.
- `pages/formulas-03.png`: the formula sheet's Continuous section, copied into the formula-sheet boxes.

Everything else (the tiny cases, the practice items, the mock quizzes) is computed with plain Python by the writers; a table answer is `tab(z)` and R's answer is `phi(z)` in `ztab.py`. R is never run.

## Game facts used

- every lesson: `none`.
