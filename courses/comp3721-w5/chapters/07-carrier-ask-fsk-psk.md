---
title: The carrier, ASK, FSK and PSK
minutes: 18
---

A bandpass channel does not pass Week 4's baseband line codes, so digital data has to ride on a sine wave; Lecture 05b changes one characteristic of that sine wave per bit.

## Where digital-to-analog conversion happens

Slide example: a smartphone's DAC converts the digital music file into analog audio for wired headphones.

## Review: r, S and N in analog transmission

Slide wording: *In analog transmission of digital data, r = log₂ L (L is the number of different signal elements/levels) and baud rate ≤ bit rate (S = N/r).*

## The carrier signal

*Carrier signal (carrier frequency): A high-frequency signal produced by the sending device and acts as a base for the information signal. The carrier signal is a simple sine wave. The receiver is tuned to the frequency of the carrier signal.*

## Modulation, or shift keying

*Converting digital data to a bandpass analog signal. Modifying any of the three characteristics (amplitude, frequency, and phase) of a sine wave (i.e., carrier signal) based on the information in the digital data. The process is called modulation or shift keying.*

The slide's tree puts ASK, FSK and PSK under digital-to-analog conversion, with dashed arrows from ASK and PSK into QAM, which combines the two (next lesson).

## ASK: the amplitude of the carrier is varied

*The amplitude of the carrier signal is varied to create signal elements. Both frequency and phase remain constant.*

**Binary ASK (BASK)** is *implemented using only two levels of signal elements* and is *also called OOK (On-Off Keying)*: the peak amplitude *for one signal level is 0, for the other one is equal to the peak amplitude of the carrier signal*. The implementation is a **multiplier**: the digital signal times the carrier from an oscillator at $f_c$.

## Bandwidth for ASK: B = (1 + d)S

*The process of modulation produces a nonperiodic composite signal. Bandwidth is proportional to the signal rate.* The slide figure sends five bits in 1 s (bit rate 5) as five signal elements (baud rate 5) and boxes the rule in yellow:

$$r = 1, \qquad S = N, \qquad B = (1 + d)S$$

The spectrum is one rounded hump of width $B$ centred on the carrier frequency $f_c$. The slide never defines $d$; the textbook's $d$ is a factor between 0 and 1 (from memory, unverified). With $d = 0$ the bandwidth equals the baud rate.

## Multi-level ASK is not common

*More than two voltage levels is used → but it is not common. More than 1 bit can be sent in a signal element.* The slide's examples: 4 different amplitudes give 2 bits per signal element ($r = 2$); 8 different amplitudes give 3 bits per signal element ($r = 3$).

## FSK: the frequency of the carrier is changed

*The frequency of the carrier signal is changed to represent data. The frequency of the modulated signal is constant for the duration of one signal element; changes for the next signal element if the data element changes. Peak amplitude and phase are constant for all signal elements.* The implementation block is a **VCO (voltage-controlled oscillator)** driven by the digital signal.

**Binary FSK (BFSK)** uses *two carrier frequencies, f₁ and f₂*: *If the data element is 0, f₁ is used. If the data element is 1, f₂ is used.* In the figure the 1s are the denser sine. Yellow box:

$$r = 1, \qquad S = N, \qquad B = (1 + d)S + 2\Delta f$$

The spectrum has two humps, one at $f_1$ and one at $f_2$, each of width $S(1 + d)$. *Both f₁ and f₂ are Δf apart from the midpoint between the two bands. The difference between the two frequencies is 2Δf.*

**Multilevel FSK (MFSK)** uses *more than two frequencies*: 4 frequencies send 2 bits at a time, 8 frequencies send 3 bits at a time.

## PSK: the phase of the carrier is changed

*The phase of the carrier is changed to represent two or more different signal elements. Both peak amplitude and frequency remain constant as the phase changes.* PSK is *more common than ASK or FSK* and *less susceptible to noise than ASK*. The slide asks why and answers: *Because noise can change the amplitude easier than it can change the phase.* The cost: *PSK needs more sophisticated hardware to be able to distinguish between phases.*

**Binary PSK (BPSK)**: *Two signal elements are used (one with a phase of 0°, and the other with a phase of 180°). Same bandwidth as BASK but less than BFSK.* The figure draws each 1 as the carrier (blue) and each 0 as the carrier turned upside down (black). The yellow box is ASK's, one hump at $f_c$:

$$r = 1, \qquad S = N, \qquad B = (1 + d)S$$

The implementation reuses ASK's multiplier and oscillator with a **polar NRZ** input; multiplying the carrier by the negative level turns the sine upside down, a 180° phase shift (ours).

## Bits 1 0 1 1 0 in ASK, FSK and PSK

Under all three schemes the five bits are five signal elements in 1 s.

```widget
shift-keying
{ "bits": "10110", "scheme": "ask", "schemes": ["ask", "fsk", "psk"], "cycles": 3, "title": "The slide's five bits on a carrier: ASK, FSK and PSK" }
```

### One signal element at a time

Each element changes one property of the carrier and leaves the other two alone.

```widget
shift-keying-play
{ "bits": "10110", "scheme": "ask", "schemes": ["ask", "fsk", "psk"] }
```

```quiz
[
  {
    "q": "In FSK, which characteristic of the carrier is changed to represent the data?",
    "options": ["Amplitude", "Phase", "Frequency", "Bit rate"],
    "answer": 2,
    "explain": "Frequency shift keying changes the frequency of the carrier; peak amplitude and phase are constant for all signal elements. ASK changes the amplitude, PSK the phase."
  },
  {
    "q": "Fill in the blank: binary ASK is also called OOK, which stands for ________ keying.",
    "type": "text",
    "answer": ["on-off", "on off", "on-off keying", "on off keying", "onoff"],
    "explain": "On-Off Keying: the peak amplitude for one signal level is 0 (off) and for the other is the peak amplitude of the carrier (on)."
  },
  {
    "q": "Binary FSK needs the same bandwidth as binary ASK.",
    "type": "tf",
    "answer": false,
    "explain": "BASK: $B = (1 + d)S$. BFSK: $B = (1 + d)S + 2\\Delta f$, the extra term being the separation between the two carrier frequencies. BPSK is the one with the same bandwidth as BASK."
  },
  {
    "q": "ASK is less susceptible to noise than PSK.",
    "type": "tf",
    "answer": false,
    "explain": "It is the other way round. PSK is less susceptible to noise than ASK because noise can change the amplitude easier than it can change the phase."
  },
  {
    "q": "Which block implements FSK in the slide figure?",
    "options": ["A multiplier fed by an oscillator", "A sample-and-hold circuit", "A low-pass filter", "A voltage-controlled oscillator (VCO)"],
    "answer": 3,
    "explain": "The digital signal drives a VCO, whose output frequency follows the input voltage. ASK and PSK use a multiplier with an oscillator at $f_c$."
  },
  {
    "q": "In binary FSK, which frequency is used when the data element is 0?",
    "options": ["$f_1$", "$f_2$", "$f_c$", "0 Hz"],
    "answer": 0,
    "explain": "Slide: if the data element is 0, $f_1$ is used; if the data element is 1, $f_2$ is used. $f_1$ and $f_2$ are each $\\Delta f$ from the midpoint between the two bands."
  },
  {
    "q": "A binary ASK signal carries 10 kbps. Taking $d = 0$, what is its bandwidth, in kHz?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "BASK has $r = 1$, so $S = N = 10$ kbaud. $B = (1 + d)S = (1 + 0) \\times 10 = 10$ kHz, centred on the carrier frequency."
  },
  {
    "q": "A binary FSK signal has a baud rate of 10 kbaud and its two carrier frequencies are 4 kHz apart ($2\\Delta f = 4$ kHz). Taking $d = 0$, what is its bandwidth, in kHz?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$B = (1 + d)S + 2\\Delta f = (1 + 0) \\times 10 + 4 = 14$ kHz. The $2\\Delta f$ term is the gap between the hump at $f_1$ and the hump at $f_2$."
  },
  {
    "q": "A multi-level ASK scheme uses 8 different amplitudes. How many bits does one signal element carry?",
    "type": "numeric",
    "answer": 3,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$r = \\log_2 L = \\log_2 8 = 3$ bits per signal element. The slide adds that multi-level ASK is not common."
  },
  {
    "q": "Select every characteristic of the carrier that stays constant in PSK.",
    "options": ["Peak amplitude", "Phase", "Frequency"],
    "answer": [0, 2],
    "explain": "PSK changes the phase; both peak amplitude and frequency remain constant as the phase changes."
  },
  {
    "q": "What are the two phases used by binary PSK?",
    "options": ["0° and 90°", "90° and 270°", "0° and 180°", "45° and 225°"],
    "answer": 2,
    "explain": "BPSK uses two signal elements, one with a phase of 0° and the other with a phase of 180°, drawn in the figure as the carrier and the carrier turned upside down. 90° apart is the angle between QAM's two carriers."
  },
  {
    "q": "In the BPSK implementation slide, what form does the digital signal take before it is multiplied with the carrier?",
    "options": ["Unipolar NRZ (1 high, 0 at zero)", "Polar NRZ (1 high, 0 low)", "Manchester", "A PAM signal"],
    "answer": 1,
    "explain": "The input is polar NRZ: a 0 is a negative level, and multiplying the carrier by a negative level flips the sine, which is the 180° phase. With a unipolar input the multiplier would give ASK."
  },
  {
    "type": "match",
    "q": "Match each scheme to the characteristics of the carrier that stay constant.",
    "pairs": [
      ["ASK", "frequency and phase"],
      ["FSK", "peak amplitude and phase"],
      ["PSK", "peak amplitude and frequency"]
    ],
    "explain": "Each scheme varies exactly one of amplitude, frequency and phase and holds the other two constant. The name says which one varies."
  }
]
```
