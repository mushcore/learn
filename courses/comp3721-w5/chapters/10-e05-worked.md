---
title: E05 worked, and the conversions compared
minutes: 20
---

The Week 5 exercise sheet (E05) has four questions with the instructor's answers. They are the only place the four are worked; answer them cold first.

## E05: Week 5 exercises

### Exercise 1

> We know that the human voice normally includes frequencies from 0 to 4 kHz. If we want to digitize the human voice, what is the bit rate, assuming 8 bits per sample?

### Exercise 2

> Assume PCM is used to convert an analog signal to digital data. If the number of quantization levels is 64, how many bits are required per sample? If the bandwidth of the original analog signal is 300 MHz, what is the minimum required bandwidth for transmission of the corresponding digital signal (assume r = 1)?

### Exercise 3

> Assume PCM is used to convert an analog signal to digital data. If we increase the number of quantization levels, what is its impact on the number of bits per sample and the bit rate? Explain.

### Exercise 4

> If we have a constellation diagram with 16 constellation points, what is the number of bits per constellation point (i.e., per signal element)? Assume the amplitude for a constellation point is 5 volts while the amplitude of the in-phase carrier is 3 volts. What is the amplitude of the quadrature carrier?

```quiz
[
  {
    "q": "E05 exercise 1: the human voice includes frequencies from 0 to 4 kHz. What is the minimum sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 8000,
    "tolerance": 1,
    "unit": "samples/s",
    "explain": "The voice signal is low-pass, so $f_{max} = 4$ kHz $= 4000$ Hz. Nyquist: sampling rate $= 2 \\times f_{max} = 2 \\times 4000 = 8000$ samples/s."
  },
  {
    "q": "E05 exercise 1: with that sampling rate and 8 bits per sample, what is the bit rate, in bps?",
    "type": "numeric",
    "answer": 64000,
    "tolerance": 1,
    "unit": "bps",
    "explain": "Bit rate $= f_s \\times n_b = 8000 \\times 8 = 64000$ bps $= 64$ kbps, the official answer."
  },
  {
    "q": "E05 exercise 2: PCM with 64 quantization levels. How many bits are required per sample?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$n_b = \\log_2 L = \\log_2 64 = 6$ bits, because $2^6 = 64$."
  },
  {
    "q": "E05 exercise 2: the analog signal has a bandwidth of 300 MHz and $r = 1$. What is the minimum bandwidth for the digital signal, in MHz?",
    "type": "numeric",
    "answer": 1800,
    "tolerance": 1,
    "unit": "MHz",
    "explain": "$B_{min} = n_b \\times B_{analog} = 6 \\times 300 = 1800$ MHz $= 1.8$ GHz. The formula takes $c = 1/2$ and $r = 1$, as on slide 48; the digital signal needs $n_b$ times the analog bandwidth."
  },
  {
    "q": "E05 exercise 3: PCM with more quantization levels. What happens to the number of bits per sample and to the bit rate?",
    "options": ["Both decrease", "Bits per sample increase, the bit rate stays the same", "Both increase", "Bits per sample stay the same, the bit rate increases"],
    "answer": 2,
    "explain": "$n_b = \\log_2 L$ increases with $L$, and bit rate $= f_s \\times n_b$ increases with $n_b$ because the sampling rate is unchanged. Both increase."
  },
  {
    "q": "E05 exercise 4: a constellation diagram has 16 points. How many bits per constellation point?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$\\log_2 16 = 4$ bits per signal element. The number of bits is the logarithm of the number of points."
  },
  {
    "q": "E05 exercise 4: a point has an amplitude of 5 V and its in-phase carrier amplitude is 3 V. What is the amplitude of the quadrature carrier, in V?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$5^2 = 3^2 + q^2$, so $q^2 = 25 - 9 = 16$ and $q = 4$ V. The amplitude is the length from the origin to the dot, the hypotenuse of the I-Q triangle."
  },
  {
    "q": "Audio from 0 to 20 kHz is digitized with 16 bits per sample at the Nyquist rate. What is the bit rate, in kbps?",
    "type": "numeric",
    "answer": 640,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "$f_s = 2 \\times 20 = 40$ k samples/s; bit rate $= 40000 \\times 16 = 640000$ bps $= 640$ kbps."
  },
  {
    "q": "PCM with 256 levels digitizes a 4 kHz low-pass signal. With $c = 1/2$ and $r = 1$, what is the minimum channel bandwidth for the digital signal, in kHz?",
    "type": "numeric",
    "answer": 32,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$n_b = \\log_2 256 = 8$; $B_{min} = n_b \\times B_{analog} = 8 \\times 4 = 32$ kHz, eight times the analog bandwidth."
  },
  {
    "q": "A 64-QAM constellation point has an amplitude of 13 V and an in-phase component of 5 V. What is its quadrature component, in V?",
    "type": "numeric",
    "answer": 12,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$13^2 = 5^2 + Q^2$, so $Q^2 = 169 - 25 = 144$ and $Q = 12$ V. Each of the 64 points carries $\\log_2 64 = 6$ bits."
  }
]
```

## Exercise 1 worked: the voice bit rate

The voice is a low-pass signal, so its bandwidth is its highest frequency: $f_{max} = 4$ kHz $= 4000$ Hz. Official answer:

$$\text{Sampling rate} = f_{max} \times 2 = 4000 \times 2 = 8000\ \text{samples/s}$$

$$\text{Bit rate} = \text{Sampling rate} \times \text{Number of bits per sample} = 8000 \times 8 = 64000\ \text{bps or 64 kbps}$$

8 bits per sample means $L = 2^8 = 256$ levels, the slide's *in audio digitizing, L = 256*.

The PCM calculator in [Encoding and bit rate](#/comp3721-w5/encoding-bit-rate) has exercises 1 and 2 as presets.

## Exercise 2 worked: bits per sample and the PCM bandwidth

Official answer:

$$n_b = \log_2 64 = 6$$

$$B_{min} = n_b \times B_{analog} = 6 \times 300\ \text{M} = 1800\ \text{MHz} = 1.8\ \text{GHz}$$

The question says $r = 1$ and nothing about $c$; the answer uses slide 48's $B_{min} = n_b \times B_{analog}$, which already assumes $c = 1/2$. The general form is $B_{min} = c \times n_b \times 2 \times B_{analog} \times 1/r$, and with $c = 1/2$ and $r = 1$ the $2$ and the $1/2$ cancel.

## Exercise 3 worked: more quantization levels

Official answer: *Number of bits per sample = n_b = log₂ L (L is the number of quantization levels) → Therefore, the number of bits per sample increases. Also, Bit rate = Sampling rate × Number of bits per sample = f_s × n_b → Thus, bit rate also increases.*

The sampling rate depends only on $f_{max}$, so raising $L$ changes nothing there; it raises $n_b$, and the bit rate rises with it. The gain is a smaller quantization error, since $\Delta = (V_{max} - V_{min}) / L$ shrinks.

## Exercise 4 worked: the quadrature carrier's amplitude

Official answer: *Number of bits = log₂ 16 = 4.* For the quadrature amplitude, Pythagoras on the constellation point:

$$5^2 = 3^2 + q^2 \quad \to \quad q^2 = 25 - 9 = 16 \quad \to \quad q = 4\ \text{V}$$

### The exercise 4 point

```widget
constellation
{ "solve": { "amplitude": 5, "i": 3 }, "title": "E05 exercise 4: amplitude 5 V and I = 3 V give Q = 4 V" }
```

## The four kinds of conversion

| Data | Signal | Name | Where |
|---|---|---|---|
| digital | digital | line coding (unipolar, NRZ-L, NRZ-I, Manchester, differential Manchester, AMI) | Week 4 |
| analog | digital | PCM: sampling, quantizing, encoding | Lecture 05a |
| digital | analog | ASK, FSK, PSK, QAM | Lecture 05b |
| analog | analog | AM, FM, PM | Lecture 05b |

The digital signals (first two rows) are baseband and need a low-pass channel; the analog signals (last two rows) are bandpass and ride on a carrier.

## Line coding, PCM and the seven conversions of Lecture 05b

| Conversion | What varies | What stays constant | Bandwidth on the slides | Bits per element |
|---|---|---|---|---|
| Line coding (D2D, Week 4) | the voltage level, or a transition | the levels themselves | $B = c \times N \times 1/r$ | $r$: 1 for the NRZ schemes and AMI, $1/2$ for the Manchester schemes |
| PCM (A2D) | a sample becomes an $n_b$-bit word | $f_s$ once $f_{max}$ is fixed | $B_{min} = n_b \times B_{analog}$ (with $c = 1/2$, $r = 1$) | $n_b = \log_2 L$ bits per sample |
| ASK (D2A) | amplitude | frequency, phase | $r = 1$, $S = N$, $B = (1 + d)S$ | 1 for BASK (OOK); $\log_2 L$ with $L$ amplitudes, not common |
| FSK (D2A) | frequency | peak amplitude, phase | $r = 1$, $S = N$, $B = (1 + d)S + 2\Delta f$ | 1 for BFSK; 2 with 4 frequencies, 3 with 8 (MFSK) |
| PSK (D2A) | phase | peak amplitude, frequency | $r = 1$, $S = N$, $B = (1 + d)S$ | 1 for BPSK (0° and 180°) |
| QAM (D2A) | amplitude and phase, on two carriers 90° apart | frequency | the same minimum bandwidth as ASK and PSK | $\log_2 n$ for $n$ constellation points: 2 for 4-QAM, 3 for 8-QAM, 4 for 16-QAM |
| AM (A2A) | amplitude | frequency, phase | $B_{AM} = 2B$, centred on $f_c$ | analog, no bits |
| FM (A2A) | frequency | peak amplitude, phase | $B_{FM} = 2(1 + \beta)B$ | analog, no bits |
| PM (A2A) | phase | peak amplitude, frequency | none on the slide | analog, no bits |

The table has nine rows: the Week 4 line codes, 05a's PCM, and the seven conversions of Lecture 05b (four D2A, three A2A). Three regularities run through it:

- A scheme is named after the one property it varies; the other two stay constant. ASK, FSK and PSK are the digital-data versions of AM, FM and PM.
- Every bandwidth is proportional to the rate of the thing being sent: $N$ for line codes, $S$ for shift keying, $B$ for the analog methods. FSK alone adds a fixed $2\Delta f$, and FM alone multiplies by $(1 + \beta)$.
- Bits per element is a $\log_2$ of a count: $\log_2 L$ levels for line codes and PCM, $\log_2 n$ points for a constellation.

```quiz
[
  {
    "type": "match",
    "q": "Match each conversion to its bandwidth on the slides.",
    "pairs": [
      ["PCM", "$B_{min} = n_b \\times B_{analog}$"],
      ["FSK", "$B = (1 + d)S + 2\\Delta f$"],
      ["PSK", "$B = (1 + d)S$"],
      ["AM", "$B_{AM} = 2B$"],
      ["FM", "$B_{FM} = 2(1 + \\beta)B$"]
    ],
    "explain": "ASK and PSK share $(1 + d)S$, FSK adds $2\\Delta f$, AM doubles the modulating bandwidth, FM multiplies it by $2(1 + \\beta)$, and PCM multiplies the analog bandwidth by the bits per sample."
  },
  {
    "q": "Select every scheme whose minimum bandwidth is $(1 + d)S$ with no extra term.",
    "options": ["ASK", "FSK", "PSK", "QAM"],
    "answer": [0, 2, 3],
    "explain": "ASK and PSK have $B = (1 + d)S$, and QAM has the same minimum required bandwidth as ASK and PSK. FSK adds $2\\Delta f$ for the gap between its two carriers."
  },
  {
    "q": "Which pair varies the same characteristic of the carrier?",
    "options": ["ASK and FM", "FSK and PM", "PSK and PM", "ASK and PM"],
    "answer": 2,
    "explain": "PSK and PM both change the phase: PSK from bits, PM from an analog modulating signal. ASK pairs with AM and FSK with FM."
  },
  {
    "q": "Which conversion produces a baseband signal?",
    "options": ["Line coding", "ASK", "QAM", "FM"],
    "answer": 0,
    "explain": "Line coding (digital-to-digital) and PCM produce digital, baseband signals for a low-pass channel. ASK, FSK, PSK, QAM, AM, FM and PM produce bandpass analog signals around a carrier."
  },
  {
    "q": "In PCM the number of bits per sample is $\\log_2$ of the number of quantization levels, and in QAM the number of bits per signal element is $\\log_2$ of the number of constellation points.",
    "type": "tf",
    "answer": true,
    "explain": "$n_b = \\log_2 L$ and bits per element $= \\log_2 n$: both count how many binary choices it takes to name one of $L$ levels or one of $n$ dots."
  },
  {
    "q": "Which conversion is the only one in the table whose bandwidth formula contains a fixed term that does not scale with the rate?",
    "options": ["PCM", "FSK", "AM", "QAM"],
    "answer": 1,
    "explain": "FSK's $B = (1 + d)S + 2\\Delta f$: the $2\\Delta f$ separation between $f_1$ and $f_2$ is set by the carriers, not by the baud rate. Every other formula is a multiple of $N$, $S$ or $B$."
  }
]
```
