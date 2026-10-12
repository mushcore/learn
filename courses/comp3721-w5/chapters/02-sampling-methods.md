---
title: Sampling: T_s, f_s and the three methods
minutes: 12
---

*The first step in PCM is sampling.* Two numbers describe how often the signal is read, and three circuits describe how the reading is done.

## Sampling is also called PAM

Slide wording: *Pulse Amplitude Modulation (PAM) → another name for sampling process.* The sampled signal is a train of pulses whose amplitudes follow the analog signal, which is where the name comes from.

## T_s and f_s are reciprocals

- *Sample interval or sample period ($T_s$): Analog signal is sampled every $T_s$ seconds.*
- *Sampling rate or sampling frequency ($f_s$): $f_s = 1/T_s$.*

A sampling rate is written in samples per second (the slides write samples/s, not Hz, for the answer to a sampling question). A sample period of 125 μs means 8000 samples in each second: $f_s = 1 / (125 \times 10^{-6}) = 8000$ samples/s. Going the other way, 20 000 samples/s means one sample every $1 / 20000 = 50$ μs.

### Converting between the sample period and the sampling rate

The widget converts in both directions with the unit prefixes; 8000 samples/s is the voice rate used in E05.

```widget
freq-period
{ "f": 8000, "unit": "Hz" }
```

## The signal must be bandlimited

Slide wording: *A signal with an infinite bandwidth cannot be sampled (the signal must be bandlimited).* The next lesson makes this quantitative: the sampling rate must be at least twice the highest frequency in the signal, so a signal with no highest frequency has no sampling rate that works.

## The three sampling methods

Slide 14 draws the same dashed analog curve, one cycle positive then negative, sampled three ways.

| Method | What the figure shows | Slide annotation |
|---|---|---|
| a. **Ideal sampling** | vertical stems with a dot at the curve's height, spaced $T_s$ apart ($T_s$ is marked between two stems) | *Cannot be easily implemented.* |
| b. **Natural sampling** | narrow pulses whose tops follow the curve during the pulse | *Uses a high-speed switch (A circuit that can rapidly connect and disconnect a signal path).* |
| c. **Flat-top sampling (sample-and-hold)** | rectangular pulses with flat tops at the sampled value | *Uses a circuit.* **The most commonly used method.** |

Ideal sampling reads the signal at an instant of zero width. Natural sampling closes a switch for a short time, so the pulse top is a slice of the curve. Flat-top sampling reads the value once and holds it flat until the next sample, which is what a sample-and-hold circuit does and why it is the one real converters use.

The two FYI slides give ideal sampling's other name, **impulse sampling**, and say it is impractical because a pulse width cannot be zero and an impulse train cannot be generated; they also note that in the time domain sampling is multiplication by an impulse train and in the frequency domain it is convolution by one. That is background, not quiz material.

### The three methods on the same curve

Switch between the method buttons: the sample values are the same for all three, only the pulse shape changes. The $f_s$ slider changes how many samples the cycle gets.

```widget
sampler
{ "f": 1, "fs": 8, "method": "ideal", "methods": ["ideal", "natural", "flat"], "title": "Ideal, natural and flat-top sampling of one cycle" }
```

:::quiz Which method is the common one
Flat-top (sample-and-hold) is the most commonly used method. Ideal sampling is the textbook picture and cannot be easily implemented. Natural sampling is the one with the high-speed switch.
:::

```quiz
[
  {
    "q": "Fill in the blank: the sampling method that is the most commonly used is ________ sampling, also called sample-and-hold.",
    "type": "text",
    "answer": ["flat-top", "flat top", "flattop", "flat"],
    "explain": "Flat-top sampling (sample-and-hold) uses a circuit and is the most commonly used method. Its pulses have flat tops at the sampled value because the circuit holds the value until the next sample."
  },
  {
    "q": "A signal is sampled every 125 μs. What is the sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "$f_s = 1 / T_s = 1 / (125 \\times 10^{-6}) = 8000$ samples/s. A sample period in microseconds gives a rate in the thousands per second."
  },
  {
    "q": "The sampling rate is 20 000 samples/s. What is the sample period, in μs?",
    "type": "numeric",
    "answer": 50,
    "tolerance": 0.1,
    "unit": "μs",
    "explain": "$T_s = 1 / f_s = 1 / 20000 = 0.00005$ s $= 50$ μs."
  },
  {
    "q": "Which sampling method uses a high-speed switch?",
    "options": ["Ideal sampling", "Flat-top sampling", "Natural sampling", "Impulse sampling"],
    "answer": 2,
    "explain": "Natural sampling closes a high-speed switch for a short time, so the pulse tops follow the curve during the pulse. Impulse sampling is the other name for ideal sampling."
  },
  {
    "q": "Ideal sampling is the most commonly used sampling method because its pulses have zero width.",
    "type": "tf",
    "answer": false,
    "explain": "Zero-width pulses are exactly why ideal sampling cannot be easily implemented. The most commonly used method is flat-top sampling (sample-and-hold)."
  },
  {
    "q": "A signal with an infinite bandwidth cannot be sampled.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording: the signal must be bandlimited. The sampling rate has to be at least twice the highest frequency, and a signal with infinite bandwidth has no highest frequency."
  },
  {
    "q": "In the slide-14 figure, what distinguishes natural sampling from flat-top sampling?",
    "options": ["Natural sampling's pulses are spaced more closely", "Natural sampling's pulse tops follow the curve; flat-top pulses are held at one value", "Natural sampling uses dots on stems; flat-top uses rectangles", "Natural sampling reads the signal at zero width"],
    "answer": 1,
    "explain": "Both methods use pulses of nonzero width. In natural sampling the top of each pulse is a slice of the analog curve; in flat-top sampling the value read at the start is held flat. Dots on stems are ideal sampling."
  },
  {
    "q": "What is PAM another name for?",
    "options": ["The quantizing process", "The encoding process", "The reconstruction by a DAC", "The sampling process"],
    "answer": 3,
    "explain": "Pulse amplitude modulation is the slide's other name for sampling. The PAM signal is the train of pulses whose amplitudes follow the analog signal."
  }
]
```
