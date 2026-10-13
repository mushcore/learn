---
title: Continuous random variables: why P(X = x) = 0
minutes: 12
---

Unit 4's random variables counted things: heads, defective chips, requests per minute. This unit's variables measure things, and a measured variable has so many possible values that no single one of them can carry any probability. Probability has to become area.

## A continuous random variable takes values on an interval

Slide wording: "If a random variable $X$ takes decimal values measured on an *interval* of real numbers, then $X$ is a *continuous* random variable and $X$ follows a *continuous probability distribution*."

**Definition.** *A continuous random variable $X$ takes values on an interval of the real number line. The number of possible $X$ values is therefore uncountably infinite.* The notes' example: $X$ = the weight of a random person (in kg).

Unit 4's variables were discrete: their values could be listed, $0, 1, 2, \ldots$. A weight cannot be listed. Between 85 kg and 86 kg sit 85.5, 85.25, 85.125 and every other decimal, with no gaps and no next value.

## Bars become a curve

The notes put the two kinds of distribution side by side.

- **Discrete probability distribution**: a bar histogram at $x = 0, 1, \ldots, 12$ with the tallest bar, about 0.20, at $x = 5$. Each bar's height is $P(X = x)$ and the heights add to 1.
- **Continuous probability distribution**: a bell curve over "Height (in cm)" with ticks at 154, 161, 168, 175, 182, 189, 196 and a vertical line at 175. The line marks $\mu = 175$ cm and the ticks are one $\sigma = 7$ cm apart.

The curve has no bars because there is nothing to give a height to: no single height value has a probability. Instead, the probability that $X$ lands between two values is the **area under the curve** between them, and the total area under the curve is 1. The empirical rule from Unit 1 is already a statement about areas: the area between 168 and 182 ($\mu \pm \sigma$) is 0.68.

## The observation: P(X = 85.000) = 0

Slide wording: "If $X$ is a continuous random variable on an interval $(a, b)$, then the probability of any individual $x$ is zero!" The example is $P(X = 85.000)$, illustrated with a dartboard.

The reason is the area picture. $P(X = 85.000)$ is the area over the interval from 85.000 to 85.000, an interval of width zero, and a region of width zero has area zero. "85.000" means exactly 85.000000… to every decimal place, not "85.0 to the precision of the scale". A scale reading of 85.0 really asks for $P(84.95 \le X \le 85.05)$, which is an interval and does have an area.

The dart lands somewhere on the board, so some point does get hit, yet every specific mathematical point has probability 0 of being hit. For a continuous variable, probability zero does not mean impossible.

## Area shrinking to zero as the bounds meet

```widget
pdf-area
{ "dist": "normal", "mu": 175, "sigma": 7, "lo": 171, "hi": 179, "showCdf": false, "title": "Height, μ = 175 cm, σ = 7 cm: the area between two bounds" }
```

The widget's "bring the bounds together" button slides the bounds toward each other: the shaded area falls toward 0 and reaches it when they coincide at a single height.

## ≤ and < are the same thing for a continuous variable

Because a single point has probability 0, including or excluding an endpoint changes nothing:

$$P(X \le b) = P(X < b), \qquad P(a \le X \le b) = P(a < X < b)$$

This is the opposite of Unit 4. For a binomial $X$, $P(X \le 4)$ includes the bar at 4 and $P(X < 4) = P(X \le 3)$ does not; the two differ by $P(X = 4)$, which is not zero. For a continuous $X$ the "bar" at 4 has no width, so "at most 4 minutes" and "less than 4 minutes" are the same question.

## The three distributions in this unit

Slide wording: "In this course, we will consider the following continuous probability distributions: Uniform, Normal, Exponential."

- **Uniform**: a flat density on $[a, b]$; every interval of the same length is equally likely. The bus wait.
- **Normal**: the bell curve, with $\mu$ and $\sigma$ as its parameters. Heights, IQ, measurement noise.
- **Exponential**: a right-skewed density starting at 0; the waiting time in a memoryless system. Time between web requests.

## Endpoints for a sprint time and a goal count

X = a sprinter's 100 m time in seconds, a continuous variable with P(X ≤ 11.2) = 0.64.

```quiz
[
  {"q": "P(X < 11.2) = ? (2 decimals)", "type": "numeric", "answer": 0.64, "tolerance": 0.006, "explain": "For a continuous X the single point 11.2 has probability 0, so excluding it changes nothing: P(X < 11.2) = P(X ≤ 11.2) = 0.64."},
  {"q": "P(X = 11.2) = ?", "type": "numeric", "answer": 0, "tolerance": 0.0001, "explain": "An exact value is an interval of width zero, so its area under the density is 0. A stopwatch reading of 11.2 is really an interval such as 11.15 to 11.25."},
  {"q": "Write P(X ≥ 11.2) as one subtraction with the number in, no spaces.", "type": "text", "answer": ["1-0.64", "1-.64", "1-0.6400"], "explain": "X ≥ 11.2 is the complement of X < 11.2, which has the same probability as X ≤ 11.2: 1 − 0.64 = 0.36."},
  {"q": "Y = the number of goals in a hockey game. Is Y discrete or continuous?", "type": "text", "answer": ["discrete"], "explain": "Goals are counted, 0, 1, 2, …: a countable set of values, so Y is discrete and its single values carry probability."},
  {"q": "For the goal count Y, P(Y ≤ 4) = 0.80 and P(Y = 4) = 0.12. P(Y < 4) = ? (2 decimals)", "type": "numeric", "answer": 0.68, "tolerance": 0.006, "explain": "For a discrete variable the bar at 4 has probability, so dropping it matters: P(Y < 4) = P(Y ≤ 4) − P(Y = 4) = 0.80 − 0.12 = 0.68. Only a continuous variable lets ≤ and < give the same answer."}
]
```

```quiz
[
  {
    "q": "Which of these random variables are continuous? Select all that apply.",
    "options": ["the number of children in a family", "the weight of a random person in kg", "the time you wait for a bus", "the number of http requests in a minute", "the voltage of a received signal"],
    "answer": [1, 2, 4],
    "explain": "Weight, waiting time and voltage are measured on an interval of real numbers and can take any decimal value; counts of children and requests can be listed 0, 1, 2, …, so they are discrete."
  },
  {
    "q": "For a continuous random variable $X$, $P(X = 85.000) = 0$ means that a weight of exactly 85.000 kg is impossible.",
    "type": "tf",
    "answer": false,
    "explain": "The dart does land somewhere, yet every specific point has probability 0: a single value is an interval of width zero, and a region of width zero has area zero. Probability zero is not impossibility for a continuous variable."
  },
  {
    "q": "$X$ is continuous. Which statement is correct?",
    "options": ["$P(X \\le b) = P(X < b)$ because $P(X = b) = 0$", "$P(X \\le b)$ is larger than $P(X < b)$ by $P(X = b)$", "$P(X < b)$ is larger than $P(X \\le b)$", "they cannot be compared without the density"],
    "answer": 0,
    "explain": "The endpoint carries no probability, so including or excluding it changes nothing. For a discrete variable the two do differ, by the bar at $b$."
  },
  {
    "q": "Heights are continuous with $\\mu = 175$ cm and $\\sigma = 7$ cm. What is $P(X = 175)$?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0.0001,
    "explain": "The probability of any individual value of a continuous variable is zero, even the mean. The curve is highest at 175, but height is density, not probability; probability is area, and a single point has no width."
  },
  {
    "q": "In the notes' height figure, what does the vertical line at 175 cm mark?",
    "options": ["the most common measured height in the sample", "the point where the curve crosses the axis", "the mean $\\mu$, with the ticks one $\\sigma = 7$ cm apart", "the upper limit of the usual range"],
    "answer": 2,
    "explain": "The ticks run 154, 161, …, 196 in steps of 7, centred on 175: $\\mu = 175$ and $\\sigma = 7$. The curve is symmetric about that line."
  },
  {
    "q": "For a discrete random variable such as a binomial count, $P(X \\le 4) = P(X < 4)$.",
    "type": "tf",
    "answer": false,
    "explain": "For a discrete variable the bar at 4 has probability $P(X = 4) > 0$, so $P(X \\le 4) = P(X < 4) + P(X = 4)$. Only for a continuous variable are the two equal."
  },
  {
    "q": "The probability that a continuous random variable falls between two values $a$ and $b$ is...",
    "options": ["the height of the curve halfway between $a$ and $b$", "the sum of the curve's heights at $a$ and at $b$", "always $(b - a)$", "the area under the curve between $a$ and $b$"],
    "answer": 3,
    "explain": "Bars become a curve, and the role of the bar heights is taken over by areas: $P(a \\le X \\le b)$ is the area under the density between $a$ and $b$, and the whole area is 1."
  },
  {
    "q": "How many possible values does a continuous random variable have?",
    "options": ["as many as the measuring instrument can display", "a countable list $0, 1, 2, \\ldots$", "uncountably infinitely many", "exactly $b - a$"],
    "answer": 2,
    "explain": "The notes' definition: values on an interval of the real number line, therefore uncountably infinite. That is why no single value can carry probability."
  }
]
```
