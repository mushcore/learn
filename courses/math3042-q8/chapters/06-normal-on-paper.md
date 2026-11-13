---
title: "Any normal on paper: turn x into Z, then use the table"
minutes: 12
---
<!-- facts: none; the IQ, radiation and battery examples come from the notes and the lab, not the fact bank -->
A real question gives a normal with its own mean and standard deviation: IQ scores, a radiation dose, a battery's voltage. The table only knows the standard normal, so one step comes before the lookup.

## Two steps: turn x into Z, then read the table

**To find a normal probability on paper, turn each bound x into a Z score, then use the Z table.** Just like converting a temperature from Fahrenheit to Celsius before reading a chart printed in Celsius.

The notes give the reason as a *Key Idea: If X follows a normal distribution with mean μ and standard deviation σ, then Z = (X − μ)/σ automatically follows a standard normal distribution.* The area to the left of 120 on the IQ bell is the same as the area to the left of 1.33 on the standard bell.

## The IQ bell becoming the standard bell

The picture starts as the IQ bell, centred at 100 with the area left of 120 shaded. Subtracting 100 slides the bell left until its centre sits on 0. Dividing by 15 squeezes it into the standard bell, and the shaded edge lands on 1.33. The shaded area never changes.

```widget
standardize-play
{ "preset": "IQ below 120", "title": "IQ below 120: subtract 100, divide by 15, read the table" }
```

## A tiny case: IQ below 115

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.
- $x = 115$, the score asked about.

The IQ bell is centred on 100. The shaded part is everything left of 115, one standard deviation above the mean; its area is 0.8413.

```diagram
{"type": "curve", "title": "P(X ≤ 115) is the area left of 115, 0.8413", "x": [46, 154], "xlabel": "X = IQ score", "curves": [{"dist": "normal", "mu": 100, "sigma": 15}], "shade": [{"to": 115, "label": "0.8413", "tone": "hl"}], "ticks": [70, 85, 100, 115, 130]}
```

$$Z = \dfrac{\underbrace{115}_{\text{score asked}} - \underbrace{100}_{\text{mean}}}{\underbrace{15}_{\text{standard deviation}}} = \mathbf{1.00}$$

$$P(X \le 115) = P(Z \le \underbrace{1.00}_{\text{row 1.0, column .00}}) = \mathbf{0.8413}$$

About 84 % of people score below 115.

## The recipe, each symbol named

$$P(X \le x) = P\left(Z \le \dfrac{x - \mu}{\sigma}\right)$$

- $X$, the measurement, such as one person's IQ.
- $x$, the bound in the question, such as 115.
- $\mu$ and $\sigma$, the mean and standard deviation of X.
- $Z$, the same bound counted in standard deviations, rounded to two decimals.

**Each bound gets its own Z; the move stays the one the question asks for.** Below is the cell, above is 1 minus the cell, between is a difference of two cells, exactly as in [The Z table](#/math3042-q8/z-table). For example, "IQ above 115" uses the same Z of 1.00, then 1 minus the cell.

## The notes' IQ example: below 120

The notes ask for the chance that a random person's IQ is below 120, with $X \sim N(100, 15^2)$.

- $\mu = 100$, the mean IQ.
- $\sigma = 15$, the standard deviation.
- $x = 120$, the score asked about.

On the left is the IQ bell with the area left of 120 shaded. On the right is the standard bell with the area left of 1.33 shaded. The two shaded areas are the same, 0.9082 by the table.

```diagram
{"type": "curve", "title": "Left of 120 on the IQ bell = left of 1.33 on Z", "panels": [{"title": "X ~ N(100, 15²)", "x": [46, 154], "xlabel": "X = IQ score", "curves": [{"dist": "normal", "mu": 100, "sigma": 15}], "shade": [{"to": 120, "label": "0.9082", "tone": "hl"}], "ticks": [50, 100, 120, 150]}, {"title": "Z, standard normal", "x": [-3.6, 3.6], "xlabel": "Z", "curves": [{"dist": "normal", "mu": 0, "sigma": 1}], "shade": [{"to": 1.33, "label": "0.9082", "tone": "hl"}], "ticks": [0, 1.33]}]}
```

$$Z = \dfrac{\underbrace{120}_{\text{score asked}} - \underbrace{100}_{\text{mean}}}{\underbrace{15}_{\text{standard deviation}}} = 1.33333 = \mathbf{1.33}$$

$$P(X \le 120) = P(Z \le \underbrace{1.33}_{\text{row 1.3, column .03}}) = \mathbf{0.9082}$$

The notes also solve it in R, which does both steps in one call:

```r
pnorm(120, 100, 15)
```

```text
[1] 0.9087888
```

:::info R syntax
| Code | What it does |
|---|---|
| `pnorm(120, 100, 15)` | Slots `pnorm(q, mean, sd)`: q = 120, the bound; mean = 100; sd = 15. The area to the left of 120. |
| `[1]` | In the output, the position of the first value on the line. |

**Left to right**

- "The normal area to the left (`pnorm`) of 120 (`120`) on a bell with mean 100 (`100`) and standard deviation 15 (`15`)."

**Right to left**, the order R runs it

- "Take 120, 100 and 15, then return the area left of 120 under that bell (`pnorm`)."
:::

:::tip Table 0.9082 and R 0.9088 are both right
The table used Z rounded to 1.33; R used 1.33333. On paper write the table answer; the instructor's solutions show both.
:::

## Radiation on a flight across Canada

The radiation dose X a passenger gets on a flight across Canada is normal; this is the notes' example. The unit mrem is a millirem, a small dose of radiation.

- $\mu = 4.35$ mrem, the mean dose.
- $\sigma = 0.500$ mrem, the standard deviation.
- 4.35 and 5.00 mrem, the bounds in part a; above 5.00 mrem in part b.

Part a asks for a dose between 4.35 and 5.00. The instructor writes one Z under each bound:

$$Z = \dfrac{\underbrace{4.35}_{\text{lower bound}} - \underbrace{4.35}_{\text{mean}}}{\underbrace{0.5}_{\text{standard deviation}}} = \mathbf{0} \qquad Z = \dfrac{\underbrace{5.0}_{\text{upper bound}} - \underbrace{4.35}_{\text{mean}}}{\underbrace{0.5}_{\text{standard deviation}}} = \mathbf{1.3}$$

$$P(0 \le Z \le 1.3) = \underbrace{0.9032}_{\text{area left of 1.30}} - \underbrace{0.5}_{\text{area left of 0, half the bell}} = \mathbf{0.4032}$$

The shaded strip runs from the peak at 4.35 to 5.00, on the right side of the bell:

```widget
normal-prob
{ "mu": 4.35, "sigma": 0.5, "lo": 4.35, "hi": 5.0, "title": "Radiation between 4.35 and 5.00 mrem: Z from 0 to 1.3" }
```

Part b asks for more than 5.00 mrem, the thin right tail past 5.0. The bell is centred on 4.35; the shaded tail starts at 5.0 and runs off to the right, and its area is 0.0968.

```diagram
{"type": "curve", "title": "P(X > 5.0) is the right tail, 0.0968", "x": [2.55, 6.15], "xlabel": "X = dose (mrem)", "curves": [{"dist": "normal", "mu": 4.35, "sigma": 0.5}], "shade": [{"to": 5.0, "label": "table: 0.9032", "tone": "blue"}, {"from": 5.0, "label": "0.0968", "tone": "hl"}], "ticks": [4.35, {"x": 5.0, "label": "5.0"}]}
```

Its Z is the 1.3 from part a:

$$P(X > 5.00) = P(Z > 1.3) = \underbrace{1}_{\text{the whole area}} - \underbrace{0.9032}_{\text{area left of 1.30}} = \mathbf{0.0968}$$

## Battery voltages between 8.9 V and 9.1 V

A factory's 9-volt batteries have a voltage X that is normal. The question asks for the share between 8.9 and 9.1 volts; this is Lab 8's battery scenario.

- $\mu = 9.01$ V, the mean voltage.
- $\sigma = 0.05$ V, the standard deviation.
- 8.9 V and 9.1 V, the two bounds.

The bell is centred on 9.01, a little left of the band's middle. The shaded strip from 8.9 to 9.1 covers almost the whole bell; its area is 0.9502.

```diagram
{"type": "curve", "title": "P(8.9 < X < 9.1) is the strip, 0.9502", "x": [8.83, 9.19], "xlabel": "X = voltage (V)", "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"from": 8.9, "to": 9.1, "label": "0.9502", "tone": "hl"}], "ticks": [{"x": 8.9, "label": "8.9"}, 9.01, {"x": 9.1, "label": "9.1"}]}
```

$$Z_1 = \dfrac{\underbrace{8.9}_{\text{lower bound}} - \underbrace{9.01}_{\text{mean}}}{\underbrace{0.05}_{\text{standard deviation}}} = \mathbf{-2.2} \qquad Z_2 = \dfrac{\underbrace{9.1}_{\text{upper bound}} - \underbrace{9.01}_{\text{mean}}}{\underbrace{0.05}_{\text{standard deviation}}} = \mathbf{1.8}$$

$$P(8.9 < X < 9.1) = \underbrace{0.9641}_{\text{area left of 1.80}} - \underbrace{0.0139}_{\text{area left of -2.20}} = \mathbf{0.9502}$$

The lab's `pnorm` line prints the same 0.9502, because both Z values have at most two decimals.

## Unusual: YES or NO, with Z shown

**Answer YES when Z is below −2 or above 2, NO otherwise, and show the Z that decides it.** For example, a battery from the same line reads 9.13 V.

- $\mu = 9.01$ V, the mean voltage.
- $\sigma = 0.05$ V, the standard deviation.
- $x = 9.13$ V, the reading asked about.

The unusual zones are the two far tails, more than 2 standard deviations from 9.01: below 8.91 and above 9.11. The reading 9.13 lands in the right one.

```diagram
{"type": "curve", "title": "9.13 V lies past Z = 2: unusual", "x": [8.83, 9.19], "xlabel": "X = voltage (V)", "curves": [{"dist": "normal", "mu": 9.01, "sigma": 0.05}], "shade": [{"to": 8.91, "tone": "red"}, {"from": 9.11, "tone": "red"}], "ticks": [{"x": 8.91, "label": "8.91"}, 9.01, {"x": 9.11, "label": "9.11"}], "lines": [{"x": 9.13, "tone": "hl", "label": "9.13, Z = 2.40", "side": "right", "full": true}], "notes": [{"text": ["unusual:", "|Z| > 2"], "at": [8.86, 0.55], "to": [8.89, 0.08], "tone": "red"}]}
```

$$Z = \dfrac{\underbrace{9.13}_{\text{reading}} - \underbrace{9.01}_{\text{mean}}}{\underbrace{0.05}_{\text{standard deviation}}} = \mathbf{2.40}$$

YES, unusual, since Z = 2.40 > 2. The solutions write the reason after the answer in the same way.

## The order the solutions write it in

1. Name X in words, with its μ and σ.
2. Sketch the bell, mark μ and the bounds, and shade the area asked about.
3. Work out Z for each bound and round it to two decimals.
4. Do the table move: the cell, 1 minus the cell, or a difference of two cells.
5. Box the answer to four decimals.

```diagram
{"type": "flow", "title": "A normal question on paper", "nodes": [{"id": "x", "label": "Name X", "sub": "μ and σ"}, {"id": "s", "label": "Sketch and shade"}, {"id": "z", "label": "Z for each bound", "sub": "2 decimals"}, {"id": "t", "label": "Table move", "sub": "cell, 1 − cell, difference"}, {"id": "a", "label": "Box the answer", "sub": "4 decimals"}], "edges": [{"from": "x", "to": "s"}, {"from": "s", "to": "z"}, {"from": "z", "to": "t"}, {"from": "t", "to": "a"}], "hi": ["z"], "caption": "Radiation part a: X ~ N(4.35, 0.5²), strip from 4.35 to 5.00, Z = 0 and 1.3, 0.9032 − 0.5 = 0.4032."}
```

The long version is [Normal applications](#/math3042-u5/normal-applications). The table read backwards, for a percentile, is [From a percentage back to a value](#/math3042-q8/normal-backwards).

## A commute, lattes, bolts, resistors, a help desk and a doorway

:::exam Formula sheet lines for these questions
**On the sheet you are given:**

- Normal: $Z = \dfrac{X-\mu}{\sigma}$
- Complement: $P(\bar{A}) = 1 - P(A)$

**Not on the sheet, so know it:**

- The Z table gives the area to the left of z; round z to two decimals first.
- Right tail is 1 minus the table; between is $F(b) - F(a)$, the bigger cell minus the smaller.
- Unusual means Z below −2 or above 2.
:::

```quiz
[
  {"q": "A student's commute to BCIT takes X minutes, normal with μ = 42 and σ = 5. Find $P(X < 36)$. (4 decimals)", "type": "numeric", "answer": 0.1151, "tolerance": 0.0001, "explain": "Let X = one commute in minutes, $\\mu = 42$ the mean and $\\sigma = 5$ the standard deviation. $$Z = \\dfrac{\\underbrace{36}_{\\text{minutes asked}} - \\underbrace{42}_{\\text{mean}}}{\\underbrace{5}_{\\text{standard deviation}}} = \\mathbf{-1.20}$$ A left tail is the cell itself, row −1.2, column .00: $$P(X < 36) = P(Z < \\underbrace{-1.20}_{\\text{row -1.2, column .00}}) = \\mathbf{0.1151}$$"},
  {"q": "A coffee shop serves lattes at a temperature X that is normal with μ = 68 °C and σ = 4 °C. Find $P(X > 73)$. (4 decimals)", "type": "numeric", "answer": 0.1056, "tolerance": 0.0001, "explain": "Let X = one latte's temperature, $\\mu = 68$ °C the mean and $\\sigma = 4$ °C the standard deviation. $$Z = \\dfrac{\\underbrace{73}_{\\text{temperature asked}} - \\underbrace{68}_{\\text{mean}}}{\\underbrace{4}_{\\text{standard deviation}}} = \\mathbf{1.25}$$ A right tail is 1 minus the cell; row 1.2, column .05 gives 0.8944. $$P(X > 73) = \\underbrace{1}_{\\text{the whole area}} - \\underbrace{0.8944}_{\\text{area left of 1.25}} = \\mathbf{0.1056}$$"},
  {"q": "A factory line cuts bolts whose length X is normal with μ = 50.0 mm and σ = 0.5 mm. Find $P(49.2 < X < 50.2)$. (4 decimals)", "type": "numeric", "answer": 0.6006, "tolerance": 0.0001, "explain": "Let X = one bolt's length, $\\mu = 50.0$ mm the mean and $\\sigma = 0.5$ mm the standard deviation. One Z per bound: $$Z_1 = \\dfrac{\\underbrace{49.2}_{\\text{lower bound}} - \\underbrace{50.0}_{\\text{mean}}}{\\underbrace{0.5}_{\\text{standard deviation}}} = -1.60 \\qquad Z_2 = \\dfrac{\\underbrace{50.2}_{\\text{upper bound}} - \\underbrace{50.0}_{\\text{mean}}}{\\underbrace{0.5}_{\\text{standard deviation}}} = 0.40$$ Between is the bigger cell minus the smaller: $$P(49.2 < X < 50.2) = \\underbrace{0.6554}_{\\text{area left of 0.40}} - \\underbrace{0.0548}_{\\text{area left of -1.60}} = \\mathbf{0.6006}$$"},
  {"q": "Resistors must measure between 98 and 104 ohms to pass inspection. Their resistance X is normal with μ = 100 ohms and σ = 2.5 ohms. What share passes? (4 decimals)", "type": "numeric", "answer": 0.7333, "tolerance": 0.0001, "explain": "Let X = one resistor's resistance, $\\mu = 100$ ohms the mean and $\\sigma = 2.5$ ohms the standard deviation. The band is not centred on the mean, so each bound needs its own Z: $$Z_1 = \\dfrac{\\underbrace{98}_{\\text{lower limit}} - \\underbrace{100}_{\\text{mean}}}{\\underbrace{2.5}_{\\text{standard deviation}}} = -0.80 \\qquad Z_2 = \\dfrac{\\underbrace{104}_{\\text{upper limit}} - \\underbrace{100}_{\\text{mean}}}{\\underbrace{2.5}_{\\text{standard deviation}}} = 1.60$$ $$P(98 < X < 104) = \\underbrace{0.9452}_{\\text{area left of 1.60}} - \\underbrace{0.2119}_{\\text{area left of -0.80}} = \\mathbf{0.7333}$$"},
  {"q": "Calls to a help desk last X minutes, normal with μ = 6.5 and σ = 1.2. Is a call of 9.5 minutes statistically unusual? Type YES or NO.", "type": "text", "answer": ["YES", "Yes", "yes"], "explain": "Let X = one call's length, $\\mu = 6.5$ min the mean and $\\sigma = 1.2$ min the standard deviation. $$Z = \\dfrac{\\underbrace{9.5}_{\\text{minutes asked}} - \\underbrace{6.5}_{\\text{mean}}}{\\underbrace{1.2}_{\\text{standard deviation}}} = \\mathbf{2.50}$$ YES, unusual, since Z = 2.50 > 2."},
  {"q": "From the unit's practice problems: men's heights X are normal with μ = 69.0 in and σ = 2.8 in. A doorway is 72 in high. What share of men fit under it? (4 decimals, table method)", "type": "numeric", "answer": 0.8577, "tolerance": 0.0005, "explain": "Let X = one man's height, $\\mu = 69.0$ in the mean and $\\sigma = 2.8$ in the standard deviation. $$Z = \\dfrac{\\underbrace{72}_{\\text{door height}} - \\underbrace{69.0}_{\\text{mean}}}{\\underbrace{2.8}_{\\text{standard deviation}}} = 1.07143 = \\mathbf{1.07}$$ Fitting means shorter than the door, a left tail: $$P(X < 72) = P(Z < \\underbrace{1.07}_{\\text{row 1.0, column .07}}) = \\mathbf{0.8577}$$ R's `pnorm(72, 69, 2.8)` uses the unrounded Z and gives 0.8580 (computed); the table answer 0.8577 is the one to write on paper."}
]
```

## Remember

- **Standardize, then look up: $Z = \dfrac{x - \mu}{\sigma}$ for each bound, rounded to two decimals.**
- The move does not change: below is the cell, above is 1 minus the cell, between is a difference.
- Sketch and shade before any arithmetic, as the solutions do.
- A table answer and R's answer can differ in the fourth decimal when Z was rounded; write the table answer.
- **Unusual: Z below −2 or above 2. Answer YES or NO and show Z.**
- In R, `pnorm` with the mean and sd does both steps at once.
