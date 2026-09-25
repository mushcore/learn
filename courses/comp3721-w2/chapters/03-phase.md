---
title: Phase & the sine equation
minutes: 14
---

Amplitude says how tall the wave is and frequency how fast it repeats; the third parameter, **phase**, says where the wave *starts*. With all three, the wave can be written as an equation.

## Phase ($\phi$)

Slide definition: *the position of the waveform relative to time 0 (it indicates the status of the first cycle). Measured in degrees or radians.*

Phase is an angle, not a voltage or a time: one full cycle of a sine wave is one trip around a circle.

## Degrees and radians

From the "More about Phase" slide:

- $360° = 2\pi$ rad
- $1° = \frac{2\pi}{360}$ rad
- $1$ rad $= \frac{360}{2\pi}$ degrees, about $57.3°$
- A shift of a complete cycle is a phase shift of $360°$.

The A02 handout marks one cycle from $0°$ to $360°$ and from $0$ to $2\pi$ rad:

| Fraction of a cycle | Degrees | Radians |
|---|---|---|
| 0 | $0°$ | $0$ |
| $\frac{1}{4}$ | $90°$ | $\frac{\pi}{2}$ |
| $\frac{1}{2}$ | $180°$ | $\pi$ |
| $\frac{3}{4}$ | $270°$ | $\frac{3\pi}{2}$ |
| 1 | $360°$ | $2\pi$ |

A quarter cycle is $90°$; on the unit circle that is the point straight up, $(0, 1)$, where a sine wave is at its peak.

## The equation of a sine wave

The slide writes a sine wave as

$$s(t) = A \sin(2\pi f t) = A \sin\left(\frac{2\pi}{T} t\right)$$

and labels its four parts:

| Symbol | Name |
|---|---|
| $s(t)$ | instantaneous amplitude (the value at time $t$) |
| $A$ | peak amplitude |
| $f$ | frequency |
| $T$ | period |

The two forms are the same equation because $f = \frac{1}{T}$. **Whatever multiplies $t$ inside the sine is $2\pi f$**; divide it by $2\pi$ to get the frequency.

### Slide example: read the parameters off the equation

*Find the peak amplitude, frequency, and period of (a) $s(t) = 5\sin(20\pi t)$ and (b) $s(t) = \sin(10t)$.*

**(a)** The number in front is the peak amplitude: $A = 5$ V. Inside, $2\pi f = 20\pi$, so $f = \frac{20\pi}{2\pi} = 10$ Hz. Then $T = \frac{1}{f} = \frac{1}{10} = 0.1$ s.

**(b)** Nothing written in front means $A = 1$ V. Inside, $2\pi f = 10$, so $f = \frac{10}{2\pi} = 1.59$ Hz. Then $T = \frac{1}{1.59} = 0.628$ s.

:::warn The π is the trap
In (a) the $\pi$ cancels. In (b) there is no $\pi$ inside the sine, so divide by the full $2\pi = 6.283$: $10 / 6.283 = 1.59$ Hz, not 5 Hz.
:::

## Writing the phase into the equation

The slide replaces $2\pi f$ with the single symbol $\omega$ (omega):

$$\omega = 2\pi f \qquad s(t) = A\sin(\omega t)$$

In that equation the phase is zero. Adding or subtracting a non-zero $\phi$ makes the phase non-zero:

$$s(t) = A\sin(\omega t \pm \phi)$$

## Which way does it shift?

The "Horizontal Shifting" slide draws both cases:

- $A\sin(\omega t - \phi)$: the wave shifts to the **right** by $\frac{\phi}{\omega}$.
- $A\sin(\omega t + \phi)$: the wave shifts to the **left** by $\frac{\phi}{\omega}$.

The wave crosses zero going up where the inside of the sine is zero: at $t = +\frac{\phi}{\omega}$ for $\omega t - \phi$ (shifted right) and at $t = -\frac{\phi}{\omega}$ for $\omega t + \phi$ (shifted left). The shift is a *time*, $\phi/\omega$ seconds; $\phi$ itself is an angle.

## Example 1 (slide): same $A$ and $f$, three phases

Three sine waves with the same amplitude and frequency but different phases:

- $s(t) = \sin(\omega t)$: phase $0°$. Starts at zero, rising.
- $s(t) = \sin(\omega t + 90°)$: phase $90°$. **Starts at its peak.** Shifted $\frac{1}{4}T$ to the left, so the climb to the peak has already happened at time 0.
- $s(t) = \sin(\omega t + 180°)$: phase $180°$. Starts at zero but **falling**. Shifted $\frac{1}{2}T$ to the left, half a cycle.

A $270°$ phase starts at the trough.

```widget
sine-wave
{ "A": 1, "f": 2, "phase": 0, "title": "Same A and f, different phase", "presets": { "sin(ωt), 0°": [1, 2, 0], "sin(ωt + 90°)": [1, 2, 90], "sin(ωt + 180°)": [1, 2, 180], "(a) 5 sin(20πt)": [5, 10, 0], "(b) sin(10t), f = 1.59 Hz": [1, 1.59, 0] } }
```

## Example 2 (slide): a fraction of a cycle to a phase

*A sine wave is offset $\frac{1}{9}$ cycle with respect to time 0. What is its phase in degrees and radians?*

$$\phi = \frac{1}{9} \times 360° = 40°$$

Convert to radians with $1° = \frac{2\pi}{360}$ rad:

$$\phi = 40° \times \frac{2\pi}{360°}\ \text{rad} = \frac{2\pi}{9}\ \text{rad} = 0.698\ \text{rad}$$

The general recipe: **phase in degrees = fraction of a cycle × 360°** and **phase in radians = fraction of a cycle × 2π**.

## Try it

```quiz
[
  {
    "q": "$s(t) = 3\\sin(50\\pi t)$. What is the peak amplitude in volts?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "The number in front of the sine is the peak amplitude: $A = 3$ V."
  },
  {
    "q": "$s(t) = 3\\sin(50\\pi t)$. What is the frequency in Hz?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0.1,
    "unit": "Hz",
    "explain": "Inside the sine, $2\\pi f = 50\\pi$, so $f = 50\\pi / 2\\pi = 25$ Hz."
  },
  {
    "q": "$s(t) = 3\\sin(50\\pi t)$. What is the period in seconds?",
    "type": "numeric",
    "answer": 0.04,
    "tolerance": 0.0005,
    "unit": "s",
    "explain": "$T = 1/f = 1/25 = 0.04$ s."
  },
  {
    "q": "$s(t) = \\sin(4t)$. What is the frequency in Hz? (3 decimals)",
    "type": "numeric",
    "answer": 0.637,
    "tolerance": 0.005,
    "unit": "Hz",
    "explain": "No $\\pi$ inside, so divide by the full $2\\pi$: $f = 4/(2\\pi) = 4/6.283 = 0.637$ Hz. This is the slide's example (b) pattern: $\\sin(10t)$ gave $10/(2\\pi) = 1.59$ Hz."
  },
  {
    "q": "A sine wave is offset $\\frac{1}{6}$ of a cycle from time 0. What is its phase in degrees?",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0.5,
    "unit": "°",
    "explain": "$\\phi = \\frac{1}{6} \\times 360° = 60°$."
  },
  {
    "q": "Same wave, offset $\\frac{1}{6}$ of a cycle. What is its phase in radians? (3 decimals)",
    "type": "numeric",
    "answer": 1.047,
    "tolerance": 0.005,
    "unit": "rad",
    "explain": "$\\phi = \\frac{1}{6} \\times 2\\pi = \\frac{\\pi}{3} = 1.047$ rad. Or convert the degrees: $60° \\times \\frac{2\\pi}{360°} = 1.047$ rad."
  },
  {
    "q": "A sine wave starts at its peak, i.e. it is offset $\\frac{1}{4}$ cycle. What is its phase in radians? (3 decimals)",
    "type": "numeric",
    "answer": 1.571,
    "tolerance": 0.005,
    "unit": "rad",
    "explain": "$\\frac{1}{4} \\times 360° = 90° = \\frac{\\pi}{2} = 1.571$ rad. That is $\\sin(\\omega t + 90°)$ from Example 1, the wave that starts at its peak."
  },
  {
    "q": "Slide Example 2: a wave offset $\\frac{1}{9}$ cycle has a phase of how many degrees?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.5,
    "unit": "°",
    "explain": "$\\frac{1}{9} \\times 360° = 40°$, which is $2\\pi/9 = 0.698$ rad."
  },
  {
    "q": "$A\\sin(\\omega t + \\phi)$ is the wave $A\\sin(\\omega t)$ shifted to the right by $\\phi/\\omega$.",
    "type": "tf",
    "answer": false,
    "explain": "A **plus** inside shifts the wave to the **left** by $\\phi/\\omega$; $A\\sin(\\omega t - \\phi)$ shifts it to the right. The zero crossing moves to $t = -\\phi/\\omega$ for the plus case."
  },
  {
    "q": "Fill in the blank: $2\\pi$ radians equals ______ degrees.",
    "type": "text",
    "answer": ["360", "360°", "360 degrees"],
    "explain": "$360° = 2\\pi$ rad is the conversion the slides give; a shift of a complete cycle is a phase shift of $360°$."
  },
  {
    "q": "At time 0, the wave $\\sin(\\omega t + 90°)$ is...",
    "options": ["at zero and rising", "at its peak", "at zero and falling", "at its trough"],
    "answer": 1,
    "explain": "A $90°$ phase is a quarter-cycle head start, so the wave starts at its peak. $0°$ starts at zero rising; $180°$ starts at zero falling; $270°$ would start at the trough."
  },
  {
    "q": "Fill in the blank: in $s(t) = A\\sin(\\omega t)$, the symbol $\\omega$ stands for $2\\pi$ times the ______.",
    "type": "text",
    "answer": ["frequency", "f"],
    "explain": "$\\omega = 2\\pi f$. Replacing $2\\pi f$ with $\\omega$ is just shorthand; the phase in $A\\sin(\\omega t)$ is zero."
  },
  {
    "q": "Phase is measured in volts.",
    "type": "tf",
    "answer": false,
    "explain": "Phase is an angle, measured in degrees or radians. Peak amplitude is the parameter measured in volts."
  }
]
```
