---
title: "Review 3: Week 7 by hand: Hamming distance, parity, CRC, checksum, stuffing, Stop-and-Wait (item 12)"
minutes: 60
---
:::quiz What the paper asks and what earns the marks
Review item 12 is the longest on the list and the newest material, so expect several questions from it: count valid and invalid codewords, find a Hamming distance and say how many errors a code detects or corrects, run a CRC division (remainder at the sender, syndrome at the receiver), compute a checksum with wrapping, stuff a bit string or a byte string, and trace Stop-and-Wait. The marker wants the procedure, not only the result: every XOR row, the raw sum and each wrap, the inserted bits marked, and a verdict (accept or discard) in the slide's words.
:::

**Understand before the exam (cannot be looked up):**

- Hamming distance is XOR, then count the 1s.
- A CRC division row: leftmost bit 1 → XOR the divisor; leftmost bit 0 → XOR all zeros; drop the leading bit, bring down the next one.
- A checksum sum wraps until it fits in m bits, then gets complemented; the receiver expects 0 after its complement.
- Bit stuffing inserts a 0 after five consecutive 1s, even when the next bit is already 0.
- A Stop-and-Wait ACK carries the number of the next frame expected.

**On the sheet (look up, do not memorise):**

- *Sheet side 4, "Block coding, Hamming distance and parity"*: n = k + r, 2ᵏ valid, 2ⁿ − 2ᵏ invalid, the d_min table.
- *Sheet side 4, "CRC and modulo-2 division (07a, 07c)"*: the five-step recipe and the slide-38 division written out.
- *Sheet side 4, "Checksum and one's complement"*: the slide-49 sums and the hex example.
- *Sheet side 4, "Framing, byte stuffing and bit stuffing (07b)"* and *"Flow and error control, Simple and Stop-and-Wait"*: the slide-15 and slide-21 strings, the FSM table.

**Write this on the paper** for every Week 7 calculation:

1. The rule in one line: "d_min = 2t + 1", "append 3 zeros".
2. Every intermediate row: each XOR, each wrap, each inserted bit.
3. The result boxed, then the verdict: "syndrome 000 → accept", "checksum 0000 → accept", "2 extra bits".

| The question says | Procedure | Answer looks like | Check |
|---|---|---|---|
| "valid", "invalid codewords" | 2ᵏ and 2ⁿ − 2ᵏ | a count | valid + invalid = 2ⁿ |
| "Hamming distance", d(x, y) | XOR, count the 1s | a whole number ≤ length | same-length words |
| "detect", "correct", d_min | s = d_min − 1, t = ⌊(d_min − 1)/2⌋ | whole numbers | correct ≤ detect |
| "parity bit", "even parity" | count the 1s, make the total even | one bit | codeword has an even count |
| "CRC", "divisor", "remainder", "syndrome" | modulo-2 long division | n − k bits | sender: codeword ÷ divisor gives 0 |
| "checksum", "one's complement", "wrap" | sum, wrap, complement | m bits (or m/4 hex digits) | receiver gets 0 |
| "flag", "ESC", "stuff" | ESC before Flag or ESC; 0 after five 1s | the new string | unstuff gives the input back |
| "lost frame", "lost ACK", "sequence number" | 07b slide-34 FSM, ACK = next frame expected | the trace | numbers alternate 0, 1 |

Do if time is short: CRC, checksum, stuffing, Stop-and-Wait, then the quiz. FEC is marked "if time".

## Codewords and Hamming distance, from zero

Picture a message cut into blocks. Each block of **k** bits is a *dataword*. The sender adds **r** redundant bits, so the block sent is an *n*-bit *codeword*, n = k + r.

Tiny case: k = 2 and n = 3. There are $2^3 = 8$ three-bit words but only $2^2 = 4$ datawords, so only 4 of the 8 are valid codewords. The other 4 are never sent. Slide 16: the unused words are *the trick in error detection*: a corrupted codeword that lands on an unused word is caught; one that lands on another valid codeword is *undetectable*.

$$\text{valid} = 2^k \qquad \text{invalid} = 2^n - 2^k \qquad \text{total} = 2^n$$

The slide's C(7,4) CRC code, k = 4 and n = 7:

$$\text{valid} = 2^4 = \mathbf{16} \qquad \text{invalid} = 2^7 - 2^4 = 128 - 16 = \mathbf{112}$$

Check: 16 + 112 = 128 = 2⁷.

The *Hamming distance* d(x, y) is *the number of differences between corresponding bits* of two words of the same size. Slide 21's method: XOR the words, count the 1s.

```diagram
{ "type": "grid", "title": "Slide 21: d(10101, 11110)", "nodes": [
  { "id": "a0", "label": "x", "row": 0, "col": 0 }, { "id": "a1", "label": "1 0 1 0 1", "row": 0, "col": 1 },
  { "id": "b0", "label": "y", "row": 1, "col": 0 }, { "id": "b1", "label": "1 1 1 1 0", "row": 1, "col": 1 },
  { "id": "c0", "label": "x ⊕ y", "row": 2, "col": 0 }, { "id": "c1", "label": "0 1 0 1 1", "row": 2, "col": 1 },
  { "id": "d0", "label": "count the 1s", "row": 3, "col": 0 }, { "id": "d1", "label": "3", "row": 3, "col": 1 }
], "hi": ["d1"], "caption": "Equal bits XOR to 0, different bits to 1, so the 1s are exactly the differences." }
```

$$10101 \text{ XOR } 11110 = 01011 \Rightarrow d = \mathbf{3}$$

The *minimum Hamming distance* d_min of a code is the smallest distance over all pairs of valid codewords. Two rules, one on slide 22 and one on slide 53:

$$d_{min} = s + 1 \ \text{(detect up to } s\text{)} \qquad d_{min} = 2t + 1 \ \text{(correct up to } t\text{)}$$

Turned around for a given code: it detects $d_{min} - 1$ errors and corrects $\lfloor (d_{min} - 1)/2 \rfloor$. The C(7,4) table has d_min = 3 (computed, not stated on a slide):

$$s = 3 - 1 = \mathbf{2} \qquad t = \lfloor (3 - 1)/2 \rfloor = \mathbf{1}$$

## Even parity, the smallest code

*Parity-check code*: n = k + 1; the parity bit makes the total number of 1s **even**. d_min = 2, so it detects 1 error and corrects none; slide 26 adds it *can also find any odd number of errors*.

Slide 26: dataword 10001 has two 1s, already even, so the parity bit is 0 and the codeword is **100010**. Received 011010 has three 1s, odd: corrupted.

New case: a game packet from the Classic client starts with a 2-byte opcode; take its first byte, 00101010, as the dataword (the value is made up for practice). It has three 1s, so the even-parity bit is 1:

$$00101010 \to \mathbf{001010101} \quad (\text{four 1s, even})$$

If two bits flip, the count stays even and parity accepts the word: the 2-bit error is undetected.

## CRC: modulo-2 division by hand

The rule from the sheet: append n − k zeros; divide in modulo 2 (XOR, no carry, no borrow); the remainder (n − k bits) goes after the dataword. The divisor has n − k + 1 bits and is shared by sender and receiver.

Tiny step first: one row of the slide-38 division. Window 1001, leftmost bit 1, so XOR the divisor 1011:

$$1001 \text{ XOR } 1011 = 0010 \to \text{drop the leading } 0, \text{ bring down } 0 \to 0100$$

The whole slide-38 division, dataword 1001, divisor 1011, dividend 1001 000:

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

At the receiver, divide the **whole received codeword** by the same divisor, with no zeros added. The remainder is the *syndrome*. Slide 40: 1001110 gives syndrome **000**, *Dataword accepted*; 1000110 (one bit flipped) gives syndrome **011**, *Dataword discarded*. Slide 37's caution: *If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.*

New division, fully shown: a 6-bit dataword 110101 cut from a game packet, divisor 1011. Then n − k = 3, so n = 9; append 000, dividend 110101 000. Six steps:

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

Check at the receiver: 110101111 ÷ 1011 gives syndrome **000**, accept. Flip the third bit in transit, 111101111, and the division ends with syndrome **101**: non-zero, discard.

Call each quotient bit before it is drawn.

```widget
crc-play
{ "dataword": "110101", "divisor": "1011", "mode": "encode", "predict": true, "title": "110101 ÷ 1011, one quotient bit per step" }
```

## Checksum: sum, wrap, complement

Picture m-bit words in a column, summed. In *one's complement* the bits beyond the m rightmost are added back in (*wrapping*) until the sum fits; the *complement* then flips every bit, the same as $(2^m - 1) - \text{sum}$.

Tiny case, slide 47: 36 = 100100 in 4 bits.

$$(10)_2 + (0100)_2 = (0110)_2 = \mathbf{6}$$

The slide-49 example, five 4-bit words 7, 11, 12, 0, 6, checksum initialised to 0:

$$7 + 11 + 12 + 0 + 6 = 36 = 10\,0100 \to 10 + 0100 = 0110 = 6 \to 15 - 6 = \mathbf{9} = 1001$$

The receiver adds all six words, including the checksum:

$$36 + 9 = 45 = 10\,1101 \to 10 + 1101 = 1111 = 15 \to 15 - 15 = \mathbf{0} \Rightarrow \text{accept}$$

Corrupted (the 6 arrives as 7): 46 = 10 1110 → 10 + 1110 = 1 0000, still five bits, so wrap again: 1 + 0000 = 0001 → complement 1110 = 14, not 0: reject.

The review list says "(Hex)", but no slide works one; the method follows from the slides. One hex digit is 4 bits, so a 16-bit word is four digits; the carry is whatever sits left of the rightmost four digits; the complement takes each digit d to F − d.

New case: the Classic client's packet as four 16-bit words, the opcode word 2A01 then three payload words 0007, 9C40, F1D3 (values made up for practice).

```diagram
{ "type": "grid", "title": "16-bit checksum of a game packet (hex)", "nodes": [
  { "id": "h0", "label": "step", "row": 0, "col": 0 }, { "id": "h1", "label": "sender", "row": 0, "col": 1 }, { "id": "h2", "label": "receiver", "row": 0, "col": 2 },
  { "id": "a0", "label": "words", "row": 1, "col": 0 }, { "id": "a1", "label": "2A01 0007 9C40 F1D3", "row": 1, "col": 1 }, { "id": "a2", "label": "the same + 47E3", "row": 1, "col": 2 },
  { "id": "b0", "label": "raw sum", "row": 2, "col": 0 }, { "id": "b1", "label": "1B81B", "row": 2, "col": 1 }, { "id": "b2", "label": "1FFFE", "row": 2, "col": 2 },
  { "id": "c0", "label": "wrap", "row": 3, "col": 0 }, { "id": "c1", "label": "B81B + 1 = B81C", "row": 3, "col": 1 }, { "id": "c2", "label": "FFFE + 1 = FFFF", "row": 3, "col": 2 },
  { "id": "d0", "label": "complement", "row": 4, "col": 0 }, { "id": "d1", "label": "47E3 (checksum)", "row": 4, "col": 1 }, { "id": "d2", "label": "0000 → accept", "row": 4, "col": 2 }
], "hi": ["d1", "d2"], "caption": "Running sum: 2A01, 2A08, C648, 1B81B. The leading 1 is the carry that wraps." }
```

$$\text{sum} = \texttt{2A01} + \texttt{0007} + \texttt{9C40} + \texttt{F1D3} = \texttt{1B81B} \to \texttt{B81B} + 1 = \texttt{B81C}$$

$$\text{checksum} = (F{-}B)(F{-}8)(F{-}1)(F{-}C) = \mathbf{47E3}$$

Check: the receiver's sum wraps to FFFF and complements to 0000. If the payload word 0007 arrives as 0006, the receiver's sum wraps to FFFE and complements to 0001: not 0, reject.

## FEC with XOR (if time)

Slide 54: send N chunks plus R = P1 ⊕ P2 ⊕ … ⊕ PN; any **one** lost chunk is the XOR of the others and R. Slide 55: N = 4 costs 25 percent extra.

New case: the opcode 2A01 as four 4-bit chunks 0010, 1010, 0000, 0001.

$$R = 0010 \text{ XOR } 1010 \text{ XOR } 0000 \text{ XOR } 0001 = \mathbf{1001}$$

P2 lost: $0010 \text{ XOR } 0000 \text{ XOR } 0001 \text{ XOR } 1001 = \mathbf{1010}$, which is P2. Two lost chunks cannot be rebuilt.

## Byte stuffing and bit stuffing

*Fixed*-size frames need no boundaries; *variable*-size frames end with a flag: the *character (byte)-oriented* or the *bit-oriented* approach.

**Byte stuffing**, slide 14: *adding one extra byte … the escape character (ESC), whenever there is a flag or ESC in the text.* The receiver removes each ESC and keeps the next byte as data.

Slide 15: `d Flag d d ESC d` → `d ESC Flag d d ESC ESC d`: 6 bytes become 8, *Two extra bytes*.

New case: a game packet's payload holds the flag byte and the escape byte: `07 FLAG 2C ESC 1F` → `07 ESC FLAG 2C ESC ESC 1F`, 5 bytes become 7. The data's ESC is stuffed too, or the receiver would remove it and lose that byte.

**Bit stuffing**, slide 19: *adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern 01111110 for a flag.* Count 1s; at five, insert a 0 and restart the count.

```diagram
{ "type": "grid", "title": "07b slide 21: the counter of 1s", "nodes": [
  { "id": "h0", "label": "data piece", "row": 0, "col": 0 }, { "id": "h1", "label": "count", "row": 0, "col": 1 }, { "id": "h2", "label": "sent", "row": 0, "col": 2 },
  { "id": "a0", "label": "000", "row": 1, "col": 0 }, { "id": "a1", "label": "0", "row": 1, "col": 1 }, { "id": "a2", "label": "000", "row": 1, "col": 2 },
  { "id": "b0", "label": "11111", "row": 2, "col": 0 }, { "id": "b1", "label": "5: stuff", "row": 2, "col": 1 }, { "id": "b2", "label": "11111 0", "row": 2, "col": 2 },
  { "id": "c0", "label": "1100", "row": 3, "col": 0 }, { "id": "c1", "label": "2, then 0", "row": 3, "col": 1 }, { "id": "c2", "label": "1100", "row": 3, "col": 2 },
  { "id": "d0", "label": "11111", "row": 4, "col": 0 }, { "id": "d1", "label": "5: stuff", "row": 4, "col": 1 }, { "id": "d2", "label": "11111 0", "row": 4, "col": 2 },
  { "id": "e0", "label": "01000", "row": 5, "col": 0 }, { "id": "e1", "label": "0", "row": 5, "col": 1 }, { "id": "e2", "label": "01000", "row": 5, "col": 2 }
], "hi": ["b2", "d2"], "caption": "22 data bits → 24 sent: 000111110110011111001000. The second stuffed 0 goes in although the next data bit is already 0." }
```

New case: the flag pattern itself inside a payload, 01111110 1111110 (15 bits). The six 1s are cut after five each time:

$$0\,11111\,1\,0\,11111\,1\,0 \to 0\,11111\,\mathbf{0}\,1\,0\,11111\,\mathbf{0}\,1\,0 = \mathbf{01111101011111010}$$

15 bits become 17, 2 extra. Check: unstuffing (remove the 0 after each five 1s) gives the 15 bits back.

The sender puts an ESC before the FLAG and the ESC; the receiver strikes them out.

```widget
stuff-play
{ "mode": "byte", "data": "07 FLAG 2C ESC 1F", "predict": true, "title": "A game packet's payload, byte-stuffed" }
```

## Flow control, error control, Stop-and-Wait

*Flow control*: a *balance* between *production* and *consumption rates*; frames are *buffered* at the receiving end. *Error control*: a CRC added by the sender and checked by the receiver; corrupted frames are *discarded*.

The *Simple* protocol has *No flow and error control*. *Stop-and-Wait* is *connection-oriented*, provides *both flow and error control*, sends one frame at a time, waits for an acknowledgment, and resends when its *timer* expires. The receiver ACKs only an error-free frame.

Slide 36: sequence numbers 0, 1, 0, 1; acknowledgment numbers 1, 0, 1, 0; *An acknowledgment number always define the sequence number of the next frame to receive.*

New case: the Classic client sends three frames to the game server over a lossy link.

```diagram
{ "type": "sequence", "title": "Client to game server, Stop-and-Wait with sequence numbers", "nodes": [
  { "id": "c", "label": "Client data-link", "kind": "lane" },
  { "id": "g", "label": "Game server data-link", "kind": "lane" }
], "edges": [
  { "from": "c", "to": "g", "label": "Frame 0 (timer started)" },
  { "from": "g", "to": "c", "label": "ACK 1 (next expected: 1)" },
  { "from": "c", "to": "g", "label": "Frame 1: lost", "dashed": true },
  { "from": "c", "to": "g", "label": "Time-out: Frame 1 resent" },
  { "from": "g", "to": "c", "label": "ACK 0" },
  { "from": "c", "to": "g", "label": "Frame 0" },
  { "from": "g", "to": "c", "label": "ACK 1: lost", "dashed": true },
  { "from": "c", "to": "g", "label": "Time-out: Frame 0 resent" },
  { "from": "g", "to": "c", "label": "Duplicate discarded, ACK 1 again" }
], "hi": ["9"], "caption": "The server expects Frame 1 and sees Frame 0: a duplicate. It discards the frame and repeats ACK 1, so the packet is not delivered twice." }
```

Without sequence numbers (slide 35) that frame is delivered again: *Duplicate*.

```widget
stop-wait-play
{ "scenario": "ack-lost", "seq": true, "predict": true }
```

## New variants

Work each on paper first.

```quiz
[
  {
    "q": "A code takes 6-bit datawords and appends the 3-bit remainder of a CRC with divisor 1011. How many 9-bit words are invalid codewords?",
    "type": "numeric",
    "answer": 448,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Formula: invalid = 2ⁿ − 2ᵏ, with k = 6 and n = 9.\nSubstitution: 2⁹ − 2⁶ = 512 − 64.\nAnswer: 448 invalid codewords.\nCheck: 64 valid + 448 invalid = 512 = 2⁹."
  },
  {
    "q": "Two opcode bytes from game packets are 00101010 and 00111011. What is their Hamming distance?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: d(x, y) = number of 1s in x ⊕ y.\nSubstitution: 00101010 ⊕ 00111011 = 00010001.\nAnswer: two 1s, d = 2.\nCheck: the words differ only in the fourth and the last bit."
  },
  {
    "q": "A packet code must correct up to 3 bit errors in every case. What minimum Hamming distance does it need?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: to correct t errors, d_min = 2t + 1 (slide 53).\nSubstitution: 2 × 3 + 1.\nAnswer: d_min = 7.\nCheck: ⌊(7 − 1)/2⌋ = 3 corrected; the same code detects 6."
  },
  {
    "q": "Dataword 1110, divisor 1011 (C(7,4)). Give the 3-bit CRC remainder.",
    "type": "text",
    "answer": ["100"],
    "explain": "Rule: append n − k = 3 zeros: 1110000.\nRows: 1110 ⊕ 1011 = 0101 → 1010; 1010 ⊕ 1011 = 0001 → 0010; leftmost 0: 0010 ⊕ 0000 = 0010 → 0100; leftmost 0: 0100 ⊕ 0000 = 0100.\nAnswer: remainder 100, codeword 1110100 (quotient 1100, discarded).\nCheck: the slide-34 table row for 1110 is 1110100."
  },
  {
    "q": "The game server receives 1101011 on the C(7,4) code with divisor 1011. Give the syndrome.",
    "type": "text",
    "answer": ["010"],
    "explain": "Rule: divide the whole received word, no zeros added.\nRows: 1101 ⊕ 1011 = 0110 → 1100; 1100 ⊕ 1011 = 0111 → 1111; 1111 ⊕ 1011 = 0100 → 1001; 1001 ⊕ 1011 = 0010.\nAnswer: syndrome 010, non-zero, so the dataword is discarded.\nCheck: the valid codeword for 1101 is 1101001; the received word differs in one bit."
  },
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
    "q": "Bit-stuff the data 0111111111110 (thirteen bits). Type the stuffed string.",
    "type": "text",
    "answer": ["011111011111010"],
    "explain": "Rule: after five consecutive 1s, insert a 0 and restart the count.\nSteps: 0 11111 → stuff 0; then 11111 → stuff 0; then 1 0.\nAnswer: 011111011111010, 15 bits, 2 extra.\nCheck: remove the 0 after each run of five 1s and the 13 data bits come back."
  },
  {
    "q": "Byte-stuff a payload whose bytes are: 2A ESC FLAG 07. Type the stuffed bytes separated by spaces.",
    "type": "text",
    "answer": ["2A ESC ESC ESC FLAG 07"],
    "explain": "Rule (slide 14): an ESC goes before every Flag or ESC in the data.\nSteps: 2A stays; ESC → ESC ESC; FLAG → ESC FLAG; 07 stays.\nAnswer: 2A ESC ESC ESC FLAG 07, 4 bytes become 6.\nCheck: the receiver removes each ESC and keeps the next byte: 2A ESC FLAG 07."
  },
  {
    "type": "free",
    "q": "In Stop-and-Wait with sequence numbers, the game server's ACK for Frame 0 is lost and Frame 0 is resent. Explain what the game server does with the resent frame and why.",
    "model": "The server has already delivered Frame 0 and expects Frame 1, so the resent Frame 0 is a *duplicate*. It *discards* the frame and sends ACK 1 again, because *an acknowledgment number always define the sequence number of the next frame to receive*. The sender's *time-out* caused the resend; without sequence numbers the packet would be delivered twice (slide 35).",
    "points": [
      "Names the resent frame a duplicate",
      "The server discards it rather than delivering it",
      "It sends ACK 1 again",
      "The ACK number is the next frame expected",
      "The resend came from the sender's time-out after the lost ACK"
    ],
    "rows": 4,
    "explain": "Three moves: name it in the slide's words (duplicate), give the reason (the server expects 1 and the ACK number is the next frame expected), give the trace (discard, ACK 1 again)."
  }
]
```
