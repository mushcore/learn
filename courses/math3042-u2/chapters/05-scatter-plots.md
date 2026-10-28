---
title: Scatter plots
minutes: 11
---
<!-- facts: classic.data.monsters -->

Every chart so far pictured **one** variable.

The last chart in the notes pictures **two**: *"When we measure two or more numerical variables for each individual/unit, then it is possible to create a scatter plot."*

## One dot per individual

*"We simply plot one point $(X, Y)$ for each individual/unit."*

$n$ individuals give $n$ dots, $X$ on the horizontal axis and $Y$ on the vertical, with no classes and no counting: the pattern of the dots is the summary.

Both variables must be numerical; eye colour against height needs a grouped box plot instead (Lab 2).

## The lecture example: fuel efficiency versus car weight

R's built-in `mtcars` has 32 cars and eleven variables.

The notes take $Y$ = `mpg` (fuel efficiency, miles per gallon) and $X$ = `wt` (weight):

| car | `wt` | `mpg` |
|---|---|---|
| Mazda RX4 | 2.620 | 21.0 |
| Datsun 710 | 2.320 | 22.8 |
| Hornet Sportabout | 3.440 | 18.7 |
| Cadillac Fleetwood | 5.250 | 10.4 |
| Honda Civic | 1.615 | 30.4 |
| Toyota Corolla | 1.835 | 33.9 |

```widget
scatter-corr
{ "preset": "mtcars: wt vs mpg (Unit 2)", "title": "mtcars: fuel efficiency versus weight (drag the points)" }
```

Each row is one dot.

The heavy Cadillac sits far right and low, the light Corolla far left and high, and over all 32 dots the picture *"trends downwards"*: heavier cars get fewer miles per gallon.

The notes connect this to Unit 1: **"The fact that the points trend downwards is consistent with the linear correlation coefficient being negative."**

```r
cor(mtcars$wt, mtcars$mpg)
```
```text
[1] -0.8676594
```

:::info R syntax
| Code | What it does |
|---|---|
| `mtcars$wt`, `mtcars$mpg` | `$` picks one column of the built-in `mtcars` data frame by name: the weights and the fuel efficiencies. |
| `cor( …, …)` | Returns the linear correlation coefficient r of its first two arguments, `x` and `y`, paired car by car. |
| `[1]` | In printed output, `[1]` is the position of the first value on that line, not part of the value. |

**Left to right**

- "Compute the correlation (`cor`) between the weight column (`mtcars$wt`) and the fuel-efficiency column (`mtcars$mpg`) of the car data."

**Right to left**, the order R runs it

- "Take the car data (`mtcars`), pull out its wt and mpg columns (`$wt`, `$mpg`), compute r for the pairs (`cor`), and print it."
:::

$r = -0.868$ is a strong negative linear relationship ($-1 \le r \le 1$; values near $-1$ mean the dots hug a downward line).

An upward trend gives positive $r$; a shapeless cloud gives $r \approx 0$ ([Linear correlation r](#/math3042/correlation)).

### The line through the dots

On the instructor's plot of all 32 cars, a dotted line runs through the dots: the **line of best fit**, which the instructor also calls the **"regression line."**

Its equation on the plot:

$$\text{mpg} = -5.344 \cdot \text{wt} + 37.285$$

Each extra unit of weight costs about 5.3 mpg.

Linear models come *"later in the course"*; for now, recognize the line and its name.

The demo notebook fits it with `lm()` and draws it with `abline()`:

```r
model <- lm(mtcars$mpg ~ mtcars$wt)
abline(model, lty=3)
```

:::info R syntax
| Code | What it does |
|---|---|
| `model <- …` | `<-` is assignment: the fitted line is stored under the name `model`. |
| `lm(mtcars$mpg ~ mtcars$wt)` | Fits a straight line. `~` makes a formula: the left side (mpg) is Y, explained by the right side (wt), X. |
| `abline(model, …)` | Adds the fitted line to the plot already drawn, using the intercept and slope stored in `model`. |
| `lty=3` | Line type 3: a dotted line. |

**Left to right**

- `model <- lm(mtcars$mpg ~ mtcars$wt)`: "Store under the name model (`model <-`) the fitted straight line (`lm`) of fuel efficiency (`mtcars$mpg`) explained by (`~`) weight (`mtcars$wt`)."
- `abline(model, lty=3)`: "Add a straight line (`abline`) from the fitted model (`model`), dotted (`lty=3`)."

**Right to left**, the order R runs it

- `model <- lm(mtcars$mpg ~ mtcars$wt)`: "Pull out the mpg and wt columns (`mtcars$mpg`, `mtcars$wt`), make the formula Y explained by X (`~`), fit the line (`lm`), and store it (`model <-`)."
- `abline(model, lty=3)`: "Read the intercept and slope from the model (`model`), set the dotted style (`lty=3`), and draw the line on the plot (`abline`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `data(mtcars)` | Loads the built-in `mtcars` data set into the workspace by name. |
| `plot( mtcars$wt, mtcars$mpg, …)` | The first argument, `x`, goes on the horizontal axis and the second, `y`, on the vertical: one point per car. |
| `#X and Y values` | `#` starts a comment: R ignores the rest of that line. |
| `type="p"` | Draw points only. |
| `main="…"` | The chart title. |
| `ylab="…"`, `xlab="…"` | The y-axis label and the x-axis label. |
| `col="#66BD63"` | The point colour as a hex code: `#` then two hex digits each for red, green and blue. Inside quotes, `#` is not a comment. |
| `pch=19` | Plotting character 19: a solid round dot. |
| `lwd=1` | Line width for drawing the symbols, the normal thickness. |

**Left to right**

- `data(mtcars)`: "Load the built-in data set (`data`) named mtcars (`mtcars`)."
- `plot( mtcars$wt, mtcars$mpg, …)`: "Plot (`plot`) weight across (`mtcars$wt`) against fuel efficiency up (`mtcars$mpg`) as points (`type="p"`), with a title (`main=`), axis labels (`ylab=`, `xlab=`), green colour (`col="#66BD63"`), solid dots (`pch=19`) and normal line width (`lwd=1`)."

**Right to left**, the order R runs it

- `data(mtcars)`: "Find the data set called mtcars (`mtcars`) and load it (`data`)."
- `plot( mtcars$wt, mtcars$mpg, …)`: "Pull out the wt and mpg columns (`$wt`, `$mpg`), set the point type, labels, colour, symbol and width (`type=`, `main=`, `ylab=`, `xlab=`, `col=`, `pch=`, `lwd=`), and draw one dot per car (`plot`)."
:::

`plot(x, y)` takes $X$ first and $Y$ second.

`type="p"` means points, `pch=19` the solid dot, `col` a hex RGB colour (the kind Lab 2 asks for), and `xlab`/`ylab`/`main` the labels.

The instructor's **lattice** version in the margin uses a model formula:

```r
library(lattice)
xyplot(mpg ~ wt, data = mtcars)
```

:::info R syntax
| Code | What it does |
|---|---|
| `library(lattice)` | Loads the `lattice` package, which provides `xyplot()`. |
| `xyplot(mpg ~ wt, …)` | A scatter plot from a formula: left of `~` is Y (vertical), right of `~` is X (horizontal). |
| `data = mtcars` | Tells `xyplot()` to look up `mpg` and `wt` as columns of `mtcars`, so no `$` is needed. |

**Left to right**

- `library(lattice)`: "Load the package (`library`) called lattice (`lattice`)."
- `xyplot(mpg ~ wt, data = mtcars)`: "Draw a lattice scatter plot (`xyplot`) of fuel efficiency (`mpg`) explained by (`~`) weight (`wt`), both found in the car data (`data = mtcars`)."

**Right to left**, the order R runs it

- `library(lattice)`: "Find the lattice package (`lattice`) and load it (`library`)."
- `xyplot(mpg ~ wt, data = mtcars)`: "Look in the car data (`data = mtcars`) for the columns in the formula Y explained by X (`mpg ~ wt`), then draw the scatter plot (`xyplot`)."
:::

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

:::info R syntax
| Code | What it does |
|---|---|
| `xyplot(mpg ~ wt, data = mtcars, …)` | The same lattice scatter plot, as above, with one argument per line after it. |
| `xlab = "…"`, `ylab = "…"` | The x-axis label and the y-axis label. |
| `main = paste0(…)` | `paste0()` joins its pieces into one string with no spaces added, making the title. |
| `nrow(mtcars)` | The number of rows in `mtcars`, one per car, so the title's n is computed. |
| `pch = 19` | Solid round dots. |
| `cex = 1` | Symbol size as a multiple of the normal size; 1 is normal size. |
| `col = "lightgreen"` | The point colour. |
| `type = c("p", "r")` | `c()` combines two codes: `"p"` draws the points and `"r"` adds a regression line. |

**Left to right**

- "Draw a lattice scatter plot (`xyplot`) of mpg explained by wt (`mpg ~ wt`) from the car data (`data = mtcars`), with axis labels (`xlab =`, `ylab =`), a title joined (`main = paste0`) from text and the row count of the data (`nrow(mtcars)`), solid dots (`pch = 19`) at normal size (`cex = 1`), light green (`col = "lightgreen"`), showing points and a regression line combined (`type = c("p", "r")`)."

**Right to left**, the order R runs it

- "Count the rows of the car data (`nrow(mtcars)`), join that into the title text (`paste0`), combine the two type codes (`c("p", "r")`), set the labels, symbol, size and colour (`xlab =`, `ylab =`, `pch =`, `cex =`, `col =`), look up mpg and wt in the data (`mpg ~ wt`, `data = mtcars`), and draw the plot (`xyplot`)."
:::

His annotation on the last line: `type = c("p", "r")` means **"do data points ("p") and a regression line ("r")."**

`cex = 1` is the point size, and `paste0()` builds the title from `nrow(mtcars)` so $n$ is not hard-coded.

:::quiz Which side of the ~ is Y?
A formula puts $Y$ first: left of `~` is $Y$, the measured variable.

A numerical right side reads "**explained by**" (`mpg ~ wt`: mpg explained by wt); a categorical right side reads "**by**" (`Days ~ Sex`: Days by Sex).

Base `plot(x, y)` is the opposite order: $X$ first.

| Call | Written first | Horizontal axis | Vertical axis |
|---|---|---|---|
| `plot(mtcars$wt, mtcars$mpg)` | X (wt) | wt | mpg |
| `xyplot(mpg ~ wt, data=mtcars)` | Y (mpg) | wt | mpg |
| `lm(mtcars$mpg ~ mtcars$wt)` | Y (mpg) | (fits mpg from wt) | — |
| `bwplot(Days ~ Sex, data=quine)` | measured (Days) | groups (Sex) | Days |
:::

:::info R syntax
| Code | What it does |
|---|---|
| `plot(mtcars$wt, mtcars$mpg)`, `xyplot(mpg ~ wt, data=mtcars)`, `lm(mtcars$mpg ~ mtcars$wt)` | As above: base scatter plot, lattice scatter plot, fitted line. |
| `bwplot(Days ~ Sex, data=quine)` | Lab 2's lattice box plot: `Days` by `Sex`, one box per sex, columns looked up in `quine`. |

**Left to right**

- `plot(mtcars$wt, mtcars$mpg)`: "Plot (`plot`) weight across (`mtcars$wt`) against fuel efficiency up (`mtcars$mpg`)."
- `xyplot(mpg ~ wt, data=mtcars)`: "Draw a lattice scatter plot (`xyplot`) of mpg explained by (`~`) wt (`mpg ~ wt`) from the car data (`data=mtcars`)."
- `lm(mtcars$mpg ~ mtcars$wt)`: "Fit a line (`lm`) of mpg (`mtcars$mpg`) explained by (`~`) wt (`mtcars$wt`)."
- `bwplot(Days ~ Sex, data=quine)`: "Draw box plots (`bwplot`) of Days (`Days`) by (`~`) Sex (`Sex`) from the quine data (`data=quine`)."

**Right to left**, the order R runs it

- `plot(mtcars$wt, mtcars$mpg)`: "Pull out wt and mpg (`$wt`, `$mpg`), then draw one dot per car (`plot`)."
- `xyplot(mpg ~ wt, data=mtcars)`: "Look in the car data (`data=mtcars`) for the formula's columns (`mpg ~ wt`), then draw the plot (`xyplot`)."
- `lm(mtcars$mpg ~ mtcars$wt)`: "Pull out mpg and wt (`mtcars$mpg`, `mtcars$wt`), make the formula (`~`), and fit the line (`lm`)."
- `bwplot(Days ~ Sex, data=quine)`: "Look in quine (`data=quine`) for Days and Sex, build the formula Days by Sex (`Days ~ Sex`), then draw one box per sex (`bwplot`)."
:::

:::tip Units on the axis
The notes label the weight axis "Weight (tons)".

R's documentation says `wt` is in thousands of pounds (3.44 is 3440 lb, about 1.7 tons).

Use the notes' label; the shape and the correlation do not depend on the unit.
:::

## A scatter plot of Classic monster EXP against level

meowdb's Classic monster table gives each monster a level and the EXP, experience points, one kill pays; without the 5 zero-EXP test rows it holds 87 monsters, in a data frame `mon`.

Six field monsters as (level, EXP): Snail (1, 2), Ribbon Pig (10, 19), Stirge (20, 37), Iron Hog (28, 52), Drake (50, 133), Taurospear (75, 429).

The Unit 1 formula for $r$, with $x$ = level, $y$ = EXP and $n = 6$:

$$r = \dfrac{n\sum xy - \sum x \sum y}{\sqrt{(n\sum x^2 - (\sum x)^2)(n\sum y^2 - (\sum y)^2)}}$$

Fill the sums on paper first:

| monster | $x$ | $y$ | $xy$ | $x^2$ | $y^2$ |
|---|---|---|---|---|---|
| Snail | 1 | 2 | | | |
| Ribbon Pig | 10 | 19 | | | |
| Stirge | 20 | 37 | | | |
| Iron Hog | 28 | 52 | | | |
| Drake | 50 | 133 | | | |
| Taurospear | 75 | 429 | | | |
| $\Sigma$ | | | | | |

```quiz
[
  {"q": "EXP is explained by level. Which variable goes on the horizontal axis?", "options": ["level", "EXP", "either; it makes no difference to the picture", "neither; use a bar chart"], "answer": 0, "explain": "The explanatory variable is $X$, on the horizontal axis: level. EXP is $Y$, so the formula is `exp ~ level`."},
  {"q": "The six points rise from left to right. What sign does $r$ have?", "type": "text", "answer": ["positive", "+", "plus"], "explain": "An upward trend means a higher level goes with more EXP, so $r > 0$."},
  {"q": "Compute $r$ for the six monsters. (3 decimals)", "type": "numeric", "answer": 0.928, "tolerance": 0.0015, "explain": "$n = 6$, $\\sum x = 184$, $\\sum y = 672$, $\\sum xy = 41\\,213$, $\\sum x^2 = 9410$, $\\sum y^2 = 206\\,168$. $$r = \\dfrac{6(41\\,213) - 184(672)}{\\sqrt{(6(9410) - 184^2)(6(206\\,168) - 672^2)}} = \\dfrac{123\\,630}{\\sqrt{22\\,604 \\times 785\\,424}} = \\mathbf{0.9279}$$ Strong and positive, though Taurospear's 429 bends the dots upward rather than along a line."},
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
  {"q": "Using the fitted line mpg = -5.344 wt + 37.285, what mpg does it predict for a car with wt = 3? (1 decimal)", "type": "numeric", "answer": 21.3, "tolerance": 0.1, "explain": "$$-5.344 \\times 3 + 37.285 = -16.032 + 37.285 = 21.25 \\approx \\mathbf{21.3}$$"},
  {"q": "In `xyplot(mpg ~ wt, data = mtcars)`, which variable goes on the horizontal axis?", "options": ["`wt`, the variable to the right of ~", "`mpg`, the variable to the left of ~", "Whichever is listed first in the data frame", "Neither; xyplot draws a box plot"], "answer": 0, "explain": "A model formula reads Y ~ X: the left side is Y (vertical), the right side is X (horizontal)."},
  {"q": "What does `type = c(\"p\", \"r\")` do in the lattice `xyplot` call?", "options": ["Draws the data points and a regression line", "Draws points in red", "Prints the correlation r", "Reverses the axes"], "answer": 0, "explain": "The instructor's note: do data points ('p') and a regression line ('r')."},
  {"q": "In base R, `plot(mtcars$wt, mtcars$mpg)` puts `mtcars$wt` on the vertical axis.", "type": "tf", "answer": false, "explain": "plot(x, y) takes X first: wt is horizontal, mpg is vertical. (The formula version mpg ~ wt puts Y first instead.)"},
  {"q": "Which of these could be shown with a scatter plot? (select all)", "options": ["Height vs weight of students", "Car weight vs fuel efficiency", "Eye colour vs height", "Test score vs hours studied"], "answer": [0, 1, 3], "explain": "Both variables must be numerical. Eye colour is categorical, so that pair needs a grouped box plot or grouped statistics instead."},
  {"q": "If the mtcars dots were scattered with no upward or downward trend, r would be approximately...", "options": ["0", "-1", "+1", "37.285"], "answer": 0, "explain": "No linear pattern means r near 0; strong downward trends give r near -1, strong upward trends near +1."}
]
```
