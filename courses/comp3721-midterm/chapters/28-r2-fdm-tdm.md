---
title: "Review 2d: FDM with guard bands, and the synchronous TDM chain"
minutes: 20
---
This lesson teaches the two ways many signals share one link: side by side in frequency, or taking turns in time. It prepares you for the link-bandwidth question of Example 1 and the "find 1 … 6" TDM chain of E06 exercise 2.

## What multiplexing is, in plain words

Multiplexing lets several signals travel over one link at the same time. A multiplexer, the MUX, combines them at one end, and a demultiplexer, the DEMUX, separates them at the other.

**FDM shares frequency.** Frequency-division multiplexing gives each signal its own band of frequencies, like lanes on a road. Each band is called a channel.

Lanes need a little empty space between them. Slide wording: *Guard bands: Strips of unused bandwidth that separate channels from each other.*

A gap sits only between two neighbours. So three lanes need two gaps, and five lanes need four.

```diagram
{ "type": "grid", "title": "Three FDM channels with guard bands", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "Ch 1", "row": 0, "col": 1 },
  { "id": "h2", "label": "Guard", "row": 0, "col": 2 },
  { "id": "h3", "label": "Ch 2", "row": 0, "col": 3 },
  { "id": "h4", "label": "Guard", "row": 0, "col": 4 },
  { "id": "h5", "label": "Ch 3", "row": 0, "col": 5 },
  { "id": "w0", "label": "kHz", "row": 1, "col": 0 },
  { "id": "w1", "label": "10", "row": 1, "col": 1 },
  { "id": "w2", "label": "2", "row": 1, "col": 2 },
  { "id": "w3", "label": "10", "row": 1, "col": 3 },
  { "id": "w4", "label": "2", "row": 1, "col": 4 },
  { "id": "w5", "label": "10", "row": 1, "col": 5 }
], "hi": ["w2", "w4"], "caption": "Three 10 kHz channels have two 2 kHz guard bands between them: 30 + 4 = 34 kHz of link." }
```

**TDM shares time.** Time-division multiplexing lets each input line send in turn. Each line's data is cut into units, and a unit can be 1 bit, one character or one block.

The MUX takes one unit from every line in turn. That round of units is a frame, and each unit's place in it is a time slot.

```diagram
{ "type": "grid", "title": "Lines A, B and C taking turns", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "f1", "label": "Frame 1", "row": 0, "col": 1 },
  { "id": "f2", "label": "Frame 2", "row": 0, "col": 2 },
  { "id": "f3", "label": "Frame 3", "row": 0, "col": 3 },
  { "id": "s1", "label": "Slot 1", "row": 1, "col": 0 },
  { "id": "a1", "label": "A1", "row": 1, "col": 1 },
  { "id": "a2", "label": "A2", "row": 1, "col": 2 },
  { "id": "a3", "label": "A3", "row": 1, "col": 3 },
  { "id": "s2", "label": "Slot 2", "row": 2, "col": 0 },
  { "id": "b1", "label": "B1", "row": 2, "col": 1 },
  { "id": "b2", "label": "B2", "row": 2, "col": 2 },
  { "id": "b3", "label": "B3", "row": 2, "col": 3 },
  { "id": "s3", "label": "Slot 3", "row": 3, "col": 0 },
  { "id": "c1", "label": "C1", "row": 3, "col": 1 },
  { "id": "c2", "label": "C2", "row": 3, "col": 2 },
  { "id": "c3", "label": "C3", "row": 3, "col": 3 }
], "hi": ["a1", "b1", "c1"], "caption": "Each frame holds one unit from each of the 3 lines, so a new frame starts every time each line produces a unit." }
```

One frame leaves for every unit that arrives on any one line. Slide wording: *The frame rate is always the same as any input rate.*

## A tiny case you can do in your head

**FDM.** Three channels of 10 kHz, with a 2 kHz guard band between neighbours:

$$ 3 \times 10 + 2 \times 2 = 30 + 4 = \mathbf{34 \text{ kHz}} $$

**TDM.** Three lines each send 10 bits per second, one bit per unit. Each line makes 10 units a second, so 10 frames leave a second:

$$ \text{frame rate} = \mathbf{10 \text{ frames/s}} $$

Each frame lasts a tenth of a second and holds 3 bits, one per line:

$$ 10 \times 3 = \mathbf{30 \text{ bps on the link}} $$

That makes sense: the link must carry everything the three lines send.

## The formulas, with each symbol named

**FDM link bandwidth.**

$$ B_{link} = n \times B_{ch} + (n - 1) \times G $$

- $n$ is the number of channels.
- $B_{ch}$ is the bandwidth of one channel, and $G$ is one guard band, both in Hz.

The trap is the count: $n - 1$ guard bands, not $n$.

Each channel starts one channel plus one guard band after the one before. So channel $k$ starts $(k - 1) \times (B_{ch} + G)$ above the first channel's start.

**The synchronous TDM chain.** Walk it in this order every time.

```diagram
{ "type": "flow", "title": "The synchronous TDM chain", "nodes": [
  { "id": "u", "label": "Unit size", "sub": "bits per unit" },
  { "id": "ur", "label": "Input unit rate", "sub": "input rate ÷ unit" },
  { "id": "fr", "label": "Frame rate", "sub": "= input unit rate" },
  { "id": "fd", "label": "Frame duration", "sub": "1 ÷ frame rate" },
  { "id": "bf", "label": "Bits per frame", "sub": "n × unit (+ framing)" },
  { "id": "lr", "label": "Link bit rate", "sub": "frame rate × bits/frame" },
  { "id": "bd", "label": "Bit duration", "sub": "1 ÷ link rate" }
], "edges": [ { "from": "u", "to": "ur" }, { "from": "ur", "to": "fr" }, { "from": "fr", "to": "fd" }, { "from": "fd", "to": "bf" }, { "from": "bf", "to": "lr" }, { "from": "lr", "to": "bd" } ], "hi": ["fr", "lr"], "caption": "Frame rate × bits per frame always gives the link rate. The shortcuts slot = T/n and link = n × input rate hold only with no framing bit." }
```

- Input unit rate is the input bit rate divided by the bits per unit, in units/s.
- Frame rate equals the input unit rate, in frames/s.
- Bits per frame is $n$ units plus any framing bits. A framing bit is a synchronizing bit added to each frame so the DEMUX can find where frames start.
- Link bit rate is frame rate × bits per frame, in bps.

The trap is the framing bit. It travels in every frame, so it adds to the link rate.

## The slide's examples, worked

**FDM, slide example.** Three 4 kHz voice channels go into a link from 20 to 32 kHz with no guard bands. Three times 4 kHz is 12 kHz, so the bands are 20–24, 24–28 and 28–32 kHz.

**Example 1.** *Five channels, each with a 100-kHz bandwidth, are to be multiplexed together. What is the minimum bandwidth of the link if there is a need for a guard band of 10 kHz between the channels?*

$$ B_{link} = 5 \times 100 \text{ kHz} + 4 \times 10 \text{ kHz} = 500 + 40 = \mathbf{540 \text{ kHz}} $$

Check: five channels have four gaps.

```widget
fdm-plan
{ "n": 5, "bandwidth": 100, "unit": "kHz", "guard": 10, "start": 0 }
```

**Example 2.** *A multiplexer combines four 100-kbps channels using a time slot of 2 bits.*

$$ \text{frame rate} = \frac{100\,000 \text{ bps}}{2 \text{ bits}} = \mathbf{50\,000 \text{ frames/s}} $$

$$ \text{frame duration} = \frac{1}{50\,000} \text{ s} = \mathbf{20\ \mu s} $$

$$ \text{link rate} = 50\,000 \times (4 \times 2) = \mathbf{400\,000 \text{ bps}} = 400 \text{ kbps} $$

$$ \text{bit duration} = \frac{1}{400\,000} \text{ s} = \mathbf{2.5\ \mu s} $$

Check, from the slide: *the frame duration is 8 times the bit duration because each frame is carrying 8 bits*. Indeed 8 × 2.5 μs = 20 μs.

**E06 exercise 1.** Four 1 Mbps lines with 1-bit units. An input bit lasts 1 μs, and the link runs at 4 × 1 Mbps = 4 Mbps.

An output bit lasts 0.25 μs. The frame rate is the input rate, 1 000 000 frames/s.

**E06 exercise 2, the framing bit.** *Four sources, each creating 250 characters per second. If the input unit is a character and 1 synchronizing bit is added to each frame … each character is 8 bits long.*

| Asked | Formula | Substituted | Answer |
|---|---|---|---|
| data rate of each source | characters/s × bits | 250 × 8 | **2000 bps** |
| duration of each character | 1 ÷ unit rate | 1/250 s | **4 ms** |
| frame rate | = input unit rate | 250 characters/s | **250 frames/s** |
| frame duration | 1 ÷ frame rate | 1/250 s | **4 ms** |
| bits per frame | n × unit + framing | 4 × 8 + 1 | **33 bits** |
| link rate | frame rate × bits per frame | 250 × 33 | **8250 bps** |

The trap: 4 × 2000 = 8000 bps forgets the 250 framing bits each second. A link bit then lasts 1/8250 s = 121.2 μs, so a character slot is 969.7 μs, not T/n = 1 ms.

**E06 exercise 3.** Lines of 100 kbps and 200 kbps use *multiple-slot allocation*: one slot to the first line and two to the second. With 1-bit slots that is 100 000 frames/s, 10 μs per frame, and a 3 × 100 = 300 kbps link.

```widget
tdm-frames
{ "n": 4, "rate": 2, "unit": "kbps", "slot": 8, "framing": true, "title": "E06 exercise 2: four 2 kbps sources, 8-bit characters, one framing bit per frame" }
```

## Try it

The scripting variants are ours. Work each on paper in the four lines first.

```quiz
[
  {
    "q": "1. Picture eight of Windia's channels each given a 25 kHz band on one link by FDM, with a 5 kHz guard band between neighbours. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 235,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: B_link = n × B_ch + (n − 1) × G.\nSubstitution: 8 × 25 kHz + 7 × 5 kHz = 200 + 35.\nAnswer: **235 kHz**.\nCheck: eight channels have seven gaps. Example 1 had five channels, four gaps, 540 kHz."
  },
  {
    "q": "2. The same eight channels start at 0 kHz, in order, each followed by its guard band. At what frequency does channel 3 begin, in kHz?",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: channel k begins at (k − 1) × (B_ch + G) above the start.\nSubstitution: (3 − 1) × (25 kHz + 5 kHz) = 2 × 30.\nAnswer: **60 kHz**.\nCheck: channel 1 is 0–25, guard 25–30, channel 2 is 30–55, guard 55–60."
  },
  {
    "q": "3. One character of each of the four classes runs a script that sends 125 status characters per second, 8 bits each, to the collector. A synchronous TDM link carries the four streams, with a character as the unit and 1 framing bit per frame. What is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 125,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Formula: frame rate = input unit rate.\nSubstitution: the unit is one character, and each source sends 125 characters/s.\nAnswer: **125 frames/s**.\nCheck: a frame then lasts 1/125 s = 8 ms, the duration of one character on one source."
  },
  {
    "q": "4. For the link of item 3, what is the link rate, in bps?",
    "type": "numeric",
    "answer": 4125,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Formula: link rate = frame rate × bits per frame, with bits per frame = n × unit + framing.\nSubstitution: bits per frame = 4 × 8 + 1 = 33, link = 125 frames/s × 33 bits.\nAnswer: **4125 bps**.\nCheck: 4 × 1000 bps = 4000 bps of data plus 125 framing bits per second. E06 exercise 2 has the same shape: 250 × 33 = 8250 bps."
  },
  {
    "q": "5. A synchronous TDM multiplexer combines six 48 kbps lines using a time slot of 3 bits, with no framing bit. What is the frame duration, in μs?",
    "type": "numeric",
    "answer": 62.5,
    "tolerance": 0.05,
    "unit": "μs",
    "explain": "Formula: frame rate = input rate ÷ unit size, frame duration = 1 ÷ frame rate.\nSubstitution: 48 000 bps / 3 bits = 16 000 frames/s, so 1/16 000 s.\nAnswer: **62.5 μs**.\nCheck: the link is 16 000 × 18 bits = 288 kbps = 6 × 48 kbps, as it must be with no framing bit."
  },
  {
    "q": "6. With one framing bit per frame, the link rate is still exactly n × the input bit rate.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: link rate = frame rate × (n × unit + framing).\nSubstitution: E06 exercise 2 gives 250 × (4 × 8 + 1) = 8250 bps, but 4 × 2000 = 8000 bps.\nAnswer: **false**.\nCheck: the 250 framing bits each second make up the difference, 8250 − 8000 = 250."
  }
]
```

## Remember

- FDM: $n$ channels need $n - 1$ guard bands.
- TDM: frame rate equals the input unit rate. Walk the chain in order: unit rate, frame rate, frame duration, bits per frame, link rate.
- The framing bit is in every frame, so link rate = frame rate × bits per frame, never just $n$ × input rate.
- *On the sheet:* Sheet side 3, "Multiplexing, FDM and WDM (06a)" and "Synchronous TDM and E06".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "channels", "guard band" | B = n × B_ch + (n − 1) × G | Hz | n − 1 guards |
| "frame", "slots", "framing bit" | the TDM chain | frames/s, s, bps | frame duration × frame rate = 1 |
