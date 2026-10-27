---
title: "Forward error correction: Hamming distance, XOR and chunk interleaving"
minutes: 16
---

Detection followed by retransmission is too slow for a live call or a video stream. Forward error correction sends enough extra data for the receiver to repair or rebuild what was damaged without asking again.

## Retransmission is too slow for real-time multimedia

Slide 51, *Forward Error Correction (FEC)*: *Retransmission of corrupted and lost packets is not useful for real-time multimedia transmission. Due to unacceptable delay in reproducing. In such applications, we need to correct the error or reproduce the packet immediately.*

Slide 52 lists the *FEC Techniques*:

- *Hamming distance*
- *Using XOR*
- *Chunk interleaving*
- *…* (the list is left open)

## Hamming distance: d_min = 2t + 1 to correct t errors

Slide 53: *To detect s errors, dmin = s + 1. For error correction, we need more distance. To correct t errors, we need to have dmin = 2t + 1.* Its example: *if we want to correct 10 bits in a packet, we need to make the minimum hamming distance 21 bits → lot of redundant bits need to be sent with the data.* The arithmetic is 2 × 10 + 1 = 21. The detection side of the rule is in [Hamming distance](#/comp3721-w7/hamming-distance).

| Correct t errors | d_min = 2t + 1 |
|---|---|
| 1 | 3 |
| 2 | 5 |
| 10 | 21 |

## Rebuilding a chunk with XOR

Slides 54 and 55: *Using the property of XOR operation: R = P1 ⊕ P2 ⊕ … ⊕ Pi ⊕ … ⊕ PN. This means: Pi = P1 ⊕ P2 ⊕ … ⊕ R ⊕ … ⊕ PN.* In the second line R takes the place of the missing chunk Pi. XOR is its own inverse, so XORing R with every chunk that did arrive leaves only the one that did not.

*We can divide a packet into N chunks, create the XOR of all the chunks and send N+1 Chunks. If any chunk is lost or corrupted, it can be created at the receiver site.* The slide's number: *If N = 4, it means that we need to send 25 percent extra data and be able to correct the data if only one out of four chunks is lost.* One extra chunk for N data chunks is 1/N of extra data: 1/4 = 25 %.

A worked group of four 4-bit chunks, computed:

| Chunk | Bits |
|---|---|
| P1 | 1010 |
| P2 | 0111 |
| P3 | 1100 |
| P4 | 0011 |
| R = P1 ⊕ P2 ⊕ P3 ⊕ P4 | 0010 |

Running XOR: 1010 ⊕ 0111 = 1101; 1101 ⊕ 1100 = 0001; 0001 ⊕ 0011 = 0010.

Suppose P3 is lost. The receiver XORs everything that arrived:

| Step | Bits |
|---|---|
| P1 ⊕ P2 | 1101 |
| ⊕ P4 | 1110 |
| ⊕ R | 1100 = P3 |

Only one chunk per group can be rebuilt. With two chunks missing, the XOR of the rest gives their XOR, not either chunk.

```widget
fec-lab
{ "mode": "xor", "chunks": ["1010", "0111", "1100", "0011"], "lost": 2 }
```

## Chunk interleaving

Slide 56: *Allowing some small chunks to be missing at the receiver. Not all the chunks belonging to the same packet can be missing. We can afford to let one chunk be missing in each packet.*

Slide 57 splits five packets into five chunks each and sends them column by column, so each sent packet carries one chunk of every original packet.

**a. Packet creation at sender** (chunks written right to left):

| Packet | Chunks |
|---|---|
| Packet 1 | 05 04 03 02 01 |
| Packet 2 | 10 09 08 07 06 |
| Packet 3 | 15 14 13 12 11 |
| Packet 4 | 20 19 18 17 16 |
| Packet 5 | 25 24 23 22 21 |

**b. Packets sent**, *Sending column by column*: sent Packet j carries chunk j of every original packet.

| Sent packet | Chunks |
|---|---|
| Packet 1 | 21 16 11 06 01 |
| Packet 2 | 22 17 12 07 02 |
| Packet 3 | 23 18 13 08 03 |
| Packet 4 | 24 19 14 09 04 |
| Packet 5 | 25 20 15 10 05 |

**c. Packets received**: the same, except sent Packet 3 is *Lost*.

**d. Packet recreation at receiver**, *Receiving column by column*:

| Packet | Chunks |
|---|---|
| Packet 1 | 05 04 — 02 01 |
| Packet 2 | 10 09 — 07 06 |
| Packet 3 | 15 14 — 12 11 |
| Packet 4 | 20 19 — 17 16 |
| Packet 5 | 25 24 — 22 21 |

Chunks 03, 08, 13, 18 and 23 are missing. Each original packet lacks one chunk out of five instead of one packet losing all five, and one missing chunk per packet is what the receiver can afford.

```widget
fec-lab
{ "mode": "interleave", "lostPacket": 3 }
```

### Sending column by column

Watch each sent packet lift one column out of the sender's grid, sent Packet 3 vanish on the link, and the receiver's grid refill with one gap in every row.

```widget
interleave-play
{ "packets": 5, "lost": 3 }
```

## Rebuild the lost chunk

Hex answers are accepted with or without 0x.

```quiz
[
  {
    "q": "A group has three 8-bit chunks 0x3C, 0xA5, 0x0F. What is the XOR chunk R, in hex?",
    "type": "text",
    "answer": ["96", "0x96"],
    "explain": "XOR digit by digit in binary: 3C ⊕ A5 = 0011 1100 ⊕ 1010 0101 = 1001 1001 = 0x99; 99 ⊕ 0F = 1001 1001 ⊕ 0000 1111 = 1001 0110 = 0x96."
  },
  {
    "q": "The receiver gets 0x3C, 0x0F and R = 0x96; the middle chunk is lost. What is the lost chunk, in hex?",
    "type": "text",
    "answer": ["A5", "0xA5"],
    "explain": "Pi = XOR of R and the chunks that arrived: 3C ⊕ 0F = 0x33; 33 ⊕ 96 = 0011 0011 ⊕ 1001 0110 = 1010 0101 = 0xA5."
  },
  {
    "q": "The XOR scheme splits a packet into N = 5 chunks. How much extra data is sent, in percent?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "%",
    "explain": "One XOR chunk for five data chunks: 1/5 = 20 percent extra data."
  },
  {
    "q": "With N = 10 chunks, how much extra data is sent, in percent?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "%",
    "explain": "1/10 = 10 percent. A larger N costs less, but still repairs only one lost chunk per group of N."
  }
]
```

```quiz
[
  {
    "q": "Why is retransmission not used to fix errors in real-time multimedia?",
    "options": ["Retransmission causes unacceptable delay in reproducing", "Multimedia data has no redundancy to check", "The checksum cannot detect errors in audio", "Real-time links never lose packets"],
    "answer": 0,
    "explain": "Slide 51: retransmission of corrupted and lost packets is not useful for real-time multimedia transmission, due to unacceptable delay in reproducing. The error must be corrected or the packet reproduced immediately."
  },
  {
    "q": "The XOR scheme uses N = 4 chunks. How much extra data is sent, in percent?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0,
    "unit": "%",
    "explain": "One extra chunk for four: 1/4 = 25 percent, and one out of four chunks can be rebuilt if lost."
  },
  {
    "q": "To correct 10 bits in a packet, what minimum Hamming distance is needed, in bits?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0,
    "unit": "bits",
    "explain": "d_min = 2t + 1 = 2 × 10 + 1 = 21 bits, which means a lot of redundant bits sent with the data."
  },
  {
    "q": "In the slide-57 interleaving example, sent Packet 3 is lost. Which chunks are missing after the receiver rebuilds the grid?",
    "options": ["03, 08, 13, 18, 23", "11, 12, 13, 14, 15", "21, 16, 11, 06, 01", "13 only"],
    "answer": 0,
    "explain": "Sent Packet 3 carried chunk 3 of every original packet: 23 18 13 08 03. After it is lost, each original packet misses one chunk: 03, 08, 13, 18, 23. Chunks 11 to 15 would all be gone only without interleaving."
  },
  {
    "q": "The XOR scheme can rebuild two lost chunks of the same group.",
    "type": "tf",
    "answer": false,
    "explain": "It rebuilds one: Pi = P1 ⊕ … ⊕ R ⊕ … ⊕ PN has one unknown. With two chunks missing, XORing the rest gives only their XOR."
  },
  {
    "q": "A group has two chunks, 1100 and 1010. What is the XOR chunk R? Type the bits without spaces.",
    "type": "text",
    "answer": ["0110"],
    "explain": "1100 ⊕ 1010: 1 ⊕ 1 = 0, 1 ⊕ 0 = 1, 0 ⊕ 1 = 1, 0 ⊕ 0 = 0, so R = 0110."
  },
  {
    "q": "Same group: 1100 and R = 0110 arrive; the second chunk is lost. Rebuild it. Type the bits without spaces.",
    "type": "text",
    "answer": ["1010"],
    "explain": "P2 = P1 ⊕ R = 1100 ⊕ 0110 = 1010, the chunk that was lost."
  },
  {
    "q": "Which of these are FEC techniques listed on slide 52?",
    "options": ["Hamming distance", "Using XOR", "Chunk interleaving", "Retransmission after a time-out", "Byte stuffing"],
    "answer": [0, 1, 2],
    "explain": "Slide 52: Hamming distance, using XOR, chunk interleaving, and the list continues. Retransmission is what FEC avoids, and byte stuffing is a framing method."
  }
]
```
