---
title: Example 1 and Example 2, worked, and the FDM / TDM arithmetic
minutes: 20
---

Most FDM and TDM calculations are Example 1 and Example 2 with new numbers. This lesson holds the one worked copy of each.

## The two slide examples, cold

```quiz
[
  {
    "q": "Example 1: five channels, each with a 100 kHz bandwidth, are to be multiplexed together. What is the minimum bandwidth of the link if there is a need for a guard band of 10 kHz between the channels? Answer in kHz.",
    "type": "numeric",
    "answer": 540,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "Five channels, four guard bands: $5 \\times 100 + 4 \\times 10 = 540$ kHz."
  },
  {
    "q": "Example 2: a multiplexer combines four 100 kbps channels using a time slot of 2 bits. What is the frame rate, in frames per second?",
    "type": "numeric",
    "answer": 50000,
    "tolerance": 10,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = $100\\,000 / 2 = 50\\,000$ frames/s."
  },
  {
    "q": "Example 2: what is the frame duration, in μs?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.05,
    "unit": "μs",
    "explain": "$1 / 50\\,000 = 20$ μs."
  },
  {
    "q": "Example 2: what is the bit rate of the shared channel, in kbps?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "$4 \\times 100 = 400$ kbps."
  },
  {
    "q": "Example 2: what is the bit duration on the shared channel, in μs?",
    "type": "numeric",
    "answer": 2.5,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "$1 / 400\\,000 = 2.5$ μs. Eight bits per frame at 2.5 μs each is the 20 μs frame."
  }
]
```

## Example 1 worked: five channels, four guard bands

*Five channels, each with a 100-kHz bandwidth, are to be multiplexed together. What is the minimum bandwidth of the link if there is a need for a guard band of 10 kHz between the channels to prevent interference?*

1. Guard bands sit between channels: *5 channels → at least 4 guard bands.*
2. Channels: $5 \times 100 = 500$ kHz.
3. Guard bands: $4 \times 10 = 40$ kHz.
4. *The minimum bandwidth = (5 × 100k) + (4 × 10k) = 540 kHz.*

The generalized formula, ours:

$$B_{link} = n \times B_{channel} + (n - 1) \times G$$

With the channels placed from a start frequency $f_0$, channel $k$ occupies $f_0 + (k - 1)(B + G)$ to $f_0 + (k - 1)(B + G) + B$. For the slide's 20 to 32 kHz picture, $B = 4$, $G = 0$, $f_0 = 20$: channel 2 is 24 to 28 kHz.

```widget
fdm-plan
{ "n": 5, "bandwidth": 100, "unit": "kHz", "guard": 10, "start": 0, "presets": { "Example 1 (five 100 kHz channels, 10 kHz guard)": { "n": 5, "bandwidth": 100, "unit": "kHz", "guard": 10, "start": 0 }, "Three voice channels (slide 17)": { "n": 3, "bandwidth": 4, "unit": "kHz", "guard": 0, "start": 20 } } }
```

## Example 2 worked: four 100 kbps channels, 2-bit slots

*A multiplexer combines four 100-kbps channels using a time slot of 2 bits.*

1. *Frame rate = input unit rate = 100 kbps / 2 = 50 000 frames per second.* One frame carries one unit from each line, and units of 2 bits leave a 100 kbps line 50 000 times a second.
2. *Frame duration = 1/50000 s = 20 μs.* The reciprocal of the frame rate, and equal to the input unit duration.
3. *Bit rate = 4 × 100 kbps = 400 kbps.* The link carries all four inputs, so $n$ times one input.
4. *Bit duration = 1/400 kbps = 2.5 μs.* The reciprocal of the link bit rate.

Check: *the frame duration is 8 times the bit duration because each frame is carrying 8 bits.* Four slots of 2 bits is 8 bits; $8 \times 2.5 = 20$ μs.

:::quiz Frame rate is the unit rate, not the bit rate
Had the slot been 1 bit, the frame rate would be 100 000 frames/s. The link bit rate (400 kbps) does not depend on the slot size; the frame rate and frame duration do.
:::

## The TDM recipe, generalized

Our generalization of Example 2 for $n$ inputs at rate $R$ bps with a unit of $u$ bits:

| Quantity | Formula | Example 2 |
|---|---|---|
| frame rate | $R / u$ frames/s | $100\,000 / 2 = 50\,000$ |
| frame duration | $1 / \text{frame rate} = u / R$ s | $20$ μs |
| link bit rate | $n \times R$ bps | $400\,000$ |
| link bit rate with $f$ framing bits per frame | $\text{frame rate} \times (n \times u + f)$ | $50\,000 \times 8 = 400\,000$ (no framing bits) |
| bit duration on the link | $1 / (n R)$ s | $2.5$ μs |
| bits per frame | $n \times u$ | $8$ |
| slot duration | $\text{frame duration} / n$ | $5$ μs |

Two consistency checks catch most slips: frame duration $=$ bits per frame $\times$ bit duration, and link bit rate $=$ frame rate $\times$ bits per frame ($50\,000 \times 8 = 400\,000$).

```widget
tdm-frames
{ "n": 4, "rate": 100, "unit": "kbps", "slot": 2, "streams": ["110100", "001011", "101010", "011100"], "framing": false, "presets": { "Example 2 (four 100 kbps lines, 2-bit slots)": { "n": 4, "rate": 100, "unit": "kbps", "slot": 2, "streams": ["110100", "001011", "101010", "011100"] }, "Four 1 Mbps lines (slide 35)": { "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"] } } }
```

## The unit of each quantity

| Quantity | Unit |
|---|---|
| bandwidth | Hz, kHz, MHz |
| bit rate | bps, kbps, Mbps |
| frame rate | frames/s |
| duration | s, μs |

A frame rate is in frames/s and a bandwidth in Hz, never bps.

## Practice problems of our own

These three are not from the slides; their working follows the questions.

**Problem A (FDM).** Six channels of 8 kHz are multiplexed with a 2 kHz guard band between neighbouring channels, starting at 100 kHz. Find the link bandwidth and the band of the sixth channel.

**Problem B (TDM).** Eight 64 kbps channels are multiplexed with a time slot of 8 bits. Find the frame rate, frame duration, link bit rate and bit duration.

**Problem C (rate management).** Inputs of 30, 30, 60 and 60 kbps, then a fifth input of 58 kbps is added. What does the link run at, and which strategies are used?

```quiz
[
  {
    "q": "Six channels of 8 kHz are multiplexed with a 2 kHz guard band between neighbouring channels. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 58,
    "tolerance": 0.1,
    "unit": "kHz",
    "explain": "Six channels, five guard bands: $6 \\times 8 + 5 \\times 2 = 58$ kHz."
  },
  {
    "q": "In Problem A the channels start at 100 kHz with 8 kHz channels and 2 kHz guard bands. Which band does channel 6 occupy?",
    "options": ["140 to 148 kHz", "148 to 156 kHz", "150 to 158 kHz", "158 to 166 kHz"],
    "answer": 2,
    "explain": "Each channel starts 10 kHz (8 + 2) after the previous one: channel 6 starts at $100 + 5 \\times 10 = 150$ kHz and ends at 158 kHz, the top of the 58 kHz link."
  },
  {
    "q": "Eight 64 kbps channels are multiplexed with 8-bit slots. What is the frame rate, in frames per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 1,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = $64\\,000 / 8 = 8000$ frames/s. Writing 64 000 forgets that a unit is 8 bits."
  },
  {
    "q": "Eight 64 kbps channels with 8-bit slots. What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 125,
    "tolerance": 0.1,
    "unit": "μs",
    "explain": "$1 / 8000 = 125$ μs. Check: 64 bits per frame at $1 / 512\\,000 = 1.953$ μs each gives 125 μs."
  },
  {
    "q": "Eight 64 kbps channels with 8-bit slots. What is the bit rate of the link, in kbps?",
    "type": "numeric",
    "answer": 512,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "$8 \\times 64 = 512$ kbps. The slot size does not change the link rate."
  },
  {
    "q": "Eight 64 kbps channels with 8-bit slots. What is the bit duration on the link, in μs?",
    "type": "numeric",
    "answer": 1.953,
    "tolerance": 0.002,
    "unit": "μs",
    "explain": "$1 / 512\\,000 = 1.953$ μs."
  },
  {
    "q": "Inputs of 30, 30, 60 and 60 kbps are multiplexed by multilevel multiplexing. What is the output rate, in kbps?",
    "type": "numeric",
    "answer": 180,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "30 + 30 = 60 at the first level; the main MUX then sees three 60 kbps lines: $3 \\times 60 = 180$ kbps. Multiple-slot allocation (six 30 kbps slots) gives the same 180 kbps."
  },
  {
    "q": "A 58 kbps input joins three 60 kbps inputs. Which strategy is used, and what is the output rate?",
    "options": ["Multilevel multiplexing, 238 kbps", "Multiple-slot allocation, 240 kbps", "Pulse stuffing, 232 kbps", "Pulse stuffing, 240 kbps"],
    "answer": 3,
    "explain": "58 is not an integer multiple of 60, so pulse stuffing pads it with dummy bits to the dominant rate, 60 kbps, and the link runs at $4 \\times 60 = 240$ kbps. The padded line is raised, never the fast lines lowered."
  },
  {
    "q": "Which unit belongs with a frame rate?",
    "options": ["frames/s", "bps", "Hz", "μs"],
    "answer": 0,
    "explain": "Frame rate is in frames per second; bit rate in bps; bandwidth in Hz; durations in seconds. Example 2's answer is 50 000 frames per second, not 50 kbps."
  },
  {
    "q": "In synchronous TDM, the link bit rate equals the frame rate times the number of bits in a frame.",
    "type": "tf",
    "answer": true,
    "explain": "Every frame carries $n \\times u$ bits and there are frame-rate frames per second: Example 2 gives $50\\,000 \\times 8 = 400\\,000$ bps, matching $4 \\times 100$ kbps. Use it as a check on the quiz."
  }
]
```

## Problems A, B and C worked

**A.** Six channels, five guard bands: $6 \times 8 + 5 \times 2 = 48 + 10 = 58$ kHz. Each channel starts $8 + 2 = 10$ kHz after the one before, so channel 6 starts at $100 + 5 \times 10 = 150$ kHz and occupies 150 to 158 kHz. The link runs from 100 to 158 kHz, 58 kHz wide.

**B.** Frame rate $= 64\,000 / 8 = 8000$ frames/s. Frame duration $= 1 / 8000 = 125$ μs. Link bit rate $= 8 \times 64 = 512$ kbps. Bit duration $= 1 / 512\,000 = 1.953$ μs. Check: $8 \times 8 = 64$ bits per frame, $64 \times 1.953 = 125$ μs.

**C.** The two 30 kbps lines are pre-multiplexed into one 60 kbps line (multilevel), or each 60 kbps line is given two 30 kbps slots (multiple-slot); either way the output is $3 \times 60 = 180$ kbps. The 58 kbps line is not a multiple of 60, so pulse stuffing pads it to 60 kbps, and the link becomes $4 \times 60 = 240$ kbps.
