---
title: "Formula drill: pick the formula, then compute"
minutes: 30
---

Every weekly module drilled its formulas one at a time, under a heading that named the formula. The midterm gives no heading. This drill mixes every calculation type from Weeks 1 to 7, so the first step on each item is choosing the formula. Work on paper with your calculator, and write the formula and the units before the number.

## Part 1: which formula?

No numbers here. Each stem says what is given and what is asked; pick the formula you would write first.

```quiz
[
  {
    "q": "A noisy telephone line: its bandwidth and its SNR in dB are given. What is its highest data rate?",
    "options": ["bandwidth × log₂(1 + 10^(SNR_dB/10))", "bandwidth × log₂(1 + SNR_dB)", "2 × bandwidth × log₂ L", "2 × bandwidth × log₂(1 + SNR)"],
    "answer": 0,
    "explain": "Noisy channel, highest data rate: Shannon, Capacity = bandwidth × log₂(1 + SNR). The SNR must be a ratio, so convert first: SNR = 10^(SNR_dB/10). Shannon has no factor 2 and no L."
  },
  {
    "q": "A noiseless channel: its bandwidth and the required bit rate are given. How many signal levels are needed?",
    "options": ["L = 2^(BitRate / (2 × bandwidth))", "L = 2^(BitRate / bandwidth) − 1", "L = BitRate / (2 × bandwidth)", "L = log₂(BitRate / bandwidth)"],
    "answer": 0,
    "explain": "Noiseless: Nyquist, BitRate = 2 × bandwidth × log₂ L, solved for L. If L is not a power of 2, increase the levels or reduce the bit rate. 2^(C/B) − 1 is Shannon solved for the SNR."
  },
  {
    "q": "A low-pass analog signal: its bandwidth is given. What is the minimum sampling rate?",
    "options": ["f_s = 2 × bandwidth, because for a low-pass signal f_max = bandwidth", "f_s = 2 × bandwidth × log₂ L", "f_s = bandwidth / 2", "It cannot be found from the bandwidth alone"],
    "answer": 0,
    "explain": "Nyquist sampling: f_s = 2 f_max. For a low-pass signal the bandwidth equals the highest frequency. Only for a bandpass signal is the answer that it cannot be found."
  },
  {
    "q": "PCM: the highest frequency of a low-pass signal and the number of quantization levels L are given. What is the bit rate?",
    "options": ["2 × f_max × log₂ L", "f_max × log₂ L", "2 × f_max × L", "6.02 × log₂ L + 1.76"],
    "answer": 0,
    "explain": "Bit rate = f_s × n_b, with f_s = 2 f_max and n_b = log₂ L. 6.02 n_b + 1.76 is the quantization SNR in dB, not a rate."
  },
  {
    "q": "A line coding scheme: the data rate, the ratio r and the case factor c are given. What bandwidth does the signal need?",
    "options": ["B = c × N × 1/r", "B = (1/c) × N × r", "B = 2 × N × log₂ r", "B = N × r"],
    "answer": 0,
    "explain": "*The baud rate, not the bit rate, determines the required bandwidth*: B = c × N × 1/r, the same as S_avg. (1/c) × B × r runs the other way and gives N from B."
  },
  {
    "q": "n-QAM: the number of constellation points and the bit rate are given. What is the baud rate?",
    "options": ["S = N / log₂ n", "S = N × log₂ n", "S = N / n", "S = 2 × N / log₂ n"],
    "answer": 0,
    "explain": "Each point carries log₂ n bits, so r = log₂ n and S = N/r. The baud rate is at most the bit rate."
  },
  {
    "q": "FDM: n channels of bandwidth B with a guard band G between channels. What is the minimum link bandwidth?",
    "options": ["n × B + (n − 1) × G", "n × (B + G)", "n × B", "(n + 1) × G + n × B"],
    "answer": 0,
    "explain": "n channels sit side by side with a guard band between each neighbouring pair, so there are n − 1 guard bands."
  },
  {
    "q": "Synchronous TDM: n inputs at one rate, character units and 1 framing bit per frame. What is the link rate?",
    "options": ["frame rate × (n × bits per unit + 1)", "n × input rate", "n × input rate + 1", "frame rate × n"],
    "answer": 0,
    "explain": "The frame rate equals the input unit rate; each frame holds n units plus the framing bit, and the link carries every bit of every frame. n × input rate holds only without framing bits."
  },
  {
    "q": "The power at the start and at the end of a cable is given. What is the attenuation?",
    "options": ["10 log₁₀(P₂/P₁) dB", "20 log₁₀(P₂/P₁) dB", "P₂ − P₁ dB", "10 log₁₀(P₁ × P₂) dB"],
    "answer": 0,
    "explain": "dB = 10 log₁₀(P₂/P₁) for powers, negative when the signal is attenuated. 20 log₁₀ is for voltages. Both powers must be in the same prefix first."
  },
  {
    "q": "A signal power and the noise of each of k identical devices are given. What is the SNR?",
    "options": ["P_signal / (k × P_noise)", "P_signal / P_noise", "k × P_signal / P_noise", "10 log₁₀(P_signal) − k"],
    "answer": 0,
    "explain": "The noise powers of the k devices add (E03 exercise 2), and SNR = average signal power / average noise power, with both in the same prefix."
  },
  {
    "q": "A code must correct up to t errors in all cases. What minimum Hamming distance does it need?",
    "options": ["d_min = 2t + 1", "d_min = t + 1", "d_min = 2t", "d_min = t − 1"],
    "answer": 0,
    "explain": "Correcting t errors needs d_min = 2t + 1; detecting s errors needs d_min = s + 1."
  },
  {
    "q": "A sine wave's period is given, and it travels in a vacuum. What is its wavelength?",
    "options": ["λ = c × T", "λ = c / T", "λ = T / c", "λ = 1 / (c × T)"],
    "answer": 0,
    "explain": "λ = c/f, and f = 1/T, so λ = c × T with c = 3 × 10⁸ m/s."
  },
  {
    "q": "FM: the bandwidth of the modulating signal and β are given. What bandwidth does the modulated signal need?",
    "options": ["2(1 + β)B", "2B", "(1 + β)B", "2βB"],
    "answer": 0,
    "explain": "B_FM = 2(1 + β)B. 2B is AM. PM has no bandwidth formula on the slide."
  }
]
```

## Part 2: mixed calculations, every type

The items run across all seven weeks in no order. Some carry a trap on purpose: two prefixes in one question (mW and μW), a rate in kbps with an answer in kHz, an SNR given in dB, and a bandpass signal with only its bandwidth given. Enter the number in the unit the question asks for.

```quiz
[
  {
    "q": "A signal has a frequency of 40 kHz. What is its period, in μs?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0,
    "unit": "μs",
    "explain": "T = 1/f = 1/40 000 = 0.000025 s = 25 μs. Shortcut: 1/kHz gives ms, so 1/40 = 0.025 ms = 25 μs."
  },
  {
    "q": "A noiseless channel has a bandwidth of 12 kHz and the signal uses 8 levels. What is the maximum bit rate, in kbps?",
    "type": "numeric",
    "answer": 72,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "Nyquist: BitRate = 2 × 12 000 × log₂ 8 = 2 × 12 000 × 3 = 72 000 bps = 72 kbps."
  },
  {
    "q": "A signal at 2 mW comes out of a device at 200 μW. What is the change, in dB?",
    "type": "numeric",
    "answer": -10,
    "tolerance": 0,
    "unit": "dB",
    "explain": "Same prefix first: 2 mW = 2000 μW. dB = 10 log₁₀(200/2000) = 10 log₁₀ 0.1 = 10 × (−1) = −10 dB. Negative: attenuated. Dividing 200 by 2 without converting gives +20 dB, the trap."
  },
  {
    "q": "A low-pass analog signal has a bandwidth of 22 kHz. What is the minimum sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 44000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "Low-pass: f_max = bandwidth = 22 kHz. f_s = 2 f_max = 44 000 samples/s."
  },
  {
    "q": "A bandpass analog signal has a bandwidth of 30 kHz. What is its minimum sampling rate?",
    "options": ["It cannot be found from the bandwidth alone", "60 000 samples/s", "30 000 samples/s", "15 000 samples/s"],
    "answer": 0,
    "explain": "*We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.* A bandpass signal's bandwidth is less than its highest frequency: 30 kHz could be 20 to 50 kHz or 470 to 500 kHz, and the second needs a sampling rate ten times higher."
  },
  {
    "q": "A network of 11 devices is wired as a full mesh. How many links does it need?",
    "type": "numeric",
    "answer": 55,
    "tolerance": 0,
    "unit": "links",
    "explain": "Mesh: n(n − 1)/2 = 11 × 10 / 2 = 55 duplex links. A star would need 11."
  },
  {
    "q": "A line code carries 600 kbps with r = 2 and c = 1/2. What bandwidth does it need, in kHz?",
    "type": "numeric",
    "answer": 150,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B = c × N × 1/r = 1/2 × 600 000 × 1/2 = 150 000 Hz = 150 kHz. The data rate is in kbps; the bandwidth is in kHz, and the two are not the same number here."
  },
  {
    "q": "What is the frequency of s(t) = 7 sin(50πt), in Hz?",
    "type": "numeric",
    "answer": 25,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "Match the coefficient of t with 2πf: 2πf = 50π, so f = 25 Hz (T = 0.04 s). The amplitude is 7 V."
  },
  {
    "q": "A channel has a bandwidth of 5 kHz and an SNR_dB of 25 dB. What is its capacity, in bps? (Nearest whole bps.)",
    "type": "numeric",
    "answer": 41547,
    "tolerance": 2,
    "unit": "bps",
    "explain": "Convert the dB first: SNR = 10^(25/10) = 10^2.5 = 316.23. Shannon: C = 5000 × log₂(1 + 316.23) = 5000 × 8.3094 = 41 547 bps. Putting 25 in place of 316.23 gives 5000 × log₂ 26 = 23 502 bps, the trap."
  },
  {
    "q": "Five channels of 250 kbps each are multiplexed by synchronous TDM with 1-bit slots and no framing bits. What is the link bit rate, in Mbps?",
    "type": "numeric",
    "answer": 1.25,
    "tolerance": 0,
    "unit": "Mbps",
    "explain": "Link bit rate = n × input rate = 5 × 250 kbps = 1250 kbps = 1.25 Mbps. The frame rate is the input unit rate, 250 000 frames/s, and the frame lasts 4 μs."
  },
  {
    "q": "On that link, what is the bit duration, in μs?",
    "type": "numeric",
    "answer": 0.8,
    "tolerance": 0,
    "unit": "μs",
    "explain": "Bit duration = 1 / link rate = 1 / 1 250 000 = 0.0000008 s = 0.8 μs, n = 5 times shorter than an input bit (4 μs)."
  },
  {
    "q": "How many bits differ between 1100110 and 1010011? (The Hamming distance.)",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "XOR and count the 1s: 1100110 ⊕ 1010011 = 0110101, which has four 1s, so d = 4."
  }
]
```

```quiz
[
  {
    "q": "A periodic composite signal has a bandwidth of 40 kHz and a middle frequency of 140 kHz. What is its highest frequency, in kHz?",
    "type": "numeric",
    "answer": 160,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "f_h − f_l = 40 and f_h + f_l = 2 × 140 = 280. Adding: 2 f_h = 320, f_h = 160 kHz (f_l = 120 kHz)."
  },
  {
    "q": "A signal of 40 mW passes through 8 devices, each adding 1.25 μW of noise. What is the SNR?",
    "type": "numeric",
    "answer": 4000,
    "tolerance": 0,
    "explain": "Noise adds: 8 × 1.25 = 10 μW. Same prefix: 40 mW = 40 000 μW. SNR = 40 000 / 10 = 4000, a plain ratio."
  },
  {
    "q": "What is that SNR in dB? (Two decimals.)",
    "type": "numeric",
    "answer": 36.02,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "SNR_dB = 10 log₁₀ 4000 = 10 × 3.602 = 36.02 dB."
  },
  {
    "q": "A noiseless 8 kHz channel must carry 96 kbps. How many signal levels does it need?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Nyquist solved for L: log₂ L = 96 000 / (2 × 8000) = 6, so L = 2⁶ = 64 levels, a power of 2, so no rounding is needed."
  },
  {
    "q": "A 4 kHz channel must carry 36 kbps. What SNR (as a ratio) does it need at the Shannon limit?",
    "type": "numeric",
    "answer": 511,
    "tolerance": 0,
    "explain": "SNR = 2^(C/B) − 1 = 2^(36 000/4000) − 1 = 2⁹ − 1 = 511 (about 27.08 dB)."
  },
  {
    "q": "32-QAM carries 40 kbps. What is its baud rate, in baud?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 0,
    "unit": "baud",
    "explain": "r = log₂ 32 = 5 bits per signal element. S = N/r = 40 000 / 5 = 8000 baud."
  },
  {
    "q": "3 mW enters 8 km of cable that loses 0.25 dB/km. What power comes out, in mW? (Two decimals.)",
    "type": "numeric",
    "answer": 1.89,
    "tolerance": 0.01,
    "unit": "mW",
    "explain": "Cable dB = −0.25 × 8 = −2 dB. P₂ = P₁ × 10^(dB/10) = 3 × 10^(−0.2) = 3 × 0.631 = 1.89 mW."
  },
  {
    "q": "A signal passes a −7 dB cable, a +10 dB amplifier and a −6 dB cable. What is the total change, in dB?",
    "type": "numeric",
    "answer": -3,
    "tolerance": 0,
    "unit": "dB",
    "explain": "Decibels along a path add: −7 + 10 − 6 = −3 dB. The power at the end is about half the power at the start."
  },
  {
    "q": "A low-pass audio signal with a highest frequency of 6 kHz is digitized by PCM with L = 32. What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "f_s = 2 × 6000 = 12 000 samples/s; n_b = log₂ 32 = 5 bits. Bit rate = f_s × n_b = 12 000 × 5 = 60 000 bps = 60 kbps."
  },
  {
    "q": "A sine wave is shifted by 1/3 of a cycle. What is its phase, in degrees?",
    "type": "numeric",
    "answer": 120,
    "tolerance": 0,
    "unit": "°",
    "explain": "φ = fraction of a cycle × 360° = 1/3 × 360 = 120° (2π/3 rad)."
  },
  {
    "q": "A code must correct up to 3 errors in all cases. What minimum Hamming distance does it need?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "explain": "d_min = 2t + 1 = 2 × 3 + 1 = 7. That code also detects up to d_min − 1 = 6 errors."
  },
  {
    "q": "A receiver's clock is 0.2% faster than the sender's at 5 Mbps. How many extra bits per second does it receive?",
    "type": "numeric",
    "answer": 10000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Extra bps = N × p% = 5 000 000 × 0.002 = 10 000 bps: the receiver reads 5 010 000 bits each second."
  }
]
```

```quiz
[
  {
    "q": "What is the wavelength of a 1.5 GHz signal in a vacuum, in cm?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "cm",
    "explain": "λ = c/f = 3 × 10⁸ / 1.5 × 10⁹ = 0.2 m = 20 cm."
  },
  {
    "q": "Eight channels of 25 kHz each are multiplexed by FDM with a 3 kHz guard band between channels. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 221,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_link = n × B + (n − 1) × G = 8 × 25 + 7 × 3 = 200 + 21 = 221 kHz."
  },
  {
    "q": "A 1 MHz link carries 120 kHz channels with a 20 kHz guard band between them. How many channels fit at most?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "channels",
    "explain": "n × 120 + (n − 1) × 20 ≤ 1000 gives 140n ≤ 1020, n ≤ 7.29, so 7 channels (7 × 120 + 6 × 20 = 960 kHz). Eight would need 1100 kHz."
  },
  {
    "q": "A bit rate of 4 Mbps: what is the bit duration, in ns?",
    "type": "numeric",
    "answer": 250,
    "tolerance": 0,
    "unit": "ns",
    "explain": "Bit duration = 1/bit rate = 1 / 4 000 000 = 0.00000025 s = 0.25 μs = 250 ns."
  },
  {
    "q": "At that rate, on a cable with a propagation speed of 2 × 10⁸ m/s, what is the bit length, in m?",
    "type": "numeric",
    "answer": 50,
    "tolerance": 0,
    "unit": "m",
    "explain": "Bit length = propagation speed × bit duration = 2 × 10⁸ × 250 × 10⁻⁹ = 50 m."
  },
  {
    "q": "A constellation point has I = 8 V and Q = 15 V. What is its amplitude, in V?",
    "type": "numeric",
    "answer": 17,
    "tolerance": 0,
    "unit": "V",
    "explain": "Amplitude² = I² + Q² = 64 + 225 = 289, so the amplitude (the length of the line to the point) is 17 V."
  },
  {
    "q": "A signal is quantized between −6 V and +10 V with L = 16. What is the zone height Δ, in V?",
    "type": "numeric",
    "answer": 1,
    "tolerance": 0,
    "unit": "V",
    "explain": "Δ = (V_max − V_min)/L = (10 − (−6))/16 = 16/16 = 1 V. The quantization error is then at most Δ/2 = 0.5 V."
  },
  {
    "q": "A PCM system uses 10 bits per sample. What SNR_dB does the quantization error allow? (Two decimals.)",
    "type": "numeric",
    "answer": 61.96,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "SNR_dB = 6.02 n_b + 1.76 = 60.2 + 1.76 = 61.96 dB."
  },
  {
    "q": "A low-pass analog signal of 15 kHz is digitized with 12 bits per sample (c = 1/2, r = 1). What is the minimum bandwidth of the digital signal, in kHz?",
    "type": "numeric",
    "answer": 180,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_min = c × n_b × 2 × B_analog × 1/r = n_b × B_analog = 12 × 15 = 180 kHz, twelve times the analog bandwidth."
  },
  {
    "q": "An audio signal of bandwidth 7.5 kHz is sent by AM. What bandwidth does it need, in kHz?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_AM = 2B = 2 × 7.5 = 15 kHz, centred on the carrier."
  },
  {
    "q": "A 12 kHz signal is sent by FM with β = 2. What bandwidth does it need, in kHz?",
    "type": "numeric",
    "answer": 72,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_FM = 2(1 + β)B = 2 × 3 × 12 = 72 kHz."
  },
  {
    "q": "BFSK carries 4 kbps with d = 0.5 and 2Δf = 6 kHz (Δf = 3 kHz). What is its bandwidth, in kHz?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "FSK: r = 1, S = N = 4000 baud, B = (1 + d)S + 2Δf = 1.5 × 4000 + 6000 = 12 000 Hz = 12 kHz. The slides leave d undefined; the question gives it."
  },
  {
    "q": "A signal uses 20 levels. How many bits does each level carry, rounded up as the slides do?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "unit": "bits",
    "explain": "log₂ 20 = 4.32, which is not realistic, so ⌈log₂ 20⌉ = 5 bits (32 patterns, 12 unused)."
  },
  {
    "q": "A link has a bandwidth of 2 Mbps and a delay of 4 ms. How many bits can fill the link?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bandwidth-delay product = 2 000 000 × 0.004 = 8000 bits."
  },
  {
    "q": "A sender transmits 5 pages per second, each of 40 lines of 90 characters, at 8 bits per character. What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 144,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "5 × 40 × 90 × 8 = 144 000 bps = 144 kbps."
  },
  {
    "q": "A channel has a bandwidth of 40 kHz and a line code with 16 levels (r = log₂ 16, c = 1/2). What is N_max, in kbps?",
    "type": "numeric",
    "answer": 320,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "N_max = (1/c) × B × r = 2 × 40 000 × 4 = 320 000 bps = 320 kbps, the Nyquist bit rate 2 × B × log₂ L."
  }
]
```

The Week 7 items: bit strings are typed without spaces, counts are numbers.

```quiz
[
  {
    "q": "A block code has k = 5 and n = 7. How many invalid codewords does it have?",
    "type": "numeric",
    "answer": 96,
    "tolerance": 0,
    "unit": "codewords",
    "explain": "2ⁿ − 2ᵏ = 2⁷ − 2⁵ = 128 − 32 = 96 invalid codewords; 32 are valid."
  },
  {
    "q": "Noise lasting 0.5 ms hits a 20 Mbps link. How many bits does it affect?",
    "type": "numeric",
    "answer": 10000,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bits affected = data rate × noise duration = 20 000 000 × 0.0005 = 10 000 bits, a burst error."
  },
  {
    "q": "Dataword 1110, divisor 1011. What is the CRC remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["100"],
    "explain": "Append n − k = 3 zeros: 1110000. Slide-38 layout: 1110 ⊕ 1011 = 0101 → bring down 0 → 1010 ⊕ 1011 = 0001 → bring down 0 → 0010, leftmost bit 0: ⊕ 0000 = 0010 → bring down 0 → 0100 ⊕ 0000 = 0100. Remainder 100, quotient 1100 (discarded). Codeword 1110100; its syndrome is 000."
  },
  {
    "q": "4-bit words 6, 13, 11, 8. What is the checksum? Type it as 4 bits or in decimal.",
    "type": "text",
    "answer": ["0111", "7"],
    "explain": "Sum = 6 + 13 + 11 + 8 = 38 = 100110. Wrap: 10 + 0110 = 0010 + 0110 = 1000 = 8, which fits in 4 bits. Complement: 15 − 8 = 7 = 0111."
  },
  {
    "q": "XOR forward error correction sends one redundant chunk for every 5 data chunks. What percent of extra data is that?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "%",
    "explain": "Overhead = 1/N = 1/5 = 20 percent. It rebuilds one lost chunk per group of 5."
  },
  {
    "q": "How many extra bits does bit stuffing add to the data 0111110111111?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Add a 0 whenever five consecutive 1s follow a 0: 0 11111 → stuff 0 → 0 11111 → stuff 0 → 1. Stuffed: 011111001111101, 15 bits from 13."
  }
]
```

### The calculators for checking Part 2

Use them after you have an answer on paper: Shannon and Nyquist on one channel, decibels with prefixes, and a line code's S, B and N_max.

```widget
data-rate
{ "bandwidth": 5, "unit": "kHz", "snr": 316.23, "levels": 2, "title": "Shannon and Nyquist on one channel", "presets": { "5 kHz, 25 dB (SNR 316.23)": { "bandwidth": 5, "unit": "kHz", "snr": 316.23, "levels": 2 }, "Noiseless 8 kHz, want 96 kbps": { "show": "nyquist", "bandwidth": 8, "unit": "kHz", "levels": 64, "target": 96, "targetUnit": "kbps" }, "Noiseless 12 kHz, 8 levels": { "show": "nyquist", "bandwidth": 12, "unit": "kHz", "levels": 8 } } }
```

```widget
decibel
{ "p1": 3, "p1Unit": "mW", "perKm": -0.25, "km": 8, "title": "Decibels with prefixes", "presets": { "3 mW into 8 km at −0.25 dB/km": { "p1": 3, "p1Unit": "mW", "perKm": -0.25, "km": 8 }, "2 mW to 200 μW": { "p1": 2, "p1Unit": "mW", "p2": 200, "p2Unit": "μW" } } }
```

```widget
signal-rate
{ "show": "bandwidth", "N": 600, "unit": "kbps", "r": "2", "c": "1/2", "title": "S, B and N max of a line code", "presets": { "600 kbps, r = 2: bandwidth": { "show": "bandwidth", "N": 600, "unit": "kbps", "r": "2", "c": "1/2" }, "N max: 40 kHz, 16 levels": { "show": "nyquist", "B": 40, "bUnit": "kHz", "c": "1/2", "levels": 16 } } }
```

## Part 3: four cross-week chains

Each chain feeds one week's answer into the next week's formula, which is where a wrong unit carries forward. Work the whole chain on paper, then enter each step.

### Chain (a): PCM voice into TDM with a framing bit

Four voice channels, each low-pass with a highest frequency of 4 kHz, are digitized by PCM at 8 bits per sample. A synchronous TDM multiplexer combines them with 8-bit slots and 1 framing bit per frame.

```quiz
[
  {
    "q": "What is the sampling rate of each channel, in samples per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "f_s = 2 f_max = 2 × 4000 = 8000 samples/s (Week 5)."
  },
  {
    "q": "What is the bit rate of each digitized channel, in bps?",
    "type": "numeric",
    "answer": 64000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Bit rate = f_s × n_b = 8000 × 8 = 64 000 bps = 64 kbps, the E05 voice number."
  },
  {
    "q": "What is the frame rate of the multiplexer, in frames per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "*The frame rate is always the same as any input rate*, counted in units: one 8-bit unit (one sample) per channel per frame, 64 000 / 8 = 8000 frames/s."
  },
  {
    "q": "How many bits are in each frame?",
    "type": "numeric",
    "answer": 33,
    "tolerance": 0,
    "unit": "bits",
    "explain": "n × unit + framing = 4 × 8 + 1 = 33 bits."
  },
  {
    "q": "What is the link rate, in bps?",
    "type": "numeric",
    "answer": 264000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Link rate = frame rate × bits per frame = 8000 × 33 = 264 000 bps = 264 kbps. Without the framing bit it would be 4 × 64 = 256 kbps; the framing bit adds 8000 bps."
  }
]
```

```widget
tdm-frames
{ "n": 4, "rate": 64, "unit": "kbps", "slot": 8, "framing": true, "title": "Four 64 kbps PCM channels, 8-bit slots, 1 framing bit" }
```

### Chain (b): SNR in dB, then Shannon, then Nyquist

A channel has a bandwidth of 500 kHz and an SNR_dB of 30 dB.

```quiz
[
  {
    "q": "How much is the SNR, as a plain ratio?",
    "type": "numeric",
    "answer": 1000,
    "tolerance": 0,
    "explain": "SNR = 10^(30/10) = 10³ = 1000."
  },
  {
    "q": "What is the Shannon capacity, in Mbps? (Two decimals.)",
    "type": "numeric",
    "answer": 4.98,
    "tolerance": 0.01,
    "unit": "Mbps",
    "explain": "C = 500 000 × log₂(1 + 1000) = 500 000 × 9.967 = 4 983 600 bps = 4.98 Mbps. This is the upper limit."
  },
  {
    "q": "What number of levels does the Nyquist formula give for that capacity? (Two decimals.)",
    "type": "numeric",
    "answer": 31.64,
    "tolerance": 0.02,
    "unit": "levels",
    "explain": "log₂ L = C / (2 × B) = 4 983 600 / 1 000 000 = 4.98, so L = 2^4.98 = 31.64 levels. Not a power of 2."
  },
  {
    "q": "Which power of 2 should the signal use, and why?",
    "options": ["16 levels: 32 would need 5 Mbps, above the capacity, so the bit rate is reduced", "32 levels: always round the levels up", "31 levels: the nearest whole number", "64 levels: more levels give more speed"],
    "answer": 0,
    "explain": "The slide's rule is to increase the levels or reduce the bit rate. Shannon caps the rate at 4.98 Mbps: 32 levels give 2 × 500 000 × 5 = 5 Mbps, which is too much, so reduce to 16 levels and 2 × 500 000 × 4 = 4 Mbps."
  },
  {
    "q": "With that choice, how many bits does each level carry?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "log₂ 16 = 4 bits per level, for a bit rate of 4 Mbps."
  }
]
```

```widget
data-rate
{ "bandwidth": 500, "unit": "kHz", "snr": 1000, "levels": 16, "title": "500 kHz, SNR_dB 30: capacity, then levels" }
```

### Chain (c): 16-QAM from bit rate to bandwidth

16-QAM carries 48 Mbps, with d = 0.

```quiz
[
  {
    "q": "How many bits does each signal element carry (r)?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "r = log₂ n = log₂ 16 = 4 bits per signal element."
  },
  {
    "q": "What is the baud rate, in Mbaud?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "S = N/r = 48 / 4 = 12 Mbaud."
  },
  {
    "q": "What bandwidth does the signal need, in MHz?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "QAM needs the same minimum bandwidth as ASK and PSK: B = (1 + d)S = (1 + 0) × 12 = 12 MHz. Bandwidth follows the baud rate, not the bit rate; BPSK at 48 Mbps would need 48 MHz."
  }
]
```

### Chain (d): a PCM audio system from L to bandwidth

Audio with a highest frequency of 20 kHz (low-pass) is digitized by PCM with L = 256 levels, c = 1/2 and r = 1.

```quiz
[
  {
    "q": "How many bits per sample is that (n_b)?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bits",
    "explain": "n_b = log₂ L = log₂ 256 = 8 bits."
  },
  {
    "q": "What SNR_dB does the quantization error allow? (Two decimals.)",
    "type": "numeric",
    "answer": 49.92,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "SNR_dB = 6.02 n_b + 1.76 = 48.16 + 1.76 = 49.92 dB."
  },
  {
    "q": "What is the minimum sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 40000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "f_s = 2 f_max = 2 × 20 000 = 40 000 samples/s."
  },
  {
    "q": "What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 320,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "Bit rate = f_s × n_b = 40 000 × 8 = 320 000 bps = 320 kbps."
  },
  {
    "q": "What is the minimum bandwidth of the digital signal, in kHz?",
    "type": "numeric",
    "answer": 160,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_min = c × n_b × 2 × B_analog × 1/r = n_b × B_analog = 8 × 20 = 160 kHz. *This is the price we pay for digitization.*"
  }
]
```

```widget
pcm-calc
{ "fmax": 20, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1", "presets": { "20 kHz audio, L = 256": { "fmax": 20, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" }, "6 kHz, L = 32": { "fmax": 6, "unit": "kHz", "levels": 32, "c": "1/2", "r": "1" }, "15 kHz, 12 bits": { "fmax": 15, "unit": "kHz", "bits": 12, "c": "1/2", "r": "1" } } }
```

```widget
fdm-plan
{ "n": 8, "bandwidth": 25, "unit": "kHz", "guard": 3, "start": 0, "presets": { "Eight 25 kHz channels, 3 kHz guard": { "n": 8, "bandwidth": 25, "unit": "kHz", "guard": 3, "start": 0 }, "Seven 120 kHz channels, 20 kHz guard": { "n": 7, "bandwidth": 120, "unit": "kHz", "guard": 20, "start": 0 } } }
```

Lessons for each type: [Nyquist](#/comp3721-w3/nyquist), [Shannon](#/comp3721-w3/shannon), [attenuation and the decibel](#/comp3721-w3/attenuation-decibel), [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr), [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate), [bandwidth of a digital signal](#/comp3721-w4/digital-bandwidth), [encoding and bit rate](#/comp3721-w5/encoding-bit-rate), [quantization error and bandwidth](#/comp3721-w5/quantization-error-bandwidth), [constellation diagrams](#/comp3721-w5/constellation), [AM, FM and PM](#/comp3721-w5/am-fm-pm), [FDM](#/comp3721-w6/fdm), [synchronous TDM](#/comp3721-w6/synchronous-tdm), [E06 worked](#/comp3721-w6/e06-worked), [Hamming distance](#/comp3721-w7/hamming-distance), [CRC division](#/comp3721-w7/crc-division), [checksum](#/comp3721-w7/checksum), [bit stuffing](#/comp3721-w7/bit-stuffing).
