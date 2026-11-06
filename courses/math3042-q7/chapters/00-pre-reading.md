---
title: "Before you start: the calculator keys and the three R facts the lessons assume"
minutes: 8
---
<!-- facts: classic.scroll.tiers -->
Every Part 1 answer ends with a few presses on the calculator, and every Part 2 answer leans on three facts about R. This page covers both, so no later lesson stops to explain a key.

## A probability is a fraction between 0 and 1

In MapleStory Classic, an Intermediate scroll is a scroll that upgrades a piece of gear and passes at a fixed rate: 60 %, by meowdb's copy of the item text. So one use passes with probability 0.6 and fails with probability 0.4.

The two add to 1, because one of them always happens. That gives the fastest trick on the quiz: the chance of "at least one" is 1 minus the chance of "none".

Three scrolls all fail with probability $0.4 \times 0.4 \times 0.4$, so at least one passes with:

$$P(\text{at least one pass}) = 1 - 0.4^3 = 1 - 0.064 = \mathbf{0.936}$$

## Powers and factorials on the calculator

$0.6^3$ means $0.6 \times 0.6 \times 0.6$. On the calculator type 0.6, press the power key ($x^y$, $y^x$ or ^), then 3.

$$0.6^3 = \mathbf{0.216}$$

A factorial $x!$ multiplies every whole number from $x$ down to 1. By definition $0! = 1$.

$$4! = 4 \times 3 \times 2 \times 1 = \mathbf{24}$$

The key is marked $n!$ or $x!$. On many calculators it is a second function, so press 2ndF or SHIFT first.

## nCx: how many ways to pick which x of the n succeed

Three scrolls with exactly two passes can happen as PPF, PFP or FPP. That count, 3, is ${}_3C_2$: the number of ways to choose which 2 of the 3 tries are the passes.

$${}_nC_x = \frac{n!}{x!\,(n-x)!}$$

Here $n$ is the number of tries and $x$ the number of successes. The bottom removes the orderings that do not matter.

$${}_3C_2 = \frac{3!}{2!\,1!} = \frac{6}{2 \times 1} = \mathbf{3}$$

On the calculator, type n, press the nCr key, then type x. On a Sharp that is n, 2ndF, nCr, x. On a Casio it is n, SHIFT, ÷, x. On a TI it is n, MATH, PRB, nCr, x.

With no nCr key, write the top as x factors counting down from n, and the bottom as $x!$. The rest cancels.

$${}_{14}C_3 = \frac{14 \times 13 \times 12}{3 \times 2 \times 1} = \frac{2184}{6} = \mathbf{364}$$

```diagram
{"type": "grid", "title": "nCx values the lessons use", "nodes": [{"id": "h0", "label": "n", "row": 0, "col": 0}, {"id": "h1", "label": "x", "row": 0, "col": 1}, {"id": "h2", "label": "nCx", "row": 0, "col": 2}, {"id": "a0", "label": "3", "row": 1, "col": 0}, {"id": "a1", "label": "2", "row": 1, "col": 1}, {"id": "a2", "label": "3", "row": 1, "col": 2}, {"id": "b0", "label": "4", "row": 2, "col": 0}, {"id": "b1", "label": "1", "row": 2, "col": 1}, {"id": "b2", "label": "4", "row": 2, "col": 2}, {"id": "c0", "label": "8", "row": 3, "col": 0}, {"id": "c1", "label": "3", "row": 3, "col": 1}, {"id": "c2", "label": "56", "row": 3, "col": 2}, {"id": "d0", "label": "10", "row": 4, "col": 0}, {"id": "d1", "label": "7", "row": 4, "col": 1}, {"id": "d2", "label": "120", "row": 4, "col": 2}, {"id": "e0", "label": "14", "row": 5, "col": 0}, {"id": "e1", "label": "3", "row": 5, "col": 1}, {"id": "e2", "label": "364", "row": 5, "col": 2}, {"id": "f0", "label": "16", "row": 6, "col": 0}, {"id": "f1", "label": "3", "row": 6, "col": 1}, {"id": "f2", "label": "560", "row": 6, "col": 2}], "hi": ["e0", "e1", "e2"], "caption": "Compute each row on your calculator before you trust it. 10C7 equals 10C3: choosing the 7 passes is the same as choosing the 3 fails."}
```

## The number e and its calculator key

The Poisson formula uses the number $e = 2.718\ldots$ raised to a negative power. The key is $e^x$, often the second function of ln.

For $e^{-2}$, type 2, press the sign key (+/− or (−)), then $e^x$. On a calculator that takes the key first, press $e^x$, then −2.

$$e^{-2} = \mathbf{0.1353}$$

Keep six digits in the middle of a calculation, such as $e^{-5} = 0.006738$, and round only on the last line.

## Rounding on Part 1

A probability is rounded to 4 decimals. A mean $\mu$, a standard deviation $\sigma$ and a Z-score are rounded to 2 decimals.

## Three R facts

`<-` stores a value under a name, so later lines can use the name. `$` picks one column out of a data frame by its name.

In R, TRUE counts as 1 and FALSE as 0. So the mean of a TRUE/FALSE vector is the share of TRUE: a proportion, which is a probability from data.

```r
p <- 0.6
passes <- c(TRUE, FALSE, TRUE)
mean(passes)
```

```text
[1] 0.6666667
```

:::info R syntax
| Code | What it does |
|---|---|
| `p <- 0.6` | `<-` stores 0.6 under the name `p`. |
| `c(TRUE, FALSE, TRUE)` | `c()` combines the three values into one vector. |
| `passes <- …` | Stores that vector under the name `passes`. |
| `mean(passes)` | Averages the vector; TRUE counts 1 and FALSE 0, so this is 2 out of 3. |
| `[1]` | In the output, the position of the first value on the printed line. |

**Left to right**

- `p <- 0.6`: "Store under the name p (`p <-`) the number 0.6."
- `passes <- c(TRUE, FALSE, TRUE)`: "Store under the name passes (`passes <-`) the values TRUE, FALSE, TRUE combined (`c`)."
- `mean(passes)`: "The average (`mean`) of passes."

**Right to left**, the order R runs it

- `p <- 0.6`: "Take 0.6 and store it as p (`<-`)."
- `passes <- c(TRUE, FALSE, TRUE)`: "Combine the three values (`c`), then store them as passes (`<-`)."
- `mean(passes)`: "Look up passes, count TRUE as 1 and FALSE as 0, and average them (`mean`)."
:::

The `[1]` before each printed answer is the position of the first value on that line. It is not part of the answer.

## Remember

- ${}_nC_x = \dfrac{n!}{x!\,(n-x)!}$: the number of ways to place x successes among n tries.
- On the calculator: n, nCr, x. With no key: x factors counting down from n, over $x!$.
- $0! = 1$.
- $e^{-\lambda}$ is the $e^x$ key with a negative number.
- In R, TRUE counts 1, so `mean()` of a TRUE/FALSE column is a proportion.

```quiz
[
  {"q": "${}_{12}C_2$ = ?", "type": "numeric", "answer": 66, "tolerance": 0, "explain": "$$ {}_{12}C_2 = \\dfrac{12 \\times 11}{2 \\times 1} = \\dfrac{132}{2} = \\mathbf{66}$$ On the calculator: 12, nCr, 2."},
  {"q": "${}_{15}C_4$ = ? Use the fraction form if your calculator has no nCr key.", "type": "numeric", "answer": 1365, "tolerance": 0, "explain": "Four factors counting down from 15 on top, $4!$ underneath: $$ {}_{15}C_4 = \\dfrac{15 \\times 14 \\times 13 \\times 12}{4 \\times 3 \\times 2 \\times 1} = \\dfrac{32760}{24} = \\mathbf{1365}$$"},
  {"q": "$0.6^4$ = ? (4 decimals)", "type": "numeric", "answer": 0.1296, "tolerance": 0.0001, "explain": "$$0.6^4 = 0.6 \\times 0.6 \\times 0.6 \\times 0.6 = \\mathbf{0.1296}$$ This is four Intermediate scrolls in a row all passing."},
  {"q": "$e^{-3}$ = ? (4 decimals)", "type": "numeric", "answer": 0.0498, "tolerance": 0.0001, "explain": "Type 3, the sign key, then $e^x$: $$e^{-3} = 0.049787 = \\mathbf{0.0498}$$"},
  {"q": "$5!$ = ?", "type": "numeric", "answer": 120, "tolerance": 0, "explain": "$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = \\mathbf{120}$$"},
  {"q": "What does `mean(c(TRUE, TRUE, FALSE, FALSE, TRUE))` print?", "options": ["`[1] 0.6`", "`[1] 3`", "`[1] TRUE`", "`[1] 0.4`"], "answer": 0, "explain": "TRUE counts 1 and FALSE 0. Three TRUEs out of five values: $3/5 = 0.6$. `sum()` would print 3."}
]
```
