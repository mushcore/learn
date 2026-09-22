---
title: E02, worked
minutes: 15
---

The Week 2 exercise sheet (E02) has five calculation questions: bandwidth from the middle frequency, bandwidth of a set of harmonics, bit rate from pages per second, and transmission time from a bit rate. Commit to an answer on paper, with units, before you open the worked answer; checking an answer you never made teaches almost nothing. (E01 and the sample quiz questions are worked in the Week 1 module.)

:::tip Follow the units
The instructor writes every Week 2 calculation as a chain of unit fractions (bits × seconds per bit, pages × bits per page) so that the units cancel to the unit the question asks for. Copy that habit: it catches most factor-of-1000 slips before they cost marks.
:::

## E02: Week 2 exercises

### Exercise 1

> A nonperiodic composite signal has a bandwidth of 200 kHz, with a middle frequency of 140 kHz and peak amplitude of 20 V (at the middle frequency). The two extreme frequencies have an amplitude of 0. Find the lowest and the highest frequencies and then draw the frequency domain plot of the signal.

```quiz
[
  {
    "q": "What is the lowest frequency $f_l$ of this signal?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_h - f_l = 200$ and $f_h + f_l = 2 \\times 140 = 280$. Subtracting: $2 f_l = 80$, so $f_l = 40$ kHz."
  },
  {
    "q": "What is the highest frequency $f_h$?",
    "type": "numeric",
    "answer": 240,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "Adding the two equations: $2 f_h = 480$, so $f_h = 240$ kHz. Check: $240 - 40 = 200$ kHz."
  }
]
```

**Instructor's answer.** Two facts, two equations:

$$B = f_h - f_l = 200\ \text{kHz}$$

$$\frac{f_h + f_l}{2} = 140\ \text{kHz} \quad \to \quad f_h + f_l = 280\ \text{kHz}$$

Add them: $2 f_h = 480$, so $f_h = 240$ kHz. Subtract them: $2 f_l = 80$, so $f_l = 40$ kHz.

The frequency-domain plot is a **triangle**: amplitude 0 at 40 kHz, rising in a straight line to the peak of 20 V at 140 kHz, then falling back to 0 at 240 kHz. Because the signal is nonperiodic, the plot is a continuous shape, not a set of separate spikes.

### Exercise 2

> The highest frequency that is contained in a nonperiodic composite signal is 400 MHz. If the middle frequency is 300 MHz, find the lowest frequency and the bandwidth of the composite signal.

```quiz
[
  {
    "q": "What is the lowest frequency $f_l$?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "MHz",
    "explain": "$f_h + f_l = 2 \\times 300 = 600$ MHz, so $f_l = 600 - 400 = 200$ MHz."
  },
  {
    "q": "What is the bandwidth $B$?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "MHz",
    "explain": "$B = f_h - f_l = 400 - 200 = 200$ MHz."
  }
]
```

**Instructor's answer.** $f_h = 400$ MHz and the middle frequency is 300 MHz:

$$\frac{f_h + f_l}{2} = 300\ \text{MHz} \quad \to \quad f_h + f_l = 600\ \text{MHz} \quad \to \quad f_l = 200\ \text{MHz}$$

$$B = f_h - f_l = 400 - 200 = 200\ \text{MHz}$$

### Exercise 3

> If a periodic signal is decomposed into five sine waves with frequencies of 100, 400, 500, 750, and 900 Hz, what is its bandwidth?

```quiz
[
  {
    "q": "What is the bandwidth of this periodic composite signal?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 1,
    "unit": "Hz",
    "explain": "Bandwidth is highest minus lowest frequency: $900 - 100 = 800$ Hz. The frequencies in between do not matter."
  }
]
```

**Instructor's answer.**

$$B = f_h - f_l = 900\ \text{Hz} - 100\ \text{Hz} = 800\ \text{Hz}$$

The three middle frequencies are irrelevant to the bandwidth; only the extremes count.

### Exercise 4

> We need to download text documents at the rate of 200 pages per second. What is the required bit rate (in Mbps) of the channel? Assume that a page has an average of 24 lines with 80 characters in each line and one character requires 8 bits.

```quiz
[
  {
    "q": "What bit rate is required, in Mbps?",
    "type": "numeric",
    "answer": 3.072,
    "tolerance": 0.005,
    "unit": "Mbps",
    "explain": "One page $= 24 \\times 80 \\times 8 = 15360$ bits. $200$ pages/s $\\times 15360$ bits/page $= 3072000$ bps $= 3.072$ Mbps."
  }
]
```

**Instructor's answer.** First the size of one page, then the rate:

$$\text{size of a page} = 24\ \frac{\text{lines}}{\text{page}} \times 80\ \frac{\text{characters}}{\text{line}} \times 8\ \frac{\text{bits}}{\text{character}} = 15360\ \text{bits}$$

$$\text{bit rate} = 200\ \frac{\text{pages}}{\text{s}} \times 15360\ \frac{\text{bits}}{\text{page}} = 3072000\ \text{bps} = 3.072\ \text{Mbps}$$

This is exactly the slide example (100 pages per second gave 1.536 Mbps) with the page rate doubled.

### Exercise 5

> A device is sending out data at the rate of 1000 bps. (a) How long does it take to send out 10 bits? (b) How long does it take to send a file of 100,000 characters? Assume each character is 8 bits.

```quiz
[
  {
    "q": "(a) How long does it take to send 10 bits?",
    "type": "numeric",
    "answer": 0.01,
    "tolerance": 0.0005,
    "unit": "s",
    "explain": "$10\\ \\text{b} \\times \\frac{1\\ \\text{s}}{1000\\ \\text{b}} = 0.01$ s, which is 10 ms."
  },
  {
    "q": "(b) How long does it take to send the 100,000-character file?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 1,
    "unit": "s",
    "explain": "$100000 \\times 8 = 800000$ bits; $800000\\ \\text{b} \\times \\frac{1\\ \\text{s}}{1000\\ \\text{b}} = 800$ s."
  }
]
```

**Instructor's answer.** Convert "10 bits" into "seconds" by multiplying by seconds per bit:

$$10\ \text{b} \times \frac{1\ \text{s}}{1000\ \text{b}} = 0.01\ \text{s}$$

Convert "a file" into "seconds" the same way, one unit fraction at a time:

$$1\ \text{file} \times \frac{100000\ \text{ch}}{\text{file}} \times \frac{8\ \text{b}}{\text{ch}} \times \frac{1\ \text{s}}{1000\ \text{b}} = 800\ \text{s}$$

:::warn Bit rate is not a period
$1000$ bps means $1/1000$ s **per bit** (the bit duration). Multiply bits by seconds per bit; do not divide the other way round. If your answer for (a) came out as 100 s, you inverted the fraction.
:::

## Not covered yet: E03

The Week 3 sheet (E03) asks about cable loss in dB per kilometre and signal-to-noise ratio (SNR, SNR in dB). Those belong to next week's transmission-impairment lecture and are not in Quiz 1 or Quiz 2 scope as posted.
