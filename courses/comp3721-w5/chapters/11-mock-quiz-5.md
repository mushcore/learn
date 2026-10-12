---
title: Mock Quiz 5 (Week 5)
minutes: 35
---

The lab quizzes follow the lectures one week behind, so Quiz 5 is expected to cover Lectures 05a and 05b: PCM (sampling, the Nyquist rate, quantization, encoding, bit rate, quantization error, PCM bandwidth), ASK, FSK, PSK and QAM with their bandwidth boxes, constellation diagrams, and AM, FM and PM. Same rules as the real thing: one A4 or letter page of notes, single-sided and preferably hand-written, a calculator, and a unit with every calculated answer (samples/s for a sampling rate, bps for a bit rate, Hz for a bandwidth). The quantization questions use the slide's example: signal between $-20$ V and $+20$ V, $L = 8$, $\Delta = 5$ V, codes 0 to 7 from the bottom zone up.

```quiz
[
  {
    "q": "A PCM encoder has three processes. In which order does the slide list them?",
    "options": ["Quantizing, sampling, encoding", "Encoding, sampling, quantizing", "Sampling, quantizing, encoding", "Sampling, encoding, quantizing"],
    "answer": 2,
    "explain": "1. Sampling of the analog signal, 2. Quantizing the sampled signal, 3. Encoding the quantized information as streams of bits. PCM is the most commonly used technique for digitization, which is converting an analog signal to digital data. Sampling produces the PAM signal, quantizing snaps its heights to the grid, and only encoding produces bits."
  },
  {
    "type": "match",
    "q": "Match each sampling term to the slide's note about it.",
    "pairs": [
      ["Ideal sampling", "cannot be easily implemented"],
      ["Natural sampling", "uses a high-speed switch"],
      ["Flat-top sampling", "sample-and-hold; the most commonly used method"],
      ["PAM", "another name for the sampling process"]
    ],
    "explain": "Ideal sampling: stems at the curve's height, cannot be easily implemented. Natural sampling: a high-speed switch, a circuit that can rapidly connect and disconnect a signal path, so the pulse tops follow the curve. Flat-top (sample-and-hold) uses a circuit and is the most commonly used method. Pulse Amplitude Modulation is another name for the sampling process, not for quantizing."
  },
  {
    "q": "An analog signal is sampled every 125 μs. What is the sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "$T_s = 125$ μs is the sample interval (sample period). $f_s = \\frac{1}{T_s} = \\frac{1}{125 \\times 10^{-6}} = 8000$ samples/s. The signal must be bandlimited: a signal with an infinite bandwidth cannot be sampled."
  },
  {
    "q": "For a low-pass analog signal, the bandwidth equals the highest frequency contained in the signal.",
    "type": "tf",
    "answer": true,
    "explain": "Low-pass analog signal: bandwidth = highest frequency, because the band starts at 0. Bandpass analog signal: bandwidth < highest frequency, so the bandwidth alone does not give $f_{max}$."
  },
  {
    "q": "What is the minimum sampling rate for a low-pass signal that has a bandwidth of 100 kHz? Answer in samples per second.",
    "type": "numeric",
    "answer": 200000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "Nyquist theorem: to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal. For a low-pass signal $f_{max}$ = bandwidth, so $f_N = 2 \\times 100000 = 200000$ samples per second. The Nyquist interval is $\\frac{1}{f_N} = \\frac{1}{200000} = 5$ μs between samples."
  },
  {
    "q": "What is the minimum sampling rate for a bandpass signal that has a bandwidth of 100 kHz?",
    "options": ["It cannot be found, because the maximum frequency of the signal is not known", "200 000 samples/s", "100 000 samples/s", "50 000 samples/s"],
    "answer": 0,
    "explain": "For a bandpass signal, bandwidth < highest frequency, so 100 kHz is not $f_{max}$ and $2 \\times$ bandwidth is wrong. We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal; we should find or measure it, or obtain additional information about the signal."
  },
  {
    "q": "A sine wave of frequency $f$ is sampled. Select the statements that match the slide's three figures.",
    "options": ["$f_s = 2f$ gives a good approximation of the original sine wave", "$f_s = 4f$ gives a better approximation than $f_s = 2f$", "$f_s = 4f$ gives the same approximation but is redundant and unnecessary", "$f_s = f$ produces a signal that does not look like the original one", "$f_s = f$ is the Nyquist rate"],
    "answer": [0, 2, 3],
    "explain": "a. Nyquist rate sampling, $f_s = 2f$: two samples per cycle, a good approximation of the original sine wave. b. Oversampling, $f_s = 4f$: the same approximation but redundant and unnecessary. c. Undersampling, $f_s = f$: one sample per cycle, a signal that does not look like the original one. The Nyquist rate is $2f$, not $f$."
  },
  {
    "q": "Fill in the blank: quantization is an ________ process.",
    "type": "text",
    "answer": ["approximation"],
    "explain": "Quantization maps the set of amplitudes (can be infinite with nonintegral values) to a set of discrete values. It is an approximation process: the sample is replaced by the midpoint of its zone, so some error remains."
  },
  {
    "q": "A sample has an actual amplitude of $-6.1$ V. In the slide's example ($-20$ V to $+20$ V, $L = 8$) which zone does it belong to?",
    "options": ["Zone 1", "Zone 2", "Zone 3", "Zone 4"],
    "answer": 1,
    "explain": "$\\Delta = \\frac{V_{max} - V_{min}}{L} = \\frac{20 - (-20)}{8} = 5$ V. Normalized PAM value $= \\frac{-6.1}{5} = -1.22$. The zones from the bottom are 0 ($-4\\Delta$ to $-3\\Delta$), 1 ($-3\\Delta$ to $-2\\Delta$), 2 ($-2\\Delta$ to $-\\Delta$), 3 ($-\\Delta$ to 0), 4 (0 to $\\Delta$) and so on up to 7. $-1.22$ lies between $-2$ and $-1$, so zone 2, whose midpoint is $-1.50$."
  },
  {
    "q": "The sample with actual amplitude 19.7 V is quantized in the slide's example. What is its normalized error?",
    "type": "numeric",
    "answer": -0.44,
    "tolerance": 0.005,
    "explain": "Normalized PAM $= \\frac{19.7}{5} = 3.94$, zone 7 ($3\\Delta$ to $4\\Delta$), midpoint $3.50$. Normalized error is the difference between normalized quantized value and normalized PAM value: $3.50 - 3.94 = -0.44$. The sign is quantized minus PAM, so a sample above its midpoint gets a negative error."
  },
  {
    "q": "Which 3-bit code word does the encoder produce for the sample with actual amplitude 11.0 V?",
    "options": ["101", "010", "111", "110"],
    "answer": 3,
    "explain": "Normalized PAM $= \\frac{11.0}{5} = 2.20$, between $2\\Delta$ and $3\\Delta$: zone 6, quantized value 2.50, error $+0.30$. The quantization code is the zone number, 6, and encoding (the last step of PCM) writes it in $n_b = \\log_{2} 8 = 3$ bits: 110. 101 is the code for 7.5 V, 010 for $-6.1$ V, 111 for 16.2 V and 19.7 V."
  },
  {
    "q": "Select the statements that match the slide's quantization steps.",
    "options": ["The range $V_{min}$ to $V_{max}$ is divided into $L$ zones, each of height $\\Delta = (V_{max} - V_{min})/L$", "The quantized values 0 to $L - 1$ are assigned to the midpoint of each zone", "The quantized values 1 to $L$ are assigned to the lower boundary of each zone", "The quantization error is always between $-\\Delta/2$ and $+\\Delta/2$", "A quantized sample equals the original sample exactly"],
    "answer": [0, 1, 3],
    "explain": "Steps: assume amplitudes between $V_{min}$ and $V_{max}$; divide the range into $L$ zones of height $\\Delta = (V_{max} - V_{min})/L$; assign quantized values of 0 to $L - 1$ to the midpoint of each zone; approximate each sample to the quantized values. Because the sample is replaced by a midpoint, $-\\Delta/2 \\le$ quantization error $\\le \\Delta/2$ and the result is never exact."
  },
  {
    "q": "In audio digitizing the slide uses $L = 256$ quantization levels. How many bits per sample is that?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "$n_b = \\log_{2} L = \\log_{2} 256 = 8$ bits per sample. Choosing $L$ depends on the range of the amplitudes and the required accuracy: a signal that fluctuates between two values only needs $L = 2$; voice needs many levels. Lower $L$ increases the quantization error if there is a lot of fluctuation in the signal."
  },
  {
    "q": "The human voice includes frequencies from 0 to 4 kHz. If we digitize it with 8 bits per sample, what is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 64,
    "tolerance": 0.05,
    "unit": "kbps",
    "explain": "E05 exercise 1. Sampling rate $= 2 \\times f_{max} = 2 \\times 4000 = 8000$ samples/s. Bit rate $=$ sampling rate $\\times$ number of bits per sample $= f_s \\times n_b = 8000 \\times 8 = 64000$ bps $= 64$ kbps."
  },
  {
    "q": "PCM converts an analog signal to digital data. If we increase the number of quantization levels, what happens to the number of bits per sample and the bit rate?",
    "options": ["Bits per sample increases, bit rate stays the same", "Both stay the same, because the sampling rate is unchanged", "Bits per sample decreases, bit rate decreases", "Both increase"],
    "answer": 3,
    "explain": "E05 exercise 3. $n_b = \\log_{2} L$, so more levels means more bits per sample. Bit rate $= f_s \\times n_b$, so with the same sampling rate the bit rate increases too. The sampling rate depends on $f_{max}$ only, not on $L$."
  },
  {
    "q": "What is the SNR in dB that the quantization error allows for 8 bits per sample? Use the slide's formula.",
    "type": "numeric",
    "answer": 49.92,
    "tolerance": 0.05,
    "unit": "dB",
    "explain": "$SNR_{dB} = 6.02\\, n_b + 1.76 = 6.02 \\times 8 + 1.76 = 48.16 + 1.76 = 49.92$ dB. The contribution of the quantization error to the SNR depends on the number of levels $L$, or the bits per sample $n_b$: each extra bit adds about 6 dB (computed from the formula, not printed on the slide)."
  },
  {
    "q": "Select the statements the slide makes about quantization error and uniform quantization.",
    "options": ["The quantization error changes the SNR, so the Shannon upper limit on the bit rate is decreased", "The quantization error increases the Shannon capacity", "Uniform quantization is only optimal for a uniformly distributed signal", "In nonuniform quantization the height of $\\Delta$ is not fixed", "The quantization error can be made exactly zero by sampling at the Nyquist rate"],
    "answer": [0, 2, 3],
    "explain": "Quantization error is noise: it lowers the SNR, and by Shannon the upper limit capacity (bit rate) is decreased. Uniform quantization is only optimal for a uniformly distributed signal. In nonuniform quantization the height of $\\Delta$ is not fixed; the slide says it is greater near the lower amplitudes and less near the higher amplitudes (check this direction in class). Sampling rate has nothing to do with the quantization error, which is bounded by $\\pm \\Delta/2$."
  },
  {
    "q": "Real audio signals such as speech and music have instantaneous amplitudes that are more concentrated near zero (the lower amplitudes).",
    "type": "tf",
    "answer": true,
    "explain": "Often the distribution of the instantaneous amplitudes in the analog signal is not uniform. Speech and music are more concentrated near zeros (lower amplitudes), which is why uniform quantization, optimal only for a uniformly distributed signal, is not ideal for them."
  },
  {
    "q": "PCM uses 64 quantization levels. The original analog (low-pass) signal has a bandwidth of 300 MHz. With $r = 1$ and the average case, what is the minimum bandwidth required to transmit the digital signal, in GHz?",
    "type": "numeric",
    "answer": 1.8,
    "tolerance": 0.005,
    "unit": "GHz",
    "explain": "E05 exercise 2. $n_b = \\log_{2} 64 = 6$ bits per sample. $B_{min} = n_b \\times B_{analog} = 6 \\times 300$ MHz $= 1800$ MHz $= 1.8$ GHz. The short formula comes from $B_{min} = c \\times n_b \\times 2 \\times B_{analog} \\times \\frac{1}{r}$ with $c = 1/2$ (average case) and $r = 1$ (NRZ or bipolar line coding)."
  },
  {
    "q": "Fill in the blank: the minimum bandwidth of the digital signal is $n_b$ times greater than the bandwidth of the analog signal. This is the ________ we pay for digitization.",
    "type": "text",
    "answer": ["price"],
    "explain": "The boxed sentence on the PCM bandwidth slide. PCM requires more bandwidth than the bandwidth of the input analog signal: $B_{min} = n_b \\times B_{analog}$ for $c = 1/2$ and $r = 1$."
  },
  {
    "q": "The carrier signal is a simple sine wave produced by the receiving device.",
    "type": "tf",
    "answer": false,
    "explain": "The carrier signal (carrier frequency) is a high-frequency signal produced by the **sending** device and acts as a base for the information signal. It is a simple sine wave; the receiver is tuned to the frequency of the carrier signal. Modifying its amplitude, frequency or phase according to the digital data is modulation or shift keying."
  },
  {
    "type": "match",
    "q": "Match each digital-to-analog technique to what it changes in the carrier.",
    "pairs": [
      ["ASK", "amplitude varies; frequency and phase remain constant"],
      ["FSK", "frequency changes; peak amplitude and phase remain constant"],
      ["PSK", "phase changes; peak amplitude and frequency remain constant"],
      ["QAM", "combines ASK and PSK on two carriers 90° apart"]
    ],
    "explain": "One characteristic of the sine wave is varied per scheme and the other two stay constant. QAM uses two carriers, one in-phase and the other quadrature, with different peak amplitude levels for each, so it is both amplitude and phase keying."
  },
  {
    "q": "Why is PSK less susceptible to noise than ASK?",
    "options": ["Because PSK uses two carrier frequencies", "Because PSK uses simpler hardware than ASK", "Because noise can change the amplitude easier than it can change the phase", "Because PSK needs less bandwidth than ASK"],
    "answer": 2,
    "explain": "Noise changes the amplitude of a signal more easily than its phase, so a phase-coded signal survives it better. The cost: PSK needs more sophisticated hardware to be able to distinguish between phases. PSK is more common than ASK or FSK, and BPSK has the same bandwidth as BASK, not less."
  },
  {
    "q": "Select the true statements about ASK, FSK and PSK as the slides describe them.",
    "options": ["Binary ASK is also called OOK, On-Off Keying", "Binary FSK has the same bandwidth as binary ASK", "In BFSK, $f_1$ is used for data element 0 and $f_2$ for data element 1, and the two frequencies are $2\\Delta_f$ apart", "BFSK is implemented with a voltage-controlled oscillator (VCO)", "Multi-level ASK with more than two voltage levels is the common form of ASK", "The bandwidth of a modulated signal is proportional to the signal rate"],
    "answer": [0, 2, 3, 5],
    "explain": "BASK uses only two levels, 0 and the carrier's peak amplitude: OOK. Its box is $r = 1$, $S = N$, $B = (1 + d)S$; BPSK has the same box. BFSK adds the gap between the two carriers: $B = (1 + d)S + 2\\Delta_f$, so it is wider. The BFSK implementation feeds the digital signal to a VCO; BASK and BPSK use a multiplier with an oscillator at $f_c$. Multi-level ASK is not common. Modulation produces a nonperiodic composite signal whose bandwidth is proportional to the signal rate."
  },
  {
    "q": "QAM combines which two techniques?",
    "options": ["ASK and FSK", "ASK and PSK", "FSK and PSK", "AM and FM"],
    "answer": 1,
    "explain": "Quadrature amplitude modulation combines ASK and PSK: different peak amplitudes on two carriers that are 90° out of phase. It is the dominant method of digital-to-analog modulation, has the same advantages as PSK over ASK and the same minimum required bandwidth as ASK and PSK, and is used in 802.11 Wi-Fi."
  },
  {
    "q": "Fill in the blank: QAM uses two carriers, one in-phase and the other ________.",
    "type": "text",
    "answer": ["quadrature"],
    "explain": "The two carrier signals are out-of-phase with each other by 90°. On a constellation diagram the X axis is the in-phase carrier and the Y axis is the quadrature carrier."
  },
  {
    "type": "match",
    "q": "Match each part of a constellation diagram to what it represents.",
    "pairs": [
      ["A dot", "a signal element type"],
      ["X axis", "in-phase carrier"],
      ["Y axis", "quadrature carrier"],
      ["Length of the line from the origin to a dot", "amplitude of the signal element"],
      ["Angle of that line", "phase of the signal element"]
    ],
    "explain": "A signal element type is represented as a dot, with the bit or combination of bits it carries written next to it. The projections of the dot on the axes are the amplitudes of the I and Q components. Length: amplitude. Angle: phase."
  },
  {
    "q": "A constellation diagram has 16 constellation points. How many bits does each constellation point (signal element) carry?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "E05 exercise 4. A modulation with $n$ constellation points transmits $\\log_{2} n$ bits per signal element: $\\log_{2} 16 = 4$ bits (16-QAM). The slide's table continues 64 points → 6 bits, 256 → 8, 1024 → 10, 4096 → 12 (4K-QAM). In the 8-QAM waveform, 8 points carry 3 bits each: bit rate 24 bps at 8 baud, so in analog transmission of digital data the baud rate $\\le$ the bit rate, $S = N/r$."
  },
  {
    "q": "The amplitude of a constellation point is 5 V and the amplitude of its in-phase carrier is 3 V. What is the amplitude of the quadrature carrier, in volts?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "The length from the origin is the amplitude and the I and Q amplitudes are its projections, so Pythagoras applies: $5^2 = 3^2 + q^2$, $q^2 = 25 - 9 = 16$, $q = 4$ V."
  },
  {
    "q": "What is the constellation diagram for BPSK with a peak amplitude of 2 V?",
    "options": ["Two dots on the I axis at $-2$ V and $+2$ V", "Two dots on the I axis at 0 V and $+2$ V", "Two dots on the Q axis at $-2$ V and $+2$ V", "Four dots at $\\pm 2$ V on both axes"],
    "answer": 0,
    "explain": "BPSK uses only an in-phase carrier, so both dots are on the X axis: one with amplitude 2 V in phase ($+2$ V, bit 1) and one with amplitude 2 V and 180° out of phase ($-2$ V, bit 0). The second option is OOK, where binary 0 has an amplitude of 0 V at the origin and binary 1 is to the right."
  },
  {
    "q": "The bandwidth of an audio signal (speech and music) is usually 5 kHz. What bandwidth does an AM radio station need, in kHz?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "$B_{AM} = 2B = 2 \\times 5 = 10$ kHz: the bandwidth of the modulated signal is twice the bandwidth of the modulating signal and covers a range centered on the carrier frequency. The FCC allows 10 kHz for each AM station, and to avoid interference each station's carrier frequency must be separated from those on either side by at least 10 kHz."
  },
  {
    "q": "Stereo audio has a bandwidth of almost 15 kHz. With $\\beta = 4$, what bandwidth does $B_{FM} = 2(1 + \\beta)B$ give, in kHz?",
    "type": "numeric",
    "answer": 150,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$B_{FM} = 2(1 + 4) \\times 15 = 10 \\times 15 = 150$ kHz. With the extra 50 kHz guard band that is the 200 kHz the FCC allows for each FM station; stations must be separated by at least 200 kHz to keep their bandwidths from overlapping."
  },
  {
    "type": "match",
    "q": "Match each analog-to-analog technique to what the carrier does.",
    "pairs": [
      ["AM", "amplitude varies with the modulating signal; frequency and phase remain the same"],
      ["FM", "frequency follows the modulating amplitude; peak amplitude and phase remain constant"],
      ["PM", "phase follows the modulating amplitude; peak amplitude and frequency remain fixed"]
    ],
    "explain": "In FM and PM the carrier's frequency or phase is modulated to follow the changing voltage level (amplitude) of the modulating signal. Bandwidth boxes: $B_{AM} = 2B$, $B_{FM} = 2(1 + \\beta)B$; the PM slide gives no formula."
  },
  {
    "q": "The bandwidth of an FM signal is twice the bandwidth of the modulating signal.",
    "type": "tf",
    "answer": false,
    "explain": "Twice the modulating bandwidth is AM: $B_{AM} = 2B$. FM needs $B_{FM} = 2(1 + \\beta)B$, which for radio ($\\beta = 4$) is ten times the audio bandwidth."
  },
  {
    "q": "Fill in the blank: when we have a bandpass channel, we require ________ transmission.",
    "type": "text",
    "answer": ["analog"],
    "explain": "The 05b summary. A bandpass channel does not pass the low frequencies of a digital signal, so the data must ride on a carrier: digital-to-analog conversion (ASK, FSK, PSK, QAM) for digital data, analog-to-analog conversion (AM, FM, PM) for analog data."
  }
]
```
