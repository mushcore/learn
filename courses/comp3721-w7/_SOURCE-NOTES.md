# COMP 3721 Week 7 (lectures 07a, 07b, 07c) — facts and worked answers transcribed from the instructor's material

Source files (instructor Marco Ho): `D:/BCIT/COMP3721/lectures/COMP3721 - 07a - Week 7 - Part 1_v2.pdf` (60 slides, "Error detection and correction"), `lectures/COMP3721 - 07b - Week 7 - Part 2.pdf` (39 slides, "Data-link control: framing, flow and error control, Simple and Stop-and-Wait"), `lectures/COMP3721 - 07c - Week 7 - Complementary Notes.pdf` (2 pages, "Modulo 2 Arithmetic", a printed web page from csus.edu dated 9/22/2009). Text extractions beside them as `.txt`; rendered pages in `D:/BCIT/COMP3721/pages/07a/p01..p60.png`, `07b/p01..p39.png`, `07c/p01..p02.png`. Every figure below was read from the rendered page, not the text extraction.

**No E07 exercise sheet is posted.** Practice numbers in this file that are not on a slide are marked **[new, computed]**; every one was recomputed by script (Python, mod-2 long division, one's-complement sums with repeated wrapping).

Textbook: the slides cite Forouzan, *Data Communications & Networking with TCP/IP Protocol Suite*, 6th ed., 2022. Reading for 07a: "Chapter 3, section 3.2.2" and "section 3.6 (Practice Test)". Reading for 07b: "Chapter 3, sections 3.2.1 and 3.2.3" and "section 3.6 (Practice Test)". (In Forouzan's *Data Communications and Networking*, 5th ed., the same material is Chapters 10 and 11.) The textbook was not opened for this transcription; anything attributed to it is from memory and labelled **[textbook, unverified]**.

The instructor's midterm review list, item 12 (from `202630 - COMP3721 - Suggested Midterm Review Topics.txt`): "Data Link Layer: Error Detection and Error Correction, Redundancy for Error Control (Dataword, Codeword, number of valid and invalid codewords), Block Coding, Hamming Distance and Error Detection (how many errors can be detected/corrected), Linear Block Codes (Parity Check Code), Cyclic Codes (CRC) and Syndrome value, Checksum calculation, One's Complement Arithmetic and Wrapping (Hex), FEC, Framing, Fixed and Variable Size (Byte oriented and Bit oriented approaches – Byte and Bit Stuffing), Flow Control, Error Control (Simple and Stop-and-wait Protocols)". **"(Hex)" appears in the review list but no slide works a checksum in hexadecimal**; the hex method below is derived and labelled.

Slide numbers are PDF pages; progressive builds (the same slide repeated with one more bullet) are transcribed once, at the last build. Every content slide has the footer "COMP 3721 — 07a - Week 7 - Part 1" (or "07b - Week 7 - Part 2") and the page number; not repeated below.

---

## 07a — Title, learning outcomes, introduction (slides 1-4)

- Slide 1: "COMP 3721 / Introduction to Data Communications / 07a - Week 7 - Part 1".
- Slide 2, **Learning Outcomes**: "By the end of this lecture, you will be able to: Explain what are the types of errors. Distinguish between error detection and error correction. Explain how block coding and hamming distance work. Explain how cyclic codes work. Explain how to calculate a checksum. Explain FEC (Forwarding Error Correction) techniques."
  - FLAG: slide 2 writes "Forwarding Error Correction"; slide 51 and the textbook say **Forward** Error Correction. Use "forward".
- Slides 3-4, **Introduction** (build): "Networks must be able to transfer data from one device to another with **acceptable accuracy**. The data received **must be identical** to the data transmitted." "Data may become **corrupted** in passage (one or more bits may be modified)." "A small level of error may be tolerated by some applications." Slide 4 adds: "The approach of most link-layer protocols for error control → simply **discard the frame** and let the **upper-layer protocols** handle the **retransmission** of the frame."

## 07a — Types of errors (slides 5-6)

- Slide 5: "**Interference** can change the shape of the signal. Bits are subject to unpredictable changes."
- Slide 6 adds: "**Single-bit error** and **Burst error**. Only 1 bit of a given data unit (such as a byte, character, or packet) is changed from 1 to 0 or from 0 to 1 → **single-bit error**. 2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1 → **Burst Error**."
- Slide 6 figure, two parts (redraw exactly):
  - **a. Single-bit error**: "Sent" 8 cells `0 0 0 0 0 0 1 0` with the 5th cell (red 0) marked; arrow "Corrupted bit"; "Received" `0 0 0 0 1 0 1 0` (5th cell now red 1, shaded blue).
  - **b. Burst error**: "Sent" 16 cells `0 1 0 0 1 1 0 1 0 1 0 0 0 0 1 1`; four cells marked (positions 4, 5, 8 and 11 from the left, shaded blue, red digits 0, 1, 1, 0); arrows "Corrupted bits"; "Received" `0 1 0 1 0 1 0 0 0 1 1 0 0 0 1 1` (positions 4, 5, 8, 11 now 1, 0, 0, 1). A bracket above the sent row from position 4 to position 11: "**Length of burst error (8 bits)**". Under it in blue: "**More likely to happen. Why?**"
  - Recomputed: XOR of sent and received = `0001 1001 0010 0000`: 4 bits flipped, first flip at position 4, last at 11 → burst length = 11 − 4 + 1 = **8 bits**, matching the slide. The burst length counts from the first to the last corrupted bit, including the uncorrupted bits between them (positions 6, 7, 9, 10 were not changed).
  - **OPEN on the slide ("More likely to happen. Why?")**. Answer [textbook, unverified, consistent with slides 7-9]: a burst error is more likely than a single-bit error because the duration of the noise is normally longer than the duration of one bit, so the noise affects a run of bits. Slide 7's box states the dependence.

## 07a — Number of bits affected by the noise (slides 7-9)

- Slide 7, boxed: "Number of bits affected by the noise depends on the **data rate** and the **duration of noise**."
- **Example (slides 8-9)**: "Assume we are sending data and there is a noise of 0.001 second. How many bits are affected by this noise if a) The data rate is 1 kbps. b) The data rate is 1 Mbps." Answer: "a) 1000 × 0.001 = **1 bit**  b) 1000000 × 0.001 = **1000 bits**".
  - Rule: bits affected = data rate × noise duration. Recomputed: 1000 bps × 0.001 s = 1 bit; 1 000 000 bps × 0.001 s = 1000 bits. Matches.
  - Practice numbers [new, computed]: 2 ms at 10 Mbps → 0.002 × 10 000 000 = **20 000 bits**; 0.5 ms at 100 Mbps → **50 000 bits**; 1 μs at 1 Gbps → **1000 bits**; 10 ms at 56 kbps → **560 bits**.

## 07a — Error detection vs. error correction (slide 10)

- "**Error detection**: Only looking to see if any error has occurred. The number of corrupted bits (type of error) is not important."
- "**Error correction**: The **exact number of corrupted bits** and **their location** in the message need to be identified. The number of errors and the size of the message are important factors."
- "The **correction** of errors is **more difficult** than the **detection**."

## 07a — Redundancy for error control (slide 11)

- "Sending some **extra bits** with our data. These redundant bits are **added by the sender** and **removed by the receiver**. Redundant bits allow the **receiver** to **detect** or **correct** corrupted bits. Redundancy is achieved through **coding schemes**. The sender adds redundant bits which **have a relationship** with the actual data."

## 07a — Block coding (slides 12-16)

- Build, final form (slide 16):
  - "**Dataword**: The message is divided into blocks, each of *k* bits."
  - "**Codeword**: *r* redundant bits are added to each block to make the length *n* = *k* + *r*"
  - "2^k datawords < 2^n codewords" (superscripts in the image; the text extraction shows "2k" and "2n").
  - "The **block coding** process is **one-to-one**. The **same dataword** is always encoded as the **same codeword**. (2^n − 2^k) codewords are not used (invalid codes) → the **trick** in error detection"
  - "**Error detection by receiver** (3 conditions): 1. The receiver has (or can find) a list of valid codewords. 2. The original codeword has changed to an invalid one and it'll be discarded. 3. The original codeword changes to a valid one! → makes the error undetectable"
- Count rules (the review list's "number of valid and invalid codewords"): **valid codewords = 2^k**, **invalid codewords = 2^n − 2^k**, **total n-bit words = 2^n**.

| Code | k | n | r | valid 2^k | invalid 2^n − 2^k | total 2^n |
|---|---|---|---|---|---|---|
| C(5,4) parity, slide 27 | 4 | 5 | 1 | 16 | 16 | 32 |
| C(7,4) CRC, slide 34 | 4 | 7 | 3 | 16 | 112 | 128 |
| [new, computed] C(3,2) | 2 | 3 | 1 | 4 | 4 | 8 |
| [new, computed] C(5,2) | 2 | 5 | 3 | 4 | 28 | 32 |
| [new, computed] 8-bit data + parity | 8 | 9 | 1 | 256 | 256 | 512 |
| [new, computed] k = 5 with a 4-bit CRC divisor | 5 | 8 | 3 | 32 | 224 | 256 |

## 07a — Error detection in block coding (slides 17-18)

- Figure (slides 17-18): **Sender** box, inner label "Encoder": "k bits" → [Dataword] (blue) → [Generator] → "n bits" [Codeword] (orange). Red arrow labelled "**Unreliable transmission**" to the **Receiver** box, inner label "Decoder": "n bits" [Codeword] (orange) → [Checker] → two outputs: up "Extract" → [Dataword] "k bits" (blue), and right "Discard".
- Slide 18 box: "If the codeword is corrupted during transmission but the received word still matches a valid codeword, the **error remains undetected**."

## 07a — Hamming distance (slides 19-22)

- Slide 20 (final build): "**Definition**: The Hamming distance between two words (of the same size) is the number of differences between corresponding bits. d(x, y): Hamming distance between two words x and y as d(x, y). e.g., the Hamming distance between **011011** and **001111** is **two**."
  - Recomputed: 011011 ⊕ 001111 = 010100 → two 1s → d = 2. Matches.
- "How does the Hamming distance help in error detection? The Hamming distance between the received codeword and the sent codeword is the number of bits that are corrupted during transmission. d(x, y) = 0 → no error; d(x, y) > 0 → error"
- Slide 21: "**Calculating Hamming distance**: XOR operation (⊕) on the two words and **count the number of 1s** in the result. Example: d(10101, 11110) = **3** ← 10101 ⊕ 11110 = **01011**"
  - Recomputed: 1⊕1=0, 0⊕1=1, 1⊕1=0, 0⊕1=1, 1⊕0=1 → 01011 → three 1s → 3. Matches.
- Slide 22, boxed: "To **guarantee** the **detection of up to *s* errors** in all cases in a block coding scheme, the **minimum Hamming distance** between all pairs of valid codewords must be ***d*min = *s* + 1**."
- Correction rule (slide 53, under FEC, transcribed there): "To correct t errors, we need to have dmin = 2t + 1."
- Derived (not worded on a slide, follows from the two boxes): a code with minimum distance dmin **detects up to dmin − 1 errors** and **corrects up to ⌊(dmin − 1)/2⌋ errors**.

| dmin | detects up to (dmin − 1) | corrects up to ⌊(dmin − 1)/2⌋ | example |
|---|---|---|---|
| 2 | 1 | 0 | simple parity C(5,4) (slide 25) |
| 3 | 2 | 1 | the C(7,4) CRC table of slide 34 [computed, not stated on the slide] |
| 4 | 3 | 1 | [new] {000000, 011011, 101101, 110110} |
| 5 | 4 | 2 | [new] {00000, 11111} |
| 21 | 20 | 10 | slide 53: "correct 10 bits … minimum hamming distance 21 bits" |

- dmin of the slide tables, computed by checking every pair: C(5,4) parity table (slide 27) → **dmin = 2** (stated on slide 25). C(7,4) CRC table (slide 34) → **dmin = 3** (not stated on any slide; computed). So the CRC C(7,4) code detects every 1- or 2-bit error and could correct any single-bit error.
- Practice distances [new, computed]: d(10110011, 10011010) = 3 (XOR 00101001); d(000000, 111111) = 6; d(1100, 0011) = 4; d(10101010, 01010101) = 8; d(11110000, 11001100) = 4 (XOR 00111100); d(0110110, 0111001) = 4 (XOR 0001111).
- Textbook codes [textbook, unverified wording; dmin recomputed]: C(3,2) = {00→000, 01→011, 10→101, 11→110}, every pair at distance 2, **dmin = 2**. C(5,2) = {00→00000, 01→01011, 10→10101, 11→11110}, pairwise distances 3, 3, 4, 4, 3, 3, **dmin = 3**.

## 07a — Linear block codes (slide 23)

- "Almost all block codes used today belong to a subset of block codes called **linear block codes**."
- "The use of nonlinear block codes for error detection and correction is **not as widespread** because their structure makes theoretical analysis and implementation difficult."
- "The formal definition of linear block codes requires the knowledge of **abstract algebra** (particularly **Galois fields**). → beyond our scope"
- "**Informal Definition for our purpose**: a **linear block code** is a code in which the **XOR** (addition modulo-2) of two valid codewords creates another valid codeword."
  - Checked [computed]: for both slide tables (C(5,4) and C(7,4)) the XOR of every pair of codewords is in the table. E.g. C(7,4): 1001110 ⊕ 1011000 = 0010110, the codeword of 0010.

## 07a — Parity-check code (slides 24-30)

- Slide 25 (final build): "**Parity-check code** is a **linear block code**. A k-bit dataword is changed to an n-bit codeword where **n = k + 1**. **Parity bit**: The extra bit and it is selected such that the total number of 1s in the codeword becomes **even** (We only consider even parity here, while some implementations specify an odd number of 1s)." "The minimum Hamming distance for this category is **dmin = 2**, which means that the code is **a single-bit error-detecting code**."
- Slide 26: "The simple parity check, guaranteed to **detect one single error**, and can also **find any odd number of errors**. E.g., the dataword is **10001** and the codeword **100010** is generated using **even parity bit** of **0** (added to the dataword as the rightmost bit). This codeword is transferred to another computer. In transit, the data is corrupted, and the computer receives the incorrect data **011010** (first three digits underlined). This codeword has **odd parity** (the number of 1s = 3), therefore, the codeword is **corrupted**."
  - Recomputed: 10001 has two 1s (even) → parity bit 0 → 100010. Received 011010 has three 1s → odd → corrupted. Matches. Note: 100010 ⊕ 011010 = 111000, so **three** bits were flipped (the underlined first three). Three is odd, which is why parity catches it; the slide does not point this out.
- Slide 27, **Simple Parity-Check Code – C(5, 4)**, "n=5, k=4 (even parity)". Table (parity bit in blue in the original):

| Dataword | Codeword | Dataword | Codeword |
|---|---|---|---|
| 0000 | 00000 | 1000 | 10001 |
| 0001 | 00011 | 1001 | 10010 |
| 0010 | 00101 | 1010 | 10100 |
| 0011 | 00110 | 1011 | 10111 |
| 0100 | 01001 | 1100 | 11000 |
| 0101 | 01010 | 1101 | 11011 |
| 0110 | 01100 | 1110 | 11101 |
| 0111 | 01111 | 1111 | 11110 |

  Recomputed every row (parity = number of 1s in the dataword mod 2): all 16 match.
- Slides 28-30, **Encoder and Decoder for Simple Parity-Check Code**: "The calculation is done in **modular arithmetic**." Encoder formula: "**r0 = a3 + a2 + a1 + a0 (modulo-2)**". Decoder formula: "**s0 = b3 + b2 + b1 + b0 + q0 (modulo-2)**". Slide 30 caption: "**If the syndrome is 0, there is no detectable error in the received codeword.**"
  - Figure (slide 30), redraw: **Sender** box, red label "Encoder": "Dataword" cells a3 a2 a1 a0 (blue); each bit drops straight down to the codeword and also branches (dots) into a "Generator" box; "Parity bit" out of the Generator into cell r0 (yellow); bottom row "Codeword" a3 a2 a1 a0 r0. Red arrow to the **Receiver** box, red label "Decoder": bottom row "Codeword" b3 b2 b1 b0 q0 (q0 yellow); all five bits branch into a "Checker" box; Checker outputs "Syndrome" s0 (orange) into a "Decision logic" box; the four data bits b3..b0 also go up into Decision logic; outputs: "Accept" up to the "Dataword" cells a3 a2 a1 a0 at the top, and four arrows right labelled "Discard".
  - Worked [new, computed]: dataword 1011 → r0 = 1+0+1+1 = 3 mod 2 = **1** → codeword **10111** (table row matches). Received 10111 → s0 = 1+0+1+1+1 = 4 mod 2 = **0** → accept. Received 10011 (one bit flipped) → s0 = 1+0+0+1+1 = 3 mod 2 = **1** → discard. Received 11011 (two bits flipped from 10111) → s0 = 1+1+0+1+1 = 4 mod 2 = **0** → accepted as dataword 1101: an **undetected** 2-bit error (11011 is a valid codeword). This is the "decoder failed" case of slide 37 for parity.

## 07a — Cyclic codes (slides 31-33)

- Final build (slide 33): "**Cyclic codes**: Special linear block codes with **one extra property**: if a codeword is cyclically shifted (**rotated**), the result is another codeword. E.g., If **1011000** is a codeword → cyclic left-shift → **0110001** is also a codeword"
  - Checked: 1011000 rotated left one place = 011000**1**; both are in the slide-34 table (datawords 1011 and 0110). Every rotation of every slide-34 codeword is in the table [computed].
- "**Advantages** of cyclic codes: Very good performance in detecting single-bit errors, double errors, and burst errors. Can easily be implemented in hardware and software. Especially fast when implemented in hardware."
- "**Our focus**: A subset of cyclic codes called **Cyclic Redundancy Check (CRC)**, which is used in LANs and WANs"

## 07a — A CRC code with C(7, 4) (slide 34)

- "n=7, k=4". Table (the three remainder bits in blue in the original):

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

  The slide does not say which divisor generated it. Recomputed: every row is dataword + remainder of (dataword followed by 000) ÷ **1011** in mod-2 division. All 16 match. Minimum distance of the table: **3** [computed].

## 07a — CRC encoder and decoder (slides 35-37)

- Blue annotation on slides 35-37: "**k = 4, n = 7**; **size of divisor = n−k+1**; **size of remainder = n−k**". So the divisor is 7 − 4 + 1 = 4 bits and the remainder 7 − 4 = 3 bits.
- Figure (slide 37, full), redraw: **Sender** box, red "Encoder": Dataword a3 a2 a1 a0 (light blue); each bit drops to the codeword row and branches into a "Generator" box, together with three extra inputs labelled "0 0 0" (the appended zeros); three lines out of the Generator labelled "Remainder" (vertical text) go into r2 r1 r0 (yellow); bottom "Codeword" a3 a2 a1 a0 r2 r1 r0. Between sender and receiver: "Divisor" d3 d2 d1 d0 (dark grey cells) with a double-headed arrow and red label "**Shared**". Red arrow to the **Receiver**, red "Decoder": "Codeword" b3 b2 b1 b0 q2 q1 q0 (q's yellow); all seven bits go into a "Checker"; Checker → "Syndrome" s2 s1 s0 (orange) → "Decision logic"; b3..b0 also go up into Decision logic; outputs "Accept" → "Dataword" a3 a2 a1 a0 at the top, and arrows right labelled "Discard".
- Slide 37 caption: "**If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.**"
  - Example of "failed to detect" [new, computed]: sent 1001110; the channel flips the three bits of pattern 1011000 → received 0010110, which is itself a valid codeword (dataword 0010); 0010110 ÷ 1011 leaves syndrome 000 → accepted, wrong.

## 07a — Division in CRC encoder (slide 38)

- Figure, redraw exactly: "Dataword" [1 0 0 1] (blue) ↓ into a box labelled "Encoding". Inside: red "Quotient" over **1 0 1 0** with an arrow to a box "Discard". Red "Divisor" **1 0 1 1** (blue digits) ) **1 0 0 1 0 0 0** with the last three digits 000 in a yellow box, red "Dividend" with an arrow pointing at it. Then the division rows, divisor rows in blue, blue arrows showing each next bit brought down:

```text
             1 0 1 0          <- Quotient (discarded)
        ________________
1 0 1 1 ) 1 0 0 1 0 0 0       <- Dividend = dataword + 000
          1 0 1 1
          -------
            0 1 0 0           bring down 0
            0 0 0 0           "Leftmost bit 0: use 0000 divisor"
            -------
              1 0 0 0         bring down 0
              1 0 1 1
              -------
                0 1 1 0       bring down 0
                0 0 0 0       "Leftmost bit 0: use 0000 divisor"
                -------
                  1 1 0       <- Remainder (yellow)
```

  Callouts: two boxes "Leftmost bit 0: use 0000 divisor"; red "Note:" box "Multiply: AND / Subtract: XOR". Out of the box: "Codeword" [1 0 0 1 | 1 1 0] (dataword blue, remainder yellow), caption "Dataword plus remainder".
- Recomputed step by step: 1001 ⊕ 1011 = 0010 → drop the leading 0, bring down 0 → 0100; leading 0 → ⊕ 0000 = 0100 → 100, bring down 0 → 1000; ⊕ 1011 = 0011 → 011, bring down 0 → 0110; leading 0 → ⊕ 0000 = 0110 → remainder **110**. Quotient bits 1, 0, 1, 0 = **1010**. Codeword **1001110** = slide-34 row for 1001. **Matches the slide.**

## 07a — Division in CRC decoder for two cases (slides 39-40)

- Slide 40 shows both side by side (slide 39 is the left half alone).
- **Uncorrupted** (left): "Codeword" [1 0 0 1 | 1 1 0] ↓ "Decoder":

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
                0 0 0 0       (red)
                -------
                  0 0 0       "Zero" (red)  Syndrome
```

  → "Dataword accepted" [1 0 0 1].
- **Corrupted** (right): "Codeword" [1 0 0 **0** | 1 1 0] (the fourth bit, now 0, in blue: the dataword's last bit flipped) ↓ "Decoder":

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
                  0 1 1       "Non-Zero" (red)  Syndrome
```

  → "Dataword discarded" (grey filled box).
- Recomputed both: 1001110 ÷ 1011 → steps 0010, 0101, 0000, 0000 → quotient 1010, syndrome **000**. 1000110 ÷ 1011 → 1000 ⊕ 1011 = 0011 → 0111 ⊕ 0000 = 0111 → 1111 ⊕ 1011 = 0100 → 1000 ⊕ 1011 = 0011 → quotient 1011, syndrome **011**. **Both match the slide.**
- Single-bit error syndromes for codeword 1001110 and divisor 1011 [new, computed]: flipping bit 1 (leftmost) … bit 7 gives syndromes 101, 111, 110, 011, 100, 010, 001: all seven different and non-zero, so every single-bit error is detected (and, because they differ, the position could even be located). The slide's corrupted case is bit 4 → 011.
- A 2-bit error [new, computed]: 1001110 ⊕ 1100000 = 0101110 → syndrome 010 → detected.

## 07c — Modulo 2 arithmetic (complementary notes, 2 pages)

Header "Modulo 2 Arithmetic", URL `http://www.csus.edu/indiv/p/pangj/class/cpe166_lec_@/ecc/modulo2.htm`, printed 9/22/2009.

- "Modulo 2 arithmetic is performed digit by digit on binary numbers. Each digit is considered independently from its neighbours. Numbers are not carried or borrowed."
- "**Addition/Subtraction**: Modulo 2 addition/subtraction is performed using an exclusive OR (xor) operation on the corresponding binary digits of each operand. 0 ± 0 = 0; 0 ± 1 = 1; 1 ± 0 = 1; 1 ± 1 = 0" (the text extraction loses the ± sign).
- "**Multiplication**": 1011 × 0101, partial products 1011, 0000 (shifted 1), 1011 (shifted 2), 0000 (shifted 3), sum **0100111**. Recomputed: 1011 ⊕ 101100 = 100111 → 0100111 in 7 digits. **Matches.**
- "**Division**: Modulo 2 division can be performed in a manner similar to arithmetic long division. Subtract the denominator (the bottom number) from the leading parts of the enumerator (the top number). Proceed along the enumerator until its end is reached. Remember that we are using modulo 2 subtraction. For example, we can divide 100100110 by 10011 as follows:"

```text
              10001 remainder 101
10011 | 100100110
        10011
            10110
            10011
              101
```

  Recomputed: 10010 ⊕ 10011 = 00001; bring down 0, 1, 1 with three quotient 0s (00010, 00101, 01011); bring down 0 → 10110 ⊕ 10011 = 00101 → quotient **10001**, remainder **0101** (written 101). **Matches.** The note skips the rows where the leading bit is 0 (it shifts instead of writing 00000); the slide-38 style writes them out with a 0000 divisor. Both give the same remainder; the writers should teach the slide style because the quiz will expect the slide's layout.
- "This has the effect that X/Y = Y/X. For example: 11001 | 10011 → 1 remainder 1010" and "10011 | 11001 → 1 remainder 1010".
  - Recomputed: 10011 ⊕ 11001 = 01010 both ways; quotient 1, remainder 1010. **Matches.**
  - FLAG: the note's line "X/Y = Y/X" is only true in this special case (two numbers of the same length, both starting with 1, so one subtraction finishes the division and XOR is symmetric). It is not a general rule of mod-2 division. Writers: do not teach it as a rule; at most a T/F trap.
  - Also note the 07c page uses "numerator/denominator" loosely ("enumerator"); CRC wording is **dividend** and **divisor** (slide 38).

## 07a — Checksum (slides 41-44)

- Slides 41-42: "An **error-detecting technique** that can be applied to a message of **any length**. Mostly used at the **network** and **transport layers** rather than the data-link layer."
- Slide 42 figure, redraw: **Sender**: "Message" = row of cells "m bits | m bits | • • • | m bits"; it goes down to the bottom row and also (dot) into a "Generator" box; Generator → a yellow "m bits" cell appended at the right; bottom caption "Message plus checksum". Red arrow → **Receiver**: bottom row "m bits | m bits | • • • | m bits | m bits (yellow)" caption "Message plus checksum"; all cells go up into a "Checker" box → a yellow "m bits" result → red diamond (decision) with a yellow sticky note "All 0's"; from the diamond "[yes]" up to the "Message" row at the top (accepted), "[no]" left to "Discard".
- Slide 43, **Checksum – Example**: "Suppose the message is a list of **five 4-bit numbers** that we want to send to a destination (**7, 11, 12, 0, 6**): In addition to sending these numbers, we send the **sum** of the numbers. E.g., we send (**7, 11, 12, 0, 6, 36**), where **36** is the sum of the original numbers. The receiver adds the five numbers and compares the result with the sum. If the two are the same, the receiver assumes no error, accepts the five numbers, and discards the sum. Otherwise, there is an error somewhere and the message is not accepted."
  - Recomputed: 7 + 11 + 12 + 0 + 6 = 36. Matches.
- Slide 44: "The previous example has one issue: Each number can be written as a 4-bit word (each is less than 15) **except for the sum**. **Solution**: Use **one's complement** arithmetic."
  - FLAG (minor wording): 15 = 1111 also fits in 4 bits; "less than 16" or "at most 15" is what is meant. 36 = 100100 needs 6 bits.

## 07a — One's complement arithmetic (slides 45-47)

- Slide 47 (final build): "Unsigned numbers between 0 and 2^m−1 are represented using only m bits."
- "If the number has more than m bits, the **extra leftmost bits** need to be added to the **m rightmost bits** (**wrapping**). E.g., decimal number 36 in binary → **100100**, to change it to a 4-bit number: (**10**)₂ + (**0100**)₂ = (**0110**)₂ → (**6**)₁₀"
  - Recomputed: 36 = 32 + 4 = 100100; leftmost extra bits 10 = 2; rightmost 4 bits 0100 = 4; 2 + 4 = 6 = 0110. Matches.
- "The **complement** of a number is found by changing all 1s to 0s and all 0s to 1s. The same as subtracting the number from 2^m−1."
- "In one's complement arithmetic, we have **two 0s**: one positive and one negative, which are complements of each other. The positive zero has all m bits set to 0 (**0000**); the negative zero has all bits set to 1 (it is 2^m−1) (**1111**)."
- Complement check: 6 = 0110 → flip → 1001 = 9; and 2^4 − 1 − 6 = 15 − 6 = 9. Same.

## 07a — Checksum example with 4-bit binary numbers (slides 48-49)

- Slide 49 figure (slide 48 is the sender half alone), redraw:
  - **Sender** box: rows `0111 7`, `1011 11`, `1100 12`, `0000 0`, `0110 6`; "Initialized checksum → 0000 **0** (red)"; a rule; "Sum (in one's complement) → **0110** (blue) 6"; "Actual checksum → **1001** (green) **9** (red)". Under the box: "36 = (100100)₂ = (10)₂ + (0100)₂ = (**0110**)₂ = **6**" and "One's Complement of **6** is **9** = (**1001**)₂".
  - Middle: red arrow through a blue box "**7, 11, 12, 0, 6, 9**" (the 9 in red) labelled "Packet".
  - **Receiver** box: rows `0111 7`, `1011 11`, `1100 12`, `0000 0`, `0110 6`; "Received Checksum → **1001** **9** (red)"; rule; "Sum (in one's complement) → **1111** (blue) 15"; "Calculated Checksum → **0000** (green) **0** (red)". Under: "36 + 9 = 45 = (101101)₂ = (10)₂ + (1101)₂ = (**1111**)₂ = **15**" and "One's Complement of **15** is **0** = (**0000**)₂".
- Recomputed: sender 7 + 11 + 12 + 0 + 6 + 0 = 36 = 100100 → 10 + 0100 = 0110 = 6 → complement 1001 = **9**. Receiver 36 + 9 = 45 = 101101 → 10 + 1101 = 1111 = 15 → complement **0000** → accept. **Both match.**
- Same example in hex [derived]: 7 + B + C + 0 + 6 = **0x24**; with 4-bit words a hex digit is one word, so wrapping adds the hex digits: 2 + 4 = **6**; complement F − 6 = **9**. Receiver: 0x24 + 9 = 0x2D → 2 + D = **F** → F − F = **0**.
- A corrupted packet [new, computed]: receiver gets (7, 11, 12, 0, **7**, 9): sum = 46 = 0x2E = 101110 → 10 + 1110 = **10000** (still 5 bits, so wrap again) → 1 + 0000 = 0001 → complement **1110 = 14 ≠ 0** → rejected. Teaches that wrapping repeats until the sum fits in m bits.

## 07a — Procedure to calculate the traditional checksum (slide 50)

- "Traditionally, the Internet has used a **16-bit checksum**." Table, verbatim:

| Sender | Receiver |
|---|---|
| 1. The message is divided into 16-bit words. | 1. The message and the checksum is received. |
| 2. The value of the checksum word is initially set to zero. | 2. The message is divided into 16-bit words. |
| 3. All words including the checksum are added using one's complement addition. | 3. All words are added using one's complement addition. |
| 4. The sum is complemented and becomes the checksum. | 4. The sum is complemented and becomes the new checksum. |
| 5. The checksum is sent with the data. | 5. If the value of the checksum is 0, the message is accepted; otherwise, it is rejected. |

## Checksum in hexadecimal (review list "Wrapping (Hex)"; not on any slide) [derived]

- One hex digit = 4 bits, so a 16-bit word is 4 hex digits. Add the words in hex; anything left of the rightmost four hex digits is the carry; **wrap** by adding the carry to the rightmost four digits; repeat if that produces a fifth digit again. **Complement** in hex: replace every digit d by F − d (same as FFFF − sum).
- **Textbook example [textbook, unverified that it is the textbook's; numbers recomputed]**: the text "Forouzan" as 16-bit words (ASCII pairs): Fo = 0x466F, ro = 0x726F, uz = 0x757A, an = 0x616E. Sum = **0x18FC6** → wrap: 8FC6 + 1 = **0x8FC7** → complement: F−8, F−F, F−C, F−7 = **0x7038**. Receiver: 466F + 726F + 757A + 616E + 7038 = 0x1FFFE → FFFE + 1 = **0xFFFF** → complement **0x0000** → accept.
- New practice sets [new, computed]:

| Words (m bits) | Raw sum | Wrapped | Checksum | Receiver check |
|---|---|---|---|---|
| 5, 9, 14, 3, 10 (4-bit) | 41 = 0x29 = 101001 | 10 + 1001 = 1011 = 11 = 0xB | 0100 = **4** | 41 + 4 = 45 → 1111 → 0 accept |
| 15, 15, 15, 15 (4-bit) | 60 = 0x3C | 3 + C = F = 15 | **0** | — |
| 10110011, 01101100, 11100101 (8-bit) | 1000000100 = 0x204 | 10 + 00000100 = 00000110 = 0x06 | 11111001 = **0xF9** | — |
| 0x3F, 0xA7, 0xE2 (8-bit) | 0x1C8 | C8 + 1 = 0xC9 | **0x36** | 0x3F + 0xA7 + 0xE2 + 0x36 = 0x1FE → FF → 0 accept |
| 0xAB12, 0x9F34, 0x7C56 (16-bit) | 0x1C69C | C69C + 1 = 0xC69D | **0x3962** | + 0x3962 = 0x1FFFE → FFFF → 0 accept |
| 0xAB12, 0x9F34, **0x7C57**, 0x3962 received (one bit flipped) | 0x1FFFF | FFFF + 1 = 0x10000 → wrap again 0000 + 1 = 0x0001 | new checksum **0xFFFE ≠ 0** | reject |
| 0x1234, 0xF00D, 0xBEEF (16-bit) | 0x1C130 | C130 + 1 = 0xC131 | **0x3ECE** | — |
| 0xFFFF, 0xFFFF, 0xFFFF, 0x0002 (16-bit) | 0x2FFFF | FFFF + 2 = 0x10001 → 0001 + 1 = 0x0002 | **0xFFFD** | double wrap |
| 0x8F3A, 0x61C9 (16-bit) | 0xF103 | no carry, nothing to wrap | **0x0EFC** | — |

## 07a — Forward error correction (slides 51-57)

- Slide 51, **Forward Error Correction (FEC)**: "Retransmission of corrupted and lost packets is not useful for real-time **multimedia transmission**. Due to **unacceptable delay** in reproducing. In such applications, we need to correct the error or reproduce the packet immediately."
- Slide 52, **FEC Techniques**: "Hamming distance; Using XOR; Chunk interleaving; …"
- Slide 53, **FEC Techniques – Hamming Distance**: "To **detect s errors**, dmin = s + 1. For error correction, we need more distance. To **correct t errors**, we need to have **dmin = 2t + 1**. E.g., if we want to correct 10 bits in a packet, we need to make the minimum hamming distance 21 bits → lot of redundant bits need to be sent with the data"
  - Recomputed: 2 × 10 + 1 = 21. Matches.
- Slides 54-55, **FEC Techniques – Using XOR**: "Using the property of XOR operation: **R = P1 ⊕ P2 ⊕ … ⊕ Pi ⊕ … ⊕ PN**. This means: **Pi = P1 ⊕ P2 ⊕ … ⊕ R ⊕ … ⊕ PN**" (R and Pi in blue; in the second line R takes Pi's place). "We can divide a packet into N chunks, create the XOR of all the chunks and send N+1 Chunks. If any chunk is lost or corrupted, it can be created at the receiver site." "(If N = 4, it means that we need to send 25 percent extra data and be able to correct the data if only one out of four chunks is lost.)"
  - Recomputed: 1 extra chunk per N = 4 data chunks → 1/4 = 25 %. General overhead = 1/N.
  - Worked [new, computed]: P1 = 1010, P2 = 0111, P3 = 1100, P4 = 0011 → R = 1010 ⊕ 0111 = 1101; ⊕ 1100 = 0001; ⊕ 0011 = **0010**. P3 lost → P1 ⊕ P2 ⊕ P4 ⊕ R = 1101 ⊕ 0011 = 1110; ⊕ 0010 = **1100** = P3. Avoid the chunk set 1010, 0111, 1100, 0001: its R is 0000 and makes a confusing example.
  - The scheme repairs **one** lost chunk per group; two lost chunks cannot be rebuilt.
- Slide 56, **FEC Techniques – Chunk Interleaving**: "Allowing some small chunks to be missing at the receiver. Not all the chunks belonging to the same packet can be missing. We can afford to let one chunk be missing in each packet."
- Slide 57, **Chunk Interleaving – Example** figure, redraw:
  - **a. Packet creation at sender**: a 5 × 5 grid; rows "Packet 1" … "Packet 5"; cells written right to left: Packet 1 = `05 04 03 02 01`, Packet 2 = `10 09 08 07 06`, Packet 3 = `15 14 13 12 11`, Packet 4 = `20 19 18 17 16`, Packet 5 = `25 24 23 22 21`. Arrow down the side: "Sending column by column".
  - **b. Packets sent** (left to right on the page, the rightmost leaves first): Packet 5 `25 20 15 10 05`, Packet 4 `24 19 14 09 04`, Packet 3 `23 18 13 08 03`, Packet 2 `22 17 12 07 02`, Packet 1 `21 16 11 06 01`. (Sent Packet j carries chunk j of every original packet: the rightmost column first.)
  - **c. Packets received**: the same, but Packet 3 is five orange empty cells labelled red "**Lost**".
  - **d. Packet recreation at receiver**: the 5 × 5 grid rebuilt "Receiving column by column" (arrow up): Packet 1 `05 04 [ ] 02 01`, Packet 2 `10 09 [ ] 07 06`, Packet 3 `15 14 [ ] 12 11`, Packet 4 `20 19 [ ] 17 16`, Packet 5 `25 24 [ ] 22 21`: the middle column (chunks 03, 08, 13, 18, 23) orange/missing. Each original packet is missing **one** chunk out of five instead of one packet missing all five.

## 07a — Summary, references, reading (slides 58-60)

- Slide 58 Summary: "Possibility of data corruption during transmission; Sending redundant bits with data for error detection/correction; Block coding; Hamming distance; Cyclic codes as special linear block codes; Internet checksum to detect errors in messages of any size".
- Slide 59: "[1] Behrouz A.Forouzan, Data Communications & Networking with TCP/IP Protocol Suite, 6th Ed, 2022, McGraw-Hill companies."
- Slide 60 Reading: "Chapter 3 of the textbook, section 3.2.2. Chapter 3 of the textbook, section 3.6 (Practice Test)".

---

## 07b — Title, learning outcomes, introduction (slides 1-3)

- Slide 2, **Learning Outcomes**: "Explain the DLC (Data-Link Control) services. Explain DLC protocols and how they function."
- Slide 3, **Introduction**: "The **data link control (DLC)** deals with procedures for communication between two adjacent nodes (**node-to-node communication**). No matter whether the link is dedicated or broadcast. We discussed that data link control functions include framing and flow and error control. The other sublayer in data-link layer is MAC. DLC functions/services: **Framing**, **Flow control**, **Error control**"
  - Ties to Week 6 (06b): DLC = issues common to point-to-point and broadcast links; MAC = shared-medium issues. Module `comp3721-w6`, lesson `data-link-services`.

## 07b — Framing (slides 4-7)

- Final build (slide 7), title "Framing Analogy: Postal System" (no picture on any of slides 4-7; the title is the only trace of the analogy):
  - "The data-link layer needs to pack bits into **frames**, so that each frame is distinguishable from another."
  - "The message is usually packed into **multiple frames**, **why**? Inefficient flow and error control if the frame is very large → a single-bit error requires retransmission of the whole frame"
  - "Framing in the data-link layer separates a message from one source to a destination by adding a **sender address** and a **destination address**."
  - The analogy itself [textbook, unverified]: the postal system puts each letter in an envelope with sender and destination addresses, which separates one piece of information from another.

## 07b — Frame size (slide 8)

- "**Frame size**: **Fixed** → no need to define boundaries, frame size is fixed! **Variable** → prevalent in LANs (we need a way to define the end of a frame and the beginning of the next)"
- "To define the end of the frame we have two approaches: 1. **Character (byte)-oriented approach** 2. **Bit-oriented approach**"
- Fixed-size example [textbook, unverified]: ATM cells in wide-area networks. Not on the slide.

## 07b — Character-oriented approach: format of a frame (slides 9-12)

- One figure, four builds, each pointing at one field. Redraw: a horizontal frame `[Flag (red text) | Header (black) | light-blue cells … • • • … light-blue cells | Trailer (black) | Flag (red text)]`; above the blue cells a bracket "Data from upper layer / Variable number of characters" ("characters" boxed in red on slide 9).
  - Slide 9 (arrow to the data cells): "Data to be carried are 8-bit characters from a coding system such as ASCII."
  - Slide 10 (arrow to Header): "Source and destination addresses and other control information."
  - Slide 11 (arrow to Trailer): "Error detection redundant bits."
  - Slide 12 (arrows to both Flags): "To separate one frame from the next. It is composed of protocol-dependent special characters (8-bit (1-byte))."

## 07b — Character-oriented approach: problem, byte stuffing (slides 13-16)

- Slide 13, **Problem**: "Character-oriented framing was popular when only **text** was exchanged. In addition to text, we send other types of information such as graphs, audio, and video; **any character used for the flag could also be part of the information**. If this happens, the receiver, when it encounters this pattern in the middle of the data, **thinks** it has reached the end of the frame."
- Slide 14, **Byte Stuffing and Unstuffing**: "**Byte stuffing** (**character stuffing**) is the process of adding one extra byte (with a predefined bit pattern), which is called the escape character (**ESC**), whenever there is a flag or ESC in the text." "Whenever the receiver encounters the **ESC character**, it removes it from the data section and treats the **next character** as **data**, not as a delimiting flag."
- Slide 15 figure, redraw:
  - "Data from upper layer": 6 byte cells `[ d | Flag | d | d | ESC | d ]` (d = plain light-blue data byte).
  - red arrow "Stuffed" ↓
  - "Frame sent": `[Flag | Header | d | ESC (orange) | Flag | d | d | ESC (orange) | ESC | d | Trailer | Flag]`
  - double arrows between the two orange ESCs of the sent and received frames, label "**Two extra bytes**"
  - "Frame received": identical to the frame sent.
  - red arrow "Unstuffed" ↓
  - "Data to upper layer": `[ d | Flag | d | d | ESC | d ]` (same as the input).
  - Rule checked: 6 data bytes, one Flag and one ESC among them → each gets an ESC in front → 8 bytes, 2 extra. The data's ESC is stuffed too, otherwise the receiver would remove it and treat the byte after it as data.
- Practice [new, computed]: data `A FLAG B ESC C` → stuffed `A ESC FLAG B ESC ESC C`, 5 → 7 bytes. Data `D1 FLAG ESC D2 FLAG` → `D1 ESC FLAG ESC ESC D2 ESC FLAG`, 5 → 8 bytes, 3 extra. Data `ESC ESC` → `ESC ESC ESC ESC`. Unstuffing `X ESC ESC ESC FLAG Y` → `X ESC FLAG Y` (the receiver removes each ESC and keeps the next byte, whatever it is).
- Slide 16, **The Other Problem!**: "The universal coding systems in use today, such as **Unicode**, have 16-bit and 32-bit. Characters that conflict with 8-bit characters. In general, the tendency is moving toward the **bit-oriented** protocols."

## 07b — Bit-oriented approach (slides 17-21)

- Slides 17-18 figure, redraw: `[01111110 (red) | Header | 01111010110 • • • 11011110 (light blue) | Trailer | 01111110 (red)]`, both end fields labelled red "Flag"; bracket over the data "Data from upper layer / Variable number of bits" ("bits" boxed in red on slide 18).
- Slide 18 caption: "A special 8-bit pattern as the delimiter to define the beginning and the end of the frame – **01111110** is the common flag between most protocols."
  - Checked: the figure's data fragments 01111010110 and 11011110 contain no run of five 1s, so nothing would be stuffed in them.
- Slides 19-20, **Bit Stuffing and Unstuffing**: "**Bit stuffing** is the process of adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern **01111110** for a flag."
  - Reading of the rule: after a 0, count consecutive 1s; when the count reaches five, insert a 0 and restart the count. The stuffed 0 goes in **whatever the next bit is** (even if the next data bit is already 0). At the very start of the data the preceding bit is the flag's last 0, so five leading 1s are also stuffed. The receiver removes the 0 that follows any five consecutive 1s (unstuffing).
  - [textbook, unverified]: Forouzan words it "if a 0 and five consecutive 1 bits are encountered, an extra 0 is added", the same rule.
- Slide 21 figure, redraw:
  - "Data from upper layer": `0001111111001111101000` (22 bits).
  - red arrow "Stuffed" ↓
  - "Frame sent": `[Flag | Header | 000111110110011111001000 | Trailer | Flag]`, the data field drawn with two red 0s: the 9th bit and the 19th bit of the stuffed field (`00011111 0 1100 11111 0 01000`).
  - arrows from the two red 0s, label "**Two extra bits**".
  - "Frame received": identical.
  - red arrow "Unstuffed" ↓ "Data to upper layer": `0001111111001111101000`.
  - Recomputed: `000` `11111`→stuff 0 `11` `00` `11111`→stuff 0 `01000` → `000 11111 0 11 00 11111 0 01000` = **000111110110011111001000**, 24 bits, 2 extra. The first stuffed 0 comes after data bit 8 (the data had seven 1s in a row, bits 4-10; the stuff breaks them as 11111 0 11). The second comes after data bit 17 (bits 13-17 are 11111), and data bit 18 is already a 0: stuffed anyway. In the 24-bit stuffed field the extra 0s are bits 9 and 19. **Matches the slide.**
- Practice [new, computed; each unstuffs back to the input]:

| Data | Stuffed | Extra bits |
|---|---|---|
| 01111110 (the flag pattern as data) | 011111010 | 1 |
| 0111111111110 | 011111011111010 | 2 |
| 1111101111110 | 111110011111010 | 2 |
| 11111111111111111 (seventeen 1s) | 11111011111011111011 | 3 |
| 0110111111111100 | 011011111011111000 | 2 |
| 000111111 | 0001111101 | 1 |

  Unstuffing practice: received `0001111101100` → remove the 0 after 11111 → **000111111100**.
- FLAG (cross-week confusion): Week 6 (06a, slide 43) calls TDM **pulse stuffing** also "bit padding, bit stuffing" (dummy bits that raise a slower line to the dominant rate). That is a different thing from 07b's framing bit stuffing (a 0 after five 1s). A likely trap.

## 07b — Flow control (slides 22-23)

- Slide 22: "Whenever an entity produces items and another entity consumes them, there should be a **balance** between **production** and **consumption rates**. If the **rate** of **produced** frames is higher than the **rate** of **consumed** frames, frames at the **receiving end** need to be **buffered** while waiting to be consumed (processed). A **buffer** is a set of memory locations that can hold packets at the sender and receiver."
- Slide 23: "Different strategies to implement flow control: 1. The receiving data-link layer **drops the frames** if its buffer is full. 2. Receiving data-link layer sends a **feedback** to the sending data-link layer to ask it to stop or slow down."
- Slide 23 figure: "Sending node / Data-link layer" box with a yellow "Producer" → bold arrow "Frames are pushed" → "Receiving node / Data-link layer" box with a yellow "Consumer"; a red arrow from the consumer back to the producer labelled "**Flow control**".

## 07b — Error control (slides 24-25)

- Slide 24: "A CRC is added to the **frame header** by the sender and checked by the receiver. Two approaches: 1. Corrupted frames are **discarded**, and the uncorrupted ones are delivered to the network layer. Mostly used in wired LANs such as **Ethernet**. 2. Corrupted frames are **discarded**, and an **acknowledgment** is sent (for the purpose of both flow and error control) to the sender for the **uncorrupted frames**."
  - FLAG: slide 24 says the CRC goes in the frame **header**; slides 11 (07b) say the **trailer** carries the "Error detection redundant bits", and slides 33 draws the CRC at the end of the frame (the black block after the data). [textbook, unverified]: Forouzan also writes "added to the frame header" in this paragraph. Writers: say the error-detection bits ride in the trailer, as the frame-format figure shows, quote slide 24 once, and do not make a T/F item that hinges on header vs trailer.
- Slide 25, **Combination of Flow and Error Control**: "The **acknowledgment** that is sent for **flow control** can also be used for **error control** to tell the sender the packet has arrived **uncorrupted**. The lack of acknowledgment means that there is a problem in the sent frame."

## 07b — DLC protocols and finite state machines (slides 26-29)

- Slide 26, **Data-Link Layer Protocols**: "Two most commonly used DLC protocols to deal with flow and error control: 1. **Simple** 2. **Stop-and-Wait**. The behavior of a data-link-layer protocol can be better shown as a **finite state machine (FSM)**."
- Slide 27: "FSM is used to simulate sequential logic. An FSM is thought of as a machine (system) with a finite number of states. The machine is always in one of the states until an event occurs. **Rounded-corner rectangles** or **circles** to show **states**. **Colored text** to show **events**. **Regular black text** to show **actions**."
- Slide 28 figure, redraw: two green rounded rectangles "State I" (left) and "State II" (right). Red arrow into State I from the left; red "Note: The colored arrow shows the starting state." Arrow over the top from State I to State II with a yellow box "**Event 1** (magenta) / Action 1. / Action 2." Self-loop on State II with a yellow box "**Event 2** / Action 3." Arrow along the bottom from State II back to State I with a yellow box "**Event 3**" and no action.
- Slide 29, **FSM – Example**: a photo of a turnstile, a state diagram and a table. Diagram: circles "Locked" and "Un-locked"; a black dot with an arrow into Locked (start); self-loop on Locked labelled "Push"; arrow Locked → Unlocked labelled "Coin"; self-loop on Unlocked labelled "Coin"; arrow Unlocked → Locked labelled "Push". Table verbatim:

| Current State | Input | Next State | Output |
|---|---|---|---|
| Locked | coin | Unlocked | Unlocks the turnstile so that the customer can push through. |
| Locked | push | Locked | None |
| Unlocked | coin | Unlocked | None |
| Unlocked | push | Locked | When the customer has pushed through, locks the turnstile. |

## 07b — Simple protocol (slides 30-32)

- Slide 30: "**No flow and error control**. Assumption is that the receiver can never be overwhelmed with incoming frames."
- Slide 30 figure: "Sending node" (Network on top with an orange packet, a red dashed arrow down into a yellow "Data-link" area holding a light-blue frame) → red arrows along a "Logical link" with one "Frame" drawn above it → "Receiving node" (frame in the yellow data-link area, red dashed arrow up to an orange packet in "Network").
- Slide 31, **Simple Protocol – FSM**: two rounded boxes.
  - "Sending node": state "Ready" (Start arrow in, blue), one self-loop; label: event (blue) "**Packet came from network layer.**" / action "Make a frame and send it."
  - "Receiving node": state "Ready" (Start arrow), one self-loop; event "**Frame arrived.**" / action "Deliver the packet to network layer."
- Slide 32, **Simple Protocol – Flow Diagram**: columns "Sending node: Network | Data-link" and "Receiving node: Data-link | Network", each with a dashed vertical time line ending in "Time". Blue dashed "Packet" arrow Network → Data-link at the sender; black slanted "Frame" arrow across to the receiver's data-link (lower, because it takes time); blue dashed "Packet" arrow to the receiver's Network. Twice, then "• • •". No acknowledgments.

## 07b — Stop-and-Wait protocol (slides 33-36)

- Slide 33: "A **connection-based** (connection-oriented) protocol. **Both flow and error control provided**. The sender sends one frame at a time and waits for an acknowledgment before sending the next one. A **timer** used by the sender (if the timer expires, the frame is retransmitted). If the CRC is correct, the receiver will send an acknowledgement."
- Slide 33 figure: "Sending node" and "Receiving node" (Network over Data-link) joined by a "Logical link (duplex)" drawn as two lanes: on the top lane a "Frame" (blue block with a black tail labelled "CRC") travels right; on the bottom lane an "ACK" (small block, black tail "CRC") travels left. "Timer" (clock icon) under the sending node.
- Slide 34, **Stop-and-Wait Protocol – FSM**, redraw:
  - **Sending node**: states "Ready" (red Start arrow) and "Blocking".
    - Ready → Blocking: "**Packet came from network layer.**" / "Make a frame, save a copy, and send the frame. Start the timer."
    - Blocking self-loop: "**Time-out.**" / "Resend the saved frame. Restart the timer."
    - Blocking self-loop: "**Corrupted ACK arrived.**" / "Discard the ACK."
    - Blocking → Ready: "**Error-free ACK arrived.**" / "Stop the timer. Discard the saved frame."
  - **Receiving node**: one state "Ready" (Start arrow) with two self-loops:
    - "**Corrupted frame arrived.**" / "Discard the frame."
    - "**Error-free frame arrived.**" / "Extract and deliver the packet to network layer. Send ACK."
  - Not on the slide: while Blocking, a new packet from the network layer is not accepted; the FSM has no such transition, which is the flow control.
- Slide 35, **Stop-and-Wait Protocol – Flow Diagram**, redraw (columns as on slide 32). Legend: dark blue clock "Start the timer.", white clock "Stop the timer.", light blue clock "Restart a time-out timer." Notes: "A *lost* frame means either lost or corrupted. A *lost* ACK means either lost or corrupted." Four exchanges top to bottom:
  1. Packet → data-link; timer started; "Frame" → receiver → "Packet" up; "ACK" back; timer stopped.
  2. Packet; timer started; "Frame" → "Lost" (the arrow breaks off midway); timer restarted (time-out); "**Frame (resent)**" → "Packet" up; ACK back; timer stopped.
  3. Packet; timer started; "Frame" → "Packet" up; "ACK" back → "Lost"; timer restarted (time-out); "**Frame (resent)**" → "Packet" up, labelled "**Duplicate**" (blue); ACK back; timer stopped.
  - Reading: in case 3 the receiver cannot tell the resent frame from a new one, so it delivers the same packet twice. Slide 36 fixes this with sequence numbers.
- Slide 36: "**Duplicates** and **orders** can be handled by adding a **sequence number** and **acknowledgment number** to the frames. Sequence numbers are 0, 1, 0, 1, 0, 1, . . . Acknowledgment numbers are 1, 0, 1, 0, 1, 0, … In other words, the sequence numbers start with 0, the acknowledgment numbers start with 1. An acknowledgment number always define the sequence number of the next frame to receive. A similar concept in TCP in transport layer → We'll discuss later in the course"
  - Worked trace with numbers [derived from slide 36; the slides draw no numbered flow diagram]: Frame 0 sent → arrives → receiver delivers, replies ACK 1 (next expected is 1). Frame 1 sent → lost → time-out → Frame 1 resent → delivered → ACK 0. Frame 0 sent → delivered → ACK 1 lost → time-out → Frame 0 resent → receiver expects 1, sees 0 = a **duplicate**: it **discards** it and sends ACK 1 again → sender gets ACK 1, sends Frame 1. The duplicate of slide 35 is now caught.
  - [textbook, unverified]: Forouzan's stop-and-wait FSM with numbers adds the variables S and R (next frame to send, next frame expected) and their mod-2 updates. Not on the slides; out of scope beyond the slide-36 sentences.

## 07b — Summary, references, reading (slides 37-39)

- Slide 37 Summary: "DLC responsibilities/services: Framing → Variable-size frames; Flow control; Error control. DLC Protocols: Simple protocol; Stop-and-wait protocol".
- Slide 38: Forouzan 6th ed. reference as in 07a.
- Slide 39 Reading: "Chapter 3 of the textbook, sections 3.2.1 and 3.2.3. Chapter 3 of the textbook, section 3.6 (Practice Test)".

---

## Open questions on the slides, answered

| Slide | Question | Answer | Source |
|---|---|---|---|
| 07a-6 | Burst error: "More likely to happen. Why?" | The noise usually lasts longer than one bit, so it corrupts several bits; the number affected = data rate × noise duration (slide 7 box, slide 9 example) | textbook, unverified; consistent with slides 7-9 |
| 07a-20 | "How does the Hamming distance help in error detection?" | Answered on the slide: d(sent, received) = number of corrupted bits; 0 = no error | slide |
| 07b-5 | "The message is usually packed into multiple frames, why?" | Answered on slide 6: a very large frame makes flow and error control inefficient; one bit error forces retransmission of the whole frame | slide |
| 07a-34 | Which divisor generates the C(7,4) table? | 1011 (recomputed for all 16 rows) | computed |
| — | dmin of the C(7,4) CRC table | 3: detects up to 2 errors, corrects 1 | computed |

## Slide vs textbook / internal inconsistencies to handle

1. 07a-2 "Forwarding Error Correction" vs 07a-51 "Forward Error Correction": use Forward.
2. 07b-24 "CRC is added to the frame header" vs 07b-11 "Trailer: Error detection redundant bits" and the 07b-33 drawing: teach trailer, quote 24 once, no header/trailer T/F.
3. 07c "X/Y = Y/X": true only for the equal-length example shown; not a rule.
4. 07c skips the zero-divisor rows; slide 38 writes them ("Leftmost bit 0: use 0000 divisor"). Teach the slide layout.
5. 07a-44 "each is less than 15": means at most 15 (fits in 4 bits).
6. 06a "pulse stuffing (bit padding, bit stuffing)" vs 07b "bit stuffing": different mechanisms with a shared name.
7. The review list asks for checksum wrapping in hex; no slide does it. The hex method and the "Forouzan" example are derived/textbook and labelled.
8. 07a-26's dataword 10001 has k = 5 while the C(5,4) table uses k = 4: two different parity codes, both even parity. Not an error, but say "a 5-bit dataword" in that example.
