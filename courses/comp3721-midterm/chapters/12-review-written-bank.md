---
title: "Review 4: the written-response bank: differences, responsibilities and roles in the slide's words (items 1, 2, 4, 5, 9, 11)"
minutes: 50
---
:::quiz What the paper asks and what earns the marks
Review items 1, 2, 4, 5, 9 and 11 come back as short written responses. The Sample Quiz Questions sheet shows two: "List two disadvantages of star topology" and "What is the responsibility of data-link layer in TCP/IP protocol suite?". Expect the same verbs: list two, explain the difference between, what is the role of, name the techniques in each category. A marker reads for the slide's own term, a reason, and one example or number. Two to four sentences earn the marks; a page of prose does not.
:::

**Understand before the exam (cannot be looked up):**

- The three-move answer: name the thing in the slide's words, give the reason or the difference, give one example or number.
- Which slide term a question is fishing for: *frequency-domain plot* (not "spectrum"), *jitter* (not "delay"), *dependency of the whole topology on one single point*.
- A "difference" question wants both sides named, in the same order, with the same kind of fact for each (what varies, what is divided, analog or digital).
- How to test a line-coding scheme for baseline wandering, DC and lack of synchronization: picture a long run of 0s and a long run of 1s.

**On the sheet (look up, do not memorise):**

- Layers, PDUs, addresses, protocols: *Sheet side 1, "Protocol layering (01b)"*.
- Topology advantages and disadvantages: *Sheet side 1, "Topologies and their link counts"*.
- Nyquist and Shannon in words: *Sheet side 2, "Data rate limits: bandwidth, levels, noise"*.
- What each conversion varies: *Sheet side 3, "D2A and A2A side by side"*.
- ARP request and reply: *Sheet side 3, "ARP"*.

Do if time is short: the three-move answer, the sample quiz worked, then Layers, Networks, Transmission, Conversion and ARP. Signals, Line coding and Multiplexing are marked "if time".

## The three-move answer, from zero

A written response is marked against a short list of points. Each point is a slide term or a fact the slide states. So the answer has three moves, always in this order.

```diagram
{ "type": "flow", "title": "Every written response in three moves", "nodes": [
  { "id": "n", "label": "1. Name it", "sub": "the slide's term, in italics in the models" },
  { "id": "r", "label": "2. Reason or difference", "sub": "why, or what changes between the two" },
  { "id": "e", "label": "3. Example or number", "sub": "one case: a device, a scheme, a value with its unit" }
], "edges": [ { "from": "n", "to": "r" }, { "from": "r", "to": "e" } ], "hi": ["n"], "caption": "Move 1 earns most marks: a correct idea in your own words can miss the term the marker is looking for." }
```

The tiny case. "What is a protocol?" Move 1: *a set of rules that govern data communications*. Move 2: it *represents an agreement between the communicating devices* on *what* is communicated, *how* and *when*. Move 3: HTTP is the protocol a browser and a web server agree on. Three sentences, three points.

The examples in the bank come from one place: a game script that runs a MapleStory Classic character. It posts telemetry batches to a collector on another PC, and it sends a death notice to a Discord channel over the Internet. The networking in those examples follows the slides; only the names are new.

## The sample quiz's two written questions, worked

**Q5. List two disadvantages of star topology.**

Move 1 names the topology: in a *star*, *each device has a dedicated point-to-point link only to a central controller, usually called a hub*. Move 2 gives the two disadvantages in the slide's words: the *dependency of the whole topology on one single point*, and *more cabling than bus and ring*. Move 3 gives the reason or the number: if the hub fails, every device is cut off; and n devices need n links, so 12 devices need 12 cables to the hub.

**Q6. What is the responsibility of the data-link layer in the TCP/IP protocol suite?**

Move 1: *data transfer between neighbouring network elements*, node to node, *without errors*. Move 2: its packet is a *frame*, and it is active at every hop, offering *framing*, *flow control*, *error control* and *congestion control*. Move 3: Ethernet and 802.11 (WiFi) are data-link protocols.

The "transforms bits to electromagnetic signals" job belongs to the physical layer. The sample quiz's true-or-false item uses exactly that swap.

## Layers

The five layers, the PDU each one makes and the address it reads, top to bottom. Read a layer question as a row of this figure.

```diagram
{ "type": "layers", "title": "TCP/IP: what each layer does, its PDU and its address", "nodes": [
  { "id": "l5", "label": "5 Application: message", "sub": "communication between end systems for a network application · names · HTTP, SMTP, IMAP, FTP, DNS, Telnet" },
  { "id": "l4", "label": "4 Transport: segment / user datagram", "sub": "process-to-process · port numbers · TCP, UDP, SCTP" },
  { "id": "l3", "label": "3 Network: datagram / packet", "sub": "host-to-host routing of datagrams · logical (IP) addresses · IP, ICMP, DHCP, ARP" },
  { "id": "l2", "label": "2 Data link: frame", "sub": "neighbouring network elements, without errors · link-layer (MAC) addresses · Ethernet, 802.11" },
  { "id": "l1", "label": "1 Physical: bits", "sub": "bits from the frame transformed to signals · no address · link dependent" }
], "hi": ["l2"], "caption": "Encapsulation at the source goes down this stack: M, then H_T M, then H_N H_T M, then H_L H_N H_T M, then bits. A switch runs layers 1 and 2; a router runs 1 to 3." }
```

Every layer answer names the layer, then the slide's phrase for its job, then the PDU or the address. *Sheet side 1, "Protocol layering (01b)"* holds the table; *Sheet side 3, "The data-link layer (06b)"* holds the two reasons a router re-frames.

```quiz
[
  {
    "type": "free",
    "q": "A death notice from the game PC crosses three links on its way to Discord. What does the data-link layer do on each link, and why does every router build a new frame?",
    "model": "The data-link layer does *data transfer between neighbouring network elements* (node to node) *without errors*, and *a packet at the data-link layer is called a frame*. A router decapsulates the frame and builds a new one for two reasons: *each link may be using a different protocol with a different frame format*, and even with the same protocol *the link-layer addresses are normally different*. The notice may leave the game PC in an 802.11 frame and continue in an Ethernet frame on the next link, while the datagram inside stays the same.",
    "points": [
      "neighbouring nodes (node to node), without errors",
      "the PDU is a frame",
      "reason 1: a different protocol with a different frame format on each link",
      "reason 2: the link-layer addresses are normally different",
      "example: 802.11 on one link, Ethernet on the next; the datagram unchanged"
    ],
    "rows": 4,
    "explain": "Sheet side 3, \"The data-link layer (06b)\" lists both reasons. Do not write \"transforms bits to signals\": that is the physical layer."
  },
  {
    "type": "free",
    "q": "State the responsibility of each of the five layers of the TCP/IP protocol suite, one line per layer.",
    "model": "The *physical* layer *carries individual bits across the link*, transforming the bits of a frame into signals; the *data-link* layer handles *data transfer between neighbouring network elements*; the *network* layer routes *datagrams from source to destination (host-to-host)*. The *transport* layer gives *logical communication between application processes on different hosts* (process-to-process), and the *application* layer gives *communication between end systems for a network application*. For the death notice, the application layer writes the message, the transport layer hands it to the right process, the network layer routes it host to host, and the lower two move it one link at a time.",
    "points": [
      "physical: individual bits across the link, bits to signals",
      "data link: neighbouring network elements (node to node)",
      "network: host-to-host routing of datagrams",
      "transport: process-to-process",
      "application: end systems, a network application"
    ],
    "rows": 6,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Job column. The fill-in trap: host-to-host is the network layer, process-to-process the transport layer."
  },
  {
    "type": "free",
    "q": "Name the PDU at each TCP/IP layer as the death notice goes down the stack at the game PC, and say what each layer adds.",
    "model": "A *PDU (Protocol Data Unit)* is *a unit of data passed between layers of a protocol stack*: the application layer makes a *message*, the transport layer a *segment* (a *user datagram* with UDP), the network layer a *datagram* (*packet*), the data-link layer a *frame*, and the physical layer sends *bits*. Going down, each layer adds its own header, which is *encapsulation*: M, then H_T M, then H_N H_T M, then H_L H_N H_T M. The death notice is the message; its TCP segment rides in an IP datagram, and the datagram rides in a frame to the first router.",
    "points": [
      "application: message",
      "transport: segment (user datagram)",
      "network: datagram (packet)",
      "data link: frame; physical: bits",
      "each layer adds a header: encapsulation"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the PDU column and the encapsulation line under the table."
  },
  {
    "type": "free",
    "q": "Which type of address is used at each layer of the TCP/IP protocol suite? Give one example from the death notice for each.",
    "model": "The suite uses *four levels of addresses*: *names* at the application layer (URLs, email addresses), *port numbers* at the transport layer (they *identify a process on a host*), *logical (IP) addresses* at the network layer (they *uniquely define a host on the Internet*), and *link-layer (MAC) addresses* at the data-link layer (they *define a specific host or router in a network*). The physical layer has no address. For the death notice, the Discord URL is the name, a port number picks the server process, the IP address names the server host, and a MAC address names the next node on the current link.",
    "points": [
      "application: names (URLs, email addresses)",
      "transport: port numbers, a process on a host",
      "network: logical (IP) addresses, a host on the Internet",
      "data link: link-layer (MAC) addresses",
      "physical: none"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Address column. \"The physical layer has an address\" is a true-or-false trap."
  },
  {
    "type": "free",
    "q": "Give two example protocols for each of the top four TCP/IP layers, and say why the physical layer's protocols are described differently.",
    "model": "Application: *HTTP*, *SMTP*, *IMAP*, *FTP*, *DNS*, *Telnet*; transport: *TCP*, *UDP*, *SCTP*; network: *IP*, *ICMP*, *DHCP*, *ARP* and the routing protocols; data link: *Ethernet* and *802.11 (WiFi)*. The physical layer's protocols are *link dependent (rely on the medium)*, so they change with the cable or the air rather than with the application. The death notice sent as an HTTP request over TCP and IP, on WiFi to the home router, uses one protocol from each of the top four layers.",
    "points": [
      "application: two of HTTP, SMTP, IMAP, FTP, DNS, Telnet",
      "transport: two of TCP, UDP, SCTP",
      "network: two of IP, ICMP, DHCP, ARP",
      "data link: Ethernet, 802.11",
      "physical: link dependent, relies on the medium"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Protocols column. ARP sits in the network layer on both 01b and 06b."
  },
  {
    "type": "free",
    "q": "Why are network protocols organised in layers? Give the advantages the slide lists and one example.",
    "model": "*Protocol layering* divides the complex task of communication into *smaller, simpler tasks*; each layer offers a *service model* to the layer above and relies on the services of the layer below. The slide's advantages are *separating services from implementation*, *simpler and less expensive intermediate systems* (a switch runs two layers, a router three), and *modularity*: a change in one layer is transparent to the rest. When the game PC moves from Ethernet to WiFi, only the data-link and physical layers change; the death notice's HTTP, TCP and IP stay the same.",
    "points": [
      "a complex task divided into smaller, simpler tasks",
      "service model: each layer serves the layer above, uses the one below",
      "separating services from implementation",
      "simpler, less expensive intermediate systems; modularity",
      "example: a new LAN technology changes only data link and physical"
    ],
    "rows": 5,
    "explain": "Sheet side 1, \"Protocol layering (01b)\", the Advantages line. The example is E01 question 2: a new LAN technology changes only the data-link and physical layers."
  }
]
```

## Networks

A "two disadvantages" question takes the two slide phrases from one row of *Sheet side 1, "Topologies and their link counts"*, plus the link count as the number. The other questions here are pairs: point-to-point against multipoint, the three data-flow modes, LAN against WAN. Name both sides with the same kind of fact.

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

## Signals (if time)

Signal questions are definitions with one trap each. The plot that shows peak amplitude against frequency is the *frequency-domain plot*; a marker grading against the slide does not accept "spectrum". *Sheet side 1, "Data and signals (02)"* and *"Time and frequency domain, bandwidth"* hold the wording.

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

## Transmission

The instructor's own warning lives here: Nyquist has a factor of 2 and Shannon does not, and the two describe different channels. In words, the pair is *noiseless* against *noisy*, *levels* against *SNR*. *Sheet side 2, "Data rate limits: bandwidth, levels, noise"* has both sentences the slide boxes.

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
  }
]
```

## Line coding (if time)

Review item 5 asks you to *detect* three problems in a scheme, not to draw the scheme. The test is the same for all three: picture a long run of 0s, then a long run of 1s.

- The level stays fixed over the run → *baseline wandering* and no *self-synchronization* (no transitions to reset the clock).
- The levels over a run do not average to zero → a *DC component*.
- A transition in the middle of every bit → self-synchronizing, no wandering; a positive and a negative part in every bit → no DC.

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
], "hi": ["u0", "p0", "b0"], "caption": "Name the family by where the levels sit, then list its schemes. Pseudoternary is not on the Week 4 slides, which draw only AMI: name it, if at all, as a second bipolar scheme from outside the slides." }
```

*Sheet side 2, "Baseline, self-synchronization and DC"* and *"The line-coding schemes and their level rules"* hold the definitions and the per-scheme table.

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

## Conversion

The review list's second warning: keep digital-to-analog (ASK, FSK, PSK, QAM) apart from analog-to-analog (AM, FM, PM). Both vary the same three properties of a carrier; what differs is the input, digital data or an analog signal. *Sheet side 3, "D2A and A2A side by side"* has one row per method.

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

## Multiplexing (if time)

Multiplexing answers start with two facts per technique: analog or digital, and what is divided among the inputs. *Sheet side 3, "Multiplexing, FDM and WDM (06a)"* and *"Synchronous TDM and E06"* hold both.

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

## ARP

The scenario for the three items: the telemetry batch goes from the game PC (IP address N_A, link-layer address L_A) through the home router to the collector PC (N_B, L_B) on a second LAN. *Sheet side 3, "ARP"* and *"Alice to Bob, where N_A and N_B never change"* hold the slide's request, reply and hop table.

```diagram
{ "type": "sequence", "title": "ARP on the game PC's LAN, before the first frame", "nodes": [
  { "id": "pc", "label": "Game PC", "sub": "N_A, L_A" },
  { "id": "lan", "label": "Every system on the LAN" },
  { "id": "r", "label": "Router R1", "sub": "N₁, L₁" }
], "edges": [
  { "from": "pc", "to": "lan", "label": "request, broadcast: N₁?" },
  { "from": "r", "to": "pc", "label": "reply, unicast: L₁" },
  { "from": "pc", "to": "r", "label": "frame to L₁" }
], "caption": "The forwarding table names the next hop's IP address N₁; ARP turns it into the link-layer address L₁, and the first frame is [L₁ | L_A | N_A | N_B | Data]." }
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
