---
title: Self-synchronization
minutes: 12
---

The receiver reads one bit per tick of its own clock. If that clock runs faster or slower than the sender's, it reads too many or too few bits, so a good signal carries the timing inside the data.

## The receiver clock must match the sender clock

*The receiver clock must be synchronized with the sender clock (the receiver's bit intervals must correspond exactly to the sender's bit intervals).* The slide's purpose line: *To correctly interpret the received signals.*

*If the receiver clock is faster or slower, the bit intervals are not matched, and the receiver might misinterpret the signals.*

## A self-synchronizing signal carries timing information

- *Self-synchronizing digital signal includes timing information in the data being transmitted.*
- The timing information: *Transitions (changes in voltage level) in the signal that alert the receiver to the beginning, middle, or end of the pulse*.
- The slide adds in parentheses: *if the receiver's clock is out of synchronization, these points can reset the clock*.

## Slide figure: 8 bits sent, 12 bits read

The figure shows *a situation in which the receiver has a shorter bit duration*. The signal on the line is the same; the receiver cuts it into shorter intervals.

| | Bits | Count |
|---|---|---|
| a. Sent | 1 0 1 1 0 0 0 1 | 8 |
| b. Received | 1 1 0 1 1 1 0 0 0 0 1 1 | 12 |

Computed from the figure: 12 bits are read in the time of 8, so the receiver's bit lasts about two thirds of the sender's. The single 1 at the start is read as 11, the pair 11 as 111 and the run 000 as 0000.

### Sent bits against a faster or slower receiver clock

```widget
clock-drift
{ "bits": "10110001", "speed": 1.5, "rate": 1, "rateUnit": "kbps", "percent": 0.1 }
```

### The receiver's clock, one tick at a time

Each tick samples the sent signal at the middle of the receiver's shorter interval. Two ticks land inside the first bit, so the single 1 is read as 11.

```widget
clock-drift-play
{ "bits": "10110001", "speed": 1.5 }
```

## Slide example: a clock 0.1 percent faster

*In a digital transmission, the receiver clock is 0.1 percent faster than the sender clock. How many extra bits per second does the receiver receive if the data rate is 1 kbps? How many if the data rate is 1 Mbps?*

| Data rate | Bits sent in 1 s | Bits received in 1 s | Extra |
|---|---|---|---|
| 1 kbps | 1000 | $1000 \times (1 + 0.1\%) = 1001$ | **1 extra bps** |
| 1 Mbps | 1000000 | $1000000 \times (1 + 0.1\%) = 1001000$ | **1000 extra bps** |

The extra bits are the data rate times the percentage: $0.001 \times 1000 = 1$ and $0.001 \times 1000000 = 1000$. The same clock error costs 1000 times as many bits at 1000 times the data rate.

E04 exercise 1 asks the same question with a clock *0.2 percent faster* at 1 Mbps; it is worked in [Encoding practice](#/comp3721-w4/encoding-practice).

A slower receiver clock works the other way. The slides do not show it, but the same arithmetic with $(1 - 0.1\%)$ gives 999 bits read for 1000 sent.

## Complementary note: the clock is recovered from the signal

The 04a note (Peterson & Davie) explains where the receiver's timing comes from.

- Encoding and decoding are both driven by a clock: every clock cycle the sender transmits a bit and the receiver recovers a bit.
- The clock could be sent to the receiver over a separate wire. This is typically avoided because it makes the cost of cabling twice as high.
- Instead the receiver derives the clock from the received signal, the **clock recovery** process. Whenever the signal changes, from 1 to 0 or from 0 to 1, the receiver knows it is at a clock cycle boundary and can resynchronize itself.
- A long period of time without such a transition leads to **clock drift**. Clock recovery depends on having lots of transitions in the signal, no matter what data is being sent.

The note counts this as the second problem caused by long strings of 1s or 0s. The first is [baseline wandering](#/comp3721-w4/baseline-dc).

```quiz
[
  {
    "q": "What does a self-synchronizing digital signal include in the data being transmitted?",
    "options": ["Error-correcting bits", "A copy of the sender's clock on a second wire", "Timing information", "A DC component"],
    "answer": 2,
    "explain": "Slide wording: self-synchronizing digital signal includes timing information in the data being transmitted. The timing information is the transitions in the signal."
  },
  {
    "q": "Fill in the blank: ________ (changes in voltage level) in the signal alert the receiver to the beginning, middle, or end of the pulse.",
    "type": "text",
    "answer": ["transitions", "transition"],
    "explain": "Transitions. If the receiver's clock is out of synchronization, these points can reset the clock."
  },
  {
    "q": "In the slide figure the sender sends 10110001 and the receiver has a shorter bit duration. What does the receiver receive?",
    "options": ["110111000011", "10110001", "1011000", "1100111100000011"],
    "answer": 0,
    "explain": "The receiver receives 110111000011: 12 bits for the 8 that were sent. Its shorter intervals cut the same signal into more pieces, so several sent bits are read twice."
  },
  {
    "q": "In the slide figure the receiver reads more bits than were sent because its bit duration is longer than the sender's.",
    "type": "tf",
    "answer": false,
    "explain": "The receiver has a **shorter** bit duration than the sender, so more of its intervals fit in the same time: 12 bits read for 8 sent."
  },
  {
    "q": "The receiver clock is 0.1 percent faster than the sender clock and the data rate is 1 Mbps. How many extra bits per second does the receiver receive?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "1000000 bits are sent in 1 s and $1000000 \\times (1 + 0.1\\%) = 1001000$ are received: 1000 extra bps."
  },
  {
    "q": "The receiver clock is 0.2 percent faster than the sender clock and the data rate is 250 kbps. How many extra bits per second does the receiver receive?",
    "type": "numeric",
    "answer": 500,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "$250000 \\times 0.2\\% = 250000 \\times 0.002 = 500$ extra bps. The receiver reads 250500 bits in 1 s."
  },
  {
    "q": "E04 exercise 1: in a digital transmission, the receiver clock is 0.2 percent faster than the sender clock. How many extra bits per second does the receiver receive if the data rate is 1 Mbps?",
    "type": "numeric",
    "answer": 2000,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "$0.2\\% \\times 1000000 = 0.002 \\times 1000000 = 2000$ extra bps; the receiver reads 1002000 bits in 1 s. Twice the slide example's 0.1 percent, so twice its 1000 extra bps."
  },
  {
    "q": "The receiver clock is 0.1 percent faster than the sender clock and the data rate is 10 Mbps. How many bits does the receiver receive in 1 s?",
    "type": "numeric",
    "answer": 10010000,
    "tolerance": 1,
    "unit": "bits",
    "explain": "$10000000 \\times (1 + 0.1\\%) = 10000000 \\times 1.001 = 10010000$ bits, which is 10000 extra bps."
  },
  {
    "q": "The receiver clock is 0.5 percent **slower** than the sender clock and the data rate is 2 kbps. How many bits does the receiver read in 1 s?",
    "type": "numeric",
    "answer": 1990,
    "tolerance": 0.5,
    "unit": "bits",
    "explain": "A slower clock reads fewer bits: $2000 \\times (1 - 0.5\\%) = 2000 \\times 0.995 = 1990$ bits, 10 fewer than were sent. The slide example uses a faster clock; this is the same arithmetic with a minus sign."
  },
  {
    "q": "At a data rate of 100 kbps a receiver receives 50 extra bits per second. By what percent is its clock faster than the sender clock?",
    "type": "numeric",
    "answer": 0.05,
    "tolerance": 0.0005,
    "unit": "%",
    "explain": "$50 / 100000 = 0.0005 = 0.05\\%$."
  },
  {
    "q": "According to the complementary note, why is the clock not sent to the receiver over a separate wire?",
    "options": ["A second wire adds crosstalk noise", "It makes the cost of cabling twice as high", "A clock signal cannot travel as far as data", "The receiver can read only one wire at a time"],
    "answer": 1,
    "explain": "The note says a separate clock wire is typically avoided because it makes the cost of cabling twice as high. The receiver derives the clock from the received signal instead."
  },
  {
    "q": "Fill in the blank: the receiver derives the clock from the received signal. The complementary note calls this the clock ________ process.",
    "type": "text",
    "answer": ["recovery"],
    "explain": "Clock recovery, which the note equates with self-synchronization. Each transition tells the receiver it is at a clock cycle boundary."
  },
  {
    "q": "According to the complementary note, what does a long period of time without a transition lead to?",
    "options": ["Attenuation", "A higher baud rate", "Crosstalk", "Clock drift"],
    "answer": 3,
    "explain": "Without transitions the receiver has nothing to resynchronize on, so its clock drifts. Clock recovery depends on having lots of transitions in the signal, no matter what data is being sent."
  },
  {
    "q": "If the receiver's clock is out of synchronization, the transitions in a self-synchronizing signal can reset the clock.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording: if the receiver's clock is out of synchronization, these points can reset the clock. The points are the transitions at the beginning, middle, or end of the pulse."
  }
]
```
