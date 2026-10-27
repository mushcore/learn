---
title: "E06 worked, and the TDM rates with framing bits and unequal inputs"
minutes: 20
---

The Week 6 exercise sheet (E06) has three synchronous TDM questions with the instructor's answers. They are the only place the three are worked; answer them cold first.

## E06: Week 6 exercises

### Exercise 1

> The following figure shows synchronous TDM with a data stream for each input and one data stream for the output. The unit of data is 1 bit. Find
> 1. The input bit duration
> 2. The output bit duration
> 3. The output bit rate
> 4. The output frame rate

The figure: four 1 Mbps inputs enter a MUX; the rightmost bit of each line is sent first.

| Line | Bits |
|---|---|
| 1 | … 1 1 1 1 1 |
| 2 | … 0 0 0 0 0 |
| 3 | … 1 0 1 0 1 |
| 4 | … 0 0 1 0 0 |

The output, labelled Frames, reads … 0101 | 0001 | 1101 | 0001 | 0101, the rightmost frame first.

### Exercise 2

> We are using TDM to multiplex four channels. We have four sources, each creating 250 characters per second. If the input unit is a character and 1 synchronizing bit is added to each frame, find
> 1. The data rate of each source
> 2. The duration of each character in each source
> 3. The frame rate
> 4. The duration of each frame
> 5. The number of bits in each frame
> 6. The data rate of the link.
>
> Note that each character is 8 bits long.

### Exercise 3

> Two channels, one with a bit rate of 100 kbps and another with a bit rate of 200 kbps, are to be multiplexed using synchronous TDM technique. How this can be achieved and by which data rate management technique? What is the frame rate? What is the frame duration? What is the bit rate of the link?

```quiz
[
  {
    "q": "E06 exercise 1: four 1 Mbps inputs, 1-bit units. What is the input bit duration, in μs?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "μs",
    "explain": "Input bit duration $= 1 / (1\\ \\text{Mbps}) = 1 / 1000000$ s $= 1$ μs."
  },
  {
    "q": "E06 exercise 1: what is the output bit duration, in μs?",
    "type": "numeric",
    "answer": 0.25,
    "tolerance": 0.001,
    "unit": "μs",
    "explain": "The link runs at $4 \\times 1 = 4$ Mbps, so one output bit lasts $1 / 4000000$ s $= 0.25$ μs, $n = 4$ times shorter than an input bit."
  },
  {
    "q": "E06 exercise 1: what is the output bit rate, in Mbps?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "Mbps",
    "explain": "Output bit rate (transmission rate of the link) $= n \\times$ input rate $= 4 \\times 1$ Mbps $= 4$ Mbps."
  },
  {
    "q": "E06 exercise 1: what is the output frame rate, in frames/s?",
    "type": "numeric",
    "answer": 1000000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Frame rate = input rate. With 1-bit units each line delivers $1000000$ units/s, so $1000000$ frames/s. Check: $1000000 \\times 4$ bits per frame $= 4$ Mbps."
  },
  {
    "q": "E06 exercise 2: four sources each create 250 characters per second, 8 bits per character. What is the data rate of each source, in bps?",
    "type": "numeric",
    "answer": 2000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "$250 \\times 8 = 2000$ bps $= 2$ kbps. Characters per second is the unit rate; times 8 bits gives the bit rate."
  },
  {
    "q": "E06 exercise 2: what is the duration of each character in each source, in ms?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "ms",
    "explain": "One character every $1 / 250$ s $= 0.004$ s $= 4$ ms. This is the input unit duration $T$."
  },
  {
    "q": "E06 exercise 2: what is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 250,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = 250 characters/s, so 250 frames per second: each frame takes one character from every source."
  },
  {
    "q": "E06 exercise 2: what is the duration of each frame, in ms?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "ms",
    "explain": "Frame duration $= 1 / 250$ s $= 4$ ms, the same as one input character. The framing bit does not change it."
  },
  {
    "q": "E06 exercise 2: one synchronizing bit is added to each frame. How many bits are in each frame?",
    "type": "numeric",
    "answer": 33,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Four 8-bit characters plus one framing bit: $4 \\times 8 + 1 = 33$ bits."
  },
  {
    "q": "E06 exercise 2: what is the data rate of the link, in bps?",
    "type": "numeric",
    "answer": 8250,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Link rate = frame rate × frame size $= 250 \\times 33 = 8250$ bps. The framing bit counts: $4 \\times 2000 = 8000$ bps is the data alone, and the framing bits add $1 \\times 250 = 250$ bps."
  },
  {
    "q": "E06 exercise 3: a 100 kbps channel and a 200 kbps channel are multiplexed with synchronous TDM. Which data-rate management technique is used?",
    "options": ["Multiple-slot allocation", "Multilevel multiplexing", "Pulse stuffing", "Statistical TDM"],
    "answer": 0,
    "explain": "200 is an integer multiple of 100, so the 200 kbps channel gets two slots in each frame and the 100 kbps channel one: **multiple-slot allocation**. Multilevel multiplexing would need a second 100 kbps line to combine up to 200; pulse stuffing is for rates that are not integer multiples; statistical TDM removes empty slots."
  },
  {
    "q": "E06 exercise 3: how many slots in each frame does the 200 kbps channel get?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "slots",
    "explain": "$200 / 100 = 2$: the 200 kbps channel is split into two 100 kbps slots, so each frame has $1 + 2 = 3$ slots."
  },
  {
    "q": "E06 exercise 3: with 1-bit slots, what is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 100000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Every slot carries 100 kbps, and with 1 bit per slot that is $100000$ units/s, so $100000$ frames per second, the official answer."
  },
  {
    "q": "E06 exercise 3: what is the frame duration, in μs?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "μs",
    "explain": "Frame duration $= 1 / 100000$ s $= 10$ μs."
  },
  {
    "q": "E06 exercise 3: what is the bit rate of the link, in kbps?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "$3$ slots $\\times 100$ kbps $= 300$ kbps. Check: $100000$ frames/s $\\times 3$ bits per frame $= 300000$ bps."
  },
  {
    "q": "Three sources each create 500 characters per second (8-bit characters), one character per slot, and 1 framing bit is added to each frame. What is the data rate of the link, in bps?",
    "type": "numeric",
    "answer": 12500,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Frame rate = 500 frames/s. Bits per frame $= 3 \\times 8 + 1 = 25$. Link rate $= 500 \\times 25 = 12500$ bps: $12000$ bps of data plus $500$ bps of framing."
  },
  {
    "q": "A 64 kbps channel and a 192 kbps channel are multiplexed with multiple-slot allocation and 1-bit slots. What is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 64000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "$192 / 64 = 3$, so the 192 kbps channel takes three 64 kbps slots and each frame has $1 + 3 = 4$ slots. With 1-bit slots the frame rate is the per-slot rate: $64000$ frames/s."
  },
  {
    "q": "Same 64 kbps and 192 kbps channels. What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 15.625,
    "tolerance": 0.001,
    "unit": "μs",
    "explain": "$1 / 64000$ s $= 0.000015625$ s $= 15.625$ μs."
  },
  {
    "q": "Same 64 kbps and 192 kbps channels. What is the bit rate of the link, in kbps?",
    "type": "numeric",
    "answer": 256,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "$4$ slots $\\times 64$ kbps $= 256$ kbps, which is also $64 + 192$. Check: $64000$ frames/s $\\times 4$ bits $= 256000$ bps."
  },
  {
    "q": "On the E06 exercise 2 link (8250 bps, 33 bits per frame), how long does one 8-bit character slot last, in μs?",
    "type": "numeric",
    "answer": 969.7,
    "tolerance": 0.1,
    "unit": "μs",
    "explain": "One link bit lasts $1 / 8250$ s $= 121.21$ μs, so an 8-bit slot lasts $8 \\times 121.21 = 969.7$ μs, not $T/n = 4\\ \\text{ms} / 4 = 1$ ms. Check: $4 \\times 969.7 + 121.2 = 4000$ μs $= T$."
  }
]
```

## Exercise 1 worked: the slide-35 figure

Official answer: *The input bit duration = 1/(1 Mbps) = 1/(1000000 bps) = 1 μs. The output bit duration = 1/(4 Mbps) = 1/(4000000 bps) = 0.25 μs. The output bit rate (transmission rate of the link) = 4 × 1Mbps = 4 Mbps. The frame rate = input rate = 1000000 frames per second.*

This is the Lecture 06a slide-35 figure exactly, with the same bits, frames and numbers, worked in [Synchronous TDM](#/comp3721-w6/synchronous-tdm).

### The slide-35 frames and rates

Step through the five frames; the rate table holds all four answers.

```widget
tdm-frames
{ "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"], "framing": false, "presets": { "E06 exercise 1 (slide 35)": { "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"] } }, "title": "E06 exercise 1: four 1 Mbps lines" }
```

## Exercise 2 worked: character units and a framing bit

Official answer: *Data rate of each source = 250 × 8 = 2000 bps = 2 kbps. Duration of each character = 1/250 = 4 ms. Frame rate = input unit rate = 250 frames per second. Duration of each frame = 1/250 = 4 ms. The number of bits in each frame = 4 × 8 + 1 = 33 bits. The data rate of the link = frame rate × frame size = 250 x 33 = 8250 bps.*

Characters per second is already the unit rate, so the frame rate is 250 frames/s; times 8 gives the bit rate.

The link rate counts the framing bit. Four sources at 2000 bps carry 8000 bps of data, and one framing bit in each of 250 frames adds 250 bps: 8250 bps. "n × input rate" holds only when no framing bits are added; frame rate × bits per frame always holds.

The slot is not T/n here. The frame still lasts T = 4 ms, but it now holds 33 bits, so one link bit lasts 1/8250 s = 121.2 μs and a character slot lasts 8 × 121.2 = 969.7 μs, a little shorter than 4 ms / 4 = 1 ms.

### One frame of the exercise 2 link

One framing bit, then four 8-bit characters. Turn framing off: the link drops to 8000 bps and the slot returns to T/4 = 1 ms.

```widget
tdm-frames
{ "n": 4, "rate": 2, "unit": "kbps", "slot": 8, "streams": ["01000001", "01000010", "01000011", "01000100"], "framing": true, "presets": { "E06 exercise 2 (framing bit)": { "n": 4, "rate": 2, "unit": "kbps", "slot": 8, "streams": ["01000001", "01000010", "01000011", "01000100"], "framing": true }, "Same sources, no framing bit": { "n": 4, "rate": 2, "unit": "kbps", "slot": 8, "streams": ["01000001", "01000010", "01000011", "01000100"], "framing": false } }, "title": "E06 exercise 2: four 250 characters/s sources" }
```

## Exercise 3 worked: multiple-slot allocation for 100 and 200 kbps

Official answer: *We can allocate one slot to the first channel and two slots to the second channel. So, the multiple-slot allocation technique is used. Frame rate = 100000 frames per second. Frame duration = 1/100000 = 10 μs. Bit rate of the link = 3 × 100 kbps = 300 kbps.*

The slot size is never stated. The official 100 000 frames/s assumes one bit per slot, as exercise 1 states outright; with 2-bit slots the frame rate would be 50 000 frames/s and the frame 20 μs, with the same 300 kbps link.

Multilevel multiplexing does not fit: there is no second 100 kbps line to combine up to 200 kbps. Pulse stuffing would pad 100 up to 200 and waste 100 kbps; the slides keep it for rates that are not integer multiples. The slide-42 figure draws the same split as a demultiplexer on the fast line; see [Empty slots, data-rate management and framing bits](#/comp3721-w6/tdm-rate-management).

### The strategy from the two rates

```widget
rate-manager
{ "rates": "100 200", "unit": "kbps" }
```

### The 200 kbps channel in two slots of every frame

Lines 1 and 2 are the two halves of the 200 kbps channel A; line 3 is the 100 kbps channel B.

```widget
tdm-play
{ "n": 3, "rate": 100, "unit": "kbps", "slot": 1, "streams": ["A1 A3 A5", "A2 A4 A6", "B1 B2 B3"], "note": "Multiple-slot allocation: the 200 kbps channel A is split into two 100 kbps lines, so it fills two of the three slots in each frame: 3 × 100 = 300 kbps.", "title": "E06 exercise 3: 100 and 200 kbps, multiple-slot" }
```

## Which rate sets the frame rate

In every case the frame rate is the unit rate of one slot, and the link rate is frame rate × bits per frame.

| Case | Unit rate of one slot | Frame rate | Bits per frame | Link rate |
|---|---|---|---|---|
| Example 2: four 100 kbps lines, 2-bit units | 100 000 / 2 = 50 000 units/s | 50 000 frames/s | 4 × 2 = 8 | 50 000 × 8 = 400 kbps |
| E06 1: four 1 Mbps lines, 1-bit units | 1 000 000 units/s | 1 000 000 frames/s | 4 × 1 = 4 | 1 000 000 × 4 = 4 Mbps |
| E06 2: four sources at 250 characters/s, 1 framing bit | 250 characters/s | 250 frames/s | 4 × 8 + 1 = 33 | 250 × 33 = 8250 bps |
| E06 3: 100 + 200 kbps, multiple-slot, 1-bit slots | 100 000 / 1 = 100 000 units/s per slot | 100 000 frames/s | 1 + 2 = 3 | 100 000 × 3 = 300 kbps |
| Slide 42: 50 kbps + three 25 kbps, multiple-slot | 25 000 units/s per slot | 25 000 frames/s | 2 + 3 = 5 | 25 000 × 5 = 125 kbps |

```quiz
[
  {
    "q": "Adding one framing bit to each frame raises the link bit rate by one bit per frame.",
    "type": "tf",
    "answer": true,
    "explain": "The framing bit is part of the frame, so the link carries frame rate × bits per frame. In E06 exercise 2 that is $250 \\times 33 = 8250$ bps, 250 bps more than the $8000$ bps of data."
  },
  {
    "q": "With a framing bit added to each frame, each slot still lasts exactly T/n.",
    "type": "tf",
    "answer": false,
    "explain": "The frame still lasts T, but it holds one extra bit, so each slot is a little shorter than T/n. In E06 exercise 2 a slot lasts $8 / 8250$ s $= 969.7$ μs, not $4\\ \\text{ms} / 4 = 1$ ms."
  },
  {
    "q": "Why is multilevel multiplexing not used for a 100 kbps channel and a 200 kbps channel?",
    "options": ["There is no second 100 kbps line to combine up to 200 kbps", "100 and 200 are not integer multiples of each other", "Multilevel multiplexing needs framing bits", "Multilevel multiplexing is only for FDM"],
    "answer": 0,
    "explain": "Multilevel multiplexing pre-multiplexes slow lines into one line at the faster rate, as 20 + 20 → 40 on slide 40. With a single 100 kbps line there is nothing to combine, so the 200 kbps line is split instead: multiple-slot allocation. 200 is an integer multiple of 100."
  },
  {
    "q": "With multiple-slot allocation and 1-bit slots, what is the frame rate equal to?",
    "options": ["The rate of one slot, the slower line's bit rate", "The faster line's bit rate", "The link bit rate", "The number of slots per frame"],
    "answer": 0,
    "explain": "Each frame carries one bit in every slot, and every slot runs at the slower line's rate, so frames arrive at that rate: 100 000 frames/s for 100 + 200 kbps, 25 000 frames/s for the slide-42 figure."
  },
  {
    "q": "A source creates 1200 characters per second with 8-bit characters. What is its bit rate, in bps?",
    "type": "numeric",
    "answer": 9600,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Characters per second is the unit rate; $1200 \\times 8 = 9600$ bps. Each character lasts $1 / 1200$ s $= 0.833$ ms."
  },
  {
    "q": "If the 100 kbps and 200 kbps channels of E06 exercise 3 used 2-bit slots instead, what would the frame rate be, in frames/s?",
    "type": "numeric",
    "answer": 50000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Each slot now carries 2 bits at 100 kbps, so $100000 / 2 = 50000$ units/s and $50000$ frames/s; the frame lasts 20 μs and holds $3 \\times 2 = 6$ bits, so the link is still $50000 \\times 6 = 300$ kbps."
  }
]
```
