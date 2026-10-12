---
title: Digitization and the PCM encoder
minutes: 10
---

A microphone produces a smooth analog voltage; a computer stores bits. Pulse code modulation is the technique that turns the first into the second, in three fixed steps.

## Why convert analog to digital

The lecture's learning outcome: *Explain the Pulse Code Modulation (PCM) technique for analog-to-digital conversion.* Its two applications:

- *The microphone in the recorder, samples the incoming audio signal, quantizes it into digital values, and stores them as PCM-encoded data in a file.*
- *In medical imaging, ADC can be employed to digitize analog signals from various sensors and transducers, such as ultrasound probes or X-ray detectors.*

The slide-4 figure draws the round trip of a sound through a digital system:

| Stage | Signal |
|---|---|
| Microphone | analog signal |
| **ADC** (analog-to-digital converter) | digital signal |
| Digital system | digital signal |
| **DAC** (digital-to-analog converter) | analog signal |
| Speakers | sound |

Under the chain the figure shows the same information three ways: $V_{in}$ as a sine wave, the bits 01001101 as a square wave, and $V_{DAC}$ as a staircase that approximates the sine. The staircase is the clue to the whole week: digital data can only approximate an analog signal, and PCM decides how good the approximation is.

## Digitization and PCM

Slide wording: *Digitization: Converting an analog signal to digital data.*

Slide wording: *Pulse Code Modulation (PCM): The most commonly used technique for digitization.*

## The three processes of a PCM encoder, in order

*A PCM encoder has three processes:*

1. *Sampling of the analog signal*
2. *Quantizing the sampled signal*
3. *Encoding the quantized information as streams of bits*

The order is fixed because each step consumes the previous step's output. Sampling needs a continuous signal to read; quantizing needs samples to round; encoding needs rounded values to turn into code words.

## The encoder figure: what each box takes in and gives out

Slide 8 draws the encoder as three boxes in a row with two taps showing the intermediate signals.

| Box | Input | Output | Figure tap |
|---|---|---|---|
| Sampling | analog signal (a smooth curve) | **PAM signal**: vertical bars of varying height, one per sample, no grid | tap drawn under the Sampling box |
| Quantizing | PAM signal | **Quantized signal**: the same bars drawn against a horizontal grid, their heights snapped to the grid lines | tap drawn above the Quantizing box |
| Encoding | quantized signal | **digital data**: the bit stream `11…1100` | the encoder's output |

Two things to read off the figure. The PAM bars still have arbitrary heights: sampling fixes when the signal is read, not what values are allowed. The quantized bars sit exactly on grid lines: quantizing fixes the allowed values. Only the last box produces bits.

**PAM** stands for pulse amplitude modulation, and the slide says it is *another name for sampling process*. A PAM signal is therefore nothing more than the output of the first box.

## Where the next lessons go

| Step | Lesson | What is decided |
|---|---|---|
| Sampling | [Sampling methods](#/comp3721-w5/sampling-methods), [Nyquist](#/comp3721-w5/nyquist-sampling) | how often to read the signal ($T_s$, $f_s$) and how the read is done |
| Quantizing | [Quantization](#/comp3721-w5/quantization) | how many levels $L$, the zone height $\Delta$, the error |
| Encoding | [Encoding and bit rate](#/comp3721-w5/encoding-bit-rate) | bits per sample $n_b = \log_2 L$ and the bit rate |

:::quiz Three orderings that get mixed up
Sampling comes first, quantizing second, encoding last. The PAM signal is the output of sampling, not of quantizing. The quantized signal is still a set of bar heights, not bits; the bits appear only after encoding.
:::

```quiz
[
  {
    "q": "Put the three processes of a PCM encoder in order.",
    "options": ["Quantizing, sampling, encoding", "Sampling, encoding, quantizing", "Sampling, quantizing, encoding", "Encoding, quantizing, sampling"],
    "answer": 2,
    "explain": "Sampling reads the analog signal at instants, quantizing snaps each sample to one of a fixed set of values, and encoding turns each quantized value into a code word of bits. Each step needs the previous step's output, so the order cannot change."
  },
  {
    "q": "Fill in the blank: Pulse Code Modulation is the most commonly used technique for ________.",
    "type": "text",
    "answer": ["digitization", "digitisation"],
    "explain": "Slide wording: digitization is converting an analog signal to digital data, and PCM is the most commonly used technique for it."
  },
  {
    "q": "What is a PAM signal?",
    "options": ["The bit stream at the encoder's output", "The output of the sampling step: bars of varying height, one per sample", "The output of the quantizing step: bars snapped to grid lines", "The analog signal after the DAC"],
    "answer": 1,
    "explain": "PAM (pulse amplitude modulation) is the slide's other name for the sampling process, so the PAM signal is the sampled signal. Its bars still take any height; the grid appears only after quantizing."
  },
  {
    "q": "Which process of the PCM encoder produces the stream of bits?",
    "options": ["Sampling", "Quantizing", "The DAC", "Encoding"],
    "answer": 3,
    "explain": "Encoding is the only step whose output is bits. Sampling and quantizing both output pulses with heights; the DAC works in the other direction, from bits back to an analog signal."
  },
  {
    "q": "In the slide-4 chain, which block sits between the microphone's analog signal and the digital system?",
    "options": ["The ADC", "The DAC", "The speakers", "A low-pass filter"],
    "answer": 0,
    "explain": "Microphone → analog signal → ADC → digital signal → digital system → digital signal → DAC → analog signal → speakers. The ADC digitizes on the way in; the DAC reconstructs on the way out."
  },
  {
    "q": "The quantized signal in the PCM encoder figure is already a stream of bits.",
    "type": "tf",
    "answer": false,
    "explain": "The quantized signal is still a set of pulse heights, now snapped to the grid lines. Bits appear only after the Encoding box, as the figure's digital data 11…1100."
  }
]
```
