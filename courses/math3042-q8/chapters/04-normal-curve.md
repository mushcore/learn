---
title: "The normal curve: μ puts the centre, σ sets the width"
minutes: 10
---
<!-- facts: none; IQ scores and the shape of the normal curve come from the notes, not the fact bank -->
Test scores, fill volumes and battery voltages all pile up around an average and thin out on both sides. The normal curve is the shape that describes them, and two numbers fix it.

## Most values near the middle, the same on both sides

**A normal distribution is a continuous distribution whose values cluster around the mean and thin out evenly on both sides.** Just like adult heights: most people are close to average, and very tall is as rare as very short.

The notes list three properties: *Bell Shaped*, *Symmetric about μ*, and *Distance from center to "inflection point" is σ*. The inflection point is where the curve is steepest, the spot where it stops bending down and starts bending up. For example, on a road over a hill it is the point where the slope stops getting steeper.

## The bell for IQ scores

IQ scores follow a normal curve with mean 100 and standard deviation 15; this is the notes' example. The picture is a bell: one peak above 100, falling away the same on each side, nearly flat by 55 and by 145.

```widget
normal-curve
{ "mu": 100, "sigma": 15, "x": 120, "title": "IQ scores: a bell centred at 100 with standard deviation 15" }
```

The marker at 120 sits a little more than one standard deviation to the right of the centre. The shaded bands mark one, two and three standard deviations either side of 100.

## μ moves the bell, σ stretches it

The notes put it in four sentences:

- *If μ increases, then the distribution shifts to the right.*
- *If μ decreases, then the distribution shifts to the left.*
- *If σ increases, then the distribution becomes wider and shorter.*
- *If σ decreases, then the distribution becomes taller and narrower.*

**μ sets where the centre is; σ sets how spread out the bell is.** The total area under every bell is 1, so a wider bell must be shorter. Just like spreading the same bucket of sand over a wider tray: the pile gets lower.

## N(100, 15²) holds the variance, not σ

**$X \sim N(\mu, \sigma^2)$ reads "X is normal with mean μ and variance σ²". The second slot is the variance.** For example, $X \sim N(100, 15^2)$ means a mean of 100 and a standard deviation of 15.

The unit's practice problems give a measurement with mean 16.2 and variance 1.3225.

- $\mu = 16.2$, the mean, the first slot.
- $\sigma^2 = 1.3225$, the variance, the second slot.

Square root of the variance:

$$\sigma^2 = \underbrace{1.3225}_{\text{the second slot}}$$

$$\sigma = \sqrt{\sigma^2} = \mathbf{1.15}$$

:::warn The second slot is σ², so take its square root
Using 1.3225 as σ makes every Z score after it wrong. The formula sheet also gives variances, so the square root comes first.
:::

## 68, 95 and 99.7: the empirical rule

**About 68 % of values lie within one standard deviation of the mean, 95 % within two, and 99.7 % within three.** This is on page 1 of the formula sheet. Just like a commute: most days you land within a few minutes of the usual time, and a day far outside it is rare.

For IQ:

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.

Two standard deviations either side:

$$\underbrace{100}_{\text{mean}} \pm 2 \times \underbrace{15}_{\text{standard deviation}} = \mathbf{70 \text{ to } 130}$$

```diagram
{"type": "grid", "title": "The empirical rule for IQ, N(100, 15²)", "nodes": [{"id": "h0", "label": "Band", "row": 0, "col": 0}, {"id": "h1", "label": "IQ range", "row": 0, "col": 1}, {"id": "h2", "label": "Share inside", "row": 0, "col": 2}, {"id": "a0", "label": "μ ± 1σ", "row": 1, "col": 0}, {"id": "a1", "label": "85 to 115", "row": 1, "col": 1}, {"id": "a2", "label": "about 68 %", "row": 1, "col": 2}, {"id": "b0", "label": "μ ± 2σ", "row": 2, "col": 0}, {"id": "b1", "label": "70 to 130", "row": 2, "col": 1}, {"id": "b2", "label": "about 95 %", "row": 2, "col": 2}, {"id": "c0", "label": "μ ± 3σ", "row": 3, "col": 0}, {"id": "c1", "label": "55 to 145", "row": 3, "col": 1}, {"id": "c2", "label": "about 99.7 %", "row": 3, "col": 2}], "hi": ["b0", "b1", "b2"], "caption": "Outside 70 to 130 sits only about 5 % of IQ scores, 2.5 % on each side."}
```

## Z counts standard deviations from the mean

**The Z score of a value is how many standard deviations it sits from the mean. A plus sign means above, a minus sign means below.** Just like giving directions as "three blocks east of the station": the station is the mean and one block is one standard deviation.

Two IQ scores small enough to do in your head:

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.
- $x = 115$, one score asked about: one step of 15 above 100, so $Z = 1$.
- $x = 70$, another score: two steps of 15 below 100, so $Z = -2$.

## The Z formula, each symbol named

$$Z = \dfrac{x - \mu}{\sigma}$$

- $x$, the value asked about.
- $\mu$, the mean: subtracting it measures the distance from the centre.
- $\sigma$, the standard deviation: dividing by it counts that distance in standard deviations.
- $Z$, the result, positive above the mean and negative below.

For the score of 70:

$$Z = \dfrac{\underbrace{70}_{\text{score asked}} - \underbrace{100}_{\text{mean}}}{\underbrace{15}_{\text{standard deviation}}} = \dfrac{-30}{15} = \mathbf{-2.00}$$

**A value is statistically unusual when its Z is below −2 or above 2.** The middle 95 % lies between those, so a value outside is in the rarest 5 %. For example, a bus that is usually within 5 minutes of schedule arriving 25 minutes late.

## IQ 120 is 1.33 standard deviations above the mean

The notes ask about a person with an IQ of 120.

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.
- $x = 120$, the score asked about.

$$Z = \dfrac{\underbrace{120}_{\text{score asked}} - \underbrace{100}_{\text{mean}}}{\underbrace{15}_{\text{standard deviation}}} = 1.33333 = \mathbf{1.33}$$

Z sits between −2 and 2, so 120 is not unusual. In R the same arithmetic, and the square root from the section on N(100, 15²), look like this:

```r
mu <- 100
sig <- 15
(120 - mu)/sig
sqrt(1.3225)
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- 100` | `<-` is assignment: it stores 100 under the name `mu`. |
| `sig <- 15` | Stores the standard deviation under the name `sig`. |
| `(120 - mu)/sig` | The brackets make R subtract first, then `/` divides by `sig`: the Z score. |
| `sqrt(1.3225)` | `sqrt()` is the square root: σ from the variance. |

**Left to right**

- `mu <- 100`: "Store under the name mu (`mu <-`) the number 100."
- `sig <- 15`: "Store under the name sig (`sig <-`) the number 15."
- `(120 - mu)/sig`: "120 minus the mean (`120 - mu`), divided by (`/`) the standard deviation (`sig`)."
- `sqrt(1.3225)`: "The square root (`sqrt`) of 1.3225."

**Right to left**, the order R runs it

- `mu <- 100`: "Take 100 and store it as mu (`<-`)."
- `sig <- 15`: "Take 15 and store it as sig (`<-`)."
- `(120 - mu)/sig`: "Look up mu, work out the brackets (`120 - mu`), then divide by sig (`/`)."
- `sqrt(1.3225)`: "Take 1.3225, then return its square root (`sqrt`)."
:::

The two calculations give 1.333333 and 1.15 (computed). The long version is [The normal distribution](#/math3042-u5/normal-distribution).

## The standard normal: μ = 0 and σ = 1

**The normal curve with μ = 0 and σ = 1 is the *standard normal distribution*, or the *Z-distribution*.** Z scores live on it: a Z of 1.33 is a point on this bell, 1.33 to the right of 0. For example, IQ 115 and Z = 1 sit at the same spot on their two bells.

The formula sheet gives the height of any normal bell:

$$f(x) = \dfrac{1}{\sqrt{2\pi}\cdot\sigma}\,e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

Nobody works an area out of this by hand. The notes say *we use a table of values or a suitable calculator*: the [Z table](#/math3042-q8/z-table) on paper and `pnorm` in R.

## Lattes, SkyTrain trips, sleep and a filling machine

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$
- Empirical rule: 68 % within one standard deviation of the mean, 95 % within two, 99.7 % within three.

**Not on the sheet, so know it:**

- In $N(\mu, \sigma^2)$ the second slot is the variance; σ is its square root.
- Unusual means Z below −2 or above 2.
- A larger σ gives a wider, shorter bell; μ only moves it.
:::

```quiz
[
  {"q": "A coffee shop's latte cups hold an amount X that is normal with μ = 350 mL and σ = 8 mL. One cup holds 344 mL. What is its Z score? (2 decimals)", "type": "numeric", "answer": -0.75, "tolerance": 0.01, "explain": "Let X = the amount in one cup, $\\mu = 350$ mL the mean and $\\sigma = 8$ mL the standard deviation. $$Z = \\dfrac{\\underbrace{344}_{\\text{amount asked}} - \\underbrace{350}_{\\text{mean}}}{\\underbrace{8}_{\\text{standard deviation}}} = \\dfrac{-6}{8} = \\mathbf{-0.75}$$ The cup sits three quarters of a standard deviation below the mean; the minus sign says below."},
  {"q": "Four normal curves are written as $N(\\mu, \\sigma^2)$. Which one is the widest and shortest?", "options": ["$N(20, 4^2)$", "$N(20, 9)$", "$N(25, 2^2)$", "$N(15, 1)$"], "answer": 0, "explain": "Width is set by σ, the square root of the second slot. $N(20, 4^2)$ has $\\sigma = 4$; $N(20, 9)$ has $\\sigma = \\sqrt{9} = 3$; $N(25, 2^2)$ has $\\sigma = 2$; $N(15, 1)$ has $\\sigma = 1$. The largest σ is 4, so $N(20, 4^2)$ is the widest and shortest. The mean only moves a bell sideways."},
  {"q": "SkyTrain trips from a station to BCIT take X minutes, normal with μ = 24 and σ = 3. By the empirical rule, about 95 % of trips take between 18 minutes and how many minutes?", "type": "numeric", "answer": 30, "tolerance": 0.01, "unit": "min", "explain": "95 % lies within two standard deviations of the mean. $$\\underbrace{24}_{\\text{mean}} + 2 \\times \\underbrace{3}_{\\text{standard deviation}} = \\mathbf{30}$$ The lower end is $24 - 6 = 18$, the number in the question."},
  {"q": "BCIT students sleep X hours a night, normal with μ = 7.2 h and σ = 0.9 h. Is a night of 5.6 hours statistically unusual? Type YES or NO.", "type": "text", "answer": ["NO", "No", "no"], "explain": "Let X = one night's sleep, $\\mu = 7.2$ h the mean and $\\sigma = 0.9$ h the standard deviation. $$Z = \\dfrac{\\underbrace{5.6}_{\\text{hours asked}} - \\underbrace{7.2}_{\\text{mean}}}{\\underbrace{0.9}_{\\text{standard deviation}}} = -1.77778 = \\mathbf{-1.78}$$ $-2 < -1.78 < 2$, so NO, 5.6 hours is not unusual."},
  {"q": "A filling machine puts X grams of flour in a bag, with $X \\sim N(500, 6.25)$. What is σ? (2 decimals)", "type": "numeric", "answer": 2.5, "tolerance": 0.01, "unit": "g", "explain": "The second slot of $N(\\mu, \\sigma^2)$ is the variance. $$\\sigma^2 = \\underbrace{6.25}_{\\text{the second slot}}$$ $$\\sigma = \\sqrt{\\sigma^2} = \\mathbf{2.50}$$ The mean is 500 g, the first slot."},
  {"q": "If σ decreases and μ stays the same, the bell becomes taller and narrower.", "type": "tf", "answer": true, "explain": "True. The notes: *If σ decreases, then the distribution becomes taller and narrower.* The area stays 1, so a narrower bell must be taller. The centre stays at μ."}
]
```

## Remember

- A normal curve is a bell, symmetric about μ; σ is the distance from the centre to the steepest point.
- μ moves the bell; a larger σ makes it wider and shorter.
- **In $N(\mu, \sigma^2)$ the second slot is the variance: take its square root for σ.**
- 68 %, 95 %, 99.7 % lie within 1, 2, 3 standard deviations.
- **$Z = \dfrac{x - \mu}{\sigma}$ counts standard deviations from the mean, with a sign.**
- Unusual means Z below −2 or above 2.
- The standard normal has μ = 0 and σ = 1; areas come from the Z table, never from the formula.
