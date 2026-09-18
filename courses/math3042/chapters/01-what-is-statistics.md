---
title: What statistics is (and its parts)
minutes: 12
---

## A little history

Statistics began in **18th-century Europe**, when states (governments) started collecting data about their citizens — that is literally where the name comes from (*state*-istics).

Two names the notes call out by name:

- **Ronald Fisher (1890–1962)** developed the foundational concepts and methods of *statistical inference*, working with genetics and agricultural data. His book *Statistical Methods for Research Workers* (1925) shaped scientific research to the present day.
- **Thomas Bayes (1701–1761)** gives his name to *Bayesian inference*, which in the last 50 years has become an important approach to data analysis in **machine learning**.

## The course definition

> Statistics is *the part of mathematics that uses data to find patterns and to inform decisions.*

Memorize that sentence — "patterns" (descriptive) and "decisions" (inferential) are literally the first two parts of statistics you will meet below.

## Why it matters in CST

Statistics and probability show up throughout *data science* (including *machine learning*), plus business, politics, and medicine. Sometimes it is the core feature of software you build: the notes give the example of the **Whoop app**, which evaluates your physical recovery from sleep data and heart-rate measurements.

## The survey example

The lecture uses a *data frame* (think: a table, one row per person, one column per measured variable) from R's `survey` dataset. With a table like that you can ask questions such as:

- What is the typical age of a student?
- Do most students exercise?
- Are students who smoke more or less likely to exercise?

Answering the first kind of question is descriptive statistics; answering the second kind (generalizing beyond just this table) drifts into inference and probability.

**R language:** the `$` operator pulls out a single column (variable) from a data frame:

```r
survey$Pulse
```

That returns every recorded pulse value as a vector.

## Two kinds of data

| Kind | Also called | Example |
|---|---|---|
| non-numerical | categorical / qualitative | `Smoke` |
| numerical | quantitative | `Age` |

:::quiz Quiz note
"Categorical" and "qualitative" are two names for the exact same thing (non-numerical data) — not two different kinds of data. Same for "numerical" and "quantitative."
:::

## The three parts of statistics

1. **Descriptive statistics** — methods for *summarizing and presenting* data sets (means, proportions, charts, ...).
2. **Inferential statistics** — methods for *drawing conclusions about a population* based on data from a *sample*.
3. **Probability theory** — the mathematical link between the other two. It is what lets you say "given what this sample looks like, here is how confident I can be about the whole population."

## Vocabulary: variable, individual, population, sample

- **Variable $X$** — the thing being measured, e.g. $X$ = Age of a BCIT student. It takes different values depending on which individual you measure.
- **Individual** — one member of the population (one student, one part, one day).
- **Population** — the entire group you actually care about.
- **Sample** — a subset of the population that you actually managed to measure.

Quite often you cannot measure $X$ for the whole population, so you measure a sample instead. That single fact is why the course draws a hard line between two kinds of numbers:

- **Parameters** summarize $X$ for the **whole population**.
- **Statistics** summarize $X$ for a **sample**.

## Symbol table

The same concept gets two symbols depending on whether it describes a sample or the population. This table comes back constantly for the rest of the course.

| Concept | Sample (statistic) | Population (parameter) |
|---|---|---|
| Mean | $\bar{X}$ | $\mu$ |
| Standard deviation | $s$ | $\sigma$ |
| Proportion | $\hat{p}$ | $p$ |
| Correlation | $r$ | $\rho$ |
| Size | $n$ | $N$ |

:::warn Quiz note
A **statistic** describes a **sample**; a **parameter** describes the **population**. It is easy to mix these up under time pressure — read the question for the word "sample" or "population" before answering.
:::

## Try it

```quiz
[
  {
    "q": "\\(X = \\) Smoke (yes/no) for a student is what kind of data?",
    "options": ["numerical (quantitative)", "non-numerical (categorical / qualitative)", "a parameter", "a statistic"],
    "answer": 1,
    "explain": "Smoke has non-numerical values (yes/no), so it is categorical, also called qualitative."
  },
  {
    "q": "\\(X = \\) Age of a student is what kind of data?",
    "options": ["categorical", "numerical (quantitative)", "a population", "a sample"],
    "answer": 1,
    "explain": "Age is a number, so it is numerical, also called quantitative."
  },
  {
    "q": "You measure the mean age of 40 randomly chosen BCIT students out of 20,000 enrolled. The number 22.6 you compute is a...",
    "options": ["parameter", "statistic", "population", "probability"],
    "answer": 1,
    "explain": "It summarizes a sample (the 40 students), not the whole population, so it is a statistic ($\\bar{X}$), not a parameter."
  },
  {
    "q": "If you somehow measured the mean age of every one of the 20,000 enrolled students, that number would be called $\\mu$ and is a...",
    "options": ["statistic", "parameter", "sample", "variable"],
    "answer": 1,
    "explain": "A number summarizing the entire population is a parameter, denoted $\\mu$ for a mean."
  },
  {
    "q": "\"Categorical\" and \"qualitative\" describe two different kinds of data.",
    "type": "tf",
    "answer": false,
    "explain": "They are two names for the same thing: non-numerical data. The other kind is numerical, also called quantitative."
  },
  {
    "q": "Which part of statistics provides methods for summarizing and presenting a data set (e.g. computing a mean or drawing a chart)?",
    "options": ["Inferential statistics", "Probability theory", "Descriptive statistics", "Bayesian inference"],
    "answer": 2,
    "explain": "Descriptive statistics summarizes and presents; inferential statistics draws conclusions about a population from a sample."
  },
  {
    "q": "Which part of statistics provides methods for drawing conclusions about a population from a sample?",
    "options": ["Descriptive statistics", "Inferential statistics", "Probability theory", "Data collection"],
    "answer": 1,
    "explain": "That is the definition of inferential statistics."
  },
  {
    "q": "Probability theory is described in the notes as...",
    "options": ["a completely separate subject from statistics", "the mathematical link between descriptive and inferential statistics", "only used for gambling problems", "a synonym for descriptive statistics"],
    "answer": 1,
    "explain": "Probability theory connects the two: it is what justifies going from a sample summary to a population conclusion."
  },
  {
    "q": "In R, `survey$Pulse` uses the `$` operator to...",
    "options": ["multiply two variables", "access a single variable (column) of the data frame `survey`", "compute the mean of the Pulse variable", "filter rows of the data frame"],
    "answer": 1,
    "explain": "`$` pulls out one named column/variable from a data frame."
  },
  {
    "q": "Ronald Fisher's 1925 book that heavily influenced scientific research was titled...",
    "options": ["Bayesian Inference for Beginners", "Statistical Methods for Research Workers", "The Design of Experiments", "Principles of Probability"],
    "answer": 1,
    "explain": "*Statistical Methods for Research Workers* (1925) is the book named in the notes."
  }
]
```
