---
title: "Review 4c: line coding, conversion, multiplexing and ARP, in the slide's words"
minutes: 30
---
This lesson teaches the Week 4 to 6 ideas that come back as short written answers: line coding, conversion, multiplexing and ARP. It prepares you for "how can you tell whether a scheme has …", "explain the difference between …" and "what is the role of ARP?".

## What line coding is, in plain words

*Line coding* is *the process of converting digital data to digital signal*. Each bit becomes a voltage level on the wire for a short time.

The receiver decides each bit by comparing the voltage with a running average of what has arrived so far. The slide calls that average the *baseline*.

The receiver also reads one bit per tick of its own clock. Every change of level on the wire, a *transition*, lets it reset that clock.

So one test finds all three problems. Picture a long run of 0s, then a long run of 1s, and watch the level.

```diagram
{ "type": "tree", "title": "The long-run test for a line-coding scheme", "nodes": [
  { "id": "q", "label": "A long run of 0s or 1s" },
  { "id": "f", "label": "Level stays fixed", "parent": "q" },
  { "id": "t", "label": "Level changes mid-bit", "parent": "q" },
  { "id": "f1", "label": "baseline wandering", "parent": "f" },
  { "id": "f2", "label": "no self-sync", "parent": "f" },
  { "id": "f3", "label": "DC if the mean is not 0", "parent": "f" },
  { "id": "t1", "label": "no wandering, self-sync, no DC", "sub": "Manchester", "parent": "t" }
], "hi": ["f"], "caption": "NRZ-L holds one level over a run, so it fails all three tests; Manchester changes in the middle of every bit, so it passes them." }
```

## A tiny case you can do in your head

NRZ-L sends a 0 as the positive level and a 1 as the negative level. Take the 10 bits 1110111100 at plus and minus 3 V.

There are three 0s and seven 1s. The *DC component* is the mean of the levels.

$$\text{mean} = \frac{3 \times (+3) + 7 \times (-3)}{10}$$

$$= \frac{9 - 21}{10} = \textbf{\text{−1.2 V}}$$

The mean is not zero, so this signal **has a DC component**. Manchester gives every bit a positive half and a negative half, so its mean is 0.

The slide's clock example is the same kind of check. A receiver clock 0.1 percent fast at 1 Mbps reads extra bits every second.

$$0.001 \times 1\,000\,000 = \textbf{\text{1000 extra bits per second}}$$

```widget
baseline-dc
{ "bits": "0100000000001011", "scheme": "nrz-l", "schemes": ["nrz-l", "manchester"] }
```

Schemes come in three families, named by where their levels sit.

```diagram
{ "type": "grid", "title": "The three line-coding families and their named schemes", "nodes": [
  { "id": "h0", "label": "family", "row": 0, "col": 0 },
  { "id": "h1", "label": "where the levels sit", "row": 0, "col": 1 },
  { "id": "h2", "label": "schemes on the slide", "row": 0, "col": 2 },
  { "id": "u0", "label": "unipolar", "row": 1, "col": 0 },
  { "id": "u1", "label": "one side of the time axis", "row": 1, "col": 1 },
  { "id": "u2", "label": "NRZ", "row": 1, "col": 2 },
  { "id": "p0", "label": "polar", "row": 2, "col": 0 },
  { "id": "p1", "label": "both sides of the time axis", "row": 2, "col": 1 },
  { "id": "p2", "label": "NRZ-L, NRZ-I, RZ, Manchester, differential Manchester", "row": 2, "col": 2 },
  { "id": "b0", "label": "bipolar", "row": 3, "col": 0 },
  { "id": "b1", "label": "three levels: positive, negative, zero", "row": 3, "col": 1 },
  { "id": "b2", "label": "AMI (and pseudoternary)", "row": 3, "col": 2 }
], "hi": ["u0", "p0", "b0"], "caption": "Name the family by where the levels sit, then list its schemes. Pseudoternary is not on the Week 4 slides, which draw only AMI." }
```

```quiz
[
  {
    "type": "free",
    "q": "What is baseline wandering, and how can you tell whether a line-coding scheme suffers from it?",
    "model": "The *baseline* is *a running average of the received signal power* that the receiver uses to decode each bit; *baseline wandering* is *a drift in the baseline caused by a long string of 0s or a long string of 1s*, which makes decoding difficult. To detect it, picture a long run of equal bits: if the scheme holds one level for the whole run, the average drifts. NRZ-L holds one level for a run of 0s or of 1s, so it wanders; Manchester has a positive and a negative half in every bit, so it does not.",
    "points": [
      "baseline: running average of the received signal power",
      "wandering: drift caused by a long string of 0s or 1s",
      "detect: the level stays fixed over a long run",
      "example: NRZ-L wanders, Manchester does not"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Baseline, self-synchronization and DC\" and the BW column of the scheme table."
  },
  {
    "type": "free",
    "q": "What is a DC component, why is it a problem, and how can you tell whether a scheme has one?",
    "model": "A *DC component (bias)* is *the mean amplitude of the waveform*: the *very low frequencies (around zero)* created by a duration of fixed voltage level. It is a problem for a system that *cannot pass low frequencies* or *uses electrical coupling*. To detect it, average the levels over a run: 1110111100 in NRZ-L at ±3 V gives (3 × 3 − 7 × 3)/10 = −1.2 V, so it has a DC component, while Manchester averages 0 because every bit has a positive and a negative part.",
    "points": [
      "DC component (bias): the mean amplitude; very low frequencies around zero",
      "caused by a duration of fixed voltage level",
      "problem: a line that cannot pass low frequencies, electrical coupling",
      "detect: the average level is not zero",
      "example: NRZ-L has DC; Manchester has none (DC balanced)"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Baseline, self-synchronization and DC\" (the DC line under the slide examples is a computed case, not a slide number)."
  },
  {
    "type": "free",
    "q": "What is the lack of synchronization in line coding, and how does a scheme provide self-synchronization?",
    "model": "*The receiver clock must be synchronized with the sender clock*, with bit intervals that correspond exactly, or the received bits are misread. A *self-synchronizing* digital signal *includes timing information in the data being transmitted*: *transitions* that alert the receiver to the beginning, middle or end of the pulse and reset its clock, so a scheme lacks synchronization when a long run of 0s or 1s has no transition. A receiver clock 0.1 percent fast at 1 Mbps receives 1000 extra bits per second; Manchester's mid-bit transition prevents that, NRZ-L does not.",
    "points": [
      "receiver and sender clocks must match (bit intervals exactly)",
      "self-synchronizing: timing information in the data",
      "transitions reset the receiver's clock",
      "detect: no transition over a long run",
      "number or example: 0.1% at 1 Mbps = 1000 extra bps; Manchester mid-bit transition"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Baseline, self-synchronization and DC\" (the slide's 0.1% example)."
  },
  {
    "type": "free",
    "q": "Explain the difference between unipolar, polar and bipolar line coding, and name the techniques in each category.",
    "model": "In *unipolar* schemes *all the signal levels are on one side of the time axis, either above or below*: unipolar *NRZ* (positive for 1, zero for 0). In *polar* schemes *the voltages are on both sides of the time axis*: *NRZ-L*, *NRZ-I*, *RZ*, *Manchester* and *differential Manchester*. *Bipolar* (*multilevel binary*) schemes use *three voltage levels, positive, negative and zero*: in *AMI* a 0 is zero voltage and each 1 alternates between positive and negative. (Pseudoternary also belongs to this family, but the slides do not draw it.)",
    "points": [
      "unipolar: one side of the time axis; NRZ",
      "polar: both sides of the time axis",
      "polar schemes: NRZ-L, NRZ-I, RZ, Manchester, differential Manchester",
      "bipolar (multilevel binary): three levels; AMI"
    ],
    "rows": 5,
    "explain": "Sheet side 2, \"The line-coding schemes and their level rules\". E04 question 3 asks this from a figure: two levels on both sides is polar; three with 1s alternating is bipolar (AMI)."
  }
]
```

## What conversion is, in plain words

A *carrier* is a plain sine wave at a fixed frequency. On its own it carries nothing, like a steady hum.

To send information, the sender changes one property of the carrier. A sine wave has three: its *amplitude* or height, its *frequency* or speed, and its *phase* or starting point.

*Digital-to-analog* conversion changes the carrier to follow digital data, the 1s and 0s. *Analog-to-analog* conversion changes it to follow an analog signal, such as a voice.

So both kinds change the same three properties. What differs is only the input.

```diagram
{ "type": "grid", "title": "What changes, against what goes in", "nodes": [
  { "id": "h0", "label": "carrier property varied", "row": 0, "col": 0 },
  { "id": "h1", "label": "digital data in", "row": 0, "col": 1 },
  { "id": "h2", "label": "analog signal in", "row": 0, "col": 2 },
  { "id": "a0", "label": "amplitude", "row": 1, "col": 0 },
  { "id": "a1", "label": "ASK", "row": 1, "col": 1 },
  { "id": "a2", "label": "AM", "row": 1, "col": 2 },
  { "id": "f0", "label": "frequency", "row": 2, "col": 0 },
  { "id": "f1", "label": "FSK", "row": 2, "col": 1 },
  { "id": "f2", "label": "FM", "row": 2, "col": 2 },
  { "id": "p0", "label": "phase", "row": 3, "col": 0 },
  { "id": "p1", "label": "PSK", "row": 3, "col": 1 },
  { "id": "p2", "label": "PM", "row": 3, "col": 2 },
  { "id": "q0", "label": "amplitude and phase", "row": 4, "col": 0 },
  { "id": "q1", "label": "QAM", "row": 4, "col": 1 },
  { "id": "q2", "label": "none", "row": 4, "col": 2 }
], "hi": ["q1"], "caption": "Each row pairs a digital technique with its analog twin; QAM varies two properties and has no analog-to-analog twin." }
```

A *constellation diagram* draws each kind of signal element as one dot. With n dots, each signal element carries log₂ n bits.

$$\log_2 16 = \textbf{\text{4 bits per signal element}}$$

So 16-QAM carries four bits in each element, where binary ASK or binary PSK carries one. For AM the slide gives the bandwidth as twice the audio's bandwidth.

$$B_{AM} = 2 \times 5\ \text{kHz} = \textbf{\text{10 kHz}}$$

For FM it is 2(1 + β)B, where β is a factor, 4 for FM radio carrying 15 kHz audio. The 50 kHz guard band then goes on top.

$$B_{FM} = 2 \times (1 + 4) \times 15\ \text{kHz} = 150\ \text{kHz}$$

$$150 + 50 = \textbf{\text{200 kHz}}$$

```quiz
[
  {
    "type": "free",
    "q": "Explain the difference between ASK, FSK, PSK and QAM: what each one varies and what stays constant.",
    "model": "All four are *digital-to-analog conversion*, *modulation or shift keying*: in *ASK* *the amplitude of the carrier signal is varied* while frequency and phase stay constant; in *FSK* *the frequency of the carrier signal is changed* while peak amplitude and phase stay constant; in *PSK* *the phase of the carrier is changed* while peak amplitude and frequency stay constant. *QAM combines ASK and PSK*, varying amplitude and phase on *two carriers, one in-phase and the other quadrature*. Binary FSK, for example, uses f₁ for a 0 and f₂ for a 1.",
    "points": [
      "ASK: amplitude varies; frequency and phase constant",
      "FSK: frequency varies; peak amplitude and phase constant",
      "PSK: phase varies; peak amplitude and frequency constant",
      "QAM: combines ASK and PSK, in-phase and quadrature carriers"
    ],
    "rows": 5,
    "explain": "Sheet side 3, \"D2A and A2A side by side\", the Varies and Constant columns."
  },
  {
    "type": "free",
    "q": "Explain the difference between AM, FM and PM, with the bandwidth the slide gives for AM and FM.",
    "model": "In *AM* the carrier's *amplitude varies* with the changing amplitudes of the modulating signal, in *FM* its *frequency* follows the modulating signal's voltage level, and in *PM* its *phase* does; the two other properties stay constant each time. *The bandwidth of the modulated signal is twice the bandwidth of the modulating signal* for AM, B_AM = 2B, and B_FM = 2(1 + β)B for FM; the slide gives no PM formula. An AM station carrying 5 kHz audio needs 10 kHz; an FM station carrying 15 kHz with β = 4 needs 150 kHz, 200 kHz with the 50 kHz guard band.",
    "points": [
      "AM: amplitude varies",
      "FM: frequency varies",
      "PM: phase varies",
      "B_AM = 2B; B_FM = 2(1 + β)B; no PM formula on the slide",
      "number: AM 10 kHz, FM 200 kHz"
    ],
    "rows": 5,
    "explain": "Sheet side 3, \"D2A and A2A side by side\" and the AM and FM radio line under it."
  },
  {
    "type": "free",
    "q": "In one sentence each, define digital-to-analog and analog-to-analog conversion, then pair the techniques.",
    "model": "*Digital-to-analog conversion* is *converting digital data to a bandpass analog signal* by *modifying any of the three characteristics (amplitude, frequency, and phase) of a sine wave (i.e., carrier signal) based on the information in the digital data*. *Analog-to-analog conversion* lets an analog modulating signal vary the amplitude, frequency or phase of the carrier. ASK pairs with AM, FSK with FM and PSK with PM; QAM has no analog-to-analog twin.",
    "points": [
      "D2A: digital data to a bandpass analog signal",
      "A2A: an analog signal varies the carrier",
      "both change amplitude, frequency or phase of a carrier",
      "pairs: ASK-AM, FSK-FM, PSK-PM; QAM has none"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Digital-to-analog conversion (05b)\" and the Differences line in \"D2A and A2A side by side\"."
  },
  {
    "type": "free",
    "q": "Why is PSK less susceptible to noise than ASK, and what is its cost?",
    "model": "*PSK* changes the *phase* of the carrier and keeps the peak amplitude constant, while *ASK* carries the bits in the *amplitude*. It is less susceptible to noise *because noise can change the amplitude easier than it can change the phase*, which is also why PSK is *more common than ASK or FSK*. The cost: *PSK needs more sophisticated hardware to be able to distinguish between phases*; binary PSK uses 0° and 180° and has the same bandwidth as binary ASK.",
    "points": [
      "PSK varies phase; ASK varies amplitude",
      "noise changes amplitude more easily than phase",
      "PSK is more common than ASK or FSK",
      "cost: more sophisticated hardware to distinguish phases"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Digital-to-analog conversion (05b)\", the PSK line."
  },
  {
    "type": "free",
    "q": "Why can QAM carry more bits per signal element than binary ASK or binary PSK? Use the constellation diagram.",
    "model": "*QAM combines ASK and PSK* on *two carriers, one in-phase and the other quadrature* (90° apart), so a signal element can differ in amplitude and in phase at once. On the *constellation diagram* each signal element type is a *dot*, and for each dot *Length: amplitude* and *Angle: phase*, and *a modulation with n constellation points transmits log₂ n bits per signal element*. Binary ASK and binary PSK have 2 points, 1 bit each; 16-QAM has 16 points, log₂ 16 = 4 bits per signal element.",
    "points": [
      "QAM combines ASK and PSK",
      "in-phase and quadrature carriers, 90° apart",
      "constellation: length = amplitude, angle = phase",
      "n points → log₂ n bits",
      "number: 16-QAM = 4 bits vs 1 bit for BASK or BPSK"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Constellation diagram\". Review item 10: n constellation points carry log₂ n bits."
  }
]
```

## What multiplexing is, in plain words

*Multiplexing* lets several signals share one link at the same time. A *MUX* combines them at one end, and a *DEMUX* separates them at the other.

*FDM* is like a highway with lanes. Each signal gets its own band of frequencies, with an empty strip, a *guard band*, between neighbours.

*TDM* is like taking turns. Each input gets a short slot of time in every frame, one after another.

So FDM divides the bandwidth and is analog. TDM divides the time and is digital, and *WDM* is FDM done with colours of light in a fibre.

```diagram
{ "type": "grid", "title": "FDM, WDM and TDM side by side", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "signals", "row": 0, "col": 1 },
  { "id": "h2", "label": "what is divided", "row": 0, "col": 2 },
  { "id": "f0", "label": "FDM", "row": 1, "col": 0 },
  { "id": "f1", "label": "analog", "row": 1, "col": 1 },
  { "id": "f2", "label": "bandwidth: one band each", "row": 1, "col": 2 },
  { "id": "w0", "label": "WDM", "row": 2, "col": 0 },
  { "id": "w1", "label": "analog, optical", "row": 2, "col": 1 },
  { "id": "w2", "label": "light: one wavelength each", "row": 2, "col": 2 },
  { "id": "t0", "label": "TDM", "row": 3, "col": 0 },
  { "id": "t1", "label": "digital", "row": 3, "col": 1 },
  { "id": "t2", "label": "time: one slot each", "row": 3, "col": 2 }
], "hi": ["f2", "t2"], "caption": "A multiplexing answer gives two facts per technique: analog or digital, and what is divided among the inputs." }
```

Guard bands sit only between neighbours, so n channels need n − 1 of them. Five 100 kHz channels with 10 kHz guard bands need this much.

$$5 \times 100 + 4 \times 10 = \textbf{\text{540 kHz}}$$

A TDM frame also starts with a *framing bit* so the DEMUX can find the slots. In E06, four 8-bit characters and 1 framing bit make one frame.

$$4 \times 8 + 1 = 33\ \text{bits per frame}$$

$$250\ \text{frames/s} \times 33\ \text{bits} = \textbf{\text{8250 bps}}$$

```widget
mux-link
{ "n": 3, "mode": "fdm", "title": "Three input lines into one link: switch between FDM bands, TDM slots and WDM colours" }
```

```quiz
[
  {
    "type": "free",
    "q": "Explain the difference between FDM, WDM and TDM: analog or digital, and what is shared among the inputs.",
    "model": "*Multiplexing* is *the set of techniques that allow the simultaneous transmission of multiple signals across a single data link*. *FDM* is an *analog* technique in which each signal modulates a different carrier frequency, so the bandwidth is divided; *WDM* is an *analog* technique for *optical* signals that combines wavelengths on one fibre with a *prism*; *TDM* is a *digital* technique in which, *instead of sharing a portion of the bandwidth as in FDM, time is shared*. The slide's FDM example puts three 4 kHz voice channels at 20 to 24, 24 to 28 and 28 to 32 kHz.",
    "points": [
      "FDM: analog, each input its own carrier frequency (bandwidth divided)",
      "WDM: analog, optical, a prism",
      "TDM: digital, time is shared",
      "an example or number"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Multiplexing, FDM and WDM (06a)\"."
  },
  {
    "type": "free",
    "q": "What are guard bands and why does FDM need them? How many are there for n channels?",
    "model": "*Guard bands* are *strips of unused bandwidth that separate channels from each other*, used *to prevent signals from overlapping and interference*. They sit between neighbouring channels, so n channels need n − 1 guard bands. Five 100 kHz channels with 10 kHz guard bands need 5 × 100 + 4 × 10 = 540 kHz.",
    "points": [
      "strips of unused bandwidth between channels",
      "prevent overlapping and interference",
      "n − 1 guard bands for n channels",
      "number: 540 kHz for 5 × 100 kHz with 10 kHz guards"
    ],
    "rows": 3,
    "explain": "Sheet side 3, \"Multiplexing, FDM and WDM (06a)\", Ex 1."
  },
  {
    "type": "free",
    "q": "Explain the difference between synchronous and statistical TDM.",
    "model": "In *synchronous TDM* each frame has n *time slots*, one allocated to each input line in every frame, whether or not it has data. It is not efficient: *if a source does not have data to send, the corresponding slot in the output frame is empty*. *Statistical TDM can improve the efficiency by removing the empty slots from the frame*; with four inputs and one idle, a synchronous frame still carries four slots, one of them empty.",
    "points": [
      "synchronous: one slot per input in every frame",
      "an idle source leaves an empty slot: not efficient",
      "statistical TDM removes the empty slots",
      "an example with an idle input"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Synchronous TDM and E06\". The slides only name statistical TDM; do not add details they do not give."
  },
  {
    "type": "free",
    "q": "Why does synchronous TDM add framing bits, and where do they go?",
    "model": "*Synchronization between the multiplexer and demultiplexer is a major issue*, so *framing bits*, *one or more synchronization bits*, are *added to the beginning of each frame*. They *follow a pattern (e.g., 1 0 1 …) frame to frame* and *allow the demultiplexer to synchronize with the incoming stream so that it can separate the time slots accurately*. In E06 four 8-bit characters plus 1 framing bit make 33 bits per frame, and 250 frames/s × 33 bits = 8250 bps on the link.",
    "points": [
      "synchronization between MUX and DEMUX",
      "added to the beginning of each frame",
      "a pattern frame to frame (1 0 1 …)",
      "lets the DEMUX separate the time slots",
      "number: 4 × 8 + 1 = 33 bits, 8250 bps"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"Synchronous TDM and E06\", E06-2. The framing bit counts in the link rate."
  }
]
```

## What ARP is for, in plain words

Every frame on a link must name the next node by its *link-layer (MAC) address*. That is the hardware address of the network card at the other end of the wire.

The computer only knows the next node's *IP address*, from its forwarding table. *ARP* turns that IP address into the MAC address.

It asks everyone on the LAN at once, because it does not know who to ask. Only the owner of that IP address answers, straight back to the asker.

Here the game PC has IP address N_A and MAC address L_A. It sends a telemetry batch through router R1 to the collector PC, N_B and L_B, on a second LAN.

```diagram
{ "type": "sequence", "title": "ARP on the game PC's LAN, before the first frame", "nodes": [
  { "id": "pc", "label": "Game PC", "sub": "N_A, L_A", "kind": "lane" },
  { "id": "lan", "label": "Every system on the LAN", "kind": "lane" },
  { "id": "r", "label": "Router R1", "sub": "N₁, L₁", "kind": "lane" }
], "edges": [
  { "from": "pc", "to": "lan", "label": "request, broadcast: N₁?" },
  { "from": "r", "to": "pc", "label": "reply, unicast: L₁" },
  { "from": "pc", "to": "r", "label": "frame to L₁" }
], "hi": ["1", "2"], "caption": "The forwarding table names the next hop's IP address N₁; ARP turns it into the link-layer address L₁, and the first frame is [L₁ | L_A | N_A | N_B | Data]." }
```

The router builds a new frame for the next link. The MAC addresses change at every hop, and the IP addresses never change.

```diagram
{ "type": "grid", "title": "The batch's frame on each link", "nodes": [
  { "id": "h0", "label": "link", "row": 0, "col": 0 },
  { "id": "h1", "label": "MAC dest", "row": 0, "col": 1 },
  { "id": "h2", "label": "MAC source", "row": 0, "col": 2 },
  { "id": "h3", "label": "IP source", "row": 0, "col": 3 },
  { "id": "h4", "label": "IP dest", "row": 0, "col": 4 },
  { "id": "a0", "label": "game LAN", "row": 1, "col": 0 },
  { "id": "a1", "label": "L₁", "row": 1, "col": 1 },
  { "id": "a2", "label": "L_A", "row": 1, "col": 2 },
  { "id": "a3", "label": "N_A", "row": 1, "col": 3 },
  { "id": "a4", "label": "N_B", "row": 1, "col": 4 },
  { "id": "b0", "label": "collector LAN", "row": 2, "col": 0 },
  { "id": "b1", "label": "L_B", "row": 2, "col": 1 },
  { "id": "b2", "label": "L₂", "row": 2, "col": 2 },
  { "id": "b3", "label": "N_A", "row": 2, "col": 3 },
  { "id": "b4", "label": "N_B", "row": 2, "col": 4 }
], "hi": ["a1", "a2", "b1", "b2"], "caption": "Both MAC fields change at the router, where L₂ is its port on the collector's LAN; N_A and N_B stay the same for the whole journey." }
```

```widget
arp-exchange
{ "target": 2, "quiz": false }
```

```quiz
[
  {
    "type": "free",
    "q": "What is the role of ARP? Use the telemetry batch leaving the game PC as the example.",
    "model": "*ARP (Address Resolution Protocol)* is *one of the auxiliary protocols defined in the network layer*; it *maps an IP address to a logical-link address*, the link-layer (MAC) address of the next node. It is needed because the IP addresses *define the two ends but cannot define which links the datagram should pass through*, and each frame needs the next node's link-layer address. The game PC's forwarding table names the router's IP address N₁ as the next hop, and ARP returns the router's link-layer address L₁ for the first frame.",
    "points": [
      "an auxiliary protocol of the network layer",
      "maps an IP address to a link-layer (MAC) address",
      "IP addresses cannot define which links are used",
      "example: next-hop IP N₁ → L₁ for the frame"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"ARP\". The slide prints \"logical-link address\"; it means the link-layer address."
  },
  {
    "type": "free",
    "q": "Why is an ARP request broadcast but an ARP reply unicast?",
    "model": "*ARP request is broadcast*: the asker does not yet know the link-layer address it is looking for, so the request (*Looking for link-layer address of a node with IP address N₂*) goes to every system on the LAN, with the destination hardware address *all 0s*. *ARP reply is unicast*: only the node with that IP address answers (*I am the node and my link-layer address is L₂*), and it already knows the asker's addresses from the request. The game PC broadcasts for the router's IP address, and only the router replies, straight to the game PC.",
    "points": [
      "request broadcast to every system on the LAN",
      "the asker does not know the address (destination hardware address all 0s)",
      "reply unicast, only to the asker",
      "the replier knows the asker's addresses from the request"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"ARP\", the request and reply table (operation 1 and 2)."
  },
  {
    "type": "free",
    "q": "As the telemetry batch crosses the router to the collector's LAN, which addresses change and which do not? Explain why.",
    "model": "The *link-layer addresses* in the frame header *are changed every time the frame moves from one link to another*, because they name the two ends of the current link; the router builds a new frame with new source and destination link-layer addresses. *The source and destination network-layer addresses, N_A and N_B, have not been changed during the whole journey*, because they name the two ends of the trip. On the first link the frame is [L₁ | L_A | N_A | N_B | Data]; on the collector's LAN it is [L_B | L₂ | N_A | N_B | Data], where L₂ is the router's interface on that LAN.",
    "points": [
      "link-layer addresses change at every hop (every link)",
      "they name the two ends of the current link",
      "N_A and N_B never change: the two ends of the journey",
      "order: link-layer destination then source; IP source then destination",
      "example frames on two links"
    ],
    "rows": 5,
    "explain": "Sheet side 3, \"Alice to Bob, where N_A and N_B never change\". A router changes both link-layer addresses when it forwards."
  }
]
```

## Remember

- The long-run test: a level fixed over a long run means wandering and no self-sync, and a non-zero mean means DC.
- Digital-to-analog and analog-to-analog vary the same three properties. Only the input differs.
- An ARP request is broadcast and the reply is unicast. MAC addresses change at every hop, IP addresses never.
- *On the sheet:* *Sheet side 3, "D2A and A2A side by side"* and *Sheet side 3, "ARP"*.

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "how can you tell whether a scheme has a DC component" | the mean of the levels over a run | volts | not zero means DC |
| "guard bands for n channels" | n × channel + (n − 1) × guard | kHz | 540 kHz for five 100 kHz channels |
| "bits per signal element" | log₂ n for n constellation points | bits | 16-QAM gives 4 |
