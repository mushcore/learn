---
title: Your one-page study note (Week 4)
minutes: 15
---

The Week 4 block of the quiz sheet: Lecture 04 facts in the slide's words, the rule for every scheme, every formula, and the worked numbers from the slides. One A4 or letter page, single-sided and preferably hand-written, plus a calculator. Waveforms are written one symbol per signal element: `+` positive, `−` negative, `0` zero, with a space between bits.

## Lecture 04: digital-to-digital conversion

- Information is converted to a **digital signal or an analog signal** for transmission. Digital-to-digital conversion: representing **digital data** by using **digital signals**.
- **Line coding**: the process of converting digital data to digital signal. A sequence of bits is converted to a digital signal. Encoder at the sender, decoder at the receiver.
- Six characteristics: signal element vs. data element, data rate vs. signal rate, bandwidth, baseline wandering, self-synchronization, DC components.
- **Data element (bit)**: the smallest entity that can represent a piece of information; two types, 0 and 1; what we **need** to send (logically).
- **Signal element (symbol, state)**: carries data elements; the shortest unit (timewise) of a digital signal; what we **can** send (physically).
- **Ratio $r$**: the number of data elements carried by each signal element; different for each line coding scheme. Analogy: person = data element, vehicle = signal element. $r = 1$ each person drives a vehicle, $r > 1$ a carpool, $r = 1/2$ one person with a car and a trailer.
- Slide figures: a. one data element per one signal element, $r = 1$; b. one per two, $r = 1/2$; c. two per one, $r = 2$; d. four per three, $r = 4/3$.
- **Data rate (bit rate)** $N$: data elements (bits) sent in 1 second, in **bps**. More data rate, more speed of transmission.
- **Signal rate (modulation rate, pulse rate, baud rate)** $S$: signal elements sent in 1 second, in **baud**. Less signal rate, less bandwidth requirement.
- Goal: **increase the data rate while decreasing the signal rate**.
- $S$ depends on the value of $r$ and the **pattern of the data**. Three cases: worst (maximum signal rate), best (minimum signal rate), average (usually interested in). $c$ = **case factor**, different for each case.
- Bandwidth: the **actual** bandwidth of a nonperiodic digital signal is continuous with an **infinite** range (theoretically); the **effective** bandwidth is **finite** (many components have such a small amplitude that they can be ignored).
- The **baud rate, not the bit rate**, determines the required bandwidth. Bandwidth is proportional to the signal rate, so $S$ can be replaced with $B$.
- Nyquist check: $L$ levels carry $\log_{2} L$ bits per level; each level one signal element, average case $c = 1/2$.
- **Baseline**: the receiver's running average of the received signal power; the incoming signal power is evaluated against it to determine the value of the data element.
- **Baseline wandering**: a drift in the baseline caused by a **long string of 0s or 1s**; difficult for the receiver to decode correctly. A good line coding scheme needs to prevent it. ECG: caused by something like breathing. Data communication: the pattern of the information.
- **Self-synchronization**: the receiver clock must be synchronized with the sender clock (the receiver's bit intervals must correspond exactly to the sender's) to correctly interpret the received signals. A self-synchronizing signal includes **timing information** in the data: **transitions** (changes in voltage level) that alert the receiver to the beginning, middle, or end of the pulse and can reset the clock.
- Receiver clock faster or slower: bit intervals not matched, the receiver might misinterpret the signals.
- **DC components** (constant components): the very low frequencies (around zero) created by a duration of fixed voltage level. A problem for a system that cannot pass low frequencies or uses electrical coupling (a line that cannot pass frequencies below 200 Hz). No DC component: average amplitude 0. DC component (bias) = the mean amplitude of the waveform; zero mean = DC balanced, DC free.
- Scheme tree. **Unipolar**: NRZ. **Polar**: NRZ, RZ, and biphase (Manchester, and differential Manchester). **Bipolar**: AMI.
- Unipolar (on-off keying): all the signal levels on **one side** of the time axis, above or below. NRZ: the signal does not return to zero at the middle of the bit.
- Polar: voltages on **both sides** of the time axis. Polar NRZ problems: DC components (power density very high around frequencies close to zero), baseline wandering and no self-synchronization (a long sequence of 0s or 1s).
- Manchester and differential Manchester: popular techniques for data transmission. Manchester: IR protocols, RFID, NFC. Differential Manchester: 802.5 with twisted pair. **NRZ-I and differential Manchester = differential encoding.**
- Both Manchester schemes: **self-synchronization** (the transition at the middle of the bit), **no baseline wandering**, **no DC component** (each bit has a positive and negative voltage contribution). Drawback: **signal rate higher** than some other polar schemes, e.g., NRZ-L.
- Bipolar (multilevel binary): three voltage levels, positive, negative, zero. One data element at zero; the other alternates between positive and negative. **AMI** = Alternate Mark Inversion, alternate 1 inversion.
- 04a note: sending the clock on a separate wire makes the cabling cost twice as high, so the receiver derives the clock from the signal (clock recovery). NRZ-I solves consecutive 1s, does nothing for consecutive 0s. Manchester = the exclusive OR of the NRZ-encoded data and the clock.
- Two places where the course material disagrees with the slide definitions. NRZ-L: slide 55 puts 0 positive; the slide-4 chart, the self-synchronization figure and the 04a note draw 1 high. Manchester: slide 57 has 0 high-to-low; the 04a note has 0 low-to-high.

| Scheme | Bit 0 | Bit 1 | Levels | $r$ |
|---|---|---|---|---|
| Unipolar NRZ | zero voltage | positive voltage | zero, positive | 1 |
| Polar NRZ-L (Level) | positive | negative | positive, negative | 1 |
| Polar NRZ-I (Invert) | no change | change (inversion) | positive, negative | 1 |
| Manchester | high-to-low | low-to-high | positive, negative | 1/2 |
| Differential Manchester | inversion at the start of the bit | no inversion at the start of the bit | positive, negative | 1/2 |
| Bipolar AMI | neutral zero voltage | alternating positive and negative | positive, negative, zero | 1 |

Both Manchester schemes always have a transition at the middle of the bit. The slides print $r$ for figures a to d only; the $r$ column is read from the scheme figures (one or two signal elements per bit).

**Formulas**

$$r = \frac{\text{data elements}}{\text{signal elements}} \qquad S = \frac{N}{r}$$

$$S_{avg} = c \times N \times \frac{1}{r} \qquad B = c \times N \times \frac{1}{r}$$

$$N = \frac{1}{c} \times B \times r$$

$$N_{max} = \frac{1}{c} \times B \times r = 2 \times B \times \log_{2} L \qquad (c = \frac{1}{2},\ r = \log_{2} L)$$

$$\text{bits received in 1 s} = N \times \left(1 + \frac{\text{percent faster}}{100}\right)$$

$$\text{extra bps} = N \times \frac{\text{percent faster}}{100}$$

Computed from the slide formula with $c = 1/2$: $r = 1$ gives $S = N/2$, and $r = 1/2$ gives $S = N$.

| Worked number | Result |
|---|---|
| $r = 1$, $N = 100$ kbps, $c = 1/2$ | $S = \frac{1}{2} \times 100000 \times \frac{1}{1} = 50000$ baud $= 50$ kbaud |
| clock 0.1% faster, 1 kbps | 1000 sent, $1000 \times (1 + 0.1\%) = 1001$ received: 1 extra bps |
| clock 0.1% faster, 1 Mbps | 1000000 sent, 1001000 received: 1000 extra bps |
| sender 10110001, receiver bit duration shorter | receiver reads 110111000011 |
| unipolar NRZ, 10110 | `+ 0 + + 0` |
| NRZ-L, 01001110 | `+ − + + − − − +` |
| NRZ-I, 01001110, level before the first bit positive | `+ − − − + − + +` |
| Manchester, 010011 | `+− −+ +− +− −+ −+` |
| differential Manchester, 010011, level before the first bit positive | `−+ +− +− +− −+ +−` |
| AMI, 010010, first 1 positive | `0 + 0 0 − 0` |

```quiz
[
  {
    "q": "A signal has a data rate of 2 Mbps with $r = 1$ and $c = 1/2$. What is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 1,
    "unit": "kbaud",
    "explain": "$S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 2000000 \\times \\frac{1}{1} = 1000000$ baud $= 1000$ kbaud."
  },
  {
    "q": "Which formula gives the average signal rate?",
    "options": ["$S = c \\times N \\times r$", "$S = \\frac{1}{c} \\times B \\times r$", "$S = c \\times N \\times \\frac{1}{r}$", "$S = 2 \\times B \\times \\log_{2} L$"],
    "answer": 2,
    "explain": "$S_{avg} = c \\times N \\times \\frac{1}{r}$: more data elements per signal element means fewer signal elements per second. $\\frac{1}{c} \\times B \\times r$ is the data rate $N$ of a channel, and $2 \\times B \\times \\log_{2} L$ is Nyquist."
  },
  {
    "q": "A receiver clock is 0.2 percent faster than the sender clock and the data rate is 250 kbps. How many extra bits per second does the receiver receive?",
    "type": "numeric",
    "answer": 500,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "250000 bits sent in 1 s. $250000 \\times (1 + 0.2\\%) = 250500$ bits received in 1 s: 500 extra bps."
  },
  {
    "q": "Which signal is 10 in Manchester, as the slide defines it?",
    "options": ["−+ +−", "+− −+", "− +", "+− +−"],
    "answer": 0,
    "explain": "Slide 57: 1 is low-to-high (`−+`) and 0 is high-to-low (`+−`). The second option is what the 04a note's opposite assignment would give, and the third is NRZ-L."
  },
  {
    "q": "Which signal is 0110 in NRZ-I? The level before the first bit is positive.",
    "options": ["+ − − +", "0 + + 0", "− + − −", "+ − + +"],
    "answer": 3,
    "explain": "No change for 0 and change for 1: 0 stays +, 1 inverts to −, 1 inverts to +, 0 stays +. The first option is the same bits in NRZ-L."
  },
  {
    "q": "A channel has a bandwidth of 1 MHz. The signal has 8 levels, each level is one signal element, and $c = 1/2$. What is $N_{max}$, in Mbps?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0.01,
    "unit": "Mbps",
    "explain": "$r = \\log_{2} 8 = 3$. $N_{max} = \\frac{1}{c} \\times B \\times r = 2 \\times 1000000 \\times 3 = 6000000$ bps $= 6$ Mbps."
  },
  {
    "q": "A signal carries one data element in two signal elements. What is $r$?",
    "options": ["$2$", "$1/2$", "$1$", "$4/3$"],
    "answer": 1,
    "explain": "$r$ is the number of data elements carried by each signal element: one data element over two signal elements is $1/2$, the slide's figure b."
  },
  {
    "q": "Fill in the blank: the unit of the signal rate is the ________.",
    "type": "text",
    "answer": ["baud"],
    "explain": "Signal rate: the number of signal elements sent in 1 second, in baud. The data rate is in bps."
  }
]
```
