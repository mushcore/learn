# MATH 3042 Unit 5 — notes transcribed (source of every number in this module)

Source file (Learning Hub export, 2026-10-12, 11:33 AM): `MATH_3042_Lecture_Unit_05.pdf` (12 pages, printed pp. 74–85), **unfilled**: every answer line is blank in the posted file, so the arithmetic below is computed here (`../compute.py`) and labelled "computed". No demo notebook, lab or quiz for Unit 5 is posted yet; the R lines quoted are the base functions that the Unit 4 notebook's pattern implies (`punif`, `pnorm`, `qnorm`, `pexp`, `qexp`), and the one R line printed in the notes (`pnorm(120, 100, 15)`) confirms the style. The Z table referred to on p.79 is not in the export; the course's table is assumed to be the standard **cumulative (left-tail) table of $P(Z \le z)$** to two decimals of $z$, and every table answer below is given to the 4 decimals such a table shows.

## p.74 — 5 Continuous probability distributions
- "If a random variable $X$ takes decimal values measured on an *interval* of real numbers, then $X$ is a *continuous* random variable and $X$ follows a *continuous probability distribution*."
- Figure pair: left "Discrete Probability Distribution" (a bar histogram at 0…12 with probabilities to 0.25, binomial-like, peak at 5); right "Continuous Probability Distribution" (a bell curve over "Height (in cm)" with ticks 154, 161, 168, 175, 182, 189, 196 and a vertical line at 175, i.e. μ = 175, σ = 7).
- Definition: a **continuous random variable** $X$ takes values on an interval of the real number line; the number of possible $X$ values is therefore *uncountably infinite*. e.g. $X$ = the weight of a random person (in kg).
- **Observation**: if $X$ is continuous on an interval $(a, b)$, then the probability of any individual $x$ is zero! e.g. $P(X = 85.000)$ (dartboard picture).
- Distributions covered: **Uniform, Normal, Exponential**.

## p.75 — 5.1 Uniform probability distribution
- "The first specific type of continuous probability distribution we will examine is the simplest: a *uniform distribution* on an interval $[a, b]$." (Blank space for the picture: a flat pdf of height $1/(b-a)$ between $a$ and $b$; computed facts: $f(x) = \frac{1}{b-a}$ on $[a, b]$, $P(c \le X \le d) = \frac{d-c}{b-a}$, $\mu = \frac{a+b}{2}$, $\sigma = \frac{b-a}{\sqrt{12}}$. The notes do not print these formulas; label them as the standard results.)
- Example: a bus arrives exactly once every twenty minutes; you do not know the schedule, so the time $T$ you must wait is random and uniformly distributed (on $[0, 20]$). Probability that you wait:
  - **Between 8 and 11 minutes?** (computed) $\dfrac{11 - 8}{20} = \dfrac{3}{20} = \mathbf{0.15}$.
  - **More than 12 minutes?** (computed) $\dfrac{20 - 12}{20} = \dfrac{8}{20} = \mathbf{0.40}$.
  - **Exactly 4 minutes?** (computed) $\mathbf{0}$ (the p.74 observation; the area of a line is zero).
  - (computed) $\mu = 10$ min, $\sigma = 20/\sqrt{12} = 5.77$ min. R: `punif(11, 0, 20) - punif(8, 0, 20)` → 0.15; `1 - punif(12, 0, 20)` → 0.4.

## p.76 — Probability density function (pdf)
- "If $X$ is a continuous random variable, then we don't specify $P(x)$ for *individual* values of $X$. Instead, we specify the probability that $X$ falls within any given *interval* of values." e.g. $P(0 \le X \le 182\text{cm}) = 0.75$.
- Definition: a **probability density function (pdf)** for $X$ is a function $f(x)$ where, for any real number $b$,
  $$P(X \le b) = \int_{-\infty}^{b} f(x)\,dx$$
- "Visualization of $f(x)$" (blank: a curve with the area to the left of $b$ shaded).
- Definition: if $f(x)$ is a pdf for $X$, the **cumulative probability function** $F(x)$ is $F(x) = P(X \le x) =$ (blank) $\displaystyle\int_{-\infty}^{x} f(t)\,dt$ (computed completion).

## p.77 — Properties of a pdf; mean and variance
1. Total area beneath $f(x)$ is equal to 1: $F(+\infty) = \displaystyle\int_{-\infty}^{+\infty} f(x)\,dx = 1$.
2. Positivity: $f(x) \ge 0$ for all $x$.
3. Probability of an interval: $P(a \le X \le b) =$ (blank) $\displaystyle\int_a^b f(x)\,dx = F(b) - F(a)$ (computed completion).
- Mean and variance: $\mu = \displaystyle\int_{-\infty}^{+\infty} x \cdot f(x)\,dx$, $\sigma^2 = \displaystyle\int_{-\infty}^{+\infty} (x - \mu)^2 f(x)\,dx$ (the Unit 4 sums with integrals in place of sums).

## p.78 — 5.2 Normal probability distribution
- "The most important continuous distribution in probability and statistics is the *Normal Distribution*."
- Properties: **Bell shaped; symmetric about $\mu$; distance from centre to "inflection point" is $\sigma$.** Figure: four curves, μ = 0 σ² = 0.2 (red, tall), μ = 0 σ² = 1.0 (green), μ = 0 σ² = 5.0 (blue, flat), μ = −2 σ² = 0.5 (magenta), x from −5 to 5, y to 1.
- pdf: $$f(x) = \frac{e^{-\frac12\left(\frac{x-\mu}{\sigma}\right)^2}}{\sigma\sqrt{2\pi}}$$
- If $\mu$ increases the distribution shifts right; if $\mu$ decreases it shifts left; if $\sigma$ increases it becomes *wider* and *shorter*; if $\sigma$ decreases, *taller* and *narrower*.
- Note: "It is challenging to compute areas from the pdf $f(x)$ since there is no elementary antiderivative of $e^{-x^2}$. Instead, we use a table of values or a suitable calculator."

## p.79 — Standard normal (Z) distribution
- Choosing $\mu = 0$, $\sigma = 1$ gives the **standard normal distribution** or the **Z-distribution**: $f(z) = \dfrac{e^{-\frac12 z^2}}{\sqrt{2\pi}}$.
- Example: $Z$ standard normal; determine using the table and using R (all blank; computed with a left-tail table):
  - $P(Z \le -1.96) = \mathbf{0.0250}$. R: `pnorm(-1.96)` → 0.02499790.
  - $P(Z > +2.33) = 1 - P(Z \le 2.33) = 1 - 0.9901 = \mathbf{0.0099}$. R: `1 - pnorm(2.33)` → 0.009903076.
  - $P(0.55 \le Z \le 1.10) = P(Z \le 1.10) - P(Z \le 0.55) = 0.8643 - 0.7088 = \mathbf{0.1555}$. R: `pnorm(1.10) - pnorm(0.55)` → 0.1554936.
  - (Why 1.96 and 2.33: they cut 2.5 % and 1 % tails; the course's later confidence intervals use them. Say it as context, not as the notes' statement.)

## p.80 — IQ example; the key idea
- IQ is normal with $\mu = 100$, $\sigma = 15$, written $X \sim N(100, 15^2)$. R: printed `> pnorm(120, 100, 15)` → `[1] 0.9087888`. Figure "Distribution of IQ Scores (mu=100, sigma=15)", bell from about 40 to 160, y "prob density f(x)" to 0.025.
- "Now do the same calculation using only the $Z$ table" (blank; computed): $Z = \dfrac{120 - 100}{15} = 1.33$; table $P(Z \le 1.33) = \mathbf{0.9082}$ (R with the unrounded 1.3333 gives 0.9088; the table answer differs in the 4th decimal because $Z$ was rounded to 1.33, worth saying).
- **Key idea**: if $X$ is normal with mean $\mu$ and standard deviation $\sigma$, then $Z = \dfrac{X - \mu}{\sigma}$ automatically follows a standard normal distribution.

## p.81 — cosmic radiation (blank; computed)
- $X$ = cosmic radiation on a trans-Canada flight, normal, $\mu = 4.35$ mrem, $\sigma = 0.500$ mrem.
  - (a) $P(4.35 \le X \le 5.00)$: $Z$ from 0 to $(5.00 - 4.35)/0.500 = 1.30$; $P(0 \le Z \le 1.30) = 0.9032 - 0.5000 = \mathbf{0.4032}$. R: `pnorm(5, 4.35, 0.5) - pnorm(4.35, 4.35, 0.5)` → 0.4031995.
  - (b) $P(X > 5.00) = 1 - 0.9032 = \mathbf{0.0968}$. R: `1 - pnorm(5, 4.35, 0.5)` → 0.09680048.
  - (c) 95th percentile: $P(Z \le z) = 0.95$ → table $z = 1.645$ (0.9495 at 1.64, 0.9505 at 1.65; use 1.645); $x = \mu + z\sigma = 4.35 + 1.645(0.500) = \mathbf{5.17}$ mrem. R: `qnorm(0.95, 4.35, 0.5)` → 5.172427.

## p.82 — Gaussian noise, bit error (blank; computed)
- In a digital system one voltage level represents bit 0 and another bit 1: **bit 0 → 2 volts, bit 1 → 3 volts**. Channel noise distorts the received voltage; "often, channel noise can be modeled as a normally distributed random variable; in this case it is called *Gaussian noise*." Noise is Gaussian with $\mu = 0$ V, $\sigma = 0.22$ V (figure: a noisy trace, x 0–7). The notes misspell "receiver" as "reiver".
- If the sender sends a 0 bit, probability the receiver interprets it as a 1? Receiver picks whichever level is closer, so the threshold is 2.5 V; a sent 0 (2 V) is read as 1 when noise $N > 0.5$ V: $Z = 0.5/0.22 = 2.27$; $P(Z > 2.27) = 1 - 0.9884 = \mathbf{0.0116}$ (about 1.2 % of 0-bits flip). R: `1 - pnorm(0.5, 0, 0.22)` → 0.01152131 (table 2.27 gives 0.0116; unrounded 2.2727 gives 0.0115). (COMP 3721 cross-link: this is a bit error rate from SNR; mention only.)

## p.83 — 5.3 Exponential probability distribution
- "The exponential probability distribution is a model for *waiting time in a memory-less system*. A random variable $X$ is said to be *exponentially distributed* if $X \ge 0$ and the pdf for $X$ is"
  $$f(x) = \frac{1}{\beta} e^{-x/\beta}, \quad \beta > 0$$
- Example (Web Server): the time $X$ between http requests is exponential; average wait 2.5 seconds.
  - (a) pdf: (computed) $\beta = 2.5$, $f(x) = \dfrac{1}{2.5} e^{-x/2.5} = 0.4\,e^{-0.4x}$ for $x \ge 0$.
  - (b) $P(X \le 4)$: (computed) $\displaystyle\int_0^4 0.4 e^{-0.4x}\,dx = 1 - e^{-4/2.5} = 1 - e^{-1.6} = 1 - 0.2019 = \mathbf{0.7981}$. R: `pexp(4, rate = 1/2.5)` → 0.7981035 (**R's `rate` is $1/\beta$**).

## p.84 — exponential cdf, mean and variance; web server (c)–(e)
- Cumulative: if $f(x) = \frac1\beta e^{-x/\beta}$ then $F(x) = P(X \le x) = 1 - e^{-x/\beta}$.
- Mean and variance: $\mu = \displaystyle\int_0^{+\infty} x f(x)\,dx = \beta$; $\sigma^2 = \displaystyle\int_0^{+\infty} (x-\mu)^2 f(x)\,dx = \beta^2$ (so $\sigma = \beta$: mean and sd are equal).
- Web server continued, $\beta = 2.5$ s:
  - (c) $\sigma = \beta = \mathbf{2.5}$ s (computed).
  - (d) $F(x) = 1 - e^{-x/2.5}$ (computed).
  - (e) 95th percentile from $F(x)$: $1 - e^{-x/2.5} = 0.95 \Rightarrow e^{-x/2.5} = 0.05 \Rightarrow x = -2.5 \ln 0.05 = 2.5 \times 2.9957 = \mathbf{7.49}$ s (computed). R: `qexp(0.95, rate = 1/2.5)` → 7.489331.

## p.85 — bank teller (blank; computed)
- A bank teller sees an average of 30 customers per hour; service time is exponential. So $\beta = 60/30 = 2$ minutes per customer (the rate is 0.5 per minute).
  - (a) $P(1.5 \le X \le 2.5) = F(2.5) - F(1.5) = (1 - e^{-1.25}) - (1 - e^{-0.75}) = e^{-0.75} - e^{-1.25} = 0.4724 - 0.2865 = \mathbf{0.1859}$. R: `pexp(2.5, 0.5) - pexp(1.5, 0.5)` → 0.1858618.
  - (b) Given 1 minute already spent, $P(2.5 \le X \le 3.5 \mid X > 1) = \dfrac{P(2.5 \le X \le 3.5)}{P(X > 1)} = \dfrac{e^{-1.25} - e^{-1.75}}{e^{-0.5}} = \dfrac{0.2865 - 0.1738}{0.6065} = \mathbf{0.1859}$, the same as (a): the **memoryless property** (the remaining time, given 1 minute has passed, has the same distribution as a fresh service time; 2.5–3.5 total is 1.5–2.5 more).
  - (c) 75th percentile: $1 - e^{-x/2} = 0.75 \Rightarrow x = -2 \ln 0.25 = 2 \ln 4 = \mathbf{2.77}$ minutes. R: `qexp(0.75, 0.5)` → 2.772589.

## Computed reference values (from `../compute.py`)
- Uniform bus: 0.15, 0.40, 0, μ 10, σ 5.7735.
- Z: 0.024998, 0.009903, 0.155494 (0.864334 − 0.708840).
- IQ: 0.908789 (Z = 1.3333); table at 1.33: 0.908241.
- Radiation: 0.403200, 0.096800, $z_{0.95} = 1.644854$, 5.1724.
- Noise: Z = 2.2727, 0.011521; table at 2.27: 0.011604.
- Web server: 0.798103; 95th 7.4893; $P(X > 4) = 0.201897$.
- Teller: 0.185862 both ways; 75th 2.7726.

## Open questions for the writer
- The course's Z table layout (left-tail cumulative vs centre-area) is assumed left-tail. If the posted table is the "area from 0 to z" kind, every table step changes form (0.4032 would be read directly for (a)); keep the R values as the anchor and say which table convention is used.
- Whether the lecture derives the uniform μ and σ formulas; they are given here as standard results.
- Whether (c) of the printers example and the bit-error threshold get an in-class answer differing from ours; label ours.
