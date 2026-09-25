---
title: Data vs signals, analog vs digital
minutes: 10
---

Lecture 02 drops to the bottom of the TCP/IP stack. The upper four layers pass data around logically; the physical layer is where something real has to move through a wire, a fibre, or the air.

## What actually travels?

The slides open with Alice and Bob talking over a network and ask two questions:

- **What is really exchanged between Alice and Bob?** Data (information).
- **What goes through the network connecting Alice to Bob at the physical layer?** Signals (for example, electrical signals).

Data is what the two ends care about; signals are what the medium carries. The physical layer's job, in the slide's words, is *moving data in the form of electromagnetic signals across a transmission medium*, so **data must be changed to signals for transmission**.

:::quiz Logical vs physical
*Communication at the application, transport, network, and data-link layers is **logical**; communication at the physical layer is **physical**.* "The data-link layer transforms bits into signals" is **false**: only the physical layer does that.
:::

## Two kinds of data

| Kind | Definition (slide wording) | Real-life example |
|---|---|---|
| **Analog data** | information that is *continuous* (takes on continuous values) | sound: when someone speaks, an analog wave is created in the air |
| **Digital data** | information that has *discrete states* (takes on discrete values) | data stored in computer memory in the form of 1s and 0s |

The key words are **continuous** and **discrete**: sound pressure can take any value; a memory cell is only ever 0 or 1.

## Two kinds of signals

Data and signals are different things, and each can independently be analog or digital.

| Kind | Definition (slide wording) |
|---|---|
| **Analog signal** | has *many levels of intensity* over a period of time |
| **Digital signal** | has a *limited number of defined values* (often 0 and 1) |

An analog signal can sit at any voltage between its extremes; a digital signal is only ever at one of its allowed levels.

## Periodic vs nonperiodic

Both analog and digital signals can take one of two forms.

- **Periodic**: the signal completes a pattern and repeats it, over and over.
  - **Cycle**: the completion of one full pattern.
  - **Period ($T$)**: the amount of time, in seconds, a signal needs to complete one full pattern (one cycle).
  - A simple periodic analog signal, a **sine wave**, cannot be decomposed into simpler signals.
- **Nonperiodic (aperiodic)**: the signal changes without a repeating pattern.

:::quiz Periodic analog, nonperiodic digital
*In data communications, we commonly use **periodic analog** signals and **nonperiodic digital** signals.* The slides state this as a fact and do not justify it. The trap is the swapped pairing: nonperiodic analog, periodic digital.
:::

## Simple vs composite

A periodic analog signal is one of two things:

- **Simple**: a single sine wave. It cannot be decomposed into simpler signals.
- **Composite**: composed of multiple sine waves.

In the widget, the pattern between two grid marks is one cycle, and $T = 1/f$.

```widget
sine-wave
{ "A": 1, "f": 2, "phase": 0, "title": "A simple periodic analog signal (one sine wave)", "presets": { "T = 1 s": [1, 1, 0], "T = 0.5 s": [1, 2, 0], "T = 0.2 s": [1, 5, 0] } }
```

## Where you meet a sine wave

The slides give two everyday sine waves:

- **Power distribution**: the sine wave is carrying **energy** (the voltage in your wall outlet).
- **Burglar alarm**: the sine wave is a **signal of danger**.

Neither carries data, which is why data communication needs composite signals.

## Try it

```quiz
[
  {
    "q": "At the physical layer, what goes through the network connecting Alice to Bob is data.",
    "type": "tf",
    "answer": false,
    "explain": "Data (information) is what Alice and Bob exchange. What goes through the network at the physical layer is **signals** (e.g. electrical signals). Data must be changed to signals for transmission."
  },
  {
    "q": "Fill in the blank: communication at the application, transport, network and data-link layers is logical; communication at the physical layer is ______.",
    "type": "text",
    "answer": ["physical"],
    "explain": "Only the physical layer moves something real (electromagnetic signals) across a medium. The four layers above it communicate logically."
  },
  {
    "q": "Which is the slide's real-life example of **analog data**?",
    "options": ["Data stored in computer memory as 1s and 0s", "Sound: when someone speaks, an analog wave is created in the air", "A digital photo file", "A text message"],
    "answer": 1,
    "explain": "Analog data is information that is continuous. Sound is the slide example. Memory holding 1s and 0s is the example of digital data (discrete states)."
  },
  {
    "q": "A digital signal is defined on the slides as a signal that...",
    "options": ["has many levels of intensity over a period of time", "has a limited number of defined values (often 0 and 1)", "carries digital data only", "cannot be decomposed into simpler signals"],
    "answer": 1,
    "explain": "Digital signal: a limited number of defined values, often 0 and 1. \"Many levels of intensity over a period of time\" is the analog signal definition; \"cannot be decomposed\" describes a simple sine wave."
  },
  {
    "q": "Fill in the blank: in data communications, we commonly use periodic ______ signals.",
    "type": "text",
    "answer": ["analog"],
    "explain": "The slide sentence is: we commonly use **periodic analog** signals and **nonperiodic digital** signals."
  },
  {
    "q": "In data communications, we commonly use nonperiodic analog signals and periodic digital signals.",
    "type": "tf",
    "answer": false,
    "explain": "The words are swapped. The slide says periodic **analog** signals and nonperiodic **digital** signals."
  },
  {
    "q": "Fill in the blank: the amount of time, in seconds, a signal needs to complete one full pattern (one cycle) is its ______.",
    "type": "text",
    "answer": ["period", "period (T)", "period T", "T"],
    "explain": "Period $T$ is measured in seconds; one full pattern is a cycle. Frequency (next lesson) is how many of those cycles fit in one second."
  },
  {
    "q": "A sine wave can be decomposed into simpler signals.",
    "type": "tf",
    "answer": false,
    "explain": "A sine wave is a **simple** periodic analog signal: it cannot be decomposed into simpler signals. A **composite** signal is the one made of multiple sine waves."
  },
  {
    "q": "Which statements about the physical layer are on the slides? Select all that apply.",
    "options": ["It moves data in the form of electromagnetic signals across a transmission medium", "Data must be changed to signals for transmission", "Communication at the physical layer is logical", "Communication at the physical layer is physical"],
    "answer": [0, 1, 3],
    "explain": "All three of those are slide wording. Communication at the physical layer is physical, not logical; the logical layers are application, transport, network and data-link."
  },
  {
    "q": "In which slide example is a sine wave carrying **energy** rather than acting as a signal of danger?",
    "options": ["Burglar alarm", "Power distribution", "Telephone conversation", "Computer memory"],
    "answer": 1,
    "explain": "Power distribution: the sine wave is carrying energy. The burglar alarm's sine wave is a signal of danger. Neither one carries data."
  },
  {
    "q": "Digital data can only be carried by a digital signal.",
    "type": "tf",
    "answer": false,
    "explain": "Data and signals are separate ideas; each can be analog or digital. The slides define analog/digital data and analog/digital signals independently (the conversions between them come in Weeks 4 and 5)."
  },
  {
    "q": "Fill in the blank: a periodic analog signal that is composed of multiple sine waves is called a ______ signal.",
    "type": "text",
    "answer": ["composite"],
    "explain": "Simple = one sine wave (cannot be decomposed). Composite = made of multiple sine waves."
  }
]
```
