# COMP 3721 Weeks 1–2 — facts and worked answers transcribed from the instructor's material

Source files (Learning Hub export, 2026-09-22): `D:/BCIT/COMP3721/COMP3721 - 00 - Course Introduction.pdf`,
`lectures/COMP3721 - 01a - Week 1 - Part 1.pdf` (69 slides), `01b - Week 1 - Part 2.pdf` (32), `01c - Week 1 - Complementary Notes.pdf` (1 page),
`02 - Week 2 - Copy.pdf` (70); `exercises/A01 - Math Review.pdf`, `A02 - Phase and Unit Circle.pdf`, `E01`/`E02 Week 1/2 Exercises (with Answers)`,
`Sample Quiz Questions.pdf`, `E03 - Week 3 Exercises.pdf` (Week 3, out of scope: dB loss and SNR).
Textbook: Forouzan, *Data Communications and Networking with TCP/IP Protocol Suite*, 6th ed. Reading: 01a -> Ch 1 §1.1–1.3, §1.8; 01b -> §1.4–1.6; 02 -> Ch 2 §2.1, §2.8.

## Course intro (00)
- Lecture Thu 10:30–13:20 SW05-1850. Labs Tue (3O 11:30, 3T 13:30, 3B 15:30, Marco) / Thu 09:30 (3G, Jocelyn).
- 10 quizzes in labs 20%, 4 assignments 20%, midterm 30%, final 30%; minimum 50% average of midterm+final to pass. No make-ups; late work not accepted.
- AI policy: allowed for learning/validating, **not** for answering quiz and assignment questions.
- Announcement (Sep 10): one A4/letter study note, single-sided, preferably hand-written, plus a calculator, for quizzes. **Quiz 1 = Lecture Notes 01a only.**

## 01a — Data communications, networks, Internet
- Communication: exchange of information. Telecommunication: communication at a distance (telephony, telegraphy, television).
- Data: raw facts or information presented in a form agreed upon by the parties (sender and receiver): text, numbers, images, audio, video.
- Data communications: the exchange of data between two devices via some form of transmission medium.
- Data communications system: a network of hardware and software that enables the exchange of data between devices over various transmission mediums.
- Media: fibre optic carries light; air/space carries radio (electromagnetic) waves; spoken English = variations in air pressure (mechanical sound waves). Wired communication needs an electrically conductive material.
- Digital communication: electronic transmission of information using digital signals; all messages represented and transmitted as **bits**. Analog communication: continuous signals varying in amplitude, frequency, or phase.
- Effectiveness, four fundamental characteristics: **Delivery** (correct destination), **Accuracy**, **Timeliness**, **Jitter** (uneven delay in delivery of audio/video packets).
- Benefits: real-time data/information sharing and analysis; enhanced connectivity; cost saving; expanded social engagement.
- Five components: **message** (text, numbers, pictures, audio, video), **sender** (computer, workstation, telephone handset, video camera), **receiver** (computer, workstation, handset, television), **transmission medium** (twisted-pair wire, coaxial cable, fibre-optic cable, air), **protocol** (a set of rules that govern data communications; represents an agreement between the communicating devices).
- Data flow: **simplex** = unidirectional (mainframe -> monitor; TV icon); **half-duplex** = two-directional one at a time (walkie-talkie); **full-duplex** = two-directional simultaneously (telephone). Sample quiz T/F: "In full-duplex mode, signals going in one direction share the capacity of the link with signals going in the other direction" -> **True** (Forouzan: capacity is shared, either two physical paths or divided capacity).
- Network: a system or structure composed of interconnected nodes or entities using some links. Nodes = individual entities/points (like stations); edges = links/connections (like railways).
- Computer network: interconnection of a set of devices capable of communication. Devices (nodes): **host / end system** (large computer, desktop, laptop, workstation, cellular phone) or **connecting / networking / communication device** (router, switch, modem). Edges: wired or wireless media (cable, air).
- Criteria: **Performance** (throughput and delay), **Reliability** (accuracy of delivery, failure rate, recovery time, robustness), **Security** (protect from unauthorized access/damage; policies for recovery from breaches and data loss).
- Type of connection: **point-to-point** = dedicated link between two devices, capacity reserved (wire, microwave, satellite links; TV remote example). **Multipoint (multidrop)** = more than two devices share a single link; capacity shared, either **spatially shared** (simultaneously) or **timeshared** (take turns).
- Topology: geometric representation of the relationship of all links and linking devices (nodes) to one another. Four basic: mesh, star, bus, ring.
  - **Mesh**: every device has a dedicated point-to-point link to every other device. Adv: each connection carries its own data load (dedicated links); robustness; privacy and security; ease of fault identification and fault isolation. Disadv: difficult installation and reconnection; wiring can be greater than available space; expensive hardware. Links = **C(n,2) = n(n-1)/2**.
  - **Star**: each device has a dedicated point-to-point link only to a central controller, usually called a **hub**. Adv: less expensive than mesh; ease of installation and reconfiguration; less cabling; robustness; easy fault identification and isolation. Disadv: dependency of the whole topology on one single point; more cabling than bus and ring. Links = **n**.
  - **Bus**: multipoint; one long cable as a backbone; drop lines and taps; limit on the number of taps and on distance between taps. Adv: ease of installation; less cabling than mesh and star. Disadv: difficult reconnection and adding new devices; difficult fault isolation. Links = **1 backbone + n drop lines**.
  - **Ring**: each device has a dedicated point-to-point connection with only the two devices on either side; a repeater for each device. Adv: ease of installation and reconfiguration; ease of fault isolation. Disadv: unidirectional traffic; a break in the ring can disable the whole network. Links = n.
- **LAN**: usually privately owned; connects hosts in a single office, building, or campus; limited in size; each host has a unique identifier; WLAN if wireless. **WAN**: wider geographical span (town, state, country, world); interconnects switches, routers, modems; created and run by communication companies and leased by an organization; two types: **point-to-point WAN** (connects two communication devices) and **switched WAN** (more than two; used in the backbone of global communication today).
- Two or more networks connected -> **internetwork**; an **internet** (lower-case i) = two or more networks that can communicate; the **Internet** (capital I) = the most notable internet, thousands of interconnected networks.
- History: first message Oct 29 1969, 10:30 pm, UCLA, "LO" (Charley Kline, Leonard Kleinrock); ARPANET founded by DoD; main design goal **survivability**; Vint Cerf. 1990 Sir Tim Berners-Lee invented the WWW; 1993 first popular browser Mosaic -> Netscape -> Mozilla -> Firefox.
- Internet = network of networks. **End systems / hosts** sit at the edge, run application programs (e.g. browser). **Access network** = the network that physically connects an end system to the first router (edge router). **Core network** = routers, link-layer switches and links interconnecting end systems. Structure: customer networks <-> provider networks (national/regional ISPs) <-> backbones (international ISPs), joined at **peering points**.
- Accessing the Internet: telephone networks (dial-up; **DSL**, line used simultaneously for voice and data), cable networks, wireless networks, direct connection.
- **Internet standard**: a thoroughly tested specification and formalized regulation that must be followed; created and published by **IETF**; needed for **interoperability**. **RFC** (Request for Comment): a series of documents defining standards, protocols, procedures, technologies; assigned a number; technical and detailed; IETF develops and publishes them; RFC-1 written 1969.

## 01b — Layering, TCP/IP, OSI
- Networks are complex: hosts, routers, links of various media, applications, protocols, hardware, software. Air-travel analogy: ticketing, baggage, gate, runway, routing services; each layer implements a service via its own internal actions, relying on services of the layer below.
- Protocol: defines **what** is communicated, **how** and **when**; the format and order of messages exchanged and the actions taken on transmission/receipt of a message or other event.
- First principle: for bidirectional communication each layer must be able to perform two opposite tasks. Second principle: the two objects under each layer at both sites should be identical.
- Protocol layering divides the complex task into smaller, simpler tasks. **Service model** of a layer = the services it offers to the layer above. Advantages: (1) separating services from implementation, (2) simpler and less expensive intermediate systems, (3) modularity (independent layers, black box) -> ease of maintenance/updating, change in one layer transparent to the rest.
- Protocol suite (stack): a set of protocols organized in different layers, designed to work together. Two models: TCP/IP protocol suite (used in the Internet today; **five layers**) and OSI model (ISO standard; **seven layers**).
- L1 **Physical**: carries individual bits across the link (node to next); bits from the frame transformed to signals; protocols are link dependent (rely on the medium). PDU: bits.
- L2 **Data link**: data transfer between neighbouring network elements (without errors). PDU **frame**. Ethernet, 802.11 (WiFi).
- L3 **Network**: routing of datagrams from source to destination (host-to-host). PDU **datagram/packet**; "IP layer"; IP, ICMP, DHCP, ARP, routing protocols.
- L4 **Transport**: logical communication between application processes on different hosts (process-to-process delivery of the entire message). PDU **segment / user datagram**; TCP, UDP, SCTP; almost always implemented in software in end systems.
- L5 **Application**: communication between end systems for a network application. PDU **message**; IMAP, SMTP, HTTP, FTP, Telnet, DNS; software in end systems.
- PDU = Protocol Data Unit: a unit of data passed between layers of a protocol stack. Example frame (Ethernet): preamble 8 B, SFD, dest MAC 6 B, source MAC 6 B, EtherType/length 2 B (0x0800 IPv4, 0x0806 ARP, 0x86DD IPv6), payload 46–1500 B, CRC/FCS 4 B; frame 64–1522 B.
- Communication through an internet: source A and destination B run all five layers; a **switch** runs data link + physical; a **router** runs network + data link + physical.
- Encapsulation (source, top-down): message M -> segment H_T M -> datagram H_N H_T M -> frame H_L H_N H_T M -> bits. Switch: link layer reads the frame, passes it on. Router: strips H_L, reads H_N, adds a new H_L. Destination decapsulates bottom-up.
- Four levels of addresses: application layer **names** (URLs, email addresses); transport **port numbers** (identify a process on a host); network **logical (IP) addresses** (uniquely define a host on the Internet); data-link **link-layer (MAC) addresses** (define a specific host or router in a network, LAN or WAN). Physical layer: none.
- Physical + data-link layers are typically implemented in a **NIC** (Network Interface Card); hosts implement all 5 layers.
- OSI: L7 Application, L6 Presentation, L5 Session, L4 Transport, L3 Network, L2 Data Link, L1 Physical. Presentation (data compression, encryption: interpret meaning of data) and Session (session management, synchronization) are folded into TCP/IP's application layer.

## 01c — Connecting devices
- Hub: physical layer only; repeats whatever it hears on one port out all other ports (multiport/multiway repeater); forwards to all ports except the incoming one.
- Link-layer switch: physical + data-link; regenerates the signal; checks source/destination **MAC addresses** in the frame; has **filtering** capability, decides the outgoing port (difference from a hub).
- Router: physical + data-link + network; regenerates the signal, checks physical (link) addresses, checks network-layer addresses; connects networks -> an **internetworking device**; two networks connected by a router = an internetwork/internet.
- Three differences router vs repeater/switch: (1) router has a physical (link-layer/MAC) address **and** a logical (IP) address for each interface; (2) router acts only on packets whose link-layer destination address matches the arriving interface; (3) router **changes** the link-layer source and destination addresses when it forwards.

## A01 / A02 — Math review
- Transformations: translation y = f(x + c) moves left if c > 0, right if c < 0; y = f(x) + c up/down. Dilation y = f(cx): stretches when 0 < c < 1, shrinks when c > 1; y = c·f(x): stretches when c > 1, shrinks when 0 < c < 1. Reflection: y = -f(x) about x-axis; y = f(-x) about y-axis. (Desmos suggested.)
- Logarithm: the exponent to which the base must be raised to obtain another number ("how many of one number do we multiply to get another"). log10 10000 = 4; log2 32 = 5. log_b(a) = c <=> b^c = a. If no base written, base 10: log 100 = 2.
- Phase: one cycle = 0°…360° = 0…2π rad; unit circle (dosits.org link, Wikipedia figures).

## 02 — Data and signals
- What is exchanged: **data** (information); what goes through the network at the physical layer: **signals** (e.g. electrical). Physical layer moves data as electromagnetic signals across a medium; data must be changed to signals. Communication at application/transport/network/data-link is **logical**; at the physical layer it is **physical**.
- Analog data: continuous (sound). Digital data: discrete states (memory 1s and 0s). Analog signal: many levels of intensity over time. Digital signal: limited number of defined values (often 0 and 1).
- Periodic: cycle = one full pattern; period T (seconds) = time for one cycle; a simple periodic analog signal (sine) cannot be decomposed. Nonperiodic (aperiodic). "In data communications, we commonly use **periodic analog signals** and **nonperiodic digital signals**."
- Simple sine wave cannot be decomposed; composite = multiple sine waves. Applications: power distribution (carries energy), burglar alarm (signal of danger).
- Sine parameters: peak amplitude A (highest intensity, proportional to energy, volts); frequency f (# cycles in 1 s, Hz); phase φ (position relative to time 0; degrees or radians; 360° = 2π rad).
- Home voltage: peak 120√2 ≈ 170 V, 60 Hz. Battery 1.5 V constant -> periodic with frequency 0.
- f = 1/T, T = 1/f. 6 periods in 1 s -> 6 Hz. Frequency = rate of change w.r.t. time: no change -> f = 0; instantaneous change -> f = ∞ (T = 0).
- Units: s, ms 10^-3, μs 10^-6, ns 10^-9, ps 10^-12; Hz, kHz 10^3, MHz 10^6, GHz 10^9, THz 10^12.
- Ex 1: 60 Hz -> T = 1/60 = 0.0167 s = **16.7 ms**. Ex 2: T = 200 μs -> f = 1/(200×10^-6) = 1000000/200 = 5000 Hz = **5 kHz**.
- s(t) = A sin(2πft) = A sin(2πt/T); with phase s(t) = A sin(ωt ± φ), ω = 2πf. (a) 5 sin(20πt): A = 5 V, 2πf = 20π -> f = 10 Hz, T = 0.1 s. (b) sin(10t): A = 1 V, 2πf = 10 -> f = 10/(2π) = 1.59 Hz, T = 1/1.59 = 0.628 s.
- A sin(ωt - φ) shifts right by φ/ω; A sin(ωt + φ) shifts left by φ/ω. Example 1: sin(ωt), sin(ωt + 90°) (starts at peak, 1/4 T), sin(ωt + 180°) (1/2 T). 1° = 2π/360 rad; 1 rad = 360/(2π)°; a shift of a complete cycle = 360°.
- Example 2: offset 1/9 cycle -> φ = (1/9)×360° = **40°** = 40° × 2π/360° = 2π/9 = **0.698 rad**.
- Wavelength λ: distance a simple signal travels in one period; used for light in optical fibre; micrometres. Propagation speed depends on medium (and frequency); vacuum 3×10^8 m/s, lower in air, lower in cable. Frequency is independent of the medium; wavelength depends on frequency and medium. λ = c/f = c·T. Red light 4×10^14 Hz -> λ = 3×10^8/4×10^14 = 0.75×10^-6 m = **0.75 μm**.
- Time-domain plot: amplitude vs time (phase not shown). Frequency-domain plot: peak amplitude vs frequency; a sine = one spike; compact for multiple sines.
- A single-frequency sine wave is not useful in data communications (buzz); need a composite signal. **Fourier analysis**: any composite signal is a combination of simple sine waves with different frequencies, amplitudes, phases. Composite periodic -> discrete (integer) frequencies: fundamental (first harmonic) f, third harmonic 3f, ninth harmonic 9f in the slide figure. Composite nonperiodic -> infinite number of sines with continuous frequencies (human voice 0–4 kHz; AM/FM radio).
- Bandwidth B = f_high - f_low of a composite signal.
- Digital signals: most are nonperiodic -> frequency/period unsuitable; use **bit rate** (bits per second, bps). **Bit length** = distance one bit occupies = propagation speed × bit duration; bit duration = 1/(bit rate) (1/1 Mbps = 1 μs). Example: 1 Mbps at 2×10^8 m/s -> bit duration 1 μs -> bit length **200 m**.
- Level: a specific state/value a digital signal can have; binary = 2 levels; more levels possible (octal 8, hexadecimal 16). Two-level figure: 8 bits in 1 s -> 8 bps (1 0 1 1 0 0 0 1). Four-level figure: 16 bits in 1 s -> 16 bps (11 10 01 01 00 00 00 10). log2 4 = 2 bits per level. 11 levels -> log2 11 = 3.46 -> not realistic -> **4 bits** (integer, usually a power of 2). Bits = ceil(log2 L). Ceiling of 3.1416 = 4; floor of 3.1416 = 3.
- Bit-rate example: 100 pages/s × 24 lines × 80 chars × 8 bits = 1 536 000 bps = **1.536 Mbps**.
- A digital signal (periodic or not) is a composite analog signal with frequencies between zero and infinity (infinite bandwidth); periodic digital -> discrete frequencies; nonperiodic digital -> continuous frequencies. Figure: square wave vs its first sine harmonic on -π…π.

## E01 (Week 1 exercises) answers
1. 12 devices: mesh links = 12×11/2 = **66**; bus = **12 drop lines + 1 backbone**.
2. New LAN technology -> only **data-link and physical** layers change (medium-dependent; data link is neighbour-to-neighbour).
3. A **router** connects a network to other networks; a **switch** connects end systems together; a **modem** (modulator-demodulator) changes the form of data.
4. A router is a **network**-layer device; addresses there are **IP (logical) addresses**. Note: it operates all three lower layers (network depends on data link, which depends on physical).

## Sample quiz questions (answers per lecture content)
1. T/F full-duplex shares capacity between directions -> True. 2. T/F "Data-link layer transforms bits to electromagnetic signals" -> **False** (physical layer). 3. Dedicated link between two devices -> **point-to-point**. 4. Host-to-host communication -> **network** layer. 5. Two disadvantages of star: dependency on one single point (hub); more cabling than bus and ring. 6. Data-link responsibility: data transfer between neighbouring network elements/devices (node-to-node), without errors; PDU = frame.

## E02 (Week 2 exercises) answers
1. B = 200 kHz, middle 140 kHz, 20 V peak at middle, 0 at extremes: f_h + f_l = 280, f_h - f_l = 200 -> **f_l = 40 kHz, f_h = 240 kHz** (triangle-shaped frequency-domain plot).
2. f_h = 400 MHz, middle 300 MHz -> f_l = **200 MHz**, B = **200 MHz**.
3. 100, 400, 500, 750, 900 Hz -> B = 900 - 100 = **800 Hz**.
4. 200 pages/s: page = 24×80×8 = 15 360 bits; 200×15 360 = 3 072 000 bps = **3.072 Mbps**.
5. 1000 bps: (a) 10 bits -> 10/1000 = **0.01 s** (10 ms); (b) 100 000 chars × 8 = 800 000 bits -> **800 s**.

## E03 preview (Week 3, not in scope)
Cable loss -0.3 dB/km, 2 mW at 5 km; SNR of 200 mW through 10 devices with 2 μW noise each.
