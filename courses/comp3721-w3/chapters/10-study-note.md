---
title: Your one-page study note (Week 3)
minutes: 15
---

The Week 3 block of the quiz sheet: Lecture 03 facts in the slide's words, every formula, and the worked numbers from the slides and E03. One A4 or letter page, single-sided and preferably hand-written, plus a calculator.

## Lecture 03: transmission, impairment, data rate

- From now on: **nonperiodic digital signals**. Two approaches: **baseband** and **broadband (modulation)**.
- Baseband: digital signal sent **without changing** to analog. Needs a **low-pass channel** (lowest frequency zero, has an upper bound) and a dedicated medium, one channel. Example: wired LAN.
- Shape preserved only with **infinite or very wide bandwidth** (Fourier: a digital signal is a composite analog signal with infinite bandwidth). Coaxial, fiber optic: very good accuracy.
- Baseband: required bandwidth **proportional** to bit rate. Low-pass channels are **less common** in real life.
- Broadband: digital **changed to analog**. Needs a **bandpass channel** (between two frequency limits, does not start from zero), more available. Digital/analog converter at the sender, analog/digital at the receiver = **modem** (modulator/demodulator). Examples: telephone subscriber line 0 to 4 kHz, digital cellular phones.
- Impairment causes: **attenuation, distortion, noise**.
- Attenuation: loss of energy to overcome the resistance of the medium. Amplifier compensates. dB **negative** attenuated, **positive** amplified.
- Distortion: signal changes form or shape; composite signal; components arrive with **different phases**.
- SNR: wanted over not wanted. High SNR less corrupted. **Average** powers because they may change with time. Needed for the theoretical bit rate limit. Noiseless: SNR $= \infty$, $\text{SNR}_{dB} = \infty$.
- Data rate = bit rate = capacity. Three factors: **bandwidth, signal levels, quality of the channel (noise)**.
- Nyquist: noiseless, theoretical maximum. More levels may **reduce reliability**. Result not a power of 2: increase the levels or reduce the bit rate.
- Shannon: noisy, theoretical highest data rate. No $L$: no number of levels beats the capacity. SNR almost zero: capacity 0 regardless of bandwidth.
- **Shannon gives the upper limit; Nyquist tells how many signal levels.**
- Bandwidth in **hertz**: range of frequencies. Bandwidth in **bits per second**: bit rate. More Hz, more bps.
- Bandwidth-delay product: number of bits that can **fill the link**; bursts and acknowledgments; burst $= 2 \times$ product (full-duplex, two directions).
- Parallel: $n$ bits together on $n$ lines; advantage **speed**, disadvantage **cost**. Serial: one line, cost down by roughly $n$; parallel/serial and serial/parallel converters. USB = Universal Serial Bus.

| Noise | Definition |
|---|---|
| Thermal | random motion of electrons in a wire; extra signal not sent by the transmitter |
| Induced | motors and appliances (sending antenna); medium is the receiving antenna |
| Crosstalk | effect of one wire on the other |
| Impulse | spike, high energy in a very short time; power lines, lightning |

| USB 1.0 | USB 2.0 | 3.2 Gen 1 | 3.2 Gen 2 | 3.2 Gen 2x2 |
|---|---|---|---|---|
| 12 Mbps | 480 Mbps | 5 Gbps | 10 Gbps | 20 Gbps |

**Formulas**

$$\text{dB} = 10 \log_{10} \frac{P_2}{P_1} = 20 \log_{10} \frac{V_2}{V_1} \qquad P_2 = P_1 \times 10^{\text{dB}/10}$$

$$\text{cable dB} = \frac{\text{dB}}{\text{km}} \times \text{km} \qquad \text{decibels along a path add}$$

$$\text{SNR} = \frac{\text{average signal power}}{\text{average noise power}} \qquad \text{SNR from voltages} = \left(\frac{V_{signal}}{V_{noise}}\right)^{2}$$

$$\text{SNR}_{dB} = 10 \log_{10} \text{SNR} \qquad \text{SNR} = 10^{\text{SNR}_{dB}/10}$$

$$\text{BitRate} = 2 \times \text{bandwidth} \times \log_{2} L \qquad L = 2^{\text{BitRate}/(2 \times \text{bandwidth})}$$

$$\text{Capacity} = \text{bandwidth} \times \log_{2}(1 + \text{SNR})$$

$$\text{SNR for a capacity} = 2^{\text{Capacity}/\text{bandwidth}} - 1$$

$$\text{bits that fill the link} = \text{bandwidth} \times \text{delay}$$

$$\text{burst} = 2 \times \text{bandwidth} \times \text{delay}$$

$$\log_{2} x = \frac{\log x}{\log 2}$$

| Worked number | Result |
|---|---|
| power reduced to one-half | $10 \log_{10} 0.5 = 10(-0.3) = -3$ dB |
| 10 mW signal, 1 μW noise | $10000\ \text{μW} / 1\ \text{μW}$: SNR 10000, $\text{SNR}_{dB}$ 40 dB |
| 265 kbps over 30 kHz, noiseless | $\log_{2} L = 4.417$, $L = 21.36$: use 32 (300 kbps) or 16 (240 kbps) |
| 1 MHz, SNR 63 | $C = 10^{6} \log_{2} 64 = 6$ Mbps; Nyquist $\log_{2} L = 3$, $L = 8$ |
| SNR almost 0 | $C = B \log_{2} 1 = 0$ |
| 5 bps, 5 s | bandwidth × delay $= 25$ bits |
| E03-1: $-0.3$ dB/km, 5 km, 2 mW | $-1.5$ dB; $P_2 = 2 \times 10^{-0.15} = 1.42$ mW |
| E03-2: 200 mW, 10 devices × 2 μW | noise 20 μW; SNR 10000; 40 dB |

```quiz
[
  {
    "q": "Which formula is the Shannon capacity?",
    "options": ["$2 \\times \\text{bandwidth} \\times \\log_{2} L$", "$10 \\log_{10} \\text{SNR}$", "$2 \\times \\text{bandwidth} \\times \\text{delay}$", "$\\text{bandwidth} \\times \\log_{2}(1 + \\text{SNR})$"],
    "answer": 3,
    "explain": "Shannon: $\\text{bandwidth} \\times \\log_{2}(1 + \\text{SNR})$. The formula with $L$ is Nyquist, $10 \\log_{10} \\text{SNR}$ is $\\text{SNR}_{dB}$, and $2 \\times \\text{bandwidth} \\times \\text{delay}$ is the burst size."
  },
  {
    "q": "A signal's power goes from 4 mW to 40 mW. What is the change in dB?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{40}{4} = 10 \\log_{10} 10 = 10$ dB."
  },
  {
    "q": "A noiseless channel has a bandwidth of 2 MHz and the signal has 4 levels. What is the maximum bit rate, in Mbps?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.02,
    "unit": "Mbps",
    "explain": "$2 \\times 2 \\times 10^{6} \\times \\log_{2} 4 = 4 \\times 10^{6} \\times 2 = 8$ Mbps."
  },
  {
    "q": "A channel has a bandwidth of 10 kHz and an SNR of 7. What is its capacity, in kbps?",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "$10000 \\times \\log_{2}(1 + 7) = 10000 \\times 3 = 30000$ bps $= 30$ kbps."
  },
  {
    "q": "An $\\text{SNR}_{dB}$ of 20 dB is what SNR?",
    "type": "numeric",
    "answer": 100,
    "tolerance": 0.5,
    "explain": "$\\text{SNR} = 10^{20/10} = 10^{2} = 100$."
  },
  {
    "q": "Fill in the blank: broadband transmission requires a ________ channel.",
    "type": "text",
    "answer": ["bandpass", "band-pass", "band pass", "bandpass channel"],
    "explain": "Broadband: bandpass channel. Baseband: low-pass channel."
  },
  {
    "q": "A link has a bandwidth of 1 Mbps and a delay of 2 ms. How many bits can fill the link?",
    "type": "numeric",
    "answer": 2000,
    "tolerance": 1,
    "unit": "bits",
    "explain": "$10^{6} \\times 0.002 = 2000$ bits."
  },
  {
    "q": "Crosstalk noise is the effect of one wire on the other.",
    "type": "tf",
    "answer": true,
    "explain": "Slide definition: one wire acts as a sending antenna and the other as the receiving antenna. Motors and appliances cause **induced** noise."
  }
]
```
