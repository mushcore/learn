---
title: Encoding, bits per sample and the bit rate
minutes: 14
---

Encoding turns each quantization code into a word of bits, and the number of bits per word times the number of samples per second is the bit rate the digitized signal needs.

## Bits per sample: n_b = log₂ L

Slide wording: *Each quantized sample can be changed to an $n_b$-bit code word. (L is the number of quantization levels/zones):*

$$n_b = \log_2 L$$

The slide's example had $L = 8$, so $n_b = 3$ and the nine codes 2, 5, 7, 7, 6, 2, 1, 2, 2 became the words 010, 101, 111, 111, 110, 010, 001, 010, 010. For $L = 256$, $n_b = 8$; for $L = 64$, $n_b = 6$. Going the other way, $L = 2^{n_b}$.

### L and the bits a code word needs

```widget
signal-levels
{ "levels": 8 }
```

### Watch one sample go through the whole encoder

The slide's nine samples pass through sampling, quantizing and encoding one at a time, and each 3-bit word joins the bitstream under the plot. Watch the red gap: it is the quantization error. Tick the predict box to name each code before it is shown.

```widget
pcm-play
{ "vmin": -20, "vmax": 20, "levels": 8, "samples": "-6.1 7.5 16.2 19.7 11.0 -5.5 -11.3 -9.4 -6.0" }
```

## Bit rate = f_s × n_b

Slide wording: *Bit rate = Sampling rate × Number of bits per sample = $f_s \times n_b$.*

Each second the encoder produces $f_s$ samples and each sample costs $n_b$ bits. The units multiply the same way: samples/s × bits/sample = bits/s.

## E05 exercise 1: the human voice at 8 bits per sample

*We know that the human voice normally includes frequencies from 0 to 4 kHz. If we want to digitize the human voice, what is the bit rate, assuming 8 bits per sample?*

Frequencies from 0 to 4 kHz describe a low-pass signal, so $f_{max} = 4$ kHz $= 4000$ Hz.

$$\text{Sampling rate} = f_{max} \times 2 = 4000 \times 2 = 8000\ \text{samples/s}$$
$$\text{Bit rate} = \text{Sampling rate} \times \text{Number of bits per sample} = 8000 \times 8 = 64000\ \text{bps} = 64\ \text{kbps}$$

Three operations, always in this order: highest frequency → sampling rate (× 2) → bit rate (× $n_b$).

## Choosing L

Slide 44: *Choosing L (the number of quantization levels) depends on:*

- *The range of the amplitudes of the analog signal.*
- *The required accuracy of recovering the signal.*

Its three cases:

| Signal | $L$ | Slide wording |
|---|---|---|
| fluctuates between two values only | 2 | *If the amplitude of a signal fluctuates between two values only, L = 2.* |
| many amplitude values, e.g. voice | more | *For a signal with many amplitude values, e.g., voice, more quantization levels are needed.* |
| audio digitizing | **256** | *In audio digitizing, L = 256.* |

And the cost of economizing: *Choosing lower values of L increases the quantization error if there is a lot of fluctuation in the signal.* Fewer zones means taller zones, and a sample can land farther from its midpoint.

## E05 exercise 3: more levels, more bits, higher bit rate

*Assume PCM is used to convert an analog signal to digital data. If we increase the number of quantization levels, what is its impact on the number of bits per sample and the bit rate? Explain.*

E05 answer: $n_b = \log_2 L$, so the number of bits per sample **increases**. Bit rate $= f_s \times n_b$, so the bit rate also **increases**. The sampling rate does not change, because it depends on $f_{max}$, not on $L$.

### From f_max and L to the bit rate

The calculator chains the three steps. The presets are E05 1 (voice), E05 2 (the 300 MHz signal of the next lesson) and a CD-quality audio case computed from its usual numbers, not from a slide.

```widget
pcm-calc
{ "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1", "presets": { "E05 1 voice": { "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" }, "E05 2": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1" }, "audio CD": { "fmax": 22.05, "unit": "kHz", "levels": 65536, "c": "1/2", "r": "1" } } }
```

## Running the formulas backwards

The exercise sheet only goes forwards, but the same two formulas invert:

| Given | Find | Step |
|---|---|---|
| bit rate and $n_b$ | $f_s$ | $f_s = \text{bit rate} / n_b$ |
| $f_s$ | $f_{max}$ | $f_{max} = f_s / 2$ |
| $n_b$ | $L$ | $L = 2^{n_b}$ |

A 64 kbps stream at 8 bits per sample was sampled at $64000 / 8 = 8000$ samples/s, which is the Nyquist rate for $f_{max} = 4$ kHz.

```quiz
[
  {
    "q": "With $L = 256$ quantization levels, how many bits per sample are needed?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$n_b = \\log_2 256 = 8$, since $2^8 = 256$. The slide gives 256 as the value of $L$ used in audio digitizing."
  },
  {
    "q": "The human voice contains frequencies from 0 to 4 kHz. Digitized with 8 bits per sample at the Nyquist rate, what bit rate results, in kbps?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "E05 exercise 1: low-pass, $f_{max} = 4000$ Hz. Sampling rate $= 2 \\times 4000 = 8000$ samples/s. Bit rate $= 8000 \\times 8 = 64000$ bps $= 64$ kbps."
  },
  {
    "q": "CD audio is sampled at 44.1 kHz with 16 bits per sample. What is the bit rate of one channel, in kbps?",
    "type": "numeric",
    "answer": 705.6,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "Bit rate $= f_s \\times n_b = 44100 \\times 16 = 705600$ bps $= 705.6$ kbps. The numbers are the usual CD values, not from a slide; the formula is the slide's."
  },
  {
    "q": "A PCM stream runs at 64 kbps with 8 bits per sample. What was the highest frequency of the analog signal, in kHz, if it was sampled at exactly the Nyquist rate?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "$f_s = \\text{bit rate} / n_b = 64000 / 8 = 8000$ samples/s. At the Nyquist rate $f_s = 2 f_{max}$, so $f_{max} = 8000 / 2 = 4000$ Hz $= 4$ kHz."
  },
  {
    "q": "If the number of quantization levels is increased, what happens to the number of bits per sample and to the bit rate?",
    "options": ["Bits per sample increase; bit rate stays the same", "Bits per sample stay the same; bit rate increases", "Bits per sample increase; bit rate increases", "Both decrease"],
    "answer": 2,
    "explain": "E05 exercise 3: $n_b = \\log_2 L$ increases with $L$, and bit rate $= f_s \\times n_b$ increases with $n_b$. The sampling rate is unchanged because it depends only on $f_{max}$."
  },
  {
    "q": "Fill in the blank: in audio digitizing, the slide says $L$ = ________.",
    "type": "text",
    "answer": ["256"],
    "explain": "$L = 256$, which is $2^8$, so audio uses 8 bits per sample. A signal that fluctuates between two values only needs $L = 2$."
  },
  {
    "q": "A signal is sampled at 8000 samples/s with $L = 128$ quantization levels. What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 56,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "$n_b = \\log_2 128 = 7$ bits. Bit rate $= 8000 \\times 7 = 56000$ bps $= 56$ kbps."
  },
  {
    "q": "Choosing a lower value of $L$ increases the quantization error if there is a lot of fluctuation in the signal.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 44. Fewer zones means each zone is taller ($\\Delta = (V_{max} - V_{min}) / L$), so a sample can be farther from its midpoint. A signal with little fluctuation can get by with few levels, down to $L = 2$ for a two-valued signal."
  },
  {
    "q": "Which two things does the choice of $L$ depend on, according to the slide?",
    "options": ["The sampling rate and the bandwidth of the channel", "The range of the amplitudes of the analog signal and the required accuracy of recovering the signal", "The carrier frequency and the SNR", "The sample period and the number of bits per sample"],
    "answer": 1,
    "explain": "Slide 44 names exactly two factors: the range of the amplitudes and the required accuracy. The sampling rate is fixed separately by the Nyquist theorem; the bits per sample follow from $L$."
  }
]
```
