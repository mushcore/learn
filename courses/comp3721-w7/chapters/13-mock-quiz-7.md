---
title: Mock Quiz 7 (Week 7)
minutes: 40
---

Quiz 7 is expected to cover Lectures 07a, 07b and the 07c modulo-2 notes: errors and redundancy, block coding and Hamming distance, parity, CRC division and the syndrome, the checksum in one's complement (also in hex), FEC, framing with byte and bit stuffing, flow and error control, and the Simple and Stop-and-Wait protocols. Same shapes as the lab quiz: True or False, fill in the blank, written response, and calculations with units. Same rules: one A4 or letter page of notes, a calculator, and the working on paper before you type. Type bit strings without spaces; type hex with or without 0x. Every number below is new: none comes from a lesson's practice set or final quiz, so a right answer here is a skill and not a memory.

```quiz
[
  {
    "q": "In a burst error, the length of the burst counts only the corrupted bits.",
    "type": "tf",
    "answer": false,
    "explain": "The burst length counts from the first corrupted bit to the last, including the uncorrupted bits between them. In the slide-6 figure four bits flip (positions 4, 5, 8 and 11), and the slide labels the *Length of burst error (8 bits)*: 11 − 4 + 1 = 8. See [Types of errors](#/comp3721-w7/types-of-errors)."
  },
  {
    "q": "There is a noise of 1 μs on a link whose data rate is 1 Gbps. How many bits are affected by this noise?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bits affected = data rate × duration of noise = 1 000 000 000 bps × 0.000001 s = 1000 bits. The slide-9 example does the same with 0.001 s: 1 bit at 1 kbps and 1000 bits at 1 Mbps. The faster the link, the more bits one noise event hits, which is why burst errors are the likely kind."
  },
  {
    "q": "Which statement about error detection and error correction is correct?",
    "options": [
      "In error correction, the exact number of corrupted bits and their location in the message need to be identified",
      "In error detection, the number of corrupted bits is an important factor",
      "The detection of errors is more difficult than the correction",
      "Error correction is only looking to see if any error has occurred"
    ],
    "answer": 0,
    "explain": "Slide 10: *Error detection: Only looking to see if any error has occurred. The number of corrupted bits (type of error) is not important.* Correction needs the exact number of corrupted bits and their location, and *The correction of errors is more difficult than the detection.*"
  },
  {
    "type": "fill",
    "q": "Fill in the two blanks of the slide-11 sentence on redundancy.",
    "code": "These redundant bits are added by the ___ and removed by the ___.",
    "answer": ["sender", "receiver"],
    "explain": "Slide 11: *These redundant bits are added by the sender and removed by the receiver.* They allow the receiver to detect or correct corrupted bits; redundancy is achieved through coding schemes, and the redundant bits have a relationship with the actual data."
  },
  {
    "q": "A block code has datawords of k = 6 bits and codewords of n = 10 bits. How many valid codewords does it have?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Valid codewords = 2^k = 2^6 = 64. Block coding is one-to-one: each of the 64 datawords is always encoded as the same codeword, so exactly 64 of the 10-bit words are valid. Here r = n − k = 4 redundant bits."
  },
  {
    "q": "Same code (k = 6, n = 10). How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 960,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "Invalid codewords = 2^n − 2^k = 2^10 − 2^6 = 1024 − 64 = 960. These unused words are *the trick in error detection*: a corrupted codeword that lands on one of the 960 is discarded. Answering 1024 counts every 10-bit word, valid ones included."
  },
  {
    "q": "If a corrupted codeword is still a valid codeword, the receiver detects the error.",
    "type": "tf",
    "answer": false,
    "explain": "Slide 18: *If the codeword is corrupted during transmission but the received word still matches a valid codeword, the error remains undetected.* It is the third receiver condition: the original codeword changes to a valid one, which makes the error undetectable. See [Block coding](#/comp3721-w7/block-coding)."
  },
  {
    "q": "How many bits differ between the words 1100 and 0011? That count is the Hamming distance d(1100, 0011).",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "XOR the two words and count the 1s: 1100 ⊕ 0011 = 1111 → four 1s → d(1100, 0011) = 4. Every position differs, so 4 is the largest distance two 4-bit words can have."
  },
  {
    "q": "The textbook C(5, 2) code has the codewords 00000, 01011, 10101 and 11110, and its minimum Hamming distance is 3. How many errors can it detect in all cases?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "errors",
    "explain": "The six pairwise distances (by XOR) are d(00000, 01011) = 3, d(00000, 10101) = 3, d(00000, 11110) = 4, d(01011, 10101) = 4, d(01011, 11110) = 3, d(10101, 11110) = 3, so d_min = 3. Slide 22: d_min = s + 1, so s = d_min − 1 = 3 − 1 = 2 errors. The code is textbook; the distances were computed."
  },
  {
    "q": "Same code (d_min = 3). How many errors can it correct?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "errors",
    "explain": "Slide 53: to correct t errors, d_min = 2t + 1. With d_min = 3, t = (3 − 1) / 2 = 1. In general a code corrects ⌊(d_min − 1)/2⌋ errors, so correction always costs more distance than detection."
  },
  {
    "q": "A code must correct up to 4 errors. What is the minimum Hamming distance it needs?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "bits",
    "explain": "d_min = 2t + 1 = 2 × 4 + 1 = 9. The slide's example corrects 10 bits with d_min = 21, a *lot of redundant bits*. For detection alone, 4 errors would need only d_min = s + 1 = 5."
  },
  {
    "type": "text",
    "q": "Even parity: write the codeword for the 7-bit dataword 1001101, with the parity bit added as the rightmost bit. Type the bits without spaces.",
    "answer": ["10011010"],
    "explain": "1001101 has four 1s, already even, so the parity bit is 0 and the codeword is 1001101 + 0 = 10011010 (n = k + 1 = 8). In formula form the parity bit is the sum of the data bits modulo 2: 1 + 0 + 0 + 1 + 1 + 0 + 1 = 4, 4 mod 2 = 0. See [Parity check](#/comp3721-w7/parity-check)."
  },
  {
    "q": "Which error patterns does the simple parity-check code always detect?",
    "options": [
      "Any odd number of errors",
      "Any even number of errors",
      "Every burst error",
      "Every 2-bit error"
    ],
    "answer": 0,
    "explain": "Slide 26: *The simple parity check, guaranteed to detect one single error, and can also find any odd number of errors.* An even number of flips keeps the count of 1s even, so the syndrome is 0 and the error is undetected: d_min = 2 makes it a single-bit error-detecting code."
  },
  {
    "q": "A cyclic code is a linear block code in which every rotation of a codeword is another codeword.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 33: cyclic codes are *special linear block codes with one extra property: if a codeword is cyclically shifted (rotated), the result is another codeword.* The slide's example: 1011000 → cyclic left-shift → 0110001, both in the C(7, 4) table."
  },
  {
    "q": "A CRC code uses the divisor 1001 on 4-bit datawords. How many bits does the remainder have?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Size of divisor = n − k + 1, so 4 = n − 4 + 1 and n = 7. Size of remainder = n − k = 7 − 4 = 3 bits, which is also the number of zeros appended to the dataword. The codeword is 7 bits: the 4-bit dataword plus the 3-bit remainder."
  },
  {
    "type": "text",
    "q": "CRC encoder: dataword 1110, divisor 1001. Do the long division and type the remainder. Type the bits without spaces.",
    "answer": ["111"],
    "explain": "Append n − k = 3 zeros: the dividend is 1110000. Every step starts with a leftmost 1, so every row uses the divisor 1001 and no 0000 row appears: 1110 ⊕ 1001 = 0111 → bring down 0 → 1110 ⊕ 1001 = 0111 → bring down 0 → 1110 ⊕ 1001 = 0111 → bring down 0 → 1110 ⊕ 1001 = 0111 → drop the leading 0 → remainder 111. The quotient 1111 is discarded. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "type": "text",
    "q": "Same encoder (dataword 1110, divisor 1001). Type the codeword that is sent. Type the bits without spaces.",
    "answer": ["1110111"],
    "explain": "Codeword = dataword plus remainder = 1110 followed by 111 = 1110111 (n = 7). Check at the receiver: 1110111 ÷ 1001 gives 1110 ⊕ 1001 = 0111 → 1111 ⊕ 1001 = 0110 → 1101 ⊕ 1001 = 0100 → 1001 ⊕ 1001 = 0000 → syndrome 000, accepted."
  },
  {
    "type": "text",
    "q": "CRC decoder: the received codeword is 100110001 and the divisor is 1101. Do the long division and type the syndrome. Type the bits without spaces.",
    "answer": ["111"],
    "explain": "The decoder divides the whole received codeword, with no zeros appended: 1001 ⊕ 1101 = 0100 → bring down 1 → 1001 ⊕ 1101 = 0100 → bring down 0 → 1000 ⊕ 1101 = 0101 → bring down 0 → 1010 ⊕ 1101 = 0111 → bring down 0 → 1110 ⊕ 1101 = 0011 → bring down 1 → 0111, leftmost bit 0: use 0000 divisor → 0111 ⊕ 0000 = 0111 → drop the leading 0 → syndrome 111. The quotient is 111110."
  },
  {
    "q": "Same received codeword (100110001, divisor 1101, syndrome 111). What does the decision logic do?",
    "options": [
      "Discards the dataword, because the syndrome is not zero",
      "Accepts the dataword, because the syndrome has no leading 0",
      "Accepts the dataword and corrects the last three bits",
      "Asks the sender for the divisor again"
    ],
    "answer": 0,
    "explain": "A non-zero syndrome means at least one bit was corrupted, so the dataword is discarded. Only a zero syndrome is accepted, and slide 37 warns that even then *either no bit is corrupted, or the decoder failed to detect any errors.* The divisor is shared in advance; it never travels."
  },
  {
    "type": "text",
    "q": "Compute the 16-bit Internet checksum of the hex words 1234, F00D and BEEF. Type the checksum in hex (with or without 0x).",
    "answer": ["3ECE", "0x3ECE"],
    "explain": "Sum in hex: 1234 + F00D = 10241; 10241 + BEEF = 1C130. The 1 beyond four hex digits is the carry: wrap it, C130 + 1 = C131. Complement digit by digit (F − d): F − C = 3, F − 1 = E, F − 3 = C, F − 1 = E → 3ECE (the same as FFFF − C131). See [Checksum](#/comp3721-w7/checksum)."
  },
  {
    "type": "text",
    "q": "A receiver gets the 16-bit hex words AB12, 9F34, 7C57 and the checksum 3962. Type the new checksum it calculates, in hex (with or without 0x).",
    "answer": ["FFFE", "0xFFFE"],
    "explain": "Sum: AB12 + 9F34 = 14A46; + 7C57 = 1C69D; + 3962 = 1FFFF. Wrap: FFFF + 1 = 10000, still five digits, so wrap again: 0000 + 1 = 0001. Complement: FFFF − 0001 = FFFE. The new checksum is not 0, so the message is rejected. (The sender computed 3962 from AB12, 9F34, 7C56; one bit of the last word flipped.)"
  },
  {
    "q": "In 4-bit one's complement arithmetic, what is the complement of 11? Answer in decimal.",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "11 = 1011; changing all 1s to 0s and all 0s to 1s gives 0100 = 4. The same as subtracting from 2^m − 1: 15 − 11 = 4."
  },
  {
    "q": "Written response: why is retransmission not used for real-time multimedia? Pick the sentence that answers it the way the slide does.",
    "options": [
      "Retransmission causes an unacceptable delay in reproducing, so the error must be corrected or the packet reproduced immediately",
      "Multimedia packets carry no CRC, so the receiver cannot tell which packets to ask for again",
      "Retransmission needs a larger minimum Hamming distance than forward error correction",
      "Multimedia uses fixed-size frames, which cannot be resent"
    ],
    "answer": 0,
    "explain": "Model answer (2 to 4 sentences on paper): slide 51 says *Retransmission of corrupted and lost packets is not useful for real-time multimedia transmission. Due to unacceptable delay in reproducing.* Such applications need Forward Error Correction: correct the error or reproduce the packet immediately. Example: with the XOR technique and N = 4 chunks, the receiver rebuilds one lost chunk from the other three and R, at a cost of 25 percent extra data."
  },
  {
    "q": "FEC with XOR: a packet is divided into N = 8 chunks and their XOR is sent as one extra chunk. How much extra data is sent, in percent?",
    "type": "numeric",
    "answer": 12.5,
    "tolerance": 0.05,
    "unit": "%",
    "explain": "One extra chunk per N data chunks: 1/8 = 0.125 = 12.5 percent. The slide's case is N = 4 → 25 percent extra data, able to correct the data if only one out of four chunks is lost; with N = 8 the overhead halves, and still only one chunk per group can be rebuilt. See [FEC](#/comp3721-w7/fec)."
  },
  {
    "type": "text",
    "q": "Bit stuffing: stuff the data 0110111111111100. Type the bits without spaces.",
    "answer": ["011011111011111000"],
    "explain": "Count the 1s that follow a 0 and insert a 0 after every five: 0110 | 11111 → stuff 0 | 11111 → stuff 0 | 00. The second stuffed 0 goes in even though the next data bit is already 0. Result 0110 11111 0 11111 0 00 = 011011111011111000: 16 bits → 18 bits, two extra. See [Bit stuffing](#/comp3721-w7/bit-stuffing)."
  },
  {
    "type": "text",
    "q": "Bit stuffing: stuff the data 000111111. Type the bits without spaces.",
    "answer": ["0001111101"],
    "explain": "000 | 11111 → stuff 0 | 1. After the fifth consecutive 1 the sender inserts a 0 and restarts its count, so the sixth 1 follows the stuffed 0: 0001111101, 9 bits → 10 bits. The receiver removes the 0 that follows five consecutive 1s and gets 000111111 back."
  },
  {
    "q": "Byte stuffing: the data from the upper layer is FLAG ESC FLAG ESC. How many bytes is the data section after stuffing?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bytes",
    "explain": "Slide 14: an ESC is added *whenever there is a flag or ESC in the text.* All four bytes are a flag or an ESC, so each gets an ESC in front: ESC FLAG ESC ESC ESC FLAG ESC ESC = 8 bytes, 4 extra. On unstuffing the receiver removes each ESC and treats the next character as data, which restores FLAG ESC FLAG ESC. See [Framing](#/comp3721-w7/framing)."
  },
  {
    "q": "What does the slide say about fixed-size frames?",
    "options": [
      "There is no need to define boundaries, because the frame size is fixed",
      "They are prevalent in LANs",
      "They need a flag at the start and end of every frame",
      "They need byte stuffing whenever the data contains a flag"
    ],
    "answer": 0,
    "explain": "Slide 8: *Fixed → no need to define boundaries, frame size is fixed!* Variable-size frames are the ones prevalent in LANs, and they need a way to define the end of a frame and the beginning of the next: the character (byte)-oriented approach or the bit-oriented approach, with flags and stuffing."
  },
  {
    "q": "Select the two strategies the slide gives for implementing flow control.",
    "options": [
      "The receiving data-link layer drops the frames if its buffer is full",
      "The receiving data-link layer sends a feedback to the sending data-link layer to ask it to stop or slow down",
      "The sender adds a CRC that the receiver checks",
      "The sender restarts its timer and resends the saved frame"
    ],
    "answer": [0, 1],
    "explain": "Slide 23 lists the two flow-control strategies: drop the frames when the buffer is full, or send feedback asking the sender to stop or slow down. The CRC belongs to error control, and resending the saved frame on a time-out is the Stop-and-Wait sender's action. See [Flow and error control](#/comp3721-w7/flow-and-error-control)."
  },
  {
    "q": "A Stop-and-Wait sender is in the Blocking state when the event \"Error-free ACK arrived.\" occurs. What does it do?",
    "options": [
      "Stop the timer. Discard the saved frame.",
      "Resend the saved frame. Restart the timer.",
      "Discard the ACK.",
      "Make a frame, save a copy, and send the frame. Start the timer."
    ],
    "answer": 0,
    "explain": "Slide 34: on *Error-free ACK arrived.* the sender does *Stop the timer. Discard the saved frame.* and goes back to Ready. *Time-out.* resends the saved frame and restarts the timer; *Corrupted ACK arrived.* only discards the ACK; making a frame and starting the timer happens on *Packet came from network layer.* in Ready. See [Simple and Stop-and-Wait](#/comp3721-w7/simple-and-stop-and-wait)."
  },
  {
    "q": "Stop-and-Wait with sequence numbers: Frame 1 arrives error-free at the receiver. What acknowledgment number does the receiver send?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0,
    "explain": "Slide 36: *An acknowledgment number always define the sequence number of the next frame to receive.* Sequence numbers run 0, 1, 0, 1, …, so after Frame 1 the next frame expected is Frame 0: the receiver sends ACK 0. The acknowledgment numbers run 1, 0, 1, 0, …"
  },
  {
    "q": "The Simple protocol assumes that the receiver can never be overwhelmed with incoming frames.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 30: the Simple protocol has *No flow and error control. Assumption is that the receiver can never be overwhelmed with incoming frames.* Its FSM has one state on each side: the sender makes a frame and sends it, the receiver delivers the packet to the network layer, and no ACKs travel."
  }
]
```
