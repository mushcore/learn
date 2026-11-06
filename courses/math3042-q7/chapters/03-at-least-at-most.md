---
title: "At least, at most, more than: the words become a sum or a complement"
minutes: 10
---
<!-- facts: gms.starforce.rates-0-14, gms.starforce.star-catch, classic.scroll.tiers, poe1.chaos.affix-count, gms.scroll.chaos-outcomes -->
Most binomial questions do not ask for one exact count. They say "at least", "at most" or "between", and the first mark is turning those words into the right set of counts.

## Each wording names a set of counts

Write the counts out before any formula.

- "At most 2" is 0 or 1 or 2.
- "At least 2" is everything except 0 and 1.
- "More than 2" starts at 3.
- "Fewer than 2" stops at 1.
- "Between 2 and 6 inclusive" is 2, 3, 4, 5, 6.

"At least" and "more than" differ by one count, and so do "at most" and "fewer than". That one count is where the marks go.

```diagram
{"type": "grid", "title": "Two wordings on a number line, n = 8", "nodes": [{"id": "w", "label": "X =", "row": 0, "col": 0}, {"id": "h0", "label": "0", "row": 0, "col": 1}, {"id": "h1", "label": "1", "row": 0, "col": 2}, {"id": "h2", "label": "2", "row": 0, "col": 3}, {"id": "h3", "label": "3", "row": 0, "col": 4}, {"id": "h4", "label": "4", "row": 0, "col": 5}, {"id": "h5", "label": "5", "row": 0, "col": 6}, {"id": "h6", "label": "6", "row": 0, "col": 7}, {"id": "h7", "label": "7", "row": 0, "col": 8}, {"id": "h8", "label": "8", "row": 0, "col": 9}, {"id": "aw", "label": "at least 3", "row": 1, "col": 0}, {"id": "a0", "label": "", "row": 1, "col": 1}, {"id": "a1", "label": "", "row": 1, "col": 2}, {"id": "a2", "label": "", "row": 1, "col": 3}, {"id": "a3", "label": "in", "row": 1, "col": 4}, {"id": "a4", "label": "in", "row": 1, "col": 5}, {"id": "a5", "label": "in", "row": 1, "col": 6}, {"id": "a6", "label": "in", "row": 1, "col": 7}, {"id": "a7", "label": "in", "row": 1, "col": 8}, {"id": "a8", "label": "in", "row": 1, "col": 9}, {"id": "mw", "label": "at most 2", "row": 2, "col": 0}, {"id": "m0", "label": "in", "row": 2, "col": 1}, {"id": "m1", "label": "in", "row": 2, "col": 2}, {"id": "m2", "label": "in", "row": 2, "col": 3}, {"id": "m3", "label": "", "row": 2, "col": 4}, {"id": "m4", "label": "", "row": 2, "col": 5}, {"id": "m5", "label": "", "row": 2, "col": 6}, {"id": "m6", "label": "", "row": 2, "col": 7}, {"id": "m7", "label": "", "row": 2, "col": 8}, {"id": "m8", "label": "", "row": 2, "col": 9}], "hi": ["a3", "a4", "a5", "a6", "a7", "a8", "m0", "m1", "m2"], "caption": "At least 3 and at most 2 split the line: together they cover every count once, so P(X ≥ 3) = 1 − P(X ≤ 2)."}
```

## Four tries at 30 %: the short side is cheaper

Take $n = 4$ tries with $p = 0.3$. "At least 2" is 2, 3 or 4: three terms. Its opposite, 0 or 1, is two terms.

The whole line adds to 1, so compute the short side and subtract it from 1. This is the complement.

$$P(0) = 0.7^4 = 0.2401 \qquad P(1) = {}_4C_1 \, (0.3)(0.7)^3 = 4 \times 0.3 \times 0.343 = 0.4116$$

${}_4C_1 = 4$: the one success can sit in any of the four tries. The formula and the keys are in [Before you start](#/math3042-q7/pre-reading).

$$P(X \ge 2) = 1 - [P(0) + P(1)] = 1 - (0.2401 + 0.4116) = \mathbf{0.3483}$$

"At least one" is the shortest case of all. Its opposite is the single count 0.

$$P(X \ge 1) = 1 - P(0) = 1 - 0.7^4 = 1 - 0.2401 = \mathbf{0.7599}$$

## The words table: sum on paper, complement, R line

R's `pbinom` gives "at most": it adds P(0) up to P(k). Every other wording is built from it.

| Words | Values of X | On paper | R |
|---|---|---|---|
| at most k | 0 to k | $P(0) + \dots + P(k)$ | `pbinom(k, n, p)` |
| fewer than k | 0 to k − 1 | $P(0) + \dots + P(k-1)$ | `pbinom(k-1, n, p)` |
| at least k | k to n | $1 - P(X \le k-1)$ | `1 - pbinom(k-1, n, p)` |
| more than k | k + 1 to n | $1 - P(X \le k)$ | `1 - pbinom(k, n, p)` |
| between a and b inclusive | a to b | $P(X \le b) - P(X \le a-1)$ | `pbinom(b, n, p) - pbinom(a-1, n, p)` |
| at least one | 1 to n | $1 - P(0)$ | `1 - dbinom(0, n, p)` |

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(k, n, p)` | Slots `pbinom(q, size, prob)`: q = k, size = n, prob = p. Returns P(X ≤ k). |
| `k-1` | Inside the first slot: the count one below k, so the sum stops before k. |
| `1 - …` | Subtracts the cumulative sum from 1: the complement. |
| `pbinom(b, …) - pbinom(a-1, …)` | Up to b, minus up to a − 1, leaves a to b. |
| `dbinom(0, n, p)` | Slots `dbinom(x, size, prob)`: P(X = 0). |

**Left to right**

- `pbinom(k, n, p)`: "The probability of at most (`pbinom`) k (`k`) in n tries (`n`) at chance p (`p`)."
- `pbinom(k-1, n, p)`: "The probability of at most (`pbinom`) one below k (`k-1`) in n tries at chance p."
- `1 - pbinom(k-1, n, p)`: "One minus (`1 -`) the probability of at most one below k (`pbinom(k-1, n, p)`)."
- `1 - pbinom(k, n, p)`: "One minus (`1 -`) the probability of at most k (`pbinom(k, n, p)`)."
- `pbinom(b, n, p) - pbinom(a-1, n, p)`: "At most b (`pbinom(b, n, p)`) minus (`-`) at most one below a (`pbinom(a-1, n, p)`)."
- `1 - dbinom(0, n, p)`: "One minus (`1 -`) the probability of exactly zero (`dbinom(0, n, p)`)."

**Right to left**, the order R runs it

- `pbinom(k, n, p)`: "Take k, n and p, and add P(0) through P(k) (`pbinom`)."
- `pbinom(k-1, n, p)`: "Work out k minus 1 (`k-1`), then add P(0) through that count (`pbinom`)."
- `1 - pbinom(k-1, n, p)`: "Work out k minus 1, add up to it (`pbinom`), then take the result from 1 (`1 -`)."
- `1 - pbinom(k, n, p)`: "Add up to k (`pbinom`), then take the result from 1 (`1 -`)."
- `pbinom(b, n, p) - pbinom(a-1, n, p)`: "Add up to b (`pbinom`), add up to a − 1 (`pbinom`), then subtract the second from the first (`-`)."
- `1 - dbinom(0, n, p)`: "Compute P(X = 0) (`dbinom`), then take it from 1 (`1 -`)."
:::

The trap is "at least k". Its complement stops at k − 1, so the R line holds `k-1`, not `k`.

## Lab 6 Tasks 2 and 3: the instructor's lines

Task 2 rolls the 12-sided die 30 times and counts the 8s: $n = 30$, $p = \frac{1}{12}$. Its five parts are exactly 6, at most 6, at least 6, more than 6, and between 2 and 6 inclusive.

```r
n <- 30
p <- 1/12
dbinom(6, n, p)
pbinom(6, n, p)
1 - pbinom(5, n, p)
1 - pbinom(6, n, p)
pbinom(6, n, p) - pbinom(1, n, p)
```

```text
[1] 0.02464
[1] 0.9898
[1] 0.03487
[1] 0.01023
[1] 0.7158
```

:::info R syntax
| Code | What it does |
|---|---|
| `n <- 30`, `p <- 1/12` | `<-` stores a value under a name, so later lines can say `n` and `p`. |
| `dbinom(6, n, p)` | x = 6, size = n, prob = p: exactly 6. |
| `pbinom(…, n, p)` lines | q is the last count kept: 6 for at most 6, 5 for at least 6, 1 for between 2 and 6. |
| `1 -`, `-` | The complement, and the difference of two cumulative sums. |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- `n <- 30`, `p <- 1/12`: "Store under the name n (`n <-`) 30, and under the name p (`p <-`) one-twelfth (`1/12`)."
- the five probability lines: "Exactly 6 (`dbinom(6, n, p)`); at most 6 (`pbinom(6, n, p)`); one minus (`1 -`) at most 5; one minus at most 6; at most 6 minus (`-`) at most 1."

**Right to left**, the order R runs it

- `n <- 30`, `p <- 1/12`: "Work out 30 and 1/12, then store them as n and p (`<-`)."
- the five probability lines: "Look up n and p, compute each `dbinom` or `pbinom`, then do the subtraction (`1 -` or `-`) last."
:::

Task 3 is a coating line where 20 % of chips are defective, sampled 100 at a time. The lab writes `pbinom(24, n, p)` for X < 25 and `1 - pbinom(24, n, p)` for X ≥ 25.

| Words | R line | Prints |
|---|---|---|
| X = 25 | `dbinom(25, n, p)` | 0.04388 |
| X ≤ 25 | `pbinom(25, n, p)` | 0.9125 |
| X < 25 | `pbinom(24, n, p)` | 0.8686 |
| X ≥ 25 | `1 - pbinom(24, n, p)` | 0.1314 |
| 20 ≤ X ≤ 30 | `pbinom(30, n, p) - pbinom(19, n, p)` | 0.5338 |

:::info R syntax
| Code | What it does |
|---|---|
| `n`, `p` | Set earlier in the lab by `n <- 100` and `p <- 0.20`. |
| `dbinom(25, n, p)`, `pbinom(25, n, p)` | Exactly 25, and at most 25. |
| `24` in `pbinom(24, n, p)` | The last count kept for "below 25", and the complement's stop for "at least 25". |
| `pbinom(30, n, p) - pbinom(19, n, p)` | Up to 30 minus up to 19 leaves 20 to 30. |

**Left to right**

- `dbinom(25, n, p)`, `pbinom(25, n, p)`: "Exactly (`dbinom`) 25, and at most (`pbinom`) 25, in n tries at chance p."
- `pbinom(24, n, p)`, `1 - pbinom(24, n, p)`: "At most 24 (`pbinom(24, n, p)`), and one minus (`1 -`) that."
- `pbinom(30, n, p) - pbinom(19, n, p)`: "At most 30 minus (`-`) at most 19."

**Right to left**, the order R runs it

- `dbinom(25, n, p)`, `pbinom(25, n, p)`: "Look up n and p, then compute P(X = 25) (`dbinom`) and P(X ≤ 25) (`pbinom`)."
- `pbinom(24, n, p)`, `1 - pbinom(24, n, p)`: "Add P(0) to P(24) (`pbinom`); for the second, take that from 1 (`1 -`)."
- `pbinom(30, n, p) - pbinom(19, n, p)`: "Compute both sums (`pbinom`), then subtract (`-`)."
:::

The R side is drilled in [dbinom, pbinom, dpois, ppois](#/math3042-q7/r-binomial-poisson). The long version is [Binomial mean and variance; is a count unusual?](#/math3042-u4/binomial-mean-variance).

## SkyTrain gates, lab machines and exam guesses

```quiz
[
  {"q": "15 % of SkyTrain gate taps are rejected. Of 20 taps, which R line gives P(at least 4 rejected)?", "options": ["`1 - pbinom(3, 20, 0.15)`", "`1 - pbinom(4, 20, 0.15)`", "`pbinom(4, 20, 0.15)`", "`1 - dbinom(4, 20, 0.15)`"], "answer": 0, "explain": "At least 4 is everything except 0 to 3. So subtract P(X ≤ 3) from 1: `1 - pbinom(3, 20, 0.15)`, which is 0.3523 (computed). Using 4 inside drops the count 4 itself and gives more than 4."},
  {"q": "A BCIT lab has 12 machines, each down with probability 0.3. P(fewer than 5 down).", "type": "fill", "code": "pbinom(___, 12, 0.3)", "answer": ["4"], "explain": "Fewer than 5 is 0, 1, 2, 3, 4. `pbinom(4, 12, 0.3)` adds those five terms: 0.7237 (computed)."},
  {"q": "15 tries at $p = 0.4$. P(between 3 and 7 inclusive).", "type": "fill", "code": "pbinom(7, 15, 0.4) - pbinom(___, 15, 0.4)", "answer": ["2"], "explain": "Up to 7, minus up to 2, leaves 3 to 7. The second slot is a − 1 = 2: `pbinom(7, 15, 0.4) - pbinom(2, 15, 0.4)` = 0.7598 (computed)."},
  {"q": "25 tries at $p = 0.4$. P(more than 9).", "type": "fill", "code": "1 - pbinom(___, 25, 0.4)", "answer": ["9"], "explain": "More than 9 starts at 10. Its complement is 0 to 9, so the line is `1 - pbinom(9, 25, 0.4)` = 0.5754 (computed)."},
  {"q": "5 tries. Which sum on paper gives P(at least 2)?", "options": ["$1 - [P(0) + P(1)]$", "$1 - [P(0) + P(1) + P(2)]$", "$P(2) + P(3) + P(4)$", "$1 - P(1)$"], "answer": 0, "explain": "At least 2 is 2, 3, 4, 5. Its complement is 0 and 1, so $1 - [P(0) + P(1)]$. Writing out $P(2) + \\dots + P(5)$ also works, but needs four terms and must not stop at 4."},
  {"q": "A student guesses on 5 multiple-choice questions with 5 options each, so $p = 0.2$. P(at most 1 right)? (4 decimals)", "type": "numeric", "answer": 0.7373, "tolerance": 0.0001, "explain": "Let X = the number right out of 5. Binomial with $n = 5$, $p = 0.2$, $q = 0.8$. At most 1 is 0 or 1. $$P(0) = 0.8^5 = 0.32768 \\qquad P(1) = {}_5C_1 \\, (0.2)(0.8)^4 = 5 \\times 0.2 \\times 0.4096 = 0.4096$$ $$P(X \\le 1) = 0.32768 + 0.4096 = \\mathbf{0.7373}$$"}
]
```

## Star Force, Greater scrolls, Chaos Orbs and Chaos Scrolls

The same words table runs every item-upgrade question in the games. Each item below is its own independent roll at a fixed chance.

Star Force, the GMS enhancement that adds stars to gear, succeeds 40 % at 12 to 13 stars on the wiki's table, without the Star Catch bonus that v.271 builds in. Below 15 stars a failure keeps the star, so ten items each at 12 stars, one attempt each, are ten tries at the same p.

A Greater scroll in MapleStory Classic passes 10 % of the time, and each upgrade slot rolls on its own.

A Chaos Orb in Path of Exile rerolls every modifier on a rare, and the wiki gives 4, 5 or 6 affixes in the ratio 8:3:1. Six affixes is 1 in 12, fresh on every reroll.

A GMS Chaos Scroll that succeeds changes each stat by −5 to +5; the wiki's table gives +5 with probability 0.99 %, rolled anew on every successful use.

```quiz
[
  {"q": "Ten items each at 12 stars, one Star Force attempt each at $p = 0.40$. Which R line gives P(at least 4 succeed)?", "options": ["`1 - pbinom(3, 10, 0.4)`", "`1 - pbinom(4, 10, 0.4)`", "`pbinom(4, 10, 0.4)`", "`1 - dbinom(3, 10, 0.4)`"], "answer": 0, "explain": "At least 4 is everything except 0 to 3, so subtract P(X ≤ 3) from 1: `1 - pbinom(3, 10, 0.4)` = $1 - 0.3823 = \\mathbf{0.6177}$ (computed). A 4 inside drops the count 4 itself and gives more than 4."},
  {"q": "A Greater scroll passes with probability 0.1. Seven slots, one scroll each. P(at least one passes)? (4 decimals)", "type": "numeric", "answer": 0.5217, "tolerance": 0.0001, "explain": "Let X = the number of the 7 scrolls that pass; binomial with $n = 7$, $p = 0.1$. At least one is the complement of none: $$P(X \\ge 1) = 1 - P(0) = 1 - 0.9^7 = 1 - 0.478297 = \\mathbf{0.5217}$$"},
  {"q": "24 Chaos Orb rerolls on one rare; each lands 6 affixes with $p = 1/12$. P(at most 1 of the 24 lands 6 affixes).", "type": "fill", "code": "pbinom(___, 24, 1/12)", "answer": ["1"], "explain": "At most 1 is 0 or 1, so q = 1: `pbinom(1, 24, 1/12)`. By hand: $$P(0) = \\left(\\tfrac{11}{12}\\right)^{24} = 0.123901 \\qquad P(1) = {}_{24}C_1 \\left(\\tfrac{1}{12}\\right)\\left(\\tfrac{11}{12}\\right)^{23} = 0.270329$$ $$P(X \\le 1) = 0.123901 + 0.270329 = \\mathbf{0.3942}$$"},
  {"q": "20 successful Chaos Scroll uses on an item with one stat; each gives +5 with $p = 0.0099$. P(at least one +5)? (4 decimals)", "type": "numeric", "answer": 0.1804, "tolerance": 0.0001, "explain": "Let X = the number of +5 results in 20 successful uses; binomial with $n = 20$, $p = 0.0099$. $$P(X \\ge 1) = 1 - 0.9901^{20} = 1 - 0.819561 = \\mathbf{0.1804}$$ The rate applies to successful uses only, so failed scrolls do not count toward the 20."}
]
```

## Remember

- Write the counts out first: at least 2 is 2, 3, … n.
- At most k is `pbinom(k, n, p)`.
- At least k is `1 - pbinom(k-1, n, p)`: the complement stops at k − 1.
- More than k is `1 - pbinom(k, n, p)`.
- Between a and b inclusive is `pbinom(b, n, p) - pbinom(a-1, n, p)`.
- At least one is $1 - P(0)$.
- On paper, add the shorter side.

:::info R syntax
| Code | What it does |
|---|---|
| `pbinom(k, n, p)`, `pbinom(k-1, n, p)` | P(X ≤ k) and P(X ≤ k − 1): slots q, size, prob. |
| `1 - pbinom(…)` | The complement of a cumulative sum. |
| `pbinom(b, n, p) - pbinom(a-1, n, p)` | Up to b minus up to a − 1. |

**Left to right**

- `pbinom(k, n, p)`: "At most (`pbinom`) k."
- `1 - pbinom(k-1, n, p)`: "One minus (`1 -`) at most one below k (`k-1`)."
- `1 - pbinom(k, n, p)`: "One minus (`1 -`) at most k."
- `pbinom(b, n, p) - pbinom(a-1, n, p)`: "At most b minus (`-`) at most one below a (`a-1`)."

**Right to left**, the order R runs it

- `pbinom(k, n, p)`: "Add P(0) through P(k) (`pbinom`)."
- `1 - pbinom(k-1, n, p)`: "Work out k − 1, add up to it (`pbinom`), take from 1 (`1 -`)."
- `1 - pbinom(k, n, p)`: "Add up to k (`pbinom`), take from 1 (`1 -`)."
- `pbinom(b, n, p) - pbinom(a-1, n, p)`: "Compute both sums (`pbinom`), then subtract (`-`)."
:::
