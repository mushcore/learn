---
title: "Review 3a: codewords, Hamming distance and parity"
minutes: 15
---
This lesson teaches how a sender adds spare bits so the receiver can spot damage. It prepares you to count valid codewords, find a Hamming distance, and say how many errors a code catches.

## What a codeword is, in plain words

A message is cut into small blocks of data bits. Each block is called a *dataword*.

The sender adds a few spare bits to every block before it goes on the wire. The longer block that is sent is called a *codeword*.

Most patterns of the longer length are never sent. Those unused patterns are the alarm: if one arrives, something was damaged on the way.

Slide 16 calls the unused words *the trick in error detection*. A damaged codeword that lands on another valid codeword is *undetectable*.

```diagram
{ "type": "grid", "title": "Two data bits sent as three bits", "nodes": [
  { "id": "c00", "label": "dataword", "row": 0, "col": 0 }, { "id": "c01", "label": "00", "row": 0, "col": 1 }, { "id": "c02", "label": "01", "row": 0, "col": 2 }, { "id": "c03", "label": "10", "row": 0, "col": 3 }, { "id": "c04", "label": "11", "row": 0, "col": 4 },
  { "id": "c10", "label": "codeword sent", "row": 1, "col": 0 }, { "id": "c11", "label": "000", "row": 1, "col": 1 }, { "id": "c12", "label": "011", "row": 1, "col": 2 }, { "id": "c13", "label": "101", "row": 1, "col": 3 }, { "id": "c14", "label": "110", "row": 1, "col": 4 },
  { "id": "c20", "label": "never sent", "row": 2, "col": 0 }, { "id": "c21", "label": "001", "row": 2, "col": 1 }, { "id": "c22", "label": "010", "row": 2, "col": 2 }, { "id": "c23", "label": "100", "row": 2, "col": 3 }, { "id": "c24", "label": "111", "row": 2, "col": 4 }
], "hi": ["c11", "c12", "c13", "c14"], "caption": "Only 4 of the 8 three-bit words are valid. A word from the bottom row means the block was damaged." }
```

## A tiny case: two data bits, three sent bits

Each dataword has 2 bits, and each codeword has 3 bits. Count the datawords first.

$$2 \times 2 = \mathbf{4} \text{ datawords, so 4 valid codewords}$$

Then count every pattern of 3 bits.

$$2 \times 2 \times 2 = \mathbf{8} \text{ three-bit words}$$

$$8 - 4 = \mathbf{4} \text{ invalid words}$$

Half the patterns are valid, which matches the picture: four in the top row, four in the bottom row.

## The count, with each symbol named

$$n = k + r \qquad \text{valid} = 2^k \qquad \text{invalid} = 2^n - 2^k$$

- k is the number of bits in a dataword.
- r is the number of spare bits the sender adds.
- n is the number of bits in a codeword.
- $2^n$ is every pattern of n bits, valid plus invalid.

The trap is the exponent. Valid uses k, the short length, because there is one codeword per dataword.

## The slide's codes, counted

Slide 34's CRC code has k = 4 and n = 7.

$$\text{valid} = 2^4 = \mathbf{16} \qquad \text{invalid} = 2^7 - 2^4 = 128 - 16 = \mathbf{112}$$

Check: 16 + 112 = 128, which is $2^7$.

## What Hamming distance is, in plain words

Line up two words of the same length, bit under bit. The Hamming distance is how many positions disagree.

Slide 20 says it is *the number of differences between corresponding bits*. If you compare what was sent with what arrived, the distance is the number of damaged bits.

XOR is the tool. It gives 1 where two bits differ and 0 where they agree, so you count the 1s.

## A tiny case: two short words

Compare 1100 with 1010.

$$1100 ⊕ 1010 = 0110$$

$$\text{count the 1s: } \mathbf{2}$$

That makes sense: the middle two bits swap, and the outer two agree.

## The rules, with each symbol named

The *minimum Hamming distance* of a code is the smallest distance between any two of its valid codewords. Two rules use it.

$$d_{min} = s + 1 \qquad d_{min} = 2t + 1$$

- $d_{min}$ is the smallest distance between two valid codewords, in bits.
- s is how many errors the code is sure to *detect*. Slide 22.
- t is how many errors it is sure to *correct*. Slide 53.

Turned around, a code detects $d_{min} - 1$ errors and corrects $⌊(d_{min} - 1)/2⌋$, rounded down. The trap is the factor of 2: correcting needs twice the gap that detecting needs.

```diagram
{ "type": "flow", "title": "The code {000, 111}: d_min = 3", "nodes": [
  { "id": "a", "label": "000", "sub": "valid" }, { "id": "b", "label": "001" }, { "id": "c", "label": "011" }, { "id": "d", "label": "111", "sub": "valid" }
], "edges": [ { "from": "a", "to": "b", "label": "1 flip" }, { "from": "b", "to": "c", "label": "1 flip" }, { "from": "c", "to": "d", "label": "1 flip" } ], "hi": ["a", "d"], "caption": "Three flips separate the valid words. One or two flips land on an invalid word: 2 detected. One flip stays nearest 000: 1 corrected." }
```

## The slide's example, worked

Slide 21 finds d(10101, 11110).

```diagram
{ "type": "grid", "title": "Slide 21: d(10101, 11110)", "nodes": [
  { "id": "a0", "label": "x", "row": 0, "col": 0 }, { "id": "a1", "label": "1 0 1 0 1", "row": 0, "col": 1 },
  { "id": "b0", "label": "y", "row": 1, "col": 0 }, { "id": "b1", "label": "1 1 1 1 0", "row": 1, "col": 1 },
  { "id": "c0", "label": "x ⊕ y", "row": 2, "col": 0 }, { "id": "c1", "label": "0 1 0 1 1", "row": 2, "col": 1 },
  { "id": "d0", "label": "count the 1s", "row": 3, "col": 0 }, { "id": "d1", "label": "3", "row": 3, "col": 1 }
], "hi": ["d1"], "caption": "Equal bits XOR to 0, different bits to 1, so the three 1s are exactly the three differences." }
```

$$10101 ⊕ 11110 = 01011 \Rightarrow d = \mathbf{3}$$

The C(7,4) CRC table has $d_{min}$ = 3. This is computed over every pair, not stated on a slide.

$$s = 3 - 1 = \mathbf{2} \qquad t = ⌊(3 - 1)/2⌋ = \mathbf{1}$$

Check: correcting is never more than detecting, and 1 is less than 2.

Type any two words of the same length and watch the XOR row.

```widget
codeword-lab
{ "mode": "distance", "a": "10101", "b": "11110" }
```

## Even parity, the smallest code

The smallest code adds one spare bit. The sender picks that bit so the codeword holds an even number of 1s.

The receiver counts the 1s. An odd count means damage.

Slide 26 sends dataword 10001. It already has two 1s, which is even, so the parity bit is 0.

$$10001 \to \mathbf{100010}$$

The received word 011010 holds three 1s. Three is odd, so the slide calls it corrupted.

Parity has a minimum distance of two bits, so it detects one error and corrects none. Slide 26 adds that it *can also find any odd number of errors*.

A game packet from the Classic client starts with an opcode byte, say 00101010. That value is made up for practice. It holds three 1s, so the parity bit is 1.

$$00101010 \to \mathbf{001010101}$$

If two bits flip, the count of 1s stays even. Parity then accepts a damaged word.

## Try it

Work each on paper first, then type the result.

```quiz
[
  {
    "q": "A code takes 6-bit datawords and appends the 3-bit remainder of a CRC with divisor 1011. How many 9-bit words are invalid codewords?",
    "type": "numeric",
    "answer": 448,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Formula: invalid = 2ⁿ − 2ᵏ, with k = 6 and n = 9.\nSubstitution: 2⁹ − 2⁶ = 512 − 64 codewords.\nAnswer: 448 invalid codewords.\nCheck: 64 valid + 448 invalid = 512 = 2⁹."
  },
  {
    "q": "Two opcode bytes from game packets are 00101010 and 00111011. What is their Hamming distance?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: d(x, y) = number of 1s in x ⊕ y.\nSubstitution: 00101010 ⊕ 00111011 = 00010001.\nAnswer: two 1s, so d = 2 bits.\nCheck: the words differ only in the fourth bit and the last bit."
  },
  {
    "q": "A packet code must correct up to 3 bit errors in every case. What minimum Hamming distance does it need?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: to correct t errors, d_min = 2t + 1 (slide 53).\nSubstitution: 2 × 3 + 1, with t = 3 errors.\nAnswer: d_min = 7 bits.\nCheck: ⌊(7 − 1)/2⌋ = 3 corrected, and the same code detects 6."
  },
  {
    "q": "A code has minimum Hamming distance 4. How many errors can it detect, and how many can it correct, in all cases?",
    "options": ["Detects 3, corrects 1", "Detects 4, corrects 2", "Detects 3, corrects 2", "Detects 2, corrects 1"],
    "answer": 0,
    "explain": "Formula: detect d_min − 1, correct ⌊(d_min − 1)/2⌋.\nSubstitution: 4 − 1 = 3, and ⌊3/2⌋ = ⌊1.5⌋.\nAnswer: detects 3 errors, corrects 1 error.\nCheck: correcting 2 would need d_min = 2 × 2 + 1 = 5."
  },
  {
    "q": "Even parity: the 7-bit dataword is 1110011. Type the 8-bit codeword (the bits without spaces).",
    "type": "text",
    "answer": ["11100111"],
    "explain": "Rule: the parity bit makes the number of 1s even, added as the rightmost bit.\nSubstitution: 1 + 1 + 1 + 0 + 0 + 1 + 1 = 5 ones, which is odd.\nAnswer: parity bit 1, codeword 11100111.\nCheck: the codeword holds six 1s, an even count."
  },
  {
    "q": "The simple parity check detects every 2-bit error.",
    "type": "tf",
    "answer": false,
    "explain": "Rule: each flip changes the count of 1s by one.\nSubstitution: two flips change the count by two, so an even count stays even.\nAnswer: false. Parity finds one error and any odd number of errors.\nCheck: d_min = 2 for parity, so it detects only 2 − 1 = 1 error in every case."
  }
]
```

## Remember

- Hamming distance is XOR, then count the 1s.
- A code detects $d_{min} - 1$ errors and corrects $⌊(d_{min} - 1)/2⌋$.
- Even parity catches any odd number of flips and misses every even number.
- *On the sheet:* Sheet side 4, "Block coding, Hamming distance and parity".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "valid", "invalid codewords" | $2^k$ and $2^n - 2^k$ | codewords | valid + invalid = $2^n$ |
| "Hamming distance", d(x, y) | XOR, count the 1s | bits | the words have the same length |
| "detect", "correct", $d_{min}$ | $s = d_{min} - 1$, $t = ⌊(d_{min} - 1)/2⌋$ | errors | correct ≤ detect |
