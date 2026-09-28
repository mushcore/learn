---
title: Baseband & broadband transmission
minutes: 12
---

A digital signal is a composite analog signal with infinite bandwidth, and no real channel passes every frequency. Lecture 03 gives two ways to send it anyway; from here on the signal is always a **nonperiodic digital signal**.

## Two approaches

| | Baseband transmission | Broadband transmission (modulation) |
|---|---|---|
| The digital signal is | sent over a channel **without changing** it to an analog signal | **changed to an analog signal** for transmission |
| Channel required | a **low-pass channel** | a **bandpass channel** |
| How common the channel is | less common in real life | more available than a low-pass channel |

## Low-pass channel: the bandwidth starts at zero

Slide wording: *if the channel primarily passes signals below a certain frequency, it is called a low-pass channel (has an upper bound)*. The lowest frequency contained in the channel is zero.

Baseband transmission also needs *a dedicated medium with a bandwidth constituting only one channel*. The slide's example is a LAN: almost every wired LAN today uses a dedicated channel for two stations communicating with each other (bus and star topologies).

## Keeping the shape takes a very wide bandwidth

Baseband transmission that **preserves the shape** of the digital signal is possible only with a low-pass channel of **infinite or very wide bandwidth**. The reason is Fourier analysis: each digital signal corresponds to a composite analog signal with infinite bandwidth, so the channel has to pass all of it.

A medium with a very wide bandwidth, such as a **coaxial cable or fiber optic cable**, lets two stations communicate using digital signals with very good accuracy.

The slide boxes the cost of speed: *in baseband transmission, the required bandwidth is proportional to the bit rate; if we need to send bits faster, we need more bandwidth.*

## Received shape against channel bandwidth

```widget
channel-filter
{ "modes": ["lowpass"], "rate": 2, "bandwidth": 4, "bits": "01100010", "title": "Baseband: a digital signal through a low-pass channel" }
```

## Bandpass channel: the bandwidth does not start from zero

A bandpass channel allows signals to pass between two frequency limits. The digital signal **cannot be directly sent** to the channel; it must be converted to an analog signal before transmission.

Two converters do the work: a **digital/analog converter** at the sender and an **analog/digital converter** at the receiving end. The converter is called a **modem** (modulator/demodulator).

## The same bits on a bandpass channel, direct and modulated

```widget
channel-filter
{ "modes": ["bandpass", "modulated"], "rate": 2, "bandwidth": 8, "bits": "01100010", "title": "A bandpass channel from 10 Hz up: direct, then through a modem" }
```

## Two real-life broadband examples

1. **A telephone subscriber line** carrying computer data. It is the line connecting a resident to the central telephone office, designed to carry voice, with a bandwidth of frequencies between 0 and 4 kHz.
2. **Digital cellular phones**, which convert the digitized voice signal to a composite analog signal before sending.

:::info The slides ask "why?" twice and print no answer
These answers follow the longer treatment of the same two examples in an earlier edition of the textbook. An answer given in class replaces them.

- The subscriber line *can be used as a low-pass channel but it is considered as a bandpass channel, why?* The bandwidth is so narrow that baseband transmission would be very slow: with two signal levels the limit of a 4 kHz channel is 8 kbps. Treating the line as a bandpass channel and converting with a modem does better.
- Cellular phones: *their allocated bandwidth is very wide, so, why not sending the digital signal without conversion?* The band is divided among many calls at once. One caller gets a slice of it, and a slice does not start from zero, so it is a bandpass channel.
:::

```quiz
[
  {
    "q": "Baseband transmission changes the digital signal to an analog signal before sending it.",
    "type": "tf",
    "answer": false,
    "explain": "Baseband transmission sends the digital signal over a channel **without changing** it to an analog signal. Changing it to analog is broadband transmission (modulation)."
  },
  {
    "q": "Fill in the blank: baseband transmission requires a ________ channel, one in which the lowest frequency contained in the channel is zero.",
    "type": "text",
    "answer": ["low-pass", "lowpass", "low pass", "low-pass channel"],
    "explain": "A low-pass channel primarily passes signals below a certain frequency: it has an upper bound and starts at zero."
  },
  {
    "q": "Fill in the blank: broadband transmission is also called ________.",
    "type": "text",
    "answer": ["modulation"],
    "explain": "Broadband transmission (modulation) means changing the digital signal to an analog signal for transmission."
  },
  {
    "q": "Which description matches a bandpass channel?",
    "options": ["A channel in which the lowest frequency is zero", "A channel with a bandwidth that does not start from zero", "A channel with infinite bandwidth", "A channel that passes only digital signals"],
    "answer": 1,
    "explain": "A bandpass channel allows signals to pass between two frequency limits; its bandwidth does not start from zero. A bandwidth that starts at zero is a low-pass channel."
  },
  {
    "q": "A bandpass channel is more available than a low-pass channel.",
    "type": "tf",
    "answer": true,
    "explain": "The slide says a bandpass channel is **more available** than a low-pass channel, and that low-pass channels are **less common** in real life."
  },
  {
    "q": "Fill in the blank: in baseband transmission, the required bandwidth is ________ to the bit rate.",
    "type": "text",
    "answer": ["proportional", "directly proportional"],
    "explain": "Required bandwidth is proportional to the bit rate: if we need to send bits faster, we need more bandwidth."
  },
  {
    "q": "Why is a low-pass channel with infinite bandwidth the ideal channel for baseband transmission?",
    "options": ["A digital signal is a simple sine wave with a single frequency", "A low-pass channel amplifies the signal as it passes through", "An infinite bandwidth removes the noise added by the medium", "A digital signal is a composite analog signal with infinite bandwidth"],
    "answer": 3,
    "explain": "Each digital signal corresponds to a composite analog signal with infinite bandwidth, so preserving its shape needs a channel with infinite or very wide bandwidth."
  },
  {
    "q": "Fill in the blank: the converter that changes a digital signal to analog and back is called a ________ (modulator/demodulator).",
    "type": "text",
    "answer": ["modem"],
    "explain": "Two converters are installed, one at each end. The converter is called a modem."
  },
  {
    "q": "Which media does the slide name as having a very wide bandwidth, so that two stations can communicate using digital signals with very good accuracy?",
    "options": ["A telephone subscriber line", "A satellite link", "Coaxial cable or fiber optic cable", "A power line"],
    "answer": 2,
    "explain": "Coaxial cable and fiber optic cable have a very wide bandwidth. The telephone subscriber line is the opposite case: 0 to 4 kHz."
  },
  {
    "q": "Select the real-life examples of **broadband** transmission given on the slides.",
    "options": ["A digital cellular phone sending digitized voice", "Two stations on a wired LAN using a dedicated channel", "A battery supplying 1.5 V", "Computer data sent through a telephone subscriber line"],
    "answer": [0, 3],
    "explain": "The subscriber line and the digital cellular phone both convert the digital signal to analog. The wired LAN is the slide's example of **baseband** transmission."
  },
  {
    "type": "match",
    "q": "Match each term to its description.",
    "pairs": [
      ["Baseband transmission", "digital signal sent without changing it to analog"],
      ["Broadband transmission", "digital signal changed to an analog signal"],
      ["Low-pass channel", "lowest frequency contained in the channel is zero"],
      ["Bandpass channel", "passes signals between two frequency limits"],
      ["Modem", "modulator/demodulator"]
    ],
    "explain": "Baseband goes with the low-pass channel, broadband (modulation) with the bandpass channel, and the modem is the converter broadband needs at each end."
  },
  {
    "q": "A digital signal can be sent directly to a bandpass channel as long as the channel's bandwidth is wide enough.",
    "type": "tf",
    "answer": false,
    "explain": "The digital signal cannot be directly sent to a bandpass channel; it must be converted to an analog signal before transmission. The slides' cellular example has a very wide allocated bandwidth and still converts."
  }
]
```
