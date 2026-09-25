---
title: Wavelength & propagation speed
minutes: 9
---

Period measures a sine wave in time. Wavelength measures the same cycle in *distance*: how far the signal travels while completing it, which depends on the speed of the medium.

## Wavelength ($\lambda$)

Slide definition: *the distance a simple signal can travel in one period* (the distance that is travelled by a signal in one cycle).

- Usually used to describe the transmission of **light in an optical fibre**.
- Usually measured in **micrometres (μm)**, $1$ μm $= 10^{-6}$ m.

## Propagation speed

Slide wording: *wavelength binds the period or the frequency of a simple sine wave to the propagation speed of the medium.*

- The propagation speed of electromagnetic signals **depends on the medium** and on the frequency of the signal.
- In a **vacuum**, light propagates at $c = 3 \times 10^{8}$ m/s. That speed is **lower in air**, and **even lower in cable**.

## Frequency vs wavelength

From the slide:

- The **frequency** of a signal is **independent of the transmission medium**. It depends on the sender that generates the signal: a 60 Hz wave is 60 Hz in copper, fibre, or air.
- The **wavelength** relies on **both** the frequency **and** the transmission medium.

When a signal passes from air into a cable its propagation speed drops, so its wavelength shrinks; the frequency stays what the sender made it.

## The formula

$$\lambda = \frac{c}{f} = c \times T$$

where $c$ is the propagation speed. Both forms say the same thing: in one period $T$ the signal moves $c \times T$ metres, and $T = \frac{1}{f}$.

Units check: $\frac{\text{m/s}}{1/\text{s}} = \text{m}$. If your answer is not in metres, a unit went missing.

## Slide example: red light

*What is the wavelength of red light if its frequency is $4 \times 10^{14}$ Hz? Assume the propagation speed is $3 \times 10^{8}$ m/s.*

$$\lambda = \frac{c}{f} = \frac{3 \times 10^{8}}{4 \times 10^{14}} = 0.75 \times 10^{-6}\ \text{m} = 0.75\ \text{μm}$$

Divide the numbers, $\frac{3}{4} = 0.75$, and subtract the exponents, $10^{8 - 14} = 10^{-6}$. Since $10^{-6}$ m is a micrometre, $\lambda = 0.75$ μm, which is why fibre-optic wavelengths are quoted in μm.

## Practice values (beyond the slides)

Only the red-light row is on the slides.

| Frequency | Propagation speed | Wavelength |
|---|---|---|
| $4 \times 10^{14}$ Hz (red light) | $3 \times 10^{8}$ m/s | $0.75$ μm |
| 1 GHz | $3 \times 10^{8}$ m/s (vacuum) | $\frac{3 \times 10^{8}}{10^{9}} = 0.3$ m |
| 1 GHz | $2 \times 10^{8}$ m/s (cable) | $\frac{2 \times 10^{8}}{10^{9}} = 0.2$ m |
| 100 MHz | $3 \times 10^{8}$ m/s | $\frac{3 \times 10^{8}}{10^{8}} = 3$ m |
| 2.4 GHz (Wi-Fi) | $3 \times 10^{8}$ m/s | $\frac{3 \times 10^{8}}{2.4 \times 10^{9}} = 0.125$ m |

The two 1 GHz rows: same frequency, slower medium, shorter wavelength.

## Try it

```quiz
[
  {
    "q": "Light with a frequency of $6 \\times 10^{14}$ Hz travels in a vacuum at $3 \\times 10^{8}$ m/s. What is its wavelength in μm?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.005,
    "unit": "μm",
    "explain": "$\\lambda = c/f = \\frac{3 \\times 10^{8}}{6 \\times 10^{14}} = 0.5 \\times 10^{-6}$ m $= 0.5$ μm. Same steps as the red-light example: $3/6 = 0.5$ and $10^{8-14} = 10^{-6}$."
  },
  {
    "q": "A 1 MHz radio signal propagates at $3 \\times 10^{8}$ m/s. What is its wavelength in metres?",
    "type": "numeric",
    "answer": 300,
    "tolerance": 1,
    "unit": "m",
    "explain": "$\\lambda = \\frac{3 \\times 10^{8}}{1 \\times 10^{6}} = 3 \\times 10^{2} = 300$ m."
  },
  {
    "q": "A signal has a period of 1 μs and travels through a cable at $2 \\times 10^{8}$ m/s. What is its wavelength in metres?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 1,
    "unit": "m",
    "explain": "Use the other form of the formula: $\\lambda = c \\times T = 2 \\times 10^{8} \\times 10^{-6} = 200$ m. (The digital signals lesson uses the identical arithmetic for bit length.)"
  },
  {
    "q": "Infrared light used in fibre has a wavelength of 1.5 μm. In a vacuum ($3 \\times 10^{8}$ m/s), what is its frequency in Hz?",
    "type": "numeric",
    "answer": 200000000000000,
    "tolerance": 2000000000000,
    "unit": "Hz",
    "explain": "Rearrange $\\lambda = c/f$ to $f = c/\\lambda = \\frac{3 \\times 10^{8}}{1.5 \\times 10^{-6}} = 2 \\times 10^{14}$ Hz. Enter it as 200000000000000 or 2e14."
  },
  {
    "q": "When a signal moves from air into a cable, its frequency decreases because the propagation speed is lower.",
    "type": "tf",
    "answer": false,
    "explain": "Frequency is independent of the transmission medium. The lower speed shortens the **wavelength** ($\\lambda = c/f$ with a smaller $c$); the frequency is unchanged."
  },
  {
    "q": "Fill in the blank: wavelength is usually measured in ______.",
    "type": "text",
    "answer": ["micrometres", "micrometers", "micrometre", "micrometer", "μm", "um", "microns", "micron"],
    "explain": "Slide wording: usually measured in micrometres (μm), because it is usually used to describe light in an optical fibre, and the red-light example comes out to 0.75 μm."
  },
  {
    "q": "According to the slides, wavelength is usually used to describe...",
    "options": ["the transmission of light in an optical fibre", "the voltage of a battery", "the bit rate of a digital signal", "the phase of a sine wave"],
    "answer": 0,
    "explain": "Wavelength is usually used to describe the transmission of light in an optical fibre, which is why it is quoted in micrometres."
  },
  {
    "q": "Electromagnetic signals propagate faster in a cable than in a vacuum.",
    "type": "tf",
    "answer": false,
    "explain": "In a vacuum light propagates at $3 \\times 10^{8}$ m/s; the speed is lower in air and even lower in cable."
  },
  {
    "q": "Which formula gives the wavelength of a simple sine wave?",
    "options": ["$\\lambda = c / f$", "$\\lambda = f / c$", "$\\lambda = c \\times f$", "$\\lambda = 1 / f$"],
    "answer": 0,
    "explain": "$\\lambda = c/f = c \\times T$: the distance the signal travels ($c \\times$ time) during one period ($T = 1/f$). $1/f$ alone is the period, a time, not a distance."
  },
  {
    "q": "Wavelength depends on both the frequency of the signal and the transmission medium.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording exactly. Frequency is independent of the medium; wavelength relies on both frequency and medium (through the propagation speed $c$)."
  },
  {
    "q": "Fill in the blank: the wavelength is the distance a simple signal can travel in one ______.",
    "type": "text",
    "answer": ["period", "cycle", "period (cycle)"],
    "explain": "Definition: the distance a simple signal can travel in one period, i.e. the distance travelled in one cycle. Hence $\\lambda = c \\times T$."
  }
]
```
