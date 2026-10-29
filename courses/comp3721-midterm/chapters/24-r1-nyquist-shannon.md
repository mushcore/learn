---
title: "Review 1e: Nyquist and Shannon: the factor of 2, noiseless vs noisy"
minutes: 18
---
This lesson teaches the two formulas for the fastest a channel can send bits, one without noise and one with it. It prepares the exam question that gives a bandwidth and asks for a bit rate or a number of levels.

## What limits a bit rate, in plain words

A channel is the path the signal takes, such as a cable or a radio band. Its **bandwidth** is the range of frequencies it lets through, in Hz.

The slides say the data rate depends on three things. *The available bandwidth*, *the number of signal levels*, and *the quality of the channel (the level of noise)*.

A **level** is one of the distinct voltages the signal is allowed to sit at.

With 2 levels each signal element says 0 or 1, which is one bit. With 4 levels it can say 00, 01, 10 or 11, which is two bits.

So more levels carry more bits per element. But noise blurs levels that sit close together, which is why the noise sets a ceiling.

```diagram
{ "type": "grid", "title": "Each doubling of the levels adds one bit per element", "nodes": [
  { "id": "h0", "label": "Levels L", "row": 0, "col": 0 },
  { "id": "h1", "label": "2", "row": 0, "col": 1 },
  { "id": "h2", "label": "4", "row": 0, "col": 2 },
  { "id": "h3", "label": "8", "row": 0, "col": 3 },
  { "id": "h4", "label": "16", "row": 0, "col": 4 },
  { "id": "h5", "label": "64", "row": 0, "col": 5 },
  { "id": "r0", "label": "Bits = log₂ L", "row": 1, "col": 0 },
  { "id": "r1", "label": "1", "row": 1, "col": 1 },
  { "id": "r2", "label": "2", "row": 1, "col": 2 },
  { "id": "r3", "label": "3", "row": 1, "col": 3 },
  { "id": "r4", "label": "4", "row": 1, "col": 4 },
  { "id": "r5", "label": "6", "row": 1, "col": 5 }
], "hi": ["h3", "r3"], "caption": "log₂ L counts how many 2s multiply to L: 2 × 2 × 2 = 8, so 8 levels carry 3 bits." }
```

## log₂ on a calculator

Most calculators only have a base-10 log key. Divide by log 2 to get base 2.

$$\log_2 64 = \frac{\log 64}{\log 2} = \frac{1.80618}{0.30103} = \mathbf{6}$$

Check: 2⁶ = 64. Going back, key $2^{4.417}$ as 2, the $x^y$ key, then 4.417.

## A tiny case you can do in your head

A noiseless channel is 1 kHz wide and uses 4 levels. Each element carries 2 bits, and Nyquist allows twice the bandwidth in elements per second.

$$2 \times 1000 \times \log_2 4 = 2 \times 1000 \times 2 = \mathbf{4000\ bps}$$

Now a noisy channel, 1 kHz wide, with a signal 3 times stronger than the noise. Shannon adds 1 to that ratio and takes log₂.

$$1000 \times \log_2(1 + 3) = 1000 \times 2 = \mathbf{2000\ bps}$$

The noisy line has no 2 in front, so it allows less.

## The two formulas, with each symbol named

**Nyquist**, the theoretical maximum bit rate of a noiseless channel:

$$\text{BitRate} = 2 \times \text{bandwidth} \times \log_2 L$$

- BitRate in bps, bandwidth in Hz.
- $L$ is the number of signal levels, a plain count.

**Shannon**, the capacity of a noisy channel:

*In reality, we cannot have a noiseless channel; the channel is always noisy.*

$$C = \text{bandwidth} \times \log_2(1 + \text{SNR})$$

- $C$ is the capacity in bps, bandwidth in Hz.
- SNR is the signal-to-noise ratio: signal power divided by noise power, a plain number with no unit.

The review list's note: *we have a factor of 2 in Nyquist but not in the Shannon formula*. Shannon has no $L$ either.

```diagram
{ "type": "tree", "title": "Which formula? The three that start with 2, and Shannon", "nodes": [
  { "id": "q", "label": "A rate or a limit?", "sub": "read the cue words" },
  { "id": "two", "label": "Starts with 2", "sub": "no noise in the question", "parent": "q" },
  { "id": "no2", "label": "No 2", "sub": "noisy, SNR given", "parent": "q" },
  { "id": "ny", "label": "Nyquist bit rate", "sub": "2 × B × log₂ L (noiseless, levels)", "parent": "two" },
  { "id": "fs", "label": "Sampling rate", "sub": "f_s = 2 × f_max, samples per second", "parent": "two" },
  { "id": "nm", "label": "N_max of a digital signal", "sub": "c = ½ in 2 × B × log₂ L", "parent": "two" },
  { "id": "sh", "label": "Shannon capacity", "sub": "B × log₂(1 + SNR), SNR a ratio", "parent": "no2" }
], "hi": ["ny", "sh"], "caption": "This lesson uses the two highlighted nodes. Noiseless or levels: Nyquist, with the 2. Noisy or SNR: Shannon, without it." }
```

The other two that start with 2 belong to later topics. Sampling turns an analog signal into numbers, at twice its highest frequency.

N_max is the most bits a digital signal can carry in a given bandwidth.

## An SNR in decibels converts first

Shannon needs the SNR as a plain ratio. A question that gives it in decibels must be undone first.

$$\text{SNR} = 10^{\text{SNR}_{dB}/10}$$

A 3 kHz channel at 30 dB, done right:

$$\text{SNR} = 10^{30/10} = 10^{3} = \mathbf{1000}$$

$$C = 3000 \times \log_2(1 + 1000) = 3000 \times 9.967 = \mathbf{29\,902\ bps}$$

:::warn The 30 dB trap
Putting 30 in place of 1000 gives 3000 × log₂ 31 = 14 863 bps, about half the right answer.
:::

## The slide's Example 1, worked

*We need to send 265 kbps over a noiseless channel with a bandwidth of 30 kHz. How many signal levels do we need?*

Noiseless means Nyquist. Write it in bps and Hz, then solve for $L$.

$$265\,000 = 2 \times 30\,000 \times \log_2 L$$

$$\log_2 L = \frac{265\,000}{60\,000} = 4.417$$

$$L = 2^{4.417} = \mathbf{21.36\ levels}$$

*Since this result is not a power of 2, we need to either increase the number of levels or reduce the bit rate.*

Check: 16 levels give 240 kbps and 32 levels give 300 kbps, and 265 sits between.

```widget
data-rate
{ "show": "nyquist", "bandwidth": 30, "unit": "kHz", "levels": 16, "target": 265, "targetUnit": "kbps", "title": "Example 1: 265 kbps over a noiseless 30 kHz channel", "presets": { "Example 1 (noiseless 30 kHz)": { "show": "nyquist", "bandwidth": 30, "unit": "kHz", "levels": 16, "target": 265, "targetUnit": "kbps" }, "Example 2 (1 MHz, SNR 63)": { "bandwidth": 1, "unit": "MHz", "snr": 63, "levels": 8 } } }
```

## The slide's Example 2, worked

*We have a channel with a 1-MHz bandwidth. The SNR for this channel is 63. What are the appropriate bit rate and number of signal levels?*

The slide uses both formulas.

*The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need.*

Shannon first, for the limit:

$$C = 1\,000\,000 \times \log_2(1 + 63) = 1\,000\,000 \times 6 = \mathbf{6\ Mbps}$$

Then Nyquist, with that bit rate:

$$6\,000\,000 = 2 \times 1\,000\,000 \times \log_2 L$$

$$\log_2 L = 3 \qquad L = 2^{3} = \mathbf{8\ levels}$$

Check: 8 is a power of 2, and 2 × 1 MHz × 3 gives back exactly the 6 Mbps limit.

## Try it

```quiz
[
  {
    "q": "The Wi-Fi channel is a noisy 20 MHz channel with an SNR of 22 dB. What is its Shannon capacity, in Mbps? (One decimal.)",
    "type": "numeric",
    "answer": 146.3,
    "tolerance": 0.2,
    "unit": "Mbps",
    "explain": "Formula: SNR = 10^(SNR_dB/10), then C = B × log₂(1 + SNR).\nSubstitution: SNR = 10^2.2 = 158.49; C = 20 000 000 Hz × log₂(159.49) = 20 000 000 × 7.317.\nAnswer: 146.3 Mbps.\nCheck: no factor of 2; putting 22 in place of 158.49 gives 20 000 000 × log₂ 23 = 90.5 Mbps, the dB trap."
  },
  {
    "q": "The collector's link must carry 150 kbps over a noiseless 20 kHz channel. How many signal levels does Nyquist give? (Two decimals.)",
    "type": "numeric",
    "answer": 13.45,
    "tolerance": 0.01,
    "unit": "levels",
    "explain": "Formula: BitRate = 2 × B × log₂ L, so L = 2^(BitRate ÷ 2B).\nSubstitution: log₂ L = 150 000 bps ÷ (2 × 20 000 Hz) = 3.75; L = 2^3.75.\nAnswer: 13.45 levels.\nCheck: not a power of 2, so increase the levels (16 give 160 kbps) or reduce the bit rate (8 give 120 kbps)."
  },
  {
    "q": "A 500 kHz channel to the game server has an SNR of 1023. Shannon gives the upper limit; how many signal levels does Nyquist then need to reach it?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Formula: C = B × log₂(1 + SNR), then C = 2 × B × log₂ L.\nSubstitution: C = 500 000 Hz × log₂ 1024 = 500 000 × 10 = 5 000 000 bps; 5 000 000 = 2 × 500 000 × log₂ L, so log₂ L = 5.\nAnswer: L = 2⁵ = 32 levels.\nCheck: a power of 2, and 2 × 500 kHz × 5 gives back exactly 5 Mbps, the method of the slide's Example 2."
  },
  {
    "q": "A noiseless channel is 4 kHz wide and uses 8 signal levels. What is its maximum bit rate, in bps?",
    "type": "numeric",
    "answer": 24000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Formula: BitRate = 2 × bandwidth × log₂ L.\nSubstitution: 2 × 4000 Hz × log₂ 8 = 2 × 4000 × 3.\nAnswer: 24 000 bps.\nCheck: noiseless, so Nyquist with the 2; dropping the 2 would give 12 000 bps."
  },
  {
    "q": "True or false: the Shannon capacity formula has a factor of 2 in front, like the Nyquist formula.",
    "type": "tf",
    "answer": false,
    "explain": "Formula: C = bandwidth × log₂(1 + SNR).\nSubstitution: nothing multiplies the bandwidth.\nAnswer: false.\nCheck: the review note, a factor of 2 in Nyquist but not in the Shannon formula."
  },
  {
    "type": "free",
    "q": "Explain the difference between the Nyquist bit rate and the Shannon capacity, and why Example 2 uses both.",
    "model": "The Nyquist bit rate is the theoretical maximum bit rate of a noiseless channel, 2 × bandwidth × log₂ L. The Shannon capacity is the highest data rate of a noisy channel, bandwidth × log₂(1 + SNR), with no factor of 2 and no levels. Shannon gives the upper limit and Nyquist tells how many levels reach it: a 1 MHz channel with SNR 63 gives 6 Mbps, and 6 Mbps needs 8 levels.",
    "points": ["Nyquist is for a noiseless channel", "Shannon is for a noisy channel, with the SNR as a ratio", "Nyquist has the factor of 2 and the levels L; Shannon has neither", "Shannon gives the upper limit, Nyquist the number of levels", "An example with numbers, such as 6 Mbps and 8 levels"],
    "rows": 5,
    "explain": "Name both formulas in the slide's words, give the reason each exists, then the Example 2 numbers."
  }
]
```

## Remember

- "Noiseless" or "levels" is Nyquist, with the 2. "Noisy" or "SNR" is Shannon, without it.
- An SNR in dB goes through $10^{\text{dB}/10}$ before Shannon: 30 dB is 1000, not 30.
- log₂ x is log x ÷ log 2. A level count that is not a power of 2 means more levels or a lower bit rate.
- *On the sheet:* Sheet side 2, "Data rate limits: bandwidth, levels, noise", and Sheet side 4, "Which formula? The three that start with 2".

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "noiseless", "levels" | Nyquist: BitRate = 2 × B × log₂ L | bps or levels | L a power of 2 |
| "noisy", "SNR", "capacity" | Shannon: C = B × log₂(1 + SNR) | bps | no 2; SNR a ratio |
| "SNR in dB" plus "capacity" | SNR = 10^(SNR_dB/10), then Shannon | bps | 30 dB is 1000, not 30 |
