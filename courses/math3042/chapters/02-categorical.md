---
title: "Categorical data: proportion & mode"
minutes: 12
---

For a **categorical** (non-numerical) variable $X$, you cannot average the values — "average eye colour" is meaningless. What you *can* do is **count** how many individuals fall into each category, then turn those counts into a **proportion**.

## Proportion

$$
\hat{p} = \frac{x}{n}
$$

where $x$ is the number of individuals in that category and $n$ is the sample size. That is the **sample** proportion. The **population** proportion uses capital letters:

$$
p = \frac{X}{N}
$$

Here $X$ is the **count** in the category across the whole population, not the variable $X$ of lesson 1; the notes reuse the letter.

| | Sample | Population |
|---|---|---|
| count in category | $x$ | $X$ |
| total | $n$ | $N$ |

## Worked example: eye colour

A sample of BCIT students gives these counts for $X$ = Eye Colour:

| Category | Frequency |
|---|---|
| Black | 95 |
| Brown | 130 |
| Blue | 52 |
| Green | 10 |
| Other | 15 |

Sample size: $n = 95 + 130 + 52 + 10 + 15 = 302$.

Sample proportion of Brown-eyed students:

$$
\hat{p}(\text{Brown}) = \frac{130}{302} = 0.4305 = 43.05\%
$$

```widget
proportion
{ "categories": { "Black": 95, "Brown": 130, "Blue": 52, "Green": 10, "Other": 15 } }
```

## The mode

For a **non-numerical** variable, the **mode** is just its most frequent value. No formula needed — count the categories and pick the biggest.

In the eye-colour example, Brown has the highest frequency (130 out of 302), so **the modal value is Brown**.

:::warn Likely quiz trap
The mode is the **category name** (Brown), not its frequency (130).
:::

## R language

Build a **named vector** of frequencies, then work with it directly:

```r
Eye.Color.Freq <- c(Black = 95, Brown = 130, Blue = 52, Green = 10, Other = 15)
n.sample <- sum(Eye.Color.Freq)          # 302
pie(Eye.Color.Freq)                      # quick visual
Eye.Color.Freq[["Brown"]] / n.sample     # 0.4305...
```

:::info R syntax
| Code | What it does |
|---|---|
| `Eye.Color.Freq <- …` | `<-` is assignment: it stores the result under the name `Eye.Color.Freq`. The dots are just part of the name. |
| `c(Black = 95, Brown = 130, …)` | `c()` combines values into one vector; writing `name = value` gives each value a name, so this is a named vector of five counts. |
| `# 302` | `#` starts a comment: R ignores everything after it on the line. |
| `n.sample <- sum(Eye.Color.Freq)` | `sum()` adds every value in the vector; the total is stored in `n.sample`. |
| `pie(Eye.Color.Freq)` | Draws a pie chart, one slice per value, labelled with the vector's names. |
| `Eye.Color.Freq[["Brown"]]` | `[[ ]]` pulls out a single element by name, as the bare number 130 without its name. |
| `/ n.sample` | `/` divides: the Brown count over the total. |

**Left to right**

- `Eye.Color.Freq <- c(…)`: "Store under the name Eye.Color.Freq (`Eye.Color.Freq <-`) the combination (`c`) of the counts Black 95 (`Black = 95`), Brown 130 (`Brown = 130`), Blue 52 (`Blue = 52`), Green 10 (`Green = 10`) and Other 15 (`Other = 15`)."
- `n.sample <- sum(Eye.Color.Freq)`: "Store under the name n.sample (`n.sample <-`) the total (`sum`) of the counts (`Eye.Color.Freq`)."
- `pie(Eye.Color.Freq)`: "Draw a pie chart (`pie`) of the counts (`Eye.Color.Freq`)."
- `Eye.Color.Freq[["Brown"]] / n.sample`: "The count (`Eye.Color.Freq`) picked out by the name Brown (`[["Brown"]]`), divided by (`/`) the sample size (`n.sample`)."

**Right to left**, the order R runs it

- `Eye.Color.Freq <- c(…)`: "Pair each count with its name (`Black = 95`, `Brown = 130`, `Blue = 52`, `Green = 10`, `Other = 15`), combine them into one named vector (`c`), and store it as Eye.Color.Freq (`Eye.Color.Freq <-`)."
- `n.sample <- sum(Eye.Color.Freq)`: "Take the counts (`Eye.Color.Freq`), add them up (`sum`), and store the total as n.sample (`n.sample <-`)."
- `pie(Eye.Color.Freq)`: "Take the counts (`Eye.Color.Freq`) and draw them as a pie chart (`pie`)."
- `Eye.Color.Freq[["Brown"]] / n.sample`: "Take the counts (`Eye.Color.Freq`), pull out the bare Brown count (`[["Brown"]]`), fetch the sample size (`n.sample`), and divide the first by the second (`/`)."
:::

Frequencies straight from raw data use `table()`. From Lab 1, the `TenMileRace` data set's `sex` column:

```r
table(TenMileRace$sex)
```

```text
   F    M
4325 4311
```

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$sex` | `$` picks the `sex` column of the `TenMileRace` data frame. |
| `table(…)` | Counts how many times each distinct value appears. The output lists each level with its count underneath. |

**Left to right**

- "The tally of how often each value appears (`table`) in the sex column (`sex`) of the race data (`TenMileRace$`)."

**Right to left**, the order R runs it

- "Take the race data (`TenMileRace`), pull out its sex column (`$sex`), and count how often each value appears (`table`)."
:::

The set of possible values a non-numerical variable can take (here, `"F"` and `"M"`) is called its **levels** in R — check with `levels(TenMileRace$sex)`.

:::info R syntax
| Code | What it does |
|---|---|
| `TenMileRace$sex` | `$` picks the `sex` column of the `TenMileRace` data frame. |
| `levels(…)` | Lists the allowed values of a categorical column (R calls such a column a factor) as text strings. |

**Left to right**

- `levels(TenMileRace$sex)`: "The allowed values (`levels`) of the sex column (`sex`) of the race data (`TenMileRace$`)."

**Right to left**, the order R runs it

- `levels(TenMileRace$sex)`: "Take the race data (`TenMileRace`), pull out its sex column (`$sex`), and list its allowed values (`levels`)."
:::

## Proportions and the mode for a commute survey

A sample of BCIT students reported how they get to campus: Bus 74, Car 41, SkyTrain 88, Bike 12, Walk 25.

```quiz
[
  {"q": "What is the sample size $n$?", "type": "numeric", "answer": 240, "tolerance": 0, "explain": "Add the frequencies: $74 + 41 + 88 + 12 + 25 = 240$."},
  {"q": "Compute the sample proportion of SkyTrain riders. (4 decimals)", "type": "numeric", "answer": 0.3667, "tolerance": 6e-05, "explain": "$\\hat{p}(\\text{SkyTrain}) = x/n = 88/240 = 0.366667 \\approx 0.3667$, or 36.67%."},
  {"q": "Which symbol labels the number you just computed?", "type": "text", "answer": ["p̂", "p hat", "p-hat", "phat", "\\hat{p}", "p^"], "explain": "It describes a sample, so it is the statistic $\\hat{p} = x/n$ (read p-hat). The population proportion would be $p = X/N$."},
  {"q": "What proportion of the sample takes the Bus or walks? (4 decimals)", "type": "numeric", "answer": 0.4125, "tolerance": 6e-05, "explain": "Both categories share the same $n$, so add the counts first: $(74 + 25)/240 = 99/240 = 0.4125$."},
  {"q": "What is the modal way of getting to campus?", "type": "text", "answer": ["SkyTrain", "Sky Train", "skytrain"], "explain": "SkyTrain has the largest frequency, 88. The mode is the category name, not the count 88."},
  {"type": "fill", "q": "Fill the blank so the line prints the proportion of cyclists.", "code": "Commute.Freq <- c(Bus = 74, Car = 41, SkyTrain = 88, Bike = 12, Walk = 25)\nCommute.Freq[[\"Bike\"]] / ___(Commute.Freq)\n## [1] 0.05", "answer": ["sum"], "explain": "`sum(Commute.Freq)` is $n = 240$, and `Commute.Freq[[\"Bike\"]]` is the bare count 12, so the line prints $12/240 = 0.05$."}
]
```

```quiz
[
  {
    "q": "Using the eye-colour sample (Black 95, Brown 130, Blue 52, Green 10, Other 15, $n=302$), what is $\\hat{p}(\\text{Blue})$? (4 decimals)",
    "type": "numeric",
    "answer": 0.1722,
    "tolerance": 0.001,
    "explain": "$\\hat{p}(\\text{Blue}) = 52/302 = 0.1722 = 17.22\\%$."
  },
  {
    "q": "What is $\\hat{p}(\\text{Brown})$ as a percentage?",
    "type": "numeric",
    "answer": 43.05,
    "tolerance": 0.1,
    "unit": "%",
    "explain": "$130/302 = 0.4305 = 43.05\\%$."
  },
  {
    "q": "What proportion of the sample has either Black or Brown eyes?",
    "type": "numeric",
    "answer": 0.7450,
    "tolerance": 0.001,
    "explain": "$(95+130)/302 = 225/302 = 0.7450 = 74.50\\%$. You can add category proportions together because they share the same $n$."
  },
  {
    "q": "What is the modal eye colour in this sample?",
    "type": "text",
    "answer": ["Brown"],
    "explain": "Brown has the highest frequency, 130, the most of any category."
  },
  {
    "q": "The mode of a categorical variable is the frequency of its most common category (e.g. 130), not the category name itself.",
    "type": "tf",
    "answer": false,
    "explain": "The mode **is** the category name (Brown). 130 is just how many individuals fall in that category."
  },
  {
    "q": "Why is a mean of eye colour meaningless?",
    "options": ["Because eye colour has too many categories", "Because eye colour is a categorical variable and has no numerical values to average", "Because the sample size is too small", "It isn't meaningless — you can average category codes"],
    "answer": 1,
    "explain": "Mean requires numerical values to sum and divide. Categorical values like 'Brown' or 'Blue' cannot be added, so there is no mean; describe categorical data with proportions and the mode instead."
  },
  {
    "q": "In R, `TenMileRace$sex` has levels `F` and `M` with counts 4325 and 4311. What R function produced those counts from the raw column?",
    "options": ["`mean(TenMileRace$sex)`", "`table(TenMileRace$sex)`", "`sum(TenMileRace$sex)`", "`levels(TenMileRace$sex)`"],
    "answer": 1,
    "explain": "`table()` counts occurrences of each level. `levels()` only lists the possible category names, it does not count them."
  },
  {
    "q": "In R, the possible values a non-numerical variable can take (like `\"F\"` and `\"M\"`) are called its...",
    "options": ["factors", "levels", "modes", "classes"],
    "answer": 1,
    "explain": "R calls the set of possible category values for a non-numerical variable its levels."
  },
  {
    "q": "For a sample proportion $\\hat{p} = x/n$, what does $x$ represent?",
    "options": ["the total sample size", "the number of individuals in that particular category", "the population size", "the number of categories"],
    "answer": 1,
    "explain": "$x$ is the count of individuals falling into the category of interest, and $n$ is the total sample size."
  },
  {
    "q": "`Eye.Color.Freq <- c(Black=95, Brown=130, Blue=52, Green=10, Other=15)` creates what kind of R object?",
    "options": ["a data frame", "a named vector", "a list of functions", "a factor with no values"],
    "answer": 1,
    "explain": "`c(name = value, ...)` builds a named vector, letting you index by name like `Eye.Color.Freq[[\"Brown\"]]`."
  }
]
```
