---
title: Baseline wandering & DC components
minutes: 11
---

A receiver decides each bit by comparing the incoming signal with an average it keeps of what has arrived so far. A signal that stays at one voltage for too long moves that average, and it also adds frequencies near zero that some lines cannot pass.

## The baseline is a running average

*In decoding a digital signal, the receiver calculates a running average of the received signal power. This average is called the baseline.*

*The incoming signal power is evaluated against this baseline to determine the value of the data element.*

The complementary note (04a, from Peterson & Davie) describes the decision for NRZ: a signal significantly lower than the average is read as one bit value, and a signal significantly higher as the other.

## A long string of 0s or 1s makes the baseline drift

- *Baseline wandering: A drift in the baseline caused by a long string of 0s or a long string of 1s.*
- *Difficult for the receiver to decode the received signal correctly.*

The complementary note gives the mechanism: too many consecutive 1s or 0s cause the average to change, which makes a significant change in the signal harder to detect.

The slide boxes the requirement: *A good line coding scheme needs to prevent baseline wandering.*

## The same drift in an ECG

The slide's FYI shows an ECG, the electrical activity of the heart, with a wandering baseline. There the cause is something like breathing. In data communication the cause is the pattern of the information.

## The running average under a long run of 0s

NRZ-L holds one voltage for the whole bit, and Manchester changes voltage in the middle of every bit. Both schemes are defined in [Unipolar NRZ, polar NRZ-L & NRZ-I](#/comp3721-w4/unipolar-polar-nrz) and [Manchester & differential Manchester](#/comp3721-w4/manchester).

```widget
baseline-dc
{ "bits": "0100000000001011", "scheme": "nrz-l", "schemes": ["nrz-l", "manchester"] }
```

### The baseline drifting one bit at a time

Under NRZ-L each 0 of the long run pulls the average further toward the positive level. Under Manchester the two halves of every bit cancel and the average holds.

```widget
baseline-play
{ "bits": "0100000000001011", "scheme": "nrz-l", "schemes": ["nrz-l", "manchester"] }
```

## DC components are the frequencies around zero

*The very low frequencies (around zero) that are created by the spectrum as a result of a duration of fixed voltage level in a digital signal are called Direct Current (DC) Components (or constant components).*

| | Slide wording |
|---|---|
| Problem | *Causes problems for a system that cannot pass low frequencies or uses electrical coupling.* |
| Example | *A line that cannot pass frequencies below 200 Hz.* |
| Requirement | *For these systems, we need a line coding scheme with no DC component.* |

## The DC component is the mean amplitude

- *With no DC component, a signal has an average amplitude of 0.*
- *DC component (bias): The mean amplitude of the waveform.*
- *If the mean amplitude is zero, there is no DC bias (DC balanced or DC free waveform).*

Computed from that definition, not printed on a slide: the 16 bits in the widget above hold twelve 0s and four 1s. NRZ-L sends 0 as the positive level and 1 as the negative level, so at $+1$ V and $-1$ V:

$$\text{mean amplitude} = \frac{12 \times (+1) + 4 \times (-1)}{16} = +0.5\ \text{V}$$

The mean is not zero, so this signal has a DC component. A signal that spends equal time at $+1$ V and $-1$ V has a mean of 0.

## Slide example: one signal with and without a DC component

| | A composite analog signal | Same signal with added DC component |
|---|---|---|
| Lowest value | $-1.0$ | $0.0$ |
| Highest value | $1.0$ | $2.0$ |

The added DC component is 1: every point of the time-domain plot moves up by 1 and the shape stays the same. The frequency-domain plot of the shifted signal has a spike at **frequency 0**, boxed in red on the slide, next to the signal's own components.

### The shift in the time domain and the spike at frequency 0

```widget
dc-offset
{ "dc": 1 }
```

## Find the DC component of 1110111100 in three schemes

The ten bits 1 1 1 0 1 1 1 1 0 0 are sent at $+3$ V and $-3$ V (NRZ-L, Manchester) or at $+3$ V and 0 V (unipolar NRZ).

```quiz
[
  {
    "q": "What is the mean amplitude of the NRZ-L signal (slide 55: positive for 0, negative for 1), in volts?",
    "type": "numeric",
    "answer": -1.2,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "The bits hold 3 0s at $+3$ V and 7 1s at $-3$ V. Mean $= \\frac{3 \\times (+3) + 7 \\times (-3)}{10} = \\frac{9 - 21}{10} = -1.2$ V. Not zero, so the signal has a DC component."
  },
  {
    "q": "What is the mean amplitude of the unipolar NRZ signal (positive voltage for 1, zero for 0), in volts?",
    "type": "numeric",
    "answer": 2.1,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "Mean $= \\frac{7 \\times 3 + 3 \\times 0}{10} = 2.1$ V. Every level is on one side of the axis, so a unipolar mean can only be zero if every bit is 0."
  },
  {
    "q": "What is the mean amplitude of the Manchester signal, in volts?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "Each bit spends half its time at $+3$ V and half at $-3$ V, so every bit averages $\\frac{3 + (-3)}{2} = 0$ and the whole signal has mean 0 V: no DC component."
  },
  {
    "q": "In the NRZ-L signal, what is the longest stretch at one level, in bits? This is the run that pulls the baseline furthest.",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "NRZ-L levels: `- - - + - - - - + +`. The four 1s in a row (bits 5 to 8) stay at $-3$ V, a run of 4 bits with no transition."
  },
  {
    "q": "A composite analog signal swings between $-0.5$ V and $0.5$ V. After a DC component is added its lowest value is 1.5 V. What is its new highest value, in volts?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "The DC component moves every point up by the same amount: $1.5 - (-0.5) = 2$ V. The highest value becomes $0.5 + 2 = 2.5$ V; the shape is unchanged."
  }
]
```

```quiz
[
  {
    "q": "Fill in the blank: in decoding a digital signal, the receiver calculates a running average of the received signal power. This average is called the ________.",
    "type": "text",
    "answer": ["baseline", "base line", "the baseline"],
    "explain": "The baseline. The incoming signal power is evaluated against it to determine the value of the data element."
  },
  {
    "q": "What causes baseline wandering?",
    "options": ["A receiver clock that is faster than the sender clock", "A long string of 0s or a long string of 1s", "A spike of noise from power lines or lightning", "A signal with too many levels"],
    "answer": 1,
    "explain": "Baseline wandering is a drift in the baseline caused by a long string of 0s or a long string of 1s. The signal sits at one level, so the running average moves toward that level."
  },
  {
    "q": "Baseline wandering is a drift in the baseline caused by frequent changes between 0s and 1s.",
    "type": "tf",
    "answer": false,
    "explain": "The cause is the opposite: a **long string** of 0s or a long string of 1s. Frequent changes keep the running average in place."
  },
  {
    "q": "What is the incoming signal power evaluated against to determine the value of the data element?",
    "options": ["The sender's clock", "The peak amplitude of the signal", "The DC component", "The baseline"],
    "answer": 3,
    "explain": "The receiver compares the incoming signal power with the baseline, its running average of the received signal power."
  },
  {
    "q": "The slide's ECG baseline wanders because of something like breathing. What makes the baseline wander in data communication?",
    "options": ["The pattern of the information", "The length of the cable", "Thermal noise in the wire", "The number of connecting devices"],
    "answer": 0,
    "explain": "In data communication it is because of the pattern of the information: a long string of 0s or a long string of 1s."
  },
  {
    "q": "Fill in the blank: DC stands for ________ Current.",
    "type": "text",
    "answer": ["direct"],
    "explain": "Direct Current (DC) components, also called constant components."
  },
  {
    "q": "Which description matches DC components?",
    "options": ["The very high frequencies created by the sharp edges of a digital signal", "The frequencies above the bandwidth of the channel", "The very low frequencies (around zero) created by a duration of fixed voltage level", "The running average kept by the receiver"],
    "answer": 2,
    "explain": "DC components are the very low frequencies (around zero) created as a result of a duration of fixed voltage level in a digital signal. The running average is the baseline."
  },
  {
    "q": "Select the two kinds of system for which DC components cause problems.",
    "options": ["A system that uses fiber optic cable", "A system that cannot pass low frequencies", "A system that sends one bit per signal element", "A system that uses electrical coupling"],
    "answer": [1, 3],
    "explain": "Slide wording: causes problems for a system that cannot pass low frequencies or uses electrical coupling. For these systems we need a line coding scheme with no DC component."
  },
  {
    "q": "The slide's example of a system that needs a scheme with no DC component is a line that cannot pass frequencies below how many hertz?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "Hz",
    "explain": "A line that cannot pass frequencies below 200 Hz. The DC components sit around zero, below that limit."
  },
  {
    "q": "A waveform whose mean amplitude is zero is called DC balanced or DC free.",
    "type": "tf",
    "answer": true,
    "explain": "The DC component (bias) is the mean amplitude of the waveform. If the mean amplitude is zero, there is no DC bias: a DC balanced or DC free waveform."
  },
  {
    "q": "A signal uses $+2$ V for one bit value and $-2$ V for the other. Over 10 bits it is at $+2$ V for 7 bits and at $-2$ V for 3 bits. What is its mean amplitude, in volts?",
    "type": "numeric",
    "answer": 0.8,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$\\frac{7 \\times 2 + 3 \\times (-2)}{10} = \\frac{14 - 6}{10} = 0.8$ V. The mean amplitude is the DC component, so this stretch of signal is not DC free."
  },
  {
    "q": "A composite analog signal swings between $-1.5$ V and $1.5$ V. A DC component of 1.5 V is added. What is the highest value of the new signal, in volts?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "Every point moves up by 1.5 V: the signal now swings between 0 V and 3 V. The slide's example does the same with 1: from $-1.0$ to $1.0$ becomes $0.0$ to $2.0$."
  },
  {
    "q": "A DC component is added to a composite analog signal. How does its frequency-domain plot change?",
    "options": ["Every spike moves to a higher frequency", "The spikes all become shorter", "The bandwidth doubles", "A spike appears at frequency 0"],
    "answer": 3,
    "explain": "The slide's frequency-domain plot of the shifted signal has a spike at frequency 0, boxed in red. The signal's own components stay where they were."
  }
]
```
