---
title: Bandwidth & the bandwidth-delay product
minutes: 10
---

"Bandwidth" names two different quantities in networking, one in hertz and one in bits per second. Multiplied by the delay of a link, the second one counts the bits in flight.

## Bandwidth in two contexts

| Context | Definition |
|---|---|
| **Bandwidth in hertz** | The range of frequencies included in a composite signal or the range of frequencies a channel can pass. |
| **Bandwidth in bits per second** | The number of bits per second that a channel, a link, or even a network can transmit (the speed of bit transmission in a channel or link). **We call this bit rate.** |

The two move together: an **increase** in bandwidth in hertz means an **increase** in bandwidth in bits per second. Both the Nyquist and the Shannon formula multiply by the bandwidth in hertz.

The lecture summary calls bandwidth *one of the main performance metrics used in data communications*.

## Bandwidth-delay product

The bandwidth-delay product is **the number of bits that can fill the link**. The bandwidth in it is the one in bits per second.

$$\text{bits that fill the link} = \text{bandwidth} \times \text{delay}$$

It is important when we need to **send data in bursts** and **wait for the acknowledgment of each burst** before sending the next one.

## Burst size is twice the product

To use the maximum capability of the link, the burst has to be **2 times the product of bandwidth and delay**. A full-duplex channel has two directions to fill:

$$\text{bits in transition at any time} = 2 \times \text{bandwidth} \times \text{delay}$$

## Slide figure: 5 bps and 5 s

| Quantity | Value |
|---|---|
| Bandwidth | 5 bps |
| Delay | 5 s |
| Bandwidth × delay | 25 bits |

After 1 s the first 5 bits are on the link. Each second they move one step toward the receiver and 5 more bits follow them, so after 5 s the link holds $5 \times 5 = 25$ bits.

:::tip The textbook's pipe
Section 2.2 of the textbook pictures the link as a pipe: the cross section is the bandwidth, the length is the delay, and the volume is the bandwidth-delay product.
:::

## Bits on the link, second by second

For the first 5 s the link fills row by row. In the second half the first bit's acknowledgement travels back, and by the time it reaches the sender the burst has grown to twice the bits that fill one direction.

```widget
bandwidth-delay
{ "bandwidth": 5, "delay": 5, "predict": true, "presets": { "Slide figure: 5 bps, 5 s": [5, 5], "2 bps, 8 s": [2, 8], "8 bps, 2 s": [8, 2] } }
```

## Prefixes in the product

Real links quote the bandwidth in Mbps and the delay in ms. Convert both to bps and seconds before multiplying:

$$1\ \text{Mbps} \times 2\ \text{ms} = 10^{6}\ \text{bps} \times 0.002\ \text{s} = 2000\ \text{bits}$$

## Count the bits in flight on four more links

Bandwidth in bps times delay in seconds; double it for the burst.

```quiz
[
  {
    "q": "A link has a bandwidth of 3 bps and a delay of 7 s. How many bits can fill the link?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0.1,
    "unit": "bits",
    "explain": "Bandwidth × delay $= 3 \\times 7 = 21$ bits. After 1 s the first 3 bits are on the link; after 7 s it holds $7 \\times 3 = 21$."
  },
  {
    "q": "A link has a bandwidth of 1 Gbps and a delay of 5 ms. How many bits can fill the link?",
    "type": "numeric",
    "answer": 5000000,
    "tolerance": 10,
    "unit": "bits",
    "explain": "$10^{9}\\ \\text{bps} \\times 0.005\\ \\text{s} = 5000000$ bits (5 million)."
  },
  {
    "q": "Same link (1 Gbps, 5 ms). What burst size uses the maximum capability of the full-duplex link?",
    "type": "numeric",
    "answer": 10000000,
    "tolerance": 10,
    "unit": "bits",
    "explain": "$2 \\times \\text{bandwidth} \\times \\text{delay} = 2 \\times 5000000 = 10000000$ bits: both directions of the full-duplex channel are filled."
  },
  {
    "q": "A 16 Mbps link is filled by 48000 bits. What is its delay, in ms?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "unit": "ms",
    "explain": "Delay $= \\frac{\\text{bits that fill the link}}{\\text{bandwidth}} = \\frac{48000}{16 \\times 10^{6}} = 0.003$ s $= 3$ ms."
  }
]
```

```quiz
[
  {
    "q": "A link has a bandwidth of 4 bps and a delay of 6 s. How many bits can fill the link?",
    "type": "numeric",
    "answer": 24,
    "tolerance": 0.1,
    "unit": "bits",
    "explain": "Bandwidth × delay $= 4 \\times 6 = 24$ bits. The slide figure does the same with $5 \\times 5 = 25$ bits."
  },
  {
    "q": "A link has a bandwidth of 1 bps and a delay of 5 s. How many bits can fill the link?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.1,
    "unit": "bits",
    "explain": "$1 \\times 5 = 5$ bits. There can be no more than 5 bits on the link at any one time."
  },
  {
    "q": "A link has a bandwidth of 10 Mbps and a delay of 20 ms. How many bits can fill the link?",
    "type": "numeric",
    "answer": 200000,
    "tolerance": 10,
    "unit": "bits",
    "explain": "$10 \\times 10^{6}\\ \\text{bps} \\times 0.020\\ \\text{s} = 200000$ bits."
  },
  {
    "q": "Same link (10 Mbps, 20 ms). What burst size uses the maximum capability of the full-duplex link?",
    "type": "numeric",
    "answer": 400000,
    "tolerance": 10,
    "unit": "bits",
    "explain": "$2 \\times \\text{bandwidth} \\times \\text{delay} = 2 \\times 200000 = 400000$ bits: both directions of the full-duplex channel are filled."
  },
  {
    "q": "A link has a bandwidth of 100 Mbps and a delay of 10 ms. How many bits can fill the link?",
    "type": "numeric",
    "answer": 1000000,
    "tolerance": 10,
    "unit": "bits",
    "explain": "$100 \\times 10^{6} \\times 0.010 = 1000000$ bits."
  },
  {
    "q": "Fill in the blank: bandwidth in bits per second is what we call ________.",
    "type": "text",
    "answer": ["bit rate", "bit-rate", "bitrate", "the bit rate"],
    "explain": "Bandwidth in bits per second is the number of bits per second that a channel, a link, or even a network can transmit. We call this bit rate."
  },
  {
    "q": "Which definition is bandwidth in hertz?",
    "options": ["The number of bits per second that a channel, a link, or even a network can transmit", "The range of frequencies included in a composite signal or the range of frequencies a channel can pass", "The number of bits that can fill the link", "The time a bit takes to cross the link"],
    "answer": 1,
    "explain": "Hertz: a range of frequencies. Bits per second: the speed of bit transmission. The number of bits that can fill the link is the bandwidth-delay product."
  },
  {
    "q": "An increase in bandwidth in hertz means an increase in bandwidth in bits per second.",
    "type": "tf",
    "answer": true,
    "explain": "Slide statement. The Nyquist and Shannon formulas both multiply by the bandwidth in hertz, so more hertz means more bits per second."
  },
  {
    "q": "The bandwidth-delay product is important when...",
    "options": ["we convert a digital signal to an analog signal before sending it on a bandpass channel", "we measure the loss of a cable in decibels per kilometre over its whole length", "we count the signal levels needed to reach a bit rate on a noiseless channel", "we send data in bursts and wait for the acknowledgment of each burst before sending the next one"],
    "answer": 3,
    "explain": "Slide wording: important if we need to send data in bursts and wait for the acknowledgment of each burst before sending the next one."
  },
  {
    "q": "Why is the burst size 2 times the product of bandwidth and delay?",
    "options": ["We need to fill up the full-duplex channel, i.e. two directions", "Every bit is sent twice to detect errors", "The signal has two levels", "The delay is counted at both the sender and the receiver"],
    "answer": 0,
    "explain": "The burst has to fill both directions of the full-duplex channel, so the number of bits in transition at any time is $2 \\times \\text{bandwidth} \\times \\text{delay}$."
  }
]
```
