---
title: Attenuation & the decibel
minutes: 12
---

Slide wording: *the imperfection of transmission media causes signal impairment*. The first of its three causes, attenuation, comes with its own unit.

## Three causes of impairment

- **Attenuation**
- **Distortion**
- **Noise**

## Attenuation is a loss of energy

**Attenuation**: loss of energy to overcome the resistance of the medium. An **amplifier** compensates for the loss.

The slide figure follows one signal through three points: the original at Point 1, the attenuated signal at Point 2 after the transmission medium, and the amplified signal at Point 3 after the amplifier.

:::info Why a wire carrying electric signals gets warm
The slide asks the question and prints no answer. An earlier edition of the textbook gives one: some of the electrical energy in the signal is converted to heat.
:::

## The decibel compares two strengths

The **decibel (dB)** measures the relative strengths of two signals, or of one signal at two different points. Its sign shows whether the signal has lost or gained strength:

- **negative** if the signal is attenuated
- **positive** if the signal is amplified

$$\text{dB} = 10 \log_{10} \frac{P_2}{P_1} = 20 \log_{10} \frac{V_2}{V_1}$$

$P_1$ and $P_2$ are the powers of the signal at points 1 and 2; $V_1$ and $V_2$ are its voltages at the same points. Point 2 goes on top of the fraction.

## Slide example: power reduced to one-half

*Suppose a signal travels through a transmission medium and its power is reduced to one-half. Find the attenuation (loss of power).*

Half the power means $P_2 = 0.5 P_1$:

$$\text{dB} = 10 \log_{10} \frac{0.5 P_1}{P_1} = 10 \log_{10} 0.5 = 10(-0.3) = -3\ \text{dB}$$

The unknown $P_1$ cancels, so the ratio is all the formula needs. A calculator gives $\log_{10} 0.5 = -0.301$; the slide rounds it to $-0.3$.

## Power at two points and the decibels between them

```widget
decibel
{ "p1": 10, "p1Unit": "mW", "p2": 5, "p2Unit": "mW" }
```

## From decibels back to power

E03 gives the decibels and asks for the power, so the formula has to be turned around. Divide the decibels by 10, then raise 10 to that number:

$$\frac{P_2}{P_1} = 10^{\text{dB}/10} \qquad P_2 = P_1 \times 10^{\text{dB}/10}$$

The loss in a cable is usually defined in **dB/km**. Multiply it by the length in km to get the decibels for the whole cable.

Example: a cable has a loss of $-0.5$ dB/km and a signal enters it with a power of 4 mW. After 4 km:

- Whole cable: $4\ \text{km} \times (-0.5\ \text{dB/km}) = -2$ dB
- $P_2 = 4\ \text{mW} \times 10^{-2/10} = 4 \times 0.631 = 2.52$ mW

Decibels add along any path. A cable of $-3$ dB followed by an amplifier of $+7$ dB changes the power by $+4$ dB overall, a problem type from the textbook's practice set.

## Power ratios in decibels

| Power ratio $P_2 / P_1$ | dB |
|---|---|
| 0.01 | $-20$ |
| 0.1 | $-10$ |
| 0.5 | $-3$ |
| 1 | 0 |
| 2 | $+3$ |
| 10 | $+10$ |
| 100 | $+20$ |

```quiz
[
  {
    "q": "A signal's power is reduced to one-half as it travels through a medium. What is the attenuation in dB? Include the sign.",
    "type": "numeric",
    "answer": -3,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} 0.5 = 10(-0.301) = -3.01$ dB, which the slide writes as $-3$ dB. The sign is negative because the signal is attenuated."
  },
  {
    "q": "An amplifier raises a signal's power from 1 mW to 10 mW. What is the gain in dB?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{10}{1} = 10 \\log_{10} 10 = 10 \\times 1 = 10$ dB. Positive: the signal is amplified."
  },
  {
    "q": "A signal enters a medium at 100 mW and leaves at 1 mW. What is the attenuation in dB? Include the sign.",
    "type": "numeric",
    "answer": -20,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{1}{100} = 10 \\log_{10} 10^{-2} = 10(-2) = -20$ dB."
  },
  {
    "q": "A signal's power drops from 20 mW at point 1 to 5 mW at point 2. What is the change in dB? Include the sign.",
    "type": "numeric",
    "answer": -6.02,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{5}{20} = 10 \\log_{10} 0.25 = 10(-0.602) = -6.02$ dB. A quarter of the power is two halvings, so twice $-3$ dB."
  },
  {
    "q": "The voltage of a signal doubles between point 1 and point 2. What is the change in dB?",
    "type": "numeric",
    "answer": 6.02,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "With voltages the multiplier is 20: $20 \\log_{10} \\frac{V_2}{V_1} = 20 \\log_{10} 2 = 20(0.301) = 6.02$ dB."
  },
  {
    "q": "A cable has a loss of $-0.4$ dB/km. A signal enters with a power of 10 mW. What is its power after 5 km, in mW?",
    "type": "numeric",
    "answer": 6.31,
    "tolerance": 0.03,
    "unit": "mW",
    "explain": "Whole cable: $5 \\times (-0.4) = -2$ dB. $P_2 = 10 \\times 10^{-2/10} = 10 \\times 0.631 = 6.31$ mW."
  },
  {
    "q": "A signal of 8 mW is attenuated by $-10$ dB. What is its power afterwards, in mW?",
    "type": "numeric",
    "answer": 0.8,
    "tolerance": 0.005,
    "unit": "mW",
    "explain": "$P_2 = 8 \\times 10^{-10/10} = 8 \\times 10^{-1} = 0.8$ mW. Every $-10$ dB divides the power by 10."
  },
  {
    "q": "The decibel value is negative when a signal is attenuated.",
    "type": "tf",
    "answer": true,
    "explain": "Negative if a signal is attenuated, positive if a signal is amplified. Attenuation makes $P_2 / P_1$ less than 1, and the log of a number below 1 is negative."
  },
  {
    "q": "Fill in the blank: ________ is the loss of energy to overcome the resistance of the medium.",
    "type": "text",
    "answer": ["attenuation"],
    "explain": "Attenuation. The device that compensates for the loss is an amplifier."
  },
  {
    "q": "Select the three causes of transmission impairment.",
    "options": ["Distortion", "Noise", "Amplification", "Attenuation", "Modulation"],
    "answer": [0, 1, 3],
    "explain": "Attenuation, distortion and noise. Modulation is the conversion used by broadband transmission; amplification compensates for attenuation."
  },
  {
    "q": "Which statement about the decibel is correct?",
    "options": ["It measures the absolute power of one signal at one point, in watts", "It measures the range of frequencies that a channel is able to pass", "It measures the number of bits a channel can send in one second", "It measures the relative strengths of two signals or one signal at two different points"],
    "answer": 3,
    "explain": "The decibel is relative: it compares two powers (or two voltages). That is why the unknown $P_1$ cancels in the slide example."
  },
  {
    "q": "A signal passes through two cascaded amplifiers, each with a gain of 5 dB. By what factor is its power multiplied?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "times",
    "explain": "Decibels add: $5 + 5 = 10$ dB in total. $P_2 / P_1 = 10^{10/10} = 10$, so the power is multiplied by 10."
  }
]
```
