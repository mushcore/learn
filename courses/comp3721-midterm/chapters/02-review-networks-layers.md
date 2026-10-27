---
title: "Review items 1 to 3: networks, layering, signals"
minutes: 20
---

Review items 1 to 3 are Weeks 1 and 2: the data communications system, networks and topologies, the layer model, and the sine wave and its plots. Each point below starts with a question to answer cold, then the facts in the slides' words, then the lesson that teaches it.

## 1a. A data communications system has five components and four effectiveness characteristics

Recall first.

```quiz
[
  {
    "q": "Which are the four fundamental characteristics the effectiveness of a data communications system depends on? Select all that apply.",
    "options": ["Delivery", "Accuracy", "Timeliness", "Jitter", "Performance", "Reliability"],
    "answer": [0, 1, 2, 3],
    "explain": "Delivery (to the correct destination), accuracy, timeliness and jitter (uneven delay in the delivery of audio or video packets). Performance, reliability and security are the three criteria of a **network**, a different list."
  }
]
```

- Data communications: the exchange of data between two devices *via some form of transmission medium*.
- Data communications system: *a network of hardware and software* that enables the exchange of data between devices over various transmission mediums.
- Five components: message, sender, receiver, transmission medium, protocol (*a set of rules that govern data communications*).
- Effectiveness: delivery, accuracy, timeliness, jitter.

Lesson: [Data communications](#/comp3721-w1/data-communications), [components and data flow](#/comp3721-w1/components-data-flow).

## 1b. Simplex is one way, half-duplex one at a time, full-duplex both at once

Recall first.

```quiz
[
  {
    "q": "A walkie-talkie lets both people talk, but only one at a time. Which communication mode is it?",
    "options": ["Half-duplex", "Simplex", "Full-duplex", "Multipoint"],
    "answer": 0,
    "explain": "Half-duplex: two-directional, one at a time. Simplex is unidirectional (mainframe to monitor); full-duplex is two-directional simultaneously (telephone). Multipoint is a type of connection, not a mode."
  }
]
```

| Mode | Direction | Slide example |
|---|---|---|
| Simplex | unidirectional | mainframe → monitor |
| Half-duplex | two-directional, one at a time | walkie-talkie |
| Full-duplex | two-directional, simultaneously; the link's capacity is shared between the directions | telephone |

Lesson: [Components and data flow](#/comp3721-w1/components-data-flow).

## 1c. LAN, WAN, internet and Internet; point-to-point and multipoint

Recall first.

```quiz
[
  {
    "q": "Name the type of WAN that connects more than two communication devices and is used in the backbone of global communication today. (Two words.)",
    "type": "text",
    "answer": ["switched WAN", "switched"],
    "explain": "A switched WAN. A point-to-point WAN connects only two communication devices."
  },
  {
    "q": "Fill in the blank: in a ________ connection, more than two devices share a single link.",
    "type": "text",
    "answer": ["multipoint", "multidrop", "multipoint (multidrop)"],
    "explain": "Multipoint (multidrop). The capacity is shared spatially (at the same time) or by timesharing (taking turns). A point-to-point connection is a dedicated link between two devices."
  }
]
```

- LAN: usually privately owned; connects hosts in a *single office, building, or campus*.
- WAN: a wider geographical span; interconnects *switches, routers, and modems*; *created and run by communication companies*. Two types: point-to-point WAN and switched WAN.
- An internet (lower-case i): *two or more networks that can communicate with each other*. The Internet: the most notable internet, *thousands of interconnected networks*.
- Point-to-point: *A dedicated link between two devices.* Multipoint: *More than two devices share a single link.*

Lesson: [Networks](#/comp3721-w1/networks), [LAN, WAN and the Internet](#/comp3721-w1/lan-wan-internet).

## 1d. Mesh needs n(n − 1)/2 links, star n, bus one backbone and n drop lines

Recall first.

```quiz
[
  {
    "q": "Nine devices are joined in a full mesh. How many links are needed?",
    "type": "numeric",
    "answer": 36,
    "tolerance": 0,
    "unit": "links",
    "explain": "Every device has a dedicated point-to-point link to every other: $n(n - 1)/2 = 9 \\times 8 / 2 = 36$ links. A star of nine needs 9; a bus needs 1 backbone and 9 drop lines."
  }
]
```

| Topology | Links for n devices | Advantages | Disadvantages |
|---|---|---|---|
| Mesh | n(n − 1)/2 | each link carries its own data load; robustness; privacy and security; easy fault identification and isolation | difficult installation and reconnection; wiring can exceed the space; expensive hardware |
| Star | n | less expensive than mesh; easy installation and reconfiguration; less cabling; robustness; easy fault isolation | the whole topology depends on one single point (the hub); more cabling than bus and ring |
| Bus | 1 backbone + n drop lines | easy installation; less cabling than mesh and star | difficult reconnection and adding devices; difficult fault isolation |
| Ring | n | easy installation and reconfiguration; easy fault isolation | unidirectional traffic; a break in the ring can disable the whole network |

```widget
topology
{ "type": "mesh", "n": 9, "title": "Nine devices: switch between mesh, star, bus and ring" }
```

Lesson: [Topologies](#/comp3721-w1/topologies).

## 1e. The Internet: edge, access network, core, ISPs, IETF and RFCs

Recall first.

```quiz
[
  {
    "q": "Which part of the Internet physically connects an end system to the first router (the edge router)?",
    "options": ["The access network", "The core network", "A peering point", "A backbone ISP"],
    "answer": 0,
    "explain": "The access network *physically connects an end system to the first router*. The core is the *routers, link-layer switches, and links* that interconnect end systems; peering points join the provider networks and backbones."
  }
]
```

- Hosts (end systems) sit at the edge and run applications; the access network connects them to the edge router; the core interconnects them.
- Customer networks connect to provider networks (national and regional ISPs), which connect to backbones (international ISPs) at peering points.
- Access: telephone networks (dial-up, DSL, used *simultaneously for both voice and data communication*), cable networks, wireless networks, direct connection.
- An Internet standard is *a thoroughly tested specification and a formalized regulation that must be followed by those who work with the Internet*; the IETF creates and publishes them, as numbered RFCs (Request for Comment). Standards give interoperability.
- History: first message *October 29, 1969, 10:30 pm*, "LO" from UCLA; ARPANET's main design goal survivability.

Lesson: [LAN, WAN and the Internet](#/comp3721-w1/lan-wan-internet).

## 2a. Layering splits one complex task into smaller, simpler ones

Recall first.

```quiz
[
  {
    "q": "Which are advantages of protocol layering on the slides? Select all that apply.",
    "options": ["Separating services from implementation", "Simpler and less expensive intermediate systems", "Modularity: a change in one layer is transparent to the rest", "Every layer can use any other layer's header", "Fewer protocols are needed in total"],
    "answer": [0, 1, 2],
    "explain": "The three advantages: separating services from implementation; simpler, less expensive intermediate systems (a router runs only three layers); modularity, so a change inside one layer does not touch the others."
  }
]
```

- A protocol defines what is communicated, how and when: the format and order of messages and the actions taken on sending and receiving.
- First principle: for bidirectional communication each layer performs two opposite tasks. Second principle: the two objects under each layer at both sites are identical.
- The service model of a layer is the set of services it offers to the layer above.

Lesson: [Why layers](#/comp3721-w1/why-layers).

## 2b. TCP/IP has five layers, OSI seven

Recall first.

```quiz
[
  {
    "q": "Which two OSI layers does TCP/IP fold into its application layer?",
    "options": ["Presentation and session", "Session and transport", "Presentation and network", "Data link and physical"],
    "answer": 0,
    "explain": "Presentation (interpreting the data: compression, encryption) and session (session management, synchronization) are folded into TCP/IP's application layer, so OSI's seven layers become five."
  }
]
```

- TCP/IP protocol suite: five layers, the suite used in the Internet today. OSI model: seven layers, an ISO standard.
- OSI top to bottom: application, presentation, session, transport, network, data link, physical.

Lesson: [TCP/IP and OSI](#/comp3721-w1/tcpip-osi).

## 2c. Each layer's responsibility

Recall first.

```quiz
[
  {
    "q": "Which layer is responsible for host-to-host delivery, routing datagrams from the source to the destination?",
    "options": ["Network", "Transport", "Data link", "Physical"],
    "answer": 0,
    "explain": "The network layer routes datagrams from source to destination (host-to-host). Transport is process-to-process; data link is node-to-node between neighbours; physical carries individual bits."
  }
]
```

- Physical: carries individual bits across the link; bits from the frame are transformed to signals.
- Data link: data transfer between neighbouring network elements, without errors; its services are framing, flow control, error control and congestion control.
- Network: routing of datagrams from source to destination (host-to-host).
- Transport: logical communication between application processes on different hosts (process-to-process).
- Application: communication between end systems for a network application.

Lesson: [TCP/IP and OSI](#/comp3721-w1/tcpip-osi), [data-link services](#/comp3721-w6/data-link-services).

## 2d. Four levels of address, none at the physical layer

Recall first.

```quiz
[
  {
    "q": "Which address does the transport layer use to identify a process on a host?",
    "options": ["A port number", "An IP address", "A MAC address", "A URL"],
    "answer": 0,
    "explain": "Port numbers identify a process on a host. IP (logical) addresses are the network layer's, MAC (link-layer) addresses the data-link layer's, and names such as URLs the application layer's."
  }
]
```

Application: names (URLs, email addresses). Transport: port numbers. Network: logical (IP) addresses. Data link: link-layer (MAC) addresses. Physical: none.

Lesson: [Encapsulation and addressing](#/comp3721-w1/encapsulation-addressing).

## 2e. The packet's name at each layer

Recall first.

```quiz
[
  {
    "q": "What is the PDU of the data-link layer called?",
    "type": "text",
    "answer": ["frame", "a frame"],
    "explain": "A frame. Top to bottom: message, segment / user datagram, datagram / packet, frame, bits."
  }
]
```

Message (application), segment or user datagram (transport), datagram or packet (network), frame (data link), bits (physical).

Lesson: [TCP/IP and OSI](#/comp3721-w1/tcpip-osi).

## 2f. Example protocols at each layer

Recall first.

```quiz
[
  {
    "q": "ARP is defined in which layer?",
    "options": ["Network", "Data link", "Transport", "Application"],
    "answer": 0,
    "explain": "The network layer: IP, ICMP, DHCP, ARP and the routing protocols. ARP is one of the network layer's auxiliary protocols even though it finds link-layer addresses."
  }
]
```

Application: IMAP, SMTP, HTTP, FTP, Telnet, DNS. Transport: TCP, UDP, SCTP. Network: IP, ICMP, DHCP, ARP, routing protocols. Data link: Ethernet, 802.11 (WiFi). Physical: link dependent (rely on the medium).

Lesson: [TCP/IP and OSI](#/comp3721-w1/tcpip-osi).

## The full layer table, items 2c to 2f in one place

| Layer | Job | PDU | Address | Protocols | Runs in |
|---|---|---|---|---|---|
| 5 Application | network applications between end systems | message | names | HTTP, SMTP, IMAP, FTP, Telnet, DNS | hosts |
| 4 Transport | process-to-process | segment / user datagram | port numbers | TCP, UDP, SCTP | hosts |
| 3 Network | host-to-host routing of datagrams | datagram / packet | IP (logical) | IP, ICMP, DHCP, ARP | hosts, routers |
| 2 Data link | node-to-node, without errors | frame | MAC (link-layer) | Ethernet, 802.11 | hosts, routers, switches |
| 1 Physical | bits to signals across the link | bits | none | link dependent | hosts, routers, switches, hubs |

Cover the table and match each row's cells to the layer.

```quiz
[
  {
    "q": "Match each layer to the address it uses.",
    "type": "match",
    "pairs": [
      ["Application", "names (URLs, email addresses)"],
      ["Transport", "port numbers"],
      ["Network", "logical (IP) addresses"],
      ["Data link", "link-layer (MAC) addresses"],
      ["Physical", "no address"]
    ],
    "explain": "Four levels of address for the four upper layers; the physical layer has none, it only carries bits."
  },
  {
    "q": "Match each layer to its job.",
    "type": "match",
    "pairs": [
      ["Application", "communication between end systems for a network application"],
      ["Transport", "process-to-process delivery of the entire message"],
      ["Network", "routing datagrams from source to destination (host-to-host)"],
      ["Data link", "data transfer between neighbouring network elements"],
      ["Physical", "carries individual bits across the link as signals"]
    ],
    "explain": "Application end-to-end for the application, transport process-to-process, network host-to-host, data link node-to-node, physical bits to signals."
  },
  {
    "q": "Match each device to the layers it runs.",
    "type": "match",
    "pairs": [
      ["Hub", "physical only"],
      ["Link-layer switch", "data link and physical"],
      ["Router", "network, data link and physical"],
      ["Host", "all five layers"]
    ],
    "explain": "A hub repeats bits; a switch also reads MAC addresses and filters; a router also reads IP addresses and connects networks; hosts run all five layers."
  }
]
```

## 2g. Encapsulation adds a header per layer, and a router rewrites the link header

Recall first.

```quiz
[
  {
    "q": "When a router forwards a frame, what does it do with the link-layer header?",
    "options": ["Strips H_L, reads H_N, and adds a new H_L", "Passes the frame on unchanged", "Strips H_N and H_T and adds a new H_L", "Adds a second H_L in front of the first"],
    "answer": 0,
    "explain": "The router strips the link-layer header, reads the network header to choose the next hop, and writes a new link-layer header: it changes the link-layer source and destination addresses. A switch reads the frame and passes it on."
  }
]
```

- At the source, top-down: message M → segment H_T M → datagram H_N H_T M → frame H_L H_N H_T M → bits. The destination decapsulates bottom-up.
- Hub: physical layer only, repeats to every other port. Switch: data link and physical, filters by MAC address. Router: network, data link and physical; has a MAC and an IP address on each interface and changes the link-layer addresses when it forwards.

```widget
encapsulation
{ "title": "Encapsulation from A to B: predict what each layer does to the PDU", "predict": true }
```

Lesson: [Encapsulation and addressing](#/comp3721-w1/encapsulation-addressing), [connecting devices](#/comp3721-w1/connecting-devices).

## 3a. Analog and digital data and signals; periodic and nonperiodic

Recall first.

```quiz
[
  {
    "q": "Fill in the two blanks with the slide's words.",
    "type": "fill",
    "code": "In data communications, we commonly use ___ analog signals and ___ digital signals.",
    "answer": ["periodic", "nonperiodic"],
    "explain": "*In data communications, we commonly use periodic analog signals and nonperiodic digital signals.* A sine wave is a simple periodic analog signal; most digital signals are nonperiodic, so they are described by bit rate rather than frequency."
  }
]
```

- Analog data is continuous (sound); digital data has discrete states (1s and 0s in memory).
- An analog signal has many levels of intensity over time; a digital signal has a limited number of defined values.
- Periodic: repeats a cycle every period T. Nonperiodic (aperiodic): no repeating pattern.

Lesson: [Data and signals](#/comp3721-w2/data-and-signals).

## 3b. The sine wave: A, f = 1/T, phase and wavelength

Recall first.

```quiz
[
  {
    "q": "s(t) = 4 sin(16πt). What is its frequency, in Hz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "Match the coefficient of t to 2πf: $2\\pi f = 16\\pi$, so $f = 8$ Hz. The peak amplitude is 4 V."
  },
  {
    "q": "The same signal, s(t) = 4 sin(16πt). What is its period, in ms?",
    "type": "numeric",
    "answer": 125,
    "tolerance": 0,
    "unit": "ms",
    "explain": "$T = 1/f = 1/8 = 0.125$ s $= 125$ ms."
  },
  {
    "q": "A sine wave is offset by 1/8 of a cycle from time 0. What is its phase, in degrees?",
    "type": "numeric",
    "answer": 45,
    "tolerance": 0,
    "unit": "°",
    "explain": "Phase = fraction of a cycle × 360°: $\\frac{1}{8} \\times 360° = 45°$, which is $45 \\times 2\\pi/360 = \\pi/4 \\approx 0.785$ rad."
  },
  {
    "q": "Light of frequency 6 × 10¹⁴ Hz travels in a vacuum. What is its wavelength, in μm?",
    "type": "numeric",
    "answer": 0.5,
    "tolerance": 0.001,
    "unit": "μm",
    "explain": "$\\lambda = c/f = 3 \\times 10^8 / 6 \\times 10^{14} = 0.5 \\times 10^{-6}$ m $= 0.5$ μm."
  }
]
```

- s(t) = A sin(2πft + φ): A is the peak amplitude (volts), f the frequency (cycles in 1 s, Hz), φ the phase (degrees or radians, 360° = 2π rad).
- f = 1/T and T = 1/f. Slide examples: 60 Hz → 16.7 ms; 200 μs → 5 kHz; 5 sin(20πt) → 10 Hz, 0.1 s.
- Phase = fraction of a cycle × 360°: a 1/9 cycle offset is 40° = 0.698 rad.
- Wavelength λ = c/f = c × T, the distance a simple signal travels in one period: red light at 4 × 10¹⁴ Hz → 0.75 μm. Frequency does not depend on the medium; wavelength does.

```widget
sine-wave
{ "A": 4, "f": 8, "phase": 0, "title": "s(t) = A sin(2πft + φ): set A, f and φ", "presets": { "4 sin(16πt)": [4, 8, 0], "1/8 cycle offset (45°)": [4, 8, 45], "5 sin(20πt) (slide)": [5, 10, 0] } }
```

Lesson: [Sine wave](#/comp3721-w2/sine-wave), [phase](#/comp3721-w2/phase), [wavelength](#/comp3721-w2/wavelength).

## 3c. The time domain shows amplitude against time; the frequency domain, peak amplitude against frequency

On paper, before the questions below, draw two pairs of plots:

1. The time-domain and frequency-domain plots of s(t) = −5 sin(8t). Mark the peak amplitude, the period and the frequency.
2. The frequency-domain plot of a periodic composite signal with components at 20, 30, 40 and 50 kHz, each with a peak amplitude of 6 V. Mark the bandwidth.

```quiz
[
  {
    "q": "s(t) = −5 sin(8t). What is the height of its spike in the frequency domain, in V?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "unit": "V",
    "explain": "Peak amplitude is an absolute value: $|-5| = 5$ V. The minus sign is a phase: $-\\sin x = \\sin(x + 180°)$, so the wave goes down first from time 0."
  },
  {
    "q": "s(t) = −5 sin(8t). At what frequency is its spike, in Hz? (Two decimals.)",
    "type": "numeric",
    "answer": 1.27,
    "tolerance": 0.005,
    "unit": "Hz",
    "explain": "$2\\pi f = 8$, so $f = 8/(2\\pi) = 4/\\pi \\approx 1.27$ Hz and $T = 1/f = \\pi/4 \\approx 0.785$ s."
  },
  {
    "q": "The 180° phase of −5 sin(8t) shows in its frequency-domain plot.",
    "type": "tf",
    "answer": false,
    "explain": "False. The frequency-domain plot shows peak amplitude against frequency only; phase is not shown. The 180° appears only in the time domain, where the wave starts downward."
  },
  {
    "q": "What does the frequency-domain plot of the periodic composite signal (20 to 50 kHz) look like?",
    "options": ["Separate spikes at 20, 30, 40 and 50 kHz, each 6 V high", "A continuous band from 20 to 50 kHz", "One spike at 35 kHz, 24 V high", "A continuous band from 0 to 50 kHz"],
    "answer": 0,
    "explain": "A composite periodic signal decomposes into discrete frequencies, so the plot is separate spikes of equal height (6 V), with nothing between them. A continuous band belongs to a nonperiodic signal. The bandwidth is $50 - 20 = 30$ kHz."
  }
]
```

The plots to compare with yours. The time domain of −5 sin(8t) starts at 0, falls to −5 V at T/4, crosses 0 at T/2, rises to +5 V at 3T/4 and ends a cycle at T ≈ 0.785 s; its frequency domain is one spike of 5 V at 1.27 Hz. The composite signal's frequency domain is four spikes of 6 V at 20, 30, 40 and 50 kHz, with a bracket from 20 to 50 kHz labelled B = 30 kHz.

- A time-domain plot shows amplitude against time; phase is visible there.
- A frequency-domain plot shows peak amplitude against frequency; a sine wave is one spike, and phase is not shown.
- Composite periodic → discrete frequencies (harmonics f, 3f, 9f in the slide figure). Composite nonperiodic → continuous frequencies (human voice 0 to 4 kHz).

```widget
composite
{ "components": "20000:6 30000:6 40000:6 50000:6", "title": "The periodic composite: discrete spikes from 20 to 50 kHz", "presets": { "20 to 50 kHz, 6 V each": "20000:6 30000:6 40000:6 50000:6", "f + 3f + 9f (slide figure)": "1:1 3:0.33 9:0.11" } }
```

Lesson: [Composite signals and bandwidth](#/comp3721-w2/composite-bandwidth).

## 3d. Bandwidth is f_high − f_low, and the middle frequency gives the two ends

Recall first.

```quiz
[
  {
    "q": "A composite signal has a bandwidth of 60 kHz and a middle frequency of 90 kHz. What is its highest frequency, in kHz?",
    "type": "numeric",
    "answer": 120,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "$f_h - f_l = 60$ and $f_h + f_l = 2 \\times 90 = 180$. Adding: $2 f_h = 240$, so $f_h = 120$ kHz and $f_l = 60$ kHz."
  }
]
```

- B = f_high − f_low (E02: 100, 400, 500, 750, 900 Hz → 800 Hz).
- With a middle frequency: f_h + f_l = 2 × middle (E02: B = 200 kHz, middle 140 kHz → 40 and 240 kHz).

Lesson: [Composite signals and bandwidth](#/comp3721-w2/composite-bandwidth), [E02 worked](#/comp3721-w2/e02-worked).

## 3e. Unit conversion: ms, μs, ns, ps and kHz, MHz, GHz, THz

Recall first.

```quiz
[
  {
    "q": "A signal has a period of 250 μs. What is its frequency, in kHz?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "$f = 1 / (250 \\times 10^{-6}) = 4000$ Hz $= 4$ kHz. The shortcut: 1/μs gives MHz, so $1/250$ MHz $= 0.004$ MHz $= 4$ kHz."
  },
  {
    "q": "A signal has a frequency of 2.5 GHz. What is its period, in ns?",
    "type": "numeric",
    "answer": 0.4,
    "tolerance": 0.001,
    "unit": "ns",
    "explain": "$T = 1 / (2.5 \\times 10^9) = 0.4 \\times 10^{-9}$ s $= 0.4$ ns."
  },
  {
    "q": "What is the bit duration at 5 Mbps, in μs?",
    "type": "numeric",
    "answer": 0.2,
    "tolerance": 0.001,
    "unit": "μs",
    "explain": "Bit duration = 1 / bit rate $= 1 / (5 \\times 10^6) = 0.2 \\times 10^{-6}$ s $= 0.2$ μs."
  }
]
```

| Time | Factor | Frequency | Factor |
|---|---|---|---|
| ms | 10⁻³ | kHz | 10³ |
| μs | 10⁻⁶ | MHz | 10⁶ |
| ns | 10⁻⁹ | GHz | 10⁹ |
| ps | 10⁻¹² | THz | 10¹² |

The reciprocal swaps the prefix: 1/ms gives kHz, 1/μs gives MHz, 1/ns gives GHz.

```widget
freq-period
{ "T": 250, "unit": "μs" }
```

Lesson: [Sine wave](#/comp3721-w2/sine-wave), [math review](#/comp3721-w1/math-review).
