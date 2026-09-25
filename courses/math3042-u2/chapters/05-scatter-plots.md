---
title: Scatter plots
minutes: 10
---

Everything so far in Unit 2 pictured **one** variable at a time. The last chart in the notes pictures **two**: *"When we measure two or more numerical variables for each individual/unit, then it is possible to create a scatter plot."*

## The idea

Call the two variables $X$ and $Y$. *"We simply plot one point $(X, Y)$ for each individual/unit."* That is the whole construction: $n$ individuals give $n$ dots, with $X$ on the horizontal axis and $Y$ on the vertical axis. No classes, no counting: the pattern of the dots is the summary.

Both variables must be numerical. A scatter plot of eye colour against height is not a thing; that would be a grouped box plot, which Lab 2 covers.

## The lecture example: fuel efficiency versus car weight

R's built-in data frame `mtcars` has 32 cars and eleven variables per car. The notes take $Y$ = `mpg` (fuel efficiency, miles per gallon) and $X$ = `wt` (weight). The first few rows:

| car | `wt` | `mpg` |
|---|---|---|
| Mazda RX4 | 2.620 | 21.0 |
| Datsun 710 | 2.320 | 22.8 |
| Hornet Sportabout | 3.440 | 18.7 |
| Cadillac Fleetwood | 5.250 | 10.4 |
| Honda Civic | 1.615 | 30.4 |
| Toyota Corolla | 1.835 | 33.9 |

Each row becomes one dot. The heavy Cadillac sits far right and low; the light Corolla sits far left and high. Over all 32 dots the picture *"trends downwards"*: heavier cars get fewer miles per gallon.

The notes connect this to Unit 1: **"The fact that the points trend downwards is consistent with the linear correlation coefficient being negative."**

```r
cor(mtcars$wt, mtcars$mpg)
```
```text
[1] -0.8676594
```

$r = -0.868$: a strong negative linear relationship (remember $-1 \le r \le 1$, and values near $-1$ mean the dots hug a downward line). If the dots trended upward, $r$ would be positive; a shapeless cloud gives $r \approx 0$. See [Linear correlation r](#/math3042/correlation) for the formula and the properties.

### The line through the dots

The dotted line on the chart is the **line of best fit**, which the instructor also calls the **"regression line."** He wrote its equation on the plot:

$$\text{mpg} = -5.344 \cdot \text{wt} + 37.285$$

Read it as: each extra unit of weight costs about 5.3 mpg. The notes say linear models are covered *"later in the course"*; for now you only need to recognize the line and its name. In R the demo notebook gets it from `lm()` and draws it with `abline()`:

```r
model <- lm(mtcars$mpg ~ mtcars$wt)
abline(model, lty=3)
```

## Drawing it in R: two ways

Base R, from the demo notebook, with the point style arguments spelled out:

```r
data(mtcars)

plot( mtcars$wt, mtcars$mpg,    #X and Y values
      type="p",
      main="Fuel Efficiency versus Weight for n = 32 cars",
      ylab="Fuel Efficiency (mpg)", xlab="Weight (tons)",
      col="#66BD63", pch=19, lwd=1)
```

`plot(x, y)` takes the $X$ vector first and the $Y$ vector second. `type="p"` means points, `pch=19` is the solid-dot symbol, `col` is the colour (a hex RGB code, the same kind Lab 2 asks for), and `xlab`/`ylab`/`main` label the axes and the chart.

The instructor then wrote the **lattice** version in the margin, which uses a model formula:

```r
library(lattice)
xyplot(mpg ~ wt, data = mtcars)
```

and the fully labelled form:

```r
xyplot(mpg ~ wt, data = mtcars,
       xlab = "Weight (tons)",
       ylab = "Fuel Efficiency (mpg)",
       main = paste0("Fuel Efficiency versus Weight for n = ", nrow(mtcars), " cars"),
       pch = 19, cex = 1,
       col = "lightgreen",
       type = c("p", "r"))
```

His annotation on the last line: `type = c("p", "r")` means **"do data points ("p") and a regression line ("r")."** So lattice draws the line of best fit for you in one argument. `cex = 1` is the point size, and `paste0()` again builds the title from `nrow(mtcars)` so the $n$ is not hard-coded.

:::quiz Which side of the ~ is Y?
The model formula `mpg ~ wt` reads "mpg **explained by** wt": the variable on the **left** of `~` is $Y$ (vertical axis), the one on the **right** is $X$ (horizontal). It is the same convention as `boxplot(extra ~ group)` in Unit 1 and `favstats(Days ~ Sex)` in Lab 2. In base `plot(x, y)` the order is the opposite: $X$ first.
:::

:::tip Units on the axis
The notes label the weight axis "Weight (tons)". R's own documentation for `mtcars` says `wt` is in thousands of pounds (a 3.44 there is 3440 lb, about 1.7 tons). Use the label the notes use; the shape of the plot and the correlation do not depend on the unit.
:::

## Try it

This is the real `mtcars` data, all 32 cars, with the live $r$ and the line of best fit computed underneath. Drag a point and watch $r$ change: pull the Cadillac up to 30 mpg and the correlation weakens; drag the light cars down and it flips sign. Then switch to the Unit 1 circuit preset for comparison.

```widget
scatter-corr
{ "preset": "mtcars: wt vs mpg (Unit 2)", "title": "mtcars: fuel efficiency versus weight (drag the points)" }
```

```quiz
[
  {"q": "A scatter plot requires how many numerical variables measured on each individual?", "options": ["Two", "One", "At least three", "None; it uses categories"], "answer": 0, "explain": "'When we measure two or more numerical variables for each individual/unit, then it is possible to create a scatter plot': one point (X, Y) per unit."},
  {"q": "In the mtcars example, which variable is Y (vertical axis)?", "options": ["`mpg` (fuel efficiency)", "`wt` (weight)", "`cyl`", "the car's name"], "answer": 0, "explain": "The notes set Y = mpg and X = wt: fuel efficiency is plotted against weight."},
  {"q": "The mtcars points trend downwards. What does that say about the linear correlation coefficient?", "options": ["It is negative", "It is positive", "It is zero", "It is greater than 1"], "answer": 0, "explain": "A downward trend is consistent with r < 0; here cor(mtcars$wt, mtcars$mpg) = -0.868."},
  {"q": "What is `cor(mtcars$wt, mtcars$mpg)`? (3 decimals)", "type": "numeric", "answer": -0.868, "tolerance": 0.002, "explain": "R prints -0.8676594: a strong negative linear relationship."},
  {"q": "The dotted line drawn through the mtcars points is called the...", "type": "text", "answer": ["regression line", "line of best fit", "the regression line", "the line of best fit", "best fit line"], "explain": "The instructor labels it 'line of best fit' and 'regression line'; its equation is mpg = -5.344 wt + 37.285 (covered properly later)."},
  {"q": "Using the fitted line mpg = -5.344 wt + 37.285, what mpg does it predict for a car with wt = 3? (1 decimal)", "type": "numeric", "answer": 21.3, "tolerance": 0.1, "explain": "$-5.344 \\times 3 + 37.285 = -16.032 + 37.285 = 21.25 \\approx 21.3$."},
  {"q": "In `xyplot(mpg ~ wt, data = mtcars)`, which variable goes on the horizontal axis?", "options": ["`wt`, the variable to the right of ~", "`mpg`, the variable to the left of ~", "Whichever is listed first in the data frame", "Neither; xyplot draws a box plot"], "answer": 0, "explain": "A model formula reads Y ~ X: the left side is Y (vertical), the right side is X (horizontal)."},
  {"q": "What does `type = c(\"p\", \"r\")` do in the lattice `xyplot` call?", "options": ["Draws the data points and a regression line", "Draws points in red", "Prints the correlation r", "Reverses the axes"], "answer": 0, "explain": "The instructor's note: do data points ('p') and a regression line ('r')."},
  {"q": "In base R, `plot(mtcars$wt, mtcars$mpg)` puts `mtcars$wt` on the vertical axis.", "type": "tf", "answer": false, "explain": "plot(x, y) takes X first: wt is horizontal, mpg is vertical. (The formula version mpg ~ wt puts Y first instead.)"},
  {"q": "Which of these could be shown with a scatter plot? (select all)", "options": ["Height vs weight of students", "Car weight vs fuel efficiency", "Eye colour vs height", "Test score vs hours studied"], "answer": [0, 1, 3], "explain": "Both variables must be numerical. Eye colour is categorical, so that pair needs a grouped box plot or grouped statistics instead."},
  {"q": "If the mtcars dots were scattered with no upward or downward trend, r would be approximately...", "options": ["0", "-1", "+1", "37.285"], "answer": 0, "explain": "No linear pattern means r near 0; strong downward trends give r near -1, strong upward trends near +1."}
]
```
