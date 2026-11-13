---
title: "From a percentage back to a value: the table read backwards, then x = μ + Zσ"
minutes: 12
---
<!-- facts: none; no bank entry gives a normal percentile or a cut-off value -->
A hospital, a factory or a course often fixes a share first, such as "the top 5 %", and needs the value that cuts it off.

## The share is given, the cut-off is asked

**A backwards question gives the area and asks for the value x that cuts it off.** For example, a course gives an award to the top 10 % of final marks: the share is fixed, and the question is which mark starts the award.

**The value with a share p of the area to its left is the pth percentile.** Just like a child at the 95th percentile for height: 95 % of children the same age are shorter.

## The 95th percentile of a radiation dose, shaded

The cosmic radiation a person absorbs on a flight across Canada is normal; a mrem is a unit of radiation dose. Which dose is the 95th percentile? This is the notes' example.

- $\mu = 4.35$, the mean dose in mrem.
- $\sigma = 0.5$, the standard deviation in mrem.
- 0.95, the area to the left of the dose asked for.

```widget
normal-prob
{ "mu": 4.35, "sigma": 0.5, "lo": null, "hi": null, "p": 0.95, "title": "Radiation: the dose with 95 % of the area to its left" }
```

The picture is a bell centred on 4.35, shaded on the left 95 %, with a thin 5 % tail left on the right. The cut-off, marked $P_{95}$ in the instructor's sketch, sits where the shading stops, a little past 5.

```diagram
{"type": "curve", "title": "95 % left of the cut-off, 5 % right: the cut-off is unknown", "x": [2.55, 6.15], "xlabel": "X = dose (mrem)", "curves": [{"dist": "normal", "mu": 4.35, "sigma": 0.5}], "shade": [{"to": 5.17, "label": "area = 0.95", "tone": "hl"}, {"from": 5.17, "label": "0.05", "tone": "dim"}], "ticks": [4.35, {"x": 5.17, "label": "P95 = ?"}]}
```

## Step 1: find the area inside the table, read z off the edges

**Search the body of the table for the area, then read z from the row and the column.** For example, the cell 0.9505 sits in row 1.6 and column .05, so its z is 1.65.

```diagram
{"type": "grid", "title": "Where 0.9500 sits in the Z table", "nodes": [{"id": "h0", "label": "z", "row": 0, "col": 0}, {"id": "h1", "label": ".04", "row": 0, "col": 1}, {"id": "h2", "label": ".05", "row": 0, "col": 2}, {"id": "h3", "label": ".06", "row": 0, "col": 3}, {"id": "r1", "label": "1.5", "row": 1, "col": 0}, {"id": "a1", "label": "0.9382", "row": 1, "col": 1}, {"id": "a2", "label": "0.9394", "row": 1, "col": 2}, {"id": "a3", "label": "0.9406", "row": 1, "col": 3}, {"id": "r2", "label": "1.6", "row": 2, "col": 0}, {"id": "b1", "label": "0.9495", "row": 2, "col": 1}, {"id": "b2", "label": "0.9505", "row": 2, "col": 2}, {"id": "b3", "label": "0.9515", "row": 2, "col": 3}, {"id": "r3", "label": "1.7", "row": 3, "col": 0}, {"id": "c1", "label": "0.9591", "row": 3, "col": 1}, {"id": "c2", "label": "0.9599", "row": 3, "col": 2}, {"id": "c3", "label": "0.9608", "row": 3, "col": 3}], "hi": ["b1", "b2"], "caption": "0.9500 is not printed: 0.9495 (z = 1.64) and 0.9505 (z = 1.65) sit either side of it."}
```

0.9500 is exactly halfway between 0.9495 and 0.9505. The instructor wrote *Z = 1.64 or 1.65 = 1.645*. **When the area sits exactly halfway between two cells, take the z halfway between them; otherwise take the closer cell.** For example, 0.9000 lies between 0.8997 at z = 1.28 and 0.9015 at z = 1.29. 0.8997 is closer, so z = 1.28.

```widget
z-table
{ "p": 0.95, "mode": "inverse", "title": "Backwards: which z has 0.95 to its left?" }
```

The curve is the standard bell centred on 0, shaded up to 1.645; the table below it highlights the two cells.

## Step 2: turn z back into x

Z counts how many standard deviations x sits from the mean. Backwards, you start at the mean and take Z steps, each one standard deviation long.

$$x = \underbrace{\mu}_{\text{start at the mean}} + \underbrace{Z}_{\text{steps, from the table}} \times \underbrace{\sigma}_{\text{length of one step}}$$

It is $Z = \dfrac{x - \mu}{\sigma}$ solved for x: multiply both sides by σ, then add μ. Just like giving directions: start at the bus stop, then walk 1.645 blocks of 0.5 km each.

The two bells below carry the same 0.95 to the left. On the standard bell the cut-off is z = 1.645; on the radiation bell it is 1.645 steps of 0.5 above 4.35.

```diagram
{"type": "curve", "title": "The same 0.95: z = 1.645 becomes x = 5.17", "panels": [{"title": "Step 1: Z", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 1.645, "label": "0.95", "tone": "hl"}, {"from": 1.645, "tone": "dim"}], "ticks": [0, 1.645]}, {"title": "Step 2: X", "x": [2.55, 6.15], "xlabel": "X = dose (mrem)", "curves": [{"dist": "normal", "mu": 4.35, "sigma": 0.5}], "shade": [{"to": 5.17, "label": "0.95", "tone": "hl"}, {"from": 5.17, "tone": "dim"}], "ticks": [4.35, {"x": 5.17, "label": "5.17"}]}]}
```

$$P_{95} = \underbrace{4.35}_{\text{mean dose}} + \underbrace{1.645}_{\text{z for 0.95}} \times \underbrace{0.5}_{\text{standard deviation}} = 4.35 + 0.8225 = \mathbf{5.17 \text{ mrem}}$$

The check: a percentile above 50 must land above the mean, and 5.17 does.

:::tip x = μ + Zσ keeps the sign of Z
A negative z puts x below the mean. Drop the minus sign and the cut-off lands on the wrong side of the bell.
:::

## The top 5 % and the smallest 3 %

The table only gives areas to the left. So first turn the question's words into an area to the left.

- "The 95th percentile", "larger than 95 %", "the top 5 %": 0.95 to the left.
- "The smallest 3 %", "the bottom 3 %": 0.03 to the left.
- "Lower than 95 %": 0.05 to the left, because 95 % lie above it.

**A top share s becomes 1 − s to the left; a bottom share is already the area to the left.** For example, the top 10 % of marks is the 0.90 cell, because 1 − 0.10 = 0.90.

The top 10 % is a thin right tail. The table cannot see it directly; it sees the 0.90 to the left of the same cut-off.

```diagram
{"type": "curve", "title": "Top 10 %: look up 0.90, the area to the left", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 1.28, "label": "table: 0.90", "tone": "blue"}, {"from": 1.28, "label": "top 0.10", "tone": "hl"}], "ticks": [0, {"x": 1.28, "label": "z = ?"}]}
```

**An area to the left below 0.5 gives a negative z, and x lands below the mean.** Just like a cut-off for the lightest babies: it must be lighter than average.

Birth weights in Norway are normal with mean 3570 g and standard deviation 500 g. A hospital gives special care to the smallest 3 % of babies. Which weight separates them? This is from the unit's practice problems.

- $\mu = 3570$, the mean birth weight in grams.
- $\sigma = 500$, the standard deviation in grams.
- 0.03, the area to the left of the cut-off: the smallest 3 %.

The shaded sliver is the smallest 3 %, on the left of the bell. Its right edge is the weight asked for, so it sits below the mean of 3570.

```diagram
{"type": "curve", "title": "Smallest 3 %: area 0.03 to the left, cut-off unknown", "x": [1770, 5370], "xlabel": "X = birth weight (g)", "curves": [{"dist": "normal", "mu": 3570, "sigma": 500}], "shade": [{"to": 2630, "label": "0.03", "tone": "hl"}], "ticks": [{"x": 2630, "label": "x = ?"}, 3570]}
```

Step 1. On the negative page, 0.0301 at row −1.8, column .08 is the closest cell to 0.0300. The next cell, 0.0294, is further away. So z = −1.88.

Step 2.

$$x = \underbrace{3570}_{\text{mean weight}} + \underbrace{(-1.88)}_{\text{z for 0.03}} \times \underbrace{500}_{\text{standard deviation}} = 3570 - 940 = \mathbf{2630 \text{ g}}$$

:::warn The smallest 3 % uses 0.03, not 0.97
0.97 gives z = +1.88 and a cut-off of 4510 g, heavier than most babies: 97 % of all newborns would get special care.
:::

## The z values worth knowing

Four areas come up again and again; know their z values from memory.

```diagram
{"type": "grid", "title": "Common shares and their z values", "nodes": [{"id": "h0", "label": "Share in one tail", "row": 0, "col": 0}, {"id": "h1", "label": "Top: area left", "row": 0, "col": 1}, {"id": "h2", "label": "z", "row": 0, "col": 2}, {"id": "h3", "label": "Bottom: area left", "row": 0, "col": 3}, {"id": "h4", "label": "z", "row": 0, "col": 4}, {"id": "a0", "label": "10 %", "row": 1, "col": 0}, {"id": "a1", "label": "0.90", "row": 1, "col": 1}, {"id": "a2", "label": "1.28", "row": 1, "col": 2}, {"id": "a3", "label": "0.10", "row": 1, "col": 3}, {"id": "a4", "label": "−1.28", "row": 1, "col": 4}, {"id": "b0", "label": "5 %", "row": 2, "col": 0}, {"id": "b1", "label": "0.95", "row": 2, "col": 1}, {"id": "b2", "label": "1.645", "row": 2, "col": 2}, {"id": "b3", "label": "0.05", "row": 2, "col": 3}, {"id": "b4", "label": "−1.645", "row": 2, "col": 4}, {"id": "c0", "label": "2.5 %", "row": 3, "col": 0}, {"id": "c1", "label": "0.975", "row": 3, "col": 1}, {"id": "c2", "label": "1.96", "row": 3, "col": 2}, {"id": "c3", "label": "0.025", "row": 3, "col": 3}, {"id": "c4", "label": "−1.96", "row": 3, "col": 4}, {"id": "d0", "label": "1 %", "row": 4, "col": 0}, {"id": "d1", "label": "0.99", "row": 4, "col": 1}, {"id": "d2", "label": "2.33", "row": 4, "col": 2}, {"id": "d3", "label": "0.01", "row": 4, "col": 3}, {"id": "d4", "label": "−2.33", "row": 4, "col": 4}], "hi": ["b2", "b4"], "caption": "The bell is symmetric, so each bottom z is the top z with a minus sign."}
```

**The middle 95 % leaves 2.5 % in each tail, so its two ends are at z = −1.96 and z = 1.96.** For example, the middle 95 % of IQ scores runs from 1.96 standard deviations below the mean to 1.96 standard deviations above it.

```diagram
{"type": "curve", "title": "The middle 95 % runs from −1.96 to 1.96", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": -1.96, "label": "0.025", "tone": "dim"}, {"from": -1.96, "to": 1.96, "label": "0.95", "tone": "hl"}, {"from": 1.96, "label": "0.025", "tone": "dim"}], "ticks": [-1.96, 0, 1.96]}
```

The middle strip holds 0.95, and each thin tail holds 0.025.

## Battery voltages, by table and by R

A company's batteries have voltages that are normal with mean 9.01 V and standard deviation 0.05 V. This is Lab 8, which asked three backwards questions in R.

- $\mu = 9.01$, the mean voltage in volts.
- $\sigma = 0.05$, the standard deviation in volts.

The three questions shade three different areas to the left. Each cut-off is where the shading stops: right of 9.01 for 0.95, left of it for 0.05 and 0.25.

```diagram
{"type": "curve", "title": "Three areas to the left, three cut-offs", "panels": [{"title": "0.95 to the left", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 9.0922, "label": "0.95", "tone": "hl"}], "ticks": [9.01, {"x": 9.09, "label": "9.09"}]}, {"title": "0.05 to the left", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 8.9278, "label": "0.05", "tone": "hl"}], "ticks": [{"x": 8.93, "label": "8.93"}, 9.01]}, {"title": "0.25 to the left", "x": [8.83, 9.19], "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 8.9763, "label": "0.25", "tone": "hl"}], "ticks": [{"x": 8.98, "label": "8.98"}]}]}
```

By table, the voltage larger than 95 % of voltages has 0.95 to its left:

$$x = \underbrace{9.01}_{\text{mean voltage}} + \underbrace{1.645}_{\text{z for 0.95}} \times \underbrace{0.05}_{\text{standard deviation}} = 9.01 + 0.08225 = \mathbf{9.09 \text{ V}}$$

The voltage lower than 95 % of voltages has only 0.05 to its left:

$$x = \underbrace{9.01}_{\text{mean voltage}} + \underbrace{(-1.645)}_{\text{z for 0.05}} \times \underbrace{0.05}_{\text{standard deviation}} = 9.01 - 0.08225 = \mathbf{8.93 \text{ V}}$$

The 25th percentile has 0.25 to its left. The closest cell is 0.2514 at z = −0.67:

$$x = \underbrace{9.01}_{\text{mean voltage}} + \underbrace{(-0.67)}_{\text{z for 0.25}} \times \underbrace{0.05}_{\text{standard deviation}} = 9.01 - 0.0335 = \mathbf{8.98 \text{ V}}$$

```r
mu <- 9.01
sig <- 0.05
qnorm(0.95, mu, sig)
qnorm(0.05, mu, sig)
qnorm(0.25, mu, sig)
```

```text
[1] 9.092
[1] 8.928
[1] 8.976
```

:::info R syntax
| Code | What it does |
|---|---|
| `mu <- 9.01` | `<-` stores 9.01 under the name `mu`. |
| `sig <- 0.05` | Stores the standard deviation under the name `sig`. |
| `qnorm(0.95, mu, sig)` | Slots `qnorm(p, mean, sd)`: p = 0.95, mean = `mu`, sd = `sig`. Returns the x with 0.95 of the area to its left. |
| `qnorm(0.05, mu, sig)`, `qnorm(0.25, mu, sig)` | The same call with p = 0.05 and p = 0.25. |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- `mu <- 9.01`: "Store under the name mu (`mu <-`) the mean, 9.01."
- `sig <- 0.05`: "Store under the name sig (`sig <-`) the standard deviation, 0.05."
- the three `qnorm` lines: "The normal value with an area to its left (`qnorm`) of 0.95, then 0.05, then 0.25 (`p`), for mean mu (`mu`) and standard deviation sig (`sig`)."

**Right to left**, the order R runs it

- `mu <- 9.01`: "Take 9.01 and store it as mu (`<-`)."
- `sig <- 0.05`: "Take 0.05 and store it as sig (`<-`)."
- the three `qnorm` lines: "Look up mu and sig, then find the x with area p to its left (`qnorm`) and print it."
:::

Each R value rounds to the table answer at two decimals; R uses the exact z, such as 1.644854 for 1.645. The lab's 75th percentile printed 9.044, the 25th percentile mirrored about 9.01. The R side is drilled in [qnorm, qexp, qunif](#/math3042-q8/r-q-functions). The long version is [Normal applications](#/math3042-u5/normal-applications).

## The cut-off is fixed and the mean is asked

A machine makes a part whose length is normal with standard deviation 0.90 mm, and its mean can be set to any value. Which mean makes 90 % of the parts 12.10 mm or longer? This is from the unit's practice problems.

- $\sigma = 0.90$, the standard deviation in mm.
- $x = 12.10$, the cut-off length in mm.
- 0.10, the area to the left of 12.10, because 90 % lie above it.

This time the cut-off 12.10 is fixed and the bell's centre is the unknown. The 10 % tail left of 12.10 is shaded; the other 90 % lies above it.

```diagram
{"type": "curve", "title": "Cut-off fixed at 12.10, mean unknown", "x": [10.0, 16.5], "xlabel": "length (mm)", "curves": [{"dist": "normal", "mu": 13.25, "sigma": 0.9}], "shade": [{"to": 12.1, "label": "0.10", "tone": "hl"}, {"from": 12.1, "label": "0.90", "tone": "blue"}], "ticks": [{"x": 12.1, "label": "12.10"}, {"x": 13.25, "label": "μ = ?"}]}
```

Step 1. The closest cell to 0.1000 is 0.1003 at row −1.2, column .08, so z = −1.28.

Step 2. Put the numbers into x = μ + Zσ and leave μ as the unknown:

$$\underbrace{12.10}_{\text{cut-off}} = \mu + \underbrace{(-1.28)}_{\text{z for 0.10}} \times \underbrace{0.90}_{\text{standard deviation}}$$

Add 1.152 to both sides:

$$\mu = \underbrace{12.10}_{\text{cut-off}} + \underbrace{1.152}_{\text{1.28 times 0.90}} = \mathbf{13.25 \text{ mm}}$$

**The mean sits 1.28 standard deviations above the cut-off, so only 10 % fall below it.** Just like setting a coffee machine to pour well above the cup's line on average, so that few cups come out short.

## Award marks, battery life, coffee cups, bolts, trip times and a filling machine

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$

**Not on the sheet, so know it:**

- The Z table gives the area to the left of z; backwards, find the area in the body and read z off the row and column.
- Exactly halfway between two cells, take the z halfway between them: 0.95 gives 1.645.
- $x = \mu + Z\sigma$ for a percentile; a negative z puts x below the mean.
- A top share s is $1 - s$ to the left; a bottom share is already to the left.
- 0.90 → 1.28, 0.95 → 1.645, 0.975 → 1.96, 0.99 → 2.33, and minus each for the bottom tail.
:::

```quiz
[
  {"q": "A COMP course's final marks are normal with mean 68 and standard deviation 9. The top 10 % get an award. What is the lowest mark that earns it? (2 decimals)", "type": "numeric", "answer": 79.52, "tolerance": 0.02, "explain": "Let X = a final mark, normal with $\\mu = 68$ the mean mark and $\\sigma = 9$ the standard deviation. The top 10 % leaves 0.90 to the left. Step 1: the closest cell to 0.9000 is 0.8997 at row 1.2, column .08, so z = 1.28. Step 2: $$x = \\underbrace{68}_{\\text{mean mark}} + \\underbrace{1.28}_{\\text{z for 0.90}} \\times \\underbrace{9}_{\\text{standard deviation}} = 68 + 11.52 = \\mathbf{79.52}$$ R's `qnorm(0.90, 68, 9)` uses z = 1.281552 and gives 79.53; both are accepted."},
  {"q": "A phone's battery life is normal with mean 14.5 hours and standard deviation 1.2 hours. The shortest-lasting 1 % are replaced under warranty. Below which battery life is a phone replaced? (2 decimals)", "type": "numeric", "answer": 11.70, "tolerance": 0.02, "explain": "Let X = a battery life in hours, normal with $\\mu = 14.5$ the mean and $\\sigma = 1.2$ the standard deviation. The shortest 1 % is 0.01 to the left. Step 1: the cells near 0.0100 are 0.0099 at z = −2.33 and 0.0102 at z = −2.32; 0.0099 is closer, so z = −2.33. Step 2: $$x = \\underbrace{14.5}_{\\text{mean life}} + \\underbrace{(-2.33)}_{\\text{z for 0.01}} \\times \\underbrace{1.2}_{\\text{standard deviation}} = 14.5 - 2.796 = \\mathbf{11.70 \\text{ hours}}$$ R's `qnorm(0.01, 14.5, 1.2)` uses z = −2.326348 and gives 11.71; both are accepted."},
  {"q": "A coffee shop's large cups are filled with a volume that is normal with mean 350 mL and standard deviation 8 mL. What is the first quartile Q1, the volume with 25 % of cups below it? (2 decimals)", "type": "numeric", "answer": 344.64, "tolerance": 0.05, "explain": "Let X = the volume in one cup, normal with $\\mu = 350$ mL the mean and $\\sigma = 8$ mL the standard deviation. Q1 has 0.25 to the left. Step 1: the cells near 0.2500 are 0.2514 at z = −0.67 (0.0014 away) and 0.2483 at z = −0.68 (0.0017 away), so z = −0.67. Step 2: $$x = \\underbrace{350}_{\\text{mean volume}} + \\underbrace{(-0.67)}_{\\text{z for 0.25}} \\times \\underbrace{8}_{\\text{standard deviation}} = 350 - 5.36 = \\mathbf{344.64 \\text{ mL}}$$ R's `qnorm(0.25, 350, 8)` uses z = −0.67449 and gives 344.60; both are accepted."},
  {"q": "A factory line cuts bolts whose length is normal with mean 40.00 mm and standard deviation 0.15 mm. Between which two lengths do the middle 95 % of bolts lie?", "options": ["39.71 mm to 40.29 mm", "39.75 mm to 40.25 mm", "39.70 mm to 40.30 mm", "39.81 mm to 40.19 mm"], "answer": 0, "explain": "The middle 95 % leaves 2.5 % in each tail, so the ends have 0.025 and 0.975 to the left: z = −1.96 and z = 1.96. $$x_{\\text{low}} = \\underbrace{40.00}_{\\text{mean length}} + \\underbrace{(-1.96)}_{\\text{z for 0.025}} \\times \\underbrace{0.15}_{\\text{standard deviation}} = 40.00 - 0.294 = \\mathbf{39.71}$$ $$x_{\\text{high}} = \\underbrace{40.00}_{\\text{mean length}} + \\underbrace{1.96}_{\\text{z for 0.975}} \\times \\underbrace{0.15}_{\\text{standard deviation}} = 40.00 + 0.294 = \\mathbf{40.29}$$ 39.75 to 40.25 uses 1.645, which leaves 5 % in each tail and holds only the middle 90 %. 39.70 to 40.30 is the empirical rule's two standard deviations, which is close but not the table answer. 39.81 to 40.19 uses 1.28, the middle 80 %."},
  {"q": "A filling machine pours juice with a volume that is normal with standard deviation 6 mL; its mean can be set. To what mean must it be set so that only 5 % of bottles hold less than 240 mL? (2 decimals)", "type": "numeric", "answer": 249.87, "tolerance": 0.01, "explain": "Let X = the volume in one bottle, normal with $\\sigma = 6$ mL the standard deviation and μ unknown. Only 5 % below 240 means 0.05 to the left of 240. Step 1: 0.0500 sits exactly halfway between 0.0505 at z = −1.64 and 0.0495 at z = −1.65, so z = −1.645. Step 2: put the numbers into $x = \\mu + Z\\sigma$: $$\\underbrace{240}_{\\text{cut-off}} = \\mu + \\underbrace{(-1.645)}_{\\text{z for 0.05}} \\times \\underbrace{6}_{\\text{standard deviation}}$$ $$\\mu = \\underbrace{240}_{\\text{cut-off}} + \\underbrace{9.87}_{\\text{1.645 times 6}} = \\mathbf{249.87 \\text{ mL}}$$ R with z = −1.644854 gives 249.87 as well."},
  {"q": "A SkyTrain trip from Waterfront to King George takes a time that is normal with mean 24 minutes and standard deviation 3 minutes. Which trip time is lower than 90 % of trip times? (2 decimals)", "type": "numeric", "answer": 20.16, "tolerance": 0.01, "explain": "Let X = a trip time in minutes, normal with $\\mu = 24$ the mean and $\\sigma = 3$ the standard deviation. Lower than 90 % of trips means 90 % lie above it, so only 0.10 is to the left. Step 1: the closest cell to 0.1000 is 0.1003 at z = −1.28. Step 2: $$x = \\underbrace{24}_{\\text{mean time}} + \\underbrace{(-1.28)}_{\\text{z for 0.10}} \\times \\underbrace{3}_{\\text{standard deviation}} = 24 - 3.84 = \\mathbf{20.16 \\text{ minutes}}$$ Using 0.90 instead gives 27.84 minutes, the time that is larger than 90 % of trips. R's `qnorm(0.10, 24, 3)` gives 20.16 as well."}
]
```

## Remember

- Words to an area to the left first: top 5 % is 0.95, smallest 3 % is 0.03, "lower than 95 %" is 0.05.
- Find the area in the table's body, read z off the edges; exactly halfway gives the halfway z, 1.645.
- **$x = \mu + Z\sigma$, keeping the sign of Z.**
- 0.90 → 1.28, 0.95 → 1.645, 0.975 → 1.96, 0.99 → 2.33.
- Mean unknown: put the cut-off in for x and solve for μ.
- In R, `qnorm(p, mean, sd)` gives x in one line.

:::info R syntax
| Code | What it does |
|---|---|
| `qnorm(p, mean, sd)` | The value with area p to its left, for a normal with this mean and standard deviation. |

**Left to right**

- `qnorm(p, mean, sd)`: "The normal value (`qnorm`) with area p to its left (`p`), for this mean (`mean`) and standard deviation (`sd`)."

**Right to left**, the order R runs it

- `qnorm(p, mean, sd)`: "Take p, the mean and the standard deviation, then return the x with area p to its left (`qnorm`)."
:::
