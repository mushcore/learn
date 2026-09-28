---
title: Noisy channel: Shannon capacity
minutes: 13
---

Slide wording: *in reality, we cannot have a noiseless channel; the channel is always noisy.* The Shannon capacity is the theoretical highest data rate once the noise is counted.

## Shannon capacity

$$\text{Capacity} = \text{bandwidth} \times \log_{2}(1 + \text{SNR})$$

| Symbol | Meaning | Unit |
|---|---|---|
| Capacity | capacity of the channel | bps |
| bandwidth | bandwidth of the channel | Hz |
| SNR | signal-to-noise ratio, as a plain ratio | none |

The formula has no $L$ in it. The slide boxes the consequence: *no matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel.*

## The formula takes the ratio, not the decibels

When a question gives $\text{SNR}_{dB}$, turn it back into a ratio first:

$$\text{SNR} = 10^{\text{SNR}_{dB}/10}$$

An $\text{SNR}_{dB}$ of 30 dB is an SNR of $10^{3} = 1000$. Putting 30 into the formula in place of 1000 cuts the answer in half.

## An extremely noisy channel has zero capacity

When the signal-to-noise ratio is almost zero, the noise is so strong that the signal is faint:

$$C = B \log_{2}(1 + \text{SNR}) = B \log_{2}(1 + 0) = B \log_{2} 1 = B \times 0 = 0$$

The capacity is zero **regardless of the bandwidth**: we cannot receive any data through this channel.

## Textbook example: a telephone line

Section 2.2 of the textbook gives a telephone line a bandwidth of 3000 Hz for data and an SNR of 3162:

$$C = 3000 \log_{2}(1 + 3162) = 3000 \times 11.627 = 34881\ \text{bps}$$

To send data faster than 34.881 kbps, either increase the bandwidth of the line or improve the signal-to-noise ratio.

## Solving for the SNR

The textbook's practice set runs the formula backwards. A 4 kHz channel that has to carry 40 kbps needs

$$\log_{2}(1 + \text{SNR}) = \frac{40000}{4000} = 10 \qquad \text{SNR} = 2^{10} - 1 = 1023$$

In decibels that SNR is $10 \log_{10} 1023 = 30.1$ dB.

## Both formulas on one channel

- *The Shannon capacity gives us the **upper limit**.*
- *The Nyquist formula tells us **how many signal levels** we need.*

### Example 2: a 1 MHz channel with an SNR of 63

*We have a channel with a 1-MHz bandwidth. The SNR for this channel is 63. What are the appropriate bit rate and number of signal levels?*

Shannon first, for the upper limit:

$$C = B \log_{2}(1 + \text{SNR}) = 10^{6} \log_{2}(1 + 63) = 10^{6} \log_{2} 64 = 6\ \text{Mbps}$$

Then Nyquist, with that bit rate:

$$6\ \text{Mbps} = 2 \times 1\ \text{MHz} \times \log_{2} L \qquad \log_{2} L = 3 \qquad L = 2^{3} = 8$$

:::warn The textbook finishes this example differently
The textbook finds the same 6 Mbps limit, then chooses 4 Mbps "for better performance" and gets $L = 4$. The slide puts the full 6 Mbps into Nyquist and gets $L = 8$.
:::

## Capacity and levels of one channel

```widget
data-rate
{ "bandwidth": 1, "unit": "MHz", "snr": 63, "levels": 8, "presets": { "Example 2: 1 MHz, SNR 63": { "bandwidth": 1, "unit": "MHz", "snr": 63, "levels": 8 }, "Same channel, 16 levels": { "bandwidth": 1, "unit": "MHz", "snr": 63, "levels": 16 }, "Extremely noisy: SNR 0": { "bandwidth": 1, "unit": "MHz", "snr": 0, "levels": 2 }, "Telephone line (textbook): 3000 Hz, SNR 3162": { "bandwidth": 3000, "unit": "Hz", "snr": 3162, "levels": 2 } } }
```

```quiz
[
  {
    "q": "A channel has a bandwidth of 1 MHz and an SNR of 15. What is its capacity, in Mbps?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "Mbps",
    "explain": "$C = 10^{6} \\log_{2}(1 + 15) = 10^{6} \\log_{2} 16 = 10^{6} \\times 4 = 4$ Mbps."
  },
  {
    "q": "Same channel (1 MHz, SNR 15, capacity 4 Mbps). Using the capacity as the bit rate, how many signal levels does the Nyquist formula give?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.05,
    "unit": "levels",
    "explain": "$4\\ \\text{Mbps} = 2 \\times 1\\ \\text{MHz} \\times \\log_{2} L$, so $\\log_{2} L = 2$ and $L = 2^{2} = 4$."
  },
  {
    "q": "A channel has a bandwidth of 4 kHz and an SNR of 255. What is its capacity, in kbps?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.1,
    "unit": "kbps",
    "explain": "$C = 4000 \\log_{2}(1 + 255) = 4000 \\log_{2} 256 = 4000 \\times 8 = 32000$ bps $= 32$ kbps."
  },
  {
    "q": "A channel has a bandwidth of 500 kHz and an SNR of 1023. Shannon gives 5 Mbps. How many signal levels does Nyquist give for that bit rate?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.1,
    "unit": "levels",
    "explain": "$C = 500000 \\log_{2} 1024 = 500000 \\times 10 = 5$ Mbps. Nyquist: $5000000 = 2 \\times 500000 \\times \\log_{2} L$, so $\\log_{2} L = 5$ and $L = 32$."
  },
  {
    "q": "A channel has a bandwidth of 20 kHz and an $\\text{SNR}_{dB}$ of 30 dB. What is its capacity, in kbps?",
    "type": "numeric",
    "answer": 199.3,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "Ratio first: $\\text{SNR} = 10^{30/10} = 1000$. $C = 20000 \\log_{2}(1001) = 20000 \\times 9.967 = 199345$ bps $= 199.3$ kbps. Using 30 as the SNR gives 99 kbps, half the right answer."
  },
  {
    "q": "A channel with a bandwidth of 10 MHz has a signal-to-noise ratio of almost zero. What is its capacity, in bps?",
    "type": "numeric",
    "answer": 0,
    "tolerance": 0.001,
    "unit": "bps",
    "explain": "$C = B \\log_{2}(1 + 0) = B \\log_{2} 1 = B \\times 0 = 0$. The capacity is zero regardless of the bandwidth."
  },
  {
    "q": "A channel has a capacity of 6 Mbps. Using 64 signal levels in place of 8 lets us send more than 6 Mbps over it.",
    "type": "tf",
    "answer": false,
    "explain": "No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel. The Shannon formula has no $L$ in it."
  },
  {
    "q": "Fill in the blank: the Shannon capacity gives us the ________ limit; the Nyquist formula tells us how many signal levels we need.",
    "type": "text",
    "answer": ["upper"],
    "explain": "Shannon: the upper limit. Nyquist: how many signal levels we need."
  },
  {
    "q": "Which quantities appear in the Shannon capacity formula? Select all that apply.",
    "options": ["Number of signal levels", "Propagation speed", "Bandwidth of the channel", "Signal-to-noise ratio"],
    "answer": [2, 3],
    "explain": "$\\text{Capacity} = \\text{bandwidth} \\times \\log_{2}(1 + \\text{SNR})$. The number of signal levels belongs to the Nyquist formula."
  },
  {
    "q": "In reality, we cannot have a noiseless channel; the channel is always noisy.",
    "type": "tf",
    "answer": true,
    "explain": "Slide wording. That is why the Nyquist bit rate is only a theoretical maximum and the Shannon capacity is the limit that counts."
  },
  {
    "q": "For Example 2 (1 MHz, SNR 63), which pair is the slide's answer?",
    "options": ["4 Mbps and 4 levels", "6 Mbps and 64 levels", "6 Mbps and 8 levels", "63 Mbps and 8 levels"],
    "answer": 2,
    "explain": "Slide: $C = 10^{6} \\log_{2} 64 = 6$ Mbps, then $\\log_{2} L = 3$, $L = 8$. The 4 Mbps and 4 levels pair is the textbook's version of the same example."
  },
  {
    "q": "A channel with a bandwidth of 2 kHz has to carry 16 kbps. What is the minimum SNR?",
    "type": "numeric",
    "answer": 255,
    "tolerance": 0.5,
    "explain": "$\\log_{2}(1 + \\text{SNR}) = 16000 / 2000 = 8$, so $1 + \\text{SNR} = 2^{8} = 256$ and $\\text{SNR} = 255$. In decibels that is $10 \\log_{10} 255 = 24.07$ dB."
  }
]
```
