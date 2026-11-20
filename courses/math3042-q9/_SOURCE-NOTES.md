# math3042-q9 — sources

Scoped and built 2026-11-19 for Quiz 9. The design is `spec/math3042/q9/OUTLINE.md`; the writer brief is `spec/math3042/q9/WRITER-BRIEF.md`; the animation brief is `spec/math3042/q9/WIDGET-BRIEF.md`; every number is recomputed by `spec/math3042/q9/verify.py` (all gitignored).

## Scope

The instructor's announcement, verbatim:

> The quiz this week covers: Sampling Distribution of p-hat and X-bar (lecture notes sections 6.1 and 6.3, up to pg 93; Lab 9). Confidence intervals for p-hat (lecture notes section 6.2; Unit 7 practice problems). Normality testing with QQ plot (see Lab 9).

Of the practice sheet titled "Unit 7 – Confidence Intervals", only problems 1 and 2 are about a proportion; 3 to 7 use the t distribution (section 6.4) and are left out. Lesson 09 (a probability about X-bar) uses page 94, one page past the announced range, and says so.

## Format

Part 1 on paper with a calculator, 10 marks; Part 2 in RStudio, 10 marks; formula sheet and Z table supplied. This is the pattern of every earlier quiz in the course. The instructor posted a Part 2 notebook template and a data file (`heights.csv`) with the week's material; lesson 15 walks through that template. Which column the quiz calls X and the exact wording are not known before the quiz.

## Sources (raw material in `D:\BCIT\MATH3042`)

- `MATH_3042_Lecture_Unit_06 (filled).pdf`, printed pages 86 to 94 (the instructor's handwritten fill-ins).
- `Lab_09_Notebook_Solutions.pdf` and `Lab_Assignment_9/Lab 9/` (the notebook and the QQ plot pictures).
- `Unit_07_Practice_Problems.pdf` (problems 1 and 2 with their answers).
- The formula sheet (pages 3 and 4) and `standard-normal-table.pdf`.
- `Quiz_9_Part_2_V1.Rmd` (headings only) and `heights.csv` (3000 rows: `height_cm`, `age`, `sex`).

## Decisions

- The shape rule is taught as "n is 30 or more", as the notes and the lab write it; the formula sheet prints `n > 30`, which lesson 08 states once.
- The sample-size example: the notes write 16589 and then "at least 16600"; the exact value is 16589.44, so the lessons teach rounding up to 16590 and accept the notes' 16600.
- The notes round the elevator Z to 2.9 (0.0019); Z = 2.87 gives 0.0021. Both are shown.
- The hand interval is the Wald interval; R's `prop.test` prints the Wilson interval. One sentence in lesson 05.
- The module's organising picture ("the pile") and the four film-style animations follow the student's request for an explainer in the style of an animated video.
- Numbers for `heights.csv` were computed in Python from the file; R was not run.
