---
title: "Start here: how to use this chapter, the four-line answer, and the exam map"
minutes: 15
---
This lesson tells you what the midterm looks like, how to move through this chapter, and how to write a calculation for full marks. It ends with the table that picks the formula from the question's words, and a map of the four sheet sides.

:::tip The 50% track: lookup and plug, about two and a half hours
With four printed sides in the exam, most marks come from finding the right line on the sheet fast and copying its shape. Do these lessons, in this order, and skip the rest unless time is left.

1. This lesson: the exam map and the cue table (10 minutes).
2. Review 1d decibels and SNR, then 1e Nyquist and Shannon (30 minutes). Three formulas on sheet side 2; the picker is on side 4.
3. Review 2b PCM, then 2d the TDM chain (30 minutes). Each is a chain of multiplications in a fixed order, written out on side 3.
4. Review 3b CRC (25 minutes). One division by hand beside the sheet's worked example.
5. Review 4a the three-move answer (20 minutes). Name the thing in the slide's words from the sheet, give the reason, give an example.
6. Review 5, the four banks, with the printed sheets open (40 minutes). Practise finding, not recalling, and pencil-mark every miss on the sheet.

In the exam: true-or-false and fill-in first and fast, then written responses, then calculations. Never leave a calculation blank: the formula from the sheet and the substituted line earn part marks even with the wrong arithmetic.
:::

## The exam, in plain words

The midterm is Thursday Oct 29 at 11:00. It is one paper of 120 minutes on Lecture Notes 01 to 07 and textbook chapters 1 to 3.

It asks in four shapes: true or false, fill in the blank, written response and calculation. The sample quiz sheet shows the first three, and every lab quiz has carried calculations.

A calculator is allowed, and one with a log key does every decibel step. Two double-sided sheets are allowed, handwritten or printed, which makes four sides in all.

The midterm is worth 30% of the course, and a missed exam scores zero. The midterm and the final must average at least 50% to pass the course.

No mark split is posted. The plan below gives each part about one minute per mark, as the mock midterm does.

```diagram
{ "type": "flow", "title": "A plan for the 120 minutes", "nodes": [
  { "id": "a", "label": "True or false", "sub": "10 min" },
  { "id": "b", "label": "Fill in the blank", "sub": "12 min" },
  { "id": "c", "label": "Written response", "sub": "30 min" },
  { "id": "d", "label": "Calculations", "sub": "58 min" },
  { "id": "k", "label": "Check", "sub": "10 min" }
], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" }, { "from": "d", "to": "k" } ], "hi": ["d"], "caption": "10 + 12 + 30 + 58 + 10 = 120 minutes. The calculations get the most time, and the last 10 minutes check units, prefixes, signs and the factor of 2." }
```

## How to read this chapter

Each lesson teaches one idea. It starts in plain words, then works a tiny case, then gives the formula, then works the slide's own example.

Every lesson ends with a short quiz in the exam's shapes and a "Remember" list. Do the quiz before you move on.

Take the lessons in the order of the table. When time is short, leave the rows marked "later" until the end.

| Lesson | id | Title | Short on time |
|---|---|---|---|
| 0 | `r0-start-here` | Start here: how to use this chapter, the four-line answer, and the exam map | now |
| 1a | `r1-sine-wave` | Review 1a: a sine wave, its period and frequency, and the units | take |
| 1b | `r1-phase-wavelength` | Review 1b: phase and wavelength | later |
| 1c | `r1-bandwidth-bits` | Review 1c: bandwidth of a composite signal, and bits, rate and time | later |
| 1d | `r1-decibel-snr` | Review 1d: decibels and SNR | take |
| 1e | `r1-nyquist-shannon` | Review 1e: Nyquist and Shannon: the factor of 2, noiseless vs noisy | take |
| 2a | `r2-levels-signal-rate` | Review 2a: bits per level, data rate vs signal rate, and the bandwidth of a digital signal | take |
| 2b | `r2-pcm` | Review 2b: PCM: sample, quantize, encode | take |
| 2c | `r2-digital-to-analog` | Review 2c: digital-to-analog: ASK, FSK, PSK, QAM, baud and constellations | take |
| 2d | `r2-fdm-tdm` | Review 2d: FDM with guard bands, and the synchronous TDM chain | take |
| 3a | `r3-hamming-parity` | Review 3a: codewords, Hamming distance and parity | take |
| 3b | `r3-crc` | Review 3b: CRC: modulo-2 division by hand | take |
| 3c | `r3-checksum` | Review 3c: checksum: sum, wrap, complement, and FEC with XOR | take |
| 3d | `r3-stuffing` | Review 3d: framing, byte stuffing and bit stuffing | take |
| 3e | `r3-stop-and-wait` | Review 3e: flow control, error control and Stop-and-Wait | take |
| 4a | `r4-three-moves-layers` | Review 4a: the three-move written answer, and the layers | take |
| 4b | `r4-networks-transmission` | Review 4b: networks, signals and transmission, in the slide's words | later |
| 4c | `r4-coding-conversion-mux-arp` | Review 4c: line coding, conversion, multiplexing and ARP, in the slide's words | take |
| 5 | `r5-tf-fill-bank` | Review 5: true-or-false and fill-in-the-blank bank, Weeks 1 to 7 | Weeks 5 to 7 banks first |

The Week 7 lessons, 3a to 3e, carry the longest item on the review list. Synchronous TDM in 2d is the one the review list marks "especially".

## The four-line answer, in plain words

A calculation earns its marks from the working, not only from the last number. A right formula with a slip in the arithmetic usually keeps most of the marks.

So every calculation is written as the same four lines. The fourth line, the check, is where a missing 2 or a wrong sign gets caught.

```diagram
{ "type": "flow", "dir": "tb", "title": "The four lines of every calculation", "nodes": [
  { "id": "f", "label": "1. Formula", "sub": "as on the slide" },
  { "id": "s", "label": "2. Substitution", "sub": "numbers with units" },
  { "id": "a", "label": "3. Answer", "sub": "with unit and prefix" },
  { "id": "c", "label": "4. Check", "sub": "sign, size, power of 2" }
], "edges": [ { "from": "f", "to": "s" }, { "from": "s", "to": "a" }, { "from": "a", "to": "c" } ], "hi": ["c"], "caption": "Formula, substitution, answer, check: the check line catches a missing factor of 2, an SNR left in dB, kHz written for kbps, and a loss without its minus sign." }
```

## The four lines on one example

A signal travels along a cable and arrives with half the power it started with. How many decibels is that?

Line 1, the formula. Here $P_1$ is the power at the start and $P_2$ the power at the end, both in watts.

$$\text{dB} = 10 \log_{10} \frac{P_2}{P_1}$$

Line 2, the substitution. Half the power means $P_2 = 0.5\,P_1$, so the watts cancel.

$$\text{dB} = 10 \log_{10} \frac{0.5\,P_1}{P_1} = 10 \log_{10} 0.5$$

Line 3, the answer with its unit.

$$\text{dB} = 10 \times (-0.30103) = \mathbf{-3.01\ dB}$$

Line 4, the check. The power fell, so the decibels must be negative, and half the power is the well-known −3 dB.

## Which formula? Read the cue words first

Each calculation is one line of algebra, and marks are lost by choosing the wrong line. Each question names its quantity with a fixed word, so find that word before any number.

The table lists every cue, in the order the weeks teach them. The last column names the lesson that works it.

| The question says | Formula | Unit of the answer | Check | Lesson |
|---|---|---|---|---|
| "frequency", "period" | T = 1/f, f = 1/T | s (ms, μs) or Hz (kHz, MHz) | 1/ms gives kHz, 1/μs gives MHz | 1a |
| "fraction of a cycle", "shifted" | φ = fraction × 360°; rad = ° × 2π/360 | ° or rad | 360° = 2π rad | 1b |
| "wavelength" | λ = c/f = c × T, c = 3 × 10⁸ m/s in a vacuum | m (μm for light) | higher f, shorter λ | 1b |
| "bandwidth", "composite", "middle frequency" | B = f_h − f_l; f_h + f_l = 2 × middle | Hz | only the two extremes matter | 1c |
| "how long to send", "bit rate needed" | time = bits ÷ bit rate; bit rate = units/s × bits per unit | s or bps | 8 bits per character | 1c |
| "attenuated", "loss", "dB/km", "power at the end" | dB = 10 log₁₀(P₂/P₁); P₂ = P₁ × 10^(dB/10) | dB or W | loss negative, gain positive | 1d |
| "signal power", "noise power" | SNR = P_signal ÷ P_noise; SNR_dB = 10 log₁₀ SNR | none, or dB | same prefix first | 1d |
| "noiseless", "levels" with a bit rate | Nyquist: BitRate = 2 × B × log₂ L | bps or levels | L a power of 2 | 1e |
| "noisy", "SNR", "capacity" | Shannon: C = B × log₂(1 + SNR) | bps | no 2; SNR a ratio | 1e |
| "SNR in dB" plus "capacity" | SNR = 10^(SNR_dB/10), then Shannon | bps | 30 dB is 1000, not 30 | 1e |
| "levels", "bits per level", "signal element corresponds to a level" | bits = ⌈log₂ L⌉, L = 2^bits | bits, levels | 2^bits ≥ L | 2a |
| "signal rate", "baud", "data elements per signal element" | S = c × N × 1/r, c = 1 unless "average" | baud | S ≤ N when r ≥ 1 | 2a |
| "bandwidth of a digital signal" | B = c × N × 1/r | Hz | same number as S | 2a |
| "sampling", "Nyquist theorem", "low-pass" | f_s = 2 × f_max | samples/s | bandpass: cannot be found | 2b |
| "bits per sample", "quantization levels" | n_b = log₂ L | bits | 2^n_b = L | 2b |
| "PCM bit rate", "digitize" | bit rate = f_s × n_b | bps | ÷ n_b gives f_s back | 2b |
| "minimum bandwidth" after PCM | B_min = n_b × B_analog | Hz | n_b times the analog | 2b |
| "SNR" with PCM | SNR_dB = 6.02 n_b + 1.76 | dB | each bit adds about 6 dB | 2b |
| "constellation points", "per signal element" | r = log₂ n | bits | 2^r = n | 2c |
| "ASK", "PSK", "QAM" bandwidth | B = (1 + d) × S | Hz | B ≥ S | 2c |
| "FSK" bandwidth | B = (1 + d) × S + 2Δf | Hz | wider than ASK | 2c |
| "channels", "guard band" | B = n × B_ch + (n − 1) × G | Hz | n − 1 guards | 2d |
| "frame", "slots", "framing bit" | the TDM chain: unit rate → frame rate → frame duration → link rate | frames/s, s, bps | frame duration × frame rate = 1 | 2d |

Three course formulas start with a 2, and Shannon does not. The tree sorts them.

```diagram
{ "type": "tree", "title": "Which formula? The three that start with 2, and Shannon", "nodes": [
  { "id": "q", "label": "A rate or a limit?", "sub": "read the cue words" },
  { "id": "two", "label": "Starts with 2", "sub": "no noise in it", "parent": "q" },
  { "id": "no2", "label": "No 2", "sub": "noisy, SNR given", "parent": "q" },
  { "id": "ny", "label": "Nyquist bit rate", "sub": "2 × B × log₂ L", "parent": "two" },
  { "id": "fs", "label": "Sampling rate", "sub": "f_s = 2 × f_max", "parent": "two" },
  { "id": "nm", "label": "N_max, digital", "sub": "2 × B × log₂ L, c = ½", "parent": "two" },
  { "id": "sh", "label": "Shannon capacity", "sub": "B × log₂(1 + SNR)", "parent": "no2" }
], "hi": ["ny", "sh"], "caption": "Noiseless or levels: Nyquist, with the 2. Noisy or SNR: Shannon, without it. The sampling rate and N_max also start with 2." }
```

## The exam map: what to open on which side

The two printed sheets are four sides, one block of weeks each. Every side ends with the same two sections: the true-or-false traps and the fill-in word bank for its weeks.

The written answers and the calculations sit in the sections above those two.

```diagram
{ "type": "grid", "title": "The four printed sides, by question shape", "nodes": [
  { "id": "h0", "label": "Side", "row": 0, "col": 0 },
  { "id": "h1", "label": "True or false, fill-in", "row": 0, "col": 1 },
  { "id": "h2", "label": "Written response", "row": 0, "col": 2 },
  { "id": "h3", "label": "Calculation", "row": 0, "col": 3 },
  { "id": "s1", "label": "Side 1", "sub": "Weeks 1, 2", "row": 1, "col": 0 },
  { "id": "a1", "label": "Traps, word bank", "sub": "Weeks 1 and 2", "row": 1, "col": 1 },
  { "id": "b1", "label": "Topologies", "sub": "Protocol layering", "row": 1, "col": 2 },
  { "id": "c1", "label": "Sine wave, units", "sub": "Phase, wavelength", "row": 1, "col": 3 },
  { "id": "s2", "label": "Side 2", "sub": "Weeks 3, 4", "row": 2, "col": 0 },
  { "id": "a2", "label": "Traps, word bank", "sub": "Weeks 3 and 4", "row": 2, "col": 1 },
  { "id": "b2", "label": "Baseband, broadband", "sub": "Impairment", "row": 2, "col": 2 },
  { "id": "c2", "label": "Decibel and SNR", "sub": "Data rate limits", "row": 2, "col": 3 },
  { "id": "s3", "label": "Side 3", "sub": "Weeks 5, 6", "row": 3, "col": 0 },
  { "id": "a3", "label": "Traps, word bank", "sub": "Weeks 5 and 6", "row": 3, "col": 1 },
  { "id": "b3", "label": "D2A and A2A", "sub": "ARP", "row": 3, "col": 2 },
  { "id": "c3", "label": "PCM and sampling", "sub": "Synchronous TDM", "row": 3, "col": 3 },
  { "id": "s4", "label": "Side 4", "sub": "Week 7, picker", "row": 4, "col": 0 },
  { "id": "a4", "label": "Traps, word bank", "sub": "Week 7", "row": 4, "col": 1 },
  { "id": "b4", "label": "Flow, error control", "sub": "Stop-and-Wait", "row": 4, "col": 2 },
  { "id": "c4", "label": "CRC, checksum", "sub": "Which formula?", "row": 4, "col": 3 }
], "hi": ["c4"], "caption": "A calculation on any week starts on side 4, \"Which formula? The three that start with 2\", then goes to the section named in its row." }
```

Each cell names the first section to open, not the only one. Each side also holds these sections:

- Side 2: *"Line coding: elements and rates (04)"* and *"The line-coding schemes and their level rules"*.
- Side 3: *"Multiplexing, FDM and WDM (06a)"*, *"Constellation diagram"* and *"The data-link layer (06b)"*.
- Side 4: *"Errors and redundancy (07a)"*, *"Block coding, Hamming distance and parity"* and *"Framing, byte stuffing and bit stuffing (07b)"*.

## Try it

```quiz
[
  {
    "q": "The midterm's two cheat sheets may be printed rather than handwritten.",
    "type": "tf",
    "answer": true,
    "explain": "True. Two double-sided A4 or Letter sheets are allowed, handwritten or printed: four sides in all."
  },
  {
    "q": "A telemetry link from the quester's PC to the LAN collector is described as noisy, with a given SNR. The question asks for its capacity. Which formula does it want?",
    "options": ["$C = B \\log_2(1 + \\text{SNR})$", "$\\text{BitRate} = 2 \\times B \\times \\log_2 L$", "$f_s = 2 \\times f_{max}$", "$B = (1 + d) \\times S$"],
    "answer": 0,
    "explain": "The cue words are *noisy*, *SNR* and *capacity*: that is Shannon, which has no factor of 2. Nyquist is for a noiseless channel with levels, and the sampling rate is PCM's first step."
  },
  {
    "q": "A question gives a channel's SNR as 30 dB. Shannon's formula is used with SNR = 30.",
    "type": "tf",
    "answer": false,
    "explain": "False. Shannon needs SNR as a ratio, so convert first: $\\text{SNR} = 10^{30/10} = 1000$. Writing 30 inside the log is the most common Shannon slip."
  },
  {
    "q": "A question says several channels share one link with a guard band between neighbours. Which formula gives the link's bandwidth?",
    "options": ["$B = n \\times B_{ch} + (n - 1) \\times G$", "$B = n \\times B_{ch} + n \\times G$", "$B = f_h - f_l$", "$B = c \\times N \\times 1/r$"],
    "answer": 0,
    "explain": "The cue words *channels* and *guard band* pick the FDM sum. Between n channels there are only n − 1 gaps, so there are n − 1 guard bands."
  },
  {
    "q": "A signal arrives with one quarter of the power it was sent with. What is the change in decibels? Give the sign.",
    "type": "numeric",
    "answer": -6.0206,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "Formula: $\\text{dB} = 10 \\log_{10}(P_2/P_1)$. Substitution: $10 \\log_{10}(0.25\\,P_1/P_1) = 10 \\log_{10} 0.25$. Answer: $10 \\times (-0.60206) = -6.02$ dB. Check: the power fell, so the sign is negative; a quarter is half of a half, so it is −3 dB twice."
  }
]
```

## Remember

- Read the cue words before any number: the cue picks the formula.
- Write four lines for every calculation: formula, substitution with units, answer with unit, check.
- Every side ends with its traps and its word bank, and every calculation starts on side 4.
- *On the sheet:* *Sheet side 4, "Which formula? The three that start with 2"* and *Sheet side 4, "Powers, logs, dB and units"*.

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "attenuated", "loss", "power at the end" | dB = 10 log₁₀(P₂/P₁) | dB | loss negative, half power is −3 dB |
