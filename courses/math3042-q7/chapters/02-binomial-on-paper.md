---
title: "Binomial on paper: x successes in n fixed trials"
minutes: 12
---
<!-- facts: classic.scroll.tiers, poe1.vaal.gem-outcomes, poe1.price.currency-snapshot, poe2.items.unid-rare-mod-count, poe2.items.affix-limits -->
Part 1 gives you a number of tries, a chance of success on each, and asks for the chance of an exact count. The binomial formula answers it in one line.

## A binomial count: a fixed number of yes-or-no tries

You try something a set number of times. Each try ends in yes or no. The chance of a yes is the same every time, and one try does not change the next. Just like using Intermediate scrolls on gear: you decide how many to use, each one passes or fails, each pass is 60 %, and one scroll does not change the next scroll's odds.

**The count of yeses is the binomial variable X.** It can be 0, 1, 2, and so on up to the number of tries.

**Before you use the formula, check the four conditions.** The course's binomial lab checks them in these words for a fair 12-sided die rolled 30 times, counting how often it shows an 8.

```diagram
{"type": "grid", "title": "The four binomial conditions", "nodes": [{"id": "h0", "label": "Condition", "row": 0, "col": 0}, {"id": "h1", "label": "Plain words", "row": 0, "col": 1}, {"id": "h2", "label": "12-sided die, 30 rolls", "row": 0, "col": 2}, {"id": "a0", "label": "Fixed number of trials", "row": 1, "col": 0}, {"id": "a1", "label": "n is set before you start", "row": 1, "col": 1}, {"id": "a2", "label": "n = 30 rolls", "row": 1, "col": 2}, {"id": "b0", "label": "Success / failure", "row": 2, "col": 0}, {"id": "b1", "label": "each try is yes or no", "row": 2, "col": 1}, {"id": "b2", "label": "an 8 is a success", "row": 2, "col": 2}, {"id": "c0", "label": "Equal probability", "row": 3, "col": 0}, {"id": "c1", "label": "same p every try", "row": 3, "col": 1}, {"id": "c2", "label": "p = 1/12", "row": 3, "col": 2}, {"id": "d0", "label": "Independence", "row": 4, "col": 0}, {"id": "d1", "label": "one try does not change the next", "row": 4, "col": 1}, {"id": "d2", "label": "rolls do not influence each other", "row": 4, "col": 2}], "hi": ["a0", "b0", "c0", "d0"], "caption": "All four must hold. A count with no fixed n is not binomial."}
```

:::warn "Keep going until the first yes" is not binomial
For example, using scrolls until one passes has no fixed n, so the binomial formula does not apply.
:::

## Three Intermediate scrolls: eight ways to land two

In MapleStory Classic, an Intermediate scroll is a scroll that upgrades a piece of gear and passes at a fixed rate: 60 %. Use three of them on one item. Each use passes (P) or fails (F), and the rate does not change.

Let X be the number of passes.

- $n = 3$, the number of scrolls used.
- $p = 0.6$, the chance one scroll passes.
- $q = 1 - 0.6 = 0.4$, the chance one scroll fails. **A fail takes the rest of the chance.**

A **sequence** is the full result of the three uses, written in order. For example, PPF means the first scroll passed, the second passed and the third failed. Just like a three-game record such as win, win, loss.

**Each use has 2 possible results, P or F.** The first use has 2 results. Each of those can be followed by 2 results on the second use, and each of those by 2 on the third. That makes 8 sequences:

$$\underbrace{2}_{\text{1st use: P or F}} \times \underbrace{2}_{\text{2nd use}} \times \underbrace{2}_{\text{3rd use}} = 2^3 = \mathbf{8}$$

Just like flipping a coin three times: HHH, HHT, HTH and so on, 8 in all. The grid sorts the 8 sequences by how many passes they hold.

```diagram
{"type": "grid", "title": "Three scrolls: the eight sequences by number of passes", "nodes": [{"id": "h0", "label": "X = passes", "row": 0, "col": 0}, {"id": "h1", "label": "Sequences", "row": 0, "col": 1}, {"id": "h2", "label": "How many", "row": 0, "col": 2}, {"id": "h3", "label": "Each one", "row": 0, "col": 3}, {"id": "r0a", "label": "0", "row": 1, "col": 0}, {"id": "r0b", "label": "FFF", "row": 1, "col": 1}, {"id": "r0c", "label": "1", "row": 1, "col": 2}, {"id": "r0d", "label": "0.4³", "row": 1, "col": 3}, {"id": "r1a", "label": "1", "row": 2, "col": 0}, {"id": "r1b", "label": "PFF, FPF, FFP", "row": 2, "col": 1}, {"id": "r1c", "label": "3", "row": 2, "col": 2}, {"id": "r1d", "label": "0.6 × 0.4²", "row": 2, "col": 3}, {"id": "r2a", "label": "2", "row": 3, "col": 0}, {"id": "r2b", "label": "PPF, PFP, FPP", "row": 3, "col": 1}, {"id": "r2c", "label": "3", "row": 3, "col": 2}, {"id": "r2d", "label": "0.6² × 0.4", "row": 3, "col": 3}, {"id": "r3a", "label": "3", "row": 4, "col": 0}, {"id": "r3b", "label": "PPP", "row": 4, "col": 1}, {"id": "r3c", "label": "1", "row": 4, "col": 2}, {"id": "r3d", "label": "0.6³", "row": 4, "col": 3}], "hi": ["r2a", "r2b", "r2c", "r2d"], "caption": "Exactly two passes: three orders, each with two 0.6s and one 0.4."}
```

Take one order with two passes, PPF. **Its chance is the three uses multiplied together:** 0.6 for the first pass, 0.6 for the second pass, and 0.4 for the fail.

$$P(\text{PPF}) = \underbrace{0.6}_{\text{1st passes}} \times \underbrace{0.6}_{\text{2nd passes}} \times \underbrace{0.4}_{\text{3rd fails}} = 0.144$$

PFP and FPP hold the same two 0.6s and one 0.4 in a different order, so each of them is also 0.144. **Orders that cannot happen together add.** Just like winning a raffle with ticket A or ticket B: two separate ways to win, so their chances add. Add the three orders: $0.144 + 0.144 + 0.144$, which is 3 times one order.

$$P(X = 2) = \underbrace{3}_{\text{orders}} \times \underbrace{0.6^2 \times 0.4}_{\text{one order}} = 3 \times 0.36 \times 0.4 = \mathbf{0.432}$$

## The formula: count the orders, then price one order

The scroll answer took two steps. **Step 1: count the orders that give x passes** (3 orders above). **Step 2: multiply by the chance of one such order** ($0.6 \times 0.6 \times 0.4$ above). The binomial formula does those same two steps for any number of tries.

$$P(x) = \underbrace{{}_nC_x}_{\text{step 1: how many orders}} \times \underbrace{p^x \, q^{n-x}}_{\text{step 2: chance of one order}}$$

:::tip The two exponents add to n
For the three scrolls, p gets exponent 2 and q gets exponent 1, and 2 + 1 = 3. If yours do not add to n, one exponent is wrong.
:::

For the three scrolls, each symbol is:

- $n = 3$, the number of scrolls used.
- $x = 2$, the number of passes asked about.
- $p = 0.6$, the chance one scroll passes.
- $q = 1 - p = 0.4$, the chance one scroll fails.
- ${}_nC_x$ counts the orders: $\displaystyle {}_nC_x = \frac{n!}{x!\,(n-x)!}$, the calculator's nCr key.

$${}_3C_2 = \frac{\underbrace{3}_{\text{scrolls}}!}{\underbrace{2}_{\text{passes}}!\,\underbrace{1}_{\text{fails}}!} = \frac{6}{2 \times 1} = \mathbf{3}$$

The keys, and the fraction form for a calculator without nCr, are in [Before you start](#/math3042-q7/pre-reading).

Now put the scroll numbers in. Each label says what the number is and why it sits there:

$$P(2) = \underbrace{{}_3C_2}_{\text{3 orders give 2 passes}} \times \underbrace{(0.6)^2}_{\text{2 passes, 0.6 each}} \times \underbrace{(0.4)^{1}}_{\text{1 fail, 0.4 each}} = 3 \times 0.36 \times 0.4 = \mathbf{0.432}$$

The same line for the other counts gives $P(0) = 0.064$, $P(1) = 0.288$ and $P(3) = 0.216$ (computed). **The four add to 1, which is the check that nothing was missed.** Just like the slices of a whole pizza: every possible count is one slice, and together they make the whole.

$$\underbrace{0.064}_{P(0)} + \underbrace{0.288}_{P(1)} + \underbrace{0.432}_{P(2)} + \underbrace{0.216}_{P(3)} = \mathbf{1}$$

## A 12-sided die rolled 30 times: the formula line and dbinom agree

The course's binomial lab rolls a fair 12-sided die 30 times. X is the number of times it shows an 8.

- $n = 30$, the number of rolls.
- $x = 3$, the number of times it shows an 8 that the question asks about.
- $p = \frac{1}{12}$, the chance one roll lands on an 8.
- $q = \frac{11}{12}$, the chance one roll lands on anything else.

$${}_{30}C_3 = \frac{\underbrace{30 \times 29 \times 28}_{\text{3 factors down from 30 rolls}}}{\underbrace{3 \times 2 \times 1}_{\text{3! for the 3 eights}}} = \mathbf{4060}$$

$$P(3) = \underbrace{{}_{30}C_3}_{\text{orders with 3 eights}} \times \underbrace{\left(\tfrac{1}{12}\right)^3}_{\text{3 rolls show 8, 1/12 each}} \times \underbrace{\left(\tfrac{11}{12}\right)^{27}}_{\text{27 rolls do not, 11/12 each}} = \mathbf{0.2242}$$

In R you can type the formula yourself, then get the same number from the built-in function `dbinom`. Just like adding a bill by hand and then checking it on your phone's calculator.

```r
choose(30,3)*(1/12)^3 * (11/12)^27
dbinom(3, 30, 1/12)
```

```text
[1] 0.2242
[1] 0.2242
```

:::info R syntax
| Code | What it does |
|---|---|
| `choose(30,3)` | ${}_{30}C_3$: the number of ways to pick which 3 of the 30 rolls are 8s. |
| `(1/12)^3`, `(11/12)^27` | `^` raises to a power; the brackets make R divide first. |
| `*` | Multiplies; the spaces around the second `*` change nothing. |
| `dbinom(3, 30, 1/12)` | Slots `dbinom(x, size, prob)`: x = 3 successes, size = 30 (n), prob = 1/12 (p). |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- `choose(30,3)*(1/12)^3 * (11/12)^27`: "The number of orders (`choose(30,3)`) times one-twelfth (`1/12`) to the power 3 (`^3`) times (`*`) eleven-twelfths (`11/12`) to the power 27 (`^27`)."
- `dbinom(3, 30, 1/12)`: "The binomial probability of exactly (`dbinom`) 3 successes (`3`) in 30 tries (`30`) with success chance one-twelfth (`1/12`)."

**Right to left**, the order R runs it

- `choose(30,3)*(1/12)^3 * (11/12)^27`: "Count the orders (`choose`), work out each bracket (`1/12`, `11/12`) and its power (`^`), then multiply them all (`*`)."
- `dbinom(3, 30, 1/12)`: "Divide 1 by 12 (`1/12`), take x = 3 and size = 30, and return P(X = 3) (`dbinom`)."
:::

The trap is the slot order. **`dbinom` takes the count asked about first, then n, then p.**

:::warn dbinom with n and x swapped returns 0
`dbinom(30, 3, 1/12)` asks for 30 successes in 3 tries. That cannot happen, so R prints 0 instead of an error.
:::

## The centre and spread: μ = np, σ = √(npq)

**The mean count is n times p. The standard deviation is the square root of n, p and q multiplied.** Round both to 2 decimals, and Z too. Just like a basketball player's free throws: the mean is how many go in on a typical night, and the standard deviation is how much that swings from night to night.

For the 30 rolls of the die:

- $n = 30$, the number of rolls.
- $p = \frac{1}{12}$, the chance one roll lands on an 8.
- $q = \frac{11}{12}$, the chance one roll lands on anything else.

The mean is:

$$\mu = np = \underbrace{30}_{\text{rolls}} \times \underbrace{\tfrac{1}{12}}_{\text{chance of an 8}} = \mathbf{2.5}$$

For the standard deviation, multiply n, p and q first, then take the square root:

$$npq = \underbrace{30}_{\text{rolls}} \times \underbrace{\tfrac{1}{12}}_{\text{chance of an 8}} \times \underbrace{\tfrac{11}{12}}_{\text{chance of no 8}} = 2.291667$$

$$\sigma = \sqrt{npq} = \sqrt{2.291667} = 1.513825 = \mathbf{1.51}$$

That σ is computed here, not given in the course material. **A count is unusual when its Z-score is beyond 2 either way.** Just like a friend who is usually 5 minutes late showing up an hour late: far from their normal, so you notice. Six 8s in 30 rolls:

- $x = 6$, the number of 8s seen.
- $\mu = 2.5$, the mean from above.
- $\sigma = 1.513825$, the SD from above, unrounded.

$$Z = \dfrac{x - \mu}{\sigma} = \dfrac{\underbrace{6}_{\text{8s seen}} - \underbrace{2.5}_{\text{mean}}}{\underbrace{1.513825}_{\text{SD, unrounded}}} = \mathbf{2.31}$$

$Z > 2$, so six 8s is unusual. The long version is in [Binomial mean and variance; is a count unusual?](#/math3042-u4/binomial-mean-variance), and the formula's own lesson is [Binomial experiments and the binomial formula](#/math3042-u4/binomial).

:::tip Unusual means |Z| > 2, in either direction
A count far below the mean is unusual too. A negative Z beyond −2 counts the same as a positive one beyond 2.
:::

## Sixteen Vaal Orbs on sixteen gems: how many gain a level

In Path of Exile, a Vaal Orb is the currency that corrupts an item. Used on a skill gem, it adds one gem level with probability 1/8, the wiki gives. Every other outcome leaves the level where it was or lowers it.

Put one orb on each of 16 different gems. Each gem gets its own roll at the same chance, so these are independent tries and X, the number of gems that gain a level, is binomial.

- $n = 16$, the number of gems, one orb each.
- $x = 3$, the number of gems that gain a level that the question asks about.
- $p = \tfrac{1}{8}$, the chance one orb adds a level to its gem.
- $q = \tfrac{7}{8}$, the chance one orb leaves its gem without a new level.

On poe.ninja's price of 2026-10-27, a Vaal Orb sold for 0.3195 chaos, so the 16 orbs cost about 5.11 chaos (computed).

$$\mu = np = \underbrace{16}_{\text{gems}} \times \underbrace{\tfrac{1}{8}}_{\text{chance of a level}} = \mathbf{2.00}$$

$$npq = \underbrace{16}_{\text{gems}} \times \underbrace{\tfrac{1}{8}}_{\text{chance of a level}} \times \underbrace{\tfrac{7}{8}}_{\text{chance of no level}} = 1.75$$

$$\sigma = \sqrt{npq} = \sqrt{1.75} = \mathbf{1.32}$$

$${}_{16}C_3 = \frac{\underbrace{16 \times 15 \times 14}_{\text{3 factors down from 16 gems}}}{\underbrace{3 \times 2 \times 1}_{\text{3! for the 3 levelled}}} = 560$$

$$P(3) = \underbrace{{}_{16}C_3}_{\text{orders with 3 levelled}} \times \underbrace{\left(\tfrac{1}{8}\right)^3}_{\text{3 gems level, 1/8 each}} \times \underbrace{\left(\tfrac{7}{8}\right)^{13}}_{\text{13 gems do not, 7/8 each}} = 560 \times 0.001953 \times 0.176240 = \mathbf{0.1928}$$

So for the 5.11 chaos the orbs cost, you level two gems on average ($\mu = 2$). **Exactly three** levelled gems happens about one run in five. That counts only runs with three, not four or more. The price is game detail: the quiz never asks for it.

## Ten Intermediate scrolls and an eight-question guess

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Binomial: $P(x) = C(n,x)\,p^x q^{n-x}$
- Binomial: $\mu = np$ and $\sigma^2 = npq$
- Combinations: $C(n,r) = \dfrac{n!}{(n-r)!\,r!}$, the nCr key
- $Z = \dfrac{X - \mu}{\sigma}$
- Complement: $P(\bar{A}) = 1 - P(A)$

**Not on the sheet, so know it:**

- $q = 1 - p$, the chance of a fail. The sheet uses q without defining it.
- $\sigma = \sqrt{\sigma^2}$. **The sheet gives the variance; take the square root for σ.**
- A count is unusual when $|Z| > 2$.
:::

```quiz
[
  {"q": "You use 10 Intermediate scrolls, each passing with $p = 0.6$. P(exactly 7 pass)? (4 decimals)", "type": "numeric", "answer": 0.2150, "tolerance": 0.0001, "explain": "Let X = the number of passes in 10 scrolls. Binomial with $n = 10$, $p = 0.6$, $q = 0.4$. $${}_{10}C_7 = {}_{10}C_3 = \\dfrac{\\underbrace{10 \\times 9 \\times 8}_{\\text{3 factors down from 10}}}{\\underbrace{3 \\times 2 \\times 1}_{\\text{3! for the 3 fails}}} = 120$$ $$P(7) = \\underbrace{{}_{10}C_7}_{\\text{orders with 7 passes}} \\times \\underbrace{(0.6)^7}_{\\text{7 pass, 0.6 each}} \\times \\underbrace{(0.4)^3}_{\\text{3 fail, 0.4 each}} = 120 \\times 0.027994 \\times 0.064 = \\mathbf{0.2150}$$"},
  {"q": "A COMP quiz has 8 multiple-choice questions, each with 4 options. You guess every one. P(exactly 3 right)? (4 decimals)", "type": "numeric", "answer": 0.2076, "tolerance": 0.0001, "explain": "Let X = the number right out of 8. Binomial with $n = 8$, $p = 0.25$, $q = 0.75$. $${}_8C_3 = \\dfrac{\\underbrace{8 \\times 7 \\times 6}_{\\text{3 factors down from 8}}}{\\underbrace{3 \\times 2 \\times 1}_{\\text{3! for the 3 right}}} = 56$$ $$P(3) = \\underbrace{{}_8C_3}_{\\text{orders with 3 right}} \\times \\underbrace{(0.25)^3}_{\\text{3 right, 0.25 each}} \\times \\underbrace{(0.75)^5}_{\\text{5 wrong, 0.75 each}} = 56 \\times 0.015625 \\times 0.237305 = \\mathbf{0.2076}$$"},
  {"q": "The 10 scrolls: the mean number of passes μ = ? (2 decimals)", "type": "numeric", "answer": 6, "tolerance": 0.05, "explain": "$$\\mu = np = \\underbrace{10}_{\\text{scrolls}} \\times \\underbrace{0.6}_{\\text{chance one passes}} = \\mathbf{6.00}$$"},
  {"q": "The 10 scrolls: the standard deviation σ = ? (2 decimals)", "type": "numeric", "answer": 1.55, "tolerance": 0.05, "explain": "$$npq = \\underbrace{10}_{\\text{scrolls}} \\times \\underbrace{0.6}_{\\text{chance one passes}} \\times \\underbrace{0.4}_{\\text{chance one fails}} = 2.4$$ $$\\sigma = \\sqrt{npq} = \\sqrt{2.4} = \\mathbf{1.55}$$"},
  {"q": "Only 2 of the 10 scrolls pass. Is that unusual? Answer Yes or No.", "type": "text", "answer": ["Yes", "yes", "YES"], "explain": "$$Z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{\\underbrace{2}_{\\text{passes seen}} - \\underbrace{6}_{\\text{mean}}}{\\underbrace{1.549193}_{\\text{SD, unrounded}}} = \\mathbf{-2.58}$$ Beyond −2, so **yes**, 2 passes is unusually low for a 60 % rate."},
  {"q": "A help desk solves 35 % of tickets on the first call. Of 6 tickets, write $P(X = 2)$ as the binomial formula with the numbers substituted. Use C(n,x), ^ for powers, * between factors, no spaces.", "type": "text", "answer": ["C(6,2)*0.35^2*0.65^4", "C(6,2)*(0.35)^2*(0.65)^4", "6C2*0.35^2*0.65^4", "6C2*(0.35)^2*(0.65)^4", "choose(6,2)*0.35^2*0.65^4", "C(6,2)*0.35^2*(1-0.35)^4", "15*0.35^2*0.65^4"], "explain": "${}_nC_x \\, p^x \\, q^{n-x}$ with $n = 6$, $x = 2$, $p = 0.35$, $q = 0.65$: $$\\underbrace{C(6,2)}_{\\text{orders with 2 solved}} \\cdot \\underbrace{0.35^2}_{\\text{2 solved, 0.35 each}} \\cdot \\underbrace{0.65^4}_{\\text{4 not, 0.65 each}} = 15 \\times 0.1225 \\times 0.178506 = \\mathbf{0.3280}$$ Four failures, so q has exponent 4."},
  {"q": "You identify 10 rare items in PoE2. A rare holds up to three prefixes and three suffixes, and the wiki gives 4, 5 or 6 modifiers in the ratio 8:3:1, so each has 6 modifiers with probability 1/12. P(none of the 10 has 6 modifiers)? (4 decimals)", "type": "numeric", "answer": 0.4189, "tolerance": 0.0001, "explain": "Let X = the number of the 10 rares with 6 modifiers. Each item rolls its own count, so X is binomial with $n = 10$, $p = \\tfrac{1}{12}$, $q = \\tfrac{11}{12}$. $$P(0) = \\underbrace{{}_{10}C_0}_{\\text{1 order: none}} \\times \\underbrace{\\left(\\tfrac{1}{12}\\right)^0}_{\\text{0 with 6 mods}} \\times \\underbrace{\\left(\\tfrac{11}{12}\\right)^{10}}_{\\text{10 without, 11/12 each}} = 1 \\times 1 \\times 0.418904 = \\mathbf{0.4189}$$ So at least one six-modifier rare is $1 - 0.4189 = 0.5811$."},
  {"q": "Sixteen Vaal Orbs, one per gem, each adds a level with $p = 1/8$. Six gems gain a level. Is that unusual? Answer Yes or No.", "type": "text", "answer": ["Yes", "yes", "YES"], "explain": "$\\mu = 2$ and $\\sigma = \\sqrt{1.75} = 1.322876$. $$Z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{\\underbrace{6}_{\\text{gems levelled}} - \\underbrace{2}_{\\text{mean}}}{\\underbrace{1.322876}_{\\text{SD, unrounded}}} = \\mathbf{3.02}$$ Beyond 2, so **yes**: six levels from sixteen orbs is unusually lucky."}
]
```

## Remember

- Binomial: fixed n, yes or no, the same p, independent tries.
- $P(x) = {}_nC_x \, p^x \, q^{n-x}$: count the orders, then price one order.
- The exponents add to n: x successes and n − x failures.
- `dbinom(x, size, prob)`: the count first, then n, then p.
- $\mu = np$ and $\sigma = \sqrt{npq}$, both to 2 decimals.
- Unusual means $|Z| > 2$.

:::info R syntax
| Code | What it does |
|---|---|
| `dbinom(x, size, prob)` | P(X = x): x is the count asked about, size is n, prob is p. |

**Left to right**

- `dbinom(x, size, prob)`: "The binomial probability of exactly (`dbinom`) x successes (`x`) in size tries (`size`) with success chance prob (`prob`)."

**Right to left**, the order R runs it

- `dbinom(x, size, prob)`: "Take x, n and p, then return P(X = x) (`dbinom`)."
:::
