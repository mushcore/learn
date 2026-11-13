---
title: "The Z table: the area to the left of z"
minutes: 12
---
<!-- facts: none; every number here is a Z-table cell or one of the notes' three standard normal examples -->
Areas under a normal curve cannot be worked out by hand, so on paper every normal question ends at a printed table. This lesson reads that table for Z alone.

## What you do with the table: look up, not calculate, not memorize

**The Z table is a page of answers that someone already worked out. In Part 1, on paper, you read one number off it; you never calculate it and you never memorize it.** Just like a times-table chart: you find 7 × 8 at the crossing of a row and a column instead of working it out.

| Your question | The answer |
|---|---|
| Do I calculate something? | Only around the table, never inside it. Before it: turn the value into Z. After it: sometimes 1 − cell, or one cell minus another. The area itself comes off the page. |
| Do I memorize it? | No. Learn how to read it: the row is z to one decimal, the column is the second decimal. A few cells are worth knowing by sight: 0.5000 at z = 0, 0.9750 at 1.96, 0.0250 at −1.96. |
| Is it for R? | No. In Part 2, `pnorm` gives the same area to the left, so R never needs the table. |

Every normal question on paper runs the same three steps, and the table is the middle one:

```diagram
{"type": "flow", "title": "A normal question on paper", "nodes": [{"id": "z", "label": "1. Value to Z", "sub": "Z = (x − μ)/σ, round to 2 decimals"}, {"id": "t", "label": "2. Read the table", "sub": "the area to the left of Z"}, {"id": "m", "label": "3. Pick the move", "sub": "the cell, 1 − cell, or a difference"}], "edges": [{"from": "z", "to": "t"}, {"from": "t", "to": "m"}], "hi": ["t"], "caption": "This lesson drills steps 2 and 3 on Z alone. The next lesson adds step 1."}
```

:::warn Bring the table question to the instructor
The course formula sheet has no Z table on it. Before the quiz, check with the instructor that a Z table is handed out with Part 1.
:::

## The table is a lookup: z in, area to the left out

**The Z table gives the area under the standard normal curve to the left of z, which is $P(Z \le z)$.** Just like a bus timetable: find the row and the column, and the cell is the answer, with no arithmetic.

The shaded part is everything under the bell to the left of z. That one area is what every cell of the table holds.

```diagram
{"type": "curve", "title": "Each cell is the area to the left of z", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.8, "label": "P(Z ≤ z)", "tone": "blue"}], "ticks": [0, {"x": 0.8, "label": "z"}]}
```

**The row is z to one decimal; the column is its second decimal.** For example, z = 1.10 is row 1.1, column .00, and z = 0.55 is row 0.5, column .05.

## The left tail beyond −1.96, shaded on the table

The curve is the standard normal: a bell centred on 0, with σ = 1. The shaded part is the thin left tail past −1.96, and under it the table lights row −1.9 and column .06.

```widget
z-table
{ "z": -1.96, "mode": "left", "title": "P(Z ≤ −1.96): row −1.9, column .06" }
```

## One cell: the area left of 1.10

The notes ask for the area to the left of 1.10.

- row 1.1, the z value to one decimal.
- column .00, its second decimal.

```diagram
{"type": "grid", "title": "Part of the positive page of the Z table", "nodes": [{"id": "h0", "label": "z", "row": 0, "col": 0}, {"id": "h1", "label": ".00", "row": 0, "col": 1}, {"id": "h2", "label": ".03", "row": 0, "col": 2}, {"id": "h3", "label": ".05", "row": 0, "col": 3}, {"id": "h4", "label": ".06", "row": 0, "col": 4}, {"id": "r50", "label": "0.5", "row": 1, "col": 0}, {"id": "r51", "label": "0.6915", "row": 1, "col": 1}, {"id": "r52", "label": "0.7019", "row": 1, "col": 2}, {"id": "r53", "label": "0.7088", "row": 1, "col": 3}, {"id": "r54", "label": "0.7123", "row": 1, "col": 4}, {"id": "r100", "label": "1.0", "row": 2, "col": 0}, {"id": "r101", "label": "0.8413", "row": 2, "col": 1}, {"id": "r102", "label": "0.8485", "row": 2, "col": 2}, {"id": "r103", "label": "0.8531", "row": 2, "col": 3}, {"id": "r104", "label": "0.8554", "row": 2, "col": 4}, {"id": "r110", "label": "1.1", "row": 3, "col": 0}, {"id": "r111", "label": "0.8643", "row": 3, "col": 1}, {"id": "r112", "label": "0.8708", "row": 3, "col": 2}, {"id": "r113", "label": "0.8749", "row": 3, "col": 3}, {"id": "r114", "label": "0.8770", "row": 3, "col": 4}, {"id": "r120", "label": "1.2", "row": 4, "col": 0}, {"id": "r121", "label": "0.8849", "row": 4, "col": 1}, {"id": "r122", "label": "0.8907", "row": 4, "col": 2}, {"id": "r123", "label": "0.8944", "row": 4, "col": 3}, {"id": "r124", "label": "0.8962", "row": 4, "col": 4}], "hi": ["r110", "h1", "r111"], "caption": "Row 1.1, column .00: the area left of 1.10 is 0.8643. Row 0.5, column .05 gives 0.7088 for 0.55."}
```

$$P(Z \le \underbrace{1.10}_{\text{row 1.1, column .00}}) = \mathbf{0.8643}$$

**On the negative page the column digit is added in the negative direction:** row −1.9 with column .06 is z = −1.96. For example, row −2.0 with column .03 is −2.03.

```diagram
{"type": "grid", "title": "Part of the negative page of the Z table", "nodes": [{"id": "h0", "label": "z", "row": 0, "col": 0}, {"id": "h1", "label": ".00", "row": 0, "col": 1}, {"id": "h2", "label": ".03", "row": 0, "col": 2}, {"id": "h3", "label": ".05", "row": 0, "col": 3}, {"id": "h4", "label": ".06", "row": 0, "col": 4}, {"id": "m200", "label": "−2.0", "row": 1, "col": 0}, {"id": "m201", "label": "0.0228", "row": 1, "col": 1}, {"id": "m202", "label": "0.0212", "row": 1, "col": 2}, {"id": "m203", "label": "0.0202", "row": 1, "col": 3}, {"id": "m204", "label": "0.0197", "row": 1, "col": 4}, {"id": "m190", "label": "−1.9", "row": 2, "col": 0}, {"id": "m191", "label": "0.0287", "row": 2, "col": 1}, {"id": "m192", "label": "0.0268", "row": 2, "col": 2}, {"id": "m193", "label": "0.0256", "row": 2, "col": 3}, {"id": "m194", "label": "0.0250", "row": 2, "col": 4}, {"id": "m180", "label": "−1.8", "row": 3, "col": 0}, {"id": "m181", "label": "0.0359", "row": 3, "col": 1}, {"id": "m182", "label": "0.0336", "row": 3, "col": 2}, {"id": "m183", "label": "0.0322", "row": 3, "col": 3}, {"id": "m184", "label": "0.0314", "row": 3, "col": 4}], "hi": ["m190", "h4", "m194"], "caption": "Row −1.9, column .06: the area left of −1.96 is 0.0250. The cells shrink as z moves further left."}
```

## The three moves, each named

Every question asks for one of three shapes of area. Sketch the bell, shade the area, then pick the move.

The three shapes: a tail on the left, a tail on the right, and a strip with an edge on each side. Only the left tail is printed in the table; the other two are built from cells.

```diagram
{"type": "curve", "title": "Three shapes of area, three moves", "panels": [{"title": "Left of z: the cell", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 0.5, "label": "cell(z)", "tone": "hl"}], "ticks": [{"x": 0.5, "label": "z"}]}, {"title": "Right of z: 1 − cell", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 1, "label": "cell(z)", "tone": "blue"}, {"from": 1, "label": "1 − cell(z)", "tone": "hl"}], "ticks": [{"x": 1, "label": "z"}]}, {"title": "Between: a difference", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": -0.6, "to": 1, "label": "cell(b) − cell(a)", "tone": "hl"}], "ticks": [{"x": -0.6, "label": "a"}, {"x": 1, "label": "b"}]}]}
```

- **Left of z: the cell itself.** $P(Z \le z) = \text{cell}(z)$.
- **Right of z: 1 minus the cell**, because the whole area under the curve is 1. $P(Z > z) = 1 - \text{cell}(z)$.
- **Between a and b: the bigger cell minus the smaller cell.** $P(a \le Z \le b) = \text{cell}(b) - \text{cell}(a)$.

Here cell(z) means the table value for z. Just like two kilometre markers on a highway: the length of road between them is the bigger marker minus the smaller one.

A single exact value has probability 0, so ≤ and < give the same area. For example, $P(Z < 1.10)$ is also 0.8643.

## The notes' three examples

The notes work three questions on the standard normal, one for each move.

Left of −1.96, a thin left tail. The shaded sliver past −1.96 holds 2.5 % of the area.

```diagram
{"type": "curve", "title": "P(Z ≤ −1.96) is the left tail, 0.0250", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.96, "label": "0.0250", "tone": "hl"}], "ticks": [-1.96, -1, 0, 1]}
```

$$P(Z \le -1.96) = \text{cell}(\underbrace{-1.96}_{\text{row -1.9, column .06}}) = \mathbf{0.0250}$$

Right of 2.33, a thin right tail. The table gives the big area to the left of 2.33; the tail is what remains of the whole.

```diagram
{"type": "curve", "title": "P(Z > 2.33) is the right tail, 0.0099", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 2.33, "label": "table: 0.9901", "tone": "blue"}, {"from": 2.33, "label": "0.0099", "tone": "hl"}], "ticks": [0, 2.33]}
```

So take the cell from the whole:

$$P(Z > 2.33) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.9901}_{\text{area left of 2.33}} = \mathbf{0.0099}$$

Between 0.55 and 1.10, a strip right of the centre. The shaded strip runs from 0.55 to 1.10; its area is 0.1555.

```diagram
{"type": "curve", "title": "P(0.55 ≤ Z ≤ 1.10) is the strip, 0.1555", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": 0.55, "to": 1.1, "label": "0.1555", "tone": "hl"}], "ticks": [0, 0.55, {"x": 1.1, "label": "1.10"}]}
```

The area left of 1.10 holds the strip plus everything left of 0.55, so subtract that part:

$$P(0.55 \le Z \le 1.10) = \underbrace{0.8643}_{\text{area left of 1.10}} - \underbrace{0.7088}_{\text{area left of 0.55}} = \mathbf{0.1555}$$

The strip, shaded, with both cells lit:

```widget
z-table
{ "z": 0.55, "z2": 1.10, "mode": "between", "title": "P(0.55 ≤ Z ≤ 1.10): 0.8643 − 0.7088" }
```

:::warn The table never gives a right tail directly
Reading 0.9901 as the answer to "more than 2.33" gives a probability near 1 for a rare event. Sketch first: a thin shaded tail cannot be 0.99.
:::

## The two halves mirror each other

**The bell is symmetric about 0, so the area right of z equals the area left of −z.** Just like a sheet of paper folded down the middle: each half covers the other.

The right tail past 1.5 and the left tail past −1.5 are mirror images, so they hold the same area.

```diagram
{"type": "curve", "title": "Mirror tails: each holds 0.0668", "panels": [{"title": "P(Z > 1.5)", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"from": 1.5, "label": "0.0668", "tone": "hl"}], "ticks": [0, 1.5]}, {"title": "P(Z < −1.5)", "x": [-3.6, 3.6], "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.5, "label": "0.0668", "tone": "hl"}], "ticks": [-1.5, 0]}]}
```

- $z = 1.5$, the value asked about.
- 0.9332, the cell for 1.50.
- 0.0668, the cell for −1.50.

$$P(Z > 1.5) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.9332}_{\text{area left of 1.50}} = \mathbf{0.0668} = P(Z < -1.5)$$

**Half the area lies on each side of 0, so the cell for 0.00 is 0.5000.** For example, the area between 0 and 1.30 is the cell for 1.30 minus 0.5.

## Two decimals, and the table's edge

**Round z to two decimals before the lookup, because the table has no third decimal.** For example, 1.33333 is read as row 1.3, column .03.

The table stops at −3.49 and 3.49, where the cells are 0.0002 and 0.9998. Past that edge the far tail holds less than 0.0003 of the area. For example, the area left of 3.60 is 0.9998 to four decimals.

## The same three areas in R

`pnorm` gives the area to the left, like the table. Given only a z value, it uses mean 0 and standard deviation 1.

```r
pnorm(-1.96)
1 - pnorm(2.33)
pnorm(1.10) - pnorm(0.55)
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(-1.96)` | Slots `pnorm(q, mean, sd)`: q = −1.96; mean and sd are left out, so R uses 0 and 1. The area left of −1.96. |
| `1 - pnorm(2.33)` | `-` subtracts: the whole area 1 minus the area left of 2.33 gives the right tail. |
| `pnorm(1.10) - pnorm(0.55)` | The area left of 1.10 minus the area left of 0.55: the strip between them. |

**Left to right**

- `pnorm(-1.96)`: "The standard normal area to the left (`pnorm`) of −1.96 (`-1.96`)."
- `1 - pnorm(2.33)`: "One minus (`1 -`) the area to the left (`pnorm`) of 2.33."
- `pnorm(1.10) - pnorm(0.55)`: "The area left of 1.10 (`pnorm(1.10)`) minus (`-`) the area left of 0.55 (`pnorm(0.55)`)."

**Right to left**, the order R runs it

- `pnorm(-1.96)`: "Take −1.96, then return the area to its left (`pnorm`)."
- `1 - pnorm(2.33)`: "Compute the area left of 2.33 (`pnorm`), then take it from 1 (`1 -`)."
- `pnorm(1.10) - pnorm(0.55)`: "Compute both areas (`pnorm`), then subtract the second from the first (`-`)."
:::

They give 0.0250, 0.0099 and 0.1555 to four decimals (computed), the same as the table, because each z already has two decimals. The long version is [The standard normal and the Z table](#/math3042-u5/standard-normal-z-table). The next step, a normal with any μ and σ, is [Any normal on paper](#/math3042-q8/normal-on-paper).

## Six new z values: two left tails, two right tails, two strips

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Complement: $P(\bar{A}) = 1 - P(A)$

**Not on the sheet, so know it:**

- The Z table gives the area to the left of z.
- Right of z is 1 minus the table; between is the bigger cell minus the smaller cell.
- Round z to two decimals before the lookup; ≤ and < give the same area.
:::

```quiz
[
  {"q": "Z is standard normal. Find $P(Z \\le 0.84)$. (4 decimals)", "type": "numeric", "answer": 0.7995, "tolerance": 0.0001, "explain": "A left tail is the cell itself. Row 0.8, column .04: $$P(Z \\le 0.84) = \\text{cell}(\\underbrace{0.84}_{\\text{row 0.8, column .04}}) = \\mathbf{0.7995}$$"},
  {"q": "Z is standard normal. Find $P(Z < -1.27)$. (4 decimals)", "type": "numeric", "answer": 0.1020, "tolerance": 0.0001, "explain": "< and ≤ give the same area, so this is a left tail: the cell itself. On the negative page, row −1.2, column .07: $$P(Z < -1.27) = \\text{cell}(\\underbrace{-1.27}_{\\text{row -1.2, column .07}}) = \\mathbf{0.1020}$$"},
  {"q": "Z is standard normal. Find $P(Z > 1.45)$. (4 decimals)", "type": "numeric", "answer": 0.0735, "tolerance": 0.0001, "explain": "A right tail is 1 minus the cell. Row 1.4, column .05 gives 0.9265. $$P(Z > 1.45) = \\underbrace{1}_{\\text{the whole area}} - \\underbrace{0.9265}_{\\text{area left of 1.45}} = \\mathbf{0.0735}$$"},
  {"q": "Z is standard normal. Find $P(Z > -0.62)$. (4 decimals)", "type": "numeric", "answer": 0.7324, "tolerance": 0.0001, "explain": "A right tail is 1 minus the cell, even when z is negative. Row −0.6, column .02 gives 0.2676. $$P(Z > -0.62) = \\underbrace{1}_{\\text{the whole area}} - \\underbrace{0.2676}_{\\text{area left of -0.62}} = \\mathbf{0.7324}$$ The shaded area covers more than half the bell, so an answer above 0.5 fits the sketch."},
  {"q": "Z is standard normal. Find $P(-1.15 \\le Z \\le 0.48)$. (4 decimals)", "type": "numeric", "answer": 0.5593, "tolerance": 0.0001, "explain": "Between is the bigger cell minus the smaller cell. Row 0.4, column .08 gives 0.6844; row −1.1, column .05 gives 0.1251. $$P(-1.15 \\le Z \\le 0.48) = \\underbrace{0.6844}_{\\text{area left of 0.48}} - \\underbrace{0.1251}_{\\text{area left of -1.15}} = \\mathbf{0.5593}$$"},
  {"q": "Z is standard normal. Find $P(0.25 \\le Z \\le 1.75)$. (4 decimals)", "type": "numeric", "answer": 0.3612, "tolerance": 0.0001, "explain": "Between is the bigger cell minus the smaller cell. Row 1.7, column .05 gives 0.9599; row 0.2, column .05 gives 0.5987. $$P(0.25 \\le Z \\le 1.75) = \\underbrace{0.9599}_{\\text{area left of 1.75}} - \\underbrace{0.5987}_{\\text{area left of 0.25}} = \\mathbf{0.3612}$$"}
]
```

## Remember

- The Z table gives the area to the left of z: row = z to one decimal, column = the second decimal.
- **Left: the cell. Right: 1 minus the cell. Between: bigger cell minus smaller cell.**
- Sketch and shade first; a thin tail cannot be bigger than 0.5.
- The bell is symmetric: right of z equals left of −z, and the cell for 0.00 is 0.5000.
- **Round z to two decimals before the lookup.**
- In R, `pnorm` gives the same left area; subtract from 1 for a right tail.
