---
title: Your one-page study note (Week 5)
minutes: 15
---

The Week 5 block of the quiz sheet: Lectures 05a and 05b in the slide's words, every formula, the quantization recipe, the bandwidth box of every conversion, the constellation rules and the worked numbers. One A4 or letter page, single-sided and preferably hand-written, plus a calculator. Units: samples/s for a sampling rate, bps for a bit rate, Hz for a bandwidth, dB for SNR.

## Lecture 05a: analog-to-digital conversion, PCM

- **Digitization**: converting an analog signal to digital data. **PCM** (Pulse Code Modulation): the most commonly used technique for digitization. ADC at the microphone side, DAC at the speaker side.
- PCM encoder, three processes in order: **1. sampling** the analog signal, **2. quantizing** the sampled signal, **3. encoding** the quantized information as streams of bits. Sampling gives the **PAM signal**; quantizing gives the quantized signal (heights snapped to a grid); encoding gives the bits.
- **PAM** (Pulse Amplitude Modulation) = another name for the sampling process.
- **Sample interval / period $T_s$**: sampled every $T_s$ seconds. **Sampling rate / frequency $f_s = 1/T_s$**. A signal with an infinite bandwidth cannot be sampled: it must be **bandlimited**.
- Three sampling methods: **ideal** (stems; cannot be easily implemented; FYI impulse sampling), **natural** (uses a high-speed switch, pulse tops follow the curve), **flat-top / sample-and-hold** (uses a circuit; **the most commonly used method**).
- **Nyquist theorem**: to reproduce the original analog signal, the sampling rate must be at least **2 times the highest frequency** contained in the signal. **Low-pass** signal: bandwidth = highest frequency. **Bandpass** signal: bandwidth < highest frequency, so the minimum sampling rate cannot be found from the bandwidth alone; find or measure $f_{max}$.
- Figures: $f_s = 2f$ Nyquist rate, a good approximation; $f_s = 4f$ oversampling, same approximation but redundant and unnecessary; $f_s = f$ undersampling, does not look like the original.
- **Quantization**: the set of amplitudes (can be infinite with nonintegral values) is mapped to a set of discrete values; an **approximation** process.
- Recipe: 1. amplitudes between $V_{min}$ and $V_{max}$; 2. divide into $L$ zones (quantization levels) of height $\Delta$; 3. assign quantized values **0 to $L - 1$ to the midpoint** of each zone; 4. approximate each sample to the quantized value. Table columns: actual → normalized PAM = actual/$\Delta$ → zone → normalized quantized = midpoint → normalized error = **quantized − PAM** → code = zone number → word in $n_b$ bits.
- Zone from a normalized value (symmetric range): zone = ⌊value⌋ + $L/2$; midpoint = zone − $L/2$ + 0.5. 1.50 → zone 5, and 1.50 is that zone's midpoint, so its error is 0.
- **Encoding** (last step): each quantized sample becomes an $n_b$-bit code word, $n_b = \log_{2} L$.
- Choosing $L$: the range of the amplitudes and the required accuracy. Two values only → $L = 2$; voice → more levels; **audio digitizing $L = 256$**. Lower $L$ increases the quantization error when the signal fluctuates a lot.
- **Quantization error (noise)**: $-\Delta/2 \le$ error $\le \Delta/2$. It changes the SNR, so the Shannon upper limit capacity (bit rate) is **decreased**. Depends on $L$ or $n_b$.
- **Uniform quantization** is only optimal for a uniformly distributed signal; speech and music are concentrated near zero (lower amplitudes). **Nonuniform**: height of $\Delta$ is not fixed; slide: greater near the lower amplitudes, less near the higher (ask in class; the book may say the reverse).
- **PCM bandwidth**: the minimum bandwidth of the digital signal is $n_b$ times greater than the bandwidth of the analog signal; **the price we pay for digitization**. Needs $c = 1/2$ (average case) and $r = 1$ (NRZ or bipolar). PCM requires more bandwidth than the input analog signal.

**Formulas (05a)**

$$f_s = \frac{1}{T_s} \qquad f_N = 2 f_{max} \ \text{(samples/s)} \qquad \text{Nyquist interval} = \frac{1}{2 f_{max}} \ \text{(s)}$$

$$\Delta = \frac{V_{max} - V_{min}}{L} \qquad n_b = \log_{2} L \qquad L = 2^{n_b} \qquad \text{bit rate} = f_s \times n_b$$

$$SNR_{dB} = 6.02\, n_b + 1.76 \ \text{dB} \qquad (n_b = 8 \to 49.92 \text{ dB; about 6 dB per extra bit})$$

$$B_{min} = c \times N \times \frac{1}{r} = c \times n_b \times 2 B_{analog} \times \frac{1}{r} \qquad B_{min} = n_b \times B_{analog} \ (c = \tfrac{1}{2},\ r = 1)$$

Slide quantization table: $-20$ V to $+20$ V, $L = 8$, $\Delta = 5$ V, zones 0 (bottom, $-4\Delta$ to $-3\Delta$) to 7 (top), midpoints $-3.5\Delta \ldots +3.5\Delta$.

| Actual (V) | $-6.1$ | $7.5$ | $16.2$ | $19.7$ | $11.0$ | $-5.5$ | $-11.3$ | $-9.4$ | $-6.0$ |
|---|---|---|---|---|---|---|---|---|---|
| PAM = actual/5 | $-1.22$ | $1.50$ | $3.24$ | $3.94$ | $2.20$ | $-1.10$ | $-2.26$ | $-1.88$ | $-1.20$ |
| Zone = code | 2 | 5 | 7 | 7 | 6 | 2 | 1 | 2 | 2 |
| Quantized (midpoint) | $-1.50$ | $1.50$ | $3.50$ | $3.50$ | $2.50$ | $-1.50$ | $-2.50$ | $-1.50$ | $-1.50$ |
| Error = quantized − PAM | $-0.28$ | $0$ | $+0.26$ | $-0.44$ | $+0.30$ | $-0.40$ | $-0.24$ | $+0.38$ | $-0.30$ |
| Word (3 bits) | 010 | 101 | 111 | 111 | 110 | 010 | 001 | 010 | 010 |

## Lecture 05b: digital-to-analog and analog-to-analog conversion

- Review: in analog transmission of digital data, **$r = \log_{2} L$** ($L$ = number of different signal elements) and **baud rate ≤ bit rate**, $S = N/r$.
- **Carrier signal (carrier frequency)**: a high-frequency signal produced by the **sending** device, the base for the information signal; a simple sine wave; the receiver is tuned to its frequency.
- **Digital-to-analog conversion**: converting digital data to a bandpass analog signal by modifying the amplitude, frequency or phase of the carrier: **modulation or shift keying**. Tree: ASK, FSK, PSK; ASK + PSK → **QAM**.
- Modulation produces a **nonperiodic composite signal**; bandwidth is **proportional to the signal rate**. $d$ in $(1 + d)$ is not defined on the slide (book: a factor between 0 and 1).
- **BASK = OOK**: two levels, 0 and the carrier's peak amplitude. Implementation: digital signal × oscillator ($f_c$) in a multiplier. Multi-level ASK (4 amplitudes → $r = 2$, 8 → $r = 3$) is **not common**.
- **BFSK**: two carrier frequencies, **$f_1$ for 0, $f_2$ for 1**; each is $\Delta_f$ from the midpoint, difference $2\Delta_f$. Implementation: **VCO**. MFSK: 4 frequencies → 2 bits, 8 → 3 bits.
- **PSK**: **more common than ASK or FSK**; less susceptible to noise **because noise can change the amplitude easier than it can change the phase**; needs more sophisticated hardware to distinguish phases. **BPSK**: phases 0° and 180° (figure: 1 in phase, 0 inverted); **same bandwidth as BASK, less than BFSK**. Implementation: polar NRZ input × oscillator.
- **QAM**: combines ASK and PSK; the **dominant** D2A method; two carriers, **in-phase and quadrature (90° apart)**, different peak amplitudes on each; same advantages as PSK over ASK; same minimum bandwidth as ASK and PSK; 802.11 Wi-Fi. 8-QAM waveform: bit rate 24, baud rate 8, 3 bits per element.
- **Constellation diagram**: a signal element type is a **dot** (its bits written next to it); X = **in-phase** carrier, Y = **quadrature** carrier; **length = amplitude, angle = phase**; projections = amplitudes of the I and Q components. **$n$ points → $\log_{2} n$ bits per signal element.** Amplitude² = I² + Q² (Pythagoras).
- Slide examples: OOK: 0 **at the origin**, 1 on +X. ASK 1 V / 3 V: two dots on +X. BPSK: 0 on −X, 1 on +X, same amplitude (2 V example: −2 V and +2 V). 8-QAM 1 V / 3 V, four phases: dots on the diagonals (45°, 135°, 225°, 315°), inner 1 V, outer 3 V. 4-QAM layouts: a. square with a corner at the origin, b. one dot per quadrant, c. small square in the first quadrant; 16-QAM: 2×2 cluster per quadrant, grid at $\pm A$, $\pm 3A$, angle $\varphi$ = phase, distance $A$ = amplitude.
- n-QAM table: 4 bits → 16-QAM, 6 → 64, 8 → 256, 10 → 1024, 12 → 4096 (4K-QAM).
- **Analog-to-analog**: AM, FM, PM. **AM**: amplitude varies with the modulating signal, frequency and phase the same; bandwidth **twice** the modulating bandwidth, centred on $f_c$. Audio **5 kHz** → AM station **10 kHz**; FCC 10 kHz per station; carriers at least 10 kHz apart.
- **FM**: frequency follows the modulating amplitude; peak amplitude and phase constant. Stereo audio almost **15 kHz**; FCC **200 kHz** per station = $\beta = 4$ plus a 50 kHz guard band; stations at least 200 kHz apart.
- **PM**: phase follows the modulating amplitude; peak amplitude and frequency fixed; no bandwidth formula on the slide (book: same as FM, unverified).
- Summary: **when we have a bandpass channel, we require analog transmission.**

| Conversion | Varies | Constant | $r$ | Bandwidth box |
|---|---|---|---|---|
| ASK (BASK = OOK) | amplitude | frequency, phase | 1 | $S = N$, $B = (1 + d)S$ |
| FSK (BFSK) | frequency | peak amplitude, phase | 1 | $S = N$, $B = (1 + d)S + 2\Delta_f$ |
| PSK (BPSK) | phase | peak amplitude, frequency | 1 | $S = N$, $B = (1 + d)S$ |
| QAM | amplitude and phase | frequency | $\log_{2} n$ | same minimum as ASK and PSK |
| AM | amplitude | frequency, phase | — | $B_{AM} = 2B$ |
| FM | frequency | peak amplitude, phase | — | $B_{FM} = 2(1 + \beta)B$ |
| PM | phase | peak amplitude, frequency | — | none on the slide |

| Worked number | Result |
|---|---|
| Low-pass, bandwidth 100 kHz | $f_s = 2 \times 100000 = 200000$ samples/s; Nyquist interval $5$ μs |
| Bandpass, bandwidth 100 kHz | cannot be found: $f_{max}$ unknown |
| E05 1: voice 0 to 4 kHz, 8 bits | $f_s = 8000$ samples/s, bit rate $= 8000 \times 8 = 64$ kbps |
| E05 2: $L = 64$, $B_{analog} = 300$ MHz, $r = 1$ | $n_b = 6$, $B_{min} = 6 \times 300 = 1800$ MHz $= 1.8$ GHz |
| E05 3: more quantization levels | $n_b = \log_{2} L$ increases, bit rate $= f_s \times n_b$ increases |
| E05 4: 16 points; amplitude 5 V, I = 3 V | $\log_{2} 16 = 4$ bits; $q^2 = 25 - 9$, $q = 4$ V |
| Audio $L = 256$ | $n_b = 8$ bits, $SNR_{dB} = 49.92$ dB |
| AM radio, 5 kHz audio | $B_{AM} = 2 \times 5 = 10$ kHz |
| FM radio, 15 kHz stereo, $\beta = 4$ | $2(1 + 4) \times 15 = 150$ kHz $+ 50$ kHz guard $= 200$ kHz |

```quiz
[
  {
    "q": "A low-pass signal has a bandwidth of 100 kHz. What is the Nyquist interval, in microseconds?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "unit": "μs",
    "explain": "Nyquist interval $= \\frac{1}{f_N} = \\frac{1}{2 f_{max}} = \\frac{1}{2 \\times 100000} = 5 \\times 10^{-6}$ s $= 5$ μs: one sample every 5 μs gives the 200 000 samples/s the theorem requires."
  },
  {
    "q": "Which formula is the slide's minimum PCM bandwidth for $c = 1/2$ and $r = 1$?",
    "options": ["$B_{min} = 2 \\times n_b \\times B_{analog}$", "$B_{min} = n_b \\times B_{analog}$", "$B_{min} = f_s \\times n_b$", "$B_{min} = \\log_{2} L \\times f_{max} / 2$"],
    "answer": 1,
    "explain": "$B_{min} = c \\times n_b \\times 2 B_{analog} \\times \\frac{1}{r}$; with $c = 1/2$ and $r = 1$ the 2 and the 1/2 cancel, leaving $n_b \\times B_{analog}$. $f_s \\times n_b$ is the bit rate, not a bandwidth."
  },
  {
    "q": "A low-pass analog signal has a bandwidth of 300 MHz. What is the minimum sampling rate, in millions of samples per second?",
    "type": "numeric",
    "answer": 600,
    "tolerance": 0.5,
    "unit": "Msamples/s",
    "explain": "Low-pass, so $f_{max} = 300$ MHz and $f_N = 2 \\times 300 = 600$ million samples per second. E05 2 then digitizes this signal with 6 bits per sample."
  },
  {
    "q": "How many bits per signal element does 64-QAM carry?",
    "options": ["4", "8", "2", "6"],
    "answer": 3,
    "explain": "A modulation with $n$ constellation points transmits $\\log_{2} n$ bits per signal element: $\\log_{2} 64 = 6$. The slide's table: 16-QAM 4 bits, 64-QAM 6, 256-QAM 8, 1024-QAM 10, 4K-QAM 12."
  },
  {
    "q": "Which is the slide's bandwidth formula for FM?",
    "options": ["$B_{FM} = 2(1 + \\beta)B$", "$B_{FM} = 2B$", "$B_{FM} = (1 + d)S + 2\\Delta_f$", "$B_{FM} = \\beta B$"],
    "answer": 0,
    "explain": "$B_{FM} = 2(1 + \\beta)B$; for radio $\\beta = 4$ and $B = 15$ kHz give 150 kHz, plus a 50 kHz guard band for the FCC's 200 kHz. $2B$ is AM and $(1 + d)S + 2\\Delta_f$ is BFSK."
  },
  {
    "q": "BPSK has the same bandwidth as BASK but less than BFSK.",
    "type": "tf",
    "answer": true,
    "explain": "BASK and BPSK share the box $r = 1$, $S = N$, $B = (1 + d)S$ with one hump at $f_c$. BFSK has two humps at $f_1$ and $f_2$ and adds $2\\Delta_f$: $B = (1 + d)S + 2\\Delta_f$."
  },
  {
    "q": "Fill in the blank: the most commonly used sampling method is ________ sampling.",
    "type": "text",
    "answer": ["flat-top", "flat top", "sample-and-hold", "sample and hold", "flattop"],
    "explain": "Flat-top sampling (sample-and-hold) uses a circuit and holds each sampled value as a flat pulse. Ideal sampling cannot be easily implemented; natural sampling uses a high-speed switch."
  },
  {
    "q": "In the slide's quantization example, a sample has a normalized PAM value of 2.20. Which zone is it in?",
    "options": ["Zone 5", "Zone 7", "Zone 6", "Zone 4"],
    "answer": 2,
    "explain": "Zones count from 0 at the bottom ($-4\\Delta$ to $-3\\Delta$); zone 4 is 0 to $\\Delta$, zone 5 is $\\Delta$ to $2\\Delta$, zone 6 is $2\\Delta$ to $3\\Delta$. 2.20 lies between 2 and 3, so zone 6, midpoint 2.50, error $+0.30$, word 110. Shortcut: $\\lfloor 2.20 \\rfloor + 4 = 6$."
  },
  {
    "q": "An audio signal with a bandwidth of 20 kHz is sent with AM. What bandwidth does the modulated signal need, in kHz?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "$B_{AM} = 2B = 2 \\times 20 = 40$ kHz, centred on the carrier frequency. AM radio limits audio to 5 kHz so each station fits in the FCC's 10 kHz."
  }
]
```
