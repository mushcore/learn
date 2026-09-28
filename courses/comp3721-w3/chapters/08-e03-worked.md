---
title: E03, worked
minutes: 12
---

The Week 3 exercise sheet (E03) has two calculation questions: the power left at the end of a cable whose loss is given in dB/km, and the SNR of a signal that has passed through several noisy devices.

:::info E03 was posted without an answer sheet
E01 and E02 came with the instructor's answers. E03 has none so far, so the answers here are worked from the Lecture 03 formulas.
:::

## E03: Week 3 exercises

### Exercise 1

> The loss in a cable is usually defined in decibels per kilometer (dB/km). If the signal at the beginning of a cable with −0.3 dB/km has a power of 2 mW, what is the power of the signal at 5 km?

### Exercise 2

> A signal with 200 milliwatts of average power passes through 10 identical devices, each with an average noise of 2 microwatts. What is the SNR? What is the SNRdB?

```quiz
[
  {
    "q": "E03 exercise 1: a cable with a loss of $-0.3$ dB/km is 5 km long. What is the loss of the whole cable, in dB? Include the sign.",
    "type": "numeric",
    "answer": -1.5,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$5\\ \\text{km} \\times (-0.3\\ \\text{dB/km}) = -1.5$ dB."
  },
  {
    "q": "E03 exercise 1: the signal at the beginning of that cable ($-0.3$ dB/km) has a power of 2 mW. What is the power of the signal at 5 km, in mW?",
    "type": "numeric",
    "answer": 1.42,
    "tolerance": 0.03,
    "unit": "mW",
    "explain": "$P_2 = P_1 \\times 10^{\\text{dB}/10} = 2 \\times 10^{-0.15} = 2 \\times 0.708 = 1.42$ mW, or 1.4 mW to one decimal."
  },
  {
    "q": "E03 exercise 2: a signal with 200 mW of average power passes through 10 identical devices, each with an average noise of 2 μW. What is the SNR?",
    "type": "numeric",
    "answer": 10000,
    "tolerance": 5,
    "explain": "Total noise $= 10 \\times 2 = 20$ μW. $200\\ \\text{mW} = 200000\\ \\text{μW}$, so $\\text{SNR} = 200000 / 20 = 10000$."
  },
  {
    "q": "E03 exercise 2: for that signal (200 mW through 10 devices of 2 μW each), what is the $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 10 \\log_{10} 10000 = 10 \\log_{10} 10^{4} = 40$ dB."
  },
  {
    "q": "A cable has a loss of $-0.25$ dB/km. A signal enters it with a power of 3 mW. What is the power at 8 km, in mW?",
    "type": "numeric",
    "answer": 1.89,
    "tolerance": 0.02,
    "unit": "mW",
    "explain": "Whole cable: $8 \\times (-0.25) = -2$ dB. $P_2 = 3 \\times 10^{-0.2} = 3 \\times 0.631 = 1.89$ mW."
  },
  {
    "q": "A cable has a loss of $-0.5$ dB/km. A signal enters it with a power of 4 mW. What is the power at 6 km, in mW?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0.02,
    "unit": "mW",
    "explain": "Whole cable: $6 \\times (-0.5) = -3$ dB. $P_2 = 4 \\times 10^{-0.3} = 4 \\times 0.501 = 2.0$ mW. A loss of 3 dB leaves one-half of the power."
  },
  {
    "q": "A signal leaves a 10 km cable with 0.5 mW after entering with 5 mW. What is the loss of the cable in dB/km? Include the sign.",
    "type": "numeric",
    "answer": -1,
    "tolerance": 0.01,
    "unit": "dB/km",
    "explain": "Whole cable: $10 \\log_{10} \\frac{0.5}{5} = 10 \\log_{10} 0.1 = -10$ dB. Per kilometre: $-10 / 10 = -1$ dB/km."
  },
  {
    "q": "A signal with 100 mW of average power passes through 10 identical devices, each with an average noise of 10 μW. What is the SNR?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 1,
    "explain": "Total noise $= 10 \\times 10 = 100$ μW. $100\\ \\text{mW} = 100000\\ \\text{μW}$, so $\\text{SNR} = 100000 / 100 = 1000$."
  },
  {
    "q": "A signal with an SNR of 1000 has what $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} 1000 = 10 \\times 3 = 30$ dB."
  },
  {
    "q": "A signal with 60 mW of average power passes through 3 identical devices, each with an average noise of 4 μW. What is the $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 36.99,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "Total noise $= 3 \\times 4 = 12$ μW. $\\text{SNR} = 60000 / 12 = 5000$. $\\text{SNR}_{dB} = 10 \\log_{10} 5000 = 10 \\times 3.699 = 36.99$ dB."
  }
]
```

## Exercise 1, worked: 1.42 mW is left

The loss adds up along the cable:

$$5\ \text{km} \times (-0.3\ \text{dB/km}) = -1.5\ \text{dB}$$

Put it into the decibel formula and solve for $P_2$:

$$-1.5 = 10 \log_{10} \frac{P_2}{P_1} \quad \to \quad \frac{P_2}{P_1} = 10^{-0.15} = 0.708$$

$$P_2 = 0.708 \times 2\ \text{mW} = 1.42\ \text{mW}$$

About 71% of the power is left. A loss of $-1.5$ dB is half of $-3$ dB, but it does not leave three quarters of the power: decibels are logarithmic.

### Power along the exercise 1 cable

```widget
decibel
{ "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5, "title": "Exercise 1: a cable of −0.3 dB/km", "presets": { "5 km (exercise 1)": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 5 }, "10 km of the same cable": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 10 }, "1 km of the same cable": { "p1": 2, "p1Unit": "mW", "perKm": -0.3, "km": 1 } } }
```

## Exercise 2, worked: 10000, or 40 dB

Each device adds its own noise, so the noise powers add:

$$\text{total noise} = 10 \times 2\ \text{μW} = 20\ \text{μW}$$

Convert the signal to the same prefix, $200\ \text{mW} = 200000\ \text{μW}$:

$$\text{SNR} = \frac{200000\ \text{μW}}{20\ \text{μW}} = 10000$$

$$\text{SNR}_{dB} = 10 \log_{10} 10^{4} = 40\ \text{dB}$$

:::warn Two slips that change the answer
Dividing by one device's 2 μW gives 100000 and 50 dB. Dividing 200 by 20 without converting the prefixes gives 10 and 10 dB.
:::

### Noise adding up over the devices

```widget
snr-noise
{ "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10, "title": "Exercise 2: 200 mW through identical noisy devices", "presets": { "10 devices (exercise 2)": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 10 }, "1 device": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 1 }, "100 devices": { "signal": 200, "signalUnit": "mW", "noise": 2, "noiseUnit": "μW", "sources": 100 } } }
```
