---
title: Distortion, noise & SNR
minutes: 13
---

Attenuation makes a signal weaker. The other two causes of impairment change what it looks like, and the signal-to-noise ratio measures how much of what arrives is still signal.

## Distortion changes the shape

**Distortion**: the signal changes its form or shape.

- It can occur in a **composite signal** made of different frequencies.
- Signal components at the receiver have **phases different** from what they had at the sender.

The slide figure shows three components in phase at the sender and out of phase at the receiver; added together they give a composite signal of a different shape. The textbook's reason: each component has its own propagation speed through the medium, so each arrives with its own delay.

### Each component arrives with its own delay

The three components leave the sender in phase. Over each unit of distance 3f falls 45° and 5f falls 90° further behind f, so their sum at the receiver takes a new shape although no component has lost any amplitude.

```widget
distortion-play
{}
```

## Four types of noise

Slide wording: *different types of noise may corrupt the signal*.

| Type | Definition |
|---|---|
| **Thermal noise** | The random motion of electrons in a wire, which creates an extra signal not originally sent by the transmitter. |
| **Induced noise** | From sources such as motors and appliances (these devices act as a sending antenna, and the transmission medium acts as the receiving antenna). |
| **Crosstalk noise** | The effect of one wire on the other (one wire acts as a sending antenna and the other as the receiving antenna). |
| **Impulse noise** | A spike (a signal with high energy in a very short time) that comes from power lines, lightning, and so on. |

Induced noise and crosstalk share the antenna picture. The sending antenna tells them apart: a motor or appliance for induced noise, another wire for crosstalk.

## Signal-to-noise ratio

$$\text{SNR} = \frac{\text{average signal power}}{\text{average noise power}}$$

*SNR is the ratio of what is wanted (signal) to what is not wanted (noise).*

- **High SNR**: the signal is less corrupted by noise.
- **Low SNR**: the signal is more corrupted by noise.

| Slide question | Slide answer |
|---|---|
| Why do we need to calculate the SNR? | To find the **theoretical bit rate limit**, we need to know the ratio of the signal power to the noise power. |
| Why the average signal power and the average noise power? | Because these **may change with time**. |

## SNR in decibels

SNR is the ratio of two powers, so it is often described in decibel units:

$$\text{SNR}_{dB} = 10 \log_{10} \text{SNR}$$

A noiseless channel has no noise power to divide by:

$$\text{SNR} = \frac{\text{signal power}}{0} = \infty$$

$$\text{SNR}_{dB} = 10 \log_{10} \infty = \infty$$

## Slide example: 10 mW of signal, 1 μW of noise

*The average power of a signal is 10 mW and the average power of the noise is 1 μW; what are the values of SNR and $\text{SNR}_{dB}$?*

The two powers have different prefixes, so convert first: $10\ \text{mW} = 10000\ \text{μW}$.

$$\text{SNR} = \frac{10000\ \text{μW}}{1\ \text{μW}} = 10000$$

$$\text{SNR}_{dB} = 10 \log_{10} 10000 = 10 \log_{10} 10^{4} = 40\ \text{dB}$$

The microwatts cancel, so SNR has no unit.

## SNR from two voltages

The textbook's practice set gives voltages in place of powers. Power goes with the square of the voltage, so a signal voltage 10 times the noise voltage is an SNR of $10^{2} = 100$. The voltage form of the decibel formula gives the decibels directly: $20 \log_{10} 10 = 20$ dB.

## One signal under more or less noise

```widget
snr-noise
{ "signal": 10, "signalUnit": "mW", "noise": 1, "noiseUnit": "μW" }
```

## Find the SNR of four more links

Bring both powers to one prefix before dividing.

```quiz
[
  {
    "q": "The average signal power is 40 mW and the average noise power is 50 μW. What is the SNR?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 0.5,
    "explain": "Convert to one prefix: $40\\ \\text{mW} = 40000\\ \\text{μW}$. $\\text{SNR} = 40000 / 50 = 800$, with no unit."
  },
  {
    "q": "Same link (SNR = 800). What is $\\text{SNR}_{dB}$ (2 decimals)?",
    "type": "numeric",
    "answer": 29.03,
    "tolerance": 0.006,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 10 \\log_{10} 800 = 10(2.9031) = 29.03$ dB."
  },
  {
    "q": "A 3 W signal reaches a receiver that also picks up the noise of 4 devices, each adding 0.25 mW of noise. What is $\\text{SNR}_{dB}$ (2 decimals)?",
    "type": "numeric",
    "answer": 34.77,
    "tolerance": 0.006,
    "unit": "dB",
    "explain": "Noise powers add: $4 \\times 0.25 = 1$ mW. Signal: $3\\ \\text{W} = 3000\\ \\text{mW}$. $\\text{SNR} = 3000 / 1 = 3000$ and $\\text{SNR}_{dB} = 10 \\log_{10} 3000 = 10(3.4771) = 34.77$ dB."
  },
  {
    "q": "A link has an $\\text{SNR}_{dB}$ of 25 dB and an average noise power of 2 μW. What is the average signal power, in mW (3 decimals)?",
    "type": "numeric",
    "answer": 0.632,
    "tolerance": 0.001,
    "unit": "mW",
    "explain": "Ratio first: $\\text{SNR} = 10^{25/10} = 10^{2.5} = 316.23$. Signal $= \\text{SNR} \\times \\text{noise} = 316.23 \\times 2\\ \\text{μW} = 632.5\\ \\text{μW} = 0.632$ mW."
  },
  {
    "q": "The signal voltage is 4 V and the noise voltage is 0.05 V. What is $\\text{SNR}_{dB}$ (2 decimals)?",
    "type": "numeric",
    "answer": 38.06,
    "tolerance": 0.006,
    "unit": "dB",
    "explain": "Voltage ratio $4 / 0.05 = 80$. Power goes with the square of the voltage, so $\\text{SNR} = 80^{2} = 6400$ and $10 \\log_{10} 6400 = 38.06$ dB. The voltage form gives it in one step: $20 \\log_{10} 80 = 20(1.9031) = 38.06$ dB."
  }
]
```

```quiz
[
  {
    "q": "The average power of a signal is 5 mW and the average power of the noise is 5 μW. What is the SNR?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 1,
    "explain": "Convert to one prefix: $5\\ \\text{mW} = 5000\\ \\text{μW}$. $\\text{SNR} = 5000 / 5 = 1000$."
  },
  {
    "q": "Same signal (SNR = 1000). What is $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 30,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 10 \\log_{10} 1000 = 10 \\log_{10} 10^{3} = 30$ dB."
  },
  {
    "q": "The average signal power is 2 W and the average noise power is 20 mW. What is $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$2\\ \\text{W} = 2000\\ \\text{mW}$, so $\\text{SNR} = 2000 / 20 = 100$ and $\\text{SNR}_{dB} = 10 \\log_{10} 100 = 20$ dB."
  },
  {
    "q": "The noise power equals the signal power. What is $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$\\text{SNR} = 1$ and $10 \\log_{10} 1 = 0$ dB. Zero decibels means equal powers, not zero signal."
  },
  {
    "q": "For a noiseless channel, SNR is zero.",
    "type": "tf",
    "answer": false,
    "explain": "A noiseless channel has a noise power of 0, so $\\text{SNR} = (\\text{signal power})/0 = \\infty$ and $\\text{SNR}_{dB} = \\infty$. An SNR near zero is the opposite: an extremely noisy channel."
  },
  {
    "type": "match",
    "q": "Match each type of noise to its source.",
    "pairs": [
      ["Thermal noise", "random motion of electrons in a wire"],
      ["Induced noise", "motors and appliances"],
      ["Crosstalk noise", "one wire acting on another wire"],
      ["Impulse noise", "power lines and lightning"]
    ],
    "explain": "Thermal: electrons in the wire. Induced: motors and appliances acting as a sending antenna. Crosstalk: the effect of one wire on the other. Impulse: a spike from power lines, lightning, and so on."
  },
  {
    "q": "Which statement describes distortion?",
    "options": ["The signal loses energy overcoming the resistance of the medium", "An extra signal is created by the random motion of electrons", "The signal changes its form or shape as its components arrive out of phase", "The signal is converted from digital to analog for transmission"],
    "answer": 2,
    "explain": "Distortion can occur in a composite signal made of different frequencies. Losing energy is attenuation; the extra signal is thermal noise."
  },
  {
    "q": "Why is the **average** signal power and the **average** noise power used in the SNR?",
    "options": ["Because these may change with time", "Because the peak power cannot be measured", "Because noise has no peak value", "Because the decibel formula needs an average"],
    "answer": 0,
    "explain": "Slide answer: we need to consider the average signal power and the average noise power because these may change with time."
  },
  {
    "q": "Fill in the blank: we calculate the SNR in order to find the theoretical ________ limit.",
    "type": "text",
    "answer": ["bit rate", "bit-rate", "bitrate"],
    "explain": "To find the theoretical bit rate limit we need the ratio of the signal power to the noise power. The Shannon capacity uses it."
  },
  {
    "q": "The peak voltage of a signal is 30 times the peak voltage of the noise. What is $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 29.54,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "Power goes with the square of the voltage: $\\text{SNR} = 30^{2} = 900$ and $10 \\log_{10} 900 = 29.54$ dB. The voltage form gives it in one step: $20 \\log_{10} 30 = 29.54$ dB."
  }
]
```
