---
title: "Review 2b: PCM: sample, quantize, encode"
minutes: 20
---
This lesson teaches how a smooth analog signal becomes a stream of bits, and how many bits per second that stream needs. It prepares you for questions like E05 exercises 1 and 2, which ask for a bit rate and a minimum bandwidth.

## What PCM does, in plain words

An analog signal is a smooth voltage, like the output of a microphone. A computer stores only bits, so the curve has to become a list of numbers.

Pulse code modulation, PCM, does this in three fixed steps. Slide wording: *A PCM encoder has three processes:* sampling, quantizing and encoding.

Sampling reads the height of the curve at evenly spaced instants. Everything between two readings is thrown away.

Quantizing cuts the voltage range into a fixed number of equal bands, called zones. Each reading is replaced by the middle of the zone it falls in.

Encoding writes the number of each zone as a short word of bits. The words leave the encoder one after another.

```diagram
{ "type": "flow", "title": "A PCM encoder in three boxes", "nodes": [
  { "id": "a", "label": "Analog curve", "kind": "pill" },
  { "id": "s", "label": "Sampling", "sub": "read the height" },
  { "id": "q", "label": "Quantizing", "sub": "snap to a zone" },
  { "id": "e", "label": "Encoding", "sub": "zone number in bits" },
  { "id": "b", "label": "Bits", "kind": "pill" }
], "edges": [ { "from": "a", "to": "s" }, { "from": "s", "to": "q" }, { "from": "q", "to": "e" }, { "from": "e", "to": "b" } ], "hi": ["s", "q", "e"], "caption": "The order is fixed: each box needs the output of the box before it, and only the last box makes bits." }
```

How often must we read? A wave that rises and falls once needs at least two readings, one near the top and one near the bottom.

So the reading rate must be at least twice the fastest wiggle in the signal. That is the Nyquist theorem for sampling.

## A tiny case you can do in your head

A signal wiggles at most 3 times a second. Two readings per wiggle:

$$ 3 \times 2 = \mathbf{6 \text{ readings per second}} $$

The encoder uses 4 zones. Two bits name four zones, 00 to 11, so each reading costs 2 bits:

$$ 6 \times 2 = \mathbf{12 \text{ bits per second}} $$

The answer makes sense. Six readings leave every second, and each one is a 2-bit word.

## The formulas, with each symbol named

```diagram
{ "type": "flow", "title": "The PCM chain, one formula per box", "nodes": [
  { "id": "s", "label": "Sampling", "sub": "f_s = 2 × f_max" },
  { "id": "q", "label": "Quantizing", "sub": "Δ = (V_max − V_min)/L" },
  { "id": "e", "label": "Encoding", "sub": "n_b = log₂ L" },
  { "id": "r", "label": "Bit rate", "sub": "f_s × n_b" },
  { "id": "b", "label": "B_min", "sub": "n_b × B_analog" }
], "edges": [ { "from": "s", "to": "q" }, { "from": "q", "to": "e" }, { "from": "e", "to": "r" }, { "from": "r", "to": "b" } ], "hi": ["s", "r"], "caption": "Slide wording: a PCM encoder has three processes, sampling, quantizing and encoding. The bit rate and the minimum bandwidth follow from them." }
```

**Sampling rate.** The slide's box: *According to the Nyquist theorem, to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal.*

$$ f_s = 2 \times f_{max} $$

- $f_s$ is the sampling rate, in samples/s. It is also $1/T_s$, where $T_s$ is the time between samples.
- $f_{max}$ is the highest frequency in the signal, in Hz.

The trap is the kind of signal. A **low-pass** signal starts at 0 Hz, so its bandwidth is its highest frequency. A **bandpass** signal starts higher, so its bandwidth does not give $f_{max}$.

**Zones and bits.** Slide wording: *n_b = log₂ L*.

$$ \Delta = \frac{V_{max} - V_{min}}{L} \qquad n_b = \log_2 L $$

- $L$ is the number of zones, the quantization levels.
- $\Delta$ is the height of one zone, in volts.
- $n_b$ is the bits per sample. Round it up when $L$ is not a power of 2.

**Bit rate.** Slide wording: *Bit rate = Sampling rate × Number of bits per sample = f_s × n_b*.

$$ \text{bit rate} = f_s \times n_b $$

The units multiply: samples/s × bits/sample = bits/s.

**Minimum bandwidth.** The slide's line: *B_min = c × n_b × 2 × B_analog × 1/r*. With $c = \frac{1}{2}$ and $r = 1$, the half cancels the 2:

$$ B_{min} = n_b \times B_{analog} $$

- $B_{analog}$ is the bandwidth of the analog signal, in Hz.

Slide wording: *This is the price we pay for digitization.*

**Error and SNR.** A sample moves at most half a zone, so *−Δ/2 ≤ quantization error ≤ Δ/2*. The slide's box gives the signal-to-noise ratio, the power of the signal over the power of the error, in decibels:

$$ \text{SNR}_{dB} = 6.02\, n_b + 1.76 $$

## The slide's examples, worked

**Low-pass.** *What is the minimum sampling rate for a low-pass signal that has a bandwidth of 100 kHz?* For a low-pass signal, $f_{max}$ is the bandwidth:

$$ f_s = 2 \times 100\,000 \text{ Hz} = \mathbf{200\,000 \text{ samples/s}} $$

Check: $1/200\,000$ s is 5 μs between samples.

**Bandpass.** The same question for a bandpass signal. Slide answer: *We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.*

**Quantizing.** The slide's signal runs from −20 V to +20 V with $L = 8$:

$$ \Delta = \frac{20 - (-20)}{8} = \frac{40 \text{ V}}{8} = \mathbf{5 \text{ V}} $$

Divide each sample by 5 V and read the zone, counting 0 from the bottom. The zone in 3 bits is the word.

```diagram
{ "type": "grid", "title": "The slide's nine samples, L = 8, Δ = 5 V", "nodes": [
  {"id": "h0", "label": "Actual (V)", "row": 0, "col": 0},
  {"id": "h1", "label": "÷ 5", "row": 0, "col": 1},
  {"id": "h2", "label": "Zone", "row": 0, "col": 2},
  {"id": "h3", "label": "Word", "row": 0, "col": 3},
  {"id": "v1", "label": "−6.1", "row": 1, "col": 0},
  {"id": "p1", "label": "−1.22", "row": 1, "col": 1},
  {"id": "z1", "label": "2", "row": 1, "col": 2},
  {"id": "w1", "label": "010", "row": 1, "col": 3},
  {"id": "v2", "label": "7.5", "row": 2, "col": 0},
  {"id": "p2", "label": "1.50", "row": 2, "col": 1},
  {"id": "z2", "label": "5", "row": 2, "col": 2},
  {"id": "w2", "label": "101", "row": 2, "col": 3},
  {"id": "v3", "label": "16.2", "row": 3, "col": 0},
  {"id": "p3", "label": "3.24", "row": 3, "col": 1},
  {"id": "z3", "label": "7", "row": 3, "col": 2},
  {"id": "w3", "label": "111", "row": 3, "col": 3},
  {"id": "v4", "label": "19.7", "row": 4, "col": 0},
  {"id": "p4", "label": "3.94", "row": 4, "col": 1},
  {"id": "z4", "label": "7", "row": 4, "col": 2},
  {"id": "w4", "label": "111", "row": 4, "col": 3},
  {"id": "v5", "label": "11.0", "row": 5, "col": 0},
  {"id": "p5", "label": "2.20", "row": 5, "col": 1},
  {"id": "z5", "label": "6", "row": 5, "col": 2},
  {"id": "w5", "label": "110", "row": 5, "col": 3},
  {"id": "v6", "label": "−5.5", "row": 6, "col": 0},
  {"id": "p6", "label": "−1.10", "row": 6, "col": 1},
  {"id": "z6", "label": "2", "row": 6, "col": 2},
  {"id": "w6", "label": "010", "row": 6, "col": 3},
  {"id": "v7", "label": "−11.3", "row": 7, "col": 0},
  {"id": "p7", "label": "−2.26", "row": 7, "col": 1},
  {"id": "z7", "label": "1", "row": 7, "col": 2},
  {"id": "w7", "label": "001", "row": 7, "col": 3},
  {"id": "v8", "label": "−9.4", "row": 8, "col": 0},
  {"id": "p8", "label": "−1.88", "row": 8, "col": 1},
  {"id": "z8", "label": "2", "row": 8, "col": 2},
  {"id": "w8", "label": "010", "row": 8, "col": 3},
  {"id": "v9", "label": "−6.0", "row": 9, "col": 0},
  {"id": "p9", "label": "−1.20", "row": 9, "col": 1},
  {"id": "z9", "label": "2", "row": 9, "col": 2},
  {"id": "w9", "label": "010", "row": 9, "col": 3}
], "hi": ["v1", "p1", "z1", "w1"], "caption": "−6.1 ÷ 5 = −1.22 lies between −2 and −1, which is zone 2, written 010. The error is at most half a zone, 2.5 V." }
```

**E05 exercise 1.** *We know that the human voice normally includes frequencies from 0 to 4 kHz. If we want to digitize the human voice, what is the bit rate, assuming 8 bits per sample?*

Step 1, sampling rate:

$$ f_s = 2 \times 4000 \text{ Hz} = \mathbf{8000 \text{ samples/s}} $$

Step 2, bit rate:

$$ \text{bit rate} = 8000 \text{ samples/s} \times 8 \text{ bits} = \mathbf{64\,000 \text{ bps}} = 64 \text{ kbps} $$

Check: 64 000 ÷ 8 = 8000, the sampling rate back.

**E05 exercise 2.** *If the number of quantization levels is 64, how many bits are required per sample? If the bandwidth of the original analog signal is 300 MHz, what is the minimum required bandwidth … (assume r = 1)?*

$$ n_b = \log_2 64 = \mathbf{6 \text{ bits}} $$

$$ B_{min} = 6 \times 300 \text{ MHz} = \mathbf{1800 \text{ MHz}} = 1.8 \text{ GHz} $$

Check: the digital signal needs $n_b$ times the analog bandwidth.

**Audio SNR.** Audio uses $L = 256$, so $n_b = 8$:

$$ \text{SNR}_{dB} = 6.02 \times 8 + 1.76 = \mathbf{49.92 \text{ dB}} $$

More levels mean more bits per sample. So the bit rate goes up, and so does the SNR, which is what E05 exercise 3 asks in words.

```widget
pcm-calc
{ "presets": { "E05 1: voice 0 to 4 kHz, 8 bits": { "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" }, "E05 2: L = 64, 300 MHz": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1" } } }
```

## Try it

The scripting engine reads the character's x position once per tick. The numbers are ours. Work each on paper in the four lines first.

```quiz
[
  {
    "q": "1. The engine samples the character's x position once per tick, every 30 ms. What is the sampling rate, in samples per second? (Two decimals.)",
    "type": "numeric",
    "answer": 33.33,
    "tolerance": 0.05,
    "unit": "samples/s",
    "explain": "Formula: f_s = 1/T_s.\nSubstitution: f_s = 1/(30 ms) = 1/0.030 s.\nAnswer: **33.33 samples/s**.\nCheck: 33.33 × 0.030 s = 1. By the Nyquist theorem this rate reproduces movement only up to f_max = f_s/2 = 16.67 Hz."
  },
  {
    "q": "2. The x coordinate on the Magic Library map takes 1500 different values, so the engine quantizes it with L = 1500 levels. How many bits per sample does that need?",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: n_b = ⌈log₂ L⌉, rounded up because L is not a power of 2.\nSubstitution: log₂ 1500 = log 1500 / log 2 = 10.55.\nAnswer: **11 bits**.\nCheck: 2¹⁰ = 1024 levels is too few, 2¹¹ = 2048 is enough."
  },
  {
    "q": "3. At the sampling rate of item 1 and the bits per sample of item 2, what is the bit rate of the position stream, in bps?",
    "type": "numeric",
    "answer": 366.67,
    "tolerance": 0.5,
    "unit": "bps",
    "explain": "Formula: bit rate = f_s × n_b.\nSubstitution: 33.33 samples/s × 11 bits.\nAnswer: **366.67 bps**. The value 366.3, from the rounded 33.3, is accepted.\nCheck: 366.67 ÷ 11 = 33.33, the sampling rate back."
  },
  {
    "q": "4. What SNR in dB does the quantization of item 2 allow? (Two decimals.)",
    "type": "numeric",
    "answer": 67.98,
    "tolerance": 0.02,
    "unit": "dB",
    "explain": "Formula: SNR_dB = 6.02 n_b + 1.76.\nSubstitution: 6.02 × 11 + 1.76 = 66.22 + 1.76.\nAnswer: **67.98 dB**.\nCheck: about 6 dB per bit. 8 bits gave 49.92 dB, so 3 more bits add about 18 dB."
  },
  {
    "q": "5. Treat the position as a low-pass signal whose bandwidth is the Nyquist limit of item 1 (f_s/2 = 16.67 Hz). With c = 1/2 and r = 1, what is the minimum bandwidth of the digitized stream, in Hz?",
    "type": "numeric",
    "answer": 183.33,
    "tolerance": 0.5,
    "unit": "Hz",
    "explain": "Formula: B_min = n_b × B_analog, the slide's c × n_b × 2 × B_analog × 1/r with c = 1/2 and r = 1.\nSubstitution: 11 × 16.67 Hz.\nAnswer: **183.33 Hz**.\nCheck: c × N × 1/r = 1/2 × 366.67 = 183.33 Hz gives the same, 11 times the analog bandwidth."
  },
  {
    "q": "6. A bandpass signal has a bandwidth of 100 kHz. Its minimum sampling rate is 200 000 samples/s.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: f_s = 2 × f_max, and only a low-pass signal has f_max equal to its bandwidth.\nSubstitution: a bandpass signal starts above 0 Hz, so f_max is unknown.\nAnswer: **false**. Slide answer: we cannot find the minimum sampling rate because we do not know the maximum frequency.\nCheck: 100 kHz wide could be 900 to 1000 kHz, which needs 2 000 000 samples/s."
  }
]
```

## Remember

- Sample at twice the highest frequency. Only a low-pass signal lets you read that from the bandwidth.
- Bits per sample is $\log_2 L$, rounded up. Bit rate is samples per second times bits per sample.
- $B_{min} = n_b \times B_{analog}$ already holds $c = \frac{1}{2}$ and $r = 1$.
- *On the sheet:* Sheet side 3, "PCM and sampling (05a)" and "Quantization, encoding and PCM bandwidth".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "sampling", "Nyquist theorem", "low-pass" | f_s = 2 × f_max | samples/s | bandpass: cannot be found |
| "bits per sample", "quantization levels" | n_b = ⌈log₂ L⌉ | bits | 2^n_b ≥ L |
| "PCM bit rate", "minimum bandwidth" | f_s × n_b, B_min = n_b × B_analog | bps, Hz | ÷ n_b gives f_s back |
