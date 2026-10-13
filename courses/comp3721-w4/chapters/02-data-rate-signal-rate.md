---
title: Data rate & signal rate
minutes: 12
---

A link does not see bits per second. It sees signal elements per second, and the ratio $r$ ties the two rates together.

## Two rates

| | Data rate $N$ | Signal rate $S$ |
|---|---|---|
| Also called | bit rate | modulation rate, pulse rate, baud rate |
| Slide definition | the number of data elements (bits) sent in 1 second | the number of signal elements sent in 1 second |
| Unit | bps | baud |
| Slide arrow | increase in the data rate → increase in the speed of transmission | decrease in the signal rate → decrease in the bandwidth requirement |

The slide boxes what follows from the two arrows: *A goal in data communications is to increase the data rate while decreasing the signal rate.*

In the transportation analogy that is more people carried in fewer vehicles.

## Baud rate on a microcontroller

The slide's FYI: when you establish a serial connection using a microcontroller such as an Arduino, you specify a **baud rate** on the pin. The pin has to receive the same number of signal elements in a second as the sensor connected to it sends. How fast the data moves then depends on the ratio $r$.

## Signal rate from data rate

$$S = \frac{N}{r}$$

Each signal element carries $r$ data elements, so $N$ bits per second take $N / r$ signal elements per second.

The slide adds that this relationship *depends on the value of r and the pattern of the data*. It does not say why the pattern matters. An earlier edition of the textbook gives the reason: a pattern of all 1s or all 0s can give a different signal rate from a pattern of alternating 0s and 1s.

## Three cases and the case factor

1. **Worst case**: the maximum signal rate
2. **Best case**: the minimum signal rate
3. **Average case**: the one we are usually interested in

$$S_{avg} = c \times N \times \frac{1}{r}$$

| Symbol | Meaning | Unit |
|---|---|---|
| $S_{avg}$ | average signal rate | baud |
| $c$ | **case factor**, different for each case | none |
| $N$ | data rate | bps |
| $r$ | data elements carried by each signal element | none |

## Slide example: 100 kbps at r = 1

*A signal is carrying data in which one data element is encoded as one signal element. If the bit rate is 100 kbps, what is the average value of the baud rate if c is 1/2?*

One data element per signal element is $r = 1$. Convert kbps to bps, then substitute:

$$S = c \times N \times \frac{1}{r} = \frac{1}{2} \times 100000 \times \frac{1}{1} = 50000\ \text{baud} = 50\ \text{kbaud}$$

## The same 100 kbps at other ratios

Computed from the slide formula with $c = \frac{1}{2}$; the slide works only the $r = 1$ row.

| $r$ | $\frac{1}{r}$ | $S_{avg}$ |
|---|---|---|
| $\frac{1}{2}$ | $2$ | 100 kbaud |
| $1$ | $1$ | 50 kbaud |
| $\frac{4}{3}$ | $\frac{3}{4}$ | 37.5 kbaud |
| $2$ | $\frac{1}{2}$ | 25 kbaud |

A larger $r$ sends the same data rate at a lower signal rate. Dividing by a fraction is where slips happen: $r = \frac{1}{2}$ doubles the signal rate.

## E04 runs the formula backwards

E04 exercise 2 gives both rates and asks for $r$ and the number of signal levels; it is worked in [Encoding practice](#/comp3721-w4/encoding-practice).

## Signal rate from N, r and c

```widget
signal-rate
{ "show": "signal", "N": 100, "unit": "kbps", "r": "1", "c": "1/2" }
```

## Convert four more data rates and signal rates

Use $S = c \times N \times \frac{1}{r}$ and convert kbps to bps before substituting.

```quiz
[
  {
    "q": "A scheme uses two signal elements per bit ($r = \\frac{1}{2}$). The data rate is 300 kbps and the worst case $c = 1$ applies. What is the signal rate, in kbaud?",
    "type": "numeric",
    "answer": 600,
    "tolerance": 0.5,
    "unit": "kbaud",
    "explain": "$\\frac{1}{r} = 2$. $S = 1 \\times 300000 \\times 2 = 600000$ baud $= 600$ kbaud."
  },
  {
    "q": "A scheme carries four data elements per three signal elements ($r = \\frac{4}{3}$). The data rate is 36 kbps and $c = \\frac{1}{2}$. What is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 13.5,
    "tolerance": 0.02,
    "unit": "kbaud",
    "explain": "$\\frac{1}{r} = \\frac{3}{4}$. $S = \\frac{1}{2} \\times 36000 \\times \\frac{3}{4} = 13500$ baud $= 13.5$ kbaud."
  },
  {
    "q": "An NRZ signal ($r = 1$) has an average signal rate of 6000 baud with $c = \\frac{1}{2}$. What is the data rate, in bps?",
    "type": "numeric",
    "answer": 12000,
    "tolerance": 5,
    "unit": "bps",
    "explain": "Solve for $N$: $N = \\frac{S \\times r}{c} = \\frac{6000 \\times 1}{1/2} = 12000$ bps."
  },
  {
    "q": "A signal has a bit rate of 6000 bps and a baud rate of 2000 baud, with $c = 1$ and each signal element one signal level. How many levels does it need?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "levels",
    "explain": "$r = \\frac{N}{S} = \\frac{6000}{2000} = 3$ bits per baud, and $r = \\log_{2} L$ gives $L = 2^{3} = 8$."
  }
]
```

```quiz
[
  {
    "q": "Which of these is **not** another name for the signal rate?",
    "options": ["Modulation rate", "Pulse rate", "Bit rate", "Baud rate"],
    "answer": 2,
    "explain": "Signal rate (modulation rate, pulse rate, baud rate) counts signal elements per second. Bit rate is the other name for the **data** rate."
  },
  {
    "q": "Fill in the blank: the unit of the signal rate is the ________.",
    "type": "text",
    "answer": ["baud"],
    "explain": "Signal rate: the number of signal elements sent in 1 second, in baud. The data rate is in bps."
  },
  {
    "q": "A signal carries one data element per signal element. The bit rate is 64 kbps and $c$ is $\\frac{1}{2}$. What is the average baud rate, in kbaud?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.05,
    "unit": "kbaud",
    "explain": "$r = 1$. $S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 64000 \\times 1 = 32000$ baud $= 32$ kbaud."
  },
  {
    "q": "A scheme uses two signal elements for each data element ($r = \\frac{1}{2}$). The data rate is 1 Mbps and $c = \\frac{1}{2}$. What is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 1,
    "unit": "kbaud",
    "explain": "$\\frac{1}{r} = 2$. $S = \\frac{1}{2} \\times 1000000 \\times 2 = 1000000$ baud $= 1000$ kbaud. With $r = \\frac{1}{2}$ and $c = \\frac{1}{2}$ the average signal rate equals the data rate."
  },
  {
    "q": "Each signal element carries 2 data elements. The data rate is 48 kbps and $c = \\frac{1}{2}$. What is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0.02,
    "unit": "kbaud",
    "explain": "$r = 2$. $S = \\frac{1}{2} \\times 48000 \\times \\frac{1}{2} = 12000$ baud $= 12$ kbaud."
  },
  {
    "q": "A scheme carries four data elements per three signal elements ($r = \\frac{4}{3}$). The data rate is 120 kbps and $c = \\frac{1}{2}$. What is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 45,
    "tolerance": 0.05,
    "unit": "kbaud",
    "explain": "$\\frac{1}{r} = \\frac{3}{4}$. $S = \\frac{1}{2} \\times 120000 \\times \\frac{3}{4} = 45000$ baud $= 45$ kbaud."
  },
  {
    "q": "A signal has an average signal rate of 2000 baud with $r = 2$ and $c = \\frac{1}{2}$. What is the data rate, in bps?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 5,
    "unit": "bps",
    "explain": "Solve $S = c \\times N \\times \\frac{1}{r}$ for $N$: $N = \\frac{S \\times r}{c} = \\frac{2000 \\times 2}{1/2} = 8000$ bps."
  },
  {
    "q": "A decrease in the signal rate means a decrease in the bandwidth requirement.",
    "type": "tf",
    "answer": true,
    "explain": "Slide arrow: decrease in the signal rate → decrease in the bandwidth requirement. The other arrow: increase in the data rate → increase in the speed of transmission."
  },
  {
    "q": "Fill in the blank: a goal in data communications is to increase the data rate while decreasing the ________ rate.",
    "type": "text",
    "answer": ["signal"],
    "explain": "Increase the data rate (more speed) while decreasing the signal rate (less bandwidth)."
  },
  {
    "q": "Which case has the maximum signal rate?",
    "options": ["The best case", "The average case", "The noiseless case", "The worst case"],
    "answer": 3,
    "explain": "Worst case: the maximum signal rate. Best case: the minimum signal rate. The average case is the one we are usually interested in."
  },
  {
    "q": "In $S_{avg} = c \\times N \\times \\frac{1}{r}$, what is $c$?",
    "options": ["The case factor, different for each case", "The capacity of the channel", "The number of signal levels", "The number of data elements per signal element"],
    "answer": 0,
    "explain": "$c$ is the case factor: one value for the worst case, one for the best case, one for the average case. The slide example uses $c = \\frac{1}{2}$. Data elements per signal element is $r$."
  },
  {
    "q": "Use $S = N / r$. Each signal element carries 4 data elements and the signal rate is 2400 baud. What is the data rate?",
    "options": ["600 bps", "9600 bps", "2400 bps", "4800 bps"],
    "answer": 1,
    "explain": "$N = S \\times r = 2400 \\times 4 = 9600$ bps. Dividing by 4 instead gives 600, which would be the signal rate of a 2400 bps signal."
  },
  {
    "q": "For the same data rate and case factor, a scheme with $r = 2$ has a higher signal rate than a scheme with $r = 1$.",
    "type": "tf",
    "answer": false,
    "explain": "$S = c \\times N \\times \\frac{1}{r}$: doubling $r$ halves the signal rate. Each signal element carries more bits, so fewer are needed each second."
  },
  {
    "q": "E04 exercise 2: an analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud, $c = 1$, and each signal element corresponds to a signal level. How many signal elements (levels) do we need?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0.5,
    "unit": "signal elements",
    "explain": "$r = \\frac{N}{S} = \\frac{8000}{1000} = 8$ bits per baud, and $r = \\log_{2} L$ gives $L = 2^{8} = 256$."
  }
]
```
