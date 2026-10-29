---
title: "Review 2c: digital-to-analog: ASK, FSK, PSK, QAM, baud and constellations"
minutes: 15
---
This lesson teaches how bits ride on a sine wave, how many bits each wave element carries, and how wide a channel the result needs. It prepares you for questions like E05 exercise 4, which give a constellation and ask for bits and amplitudes.

## What digital-to-analog conversion is, in plain words

Some channels pass only a band of frequencies well above 0 Hz. Radio and Wi-Fi are like this, so bits cannot be sent as plain voltage steps.

The sender makes a steady sine wave at a high frequency, called the carrier. Slide wording: *The receiver is tuned to the frequency of the carrier signal.*

To send bits, the sender changes one thing about the carrier for each signal element. A signal element is one short stretch of the wave that the receiver reads as one symbol.

A sine wave has three things you can change. Its height is the amplitude, its speed is the frequency, and its starting point in the cycle is the phase.

```diagram
{ "type": "tree", "title": "Four ways to put bits on a carrier", "nodes": [
  { "id": "c", "label": "Carrier sine wave" },
  { "id": "a", "label": "ASK", "sub": "change the height", "parent": "c" },
  { "id": "f", "label": "FSK", "sub": "change the speed", "parent": "c" },
  { "id": "p", "label": "PSK", "sub": "change the start", "parent": "c" },
  { "id": "q", "label": "QAM", "sub": "height and start", "parent": "c" }
], "hi": ["q"], "caption": "ASK varies amplitude, FSK frequency, PSK phase. QAM varies amplitude and phase at once, the dominant method." }
```

ASK changes only the amplitude. FSK changes only the frequency, using one frequency for 0 and another for 1.

PSK changes only the phase. Slide wording: PSK is *less susceptible to noise than ASK* *because noise can change the amplitude easier than it can change the phase.*

QAM changes amplitude and phase together, on two carriers 90° apart. One is the in-phase carrier and the other the quadrature carrier.

A constellation diagram is a map of the kinds of signal element. Each kind is one dot, its distance from the centre is the amplitude, and its angle is the phase.

More dots mean more bits per element. Two dots carry one bit, four dots carry two, eight dots carry three.

```diagram
{ "type": "grid", "title": "Dots on the map and bits per element", "nodes": [
  { "id": "h0", "label": "Dots", "row": 0, "col": 0 },
  { "id": "h1", "label": "Bits per element", "row": 0, "col": 1 },
  { "id": "a0", "label": "2", "row": 1, "col": 0 },
  { "id": "a1", "label": "1", "row": 1, "col": 1 },
  { "id": "b0", "label": "4", "row": 2, "col": 0 },
  { "id": "b1", "label": "2", "row": 2, "col": 1 },
  { "id": "c0", "label": "8", "row": 3, "col": 0 },
  { "id": "c1", "label": "3", "row": 3, "col": 1 },
  { "id": "d0", "label": "16", "row": 4, "col": 0 },
  { "id": "d1", "label": "4", "row": 4, "col": 1 }
], "hi": ["c0", "c1"], "caption": "Each doubling of the dots adds one bit: 8 dots give 3 bits, because 2 × 2 × 2 = 8." }
```

## A tiny case you can do in your head

A constellation has 4 dots, and the line carries 8 bits each second. Four dots name 00, 01, 10 and 11:

$$ 2 \times 2 = 4 \quad \Rightarrow \quad \mathbf{2 \text{ bits per element}} $$

Each element carries 2 bits, so the line needs half as many elements as bits:

$$ 8 \div 2 = \mathbf{4 \text{ elements per second}} = 4 \text{ baud} $$

The baud is the unit of signal rate, one element per second. The answer makes sense: the baud rate is never more than the bit rate here.

## The formulas, with each symbol named

**Bits per element.** Slide wording: *A modulation with n constellation points transmits log₂ n bits per signal element.*

$$ r = \log_2 n \qquad S = \frac{N}{r} $$

- $n$ is the number of constellation points.
- $r$ is the bits per signal element.
- $N$ is the bit rate, in bps, and $S$ is the baud rate, in baud.

**Amplitude from the two carriers.** A dot sits at $I$ along the in-phase axis and $Q$ along the quadrature axis, both in volts:

$$ \text{amplitude}^2 = I^2 + Q^2 $$

**Bandwidth.** The slides' boxes: ASK and PSK have *r = 1, S = N, B = (1 + d)S*. QAM has *the same minimum required bandwidth as ASK and PSK*, with $S = N/r$:

$$ B = (1 + d) \times S \qquad B_{FSK} = (1 + d) \times S + 2\Delta f $$

- $B$ is the bandwidth, in Hz.
- $d$ is a factor the slides never define. The question gives it.
- $2\Delta f$ is the gap between FSK's two carrier frequencies, in Hz.

The trap is using the bit rate. Bandwidth comes from $S$, so divide by $r$ first.

## The slide's examples, worked

**8-QAM.** The slide's waveform prints *Bit rate: 24, Baud rate: 8*. Eight points carry $\log_2 8 = 3$ bits each:

$$ S = \frac{N}{r} = \frac{24 \text{ bps}}{3 \text{ bits}} = \mathbf{8 \text{ baud}} $$

Check: 8 elements × 3 bits = 24 bits each second.

**E05 exercise 4.** *If we have a constellation diagram with 16 constellation points, what is the number of bits per constellation point? Assume the amplitude for a constellation point is 5 volts while the amplitude of the in-phase carrier is 3 volts. What is the amplitude of the quadrature carrier?*

Step 1, bits per point:

$$ r = \log_2 16 = \mathbf{4 \text{ bits}} $$

Step 2, the quadrature amplitude:

$$ Q = \sqrt{5^2 - 3^2} = \sqrt{25 - 9} = \sqrt{16} = \mathbf{4 \text{ V}} $$

Check: $3^2 + 4^2 = 25 = 5^2$.

**ASK against FSK.** A case of our own, at the slide figure's 5 bps with $d = 1$ and $2\Delta f = 10$ Hz:

$$ B_{ASK} = (1 + 1) \times 5 = \mathbf{10 \text{ Hz}} $$

$$ B_{FSK} = (1 + 1) \times 5 + 10 = \mathbf{20 \text{ Hz}} $$

Check: FSK is wider by exactly $2\Delta f$. That is why the slide says BPSK has the *same bandwidth as BASK but less than BFSK*.

```widget
constellation
{ "solve": { "amplitude": 5, "i": 3, "points": 16 }, "title": "E05 exercise 4: 16 points, amplitude 5 V, I = 3 V" }
```

## Try it

The Wi-Fi items follow a script's death notice over the internet. The numbers are ours.

```quiz
[
  {
    "q": "1. On the Wi-Fi hop the notice is sent by 256-QAM at 48 Mbps. What is the baud rate, in Mbaud?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "Formula: r = log₂ n, S = N/r.\nSubstitution: r = log₂ 256 = 8 bits per signal element, S = 48 Mbps / 8 bits.\nAnswer: **6 Mbaud**.\nCheck: the baud rate is at most the bit rate, and 6 × 8 = 48."
  },
  {
    "q": "2. With d = 0.5, what bandwidth does the 256-QAM signal of item 1 need, in MHz?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "Formula: QAM has the same minimum bandwidth as ASK and PSK, B = (1 + d) × S.\nSubstitution: (1 + 0.5) × 6 Mbaud.\nAnswer: **9 MHz**.\nCheck: the bandwidth comes from the baud rate. Using 48 in place of 6 would give 72 MHz, the bit-rate trap."
  },
  {
    "q": "3. A router's modulation uses 64 constellation points. How many bits does each signal element carry?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Formula: r = log₂ n.\nSubstitution: r = log₂ 64.\nAnswer: **6 bits**.\nCheck: 2⁶ = 64, one pattern per point."
  },
  {
    "q": "4. A constellation point has an amplitude of 13 V, and its in-phase carrier has an amplitude of 5 V. What is the amplitude of the quadrature carrier, in volts?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "V",
    "explain": "Formula: amplitude² = I² + Q², so Q = √(amplitude² − I²).\nSubstitution: Q = √(13² − 5²) = √(169 − 25) = √144.\nAnswer: **12 V**.\nCheck: 5² + 12² = 25 + 144 = 169 = 13²."
  },
  {
    "q": "5. A BFSK link sends 2000 bps with d = 1, and its two carrier frequencies are 3000 Hz apart. What bandwidth does it need, in Hz?",
    "type": "numeric",
    "answer": 7000,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "Formula: BFSK has r = 1, S = N, B = (1 + d) × S + 2Δf.\nSubstitution: S = 2000 baud, B = (1 + 1) × 2000 Hz + 3000 Hz.\nAnswer: **7000 Hz**.\nCheck: ASK at the same rate needs 4000 Hz, and FSK adds exactly the 3000 Hz gap."
  },
  {
    "q": "6. PSK is less susceptible to noise than ASK, because noise can change the amplitude easier than it can change the phase.",
    "type": "tf",
    "answer": true,
    "explain": "Formula: none, this is the slide's reason in its own words.\nSubstitution: ASK keeps its bits in the amplitude, PSK in the phase.\nAnswer: **true**.\nCheck: the slide adds the cost, PSK needs more sophisticated hardware to tell the phases apart."
  }
]
```

## Remember

- Bits per element is $\log_2 n$ for $n$ points. Then $S = N/r$.
- Bandwidth uses the baud rate: $(1 + d)S$, plus $2\Delta f$ for FSK only.
- A point's amplitude is its distance from the centre: $\text{amplitude}^2 = I^2 + Q^2$.
- *On the sheet:* Sheet side 3, "D2A and A2A side by side" and "Constellation diagram".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "constellation points", "per signal element" | r = log₂ n, S = N/r | bits, baud | 2^r = n |
| "ASK", "PSK", "QAM" bandwidth | B = (1 + d) × S | Hz | B ≥ S |
| "FSK" bandwidth | B = (1 + d) × S + 2Δf | Hz | wider than ASK |
