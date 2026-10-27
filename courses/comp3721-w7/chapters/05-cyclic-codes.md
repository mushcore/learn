---
title: Cyclic codes, the C(7, 4) CRC and modulo-2 arithmetic
minutes: 18
---

Parity catches only an odd number of flipped bits. A cyclic code adds several redundant bits computed by a division, and that catches single, double and burst errors; this lesson sets up the code and the arithmetic, and the next one does the division.

## A cyclic code is a linear block code whose rotations are codewords

Slide 33: *Cyclic codes: Special linear block codes with one extra property: if a codeword is cyclically shifted (rotated), the result is another codeword.* Its example: *If 1011000 is a codeword → cyclic left-shift → 0110001 is also a codeword.* A left rotation moves every bit one place left and the leftmost bit wraps round to the right end: 1011000 becomes 011000 followed by 1. Both words are in the table below, as the codewords of 1011 and 0110.

Because a cyclic code is a linear block code, the XOR of two of its codewords is also a codeword (see [parity-check](#/comp3721-w7/parity-check)): 1001110 ⊕ 1011000 = 0010110, the codeword of 0010.

The slide lists the *Advantages* of cyclic codes:

- *Very good performance in detecting single-bit errors, double errors, and burst errors.*
- *Can easily be implemented in hardware and software.*
- *Especially fast when implemented in hardware.*

*Our focus: A subset of cyclic codes called Cyclic Redundancy Check (CRC), which is used in LANs and WANs.*

## The C(7, 4) CRC table

Slide 34, *n=7, k=4*: each 4-bit dataword gets three redundant bits on the right.

| Dataword | Codeword | Dataword | Codeword |
|---|---|---|---|
| 0000 | 0000000 | 1000 | 1000101 |
| 0001 | 0001011 | 1001 | 1001110 |
| 0010 | 0010110 | 1010 | 1010011 |
| 0011 | 0011101 | 1011 | 1011000 |
| 0100 | 0100111 | 1100 | 1100010 |
| 0101 | 0101100 | 1101 | 1101001 |
| 0110 | 0110001 | 1110 | 1110100 |
| 0111 | 0111010 | 1111 | 1111111 |

The slide does not say which divisor made the table. Recomputed for all 16 rows, it is 1011: each codeword is the dataword followed by the remainder of the dataword plus 000 divided by 1011. Computed over every pair, the table's minimum Hamming distance is 3, so it detects up to 2 errors and corrects 1.

## Divisor n − k + 1 bits, remainder n − k bits

The blue note on slides 35 to 37: *k = 4, n = 7; size of divisor = n−k+1; size of remainder = n−k.*

| Quantity | Rule | C(7, 4) |
|---|---|---|
| divisor | n − k + 1 | 7 − 4 + 1 = 4 bits (1011) |
| remainder | n − k | 7 − 4 = 3 bits |
| zeros appended to the dataword | n − k | 3 |

On slide 37 the sender's encoder feeds the dataword a3 a2 a1 a0 and three 0s into a Generator; the Generator's remainder r2 r1 r0 is placed after the dataword to make the codeword. The divisor d3 d2 d1 d0 is *Shared* by both sides. The receiver's Checker divides the whole codeword b3 b2 b1 b0 q2 q1 q0 and outputs the syndrome s2 s1 s0 to the Decision logic, which either accepts the dataword or discards it.

The slide-37 caption: *If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.* A failure, computed: 1001110 is sent and the noise flips the bits of pattern 1011000. The receiver gets 0010110, which is itself a valid codeword (dataword 0010), so the syndrome is 000 and the wrong dataword is accepted.

### Single-bit errors on 1001110

The codeword of 1001 is loaded; click any received bit to flip it. Each of the seven single flips gives a non-zero syndrome, and each syndrome is different.

```widget
codeword-lab
{ "code": "crc-7-4", "mode": "send", "send": "1001" }
```

## Modulo-2 arithmetic has no carries

The 07c note: *Modulo 2 arithmetic is performed digit by digit on binary numbers. Each digit is considered independently from its neighbours. Numbers are not carried or borrowed.* And: *Modulo 2 addition/subtraction is performed using an exclusive OR (xor) operation on the corresponding binary digits of each operand.* Adding and subtracting are the same operation.

| a | b | a + b = a − b |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The note's multiplication, 1011 × 0101: one shifted copy of 1011 for every 1 in 0101, and the copies are XORed.

```text
      1 0 1 1
    × 0 1 0 1
    ---------
      1 0 1 1
    0 0 0 0
  1 0 1 1
0 0 0 0
-------------
0 1 0 0 1 1 1
```

*Modulo 2 division can be performed in a manner similar to arithmetic long division.* The note divides 100100110 by 10011 and gets quotient 10001, remainder 101 (0101 in four digits). Here it is in the slide-38 layout, with a row of 0s wherever the leftmost bit is 0:

```text
                    1 0 0 0 1      <- Quotient
            _________________
1 0 0 1 1 ) 1 0 0 1 0 0 1 1 0
            1 0 0 1 1
            ---------
              0 0 0 1 0            bring down 0
              0 0 0 0 0            leftmost bit 0: use 00000
              ---------
                0 0 1 0 1          bring down 1
                0 0 0 0 0
                ---------
                  0 1 0 1 1        bring down 1
                  0 0 0 0 0
                  ---------
                    1 0 1 1 0      bring down 0
                    1 0 0 1 1
                    ---------
                      0 1 0 1      <- Remainder
```

The note itself skips the rows that start with 0 and only shifts. Both layouts give the same remainder; the slides write every row.

:::warn X/Y = Y/X is not a rule
The note adds *This has the effect that X/Y = Y/X*, with 11001 ÷ 10011 and 10011 ÷ 11001 both giving quotient 1, remainder 1010. That holds only because both numbers have the same length and start with 1, so one XOR finishes the division. It is not a property of modulo-2 division.
:::

## Work in modulo 2

Type the bits without spaces.

```quiz
[
  {
    "q": "Add 1101 + 1011 in modulo 2. Type the bits without spaces.",
    "type": "text",
    "answer": ["0110"],
    "explain": "Digit by digit XOR, no carry: 1 ⊕ 1 = 0, 1 ⊕ 0 = 1, 0 ⊕ 1 = 1, 1 ⊕ 1 = 0, so 0110. In ordinary arithmetic the answer would be 11000; modulo 2 never carries."
  },
  {
    "q": "Multiply 1011 × 0110 in modulo 2. Type the bits without spaces.",
    "type": "text",
    "answer": ["111010", "0111010"],
    "explain": "0110 has 1s in its 2s and 4s places, so XOR 1011 shifted once and 1011 shifted twice: 10110 ⊕ 101100 = 111010. Written in seven digits as the 07c note does, 0111010; both are accepted."
  },
  {
    "q": "A CRC code has k = 5 and n = 8. How many bits does its divisor have?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Size of divisor = n − k + 1 = 8 − 5 + 1 = 4 bits."
  },
  {
    "q": "Same code, k = 5 and n = 8. How many bits does the remainder have?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Size of remainder = n − k = 8 − 5 = 3 bits, which is also the number of 0s appended to the dataword."
  },
  {
    "q": "Rotate the C(7, 4) codeword 0100111 left by one place. Type the bits without spaces.",
    "type": "text",
    "answer": ["1001110"],
    "explain": "The leftmost 0 moves to the right end: 100111 followed by 0 = 1001110. It is in the slide-34 table as the codeword of 1001, as a cyclic code requires."
  }
]
```

```quiz
[
  {
    "q": "In the C(7, 4) CRC, how many bits does the divisor have?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Size of divisor = n − k + 1 = 7 − 4 + 1 = 4 bits. The table's divisor is 1011."
  },
  {
    "q": "In the C(7, 4) CRC, how many bits does the remainder have?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Size of remainder = n − k = 7 − 4 = 3 bits: r2 r1 r0 on slide 37."
  },
  {
    "q": "In the C(7, 4) CRC, how many 0s are appended to the dataword before the division?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "n − k = 3 zeros, one for each remainder bit: the encoder divides 1001000 for dataword 1001."
  },
  {
    "q": "A cyclic code is a linear block code.",
    "type": "tf",
    "answer": true,
    "explain": "Cyclic codes are special linear block codes with one extra property: if a codeword is cyclically shifted (rotated), the result is another codeword."
  },
  {
    "q": "The CRC decoder's syndrome is 000. What does that mean?",
    "options": ["Either no bit is corrupted, or the decoder failed to detect any errors", "No bit is corrupted", "Exactly one bit is corrupted", "The dataword is discarded"],
    "answer": 0,
    "explain": "Slide 37: if syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors. A corrupted word that is still a valid codeword, such as 0010110 received for 1001110, gives syndrome 000."
  },
  {
    "q": "From the slide-34 table, what is the CRC codeword of dataword 0110? Type the bits without spaces.",
    "type": "text",
    "answer": ["0110001"],
    "explain": "Dataword 0110 followed by the remainder 001: 0110001. It is also the left rotation of 1011000, the slide-33 example."
  },
  {
    "q": "In modulo-2 subtraction, 0 − 1 borrows from the next digit.",
    "type": "tf",
    "answer": false,
    "explain": "Numbers are not carried or borrowed. Subtraction is XOR on each digit, so 0 − 1 = 1 with nothing borrowed."
  },
  {
    "q": "Where is the CRC used, according to the slides?",
    "options": ["In LANs and WANs", "Only at the transport layer", "Only in real-time multimedia", "Only in software"],
    "answer": 0,
    "explain": "Our focus: a subset of cyclic codes called Cyclic Redundancy Check (CRC), which is used in LANs and WANs. Cyclic codes can be implemented in hardware and software, and are especially fast in hardware."
  }
]
```
