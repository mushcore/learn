---
title: Sine wave: amplitude, frequency, period
minutes: 14
---

The slides call the sine wave *the most fundamental form of a periodic analog signal*. Three parameters represent it completely:

1. **Peak amplitude ($A$)**: the value of its highest intensity.
2. **Frequency ($f$)**: the number of completed cycles (periods) in 1 s.
3. **Phase ($\phi$)**: the position of the waveform relative to time 0.

## Peak amplitude ($A$)

Slide definition: *the absolute value of the signal's highest intensity, proportional to the energy it carries. Measured in volts.*

Two slide examples:

- The electrical voltage in Canadian homes is periodic with a peak value of about $120\sqrt{2} \approx 170$ V. Its frequency is 60 Hz.
- The voltage of a battery is constant, for example 1.5 V. A constant signal is **periodic with a frequency of 0**.

:::tip Where 120√2 comes from (beyond the slides)
The 120 V on the label is the RMS value; a sine wave's peak is $\sqrt{2}$ times its RMS value.
:::

## Frequency ($f$) and period ($T$)

- **Frequency**: the number of cycles in 1 second (the rate at which the signal repeats). Measured in **hertz (Hz) = cycles per second**.
- **Period**: the time one cycle takes, in seconds.

The slide figures: a wave with $T = 2$ s has $f = \frac{1}{2}$ Hz; a wave that fits **6 periods in 1 s** has a **frequency of 6 Hz**.

*Period and frequency are just one characteristic described in two ways.* Period is the inverse of frequency and frequency is the inverse of period:

$$f = \frac{1}{T} \qquad T = \frac{1}{f}$$

In the widget, the number of cycles inside the 1 s window is $f$, and the panel's $T$ satisfies $f \times T = 1$.

```widget
sine-wave
{ "A": 1, "f": 2, "phase": 0, "title": "Frequency and period are the same fact", "presets": { "6 cycles in 1 s (f = 6 Hz)": [1, 6, 0], "T = 1 s (f = 1 Hz)": [1, 1, 0], "T = 2 s (f = 1/2 Hz)": [1, 0.5, 0], "A = 3 V, f = 2 Hz": [3, 2, 0] } }
```

## Frequency is a rate of change

Slide wording: *frequency is the rate of change with respect to time.*

- Change in a **short** span of time means **high** frequency.
- Change over a **long** span of time means **low** frequency.
- If a signal **does not change at all**, its frequency is **zero** (the battery: a flat line, $f = 0$ Hz).
- If a signal **changes instantaneously**, its frequency is **infinite** ($T = 0$ s).

## Units of period and frequency

| Period unit | Equivalent | Frequency unit | Equivalent |
|---|---|---|---|
| second (s) | 1 s | hertz (Hz) | 1 Hz |
| millisecond (ms) | $10^{-3}$ s | kilohertz (kHz) | $10^{3}$ Hz |
| microsecond (μs) | $10^{-6}$ s | megahertz (MHz) | $10^{6}$ Hz |
| nanosecond (ns) | $10^{-9}$ s | gigahertz (GHz) | $10^{9}$ Hz |
| picosecond (ps) | $10^{-12}$ s | terahertz (THz) | $10^{12}$ Hz |

The rows line up on purpose. Because $\frac{1}{10^{-3}} = 10^{3}$, the reciprocal of a period in one row is a frequency in the same row:

| $T$ in... | gives $f$ in... |
|---|---|
| ms | kHz |
| μs | MHz |
| ns | GHz |
| ps | THz |

So "$T = 4$ μs" means "$f = \frac{1}{4}$ MHz $= 0.25$ MHz $= 250$ kHz" with no scientific notation at all.

## Example 1 (slide): from frequency to period

*The power we use at home has a frequency of 60 Hz. Find the period of this sine wave in milliseconds.*

$$T = \frac{1}{f} = \frac{1}{60\ \text{Hz}} = 0.0167\ \text{s} = 16.7\ \text{ms}$$

Steps: $1 \div 60 = 0.01667$ s. To get milliseconds multiply by $10^{3}$: $0.01667 \times 1000 = 16.7$ ms.

## Example 2 (slide): from period to frequency

*What is the frequency (in kHz) of a sine wave if the period is 200 μs?*

$$f = \frac{1}{T} = \frac{1}{200 \times 10^{-6}\ \text{s}} = \frac{1\,000\,000}{200}\ \text{Hz} = 5000\ \text{Hz} = 5\ \text{kHz}$$

Steps: dividing by $10^{-6}$ is multiplying by $10^{6}$, so $\frac{1}{200 \times 10^{-6}} = \frac{10^{6}}{200} = 5000$. Then $5000$ Hz $= 5$ kHz.

Shortcut check: $T$ in μs gives $f$ in MHz, so $f = \frac{1}{200}$ MHz $= 0.005$ MHz $= 5$ kHz.

## Convert both ways

The panel shows the reciprocal with the prefix arithmetic written out.

```widget
freq-period
{ "f": 60, "unit": "Hz" }
```

## Try it

```quiz
[
  {
    "q": "A sine wave has a period of 5 ms. What is its frequency in Hz?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 1,
    "unit": "Hz",
    "explain": "$f = 1/T = 1/(5 \\times 10^{-3}\\ \\text{s}) = 1000/5 = 200$ Hz. Shortcut: $T$ in ms gives $f$ in kHz, so $1/5 = 0.2$ kHz $= 200$ Hz."
  },
  {
    "q": "A sine wave has a frequency of 2.5 MHz. What is its period in μs?",
    "type": "numeric",
    "answer": 0.4,
    "tolerance": 0.005,
    "unit": "μs",
    "explain": "$T = 1/f = 1/(2.5 \\times 10^{6}) = 0.4 \\times 10^{-6}$ s $= 0.4$ μs. Shortcut: $f$ in MHz gives $T$ in μs, so $1/2.5 = 0.4$ μs."
  },
  {
    "q": "A signal repeats 100 000 times per second (100 kHz). What is its period in μs?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "μs",
    "explain": "$T = 1/(100 \\times 10^{3}) = 10^{-5}$ s $= 10 \\times 10^{-6}$ s $= 10$ μs. Shortcut: $1/100$ kHz $= 0.01$ ms $= 10$ μs."
  },
  {
    "q": "A period of 1 ns corresponds to what frequency in GHz?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0.01,
    "unit": "GHz",
    "explain": "$f = 1/(1 \\times 10^{-9}) = 10^{9}$ Hz $= 1$ GHz. ns and GHz are reciprocal rows in the unit table."
  },
  {
    "q": "Slide Example 1: the 60 Hz power in your home. What is its period in ms?",
    "type": "numeric",
    "answer": 16.7,
    "tolerance": 0.1,
    "unit": "ms",
    "explain": "$T = 1/60 = 0.0167$ s $= 16.7$ ms."
  },
  {
    "q": "A sine wave fits 8 complete cycles into 1 second. What is its frequency in Hz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "Hz",
    "explain": "Frequency is the number of cycles in 1 second, so 8 cycles per second is 8 Hz (the slide figure does the same with 6 periods, giving 6 Hz)."
  },
  {
    "q": "The constant 1.5 V of a battery is a periodic signal with a frequency of 0.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording: the voltage of a battery is constant, periodic with a frequency of 0. A signal that does not change at all has zero frequency."
  },
  {
    "q": "Fill in the blank: frequency is measured in ______, which means cycles per second.",
    "type": "text",
    "answer": ["hertz", "hz", "hertz (Hz)"],
    "explain": "Hertz (Hz) = cycles per second. The period is measured in seconds."
  },
  {
    "q": "Which sine-wave parameter is proportional to the energy the signal carries?",
    "options": ["Frequency", "Period", "Peak amplitude", "Phase"],
    "answer": 2,
    "explain": "Peak amplitude is the absolute value of the highest intensity, proportional to the energy carried, measured in volts."
  },
  {
    "q": "Frequency and period are two independent characteristics of a sine wave.",
    "type": "tf",
    "answer": false,
    "explain": "They are one characteristic described in two ways: $f = 1/T$ and $T = 1/f$. Knowing one gives you the other."
  },
  {
    "q": "According to the slides, a signal that changes instantaneously has...",
    "options": ["a frequency of zero", "an infinite frequency (T = 0 s)", "a frequency of 1 Hz", "no period and no frequency"],
    "answer": 1,
    "explain": "Frequency is the rate of change with respect to time. An instantaneous change means the period is 0 s, so the frequency is infinite. Zero frequency is the opposite case: no change at all."
  },
  {
    "q": "Fill in the blank: peak amplitude is measured in ______.",
    "type": "text",
    "answer": ["volts", "volt", "v"],
    "explain": "Peak amplitude is a voltage (the slide: measured in volts). Frequency is in hertz, period in seconds."
  }
]
```
