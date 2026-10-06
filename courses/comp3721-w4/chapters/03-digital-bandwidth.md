---
title: Bandwidth of a digital signal
minutes: 11
---

Week 3 said a digital signal needs a channel wide enough to carry it. Lecture 04 puts a formula on how wide, and the formula starts from the signal rate.

## Actual bandwidth and effective bandwidth

| | Slide statement |
|---|---|
| **Actual bandwidth** of a nonperiodic digital signal | continuous with an infinite range (theoretically) |
| **Effective bandwidth** | finite |

The effective bandwidth is finite because *many of the components of a composite signal have such a small amplitude that they can be ignored*.

## The baud rate sets the bandwidth

Slide wording: *The baud rate, not the bit rate, determines the required bandwidth for a digital signal.*

The bandwidth (range of frequencies) is proportional to the signal rate (baud rate), so the slide replaces $S$ (signal rate) with $B$ (bandwidth) in the average-case formula:

$$B = c \times N \times \frac{1}{r}$$

| Symbol | Meaning | Unit |
|---|---|---|
| $B$ | bandwidth | Hz |
| $c$ | case factor | none |
| $N$ | data rate | bps |
| $r$ | data elements carried by each signal element | none |

For one scheme $c$ and $r$ are fixed, so $B$ still grows in proportion to $N$. That is Week 3's statement that the required bandwidth is proportional to the bit rate. Between two schemes at the same bit rate, the one with the larger $r$ needs less bandwidth.

## Bandwidth for the 100 kbps example

Computed from the slide formula; the slide works this signal only as far as its 50 kbaud. With $N = 100$ kbps, $r = 1$ and $c = \frac{1}{2}$:

$$B = \frac{1}{2} \times 100000 \times \frac{1}{1} = 50000\ \text{Hz} = 50\ \text{kHz}$$

The number is the signal rate again, read in hertz.

### Required bandwidth from N, r and c

```widget
signal-rate
{ "show": "bandwidth", "N": 100, "unit": "kbps", "r": "1", "c": "1/2" }
```

## Data rate of a channel

The same formula solved for $N$ gives the data rate of a channel from its bandwidth:

$$N = \frac{1}{c} \times B \times r$$

## The formula agrees with Nyquist

The slide asks whether this formula agrees with the Nyquist formula for $N_{max}$, and answers with two assumptions:

- A signal with $L$ levels can carry $\log_{2} L$ bits (data elements) per level. If each level corresponds to one signal element, then $r = \log_{2} L$.
- The average case, $c = \frac{1}{2}$, so $\frac{1}{c} = 2$.

$$N_{max} = \frac{1}{c} \times B \times r = 2 \times B \times \log_{2} L$$

The right side is the [Nyquist bit rate](#/comp3721-w3/nyquist) from Week 3, the maximum data rate of a channel.

A check with numbers of our own, a 200 kHz channel and 4 levels: $r = \log_{2} 4 = 2$, so $N_{max} = 2 \times 200000 \times 2 = 800$ kbps. Nyquist gives the same, $2 \times 200000 \times \log_{2} 4 = 800$ kbps.

### N max beside the Nyquist bit rate

```widget
signal-rate
{ "show": "nyquist", "B": 200, "bUnit": "kHz", "c": "1/2", "levels": 4 }
```

```quiz
[
  {
    "q": "The actual bandwidth of a nonperiodic digital signal is finite.",
    "type": "tf",
    "answer": false,
    "explain": "The actual bandwidth is continuous with an **infinite** range (theoretically). The **effective** bandwidth is the finite one."
  },
  {
    "q": "Why is the effective bandwidth of a digital signal finite?",
    "options": ["The channel removes every frequency above the bit rate", "A digital signal contains only two frequencies", "Many of its components have such a small amplitude that they can be ignored", "A nonperiodic signal has no frequency components"],
    "answer": 2,
    "explain": "Slide wording: many of the components of a composite signal have such a small amplitude that they can be ignored."
  },
  {
    "q": "Fill in the blank: the ________ rate, not the bit rate, determines the required bandwidth for a digital signal.",
    "type": "text",
    "answer": ["baud", "baud rate"],
    "explain": "The baud rate, not the bit rate. The bandwidth is proportional to the signal rate (baud rate), which is why $S$ can be replaced with $B$."
  },
  {
    "q": "A signal has a data rate of 200 kbps, $r = 1$ and $c = \\frac{1}{2}$. What bandwidth does $B = c \\times N \\times \\frac{1}{r}$ give, in kHz?",
    "type": "numeric",
    "answer": 100,
    "tolerance": 0.1,
    "unit": "kHz",
    "explain": "$B = \\frac{1}{2} \\times 200000 \\times 1 = 100000$ Hz $= 100$ kHz."
  },
  {
    "q": "A scheme uses two signal elements per bit ($r = \\frac{1}{2}$). The data rate is 10 Mbps and $c = \\frac{1}{2}$. What bandwidth does the slide formula give, in MHz?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.01,
    "unit": "MHz",
    "explain": "$\\frac{1}{r} = 2$. $B = \\frac{1}{2} \\times 10000000 \\times 2 = 10000000$ Hz $= 10$ MHz."
  },
  {
    "q": "Each signal element carries 2 data elements. The data rate is 300 kbps and $c = \\frac{1}{2}$. What bandwidth does the slide formula give, in kHz?",
    "type": "numeric",
    "answer": 75,
    "tolerance": 0.1,
    "unit": "kHz",
    "explain": "$r = 2$. $B = \\frac{1}{2} \\times 300000 \\times \\frac{1}{2} = 75000$ Hz $= 75$ kHz."
  },
  {
    "q": "A channel has a bandwidth of 50 kHz. With $r = 1$ and $c = \\frac{1}{2}$, what is the data rate of the channel, in kbps?",
    "type": "numeric",
    "answer": 100,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "$N = \\frac{1}{c} \\times B \\times r = 2 \\times 50000 \\times 1 = 100000$ bps $= 100$ kbps."
  },
  {
    "q": "A channel has a bandwidth of 4 kHz and the signal has 8 levels, each level corresponding to one signal element. With $c = \\frac{1}{2}$, what is $N_{max}$, in kbps?",
    "type": "numeric",
    "answer": 24,
    "tolerance": 0.05,
    "unit": "kbps",
    "explain": "$r = \\log_{2} 8 = 3$. $N_{max} = \\frac{1}{c} \\times B \\times r = 2 \\times 4000 \\times 3 = 24000$ bps $= 24$ kbps, the Nyquist bit rate $2 \\times B \\times \\log_{2} L$."
  },
  {
    "q": "A channel has a bandwidth of 1 MHz. With $r = \\frac{4}{3}$ and $c = \\frac{1}{2}$, what is the data rate of the channel, in Mbps?",
    "type": "numeric",
    "answer": 2.667,
    "tolerance": 0.01,
    "unit": "Mbps",
    "explain": "$N = \\frac{1}{c} \\times B \\times r = 2 \\times 1000000 \\times \\frac{4}{3} = 2666667$ bps $= 2.667$ Mbps."
  },
  {
    "q": "Under which assumptions does $N_{max} = \\frac{1}{c} \\times B \\times r$ become the Nyquist formula?",
    "options": ["Each level corresponds to one signal element and $c = \\frac{1}{2}$", "The channel is noisy and $c = 1$", "$r = 1$ and $c = 1$", "Each bit takes two signal elements and $c = 2$"],
    "answer": 0,
    "explain": "One signal element per level gives $r = \\log_{2} L$, and the average case $c = \\frac{1}{2}$ gives $\\frac{1}{c} = 2$: $N_{max} = 2 \\times B \\times \\log_{2} L$."
  },
  {
    "q": "For the same data rate and case factor, a scheme with $r = \\frac{1}{2}$ needs twice the bandwidth of a scheme with $r = 1$.",
    "type": "tf",
    "answer": true,
    "explain": "$B = c \\times N \\times \\frac{1}{r}$: $\\frac{1}{r}$ is 2 for $r = \\frac{1}{2}$ and 1 for $r = 1$, so the bandwidth doubles."
  },
  {
    "q": "A signal has 16 levels and each level corresponds to one signal element. What is $r$?",
    "options": ["16", "8", "2", "4"],
    "answer": 3,
    "explain": "A signal with $L$ levels can carry $\\log_{2} L$ bits per level: $r = \\log_{2} 16 = 4$."
  },
  {
    "q": "Which formula gives the data rate of a channel from its bandwidth?",
    "options": ["$N = c \\times B \\times \\frac{1}{r}$", "$N = \\frac{1}{c} \\times B \\times r$", "$N = B \\times \\log_{2}(1 + r)$", "$N = \\frac{B}{c \\times r}$"],
    "answer": 1,
    "explain": "Solve $B = c \\times N \\times \\frac{1}{r}$ for $N$: multiply by $r$ and divide by $c$, giving $N = \\frac{1}{c} \\times B \\times r$."
  }
]
```
