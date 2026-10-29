---
title: "Review 1c: bandwidth of a composite signal, and bits, rate and time"
minutes: 15
---
This lesson teaches how wide a signal's range of frequencies is, and how bits, speed and time fit together. It prepares the E02-style questions: find the two edge frequencies, find a bit rate, find how long a transfer takes.

## What bandwidth is, in plain words

A real data signal is not one sine wave.

One pure tone carries no information. On a phone line it would just be a buzz.

A real signal is many sine waves added together, each with its own frequency. The slides call it a **composite signal**.

Instead of drawing the signal against time, draw one spike per sine wave. The spike stands at that wave's frequency, and its height is that wave's peak.

That picture is the **frequency-domain plot**. The **bandwidth** is how wide it is: from the lowest spike to the highest.

```diagram
{ "type": "grid", "title": "E02 exercise 3: five sine waves on a frequency line", "nodes": [
  { "id": "h0", "label": "Wave", "row": 0, "col": 0 },
  { "id": "h1", "label": "1st", "row": 0, "col": 1 },
  { "id": "h2", "label": "2nd", "row": 0, "col": 2 },
  { "id": "h3", "label": "3rd", "row": 0, "col": 3 },
  { "id": "h4", "label": "4th", "row": 0, "col": 4 },
  { "id": "h5", "label": "5th", "row": 0, "col": 5 },
  { "id": "r0", "label": "Hz", "row": 1, "col": 0 },
  { "id": "r1", "label": "100", "row": 1, "col": 1 },
  { "id": "r2", "label": "400", "row": 1, "col": 2 },
  { "id": "r3", "label": "500", "row": 1, "col": 3 },
  { "id": "r4", "label": "750", "row": 1, "col": 4 },
  { "id": "r5", "label": "900", "row": 1, "col": 5 }
], "hi": ["r1", "r5"], "caption": "Only the two highlighted edges set the bandwidth: 900 − 100 = 800 Hz. The middle three never enter." }
```

## A tiny case you can do in your head

A signal is made of sine waves at 2 Hz, 5 Hz and 9 Hz. The lowest is 2 and the highest is 9.

$$9 - 2 = \mathbf{7\ Hz}$$

The 5 Hz wave sits inside the range, so it changes nothing.

## The formula, with each symbol named

$$B = f_h - f_l$$

- $B$ is the bandwidth, in Hz.
- $f_h$ is the highest frequency in the signal, and $f_l$ the lowest, both in Hz.

The trap is adding them, or giving the highest frequency alone. Bandwidth is always a difference.

## The middle-frequency trick

E02 sometimes gives the bandwidth and the **middle frequency**, the point halfway between the two edges. Halfway means the edges add up to twice the middle.

$$f_h + f_l = 2 \times \text{middle}$$

Together with $f_h - f_l = B$, that is two equations for two unknowns. Add them to get $2 f_h$.

## E02 exercises 1 to 3, worked

*A nonperiodic composite signal has a bandwidth of 200 kHz, with a middle frequency of 140 kHz and peak amplitude of 20 V. The two extreme frequencies have an amplitude of 0.*

```diagram
{ "type": "flow", "title": "E02 exercise 1: from bandwidth and middle to both edges", "nodes": [
  { "id": "b", "label": "f_h − f_l = 200 kHz", "sub": "the bandwidth" },
  { "id": "m", "label": "f_h + f_l = 280 kHz", "sub": "2 × the 140 kHz middle" },
  { "id": "h", "label": "2 f_h = 480 kHz", "sub": "add the two lines" },
  { "id": "a", "label": "f_h = 240, f_l = 40 kHz", "sub": "then subtract" }
], "edges": [ { "from": "b", "to": "h" }, { "from": "m", "to": "h" }, { "from": "h", "to": "a" } ], "hi": ["a"], "caption": "The triangle-shaped plot runs from 40 kHz (0 V) up to 20 V at 140 kHz and back to 0 V at 240 kHz." }
```

$$f_h = \frac{280 + 200}{2} = \mathbf{240\ kHz} \qquad f_l = 280 - 240 = \mathbf{40\ kHz}$$

Check: 240 − 40 = 200 kHz, the bandwidth the question gave.

*The highest frequency is 400 MHz. If the middle frequency is 300 MHz, find the lowest frequency and the bandwidth.*

$$f_l = 2 \times 300 - 400 = \mathbf{200\ MHz}$$

$$B = 400 - 200 = \mathbf{200\ MHz}$$

Check: 300 MHz sits exactly halfway between 200 and 400.

Exercise 3 is the five-wave diagram above: 900 − 100 gives **800 Hz**.

## What a bit rate is, in plain words

A digital signal sends bits, the 0s and 1s of the data. The **bit rate** is how many bits leave each second, counted in bits per second, bps.

Think of a tap. Litres per minute times minutes is the litres you collect.

Bits work the same way: rate times time is the amount. Turn it around and the amount divided by the rate is the time.

```diagram
{ "type": "flow", "title": "E02 exercise 4: multiply the units through", "nodes": [
  { "id": "p", "label": "200 pages/s", "sub": "the rate asked for" },
  { "id": "c", "label": "× 24 × 80", "sub": "characters per page" },
  { "id": "b", "label": "× 8", "sub": "bits per character" },
  { "id": "r", "label": "3 072 000 bps", "sub": "= 3.072 Mbps" }
], "edges": [ { "from": "p", "to": "c" }, { "from": "c", "to": "b" }, { "from": "b", "to": "r" } ], "hi": ["r"], "caption": "Pages per second times bits per page leaves bits per second: 200 × 1920 × 8 = 3 072 000 bps." }
```

## A tiny bits case

A device sends 10 bits each second for 3 seconds.

$$10\ \tfrac{\text{bits}}{\text{s}} \times 3\ \text{s} = \mathbf{30\ bits}$$

The seconds cancel, which is how you know the line is set up right.

## The formula, with each symbol named

$$\text{amount} = \text{rate} \times \text{time} \qquad \text{time} = \frac{\text{amount}}{\text{rate}}$$

- The amount is in bits. One character is 8 bits.
- The rate is in bits per second.
- The time is in seconds.

The trap is inverting the fraction. A rate of 1000 bps means each bit takes 1/1000 s.

## E02 exercises 4 and 5, worked

*We need to download text documents at the rate of 200 pages per second. A page has an average of 24 lines with 80 characters in each line and one character requires 8 bits.*

$$200\ \tfrac{\text{pages}}{\text{s}} \times 24 \times 80 \times 8\ \tfrac{\text{bits}}{\text{page}} = 3\,072\,000\ \text{bps} = \mathbf{3.072\ Mbps}$$

Check: the slide's own 100 pages per second gives 1.536 Mbps, and twice that is 3.072.

*A device is sending out data at the rate of 1000 bps. How long does it take to send out 10 bits?*

$$\text{time} = \frac{10\ \text{bits}}{1000\ \text{bps}} = \mathbf{0.01\ s}$$

*How long does it take to send a file of 100,000 characters? Assume each character is 8 bits.*

$$\text{time} = \frac{100\,000 \times 8\ \text{bits}}{1000\ \text{bps}} = \frac{800\,000}{1000} = \mathbf{800\ s}$$

Check: one bit lasts 1 ms, so ten bits take 10 ms.

## Try it

```quiz
[
  {
    "q": "A time-domain plot shows amplitude against time. The plot of peak amplitude against frequency, one spike per sine wave, is called the ___ plot. (Slide term.)",
    "type": "text",
    "answer": ["frequency-domain", "frequency domain", "frequency-domain plot", "frequency domain plot"],
    "explain": "Formula: none; this is the slide's term.\nSubstitution: amplitude against frequency.\nAnswer: frequency-domain plot.\nCheck: the word \"spectrum\" is not the slide's term and has cost marks."
  },
  {
    "q": "A composite signal has a bandwidth of 500 kHz and a middle frequency of 1 MHz. What is its lowest frequency, in kHz?",
    "type": "numeric",
    "answer": 750,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: f_h + f_l = 2 × middle and f_h − f_l = B.\nSubstitution: f_h + f_l = 2000 kHz, f_h − f_l = 500 kHz, so 2 f_l = 1500 kHz.\nAnswer: f_l = 750 kHz, with f_h = 1250 kHz.\nCheck: each edge sits half the bandwidth, 250 kHz, from the middle."
  },
  {
    "q": "The highest frequency in a signal is 60 kHz and the middle frequency is 45 kHz. What is the bandwidth, in kHz?",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: f_l = 2 × middle − f_h, then B = f_h − f_l.\nSubstitution: f_l = 90 − 60 = 30 kHz; B = 60 − 30 kHz.\nAnswer: 30 kHz.\nCheck: 45 kHz sits halfway between 30 and 60."
  },
  {
    "q": "Each 30 ms tick, a script samples the character's position as two 32-bit numbers, 64 bits per sample. What bit rate does that stream need, in bps? (Two decimals.)",
    "type": "numeric",
    "answer": 2133.33,
    "tolerance": 3,
    "unit": "bps",
    "explain": "Formula: bit rate = samples per second × bits per sample.\nSubstitution: (1 / 0.030 s) × 64 bits = 33.33 × 64.\nAnswer: 2133.33 bps, about 2.13 kbps.\nCheck: the units cancel to bits per second, and 64 ÷ 0.030 = 2133."
  },
  {
    "q": "The PC's link to the telemetry collector runs at 10 Mbps. How many bits can it carry in one 30 ms tick?",
    "type": "numeric",
    "answer": 300000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: bits = bit rate × time.\nSubstitution: 10 × 10⁶ bps × 30 × 10⁻³ s.\nAnswer: 300 000 bits, which is 37 500 bytes.\nCheck: one bit lasts 100 ns, and 30 ms ÷ 100 ns = 300 000."
  },
  {
    "q": "A 2 MB replay file (2 000 000 bytes) is uploaded at 4 Mbps. How long does the upload take, in s?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "s",
    "explain": "Formula: time = amount ÷ rate.\nSubstitution: 2 000 000 × 8 bits ÷ 4 000 000 bps = 16 000 000 ÷ 4 000 000.\nAnswer: 4 s.\nCheck: bytes became bits first; skipping the × 8 gives 0.5 s, too fast."
  }
]
```

## Remember

- Bandwidth is the highest frequency minus the lowest. Nothing in between matters.
- The middle frequency is halfway, so the two edges add up to twice the middle.
- Rate times time is the amount. Turn characters into bits with × 8 first.
- *On the sheet:* Sheet side 1, "Time and frequency domain, bandwidth" and "Digital signals".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "bandwidth", "composite", "middle frequency" | B = f_h − f_l; f_h + f_l = 2 × middle | Hz | only the two extremes matter |
| "how long to send", "bit rate needed" | time = bits ÷ bit rate; bit rate = units/s × bits per unit | s or bps | 8 bits per character |
