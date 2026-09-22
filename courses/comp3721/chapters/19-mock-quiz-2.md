---
title: Mock Quiz 2 (01b, 01c, Week 2)
minutes: 35
---

Quiz 2 is expected to cover what came after Quiz 1's scope: Lecture 01b (protocol layering, the TCP/IP protocol suite, the OSI model, encapsulation and addressing), the 01c complementary notes (hubs, switches, routers) and Lecture 02 (data and signals, sine waves, phase, wavelength, composite signals, bandwidth, digital signals). Same rules as the real thing: one hand-written A4 note, a calculator, no other help. About a third of the questions are calculations; write the units with every answer and keep the unit prefixes (ms, μs, kHz, MHz, Mbps) straight. Every explanation shows the arithmetic or the exact slide fact.

```quiz
[
  {
    "q": "According to Lecture 01b, protocol layering enables us to...",
    "options": ["divide the complex task of communication into multiple smaller and simpler tasks", "send data faster over the physical medium", "remove the need for intermediate systems such as routers", "use a single protocol for every layer"],
    "answer": 0,
    "explain": "Layering breaks the complex task of communication into smaller, simpler tasks; network designers organize protocols and the hardware and software that implement them in layers. The air-travel analogy (ticketing, baggage, gate, runway, routing services) shows each layer implementing a service via its own actions, relying on the layer below."
  },
  {
    "q": "In the 01b definition, a protocol defines...",
    "options": ["what is communicated, how, and when: the format and order of messages exchanged, and the actions taken on transmission or receipt", "only the physical path a message travels", "the number of devices in a network", "the geometric layout of the links"],
    "answer": 0,
    "explain": "A protocol defines what is communicated, how and when: the format and the order of messages exchanged between communicating entities, plus the actions taken on the transmission or receipt of a message or other event."
  },
  {
    "q": "First principle of protocol layering: for bidirectional communication, each layer must be able to perform two opposite tasks.",
    "type": "tf",
    "answer": true,
    "explain": "True. The second principle is that the two objects under each layer at both sites should be identical."
  },
  {
    "q": "Fill in the blank: the ________ model of a layer is the set of services that the layer offers to the layer above.",
    "type": "text",
    "answer": ["service", "service model"],
    "explain": "The service model of a layer is the services it offers to the layer above. Each layer provides its service by performing actions within the layer and by using the services of the layer directly below."
  },
  {
    "q": "Select the three advantages of protocol layering listed in the lecture.",
    "options": ["Separating the services from the implementation", "Faster transmission over the medium", "Simpler and less expensive intermediate systems", "Modularity (independent layers, a black box)", "Fewer protocols overall"],
    "answer": [0, 2, 3],
    "explain": "The three: separating services from implementation; simpler and less expensive intermediate systems; modularity, so a change in one layer's implementation is transparent to the rest of the system."
  },
  {
    "q": "The TCP/IP protocol suite has how many layers, and the OSI model how many?",
    "options": ["TCP/IP 5, OSI 7", "TCP/IP 7, OSI 5", "TCP/IP 4, OSI 7", "Both have 5"],
    "answer": 0,
    "explain": "TCP/IP (the Internet protocol stack) is a five-layer hierarchical model. OSI, an ISO standard, has seven layers; its application, presentation and session layers are combined into TCP/IP's application layer."
  },
  {
    "type": "match",
    "q": "Match each TCP/IP layer to the name of its PDU (protocol data unit).",
    "pairs": [
      ["Application", "message"],
      ["Transport", "segment / user datagram"],
      ["Network", "datagram / packet"],
      ["Data link", "frame"],
      ["Physical", "bits"]
    ],
    "explain": "A PDU is a unit of data passed between layers of a protocol stack. Message, segment (or user datagram for UDP), datagram or packet, frame, bits, from the top down."
  },
  {
    "q": "Fill in the blank: the ________ layer of the TCP/IP protocol suite provides host-to-host communication (routing of datagrams from source to destination).",
    "type": "text",
    "answer": ["network", "network layer", "IP"],
    "explain": "The network layer, also called the IP layer, routes datagrams from the source host to the destination host. Its protocols include IP, ICMP, DHCP, ARP and the routing protocols."
  },
  {
    "q": "Fill in the blank: the ________ layer provides logical communication between application processes running on different hosts (process-to-process delivery of the entire message).",
    "type": "text",
    "answer": ["transport", "transport layer"],
    "explain": "The transport layer: process-to-process delivery. Its protocols are TCP, UDP and SCTP, almost always implemented in software in the end systems."
  },
  {
    "q": "The data-link layer transforms the bits of a frame into electromagnetic signals and sends them through the transmission medium.",
    "type": "tf",
    "answer": false,
    "explain": "False: that is the physical layer. The data-link layer transfers frames between neighbouring network elements without errors (Ethernet, 802.11). Physical-layer protocols are link dependent because they rely on the actual medium."
  },
  {
    "q": "Select all the transport-layer protocols named in the lecture.",
    "options": ["TCP", "IP", "UDP", "HTTP", "SCTP", "Ethernet"],
    "answer": [0, 2, 4],
    "explain": "TCP, UDP and SCTP are transport-layer protocols. IP is network layer, HTTP is application layer, Ethernet is data link."
  },
  {
    "q": "The physical layer and the data-link layer are typically implemented in a NIC (Network Interface Card).",
    "type": "tf",
    "answer": true,
    "explain": "True. They handle communication over a specific link. Hosts (end systems) implement all five layers of the TCP/IP stack."
  },
  {
    "q": "How many TCP/IP layers does a link-layer switch implement, and how many does a router implement?",
    "options": ["Switch 2 (data link, physical); router 3 (network, data link, physical)", "Switch 1; router 2", "Switch 3; router 5", "Both implement all 5"],
    "answer": 0,
    "explain": "In the 'communication through an internet' figure the switch runs data link and physical; the router runs network, data link and physical; source and destination hosts run all five."
  },
  {
    "q": "In the encapsulation example, a frame arrives at a router. Which header does the router remove and replace before forwarding?",
    "options": ["The link-layer header $H_L$", "The network-layer header $H_N$", "The transport-layer header $H_T$", "None; a router forwards the frame unchanged"],
    "answer": 0,
    "explain": "The router strips $H_L$, reads $H_N$ to decide where to route the datagram, then adds a new $H_L$ for the next link. The chain at the source is message M, segment $H_T M$, datagram $H_N H_T M$, frame $H_L H_N H_T M$, then bits."
  },
  {
    "q": "Fill in the blank: at the transport layer, a process on a host is identified by a ________.",
    "type": "text",
    "answer": ["port number", "port", "port numbers"],
    "explain": "The four address levels: names (URLs, email addresses) at the application layer; port numbers at the transport layer; logical (IP) addresses at the network layer, which uniquely define a host on the Internet; link-layer (MAC) addresses at the data-link layer, which define a specific host or router in a network."
  },
  {
    "q": "Select the two OSI layers that are combined into the application layer of the TCP/IP suite (besides the application layer itself).",
    "options": ["Presentation", "Transport", "Session", "Network"],
    "answer": [0, 2],
    "explain": "Presentation (lets applications interpret the meaning of the data exchanged: compression, encryption) and session (session management, synchronization of data exchange) become part of TCP/IP's application layer."
  },
  {
    "q": "A hub (01c notes) operates at which layer, and what is it also called?",
    "options": ["Physical layer; a multiport (multiway) repeater", "Data-link layer; a bridge", "Network layer; a router", "Transport layer; a gateway"],
    "answer": 0,
    "explain": "A hub is a physical-layer device that repeats whatever it hears on one port out all its other ports (except the one it came in on); hence multiport repeater."
  },
  {
    "q": "A hub can check the destination MAC address of a frame and forward it out only the correct port.",
    "type": "tf",
    "answer": false,
    "explain": "False. That filtering capability is what distinguishes a link-layer switch from a hub. A switch works at the physical and data-link layers, regenerates the signal and reads the source and destination MAC addresses to choose the outgoing port."
  },
  {
    "q": "Fill in the blank: because a router connects independent networks to form an internetwork, it is called an ________ device.",
    "type": "text",
    "answer": ["internetworking", "internetworking device"],
    "explain": "Internetworking device. Two networks connected by a router become an internetwork, an internet. A router operates at the physical, data-link and network layers."
  },
  {
    "q": "Select the three differences between a router and a repeater or switch given in the 01c notes.",
    "options": ["A router has a physical (link-layer) address and a logical (IP) address for each interface", "A router acts only on packets whose link-layer destination address matches the interface they arrived on", "A router changes the link-layer source and destination addresses of the packet when it forwards it", "A router regenerates the signal it receives", "A router changes the IP addresses of the packet when it forwards it"],
    "answer": [0, 1, 2],
    "explain": "Exactly three: two addresses per interface; acts only on frames addressed to the arriving interface; rewrites the link-layer addresses when forwarding. Regenerating the signal is something switches and repeaters also do, and a router does not change the IP addresses."
  },
  {
    "q": "At the physical layer, what actually goes through the network connecting Alice and Bob is data.",
    "type": "tf",
    "answer": false,
    "explain": "False. Data (information) is what Alice and Bob exchange, but what goes through the network at the physical layer is signals (for example electrical signals). Data must be changed to signals for transmission; communication at the application, transport, network and data-link layers is logical, at the physical layer it is physical."
  },
  {
    "q": "Fill in the blank: in data communications, we commonly use ________ analog signals and nonperiodic digital signals.",
    "type": "text",
    "answer": ["periodic"],
    "explain": "Periodic analog signals and nonperiodic digital signals. A periodic signal completes a pattern (a cycle) within a period T and repeats it; a nonperiodic (aperiodic) signal has no repeating pattern."
  },
  {
    "q": "Select the three parameters that represent a sine wave, as listed in the lecture.",
    "options": ["Peak amplitude", "Bit rate", "Frequency", "Wavelength", "Phase (phase shift)", "Bandwidth"],
    "answer": [0, 2, 4],
    "explain": "Peak amplitude A (highest intensity, in volts, proportional to the energy carried), frequency f (completed cycles in 1 s, in Hz), and phase φ (position of the waveform relative to time 0, in degrees or radians). Wavelength and bandwidth are derived quantities."
  },
  {
    "q": "The power we use at home has a frequency of 60 Hz. What is the period, in milliseconds?",
    "type": "numeric",
    "answer": 16.7,
    "tolerance": 0.1,
    "unit": "ms",
    "explain": "$T = 1/f = 1/60 = 0.0167$ s $= 16.7$ ms. (The slide also notes the peak value is about $120\\sqrt{2} \\approx 170$ V.)"
  },
  {
    "q": "A sine wave has a period of 200 μs. What is its frequency, in kHz?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0.05,
    "unit": "kHz",
    "explain": "$f = 1/T = 1/(200 \\times 10^{-6}) = 1000000/200 = 5000$ Hz $= 5$ kHz."
  },
  {
    "q": "For the sine wave $s(t) = 5\\sin(20\\pi t)$, what is the frequency in Hz?",
    "type": "numeric",
    "answer": 10,
    "tolerance": 0.1,
    "unit": "Hz",
    "explain": "Compare with $A\\sin(2\\pi f t)$: $2\\pi f = 20\\pi$, so $f = 10$ Hz. Peak amplitude $A = 5$ V and $T = 1/f = 0.1$ s."
  },
  {
    "q": "For the sine wave $s(t) = \\sin(10t)$, what is the period in seconds?",
    "type": "numeric",
    "answer": 0.628,
    "tolerance": 0.005,
    "unit": "s",
    "explain": "$2\\pi f = 10$, so $f = 10/(2\\pi) = 1.59$ Hz and $T = 1/1.59 = 0.628$ s. Peak amplitude is 1 V."
  },
  {
    "q": "A sine wave is offset 1/9 cycle with respect to time 0. What is its phase in degrees?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0.5,
    "unit": "°",
    "explain": "A full cycle is 360°, so $\\phi = \\frac{1}{9} \\times 360° = 40°$."
  },
  {
    "q": "Same sine wave: what is that phase in radians?",
    "type": "numeric",
    "answer": 0.698,
    "tolerance": 0.005,
    "unit": "rad",
    "explain": "$40° \\times \\frac{2\\pi}{360°} = \\frac{2\\pi}{9} = 0.698$ rad. Remember $360° = 2\\pi$ rad, $1° = 2\\pi/360$ rad, $1$ rad $= 360/(2\\pi)$ degrees."
  },
  {
    "q": "The wave $A\\sin(\\omega t + \\phi)$ is the wave $A\\sin(\\omega t)$ shifted to the right by $\\phi/\\omega$.",
    "type": "tf",
    "answer": false,
    "explain": "False. Adding $\\phi$ shifts the wave to the left by $\\phi/\\omega$; subtracting it, $A\\sin(\\omega t - \\phi)$, shifts it to the right. Here $\\omega = 2\\pi f$. In the slide example $\\sin(\\omega t + 90°)$ starts at its peak, a quarter period early."
  },
  {
    "q": "What is the wavelength of red light with frequency $4 \\times 10^{14}$ Hz, if the propagation speed is $3 \\times 10^{8}$ m/s? Answer in micrometres.",
    "type": "numeric",
    "answer": 0.75,
    "tolerance": 0.005,
    "unit": "μm",
    "explain": "$\\lambda = c/f = \\frac{3 \\times 10^{8}}{4 \\times 10^{14}} = 0.75 \\times 10^{-6}$ m $= 0.75$ μm. Wavelength is the distance a simple signal travels in one period, so $\\lambda = c \\cdot T$ too."
  },
  {
    "q": "The frequency of a signal depends on the transmission medium it travels through.",
    "type": "tf",
    "answer": false,
    "explain": "False. Frequency is independent of the medium; it is fixed by the source. Wavelength depends on both the frequency and the medium, because propagation speed depends on the medium ($3 \\times 10^{8}$ m/s in a vacuum, lower in air, lower still in cable)."
  },
  {
    "q": "Fill in the blank: ________ analysis shows that any composite signal is a combination of simple sine waves with different frequencies, peak amplitudes and phases.",
    "type": "text",
    "answer": ["Fourier", "Fourier analysis"],
    "explain": "Fourier analysis (Jean-Baptiste Fourier). A single-frequency sine wave carries no information (just a buzz), so data communications needs composite signals. In the frequency domain a simple sine wave is one spike; a composite signal is several."
  },
  {
    "q": "The decomposition of a composite periodic signal gives a series of sine waves with discrete frequencies (integer multiples of the fundamental), while a composite nonperiodic signal decomposes into an infinite number of sine waves with continuous frequencies.",
    "type": "tf",
    "answer": true,
    "explain": "True. In the slide figure the periodic composite is built from the fundamental frequency f (first harmonic), 3f (third harmonic) and 9f (ninth harmonic). Nonperiodic examples: the human voice (a continuous range from 0 to 4 kHz) and an AM or FM radio signal."
  },
  {
    "q": "A periodic signal is decomposed into five sine waves with frequencies 100, 400, 500, 750 and 900 Hz. What is its bandwidth?",
    "type": "numeric",
    "answer": 800,
    "tolerance": 1,
    "unit": "Hz",
    "explain": "$B = f_h - f_l = 900 - 100 = 800$ Hz. Only the highest and lowest frequencies matter."
  },
  {
    "q": "The highest frequency in a nonperiodic composite signal is 400 MHz and the middle frequency is 300 MHz. What is the lowest frequency?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 0.5,
    "unit": "MHz",
    "explain": "Middle frequency $= (f_h + f_l)/2 = 300$, so $f_h + f_l = 600$ and $f_l = 600 - 400 = 200$ MHz. The bandwidth is then $400 - 200 = 200$ MHz."
  },
  {
    "q": "A signal has a bit rate of 1 Mbps and travels at $2 \\times 10^{8}$ m/s. What is the bit length, in metres?",
    "type": "numeric",
    "answer": 200,
    "tolerance": 1,
    "unit": "m",
    "explain": "Bit duration $= 1/(1\\ \\text{Mbps}) = 1$ μs. Bit length $=$ propagation speed $\\times$ bit duration $= 2 \\times 10^{8} \\times 10^{-6} = 200$ m: one bit occupies 200 m of the medium. At 10 Mbps it would be 20 m."
  },
  {
    "q": "A digital signal has 11 levels. How many bits are needed per level?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0.5,
    "unit": "bits",
    "explain": "$\\log_{2} 11 = 3.46$ bits, which is not realistic: the number of bits must be an integer, usually a power of 2, so round up: $⌈3.46⌉ = 4$ bits. For 4 levels it is $\\log_{2} 4 = 2$; for 8 levels 3; for 16 levels 4."
  },
  {
    "q": "Text documents are downloaded at 100 pages per second; a page averages 24 lines of 80 characters and a character needs 8 bits. What bit rate is required, in Mbps?",
    "type": "numeric",
    "answer": 1.536,
    "tolerance": 0.005,
    "unit": "Mbps",
    "explain": "$100 \\times 24 \\times 80 \\times 8 = 1536000$ bps $= 1.536$ Mbps. Doubling to 200 pages per second (E02) gives 3.072 Mbps."
  },
  {
    "q": "A digital signal, periodic or nonperiodic, is a composite analog signal with frequencies between zero and infinity, i.e. infinite bandwidth.",
    "type": "tf",
    "answer": true,
    "explain": "True. Fourier analysis decomposes a digital signal into sine waves: a periodic digital signal has infinite bandwidth with discrete frequencies; a nonperiodic digital signal has infinite bandwidth with continuous frequencies. Because most digital signals are nonperiodic, they are described by bit rate (bps) rather than frequency."
  }
]
```
