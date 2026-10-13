---
title: Composite signals & bandwidth
minutes: 14
---

A single sine wave can carry energy or ring an alarm, but it cannot carry a conversation. Real data signals are composite: many sine waves added together, and the one number that describes the set is the **bandwidth**.

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

### Each harmonic added widens the bandwidth

Each step adds the next component to the sum. The bandwidth is set only by the lowest and highest frequencies present, so it grows only when a new highest frequency arrives. A single sine wave has zero bandwidth.

```widget
harmonic-build-play
{}
```

## The middle-frequency trick

E02 gives a bandwidth and a *middle frequency* and asks for the two ends. The middle frequency is the average of the ends:

$$\text{middle} = \frac{f_{h} + f_{l}}{2}$$

Two equations:

- $f_{h} + f_{l} = 2 \times \text{middle}$
- $f_{h} - f_{l} = B$

Add them to get $2 f_{h}$, or remember that **each end is half the bandwidth away from the middle**: $f_{h} = \text{middle} + \frac{B}{2}$ and $f_{l} = \text{middle} - \frac{B}{2}$.

E02 exercises 1 to 3 apply this trick and the bandwidth rule; they are worked once, in [E02, worked](#/comp3721-w2/e02-worked).

## Find the bandwidth and the ends of four more signals

Bandwidth is highest minus lowest; each end sits half the bandwidth from the middle.

```quiz
[
  {
    "q": "A periodic signal decomposes into sine waves at 50, 150, 250 and 350 Hz. What is its bandwidth in Hz?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 0.5,
    "unit": "Hz",
    "explain": "$B = f_{h} - f_{l} = 350 - 50 = 300$ Hz. The 150 and 250 Hz components sit inside the band and do not change it."
  },
  {
    "q": "A nonperiodic composite signal has a bandwidth of 80 kHz and a middle frequency of 130 kHz. What is the **lowest** frequency in kHz?",
    "type": "numeric",
    "answer": 90,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} + f_{l} = 2 \\times 130 = 260$ and $f_{h} - f_{l} = 80$. Subtract: $2 f_{l} = 180$, so $f_{l} = 90$ kHz. Shortcut: $130 - 80/2 = 90$ kHz."
  },
  {
    "q": "Same signal (bandwidth 80 kHz, middle 130 kHz). What is the **highest** frequency in kHz?",
    "type": "numeric",
    "answer": 170,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} = \\text{middle} + B/2 = 130 + 40 = 170$ kHz. Check: $170 - 90 = 80$ kHz."
  },
  {
    "q": "A composite signal's lowest frequency is 2 MHz and its middle frequency is 5 MHz. What is its bandwidth in MHz?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0.01,
    "unit": "MHz",
    "explain": "$f_{h} = 2 \\times 5 - 2 = 8$ MHz (from $f_{h} + f_{l} = 2 \\times \\text{middle}$). $B = 8 - 2 = 6$ MHz."
  },
  {
    "q": "A periodic signal has a fundamental frequency of 2 kHz and contains only its first, third and fifth harmonics. What is its bandwidth in kHz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "The harmonics are $f = 2$ kHz, $3f = 6$ kHz and $5f = 10$ kHz. $B = 10 - 2 = 8$ kHz, which is $5f - f = 4f$."
  }
]
```

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
    "explain": "$B = f_{h} - f_{l} = 1000 - 200 = 800$ Hz. The frequencies in between do not change the answer."
  },
  {
    "q": "The highest frequency of a nonperiodic composite signal is 1 MHz and its middle frequency is 700 kHz. What is the lowest frequency in kHz?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$f_{h} + f_{l} = 2 \\times 700 = 1400$ kHz, so $f_{l} = 1400 - 1000 = 400$ kHz. The bandwidth is then $1000 - 400 = 600$ kHz."
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
    "options": ["Phase of each sine wave", "Frequency of each sine wave", "Peak amplitude of each sine wave", "Bandwidth (from the lowest and highest spikes)"],
    "answer": [1, 2, 3],
    "explain": "A frequency-domain plot shows peak amplitude against frequency; phase is not shown (and the time-domain plot does not show it explicitly either). Bandwidth is the distance between the lowest and highest frequencies present."
  }
]
```
