---
title: The differences the review list asks for
minutes: 20
---

Review items 4 and 9 ask for differences: Nyquist against Shannon, digital-to-analog against analog-to-analog, and nine more pairs the lectures teach separately. Each pair below opens with a written response. Write two to four sentences on paper before you open the table: name both things in the slide's words, give the difference, and add a number or an example. Then type the key word and compare your answer with the model in the explanation.

## 1. Nyquist bit rate and Shannon capacity

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between the Nyquist bit rate and the Shannon capacity, and say what each one is used for. Then type the kind of channel the Shannon capacity assumes (one word).",
    "type": "text",
    "answer": ["noisy", "a noisy channel", "noisy channel"],
    "explain": "Model answer: The Nyquist bit rate, BitRate = 2 × bandwidth × log₂ L, is the theoretical maximum bit rate of a noiseless channel; it takes the number of signal levels L. The Shannon capacity, Capacity = bandwidth × log₂(1 + SNR), is the theoretical highest data rate of a noisy channel; it takes the SNR as a ratio and has no L and no factor 2. Used together, Shannon gives the upper limit and Nyquist tells how many signal levels we need: a 1 MHz channel with SNR 63 gives 6 Mbps, then L = 8."
  },
  {
    "q": "The Shannon capacity is 2 × bandwidth × log₂(1 + SNR).",
    "type": "tf",
    "answer": false,
    "explain": "False. Only the Nyquist formula has the factor 2: BitRate = 2 × bandwidth × log₂ L. Shannon is Capacity = bandwidth × log₂(1 + SNR)."
  },
  {
    "q": "A question gives SNR_dB = 20 dB. How much is the SNR that goes into the Shannon formula?",
    "type": "numeric",
    "answer": 100,
    "tolerance": 0,
    "explain": "The formula takes the ratio: SNR = 10^(SNR_dB/10) = 10^(20/10) = 10² = 100. Putting 20 in place of 100 gives log₂ 21 = 4.39 instead of log₂ 101 = 6.66."
  }
]
```

| | Nyquist bit rate | Shannon capacity |
|---|---|---|
| Channel | noiseless | noisy |
| Formula | BitRate = **2** × bandwidth × log₂ L | Capacity = bandwidth × log₂(1 + SNR), no 2 |
| Inputs | bandwidth in Hz, number of signal levels L | bandwidth in Hz, SNR as a ratio (never dB) |
| Gives | the theoretical maximum bit rate | the theoretical highest data rate |
| Used for | *The Nyquist formula tells us how many signal levels we need.* | *The Shannon capacity gives us the upper limit.* |
| The catch on the slide | *increasing the levels of a signal may reduce the reliability of the system* | *no matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel* |
| Not a power of 2 | *we need to either increase the number of levels or reduce the bit rate* | SNR almost zero: capacity 0 regardless of the bandwidth |

Lesson: [Nyquist bit rate](#/comp3721-w3/nyquist), [Shannon capacity](#/comp3721-w3/shannon).

## 2. The three formulas that start with 2

The three questions below give the same 20 kHz. Only the unit asked for tells you which formula applies.

```quiz
[
  {
    "q": "A noiseless channel has a bandwidth of 20 kHz and the signal uses 4 levels. What is the maximum bit rate, in bps?",
    "type": "numeric",
    "answer": 80000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Nyquist bit rate (Week 3): BitRate = 2 × bandwidth × log₂ L = 2 × 20 000 × log₂ 4 = 2 × 20 000 × 2 = 80 000 bps."
  },
  {
    "q": "A low-pass analog signal has a bandwidth of 20 kHz. What is the minimum sampling rate, in samples per second?",
    "type": "numeric",
    "answer": 40000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "Nyquist sampling rate (Week 5): f_N = 2 f_max. For a low-pass signal the bandwidth is the highest frequency, so f_s = 2 × 20 000 = 40 000 samples/s. No log: samples are not bits."
  },
  {
    "q": "A line code with r = log₂ 4 runs at the average case c = 1/2 on a 20 kHz channel. What is N_max, in bps?",
    "type": "numeric",
    "answer": 80000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Week 4: N_max = (1/c) × B × r = 2 × 20 000 × 2 = 80 000 bps. With c = 1/2 and r = log₂ L it is the Nyquist bit rate written another way, which is why the two answers agree."
  },
  {
    "q": "Written response, on paper first: three formulas begin with a 2. Name each, give its input and its unit, and say why two of them give the same number. Then type the unit of the one that is not a bit rate.",
    "type": "text",
    "answer": ["samples/s", "samples per second", "samples/sec", "sample/s"],
    "explain": "Model answer: The Nyquist bit rate, 2 × B × log₂ L, takes a channel bandwidth and L levels and gives bps for a noiseless channel. The Nyquist sampling rate, f_N = 2 f_max, takes the highest frequency of an analog signal and gives samples/s. N_max = (1/c) × B × r gives bps from a line code; at c = 1/2 the 1/c is 2, and with r = log₂ L it equals the Nyquist bit rate, which is why the slide says the formula agrees with Nyquist."
  }
]
```

| Week | Name | Formula | Input | Unit |
|---|---|---|---|---|
| 3 | Nyquist bit rate | 2 × bandwidth × log₂ L | channel bandwidth, levels L | bps |
| 5 | Nyquist sampling rate | f_N = 2 × f_max | highest frequency of the analog signal | samples/s (Hz) |
| 4 | N_max of a line code | (1/c) × B × r, with c = 1/2 and r = log₂ L | channel bandwidth, case factor, ratio | bps |

The Nyquist sampling rate needs f_max. For a bandpass signal the bandwidth alone gives no answer: *We cannot find the minimum sampling rate because we do not know the maximum frequency of the signal.*

Lesson: [Nyquist bit rate](#/comp3721-w3/nyquist), [Nyquist sampling](#/comp3721-w5/nyquist-sampling), [bandwidth of a digital signal](#/comp3721-w4/digital-bandwidth).

## 3. Baseband and broadband, low-pass and bandpass

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between a low-pass channel and a bandpass channel, and which transmission each one carries. Then type the frequency a low-pass channel starts at.",
    "type": "text",
    "answer": ["zero", "0", "0 Hz", "zero hertz"],
    "explain": "Model answer: A low-pass channel passes signals below a certain frequency; its lowest frequency is zero and it has an upper bound. Baseband transmission sends the digital signal without changing it to analog, so it needs a low-pass channel (a wired LAN). A bandpass channel passes signals between two frequency limits and does not start from zero; the digital signal must be changed to analog by a modem first, which is broadband transmission (a telephone subscriber line, 0 to 4 kHz, carrying computer data)."
  },
  {
    "q": "Low-pass channels are more common in real life than bandpass channels.",
    "type": "tf",
    "answer": false,
    "explain": "False. Low-pass channels are less common; a bandpass channel is more available. That is why broadband transmission (modulation) is used so widely."
  }
]
```

| | Baseband transmission | Broadband transmission (modulation) |
|---|---|---|
| The digital signal | sent *without changing* it to an analog signal | changed to an analog signal |
| Channel | low-pass: *has an upper bound*, lowest frequency zero | bandpass: between two frequency limits, does not start from zero |
| Device | none; a dedicated medium, one channel | a modem (modulator/demodulator) |
| How common | less common in real life | more available |
| Slide example | a wired LAN | a telephone subscriber line; digital cellular phones |

The two "why?" answers for the slide's broadband examples are from memory, not from the slides; an in-class answer replaces them.

Lesson: [Baseband and broadband](#/comp3721-w3/baseband-broadband).

## 4. Data element and signal element, bit rate and baud rate

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between a data element and a signal element, and between the data rate and the signal rate. Then type the unit of the signal rate.",
    "type": "text",
    "answer": ["baud", "bauds"],
    "explain": "Model answer: A data element (a bit) is the smallest entity that can represent a piece of information; a signal element (a symbol) is the shortest unit, timewise, of a digital signal, and it carries data elements. Data elements are what we need to send, signal elements what we can send. The data rate N counts bits per second (bps); the signal rate S counts signal elements per second (baud), with S = c × N × 1/r. The baud rate, not the bit rate, sets the bandwidth, so the goal is to raise the data rate while lowering the signal rate."
  },
  {
    "q": "A scheme carries 3 data elements per signal element (r = 3). At 900 kbps with c = 1/2, what is the average signal rate, in kbaud?",
    "type": "numeric",
    "answer": 150,
    "tolerance": 0,
    "unit": "kbaud",
    "explain": "S = c × N × 1/r = 1/2 × 900 000 × 1/3 = 150 000 baud = 150 kbaud. A larger r means fewer signal elements for the same bits."
  }
]
```

| | Data element / data rate N | Signal element / signal rate S |
|---|---|---|
| Also called | bit; bit rate | symbol, state; modulation rate, pulse rate, baud rate |
| Slide definition | *the smallest entity that can represent a piece of information* | *the shortest unit (timewise) of a digital signal* |
| Role | *Data elements are what we need to send (logically).* | *Signal elements are what we can send (physically).* |
| Unit | bps | baud |
| Link between them | r = data elements per signal element | S = c × N × 1/r; *The baud rate, not the bit rate, determines the required bandwidth* |

The slide's goal: *A goal in data communications is to increase the data rate while decreasing the signal rate.*

Lesson: [Data and signal elements](#/comp3721-w4/line-coding-elements), [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate).

## 5. Unipolar, polar and bipolar schemes

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between unipolar, polar and bipolar line coding, and name the techniques in each family. Then type the family that uses three voltage levels.",
    "type": "text",
    "answer": ["bipolar", "bipolar (multilevel binary)", "multilevel binary"],
    "explain": "Model answer: In unipolar schemes all the signal levels are on one side of the time axis (unipolar NRZ: 1 positive, 0 zero). In polar schemes the voltages are on both sides of the time axis: NRZ-L, NRZ-I, RZ, Manchester and differential Manchester. Bipolar (multilevel binary) schemes use three levels, positive, negative and zero: in AMI a 0 is zero voltage and each 1 alternates between positive and negative."
  },
  {
    "q": "Select every polar scheme.",
    "options": ["NRZ-I", "Manchester", "Differential Manchester", "AMI", "Unipolar NRZ"],
    "answer": [0, 1, 2],
    "explain": "Polar: NRZ (NRZ-L and NRZ-I), RZ and biphase (Manchester and differential Manchester). AMI is bipolar; NRZ with 1 positive and 0 zero is unipolar."
  }
]
```

| | Unipolar | Polar | Bipolar |
|---|---|---|---|
| Slide wording | *all the signal levels are on one side of the time axis, either above or below* | *the voltages are on both sides of the time axis* | three voltage levels: positive, negative, zero |
| Levels | positive, zero | positive, negative | positive, negative, zero |
| Techniques | NRZ | NRZ-L, NRZ-I, RZ, Manchester, differential Manchester | AMI |
| Rule on the slide | 1 positive, 0 zero | NRZ-L: 0 positive, 1 negative; NRZ-I: 1 change, 0 no change | AMI: 0 zero, 1 alternates |

RZ is named on the slide with no rule. The NRZ-L row follows slide 55; other figures in the course draw 1 high.

Lesson: [Unipolar and polar NRZ](#/comp3721-w4/unipolar-polar-nrz), [Manchester](#/comp3721-w4/manchester), [bipolar AMI and the schemes compared](#/comp3721-w4/bipolar-ami).

## 6. Digital-to-analog and analog-to-analog conversion

```quiz
[
  {
    "q": "Written response, on paper first: explain the differences between digital-to-analog conversion (ASK, FSK, PSK, QAM) and analog-to-analog conversion (AM, FM, PM). Cover the input, the output, bits per signal element and the bandwidth. Then type the digital-to-analog technique that has no analog-to-analog twin.",
    "type": "text",
    "answer": ["QAM", "quadrature amplitude modulation"],
    "explain": "Model answer: Digital-to-analog conversion takes digital data and changes the amplitude, frequency or phase of a carrier based on the bits, a process called modulation or shift keying; analog-to-analog conversion takes an analog signal and lets it vary the same carrier property (AM, FM, PM). Both produce a bandpass analog signal on a carrier. D2A carries bits per signal element (r = log₂ L, or log₂ n for n constellation points) and its bandwidth comes from the baud rate, B = (1 + d)S; A2A has no bits, and its bandwidth comes from the modulating signal's bandwidth, B_AM = 2B and B_FM = 2(1 + β)B. ASK, FSK and PSK are the digital versions of AM, FM and PM; QAM, which combines ASK and PSK, has no A2A twin."
  },
  {
    "q": "Match each digital-to-analog technique with its analog-to-analog counterpart.",
    "type": "match",
    "pairs": [
      ["ASK", "AM"],
      ["FSK", "FM"],
      ["PSK", "PM"],
      ["QAM", "no counterpart"]
    ],
    "explain": "Each pair varies the same carrier property: amplitude, frequency, phase. QAM varies amplitude and phase on two carriers 90° apart, and no analog method does that."
  },
  {
    "q": "The bandwidth of an AM signal is set by the baud rate of the data.",
    "type": "tf",
    "answer": false,
    "explain": "False. AM carries an analog signal, so there is no baud rate: B_AM = 2B, twice the bandwidth of the modulating signal. Baud sets the bandwidth for ASK, FSK and PSK: B = (1 + d)S."
  }
]
```

| | Digital-to-analog (D2A) | Analog-to-analog (A2A) |
|---|---|---|
| Input | digital data | an analog signal (the modulating signal) |
| Output | a bandpass analog signal on a carrier | a bandpass analog signal on a carrier |
| Called | *modulation or shift keying* | amplitude, frequency, phase modulation |
| Techniques | ASK, FSK, PSK, QAM | AM, FM, PM |
| Bits per signal element | r = log₂ L; log₂ n for n points | none |
| Rates | baud rate ≤ bit rate, S = N/r | no bit or baud rate |
| Bandwidth | ASK, PSK: B = (1 + d)S; FSK: (1 + d)S + 2Δf | B_AM = 2B; B_FM = 2(1 + β)B; PM: no formula on the slide |
| Example | 802.11 Wi-Fi uses QAM | AM radio 10 kHz, FM radio 200 kHz |

PSK is less susceptible to noise than ASK: *Because noise can change the amplitude easier than it can change the phase.* The slides never define d; the textbook's d is a factor between 0 and 1.

Lesson: [ASK, FSK and PSK](#/comp3721-w5/ask-fsk-psk), [constellation diagrams](#/comp3721-w5/constellation), [AM, FM and PM](#/comp3721-w5/am-fm-pm).

## 7. The four kinds of conversion

```quiz
[
  {
    "q": "Match each technique with the conversion it performs.",
    "type": "match",
    "pairs": [
      ["Line coding (NRZ-L, Manchester, AMI)", "digital data to a digital signal"],
      ["PCM (sampling, quantizing, encoding)", "analog data to a digital signal"],
      ["ASK, FSK, PSK, QAM", "digital data to an analog signal"],
      ["AM, FM, PM", "analog data to an analog signal"]
    ],
    "explain": "Name the data first, then the signal. Line coding and PCM produce digital signals; shift keying and AM/FM/PM produce analog signals on a carrier."
  },
  {
    "q": "Select every conversion whose output is a bandpass analog signal riding on a carrier.",
    "options": ["ASK, FSK, PSK, QAM", "AM, FM, PM", "Line coding", "PCM"],
    "answer": [0, 1],
    "explain": "The two analog outputs (D2A and A2A) are bandpass and use a carrier. Line coding and PCM give digital signals, which are baseband and need a low-pass channel."
  }
]
```

| Data | Signal | Name | Lecture |
|---|---|---|---|
| digital | digital | line coding | 04 |
| analog | digital | PCM: sampling, quantizing, encoding | 05a |
| digital | analog | ASK, FSK, PSK, QAM | 05b |
| analog | analog | AM, FM, PM | 05b |

*When we have a bandpass channel, we require analog transmission.*

Lesson: [E05 worked, the conversions compared](#/comp3721-w5/e05-worked), [digitization and PCM](#/comp3721-w5/digitization-pcm).

## 8. FDM, WDM and TDM

```quiz
[
  {
    "q": "Match each multiplexing technique with its description.",
    "type": "match",
    "pairs": [
      ["FDM", "analog; each signal modulates its own carrier frequency, guard bands between channels"],
      ["WDM", "analog, for optical signals; a prism combines and splits the light"],
      ["TDM", "digital; the link's time is shared, one slot per input in each frame"]
    ],
    "explain": "FDM and WDM are the analog techniques; WDM is FDM on light, where the frequencies are very high. TDM is the digital one: instead of sharing a portion of the bandwidth as in FDM, time is shared."
  },
  {
    "q": "Written response, on paper first: explain the difference between FDM and TDM. Then type what TDM shares among the inputs instead of bandwidth.",
    "type": "text",
    "answer": ["time", "the time", "link time"],
    "explain": "Model answer: FDM is an analog technique: each signal modulates a different carrier frequency, the modulated signals are combined into one composite signal, and guard bands separate the channels, so the link needs n × B + (n − 1) × guard. TDM is a digital technique: each input's data is divided into units, one unit per input goes into each frame, and a frame has n time slots. Instead of sharing a portion of the bandwidth as in FDM, time is shared, and the link rate is n times an input's rate."
  }
]
```

| | FDM | WDM | TDM |
|---|---|---|---|
| Signals | analog | analog, optical | digital |
| Shares | the bandwidth, one carrier per channel | a fibre's light, one wavelength per channel | the time, one slot per input |
| Separator | guard bands | wavelengths | time slots (and framing bits) |
| Combining device | modulators and an adder | *a prism* | a MUX that takes one unit per input per frame |
| Link size | n × B + (n − 1) × guard | | n × input rate |

*Link refers to the physical path. Channel refers to the portion of a link.*

Lesson: [Multiplexing](#/comp3721-w6/multiplexing), [FDM](#/comp3721-w6/fdm), [WDM](#/comp3721-w6/wdm), [synchronous TDM](#/comp3721-w6/synchronous-tdm).

## 9. Synchronous and statistical TDM, and the three rate strategies

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between multilevel multiplexing, multiple-slot allocation and pulse stuffing, and when each is used. Then type the strategy used when the input rates are not integer multiples of each other.",
    "type": "text",
    "answer": ["pulse stuffing", "bit padding", "bit stuffing", "pulse-stuffing"],
    "explain": "Model answer: Multilevel multiplexing is used when one input rate is a multiple of the others; slow lines are first combined by a small MUX into one faster line (20 + 20 → 40 kbps). Multiple-slot allocation gives one fast input line more than one slot in a frame; a DEMUX splits it into lines at the common rate (50 → 2 × 25 kbps). Pulse stuffing (bit padding) is used when the rates are not integer multiples of each other: the highest rate becomes the dominant rate and dummy bits raise the slower lines to it (46 → 50 kbps)."
  },
  {
    "q": "Statistical TDM improves on synchronous TDM by giving every input a fixed slot in every frame.",
    "type": "tf",
    "answer": false,
    "explain": "False. Synchronous TDM gives every input a fixed slot, and a silent input leaves its slot empty. *Statistical TDM can improve the efficiency by removing the empty slots from the frame.*"
  }
]
```

| | Synchronous TDM | Statistical TDM |
|---|---|---|
| Slots | one per input in every frame, used or not | the empty slots removed |
| Weak point | *If a source does not have data to send, the corresponding slot in the output frame is empty.* | named only on the slides |

| Strategy | When | What it does | Slide figure |
|---|---|---|---|
| Multilevel multiplexing | *the data rate of an input line is a multiple of others* | combines the slow lines first | 20 + 20 → 40; 4 × 40 = 160 kbps |
| Multiple-slot allocation | *an input line has multiple rates of the others* | *Allocating more than one slot in a frame to a single input line* | 50 → 2 × 25; 5 × 25 = 125 kbps |
| Pulse stuffing (bit padding) | *the bit rates of sources are not integer multiples of each other* | dummy bits up to the dominant rate | 46 → 50; 3 × 50 = 150 kbps |

The 06a pulse stuffing is not Week 7's bit stuffing in a frame, which adds a 0 after five 1s.

Lesson: [TDM rate management](#/comp3721-w6/tdm-rate-management).

## 10. Uniform and nonuniform quantization

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between uniform and nonuniform quantization, and why nonuniform quantization exists. Then fill the slide's word: \"In nonuniform quantization, height of Δ is not ___.\"",
    "type": "text",
    "answer": ["fixed"],
    "explain": "Model answer: Uniform quantization gives every zone the same height Δ = (V_max − V_min)/L, which is only optimal for a uniformly distributed signal. Real audio (speech and music) is concentrated near zero, so nonuniform quantization lets the height of Δ vary. The slide: *In nonuniform quantization, height of Δ is not fixed; it is greater near the lower amplitudes and less near the higher amplitudes.* The textbook may describe the opposite direction; an in-class answer replaces this."
  }
]
```

| | Uniform | Nonuniform |
|---|---|---|
| Zone height | Δ = (V_max − V_min)/L, the same for every zone | *height of Δ is not fixed* |
| Fits | *Only optimal for uniformly distributed signal.* | signals whose amplitudes are not uniform: *speech and music (real audio signals) are more concentrated near zeros (lower amplitudes)* |
| Direction on the slide | | *greater near the lower amplitudes and less near the higher amplitudes* (unverified against the textbook) |

Lesson: [Quantization](#/comp3721-w5/quantization), [quantization error and nonuniform quantization](#/comp3721-w5/quantization-error-bandwidth).

## 11. IP and MAC addresses, ARP request and reply

```quiz
[
  {
    "q": "Written response, on paper first: explain the difference between an IP address and a link-layer (MAC) address: size, order in the frame, and what happens to each at a router. Then type which of the two changes at every hop (IP or MAC).",
    "type": "text",
    "answer": ["MAC", "MAC address", "link-layer", "link-layer address", "link layer address", "physical address"],
    "explain": "Model answer: The source and destination IP addresses (32 bits, network layer) define the two ends of the journey and do not change. The datagram is encapsulated in a frame with two link-layer (MAC) addresses (48 bits in Ethernet, 12 hex digits), and these are changed every time the frame moves from one link to another. Order: IP addresses source then destination; link-layer addresses destination then source. ARP finds the next node's MAC address from its IP address."
  },
  {
    "q": "How many bits are in an Ethernet MAC address?",
    "type": "numeric",
    "answer": 48,
    "tolerance": 0,
    "unit": "bits",
    "explain": "12 hexadecimal digits × 4 bits = 48 bits = 6 bytes. An IPv4 address is 32 bits."
  },
  {
    "q": "The ARP reply is broadcast to every system on the LAN.",
    "type": "tf",
    "answer": false,
    "explain": "False. *ARP request is broadcast*; *ARP reply is unicast*, sent only to the system that asked, whose addresses were in the request."
  }
]
```

| | IP address | Link-layer (MAC) address |
|---|---|---|
| Layer | network | data link |
| Size | 32 bits (IPv4) | 48 bits, 12 hex digits (Ethernet) |
| Defines | the two ends of the journey | the two ends of the current link |
| Per hop | never changes | *changed every time the frame moves from one link to another* |
| Order on the slide | *source-destination* | *destination-source* |

| | ARP request | ARP reply |
|---|---|---|
| Sent | broadcast, to every system on the LAN | unicast, to the asker only |
| Operation field | 1 | 2 |
| Destination hardware address | all 0s (unknown) | the asker's MAC |
| Slide text | *Looking for link-layer address of a node with IP address N₂* | *I am the node and my link-layer address is L₂* |

ARP is *One of the auxiliary protocols defined in the network layer*, and it *maps an IP address to a logical-link address*.

Lesson: [Link-layer addressing](#/comp3721-w6/link-layer-addressing), [ARP](#/comp3721-w6/arp).
