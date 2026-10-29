---
title: "Review 2: the Weeks 4 to 6 calculations: signal rate, bits per level, PCM, constellations, FDM and TDM (items 5, 6, 7, 9, 10)"
minutes: 60
---
:::quiz What the paper asks and what earns the marks
Items 5, 6, 7, 9 and 10 hold the Weeks 4 to 6 arithmetic: a signal rate, bits per level, a PCM chain, a constellation or modulation bandwidth, an FDM link, and a synchronous TDM chain. Expect "find 1 … 2 … 3 …" questions like E04 to E06. The marker wants four lines per answer: formula, substitution with units, answer with unit, check.
:::

**Write this on the paper** for every calculation:

1. The formula in symbols: "Frame rate = input unit rate".
2. The substitution with units: "= 100 000 bps / 2 bits".
3. The answer with its unit, boxed: "**50 000 frames/s**".
4. A one-line check: "frame duration × frame rate = 1".

**Understand before the exam (cannot be looked up):**

- Which formula a question wants, from its cue words (the table below).
- Bits per level is log₂ L, rounded **up** when L is not a power of 2; levels from bits is 2^bits.
- The case factor c: c = 1 unless the question says "average" (c = ½). PCM's B_min = n_b × B_analog already has c = ½ and r = 1 inside it.
- The TDM chain runs in one order, and the framing bit enters the bits per frame, so it enters the link rate.
- "Slot = T/n" and "link rate = n × input rate" hold only with **no** framing bit.

**On the sheet (look up, do not memorise):**

- *Sheet side 2, "Line coding: elements and rates (04)"*: S, c, B and the E04-2 levels.
- *Sheet side 3, "PCM and sampling (05a)"* and *"Quantization, encoding and PCM bandwidth"*: the PCM formulas, E05-1 and E05-2.
- *Sheet side 3, "D2A and A2A side by side"* and *"Constellation diagram"*: the bandwidth boxes, log₂ n, E05-4.
- *Sheet side 3, "Multiplexing, FDM and WDM (06a)"* and *"Synchronous TDM and E06"*: the FDM sum and every TDM line.
- *Sheet side 4, "Which formula? The three that start with 2"* and *"Powers, logs, dB and units"*: powers of 2 and the units of each answer.

Do if time is short: "Which formula?", "Bits per level", "PCM", "Synchronous TDM", then the new variants. The rest are marked "if time".

## Which formula? Read the cue words first

Each question names its quantity with a fixed word; find the word first.

| The question says | Formula | Unit of the answer | Check |
|---|---|---|---|
| "levels", "bits per level", "signal element corresponds to a level" | bits = ⌈log₂ L⌉, L = 2^bits | bits, levels | 2^bits ≥ L |
| "constellation points", "per signal element" | r = log₂ n | bits | 2^r = n |
| "signal rate", "baud", "data elements per signal element" | S = c × N × 1/r (c = 1 unless "average") | baud | S ≤ N when r ≥ 1 |
| "bandwidth of a digital signal" | B = c × N × 1/r | Hz | same number as S |
| "sampling", "Nyquist theorem", "low-pass" | f_s = 2 × f_max | samples/s | bandpass: cannot be found |
| "bits per sample", "quantization levels" | n_b = log₂ L | bits | 2^n_b = L |
| "PCM bit rate", "digitize" | bit rate = f_s × n_b | bps | ÷ n_b gives f_s back |
| "minimum bandwidth" after PCM | B_min = n_b × B_analog | Hz | n_b times the analog |
| "SNR" with PCM | SNR_dB = 6.02 n_b + 1.76 | dB | each bit adds about 6 dB |
| "ASK", "PSK", "QAM" bandwidth | B = (1 + d) × S | Hz | B ≥ S |
| "FSK" bandwidth | B = (1 + d) × S + 2Δf | Hz | wider than ASK |
| "channels", "guard band" | B = n × B_ch + (n − 1) × G | Hz | n − 1 guards |
| "frame", "slots", "framing bit" | the TDM chain below | frames/s, s, bps | frame duration × frame rate = 1 |

```diagram
{ "type": "tree", "title": "Which formula? Start from what the question gives", "nodes": [
  { "id": "q", "label": "What is given?" },
  { "id": "a", "label": "L or n points", "sub": "log₂ L, log₂ n", "parent": "q" },
  { "id": "b", "label": "N and r", "sub": "S = cN/r", "parent": "q" },
  { "id": "c", "label": "f_max, n_b", "sub": "2f_max, f_s·n_b", "parent": "q" },
  { "id": "d", "label": "S and d", "sub": "(1+d)S; FSK +2Δf", "parent": "q" },
  { "id": "e", "label": "guard bands", "sub": "nB + (n−1)G", "parent": "q" },
  { "id": "f", "label": "frame, slots", "sub": "TDM chain", "parent": "q" }
], "hi": ["f"], "caption": "Six branches cover items 5, 6, 7, 9 and 10. The highlighted branch is the one the review list stresses: synchronous TDM." }
```

## Bits per level and the signal rate (items 5 and 10)

A signal with 4 levels has 4 different signal elements. Two bits give 4 patterns (00, 01, 10, 11), so each level carries 2 bits:

$$ r = \log_2 L = \log_2 4 = \mathbf{2 \text{ bits}} $$

With 5 levels, log₂ 5 = 2.32: two bits name only 4 levels, so the fifth needs a third bit. The bits per level is the ceiling, ⌈log₂ L⌉ = **3 bits**. On a calculator, log₂ x = log x / log 2.

The other way round, bits give levels: 10 bits give 2¹⁰ = 1024 levels.

The data rate N counts bits per second (bps). The signal rate S counts signal elements per second (baud). The ratio r is the number of data elements carried by each signal element. Slide wording: *S = c × N × 1/r*, where *c = case factor*.

This lesson writes S = N/r for the slide's formula with c = 1 (the worst case, the maximum signal rate). Use c = ½ only when the question says "average", or gives c.

**Slide example.** One data element per signal element (r = 1), N = 100 kbps, c = ½:

$$ S = c \times N \times \frac{1}{r} = \frac{1}{2} \times 100\,000 \text{ bps} \times \frac{1}{1} = \mathbf{50\,000 \text{ baud}} = 50 \text{ kbaud} $$

Check: half as many signal elements as bits, which is what c = ½ means.

**E04 exercise 2.** "An analog signal has a bit rate of 8000 bps and a baud rate of 1000 baud. How many data elements are carried by each signal element? How many signal elements do we need? Assume c = 1 and each signal element corresponds to a signal level."

$$ r = \frac{N}{S} = \frac{8000 \text{ bps}}{1000 \text{ baud}} = \mathbf{8 \text{ bits per baud}} $$

$$ L = 2^r = 2^8 = \mathbf{256 \text{ levels}} $$

Check: log₂ 256 = 8.

**Bandwidth of a digital signal.** Slide wording: *The baud rate, not the bit rate, determines the required bandwidth for a digital signal.* The slide replaces S with B in the same formula: B = c × N × 1/r. At 1 Mbps, r = 1, c = ½:

$$ B = \frac{1}{2} \times 1\,000\,000 \times \frac{1}{1} = \mathbf{500\,000 \text{ Hz}} = 500 \text{ kHz} $$

```widget
signal-rate
{ "show": "signal", "N": 100, "unit": "kbps", "r": "1", "c": "1/2", "title": "The slide example: 100 kbps, r = 1, c = 1/2; try r = 2 and c = 1" }
```

## PCM: sample, quantize, encode (item 6)

```diagram
{ "type": "flow", "title": "The PCM chain, one formula per box", "nodes": [
  { "id": "s", "label": "Sampling", "sub": "f_s = 2 × f_max" },
  { "id": "q", "label": "Quantizing", "sub": "Δ = (V_max − V_min)/L" },
  { "id": "e", "label": "Encoding", "sub": "n_b = log₂ L" },
  { "id": "r", "label": "Bit rate", "sub": "f_s × n_b" },
  { "id": "b", "label": "B_min", "sub": "n_b × B_analog" }
], "edges": [ { "from": "s", "to": "q" }, { "from": "q", "to": "e" }, { "from": "e", "to": "r" }, { "from": "r", "to": "b" } ], "hi": ["s", "r"], "caption": "Slide wording: a PCM encoder has three processes, sampling, quantizing and encoding. The bit rate and the minimum bandwidth follow from them." }
```

**Sampling.** The slide's box: *According to the Nyquist theorem, to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal.* The sampling rate is f_s = 1/T_s, where T_s is the sample interval.

For a **low-pass** signal the bandwidth equals the highest frequency. Slide example, a low-pass signal with a bandwidth of 100 kHz:

$$ f_s = 2 \times f_{max} = 2 \times 100\,000 \text{ Hz} = \mathbf{200\,000 \text{ samples/s}} $$

For a **bandpass** signal with the same 100 kHz bandwidth the slide's answer is a sentence: *We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.*

**Bits per sample and bit rate.** Slide wording: *n_b = log₂ L* and *Bit rate = Sampling rate × Number of bits per sample = f_s × n_b*.

E05 exercise 1, the human voice from 0 to 4 kHz at 8 bits per sample:

$$ f_s = 2 \times 4000 \text{ Hz} = 8000 \text{ samples/s} $$

$$ \text{bit rate} = 8000 \text{ samples/s} \times 8 \text{ bits} = \mathbf{64\,000 \text{ bps}} = 64 \text{ kbps} $$

Check: 64 000 ÷ 8 = 8000, the sampling rate back.

**Minimum bandwidth.** The slide's line: B_min = c × n_b × 2 × B_analog × 1/r. With c = ½ (average) and r = 1 it becomes B_min = n_b × B_analog: *This is the price we pay for digitization.*

E05 exercise 2, 64 levels and an analog bandwidth of 300 MHz, r = 1:

$$ n_b = \log_2 64 = \mathbf{6 \text{ bits}} $$

$$ B_{min} = n_b \times B_{analog} = 6 \times 300 \text{ MHz} = \mathbf{1800 \text{ MHz}} = 1.8 \text{ GHz} $$

**Quantization error and SNR (if time).** Zones of height Δ = (V_max − V_min)/L; the error is at most half a zone, *−Δ/2 ≤ quantization error ≤ Δ/2*. The slide's signal from −20 V to +20 V with L = 8 has Δ = 40/8 = 5 V, so the error is at most 2.5 V. The slide's box: *SNR_dB = 6.02 n_b + 1.76 dB*. Audio uses L = 256, so n_b = 8:

$$ \text{SNR}_{dB} = 6.02 \times 8 + 1.76 = 48.16 + 1.76 = \mathbf{49.92 \text{ dB}} $$

More levels mean more bits per sample, so the bit rate goes up and so does the SNR (E05 exercise 3 asks this in words).

```widget
pcm-calc
{ "presets": { "E05 1: voice 0 to 4 kHz, 8 bits": { "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" }, "E05 2: L = 64, 300 MHz": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1" } } }
```

## Digital-to-analog: points, baud and bandwidth (item 7, if time)

A constellation diagram draws one dot per signal element. Slide wording: *A modulation with n constellation points transmits log₂ n bits per signal element.* So r = log₂ n, and the baud rate is S = N/r: *baud rate ≤ bit rate*.

**Slide example, 8-QAM.** The figure prints "Bit rate: 24, Baud rate: 8". Eight points carry 3 bits each:

$$ S = \frac{N}{r} = \frac{24 \text{ bps}}{\log_2 8} = \frac{24}{3} = \mathbf{8 \text{ baud}} $$

**E05 exercise 4.** 16 points give log₂ 16 = **4 bits** per point. A point's distance from the origin is its amplitude, and amplitude² = I² + Q². With amplitude 5 V and in-phase 3 V:

$$ Q = \sqrt{5^2 - 3^2} = \sqrt{25 - 9} = \mathbf{4 \text{ V}} $$

**Bandwidth.** The slides' boxes: ASK and PSK have *r = 1, S = N, B = (1 + d)S*; FSK adds the gap between its two carrier frequencies, *B = (1 + d)S + 2Δf*. QAM has *the same minimum required bandwidth as ASK and PSK*, so it uses B = (1 + d)S with S = N/r. The slides never define d; the question will give it. (The textbook is remembered as calling d a factor between 0 and 1 that depends on the modulation and filtering; that is unverified and not on the slides.)

A tiny case of our own, at the slide figure's 5 bps with d = 1 and 2Δf = 10 Hz:

$$ B_{ASK} = (1 + 1) \times 5 = \mathbf{10 \text{ Hz}} \qquad B_{FSK} = (1 + 1) \times 5 + 10 = \mathbf{20 \text{ Hz}} $$

Check: FSK is wider than ASK by exactly 2Δf, which is why the slide says BPSK has the *same bandwidth as BASK but less than BFSK*.

```widget
constellation
{ "solve": { "amplitude": 5, "i": 3, "points": 16 }, "title": "E05 exercise 4: 16 points, amplitude 5 V, I = 3 V" }
```

## FDM: channels plus guard bands (item 9, if time)

Put n channels side by side in frequency. Between two neighbours sits one guard band, so n channels need n − 1 guard bands:

$$ B_{link} = n \times B_{ch} + (n - 1) \times G $$

**Slide example.** Three 4 kHz voice channels into 20 to 32 kHz with no guard bands: 3 × 4 = 12 kHz, the bands 20–24, 24–28 and 28–32 kHz.

**Example 1 (06a examples).** Five channels of 100 kHz with a 10 kHz guard band between them:

$$ B_{link} = 5 \times 100 \text{ kHz} + 4 \times 10 \text{ kHz} = 500 + 40 = \mathbf{540 \text{ kHz}} $$

Check: count the gaps, not the channels; five channels have four gaps.

```widget
fdm-plan
{ "n": 5, "bandwidth": 100, "unit": "kHz", "guard": 10, "start": 0 }
```

## Synchronous TDM: one chain, in order (item 9)

Picture four input lines. The multiplexer takes one unit from each line in turn and packs them into a frame of four slots. One frame leaves for every unit that arrives on any one line, so the frame rate equals the input unit rate. Slide wording: *The frame rate is always the same as any input rate.*

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

**Example 2 (06a examples).** "A multiplexer combines four 100-kbps channels using a time slot of 2 bits." Walk the chain:

$$ \text{frame rate} = \frac{100\,000 \text{ bps}}{2 \text{ bits}} = \mathbf{50\,000 \text{ frames/s}} $$

$$ \text{frame duration} = \frac{1}{50\,000} \text{ s} = \mathbf{20\ \mu s} $$

$$ \text{link rate} = 50\,000 \times (4 \times 2) = \mathbf{400\,000 \text{ bps}} = 400 \text{ kbps} $$

$$ \text{bit duration} = \frac{1}{400\,000} \text{ s} = \mathbf{2.5\ \mu s} $$

Check, from the slide: *the frame duration is 8 times the bit duration because each frame is carrying 8 bits*: 8 × 2.5 μs = 20 μs.

**E06 exercise 1** is the slide-35 figure: four 1 Mbps lines, 1-bit units. Input bit 1 μs; link 4 × 1 Mbps = 4 Mbps; output bit 0.25 μs; frame rate = input rate = 1 000 000 frames/s.

**E06 exercise 2, the framing bit.** "Four sources, each creating 250 characters per second. If the input unit is a character and 1 synchronizing bit is added to each frame … each character is 8 bits long."

| Asked | Formula | Substituted | Answer |
|---|---|---|---|
| data rate of each source | characters/s × bits | 250 × 8 | **2000 bps** |
| duration of each character | 1 ÷ unit rate | 1/250 s | **4 ms** |
| frame rate | = input unit rate | 250 characters/s | **250 frames/s** |
| frame duration | 1 ÷ frame rate | 1/250 s | **4 ms** |
| bits per frame | n × unit + framing | 4 × 8 + 1 | **33 bits** |
| link rate | frame rate × bits per frame | 250 × 33 | **8250 bps** |

The trap: 4 × 2000 = 8000 bps forgets the 250 framing bits each second. The framing bit also breaks the slot shortcut: a link bit lasts 1/8250 s = 121.2 μs, so a character slot is 8 × 121.2 = 969.7 μs, not T/n = 1 ms.

**E06 exercise 3 (if time).** 100 kbps and 200 kbps lines: *multiple-slot allocation*, one slot to the first line and two to the second. With 1-bit slots, frame rate 100 000 frames/s, frame duration 10 μs, link 3 × 100 kbps = 300 kbps.

```widget
tdm-frames
{ "n": 4, "rate": 2, "unit": "kbps", "slot": 8, "framing": true, "title": "E06 exercise 2: four 2 kbps sources, 8-bit characters, one framing bit per frame" }
```

## New variants in the Classic quester's world

The Classic quester runs its engine on a tick and reads the character's position each tick; it posts telemetry to a local collector and sends a death notice over the internet. The numbers below are ours. Work each on paper in the four lines first.

```quiz
[
  {
    "q": "1. The engine samples the character's x position once per tick, every 30 ms. What is the sampling rate, in samples per second? (Two decimals.)",
    "type": "numeric",
    "answer": 33.33,
    "tolerance": 0.05,
    "unit": "samples/s",
    "explain": "Formula: f_s = 1/T_s. Substitution: f_s = 1/(30 ms) = 1/0.030 s. Answer: **33.33 samples/s**. Check: 33.33 × 0.030 s = 1. By the Nyquist theorem, this rate reproduces movement only up to f_max = f_s/2 = 16.67 Hz."
  },
  {
    "q": "2. The x coordinate on the Magic Library map takes 1500 different values, so the engine quantizes it with L = 1500 levels. How many bits per sample does that need?",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: n_b = ⌈log₂ L⌉ (round up when L is not a power of 2). Substitution: log₂ 1500 = log 1500 / log 2 = 10.55. Answer: **11 bits**. Check: 2¹⁰ = 1024 is too few levels, 2¹¹ = 2048 is enough."
  },
  {
    "q": "3. At the sampling rate of item 1 and the bits per sample of item 2, what is the bit rate of the position stream, in bps?",
    "type": "numeric",
    "answer": 366.67,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "Formula: bit rate = f_s × n_b. Substitution: 33.33 samples/s × 11 bits. Answer: **366.67 bps** (366.3 from the rounded 33.3 is accepted). Check: 366.67 ÷ 11 = 33.33, the sampling rate back."
  },
  {
    "q": "4. What SNR in dB does the quantization of item 2 allow? (Two decimals.)",
    "type": "numeric",
    "answer": 67.98,
    "tolerance": 0.02,
    "unit": "dB",
    "explain": "Formula: SNR_dB = 6.02 n_b + 1.76. Substitution: 6.02 × 11 + 1.76 = 66.22 + 1.76. Answer: **67.98 dB**. Check: about 6 dB per bit, and 8 bits gave 49.92 dB, so 3 more bits add about 18 dB."
  },
  {
    "q": "5. Treat the position as a low-pass signal whose bandwidth is the Nyquist limit of item 1 (f_s/2 = 16.67 Hz). With c = 1/2 and r = 1, what is the minimum bandwidth of the digitized stream, in Hz?",
    "type": "numeric",
    "answer": 183.33,
    "tolerance": 0.5,
    "unit": "Hz",
    "explain": "Formula: B_min = n_b × B_analog (the slide's c × n_b × 2 × B_analog × 1/r with c = 1/2, r = 1). Substitution: 11 × 16.67 Hz. Answer: **183.33 Hz**. Check: the same as c × N × 1/r = 1/2 × 366.67 = 183.33 Hz, and 11 times the analog bandwidth."
  },
  {
    "q": "6. The death notice leaves the house on a line carrying 48 kbps at a signal rate of 8000 baud. Assume c = 1 and each signal element corresponds to a signal level. How many signal levels does the line use?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Formula: S = c × N × 1/r gives r = N/S, then L = 2^r. Substitution: r = 48 000 bps / 8000 baud = 6 bits per baud, L = 2⁶. Answer: **64 levels**. Check: log₂ 64 = 6 (E04 exercise 2 has the same shape: 8000/1000 = 8, 256 levels)."
  },
  {
    "q": "7. On the Wi-Fi hop the notice is sent by 256-QAM at 48 Mbps. What is the baud rate, in Mbaud?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "Formula: r = log₂ n, S = N/r. Substitution: r = log₂ 256 = 8 bits per signal element, S = 48 Mbps / 8. Answer: **6 Mbaud**. Check: the baud rate is at most the bit rate, and 6 × 8 = 48."
  },
  {
    "q": "8. With d = 0.5, what bandwidth does the 256-QAM signal of item 7 need, in MHz?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "Formula: QAM has the same minimum bandwidth as ASK and PSK, B = (1 + d) × S. Substitution: (1 + 0.5) × 6 Mbaud. Answer: **9 MHz**. Check: the bandwidth comes from the baud rate, not the 48 Mbps bit rate; 1.5 × 6 = 9, and using 48 in place of 6 would give 72 MHz, the bit-rate trap."
  },
  {
    "q": "9. Picture eight of Windia's channels each given a 25 kHz band on one link by FDM, with a 5 kHz guard band between neighbours. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 235,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: B_link = n × B_ch + (n − 1) × G. Substitution: 8 × 25 kHz + 7 × 5 kHz = 200 + 35. Answer: **235 kHz**. Check: eight channels have seven gaps (Example 1: five channels, four gaps, 540 kHz)."
  },
  {
    "q": "10. One character of each of the four classes runs a script that sends 125 status characters per second (8 bits each) to the collector. A synchronous TDM link carries the four streams, with a character as the unit and 1 framing bit per frame. What is the link rate, in bps?",
    "type": "numeric",
    "answer": 4125,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Formula: link rate = frame rate × bits per frame, with frame rate = input unit rate. Substitution: frame rate = 125 frames/s; bits per frame = 4 × 8 + 1 = 33; 125 × 33. Answer: **4125 bps**. Check: 4 × 1000 bps = 4000 bps of data plus 125 framing bits per second; the frame lasts 1/125 s = 8 ms (E06 exercise 2's shape: 250 × 33 = 8250 bps)."
  }
]
```
