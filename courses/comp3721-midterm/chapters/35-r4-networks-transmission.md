---
title: "Review 4b: networks, signals and transmission, in the slide's words"
minutes: 30
---
This lesson teaches the Week 1 to 3 ideas that come back as short written answers: topologies, connections, signals and transmission. It prepares you for "list two disadvantages of …" and "explain the difference between … and …".

## What a topology is, in plain words

A topology is the shape of a network drawn as dots and lines. The slide calls it *the geometric representation of the relationship of all the links and linking devices (nodes) to one another*.

There are four shapes. In a *mesh* every device has its own cable to every other device.

In a *star* every device has one cable to a box in the middle, the *hub*. In a *bus* every device hangs off one long cable, the *backbone*.

In a *ring* every device is cabled to the two devices on either side. Traffic goes round in one direction.

```diagram
{ "type": "grid", "title": "Four topologies, n links, two disadvantages each", "nodes": [
  { "id": "h0", "label": "topology", "sub": "links for n", "row": 0, "col": 0 },
  { "id": "h1", "label": "disadvantage 1", "row": 0, "col": 1 },
  { "id": "h2", "label": "disadvantage 2", "row": 0, "col": 2 },
  { "id": "m0", "label": "mesh", "sub": "n(n − 1)/2", "row": 1, "col": 0 },
  { "id": "m1", "label": "difficult installation and reconnection", "row": 1, "col": 1 },
  { "id": "m2", "label": "wiring greater than space; expensive hardware", "row": 1, "col": 2 },
  { "id": "s0", "label": "star", "sub": "n", "row": 2, "col": 0 },
  { "id": "s1", "label": "whole topology depends on one single point", "row": 2, "col": 1 },
  { "id": "s2", "label": "more cabling than bus and ring", "row": 2, "col": 2 },
  { "id": "b0", "label": "bus", "sub": "1 backbone + n drops", "row": 3, "col": 0 },
  { "id": "b1", "label": "difficult reconnection, adding devices", "row": 3, "col": 1 },
  { "id": "b2", "label": "difficult fault isolation", "row": 3, "col": 2 },
  { "id": "r0", "label": "ring", "sub": "n", "row": 4, "col": 0 },
  { "id": "r1", "label": "unidirectional traffic", "row": 4, "col": 1 },
  { "id": "r2", "label": "a break can disable the whole network", "row": 4, "col": 2 }
], "hi": ["s1", "s2"], "caption": "A \"two disadvantages\" answer copies the two cells of one row, then adds the link count: 12 devices in a star need 12 links." }
```

## A tiny case you can do in your head

Take 4 devices. A mesh needs one cable for every pair of devices.

$$\frac{4 \times 3}{2} = \textbf{\text{6 links}}$$

A star and a ring each need **4 links**, one per device. A bus needs **1 backbone and 4 drop lines**.

The mesh number grows fastest because every new device needs a cable to every old one. That is why its disadvantages are about installation and wiring.

## The slide's example, worked

E01 exercise 1 asks: *Consider a network with 12 devices. If these devices are arranged in a mesh topology, how many cable links are needed? How about the number of links in a bus topology?*

$$\frac{n(n-1)}{2} = \frac{12 \times 11}{2} = \textbf{\text{66 links}}$$

Here n is the number of devices. The bus needs **12 drop lines and 1 backbone**. Give both parts, because the answer is not one number.

```widget
topology
{ "type": "mesh", "n": 12, "title": "E01 exercise 1: 12 devices in a mesh, then on a bus" }
```

## Connections and the direction of data, in plain words

A *point-to-point* connection is *a dedicated link between two devices*. The whole capacity of the link is reserved for those two.

A *multipoint* connection, also called multidrop, is one where *more than two devices share a single link*. They share it *spatially*, at the same time, or by *timesharing*, taking turns.

Data can also flow one way or both ways. A TV remote talks to the TV, and the TV never answers.

```diagram
{ "type": "grid", "title": "The three data-flow modes", "nodes": [
  { "id": "h0", "label": "mode", "row": 0, "col": 0 },
  { "id": "h1", "label": "direction", "row": 0, "col": 1 },
  { "id": "h2", "label": "example", "row": 0, "col": 2 },
  { "id": "a0", "label": "simplex", "row": 1, "col": 0 },
  { "id": "a1", "label": "one way only", "row": 1, "col": 1 },
  { "id": "a2", "label": "monitor", "row": 1, "col": 2 },
  { "id": "b0", "label": "half-duplex", "row": 2, "col": 0 },
  { "id": "b1", "label": "both ways, one at a time", "row": 2, "col": 1 },
  { "id": "b2", "label": "walkie-talkie", "row": 2, "col": 2 },
  { "id": "c0", "label": "full-duplex", "row": 3, "col": 0 },
  { "id": "c1", "label": "both ways at once, capacity shared", "row": 3, "col": 1 },
  { "id": "c2", "label": "telephone", "row": 3, "col": 2 }
], "hi": ["c1"], "caption": "Full-duplex sends both ways at the same time, so the two directions share the capacity of the link." }
```

## LAN, WAN and the Internet, in plain words

A *LAN* is the network inside one office, building or campus, and it is *usually privately owned*. A *WAN* spans a town, a country or the world, and it is *run by communication companies and leased*.

*The Internet*, with a capital I, is a *network of networks*. Your computer reaches it through an *access network* to the first router.

```diagram
{ "type": "flow", "dir": "tb", "title": "From the game PC to Discord", "nodes": [
  { "id": "h", "label": "End system", "sub": "the game PC" },
  { "id": "a", "label": "Access network", "sub": "to the edge router" },
  { "id": "i", "label": "Regional ISP", "sub": "provider network" },
  { "id": "bb", "label": "Backbone", "sub": "international ISP" },
  { "id": "d", "label": "End system", "sub": "Discord's servers" }
], "edges": [ { "from": "h", "to": "a" }, { "from": "a", "to": "i" }, { "from": "i", "to": "bb", "label": "peering point" }, { "from": "bb", "to": "d" } ], "hi": ["a"], "caption": "End systems sit at the edge; the access network joins one to its first router, and ISPs meet at peering points." }
```

The network bank's examples come from one game script. It posts telemetry batches to a collector PC on the home LAN, and it sends a death notice to Discord over the Internet.

```quiz
[
  {
    "type": "free",
    "q": "List two disadvantages of mesh topology and give the link count for 12 devices.",
    "model": "In a *mesh*, *every device has a dedicated point-to-point link to every other device*. Its disadvantages are *difficult installation and reconnection*, *wiring can be greater than available space*, and *expensive hardware*. The links grow as n(n − 1)/2, so 12 devices need 12 × 11/2 = 66 links.",
    "points": [
      "defines mesh: a dedicated point-to-point link to every other device",
      "difficult installation and reconnection",
      "wiring can be greater than the available space, or expensive hardware",
      "number: n(n − 1)/2 = 66 links for 12 devices"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Topologies and their link counts\". E01 question 1 asks the 66."
  },
  {
    "type": "free",
    "q": "List two disadvantages of bus topology and two of ring topology.",
    "model": "A *bus* is multipoint, *one long cable as a backbone* with drop lines and taps; its disadvantages are *difficult reconnection and adding new devices* and *difficult fault isolation*. In a *ring*, *each device has a dedicated point-to-point connection with only the two devices on either side*; its disadvantages are *unidirectional traffic* and that *a break in the ring can disable the whole network*. For 12 devices a bus needs 1 backbone and 12 drop lines, a ring 12 links.",
    "points": [
      "bus: difficult reconnection and adding new devices",
      "bus: difficult fault isolation",
      "ring: unidirectional traffic",
      "ring: a break in the ring can disable the whole network"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Topologies and their link counts\", the Bus and Ring rows."
  },
  {
    "type": "free",
    "q": "Explain the difference between a point-to-point and a multipoint connection.",
    "model": "A *point-to-point* connection is *a dedicated link between two devices*, and the whole capacity of the link is reserved for those two. A *multipoint (multidrop)* connection is one where *more than two devices share a single link*, so the capacity is shared, either *spatially shared* (used simultaneously) or *timeshared* (the devices take turns). The game PC's cable to the home router is point-to-point; the WiFi that every device in the house shares is multipoint.",
    "points": [
      "point-to-point: a dedicated link between two devices",
      "point-to-point: capacity reserved",
      "multipoint (multidrop): more than two devices share one link",
      "shared spatially (simultaneously) or timeshared (take turns)"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Data communications (01a)\", the line under the data-flow table. The sample quiz's fill-in asks the term for a dedicated link: point-to-point."
  },
  {
    "type": "free",
    "q": "Explain simplex, half-duplex and full-duplex communication, with an example of each.",
    "model": "*Simplex* is unidirectional: only one device sends (a mainframe to its monitor). *Half-duplex* is two-directional but one at a time (a walkie-talkie), and *full-duplex* is two-directional simultaneously (a telephone), where the signals going in one direction *share the capacity of the link* with the signals going the other way. The game client and the game server are full-duplex: the character's moves go up while the mob positions come down at the same time.",
    "points": [
      "simplex: one direction only",
      "half-duplex: both directions, one at a time",
      "full-duplex: both directions simultaneously",
      "full-duplex shares the link's capacity between the two directions",
      "one example each (monitor, walkie-talkie, telephone)"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Data communications (01a)\", the data-flow table. The sample quiz's true-or-false item: full-duplex shares the capacity, True."
  },
  {
    "type": "free",
    "q": "Explain the difference between a LAN and a WAN, and name the two types of WAN.",
    "model": "A *LAN* is *usually privately owned* and *connects hosts in a single office, building, or campus*, each host with a unique identifier. A *WAN* has a *wider geographical span* (town, state, country, world), interconnects switches, routers and modems, and is *created and run by communication companies and leased by an organization*; it comes as a *point-to-point WAN* (two devices) or a *switched WAN* (more than two, the backbone of global communication). The telemetry batch stays on the home LAN, while the death notice to Discord also crosses the ISP's WAN.",
    "points": [
      "LAN: usually privately owned; a single office, building or campus",
      "WAN: wider geographical span",
      "WAN: run by communication companies and leased",
      "point-to-point WAN vs switched WAN"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"LAN, WAN, the Internet\"."
  },
  {
    "type": "free",
    "q": "What is the Internet, and how are end systems and ISPs arranged in it?",
    "model": "Two or more networks that can communicate form an *internet*; *the Internet* (capital I) is the most notable one, a *network of networks*. *End systems (hosts)* sit at the edge; the *access network* connects an end system to the first (edge) router; the *core network* of routers, link-layer switches and links joins them; customer networks connect to provider networks (*national or regional ISPs*), which connect to the *backbones* (*international ISPs*) at *peering points*. The death notice leaves the game PC over the access network, crosses the ISP's core and reaches Discord's servers, another set of end systems.",
    "points": [
      "internet (small i) vs the Internet (capital I), a network of networks",
      "end systems (hosts) at the edge",
      "access network: end system to the first (edge) router",
      "core: routers, switches, links",
      "customer, provider (national or regional ISPs) and backbone (international ISPs) networks, peering points"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"LAN, WAN, the Internet\". The capital I matters: \"internet and the Internet mean the same thing\" is False."
  }
]
```

## What a signal is, in plain words

Data is what you want to send, such as a sound or a file. A signal is the electrical or radio form it takes on the wire or in the air.

*Analog* means smooth and continuous, like a voice. *Digital* means a few fixed values, like the 1s and 0s in memory.

A *periodic* signal repeats the same pattern again and again. The time for one pattern is the *period*.

You can draw a signal two ways. A *time-domain plot* shows its height against time, and a *frequency-domain plot* shows one spike for each sine wave inside it.

```diagram
{ "type": "tree", "title": "One sine wave, two plots", "nodes": [
  { "id": "s", "label": "A sine, period 30 ms", "kind": "pill" },
  { "id": "t", "label": "Time-domain plot", "sub": "a wave: amplitude vs time", "parent": "s" },
  { "id": "f", "label": "Frequency-domain plot", "sub": "one spike at 33.3 Hz", "parent": "s" }
], "hi": ["f"], "caption": "The same sine drawn against time is a wave; drawn against frequency it is one spike at f = 1/T = 33.3 Hz." }
```

The game engine ticks every 30 ms. A sine with that period has a frequency of one over the period.

$$f = \frac{1}{T} = \frac{1}{0.030\ \text{s}} = \textbf{\text{33.3 Hz}}$$

The *bandwidth* of a signal made of several sines is the highest frequency minus the lowest. With components at 100, 400, 500, 750 and 900 Hz, only the two ends matter.

$$B = 900 - 100 = \textbf{\text{800 Hz}}$$

Write *frequency-domain plot* in an answer, never "spectrum". The marker grades against the slide's term.

```quiz
[
  {
    "type": "free",
    "q": "Explain the difference between analog and digital data, and between analog and digital signals.",
    "model": "*Analog data* is continuous (sound), and *digital data* takes discrete states (1s and 0s in memory). An *analog signal* has *many levels of intensity over time*, and a *digital signal* has *a limited number of defined values*, often 0 and 1; *in data communications, we commonly use periodic analog signals and nonperiodic digital signals*. A telemetry batch is digital data that leaves the game PC as a digital signal on the LAN cable.",
    "points": [
      "analog data: continuous; digital data: discrete states",
      "analog signal: many levels of intensity over time",
      "digital signal: a limited number of defined values",
      "periodic analog and nonperiodic digital signals are the common ones"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Data and signals (02)\". The reverse sentence (nonperiodic analog, periodic digital) is a true-or-false trap."
  },
  {
    "type": "free",
    "q": "Explain the difference between a time-domain plot and a frequency-domain plot. The script's engine ticks every 30 ms: what would the frequency-domain plot of a sine with that period show?",
    "model": "A *time-domain plot* shows *amplitude versus time*, and the *phase is not explicitly shown*. A *frequency-domain plot* shows *peak amplitude versus frequency*: a simple sine is *one spike*, which makes it compact when a signal holds several sines. A sine with a period of 30 ms has f = 1/T = 1/0.030 s = 33.3 Hz, so its frequency-domain plot is one spike at 33.3 Hz with the height of its peak amplitude.",
    "points": [
      "time-domain: amplitude versus time",
      "frequency-domain: peak amplitude versus frequency",
      "a sine is one spike; compact for several sines",
      "number: f = 1/0.030 s = 33.3 Hz, one spike there"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Time and frequency domain, bandwidth\". Write *frequency-domain plot*, not \"spectrum\"."
  },
  {
    "type": "free",
    "q": "Explain the difference between a periodic and a nonperiodic signal, and define the bandwidth of a composite signal.",
    "model": "A *periodic* signal completes a pattern (a *cycle*) within a measurable time, the *period*, and repeats it; a *nonperiodic (aperiodic)* signal does not repeat. By *Fourier analysis* a composite *periodic* signal holds *discrete* frequencies, while a composite *nonperiodic* signal holds an *infinite number of sines with continuous frequencies*. The *bandwidth* is the highest minus the lowest frequency: components at 100, 400, 500, 750 and 900 Hz give B = 900 − 100 = 800 Hz.",
    "points": [
      "periodic: repeats a pattern every period",
      "nonperiodic: no repeating pattern",
      "composite periodic: discrete frequencies; nonperiodic: continuous",
      "bandwidth = f_high − f_low, with a number"
    ],
    "rows": 4,
    "explain": "Sheet side 1, \"Data and signals (02)\" and \"Time and frequency domain, bandwidth\" (E02-3 is the 800 Hz)."
  }
]
```

## Baseband and broadband, in plain words

A digital signal can go on the wire as it is. That is *baseband transmission*, and it needs a *low-pass channel*, one whose frequencies start at zero.

Or the digital signal can first be turned into an analog wave. That is *broadband transmission*, and it needs a *bandpass channel* and a *modem*.

```diagram
{ "type": "grid", "title": "Baseband against broadband", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "baseband", "row": 0, "col": 1 },
  { "id": "h2", "label": "broadband", "row": 0, "col": 2 },
  { "id": "a0", "label": "the signal", "row": 1, "col": 0 },
  { "id": "a1", "label": "sent as digital", "row": 1, "col": 1 },
  { "id": "a2", "label": "changed to analog", "row": 1, "col": 2 },
  { "id": "b0", "label": "the channel", "row": 2, "col": 0 },
  { "id": "b1", "label": "low-pass, starts at zero", "row": 2, "col": 1 },
  { "id": "b2", "label": "bandpass, two limits", "row": 2, "col": 2 },
  { "id": "c0", "label": "example", "row": 3, "col": 0 },
  { "id": "c1", "label": "wired LAN", "row": 3, "col": 1 },
  { "id": "c2", "label": "telephone line, 0 to 4 kHz", "row": 3, "col": 2 }
], "hi": ["b1", "b2"], "caption": "The channel decides it: a channel that starts at zero takes the digital signal as it is; one that does not needs a modem." }
```

## Impairments, in plain words

No cable is perfect, so the signal that arrives is not the signal that left. The slide names three causes.

*Attenuation* is the signal getting weaker with distance. *Distortion* is the signal changing shape, because its sine waves arrive at different times.

*Noise* is unwanted signal added on the way. The slide names four kinds.

```diagram
{ "type": "tree", "title": "Transmission impairment", "nodes": [
  { "id": "i", "label": "Impairment" },
  { "id": "a", "label": "Attenuation", "sub": "loss of energy", "parent": "i" },
  { "id": "d", "label": "Distortion", "sub": "form changes", "parent": "i" },
  { "id": "n", "label": "Noise", "sub": "unwanted signal", "parent": "i" },
  { "id": "n1", "label": "thermal", "sub": "electrons", "parent": "n" },
  { "id": "n2", "label": "induced", "sub": "motors", "parent": "n" },
  { "id": "n3", "label": "crosstalk", "sub": "wire on wire", "parent": "n" },
  { "id": "n4", "label": "impulse", "sub": "a spike", "parent": "n" }
], "hi": ["n3"], "caption": "Three causes, and noise has four types: crosstalk is one wire on another, induced comes from motors and appliances." }
```

A loss is written as a negative number of decibels. Half the power is a loss of about 3 dB.

$$10 \log_{10} 0.5 \approx \textbf{\text{−3 dB}}$$

## SNR, Nyquist and Shannon, in plain words

*SNR* is the signal-to-noise ratio: how strong the signal is compared with the noise. Bring both powers to the same unit before you divide.

$$\text{SNR} = \frac{10\ \text{mW}}{1\ \mu\text{W}} = \frac{10\,000\ \mu\text{W}}{1\ \mu\text{W}} = \textbf{\text{10 000}}$$

$$\text{SNR}_{\text{dB}} = 10 \log_{10} 10\,000 = \textbf{\text{40 dB}}$$

Two formulas give the fastest possible bit rate. *Nyquist* is for a noiseless channel and counts signal *levels*, the distinct voltages a signal can take.

*Shannon* is for a real, noisy channel and uses the SNR instead. Nyquist has a factor of 2, and Shannon does not.

The slide's Example 2 uses both on a 1 MHz channel with SNR 63. Shannon gives the ceiling first.

$$C = 1\,000\,000 \times \log_2 (1 + 63) = \textbf{\text{6 Mbps}}$$

Then Nyquist says how many levels reach that rate.

$$6\,000\,000 = 2 \times 1\,000\,000 \times \log_2 L$$

$$\log_2 L = \frac{6\,000\,000}{2\,000\,000} = 3$$

$$L = 2^{3} = \textbf{\text{8 levels}}$$

## Parallel and serial, in plain words

*Parallel* transmission sends a group of bits side by side, one wire per bit. *Serial* transmission sends them one after another on a single wire.

Eight wires deliver 8 bits in one tick, and one wire takes 8 ticks. So parallel wins on *speed* and loses on *cost*.

```quiz
[
  {
    "type": "free",
    "q": "Explain the difference between baseband and broadband transmission, with the channel each one needs.",
    "model": "In *baseband transmission* the digital signal is sent *without changing it to an analog signal*, which needs a *low-pass channel* (lowest frequency zero, with an upper bound). In *broadband transmission (modulation)* the digital signal is *changed to an analog signal*, which needs a *bandpass channel* (between two frequency limits, not starting from zero) and a *modem*; *low-pass channels are less common in real life*. The telemetry batch crosses the wired LAN in baseband, while a telephone subscriber line (0 to 4 kHz) carrying computer data is broadband.",
    "points": [
      "baseband: sent without changing to analog",
      "baseband needs a low-pass channel (starts at zero)",
      "broadband: changed to analog, a bandpass channel",
      "a modem; low-pass channels are less common",
      "example: wired LAN vs telephone line"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Baseband and broadband (03, nonperiodic digital signals)\"."
  },
  {
    "type": "free",
    "q": "Name and define the three causes of transmission impairment, and name the four types of noise.",
    "model": "*The imperfection of transmission media causes signal impairment*: *attenuation* is the *loss of energy to overcome the resistance of the medium* (an *amplifier* compensates), *distortion* means *the signal changes its form or shape* because the components of a composite signal arrive with different phases, and *noise* adds unwanted signal. The four noise types are *thermal* (random motion of electrons in a wire), *induced* (motors and appliances), *crosstalk* (the effect of one wire on the other) and *impulse* (a spike, high energy in a very short time). Halving the power is an attenuation of 10 log₁₀ 0.5 = −3 dB.",
    "points": [
      "attenuation: loss of energy to overcome the medium's resistance; amplifier",
      "distortion: the signal changes form or shape; components arrive with different phases",
      "noise named as the third cause",
      "four noise types: thermal, induced, crosstalk, impulse",
      "number: half the power = −3 dB (negative = loss)"
    ],
    "rows": 5,
    "explain": "Sheet side 2, \"Impairment: attenuation, distortion, noise\" and \"Decibel and SNR\". Crosstalk is wire on wire; motors and appliances are induced."
  },
  {
    "type": "free",
    "q": "Explain the difference between the Nyquist bit rate and the Shannon capacity, and how the two are used together.",
    "model": "The *Nyquist* formula, BitRate = 2 × bandwidth × log₂ L, gives the *theoretical maximum bit rate* of a *noiseless* channel from the number of signal levels L. The *Shannon capacity*, C = bandwidth × log₂(1 + SNR), gives the theoretical highest data rate of a *noisy* channel from the SNR as a ratio, with no L and no factor 2: *the Shannon capacity gives us the upper limit; the Nyquist formula tells us how many signal levels we need*. A 1 MHz channel with SNR 63 gives C = 1 000 000 × log₂(1 + 63) = 6 Mbps, and 6 000 000 = 2 × 1 000 000 × log₂ L gives L = 8.",
    "points": [
      "Nyquist: noiseless, uses L levels, has the factor 2",
      "Shannon: noisy, uses SNR as a ratio, no 2",
      "Shannon gives the upper limit",
      "Nyquist tells how many signal levels we need",
      "number: 1 MHz, SNR 63 → 6 Mbps → L = 8"
    ],
    "rows": 5,
    "explain": "Sheet side 2, \"Data rate limits: bandwidth, levels, noise\" (Ex 2). The review list's NOTE: the factor of 2 is in Nyquist only."
  },
  {
    "type": "free",
    "q": "What is the SNR, why does it use average powers, and what does a high or a low value mean?",
    "model": "*SNR = average signal power / average noise power*, *the ratio of what is wanted (signal) to what is not wanted (noise)*. It uses averages because the powers *may change with time*, and it is needed to find the theoretical bit rate limit; a high SNR means the signal is less corrupted by noise, a low SNR more corrupted. A 10 mW signal over 1 μW of noise gives SNR = 10 000 μW / 1 μW = 10 000, which is 10 log₁₀ 10 000 = 40 dB.",
    "points": [
      "SNR = average signal power / average noise power",
      "averages because the powers change with time",
      "high SNR: less corrupted; low: more corrupted",
      "number: 10 mW / 1 μW = 10 000 = 40 dB"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Decibel and SNR\". Convert mW and μW to one unit before dividing."
  },
  {
    "type": "free",
    "q": "Explain the difference between parallel and serial transmission, with the advantage and disadvantage of parallel.",
    "model": "In *parallel* transmission n bits are *sent together* on n lines, which *can increase the transfer speed by a factor of n over serial*. In *serial* transmission the bits are sent one after another on *only one line*, which *reduces the cost of transmission over parallel by roughly a factor of n*; a *parallel/serial converter* sits at the sender and a *serial/parallel converter* at the receiver. Parallel's advantage is *speed* and its disadvantage *cost*: 8 bits take one tick on eight lines but eight ticks on one, and USB, the *Universal Serial Bus*, is serial.",
    "points": [
      "parallel: n bits together on n lines, speed up by a factor of n",
      "serial: one bit after another on one line, cost down by roughly n",
      "converters: parallel/serial at the sender, serial/parallel at the receiver",
      "parallel: advantage speed, disadvantage cost",
      "example: 8 bits in 1 tick vs 8 ticks, or USB is serial"
    ],
    "rows": 4,
    "explain": "Sheet side 2, \"Bandwidth, delay and transmission modes\", the Parallel and Serial lines."
  }
]
```

## Remember

- A "two disadvantages" answer is one row of the topology table plus the link count.
- Write *frequency-domain plot*, never "spectrum". Crosstalk is wire on wire.
- Nyquist is noiseless and has the 2. Shannon is noisy and has no 2.
- *On the sheet:* *Sheet side 1, "Topologies and their link counts"* and *Sheet side 2, "Baseband and broadband (03, nonperiodic digital signals)"*.

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "two disadvantages of … topology" | the two slide phrases from that row | links: n, or n(n − 1)/2 | 12 devices in a mesh = 66 |
| "difference between baseband and broadband" | as it is on low-pass, or changed to analog on bandpass | the channel | a modem only in broadband |
| "Nyquist against Shannon" | 2 × B × log₂ L, and B × log₂(1 + SNR) | bps | the 2 only in Nyquist |
