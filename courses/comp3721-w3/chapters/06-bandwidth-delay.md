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

```widget
bandwidth-delay
{ "bandwidth": 5, "delay": 5 }
```

## Prefixes in the product

Real links quote the bandwidth in Mbps and the delay in ms. Convert both to bps and seconds before multiplying:

$$1\ \text{Mbps} \times 2\ \text{ms} = 10^{6}\ \text{bps} \times 0.002\ \text{s} = 2000\ \text{bits}$$

```quiz
[
  {
    "q": "A link has a bandwidth of 5 bps and a delay of 5 s. How many bits can fill the link?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0.1,
    "unit": "bits",
    "explain": "Bandwidth × delay $= 5 \\times 5 = 25$ bits, the slide figure."
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
