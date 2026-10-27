---
title: "CRC division: the encoder's remainder and the decoder's syndrome"
minutes: 22
---

The CRC encoder finds its redundant bits by a long division in modulo 2, and the decoder runs the same division on what it receives. Both are done by hand on the midterm, so this lesson works the slide's three divisions row by row and then gives you new ones.

## The encoder's long division

Slide 38 divides dataword 1001 by the divisor 1011. The dividend is the dataword with n − k = 3 zeros appended: 1001000.

```text
             1 0 1 0          <- Quotient (discarded)
        ________________
1 0 1 1 ) 1 0 0 1 0 0 0       <- Dividend = dataword + 000
          1 0 1 1
          -------
            0 1 0 0           bring down 0
            0 0 0 0           Leftmost bit 0: use 0000 divisor
            -------
              1 0 0 0         bring down 0
              1 0 1 1
              -------
                0 1 1 0       bring down 0
                0 0 0 0       Leftmost bit 0: use 0000 divisor
                -------
                  1 1 0       <- Remainder
```

Row by row: 1001 ⊕ 1011 = 0010 → bring down 0 → 0100 ⊕ 0000 = 0100 → bring down 0 → 1000 ⊕ 1011 = 0011 → bring down 0 → 0110 ⊕ 0000 = 0110 → remainder 110.

Three labels on the slide matter:

- The quotient 1010 goes to a box marked *Discard*. Only the remainder is used.
- Twice the window starts with 0, and the slide writes *Leftmost bit 0: use 0000 divisor*. The quotient bit is then 0.
- A note says *Multiply: AND, Subtract: XOR*. Each quotient bit ANDed with the divisor gives 1011 or 0000, and that row is XORed away.

The codeword is 1001 followed by 110, captioned *Dataword plus remainder*: 1001110, the slide-34 row for 1001.

```widget
crc-calc
{ "dataword": "1001", "divisor": "1011", "mode": "encode" }
```

### One quotient bit at a time

Watch the leftmost bit of each window: a 1 brings down the divisor 1011, a 0 brings down 0000, and either way the leading bit drops off and the next dividend bit comes down.

```widget
crc-play
{ "dataword": "1001", "divisor": "1011", "mode": "encode" }
```

## The recipe, for any dataword and divisor

1. Append n − k zeros to the dataword, one fewer than the divisor's length. This is the dividend.
2. Take the first divisor-length bits as the window.
3. Leftmost bit 1: write quotient bit 1 and XOR the divisor. Leftmost bit 0: write quotient bit 0 and XOR 0000.
4. Drop the leading bit of the result and bring down the next dividend bit to form the next window.
5. When every dividend bit has been brought down, the last XOR's final n − k bits are the remainder.

The quotient has one bit per step, k bits in all. A remainder with leading zeros keeps them: 011 is three bits.

## The decoder divides the whole codeword

The receiver divides the received codeword, with nothing appended, by the same divisor. The remainder is the syndrome. Slide 40 shows both cases.

Uncorrupted, 1001110 received:

```text
             1 0 1 0
        ________________
1 0 1 1 ) 1 0 0 1 1 1 0       <- Codeword
          1 0 1 1
          -------
            0 1 0 1
            0 0 0 0
            -------
              1 0 1 1
              1 0 1 1
              -------
                0 0 0 0
                0 0 0 0
                -------
                  0 0 0       <- Syndrome: Zero
```

The syndrome is *Zero*, so the result is *Dataword accepted*: 1001.

Corrupted, 1000110 received (the dataword's last bit flipped):

```text
             1 0 1 1
        ________________
1 0 1 1 ) 1 0 0 0 1 1 0       <- Codeword
          1 0 1 1
          -------
            0 1 1 1
            0 0 0 0
            -------
              1 1 1 1
              1 0 1 1
              -------
                1 0 0 0
                1 0 1 1
                -------
                  0 1 1       <- Syndrome: Non-Zero
```

Row by row: 1000 ⊕ 1011 = 0011 → bring down 1 → 0111 ⊕ 0000 = 0111 → bring down 1 → 1111 ⊕ 1011 = 0100 → bring down 0 → 1000 ⊕ 1011 = 0011 → syndrome 011. *Non-Zero*, so *Dataword discarded*.

### The corrupted codeword's syndrome

The decoder on 1000110: the same steps, but the dividend is the received word itself.

```widget
crc-play
{ "mode": "decode", "received": "1000110", "divisor": "1011" }
```

## Every single-bit error on 1001110 is caught

Flipping each bit of 1001110 in turn, computed:

| Bit flipped | Received | Syndrome |
|---|---|---|
| 1 (leftmost) | 0001110 | 101 |
| 2 | 1101110 | 111 |
| 3 | 1011110 | 110 |
| 4 | 1000110 | 011 |
| 5 | 1001010 | 100 |
| 6 | 1001100 | 010 |
| 7 | 1001111 | 001 |

All seven syndromes are non-zero, so every single-bit error is detected; they also differ, so the syndrome even points at the bit. The slide's corrupted case is bit 4. A 2-bit error is caught too: 0101110 gives syndrome 010.

## Divide three more by hand

Write the division in the slide-38 layout on paper, then type the remainder or syndrome bits without spaces.

```quiz
[
  {
    "q": "Dataword 1101, divisor 1011. What is the CRC remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["001", "1"],
    "explain": "Dividend 1101000. 1101 ⊕ 1011 = 0110 → bring down 0 → 1100 ⊕ 1011 = 0111 → bring down 0 → 1110 ⊕ 1011 = 0101 → bring down 0 → 1010 ⊕ 1011 = 0001 → remainder 001. Quotient 1111. The remainder is three bits, 001; 1 is accepted as the same value."
  },
  {
    "q": "Dataword 1101, divisor 1011. What is the codeword? Type the bits without spaces.",
    "type": "text",
    "answer": ["1101001"],
    "explain": "Dataword plus remainder: 1101 followed by 001 = 1101001, the slide-34 row for 1101."
  },
  {
    "q": "Dataword 10110, divisor 1101. What is the CRC remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["101"],
    "explain": "The divisor has 4 bits, so append 3 zeros: 10110000. 1011 ⊕ 1101 = 0110 → bring down 0 → 1100 ⊕ 1101 = 0001 → bring down 0 → 0010 ⊕ 0000 = 0010 → bring down 0 → 0100 ⊕ 0000 = 0100 → bring down 0 → 1000 ⊕ 1101 = 0101 → remainder 101. Quotient 11001; codeword 10110101."
  },
  {
    "q": "Received 1101011, divisor 1011. What is the syndrome? Type the bits without spaces.",
    "type": "text",
    "answer": ["010", "10"],
    "explain": "Divide the received word as it is: 1101 ⊕ 1011 = 0110 → bring down 0 → 1100 ⊕ 1011 = 0111 → bring down 1 → 1111 ⊕ 1011 = 0100 → bring down 1 → 1001 ⊕ 1011 = 0010 → syndrome 010 (10 is accepted as the same value). Non-zero, so the dataword is discarded. (1101001 was sent; bit 6 flipped.)"
  },
  {
    "q": "Received 1010011, divisor 1011. What is the syndrome? Type the bits without spaces.",
    "type": "text",
    "answer": ["000", "0"],
    "explain": "1010 ⊕ 1011 = 0001 → bring down 0 → 0010 ⊕ 0000 = 0010 → bring down 1 → 0101 ⊕ 0000 = 0101 → bring down 1 → 1011 ⊕ 1011 = 0000 → syndrome 000 (0 is accepted as the same value). Zero, so dataword 1010 is accepted."
  }
]
```

```quiz
[
  {
    "q": "Slide 38: dataword 1001, divisor 1011. What is the remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["110"],
    "explain": "Dividend 1001000. 1001 ⊕ 1011 = 0010 → bring down 0 → 0100 ⊕ 0000 = 0100 → bring down 0 → 1000 ⊕ 1011 = 0011 → bring down 0 → 0110 ⊕ 0000 = 0110 → remainder 110. Codeword 1001110."
  },
  {
    "q": "In the slide-38 division, what is the quotient and what happens to it?",
    "options": ["1010, discarded", "1010, appended to the dataword", "110, appended to the dataword", "1011, sent as the divisor"],
    "answer": 0,
    "explain": "The quotient bits are 1, 0, 1, 0 (one per step: divisor, 0000, divisor, 0000) and the slide sends the quotient to Discard. The remainder 110 is what is appended."
  },
  {
    "q": "Slide 40: the receiver gets 1000110 and divides by 1011. What is the syndrome? Type the bits without spaces.",
    "type": "text",
    "answer": ["011", "11"],
    "explain": "1000 ⊕ 1011 = 0011 → bring down 1 → 0111 ⊕ 0000 = 0111 → bring down 1 → 1111 ⊕ 1011 = 0100 → bring down 0 → 1000 ⊕ 1011 = 0011 → syndrome 011. Non-zero: dataword discarded. The syndrome is three bits, 011; 11 is accepted as the same value."
  },
  {
    "q": "Dataword 1010, divisor 1011. What is the CRC remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["011", "11"],
    "explain": "Dividend 1010000. 1010 ⊕ 1011 = 0001 → bring down 0 → 0010 ⊕ 0000 = 0010 → bring down 0 → 0100 ⊕ 0000 = 0100 → bring down 0 → 1000 ⊕ 1011 = 0011 → remainder 011. Quotient 1001. The remainder has n − k = 3 bits, so write 011; 11 is accepted as the same value."
  },
  {
    "q": "Dataword 1010, divisor 1011. What is the codeword? Type the bits without spaces.",
    "type": "text",
    "answer": ["1010011"],
    "explain": "Dataword plus the 3-bit remainder: 1010 followed by 011 = 1010011, the slide-34 row for 1010. The leading 0 of the remainder must be kept here, or the codeword would be 6 bits."
  },
  {
    "q": "Dataword 100100, divisor 1101. What is the CRC remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["001", "1"],
    "explain": "Divisor 4 bits, so append 3 zeros: 100100000. 1001 ⊕ 1101 = 0100 → bring down 0 → 1000 ⊕ 1101 = 0101 → bring down 0 → 1010 ⊕ 1101 = 0111 → bring down 0 → 1110 ⊕ 1101 = 0011 → bring down 0 → 0110 ⊕ 0000 = 0110 → bring down 0 → 1100 ⊕ 1101 = 0001 → remainder 001. Quotient 111101. Write all three bits, 001; 1 is accepted as the same value."
  },
  {
    "q": "Dataword 100100, divisor 1101. What is the codeword? Type the bits without spaces.",
    "type": "text",
    "answer": ["100100001"],
    "explain": "Dataword plus remainder: 100100 followed by 001 = 100100001 (n = 9, k = 6, n − k = 3)."
  },
  {
    "q": "The receiver gets 1110011 and the divisor is 1011. What is the syndrome? Type the bits without spaces.",
    "type": "text",
    "answer": ["111"],
    "explain": "1110 ⊕ 1011 = 0101 → bring down 0 → 1010 ⊕ 1011 = 0001 → bring down 1 → 0011 ⊕ 0000 = 0011 → bring down 1 → 0111 ⊕ 0000 = 0111 → syndrome 111. Non-zero, so the dataword is discarded."
  },
  {
    "q": "A non-zero syndrome means the dataword is discarded.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 40: syndrome Non-Zero → Dataword discarded (011 for 1000110); Zero → Dataword accepted (000 for 1001110)."
  },
  {
    "q": "During the encoder's division, the leftmost bit of the current window is 0. What does the encoder do?",
    "options": ["Uses the 0000 divisor and writes quotient bit 0", "Uses the divisor 1011 and writes quotient bit 1", "Stops: the remainder is found", "Skips the bit and discards the dataword"],
    "answer": 0,
    "explain": "Slide 38: Leftmost bit 0: use 0000 divisor. The quotient bit is 0, the window is XORed with 0000, and the next bit is brought down."
  }
]
```
