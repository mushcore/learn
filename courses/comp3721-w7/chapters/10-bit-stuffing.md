---
title: The bit-oriented frame, the flag 01111110 and bit stuffing
minutes: 18
---

A bit-oriented frame carries any bits at all, so the 8-bit flag pattern can turn up inside the data. Bit stuffing changes the data just enough that the receiver never sees the flag pattern between the two real flags.

## The bit-oriented frame and the flag 01111110

Slides 17 and 18 draw the frame as one row, the data a *Variable number of bits*:

| Flag | Header | Data from upper layer | Trailer | Flag |
|---|---|---|---|---|
| 01111110 | Header | 01111010110 • • • 11011110 | Trailer | 01111110 |

Slide 18: *A special 8-bit pattern as the delimiter to define the beginning and the end of the frame – 01111110 is the common flag between most protocols.*

The flag is a 0, six 1s, and a 0. Data that never holds six 1s in a row can never look like a flag. The figure's two data fragments have no run of five 1s, so nothing would be stuffed in them.

## Bit stuffing adds a 0 after five consecutive 1s

Slides 19 and 20: *Bit stuffing is the process of adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern 01111110 for a flag.*

The sender runs the rule as a counter:

1. After a 0, count the 1s that follow in a row.
2. When the count reaches five, insert a 0 and restart the count.
3. Insert the 0 whatever the next data bit is, even when it is already a 0.
4. At the very start of the data, the bit before it is the flag's last 0, so five leading 1s are stuffed too.

Unstuffing is the mirror: the receiver removes the 0 that follows any five consecutive 1s. After stuffing, the data field never holds six 1s in a row, so the only 01111110 the receiver sees is a real flag.

Rule 3 follows from unstuffing. The receiver removes the bit after every five 1s without looking at it. If the sender skipped the stuff because the next data bit was already a 0, the receiver would remove that real data bit and deliver one bit too few.

:::warn Two different things called bit stuffing
Week 6's TDM [pulse stuffing](#/comp3721-w6/tdm-rate-management) (06a, slide 43, "bit padding, bit stuffing") adds dummy bits to raise a slower line to the dominant rate; it is a different thing from this framing bit stuffing, a 0 after five 1s.
:::

## The slide's 22 bits become 24

Slide 21 stuffs the 22-bit data 0001111111001111101000. Grouped by the counter:

```text
data     000 11111 11 00 11111 01000          22 bits
stuffed  000 11111 0 11 00 11111 0 01000      24 bits
```

| Where | What the counter sees | Stuffed |
|---|---|---|
| data bits 4 to 8 | five 1s after a 0 (the run is seven 1s long, bits 4 to 10) | a 0 after data bit 8 |
| data bits 9 and 10 | the count restarts: two 1s, then a 0 | nothing |
| data bits 13 to 17 | five 1s after a 0 | a 0 after data bit 17, although data bit 18 is already 0 |

*Frame sent*: Flag | Header | 000111110110011111001000 | Trailer | Flag. The extra 0s are bits 9 and 19 of the 24-bit stuffed field: *Two extra bits*. The frame received is identical, and unstuffing gives back 0001111111001111101000.

## The slide's 22 bits

The counter row under the data runs 0 to 5; each stuffed 0 is red. The unstuffed row at the bottom should equal the input.

```widget
stuffing
{ "mode": "bit", "data": "0001111111001111101000" }
```

### The sender's counter of 1s

One data bit per step: watch the counter reach five and the red 0 drop in, even before a bit that is already 0. Then the receiver scans the field and removes each 0 after five 1s.

```widget
stuff-play
{ "mode": "bit", "data": "0001111111001111101000", "unstuff": true }
```

## Stuff three more bit strings

Run the counter on each string and type the result without spaces.

```quiz
[
  {
    "q": "Bit-stuff the data 0111111111110. Type the stuffed bits without spaces.",
    "type": "text",
    "answer": ["011111011111010"],
    "explain": "0, then eleven 1s, then 0. Count: 0 | 11111 → stuff 0 | 11111 → stuff 0 | 1 | 0. Stuffed: 0 11111 0 11111 0 1 0 = 011111011111010, 15 bits, 2 extra. The second stuffed 0 goes in after the tenth 1 even though only one 1 remains."
  },
  {
    "q": "The data itself is the flag pattern 01111110. Bit-stuff it and type the stuffed bits without spaces.",
    "type": "text",
    "answer": ["011111010"],
    "explain": "0 | 11111 → stuff 0 | 1 | 0. Stuffed: 0 11111 0 1 0 = 011111010, 9 bits, 1 extra. The six 1s are broken into 11111 0 1, so the receiver never sees 01111110 inside the data."
  },
  {
    "q": "A receiver gets the stuffed data field 0001111101100. Unstuff it and type the data bits without spaces.",
    "type": "text",
    "answer": ["000111111100"],
    "explain": "Remove the 0 that follows five consecutive 1s: 000 11111 [0] 1100 → 000 11111 1100 = 000111111100, 12 bits. Check by stuffing it again: 000 11111 → stuff 0 → 1100 gives 0001111101100."
  }
]
```

```quiz
[
  {
    "q": "Bit-stuff the slide's data 0001111111001111101000. Type the stuffed data field without spaces.",
    "type": "text",
    "answer": ["000111110110011111001000"],
    "explain": "000 | 11111 → stuff 0 | 11 | 00 | 11111 → stuff 0 | 01000. Stuffed: 000 11111 0 11 00 11111 0 01000 = 000111110110011111001000, 24 bits."
  },
  {
    "q": "How many extra bits does bit stuffing add to the slide's 22-bit data 0001111111001111101000?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Two runs reach five 1s (data bits 4 to 8 and 13 to 17), so two 0s are inserted: 22 → 24 bits, *Two extra bits*."
  },
  {
    "q": "Bit-stuff the data 1111101111110. Type the stuffed bits without spaces.",
    "type": "text",
    "answer": ["111110011111010"],
    "explain": "The data starts right after the flag's last 0, so the leading 11111 counts: 11111 → stuff 0 | 0 | 11111 → stuff 0 | 1 | 0. Stuffed: 11111 0 0 11111 0 1 0 = 111110011111010, 15 bits. The first stuffed 0 goes in although the next data bit is already 0."
  },
  {
    "q": "How many extra bits does bit stuffing add to the data 1111101111110?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Two runs reach five 1s: the leading 11111 and the 11111 inside the six 1s. 13 → 15 bits, 2 extra."
  },
  {
    "q": "The data is seventeen 1s in a row. How many extra bits does bit stuffing add?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "A 0 after every five 1s: 11111 0 11111 0 11111 0 11 = 11111011111011111011. 17 ÷ 5 = 3 full runs of five, so 3 extra bits; 17 → 20 bits."
  },
  {
    "q": "In bit stuffing, no 0 is stuffed when the bit after five consecutive 1s is already a 0.",
    "type": "tf",
    "answer": false,
    "explain": "The 0 goes in whatever the next bit is. On slide 21 the second stuffed 0 follows data bits 13 to 17 although data bit 18 is already a 0. The receiver removes the 0 after any five 1s, so skipping it would make the receiver delete a real data bit."
  },
  {
    "q": "What is the common flag between most bit-oriented protocols? Type the 8 bits without spaces.",
    "type": "text",
    "answer": ["01111110"],
    "explain": "*01111110 is the common flag between most protocols*: a 0, six 1s, a 0. It marks the beginning and the end of the frame."
  },
  {
    "q": "Why does the sender stuff bits into the data?",
    "options": ["So the receiver does not mistake the pattern 01111110 in the data for a flag", "To make the data a whole number of bytes", "To raise a slower line to the rate of the faster lines", "To add error-detection redundant bits"],
    "answer": 0,
    "explain": "Slide 19: the extra 0 goes in *so that the receiver does not mistake the pattern 01111110 for a flag*. Raising a slower line to the dominant rate is Week 6's pulse stuffing, a different thing; error-detection bits ride in the trailer."
  },
  {
    "q": "Fill in the blank with the slide's word.",
    "type": "fill",
    "code": "Bit stuffing is the process of adding one extra 0 whenever ___ consecutive 1s follow a 0 in the data.",
    "answer": ["five", "Five", "5"],
    "explain": "*Bit stuffing is the process of adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern 01111110 for a flag.*"
  }
]
```
