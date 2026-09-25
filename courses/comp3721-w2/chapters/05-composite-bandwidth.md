---
title: Composite signals & bandwidth
minutes: 14
---

A single sine wave can carry energy or ring an alarm, but it cannot carry a conversation. Real data signals are *composite*: many sine waves added together, and the one number that describes the set is the **bandwidth**.

## Two ways to draw the same signal

| Plot | What it shows | Slide notes |
|---|---|---|
| **Time-domain** | changes in signal amplitude with respect to time | phase is **not** explicitly shown |
| **Frequency-domain** | the relationship between amplitude (peak value) and frequency | you can immediately see the frequency and peak amplitude; a sine wave is one spike; more compact and helpful when dealing with more than one sine wave |

*A complete sine wave in the time domain can be represented by one single spike in the frequency domain.* The spike sits at the wave's frequency and its height is the peak amplitude.

## Why one sine wave is not enough

Simple sine waves have everyday uses such as power distribution. *However, if we had only one single sine wave to convey a conversation over the phone, it would make no sense and carry no information. We would just hear a buzz.* Therefore:

- **We need to send a composite signal to communicate data.**
- **A single-frequency sine wave is not useful in data communications.**

## Composite signals and Fourier

- **Composite signal**: a signal made of many simple sine waves.
- **Fourier analysis** (Jean-Baptiste Fourier): *any composite signal is a combination of simple sine waves with different frequencies, peak amplitudes, and phases.*

## Composite periodic signals: discrete frequencies

If the composite signal is **periodic**, its decomposition gives a series of simple sine waves with **discrete frequencies** (frequencies with integer values, i.e. whole-number multiples of a base frequency).

The slide figure decomposes one composite periodic signal into three sine waves:

| Component | Frequency | Slide name |
|---|---|---|
| largest amplitude | $f$ | **fundamental frequency** or **first harmonic** |
| smaller | $3f$ | **third harmonic** |
| smallest | $9f$ | **ninth harmonic** |

```widget
composite
{ "components": "1:1 3:0.33 9:0.11", "title": "Decomposing a composite periodic signal", "presets": { "f only": "1:1", "f + 3f": "1:1 3:0.33", "f + 3f + 9f (slide figure)": "1:1 3:0.33 9:0.11", "E02 exercise 3 (Hz)": "100 400 500 750 900" } }
```

## Composite nonperiodic signals: continuous frequencies

If the composite signal is **nonperiodic**, its decomposition gives a combination of an **infinite number** of simple sine waves with **continuous frequencies** (frequencies with real values, not just whole-number multiples).

Real-life examples from the slide:

- Human voice: a continuous range of frequencies between **0 and 4 kHz**.
- The signal propagated by an AM or FM radio station.

## Bandwidth

Slide definition: *the bandwidth ($B$) is the difference between the highest and the lowest frequencies contained in a composite signal.*

$$B = f_{h} - f_{l}$$

Not the sum, not the highest frequency by itself: the **difference**. For the slide figure the bandwidth is $9f - f = 8f$.

## The middle-frequency trick

E02 gives a bandwidth and a *middle frequency* and asks for the two ends. The middle frequency is the average of the ends:

$$\text{middle} = \frac{f_{h} + f_{l}}{2}$$

Two equations:

- $f_{h} + f_{l} = 2 \times \text{middle}$
- $f_{h} - f_{l} = B$

Add them to get $2 f_{h}$, or remember that **each end is half the bandwidth away from the middle**: $f_{h} = \text{middle} + \frac{B}{2}$ and $f_{l} = \text{middle} - \frac{B}{2}$.

## E02 Exercise 1, worked

*A nonperiodic composite signal has a bandwidth of 200 kHz, with a middle frequency of 140 kHz and peak amplitude of 20 V (at the middle frequency). The two extreme frequencies have an amplitude of 0. Find the lowest and the highest frequencies and draw the frequency-domain plot.*

- $B = f_{h} - f_{l} = 200$ kHz
- middle: $\frac{f_{h} + f_{l}}{2} = 140$ kHz, so $f_{h} + f_{l} = 280$ kHz

Adding the two equations: $2 f_{h} = 480$, so $f_{h} = 240$ kHz. Then $f_{l} = 280 - 240 = 40$ kHz. Check: $240 - 40 = 200$ kHz.

The plot is a **triangle**: 0 V at 40 kHz, 20 V at 140 kHz, 0 V at 240 kHz, a filled shape rather than spikes because the signal is nonperiodic.

## E02 Exercise 2, worked

*The highest frequency in a nonperiodic composite signal is 400 MHz. If the middle frequency is 300 MHz, find the lowest frequency and the bandwidth.*

- $f_{h} = 400$ MHz
- middle: $\frac{f_{h} + f_{l}}{2} = 300$ MHz, so $f_{h} + f_{l} = 600$ MHz and $f_{l} = 600 - 400 = 200$ MHz
- $B = f_{h} - f_{l} = 400 - 200 = 200$ MHz

## E02 Exercise 3, worked

*If a periodic signal is decomposed into five sine waves with frequencies of 100, 400, 500, 750, and 900 Hz, what is its bandwidth?*

$$B = f_{h} - f_{l} = 900\ \text{Hz} - 100\ \text{Hz} = 800\ \text{Hz}$$

Only the lowest and highest frequencies matter.

## Try it

```quiz
[
  {
    "q": "A nonperiodic composite signal has a bandwidth of 100 kHz and a middle frequency of 250 kHz. What is the **lowest** frequency in kHz?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} + f_{l} = 2 \\times 250 = 500$ and $f_{h} - f_{l} = 100$. Adding: $2f_{h} = 600$, $f_{h} = 300$ kHz, so $f_{l} = 500 - 300 = 200$ kHz. Shortcut: half the bandwidth (50 kHz) below the middle."
  },
  {
    "q": "Same signal (bandwidth 100 kHz, middle 250 kHz). What is the **highest** frequency in kHz?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} = \\text{middle} + B/2 = 250 + 50 = 300$ kHz. Check: $300 - 200 = 100$ kHz."
  },
  {
    "q": "A periodic signal decomposes into sine waves at 200, 300, 600 and 1000 Hz. What is its bandwidth in Hz?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 1,
    "unit": "Hz",
    "explain": "$B = f_{h} - f_{l} = 1000 - 200 = 800$ Hz. The middle frequencies do not change the answer (same idea as E02 exercise 3: $900 - 100 = 800$ Hz)."
  },
  {
    "q": "The lowest frequency of a composite signal is 20 kHz and its bandwidth is 180 kHz. What is the highest frequency in kHz?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} = f_{l} + B = 20 + 180 = 200$ kHz."
  },
  {
    "q": "The highest frequency of a nonperiodic composite signal is 1 MHz and its middle frequency is 700 kHz. What is the lowest frequency in kHz?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} + f_{l} = 2 \\times 700 = 1400$ kHz, so $f_{l} = 1400 - 1000 = 400$ kHz. Same pattern as E02 exercise 2 ($600 - 400 = 200$ MHz)."
  },
  {
    "q": "Same signal (highest 1 MHz, middle 700 kHz). What is its bandwidth in kHz?",
    "type": "numeric",
    "answer": 600,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$B = f_{h} - f_{l} = 1000 - 400 = 600$ kHz. Or: the middle is 300 kHz below the top, so $B = 2 \\times 300 = 600$ kHz."
  },
  {
    "q": "A complete sine wave in the time domain is represented by one single spike in the frequency domain.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording exactly. The spike is at the wave's frequency, with height equal to the peak amplitude."
  },
  {
    "q": "Fill in the blank: in the decomposition of a composite periodic signal, the sine wave with frequency $f$ (the lowest) is called the ______ frequency, or first harmonic.",
    "type": "text",
    "answer": ["fundamental", "fundamental frequency"],
    "explain": "Fundamental frequency = first harmonic ($f$). The others in the slide figure are the third harmonic ($3f$) and the ninth harmonic ($9f$)."
  },
  {
    "q": "According to the slide, the human voice is a composite nonperiodic signal with a continuous range of frequencies between...",
    "options": ["0 and 4 kHz", "20 Hz and 20 kHz", "0 and 400 Hz", "4 kHz and 40 kHz"],
    "answer": 0,
    "explain": "Human voice: a continuous range of frequencies between 0 and 4 kHz. The other slide example of a nonperiodic composite signal is an AM or FM radio station."
  },
  {
    "q": "A composite periodic signal decomposes into an infinite number of sine waves with continuous frequencies.",
    "type": "tf",
    "answer": false,
    "explain": "That describes a composite **nonperiodic** signal. A composite **periodic** signal decomposes into a series of sine waves with **discrete** (integer-multiple) frequencies, like $f$, $3f$, $9f$."
  },
  {
    "q": "Fourier analysis says any composite signal is a combination of simple sine waves with different...",
    "options": ["frequencies only", "frequencies and peak amplitudes only", "frequencies, peak amplitudes, and phases", "periods and wavelengths"],
    "answer": 2,
    "explain": "Slide wording: different frequencies, peak amplitudes, and phases. All three sine-wave parameters can differ between components."
  },
  {
    "q": "Which quantities can you read directly from a frequency-domain plot? Select all that apply.",
    "options": ["Frequency of each sine wave", "Peak amplitude of each sine wave", "Phase of each sine wave", "Bandwidth (from the lowest and highest spikes)"],
    "answer": [0, 1, 3],
    "explain": "A frequency-domain plot shows peak amplitude against frequency; phase is not shown (and the time-domain plot does not show it explicitly either). Bandwidth is the distance between the lowest and highest frequencies present."
  },
  {
    "q": "A single-frequency sine wave is useful for carrying data in data communications.",
    "type": "tf",
    "answer": false,
    "explain": "Slide wording: a single-frequency sine wave is **not** useful in data communications; a conversation sent as one sine wave would be just a buzz. We need composite signals to communicate data."
  }
]
```
