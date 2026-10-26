---
title: "Clock hardware: crystal, counter, holding register"
minutes: 15
---

The operating system needs an interrupt at a moment it chooses: when a quantum ends, when an alarm is due. The clock is the hardware that delivers it, and software chooses the moment by choosing one number.

## A clock is built from three components

Slide 29: *Clocks are built out of three components:*

| # | Component | Slide wording | Role |
|---|---|---|---|
| 1 | Crystal oscillator | *Can generate a periodic signal, typically in the range of several hundred megahertz to a few gigahertz, depending on the crystal chosen.* | the source of pulses |
| 2 | Counter | *This signal is fed into the counter to make it count down to zero. When the counter gets to zero, it causes a CPU interrupt.* | counts the pulses down |
| 3 | Holding register | *The value of the holding register is copied into the counter.* | keeps the starting count software chose |

The slide underlines one sentence: *All the clock hardware does is generate interrupts at known intervals.* Everything else in this Part (the time of day, quanta, alarms) is software counting those interrupts.

:::quiz The components belong to the clock, not the clock driver
The crystal, counter and holding register make up the programmable clock, which is hardware. The clock driver is the software that handles its interrupts ([the next lesson](#/comp4736-p2/clock-software)). A statement that builds the clock driver out of these three components is False.
:::

## The holding register loads the counter

Slide 30's figure, *A programmable clock*, wires the crystal to a row of cells labelled *Counter is decremented at each pulse*. A second row sits beneath it, labelled *Holding register is used to load the counter*, with an arrow up into the counter. Software writes a number into the holding register; the hardware copies it into the counter and pulses it down to zero.

## One-shot mode and square-wave mode

Slide 31 gives the two modes:

- **One-shot mode**: *When the clock is started, it copies the value of the holding register into the counter and then decrements the counter at each pulse from the crystal. When the counter gets to zero, it causes an interrupt and stops until it is explicitly started again by the software.*
- **Square-wave mode**: *After getting to zero it causes an interrupt, the value of the holding register is copied into the counter and whole process is repeated again indefinitely. These periodic interrupts are called clock ticks.*

The modes differ only at zero. One-shot stops and waits for software. Square-wave reloads itself from the holding register with no software involved, so interrupts keep arriving at the same interval.

### Five pulses to an interrupt, then again

The holding register holds 5 in square-wave mode. Watch the counter fall from 5 to 0, one crystal pulse per step, the interrupt at zero, and the copy back from the holding register; in one-shot mode the clock stops after the first interrupt.

```widget
clock-play
{ "mode": "square", "holding": 5, "predict": true }
```

## Software sets the interval: 500 MHz on a 32-bit register

Slide 32: *The advantage of the programmable clock is that its interrupt frequency can be controlled by software.* Then the slide's numbers: *If a 500-MHz crystal is used, then the counter is pulsed every 2 nsec. With (unsigned) 32-bit registers, interrupts can be programmed to occur at intervals from 2 nsec to 8.6 sec.*

The instructor's arithmetic, in two steps:

1. The period of one pulse: $T = \dfrac{1}{f} = \dfrac{1}{500 \times 10^{6}}$ sec $= \dfrac{10^{9}}{500 \times 10^{6}}$ nsec $= 2$ nsec.
2. The longest interval: the largest unsigned 32-bit value is $2^{32} - 1$ = 4294967295, so $(2^{32} - 1) \times 2$ nsec = 8589934590 nsec $\approx 8.6$ sec.

The shortest interval is a holding register of 1: one pulse, 2 nsec. Every interval in between is a whole number of pulses:

$$\text{interval} = \text{holding value} \times T$$

The same relation read backwards turns a period into a frequency: a 2 nsec period means 500 MHz, which is 0.5 GHz.

## The value to load for a quantum

To interrupt after a chosen interval, solve for the holding value:

$$\text{value} = \dfrac{\text{interval}}{T}$$

The practice paper's case is a 2 ns tick and a 40 ms quantum. Put both in seconds before dividing: $\dfrac{40 \times 10^{-3}}{2 \times 10^{-9}} = 2 \times 10^{7}$, so the register is loaded with 20 000 000. Check two things afterwards. The value is a whole number of pulses, and it fits the register: 20 000 000 is below 4294967295, so 32 bits is enough.

## Load the counter for three new clocks

Each clock has a new crystal and a new register width. Convert to seconds first, then divide or multiply by the period.

```quiz
[
  {
    "q": "A clock uses a 1 GHz crystal. How often is the counter pulsed?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "ns",
    "explain": "$T = 1/f = 1/(1 \\times 10^{9})$ s $= 10^{-9}$ s = **1 ns**."
  },
  {
    "q": "The same 1 GHz clock has an unsigned 32-bit holding register. What is the longest interval it can time?",
    "type": "numeric",
    "answer": 4.294967295,
    "tolerance": 0.01,
    "unit": "s",
    "explain": "Longest interval = $(2^{32} - 1) \\times T$ = 4294967295 × 1 ns = 4294967295 ns = **4.29 s**. Half the slide's 8.6 s, because the crystal is twice as fast."
  },
  {
    "q": "A second clock uses a 100 MHz crystal. What is its period?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0,
    "unit": "ns",
    "explain": "$T = 1/(100 \\times 10^{6})$ s $= 10^{-8}$ s = **10 ns**."
  },
  {
    "q": "On the 100 MHz clock, the OS gives each process a 50 ms quantum. What value is loaded into the holding register? (Digits only.)",
    "type": "numeric",
    "answer": 5000000,
    "tolerance": 0,
    "explain": "value = interval ÷ T = $(50 \\times 10^{-3}) / (10 \\times 10^{-9}) = 5 \\times 10^{6}$ = **5 000 000** pulses. It fits a 32-bit register (below 4294967295)."
  },
  {
    "q": "A small embedded clock has a 1 MHz crystal and an unsigned 16-bit holding register. What is the longest interval it can time, in milliseconds?",
    "type": "numeric",
    "answer": 65.535,
    "tolerance": 0.05,
    "unit": "ms",
    "explain": "$T = 1/(1 \\times 10^{6})$ s = 1 μs. The largest 16-bit value is $2^{16} - 1$ = 65535, so the longest interval is 65535 × 1 μs = 65535 μs = **65.5 ms**."
  }
]
```

```quiz
[
  {
    "q": "In one-shot mode, when the counter reaches zero, the value of the holding register is copied back into the counter automatically and the countdown repeats.",
    "type": "tf",
    "answer": false,
    "explain": "That is square-wave mode. In one-shot mode the counter *causes an interrupt and stops until it is explicitly started again by the software*."
  },
  {
    "q": "All the clock hardware does is generate interrupts at known intervals.",
    "type": "tf",
    "answer": true,
    "explain": "Slide 29's underlined sentence. Keeping the time of day, ending quanta and firing alarms are the clock driver's work, done in software."
  },
  {
    "q": "Which clock component counts down to zero and causes the CPU interrupt?",
    "options": ["The counter", "The holding register", "The crystal oscillator", "The clock driver"],
    "answer": 0,
    "explain": "The crystal's signal *is fed into the counter to make it count down to zero. When the counter gets to zero, it causes a CPU interrupt.* The holding register only supplies the starting value, and the clock driver is software."
  },
  {
    "q": "What are the periodic interrupts of square-wave mode called?",
    "type": "text",
    "answer": ["clock ticks", "clock tick", "ticks", "tick"],
    "explain": "Slide 31: *These periodic interrupts are called clock ticks.*"
  },
  {
    "q": "Put one interval of a one-shot clock in order.",
    "type": "reorder",
    "lines": [
      "Software starts the clock",
      "The holding register's value is copied into the counter",
      "Each pulse from the crystal decrements the counter",
      "The counter gets to zero and causes a CPU interrupt",
      "The clock stops until software starts it again"
    ],
    "explain": "One-shot mode: *it copies the value of the holding register into the counter and then decrements the counter at each pulse from the crystal. When the counter gets to zero, it causes an interrupt and stops until it is explicitly started again by the software.*"
  },
  {
    "q": "A crystal oscillator typically generates a signal in which range, according to slide 29?",
    "options": ["Several hundred megahertz to a few gigahertz", "Exactly 60 Hz", "Exactly 500 MHz", "A few hertz to a few kilohertz"],
    "answer": 0,
    "explain": "*Typically in the range of several hundred megahertz to a few gigahertz, depending on the crystal chosen.* 500 MHz is only the slide-32 example and 60 Hz is the clock rate of the time-of-day example."
  },
  {
    "q": "A clock uses a 250 MHz crystal. How often is the counter pulsed?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "ns",
    "explain": "$T = 1/(250 \\times 10^{6})$ s $= 10^{9} / (250 \\times 10^{6})$ ns = **4 ns**."
  },
  {
    "q": "A system has a clock tick of 4 ns and gives each process a 10 ms quantum. What value is loaded into the timer register to interrupt after one quantum? (Digits only.)",
    "type": "numeric",
    "answer": 2500000,
    "tolerance": 0,
    "explain": "value = quantum ÷ tick = $(10 \\times 10^{-3}) / (4 \\times 10^{-9}) = 2.5 \\times 10^{6}$ = **2 500 000**."
  },
  {
    "q": "A clock has a cycle time of 2.5 ns. What is its frequency?",
    "type": "numeric",
    "answer": 400,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "$f = 1/T = 1/(2.5 \\times 10^{-9})$ Hz $= 4 \\times 10^{8}$ Hz = **400 MHz** (0.4 GHz)."
  }
]
```
