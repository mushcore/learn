---
title: "Review 3b: CRC: modulo-2 division by hand"
minutes: 20
---
This lesson teaches the CRC long division the exam asks you to write out row by row. It prepares you to find the sender's remainder and the receiver's syndrome, then say accept or discard.

## What a CRC is, in plain words

The sender and the receiver agree on one short bit pattern in advance. That pattern is the *divisor*, and slide 37 marks it *Shared*.

The sender divides its data by the divisor and keeps only the leftover, the *remainder*. It sends the data with the remainder stuck on the end, and that whole block is the *codeword*.

The codeword is built so it divides by the divisor with nothing left over. The receiver divides again: a leftover of zero means accept, anything else means discard.

The receiver's leftover has its own name, the *syndrome*. The sender's answer of the division, the quotient, is thrown away.

```diagram
{ "type": "flow", "dir": "tb", "title": "Slide 38 and slide 40 as one chain", "nodes": [
  { "id": "d", "label": "dataword 1001" }, { "id": "z", "label": "append 000", "sub": "1001000" }, { "id": "r", "label": "÷ 1011", "sub": "remainder 110" }, { "id": "c", "label": "codeword", "sub": "1001110" }, { "id": "x", "label": "receiver ÷ 1011", "sub": "syndrome 000" }, { "id": "a", "label": "accept", "kind": "pill" }
], "edges": [ { "from": "d", "to": "z" }, { "from": "z", "to": "r" }, { "from": "r", "to": "c" }, { "from": "c", "to": "x", "label": "link" }, { "from": "x", "to": "a" } ], "hi": ["c", "a"], "caption": "The sender appends the remainder 110 to 1001. The receiver divides 1001110 by the same 1011 and gets 000, so it accepts." }
```

## XOR instead of subtraction

The division works *in modulo 2*. Each bit is handled on its own, with no carry and no borrow.

So subtracting one bit from another is XOR. Equal bits give 0, different bits give 1.

```diagram
{ "type": "grid", "title": "Modulo-2 subtraction is XOR", "nodes": [
  { "id": "g00", "label": "a − b", "row": 0, "col": 0 }, { "id": "g01", "label": "b = 0", "row": 0, "col": 1 }, { "id": "g02", "label": "b = 1", "row": 0, "col": 2 },
  { "id": "g10", "label": "a = 0", "row": 1, "col": 0 }, { "id": "g11", "label": "0", "row": 1, "col": 1 }, { "id": "g12", "label": "1, no borrow", "row": 1, "col": 2 },
  { "id": "g20", "label": "a = 1", "row": 2, "col": 0 }, { "id": "g21", "label": "1", "row": 2, "col": 1 }, { "id": "g22", "label": "0", "row": 2, "col": 2 }
], "hi": ["g12"], "caption": "0 − 1 gives 1 with nothing borrowed: one bit never touches its neighbour." }
```

One row of the slide's division shows it. The window 1001 starts with 1, so it is XORed with the divisor.

$$1001 ⊕ 1011 = 0010$$

## A tiny case you can do in your head

Take the two-bit dataword 11 and the three-bit divisor 101. The divisor has 3 bits, so append 2 zeros.

$$\text{dividend} = 11 \,|\, 00 = 1100$$

Step 1: the window is the first three bits, 110. Its leftmost bit is 1, so XOR the divisor.

$$110 ⊕ 101 = 011$$

Drop the leading 0 and bring down the last dividend bit, a 0.

$$\text{next window} = 110$$

Step 2: the leftmost bit is 1 again.

$$110 ⊕ 101 = 011 \Rightarrow \text{remainder} = \mathbf{11}$$

$$\text{codeword} = 11 \,|\, 11 = \mathbf{1111}$$

Check at the receiver: 111 ⊕ 101 = 010, bring down 1 to get 101, then 101 ⊕ 101 = 000. Syndrome 00, so the codeword divides evenly, as it was built to.

## The recipe, with each symbol named

$$\text{divisor} = n - k + 1 \text{ bits} \qquad \text{remainder} = n - k \text{ bits} \qquad \text{zeros appended} = n - k$$

- k is the dataword length, n the codeword length.
- The window is as long as the divisor.
- Leftmost bit 1: quotient bit 1, XOR the divisor.
- Leftmost bit 0: quotient bit 0, XOR all zeros. The slide writes *Leftmost bit 0: use 0000 divisor*.
- After each XOR, drop the leading bit and bring down the next dividend bit.

The trap is the leading zero. A remainder such as 011 keeps all three bits, or the codeword comes out one bit short.

## The slide's division, worked

Slide 38: dataword 1001, divisor 1011, so n − k = 3 and the dividend is 1001 000.

```diagram
{ "type": "grid", "title": "Slide 38: 1001000 ÷ 1011", "nodes": [
  { "id": "h0", "label": "step", "row": 0, "col": 0 }, { "id": "h1", "label": "window", "row": 0, "col": 1 }, { "id": "h2", "label": "XOR with", "row": 0, "col": 2 }, { "id": "h3", "label": "result → next", "row": 0, "col": 3 },
  { "id": "r10", "label": "1", "row": 1, "col": 0 }, { "id": "r11", "label": "1001", "row": 1, "col": 1 }, { "id": "r12", "label": "1011 (q 1)", "row": 1, "col": 2 }, { "id": "r13", "label": "0010 → 0100", "row": 1, "col": 3 },
  { "id": "r20", "label": "2", "row": 2, "col": 0 }, { "id": "r21", "label": "0100", "row": 2, "col": 1 }, { "id": "r22", "label": "0000 (q 0)", "row": 2, "col": 2 }, { "id": "r23", "label": "0100 → 1000", "row": 2, "col": 3 },
  { "id": "r30", "label": "3", "row": 3, "col": 0 }, { "id": "r31", "label": "1000", "row": 3, "col": 1 }, { "id": "r32", "label": "1011 (q 1)", "row": 3, "col": 2 }, { "id": "r33", "label": "0011 → 0110", "row": 3, "col": 3 },
  { "id": "r40", "label": "4", "row": 4, "col": 0 }, { "id": "r41", "label": "0110", "row": 4, "col": 1 }, { "id": "r42", "label": "0000 (q 0)", "row": 4, "col": 2 }, { "id": "r43", "label": "0110: remainder 110", "row": 4, "col": 3 }
], "hi": ["r43"], "caption": "Four steps for four dataword bits. Quotient 1010 is discarded; codeword = 1001 followed by 110." }
```

$$\text{codeword} = 1001 \,|\, 110 = \mathbf{1001110}$$

Check: that is the slide-34 table row for 1001.

## The receiver's check

The receiver divides the whole received word by the same divisor. It appends no zeros this time.

Slide 40 shows both outcomes. 1001110 gives syndrome 000, *Dataword accepted*. 1000110, with one bit flipped, gives a non-zero syndrome.

```diagram
{ "type": "grid", "title": "Slide 40: received 1000110 ÷ 1011", "nodes": [
  { "id": "h0", "label": "step", "row": 0, "col": 0 }, { "id": "h1", "label": "window", "row": 0, "col": 1 }, { "id": "h2", "label": "XOR with", "row": 0, "col": 2 }, { "id": "h3", "label": "result → next", "row": 0, "col": 3 },
  { "id": "r10", "label": "1", "row": 1, "col": 0 }, { "id": "r11", "label": "1000", "row": 1, "col": 1 }, { "id": "r12", "label": "1011 (q 1)", "row": 1, "col": 2 }, { "id": "r13", "label": "0011 → 0111", "row": 1, "col": 3 },
  { "id": "r20", "label": "2", "row": 2, "col": 0 }, { "id": "r21", "label": "0111", "row": 2, "col": 1 }, { "id": "r22", "label": "0000 (q 0)", "row": 2, "col": 2 }, { "id": "r23", "label": "0111 → 1111", "row": 2, "col": 3 },
  { "id": "r30", "label": "3", "row": 3, "col": 0 }, { "id": "r31", "label": "1111", "row": 3, "col": 1 }, { "id": "r32", "label": "1011 (q 1)", "row": 3, "col": 2 }, { "id": "r33", "label": "0100 → 1000", "row": 3, "col": 3 },
  { "id": "r40", "label": "4", "row": 4, "col": 0 }, { "id": "r41", "label": "1000", "row": 4, "col": 1 }, { "id": "r42", "label": "1011 (q 1)", "row": 4, "col": 2 }, { "id": "r43", "label": "0011: syndrome 011", "row": 4, "col": 3 }
], "hi": ["r43"], "caption": "The dividend is the received word itself. Syndrome 011 is non-zero, so the dataword is discarded." }
```

$$\text{syndrome} = \mathbf{011} \ne 000 \Rightarrow \text{discard}$$

Slide 37 warns about the zero case: *If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.*

## A new division: a game packet

Take a 6-bit dataword 110101 cut from a game packet, with divisor 1011. Then n − k = 3, so append 000 and run six steps.

```diagram
{ "type": "grid", "title": "New: 110101000 ÷ 1011", "nodes": [
  { "id": "h0", "label": "step", "row": 0, "col": 0 }, { "id": "h1", "label": "window", "row": 0, "col": 1 }, { "id": "h2", "label": "XOR with", "row": 0, "col": 2 }, { "id": "h3", "label": "result → next", "row": 0, "col": 3 },
  { "id": "r10", "label": "1", "row": 1, "col": 0 }, { "id": "r11", "label": "1101", "row": 1, "col": 1 }, { "id": "r12", "label": "1011 (q 1)", "row": 1, "col": 2 }, { "id": "r13", "label": "0110 → 1100", "row": 1, "col": 3 },
  { "id": "r20", "label": "2", "row": 2, "col": 0 }, { "id": "r21", "label": "1100", "row": 2, "col": 1 }, { "id": "r22", "label": "1011 (q 1)", "row": 2, "col": 2 }, { "id": "r23", "label": "0111 → 1111", "row": 2, "col": 3 },
  { "id": "r30", "label": "3", "row": 3, "col": 0 }, { "id": "r31", "label": "1111", "row": 3, "col": 1 }, { "id": "r32", "label": "1011 (q 1)", "row": 3, "col": 2 }, { "id": "r33", "label": "0100 → 1000", "row": 3, "col": 3 },
  { "id": "r40", "label": "4", "row": 4, "col": 0 }, { "id": "r41", "label": "1000", "row": 4, "col": 1 }, { "id": "r42", "label": "1011 (q 1)", "row": 4, "col": 2 }, { "id": "r43", "label": "0011 → 0110", "row": 4, "col": 3 },
  { "id": "r50", "label": "5", "row": 5, "col": 0 }, { "id": "r51", "label": "0110", "row": 5, "col": 1 }, { "id": "r52", "label": "0000 (q 0)", "row": 5, "col": 2 }, { "id": "r53", "label": "0110 → 1100", "row": 5, "col": 3 },
  { "id": "r60", "label": "6", "row": 6, "col": 0 }, { "id": "r61", "label": "1100", "row": 6, "col": 1 }, { "id": "r62", "label": "1011 (q 1)", "row": 6, "col": 2 }, { "id": "r63", "label": "0111: remainder 111", "row": 6, "col": 3 }
], "hi": ["r63"], "caption": "The brought-down bits are the dataword's last bits, then the three appended zeros. Quotient 111101, discarded." }
```

$$\text{codeword} = 110101 \,|\, 111 = \mathbf{110101111}$$

Check: the receiver divides 110101111 by 1011 and gets syndrome 000, so it accepts. If the third bit flips in transit, 111101111 gives syndrome 101, so it discards.

Call each quotient bit before the widget draws it.

```widget
crc-play
{ "dataword": "110101", "divisor": "1011", "mode": "encode", "predict": true, "title": "110101 ÷ 1011, one quotient bit per step" }
```

## Try it

Write every XOR row on paper, the way the grids above do, then type the bits.

```quiz
[
  {
    "q": "Dataword 1110, divisor 1011 (C(7,4)). Give the 3-bit CRC remainder.",
    "type": "text",
    "answer": ["100"],
    "explain": "Rule: append n − k = 3 zeros, so the dividend is 1110000.\nRows: 1110 ⊕ 1011 = 0101 → 1010; 1010 ⊕ 1011 = 0001 → 0010; leftmost 0: 0010 ⊕ 0000 = 0010 → 0100; leftmost 0: 0100 ⊕ 0000 = 0100.\nAnswer: remainder 100, codeword 1110100 (quotient 1100, discarded).\nCheck: the slide-34 table row for 1110 is 1110100."
  },
  {
    "q": "The game server receives 1101011 on the C(7,4) code with divisor 1011. Give the syndrome.",
    "type": "text",
    "answer": ["010"],
    "explain": "Rule: divide the whole received word, no zeros added.\nRows: 1101 ⊕ 1011 = 0110 → 1100; 1100 ⊕ 1011 = 0111 → 1111; 1111 ⊕ 1011 = 0100 → 1001; 1001 ⊕ 1011 = 0010.\nAnswer: syndrome 010, non-zero, so the dataword is discarded.\nCheck: the valid codeword for 1101 is 1101001, and the received word differs from it in one bit."
  },
  {
    "q": "A CRC uses the 5-bit divisor 11001. How many bits long is the remainder?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: divisor = n − k + 1 bits, remainder = n − k bits.\nSubstitution: n − k + 1 = 5 bits, so n − k = 5 − 1.\nAnswer: the remainder is 4 bits, and 4 zeros are appended.\nCheck: the remainder is always one bit shorter than the divisor, as 110 is for 1011."
  },
  {
    "q": "During the encoder's division, the leftmost bit of the current window is 0. What does the encoder do?",
    "options": ["Uses the 0000 divisor and writes quotient bit 0", "Uses the divisor 1011 and writes quotient bit 1", "Stops: the remainder is found", "Skips the bit and discards the dataword"],
    "answer": 0,
    "explain": "Rule: slide 38, Leftmost bit 0: use 0000 divisor.\nSubstitution: in the slide-38 division, 0100 ⊕ 0000 = 0100.\nAnswer: it XORs 0000, writes quotient bit 0 and brings down the next bit.\nCheck: the slide-38 quotient 1010 has a 0 for each such step."
  },
  {
    "q": "A syndrome of 000 proves that no bit was corrupted.",
    "type": "tf",
    "answer": false,
    "explain": "Rule: slide 37, if syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.\nSubstitution: a damaged word that is itself a valid codeword also divides evenly.\nAnswer: false. Zero means no detectable error, not no error.\nCheck: the same idea as an undetectable error in block coding: valid lands on valid."
  }
]
```

## Remember

- Leftmost bit 1: XOR the divisor. Leftmost bit 0: XOR all zeros. Then drop the leading bit and bring down the next.
- The sender appends n − k zeros. The receiver appends nothing and divides the whole word.
- *On the sheet:* Sheet side 4, "CRC and modulo-2 division (07a, 07c)".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "CRC", "divisor", "remainder" | append n − k zeros, modulo-2 division | n − k bits | codeword ÷ divisor gives 0 |
| "syndrome", "received" | divide the whole received word | n − k bits | 0 → accept, else discard |
