---
title: What the midterm looks like and how to answer each shape
minutes: 10
---

The midterm is one paper of 120 minutes over seven weeks of lectures. This lesson sets out what is known about it, the instructor's review list with the lesson that teaches each item, and how to answer each question shape for full marks.

## Thursday Oct 29, 11:00: 120 minutes on Lecture Notes 01 to 07

| Item | The fact |
|---|---|
| Date and time | Thursday Oct 29 2026, 11:00, 120 minutes, on paper |
| Scope | Lecture Notes 01 to 07 plus the textbook chapters (Ch 1 to 3) |
| Weight | *Midterm Exam 30%* (course intro, slide 5) |
| Pass rule | *Minimum 50% average between the Midterm and Final Exams is required in order to pass this course.* |
| Make-ups | None: *If you miss a test, exam or quiz, you will receive zero marks.* |
| Calculator | Allowed; one with a log key does every dB, Nyquist and Shannon step |
| Cheat sheets | Two double-sided A4 or Letter sheets (four sides), handwritten or printed |
| Format | Not stated anywhere; no practice midterm is posted |

The only sample of the instructor's question style is the Sample Quiz Questions sheet, worked in [the E01 and sample-quiz lesson](#/comp3721-w1/e01-sample-quiz). It has three shapes: true or false, fill in the blanks and written response. Every lab quiz has also carried calculations, so the mock in this module adds a calculation part.

## The review list, item by item

The instructor's *Suggested Midterm Review Topics*, in its own words (it numbers two items 9), with the lessons that teach each one. Lessons 02 to 04 of this module walk items 1 to 11 with a check per point.

| # | The review list | Taught in |
|---|---|---|
| 1 | *Data communications system, communications modes, type of networks, different topologies, and Internet.* | [data communications](#/comp3721-w1/data-communications), [components and data flow](#/comp3721-w1/components-data-flow), [networks](#/comp3721-w1/networks), [topologies](#/comp3721-w1/topologies), [LAN, WAN, Internet](#/comp3721-w1/lan-wan-internet); review: [items 1 to 3](#/comp3721-midterm/review-networks-layers) |
| 2 | *Protocol layering and TCP/IP protocol suite, responsibilities of each layer, type of addressing, name of a packet at each layer, examples of protocols, etc.* | [why layers](#/comp3721-w1/why-layers), [TCP/IP and OSI](#/comp3721-w1/tcpip-osi), [encapsulation and addressing](#/comp3721-w1/encapsulation-addressing), [connecting devices](#/comp3721-w1/connecting-devices); review: [items 1 to 3](#/comp3721-midterm/review-networks-layers) |
| 3 | *Analog/digital data/signals, sine wave (T, f, phase, wavelength), Time-domain plot vs frequency domain plot, bandwidth of a composite signal, unit conversion.* | [data and signals](#/comp3721-w2/data-and-signals), [sine wave](#/comp3721-w2/sine-wave), [phase](#/comp3721-w2/phase), [wavelength](#/comp3721-w2/wavelength), [composite and bandwidth](#/comp3721-w2/composite-bandwidth), [E02](#/comp3721-w2/e02-worked); review: [items 1 to 3](#/comp3721-midterm/review-networks-layers) |
| 4 | *Baseband transmission vs broadband transmission, computing attenuation/strength of a signal, distortion, noise, SNR and SNR in dB, Shannon capacity vs Nyquist data rate (NOTE the difference not only in the type of the channel but also in the formula itself, we have a factor of 2 in Nyquist but not in the Shannon formula).* | [baseband and broadband](#/comp3721-w3/baseband-broadband), [attenuation](#/comp3721-w3/attenuation-decibel), [distortion, noise, SNR](#/comp3721-w3/distortion-noise-snr), [Nyquist](#/comp3721-w3/nyquist), [Shannon](#/comp3721-w3/shannon), [E03](#/comp3721-w3/e03-worked); review: [items 4 and 5](#/comp3721-midterm/review-signals-coding) |
| 5 | *Digital-to-digital conversion, line coding techniques and their characteristics (no need to memorize how each scheme does the encoding exactly), know how to detect existence of baseline wandering, synchronization, and DC components, difference between unipolar, polar, bipolar, etc. Name the techniques for each category.* | [line coding](#/comp3721-w4/line-coding-elements), [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate), [baseline and DC](#/comp3721-w4/baseline-dc), [self-synchronization](#/comp3721-w4/self-synchronization), [unipolar and polar NRZ](#/comp3721-w4/unipolar-polar-nrz), [Manchester](#/comp3721-w4/manchester), [bipolar AMI](#/comp3721-w4/bipolar-ami); review: [items 4 and 5](#/comp3721-midterm/review-signals-coding) |
| 6 | *Analog-to-digital conversion, PCM, quantization error and SNR, etc.* | [PCM](#/comp3721-w5/digitization-pcm), [Nyquist sampling](#/comp3721-w5/nyquist-sampling), [quantization](#/comp3721-w5/quantization), [bit rate](#/comp3721-w5/encoding-bit-rate), [quantization error](#/comp3721-w5/quantization-error-bandwidth); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 7 | *Digital-to-analog conversion (FSK, ASK, QAM, PSK) and constellation diagram.* | [ASK, FSK, PSK](#/comp3721-w5/ask-fsk-psk), [constellation](#/comp3721-w5/constellation); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 8 | *Analog-to-analog conversion (AM, FM, PM).* | [AM, FM, PM](#/comp3721-w5/am-fm-pm); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 9 | *NOTE the differences between the techniques in 7 and 8 above.* | [E05 worked](#/comp3721-w5/e05-worked); [the differences](#/comp3721-midterm/differences) |
| 9 | *Multiplexing techniques (especially synchronous TDM).* | [FDM](#/comp3721-w6/fdm), [WDM](#/comp3721-w6/wdm), [synchronous TDM](#/comp3721-w6/synchronous-tdm), [rate management](#/comp3721-w6/tdm-rate-management), [examples](#/comp3721-w6/multiplexing-examples), [E06](#/comp3721-w6/e06-worked); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 10 | *You must know that with L signal levels, the number of bits per signal level is log2L. Also, if there are n constellation points in a constellation diagram, then each point (i.e., signal element) represent log2n bits.* | [digital signals](#/comp3721-w2/digital-signals), [constellation](#/comp3721-w5/constellation); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 11 | *ARP and its role* | [ARP](#/comp3721-w6/arp), [link-layer addressing](#/comp3721-w6/link-layer-addressing), [Alice to Bob](#/comp3721-w6/alice-to-bob); review: [items 6 to 11](#/comp3721-midterm/review-conversion-mux) |
| 12 | *Data Link Layer: Error Detection and Error Correction, Redundancy for Error Control (Dataword, Codeword, number of valid and invalid codewords), Block Coding, Hamming Distance and Error Detection (how many errors can be detected/corrected), Linear Block Codes (Parity Check Code), Cyclic Codes (CRC) and Syndrome value, Checksum calculation, One's Complement Arithmetic and Wrapping (Hex), FEC, Framing, Fixed and Variable Size (Byte oriented and Bit oriented approaches* – *Byte and Bit Stuffing), Flow Control, Error Control (Simple and Stop-and-wait Protocols)* | [types of errors](#/comp3721-w7/types-of-errors), [block coding](#/comp3721-w7/block-coding), [Hamming distance](#/comp3721-w7/hamming-distance), [parity check](#/comp3721-w7/parity-check), [cyclic codes](#/comp3721-w7/cyclic-codes), [CRC division](#/comp3721-w7/crc-division), [checksum](#/comp3721-w7/checksum), [FEC](#/comp3721-w7/fec), [framing](#/comp3721-w7/framing), [bit stuffing](#/comp3721-w7/bit-stuffing), [flow and error control](#/comp3721-w7/flow-and-error-control), [Simple and Stop-and-Wait](#/comp3721-w7/simple-and-stop-and-wait); check: [Mock Quiz 7](#/comp3721-w7/mock-quiz-7) |

Two items carry the instructor's own warning. Item 4: Nyquist has a factor of 2 and Shannon does not. Item 9: the digital-to-analog and analog-to-analog techniques must be told apart, which [the differences lesson](#/comp3721-midterm/differences) drills as written responses.

## Four shapes, four ways to earn the mark

**True or false.** The sample sheet's false item is a slide sentence with one word changed: *Data-link layer* where the slide says physical layer. Read every noun and every number in the statement against the slide sentence you know. An almost-right sentence is the usual trap, so a statement that sounds familiar is not yet true.

**Fill in the blanks.** The blank is marked against the slide's exact term. Write *jitter* for the uneven delay in delivering audio or video packets, not "delay"; *frequency-domain plot*, not "spectrum"; *survivability* for ARPANET's main design goal, not "reliability". When two terms fit, write the one the slide uses and add the other in brackets.

**Written response.** Two to four sentences in three moves: name the thing in the slide's words, give the reason, give an example or a number. For "two disadvantages of a mesh topology": installation and reconnection are difficult, and the hardware is expensive, because every device needs a dedicated point-to-point link to every other one; 10 devices already need 10 × 9 / 2 = 45 links.

**Calculation.** Four lines: the formula in the slide's notation, the substitution with units, the answer with its unit and prefix, and a check. The check catches the common losses: a missing factor of 2 in Nyquist or in the sampling rate, an SNR left in dB inside Shannon, kHz written where kbps was asked, and a dB value without its sign (attenuation is negative).

## A time plan for 120 minutes

No mark split is posted, so this plan follows the mock in this module (120 marks, about one per minute).

| Part | Shape | Minutes |
|---|---|---|
| A | True or false | 10 |
| B | Fill in the blanks | 12 |
| C | Written response | 30 |
| D | Calculations | 58 |
| | Checking units, prefixes, signs and the factor of 2 | 10 |

Parts A and B reward exact recall, so answer them quickly and move on; Part C rewards the three-move structure; Part D rewards shown working. Do the calculations you are sure of first, then come back to the rest. Write every formula before substituting: a correct formula with a slip in the arithmetic usually keeps most of the marks.

```quiz
[
  {
    "q": "The midterm's two cheat sheets may be printed rather than handwritten.",
    "type": "tf",
    "answer": true,
    "explain": "True. Two double-sided A4 or Letter cheat sheets are allowed, handwritten or printed: four sides in all."
  },
  {
    "q": "How many minutes long is the midterm?",
    "type": "numeric",
    "answer": 120,
    "tolerance": 0,
    "unit": "minutes",
    "explain": "Thursday Oct 29 2026, 11:00, 120 minutes. The time plan gives 58 of them to calculations."
  },
  {
    "q": "What does the course intro require to pass the course?",
    "options": ["A minimum 50% average between the Midterm and Final Exams", "At least 50% on the midterm alone", "At least 50% on the final alone", "A minimum 60% average over all quizzes"],
    "answer": 0,
    "explain": "Slide 5: *Minimum 50% average between the Midterm and Final Exams is required in order to pass this course.* The midterm is worth 30% and the final 30%."
  },
  {
    "q": "The midterm covers Lecture Notes 01 to 06; Week 7 is left for the final.",
    "type": "tf",
    "answer": false,
    "explain": "False. It covers Lecture Notes 01 to 07, and item 12 of the review list is the whole of Week 7: error detection and correction, framing, flow and error control."
  },
  {
    "q": "Fill in the blank with the slide's term: the uneven delay in the delivery of audio or video packets is called ________.",
    "type": "text",
    "answer": ["jitter", "Jitter"],
    "explain": "Jitter, the fourth of the four characteristics of an effective data communications system (delivery, accuracy, timeliness, jitter). The fill-in is marked against this exact term; \"delay\" or \"latency\" loses the mark."
  },
  {
    "q": "A calculation asks for an attenuation. Which answer keeps the mark?",
    "options": ["−1.5 dB", "1.5 dB", "1.5", "−1.5"],
    "answer": 0,
    "explain": "A loss in decibels is negative and carries its unit: −1.5 dB. Dropping the sign turns the attenuation into an amplification, and dropping the unit leaves a bare number."
  }
]
```
