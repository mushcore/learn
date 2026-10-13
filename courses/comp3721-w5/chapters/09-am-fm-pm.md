---
title: AM, FM and PM, and the radio bands
minutes: 15
---

Radio carries audio, an analog signal, over the air, a bandpass channel. The audio is low-pass, so it is moved up to a carrier frequency by the same three moves as shift keying, now driven by a continuous signal instead of bits.

## Why analog-to-analog

Slide example: *Radio stations broadcast analog signals in the form of continuous electromagnetic waves that carry audio information, so you can listen to the radio.* The slide-39 tree puts three methods under analog-to-analog conversion: amplitude modulation, frequency modulation, phase modulation.

## AM: the amplitude follows the modulating signal

*The carrier signal is modulated so that its amplitude varies with the changing amplitudes of the modulating signal. The frequency and phase of the carrier remain the same.*

The figure stacks three waves: the slow modulating signal, the fast carrier, and the modulated signal, a fast sine whose peaks trace a dashed envelope shaped like the modulating signal.

*The bandwidth of the modulated signal is twice the bandwidth of the modulating signal and covers a range centered on the carrier frequency.* The spectrum is one hump centred on $f_c$, labelled

$$B_{AM} = 2B$$

where $B$ is the bandwidth of the modulating signal.

### AM: the envelope is the audio

```widget
analog-mod
{ "mode": "am", "B": 5, "unit": "kHz", "beta": 4, "title": "AM: the carrier's amplitude follows the modulating signal; B_AM = 2B" }
```

## AM radio: 10 kHz per station

*The bandwidth of an audio signal (speech and music) is usually 5 kHz → AM radio station needs a bandwidth of 10 kHz.* That is $B_{AM} = 2 \times 5 = 10$ kHz. *The Federal Communications Commission (FCC) allows 10 kHz for each AM station. To avoid interference, each station's carrier frequency must be separated from those on either side of it by at least 10 kHz.*

Slide 42 is the United States frequency allocation chart (NTIA, October 2003); it shows how crowded the spectrum is.

## FM: the frequency follows the modulating signal

*The frequency of the carrier signal is modulated to follow the changing voltage level (amplitude) of the modulating signal. The peak amplitude and phase of the carrier signal remain constant.*

In the figure the FM signal has the same height everywhere; its cycles crowd together where the modulating signal is high and spread out where it is low.

*The total bandwidth required for FM can be determined from the bandwidth of the analog (modulating) signal.* The spectrum hump is labelled

$$B_{FM} = 2(1 + \beta)B$$

The figure prints $\beta$ as $b$. The slide does not define $\beta$ beyond the FM radio value below.

### FM: the cycles bunch where the audio is high

```widget
analog-mod
{ "mode": "fm", "B": 15, "unit": "kHz", "beta": 4, "title": "FM: constant amplitude, the frequency follows the modulating signal; B_FM = 2(1 + β)B" }
```

## FM radio: 200 kHz per station

*The bandwidth of an audio signal (speech and music) in stereo is almost 15 kHz. The FCC allows 200 kHz for each FM station (i.e., β = 4 with extra 50 kHz guard band). Stations must be separated by at least 200 kHz to keep their bandwidths from overlapping.*

The arithmetic behind the 200 kHz (ours, from the slide's numbers):

$$B_{FM} = 2(1 + 4) \times 15 = 150\ \text{kHz}, \qquad 150 + 50\ \text{(guard band)} = 200\ \text{kHz}$$

## PM: the phase follows the modulating signal

*The phase of the carrier signal is modulated to follow the changing voltage level (amplitude) of the modulating signal. The peak amplitude and frequency of the carrier signal remain fixed.*

The slide gives PM no figure and no bandwidth formula. The textbook gives $B_{PM} = 2(1 + \beta)B$, the same form as FM (from memory, unverified, not on the slide).

### PM beside AM and FM

```widget
analog-mod
{ "mode": "pm", "B": 5, "unit": "kHz", "beta": 4, "title": "PM: fixed amplitude and frequency, the phase follows the modulating signal" }
```

## The three methods side by side

| Method | Varies | Stays constant | Bandwidth on the slide | Radio number |
|---|---|---|---|---|
| AM | amplitude | frequency, phase | $B_{AM} = 2B$, centred on $f_c$ | 5 kHz audio → 10 kHz per station |
| FM | frequency | peak amplitude, phase | $B_{FM} = 2(1 + \beta)B$ | 15 kHz stereo audio, $\beta = 4$, + 50 kHz guard → 200 kHz per station |
| PM | phase | peak amplitude, frequency | none given | none given |

Each method pairs with a shift-keying scheme: AM with ASK, FM with FSK, PM with PSK, the same property varied by an analog signal instead of by bits.

## Summary slide: a bandpass channel requires analog transmission

*When we have a bandpass channel, we require analog transmission.* Digital data gets there by digital-to-analog conversion (ASK, FSK, PSK, QAM); analog data by analog-to-analog conversion (AM, FM, PM).

## Bandwidth for five more modulated signals

Use $B_{AM} = 2B$ and $B_{FM} = 2(1 + \beta)B$, where $B$ is the bandwidth of the modulating signal.

```quiz
[
  {
    "q": "An 8 kHz audio signal is sent by AM. What is the bandwidth of the modulated signal, in kHz?",
    "type": "numeric",
    "answer": 16,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "$B_{AM} = 2 \\times 8 = 16$ kHz, centred on the carrier frequency."
  },
  {
    "q": "A 10 kHz signal is sent by FM with $\\beta = 3$. What is $B_{FM}$, in kHz?",
    "type": "numeric",
    "answer": 80,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "$B_{FM} = 2(1 + 3) \\times 10 = 2 \\times 4 \\times 10 = 80$ kHz."
  },
  {
    "q": "A 15 kHz stereo signal sent by FM needs $B_{FM} = 180$ kHz. What is $\\beta$?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.01,
    "explain": "$180 = 2(1 + \\beta) \\times 15 = 30(1 + \\beta)$, so $1 + \\beta = 6$ and $\\beta = 5$."
  },
  {
    "q": "A band 1170 kHz wide is given to AM stations at 10 kHz each. How many stations fit side by side?",
    "type": "numeric",
    "answer": 117,
    "tolerance": 0.01,
    "unit": "stations",
    "explain": "$1170 / 10 = 117$ stations, each $2 \\times 5$ kHz wide."
  },
  {
    "q": "An AM station's carrier is at 1000 kHz. What is the lowest carrier frequency the next station above it may use, in kHz?",
    "type": "numeric",
    "answer": 1010,
    "tolerance": 0.01,
    "unit": "kHz",
    "explain": "Carriers must be separated by at least 10 kHz, so the next carrier up is at $1000 + 10 = 1010$ kHz."
  }
]
```

```quiz
[
  {
    "q": "An audio signal has a bandwidth of 5 kHz. What bandwidth does its AM signal need, in kHz?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$B_{AM} = 2B = 2 \\times 5 = 10$ kHz, which is the FCC allowance for one AM station."
  },
  {
    "q": "A 20 kHz audio signal is sent by AM. What is the bandwidth of the modulated signal, in kHz?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$B_{AM} = 2B = 2 \\times 20 = 40$ kHz, centred on the carrier frequency."
  },
  {
    "q": "Stereo audio of 15 kHz is sent by FM with $\\beta = 4$. What is $B_{FM}$ before any guard band, in kHz?",
    "type": "numeric",
    "answer": 150,
    "tolerance": 0.5,
    "unit": "kHz",
    "explain": "$B_{FM} = 2(1 + \\beta)B = 2 \\times 5 \\times 15 = 150$ kHz. The FCC adds a 50 kHz guard band to reach the 200 kHz allowed per FM station."
  },
  {
    "q": "How much bandwidth does the FCC allow for each FM station, in kHz?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "200 kHz: 150 kHz from $2(1 + 4) \\times 15$ plus an extra 50 kHz guard band. Stations must be separated by at least 200 kHz. AM stations get 10 kHz."
  },
  {
    "q": "FM needs a bandwidth twice that of the modulating signal.",
    "type": "tf",
    "answer": false,
    "explain": "Twice the modulating bandwidth is AM: $B_{AM} = 2B$. FM needs $B_{FM} = 2(1 + \\beta)B$, which with $\\beta = 4$ is ten times the modulating bandwidth before the guard band."
  },
  {
    "q": "In FM, which characteristics of the carrier remain constant?",
    "options": ["Frequency and phase", "Peak amplitude and phase", "Peak amplitude and frequency", "None of them"],
    "answer": 1,
    "explain": "FM modulates the frequency; the peak amplitude and phase of the carrier signal remain constant. Frequency and phase constant is AM; peak amplitude and frequency fixed is PM."
  },
  {
    "q": "Fill in the blank: in AM, the bandwidth of the modulated signal covers a range centered on the ________ frequency.",
    "type": "text",
    "answer": ["carrier"],
    "explain": "The AM spectrum is a hump of width $2B$ centred on $f_c$, the carrier frequency, which is why neighbouring AM carriers must be at least 10 kHz apart."
  },
  {
    "q": "Which conversion does the summary slide say a bandpass channel requires?",
    "options": ["Digital transmission with a line code", "Baseband transmission", "Analog transmission", "Sampling at the Nyquist rate"],
    "answer": 2,
    "explain": "When we have a bandpass channel, we require analog transmission: ASK, FSK, PSK or QAM for digital data, AM, FM or PM for analog data. Line codes are baseband."
  },
  {
    "q": "By how much must the carriers of two neighbouring AM stations be separated, at least?",
    "options": ["5 kHz", "10 kHz", "50 kHz", "200 kHz"],
    "answer": 1,
    "explain": "Each AM station's carrier must be separated from those on either side by at least 10 kHz, the station's bandwidth. 200 kHz is the FM separation."
  },
  {
    "type": "match",
    "q": "Match each analog-to-analog method to the slide's statement about the carrier.",
    "pairs": [
      ["AM", "amplitude varies; frequency and phase remain the same"],
      ["FM", "frequency follows the modulating signal; peak amplitude and phase constant"],
      ["PM", "phase follows the modulating signal; peak amplitude and frequency fixed"]
    ],
    "explain": "One characteristic varies per method and the other two hold still, the analog twin of ASK, FSK and PSK."
  }
]
```
