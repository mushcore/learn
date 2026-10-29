---
title: "Review 1d: decibels and SNR"
minutes: 18
---
This lesson teaches how to say how much a signal weakened or strengthened, and how much stronger it is than the noise around it. It prepares the E03 questions: the power left at the end of a cable, and a signal-to-noise ratio in plain numbers and in decibels.

## What a decibel is, in plain words

A signal loses energy as it travels down a cable. The slides call that loss **attenuation**, and an amplifier puts energy back.

A **decibel** compares two powers: the same signal at two points, or two different signals. It answers one question: by what factor did the power change?

It uses a logarithm because powers in networks span huge ranges. A logarithm turns "times 10" into "plus 10 dB", so a long chain of multiplications becomes a short sum.

A loss gives a negative number of decibels. A gain gives a positive number, and no change gives 0 dB.

```diagram
{ "type": "flow", "title": "One signal at three points", "nodes": [
  { "id": "p1", "label": "Point 1", "sub": "original, 10 mW" },
  { "id": "p2", "label": "Point 2", "sub": "after the cable, 1 mW" },
  { "id": "p3", "label": "Point 3", "sub": "after an amplifier" }
], "edges": [ { "from": "p1", "to": "p2", "label": "−10 dB" }, { "from": "p2", "to": "p3", "label": "gain, + dB" } ], "hi": ["p2"], "caption": "Power falling to a tenth is −10 dB; the amplifier's gain is a positive number of decibels." }
```

## A tiny case you can do in your head

A signal enters a cable at 10 mW and leaves at 1 mW. The ratio, point 2 over point 1, is one tenth.

$$\frac{P_2}{P_1} = \frac{1\ \text{mW}}{10\ \text{mW}} = 0.1$$

The logarithm of 0.1 is −1, because 10 to the power −1 is 0.1.

$$10 \times \log_{10} 0.1 = 10 \times (-1) = \mathbf{-10\ dB}$$

It is negative because the signal lost power.

## The formula, with each symbol named

$$\text{dB} = 10 \log_{10} \frac{P_2}{P_1} = 20 \log_{10} \frac{V_2}{V_1}$$

- $P_1$ is the power at point 1 and $P_2$ the power at point 2. Both must use the same prefix, such as mW.
- $V_1$ and $V_2$ are voltages at the same two points. Voltages take 20, powers take 10.

The trap is the sign: point 2 goes on top, so a loss comes out negative.

*Negative: if a signal is attenuated. Positive: if a signal is amplified.*

## The slide's example: half the power

*Suppose a signal travels through a transmission medium and its power is reduced to one-half.*

$$\text{dB} = 10 \log_{10} \frac{0.5 P_1}{P_1} = 10 \log_{10} 0.5 = 10 \times (-0.3) = \mathbf{-3\ dB}$$

Check: half the power is about −3 dB, and double the power is about +3 dB.

## Back from decibels to power, and adding along a path

E03 gives the decibels and asks for the power. Undo the formula: divide by 10, then raise 10 to that number.

$$P_2 = P_1 \times 10^{\text{dB}/10}$$

A cable's loss is usually given in dB per kilometre. Multiply by the kilometres to get the loss of the whole cable.

The textbook's practice set adds one more rule: decibels along a path simply add. A −2 dB cable, a +5 dB amplifier and a −1 dB cable give:

$$-2 + 5 - 1 = \mathbf{+2\ dB}$$

## E03 exercise 1, worked

*If the signal at the beginning of a cable with −0.3 dB/km has a power of 2 mW, what is the power of the signal at 5 km?*

```diagram
{ "type": "flow", "title": "E03 exercise 1: dB per km to the power at the end", "nodes": [
  { "id": "l", "label": "Loss in dB", "sub": "−0.3 × 5 = −1.5 dB" },
  { "id": "r", "label": "Ratio", "sub": "10^(−1.5/10) = 10^−0.15 = 0.708" },
  { "id": "p", "label": "Power at 5 km", "sub": "0.708 × 2 mW = 1.42 mW" }
], "edges": [ { "from": "l", "to": "r" }, { "from": "r", "to": "p" } ], "hi": ["p"], "caption": "The instructor's answer sheet writes the middle step as −1.5 = 10 log₁₀(P₂/2), so −0.15 = log₁₀(P₂/2)." }
```

$$P_2 = P_1 \times 10^{\text{dB}/10} = 2\ \text{mW} \times 10^{-0.15} = 2 \times 0.708 = \mathbf{1.42\ mW}$$

Check: a loss, so less than 2 mW. About 71 % survives, not 75 %, because decibels are logarithmic.

```widget
decibel
{ "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5, "title": "E03 exercise 1: 2 mW into 5 km of −0.3 dB/km cable", "presets": { "E03 exercise 1": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5 }, "Half the power (slide)": { "p1": 2, "db": -3 } } }
```

## What SNR is, in plain words

Every channel adds **noise**: unwanted energy from heat, motors, nearby wires and lightning. What reaches the receiver is the signal plus the noise.

The **signal-to-noise ratio**, SNR, says how many times stronger the signal is than the noise. *SNR is the ratio of what is wanted (signal) to what is not wanted (noise).*

A high SNR means a clean signal. A low SNR means the noise is drowning it.

```diagram
{ "type": "flow", "title": "E03 exercise 2: the noise of ten devices adds up", "nodes": [
  { "id": "n", "label": "Noise", "sub": "10 × 2 μW = 20 μW" },
  { "id": "s", "label": "Signal", "sub": "200 mW = 200 000 μW" },
  { "id": "q", "label": "SNR", "sub": "200 000 ÷ 20 = 10 000" },
  { "id": "d", "label": "SNR in dB", "sub": "10 log₁₀ 10⁴ = 40 dB" }
], "edges": [ { "from": "n", "to": "q" }, { "from": "s", "to": "q" }, { "from": "q", "to": "d" } ], "hi": ["q", "d"], "caption": "Bring both powers to microwatts before dividing; 200 ÷ 20 without converting gives 10, the trap." }
```

## A tiny SNR case

A signal of 1 W arrives with 1 mW of noise. Write both in milliwatts first.

$$\text{SNR} = \frac{1000\ \text{mW}}{1\ \text{mW}} = \mathbf{1000}$$

The milliwatts cancel, so SNR has no unit. It is a plain number of times.

## The SNR formulas, with each symbol named

$$\text{SNR} = \frac{\text{average signal power}}{\text{average noise power}} \qquad \text{SNR}_{dB} = 10 \log_{10} \text{SNR}$$

- Both powers are averages, because they change with time. Both use the same prefix.
- $\text{SNR}_{dB}$ is the same ratio in decibels. Going back, $\text{SNR} = 10^{\text{SNR}_{dB}/10}$.

The trap is the prefix: mW over μW must be converted before dividing.

## The slide's example and E03 exercise 2, worked

*The average power of a signal is 10 mW and the average power of the noise is 1 μW; what are the values of SNR and SNR_dB?*

$$\text{SNR} = \frac{10\ \text{mW}}{1\ \mu\text{W}} = \frac{10\,000\ \mu\text{W}}{1\ \mu\text{W}} = \mathbf{10\,000}$$

$$\text{SNR}_{dB} = 10 \log_{10} 10^{4} = 10 \times 4 = \mathbf{40\ dB}$$

*A signal with 200 milliwatts of average power passes through 10 identical devices, each with an average noise of 2 microwatts.* The diagram above works it: the noises add to 20 μW.

$$\text{SNR} = \frac{200\,000\ \mu\text{W}}{20\ \mu\text{W}} = \mathbf{10\,000} \qquad \text{SNR}_{dB} = \mathbf{40\ dB}$$

Check: dividing by one device's 2 μW gives 100 000, which forgets that noise adds.

```widget
snr-noise
{ "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10, "title": "E03 exercise 2: 200 mW through 10 devices of 2 μW noise each", "presets": { "Slide: 10 mW and 1 μW": { "signal": 10, "signalUnit": "mW", "noise": 1, "noiseUnit": "μW", "sources": 1 }, "E03 exercise 2": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10 } } }
```

## Try it

```quiz
[
  {
    "q": "The Wi-Fi signal leaves the PC at 4 mW and arrives at the router at 50 μW. What is the change, in dB? (Two decimals, with the sign.)",
    "type": "numeric",
    "answer": -19.03,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "Formula: dB = 10 log₁₀(P₂/P₁).\nSubstitution: same prefix first, 4 mW = 4000 μW; 10 log₁₀(50 ÷ 4000) = 10 log₁₀ 0.0125 = 10 × (−1.903).\nAnswer: −19.03 dB.\nCheck: negative, so attenuated; 0.0125 lies between a tenth (−10 dB) and a hundredth (−20 dB)."
  },
  {
    "q": "8 mW enters a path whose total change is −4.5 dB. What power comes out, in mW? (Two decimals.)",
    "type": "numeric",
    "answer": 2.84,
    "tolerance": 0.01,
    "unit": "mW",
    "explain": "Formula: P₂ = P₁ × 10^(dB/10).\nSubstitution: 8 mW × 10^(−4.5/10) = 8 × 10^(−0.45) = 8 × 0.3548.\nAnswer: 2.84 mW.\nCheck: −3 dB would halve 8 mW to 4 mW and −6 dB would quarter it to 2 mW; −4.5 dB lands between."
  },
  {
    "q": "A cable of −2.5 dB is followed by an amplifier of +9 dB. What is the overall change, in dB? (One decimal.)",
    "type": "numeric",
    "answer": 6.5,
    "tolerance": 0,
    "unit": "dB",
    "explain": "Formula: decibels along a path add.\nSubstitution: −2.5 dB + 9 dB.\nAnswer: +6.5 dB.\nCheck: positive, so the signal leaves stronger than it entered."
  },
  {
    "q": "A 100 mW signal passes through 5 identical devices, each adding 4 μW of noise. What is the SNR in dB? (Two decimals.)",
    "type": "numeric",
    "answer": 36.99,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "Formula: SNR = signal ÷ total noise, then SNR_dB = 10 log₁₀ SNR.\nSubstitution: noise = 5 × 4 μW = 20 μW; 100 000 μW ÷ 20 μW = 5000; 10 log₁₀ 5000 = 10 × 3.699.\nAnswer: 36.99 dB.\nCheck: SNR 5000 sits between 1000 (30 dB) and 10 000 (40 dB)."
  },
  {
    "q": "True or false: an SNR of 10 000 has a unit of milliwatts, because both powers were measured in milliwatts.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: SNR = signal power ÷ noise power.\nSubstitution: mW ÷ mW, so the units cancel.\nAnswer: false; SNR is a plain ratio with no unit.\nCheck: in decibels the same ratio is written 40 dB, still not a power."
  }
]
```

## Remember

- Point 2 goes on top. A loss is negative, and decibels along a path add.
- Back to power with $P_2 = P_1 \times 10^{\text{dB}/10}$.
- SNR is a ratio with no unit. Convert both powers to one prefix, and add the noise of every device.
- *On the sheet:* Sheet side 2, "Decibel and SNR".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "attenuated", "loss", "dB/km", "power at the end" | dB = 10 log₁₀(P₂/P₁); P₂ = P₁ × 10^(dB/10) | dB or W | loss negative, gain positive |
| "signal power", "noise power" | SNR = P_signal ÷ P_noise; SNR_dB = 10 log₁₀ SNR | none, or dB | same prefix first |
