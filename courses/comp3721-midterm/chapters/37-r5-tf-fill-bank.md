---
title: "Review 5: true-or-false and fill-in-the-blank bank, Weeks 1 to 7"
minutes: 40
---
This lesson drills the two quick shapes of the midterm: the true-or-false statement and the fill-in blank. It prepares you for the one-mark items built from a single slide sentence, in every week from 1 to 7.

## What these two shapes are, in plain words

A true-or-false item is almost always a sentence copied from a slide. When it is false, one word in it has been swapped for another.

A fill-in item is a slide sentence with one word taken out. The mark goes to the slide's own word, not to a word that means nearly the same.

So both shapes test one skill: seeing the slide sentence behind the question. A statement that sounds familiar is not yet true.

```diagram
{ "type": "flow", "title": "How to answer a true-or-false item", "nodes": [
  { "id": "r", "label": "Read the statement" },
  { "id": "f", "label": "Recall the slide sentence" },
  { "id": "c", "label": "Compare word by word", "sub": "nouns, then numbers" },
  { "id": "v", "label": "Verdict", "sub": "one word off: F" }
], "edges": [ { "from": "r", "to": "f" }, { "from": "f", "to": "c" }, { "from": "c", "to": "v" } ], "hi": ["c"], "caption": "The work is in the third box: every noun and every number is checked against the slide, and one mismatch makes the statement false." }
```

## A tiny case: the sample sheet's trap

The Sample Quiz Questions sheet printed this statement: *Data-link layer transforms bits to electromagnetic signals.*

The slide gives that job to a different layer. Lay the two sentences side by side, one column per part of the sentence.

```diagram
{ "type": "grid", "title": "The sample sheet's trap, word by word", "nodes": [
  { "id": "h0", "label": "", "row": 0, "col": 0 },
  { "id": "h1", "label": "Who", "row": 0, "col": 1 },
  { "id": "h2", "label": "Does what", "row": 0, "col": 2 },
  { "id": "h3", "label": "To what", "row": 0, "col": 3 },
  { "id": "r1", "label": "On the paper", "row": 1, "col": 0 },
  { "id": "p1", "label": "Data-link layer", "row": 1, "col": 1 },
  { "id": "p2", "label": "transforms", "row": 1, "col": 2 },
  { "id": "p3", "label": "bits to signals", "row": 1, "col": 3 },
  { "id": "r2", "label": "On the slide", "row": 2, "col": 0 },
  { "id": "q1", "label": "Physical layer", "row": 2, "col": 1 },
  { "id": "q2", "label": "transforms", "row": 2, "col": 2 },
  { "id": "q3", "label": "bits to signals", "row": 2, "col": 3 }
], "hi": ["p1", "q1"], "caption": "Two columns agree and one does not, so the statement is false. Write the corrected word beside your F if there is room: it shows the marker you knew why." }
```

Two columns match and the "Who" column does not. The verdict is **false**.

That makes sense: the physical layer is the one that touches the wire, and the data-link layer works one step above it.

The words that get swapped most often:

- a layer name
- sender and receiver
- analog and digital
- low-pass and bandpass
- beginning and end
- broadcast and unicast
- the factor of 2
- a count, such as five layers or seven, two levels or three

## The procedure for each shape

**True or false.** Recall the slide sentence the statement was built from. Then compare it one noun and one number at a time.

**Fill in the blank.** Write the slide's exact term. When two terms fit, write the slide's term and put the other in brackets: *multipoint (multidrop)*, *MAC (link-layer) address*.

Spelling counts less than the word itself. The exam has punished three near-synonyms: write *frequency-domain plot*, not "spectrum"; *jitter*, not "delay"; *survivability*, not "reliability".

**Calculation.** Write four lines: the formula in the slide's notation, the substitution with units, the answer with its unit, and a check.

A tiny case: the quester's engine runs `on_tick` every 30 ms. What frequency is that?

The period T is the time for one tick, in seconds. The frequency f is the number of ticks in one second, in hertz.

Change the period to seconds:

$$T = 30\ \text{ms} = 0.030\ \text{s}$$

Take the reciprocal:

$$f = \frac{1}{T} = \frac{1}{0.030\ \text{s}}$$

$$f = \mathbf{33.3\ Hz}$$

Check: 33.3 ticks of 30 ms each come to about 1000 ms, which is one second. The trap is the prefix: 1 divided by a value in ms gives kHz, so 1/(30 ms) is 0.0333 kHz, the same 33.3 Hz.

**Written response.** Use three moves: name the thing in the slide's words, give the reason, then give an example or a number. Two to four sentences are enough.

## Bank 1: Weeks 1 and 2

Week 1 asks how devices are joined and how the work of a network is split. A topology is the shape of the links: in a mesh every device links to every other, and in a star every device links to one central box.

The work is split into layers, each doing one job for the layer above it. The TCP/IP suite has five layers and the OSI model has seven.

Week 2 is about signals. A sine wave is described by its peak amplitude, its frequency and its phase, and it can be drawn against time or against frequency.

```diagram
{ "type": "flow", "dir": "tb", "title": "The five TCP/IP layers at the sender", "nodes": [
  { "id": "a", "label": "Application", "sub": "the user's program" },
  { "id": "t", "label": "Transport", "sub": "process to process" },
  { "id": "n", "label": "Network", "sub": "host to host" },
  { "id": "d", "label": "Data link", "sub": "one link at a time" },
  { "id": "p", "label": "Physical", "sub": "the wire or the air" }
], "edges": [ { "from": "a", "to": "t" }, { "from": "t", "to": "n" }, { "from": "n", "to": "d" }, { "from": "d", "to": "p" } ], "hi": ["p"], "caption": "At the sender the data goes down all five layers, and the physical layer is the last one to handle it before the medium." }
```

Answer from memory first. After each miss, find the line on *Sheet side 1* that holds the slide's sentence and put a pencil mark beside it.

```quiz
[
  {
    "q": "The Classic quester's death notice leaves the PC on its way to Discord. At the sender, the physical layer transforms the bits of each frame into signals for the transmission medium.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (01b, L1 Physical): *carries individual bits across the link; bits from the frame transformed to signals.* The sample sheet's false version gives this job to the data-link layer, whose job is *data transfer between neighbouring network elements (without errors)*. Sheet side 1, \"Protocol layering (01b)\"."
  },
  {
    "q": "A link-layer switch is involved in three layers: physical, data-link and network.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (06b, slide 17): *A link-layer switch is involved only in two layers, data-link and physical.* The router is the three-layer device (physical, data-link, network). Sheet side 1, \"Connecting devices (01c)\"."
  },
  {
    "q": "In a star topology, each device has a dedicated point-to-point link only to a central controller, usually called a router.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (01a): *each device has a dedicated point-to-point link only to a central controller, usually called a hub.* That single hub is also the first star disadvantage: the whole topology depends on one single point. Sheet side 1, \"Topologies and their link counts\"."
  },
  {
    "q": "One disadvantage of a mesh topology is that the wiring can be greater than the available space.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (01a), mesh disadvantages: *difficult installation and reconnection; wiring can be greater than available space; expensive hardware.* Each device needs a dedicated link to every other, n(n − 1)/2 links in all. Sheet side 1, \"Topologies and their link counts\"."
  },
  {
    "q": "The OSI presentation and session layers are folded into the transport layer of the TCP/IP protocol suite.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (01b): *Presentation (data compression, encryption) and Session (session management, synchronization) are folded into TCP/IP's application layer.* OSI has seven layers, TCP/IP five. Sheet side 1, \"Protocol layering (01b)\"."
  },
  {
    "q": "A battery's constant 1.5 V is a periodic signal whose frequency is infinite.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (02): frequency is the rate of change with respect to time; *no change → f = 0; instantaneous change → f = ∞.* The battery example is *periodic with frequency 0*. Sheet side 1, \"Sine wave and units\"."
  },
  {
    "q": "On a frequency-domain plot, one simple sine wave appears as a single spike.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (02): *Frequency-domain plot: peak amplitude vs frequency; a sine = one spike; compact for multiple sines.* The time-domain plot shows amplitude against time instead. Sheet side 1, \"Time and frequency domain, bandwidth\"."
  },
  {
    "q": "Fill in the blank with the slide's term: an effective data communications system has four fundamental characteristics: delivery, accuracy, ________ and jitter.",
    "type": "text",
    "answer": ["timeliness"],
    "explain": "*Timeliness*. Slide wording (01a): *Effectiveness, four fundamental characteristics: Delivery (correct destination), Accuracy, Timeliness, Jitter (uneven delay in delivery of audio/video packets).* Sheet side 1, \"Data communications (01a)\"."
  },
  {
    "q": "Fill in the blank: the PC running the Classic script sends its frames to a device that works only at the physical layer and repeats whatever it hears on one port out of all the other ports. The slides call this device a ________.",
    "type": "text",
    "answer": ["hub", "multiport repeater", "multiway repeater"],
    "explain": "*Hub*. Slide wording (01c): *Hub: physical layer only; repeats whatever it hears on one port out all other ports (multiport/multiway repeater).* A link-layer switch differs by its *filtering* capability: it reads the MAC address and picks one port. Write \"hub (multiport repeater)\". Sheet side 1, \"Connecting devices (01c)\"."
  },
  {
    "q": "Fill in the blank: at the transport layer the PDU is called a ________ (or a user datagram when UDP carries it).",
    "type": "text",
    "answer": ["segment"],
    "explain": "*Segment*. Slide wording (01b, L4 Transport): *PDU segment / user datagram; TCP, UDP, SCTP.* The PDUs top to bottom: message, segment, datagram (packet), frame, bits. Sheet side 1, \"Protocol layering (01b)\"."
  },
  {
    "q": "Fill in the blank: if the devices of a multipoint connection must take turns using the link, the link's capacity is ________.",
    "type": "text",
    "answer": ["timeshared", "time-shared", "time shared"],
    "explain": "*Timeshared*. Slide wording (01a): *Multipoint (multidrop) = more than two devices share a single link; capacity shared, either spatially shared (simultaneously) or timeshared (take turns).* Sheet side 1, \"Data communications (01a)\"."
  },
  {
    "q": "Fill in the blank: a thoroughly tested specification and formalized regulation that must be followed, created and published by the IETF, is an ________.",
    "type": "text",
    "answer": ["Internet standard", "internet standard", "Internet standards"],
    "explain": "*Internet standard*. Slide wording (01a): *Internet standard: a thoroughly tested specification and formalized regulation that must be followed; created and published by IETF; needed for interoperability.* An RFC (Request for Comment) is one of the numbered documents. Sheet side 1, \"LAN, WAN, the Internet\"."
  },
  {
    "q": "Fill in the blank: the peak amplitude of a sine wave is its highest intensity, proportional to the ________ it carries.",
    "type": "text",
    "answer": ["energy"],
    "explain": "*Energy*. Slide wording (02): *peak amplitude A (highest intensity, proportional to energy, volts).* Frequency is the number of cycles in 1 s; phase is the position relative to time 0. Sheet side 1, \"Sine wave and units\"."
  },
  {
    "q": "Fill in the blank: in a composite periodic signal, the fundamental frequency f is also called the first ________.",
    "type": "text",
    "answer": ["harmonic", "first harmonic"],
    "explain": "*Harmonic*. Slide wording (02): *Composite periodic -> discrete (integer) frequencies: fundamental (first harmonic) f, third harmonic 3f, ninth harmonic 9f.* A composite nonperiodic signal has continuous frequencies instead. Sheet side 1, \"Time and frequency domain, bandwidth\"."
  }
]
```

## Bank 2: Weeks 3 and 4

Week 3 follows a signal through a channel. On the way it gets weaker, changes shape and picks up noise.

Week 3 also asks how fast a channel can carry bits. Nyquist answers for a noiseless channel and Shannon for a noisy one.

Week 4 turns bits into a digital signal on a wire, which the slides call line coding. The schemes differ in how many voltage levels they use and on which side of the time axis those levels sit.

```diagram
{ "type": "flow", "title": "Weeks 3 and 4 in one chain", "nodes": [
  { "id": "b", "label": "Bits" },
  { "id": "l", "label": "Line coding", "sub": "Week 4" },
  { "id": "c", "label": "Channel", "sub": "weaker, reshaped, noisy" },
  { "id": "r", "label": "Receiver" }
], "edges": [ { "from": "b", "to": "l" }, { "from": "l", "to": "c", "label": "signal" }, { "from": "c", "to": "r" } ], "hi": ["c"], "caption": "Week 4 builds the signal from the bits, and Week 3 is what the channel does to that signal before it reaches the receiver." }
```

After each miss, find the sentence on *Sheet side 2* and mark it.

```quiz
[
  {
    "q": "In baseband transmission, the digital signal is sent over the channel after it has been changed to an analog signal.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (03): *Baseband: digital signal sent over a channel without changing it to an analog signal.* Changing it to analog is broadband transmission (modulation). Sheet side 2, \"Baseband and broadband (03, nonperiodic digital signals)\"."
  },
  {
    "q": "Changing a digital signal to an analog signal for transmission requires a channel whose bandwidth does not start from zero.",
    "type": "tf",
    "answer": true,
    "explain": "True. That is broadband transmission. Slide wording (03): *Requirement: a bandpass channel (allows signals to pass between two frequency limits, OR a channel with a bandwidth that does not start from zero).* Baseband needs a low-pass channel, whose lowest frequency is zero. Sheet side 2, \"Baseband and broadband (03, nonperiodic digital signals)\"."
  },
  {
    "q": "Crosstalk is the effect of one wire on the other: one wire acts as a sending antenna and the other as the receiving antenna.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (03, noise table): *crosstalk (the effect of one wire on the other; one wire acts as a sending antenna and the other as the receiving antenna).* Induced noise is the one from motors and appliances. Sheet side 2, \"Impairment: attenuation, distortion, noise\"."
  },
  {
    "q": "Impulse noise is the random motion of electrons in a wire, which creates an extra signal not originally sent by the transmitter.",
    "type": "tf",
    "answer": false,
    "explain": "False. That sentence defines *thermal* noise. Slide wording (03): *impulse (a spike, a signal with high energy in a very short time, from power lines, lightning, and so on).* Sheet side 2, \"Impairment: attenuation, distortion, noise\"."
  },
  {
    "q": "The Shannon capacity tells us how many signal levels we need; the Nyquist formula gives us the upper limit.",
    "type": "tf",
    "answer": false,
    "explain": "False: the two are swapped. Slide wording (03, boxed): *The Shannon capacity gives us the upper limit. The Nyquist formula tells us how many signal levels we need.* Sheet side 2, \"Data rate limits: bandwidth, levels, noise\"."
  },
  {
    "q": "The drawback of Manchester and differential Manchester is a higher signal rate than some other polar schemes, such as NRZ-L.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (04): Manchester and differential Manchester have self-synchronization, no baseline wandering and no DC component; *drawback: signal rate higher compared with some other polar schemes, e.g., NRZ-L.* Sheet side 2, \"The line-coding schemes and their level rules\"."
  },
  {
    "q": "In a unipolar scheme, the signal levels lie on both sides of the time axis.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (04): *Unipolar (on-off keying): all the signal levels on one side of the time axis, either above or below.* Polar puts voltages on both sides; bipolar uses three levels. Sheet side 2, \"The line-coding schemes and their level rules\"."
  },
  {
    "q": "Fill in the blank with the slide's term: the imperfection of transmission media causes signal ________.",
    "type": "text",
    "answer": ["impairment", "impairments"],
    "explain": "*Impairment*. Slide wording (03): *The imperfection of transmission media causes signal impairment.* Its three causes: attenuation, distortion, noise. Sheet side 2, \"Impairment: attenuation, distortion, noise\"."
  },
  {
    "q": "Fill in the blank: noise from sources such as motors and appliances, which act as a sending antenna while the transmission medium acts as the receiving antenna, is ________ noise.",
    "type": "text",
    "answer": ["induced"],
    "explain": "*Induced*. Slide wording (03): *induced (from sources such as motors and appliances; these devices act as a sending antenna, the transmission medium as the receiving antenna).* The four types: thermal, induced, crosstalk, impulse. Sheet side 2, \"Impairment: attenuation, distortion, noise\"."
  },
  {
    "q": "Fill in the blank: parallel transmission's advantage is speed; its disadvantage is ________.",
    "type": "text",
    "answer": ["cost"],
    "explain": "*Cost*. Slide wording (03): *Advantage: speed. Disadvantage: cost.* Serial transmission *reduces the cost of transmission over parallel by roughly a factor of n*. Sheet side 2, \"Bandwidth, delay and transmission modes\"."
  },
  {
    "q": "Fill in the blank: a drift in the baseline caused by a long string of 0s or a long string of 1s is called baseline ________.",
    "type": "text",
    "answer": ["wandering"],
    "explain": "*Wandering*. Slide wording (04): *Baseline wandering: a drift in the baseline caused by a long string of 0s or a long string of 1s; difficult for the receiver to decode correctly.* Boxed: *A good line coding scheme needs to prevent baseline wandering.* Sheet side 2, \"Baseline, self-synchronization and DC\"."
  },
  {
    "q": "Fill in the blank: the slide defines the DC component (bias) as the ________ amplitude of the waveform.",
    "type": "text",
    "answer": ["mean", "mean amplitude"],
    "explain": "*Mean*. Slide wording (04): *DC component (bias): The mean amplitude of the waveform.* Zero mean = DC balanced or DC free. Sheet side 2, \"Baseline, self-synchronization and DC\"."
  },
  {
    "q": "Fill in the blank: NRZ-I and differential Manchester are classified as ________ encoding.",
    "type": "text",
    "answer": ["differential"],
    "explain": "*Differential*. Slide wording (04): *NRZ-I and differential Manchester are classified as differential encoding.* Plain Manchester is not in that sentence. Sheet side 2, \"The line-coding schemes and their level rules\"."
  },
  {
    "q": "Fill in the blank: bipolar encoding, with its three voltage levels (positive, negative, zero), is also called ________ binary.",
    "type": "text",
    "answer": ["multilevel", "multi-level"],
    "explain": "*Multilevel*. Slide wording (04): *Bipolar (multilevel binary): three voltage levels, positive, negative, zero; one data element at zero, the other alternates between positive and negative.* AMI is the slide's bipolar scheme. Sheet side 2, \"The line-coding schemes and their level rules\"."
  }
]
```

## Bank 3: Weeks 5 and 6

Week 5 converts between analog and digital. PCM turns an analog signal into bits in three steps: sample, quantize, encode.

Digital-to-analog conversion goes the other way. It changes the amplitude, the frequency or the phase of a high-frequency sine wave so that the wave carries bits.

Week 6 shares one link among several signals, which is multiplexing. FDM gives each signal its own band of frequencies, and TDM gives each signal its own time slot.

Week 6 ends on the data-link layer, which moves a frame across one link. ARP finds the link-layer address of the next node from its IP address.

```diagram
{ "type": "flow", "title": "PCM: analog in, bits out", "nodes": [
  { "id": "a", "label": "Analog signal" },
  { "id": "s", "label": "Sample", "sub": "f_s samples per second" },
  { "id": "q", "label": "Quantize", "sub": "round to L levels" },
  { "id": "e", "label": "Encode", "sub": "n_b bits per sample" },
  { "id": "d", "label": "Bits" }
], "edges": [ { "from": "a", "to": "s" }, { "from": "s", "to": "q" }, { "from": "q", "to": "e" }, { "from": "e", "to": "d" } ], "hi": ["s", "q", "e"], "caption": "The PCM encoder's three steps run in this order: sample, then quantize, then encode." }
```

After each miss, find the sentence on *Sheet side 3* and mark it.

```quiz
[
  {
    "q": "Pulse Amplitude Modulation (PAM) is another name for the quantizing process.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (05a): *Pulse Amplitude Modulation (PAM) → another name for sampling process.* The PCM encoder's three steps: sampling (giving the PAM signal), quantizing, encoding. Sheet side 3, \"PCM and sampling (05a)\"."
  },
  {
    "q": "A signal with an infinite bandwidth cannot be sampled: the signal must be bandlimited.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (05a): *A signal with an infinite bandwidth cannot be sampled (the signal must be bandlimited).* Sheet side 3, \"PCM and sampling (05a)\"."
  },
  {
    "q": "Oversampling at f_s = 4f gives a better approximation of the original sine wave than sampling at the Nyquist rate.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (05a), oversampling at 4f: *Same approximation but redundant and unnecessary.* The Nyquist rate 2f already gives *a good approximation of the original sine wave*; undersampling at f *produces a signal that does not look like the original one*. Sheet side 3, \"PCM and sampling (05a)\"."
  },
  {
    "q": "In FSK, the peak amplitude and the phase stay constant for all signal elements while the carrier's frequency changes.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (05b): *The frequency of the carrier signal is changed to represent data … Peak amplitude and phase are constant for all signal elements.* Sheet side 3, \"D2A and A2A side by side\"."
  },
  {
    "q": "QAM combines ASK and FSK.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (05b): *QAM: Combines ASK and PSK. The dominant method of digital-to-analog modulation.* It uses two carriers, one in-phase and the other quadrature. Sheet side 3, \"Digital-to-analog conversion (05b)\"."
  },
  {
    "q": "Multilevel multiplexing is used when the data rate of an input line is a multiple of the others.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (06a): *Multilevel multiplexing: It is a technique used when the data rate of an input line is a multiple of others.* Rates that are not integer multiples need pulse stuffing. Sheet side 3, \"Unequal input rates\"."
  },
  {
    "q": "The quester posts a telemetry batch to the local collector across the LAN. To find the next node's MAC address, the PC runs ARP, one of the auxiliary protocols defined in the data-link layer.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (06b, slide 23): *Address Resolution Protocol (ARP): Useful when moving a frame through a link. One of the auxiliary protocols defined in the network layer. It maps an IP address to a logical-link address.* Sheet side 3, \"ARP\"."
  },
  {
    "q": "Fill in the blank with the slide's term: of the three sampling methods, ________ sampling cannot be easily implemented.",
    "type": "text",
    "answer": ["ideal", "impulse"],
    "explain": "*Ideal*. Slide wording (05a): ideal sampling, *Cannot be easily implemented*; natural sampling *uses a high-speed switch*; flat-top sampling (sample-and-hold) *uses a circuit* and is *the most commonly used method*. Sheet side 3, \"PCM and sampling (05a)\"."
  },
  {
    "q": "Fill in the blank: a high-frequency simple sine wave produced by the sending device, to which the receiver is tuned, is the ________ signal.",
    "type": "text",
    "answer": ["carrier", "carrier frequency"],
    "explain": "*Carrier*. Slide wording (05b): *Carrier signal (carrier frequency): A high-frequency signal produced by the sending device and acts as a base for the information signal. The carrier signal is a simple sine wave. The receiver is tuned to the frequency of the carrier signal.* Sheet side 3, \"Digital-to-analog conversion (05b)\"."
  },
  {
    "q": "Fill in the blank: in the slide's BFSK implementation, the digital signal drives a ________ (three letters), which produces the modulated signal.",
    "type": "text",
    "answer": ["VCO", "voltage-controlled oscillator", "voltage controlled oscillator"],
    "explain": "*VCO (voltage-controlled oscillator)*. Slide wording (05b): *digital signal → VCO (Voltage-controlled oscillator) → modulated signal.* BASK and BPSK use a multiplier and an oscillator instead. Sheet side 3, \"Digital-to-analog conversion (05b)\"."
  },
  {
    "q": "Fill in the blank: bandwidth utilization has two broad categories: multiplexing, whose goal is efficiency, and spectrum spreading, whose goal is ________.",
    "type": "text",
    "answer": ["privacy"],
    "explain": "*Privacy*. Slide wording (06a): *One technique is called 'multiplexing'. Goal: efficiency … Other technique is called 'spectrum spreading'. Goal: privacy.* Sheet side 3, \"Multiplexing, FDM and WDM (06a)\"."
  },
  {
    "q": "Fill in the blank: synchronous TDM is not efficient, because a source with no data leaves its slot in the output frame empty. ________ TDM improves the efficiency by removing the empty slots.",
    "type": "text",
    "answer": ["statistical"],
    "explain": "*Statistical*. Slide wording (06a): *If a source does not have data to send, the corresponding slot in the output frame is empty. Statistical TDM can improve the efficiency by removing the empty slots from the frame.* Sheet side 3, \"Synchronous TDM and E06\"."
  },
  {
    "q": "Fill in the blank: pulse stuffing makes the highest input data rate the ________ data rate and adds dummy bits to the input lines with lower rates.",
    "type": "text",
    "answer": ["dominant"],
    "explain": "*Dominant*. Slide wording (06a): *Pulse stuffing or bit padding or bit stuffing. Used when the bit rates of sources are not integer multiples of each other. Makes the highest input data rate the dominant data rate and then adds dummy bits to the input lines with lower rates.* Sheet side 3, \"Unequal input rates\"."
  },
  {
    "q": "Fill in the blank: the data-link layer has two sublayers: DLC, for issues common to point-to-point and broadcast links, and ________, for issues specific to broadcast (shared) links only.",
    "type": "text",
    "answer": ["MAC", "Media Access Control", "media access control"],
    "explain": "*MAC (Media Access Control)*. Slide wording (06b, slide 11): *Data Link Control (DLC): Deals with issues common to both point-to-point (dedicated) and broadcast (shared) links … Media Access Control (MAC): Deals only with issues specific to broadcast (shared) links.* Sheet side 3, \"The data-link layer (06b)\"."
  }
]
```

## Bank 4: Week 7

Week 7 is about errors on a link. Extra bits travel with the data so that errors can be found, and sometimes fixed.

CRC and the checksum detect errors. A code with enough distance between its codewords can also correct them.

Week 7 then builds frames. A flag marks where each frame starts and ends, and stuffing keeps the data from looking like a flag.

Last come flow control and error control. Stop-and-Wait sends one frame, then waits for the reply before it sends the next.

```diagram
{ "type": "flow", "title": "Week 7 along one link", "nodes": [
  { "id": "d", "label": "Data" },
  { "id": "x", "label": "Add check bits", "sub": "CRC or checksum" },
  { "id": "f", "label": "Frame it", "sub": "flags, stuffing" },
  { "id": "l", "label": "Link", "sub": "noise flips bits" },
  { "id": "r", "label": "Check at receiver", "sub": "keep or discard" }
], "edges": [ { "from": "d", "to": "x" }, { "from": "x", "to": "f" }, { "from": "f", "to": "l" }, { "from": "l", "to": "r" } ], "hi": ["x", "r"], "caption": "The check bits are added before the link and tested after it, so a frame the noise has damaged can be caught." }
```

After each miss, find the sentence on *Sheet side 4* and mark it.

```quiz
[
  {
    "q": "Error correction only looks to see whether any error has occurred; the number of corrupted bits is not important.",
    "type": "tf",
    "answer": false,
    "explain": "False. That sentence defines *detection*. Slide wording (07a, slide 10): *Error correction: The exact number of corrupted bits and their location in the message need to be identified.* And: *The correction of errors is more difficult than the detection.* Sheet side 4, \"Errors and redundancy (07a)\"."
  },
  {
    "q": "Redundant bits are added by the receiver and removed by the sender.",
    "type": "tf",
    "answer": false,
    "explain": "False: the roles are swapped. Slide wording (07a, slide 11): *These redundant bits are added by the sender and removed by the receiver.* Sheet side 4, \"Errors and redundancy (07a)\"."
  },
  {
    "q": "Block coding is one-to-one: the same dataword is always encoded as the same codeword.",
    "type": "tf",
    "answer": true,
    "explain": "True. Slide wording (07a, slide 16): *The block coding process is one-to-one. The same dataword is always encoded as the same codeword.* The 2^n − 2^k unused codewords are *the trick in error detection*. Sheet side 4, \"Block coding, Hamming distance and parity\"."
  },
  {
    "q": "CRC, the subset of cyclic codes the course focuses on, is used mostly at the network and transport layers.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (07a, slide 33): *Cyclic Redundancy Check (CRC), which is used in LANs and WANs.* The checksum is the one *mostly used at the network and transport layers rather than the data-link layer* (slide 41). Sheet side 4, \"CRC and modulo-2 division (07a, 07c)\"."
  },
  {
    "q": "In one's complement arithmetic, the negative zero has all m bits set to 0.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (07a, slide 47): *The positive zero has all m bits set to 0 (0000); the negative zero has all bits set to 1 (it is 2^m−1) (1111).* Sheet side 4, \"Checksum and one's complement\"."
  },
  {
    "q": "A game packet's payload holds the flag byte, so the sender stuffs an ESC in front of it. Whenever the receiver meets an ESC, it removes it and treats the next character as a delimiting flag.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (07b, slide 14): *Whenever the receiver encounters the ESC character, it removes it from the data section and treats the next character as data, not as a delimiting flag.* Sheet side 4, \"Framing, byte stuffing and bit stuffing (07b)\"."
  },
  {
    "q": "Bit stuffing adds one extra 0 whenever six consecutive 1s follow a 0 in the data.",
    "type": "tf",
    "answer": false,
    "explain": "False. Slide wording (07b, slide 19): *Bit stuffing is the process of adding one extra 0 whenever five consecutive 1s follow a 0 in the data, so that the receiver does not mistake the pattern 01111110 for a flag.* Sheet side 4, \"Framing, byte stuffing and bit stuffing (07b)\"."
  },
  {
    "q": "Fill in the blank with the slide's term: the approach of most link-layer protocols for error control is to simply discard the frame and let the ________-layer protocols handle the retransmission of the frame.",
    "type": "text",
    "answer": ["upper"],
    "explain": "*Upper*. Slide wording (07a, slide 4): *The approach of most link-layer protocols for error control → simply discard the frame and let the upper-layer protocols handle the retransmission of the frame.* Sheet side 4, \"Errors and redundancy (07a)\"."
  },
  {
    "q": "Fill in the blank: when 2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1, the error is a ________ error.",
    "type": "text",
    "answer": ["burst"],
    "explain": "*Burst*. Slide wording (07a, slide 6): *2 or more bits in the data unit have changed from 1 to 0 or from 0 to 1 → Burst Error.* Only 1 bit changed is a single-bit error. Sheet side 4, \"Errors and redundancy (07a)\"."
  },
  {
    "q": "Fill in the blank: the number of bits affected by the noise depends on the data rate and the ________ of noise.",
    "type": "text",
    "answer": ["duration"],
    "explain": "*Duration*. Slide wording (07a, slide 7, boxed): *Number of bits affected by the noise depends on the data rate and the duration of noise.* Bits hit = data rate × noise duration: 0.001 s at 1 Mbps hits 1000 bits. Sheet side 4, \"Errors and redundancy (07a)\"."
  },
  {
    "q": "Fill in the blank: in the slide's CRC encoder and decoder figure, the divisor sits between sender and receiver, labelled ________.",
    "type": "text",
    "answer": ["shared"],
    "explain": "*Shared*. Slide 37 draws the divisor d3 d2 d1 d0 between the encoder and the decoder with the red label *Shared*: both sides divide by the same divisor. Sheet side 4, \"CRC and modulo-2 division (07a, 07c)\"."
  },
  {
    "q": "Fill in the blank: the Classic client sends frames to the game server over a lossy link with Stop-and-Wait. After each frame the sender starts a ________; if it expires, the frame is retransmitted.",
    "type": "text",
    "answer": ["timer", "time-out timer", "timeout timer"],
    "explain": "*Timer*. Slide wording (07b, slide 33): *A timer used by the sender (if the timer expires, the frame is retransmitted).* In the FSM the event is *Time-out.* and the action *Resend the saved frame. Restart the timer.* Sheet side 4, \"Flow and error control, Simple and Stop-and-Wait\"."
  },
  {
    "q": "Fill in the blank: Stop-and-Wait handles duplicates and orders by adding a sequence number and an ________ number to the frames.",
    "type": "text",
    "answer": ["acknowledgment", "acknowledgement", "ACK"],
    "explain": "*Acknowledgment*. Slide wording (07b, slide 36): *Duplicates and orders can be handled by adding a sequence number and acknowledgment number to the frames.* *An acknowledgment number always define the sequence number of the next frame to receive.* Sheet side 4, \"Flow and error control, Simple and Stop-and-Wait\"."
  },
  {
    "q": "Fill in the blank: with chunk interleaving, we can afford to let one chunk be missing in each ________.",
    "type": "text",
    "answer": ["packet"],
    "explain": "*Packet*. Slide wording (07a, slide 56): *Not all the chunks belonging to the same packet can be missing. We can afford to let one chunk be missing in each packet.* Sheet side 4, \"Forward error correction (FEC)\"."
  }
]
```

## Remember

- A false statement is a slide sentence with one word swapped: a layer, a direction, a count, sender for receiver, analog for digital.
- A fill-in is marked against the slide's own term, so write that term and put a synonym in brackets.
- A true statement can sound odd and still be the slide's sentence.
- *On the sheet:* every side ends with the same pair, for example *Sheet side 1, "True or false traps, Weeks 1 and 2"* and *Sheet side 1, "Fill-in word bank, Weeks 1 and 2 (slide terms)"*.

| The question says | Formula | Unit | Check |
|---|---|---|---|
| "every 30 ms", "how often", "frequency" | f = 1/T | Hz (1/ms gives kHz) | f × T = 1 |
