---
title: Mock Quiz 1
minutes: 30
---

One long quiz covering everything from Unit 1: definitions, symbols, formulas, small computations, and the R function each concept maps to. Every explanation shows the arithmetic.

```quiz
[
  {"q": "A number that summarizes a **sample** (like $\\bar{X}$ or $s$) is called a...", "options": ["Statistic", "Parameter", "Population", "Census"], "answer": 0, "explain": "Statistics describe samples. Parameters ($\\mu$, $\\sigma$, $p$) describe populations."},
  {"q": "$\\mu$ and $\\sigma$ are examples of...", "options": ["Statistics", "Parameters", "Estimators", "Residuals"], "answer": 1, "explain": "Both are computed from the entire population, which makes them parameters, not statistics."},
  {"q": "Runner age (in years) is what type of variable?", "options": ["Categorical", "Numerical", "Ordinal-only", "Binary"], "answer": 1, "explain": "Age is a measured quantity — numerical (quantitative), not a category label."},
  {"q": "Eye colour (Black, Brown, Blue, Green, Other) is what type of variable?", "options": ["Categorical", "Numerical", "Discrete numerical", "Continuous numerical"], "answer": 0, "explain": "Eye colour is a label, not a number — categorical."},
  {"q": "Eye colour survey: Black 95, Brown 130, Blue 52, Green 10, Other 15 ($n=302$). What is $\\hat{p}(\\text{Brown})$?", "type": "numeric", "answer": 0.4305, "tolerance": 0.001, "explain": "$\\hat{p} = x/n = 130/302 = 0.4305$, i.e. 43.05%."},
  {"q": "Which symbol denotes the **sample** proportion (as opposed to the population proportion)?", "options": ["$p$", "$\\hat{p}$", "$\\pi$", "$P$"], "answer": 1, "explain": "$\\hat{p} = x/n$ is the sample proportion; $p = X/N$ is the population proportion."},
  {"q": "Ages 22, 19, 20, 22, 35, 19, 21, 23. What is the sample mean $\\bar{X}$?", "type": "numeric", "answer": 22.625, "tolerance": 0.01, "explain": "$\\Sigma X = 181$, $n = 8$, $\\bar{X} = 181/8 = 22.625$."},
  {"q": "`faithful$eruptions` grouped mean (class marks 1.75...5.25, frequencies 51,41,5,7,30,73,61,4): $\\Sigma f_i = 272$, $\\Sigma f_i X_i = 951.5$. Grouped mean?", "type": "numeric", "answer": 3.498, "tolerance": 0.005, "explain": "$951.5 / 272 = 3.498$ — close to, but not identical to, the raw mean (3.488), because grouping loses a little precision."},
  {"q": "Data: 19, 19, 20, 22, 23, 25, 50 ($n=7$, odd). Median?", "type": "numeric", "answer": 22, "explain": "With odd $n$, the median is the exact middle value: the 4th of 7 sorted values, which is 22."},
  {"q": "Data: 19, 20, 23, 27, 29, 30 ($n=6$, even). Median?", "type": "numeric", "answer": 25, "explain": "Average the two middle (3rd and 4th) values: $(23+27)/2 = 25$."},
  {"q": "A course instructor computes the mean and draws a histogram of this term's exam scores, with no attempt to generalize beyond this class. This is an example of...", "options": ["Descriptive statistics", "Inferential statistics", "Probability theory", "Categorical data"], "answer": 0, "explain": "Descriptive statistics summarizes and presents a data set (means, charts). Inferential statistics would generalize beyond this class to future classes or a population; probability theory is the mathematical link between the two."},
  {"q": "Classroom ages range from 18 to 35. Range?", "type": "numeric", "answer": 17, "explain": "$R = 35 - 18 = 17$ years."},
  {"q": "The sample standard deviation $s$ divides the sum of squared deviations by...", "options": ["$n$", "$n - 1$", "$n + 1$", "$N$"], "answer": 1, "explain": "Sample $s$ always divides by $n-1$. Population $\\sigma$ divides by $N$."},
  {"q": "Why divide by $n-1$ instead of $n$ for sample $s$?", "options": ["It's arbitrary tradition", "So $s$ is a better approximation of $\\sigma$ (makes $s^2$ an unbiased estimator of $\\sigma^2$)", "Because samples always have one missing value", "To keep the units squared"], "answer": 1, "explain": "Dividing by $n$ would systematically underestimate $\\sigma$; $n-1$ corrects that bias."},
  {"q": "Height: mean 165, $s = 5.2$. Age: mean 20.2, $s = 3.5$. Which variable has more **relative** variability?", "options": ["Age — CV = 17.3%, larger than height's 3.15%", "Height — larger raw $s$", "Both equal", "Cannot tell without more data"], "answer": 0, "explain": "$CV_{height} = 100(5.2/165) = 3.15\\%$; $CV_{age} = 100(3.5/20.2) = 17.3\\%$. Age varies far more relative to its own mean, even though its raw $s$ is smaller."},
  {"q": "Empirical rule: percent of a bell-shaped distribution within $\\mu \\pm 1\\sigma$?", "type": "numeric", "answer": 68, "explain": "68% (more precisely 68.27%)."},
  {"q": "Empirical rule: percent within $\\mu \\pm 2\\sigma$?", "type": "numeric", "answer": 95, "explain": "95% (more precisely 95.45%)."},
  {"q": "Empirical rule: percent within $\\mu \\pm 3\\sigma$?", "type": "numeric", "answer": 99.7, "tolerance": 0.1, "explain": "99.7% (more precisely 99.73%)."},
  {"q": "$Z$-score formula for a sample value?", "options": ["$Z = (X - \\bar{X})/s$", "$Z = (X - \\mu)/s$", "$Z = X/\\bar{X}$", "$Z = \\bar{X}/X$"], "answer": 0, "explain": "$Z$ measures how many standard deviations $X$ is from its own (sample) mean. The population version uses $\\mu$ and $\\sigma$ instead."},
  {"q": "Women's heights: $\\mu = 164.7$ cm, $\\sigma = 7.1$ cm. $Z$-score for $X = 175$ cm?", "type": "numeric", "answer": 1.45, "tolerance": 0.02, "explain": "$Z = (175-164.7)/7.1 = 1.45$."},
  {"q": "Same population, $X = 178.9$ cm gives $Z = 2.0$ exactly. What percent of women are **below** this height?", "type": "numeric", "answer": 97.5, "tolerance": 0.5, "unit": "%", "explain": "50% are below the mean, plus half of the 95% empirical band ($95/2 = 47.5\\%$) between the mean and $+2\\sigma$: $50 + 47.5 = 97.5\\%$."},
  {"q": "An individual is called 'unusual' when...", "options": ["$|Z| > 2$", "$|Z| > 1$", "$|Z| > 3$", "$Z < 0$"], "answer": 0, "explain": "Unusual means more than 2 standard deviations from the mean — roughly the outer 5% under the empirical rule."},
  {"q": "Men: $\\mu = 178.4$ cm, $\\sigma = 7.6$ cm. LeBron James is 203 cm. Is he unusual?", "type": "tf", "answer": true, "explain": "$Z = (203-178.4)/7.6 = 3.24$, and $|3.24| > 2$, so yes — unusual."},
  {"q": "'Outlier' and 'unusual' mean exactly the same thing.", "type": "tf", "answer": false, "explain": "The instructor explicitly notes: outlier ≠ unusual. 'Unusual' is a $Z$-score idea ($|Z|>2$); 'outlier' is a fence idea (beyond $Q_1 - 1.5\\,IQR$ or $Q_3+1.5\\,IQR$). They often, but don't always, agree."},
  {"q": "IQ is normal with $\\mu=100,\\sigma=15$. A person has $Z = 3.2$. What is their IQ?", "type": "numeric", "answer": 148, "explain": "$X = \\mu + Z\\sigma = 100 + 3.2(15) = 148$."},
  {"q": "Chebyshev's rule states the fraction of **any** distribution within $\\mu \\pm k\\sigma$ is at least...", "options": ["$1 - 1/k^2$", "$1/k^2$", "$k/2$", "$1 - k$"], "answer": 0, "explain": "This is Chebyshev's inequality — it works for any shape, not just bell-shaped data."},
  {"q": "Chebyshev's rule, $k=3$: minimum percent within $\\mu \\pm 3\\sigma$?", "type": "numeric", "answer": 88.9, "tolerance": 0.5, "unit": "%", "explain": "$1 - 1/3^2 = 1 - 1/9 = 0.8889 \\approx 89\\%$ — notice this is a weaker guarantee than the empirical rule's 99.7% for the same interval."},
  {"q": "In R, what does `IQR(x)` compute?", "options": ["`quantile(x, 0.75) - quantile(x, 0.25)` (the interquartile range)", "The mean absolute deviation", "The full range, `max(x) - min(x)`", "The sample variance"], "answer": 0, "explain": "`IQR()` returns $Q_3 - Q_1$ directly — the width of the middle 50% of the data, same as computing it by hand from `quantile()`."},
  {"q": "`faithful$eruptions` ($n=272$): 25% of 272 is 68 (a whole number), so by the hand method $Q_1$ is the average of the 68th and 69th sorted values: $(2.150+2.167)/2$. Compute it.", "type": "numeric", "answer": 2.1585, "tolerance": 0.002, "explain": "$(2.150+2.167)/2 = 2.1585$. R's `quantile()` uses a slightly different interpolation and reports 2.16275 — the instructor notes there are 'about 10 different ways to define quartiles' and small disagreements are fine."},
  {"q": "Outlier fence formulas?", "options": ["Lower $= Q_1 - 1.5\\,IQR$, Upper $= Q_3 + 1.5\\,IQR$", "Lower $= Q_1 - IQR$, Upper $= Q_3 + IQR$", "Lower $= \\mu - 3\\sigma$, Upper $= \\mu+3\\sigma$", "Lower $=\\min$, Upper $=\\max$"], "answer": 0, "explain": "1.5 times the IQR beyond each quartile is the standard fence rule."},
  {"q": "US city precipitation: $Q_1 = 29.375$, $Q_3 = 42.775$. Upper fence?", "type": "numeric", "answer": 62.875, "tolerance": 0.1, "explain": "$IQR = 42.775-29.375=13.4$. Upper fence $= 42.775 + 1.5(13.4) = 62.875$."},
  {"q": "Same data: lower fence?", "type": "numeric", "answer": 9.275, "tolerance": 0.1, "explain": "Lower fence $= 29.375 - 1.5(13.4) = 9.275$."},
  {"q": "Mobile, AL gets 67.0 inches of precipitation. Given the fences above, is it an outlier?", "type": "tf", "answer": true, "explain": "$67.0 > 62.875$ (upper fence), so yes, it's flagged as an outlier on the boxplot."},
  {"q": "In R, `quantile(faithful$eruptions, 0.33)` returns approximately 2.417 minutes. What does that number mean?", "options": ["33% of eruption times are below it, 67% above", "It is the 33rd shortest eruption", "It is 33% of the mean eruption time", "It is the mean of the shortest 33 eruptions"], "answer": 0, "explain": "That's the definition of a percentile: $P_{33}$ separates the lower 33% from the upper 67%."},
  {"q": "Which R function computes the sample standard deviation?", "options": ["`sd()`", "`var()`", "`sigma()`", "`stddev()`"], "answer": 0, "explain": "`sd()` in R always computes the **sample** version (dividing by $n-1$), never the population version."},
  {"q": "Pearson's skewness coefficient formula?", "options": ["$Sk = 3(\\bar{X} - Q_2)/s$", "$Sk = (\\bar{X}-Q_2)/s^2$", "$Sk = 3(Q_2-\\bar{X})/s$", "$Sk = (\\bar{X}+Q_2)/2s$"], "answer": 0, "explain": "It compares the mean to the median, scaled by $s$, times 3 for a conventional range."},
  {"q": "If a distribution is skewed **right** (long tail to the right), what is true of the mean, median, and $Sk$?", "options": ["Mean > median, $Sk > 0$", "Mean < median, $Sk < 0$", "Mean = median, $Sk = 0$", "Mean and median are unrelated to $Sk$'s sign"], "answer": 0, "explain": "A right tail pulls the mean above the median, giving a positive $Sk$."},
  {"q": "`cats$Bwt`: $\\bar{X}=2.724$, $Q_2=2.7$, $s=0.4853$. $Sk = 3(2.724-2.7)/0.4853 = 0.146$. What shape is this?", "options": ["Slightly skewed right (mean > median)", "Slightly skewed left", "Perfectly symmetric", "Highly skewed"], "answer": 0, "explain": "$Sk = 0.146 > 0$ means skewed right, but since $|Sk| < 1$ it is only mildly skewed, not 'highly skewed'."},
  {"q": "Correlation coefficient $r$ is always between...", "options": ["$-1$ and $1$", "$0$ and $1$", "$-\\infty$ and $\\infty$", "$0$ and $100$"], "answer": 0, "explain": "$r=-1$ is perfect negative linear, $r=1$ is perfect positive linear, values in between show weaker linear association."},
  {"q": "Circuit data ($n=12$): $\\Sigma x=459,\\Sigma y=401,\\Sigma xy=15907,\\Sigma x^2=18075,\\Sigma y^2=14301$. Using $r = \\frac{n\\Sigma xy - \\Sigma x\\Sigma y}{\\sqrt{n\\Sigma x^2-(\\Sigma x)^2}\\sqrt{n\\Sigma y^2-(\\Sigma y)^2}}$, what is $r$?", "type": "numeric", "answer": 0.8324, "tolerance": 0.005, "explain": "Plugging in: numerator $= 12(15907)-459(401) = 190884-184059=6825$. Denominator: $\\sqrt{12(18075)-459^2}\\times\\sqrt{12(14301)-401^2} = \\sqrt{6219}\\times\\sqrt{10811}\\approx 78.86\\times103.98\\approx 8199.6$. $r\\approx6825/8199.6\\approx0.8324$: a strong positive linear relationship."},
  {"q": "Correlation measures any kind of relationship (linear, curved, or otherwise) between two variables.", "type": "tf", "answer": false, "explain": "$r$ only measures **linear** association. Two variables can have a strong nonlinear pattern with $r \\approx 0$."},
  {"q": "If you swap which variable is $X$ and which is $Y$, what happens to $r$?", "options": ["Nothing — $r$ is unchanged", "$r$ flips sign", "$r$ becomes $1/r$", "$r$ becomes $0$"], "answer": 0, "explain": "The correlation formula is symmetric in $X$ and $Y$, so swapping them has no effect on $r$."},
  {"q": "A strong correlation between ice cream sales and boating accidents proves ice cream causes boating accidents.", "type": "tf", "answer": false, "explain": "Classic example: both rise with summer heat. Correlation never implies causation — there may be a lurking (confounding) variable."},
  {"q": "$\\rho$ (rho) is the population version of which sample statistic?", "options": ["$r$ (correlation)", "$s$ (standard deviation)", "$\\bar{X}$ (mean)", "$\\hat{p}$ (proportion)"], "answer": 0, "explain": "$r$ estimates $\\rho$ from sample data, exactly the way $\\bar{X}$ estimates $\\mu$ and $s$ estimates $\\sigma$."},
  {"q": "Which R function returns the correlation coefficient between two numeric vectors?", "options": ["`cor(X, Y)`", "`sd(X, Y)`", "`lm(X, Y)`", "`table(X, Y)`"], "answer": 0, "explain": "`cor()` computes $r$ directly."},
  {"type": "shade", "q": "IQ is normal with $\\mu=100$, $\\sigma=15$. Shade the interval from 70 to 130 and read off the percentage.", "mu": 100, "sigma": 15, "answer": 95, "lo": -2, "hi": 2, "explain": "70 and 130 are $\\mu\\pm2\\sigma$, so 95%."},
  {
    "type": "match",
    "q": "Match each R function to what it computes.",
    "pairs": [
      ["`mean(x)`", "sample mean"],
      ["`median(x)`", "sample median"],
      ["`sd(x)`", "sample standard deviation (always divides by n-1)"],
      ["`table(x)`", "a frequency table"],
      ["`quantile(x)`", "the five-number summary (min, Q1, median, Q3, max)"],
      ["`IQR(x)`", "the interquartile range, Q3 - Q1"],
      ["`cor(x, y)`", "the correlation coefficient r"]
    ],
    "explain": "R has no base mode() statistics function — that's the one summary value with no direct one-liner in this crib sheet."
  }
]
```
