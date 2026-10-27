# COMP 3721 Midterm module: exam facts and the review list, transcribed from the instructor's material

Source files:
- `D:/BCIT/COMP3721/202630 - COMP3721 - Suggested Midterm Review Topics.pdf` (text export `... Review Topics.txt` beside it), posted 2026-10-26. The review list below is verbatim from the text export, including the two items numbered 9.
- `D:/BCIT/COMP3721/COMP3721 - 00 - Course Introduction.pdf` (slide 5: the grade split and the pass rule).
- `D:/BCIT/COMP3721/exercises/COMP3721 - Sample Quiz Questions.pdf` (the only sample of the instructor's question shapes).
- The weekly modules' source notes: `courses/comp3721-w1` … `comp3721-w7/_SOURCE-NOTES.md` (every fact and number the review lessons quote comes from these).
- The scoping documents: `spec/comp3721/GAP.md` and `spec/comp3721/midterm/GAP.md` (gitignored).

## Exam facts

- **Thursday Oct 29 2026, 11:00, 120 minutes**, on paper.
- Covers **Lecture Notes 01 to 07** plus the textbook chapters (Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed.; the Week 1 to 7 readings are Chapter 1, the self-study material, Chapter 2 and Chapter 3).
- **Calculator allowed.**
- **Two double-sided A4 or Letter cheat sheets** (four sides), handwritten or printed, submitted at the end.
- Course intro slide 5: **Midterm Exam 30%**, Final Exam 30%, quizzes 20%, assignments 20%. "Minimum 50% average between the Midterm and Final Exams is required in order to pass this course." No make-ups: "If you miss a test, exam or quiz, you will receive zero marks."
- The course intro says nothing about the midterm's format or mark split, and no practice midterm is posted.
- Sample Quiz Questions sheet: six questions in three shapes: True or False (2), Fill in the Blanks (2), Written Response (2). The weekly lab quizzes add calculations with units.

## The review list (verbatim)

```text
COMP3721 - Midterm Review

1. Data communications system, communications modes, type of networks,
different topologies, and Internet.

2. Protocol layering and TCP/IP protocol suite, responsibilities of each layer,
type of addressing, name of a packet at each layer, examples of protocols,
etc.

3. Analog/digital data/signals, sine wave (T, f, phase, wavelength), Time-
domain plot vs frequency domain plot, bandwidth of a composite signal, unit
conversion.

4. Baseband transmission vs broadband transmission, computing
attenuation/strength of a signal, distortion, noise, SNR and SNR in dB,
Shannon capacity vs Nyquist data rate (NOTE the difference not only in the
type of the channel but also in the formula itself, we have a factor of 2 in
Nyquist but not in the Shannon formula).

5. Digital-to-digital conversion, line coding techniques and their
characteristics (no need to memorize how each scheme does the encoding
exactly), know how to detect existence of baseline wandering,
synchronization, and DC components, difference between unipolar, polar,
bipolar, etc. Name the techniques for each category.

6. Analog-to-digital conversion, PCM, quantization error and SNR, etc.

7. Digital-to-analog conversion (FSK, ASK, QAM, PSK) and constellation
diagram.

8. Analog-to-analog conversion (AM, FM, PM).

9. NOTE the differences between the techniques in 7 and 8 above.

9. Multiplexing techniques (especially synchronous TDM).

10. You must know that with L signal levels, the number of bits per signal
level is log2L. Also, if there are n constellation points in a constellation
diagram, then each point (i.e., signal element) represent log2n bits.

11. ARP and its role
12. Data Link Layer: Error Detection and Error Correction, Redundancy for
     Error Control (Dataword, Codeword, number of valid and invalid
     codewords), Block Coding, Hamming Distance and Error Detection (how
     many errors can be detected/corrected), Linear Block Codes (Parity
     Check Code), Cyclic Codes (CRC) and Syndrome value, Checksum
     calculation, One's Complement Arithmetic and Wrapping (Hex), FEC,
     Framing, Fixed and Variable Size (Byte oriented and Bit oriented
     approaches - Byte and Bit Stuffing), Flow Control, Error Control (Simple
     and Stop-and-wait Protocols)
```

(The export prints an unknown character between "approaches" and "Byte"; it is shown as a hyphen.)

## Item to lesson map (lessons 01 to 04)

| Item | Midterm lesson | Weekly lessons linked |
|---|---|---|
| 1 | review-networks-layers | w1/data-communications, w1/components-data-flow, w1/networks, w1/topologies, w1/lan-wan-internet |
| 2 | review-networks-layers | w1/why-layers, w1/tcpip-osi, w1/encapsulation-addressing, w1/connecting-devices, w6/data-link-services |
| 3 | review-networks-layers | w2/data-and-signals, w2/sine-wave, w2/phase, w2/wavelength, w2/composite-bandwidth, w2/e02-worked, w1/math-review |
| 4 | review-signals-coding | w3/baseband-broadband, w3/attenuation-decibel, w3/distortion-noise-snr, w3/nyquist, w3/shannon, w3/e03-worked |
| 5 | review-signals-coding | w4/line-coding-elements, w4/data-rate-signal-rate, w4/digital-bandwidth, w4/baseline-dc, w4/self-synchronization, w4/unipolar-polar-nrz, w4/manchester, w4/bipolar-ami, w4/encoding-practice |
| 6 | review-conversion-mux | w5/digitization-pcm, w5/sampling-methods, w5/nyquist-sampling, w5/quantization, w5/encoding-bit-rate, w5/quantization-error-bandwidth, w5/e05-worked |
| 7 | review-conversion-mux | w5/ask-fsk-psk, w5/constellation |
| 8 | review-conversion-mux | w5/am-fm-pm |
| 9 (differences) | review-conversion-mux, then differences | w5/e05-worked, w5/am-fm-pm |
| 9 (multiplexing) | review-conversion-mux | w6/multiplexing, w6/fdm, w6/wdm, w6/synchronous-tdm, w6/tdm-rate-management, w6/multiplexing-examples, w6/e06-worked |
| 10 | review-conversion-mux | w2/digital-signals, w3/nyquist, w4/data-rate-signal-rate, w5/encoding-bit-rate, w5/constellation |
| 11 | review-conversion-mux | w6/arp, w6/link-layer-addressing, w6/alice-to-bob |
| 12 | midterm-format (links only) | every w7 teaching lesson, w7/mock-quiz-7 |

## Practice numbers used in lessons 02 to 04 (ours, never the slide's)

All recomputed in a script before commit. Assignment 1's two plot questions are graded work, so lesson 02's paper task uses new signals: s(t) = −5 sin(8t), and a periodic composite with components at 20, 30, 40 and 50 kHz, each 6 V.

## Open items carried from the weekly modules (flagged in the lessons)

- The two broadband "why?" answers (telephone line, cellular phone) are from memory of an earlier textbook edition, unverified.
- NRZ-L and Manchester polarity: the lessons follow slides 55 and 57 (NRZ-L positive for 0; Manchester 0 high-to-low); 04a draws the opposite; E04 agrees with the slides.
- Nonuniform quantization: slide 46 says Δ is greater near the lower amplitudes; the textbook may say the reverse.
- d in B = (1 + d)S is not defined on the slides.
- No PM bandwidth formula on the slides.
