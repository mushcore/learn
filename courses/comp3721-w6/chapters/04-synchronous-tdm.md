---
title: "Synchronous TDM: units, slots, frames and rates"
minutes: 22
---

TDM shares a link in time instead of in frequency: each input gets a turn, and the link runs fast enough that every input's data gets through. The whole topic is one picture and a handful of rates that follow from it.

## TDM is digital and shares time

Slide wording: *A digital multiplexing technique that allows several digital signals to share the high bandwidth of a link in time. Each connection occupies a portion of time in the link.* Also: *TDM is a digital multiplexing technique for combining several low-rate channels into a high-rate one.* And the contrast with FDM: *Instead of sharing a portion of the bandwidth as in FDM, time is shared.*

The slide asks whether TDM can carry an analog signal. Its answer: *An analog signal can be sampled, changed to digital data, and then multiplexed by using TDM.*

## Units, frames and slots

Slide wording: *In TDM, the data flow of each input connection is divided into units. A unit can be 1 bit, one character, or one block of data. A round of data units from each input connection is collected into a frame. If we have n connections, a frame is divided into n time slots and one slot is allocated for each unit.*

The boxed timing rule: *If the duration of the input unit is T, the duration of each slot is T/n and the duration of each frame is T.*

| Thing | Duration | Why |
|---|---|---|
| input unit | $T$ | the input line sends one unit every $T$ seconds |
| slot on the link | $T / n$ | $n$ units must fit in the time of one |
| frame on the link | $T$ | $n$ slots of $T / n$ |

## Slide figure: lines A, B, C into frames

Three inputs each send one unit every $T$ seconds (*Data are taken from each line every T s*): A1, A2, A3 on the top line, B1, B2, B3 and C1, C2, C3 below. The MUX builds:

| Frame 1 | Frame 2 | Frame 3 |
|---|---|---|
| C1 B1 A1 | C2 B2 A2 | C3 B3 A3 |

*Each frame is 3 time slots. Each time slot duration is T/3 s.* A1 is drawn at the right end of Frame 1 because the stream travels to the right, so A's unit is the first slot sent, then B's, then C's.

The boxed rule under the figure: *The data rate of the output link must be n times the data rate of a connection to guarantee the flow of data.* The build slides say the same from the unit's side: *Each input unit becomes one output unit. However, the duration of an output time slot is n times shorter than the duration of an input time slot (n is the number of connections).*

## The two rate rules

Slide wording: *In synchronous TDM, the data rate of the link is n times faster, and the unit duration is n times shorter.* And: *The duration of a frame is the same as the duration of an input unit. The frame rate is always the same as any input rate.*

"Input rate" means the rate at which units arrive on one line. With 1-bit units the frame rate equals the input bit rate; with 2-bit units, units and frames both arrive at half the bit rate.

## Slide example: four 1 Mbps lines

Four inputs at 1 Mbps send one bit per unit; the rightmost bit of each line is sent first:

| Line | Bits (right is first) |
|---|---|
| 1 | … 1 1 1 1 1 |
| 2 | … 0 0 0 0 0 |
| 3 | … 1 0 1 0 1 |
| 4 | … 0 0 1 0 0 |

The MUX produces 4-bit frames, line 1's bit at the right of each: … 0101 | 0001 | 1101 | 0001 | 0101. The rightmost frame, 0101, is each line's first bit read from line 4 down to line 1: 0, 1, 0, 1. The third frame, 1101, is each line's third bit.

| | Input line | Output link |
|---|---|---|
| Bit rate | *1 Mbps* | *4 Mbps* |
| Bit duration | $1 / (1\ \text{Mbps}) = $ *1 μs* | $1 / (4\ \text{Mbps}) = $ *0.25 μs* |
| Frame rate | | *1 Mbps input rate → 1 000 000 frames/s* |

A unit is one bit here, so the frame rate equals the input bit rate.

## Interleaving the inputs into frames

```widget
tdm-frames
{ "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"], "framing": false, "presets": { "Four 1 Mbps lines (slide 35)": { "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"] }, "Lines A, B, C (slide 29)": { "n": 3, "rate": 0, "slot": 1, "streams": ["A1 A2 A3", "B1 B2 B3", "C1 C2 C3"] }, "Example 2 (four 100 kbps lines, 2-bit slots)": { "n": 4, "rate": 100, "unit": "kbps", "slot": 2, "streams": ["110100", "001011", "101010", "011100"] } } }
```

### Watch the multiplexer build each frame

One step is one frame. Watch the MUX take one unit from each line in turn, the frame cross the link, and the DEMUX hand each slot back to its line. A slot lasts $T / n$ and the whole frame lasts $T$. Tick the predict box to name each frame, or its timing, before it is built.

```widget
tdm-play
{ "preset": "Lines A, B, C (slide 29)", "presets": { "Lines A, B, C (slide 29)": { "n": 3, "rate": 0, "slot": 1, "streams": ["A1 A2 A3", "B1 B2 B3", "C1 C2 C3"] }, "Four 1 Mbps lines (slide 35)": { "n": 4, "rate": 1, "unit": "Mbps", "slot": 1, "streams": ["11111", "00000", "10101", "00100"] }, "Example 2 (four 100 kbps lines, 2-bit slots)": { "n": 4, "rate": 100, "unit": "kbps", "slot": 2, "streams": ["110100", "001011", "101010", "011100"] } } }
```

## Example 2: four 100 kbps channels, 2-bit slots

*A multiplexer combines four 100-kbps channels using a time slot of 2 bits. 1. What is the frame rate? 2. What is the frame duration? 3. What is the bit rate of the shared channel? 4. What is the bit duration?*

1. Frame rate = input unit rate. A unit is 2 bits, so each line delivers $100\,000 / 2 = 50\,000$ units per second, and the frame rate is **50 000 frames per second**.
2. Frame duration $= 1 / 50\,000 = $ **20 μs**, also the duration of one input unit.
3. Bit rate of the shared channel $= 4 \times 100 = $ **400 kbps**.
4. Bit duration on the link $= 1 / 400\,000 = $ **2.5 μs**.

The slide's check: *the frame duration is 8 times the bit duration because each frame is carrying 8 bits.* Four slots of 2 bits is 8 bits, and $8 \times 2.5 = 20$ μs.

:::quiz Frame rate is the unit rate, not the bit rate
Had the slot been 1 bit, the frame rate would be 100 000 frames/s. The link bit rate (400 kbps) does not depend on the slot size; the frame rate and frame duration do.
:::

```quiz
[
  {
    "q": "In TDM, what is shared among the input connections?",
    "options": ["Time on the link", "A portion of the link's bandwidth", "A wavelength of light", "A carrier frequency"],
    "answer": 0,
    "explain": "Instead of sharing a portion of the bandwidth as in FDM, time is shared: each connection occupies a portion of time in the link."
  },
  {
    "q": "Fill in the blank: a round of data units from each input connection is collected into a ________.",
    "type": "text",
    "answer": ["frame"],
    "explain": "A frame. With n connections the frame has n time slots, one per unit, and lasts as long as one input unit."
  },
  {
    "q": "The duration of an input unit is T and there are n connections. What is the duration of one slot on the link?",
    "options": ["$T$", "$nT$", "$T / n$", "$T / 2$"],
    "answer": 2,
    "explain": "The slot is T/n: n units must fit into the time one input takes to send one unit. The frame, n slots long, lasts T."
  },
  {
    "q": "In synchronous TDM the frame rate is n times the input rate.",
    "type": "tf",
    "answer": false,
    "explain": "The **link bit rate** is n times an input's rate. The frame rate is always the same as any input (unit) rate, because one frame carries one unit from every input."
  },
  {
    "q": "Three 64 kbps lines are multiplexed with 1-bit slots. What is the bit rate of the link, in kbps?",
    "type": "numeric",
    "answer": 192,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "The link must be n times a connection: $3 \\times 64 = 192$ kbps."
  },
  {
    "q": "Three 64 kbps lines, 1-bit slots. What is the frame rate, in frames per second?",
    "type": "numeric",
    "answer": 64000,
    "tolerance": 10,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate. A unit is 1 bit, so 64 000 units per second per line and 64 000 frames/s."
  },
  {
    "q": "Three 64 kbps lines, 1-bit slots. What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 15.625,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "$1 / 64\\,000 = 15.625$ μs, the same as the duration of one input bit. Check: 3 link bits of $1 / 192\\,000 = 5.208$ μs make 15.625 μs."
  },
  {
    "q": "Three 64 kbps lines, 1-bit slots. What is the bit duration on the link, in μs?",
    "type": "numeric",
    "answer": 5.208,
    "tolerance": 0.005,
    "unit": "μs",
    "explain": "$1 / 192\\,000 = 5.208$ μs, three times shorter than an input bit (15.625 μs)."
  },
  {
    "q": "Example 2 again but with 4-bit slots: four 100 kbps channels. What is the frame rate, in frames per second?",
    "type": "numeric",
    "answer": 25000,
    "tolerance": 5,
    "unit": "frames/s",
    "explain": "Units of 4 bits arrive at $100\\,000 / 4 = 25\\,000$ per second on each line, so 25 000 frames/s. The link stays at 400 kbps; only the frame rate changes with slot size."
  },
  {
    "q": "Four 100 kbps channels with 4-bit slots. What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.05,
    "unit": "μs",
    "explain": "$1 / 25\\,000 = 40$ μs. Check: the frame carries $4 \\times 4 = 16$ bits at 2.5 μs each, $16 \\times 2.5 = 40$ μs."
  },
  {
    "q": "In the four-line 1 Mbps example, what is the bit duration on the 4 Mbps output link?",
    "options": ["4 μs", "1 μs", "0.5 μs", "0.25 μs"],
    "answer": 3,
    "explain": "Bit duration = 1 / bit rate = 1 / (4 Mbps) = 0.25 μs, four times shorter than the 1 μs input bit."
  },
  {
    "q": "Can TDM be used for an analog signal?",
    "options": ["No, TDM is digital only and analog signals cannot be converted", "Yes, if it is first sampled and changed to digital data", "Yes, by modulating it onto a carrier first", "Yes, by giving it a guard band"],
    "answer": 1,
    "explain": "An analog signal can be sampled, changed to digital data, and then multiplexed by using TDM. Carriers and guard bands belong to FDM."
  }
]
```
