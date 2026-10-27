---
title: Single-bit and burst errors, detection against correction, redundancy
minutes: 15
---

Bits change on the way across a link. To catch or repair a change, the receiver needs to know what kind to expect and how many bits one burst of noise can hit.

## Received data must be identical to the data transmitted

Slides 3 and 4: *Networks must be able to transfer data from one device to another with acceptable accuracy. The data received must be identical to the data transmitted.* But *Data may become corrupted in passage (one or more bits may be modified).* Not every application needs perfection: *A small level of error may be tolerated by some applications.*

Slide 4 says what most links do with a damaged frame: *The approach of most link-layer protocols for error control → simply discard the frame and let the upper-layer protocols handle the retransmission of the frame.* Error control is one of the data-link services from Week 6 ([data-link services](#/comp3721-w6/data-link-services)).

## Two kinds of data error

Slide 5: *Interference can change the shape of the signal. Bits are subject to unpredictable changes.* Slide 6 names the two results:

- *Only 1 bit of a given data unit (such as a byte, character, or packet) is changed from 1 to 0 or from 0 to 1 → single-bit error.*
- *2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1 → Burst Error.*

Slide 6, figure a: a single-bit error in 8 bits. The 5th bit, the *Corrupted bit*, flips from 0 to 1.

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Sent | 0 | 0 | 0 | 0 | **0** | 0 | 1 | 0 |
| Received | 0 | 0 | 0 | 0 | **1** | 0 | 1 | 0 |

Slide 6, figure b: a burst error in 16 bits. The *Corrupted bits* are positions 4, 5, 8 and 11.

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Sent | 0 | 1 | 0 | **0** | **1** | 1 | 0 | **1** | 0 | 1 | **0** | 0 | 0 | 0 | 1 | 1 |
| Received | 0 | 1 | 0 | **1** | **0** | 1 | 0 | **0** | 0 | 1 | **1** | 0 | 0 | 0 | 1 | 1 |

## The burst length runs from the first corrupted bit to the last

The bracket over figure b reads *Length of burst error (8 bits)*, yet only four bits changed. The length counts from the first corrupted bit to the last, including the unchanged bits between them: positions 4 to 11 give 11 − 4 + 1 = 8 bits. Positions 6, 7, 9 and 10 sit inside the burst but arrived correct.

To find the corrupted bits, XOR the sent and received words; each 1 in the result is a flipped bit:

| | Bits |
|---|---|
| Sent | 0100 1101 0100 0011 |
| Received | 0101 0100 0110 0011 |
| Sent ⊕ received | 0001 1001 0010 0000 |

The first 1 is at position 4 and the last at position 11.

## Burst errors are more likely, because noise outlasts a bit

Under the figure the slide asks: *More likely to happen. Why?* Answer (textbook, unverified; it follows from slides 7 to 9; an in-class answer replaces this): a burst of noise normally lasts longer than one bit, so it corrupts a run of bits rather than one. The faster the line, the more bits fit inside the same noise.

## Bits affected = data rate × duration of noise

Slide 7, boxed: *Number of bits affected by the noise depends on the data rate and the duration of noise.* So:

$$\text{bits affected} = \text{data rate} \times \text{noise duration}$$

The example on slides 8 and 9: *Assume we are sending data and there is a noise of 0.001 second. How many bits are affected by this noise if a) The data rate is 1 kbps. b) The data rate is 1 Mbps.*

| Case | Data rate in bps | Noise | Bits affected |
|---|---|---|---|
| a | 1 kbps = 1000 bps | 0.001 s | *1000 × 0.001 = 1 bit* |
| b | 1 Mbps = 1 000 000 bps | 0.001 s | *1000000 × 0.001 = 1000 bits* |

The same millisecond of noise is a single-bit error at 1 kbps and a 1000-bit burst at 1 Mbps. Convert first: kbps × 1000 and Mbps × 1 000 000 give bps; ms ÷ 1000 and μs ÷ 1 000 000 give seconds.

### Bits hit by a 1 ms noise burst

The shaded window is the noise. Switch between the two presets and watch the same window cover 1 bit, then 1000.

```widget
noise-burst
{ "rate": 1, "unit": "kbps", "duration": 0.001, "presets": { "1 kbps (slide 9a)": [1, "kbps", 0.001, "s"], "1 Mbps (slide 9b)": [1, "Mbps", 0.001, "s"] } }
```

## Error detection asks whether; correction asks how many and where

Slide 10:

- *Error detection: Only looking to see if any error has occurred. The number of corrupted bits (type of error) is not important.*
- *Error correction: The exact number of corrupted bits and their location in the message need to be identified. The number of errors and the size of the message are important factors.*

The slide's conclusion: *The correction of errors is more difficult than the detection.*

## Redundancy: extra bits that have a relationship with the data

Slide 11: *Sending some extra bits with our data. These redundant bits are added by the sender and removed by the receiver. Redundant bits allow the receiver to detect or correct corrupted bits. Redundancy is achieved through coding schemes. The sender adds redundant bits which have a relationship with the actual data.*

The receiver checks that relationship: if the received bits no longer satisfy it, something changed on the way.

## Count the bits a burst corrupts

Convert the rate to bps and the noise to seconds, then multiply. For a burst, XOR the two words and count from the first 1 to the last.

```quiz
[
  {
    "q": "Noise lasts 2 ms on a 10 Mbps link. How many bits are affected?",
    "type": "numeric",
    "answer": 20000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bits affected = data rate × noise duration. 10 Mbps = 10 000 000 bps and 2 ms = 0.002 s, so 10 000 000 × 0.002 = 20 000 bits."
  },
  {
    "q": "Noise lasts 0.5 ms on a 100 Mbps link. How many bits are affected?",
    "type": "numeric",
    "answer": 50000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "100 Mbps = 100 000 000 bps and 0.5 ms = 0.0005 s, so 100 000 000 × 0.0005 = 50 000 bits."
  },
  {
    "q": "Sent 0110100111001010, received 0110011111001010. How many bits long is the burst error?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "XOR the two words: 0110 1001 1100 1010 ⊕ 0110 0111 1100 1010 = 0000 1110 0000 0000. The 1s are at positions 5, 6 and 7, so the burst runs from position 5 to position 7: 7 − 5 + 1 = 3 bits."
  },
  {
    "q": "Same pair: sent 0110100111001010, received 0110011111001010. Which type of error is it?",
    "options": ["A burst error of length 3 bits", "A burst error of length 16 bits", "A single-bit error", "No error"],
    "answer": 0,
    "explain": "Three bits (positions 5, 6 and 7) changed. 2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1 → burst error. Its length runs from the first corrupted bit to the last (3 bits), not the whole 16-bit unit. A single-bit error changes only 1 bit of the data unit."
  }
]
```

```quiz
[
  {
    "q": "There is a noise of 0.001 s and the data rate is 1 kbps. How many bits are affected?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Slide 9a: 1 kbps = 1000 bps, and 1000 × 0.001 = 1 bit."
  },
  {
    "q": "The same 0.001 s noise, but the data rate is 1 Mbps. How many bits are affected?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Slide 9b: 1 Mbps = 1 000 000 bps, and 1 000 000 × 0.001 = 1000 bits. The faster line packs more bits into the same noise."
  },
  {
    "q": "Noise lasts 10 ms on a 56 kbps line. How many bits are affected?",
    "type": "numeric",
    "answer": 560,
    "tolerance": 0,
    "unit": "bits",
    "explain": "56 kbps = 56 000 bps and 10 ms = 0.01 s, so 56 000 × 0.01 = 560 bits."
  },
  {
    "q": "In error detection, the number of corrupted bits is important.",
    "type": "tf",
    "answer": false,
    "explain": "Error detection: only looking to see if any error has occurred. The number of corrupted bits (type of error) is not important. It is error correction that needs the exact number of corrupted bits and their location."
  },
  {
    "q": "Which is more difficult, and why?",
    "options": ["Correction, because the exact number of corrupted bits and their location must be identified", "Detection, because every bit of the message must be checked", "Detection, because the number of errors and the size of the message matter", "Neither: they need the same information"],
    "answer": 0,
    "explain": "The correction of errors is more difficult than the detection. Detection only asks whether any error occurred; correction needs the exact number of corrupted bits and their location, and the number of errors and the size of the message are important factors."
  },
  {
    "q": "2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1. What is this error called?",
    "type": "text",
    "answer": ["burst error", "burst", "burst errors"],
    "explain": "A burst error (slide 6). Only 1 bit changed would be a single-bit error."
  },
  {
    "q": "Slide 6, figure b: the corrupted bits of a 16-bit unit are at positions 4, 5, 8 and 11. How many bits long is the burst error?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bits",
    "explain": "The length runs from the first corrupted bit to the last, including the unchanged bits between: 11 − 4 + 1 = 8 bits, the slide's Length of burst error (8 bits). Only 4 of those 8 bits changed."
  },
  {
    "q": "Who adds the redundant bits, and who removes them?",
    "options": ["Added by the sender, removed by the receiver", "Added by the receiver, removed by the sender", "Added by the sender, kept by the receiver as part of the data", "Added by the upper-layer protocols, removed by the link layer"],
    "answer": 0,
    "explain": "Slide 11: these redundant bits are added by the sender and removed by the receiver. They have a relationship with the actual data, which lets the receiver detect or correct corrupted bits."
  },
  {
    "q": "Most link-layer protocols simply discard a corrupted frame and let the lower-layer protocols handle its retransmission.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 4: simply discard the frame and let the upper-layer protocols handle the retransmission of the frame."
  }
]
```
