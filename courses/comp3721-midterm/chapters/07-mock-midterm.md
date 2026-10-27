---
title: Mock midterm (120 minutes)
minutes: 120
---

A 120-mark paper in the sample-quiz shapes, Weeks 1 to 7, with about a quarter of the marks on Week 7: true or false, fill in the blanks, written response and calculations. Every question and every number is new; none comes from a lesson, a practice set, a weekly mock or the Sample Quiz Questions sheet. Take it on paper first with your two cheat sheets and a calculator, then enter your answers here.

:::quiz Timing: about a mark a minute, with ten minutes to check
| Part | Shape | Items × marks | Minutes |
|---|---|---|---|
| A | True or false | 20 × 1 | 10 |
| B | Fill in the blanks (the slide's exact word) | 20 × 1 | 12 |
| C | Written response (2 to 4 sentences on paper, then type the key word) | 10 × 3 | 30 |
| D | Calculations, unit required | 10 problems × 5 parts × 1 | 58 |
| | Checking: units, prefixes, the sign of dB values, the factor 2 | | 10 |

Typing rules for the app: bit strings without spaces; hex with or without 0x; line-code levels as + and - without spaces; numbers without their unit (the unit is printed beside the box).
:::

## Part A: true or false (A1 to A20, 20 marks)

```quiz
[
  {
    "q": "**A1 (1 mark).** Simplex data flow is two-directional, but only one direction at a time.",
    "type": "tf",
    "answer": false,
    "explain": "False. Simplex is unidirectional (a mainframe to a monitor). Two-directional, one at a time, is half-duplex (a walkie-talkie); both directions at once is full-duplex. See [components and data flow](#/comp3721-w1/components-data-flow)."
  },
  {
    "q": "**A2 (1 mark).** When a router forwards a packet, it changes the link-layer source and destination addresses.",
    "type": "tf",
    "answer": true,
    "explain": "True. This is the third of the three differences between a router and a switch (01c): the router has a link-layer and an IP address per interface, acts only on frames addressed to the arriving interface, and changes both link-layer addresses when it forwards. See [connecting devices](#/comp3721-w1/connecting-devices)."
  },
  {
    "q": "**A3 (1 mark).** A mesh topology of 13 devices needs 78 dedicated point-to-point links.",
    "type": "tf",
    "answer": true,
    "explain": "True. Mesh links = n(n − 1)/2 = 13 × 12 / 2 = 78. A star of 13 devices needs 13 links, a ring 13, a bus 1 backbone + 13 drop lines. See [topologies](#/comp3721-w1/topologies)."
  },
  {
    "q": "**A4 (1 mark).** In the OSI model, the presentation layer handles session management and synchronization.",
    "type": "tf",
    "answer": false,
    "explain": "False. Session management and synchronization belong to the session layer (L5). The presentation layer (L6) interprets the meaning of data: compression and encryption. TCP/IP folds both into its application layer. See [TCP/IP and OSI](#/comp3721-w1/tcpip-osi)."
  },
  {
    "q": "**A5 (1 mark).** Frequency is independent of the medium, while wavelength depends on both the frequency and the medium.",
    "type": "tf",
    "answer": true,
    "explain": "True, as slide 02 states it: the propagation speed changes with the medium, so λ = propagation speed / f changes too, while f stays fixed. See [wavelength](#/comp3721-w2/wavelength)."
  },
  {
    "q": "**A6 (1 mark).** A composite nonperiodic signal is made of a set of discrete frequencies.",
    "type": "tf",
    "answer": false,
    "explain": "False. A composite periodic signal decomposes into discrete frequencies (spikes at f, 3f, 9f); a composite nonperiodic signal needs an infinite number of sine waves with continuous frequencies (the human voice, 0 to 4 kHz). See [composite signals and bandwidth](#/comp3721-w2/composite-bandwidth)."
  },
  {
    "q": "**A7 (1 mark).** In baseband transmission, the required bandwidth is proportional to the bit rate.",
    "type": "tf",
    "answer": true,
    "explain": "True, a boxed sentence on the Week 3 slides: *In baseband transmission, the required bandwidth is proportional to the bit rate; if we need to send bits faster, we need more bandwidth.* See [baseband and broadband](#/comp3721-w3/baseband-broadband)."
  },
  {
    "q": "**A8 (1 mark).** Thermal noise comes from sources such as motors and appliances, which act as a sending antenna.",
    "type": "tf",
    "answer": false,
    "explain": "False. That is induced noise. Thermal noise is the random motion of electrons in a wire, which creates an extra signal not originally sent by the transmitter. Crosstalk is the effect of one wire on the other; impulse noise is a spike. See [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr)."
  },
  {
    "q": "**A9 (1 mark).** The baud rate, not the bit rate, determines the required bandwidth for a digital signal.",
    "type": "tf",
    "answer": true,
    "explain": "True, the slide's sentence. Bandwidth is proportional to the signal rate, so B = c × N × 1/r is S with B in its place. See [digital bandwidth](#/comp3721-w4/digital-bandwidth)."
  },
  {
    "q": "**A10 (1 mark).** NRZ-I and Manchester are classified as differential encoding.",
    "type": "tf",
    "answer": false,
    "explain": "False. The slide says *NRZ-I and differential Manchester are classified as differential encoding*: both decide the bit from a change (or no change) rather than from a level. Plain Manchester uses the direction of the mid-bit transition. See [Manchester](#/comp3721-w4/manchester)."
  },
  {
    "q": "**A11 (1 mark).** In AMI, bit 0 is sent as alternating positive and negative voltages.",
    "type": "tf",
    "answer": false,
    "explain": "False. AMI (Alternate Mark Inversion) sends 0 as a neutral zero voltage and 1 as alternating positive and negative voltages. See [bipolar AMI](#/comp3721-w4/bipolar-ami)."
  },
  {
    "q": "**A12 (1 mark).** Flat-top sampling (sample-and-hold) is the most commonly used sampling method.",
    "type": "tf",
    "answer": true,
    "explain": "True. Of the three methods on slide 14, ideal sampling cannot be easily implemented, natural sampling uses a high-speed switch, and flat-top sampling uses a circuit and is *the most commonly used method*. See [sampling methods](#/comp3721-w5/sampling-methods)."
  },
  {
    "q": "**A13 (1 mark).** PSK is less susceptible to noise than ASK because noise can change the phase easier than it can change the amplitude.",
    "type": "tf",
    "answer": false,
    "explain": "False: the reason is reversed. Slide 17: *Because noise can change the amplitude easier than it can change the phase.* That is why PSK is more common than ASK or FSK. See [ASK, FSK and PSK](#/comp3721-w5/ask-fsk-psk)."
  },
  {
    "q": "**A14 (1 mark).** An ARP reply is broadcast to every system on the LAN.",
    "type": "tf",
    "answer": false,
    "explain": "False. The ARP request is broadcast (\"Looking for link-layer address of a node with IP address N₂\"); the reply is unicast, from the owner of that IP address back to the asker only. See [ARP](#/comp3721-w6/arp)."
  },
  {
    "q": "**A15 (1 mark).** In synchronous TDM, the data rate of the output link must be n times the data rate of a connection.",
    "type": "tf",
    "answer": true,
    "explain": "True, boxed on slide 29: *The data rate of the output link must be n times the data rate of a connection to guarantee the flow of data.* The slot lasts T/n; the frame lasts T. See [synchronous TDM](#/comp3721-w6/synchronous-tdm)."
  },
  {
    "q": "**A16 (1 mark).** A block code with datawords of k = 6 bits and codewords of n = 9 bits has 448 invalid codewords.",
    "type": "tf",
    "answer": true,
    "explain": "True. Invalid codewords = 2^n − 2^k = 2^9 − 2^6 = 512 − 64 = 448; the 64 valid ones are the encoded datawords. The unused words are *the trick* in error detection. See [block coding](#/comp3721-w7/block-coding)."
  },
  {
    "q": "**A17 (1 mark).** The simple parity-check code can detect any even number of errors.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 26: the simple parity check is guaranteed to detect one single error and can also find any **odd** number of errors. Two flipped bits keep the number of 1s even, so the codeword passes. Its d_min is 2. See [parity check](#/comp3721-w7/parity-check)."
  },
  {
    "q": "**A18 (1 mark).** In bit stuffing, the extra 0 is inserted after five consecutive 1s even when the next data bit is already 0.",
    "type": "tf",
    "answer": true,
    "explain": "True. The rule is unconditional: whenever five consecutive 1s follow a 0, add one 0. The receiver removes the 0 after every five 1s, so if the sender skipped it when the next bit is 0, the receiver would delete a real data bit. Slide 21 stuffs a 0 in front of a data 0. See [bit stuffing](#/comp3721-w7/bit-stuffing)."
  },
  {
    "q": "**A19 (1 mark).** In Stop-and-Wait, an acknowledgment number defines the sequence number of the frame just received.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 36: *An acknowledgment number always define the sequence number of the next frame to receive.* After Frame 0 arrives the receiver sends ACK 1. See [Simple and Stop-and-Wait](#/comp3721-w7/simple-and-stop-and-wait)."
  },
  {
    "q": "**A20 (1 mark).** The checksum is mostly used at the data-link layer rather than at the network and transport layers.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide 41: the checksum is *mostly used at the network and transport layers rather than the data-link layer*. The data-link layer uses the CRC. See [checksum](#/comp3721-w7/checksum)."
  }
]
```

## Part B: fill in the blanks (B1 to B20, 20 marks)

Type the slide's word for the blank; case does not matter.

```quiz
[
  {
    "q": "**B1 (1 mark).** A ________ is a set of rules that govern data communications; it represents an agreement between the communicating devices.",
    "type": "text",
    "answer": ["protocol"],
    "explain": "Protocol, the fifth of the five components (message, sender, receiver, transmission medium, protocol). See [components and data flow](#/comp3721-w1/components-data-flow)."
  },
  {
    "q": "**B2 (1 mark).** At the transport layer, the address that identifies a process on a host is the ________ number.",
    "type": "text",
    "answer": ["port"],
    "explain": "Port numbers. The four levels of addresses: names (application), port numbers (transport), logical IP addresses (network), link-layer MAC addresses (data link); the physical layer has none. See [encapsulation and addressing](#/comp3721-w1/encapsulation-addressing)."
  },
  {
    "q": "**B3 (1 mark).** Unlike a hub, a link-layer switch has ________ capability: it checks the MAC addresses in the frame and decides the outgoing port.",
    "type": "text",
    "answer": ["filtering"],
    "explain": "Filtering. A hub repeats a frame out of every port except the incoming one; a switch reads the destination MAC address and forwards on one port. See [connecting devices](#/comp3721-w1/connecting-devices)."
  },
  {
    "q": "**B4 (1 mark).** When two or more networks are connected, they become an ________.",
    "type": "text",
    "answer": ["internetwork", "internet"],
    "explain": "An internetwork, or internet with a lower-case i. The Internet (capital I) is the most notable internet. See [LAN, WAN and the Internet](#/comp3721-w1/lan-wan-internet)."
  },
  {
    "q": "**B5 (1 mark).** According to ________ analysis, any composite signal is a combination of simple sine waves with different frequencies, amplitudes and phases.",
    "type": "text",
    "answer": ["Fourier"],
    "explain": "Fourier analysis. A composite periodic signal gives discrete frequencies (the fundamental f and its harmonics); a nonperiodic one gives continuous frequencies. See [composite signals and bandwidth](#/comp3721-w2/composite-bandwidth)."
  },
  {
    "q": "**B6 (1 mark).** The distance a simple signal travels in one period is its ________.",
    "type": "text",
    "answer": ["wavelength", "λ"],
    "explain": "Wavelength, λ = c/f = c × T, used for light in optical fibre (in micrometres). See [wavelength](#/comp3721-w2/wavelength)."
  },
  {
    "q": "**B7 (1 mark).** ________ is the loss of energy to overcome the resistance of the medium; an amplifier compensates for it.",
    "type": "text",
    "answer": ["attenuation"],
    "explain": "Attenuation, the first of the three impairments (attenuation, distortion, noise). It is measured in decibels and is negative. See [attenuation and decibels](#/comp3721-w3/attenuation-decibel)."
  },
  {
    "q": "**B8 (1 mark).** The ________ product is the number of bits that can fill the link.",
    "type": "text",
    "answer": ["bandwidth-delay", "bandwidth–delay", "bandwidth delay", "bandwidth × delay", "bandwidth x delay"],
    "explain": "The bandwidth-delay product. With bursts that wait for an acknowledgment, the burst size that uses the link fully is 2 × bandwidth × delay. See [bandwidth-delay product](#/comp3721-w3/bandwidth-delay)."
  },
  {
    "q": "**B9 (1 mark).** In decoding a digital signal, the receiver calculates a running average of the received signal power. This average is called the ________.",
    "type": "text",
    "answer": ["baseline"],
    "explain": "The baseline. A long string of 0s or 1s makes it drift: baseline wandering. See [baseline wandering and DC](#/comp3721-w4/baseline-dc)."
  },
  {
    "q": "**B10 (1 mark).** The signal rate is also called the modulation rate, the pulse rate or the ________ rate.",
    "type": "text",
    "answer": ["baud"],
    "explain": "The baud rate, measured in baud: the number of signal elements sent in 1 s. The data rate (bit rate) is in bps. See [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate)."
  },
  {
    "q": "**B11 (1 mark).** ________ is another name for the sampling process.",
    "type": "text",
    "answer": ["PAM", "Pulse Amplitude Modulation", "pulse amplitude modulation (PAM)"],
    "explain": "PAM (Pulse Amplitude Modulation). Sampling is the first of PCM's three processes: sampling, quantizing, encoding. See [PCM](#/comp3721-w5/digitization-pcm)."
  },
  {
    "q": "**B12 (1 mark).** QAM uses two carriers, one in-phase and the other ________, out of phase with each other by 90°.",
    "type": "text",
    "answer": ["quadrature"],
    "explain": "Quadrature. On a constellation diagram the X axis is the in-phase carrier and the Y axis the quadrature carrier. See [constellation diagrams](#/comp3721-w5/constellation)."
  },
  {
    "q": "**B13 (1 mark).** ________ bands are strips of unused bandwidth that separate channels from each other, to prevent signals from overlapping and interference.",
    "type": "text",
    "answer": ["guard"],
    "explain": "Guard bands. n channels need n − 1 guard bands: B_link = n × B_channel + (n − 1) × guard. See [FDM](#/comp3721-w6/fdm)."
  },
  {
    "q": "**B14 (1 mark).** Link refers to the physical path. ________ refers to the portion of a link.",
    "type": "text",
    "answer": ["channel"],
    "explain": "Channel. A MUX puts n channels on 1 link; the DEMUX separates them again. See [multiplexing](#/comp3721-w6/multiplexing)."
  },
  {
    "q": "**B15 (1 mark).** ARP is one of the ________ protocols defined in the network layer.",
    "type": "text",
    "answer": ["auxiliary"],
    "explain": "Auxiliary. ARP maps an IP address to a link-layer address, and every host and router runs it all the time in the background. See [ARP](#/comp3721-w6/arp)."
  },
  {
    "q": "**B16 (1 mark).** At the CRC decoder, the remainder of dividing the received codeword by the divisor is called the ________.",
    "type": "text",
    "answer": ["syndrome"],
    "explain": "The syndrome. All 0s: the dataword is accepted; anything else: it is discarded. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "q": "**B17 (1 mark).** Byte stuffing adds one extra byte, the escape character (________), whenever there is a flag or an escape character in the text.",
    "type": "text",
    "answer": ["ESC", "escape"],
    "explain": "ESC. The receiver removes each ESC and treats the next character as data, not as a delimiting flag. An ESC in the data gets its own ESC too. See [framing](#/comp3721-w7/framing)."
  },
  {
    "q": "**B18 (1 mark).** In block coding, the 2^n − 2^k codewords that are not used (invalid codes) are the ________ in error detection.",
    "type": "text",
    "answer": ["trick"],
    "explain": "The trick: a corrupted codeword that lands on an unused word is caught and discarded; one that lands on another valid codeword is undetectable. See [block coding](#/comp3721-w7/block-coding)."
  },
  {
    "q": "**B19 (1 mark).** A ________ is a set of memory locations that can hold packets at the sender and receiver.",
    "type": "text",
    "answer": ["buffer"],
    "explain": "A buffer. When frames are produced faster than they are consumed, the receiving end buffers them; flow control either drops frames when the buffer is full or sends feedback to stop or slow down. See [flow and error control](#/comp3721-w7/flow-and-error-control)."
  },
  {
    "q": "**B20 (1 mark).** In one's complement arithmetic, adding the extra leftmost bits to the m rightmost bits is called ________.",
    "type": "text",
    "answer": ["wrapping", "wrap", "wrap-around", "wrap around", "wraparound"],
    "explain": "Wrapping, repeated until the sum fits in m bits. Slide 47: 36 = 100100 → 10 + 0100 = 0110 = 6. See [checksum](#/comp3721-w7/checksum)."
  }
]
```

## Part C: written response (C1 to C10, 30 marks)

Write two to four sentences on paper for each: name the thing in the slide's words, give the reason, give an example or a number. Then type the key word the question asks for and compare your sentences with the model answer.

```quiz
[
  {
    "q": "**C1 (3 marks).** Explain why the tasks of a network are divided into layers, and give the advantages of protocol layering. Then type the one-word advantage that makes each layer an independent black box.",
    "type": "text",
    "answer": ["modularity"],
    "explain": "Model answer: protocol layering divides a complex task into smaller, simpler tasks, and each layer offers a service (its service model) to the layer above while using the services of the layer below. The advantages are separating the services from the implementation, simpler and less expensive intermediate systems (a switch runs 2 layers, a router 3), and modularity: independent layers, so a change in one layer is transparent to the others. Example: a new LAN technology changes only the data-link and physical layers. See [why layers](#/comp3721-w1/why-layers)."
  },
  {
    "q": "**C2 (3 marks).** Give the three differences between a router and a link-layer switch. Then type what the router changes in a frame when it forwards it.",
    "type": "text",
    "answer": ["link-layer addresses", "link-layer address", "link-layer", "link layer addresses", "link layer address", "link layer", "MAC addresses", "MAC address", "MAC", "the link-layer source and destination addresses", "link-layer source and destination addresses"],
    "explain": "Model answer: (1) a router has a link-layer (MAC) address and an IP address for each interface; (2) it acts only on packets whose link-layer destination address matches the interface they arrive at; (3) it changes the link-layer source and destination addresses when it forwards the packet. It does this because it runs three layers (physical, data link, network) and is an internetworking device, while a switch runs two and only filters frames by MAC address within one network. See [connecting devices](#/comp3721-w1/connecting-devices)."
  },
  {
    "q": "**C3 (3 marks).** Explain the difference between a time-domain plot and a frequency-domain plot, and why the frequency-domain plot is useful. Then type what one simple sine wave looks like on a frequency-domain plot.",
    "type": "text",
    "answer": ["spike", "a spike", "one spike", "a single spike", "spikes"],
    "explain": "Model answer: a time-domain plot shows amplitude against time, and the phase is not explicitly shown. A frequency-domain plot shows peak amplitude against frequency, so one sine wave is a single spike at its frequency, with height equal to its peak amplitude. It is compact when a signal has many components: a composite periodic signal is a row of discrete spikes and a nonperiodic one a continuous band. See [sine wave](#/comp3721-w2/sine-wave) and [composite signals](#/comp3721-w2/composite-bandwidth)."
  },
  {
    "q": "**C4 (3 marks).** Explain the difference between the Nyquist bit rate and the Shannon capacity: the channel each one assumes, the formula, and what each tells us. Then type the name of the one that gives the upper limit.",
    "type": "text",
    "answer": ["Shannon", "Shannon capacity", "the Shannon capacity"],
    "explain": "Model answer: Nyquist assumes a noiseless channel and gives the theoretical maximum bit rate, BitRate = 2 × bandwidth × log₂ L, from the number of signal levels L. Shannon assumes a noisy channel (always the case in reality) and gives the capacity, C = bandwidth × log₂(1 + SNR), with no factor 2 and the SNR as a ratio, not in dB. *The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need.* Problem 3 of Part D chains them. See [Nyquist](#/comp3721-w3/nyquist) and [Shannon](#/comp3721-w3/shannon)."
  },
  {
    "q": "**C5 (3 marks).** Explain self-synchronization, and why a long run of 0s causes trouble in NRZ-I. Then type the one word for what a self-synchronizing signal uses to alert the receiver to the beginning, middle or end of a pulse.",
    "type": "text",
    "answer": ["transitions", "transition"],
    "explain": "Model answer: the receiver's bit intervals must correspond exactly to the sender's; a self-synchronizing signal includes timing information in the data, as transitions that reset the receiver's clock. NRZ-I changes level only for a 1, so a long run of 0s is a flat line with no transitions: the receiver's clock drifts and it miscounts the bits (a 0.1% faster clock reads 1 extra bit per 1000). Manchester has a transition in the middle of every bit, so it is self-synchronizing. See [self-synchronization](#/comp3721-w4/self-synchronization)."
  },
  {
    "q": "**C6 (3 marks).** Explain the differences between digital-to-analog conversion (ASK, FSK, PSK, QAM) and analog-to-analog conversion (AM, FM, PM). Then type the two-word name the slides give the digital-to-analog process besides modulation.",
    "type": "text",
    "answer": ["shift keying", "shift-keying"],
    "explain": "Model answer: digital-to-analog conversion takes digital data and analog-to-analog takes an analog signal; both produce a bandpass analog signal by changing the amplitude, frequency or phase of a carrier. The D2A process is called *modulation or shift keying*, and each signal element carries r = log₂ L bits (log₂ n for n constellation points), with a bandwidth set by the signal rate, B = (1 + d)S. A2A has no bits per element and its bandwidth comes from the modulating signal: B_AM = 2B, B_FM = 2(1 + β)B. QAM has no analog-to-analog twin. See [the differences](#/comp3721-midterm/differences)."
  },
  {
    "q": "**C7 (3 marks).** Explain ARP and its role when a frame crosses a link. Then type what ARP maps an IP address to.",
    "type": "text",
    "answer": ["link-layer address", "link-layer addresses", "link layer address", "MAC address", "MAC addresses", "MAC", "a link-layer address", "a MAC address", "physical address", "logical-link address"],
    "explain": "Model answer: ARP (Address Resolution Protocol) is an auxiliary protocol of the network layer that maps an IP address to a link-layer (MAC) address. A node looks up the next hop's IP address in its forwarding table, then broadcasts an ARP request (\"Looking for link-layer address of a node with IP address N₂\"); the owner replies by unicast with its link-layer address, which goes into the new frame's destination field. The IP addresses N_A and N_B never change on the journey; the link-layer addresses change at every hop. See [ARP](#/comp3721-w6/arp) and [Alice to Bob](#/comp3721-w6/alice-to-bob)."
  },
  {
    "q": "**C8 (3 marks).** Distinguish between error detection and error correction, and say which one is harder and why. Then type the one word for what correction must identify besides the exact number of corrupted bits.",
    "type": "text",
    "answer": ["location", "their location", "locations"],
    "explain": "Model answer: error detection only looks to see if any error has occurred; the number of corrupted bits is not important. Error correction must identify the exact number of corrupted bits and their location in the message, so the number of errors and the size of the message matter. *The correction of errors is more difficult than the detection*: correcting t errors needs d_min = 2t + 1, detecting s errors only d_min = s + 1. See [types of errors](#/comp3721-w7/types-of-errors)."
  },
  {
    "q": "**C9 (3 marks).** A CRC decoder finds a syndrome of all 0s. Explain the two things this can mean and give an example of the second. Then type the missing word of the slide's sentence: \"If syndrome is 0, either no bit is corrupted, or the decoder ________ to detect any errors.\"",
    "type": "text",
    "answer": ["failed"],
    "explain": "Model answer: a zero syndrome means either no bit is corrupted, or the decoder failed to detect the errors (slide 37). The second happens when the errors turn the codeword into another valid codeword: the remainder of a valid codeword is always 0. With divisor 1011, the codeword 1001110 corrupted by the pattern 0111010 becomes 1110100, itself a valid codeword (the codeword of 1110), so it is accepted although four bits are wrong. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "q": "**C10 (3 marks).** In Stop-and-Wait, explain what happens when an ACK is lost, and how the protocol handles the result. Then type what is added to each frame to fix it (two words).",
    "type": "text",
    "answer": ["sequence number", "sequence numbers", "sequence", "a sequence number"],
    "explain": "Model answer: the sender's timer expires (time-out), so it resends the saved frame; the receiver already delivered that frame, so without numbering it delivers a duplicate (slide 35). Slide 36 adds a sequence number and an acknowledgment number: frames are numbered 0, 1, 0, 1 and the ACK carries the number of the next frame expected. A resent Frame 0 that arrives when 1 is expected is a duplicate: the receiver discards it and sends ACK 1 again. See [Simple and Stop-and-Wait](#/comp3721-w7/simple-and-stop-and-wait)."
  }
]
```

## Part D: calculations (problems 1 to 10, 50 marks)

Each problem has five parts of one mark each. On paper, write the formula, the substitution with units and the answer with its unit and prefix.

### Problem 1: a sine equation and a wavelength (5 marks)

```quiz
[
  {
    "q": "**D1a (1 mark).** s(t) = 6 sin(40πt + π/3) V. What is the peak amplitude, in volts?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "V",
    "explain": "Compare with s(t) = A sin(2πft + φ): A = 6 V. A negative coefficient would still give a positive peak amplitude (and a 180° phase). See [sine wave](#/comp3721-w2/sine-wave)."
  },
  {
    "q": "**D1b (1 mark).** s(t) = 6 sin(40πt + π/3) V. What is the frequency, in Hz?",
    "type": "numeric",
    "answer": 20,
    "tolerance": 0,
    "unit": "Hz",
    "explain": "Set the coefficient of t equal to 2πf: 2πf = 40π → f = 40π / 2π = 20 Hz. See [sine wave](#/comp3721-w2/sine-wave)."
  },
  {
    "q": "**D1c (1 mark).** s(t) = 6 sin(40πt + π/3) V. What is the period, in ms?",
    "type": "numeric",
    "answer": 50,
    "tolerance": 0,
    "unit": "ms",
    "explain": "T = 1/f = 1/20 s = 0.05 s = 50 ms (1 ms = 10⁻³ s). See [sine wave](#/comp3721-w2/sine-wave)."
  },
  {
    "q": "**D1d (1 mark).** s(t) = 6 sin(40πt + π/3) V. What is the phase, in degrees?",
    "type": "numeric",
    "answer": 60,
    "tolerance": 0,
    "unit": "°",
    "explain": "φ = π/3 rad; 1 rad = 360°/2π, so φ = (π/3) × 180°/π = 60°, a sixth of a cycle. The + sign shifts the wave left. See [phase](#/comp3721-w2/phase)."
  },
  {
    "q": "**D1e (1 mark).** A 750 MHz signal travels in a vacuum. What is its wavelength, in cm?",
    "type": "numeric",
    "answer": 40,
    "tolerance": 0,
    "unit": "cm",
    "explain": "λ = c/f = (3 × 10⁸ m/s) / (750 × 10⁶ Hz) = 0.4 m = 40 cm. See [wavelength](#/comp3721-w2/wavelength)."
  }
]
```

### Problem 2: attenuation along a path, then SNR (5 marks)

```quiz
[
  {
    "q": "**D2a (1 mark).** A cable loses 0.6 dB per km. What is the loss of 7 km of it, in dB (with its sign)?",
    "type": "numeric",
    "answer": -4.2,
    "tolerance": 0.001,
    "unit": "dB",
    "explain": "Cable dB = dB/km × km = −0.6 × 7 = −4.2 dB. Attenuation is negative; dropping the sign makes it an amplification. See [attenuation and decibels](#/comp3721-w3/attenuation-decibel)."
  },
  {
    "q": "**D2b (1 mark).** A 2.5 mW signal passes through 7 km of cable at −0.6 dB/km, then through an amplifier of +6 dB. What is the power at the amplifier's output, in mW?",
    "type": "numeric",
    "answer": 3.784,
    "tolerance": 0.01,
    "unit": "mW",
    "explain": "Decibels add along a path: −4.2 dB + 6 dB = +1.8 dB. P₂ = P₁ × 10^(dB/10) = 2.5 × 10^0.18 = 2.5 × 1.5136 = 3.784 mW. The power went up because the net path is positive. See [attenuation and decibels](#/comp3721-w3/attenuation-decibel)."
  },
  {
    "q": "**D2c (1 mark).** The signal passes through 7 devices, each adding an average noise power of 3 μW. What is the total average noise power, in μW?",
    "type": "numeric",
    "answer": 21,
    "tolerance": 0,
    "unit": "μW",
    "explain": "Noise from k devices = k × each = 7 × 3 μW = 21 μW. See [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr)."
  },
  {
    "q": "**D2d (1 mark).** The average signal power is 84 mW and the average noise power is 21 μW. What is the SNR (a ratio, no unit)?",
    "type": "numeric",
    "answer": 4000,
    "tolerance": 0,
    "explain": "Convert to one unit first: 84 mW = 84 000 μW. SNR = average signal power / average noise power = 84 000 / 21 = 4000. Dividing 84 by 21 without converting gives 4, off by a factor of 1000. See [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr)."
  },
  {
    "q": "**D2e (1 mark).** SNR = 4000. What is SNR_dB, in dB?",
    "type": "numeric",
    "answer": 36.02,
    "tolerance": 0.02,
    "unit": "dB",
    "explain": "SNR_dB = 10 log₁₀ SNR = 10 log₁₀ 4000 = 10 × 3.602 = 36.02 dB. See [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr)."
  }
]
```

### Problem 3: Shannon first, then Nyquist (5 marks)

```quiz
[
  {
    "q": "**D3a (1 mark).** On a channel, the average signal power is 4.5 mW and the average noise power is 300 μW. What is the SNR (a ratio)?",
    "type": "numeric",
    "answer": 15,
    "tolerance": 0,
    "explain": "4.5 mW = 4500 μW; SNR = 4500 / 300 = 15 (SNR_dB = 10 log₁₀ 15 = 11.76 dB, not needed for Shannon). See [distortion, noise and SNR](#/comp3721-w3/distortion-noise-snr)."
  },
  {
    "q": "**D3b (1 mark).** The channel has a bandwidth of 350 kHz and an SNR of 15. What is its Shannon capacity, in Mbps?",
    "type": "numeric",
    "answer": 1.4,
    "tolerance": 0.001,
    "unit": "Mbps",
    "explain": "C = bandwidth × log₂(1 + SNR) = 350 000 × log₂ 16 = 350 000 × 4 = 1 400 000 bps = 1.4 Mbps. No factor 2 in Shannon, and the SNR goes in as a ratio. See [Shannon](#/comp3721-w3/shannon)."
  },
  {
    "q": "**D3c (1 mark).** To send at the 1.4 Mbps capacity over the 350 kHz channel, how many signal levels does the Nyquist formula ask for?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "levels",
    "explain": "Nyquist: 1 400 000 = 2 × 350 000 × log₂ L → log₂ L = 1 400 000 / 700 000 = 2 → L = 2² = 4. Shannon gives the upper limit; Nyquist tells how many signal levels we need. See [Nyquist](#/comp3721-w3/nyquist)."
  },
  {
    "q": "**D3d (1 mark).** How many bits does each of those 4 signal levels carry?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bits per level = log₂ L = log₂ 4 = 2. See [digital signals](#/comp3721-w2/digital-signals)."
  },
  {
    "q": "**D3e (1 mark).** If the same 350 kHz channel were noiseless and used 8 signal levels, what would the Nyquist bit rate be, in Mbps?",
    "type": "numeric",
    "answer": 2.1,
    "tolerance": 0.001,
    "unit": "Mbps",
    "explain": "BitRate = 2 × bandwidth × log₂ L = 2 × 350 000 × 3 = 2 100 000 bps = 2.1 Mbps. On the real, noisy channel this rate is impossible: *No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel* (1.4 Mbps). See [Nyquist](#/comp3721-w3/nyquist)."
  }
]
```

### Problem 4: Manchester rates and two waveforms (5 marks)

```quiz
[
  {
    "q": "**D4a (1 mark).** A link sends 14 Mbps with Manchester encoding (r = 1/2), average case c = 1/2. What is the signal rate, in Mbaud?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "S = c × N × 1/r = 1/2 × 14 Mbps × 1/(1/2) = 1/2 × 14 × 2 = 14 Mbaud. Manchester's signal rate is higher than NRZ-L's (7 Mbaud at r = 1): its drawback. See [data rate and signal rate](#/comp3721-w4/data-rate-signal-rate)."
  },
  {
    "q": "**D4b (1 mark).** The same 14 Mbps Manchester signal (c = 1/2, r = 1/2). What minimum bandwidth does it need, in MHz?",
    "type": "numeric",
    "answer": 14,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "B = c × N × 1/r = 1/2 × 14 × 2 = 14 MHz. *The baud rate, not the bit rate, determines the required bandwidth*, so B has the same value as S. See [digital bandwidth](#/comp3721-w4/digital-bandwidth)."
  },
  {
    "q": "**D4c (1 mark).** A channel has a bandwidth of 120 kHz and the signal uses 8 levels (c = 1/2). What is the maximum data rate N_max, in kbps?",
    "type": "numeric",
    "answer": 720,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "N_max = (1/c) × B × r with r = log₂ L = 3: 2 × 120 000 × 3 = 720 000 bps = 720 kbps, the Nyquist formula again. See [digital bandwidth](#/comp3721-w4/digital-bandwidth)."
  },
  {
    "q": "**D4d (1 mark).** Encode 0000000011 in NRZ-L with the slides' convention (positive for 0, negative for 1). Type one + or - per bit, without spaces.",
    "type": "text",
    "answer": ["++++++++--", "++++++++−−"],
    "explain": "Slide 55: NRZ-L is positive for 0 and negative for 1, so eight 0s give eight + levels and the two 1s give − −: ++++++++−−. In 1 V units the mean is (8 − 2)/10 = +0.6, not zero. See [unipolar and polar NRZ](#/comp3721-w4/unipolar-polar-nrz)."
  },
  {
    "q": "**D4e (1 mark).** The data 0000000011 is sent once in NRZ-L and once in Manchester (0 high-to-low, 1 low-to-high). Select every problem that can occur.",
    "options": ["NRZ-L: baseline wandering", "NRZ-L: no self-synchronization", "NRZ-L: a DC component", "Manchester: baseline wandering", "Manchester: no self-synchronization", "Manchester: a DC component"],
    "answer": [0, 1, 2],
    "explain": "NRZ-L holds + for the eight 0s: a long run of one level makes the baseline drift, gives the receiver no transitions to reset its clock, and leaves a nonzero mean (+0.6 V per volt of level), so all three polar NRZ problems occur. Manchester sends +− for each 0 and −+ for each 1: a mid-bit transition in every bit (self-synchronization), and each bit has a positive and a negative voltage contribution, so no DC component and no baseline wandering. See [baseline wandering and DC](#/comp3721-w4/baseline-dc) and [Manchester](#/comp3721-w4/manchester)."
  }
]
```

### Problem 5: a PCM chain (5 marks)

```quiz
[
  {
    "q": "**D5a (1 mark).** A low-pass analog signal has frequencies up to 13 kHz. What is the minimum sampling rate, in samples/s?",
    "type": "numeric",
    "answer": 26000,
    "tolerance": 0,
    "unit": "samples/s",
    "explain": "Low-pass: bandwidth = highest frequency. Nyquist: f_s = 2 × f_max = 2 × 13 000 = 26 000 samples/s. For a bandpass signal given only its bandwidth, the rate cannot be found. See [Nyquist sampling](#/comp3721-w5/nyquist-sampling)."
  },
  {
    "q": "**D5b (1 mark).** The same signal is quantized with L = 64 levels. How many bits per sample (n_b)?",
    "type": "numeric",
    "answer": 6,
    "tolerance": 0,
    "unit": "bits",
    "explain": "n_b = log₂ L = log₂ 64 = 6 bits per sample. See [encoding and bit rate](#/comp3721-w5/encoding-bit-rate)."
  },
  {
    "q": "**D5c (1 mark).** f_s = 26 000 samples/s and n_b = 6. What is the PCM bit rate, in kbps?",
    "type": "numeric",
    "answer": 156,
    "tolerance": 0,
    "unit": "kbps",
    "explain": "Bit rate = f_s × n_b = 26 000 × 6 = 156 000 bps = 156 kbps. See [encoding and bit rate](#/comp3721-w5/encoding-bit-rate)."
  },
  {
    "q": "**D5d (1 mark).** The analog signal's bandwidth is 13 kHz and n_b = 6 (c = 1/2, r = 1). What is the minimum bandwidth of the digitized signal, in kHz?",
    "type": "numeric",
    "answer": 78,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_min = c × n_b × 2 × B_analog × 1/r = 1/2 × 6 × 2 × 13 × 1 = n_b × B_analog = 6 × 13 = 78 kHz: *the price we pay for digitization*. See [quantization error and bandwidth](#/comp3721-w5/quantization-error-bandwidth)."
  },
  {
    "q": "**D5e (1 mark).** With n_b = 6 bits per sample, what is the SNR_dB due to quantization, in dB?",
    "type": "numeric",
    "answer": 37.88,
    "tolerance": 0.01,
    "unit": "dB",
    "explain": "SNR_dB = 6.02 n_b + 1.76 = 6.02 × 6 + 1.76 = 36.12 + 1.76 = 37.88 dB. See [quantization error and bandwidth](#/comp3721-w5/quantization-error-bandwidth)."
  }
]
```

### Problem 6: QAM, baud and a constellation point (5 marks)

```quiz
[
  {
    "q": "**D6a (1 mark).** A 128-QAM constellation has 128 points. How many bits does each signal element carry?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "bits",
    "explain": "A modulation with n constellation points transmits log₂ n bits per signal element: log₂ 128 = 7. See [constellation diagrams](#/comp3721-w5/constellation)."
  },
  {
    "q": "**D6b (1 mark).** A 128-QAM link sends 56 Mbps. What is its baud rate, in Mbaud?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "Mbaud",
    "explain": "r = log₂ 128 = 7; S = N/r = 56 / 7 = 8 Mbaud. In analog transmission of digital data, baud rate ≤ bit rate. See [ASK, FSK and PSK](#/comp3721-w5/ask-fsk-psk)."
  },
  {
    "q": "**D6c (1 mark).** That 8 Mbaud QAM signal has d = 0. What bandwidth does it need, in MHz?",
    "type": "numeric",
    "answer": 8,
    "tolerance": 0,
    "unit": "MHz",
    "explain": "QAM has the same minimum required bandwidth as ASK and PSK: B = (1 + d)S = (1 + 0) × 8 Mbaud = 8 MHz. The slides leave d undefined; it is a factor between 0 and 1 (textbook). See [ASK, FSK and PSK](#/comp3721-w5/ask-fsk-psk)."
  },
  {
    "q": "**D6d (1 mark).** A constellation point has an in-phase component of 20 V and a quadrature component of 21 V. What is its amplitude, in volts?",
    "type": "numeric",
    "answer": 29,
    "tolerance": 0,
    "unit": "V",
    "explain": "The point's distance from the origin is its amplitude: amplitude² = I² + Q² = 20² + 21² = 400 + 441 = 841 → amplitude = 29 V. The angle is the phase. See [constellation diagrams](#/comp3721-w5/constellation)."
  },
  {
    "q": "**D6e (1 mark).** How many constellation points does a QAM scheme need to carry 9 bits per signal element?",
    "type": "numeric",
    "answer": 512,
    "tolerance": 0,
    "unit": "points",
    "explain": "log₂ n = 9 → n = 2⁹ = 512 points (512-QAM). See [constellation diagrams](#/comp3721-w5/constellation)."
  }
]
```

### Problem 7: AM, FM and an FDM link (5 marks)

```quiz
[
  {
    "q": "**D7a (1 mark).** An audio signal with a bandwidth of 4.5 kHz is sent by AM. What bandwidth does the modulated signal need, in kHz?",
    "type": "numeric",
    "answer": 9,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_AM = 2B = 2 × 4.5 = 9 kHz, centred on the carrier frequency. See [AM, FM and PM](#/comp3721-w5/am-fm-pm)."
  },
  {
    "q": "**D7b (1 mark).** A modulating signal with a bandwidth of 7 kHz is sent by FM with β = 5. What bandwidth does the FM signal need, in kHz?",
    "type": "numeric",
    "answer": 84,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_FM = 2(1 + β)B = 2 × (1 + 5) × 7 = 84 kHz. Compare FM radio: 2(1 + 4) × 15 = 150 kHz + 50 kHz guard = 200 kHz. See [AM, FM and PM](#/comp3721-w5/am-fm-pm)."
  },
  {
    "q": "**D7c (1 mark).** Eight 9 kHz channels are multiplexed by FDM with a 1.5 kHz guard band between neighbouring channels. What is the minimum link bandwidth, in kHz?",
    "type": "numeric",
    "answer": 82.5,
    "tolerance": 0,
    "unit": "kHz",
    "explain": "B_link = n × B_channel + (n − 1) × guard = 8 × 9 + 7 × 1.5 = 72 + 10.5 = 82.5 kHz. See [FDM](#/comp3721-w6/fdm)."
  },
  {
    "q": "**D7d (1 mark).** How many guard bands does an FDM link of 8 channels need?",
    "type": "numeric",
    "answer": 7,
    "tolerance": 0,
    "unit": "guard bands",
    "explain": "n channels → n − 1 guard bands between them: 8 − 1 = 7 (slide Example 1: 5 channels, 4 guard bands). See [multiplexing examples](#/comp3721-w6/multiplexing-examples)."
  },
  {
    "q": "**D7e (1 mark).** A link has 120 kHz of bandwidth. How many 9 kHz channels with 1.5 kHz guard bands fit on it?",
    "type": "numeric",
    "answer": 11,
    "tolerance": 0,
    "unit": "channels",
    "explain": "Need 9n + 1.5(n − 1) ≤ 120 → 10.5n ≤ 121.5 → n ≤ 11.57 → 11 channels. Check: 11 × 9 + 10 × 1.5 = 114 kHz fits; 12 × 9 + 11 × 1.5 = 124.5 kHz does not. Round down: a fraction of a channel cannot be sent. See [FDM](#/comp3721-w6/fdm)."
  }
]
```

### Problem 8: synchronous TDM with a framing bit (5 marks)

```quiz
[
  {
    "q": "**D8a (1 mark).** Seven sources each create 625 characters per second; each character is 8 bits. What is the data rate of each source, in bps?",
    "type": "numeric",
    "answer": 5000,
    "tolerance": 0,
    "unit": "bps",
    "explain": "625 characters/s × 8 bits = 5000 bps = 5 kbps per source. See [E06 worked](#/comp3721-w6/e06-worked)."
  },
  {
    "q": "**D8b (1 mark).** The seven 625 characters/s sources are multiplexed by synchronous TDM with the character as the unit. What is the frame rate, in frames/s?",
    "type": "numeric",
    "answer": 625,
    "tolerance": 0,
    "unit": "frames/s",
    "explain": "Frame rate = input unit rate = 625 frames/s: *The frame rate is always the same as any input rate.* See [synchronous TDM](#/comp3721-w6/synchronous-tdm)."
  },
  {
    "q": "**D8c (1 mark).** At 625 frames/s, what is the duration of each frame, in ms?",
    "type": "numeric",
    "answer": 1.6,
    "tolerance": 0.001,
    "unit": "ms",
    "explain": "Frame duration = 1 / frame rate = 1/625 s = 0.0016 s = 1.6 ms, the same as the duration of one input character. See [synchronous TDM](#/comp3721-w6/synchronous-tdm)."
  },
  {
    "q": "**D8d (1 mark).** Each frame carries one 8-bit character from each of the 7 sources plus 1 framing bit. How many bits are in each frame?",
    "type": "numeric",
    "answer": 57,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Bits per frame = n × unit + framing = 7 × 8 + 1 = 57 bits. The framing bit goes at the beginning of each frame. See [rate management](#/comp3721-w6/tdm-rate-management)."
  },
  {
    "q": "**D8e (1 mark).** 625 frames/s, 57 bits per frame. What is the data rate of the link, in bps?",
    "type": "numeric",
    "answer": 35625,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Link rate = frame rate × bits per frame = 625 × 57 = 35 625 bps: 35 000 bps of data (7 × 5000) plus 625 bps of framing. Leaving the framing bit out gives 35 000, the E06 trap. See [E06 worked](#/comp3721-w6/e06-worked)."
  }
]
```

### Problem 9: CRC division and two checksums (5 marks)

```quiz
[
  {
    "q": "**D9a (1 mark).** A CRC encoder uses the divisor 10111 on the dataword 110010. What is the remainder? Type the bits without spaces.",
    "type": "text",
    "answer": ["1000"],
    "explain": "Divisor size = n − k + 1 = 5, so append n − k = 4 zeros: dividend 1100100000. Slide-38 layout: 11001 ⊕ 10111 = 01110 → bring down 0 → 11100 ⊕ 10111 = 01011 → bring down 0 → 10110 ⊕ 10111 = 00001 → bring down 0 → 00010 ⊕ 00000 = 00010 (leftmost bit 0: use 00000) → bring down 0 → 00100 ⊕ 00000 = 00100 → bring down 0 → 01000 ⊕ 00000 = 01000. Quotient 111000 (discarded); remainder = the last 4 bits, 1000. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "q": "**D9b (1 mark).** Dataword 110010, divisor 10111, remainder 1000. What codeword is sent? Type the bits without spaces.",
    "type": "text",
    "answer": ["1100101000"],
    "explain": "Codeword = dataword + remainder = 110010 | 1000 = 1100101000, a 10-bit codeword: C(10, 6). Check: 1100101000 ÷ 10111 leaves syndrome 0000. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "q": "**D9c (1 mark).** The codeword 1100101000 (divisor 10111) arrives as 1110101000: the third bit flipped. What is the syndrome? Type the bits without spaces.",
    "type": "text",
    "answer": ["0001", "1"],
    "explain": "Divide the whole received word, no zeros added: 11101 ⊕ 10111 = 01010 → bring down 0 → 10100 ⊕ 10111 = 00011 → bring down 0 → 00111 ⊕ 00000 = 00111 → bring down 0 → 01110 ⊕ 00000 = 01110 → bring down 0 → 11100 ⊕ 10111 = 01011 → bring down 0 → 10110 ⊕ 10111 = 00001. Syndrome 0001 (1 is accepted too: the leading zeros carry no information). Non-zero, so the dataword is discarded. See [CRC division](#/comp3721-w7/crc-division)."
  },
  {
    "q": "**D9d (1 mark).** The message is five 4-bit numbers: 12, 7, 15, 9, 6. What checksum does the sender append? Type it as 4 bits without spaces.",
    "type": "text",
    "answer": ["1011"],
    "explain": "Sum = 12 + 7 + 15 + 9 + 6 = 49 = 110001 in binary. Wrap: the extra leftmost bits 11 (= 3) are added to the 4 rightmost bits 0001 (= 1): 3 + 1 = 4 = 0100. Complement: 1111 − 0100 = 1011 (= 11). The sender sends 12, 7, 15, 9, 6, 11. Receiver check: 49 + 11 = 60 = 111100 → 11 + 1100 = 1111 → complement 0000 → accept. See [checksum](#/comp3721-w7/checksum)."
  },
  {
    "q": "**D9e (1 mark).** A message is three 16-bit words in hex: 5A3C, C4E1, 9B07. What is the checksum, in hex? Type 4 hex digits, with or without 0x.",
    "type": "text",
    "answer": ["45DA", "0x45DA"],
    "explain": "Add in hex: 5A3C + C4E1 = 11F1D; 11F1D + 9B07 = 1BA24. Wrap: the carry 1 left of the four rightmost digits is added to them: BA24 + 1 = BA25. Complement digit by digit, F − d: F−B = 4, F−A = 5, F−2 = D, F−5 = A → 45DA. Receiver: 1BA24 + 45DA = 1FFFE → FFFE + 1 = FFFF → complement 0000 → accept. See [checksum](#/comp3721-w7/checksum)."
  }
]
```

### Problem 10: minimum Hamming distance and bit stuffing (5 marks)

```quiz
[
  {
    "q": "**D10a (1 mark).** A code has the four codewords 00000000, 11100011, 00111110, 11011101. What is its minimum Hamming distance d_min, in bits?",
    "type": "numeric",
    "answer": 5,
    "tolerance": 0,
    "unit": "bits",
    "explain": "XOR every pair and count the 1s: d(00000000, 11100011) = 5; d(00000000, 00111110) = 5; d(00000000, 11011101) = 6; d(11100011, 00111110): XOR 11011101 → 6; d(11100011, 11011101): XOR 00111110 → 5; d(00111110, 11011101): XOR 11100011 → 5. The smallest is d_min = 5. (The XOR of two codewords is a codeword, so the code is linear.) See [Hamming distance](#/comp3721-w7/hamming-distance)."
  },
  {
    "q": "**D10b (1 mark).** A code has d_min = 5. How many errors can it detect in all cases?",
    "type": "numeric",
    "answer": 4,
    "tolerance": 0,
    "unit": "errors",
    "explain": "Slide 22: to guarantee detecting up to s errors, d_min = s + 1, so s = d_min − 1 = 5 − 1 = 4. See [Hamming distance](#/comp3721-w7/hamming-distance)."
  },
  {
    "q": "**D10c (1 mark).** A code has d_min = 5. How many errors can it correct?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "errors",
    "explain": "Slide 53: to correct t errors, d_min = 2t + 1, so t = (5 − 1)/2 = 2. Correction always needs more distance than detection. See [FEC](#/comp3721-w7/fec)."
  },
  {
    "q": "**D10d (1 mark).** Bit-stuff the data 0111110111111001111 for a bit-oriented frame (flag 01111110). Type the stuffed bits without spaces.",
    "type": "text",
    "answer": ["011111001111101001111"],
    "explain": "After a 0, count consecutive 1s; at five, insert a 0 and restart the count. 0 11111 → stuff 0, then the data's own 0 (stuffed anyway, even though the next bit is already 0) → 0 11111 → stuff 0, then the sixth 1 and 001111 (only four 1s, nothing stuffed): 0 11111 0 0 11111 0 1 001111 = 011111001111101001111. The receiver removes the 0 after every five 1s. See [bit stuffing](#/comp3721-w7/bit-stuffing)."
  },
  {
    "q": "**D10e (1 mark).** The 19-bit data 0111110111111001111 is bit-stuffed. How many extra bits does stuffing add?",
    "type": "numeric",
    "answer": 2,
    "tolerance": 0,
    "unit": "bits",
    "explain": "Two runs of five 1s get a stuffed 0 each: 011111001111101001111 has 21 bits, 21 − 19 = 2 extra bits. The final 1111 is only four 1s. See [bit stuffing](#/comp3721-w7/bit-stuffing)."
  }
]
```
