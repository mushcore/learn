---
title: "Review 1a: a sine wave, its period and frequency, and the units"
minutes: 15
---
This lesson teaches how long one cycle of a wave lasts and how many cycles fit in a second. It prepares the exam question that gives one of the two and asks for the other, in the right unit.

## What a sine wave is, in plain words

A sine wave is a signal that rises smoothly to a peak, falls through zero to a trough, and climbs back. Then it does exactly the same thing again, forever.

One rise, fall and return is called one **cycle**. A child on a swing makes the same picture: forward, back, and forward again is one cycle.

The **period** is how long one cycle takes. The **frequency** is how many cycles happen in one second.

They are one fact said two ways. A swing that takes 2 seconds per cycle makes half a cycle each second.

A signal that never changes, such as a battery's steady 1.5 V, has no cycles at all. Its frequency is zero.

```diagram
{ "type": "flow", "title": "One cycle of a sine wave", "nodes": [
  { "id": "a", "label": "Start at 0", "sub": "rising" },
  { "id": "b", "label": "Peak", "sub": "a quarter cycle in" },
  { "id": "c", "label": "Back to 0", "sub": "half a cycle in" },
  { "id": "d", "label": "Trough", "sub": "three quarters in" },
  { "id": "e", "label": "Back to 0", "sub": "one full cycle" }
], "edges": [ { "from": "a", "to": "b" }, { "from": "b", "to": "c" }, { "from": "c", "to": "d" }, { "from": "d", "to": "e" } ], "hi": ["e"], "caption": "The time from the first box to the last is the period; the number of such trips in 1 s is the frequency." }
```

## A tiny case you can do in your head

A wave finishes one cycle every 0.25 ms. How many cycles fit in one millisecond?

$$\frac{1}{0.25} = 4\ \text{cycles per ms}$$

One millisecond is a thousandth of a second, so a thousand of them make a second.

$$4 \times 1000 = 4000\ \text{cycles per s} = \mathbf{4\ kHz}$$

That makes sense: a very short cycle means a great many cycles each second.

## The formula, with each symbol named

$$f = \frac{1}{T} \qquad T = \frac{1}{f}$$

- $T$ is the period: the time of one cycle, in seconds. Milliseconds and microseconds are common.
- $f$ is the frequency: the cycles in one second, in hertz. One hertz is one cycle per second.

The trap is the prefix. A period in milliseconds turns into a frequency in kilohertz, and a period in microseconds turns into megahertz.

```diagram
{ "type": "grid", "title": "Prefixes pair up across the reciprocal", "nodes": [
  { "id": "h0", "label": "Period unit", "row": 0, "col": 0 },
  { "id": "h1", "label": "Size", "row": 0, "col": 1 },
  { "id": "h2", "label": "Frequency unit", "row": 0, "col": 2 },
  { "id": "a0", "label": "s", "row": 1, "col": 0 },
  { "id": "a1", "label": "1", "row": 1, "col": 1 },
  { "id": "a2", "label": "Hz", "row": 1, "col": 2 },
  { "id": "b0", "label": "ms", "row": 2, "col": 0 },
  { "id": "b1", "label": "10⁻³ ↔ 10³", "row": 2, "col": 1 },
  { "id": "b2", "label": "kHz", "row": 2, "col": 2 },
  { "id": "c0", "label": "μs", "row": 3, "col": 0 },
  { "id": "c1", "label": "10⁻⁶ ↔ 10⁶", "row": 3, "col": 1 },
  { "id": "c2", "label": "MHz", "row": 3, "col": 2 },
  { "id": "d0", "label": "ns", "row": 4, "col": 0 },
  { "id": "d1", "label": "10⁻⁹ ↔ 10⁹", "row": 4, "col": 1 },
  { "id": "d2", "label": "GHz", "row": 4, "col": 2 }
], "hi": ["b0", "b2", "c0", "c2"], "caption": "One over a period in a row gives a frequency in the same row: 0.25 ms gives 4 kHz." }
```

## The slide's examples, worked

*The power we use at home has a frequency of 60 Hz. Find the period of this sine wave in milliseconds.*

$$T = \frac{1}{f} = \frac{1}{60\ \text{Hz}} = 0.0167\ \text{s} = \mathbf{16.7\ ms}$$

Check: 60 cycles in a second means each one takes a little under 20 ms.

*What is the frequency (in kHz) of a sine wave if the period is 200 μs?*

$$f = \frac{1}{T} = \frac{1}{200 \times 10^{-6}\ \text{s}} = \frac{1\,000\,000}{200}\ \text{Hz} = 5000\ \text{Hz} = \mathbf{5\ kHz}$$

Check: 200 μs pairs with megahertz, and 1/200 MHz is 0.005 MHz, which is 5 kHz.

```widget
freq-period
{ "f": 60, "unit": "Hz", "title": "The slide's 60 Hz: type a period on the right to go back" }
```

## Reading the frequency off an equation

The slide also writes a wave as an equation, $s(t) = A \sin(2\pi f t)$. The number in front, $A$, is the peak height in volts.

The number that multiplies $t$ inside the sine is $2\pi$ times the frequency. Divide it by $2\pi$ to get $f$.

A tiny case: in $\sin(2\pi t)$ the number beside $t$ is $2\pi$.

$$f = \frac{2\pi}{2\pi} = \mathbf{1\ Hz}$$

```diagram
{ "type": "flow", "title": "The slide's 5 sin(20πt), read in three steps", "nodes": [
  { "id": "s", "label": "5 sin(20πt)", "sub": "A = 5 V in front" },
  { "id": "w", "label": "2πf = 20π", "sub": "the number beside t" },
  { "id": "f", "label": "f = 10 Hz", "sub": "divide by 2π" },
  { "id": "t", "label": "T = 0.1 s", "sub": "then T = 1/f" }
], "edges": [ { "from": "s", "to": "w" }, { "from": "w", "to": "f" }, { "from": "f", "to": "t" } ], "hi": ["f"], "caption": "The π cancels here; in sin(10t) there is no π, so f = 10 ÷ 6.283 = 1.59 Hz and T = 0.628 s." }
```

The slide's second equation, $\sin(10t)$, has nothing in front, so $A = 1$ V.

$$f = \frac{10}{2\pi} = \frac{10}{6.283} = \mathbf{1.59\ Hz} \qquad T = \frac{1}{1.59} = \mathbf{0.628\ s}$$

Check: dividing by 2 alone would give 5 Hz, which forgets the π.

## Try it

```quiz
[
  {
    "q": "A Lua script's `on_tick` fires once every 30 ms. Treat that as the period of a wave. What is the tick frequency, in Hz? (Two decimals.)",
    "type": "numeric",
    "answer": 33.33,
    "tolerance": 0.04,
    "unit": "Hz",
    "explain": "Formula: f = 1/T.\nSubstitution: f = 1 / (30 × 10⁻³ s) = 1 / 0.030 s.\nAnswer: 33.33 Hz.\nCheck: 1/ms gives kHz, and 1/30 = 0.0333 kHz = 33.3 Hz, about 33 ticks in one second."
  },
  {
    "q": "A sine wave has a period of 4 μs. What is its frequency, in kHz?",
    "type": "numeric",
    "answer": 250,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Formula: f = 1/T.\nSubstitution: f = 1 / (4 × 10⁻⁶ s) = 10⁶ / 4 Hz.\nAnswer: 250 000 Hz = 250 kHz.\nCheck: μs pairs with MHz, and 1/4 MHz = 0.25 MHz = 250 kHz."
  },
  {
    "q": "A sine wave has a frequency of 2.5 MHz. What is its period, in ns?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Formula: T = 1/f.\nSubstitution: T = 1 / (2.5 × 10⁶ Hz) = 0.4 × 10⁻⁶ s.\nAnswer: 0.4 μs = 400 ns.\nCheck: MHz pairs with μs, and 1/2.5 = 0.4 μs."
  },
  {
    "q": "A signal is $s(t) = 3\\sin(100\\pi t)$. What is its period, in ms?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "ms",
    "explain": "Formula: 2πf = the number beside t, then T = 1/f.\nSubstitution: 2πf = 100π, so f = 100π ÷ 2π = 50 Hz; T = 1/50 s.\nAnswer: 0.02 s = 20 ms.\nCheck: the 3 in front is the peak amplitude and does not touch the frequency; 50 cycles of 20 ms fill one second."
  },
  {
    "q": "A signal is $s(t) = \\sin(4t)$. What is its frequency, in Hz? (Two decimals.)",
    "type": "numeric",
    "answer": 0.64,
    "tolerance": 0.01,
    "unit": "Hz",
    "explain": "Formula: 2πf = the number beside t.\nSubstitution: 2πf = 4, so f = 4 ÷ 6.283.\nAnswer: 0.64 Hz.\nCheck: there is no π beside t, so divide by the full 2π; 4 ÷ 2 = 2 Hz forgets the π."
  },
  {
    "q": "True or false: a signal that does not change at all, such as a battery's constant voltage, has a frequency of zero.",
    "type": "tf",
    "answer": true,
    "explain": "Formula: f = cycles in one second.\nSubstitution: a flat line completes no cycles in any second.\nAnswer: true, f = 0 Hz.\nCheck: the slides call a constant signal periodic with a frequency of 0."
  }
]
```

## Remember

- The period and the frequency are reciprocals: one over either gives the other.
- Milliseconds pair with kilohertz, microseconds with megahertz. Convert the prefix last, by the row it sits in.
- In an equation, the number beside $t$ is $2\pi f$. Divide by the full $2\pi$.
- *On the sheet:* Sheet side 1, "Sine wave and units".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "frequency", "period" | T = 1/f, f = 1/T | s (ms, μs) or Hz (kHz, MHz) | 1/ms gives kHz, 1/μs gives MHz |
| an equation $A \sin(\ldots t)$ | f = (number beside t) ÷ 2π | Hz | the π cancels only if it is written |
