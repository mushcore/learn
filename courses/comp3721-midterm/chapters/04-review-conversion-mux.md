---
title: "Review items 6 to 11: PCM, modulation, multiplexing, levels, ARP"
minutes: 25
---

Review items 6 to 11 are Weeks 5 and 6: turning an analog signal into bits, putting bits and analog signals onto a carrier, sharing one link among many signals, the log₂ rule for levels and constellation points, and ARP. Each point starts with a question to answer cold, then the facts in the slides' words, then the lesson that teaches it.

## 6a. PCM samples, quantizes and encodes, at f_s = 2 f_max

Recall first: one low-pass analog signal with a highest frequency of 12 kHz is digitized by PCM with L = 128 quantization levels. Work the chain on paper, then enter each step.

```quiz
[
  {
    "q": "What is the minimum (Nyquist) sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 24000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "$f_s = 2 f_{max} = 2 \\times 12\\,000 = 24\\,000$ samples/s. For a low-pass signal the bandwidth is the highest frequency."
  },
  {
    "q": "How many bits per sample does L = 128 give?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$n_b = \\log_2 L = \\log_2 128 = 7$ bits per sample."
  },
  {
    "q": "What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 168,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "Bit rate = sampling rate × bits per sample $= 24\\,000 \\times 7 = 168\\,000$ bps $= 168$ kbps."
  },
  {
    "q": "What is the minimum bandwidth of the digitized signal (c = 1/2, r = 1), in kHz?",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "$B_{min} = c \\times n_b \\times 2 \\times B_{analog} \\times 1/r = \\frac{1}{2} \\times 7 \\times 2 \\times 12 \\times 1 = n_b \\times B_{analog} = 84$ kHz, seven times the analog bandwidth."
  },
  {
    "q": "What is the SNR_dB contributed by the quantization error? (Two decimals.)",
    "type": "numeric",
    "answer": 43.9,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "$\\text{SNR}_{dB} = 6.02 n_b + 1.76 = 6.02 \\times 7 + 1.76 = 42.14 + 1.76 = 43.90$ dB."
  },
  {
    "q": "A bandpass signal has a bandwidth of 60 kHz. What is its minimum sampling rate?",
    "options": ["It cannot be found from the bandwidth alone", "120 000 samples/s", "60 000 samples/s", "240 000 samples/s"],
    "answer": 0,
    "explain": "*We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.* For a bandpass signal the bandwidth is less than the highest frequency; only a low-pass signal has bandwidth = highest frequency."
  }
]
```

- *Pulse Code Modulation (PCM): The most commonly used technique for digitization.* Three processes: sampling, quantizing, encoding.
- *Pulse Amplitude Modulation (PAM) → another name for sampling process.* Three sampling methods: ideal (cannot be easily implemented), natural (a high-speed switch), flat-top or sample-and-hold (*The most commonly used method*).
- Boxed: *According to the Nyquist theorem, to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal.* f_N = 2 f_max; Nyquist interval 1/(2 f_max).
- *Bit rate = Sampling rate × Number of bits per sample = f_s × n_b*. E05: 4 kHz voice, 8 bits → 8000 samples/s, 64 kbps.
- B_min = n_b × B_analog at c = 1/2, r = 1: *The minimum bandwidth of the digital signal is n_b times greater than the bandwidth of the analog signal. This is the price we pay for digitization.* E05: L = 64 → 6 bits, 300 MHz → 1.8 GHz.

```widget
pcm-calc
{ "fmax": 12, "unit": "kHz", "levels": 128, "c": "1/2", "r": "1", "presets": { "12 kHz, L = 128": { "fmax": 12, "unit": "kHz", "levels": 128, "c": "1/2", "r": "1" }, "E05 1 voice": { "fmax": 4, "unit": "kHz", "levels": 256, "c": "1/2", "r": "1" }, "E05 2": { "fmax": 300, "unit": "MHz", "levels": 64, "c": "1/2", "r": "1" } } }
```

Lesson: [Digitization and PCM](#/comp3721-w5/digitization-pcm), [sampling methods](#/comp3721-w5/sampling-methods), [Nyquist sampling](#/comp3721-w5/nyquist-sampling), [encoding and bit rate](#/comp3721-w5/encoding-bit-rate), [E05 worked](#/comp3721-w5/e05-worked).

## 6b. Quantization: Δ = (V_max − V_min)/L, codes 0 to L − 1 from the bottom

Recall first: a signal between −12 V and +12 V is quantized with L = 8.

```quiz
[
  {
    "q": "What is the zone height Δ, in V?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "V",
    "explain": "$\\Delta = (V_{max} - V_{min})/L = (12 - (-12))/8 = 24/8 = 3$ V."
  },
  {
    "q": "A sample of 4.4 V: what is its encoded word? (Type the 3 bits without spaces.)",
    "type": "text",
    "answer": ["101"],
    "explain": "Normalized PAM $= 4.4/3 = 1.47$, which lies between 1Δ and 2Δ: zone 5 (zones run 0 at the bottom, −4Δ to −3Δ, up to 7 at the top). Its midpoint is 1.5, so the normalized error is $1.5 - 1.47 = +0.03$. Code 5 in $n_b = 3$ bits is 101."
  },
  {
    "q": "What is the largest quantization error for this quantizer, in V?",
    "type": "numeric",
    "answer": 1.5,
    "tolerance": 0,
    "unit": "V",
    "explain": "$-\\Delta/2 \\le$ quantization error $\\le \\Delta/2$, so at most $3/2 = 1.5$ V either way."
  }
]
```

- Steps: divide the range V_min to V_max into L zones of height Δ = (V_max − V_min)/L; assign quantized values 0 to L − 1 to the zone midpoints; approximate each sample to its zone's value.
- Normalized PAM value = actual amplitude / Δ; normalized error = normalized quantized value − normalized PAM value. Slide: −6.1 V with Δ = 5 → −1.22 → zone 2 → midpoint −1.50 → error −0.28 → 010.
- *−Δ/2 ≤ quantization error ≤ Δ/2*. Boxed: *SNR_dB = 6.02 n_b + 1.76 dB*. The quantization error lowers the SNR, so the Shannon upper limit decreases.
- Nonuniform quantization, the slide's sentence: *In nonuniform quantization, height of Δ is not fixed; it is greater near the lower amplitudes and less near the higher amplitudes.* The textbook may say the reverse; an in-class answer replaces this.

Type a code for each of the six samples, then Check.

```widget
quantizer
{ "vmin": -12, "vmax": 12, "levels": 8, "samples": "-10.2 4.4 7.9 -1.3 11.5 0.6", "draw": true, "title": "−12 V to +12 V, L = 8: type each sample's quantization code" }
```

Lesson: [Quantization](#/comp3721-w5/quantization), [quantization error and bandwidth](#/comp3721-w5/quantization-error-bandwidth).

## 7a. ASK, FSK and PSK each vary one carrier characteristic; QAM combines ASK and PSK

Recall first.

```quiz
[
  {
    "q": "Why is PSK less susceptible to noise than ASK?",
    "options": ["Noise can change the amplitude easier than it can change the phase", "PSK uses two carrier frequencies", "PSK needs less bandwidth than ASK", "PSK sends more bits per signal element"],
    "answer": 0,
    "explain": "Slide 17: *Because noise can change the amplitude easier than it can change the phase.* The price: PSK needs more sophisticated hardware to tell the phases apart. BPSK has the same bandwidth as BASK."
  },
  {
    "q": "BASK carries 5 kbps with d = 0.25. What is its bandwidth, in Hz?",
    "type": "numeric",
    "answer": 6250,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "ASK: r = 1, S = N = 5000 baud, B = (1 + d)S $= 1.25 \\times 5000 = 6250$ Hz. The slides leave d undefined; it is a factor between 0 and 1 (textbook)."
  }
]
```

| Technique | Varies | Constant | Bandwidth box |
|---|---|---|---|
| ASK (BASK = OOK) | amplitude | frequency, phase | r = 1, S = N, B = (1 + d)S |
| FSK (BFSK: f₁ for 0, f₂ for 1) | frequency | peak amplitude, phase | r = 1, S = N, B = (1 + d)S + 2Δf |
| PSK (BPSK: 0° and 180°) | phase | peak amplitude, frequency | r = 1, S = N, B = (1 + d)S |
| QAM | amplitude and phase, on two carriers 90° apart | | the same minimum bandwidth as ASK and PSK |

- *In analog transmission of digital data, r = log₂ L (L is the number of different signal elements/levels) and baud rate ≤ bit rate (S = N/r).*
- PSK is more common than ASK or FSK; QAM is *The dominant method of digital-to-analog modulation*, used in 802.11 Wi-Fi.

```widget
shift-keying
{ "bits": "10110", "scheme": "psk", "schemes": ["ask", "fsk", "psk", "qam"], "cycles": 3, "title": "ASK, FSK, PSK and 8-QAM on the same bits" }
```

Lesson: [ASK, FSK and PSK](#/comp3721-w5/ask-fsk-psk).

## 7b. A constellation point: length is amplitude, angle is phase

Recall first.

```quiz
[
  {
    "q": "A constellation has 64 points. How many bits does each signal element carry?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "bits",
    "explain": "*A modulation with n constellation points transmits log₂ n bits per signal element*: $\\log_2 64 = 6$ bits."
  },
  {
    "q": "One of its points has an amplitude of 13 V and an in-phase component of 5 V. What is the quadrature component, in V?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0,
    "unit": "V",
    "explain": "Amplitude² = I² + Q²: $13^2 = 5^2 + Q^2$, so $Q^2 = 169 - 25 = 144$ and Q = 12 V (E05 exercise 4's method: 5, 3, 4)."
  },
  {
    "q": "64-QAM carries 36 Mbps. What is its baud rate, in Mbaud?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "r = log₂ 64 = 6 bits per signal element; S = N/r $= 36/6 = 6$ Mbaud. The baud rate is at most the bit rate (8-QAM on the slide: 24 bps at 8 baud)."
  }
]
```

- Axes: X the in-phase carrier (I), Y the quadrature carrier (Q). A dot's *Length: amplitude*, its *Angle: phase*.
- Slide examples: OOK (0 at the origin, 1 on the I axis); BASK at 1 V and 3 V; BPSK (0 at −1 V, 1 at +1 V); BPSK at 2 V; 8-QAM with 1 V and 3 V on four phases. n-QAM: 4 bits → 16-QAM, 6 → 64-QAM, 8 → 256-QAM.

```widget
constellation
{ "solve": { "amplitude": 13, "i": 5, "points": 64 }, "title": "13 V and I = 5 V: find Q" }
```

```widget
constellation
{ "preset": "8-QAM 1 V and 3 V", "draw": true, "title": "Draw the slide's 8-QAM from memory" }
```

Lesson: [Constellation diagrams](#/comp3721-w5/constellation), [E05 worked](#/comp3721-w5/e05-worked).

## 8. AM doubles the bandwidth; FM takes 2(1 + β)B; PM has no formula on the slide

Recall first.

```quiz
[
  {
    "q": "An audio signal of bandwidth 4 kHz is sent by AM. What bandwidth does the modulated signal need, in kHz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "$B_{AM} = 2B = 2 \\times 4 = 8$ kHz, centred on the carrier frequency."
  },
  {
    "q": "A 10 kHz signal is sent by FM with β = 3. What bandwidth does it need, in kHz?",
    "type": "numeric",
    "answer": 80,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "$B_{FM} = 2(1 + \\beta)B = 2 \\times 4 \\times 10 = 80$ kHz."
  },
  {
    "q": "Of the 200 kHz the FCC allows each FM station, how many kHz are guard band?",
    "type": "numeric",
    "answer": 50,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "Stereo audio is almost 15 kHz and β = 4: $2(1 + 4) \\times 15 = 150$ kHz, plus an extra 50 kHz guard band = 200 kHz."
  }
]
```

- AM: the carrier's amplitude varies with the modulating signal; *The bandwidth of the modulated signal is twice the bandwidth of the modulating signal and covers a range centered on the carrier frequency.* Audio 5 kHz → 10 kHz per AM station.
- FM: the carrier's frequency follows the modulating signal; peak amplitude and phase constant. B_FM = 2(1 + β)B; 15 kHz stereo, β = 4, plus 50 kHz guard → 200 kHz.
- PM: the carrier's phase follows the modulating signal; peak amplitude and frequency fixed. No bandwidth formula on the slide (the textbook's 2(1 + β)B is unverified).

```widget
analog-mod
{ "mode": "fm", "B": 10, "unit": "kHz", "beta": 3, "guard": 0, "title": "FM: 10 kHz at β = 3" }
```

Lesson: [AM, FM and PM](#/comp3721-w5/am-fm-pm).

## 9. The differences between items 7 and 8

Recall first.

```quiz
[
  {
    "q": "QAM has a counterpart among the analog-to-analog techniques, just as ASK has AM.",
    "type": "tf",
    "answer": false,
    "explain": "False. ASK, FSK and PSK are the digital-data versions of AM, FM and PM, but QAM (ASK and PSK combined on two carriers) has no analog-to-analog twin."
  }
]
```

Both families produce a bandpass analog signal on a carrier. Digital-to-analog takes digital data, is called shift keying, carries log₂ L or log₂ n bits per signal element and sizes its bandwidth from S; analog-to-analog takes analog data, is called modulation, has no bits per element and sizes its bandwidth from B. Each difference is a written response in [the differences lesson](#/comp3721-midterm/differences).

Lesson: [E05 worked, the four kinds of conversion](#/comp3721-w5/e05-worked), [AM, FM and PM side by side](#/comp3721-w5/am-fm-pm).

## 9. Multiplexing: FDM and WDM are analog, TDM is digital

Recall first.

```quiz
[
  {
    "q": "Six channels of 30 kHz each are multiplexed by FDM with a 5 kHz guard band between channels. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 205,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "6 channels need 5 guard bands: $B_{link} = 6 \\times 30 + 5 \\times 5 = 180 + 25 = 205$ kHz (Example 1's method: $5 \\times 100 + 4 \\times 10 = 540$ kHz)."
  },
  {
    "q": "A 400 kHz link carries 50 kHz channels with a 10 kHz guard band between them. How many channels fit at most?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "channels",
    "explain": "$n \\times 50 + (n - 1) \\times 10 \\le 400$ gives $60n \\le 410$, $n \\le 6.83$, so 6 channels ($6 \\times 50 + 5 \\times 10 = 350$ kHz). Seven would need 410 kHz."
  },
  {
    "q": "Five sources each send 200 characters per second (8 bits each), with characters as the unit and 1 synchronizing bit per frame. What is the link rate, in bps?",
    "type": "numeric",
    "answer": 8200,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Frame rate = input unit rate = 200 frames/s. Bits per frame $= 5 \\times 8 + 1 = 41$. Link rate = frame rate × frame size $= 200 \\times 41 = 8200$ bps; the framing bit counts (E06 exercise 2: $250 \\times 33 = 8250$ bps)."
  },
  {
    "q": "Why is synchronous TDM not efficient?",
    "options": ["A source with no data leaves its slot in the frame empty", "The link must be n times slower than each input", "Guard bands waste part of the link", "Every frame needs a separate carrier frequency"],
    "answer": 0,
    "explain": "If a source does not have data to send, the corresponding slot in the output frame is empty. Statistical TDM improves the efficiency by removing the empty slots."
  }
]
```

- *Multiplexing is the set of techniques that allow the simultaneous transmission of multiple signals across a single data link.* *Link refers to the physical path. Channel refers to the portion of a link.*
- FDM: analog; signals modulate different carriers; guard bands separate the channels. B_link = n × B + (n − 1) × guard. WDM: analog, for optical signals; a prism combines and splits the light.
- Synchronous TDM: digital; time is shared. A unit can be 1 bit, one character or one block. *If the duration of the input unit is T, the duration of each slot is T/n and the duration of each frame is T.* *The frame rate is always the same as any input rate.* The link bit rate is n times an input's rate.
- Slide Example 2: four 100 kbps channels, 2-bit slots → 50 000 frames/s, 20 μs, 400 kbps, 2.5 μs. E06 adds characters with a framing bit (8250 bps) and 100 + 200 kbps by multiple-slot allocation (300 kbps): worked in [E06](#/comp3721-w6/e06-worked).

```widget
fdm-plan
{ "n": 6, "bandwidth": 30, "unit": "kHz", "guard": 5, "start": 0, "presets": { "Six 30 kHz channels, 5 kHz guard": { "n": 6, "bandwidth": 30, "unit": "kHz", "guard": 5, "start": 0 }, "Six 50 kHz channels, 10 kHz guard": { "n": 6, "bandwidth": 50, "unit": "kHz", "guard": 10, "start": 0 }, "Example 1 (five 100 kHz channels, 10 kHz guard)": { "n": 5, "bandwidth": 100, "unit": "kHz", "guard": 10, "start": 0 } } }
```

```widget
tdm-frames
{ "n": 4, "rate": 100, "unit": "kbps", "slot": 2, "framing": true, "title": "Four 100 kbps lines, 2-bit slots, with a framing bit: watch the link rate count it" }
```

Lesson: [Multiplexing](#/comp3721-w6/multiplexing), [FDM](#/comp3721-w6/fdm), [WDM](#/comp3721-w6/wdm), [synchronous TDM](#/comp3721-w6/synchronous-tdm), [multiplexing examples](#/comp3721-w6/multiplexing-examples), [E06 worked](#/comp3721-w6/e06-worked).

## 9. Unequal input rates: multilevel, multiple-slot allocation, pulse stuffing

Recall first.

```quiz
[
  {
    "q": "Two 15 kbps lines go through a small MUX first, then join two 30 kbps lines. What is the link rate, in kbps?",
    "type": "numeric",
    "answer": 90,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "Multilevel multiplexing: $15 + 15 = 30$ kbps, then three 30 kbps inputs give $3 \\times 30 = 90$ kbps (slide 40: 20 + 20 → 40, then 4 × 40 = 160 kbps)."
  },
  {
    "q": "One 90 kbps line and two 45 kbps lines share a link by multiple-slot allocation. How many slots per frame does the 90 kbps line get?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "slots",
    "explain": "90 is twice 45, so the 90 kbps line is split into two 45 kbps lines and gets two slots per frame: four slots of 45 kbps, a 180 kbps link (slide 42: 50 → 2 × 25, 125 kbps)."
  },
  {
    "q": "Lines of 64, 64 and 61 kbps are not integer multiples of each other. Which strategy applies?",
    "options": ["Pulse stuffing: add dummy bits to the 61 kbps line to make it 64 kbps", "Multilevel multiplexing", "Multiple-slot allocation", "Statistical TDM"],
    "answer": 0,
    "explain": "Pulse stuffing makes the highest input rate the dominant rate and adds dummy bits to the slower lines: 61 → 64 kbps (3 kbps of dummy bits), so the link is $3 \\times 64 = 192$ kbps (slide 44: 46 → 50, 150 kbps)."
  }
]
```

- Multilevel multiplexing: *used when the data rate of an input line is a multiple of others*.
- Multiple-slot allocation: *Allocating more than one slot in a frame to a single input line.*
- Pulse stuffing (bit padding, bit stuffing): used *when the bit rates of sources are not integer multiples of each other*; dummy bits raise the slower lines to the dominant rate. This is not Week 7's bit stuffing in a frame.
- Framing bits: one or more synchronization bits at the beginning of each frame, following a pattern such as 1 0 1.

```widget
rate-manager
{ "rates": "15 15 30 30", "unit": "kbps", "presets": { "Multilevel: 15 15 30 30": "15 15 30 30", "Multiple-slot: 90 45 45": "90 45 45", "Pulse stuffing: 64 64 61": "64 64 61" } }
```

Lesson: [TDM rate management](#/comp3721-w6/tdm-rate-management).

## 10. L levels carry log₂ L bits; n constellation points carry log₂ n bits

Recall first: fill the table, rounding up where L is not a power of 2.

```quiz
[
  {
    "q": "Bits per level (or per constellation point) for each L or n.",
    "type": "fill",
    "code": "L or n:     2    4    8    11   16   64   256\nbits:      ___  ___  ___  ___  ___  ___  ___",
    "answer": ["1", "2", "3", "4", "4", "6", "8"],
    "explain": "log₂ of each: 1, 2, 3, 3.46, 4, 6, 8. Eleven levels give log₂ 11 = 3.46, which is not realistic, so 4 bits (the ceiling). The same rule gives bits per constellation point: 16-QAM carries 4, 64-QAM 6, 256-QAM 8."
  },
  {
    "q": "Each signal level carries 5 bits. How many levels does the signal use?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0,
    "unit": "levels",
    "explain": "bits = log₂ L, so L = 2⁵ = 32 levels."
  }
]
```

The review list's words: *with L signal levels, the number of bits per signal level is log2L. Also, if there are n constellation points in a constellation diagram, then each point (i.e., signal element) represent log2n bits.* The rule turns up in Nyquist (2 × B × log₂ L), PCM (n_b = log₂ L), line coding (r = log₂ L for N_max) and QAM (r = log₂ n). With only a log₁₀ key: log₂ x = log x / log 2.

Lesson: [Digital signals and levels](#/comp3721-w2/digital-signals), [encoding and bit rate](#/comp3721-w5/encoding-bit-rate), [constellation diagrams](#/comp3721-w5/constellation).

## 11. ARP: what it maps, and how it sends its request and reply

Recall first.

```quiz
[
  {
    "q": "How are the ARP request and the ARP reply sent?",
    "options": ["The request is broadcast; the reply is unicast", "The request is unicast; the reply is broadcast", "Both are broadcast", "Both are unicast"],
    "answer": 0,
    "explain": "*ARP request is broadcast*: every system on the LAN receives \"Looking for link-layer address of a node with IP address N₂\". *ARP reply is unicast*: only B answers, to A."
  },
  {
    "q": "In which layer is ARP defined? (One word.)",
    "type": "text",
    "answer": ["network", "network layer"],
    "explain": "ARP is one of the auxiliary protocols defined in the network layer; it maps an IP address to a link-layer (MAC) address."
  },
  {
    "q": "Alice sends to Bob through routers R1 and R2. Which frame crosses the link from R1 to R2?",
    "options": ["[L₃ | L₂ | N_A | N_B | Data]", "[L₁ | L_A | N_A | N_B | Data]", "[L₃ | L₂ | N₁ | N₃ | Data]", "[L_B | L₄ | N_A | N_B | Data]"],
    "answer": 0,
    "explain": "Link-layer addresses are destination then source, and change on every link: R1 asks ARP for N₃ and R2 answers L₃, so the frame is [L₃ | L₂ | …]. The IP addresses stay N_A, N_B for the whole journey."
  }
]
```

- *Address Resolution Protocol (ARP)*: useful when moving a frame through a link; one of the auxiliary protocols defined in the network layer; it maps an IP address to a link-layer address. Hosts and routers run it all the time in the background.
- The packet: hardware type 0x0001 (Ethernet), protocol type 0x0800 (IPv4), hardware length 0x06, protocol length 0x04, operation request 1 or reply 2; the destination hardware address is all 0s in the request.
- Why addresses change per hop: the IP addresses define the two ends but *cannot define which links the datagram should pass through*; the two data-link addresses *are changed every time the frame moves from one link to another.* Order: IP source-destination, link-layer destination-source.
- MAC addresses are 48 bits (6 bytes), written as 12 hexadecimal digits separated by colons.

```widget
arp-exchange
{ "target": 2, "quiz": true, "title": "Fill the six blanked fields of the ARP request and reply" }
```

```widget
hop-walk
{ "preset": "Alice to Bob (slides 30-33)", "draw": true, "title": "Alice to Bob: type the two link-layer addresses of each frame" }
```

Lesson: [ARP](#/comp3721-w6/arp), [link-layer addressing](#/comp3721-w6/link-layer-addressing), [Alice to Bob](#/comp3721-w6/alice-to-bob).
