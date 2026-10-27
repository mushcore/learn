---
title: "Hamming distance: d_min = s + 1 to detect, 2t + 1 to correct"
minutes: 18
---

Whether a code catches an error depends on how far apart its valid codewords are: a few flipped bits must not be enough to turn one codeword into another. Hamming distance measures that gap and turns it into two counts, the errors a code detects and the errors it corrects.

## Hamming distance counts the bits that differ

Slide 20: *Definition: The Hamming distance between two words (of the same size) is the number of differences between corresponding bits. d(x, y): Hamming distance between two words x and y as d(x, y). e.g., the Hamming distance between 011011 and 001111 is two.*

| | Bits |
|---|---|
| x | 011011 |
| y | 001111 |
| differs? | 010100 |

Positions 2 and 4 differ, so d(011011, 001111) = 2. Both words must have the same size; the distance between a 5-bit and a 6-bit word is not defined.

## Calculate it with XOR and count the 1s

Slide 21: *Calculating Hamming distance: XOR operation (⊕) on the two words and count the number of 1s in the result. Example: d(10101, 11110) = 3 ← 10101 ⊕ 11110 = 01011*

XOR gives 1 where the bits differ and 0 where they agree:

| | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 10101 | 1 | 0 | 1 | 0 | 1 |
| 11110 | 1 | 1 | 1 | 1 | 0 |
| ⊕ | 0 | 1 | 0 | 1 | 1 |

Three 1s in 01011, so the distance is 3.

### XOR and count the 1s

Edit either word; the XOR row updates under them with its 1s lit, and the count of 1s is the distance.

```widget
codeword-lab
{ "mode": "distance", "a": "10101", "b": "11110" }
```

## Comparing the received and sent codewords

Slide 20 asks *How does the Hamming distance help in error detection?* and answers it: *The Hamming distance between the received codeword and the sent codeword is the number of bits that are corrupted during transmission. d(x, y) = 0 → no error; d(x, y) > 0 → error*

This is the XOR from the burst-error figure of the first lesson: each 1 in sent ⊕ received is a corrupted bit, so counting them gives the number of errors.

## dmin = s + 1 guarantees detecting s errors

A code's minimum distance $d_{min}$ is the smallest Hamming distance between any two of its valid codewords. Slide 22, boxed: *To guarantee the detection of up to s errors in all cases in a block coding scheme, the minimum Hamming distance between all pairs of valid codewords must be dmin = s + 1.*

The reason: s or fewer flips move the sent codeword at most s bits, and every other valid codeword is at least s + 1 bits away, so the received word cannot be valid. It lands on an invalid word and is discarded.

## dmin = 2t + 1 to correct t errors

The correction rule sits on slide 53, under forward error correction: *To correct t errors, we need to have dmin = 2t + 1.* Its example: *if we want to correct 10 bits in a packet, we need to make the minimum hamming distance 21 bits → lot of redundant bits need to be sent with the data*. Check: 2 × 10 + 1 = 21.

The extra distance keeps the received word closer to the sent codeword than to any other one, so the receiver can pick the nearest codeword and be right.

## What a given dmin detects and corrects

Turning the two boxes around (derived; no slide words it this way): a code with minimum distance $d_{min}$ detects up to $d_{min} - 1$ errors and corrects up to ⌊($d_{min}$ − 1)/2⌋ errors, rounded down.

| $d_{min}$ | detects up to $d_{min} - 1$ | corrects up to ⌊($d_{min}$ − 1)/2⌋ | example |
|---|---|---|---|
| 2 | 1 | 0 | simple parity C(5, 4), stated on slide 25 |
| 3 | 2 | 1 | the C(7, 4) CRC table of slide 34 (computed; not stated on a slide) |
| 4 | 3 | 1 | |
| 5 | 4 | 2 | {00000, 11111} |
| 21 | 20 | 10 | slide 53 |

Going from $d_{min}$ 3 to 4 adds one detected error but no corrected one: correcting needs the distance to grow by 2.

The C(7, 4) CRC table's $d_{min}$ of 3 was found by checking every pair of its 16 codewords. So that code detects every 1-bit or 2-bit error and could correct any single-bit error.

### dmin of the C(7, 4) table

The widget compares every pair of the 16 codewords and lights one closest pair. The detect and correct line under it is the table row for $d_{min}$ = 3.

```widget
codeword-lab
{ "code": "crc-7-4", "mode": "table" }
```

## Measure the distance, then the power of the code

XOR each pair and count the 1s; for a code, take the smallest distance over all pairs and apply the two rules.

```quiz
[
  {
    "q": "XOR 10110011 and 10011010. Type the result (the bits without spaces).",
    "type": "text",
    "answer": ["00101001"],
    "explain": "Bit by bit, 1 where they differ: 1⊕1=0, 0⊕0=0, 1⊕0=1, 1⊕1=0, 0⊕1=1, 0⊕0=0, 1⊕1=0, 1⊕0=1 → 00101001."
  },
  {
    "q": "So what is d(10110011, 10011010)? How many bits differ?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "10110011 ⊕ 10011010 = 00101001, which has three 1s: d = 3."
  },
  {
    "q": "What is d(11110000, 11001100)? How many bits differ?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "11110000 ⊕ 11001100 = 00111100, four 1s: d = 4."
  },
  {
    "q": "A code has the four valid codewords 000000, 011011, 101101 and 110110. What is its minimum Hamming distance?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "Six pairs. From 000000 each other word is its own count of 1s: 4, 4, 4. 011011 ⊕ 101101 = 110110 (4), 011011 ⊕ 110110 = 101101 (4), 101101 ⊕ 110110 = 011011 (4). Every pair is 4 apart, so $d_{min}$ = 4."
  },
  {
    "q": "That code ($d_{min}$ = 4): how many errors can it detect, and how many can it correct?",
    "options": ["Detects 3, corrects 1", "Detects 4, corrects 2", "Detects 3, corrects 2", "Detects 2, corrects 1"],
    "answer": 0,
    "explain": "Detects up to $d_{min} - 1 = 3$. Corrects up to ⌊(4 − 1)/2⌋ = ⌊1.5⌋ = 1. Correcting 2 would need $d_{min} = 2 \\times 2 + 1 = 5$."
  },
  {
    "q": "A code must detect up to 5 errors in all cases. What minimum Hamming distance does it need?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "explain": "$d_{min} = s + 1 = 5 + 1 = 6$."
  }
]
```

```quiz
[
  {
    "q": "What is the Hamming distance between 011011 and 001111?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "explain": "011011 ⊕ 001111 = 010100, two 1s: d = 2 (slide 20's example)."
  },
  {
    "q": "What is d(10101, 11110)?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "explain": "10101 ⊕ 11110 = 01011, three 1s: d = 3 (slide 21)."
  },
  {
    "q": "What is d(0110110, 0111001)? How many bits differ?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "0110110 ⊕ 0111001 = 0001111, four 1s: d = 4."
  },
  {
    "q": "A code must correct up to 3 errors. What minimum Hamming distance does it need?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "To correct t errors, $d_{min} = 2t + 1 = 2 \\times 3 + 1 = 7$."
  },
  {
    "q": "A code has $d_{min}$ = 2. How many errors can it detect in all cases?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "errors",
    "explain": "Detects up to $d_{min} - 1 = 2 - 1 = 1$ error. Simple parity is this code: a single-bit error-detecting code."
  },
  {
    "q": "The same $d_{min}$ = 2 code. How many errors can it correct?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "unit": "errors",
    "explain": "Corrects up to ⌊(2 − 1)/2⌋ = ⌊0.5⌋ = 0. Correcting even one error needs $d_{min} = 2 \\times 1 + 1 = 3$."
  },
  {
    "q": "A minimum Hamming distance of dmin = s + 1 guarantees the correction of up to s errors.",
    "type": "tf",
    "answer": false,
    "explain": "It guarantees the detection of up to s errors (slide 22). Correcting t errors needs dmin = 2t + 1 (slide 53)."
  },
  {
    "q": "The Hamming distance between the received codeword and the sent codeword is …",
    "options": ["the number of bits that are corrupted during transmission", "the minimum distance of the code", "the number of redundant bits", "the length of the burst error"],
    "answer": 0,
    "explain": "Slide 20: it is the number of bits that are corrupted during transmission; 0 means no error. The burst length also counts the unchanged bits between the first and last corrupted bit, so it can be larger."
  },
  {
    "q": "Select every property of a code with $d_{min}$ = 3.",
    "options": ["It detects up to 2 errors", "It corrects up to 1 error", "It corrects up to 2 errors", "It detects up to 3 errors", "The C(7, 4) CRC table of slide 34 has this minimum distance (computed)"],
    "answer": [0, 1, 4],
    "explain": "Detects $d_{min} - 1 = 2$; corrects ⌊(3 − 1)/2⌋ = 1. Detecting 3 would need $d_{min}$ = 4, correcting 2 would need $d_{min}$ = 5. Checking every pair of the C(7, 4) table gives 3."
  }
]
```
