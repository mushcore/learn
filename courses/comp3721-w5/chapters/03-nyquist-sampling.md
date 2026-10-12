---
title: The Nyquist theorem and the sampling rate
minutes: 15
---

Sampling throws away everything between the samples. The Nyquist theorem says how often you must sample so that nothing you need is lost.

## The theorem

Slide 21, boxed: *According to the Nyquist theorem, to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal.*

| Name | Slide formula | Unit |
|---|---|---|
| Nyquist rate | $f_N = 2 f_{max}$ | Hz (written samples/s in answers) |
| Nyquist interval | $\dfrac{1}{f_N} = \dfrac{1}{2 f_{max}}$ | s |

The Nyquist rate is the minimum sampling rate; the Nyquist interval is the longest sample period that still works. Any $f_s \ge f_N$ satisfies the theorem.

## Where f_max comes from: low-pass versus bandpass

- *Low-pass analog signal → bandwidth = highest frequency.* A low-pass signal starts at 0 Hz, so its bandwidth and its highest frequency are the same number.
- *Bandpass analog signal → bandwidth < highest frequency.* A bandpass signal starts above 0 Hz, so the bandwidth alone does not tell you $f_{max}$.

This is the whole difference between the two slide examples below.

## Slide example: a low-pass signal of bandwidth 100 kHz

*What is the minimum sampling rate for a low-pass signal that has a bandwidth of 100 kHz?*

For a low-pass signal, bandwidth = highest frequency, so $f_{max} = 100$ kHz:

$$\text{Minimum sampling rate} = 2 \times 100000 = 200000\ \text{samples per second}$$

The Nyquist interval, computed from the slide formula: $1 / 200000 = 5$ μs.

## Slide example: a bandpass signal of bandwidth 100 kHz

*What is the minimum sampling rate for a bandpass signal that has a bandwidth of 100 kHz?*

Slide answer: *We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.* The slide's follow-up: we should either try to find or measure the maximum frequency or obtain additional information about the signal to make this determination.

A bandwidth of 100 kHz could be 0 to 100 kHz or 900 to 1000 kHz, and the second needs ten times the sampling rate.

## The slide figure: sampling a sine at 2f, 4f and f

Slides 22 to 25 sample a sine wave of frequency $f$ and then join the dots with dashed lines.

| Case | Sampling rate | Samples per cycle | Reconstruction | Slide annotation |
|---|---|---|---|---|
| a. Nyquist rate sampling | $f_s = 2f$ | 2, at the peaks | a triangle wave at frequency $f$ | *A good approximation of the original sine wave.* |
| b. Oversampling | $f_s = 4f$ | 4, at the peaks and zero crossings | the same triangle wave | *Same approximation but redundant and unnecessary.* |
| c. Undersampling | $f_s = f$ | 1, at a different point of each cycle (a peak, a zero crossing, a trough) | a slow wave | *Produces a signal that does not look like the original one.* |

The theorem's "at least" is the minimum, and the figure shows why more does not help: at $4f$ the extra samples land where the triangle already passes. Below $2f$ the samples cannot tell the sine from a slower one.

### The slide's three cases on the f_s slider

Drag $f_s$ from below $f$ to $8f$ and watch the verdict band: the reconstruction changes shape only on the undersampling side.

```widget
sampler
{ "f": 1, "fs": 2, "method": "ideal", "title": "Nyquist rate, oversampling and undersampling of one sine wave" }
```

## Two Nyquist formulas in this course

| Week | Name | Formula | What it limits |
|---|---|---|---|
| 3 | Nyquist bit rate | $\text{BitRate} = 2 \times B \times \log_2 L$ | the bits per second a noiseless channel of bandwidth $B$ can carry |
| 5 | Nyquist sampling rate | $f_N = 2 \times f_{max}$ | the samples per second needed to reproduce an analog signal |

Both start with a 2, and both come from the same theorem, but they answer different questions. A question that gives a bandwidth and asks for samples per second wants this week's formula; a question that gives a bandwidth and $L$ and asks for bps wants Week 3's.

:::quiz Three traps on one slide
A bandpass signal's bandwidth does not give $f_{max}$, so its minimum sampling rate cannot be found from the bandwidth alone. Oversampling is not "better": the slide calls it redundant and unnecessary. The minimum sampling rate is a number of samples per second, not Hz of bandwidth.
:::

```quiz
[
  {
    "q": "Fill in the blank: according to the Nyquist theorem, the sampling rate must be at least ________ times the highest frequency contained in the signal.",
    "type": "text",
    "answer": ["2", "two", "twice"],
    "explain": "The Nyquist rate is $f_N = 2 f_{max}$. Sampling slower than this (undersampling) produces a signal that does not look like the original."
  },
  {
    "q": "What is the minimum sampling rate for a low-pass signal with a bandwidth of 4 kHz, in samples per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "Low-pass: bandwidth = highest frequency, so $f_{max} = 4000$ Hz and $f_N = 2 \\times 4000 = 8000$ samples/s. This is the voice rate of E05 exercise 1."
  },
  {
    "q": "A low-pass audio signal has a highest frequency of 22 kHz. What is its Nyquist rate, in samples per second?",
    "type": "numeric",
    "answer": 44000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "$f_N = 2 \\times 22000 = 44000$ samples/s."
  },
  {
    "q": "A low-pass signal has a bandwidth of 300 MHz. What is its minimum sampling rate, in millions of samples per second?",
    "type": "numeric",
    "answer": 600,
    "tolerance": 0.5,
    "unit": "M samples/s",
    "explain": "Low-pass, so $f_{max} = 300$ MHz. $f_N = 2 \\times 300 = 600$ million samples per second. This is the signal of E05 exercise 2."
  },
  {
    "q": "What is the Nyquist interval for a low-pass signal with a bandwidth of 100 kHz, in μs?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "$f_N = 2 \\times 100000 = 200000$ samples/s. Nyquist interval $= 1 / f_N = 1 / 200000 = 5 \\times 10^{-6}$ s $= 5$ μs."
  },
  {
    "q": "What is the minimum sampling rate for a bandpass signal that has a bandwidth of 100 kHz?",
    "options": ["200 000 samples/s", "100 000 samples/s", "It cannot be found, because the maximum frequency of the signal is not known", "50 000 samples/s"],
    "answer": 2,
    "explain": "For a bandpass signal, bandwidth < highest frequency, so the bandwidth does not give $f_{max}$. The slide says to find or measure the maximum frequency, or obtain additional information, before the sampling rate can be determined. 200 000 is the answer for a low-pass signal of the same bandwidth."
  },
  {
    "q": "Sampling a sine wave at four times its frequency gives a better reconstruction than sampling at twice its frequency.",
    "type": "tf",
    "answer": false,
    "explain": "The slide figure shows the same triangle-wave approximation at $f_s = 4f$ as at $f_s = 2f$, and calls oversampling redundant and unnecessary. The extra samples fall where the reconstruction already passes."
  },
  {
    "q": "In the slide figure, which sampling rate produces a signal that does not look like the original one?",
    "options": ["$f_s = 2f$", "$f_s = f$", "$f_s = 4f$", "All three look like the original"],
    "answer": 1,
    "explain": "Undersampling at $f_s = f$ takes one sample per cycle at a different point of each cycle, so joining the dots gives a slow wave unrelated to the original. $2f$ is the Nyquist rate and $4f$ is oversampling; both give the triangle approximation."
  },
  {
    "q": "For a low-pass analog signal, the bandwidth is equal to the highest frequency.",
    "type": "tf",
    "answer": true,
    "explain": "A low-pass signal starts at 0 Hz, so bandwidth = highest frequency. For a bandpass signal the bandwidth is less than the highest frequency, which is why its sampling rate cannot be found from the bandwidth alone."
  },
  {
    "q": "A noiseless channel has a bandwidth of 4 kHz. Which question is answered by $2 \\times 4000 = 8000$ **samples per second**?",
    "options": ["The maximum bit rate of the channel with two signal levels", "The minimum sampling rate for a 4 kHz low-pass analog signal", "The baud rate of an NRZ signal on the channel", "The Nyquist interval of the signal"],
    "answer": 1,
    "explain": "Samples per second is this week's Nyquist: $f_N = 2 f_{max}$. The Week 3 Nyquist bit rate $2 \\times B \\times \\log_2 L$ gives 8000 **bps** for $L = 2$, the same number with a different unit answering a different question. The Nyquist interval would be $1/8000$ s."
  }
]
```
