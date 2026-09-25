---
title: Your one-page study note (Week 1)
minutes: 15
---

The instructor allows **one A4 or letter page, single-sided, preferably hand-written**, plus a calculator, in every quiz (the back may be used for rough work). This page is the Week 1 draft of that sheet: no explanations, only the facts, tables and formulas in the slides' own words. **Quiz 1 needs only the 01a block.** The 01b/01c block goes on the Quiz 2 sheet together with the Week 2 note.

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

- Worked numbers: 12 devices need **66** mesh links ($12 \times 11 / 2$) or **12 drop lines + 1 backbone** on a bus (E01). New LAN technology changes only data link + physical.

## From memory

Close the page and answer these; anything you miss goes on the sheet in larger writing.

```quiz
[
  {
    "q": "A mesh topology with 7 devices needs how many links?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0.5,
    "unit": "links",
    "explain": "$\\frac{7 \\times 6}{2} = 21$. Star would need 7, bus 1 backbone + 7 drop lines, ring 7."
  },
  {
    "q": "Fill in the blank: the four characteristics that measure the effectiveness of data communications are delivery, accuracy, timeliness and ________.",
    "type": "text",
    "answer": ["jitter"],
    "explain": "Jitter is the uneven delay in the delivery of audio or video packets."
  },
  {
    "q": "Select the two disadvantages of a star topology given in the lecture.",
    "options": ["The dependency of the whole topology on one single point", "Expensive hardware", "More cabling is required compared with bus and ring", "Unidirectional traffic"],
    "answer": [0, 2],
    "explain": "Dependency on the single central point (the hub) and more cabling than bus and ring. Expensive hardware is a mesh disadvantage; unidirectional traffic is a ring disadvantage."
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
    "q": "A link-layer switch implements the network layer so that it can read IP addresses.",
    "type": "tf",
    "answer": false,
    "explain": "A switch implements only the physical and data-link layers and filters on MAC addresses. The router is the device that adds the network layer and reads IP addresses."
  },
  {
    "q": "Fill in the blank: Internet standards and RFCs are created and published by the ________.",
    "type": "text",
    "answer": ["IETF", "Internet Engineering Task Force"],
    "explain": "The IETF publishes the numbered, technical RFC documents; standards exist for interoperability."
  },
  {
    "q": "The quiz study note may be written on both sides of the page.",
    "type": "tf",
    "answer": false,
    "explain": "Single-sided only, preferably hand-written; the back of the page is for rough work during the quiz. Bring a calculator, and keep the note afterwards for revision."
  }
]
```
