---
title: Transmission modes: parallel & serial
minutes: 9
---

A group of bits can cross a link side by side or one after another. The choice trades speed against the cost of the wiring.

## Two digital data transmission modes

| | Parallel | Serial |
|---|---|---|
| How $n$ bits travel | sent together | sent one after another |
| Lines for $n = 8$ | eight lines | only one line (wire) |
| Slide statement | can increase the transfer speed by a factor of $n$ over serial | reduces the cost of transmission over parallel by roughly a factor of $n$ |

The slide figures send the same 8 bits both ways: 0 1 1 0 0 0 1 0.

## Parallel transmission

The slide gives it one advantage and one disadvantage:

- **Advantage**: speed
- **Disadvantage**: cost

## Serial transmission

The slide marks two devices in red:

- a **parallel/serial converter** between the sender and the line
- a **serial/parallel converter** between the line and the receiver

An earlier edition of the textbook gives the reason for the converters: communication within devices is parallel, and only the line is serial.

## USB is serial transmission

USB stands for **Universal Serial Bus**. The slide's table of its evolution:

| Version | Earlier names | Speed |
|---|---|---|
| USB 1.0 | | 12 Mbps |
| USB 2.0 | | 480 Mbps |
| USB 3.2 Gen 1 | 3.0, then 3.1 Gen 1 | 5 Gbps |
| USB 3.2 Gen 2 | 3.1 Gen 2 | 10 Gbps |
| USB 3.2 Gen 2x2 | 3.2 | 20 Gbps |

Every version is serial, and the newest is more than 1600 times faster than the first. The slide's footnote: many of the connectors are designed to be backwards compatible, so the Type-C connector will function even at USB 1.0 speeds.

## Eight bits, parallel and serial

```widget
tx-modes
{ "bits": "01100010" }
```

```quiz
[
  {
    "q": "How many lines does parallel transmission need to send a group of 8 bits together?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.1,
    "unit": "lines",
    "explain": "One line per bit: $n = 8$ bits need eight lines."
  },
  {
    "q": "Fill in the blank: parallel transmission can increase the transfer ________ by a factor of $n$ over serial transmission.",
    "type": "text",
    "answer": ["speed"],
    "explain": "Parallel transmission can increase the transfer speed by a factor of $n$ over serial transmission."
  },
  {
    "q": "Fill in the blank: with only one communication channel, serial transmission reduces the ________ of transmission over parallel by roughly a factor of $n$.",
    "type": "text",
    "answer": ["cost"],
    "explain": "Serial needs one line in place of $n$, so it reduces the cost by roughly a factor of $n$."
  },
  {
    "q": "What are the advantage and the disadvantage of parallel transmission?",
    "options": ["Advantage: cost. Disadvantage: speed", "Advantage: distance. Disadvantage: noise", "Advantage: reliability. Disadvantage: bandwidth", "Advantage: speed. Disadvantage: cost"],
    "answer": 3,
    "explain": "Parallel: speed is the advantage, cost is the disadvantage. Serial is the reverse."
  },
  {
    "q": "In serial transmission, which converter sits between the sender and the line?",
    "options": ["Parallel/serial converter", "Serial/parallel converter", "Digital/analog converter", "Modem"],
    "answer": 0,
    "explain": "Parallel/serial at the sender, serial/parallel at the receiver. The digital/analog converter (modem) belongs to broadband transmission."
  },
  {
    "q": "USB is a parallel transmission standard.",
    "type": "tf",
    "answer": false,
    "explain": "USB stands for Universal **Serial** Bus."
  },
  {
    "type": "match",
    "q": "Match each USB version to its speed.",
    "pairs": [
      ["USB 1.0", "12 Mbps"],
      ["USB 2.0", "480 Mbps"],
      ["USB 3.2 Gen 1", "5 Gbps"],
      ["USB 3.2 Gen 2", "10 Gbps"],
      ["USB 3.2 Gen 2x2", "20 Gbps"]
    ],
    "explain": "12 Mbps, 480 Mbps, then 5, 10 and 20 Gbps. USB 3.2 Gen 1 was previously called 3.0 and then 3.1 Gen 1; Gen 2 was 3.1 Gen 2; Gen 2x2 was 3.2."
  },
  {
    "q": "A group of 8 bits is sent serially, one bit per clock tick. How many clock ticks does the group take?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.1,
    "unit": "ticks",
    "explain": "One line carries one bit per tick, so 8 bits take 8 ticks. Parallel transmission moves all 8 in one tick on 8 lines."
  },
  {
    "q": "Select the statements that describe **serial** transmission.",
    "options": ["We need only one line (wire)", "It needs a converter at the sender and another at the receiver", "It needs one line for every bit in the group", "The bits are sent one after another"],
    "answer": [0, 1, 3],
    "explain": "One line for every bit is parallel transmission. Serial uses one line, sends the bits one after another, and converts at both ends."
  }
]
```
