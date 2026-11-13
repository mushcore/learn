---
title: "Quiz 8: the format, the marks, and the path"
minutes: 5
---
<!-- facts: none; a reference page about the quiz format, with no worked examples -->
Quiz 8 is in your next lab session. This page says what it covers, how the past quizzes in this course were written, where the 20 marks are likely to come from, and which lesson drills each part.

## All of Unit 5: three continuous distributions

The quiz covers **all of Unit 5, continuous probability distributions.** A continuous variable is a measurement, such as a wait or a voltage, and its probabilities are areas under a curve. Unit 5 has three of them:

- **Uniform**: a flat rectangle. Every value between two limits is equally likely, just like your wait for a bus when you arrive at a random moment.
- **Normal**: a bell, highest in the middle and the same on both sides, just like adult heights.
- **Exponential**: a curve that starts high at 0 and falls, just like the time until the next call reaches a help desk.

## Two parts, 50 minutes, 20 marks

| Part | What you do | Marks |
|---|---|---|
| Part 1 | Paper and pencil, no computer, a calculator | 10 |
| Part 2 | Open the template notebook from Learning Hub in RStudio, fill in the code, knit it to a Word file | 10 |
| Both | 50 minutes in the lab session; no makeups | 20 |

```diagram
{"type": "flow", "title": "Quiz 8 in the lab session", "nodes": [{"id": "p1", "label": "Part 1 on paper", "sub": "calculator · 10 marks"}, {"id": "p2", "label": "Part 2 in RStudio", "sub": "knit to Word · 10 marks"}, {"id": "end", "label": "50 minutes", "kind": "pill", "sub": "no makeups"}], "edges": [{"from": "p1", "to": "p2"}, {"from": "p2", "to": "end"}], "hi": ["p1", "p2"], "caption": "Bring a calculator. Part 2 uses the lab computers with RStudio."}
```

**Part 2 is marked on the knitted Word file, and Knit re-runs every chunk from the top in a fresh session.** So every `library` line, including the one for `mosaic`, which holds `histogram`, must sit in the first chunk. Knit once at the start with the template as it is, then again after every part; the full advice is in [the Quiz 7 start page](#/math3042-q7/start-here).

## How the past quizzes are written

Quiz 6 and Quiz 7 were built the same way. Each habit below comes with what to do about it.

1. **Part 1 is out of 10 and Part 2 out of 10, in 50 minutes.** Spend about 25 minutes on each part, and leave Part 2 time to knit.
2. **Part 1 opens with one short story, often with a picture, and every question hangs off it.** Read the story once, then write down each number it gives with its meaning before you start.
3. **The parts chain: an answer from one part becomes the input of the next.** Carry each answer with 4 decimals. A slip early on costs marks later, so check each answer before you move on.
4. **Marks are in brackets, 1 to 3 per part.** A 1-mark part wants one line; a 3-mark part wants a set-up, a formula and an answer.
5. **Each solution is the formula in symbols, the same line with the numbers in, and the result boxed to 4 decimals.** Write all three. Just like a receipt with the items listed: the total alone shows the marker nothing to give part marks for.
6. **One part asks whether a value is "statistically unusual", answered YES or NO with a calculation.** The solutions compute $Z = (x - \mu)/\sigma$ and call the value unusual when Z is below −2 or above 2. Write the Z, then the word.
7. **The two versions of a quiz differ only in their numbers.** The shapes in the mocks here are the shapes to expect.
8. **Part 2 is a notebook with lettered parts on the lab's scenario, with changed numbers.** Each part is one to three lines of R, and the last part asks for one sentence of explanation. The lab for Unit 5 is the one to rehearse: a uniform wait, an exponential wait and normal battery voltages.

## On paper, normal answers come from the Z table

The notes solve every normal example with a printed Z table: you turn the value into Z, **round Z to 2 decimals**, and read the area to the left of it. R does not round Z, so **a table answer and an R answer can differ in the third or fourth decimal.**

For example, the notes find the share of IQ scores at or below 120 both ways: 0.9082 from the table and 0.9088 from R. Both are the instructor's own answers. On paper, give the table answer.

## Where the marks come from

| Likely question | Lesson that drills it | Minutes |
|---|---|---|
| Area as probability; one exact value has probability 0 | [Probability is an area](#/math3042-q8/area-is-probability) | 10 |
| Uniform areas, mean and standard deviation | [Uniform on paper](#/math3042-q8/uniform-on-paper) | 10 |
| μ and σ from the story; Z; is a value unusual, YES or NO | [The normal curve](#/math3042-q8/normal-curve) | 10 |
| Normal probabilities by table: left, right, between | [The Z table](#/math3042-q8/z-table) and [Any normal on paper](#/math3042-q8/normal-on-paper) | 24 |
| A percentile or cut-off value from a percentage | [From a percentage back to a value](#/math3042-q8/normal-backwards) | 12 |
| A chain: a normal answer used as a binomial p | [Two-step questions](#/math3042-q8/normal-two-step) | 10 |
| Exponential with β taken from a rate; a tail; between | [Exponential on paper](#/math3042-q8/exponential-on-paper) | 12 |
| Exponential percentile; the memoryless fact | [Exponential backwards and memoryless](#/math3042-q8/exponential-percentile-memoryless) | 12 |
| Part 2: `punif`, `pnorm`, `pexp` | [The p functions](#/math3042-q8/r-p-functions) | 10 |
| Part 2: `qnorm`, `qexp`, quartiles and IQR | [The q functions](#/math3042-q8/r-q-functions) | 8 |
| Part 2: simulate, the `histogram`, the simulated share, one sentence of comparison | [runif, rexp, rnorm](#/math3042-q8/r-simulate-continuous) | 10 |

## The three-hour path

1. [Before you start](#/math3042-q8/pre-reading): 8 minutes.
2. This page: 5 minutes.
3. [Probability is an area](#/math3042-q8/area-is-probability): 10 minutes.
4. [Uniform on paper](#/math3042-q8/uniform-on-paper): 10 minutes.
5. [The normal curve](#/math3042-q8/normal-curve): 10 minutes.
6. [The Z table](#/math3042-q8/z-table): 12 minutes.
7. [Any normal on paper](#/math3042-q8/normal-on-paper): 12 minutes.
8. [From a percentage back to a value](#/math3042-q8/normal-backwards): 12 minutes.
9. [Two-step questions](#/math3042-q8/normal-two-step): 10 minutes.
10. [Exponential on paper](#/math3042-q8/exponential-on-paper): 12 minutes.
11. [Exponential backwards and memoryless](#/math3042-q8/exponential-percentile-memoryless): 12 minutes.
12. [The p functions](#/math3042-q8/r-p-functions): 10 minutes.
13. [The q functions](#/math3042-q8/r-q-functions): 8 minutes.
14. [runif, rexp, rnorm](#/math3042-q8/r-simulate-continuous): 10 minutes.
15. [Mock Quiz 8 A](#/math3042-q8/mock-quiz-8-a): 25 minutes, timed.
16. [Know cold for Quiz 8](#/math3042-q8/know-cold-q8): 5 minutes.
17. [Mock Quiz 8 B](#/math3042-q8/mock-quiz-8-b): when there is time, then the know-cold sheet once more.

## The long versions

- [Continuous random variables](#/math3042-u5/continuous-random-variables), [the uniform distribution](#/math3042-u5/uniform) and [pdf and cdf](#/math3042-u5/pdf-cdf).
- [The normal distribution](#/math3042-u5/normal-distribution), [the standard normal and the Z table](#/math3042-u5/standard-normal-z-table) and [normal applications](#/math3042-u5/normal-applications).
- [The exponential distribution](#/math3042-u5/exponential) and [the memoryless property](#/math3042-u5/exponential-memoryless).
- [Continuous distributions in R](#/math3042-u5/continuous-in-r).

```quiz
[
  {"q": "On Part 1, a normal probability comes from the Z table, with Z rounded to 2 decimals before the lookup.", "type": "tf", "answer": true, "explain": "The notes solve every normal example with the printed table. The table has one cell for each two-decimal z, so Z is rounded to 2 decimals first."},
  {"q": "The table gives 0.9082 for a normal probability and R's `pnorm` gives 0.9088. Why do they differ?", "options": ["The table uses Z rounded to 2 decimals; R uses the unrounded Z", "R uses a different normal curve from the table", "One of the two has a mistake in it", "The table gives the area to the right"], "answer": 0, "explain": "Here Z was 1.3333, and the table can only be read at 1.33. R keeps every digit. The instructor's own solutions show both answers; on paper, give the table answer."},
  {"q": "A part asks whether a value is \"statistically unusual\". What earns the marks?", "options": ["YES or NO, supported by the Z of the value", "YES or NO alone", "The probability of that exact value", "A sketch of the curve with no numbers"], "answer": 0, "explain": "The solutions compute $Z = (x - \\mu)/\\sigma$ and call the value unusual when Z is below −2 or above 2. Write the Z, then the word."},
  {"q": "Each Part 1 question stands alone, so an answer from part a is never needed in a later part.", "type": "tf", "answer": false, "explain": "Past quizzes chain their parts: an answer from one part becomes the input of the next. Carry it with 4 decimals."},
  {"q": "A probability works out to 0.45118836. How is it written on Part 1?", "options": ["0.4512", "0.45", "0.451", "0.45118836"], "answer": 0, "explain": "A probability is rounded to 4 decimals: **0.4512**. μ, σ and Z are rounded to 2."}
]
```
