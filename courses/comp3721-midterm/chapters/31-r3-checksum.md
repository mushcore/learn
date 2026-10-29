---
title: "Review 3c: checksum: sum, wrap, complement, and FEC with XOR"
minutes: 20
---
This lesson teaches the checksum the exam asks you to compute by hand, with every wrap shown. It ends with one small way to rebuild a lost chunk using XOR.

## What a checksum is, in plain words

The sender adds up all the words of its message. It sends one extra word, the *checksum*, built from that sum.

The receiver adds up every word it gets, the checksum included. If the result works out to zero, nothing was changed on the way.

Slide 41 says the checksum works on *a message of any length*. It is *mostly used at the network and transport layers*.

```diagram
{ "type": "flow", "dir": "tb", "title": "The checksum from both ends", "nodes": [
  { "id": "w", "label": "words", "sub": "7, 11, 12, 0, 6" }, { "id": "s", "label": "add, wrap", "sub": "6" }, { "id": "c", "label": "complement", "sub": "checksum 9" }, { "id": "r", "label": "receiver adds all", "sub": "wraps to 15" }, { "id": "z", "label": "complement", "sub": "0: accept" }
], "edges": [ { "from": "w", "to": "s" }, { "from": "s", "to": "c" }, { "from": "c", "to": "r", "label": "send" }, { "from": "r", "to": "z" } ], "hi": ["c", "z"], "caption": "Slide 49: the sender's checksum is 9. The receiver's sum with the 9 complements to 0, so it accepts." }
```

## Why the sum wraps around

A 4-bit word holds only 0 to 15. The sum of several words is usually bigger and needs more bits.

One's complement fixes that by *wrapping*. The bits that stick out on the left are cut off and added to the 4 bits on the right.

```diagram
{ "type": "flow", "title": "Slide 47: wrapping 36 into 4 bits", "nodes": [
  { "id": "a", "label": "36 = 100100" }, { "id": "b", "label": "split", "sub": "10 | 0100" }, { "id": "c", "label": "10 + 0100" }, { "id": "d", "label": "0110 = 6" }
], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" } ], "hi": ["d"], "caption": "The two extra bits 10 are added to the rightmost four bits 0100, giving 0110 = 6." }
```

The *complement* then flips every bit. Flipping 4 bits is the same as subtracting from 15.

## A tiny case you can do in your head

Two 4-bit words, 9 and 8. Add them.

$$9 + 8 = 17 = 1\,0001$$

The leftmost 1 sticks out, so wrap it.

$$1 + 0001 = 0010 = 2$$

$$\text{checksum} = 15 - 2 = \mathbf{13} = 1101$$

The receiver adds all three words.

$$9 + 8 + 13 = 30 = 1\,1110 \to 1 + 1110 = 1111 = 15 \to 15 - 15 = \mathbf{0}$$

It makes sense: an undamaged message always wraps to all 1s, and all 1s complement to all 0s.

## The rules, with each symbol named

$$\text{wrapped sum} = \text{extra left bits} + \text{rightmost } m \text{ bits}$$

$$\text{checksum} = (2^m - 1) - \text{wrapped sum}$$

- m is the word size in bits, 4 on the slides and 16 on the Internet.
- $2^m - 1$ is the largest m-bit number: 15 for 4 bits, FFFF for 16 bits.
- The sender starts with the checksum word set to 0.
- The receiver accepts when its complemented result is 0.

The trap is stopping too early. If the wrap itself makes a new carry, wrap again until the sum fits.

## The slide's example, worked

Slide 49 sends five 4-bit words, 7, 11, 12, 0 and 6.

```diagram
{ "type": "grid", "title": "Slide 49: the words in columns", "nodes": [
  { "id": "h0", "label": "word", "row": 0, "col": 0 }, { "id": "h1", "label": "binary", "row": 0, "col": 1 },
  { "id": "a0", "label": "7", "row": 1, "col": 0 }, { "id": "a1", "label": "0111", "row": 1, "col": 1 },
  { "id": "b0", "label": "11", "row": 2, "col": 0 }, { "id": "b1", "label": "1011", "row": 2, "col": 1 },
  { "id": "c0", "label": "12", "row": 3, "col": 0 }, { "id": "c1", "label": "1100", "row": 3, "col": 1 },
  { "id": "d0", "label": "0", "row": 4, "col": 0 }, { "id": "d1", "label": "0000", "row": 4, "col": 1 },
  { "id": "e0", "label": "6", "row": 5, "col": 0 }, { "id": "e1", "label": "0110", "row": 5, "col": 1 },
  { "id": "f0", "label": "raw sum 36", "row": 6, "col": 0 }, { "id": "f1", "label": "10 0100", "row": 6, "col": 1 },
  { "id": "g0", "label": "wrapped", "row": 7, "col": 0 }, { "id": "g1", "label": "0110 = 6", "row": 7, "col": 1 },
  { "id": "k0", "label": "checksum", "row": 8, "col": 0 }, { "id": "k1", "label": "1001 = 9", "row": 8, "col": 1 }
], "hi": ["k1"], "caption": "The raw sum needs six bits. Wrapping gives 6, and the complement 15 − 6 gives the checksum 9." }
```

$$7 + 11 + 12 + 0 + 6 = 36 = 10\,0100 \to 10 + 0100 = 0110 = 6 \to 15 - 6 = \mathbf{9}$$

The packet sent is 7, 11, 12, 0, 6, 9. The receiver adds all six words.

$$36 + 9 = 45 = 10\,1101 \to 10 + 1101 = 1111 = 15 \to 15 - 15 = \mathbf{0} \Rightarrow \text{accept}$$

Now say the 6 arrives as 7. The sum is 46, and the first wrap still overflows.

$$46 = 10\,1110 \to 10 + 1110 = 1\,0000 \to 1 + 0000 = 0001 \to 15 - 1 = \mathbf{14} \Rightarrow \text{reject}$$

Check: 14 is not 0, so the damage is caught.

```widget
checksum-calc
{ "words": "7 11 12 0 6", "base": "dec", "m": 4, "side": "sender" }
```

## The same steps in hex

No slide works a hex checksum, but the method follows from the slides. One hex digit is 4 bits, so a 16-bit word is four digits.

The carry is whatever sits left of the four digits. The complement takes each digit d to F − d.

Take a Classic client packet as four 16-bit words: 2A01, 0007, 9C40, F1D3. The values are made up for practice.

```diagram
{ "type": "grid", "title": "16-bit checksum of a game packet (hex)", "nodes": [
  { "id": "h0", "label": "step", "row": 0, "col": 0 }, { "id": "h1", "label": "sender", "row": 0, "col": 1 }, { "id": "h2", "label": "receiver", "row": 0, "col": 2 },
  { "id": "a0", "label": "words", "row": 1, "col": 0 }, { "id": "a1", "label": "2A01 0007 9C40 F1D3", "row": 1, "col": 1 }, { "id": "a2", "label": "the same + 47E3", "row": 1, "col": 2 },
  { "id": "b0", "label": "raw sum", "row": 2, "col": 0 }, { "id": "b1", "label": "1B81B", "row": 2, "col": 1 }, { "id": "b2", "label": "1FFFE", "row": 2, "col": 2 },
  { "id": "c0", "label": "wrap", "row": 3, "col": 0 }, { "id": "c1", "label": "B81B + 1 = B81C", "row": 3, "col": 1 }, { "id": "c2", "label": "FFFE + 1 = FFFF", "row": 3, "col": 2 },
  { "id": "d0", "label": "complement", "row": 4, "col": 0 }, { "id": "d1", "label": "47E3 (checksum)", "row": 4, "col": 1 }, { "id": "d2", "label": "0000 → accept", "row": 4, "col": 2 }
], "hi": ["d1", "d2"], "caption": "Running sum: 2A01, 2A08, C648, 1B81B. The leading 1 is the carry that wraps." }
```

$$\text{2A01} + \text{0007} + \text{9C40} + \text{F1D3} = \text{1B81B} \to \text{B81B} + 1 = \text{B81C}$$

$$\text{checksum} = (F{-}B)(F{-}8)(F{-}1)(F{-}C) = \mathbf{47E3}$$

Check: if 0007 arrives as 0006, the receiver's sum wraps to FFFE. That complements to 0001, not 0, so it rejects.

## FEC with XOR, in one tiny case

*Forward error correction* rebuilds lost data at the receiver without asking for it again. Slide 51 says resending is too slow for *real-time multimedia*.

The XOR trick: cut a packet into N chunks and send one more chunk, R, the XOR of them all. If any one chunk is lost, XOR everything that arrived and the lost chunk comes back.

```diagram
{ "type": "grid", "title": "The opcode 2A01 as four chunks plus R", "nodes": [
  { "id": "h0", "label": "chunk", "row": 0, "col": 0 }, { "id": "h1", "label": "bits", "row": 0, "col": 1 },
  { "id": "a0", "label": "P1", "row": 1, "col": 0 }, { "id": "a1", "label": "0010", "row": 1, "col": 1 },
  { "id": "b0", "label": "P2 (lost)", "row": 2, "col": 0 }, { "id": "b1", "label": "1010", "row": 2, "col": 1 },
  { "id": "c0", "label": "P3", "row": 3, "col": 0 }, { "id": "c1", "label": "0000", "row": 3, "col": 1 },
  { "id": "d0", "label": "P4", "row": 4, "col": 0 }, { "id": "d1", "label": "0001", "row": 4, "col": 1 },
  { "id": "e0", "label": "R = P1 ⊕ … ⊕ P4", "row": 5, "col": 0 }, { "id": "e1", "label": "1001", "row": 5, "col": 1 }
], "hi": ["b1"], "caption": "R = 1001. With P2 lost, P1 ⊕ P3 ⊕ P4 ⊕ R gives back 1010." }
```

$$R = 0010 ⊕ 1010 ⊕ 0000 ⊕ 0001 = \mathbf{1001}$$

$$P2 = 0010 ⊕ 0000 ⊕ 0001 ⊕ 1001 = \mathbf{1010}$$

Only one lost chunk per group can be rebuilt. The extra data is one chunk in N, so slide 55's N = 4 costs a quarter, *25 percent extra data*.

```widget
fec-lab
{ "mode": "xor", "chunks": ["0010", "1010", "0000", "0001"], "lost": 1 }
```

## Try it

Write the raw sum, each wrap and the complement on their own lines.

```quiz
[
  {
    "q": "Four 4-bit words 9, 14, 5, 12 are sent with a one's-complement checksum. What is the checksum in decimal?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "unit": "",
    "explain": "Rule: sum, wrap until it fits in 4 bits, complement.\nSubstitution: 9 + 14 + 5 + 12 = 40 = 10 1000 → 10 + 1000 = 1010 = 10 → 15 − 10.\nAnswer: checksum 5 = 0101.\nCheck: the receiver adds 40 + 5 = 45 = 10 1101 → 10 + 1101 = 1111 → complement 0000, accept."
  },
  {
    "q": "A packet carries three 16-bit words 1234, F00D, BEEF (hex). Give the 16-bit checksum in hex.",
    "type": "text",
    "answer": ["3ECE", "0x3ECE"],
    "explain": "Rule: add in hex, wrap the carry, complement each digit as F − d.\nSubstitution: 1234 + F00D + BEEF = 1C130 → C130 + 1 = C131 → (F−C)(F−1)(F−3)(F−1).\nAnswer: checksum 3ECE.\nCheck: 1234 + F00D + BEEF + 3ECE = 1FFFE → FFFE + 1 = FFFF → complement 0000."
  },
  {
    "q": "The receiver adds every 4-bit word of a packet, the checksum included, and the wrapped sum is 1111. What does it decide?",
    "options": ["Accept: the complement of 1111 is 0000", "Reject: the sum is not 0000", "Reject: the sum overflowed 4 bits", "Ask the sender for the checksum again"],
    "answer": 0,
    "explain": "Rule: the receiver complements its wrapped sum and accepts on 0.\nSubstitution: 15 − 15 = 0, or flip 1111 to 0000.\nAnswer: accept the message.\nCheck: slide 49's receiver gets 1111 the same way and accepts."
  },
  {
    "q": "If a wrap produces a new carry, the sum is complemented as it is, without a second wrap.",
    "type": "tf",
    "answer": false,
    "explain": "Rule: wrap again until the sum fits in m bits.\nSubstitution: 46 = 10 1110 → 1 0000 still has five bits → 1 + 0000 = 0001.\nAnswer: false. The second wrap is needed before the complement.\nCheck: the complement 1110 = 14 is then not 0, so the damaged packet is rejected."
  },
  {
    "q": "An FEC group has two chunks, 1100 and 1010. What is the XOR chunk R? Type the bits without spaces.",
    "type": "text",
    "answer": ["0110"],
    "explain": "Rule: R = P1 ⊕ P2, bit by bit.\nSubstitution: 1 ⊕ 1 = 0, 1 ⊕ 0 = 1, 0 ⊕ 1 = 1, 0 ⊕ 0 = 0.\nAnswer: R = 0110.\nCheck: 1100 ⊕ 0110 = 1010, so a lost second chunk is rebuilt."
  },
  {
    "q": "The XOR scheme splits a packet into N = 5 chunks. How much extra data is sent, in percent?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "%",
    "explain": "Formula: extra data = 1/N.\nSubstitution: 1/5 = 0.20.\nAnswer: 20 % extra data.\nCheck: slide 55's N = 4 gives 1/4 = 25 %, and more chunks cost less."
  }
]
```

## Remember

- Wrap the extra left bits onto the rightmost m bits, and repeat until the sum fits.
- The complement is $(2^m - 1)$ minus the sum, or F − d per hex digit. The receiver accepts on 0.
- XOR of everything that arrived rebuilds one lost chunk, never two.
- *On the sheet:* Sheet side 4, "Checksum and one's complement" and "Forward error correction (FEC)".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "checksum", "one's complement", "wrap" | sum, wrap, complement | m bits, or m/4 hex digits | the receiver gets 0 |
| "lost chunk", "XOR", "FEC" | R = P1 ⊕ … ⊕ PN | one chunk, overhead 1/N | XOR of the rest and R gives the chunk |
