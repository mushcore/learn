# COMP 3721 Week 5 (lectures 05a, 05b, E05) — facts and worked answers transcribed from the instructor's material

Source files: `D:/BCIT/COMP3721/lectures/COMP3721 - 05a - Week 5 - Part 1.pdf` (51 slides, "Analog-to-digital conversion: PCM"),
`lectures/COMP3721 - 05b - Week 5 - Part 2.pdf` (48 slides, "Digital-to-analog and analog-to-analog conversion"),
`exercises/COMP3721 - E05 - Week 5 Exercises with Answers.pdf` (4 exercises, official answers). All downloaded 2026-10-12 (Learning Hub export dated 10/12/2026 11:32).
Textbook: Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed. Reading for 05a: Ch 2 §2.3.2 and §2.8 (practice test). Reading for 05b: Ch 2 §2.4 and §2.8.
Slide figures carry earlier-edition labels ("Figure 5.7 Implementation of BFSK" on 05b slide 12), so the slides are the source of truth; **the textbook was not opened for this transcription** (anything attributed to it below is from memory and labelled unverified).
Slide numbers below are PDF page numbers. Many slides are progressive builds of the same content; only the last build of each is transcribed.

## 05a — Why A2D (slides 2-5)
- Learning outcome: "Explain the Pulse Code Modulation (PCM) technique for analog-to-digital conversion."
- Applications: "The microphone in the recorder, samples the incoming audio signal, quantizes it into digital values, and stores them as PCM-encoded data in a file." "In medical imaging, ADC can be employed to digitize analog signals from various sensors and transducers, such as ultrasound probes or X-ray detectors."
- Slide 4 figure (stock image "Digital to analog converter (DAC) and its applications"): microphone → analog signal → **ADC** → digital signal → digital system → digital signal → **DAC** → analog signal → speakers. Below: V_in sine wave; 01001101 as a square wave; V_DAC as a staircase approximation of a sine.

## 05a — Digitization and PCM (slides 6-8)
- "Digitization: Converting an analog signal to digital data."
- "Pulse Code Modulation (PCM): The most commonly used technique for digitization." "A PCM encoder has three processes: 1. Sampling of the analog signal 2. Quantizing the sampled signal 3. Encoding the quantized information as streams of bits."
- Slide 8 figure (PCM encoder): Analog signal (a smooth curve) → [Sampling] → [Quantizing] → [Encoding] → Digital data `11…1100`. Tap under Sampling labelled "PAM signal" (vertical bars of varying height, no grid); tap above Quantizing labelled "Quantized signal" (same bars drawn against a horizontal grid, heights snapped to grid lines).

## 05a — Sampling (slides 9-20)
- "The first step in PCM is sampling."
- "Pulse Amplitude Modulation (PAM) → another name for sampling process."
- "Sample interval or sample period (T_s): Analog signal is sampled every T_s seconds."
- "Sampling rate or sampling frequency (f_s): f_s = 1/T_s."
- "A signal with an infinite bandwidth cannot be sampled (the signal must be bandlimited)."
- Slide 14 figure, three sampling methods on the same dashed analog curve (one cycle positive then negative), amplitude vs time:
  - a. **Ideal sampling**: vertical stems with dots at the curve's height, spaced T_s (T_s marked between two stems). Annotation slide 17: "Cannot be easily implemented."
  - b. **Natural sampling**: narrow pulses whose tops follow the curve during the pulse. Annotation slide 18: "Uses a high-speed switch (A circuit that can rapidly connect and disconnect a signal path)."
  - c. **Flat-top sampling (sample-and-hold)**: rectangular pulses with flat tops at the sampled value. Annotation slide 19: "Uses a circuit." Annotation slide 20: "**The most commonly used method**."
- FYI slide 15, Ideal sampling: "Other terminology used in the literature: Impulse Sampling. Input signal x(t) convoluted (multiplied) with an impulse train. You cannot use this practically because pulse width cannot be zero and the generation of impulse train is not possible practically."
- FYI slide 16, Convolution: "Convolution is used to represent the process of sampling an analog signal and converting it into a discrete-time digital signal. … Convolution can be thought of as a way to 'pass' or combine two signals through each other. In the time domain sampling is multiplication by an impulse train. In the frequency domain sampling is convolution by an impulse train." (FYI; not quiz material.)

## 05a — Nyquist theorem and sampling rate (slides 21-29)
- Slide 21, boxed: "**According to the Nyquist theorem, to reproduce the original analog signal, the sampling rate must be at least 2 times the highest frequency contained in the signal.**"
  - "Nyquist rate → f_N = 2 f_max (Hz)"; "Nyquist interval → 1/f_N = 1/(2 f_max) (s)".
  - "**Low-pass** analog signal → **bandwidth = highest frequency**." "**Bandpass** analog signal → **bandwidth < highest frequency**."
- Slides 22-25 figure (a sine wave of frequency f, sampled; left the sine with dots, right the dots joined by dashed lines):
  - a. Nyquist rate sampling: f_s = 2f. Two samples per cycle at the peaks → a triangle wave. Annotation: "A good approximation of the original sine wave."
  - b. Oversampling: f_s = 4f. Four samples per cycle (peaks and zero crossings) → the same triangle wave. Annotation: "Same approximation but redundant and unnecessary."
  - c. Undersampling: f_s = f. One sample per cycle, at different points of successive cycles (the figure's three samples are a peak, a zero crossing and a trough) → a slow wave. Annotation: "Produces a signal that does not look like the original one."
- Example (slides 26-27): "What is the minimum sampling rate for a low-pass signal that has a bandwidth of 100 kHz?" Answer: "For a low-pass signal, bandwidth = highest frequency (f_max). Therefore, Minimum sampling rate = 2 × 100000 = **200000 samples per second**."
- Example (slides 28-29): "What is the minimum sampling rate for a bandpass signal that has a bandwidth of 100 kHz?" Answer: "**We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.** We do not know the maximum frequency in the signal. (so, what to do?) We should either try to find or measure the maximum frequency or obtain additional information about the signal to make this determination."

## 05a — Quantization (slides 30-42)
- "Quantization: The set of amplitudes (can be infinite with nonintegral values) is mapped to a set of discrete values." "Quantization is an approximation process."
- Steps: "1. Assume that the original analog signal has instantaneous amplitudes between V_min and V_max. 2. Divide the range into L zones (L also called the number of quantization levels), each of height Δ (delta): **Δ = (V_max − V_min)/L**. 3. Assign quantized values of 0 to L − 1 to the midpoint of each zone. 4. Approximate the value of the sample amplitude to the quantized values."
- Worked example figure (slides 36-42), the textbook's PCM example: **L = 8, Δ = 5 V**, signal between **−20 V and +20 V** (so Δ = 40/8 = 5 V; the slide writes "D = Δ"). Vertical axis "Normalized amplitude" from −4D to 4D in steps of D; eight horizontal zones (alternating yellow and blue) with quantization codes 7 (top, 3D to 4D) down to 0 (bottom, −4D to −3D). Zone k spans from (k − 4)D to (k − 3)D; its midpoint is (k − 3.5)D.
  - Nine samples (actual amplitudes, V): **−6.1, 7.5, 16.2, 19.7, 11.0, −5.5, −11.3, −9.4, −6.0**.
  - "Normalized PAM values = Actual amplitude/Δ. E.g., −6.1/5 = −1.22": **−1.22, 1.50, 3.24, 3.94, 2.20, −1.10, −2.26, −1.88, −1.20**.
  - "−1.22 belongs to zone 2 → Normalized quantized value = Midpoint of this zone = −1.50." Normalized quantized values: **−1.50, 1.50, 3.50, 3.50, 2.50, −1.50, −2.50, −1.50, −1.50**.
  - "Normalized error is the difference between normalized quantized value and normalized PAM value" (quantized − PAM): **−0.28, 0, +0.26, −0.44, +0.30, −0.40, −0.24, +0.38, −0.30**.
  - Quantization code: **2, 5, 7, 7, 6, 2, 1, 2, 2** ("−1.50 → midpoint of zone 2").
  - Encoded words (3 bits each, "Encoding (Last step of PCM)"): **010, 101, 111, 111, 110, 010, 001, 010, 010**.
  - Note for the lesson: the sample 1.50 sits exactly on the boundary between zones 4 (0 to D) and 5 (D to 2D); the slide puts it in zone 5 (code 5, quantized value 1.50, error 0). A sample on a boundary follows the slide: it goes to the upper zone in this example. (Observation from the figure, not a stated rule.)

## 05a — Encoding and bit rate (slide 43)
- "Each quantized sample can be changed to an n_b-bit code word. (L is the number of quantization levels/zones): **n_b = log₂ L**." "Number of bits per sample = n_b = log₂ L."
- "**Bit rate = Sampling rate × Number of bits per sample = f_s × n_b**."

## 05a — Choosing L, quantization error, uniform vs nonuniform (slides 44-46)
- Slide 44: "Choosing L (the number of quantization levels) depends on: The range of the amplitudes of the analog signal. The required accuracy of recovering the signal." "If the amplitude of a signal fluctuates between two values only, L = 2." "For a signal with many amplitude values, e.g., voice, more quantization levels are needed." "**In audio digitizing, L = 256.**" "Choosing lower values of L increases the quantization error if there is a lot of fluctuation in the signal."
- Slide 45, Quantization error (noise): "**−Δ/2 ≤ quantization error ≤ Δ/2**." "The quantization error changes the SNR of the signal → the upper limit capacity (bit rate) is **decreased** (according to Shannon Capacity)." "The contribution of the quantization error to the SNR_dB of the signal depends on the number of quantization levels L, or the bits per sample n_b." Boxed: "**SNR_dB = 6.02 n_b + 1.76 dB**."
  - Not on the slide but useful (compute, label as ours): n_b = 8 → 49.92 dB; n_b = 16 → 98.08 dB; each extra bit adds about 6 dB.
- Slide 46, Uniform quantization: "Issues with uniform quantization: Only optimal for uniformly distributed signal. Often the distribution of the instantaneous amplitudes in the analog signal is not uniform. Applications such as speech and music (real audio signals) are more concentrated near zeros (lower amplitudes)." "In nonuniform quantization, height of Δ is not fixed; it is greater near the lower amplitudes and less near the higher amplitudes." **Check the wording**: the slide says Δ is *greater* near the lower amplitudes and *less* near the higher amplitudes. (Forouzan's text says nonuniform quantization uses smaller zones near the low amplitudes where the signal is concentrated — from memory, unverified. Teach the slide's sentence verbatim and flag the possible discrepancy as "ask in class".)

## 05a — PCM bandwidth (slides 47-48)
- "Given the bandwidth of a **low-pass analog signal**, we want to find the **new minimum bandwidth of the channel that can pass the digitized version of this signal**."
- Derivation (slide 48): **B_min = c × N × 1/r = c × (n_b × f_s) × 1/r = c × n_b × 2 f_max × 1/r**; **B_min = c × n_b × 2 × B_analog × 1/r**.
- "If c = 1/2 (average case) and r = 1 (NRZ or bipolar line coding): **B_min = n_b × B_analog**."
- Boxed: "**The minimum bandwidth of the digital signal is n_b times greater than the bandwidth of the analog signal. This is the price we pay for digitization.**"
- Summary (slide 49): "PCM is a technique for analog-to-digital conversion. PCM includes sampling, quantizing and encoding. PCM requires more bandwidth than the bandwidth of the input analog signal."

## 05b — Why D2A and A2A, review terms (slides 2-5)
- Learning outcomes: "Explain three digital-to-analog conversion techniques. Describe the constellation diagrams. Explain analog-to-analog conversion techniques."
- D2A example: "when you play music on your smartphone and listen through wired headphones, the digital music file is converted into analog audio signals by the smartphone's DAC before reaching your ears." A2A example: "Radio stations broadcast analog signals in the form of continuous electromagnetic waves that carry audio information, so you can listen to the radio."
- Review: "Data element vs Signal element. Data rate (bit rate) vs Signal rate (baud rate)." "**In analog transmission of digital data, r = log₂ L (L is the number of different signal elements/levels) and baud rate ≤ bit rate (S = N/r).**"
- "**Carrier signal (carrier frequency)**: A high-frequency signal produced by the sending device and acts as a base for the information signal. The carrier signal is a simple sine wave. The receiver is tuned to the frequency of the carrier signal."

## 05b — Digital-to-analog conversion (slides 6-7)
- "Converting digital data to a bandpass analog signal. Modifying any of the three characteristics (amplitude, frequency, and phase) of a sine wave (i.e., carrier signal) based on the information in the digital data. The process is called **modulation or shift keying**."
- Slide 7 tree: Digital-to-analog conversion → ASK, FSK, PSK (yellow); dashed arrows from ASK and PSK into **QAM (Quadrature amplitude modulation)** (green).

## 05b — ASK (slides 8-11)
- "The **amplitude of the carrier signal is varied** to create signal elements. Both **frequency** and **phase** remain constant."
- Binary ASK (BASK), slide 9: "Implemented using only **two levels** of signal elements. Also called **OOK (On-Off Keying)**. Peak amplitude → for one signal level is 0, for the other one is equal to the peak amplitude of the carrier signal." Figure: bits 1 0 1 1 0 as a square wave; carrier (continuous sine); modulated signal (sine during 1s, flat zero during 0s). Implementation: digital signal → Multiplier (×) ← Oscillator (f_c) → modulated signal.
- Bandwidth for ASK, slide 10: "The process of modulation produces a **nonperiodic composite signal**. Bandwidth is **proportional** to the **signal rate**." Figure: bits 1 0 1 1 0, "Bit rate: 5", five signal elements in 1 s, "Baud rate: 5". Yellow box: "**r = 1, S = N, B = (1 + d)S**"; spectrum a rounded hump centred on f_c (annotation "Carrier frequency"), width "Bandwidth".
  - d is not defined on the slide. (Forouzan: d is a factor between 0 and 1 that depends on the modulation and filtering process — from memory, unverified. Teach it as "a factor between 0 and 1"; say the slide leaves it undefined.)
- Multi-level ASK, slide 11: "More than two voltage levels is used → but it is not common. More than 1 bit can be sent in a signal element. Example: 4 different amplitudes (voltage levels) → 2 bits per signal element (r = 2); 8 different amplitudes → 3 bits per signal element (r = 3) …"

## 05b — FSK (slides 12-15)
- "The **frequency** of the **carrier signal** is **changed** to represent data. The frequency of the modulated signal is constant for the duration of one signal element; changes for the next signal element if the data element changes. **Peak amplitude** and **phase** are **constant** for all signal elements." Figure ("Figure 5.7 Implementation of BFSK"): bits 1 0 1 1 0, carrier, modulated signal with denser sine during 1s; implementation: digital signal → **VCO (Voltage-controlled oscillator)** → modulated signal.
- Binary FSK (BFSK), slide 13: "**Two carrier frequencies**, f₁ and f₂ are used. If the data element is 0, f₁ is used. If the data element is 1, f₂ is used." Figure: bits 1 0 1 1 0, bit rate 5, baud rate 5, 1 s; yellow box "**r = 1, S = N, B = (1 + d)S + 2Δf**"; spectrum two humps at f₁ and f₂, each of width S(1 + d), separated by 2Δf (written "2Df" in the figure).
- Slide 14: "(Δ_f is shown as Df in the figure.) Both f₁ and f₂ are Δ_f apart from the midpoint between the two bands. The difference between the two frequencies is 2Δ_f."
- Multilevel FSK (MFSK), slide 15: "More than two frequencies are used. Examples: 4 frequencies to send 2 bits at a time (2 bits per signal element); 8 frequencies to send 3 bits at a time …"

## 05b — PSK (slides 16-20)
- "The **phase of the carrier** is changed to represent two or more different signal elements. Both **peak amplitude** and **frequency** remain constant as the phase changes. **More common than ASK or FSK.** Less susceptible to noise than ASK, why?" Answer (slide 17): "**Because noise can change the amplitude easier than it can change the phase.**" Slide 18: "PSK needs more sophisticated hardware to be able to distinguish between phases."
- Binary PSK (BPSK), slide 19: "**Two signal elements** are used (one with a phase of 0°, and the other with a phase of 180°). **Same bandwidth** as BASK but less than BFSK." Figure: bits 1 0 1 1 0, bit rate 5, baud rate 5; the sine flips phase at each 1↔0 change (1 drawn blue, 0 black); yellow box "**r = 1, S = N, B = (1 + d)S**"; one hump at f_c.
- BPSK implementation, slide 20: the digital signal drawn as a **polar NRZ** signal (1 high, 0 low, both sides of the axis) → Multiplier (×) ← Oscillator (f_c) → modulated signal (the 0 bits are the inverted sine).

## 05b — QAM (slides 21-22)
- "**Combines ASK and PSK.** The **dominant** method of digital-to-analog modulation. Using **two carriers, one in-phase and the other quadrature** (i.e., the two carrier signals are out-of-phase with each other by **90°**), with different peak amplitude levels for each carrier. The same advantages as PSK over ASK. The same minimum required bandwidth as ASK and PSK. Widely used as a modulation scheme for digital telecommunication systems, such as in 802.11 Wi-Fi standards."
- Slide 22 figure "Typical Modulated 8-QAM Waveform": "Bit rate: 24, Baud rate: 8", eight signal elements of 3 bits each in 1 s: **101, 100, 001, 000, 010, 011, 110, 111**, each "1 baud"; each element two cycles of a sine with one of two amplitudes (large for 101, 001, 011, 111; small for 100, 000, 010, 110) and a phase change between some elements.

## 05b — Constellation diagrams (slides 23-38)
- Slide 23: "A representation of a signal modulated by a digital modulation scheme. Assists us in defining the amplitude and phase of a signal element, particularly when we are using two carriers (one in-phase, one quadrature). Useful when dealing with multilevel ASK, PSK and QAM. A signal element type is represented as a **dot** (a bit or combination of bits it can carry is often written next to it)."
- Slide 24 figure: axes **X (In-phase carrier)** and **Y (Quadrature carrier)**; a dot with a dashed line from the origin: "**Length: amplitude**", "**Angle: phase**"; projections "Amplitude of I component" (on X) and "Amplitude of Q component" (on Y).
- Slide 25: "**A modulation with n constellation points transmits log₂ n bits per signal element.**"
- Example 1 (slides 26-27), ASK (OOK): two dots on the X axis, "0" at the origin, "1" to the right. "Binary ASK: Only an in-phase carrier → the two points should be on the X axis. Binary 0 has an amplitude of 0 V. Binary 1 has an amplitude more than zero."
- Example 2 (slides 28-29): "Draw the constellation diagram for binary ASK, with peak amplitude values of 1 V and 3 V." Answer figure: two dots on the positive I axis labelled **1 V** and **3 V** (axes labelled I and Q).
- Example 3 (slides 30-31), BPSK: dots "0" on the negative X axis and "1" on the positive X axis, equidistant. "BPSK also uses only an in-phase carrier. It creates two different signal elements, one with amplitude 1 V and in phase and the other with amplitude 1 V and 180° out of phase."
- Example 4 (slides 32-33): "Draw the constellation diagram for BPSK, with a peak amplitude value of 2 V." Answer: dots at **−2 V** and **+2 V** on the I axis, both labelled "2 V".
- Example 5 (slides 34-35): "Draw the constellation diagram for 8-QAM with two different peak amplitude values, 1 V and 3 V, and four different phases." Answer figure: eight dots on the two diagonals (phases 45°, 135°, 225°, 315°), an inner dot at 1 V and an outer dot at 3 V on each diagonal; labels "1 V" near the four inner dots and "3 V" near the four outer dots.
- Slide 36 figure "Constellation Diagrams for Some QAMs": a. 4-QAM: four dots at the corners of a square in the first quadrant, one corner at the origin (unipolar: amplitudes 0 or A on each carrier). b. 4-QAM: four dots at the corners of a square centred on the origin (one per quadrant). c. 4-QAM: four dots in a small square entirely inside the first quadrant. d. 16-QAM: four dots in each quadrant (a 2×2 cluster per quadrant).
- Example 6 (slide 37), 16-QAM: "The distance **A** from the point to the origin (0,0) represents the **amplitude** after modulation. The angle **φ** of the point represents the **phase** after modulation." Figure: 4×4 grid of dots at I, Q ∈ {−3A, −A, A, 3A} with 4-bit labels (Gray-coded; row Q = 3A: 0010, 0011, 0001, 0000; Q = A: 0110, 0111, 0101, 0100; Q = −A: 1110, 1111, 1101, 1100; Q = −3A: 1010, 1011, 1001, 1000, left to right), a red arc labelled "Included angle φ" and a line from the origin to the 1010 point.
- Slide 38 figure "Different n-QAM": nested square constellations 4-QAM (inner 2×2 at ±1), 16-QAM (4×4 at ±1, ±3), 32-QAM (cross shape), 64-QAM (8×8 at ±1 … ±7); table **Bits per symbol / Number of symbols / QAM modulation: 4 → 2⁴ = 16 → 16-QAM; 6 → 2⁶ = 64 → 64-QAM; 8 → 2⁸ = 256 → 256-QAM; 10 → 2¹⁰ = 1024 → 1024-QAM; 12 → 2¹² = 4096 → 4K-QAM; …**

## 05b — Analog-to-analog modulation (slides 39-45)
- Slide 39 tree: Analog-to-analog conversion → Amplitude modulation, Frequency modulation, Phase modulation.
- AM, slide 40: "The carrier signal is modulated so that its **amplitude varies** with the changing amplitudes of the modulating signal. The frequency and phase of the carrier remain the same." "**The bandwidth of the modulated signal is twice the bandwidth of the modulating signal and covers a range centered on the carrier frequency.**" Figure: modulating signal (slow wave), carrier frequency (fast sine), modulated signal (fast sine inside an envelope that follows the modulating signal); spectrum hump centred on f_c labelled "**B_AM = 2B**".
- Slide 41, AM radio: "The bandwidth of an audio signal (speech and music) is usually **5 kHz** → AM radio station needs a bandwidth of **10 kHz**. The Federal Communications Commission (FCC) allows 10 kHz for each AM station. To avoid interference, each station's carrier frequency must be separated from those on either side of it by at least 10 kHz."
- Slide 42: the US frequency allocations chart (NTIA, October 2003), decorative.
- FM, slide 43: "The **frequency** of the carrier signal is modulated to follow the changing voltage level (amplitude) of the modulating signal. The **peak amplitude** and **phase** of the carrier signal remain constant. The total bandwidth required for FM can be determined from the bandwidth of the analog (modulating) signal." Figure: modulating signal (audio), carrier, FM signal (denser where the modulating signal is high); spectrum hump labelled "**B_FM = 2(1 + β)B**" (the figure prints "2(1 + b)B").
- Slide 44, FM radio: "The bandwidth of an audio signal (speech and music) in stereo is almost **15 kHz**. The FCC allows **200 kHz** for each FM station (i.e., **β = 4** with extra 50 kHz guard band). Stations must be separated by at least 200 kHz to keep their bandwidths from overlapping." Arithmetic (ours): 2(1 + 4) × 15 kHz = 150 kHz, plus 50 kHz guard = 200 kHz.
- PM, slide 45: "The **phase** of the carrier signal is modulated to follow the changing voltage level (amplitude) of the modulating signal. The **peak amplitude** and **frequency** of the carrier signal remain fixed." (No figure, no bandwidth formula on the slide. Forouzan gives B_PM = 2(1 + β)B as for FM — from memory, unverified; mention only as "the book's formula, unverified, not on the slide".)
- Summary (slide 46): "**When we have a bandpass channel, we require analog transmission.** Digital-to-analog conversion (ASK, FSK, PSK, QAM). Analog-to-analog conversion (AM, FM, PM)."

## E05 — Week 5 exercises (official answers)
1. "We know that the human voice normally includes frequencies from 0 to 4 kHz. If we want to digitize the human voice, what is the bit rate, assuming 8 bits per sample?" Answer: "4 kHz = 4000 Hz. Sampling rate = f_max × 2 = 4000 × 2 = 8000 samples/s. Bit rate = Sampling rate × Number of bits per sample = 8000 × 8 = **64000 bps or 64 kbps**."
2. "Assume PCM is used to convert an analog signal to digital data. If the number of quantization levels is 64, how many bits are required per sample? If the bandwidth of the original analog signal is 300 MHz, what is the minimum required bandwidth to for transmission of the corresponding digital signal (assume r = 1)?" Answer: "Number of bits per sample = n_b = log₂ 64 = **6**. B_min = n_b × B_analog = 6 × 300M = **1800 MHz = 1.8 GHz**." (c = 1/2 is assumed silently, as on slide 48.)
3. "Assume PCM is used to convert an analog signal to digital data. If we increase the number of quantization levels, what is its impact on the number of bits per sample and the bit rate? Explain." Answer: "Number of bits per sample = n_b = log₂ L (L is the number of quantization levels) → Therefore, the number of bits per sample **increases**. Also, Bit rate = Sampling rate × Number of bits per sample = f_s × n_b → Thus, bit rate also **increases**."
4. "If we have a constellation diagram with 16 constellation points, what is the number of bits per constellation point (i.e., per signal element)? Assume the amplitude for a constellation point is 5 volts while the amplitude of the in-phase carrier is 3 volts. What is the amplitude of the quadrature carrier?" Answer: "Number of bits = log₂ 16 = **4**. 5² = 3² + q²; q² = 25 − 9; **q = 4 V**." (Pythagoras on the constellation point: amplitude² = I² + Q².)

## Beyond the slides (label as such in the lessons)
- Zone arithmetic for the quantization widget: zone index k = floor(normalized value) + L/2 for a symmetric range (clamped to 0 … L − 1); midpoint = k − L/2 + 0.5 in units of Δ; code word = k in n_b bits. Reproduces every row of the slide-36 table (with the boundary sample 1.50 going up to zone 5).
- Quiz-style inverse questions the sheet does not ask but the formulas support: bit rate ÷ n_b = f_s; f_s ÷ 2 = f_max; L from n_b (L = 2^n_b).
- The textbook's Nyquist example "a complex low-pass signal with bandwidth 200 kHz → sampling rate 400 000 samples/s" and its "human voice 0 to 4 kHz, 8 bits → 64 kbps" (E05 exercise 1 is this one) — from memory, unverified; only E05's version is to be cited.
- SNR_dB per n_b table and the "each bit adds about 6 dB" reading are computed from the slide formula, not printed.
- ASK/FSK/PSK/QAM carrier phase pictures in a widget are drawn from the stated rules (ASK amplitude 0 or A; BFSK f₁ for 0 and f₂ for 1; BPSK 0° for 1 and 180° for 0 as in the slide-19 figure, where the 1 bits are the un-inverted sine); the slides never state which phase is bit 1 in words.

## Conflicts and open questions
- Slide 46's direction for Δ in nonuniform quantization ("greater near the lower amplitudes and less near the higher amplitudes") may be the reverse of the textbook. Teach the slide; add an "ask in class" note.
- BPSK: slide 19 says 0° and 180° but does not say which bit gets which; the figure draws bit 1 as the carrier's phase (blue) and bit 0 inverted. Constellation Example 3 puts "1" on the positive axis, "0" on the negative, consistent with the figure.
- d in B = (1 + d)S is never defined on the slides.
- No E06 is posted; no mention on any slide of the lab quiz schedule. Quiz N is held in the lab of week N + 1 and covers Lecture N (Quiz 3 covered 03, Quiz 4 covers 04, per the Week 3 and Week 4 module intros), so **Quiz 5 is expected to cover 05a and 05b** (this module) and Quiz 6 to cover 06a and 06b.
