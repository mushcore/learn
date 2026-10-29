---
title: "Review 1: the Weeks 1 to 3 calculations: units, sine waves, bandwidth, decibels, SNR, Nyquist and Shannon (items 3 and 4)"
minutes: 70
---
:::quiz What the paper asks and what earns the marks
Review items 3 and 4: sine wave (T, f, phase, wavelength), composite bandwidth, unit conversion, attenuation in dB, SNR, Shannon vs Nyquist. Expect short calculations: a period, a lowest frequency, the power after a cable, an SNR in dB, a bit rate or a number of levels. The marker wants the formula, the substitution with units, the answer with its unit, and a check. The review list adds a NOTE: *we have a factor of 2 in Nyquist but not in the Shannon formula*.
:::

**Understand before the exam (cannot be looked up):**

- The formula from the cue words: "noiseless" or "levels" is Nyquist; "noisy" or "SNR" is Shannon.
- Shannon takes the SNR as a ratio: convert dB first with 10^(dB/10).
- A loss in dB is negative and keeps its unit; decibels along a path add.
- Powers in mW and μW: convert to one prefix before dividing.
- log₂ on a calculator: log₂ x = log x ÷ log 2.

**On the sheet (look up, do not memorise):**

- *Sheet side 1, "Sine wave and units"* and *"Phase and wavelength"*: prefixes, 1/ms → kHz, cycle fractions, λ = c/f.
- *Sheet side 1, "Time and frequency domain, bandwidth"* and *"Digital signals"*: B = f_h − f_l, f_h + f_l = 2 × middle, E02.
- *Sheet side 2, "Decibel and SNR"*: both dB formulas, SNR_dB, E03.
- *Sheet side 2, "Data rate limits: bandwidth, levels, noise"*: Nyquist vs Shannon, solved backwards, Examples 1 and 2.
- *Sheet side 4, "Which formula? The three that start with 2"* and *"Powers, logs, dB and units"*: the picker, 2ⁿ, dB to ratio.

Do if time is short: "Which formula?", "Decibels", "Nyquist and Shannon", then the new variants. The rest are marked "if time".

**Write this on the paper** for every calculation:

1. The formula, as on the slide.
2. The substitution, with units.
3. The answer with its unit.
4. A check: a sign, a size, a power of 2.

## Which formula? Read the cue words first

Each calculation is one line of algebra; marks are lost by choosing the wrong line. Read the cue words before any number.

| The question says | Formula | Unit of the answer | Check |
|---|---|---|---|
| "frequency", "period" | T = 1/f, f = 1/T | s (ms, μs) or Hz (kHz, MHz) | 1/ms gives kHz, 1/μs gives MHz |
| "fraction of a cycle", "shifted" | φ = fraction × 360°; rad = ° × 2π/360 | ° or rad | 360° = 2π rad |
| "wavelength" | λ = c/f = c × T, c = 3 × 10⁸ m/s in a vacuum | m (μm for light) | higher f, shorter λ |
| "bandwidth", "composite", "middle frequency" | B = f_h − f_l; f_h + f_l = 2 × middle | Hz | only the two extremes matter |
| "how long to send", "bit rate needed" | time = bits ÷ bit rate; bit rate = units/s × bits per unit | s or bps | 8 bits per character |
| "attenuated", "loss", "dB/km", "power at the end" | dB = 10 log₁₀(P₂/P₁); P₂ = P₁ × 10^(dB/10) | dB or W | loss negative, gain positive |
| "signal power", "noise power" | SNR = P_signal ÷ P_noise; SNR_dB = 10 log₁₀ SNR | none, or dB | same prefix first |
| "noiseless", "levels" | Nyquist: BitRate = 2 × B × log₂ L | bps or levels | L a power of 2 |
| "noisy", "SNR", "capacity" | Shannon: C = B × log₂(1 + SNR) | bps | no 2; SNR a ratio |
| "SNR in dB" plus "capacity" | SNR = 10^(SNR_dB/10), then Shannon | bps | 30 dB is 1000, not 30 |

Three course formulas start with a 2; Shannon does not. Only Nyquist and Shannon are Weeks 1 to 3; the other two return in Review 2.

```diagram
{ "type": "tree", "title": "Which formula? The three that start with 2, and Shannon", "nodes": [
  { "id": "q", "label": "A rate or a limit?", "sub": "read the cue words" },
  { "id": "two", "label": "Starts with 2", "sub": "no noise in the question", "parent": "q" },
  { "id": "no2", "label": "No 2", "sub": "noisy, SNR given", "parent": "q" },
  { "id": "ny", "label": "Nyquist bit rate", "sub": "2 × B × log₂ L (noiseless, levels)", "parent": "two" },
  { "id": "fs", "label": "Sampling rate", "sub": "f_s = 2 × f_max (Week 5)", "parent": "two" },
  { "id": "nm", "label": "N_max of a digital signal", "sub": "2 × B × log₂ L (Week 4, c = ½)", "parent": "two" },
  { "id": "sh", "label": "Shannon capacity", "sub": "B × log₂(1 + SNR), SNR a ratio", "parent": "no2" }
], "hi": ["ny", "sh"], "caption": "Week 3 asks for the two highlighted nodes. Noiseless or levels: Nyquist, with the 2. Noisy or SNR: Shannon, without it." }
```

**log₂ on a calculator.** Most calculators have only log (base 10). Divide by log 2:

$$\log_2 64 = \frac{\log 64}{\log 2} = \frac{1.80618}{0.30103} = \mathbf{6}$$

Check: 2⁶ = 64. Going back, key 2^4.417 as 2, x^y, 4.417.

## Units and the period: T = 1/f (if time)

Cue: "period" or "frequency". Sheet: *side 1, "Sine wave and units"*.

T is the time for one cycle; f is the cycles in 1 s. They are reciprocals, so prefixes pair: 1/ms gives kHz, 1/μs gives MHz.

Tiny case: a cycle that takes 0.25 ms. 1/0.25 = 4, and 1/ms is kHz, so f = 4 kHz.

The slide's two examples, worked:

$$T = \frac{1}{f} = \frac{1}{60\ \text{Hz}} = 0.0167\ \text{s} = \mathbf{16.7\ ms}$$

$$f = \frac{1}{T} = \frac{1}{200 \times 10^{-6}\ \text{s}} = \frac{1\,000\,000}{200} = 5000\ \text{Hz} = \mathbf{5\ kHz}$$

Check: 200 μs pairs with 1/μs = MHz, and 1/200 = 0.005 MHz = 5 kHz.

From an equation, set the coefficient of t to 2πf: 5 sin(20πt) gives f = 10 Hz, T = 0.1 s; sin(10t) gives f = 10/(2π) = 1.59 Hz, T = 0.628 s.

```widget
freq-period
{ "f": 60, "unit": "Hz", "title": "The slide's 60 Hz: type a period on the right to go back" }
```

## Phase and wavelength (if time)

Cue: "shifted by a fraction of a cycle", "offset", "wavelength". Sheet: *side 1, "Phase and wavelength"*.

**Phase** is the position of the waveform relative to time 0. One cycle is 360° = 2π rad, so a shift is its fraction of 360°. At time t the fraction is t ÷ T.

The slide's Example 2, an offset of 1/9 cycle:

$$\varphi = \tfrac{1}{9} \times 360° = \mathbf{40°} \qquad 40° \times \frac{2\pi}{360°} = \frac{2\pi}{9} = \mathbf{0.698 	ext{ rad}}$$

Check: 1/9 is a little less than 1/8, and 1/8 cycle is 45°.

**Wavelength** λ is the distance a simple signal travels in one period: λ = propagation speed ÷ f = propagation speed × T. In a vacuum c = 3 × 10⁸ m/s; lower in air and in cable. *Frequency is independent of the medium*; wavelength depends on frequency and medium. The slide's red light:

$$\lambda = \frac{c}{f} = \frac{3 \times 10^{8}\ \text{m/s}}{4 \times 10^{14}\ \text{Hz}} = 0.75 \times 10^{-6}\ \text{m} = \mathbf{0.75\ \mu m}$$

Check: light is measured in micrometres.

In a cable, from the slide: at 1 Mbps a bit lasts 1 μs, and at 2 × 10⁸ m/s it occupies 2 × 10⁸ × 10⁻⁶ = **200 m** (the bit length).

## Bandwidth of a composite signal (if time)

Cue: "composite", "decomposed into", "middle frequency". Sheet: *side 1, "Time and frequency domain, bandwidth"*.

Picture the frequency-domain plot: a spike per sine, or a continuous band. Its width is the bandwidth, B = f_h − f_l.

A middle frequency sits halfway, so f_h + f_l = 2 × middle: two equations, two unknowns.

```diagram
{ "type": "flow", "title": "E02 exercise 1: from bandwidth and middle to both edges", "nodes": [
  { "id": "b", "label": "f_h − f_l = 200 kHz", "sub": "the bandwidth" },
  { "id": "m", "label": "f_h + f_l = 280 kHz", "sub": "2 × the 140 kHz middle" },
  { "id": "h", "label": "2 f_h = 480 kHz", "sub": "add the two lines" },
  { "id": "a", "label": "f_h = 240, f_l = 40 kHz", "sub": "then subtract" }
], "edges": [ { "from": "b", "to": "h" }, { "from": "m", "to": "h" }, { "from": "h", "to": "a" } ], "hi": ["a"], "caption": "The triangle-shaped plot runs from 40 kHz (0 V) up to 20 V at 140 kHz and back to 0 V at 240 kHz." }
```

E02 exercise 2: the highest frequency is 400 MHz and the middle is 300 MHz.

$$f_l = 2 \times 300 - 400 = \mathbf{200\ MHz} \qquad B = 400 - 200 = \mathbf{200\ MHz}$$

E02 exercise 3: sines at 100, 400, 500, 750 and 900 Hz give B = 900 − 100 = **800 Hz**; the middle three never enter.

## Bits, rate and time (if time)

Cue: "how long does it take", "required bit rate". Sheet: *side 1, "Digital signals"*.

Rate × time = amount; amount ÷ rate = time. Let the units cancel.

E02 exercise 4, 200 pages per second, 24 lines of 80 characters, 8 bits each:

$$200\ \tfrac{\text{pages}}{\text{s}} \times 24 \times 80 \times 8\ \tfrac{\text{bits}}{\text{page}} = 3\,072\,000\ \text{bps} = \mathbf{3.072\ Mbps}$$

E02 exercise 5 at 1000 bps: 10 bits take 10 ÷ 1000 = **0.01 s**; 100 000 characters = 800 000 bits take **800 s**. Check: one bit lasts 1 ms, ten make 10 ms.

## Decibels: a loss is negative, and decibels add

Cue: "attenuated", "loss", "dB/km", "power at the end". Sheet: *side 2, "Decibel and SNR"*.

The decibel *measures the relative strengths of two signals or one signal at two different points*:

$$\text{dB} = 10 \log_{10} \frac{P_2}{P_1} = 20 \log_{10} \frac{V_2}{V_1}$$

P₁, P₂ are the powers at points 1 and 2 (same prefix); V₁, V₂ the voltages. *Negative: if a signal is attenuated. Positive: if a signal is amplified.*

The slide's example, power reduced to one-half:

$$\text{dB} = 10 \log_{10} \frac{0.5 P_1}{P_1} = 10 \log_{10} 0.5 = 10 \times (-0.3) = \mathbf{-3\ dB}$$

Check: half the power is about −3 dB, double is about +3 dB, a tenth is −10 dB.

**Back to power:** P₂ = P₁ × 10^(dB/10).

**E03 exercise 1**: −0.3 dB/km, 2 mW in, what arrives at 5 km?

```diagram
{ "type": "flow", "title": "E03 exercise 1: dB per km to the power at the end", "nodes": [
  { "id": "l", "label": "Loss in dB", "sub": "−0.3 × 5 = −1.5 dB" },
  { "id": "r", "label": "Ratio", "sub": "10^(−1.5/10) = 10^−0.15 = 0.708" },
  { "id": "p", "label": "Power at 5 km", "sub": "0.708 × 2 mW = 1.42 mW" }
], "edges": [ { "from": "l", "to": "r" }, { "from": "r", "to": "p" } ], "hi": ["p"], "caption": "The instructor's answer sheet writes the middle step as −1.5 = 10 log₁₀(P₂/2), so −0.15 = log₁₀(P₂/2)." }
```

$$P_2 = P_1 \times 10^{\text{dB}/10} = 2\ \text{mW} \times 10^{-0.15} = 2 \times 0.708 = \mathbf{1.42\ mW}$$

Check: a loss, so under 2 mW; −1.5 dB is half of −3 dB, so about 70 % survives.

**Decibels add along a path** (beyond the slides; the textbook's practice set). A −2 dB cable, then a +5 dB amplifier, then a −1 dB cable: −2 + 5 − 1 = **+2 dB** overall.

```widget
decibel
{ "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5, "title": "E03 exercise 1: 2 mW into 5 km of −0.3 dB/km cable", "presets": { "E03 exercise 1": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5 }, "Half the power (slide)": { "p1": 2, "db": -3 } } }
```

## SNR and SNR in dB

Cue: "average signal power", "average noise power", "SNR_dB". Sheet: *side 2, "Decibel and SNR"*.

*SNR is the ratio of what is wanted (signal) to what is not wanted (noise).* SNR = average signal power ÷ average noise power, no unit. SNR_dB = 10 log₁₀ SNR; back, SNR = 10^(SNR_dB/10). Noiseless: SNR = ∞.

The slide's example, 10 mW of signal and 1 μW of noise. Same prefix first:

$$\text{SNR} = \frac{10\ \text{mW}}{1\ \mu\text{W}} = \frac{10\,000\ \mu\text{W}}{1\ \mu\text{W}} = \mathbf{10\,000} \qquad \text{SNR}_{dB} = 10 \log_{10} 10^4 = \mathbf{40\ dB}$$

E03 exercise 2: noise from 10 devices adds, 10 × 2 μW = 20 μW; 200 000 μW ÷ 20 μW = **10 000**, again **40 dB**. Check: 200 ÷ 20 without converting gives 10, the trap.

```widget
snr-noise
{ "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10, "title": "E03 exercise 2: 200 mW through 10 devices of 2 μW noise each", "presets": { "Slide: 10 mW and 1 μW": { "signal": 10, "signalUnit": "mW", "noise": 1, "noiseUnit": "μW", "sources": 1 }, "E03 exercise 2": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10 } } }
```

## Nyquist and Shannon: the 2, the channel, the input

Cue: "noiseless" or "levels" for Nyquist; "noisy", "SNR" or "capacity" for Shannon. Sheet: *side 2, "Data rate limits: bandwidth, levels, noise"*.

The data rate depends on *the available bandwidth*, *the number of signal levels* and *the quality of the channel (the level of noise)*. Each formula uses two.

**Nyquist**, the theoretical maximum bit rate of a noiseless channel:

$$\text{BitRate} = 2 \times \text{bandwidth} \times \log_2 L$$

Bandwidth in Hz; L the number of signal levels. Solved: L = 2^(BitRate ÷ (2 × bandwidth)). If L is not a power of 2, *increase the number of levels or reduce the bit rate*.

The slide's Example 1, 265 kbps over a noiseless 30 kHz channel:

$$265\,000 = 2 \times 30\,000 \times \log_2 L \quad\Rightarrow\quad \log_2 L = 4.417 \quad\Rightarrow\quad L = 2^{4.417} = \mathbf{21.36\ levels}$$

Check: 16 levels give 2 × 30 × 4 = 240 kbps and the next power of 2 gives 300 kbps; 21.36 sits between.

**Shannon**, the capacity of a noisy channel (*In reality, we cannot have a noiseless channel; the channel is always noisy.*):

$$C = \text{bandwidth} \times \log_2(1 + \text{SNR})$$

No 2, no L, SNR a ratio. SNR near 0 gives C = B × log₂ 1 = 0.

The slide's Example 2 uses both: a 1 MHz channel with SNR 63. *The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need.*

$$C = 1\,000\,000 \times \log_2(1 + 63) = 1\,000\,000 \times 6 = \mathbf{6\ Mbps}$$

$$6\,000\,000 = 2 \times 1\,000\,000 \times \log_2 L \quad\Rightarrow\quad \log_2 L = 3 \quad\Rightarrow\quad L = \mathbf{8}$$

Check: 8 is a power of 2, and 2 × 1 MHz × 3 gives back exactly the 6 Mbps limit.

:::warn The dB trap
An SNR given in dB goes through 10^(dB/10) before Shannon. A 3 kHz channel at 30 dB: SNR = 1000 and C = 3000 × log₂ 1001 = 29 902 bps. Putting 30 in place of 1000 gives 3000 × log₂ 31 = 14 863 bps, half the right answer.
:::

```widget
data-rate
{ "show": "nyquist", "bandwidth": 30, "unit": "kHz", "levels": 16, "target": 265, "targetUnit": "kbps", "title": "Example 1: 265 kbps over a noiseless 30 kHz channel", "presets": { "Example 1 (noiseless 30 kHz)": { "show": "nyquist", "bandwidth": 30, "unit": "kHz", "levels": 16, "target": 265, "targetUnit": "kbps" }, "Example 2 (1 MHz, SNR 63)": { "bandwidth": 1, "unit": "MHz", "snr": 63, "levels": 8 } } }
```

## New variants: the quester's tick, its telemetry and its link

The MapleStory Classic quester's engine runs on `on_tick` about every 30 ms (take it as exactly 30 ms here), it reads the character's position each tick, and its `Telemetry` module posts event batches to a local collector across the LAN. The numbers are made up around those facts. Write the four lines on paper first.

```quiz
[
  {
    "q": "The engine's tick is a period of 30 ms. What is the tick frequency, in Hz? (Two decimals.)",
    "type": "numeric",
    "answer": 33.33,
    "tolerance": 0.04,
    "unit": "Hz",
    "explain": "Formula: f = 1/T. Substitution: f = 1 / (30 × 10⁻³ s) = 1 / 0.030 s. Answer: 33.33 Hz. Check: 1/ms gives kHz, and 1/30 = 0.0333 kHz = 33.3 Hz; about 33 ticks in one second."
  },
  {
    "q": "Each tick the engine samples the character's position as two 32-bit numbers (x and y), 64 bits per sample. What bit rate does that stream of samples need, in bps? (Two decimals.)",
    "type": "numeric",
    "answer": 2133.33,
    "tolerance": 3,
    "unit": "bps",
    "explain": "Formula: bit rate = samples per second × bits per sample. Substitution: (1 / 0.030 s) × 64 bits = 33.33 × 64. Answer: 2133.33 bps (about 2.13 kbps). Check: the units cancel to bits per second, and 64 bits every 30 ms is 64 ÷ 0.030 = 2133 bps."
  },
  {
    "q": "Treat the 30 ms tick as the period of a sine wave. A point 7.5 ms after time 0 is how far around the cycle, in radians? (Three decimals.)",
    "type": "numeric",
    "answer": 1.571,
    "tolerance": 0.002,
    "unit": "rad",
    "explain": "Formula: φ = (t ÷ T) × 360°, then rad = ° × 2π/360. Substitution: 7.5 ms ÷ 30 ms = 1/4 cycle; 1/4 × 360° = 90°; 90° × 2π/360° = π/2. Answer: 1.571 rad. Check: a quarter cycle is where sin reaches its peak, 90° = π/2."
  },
  {
    "q": "The PC reaches the router over 2.4 GHz Wi-Fi. What is the wavelength of a 2.4 GHz sine in a vacuum, in cm?",
    "type": "numeric",
    "answer": 12.5,
    "tolerance": 0,
    "unit": "cm",
    "explain": "Formula: λ = c/f with c = 3 × 10⁸ m/s. Substitution: λ = 3 × 10⁸ m/s ÷ 2.4 × 10⁹ Hz = 0.125 m. Answer: 12.5 cm. Check: GHz gives centimetres, as the slide's red light at 10¹⁴ Hz gives micrometres; higher frequency, shorter wavelength."
  },
  {
    "q": "The PC's link to the collector runs at 10 Mbps. How many bits can it carry in one 30 ms tick?",
    "type": "numeric",
    "answer": 300000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: bits = bit rate × time. Substitution: 10 × 10⁶ bps × 30 × 10⁻³ s. Answer: 300 000 bits (37 500 bytes). Check: the bit duration is 1/10⁷ s = 100 ns, and 30 ms ÷ 100 ns = 300 000 bits."
  },
  {
    "q": "The Wi-Fi signal leaves the PC at 4 mW and arrives at the router at 50 μW. What is the change, in dB? (Two decimals, with the sign.)",
    "type": "numeric",
    "answer": -19.03,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "Formula: dB = 10 log₁₀(P₂/P₁). Substitution: same prefix first, 4 mW = 4000 μW; 10 log₁₀(50 ÷ 4000) = 10 log₁₀ 0.0125 = 10 × (−1.903). Answer: −19.03 dB. Check: negative, so attenuated; between −10 dB (a tenth) and −20 dB (a hundredth), and 0.0125 lies between them."
  },
  {
    "q": "8 mW enters a path whose total change is −4.5 dB. What power comes out, in mW? (Two decimals.)",
    "type": "numeric",
    "answer": 2.84,
    "tolerance": 0.01,
    "unit": "mW",
    "explain": "Formula: P₂ = P₁ × 10^(dB/10). Substitution: 8 mW × 10^(−4.5/10) = 8 × 10^(−0.45) = 8 × 0.3548. Answer: 2.84 mW. Check: −3 dB would halve 8 to 4 mW and −6 dB would quarter it to 2 mW; −4.5 dB lands between."
  },
  {
    "q": "The Wi-Fi channel is a noisy 20 MHz channel with an SNR of 22 dB. What is its Shannon capacity, in Mbps? (One decimal.)",
    "type": "numeric",
    "answer": 146.3,
    "tolerance": 0.2,
    "unit": "Mbps",
    "explain": "Formula: SNR = 10^(SNR_dB/10), then C = B × log₂(1 + SNR). Substitution: SNR = 10^2.2 = 158.49; C = 20 000 000 × log₂(159.49) = 20 000 000 × 7.317 (log 159.49 ÷ log 2). Answer: 146.3 Mbps. Check: no factor of 2; putting 22 in place of 158.49 gives 20 000 000 × log₂ 23 = 90.5 Mbps, the dB trap."
  },
  {
    "q": "The collector's link must carry 150 kbps over a noiseless 20 kHz channel. How many signal levels does Nyquist give? (Two decimals.)",
    "type": "numeric",
    "answer": 13.45,
    "tolerance": 0.01,
    "unit": "levels",
    "explain": "Formula: BitRate = 2 × B × log₂ L, so L = 2^(BitRate ÷ 2B). Substitution: log₂ L = 150 000 ÷ (2 × 20 000) = 3.75; L = 2^3.75. Answer: 13.45 levels. Check: not a power of 2, so increase the levels (16 levels give 2 × 20 × 4 = 160 kbps) or reduce the bit rate (8 levels give 120 kbps)."
  },
  {
    "q": "A 500 kHz channel to the game server has an SNR of 1023. Shannon gives the upper limit; how many signal levels does Nyquist then need to reach it?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Formula: C = B × log₂(1 + SNR), then C = 2 × B × log₂ L. Substitution: C = 500 000 × log₂ 1024 = 500 000 × 10 = 5 000 000 bps; 5 000 000 = 2 × 500 000 × log₂ L, so log₂ L = 5. Answer: L = 2⁵ = 32 levels. Check: a power of 2, and 2 × 500 kHz × 5 gives back exactly 5 Mbps (the slide's Example 2 method)."
  }
]
```
