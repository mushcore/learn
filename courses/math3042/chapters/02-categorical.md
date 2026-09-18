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

Same idea as the statistic/parameter table from the last lesson: $\hat{p}$ from a sample, $p$ for the whole population.

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

::::warn Likely quiz trap
It is tempting to say "the mode is 130" — that's the *frequency*, not the mode. The mode is the **category name** (Brown), not the count.
::::

::::quiz Trap
A mean of a categorical variable like eye colour is meaningless: there is no numerical average of "Brown," "Blue," and "Green." Mean only makes sense for numerical data. For categorical data you use proportion and mode instead.
::::

## R language

Build a **named vector** of frequencies, then work with it directly:

```r
Eye.Color.Freq <- c(Black = 95, Brown = 130, Blue = 52, Green = 10, Other = 15)
n.sample <- sum(Eye.Color.Freq)          # 302
pie(Eye.Color.Freq)                      # quick visual
Eye.Color.Freq[["Brown"]] / n.sample     # 0.4305...
```

Frequencies straight from raw data use `table()`. From Lab 1, the `TenMileRace` data set's `sex` column:

```r
table(TenMileRace$sex)
```

```text
   F    M
4325 4311
```

The set of possible values a non-numerical variable can take (here, `"F"` and `"M"`) is called its **levels** in R — check with `levels(TenMileRace$sex)`.

## Try it

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
    "explain": "Mean requires numerical values to sum and divide. Categorical values like 'Brown' or 'Blue' cannot be added, so mean, and instead you use proportion and mode."
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
