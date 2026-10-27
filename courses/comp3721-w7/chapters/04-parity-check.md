---
title: Linear block codes and the parity-check code C(5, 4)
minutes: 18
---

The simplest code adds one bit. It catches every single-bit error and misses every 2-bit error, and both facts follow from its minimum distance of 2.

## Linear block codes: the XOR of two valid codewords is a valid codeword

Slide 23:

- *Almost all block codes used today belong to a subset of block codes called linear block codes.*
- *The use of nonlinear block codes for error detection and correction is not as widespread because their structure makes theoretical analysis and implementation difficult.*
- *The formal definition of linear block codes requires the knowledge of abstract algebra (particularly Galois fields). → beyond our scope*
- *Informal Definition for our purpose: a linear block code is a code in which the XOR (addition modulo-2) of two valid codewords creates another valid codeword.*

A check on the C(5, 4) table below: 00011 (dataword 0001) ⊕ 00101 (dataword 0010) = 00110, the codeword of 0011. The C(7, 4) CRC table passes the same test (1001110 ⊕ 1011000 = 0010110, the codeword of 0010).

## Parity-check code: n = k + 1 and an even number of 1s

Slide 25: *Parity-check code is a linear block code. A k-bit dataword is changed to an n-bit codeword where n = k + 1. Parity bit: The extra bit and it is selected such that the total number of 1s in the codeword becomes even (We only consider even parity here, while some implementations specify an odd number of 1s).*

And its power: *The minimum Hamming distance for this category is dmin = 2, which means that the code is a single-bit error-detecting code.* From the Hamming-distance rules, $d_{min}$ = 2 detects 2 − 1 = 1 error and corrects ⌊1/2⌋ = 0.

## Simple parity catches any odd number of errors

Slide 26: *The simple parity check, guaranteed to detect one single error, and can also find any odd number of errors.* Its example uses a 5-bit dataword, so it is a different parity code from C(5, 4), still with even parity:

- *the dataword is 10001 and the codeword 100010 is generated using even parity bit of 0 (added to the dataword as the rightmost bit).* 10001 has two 1s, already even, so the parity bit is 0.
- *the computer receives the incorrect data 011010*. *This codeword has odd parity (the number of 1s = 3), therefore, the codeword is corrupted.*

The slide does not say so, but 100010 ⊕ 011010 = 111000: three bits flipped. Each flip changes the count of 1s by one, so an odd number of flips leaves the count odd and is caught. An even number of flips leaves it even and passes.

## The C(5, 4) table

Slide 27, *Simple Parity-Check Code – C(5, 4)*, *n=5, k=4 (even parity)*. The parity bit is the last bit of each codeword.

| Dataword | Codeword | Dataword | Codeword |
|---|---|---|---|
| 0000 | 0000**0** | 1000 | 1000**1** |
| 0001 | 0001**1** | 1001 | 1001**0** |
| 0010 | 0010**1** | 1010 | 1010**0** |
| 0011 | 0011**0** | 1011 | 1011**1** |
| 0100 | 0100**1** | 1100 | 1100**0** |
| 0101 | 0101**0** | 1101 | 1101**1** |
| 0110 | 0110**0** | 1110 | 1110**1** |
| 0111 | 0111**1** | 1111 | 1111**0** |

## Encoder r0 and decoder syndrome s0

Slides 28 to 30: *The calculation is done in modular arithmetic.* The encoder computes the parity bit and the decoder computes the syndrome:

$$r_0 = a_3 + a_2 + a_1 + a_0 \ (\text{mod } 2) \qquad s_0 = b_3 + b_2 + b_1 + b_0 + q_0 \ (\text{mod } 2)$$

In the slide-30 figure, the sender's generator adds the four data bits a3 to a0 to make r0, and the codeword a3 a2 a1 a0 r0 crosses to the receiver. There the checker adds all five received bits b3 b2 b1 b0 q0 into the syndrome s0, and the decision logic either accepts b3 to b0 as the dataword or discards them. The caption: *If the syndrome is 0, there is no detectable error in the received codeword.*

Dataword 1011: r0 = 1 + 0 + 1 + 1 = 3, and 3 mod 2 = 1, so the codeword is 10111 (the table row). Three possible arrivals:

| Received | s0 = sum of the five bits mod 2 | Decision |
|---|---|---|
| 10111 | 1 + 0 + 1 + 1 + 1 = 4 → 0 | accept 1011: no error |
| 10011 | 1 + 0 + 0 + 1 + 1 = 3 → 1 | discard: a single-bit error, detected |
| 11011 | 1 + 1 + 0 + 1 + 1 = 4 → 0 | accept 1101: a 2-bit error, undetected |

The last row is why the caption says "no detectable error" and not "no error": 11011 is itself a valid codeword.

### The syndrome s0

The widget starts with bit 2 of 10111 flipped, so 11111 arrives and the sum gives s0 = 1. Flip bit 3 as well and s0 returns to 0 on the wrong dataword.

```widget
codeword-lab
{ "code": "parity-5-4", "mode": "send", "send": "1011", "flips": [2] }
```

## Add the parity bit, then check what arrives

Count the 1s. Sender: the parity bit makes the count even. Receiver: s0 is the count mod 2.

```quiz
[
  {
    "q": "Even parity: the 7-bit dataword is 1011010. Type the 8-bit codeword (the bits without spaces).",
    "type": "text",
    "answer": ["10110100"],
    "explain": "1 + 0 + 1 + 1 + 0 + 1 + 0 = 4, already even, so the parity bit is 0, added as the rightmost bit: 10110100."
  },
  {
    "q": "Even parity: the 7-bit dataword is 1110011. Type the 8-bit codeword (the bits without spaces).",
    "type": "text",
    "answer": ["11100111"],
    "explain": "1 + 1 + 1 + 0 + 0 + 1 + 1 = 5, odd, so the parity bit is 1 to make six 1s: 11100111."
  },
  {
    "q": "Even parity: the 6-bit codeword 110011 arrives. Type the syndrome bit s0.",
    "type": "text",
    "answer": ["0"],
    "explain": "1 + 1 + 0 + 0 + 1 + 1 = 4, and 4 mod 2 = 0. Syndrome 0: no detectable error, accept the dataword 11001."
  },
  {
    "q": "Even parity: the 7-bit codeword 0111011 arrives. Type the syndrome bit s0.",
    "type": "text",
    "answer": ["1"],
    "explain": "0 + 1 + 1 + 1 + 0 + 1 + 1 = 5, and 5 mod 2 = 1."
  },
  {
    "q": "So what does the receiver do with 0111011?",
    "options": ["Discards it: the syndrome is 1, odd parity", "Accepts the dataword 011101", "Accepts it and corrects the parity bit", "Accepts it: the syndrome is 0"],
    "answer": 0,
    "explain": "Five 1s is odd parity, s0 = 1, so the codeword is corrupted and discarded. A $d_{min}$ = 2 code cannot correct: it cannot tell which bit flipped."
  }
]
```

```quiz
[
  {
    "q": "C(5, 4), even parity: type the codeword for the dataword 0110 (the bits without spaces).",
    "type": "text",
    "answer": ["01100"],
    "explain": "r0 = 0 + 1 + 1 + 0 = 2, and 2 mod 2 = 0: codeword 01100."
  },
  {
    "q": "C(5, 4), even parity: type the codeword for the dataword 1101 (the bits without spaces).",
    "type": "text",
    "answer": ["11011"],
    "explain": "r0 = 1 + 1 + 0 + 1 = 3, and 3 mod 2 = 1: codeword 11011."
  },
  {
    "q": "C(5, 4): 01101 arrives. Type the syndrome bit s0.",
    "type": "text",
    "answer": ["1"],
    "explain": "s0 = 0 + 1 + 1 + 0 + 1 = 3, and 3 mod 2 = 1: the codeword is discarded."
  },
  {
    "q": "The simple parity check detects every 2-bit error.",
    "type": "tf",
    "answer": false,
    "explain": "It is guaranteed to detect one single error and can also find any odd number of errors. Two flips keep the number of 1s even, so the syndrome is 0: sent 10111, received 11011 is accepted as 1101."
  },
  {
    "q": "The parity-check code has dmin = 2. What does that mean?",
    "options": ["It is a single-bit error-detecting code", "It corrects any single-bit error", "It detects every 2-bit error", "It detects up to 2 errors and corrects 1"],
    "answer": 0,
    "explain": "Slide 25: dmin = 2, which means that the code is a single-bit error-detecting code. It detects $d_{min} - 1 = 1$ error and corrects ⌊1/2⌋ = 0."
  },
  {
    "q": "What is the name of s0, the bit the parity decoder computes from all five received bits?",
    "type": "text",
    "answer": ["syndrome", "the syndrome"],
    "explain": "The syndrome: s0 = b3 + b2 + b1 + b0 + q0 (modulo-2). If the syndrome is 0, there is no detectable error in the received codeword."
  },
  {
    "q": "Slide 26: the codeword 100010 is sent and 011010 arrives. Why does the receiver reject it?",
    "options": ["It has odd parity: the number of 1s is 3", "It differs from 100010 in exactly one bit", "It has even parity but the wrong parity bit", "The receiver compares it with the sent codeword 100010"],
    "answer": 0,
    "explain": "This codeword has odd parity (the number of 1s = 3), therefore the codeword is corrupted. The receiver never sees the sent word; it only counts the 1s. Three bits flipped (100010 ⊕ 011010 = 111000), an odd number, which is why it was caught."
  },
  {
    "q": "The parity-check code is a linear block code.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 25: Parity-check code is a linear block code. The XOR of two C(5, 4) codewords, such as 00011 ⊕ 00101 = 00110, is another codeword."
  },
  {
    "q": "Which parity does the slide use for the parity bit?",
    "options": ["Even: the total number of 1s in the codeword becomes even", "Odd: the total number of 1s in the codeword becomes odd", "Either, chosen for each codeword", "Even for the C(5, 4) table, odd for the slide-26 example"],
    "answer": 0,
    "explain": "Slide 25: we only consider even parity here, while some implementations specify an odd number of 1s. The C(5, 4) table and the slide-26 example (10001 → 100010) both use even parity."
  }
]
```
