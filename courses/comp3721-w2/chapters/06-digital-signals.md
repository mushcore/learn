---
title: Digital signals: bit rate, bit length, levels
minutes: 14
---

Analog signals were described by frequency, period, phase and wavelength. Digital signals need a different vocabulary: what matters is how many bits go by each second.

## Why frequency does not describe a digital signal

Slide wording: *most digital signals are nonperiodic*, so **frequency and period are not suitable characteristics**. A stream of bits has no cycle to time; the bit rate is used instead.

## Bit rate, bit duration, bit length

- **Bit rate**: the number of bits sent per second, expressed in bits per second (**bps**).
- **Bit duration**: the time one bit occupies, $\dfrac{1}{\text{bit rate}}$. Example from the slide: $\dfrac{1}{1\ \text{Mbps}} = 1$ μs.
- **Bit length**: a similar concept to wavelength. It is *the distance one bit occupies on the transmission medium*:

$$\text{bit length} = \text{propagation speed} \times \text{bit duration}$$

### Slide example: bit length

*What is the bit length of a signal that has a bit rate of 1 Mbps and is travelling at $2 \times 10^{8}$ m/s on a transmission medium?*

- Bit duration $= \dfrac{1}{1\ \text{Mbps}} = \dfrac{1}{10^{6}}$ s $= 1$ μs
- Bit length $= (2 \times 10^{8}\ \text{m/s}) \times (1 \times 10^{-6}\ \text{s}) = 200$ m

*This means a bit occupies 200 metres on this transmission medium.*

## Levels

Slide definition: *"level" refers to a specific state or value that a digital signal can have at a given point in time.* Levels are typically voltage or current levels in a circuit.

- In **binary** digital systems there are usually **two** levels: a "low" level (0) and a "high" level (1).
- More advanced systems can have more levels, such as **octal (eight levels)** or **hexadecimal (sixteen levels)**.

The two slide figures show the same second of time drawn with two and then four levels:

| Figure | Levels | Signal elements in 1 s | Bits per element | Bits sent in 1 s | Bit rate |
|---|---|---|---|---|---|
| a | 2 | 8 | 1 | 8 (1 0 1 1 0 0 0 1) | 8 bps |
| b | 4 | 8 | 2 | 16 (11 10 01 01 00 00 00 10) | 16 bps |

With four levels each element carries two bits, so the bit rate doubles.

```widget
signal-levels
{ "levels": 4, "title": "More levels, more bits per signal element" }
```

## How many bits does a level need?

Slide: *to encode 4 levels, $\log_{2} 4 = 2$ bits are required.*

### Slide example: 11 levels

*A digital signal has 11 levels. How many bits are needed?*

- $\log_{2} 11 = 3.46$ bits
- *However, this answer is not realistic.* The number of bits needed has to be an **integer** and usually a **power of 2**. **4 bits** should be used in this case.

The general rule uses the ceiling function:

$$\text{bits} = ⌈\log_{2} L⌉$$

- **Ceiling** ⌈ ⌉: rounds the number **up** to the nearest integer greater than or equal to it. Slide example: ⌈3.1416⌉ = 4.
- **Floor** ⌊ ⌋: rounds the number **down** to the nearest integer less than or equal to it. Slide example: ⌊3.1416⌋ = 3.

:::tip Calculator (beyond the slides)
Most calculators have no log base 2 key. Use $\log_{2} L = \dfrac{\log L}{\log 2}$ with the base-10 log key: $\dfrac{\log 11}{\log 2} = \dfrac{1.0414}{0.3010} = 3.46$, then take the ceiling.
:::

Worked table:

| Levels $L$ | $\log_{2} L$ | Bits needed ⌈$\log_{2} L$⌉ |
|---|---|---|
| 2 | 1 | 1 |
| 4 | 2 | 2 |
| 8 | 3 | 3 |
| 11 | 3.46 | 4 |
| 16 | 4 | 4 |
| 32 | 5 | 5 |
| 100 | 6.64 | 7 |

3 bits can only name 8 levels, so 11 levels need 4: round **up**, never down.

## Slide example: bit rate of a channel

*Assume we need to download text documents at the rate of 100 pages per second. A page is an average of 24 lines with 80 characters in each line. If one character requires 8 bits, the bit rate is:*

$$100 \times 24 \times 80 \times 8 = 1\,536\,000\ \text{bps} = 1.536\ \text{Mbps}$$

Multiply the units through: pages/s × lines/page × characters/line × bits/character leaves bits/s.

## E02 Exercise 4, worked

*We need to download text documents at the rate of 200 pages per second. What is the required bit rate (in Mbps)? Assume a page has an average of 24 lines with 80 characters in each line and one character requires 8 bits.*

- Size of a page $= 24\ \dfrac{\text{lines}}{\text{page}} \times 80\ \dfrac{\text{characters}}{\text{line}} \times 8\ \dfrac{\text{bits}}{\text{character}} = 15\,360$ bits
- Bit rate $= 200\ \dfrac{\text{pages}}{\text{s}} \times 15\,360\ \dfrac{\text{bits}}{\text{page}} = 3\,072\,000$ bps $= 3.072$ Mbps

## E02 Exercise 5, worked

*A device is sending out data at the rate of 1000 bps. (a) How long does it take to send out 10 bits? (b) How long does it take to send a file of 100 000 characters? Assume each character is 8 bits.*

The answer sheet does both by unit cancellation: convert the thing you have into seconds using $\dfrac{1\ \text{s}}{1000\ \text{b}}$.

**(a)** $10\ \text{b} \times \dfrac{1\ \text{s}}{1000\ \text{b}} = 0.01$ s, which is 10 ms.

**(b)** $1\ \text{file} \times 100\,000\ \dfrac{\text{ch}}{\text{file}} \times 8\ \dfrac{\text{b}}{\text{ch}} \times \dfrac{1\ \text{s}}{1000\ \text{b}} = 800$ s

Both parts are time $= \dfrac{\text{number of bits}}{\text{bit rate}}$; the trap is forgetting to turn characters into bits first.

## A digital signal is a composite analog signal

Slide wording: *a periodic or nonperiodic digital signal is a composite analog signal with frequencies between zero and infinity (infinite bandwidth).* Fourier analysis can be used to decompose a digital signal, just like any composite signal.

The slide's picture is a square wave jumping between $-1$ and $+1$ with its first harmonic drawn over it on $-\pi$ to $\pi$. Adding higher harmonics makes the sum squarer; exact vertical edges need infinitely many, hence infinite bandwidth.

In the frequency domain:

| Digital signal | Bandwidth | Frequencies |
|---|---|---|
| **periodic** (rare in data communications) | infinite | **discrete** |
| **nonperiodic** (the usual case) | infinite | **continuous** |

```quiz
[
  {
    "q": "A signal has a bit rate of 10 Mbps and travels at $2 \\times 10^{8}$ m/s. What is its bit length in metres?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.1,
    "unit": "m",
    "explain": "Bit duration $= 1/(10 \\times 10^{6}) = 10^{-7}$ s $= 0.1$ μs. Bit length $= 2 \\times 10^{8} \\times 10^{-7} = 20$ m. Ten times the slide's bit rate gives one tenth of its 200 m."
  },
  {
    "q": "A signal has a bit rate of 100 kbps and travels at $2 \\times 10^{8}$ m/s. What is its bit length in metres?",
    "type": "numeric",
    "answer": 2000,
    "tolerance": 10,
    "unit": "m",
    "explain": "Bit duration $= 1/(100 \\times 10^{3}) = 10^{-5}$ s $= 10$ μs. Bit length $= 2 \\times 10^{8} \\times 10^{-5} = 2000$ m. A slower bit rate means each bit is longer on the wire."
  },
  {
    "q": "A digital signal has 8 levels. How many bits are needed per level?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "$\\log_{2} 8 = 3$ exactly, so 3 bits (octal: eight levels)."
  },
  {
    "q": "A digital signal has 20 levels. How many bits are needed per level?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "$\\log_{2} 20 = 4.32$ bits, not realistic; the number of bits has to be an integer, so round **up**: ⌈4.32⌉ = 5 bits. (With 4 bits you can only name 16 levels.)"
  },
  {
    "q": "A digital signal has 64 levels. How many bits are needed per level?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "$2^{6} = 64$, so $\\log_{2} 64 = 6$ bits exactly."
  },
  {
    "q": "Slide example, halved: text documents are downloaded at 50 pages per second, 24 lines per page, 80 characters per line, 8 bits per character. What bit rate is required, in bps?",
    "type": "numeric",
    "answer": 768000,
    "tolerance": 100,
    "unit": "bps",
    "explain": "$50 \\times 24 \\times 80 \\times 8 = 768\\,000$ bps $= 768$ kbps $= 0.768$ Mbps. (The slide's 100 pages/s gives 1.536 Mbps; E02's 200 pages/s gives 3.072 Mbps.)"
  },
  {
    "q": "A device sends at 2000 bps. How many seconds does it take to send 500 characters of 8 bits each?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0.01,
    "unit": "s",
    "explain": "$500 \\times 8 = 4000$ bits; $4000\\ \\text{b} \\times \\frac{1\\ \\text{s}}{2000\\ \\text{b}} = 2$ s."
  },
  {
    "q": "E02 exercise 5(a): a device sends at 1000 bps. How long does it take to send 10 bits, in seconds?",
    "type": "numeric",
    "answer": 0.01,
    "tolerance": 0.0001,
    "unit": "s",
    "explain": "$10\\ \\text{b} \\times \\frac{1\\ \\text{s}}{1000\\ \\text{b}} = 0.01$ s $= 10$ ms."
  },
  {
    "q": "Most digital signals are periodic, so their frequency and period are the natural way to describe them.",
    "type": "tf",
    "answer": false,
    "explain": "Most digital signals are **nonperiodic**, so frequency and period are not suitable characteristics. Bit rate (bits per second) is used instead."
  },
  {
    "q": "Fill in the blank: bit duration = 1 / ______.",
    "type": "text",
    "answer": ["bit rate", "bitrate", "the bit rate", "bit rate (bps)"],
    "explain": "Bit duration $= 1/(\\text{bit rate})$, e.g. $1/(1\\ \\text{Mbps}) = 1$ μs. Bit length = propagation speed × bit duration."
  },
  {
    "q": "A digital signal, periodic or nonperiodic, is a composite analog signal with infinite bandwidth.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording: a periodic or nonperiodic digital signal is a composite analog signal with frequencies between zero and infinity, i.e. infinite bandwidth."
  },
  {
    "q": "In the frequency domain, a **periodic** digital signal has...",
    "options": ["finite bandwidth and discrete frequencies", "infinite bandwidth and discrete frequencies", "infinite bandwidth and continuous frequencies", "finite bandwidth and continuous frequencies"],
    "answer": 1,
    "explain": "Periodic digital: infinite bandwidth, discrete frequencies (rare in data communications). Nonperiodic digital: infinite bandwidth, continuous frequencies."
  },
  {
    "q": "Which statements about the slide's two-level and four-level figures are correct? Select all that apply.",
    "options": ["Both send 8 signal elements in 1 s", "The two-level signal sends 8 bits in 1 s (8 bps)", "The four-level signal sends 16 bits in 1 s (16 bps)", "The four-level signal needs 4 bits per level"],
    "answer": [0, 1, 2],
    "explain": "Same 8 elements per second in both; with two levels each element is 1 bit (8 bps), with four levels each element is $\\log_{2} 4 = 2$ bits (16 bps), not 4."
  },
  {
    "q": "Fill in the blank: a system with sixteen signal levels is described on the slide as ______.",
    "type": "text",
    "answer": ["hexadecimal", "hex"],
    "explain": "Octal = eight levels, hexadecimal = sixteen levels (needing $\\log_{2} 16 = 4$ bits per level)."
  }
]
```
