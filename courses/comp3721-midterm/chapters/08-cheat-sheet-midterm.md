---
title: "Two double-sided cheat sheets: the four sides"
minutes: 20
---

The midterm allows two double-sided sheets. These are the four sides, Weeks 1 to 7, as a draft to copy from and correct. The printed versions are:

- sides 1 and 2 (Weeks 1 to 4): `D:\BCIT\COMP3721\COMP3721 - Midterm Cheatsheet 1.pdf`
- sides 3 and 4 (Weeks 5 to 7 and the formula picker): `D:\BCIT\COMP3721\COMP3721 - Midterm Cheatsheet 2.pdf`

Take the [mock midterm](#/comp3721-midterm/mock-midterm) first. Every question you get wrong goes onto your copy in your own words, and a line you never used can come off. The quiz at the end tests the facts the weekly mocks catch most often.

## Side 1: Weeks 1 and 2, networks, layers and signals

### Data communications (01a)

- **Data communications**: exchange of data between two devices via some form of transmission medium. **Data communications system**: network of hardware and software enabling exchange of data between devices over various transmission mediums.
- **Effectiveness (4)**: **delivery** (correct destination), **accuracy**, **timeliness**, **jitter** (uneven delay in the delivery of audio or video packets).
- **Five components**: **message**, **sender**, **receiver**, **transmission medium** (the physical path), **protocol** (set of rules that govern data communications; an agreement between the devices).
- **Network criteria**: **performance** (throughput, delay), **reliability** (accuracy of delivery, failure rate, recovery time, robustness), **security**.

| Data flow | Direction | Example |
|---|---|---|
| Simplex | one way only | monitor, TV |
| Half-duplex | both ways, one at a time | walkie-talkie |
| Full-duplex | both ways simultaneously; **capacity of the link shared** between directions | telephone |

**Point-to-point**: **dedicated link**, whole capacity reserved (TV remote). **Multipoint (multidrop)**: more than two devices share one link; **spatially shared** (simultaneous) or **timeshared** (take turns).

### Topologies and their link counts

**Topology** = geometric representation of the relationship of all links and linking devices (nodes).

| | Links | Advantages | Disadvantages |
|---|---|---|---|
| Mesh | n(n−1)/2 | own data load; robust; privacy, security; easy fault isolation | difficult install and reconnection; wiring greater than space; expensive hardware |
| Star | n | cheaper than mesh; easy install; less cabling; robust | **whole topology depends on one single point** (hub); **more cabling than bus and ring** |
| Bus | 1 + n drops | easy installation; less cabling than mesh and star | difficult reconnection, adding devices, fault isolation |
| Ring | n | easy install; easy fault isolation | unidirectional traffic; a break disables the whole network |

**E01:** 12 devices: mesh 12 × 11/2 = 66 links; bus 12 drop lines + 1 backbone; star 12; 7 devices mesh = 21.

### LAN, WAN, the Internet

- **LAN**: usually privately owned; single office, building or campus; each host has a unique identifier. **WAN**: town, state, country, world; interconnects switches, routers, modems; run by communication companies and leased. **Point-to-point WAN** (two devices) vs **switched WAN** (more than two; backbone of global communication).
- Two or more connected networks = **internetwork**. **internet** (small i) = networks that can communicate; **the Internet** (capital I) = the most notable internet.
- 1969 UCLA "LO"; ARPANET (DoD), design goal survivability; 1990 WWW.
- **Access network**: end system → first (edge) router. **Core**: routers, switches, links. ISPs join at **peering points**. DSL = voice and data simultaneously.
- **Internet standard**: thoroughly tested specification; made by the IETF; purpose interoperability. **RFC** = Request for Comment (RFC-1, 1969).

### Protocol layering (01b)

- **Protocol**: what, how and when; format and order of messages, actions on transmission and receipt. **Principles**: (1) each layer does two opposite tasks (bidirectional); (2) the two objects under each layer at both sites are identical.
- **Service model**: services a layer offers the layer above; each layer uses the layer directly below. **Advantages**: separate services from implementation; simpler, cheaper intermediate systems; modularity (black box).
- **Protocol suite (stack)**: protocols in layers. **TCP/IP = 5 layers** (the Internet); **OSI = 7** (ISO): adds L6 **Presentation** (compression, encryption) and L5 **Session** (session management, synchronization), both inside the TCP/IP application layer.

| Layer | Job | PDU | Address | Protocols |
|---|---|---|---|---|
| 5 Application | end systems, network application | message | names | HTTP SMTP IMAP FTP DNS Telnet |
| 4 Transport | process-to-process, entire message | segment / user datagram | port numbers | TCP UDP SCTP |
| 3 Network | **host-to-host** routing of datagrams | datagram / packet | logical (IP) | IP ICMP DHCP ARP routing |
| 2 Data link | neighbouring nodes, without errors | frame | link-layer (MAC) | Ethernet, 802.11 |
| 1 Physical | **bits → signals** on the medium | bits | **none** | medium dependent |

Encapsulation M → H_T M → H_N H_T M → H_L H_N H_T M → bits; decapsulation reverses. A new LAN technology changes only the data-link and physical layers. L1 and L2 sit in the NIC; L4 and L5 are software in the end systems.

### Connecting devices (01c)

- **Hub**: physical layer; multiport repeater; repeats to all ports except the incoming one. **Switch**: 2 layers (physical, data link); reads the MAC address; **filtering** picks the port. **Router**: 3 layers; **internetworking device**; hosts run all 5.
- **Router vs switch (3)**: (1) a MAC and an IP address per interface; (2) acts only on packets whose link-layer destination matches the arriving interface; (3) **changes the link-layer source and destination addresses** when forwarding. The router strips H_L, reads H_N, adds a new H_L.

### Data and signals (02)

- Exchanged: **data**; through the physical layer: **signals**. Application to data link = **logical** communication; physical layer = **physical**.
- **Analog data** continuous (sound); **digital data** discrete. **Analog signal**: many levels of intensity; **digital signal**: limited number of defined values.
- **Periodic**: completes a pattern (cycle) within a period and repeats. Data communications uses periodic analog and nonperiodic digital signals.
- A **simple** sine cannot be decomposed; one sine carries no information (a buzz).

### Sine wave and units

**Peak amplitude A**: highest intensity, proportional to **energy** (V). **Frequency f**: cycles in 1 s; **rate of change** (Hz). **Period T**: time for one cycle (s). **Phase φ**: position of the waveform **relative to time 0**.

f = 1/T · s(t) = A sin(2πft + φ): set the coefficient of t equal to 2πf. No change → **f = 0** (battery); instantaneous change → f = ∞. Mains 60 Hz, peak ≈ 170 V.

| Period | ms 10⁻³ | μs 10⁻⁶ | ns 10⁻⁹ | ps 10⁻¹² |
|---|---|---|---|---|
| Frequency | kHz 10³ | MHz 10⁶ | GHz 10⁹ | THz 10¹² |

1/ms → kHz, 1/μs → MHz, 1/ns → GHz.

**Slide:** 60 Hz → 16.7 ms · T = 200 μs → 5 kHz · 200 ns → 5 MHz.
**Equation:** 5 sin(20πt): A = 5 V, 2πf = 20π → f = 10 Hz, T = 0.1 s · sin(10t): f = 10/2π = 1.59 Hz, T = 0.628 s.

### Phase and wavelength

φ = cycle fraction × 360° · 360° = 2π rad · 1 rad ≈ 57.3° · +φ shifts **left** by φ/ω, −φ shifts **right**. sin(ωt + 90°) starts at its peak (¼T).

| Cycle | 1/9 | 1/8 | 1/6 | 1/4 | 1/3 | 1/2 | 3/4 |
|---|---|---|---|---|---|---|---|
| Degrees | 40° | 45° | 60° | 90° | 120° | 180° | 270° |
| Radians | 2π/9 (0.698) | π/4 | π/3 | π/2 | 2π/3 | π | 3π/2 |

Negative amplitude: −A sin(ωt) = A sin(ωt + 180°) → peak amplitude |−A| = A, phase 180°.

**Wavelength λ**: distance a simple signal travels in **one period**; light in optical fibre, in μm. λ = c/f = c × T, c = 3 × 10⁸ m/s in vacuum. **Frequency is independent of the medium**; wavelength depends on frequency **and** medium.

**Slide:** red light 4 × 10¹⁴ Hz → 3 × 10⁸ / 4 × 10¹⁴ = 0.75 μm.

### Time and frequency domain, bandwidth

- **Time-domain plot**: amplitude vs time; **phase not explicitly shown**. **Frequency-domain plot**: **peak amplitude vs frequency**; one sine = **one spike**; compact for many sines. Answer "frequency-domain", not "spectrum".
- **Fourier analysis**: any composite signal = simple sines with different frequencies, peak amplitudes and phases.
- Composite **periodic** → discrete frequencies (f = fundamental = first harmonic, 3f, 9f): spikes. Composite **nonperiodic** → infinite sines, continuous frequencies (voice 0 to 4 kHz): a continuous band.
- **Bandwidth**: highest minus lowest frequency. B = f_h − f_l · f_h + f_l = 2 × middle.

**E02-1:** B = 200 kHz, middle 140 kHz (20 V peak, 0 V at the ends) → f_l = 40 kHz, f_h = 240 kHz.
**E02-2:** f_h = 400 MHz, middle 300 → f_l = 600 − 400 = 200 MHz, B = 200 MHz.
**E02-3:** 100, 400, 500, 750, 900 Hz → B = 800 Hz (only max and min matter).

### Digital signals

- Mostly **nonperiodic** → use the **bit rate** (bps), not frequency. Bit duration = 1/bit rate · bit length = propagation speed × bit duration.
- **Level**: a state a digital signal can have. Binary 2, octal 8, hex 16. Bits per level = ⌈log₂ L⌉ (log L ÷ log 2); **ceiling** rounds up, **floor** down.
- A digital signal = a composite analog signal with infinite bandwidth (periodic: discrete; nonperiodic: continuous).

**Slide:** 1 Mbps at 2 × 10⁸ m/s → 1 μs → 200 m · 4 levels = 2 bits · 11 levels: log₂ 11 = 3.46 → 4 bits.
**Rate:** pages/s × lines × chars × 8: 100 × 24 × 80 × 8 = 1.536 Mbps · time = bits ÷ rate: 100 000 chars at 1000 bps = 800 s.

### True or false traps, Weeks 1 and 2

- **T** In full-duplex the capacity of the link is shared between the two directions.
- **F** The data-link layer transforms bits to signals (the physical layer does).
- **F** A switch implements the network layer (switch 2 layers, router 3).
- **F** The physical layer has an address (none; MAC is L2, IP L3, ports L4).
- **F** Star needs n(n−1)/2 links (that is mesh; star n, ring n, bus 1 + n drops).
- **F** OSI has 5 layers (OSI 7, TCP/IP 5; presentation and session folded into application).
- **F** A router forwards a frame with the same MAC addresses (it changes both).
- **F** "internet" and "the Internet" mean the same thing.
- **F** No change in a signal → infinite frequency (zero; instantaneous change is ∞).
- **F** Frequency depends on the medium (wavelength and propagation speed do).
- **F** A time-domain plot shows phase explicitly.
- **F** A composite periodic signal has continuous frequencies (discrete).
- **F** We commonly use nonperiodic analog and periodic digital signals (reverse).

### Fill-in word bank, Weeks 1 and 2 (slide terms)

point-to-point · multipoint (multidrop) · network (host-to-host) · transport (process-to-process) · jitter · delivery · accuracy · timeliness · protocol · transmission medium · survivability · IETF · RFC · interoperability · peering points · access network · internetwork · switched WAN · topology · backbone · drop line · tap · repeater · service model · protocol suite (stack) · encapsulation · message · segment / user datagram · datagram / packet · frame · port number · logical (IP) address · link-layer (MAC) address · filtering · internetworking device · signals · periodic / nonperiodic · peak amplitude · rate of change · phase · composite · Fourier analysis · fundamental frequency (first harmonic) · time-domain · frequency-domain · spike · wavelength · bandwidth · bit rate · bit length · bit duration · level · ceiling

**Written.** Two star disadvantages: the whole topology depends on one single point; more cabling than bus and ring. Data-link responsibility: transfer of frames between neighbouring nodes without errors. Why a frequency-domain plot: it shows f and peak amplitude at once, compact for many sines.

## Side 2: Weeks 3 and 4, transmission, limits and line coding

### Baseband and broadband (03, nonperiodic digital signals)

| | Baseband | Broadband (modulation) |
|---|---|---|
| Signal | digital, sent **without changing** to analog | digital **changed to analog** |
| Channel | **low-pass**: lowest frequency zero, upper bound; dedicated medium, one channel | **bandpass**: between two frequency limits, does not start from zero; more available |
| Notes | needs infinite or very wide bandwidth; **bandwidth proportional to bit rate**; **less common** | **modem** (modulator/demodulator): D/A at the sender, A/D at the receiver |
| Example | wired LAN | telephone subscriber line (0 to 4 kHz); digital cellular phones |

Unverified, the slide's "why?"s: a 4 kHz line → baseband ≤ 8 kbps; the cellular band is shared among calls.

### Impairment: attenuation, distortion, noise

- **Attenuation**: loss of energy to overcome the resistance of the medium; an **amplifier** compensates. The wire gets warm: energy → heat (unverified).
- **Distortion**: the signal changes its form or shape; a composite signal whose components arrive with **different phases**.

| Noise | Slide definition |
|---|---|
| Thermal | random motion of electrons in a wire; extra signal not originally sent by the transmitter |
| Induced | motors and appliances act as a sending antenna, the medium as the receiving antenna |
| Crosstalk | the effect of one wire on the other |
| Impulse | a spike: high energy in a very short time (power lines, lightning) |

### Decibel and SNR

dB = 10 log₁₀(P₂/P₁) = 20 log₁₀(V₂/V₁) · P₂ = P₁ × 10^(dB/10). **Negative** = attenuated, **positive** = amplified. Cable dB = dB/km × km; dB along a path **add** (−3 then +7 = +4 dB).

SNR = average signal power / average noise power (average: both change with time) · SNR_dB = 10 log₁₀ SNR · SNR = 10^(SNR_dB/10) · from volts: SNR = (V_s/V_n)². Noise of k devices = k × each. Noiseless: SNR = ∞. "What is **wanted** over what is not wanted"; high SNR = less corrupted.

**Slide:** power halved: 10 log₁₀ 0.5 = −3 dB · 10 mW / 1 μW = 10 000 μW / 1 μW → SNR 10 000 = 40 dB.
**E03-1:** −0.3 dB/km × 5 km = −1.5 dB; P₂ = 2 mW × 10^(−0.15) = 2 × 0.708 = 1.42 mW.
**E03-2:** noise 10 × 2 μW = 20 μW; SNR = 200 mW / 20 μW = 10 000 → 40 dB.
**Ratio:** 3 dB ≈ ×2 · 10 dB = ×10 · 20 dB = ×100 · 30 dB = ×1000 · convert mW and μW to one unit first.

### Data rate limits: bandwidth, levels, noise

The data rate (bit rate, capacity) depends on **the available bandwidth**, **the number of signal levels** and **the quality of the channel (the level of noise)**.

| | Nyquist | Shannon |
|---|---|---|
| Channel | **noiseless**: theoretical maximum bit rate | **noisy** (always, in reality): theoretical highest data rate |
| Formula | BitRate = 2 × B × log₂ L | C = B × log₂(1 + SNR) |
| Input | L = number of signal levels | SNR as a **ratio, never dB**; no L |
| Tells | **how many signal levels we need** | **the upper limit** |
| Solve | L = 2^(BitRate/(2B)) | SNR = 2^(C/B) − 1 |

×2 only in Nyquist; Shannon has no 2. Use Shannon first, then Nyquist for L.

- More levels **may reduce the reliability** (harder for the receiver). L not a power of 2 → **increase the levels or reduce the bit rate**.
- "No matter how many levels we have, we cannot achieve a data rate higher than the capacity of the channel." SNR ≈ 0 → C = B log₂ 1 = **0**, regardless of bandwidth.

**Ex 1:** 265 kbps, noiseless 30 kHz: 265 000 = 2 × 30 000 × log₂ L → log₂ L = 4.417 → L = 21.36 → 32 levels (300 kbps) or 16 (240 kbps).
**Ex 2:** 1 MHz, SNR 63: C = 10⁶ log₂ 64 = 6 Mbps; 6 Mbps = 2 × 1 MHz × log₂ L → log₂ L = 3 → L = 8.
**dB in:** SNR_dB 30 → SNR 1000 → 3 kHz × log₂ 1001 = 3000 × 9.97 = 29.9 kbps · log₂ x = log x / log 2.

### Bandwidth, delay and transmission modes

- Bandwidth in **hertz**: range of frequencies; in **bits per second**: bit rate. More Hz → more bps.
- **Bandwidth-delay product** = bandwidth × delay = the number of bits that can **fill the link**. Bursts with acknowledgment: burst = 2 × bandwidth × delay (full-duplex, two directions). 5 bps × 5 s = 25 bits; 1 Mbps × 2 ms = 2000 bits.
- **Parallel**: n bits on n lines; speed ×n; advantage **speed**, disadvantage **cost**. **Serial**: one line, cost ÷ roughly n; parallel/serial converter at the sender. USB 1.0 12 Mbps, 2.0 480 Mbps, 3.2 Gen 1 / 2 / 2x2 5 / 10 / 20 Gbps.

### Line coding: elements and rates (04)

- **Line coding**: the process of converting digital data to digital signal. Six characteristics: data vs signal element, data vs signal rate, bandwidth, baseline wandering, self-synchronization, DC components.
- **Data element** (bit): smallest entity that can represent a piece of information; what we **need** to send (logically). **Signal element** (symbol, state): shortest unit (timewise) of a digital signal; what we **can** send (physically).
- **r** = number of data elements carried by each signal element. Person = data element, vehicle = signal element: r > 1 carpool, r = ½ car and trailer. Figures: one per one r = 1; one per two r = ½; two per one r = 2; four per three r = 4/3.
- **Data rate (bit rate) N**: bits in 1 s, **bps**. **Signal rate (modulation, pulse, baud rate) S**: signal elements in 1 s, **baud**. Goal: **increase the data rate while decreasing the signal rate**.
- S depends on r and the **pattern of the data**: worst (max S), best (min S), average (usual). **c = case factor**.
- Actual bandwidth of a nonperiodic digital signal: **infinite**; effective: **finite**. **The baud rate, not the bit rate, determines the required bandwidth.**

S = N/r · S_avg = c × N × 1/r · B = c × N × 1/r · N = (1/c) × B × r · N_max = (1/c) × B × r = 2 × B × log₂ L (c = ½, r = log₂ L).

**Slide:** r = 1, N = 100 kbps, c = ½ → S = ½ × 100 000 × 1 = 50 kbaud.
**E04-2:** 8000 bps, 1000 baud, c = 1 → r = N/S = 8; r = log₂ L → L = 2⁸ = 256.
**Calc:** 1 MHz, 8 levels, c = ½: r = 3 → N_max = 2 × 10⁶ × 3 = 6 Mbps.

### Baseline, self-synchronization and DC

- **Baseline**: running average of the received signal power. **Baseline wandering**: drift caused by a **long string of 0s or 1s**; hard to decode. A good scheme needs to prevent it.
- **Self-synchronization**: the receiver's bit intervals must correspond exactly to the sender's. A self-synchronizing signal includes **timing information**: **transitions** alert the receiver to the beginning, middle or end of the pulse (reset the clock). Sent 10110001, a faster receiver reads **110111000011**.
- **DC components**: very low frequencies (around zero) from a duration of fixed voltage level; a problem for a system that cannot pass low frequencies or uses electrical coupling. **DC component (bias)** = **mean amplitude**; zero mean = DC balanced, DC free.

Extra bps = N × p% · received = N × (1 + p%).

**Slide:** 0.1% faster: 1 kbps → 1001 (1 extra bps); 1 Mbps → 1000 extra bps · **E04-1:** 0.2% at 1 Mbps → 2000 extra bps.
**DC:** 1110111100 at ±3 V: NRZ-L (3 zeros +3, 7 ones −3) mean = (9 − 21)/10 = −1.2 V; unipolar 7 × 3/10 = 2.1 V; Manchester 0.

### The line-coding schemes and their level rules

**Unipolar**: NRZ · **Polar**: NRZ (NRZ-L, NRZ-I), RZ, biphase (Manchester, differential Manchester) · **Bipolar**: AMI. RZ is named only: no slide rule.

**Unipolar** (on-off keying): all levels on **one side** of the time axis. NRZ: does not return to zero at the middle of the bit. **Polar**: **both sides** of the axis. **Bipolar** (multilevel binary): **three** levels; one bit at zero, the other alternates + and −. AMI = Alternate Mark (1) Inversion.

| Scheme | Bit 0 | Bit 1 | r | Sync | BW | DC |
|---|---|---|---|---|---|---|
| Unipolar NRZ | zero | positive | 1 | no (derived) | yes (derived) | yes (derived) |
| NRZ-L | positive | negative | 1 | no | yes | yes |
| NRZ-I | no change | change (inversion) | 1 | no | yes | yes |
| Manchester | high-to-low | low-to-high | ½ | yes | no | no |
| Diff. Manchester | inversion at start | no inversion at start | ½ | yes | no | no |
| AMI | neutral zero | alternating + / − | 1 | no (derived) | no (derived) | no (derived) |

BW = baseline wandering; "derived" = from the rule, not a slide statement. Polar NRZ: all three problems in a long sequence of 0s or 1s (04a: NRZ-I fixes 1s, not 0s). Manchester schemes: mid-bit transition → self-sync; each bit has a + and a − contribution → no DC, no wandering; drawback: **signal rate higher** than NRZ-L. **NRZ-I and differential Manchester = differential encoding.** Manchester: IR, RFID, NFC; differential Manchester: 802.5 with twisted pair.

**Polarity:** the slides use **NRZ-L 0 = positive** (slide 55; E04 agrees), though the slide 4 chart and 04a draw 1 high. **Manchester 0 = high-to-low** (slide 57); 04a has the mirror. In waveforms: + high, − low, 0 the axis; for NRZ-I and differential Manchester the level before the first bit is positive.

### True or false traps, Weeks 3 and 4

- **F** Baseband needs a bandpass channel (low-pass; broadband needs bandpass).
- **F** Low-pass channels are more common than bandpass (less common).
- **F** A positive dB value means attenuation (negative = attenuated).
- **F** Shannon capacity = 2 × B × log₂(1 + SNR) (no 2; the 2 is Nyquist).
- **F** Put SNR_dB straight into Shannon (convert to a ratio first).
- **T** Increasing the levels of a signal may reduce the reliability of the system.
- **F** Crosstalk is caused by motors and appliances (that is induced).
- **F** The bit rate, not the baud rate, determines the required bandwidth (reverse).
- **F** Goal: increase the signal rate while decreasing the data rate (reverse).
- **F** Manchester has no self-synchronization (it does: mid-bit transition).
- **F** Manchester's signal rate is lower than NRZ-L's (higher: the drawback).
- **F** AMI uses two voltage levels (three: positive, negative, zero).
- **T** NRZ-I and differential Manchester are differential encoding.
- **F** A signal with a DC component has an average amplitude of 0.
- **F** Parallel transmission's advantage is cost (speed; serial cuts cost).

### Fill-in word bank, Weeks 3 and 4 (slide terms)

baseband · broadband (modulation) · low-pass channel · bandpass channel · modem · attenuation · distortion · noise · amplifier · decibel (dB) · thermal · induced · crosstalk · impulse · SNR · capacity · Nyquist (noiseless) · Shannon (noisy) · bandwidth-delay product · parallel · serial · line coding · data element · signal element · ratio r · data rate (bps) · signal rate / baud rate (baud) · case factor c · effective bandwidth · baseline · baseline wandering · self-synchronization · transitions · DC component (bias) · DC balanced / DC free · unipolar · polar · bipolar (multilevel binary) · NRZ-L · NRZ-I · biphase · Manchester · differential Manchester · AMI · differential encoding

**Written.** Nyquist vs Shannon: noiseless vs noisy; Shannon gives the upper limit, Nyquist tells how many signal levels we need. Why Manchester has no DC: each bit has a positive and a negative voltage contribution.

## Side 3: Weeks 5 and 6, conversion, multiplexing and the data-link layer

Thu Oct 29 2026 · 11:00 · 120 min · calculator.

### PCM and sampling (05a)

- **Digitization**: converting an analog signal to digital data. **PCM** (Pulse Code Modulation): the most commonly used technique. Encoder: **1. sampling** (→ **PAM signal**) → **2. quantizing** → **3. encoding** (bits). **PAM** (Pulse Amplitude Modulation) = another name for sampling.
- f_s = 1/T_s. Infinite bandwidth cannot be sampled: the signal must be **bandlimited**. Methods: **ideal** (cannot be easily implemented), **natural** (high-speed switch), **flat-top / sample-and-hold** (circuit; **most commonly used**).
- **Nyquist theorem**: sampling rate at least **2 times the highest frequency**. **Low-pass**: bandwidth = f_max. **Bandpass**: bandwidth < f_max → the rate cannot be found from the bandwidth alone. 2f Nyquist rate · 4f **oversampling** (redundant) · f **undersampling** (not like the original).

f_N = 2 × f_max samples/s · Nyquist interval = 1/(2 × f_max) s.

**Slide:** low-pass B = 100 kHz → 200 000 samples/s, interval 5 μs · bandpass B = 100 kHz → cannot be found.
**E05-1:** voice 0 to 4 kHz, 8 bits → 8000 samples/s × 8 = 64 kbps.

### Quantization, encoding and PCM bandwidth

- **Quantization**: amplitudes mapped to a set of discrete values; an **approximation** process. Recipe: V_min to V_max → **L zones** of height Δ → values **0 to L − 1 at the midpoints** → approximate each sample. Encoding: an n_b-bit code word. Audio **L = 256**.
- **Quantization error** changes the SNR → the Shannon upper limit is **decreased**. **Uniform**: optimal only for a uniformly distributed signal (speech and music concentrate near zero). **Nonuniform**: Δ not fixed; the slide says **greater near the lower amplitudes, less near the higher** (open: the book may say the reverse; write the slide).
- B_min = n_b × analog bandwidth: **the price we pay for digitization** (c = ½, r = 1).

Δ = (V_max − V_min)/L · PAM = actual/Δ · error = quantized − PAM · −Δ/2 ≤ error ≤ Δ/2 · zone = ⌊PAM⌋ + L/2 · n_b = log₂ L · bit rate = f_s × n_b · SNR_dB = 6.02 n_b + 1.76 · B_min = c × n_b × 2B_analog × (1/r) = n_b × B_analog.

| V | −6.1 | 7.5 | 16.2 | 19.7 | 11.0 | −5.5 | −11.3 | −9.4 | −6.0 |
|---|---|---|---|---|---|---|---|---|---|
| PAM | −1.22 | 1.50 | 3.24 | 3.94 | 2.20 | −1.10 | −2.26 | −1.88 | −1.20 |
| zone | 2 | 5 | 7 | 7 | 6 | 2 | 1 | 2 | 2 |
| quant | −1.50 | 1.50 | 3.50 | 3.50 | 2.50 | −1.50 | −2.50 | −1.50 | −1.50 |
| error | −0.28 | 0 | +0.26 | −0.44 | +0.30 | −0.40 | −0.24 | +0.38 | −0.30 |
| word | 010 | 101 | 111 | 111 | 110 | 010 | 001 | 010 | 010 |

Slide: −20 to +20 V, L = 8, Δ = 5 V; zone 0 at the bottom; word = zone in 3 bits.

**E05-2:** L = 64, B = 300 MHz, r = 1 → n_b 6, B_min = 6 × 300 = 1800 MHz = 1.8 GHz.
**E05-3:** more levels → n_b up → the bit rate increases · **Audio:** L = 256 → n_b 8 → 49.92 dB.

### Digital-to-analog conversion (05b)

- r = log₂ L · S = N/r, **baud rate ≤ bit rate**. **Carrier**: high-frequency simple sine wave produced by the **sending** device; the receiver is tuned to it.
- **D2A**: digital data → **bandpass analog** signal by modifying the amplitude, frequency or phase of the carrier: **modulation or shift keying**. Bandwidth ∝ signal rate. The d in (1 + d) is undefined on the slide (book: 0 to 1).
- **BASK = OOK**: levels 0 and peak; multilevel ASK is not common. **BFSK**: **f₁ for 0, f₂ for 1**, 2Δf apart; **VCO**. MFSK with 4 frequencies → 2 bits.
- **PSK**: **more common** than ASK and FSK; **less susceptible to noise**: noise changes amplitude easier than phase; more sophisticated hardware. BPSK 0°/180°: **same bandwidth as BASK, less than BFSK**.
- **QAM**: ASK + PSK, the **dominant** method; carriers **in-phase and quadrature** (90°); 802.11. 8-QAM: 24 bps, 8 baud, 3 bits.
- **When we have a bandpass channel, we require analog transmission.**

### D2A and A2A side by side

| Method | Varies | Constant | Bits per element | Bandwidth |
|---|---|---|---|---|
| ASK (OOK) | amplitude | frequency, phase | r = 1 | S = N, B = (1 + d)S |
| FSK | frequency | peak amplitude, phase | r = 1 | B = (1 + d)S + 2Δf |
| PSK | phase | peak amplitude, frequency | r = 1 | S = N, B = (1 + d)S |
| QAM | amplitude + phase | frequency | log₂ n | minimum = ASK, PSK |
| AM | amplitude | frequency, phase | none | B_AM = 2B |
| FM | frequency | peak amplitude, phase | none | B_FM = 2(1 + β)B |
| PM | phase | peak amplitude, frequency | none | none on the slide |

**Differences:** D2A takes **digital** data, A2A **analog**; both give a bandpass analog signal on a carrier; "shift keying" vs "modulation"; D2A has log₂ L bits per element, A2A none; bandwidth from S vs from B; QAM has no A2A twin.

**AM:** audio 5 kHz → 10 kHz per station · **FM:** 15 kHz, β = 4 → 150 kHz + 50 kHz guard = 200 kHz.

### Constellation diagram

One **dot** per signal element type. X = **in-phase**, Y = **quadrature**. **Length = amplitude, angle = phase**. n points → log₂ n bits · amplitude² = I² + Q². 16-QAM 4 bits · 64 → 6 · 256 → 8 · 1024 → 10 · 4K → 12.

OOK 0 at the origin, 1 on +X · ASK 1 V / 3 V on +X · BPSK ±2 V · 8-QAM 1 V / 3 V on the diagonals · 4-QAM: a. corner at the origin, b. one per quadrant, c. small square in Q1 · 16-QAM ±A, ±3A.

**E05-4:** 16 points → 4 bits; amplitude 5 V, I = 3 V → Q² = 25 − 9, Q = 4 V.

### Multiplexing, FDM and WDM (06a)

- **Bandwidth utilization**: the wise use of available bandwidth: **multiplexing** (**efficiency**), **spectrum spreading** (**privacy**).
- **Multiplexing**: the set of techniques that allow the simultaneous transmission of multiple signals across a single data link. MUX → 1 link, n channels → DEMUX. **Link** = physical path; **channel** = portion of a link.
- **FDM** (analog): each source modulates its own carrier; combined into one composite signal. **WDM** (analog, optical): wavelengths on one fibre, a **prism**. **TDM** (digital): time slots in frames.
- **Guard bands**: strips of unused bandwidth that separate channels, to prevent overlapping and interference; n channels → **n − 1**. Uses: telephone, AM/FM radio, TV, cellular.

B_link = n × B_channel + (n − 1) × guard.

**Ex 1:** 5 × 100 kHz, 10 kHz guards → 500 + 4 × 10 = 540 kHz · **Slide:** 3 × 4 kHz on 20 to 32 kHz → 20–24, 24–28, 28–32.

### Synchronous TDM and E06

- **Unit** = 1 bit, one character or one block. One unit per input = a **frame** of n **time slots**. Unit duration T → **slot T/n, frame T**; the link is **n times faster**. **The frame rate is always the same as any input rate.**
- Not efficient: an idle source → an **empty slot**; **statistical TDM** removes empty slots. **Framing bits**: synchronization bits added to the **beginning** of each frame (pattern 1 0 1 …).

Frame rate = input unit rate · frame duration = 1/frame rate = T · slot = T/n · link = n × input rate · bits per frame = n × unit + framing · link = frame rate × bits per frame · bit duration = 1/link rate.

**E06-1:** 4 × 1 Mbps, 1-bit (slide 35): in 1 μs, out 0.25 μs, 4 Mbps, 1 000 000 frames/s; first frame 0101.
**Ex 2:** 4 × 100 kbps, 2-bit slots: 50 000 frames/s, 20 μs, 400 kbps, bit 2.5 μs.
**E06-2:** 4 × 250 chars/s, 8 bits, 1 sync bit: 2 kbps per source; char 4 ms; 250 frames/s; frame 4 ms; 4 × 8 + 1 = 33 bits; 250 × 33 = 8250 bps.
**E06-3:** 100 + 200 kbps → multiple-slot allocation (1 + 2 slots); 100 000 frames/s; 10 μs; 3 × 100 = 300 kbps.

The framing bit counts: 8250, not 8000. With framing, slot ≠ T/n (969.7 μs, not 1 ms). E06-3 assumes 1-bit slots.

### Unequal input rates

| Method | When | Example |
|---|---|---|
| **Multilevel multiplexing** | one rate is a multiple of the others | 20 + 20 → 40; 4 × 40 = 160 kbps |
| **Multiple-slot allocation** | more than one slot per frame | 50 → 2 × 25; 5 × 25 = 125 kbps |
| **Pulse stuffing** (bit padding) | rates **not** integer multiples | **dominant** rate; 46 → 50; 3 × 50 = 150 kbps |

### The data-link layer (06b)

- **A packet at the data-link layer is called a frame.** Active at **every hop**. Re-encapsulated per link: 1. **different protocol with a different frame format**; 2. **link-layer addresses are normally different**.
- Four services: **framing**, **flow control**, **error control**, **congestion control**. **DLC**: common to point-to-point and broadcast links (framing, flow, error). **MAC**: only broadcast (shared) links.
- IP addresses **cannot define which links**; link addresses are **changed every time the frame moves to another link**. **MAC address** = link-layer = physical address: **48 bits (6 bytes)**, 12 hex digits with colons; the first 3 bytes are the OUI.
- **Order: IP source then destination; link-layer destination then source**: [L dest, L src, N src, N dest, Data].

### ARP

An auxiliary protocol of the **network layer**: maps an **IP address to a link-layer address**. **Request broadcast** ("Looking for link-layer address of a node with IP address N₂"); **reply unicast** ("I am the node and my link-layer address is L₂").

| Field | Request (A asks N₂) | Reply (B) |
|---|---|---|
| HW type · protocol type | 0x0001 Ethernet · 0x0800 IPv4 | same |
| HW length · protocol length | 0x06 · 0x04 | same |
| Operation | 0x0001 request | 0x0002 reply |
| Source HW · protocol | L₁ · N₁ | L₂ · N₂ |
| Destination HW · protocol | **all 0s** · N₂ | L₁ · N₁ |
| Frame | dest BA (broadcast), src A | dest A, src B |

### Alice to Bob, where N_A and N_B never change

| Node | Forwards N_B to | ARP reply | Frame sent |
|---|---|---|---|
| Alice | N₁ | R1: L₁ | L₁ · L_A · N_A · N_B |
| R1 | N₃ | R2: L₃ | L₃ · L₂ · N_A · N_B |
| R2 | N_B direct | Bob: L_B | L_B · L₄ · N_A · N_B |

Forwarding table → next-hop IP → ARP → its MAC → frame. The source L is the sender's own interface on that link.

### True or false traps, Weeks 5 and 6

- **F** Bandpass sampling rate = 2 × bandwidth (needs f_max).
- **F** Natural sampling is the most common (flat-top).
- **F** The carrier is produced by the receiver (sender).
- **F** FM bandwidth is twice the modulating bandwidth (that is AM).
- **F** ASK resists noise better than PSK.
- **F** PCM needs less bandwidth than the analog signal.
- **F** Framing bits go at the end of each frame (beginning).
- **F** Pulse stuffing is for integer-multiple rates.
- **F** IP addresses define which links are used.
- **F** An ARP reply is broadcast (unicast).
- **F** N_A and N_B change at each router.
- **T** BPSK: same bandwidth as BASK, less than BFSK.

### Fill-in word bank, Weeks 5 and 6 (slide terms)

digitization · PAM · bandlimited · flat-top / sample-and-hold · oversampling · approximation · midpoint · the price we pay for digitization · carrier signal · shift keying · OOK · VCO · in-phase · quadrature · analog transmission · efficiency · privacy · guard bands · prism · time slots · statistical TDM · dominant rate · framing bits · frame · DLC · MAC · OUI · auxiliary protocol · broadcast / unicast

## Side 4: Week 7 and the formula picker

Bits written without spaces · hex with or without 0x.

### Errors and redundancy (07a)

- Most link-layer protocols **discard the frame**; **upper-layer protocols** handle **retransmission**.
- **Single-bit error**: only 1 bit changed. **Burst error**: 2 or more bits. **Burst length** = first to last corrupted bit, unchanged bits between included. Bursts are more likely: noise usually lasts longer than one bit. Bits hit = data rate × noise duration.
- **Detection**: whether any error occurred. **Correction**: the exact number and location; **more difficult**. **Redundancy**: **added by the sender**, **removed by the receiver**, via **coding schemes**.

**Slide 6:** flips 4, 5, 8, 11 → burst 8 bits · 0.001 s noise: 1 kbps → 1 bit, 1 Mbps → 1000.

### Block coding, Hamming distance and parity

- **Dataword** k bits → **codeword** n = k + r bits. **One-to-one**. The 2ⁿ − 2ᵏ unused words are invalid: **the trick in error detection**. A valid → valid change is **undetectable**.
- **Hamming distance**: number of differences between corresponding bits of two words of the same size: **XOR and count the 1s**. **Linear block code**: the XOR of two valid codewords is a valid codeword.
- **Parity-check**: n = k + 1, even parity, **d_min = 2**, single-bit error-detecting; finds **any odd number** of errors. r0 = a3 + a2 + a1 + a0 · s0 = b3 + b2 + b1 + b0 + q0 (mod 2). Syndrome 0 → no detectable error.

n = k + r · valid 2ᵏ · invalid 2ⁿ − 2ᵏ · detect s: d_min = s + 1 · correct t: d_min = 2t + 1. A code detects d_min − 1 and corrects ⌊(d_min − 1)/2⌋.

| Code | Valid · invalid | d_min | Detect · correct |
|---|---|---|---|
| C(5,4) parity | 16 · 16 | 2 | 1 · 0 |
| C(7,4) CRC 1011 | 16 · 112 | 3 (computed) | 2 · 1 |
| any code | | 4 | 3 · 1 |
| any code | | 5 | 4 · 2 |
| correct 10 | | 21 | 20 · 10 |

**d:** d(011011, 001111) = 2 · d(10101, 11110): XOR 01011 → 3 · slide 26: 10001 → 100010 (even), received 011010 has three 1s → corrupted.

### CRC and modulo-2 division (07a, 07c)

- **Cyclic code**: a special linear block code; rotating a codeword gives another (1011000 → 0110001). **CRC** is used in **LANs and WANs**; fast in hardware.
- Divisor size = n − k + 1 · remainder size = n − k = the zeros appended. The divisor is **shared** by the encoder and decoder.
- **Modulo 2**: no carry, no borrow; add = subtract = **XOR**; multiply = AND. 07c: 1011 × 0101 = 0100111; 100100110 ÷ 10011 → quotient 10001, remainder 0101. "X/Y = Y/X" is not a rule.
- Recipe: 1. append n − k zeros; 2. leftmost bit 1 → XOR the divisor, **0 → XOR 0000**; 3. drop the leading bit, bring down the next; 4. stop when every bit is down; 5. the last n − k bits are the remainder. **Codeword = dataword + remainder**; the quotient is discarded.
- **Decoder**: divide the whole received codeword (no zeros added); the remainder is the **syndrome**. 0 → accept; else discard. *If syndrome is 0, either no bit is corrupted, or the decoder failed to detect any errors.*

```text
             1 0 1 0          quotient (discarded)
        ________________
1 0 1 1 ) 1 0 0 1 0 0 0       dividend = 1001 + 000
          1 0 1 1
          -------
            0 1 0 0           bring down 0
            0 0 0 0           leftmost 0: use 0000
            -------
              1 0 0 0         bring down 0
              1 0 1 1
              -------
                0 1 1 0       bring down 0
                0 0 0 0       leftmost 0: use 0000
                -------
                  1 1 0       remainder -> codeword 1001110
```

**Slide 40:** received 1001110 → syndrome 000, accept · 1000110 → syndrome 011, discard.

### Checksum and one's complement

- **Checksum**: error detection for a message of **any length**; mostly at the **network and transport layers**.
- One's complement: 0 to 2ᵐ − 1 in m bits. **Wrapping**: add the extra leftmost bits to the m rightmost bits, **repeat until the sum fits**. **Complement**: flip every bit = (2ᵐ − 1) − x. Two zeros: 0000 (+) and 1111 (−).
- Sender: checksum = 0, add all words, complement → checksum. Receiver: add all including the checksum, complement: **0 → accept**.
- Hex: 1 digit = 4 bits; carries added back; complement = **F − d** per digit.

**Slide 49:** 7 + 11 + 12 + 0 + 6 = 36 = 10 0100 → 10 + 0100 = 6 → 15 − 6 = 9; send …, 6, 9.
**Receiver:** 36 + 9 = 45 = 10 1101 → 10 + 1101 = 15 → complement 0, accept.
**Bad:** 7, 11, 12, 0, **7**, 9 → 46 = 10 1110 → 10000 → **wrap again** → 0001 → 14 ≠ 0, reject.
**Hex:** 466F + 726F + 757A + 616E = 18FC6 → 8FC7 → 7038; the receiver gets FFFF → 0.

### Forward error correction (FEC)

Retransmission is not useful for real-time **multimedia**: **unacceptable delay** in reproducing; correct or reproduce the packet immediately. Techniques: **Hamming distance** (d_min = 2t + 1), **XOR**, **chunk interleaving**. Slide 2 says "Forwarding": the term is **Forward**.

- **XOR**: R = P1 ⊕ P2 ⊕ … ⊕ PN; any one Pi = the XOR of the others and R; send N + 1 chunks; rebuilds **one** lost chunk per group. Overhead = 1/N.
- **Chunk interleaving**: send column by column; one lost packet → **one chunk missing in each packet** (slide 57: 03, 08, 13, 18, 23).

**XOR:** 1010 ⊕ 0111 ⊕ 1100 ⊕ 0011 = 0010 · N = 4 → 25% extra · correct 10 bits → d_min 21.

### Framing, byte stuffing and bit stuffing (07b)

- **Framing** (a DLC service) packs bits into distinguishable frames with a **sender address** and a **destination address**; very large frames make flow and error control inefficient.
- **Fixed** size: no boundaries needed. **Variable** size (prevalent in LANs): **character (byte)-oriented** or **bit-oriented**.
- Character-oriented frame: Flag, Header, Data, Trailer, Flag. Header: source and destination addresses, control. **Trailer: error detection redundant bits (the CRC)**. Flag: 1 byte.
- **Byte stuffing**: add an **ESC** whenever a **flag or ESC** is in the text; the receiver removes it and treats the next character as data. Left over: **Unicode** 16/32-bit → trend toward **bit-oriented**.
- **Bit-oriented flag** 01111110. **Bit stuffing**: insert a **0 after five consecutive 1s** (following a 0), **always**: even if the next bit is already 0 and even at the end of the data; restart the count. The receiver removes the 0 after five 1s.
- TDM "pulse stuffing" (06a, also called bit stuffing) is a different thing: dummy bits to reach the dominant rate.

**Slide 15:** d FLAG d d ESC d → d ESC FLAG d d ESC ESC d: 8 bytes, 2 extra.
**Slide 21:** 0001111111001111101000 (22 bits) → 000111110110011111001000 (24 bits, 2 extra; stuffed 0s after each run of five 1s).

### Flow and error control, Simple and Stop-and-Wait

- **Flow control**: a **balance** between production and consumption rates; frames are **buffered**. **Buffer**: a set of memory locations that can hold packets. The receiver **drops frames** when full, or sends **feedback** (stop or slow down).
- **Error control**: CRC added by the sender, checked by the receiver. 1: discard corrupted, deliver the rest (**Ethernet**). 2: discard corrupted, **acknowledge** the rest. The ACK serves both; **lack of acknowledgment** means a problem.
- **FSM**: states (rounded rectangles), colored events, black actions. **Simple**: **no flow and error control**, no ACKs. **Stop-and-Wait**: **connection-oriented**, **both** flow and error control; one frame at a time, waits for an ACK; sender **timer**; ACK only if the CRC is correct.

| S&W state | Event | Action |
|---|---|---|
| Sender Ready → Blocking | Packet came from network layer. | Make a frame, save a copy, send; start the timer. |
| Blocking (stays) | Time-out. | Resend the saved frame; restart the timer. |
| Blocking (stays) | Corrupted ACK arrived. | Discard the ACK. |
| Blocking → Ready | Error-free ACK arrived. | Stop the timer; discard the saved frame. |
| Receiver Ready | Corrupted frame arrived. | Discard the frame. |
| Receiver Ready | Error-free frame arrived. | Extract, deliver to network layer; send ACK. |

Frame lost → time-out → resend. ACK lost → time-out → resend → the receiver gets a **duplicate**. Sequence numbers 0, 1, 0, 1; ACK numbers 1, 0, 1, 0: **ACK = the number of the next frame expected**. A resent Frame 0 when 1 is expected is discarded, and ACK 1 is sent again.

### True or false traps, Week 7

- **F** Burst length counts only the corrupted bits (first to last, all between).
- **F** Detection is harder than correction. · **F** A corrupted word that is still valid is detected.
- **F** d_min = s + 1 guarantees correcting s errors (detecting; correcting t needs 2t + 1).
- **F** Simple parity detects every 2-bit error (odd numbers only).
- **F** Syndrome 0 proves no bit was corrupted (or detection failed).
- **F** Mod-2 subtraction borrows. · **F** One's complement has one zero. · **F** Wrap once and stop.
- **F** XOR FEC rebuilds two lost chunks of a group (one).
- **F** Only flag bytes are stuffed (ESC too). · **F** No 0 is stuffed when the next bit is 0.
- **F** The Simple protocol has flow control. · **F** The receiver ACKs a corrupted frame.
- **T** Cyclic and parity-check codes are linear block codes.

### Fill-in word bank, Week 7 (slide terms)

single-bit error · burst error · redundancy · sender / receiver · dataword · codeword · one-to-one · trick · Hamming distance · 1s · linear block code · parity-check · syndrome · cyclic · CRC · LANs, WANs · n − k + 1 / n − k · modulo 2 · checksum · wrapping · network, transport · Forward Error Correction · chunk interleaving · byte stuffing · ESC · trailer · 01111110 · bit stuffing · buffer · Simple · Stop-and-Wait · Blocking · time-out · duplicate · next

### Which formula? The three that start with 2

| Given | Asked | Formula | Unit |
|---|---|---|---|
| B, L, **noiseless** | max bit rate | **2** × B × log₂ L | bps |
| f_max, low-pass | min sampling rate | **2** × f_max | samples/s |
| B, L, c = ½ | N_max | (1/c) × B × r = **2**B × log₂ L | bps |
| B, SNR, **noisy** | capacity | B × log₂(1 + SNR), no 2 | bps |
| P₁, P₂ or V₁, V₂ | gain or loss | 10 log(P₂/P₁) = 20 log(V₂/V₁) | dB |
| SNR_dB | SNR ratio | 10^(SNR_dB/10) | none |
| N, r, c | signal rate, B | S = c × N/r · B = c × N/r | baud, Hz |
| L or n points | bits per element | ⌈log₂ L⌉ or log₂ n | bits |
| f_s · B_analog · n_b | PCM rate · B_min · SNR | f_s × n_b · n_b × B · 6.02 n_b + 1.76 | bps · Hz · dB |
| audio B (AM or FM) | station B | 2B · 2(1 + β)B | Hz |
| n, B_ch, guard | FDM link | n × B_ch + (n − 1) × G | Hz |
| n, unit rate, framing | TDM link | frame rate × bits per frame | bps |
| d_min | detect · correct | d_min − 1 · ⌊(d_min − 1)/2⌋ | bits |

### Powers, logs, dB and units

| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2ⁿ | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 |

| x | 3 | 5 | 6 | 7 | 11 |
|---|---|---|---|---|---|
| log₂ x | 1.585 | 2.322 | 2.585 | 2.807 | 3.459 |
| ceiling | 2 | 3 | 3 | 3 | 4 |

log₂ x = log x / log 2 (log 2 = 0.30103) · 2⁰ = 1.

| dB | −10 | −3 | 0 | 3 | 6 | 10 | 20 | 30 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| ratio | 0.1 | ≈ ½ | 1 | ≈ 2 | ≈ 4 | 10 | 100 | 1000 | 10⁴ |

Power ratio = 10^(dB/10); dB add along a path; a loss is negative. Shannon takes the **ratio**, never dB (30 dB → 1000).

Unit of the answer: bandwidth **Hz** · bit rate and capacity **bps** · signal rate **baud** · sampling rate **samples/s** · frame rate **frames/s** · durations **s** (ms, μs) · gain, loss, SNR_dB **dB** · n_b, burst, d **bits**. Prefixes: k 10³, M 10⁶, G 10⁹; m 10⁻³, μ 10⁻⁶, n 10⁻⁹.

## The facts the weekly mocks catch most often

Answer from memory first, then find the line on your sheet that would have saved you.

```quiz
[
  {
    "q": "Which of these formulas carry a factor of 2? Select every one.",
    "options": ["the Nyquist bit rate of a noiseless channel", "the minimum sampling rate of a low-pass signal", "N_max of a line code with c = 1/2", "the Shannon capacity of a noisy channel", "SNR_dB from the SNR ratio"],
    "answer": [0, 1, 2],
    "explain": "Nyquist BitRate = 2 × B × log₂ L; the sampling theorem f_s = 2 × f_max; N_max = (1/c) × B × r = 2 × B × log₂ L with c = 1/2. Shannon C = B × log₂(1 + SNR) has no 2, and SNR_dB = 10 log₁₀ SNR has a 10. See [Nyquist](#/comp3721-w3/nyquist), [Shannon](#/comp3721-w3/shannon) and [Nyquist sampling](#/comp3721-w5/nyquist-sampling)."
  },
  {
    "q": "A noisy channel has a bandwidth of 60 kHz and SNR_dB = 30 dB. What is its Shannon capacity, in kbps?",
    "type": "numeric",
    "answer": 598,
    "tolerance": 0.5,
    "unit": "kbps",
    "explain": "Convert to a ratio first: SNR = 10^(30/10) = 1000. C = 60 000 × log₂ 1001 = 60 000 × 9.967 = 598 000 bps ≈ 598 kbps. Putting 30 into the formula gives 60 000 × log₂ 31 ≈ 297 kbps, half the real capacity. See [Shannon](#/comp3721-w3/shannon)."
  },
  {
    "q": "A bandpass signal has a bandwidth of 40 kHz. Its minimum sampling rate is 80 000 samples/s.",
    "type": "tf",
    "answer": false,
    "explain": "False. The Nyquist theorem needs the highest frequency. For a low-pass signal the bandwidth equals f_max, so 2 × bandwidth works; for a bandpass signal the bandwidth is less than f_max, and the slide's answer is that the sampling rate cannot be found from the bandwidth alone. See [Nyquist sampling](#/comp3721-w5/nyquist-sampling)."
  },
  {
    "q": "Five sources each create 300 characters per second (8 bits each) and are multiplexed by synchronous TDM, one character per source per frame, with 1 framing bit per frame. What is the link's data rate, in bps?",
    "type": "numeric",
    "answer": 12300,
    "tolerance": 0,
    "unit": "bps",
    "explain": "Frame rate = input rate = 300 frames/s. Bits per frame = 5 × 8 + 1 = 41. Link = 300 × 41 = 12 300 bps. Forgetting the framing bit gives 12 000. See [synchronous TDM](#/comp3721-w6/synchronous-tdm) and [rate management](#/comp3721-w6/tdm-rate-management)."
  },
  {
    "q": "Compute the 4-bit checksum of the words 14, 13, 11, 9. Type it as 4 bits without spaces.",
    "type": "text",
    "answer": ["1101"],
    "explain": "Sum = 47 = 10 1111. Wrap: 10 + 1111 = 2 + 15 = 17 = 1 0001, still 5 bits, so wrap again: 1 + 0001 = 2 = 0010. Complement: 1111 − 0010 = 1101 (13). Stopping after one wrap is the trap. See [checksum](#/comp3721-w7/checksum)."
  },
  {
    "q": "Bit-stuff the data 0111110. Type the stuffed bits without spaces.",
    "type": "text",
    "answer": ["01111100"],
    "explain": "0, then five 1s: stuff a 0, then the data's own 0. Result 0 11111 0 0 = 01111100, 8 bits. The 0 goes in even though the next data bit is already 0, because the receiver deletes the bit after every five 1s. See [bit stuffing](#/comp3721-w7/bit-stuffing)."
  },
  {
    "q": "In byte stuffing, only the flag bytes that appear in the data get an extra ESC in front of them.",
    "type": "tf",
    "answer": false,
    "explain": "False. An ESC is added whenever there is a flag or an escape character in the text: an ESC in the data gets its own ESC too, otherwise the receiver would remove it and treat the next byte as data. Slide 15: d FLAG d d ESC d becomes d ESC FLAG d d ESC ESC d. See [framing](#/comp3721-w7/framing)."
  }
]
```
