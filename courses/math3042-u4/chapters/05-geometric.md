---
title: Geometric: trials until the first success
minutes: 22
---
<!-- facts: gms.starforce.rates-0-14, gms.starforce.star-catch, classic.cashshop.mfc-rates, classic.cashshop.mfc-price, gms.box.divine-wishing-bell, poe1.fusing.six-link-measured -->

Star Force, the enhancement that adds stars to gear, fails a 14→15 tap more often than it lands, so the player taps until it does.

The geometric distribution counts those taps: the binomial's trials, with the trial count as the variable.

## X = the number of trials it takes to obtain the first "success"

Slide wording: the Geometric Distribution is *based on the same assumptions as the binomial distribution: $n$ trials each with probability of success $p$*.

What changes is the variable: $X$ = *the number of trials it takes to obtain the first "success"*.

Its possible values are 1, 2, 3, … with no upper limit, because there is no fixed $n$: the trials stop when the first success arrives.

A binomial $X$ runs from 0 to $n$; a geometric $X$ starts at 1 (the first trial can itself be the success) and is unbounded.

## Taps until the first 14→15 success

A 14→15 tap succeeds 30 % of the time.

Below 15 stars on a non-Superior item every tap has that same p, a failure keeps the star and nothing is destroyed, so X = the number of taps to the first success is geometric.

From 15 stars up a tap can also destroy the item, a third outcome, and the count stops being geometric.

The wiki's table leaves out the Star Catch bonus that v.271 builds into every tap, so live success is slightly higher.

```quiz
[
  {"q": "A 14→15 tap succeeds with p = 0.30. P(the first success is on the 3rd tap) = ? (4 decimals)", "type": "numeric", "answer": 0.147, "tolerance": 0.0001, "explain": "Fail, fail, succeed: $$q · q · p = 0.70 × 0.70 × 0.30 = 0.49 × 0.30 = \\mathbf{0.1470}$$"}
]
```

Two failed taps, each with $q = 0.70$, then the success with $p = 0.30$:

$$P(3) = 0.70 \times 0.70 \times 0.30 = \mathbf{0.1470}$$

R's version of this comes in "R counts failures" below.

### Fourteen-to-fifteen taps as boxes and bars

```widget
geometric-calc
{ "p": 0.3, "x": 3, "presets": false, "title": "Taps from 14 to 15 stars: p = 0.30, the first success on tap 3" }
```

## The help line: P(3)

*Suppose a tech-support telephone help line is occupied 75% of the time. Find the probability that you will have to call 3 times to gain access.*

```quiz
[
  {
    "q": "The help line is occupied 75 % of the time. P(you first get through on the 3rd call) = ? (4 decimals)",
    "type": "numeric",
    "answer": 0.1406,
    "tolerance": 0.0002,
    "explain": "Fail, fail, succeed: $$0.75 × 0.75 × 0.25 = \\mathbf{0.1406}$$"
  }
]
```

If you first gain access on the 3rd call, then you had to have: *failure on the first call*, probability $q = 0.75$; *failure on the second call*, probability $q = 0.75$; *success on the third call*, probability $p = 0.25$. The calls are independent, so the three probabilities multiply:

$$P(3) = 0.75 \times 0.75 \times 0.25 = 0.5625 \times 0.25 = \mathbf{0.1406}$$

## The formula: x − 1 failures, then one success

Slide wording: *suppose every trial of a random experiment has probability $p$ of success and probability $q = 1 - p$ of failure, and all trials are independent. Let $X$ = the number of trials it takes to get the first success (possible values: 1, 2, 3, …).* Then

$$P(X = x) = q^{x-1} \cdot p, \qquad \mu = \frac{1}{p}, \qquad \sigma^2 = \frac{1 - p}{p^2}$$

$x$ is the trial number of the first success, so $x - 1$ failures come before it (one factor of $q$ each) and the single success supplies the one factor of $p$.

The exponent is $x - 1$, never $x$: $P(3)$ has two 0.75s in it, not three.

A 1-in-4 chance needs about 4 tries: $\mu = 1/p$.

The notes' derivation is at the end of the lesson, for the curious.

**Back to the taps**, $p = 0.30$:

$$\mu = \dfrac{1}{0.30} = \mathbf{3.33} \text{ taps}, \qquad \sigma = \sqrt{\dfrac{0.70}{0.30^2}} = \sqrt{7.78} = \mathbf{2.79}$$

## Failure, failure, success, drawn as boxes

```widget
geometric-calc
{ "p": 0.25, "x": 3, "preset": "help line (p = 0.25)", "title": "The help line: q^(x-1) p with the chain of calls drawn, the bars for x = 1..15, and the R lines" }
```

Every added box is another $q$, so the bars fall by the factor $q = 0.75$ each step.

At $p = 0.05$ the mean $1/p$ is 20 while the tallest bar stays at $x = 1$.

## E[X] and σ for the help line

*Let $X$ = the number of times you must call until you get access.*

$$E[X] = \frac{1}{p} = \frac{1}{0.25} = 4 \text{ calls}, \qquad \sigma_X = \sqrt{\frac{1 - p}{p^2}} = \sqrt{\frac{0.75}{0.0625}} = \sqrt{12} = \mathbf{3.46}$$

The standard deviation is almost as large as the mean: the distribution has a long right tail of unlucky callers.

```r
p <- 0.25
q <- 1 - p
mu <- 1/p
sig <- sqrt((1 - p)/p^2)
c(mu, sig)
```
```text
[1] 4.000000 3.464102
```

:::info R syntax
| Code | What it does |
|---|---|
| `p <- 0.25` | `<-` is assignment: it stores 0.25 under the name `p`. |
| `q <- 1 - p` | `-` subtracts; 0.75 is stored in `q`. |
| `mu <- 1/p` | `/` divides: μ = 1/p. |
| `sig <- sqrt((1 - p)/p^2)` | `^` is a power and runs before `/`; the brackets make `1 - p` first; `sqrt()` roots the result. |
| `c(mu, sig)` | `c()` combines the two values so they print on one line. |
| `[1]` | R starts each printed line with the position of its first value; `[1]` means value 1. |

**Left to right**

- `p <- 0.25`: "Store under the name p (`p <-`) the number 0.25."
- `q <- 1 - p`: "Store under the name q (`q <-`) 1 minus p (`1 - p`)."
- `mu <- 1/p`: "Store under the name mu (`mu <-`) 1 divided by p (`1/p`)."
- `sig <- sqrt((1 - p)/p^2)`: "Store under the name sig (`sig <-`) the square root (`sqrt`) of 1 minus p (`1 - p`) divided by (`/`) p squared (`p^2`)."
- `c(mu, sig)`: "Combine (`c`) mu and sig (`mu`, `sig`)."

**Right to left**, the order R runs it

- `p <- 0.25`: "Take 0.25 and store it as p (`p <-`)."
- `q <- 1 - p`: "Subtract p from 1 (`1 - p`), then store it as q (`q <-`)."
- `mu <- 1/p`: "Divide 1 by p (`1/p`), then store it as mu (`mu <-`)."
- `sig <- sqrt((1 - p)/p^2)`: "Subtract p from 1 (`1 - p`), square p (`p^2`), divide (`/`), take the square root (`sqrt`), and store it as sig (`sig <-`)."
- `c(mu, sig)`: "Put mu and sig in one vector (`c`) and print it."
:::

## P(X ≥ 4): the complement, or three failures in a row

"At least 4 calls" is everything except 1, 2 or 3 calls.

The three excluded probabilities:

$$P(1) = 0.25, \qquad P(2) = 0.75 \times 0.25 = 0.1875, \qquad P(3) = 0.1406$$

Subtract them from 1:

$$P(X \ge 4) = 1 - P(1) - P(2) - P(3) = 1 - 0.25 - 0.1875 - 0.1406 = \mathbf{0.4219}$$

The shortcut gives the same number: needing at least 4 calls means the first three all failed.

$$q^3 = 0.75^3 = \mathbf{0.421875}$$

```diagram
{ "type": "flow", "title": "At least 4 calls: the first three all fail", "nodes": [
  { "id": "c1", "label": "call 1", "sub": "F, q = 0.75" },
  { "id": "c2", "label": "call 2", "sub": "F, q = 0.75" },
  { "id": "c3", "label": "call 3", "sub": "F, q = 0.75" },
  { "id": "c4", "label": "call 4", "sub": "?" },
  { "id": "c5", "label": "call 5", "sub": "?" }
], "edges": [ { "from": "c1", "to": "c2" }, { "from": "c2", "to": "c3" }, { "from": "c3", "to": "c4" }, { "from": "c4", "to": "c5" } ], "hi": ["c1", "c2", "c3"], "caption": "X ≥ 4 ⇔ calls 1–3 all fail: 0.75³ = 0.4219. X ≤ 3 is the opposite event: 1 − 0.75³ = 0.5781." }
```

So the two tail shortcuts have different exponents.

$P(X \ge x) = q^{x-1}$: only the first $x - 1$ trials must fail.

$P(X \le x) = 1 - q^x$: the opposite of "the first $x$ all fail".

Help line:

$$P(X \ge 4) = 0.75^3, \qquad P(X \le 4) = 1 - 0.75^4 = 0.6836$$

## R counts failures: dgeom(x − 1, p)

:::warn R's geometric counts failures, not trials
R's geometric variable is the number of **failures before** the first success, so the lecture's $X = x$ is R's $x - 1$.

Every `dgeom` and `pgeom` call in this course carries that shift, and "at least" carries a shift of 2.
:::

```diagram
{ "type": "grid", "title": "Lecture X to R: the four questions", "nodes": [
  { "id": "h0", "label": "Lecture asks", "row": 0, "col": 0 }, { "id": "h1", "label": "Means", "row": 0, "col": 1 }, { "id": "h2", "label": "By hand", "row": 0, "col": 2 }, { "id": "h3", "label": "R", "row": 0, "col": 3 },
  { "id": "e0", "label": "P(X = x)", "row": 1, "col": 0 }, { "id": "e1", "label": "x − 1 failures, then a success", "row": 1, "col": 1 }, { "id": "e2", "label": "q^(x−1) p", "row": 1, "col": 2 }, { "id": "e3", "label": "dgeom(x-1, p)", "row": 1, "col": 3 },
  { "id": "l0", "label": "P(X ≤ x)", "row": 2, "col": 0 }, { "id": "l1", "label": "success by trial x", "row": 2, "col": 1 }, { "id": "l2", "label": "1 − q^x", "row": 2, "col": 2 }, { "id": "l3", "label": "pgeom(x-1, p)", "row": 2, "col": 3 },
  { "id": "g0", "label": "P(X > x)", "row": 3, "col": 0 }, { "id": "g1", "label": "the first x all fail", "row": 3, "col": 1 }, { "id": "g2", "label": "q^x", "row": 3, "col": 2 }, { "id": "g3", "label": "1 - pgeom(x-1, p)", "row": 3, "col": 3 },
  { "id": "a0", "label": "P(X ≥ x)", "row": 4, "col": 0 }, { "id": "a1", "label": "the first x − 1 all fail", "row": 4, "col": 1 }, { "id": "a2", "label": "q^(x−1)", "row": 4, "col": 2 }, { "id": "a3", "label": "1 - pgeom(x-2, p)", "row": 4, "col": 3 }
], "hi": ["a0", "a1", "a2", "a3"], "caption": "Only 'at least' shifts by 2: help line P(X ≥ 4) = 0.75³ = 1 - pgeom(2, 0.25) = 0.4219." }
```

Worked row, help line:

$$P(X \ge 4) = 0.75^3 = 0.4219$$

That is `1 - pgeom(2, p)` with $p = 0.25$, the last line of the block below.

```r
q^2 * p                    # P(X = 3) by the formula
dgeom(2, p)                # the same: 2 failures, then the success
1 - p - q*p - q^2*p        # P(X >= 4) by the complement
1 - pgeom(2, p)            # pgeom(2, p) = P(at most 2 failures) = P(X <= 3)
```
```text
[1] 0.140625
[1] 0.140625
[1] 0.421875
[1] 0.421875
```

:::info R syntax
| Code | What it does |
|---|---|
| `#` | Starts a comment: R ignores the rest of the line. |
| `q^2 * p` | `^` runs before `*`: q squared times p. It uses `p` and `q` stored in the block above. |
| `dgeom(2, p)` | `dgeom(x, prob)`: x = 2 failures before the first success, prob = `p`. |
| `1 - p - q*p - q^2*p` | `^` and `*` run first, then the subtractions left to right. |
| `1 - pgeom(2, p)` | `pgeom(q, prob)`: q = 2, the chance of at most 2 failures; `1 -` takes its complement. |

**Left to right**

- `q^2 * p`: "q squared (`q^2`) times (`*`) p (`p`)."
- `dgeom(2, p)`: "The geometric probability (`dgeom`) of exactly 2 failures before the first success (`x = 2`) at chance p (`prob = p`)."
- `1 - p - q*p - q^2*p`: "1 minus p (`1 - p`) minus q times p (`- q*p`) minus q squared times p (`- q^2*p`)."
- `1 - pgeom(2, p)`: "One minus (`1 -`) the geometric probability of at most (`pgeom`) 2 failures (`q = 2`) at chance p (`prob = p`)."

**Right to left**, the order R runs it

- `q^2 * p`: "Square q (`q^2`), multiply by p (`*`), and print."
- `dgeom(2, p)`: "Take x = 2 and prob = p, compute the probability of 2 failures then a success (`dgeom`), and print."
- `1 - p - q*p - q^2*p`: "Work out q times p (`q*p`) and q squared times p (`q^2*p`), subtract p and both from 1 left to right (`-`), and print."
- `1 - pgeom(2, p)`: "Compute the chance of at most 2 failures (`pgeom`), subtract it from 1 (`1 -`), and print."
:::

The probability histogram the notes ask for uses the formula directly on a vector of $x$ values:

```r
X.vals <- 1:10
p.vals <- q^(X.vals - 1)*p
round(p.vals, 4)
barplot(p.vals, names.arg=X.vals, col="pink", space=0,
        xlab="X", ylab="P(x)", main="Number of Calls to Get Access")
```
```text
 [1] 0.2500 0.1875 0.1406 0.1055 0.0791 0.0593 0.0445 0.0334 0.0250 0.0188
```

:::info R syntax
| Code | What it does |
|---|---|
| `X.vals <- 1:10` | `a:b` is the whole numbers from a to b, here 1 to 10. |
| `p.vals <- q^(X.vals - 1)*p` | Works on the whole vector at once: subtracts 1 from each x, raises q to each result, multiplies by p. |
| `round(p.vals, 4)` | `round(x, digits)`: each probability to 4 decimals. |
| `barplot(p.vals, …)` | One bar per value; `p.vals` fills `height`. |
| `names.arg=X.vals` | The labels under the bars: 1 to 10. |
| `col="pink"`, `space=0` | The bar colour, and no gaps between bars. |
| `xlab=`, `ylab=`, `main=` | The axis labels and the title, as strings. |

**Left to right**

- `X.vals <- 1:10`: "Store under the name X.vals (`X.vals <-`) the whole numbers 1 to 10 (`1:10`)."
- `p.vals <- q^(X.vals - 1)*p`: "Store under the name p.vals (`p.vals <-`) q to the power (`^`) each x minus 1 (`X.vals - 1`), times (`*`) p (`p`)."
- `round(p.vals, 4)`: "Round (`round`) p.vals (`p.vals`) to 4 decimals (`4`)."
- `barplot(…)`: "Draw a bar chart (`barplot`) of p.vals (`p.vals`), labelled 1 to 10 (`names.arg=X.vals`), in pink (`col="pink"`), with no gaps (`space=0`), with axis labels (`xlab=`, `ylab=`) and a title (`main=`)."

**Right to left**, the order R runs it

- `X.vals <- 1:10`: "Make 1 to 10 (`1:10`), then store it as X.vals (`X.vals <-`)."
- `p.vals <- q^(X.vals - 1)*p`: "Subtract 1 from each x (`X.vals - 1`), raise q to each power (`q^`), multiply by p (`*p`), and store the ten results as p.vals (`p.vals <-`)."
- `round(p.vals, 4)`: "Take p.vals, round each to 4 decimals (`round`), and print."
- `barplot(…)`: "Take the heights (`p.vals`), labels (`names.arg=X.vals`), colour (`col="pink"`), no gaps (`space=0`) and text labels (`xlab=`, `ylab=`, `main=`), and draw the bars (`barplot`)."
:::

Each bar is 0.75 times the one before it, so the histogram is strictly decreasing: the **mode is 1** even though the mean is 4.

The ten bars add to 0.9437; the missing 0.0563 is $q^{10}$, the tail beyond 10 calls.

## Practice Problem 23: the "success" can be a miss

An expert hits the target 95% of the time; what is the probability the first miss is on the 15th shot?

The event we are waiting for is a miss, so success = miss with $p = 0.05$, $q = 0.95$ and $x = 15$:

$$P(X = 15) = 0.95^{14} \times 0.05 = 0.4877 \times 0.05 = \mathbf{0.0244}$$

```widget
geometric-calc
{ "p": 0.05, "x": 15, "preset": "expert shot misses (p = 0.05)", "title": "Practice Problem 23: fourteen hits, then the first miss" }
```

## Crates, bells and Fusings until the first prize

A Mystery Fashion Crate (a Classic cash-shop box) and a Divine Wishing Bell (a GMS reward box) each give one reward from a published rate table, and an Orb of Fusing rerolls an item's socket links with the same measured chance each time, so every try has the same p and X counts tries up to the first prize.

```quiz
[
  {"q": "Camping Boots come out of a Mystery Fashion Crate at 3.00 %. X = crates opened until the first Camping Boots. P(X = 10) = ? (4 decimals)", "type": "numeric", "answer": 0.0228, "tolerance": 0.0001, "explain": "Geometric with p = 0.03, q = 0.97. Nine misses, then the boots: $$q^9 · p = 0.97^9 × 0.03 = 0.760231 × 0.03 = \\mathbf{0.0228}$$"},
  {"type": "fill", "q": "Complete the R call for the same P(X = 10), first Camping Boots on the 10th crate.", "code": "dgeom(___, 0.03)", "answer": ["9"], "explain": "R counts the failures before the first success, so the lecture's X = 10 is R's 10 − 1 = 9. dgeom(9, 0.03) returns 0.02280693."},
  {"q": "A crate costs 3,500 NX bought one at a time. Expected NX spent to get the first Camping Boots = ? (to the NX)", "type": "numeric", "answer": 116667, "tolerance": 1, "explain": "$$E[X] = 1/p = 1/0.03 = 33.3333 \\text{ crates}$$ Each crate costs 3,500 NX, so the expected spend is: $$3500 × 33.3333 = \\mathbf{116\\,667} \\text{ NX}$$"},
  {"q": "A Divine Wishing Bell gives a 100% 17-Star Enhancement (Lv. 150) at 0.50 % and a 100% 17-Star Enhancement (Lv. 160) at 0.20 %. p = P(one bell gives either 17-Star Enhancement) = ? (4 decimals)", "type": "numeric", "answer": 0.007, "tolerance": 0.0001, "explain": "One bell gives exactly one reward, so the two rows are mutually exclusive and add: $$0.0050 + 0.0020 = \\mathbf{0.0070}$$"},
  {"q": "With p = 0.007 per bell, P(no 17-Star Enhancement in the first 100 bells) = P(X ≥ 101) = ? (4 decimals)", "type": "numeric", "answer": 0.4954, "tolerance": 0.0001, "explain": "X ≥ 101 means the first 100 bells all miss: $$q^{100} = 0.993^{100} = \\mathbf{0.4954}$$ In R, 1 - pgeom(99, 0.007): 99 failures, since R counts failures. About half of players who open 100 bells still have none."},
  {"q": "A 2017 test on a 20 %-quality item measured a six-link chance of about 1 in 1000 per Orb of Fusing. Taking p = 0.001, P(six-linked within 1500 Fusings) = P(X ≤ 1500) = ? (4 decimals)", "type": "numeric", "answer": 0.777, "tolerance": 0.0001, "explain": "$$P(X ≤ x) = 1 − q^x = 1 − 0.999^{1500} = 1 − 0.2230 = \\mathbf{0.7770}$$ That is the wiki's \"about a 77% chance\". In R, pgeom(1499, 0.001). The test predates the 3.29 socket rework, so treat it as the 2017 rate."}
]
```

```quiz
[
  {
    "q": "A geometric X with p = 0.2. P(X = 4)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1024,
    "tolerance": 0.0003,
    "explain": "Three failures then the success: $$0.8^3 × 0.2 = 0.512 × 0.2 = \\mathbf{0.1024}$$ The exponent is x − 1 = 3."
  },
  {
    "q": "For the help line (X = number of calls until access, p = 0.25), which R call gives P(X = 3)?",
    "options": ["`dgeom(3, 0.25)`", "`dgeom(2, 0.25)`", "`pgeom(3, 0.25)`", "`dbinom(3, 3, 0.25)`"],
    "answer": 1,
    "explain": "R counts failures before the first success, so the lecture's X = 3 (two failures, then success) is dgeom(2, 0.25) = 0.140625."
  },
  {
    "q": "Which formula is P(X = 5) for a geometric variable?",
    "options": ["$q^4 p$", "$q^5 p$", "$q^4 p^5$", "$p^4 q$"],
    "answer": 0,
    "explain": "Four failures, each with probability q, then the one success with probability p: q^(x−1) p with x = 5."
  },
  {
    "q": "Write P(X = 3) for the help line (occupied 75 % of the time) as the geometric formula with the numbers substituted. Use ^ for powers, * between factors, no spaces.",
    "type": "text",
    "answer": ["0.75^2*0.25", "(0.75)^2*0.25", "(0.75)^2*(0.25)", "0.75^2*(0.25)", "0.25*0.75^2", "0.75*0.75*0.25", "(1-0.25)^2*0.25", "0.75^(3-1)*0.25"],
    "explain": "q^(x−1) · p with q = 0.75, p = 0.25, x = 3: $$0.75^2 · 0.25 = \\mathbf{0.1406}$$ Two failures, so the exponent is 2."
  },
  {
    "q": "You keep calling the help line until you get through, but each failed call makes the next one more likely to connect (callers ahead of you give up). Which geometric assumption fails?",
    "options": ["the same probability p of success on every trial", "each trial is a success or a failure", "X counts the trials up to and including the first success", "X can take the value 1"],
    "answer": 0,
    "explain": "The geometric keeps the binomial's assumptions: the same p on every trial and independent trials. A p that rises call by call breaks equal p; the other three still hold."
  },
  {
    "q": "A geometric X with p = 0.2. E[X]? ",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "explain": "$$\\mu = 1/p = 1/0.2 = \\mathbf{5} \\text{ trials on average}$$"
  },
  {
    "q": "A geometric X with p = 0.2. P(X ≥ 3)? (2 decimals)",
    "type": "numeric",
    "answer": 0.64,
    "tolerance": 0.002,
    "explain": "At least 3 trials means the first two both failed: $$q^2 = 0.8^2 = \\mathbf{0.64}$$ The long way agrees: $$1 − 0.2 − 0.16 = 0.64$$"
  },
  {
    "q": "The possible values of a geometric random variable are...",
    "options": ["0, 1, 2, …, n", "0, 1, 2, …", "1, 2, 3, … with no upper limit", "1, 2, …, n"],
    "answer": 2,
    "explain": "The first success can come on trial 1 at the earliest, and there is no fixed n, so the values run 1, 2, 3, … forever. (R's version starts at 0 because it counts failures.)"
  },
  {
    "q": "For the help line, the most likely number of calls is 4, because E[X] = 4.",
    "type": "tf",
    "answer": false,
    "explain": "The histogram is strictly decreasing: P(1) = 0.25 is the tallest bar, so the mode is 1. The mean of 4 is pulled up by the long tail of unlucky callers."
  },
  {
    "q": "Roll a fair die until the first 6. P(the first 6 is on the 3rd roll)? (4 decimals)",
    "type": "numeric",
    "answer": 0.1157,
    "tolerance": 0.0003,
    "explain": "p = 1/6, q = 5/6: $$(5/6)^2 × (1/6) = 25/216 = \\mathbf{0.1157}$$"
  },
  {
    "q": "What does `1 - pgeom(2, 0.25)` compute for the lecture's X?",
    "options": ["P(X = 3)", "P(X ≤ 2)", "P(X ≥ 3)", "P(X ≥ 4)"],
    "answer": 3,
    "explain": "pgeom(2, p) is P(at most 2 failures) = P(X ≤ 3), so its complement is P(X ≥ 4): $$0.75^3 = 0.421875$$"
  },
  {
    "q": "A geometric X with p = 0.2. σ? (2 decimals)",
    "type": "numeric",
    "answer": 4.47,
    "tolerance": 0.02,
    "explain": "$$\\sigma^2 = \\dfrac{1 − p}{p^2} = \\dfrac{0.8}{0.04} = 20, \\quad \\sigma = \\sqrt{20} = \\mathbf{4.47}$$ Take the square root of the variance, not of 1 − p alone."
  }
]
```

:::info For the curious: where μ = 1/p comes from
The notes derive $\mu = 1/p$ from the definition $\mu = \sum x P(x)$ and say *you are not expected to be able to perform a derivation like the following*.

The chain:

$$\sum_{x \ge 1} x q^{x-1} p = p \cdot \frac{d}{dq}\left[\sum_{x \ge 1} q^x\right] = p \cdot \frac{d}{dq}\left[\frac{q}{1-q}\right] = p \cdot \frac{1}{(1-q)^2} = \frac{p}{p^2} = \frac{1}{p}$$

The steps are the sum of a geometric series, the quotient rule, then $1 - q = p$.
:::
