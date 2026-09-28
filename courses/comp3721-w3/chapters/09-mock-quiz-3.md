---
title: Mock Quiz 3 (Week 3)
minutes: 35
---

Quiz 2 covered Lecture 02, so Quiz 3 is expected to cover Lecture 03: baseband and broadband transmission, transmission impairment, the decibel, SNR, the Nyquist and Shannon data rate limits, bandwidth, the bandwidth-delay product and transmission modes. Same rules as the real thing: one A4 or letter page of notes, single-sided and preferably hand-written, a calculator, and a unit with every calculated answer.

```quiz
[
  {
    "q": "What are the two approaches for the transmission of digital signals?",
    "options": ["Parallel transmission and serial transmission", "Baseband transmission and broadband transmission", "Analog transmission and periodic transmission", "Nyquist transmission and Shannon transmission"],
    "answer": 1,
    "explain": "Baseband transmission and broadband transmission (modulation). Parallel and serial are the two digital data transmission **modes**, a different split."
  },
  {
    "q": "Baseband transmission requires a bandpass channel.",
    "type": "tf",
    "answer": false,
    "explain": "Baseband requires a **low-pass** channel (the lowest frequency contained in the channel is zero). Broadband transmission requires a bandpass channel."
  },
  {
    "q": "Fill in the blank: a channel with a bandwidth that does not start from zero is a ________ channel.",
    "type": "text",
    "answer": ["bandpass", "band-pass", "band pass"],
    "explain": "A bandpass channel allows signals to pass between two frequency limits. It is more available than a low-pass channel."
  },
  {
    "q": "Baseband transmission of a digital signal that preserves the shape of the digital signal is possible only if we have a low-pass channel with an infinite or very wide bandwidth.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording. By Fourier analysis a digital signal is a composite analog signal with infinite bandwidth, so the channel must pass a very wide range of frequencies to keep the shape."
  },
  {
    "q": "Fill in the blank: in broadband transmission the converter that changes the digital signal to analog and vice versa is called a ________.",
    "type": "text",
    "answer": ["modem"],
    "explain": "Modem: modulator/demodulator. One converter at the sender, one at the receiving end."
  },
  {
    "q": "Almost every wired LAN today uses a dedicated channel for two stations communicating with each other. Which kind of transmission is this?",
    "options": ["Broadband transmission", "Modulation", "Parallel transmission", "Baseband transmission"],
    "answer": 3,
    "explain": "The LAN is the slide's real-life example of baseband transmission: a dedicated medium with a bandwidth constituting only one channel."
  },
  {
    "q": "In baseband transmission, if we need to send bits faster, we need more bandwidth.",
    "type": "tf",
    "answer": true,
    "explain": "The required bandwidth is proportional to the bit rate."
  },
  {
    "q": "Select the three causes of transmission impairment.",
    "options": ["Distortion", "Noise", "Modulation", "Bandwidth", "Attenuation"],
    "answer": [0, 1, 4],
    "explain": "The imperfection of transmission media causes signal impairment; its causes are attenuation, distortion and noise."
  },
  {
    "q": "Fill in the blank: to compensate for the loss of energy caused by attenuation, we use an ________.",
    "type": "text",
    "answer": ["amplifier"],
    "explain": "Attenuation: loss of energy to overcome the resistance of the medium. Amplifier: to compensate for the loss."
  },
  {
    "q": "A signal travels through a transmission medium and its power is reduced to one-half. What is the attenuation in dB? Include the sign.",
    "type": "numeric",
    "answer": -3,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{0.5 P_1}{P_1} = 10 \\log_{10} 0.5 = 10(-0.3) = -3$ dB."
  },
  {
    "q": "An amplifier raises the power of a signal from 2 mW to 200 mW. What is the gain in dB?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$10 \\log_{10} \\frac{200}{2} = 10 \\log_{10} 100 = 10 \\times 2 = 20$ dB."
  },
  {
    "q": "The signal at the beginning of a cable with $-0.3$ dB/km has a power of 2 mW. What is the power of the signal at 5 km, in mW?",
    "type": "numeric",
    "answer": 1.42,
    "tolerance": 0.03,
    "unit": "mW",
    "explain": "E03 exercise 1. Whole cable: $5 \\times (-0.3) = -1.5$ dB. $P_2 = 2 \\times 10^{-0.15} = 2 \\times 0.708 = 1.42$ mW."
  },
  {
    "q": "A value of $-3$ dB means the signal has been amplified.",
    "type": "tf",
    "answer": false,
    "explain": "Negative: the signal is attenuated. Positive: the signal is amplified."
  },
  {
    "q": "The decibel can be calculated from the voltages at two points as $10 \\log_{10} \\frac{V_2}{V_1}$.",
    "type": "tf",
    "answer": false,
    "explain": "With voltages the multiplier is 20: $\\text{dB} = 10 \\log_{10} \\frac{P_2}{P_1} = 20 \\log_{10} \\frac{V_2}{V_1}$."
  },
  {
    "type": "match",
    "q": "Match each type of noise to its definition.",
    "pairs": [
      ["Thermal noise", "random motion of electrons in a wire"],
      ["Induced noise", "from sources such as motors and appliances"],
      ["Crosstalk noise", "the effect of one wire on the other"],
      ["Impulse noise", "a spike from power lines or lightning"]
    ],
    "explain": "Thermal: electrons in a wire create an extra signal not originally sent by the transmitter. Induced: motors and appliances act as a sending antenna. Crosstalk: one wire is the sending antenna, the other the receiving antenna. Impulse: high energy in a very short time."
  },
  {
    "q": "Fill in the blank: ________ means the signal changes its form or shape.",
    "type": "text",
    "answer": ["distortion"],
    "explain": "Distortion can occur in a composite signal made of different frequencies."
  },
  {
    "q": "In a distorted composite signal, what differs between the sender and the receiver?",
    "options": ["The number of signal levels", "The frequency of every component", "The phases of the signal components", "The bit rate"],
    "answer": 2,
    "explain": "Signal components at the receiver have phases different from what they had at the sender."
  },
  {
    "q": "In induced noise, which part acts as the receiving antenna?",
    "options": ["The transmission medium", "The motor or appliance", "The transmitter", "The amplifier"],
    "answer": 0,
    "explain": "Motors and appliances act as a sending antenna, and the transmission medium acts as the receiving antenna."
  },
  {
    "q": "The average power of a signal is 10 mW and the average power of the noise is 1 μW. What is the SNR?",
    "type": "numeric",
    "answer": 10000,
    "tolerance": 5,
    "explain": "$10\\ \\text{mW} = 10000\\ \\text{μW}$, so $\\text{SNR} = 10000 / 1 = 10000$."
  },
  {
    "q": "A channel has an SNR of 2000. What is the $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 33.01,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 10 \\log_{10} 2000 = 10 \\times 3.301 = 33.01$ dB."
  },
  {
    "q": "A signal with 200 mW of average power passes through 10 identical devices, each with an average noise of 2 μW. What is the $\\text{SNR}_{dB}$?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "E03 exercise 2. Total noise $= 10 \\times 2 = 20$ μW; $\\text{SNR} = 200000 / 20 = 10000$; $\\text{SNR}_{dB} = 10 \\log_{10} 10^{4} = 40$ dB."
  },
  {
    "q": "For a noiseless channel, both SNR and $\\text{SNR}_{dB}$ are infinite.",
    "type": "tf",
    "answer": true,
    "explain": "$\\text{SNR} = (\\text{signal power})/0 = \\infty$ and $\\text{SNR}_{dB} = 10 \\log_{10} \\infty = \\infty$."
  },
  {
    "q": "Fill in the blank: SNR is the ratio of what is wanted (signal) to what is not wanted (________).",
    "type": "text",
    "answer": ["noise"],
    "explain": "SNR = average signal power / average noise power."
  },
  {
    "q": "Select the three factors that the data rate relies on.",
    "options": ["The quality of the channel (the level of noise)", "The type of connector", "The phase of the signal", "The available bandwidth", "The number of signal levels"],
    "answer": [0, 3, 4],
    "explain": "Bandwidth, signal levels, and the quality of the channel. Nyquist uses the bandwidth and the signal levels; Shannon uses the bandwidth and the noise."
  },
  {
    "q": "A noiseless channel has a bandwidth of 4 kHz and the signal has 8 levels. What is the maximum bit rate, in kbps?",
    "type": "numeric",
    "answer": 24,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "$2 \\times 4000 \\times \\log_{2} 8 = 2 \\times 4000 \\times 3 = 24000$ bps $= 24$ kbps."
  },
  {
    "q": "We need to send 265 kbps over a noiseless channel with a bandwidth of 30 kHz. What does the Nyquist formula give for the number of signal levels?",
    "type": "numeric",
    "answer": 21.36,
    "tolerance": 0.05,
    "unit": "levels",
    "explain": "$265000 = 2 \\times 30000 \\times \\log_{2} L$, so $\\log_{2} L = 4.417$ and $L = 2^{4.417} = 21.36$ levels."
  },
  {
    "q": "For 265 kbps over a noiseless 30 kHz channel the Nyquist formula gives 21.36 levels, which is not a power of 2. Which pair of choices does that leave?",
    "options": ["21 levels at 265 kbps, or 22 levels at 265 kbps", "64 levels at 265 kbps, or 8 levels at 265 kbps", "32 levels at 300 kbps, or 16 levels at 240 kbps", "32 levels at 240 kbps, or 16 levels at 300 kbps"],
    "answer": 2,
    "explain": "Either increase the number of levels ($2 \\times 30000 \\times 5 = 300$ kbps with 32) or reduce the bit rate ($2 \\times 30000 \\times 4 = 240$ kbps with 16)."
  },
  {
    "q": "Which formula contains the number of signal levels $L$?",
    "options": ["The Nyquist bit rate", "The Shannon capacity", "Both", "Neither"],
    "answer": 0,
    "explain": "Nyquist: $2 \\times \\text{bandwidth} \\times \\log_{2} L$. Shannon: $\\text{bandwidth} \\times \\log_{2}(1 + \\text{SNR})$, with no $L$."
  },
  {
    "q": "We have a channel with a 1-MHz bandwidth. The SNR for this channel is 63. What is the capacity, in Mbps?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0.01,
    "unit": "Mbps",
    "explain": "$C = 10^{6} \\log_{2}(1 + 63) = 10^{6} \\log_{2} 64 = 6$ Mbps."
  },
  {
    "q": "Same channel (1 MHz bandwidth), sending at 6 Mbps. How many signal levels does the Nyquist formula give?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.05,
    "unit": "levels",
    "explain": "$6\\ \\text{Mbps} = 2 \\times 1\\ \\text{MHz} \\times \\log_{2} L$, so $\\log_{2} L = 3$ and $L = 2^{3} = 8$."
  },
  {
    "q": "A channel has a bandwidth of 2 MHz and an SNR of 31. What is its capacity, in Mbps?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.02,
    "unit": "Mbps",
    "explain": "$C = 2 \\times 10^{6} \\times \\log_{2}(1 + 31) = 2 \\times 10^{6} \\times 5 = 10$ Mbps."
  },
  {
    "q": "In an extremely noisy channel the signal-to-noise ratio is almost zero. Its capacity is zero regardless of the bandwidth.",
    "type": "tf",
    "answer": true,
    "explain": "$C = B \\log_{2}(1 + 0) = B \\log_{2} 1 = B \\times 0 = 0$: we cannot receive any data through this channel."
  },
  {
    "q": "With enough signal levels we can achieve a data rate higher than the capacity of the channel.",
    "type": "tf",
    "answer": false,
    "explain": "No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel."
  },
  {
    "q": "In networking, the term bandwidth is used in two different contexts. Which two?",
    "options": ["Bandwidth in volts and bandwidth in watts", "Bandwidth in hertz and bandwidth in bits per second", "Bandwidth in decibels and bandwidth in hertz", "Bandwidth in seconds and bandwidth in bits"],
    "answer": 1,
    "explain": "Hertz: a range of frequencies. Bits per second: the number of bits per second a channel, a link, or even a network can transmit, which we call bit rate."
  },
  {
    "q": "Fill in the blank: the bandwidth-delay product is the number of bits that can ________ the link.",
    "type": "text",
    "answer": ["fill", "fill up"],
    "explain": "The number of bits that can fill the link: bandwidth × delay."
  },
  {
    "q": "A link has a bandwidth of 2 Mbps and a delay of 10 ms. What burst size uses the maximum capability of the full-duplex link?",
    "type": "numeric",
    "answer": 40000,
    "tolerance": 5,
    "unit": "bits",
    "explain": "Bandwidth × delay $= 2 \\times 10^{6} \\times 0.010 = 20000$ bits. The burst is 2 times that, 40000 bits, to fill both directions."
  },
  {
    "q": "What are the advantage and the disadvantage of parallel transmission?",
    "options": ["Advantage: cost. Disadvantage: speed", "Advantage: one line. Disadvantage: converters", "Advantage: no noise. Disadvantage: attenuation", "Advantage: speed. Disadvantage: cost"],
    "answer": 3,
    "explain": "Parallel transmission can increase the transfer speed by a factor of $n$ over serial, at the cost of $n$ lines."
  },
  {
    "q": "Serial transmission reduces the cost of transmission over parallel by roughly a factor of $n$.",
    "type": "tf",
    "answer": true,
    "explain": "With only one communication channel in place of $n$ lines, the cost drops by roughly a factor of $n$."
  },
  {
    "q": "Fill in the blank: USB stands for Universal ________ Bus.",
    "type": "text",
    "answer": ["serial"],
    "explain": "Universal Serial Bus: from 12 Mbps (USB 1.0) and 480 Mbps (USB 2.0) to 5, 10 and 20 Gbps (USB 3.2 Gen 1, Gen 2, Gen 2x2)."
  },
  {
    "q": "In serial transmission, a serial/parallel converter sits between the line and the receiver.",
    "type": "tf",
    "answer": true,
    "explain": "Parallel/serial converter at the sender, serial/parallel converter at the receiver."
  }
]
```
