---
title: Your one-page study note (Week 2)
minutes: 15
---

The Week 2 half of the quiz sheet: Lecture 02 facts, the parameter and unit tables, every formula, and the worked numbers from the slides and E02. For Quiz 2, put this beside the 01b/01c block of the Week 1 note. One A4 or letter page, single-sided, preferably hand-written, plus a calculator; copy it by hand, since writing it out is itself the best revision you will do.

## Lecture 02: Data and signals

- Exchanged: data; through the physical layer: signals. Application to data-link communication is logical; physical is physical.
- Analog data continuous (sound); digital data discrete (1s and 0s). Analog signal: many intensity levels; digital signal: limited defined values.
- Periodic (cycle, period T) vs nonperiodic. Data comm uses **periodic analog** and **nonperiodic digital** signals.
- Simple sine cannot be decomposed; composite = many sines (Fourier). Periodic composite: discrete frequencies (harmonics $f$, $3f$, $9f$; $f$ = fundamental = first harmonic). Nonperiodic composite: infinite sines, continuous frequencies (voice 0–4 kHz, AM/FM).
- Single sine wave carries no information (buzz). Time domain: amplitude vs time, phase hidden. Frequency domain: peak amplitude vs frequency; one sine = one spike.
- Frequency = rate of change: no change $f = 0$ (battery 1.5 V); instantaneous change $f = \infty$ ($T = 0$). Frequency independent of medium; wavelength depends on frequency and medium. $c = 3 \times 10^{8}$ m/s in vacuum, lower in air, lower in cable.
- Digital signals: mostly nonperiodic, so use bit rate (bps). Levels: binary 2, octal 8, hexadecimal 16. A digital signal is a composite analog signal with infinite bandwidth (periodic: discrete; nonperiodic: continuous).

| Parameter | Meaning | Unit |
|---|---|---|
| Peak amplitude $A$ | highest intensity; proportional to energy | V |
| Frequency $f$ | completed cycles in 1 s | Hz |
| Period $T$ | time for one cycle | s |
| Phase $\phi$ | position of waveform relative to time 0 | ° or rad |
| Wavelength $\lambda$ | distance travelled in one period (light in fibre) | μm |
| Bandwidth $B$ | highest minus lowest frequency | Hz |

| ms | μs | ns | ps | kHz | MHz | GHz | THz |
|---|---|---|---|---|---|---|---|
| $10^{-3}$ s | $10^{-6}$ s | $10^{-9}$ s | $10^{-12}$ s | $10^{3}$ Hz | $10^{6}$ Hz | $10^{9}$ Hz | $10^{12}$ Hz |

**Formulas**

$$T = \frac{1}{f} \qquad f = \frac{1}{T}$$

$$s(t) = A\sin(2\pi f t + \phi) = A\sin\left(\frac{2\pi}{T} t + \phi\right) \qquad \omega = 2\pi f$$

$$+\phi \text{ shifts left by } \phi/\omega \qquad -\phi \text{ shifts right by } \phi/\omega \qquad \phi = \text{fraction of cycle} \times 360°$$

$$360° = 2\pi \text{ rad} \qquad 1° = \frac{2\pi}{360} \text{ rad} \qquad 1 \text{ rad} = \frac{360}{2\pi}°$$

$$\lambda = \frac{c}{f} = c \cdot T$$

$$B = f_h - f_l \qquad \text{middle} = \frac{f_h + f_l}{2} \qquad f_h + f_l = 2 \times \text{middle}$$

$$\text{bit duration} = \frac{1}{\text{bit rate}} \qquad \text{bit length} = \text{propagation speed} \times \text{bit duration}$$

$$\text{bits per level} = ⌈\log_{2} L⌉ \qquad ⌈3.1416⌉ = 4, \; ⌊3.1416⌋ = 3$$

$$\text{bit rate} = \frac{\text{pages}}{\text{s}} \times \frac{\text{lines}}{\text{page}} \times \frac{\text{chars}}{\text{line}} \times \frac{\text{bits}}{\text{char}} \qquad \text{time} = \text{bits} \times \frac{\text{s}}{\text{bit}}$$

| Worked number | Result |
|---|---|
| 60 Hz mains, period | $1/60 = 0.0167$ s $= 16.7$ ms; peak $120\sqrt{2} \approx 170$ V |
| $T = 200$ μs | $f = 1/(200 \times 10^{-6}) = 5000$ Hz $= 5$ kHz |
| $5\sin(20\pi t)$ | $A = 5$ V, $f = 10$ Hz, $T = 0.1$ s |
| $\sin(10t)$ | $A = 1$ V, $f = 10/(2\pi) = 1.59$ Hz, $T = 0.628$ s |
| offset 1/9 cycle | $\phi = 40° = 2\pi/9 = 0.698$ rad |
| red light $4 \times 10^{14}$ Hz | $\lambda = 3 \times 10^{8} / 4 \times 10^{14} = 0.75$ μm |
| 1 Mbps at $2 \times 10^{8}$ m/s | bit duration 1 μs; bit length 200 m |
| 4 levels; 11 levels | 2 bits; $\log_{2} 11 = 3.46 \to 4$ bits |
| 100 pages/s, 24 × 80 × 8 | 1 536 000 bps $= 1.536$ Mbps (200 pages/s: 3.072 Mbps) |
| 1000 bps: 10 bits; 100 000 chars | 0.01 s; 800 s |
| $B = 200$ kHz, middle 140 kHz | $f_l = 40$ kHz, $f_h = 240$ kHz |
| $f_h = 400$ MHz, middle 300 MHz | $f_l = 200$ MHz, $B = 200$ MHz |
| 100, 400, 500, 750, 900 Hz | $B = 800$ Hz |

## From memory

Close the page and answer these; anything you miss goes on the sheet in larger writing.

```quiz
[
  {
    "q": "A sine wave has $f = 250$ Hz. What is its period, in ms?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.05,
    "unit": "ms",
    "explain": "$T = 1/f = 1/250 = 0.004$ s $= 4$ ms."
  },
  {
    "q": "Which formula gives the wavelength of a signal?",
    "options": ["$\\lambda = c / f$", "$\\lambda = c \\times f$", "$\\lambda = f / c$", "$\\lambda = 1 / f$"],
    "answer": 0,
    "explain": "$\\lambda = c/f = c \\cdot T$: the distance the signal travels in one period. $1/f$ is the period, not the wavelength."
  },
  {
    "q": "Fill in the blank: the bandwidth of a composite signal is the highest frequency minus the ________ frequency.",
    "type": "text",
    "answer": ["lowest", "lowest frequency", "minimum"],
    "explain": "$B = f_h - f_l$. Given the middle frequency instead, use $f_h + f_l = 2 \\times$ middle."
  },
  {
    "q": "A sine wave is offset 1/8 of a cycle from time 0. What is its phase in degrees?",
    "type": "numeric",
    "answer": 45,
    "tolerance": 0.5,
    "unit": "°",
    "explain": "$\\frac{1}{8} \\times 360° = 45°$, which is $\\pi/4 = 0.785$ rad."
  },
  {
    "q": "A digital signal uses 32 levels. How many bits per level?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.5,
    "unit": "bits",
    "explain": "$\\log_{2} 32 = 5$ exactly, so no rounding is needed. For a non-power of 2, round up with the ceiling."
  },
  {
    "q": "A signal has a bit rate of 10 Mbps and travels at $2 \\times 10^{8}$ m/s. What is the bit length, in metres?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.5,
    "unit": "m",
    "explain": "Bit duration $= 1/(10 \\times 10^{6}) = 0.1$ μs; bit length $= 2 \\times 10^{8} \\times 10^{-7} = 20$ m. Ten times the bit rate of the slide example, one tenth of its 200 m."
  },
  {
    "q": "In data communications we commonly use nonperiodic analog signals and periodic digital signals.",
    "type": "tf",
    "answer": false,
    "explain": "The other way round: periodic analog signals and nonperiodic digital signals."
  }
]
```
