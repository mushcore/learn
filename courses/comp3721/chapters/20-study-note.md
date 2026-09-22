---
title: Your one-page study note
minutes: 20
---

The instructor allows **one A4 or letter page, single-sided, preferably hand-written**, plus a calculator, in every quiz (the back may be used for rough work). This page is the draft of that sheet: no explanations, only the facts, tables and formulas in the slides' own words. Copy it by hand; writing it out is itself the best revision you will do. Quiz 1 needs only the 01a block.

## 01a: Data communications

| Term | Slide definition |
|---|---|
| Communication | exchange of information |
| Telecommunication | communication at a distance (telephony, telegraphy, television) |
| Data | raw facts or information in a form agreed upon by sender and receiver (text, numbers, images, audio, video) |
| Data communications | exchange of data between two devices via some form of transmission medium |
| Data communications system | network of hardware and software enabling exchange of data between devices over various transmission mediums |
| Digital communication | uses digital signals; all messages represented and transmitted as **bits** |
| Analog communication | continuous signals varying in amplitude, frequency, or phase |
| Media | wire (electrically conductive), fibre optic (light), air/space (radio / electromagnetic waves) |
| Effectiveness (4) | **Delivery** (correct destination), **Accuracy**, **Timeliness**, **Jitter** (uneven delay of audio/video packets) |
| Benefits (4) | real-time data sharing and analysis, enhanced connectivity, cost saving, expanded social engagement |

**Five components:** message (text, numbers, pictures, audio, video); sender (computer, workstation, handset, video camera); receiver (computer, workstation, handset, television); transmission medium (twisted-pair, coaxial, fibre-optic, air) = physical path; protocol = set of rules that govern data communications, an agreement between the devices.

| Data flow | Direction | Example |
|---|---|---|
| Simplex | one way only | mainframe to monitor, TV |
| Half-duplex | both ways, one at a time | walkie-talkie |
| Full-duplex | both ways simultaneously; capacity of the link shared between directions | telephone |

**Network:** interconnected nodes (stations) using links (edges, railways). Devices = hosts / end systems (computer, laptop, workstation, cell phone) or connecting devices (router, switch, modem). Edges = wired or wireless media.

**Criteria (3):** Performance = throughput + delay; Reliability = accuracy of delivery, failure rate, recovery time, robustness; Security = protect from unauthorized access/damage, recovery policies.

**Connection type:** point-to-point = dedicated link, capacity reserved (wire, microwave, satellite; TV remote). Multipoint (multidrop) = more than two devices share one link: spatially shared (simultaneous) or timeshared (take turns).

**Topology** = geometric representation of the relationship of all links and linking devices (nodes).

| Topology | Definition | Links for n | Advantages | Disadvantages |
|---|---|---|---|---|
| Mesh | dedicated point-to-point link to every other device | $\frac{n(n-1)}{2}$ | own data load per link; robust; privacy and security; easy fault identification and isolation | difficult installation and reconnection; wiring greater than space; expensive hardware |
| Star | dedicated point-to-point link only to a central controller (hub) | $n$ | cheaper than mesh; easy installation and reconfiguration; less cabling; robust; easy fault identification and isolation | whole topology depends on one single point; more cabling than bus and ring |
| Bus | multipoint; one backbone cable, drop lines and taps; limits on number of taps and distance between taps | 1 backbone + $n$ drop lines | easy installation; less cabling than mesh and star | difficult reconnection and adding devices; difficult fault isolation |
| Ring | dedicated point-to-point connection to the two neighbours; a repeater per device | $n$ | easy installation and reconfiguration; easy fault isolation | unidirectional traffic; a break disables the whole network |

| LAN | WAN |
|---|---|
| usually privately owned; single office, building or campus; limited size; each host has a unique identifier; WLAN if wireless | wider span: town, state, country, world; interconnects switches, routers, modems; created and run by communication companies, leased by the organization; point-to-point WAN (two devices) or switched WAN (more than two; backbone of global communication) |

- Two or more connected networks = **internetwork**. **internet** (small i) = two or more networks that can communicate; **the Internet** (capital I) = the most notable internet, thousands of networks.
- History: Oct 29 1969, 10:30 pm, UCLA, "LO" (Charley Kline, Leonard Kleinrock); ARPANET (DoD), design goal **survivability**; 1990 WWW (Sir Tim Berners-Lee); 1993 Mosaic (then Netscape, Mozilla, Firefox).
- **End systems / hosts** at the edge run applications. **Access network** connects an end system to the first (edge) router. **Core network** = routers, link-layer switches and links. Customer networks, provider networks (ISPs), backbones, joined at peering points.
- Access: telephone (dial-up; DSL = voice and data simultaneously), cable, wireless, direct.
- **Internet standard** = thoroughly tested specification and formalized regulation; made by **IETF**; purpose **interoperability**. **RFC** = Request for Comment: numbered, technical, detailed; RFC-1 in 1969.

## 01b / 01c: Layering, TCP/IP, devices

- Protocol (01b) = what, how and when: format and order of messages, and actions on transmission/receipt.
- Principles: (1) two opposite tasks per layer for bidirectional communication; (2) the two objects under each layer at both sites identical.
- Service model = services a layer offers to the layer above; each layer uses the layer directly below.
- Advantages: separate services from implementation; simpler, cheaper intermediate systems; modularity (black box).
- Protocol suite (stack) = protocols organized in layers, designed to work together. TCP/IP = 5 layers (the Internet); OSI = 7 layers (ISO).

| Layer | Job | PDU | Protocols | Address | Implemented in |
|---|---|---|---|---|---|
| 5 Application | communication between end systems for a network application | message | IMAP, SMTP, HTTP, FTP, Telnet, DNS | names (URLs, email) | software, end systems |
| 4 Transport | process-to-process delivery of the entire message | segment / user datagram | TCP, UDP, SCTP | port numbers (identify a process) | software, end systems |
| 3 Network | host-to-host routing of datagrams; "IP layer" | datagram / packet | IP, ICMP, DHCP, ARP, routing | logical (IP): unique host on the Internet | hosts and routers |
| 2 Data link | transfer between neighbouring nodes, without errors | frame | Ethernet, 802.11 (WiFi) | link-layer (MAC): host or router in a LAN/WAN | NIC |
| 1 Physical | bits of the frame to signals on the medium; link dependent | bits | medium dependent | none | NIC |

- OSI extras: L6 Presentation (interpret meaning: compression, encryption), L5 Session (session management, synchronization); both inside TCP/IP application layer.
- Encapsulation: $M \to H_T\,M \to H_N\,H_T\,M \to H_L\,H_N\,H_T\,M \to$ bits. Decapsulation reverses it.
- Hosts run 5 layers; **switch** runs 2 (data link, physical); **router** runs 3 (network, data link, physical). Router strips $H_L$, reads $H_N$, adds a new $H_L$.
- Ethernet frame: preamble 8 B, SFD, dest MAC 6, source MAC 6, type 2 (0x0800 IPv4, 0x0806 ARP, 0x86DD IPv6), payload 46–1500, CRC 4; 64–1522 B.
- Hub: physical layer; multiport repeater; repeats to all ports except the incoming one. Switch: physical + data link; regenerates signal; reads MAC addresses; **filtering** chooses the port. Router: physical + data link + network; **internetworking device**; two networks joined by a router = an internet. Modem changes the form of data.
- Router vs repeater/switch: (1) MAC and IP address per interface; (2) acts only on packets whose link-layer destination matches the arriving interface; (3) changes link-layer source and destination addresses when forwarding.
- New LAN technology changes only data link + physical.

## Lecture 02: Data and signals

- Exchanged: data; through the physical layer: signals. Application to data-link communication is logical; physical is physical.
- Analog data continuous (sound); digital data discrete (1s and 0s). Analog signal: many intensity levels; digital signal: limited defined values.
- Periodic (cycle, period T) vs nonperiodic. Data comm uses **periodic analog** and **nonperiodic digital** signals.
- Simple sine cannot be decomposed; composite = many sines (Fourier). Periodic composite: discrete frequencies (harmonics $f$, $3f$, $9f$; $f$ = fundamental = first harmonic). Nonperiodic composite: infinite sines, continuous frequencies (voice 0–4 kHz, AM/FM).
- Single sine wave carries no information (buzz). Time domain: amplitude vs time, phase hidden. Frequency domain: peak amplitude vs frequency; one sine = one spike.
- Frequency = rate of change: no change $f = 0$ (battery 1.5 V); instantaneous change $f = \infty$ ($T = 0$). Frequency independent of medium; wavelength depends on frequency and medium. $c = 3 \times 10^{8}$ m/s in vacuum, lower in air, lower in cable.
- Digital signals: mostly nonperiodic, so use bit rate (bps). Levels: binary 2, octal 8, hexadecimal 16. A digital signal is a composite analog signal with infinite bandwidth (periodic: discrete; nonperiodic: continuous).

| Parameter | Meaning | Unit |
|---|---|---|
| Peak amplitude $A$ | highest intensity; proportional to energy | V |
| Frequency $f$ | completed cycles in 1 s | Hz |
| Period $T$ | time for one cycle | s |
| Phase $\phi$ | position of waveform relative to time 0 | ° or rad |
| Wavelength $\lambda$ | distance travelled in one period (light in fibre) | μm |
| Bandwidth $B$ | highest minus lowest frequency | Hz |

| ms | μs | ns | ps | kHz | MHz | GHz | THz |
|---|---|---|---|---|---|---|---|
| $10^{-3}$ s | $10^{-6}$ s | $10^{-9}$ s | $10^{-12}$ s | $10^{3}$ Hz | $10^{6}$ Hz | $10^{9}$ Hz | $10^{12}$ Hz |

**Formulas**

$$T = \frac{1}{f} \qquad f = \frac{1}{T}$$

$$s(t) = A\sin(2\pi f t + \phi) = A\sin\left(\frac{2\pi}{T} t + \phi\right) \qquad \omega = 2\pi f$$

$$+\phi \text{ shifts left by } \phi/\omega \qquad -\phi \text{ shifts right by } \phi/\omega \qquad \phi = \text{fraction of cycle} \times 360°$$

$$360° = 2\pi \text{ rad} \qquad 1° = \frac{2\pi}{360} \text{ rad} \qquad 1 \text{ rad} = \frac{360}{2\pi}°$$

$$\lambda = \frac{c}{f} = c \cdot T$$

$$B = f_h - f_l \qquad \text{middle} = \frac{f_h + f_l}{2} \qquad f_h + f_l = 2 \times \text{middle}$$

$$\text{bit duration} = \frac{1}{\text{bit rate}} \qquad \text{bit length} = \text{propagation speed} \times \text{bit duration}$$

$$\text{bits per level} = ⌈\log_{2} L⌉ \qquad ⌈3.1416⌉ = 4, \; ⌊3.1416⌋ = 3$$

$$\text{bit rate} = \frac{\text{pages}}{\text{s}} \times \frac{\text{lines}}{\text{page}} \times \frac{\text{chars}}{\text{line}} \times \frac{\text{bits}}{\text{char}} \qquad \text{time} = \text{bits} \times \frac{\text{s}}{\text{bit}}$$

| Worked number | Result |
|---|---|
| 60 Hz mains, period | $1/60 = 0.0167$ s $= 16.7$ ms; peak $120\sqrt{2} \approx 170$ V |
| $T = 200$ μs | $f = 1/(200 \times 10^{-6}) = 5000$ Hz $= 5$ kHz |
| $5\sin(20\pi t)$ | $A = 5$ V, $f = 10$ Hz, $T = 0.1$ s |
| $\sin(10t)$ | $A = 1$ V, $f = 10/(2\pi) = 1.59$ Hz, $T = 0.628$ s |
| offset 1/9 cycle | $\phi = 40° = 2\pi/9 = 0.698$ rad |
| red light $4 \times 10^{14}$ Hz | $\lambda = 3 \times 10^{8} / 4 \times 10^{14} = 0.75$ μm |
| 1 Mbps at $2 \times 10^{8}$ m/s | bit duration 1 μs; bit length 200 m |
| 4 levels; 11 levels | 2 bits; $\log_{2} 11 = 3.46 \to 4$ bits |
| 100 pages/s, 24 × 80 × 8 | 1 536 000 bps $= 1.536$ Mbps (200 pages/s: 3.072 Mbps) |
| 1000 bps: 10 bits; 100 000 chars | 0.01 s; 800 s |
| $B = 200$ kHz, middle 140 kHz | $f_l = 40$ kHz, $f_h = 240$ kHz |
| $f_h = 400$ MHz, middle 300 MHz | $f_l = 200$ MHz, $B = 200$ MHz |
| 100, 400, 500, 750, 900 Hz | $B = 800$ Hz |
| 12 devices | mesh 66 links; bus 12 drop lines + 1 backbone |

## From memory

Close the page and answer these; anything you miss goes on the sheet in larger writing.

```quiz
[
  {
    "q": "A sine wave has $f = 250$ Hz. What is its period, in ms?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.05,
    "unit": "ms",
    "explain": "$T = 1/f = 1/250 = 0.004$ s $= 4$ ms."
  },
  {
    "q": "Which formula gives the wavelength of a signal?",
    "options": ["$\\lambda = c / f$", "$\\lambda = c \\times f$", "$\\lambda = f / c$", "$\\lambda = 1 / f$"],
    "answer": 0,
    "explain": "$\\lambda = c/f = c \\cdot T$: the distance the signal travels in one period. $1/f$ is the period, not the wavelength."
  },
  {
    "q": "Fill in the blank: the bandwidth of a composite signal is the highest frequency minus the ________ frequency.",
    "type": "text",
    "answer": ["lowest", "lowest frequency", "minimum"],
    "explain": "$B = f_h - f_l$. Given the middle frequency instead, use $f_h + f_l = 2 \\times$ middle."
  },
  {
    "q": "A digital signal uses 32 levels. How many bits per level?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.5,
    "unit": "bits",
    "explain": "$\\log_{2} 32 = 5$ exactly, so no rounding is needed. For a non-power of 2, round up with the ceiling."
  },
  {
    "q": "Fill in the blank: the PDU of the network layer is called a ________.",
    "type": "text",
    "answer": ["datagram", "packet", "datagram/packet", "datagram or packet"],
    "explain": "Datagram (or packet). Message at the application layer, segment or user datagram at transport, frame at data link, bits at physical."
  },
  {
    "q": "Fill in the blank: the layer whose addresses are port numbers is the ________ layer.",
    "type": "text",
    "answer": ["transport", "transport layer"],
    "explain": "Port numbers identify a process on a host: transport layer. Names are application, logical (IP) addresses are network, link-layer (MAC) addresses are data link."
  },
  {
    "q": "A mesh topology with 7 devices needs how many links?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0.5,
    "unit": "links",
    "explain": "$\\frac{7 \\times 6}{2} = 21$."
  },
  {
    "q": "The quiz study note may be written on both sides of the page.",
    "type": "tf",
    "answer": false,
    "explain": "Single-sided only, preferably hand-written; the back of the page is for rough work during the quiz. Bring a calculator, and keep the note afterwards for revision."
  }
]
```
