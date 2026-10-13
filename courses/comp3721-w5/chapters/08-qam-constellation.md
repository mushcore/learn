---
title: QAM and constellation diagrams
minutes: 22
---

QAM changes the amplitude and the phase of the carrier at once; a constellation diagram draws each signal element as a dot.

## QAM combines ASK and PSK

Slide wording: *Combines ASK and PSK. The dominant method of digital-to-analog modulation. Using two carriers, one in-phase and the other quadrature (i.e., the two carrier signals are out-of-phase with each other by 90°), with different peak amplitude levels for each carrier. The same advantages as PSK over ASK. The same minimum required bandwidth as ASK and PSK.* It is *widely used as a modulation scheme for digital telecommunication systems, such as in 802.11 Wi-Fi standards.*

## The 8-QAM waveform: 24 bps at 8 baud

The slide's *Typical Modulated 8-QAM Waveform* sends eight 3-bit signal elements in 1 s, 101, 100, 001, 000, 010, 011, 110, 111, labelled *Bit rate: 24, Baud rate: 8*. Each element is two carrier cycles; those ending in 1 have the large amplitude (read from the figure). The widget's phases for the first two bits are one possible assignment; the slide does not label them.

```widget
shift-keying-play
{ "scheme": "qam", "schemes": ["qam"], "cycles": 2, "title": "The slide's 8-QAM waveform, one signal element at a time" }
```

## A constellation diagram: one dot per signal element type

*A representation of a signal modulated by a digital modulation scheme. Assists us in defining the amplitude and phase of a signal element, particularly when we are using two carriers (one in-phase, one quadrature). Useful when dealing with multilevel ASK, PSK and QAM. A signal element type is represented as a dot (a bit or combination of bits it can carry is often written next to it).*

In the slide-24 figure X is the *in-phase carrier* and Y the *quadrature carrier*; the line from the origin to the dot has *Length: amplitude* and *Angle: phase*. From the components (ours): $\text{amplitude} = \sqrt{I^2 + Q^2}$.

Boxed rule: *A modulation with n constellation points transmits log₂ n bits per signal element.*

## Examples 1 to 4: every point on the I axis

Binary ASK and BPSK use *only an in-phase carrier*, so every $Q$ is 0.

| Example | Scheme | Dots at (I, Q) |
|---|---|---|
| 1 | ASK (OOK) | 0 at $(0, 0)$, *Binary 0 has an amplitude of 0 V*; 1 at $(A, 0)$, *an amplitude more than zero* |
| 2 | ASK, 1 V and 3 V | $(1, 0)$ and $(3, 0)$, labelled 1 V and 3 V |
| 3 | BPSK | 0 at $(-1, 0)$, *180° out of phase*; 1 at $(1, 0)$, *in phase* |
| 4 | BPSK, 2 V | $(-2, 0)$ and $(2, 0)$, both labelled 2 V |

Both Example 4 dots are labelled 2 V because amplitude is the distance from the origin.

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

Question: *Draw the constellation diagram for 8-QAM with two different peak amplitude values, 1 V and 3 V, and four different phases.* The answer puts an inner dot at 1 V and an outer dot at 3 V on each diagonal, phases 45°, 135°, 225° and 315° (read from the drawing), with no bit labels. With $I = A \cos\varphi$ and $Q = A \sin\varphi$ (computed) the 45° dots are at $(0.71, 0.71)$ and $(2.12, 2.12)$; the other diagonals change only the signs.

### Example 5: eight dots on the two diagonals

```widget
constellation
{ "preset": "8-QAM 1 V and 3 V", "draw": true, "title": "Example 5: place the eight dots (1 V and 3 V on each diagonal), then Check" }
```

## Four QAM layouts (slide 36)

| Figure | Where the dots are |
|---|---|
| a. 4-QAM | a square in the first quadrant with one corner at the origin: each carrier 0 or $A$ |
| b. 4-QAM | a square centred on the origin, one dot per quadrant |
| c. 4-QAM | a small square entirely inside the first quadrant |
| d. 16-QAM | a 2 × 2 cluster in each quadrant |

## Example 6: 16-QAM

*The distance A from the point to the origin (0,0) represents the amplitude after modulation. The angle φ of the point represents the phase after modulation.* The figure's 4 × 4 grid of 4-bit labels:

| Q \ I | $-3A$ | $-A$ | $A$ | $3A$ |
|---|---|---|---|---|
| $3A$ | 0010 | 0011 | 0001 | 0000 |
| $A$ | 0110 | 0111 | 0101 | 0100 |
| $-A$ | 1110 | 1111 | 1101 | 1100 |
| $-3A$ | 1010 | 1011 | 1001 | 1000 |

The red arc marked *Included angle φ* runs to the 1010 dot at $I = Q = -3A$. The first two bits of a label name the row, the last two the column.

### Example 6: click a dot for its amplitude, phase and bits

```widget
constellation
{ "preset": "16-QAM", "title": "Example 6: 16-QAM, I and Q in {−3A, −A, A, 3A}" }
```

## Different n-QAM

The slide nests 4-, 16-, 32- and 64-QAM on one grid:

| Bits per symbol | Number of symbols | QAM modulation |
|---|---|---|
| 4 | $2^4 = 16$ | 16-QAM |
| 6 | $2^6 = 64$ | 64-QAM |
| 8 | $2^8 = 256$ | 256-QAM |
| 10 | $2^{10} = 1024$ | 1024-QAM |
| 12 | $2^{12} = 4096$ | 4K-QAM |

E05 exercise 4 uses $\log_2 n$ and the amplitude formula; it is worked in [E05 worked](#/comp3721-w5/e05-worked).

## Read five new constellation points

Amplitude is the distance from the origin, $\sqrt{I^2 + Q^2}$, and phase is the angle from the positive I axis.

```quiz
[
  {
    "q": "A constellation diagram has 64 points. How many bits does each signal element carry?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0.01,
    "unit": "bits",
    "explain": "$\\log_{2} 64 = 6$ bits per signal element."
  },
  {
    "q": "A 32-QAM signal runs at 2000 baud. What is its bit rate, in bps?",
    "type": "numeric",
    "answer": 10000,
    "tolerance": 1,
    "unit": "bps",
    "explain": "$r = \\log_{2} 32 = 5$, so $N = S \\times r = 2000 \\times 5 = 10000$ bps."
  },
  {
    "q": "A constellation point has $I = 5$ V and $Q = 12$ V. What is its amplitude, in V?",
    "type": "numeric",
    "answer": 13,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$\\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13$ V."
  },
  {
    "q": "A constellation point has an amplitude of 2.5 V and a quadrature component of 1.5 V. What is its in-phase component, in V?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0.01,
    "unit": "V",
    "explain": "$2.5^2 = I^2 + 1.5^2$, so $I^2 = 6.25 - 2.25 = 4$ and $I = 2$ V."
  },
  {
    "q": "In Example 6's 16-QAM grid, what is the phase of the dot at $I = A$, $Q = 3A$, in degrees?",
    "type": "numeric",
    "answer": 71.57,
    "tolerance": 0.1,
    "unit": "°",
    "explain": "The dot is in the first quadrant: $\\varphi = \\tan^{-1}\\frac{3A}{A} = \\tan^{-1} 3 = 71.57°$. Its amplitude is $\\sqrt{A^2 + 9A^2} = \\sqrt{10}A \\approx 3.16A$."
  },
  {
    "q": "Which 4-bit label does Example 6 give the dot at $I = A$, $Q = 3A$?",
    "type": "text",
    "answer": ["0001"],
    "explain": "The row $Q = 3A$ reads 0010, 0011, 0001, 0000 from $I = -3A$ to $I = 3A$, so $I = A$ is **0001**."
  }
]
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
