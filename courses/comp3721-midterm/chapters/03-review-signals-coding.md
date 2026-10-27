---
title: "Review items 4 and 5: impairment, data rate limits, line coding"
minutes: 25
---

Review items 4 and 5 are Weeks 3 and 4: how a digital signal travels, what weakens it, the two limits on its data rate, and the line coding schemes with the three problems a waveform can show. Each point starts with a question to answer cold, then the facts in the slides' words, then the lesson that teaches it.

## 4a. Baseband needs a low-pass channel; broadband needs a bandpass channel

Recall first.

```quiz
[
  {
    "q": "Baseband transmission sends a digital signal without changing it to an analog signal. Which channel does it require?",
    "options": ["A low-pass channel", "A bandpass channel", "A channel with a carrier frequency", "A full-duplex channel"],
    "answer": 0,
    "explain": "Baseband requires a low-pass channel, one whose lowest frequency is zero, ideally with an infinite or very wide bandwidth. Broadband (modulation) changes the digital signal to an analog signal for a bandpass channel."
  },
  {
    "q": "Written response, on paper first: explain the difference between baseband and broadband transmission, with an example of each. Then type the channel that broadband transmission requires.",
    "type": "text",
    "answer": ["bandpass", "band-pass", "a bandpass channel", "bandpass channel"],
    "explain": "Model answer: Baseband transmission sends the digital signal over the channel without changing it to an analog signal, so it needs a low-pass channel (lowest frequency zero) with a very wide bandwidth; almost every wired LAN works this way. Broadband transmission (modulation) changes the digital signal to an analog signal first, so it can use a bandpass channel, whose bandwidth does not start from zero; a modem does the conversion, as for computer data over a telephone line. Low-pass channels are less common in real life, so broadband is used more widely."
  }
]
```

- Baseband: the digital signal is sent *without changing* it to an analog signal; it needs a low-pass channel (the lowest frequency contained in the channel is zero). Real-life example: a LAN.
- Boxed: *In baseband transmission, the required bandwidth is proportional to the bit rate; if we need to send bits faster, we need more bandwidth.* And: *Unfortunately, low-pass channels are less common in real life.*
- Broadband (modulation): the digital signal is changed to an analog signal; it needs a bandpass channel. The converter is a modem (modulator/demodulator).
- The slides ask two "why?" questions and print no answer. The answers taught in Week 3 are from memory of an earlier textbook edition and are unverified (an in-class answer replaces them): a 4 kHz telephone line is so narrow that baseband would give at most 8 kbps, so it is treated as bandpass; a cellular phone's wide band is shared by many calls, so one call's slice does not start at zero.

Lesson: [Baseband and broadband](#/comp3721-w3/baseband-broadband).

## 4b. Attenuation in decibels: negative for a loss, and decibels add along a path

Recall first.

```quiz
[
  {
    "q": "A signal's power falls to one quarter of its value. What is the change, in dB? (Two decimals, with the sign.)",
    "type": "numeric",
    "answer": -6.02,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$10 \\log_{10}(0.25 P_1 / P_1) = 10 \\log_{10} 0.25 = 10 \\times (-0.602) = -6.02$ dB. Twice the slide's half-power −3 dB."
  },
  {
    "q": "A cable loses 0.4 dB/km. A 5 mW signal enters 4 km of it. What power arrives, in mW? (Three decimals.)",
    "type": "numeric",
    "answer": 3.459,
    "tolerance": 0.002,
    "unit": "mW",
    "explain": "Loss $= -0.4 \\times 4 = -1.6$ dB. $-1.6 = 10 \\log_{10}(P_2/5)$, so $P_2/5 = 10^{-0.16} = 0.6918$ and $P_2 = 0.6918 \\times 5 = 3.459$ mW (E03 exercise 1's method)."
  },
  {
    "q": "A signal passes a −4 dB cable, a +9 dB amplifier and a −2 dB cable. What is the total change, in dB?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "dB",
    "explain": "Decibels add along a path: $-4 + 9 - 2 = +3$ dB, a net gain (about double the power)."
  }
]
```

- Attenuation: loss of energy to overcome the resistance of the medium; an amplifier compensates.
- The decibel *measures the relative strengths of two signals or one signal at two different points*: dB = 10 log₁₀(P₂/P₁) = 20 log₁₀(V₂/V₁); negative if attenuated, positive if amplified.
- Half the power: 10 log₁₀ 0.5 = −3 dB. A cable: dB = dB/km × km; then P₂ = P₁ × 10^(dB/10). E03: −0.3 × 5 = −1.5 dB, 2 mW → 1.42 mW.

```widget
decibel
{ "p1": 5, "p1Unit": "mW", "perKm": -0.4, "km": 4, "title": "5 mW into 4 km of −0.4 dB/km cable", "presets": { "4 km at −0.4 dB/km": { "p1": 5, "p1Unit": "mW", "perKm": -0.4, "km": 4 }, "E03 exercise 1 (5 km at −0.3 dB/km)": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5 }, "Half the power": { "p1": 5, "db": -3 } } }
```

Lesson: [Attenuation and the decibel](#/comp3721-w3/attenuation-decibel), [E03 worked](#/comp3721-w3/e03-worked).

## 4c. Distortion: the signal changes its form or shape

Recall first.

```quiz
[
  {
    "q": "Why does distortion occur in a composite signal?",
    "options": ["Its components arrive with phases different from what they had at the sender", "The medium's resistance absorbs some of its energy", "Electrons move randomly in the wire", "A spike of high energy arrives in a very short time"],
    "answer": 0,
    "explain": "Distortion: the signal changes its form or shape. In a composite signal of different frequencies, the components at the receiver have phases different from those at the sender. Energy lost to resistance is attenuation; random electrons and spikes are thermal and impulse noise."
  }
]
```

Three causes of impairment: attenuation, distortion, noise. Distortion happens to a composite signal, because each frequency component can be delayed differently and arrive out of phase.

Lesson: [Distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr).

## 4d. Four kinds of noise

Recall first.

```quiz
[
  {
    "q": "Match each kind of noise to its source.",
    "type": "match",
    "pairs": [
      ["Thermal", "random motion of electrons in a wire"],
      ["Induced", "motors and appliances acting as a sending antenna"],
      ["Crosstalk", "the effect of one wire on the other"],
      ["Impulse", "a spike from power lines, lightning, and so on"]
    ],
    "explain": "Thermal noise creates an extra signal not originally sent; induced noise comes from motors and appliances, with the medium as the receiving antenna; crosstalk is one wire acting as the sending antenna for another; impulse noise is a signal with high energy in a very short time."
  }
]
```

| Noise | The slide's definition |
|---|---|
| Thermal | *random motion of electrons in a wire, which creates an extra signal not originally sent by the transmitter* |
| Induced | from sources such as motors and appliances; these devices act as a sending antenna, the transmission medium as the receiving antenna |
| Crosstalk | *the effect of one wire on the other*; one wire acts as a sending antenna and the other as the receiving antenna |
| Impulse | a spike, *a signal with high energy in a very short time*, from power lines, lightning, and so on |

Lesson: [Distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr).

## 4e. SNR is a power ratio; noise from several devices adds first

Recall first.

```quiz
[
  {
    "q": "A 300 mW signal passes through 6 devices, each adding 2.5 μW of noise. What is the SNR (as a ratio)?",
    "type": "numeric",
    "answer": 20000,
    "tolerance": 0,
    "explain": "Noise from 6 devices $= 6 \\times 2.5 = 15$ μW. SNR = average signal power / average noise power $= 300$ mW / 15 μW $= 300\\,000$ μW / 15 μW $= 20\\,000$. Convert to one unit before dividing."
  },
  {
    "q": "The same signal: what is the SNR in dB? (Two decimals.)",
    "type": "numeric",
    "answer": 43.01,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 10 \\log_{10} 20\\,000 = 10 \\times 4.301 = 43.01$ dB."
  }
]
```

- SNR = average signal power / average noise power. Boxed: *SNR is the ratio of what is wanted (signal) to what is not wanted (noise).*
- SNR_dB = 10 log₁₀ SNR; back again, SNR = 10^(SNR_dB/10). A noiseless channel has SNR = ∞.
- Slide example: 10 mW and 1 μW → 10 000 → 40 dB. E03: 10 × 2 μW = 20 μW of noise, 200 mW / 20 μW = 10 000 → 40 dB.

```widget
snr-noise
{ "signal": 300, "signalUnit": "mW", "noise": 2.5, "noiseUnit": "μW", "sources": 6, "title": "300 mW through 6 devices of 2.5 μW noise each", "presets": { "6 devices of 2.5 μW": { "signal": 300, "signalUnit": "mW", "noise": 2.5, "noiseUnit": "μW", "sources": 6 }, "E03 exercise 2 (10 devices of 2 μW)": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10 } } }
```

Lesson: [Distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr), [E03 worked](#/comp3721-w3/e03-worked).

## 4f. Nyquist has the factor of 2 and a noiseless channel; Shannon has no 2 and a noisy one

Recall first.

```quiz
[
  {
    "q": "A noisy 4 kHz channel has an SNR of 30 dB. What is its Shannon capacity, in kbps? (Two decimals.)",
    "type": "numeric",
    "answer": 39.87,
    "tolerance": 0.01,
    "unit": "kbps",
    "explain": "Shannon takes SNR as a ratio: $10^{30/10} = 1000$. $C = B \\log_2(1 + \\text{SNR}) = 4000 \\times \\log_2 1001 = 4000 \\times 9.967 = 39\\,869$ bps $\\approx 39.87$ kbps. No factor of 2. Putting 30 into the formula instead of 1000 gives the wrong 19.8 kbps."
  },
  {
    "q": "We need 180 kbps over a noiseless 20 kHz channel. How many signal levels does Nyquist give? (Two decimals.)",
    "type": "numeric",
    "answer": 22.63,
    "tolerance": 0.01,
    "unit": "levels",
    "explain": "$180\\,000 = 2 \\times 20\\,000 \\times \\log_2 L$, so $\\log_2 L = 4.5$ and $L = 2^{4.5} = 22.63$ levels."
  },
  {
    "q": "22.63 levels is not a power of 2. What does the slide say to do?",
    "options": ["Increase the number of levels or reduce the bit rate", "Round L to 23 levels and keep 180 kbps", "Double the bandwidth in the Shannon formula", "Raise the SNR until the levels become a power of 2"],
    "answer": 0,
    "explain": "Example 1's rule: increase the number of levels or reduce the bit rate. 32 levels give $2 \\times 20 \\times 5 = 200$ kbps; 16 levels give $2 \\times 20 \\times 4 = 160$ kbps."
  },
  {
    "q": "A 2 MHz channel has an SNR of 255. Shannon gives the upper limit; how many levels does Nyquist then need to reach it?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0,
    "unit": "levels",
    "explain": "$C = 2 \\times 10^6 \\times \\log_2 256 = 2 \\times 8 = 16$ Mbps. Then $16 \\times 10^6 = 2 \\times 2 \\times 10^6 \\times \\log_2 L$, so $\\log_2 L = 4$ and $L = 16$ (Example 2's method)."
  }
]
```

| | Nyquist bit rate | Shannon capacity |
|---|---|---|
| Channel | noiseless | noisy (*In reality, we cannot have a noiseless channel; the channel is always noisy.*) |
| Formula | BitRate = **2** × bandwidth × log₂ L | Capacity = bandwidth × log₂(1 + SNR), no 2 |
| Input | L, the number of signal levels | SNR as a ratio, never dB |
| Tells you | how many signal levels we need | the upper limit |
| Slide example | 265 kbps over 30 kHz → L = 21.36 | 1 MHz, SNR 63 → 6 Mbps, then L = 8 |

Boxed: *The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need.* And: *No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel.* *Increasing the levels of a signal may reduce the reliability of the system.* The textbook's reason: more levels burden the receiver, which must tell them apart.

```widget
data-rate
{ "bandwidth": 4, "unit": "kHz", "snr": 1000, "levels": 2, "title": "Shannon and Nyquist on one channel", "presets": { "4 kHz, 30 dB (SNR 1000)": { "bandwidth": 4, "unit": "kHz", "snr": 1000, "levels": 2 }, "2 MHz, SNR 255": { "bandwidth": 2, "unit": "MHz", "snr": 255, "levels": 16 }, "Noiseless 20 kHz, want 180 kbps": { "show": "nyquist", "bandwidth": 20, "unit": "kHz", "levels": 2, "target": 180, "targetUnit": "kbps" } } }
```

Lesson: [Nyquist](#/comp3721-w3/nyquist), [Shannon](#/comp3721-w3/shannon).

## 5a. Line coding: data elements, signal elements, r, and S = c × N × 1/r

Recall first.

```quiz
[
  {
    "q": "Manchester (r = 1/2) carries 2 Mbps. In the average case (c = 1/2), what is the signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "$S = c \\times N \\times 1/r = \\frac{1}{2} \\times 2\\,\\text{Mbps} \\times 2 = 2$ Mbaud. With r = 1/2 each bit needs two signal elements, so S = N at c = 1/2. The bandwidth B = c × N × 1/r is then 2 MHz."
  },
  {
    "q": "A channel has a bandwidth of 50 kHz and the signal uses 8 levels. What is N_max, in kbps?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "$N_{max} = \\frac{1}{c} \\times B \\times r$ with c = 1/2 and r = log₂ 8 = 3: $2 \\times 50 \\times 3 = 300$ kbps, the same as Nyquist's $2 \\times B \\times \\log_2 L$."
  },
  {
    "q": "A signal has a bit rate of 12 000 bps and a baud rate of 2000 baud, with c = 1 and each signal element one level. How many levels does it use?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0,
    "unit": "levels",
    "explain": "$r = N/S = 12\\,000 / 2000 = 6$ data elements per signal element. $r = \\log_2 L$, so $L = 2^6 = 64$ levels (E04 exercise 2's method, which gave 8 bits per baud and 256 levels)."
  },
  {
    "q": "The receiver clock is 0.3 percent faster than the sender clock at 2 Mbps. How many extra bits per second does it receive?",
    "type": "numeric",
    "answer": 6000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Extra bits = N × p% $= 2\\,000\\,000 \\times 0.003 = 6000$ extra bps; it reads 2 006 000 bits in each second."
  }
]
```

- Line coding: *The process of converting digital data to digital signal.*
- Data element (bit): the smallest entity that can represent a piece of information. Signal element: the shortest unit (timewise) of a digital signal. Boxed: *Data elements are what we need to send (logically). Signal elements are what we can send (physically).*
- r: the number of data elements carried by each signal element.
- S = c × N × 1/r in baud; B = c × N × 1/r in Hz; N_max = 1/c × B × r = 2 × B × log₂ L. Boxed: *The baud rate, not the bit rate, determines the required bandwidth for a digital signal.*
- Slide example: 100 kbps, r = 1, c = 1/2 → 50 kbaud. Clock drift: 0.1% faster at 1 kbps → 1 extra bps, at 1 Mbps → 1000 extra bps.

```widget
signal-rate
{ "show": "signal", "N": 2, "unit": "Mbps", "r": "1/2", "c": "1/2", "title": "S = c × N × 1/r", "presets": { "Manchester at 2 Mbps": { "show": "signal", "N": 2, "unit": "Mbps", "r": "1/2", "c": "1/2" }, "Slide example (100 kbps, r = 1)": { "show": "signal", "N": 100, "unit": "kbps", "r": "1", "c": "1/2" }, "N max: 50 kHz, 8 levels": { "show": "nyquist", "B": 50, "bUnit": "kHz", "c": "1/2", "levels": 8 } } }
```

Lesson: [Line coding and its elements](#/comp3721-w4/line-coding-elements), [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate), [digital bandwidth](#/comp3721-w4/digital-bandwidth), [self-synchronization](#/comp3721-w4/self-synchronization).

## 5b. The six schemes' characteristics, as a matrix to fill

You do not need to memorize how each scheme encodes, but you do need its family, its r and the three problems. Fill both matrices from memory, in lowercase.

```quiz
[
  {
    "q": "Family (unipolar, polar or bipolar) and r (1 or 1/2) for each scheme.",
    "type": "fill",
    "code": "scheme                    family     r\nunipolar NRZ              ___        ___\nNRZ-L                     ___        ___\nNRZ-I                     ___        ___\nManchester                ___        ___\ndifferential Manchester   ___        ___\nAMI                       ___        ___",
    "answer": ["unipolar", "1", "polar", "1", "polar", "1", "polar", "1/2", "polar", "1/2", "bipolar", "1"],
    "explain": "Unipolar: NRZ. Polar: NRZ-L, NRZ-I, RZ and the biphase pair, Manchester and differential Manchester. Bipolar: AMI. The NRZ schemes and AMI send one signal element per bit (r = 1); the Manchester schemes split every bit into two (r = 1/2), which is why their signal rate is higher."
  },
  {
    "q": "For each scheme, type yes or no: does it have self-synchronization; can baseline wandering occur; does it have a DC component?",
    "type": "fill",
    "code": "scheme                    self-sync   baseline wandering   DC component\nunipolar NRZ              ___         ___                  ___\nNRZ-L                     ___         ___                  ___\nNRZ-I                     ___         ___                  ___\nManchester                ___         ___                  ___\ndifferential Manchester   ___         ___                  ___\nAMI                       ___         ___                  ___",
    "answer": ["no", "yes", "yes", "no", "yes", "yes", "no", "yes", "yes", "yes", "no", "no", "yes", "no", "no", "no", "no", "no"],
    "explain": "The slides list the polar NRZ problems: DC components, baseline wandering and no self-synchronization, all from a long sequence of 0s or 1s. Manchester and differential Manchester have self-synchronization (the transition at the middle of the bit), no baseline wandering and no DC component. Unipolar NRZ and AMI are derived from their rules: unipolar has every level on one side, so a DC component and the NRZ problems; AMI's 1s alternate, so no DC and no wandering, but a long run of 0s has no transition, so no self-synchronization."
  }
]
```

| Scheme | Family | r | Self-synchronization | Baseline wandering | DC component |
|---|---|---|---|---|---|
| Unipolar NRZ | unipolar | 1 | no (derived) | yes (derived) | yes (derived) |
| NRZ-L | polar | 1 | no | yes | yes |
| NRZ-I | polar | 1 | no (04a: only a run of 0s) | yes | yes |
| Manchester | polar, biphase | 1/2 | yes | no | no |
| Differential Manchester | polar, biphase | 1/2 | yes | no | no |
| AMI | bipolar | 1 | no in a run of 0s (derived) | no (derived) | no (derived) |

The Manchester schemes' drawback: a signal rate higher than other polar schemes such as NRZ-L.

Lesson: [The six schemes side by side](#/comp3721-w4/bipolar-ami), [Manchester](#/comp3721-w4/manchester).

## 5c. Detecting the three problems in a waveform

Each signal below is written as one level per bit (+, −, 0). For each, decide which problems can occur, and why, before you check.

```quiz
[
  {
    "q": "NRZ-I, bits 1 0 0 0 0 0 0 0 0 1, level before the first bit positive: `− − − − − − − − − +`. Which problems does this waveform show? Select all that apply.",
    "options": ["Baseline wandering", "Loss of synchronization (no transition to reset the receiver's clock)", "A DC component"],
    "answer": [0, 1, 2],
    "explain": "NRZ-I inverts only for a 1, so the eight 0s hold one negative level: no transition for eight bit durations, so the clocks can drift apart; the running average drifts toward the held level (baseline wandering); and a fixed voltage level makes a DC component. This is why 04a says NRZ-I does nothing for consecutive 0s."
  },
  {
    "q": "NRZ-L, bits 0 1 1 1 1 1 1 1 1 0 (positive for 0, negative for 1): `+ − − − − − − − − +`. Which problems does this waveform show? Select all that apply.",
    "options": ["Baseline wandering", "Loss of synchronization (no transition to reset the receiver's clock)", "A DC component"],
    "answer": [0, 1, 2],
    "explain": "NRZ-L reads the level, so a long run of 1s holds the negative level for eight bits: no transitions (synchronization lost), the baseline drifts toward the held level, and the mean amplitude moves away from zero (DC component). All three polar NRZ problems come from a long sequence of 0s or 1s."
  },
  {
    "q": "AMI, bits 1 0 0 0 0 0 0 0 0 1: `+ 0 0 0 0 0 0 0 0 −`. Which problems does this waveform show? Select all that apply.",
    "options": ["Baseline wandering", "Loss of synchronization (no transition to reset the receiver's clock)", "A DC component"],
    "answer": [1],
    "explain": "AMI holds 0 V for every 0, so a long run of 0s has no transition and synchronization can be lost. The 1s alternate + and −, so the average stays near zero: no DC component and no baseline wandering (derived from the rule; the slides state properties only for polar NRZ and Manchester)."
  },
  {
    "q": "Written response, on paper first: how do you detect baseline wandering in a waveform? Then type the property of the received signal the baseline is (two words).",
    "type": "text",
    "answer": ["running average", "a running average", "the running average"],
    "explain": "Model answer: The receiver calculates a running average of the received signal power, called the baseline, and judges each element against it. Look for a long string of 0s or 1s that holds one level, as in NRZ-L or in NRZ-I with a run of 0s: the running average drifts toward that level, which is baseline wandering. A scheme with a transition in the middle of every bit, such as Manchester, keeps the average on the axis."
  }
]
```

- Baseline: *the receiver calculates a running average of the received signal power. This average is called the baseline.* Baseline wandering: a drift in the baseline caused by a long string of 0s or 1s.
- Self-synchronization: the signal includes timing information, transitions that alert the receiver to the beginning, middle, or end of the pulse.
- DC component (bias): *The mean amplitude of the waveform.* Zero mean: DC balanced.

```widget
line-code
{ "bits": "1000000001", "schemes": ["nrz-l", "nrz-i", "ami", "manchester"], "scheme": "nrz-i", "compare": true, "title": "One run of 0s under four schemes: where are the transitions?" }
```

```widget
baseline-dc
{ "bits": "0111111110", "scheme": "nrz-l", "schemes": ["nrz-l", "nrz-i", "ami", "manchester"] }
```

Lesson: [Baseline wandering and DC components](#/comp3721-w4/baseline-dc), [self-synchronization](#/comp3721-w4/self-synchronization).

## 5d. Unipolar, polar and bipolar: the levels and the techniques in each

Recall first.

```quiz
[
  {
    "q": "Which techniques are polar schemes? Select all that apply.",
    "options": ["NRZ-L", "NRZ-I", "RZ", "Manchester", "Differential Manchester", "AMI", "Unipolar NRZ"],
    "answer": [0, 1, 2, 3, 4],
    "explain": "Polar: NRZ (NRZ-L and NRZ-I), RZ, and biphase (Manchester and differential Manchester). Unipolar has only NRZ; bipolar is AMI. RZ is named in the tree but has no slide of its own."
  },
  {
    "q": "A signal uses three voltage levels: positive, negative and zero, with one bit value at zero and the other alternating. Which family is it?",
    "type": "text",
    "answer": ["bipolar", "bipolar (AMI)", "multilevel binary"],
    "explain": "Bipolar (multilevel binary): three levels, one data element at zero, the other alternating between positive and negative. AMI is its scheme: 0 at zero voltage, 1 alternating."
  }
]
```

| Family | Levels | Techniques |
|---|---|---|
| Unipolar | all on one side of the time axis | NRZ |
| Polar | both sides of the time axis | NRZ-L, NRZ-I, RZ, Manchester, differential Manchester |
| Bipolar | positive, negative and zero | AMI |

Polarity follows the slides: NRZ-L is positive for 0 and negative for 1 (slide 55, and the E04 figure agrees); Manchester's 0 is high-to-low (slide 57). The 04a note draws both the other way.

```widget
line-code
{ "bits": "10011100100", "schemes": ["nrz-l", "ami"], "scheme": "nrz-l", "draw": true, "title": "Draw NRZ-L, then AMI, for the same bits" }
```

Lesson: [Unipolar and polar NRZ](#/comp3721-w4/unipolar-polar-nrz), [bipolar AMI](#/comp3721-w4/bipolar-ami), [encoding practice](#/comp3721-w4/encoding-practice).
