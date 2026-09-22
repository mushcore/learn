# COMP 3721 Week 2 (lecture 02, E02) — facts and worked answers transcribed from the instructor's material

Source files (Learning Hub export, 2026-09-22): `D:/BCIT/COMP3721/COMP3721 - 00 - Course Introduction.pdf`,
`lectures/COMP3721 - 01a - Week 1 - Part 1.pdf` (69 slides), `01b - Week 1 - Part 2.pdf` (32), `01c - Week 1 - Complementary Notes.pdf` (1 page),
`02 - Week 2 - Copy.pdf` (70); `exercises/A01 - Math Review.pdf`, `A02 - Phase and Unit Circle.pdf`, `E01`/`E02 Week 1/2 Exercises (with Answers)`,
`Sample Quiz Questions.pdf`, `E03 - Week 3 Exercises.pdf` (Week 3, out of scope: dB loss and SNR).
Textbook: Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed. Reading: 01a -> Ch 1 §1.1–1.3, §1.8; 01b -> §1.4–1.6; 02 -> Ch 2 §2.1, §2.8.

## 02 — Data and signals
- What is exchanged: **data** (information); what goes through the network at the physical layer: **signals** (e.g. electrical). Physical layer moves data as electromagnetic signals across a medium; data must be changed to signals. Communication at application/transport/network/data-link is **logical**; at the physical layer it is **physical**.
- Analog data: continuous (sound). Digital data: discrete states (memory 1s and 0s). Analog signal: many levels of intensity over time. Digital signal: limited number of defined values (often 0 and 1).
- Periodic: cycle = one full pattern; period T (seconds) = time for one cycle; a simple periodic analog signal (sine) cannot be decomposed. Nonperiodic (aperiodic). "In data communications, we commonly use **periodic analog signals** and **nonperiodic digital signals**."
- Simple sine wave cannot be decomposed; composite = multiple sine waves. Applications: power distribution (carries energy), burglar alarm (signal of danger).
- Sine parameters: peak amplitude A (highest intensity, proportional to energy, volts); frequency f (# cycles in 1 s, Hz); phase φ (position relative to time 0; degrees or radians; 360° = 2π rad).
- Home voltage: peak 120√2 ≈ 170 V, 60 Hz. Battery 1.5 V constant -> periodic with frequency 0.
- f = 1/T, T = 1/f. 6 periods in 1 s -> 6 Hz. Frequency = rate of change w.r.t. time: no change -> f = 0; instantaneous change -> f = ∞ (T = 0).
- Units: s, ms 10^-3, μs 10^-6, ns 10^-9, ps 10^-12; Hz, kHz 10^3, MHz 10^6, GHz 10^9, THz 10^12.
- Ex 1: 60 Hz -> T = 1/60 = 0.0167 s = **16.7 ms**. Ex 2: T = 200 μs -> f = 1/(200×10^-6) = 1000000/200 = 5000 Hz = **5 kHz**.
- s(t) = A sin(2πft) = A sin(2πt/T); with phase s(t) = A sin(ωt ± φ), ω = 2πf. (a) 5 sin(20πt): A = 5 V, 2πf = 20π -> f = 10 Hz, T = 0.1 s. (b) sin(10t): A = 1 V, 2πf = 10 -> f = 10/(2π) = 1.59 Hz, T = 1/1.59 = 0.628 s.
- A sin(ωt - φ) shifts right by φ/ω; A sin(ωt + φ) shifts left by φ/ω. Example 1: sin(ωt), sin(ωt + 90°) (starts at peak, 1/4 T), sin(ωt + 180°) (1/2 T). 1° = 2π/360 rad; 1 rad = 360/(2π)°; a shift of a complete cycle = 360°.
- Example 2: offset 1/9 cycle -> φ = (1/9)×360° = **40°** = 40° × 2π/360° = 2π/9 = **0.698 rad**.
- Wavelength λ: distance a simple signal travels in one period; used for light in optical fibre; micrometres. Propagation speed depends on medium (and frequency); vacuum 3×10^8 m/s, lower in air, lower in cable. Frequency is independent of the medium; wavelength depends on frequency and medium. λ = c/f = c·T. Red light 4×10^14 Hz -> λ = 3×10^8/4×10^14 = 0.75×10^-6 m = **0.75 μm**.
- Time-domain plot: amplitude vs time (phase not shown). Frequency-domain plot: peak amplitude vs frequency; a sine = one spike; compact for multiple sines.
- A single-frequency sine wave is not useful in data communications (buzz); need a composite signal. **Fourier analysis**: any composite signal is a combination of simple sine waves with different frequencies, amplitudes, phases. Composite periodic -> discrete (integer) frequencies: fundamental (first harmonic) f, third harmonic 3f, ninth harmonic 9f in the slide figure. Composite nonperiodic -> infinite number of sines with continuous frequencies (human voice 0–4 kHz; AM/FM radio).
- Bandwidth B = f_high - f_low of a composite signal.
- Digital signals: most are nonperiodic -> frequency/period unsuitable; use **bit rate** (bits per second, bps). **Bit length** = distance one bit occupies = propagation speed × bit duration; bit duration = 1/(bit rate) (1/1 Mbps = 1 μs). Example: 1 Mbps at 2×10^8 m/s -> bit duration 1 μs -> bit length **200 m**.
- Level: a specific state/value a digital signal can have; binary = 2 levels; more levels possible (octal 8, hexadecimal 16). Two-level figure: 8 bits in 1 s -> 8 bps (1 0 1 1 0 0 0 1). Four-level figure: 16 bits in 1 s -> 16 bps (11 10 01 01 00 00 00 10). log2 4 = 2 bits per level. 11 levels -> log2 11 = 3.46 -> not realistic -> **4 bits** (integer, usually a power of 2). Bits = ceil(log2 L). Ceiling of 3.1416 = 4; floor of 3.1416 = 3.
- Bit-rate example: 100 pages/s × 24 lines × 80 chars × 8 bits = 1 536 000 bps = **1.536 Mbps**.
- A digital signal (periodic or not) is a composite analog signal with frequencies between zero and infinity (infinite bandwidth); periodic digital -> discrete frequencies; nonperiodic digital -> continuous frequencies. Figure: square wave vs its first sine harmonic on -π…π.

## E02 (Week 2 exercises) answers
1. B = 200 kHz, middle 140 kHz, 20 V peak at middle, 0 at extremes: f_h + f_l = 280, f_h - f_l = 200 -> **f_l = 40 kHz, f_h = 240 kHz** (triangle-shaped frequency-domain plot).
2. f_h = 400 MHz, middle 300 MHz -> f_l = **200 MHz**, B = **200 MHz**.
3. 100, 400, 500, 750, 900 Hz -> B = 900 - 100 = **800 Hz**.
4. 200 pages/s: page = 24×80×8 = 15 360 bits; 200×15 360 = 3 072 000 bps = **3.072 Mbps**.
5. 1000 bps: (a) 10 bits -> 10/1000 = **0.01 s** (10 ms); (b) 100 000 chars × 8 = 800 000 bits -> **800 s**.

## E03 preview (Week 3, not in scope)
Cable loss -0.3 dB/km, 2 mW at 5 km; SNR of 200 mW through 10 devices with 2 μW noise each.
