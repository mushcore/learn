---
title: Encoding practice: bits to waveforms
minutes: 20
---

Turning a bit pattern into a waveform is one rule per scheme, applied bit by bit, and reading a waveform back is the same rule in reverse.

## Six schemes, six rules

| Scheme | Rule | Signal elements per bit | $r$ |
|---|---|---|---|
| Unipolar NRZ | 1 = positive voltage, 0 = zero voltage | 1 | 1 |
| Polar NRZ-L | 0 = positive level, 1 = negative level | 1 | 1 |
| Polar NRZ-I | 0 = no change, 1 = change (inversion) at the start of the bit | 1 | 1 |
| Manchester | 0 = high-to-low, 1 = low-to-high, with the transition at the middle of the bit | 2 | 1/2 |
| Differential Manchester | always a transition at the middle of the bit; at the start of the bit, inversion for 0 and no inversion for 1 | 2 | 1/2 |
| Bipolar AMI | 0 = zero voltage, 1 = alternating positive and negative voltages | 1 | 1 |

Three schemes need a starting condition. The slide figures take the level before the first bit as **positive** for NRZ-I and differential Manchester, and draw the first 1 of AMI **positive**.

Waveforms are written one symbol per signal element: `+` positive, `−` negative, `0` zero, with a space between bits.

## 01101001 in all six schemes

| Bit | 0 | 1 | 1 | 0 | 1 | 0 | 0 | 1 |
|---|---|---|---|---|---|---|---|---|
| Unipolar NRZ | 0 | + | + | 0 | + | 0 | 0 | + |
| NRZ-L | + | − | − | + | − | + | + | − |
| NRZ-I | + | − | + | + | − | − | − | + |
| Manchester | +− | −+ | −+ | +− | −+ | +− | +− | −+ |
| Differential Manchester | −+ | +− | −+ | −+ | +− | +− | +− | −+ |
| AMI | 0 | + | − | 0 | + | 0 | 0 | − |

Unipolar NRZ, NRZ-L and Manchester look only at the current bit. The other three carry something forward:

- **NRZ-I** carries the level. It starts positive, holds for the first 0, inverts on each 1 and holds on each 0. The run 0 0 near the end stays at the level the 1 before it left.
- **Differential Manchester** carries the level of the last half bit. Positive before the first bit, and the first bit is 0, so it inverts at the start: `−+`. The next bit is 1, so its first half repeats the `+` just before it: `+−`.
- **AMI** carries the sign of the last 1. The four 1s come out `+`, `−`, `+`, `−`.

## NRZ-I: 1 0 0 1 1 0 1 0

```widget
line-code
{ "bits": "10011010", "schemes": ["nrz-i"], "scheme": "nrz-i", "draw": true, "title": "NRZ-I for 1 0 0 1 1 0 1 0, level before the first bit positive" }
```

## Manchester: 1 1 0 1 0 0

```widget
line-code
{ "bits": "110100", "schemes": ["manchester"], "scheme": "manchester", "draw": true, "title": "Manchester for 1 1 0 1 0 0" }
```

## Differential Manchester: 0 1 1 0 1 0

```widget
line-code
{ "bits": "011010", "schemes": ["diff-manchester"], "scheme": "diff-manchester", "draw": true, "title": "Differential Manchester for 0 1 1 0 1 0, level before the first bit positive" }
```

## AMI: 1 0 1 1 0 0 1

```widget
line-code
{ "bits": "1011001", "schemes": ["ami"], "scheme": "ami", "draw": true, "title": "AMI for 1 0 1 1 0 0 1, first 1 positive" }
```

## NRZ-L: 1 0 0 1 1 0

```widget
line-code
{ "bits": "100110", "schemes": ["nrz-l"], "scheme": "nrz-l", "draw": true, "title": "NRZ-L for 1 0 0 1 1 0" }
```

## One pattern under every scheme

```widget
line-code
{ "bits": "01101001", "compare": true, "title": "0 1 1 0 1 0 0 1 in all six schemes" }
```

## E04, worked

The Week 4 exercise sheet has three questions; the answers in the explanations are the instructor's.

### Exercise 1

> In a digital transmission, the receiver clock is 0.2 percent faster than the sender clock. How many extra bits per second does the receiver receive if the data rate is 1 Mbps?

```quiz
[
  {
    "q": "E04 exercise 1: receiver clock 0.2 percent faster, data rate 1 Mbps. How many extra bits per second does the receiver receive?",
    "type": "numeric",
    "answer": 2000,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "Instructor's answer: data rate = 1 Mbps = 1,000,000 bps, so 1,000,000 bits are sent per second. Bits received per second $= 1000000 + 1000000 \\times 0.2\\% = 1002000$, which is 2,000 extra bps. In one step: $0.2\\% \\times 1000000 = 0.002 \\times 1000000 = 2000$. The slide example's 0.1 percent gives 1000; twice the clock error, twice the extra bits."
  }
]
```

### Exercise 2

> An analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many data elements are carried by each signal element? How many signal elements do we need? Assume c = 1 and each signal element corresponds to a signal level.

```quiz
[
  {
    "q": "E04 exercise 2: bit rate 8000 bps, baud rate 1000 baud, $c = 1$. How many data elements are carried by each signal element?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "bits per baud",
    "explain": "Instructor's answer: $S = c \\times N \\times \\frac{1}{r}$ with $c = 1$, so $r = \\frac{N}{S} = \\frac{8000}{1000} = 8$ bits per baud. The \"assume c = 1\" matters: with the slide example's $c = \\frac{1}{2}$ the same rates would give $r = \\frac{c \\times N}{S} = 4$."
  },
  {
    "q": "E04 exercise 2: each signal element corresponds to a signal level. How many signal elements (levels) does the signal need?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0.5,
    "unit": "signal elements",
    "explain": "$r = \\log_{2} L$, so $L = 2^{r} = 2^{8} = 256$. Eight bits per signal element need 256 distinct levels, one per 8-bit pattern."
  }
]
```

### Exercise 3

> The figure below shows the encoding of a bit sequence using two different line coding schemes. Indicate the category (unipolar, polar, bipolar) of the line coding schemes used in (a) and (b). Give the reasoning for your answer.

The figure's bits are 0 1 0 0 1 1 0 0 0 1 1. Signal (a) is high for every 0 and low for every 1: `+ − + + − − + + + − −`. Signal (b) sits on the time axis for every 0 and the 1s go `+`, `−`, `+`, `−`: `0 + 0 0 − + 0 0 0 − +`.

```quiz
[
  {
    "q": "E04 exercise 3 (a): `+ − + + − − + + + − −` for the bits 0 1 0 0 1 1 0 0 0 1 1. Which category is the scheme?",
    "options": ["Unipolar", "Polar", "Bipolar"],
    "answer": 1,
    "explain": "Instructor's reasoning: polar scheme since we have two voltage levels on both sides of the time axis. It is NRZ-L as slide 55 draws it, positive for 0 and negative for 1."
  },
  {
    "q": "E04 exercise 3 (b): `0 + 0 0 − + 0 0 0 − +` for the same bits. Which category is the scheme?",
    "options": ["Bipolar", "Unipolar", "Polar"],
    "answer": 0,
    "explain": "Instructor's reasoning: bipolar scheme (AMI) since we have three voltage levels on both sides of the time axis (positive, negative and zero) and the voltage level for data element (bit) 1 alternates between positive and negative."
  }
]
```

The sheet draws (a) with 0 high and 1 low, the NRZ-L convention of slide 55.

### The E04 pattern as NRZ-L and AMI

```widget
line-code
{ "bits": "01001100011", "schemes": ["nrz-l", "ami"], "compare": true, "title": "0 1 0 0 1 1 0 0 0 1 1 as E04 draws it: (a) NRZ-L, two levels either side of the axis; (b) AMI, three levels with the 1s alternating" }
```

```quiz
[
  {
    "q": "Which waveform is NRZ-L for the bits 1 0 1 1 0?",
    "options": ["`+ − + + −`", "`− + − − +`", "`− − + − −`", "`+ 0 + + 0`"],
    "answer": 1,
    "explain": "NRZ-L: positive level for 0, negative level for 1, so 1 0 1 1 0 is `− + − − +`. `+ − + + −` has the two levels swapped, `− − + − −` is NRZ-I and `+ 0 + + 0` is unipolar NRZ."
  },
  {
    "q": "An NRZ-L signal is `− + + − − +`. Which bits were sent? Type them without spaces.",
    "type": "text",
    "answer": ["100110", "1 0 0 1 1 0"],
    "explain": "Negative is 1 and positive is 0: `−` 1, `+` 0, `+` 0, `−` 1, `−` 1, `+` 0, so 100110."
  },
  {
    "q": "Which waveform is NRZ-I for the bits 1 0 1 1 0? The level before the first bit is positive.",
    "options": ["`− + − − +`", "`+ − − − +`", "`− − + − −`", "`+ + − + +`"],
    "answer": 2,
    "explain": "Start at `+`. Bit 1: invert to `−`. Bit 0: no change, `−`. Bit 1: invert to `+`. Bit 1: invert to `−`. Bit 0: no change, `−`. The result is `− − + − −`. `+ − − − +` inverts on the 0s, and `+ + − + +` starts from a negative level."
  },
  {
    "q": "An NRZ-I signal is `+ + − +`. The level before the first bit is positive. Which bits were sent? Type them without spaces.",
    "type": "text",
    "answer": ["0011", "0 0 1 1"],
    "explain": "No change is 0 and a change is 1. `+` after positive: no change, 0. `+`: no change, 0. `−`: change, 1. `+`: change, 1. The bits are 0011."
  },
  {
    "q": "Which waveform is Manchester for the bits 1 1 0 0?",
    "options": ["`− − + +`", "`+− +− −+ −+`", "`+− −+ −+ −+`", "`−+ −+ +− +−`"],
    "answer": 3,
    "explain": "Slide 57: 0 is high-to-low (`+−`) and 1 is low-to-high (`−+`), so 1 1 0 0 is `−+ −+ +− +−`. `+− +− −+ −+` uses the opposite convention, `+− −+ −+ −+` is differential Manchester and `− − + +` is NRZ-L."
  },
  {
    "q": "A Manchester signal is `−+ +− +− −+`. Which bits were sent? Type them without spaces.",
    "type": "text",
    "answer": ["1001", "1 0 0 1"],
    "explain": "Low-to-high (`−+`) is 1 and high-to-low (`+−`) is 0: 1, 0, 0, 1."
  },
  {
    "q": "Which waveform is differential Manchester for the bits 1 0 0 1? The level before the first bit is positive.",
    "options": ["`+− +− +− −+`", "`−+ +− +− −+`", "`−+ +− −+ −+`", "`−+ −+ −+ +−`"],
    "answer": 0,
    "explain": "Bit 1: no inversion at the start, so the first half repeats `+`, then the middle transition: `+−`. Bit 0: inversion at the start, `−` to `+`, then `−`: `+−`. Bit 0 again: `+−`. Bit 1: no inversion, the first half repeats `−`: `−+`. `−+ +− +− −+` is plain Manchester for the same bits."
  },
  {
    "q": "A differential Manchester signal is `−+ +− +− −+`. The level before the first bit is positive. Which bits were sent? Type them without spaces.",
    "type": "text",
    "answer": ["0101", "0 1 0 1"],
    "explain": "Compare the first half of each bit with the half just before it. `−` after positive: inversion, 0. `+` after `+`: no inversion, 1. `+` after `−`: inversion, 0. `−` after `−`: no inversion, 1. The bits are 0101."
  },
  {
    "q": "Which waveform is AMI for the bits 1 1 0 1? The first 1 is positive.",
    "options": ["`+ + 0 +`", "`− − + −`", "`+ − 0 +`", "`+ − 0 −`"],
    "answer": 2,
    "explain": "0 is a neutral zero voltage and the 1s alternate: `+`, `−`, `0`, `+`. `+ + 0 +` is unipolar NRZ, which never goes negative. `+ − 0 −` repeats the negative voltage for the third 1."
  },
  {
    "q": "An AMI signal is `0 + 0 − +`. Which bits were sent? Type them without spaces.",
    "type": "text",
    "answer": ["01011", "0 1 0 1 1"],
    "explain": "Zero voltage is 0 and any nonzero voltage is 1, whatever its sign: 0, 1, 0, 1, 1."
  },
  {
    "q": "How many signal elements does a Manchester signal use to send 8 bits?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0.1,
    "unit": "signal elements",
    "explain": "Manchester sends one data element per two signal elements ($r = 1/2$): $8 \\times 2 = 16$. NRZ-L, NRZ-I and AMI use 8."
  },
  {
    "q": "The bits 0 1 0 1 in Manchester are `+− −+ +− −+`. How many times does the voltage change level between the first signal element and the last?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.1,
    "explain": "Write the eight signal elements in a row: `+ − − + + − − +`. The level changes 4 times, once in the middle of each bit. Between bits the level happens to stay the same for this pattern."
  },
  {
    "q": "A Manchester signal ($r = 1/2$) carries data at 10 Mbps. With $c = 1/2$, what is the average signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.01,
    "unit": "Mbaud",
    "explain": "$S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 10 \\times 2 = 10$ Mbaud. Computed from the slide formula."
  },
  {
    "q": "The same 10 Mbps is sent with NRZ-L ($r = 1$). With $c = 1/2$, what is the average signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "unit": "Mbaud",
    "explain": "$S = \\frac{1}{2} \\times 10 \\times \\frac{1}{1} = 5$ Mbaud, half the Manchester figure. This is the slide's drawback of Manchester: its signal rate is higher compared with NRZ-L."
  }
]
```
