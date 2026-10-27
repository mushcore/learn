---
title: "Block coding: datawords, codewords, valid and invalid codewords"
minutes: 15
---

Redundancy only helps if the receiver can tell a good word from a damaged one. Block coding gives it that test: every block of data has exactly one allowed codeword, and most patterns of the codeword's length are not allowed at all.

## Datawords of k bits become codewords of n = k + r bits

Slide 16:

- *Dataword: The message is divided into blocks, each of k bits.*
- *Codeword: r redundant bits are added to each block to make the length n = k + r*

So r = n − k. The slide adds an inequality, $2^k$ datawords $<$ $2^n$ codewords: k bits make $2^k$ different datawords, while n bits make $2^n$ different words, and n is bigger than k.

## Only 2^k of the 2^n possible words are ever sent

Slide 16 again: *The block coding process is one-to-one. The same dataword is always encoded as the same codeword.* Only $2^k$ of the $2^n$ possible n-bit words are ever sent. The rest, *(2^n − 2^k) codewords are not used (invalid codes) → the trick in error detection*: a corruption that lands on one of them is visibly wrong.

| Count | Rule |
|---|---|
| valid codewords | $2^k$ |
| invalid codewords | $2^n - 2^k$ |
| all n-bit words | $2^n$ |

The two codes of this week, by those rules:

| Code | k | n | r | valid $2^k$ | invalid $2^n - 2^k$ | total $2^n$ |
|---|---|---|---|---|---|---|
| C(5, 4) parity, slide 27 | 4 | 5 | 1 | 16 | 32 − 16 = 16 | 32 |
| C(7, 4) CRC, slide 34 | 4 | 7 | 3 | 16 | 128 − 16 = 112 | 128 |

Both send 16 datawords. The CRC code spends three redundant bits instead of one, so 112 of its 128 words are invalid instead of 16 of 32: far more room for a corrupted word to land on an invalid one.

## The receiver's three conditions

Slide 16, *Error detection by receiver (3 conditions)*:

1. *The receiver has (or can find) a list of valid codewords.*
2. *The original codeword has changed to an invalid one and it'll be discarded.*
3. *The original codeword changes to a valid one! → makes the error undetectable*

The first is what makes checking possible at all. The second is the case the code is designed for. The third is the failure that no block code can rule out. How many flips it takes to reach it depends on how far apart the valid codewords sit, which is what [Hamming distance](#/comp3721-w7/hamming-distance) measures.

## Encoder, unreliable transmission, checker

The figure on slides 17 and 18, read left to right:

| Sender (Encoder) | | Receiver (Decoder) |
|---|---|---|
| Dataword, k bits → Generator → Codeword, n bits | *Unreliable transmission* → | Codeword, n bits → Checker → *Extract* the dataword (k bits) or *Discard* |

The generator adds the r redundant bits: one parity bit in C(5, 4), a 3-bit remainder in C(7, 4). The checker looks the received word up against the valid codewords: valid means extract the k data bits, invalid means discard.

Slide 18, boxed: *If the codeword is corrupted during transmission but the received word still matches a valid codeword, the error remains undetected.*

## Three received words on C(5, 4)

In C(5, 4) the dataword 1011 is sent as the codeword 10111 (the whole table is in [the parity-check lesson](#/comp3721-w7/parity-check)). Three things can arrive:

| Received | In the table? | What the receiver does |
|---|---|---|
| 10111 | yes, dataword 1011 | extracts 1011: no error |
| 10011 | no (1001 is sent as 10010) | condition 2: detected, discarded |
| 11011 | yes, dataword 1101 | condition 3: extracts 1101, the error is undetected |

The last row changed two bits of 10111 and landed exactly on another valid codeword, so the checker has nothing to object to.

### Valid, invalid, undetected

Click bits in the received row to flip them. One flip always gives an invalid word. Add a second flip anywhere and the word is valid again: the receiver accepts the wrong dataword.

```widget
codeword-lab
{ "code": "parity-5-4", "mode": "send", "send": "1011" }
```

## Count valid and invalid codewords

Each item gives k and n. Valid is $2^k$, invalid is $2^n - 2^k$.

```quiz
[
  {
    "q": "A block code has k = 5 and n = 8. How many valid codewords does it have?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Valid codewords = one per dataword = $2^k = 2^5 = 32$."
  },
  {
    "q": "Same code, k = 5 and n = 8. How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 224,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Invalid = $2^n - 2^k = 2^8 - 2^5 = 256 - 32 = 224$."
  },
  {
    "q": "Same code, k = 5 and n = 8. How many redundant bits r does each codeword carry?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "n = k + r, so r = n − k = 8 − 5 = 3 bits."
  },
  {
    "q": "A block code has k = 2 and n = 5. How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 28,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Valid = $2^2 = 4$. Invalid = $2^5 - 2^2 = 32 - 4 = 28$."
  },
  {
    "q": "8-bit datawords get one redundant bit (k = 8, n = 9). How many valid codewords are there?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Valid = $2^k = 2^8 = 256$."
  },
  {
    "q": "Same code, k = 8 and n = 9. How many invalid codewords are there?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Invalid = $2^9 - 2^8 = 512 - 256 = 256$. With one redundant bit, exactly half of all 9-bit words are valid."
  }
]
```

```quiz
[
  {
    "q": "The C(5, 4) parity code (k = 4, n = 5). How many valid codewords does it have?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Valid = $2^k = 2^4 = 16$, one per dataword."
  },
  {
    "q": "The C(5, 4) parity code. How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Invalid = $2^n - 2^k = 2^5 - 2^4 = 32 - 16 = 16$."
  },
  {
    "q": "The C(7, 4) CRC code (k = 4, n = 7). How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 112,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Invalid = $2^7 - 2^4 = 128 - 16 = 112$. Only 16 of the 128 seven-bit words are valid."
  },
  {
    "q": "Fill in the blanks from slide 16.",
    "type": "fill",
    "code": "r = n - ___\n2^___ datawords < 2^___ codewords",
    "answer": ["k", "k", "n"],
    "explain": "n = k + r, so r = n − k. k bits give $2^k$ datawords and n bits give $2^n$ words: $2^k$ datawords < $2^n$ codewords."
  },
  {
    "q": "In block coding, the same dataword can be encoded as different codewords.",
    "type": "tf",
    "answer": false,
    "explain": "The block coding process is one-to-one. The same dataword is always encoded as the same codeword."
  },
  {
    "q": "Which of the receiver's conditions makes the error undetectable?",
    "options": ["The original codeword changes to a valid one", "The original codeword has changed to an invalid one", "The receiver has (or can find) a list of valid codewords", "The receiver discards the frame and lets the upper-layer protocols retransmit it"],
    "answer": 0,
    "explain": "The original codeword changes to a valid one! → makes the error undetectable. A change to an invalid one is detected and the word is discarded."
  },
  {
    "q": "C(5, 4): the sender sends 10111 (dataword 1011) and 10011 arrives. What does the receiver do?",
    "options": ["Detects the error and discards it: 10011 is not a valid codeword", "Accepts it as the dataword 1001", "Accepts it as 1001: the error is undetected", "Accepts it as 1011: the error is corrected"],
    "answer": 0,
    "explain": "1001 is sent as 10010, so 10011 is in no row of the table: the codeword has changed to an invalid one and it is discarded."
  },
  {
    "q": "C(5, 4): the sender sends 10111 (dataword 1011) and 11011 arrives. What does the receiver do?",
    "options": ["Accepts it as the dataword 1101: the error is undetected", "Detects the error and discards it", "Accepts it as 1011: the error is corrected", "Asks the sender for a list of valid codewords"],
    "answer": 0,
    "explain": "11011 is the valid codeword of 1101. The corrupted word still matches a valid codeword, so the error remains undetected and the wrong dataword 1101 is extracted."
  },
  {
    "q": "If the codeword is corrupted during transmission but the received word still matches a valid codeword, the error remains ________.",
    "type": "text",
    "answer": ["undetected"],
    "explain": "Undetected (slide 18). The checker only knows the list of valid codewords; a valid word passes."
  }
]
```
