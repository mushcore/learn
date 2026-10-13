---
title: Manchester & differential Manchester
minutes: 13
---

Polar NRZ fails on a long sequence of identical bits because nothing forces the voltage to change. The two biphase schemes put a transition in the middle of every bit, whatever the data.

## Manchester: the direction of the mid-bit transition is the bit

Each bit is split into two halves at opposite levels. The slide's legend draws the two shapes:

| Bit | First half | Second half | Transition at the middle |
|---|---|---|---|
| 0 | positive | negative | high to low |
| 1 | negative | positive | low to high |

The slide figure sends 0 1 0 0 1 1. Each bit takes two signal elements, written here as a pair:

| Bit | 0 | 1 | 0 | 0 | 1 | 1 |
|---|---|---|---|---|---|---|
| Manchester | +− | −+ | +− | +− | −+ | −+ |

Two equal bits in a row need an extra transition at the boundary between them, to get back to the starting level. Two different bits do not.

## Differential Manchester: the start of the bit carries the value

There is **always a transition at the middle of the bit**. The value is in what happens at the start of the bit. The figure's legend: *No inversion: Next bit is 1* and *Inversion: Next bit is 0*.

| Bit | Start of the bit | Middle of the bit |
|---|---|---|
| 0 | inversion | transition |
| 1 | no inversion | transition |

The same bits 0 1 0 0 1 1 on the slide, with the level before the first bit taken as positive:

| Bit | 0 | 1 | 0 | 0 | 1 | 1 |
|---|---|---|---|---|---|---|
| Differential Manchester | −+ | +− | +− | +− | −+ | +− |

The complementary note (04a) states the same rule from the other side: a 1 has its first half equal to the last half of the previous bit's signal.

### Differential Manchester decides at the start of each bit

Each bit is drawn in two halves. At the start of a bit the signal either inverts (a 0) or carries on from where it was (a 1); the transition at the middle follows either way.

```widget
line-code-play
{ "bits": "010011", "schemes": ["manchester", "diff-manchester"], "scheme": "diff-manchester", "title": "The slide's six bits, drawn one bit at a time" }
```

### The slide's six bits in both schemes

```widget
line-code
{ "bits": "010011", "schemes": ["manchester", "diff-manchester"], "scheme": "manchester", "title": "Manchester and differential Manchester: a transition in the middle of every bit" }
```

## Differential encoding reads the boundary, not the level

Slide box: *NRZ-I and differential Manchester are classified as differential encoding*. The two schemes give an inversion opposite meanings:

| Differential scheme | Inversion at the start of a bit | No inversion |
|---|---|---|
| NRZ-I | next bit is 1 | next bit is 0 |
| Differential Manchester | next bit is 0 | next bit is 1 |

## Where the slides say they are used

| Scheme | Slide box |
|---|---|
| Both | *Popular techniques for data transmission.* |
| Manchester | *It is used for IR protocols, RFID, and NFC system.* |
| Differential Manchester | *Used in 802.5 with Twisted Pair.* |

The FYI slide shows an IR remote control: most codes are between 8 and 32 bits long, sent with Bi-Phase or Manchester encoding.

## Three problems solved, one drawback

| Slide statement | Slide detail |
|---|---|
| **Have self-synchronization** | provided by the transition at the middle of the bit |
| **No baseline wandering** | |
| **No DC component** | each bit has a positive and negative voltage contribution |
| **Drawback** | the signal rate for Manchester and differential Manchester is higher compared with some other polar schemes, e.g., NRZ-L |

## Two signal elements per bit double the signal rate

Both schemes carry one data element per two signal elements, so $r = \frac{1}{2}$, where NRZ-L has $r = 1$. The slides print no number for the drawback. Computed from the slide formula $S = c \times N \times \frac{1}{r}$ with $c = \frac{1}{2}$ and a data rate of 100 kbps:

| Scheme | $r$ | Average signal rate |
|---|---|---|
| NRZ-L | 1 | $\frac{1}{2} \times 100000 \times 1 = 50000$ baud |
| Manchester, differential Manchester | $\frac{1}{2}$ | $\frac{1}{2} \times 100000 \times 2 = 100000$ baud |

The bandwidth follows the signal rate, so the same data rate needs twice the bandwidth.

### A run of 0s in NRZ-L and in the two biphase schemes

```widget
line-code
{ "bits": "0100000011", "schemes": ["nrz-l", "manchester", "diff-manchester"], "compare": true, "title": "Six 0s in a row: NRZ-L goes flat, the biphase schemes keep changing" }
```

## Manchester as the data XOR the clock (04a)

The complementary note builds Manchester another way: it *does a more explicit job of merging the clock with the signal by transmitting the exclusive OR of the NRZ-encoded data and the clock.* The clock is an internal signal that alternates from low to high, one low/high pair per bit, and the note's NRZ draws 1 as high.

| Bit | NRZ data | Clock | Exclusive OR |
|---|---|---|---|
| 0 | low, low | low, high | low, high |
| 1 | high, high | low, high | high, low |

Both 0s and 1s result in a transition, so the receiver can recover the clock. The note's result is the mirror image of slide 57: 0 low-to-high, 1 high-to-low. Use slide 57 unless a question states its own.

```quiz
[
  {
    "q": "In Manchester encoding as slide 57 draws it, how is a 0 encoded?",
    "options": ["A low-to-high transition at the middle of the bit", "A high-to-low transition at the middle of the bit", "No transition at the middle of the bit", "An inversion at the start of the bit and nothing else"],
    "answer": 1,
    "explain": "Slide 57: 0 is high-to-low (first half positive, second half negative) and 1 is low-to-high. The complementary note (04a) draws the mirror image."
  },
  {
    "q": "The bits 1 1 0 0 are sent with Manchester (slide 57). Which signal is sent? (`+` positive, `−` negative, two signal elements per bit)",
    "options": ["+− +− −+ −+", "−+ +− −+ +−", "−+ −+ +− +−", "− − + +"],
    "answer": 2,
    "explain": "1 is low-to-high (`−+`) and 0 is high-to-low (`+−`), so 1 1 0 0 is `−+ −+ +− +−`. `− − + +` is the NRZ-L signal: one signal element per bit."
  },
  {
    "q": "The bits 1 1 0 0 are sent with differential Manchester. The level before the first bit is positive. Which signal is sent?",
    "options": ["−+ −+ +− +−", "+− +− −+ −+", "−+ +− +− −+", "+− −+ −+ −+"],
    "answer": 3,
    "explain": "1: no inversion at the start, so it begins `+` and flips at the middle: `+−`. 1: no inversion, begins `−`: `−+`. 0: inversion at the start, begins `−`: `−+`. 0: inversion again: `−+`. Result `+− −+ −+ −+`."
  },
  {
    "q": "In differential Manchester there is always a transition at the middle of the bit.",
    "type": "tf",
    "answer": true,
    "explain": "The middle transition is there for every bit and gives the synchronization. The bit value is carried by the start of the bit: inversion for 0, no inversion for 1."
  },
  {
    "q": "In differential Manchester, an inversion at the start of a bit means the bit is 1.",
    "type": "tf",
    "answer": false,
    "explain": "Differential Manchester: inversion means the next bit is **0**, no inversion means 1. Inversion for 1 is the NRZ-I rule."
  },
  {
    "q": "Select the two schemes the slide classifies as differential encoding.",
    "options": ["NRZ-L", "NRZ-I", "Manchester", "Differential Manchester", "AMI"],
    "answer": [1, 3],
    "explain": "Slide box: NRZ-I and differential Manchester are classified as differential encoding. Both carry the bit in a change or lack of change, not in the level itself."
  },
  {
    "q": "Fill in the blank: in the Manchester schemes, self-synchronization is provided by the transition at the ________ of the bit.",
    "type": "text",
    "answer": ["middle", "mid", "centre", "center"],
    "explain": "Slide wording: have self-synchronization, provided by the transition at the middle of the bit. It is there whatever the data, so a long sequence of 0s or 1s no longer matters."
  },
  {
    "q": "Why do the Manchester schemes have no DC component?",
    "options": ["Each bit has a positive and negative voltage contribution", "They use three voltage levels", "The signal rests at zero voltage between bits", "Their signal rate is lower than NRZ-L's"],
    "answer": 0,
    "explain": "Each bit spends half its time positive and half negative, so the two contributions cancel inside every bit. Their signal rate is higher than NRZ-L's, which is the drawback."
  },
  {
    "q": "A Manchester signal carries a data rate of 2 Mbps. With $c = \\frac{1}{2}$, what is the average signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0.01,
    "unit": "Mbaud",
    "explain": "Manchester has $r = \\frac{1}{2}$. $S = c \\times N \\times \\frac{1}{r} = \\frac{1}{2} \\times 2000000 \\times 2 = 2000000$ baud $= 2$ Mbaud. NRZ-L ($r = 1$) would need 1 Mbaud."
  },
  {
    "q": "How many signal elements does a Manchester signal use to send the 6 bits 0 1 0 0 1 1?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "signal elements",
    "explain": "One data element per two signal elements ($r = \\frac{1}{2}$): $6 \\times 2 = 12$ signal elements."
  },
  {
    "type": "match",
    "q": "Match each item to the slide's statement about it.",
    "pairs": [
      ["Manchester", "used for IR protocols, RFID and NFC"],
      ["Differential Manchester", "used in 802.5 with twisted pair"],
      ["NRZ-I and differential Manchester", "classified as differential encoding"],
      ["Drawback of both Manchester schemes", "signal rate higher than NRZ-L's"]
    ],
    "explain": "The two red boxes on slide 57 and the drawback on slide 59. Both Manchester schemes are also called popular techniques for data transmission."
  },
  {
    "q": "The complementary note (04a) builds Manchester by transmitting the exclusive OR of the NRZ-encoded data and what?",
    "options": ["The baseline", "The clock", "The previous bit", "The DC component"],
    "answer": 1,
    "explain": "Manchester merges the clock with the signal: data XOR clock. Both 0s and 1s then result in a transition, so the clock can be recovered at the receiver."
  },
  {
    "q": "A Manchester signal (slide 57) reads `+− +− −+ +−`. Which bits does it carry?",
    "options": ["0 0 1 0", "1 1 0 1", "0 1 1 0", "1 0 0 1"],
    "answer": 0,
    "explain": "`+−` is high-to-low, a 0; `−+` is low-to-high, a 1. The signal is 0 0 1 0. Reading it with the 04a convention would give 1 1 0 1."
  }
]
```
