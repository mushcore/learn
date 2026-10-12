---
title: Quantization: zones, midpoints, codes, error
minutes: 20
---

A sample can be any voltage at all, but a code word can name only $L$ values. Quantization decides which of the $L$ values each sample becomes, and the difference is the error the signal carries for ever after.

## Quantization maps an infinite set of amplitudes to L values

Slide wording: *Quantization: The set of amplitudes (can be infinite with nonintegral values) is mapped to a set of discrete values.*

Slide wording: *Quantization is an approximation process.*

## The four steps

1. *Assume that the original analog signal has instantaneous amplitudes between $V_{min}$ and $V_{max}$.*
2. *Divide the range into $L$ zones (L also called the number of quantization levels), each of height $\Delta$ (delta):* $$\Delta = \frac{V_{max} - V_{min}}{L}$$
3. *Assign quantized values of 0 to $L - 1$ to the midpoint of each zone.*
4. *Approximate the value of the sample amplitude to the quantized values.*

The quantized values are the codes $0 \ldots L - 1$; each code stands for the midpoint of its zone. Approximating a sample means replacing it by the midpoint of the zone it falls in.

## The slide example: L = 8, −20 V to +20 V, Δ = 5 V

The slide's signal lies between −20 V and +20 V with $L = 8$:

$$\Delta = \frac{20 - (-20)}{8} = \frac{40}{8} = 5\ \text{V}$$

The figure labels its vertical axis in units of $D = \Delta$, from $-4D$ to $4D$, with eight bands and the quantization codes 7 at the top down to 0 at the bottom. Zone $k$ runs from $(k - 4)D$ to $(k - 3)D$ and its midpoint is $(k - 3.5)D$:

| Code | Zone, in units of $\Delta$ | Zone, in volts | Midpoint (normalized) | Midpoint, in volts |
|---|---|---|---|---|
| 7 | $3D$ to $4D$ | 15 to 20 | 3.50 | 17.5 |
| 6 | $2D$ to $3D$ | 10 to 15 | 2.50 | 12.5 |
| 5 | $D$ to $2D$ | 5 to 10 | 1.50 | 7.5 |
| 4 | 0 to $D$ | 0 to 5 | 0.50 | 2.5 |
| 3 | $-D$ to 0 | −5 to 0 | −0.50 | −2.5 |
| 2 | $-2D$ to $-D$ | −10 to −5 | −1.50 | −7.5 |
| 1 | $-3D$ to $-2D$ | −15 to −10 | −2.50 | −12.5 |
| 0 | $-4D$ to $-3D$ | −20 to −15 | −3.50 | −17.5 |

## One sample through the recipe: −6.1 V

The slide walks the first of its nine samples.

1. Normalize: *Normalized PAM values = Actual amplitude/Δ. E.g., −6.1/5 = −1.22.*
2. Find the zone: −1.22 lies between $-2D$ and $-D$, so *−1.22 belongs to zone 2*.
3. Quantize: *Normalized quantized value = Midpoint of this zone = −1.50.*
4. Error: *Normalized error is the difference between normalized quantized value and normalized PAM value*, so $-1.50 - (-1.22) = -0.28$.
5. Code: zone 2 gives quantization code 2.
6. Encode: with $L = 8$ each code needs $\log_2 8 = 3$ bits, so 2 becomes 010. The slide labels this row *Encoding (Last step of PCM)*.

### Code the nine samples before the table reveals them

The slide's nine samples at $L = 8$ between −20 V and +20 V. For each one, divide by 5, find the zone, type its code, then Check.

```widget
quantizer
{ "vmin": -20, "vmax": 20, "levels": 8, "samples": "-6.1 7.5 16.2 19.7 11.0 -5.5 -11.3 -9.4 -6.0", "draw": true, "title": "Type the quantization code for each of the slide's samples" }
```

## The slide's full table

| | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Actual amplitude (V) | −6.1 | 7.5 | 16.2 | 19.7 | 11.0 | −5.5 | −11.3 | −9.4 | −6.0 |
| Normalized PAM value (÷ 5) | −1.22 | 1.50 | 3.24 | 3.94 | 2.20 | −1.10 | −2.26 | −1.88 | −1.20 |
| Zone | 2 | 5 | 7 | 7 | 6 | 2 | 1 | 2 | 2 |
| Normalized quantized value (midpoint) | −1.50 | 1.50 | 3.50 | 3.50 | 2.50 | −1.50 | −2.50 | −1.50 | −1.50 |
| Normalized error (quantized − PAM) | −0.28 | 0 | +0.26 | −0.44 | +0.30 | −0.40 | −0.24 | +0.38 | −0.30 |
| Quantization code | 2 | 5 | 7 | 7 | 6 | 2 | 1 | 2 | 2 |
| Encoded word | 010 | 101 | 111 | 111 | 110 | 010 | 001 | 010 | 010 |

Check two rows against the recipe. Sample 4: $19.7 / 5 = 3.94$, in zone 7 ($3D$ to $4D$), midpoint 3.50, error $3.50 - 3.94 = -0.44$, code 7, word 111. Sample 7: $-11.3 / 5 = -2.26$, in zone 1 ($-3D$ to $-2D$), midpoint −2.50, error $-2.50 - (-2.26) = -0.24$, code 1, word 001.

## Sample 2 lands exactly on a midpoint

$7.5 / 5 = 1.50$ lies in zone 5 ($D$ to $2D$), and 1.50 is the midpoint of that zone. The quantized value equals the sample, so the error is 0: code 5, word 101. It is the only sample in the table with no error.

No sample in the slide's table falls exactly on a line between two zones (a normalized value such as 1.00 or 2.00), and the slide states no rule for one.

## Reading the error column

The error is quantized minus PAM. A sample below its midpoint has a positive error (3.24 is below 3.50, error +0.26); a sample above it has a negative error. The largest magnitude in the table is 0.44, and none can exceed 0.50 because no point of a zone is more than half a zone from its midpoint. In volts that is $0.44 \times 5 = 2.2$ V out of a 5 V zone; the bound is $\pm\Delta/2$, taken up in the [next lesson but one](#/comp3721-w5/quantization-error-bandwidth).

## Zone arithmetic for any symmetric range

Not on the slides, but it reproduces every row: for a range symmetric about 0, the zone is $\lfloor \text{normalized value} \rfloor + L/2$, clamped to $0 \ldots L - 1$, and the midpoint is $\text{zone} - L/2 + 0.5$. For −1.22 that is $\lfloor -1.22 \rfloor + 4 = -2 + 4 = 2$ and $2 - 4 + 0.5 = -1.50$. For 1.50 it gives $1 + 4 = 5$ and $5 - 4 + 0.5 = 1.50$, the sample itself. The floor sends a value exactly on a zone line, such as 2.00, to the upper zone; that is the formula's choice, not a slide rule.

### Change L or the samples and watch the zones move

Set $L = 4$ and the same nine samples spread over only four zones, so the errors grow; set $L = 16$ and they shrink. Typing a sample on a zone line (10 V is 2.00) shows which zone the widget's formula gives it.

```widget
quantizer
{ "vmin": -20, "vmax": 20, "levels": 8, "samples": "-6.1 7.5 16.2 19.7 11.0 -5.5 -11.3 -9.4 -6.0", "draw": false, "title": "The slide's nine samples with editable L and range" }
```

```quiz
[
  {
    "q": "Fill in the blank: quantization is an ________ process.",
    "type": "text",
    "answer": ["approximation"],
    "explain": "Slide wording: quantization is an approximation process. Each sample is replaced by the midpoint of its zone, and the difference is the quantization error."
  },
  {
    "q": "A signal has amplitudes between −10 V and +10 V and is quantized with $L = 16$ levels. What is $\\Delta$, in volts?",
    "type": "numeric",
    "answer": 1.25,
    "tolerance": 0.005,
    "unit": "V",
    "explain": "$\\Delta = (V_{max} - V_{min}) / L = (10 - (-10)) / 16 = 20 / 16 = 1.25$ V."
  },
  {
    "q": "In the slide example ($\\Delta = 5$ V), the sample 11.0 V has normalized PAM value 2.20. Which zone is it in, and what is its 3-bit encoded word?",
    "options": ["Zone 2, word 010", "Zone 5, word 101", "Zone 6, word 110", "Zone 7, word 111"],
    "answer": 2,
    "explain": "2.20 lies between $2D$ and $3D$, which is zone 6 (zones count from 0 at $-4D$). Code 6 in 3 bits is 110. Its quantized value is the midpoint 2.50 and its error is $+0.30$."
  },
  {
    "q": "In the slide example, what is the normalized error for the sample 19.7 V (normalized PAM value 3.94)?",
    "type": "numeric",
    "answer": -0.44,
    "tolerance": 0.005,
    "explain": "3.94 is in zone 7 ($3D$ to $4D$), midpoint 3.50. Error = quantized − PAM $= 3.50 - 3.94 = -0.44$. The sign is negative because the sample sits above its midpoint."
  },
  {
    "q": "The normalized PAM value −1.22 belongs to which zone of the slide's 8-zone example?",
    "options": ["Zone 1", "Zone 3", "Zone 4", "Zone 2"],
    "answer": 3,
    "explain": "Zone 2 spans $-2D$ to $-D$, and −1.22 lies between −2 and −1. Zone 1 would need a value between −3 and −2; zone 3 spans $-D$ to 0. The quantized value is zone 2's midpoint, −1.50."
  },
  {
    "q": "What is assigned to the midpoint of each zone?",
    "options": ["The quantization error", "The quantized values 0 to $L - 1$", "The actual sample amplitudes", "The value $\\Delta/2$"],
    "answer": 1,
    "explain": "Step 3 of the slide: assign quantized values of 0 to $L - 1$ to the midpoint of each zone. A sample is then approximated by the midpoint of the zone it falls in."
  },
  {
    "q": "In the slide example, the sample 7.5 V normalizes to 1.50. What is its normalized error?",
    "options": ["−0.50", "0", "+0.50", "+0.25"],
    "answer": 1,
    "explain": "1.50 lies in zone 5 ($D$ to $2D$), and the midpoint of zone 5 is 1.50. Quantized value 1.50 minus PAM value 1.50 is 0. Code 5, word 101."
  },
  {
    "q": "With $L = 8$ quantization levels, each encoded word needs how many bits?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$\\log_2 8 = 3$ bits name the codes 0 to 7, which is why every word in the slide's table (010, 101, 111, …) has three bits."
  },
  {
    "q": "The quantization error for a sample can never be larger in magnitude than $\\Delta / 2$.",
    "type": "tf",
    "answer": true,
    "explain": "A sample is replaced by the midpoint of its zone, and no point in a zone of height $\\Delta$ is farther than $\\Delta/2$ from the midpoint. In the slide's normalized units the largest error is 0.44, below 0.50."
  },
  {
    "q": "In the slide example, what is the normalized quantized value of the sample 16.2 V?",
    "type": "numeric",
    "answer": 3.5,
    "tolerance": 0.005,
    "explain": "$16.2 / 5 = 3.24$, in zone 7 ($3D$ to $4D$), whose midpoint is 3.50. The error is $3.50 - 3.24 = +0.26$ and the code is 7 (111)."
  }
]
```
