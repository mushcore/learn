---
title: Empty slots, data-rate management and framing bits
minutes: 18
---

Synchronous TDM assumes every input has data for every frame and sends at the same rate. Real inputs are sometimes silent and often run at different rates, and the demultiplexer must know where each frame starts.

## Empty slots make synchronous TDM inefficient

The slide asks why synchronous TDM is not efficient. Its answer: *If a source does not have data to send, the corresponding slot in the output frame is empty.* The slot is reserved for that input whether or not it uses it, so a silent source wastes link time.

*Statistical TDM can improve the efficiency by removing the empty slots from the frame.* The slides only name it; nothing more about statistical TDM is examinable.

## Three strategies for unequal input rates

Slide wording: *How to handle a disparity in the input data rates? Three strategies, or a combination of them, can be used:* **multilevel multiplexing**, **multiple-slot allocation**, **pulse stuffing**. The first two apply when one rate is a multiple of the others; the third when it is not.

## Multilevel multiplexing: pre-multiplex the slow lines

*It is a technique used when the data rate of an input line is a multiple of others.*

The figure: two 20 kbps lines enter a small MUX whose output is 40 kbps. That 40 kbps line and three 40 kbps lines enter the main MUX:

$$20 + 20 = 40 \qquad 4 \times 40 = \mathbf{160\ kbps}$$

The first level turns two slow lines into one line at the common rate, so the second level sees four equal 40 kbps inputs.

## Multiple-slot allocation: demultiplex the fast line

*Allocating more than one slot in a frame to a single input line. When an input line has multiple rates of the others.*

The figure runs the other way: a 50 kbps line enters a **demultiplexer** that splits it into two 25 kbps lines. Those two plus three 25 kbps lines enter the MUX:

$$50 = 2 \times 25 \qquad 5 \times 25 = \mathbf{125\ kbps}$$

The frame has 5 slots and, in the slide's words, *the input with a 50-kHz data rate has two slots in each frame*. The slide says kHz; the figure says 50 kbps, and kbps is the rate meant. Two slots in each frame, not two frames.

## Pulse stuffing: pad the slow line up to the dominant rate

Slide wording: *Pulse stuffing or bit padding or bit stuffing. Used when the bit rates of sources are not integer multiples of each other. Makes the highest input data rate the dominant data rate and then adds dummy bits to the input lines with lower rates → their rates are increased.*

The figure: 50 kbps, 50 kbps and 46 kbps. 46 is not a multiple of 50, so a *Pulse stuffing* box pads the 46 kbps line to 50 kbps and the MUX sees three equal inputs:

$$46 \to 50 \qquad 3 \times 50 = \mathbf{150\ kbps}$$

The dummy bits carry no data. The highest input rate is the dominant rate, so the slower lines are raised and the fastest line is never slowed.

## Which strategy, from the input rates

```widget
rate-manager
{ "rates": "20 20 40 40 40", "unit": "kbps", "preset": "Multilevel multiplexing (slide 40)" }
```

| Inputs | Relation | Strategy | Output |
|---|---|---|---|
| 20, 20, 40, 40, 40 kbps | 40 is a multiple of 20 | multilevel: 20 + 20 → 40 | 160 kbps |
| 50, 25, 25, 25 kbps | 50 is a multiple of 25 | multiple-slot: 50 → 2 × 25 | 125 kbps |
| 50, 50, 46 kbps | 46 is not a multiple | pulse stuffing: 46 → 50 | 150 kbps |

The output rate is the number of slots in the frame times the rate per slot, after the fix.

### The three fixes as frame sequences

In multilevel multiplexing line 1 carries A and B in turn; in multiple-slot allocation line A fills two slots of every frame; in pulse stuffing a dummy unit fills line 3's slot like data.

```widget
tdm-play
{ "preset": "Multilevel multiplexing (slide 40)", "presets": ["Multilevel multiplexing (slide 40)", "Multiple-slot allocation (slide 42)", "Pulse stuffing (slide 44)"], "title": "Multilevel, multiple-slot and pulse-stuffed frames" }
```

## Framing bits keep the MUX and DEMUX in step

Slide wording: *Synchronization between the multiplexer and demultiplexer is a major issue (to maintain the integrity of the frames exchange between source and destination).* If the DEMUX is one slot off, every unit goes to the wrong output.

*Framing bits: One or more synchronization bits that are usually added to the beginning of each frame.* They *follow a pattern (e.g., 1 0 1 …) frame to frame → Allow the demultiplexer to synchronize with the incoming stream so that it can separate the time slots accurately.*

The figure adds one framing bit in front of the A, B, C frames: Frame 1 = 1 | C1 _ A1, Frame 2 = 0 | _ B2 A2, Frame 3 = 1 | C3 B3 A3. The framing bits read 1 0 1 across the frames, and the blank slots are empty slots from a silent input, the inefficiency from the top of this lesson drawn in.

### The slide-45 frames with framing bits and empty slots

Each frame starts with its framing bit, and a line with no data leaves its slot empty; the empty slot still crosses the link.

```widget
tdm-play
{ "preset": "Empty slots and framing bits (slide 45)" }
```

A framing bit is overhead: a frame of $n$ slots plus one framing bit carries $n \times \text{unit} + 1$ bits, so the link rate rises by one bit per frame.

## Pick the strategy and the link rate for three new input sets

Raise or split the inputs until every slot carries the same rate, then multiply by the number of slots.

```quiz
[
  {
    "q": "Inputs of 16, 16, 32 and 32 kbps are to be multiplexed by first combining the two 16 kbps lines. Which strategy is this?",
    "options": ["Multilevel multiplexing", "Multiple-slot allocation", "Pulse stuffing", "Statistical TDM"],
    "answer": 0,
    "explain": "32 is a multiple of 16, and the two slow lines are pre-multiplexed into one 32 kbps line: **multilevel multiplexing**, as in the slide's 20 + 20 → 40."
  },
  {
    "q": "What is the output rate for those inputs, 16, 16, 32 and 32 kbps, in kbps?",
    "type": "numeric",
    "answer": 96,
    "tolerance": 0.01,
    "unit": "kbps",
    "explain": "$16 + 16 = 32$, so the main MUX sees three 32 kbps inputs: $3 \\times 32 = 96$ kbps."
  },
  {
    "q": "A 120 kbps line joins three 40 kbps lines with multiple-slot allocation. How many slots in each frame does the 120 kbps line get?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "unit": "slots",
    "explain": "$120 / 40 = 3$: a demultiplexer splits it into three 40 kbps lines, so it has 3 slots of the 6 in each frame and the link runs at $6 \\times 40 = 240$ kbps."
  },
  {
    "q": "Inputs of 64, 64 and 61 kbps are multiplexed with pulse stuffing. What is the output rate, in kbps?",
    "type": "numeric",
    "answer": 192,
    "tolerance": 0.01,
    "unit": "kbps",
    "explain": "61 is not a multiple of 64, so 64 kbps is the dominant rate and the 61 kbps line is padded to 64: $3 \\times 64 = 192$ kbps."
  },
  {
    "q": "In that pulse-stuffing case, how many dummy bits per second are added to the 61 kbps line?",
    "type": "numeric",
    "answer": 3000,
    "tolerance": 1,
    "unit": "bits/s",
    "explain": "$64000 - 61000 = 3000$ dummy bits each second."
  },
  {
    "q": "Four 100 kbps lines with 1-bit slots get one framing bit at the start of each frame. What is the link bit rate, in kbps?",
    "type": "numeric",
    "answer": 500,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "Frame rate $= 100000$ frames/s and each frame holds $4 \\times 1 + 1 = 5$ bits, so $100000 \\times 5 = 500000$ bps $= 500$ kbps, 100 kbps more than without framing."
  }
]
```

```quiz
[
  {
    "q": "Why is synchronous TDM not efficient?",
    "options": ["The link must be n times faster than each input", "A source with no data to send leaves its slot in the frame empty", "Framing bits take half the frame", "Guard bands waste bandwidth"],
    "answer": 1,
    "explain": "If a source does not have data to send, the corresponding slot in the output frame is empty; the slot is reserved anyway. Statistical TDM improves efficiency by removing the empty slots."
  },
  {
    "q": "Fill in the blank: ________ TDM can improve the efficiency by removing the empty slots from the frame.",
    "type": "text",
    "answer": ["statistical"],
    "explain": "Statistical TDM. The slides only name it as the fix for empty slots."
  },
  {
    "q": "Which strategy does the slide use for inputs of 50 kbps, 50 kbps and 46 kbps?",
    "options": ["Multilevel multiplexing", "Multiple-slot allocation", "Statistical TDM", "Pulse stuffing"],
    "answer": 3,
    "explain": "46 is not an integer multiple of 50, so pulse stuffing: the 46 kbps line is padded with dummy bits up to the dominant rate, 50 kbps, and the link runs at 3 × 50 = 150 kbps."
  },
  {
    "q": "Two 20 kbps lines and three 40 kbps lines are combined by multilevel multiplexing. What is the output rate, in kbps?",
    "type": "numeric",
    "answer": 160,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "The two 20 kbps lines are multiplexed first into one 40 kbps line; the main MUX then sees four 40 kbps lines: $4 \\times 40 = 160$ kbps."
  },
  {
    "q": "A 50 kbps line and three 25 kbps lines are combined with multiple-slot allocation. What is the output rate, in kbps?",
    "type": "numeric",
    "answer": 125,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "The 50 kbps line is demultiplexed into two 25 kbps lines, giving five 25 kbps inputs: $5 \\times 25 = 125$ kbps. The 50 kbps input gets two slots in each frame."
  },
  {
    "q": "In multiple-slot allocation, the faster input is given two frames instead of one.",
    "type": "tf",
    "answer": false,
    "explain": "It is given more than one **slot** in a frame: the 50 kbps input has two slots in each 5-slot frame. The frame rate is unchanged."
  },
  {
    "q": "In pulse stuffing, which input rate becomes the dominant data rate?",
    "options": ["The lowest input rate", "The average of the input rates", "The highest input rate", "The output link rate divided by n"],
    "answer": 2,
    "explain": "Pulse stuffing makes the highest input data rate the dominant rate and adds dummy bits to the lower-rate lines so their rates are increased to match."
  },
  {
    "q": "Which of these is **not** another name for pulse stuffing on the slide?",
    "options": ["Bit padding", "Bit stuffing", "Slot allocation", "Pulse stuffing"],
    "answer": 2,
    "explain": "The slide's three names are pulse stuffing, bit padding and bit stuffing. Multiple-slot allocation is a different strategy, for rates that are multiples."
  },
  {
    "q": "Inputs of 30, 30, 60 and 60 kbps are to be multiplexed. Which strategies could be used?",
    "options": ["Multilevel multiplexing or multiple-slot allocation", "Pulse stuffing only", "Statistical TDM only", "None; the rates must be equal"],
    "answer": 0,
    "explain": "60 is a multiple of 30, so either pre-multiplex the two 30 kbps lines into one 60 kbps line (multilevel) or give each 60 kbps line two 30 kbps slots (multiple-slot). Pulse stuffing is for rates that are not integer multiples."
  },
  {
    "q": "Fill in the blank: one or more synchronization bits usually added to the beginning of each frame are called ________ bits.",
    "type": "text",
    "answer": ["framing"],
    "explain": "Framing bits. They follow a pattern such as 1 0 1 from frame to frame so the demultiplexer can separate the time slots accurately."
  },
  {
    "q": "Where are framing bits usually added?",
    "options": ["To the end of each frame", "Between every pair of slots", "To the beginning of each frame", "Only to the first frame of a transmission"],
    "answer": 2,
    "explain": "Slide wording: usually added to the beginning of each frame. Every frame carries one, and the bits follow a pattern frame to frame."
  },
  {
    "q": "The purpose of framing bits is to let the multiplexer decide which input gets more slots.",
    "type": "tf",
    "answer": false,
    "explain": "Framing bits allow the **demultiplexer** to synchronize with the incoming stream so that it can separate the time slots accurately. Slot allocation is a data-rate management strategy, not a synchronization one."
  }
]
```
