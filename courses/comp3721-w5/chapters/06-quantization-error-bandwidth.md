---
title: Quantization error, nonuniform quantization and PCM bandwidth
minutes: 18
---

Quantization leaves an error in every sample, and the bits that carry the samples need a channel wider than the analog signal had. Both costs are set by one number, the bits per sample $n_b$.

## The error is bounded by half a zone

Slide 45, boxed: $$-\frac{\Delta}{2} \le \text{quantization error} \le \frac{\Delta}{2}$$

A sample is replaced by the midpoint of its zone, and the farthest a sample can be from the midpoint is half the zone's height. In the slide's table the largest normalized error was −0.44, within the ±0.50 bound.

## Quantization error is noise, and it lowers the capacity

The slide calls the error *noise*: *The quantization error changes the SNR of the signal → the upper limit capacity (bit rate) is decreased (according to Shannon Capacity).* The Week 3 formula $C = B \log_2(1 + \text{SNR})$ has SNR inside the logarithm, so more noise, from any source, means a smaller $C$.

*The contribution of the quantization error to the SNR$_{dB}$ of the signal depends on the number of quantization levels L, or the bits per sample $n_b$.* Boxed:

$$\text{SNR}_{dB} = 6.02\, n_b + 1.76\ \text{dB}$$

The slide prints no values; these are computed from its formula:

| $n_b$ | $L$ | SNR$_{dB}$ |
|---|---|---|
| 3 | 8 | 19.82 dB |
| 8 | 256 | 49.92 dB |
| 12 | 4096 | 74.00 dB |
| 16 | 65536 | 98.08 dB |

Each extra bit per sample adds about 6 dB, which is a factor of 4 in the SNR ratio.

### What the quantization SNR allows through Shannon

The presets convert the SNR$_{dB}$ of each $n_b$ to a ratio ($10^{\text{SNR}_{dB}/10}$) on a 4 kHz voice channel. More bits per sample means a higher SNR and a higher Shannon capacity; the formula links the quantizer's $n_b$ to the channel's limit.

```widget
data-rate
{ "bandwidth": 4, "unit": "kHz", "levels": 256, "snr": 98175, "presets": { "n_b = 3 (SNR 19.82 dB)": { "bandwidth": 4, "unit": "kHz", "levels": 8, "snr": 95.9 }, "n_b = 8 (SNR 49.92 dB)": { "bandwidth": 4, "unit": "kHz", "levels": 256, "snr": 98175 }, "n_b = 16 (SNR 98.08 dB)": { "bandwidth": 4, "unit": "kHz", "levels": 65536, "snr": 6427000000 } } }
```

## Uniform quantization is only optimal for a uniform signal

Slide 46, *Issues with uniform quantization*:

- *Only optimal for uniformly distributed signal.*
- *Often the distribution of the instantaneous amplitudes in the analog signal is not uniform.*
- *Applications such as speech and music (real audio signals) are more concentrated near zeros (lower amplitudes).*

Uniform quantization is what the previous lesson did: every zone the same height $\Delta$. If most samples cluster near zero, most of the zones at the top and bottom of the range sit unused while the crowded middle gets only a few.

## Nonuniform quantization: Δ is not fixed

Slide wording: *In nonuniform quantization, height of Δ is not fixed; it is greater near the lower amplitudes and less near the higher amplitudes.*

:::warn Ask in class about the direction
The slide says $\Delta$ is greater near the lower amplitudes. The textbook, from memory and unverified, describes the opposite: smaller zones where the signal is concentrated, which for audio is near zero. The slide's sentence is the course's wording; the instructor can confirm which direction is intended.
:::

## PCM bandwidth: the channel must be n_b times wider

Slide 47: *Given the bandwidth of a low-pass analog signal, we want to find the new minimum bandwidth of the channel that can pass the digitized version of this signal.*

Slide 48 derives it from the Week 4 formula for the bandwidth of a digital signal, $B_{min} = c \times N \times \frac{1}{r}$, by substituting the PCM bit rate $N = n_b \times f_s$ and the Nyquist rate $f_s = 2 f_{max}$:

$$B_{min} = c \times N \times \frac{1}{r} = c \times (n_b \times f_s) \times \frac{1}{r} = c \times n_b \times 2 f_{max} \times \frac{1}{r}$$

For a low-pass signal $f_{max} = B_{analog}$:

$$B_{min} = c \times n_b \times 2 \times B_{analog} \times \frac{1}{r}$$

*If c = 1/2 (average case) and r = 1 (NRZ or bipolar line coding):*

$$B_{min} = n_b \times B_{analog}$$

The $\frac{1}{2}$ from $c$ cancels the 2 from Nyquist, and $r = 1$ leaves $n_b$ alone. Boxed: *The minimum bandwidth of the digital signal is $n_b$ times greater than the bandwidth of the analog signal. This is the price we pay for digitization.*

| Line code | $r$ | $c$ | $B_{min}$ |
|---|---|---|---|
| NRZ, bipolar (the slide's case) | 1 | $\frac{1}{2}$ | $n_b \times B_{analog}$ |
| Manchester (computed, not on the slide) | $\frac{1}{2}$ | $\frac{1}{2}$ | $2\, n_b \times B_{analog}$ |

E05 exercise 2 (64 levels, a 300 MHz signal, $r = 1$) applies this formula; it is worked in [E05 worked](#/comp3721-w5/e05-worked).

### The general formula collapsing to n_b × B_analog

With $c = \frac{1}{2}$ and $r = 1$ the general $B_{min}$ row reads $n_b \times B_{analog}$; $r = \frac{1}{2}$ doubles it.

```widget
pcm-calc
{ "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1", "presets": { "E05 2": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1" }, "E05 2 with Manchester (r = 1/2)": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1/2" }, "Voice, 8 bits": { "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" } } }
```

## PCM needs more bandwidth than the analog signal

Slide 49: *PCM is a technique for analog-to-digital conversion. PCM includes sampling, quantizing and encoding. PCM requires more bandwidth than the bandwidth of the input analog signal.*

```quiz
[
  {
    "q": "A PCM system uses 8 bits per sample. What SNR$_{dB}$ does the quantization allow, using the slide formula?",
    "type": "numeric",
    "answer": 49.92,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 6.02 n_b + 1.76 = 6.02 \\times 8 + 1.76 = 48.16 + 1.76 = 49.92$ dB."
  },
  {
    "q": "A low-pass analog signal has a bandwidth of 4 kHz and is digitized with 8 bits per sample using NRZ line coding ($c = \\frac{1}{2}$, $r = 1$). What is the minimum bandwidth of the digital signal, in kHz?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.1,
    "unit": "kHz",
    "explain": "$B_{min} = n_b \\times B_{analog} = 8 \\times 4 = 32$ kHz, eight times the analog bandwidth: the price we pay for digitization."
  },
  {
    "q": "E05 exercise 2: $L = 64$ levels and an analog bandwidth of 300 MHz, with $r = 1$. What is the minimum required bandwidth of the digital signal, in GHz?",
    "type": "numeric",
    "answer": 1.8,
    "tolerance": 0.01,
    "unit": "GHz",
    "explain": "$n_b = \\log_2 64 = 6$. $B_{min} = 6 \\times 300$ MHz $= 1800$ MHz $= 1.8$ GHz."
  },
  {
    "q": "The same digitized signal is sent with Manchester line coding ($r = \\frac{1}{2}$) instead of NRZ, with $c = \\frac{1}{2}$. What is $B_{min}$ in terms of $n_b$ and $B_{analog}$?",
    "options": ["$\\frac{1}{2} n_b \\times B_{analog}$", "$n_b \\times B_{analog}$", "$4 n_b \\times B_{analog}$", "$2 n_b \\times B_{analog}$"],
    "answer": 3,
    "explain": "$B_{min} = c \\times n_b \\times 2 \\times B_{analog} \\times \\frac{1}{r} = \\frac{1}{2} \\times n_b \\times 2 \\times B_{analog} \\times 2 = 2 n_b B_{analog}$. Two signal elements per bit double the bandwidth, as in Week 4."
  },
  {
    "q": "The quantization error of a sample can be larger than $\\Delta / 2$ if the signal fluctuates a lot.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 45: $-\\Delta/2 \\le$ quantization error $\\le \\Delta/2$, always, because the quantized value is the midpoint of the sample's zone. Fluctuation affects how many samples land far from a midpoint, not the bound."
  },
  {
    "q": "According to the slide, what does the quantization error do to the upper limit on the bit rate given by the Shannon capacity?",
    "options": ["Nothing, Shannon capacity depends only on bandwidth", "It increases it, because the signal now has more levels", "It decreases it, because the error changes the SNR of the signal", "It doubles it, because of the Nyquist rate"],
    "answer": 2,
    "explain": "The quantization error is noise. It changes the SNR, and SNR is inside $C = B \\log_2(1 + \\text{SNR})$, so the capacity is decreased."
  },
  {
    "q": "Fill in the blank: the minimum bandwidth of the digital signal is $n_b$ times greater than the bandwidth of the analog signal. This is the ________ we pay for digitization.",
    "type": "text",
    "answer": ["price"],
    "explain": "Slide 48's box. With $c = \\frac{1}{2}$ and $r = 1$, $B_{min} = n_b \\times B_{analog}$."
  },
  {
    "q": "Why is uniform quantization not ideal for speech and music?",
    "options": ["Their amplitudes are concentrated near zero, not uniformly distributed", "Their highest frequency is too high to sample", "They need $L = 2$", "Their amplitudes are uniformly distributed, which uniform quantization cannot handle"],
    "answer": 0,
    "explain": "Uniform quantization is only optimal for a uniformly distributed signal. Real audio signals are more concentrated near zeros (lower amplitudes), so nonuniform quantization, where the height of $\\Delta$ is not fixed, suits them better."
  },
  {
    "q": "A PCM system uses 12 bits per sample. What SNR$_{dB}$ does the slide formula give?",
    "type": "numeric",
    "answer": 74,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$6.02 \\times 12 + 1.76 = 72.24 + 1.76 = 74.00$ dB. Each extra bit per sample adds about 6 dB."
  },
  {
    "q": "In nonuniform quantization, according to the slide, the height of $\\Delta$ is fixed.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 46: in nonuniform quantization the height of $\\Delta$ is not fixed; the slide says it is greater near the lower amplitudes and less near the higher amplitudes (the direction to confirm in class). A fixed $\\Delta$ is uniform quantization."
  },
  {
    "q": "Which of these is the slide-48 condition under which $B_{min} = n_b \\times B_{analog}$?",
    "options": ["$c = 1$ and $r = 2$", "$c = \\frac{1}{2}$ (average case) and $r = 1$ (NRZ or bipolar line coding)", "$c = \\frac{1}{2}$ and $r = \\frac{1}{2}$ (Manchester)", "Any $c$ and $r$, since they cancel"],
    "answer": 1,
    "explain": "The $\\frac{1}{2}$ from the average case cancels the 2 from the Nyquist rate, and $r = 1$ leaves $n_b \\times B_{analog}$. Other line codes change the factor: Manchester's $r = \\frac{1}{2}$ doubles it."
  }
]
```
