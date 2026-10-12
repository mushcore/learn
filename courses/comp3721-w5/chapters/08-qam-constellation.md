---
title: QAM and constellation diagrams
minutes: 22
---

ASK and PSK each change one property of the carrier. QAM changes both at once, and once a signal element has an amplitude and a phase, a dot on a plane shows it better than a waveform does.

## QAM combines ASK and PSK

Slide wording: *Combines ASK and PSK. The dominant method of digital-to-analog modulation. Using two carriers, one in-phase and the other quadrature (i.e., the two carrier signals are out-of-phase with each other by 90°), with different peak amplitude levels for each carrier. The same advantages as PSK over ASK. The same minimum required bandwidth as ASK and PSK.* It is *widely used as a modulation scheme for digital telecommunication systems, such as in 802.11 Wi-Fi standards.*

## The 8-QAM waveform: 24 bps at 8 baud

The slide's *Typical Modulated 8-QAM Waveform* sends eight signal elements in 1 s, *Bit rate: 24, Baud rate: 8*, 3 bits each: 101, 100, 001, 000, 010, 011, 110, 111. Each element is two cycles of the carrier at one of two amplitudes, with phase jumps at some boundaries: $r = 3$, so $S = N / r = 24 / 3 = 8$ baud. In the drawing the elements ending in 1 have the large amplitude and those ending in 0 the small one (read from the figure, not stated).

## A constellation diagram: one dot per signal element type

*A representation of a signal modulated by a digital modulation scheme. Assists us in defining the amplitude and phase of a signal element, particularly when we are using two carriers (one in-phase, one quadrature). Useful when dealing with multilevel ASK, PSK and QAM. A signal element type is represented as a dot (a bit or combination of bits it can carry is often written next to it).*

The slide-24 figure: the X axis is the *in-phase carrier* and the Y axis the *quadrature carrier*. A dashed line from the origin to the dot has *Length: amplitude* and *Angle: phase*. The dot's projection on X is the *amplitude of the I component*, its projection on Y the *amplitude of the Q component*.

Reading a point from its components (ours; it is the Pythagoras of E05 exercise 4):

$$\text{amplitude} = \sqrt{I^2 + Q^2}, \qquad \text{phase} = \text{the angle from the positive I axis}$$

Boxed rule: *A modulation with n constellation points transmits log₂ n bits per signal element.*

## Examples 1 to 4: every point on the I axis

Binary ASK and BPSK use *only an in-phase carrier*, so every $Q$ is 0 and every point sits on the X axis.

| Example | Scheme | Point | I | Q | Amplitude | Phase |
|---|---|---|---|---|---|---|
| 1 | ASK (OOK) | bit 0 | 0 | 0 | 0 V: *Binary 0 has an amplitude of 0 V* | none, the dot is the origin |
| 1 | ASK (OOK) | bit 1 | $A$ | 0 | $A$: *an amplitude more than zero* | 0° |
| 2 | ASK, 1 V and 3 V | 1 V | 1 | 0 | 1 V | 0° |
| 2 | ASK, 1 V and 3 V | 3 V | 3 | 0 | 3 V | 0° |
| 3 | BPSK | bit 0 | $-1$ | 0 | 1 V, *180° out of phase* | 180° |
| 3 | BPSK | bit 1 | $1$ | 0 | 1 V, *in phase* | 0° |
| 4 | BPSK, 2 V | left dot | $-2$ | 0 | 2 V | 180° |
| 4 | BPSK, 2 V | right dot | $2$ | 0 | 2 V | 0° |

Examples 2 and 4 are the slide's own questions, *Draw the constellation diagram for binary ASK, with peak amplitude values of 1 V and 3 V* and *for BPSK, with a peak amplitude value of 2 V*; their answers label the dots with voltages, not bits. Both BPSK dots carry the label 2 V because amplitude is the distance from the origin, and a dot at $-2$ is 2 V away. OOK's 0 is the origin; BPSK's 0 has the full amplitude at 180°.

### Examples 1 and 2: ASK on the I axis

```widget
constellation
{ "preset": "OOK", "title": "Example 1 (OOK): 0 at the origin, 1 on the positive I axis; switch to the 1 V and 3 V preset for Example 2" }
```

### Examples 3 and 4: BPSK, one dot each side of the origin

```widget
constellation
{ "preset": "BPSK 2 V", "title": "Example 4: BPSK with a peak amplitude of 2 V" }
```

## Example 5: 8-QAM with 1 V, 3 V and four phases

Question: *Draw the constellation diagram for 8-QAM with two different peak amplitude values, 1 V and 3 V, and four different phases.* The answer puts eight dots on the two diagonals, an inner dot at 1 V and an outer dot at 3 V on each of the four diagonal directions, labelled 1 V and 3 V. The phases are 45°, 135°, 225° and 315° (read from the drawing); $I = A \cos\varphi$ and $Q = A \sin\varphi$ (computed):

| Phase | 1 V dot: I, Q | 3 V dot: I, Q |
|---|---|---|
| 45° | $0.71, 0.71$ | $2.12, 2.12$ |
| 135° | $-0.71, 0.71$ | $-2.12, 2.12$ |
| 225° | $-0.71, -0.71$ | $-2.12, -2.12$ |
| 315° | $0.71, -0.71$ | $2.12, -2.12$ |

Eight points, so $\log_2 8 = 3$ bits per signal element, the 8-QAM waveform above. Two amplitudes times four phases is ASK times PSK; the slide writes no bit labels on these dots.

### Draw Example 5 yourself

```widget
constellation
{ "preset": "8-QAM 1 V and 3 V", "draw": true, "title": "Example 5: place the eight dots (1 V and 3 V on each diagonal), then Check" }
```

## Four QAM layouts (slide 36)

| Figure | Dots | Where |
|---|---|---|
| a. 4-QAM | 4 | corners of a square in the first quadrant with one corner at the origin: each carrier is 0 or $A$ |
| b. 4-QAM | 4 | corners of a square centred on the origin, one dot per quadrant |
| c. 4-QAM | 4 | a small square entirely inside the first quadrant |
| d. 16-QAM | 16 | a 2 × 2 cluster in each quadrant |

Each 4-QAM carries $\log_2 4 = 2$ bits per element; the layout sets the amplitudes and phases used.

## Example 6: 16-QAM

*The distance A from the point to the origin (0,0) represents the amplitude after modulation. The angle φ of the point represents the phase after modulation.* The figure is a 4 × 4 grid with $I, Q \in \{-3A, -A, A, 3A\}$ and a 4-bit label on every dot:

| Q \ I | $-3A$ | $-A$ | $A$ | $3A$ |
|---|---|---|---|---|
| $3A$ | 0010 | 0011 | 0001 | 0000 |
| $A$ | 0110 | 0111 | 0101 | 0100 |
| $-A$ | 1110 | 1111 | 1101 | 1100 |
| $-3A$ | 1010 | 1011 | 1001 | 1000 |

The red arc marked *Included angle φ* runs to the line from the origin to the 1010 dot: $I = -3A$, $Q = -3A$, so $\varphi = 225°$ and the amplitude is $\sqrt{9A^2 + 9A^2} = 3\sqrt{2}\,A \approx 4.24A$ (computed). The grid uses three amplitudes: $\sqrt{2}\,A$ for the four inner dots, $\sqrt{10}\,A$ for the eight middle ones, $3\sqrt{2}\,A$ for the corners (computed). In the labels the first two bits name the row and the last two the column.

### Example 6: click a dot for its amplitude, phase and bits

```widget
constellation
{ "preset": "16-QAM", "title": "Example 6: 16-QAM, I and Q in {−3A, −A, A, 3A}" }
```

## Different n-QAM

The slide nests 4-QAM (2 × 2 at $\pm 1$), 16-QAM (4 × 4 at $\pm 1, \pm 3$), 32-QAM (a cross) and 64-QAM (8 × 8 at $\pm 1$ to $\pm 7$) on one grid, with the table:

| Bits per symbol | Number of symbols | QAM modulation |
|---|---|---|
| 4 | $2^4 = 16$ | 16-QAM |
| 6 | $2^6 = 64$ | 64-QAM |
| 8 | $2^8 = 256$ | 256-QAM |
| 10 | $2^{10} = 1024$ | 1024-QAM |
| 12 | $2^{12} = 4096$ | 4K-QAM |

The number in the name is the number of dots; the bits per symbol are its $\log_2$.

## E05 exercise 4: the amplitude of the quadrature carrier

> If we have a constellation diagram with 16 constellation points, what is the number of bits per constellation point (i.e., per signal element)? Assume the amplitude for a constellation point is 5 volts while the amplitude of the in-phase carrier is 3 volts. What is the amplitude of the quadrature carrier?

Official answer: *Number of bits = log₂ 16 = 4.* Then Pythagoras on the point: $5^2 = 3^2 + q^2$, $q^2 = 25 - 9 = 16$, $q = 4$ V.

### The E05 4 triangle

```widget
constellation
{ "solve": { "amplitude": 5, "i": 3 }, "title": "E05 exercise 4: amplitude 5 V, I = 3 V, find Q" }
```

```quiz
[
  {
    "q": "A constellation diagram has 16 points. How many bits does each signal element carry?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "bits",
    "explain": "A modulation with $n$ constellation points transmits $\\log_2 n$ bits per signal element: $\\log_2 16 = 4$. The answer is the logarithm of the point count, not the count."
  },
  {
    "q": "A constellation point has an amplitude of 10 V and its in-phase component is 6 V. What is the amplitude of its quadrature component, in V?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$10^2 = 6^2 + Q^2$, so $Q^2 = 100 - 36 = 64$ and $Q = 8$ V. The amplitude is the length of the line from the origin to the dot, the hypotenuse of the I-Q triangle."
  },
  {
    "q": "What does the length of the line from the origin to a constellation point represent?",
    "options": ["The bit rate", "The amplitude of the signal element", "The phase of the signal element", "The carrier frequency"],
    "answer": 1,
    "explain": "Slide 24: Length: amplitude, Angle: phase. The projections on the axes are the amplitudes of the I and Q components."
  },
  {
    "q": "Fill in the blank: QAM uses two carriers, one in-phase and the other ________.",
    "type": "text",
    "answer": ["quadrature"],
    "explain": "The two carriers are out of phase with each other by 90°, each with its own peak amplitude levels. The Q axis of the constellation diagram is the quadrature carrier."
  },
  {
    "q": "QAM needs more bandwidth than ASK or PSK at the same baud rate.",
    "type": "tf",
    "answer": false,
    "explain": "Slide: QAM has the same minimum required bandwidth as ASK and PSK, and the same advantages as PSK over ASK. It is the dominant method of digital-to-analog modulation."
  },
  {
    "q": "In the constellation diagram for OOK (Example 1), where is the dot for bit 0?",
    "options": ["On the negative I axis", "On the positive Q axis", "At the origin", "On the positive I axis"],
    "answer": 2,
    "explain": "Binary 0 has an amplitude of 0 V, so its dot is at the origin; binary 1 is on the positive X axis. BPSK is the scheme whose 0 sits on the negative I axis."
  },
  {
    "q": "In the BPSK diagram with a peak amplitude of 2 V (Example 4), what are the I and Q values of the two dots?",
    "options": ["(0, 0) and (2, 0)", "(−2, 0) and (2, 0)", "(0, −2) and (0, 2)", "(2, 2) and (−2, −2)"],
    "answer": 1,
    "explain": "BPSK uses only the in-phase carrier, so Q = 0 for both dots. The two signal elements have the same amplitude, 2 V, and phases 0° and 180°: I = +2 and I = −2."
  },
  {
    "q": "The 8-QAM waveform on the slide has a bit rate of 24 bps. What is its baud rate?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "baud",
    "explain": "8-QAM has 8 points, so $r = \\log_2 8 = 3$ bits per signal element and $S = N / r = 24 / 3 = 8$ baud: eight elements of 3 bits in 1 s."
  },
  {
    "q": "In Example 5 (8-QAM with 1 V and 3 V), how many different phases do the eight dots use?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "explain": "Two amplitudes (1 V and 3 V) times four phases (the four diagonals) gives $2 \\times 4 = 8$ dots. Each diagonal direction carries an inner 1 V dot and an outer 3 V dot."
  },
  {
    "q": "A 16-QAM dot is at $I = -3A$, $Q = -3A$ (the 1010 point of Example 6). What is its phase?",
    "options": ["45°", "135°", "225°", "315°"],
    "answer": 2,
    "explain": "Both components are negative, so the dot is in the third quadrant on the diagonal: 180° + 45° = 225°. Its amplitude is $\\sqrt{(3A)^2 + (3A)^2} = 3\\sqrt{2}A \\approx 4.24A$."
  },
  {
    "q": "How many bits per symbol does 256-QAM carry?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "bits",
    "explain": "$2^8 = 256$, so 8 bits per symbol, as in the slide's table (4 → 16-QAM, 6 → 64-QAM, 8 → 256-QAM, 10 → 1024-QAM, 12 → 4K-QAM)."
  },
  {
    "q": "Select every statement the slide makes about QAM.",
    "options": ["It combines ASK and PSK", "It combines FSK and PSK", "It is the dominant method of digital-to-analog modulation", "Its two carriers are 180° apart"],
    "answer": [0, 2],
    "explain": "QAM combines ASK and PSK and is the dominant method. Its two carriers, in-phase and quadrature, are 90° apart; 180° is the phase difference between the two BPSK signal elements."
  }
]
```
