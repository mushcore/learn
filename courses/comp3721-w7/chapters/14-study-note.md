---
title: Your one-page study note (Week 7)
minutes: 15
---

The Week 7 block of your notes: Lectures 07a, 07b and the 07c modulo-2 page in the slide's words, the formulas, the slide-38 division layout, the checksum recipe, the two stuffing rules, the Stop-and-Wait rules, the T/F traps and a fill-in bank. One A4 or letter page per quiz, preferably hand-written, plus a calculator; for the midterm it becomes the Week 7 side of a cheat sheet. Bit strings are written without spaces; hex with or without 0x.

## Lecture 07a: errors, block coding and Hamming distance

- Networks must transfer data with **acceptable accuracy**; data may become **corrupted** in passage; a small level of error may be tolerated by some applications. Most link-layer protocols simply **discard the frame** and let the **upper-layer protocols** handle the **retransmission**. [Types of errors](#/comp3721-w7/types-of-errors)
- **Single-bit error**: only 1 bit of a data unit changed. **Burst error**: 2 or more bits changed. **Burst length** = first to last corrupted bit, unchanged bits between included (slide 6: flips at 4, 5, 8, 11 → **8 bits**). Burst errors are more likely: the noise usually lasts longer than one bit (textbook answer to the slide's "Why?").
- Number of bits affected by the noise depends on the **data rate** and the **duration of noise**: bits = rate × duration. 0.001 s → **1 bit** at 1 kbps, **1000 bits** at 1 Mbps.
- **Error detection**: only looking to see if any error has occurred; the number of corrupted bits is not important. **Error correction**: the exact number of corrupted bits and their location need to be identified. The **correction** of errors is **more difficult** than the detection.
- **Redundancy**: extra bits, **added by the sender** and **removed by the receiver**, achieved through **coding schemes**; they have a relationship with the actual data.
- **Block coding** ([lesson](#/comp3721-w7/block-coding)): **dataword** = k bits; **codeword** = n = k + r bits. 2^k datawords < 2^n codewords. **One-to-one**: the same dataword is always encoded as the same codeword. The (2^n − 2^k) unused words are the invalid codes, **the trick in error detection**.
- Receiver, 3 conditions: 1. it has (or can find) a list of valid codewords; 2. a codeword changed to an invalid one is discarded; 3. a codeword changed to a **valid** one makes the error **undetectable**.
- **Hamming distance** ([lesson](#/comp3721-w7/hamming-distance)): the number of differences between corresponding bits of two words of the same size; **XOR and count the 1s**. d(011011, 001111) = 2; d(10101, 11110) = 3 (XOR 01011). d(received, sent) = number of corrupted bits; 0 = no error.
- **Linear block code**: the XOR of two valid codewords creates another valid codeword. Almost all block codes used today; nonlinear ones are not as widespread; the formal definition (Galois fields) is beyond our scope.
- **Parity-check code** ([lesson](#/comp3721-w7/parity-check)): n = k + 1, **even** parity, **d_min = 2**, a single-bit error-detecting code; finds **any odd number of errors**. Slide 26: 10001 → 100010; received 011010 has three 1s (odd) → corrupted. r0 = a3 + a2 + a1 + a0 and s0 = b3 + b2 + b1 + b0 + q0 (modulo-2). *If the syndrome is 0, there is no detectable error in the received codeword.*

**Formulas**

$$n = k + r \qquad \text{valid} = 2^k \qquad \text{invalid} = 2^n - 2^k \qquad \text{bits hit} = \text{data rate} \times \text{noise duration}$$

$$d_{min} = s + 1 \ \text{(detect } s\text{)} \qquad d_{min} = 2t + 1 \ \text{(correct } t\text{)} \qquad \text{detects } d_{min} - 1, \ \text{corrects } \lfloor (d_{min} - 1)/2 \rfloor$$

| Code or d_min | Numbers |
|---|---|
| C(5, 4) parity | 16 valid, 16 invalid; d_min 2: detects 1, corrects 0 |
| C(7, 4) CRC, divisor 1011 (computed) | 16 valid, 112 invalid; d_min 3 (computed): detects 2, corrects 1 |
| d_min 4 | detects 3, corrects 1 |
| d_min 5 | detects 4, corrects 2 |
| Slide 53: correct 10 bits | d_min = 21, detects 20 |

## Lecture 07a and 07c: CRC and modulo 2

- **Cyclic codes**: special linear block codes; a rotated codeword is another codeword (1011000 → 0110001). Good at single-bit, double and burst errors; easy in hardware and software, fast in hardware. Focus: **CRC**, used in **LANs and WANs**. [Cyclic codes](#/comp3721-w7/cyclic-codes)
- Size of divisor = **n − k + 1**; size of remainder = **n − k** (= zeros appended). C(7, 4): divisor 4 bits, remainder 3 bits. The divisor is **shared** by encoder and decoder.
- **Modulo 2**: digit by digit, no carry, no borrow; add = subtract = **XOR** (0 ± 0 = 0, 0 ± 1 = 1, 1 ± 0 = 1, 1 ± 1 = 0). Multiply: AND, subtract: XOR. 07c: 1011 × 0101 = 0100111; 100100110 ÷ 10011 → quotient 10001, remainder 101. 07c's "X/Y = Y/X" holds only for its one example, not as a rule.
- Recipe ([CRC division](#/comp3721-w7/crc-division)): 1. append n − k zeros; 2. leftmost bit 1 → XOR the divisor, leftmost bit 0 → XOR 0000; 3. drop the leading bit, bring down the next; 4. stop when every dividend bit is down; 5. the last n − k bits are the remainder; codeword = **dataword plus remainder**; the quotient is **discarded**.
- **Decoder**: divide the whole received codeword (no zeros appended); the remainder is the **syndrome**. Zero → accept; non-zero → discard. *If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.*
- Slide 40: 1001110 → syndrome **000**, dataword accepted; 1000110 → syndrome **011**, dataword discarded. 07c skips the 0000 rows; both layouts give the same remainder.

Slide 38, dataword 1001, divisor 1011, written in full:

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
                  1 1 0       <- Remainder; codeword 1001110
```

## Lecture 07a: checksum and FEC

- **Checksum**: an error-detecting technique for a message of **any length**; mostly used at the **network** and **transport layers**. [Checksum](#/comp3721-w7/checksum)
- **One's complement**: unsigned numbers 0 to 2^m − 1 in m bits. **Wrapping**: add the extra leftmost bits to the m rightmost bits, and **repeat until it fits** (36 = 100100 → 10 + 0100 = 0110 = 6). **Complement** = change every 1 to 0 and 0 to 1 = (2^m − 1) − x. Two zeros: **0000** (positive) and **1111** (negative).
- Slide 49 sender: 7 + 11 + 12 + 0 + 6 = 36 → wrap → 6 → checksum **9**; packet 7, 11, 12, 0, 6, 9. Receiver: 36 + 9 = 45 = 101101 → 10 + 1101 = 1111 = 15 → complement **0** → accept. A corrupted 7, 11, 12, 0, 7, 9 sums to 46 → 10000 → 0001 → 14 ≠ 0 → reject.
- **Hex**: one hex digit = 4 bits; the digits beyond the word's width are the carry, added back to the rightmost digits; complement each digit as **F − d** (FFFF − sum for 16 bits). Slide 49 in hex: 0x24 → 2 + 4 = 6 → F − 6 = 9. Textbook "Forouzan": 466F + 726F + 757A + 616E = 18FC6 → 8FC7 → **7038**; receiver FFFF → 0.

| Slide 50, sender | Slide 50, receiver |
|---|---|
| 1. The message is divided into 16-bit words. | 1. The message and the checksum is received. |
| 2. The value of the checksum word is initially set to zero. | 2. The message is divided into 16-bit words. |
| 3. All words including the checksum are added using one's complement addition. | 3. All words are added using one's complement addition. |
| 4. The sum is complemented and becomes the checksum. | 4. The sum is complemented and becomes the new checksum. |
| 5. The checksum is sent with the data. | 5. If the value of the checksum is 0, the message is accepted; otherwise, it is rejected. |

- **Forward Error Correction** ([FEC](#/comp3721-w7/fec)): retransmission is not useful for real-time **multimedia** because of the **unacceptable delay** in reproducing; correct the error or reproduce the packet immediately. Techniques: **Hamming distance** (d_min = 2t + 1; 10 bits → 21), **XOR**, **chunk interleaving**.
- **XOR**: R = P1 ⊕ P2 ⊕ … ⊕ PN, so Pi = P1 ⊕ … ⊕ R ⊕ … ⊕ PN; send N + 1 chunks; rebuilds **one** lost chunk per group. Overhead = 1/N: N = 4 → **25 percent** extra data. 1010, 0111, 1100, 0011 → R = 0010.
- **Chunk interleaving**: send column by column; one lost packet leaves **one chunk missing in each packet** (slide 57: chunks 03, 08, 13, 18, 23).

## Lecture 07b: framing and stuffing

- **DLC**: procedures for node-to-node communication, dedicated or broadcast link; services **framing**, **flow control**, **error control**; MAC is the other sublayer ([Week 6 data-link services](#/comp3721-w6/data-link-services)). [Framing](#/comp3721-w7/framing)
- Framing packs bits into **frames** so each is distinguishable, adding a **sender address** and a **destination address**. Multiple frames, because a very large frame makes flow and error control inefficient: a single-bit error requires retransmission of the whole frame.
- **Fixed** size: no need to define boundaries. **Variable** size: prevalent in LANs; needs the end and the beginning defined → **character (byte)-oriented** or **bit-oriented** approach.
- Character-oriented frame: **Flag | Header | Data | Trailer | Flag**. Data: 8-bit characters (ASCII). Header: source and destination addresses and other control information. Trailer: **error detection redundant bits**. Flag: protocol-dependent special characters, 8-bit (1-byte). (Slide 24's text puts the CRC in the "frame header"; the frame figure draws it in the trailer.)
- **Byte stuffing** (character stuffing): add an **ESC** whenever there is a **flag or ESC** in the text. The receiver removes the ESC and treats the **next character as data**. Slide 15: d FLAG d d ESC d → 8 bytes, **two extra bytes**. Problem left over: **Unicode** 16-bit and 32-bit characters; the tendency is toward **bit-oriented** protocols.
- **Bit-oriented flag**: **01111110**, the common flag between most protocols. **Bit stuffing**: add one extra **0** whenever **five consecutive 1s follow a 0**, so the receiver does not mistake 01111110 for a flag. Stuff even when the next bit is already 0; restart the count after the stuffed 0. Unstuffing removes the 0 after five 1s. [Bit stuffing](#/comp3721-w7/bit-stuffing)
- Slide 21: 0001111111001111101000 (22 bits) → **000111110110011111001000** (24 bits), **two extra bits**.
- Week 6's TDM "pulse stuffing" is also called bit stuffing in 06a: dummy bits to reach the dominant rate, a different mechanism.

## Lecture 07b: flow and error control, Simple and Stop-and-Wait

- **Flow control**: a **balance** between production and consumption rates; frames at the receiving end are **buffered**. **Buffer**: a set of memory locations that can hold packets at the sender and receiver. Two strategies: the receiver **drops the frames** if its buffer is full, or sends a **feedback** to ask the sender to stop or slow down. [Flow and error control](#/comp3721-w7/flow-and-error-control)
- **Error control**: a CRC added by the sender and checked by the receiver. Approach 1: corrupted frames discarded, uncorrupted delivered (wired LANs such as **Ethernet**). Approach 2: corrupted discarded, an **acknowledgment** sent for the uncorrupted ones. The ACK for flow control also serves error control; the **lack of acknowledgment** means a problem.
- **FSM**: always in one state until an event occurs. **Rounded-corner rectangles or circles** = states; **colored text** = events; **regular black text** = actions. Turnstile: Locked + coin → Unlocked; Locked + push → Locked; Unlocked + coin → Unlocked; Unlocked + push → Locked.
- **Simple**: **no flow and error control**; the receiver can never be overwhelmed. Sender Ready: *Packet came from network layer.* / Make a frame and send it. Receiver Ready: *Frame arrived.* / Deliver the packet to network layer. No ACKs.
- **Stop-and-Wait**: **connection-oriented**; **both flow and error control**; one frame at a time, waits for an ACK; a **timer** at the sender; ACK only if the CRC is correct. [Simple and Stop-and-Wait](#/comp3721-w7/simple-and-stop-and-wait)

| Stop-and-Wait FSM | Event | Action |
|---|---|---|
| Sender Ready → Blocking | Packet came from network layer. | Make a frame, save a copy, and send the frame. Start the timer. |
| Sender Blocking (stays) | Time-out. | Resend the saved frame. Restart the timer. |
| Sender Blocking (stays) | Corrupted ACK arrived. | Discard the ACK. |
| Sender Blocking → Ready | Error-free ACK arrived. | Stop the timer. Discard the saved frame. |
| Receiver Ready (stays) | Corrupted frame arrived. | Discard the frame. |
| Receiver Ready (stays) | Error-free frame arrived. | Extract and deliver the packet to network layer. Send ACK. |

- Slide 35: a *lost* frame or ACK means lost or corrupted. Frame lost → time-out → resend. ACK lost → time-out → resend → the receiver delivers a **Duplicate**.
- **Sequence numbers** 0, 1, 0, 1, …; **acknowledgment numbers** 1, 0, 1, 0, …; an acknowledgment number always defines the sequence number of the **next frame to receive**. With numbers, a resent Frame 0 that arrives when 1 is expected is discarded and ACK 1 is sent again. Same idea in TCP, later in the course.

## T/F traps

| Statement as a trap | Truth |
|---|---|
| The burst length counts only the corrupted bits. | False: first to last corrupted bit. |
| In error detection the number of corrupted bits matters. | False: only whether any error occurred. |
| Detection is more difficult than correction. | False: correction is more difficult. |
| The same dataword can be encoded as different codewords. | False: one-to-one. |
| A corrupted word that is still valid is detected. | False: it remains undetected. |
| d_min = s + 1 guarantees correcting s errors. | False: detecting; correcting t needs 2t + 1. |
| Simple parity detects every 2-bit error. | False: any odd number of errors only. |
| A syndrome of 0 proves no bit was corrupted. | False: or the decoder failed to detect. |
| In modulo-2 subtraction 0 − 1 borrows. | False: no carry, no borrow. |
| One's complement has only one zero. | False: 0000 and 1111. |
| Wrap once and stop. | False: wrap until the sum fits in m bits. |
| XOR FEC rebuilds two lost chunks of one group. | False: one. |
| Only flag bytes are stuffed. | False: ESC too. |
| No 0 is stuffed when the bit after five 1s is already 0. | False: stuffed anyway. |
| The Simple protocol provides flow control. | False: no flow and error control. |
| The receiver sends an ACK for a corrupted frame. | False: it discards the frame. |
| The lack of acknowledgment means the frame arrived. | False: it means a problem. |
| A cyclic code is a linear block code. | True. |
| The parity-check code is a linear block code. | True. |

## Fill-in bank (the slide's word)

| Blank | Word |
|---|---|
| Redundant bits are added by the ___ and removed by the ___. | sender, receiver |
| The (2^n − 2^k) unused codewords are the ___ in error detection. | trick |
| The Hamming distance: XOR the two words and count the number of ___. | 1s |
| The output of the checker, s0 or s2 s1 s0. | syndrome |
| CRC is used in ___ and ___. | LANs, WANs |
| Size of divisor = ___; size of remainder = ___. | n − k + 1, n − k |
| Adding the extra leftmost bits to the m rightmost bits. | wrapping |
| The checksum is mostly used at the ___ and ___ layers. | network, transport |
| The extra byte in byte stuffing. | ESC (escape character) |
| The common bit-oriented flag. | 01111110 |
| A set of memory locations that can hold packets. | buffer |
| The Stop-and-Wait sender's waiting state. | Blocking |
| An acknowledgment number defines the sequence number of the ___ frame to receive. | next |

```quiz
[
  {
    "q": "A non-zero syndrome means the received dataword is discarded.",
    "type": "tf",
    "answer": true,
    "explain": "The decision logic accepts only a zero syndrome; any other syndrome means the codeword was corrupted, and the dataword is discarded. A zero syndrome still leaves the slide-37 caveat: either no bit is corrupted, or the decoder failed to detect any errors."
  },
  {
    "type": "fill",
    "q": "Fill in the blank of the slide-19 sentence on bit stuffing.",
    "code": "Bit stuffing is the process of adding one extra 0 whenever ___ consecutive 1s follow a 0 in the data.",
    "answer": ["five", "5"],
    "explain": "Five consecutive 1s after a 0 get a stuffed 0, so the data can never show 01111110, the flag, which has six 1s in a row."
  },
  {
    "q": "What does a Stop-and-Wait sender do on the event \"Time-out.\"?",
    "options": [
      "Resend the saved frame. Restart the timer.",
      "Stop the timer. Discard the saved frame.",
      "Discard the ACK.",
      "Deliver the packet to network layer."
    ],
    "answer": 0,
    "explain": "On *Time-out.* the sender stays in Blocking and does *Resend the saved frame. Restart the timer.* That is why it keeps a copy: a lost frame or a lost ACK is repaired by the resend, and the sequence numbers let the receiver discard a duplicate."
  }
]
```
