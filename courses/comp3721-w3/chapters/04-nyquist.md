---
title: Noiseless channel: Nyquist bit rate
minutes: 12
---

How fast can bits be sent over a channel? Lecture 03 answers with two theoretical formulas, and the first assumes a channel with no noise at all.

## Data rate and its three factors

**Data rate** (also called **bit rate** or **capacity**) indicates how fast we can send the data, in bps, over a channel. It relies on three factors:

1. The available bandwidth
2. The number of signal levels
3. The quality of the channel (the level of noise)

| Formula | Channel |
|---|---|
| **Nyquist** | noiseless |
| **Shannon** | noisy |

## Nyquist bit rate

The Nyquist bit rate formula defines the **theoretical maximum bit rate** for a **noiseless channel**:

$$\text{BitRate} = 2 \times \text{bandwidth} \times \log_{2} L$$

| Symbol | Meaning | Unit |
|---|---|---|
| BitRate | bits sent per second | bps |
| bandwidth | bandwidth of the channel | Hz |
| $L$ | number of signal levels | none |

With two levels $\log_{2} 2 = 1$, so the bit rate is twice the bandwidth. Every doubling of $L$ adds one more bit per signal element, which adds another $2 \times \text{bandwidth}$ to the bit rate.

## More levels, less reliability

The formula seems to allow any bit rate: keep raising $L$. The slide boxes the catch: *increasing the levels of a signal may reduce the reliability of the system.*

The textbook's reason: more levels impose a burden on the receiver. With 2 levels it can easily distinguish between a 0 and a 1. With 64 levels it must be very sophisticated to distinguish between 64 different levels.

## Example 1: levels for 265 kbps over 30 kHz

*We need to send 265 kbps over a noiseless channel with a bandwidth of 30 kHz. How many signal levels do we need?*

Convert to bps and Hz, then solve for $L$:

$$265000 = 2 \times 30000 \times \log_{2} L$$

$$\log_{2} L = \frac{265000}{60000} = 4.417 \qquad L = 2^{4.417} = 21.36\ \text{levels}$$

*Since this result is not a power of 2, we need to either increase the number of levels or reduce the bit rate.*

The slide stops there. Computed for the nearest power of 2 on each side:

| Choice | Levels | Bit rate |
|---|---|---|
| increase the number of levels | 32 | $2 \times 30000 \times 5 = 300$ kbps |
| reduce the bit rate | 16 | $2 \times 30000 \times 4 = 240$ kbps |

:::warn The textbook prints this example with 20 kHz
Section 2.2 of the textbook uses a 20 kHz channel and gets 98.7 levels. The slide uses 30 kHz and gets 21.36 levels.
:::

:::tip Calculator (beyond the slides)
$2^{4.417}$ needs the $x^{y}$ key. Going the other way, $\log_{2} L = \dfrac{\log L}{\log 2}$ with the base-10 log key.
:::

## Bit rate against bandwidth and levels

```widget
data-rate
{ "show": "nyquist", "bandwidth": 30, "unit": "kHz", "levels": 2, "target": 265, "targetUnit": "kbps", "presets": { "Example 1: 265 kbps over 30 kHz": { "bandwidth": 30, "unit": "kHz", "levels": 2, "target": 265, "targetUnit": "kbps" }, "3000 Hz, 2 levels": { "bandwidth": 3000, "unit": "Hz", "levels": 2 }, "3000 Hz, 4 levels": { "bandwidth": 3000, "unit": "Hz", "levels": 4 }, "20 kHz, 16 levels": { "bandwidth": 20, "unit": "kHz", "levels": 16 } } }
```

```quiz
[
  {
    "q": "A noiseless channel has a bandwidth of 3000 Hz and the signal has 2 levels. What is the maximum bit rate, in bps?",
    "type": "numeric",
    "answer": 6000,
    "tolerance": 1,
    "unit": "bps",
    "explain": "$2 \\times 3000 \\times \\log_{2} 2 = 2 \\times 3000 \\times 1 = 6000$ bps."
  },
  {
    "q": "Same 3000 Hz noiseless channel, now with 4 signal levels. What is the maximum bit rate, in bps?",
    "type": "numeric",
    "answer": 12000,
    "tolerance": 1,
    "unit": "bps",
    "explain": "$2 \\times 3000 \\times \\log_{2} 4 = 2 \\times 3000 \\times 2 = 12000$ bps. Going from 2 to 4 levels adds one bit per signal element. Going on to 8 levels adds one more and gives 18000 bps, not 24000."
  },
  {
    "q": "A noiseless channel has a bandwidth of 20 kHz and the signal has 16 levels. What is the maximum bit rate, in kbps?",
    "type": "numeric",
    "answer": 160,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "$2 \\times 20000 \\times \\log_{2} 16 = 2 \\times 20000 \\times 4 = 160000$ bps $= 160$ kbps."
  },
  {
    "q": "We need to send 100 kbps over a noiseless channel with a bandwidth of 10 kHz. How many signal levels do we need?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.1,
    "unit": "levels",
    "explain": "$100000 = 2 \\times 10000 \\times \\log_{2} L$, so $\\log_{2} L = 5$ and $L = 2^{5} = 32$. A power of 2, so it can be used as it is."
  },
  {
    "q": "We need to send 50 kbps over a noiseless channel with a bandwidth of 10 kHz. What does the Nyquist formula give for $L$?",
    "type": "numeric",
    "answer": 5.66,
    "tolerance": 0.05,
    "unit": "levels",
    "explain": "$\\log_{2} L = 50000 / 20000 = 2.5$, so $L = 2^{2.5} = 5.66$. Not a power of 2: use 8 levels (60 kbps) or reduce the bit rate to 40 kbps with 4 levels."
  },
  {
    "q": "A noiseless channel must carry 48 kbps using 8 signal levels. What bandwidth is needed, in kHz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$48000 = 2 \\times B \\times \\log_{2} 8 = 6B$, so $B = 8000$ Hz $= 8$ kHz."
  },
  {
    "q": "Select the three factors the data rate relies on.",
    "options": ["The wavelength of the signal", "The available bandwidth", "The number of signal levels", "The quality of the channel (the level of noise)", "The length of the message"],
    "answer": [1, 2, 3],
    "explain": "Available bandwidth, number of signal levels, and the quality of the channel (the level of noise)."
  },
  {
    "q": "The Nyquist bit rate formula gives the theoretical maximum bit rate for a noisy channel.",
    "type": "tf",
    "answer": false,
    "explain": "Nyquist is for a **noiseless** channel. The Shannon capacity is the formula for a noisy channel."
  },
  {
    "q": "Increasing the number of signal levels may reduce the reliability of the system.",
    "type": "tf",
    "answer": true,
    "explain": "Slide statement. The receiver has to tell more levels apart: easy with 2, very demanding with 64."
  },
  {
    "q": "Example 1 gives $L = 21.36$ levels. What does the slide say to do with a result that is not a power of 2?",
    "options": ["Either increase the number of levels or reduce the bit rate", "Round to the nearest whole number of levels", "Increase the bandwidth until the result is a power of 2", "Use the Shannon formula instead"],
    "answer": 0,
    "explain": "Increase the number of levels (32 levels carry 300 kbps) or reduce the bit rate (16 levels carry 240 kbps). 21 levels is not an option."
  },
  {
    "q": "Fill in the blank: data rate is also called bit rate or ________.",
    "type": "text",
    "answer": ["capacity"],
    "explain": "Data rate (also called bit rate or capacity) indicates how fast we can send the data, in bps, over a channel."
  }
]
```
