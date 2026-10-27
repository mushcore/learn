---
title: Scatter plots
minutes: 11
---
<!-- facts: classic.data.monsters -->

Every chart so far pictured **one** variable. The last chart in the notes pictures **two**: *"When we measure two or more numerical variables for each individual/unit, then it is possible to create a scatter plot."*

## One dot per individual

*"We simply plot one point $(X, Y)$ for each individual/unit."* $n$ individuals give $n$ dots, $X$ on the horizontal axis and $Y$ on the vertical, with no classes and no counting: the pattern of the dots is the summary. Both variables must be numerical; eye colour against height needs a grouped box plot instead (Lab 2).

## The lecture example: fuel efficiency versus car weight

R's built-in `mtcars` has 32 cars and eleven variables. The notes take $Y$ = `mpg` (fuel efficiency, miles per gallon) and $X$ = `wt` (weight):

| car | `wt` | `mpg` |
|---|---|---|
| Mazda RX4 | 2.620 | 21.0 |
| Datsun 710 | 2.320 | 22.8 |
| Hornet Sportabout | 3.440 | 18.7 |
| Cadillac Fleetwood | 5.250 | 10.4 |
| Honda Civic | 1.615 | 30.4 |
| Toyota Corolla | 1.835 | 33.9 |

Each row is one dot. The heavy Cadillac sits far right and low, the light Corolla far left and high, and over all 32 dots the picture *"trends downwards"*: heavier cars get fewer miles per gallon. The notes connect this to Unit 1: **"The fact that the points trend downwards is consistent with the linear correlation coefficient being negative."**

```r
cor(mtcars$wt, mtcars$mpg)
```
```text
[1] -0.8676594
```

$r = -0.868$ is a strong negative linear relationship ($-1 \le r \le 1$; values near $-1$ mean the dots hug a downward line). An upward trend gives positive $r$; a shapeless cloud gives $r \approx 0$ ([Linear correlation r](#/math3042/correlation)).

### The line through the dots

The dotted line is the **line of best fit**, which the instructor also calls the **"regression line."** Its equation on the plot:

$$\text{mpg} = -5.344 \cdot \text{wt} + 37.285$$

Each extra unit of weight costs about 5.3 mpg. Linear models come *"later in the course"*; for now, recognize the line and its name. The demo notebook fits it with `lm()` and draws it with `abline()`:

```r
model <- lm(mtcars$mpg ~ mtcars$wt)
abline(model, lty=3)
```

## Drawing it in R: two ways

Base R, from the demo notebook:

```r
data(mtcars)

plot( mtcars$wt, mtcars$mpg,    #X and Y values
      type="p",
      main="Fuel Efficiency versus Weight for n = 32 cars",
      ylab="Fuel Efficiency (mpg)", xlab="Weight (tons)",
      col="#66BD63", pch=19, lwd=1)
```

`plot(x, y)` takes $X$ first and $Y$ second. `type="p"` means points, `pch=19` the solid dot, `col` a hex RGB colour (the kind Lab 2 asks for), and `xlab`/`ylab`/`main` the labels.

The instructor's **lattice** version in the margin uses a model formula:

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

His annotation on the last line: `type = c("p", "r")` means **"do data points ("p") and a regression line ("r")."** `cex = 1` is the point size, and `paste0()` builds the title from `nrow(mtcars)` so $n$ is not hard-coded.

:::quiz Which side of the ~ is Y?
`mpg ~ wt` reads "mpg **explained by** wt": left of `~` is $Y$ (vertical), right is $X$ (horizontal), as in `boxplot(extra ~ group)` (Unit 1) and `favstats(Days ~ Sex)` (Lab 2). Base `plot(x, y)` is the opposite order: $X$ first.
:::

:::tip Units on the axis
The notes label the weight axis "Weight (tons)". R's documentation says `wt` is in thousands of pounds (3.44 is 3440 lb, about 1.7 tons). Use the notes' label; the shape and the correlation do not depend on the unit.
:::

```widget
scatter-corr
{ "preset": "mtcars: wt vs mpg (Unit 2)", "title": "mtcars: fuel efficiency versus weight (drag the points)" }
```

## A scatter plot of Classic monster EXP against level

meowdb's Classic monster table gives each monster a level and the EXP, experience points, one kill pays; without the 5 zero-EXP test rows it holds 87 monsters, in a data frame `mon` [Classic, meowdb monster table, Grand Launch build, checked 2026-10-27]. Six field monsters as (level, EXP): Snail (1, 2), Ribbon Pig (10, 19), Stirge (20, 37), Iron Hog (28, 52), Drake (50, 133), Taurospear (75, 429).

```quiz
[
  {"q": "EXP is explained by level. Which variable goes on the horizontal axis?", "options": ["level", "EXP", "either; it makes no difference to the picture", "neither; use a bar chart"], "answer": 0, "explain": "The explanatory variable is $X$, on the horizontal axis: level. EXP is $Y$, so the formula is `exp ~ level`."},
  {"q": "The six points rise from left to right. What sign does $r$ have?", "type": "text", "answer": ["positive", "+", "plus"], "explain": "An upward trend means a higher level goes with more EXP, so $r > 0$."},
  {"q": "Compute $r$ for the six monsters. (3 decimals)", "type": "numeric", "answer": 0.928, "tolerance": 0.0015, "explain": "$n = 6$, $\\sum x = 184$, $\\sum y = 672$, $\\sum xy = 41\\,213$, $\\sum x^2 = 9410$, $\\sum y^2 = 206\\,168$. $r = \\dfrac{6(41\\,213) - 184(672)}{\\sqrt{(6(9410) - 184^2)(6(206\\,168) - 672^2)}} = \\dfrac{123\\,630}{\\sqrt{22\\,604 \\times 785\\,424}} = 0.9279$: strong and positive, though Taurospear's 429 bends the dots upward rather than along a line."},
  {"q": "For all 87 monsters, `cor(mon$level, mon$exp)` prints `[1] 0.4085217`, far weaker than the six. Which explains it?", "options": ["A few bosses sit far above the trend, such as King Slime (Lv 32, 2400 EXP) and Jr. Balrog (Lv 80, 2188 EXP)", "EXP falls as level rises", "r cannot exceed 0.5 for more than 50 points", "level is a categorical variable"], "answer": 0, "explain": "A scatter plot shows the field monsters on a rising curve and a handful of bosses high above it. Those few points far off any line pull $r$ down to 0.41; the trend is still positive."},
  {"type": "fill", "q": "Fill the blank so lattice draws the points and a regression line.", "code": "xyplot(exp ~ level, data=mon, pch=19,\n       main=paste0(\"EXP versus level for n = \", nrow(mon), \" monsters\"),\n       type=c(\"p\", ___))", "answer": ["\"r\"", "'r'"], "explain": "`type = c(\"p\", \"r\")` means data points (\"p\") and a regression line (\"r\")."}
]
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
