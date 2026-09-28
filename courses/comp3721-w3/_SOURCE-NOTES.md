# COMP 3721 Week 3 (lecture 03, E03) — facts and worked answers transcribed from the instructor's material

Source files: `D:/BCIT/COMP3721/lectures/COMP3721 - 03 - Week 3.pdf` (53 slides, downloaded 2026-09-28),
`exercises/COMP3721 - E03 - Week 3 Exercises.pdf` (2 exercises, no answer sheet posted).
Textbook: Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed. Reading for 03: Ch 2 §2.1 (Transmission of Digital Signals), §2.2, §2.8 (practice set).
`COMP3721_Assignment1_v1.pdf` (posted 2026-09-28) is graded work on Week 2 material; none of it is worked in the app.

## 03 — Transmission of digital signals
- Learning outcomes: transmission of digital signals; categories of transmission impairment; limits of data rate with Shannon capacity and Nyquist; what bandwidth is; transmission modes.
- "From now on, we consider **nonperiodic digital signals**." Two approaches: **baseband transmission**, **broadband transmission (modulation)**.
- Baseband: digital signal sent over a channel **without changing** it to an analog signal. Requirement: a **low-pass channel** (the lowest frequency contained in the channel is zero). "If the channel primarily passes signals below a certain frequency, it is called a low-pass channel (has an upper bound)." Dedicated medium with a bandwidth constituting only one channel. Real-life example: a LAN, almost every wired LAN today uses a dedicated channel for two stations communicating with each other (bus and star topologies, etc.).
- Shape-preserving baseband is possible only with a low-pass channel with an **infinite or very wide bandwidth** (Fourier: each digital signal corresponds to a composite analog signal with infinite bandwidth). Figure: a. low-pass channel, wide bandwidth (0 to f1); b. narrow bandwidth.
- Coaxial or fiber optic cable, very wide bandwidth -> two stations communicate using digital signals with very good accuracy. Figure: input signal bandwidth 0..∞, medium f1..f2, output slightly rounded.
- Boxed: "In baseband transmission, the required bandwidth is proportional to the bit rate; if we need to send bits faster, we need more bandwidth." Boxed: "Unfortunately, low-pass channels are less common in real life."
- Broadband (modulation): changing the digital signal to an analog signal for transmission. Requirement: a **bandpass channel** (allows signals to pass between two frequency limits, OR a channel with a bandwidth that does not start from zero). More available than a low-pass channel. The digital signal cannot be directly sent to the channel; it must be converted to an analog signal. Two converters (digital/analog at sender, analog/digital at receiver): the converter is a **modem** (modulator/demodulator).
- Real-life broadband examples: (1) computer data through a telephone subscriber line (resident to central telephone office); lines designed to carry voice, bandwidth 0 to 4 kHz, "can be used as a low-pass channel but it is considered as a bandpass channel, why?" (2) digital cellular phones convert the digitized voice signal to a composite analog signal before sending; "their allocated bandwidth is very wide, so, why not sending the digital signal without conversion?"
  - The slides print no answer to either "why". The lesson answers follow Forouzan's treatment of the same two examples in an earlier edition; they were written from memory, not from a file on disk, and the 6th-edition PDF does not contain them: (1) 4 kHz is so narrow that baseband would give at most 8 kbps (2 × 4000 × log2 2); (2) the wide band is shared among many simultaneous calls, so one call gets a slice that does not start at zero. **Unverified: replace with the in-class answer.**

## 03 — Transmission impairment
- "The imperfection of transmission media causes signal impairment." Causes: **attenuation, distortion, noise**.
- "A wire carrying electric signals gets warm, if not hot, after a while, why?" (no answer on the slide; earlier edition of the textbook, from memory: some of the electrical energy in the signal is converted to heat. **Unverified against a file on disk.**)
- Attenuation: loss of energy to overcome the resistance of the medium. Amplifier: to compensate for the loss. Figure: Point 1 original, Point 2 attenuated, amplifier, Point 3 amplified.
- decibel (dB): measures the relative strengths of two signals or one signal at two different points. Negative if attenuated, positive if amplified. dB = 10 log10(P2/P1) = 20 log10(V2/V1).
- Example: power reduced to one-half: 10 log10(0.5 P1 / P1) = 10 log10 0.5 = 10(-0.3) = **-3 dB**.
- Distortion: the signal changes its form or shape; can occur in a composite signal made of different frequencies; signal components at the receiver have phases different from what they had at the sender. Figure: components in phase at the sender, out of phase at the receiver.
- Noise types (slide table, exact wording): thermal (random motion of electrons in a wire, which creates an extra signal not originally sent by the transmitter); induced (from sources such as motors and appliances; these devices act as a sending antenna, the transmission medium as the receiving antenna); crosstalk (the effect of one wire on the other; one wire acts as a sending antenna and the other as the receiving antenna); impulse (a spike, a signal with high energy in a very short time, from power lines, lightning, and so on).
- SNR = average signal power / average noise power. High SNR: less corrupted by noise; low SNR: more corrupted. SNRdB = 10 log10 SNR. Noiseless channel: SNR = (signal power)/0 = ∞, SNRdB = 10 log10 ∞ = ∞.
- Why SNR: to find the theoretical bit rate limit. Why average powers: these may change with time. Boxed: "SNR is the ratio of what is wanted (signal) to what is not wanted (noise)."
- Example: signal 10 mW, noise 1 μW: 10 mW = 10000 μW; SNR = 10000/1 = **10000**; SNRdB = 10 log10 10^4 = **40 dB**.

## 03 — Data rate limits
- Data rate (also called bit rate or capacity): how fast we can send the data, in bps, over a channel. Three factors: the available bandwidth; the number of signal levels; the quality of the channel (the level of noise). Two formulas: Nyquist (noiseless), Shannon (noisy).
- Nyquist: BitRate = 2 × bandwidth × log2 L (bps; bandwidth of the channel; number of signal levels). Theoretical maximum bit rate for a noiseless channel. Boxed: "Increasing the levels of a signal may reduce the reliability of the system. Why?" (6th ed. p. 36–37: more levels burden the receiver; 2 levels easy, 64 levels need a very sophisticated receiver.)
- Example 1: 265 kbps over a noiseless 30 kHz channel: 265000 = 2 × 30000 × log2 L; log2 L = 4.417; L = 2^4.417 = **21.36 levels**. Not a power of 2 -> increase the number of levels or reduce the bit rate. (32 levels -> 300 kbps; 16 levels -> 240 kbps: computed, not on the slide.) **The textbook's Example 2.6 uses 20 kHz and gets 98.7 levels.**
- Shannon: "In reality, we cannot have a noiseless channel; the channel is always noisy." Capacity = bandwidth × log2(1 + SNR), capacity in bps. Boxed: "No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel."
- Extremely noisy channel, SNR almost zero: C = B log2(1 + 0) = B log2 1 = B × 0 = 0, regardless of the bandwidth.
- Boxed: "The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need."
- Example 2: 1 MHz, SNR 63: C = 10^6 log2(1 + 63) = 10^6 log2 64 = **6 Mbps**; Nyquist 6 Mbps = 2 × 1 MHz × log2 L; log2 L = 3; **L = 8**. **The textbook's Example 2.9 chooses 4 Mbps "for better performance" and gets L = 4.**

## 03 — Bandwidth, bandwidth-delay product
- Bandwidth in two contexts: (1) in hertz, the range of frequencies included in a composite signal or the range of frequencies a channel can pass; (2) in bits per second ("we call this bit rate"), the number of bits per second that a channel, a link, or even a network can transmit. An increase in bandwidth in hertz -> an increase in bandwidth in bits per second.
- Bandwidth-delay product: the number of bits that can fill the link. Important if we send data in bursts and wait for the acknowledgment of each burst before sending the next one. To use the maximum capability of the link, burst size = 2 × bandwidth × delay (fill up the full-duplex channel, two directions). Bits in transition at any time = 2 × bandwidth × delay.
- Figure: bandwidth 5 bps, delay 5 s, bandwidth × delay = 25 bits; rows "After 1 s" to "After 5 s", the first 5 bits moving one second per row.

## 03 — Transmission modes
- Digital data transmission modes: parallel, serial.
- Parallel (n = 8): the 8 bits (0 1 1 0 0 0 1 0) are sent together; we need eight lines. Boxed: "Parallel transmission can increase the transfer speed by a factor of n over serial transmission." Advantage: speed. Disadvantage: cost.
- Serial: the 8 bits are sent one after another; we need only one line (wire). Parallel/serial converter at the sender, serial/parallel converter at the receiver (both boxed in red on slide 48). The reason in the lesson (communication within devices is parallel) is from an earlier edition of the textbook, from memory; the 6th edition has only glossary entries for the two modes. Boxed: "With only one communication channel, serial transmission reduces the cost of transmission over parallel by roughly a factor of n."
- Evolution of USB (Universal Serial Bus): USB 1.0 12 Mbps; USB 2.0 480 Mbps; USB 3.2 Gen 1 (previously 3.0, then 3.1 Gen 1) 5 Gbps; USB 3.2 Gen 2 (previously 3.1 Gen 2) 10 Gbps; USB 3.2 Gen 2x2 (previously 3.2) 20 Gbps.
- Summary slide: baseband and broadband; impairment (attenuation, distortion, noise); data rate limits; "Bandwidth is one of the main performance metrics used in data communications."

## Beyond the slides (labelled as such in the lessons)
- Slide 10 figure labels: digital/analog converter at the sender, analog/digital converter at the receiver.
- Textbook §2.2 Example 2.8, telephone line: 3000 Hz, SNR 3162, C = 3000 log2(3163) = 3000 × 11.627 = 34 881 bps; to go faster, increase the bandwidth or improve the SNR.
- Textbook §2.2 Example 2.12: the link as a pipe (cross section = bandwidth, length = delay, volume = bandwidth-delay product).
- Problem types from the assigned practice set (§2.8), taught with numbers of our own, never the textbook's: decibels add along a path (-3 dB then +7 dB = +4 dB); SNR from a voltage ratio (SNR = ratio squared, or 20 log10 of the ratio in dB); Shannon solved for the SNR (SNR = 2^(C/B) - 1).

## E03 (Week 3 exercises) — no instructor answer sheet; worked from the lecture formulas
1. Cable -0.3 dB/km, 2 mW at the start, power at 5 km: 5 × (-0.3) = -1.5 dB; P2/P1 = 10^-0.15 = 0.708; P2 = **1.42 mW** (1.4 mW to one decimal).
2. 200 mW through 10 devices, each 2 μW of noise: total noise 20 μW; SNR = 200000/20 = **10000**; SNRdB = **40 dB**.
