---
title: "Checksum: one's complement, wrapping in binary and hex"
minutes: 22
---

A checksum protects a message with one extra word: the sender adds the words, wraps and complements the sum, and the receiver repeats the sum with that word included. The arithmetic is one's complement, and it is done by hand in binary, decimal or hex.

## A checksum works on a message of any length

Slides 41 and 42: *An error-detecting technique that can be applied to a message of any length. Mostly used at the network and transport layers rather than the data-link layer.*

In the slide-42 figure the sender's message is a row of m-bit words. A Generator appends one more m-bit word, the checksum, giving *Message plus checksum*. The receiver's Checker turns all the words into one m-bit result; if it is *All 0's* the message is accepted, otherwise it is discarded.

## Sending the plain sum needs more than 4 bits

Slide 43: *Suppose the message is a list of five 4-bit numbers that we want to send to a destination (7, 11, 12, 0, 6): In addition to sending these numbers, we send the sum of the numbers. E.g., we send (7, 11, 12, 0, 6, 36), where 36 is the sum of the original numbers.* The receiver adds the five numbers and compares the result with the sum; if they are the same it accepts the five numbers and discards the sum.

Slide 44 names the problem: *Each number can be written as a 4-bit word (each is less than 15) except for the sum. Solution: Use one's complement arithmetic.* Every number up to 15 fits in 4 bits (1111), but 36 = 100100 needs 6.

## One's complement: wrap, complement, two zeros

Slide 47: *Unsigned numbers between 0 and 2^m−1 are represented using only m bits.* With m = 4 that is 0 to 15.

**Wrapping.** *If the number has more than m bits, the extra leftmost bits need to be added to the m rightmost bits (wrapping).* The slide's example: 36 = 100100, so (10)₂ + (0100)₂ = (0110)₂ = 6. In decimal, 2 + 4 = 6.

**Complement.** *The complement of a number is found by changing all 1s to 0s and all 0s to 1s. The same as subtracting the number from 2^m−1.* The complement of 6 = 0110 is 1001 = 9, and 15 − 6 = 9.

**Two zeros.** *In one's complement arithmetic, we have two 0s: one positive and one negative, which are complements of each other.* With 4 bits the positive zero is 0000 and the negative zero is 1111 (2^m − 1 = 15).

## The slide example, sender and receiver

Slide 49, both halves:

| | Sender | Receiver |
|---|---|---|
| words | 7, 11, 12, 0, 6 | 7, 11, 12, 0, 6 |
| checksum word | *Initialized checksum* 0000 = 0 | *Received Checksum* 1001 = 9 |
| raw sum | 36 = (100100)₂ | 36 + 9 = 45 = (101101)₂ |
| wrap | (10)₂ + (0100)₂ = (0110)₂ = 6 | (10)₂ + (1101)₂ = (1111)₂ = 15 |
| complement | *Actual checksum* 1001 = 9 | *Calculated Checksum* 0000 = 0 |

The *Packet* sent is 7, 11, 12, 0, 6, 9. The receiver's calculated checksum is 0, so it accepts. An error-free packet always sums to the negative zero 1111, whose complement is 0000.

```widget
checksum-calc
{ "words": "7 11 12 0 6", "base": "dec", "m": 4, "side": "sender" }
```

## Wrap again until the sum fits

A wrap can overflow. Computed: the receiver gets 7, 11, 12, 0, 7, 9, one word corrupted. The sum is 46 = 101110; wrapping gives 10 + 1110 = 10000, still 5 bits, so wrap again: 1 + 0000 = 0001. The complement is 1110 = 14, not 0, so the packet is rejected.

## The Internet's 16-bit procedure

Slide 50: *Traditionally, the Internet has used a 16-bit checksum.*

| Sender | Receiver |
|---|---|
| 1. The message is divided into 16-bit words. | 1. The message and the checksum is received. |
| 2. The value of the checksum word is initially set to zero. | 2. The message is divided into 16-bit words. |
| 3. All words including the checksum are added using one's complement addition. | 3. All words are added using one's complement addition. |
| 4. The sum is complemented and becomes the checksum. | 4. The sum is complemented and becomes the new checksum. |
| 5. The checksum is sent with the data. | 5. If the value of the checksum is 0, the message is accepted; otherwise, it is rejected. |

## Wrapping in hex

No slide works a hex checksum; this method is derived from the binary rules. One hex digit is 4 bits, so a 16-bit word is four hex digits.

- Add the words in hex. Any digit left of the word's width is the carry.
- Wrap: add the carry to the rightmost digits. Repeat if a new carry appears.
- Complement: replace every digit d by F − d, the same as FFFF − sum.

The slide example in hex: 7 + B + C + 0 + 6 = 0x24. With 4-bit words one hex digit is one word, so the wrap is 2 + 4 = 6 and the complement F − 6 = 9.

A textbook example (Forouzan), recomputed: the text "Forouzan" as 16-bit ASCII pairs.

| Step | Value |
|---|---|
| words | 466F (Fo), 726F (ro), 757A (uz), 616E (an) |
| raw sum | 0x18FC6 |
| wrap | 8FC6 + 1 = 0x8FC7 |
| complement | F − 8, F − F, F − C, F − 7 = 0x7038 |
| receiver | 466F + 726F + 757A + 616E + 7038 = 0x1FFFE → FFFE + 1 = 0xFFFF → complement 0x0000, accept |

```widget
checksum-calc
{ "words": "466F 726F 757A 616E", "base": "hex", "m": 16 }
```

## Compute three checksums

Wrap until the sum fits in m bits, then complement. Hex answers are accepted with or without 0x.

```quiz
[
  {
    "q": "4-bit words 5, 9, 14, 3, 10. What is the checksum? Type it in binary (4 bits) or decimal.",
    "type": "text",
    "answer": ["0100", "4"],
    "explain": "Sum 5 + 9 + 14 + 3 + 10 = 41 = 101001. Wrap: (10)₂ + (1001)₂ = (1011)₂ = 11. Complement: 0100 = 4 (15 − 11 = 4). Receiver check: 41 + 4 = 45 → 1111 → complement 0000, accept."
  },
  {
    "q": "8-bit words 10110011, 01101100, 11100101. What is the checksum? Type the bits without spaces.",
    "type": "text",
    "answer": ["11111001", "F9", "0xF9"],
    "explain": "In hex the words are B3, 6C, E5. Sum = 1000000100 (0x204). Wrap: 10 + 00000100 = 00000110 (0x06). Complement, flip every bit: 11111001 (0xF9)."
  },
  {
    "q": "16-bit hex words AB12, 9F34, 7C56. What is the checksum, in hex?",
    "type": "text",
    "answer": ["3962", "0x3962"],
    "explain": "AB12 + 9F34 + 7C56 = 0x1C69C. Wrap: C69C + 1 = 0xC69D. Complement digit by digit, F − C = 3, F − 6 = 9, F − 9 = 6, F − D = 2: 0x3962."
  },
  {
    "q": "The receiver gets AB12, 9F34, 7C56 and the checksum 3962. What is its wrapped sum, in hex?",
    "type": "text",
    "answer": ["FFFF", "0xFFFF"],
    "explain": "AB12 + 9F34 + 7C56 + 3962 = 0x1FFFE. Wrap: FFFE + 1 = 0xFFFF, the negative zero. Its complement is 0000, so the new checksum is 0."
  },
  {
    "q": "Same receiver: AB12, 9F34, 7C56 with checksum 3962. What does it decide?",
    "options": ["Accept: the new checksum is 0", "Reject: the sum is FFFF, not 0", "Reject: the sum overflowed 16 bits", "Accept: the sum equals the checksum"],
    "answer": 0,
    "explain": "Slide 50, receiver step 5: if the value of the checksum is 0, the message is accepted. The wrapped sum FFFF complements to 0000. A carry out of 16 bits is normal; it is wrapped back in."
  }
]
```

```quiz
[
  {
    "q": "Wrap 36 into a 4-bit one's complement number. What is it in decimal?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "explain": "36 = 100100. The extra leftmost bits 10 are added to the 4 rightmost bits 0100: (10)₂ + (0100)₂ = (0110)₂ = 6."
  },
  {
    "q": "What is the 4-bit one's complement of 6, in decimal?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "explain": "Flip 0110 to 1001 = 9, or subtract from 2^4 − 1: 15 − 6 = 9. It is the slide-49 checksum."
  },
  {
    "q": "The slide-49 receiver gets 7, 11, 12, 0, 6 and checksum 9. What is its calculated checksum, in decimal?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "36 + 9 = 45 = 101101. Wrap: (10)₂ + (1101)₂ = (1111)₂ = 15. Complement of 15 is 0 = 0000."
  },
  {
    "q": "With that calculated checksum, what does the slide-49 receiver do?",
    "options": ["Accepts the message", "Rejects the message", "Asks for the checksum again", "Corrects the corrupted word"],
    "answer": 0,
    "explain": "The calculated checksum is 0 (All 0's), so the message is accepted. The checksum only detects errors; it does not correct them."
  },
  {
    "q": "In one's complement arithmetic there is only one zero.",
    "type": "tf",
    "answer": false,
    "explain": "In one's complement arithmetic, we have two 0s: the positive zero 0000 and the negative zero 1111 (2^m − 1), which are complements of each other."
  },
  {
    "q": "What is the negative zero in 4-bit one's complement? Type the bits without spaces.",
    "type": "text",
    "answer": ["1111"],
    "explain": "The negative zero has all bits set to 1 (it is 2^m − 1 = 15): 1111. The positive zero is 0000."
  },
  {
    "q": "8-bit hex words 3F, A7, E2. What is the checksum, in hex?",
    "type": "text",
    "answer": ["36", "0x36"],
    "explain": "3F + A7 + E2 = 0x1C8. Wrap: C8 + 1 = 0xC9. Complement, F − C = 3 and F − 9 = 6: 0x36. Check: 3F + A7 + E2 + 36 = 0x1FE → FE + 1 = FF → complement 00."
  },
  {
    "q": "16-bit hex words FFFF, FFFF, FFFF, 0002. What is the checksum, in hex?",
    "type": "text",
    "answer": ["FFFD", "0xFFFD"],
    "explain": "Sum = 0x2FFFF. Wrap: FFFF + 2 = 0x10001, which overflows again, so wrap again: 0001 + 1 = 0x0002. Complement: FFFF − 0002 = 0xFFFD."
  },
  {
    "q": "At which layers is the checksum mostly used?",
    "options": ["Network and transport", "Data-link only", "Physical and data-link", "Application only"],
    "answer": 0,
    "explain": "Slide 41: mostly used at the network and transport layers rather than the data-link layer. The data-link layer uses the CRC."
  },
  {
    "q": "Put the sender's steps of the traditional 16-bit checksum in order (slide 50).",
    "type": "reorder",
    "lines": [
      "The message is divided into 16-bit words.",
      "The value of the checksum word is initially set to zero.",
      "All words including the checksum are added using one's complement addition.",
      "The sum is complemented and becomes the checksum.",
      "The checksum is sent with the data."
    ],
    "explain": "Divide into 16-bit words, set the checksum word to 0, add everything in one's complement (wrapping), complement the sum, send the checksum with the data."
  }
]
```
